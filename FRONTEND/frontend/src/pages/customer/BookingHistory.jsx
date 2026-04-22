// // ============================================================
// // FILE: src/pages/customer/BookingHistory.jsx
// // ============================================================

// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { getCustomerBookings } from "../../services/bookingService";
// import DashboardNav from "../../components/DashboardNav";
// import StatusBadge from "../../components/StatusBadge";
// import EmptyState from "../../components/EmptyState";
// import { TableSkeleton } from "../../components/LoadingSkeleton";
// import { formatDate, formatCurrency } from "../../utils/helpers";

// const navLinks = [
//   { to: "/customer/dashboard", label: "Dashboard" },
//   { to: "/customer/book-service", label: "Book Service" },
//   { to: "/customer/booking-history", label: "Booking History" },
//   { to: "/customer/profile", label: "Profile" },
// ];

// const BookingHistory = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const [bookings, setBookings] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [search, setSearch] = useState("");
//   const success = location.state?.success;

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await getCustomerBookings(user.id);
//         const data = res.data || [];
//         setBookings(data);
//         setFiltered(data);
//       } catch { }
//       finally { setLoading(false); }
//     };
//     if (user?.id) fetch();
//   }, [user]);

//   useEffect(() => {
//     let data = [...bookings];
//     if (statusFilter !== "All") data = data.filter(b => b.status === statusFilter);
//     if (search) data = data.filter(b => b.providerName?.toLowerCase().includes(search.toLowerCase()) || b.service?.toLowerCase().includes(search.toLowerCase()));
//     setFiltered(data);
//   }, [statusFilter, search, bookings]);

//   const statuses = ["All", "BOOKED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "PAID", "CANCELLED"];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="CUSTOMER" />
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Booking History</h1>

//         {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{success}</div>}

//         {/* Filters */}
//         <div className="card mb-6 flex flex-col sm:flex-row gap-4">
//           <div className="flex flex-wrap gap-2">
//             {statuses.map(s => (
//               <button key={s} onClick={() => setStatusFilter(s)}
//                 className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400"}`}>
//                 {s}
//               </button>
//             ))}
//           </div>
//           <input className="input-field sm:w-64 ml-auto" placeholder="Search provider or service…" value={search} onChange={e => setSearch(e.target.value)} />
//         </div>

//         <div className="card">
//           {loading ? <TableSkeleton /> : filtered.length === 0 ? (
//             <EmptyState icon="📭" title="No bookings found" message="Try adjusting your filters." />
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 border-b border-gray-100">
//                     <th className="pb-3 font-medium">#</th>
//                     <th className="pb-3 font-medium">Service</th>
//                     <th className="pb-3 font-medium">Provider</th>
//                     <th className="pb-3 font-medium">Date & Slot</th>
//                     <th className="pb-3 font-medium">Status</th>
//                     <th className="pb-3 font-medium">Amount</th>
//                     <th className="pb-3 font-medium">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filtered.map(b => (
//                     <tr key={b.id} className="hover:bg-gray-50">
//                       <td className="py-3 text-gray-400">#{b.id}</td>
//                       <td className="py-3 font-medium text-gray-800">{b.service}</td>
//                       <td className="py-3 text-gray-600">{b.providerName}<br /><span className="text-xs text-gray-400">{b.providerCity}</span></td>
//                       <td className="py-3 text-gray-600">{formatDate(b.date)}<br /><span className="text-xs text-gray-400">{b.timeSlot}</span></td>
//                       <td className="py-3"><StatusBadge status={b.status} /></td>
//                       <td className="py-3 font-medium text-gray-800">{formatCurrency(b.amount)}</td>
//                       <td className="py-3 flex gap-2">
//                         {b.status === "COMPLETED" && <Link to={`/customer/payment/${b.id}`} className="text-blue-600 font-medium hover:underline text-xs">Pay Now</Link>}
//                         {b.status === "PAID" && !b.rated && <Link to={`/customer/rate/${b.id}`} className="text-amber-600 font-medium hover:underline text-xs">Rate</Link>}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BookingHistory;


//for the trial of the job status..

// ============================================================
// FILE: src/pages/customer/BookingHistory.jsx  (FULL REPLACEMENT)
// Added MiniTracker + "View Details" link to detail page
// ============================================================

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomerBookings } from "../../services/bookingService";
import DashboardNav from "../../components/DashboardNav";
import { MiniTracker } from "../../components/StatusTracker";
import { PageSkeleton } from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { BOOKING_STATUSES } from "../../utils/constants";

const navLinks = [
  { to: "/customer/dashboard",       label: "Dashboard"       },
  { to: "/customer/book-service",    label: "Book Service"    },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile",         label: "Profile"         },
];

