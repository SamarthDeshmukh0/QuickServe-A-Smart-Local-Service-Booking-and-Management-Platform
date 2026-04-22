// ============================================================
// FILE: src/pages/customer/CustomerDashboard.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomerBookings } from "../../services/bookingService";
import DashboardNav from "../../components/DashboardNav";
import StatusBadge from "../../components/StatusBadge";
import { PageSkeleton } from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatCurrency } from "../../utils/helpers";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/customer/dashboard", label: "Dashboard" },
    { to: "/customer/book-service", label: "Book Service" },
    { to: "/customer/booking-history", label: "Booking History" },
    { to: "/customer/profile", label: "Profile" },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCustomerBookings(user.id);
        setBookings(res.data || []);
      } catch { setBookings([]); }
      finally { setLoading(false); }
    };
    if (user?.id) fetch();
  }, [user]);

  if (loading) return <><DashboardNav links={navLinks} role="CUSTOMER" /><PageSkeleton /></>;

  const totalSpent = bookings.filter(b => b.status === "PAID").reduce((sum, b) => sum + ((b.finalAmount ?? b.amount) + 49), 0);
  const activeCount = bookings.filter(b => ["BOOKED","ACCEPTED","IN_PROGRESS"].includes(b.status)).length;
  const completedCount = bookings.filter(b => ["COMPLETED","PAID"].includes(b.status)).length;
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const statCards = [
    { label: "Total Bookings", value: bookings.length, icon: "📅", color: "bg-blue-50 text-blue-600" },
    { label: "Active Bookings", value: activeCount, icon: "⏳", color: "bg-amber-50 text-amber-600" },
    { label: "Completed Services", value: completedCount, icon: "✅", color: "bg-green-50 text-green-600" },
    { label: "Total Spent", value: formatCurrency(totalSpent), icon: "₹", color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your service activity</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="card">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${card.color}`}>{card.icon}</div>
              <p className="text-3xl font-display font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link to="/customer/book-service" className="btn-primary">📅 Book New Service</Link>
          {/* adding he btn for grp bking */}
          <Link
  to="/customer/book-package"
  className="flex items-center gap-2 bg-purple-600 text-white font-semibold
             px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-all
             shadow-md shadow-purple-100"
>
  📦 Book a Package
</Link>

          <Link to="/customer/booking-history" className="btn-outline">View All Bookings</Link>
          {/* ── NEW: Urgent booking button ── */}
          <Link to="/customer/urgent-booking" className="flex items-center gap-2 bg-red-600 text-white font-semibold
               px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all
               shadow-md shadow-red-100"
  >
    🚨 Emergency Booking
  </Link>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <EmptyState icon="📭" title="No bookings yet" message="Book your first service to get started."
              action={{ label: "Book a Service", onClick: () => navigate("/customer/book-service") }} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{b.service}</td>
                      <td className="py-3 text-gray-600">{b.providerName || "—"}</td>
                      <td className="py-3 text-gray-600">{formatDate(b.date)}</td>
                      <td className="py-3"><StatusBadge status={b.status} /></td>
                      
                      {/* <td className="py-3">
                        {b.status === "COMPLETED" && (
                          <Link to={`/customer/payment/${b.id}`} className="text-blue-600 font-medium hover:underline">Pay Now</Link>
                        )}
                        {b.status === "PAID" && !b.rated && (
                          <Link to={`/customer/rate/${b.id}`} className="text-amber-600 font-medium hover:underline">Rate</Link>
                        )}
                      </td> */}

                       <td className="py-3">
                  <div className="flex flex-col gap-1">
                    <Link
                      to={`/customer/booking/${b.id}`}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Track →
                    </Link>
                    {b.status === "COMPLETED" && (
                      <Link to={`/customer/payment/${b.id}`} className="text-blue-600 font-medium hover:underline text-xs">
                        Pay Now
                      </Link>
                    )}
                    {b.status === "PAID" && !b.rated && (
                      <Link to={`/customer/rate/${b.id}`} className="text-amber-600 font-medium hover:underline text-xs">
                        Rate ⭐
                      </Link>
                    )}
                  </div>
                </td> 


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;