// // ============================================================
// // FILE: src/pages/customer/PaymentPage.jsx
// // ============================================================

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getBookingById } from "../../services/bookingService";
// import { makePayment } from "../../services/paymentService";
// import DashboardNav from "../../components/DashboardNav";
// import { formatCurrency, formatDate } from "../../utils/helpers";
// import { PLATFORM_FEE } from "../../utils/constants";

// const navLinks = [
//   { to: "/customer/dashboard", label: "Dashboard" },
//   { to: "/customer/book-service", label: "Book Service" },
//   { to: "/customer/booking-history", label: "Booking History" },
//   { to: "/customer/profile", label: "Profile" },
// ];

// const PaymentPage = () => {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [method, setMethod] = useState("UPI");
//   const [upi, setUpi] = useState("");
//   const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     getBookingById(bookingId).then(r => setBooking(r.data)).catch(() => {});
//   }, [bookingId]);

//   const handlePay = async () => {
//     setProcessing(true);
//     await new Promise(r => setTimeout(r, 2000));
//     try {
//       await makePayment({ bookingId, amount: (booking?.amount || 0) + PLATFORM_FEE, method });
//       setSuccess(true);
//       setTimeout(() => navigate(`/customer/rate/${bookingId}`), 2500);
//     } catch { setProcessing(false); }
//   };

//   if (success) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="card text-center max-w-md">
//         <div className="text-6xl mb-4">🎉</div>
//         <h2 className="text-2xl font-display font-bold text-green-600 mb-2">Payment Successful!</h2>
//         <p className="text-gray-500">Redirecting to rate your provider…</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="CUSTOMER" />
//       <main className="max-w-2xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Complete Payment</h1>

//         {/* Booking Summary */}
//         {booking && (
//           <div className="card mb-6">
//             <h2 className="font-semibold text-gray-900 mb-4">Booking Summary</h2>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{booking.service}</span></div>
//               <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="font-medium">{booking.providerName}</span></div>
//               <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{formatDate(booking.date)}</span></div>
//               <div className="flex justify-between"><span className="text-gray-500">Time Slot</span><span>{booking.timeSlot}</span></div>
//               <hr className="my-3" />
//               <div className="flex justify-between"><span className="text-gray-500">Service Charge</span><span>{formatCurrency(booking.amount)}</span></div>
//               <div className="flex justify-between"><span className="text-gray-500">Platform Fee</span><span>{formatCurrency(PLATFORM_FEE)}</span></div>
//               <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
//                 <span>Total</span><span className="text-blue-600">{formatCurrency((booking.amount || 0) + PLATFORM_FEE)}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Payment Methods */}
//         <div className="card mb-6">
//           <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
//           <div className="flex gap-3 mb-6 flex-wrap">
//             {["UPI", "Debit Card", "Credit Card", "Cash"].map(m => (
//               <button key={m} onClick={() => setMethod(m)}
//                 className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${method === m ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-700 hover:border-blue-400"}`}>
//                 {m}
//               </button>
//             ))}
//           </div>

//           {method === "UPI" && (
//             <div>
//               <label className="label">UPI ID</label>
//               <input className="input-field" placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} />
//             </div>
//           )}
//           {(method === "Debit Card" || method === "Credit Card") && (
//             <div className="space-y-3">
//               <div>
//                 <label className="label">Card Number</label>
//                 <input className="input-field" placeholder="1234 5678 9012 3456" maxLength={16} value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="label">Expiry (MM/YY)</label>
//                   <input className="input-field" placeholder="12/27" value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
//                 </div>
//                 <div>
//                   <label className="label">CVV</label>
//                   <input className="input-field" placeholder="123" maxLength={3} type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
//                 </div>
//               </div>
//             </div>
//           )}
//           {method === "Cash" && (
//             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
//               💵 Pay ₹{((booking?.amount || 0) + PLATFORM_FEE).toLocaleString("en-IN")} in cash directly to the service provider.
//             </div>
//           )}
//         </div>

