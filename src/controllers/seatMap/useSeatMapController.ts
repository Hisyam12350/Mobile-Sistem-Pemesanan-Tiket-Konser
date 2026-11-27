import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { eventApi, TicketCategoryItem } from '@/api/eventApi';
import { seatApi, ApiSeatItem } from '@/api/seatApi';

export type SeatVisualStatus = 'available' | 'selected' | 'locked' | 'sold';
export type SeatStatus = 'available' | 'locked' | 'sold';

export interface SeatNode {
  id: string;
  apiSeatId?: number;
  categoryId?: string;
  categoryName: string;
  label: string;
  blockId: string;
  price: number;
  status: SeatStatus;
}

export interface SeatBlock {
  id: string;
  position: 'left' | 'center' | 'right';
  row: 'top' | 'bottom';
  columns: number;
  seats: SeatNode[];
}

interface CategorySelectionMeta {
  categoryId: string;
  qty: number;
  price: number;
  name: string;
}

const MAX_SEATS_PER_ORDER = 6;

const BLOCK_CONFIGS: {
  id: string;
  prefix: string;
  defaultCategoryName: string;
  position: 'left' | 'center' | 'right';
  row: 'top' | 'bottom';
  columns: number;
  rows: number;
  defaultPrice: number;
}[] = [
  { id: 'block-tl', prefix: 'A', defaultCategoryName: 'VIP', position: 'left', row: 'top', columns: 3, rows: 4, defaultPrice: 8500000 },
  { id: 'block-tc', prefix: 'B', defaultCategoryName: 'VIP', position: 'center', row: 'top', columns: 4, rows: 4, defaultPrice: 8500000 },
  { id: 'block-tr', prefix: 'C', defaultCategoryName: 'Festival', position: 'right', row: 'top', columns: 4, rows: 3, defaultPrice: 6000000 },
  { id: 'block-bl', prefix: 'D', defaultCategoryName: 'CAT 1', position: 'left', row: 'bottom', columns: 3, rows: 4, defaultPrice: 4300000 },
  { id: 'block-bc', prefix: 'E', defaultCategoryName: 'CAT 1', position: 'center', row: 'bottom', columns: 4, rows: 4, defaultPrice: 4300000 },
  { id: 'block-br', prefix: 'F', defaultCategoryName: 'CAT 2', position: 'right', row: 'bottom', columns: 4, rows: 3, defaultPrice: 2200000 },
];

function parseBreakdown(raw?: string): CategorySelectionMeta[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map(part => {
      const [categoryId, qtyStr, priceStr, nameStr] = part.split(':');
      return {
        categoryId: (categoryId || '').trim(),
        qty: Number(qtyStr) || 0,
        price: Number(priceStr) || 0,
        name: (nameStr || 'VIP').trim(),
      };
    })
    .filter(item => item.categoryId && item.qty > 0);
}

function mapApiSeatStatus(apiSeat: ApiSeatItem): SeatStatus {
  const raw = (apiSeat.status_kursi || 'available').toLowerCase();
  if (raw === 'sold' || raw === 'booked') return 'sold';
  if (raw === 'locked') {
    // Allow same user returning from Checkout to keep/change their own non-ordered lock
    return apiSeat.locked_by_me ? 'available' : 'locked';
  }
  return 'available';
}

function matchBlockIdsForCategory(catName: string): string[] {
  const lower = (catName || '').toLowerCase();
  if (lower.includes('vip')) return ['block-tl', 'block-tc'];
  if (lower.includes('fest')) return ['block-tr'];
  if (lower.includes('cat 1') || lower.includes('cat1') || lower.includes('cat-1')) {
    return ['block-bl', 'block-bc'];
  }
  if (lower.includes('cat 2') || lower.includes('cat2') || lower.includes('cat-2')) {
    return ['block-br'];
  }
  return [];
}

