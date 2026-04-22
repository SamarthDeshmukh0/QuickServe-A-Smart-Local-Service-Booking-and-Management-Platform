// ============================================================
// FILE: src/services/slotService.js
// ============================================================

import api from "./api";

export const getAvailableSlots = (providerId, date) =>
  api.get(`/api/slots/available?providerId=${providerId}&date=${date}`);
export const getProviderSlots = (id) => api.get(`/api/slots/provider/${id}`);
export const createSlots = (data) => api.post("/api/slots", data);
export const deleteSlot = (id) => api.delete(`/api/slots/${id}`);