//         <button onClick={handlePay} disabled={processing}
//           className="w-full btn-primary py-4 text-base font-semibold disabled:opacity-50">
//           {processing ? "Processing Payment…" : `Pay ${booking ? formatCurrency((booking.amount || 0) + PLATFORM_FEE) : "—"}`}
//         </button>
//       </main>
//     </div>
//   );
// };

// export default PaymentPage;


// ============================================================
// FILE: src/pages/customer/PaymentPage.jsx  (FULL REPLACEMENT)
// Shows provider's receipt before payment
// Payment amount now uses booking.finalAmount + platform fee
// ============================================================

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getBookingById } from "../../services/bookingService";
// import { makePayment } from "../../services/paymentService";
// import DashboardNav from "../../components/DashboardNav";
// import { formatCurrency, formatDate } from "../../utils/helpers";

// const PLATFORM_FEE = 50;

// const navLinks = [
//   { to: "/customer/dashboard",       label: "Dashboard"       },
//   { to: "/customer/book-service",    label: "Book Service"    },
//   { to: "/customer/booking-history", label: "Booking History" },
//   { to: "/customer/profile",         label: "Profile"         },
// ];

// const PaymentPage = () => {
//   const { bookingId } = useParams();
//   const navigate      = useNavigate();

//   const [booking,    setBooking]    = useState(null);
//   const [method,     setMethod]     = useState("UPI");
//   const [upi,        setUpi]        = useState("");
//   const [card,       setCard]       = useState({ number: "", expiry: "", cvv: "" });
//   const [processing, setProcessing] = useState(false);
//   const [success,    setSuccess]    = useState(false);

//   useEffect(() => {
//     getBookingById(bookingId)
//       .then(r => setBooking(r.data))
//       .catch(() => {});
//   }, [bookingId]);

//   // Use provider's final amount if set, otherwise fall back to base amount
//   const serviceCharge = booking?.finalAmount ?? booking?.amount ?? 0;
//   const totalAmount   = serviceCharge + PLATFORM_FEE;

//   const handlePay = async () => {
//     setProcessing(true);
//     // 2-second simulated processing animation
//     await new Promise(r => setTimeout(r, 2000));
//     try {
//       await makePayment({ bookingId, amount: totalAmount, method });
//       setSuccess(true);
//       setTimeout(() => navigate(`/customer/rate/${bookingId}`), 2500);
//     } catch {
//       setProcessing(false);
//     }
//   };

//   // ── Payment success screen ────────────────────────────────
//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="card text-center max-w-md">
//           <div className="text-6xl mb-4">🎉</div>
//           <h2 className="text-2xl font-display font-bold text-green-600 mb-2">
//             Payment Successful!
//           </h2>
//           <p className="text-gray-500">Redirecting to rate your provider…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardNav links={navLinks} role="CUSTOMER" />

//       <main className="max-w-2xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
//           Complete Payment
//         </h1>

//         {booking && (
//           <>
//             {/* ── Work Receipt from Provider ── */}
//             {booking.workDescription && (
//               <div className="card mb-5 border-l-4 border-green-500">
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="text-lg">📋</span>
//                   <h2 className="font-semibold text-gray-900">
//                     Work Receipt from {booking.providerName}
//                   </h2>
//                 </div>

//                 {/* What was fixed */}
//                 <div className="bg-gray-50 rounded-xl p-3 mb-3">
//                   <p className="text-xs text-gray-500 mb-1 font-medium">
//                     Work completed
//                   </p>
//                   <p className="text-sm text-gray-800 leading-relaxed">
//                     {booking.workDescription}
//                   </p>
//                 </div>

