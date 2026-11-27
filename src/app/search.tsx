import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { searchStyles as styles } from '@/styles/search/searchStyles';
import { useSearchController } from '@/controllers/search/useSearchController';
import { BottomNav } from '@/components/bottom-nav';

export default function SearchScreen() {
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterTabs,
    activeTab,
    isLoading,
    isRefreshing,
    displayEvents,
    onRefresh,
    formatEventDate,
    getEventPoster,
    getEventSubtitle,
    getEventPrice,
    getVenueDisplay,
    handleOpenDetail,
    handleCancel,
    handleTabPress,
  } = useSearchController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Search Input & Cancel Row */}
        <View style={styles.headerSearchContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#666666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search concert, artist, or venue"
                placeholderTextColor="#888888"
                returnKeyType="search"
                autoCapitalize="words"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.7}
                  style={styles.clearIcon}
                >
                  <Ionicons name="close-circle" size={18} color="#999999" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs: All, Concert, Venue */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {filterTabs.map(tab => {
              const isActive = activeFilter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabItem}
                  onPress={() => setActiveFilter(tab)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.tabsDivider} />

        {/* Scrollable Content (Concerts List from API, NO Artist section) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#6F00FF']}
              tintColor="#6F00FF"
            />
          }
        >
          {/* Section Title */}
          <Text style={styles.sectionTitle}>Concerts</Text>

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6F00FF" />
              <Text style={styles.loadingText}>Memuat konser dari API...</Text>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && displayEvents.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? `Tidak ada konser untuk "${searchQuery}"`
                  : 'Belum ada konser tersedia.'}
              </Text>
            </View>
          )}

          {/* Concerts List from API */}
          {displayEvents.map(event => (
            <TouchableOpacity
              key={String(event.id)}
              style={styles.concertItem}
              activeOpacity={0.85}
              onPress={() => handleOpenDetail(event.id)}
            >
              <Image
                source={getEventPoster(event)}
                style={styles.posterImage}
                contentFit="cover"
              />

              <View style={styles.concertInfo}>
                <Text style={styles.concertTitle} numberOfLines={1}>
                  {event.nama_event}
                </Text>
                <Text style={styles.concertSubtitle} numberOfLines={1}>
                  {getEventSubtitle(event)}
                </Text>
                <Text style={styles.concertVenue} numberOfLines={1}>
                  {getVenueDisplay(event)}
                </Text>
                <Text style={styles.concertDate}>
                  {formatEventDate(event.waktu_event)}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.fromText}>From</Text>
                  <Text style={styles.priceText}>{getEventPrice(event)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab as any} onTabPress={handleTabPress} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
