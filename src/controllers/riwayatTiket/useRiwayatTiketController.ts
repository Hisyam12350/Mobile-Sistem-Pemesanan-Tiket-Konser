import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';

import { ticketApi, TicketItem } from '@/api/ticketApi';
import {
  LOCAL_PURCHASED_TICKETS_KEY,
  LocalPurchasedTicket,
} from '@/controllers/paymentMethod/usePaymentMethodController';

export interface RiwayatItem {
  id: string;
  ticketId?: string | number;
  kodeUnik?: string;
  orderId?: string;
  rawOrderId?: string;
  qrCodeUrl?: string;
  expiresAt?: string;
  eventId?: string;
  seatLabels?: string;
  categorySummary?: string;
  totalPayment?: number;
  artist: string;
  tour: string;
  date: string;
  time: string;
  venue: string;
  tickets: number;
  status: 'Upcoming' | 'Completed' | 'Canceled';
  isPendingPayment?: boolean;
  scannedAt?: string | null;
  bannerUrl?: string | null;
}

const FALLBACK_RIWAYAT: RiwayatItem[] = [
  {
    id: '1',
    artist: 'Bruno Mars',
    tour: '24K Magic Live',
    date: '28 Sep 2026',
    time: '19:30 WIB',
    venue: 'JIS Jakarta',
    tickets: 2,
    status: 'Upcoming',
  },
  {
    id: '2',
    artist: 'Shella On 7',
    tour: 'Tunggu Aku di Jakarta',
    date: '16 Des 2026',
    time: '20:00 WIB',
    venue: 'JIS Jakarta',
    tickets: 2,
    status: 'Upcoming',
  },
  {
    id: '3',
    artist: 'NIKI',
    tour: 'Buzz World Tour',
    date: '14 Okt 2026',
    time: '19:30 WIB',
    venue: 'Tennis Indoor Senayan',
    tickets: 1,
    status: 'Upcoming',
  },
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agust', 'Sep', 'Okt', 'Nov', 'Des',
];

