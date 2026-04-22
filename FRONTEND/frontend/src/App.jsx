// ============================================================
// FILE: src/App.jsx
// ============================================================

// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Public
// import LandingPage from "./pages/LandingPage";

// // Auth
// import CustomerLogin from "./pages/auth/CustomerLogin";
// import CustomerRegister from "./pages/auth/CustomerRegister";
// import ProviderLogin from "./pages/auth/ProviderLogin";
// import ProviderRegister from "./pages/auth/ProviderRegister";
// import AdminLogin from "./pages/auth/AdminLogin";

// // Customer
// import CustomerDashboard from "./pages/customer/CustomerDashboard";
// import BookService from "./pages/customer/BookService";
// import BookingHistory from "./pages/customer/BookingHistory";
// import PaymentPage from "./pages/customer/PaymentPage";
// import RatingPage from "./pages/customer/RatingPage";
// import CustomerProfile from "./pages/customer/CustomerProfile";

// // Provider
// import ProviderDashboard from "./pages/provider/ProviderDashboard";
// import ProviderJobs from "./pages/provider/ProviderJobs";
// import ProviderSlots from "./pages/provider/ProviderSlots";
// import ProviderEarnings from "./pages/provider/ProviderEarnings";
// import ProviderProfile from "./pages/provider/ProviderProfile";

//  import BookingDetail from "./pages/customer/BookingDetail";
// // Admin
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProviders from "./pages/admin/AdminProviders";
// import AdminBookings from "./pages/admin/AdminBookings";
// import AdminAnalytics from "./pages/admin/AdminAnalytics";

// const App = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/customer/login" element={<CustomerLogin />} />
//           <Route path="/customer/register" element={<CustomerRegister />} />
//           <Route path="/provider/login" element={<ProviderLogin />} />
//           <Route path="/provider/register" element={<ProviderRegister />} />
//           <Route path="/admin/login" element={<AdminLogin />} />

//           {/* Customer Protected */}
//           <Route path="/customer/dashboard" element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
//           <Route path="/customer/book-service" element={<ProtectedRoute role="CUSTOMER"><BookService /></ProtectedRoute>} />
//           <Route path="/customer/booking-history" element={<ProtectedRoute role="CUSTOMER"><BookingHistory /></ProtectedRoute>} />
          
//           <Route
//             path="/customer/booking/:bookingId"
//             element={
//               <ProtectedRoute role="CUSTOMER">
//                 <BookingDetail />
//               </ProtectedRoute>
//             }
//           />        
//           <Route path="/customer/payment/:bookingId" element={<ProtectedRoute role="CUSTOMER"><PaymentPage /></ProtectedRoute>} />
//           <Route path="/customer/rate/:bookingId" element={<ProtectedRoute role="CUSTOMER"><RatingPage /></ProtectedRoute>} />
//           <Route path="/customer/profile" element={<ProtectedRoute role="CUSTOMER"><CustomerProfile /></ProtectedRoute>} />


//           {/* Provider Protected */}
//           <Route path="/provider/dashboard" element={<ProtectedRoute role="PROVIDER"><ProviderDashboard /></ProtectedRoute>} />
//           <Route path="/provider/jobs" element={<ProtectedRoute role="PROVIDER"><ProviderJobs /></ProtectedRoute>} />
//           <Route path="/provider/slots" element={<ProtectedRoute role="PROVIDER"><ProviderSlots /></ProtectedRoute>} />
//           <Route path="/provider/earnings" element={<ProtectedRoute role="PROVIDER"><ProviderEarnings /></ProtectedRoute>} />
//           <Route path="/provider/profile" element={<ProtectedRoute role="PROVIDER"><ProviderProfile /></ProtectedRoute>} />

//           {/* Admin Protected */}
//           <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
//           <Route path="/admin/providers" element={<ProtectedRoute role="ADMIN"><AdminProviders /></ProtectedRoute>} />
//           <Route path="/admin/bookings" element={<ProtectedRoute role="ADMIN"><AdminBookings /></ProtectedRoute>} />
//           <Route path="/admin/analytics" element={<ProtectedRoute role="ADMIN"><AdminAnalytics /></ProtectedRoute>} />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;



