import { StyleSheet } from 'react-native';

export const pilihTiketStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
  },
  categoryList: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 14,
  },
  categoryCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierIndicator: {
    width: 22,
    height: 14,
    borderRadius: 5,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginLeft: 12,
  },
  tierPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginLeft: 'auto',
  },
  seeBenefit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6F00FF',
    marginTop: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    justifyContent: 'flex-end',
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyButtonDisabled: {
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  qtyValue: {
    width: 40,
    height: 36,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    color: '#666666',
  },
  totalLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6F00FF',
  },
  lanjutkanButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: '#6F00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lanjutkanButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  lanjutkanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
});