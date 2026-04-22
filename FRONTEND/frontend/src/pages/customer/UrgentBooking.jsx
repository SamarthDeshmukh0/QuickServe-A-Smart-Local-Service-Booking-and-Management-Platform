// ============================================================
// FILE: src/pages/customer/UrgentBooking.jsx   (NEW FILE)
// Route: /customer/urgent-booking
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createUrgentBooking } from "../../services/bookingService";
import DashboardNav from "../../components/DashboardNav";
import { SERVICES } from "../../utils/constants";

const URGENT_FEE  = 99;
const PLATFORM_FEE = 49;

const navLinks = [
  { to: "/customer/dashboard",       label: "Dashboard"       },
  { to: "/customer/book-service",    label: "Book Service"    },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile",         label: "Profile"         },
];

// ── Countdown timer component ─────────────────────────────────
// Shows mm:ss counting down from 30:00 when booking is submitted
const CountdownTimer = ({ expiresAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) {
        setTimeLeft("00:00");
        onExpired?.();
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const isLow = timeLeft < "05:00" && timeLeft !== "";

  return (
    <div className={`text-center p-4 rounded-2xl border-2 transition-all
      ${isLow
        ? "bg-red-50 border-red-300 animate-pulse"
        : "bg-amber-50 border-amber-300"}`}>
      <p className={`text-4xl font-display font-bold tabular-nums
        ${isLow ? "text-red-600" : "text-amber-600"}`}>
        {timeLeft}
      </p>
      <p className={`text-xs mt-1 font-medium
        ${isLow ? "text-red-500" : "text-amber-500"}`}>
        {isLow
          ? "⚠️ Expiring soon — booking will be auto-cancelled"
          : "Time remaining for a provider to accept"}
      </p>
    </div>
  );
};

// ── Main UrgentBooking page ────────────────────────────────────
const UrgentBooking = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [service,   setService]   = useState("");
  const [address,   setAddress]   = useState(user?.address || "");
  const [problem,   setProblem]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState("");
  const [booking,   setBooking]   = useState(null); // set after submit
  const [expired,   setExpired]   = useState(false);

  const selectedSvc = SERVICES.find(s => s.name === service);
  const baseAmount  = selectedSvc?.amount || 499;
  const total       = baseAmount + URGENT_FEE + PLATFORM_FEE;

  const validate = () => {
    if (!service)              return "Please select a service type.";
    if (address.trim().length < 10) return "Please enter a complete address.";
    if (problem.trim().length < 10) return "Please describe the problem (min 10 characters).";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await createUrgentBooking({
        customerId: user.id,
        service,
        address:    address.trim(),
        problem:    problem.trim(),
        city:       user.city,
        amount:     baseAmount,
      });
      setBooking(res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not create urgent booking. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Waiting screen — shown after successful submit ────────
  if (booking && !expired) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav links={navLinks} role="CUSTOMER" />
        <main className="max-w-lg mx-auto px-4 py-8">

          {/* Urgent header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3 animate-bounce">🚨</div>
            <h1 className="text-2xl font-display font-bold text-red-600">
              Urgent Booking Sent!
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Booking #{booking.id} · Notifying all available{" "}
              {booking.service} providers in {user?.city}
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-5">
            <CountdownTimer
              expiresAt={booking.expiresAt}
              onExpired={() => setExpired(true)}
            />
          </div>

          {/* Booking details card */}
          <div className="card mb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h2 className="font-semibold text-gray-900">Booking Details</h2>
              <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold
                               px-2.5 py-1 rounded-full">
                🚨 URGENT
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium">{booking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-right max-w-[200px]">
                  {booking.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-amber-600">
                  Waiting for provider…
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-500">Service charge</span>
                <span>₹{baseAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Urgent fee</span>
                <span className="font-medium">₹{URGENT_FEE}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Platform fee</span>
                <span>₹{PLATFORM_FEE}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1
                              border-t border-gray-100">
                <span>Estimated total</span>
                <span className="text-blue-600">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl
                          px-4 py-3 mb-5 text-xs text-blue-700">
            <p className="font-semibold mb-0.5">What happens next?</p>
            <p>The first available provider in your city will accept this job
               and arrive as soon as possible. You will see the status update
               on your Booking History page.</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/customer/booking-history")}
              className="flex-1 btn-primary py-3 text-sm"
            >
              Track Booking →
            </button>
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex-1 btn-outline py-3 text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Expired screen ────────────────────────────────────────
  if (booking && expired) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav links={navLinks} role="CUSTOMER" />
        <main className="max-w-lg mx-auto px-4 py-8 text-center">
          <div className="text-5xl mb-4">😔</div>
          <h1 className="text-xl font-display font-bold text-gray-900 mb-2">
            No Provider Available
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            No provider was available for an urgent booking in your area
            within 30 minutes. The booking has been automatically cancelled.
            You can try again or book a regular service.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setBooking(null); setExpired(false); }}
              className="btn-primary py-3 px-6 text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/customer/book-service")}
              className="btn-outline py-3 px-6 text-sm"
            >
              Book Normally
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Booking form ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />

      <main className="max-w-lg mx-auto px-4 py-8">

        {/* Urgent header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white
                          font-bold text-sm px-4 py-2 rounded-full mb-3">
            🚨 EMERGENCY BOOKING
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Need Help Right Now?
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Skip slot selection. We notify all available providers in{" "}
            <strong>{user?.city}</strong> immediately.
            First one to accept gets the job.
          </p>
        </div>

        {/* How urgent differs from normal */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
            How this works
          </p>
          <div className="space-y-1.5 text-xs text-red-600">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">⚡</span>
              <span>Your booking is sent to ALL available providers in {user?.city} instantly</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">🏆</span>
              <span>First provider to accept gets the job — no waiting for a specific person</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">⏰</span>
              <span>Booking expires in 30 minutes if no one accepts</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">💰</span>
              <span>Urgent surcharge of ₹{URGENT_FEE} applies on top of service fee</span>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="card space-y-5">

          {/* Service selection — visual grid */}
          <div>
            <label className="label">
              What do you need? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map(svc => (
                <button
                  key={svc.name}
                  type="button"
                  onClick={() => { setService(svc.name); setError(""); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl
                              border-2 text-sm font-medium text-left transition-all
                              ${service === svc.name
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                >
                  <span className="text-xl flex-shrink-0">{svc.icon}</span>
                  <span>{svc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="label">
              Your Address <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={address}
              onChange={e => { setAddress(e.target.value); setError(""); }}
              placeholder="Enter your complete address including flat/house number, area, landmark"
            />
          </div>

          {/* Problem description */}
          <div>
            <label className="label">
              Describe the Problem <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={problem}
              onChange={e => { setProblem(e.target.value); setError(""); }}
              placeholder="e.g. Pipe burst in kitchen, water flooding everywhere — need immediate help"
            />
          </div>

          {/* Price breakdown */}
          {service && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Service charge</span>
                <span>₹{baseAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span className="flex items-center gap-1">
                  🚨 Urgent surcharge
                </span>
                <span className="font-semibold">+ ₹{URGENT_FEE}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Platform fee</span>
                <span>₹{PLATFORM_FEE}</span>
              </div>
              <div className="flex justify-between font-bold text-base
                              border-t border-gray-200 pt-2">
                <span>Estimated total</span>
                <span className="text-blue-600">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Final price set by provider after seeing the actual problem
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl
                       hover:bg-red-700 transition-all disabled:opacity-50
                       text-base flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent
                                 rounded-full animate-spin" />
                Sending to providers…
              </>
            ) : (
              "🚨 Send Urgent Request Now"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            By submitting you agree to the ₹{URGENT_FEE} urgent surcharge.
            Booking auto-cancels in 30 min if no provider accepts.
          </p>
        </div>
      </main>
    </div>
  );
};

export default UrgentBooking;