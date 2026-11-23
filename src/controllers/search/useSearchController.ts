import { useEffect, useState, useMemo, useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { eventApi, EventItem } from '@/api/eventApi';

export type SearchFilterType = 'All' | 'Concert' | 'Venue';

const EVENT_MIN_PRICES: Record<string, string> = {
  '77': 'Rp.1.500.000',
  '78': 'Rp.1.800.000',
  '88': 'Rp.1.500.000',
  '89': 'Rp.1.850.000',
  '90': 'Rp.1.450.000',
  '91': 'Rp.1.350.000',
};

export function useSearchController() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [searchQuery, setSearchQuery] = useState(
    typeof params.q === 'string' ? params.q : ''
  );
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('All');
  const [activeTab, setActiveTab] = useState('Search');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await eventApi.getEvents();
      if (res && res.length > 0) {
        setEvents(res);
      }
    } catch (err) {
      console.warn('Gagal memuat event di search:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const filterTabs: SearchFilterType[] = ['All', 'Concert', 'Venue'];

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return '25 December 2026';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {}
    return dateStr;
  };

  const getEventPoster = (event: EventItem) => {
    if (event.banner_url) {
      return { uri: event.banner_url };
    }
    const name = (event.nama_event || '').toLowerCase();
    const desc = (event.deskripsi || '').toLowerCase();
    const loc = (event.lokasi || '').toLowerCase();

    if (desc.includes('risk it all') || loc.includes('surabaya')) {
      return require('@/assets/images/bruno-mars-sketch.png');
    }
    if (name.includes('coldplay')) {
      return require('@/assets/images/coldplay-banner.png');
    }
    return require('@/assets/images/bruno-mars-poster.png');
  };

  const getEventSubtitle = (event: EventItem) => {
    const desc = (event.deskripsi || '').toLowerCase();
    const loc = (event.lokasi || '').toLowerCase();
    const name = event.nama_event.toLowerCase();

    if (desc.includes('risk it all') || loc.includes('surabaya')) {
      return 'Risk It All';
    }
    if (name.includes('bruno')) {
      return '24K Magic Live';
    }
    if (name.includes('coldplay')) {
      return 'Music of the Spheres';
    }
    if (name.includes('taylor swift')) {
      return 'The Eras Tour Live';
    }
    if (name.includes('billie eilish')) {
      return 'Hit Me Hard and Soft Tour';
    }
    if (name.includes('dua lipa')) {
      return 'Radical Optimism Tour';
    }
    return event.deskripsi ? event.deskripsi.split('.')[0] : 'Live Concert';
  };

  const getEventPrice = (event: EventItem) => {
    const idKey = String(event.id);
    return EVENT_MIN_PRICES[idKey] || 'Rp.1.500.000';
  };

  const getVenueDisplay = (event: EventItem) => {
    if (!event.lokasi) return 'JIS Jakarta';
    if (event.lokasi.toLowerCase().includes('jakarta international')) {
      return 'JIS Jakarta';
    }
    return event.lokasi;
  };

  // Filtered events from API based on query & active tab
  const filteredEvents = useMemo(() => {
    let list = events.filter(
      e =>
        !e.nama_event.toLowerCase().includes('test event') &&
        !e.nama_event.toLowerCase().includes('debug event') &&
        !e.nama_event.toLowerCase().includes('konser tes')
    );
    const q = searchQuery.toLowerCase().trim();

    // Filter based on active tab
    if (activeFilter === 'Venue') {
      if (q) {
        list = list.filter(e => {
          const loc = `${e.lokasi || ''} ${e.detail_lokasi || ''}`.toLowerCase();
          return loc.includes(q);
        });
      }
    } else if (activeFilter === 'Concert') {
      if (q) {
        list = list.filter(e => {
          const concert = `${e.nama_event} ${e.deskripsi || ''}`.toLowerCase();
          return concert.includes(q);
        });
      }
    } else {
      // 'All' tab: search across name, desc, and location
      if (q) {
        list = list.filter(e => {
          const combined = `${e.nama_event} ${e.deskripsi || ''} ${e.lokasi || ''} ${e.detail_lokasi || ''}`.toLowerCase();
          return combined.includes(q);
        });
      }
    }

    // Sort to prioritize Bruno Mars & Coldplay, then by ID
    return [...list].sort((a, b) => {
      const isAFeatured =
        a.nama_event.toLowerCase().includes('bruno') ||
        a.nama_event.toLowerCase().includes('coldplay');
      const isBFeatured =
        b.nama_event.toLowerCase().includes('bruno') ||
        b.nama_event.toLowerCase().includes('coldplay');
      if (isAFeatured && !isBFeatured) return -1;
      if (!isAFeatured && isBFeatured) return 1;
      return Number(b.id) - Number(a.id);
    });
  }, [events, activeFilter, searchQuery]);

  // Fallback items if API hasn't loaded yet
  const displayEvents = useMemo(() => {
    if (filteredEvents.length > 0) return filteredEvents;
    if (isLoading) return [];

    // If API returned 0 items and no query, show graceful mock items
    if (!searchQuery.trim()) {
      return [
        {
          id: '77',
          nama_event: 'Bruno Mars',
          lokasi: 'JIS Jakarta',
          waktu_event: '2026-12-25T19:00:00.000Z',
          deskripsi: '24K Magic Live',
          status: 'upcoming',
        },
        {
          id: '88',
          nama_event: 'Bruno Mars',
          lokasi: 'Surabaya',
          waktu_event: '2026-11-12T19:00:00.000Z',
          deskripsi: 'Risk It All',
          status: 'upcoming',
        },
        {
          id: '78',
          nama_event: 'Coldplay — Music of the Spheres',
          lokasi: 'Gelora Bung Karno Stadium',
          waktu_event: '2026-11-15T19:30:00.000Z',
          deskripsi: 'Music of the Spheres World Tour Live in Jakarta.',
          status: 'upcoming',
        },
      ];
    }
    return [];
  }, [filteredEvents, isLoading, searchQuery]);

  const handleOpenDetail = (eventId: string | number) => {
    (router as any).push({
      pathname: '/detail-concert',
      params: { id: String(eventId) },
    });
  };

  const handleCancel = () => {
    if (searchQuery.length > 0) {
      setSearchQuery('');
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        (router as any).replace('/home');
      }
    }
  };

  const handleTabPress = (tabName: string) => {
    if (tabName === 'Home') {
      (router as any).replace('/home');
    } else {
      setActiveTab(tabName);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterTabs,
    activeTab,
    isLoading,
    isRefreshing,
    displayEvents,
    onRefresh,
    formatEventDate,
    getEventPoster,
    getEventSubtitle,
    getEventPrice,
    getVenueDisplay,
    handleOpenDetail,
    handleCancel,
    handleTabPress,
  };
}
