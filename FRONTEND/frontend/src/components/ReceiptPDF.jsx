// // ============================================================
// // FILE: src/components/ReceiptPDF.jsx   (NEW FILE)
// // Printable / downloadable receipt component.
// // Works in two modes:
// //   <ReceiptPDF booking={booking} mode="view" />   — modal viewer
// //   <ReceiptPDF booking={booking} mode="download"/> — triggers print
// // Usage in PaymentPage: import and render after payment fetch.
// // ============================================================

// import React, { useRef } from "react";
// import { formatDate, formatCurrency } from "../utils/helpers";
// import { PLATFORM_FEE } from "../utils/constants";

// // ── PrintableReceipt — the actual receipt layout ─────────────
// // Rendered inside the modal AND inside a hidden div for printing
// export const PrintableReceipt = React.forwardRef(({ booking }, ref) => {
//   const serviceCharge = booking?.finalAmount ?? booking?.amount ?? 0;
//   const total         = serviceCharge + PLATFORM_FEE;
//   const now           = new Date();

//   return (
//     <div
//       ref={ref}
//       style={{ fontFamily: "Arial, sans-serif", color: "#1e293b" }}
//       className="bg-white p-8 max-w-md mx-auto"
//     >
//       {/* Header */}
//       <div className="text-center mb-6 pb-6 border-b-2 border-gray-200">
//         <p className="text-2xl font-bold text-blue-600 mb-1">⚡ QuickServe</p>
//         <p className="text-xs text-gray-400">Local Service Platform</p>
//         <p className="text-lg font-bold text-gray-900 mt-3">Service Receipt</p>
//         <p className="text-xs text-gray-400 mt-1">
//           Generated on {now.toLocaleDateString("en-IN", {
//             day: "numeric", month: "long", year: "numeric",
//             hour: "2-digit", minute: "2-digit",
//           })}
//         </p>
//       </div>

//       {/* Booking details */}
//       <div className="mb-5">
//         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
//           Booking Details
//         </p>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//           <tbody>
//             {[
//               ["Booking ID",    `#${booking.id}`],
//               ["Service",       booking.service],
//               ["Provider",      booking.providerName],
//               ["Customer",      booking.customerName],
//               ["Date",          formatDate(booking.date)],
//               ["Time Slot",     booking.timeSlot],
//               ["Address",       booking.address],
//             ].map(([label, value]) => (
//               <tr key={label}>
//                 <td style={{ padding: "5px 0", color: "#64748b", width: "40%" }}>
//                   {label}
//                 </td>
//                 <td style={{ padding: "5px 0", fontWeight: 500 }}>
//                   {value}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Work done */}
//       {booking.workDescription && (
//         <div className="mb-5 p-4 rounded-xl"
//           style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
//           <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
//             Work Completed
//           </p>
//           <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
//             {booking.workDescription}
//           </p>
//         </div>
//       )}

