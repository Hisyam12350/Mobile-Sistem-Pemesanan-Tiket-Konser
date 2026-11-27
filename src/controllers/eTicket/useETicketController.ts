import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { eventApi, EventItem } from '@/api/eventApi';
import { paymentApi } from '@/api/paymentApi';
import { ticketApi } from '@/api/ticketApi';
import {
  encodeQrMatrixToPngBytes,
  encodeQrMatrixToPngDataUri,
  generateQrMatrix,
} from '@/utils/qrHelper';

export interface TicketQrEntry {
  key: string;
  ticketId?: string | number;
  seatLabel: string;
  categoryName: string;
  kodeUnik: string;
  statusTiket: string;
  qrMatrix: number[][];
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseSeatLabels(
  rawSeatLabels?: string,
  targetCount = 1,
  categoryLabel = ''
): string[] {
  if (!rawSeatLabels || !rawSeatLabels.trim()) {
    const defaults: string[] = [];
    for (let i = 1; i <= Math.max(1, targetCount); i++) {
      defaults.push(`A${i}`);
    }
    return defaults;
  }

  // Strip optional leading category prefix (dynamic from categorySummary or standard tiers)
  let cleaned = rawSeatLabels.trim();
  const dynamicCategories = categoryLabel
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
  const prefixes = [
    ...dynamicCategories,
    'Early Bird',
    'Festival',
    'Platinum',
    'Regular',
    'Reguler',
    'Silver',
    'CAT 1',
    'CAT 2',
    'CAT 3',
    'VVIP',
    'Gold',
    'VIP',
  ].sort((a, b) => b.length - a.length);

  for (const prefix of prefixes) {
    const re = new RegExp(`^${escapeRegExp(prefix)}\\s+`, 'i');
    if (re.test(cleaned)) {
      cleaned = cleaned.replace(re, '').trim();
      break;
    }
  }

  const parts = cleaned
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (parts.length > 0) return parts;
  return ['A1'];
}

function parsePrimaryCategory(categorySummary?: string): string {
  if (!categorySummary || !categorySummary.trim()) return 'VIP';
  const names = categorySummary
    .split('|')
    .map(p => p.replace(/\(\d+\)/g, '').trim())
    .filter(Boolean);
  return names.length > 0 ? Array.from(new Set(names)).join(', ') : 'VIP';
}

function parseTicketCount(categorySummary?: string, seatList: string[] = []): number {
  if (categorySummary) {
    const sum = categorySummary.split('|').reduce((acc, part) => {
      const m = part.match(/\((\d+)\)/);
      return acc + (m ? Number(m[1]) : 0);
    }, 0);
    if (sum > 0) return sum;
  }
  return Math.max(1, seatList.length);
}

function isPngBytes(bytes: Uint8Array): boolean {
  return (
    bytes.length > 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  );
}

export function useETicketController() {
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
    rawOrderId?: string;
    ticketId?: string;
    kodeUnik?: string;
    artist?: string;
    tour?: string;
    dateTime?: string;
    venue?: string;
    seatLabels?: string;
    categorySummary?: string;
    totalTickets?: string;
  }>();

