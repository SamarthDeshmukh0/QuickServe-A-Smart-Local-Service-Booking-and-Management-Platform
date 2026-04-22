// ============================================================
// FILE: src/components/Navbar.jsx  (Public Landing Navbar)
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const loginRef = useRef();
  const registerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) setLoginOpen(false);
      if (registerRef.current && !registerRef.current.contains(e.target)) setRegisterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ⚡ QuickServe
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Our Services</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#why-us" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Why Choose Us</a>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Login Dropdown */}
            <div className="relative" ref={loginRef}>
              <button onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false); }}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 border border-gray-200 rounded-lg px-4 py-2 transition-all hover:border-blue-300">
                Login ▾
              </button>
              {loginOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link to="/customer/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setLoginOpen(false)}>👤 Customer Login</Link>
                  <Link to="/provider/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setLoginOpen(false)}>🔧 Provider Login</Link>
                  <Link to="/admin/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setLoginOpen(false)}>🛡️ Admin Login</Link>
                </div>
              )}
            </div>

            {/* Register Dropdown */}
            <div className="relative" ref={registerRef}>
              <button onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false); }}
                className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg px-4 py-2 transition-all hover:opacity-90">
                Register ▾
              </button>
              {registerOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link to="/customer/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setRegisterOpen(false)}>👤 Customer Register</Link>
                  <Link to="/provider/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => setRegisterOpen(false)}>🔧 Provider Register</Link>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-gray-600 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-3">
            <a href="#services" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Our Services</a>
            <a href="#how-it-works" className="block py-2 text-sm text-gray-600 hover:text-blue-600">How It Works</a>
            <a href="#why-us" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Why Choose Us</a>
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <Link to="/customer/login" className="block py-2 text-sm text-gray-700">👤 Customer Login</Link>
              <Link to="/provider/login" className="block py-2 text-sm text-gray-700">🔧 Provider Login</Link>
              <Link to="/admin/login" className="block py-2 text-sm text-gray-700">🛡️ Admin Login</Link>
              <Link to="/customer/register" className="block py-2 text-sm text-blue-600 font-medium">Register as Customer</Link>
              <Link to="/provider/register" className="block py-2 text-sm text-blue-600 font-medium">Register as Provider</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar