import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090014',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  hero: {
    paddingTop: 10,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090014',
  },
  heroHeader: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717A',
  },
  avatarContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#FFFFFF',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  heroEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#DCDCDC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7A7A7A',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#888888',
  },
  statLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  menuList: {
    marginBottom: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  menuIcon: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  menuChevron: {
    marginLeft: 8,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  logoutIcon: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E55353',
  },
});

