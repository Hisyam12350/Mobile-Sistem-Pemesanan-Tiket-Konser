import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiException, authApi, LoginResponse } from '@/api/authApi';

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@auth_user',
};

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (): Promise<LoginResponse | null> => {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Format email tidak valid';
    }
    if (!password) {
      nextErrors.password = 'Password wajib diisi';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return null;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.login(email.trim().toLowerCase(), password);
      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      if (error instanceof ApiException && error.data?.errors) {
        const fieldErrors = error.data.errors;
        setErrors({
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
          general:
            !fieldErrors.email && !fieldErrors.password
              ? error.data?.message || error.message
              : undefined,
        });
        return null;
      }
      const errMessage = error instanceof Error ? error.message : String(error);
      setErrors({
        general: error instanceof ApiException
          ? error.data?.message || error.message
          : errMessage || 'Terjadi kesalahan yang tidak diketahui',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    passwordVisible,
    togglePasswordVisibility: () => setPasswordVisible(visible => !visible),
    handleSubmit,
  };
}