// ============================================================
// FILE: src/App.jsx  (FULL REPLACEMENT)
// Adds /customer/urgent-booking route  (this version is good)
// ============================================================

// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Public
// import LandingPage from "./pages/LandingPage";

// // Auth
// import CustomerLogin    from "./pages/auth/CustomerLogin";
// import CustomerRegister from "./pages/auth/CustomerRegister";
// import ProviderLogin    from "./pages/auth/ProviderLogin";
// import ProviderRegister from "./pages/auth/ProviderRegister";
// import AdminLogin       from "./pages/auth/AdminLogin";

// // Customer
// import CustomerDashboard from "./pages/customer/CustomerDashboard";
// import BookService       from "./pages/customer/BookService";
// import BookingHistory    from "./pages/customer/BookingHistory";
// import PaymentPage       from "./pages/customer/PaymentPage";
// import RatingPage        from "./pages/customer/RatingPage";
// import CustomerProfile   from "./pages/customer/CustomerProfile";
// import UrgentBooking     from "./pages/customer/UrgentBooking";   // NEW
// import BookingDetail from "./pages/customer/BookingDetail";

// // Provider
// import ProviderDashboard from "./pages/provider/ProviderDashboard";
// import ProviderJobs      from "./pages/provider/ProviderJobs";
// import ProviderSlots     from "./pages/provider/ProviderSlots";
// import ProviderEarnings  from "./pages/provider/ProviderEarnings";
// import ProviderProfile   from "./pages/provider/ProviderProfile";

// // Admin
// import AdminDashboard  from "./pages/admin/AdminDashboard";
// import AdminProviders  from "./pages/admin/AdminProviders";
// import AdminBookings   from "./pages/admin/AdminBookings";
// import AdminAnalytics  from "./pages/admin/AdminAnalytics";

// const App = () => (
//   <AuthProvider>
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/"                    element={<LandingPage />} />
//         <Route path="/customer/login"      element={<CustomerLogin />} />
//         <Route path="/customer/register"   element={<CustomerRegister />} />
//         <Route path="/provider/login"      element={<ProviderLogin />} />
//         <Route path="/provider/register"   element={<ProviderRegister />} />
//         <Route path="/admin/login"         element={<AdminLogin />} />

//         {/* Customer Protected */}
//         <Route path="/customer/dashboard"
//           element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
//         <Route path="/customer/book-service"
//           element={<ProtectedRoute role="CUSTOMER"><BookService /></ProtectedRoute>} />
//         <Route path="/customer/booking-history"
//           element={<ProtectedRoute role="CUSTOMER"><BookingHistory /></ProtectedRoute>} />
//         <Route path="/customer/payment/:bookingId"
//           element={<ProtectedRoute role="CUSTOMER"><PaymentPage /></ProtectedRoute>} />
//         <Route path="/customer/rate/:bookingId"
//           element={<ProtectedRoute role="CUSTOMER"><RatingPage /></ProtectedRoute>} />
//         <Route path="/customer/profile"
//           element={<ProtectedRoute role="CUSTOMER"><CustomerProfile /></ProtectedRoute>} />
//         <Route path="/customer/booking/:bookingId"
//           element={<ProtectedRoute role="CUSTOMER"><BookingDetail /></ProtectedRoute>} />

//         {/* NEW — Urgent booking route */}
//         <Route path="/customer/urgent-booking"
//           element={<ProtectedRoute role="CUSTOMER"><UrgentBooking /></ProtectedRoute>} />

//         {/* Provider Protected */}
//         <Route path="/provider/dashboard"
//           element={<ProtectedRoute role="PROVIDER"><ProviderDashboard /></ProtectedRoute>} />
//         <Route path="/provider/jobs"
//           element={<ProtectedRoute role="PROVIDER"><ProviderJobs /></ProtectedRoute>} />
//         <Route path="/provider/slots"
//           element={<ProtectedRoute role="PROVIDER"><ProviderSlots /></ProtectedRoute>} />
//         <Route path="/provider/earnings"
//           element={<ProtectedRoute role="PROVIDER"><ProviderEarnings /></ProtectedRoute>} />
//         <Route path="/provider/profile"
//           element={<ProtectedRoute role="PROVIDER"><ProviderProfile /></ProtectedRoute>} />

