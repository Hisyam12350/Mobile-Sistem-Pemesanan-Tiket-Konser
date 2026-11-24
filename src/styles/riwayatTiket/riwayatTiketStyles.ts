import { StyleSheet } from 'react-native';

export const riwayatTiketStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tabPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },
  tabPillActive: {
    backgroundColor: '#6F00FF',
  },
  tabPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  ticketCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 14,
    alignItems: 'center',
  },
  poster: {
    width: 78,
    height: 104,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    marginRight: 14,
  },
  ticketInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketArtist: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  ticketTour: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 4,
  },
  ticketDateTime: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 2,
  },
  ticketVenue: {
    fontSize: 13,
    color: '#444444',
  },
  ticketBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F0E6FF',
  },
  ticketBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F00FF',
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#6F00FF',
    height: 64,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});