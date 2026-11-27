import { API_BASE_URL } from '@/api/config';

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
  errors?: Record<string, string[]>;
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new ApiException(
        'Koneksi timeout (10 detik). Pastikan server backend sedang berjalan di port 5000.',
        0
      );
    }
    throw new ApiException(
      `Gagal terhubung ke server (${API_BASE_URL}). Pastikan server backend sudah dijalankan di port 5000.`,
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let data: any = {};
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: response.statusText || 'Gagal memproses respon server' };
  }

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
