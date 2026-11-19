import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type StoredUser = {
  username?: string;
  email?: string;
};

export default function HomeScreen() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('@auth_user').then(value => {
      if (value) {
        setUser(JSON.parse(value) as StoredUser);
      }
    }).catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.brandMark}>
          <MaterialCommunityIcons name="ticket-confirmation-outline" size={23} color="#ffffff" />
        </View>
        <Text style={styles.brand}>Concertix</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons name="check" size={34} color="#ffffff" />
        </View>
        <Text style={styles.eyebrow}>LOGIN BERHASIL</Text>
        <Text style={styles.title}>Selamat datang,</Text>
        <Text style={styles.name}>{user?.username || 'Konser Lover'}!</Text>
        <Text style={styles.email}>{user?.email || 'Akun kamu sudah terhubung'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} accessibilityRole="button">
        <MaterialCommunityIcons name="logout" size={19} color="#7200ff" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f5fa',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#7200ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: '#17131d',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 52,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7200ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  eyebrow: {
    color: '#7200ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    color: '#24202a',
    fontSize: 23,
    fontWeight: '500',
  },
  name: {
    color: '#17131d',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 3,
  },
  email: {
    color: '#6f6978',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  logoutButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#d8c6f5',
    borderRadius: 10,
    marginBottom: 18,
  },
  logoutText: {
    color: '#7200ff',
    fontSize: 15,
    fontWeight: '600',
  },
});