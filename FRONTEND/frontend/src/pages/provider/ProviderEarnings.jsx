// // ============================================================
// // FILE: src/pages/provider/ProviderEarnings.jsx
// // ============================================================

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { getProviderEarnings } from "../../services/providerService";
// import DashboardNav from "../../components/DashboardNav";
// import { formatCurrency, formatDate } from "../../utils/helpers";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// const navLinks = [
//   { to: "/provider/dashboard", label: "Dashboard" },
//   { to: "/provider/jobs", label: "Jobs" },
//   { to: "/provider/slots", label: "My Slots" },
//   { to: "/provider/earnings", label: "Earnings" },
//   { to: "/provider/profile", label: "Profile" },
// ];

// const ProviderEarnings = () => {
//   const { user } = useAuth();
//   const [earnings, setEarnings] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user?.id) {
//       getProviderEarnings(user.id).then(r => setEarnings(r.data)).catch(() => {}).finally(() => setLoading(false));
//     }
//   }, [user]);

//   const summaryCards = [
//     { label: "Total Earnings", value: formatCurrency(earnings?.total || 0), icon: "💰" },
//     { label: "This Month", value: formatCurrency(earnings?.thisMonth || 0), icon: "📅" },
//     { label: "This Week", value: formatCurrency(earnings?.thisWeek || 0), icon: "📆" },
//     { label: "Today", value: formatCurrency(earnings?.today || 0), icon: "⏰" },
//   ];

//   const completionData = [
//     { name: "Completed", value: earnings?.completedJobs || 0 },
//     { name: "Cancelled", value: earnings?.cancelledJobs || 0 },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="PROVIDER" />
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">My Earnings</h1>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {summaryCards.map(c => (
//             <div key={c.label} className="card text-center">
//               <div className="text-3xl mb-2">{c.icon}</div>
//               <p className="text-xl font-display font-bold text-gray-900">{c.value}</p>
//               <p className="text-xs text-gray-500 mt-1">{c.label}</p>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <div className="lg:col-span-2 card">
//             <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Monthly Income</h2>
//             <ResponsiveContainer width="100%" height={260}>
//               <LineChart data={earnings?.monthly || []}>
//                 <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip formatter={v => formatCurrency(v)} />
//                 <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB" }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="card">
//             <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Job Completion</h2>
//             <ResponsiveContainer width="100%" height={260}>
//               <PieChart>
//                 <Pie data={completionData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value">
//                   <Cell fill="#16A34A" />
//                   <Cell fill="#DC2626" />
//                 </Pie>
//                 <Legend />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Earnings History Table */}
//         <div className="card">
//           <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Earnings History</h2>
//           {(earnings?.history || []).length === 0 ? (
//             <div className="text-center py-8 text-gray-400">No earnings history yet</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 border-b border-gray-100">
//                     <th className="pb-3 font-medium">Date</th>
//                     <th className="pb-3 font-medium">Customer</th>
//                     <th className="pb-3 font-medium">Service</th>
//                     <th className="pb-3 font-medium">Amount</th>
//                     <th className="pb-3 font-medium">Method</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {earnings.history.map((e, i) => (
//                     <tr key={i} className="hover:bg-gray-50">
//                       <td className="py-3 text-gray-600">{formatDate(e.earnedAt)}</td>
//                       <td className="py-3 text-gray-800">{e.customerName}</td>
//                       <td className="py-3 text-gray-600">{e.service}</td>
//                       <td className="py-3 font-semibold text-green-600">{formatCurrency(e.amount)}</td>
//                       <td className="py-3 text-gray-500">{e.paymentMethod}</td>
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

// export default ProviderEarnings;



