import { useEffect, useState } from 'react';
import { router } from 'expo-router';

import { ticketApi, TicketItem } from '@/api/ticketApi';

export interface RiwayatItem {
  id: string;
  artist: string;
  tour: string;
  date: string;
  time: string;
  venue: string;
  tickets: number;
  status: 'Upcoming' | 'Completed' | 'Canceled';
  scannedAt?: string | null;
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

export function useRiwayatTiketController() {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Canceled'>('Upcoming');
  const [tickets, setTickets] = useState<RiwayatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTickets() {
      try {
        const res = await ticketApi.getMyTickets();
        if (isMounted && res && res.length > 0) {
          const mapped: RiwayatItem[] = res.map((t, idx) => {
            const { date, time } = formatDateTime(t.waktu_event);
            const status: 'Upcoming' | 'Completed' | 'Canceled' =
              t.scanned_at
                ? 'Completed'
                : (t.status_tiket || '').toLowerCase() === 'canceled'
                  ? 'Canceled'
                  : 'Upcoming';
            return {
              id: String(t.id || idx),
              artist: (t as any).nama_event || 'Bruno Mars',
              tour: (t as any).deskripsi || '24K Magic Live',
              date,
              time,
              venue: (t as any).lokasi || 'JIS Jakarta',
              tickets: getTicketCount(t),
              status,
              scannedAt: t.scanned_at || null,
            };
          });
          setTickets(mapped);
        } else if (isMounted) {
          setTickets(FALLBACK_RIWAYAT);
        }
      } catch (err) {
        console.warn('Error loading riwayat tiket:', err);
        if (isMounted) {
          setTickets(FALLBACK_RIWAYAT);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleOpenDetail = (_id: string) => {
    // No-op for now
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
    handleTabPress,
    handleBottomTabPress,
    handleOpenDetail,
    handleBack,
  };
}