//       {/* Itemised receipt */}
//       {booking.receiptItems && booking.receiptItems.trim() && (
//         <div className="mb-5">
//           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
//             Materials & Labour
//           </p>
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//             <thead>
//               <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
//                 <th style={{ textAlign: "left", padding: "6px 0", color: "#64748b",
//                              fontWeight: 600 }}>
//                   Description
//                 </th>
//                 <th style={{ textAlign: "right", padding: "6px 0", color: "#64748b",
//                              fontWeight: 600 }}>
//                   Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {booking.receiptItems.split("\n").filter(Boolean).map((line, i) => {
//                 const parts = line.split("—");
//                 return (
//                   <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
//                     <td style={{ padding: "7px 0" }}>
//                       {parts[0]?.trim() || line}
//                     </td>
//                     <td style={{ padding: "7px 0", textAlign: "right",
//                                  fontWeight: 500 }}>
//                       {parts[1]?.trim() || ""}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Price summary */}
//       <div className="mb-5 p-4 rounded-xl"
//         style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//           <tbody>
//             {/* Show original base estimate if it differs */}
//             {booking.finalAmount && booking.amount &&
//              booking.finalAmount !== booking.amount && (
//               <tr>
//                 <td style={{ padding: "5px 0", color: "#94a3b8" }}>
//                   Original base estimate
//                 </td>
//                 <td style={{ padding: "5px 0", textAlign: "right",
//                              color: "#94a3b8",
//                              textDecoration: "line-through" }}>
//                   {formatCurrency(booking.amount)}
//                 </td>
//               </tr>
//             )}
//             <tr>
//               <td style={{ padding: "5px 0", color: "#475569" }}>
//                 Service charge (provider)
//               </td>
//               <td style={{ padding: "5px 0", textAlign: "right", fontWeight: 600 }}>
//                 {formatCurrency(serviceCharge)}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ padding: "5px 0", color: "#475569" }}>
//                 Platform fee (QuickServe)
//               </td>
//               <td style={{ padding: "5px 0", textAlign: "right" }}>
//                 {formatCurrency(PLATFORM_FEE)}
//               </td>
//             </tr>
//             <tr style={{ borderTop: "2px solid #e2e8f0" }}>
//               <td style={{ padding: "10px 0 5px", fontWeight: 700, fontSize: 15 }}>
//                 Total Paid
//               </td>
//               <td style={{ padding: "10px 0 5px", textAlign: "right",
//                            fontWeight: 700, fontSize: 15, color: "#2563eb" }}>
//                 {formatCurrency(total)}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* AI estimate note */}
//       {booking.aiEstimateRange && (
//         <div className="mb-5 p-3 rounded-lg"
//           style={{ background: "#eff6ff", border: "1px solid #bfdbfe",
//                    fontSize: 12, color: "#1d4ed8" }}>
//           🤖 AI estimate shown before booking: ₹
//           {booking.aiEstimateRange.replace("-", " – ₹")}
//           {booking.outsideEstimate && (
//             <span style={{ color: "#92400e" }}>
//               {" "}· Provider's price was outside this range based on actual work.
//             </span>
//           )}
//         </div>
//       )}

//       {/* Status badge */}
//       <div style={{ textAlign: "center", marginBottom: 20 }}>
//         <span style={{
//           display: "inline-block", background: "#dcfce7",
//           color: "#166534", fontWeight: 700, fontSize: 12,
//           padding: "6px 16px", borderRadius: 999,
//           border: "1px solid #bbf7d0",
//         }}>
//           ✅ PAYMENT RECEIVED
//         </span>
//       </div>

//       {/* Footer */}
//       <div style={{ textAlign: "center", borderTop: "1px solid #e2e8f0",
//                     paddingTop: 16, color: "#94a3b8", fontSize: 11 }}>
//         <p>Thank you for using QuickServe</p>
//         <p style={{ marginTop: 4 }}>
//           This is a computer-generated receipt. No signature required.
//         </p>
//       </div>
//     </div>
//   );
// });

// PrintableReceipt.displayName = "PrintableReceipt";

// // ── ReceiptModal — View button opens this ────────────────────
// export const ReceiptModal = ({ booking, onClose }) => (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-60 flex items-center
//                justify-center z-50 p-4"
//     onClick={onClose}
//   >
//     <div
//       className="bg-white rounded-2xl shadow-2xl w-full max-w-lg
//                  max-h-[90vh] overflow-y-auto"
//       onClick={e => e.stopPropagation()}
//     >
//       {/* Modal toolbar */}
//       <div className="flex items-center justify-between px-6 py-4
//                       border-b border-gray-100 sticky top-0 bg-white
//                       rounded-t-2xl z-10">
//         <h2 className="font-display font-bold text-gray-900">
//           Service Receipt
//         </h2>
//         <button
//           onClick={onClose}
//           className="w-8 h-8 flex items-center justify-center rounded-full
//                      text-gray-400 hover:bg-gray-100 hover:text-gray-700
//                      text-xl"
//         >
//           ×
//         </button>
//       </div>

//       {/* Receipt content */}
//       <PrintableReceipt booking={booking} />
//     </div>
//   </div>
// );

// // ── useReceiptDownload — download hook ───────────────────────
// // Returns a function that triggers browser print / save as PDF
// export const useReceiptDownload = () => {
//   const printRef = useRef(null);

