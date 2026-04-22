// ============================================================
// FILE: src/components/StatusBadge.jsx
// ============================================================

import React from "react";
import { BOOKING_STATUSES } from "../utils/constants";

const StatusBadge = ({ status }) => {
  const config = BOOKING_STATUSES[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;