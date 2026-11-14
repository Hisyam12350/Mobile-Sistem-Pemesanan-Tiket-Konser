import { StyleSheet } from 'react-native';
import { Spacing, Colors } from '@/constants/theme';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  bellIcon: {
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.four,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.one,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    flex: 1,
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.two,
    padding: Spacing.one,
    zIndex: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: Spacing.half,
    marginLeft: Spacing.one,
  },
  generalErrorContainer: {
    marginBottom: Spacing.four,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: '#FED7D7',
    borderWidth: 1,
    borderColor: '#FEB2B2',
    width: '100%',
  },
  generalErrorText: {
    fontSize: 14,
    color: '#C53030',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.five,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
    borderRadius: 3,
    marginRight: Spacing.two,
    backgroundColor: Colors.light.background,
  },
  termsText: {
    fontSize: 14,
    color: Colors.light.text,
    marginRight: Spacing.one,
  },
  termsLink: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  button: {
    height: 52,
    borderRadius: Spacing.five,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.three,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: Spacing.two,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.five,
    gap: Spacing.one,
    width: '100%',
  },
  linkText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  linkPrimary: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
});