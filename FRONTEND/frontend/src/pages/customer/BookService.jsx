// // ============================================================
// // FILE: src/pages/customer/BookService.jsx
// // ============================================================

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { getRecommendedProviders } from "../../services/providerService";
// import { getAvailableSlots } from "../../services/slotService";
// import { createBooking } from "../../services/bookingService";
// import DashboardNav from "../../components/DashboardNav";
// import { SERVICES, CITIES } from "../../utils/constants";
// import { formatCurrency } from "../../utils/helpers";

// import BadgeList from "../../components/BadgeList";
// const navLinks = [
//   { to: "/customer/dashboard", label: "Dashboard" },
//   { to: "/customer/book-service", label: "Book Service" },
//   { to: "/customer/booking-history", label: "Booking History" },
//   { to: "/customer/profile", label: "Profile" },
// ];

// const BookService = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [selectedService, setSelectedService] = useState(null);
//   const [providers, setProviders] = useState([]);
//   const [loadingProviders, setLoadingProviders] = useState(false);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [form, setForm] = useState({ date: "", timeSlot: "", address: "", problem: "" });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const handleServiceSelect = async (service) => {
//     setSelectedService(service);
//     setLoadingProviders(true);
//     try {
//       const res = await getRecommendedProviders(user.city || CITIES[0], service.name);
//       setProviders(res.data || []);
//     } catch { setProviders([]); }
//     finally { setLoadingProviders(false); }
//     setStep(2);
//   };

//   const handleProviderSelect = (provider) => {
//     setSelectedProvider(provider);
//     setStep(3);
//   };

//   useEffect(() => {
//     if (step === 3 && selectedProvider && form.date) {
//       getAvailableSlots(selectedProvider.id, form.date).then(res => setSlots(res.data || [])).catch(() => setSlots([]));
//     }
//   }, [form.date, step, selectedProvider]);

//   const handleSubmit = async () => {
//     if (!form.date || !form.timeSlot || !form.address || !form.problem) { setError("Please fill all fields."); return; }
//     setSubmitting(true); setError("");
//     try {
//       const amount = selectedService.amount;
//       await createBooking({
//         customerId: user.id,
//         providerId: selectedProvider.id,
//         service: selectedService.name,
//         date: form.date,
//         timeSlot: form.timeSlot,
//         address: form.address,
//         problem: form.problem,
//         amount,
//       });
//       navigate("/customer/booking-history", { state: { success: "Booking confirmed!" } });
//     } catch (e) {
//       setError(e.response?.data?.message || "Booking failed.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const StepIndicator = () => (
//     <div className="flex items-center gap-2 mb-8">
//       {[1, 2, 3].map((s, i) => (
//         <React.Fragment key={s}>
//           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>{s}</div>
//           {i < 2 && <div className={`flex-1 h-1 rounded transition-all ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
//         </React.Fragment>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="CUSTOMER" />
//       <main className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Book a Service</h1>
//         <p className="text-gray-500 mb-6">Complete 3 simple steps to schedule your service</p>
//         <StepIndicator />

