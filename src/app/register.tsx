import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useRegister } from '@/controllers/register/useRegister';
import { registerStyles as styles } from '@/styles/register/registerStyles';

export default function RegisterScreen() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    formData,
    errors,
    isLoading,
    passwordVisible,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useRegister();

  const handleSubmitPress = async () => {
    const response = await handleSubmit();
    if (response?.success) {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Ionicons
                name="notifications-outline"
                size={38}
                color="#000000"
                style={styles.bellIcon}
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sing up to get started</Text>
            </View>

            {/* General Error */}
            {errors.general ? (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Full Name Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={value => handleChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#777777"
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Email Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={value => handleChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#777777"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={value => handleChange('password', value)}
                  placeholder="Create password"
                  placeholderTextColor="#777777"
                  secureTextEntry={!passwordVisible}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={togglePasswordVisibility}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={value => handleChange('confirmPassword', value)}
                  placeholder="Confirm password"
                  placeholderTextColor="#777777"
                  secureTextEntry={!confirmPasswordVisible}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmitPress}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setConfirmPasswordVisible(prev => !prev)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Terms of Service Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(value => !value)}
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreedToTerms }}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms ? (
                  <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                ) : null}
              </View>
              <Text style={styles.termsText}>I agree to the</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.termsLink}>Terms of service</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Sign up Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmitPress}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign up</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={styles.linkPrimary}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