  const explicitEventId = (params.id || '').trim();
  const orderId = params.orderId || 'CX-240S28-0012';
  const rawOrderId = params.rawOrderId || '';
  const categoryName = useMemo(
    () => parsePrimaryCategory(params.categorySummary),
    [params.categorySummary]
  );
  const initialSeatList = useMemo(
    () =>
      parseSeatLabels(
        params.seatLabels,
        Number(params.totalTickets) || 1,
        categoryName
      ),
    [params.seatLabels, params.totalTickets, categoryName]
  );
  const fallbackCount = useMemo(
    () =>
      Number(params.totalTickets) ||
      parseTicketCount(params.categorySummary, initialSeatList),
    [params.totalTickets, params.categorySummary, initialSeatList]
  );

  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [ticketEntries, setTicketEntries] = useState<TicketQrEntry[]>(() => {
    const seats = initialSeatList.length > 0 ? initialSeatList : ['A1'];
    return seats.map((seatLabel, idx) => {
      const code =
        idx === 0 && params.kodeUnik
          ? params.kodeUnik
          : `TKT-${orderId}-${seatLabel.replace(/\s+/g, '')}-${idx + 1}`;
      return {
        key: `${orderId}-${seatLabel}-${idx}`,
        ticketId: idx === 0 ? params.ticketId : undefined,
        seatLabel,
        categoryName,
        kodeUnik: code,
        statusTiket: 'active',
        qrMatrix: generateQrMatrix(code),
      };
    });
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  // Load event metadata and real DB tickets (with unique `kode_unik` per seat) if available
  useEffect(() => {
    let isMounted = true;

    async function loadTicketDetails() {
      try {
        if (explicitEventId) {
          eventApi
            .getEventById(explicitEventId)
            .then(res => {
              if (isMounted && res) setEventData(res);
            })
            .catch(() => {});
        }

        if (rawOrderId) {
          const payRes = await paymentApi
            .getPaymentStatus(rawOrderId)
            .catch(() => null);
          const dbTickets = payRes?.data?.tickets || [];

          if (isMounted && dbTickets.length > 0) {
            const seatNumMap = new Map<string, string>();
            const catMap = new Map<string, string>();
            for (const item of payRes?.data?.items || []) {
              if (item.nama_kategori) {
                catMap.set(String(item.kategori_id), item.nama_kategori);
              }
              for (const s of item.seats || []) {
                seatNumMap.set(String(s.id), s.nomor_kursi);
              }
            }

            const entries: TicketQrEntry[] = dbTickets.map((t, idx) => {
              const sLabel =
                seatNumMap.get(String(t.seat_id)) ||
                initialSeatList[idx] ||
                `S${idx + 1}`;
              const uniqueCode =
                t.kode_unik || `TKT-${rawOrderId}-${t.seat_id}-${t.id}`;
              return {
                key: `db-${t.id}`,
                ticketId: t.id,
                seatLabel: sLabel,
                categoryName: catMap.get(String(t.kategori_id)) || categoryName,
                kodeUnik: uniqueCode,
                statusTiket: t.status_tiket || 'active',
                qrMatrix: generateQrMatrix(uniqueCode),
              };
            });

            const matchedIdx = params.ticketId
              ? entries.findIndex(
                  e => String(e.ticketId) === String(params.ticketId)
                )
              : 0;

            setTicketEntries(entries);
            setIsDbLoaded(true);
            setSelectedIndex(matchedIdx >= 0 ? matchedIdx : 0);
            return;
          }
        }

        if (params.ticketId) {
          const single = await ticketApi
            .getTicketById(params.ticketId)
            .catch(() => null);
          if (isMounted && single && single.kode_unik) {
            const sLabel =
              single.nomor_kursi || initialSeatList[0] || 'A1';
            const cat =
              single.nama_kategori || single.nama_category || categoryName;
            setTicketEntries([
              {
                key: `db-${single.id}`,
                ticketId: single.id,
                seatLabel: sLabel,
                categoryName: cat,
                kodeUnik: single.kode_unik,
                statusTiket: single.status_tiket || 'active',
                qrMatrix: generateQrMatrix(single.kode_unik),
              },
            ]);
            if (single.nama_event && !explicitEventId) {
              setEventData(prev =>
                prev || {
                  id: single.event_id || 0,
                  nama_event: single.nama_event || '',
                  lokasi: single.lokasi || '',
                  waktu_event: single.waktu_event || '',
                  deskripsi: single.deskripsi || '',
                  banner_url: single.banner_url || null,
                  status: 'upcoming',
                }
              );
            }
            setIsDbLoaded(true);
            setSelectedIndex(0);
          }
        }
      } catch {
        // Keep initialized deterministic per-seat QR entries
      }
    }

    loadTicketDetails();

    return () => {
      isMounted = false;
    };
  }, [explicitEventId, rawOrderId, params.ticketId, categoryName, initialSeatList]);

  const activeTicket = ticketEntries[selectedIndex] || ticketEntries[0];

  const activeQrDataUri = useMemo(() => {
    if (!activeTicket) return '';
    return encodeQrMatrixToPngDataUri(activeTicket.qrMatrix, 420, 2);
  }, [activeTicket]);

  // Guard against eventId mismatch overwriting an explicit artist param
  const matchingEventData = useMemo(() => {
    if (!eventData) return null;
    if (
      params.artist &&
      eventData.nama_event &&
      params.artist.trim().toLowerCase() !== eventData.nama_event.trim().toLowerCase()
    ) {
      return null;
    }
    return eventData;
  }, [eventData, params.artist]);

  const displayArtist =
    matchingEventData?.nama_event || params.artist || 'Bruno Mars';

  const displayTour = useMemo(() => {
    if (params.tour) return params.tour;
    if (matchingEventData?.deskripsi) {
      return matchingEventData.deskripsi.split('.')[0];
    }
    const lower = displayArtist.toLowerCase();
    if (lower.includes('coldplay')) return 'Music of the Spheres';
    if (lower.includes('taylor')) return 'The Eras Tour Live';
    if (lower.includes('billie')) return 'Hit Me Hard and Soft Tour';
    if (lower.includes('dua lipa')) return 'Radical Optimism Tour';
    return '24K Magic Live';
  }, [params.tour, matchingEventData, displayArtist]);

  const { displayDate, displayTime } = useMemo(() => {
    const raw = params.dateTime || '28 Sep 2026 · 19:30 WIB';
    if (raw.includes('·')) {
      const [dPart, tPart] = raw.split('·').map(s => s.trim());
      return {
        displayDate: dPart || '28 Sep 2026',
        displayTime: tPart || '19:30 WIB',
      };
    }
    return {
      displayDate: raw,
      displayTime: '19:30 WIB',
    };
  }, [params.dateTime]);

  const displayVenue = useMemo(() => {
    if (params.venue) return params.venue;
    if (!matchingEventData?.lokasi) return 'JIS Jakarta';
    if (matchingEventData.lokasi.toLowerCase().includes('jakarta international')) {
      return 'JIS Jakarta';
    }
    return matchingEventData.lokasi;
  }, [params.venue, matchingEventData]);

  const allSeatsSummary = useMemo(() => {
    if (ticketEntries.length === 1) {
      return ticketEntries[0].seatLabel;
    }
    return ticketEntries.map(t => t.seatLabel).join(',');
  }, [ticketEntries]);

  const totalTickets = isDbLoaded
    ? ticketEntries.length
    : Math.max(fallbackCount, ticketEntries.length);

  const getHeroImage = () => {
    if (matchingEventData?.banner_url) {
      return { uri: matchingEventData.banner_url };
    }
    const lower = displayArtist.toLowerCase();
    if (lower.includes('coldplay')) {
      return require('@/assets/images/coldplay-banner.png');
    }
    return require('@/assets/images/bruno-mars-eticket.png');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      (router as any).replace('/riwayat-tiket');
    }
  };

  const handleSimpanKeGaleri = async () => {
    if (isSaving || !activeTicket) return;
    setIsSaving(true);

    const safeSeat =
      activeTicket.seatLabel.replace(/[^a-zA-Z0-9_-]/g, '') || 'TKT';
    const safeOrder = orderId.replace(/[^a-zA-Z0-9_-]/g, '') || 'ORDER';
    const fileName = `ETicket-${safeOrder}-${safeSeat}.png`;

    try {
      // 1. Web browser download directly
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const pngBytes = encodeQrMatrixToPngBytes(activeTicket.qrMatrix, 520, 4);
        const arrayBuffer = new ArrayBuffer(pngBytes.byteLength);
        new Uint8Array(arrayBuffer).set(pngBytes);
        const blob = new Blob([arrayBuffer], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setSavedKeys(prev => ({ ...prev, [activeTicket.key]: true }));
        Alert.alert(
          'Berhasil Diunduh',
          `QR E-Ticket untuk Kursi ${activeTicket.seatLabel} (${activeTicket.kodeUnik}) telah diunduh sebagai ${fileName}.`
        );
        return;
      }

      // 2. Mobile (Android/iOS): Prepare valid PNG in cache first
      const targetFile = new File(Paths.cache, fileName);
      let downloadedValidPng = false;
      let cachedPngBytes: Uint8Array | null = null;

      if (activeTicket.ticketId) {
        try {
          const dlConfig = await ticketApi.getTicketQrDownloadConfig(
            activeTicket.ticketId
          );
          if (dlConfig) {
            await Promise.race([
              File.downloadFileAsync(dlConfig.url, targetFile, {
                idempotent: true,
                headers: dlConfig.headers,
              }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Download timeout')), 2500)
              ),
            ]);
            if (targetFile.exists) {
              const buf = new Uint8Array(await targetFile.arrayBuffer());
              if (isPngBytes(buf)) {
                downloadedValidPng = true;
                cachedPngBytes = buf;
              }
            }
          }
        } catch {
          downloadedValidPng = false;
        }
      }

      if (!downloadedValidPng) {
        cachedPngBytes = encodeQrMatrixToPngBytes(activeTicket.qrMatrix, 520, 4);
        targetFile.create({ overwrite: true });
        targetFile.writeSync(cachedPngBytes);
      }

      // Request write permission on iOS / Development Builds.
      // Note: On Android inside Expo Go, `requestPermissionsAsync` rejects by design,
      // while `MediaLibrary.Asset.create` still works directly via MediaStore on Android 11+.
      let expoGoAndroidLimited = false;
      try {
        const permission = await MediaLibrary.requestPermissionsAsync(true, [
          'photo',
        ]);
        if (!permission.granted) {
          Alert.alert(
            'Izin Galeri Diperlukan',
            'Aktifkan izin penyimpanan foto agar QR E-Ticket dapat disimpan ke galeri perangkat Anda.'
          );
          return;
        }
      } catch (permErr: any) {
        const permMsg = permErr instanceof Error ? permErr.message : String(permErr || '');
        if (
          Platform.OS === 'android' &&
          (permMsg.includes('Expo Go') || permMsg.includes('development build'))
        ) {
          expoGoAndroidLimited = true;
        } else {
          throw permErr;
        }
      }

      let savedLocationLabel = 'galeri perangkat Anda';
      try {
        await MediaLibrary.Asset.create(targetFile.uri);
      } catch (createErr) {
        if (!expoGoAndroidLimited) {
          throw createErr;
        }
        // Fallback for older Android (<= 10) inside Expo Go where MediaStore write permission is blocked:
        // let user pick a folder (e.g. Pictures / Downloads) via Storage Access Framework.
        let pickedDir: Directory | null = null;
        try {
          pickedDir = await Directory.pickDirectoryAsync();
        } catch {
          return;
        }
        if (!pickedDir) return;
        const safFile = pickedDir.createFile(fileName, 'image/png');
        safFile.writeSync(
          cachedPngBytes || encodeQrMatrixToPngBytes(activeTicket.qrMatrix, 520, 4)
        );
        savedLocationLabel = `folder "${pickedDir.name || 'pilihan Anda'}"`;
      }

      setSavedKeys(prev => ({ ...prev, [activeTicket.key]: true }));
      Alert.alert(
        'Tersimpan di Galeri!',
        `QR Code E-Ticket untuk Kursi ${activeTicket.seatLabel}\nKode: ${activeTicket.kodeUnik}\n\nGambar (${fileName}) berhasil disimpan ke ${savedLocationLabel}.`
      );
    } catch (err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan gambar QR ke galeri.';
      Alert.alert('Gagal Menyimpan', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const isCurrentSaved = Boolean(activeTicket && savedKeys[activeTicket.key]);

  return {
    orderId,
    displayArtist,
    displayTour,
    displayDate,
    displayTime,
    displayVenue,
    categoryName: activeTicket?.categoryName || categoryName,
    allSeatsSummary,
    totalTickets,
    ticketEntries,
    selectedIndex,
    activeTicket,
    activeQrDataUri,
    isSaving,
    isCurrentSaved,
    getHeroImage,
    setSelectedIndex,
    handleBack,
    handleSimpanKeGaleri,
  };
}
