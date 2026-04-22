// // ============================================================
// // FILE: src/pages/admin/AdminAnalytics.jsx
// // ============================================================

// import React, { useEffect, useState } from "react";
// import { getAnalytics } from "../../services/adminService";
// import DashboardNav from "../../components/DashboardNav";
// import { PageSkeleton } from "../../components/LoadingSkeleton";
// import { formatCurrency } from "../../utils/helpers";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
// } from "recharts";

// const navLinks = [
//   { to: "/admin/dashboard", label: "Dashboard" },
//   { to: "/admin/providers", label: "Providers" },
//   { to: "/admin/bookings", label: "Bookings" },
//   { to: "/admin/analytics", label: "Analytics" },
// ];

// const COLORS = ["#2563EB","#16A34A","#D97706","#DC2626","#4F46E5","#0891B2","#7C3AED","#059669","#F97316","#BE185D"];

// const AdminAnalytics = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getAnalytics().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   if (loading) return <><DashboardNav links={navLinks} role="ADMIN" /><PageSkeleton /></>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="ADMIN" />
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">Platform Analytics</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Most Booked Services */}
//           <div className="card">
//             <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Most Booked Services</h2>
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={data?.serviceStats || []} layout="vertical">
//                 <XAxis type="number" tick={{ fontSize: 11 }} />
//                 <YAxis dataKey="service" type="category" tick={{ fontSize: 11 }} width={90} />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#2563EB" radius={[0,6,6,0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Monthly Revenue */}
//           <div className="card">
//             <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Monthly Revenue</h2>
//             <ResponsiveContainer width="100%" height={280}>
//               <LineChart data={data?.monthlyRevenue || []}>
//                 <XAxis dataKey="month" tick={{ fontSize: 11 }} />
//                 <YAxis tick={{ fontSize: 11 }} />
//                 <Tooltip formatter={v => formatCurrency(v)} />
//                 <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB" }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* City-wise Bookings */}
//           <div className="card">
//             <h2 className="text-lg font-display font-bold text-gray-900 mb-5">City-wise Bookings</h2>
//             <ResponsiveContainer width="100%" height={280}>
//               <PieChart>
//                 <Pie data={data?.cityStats || []} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="city" label={({ city, percent }) => `${city} ${(percent * 100).toFixed(0)}%`}>
//                   {(data?.cityStats || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* New Users Growth */}
//           <div className="card">
//             <h2 className="text-lg font-display font-bold text-gray-900 mb-5">New Users Growth</h2>
//             <ResponsiveContainer width="100%" height={280}>
//               <AreaChart data={data?.userGrowth || []}>
//                 <XAxis dataKey="month" tick={{ fontSize: 11 }} />
//                 <YAxis tick={{ fontSize: 11 }} />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="customers" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} name="Customers" />
//                 <Area type="monotone" dataKey="providers" stroke="#16A34A" fill="#DCFCE7" strokeWidth={2} name="Providers" />
//                 <Legend />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Top 5 Providers */}
//         <div className="card">
//           <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Top 5 Providers</h2>
//           {(data?.topProviders || []).length === 0 ? (
//             <div className="text-center py-8 text-gray-400">No provider data yet</div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               {data.topProviders.map((p, i) => (
//                 <div key={p.id} className="bg-gray-50 rounded-xl p-4 text-center">
//                   <div className={`text-2xl font-display font-bold mb-1 ${i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-gray-600"}`}>
//                     {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
//                   </div>
//                   <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
//                   <p className="text-xs text-gray-500 mb-2">{p.profession}</p>
//                   <p className="text-xs text-amber-500">{"★".repeat(Math.round(p.avgRating || 0))}</p>
//                   <p className="text-xs text-gray-500 mt-1">{p.completedJobs} jobs</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminAnalytics;

// ============================================================
// FILE: src/pages/admin/AdminAnalytics.jsx  (FULL REPLACEMENT)
// Complete file — all 6 existing charts preserved exactly
// + Booking Demand Heatmap section added at the bottom
// ============================================================

