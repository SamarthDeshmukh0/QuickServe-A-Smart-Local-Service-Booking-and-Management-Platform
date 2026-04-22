// ============================================================
// FILE: src/services/ratingService.js
// ============================================================

import api from "./api";

export const submitRating = (data) => api.post("/api/ratings", data);
export const getProviderRatings = (providerId) => api.get(`/api/ratings/provider/${providerId}`);
