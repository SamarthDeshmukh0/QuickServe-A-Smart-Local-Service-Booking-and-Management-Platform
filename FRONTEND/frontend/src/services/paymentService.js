// ============================================================
// FILE: src/services/paymentService.js
// ============================================================

import api from "./api";

export const makePayment = (data) => api.post("/api/payments", data);
export const getPaymentByBooking = (bookingId) => api.get(`/api/payments/booking/${bookingId}`);
