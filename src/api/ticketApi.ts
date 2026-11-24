import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri;
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

export interface TicketItem {
  id: string | number;
  order_id?: string | number;
  kategori_id?: string | number;
  seat_id?: string | number;
  kode_unik?: string;
  status_tiket?: string;
  scanned_at?: string | null;
  created_at?: string;
  nama_category?: string;
  nomor_kursi?: string;
  nama_event?: string;
  waktu_event?: string;
  qty?: number;
}

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = (await AsyncStorage.getItem('@auth_token'))?.trim() || null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export const ticketApi = {
  async getMyTickets(): Promise<TicketItem[]> {
    try {
      const json: any = await fetchWithAuth('/tickets');
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch (error) {
      console.warn('Gagal memuat tiket dari API:', error);
      return [];
    }
  },
};