import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { detailConcertStyles as styles } from '@/styles/detailConcert/detailConcertStyles';
import { useDetailConcertController } from '@/controllers/detailConcert/useDetailConcertController';

export default function DetailConcertScreen() {
  const {
    categories,
    isLoading,
    isFavorite,
    isExpanded,
    displayArtist,
    displayTitle,
    displayVenue,
    displayDate,
    displayDescription,
    getHeroImage,
    handleBack,
    toggleFavorite,
    toggleExpanded,
    handlePilihTiket,
  } = useDetailConcertController();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={getHeroImage()}
            style={styles.heroImage}
            contentFit="cover"
            priority="high"
          />

          {/* Top Bar Actions */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleFavorite}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#E53935' : '#000000'}
              />
            </TouchableOpacity>
          </View>

          {/* Concert Title & Location Info Overlay */}
          <View style={styles.heroContent}>
            <Text style={styles.concertArtist}>{displayArtist}</Text>
            <Text style={styles.concertTitle}>{displayTitle}</Text>

            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={16} color="#E53935" />
              <Text style={styles.metaText}>{displayVenue}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
              <Text style={styles.metaText}>{displayDate}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Sheet Content */}
        <View style={styles.sheetContainer}>
          {/* About Concert */}
          <Text style={styles.sectionTitle}>About Concert</Text>
          <Text style={styles.aboutText} numberOfLines={isExpanded ? undefined : 3}>
            {displayDescription}
          </Text>
          <TouchableOpacity
            onPress={toggleExpanded}
            activeOpacity={0.7}
          >
            <Text style={styles.readMoreText}>
              {isExpanded ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>

          {/* Ticket Price List */}
          <Text style={styles.sectionTitle}>Ticket Price</Text>
          {isLoading ? (
            <ActivityIndicator color="#6F00FF" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.priceList}>
              {categories.map(tier => (
                <View key={tier.id} style={styles.priceRow}>
                  <View style={styles.priceTierLeft}>
                    <View style={[styles.tierIndicator, { backgroundColor: tier.color }]} />
                    <Text style={styles.tierName}>{tier.name}</Text>
                  </View>
                  <Text style={styles.tierPrice}>{tier.price}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Button: Pilih Tiket */}
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.88}
            onPress={handlePilihTiket}
          >
            <Text style={styles.actionButtonText}>Pilih Tiket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
