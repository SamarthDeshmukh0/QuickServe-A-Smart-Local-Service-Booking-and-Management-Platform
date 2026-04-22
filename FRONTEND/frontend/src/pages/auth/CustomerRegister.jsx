// ============================================================
// FILE: src/pages/auth/CustomerRegister.jsx
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { customerRegister } from "../../services/authService";
import { CITIES } from "../../utils/constants";

const CustomerRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true); setError("");
    try {
      await customerRegister(data);
      navigate("/customer/login", { state: { success: "Account created! Please login." } });
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">⚡ QuickServe</Link>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-4 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Book services in minutes</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input {...register("name", { required: "Required", minLength: { value: 3, message: "Min 3 characters" } })}
              className="input-field" placeholder="John Doe" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email Address</label>
            <input {...register("email", { required: "Required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
              type="email" className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input {...register("phone", { required: "Required", pattern: { value: /^[6-9]\d{9}$/, message: "Invalid phone number" } })}
              type="tel" className="input-field" placeholder="9876543210" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="label">City</label>
            <select {...register("city", { required: "Required" })} className="input-field">
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 characters" }, pattern: { value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must contain uppercase and number" } })}
              type="password" className="input-field" placeholder="Min 8 chars, 1 uppercase, 1 number" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input {...register("confirmPassword", { required: "Required", validate: val => val === watch("password") || "Passwords do not match" })}
              type="password" className="input-field" placeholder="Re-enter password" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-start gap-2">
            <input {...register("terms", { required: "You must accept the terms" })} type="checkbox" className="mt-1" />
            <label className="text-sm text-gray-600">I agree to the <a href="#" className="text-blue-600">Terms & Conditions</a></label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/customer/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;