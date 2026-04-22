// ============================================================
// FILE: src/services/providerService.js
// ============================================================

import api from "./api";

export const getRecommendedProviders = (city, service) =>
  api.get(`/api/providers/recommend?city=${city}&service=${service}`);
export const getProviderById = (id) => api.get(`/api/providers/${id}`);
export const updateProviderProfile = (id, data) => api.put(`/api/providers/${id}/profile`, data);
export const getProviderEarnings = (id) => api.get(`/api/providers/${id}/earnings`);
