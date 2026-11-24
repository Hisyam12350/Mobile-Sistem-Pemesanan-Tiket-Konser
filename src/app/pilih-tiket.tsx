import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { pilihTiketStyles as styles } from '@/styles/pilihTiket/pilihTiketStyles';
import { usePilihTiketController } from '@/controllers/pilihTiket/usePilihTiketController';

export default function PilihTiketScreen() {
  const {
    categories,
    quantities,
    totalTickets,
    totalPrice,
    isLoading,
    increment,
    decrement,
    handleBack,
    handleLanjutkan,
  } = usePilihTiketController();

  const isDisabled = totalTickets === 0;

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Pilih Tiket</Text>
          <Text style={styles.headerSubtitle}>Pilih kategori dan jumlah tiket</Text>
        </View>

        {/* Category List */}
        <View style={styles.categoryList}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6F00FF" />
              <Text style={styles.loadingText}>Memuat kategori tiket...</Text>
            </View>
          ) : (
            categories.map(cat => {
              const qty = quantities[cat.id] || 0;
              return (
                <View key={cat.id} style={styles.categoryCard}>
                  <View style={styles.categoryRow}>
                    <View style={[styles.tierIndicator, { backgroundColor: cat.color }]} />
                    <Text style={styles.tierName}>{cat.name}</Text>
                    <Text style={styles.tierPrice}>{cat.price}</Text>
                  </View>
                  <Text style={styles.seeBenefit}>See Benefit</Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={[styles.qtyButton, qty === 0 && styles.qtyButtonDisabled]}
                      onPress={() => decrement(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="remove"
                        size={20}
                        color={qty === 0 ? '#CCCCCC' : '#111111'}
                      />
                    </TouchableOpacity>
                    <View style={styles.qtyValue}>
                      <Text style={styles.qtyText}>{qty}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => increment(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={20} color="#111111" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalLabelBold}>{totalTickets} Tiket</Text>
          </View>
          <Text style={styles.totalPrice}>Rp.{totalPrice.toLocaleString('id-ID')}</Text>
        </View>
        <TouchableOpacity
          style={[styles.lanjutkanButton, isDisabled && styles.lanjutkanButtonDisabled]}
          onPress={handleLanjutkan}
          activeOpacity={0.8}
          disabled={isDisabled}
        >
          <Text style={styles.lanjutkanButtonText}>Lanjutkan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}