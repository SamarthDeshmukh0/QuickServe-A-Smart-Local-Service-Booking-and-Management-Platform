// ============================================================
// FILE: src/services/adminService.js
// ============================================================

import api from "./api";

export const getAllProviders = (params) => api.get("/api/admin/providers", { params });
export const approveProvider = (id) => api.put(`/api/admin/providers/${id}/approve`);
export const rejectProvider = (id) => api.put(`/api/admin/providers/${id}/reject`);
export const getAllBookings = (params) => api.get("/api/admin/bookings", { params });
export const getAnalytics = () => api.get("/api/admin/analytics");
export const getAllCustomers = () => api.get("/api/admin/customers");