//   const download = (booking) => {
//     // Build a standalone HTML page for printing
//     const serviceCharge = booking?.finalAmount ?? booking?.amount ?? 0;
//     const total         = serviceCharge + (booking?.platformFee ?? 49);
//     const now           = new Date().toLocaleDateString("en-IN", {
//       day: "numeric", month: "long", year: "numeric",
//       hour: "2-digit", minute: "2-digit",
//     });

//     // Build itemised rows HTML
//     const itemRows = booking.receiptItems
//       ? booking.receiptItems.split("\n").filter(Boolean).map(line => {
//           const parts = line.split("—");
//           return `<tr>
//             <td style="padding:7px 0;border-bottom:1px solid #f1f5f9">
//               ${parts[0]?.trim() || line}
//             </td>
//             <td style="padding:7px 0;text-align:right;font-weight:500;
//                        border-bottom:1px solid #f1f5f9">
//               ${parts[1]?.trim() || ""}
//             </td>
//           </tr>`;
//         }).join("")
//       : "";

//     const html = `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8"/>
//   <title>QuickServe Receipt - Booking #${booking.id}</title>
//   <style>
//     * { box-sizing: border-box; margin: 0; padding: 0; }
//     body { font-family: Arial, sans-serif; color: #1e293b;
//            background: white; }
//     .page { max-width: 480px; margin: 40px auto; padding: 40px; }
//     h1 { font-size: 22px; color: #2563eb; }
//     .sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }
//     .section-title { font-size: 10px; font-weight: 700;
//                      color: #94a3b8; text-transform: uppercase;
//                      letter-spacing: 0.08em; margin: 20px 0 10px; }
//     table { width: 100%; border-collapse: collapse; font-size: 13px; }
//     td, th { padding: 6px 0; }
//     .label { color: #64748b; width: 40%; }
//     .work-box { background: #f0fdf4; border: 1px solid #bbf7d0;
//                 border-radius: 10px; padding: 14px; margin: 14px 0;
//                 font-size: 13px; color: #166534; line-height: 1.6; }
//     .price-box { background: #f8fafc; border: 1px solid #e2e8f0;
//                  border-radius: 10px; padding: 14px; }
//     .total-row td { font-size: 15px; font-weight: 700;
//                     border-top: 2px solid #e2e8f0; padding-top: 10px; }
//     .badge { display: inline-block; background: #dcfce7; color: #166534;
//              font-weight: 700; font-size: 12px; padding: 6px 18px;
//              border-radius: 999px; border: 1px solid #bbf7d0; }
//     .footer { text-align: center; color: #94a3b8; font-size: 11px;
//               border-top: 1px solid #e2e8f0; padding-top: 16px;
//               margin-top: 20px; }
//     @media print {
//       @page { margin: 20mm; }
//       body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <div style="text-align:center;border-bottom:2px solid #e2e8f0;
//                 padding-bottom:20px;margin-bottom:20px">
//       <h1>⚡ QuickServe</h1>
//       <p class="sub">Local Service Platform</p>
//       <p style="font-size:18px;font-weight:700;margin-top:12px">
//         Service Receipt
//       </p>
//       <p class="sub">Generated on ${now}</p>
//     </div>

//     <p class="section-title">Booking Details</p>
//     <table>
//       <tr><td class="label">Booking ID</td><td>#${booking.id}</td></tr>
//       <tr><td class="label">Service</td><td>${booking.service}</td></tr>
//       <tr><td class="label">Provider</td><td>${booking.providerName}</td></tr>
//       <tr><td class="label">Customer</td><td>${booking.customerName}</td></tr>
//       <tr><td class="label">Date</td>
//           <td>${new Date(booking.date).toLocaleDateString("en-IN",
//             { day:"numeric", month:"long", year:"numeric" })}</td></tr>
//       <tr><td class="label">Time Slot</td><td>${booking.timeSlot}</td></tr>
//       <tr><td class="label">Address</td><td>${booking.address}</td></tr>
//     </table>

//     ${booking.workDescription ? `
//     <div class="work-box">
//       <div style="font-size:10px;font-weight:700;color:#15803d;
//                   text-transform:uppercase;letter-spacing:0.05em;
//                   margin-bottom:6px">
//         Work Completed
//       </div>
//       ${booking.workDescription}
//     </div>` : ""}