function buildSeatBlocks(
  baseUnitPrice: number,
  apiCategories: TicketCategoryItem[] = [],
  apiSeats: ApiSeatItem[] = [],
  categoryPriceMap: Map<string, number> = new Map(),
  categoryNameMap: Map<string, string> = new Map(),
  defaultCatName?: string
): SeatBlock[] {
  // Offline/demo fallback only when backend returned zero real seats
  if (apiSeats.length === 0) {
    return BLOCK_CONFIGS.map(cfg => {
      const totalDots = cfg.columns * cfg.rows;
      const seats: SeatNode[] = [];
      for (let i = 0; i < totalDots; i++) {
        seats.push({
          id: `${cfg.id}-${i + 1}`,
          categoryName: defaultCatName || cfg.defaultCategoryName,
          label: `${cfg.prefix}${i + 1}`,
          blockId: cfg.id,
          price: baseUnitPrice > 0 ? baseUnitPrice : cfg.defaultPrice,
          status: 'available',
        });
      }
      return {
        id: cfg.id,
        position: cfg.position,
        row: cfg.row,
        columns: cfg.columns,
        seats,
      };
    });
  }

  // Real DB mode: ONLY render actual DB seats mapped cleanly to their category blocks.
  // Never invent fake `available` placeholder seats.
  const blockSeatsMap = new Map<string, ApiSeatItem[]>();
  for (const cfg of BLOCK_CONFIGS) {
    blockSeatsMap.set(cfg.id, []);
  }

  const seatsByCategory = new Map<string, ApiSeatItem[]>();
  for (const seat of apiSeats) {
    const cid = String(seat.kategori_id);
    const list = seatsByCategory.get(cid) || [];
    list.push(seat);
    seatsByCategory.set(cid, list);
  }

  const orderedCatIds = Array.from(
    new Set([
      ...apiCategories.map(c => String(c.id)),
      ...Array.from(seatsByCategory.keys()),
    ])
  );

  const usedBlockIds = new Set<string>();
  const unmatchedCatIds: string[] = [];

  for (const cid of orderedCatIds) {
    const catSeats = seatsByCategory.get(cid);
    if (!catSeats || catSeats.length === 0) continue;

    const catName =
      categoryNameMap.get(cid) ||
      apiCategories.find(c => String(c.id) === cid)?.nama_kategori ||
      '';
    const preferredBlocks = matchBlockIdsForCategory(catName).filter(
      bid => (blockSeatsMap.get(bid)?.length || 0) === 0
    );

    if (preferredBlocks.length === 0) {
      unmatchedCatIds.push(cid);
      continue;
    }

    if (preferredBlocks.length === 1 || catSeats.length <= 4) {
      const targetId = preferredBlocks[0];
      blockSeatsMap.get(targetId)?.push(...catSeats);
      usedBlockIds.add(targetId);
    } else {
      const mid = Math.ceil(catSeats.length / 2);
      blockSeatsMap.get(preferredBlocks[0])?.push(...catSeats.slice(0, mid));
      blockSeatsMap.get(preferredBlocks[1])?.push(...catSeats.slice(mid));
      usedBlockIds.add(preferredBlocks[0]);
      usedBlockIds.add(preferredBlocks[1]);
    }
  }

  // Assign any remaining categories to unused blocks in order (or round-robin if all blocks busy)
  const remainingBlocks = BLOCK_CONFIGS.map(b => b.id).filter(
    id => !usedBlockIds.has(id)
  );
  unmatchedCatIds.forEach((cid, idx) => {
    const catSeats = seatsByCategory.get(cid) || [];
    if (catSeats.length === 0) return;
    const targetBlockId =
      remainingBlocks[idx] || BLOCK_CONFIGS[idx % BLOCK_CONFIGS.length].id;
    blockSeatsMap.get(targetBlockId)?.push(...catSeats);
  });

  return BLOCK_CONFIGS.map(cfg => {
    const assigned = blockSeatsMap.get(cfg.id) || [];
    const seats: SeatNode[] = assigned.map(apiSeat => {
      const catIdStr = String(apiSeat.kategori_id);
      const numericId = !isNaN(Number(apiSeat.id))
        ? Number(apiSeat.id)
        : undefined;
      const resolvedPrice =
        categoryPriceMap.get(catIdStr) ||
        (baseUnitPrice > 0 ? baseUnitPrice : cfg.defaultPrice);
      const resolvedCatName =
        categoryNameMap.get(catIdStr) ||
        defaultCatName ||
        cfg.defaultCategoryName;

      return {
        id: `seat-${apiSeat.id}`,
        apiSeatId: numericId,
        categoryId: catIdStr,
        categoryName: resolvedCatName,
        label: apiSeat.nomor_kursi,
        blockId: cfg.id,
        price: resolvedPrice,
        status: mapApiSeatStatus(apiSeat),
      };
    });

    return {
      id: cfg.id,
      position: cfg.position,
      row: cfg.row,
      columns: cfg.columns,
      seats,
    };
  });
}

