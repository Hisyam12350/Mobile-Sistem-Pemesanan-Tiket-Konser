import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/api/config';

export interface MeUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
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

export const userApi = {
  async getMe(): Promise<MeUser | null> {
    try {
      const json: any = await fetchWithAuth('/auth/me');
      if (json?.data) {
        return json.data as MeUser;
      }
      return null;
    } catch {
      return null;
    }
  },
};
