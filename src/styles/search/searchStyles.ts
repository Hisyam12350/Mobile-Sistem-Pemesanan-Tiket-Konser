import { StyleSheet } from 'react-native';

export const searchStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSearchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#000000',
    padding: 0,
  },
  clearIcon: {
    padding: 2,
  },
  cancelButton: {
    marginLeft: 14,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F00FF',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tabItem: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  tabsDivider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  concertItem: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 14,
  },
  posterImage: {
    width: 86,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#D1D1D1',
  },
  concertInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    height: 120,
    paddingVertical: 2,
    paddingRight: 4,
  },
  concertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  concertSubtitle: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 2,
  },
  concertVenue: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 2,
  },
  concertDate: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fromText: {
    fontSize: 13,
    color: '#222222',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6F00FF',
    marginLeft: 4,
  },
  loadingContainer: {
    paddingVertical: 36,
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
    fontSize: 15,
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
});
