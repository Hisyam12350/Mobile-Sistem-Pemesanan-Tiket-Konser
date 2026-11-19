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
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { useLogin } from '@/controllers/login/useLogin';
import { loginStyles as styles } from '@/styles/login/loginStyles';

export default function LoginScreen() {
  const [rememberMe, setRememberMe] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    passwordVisible,
    togglePasswordVisibility,
    handleSubmit,
  } = useLogin();

  const submitLogin = async () => {
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
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Walcome Back! 👋</Text>
              <Text style={styles.subtitle}>Login to continue</Text>
            </View>

            {/* Error box */}
            {errors.general ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="User@concertix.com"
                  placeholderTextColor="#777777"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                />
              </View>
              {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
            </View>

            {/* Password Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#777777"
                  secureTextEntry={!passwordVisible}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={submitLogin}
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
              {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
            </View>

            {/* Options (Remember me & Forgot password) */}
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.remember}
                onPress={() => setRememberMe(value => !value)}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? (
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={submitLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>of continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.75}>
                <Image
                  source={require('@/assets/images/google-logo.png')}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                  contentFit="contain"
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.75}>
                <Ionicons
                  name="logo-apple"
                  size={22}
                  color="#000000"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.signup}>
            <Text style={styles.signupText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