const formatDateTime = (isoString?: string): { date: string; time: string } => {
  if (!isoString) {
    return { date: '28 Sep 2026', time: '19:30 WIB' };
  }
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return { date: isoString, time: '19:30 WIB' };
    }
    const date = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes} WIB`;
    return { date, time };
  } catch {
    return { date: isoString, time: '19:30 WIB' };
  }
};

const getTicketCount = (item: TicketItem): number => {
  if (item.qty && item.qty > 0) return item.qty;
  return 1;
};

const inferTour = (t: TicketItem): string => {
  if (t.deskripsi) return t.deskripsi.split('.')[0];
  const name = (t.nama_event || '').toLowerCase();
  const cat = t.nama_kategori || t.nama_category;
  if (name.includes('coldplay')) return cat ? `Music of the Spheres (${cat})` : 'Music of the Spheres';
  if (name.includes('taylor')) return cat ? `The Eras Tour (${cat})` : 'The Eras Tour Live';
  if (name.includes('billie')) return cat ? `Hit Me Hard and Soft (${cat})` : 'Hit Me Hard and Soft Tour';
  if (name.includes('dua lipa')) return cat ? `Radical Optimism (${cat})` : 'Radical Optimism Tour';
  if (cat) return `24K Magic Live • ${cat}`;
  return '24K Magic Live';
};

const inferVenue = (t: TicketItem): string => {
  if (t.lokasi) return t.lokasi;
  const name = (t.nama_event || '').toLowerCase();
  if (name.includes('coldplay') || name.includes('taylor')) return 'Gelora Bung Karno Stadium';
  if (name.includes('billie')) return 'Indonesia Arena';
  if (name.includes('dua lipa')) return 'ICE BSD City';
  return 'JIS Jakarta';
};

export function useRiwayatTiketController() {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Canceled'>('Upcoming');
  const [tickets, setTickets] = useState<RiwayatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTickets = useCallback(async () => {
    try {
      const [res, localRaw] = await Promise.all([
        ticketApi.getMyTickets(),
        AsyncStorage.getItem(LOCAL_PURCHASED_TICKETS_KEY).catch(() => null),
      ]);

      let localMapped: RiwayatItem[] = [];
      if (localRaw) {
        try {
          const parsedLocal: LocalPurchasedTicket[] = JSON.parse(localRaw);
          if (Array.isArray(parsedLocal)) {
            const dbOrderIds = new Set(
              (res || [])
                .map(t => (t.order_id ? String(t.order_id) : ''))
                .filter(Boolean)
            );
            const now = Date.now();
            let hasLocalUpdates = false;

            const updatedLocal = parsedLocal.map(lt => {
              if (lt.rawOrderId && dbOrderIds.has(String(lt.rawOrderId)) && lt.paymentStatus === 'Pending') {
                hasLocalUpdates = true;
                return { ...lt, paymentStatus: 'Paid' as const };
              }
              if (
                lt.paymentStatus === 'Pending' &&
                lt.expiresAt &&
                new Date(lt.expiresAt).getTime() <= now
              ) {
                hasLocalUpdates = true;
                return { ...lt, paymentStatus: 'Expired' as const };
              }
              return lt;
            });

            if (hasLocalUpdates) {
              await AsyncStorage.setItem(
                LOCAL_PURCHASED_TICKETS_KEY,
                JSON.stringify(updatedLocal)
              ).catch(() => {});
            }

            localMapped = updatedLocal
              // Hide local records whose order already has authoritative tickets in DB to avoid duplicates
              .filter(lt => !(lt.rawOrderId && dbOrderIds.has(String(lt.rawOrderId))))
              .map(lt => {
                const [datePart, timePart] = (
                  lt.dateTime || '25 Des 2026 · 19:30 WIB'
                )
                  .split('·')
                  .map(s => s.trim());

                const isPending = lt.paymentStatus === 'Pending';
                const isExpired = lt.paymentStatus === 'Expired';

                return {
                  id: lt.id,
                  orderId: lt.orderId,
                  rawOrderId: lt.rawOrderId,
                  qrCodeUrl: lt.qrCodeUrl,
                  expiresAt: lt.expiresAt,
                  eventId: lt.eventId,
                  seatLabels: lt.seatLabels,
                  categorySummary: lt.categorySummary,
                  totalPayment: lt.totalPayment,
                  artist: lt.artist || 'Bruno Mars',
                  tour: lt.tour || '24K Magic Live',
                  date: datePart || '25 Des 2026',
                  time: timePart || '19:30 WIB',
                  venue: lt.venue || 'JIS Jakarta',
                  tickets: lt.ticketsCount || 1,
                  status: isExpired ? 'Canceled' : 'Upcoming',
                  isPendingPayment: isPending,
                };
              });
          }
        } catch {
          // Ignore malformed local storage
        }
      }

      if (res && res.length > 0) {
        const mapped: RiwayatItem[] = res.map((t, idx) => {
          const { date, time } = formatDateTime(t.waktu_event);
          const status: 'Upcoming' | 'Completed' | 'Canceled' =
            t.scanned_at
              ? 'Completed'
              : (t.status_tiket || '').toLowerCase() === 'cancelled' ||
                  (t.status_tiket || '').toLowerCase() === 'canceled'
                ? 'Canceled'
                : 'Upcoming';
          return {
            id: String(t.id || idx),
            ticketId: t.id,
            kodeUnik: t.kode_unik,
            eventId: t.event_id ? String(t.event_id) : undefined,
            rawOrderId: t.order_id ? String(t.order_id) : undefined,
            orderId: t.order_id
              ? `CX-240S28-${String(t.order_id).padStart(4, '0')}`
              : undefined,
            seatLabels: t.nomor_kursi || undefined,
            categorySummary: t.nama_kategori || t.nama_category || undefined,
            artist: t.nama_event || 'Bruno Mars',
            tour: inferTour(t),
            date,
            time,
            venue: inferVenue(t),
            tickets: getTicketCount(t),
            status,
            scannedAt: t.scanned_at || null,
            bannerUrl: t.banner_url || null,
          };
        });
        setTickets([...localMapped, ...mapped]);
      } else {
        setTickets([...localMapped, ...FALLBACK_RIWAYAT]);
      }
    } catch {
      setTickets(FALLBACK_RIWAYAT);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshTickets();
    }, [refreshTickets])
  );

  const getTicketPoster = (item: RiwayatItem) => {
    if (item.bannerUrl) {
      return { uri: item.bannerUrl };
    }
    const artist = (item.artist || '').toLowerCase();
    const tour = (item.tour || '').toLowerCase();
    if (tour.includes('risk it all')) {
      return require('@/assets/images/bruno-mars-sketch.png');
    }
    if (artist.includes('coldplay')) {
      return require('@/assets/images/coldplay-banner.png');
    }
    return require('@/assets/images/bruno-mars-poster.png');
  };

  const handleTabPress = (tab: 'Upcoming' | 'Completed' | 'Canceled') => {
    setActiveTab(tab);
  };

  const handleBottomTabPress = (tab: 'Home' | 'Search' | 'Tickets' | 'Profile') => {
    if (tab === 'Tickets') {
      return;
    }
    if (tab === 'Profile') {
      (router as any).push('/profile');
      return;
    }
    if (tab === 'Search') {
      (router as any).push('/search');
      return;
    }
    (router as any).replace('/home');
  };

  const handleOpenDetail = (id: string) => {
    const found = tickets.find(t => t.id === id);
    if (!found) return;

    // If this transaction is Pending QRIS payment, check expiry and reopen the exact same QRIS code
    if (found.isPendingPayment) {
      const expMs = found.expiresAt ? new Date(found.expiresAt).getTime() : 0;
      if (expMs > Date.now()) {
        (router as any).push({
          pathname: '/payment-method',
          params: {
            id: found.eventId || '77',
            artist: found.artist,
            tour: found.tour,
            dateTime: `${found.date} · ${found.time}`,
            venue: found.venue,
            seatLabels: found.seatLabels || 'VIP A1, A2',
            categorySummary: found.categorySummary || `VIP (${found.tickets})`,
            totalPayment: String(found.totalPayment || 54150000),
            resumeOrderId: found.orderId || found.id,
            autoOpenQris: '1',
          },
        });
        return;
      }

      // Expired right now: mark as Canceled locally
      setTickets(prev =>
        prev.map(t =>
          t.id === found.id
            ? { ...t, status: 'Canceled', isPendingPayment: false }
            : t
        )
      );
      Alert.alert(
        'Masa Berlaku QRIS Habis',
        'Transaksi ini telah melewati batas waktu pembayaran QRIS 15 menit dan otomatis dibatalkan.'
      );
      return;
    }

    if (found.status === 'Canceled') {
      Alert.alert(
        'Tiket Tidak Aktif',
        'Transaksi atau tiket ini telah dibatalkan / melewati batas waktu pembayaran sehingga E-Ticket tidak dapat digunakan.'
      );
      return;
    }

    const fallbackSeatLabels =
      found.seatLabels ||
      Array.from({ length: Math.max(1, found.tickets) }, (_, i) => `A${i + 1}`).join(', ');

    (router as any).push({
      pathname: '/e-ticket',
      params: {
        id: found.eventId || '',
        ticketId: found.ticketId ? String(found.ticketId) : '',
        kodeUnik: found.kodeUnik || '',
        orderId: found.orderId || `CX-240S28-${found.id.padStart(4, '0')}`,
        rawOrderId: found.rawOrderId || '',
        artist: found.artist,
        tour: found.tour,
        dateTime: `${found.date} · ${found.time}`,
        venue: found.venue,
        seatLabels: fallbackSeatLabels,
        categorySummary: found.categorySummary || `VIP (${found.tickets})`,
        totalTickets: String(found.tickets),
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/home');
    }
  };

  const filteredTickets = tickets.filter(t => t.status === activeTab);

  return {
    activeTab,
    tickets,
    filteredTickets,
    isLoading,
    getTicketPoster,
    handleTabPress,
    handleBottomTabPress,
    handleOpenDetail,
    handleBack,
  };
}
