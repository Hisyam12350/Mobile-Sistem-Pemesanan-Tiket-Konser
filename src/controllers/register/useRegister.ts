import { useState, useCallback } from 'react';
import { authApi, RegisterResponse, ApiException } from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface UseRegisterReturn {
  formData: RegisterFormData;
  errors: RegisterErrors;
  isLoading: boolean;
  passwordVisible: boolean;
  handleChange: (field: keyof RegisterFormData, value: string) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: () => Promise<RegisterResponse | null>;
  clearErrors: () => void;
}

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@auth_user',
};

function validateForm(data: RegisterFormData): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Full Name wajib diisi';
  } else if (data.name.length < 3) {
    errors.name = 'Full Name minimal 3 karakter';
  } else if (data.name.length > 50) {
    errors.name = 'Full Name maksimal 50 karakter';
  }

  if (!data.email.trim()) {
    errors.email = 'Email wajib diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Format email tidak valid';
  }

  if (!data.password) {
    errors.password = 'Password wajib diisi';
  } else if (data.password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
  } else if (data.password.length > 100) {
    errors.password = 'Password maksimal 100 karakter';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password wajib diisi';
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Password tidak cocok';
  }

  return errors;
}

export function useRegister(): UseRegisterReturn {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = useCallback((field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async (): Promise<RegisterResponse | null> => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return null;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.register(formData.name, formData.email, formData.password);

      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      if (error instanceof ApiException) {
        setErrors({ general: error.data?.message || error.message });
      } else {
        setErrors({ general: 'Terjadi kesalahan yang tidak diketahui' });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return {
    formData,
    errors,
    isLoading,
    passwordVisible,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    clearErrors,
  };
}