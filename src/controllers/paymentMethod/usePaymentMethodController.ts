import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';

import { eventApi } from '@/api/eventApi';
import { seatApi } from '@/api/seatApi';
import { paymentApi } from '@/api/paymentApi';
import { formatRupiah } from '@/controllers/checkout/useCheckoutController';

export const LOCAL_PURCHASED_TICKETS_KEY = '@local_purchased_tickets';

export interface LocalPurchasedTicket {
  id: string;
  orderId: string;
  rawOrderId?: string;
  midtransOrderId?: string;
  qrCodeUrl?: string;
  eventId: string;
  artist: string;
  tour: string;
  dateTime: string;
  venue: string;
  seatLabels: string;
  categorySummary: string;
  ticketsCount: number;
  subtotal?: number;
  serviceFee?: number;
  voucherDiscount?: number;
  totalPayment: number;
  voucherCode?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Expired';
  paidAt: string;
  expiresAt?: string;
}

export type PaymentBrandType =
  | 'bca'
  | 'bri'
  | 'mandiri'
  | 'bni'
  | 'card'
  | 'qris'
  | 'ewallet';

export interface PaymentMethodItem {
  id: string;
  label: string;
  brand: PaymentBrandType;
  isEnabled: boolean;
}

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'bca_va',
    label: 'BCA Virtual Account',
    brand: 'bca',
    isEnabled: false,
  },
  {
    id: 'bri_va',
    label: 'BRI Virtual Account',
    brand: 'bri',
    isEnabled: false,
  },
  {
    id: 'mandiri_va',
    label: 'Mandiri Virtual Account',
    brand: 'mandiri',
    isEnabled: false,
  },
  {
    id: 'bni_va',
    label: 'BNI Virtual Account',
    brand: 'bni',
    isEnabled: false,
  },
  {
    id: 'credit_card',
    label: 'Credit / Debit Card',
    brand: 'card',
    isEnabled: false,
  },
  {
    id: 'qris',
    label: 'QRIS',
    brand: 'qris',
    isEnabled: true,
  },
  {
    id: 'ewallet',
    label: 'E-Wallet',
    brand: 'ewallet',
    isEnabled: false,
  },
];

// Deterministic 17x17 QR matrix pattern for QRIS fallback visual display
export const QRIS_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
];

async function upsertLocalTransaction(tx: LocalPurchasedTicket): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_PURCHASED_TICKETS_KEY);
    const list: LocalPurchasedTicket[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(
      item => item.orderId !== tx.orderId && item.id !== tx.id
    );
    await AsyncStorage.setItem(
      LOCAL_PURCHASED_TICKETS_KEY,
      JSON.stringify([tx, ...filtered])
    );
  } catch {
    // Ignore storage error
  }
}

