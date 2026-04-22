// ============================================================
// FILE: src/pages/provider/ProviderProfile.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import DashboardNav from "../../components/DashboardNav";
import { CITIES } from "../../utils/constants";

import { getProviderBadges } from "../../services/badgeService";
import BadgeList from "../../components/BadgeList";

const navLinks = [
  { to: "/provider/dashboard", label: "Dashboard" },
  { to: "/provider/jobs", label: "Jobs" },
  { to: "/provider/slots", label: "My Slots" },
  { to: "/provider/earnings", label: "Earnings" },
  { to: "/provider/profile", label: "Profile" },
];

const ProviderProfile = () => {
  const { user, login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [badges, setBadges] = useState([]);

useEffect(() => {
  if (user?.id) {
    getProviderBadges(user.id)
      .then(res => setBadges(res.data || []))
      .catch(() => {});
  }
    }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/providers/${user.id}/profile`, { phone, city });
      login(localStorage.getItem("token"), { ...user, phone, city });
      setSuccess("Profile updated!");
      setEditMode(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch { }
    finally { setSaving(false); }
  };

  const statusColor = { PENDING: "bg-amber-100 text-amber-700", APPROVED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="PROVIDER" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">My Profile</h1>
        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{success}</div>}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
              {(user?.name || "P").charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.profession}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[user?.status] || "bg-gray-100 text-gray-600"}`}>
                {user?.status}
              </span>
            </div>
            <button onClick={() => setEditMode(!editMode)} className="ml-auto btn-outline text-sm">{editMode ? "Cancel" : "Edit"}</button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-800">{user?.email}</p></div>
            <div><p className="text-gray-500">Profession</p><p className="font-medium text-gray-800">{user?.profession}</p></div>
            <div><p className="text-gray-500">Experience</p><p className="font-medium text-gray-800">{user?.yearsExperience} years</p></div>
            <div><p className="text-gray-500">Rating</p><p className="font-medium text-amber-500">{"★".repeat(Math.round(user?.avgRating || 0))} ({user?.avgRating?.toFixed(1) || "0.0"})</p></div>
          </div>

          {badges.length > 0 && (
        <div className="card mt-4">
          <h3 className="font-semibold text-gray-800 mb-3">My Badges</h3>
          <BadgeList badges={badges} size="md" />
        </div>
           )}

          {editMode && (
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div>
                <label className="label">Phone Number</label>
                <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="label">Service City</label>
                <select className="input-field" value={city} onChange={e => setCity(e.target.value)}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;