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
      // Clear expired or invalid token silently
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
      // Gracefully return null without triggering console.warn
      return null;
    }
  },
};