// ============================================================
// FILE: src/pages/provider/ProviderEarnings.jsx  (FULL REPLACEMENT)
// ============================================================

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProviderEarnings } from "../../services/providerService";
import { getEarningsForecast } from "../../services/forecastService";
import DashboardNav from "../../components/DashboardNav";
import { formatCurrency, formatDate } from "../../utils/helpers";
import {
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const navLinks = [
  { to: "/provider/dashboard", label: "Dashboard"  },
  { to: "/provider/jobs",      label: "Jobs"        },
  { to: "/provider/slots",     label: "My Slots"    },
  { to: "/provider/earnings",  label: "Earnings"    },
  { to: "/provider/profile",   label: "Profile"     },
];

// ── Trend styles ──────────────────────────────────────────────
const TREND_STYLE = {
  UP:     { color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200",  icon: "📈", label: "Upward"  },
  DOWN:   { color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    icon: "📉", label: "Downward" },
  STABLE: { color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   icon: "➡️", label: "Stable"  },
};

// ── Custom tooltip for the combined chart ─────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── ForecastCard ──────────────────────────────────────────────
// Shows predicted amount, trend, confidence band, and insight text
const ForecastCard = ({ forecast, loading, error, nextMonthLabel }) => {
  if (loading) {
    return (
      <div className="card flex items-center gap-4 py-5">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent
                        rounded-full animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-700">
            Running forecast model…
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Linear regression on your earnings history
          </p>
        </div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="card border-l-4 border-gray-200 py-4">
        <p className="text-sm text-gray-500">
          {error || "Forecast unavailable — need at least 2 months of earnings data."}
        </p>
      </div>
    );
  }

  const style = TREND_STYLE[forecast.trend] || TREND_STYLE.STABLE;
  const pct   = forecast.trend_percentage;
  const pctDisplay = pct >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;

  return (
    <div className={`card border-l-4 ${style.border}`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{style.icon}</span>
            <h3 className="font-display font-bold text-gray-900">
              Earnings Forecast
            </h3>
            <span className="text-xs bg-purple-100 text-purple-700 font-medium
                             px-2 py-0.5 rounded-full">
              🤖 ML Model
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Predicted earnings for {nextMonthLabel} based on your last{" "}
            {forecast.months_used} months
          </p>
        </div>

        {/* Trend badge */}
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full
                          ${style.bg} ${style.color} border ${style.border}`}>
          {style.icon} {style.label} · {pctDisplay}
        </span>
      </div>

      {/* Predicted amount — large display */}
      <div className="flex items-end gap-3 mb-3 flex-wrap">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Predicted amount</p>
          <p className={`text-3xl font-display font-bold ${style.color}`}>
            {formatCurrency(forecast.predicted_amount)}
          </p>
        </div>
        <div className="mb-1">
          <p className="text-xs text-gray-500 mb-0.5">Confidence range</p>
          <p className="text-sm font-medium text-gray-700">
            {formatCurrency(forecast.min_estimate)}
            <span className="text-gray-400 mx-1">–</span>
            {formatCurrency(forecast.max_estimate)}
          </p>
        </div>
      </div>

      {/* Model quality bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Model fit (R²)</span>
          <span className="font-medium">
            {(forecast.r_squared * 100).toFixed(0)}%
            {forecast.r_squared >= 0.8
              ? " · High confidence"
              : forecast.r_squared >= 0.5
              ? " · Medium confidence"
              : " · Low confidence"}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700
              ${forecast.r_squared >= 0.8
                ? "bg-green-500"
                : forecast.r_squared >= 0.5
                ? "bg-amber-500"
                : "bg-red-400"}`}
            style={{ width: `${(forecast.r_squared * 100).toFixed(0)}%` }}
          />
        </div>
      </div>

      {/* Insight text */}
      <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed
                       ${style.bg} ${style.color}`}>
        {forecast.insight}
      </div>
    </div>
  );
};

// ── Main ProviderEarnings ─────────────────────────────────────
const ProviderEarnings = () => {
  const { user } = useAuth();

  const [earnings,         setEarnings]         = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [forecast,         setForecast]         = useState(null);
  const [forecastLoading,  setForecastLoading]  = useState(false);
  const [forecastError,    setForecastError]    = useState("");

  // ── Fetch earnings from Spring Boot ───────────────────────
  useEffect(() => {
    if (!user?.id) return;
    getProviderEarnings(user.id)
      .then(r => setEarnings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // ── Fetch forecast from Flask once monthly data is ready ──
  // Only fires when earnings.monthly has at least 3 months
  useEffect(() => {
    if (!earnings?.monthly || earnings.monthly.length < 2) return;

    setForecastLoading(true);
    setForecastError("");

    getEarningsForecast(user.id, earnings.monthly)
      .then(r => setForecast(r.data))
      .catch(err => {
        // Flask may be down — silently degrade, show error card
        const msg = err.response?.data?.error
          || "Forecast service unavailable. Make sure Flask is running.";
        setForecastError(msg);
      })
      .finally(() => setForecastLoading(false));
  }, [earnings?.monthly]);

  // ── Build chart data — combines actual + forecast ─────────
  // The dotted projection point is appended as the last item
  // Recharts renders it dotted using strokeDasharray on a separate Line
  const buildChartData = () => {
    if (!earnings?.monthly) return { actualData: [], combinedData: [] };

    const actualData = earnings.monthly.map(m => ({
      month:    m.month,
      actual:   m.amount,
      forecast: null,        // null = not rendered for actual months
      min:      null,
      max:      null,
    }));

    if (!forecast || forecast.predicted_amount == null) {
      return { actualData, combinedData: actualData };
    }

    // Next month label — increment from last actual month
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const lastMonthLabel = earnings.monthly[earnings.monthly.length - 1]?.month || "Jan";
    const lastIdx        = monthNames.indexOf(lastMonthLabel);
    const nextIdx        = lastIdx === -1 ? 0 : (lastIdx + 1) % 12;
    const nextLabel      = monthNames[nextIdx];

    // The bridge point: last actual month carries both actual and forecast
    // values so the dotted line visually starts from the last real point
    const bridgePoint = {
      month:    lastMonthLabel,
      actual:   earnings.monthly[earnings.monthly.length - 1].amount,
      forecast: earnings.monthly[earnings.monthly.length - 1].amount,
      min:      earnings.monthly[earnings.monthly.length - 1].amount,
      max:      earnings.monthly[earnings.monthly.length - 1].amount,
    };

    // The forecast point
    const forecastPoint = {
      month:    `${nextLabel} (est.)`,
      actual:   null,
      forecast: forecast.predicted_amount,
      min:      forecast.min_estimate,
      max:      forecast.max_estimate,
    };

    // Replace the last actual item with the bridge point, then add forecast
    const combinedData = [
      ...actualData.slice(0, -1),
      bridgePoint,
      forecastPoint,
    ];

    return { actualData, combinedData, nextLabel };
  };

  const { combinedData, nextLabel } = buildChartData();

  const completionData = [
    { name: "Completed", value: earnings?.completedJobs || 0 },
    { name: "Cancelled", value: earnings?.cancelledJobs  || 0 },
  ];

  const summaryCards = [
    { label: "Total Earnings",  value: formatCurrency(earnings?.total     || 0), icon: "💰" },
    { label: "This Month",      value: formatCurrency(earnings?.thisMonth  || 0), icon: "📅" },
    { label: "This Week",       value: formatCurrency(earnings?.thisWeek   || 0), icon: "📆" },
    { label: "Today",           value: formatCurrency(earnings?.today      || 0), icon: "⏰" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav links={navLinks} role="PROVIDER" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[0,1,2,3].map(i => (
                <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
              ))}
            </div>
            <div className="h-72 bg-gray-200 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="PROVIDER" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
          My Earnings
        </h1>

        {/* ── Summary cards (unchanged) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryCards.map(c => (
            <div key={c.label} className="card text-center">
              <div className="text-3xl mb-2">{c.icon}</div>
              <p className="text-xl font-display font-bold text-gray-900">
                {c.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* ── Forecast card ── */}
        <div className="mb-6">
          <ForecastCard
            forecast={forecast}
            loading={forecastLoading}
            error={forecastError}
            nextMonthLabel={nextLabel || "next month"}
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Monthly Income + Forecast projection */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <h2 className="text-lg font-display font-bold text-gray-900">
                Monthly Income
              </h2>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-blue-600 rounded" />
                  <span>Actual</span>
                </div>
                {forecast && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-0.5 rounded"
                           style={{
                             background: "repeating-linear-gradient(90deg,#8b5cf6 0,#8b5cf6 4px,transparent 4px,transparent 8px)"
                           }} />
                      <span>Forecast</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-0.5 rounded"
                           style={{
                             background: "repeating-linear-gradient(90deg,#c4b5fd 0,#c4b5fd 4px,transparent 4px,transparent 8px)"
                           }} />
                      <span>Range</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={combinedData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />

                {/* Vertical reference line between actual and forecast */}
                {forecast && combinedData.length > 0 && (
                  <ReferenceLine
                    x={combinedData[combinedData.length - 2]?.month}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    label={{
                      value: "Today",
                      position: "insideTopRight",
                      fontSize: 10,
                      fill: "#94a3b8",
                    }}
                  />
                )}

                {/* Actual earnings — solid blue line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ fill: "#2563EB", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#2563EB" }}
                  connectNulls={false}
                />

                {/* Forecast — purple dotted line */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={(props) => {
                    // Only show a dot on the forecast (est.) point
                    if (props.payload?.actual !== null) return null;
                    return (
                      <circle
                        key={props.index}
                        cx={props.cx}
                        cy={props.cy}
                        r={6}
                        fill="#8b5cf6"
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 7, fill: "#8b5cf6" }}
                  connectNulls={false}
                />

                {/* Min confidence band — light purple dotted */}
                <Line
                  type="monotone"
                  dataKey="min"
                  name="Min estimate"
                  stroke="#c4b5fd"
                  strokeWidth={1.5}
                  strokeDasharray="3 5"
                  dot={false}
                  connectNulls={false}
                />

                {/* Max confidence band — light purple dotted */}
                <Line
                  type="monotone"
                  dataKey="max"
                  name="Max estimate"
                  stroke="#c4b5fd"
                  strokeWidth={1.5}
                  strokeDasharray="3 5"
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Job Completion donut (unchanged) */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
              Job Completion
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                >
                  <Cell fill="#16A34A" />
                  <Cell fill="#DC2626" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Earnings History table (unchanged) ── */}
        <div className="card">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-5">
            Earnings History
          </h2>
          {(earnings?.history || []).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No earnings history yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {earnings.history.map((e, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-600">
                        {formatDate(e.earnedAt)}
                      </td>
                      <td className="py-3 text-gray-800">{e.customerName}</td>
                      <td className="py-3 text-gray-600">{e.service}</td>
                      <td className="py-3 font-semibold text-green-600">
                        {formatCurrency(e.amount)}
                      </td>
                      <td className="py-3 text-gray-500">{e.paymentMethod}</td>
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

export default ProviderEarnings;