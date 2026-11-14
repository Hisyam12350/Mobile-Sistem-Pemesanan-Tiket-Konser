import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRegister } from '@/controllers/register/useRegister';
import { registerStyles } from '@/styles/register/registerStyles';

export default function RegisterScreen() {
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
      (router as any).replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={registerStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={registerStyles.scrollView}
        contentContainerStyle={registerStyles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={registerStyles.headerContainer}>
          <MaterialCommunityIcons
            name="bell"
            size={48}
            color="#000000"
          />
          <ThemedText style={registerStyles.title} type="title">
            Create Account
          </ThemedText>
          <ThemedText style={registerStyles.subtitle} type="small">
            Sign up to get started
          </ThemedText>
        </View>

        {errors.general && (
          <ThemedView style={registerStyles.generalErrorContainer}>
            <ThemedText style={registerStyles.generalErrorText} type="small">
              {errors.general}
            </ThemedText>
          </ThemedView>
        )}

        <View style={registerStyles.inputContainer}>
          <ThemedText style={registerStyles.label} type="smallBold">
            Full Name
          </ThemedText>
          <TextInput
            style={[
              registerStyles.input,
              errors.name && registerStyles.inputError,
            ]}
            value={formData.name}
            onChangeText={value => handleChange('name', value)}
            placeholder="Enter your full name"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
          {errors.name && (
            <ThemedText style={registerStyles.errorText} type="small">
              {errors.name}
            </ThemedText>
          )}
        </View>

        <View style={registerStyles.inputContainer}>
          <ThemedText style={registerStyles.label} type="smallBold">
            Email
          </ThemedText>
          <TextInput
            style={[
              registerStyles.input,
              errors.email && registerStyles.inputError,
            ]}
            value={formData.email}
            onChangeText={value => handleChange('email', value)}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />
          {errors.email && (
            <ThemedText style={registerStyles.errorText} type="small">
              {errors.email}
            </ThemedText>
          )}
        </View>

        <View style={registerStyles.inputContainer}>
          <ThemedText style={registerStyles.label} type="smallBold">
            Password
          </ThemedText>
          <View style={registerStyles.inputWrapper}>
            <TextInput
              style={[
                registerStyles.input,
                errors.password && registerStyles.inputError,
                { paddingRight: 40 },
              ]}
              value={formData.password}
              onChangeText={value => handleChange('password', value)}
              placeholder="Create password"
              secureTextEntry={!passwordVisible}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
            />
            <TouchableOpacity
              style={registerStyles.eyeButton}
              onPress={togglePasswordVisibility}
              activeOpacity={0.6}
            >
              <MaterialCommunityIcons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={Colors.light.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <ThemedText style={registerStyles.errorText} type="small">
              {errors.password}
            </ThemedText>
          )}
        </View>

        <View style={registerStyles.inputContainer}>
          <ThemedText style={registerStyles.label} type="smallBold">
            Confirm Password
          </ThemedText>
          <View style={registerStyles.inputWrapper}>
            <TextInput
              style={[
                registerStyles.input,
                errors.confirmPassword && registerStyles.inputError,
                { paddingRight: 40 },
              ]}
              value={formData.confirmPassword}
              onChangeText={value => handleChange('confirmPassword', value)}
              placeholder="Confirm password"
              secureTextEntry={!passwordVisible}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmitPress}
            />
            <TouchableOpacity
              style={registerStyles.eyeButton}
              onPress={togglePasswordVisibility}
              activeOpacity={0.6}
            >
              <MaterialCommunityIcons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={Colors.light.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <ThemedText style={registerStyles.errorText} type="small">
              {errors.confirmPassword}
            </ThemedText>
          )}
        </View>

        <TouchableOpacity
          style={registerStyles.checkboxContainer}
          activeOpacity={0.6}
        >
          <View style={registerStyles.checkbox} />
          <ThemedText style={registerStyles.termsText} type="small">
            I agree to the
          </ThemedText>
          <ThemedText style={registerStyles.termsLink} type="smallBold">
            Terms of service
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            registerStyles.button,
            isLoading && registerStyles.buttonDisabled,
          ]}
          onPress={handleSubmitPress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View style={registerStyles.buttonLoading}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <ThemedText style={[registerStyles.buttonText, registerStyles.loadingText]} type="smallBold">
                Signing up...
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={registerStyles.buttonText} type="smallBold">
              Sign up
            </ThemedText>
          )}
        </TouchableOpacity>

        <View style={registerStyles.linkContainer}>
          <ThemedText style={registerStyles.linkText} type="small">
            Already have an account?
          </ThemedText>
          <TouchableOpacity onPress={() => (router as any).push('/login')}>
            <ThemedText style={registerStyles.linkPrimary} type="smallBold">
              Login
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}