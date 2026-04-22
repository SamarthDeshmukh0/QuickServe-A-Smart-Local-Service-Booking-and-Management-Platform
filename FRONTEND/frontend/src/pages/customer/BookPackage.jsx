// ============================================================
// FILE: src/pages/customer/BookPackage.jsx   (NEW FILE)
// Route: /customer/book-package
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllPackages, bookPackage } from "../../services/packageService";
import DashboardNav from "../../components/DashboardNav";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { TIME_SLOTS, PLATFORM_FEE } from "../../utils/constants";

const navLinks = [
  { to: "/customer/dashboard",       label: "Dashboard"       },
  { to: "/customer/book-service",    label: "Book Service"    },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile",         label: "Profile"         },
];

// ── Step indicator ────────────────────────────────────────────
const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-2 mb-8">
    {[1, 2, 3].map((s, i) => (
      <React.Fragment key={s}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center
                         text-sm font-bold transition-all
                         ${step >= s
                           ? "bg-blue-600 text-white"
                           : "bg-gray-200 text-gray-500"}`}>
          {s}
        </div>
        {i < 2 && (
          <div className={`flex-1 h-1 rounded transition-all
                           ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── PackageCard ───────────────────────────────────────────────
const PackageCard = ({ pkg, selected, onSelect }) => (
  <button
    onClick={() => onSelect(pkg)}
    className={`w-full text-left card transition-all hover:shadow-lg
      ${selected ? "border-2 border-blue-600 bg-blue-50/30" : "border border-gray-200"}`}
  >
    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-bold text-gray-900 text-base">
            {pkg.name}
          </h3>
          {selected && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Selected ✓
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{pkg.description}</p>
      </div>
      {/* Discount badge */}
      <span className="bg-green-100 text-green-700 text-xs font-bold
                       px-3 py-1.5 rounded-full flex-shrink-0">
        {pkg.discountPercent}% OFF
      </span>
    </div>

    {/* Services included */}
    <div className="flex flex-wrap gap-2 mb-4">
      {pkg.services.map(svc => (
        <div key={svc.name}
          className="flex items-center gap-1.5 bg-white border border-gray-200
                     rounded-lg px-2.5 py-1.5 text-sm">
          <span>{svc.icon}</span>
          <span className="font-medium text-gray-800">{svc.name}</span>
          <span className="text-gray-400 text-xs">{formatCurrency(svc.amount)}</span>
        </div>
      ))}
    </div>

    {/* Price summary */}
    <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
      <div className="flex justify-between text-gray-500">
        <span>Total before discount</span>
        <span className="line-through">{formatCurrency(pkg.subtotal)}</span>
      </div>
      <div className="flex justify-between text-green-600 font-medium">
        <span>Package discount ({pkg.discountPercent}%)</span>
        <span>− {formatCurrency(pkg.discountAmount)}</span>
      </div>
      <div className="flex justify-between font-bold text-gray-900
                      border-t border-gray-200 pt-1.5">
        <span>You pay</span>
        <span className="text-blue-600 text-base">
          {formatCurrency(pkg.totalAmount + PLATFORM_FEE)}
        </span>
      </div>
      <p className="text-xs text-gray-400">
        Includes ₹{PLATFORM_FEE} platform fee
      </p>
    </div>
  </button>
);

// ── GroupBookingTracker ───────────────────────────────────────
// Shown after successful booking — tracks all sub-bookings
const GroupBookingTracker = ({ groupBooking }) => {
  const statusColors = {
    BOOKED:      "bg-blue-100 text-blue-700",
    ACCEPTED:    "bg-indigo-100 text-indigo-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED:   "bg-green-100 text-green-700",
    PAID:        "bg-emerald-100 text-emerald-700",
    CANCELLED:   "bg-red-100 text-red-700",
  };

  const allCompleted = groupBooking.subBookings?.every(
    b => ["COMPLETED", "PAID"].includes(b.status)
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-display font-bold text-gray-900">
          Package Booked Successfully!
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Group ID: <span className="font-mono font-medium text-blue-600">
            {groupBooking.groupId}
          </span>
        </p>
      </div>

      {/* Package summary card */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-gray-900">
            {groupBooking.packageName}
          </h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full
            ${groupBooking.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"}`}>
            {groupBooking.status === "COMPLETED" ? "✅ All Complete" : "🔄 In Progress"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Date</p>
            <p className="font-medium">{formatDate(groupBooking.date)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Time Slot</p>
            <p className="font-medium">{groupBooking.timeSlot}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 col-span-2">
            <p className="text-xs text-gray-500 mb-0.5">Address</p>
            <p className="font-medium">{groupBooking.address}</p>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="line-through">{formatCurrency(groupBooking.subtotal)}</span>
          </div>
          <div className="flex justify-between text-green-600 font-medium">
            <span>Package discount ({groupBooking.discountPercent}%)</span>
            <span>− {formatCurrency(groupBooking.discountAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Platform fee</span>
            <span>{formatCurrency(PLATFORM_FEE)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-1">
            <span>Total</span>
            <span className="text-blue-600">
              {formatCurrency(groupBooking.totalAmount + PLATFORM_FEE)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-booking status cards */}
      <h3 className="font-display font-bold text-gray-900 mb-3">
        Individual Services
      </h3>
      <div className="space-y-3 mb-6">
        {(groupBooking.subBookings || []).map((sub, i) => (
          <div key={sub.id} className="card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center
                              justify-center text-base font-bold text-blue-700">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{sub.service}</p>
                <p className="text-xs text-gray-500">
                  Provider: {sub.providerName || "Being assigned…"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">
                {formatCurrency(sub.amount)}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                ${statusColors[sub.status] || "bg-gray-100 text-gray-600"}`}>
                {sub.status.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm">
        <p className="font-semibold text-blue-700 mb-1">What happens next?</p>
        <ul className="text-blue-600 text-xs space-y-1">
          <li>• Each provider will independently accept and complete their service</li>
          <li>• You can track each sub-booking status from Booking History</li>
          <li>• Payment is due after ALL services are marked completed</li>
          <li>• Package discount is applied to the combined total</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/customer/booking-history"
          className="flex-1 btn-primary py-3 text-center text-sm"
        >
          View Booking History →
        </Link>
        <Link
          to="/customer/dashboard"
          className="flex-1 btn-outline py-3 text-center text-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

// ── Main BookPackage page ─────────────────────────────────────
const BookPackage = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [step,           setStep]           = useState(1);
  const [packages,       setPackages]       = useState([]);
  const [loadingPkgs,    setLoadingPkgs]    = useState(true);
  const [selectedPkg,    setSelectedPkg]    = useState(null);
  const [form,           setForm]           = useState({
    date: "", timeSlot: "", address: "", problem: "",
  });
  const [submitting,     setSubmitting]     = useState(false);
  const [error,          setError]          = useState("");
  const [groupBooking,   setGroupBooking]   = useState(null); // set after success

  // Load packages on mount
  useEffect(() => {
    getAllPackages()
      .then(r => setPackages(r.data || []))
      .catch(() => setError("Failed to load packages. Please refresh."))
      .finally(() => setLoadingPkgs(false));
  }, []);

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setError("");
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedPkg) {
      setError("Please select a package to continue.");
      return;
    }
    if (step === 2) {
      if (!form.date) { setError("Please select a service date."); return; }
      if (!form.timeSlot) { setError("Please select a time slot."); return; }
      if (!form.address || form.address.trim().length < 10) {
        setError("Please enter a complete address (min 10 characters)."); return;
      }
      if (!form.problem || form.problem.trim().length < 10) {
        setError("Please describe the work needed (min 10 characters)."); return;
      }
    }
    setError("");
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await bookPackage({
        customerId: user.id,
        packageId:  selectedPkg.id,
        address:    form.address.trim(),
        problem:    form.problem.trim(),
        date:       form.date,
        timeSlot:   form.timeSlot,
        city:       user.city,
      });
      setGroupBooking(res.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
        "Booking failed. Please check if providers are available in your city."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────
  if (groupBooking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav links={navLinks} role="CUSTOMER" />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <GroupBookingTracker groupBooking={groupBooking} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/customer/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          >
            ← {step > 1 ? "Back" : "Dashboard"}
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Book a Service Package
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bundle multiple services and save with our package deals
          </p>
        </div>

        <StepIndicator step={step} />

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 1 — Choose a Package
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Step 1: Choose a Package
            </h2>

            {loadingPkgs ? (
              <div className="space-y-4">
                {[0,1,2,3].map(i => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-3/4 mb-4" />
                    <div className="flex gap-2 mb-4">
                      {[0,1,2].map(j => <div key={j} className="h-8 bg-gray-100 rounded-lg w-28" />)}
                    </div>
                    <div className="h-20 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-semibold text-gray-600">No packages available</p>
                <p className="text-sm mt-1">
                  Run <span className="font-mono bg-gray-100 px-1 rounded">
                    POST /api/packages/seed
                  </span> to seed default packages
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPkg?.id === pkg.id}
                    onSelect={handleSelectPackage}
                  />
                ))}
              </div>
            )}

            {packages.length > 0 && (
              <button
                onClick={handleNextStep}
                disabled={!selectedPkg}
                className="w-full btn-primary py-3.5 mt-6 text-base
                           font-semibold disabled:opacity-50"
              >
                Continue with {selectedPkg ? selectedPkg.name : "selected package"} →
              </button>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2 — Booking Details
        ════════════════════════════════════════════════════ */}
        {step === 2 && selectedPkg && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Step 2: Booking Details
            </h2>

            {/* Selected package summary */}
            <div className="card mb-5 bg-blue-50 border border-blue-200">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="font-bold text-blue-900">{selectedPkg.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedPkg.services.map(s => (
                      <span key={s.name} className="text-xs bg-white border border-blue-200
                                                     text-blue-700 px-2 py-0.5 rounded-full">
                        {s.icon} {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-500 line-through">
                    {formatCurrency(selectedPkg.subtotal)}
                  </p>
                  <p className="font-bold text-blue-700 text-lg">
                    {formatCurrency(selectedPkg.totalAmount + PLATFORM_FEE)}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Save {formatCurrency(selectedPkg.discountAmount)} 🎉
                  </p>
                </div>
              </div>
            </div>

            <div className="card space-y-5">
              {/* Date */}
              <div>
                <label className="label">Service Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString().split("T")[0]}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>

              {/* Time slot */}
              <div>
                <label className="label">Preferred Time Slot</label>
                <select
                  className="input-field"
                  value={form.timeSlot}
                  onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                >
                  <option value="">Select a time slot</option>
                  {TIME_SLOTS.map(s => (
                    <option key={s.id} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  All providers will arrive around this time
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="label">Your Address</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your complete address including flat number, area, landmark"
                />
              </div>

              {/* Problem */}
              <div>
                <label className="label">
                  Work Description
                  <span className="text-gray-400 font-normal ml-1">
                    (describe what needs to be done)
                  </span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.problem}
                  onChange={e => setForm({ ...form, problem: e.target.value })}
                  placeholder="e.g. Full home renovation — pipe repair in kitchen, new wiring in bedroom, cabinet installation in living room"
                />
              </div>

              <button
                onClick={handleNextStep}
                className="w-full btn-primary py-3.5 text-base font-semibold"
              >
                Review & Confirm →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 3 — Review & Confirm
        ════════════════════════════════════════════════════ */}
        {step === 3 && selectedPkg && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Step 3: Review & Confirm
            </h2>

            {/* Full summary card */}
            <div className="card mb-5 space-y-4">

              <h3 className="font-display font-bold text-gray-900 text-base">
                {selectedPkg.name}
              </h3>

              {/* Services list */}
              <div>
                <p className="text-xs text-gray-500 font-medium mb-2">
                  Services included
                </p>
                <div className="space-y-2">
                  {selectedPkg.services.map((svc, i) => (
                    <div key={svc.name}
                      className="flex items-center justify-between bg-gray-50
                                 rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full
                                         flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-base">{svc.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{svc.name}</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(svc.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Date</p>
                  <p className="font-medium">{formatDate(form.date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Time Slot</p>
                  <p className="font-medium">
                    {TIME_SLOTS.find(s => s.value === form.timeSlot)?.label || form.timeSlot}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-0.5">Address</p>
                  <p className="font-medium text-gray-800">{form.address}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-0.5">Work Description</p>
                  <p className="font-medium text-gray-800">{form.problem}</p>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Services subtotal</span>
                  <span className="line-through">{formatCurrency(selectedPkg.subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Package discount ({selectedPkg.discountPercent}%)</span>
                  <span>− {formatCurrency(selectedPkg.discountAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Platform fee</span>
                  <span>{formatCurrency(PLATFORM_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-base
                                border-t border-gray-200 pt-2">
                  <span>Total to pay</span>
                  <span className="text-blue-600">
                    {formatCurrency(selectedPkg.totalAmount + PLATFORM_FEE)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl
                            px-4 py-3 mb-5 text-xs text-amber-700">
              <p className="font-semibold mb-1">Before you confirm</p>
              <ul className="space-y-1">
                <li>• The best available provider in {user?.city} will be auto-assigned for each service</li>
                <li>• Each provider will contact you independently about the job</li>
                <li>• Final price may be adjusted by the provider after seeing the work</li>
                <li>• You pay after all services are completed</li>
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl
                         hover:bg-blue-700 transition-all disabled:opacity-50
                         text-base flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent
                                   rounded-full animate-spin" />
                  Booking your package…
                </>
              ) : (
                `✅ Confirm Package Booking — ${formatCurrency(selectedPkg.totalAmount + PLATFORM_FEE)}`
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookPackage;