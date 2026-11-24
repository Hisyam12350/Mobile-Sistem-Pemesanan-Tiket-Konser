import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { eventApi, TicketCategoryItem } from '@/api/eventApi';

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

const DEFAULT_TIERS: TicketTierDisplay[] = [
  { id: '1', name: 'VIP', price: 'Rp.8.500.000', color: '#6F00FF' },
  { id: '2', name: 'Festival', price: 'Rp.6.000.000', color: '#F87171' },
  { id: '3', name: 'CAT 1', price: 'Rp.4.300.000', color: '#FBBF24' },
  { id: '4', name: 'CAT 2', price: 'Rp.2.200.000', color: '#3B82F6' },
];

export function usePilihTiketController() {
  const params = useLocalSearchParams<{ id?: string }>();
  const eventId = params.id || '77';

  const [categories, setCategories] = useState<TicketTierDisplay[]>(DEFAULT_TIERS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const catRes = await eventApi.getTicketCategories(eventId);
        if (isMounted && catRes && catRes.length > 0) {
          const mappedTiers: TicketTierDisplay[] = catRes.map((cat, idx) => ({
            id: String(cat.id),
            name: cat[`nama kategori` as keyof TicketCategoryItem] as string,
            price: formatRupiah(cat.harga),
            color: TIER_COLORS[idx % TIER_COLORS.length],
          }));
          setCategories(mappedTiers);
        }
      } catch (err) {
        console.warn('Error loading ticket categories:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const increment = (id: string) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrement = (id: string) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + (q || 0), 0);

  const totalPrice = categories.reduce((sum, cat) => {
    const priceNum = Number(cat.price.replace(/[^0-9]/g, '')) || 0;
    return sum + priceNum * (quantities[cat.id] || 0);
  }, 0);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/detail-concert');
    }
  };

  const handleLanjutkan = () => {
    if (totalTickets === 0) return;

    const selected = categories
      .filter(cat => (quantities[cat.id] || 0) > 0)
      .map(cat => `${quantities[cat.id]}x ${cat.name}`)
      .join(', ');

    Alert.alert(
      'Pemesanan Dikonfirmasi',
      `Tiket terpilih: ${selected}\nTotal: ${formatRupiah(totalPrice)} (${totalTickets} tiket)`
    );
  };

  return {
    eventId,
    categories,
    quantities,
    totalTickets,
    totalPrice,
    isLoading,
    increment,
    decrement,
    handleBack,
    handleLanjutkan,
  };
}