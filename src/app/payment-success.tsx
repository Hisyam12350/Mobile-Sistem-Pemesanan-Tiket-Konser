import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { paymentSuccessStyles as styles } from '@/styles/paymentSuccess/paymentSuccessStyles';
import { usePaymentSuccessController } from '@/controllers/paymentSuccess/usePaymentSuccessController';

export default function PaymentSuccessScreen() {
  const {
    orderId,
    formattedTotalPayment,
    handleLihatETicket,
    handleTermsPress,
  } = usePaymentSuccessController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Celebration Checkmark Illustration */}
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('@/assets/images/payment-success.png')}
            style={styles.illustrationImage}
            contentFit="contain"
            priority="high"
          />
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Pembayaran Berhasil!</Text>
        <Text style={styles.subtitle}>
          Terima Kasih, pembayaranmu{'\n'}berhasil diproses.
        </Text>

        {/* Order ID & Total Payment Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order ID</Text>
            <Text style={styles.summaryValue}>{orderId}</Text>
          </View>

          <View style={[styles.summaryRow, styles.summaryRowSpacer]}>
            <Text style={styles.summaryLabel}>Total Pembayaran</Text>
            <Text style={styles.summaryValue}>{formattedTotalPayment}</Text>
          </View>
        </View>

        {/* Primary Button: Lihat E-Ticket */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLihatETicket}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Lihat E-Ticket</Text>
        </TouchableOpacity>

        {/* Syarat & Ketentuan Link */}
        <TouchableOpacity
          style={styles.termsButton}
          onPress={handleTermsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.termsText}>Syarat & Ketentuan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
