// ============================================================
// FILE: src/services/badgeService.js   (React — new file)
// ============================================================

import api from "./api";

// Get all badges for a provider (public)
export const getProviderBadges = (providerId) =>
  api.get(`/api/providers/${providerId}/badges`);

// Admin: assign a badge
export const assignBadge = (providerId, badgeType) =>
  api.post(`/api/admin/providers/${providerId}/badges`, { badgeType });

// Admin: revoke a badge
export const revokeBadge = (providerId, badgeType) =>
  api.delete(`/api/admin/providers/${providerId}/badges/${badgeType}`);
