import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { eventApi } from '@/api/eventApi';

export interface TicketTierDisplay {
  id: string;
  name: string;
  price: string;
  color: string;
}

const TIER_COLORS = ['#6F00FF', '#F87171', '#FBBF24', '#3B82F6', '#10B981', '#EC4899'];
const MAX_TICKETS_PER_ORDER = 6;

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
            name: cat.nama_kategori || 'VIP',
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

  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + (q || 0), 0);

  const increment = (id: string) => {
    if (totalTickets >= MAX_TICKETS_PER_ORDER) {
      Alert.alert(
        'Batas Maksimal Tiket',
        `Maksimal pembelian adalah ${MAX_TICKETS_PER_ORDER} tiket dalam satu transaksi.`
      );
      return;
    }
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

  const handleSeeBenefit = (tierName: string) => {
    const lower = tierName.toLowerCase();
    let benefitText = '• Akses masuk area konser sesuai kategori\n• E-Ticket resmi dengan QR Code';
    if (lower.includes('vip')) {
      benefitText =
        '• Posisi terdepan dekat panggung (Front Row)\n• Jalur masuk khusus VIP Fast Track\n• Merchandise eksklusif & Lanyard VIP\n• Akses Soundcheck Party';
    } else if (lower.includes('festival')) {
      benefitText =
        '• Area berdiri (Standing) dekat panggung utama\n• Akses masuk prioritas Festival Gate\n• Wristband eksklusif konser';
    } else if (lower.includes('cat 1')) {
      benefitText =
        '• Kursi bernomor (Numbered Seating) pandangan lurus panggung\n• Akses fasilitas F&B & merchandise booth';
    } else if (lower.includes('cat 2')) {
      benefitText =
        '• Kursi bernomor (Numbered Seating) tribun tengah\n• E-Ticket resmi dengan QR Code';
    }
    Alert.alert(`Benefit Kategori ${tierName}`, benefitText);
  };

  const handleLanjutkan = () => {
    if (totalTickets === 0) return;

    const selectedCategories = categories.filter(cat => (quantities[cat.id] || 0) > 0);
    const categoryIds = selectedCategories.map(c => c.id).join(',');
    const categoryBreakdown = selectedCategories
      .map(c => {
        const rawPrice = Number(c.price.replace(/[^0-9]/g, '')) || 0;
        return `${c.id}:${quantities[c.id]}:${rawPrice}:${c.name}`;
      })
      .join(',');
    const categorySummary = selectedCategories
      .map(c => `${c.name} (${quantities[c.id]})`)
      .join('|');
    const avgUnitPrice = Math.round(totalPrice / totalTickets);

    (router as any).push({
      pathname: '/seat-map',
      params: {
        id: String(eventId),
        categoryIds,
        breakdown: categoryBreakdown,
        categorySummary,
        unitPrice: String(avgUnitPrice),
        targetQty: String(totalTickets),
      },
    });
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
    handleSeeBenefit,
    handleLanjutkan,
  };
}