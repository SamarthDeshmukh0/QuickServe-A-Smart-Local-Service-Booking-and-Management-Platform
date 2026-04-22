// ============================================================
// FILE: src/pages/auth/CustomerLogin.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { customerLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const CustomerLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.success;

  const onSubmit = async (data) => {
    setLoading(true); setError("");
    try {
      const res = await customerLogin(data);
      login(res.data.token, res.data.user);
      navigate("/customer/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">⚡ QuickServe</Link>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-4 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm">Login to your customer account</p>
        </div>

        {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{successMsg}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input {...register("email", { required: "Required" })} type="email" className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input {...register("password", { required: "Required" })} type="password" className="input-field" placeholder="Your password" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input {...register("rememberMe")} type="checkbox" />
            <label className="text-sm text-gray-600">Remember me</label>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/customer/register" className="text-blue-600 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;