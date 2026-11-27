import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { paymentMethodStyles as styles } from '@/styles/paymentMethod/paymentMethodStyles';
import {
  usePaymentMethodController,
  PaymentMethodItem,
  QRIS_MATRIX,
} from '@/controllers/paymentMethod/usePaymentMethodController';
import { formatRupiah } from '@/controllers/checkout/useCheckoutController';

export default function PaymentMethodScreen() {
  const {
    methods,
    selectedMethodId,
    totalPayment,
    displayArtist,
    seatLabels,
    orderReference,
    qrCodeUrl,
    urlCopied,
    formattedCountdown,
    isSubmitting,
    isQrisModalVisible,
    isDownloadingQris,
    qrisDownloaded,
    handleSelectMethod,
    handleBack,
    handleTermsPress,
    handlePilihPembayaran,
    handleCopyQrUrl,
    handleDownloadQris,
    handleCloseQrisModal,
  } = usePaymentMethodController();

  const renderVisaMastercard = () => (
    <View style={styles.cardLogoRow}>
      <Text style={styles.visaText}>VISA</Text>
      <View style={styles.mcCircles}>
        <View style={styles.mcRed} />
        <View style={styles.mcYellow} />
      </View>
    </View>
  );

  const renderBrandRight = (method: PaymentMethodItem) => {
    switch (method.brand) {
      case 'bca':
        return <Text style={styles.bcaText}>BCA</Text>;
      case 'bri':
        return (
          <View style={styles.briBadge}>
            <View style={styles.briBox}>
              <Text style={styles.briBoxText}>B</Text>
            </View>
            <Text style={styles.briText}>BRI</Text>
          </View>
        );
      case 'mandiri':
        return (
          <View style={styles.mandiriWrap}>
            <View style={styles.mandiriRibbon} />
            <Text style={styles.mandiriText}>mandiri</Text>
          </View>
        );
      case 'bni':
        return (
          <View style={styles.bniBadge}>
            <View style={styles.bniIconBox}>
              <Text style={styles.bniIconText}>46</Text>
            </View>
            <Text style={styles.bniText}>BNI</Text>
          </View>
        );
      case 'card':
        return renderVisaMastercard();
      case 'qris':
        return (
          <View style={styles.qrisBadge}>
            <Text style={styles.qrisBadgeText}>QRIS</Text>
            <View style={styles.qrisRedDot} />
          </View>
        );
      default:
        return null;
    }
  };

  const hasRemoteQrImage =
    Boolean(qrCodeUrl) &&
    qrCodeUrl.startsWith('http') &&
    qrCodeUrl.includes('/qr-code');

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
          <Text style={styles.headerTitle}>Pilih Metode Pembayaran</Text>
          <Text style={styles.headerSubtitle}>Pilih metode pembayaran</Text>
        </View>

        {/* Payment Method Cards */}
        {methods.map(method => {
          const isSelected = selectedMethodId === method.id;
          const isEwallet = method.brand === 'ewallet';

          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardActive,
              ]}
              onPress={() => handleSelectMethod(method)}
              activeOpacity={0.8}
            >
              <View style={styles.methodTopRow}>
                <View style={styles.methodLeftRow}>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  {method.isEnabled && (
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>Aktif</Text>
                    </View>
                  )}
                </View>

                {!isEwallet && (
                  <View style={styles.brandRight}>
                    {renderBrandRight(method)}
                  </View>
                )}
              </View>

              {/* E-Wallet Sub-row Logos matching Mockup */}
              {isEwallet && (
                <View style={styles.ewalletRow}>
                  <Text style={styles.ovoText}>OVO</Text>
                  <View style={styles.danaBadge}>
                    <View style={styles.danaCircle} />
                    <Text style={styles.danaText}>DANA</Text>
                  </View>
                  {renderVisaMastercard()}
                  {renderVisaMastercard()}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Summary & Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalValue}>{formatRupiah(totalPayment)}</Text>
        </View>

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

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Dengan Melanjutkan, kamu menyetujui{'\n'}
            <Text style={styles.termsLink} onPress={handleTermsPress}>
              Syarat & Ketentuan
            </Text>{' '}
            yang berlaku
          </Text>
        </View>
      </View>

      {/* QRIS Payment Modal (Auto-Polling without manual "Saya Sudah Bayar" button) */}
      <Modal
        visible={isQrisModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseQrisModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.qrisModalCard}>
            {/* Modal Header */}
            <View style={styles.qrisModalHeader}>
              <View style={styles.qrisTitleRow}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={22}
                  color="#6F00FF"
                />
                <Text style={styles.qrisModalTitle}>Pembayaran QRIS</Text>
              </View>
              <View style={styles.qrisBadge}>
                <Text style={styles.qrisBadgeText}>QRIS</Text>
                <View style={styles.qrisRedDot} />
              </View>
            </View>

            <Text style={styles.merchantName}>CONCERTIX INDONESIA</Text>
            <Text style={styles.merchantNmid}>
              Order ID: {orderReference || 'CX-240S28-0012'}
            </Text>

            {/* Scannable QR Code (Real Midtrans Sandbox QR Image or Visual Matrix fallback) */}
            <View style={styles.qrFrame}>
              {hasRemoteQrImage ? (
                <Image
                  source={{ uri: qrCodeUrl }}
                  style={styles.qrRemoteImage}
                  contentFit="contain"
                />
              ) : (
                QRIS_MATRIX.map((row, rIdx) => (
                  <View key={`r-${rIdx}`} style={styles.qrRow}>
                    {row.map((cell, cIdx) => (
                      <View
                        key={`c-${rIdx}-${cIdx}`}
                        style={[
                          styles.qrCell,
                          cell === 1 ? styles.qrCellDark : styles.qrCellLight,
                        ]}
                      />
                    ))}
                  </View>
                ))
              )}
            </View>

            {/* Midtrans Sandbox QR Code Image URL Box + Copy Button */}
            {Boolean(qrCodeUrl) && (
              <View style={styles.sandboxUrlBox}>
                <View style={styles.sandboxUrlHeader}>
                  <Text style={styles.sandboxUrlLabel}>
                    QR Code Image URL (Midtrans Sandbox)
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.copyUrlButton,
                      urlCopied && styles.copyUrlButtonSuccess,
                    ]}
                    onPress={handleCopyQrUrl}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={urlCopied ? 'checkmark' : 'copy-outline'}
                      size={12}
                      color="#FFFFFF"
                    />
                    <Text style={styles.copyUrlButtonText}>
                      {urlCopied ? 'Tersalin' : 'Salin URL'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={styles.sandboxUrlText}
                  selectable
                  numberOfLines={2}
                >
                  {qrCodeUrl}
                </Text>
              </View>
            )}

            {/* Countdown Timer */}
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={15} color="#E65100" />
              <Text style={styles.timerText}>
                Berlaku selama {formattedCountdown}
              </Text>
            </View>

            {/* Transaction Summary */}
            <View style={styles.qrisInfoBox}>
              <View style={styles.qrisInfoRow}>
                <Text style={styles.qrisInfoLabel}>Event</Text>
                <Text style={styles.qrisInfoValue} numberOfLines={1}>
                  {displayArtist}
                </Text>
              </View>
              <View style={styles.qrisInfoRow}>
                <Text style={styles.qrisInfoLabel}>Kursi</Text>
                <Text style={styles.qrisInfoValue} numberOfLines={1}>
                  {seatLabels}
                </Text>
              </View>
              <View style={[styles.qrisInfoRow, { marginBottom: 0 }]}>
                <Text style={styles.qrisInfoLabel}>Total Tagihan</Text>
                <Text style={styles.qrisAmountValue}>
                  {formatRupiah(totalPayment)}
                </Text>
              </View>
            </View>

            {/* Auto-Polling Status Indicator (Replaces manual "Saya Sudah Bayar" button) */}
            <View style={styles.pollingRow}>
              <ActivityIndicator size="small" color="#6F00FF" />
              <Text style={styles.pollingText}>
                Menunggu pembayaran... Status dicek otomatis
              </Text>
            </View>

            {/* Download QRIS Button */}
            <TouchableOpacity
              style={[
                styles.downloadQrisButton,
                qrisDownloaded && styles.downloadQrisButtonSuccess,
              ]}
              onPress={handleDownloadQris}
              activeOpacity={0.8}
              disabled={isDownloadingQris}
            >
              {isDownloadingQris ? (
                <ActivityIndicator color="#6F00FF" size="small" />
              ) : (
                <>
                  <Ionicons
                    name={
                      qrisDownloaded
                        ? 'checkmark-circle-outline'
                        : 'download-outline'
                    }
                    size={19}
                    color={qrisDownloaded ? '#059669' : '#6F00FF'}
                  />
                  <Text
                    style={[
                      styles.downloadQrisText,
                      qrisDownloaded && styles.downloadQrisTextSuccess,
                    ]}
                  >
                    {qrisDownloaded
                      ? 'QRIS Tersimpan (Unduh Lagi)'
                      : 'Download QRIS'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelModalButton}
              onPress={handleCloseQrisModal}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelModalText}>
                Tutup (Simpan sebagai Pending)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
