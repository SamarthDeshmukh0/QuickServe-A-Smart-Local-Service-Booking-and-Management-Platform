// FILE: src/components/ProtectedRoute.jsx
// ============================================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen text-blue-600 text-xl font-semibold">Loading…</div>;

  if (!user) {
    const redirectMap = { CUSTOMER: "/customer/login", PROVIDER: "/provider/login", ADMIN: "/admin/login" };
    return <Navigate to={redirectMap[role] || "/customer/login"} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;