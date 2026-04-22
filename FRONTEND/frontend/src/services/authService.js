// ============================================================
// FILE: src/services/authService.js
// ============================================================

import api from "./api";

export const customerRegister = (data) => api.post("/api/auth/customer/register", data);
export const customerLogin = (data) => api.post("/api/auth/customer/login", data);
export const providerRegister = (data) => api.post("/api/auth/provider/register", data);
export const providerLogin = (data) => api.post("/api/auth/provider/login", data);
export const adminLogin = (data) => api.post("/api/auth/admin/login", data);
