// ============================================================
// FILE: src/pages/auth/ProviderRegister.jsx
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { providerRegister } from "../../services/authService";
import { CITIES, SERVICES } from "../../utils/constants";

const ProviderRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true); setError("");
    try {
      await providerRegister(data);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">Your account has been submitted for approval. You will be able to login once approved by an admin.</p>
        <Link to="/provider/login" className="btn-primary inline-block">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">⚡ QuickServe</Link>
          <h2 className="text-2xl font-display font-bold text-gray-900 mt-4 mb-1">Provider Registration</h2>
          <p className="text-gray-500 text-sm">Join our network of verified professionals</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input {...register("name", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })} className="input-field" placeholder="Ravi Kumar" />
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
            <input {...register("phone", { required: "Required", pattern: { value: /^[6-9]\d{9}$/, message: "Invalid phone" } })}
              type="tel" className="input-field" placeholder="9876543210" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="label">Profession</label>
            <select {...register("profession", { required: "Required" })} className="input-field">
              <option value="">Select Profession</option>
              {SERVICES.map(s => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
            </select>
            {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession.message}</p>}
          </div>
          <div>
            <label className="label">Years of Experience</label>
            <input {...register("yearsExperience", { required: "Required", min: { value: 0, message: "Min 0" }, max: { value: 50, message: "Max 50" } })}
              type="number" className="input-field" placeholder="e.g., 5" />
            {errors.yearsExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsExperience.message}</p>}
          </div>
          <div>
            <label className="label">Service City</label>
            <select {...register("city", { required: "Required" })} className="input-field">
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 chars" }, pattern: { value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must have uppercase & number" } })}
              type="password" className="input-field" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input {...register("confirmPassword", { required: "Required", validate: v => v === watch("password") || "Passwords don't match" })}
              type="password" className="input-field" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-start gap-2">
            <input {...register("terms", { required: "Must accept terms" })} type="checkbox" className="mt-1" />
            <label className="text-sm text-gray-600">I agree to the <a href="#" className="text-blue-600">Terms & Conditions</a></label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already approved? <Link to="/provider/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ProviderRegister;