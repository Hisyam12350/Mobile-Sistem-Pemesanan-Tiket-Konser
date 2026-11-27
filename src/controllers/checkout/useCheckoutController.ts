import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { eventApi, EventItem } from '@/api/eventApi';
import { seatApi } from '@/api/seatApi';

export interface VoucherOption {
  code: string;
  label: string;
  discount: number;
}

const AVAILABLE_VOUCHERS: VoucherOption[] = [
  { code: 'CONCERTIX50', label: 'Diskon Rp.50.000 (CONCERTIX50)', discount: 50000 },
  { code: 'KONSER100K', label: 'Diskon Rp.100.000 (KONSER100K)', discount: 100000 },
];

const SERVICE_FEE = 50000;

const MONTHS_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agust', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatEventDateTime(isoString?: string): string {
  if (!isoString) return '25 Des 2026 · 19:30 WIB';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return `${isoString} · 19:30 WIB`;
    }
    const day = d.getDate();
    const month = MONTHS_ID[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const timeStr = hours === '00' && minutes === '00' ? '19:30' : `${hours}:${minutes}`;
    return `${day} ${month} ${year} · ${timeStr} WIB`;
  } catch {
    return '25 Des 2026 · 19:30 WIB';
  }
}

export function formatRupiah(amount: number): string {
  return `Rp.${Math.max(0, amount).toLocaleString('id-ID')}`;
}

