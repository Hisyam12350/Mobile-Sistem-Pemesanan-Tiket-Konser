import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/api/config';

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data?: {
    snap_token: string;
    redirect_url: string;
    qr_code_url?: string;
    order_id: string | number;
    payment_id: string | number;
    midtrans_order_id: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  data?: {
    order: {
      id: number | string;
      status_order: string;
      total_pembayaran: number | string;
      batas_waktu_bayar?: string;
    };
    items?: {
      id: number | string;
      kategori_id: number | string;
      nama_kategori?: string;
      jumlah: number;
      harga_satuan: number | string;
      seats?: {
        id: number | string;
        nomor_kursi: string;
        status_kursi?: string;
      }[];
    }[];
    payments: {
      id: number | string;
      status: string;
      snap_token?: string;
      redirect_url?: string;
    }[];
    tickets?: {
      id: number | string;
      order_id: number | string;
      kategori_id: number | string;
      seat_id: number | string;
      kode_unik: string;
      status_tiket: string;
      created_at?: string;
    }[];
  };
}

export interface SnapQrisChargeResult {
  qris_url?: string;
  qr_string?: string;
  transaction_id?: string;
  order_id?: string;
}

async function fetchPaymentRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = (await AsyncStorage.getItem('@auth_token'))?.trim() || null;

  if (!token) {
    throw new Error('Silakan login terlebih dahulu untuk melanjutkan pembayaran.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      await AsyncStorage.removeItem('@auth_token');
      throw new Error(data?.message || 'Sesi login telah berakhir. Silakan login kembali.');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server returned ${response.status}`);
    }

    return data as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const paymentApi = {
  async createPayment(orderId: string | number): Promise<CreatePaymentResponse> {
    return fetchPaymentRequest<CreatePaymentResponse>(`/payments/${orderId}/create`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  async getPaymentStatus(orderId: string | number): Promise<PaymentStatusResponse> {
    return fetchPaymentRequest<PaymentStatusResponse>(
      `/payments/${orderId}?_t=${Date.now()}`,
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }
    );
  },

  // Mengambil QR Code Image URL (qris_url) langsung dari Midtrans Snap v2 menggunakan snap_token dari backend API
  async chargeSnapQris(snapToken: string): Promise<SnapQrisChargeResult | null> {
    try {
      const response = await fetch(
        `https://app.sandbox.midtrans.com/snap/v2/transactions/${encodeURIComponent(snapToken)}/charge`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ payment_type: 'other_qris' }),
        }
      );
      const data = await response.json().catch(() => null);
      if (data && data.qris_url) {
        return {
          qris_url: data.qris_url,
          qr_string: data.qr_string,
          transaction_id: data.transaction_id,
          order_id: data.order_id,
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};
