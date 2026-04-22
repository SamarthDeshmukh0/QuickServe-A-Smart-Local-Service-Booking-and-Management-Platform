// ============================================================
// FILE: src/pages/admin/AdminProviders.jsx
// ============================================================


//trial for the badges
import React, { useEffect, useState } from "react";
import { getAllProviders, approveProvider, rejectProvider } from "../../services/adminService";
import { assignBadge, revokeBadge } from "../../services/badgeService";
import { getProviderBadges } from "../../services/badgeService";
import DashboardNav from "../../components/DashboardNav";
import BadgeList from "../../components/BadgeList";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { formatDate, getInitials } from "../../utils/helpers";

const navLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/providers", label: "Providers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/analytics", label: "Analytics" },
];

// All badge types admin can manually assign
const MANUAL_BADGES = [
  { type: "BACKGROUND_CHECKED",     label: "Background Checked",     icon: "✔" },
  { type: "CERTIFIED_PROFESSIONAL", label: "Certified Professional",  icon: "🎓" },
];

// Badge assignment modal — shown when admin clicks "Manage Badges"
const BadgeModal = ({ provider, onClose, onSaved }) => {
  const [badges, setBadges]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(null);

  // Load existing badges for this provider
  useEffect(() => {
    getProviderBadges(provider.id)
      .then(r => setBadges(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [provider.id]);

  const hasBadge = (type) => badges.some(b => b.badgeType === type);

  const handleToggle = async (type) => {
    setSaving(type);
    try {
      if (hasBadge(type)) {
        await revokeBadge(provider.id, type);
        setBadges(prev => prev.filter(b => b.badgeType !== type));
      } else {
        const res = await assignBadge(provider.id, type);
        setBadges(prev => [...prev, res.data]);
      }
      onSaved(); // refresh parent list
    } catch { }
    finally { setSaving(null); }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal card — stop clicks from closing */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900">
              Manage Badges
            </h2>
            <p className="text-sm text-gray-500">{provider.name} · {provider.profession}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Current badges */}
        {!loading && badges.length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
              Current Badges
            </p>
            <BadgeList badges={badges} size="md" />
          </div>
        )}

        {/* Manual badge toggles */}
        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
          Admin Assignable Badges
        </p>
        <div className="space-y-3 mb-5">
          {MANUAL_BADGES.map(b => (
            <div
              key={b.type}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{b.icon}</span>
                <span className="text-sm font-medium text-gray-800">{b.label}</span>
              </div>
              <button
                onClick={() => handleToggle(b.type)}
                disabled={saving === b.type}
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all disabled:opacity-50
                  ${hasBadge(b.type)
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {saving === b.type
                  ? "…"
                  : hasBadge(b.type) ? "Revoke" : "Assign"}
              </button>
            </div>
          ))}
        </div>

        {/* Auto-badges info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700 font-medium mb-1">Auto-assigned badges</p>
          <p className="text-xs text-amber-600">
            ⭐ Top Rated (rating ≥ 4.5) · 🏅 Veteran (5+ yrs) · 💯 Century (100+ jobs)
            are awarded automatically by the system and cannot be manually assigned.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Main AdminProviders component ──────────────────────────
const AdminProviders = () => {
  const [providers, setProviders]   = useState([]);
  const [tab, setTab]               = useState("PENDING");
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [badgeModal, setBadgeModal] = useState(null); // provider object | null

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllProviders();
      setProviders(res.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (fn, id) => {
    setActionLoading(id);
    try { await fn(id); await load(); }
    catch { }
    finally { setActionLoading(null); }
  };

  const filtered = providers.filter(p => p.status === tab);
  const counts = {
    PENDING:  providers.filter(p => p.status === "PENDING").length,
    APPROVED: providers.filter(p => p.status === "APPROVED").length,
    REJECTED: providers.filter(p => p.status === "REJECTED").length,
  };
  const tabs = [
    { key: "PENDING",  label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="ADMIN" />

      {/* Badge modal overlay */}
      {badgeModal && (
        <BadgeModal
          provider={badgeModal}
          onClose={() => setBadgeModal(null)}
          onSaved={load}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
          Provider Management
        </h1>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${tab === t.key ? "bg-white shadow text-blue-600" : "text-gray-600"}`}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            <TableSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState icon="📋" title={`No ${tab.toLowerCase()} providers`} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Profession</th>
                    <th className="pb-3 font-medium">City</th>
                    <th className="pb-3 font-medium">Experience</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Registered</th>
                    {/* Badges column shown for APPROVED providers */}
                    {tab === "APPROVED" && (
                      <th className="pb-3 font-medium">Badges</th>
                    )}
                    {/* Actions column for PENDING */}
                    {tab === "PENDING" && (
                      <th className="pb-3 font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">

                      {/* Provider name + avatar */}
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                              {getInitials(p.name)}
                            </div>
                            {/* Blue checkmark overlay if background checked */}
                            {p.badges?.some(b => b.badgeType === "BACKGROUND_CHECKED") && (
                              <span
                                title="Background Verified"
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs leading-none"
                              >
                                ✔
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-gray-600">{p.profession}</td>
                      <td className="py-3 text-gray-600">{p.city}</td>
                      <td className="py-3 text-gray-600">{p.yearsExperience} yrs</td>

                      {/* Rating with stars */}
                      <td className="py-3 text-amber-500">
                        {"★".repeat(Math.round(p.avgRating || 0))}
                        <span className="text-gray-400 text-xs ml-1">
                          ({(p.avgRating || 0).toFixed(1)})
                        </span>
                      </td>

                      <td className="py-3 text-gray-500">{formatDate(p.createdAt)}</td>

                      {/* Badges column (APPROVED tab only) */}
                      {tab === "APPROVED" && (
                        <td className="py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {p.badges && p.badges.length > 0 && (
                              <BadgeList badges={p.badges} size="sm" />
                            )}
                            <button
                              onClick={() => setBadgeModal(p)}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                            >
                              {p.badges && p.badges.length > 0
                                ? "Manage"
                                : "+ Add Badge"}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Approve / Reject buttons (PENDING tab only) */}
                      {tab === "PENDING" && (
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(approveProvider, p.id)}
                              disabled={actionLoading === p.id}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleAction(rejectProvider, p.id)}
                              disabled={actionLoading === p.id}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </td>
                      )}
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

export default AdminProviders;



//original file 
// import React, { useEffect, useState } from "react";
// import { getAllProviders, approveProvider, rejectProvider } from "../../services/adminService";
// import DashboardNav from "../../components/DashboardNav";
// import { TableSkeleton } from "../../components/LoadingSkeleton";
// import EmptyState from "../../components/EmptyState";
// import { formatDate, getInitials } from "../../utils/helpers";

// const navLinks = [
//   { to: "/admin/dashboard", label: "Dashboard" },
//   { to: "/admin/providers", label: "Providers" },
//   { to: "/admin/bookings", label: "Bookings" },
//   { to: "/admin/analytics", label: "Analytics" },
// ];

// const AdminProviders = () => {
//   const [providers, setProviders] = useState([]);
//   const [tab, setTab] = useState("PENDING");
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllProviders();
//       setProviders(res.data || []);
//     } catch { }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const handleAction = async (fn, id) => {
//     setActionLoading(id);
//     try { await fn(id); await load(); }
//     catch { }
//     finally { setActionLoading(null); }
//   };

//   const filtered = providers.filter(p => p.status === tab);
//   const counts = { PENDING: providers.filter(p => p.status === "PENDING").length, APPROVED: providers.filter(p => p.status === "APPROVED").length, REJECTED: providers.filter(p => p.status === "REJECTED").length };
//   const tabs = [{ key: "PENDING", label: "Pending" }, { key: "APPROVED", label: "Approved" }, { key: "REJECTED", label: "Rejected" }];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="ADMIN" />
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Provider Management</h1>

//         <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
//           {tabs.map(t => (
//             <button key={t.key} onClick={() => setTab(t.key)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === t.key ? "bg-white shadow text-blue-600" : "text-gray-600"}`}>
//               {t.label}
//               {counts[t.key] > 0 && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{counts[t.key]}</span>}
//             </button>
//           ))}
//         </div>

//         <div className="card">
//           {loading ? <TableSkeleton /> : filtered.length === 0 ? (
//             <EmptyState icon="📋" title={`No ${tab.toLowerCase()} providers`} />
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 border-b border-gray-100">
//                     <th className="pb-3 font-medium">Provider</th>
//                     <th className="pb-3 font-medium">Profession</th>
//                     <th className="pb-3 font-medium">City</th>
//                     <th className="pb-3 font-medium">Experience</th>
//                     <th className="pb-3 font-medium">Registered</th>
//                     {tab === "PENDING" && <th className="pb-3 font-medium">Actions</th>}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filtered.map(p => (
//                     <tr key={p.id} className="hover:bg-gray-50">
//                       <td className="py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">{getInitials(p.name)}</div>
//                           <div>
//                             <p className="font-medium text-gray-900">{p.name}</p>
//                             <p className="text-xs text-gray-400">{p.email}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 text-gray-600">{p.profession}</td>
//                       <td className="py-3 text-gray-600">{p.city}</td>
//                       <td className="py-3 text-gray-600">{p.yearsExperience} yrs</td>
//                       <td className="py-3 text-gray-500">{formatDate(p.createdAt)}</td>
//                       {tab === "PENDING" && (
//                         <td className="py-3 flex gap-2">
//                           <button onClick={() => handleAction(approveProvider, p.id)} disabled={actionLoading === p.id}
//                             className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50">
//                             ✓ Approve
//                           </button>
//                           <button onClick={() => handleAction(rejectProvider, p.id)} disabled={actionLoading === p.id}
//                             className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50">
//                             ✕ Reject
//                           </button>
//                         </td>
//                       )}
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

// export default AdminProviders;