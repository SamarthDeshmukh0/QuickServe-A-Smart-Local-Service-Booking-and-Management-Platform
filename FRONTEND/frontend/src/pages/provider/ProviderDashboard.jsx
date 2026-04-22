// ============================================================
// FILE: src/pages/provider/ProviderDashboard.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProviderBookings } from "../../services/bookingService";
import { getProviderEarnings } from "../../services/providerService";
import DashboardNav from "../../components/DashboardNav";
import { PageSkeleton } from "../../components/LoadingSkeleton";
import { formatCurrency } from "../../utils/helpers";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const navLinks = [
  { to: "/provider/dashboard", label: "Dashboard" },
  { to: "/provider/jobs", label: "Jobs" },
  { to: "/provider/slots", label: "My Slots" },
  { to: "/provider/earnings", label: "Earnings" },
  { to: "/provider/profile", label: "Profile" },
];

const COLORS = ["#2563EB", "#16A34A", "#DC2626", "#D97706"];

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [bRes, eRes] = await Promise.all([
          getProviderBookings(user.id),
          getProviderEarnings(user.id),
        ]);
        setBookings(bRes.data || []);
        setEarnings(eRes.data || {});
      } catch { }
      finally { setLoading(false); }
    };
    if (user?.id) fetch();
  }, [user]);

  if (loading) return <><DashboardNav links={navLinks} role="PROVIDER" /><PageSkeleton /></>;

  const today = new Date().toISOString().split("T")[0];
  const todayJobs = bookings.filter(b => b.date === today).length;
  const avgRating = user?.avgRating || 0;

  const statCards = [
    { label: "Total Earnings", value: formatCurrency(earnings?.total || 0), icon: "₹", color: "bg-green-50 text-green-600" },
    { label: "Today's Earnings", value: formatCurrency(earnings?.today || 0), icon: "📅", color: "bg-blue-50 text-blue-600" },
    { label: "Today's Jobs", value: todayJobs, icon: "🔧", color: "bg-amber-50 text-amber-600" },
    { label: "Avg. Rating", value: `${avgRating.toFixed(1)} ★`, icon: "⭐", color: "bg-purple-50 text-purple-600" },
  ];

  const monthlyData = earnings?.monthly || [];
  const statusData = [
    { name: "Accepted", value: bookings.filter(b => b.status === "ACCEPTED").length },
    { name: "Completed", value: bookings.filter(b => ["COMPLETED","PAID"].includes(b.status)).length },
    { name: "Cancelled", value: bookings.filter(b => b.status === "CANCELLED").length },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="PROVIDER" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">{user?.profession} • {user?.city}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(c => (
            <div key={c.label} className="card">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${c.color}`}>{c.icon}</div>
              <p className="text-3xl font-display font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Monthly Earnings</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => formatCurrency(v)} />
                  <Bar dataKey="amount" fill="#2563EB" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="text-center py-12 text-gray-400">No earnings data yet</div>}
          </div>
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Jobs Breakdown</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="text-center py-12 text-gray-400">No job data yet</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;