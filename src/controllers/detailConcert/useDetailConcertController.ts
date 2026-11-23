import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { eventApi, EventItem } from '@/api/eventApi';

export interface TicketTierDisplay {
  id: string;
  name: string;
  price: string;
  color: string;
}

const TIER_COLORS = ['#6F00FF', '#F87171', '#FBBF24', '#3B82F6', '#10B981', '#EC4899'];

const formatRupiah = (amount: number | string): string => {
  const num = Number(amount) || 0;
  return 'Rp.' + num.toLocaleString('id-ID');
};

const formatDate = (isoString?: string): string => {
  if (!isoString) return '25 Agust 2026';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agust', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return '25 Agust 2026';
  }
};

export function useDetailConcertController() {
  const params = useLocalSearchParams<{ id?: string }>();
  const eventId = params.id || '77';

  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [categories, setCategories] = useState<TicketTierDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [eventRes, catRes] = await Promise.all([
          eventApi.getEventById(eventId),
          eventApi.getTicketCategories(eventId),
        ]);

        if (isMounted) {
          if (eventRes) {
            setEventData(eventRes);
          }
          if (catRes && catRes.length > 0) {
            const mappedTiers: TicketTierDisplay[] = catRes.map((cat, idx) => ({
              id: String(cat.id),
              name: cat.nama_kategori,
              price: formatRupiah(cat.harga),
              color: TIER_COLORS[idx % TIER_COLORS.length],
            }));
            setCategories(mappedTiers);
          } else {
            // Default tiers fallback
            setCategories([
              { id: '1', name: 'VIP', price: 'Rp.8.500.000', color: '#6F00FF' },
              { id: '2', name: 'Festival', price: 'Rp.6.000.000', color: '#F87171' },
              { id: '3', name: 'CAT 1', price: 'Rp.4.300.000', color: '#FBBF24' },
              { id: '4', name: 'CAT 2', price: 'Rp.2.200.000', color: '#3B82F6' },
            ]);
          }
        }
      } catch (err) {
        console.warn('Error loading concert detail:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const displayArtist = eventData?.nama_event || 'Bruno Mars';
  const displayTitle = eventData?.deskripsi
    ? eventData.deskripsi.split('.')[0]
    : '24K Magic Live';
  const displayVenue = eventData?.lokasi || 'Jakarta International Stadium';
  const displayDate = formatDate(eventData?.waktu_event);
  const displayDescription =
    eventData?.deskripsi ||
    'Bruno Mars Kembali hadir dengan konser Talking to the Moon. Nikmati malam penuh kenangan bersama lagu-lagu hits Nya.';

  const getHeroImage = () => {
    if (eventData?.banner_url) {
      return { uri: eventData.banner_url };
    }
    const name = (eventData?.nama_event || '').toLowerCase();
    if (name.includes('coldplay')) {
      return require('@/assets/images/coldplay-banner.png');
    }
    return require('@/assets/images/bruno-mars-detail.png');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/home');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const handlePilihTiket = () => {
    Alert.alert('Pilih Tiket', 'Fitur pemilihan kursi konser akan segera hadir!');
  };

  return {
    eventId,
    eventData,
    categories,
    isLoading,
    isFavorite,
    isExpanded,
    displayArtist,
    displayTitle,
    displayVenue,
    displayDate,
    displayDescription,
    getHeroImage,
    handleBack,
    toggleFavorite,
    toggleExpanded,
    handlePilihTiket,
  };
}
