// ============================================================
// FILE: src/pages/customer/RatingPage.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBookingById } from "../../services/bookingService";
import { submitRating } from "../../services/ratingService";
import DashboardNav from "../../components/DashboardNav";

import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/customer/dashboard", label: "Dashboard" },
  { to: "/customer/book-service", label: "Book Service" },
  { to: "/customer/booking-history", label: "Booking History" },
  { to: "/customer/profile", label: "Profile" },
];

const RatingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  //const { user } = require("../../context/AuthContext").useAuth();
  const { user } = useAuth();

  //  if (!booking) {
  //   return <div className="p-10 text-center">Loading...</div>;
  // }

  useEffect(() => {
    getBookingById(bookingId).then(r => setBooking(r.data)).catch(() => {});
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!stars) return;
    setSubmitting(true);
    try {
      await submitRating({ bookingId, customerId: user.id, providerId: booking.providerId, stars, review });
      setSuccess(true);
      setTimeout(() => navigate("/customer/dashboard"), 2000);
    } catch { setSubmitting(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card text-center max-w-md">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-500">Your rating helps other customers find great providers.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav links={navLinks} role="CUSTOMER" />
      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Rate Your Experience</h1>
          {booking && <p className="text-gray-500 mb-8">{booking.service} with <strong>{booking.providerName}</strong></p>}

          {/* Stars */}
          <div className="flex justify-center gap-3 mb-6">
            {[1,2,3,4,5].map(s => (
              <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setStars(s)}
                className={`text-4xl transition-transform hover:scale-110 ${(hover || stars) >= s ? "text-amber-400" : "text-gray-200"}`}>
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mb-6">
            {stars === 1 ? "😞 Poor" : stars === 2 ? "😐 Fair" : stars === 3 ? "🙂 Good" : stars === 4 ? "😊 Great" : stars === 5 ? "🤩 Excellent!" : "Click to rate"}
          </p>

          <textarea className="input-field text-left mb-6" rows={4} maxLength={300} value={review} onChange={e => setReview(e.target.value)}
            placeholder="Optional: Write a review (max 300 characters)" />

          <button onClick={handleSubmit} disabled={!stars || submitting}
            className="w-full btn-primary py-3 font-semibold disabled:opacity-40 mb-3">
            {submitting ? "Submitting…" : "Submit Rating"}
          </button>
          <Link to="/customer/dashboard" className="text-sm text-gray-400 hover:text-gray-600">Skip for now</Link>
        </div>
      </main>
    </div>
  );
};

export default RatingPage;