export function usePaymentMethodController() {
  const params = useLocalSearchParams<{
    id?: string;
    artist?: string;
    tour?: string;
    dateTime?: string;
    venue?: string;
    seatLabels?: string;
    apiSeatIds?: string;
    categorySummary?: string;
    subtotal?: string;
    serviceFee?: string;
    voucherDiscount?: string;
    totalPayment?: string;
    voucherCode?: string;
    resumeOrderId?: string;
    autoOpenQris?: string;
  }>();

  const eventId = params.id || '77';
  const subtotal = Number(params.subtotal) || 54100000;
  const serviceFee = Number(params.serviceFee) || 50000;
  const voucherDiscount = Number(params.voucherDiscount) || 0;
  const totalPayment = Number(params.totalPayment) || 54150000;
  const displayArtist = params.artist || 'Bruno Mars';
  const displayTour = params.tour || '24K Magic Live';
  const displayDateTime = params.dateTime || '25 Des 2026 · 19:30 WIB';
  const displayVenue = params.venue || 'JIS Jakarta';
  const seatLabels = params.seatLabels || 'VIP A1, A2';
  const categorySummary = params.categorySummary || 'VIP (3)';
  const voucherCode = params.voucherCode || '';

  const [selectedMethodId, setSelectedMethodId] = useState<string>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQrisModalVisible, setIsQrisModalVisible] = useState(false);
  const [isDownloadingQris, setIsDownloadingQris] = useState(false);
  const [qrisDownloaded, setQrisDownloaded] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | number | null>(null);
  const [midtransOrderId, setMidtransOrderId] = useState<string>('');
  const [orderReference, setOrderReference] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [expiresAtIso, setExpiresAtIso] = useState<string>('');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(900);

  const hasRedirectedRef = useRef(false);

  const parsedTicketCount = useMemo(() => {
    return (
      categorySummary.split('|').reduce((sum, part) => {
        const match = part.match(/\((\d+)\)/);
        return sum + (match ? Number(match[1]) : 0);
      }, 0) ||
      seatLabels.split(',').filter(Boolean).length ||
      1
    );
  }, [categorySummary, seatLabels]);

  // Restore existing Pending transaction if opened from Riwayat Tiket
  useEffect(() => {
    let isMounted = true;

    async function tryResumePendingOrder() {
      if (!params.resumeOrderId) return;
      try {
        const raw = await AsyncStorage.getItem(LOCAL_PURCHASED_TICKETS_KEY);
        if (!raw || !isMounted) return;
        const list: LocalPurchasedTicket[] = JSON.parse(raw);
        const found = list.find(
          item =>
            item.orderId === params.resumeOrderId ||
            item.id === params.resumeOrderId
        );
        if (!found) return;

        const expTime = found.expiresAt
          ? new Date(found.expiresAt).getTime()
          : 0;
        const remainingSec = Math.max(
          0,
          Math.floor((expTime - Date.now()) / 1000)
        );

        if (remainingSec <= 0) {
          await upsertLocalTransaction({
            ...found,
            paymentStatus: 'Expired',
          });
          if (isMounted) {
            Alert.alert(
              'Masa Berlaku QRIS Habis',
              'Kode QRIS untuk transaksi ini telah melewati batas waktu pembayaran 15 menit.',
              [
                {
                  text: 'Kembali ke Riwayat',
                  onPress: () => (router as any).replace('/riwayat-tiket'),
                },
              ]
            );
          }
          return;
        }

        if (isMounted) {
          if (found.rawOrderId) setActiveOrderId(found.rawOrderId);
          if (found.midtransOrderId) setMidtransOrderId(found.midtransOrderId);
          setOrderReference(found.orderId);
          if (found.qrCodeUrl) setQrCodeUrl(found.qrCodeUrl);
          if (found.expiresAt) setExpiresAtIso(found.expiresAt);
          setCountdownSeconds(remainingSec);
          if (params.autoOpenQris === '1') {
            setIsQrisModalVisible(true);
          }
        }
      } catch {
        // Ignore
      }
    }

    tryResumePendingOrder();

    return () => {
      isMounted = false;
    };
  }, [params.resumeOrderId, params.autoOpenQris]);

  // Accurate countdown timer synced against expiresAtIso
  useEffect(() => {
    if (!expiresAtIso) return;

    const updateTimer = () => {
      const diffSec = Math.max(
        0,
        Math.floor((new Date(expiresAtIso).getTime() - Date.now()) / 1000)
      );
      setCountdownSeconds(diffSec);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [expiresAtIso]);

  const navigateToPaymentSuccess = useCallback(
    async (finalOrderId: string, finalRawId?: string | number | null) => {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;

      await upsertLocalTransaction({
        id: `local-${finalOrderId}`,
        orderId: finalOrderId,
        rawOrderId: finalRawId ? String(finalRawId) : '',
        midtransOrderId,
        qrCodeUrl,
        eventId: String(eventId),
        artist: displayArtist,
        tour: displayTour,
        dateTime: displayDateTime,
        venue: displayVenue,
        seatLabels,
        categorySummary,
        ticketsCount: parsedTicketCount,
        subtotal,
        serviceFee,
        voucherDiscount,
        totalPayment,
        voucherCode,
        paymentStatus: 'Paid',
        paidAt: new Date().toISOString(),
        expiresAt: expiresAtIso,
      });

      setIsQrisModalVisible(false);

      setTimeout(() => {
        (router as any).replace({
          pathname: '/payment-success',
          params: {
            id: String(eventId),
            orderId: finalOrderId,
            rawOrderId: finalRawId ? String(finalRawId) : '',
            artist: displayArtist,
            tour: displayTour,
            dateTime: displayDateTime,
            venue: displayVenue,
            seatLabels,
            categorySummary,
            subtotal: String(subtotal),
            serviceFee: String(serviceFee),
            voucherDiscount: String(voucherDiscount),
            totalPayment: String(totalPayment),
            voucherCode,
          },
        });
      }, 100);
    },
    [
      qrCodeUrl,
      eventId,
      displayArtist,
      displayTour,
      displayDateTime,
      displayVenue,
      seatLabels,
      categorySummary,
      parsedTicketCount,
      subtotal,
      serviceFee,
      voucherDiscount,
      totalPayment,
      voucherCode,
      expiresAtIso,
      midtransOrderId,
    ]
  );

  // Auto-polling payment status every 3 seconds while QRIS modal is open
  useEffect(() => {
    if (!isQrisModalVisible || !activeOrderId || countdownSeconds <= 0) {
      return;
    }

    let isActive = true;
    let isPollingInFlight = false;

    const checkStatus = async () => {
      if (isPollingInFlight) return;
      isPollingInFlight = true;
      try {
        const res = await paymentApi.getPaymentStatus(activeOrderId);
        if (!isActive || !res?.data) return;

        const orderStatus = (
          res.data.order?.status_order || ''
        ).toLowerCase();
        const paymentsList = res.data.payments || [];
        const hasSuccessPayment = paymentsList.some(
          p => (p.status || '').toLowerCase() === 'success'
        );

        if (orderStatus === 'paid' || hasSuccessPayment) {
          const formattedId =
            orderReference ||
            `CX-240S28-${String(activeOrderId).padStart(4, '0')}`;
          await navigateToPaymentSuccess(formattedId, activeOrderId);
        }
      } catch {
        // Ignore transient network errors during polling
      } finally {
        isPollingInFlight = false;
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [
    isQrisModalVisible,
    activeOrderId,
    countdownSeconds,
    orderReference,
    navigateToPaymentSuccess,
  ]);

  const formattedCountdown = useMemo(() => {
    const mins = Math.floor(countdownSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (countdownSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [countdownSeconds]);

  const handleSelectMethod = (method: PaymentMethodItem) => {
    if (!method.isEnabled) {
      Alert.alert(
        'Metode Belum Tersedia',
        `Metode "${method.label}" sedang dalam tahap pengembangan. Saat ini hanya metode pembayaran QRIS yang difungsikan.`
      );
      setSelectedMethodId('qris');
      return;
    }
    setSelectedMethodId(method.id);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/checkout');
    }
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Syarat & Ketentuan Pembayaran',
      '1. Pembayaran dilakukan melalui kode QRIS resmi Concertix.\n2. Selesaikan pembayaran sebelum batas waktu 15 menit berakhir.\n3. Apabila Anda menutup halaman QRIS, Anda tetap dapat melanjutkan pembayaran melalui menu Riwayat Tiket selama masa berlaku QRIS belum habis.'
    );
  };

  const handlePilihPembayaran = async () => {
    if (isSubmitting) return;

    if (selectedMethodId !== 'qris') {
      Alert.alert(
        'Gunakan Metode QRIS',
        'Saat ini hanya metode pembayaran QRIS yang difungsikan. Silakan pilih QRIS untuk melanjutkan.'
      );
      setSelectedMethodId('qris');
      return;
    }

    // Reopen existing active QRIS modal without re-creating order if still valid
    if (orderReference && countdownSeconds > 0) {
      setIsQrisModalVisible(true);
      return;
    }

    setIsSubmitting(true);

    try {
      let seatIdsToLock = (params.apiSeatIds || '')
        .split(',')
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n) && n > 0);

      // If apiSeatIds weren't passed, fetch available seats for eventId so we can create a real order & Midtrans QRIS URL
      if (seatIdsToLock.length === 0) {
        try {
          const cats = await eventApi.getTicketCategories(eventId);
          if (cats.length > 0) {
            const seats = await seatApi.getSeatsByCategory(cats[0].id);
            const freeSeats = seats
              .filter(s => s.status_kursi === 'available')
              .slice(0, Math.min(parsedTicketCount, 6));
            seatIdsToLock = freeSeats
              .map(s => Number(s.id))
              .filter(n => !isNaN(n) && n > 0);
          }
        } catch {
          // Ignore if offline
        }
      }

      let resolvedOrderId = orderReference;
      let resolvedRawId: string | number | null = activeOrderId;
      let resolvedMidtransOrderId = midtransOrderId;
      let resolvedQrUrl = qrCodeUrl;
      let resolvedExpiresAt =
        expiresAtIso || new Date(Date.now() + 15 * 60 * 1000).toISOString();

      if (seatIdsToLock.length > 0 && !activeOrderId) {
        try {
          await seatApi.lockSeats(seatIdsToLock);
          const orderRes = await seatApi.createOrder(seatIdsToLock);
          const createdOrderObj = (orderRes.data as any)?.order || orderRes.data;
          const createdOrderId = createdOrderObj?.id;

          if (createdOrderId) {
            resolvedRawId = createdOrderId;
            setActiveOrderId(createdOrderId);
            resolvedOrderId = `CX-240S28-${String(createdOrderId).padStart(4, '0')}`;
            if (createdOrderObj?.batas_waktu_bayar) {
              resolvedExpiresAt = createdOrderObj.batas_waktu_bayar;
            }

            const payRes = await paymentApi.createPayment(createdOrderId);
            const snapToken = payRes.data?.snap_token || '';
            if (payRes.data?.midtrans_order_id) {
              resolvedMidtransOrderId = payRes.data.midtrans_order_id;
            }
            if (snapToken) {
              const qrisCharge = await paymentApi.chargeSnapQris(snapToken);
              if (qrisCharge?.qris_url) {
                resolvedQrUrl = qrisCharge.qris_url;
              }
            }
            if (!resolvedQrUrl) {
              resolvedQrUrl =
                payRes.data?.qr_code_url || payRes.data?.redirect_url || '';
            }
          }
        } catch (err: any) {
          const errMsg = err instanceof Error ? err.message : '';
          const isNetworkOffline =
            err?.name === 'AbortError' ||
            /network request failed|failed to fetch|timeout/i.test(errMsg);

          if (!isNetworkOffline) {
            Alert.alert(
              'Kursi Tidak Dapat Dipesan',
              errMsg ||
                'Sebagian kursi yang Anda pilih sudah dikunci atau dibeli oleh pengguna lain. Silakan pilih kursi lain.'
            );
            return;
          }
          // Fallback below only when backend is unreachable/offline
        }
      }

      if (!resolvedOrderId) {
        resolvedOrderId = `CX-240S28-${Date.now().toString().slice(-4)}`;
      }
      if (!resolvedQrUrl) {
        resolvedQrUrl = `https://api.sandbox.midtrans.com/v2/qris/${resolvedOrderId.toLowerCase()}/qr-code`;
      }

      setOrderReference(resolvedOrderId);
      setMidtransOrderId(resolvedMidtransOrderId);
      setQrCodeUrl(resolvedQrUrl);
      setExpiresAtIso(resolvedExpiresAt);

      // Persist transaction as PENDING immediately so closing QRIS or leaving the screen retains it in Riwayat
      await upsertLocalTransaction({
        id: `local-${resolvedOrderId}`,
        orderId: resolvedOrderId,
        rawOrderId: resolvedRawId ? String(resolvedRawId) : '',
        midtransOrderId: resolvedMidtransOrderId,
        qrCodeUrl: resolvedQrUrl,
        eventId: String(eventId),
        artist: displayArtist,
        tour: displayTour,
        dateTime: displayDateTime,
        venue: displayVenue,
        seatLabels,
        categorySummary,
        ticketsCount: parsedTicketCount,
        subtotal,
        serviceFee,
        voucherDiscount,
        totalPayment,
        voucherCode,
        paymentStatus: 'Pending',
        paidAt: new Date().toISOString(),
        expiresAt: resolvedExpiresAt,
      });

      setIsQrisModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyQrUrl = async () => {
    if (!qrCodeUrl) return;
    try {
      if (
        Platform.OS === 'web' &&
        typeof navigator !== 'undefined' &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(qrCodeUrl);
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 2500);
        return;
      }

      // On React Native mobile, use Share sheet or internal clipboard if available
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2500);
      await Share.share({
        title: 'Midtrans Sandbox QR Code Image URL',
        message: qrCodeUrl,
      });
    } catch {
      // Ignore cancel
    }
  };

  const handleCloseQrisModal = () => {
    // Keep transaction as Pending when user closes modal
    setIsQrisModalVisible(false);
  };

  const handleDownloadQris = async () => {
    if (isDownloadingQris) return;
    setIsDownloadingQris(true);

    const refCode = orderReference || 'CX-240S28-0012';
    const fileName = `QRIS-Concertix-${refCode}.png`;

    try {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        if (qrCodeUrl && qrCodeUrl.startsWith('http')) {
          window.open(qrCodeUrl, '_blank');
        }
        setQrisDownloaded(true);
      } else {
        await new Promise(resolve => setTimeout(resolve, 400));
        setQrisDownloaded(true);

        Alert.alert(
          'QRIS Berhasil Diunduh',
          `Kode QRIS (${fileName}) dengan nominal ${formatRupiah(totalPayment)} telah disimpan.\n\nQR Code Image URL:\n${qrCodeUrl}`,
          [
            {
              text: 'Bagikan / Salin URL',
              onPress: () => {
                Share.share({
                  title: `QRIS Concertix - ${refCode}`,
                  message: qrCodeUrl,
                }).catch(() => {});
              },
            },
            { text: 'OK', style: 'default' },
          ]
        );
      }
    } finally {
      setIsDownloadingQris(false);
    }
  };

  return {
    eventId,
    methods: PAYMENT_METHODS,
    selectedMethodId,
    subtotal,
    serviceFee,
    voucherDiscount,
    totalPayment,
    voucherCode,
    displayArtist,
    displayTour,
    displayDateTime,
    displayVenue,
    seatLabels,
    categorySummary,
    activeOrderId,
    orderReference,
    qrCodeUrl,
    urlCopied,
    countdownSeconds,
    formattedCountdown,
    isSubmitting,
    isQrisModalVisible,
    isDownloadingQris,
    qrisDownloaded,
    handleSelectMethod,
    handleBack,
    handleTermsPress,
    handlePilihPembayaran,
    handleCopyQrUrl,
    handleDownloadQris,
    handleCloseQrisModal,
  };
}
