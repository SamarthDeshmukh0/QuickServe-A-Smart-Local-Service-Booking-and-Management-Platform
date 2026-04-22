// ============================================================
// FILE: src/pages/auth/AdminLogin.jsx
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { adminLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true); setError("");
    try {
      const res = await adminLogin(data);
      login(res.data.token, res.data.user);
      navigate("/admin/dashboard");
    } catch (e) {
      setError("Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🛡️</div>
          <Link to="/" className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">⚡ QuickServe</Link>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-3 mb-1">Admin Portal</h2>
          <p className="text-gray-500 text-sm">Platform management access</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email / Username</label>
            <input {...register("email", { required: "Required" })} type="email" className="input-field" placeholder="admin@quickserve.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input {...register("password", { required: "Required" })} type="password" className="input-field" placeholder="admin@123" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50">
            {loading ? "Authenticating…" : "Login to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;