export function useSeatMapController() {
  const params = useLocalSearchParams<{
    id?: string;
    categoryIds?: string;
    breakdown?: string;
    categorySummary?: string;
    unitPrice?: string;
    targetQty?: string;
  }>();

  const eventId = params.id || '77';
  const parsedUnitPrice = Number(params.unitPrice) || 0;
  const parsedTargetQty = Math.min(
    Number(params.targetQty) || 0,
    MAX_SEATS_PER_ORDER
  );

  const [blocks, setBlocks] = useState<SeatBlock[]>(() =>
    buildSeatBlocks(parsedUnitPrice)
  );
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasAutoPickedRef = useRef(false);
  const isMountedRef = useRef(true);

  const loadSeatsFromApi = useCallback(async () => {
    setIsLoading(true);
    try {
      const breakdownList = parseBreakdown(params.breakdown);
      const categoryPriceMap = new Map<string, number>();
      const categoryNameMap = new Map<string, string>();

      for (const item of breakdownList) {
        if (item.price > 0) {
          categoryPriceMap.set(item.categoryId, item.price);
        }
        if (item.name) {
          categoryNameMap.set(item.categoryId, item.name);
        }
      }

      const apiCategories = await eventApi.getTicketCategories(eventId);
      for (const cat of apiCategories) {
        const cid = String(cat.id);
        const priceNum = Number(cat.harga) || 0;
        if (priceNum > 0 && !categoryPriceMap.has(cid)) {
          categoryPriceMap.set(cid, priceNum);
        }
        if (cat.nama_kategori && !categoryNameMap.has(cid)) {
          categoryNameMap.set(cid, cat.nama_kategori);
        }
      }

      // Always fetch seats for ALL event categories so no block displays fake seats
      let catIds: string[] = [];
      if (apiCategories.length > 0) {
        catIds = apiCategories.map(c => String(c.id));
      } else if (params.categoryIds) {
        catIds = params.categoryIds
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }

      const numericCatIds = catIds.filter(id => /^\d+$/.test(id));
      let allApiSeats: ApiSeatItem[] = [];

      if (numericCatIds.length > 0) {
        const seatResults = await Promise.all(
          numericCatIds.map(cid => seatApi.getSeatsByCategory(cid))
        );
        allApiSeats = seatResults.flat();
      }

      if (!isMountedRef.current) return;

      const singleDefaultCatName =
        breakdownList.length === 1 ? breakdownList[0].name : undefined;

      const nextBlocks = buildSeatBlocks(
        parsedUnitPrice,
        apiCategories,
        allApiSeats,
        categoryPriceMap,
        categoryNameMap,
        singleDefaultCatName
      );

      const allAvailable = nextBlocks
        .flatMap(b => b.seats)
        .filter(s => s.status === 'available');
      const availableIdSet = new Set(allAvailable.map(s => s.id));

      setBlocks(nextBlocks);

      if (!hasAutoPickedRef.current) {
        hasAutoPickedRef.current = true;
        if (breakdownList.length > 0) {
          const initialIds: string[] = [];
          let cursor = 0;

          for (const bItem of breakdownList) {
            const matchingCatSeats = allAvailable.filter(
              s =>
                s.categoryId === bItem.categoryId &&
                !initialIds.includes(s.id)
            );

            for (let k = 0; k < bItem.qty; k++) {
              const picked = matchingCatSeats[k] || allAvailable[cursor];
              if (picked && !initialIds.includes(picked.id)) {
                if (bItem.price > 0) {
                  picked.price = bItem.price;
                }
                if (bItem.name) {
                  picked.categoryName = bItem.name;
                }
                initialIds.push(picked.id);
              }
              cursor++;
            }
          }
          setSelectedSeatIds(initialIds.slice(0, MAX_SEATS_PER_ORDER));
        } else if (parsedTargetQty > 0) {
          setSelectedSeatIds(
            allAvailable.slice(0, parsedTargetQty).map(s => s.id)
          );
        }
      } else {
        // Drop any previously selected seats that just became locked or sold
        setSelectedSeatIds(prev => prev.filter(id => availableIdSet.has(id)));
      }
    } catch {
      // Keep initialized blocks on transient network errors
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    eventId,
    params.categoryIds,
    params.breakdown,
    parsedUnitPrice,
    parsedTargetQty,
  ]);

  useFocusEffect(
    useCallback(() => {
      isMountedRef.current = true;
      loadSeatsFromApi();
      return () => {
        isMountedRef.current = false;
      };
    }, [loadSeatsFromApi])
  );

  const allSeatsMap = useMemo(() => {
    const map = new Map<string, SeatNode>();
    for (const block of blocks) {
      for (const seat of block.seats) {
        map.set(seat.id, seat);
      }
    }
    return map;
  }, [blocks]);

  const toggleSeat = (seat: SeatNode) => {
    if (isLoading || isSubmitting) return;

    if (seat.status === 'sold') {
      Alert.alert(
        'Kursi Sudah Terjual',
        `Kursi ${seat.label} (${seat.categoryName}) sudah dibeli oleh penonton lain.`
      );
      return;
    }

    if (seat.status === 'locked') {
      Alert.alert(
        'Kursi Sedang Dikunci',
        `Kursi ${seat.label} (${seat.categoryName}) sedang dikunci sementara oleh pembeli lain.`
      );
      return;
    }

    setSelectedSeatIds(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      }
      if (prev.length >= MAX_SEATS_PER_ORDER) {
        Alert.alert(
          'Batas Maksimal Kursi',
          `Maksimal pemilihan adalah ${MAX_SEATS_PER_ORDER} kursi dalam satu transaksi.`
        );
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const selectedSeats = useMemo(
    () =>
      selectedSeatIds
        .map(id => allSeatsMap.get(id))
        .filter((s): s is SeatNode => Boolean(s))
        .filter(s => s.status === 'available'),
    [selectedSeatIds, allSeatsMap]
  );

  const totalTickets = selectedSeats.length;

  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + s.price, 0),
    [selectedSeats]
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/pilih-tiket');
    }
  };

  const handleLanjutkan = async () => {
    if (totalTickets === 0 || isSubmitting || isLoading) return;

    const seatLabels = selectedSeats.map(s => s.label).join(', ');
    const apiIds = selectedSeats
      .map(s => s.apiSeatId)
      .filter((id): id is number => typeof id === 'number');

    const catCounts = new Map<string, number>();
    for (const s of selectedSeats) {
      const cName = s.categoryName || 'VIP';
      catCounts.set(cName, (catCounts.get(cName) || 0) + 1);
    }
    const dynamicSummary = Array.from(catCounts.entries())
      .map(([name, count]) => `${name} (${count})`)
      .join('|');

    if (apiIds.length > 0) {
      setIsSubmitting(true);
      try {
        await seatApi.lockSeats(apiIds, 10);
      } catch (err: any) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Sebagian kursi sudah dikunci atau dibeli oleh orang lain.';
        const isNetworkOffline =
          err?.name === 'AbortError' ||
          /network request failed|failed to fetch|timeout/i.test(msg);

        if (!isNetworkOffline) {
          Alert.alert('Kursi Tidak Tersedia', msg);
          await loadSeatsFromApi();
          return;
        }
      } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
      }
    }

    (router as any).push({
      pathname: '/checkout',
      params: {
        id: String(eventId),
        seatLabels,
        apiSeatIds: apiIds.join(','),
        categorySummary:
          dynamicSummary || params.categorySummary || `VIP (${totalTickets})`,
        subtotal: String(totalPrice),
        totalTickets: String(totalTickets),
      },
    });
  };

  const topRowBlocks = useMemo(
    () => blocks.filter(b => b.row === 'top'),
    [blocks]
  );
  const bottomRowBlocks = useMemo(
    () => blocks.filter(b => b.row === 'bottom'),
    [blocks]
  );

  return {
    blocks,
    topRowBlocks,
    bottomRowBlocks,
    selectedSeatIds,
    selectedSeats,
    totalTickets,
    totalPrice,
    isLoading,
    isSubmitting,
    toggleSeat,
    handleBack,
    handleLanjutkan,
  };
}
