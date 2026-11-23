import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:5000/api`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

export interface EventItem {
  id: string | number;
  nama_event: string;
  lokasi: string;
  waktu_event: string;
  banner_url?: string | null;
  status: string;
  deskripsi?: string | null;
  detail_lokasi?: string | null;
  venue_id?: string | number | null;
  genre_id?: string | number | null;
}

export interface TicketCategoryItem {
  id: string | number;
  event_id: string | number;
  nama_kategori: string;
  harga: number | string;
  kuota_total: number;
  kuota_tersedia?: number;
}

export interface GenreItem {
  id: string | number;
  nama_genre: string;
  deskripsi?: string;
}

async function fetchWithTimeout<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const eventApi = {
  async getEvents(): Promise<EventItem[]> {
    try {
      const json: any = await fetchWithTimeout('/events');
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch (error) {
      console.warn('Gagal memuat events dari API:', error);
      return [];
    }
  },

  async getEventById(id: string | number): Promise<EventItem | null> {
    try {
      const json: any = await fetchWithTimeout(`/events/${id}`);
      return json?.data || null;
    } catch (error) {
      console.warn(`Gagal memuat detail event ${id} dari API:`, error);
      return null;
    }
  },

  async getTicketCategories(eventId?: string | number): Promise<TicketCategoryItem[]> {
    try {
      const endpoint = eventId ? `/ticket-categories?event_id=${eventId}` : '/ticket-categories';
      const json: any = await fetchWithTimeout(endpoint);
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch (error) {
      console.warn('Gagal memuat kategori tiket dari API:', error);
      return [];
    }
  },

  async getGenres(): Promise<GenreItem[]> {
    try {
      const json: any = await fetchWithTimeout('/genres');
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch (error) {
      console.warn('Gagal memuat genres dari API:', error);
      return [];
    }
  },
};
