// ============================================================
// FILE: src/services/packageService.js   (NEW FILE)  for grp bking
// ============================================================

import api from "./api";

// Get all active packages with calculated prices
export const getAllPackages = () =>
  api.get("/api/packages");

// Get single package details
export const getPackageById = (id) =>
  api.get(`/api/packages/${id}`);

// Create a group booking from a package
// data = { customerId, packageId, address, problem, date, timeSlot, city }
export const bookPackage = (data) =>
  api.post("/api/packages/book", data);

// Get group booking status + all sub-bookings
export const getGroupBooking = (groupId) =>
  api.get(`/api/packages/group/${groupId}`);

// Get all group bookings for a customer (booking history)
export const getCustomerGroupBookings = (customerId) =>
  api.get(`/api/packages/customer/${customerId}`);