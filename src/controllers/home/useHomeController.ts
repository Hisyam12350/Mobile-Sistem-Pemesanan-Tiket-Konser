import { useEffect, useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { eventApi, EventItem } from '@/api/eventApi';

export interface StoredUser {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
}

export interface CategoryItem {
  id: string;
  label: string;
}

const EVENT_MIN_PRICES: Record<string, string> = {
  '77': 'Rp.1.500.000',
  '78': 'Rp.1.800.000',
  '88': 'Rp.1.500.000',
  '89': 'Rp.1.850.000',
  '90': 'Rp.1.450.000',
  '91': 'Rp.1.350.000',
};

export function useHomeController() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Home');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem('@auth_user')
      .then(value => {
        if (!isMounted) return;
        if (value) {
          try {
            setUser(JSON.parse(value) as StoredUser);
          } catch {
            setUser(null);
          }
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    eventApi
      .getEvents()
      .then(res => {
        if (isMounted && res && res.length > 0) {
          setEvents(res);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    eventApi
      .getEvents()
      .then(res => {
        if (res && res.length > 0) {
          setEvents(res);
        }
      })
      .finally(() => {
        setIsLoadingEvents(false);
        setIsRefreshing(false);
      });
  }, []);

  const categories: CategoryItem[] = [
    { id: 'All', label: 'All' },
    { id: 'Music', label: 'Music' },
    { id: 'Festival', label: 'Festival' },
    { id: 'K-Pop', label: 'K-Pop' },
    { id: 'Pop', label: 'Pop' },
  ];

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return '25 Agust 2026';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
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

  const getEventPrice = (event: EventItem) => {
    const idKey = String(event.id);
    return EVENT_MIN_PRICES[idKey] || 'Rp.1.500.000';
  };

  // Filter out dummy test events and apply categories & search query
  const filteredEvents = useMemo(() => {
    let list = events.filter(
      e =>
        !e.nama_event.toLowerCase().includes('test event') &&
        !e.nama_event.toLowerCase().includes('debug event') &&
        !e.nama_event.toLowerCase().includes('konser tes')
    );

    // Filter by category
    if (selectedCategory !== 'All' && selectedCategory !== 'Music') {
      const catLower = selectedCategory.toLowerCase();
      list = list.filter(e => {
        const text = `${e.nama_event} ${e.deskripsi || ''} ${e.lokasi || ''}`.toLowerCase();
        if (catLower === 'pop') {
          return (
            text.includes('pop') ||
            text.includes('bruno') ||
            text.includes('taylor') ||
            text.includes('billie') ||
            text.includes('dua lipa')
          );
        }
        if (catLower === 'festival') {
          return text.includes('festival') || text.includes('tour') || text.includes('coldplay');
        }
        return text.includes(catLower);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(e => {
        const text = `${e.nama_event} ${e.deskripsi || ''} ${e.lokasi || ''}`.toLowerCase();
        return text.includes(query);
      });
    }

    // Prioritize Bruno Mars & Coldplay, then sort by ID descending
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
  }, [events, selectedCategory, searchQuery]);

  // Fallback if API hasn't loaded yet
  const displayEvents = useMemo(() => {
    if (filteredEvents.length > 0) return filteredEvents;
    if (isLoadingEvents) return [];
    if (searchQuery.trim() || selectedCategory !== 'All') return [];
    return [
      {
        id: '77',
        nama_event: 'Bruno Mars',
        lokasi: 'Jakarta International Stadium',
        waktu_event: '25 Agust 2026',
        deskripsi: '24K Magic Live',
        status: 'upcoming',
      },
      {
        id: '88',
        nama_event: 'Bruno Mars',
        lokasi: 'Surabaya',
        waktu_event: '12 Nov 2026',
        deskripsi: 'Risk It All Live in Surabaya',
        status: 'upcoming',
      },
      {
        id: '78',
        nama_event: 'Coldplay — Music of the Spheres',
        lokasi: 'Gelora Bung Karno Stadium',
        waktu_event: '15 Nov 2026',
        deskripsi: 'Music of the Spheres World Tour Live in Jakarta.',
        status: 'upcoming',
      },
    ];
  }, [filteredEvents, isLoadingEvents, searchQuery, selectedCategory]);

  const handleOpenDetail = (eventId: string | number) => {
    (router as any).push({
      pathname: '/detail-concert',
      params: { id: String(eventId) },
    });
  };

  const handleSearchSubmit = () => {
    (router as any).push({
      pathname: '/search',
      params: { q: searchQuery },
    });
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifikasi', 'Belum ada notifikasi baru saat ini.');
  };

  const handleTabPress = (tabName: string) => {
    if (tabName === 'Tickets') {
      (router as any).push('/riwayat-tiket');
    } else if (tabName === 'Profile') {
      (router as any).push('/profile');
    } else if (tabName === 'Search') {
      (router as any).push('/search');
    } else {
      setActiveTab(tabName);
    }
  };

  return {
    user,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    isLoadingEvents,
    isRefreshing,
    categories,
    displayEvents,
    onRefresh,
    formatEventDate,
    getEventPoster,
    getEventPrice,
    handleOpenDetail,
    handleSearchSubmit,
    handleNotificationPress,
    handleTabPress,
  };
}
