// ============================================================
// FILE: src/pages/admin/AdminBookings.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../services/adminService";
import DashboardNav from "../../components/DashboardNav";
import StatusBadge from "../../components/StatusBadge";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { BOOKING_STATUSES } from "../../utils/constants";

const navLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/providers", label: "Providers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/analytics", label: "Analytics" },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllBookings().then(r => { setBookings(r.data || []); setFiltered(r.data || []); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = [...bookings];
    if (statusFilter !== "All") data = data.filter(b => b.status === statusFilter);
    if (search) data = data.filter(b =>
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.providerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(data);
  }, [statusFilter, search, bookings]);

  const exportCSV = () => {
    const headers = ["ID","Customer","Provider","Service","Date","Slot","Status","Amount"];
    const rows = filtered.map(b => [b.id, b.customerName, b.providerName, b.service, b.date, b.timeSlot, b.status, b.amount]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="ADMIN" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">All Bookings</h1>
          <button onClick={exportCSV} className="btn-outline text-sm">⬇ Export CSV</button>
        </div>

        <div className="card mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", ...Object.keys(BOOKING_STATUSES)].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400"}`}>
                {s}
              </button>
            ))}
          </div>
          <input className="input-field sm:w-64 ml-auto" placeholder="Search customer, provider, service…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="card">
          {loading ? <TableSkeleton /> : filtered.length === 0 ? <EmptyState icon="📭" title="No bookings found" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    {["#","Customer","Provider","Service","Date","Slot","Status","Amount"].map(h => (
                      <th key={h} className="pb-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-400">#{b.id}</td>
                      <td className="py-3 font-medium text-gray-800">{b.customerName}</td>
                      <td className="py-3 text-gray-600">{b.providerName}</td>
                      <td className="py-3 text-gray-600">{b.service}</td>
                      <td className="py-3 text-gray-600">{formatDate(b.date)}</td>
                      <td className="py-3 text-gray-500 text-xs">{b.timeSlot}</td>
                      <td className="py-3"><StatusBadge status={b.status} /></td>
                      <td className="py-3 font-medium">{formatCurrency(b.amount)}</td>
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

export default AdminBookings;