//         {/* Admin Protected */}
//         <Route path="/admin/dashboard"
//           element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
//         <Route path="/admin/providers"
//           element={<ProtectedRoute role="ADMIN"><AdminProviders /></ProtectedRoute>} />
//         <Route path="/admin/bookings"
//           element={<ProtectedRoute role="ADMIN"><AdminBookings /></ProtectedRoute>} />
//         <Route path="/admin/analytics"
//           element={<ProtectedRoute role="ADMIN"><AdminAnalytics /></ProtectedRoute>} />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   </AuthProvider>
// );

// export default App;



//the below versin is for grp bking

// ============================================================
// FILE: src/App.jsx  (FULL REPLACEMENT)
// Adds /customer/book-package route
// ============================================================

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";

import CustomerLogin    from "./pages/auth/CustomerLogin";
import CustomerRegister from "./pages/auth/CustomerRegister";
import ProviderLogin    from "./pages/auth/ProviderLogin";
import ProviderRegister from "./pages/auth/ProviderRegister";
import AdminLogin       from "./pages/auth/AdminLogin";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BookService       from "./pages/customer/BookService";
import BookPackage       from "./pages/customer/BookPackage";
import BookingHistory    from "./pages/customer/BookingHistory";
import BookingDetail     from "./pages/customer/BookingDetail";
import PaymentPage       from "./pages/customer/PaymentPage";
import RatingPage        from "./pages/customer/RatingPage";
import CustomerProfile   from "./pages/customer/CustomerProfile";
import UrgentBooking     from "./pages/customer/UrgentBooking";

import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderJobs      from "./pages/provider/ProviderJobs";
import ProviderSlots     from "./pages/provider/ProviderSlots";
import ProviderEarnings  from "./pages/provider/ProviderEarnings";
import ProviderProfile   from "./pages/provider/ProviderProfile";

import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminProviders  from "./pages/admin/AdminProviders";
import AdminBookings   from "./pages/admin/AdminBookings";
import AdminAnalytics  from "./pages/admin/AdminAnalytics";

const CR = (role, element) => (
  <ProtectedRoute role={role}>{element}</ProtectedRoute>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"                  element={<LandingPage />} />
        <Route path="/customer/login"    element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/provider/login"    element={<ProviderLogin />} />
        <Route path="/provider/register" element={<ProviderRegister />} />
        <Route path="/admin/login"       element={<AdminLogin />} />

        {/* Customer */}
        <Route path="/customer/dashboard"          element={CR("CUSTOMER", <CustomerDashboard />)} />
        <Route path="/customer/book-service"       element={CR("CUSTOMER", <BookService />)} />
        <Route path="/customer/book-package"       element={CR("CUSTOMER", <BookPackage />)} />
        <Route path="/customer/booking-history"    element={CR("CUSTOMER", <BookingHistory />)} />
        <Route path="/customer/booking/:bookingId" element={CR("CUSTOMER", <BookingDetail />)} />
        <Route path="/customer/payment/:bookingId" element={CR("CUSTOMER", <PaymentPage />)} />
        <Route path="/customer/rate/:bookingId"    element={CR("CUSTOMER", <RatingPage />)} />
        <Route path="/customer/profile"            element={CR("CUSTOMER", <CustomerProfile />)} />
        <Route path="/customer/urgent-booking"     element={CR("CUSTOMER", <UrgentBooking />)} />

        {/* Provider */}
        <Route path="/provider/dashboard" element={CR("PROVIDER", <ProviderDashboard />)} />
        <Route path="/provider/jobs"      element={CR("PROVIDER", <ProviderJobs />)} />
        <Route path="/provider/slots"     element={CR("PROVIDER", <ProviderSlots />)} />
        <Route path="/provider/earnings"  element={CR("PROVIDER", <ProviderEarnings />)} />
        <Route path="/provider/profile"   element={CR("PROVIDER", <ProviderProfile />)} />

        {/* Admin */}
        <Route path="/admin/dashboard"  element={CR("ADMIN", <AdminDashboard />)} />
        <Route path="/admin/providers"  element={CR("ADMIN", <AdminProviders />)} />
        <Route path="/admin/bookings"   element={CR("ADMIN", <AdminBookings />)} />
        <Route path="/admin/analytics"  element={CR("ADMIN", <AdminAnalytics />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;