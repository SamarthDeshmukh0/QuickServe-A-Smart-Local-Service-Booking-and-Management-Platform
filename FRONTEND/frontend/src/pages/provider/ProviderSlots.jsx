// ============================================================
// FILE: src/pages/provider/ProviderSlots.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProviderSlots, createSlots, deleteSlot } from "../../services/slotService";
import DashboardNav from "../../components/DashboardNav";
import { TIME_SLOTS } from "../../utils/constants";

const navLinks = [
  { to: "/provider/dashboard", label: "Dashboard" },
  { to: "/provider/jobs", label: "Jobs" },
  { to: "/provider/slots", label: "My Slots" },
  { to: "/provider/earnings", label: "Earnings" },
  { to: "/provider/profile", label: "Profile" },
];

const ProviderSlots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const res = await getProviderSlots(user.id);
      setSlots(res.data || []);
    } catch { }
  };

  useEffect(() => { if (user?.id) load(); }, [user]);

  const slotsForDate = (date) => slots.filter(s => s.slotDate === date);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const existing = slotsForDate(date).filter(s => !s.isBooked).map(s => s.slotTime);
    setSelectedSlots(existing);
  };

  const toggleSlot = (slotValue) => {
    setSelectedSlots(prev => prev.includes(slotValue) ? prev.filter(s => s !== slotValue) : [...prev, slotValue]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await createSlots({ providerId: user.id, slotDate: selectedDate, slotTimes: selectedSlots });
      setSuccess("Availability saved!");
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch { }
    finally { setSaving(false); }
  };

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="PROVIDER" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Slot Management</h1>
        <p className="text-gray-500 mb-6">Set your availability so customers can book you</p>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{success}</div>}

        {/* Upcoming 7 Days */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Select a Date</h2>
          <div className="flex gap-3 flex-wrap">
            {next7Days.map(date => {
              const daySlots = slotsForDate(date);
              const available = daySlots.filter(s => !s.isBooked).length;
              const booked = daySlots.filter(s => s.isBooked).length;
              const d = new Date(date);
              return (
                <button key={date} onClick={() => handleDateSelect(date)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-20 ${selectedDate === date ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                  <span className="text-xs text-gray-500">{d.toLocaleDateString("en-IN",{weekday:"short"})}</span>
                  <span className="text-lg font-bold text-gray-900">{d.getDate()}</span>
                  <span className="text-xs text-gray-400">{d.toLocaleDateString("en-IN",{month:"short"})}</span>
                  {daySlots.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {available > 0 && <span className="w-2 h-2 bg-green-500 rounded-full" title={`${available} available`} />}
                      {booked > 0 && <span className="w-2 h-2 bg-blue-500 rounded-full" title={`${booked} booked`} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot Picker */}
        {selectedDate && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">
                Slots for {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setSelectedSlots(TIME_SLOTS.map(s => s.value))} className="text-xs text-blue-600 hover:underline">Set All</button>
                <button onClick={() => setSelectedSlots([])} className="text-xs text-red-500 hover:underline">Clear All</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {TIME_SLOTS.map(slot => {
                const existingSlot = slotsForDate(selectedDate).find(s => s.slotTime === slot.value);
                const isBooked = existingSlot?.isBooked;
                const isSelected = selectedSlots.includes(slot.value);
                return (
                  <button key={slot.id} onClick={() => !isBooked && toggleSlot(slot.value)} disabled={isBooked}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${isBooked ? "border-blue-200 bg-blue-50 text-blue-600 cursor-not-allowed" : isSelected ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-gray-400 text-gray-600"}`}>
                    {slot.label}
                    {isBooked && <span className="block text-xs text-blue-400">Booked</span>}
                    {!isBooked && isSelected && <span className="block text-xs text-green-500">✓ Available</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary px-8">{saving ? "Saving…" : "Save Availability"}</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderSlots;