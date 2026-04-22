// // ============================================================
// // FILE: src/services/bookingService.js
// // ============================================================

// import api from "./api";

// export const createBooking = (data) => api.post("/api/bookings", data);
// export const getCustomerBookings = (id) => api.get(`/api/bookings/customer/${id}`);
// export const getProviderBookings = (id) => api.get(`/api/bookings/provider/${id}`);
// export const acceptBooking = (id) => api.put(`/api/bookings/${id}/accept`);
// export const rejectBooking = (id) => api.put(`/api/bookings/${id}/reject`);
// export const startBooking = (id) => api.put(`/api/bookings/${id}/start`);
// export const completeBooking = (id) => api.put(`/api/bookings/${id}/complete`);
// export const cancelBooking = (id) => api.put(`/api/bookings/${id}/cancel`);
// export const getBookingById = (id) => api.get(`/api/bookings/${id}`);


// ============================================================
// FILE: src/services/bookingService.js  (FULL REPLACEMENT)
//version1 for smart price.
// ONE CHANGE — completeBooking now sends a request body
// ============================================================

import api from "./api";

export const createBooking       = (data) => api.post("/api/bookings", data);
export const getCustomerBookings = (id)   => api.get(`/api/bookings/customer/${id}`);
export const getProviderBookings = (id)   => api.get(`/api/bookings/provider/${id}`);
export const acceptBooking       = (id)   => api.put(`/api/bookings/${id}/accept`);
export const rejectBooking       = (id)   => api.put(`/api/bookings/${id}/reject`);
export const startBooking        = (id)   => api.put(`/api/bookings/${id}/start`);
export const cancelBooking       = (id)   => api.put(`/api/bookings/${id}/cancel`);
export const getBookingById      = (id)   => api.get(`/api/bookings/${id}`);

// ── CHANGED: completeBooking now sends receipt + final price ──
// receiptData = { finalAmount, workDescription, receiptItems, aiEstimateRange }
export const completeBooking = (id, receiptData) =>
  api.put(`/api/bookings/${id}/complete`, receiptData);

// ── NEW: Urgent booking API calls ──────────────────────────
// Customer submits urgent booking — no provider, no slot
export const createUrgentBooking = (data) =>
  api.post("/api/bookings/urgent", data);

// Provider accepts an urgent booking — first-accept-wins
// export const acceptUrgentBooking = (id) =>
//   api.put(`/api/bookings/${id}/urgent-accept`);

    export const acceptUrgentBooking = (id, providerId) =>
  api.put(`/api/bookings/${id}/urgent-accept?providerId=${providerId}`);

// Provider fetches all open urgent jobs in their city
export const getOpenUrgentBookings = () =>
  api.get("/api/bookings/urgent/open");