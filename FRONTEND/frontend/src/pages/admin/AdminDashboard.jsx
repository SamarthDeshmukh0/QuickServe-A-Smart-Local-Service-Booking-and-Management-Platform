// ============================================================
// FILE: src/pages/admin/AdminDashboard.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalytics } from "../../services/adminService";
import DashboardNav from "../../components/DashboardNav";
import { PageSkeleton } from "../../components/LoadingSkeleton";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

const navLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/providers", label: "Providers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/analytics", label: "Analytics" },
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <><DashboardNav links={navLinks} role="ADMIN" /><PageSkeleton /></>;

  const statCards = [
    { label: "Total Customers", value: data?.totalCustomers || 0, icon: "👤", color: "bg-blue-50 text-blue-600" },
    { label: "Total Providers", value: data?.totalProviders || 0, icon: "🔧", color: "bg-green-50 text-green-600" },
    { label: "Total Bookings", value: data?.totalBookings || 0, icon: "📅", color: "bg-purple-50 text-purple-600" },
    { label: "Total Revenue", value: formatCurrency(data?.totalRevenue || 0), icon: "₹", color: "bg-orange-50 text-orange-600" },
  ];

  const quickStats = [
    { label: "Pending Approvals", value: data?.pendingApprovals || 0, link: "/admin/providers", color: "text-amber-600" },
    { label: "Today's Bookings", value: data?.todayBookings || 0, link: "/admin/bookings", color: "text-blue-600" },
    { label: "Active Jobs", value: data?.activeBookings || 0, link: "/admin/bookings", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="ADMIN" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and activity</p>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickStats.map(s => (
            <Link key={s.label} to={s.link} className="card flex items-center justify-between hover:bg-blue-50 transition-colors">
              <span className="text-sm text-gray-600">{s.label}</span>
              <span className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</span>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Recent Activity</h2>
          {(data?.recentActivity || []).length === 0 ? (
            <div className="text-center py-8 text-gray-400">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {data.recentActivity.map((act, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="text-xl">{act.icon || "📌"}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{act.description}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(act.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;