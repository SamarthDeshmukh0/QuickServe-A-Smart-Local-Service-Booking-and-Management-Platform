// ============================================================
// FILE: src/pages/customer/CustomerProfile.jsx
// ============================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import DashboardNav from "../../components/DashboardNav";
import { CITIES } from "../../utils/constants";

const navLinks = [
  { to: "/customer/dashboard", label: "Dashboard" },
  { to: "/customer/book-service", label: "Book Service" },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile", label: "Profile" },
];

const CustomerProfile = () => {
  const { user, login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { name: user?.name, phone: user?.phone, city: user?.city } });

  const onSave = async (data) => {
    setSaving(true);
    try {
      const res = await api.put(`/api/customers/${user.id}/profile`, data);
      login(localStorage.getItem("token"), { ...user, ...data });
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch { }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">My Profile</h1>
        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{success}</div>}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            <button onClick={() => setEditMode(!editMode)} className="ml-auto btn-outline text-sm">{editMode ? "Cancel" : "Edit Profile"}</button>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input {...register("name", { required: "Required" })} className="input-field" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input {...register("phone", { required: "Required" })} className="input-field" />
              </div>
              <div>
                <label className="label">City</label>
                <select {...register("city")} className="input-field">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Changes"}</button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Email</p><p className="font-medium">{user?.email}</p></div>
              <div><p className="text-gray-500">Phone</p><p className="font-medium">{user?.phone}</p></div>
              <div><p className="text-gray-500">City</p><p className="font-medium">{user?.city}</p></div>
              <div><p className="text-gray-500">Role</p><p className="font-medium">Customer</p></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;