import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { eTicketStyles as styles } from '@/styles/eTicket/eTicketStyles';
import { useETicketController } from '@/controllers/eTicket/useETicketController';

export default function ETicketScreen() {
  const insets = useSafeAreaInsets();
  const {
    orderId,
    displayArtist,
    displayTour,
    displayDate,
    displayTime,
    displayVenue,
    categoryName,
    allSeatsSummary,
    totalTickets,
    ticketEntries,
    selectedIndex,
    activeTicket,
    activeQrDataUri,
    isSaving,
    isCurrentSaved,
    getHeroImage,
    setSelectedIndex,
    handleBack,
    handleSimpanKeGaleri,
  } = useETicketController();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={getHeroImage()}
            style={styles.heroImage}
            contentFit="cover"
            priority="high"
          />

          <View style={styles.heroTopGradient} />
          <View style={styles.heroBottomGradient} />

          {/* Top Bar: Back Button & ORDER ID */}
          <View
            style={[
              styles.topBar,
              { top: Math.max(insets.top + 8, 40) },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.75}
            >
              <Ionicons name="arrow-back" size={22} color="#000000" />
            </TouchableOpacity>

            <View style={styles.orderIdBox}>
              <Text style={styles.orderIdLabel}>ORDER ID</Text>
              <Text
                style={styles.orderIdValue}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {orderId}
              </Text>
            </View>
          </View>

          {/* Artist & Tour Title Overlay */}
          <View style={styles.heroTitleContainer}>
            <Text style={styles.heroArtist} numberOfLines={1}>
              {displayArtist}
            </Text>
            <Text style={styles.heroTour} numberOfLines={1}>
              {displayTour}
            </Text>
          </View>
        </View>

        {/* White Ticket Sheet */}
        <View style={styles.sheetContainer}>
          {/* Date, Time, Venue Grid */}
          <View style={styles.infoGridRow}>
            <View style={styles.infoColLeft}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{displayDate}</Text>
            </View>

            <View style={styles.infoColCenter}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{displayTime}</Text>
            </View>

            <View style={styles.infoColRight}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {displayVenue}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* TICKET INFO Section */}
          <Text style={styles.sectionHeading}>TICKET INFO</Text>

          <View style={styles.infoGridRow}>
            <View style={styles.infoColLeft}>
              <Text style={styles.infoLabel}>Kategori</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {categoryName}
              </Text>
            </View>

            <View style={styles.infoColCenter}>
              <Text style={styles.infoLabel}>Kursi</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {ticketEntries.length > 1 && activeTicket
                  ? activeTicket.seatLabel
                  : allSeatsSummary}
              </Text>
            </View>

            <View style={styles.infoColRight}>
              <Text style={styles.infoLabel}>Jumlah</Text>
              <Text style={styles.infoValue}>{totalTickets} Tiket</Text>
            </View>
          </View>

          {/* Per-Seat Unique QR Switcher when order has > 1 ticket */}
          {ticketEntries.length > 1 && (
            <View style={styles.seatSelectorRow}>
              {ticketEntries.map((entry, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <TouchableOpacity
                    key={entry.key}
                    style={[
                      styles.seatPill,
                      isSelected && styles.seatPillActive,
                    ]}
                    onPress={() => setSelectedIndex(idx)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.seatPillText,
                        isSelected && styles.seatPillTextActive,
                      ]}
                    >
                      Kursi {entry.seatLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Scannable Unique QR Code */}
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              {activeQrDataUri ? (
                <Image
                  source={{ uri: activeQrDataUri }}
                  style={styles.qrImage}
                  contentFit="contain"
                />
              ) : null}
            </View>
            {activeTicket && (
              <Text style={styles.qrCodeTag}>{activeTicket.kodeUnik}</Text>
            )}
          </View>

          <Text style={styles.qrCaption}>
            Gunakan kode ini untuk masuk venue
          </Text>

          {/* Primary Action Button: Simpan ke Galeri */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              isCurrentSaved && styles.saveButtonSaved,
            ]}
            onPress={handleSimpanKeGaleri}
            activeOpacity={0.85}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={
                    isCurrentSaved
                      ? 'check-circle-outline'
                      : 'download-box-outline'
                  }
                  size={22}
                  color="#FFFFFF"
                  style={styles.saveButtonIcon}
                />
                <Text style={styles.saveButtonText}>
                  {isCurrentSaved
                    ? 'Tersimpan di Galeri'
                    : 'Simpan ke Galeri'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
