import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { userApi, MeUser } from '@/api/userApi';

export interface StatItem {
  label: string;
  value: number | string;
}

export interface MenuItem {
  id: string;
  label: string;
  iconName: string;
  iconFamily: 'ionicons' | 'materialCommunity';
}

const DEFAULT_USER: MeUser = {
  id: 0,
  username: 'User',
  email: 'User1234@gmail.com',
  role: 'Customer',
};

const STATS: StatItem[] = [
  { label: 'Orders', value: 12 },
  { label: 'Orders', value: 24 },
  { label: 'Favorites', value: 8 },
];

const MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Personal Information', iconName: 'person-outline', iconFamily: 'ionicons' },
  { id: '2', label: 'Payment Methods', iconName: 'card-outline', iconFamily: 'ionicons' },
  { id: '3', label: 'My Vouchers', iconName: 'ticket-percent-outline', iconFamily: 'materialCommunity' },
  { id: '4', label: 'Notification', iconName: 'notifications-outline', iconFamily: 'ionicons' },
  { id: '5', label: 'Help Center', iconName: 'headset-outline', iconFamily: 'ionicons' },
  { id: '6', label: 'About Concertix', iconName: 'information-circle-outline', iconFamily: 'ionicons' },
];

export function useProfileController() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      // 1. Instantly read user from local cache
      try {
        const raw = await AsyncStorage.getItem('@auth_user');
        if (raw && isMounted) {
          try {
            const parsed = JSON.parse(raw) as Partial<MeUser>;
            if (parsed && (parsed.username || parsed.email)) {
              setUser({
                id: parsed.id || 0,
                username: parsed.username || 'User',
                email: parsed.email || 'User1234@gmail.com',
                role: parsed.role || 'Customer',
              });
            }
          } catch {
            // ignore parse error
          }
        } else if (isMounted) {
          setUser(DEFAULT_USER);
        }
      } catch {
        if (isMounted) {
          setUser(DEFAULT_USER);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      // 2. Silently refresh user profile in background if valid session exists
      try {
        const me = await userApi.getMe();
        if (isMounted && me) {
          setUser(me);
          await AsyncStorage.setItem('@auth_user', JSON.stringify(me));
        }
      } catch {
        // Silent fallback: keep local user data
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@auth_token');
              await AsyncStorage.removeItem('@auth_user');
            } catch {
              // ignore
            }
            (router as any).replace('/login');
          },
        },
      ]
    );
  };

  const handleMenuItemPress = (label: string) => {
    Alert.alert(label, `Menu "${label}" akan segera hadir!`);
  };

  const handleBottomTabPress = (tab: 'Home' | 'Search' | 'Tickets' | 'Profile') => {
    if (tab === 'Profile') {
      return;
    }
    if (tab === 'Tickets') {
      (router as any).push('/riwayat-tiket');
      return;
    }
    if (tab === 'Search') {
      (router as any).push('/search');
      return;
    }
    (router as any).replace('/home');
  };

  return {
    user,
    stats: STATS,
    menuItems: MENU_ITEMS,
    isLoading,
    handleLogout,
    handleMenuItemPress,
    handleBottomTabPress,
  };
}
