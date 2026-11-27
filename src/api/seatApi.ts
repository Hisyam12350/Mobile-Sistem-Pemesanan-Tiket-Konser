import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/api/config';

export interface ApiSeatItem {
  id: number | string;
  kategori_id: number | string;
  nomor_kursi: string;
  status_kursi: 'available' | 'locked' | 'sold' | 'booked';
  locked_until?: string | null;
  locked_by_me?: boolean;
}

export interface LockSeatsResponse {
  success: boolean;
  message: string;
  data?: {
    locked_until: string;
    seats: ApiSeatItem[];
  };
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data?: {
    id: number | string;
    total_harga?: number | string;
    status?: string;
  };
}

async function fetchSeatsRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = (await AsyncStorage.getItem('@auth_token'))?.trim() || null;

  if (requireAuth && !token) {
    throw new Error('Silakan login terlebih dahulu untuk melanjutkan pemesanan kursi.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      await AsyncStorage.removeItem('@auth_token');
      throw new Error(data?.message || 'Sesi login telah berakhir. Silakan login kembali.');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server returned ${response.status}`);
    }

    return data as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const seatApi = {
  async getSeatsByCategory(kategoriId: string | number): Promise<ApiSeatItem[]> {
    try {
      const json: any = await fetchSeatsRequest(
        `/seats?kategori_id=${kategoriId}&_t=${Date.now()}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }
      );
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async lockSeats(seatIds: number[], minutes = 10): Promise<LockSeatsResponse> {
    return fetchSeatsRequest<LockSeatsResponse>(
      '/seats/lock',
      {
        method: 'POST',
        body: JSON.stringify({ seat_ids: seatIds, minutes }),
      },
      true
    );
  },

  async unlockSeats(seatIds: number[]): Promise<void> {
    if (seatIds.length === 0) return;
    await fetchSeatsRequest(
      '/seats/unlock',
      {
        method: 'POST',
        body: JSON.stringify({ seat_ids: seatIds }),
      },
      true
    );
  },

  async createOrder(seatIds: number[]): Promise<CreateOrderResponse> {
    return fetchSeatsRequest<CreateOrderResponse>(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify({ seat_ids: seatIds }),
      },
      true
    );
  },
};