//                 {/* Itemised receipt lines */}
//                 {booking.receiptItems && (
//                   <div className="mb-3">
//                     <p className="text-xs text-gray-500 mb-2 font-medium">
//                       Materials & charges
//                     </p>
//                     <div className="space-y-1">
//                       {booking.receiptItems.split("\n").map((line, i) => {
//                         // Parse "Description — ₹Amount" format
//                         const parts = line.split("—");
//                         const desc  = parts[0]?.trim() || line;
//                         const amt   = parts[1]?.trim() || "";
//                         return (
//                           <div
//                             key={i}
//                             className="flex justify-between text-sm text-gray-700
//                                        bg-white border border-gray-100 rounded-lg
//                                        px-3 py-2"
//                           >
//                             <span>{desc}</span>
//                             <span className="font-medium">{amt}</span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {/* Outside estimate notice */}
//                 {booking.outsideEstimate && booking.aiEstimateRange && (
//                   <div className="bg-amber-50 border border-amber-200 rounded-xl
//                                   px-3 py-2 text-xs text-amber-700">
//                     ⚠️ The provider's price (₹{serviceCharge.toLocaleString("en-IN")}) is
//                     outside the AI estimate range of ₹
//                     {booking.aiEstimateRange.replace("-", " – ₹")}.
//                     The provider has seen the actual problem and set this price based
//                     on the real work required.
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── Payment Summary ── */}
//             <div className="card mb-5">
//               <h2 className="font-semibold text-gray-900 mb-4">Payment Summary</h2>
//               <div className="space-y-2 text-sm">

//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Service</span>
//                   <span className="font-medium">{booking.service}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Provider</span>
//                   <span className="font-medium">{booking.providerName}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Date</span>
//                   <span>{formatDate(booking.date)}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Time Slot</span>
//                   <span>{booking.timeSlot}</span>
//                 </div>

//                 <hr className="my-3" />

//                 {/* Show original estimate vs final price */}
//                 {booking.finalAmount && booking.finalAmount !== booking.amount && (
//                   <div className="flex justify-between text-gray-400">
//                     <span>Original estimate</span>
//                     <span className="line-through">
//                       {formatCurrency(booking.amount)}
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <span className="text-gray-600">
//                     Service charge
//                     {booking.finalAmount && (
//                       <span className="ml-1 text-xs text-green-600 font-medium">
//                         (provider's final price)
//                       </span>
//                     )}
//                   </span>
//                   <span className="font-semibold text-gray-900">
//                     {formatCurrency(serviceCharge)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Platform fee</span>
//                   <span className="font-medium">{formatCurrency(PLATFORM_FEE)}</span>
//                 </div>

//                 <div className="flex justify-between font-bold text-base
//                                 border-t pt-2 mt-2">
//                   <span>Total to pay</span>
//                   <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* ── Payment Method ── */}
//             <div className="card mb-6">
//               <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>

