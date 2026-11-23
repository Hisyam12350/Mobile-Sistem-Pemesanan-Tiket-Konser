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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { homeStyles as styles } from '@/styles/home/homeStyles';
import { useHomeController } from '@/controllers/home/useHomeController';

export default function HomeScreen() {
  const {
    user,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    isLoadingEvents,
    isRefreshing,
    categories,
    displayEvents,
    onRefresh,
    formatEventDate,
    getEventPoster,
    getEventPrice,
    handleOpenDetail,
    handleSearchSubmit,
    handleTabPress,
  } = useHomeController();

  const renderCategoryIcon = (categoryId: string, color: string) => {
    switch (categoryId) {
      case 'All':
        return <Ionicons name="grid-outline" size={22} color={color} />;
      case 'Music':
        return <Ionicons name="musical-notes-outline" size={22} color={color} />;
      case 'Festival':
        return <MaterialCommunityIcons name="equalizer-outline" size={24} color={color} />;
      case 'K-Pop':
        return <Ionicons name="sparkles-outline" size={22} color={color} />;
      case 'Pop':
        return <MaterialCommunityIcons name="waveform" size={22} color={color} />;
      default:
        return <Ionicons name="musical-notes-outline" size={22} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
          {/* Top Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingTitle}>
                Hello, {user?.username || 'User'} 👋
              </Text>
              <Text style={styles.greetingSubtitle}>Find your favorite concert</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={26} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#737373"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search concert, artist, or venue"
                placeholderTextColor="#888888"
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color="#999999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Featured Concert Banner (Coldplay) */}
          <View style={styles.bannerContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.bannerCard}
              onPress={() => handleOpenDetail('78')}
            >
              <Image
                source={require('@/assets/images/coldplay-banner.png')}
                style={styles.bannerImage}
                contentFit="cover"
                priority="high"
              />
            </TouchableOpacity>
          </View>

          {/* Categories Horizontal Row */}
          <View style={styles.categoriesContainer}>
            <View style={styles.categoriesRow}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat.id;
                const iconColor = isActive ? '#6F00FF' : '#000000';
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryItem}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.categoryBox,
                        isActive && styles.categoryBoxActive,
                      ]}
                    >
                      {renderCategoryIcon(cat.id, iconColor)}
                    </View>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isActive && styles.categoryLabelActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Recommended For You Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (displayEvents.length > 0) {
                  handleOpenDetail(displayEvents[0].id);
                }
              }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {isLoadingEvents && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6F00FF" />
              <Text style={styles.loadingText}>Memuat konser...</Text>
            </View>
          )}

          {/* Empty State */}
          {!isLoadingEvents && displayEvents.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes-outline" size={44} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? `Tidak ada konser dengan kata kunci "${searchQuery}"`
                  : 'Belum ada konser tersedia.'}
              </Text>
            </View>
          )}

          {/* List of Recommended Concert Cards (Clean without love logo) */}
          {displayEvents.map(event => {
            const eventSubtitle = event.deskripsi
              ? event.deskripsi.split('.')[0]
              : 'Live in Concert';

            return (
              <View key={String(event.id)} style={styles.cardContainer}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={styles.concertCard}
                  onPress={() => handleOpenDetail(event.id)}
                >
                  <Image
                    source={getEventPoster(event)}
                    style={styles.cardPoster}
                    contentFit="cover"
                  />

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {event.nama_event}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.cardSubtitle} numberOfLines={1}>
                        {eventSubtitle}
                      </Text>
                      <Text style={styles.cardVenue} numberOfLines={1}>
                        {event.lokasi || 'Jakarta'}
                      </Text>
                      <Text style={styles.cardDate}>
                        {formatEventDate(event.waktu_event)}
                      </Text>
                    </View>

                    <View style={styles.cardPriceRow}>
                      <Text style={styles.cardFromText}>From</Text>
                      <Text style={styles.cardPriceText}>{getEventPrice(event)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => handleTabPress('Home')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'Home' ? 'home' : 'home-outline'}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => handleTabPress('Search')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'Search' ? 'search' : 'search-outline'}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.navLabel}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => handleTabPress('Tickets')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={activeTab === 'Tickets' ? 'ticket-confirmation' : 'ticket-confirmation-outline'}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.navLabel}>Tickets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => handleTabPress('Profile')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'Profile' ? 'person' : 'person-outline'}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
