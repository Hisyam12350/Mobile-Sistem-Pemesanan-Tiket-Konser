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

import { seatMapStyles as styles } from '@/styles/seatMap/seatMapStyles';
import {
  useSeatMapController,
  SeatBlock,
} from '@/controllers/seatMap/useSeatMapController';

export default function SeatMapScreen() {
  const {
    topRowBlocks,
    bottomRowBlocks,
    selectedSeatIds,
    totalTickets,
    totalPrice,
    isLoading,
    isSubmitting,
    toggleSeat,
    handleBack,
    handleLanjutkan,
  } = useSeatMapController();

  const isDisabled = totalTickets === 0 || isSubmitting || isLoading;

  const renderBlock = (block: SeatBlock) => {
    const blockStyle =
      block.position === 'left'
        ? styles.wingBlockLeft
        : block.position === 'right'
          ? styles.wingBlockRight
          : styles.centerBlock;

    const colStyle =
      block.columns === 3 ? styles.seatTouch3Col : styles.seatTouch4Col;

    if (block.seats.length === 0) {
      return <View key={block.id} style={[blockStyle, styles.emptyBlock]} />;
    }

    return (
      <View key={block.id} style={blockStyle}>
        <View style={styles.seatsGrid}>
          {block.seats.map(seat => {
            const isSelected = selectedSeatIds.includes(seat.id);
            const isLocked = seat.status === 'locked';
            const isSold = seat.status === 'sold';

            return (
              <TouchableOpacity
                key={seat.id}
                style={[styles.seatTouchArea, colStyle]}
                onPress={() => toggleSeat(seat)}
                disabled={isLoading || isSubmitting}
                activeOpacity={0.7}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <View
                  style={[
                    styles.seatDot,
                    isSelected && styles.seatDotSelected,
                    isLocked && styles.seatDotLocked,
                    isSold && styles.seatDotSold,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

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
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pilih Kategori Tiket</Text>
          <Text style={styles.headerSubtitle}>
            Pilih kategori dan jumlah tiket
          </Text>
        </View>

        {/* Legend Row: Available, Selected, Locked, Sold */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendBoxAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendBoxSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendBoxLocked]} />
            <Text style={styles.legendText}>Locked</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendBoxSold]} />
            <Text style={styles.legendText}>Sold</Text>
          </View>
        </View>

        {/* STAGE Oval */}
        <View style={styles.stageContainer}>
          <View style={styles.stageOval}>
            <Text style={styles.stageText}>STAGE</Text>
          </View>
        </View>

        {/* 6-Block Interactive Seat Map */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6F00FF" />
            <Text style={styles.loadingText}>Memuat status kursi...</Text>
          </View>
        ) : (
          <View style={styles.mapWrapper}>
            <View style={styles.mapRow}>
              {topRowBlocks.map(block => renderBlock(block))}
            </View>

            <View style={styles.mapRow}>
              {bottomRowBlocks.map(block => renderBlock(block))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Summary Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalSubLabel}>{totalTickets} Tiket</Text>
          </View>
          <Text style={styles.totalPrice}>
            Rp.{totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.lanjutkanButton,
            isDisabled && styles.lanjutkanButtonDisabled,
          ]}
          onPress={handleLanjutkan}
          activeOpacity={0.85}
          disabled={isDisabled}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.lanjutkanButtonText}>Lanjutkan</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
