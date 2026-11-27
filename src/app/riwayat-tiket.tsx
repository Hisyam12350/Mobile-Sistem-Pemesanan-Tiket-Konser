import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { riwayatTiketStyles as styles } from '@/styles/riwayatTiket/riwayatTiketStyles';
import { useRiwayatTiketController } from '@/controllers/riwayatTiket/useRiwayatTiketController';
import { BottomNav } from '@/components/bottom-nav';

export default function RiwayatTiketScreen() {
  const {
    activeTab,
    filteredTickets,
    isLoading,
    getTicketPoster,
    handleTabPress,
    handleBottomTabPress,
    handleOpenDetail,
    handleBack,
  } = useRiwayatTiketController();

  const tabs: ('Upcoming' | 'Completed' | 'Canceled')[] = [
    'Upcoming',
    'Completed',
    'Canceled',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={{ marginBottom: 16 }}
          >
            <Ionicons name="arrow-back" size={26} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat Tiket</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabPillText, isActive && styles.tabPillTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ticket List */}
        <View style={styles.categoryList}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6F00FF" />
              <Text style={styles.loadingText}>Memuat riwayat tiket...</Text>
            </View>
          ) : filteredTickets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada tiket pada tab ini.</Text>
            </View>
          ) : (
            filteredTickets.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.ticketCard}
                onPress={() => handleOpenDetail(item.id)}
                activeOpacity={0.85}
              >
                <Image
                  source={getTicketPoster(item)}
                  style={styles.poster}
                  contentFit="cover"
                />
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketArtist}>{item.artist}</Text>
                  <Text style={styles.ticketTour}>{item.tour}</Text>
                  <Text style={styles.ticketDateTime}>
                    {item.date} • {item.time}
                  </Text>
                  <Text style={styles.ticketVenue}>{item.venue}</Text>
                </View>
                <View
                  style={[
                    styles.ticketBadge,
                    item.isPendingPayment && styles.ticketBadgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.ticketBadgeText,
                      item.isPendingPayment && styles.ticketBadgeTextPending,
                    ]}
                  >
                    {item.isPendingPayment
                      ? 'Pending'
                      : `${item.tickets} Tiket`}
                  </Text>
                  {item.isPendingPayment && (
                    <Text style={styles.pendingSubText}>Buka QRIS</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="Tickets" onTabPress={handleBottomTabPress as any} />
    </SafeAreaView>
  );
}