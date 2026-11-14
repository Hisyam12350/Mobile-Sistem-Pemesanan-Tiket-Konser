import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000/api';

export interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  data?: unknown;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiError
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiException(
      data.message || 'Terjadi kesalahan pada server',
      response.status,
      data
    );
  }

  return data as T;
}

export const authApi = {
  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    return request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

export { ApiException };