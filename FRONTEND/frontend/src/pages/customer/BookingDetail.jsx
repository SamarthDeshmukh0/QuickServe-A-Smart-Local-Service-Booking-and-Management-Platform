// ============================================================
// FILE: src/pages/customer/BookingDetail.jsx   (NEW FILE)
// Full booking detail page with live polling status tracker
// Route: /customer/booking/:bookingId
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBookingById } from "../../services/bookingService";
import DashboardNav from "../../components/DashboardNav";
import { StatusTracker } from "../../components/StatusTracker";
import { formatDate, formatCurrency, formatDateTime } from "../../utils/helpers";

const navLinks = [
  { to: "/customer/dashboard",       label: "Dashboard"       },
  { to: "/customer/book-service",    label: "Book Service"    },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile",         label: "Profile"         },
];

// Statuses where polling should stop (terminal states)
const TERMINAL_STATUSES = ["PAID", "CANCELLED"];

// Polling interval in milliseconds
const POLL_INTERVAL = 15000; // 15 seconds

const BookingDetail = () => {
  const { bookingId }   = useParams();
  const { user }        = useAuth();
  const navigate        = useNavigate();

  const [booking,     setBooking]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [polling,     setPolling]     = useState(false);

  // ── Fetch booking once ────────────────────────────────────
  const fetchBooking = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getBookingById(bookingId);
      const data = res.data;

      // Security: make sure this booking belongs to this customer
      if (data.customerId !== user?.id) {
        navigate("/customer/dashboard");
        return;
      }

      setBooking(data);
      setLastUpdated(new Date());
      setError("");
    } catch {
      setError("Could not load booking details. Please try again.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [bookingId, user, navigate]);

  // ── Initial load ──────────────────────────────────────────
  useEffect(() => {
    fetchBooking(false);
  }, [fetchBooking]);

  // ── Polling logic ─────────────────────────────────────────
  useEffect(() => {
    if (!booking) return;

    // Don't poll if already in terminal status
    if (TERMINAL_STATUSES.includes(booking.status)) {
      setPolling(false);
      return;
    }

    setPolling(true);
    const interval = setInterval(() => {
      fetchBooking(true); // silent = true means no loading spinner
    }, POLL_INTERVAL);

    // Cleanup on unmount or when booking status changes to terminal
    return () => {
      clearInterval(interval);
    };
  }, [booking?.status, fetchBooking]);

  // ── Helper: what action button to show ───────────────────
  const renderActionButton = () => {
    if (!booking) return null;

    if (booking.status === "COMPLETED") {
      return (
        <Link
          to={`/customer/payment/${booking.id}`}
          className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl
                     hover:bg-blue-700 transition-all text-center block text-sm"
        >
          💳 Pay Now — {formatCurrency(booking.amount + 49)}
        </Link>
      );
    }

    if (booking.status === "PAID" && !booking.rated) {
      return (
        <Link
          to={`/customer/rate/${booking.id}`}
          className="w-full sm:w-auto bg-amber-500 text-white font-semibold px-8 py-3 rounded-xl
                     hover:bg-amber-600 transition-all text-center block text-sm"
        >
          ⭐ Rate Your Provider
        </Link>
      );
    }

    if (booking.status === "PAID" && booking.rated) {
      return (
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          <span className="text-xl">✅</span>
          Service completed and rated. Thank you!
        </div>
      );
    }

    return null;
  };

  // ── Status-specific message ───────────────────────────────
  const getStatusMessage = (status, providerName) => {
    const messages = {
      BOOKED:      `Your booking is confirmed. Waiting for ${providerName || "a provider"} to accept.`,
      ACCEPTED:    `${providerName || "Your provider"} has accepted the job and will arrive at the scheduled time.`,
      IN_PROGRESS: `${providerName || "Your provider"} is currently working on your service.`,
      COMPLETED:   "The service has been completed. Please proceed to payment.",
      PAID:        "Payment received. Your service is fully complete!",
      CANCELLED:   "This booking has been cancelled.",
    };
    return messages[status] || "";
  };

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav links={navLinks} role="CUSTOMER" />
        <main className="max-w-3xl mx-auto px-4 py-10">
          {/* Skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="h-5 bg-gray-200 rounded w-1/4" />
              <div className="flex gap-4">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-gray-200" />
                    <div className="w-14 h-3 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                {[0,1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav links={navLinks} role="CUSTOMER" />
        <main className="max-w-3xl mx-auto px-4 py-10 text-center">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Booking not found</p>
          <p className="text-gray-500 text-sm mb-6">{error || "This booking doesn't exist or you don't have access."}</p>
          <Link to="/customer/booking-history" className="btn-primary text-sm">← Back to Bookings</Link>
        </main>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <button
              onClick={() => navigate("/customer/booking-history")}
              className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
            >
              ← Back to Bookings
            </button>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Booking #{booking.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {booking.service} · Booked on {formatDateTime(booking.createdAt)}
            </p>
          </div>

          {/* Live polling indicator */}
          {polling && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              <span className="text-xs text-blue-600 font-medium">Live tracking</span>
            </div>
          )}
        </div>

        {/* ── Status Tracker Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="text-base font-display font-bold text-gray-900">
              Service Status
            </h2>
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>

          <StatusTracker status={booking.status} />

          {/* Status message below tracker */}
          <div
            className={`
              mt-5 px-4 py-3 rounded-xl text-sm
              ${booking.status === "PAID"        ? "bg-green-50 text-green-700 border border-green-200"  : ""}
              ${booking.status === "CANCELLED"   ? "bg-red-50 text-red-700 border border-red-200"        : ""}
              ${booking.status === "COMPLETED"   ? "bg-blue-50 text-blue-700 border border-blue-200"     : ""}
              ${booking.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border border-amber-200"  : ""}
              ${booking.status === "BOOKED"      ? "bg-gray-50 text-gray-600 border border-gray-200"     : ""}
              ${booking.status === "ACCEPTED"    ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : ""}
            `}
          >
            {getStatusMessage(booking.status, booking.providerName)}
          </div>
        </div>

        {/* ── Booking Details Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="text-base font-display font-bold text-gray-900 mb-4">Booking Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Service</p>
              <p className="font-semibold text-gray-900">{booking.service}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Provider</p>
              <p className="font-semibold text-gray-900">{booking.providerName || "—"}</p>
              <p className="text-xs text-gray-400">{booking.providerCity || ""}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Date & Time Slot</p>
              <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{booking.timeSlot}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
              {booking.status !== "PAID" && (
                <p className="text-xs text-gray-400 mt-0.5">+ ₹49 platform fee at payment</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="font-semibold text-gray-900">{booking.address}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Problem Description</p>
              <p className="text-gray-700 text-sm leading-relaxed">{booking.problem}</p>
            </div>

          </div>
        </div>

        {/* ── Action Button ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {renderActionButton()}

          {/* Auto-refresh notice for active bookings */}
          {polling && (
            <p className="text-xs text-gray-400 text-center sm:text-right">
              🔄 Status refreshes automatically every 15 seconds
            </p>
          )}
        </div>

      </main>
    </div>
  );
};

export default BookingDetail;