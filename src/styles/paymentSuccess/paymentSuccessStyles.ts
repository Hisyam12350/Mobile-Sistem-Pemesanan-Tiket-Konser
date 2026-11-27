import { StyleSheet } from 'react-native';

export const paymentSuccessStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 36,
    alignItems: 'center',
  },
  illustrationWrapper: {
    width: 220,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 42,
  },
  summaryCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 42,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryRowSpacer: {
    marginTop: 22,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '800',
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#6F00FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  termsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 13.5,
    color: '#6F00FF',
    fontWeight: '500',
    textAlign: 'center',
  },
});