import React, { useEffect, useState } from "react";
import { getAnalytics } from "../../services/adminService";
import DashboardNav from "../../components/DashboardNav";
import { PageSkeleton } from "../../components/LoadingSkeleton";
import { formatCurrency } from "../../utils/helpers";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

const navLinks = [
  { to: "/admin/dashboard",  label: "Dashboard"  },
  { to: "/admin/providers",  label: "Providers"  },
  { to: "/admin/bookings",   label: "Bookings"   },
  { to: "/admin/analytics",  label: "Analytics"  },
];

const COLORS = [
  "#2563EB","#16A34A","#D97706","#DC2626",
  "#4F46E5","#0891B2","#7C3AED","#059669","#F97316","#BE185D"
];

// ── Slot rows shown on heatmap Y-axis (order matters) ────────
const SLOT_ROWS = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
];

// ── Day columns shown on heatmap X-axis ───────────────────────
const DAY_COLS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── 4-level green intensity scale based on count ──────────────
// Returns a Tailwind background class and a tooltip-ready color
const getHeatColor = (count, maxCount) => {
  if (count === 0 || maxCount === 0) return { bg: "#F1F5F9", text: "#94A3B8" };
  const ratio = count / maxCount;
  if (ratio <= 0.25) return { bg: "#C0DD97", text: "#3B6D11" }; // light green
  if (ratio <= 0.50) return { bg: "#97C459", text: "#27500A" }; // medium green
  if (ratio <= 0.75) return { bg: "#639922", text: "#FFFFFF" }; // dark green
  return              { bg: "#3B6D11", text: "#FFFFFF" };        // darkest green
};

