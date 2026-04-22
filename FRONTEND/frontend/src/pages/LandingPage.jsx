// FILE: src/pages/LandingPage.jsx
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SERVICES, CITIES } from "../utils/constants";

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchService, setSearchService] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const howItWorks = [
    { step: 1, title: "Register", desc: "Create your account in under 2 minutes", icon: "👤" },
    { step: 2, title: "Book a Slot", desc: "Select service, provider, date and time slot", icon: "📅" },
    { step: 3, title: "Pay Securely", desc: "Safe dummy payment after service completion", icon: "💳" },
    { step: 4, title: "Get Service Done", desc: "Professional arrives at your scheduled time", icon: "✅" },
  ];

  const whyUs = [
    { icon: "🛡️", title: "Verified Professionals", desc: "Background-checked and admin-approved" },
    { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges, fixed service rates" },
    { icon: "📅", title: "Slot-Based Booking", desc: "Book exact time slots, no waiting" },
    { icon: "🤖", title: "Smart Recommendations", desc: "AI-ranked providers for best match" },
    { icon: "⏱️", title: "On-Time Service", desc: "Providers commit to booked time slots" },
    { icon: "⭐", title: "Quality Assurance", desc: "Rate your provider after every job" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
            🤖 AI-Powered Provider Recommendations
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Find Trusted Local<br />Services Instantly
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Book plumbers, electricians, AC repair and more within minutes. Verified professionals. Transparent pricing.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-3 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <select value={searchService} onChange={e => setSearchService(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select Service</option>
              {SERVICES.map(s => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
            </select>
            <select value={searchCity} onChange={e => setSearchCity(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => navigate("/customer/register")}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm whitespace-nowrap">
              🔍 Search
            </button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/customer/register")}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg">
              📅 Book a Service
            </button>
            <button onClick={() => navigate("/provider/register")}
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
              🔧 Become a Provider
            </button>
            {/* <Link
              to="/customer/urgent-booking"
              className="flex items-center gap-2 bg-red-600 text-white font-semibold
                        px-6 py-3 rounded-xl hover:bg-red-700 transition-all
                        shadow-lg shadow-red-200 animate-pulse"
            >
              🚨 Emergency? Book Now
            </Link> */}

              <button
    onClick={() => navigate("/customer/urgent-booking")}
    className="bg-red-600 text-white font-semibold px-8 py-3
               rounded-xl hover:bg-red-700 transition-all
               shadow-lg shadow-red-900/30 flex items-center gap-2"
  >
    🚨 Emergency Booking
  </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-500 text-lg">Expert professionals for every home service need</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <div key={service.name}
                onClick={() => navigate("/customer/register")}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{service.description}</p>
                <p className="text-blue-600 font-semibold text-sm">Starting ₹{service.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Get your service done in 4 simple steps</p>
          </div>
          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            {howItWorks.map((step, idx) => (
              <div key={step.step} className="flex-1 flex flex-col items-center text-center relative">
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-100 z-0" />
                )}
                <div className="relative z-10 w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-4">
                  {step.icon}
                </div>
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center mb-3">
                  {step.step}
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Highlight */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🤖</div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">We Find the Best Provider for You</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Our scoring engine ranks providers by rating, experience, and proximity to your location automatically.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { label: "Rating Score", weight: "40%", icon: "⭐" },
              { label: "Experience Score", weight: "35%", icon: "🏆" },
              { label: "Proximity Score", weight: "25%", icon: "📍" },
            ].map(item => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-display font-bold text-3xl mb-1">{item.weight}</div>
                <div className="text-blue-100 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-500 text-lg">Thousands of happy customers trust QuickServe</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 flex gap-4 items-start hover:bg-blue-50 transition-colors">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;