import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/api/config';

export interface TicketItem {
  id: string | number;
  order_id?: string | number;
  event_id?: string | number;
  kategori_id?: string | number;
  seat_id?: string | number;
  kode_unik?: string;
  status_tiket?: string;
  scanned_at?: string | null;
  created_at?: string;
  nama_kategori?: string;
  nama_category?: string;
  nomor_kursi?: string;
  nama_event?: string;
  waktu_event?: string;
  deskripsi?: string;
  lokasi?: string;
  banner_url?: string | null;
  qty?: number;
  qr_code_svg?: string;
}

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = (await AsyncStorage.getItem('@auth_token'))?.trim() || null;

  if (!token) {
    throw new Error('401: No auth token');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      await AsyncStorage.removeItem('@auth_token');
      throw new Error('401: Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const ticketApi = {
  async getMyTickets(): Promise<TicketItem[]> {
    try {
      const json: any = await fetchWithAuth('/tickets');
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getTicketById(id: string | number): Promise<TicketItem | null> {
    try {
      const json: any = await fetchWithAuth(`/tickets/${id}`);
      return json?.data || null;
    } catch {
      return null;
    }
  },

  async getTicketQrDownloadConfig(
    id: string | number
  ): Promise<{ url: string; headers: Record<string, string> } | null> {
    const token = (await AsyncStorage.getItem('@auth_token'))?.trim() || null;
    if (!token) return null;
    return {
      url: `${API_BASE_URL}/tickets/${id}/download`,
      headers: { Authorization: `Bearer ${token}` },
    };
  },
};
