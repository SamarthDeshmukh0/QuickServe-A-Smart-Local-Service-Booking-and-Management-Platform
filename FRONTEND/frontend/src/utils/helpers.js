// ============================================================
// FILE: src/utils/helpers.js
// ============================================================

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export const getServiceAmount = (serviceName) => {
  const { SERVICES } = require("./constants");
  const s = SERVICES.find((s) => s.name === serviceName);
  return s ? s.amount : 499;
};

export const truncateName = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return name;
  return `${parts[0]} ${parts[1][0]}.`;
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

export const decodeJWT = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
};