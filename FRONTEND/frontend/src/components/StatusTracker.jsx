// ============================================================
// FILE: src/components/StatusTracker.jsx   (NEW FILE)
// Reusable animated stepper — used in BookingDetail page
// and as a mini version inside BookingHistory table rows
// ============================================================

import React from "react";

// ── Step definitions ─────────────────────────────────────────
// Each step maps to one or more booking statuses
const STEPS = [
  {
    key:      "BOOKED",
    label:    "Booking Confirmed",
    subLabel: "Waiting for provider",
    icon:     "📋",
  },
  {
    key:      "ACCEPTED",
    label:    "Provider Accepted",
    subLabel: "Provider is on the way",
    icon:     "👍",
  },
  {
    key:      "IN_PROGRESS",
    label:    "Work In Progress",
    subLabel: "Service is ongoing",
    icon:     "🔧",
  },
  {
    key:      "COMPLETED",
    label:    "Work Completed",
    subLabel: "Please make payment",
    icon:     "✅",
  },
  {
    key:      "PAID",
    label:    "Payment Done",
    subLabel: "All done! Thank you",
    icon:     "💚",
  },
];

// Map each DB status → which step index is "active"
const STATUS_TO_STEP = {
  BOOKED:      0,
  ACCEPTED:    1,
  IN_PROGRESS: 2,
  COMPLETED:   3,
  PAID:        4,
  CANCELLED:   -1,   // special case
};

// ── Full stepper (used in BookingDetail page) ────────────────
export const StatusTracker = ({ status }) => {
  const activeStep = STATUS_TO_STEP[status] ?? 0;

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-semibold text-red-700">Booking Cancelled</p>
          <p className="text-sm text-red-500">This booking has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Desktop / Tablet: horizontal stepper ── */}
      <div className="hidden sm:flex items-start w-full">
        {STEPS.map((step, idx) => {
          const isDone   = idx < activeStep;
          const isActive = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <React.Fragment key={step.key}>
              {/* Step node */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 80 }}>
                {/* Circle */}
                <div
                  className={`
                    w-11 h-11 rounded-full flex items-center justify-center text-lg
                    transition-all duration-500 border-2
                    ${isDone   ? "bg-green-500 border-green-500 shadow-md"   : ""}
                    ${isActive ? "bg-blue-600 border-blue-600 shadow-lg ring-4 ring-blue-100 animate-pulse" : ""}
                    ${isPending ? "bg-white border-gray-200"                 : ""}
                  `}
                >
                  {isDone
                    ? <span className="text-white text-sm font-bold">✓</span>
                    : <span className={isPending ? "opacity-40" : ""}>{step.icon}</span>
                  }
                </div>

                {/* Label */}
                <p
                  className={`
                    text-xs font-semibold mt-2 text-center leading-tight max-w-[80px]
                    ${isDone    ? "text-green-600" : ""}
                    ${isActive  ? "text-blue-700"  : ""}
                    ${isPending ? "text-gray-400"  : ""}
                  `}
                >
                  {step.label}
                </p>

                {/* Sub-label — only on active step */}
                {isActive && (
                  <p className="text-xs text-blue-500 text-center mt-1 max-w-[80px] leading-tight">
                    {step.subLabel}
                  </p>
                )}
              </div>

              {/* Connector line between steps */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mt-5 mx-1">
                  <div
                    className={`
                      h-1 rounded-full transition-all duration-700
                      ${idx < activeStep ? "bg-green-400" : "bg-gray-200"}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Mobile: vertical stepper ── */}
      <div className="flex sm:hidden flex-col gap-0">
        {STEPS.map((step, idx) => {
          const isDone    = idx < activeStep;
          const isActive  = idx === activeStep;
          const isPending = idx > activeStep;
          const isLast    = idx === STEPS.length - 1;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Left: circle + vertical line */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0
                    border-2 transition-all duration-500
                    ${isDone    ? "bg-green-500 border-green-500"                           : ""}
                    ${isActive  ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100 animate-pulse" : ""}
                    ${isPending ? "bg-white border-gray-200"                                : ""}
                  `}
                >
                  {isDone
                    ? <span className="text-white text-xs font-bold">✓</span>
                    : <span className={isPending ? "opacity-40" : ""}>{step.icon}</span>
                  }
                </div>
                {/* vertical connector */}
                {!isLast && (
                  <div
                    className={`
                      w-0.5 flex-1 my-1 min-h-[24px] transition-all duration-700
                      ${idx < activeStep ? "bg-green-400" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>

              {/* Right: text */}
              <div className="pb-5">
                <p
                  className={`
                    text-sm font-semibold leading-tight
                    ${isDone    ? "text-green-600" : ""}
                    ${isActive  ? "text-blue-700"  : ""}
                    ${isPending ? "text-gray-400"  : ""}
                  `}
                >
                  {step.label}
                </p>
                <p
                  className={`
                    text-xs mt-0.5
                    ${isActive ? "text-blue-500" : "text-gray-400"}
                  `}
                >
                  {step.subLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ── Mini tracker (used in BookingHistory table rows) ─────────
// Shows only 5 small colored dots with a progress line
export const MiniTracker = ({ status }) => {
  const activeStep = STATUS_TO_STEP[status] ?? 0;

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
        ❌ Cancelled
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, idx) => {
        const isDone    = idx < activeStep;
        const isActive  = idx === activeStep;
        const isPending = idx > activeStep;

        return (
          <React.Fragment key={step.key}>
            <div
              title={step.label}
              className={`
                w-5 h-5 rounded-full flex items-center justify-center text-xs
                transition-all duration-300 cursor-default
                ${isDone    ? "bg-green-500 text-white"  : ""}
                ${isActive  ? "bg-blue-600 text-white ring-2 ring-blue-200" : ""}
                ${isPending ? "bg-gray-200 text-gray-400" : ""}
              `}
            >
              {isDone ? "✓" : idx + 1}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`
                  w-4 h-0.5 rounded transition-all duration-500
                  ${idx < activeStep ? "bg-green-400" : "bg-gray-200"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
      <span
        className={`
          ml-2 text-xs font-medium
          ${status === "PAID"        ? "text-green-600" : ""}
          ${status === "IN_PROGRESS" ? "text-amber-600" : ""}
          ${status === "BOOKED"      ? "text-blue-600"  : ""}
          ${status === "ACCEPTED"    ? "text-indigo-600": ""}
          ${status === "COMPLETED"   ? "text-emerald-600":""}
        `}
      >
        {STEPS[activeStep]?.label || status}
      </span>
    </div>
  );
};

export default StatusTracker;