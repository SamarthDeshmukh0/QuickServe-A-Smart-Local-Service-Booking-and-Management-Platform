// ============================================================
// FILE: src/components/DashboardNav.jsx  (Shared dashboard navbar)
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";

const DashboardNav = ({ links, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    const map = { CUSTOMER: "/customer/login", PROVIDER: "/provider/login", ADMIN: "/admin/login" };
    navigate(map[role] || "/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ⚡ QuickServe
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`text-sm font-medium transition-colors ${location.pathname === to ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {getInitials(user?.name || "U")}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium ml-2">Logout</button>
          </div>
        </div>

        {/* Mobile */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-2 space-y-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className="block py-2 text-sm text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <button onClick={handleLogout} className="block py-2 text-sm text-red-500 font-medium">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNav;