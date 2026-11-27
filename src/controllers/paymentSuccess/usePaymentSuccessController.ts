import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { formatRupiah } from '@/controllers/checkout/useCheckoutController';

export function usePaymentSuccessController() {
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
    rawOrderId?: string;
    artist?: string;
    tour?: string;
    dateTime?: string;
    venue?: string;
    seatLabels?: string;
    categorySummary?: string;
    subtotal?: string;
    serviceFee?: string;
    voucherDiscount?: string;
    totalPayment?: string;
    voucherCode?: string;
  }>();

  const eventId = params.id || '77';
  const orderId = params.orderId || 'CX-240S28-0012';
  const rawOrderId = params.rawOrderId || '';
  const totalPayment = Number(params.totalPayment) || 54100000;
  const subtotal = Number(params.subtotal) || 54100000;
  const serviceFee = Number(params.serviceFee) || 50000;
  const voucherDiscount = Number(params.voucherDiscount) || 0;
  const displayArtist = params.artist || 'Bruno Mars';
  const displayTour = params.tour || '24K Magic Live';
  const displayDateTime = params.dateTime || '25 Des 2026 · 19:30 WIB';
  const displayVenue = params.venue || 'JIS Jakarta';
  const seatLabels = params.seatLabels || 'VIP A1, A2, A3';
  const categorySummary = params.categorySummary || 'VIP (3)';
  const voucherCode = params.voucherCode || '';

  const formattedTotalPayment = formatRupiah(totalPayment);

  const totalTicketsCount = (() => {
    const sumFromCategory = categorySummary.split('|').reduce((acc, part) => {
      const m = part.match(/\((\d+)\)/);
      return acc + (m ? Number(m[1]) : 0);
    }, 0);
    if (sumFromCategory > 0) return sumFromCategory;
    const seatCount = seatLabels.split(',').filter(s => s.trim().length > 0).length;
    return Math.max(1, seatCount);
  })();

  // Prevent Android hardware back button from returning to Checkout/SeatMap for an already paid order
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      (router as any).replace('/home');
      return true;
    });
    return () => subscription.remove();
  }, []);

  const handleLihatETicket = () => {
    (router as any).push({
      pathname: '/e-ticket',
      params: {
        id: String(eventId),
        orderId,
        rawOrderId,
        artist: displayArtist,
        tour: displayTour,
        dateTime: displayDateTime,
        venue: displayVenue,
        seatLabels,
        categorySummary,
        totalTickets: String(totalTicketsCount),
      },
    });
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Syarat & Ketentuan E-Ticket',
      '1. Tunjukkan QR Code / Barcode E-Ticket saat melakukan check-in di pintu masuk venue.\n2. Satu kode E-Ticket hanya berlaku untuk satu kali pemindaian (check-in).\n3. Penonton wajib hadir sesuai jadwal dan kategori kursi yang tertera pada tiket.'
    );
  };

  return {
    eventId,
    orderId,
    rawOrderId,
    totalPayment,
    formattedTotalPayment,
    subtotal,
    serviceFee,
    voucherDiscount,
    displayArtist,
    displayTour,
    displayDateTime,
    displayVenue,
    seatLabels,
    categorySummary,
    voucherCode,
    handleLihatETicket,
    handleTermsPress,
  };
}
