import { StyleSheet } from 'react-native';

export const checkoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 140,
  },
  header: {
    paddingTop: 22,
    paddingBottom: 18,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#333333',
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterImage: {
    width: 82,
    height: 112,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    marginRight: 14,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventArtist: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 3,
  },
  eventMeta: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 19,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 8,
  },
  accordionBody: {
    marginTop: 14,
  },
  detailRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '400',
  },
  detailValuesColumn: {
    alignItems: 'flex-end',
  },
  detailValue: {
    fontSize: 13,
    color: '#222222',
    fontWeight: '500',
    marginBottom: 4,
  },
  seatValueText: {
    flex: 1,
    fontSize: 13,
    color: '#222222',
    fontWeight: '500',
    textAlign: 'right',
    marginLeft: 16,
  },
  detailPriceValue: {
    fontSize: 13,
    color: '#111111',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  voucherButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingVertical: 4,
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voucherText: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 10,
  },
  voucherTextActive: {
    color: '#6F00FF',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 24,
  },
  payButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#6F00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
