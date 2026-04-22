// ============================================================
// FILE: src/pages/auth/ProviderLogin.jsx
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { providerLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const ProviderLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true); setError("");
    try {
      const res = await providerLogin(data);
      login(res.data.token, res.data.user);
      navigate("/provider/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Check credentials or approval status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">⚡ QuickServe</Link>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-4 mb-1">Provider Login</h2>
          <p className="text-gray-500 text-sm">Access your service dashboard</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input {...register("email", { required: "Required" })} type="email" className="input-field" placeholder="provider@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input {...register("password", { required: "Required" })} type="password" className="input-field" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50">
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Not registered? <Link to="/provider/register" className="text-blue-600 font-medium">Apply as Provider</Link>
        </p>
      </div>
    </div>
  );
};

export default ProviderLogin;