//     ${itemRows ? `
//     <p class="section-title">Materials &amp; Labour</p>
//     <table>
//       <thead>
//         <tr>
//           <th style="text-align:left;color:#64748b;font-weight:600;
//                      border-bottom:1px solid #e2e8f0;padding-bottom:6px">
//             Description
//           </th>
//           <th style="text-align:right;color:#64748b;font-weight:600;
//                      border-bottom:1px solid #e2e8f0;padding-bottom:6px">
//             Amount
//           </th>
//         </tr>
//       </thead>
//       <tbody>${itemRows}</tbody>
//     </table>` : ""}

//     <p class="section-title">Payment Summary</p>
//     <div class="price-box">
//       <table>
//         ${booking.finalAmount && booking.amount &&
//           booking.finalAmount !== booking.amount ? `
//         <tr>
//           <td style="color:#94a3b8;padding:5px 0">
//             Original base estimate
//           </td>
//           <td style="text-align:right;color:#94a3b8;
//                      text-decoration:line-through;padding:5px 0">
//             ₹${Number(booking.amount).toLocaleString("en-IN")}
//           </td>
//         </tr>` : ""}
//         <tr>
//           <td style="color:#475569;padding:5px 0">
//             Service charge (provider)
//           </td>
//           <td style="text-align:right;font-weight:600;padding:5px 0">
//             ₹${serviceCharge.toLocaleString("en-IN")}
//           </td>
//         </tr>
//         <tr>
//           <td style="color:#475569;padding:5px 0">
//             Platform fee (QuickServe)
//           </td>
//           <td style="text-align:right;padding:5px 0">
//             ₹${(booking?.platformFee ?? 49)}
//           </td>
//         </tr>
//         <tr class="total-row">
//           <td>Total Paid</td>
//           <td style="text-align:right;color:#2563eb">
//             ₹${total.toLocaleString("en-IN")}
//           </td>
//         </tr>
//       </table>
//     </div>

//     ${booking.aiEstimateRange ? `
//     <div style="margin:16px 0;padding:10px 14px;background:#eff6ff;
//                 border:1px solid #bfdbfe;border-radius:8px;
//                 font-size:12px;color:#1d4ed8">
//       🤖 AI estimate shown before booking: ₹${
//         booking.aiEstimateRange.replace("-", " – ₹")
//       }
//       ${booking.outsideEstimate
//         ? "<span style='color:#92400e'> · Provider's price was outside this range based on actual work.</span>"
//         : ""}
//     </div>` : ""}

//     <div style="text-align:center;margin:20px 0">
//       <span class="badge">✅ PAYMENT RECEIVED</span>
//     </div>

//     <div class="footer">
//       <p>Thank you for using QuickServe</p>
//       <p style="margin-top:4px">
//         Computer-generated receipt. No signature required.
//       </p>
//     </div>
//   </div>
// </body>
// </html>`;

//     // Open in new tab and trigger print → "Save as PDF"
//     const win = window.open("", "_blank", "width=600,height=800");
//     win.document.write(html);
//     win.document.close();
//     win.focus();
//     // Small delay so styles load before print dialog
//     setTimeout(() => { win.print(); }, 400);
//   };

//   return { download, printRef };
// };








// ============================================================
// FILE: src/components/ReceiptPDF.jsx   (NEW FILE — create this)
// ============================================================

import React from "react";
import { formatDate, formatCurrency } from "../utils/helpers";
import { PLATFORM_FEE } from "../utils/constants";

// ── Parse pipe-separated receipt items from DB ───────────────
// Each line format: "Description — ₹Amount"
const parseItems = (text) => {
  if (!text || !text.trim()) return [];
  return text.split("\n").filter(Boolean).map(line => {
    const parts = line.split("—");
    return {
      desc:   parts[0]?.trim() || line,
      amount: parts[1]?.trim() || "",
    };
  }).filter(it => it.desc);
};