//               <div className="flex gap-3 mb-6 flex-wrap">
//                 {["UPI", "Debit Card", "Credit Card", "Cash"].map(m => (
//                   <button
//                     key={m}
//                     onClick={() => setMethod(m)}
//                     className={`px-4 py-2 rounded-xl border text-sm font-medium
//                                 transition-all
//                                 ${method === m
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "border-gray-200 text-gray-700 hover:border-blue-400"}`}
//                   >
//                     {m}
//                   </button>
//                 ))}
//               </div>

//               {method === "UPI" && (
//                 <div>
//                   <label className="label">UPI ID</label>
//                   <input
//                     className="input-field"
//                     placeholder="yourname@upi"
//                     value={upi}
//                     onChange={e => setUpi(e.target.value)}
//                   />
//                 </div>
//               )}

//               {(method === "Debit Card" || method === "Credit Card") && (
//                 <div className="space-y-3">
//                   <div>
//                     <label className="label">Card Number</label>
//                     <input
//                       className="input-field"
//                       placeholder="1234 5678 9012 3456"
//                       maxLength={16}
//                       value={card.number}
//                       onChange={e => setCard({ ...card, number: e.target.value })}
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="label">Expiry (MM/YY)</label>
//                       <input
//                         className="input-field"
//                         placeholder="12/27"
//                         value={card.expiry}
//                         onChange={e => setCard({ ...card, expiry: e.target.value })}
//                       />
//                     </div>
//                     <div>
//                       <label className="label">CVV</label>
//                       <input
//                         className="input-field"
//                         placeholder="123"
//                         maxLength={3}
//                         type="password"
//                         value={card.cvv}
//                         onChange={e => setCard({ ...card, cvv: e.target.value })}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {method === "Cash" && (
//                 <div className="bg-amber-50 border border-amber-200 rounded-xl
//                                 p-4 text-sm text-amber-700">
//                   💵 Pay {formatCurrency(totalAmount)} in cash directly to{" "}
//                   {booking.providerName}.
//                 </div>
//               )}
//             </div>

//             {/* ── Pay button ── */}
//             <button
//               onClick={handlePay}
//               disabled={processing}
//               className="w-full btn-primary py-4 text-base font-semibold
//                          disabled:opacity-50"
//             >
//               {processing
//                 ? "Processing Payment…"
//                 : `Pay ${formatCurrency(totalAmount)}`}
//             </button>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default PaymentPage;



// ============================================================
// FILE: src/pages/customer/PaymentPage.jsx  (FULL REPLACEMENT)
// Fixes: uses finalAmount, shows full receipt, View + Download
// ============================================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "../../services/bookingService";
import { makePayment } from "../../services/paymentService";
import DashboardNav from "../../components/DashboardNav";
import { ReceiptModal, useReceiptDownload } from "../../components/ReceiptPDF";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { PLATFORM_FEE } from "../../utils/constants";

const navLinks = [
  { to: "/customer/dashboard",       label: "Dashboard"       },
  { to: "/customer/book-service",    label: "Book Service"    },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile",         label: "Profile"         },
];

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate      = useNavigate();

  const [booking,       setBooking]       = useState(null);
  const [method,        setMethod]        = useState("UPI");
  const [upi,           setUpi]           = useState("");
  const [card,          setCard]          = useState({ number: "", expiry: "", cvv: "" });
  const [processing,    setProcessing]    = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [showReceipt,   setShowReceipt]   = useState(false);

  const { download } = useReceiptDownload();

  useEffect(() => {
    getBookingById(bookingId)
      .then(r => setBooking(r.data))
      .catch(() => {});
  }, [bookingId]);

  // ── KEY FIX: use finalAmount if set, fall back to base amount ──
  const serviceCharge = booking?.finalAmount ?? booking?.amount ?? 0;
  const totalAmount   = serviceCharge + PLATFORM_FEE;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    try {
      // Send the actual amount customer will pay (finalAmount + platform fee)
      await makePayment({ bookingId, amount: totalAmount, method });
      setSuccess(true);
      setTimeout(() => navigate(`/customer/rate/${bookingId}`), 2500);
    } catch {
      setProcessing(false);
    }
  };

  // ── Success screen ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-display font-bold text-green-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mb-6">Redirecting to rate your provider…</p>

          {/* Download receipt after payment success */}
          {booking && (
            <button
              onClick={() => download({ ...booking, platformFee: PLATFORM_FEE })}
              className="btn-outline text-sm"
            >
              ⬇ Download Receipt PDF
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />

      {/* Receipt modal */}
      {showReceipt && booking && (
        <ReceiptModal
          booking={{ ...booking, platformFee: PLATFORM_FEE }}
          onClose={() => setShowReceipt(false)}
        />
      )}

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
          Complete Payment
        </h1>

        {booking && (
          <>
            {/* ── Provider's Work Receipt section ── */}
            {booking.workDescription && (
              <div className="card mb-5 border-l-4 border-green-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <h2 className="font-semibold text-gray-900">
                      Work Receipt from {booking.providerName}
                    </h2>
                  </div>

                  {/* View and Download buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setShowReceipt(true)}
                      className="flex items-center gap-1.5 text-xs font-medium
                                 text-blue-600 bg-blue-50 border border-blue-200
                                 px-3 py-1.5 rounded-lg hover:bg-blue-100
                                 transition-all"
                    >
                      <span>👁</span> View
                    </button>
                    <button
                      onClick={() => download({ ...booking, platformFee: PLATFORM_FEE })}
                      className="flex items-center gap-1.5 text-xs font-medium
                                 text-green-700 bg-green-50 border border-green-200
                                 px-3 py-1.5 rounded-lg hover:bg-green-100
                                 transition-all"
                    >
                      <span>⬇</span> Download PDF
                    </button>
                  </div>
                </div>

                {/* Work done summary */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    Work completed
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {booking.workDescription}
                  </p>
                </div>

                {/* Itemised lines */}
                {booking.receiptItems && booking.receiptItems.trim() && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2 font-medium">
                      Materials & charges
                    </p>
                    <div className="space-y-1">
                      {booking.receiptItems.split("\n").filter(Boolean).map((line, i) => {
                        const parts = line.split("—");
                        return (
                          <div
                            key={i}
                            className="flex justify-between text-sm text-gray-700
                                       bg-white border border-gray-100 rounded-lg
                                       px-3 py-2"
                          >
                            <span>{parts[0]?.trim() || line}</span>
                            {parts[1] && (
                              <span className="font-medium">{parts[1].trim()}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Outside estimate warning */}
                {booking.outsideEstimate && booking.aiEstimateRange && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl
                                  px-3 py-2.5 text-xs text-amber-700">
                    ⚠️ The provider's price (₹{serviceCharge.toLocaleString("en-IN")}) is
                    outside the AI estimate range of ₹
                    {booking.aiEstimateRange.replace("-", " – ₹")}.
                    The provider assessed the actual problem and set this price
                    based on the real work required.
                  </div>
                )}
              </div>
            )}

            {/* ── Payment Summary ── */}
            <div className="card mb-5">
              <h2 className="font-semibold text-gray-900 mb-4">
                Payment Summary
              </h2>
              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{booking.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider</span>
                  <span className="font-medium">{booking.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Slot</span>
                  <span>{booking.timeSlot}</span>
                </div>

                <hr className="my-3" />

                {/* Show crossed-out original estimate if price changed */}
                {booking.finalAmount &&
                 booking.amount &&
                 booking.finalAmount !== booking.amount && (
                  <div className="flex justify-between text-gray-400">
                    <span>Original estimate</span>
                    <span className="line-through">
                      {formatCurrency(booking.amount)}
                    </span>
                  </div>
                )}

                {/* ── KEY FIX: shows finalAmount not booking.amount ── */}
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Service charge
                    {booking.finalAmount && (
                      <span className="ml-1 text-xs font-medium text-green-600">
                        (provider's final price)
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(serviceCharge)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Platform fee</span>
                  <span className="font-medium">{formatCurrency(PLATFORM_FEE)}</span>
                </div>

                <div className="flex justify-between font-bold text-base
                                border-t pt-3 mt-1">
                  <span>Total to pay</span>
                  <span className="text-blue-600 text-lg">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Payment Method ── */}
            <div className="card mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="flex gap-3 mb-6 flex-wrap">
                {["UPI", "Debit Card", "Credit Card", "Cash"].map(m => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium
                                transition-all
                                ${method === m
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-200 text-gray-700 hover:border-blue-400"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {method === "UPI" && (
                <div>
                  <label className="label">UPI ID</label>
                  <input
                    className="input-field"
                    placeholder="yourname@upi"
                    value={upi}
                    onChange={e => setUpi(e.target.value)}
                  />
                </div>
              )}

              {(method === "Debit Card" || method === "Credit Card") && (
                <div className="space-y-3">
                  <div>
                    <label className="label">Card Number</label>
                    <input
                      className="input-field"
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      value={card.number}
                      onChange={e => setCard({ ...card, number: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Expiry (MM/YY)</label>
                      <input
                        className="input-field"
                        placeholder="12/27"
                        value={card.expiry}
                        onChange={e => setCard({ ...card, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input
                        className="input-field"
                        placeholder="123"
                        maxLength={3}
                        type="password"
                        value={card.cvv}
                        onChange={e => setCard({ ...card, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "Cash" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl
                                p-4 text-sm text-amber-700">
                  💵 Pay {formatCurrency(totalAmount)} in cash directly to{" "}
                  {booking.providerName}.
                </div>
              )}
            </div>

            {/* ── Pay button ── */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full btn-primary py-4 text-base font-semibold
                         disabled:opacity-50"
            >
              {processing
                ? "Processing Payment…"
                : `Pay ${formatCurrency(totalAmount)}`}
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default PaymentPage;