//         {/* Step 1 */}
//         {step === 1 && (
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select a Service</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {SERVICES.map(service => (
//                 <button key={service.name} onClick={() => handleServiceSelect(service)}
//                   className="card text-left hover:border-2 hover:border-blue-500 transition-all cursor-pointer group">
//                   <div className="text-3xl mb-3">{service.icon}</div>
//                   <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{service.name}</h3>
//                   <p className="text-xs text-gray-500 mt-1 mb-3">{service.description}</p>
//                   <p className="text-blue-600 font-semibold text-sm">{formatCurrency(service.amount)}</p>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Step 2 */}
//         {step === 2 && (
//           <div>
//             <div className="flex items-center gap-3 mb-6">
//               <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">← Back</button>
//               <h2 className="text-lg font-semibold text-gray-800">Step 2: Choose a Provider</h2>
//             </div>
//             <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm text-blue-700">
//               🤖 Providers ranked by our AI scoring system — Rating (40%) + Experience (35%) + Proximity (25%)
//             </div>
//             {loadingProviders ? (
//               <div className="text-center py-12 text-gray-500">Loading providers…</div>
//             ) : providers.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">No providers available in your city for this service.</div>
//             ) : (
//               <div className="space-y-4">
//                 {providers.map((p, idx) => (
//                   <div key={p.id} className={`card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${idx === 0 ? "border-2 border-blue-500" : ""}`}>
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg">
//                         {(p.name || "P").charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-semibold text-gray-900">{p.name}</h3>
//                           {idx === 0 && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">🤖 AI Recommended</span>}
//                         </div>
//                         {/* for badge  */}
//                         {p.badges && p.badges.length > 0 && (
//                             <div className="mt-1 mb-2">
//                               <BadgeList badges={p.badges} size="sm" />
//                             </div>
//                           )}

//                         <p className="text-sm text-gray-500">{p.profession} • {p.city}</p>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-sm text-amber-500">{"★".repeat(Math.round(p.avgRating || 0))}{"☆".repeat(5 - Math.round(p.avgRating || 0))}</span>
//                           <span className="text-xs text-gray-500">{p.yearsExperience} yrs exp</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="text-center">
//                         <p className="text-xs text-gray-500">Score</p>
//                         <p className="text-lg font-display font-bold text-blue-600">{p.recommendationScore?.toFixed(1) || "—"}/5</p>
//                       </div>
//                       <button onClick={() => handleProviderSelect(p)} className="btn-primary whitespace-nowrap">Book Now</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Step 3 */}
//         {step === 3 && (
//           <div>
//             <div className="flex items-center gap-3 mb-6">
//               <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700">← Back</button>
//               <h2 className="text-lg font-semibold text-gray-800">Step 3: Booking Details</h2>
//             </div>

//             <div className="card mb-6 flex items-center gap-4">
//               <div className="text-3xl">{selectedService?.icon}</div>
//               <div>
//                 <p className="font-semibold text-gray-900">{selectedService?.name} with {selectedProvider?.name}</p>
//                 <p className="text-sm text-gray-500">{selectedProvider?.city} • {selectedProvider?.yearsExperience} yrs experience</p>
//               </div>
//             </div>

//             {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

//             <div className="card space-y-5">
//               <div>
//                 <label className="label">Service Date</label>
//                 <input type="date" className="input-field" value={form.date}
//                   min={new Date().toISOString().split("T")[0]}
//                   max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
//                   onChange={e => setForm({ ...form, date: e.target.value, timeSlot: "" })} />
//               </div>
//               <div>
//                 <label className="label">Available Time Slot</label>
//                 <select className="input-field" value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}>
//                   <option value="">Select a time slot</option>
//                   {slots.length === 0 && form.date ? <option disabled>No slots available for this date</option> : null}
//                   {slots.map(s => <option key={s.id} value={s.slotTime}>{s.slotTime}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="label">Your Address</label>
//                 <textarea className="input-field" rows={3} value={form.address}
//                   onChange={e => setForm({ ...form, address: e.target.value })}
//                   placeholder="Enter your complete address (min. 10 characters)" />
//               </div>
//               <div>
//                 <label className="label">Problem Description</label>
//                 <textarea className="input-field" rows={4} value={form.problem}
//                   onChange={e => setForm({ ...form, problem: e.target.value })}
//                   placeholder="Describe the issue in detail (min. 20 characters)" />
//               </div>
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-600">Service Charge</span>
//                   <span className="font-medium">{formatCurrency(selectedService?.amount || 0)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600">Platform Fee</span>
//                   <span className="font-medium">₹49</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
//                   <span>Total</span>
//                   <span className="text-blue-600">{formatCurrency((selectedService?.amount || 0) + 49)}</span>
//                 </div>
//               </div>
//               <button onClick={handleSubmit} disabled={submitting}
//                 className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50">
//                 {submitting ? "Confirming…" : "✅ Confirm Booking"}
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default BookService;



// ============================================================
// FILE: src/pages/customer/BookService.jsx  (FULL REPLACEMENT)
// All existing code preserved exactly. version1..
// Smart Price Estimator added inside Step 3 problem textarea.
// ============================================================

// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { getRecommendedProviders } from "../../services/providerService";
// import { getAvailableSlots } from "../../services/slotService";
// import { createBooking } from "../../services/bookingService";
// import { estimatePrice } from "../../services/estimateService";
// import DashboardNav from "../../components/DashboardNav";
// import { SERVICES, CITIES, PLATFORM_FEE } from "../../utils/constants";
// import { formatCurrency } from "../../utils/helpers";

// const navLinks = [
//   { to: "/customer/dashboard",       label: "Dashboard"       },
//   { to: "/customer/book-service",    label: "Book Service"    },
//   { to: "/customer/booking-history", label: "Booking History" },
//   { to: "/customer/profile",         label: "Profile"         },
// ];

// // ── Severity colour map → Tailwind classes ────────────────────
// // severity_color comes from Flask: "green" | "blue" | "orange" | "red"
// const SEVERITY_STYLES = {
//   green:  {
//     card:    "bg-green-50 border-green-200",
//     badge:   "bg-green-100 text-green-700",
//     bar:     "bg-green-500",
//     icon:    "🟢",
//     text:    "text-green-700",
//     subtext: "text-green-600",
//   },
//   blue:   {
//     card:    "bg-blue-50 border-blue-200",
//     badge:   "bg-blue-100 text-blue-700",
//     bar:     "bg-blue-500",
//     icon:    "🔵",
//     text:    "text-blue-700",
//     subtext: "text-blue-600",
//   },
//   orange: {
//     card:    "bg-amber-50 border-amber-200",
//     badge:   "bg-amber-100 text-amber-700",
//     bar:     "bg-amber-500",
//     icon:    "🟠",
//     text:    "text-amber-700",
//     subtext: "text-amber-600",
//   },
//   red:    {
//     card:    "bg-red-50 border-red-200",
//     badge:   "bg-red-100 text-red-700",
//     bar:     "bg-red-500",
//     icon:    "🔴",
//     text:    "text-red-700",
//     subtext: "text-red-600",
//   },
// };

// // ── Price Estimate Card component ─────────────────────────────
// // Shown below the problem textarea as the customer types
// const PriceEstimateCard = ({ estimate, loading, typed }) => {
//   // Don't show anything until the user has typed at least 10 characters
//   if (typed < 10) {
//     return (
//       <div className="flex items-center gap-2 mt-2 px-1">
//         <span className="text-xs text-gray-400">
//           💡 Keep typing to get a smart price estimate…
//         </span>
//       </div>
//     );
//   }

//   // Loading state — debounce is firing
//   if (loading) {
//     return (
//       <div className="mt-3 border border-gray-200 rounded-xl p-4 bg-gray-50">
//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <span className="text-sm text-gray-500">Analysing your problem…</span>
//         </div>
//       </div>
//     );
//   }

//   // No estimate yet (typing hasn't triggered yet)
//   if (!estimate) return null;

//   const style = SEVERITY_STYLES[estimate.severity_color] || SEVERITY_STYLES.blue;

//   return (
//     <div
//       className={`
//         mt-3 border rounded-xl p-4 transition-all duration-300
//         ${style.card}
//       `}
//     >
//       {/* ── Header row: severity badge + time estimate ── */}
//       <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
//         <div className="flex items-center gap-2">
//           <span className="text-base">{style.icon}</span>
//           <span
//             className={`
//               text-xs font-semibold px-2.5 py-1 rounded-full
//               ${style.badge}
//             `}
//           >
//             {estimate.severity} Issue
//           </span>
//           <span className="text-xs text-gray-500">
//             🕐 Est. time: {estimate.estimated_time}
//           </span>
//         </div>

//         {/* AI label */}
//         <span className="text-xs text-gray-400 italic">
//           🤖 AI Estimate
//         </span>
//       </div>

//       {/* ── Price range row ── */}
//       <div className="flex items-baseline gap-2 mb-1">
//         <span className="text-xs text-gray-500">Estimated cost:</span>
//         <span className={`text-xl font-display font-bold ${style.text}`}>
//           ₹{estimate.min_price.toLocaleString("en-IN")}
//           {" – "}
//           ₹{estimate.max_price.toLocaleString("en-IN")}
//         </span>
//       </div>

//       {/* ── Severity bar (visual multiplier indicator) ── */}
//       <div className="mb-3">
//         <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//           <div
//             className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
//             style={{
//               width: `${Math.min(100, estimate.multiplier * 50)}%`,
//             }}
//           />
//         </div>
//       </div>

//       {/* ── Reason text ── */}
//       <p className={`text-xs leading-relaxed ${style.subtext}`}>
//         {estimate.reason}
//       </p>

//       {/* ── Matched keywords pills ── */}
//       {estimate.matched_keywords && estimate.matched_keywords.length > 0 && (
//         <div className="flex flex-wrap gap-1.5 mt-2">
//           <span className="text-xs text-gray-400">Detected:</span>
//           {estimate.matched_keywords.slice(0, 4).map(kw => (
//             <span
//               key={kw}
//               className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
//             >
//               "{kw}"
//             </span>
//           ))}
//         </div>
//       )}

//       {/* ── Disclaimer ── */}
//       <p className="text-xs text-gray-400 mt-2 border-t border-gray-200 pt-2">
//         Final price is confirmed by the provider after assessment.
//         This estimate is for guidance only.
//       </p>
//     </div>
//   );
// };

// // ── Main BookService component ────────────────────────────────
// const BookService = () => {
//   const { user }    = useAuth();
//   const navigate    = useNavigate();

//   // ── Existing state (unchanged) ───────────────────────────
//   const [step,             setStep]             = useState(1);
//   const [selectedService,  setSelectedService]  = useState(null);
//   const [providers,        setProviders]        = useState([]);
//   const [loadingProviders, setLoadingProviders] = useState(false);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [slots,            setSlots]            = useState([]);
//   const [form,             setForm]             = useState({
//     date: "", timeSlot: "", address: "", problem: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error,      setError]      = useState("");

//   // ── NEW: Price estimator state ───────────────────────────
//   const [estimate,         setEstimate]         = useState(null);
//   const [estimateLoading,  setEstimateLoading]  = useState(false);
//   const [debounceTimer,    setDebounceTimer]    = useState(null);

//   // ── Existing: fetch providers on service select ───────────
//   const handleServiceSelect = async (service) => {
//     setSelectedService(service);
//     setLoadingProviders(true);
//     // Reset estimator when service changes
//     setEstimate(null);
//     try {
//       const res = await getRecommendedProviders(
//         user.city || CITIES[0],
//         service.name
//       );
//       setProviders(res.data || []);
//     } catch {
//       setProviders([]);
//     } finally {
//       setLoadingProviders(false);
//     }
//     setStep(2);
//   };

//   // ── Existing: provider selected → go to step 3 ───────────
//   const handleProviderSelect = (provider) => {
//     setSelectedProvider(provider);
//     setStep(3);
//   };

//   // ── Existing: fetch slots when date changes in step 3 ─────
//   useEffect(() => {
//     if (step === 3 && selectedProvider && form.date) {
//       getAvailableSlots(selectedProvider.id, form.date)
//         .then(res => setSlots(res.data || []))
//         .catch(() => setSlots([]));
//     }
//   }, [form.date, step, selectedProvider]);

//   // ── NEW: debounced price estimator ────────────────────────
//   // Fires 800ms after the user stops typing in the problem field.
//   // Only calls Flask if description >= 10 characters.
//   const handleProblemChange = useCallback((value) => {
//     // Always update form state immediately
//     setForm(prev => ({ ...prev, problem: value }));

//     // Clear the previous debounce timer
//     if (debounceTimer) clearTimeout(debounceTimer);

//     // Don't call API for very short text
//     if (value.trim().length < 10) {
//       setEstimate(null);
//       setEstimateLoading(false);
//       return;
//     }

//     // Show loading dots immediately so UI feels responsive
//     setEstimateLoading(true);

//     // Schedule the actual API call 800ms later
//     const timer = setTimeout(async () => {
//       try {
//         const res = await estimatePrice(selectedService.name, value);
//         setEstimate(res.data);
//       } catch {
//         // Flask down or error — silently fail, don't break the form
//         setEstimate(null);
//       } finally {
//         setEstimateLoading(false);
//       }
//     }, 800);

//     setDebounceTimer(timer);
//   }, [debounceTimer, selectedService]);

//   // ── Cleanup debounce timer on unmount ─────────────────────
//   useEffect(() => {
//     return () => {
//       if (debounceTimer) clearTimeout(debounceTimer);
//     };
//   }, [debounceTimer]);

//   // ── Existing: submit booking ──────────────────────────────
//   const handleSubmit = async () => {
//     if (!form.date || !form.timeSlot || !form.address || !form.problem) {
//       setError("Please fill all fields.");
//       return;
//     }
//     setSubmitting(true);
//     setError("");
//     try {
//       await createBooking({
//         customerId: user.id,
//         providerId: selectedProvider.id,
//         service:    selectedService.name,
//         date:       form.date,
//         timeSlot:   form.timeSlot,
//         address:    form.address,
//         problem:    form.problem,
//         amount:     selectedService.amount,
//       });
//       navigate("/customer/booking-history", {
//         state: { success: "Booking confirmed!" },
//       });
//     } catch (e) {
//       setError(e.response?.data?.message || "Booking failed.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── Step indicator (unchanged) ────────────────────────────
//   const StepIndicator = () => (
//     <div className="flex items-center gap-2 mb-8">
//       {[1, 2, 3].map((s, i) => (
//         <React.Fragment key={s}>
//           <div
//             className={`
//               w-9 h-9 rounded-full flex items-center justify-center
//               text-sm font-bold transition-all
//               ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}
//             `}
//           >
//             {s}
//           </div>
//           {i < 2 && (
//             <div
//               className={`
//                 flex-1 h-1 rounded transition-all
//                 ${step > s ? "bg-blue-600" : "bg-gray-200"}
//               `}
//             />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );

//   // ── Render ────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="CUSTOMER" />

//       <main className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
//           Book a Service
//         </h1>
//         <p className="text-gray-500 mb-6">
//           Complete 3 simple steps to schedule your service
//         </p>

//         <StepIndicator />

//         {/* ══════════════════════════════════════════════════
//             STEP 1 — Select Service  (unchanged)
//         ══════════════════════════════════════════════════ */}
//         {step === 1 && (
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Step 1: Select a Service
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {SERVICES.map(service => (
//                 <button
//                   key={service.name}
//                   onClick={() => handleServiceSelect(service)}
//                   className="card text-left hover:border-2 hover:border-blue-500
//                              transition-all cursor-pointer group"
//                 >
//                   <div className="text-3xl mb-3">{service.icon}</div>
//                   <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
//                     {service.name}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1 mb-3">
//                     {service.description}
//                   </p>
//                   <p className="text-blue-600 font-semibold text-sm">
//                     {formatCurrency(service.amount)}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════
//             STEP 2 — Choose Provider  (unchanged)
//         ══════════════════════════════════════════════════ */}
//         {step === 2 && (
//           <div>
//             <div className="flex items-center gap-3 mb-6">
//               <button
//                 onClick={() => setStep(1)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ← Back
//               </button>
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Step 2: Choose a Provider
//               </h2>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm text-blue-700">
//               🤖 Providers ranked by our AI scoring system — Rating (40%) + Experience (35%) + Proximity (25%)
//             </div>

//             {loadingProviders ? (
//               <div className="text-center py-12 text-gray-500">
//                 Loading providers…
//               </div>
//             ) : providers.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 No providers available in your city for this service.
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {providers.map((p, idx) => (
//                   <div
//                     key={p.id}
//                     className={`
//                       card flex flex-col sm:flex-row items-start sm:items-center
//                       justify-between gap-4
//                       ${idx === 0 ? "border-2 border-blue-500" : ""}
//                     `}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center
//                                       justify-center font-bold text-blue-700 text-lg">
//                         {(p.name || "P").charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-semibold text-gray-900">{p.name}</h3>
//                           {idx === 0 && (
//                             <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
//                               🤖 AI Recommended
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-500">
//                           {p.profession} • {p.city}
//                         </p>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-sm text-amber-500">
//                             {"★".repeat(Math.round(p.avgRating || 0))}
//                             {"☆".repeat(5 - Math.round(p.avgRating || 0))}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {p.yearsExperience} yrs exp
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="text-center">
//                         <p className="text-xs text-gray-500">Score</p>
//                         <p className="text-lg font-display font-bold text-blue-600">
//                           {p.recommendationScore?.toFixed(1) || "—"}/5
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleProviderSelect(p)}
//                         className="btn-primary whitespace-nowrap"
//                       >
//                         Book Now
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════
//             STEP 3 — Booking Details  (with Price Estimator)
//         ══════════════════════════════════════════════════ */}
//         {step === 3 && (
//           <div>
//             <div className="flex items-center gap-3 mb-6">
//               <button
//                 onClick={() => setStep(2)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ← Back
//               </button>
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Step 3: Booking Details
//               </h2>
//             </div>

//             {/* Selected service + provider summary card (unchanged) */}
//             <div className="card mb-6 flex items-center gap-4">
//               <div className="text-3xl">{selectedService?.icon}</div>
//               <div>
//                 <p className="font-semibold text-gray-900">
//                   {selectedService?.name} with {selectedProvider?.name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {selectedProvider?.city} • {selectedProvider?.yearsExperience} yrs experience
//                 </p>
//               </div>
//             </div>

//             {/* Error banner (unchanged) */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="card space-y-5">

//               {/* ── Date picker (unchanged) ── */}
//               <div>
//                 <label className="label">Service Date</label>
//                 <input
//                   type="date"
//                   className="input-field"
//                   value={form.date}
//                   min={new Date().toISOString().split("T")[0]}
//                   max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//                     .toISOString().split("T")[0]}
//                   onChange={e =>
//                     setForm({ ...form, date: e.target.value, timeSlot: "" })
//                   }
//                 />
//               </div>

//               {/* ── Time slot picker (unchanged) ── */}
//               <div>
//                 <label className="label">Available Time Slot</label>
//                 <select
//                   className="input-field"
//                   value={form.timeSlot}
//                   onChange={e => setForm({ ...form, timeSlot: e.target.value })}
//                 >
//                   <option value="">Select a time slot</option>
//                   {slots.length === 0 && form.date
//                     ? <option disabled>No slots available for this date</option>
//                     : null}
//                   {slots.map(s => (
//                     <option key={s.id} value={s.slotTime}>{s.slotTime}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* ── Address textarea (unchanged) ── */}
//               <div>
//                 <label className="label">Your Address</label>
//                 <textarea
//                   className="input-field"
//                   rows={3}
//                   value={form.address}
//                   onChange={e => setForm({ ...form, address: e.target.value })}
//                   placeholder="Enter your complete address (min. 10 characters)"
//                 />
//               </div>

//               {/* ══════════════════════════════════════════════
//                   NEW — Problem Description + Price Estimator
//               ══════════════════════════════════════════════ */}
//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <label className="label" style={{ marginBottom: 0 }}>
//                     Problem Description
//                   </label>
//                   <span className="text-xs text-gray-400">
//                     {form.problem.length} chars
//                     {form.problem.length >= 10
//                       ? " · AI estimating…"
//                       : " · type 10+ for AI estimate"}
//                   </span>
//                 </div>

//                 <textarea
//                   className="input-field"
//                   rows={4}
//                   value={form.problem}
//                   onChange={e => handleProblemChange(e.target.value)}
//                   placeholder="Describe the issue in detail — e.g. 'Pipe burst in kitchen, water flooding everywhere'. The more you describe, the more accurate the price estimate."
//                 />

//                 {/* Price estimator card appears here, below textarea */}
//                 <PriceEstimateCard
//                   estimate={estimate}
//                   loading={estimateLoading}
//                   typed={form.problem.length}
//                 />
//               </div>
//               {/* ══════════════════════════════════════════════ */}

//               {/* ── Pricing summary (updated to show estimate) ── */}
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-600">Service Charge</span>
//                   <div className="text-right">
//                     <span className="font-medium">
//                       {formatCurrency(selectedService?.amount || 0)}
//                     </span>
//                     {/* Show AI estimate range if available */}
//                     {estimate && (
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         AI estimate: ₹{estimate.min_price.toLocaleString("en-IN")}
//                         {" – "}
//                         ₹{estimate.max_price.toLocaleString("en-IN")}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600">Platform Fee</span>
//                   <span className="font-medium">₹{PLATFORM_FEE}</span>
//                 </div>

//                 <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
//                   <span>Total</span>
//                   <span className="text-blue-600">
//                     {formatCurrency((selectedService?.amount || 0) + PLATFORM_FEE)}
//                   </span>
//                 </div>
//               </div>

//               {/* ── Submit button (unchanged) ── */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50"
//               >
//                 {submitting ? "Confirming…" : "✅ Confirm Booking"}
//               </button>

//             </div>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// };

// export default BookService;



// ============================================================
// FILE: src/pages/customer/BookService.jsx  (FULL REPLACEMENT)
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRecommendedProviders } from "../../services/providerService";
import { getAvailableSlots } from "../../services/slotService";
import { createBooking } from "../../services/bookingService";
import { estimatePrice } from "../../services/estimateService";
import DashboardNav from "../../components/DashboardNav";
import { SERVICES, CITIES } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";

const PLATFORM_FEE = 49;

const navLinks = [
  { to: "/customer/dashboard",       label: "Dashboard"       },
  { to: "/customer/book-service",    label: "Book Service"    },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile",         label: "Profile"         },
];

// ── Severity → Tailwind style map ────────────────────────────
// severity_color comes from Flask: "green" | "blue" | "orange" | "red"
const SEVERITY_STYLE = {
  green:  {
    wrapper: "bg-green-50 border-green-200",
    badge:   "bg-green-100 text-green-800",
    bar:     "bg-green-500",
    price:   "text-green-700",
    sub:     "text-green-600",
    dot:     "bg-green-500",
  },
  blue:   {
    wrapper: "bg-blue-50 border-blue-200",
    badge:   "bg-blue-100 text-blue-800",
    bar:     "bg-blue-500",
    price:   "text-blue-700",
    sub:     "text-blue-600",
    dot:     "bg-blue-500",
  },
  orange: {
    wrapper: "bg-amber-50 border-amber-200",
    badge:   "bg-amber-100 text-amber-800",
    bar:     "bg-amber-500",
    price:   "text-amber-700",
    sub:     "text-amber-600",
    dot:     "bg-amber-500",
  },
  red:    {
    wrapper: "bg-red-50 border-red-200",
    badge:   "bg-red-100 text-red-800",
    bar:     "bg-red-500",
    price:   "text-red-700",
    sub:     "text-red-600",
    dot:     "bg-red-500",
  },
};

// Severity level → percentage for the intensity bar (visual only)
const SEVERITY_BAR_PCT = { Minor: 25, Standard: 50, Major: 75, Emergency: 100 };

// ── PriceEstimateCard ─────────────────────────────────────────
// Shown below the Problem Description textarea as the user types.
// Props:
//   estimate      object | null   response from Flask /estimate
//   estimating    bool            debounce timer is running
//   charCount     number          current length of problem text
const PriceEstimateCard = ({ estimate, estimating, charCount }) => {

  // Nothing at all until 10 characters typed
  if (charCount < 10) {
    return (
      <p className="text-xs text-gray-400 mt-2 pl-1">
        💡 Type at least 10 characters to get a live AI price estimate
      </p>
    );
  }

  // Debounce spinner — user just stopped typing, waiting 800 ms
  if (estimating) {
    return (
      <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-200
                      rounded-xl px-4 py-3">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent
                        rounded-full animate-spin flex-shrink-0" />
        <span className="text-sm text-gray-500">Analysing your problem description…</span>
      </div>
    );
  }

  // Flask hasn't responded yet on first render
  if (!estimate) return null;

  const s = SEVERITY_STYLE[estimate.severity_color] || SEVERITY_STYLE.blue;
  const barPct = SEVERITY_BAR_PCT[estimate.severity] || 50;

  return (
    <div className={`mt-3 border rounded-2xl p-4 transition-all duration-300 ${s.wrapper}`}>

      {/* ── Row 1: severity badge + time estimate + AI label ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Animated pulsing dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full
                              rounded-full opacity-60 ${s.dot}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${s.dot}`} />
          </span>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
            {estimate.severity} Issue
          </span>

          <span className="text-xs text-gray-500 flex items-center gap-1">
            🕐 {estimate.estimated_time}
          </span>
        </div>

        <span className="text-xs text-gray-400 italic">🤖 AI Estimate</span>
      </div>

      {/* ── Row 2: price range ── */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-0.5">Estimated cost range</p>
        <p className={`text-2xl font-display font-bold ${s.price}`}>
          ₹{estimate.min_price.toLocaleString("en-IN")}
          <span className="text-lg font-medium mx-1">–</span>
          ₹{estimate.max_price.toLocaleString("en-IN")}
        </p>
      </div>

      {/* ── Severity intensity bar ── */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Complexity</span>
          <span>{estimate.severity}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${s.bar}`}
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>

      {/* ── Reason text ── */}
      <p className={`text-xs leading-relaxed mb-2 ${s.sub}`}>
        {estimate.reason}
      </p>

      {/* ── Matched keywords pills ── */}
      {estimate.matched_keywords && estimate.matched_keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-xs text-gray-400">Detected words:</span>
          {estimate.matched_keywords.map(kw => (
            <span
              key={kw}
              className="text-xs bg-white border border-gray-200 text-gray-600
                         px-2 py-0.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="border-t border-gray-200 pt-2">
        <p className="text-xs text-gray-400">
          ⓘ Final price confirmed by provider after on-site assessment.
          This AI estimate is for guidance only and does not affect your booking amount.
        </p>
      </div>
    </div>
  );
};

// ── Main BookService component ────────────────────────────────
const BookService = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  // ─── Existing state ────────────────────────────────────────
  const [step,             setStep]             = useState(1);
  const [selectedService,  setSelectedService]  = useState(null);
  const [providers,        setProviders]        = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [slots,            setSlots]            = useState([]);
  const [form,             setForm]             = useState({
    date: "", timeSlot: "", address: "", problem: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  // ─── Price estimator state ─────────────────────────────────
  const [estimate,    setEstimate]    = useState(null);
  const [estimating,  setEstimating]  = useState(false);
  // useRef for debounce timer so it never triggers re-renders
  const debounceRef = useRef(null);

  // ─── Existing: service selected → fetch providers ──────────
  const handleServiceSelect = async (service) => {
    setSelectedService(service);
    setLoadingProviders(true);
    // Reset estimator whenever service changes
    setEstimate(null);
    setEstimating(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    try {
      const res = await getRecommendedProviders(
        user.city || CITIES[0],
        service.name
      );
      setProviders(res.data || []);
    } catch {
      setProviders([]);
    } finally {
      setLoadingProviders(false);
    }
    setStep(2);
  };

  // ─── Existing: provider selected → go to step 3 ───────────
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setStep(3);
  };

  // ─── Existing: fetch slots when date changes ───────────────
  useEffect(() => {
    if (step === 3 && selectedProvider && form.date) {
      getAvailableSlots(selectedProvider.id, form.date)
        .then(res => setSlots(res.data || []))
        .catch(() => setSlots([]));
    }
  }, [form.date, step, selectedProvider]);

  // ─── Cleanup debounce on unmount ───────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ─── Problem textarea change handler with debounce ─────────
  // Updates form state immediately (so textarea feels instant).
  // Fires Flask API call 800 ms after user stops typing.
  // Silently fails if Flask is down — booking form still works.
  const handleProblemChange = (value) => {
    // 1. Update form state instantly — textarea must feel responsive
    setForm(prev => ({ ...prev, problem: value }));

    // 2. Clear any previously scheduled API call
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // 3. Not enough text to analyse — clear estimate and stop
    if (value.trim().length < 10) {
      setEstimate(null);
      setEstimating(false);
      return;
    }

    // 4. Show loading indicator immediately so UI feels reactive
    setEstimating(true);

    // 5. Schedule the actual Flask call 800 ms later
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await estimatePrice(selectedService.name, value);
        setEstimate(res.data);
      } catch {
        // Flask unavailable — fail silently, don't break the form
        setEstimate(null);
      } finally {
        setEstimating(false);
      }
    }, 800);
  };

  // ─── Existing: submit booking ──────────────────────────────
  const handleSubmit = async () => {
    if (!form.date || !form.timeSlot || !form.address || !form.problem) {
      setError("Please fill all fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createBooking({
        customerId: user.id,
        providerId: selectedProvider.id,
        service:    selectedService.name,
        date:       form.date,
        timeSlot:   form.timeSlot,
        address:    form.address,
        problem:    form.problem,
        amount:     selectedService.amount,  // always use fixed base amount
      });
      navigate("/customer/booking-history", {
        state: { success: "Booking confirmed!" },
      });
    } catch (e) {
      setError(e.response?.data?.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step indicator (unchanged) ────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center
                        text-sm font-bold transition-all
                        ${step >= s
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"}`}
          >
            {s}
          </div>
          {i < 2 && (
            <div
              className={`flex-1 h-1 rounded transition-all
                          ${step > s ? "bg-blue-600" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Book a Service
        </h1>
        <p className="text-gray-500 mb-6">
          Complete 3 simple steps to schedule your service
        </p>

        <StepIndicator />

        {/* ════════════════════════════════════════════════════
            STEP 1 — Select Service  (completely unchanged)
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Step 1: Select a Service
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map(service => (
                <button
                  key={service.name}
                  onClick={() => handleServiceSelect(service)}
                  className="card text-left hover:border-2 hover:border-blue-500
                             transition-all cursor-pointer group"
                >
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-3">
                    {service.description}
                  </p>
                  <p className="text-blue-600 font-semibold text-sm">
                    {formatCurrency(service.amount)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2 — Choose Provider  (completely unchanged)
        ════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                Step 2: Choose a Provider
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl
                            px-4 py-3 mb-6 text-sm text-blue-700">
              🤖 Providers ranked by our AI scoring system — Rating (40%) + Experience (35%) + Proximity (25%)
            </div>

            {loadingProviders ? (
              <div className="text-center py-12 text-gray-500">
                Loading providers…
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No providers available in your city for this service.
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`card flex flex-col sm:flex-row items-start
                                sm:items-center justify-between gap-4
                                ${idx === 0 ? "border-2 border-blue-500" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex
                                      items-center justify-center font-bold
                                      text-blue-700 text-lg">
                        {(p.name || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{p.name}</h3>
                          {idx === 0 && (
                            <span className="bg-blue-600 text-white text-xs
                                             px-2 py-0.5 rounded-full">
                              🤖 AI Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {p.profession} • {p.city}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-amber-500">
                            {"★".repeat(Math.round(p.avgRating || 0))}
                            {"☆".repeat(5 - Math.round(p.avgRating || 0))}
                          </span>
                          <span className="text-xs text-gray-500">
                            {p.yearsExperience} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Score</p>
                        <p className="text-lg font-display font-bold text-blue-600">
                          {p.recommendationScore?.toFixed(1) || "—"}/5
                        </p>
                      </div>
                      <button
                        onClick={() => handleProviderSelect(p)}
                        className="btn-primary whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 3 — Booking Details
            All fields unchanged. Price Estimator added after
            the Problem Description textarea only.
        ════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                Step 3: Booking Details
              </h2>
            </div>

            {/* Selected service + provider summary (unchanged) */}
            <div className="card mb-6 flex items-center gap-4">
              <div className="text-3xl">{selectedService?.icon}</div>
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedService?.name} with {selectedProvider?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedProvider?.city} • {selectedProvider?.yearsExperience} yrs experience
                </p>
              </div>
            </div>

            {/* Error banner (unchanged) */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700
                              rounded-xl px-4 py-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="card space-y-5">

              {/* Date (unchanged) */}
              <div>
                <label className="label">Service Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString().split("T")[0]}
                  onChange={e =>
                    setForm({ ...form, date: e.target.value, timeSlot: "" })
                  }
                />
              </div>

              {/* Time slot (unchanged) */}
              <div>
                <label className="label">Available Time Slot</label>
                <select
                  className="input-field"
                  value={form.timeSlot}
                  onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                >
                  <option value="">Select a time slot</option>
                  {slots.length === 0 && form.date && (
                    <option disabled>No slots available for this date</option>
                  )}
                  {slots.map(s => (
                    <option key={s.id} value={s.slotTime}>{s.slotTime}</option>
                  ))}
                </select>
              </div>

              {/* Address (unchanged) */}
              <div>
                <label className="label">Your Address</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your complete address (min. 10 characters)"
                />
              </div>

              {/* ── Problem Description + Price Estimator (NEW) ── */}
              <div>
                {/* Label row with live character counter */}
                <div className="flex items-center justify-between mb-1">
                  <label className="label" style={{ marginBottom: 0 }}>
                    Problem Description
                  </label>
                  <span
                    className={`text-xs transition-colors ${
                      form.problem.length >= 10
                        ? "text-blue-500 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {form.problem.length} chars
                    {form.problem.length < 10 && " · type 10+ to unlock AI estimate"}
                    {form.problem.length >= 10 && " · AI estimating live"}
                  </span>
                </div>

                {/* The textarea — onChange now uses handleProblemChange */}
                <textarea
                  className="input-field"
                  rows={4}
                  value={form.problem}
                  onChange={e => handleProblemChange(e.target.value)}
                  placeholder="Describe the issue in detail — e.g. 'Pipe burst under kitchen sink, water flooding'. More detail = more accurate AI estimate."
                />

                {/* Live price estimate card renders here */}
                <PriceEstimateCard
                  estimate={estimate}
                  estimating={estimating}
                  charCount={form.problem.length}
                />
              </div>
              {/* ── End of Price Estimator block ── */}

              {/* Pricing summary — shows AI range if available */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Service Charge</span>
                  <div className="text-right">
                    <span className="font-medium">
                      {formatCurrency(selectedService?.amount || 0)}
                    </span>
                    {/* AI range hint shown alongside the fixed price */}
                    {estimate && !estimating && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        AI estimate: ₹{estimate.min_price.toLocaleString("en-IN")}
                        {" – "}
                        ₹{estimate.max_price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">₹{PLATFORM_FEE}</span>
                </div>
                <div className="flex justify-between font-bold text-base
                                border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatCurrency((selectedService?.amount || 0) + PLATFORM_FEE)}
                  </span>
                </div>
              </div>

              {/* Submit button (unchanged) */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full btn-primary py-3 text-base font-semibold
                           disabled:opacity-50"
              >
                {submitting ? "Confirming…" : "✅ Confirm Booking"}
              </button>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default BookService;