// ── Receipt content layout ────────────────────────────────────
// Used inside modal AND inside PDF generation
const ReceiptContent = ({ booking, serviceCharge, total }) => {
  const items = parseItems(booking.receiptItems);
  const now   = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const receiptNo = `QS-${booking.id}-${new Date().getFullYear()}`;

  return (
    <div className="text-sm text-gray-800">

      {/* ── Header ── */}
      <div className="text-center pb-5 mb-5"
           style={{ borderBottom: "2px dashed #e2e8f0" }}>
        <p className="text-xl font-bold text-blue-600">⚡ QuickServe</p>
        <p className="text-xs text-gray-400 mt-0.5">Local Service Platform</p>
        <p className="text-base font-bold text-gray-900 mt-3">
          TAX INVOICE / RECEIPT
        </p>
        <p className="text-xs text-gray-400 mt-1">Date: {now}</p>
        <p className="text-xs text-gray-400">Receipt No: {receiptNo}</p>
      </div>

      {/* ── Billed To / Service By ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Billed To
          </p>
          <p className="font-semibold text-gray-900">{booking.customerName}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {booking.address}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Service By
          </p>
          <p className="font-semibold text-gray-900">{booking.providerName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{booking.providerCity}</p>
          <p className="text-xs text-gray-500">{booking.service}</p>
        </div>
      </div>

      {/* ── Booking Info ── */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-400">Booking ID</span>
          <p className="font-medium">#{booking.id}</p>
        </div>
        <div>
          <span className="text-gray-400">Service Date</span>
          <p className="font-medium">{formatDate(booking.date)}</p>
        </div>
        <div>
          <span className="text-gray-400">Time Slot</span>
          <p className="font-medium">{booking.timeSlot}</p>
        </div>
        <div>
          <span className="text-gray-400">Status</span>
          <p className="font-medium text-green-600">✅ Completed</p>
        </div>
      </div>

      {/* ── Work Description ── */}
      {booking.workDescription && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
            Description of Work
          </p>
          <p className="text-gray-700 leading-relaxed">
            {booking.workDescription}
          </p>
        </div>
      )}

      {/* ── Itemised Bill Table ── */}
      {items.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Itemised Bill
          </p>

          {/* Header row */}
          <div className="grid text-xs font-semibold text-gray-500
                          bg-gray-100 rounded-t-lg px-3 py-2"
               style={{ gridTemplateColumns: "1fr 90px" }}>
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Item rows */}
          {items.map((it, i) => (
            <div key={i}
                 className={`grid px-3 py-2.5 text-sm border-b border-gray-100
                   ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                 style={{ gridTemplateColumns: "1fr 90px" }}>
              <span className="text-gray-800">{it.desc}</span>
              <span className="text-right font-medium text-gray-900">
                {it.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Price Breakdown ── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        {/* Crossed-out estimate if price changed */}
        {booking.finalAmount && booking.amount &&
         booking.finalAmount !== booking.amount && (
          <div className="flex justify-between px-4 py-2.5 bg-gray-50 text-xs">
            <span className="text-gray-400">Original base estimate</span>
            <span className="text-gray-400 line-through">
              {formatCurrency(booking.amount)}
            </span>
          </div>
        )}

        <div className="flex justify-between px-4 py-2.5 bg-white">
          <span className="text-gray-600">Service charge</span>
          <span className="font-semibold">{formatCurrency(serviceCharge)}</span>
        </div>

        <div className="flex justify-between px-4 py-2.5 bg-white
                        border-t border-gray-100 text-gray-500">
          <span>Platform fee (QuickServe)</span>
          <span>{formatCurrency(PLATFORM_FEE)}</span>
        </div>

        <div className="flex justify-between px-4 py-3.5 font-bold text-white"
             style={{ background: "#2563eb" }}>
          <span>Total Amount Paid</span>
          <span className="text-lg">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* ── AI Estimate Note ── */}
      {booking.aiEstimateRange && (
        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mb-4">
          🤖 AI estimate before booking: ₹
          {booking.aiEstimateRange.replace("-", " – ₹")}
          {booking.outsideEstimate && (
            <span className="text-amber-600">
              {" "}· Provider's assessed price differed based on actual work done.
            </span>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="text-center pt-4"
           style={{ borderTop: "2px dashed #e2e8f0" }}>
        <span className="inline-block bg-green-100 text-green-700 font-bold
                         text-xs px-4 py-1.5 rounded-full border border-green-200">
          ✅ PAYMENT RECEIVED
        </span>
        <p className="text-xs text-gray-400 mt-3">
          Thank you for using QuickServe.
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Computer-generated receipt. No signature required.
        </p>
      </div>
    </div>
  );
};

// ── ReceiptModal — View button opens this ────────────────────
export const ReceiptModal = ({ booking, onClose }) => {
  const serviceCharge = booking?.finalAmount ?? booking?.amount ?? 0;
  const total         = serviceCharge + PLATFORM_FEE;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center
                 justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md
                   max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900">Service Receipt</h2>
          <div className="flex gap-2">
            <button
              onClick={() => downloadPDF(booking, serviceCharge, total)}
              className="text-xs font-medium text-green-700 bg-green-50
                         border border-green-200 px-3 py-1.5 rounded-lg
                         hover:bg-green-100"
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center
                         text-gray-400 hover:bg-gray-100 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Receipt body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <ReceiptContent
            booking={booking}
            serviceCharge={serviceCharge}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

// ── downloadPDF — generates HTML receipt + triggers browser print ──
const downloadPDF = (booking, serviceCharge, total) => {
  const items     = parseItems(booking.receiptItems);
  const receiptNo = `QS-${booking.id}-${new Date().getFullYear()}`;
  const now       = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const itemRowsHTML = items.map((it, i) => `
    <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"}">
      <td style="padding:8px 14px;border-bottom:1px solid #f1f5f9;font-size:13px">
        ${it.desc}
      </td>
      <td style="padding:8px 14px;text-align:right;font-weight:600;
                 border-bottom:1px solid #f1f5f9;font-size:13px">
        ${it.amount}
      </td>
    </tr>`).join("");

  const estimateCrossedOut = booking.finalAmount && booking.amount &&
    booking.finalAmount !== booking.amount
    ? `<tr style="background:#f8fafc">
         <td style="padding:8px 14px;color:#94a3b8;font-size:12px">
           Original base estimate
         </td>
         <td style="padding:8px 14px;text-align:right;color:#94a3b8;
                    text-decoration:line-through;font-size:12px">
           ₹${Number(booking.amount).toLocaleString("en-IN")}
         </td>
       </tr>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Receipt ${receiptNo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px;
           color: #1e293b; background: #fff; }
    .page { max-width: 520px; margin: 30px auto; padding: 40px; }
    @media print {
      @page { margin: 15mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { margin: 0; padding: 0; }
    }
  </style>
</head>
<body><div class="page">

  <div style="text-align:center;padding-bottom:20px;
              border-bottom:2px dashed #e2e8f0;margin-bottom:20px">
    <div style="font-size:20px;font-weight:700;color:#2563eb">⚡ QuickServe</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:2px">
      Local Service Platform
    </div>
    <div style="font-size:16px;font-weight:700;margin-top:12px">
      TAX INVOICE / RECEIPT
    </div>
    <div style="font-size:11px;color:#64748b;margin-top:4px">Date: ${now}</div>
    <div style="font-size:11px;color:#64748b">Receipt No: ${receiptNo}</div>
  </div>

  <table style="width:100%;margin-bottom:16px">
    <tr>
      <td style="width:50%;vertical-align:top;padding-right:10px">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;
                    text-transform:uppercase;margin-bottom:5px">Billed To</div>
        <div style="font-weight:600">${booking.customerName}</div>
        <div style="font-size:12px;color:#64748b;margin-top:3px;line-height:1.5">
          ${booking.address}
        </div>
      </td>
      <td style="width:50%;vertical-align:top;padding-left:10px">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;
                    text-transform:uppercase;margin-bottom:5px">Service By</div>
        <div style="font-weight:600">${booking.providerName}</div>
        <div style="font-size:12px;color:#64748b;margin-top:3px">
          ${booking.providerCity}
        </div>
        <div style="font-size:12px;color:#64748b">${booking.service}</div>
      </td>
    </tr>
  </table>

  <div style="background:#f8fafc;border-radius:8px;padding:12px;
              margin-bottom:16px;font-size:12px;
              display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div><span style="color:#94a3b8">Booking ID</span>
         <div style="font-weight:600">#${booking.id}</div></div>
    <div><span style="color:#94a3b8">Date</span>
         <div style="font-weight:600">
           ${new Date(booking.date).toLocaleDateString("en-IN",
             { day:"numeric", month:"long", year:"numeric" })}
         </div></div>
    <div><span style="color:#94a3b8">Time Slot</span>
         <div style="font-weight:600">${booking.timeSlot}</div></div>
    <div><span style="color:#94a3b8">Status</span>
         <div style="font-weight:600;color:#16a34a">✅ Completed</div></div>
  </div>

  ${booking.workDescription ? `
  <div style="background:#eff6ff;border:1px solid #bfdbfe;
              border-radius:8px;padding:12px;margin-bottom:16px">
    <div style="font-size:10px;font-weight:700;color:#2563eb;
                text-transform:uppercase;margin-bottom:6px">
      Description of Work
    </div>
    <div style="color:#1e40af;line-height:1.6">${booking.workDescription}</div>
  </div>` : ""}

  ${items.length > 0 ? `
  <div style="font-size:10px;font-weight:700;color:#94a3b8;
              text-transform:uppercase;margin-bottom:8px">
    Itemised Bill
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <thead>
      <tr style="background:#f1f5f9">
        <th style="text-align:left;padding:8px 14px;font-size:11px;
                   font-weight:600;color:#64748b;
                   border-bottom:2px solid #e2e8f0">
          Description
        </th>
        <th style="text-align:right;padding:8px 14px;font-size:11px;
                   font-weight:600;color:#64748b;
                   border-bottom:2px solid #e2e8f0;width:100px">
          Amount
        </th>
      </tr>
    </thead>
    <tbody>${itemRowsHTML}</tbody>
  </table>` : ""}

  <table style="width:100%;border-collapse:collapse;
                border:1px solid #e2e8f0;border-radius:8px;
                overflow:hidden;margin-bottom:16px">
    ${estimateCrossedOut}
    <tr style="border-top:1px solid #e2e8f0">
      <td style="padding:10px 14px;color:#475569">Service charge</td>
      <td style="padding:10px 14px;text-align:right;font-weight:600">
        ₹${serviceCharge.toLocaleString("en-IN")}
      </td>
    </tr>
    <tr style="border-top:1px solid #e2e8f0">
      <td style="padding:10px 14px;color:#64748b">
        Platform fee (QuickServe)
      </td>
      <td style="padding:10px 14px;text-align:right;color:#64748b">
        ₹${PLATFORM_FEE}
      </td>
    </tr>
    <tr style="background:#2563eb;color:#fff;border-top:2px solid #1d4ed8">
      <td style="padding:12px 14px;font-weight:700;font-size:15px">
        Total Amount Paid
      </td>
      <td style="padding:12px 14px;text-align:right;
                 font-weight:700;font-size:17px">
        ₹${total.toLocaleString("en-IN")}
      </td>
    </tr>
  </table>

  ${booking.aiEstimateRange ? `
  <div style="background:#f8fafc;border-radius:6px;padding:8px 12px;
              font-size:11px;color:#64748b;margin-bottom:16px">
    🤖 AI estimate before booking: ₹${
      booking.aiEstimateRange.replace("-", " – ₹")
    }${booking.outsideEstimate
      ? " · Provider's price adjusted based on actual work done."
      : ""}
  </div>` : ""}

  <div style="text-align:center;border-top:2px dashed #e2e8f0;padding-top:16px">
    <span style="display:inline-block;background:#dcfce7;color:#166534;
                 font-weight:700;font-size:12px;padding:6px 20px;
                 border-radius:999px;border:1px solid #bbf7d0">
      ✅ PAYMENT RECEIVED
    </span>
    <div style="font-size:11px;color:#94a3b8;margin-top:10px">
      Thank you for using QuickServe.
    </div>
    <div style="font-size:11px;color:#cbd5e1;margin-top:3px">
      Computer-generated receipt. No signature required.
    </div>
  </div>

</div></body></html>`;

  const win = window.open("", "_blank", "width=640,height=900");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
};

// ── useReceiptDownload hook ───────────────────────────────────
// Returns { download } — call download(booking) to trigger PDF
export const useReceiptDownload = () => {
  const download = (booking) => {
    const serviceCharge = booking?.finalAmount ?? booking?.amount ?? 0;
    const total         = serviceCharge + PLATFORM_FEE;
    downloadPDF(booking, serviceCharge, total);
  };
  return { download };
};

export default ReceiptModal;