const BookingHistory = () => {
  const { user }    = useAuth();
  const location    = useLocation();
  const successMsg  = location.state?.success;

  const [bookings,      setBookings]      = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [expandedId,    setExpandedId]    = useState(null);  // for mobile expanded row

  // ── Fetch all customer bookings ───────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    getCustomerBookings(user.id)
      .then(r => {
        setBookings(r.data || []);
        setFiltered(r.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // ── Filter logic ──────────────────────────────────────────
  useEffect(() => {
    let data = [...bookings];
    if (statusFilter !== "All") {
      data = data.filter(b => b.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(b =>
        b.providerName?.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [statusFilter, search, bookings]);

  if (loading) {
    return (
      <>
        <DashboardNav links={navLinks} role="CUSTOMER" />
        <PageSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-500 text-sm mb-6">Track all your service bookings in one place</p>

        {/* Success toast */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
            ✅ {successMsg}
          </div>
        )}

        {/* ── Filter bar ── */}
        <div className="card mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {["All", ...Object.keys(BOOKING_STATUSES)].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium border transition-all
                  ${statusFilter === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-blue-400"}
                `}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            className="input-field sm:w-56 ml-auto text-sm"
            placeholder="Search provider or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── Table (desktop) ── */}
        <div className="card hidden md:block">
          {filtered.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No bookings found"
              description="Try adjusting your filters or book a new service."
              action={{ label: "Book a Service", to: "/customer/book-service" }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Progress</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-gray-400 text-xs">#{b.id}</td>

                      <td className="py-3">
                        <p className="font-medium text-gray-900">{b.service}</p>
                        <p className="text-xs text-gray-400">{b.timeSlot}</p>
                      </td>

                      <td className="py-3 text-gray-600">
                        {b.providerName || "—"}
                        <p className="text-xs text-gray-400">{b.providerCity || ""}</p>
                      </td>

                      <td className="py-3 text-gray-600 text-xs">{formatDate(b.date)}</td>

                      {/* Mini tracker inline */}
                      <td className="py-3">
                        <MiniTracker status={b.status} />
                      </td>

                      {/* <td className="py-3 font-medium text-gray-800">{formatCurrency(b.amount)}</td> */}

                      <td className="py-3">
  {b.status === "PAID" ? (
    <div>
      <p className="font-medium text-gray-900">
        {formatCurrency((b.finalAmount ?? b.amount) + 49)}
      </p>
      <p className="text-xs text-gray-400">incl. ₹49 platform fee</p>
    </div>
  ) : b.status === "COMPLETED" && b.finalAmount ? (
    <div>
      <p className="font-medium text-blue-600">
        {formatCurrency(b.finalAmount + 49)}
      </p>
      <p className="text-xs text-gray-400">due · incl. ₹49 fee</p>
    </div>
  ) : (
    <div>
      <p className="font-medium text-gray-500">{formatCurrency(b.amount)}</p>
      <p className="text-xs text-gray-400">est.</p>
    </div>
  )}
</td>

                      {/* Action buttons */}
                      <td className="py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* View full tracker */}
                          <Link
                            to={`/customer/booking/${b.id}`}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Track →
                          </Link>

                          {b.status === "COMPLETED" && (
                            <Link
                              to={`/customer/payment/${b.id}`}
                              className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg hover:bg-blue-700 font-medium"
                            >
                              Pay Now
                            </Link>
                          )}

                          {b.status === "PAID" && !b.rated && (
                            <Link
                              to={`/customer/rate/${b.id}`}
                              className="text-xs bg-amber-500 text-white px-2.5 py-1 rounded-lg hover:bg-amber-600 font-medium"
                            >
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

        {/* ── Cards (mobile) ── */}
        <div className="md:hidden space-y-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No bookings found"
              action={{ label: "Book a Service", to: "/customer/book-service" }}
            />
          ) : (
            filtered.map(b => (
              <div key={b.id} className="card">
                {/* Card header */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{b.service}</p>
                    <p className="text-xs text-gray-500">{b.providerName || "—"} · {formatDate(b.date)}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{expandedId === b.id ? "▲" : "▼"}</span>
                </div>

                {/* Mini tracker always visible on mobile */}
                <div className="mt-3">
                  <MiniTracker status={b.status} />
                </div>

                {/* Expanded details */}
                {expandedId === b.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time Slot</span>
                      <span className="text-gray-800">{b.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-semibold">{formatCurrency(b.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">City</span>
                      <span className="text-gray-800">{b.providerCity || "—"}</span>
                    </div>
                    <div className="flex gap-2 pt-2 flex-wrap">
                      <Link to={`/customer/booking/${b.id}`}
                        className="flex-1 text-center text-xs bg-blue-600 text-white px-3 py-2 rounded-xl font-medium">
                        Track Status →
                      </Link>
                      {b.status === "COMPLETED" && (
                        <Link to={`/customer/payment/${b.id}`}
                          className="flex-1 text-center text-xs bg-blue-600 text-white px-3 py-2 rounded-xl font-medium">
                          Pay Now
                        </Link>
                      )}
                      {b.status === "PAID" && !b.rated && (
                        <Link to={`/customer/rate/${b.id}`}
                          className="flex-1 text-center text-xs bg-amber-500 text-white px-3 py-2 rounded-xl font-medium">
                          Rate ⭐
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default BookingHistory;