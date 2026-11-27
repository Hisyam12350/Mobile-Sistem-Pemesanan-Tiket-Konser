import { StyleSheet } from 'react-native';

export const seatMapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 170,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 10,
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginTop: 26,
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 6,
  },
  legendBoxAvailable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#666666',
  },
  legendBoxSelected: {
    backgroundColor: '#6F00FF',
  },
  legendBoxLocked: {
    backgroundColor: '#F59E0B',
  },
  legendBoxSold: {
    backgroundColor: '#EF4444',
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
  stageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stageOval: {
    width: '78%',
    height: 104,
    borderRadius: 60,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
  },
  mapWrapper: {
    paddingHorizontal: 24,
    marginTop: 4,
  },
  mapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  wingBlockLeft: {
    width: '26%',
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    transform: [{ skewY: '15deg' }],
  },
  centerBlock: {
    width: '36%',
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 14,
  },
  wingBlockRight: {
    width: '26%',
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    transform: [{ skewY: '-15deg' }],
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  seatTouchArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  seatTouch3Col: {
    width: '31%',
  },
  seatTouch4Col: {
    width: '23%',
  },
  seatDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#666666',
  },
  seatDotSelected: {
    backgroundColor: '#6F00FF',
    borderColor: '#6F00FF',
    transform: [{ scale: 1.15 }],
  },
  seatDotLocked: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  seatDotSold: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  emptyBlock: {
    opacity: 0.25,
    minHeight: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#555555',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  totalSubLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  lanjutkanButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#6F00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lanjutkanButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  lanjutkanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
