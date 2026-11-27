import { API_BASE_URL } from '@/api/config';

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
    } catch {
      return [];
    }
  },

  async getEventById(id: string | number): Promise<EventItem | null> {
    try {
      const json: any = await fetchWithTimeout(`/events/${id}`);
      return json?.data || null;
    } catch {
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
    } catch {
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
    } catch {
      return [];
    }
  },
};