// ── Heatmap component ─────────────────────────────────────────
const BookingHeatmap = ({ heatmapData }) => {
  const [tooltip, setTooltip] = useState(null); // {x, y, day, slot, count}
  const [activeFilter, setActiveFilter] = useState("All"); // "All" | "Weekday" | "Weekend"

  // Build a lookup: "slotValue|dayLabel" → count
  const lookup = {};
  (heatmapData || []).forEach(cell => {
    lookup[`${cell.slot}|${cell.dayLabel}`] = cell.count;
  });

  // Find max count for relative color scaling
  const maxCount = Math.max(
    1, // floor at 1 to avoid division by zero
    ...(heatmapData || []).map(c => c.count)
  );

  // Column totals (busiest day label)
  const colTotals = DAY_COLS.map(day => ({
    day,
    total: SLOT_ROWS.reduce((sum, slot) => sum + (lookup[`${slot}|${day}`] || 0), 0),
  }));

  // Row totals (busiest time slot label)
  const rowTotals = SLOT_ROWS.map(slot => {
    const label = (heatmapData || []).find(c => c.slot === slot)?.slotLabel || slot;
    return {
      slot,
      label,
      total: DAY_COLS.reduce((sum, day) => sum + (lookup[`${slot}|${day}`] || 0), 0),
    };
  });

  // Peak cell info
  const peakCell = (heatmapData || []).reduce(
    (best, c) => (c.count > (best?.count || 0) ? c : best),
    null
  );

  // Filter: weekday = Mon–Fri, weekend = Sat+Sun
  const filteredCols = activeFilter === "Weekday"
    ? DAY_COLS.slice(0, 5)
    : activeFilter === "Weekend"
    ? DAY_COLS.slice(5)
    : DAY_COLS;

  return (
    <div className="card">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-display font-bold text-gray-900">
            Booking Demand Heatmap
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            When do customers book most? Darker = more bookings.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {["All","Weekday","Weekend"].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                ${activeFilter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-400"}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Peak insight banner ── */}
      {peakCell && peakCell.count > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-3">
          <span className="text-lg">🔥</span>
          <p className="text-sm text-green-700">
            Peak demand: <span className="font-semibold">{peakCell.dayLabel}s at {peakCell.slotLabel}</span>
            {" "}with <span className="font-semibold">{peakCell.count} bookings</span>
          </p>
        </div>
      )}

      {/* ── Heatmap grid ── */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 380 }}>

          {/* Day header row */}
          <div
            className="grid mb-1"
            style={{
              gridTemplateColumns: `68px repeat(${filteredCols.length}, 1fr)`,
              gap: "3px",
            }}
          >
            {/* Empty top-left corner cell */}
            <div />
            {filteredCols.map(day => {
              const total = colTotals.find(c => c.day === day)?.total || 0;
              const isBusiest = colTotals.reduce((a, b) => a.total > b.total ? a : b).day === day;
              return (
                <div key={day} className="text-center">
                  <p
                    className={`
                      text-xs font-semibold
                      ${isBusiest ? "text-green-700" : "text-gray-500"}
                    `}
                  >
                    {day}
                  </p>
                  <p className="text-xs text-gray-400">{total}</p>
                </div>
              );
            })}
          </div>

          {/* Slot rows + cells */}
          {SLOT_ROWS.map(slot => {
            const rowMeta = rowTotals.find(r => r.slot === slot);
            return (
              <div
                key={slot}
                className="grid mb-0.5"
                style={{
                  gridTemplateColumns: `68px repeat(${filteredCols.length}, 1fr)`,
                  gap: "3px",
                }}
              >
                {/* Slot label on left */}
                <div className="flex items-center justify-end pr-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {rowMeta?.label || slot}
                  </span>
                </div>

                {/* Heat cells */}
                {filteredCols.map(day => {
                  const count = lookup[`${slot}|${day}`] || 0;
                  const { bg, text } = getHeatColor(count, maxCount);

                  return (
                    <div
                      key={day}
                      className="relative rounded cursor-pointer transition-transform hover:scale-110 hover:z-10"
                      style={{
                        backgroundColor: bg,
                        height: 32,
                      }}
                      onMouseEnter={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          day,
                          slotLabel: rowMeta?.label || slot,
                          count,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {/* Show count text only if cell is large enough */}
                      {count > 0 && (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-xs font-semibold"
                          style={{ color: text }}
                        >
                          {count}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Row total on right */}
                <div
                  className="hidden lg:flex items-center pl-2"
                  style={{ gridColumn: filteredCols.length + 2 }}
                >
                  <span className="text-xs text-gray-400">{rowMeta?.total || 0}</span>
                </div>
              </div>
            );
          })}

          {/* ── Color legend ── */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Less</span>
            {[
              { bg: "#F1F5F9", label: "0"   },
              { bg: "#C0DD97", label: "Low" },
              { bg: "#97C459", label: ""    },
              { bg: "#639922", label: ""    },
              { bg: "#3B6D11", label: "High"},
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: item.bg }}
                />
                {item.label && (
                  <span className="text-xs text-gray-400">{item.label}</span>
                )}
              </div>
            ))}
            <span className="text-xs text-gray-500">More</span>

            <span className="ml-auto text-xs text-gray-400">
              Numbers = total bookings per cell
            </span>
          </div>
        </div>
      </div>

      {/* ── Floating tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 10, transform: "translate(-50%, -100%)" }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <p className="font-semibold">{tooltip.day} · {tooltip.slotLabel}</p>
            <p className="text-gray-300 mt-0.5">
              {tooltip.count === 0
                ? "No bookings"
                : `${tooltip.count} booking${tooltip.count > 1 ? "s" : ""}`}
            </p>
          </div>
          {/* Tooltip arrow */}
          <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
};

// ── Busiest Slots Summary Bar ─────────────────────────────────
// Shows top 3 days and top 3 time slots as quick insight cards
const HeatmapInsights = ({ heatmapData }) => {
  if (!heatmapData || heatmapData.length === 0) return null;

  // Build day totals
  const dayTotals = DAY_COLS.map(day => ({
    day,
    total: (heatmapData || [])
      .filter(c => c.dayLabel === day)
      .reduce((sum, c) => sum + c.count, 0),
  })).sort((a, b) => b.total - a.total);

  // Build slot totals
  const slotTotalMap = {};
  (heatmapData || []).forEach(c => {
    const key = c.slot;
    if (!slotTotalMap[key]) slotTotalMap[key] = { slotLabel: c.slotLabel, total: 0 };
    slotTotalMap[key].total += c.count;
  });
  const slotTotals = Object.values(slotTotalMap)
    .sort((a, b) => b.total - a.total);

  const grandTotal = dayTotals.reduce((sum, d) => sum + d.total, 0);

  if (grandTotal === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

      {/* Busiest Days */}
      <div className="card">
        <h3 className="text-sm font-display font-bold text-gray-900 mb-3">
          Busiest Days
        </h3>
        <div className="space-y-2">
          {dayTotals.slice(0, 3).map((d, i) => {
            const pct = grandTotal > 0 ? Math.round((d.total / grandTotal) * 100) : 0;
            const medals = ["🥇","🥈","🥉"];
            return (
              <div key={d.day}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {medals[i]} {d.day}
                  </span>
                  <span className="text-xs text-gray-500">
                    {d.total} bookings · {pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Busiest Time Slots */}
      <div className="card">
        <h3 className="text-sm font-display font-bold text-gray-900 mb-3">
          Busiest Time Slots
        </h3>
        <div className="space-y-2">
          {slotTotals.slice(0, 3).map((s, i) => {
            const pct = grandTotal > 0 ? Math.round((s.total / grandTotal) * 100) : 0;
            const medals = ["🥇","🥈","🥉"];
            return (
              <div key={s.slotLabel}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {medals[i]} {s.slotLabel}
                  </span>
                  <span className="text-xs text-gray-500">
                    {s.total} bookings · {pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

// ── Main AdminAnalytics page ──────────────────────────────────
const AdminAnalytics = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(r  => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <DashboardNav links={navLinks} role="ADMIN" />
        <PageSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">
          Platform Analytics
        </h1>

        {/* ── Row 1: Most Booked Services + Monthly Revenue ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Most Booked Services */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
              Most Booked Services
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data?.serviceStats || []}
                layout="vertical"
              >
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="service"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={90}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Revenue */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
              Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data?.monthlyRevenue || []}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => formatCurrency(v)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ── Row 2: City-wise + User Growth ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* City-wise Bookings */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
              City-wise Bookings
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data?.cityStats || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  nameKey="city"
                  label={({ city, percent }) =>
                    `${city} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {(data?.cityStats || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* New Users Growth */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
              New Users Growth
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.userGrowth || []}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="customers"
                  stroke="#2563EB"
                  fill="#DBEAFE"
                  strokeWidth={2}
                  name="Customers"
                />
                <Area
                  type="monotone"
                  dataKey="providers"
                  stroke="#16A34A"
                  fill="#DCFCE7"
                  strokeWidth={2}
                  name="Providers"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ── Row 3: Top 5 Providers ── */}
        <div className="card mb-6">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
            Top 5 Providers
          </h2>
          {(data?.topProviders || []).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No provider data yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.topProviders.map((p, i) => (
                <div key={p.id} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div
                    className={`
                      text-2xl font-display font-bold mb-1
                      ${i === 0 ? "text-amber-500"
                        : i === 1 ? "text-gray-400"
                        : i === 2 ? "text-amber-700"
                        : "text-gray-600"}
                    `}
                  >
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{p.profession}</p>
                  <p className="text-xs text-amber-500">
                    {"★".repeat(Math.round(p.avgRating || 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {p.completedJobs} jobs
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════
            NEW SECTION: Booking Demand Heatmap
        ══════════════════════════════════════════════════════ */}

        {/* Quick insight cards above the heatmap */}
        <HeatmapInsights heatmapData={data?.bookingHeatmap} />

        {/* The heatmap itself */}
        <BookingHeatmap heatmapData={data?.bookingHeatmap} />

      </main>
    </div>
  );
};

export default AdminAnalytics;