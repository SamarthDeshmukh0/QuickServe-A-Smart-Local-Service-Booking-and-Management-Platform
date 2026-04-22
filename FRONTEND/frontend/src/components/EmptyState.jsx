// ============================================================
// FILE: src/components/EmptyState.jsx
// ============================================================

import React from "react";

const EmptyState = ({ icon = "📭", title = "Nothing here yet", message = "", action = null }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    {message && <p className="text-gray-500 mb-6 max-w-sm">{message}</p>}
    {action && (
      <button onClick={action.onClick} className="btn-primary">
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;