import { StyleSheet } from 'react-native';

export const bottomNavStyles = StyleSheet.create({
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
  bottomNavWhite: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
  navLabelWhite: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  navLabelActiveWhite: {
    color: '#6F00FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