export function useCheckoutController() {
  const params = useLocalSearchParams<{
    id?: string;
    seatLabels?: string;
    apiSeatIds?: string;
    categorySummary?: string;
    subtotal?: string;
    totalTickets?: string;
  }>();

  const eventId = params.id || '77';
  const subtotal = Number(params.subtotal) || 54100000;
  const totalTickets = Number(params.totalTickets) || 3;

  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isVoucherOpen, setIsVoucherOpen] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    eventApi
      .getEventById(eventId)
      .then(res => {
        if (isMounted && res) {
          setEventData(res);
        }
      })
      .catch(() => {
        // Fallback event display is used
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const categoryLines = useMemo(() => {
    if (params.categorySummary) {
      const parts = params.categorySummary
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);
      if (parts.length > 0) return parts;
    }
    return ['VIP (3)', 'Festival (3)'];
  }, [params.categorySummary]);

  const seatDisplay = useMemo(() => {
    if (params.seatLabels && params.seatLabels.trim()) {
      const raw = params.seatLabels.trim();
      const firstCatName = categoryLines[0]?.split('(')[0]?.trim() || 'VIP';
      if (!raw.toLowerCase().startsWith(firstCatName.toLowerCase())) {
        return `${firstCatName} ${raw}`;
      }
      return raw;
    }
    return 'VIP A1, A2';
  }, [params.seatLabels, categoryLines]);

  const serviceFee = SERVICE_FEE;
  const voucherDiscount = selectedVoucher?.discount || 0;
  const totalPayment = Math.max(0, subtotal + serviceFee - voucherDiscount);

  const displayArtist = eventData?.nama_event || 'Bruno Mars';
  const displayTour = useMemo(() => {
    if (eventData?.deskripsi) {
      return eventData.deskripsi.split('.')[0];
    }
    const lower = displayArtist.toLowerCase();
    if (lower.includes('coldplay')) return 'Music of the Spheres';
    if (lower.includes('taylor')) return 'The Eras Tour Live';
    if (lower.includes('billie')) return 'Hit Me Hard and Soft Tour';
    if (lower.includes('dua lipa')) return 'Radical Optimism Tour';
    return '24K Magic Live';
  }, [eventData, displayArtist]);

  const displayDateTime = useMemo(
    () => formatEventDateTime(eventData?.waktu_event),
    [eventData?.waktu_event]
  );

  const displayVenue = useMemo(() => {
    if (!eventData?.lokasi) return 'JIS Jakarta';
    if (eventData.lokasi.toLowerCase().includes('jakarta international')) {
      return 'JIS Jakarta';
    }
    return eventData.lokasi;
  }, [eventData?.lokasi]);

  const getEventPoster = () => {
    if (eventData?.banner_url) {
      return { uri: eventData.banner_url };
    }
    const name = displayArtist.toLowerCase();
    const desc = (eventData?.deskripsi || '').toLowerCase();
    const loc = (eventData?.lokasi || '').toLowerCase();

    if (desc.includes('risk it all') || loc.includes('surabaya')) {
      return require('@/assets/images/bruno-mars-sketch.png');
    }
    if (name.includes('coldplay')) {
      return require('@/assets/images/coldplay-banner.png');
    }
    return require('@/assets/images/bruno-mars-poster.png');
  };

  const toggleDetailOpen = () => setIsDetailOpen(prev => !prev);
  const toggleVoucherOpen = () => setIsVoucherOpen(prev => !prev);

  const handleVoucherPress = () => {
    Alert.alert(
      'Pilih Kode Voucher',
      'Pilih voucher promo yang ingin digunakan untuk pesanan ini:',
      [
        ...AVAILABLE_VOUCHERS.map(v => ({
          text: v.label,
          onPress: () => setSelectedVoucher(v),
        })),
        ...(selectedVoucher
          ? [
              {
                text: 'Hapus Voucher',
                style: 'destructive' as const,
                onPress: () => setSelectedVoucher(null),
              },
            ]
          : []),
        { text: 'Batal', style: 'cancel' as const },
      ]
    );
  };

  const handleBack = () => {
    const apiIds = (params.apiSeatIds || '')
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
    if (apiIds.length > 0) {
      seatApi.unlockSeats(apiIds).catch(() => {});
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/seat-map');
    }
  };

  const handlePilihPembayaran = () => {
    if (isSubmitting) return;

    const summaryCategories = categoryLines.join(', ');
    const voucherInfo = selectedVoucher
      ? `\nVoucher: -${formatRupiah(selectedVoucher.discount)} (${selectedVoucher.code})`
      : '';

    Alert.alert(
      'Konfirmasi Pesanan',
      `Pastikan detail pesanan Anda sudah benar sebelum memilih metode pembayaran:\n\nEvent: ${displayArtist} — ${displayTour}\nKategori: ${summaryCategories}\nKursi: ${seatDisplay}\nSubtotal: ${formatRupiah(subtotal)}\nBiaya Layanan: ${formatRupiah(serviceFee)}${voucherInfo}\nTotal Pembayaran: ${formatRupiah(totalPayment)}`,
      [
        { text: 'Periksa Lagi', style: 'cancel' },
        {
          text: 'Lanjut Pembayaran',
          onPress: () => {
            setIsSubmitting(false);
            (router as any).push({
              pathname: '/payment-method',
              params: {
                id: String(eventId),
                artist: displayArtist,
                tour: displayTour,
                dateTime: displayDateTime,
                venue: displayVenue,
                seatLabels: seatDisplay,
                apiSeatIds: params.apiSeatIds || '',
                categorySummary: categoryLines.join('|'),
                subtotal: String(subtotal),
                serviceFee: String(serviceFee),
                voucherDiscount: String(voucherDiscount),
                totalPayment: String(totalPayment),
                voucherCode: selectedVoucher?.code || '',
              },
            });
          },
        },
      ]
    );
  };

  return {
    eventId,
    displayArtist,
    displayTour,
    displayDateTime,
    displayVenue,
    categoryLines,
    seatDisplay,
    totalTickets,
    subtotal,
    serviceFee,
    voucherDiscount,
    totalPayment,
    selectedVoucher,
    isDetailOpen,
    isVoucherOpen,
    isSubmitting,
    getEventPoster,
    toggleDetailOpen,
    toggleVoucherOpen,
    handleVoucherPress,
    handleBack,
    handlePilihPembayaran,
  };
}
