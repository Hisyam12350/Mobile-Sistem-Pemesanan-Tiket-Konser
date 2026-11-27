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

import { checkoutStyles as styles } from '@/styles/checkout/checkoutStyles';
import {
  useCheckoutController,
  formatRupiah,
} from '@/controllers/checkout/useCheckoutController';

export default function CheckoutScreen() {
  const {
    displayArtist,
    displayTour,
    displayDateTime,
    displayVenue,
    categoryLines,
    seatDisplay,
    subtotal,
    serviceFee,
    voucherDiscount,
    totalPayment,
    selectedVoucher,
    isDetailOpen,
    isVoucherOpen,
    isSubmitting,
    getEventPoster,
    toggleDetailOpen,
    toggleVoucherOpen,
    handleVoucherPress,
    handleBack,
    handlePilihPembayaran,
  } = useCheckoutController();

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
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>Periksa kembali pesananmu</Text>
        </View>

        {/* Event Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event</Text>
          <View style={styles.eventRow}>
            <Image
              source={getEventPoster()}
              style={styles.posterImage}
              contentFit="cover"
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventArtist}>{displayArtist}</Text>
              <Text style={styles.eventMeta}>{displayTour}</Text>
              <Text style={styles.eventMeta}>{displayDateTime}</Text>
              <Text style={styles.eventMeta}>{displayVenue}</Text>
            </View>
          </View>
        </View>

        {/* Detail Pesanan Card (Collapsible) */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={toggleDetailOpen}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDetailOpen ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color="#000000"
            />
            <Text style={styles.accordionTitle}>Detail Pesanan</Text>
          </TouchableOpacity>

          {isDetailOpen && (
            <View style={styles.accordionBody}>
              {/* Kategori Row */}
              <View style={styles.detailRowTop}>
                <Text style={styles.detailLabel}>Kategori</Text>
                <View style={styles.detailValuesColumn}>
                  {categoryLines.map((line, idx) => (
                    <Text key={line + idx} style={styles.detailValue}>
                      {line}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Kursi Row */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kursi</Text>
                <Text style={styles.seatValueText}>{seatDisplay}</Text>
              </View>

              <View style={styles.divider} />

              {/* Subtotal Row */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subtotal</Text>
                <Text style={styles.detailPriceValue}>
                  {formatRupiah(subtotal)}
                </Text>
              </View>

              {/* Biaya Layanan Row */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Biaya Layanan</Text>
                <Text style={styles.detailPriceValue}>
                  {formatRupiah(serviceFee)}
                </Text>
              </View>

              {/* Optional Voucher Discount Row */}
              {voucherDiscount > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Diskon Voucher</Text>
                  <Text style={styles.discountValue}>
                    -{formatRupiah(voucherDiscount)}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              {/* Total Pembayaran Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Pembayaran</Text>
                <Text style={styles.totalValue}>
                  {formatRupiah(totalPayment)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Voucher Card (Collapsible) */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={toggleVoucherOpen}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isVoucherOpen ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color="#000000"
            />
            <Text style={styles.accordionTitle}>Voucher</Text>
          </TouchableOpacity>

          {isVoucherOpen && (
            <TouchableOpacity
              style={styles.voucherButtonRow}
              onPress={handleVoucherPress}
              activeOpacity={0.7}
            >
              <View style={styles.voucherLeft}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={18}
                  color={selectedVoucher ? '#6F00FF' : '#111111'}
                />
                <Text
                  style={[
                    styles.voucherText,
                    selectedVoucher && styles.voucherTextActive,
                  ]}
                >
                  {selectedVoucher
                    ? `${selectedVoucher.code} (-${formatRupiah(selectedVoucher.discount)})`
                    : 'Punya kode voucer?'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#111111" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payButton, isSubmitting && styles.payButtonDisabled]}
          onPress={handlePilihPembayaran}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.payButtonText}>Pilih Pembayaran</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
