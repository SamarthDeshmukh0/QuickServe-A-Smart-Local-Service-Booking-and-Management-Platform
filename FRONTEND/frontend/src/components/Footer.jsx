// // ============================================================
// // FILE: src/components/Footer.jsx
// // ============================================================

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-white font-display font-bold text-xl mb-3">⚡ QuickServe</h3>
        <p className="text-sm text-gray-400 leading-relaxed">Connecting you with trusted local service professionals. Fast, reliable, and verified.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Services</h4>
        <ul className="space-y-2 text-sm">
          {["Plumber","Electrician","Carpenter","AC Repair","House Cleaning"].map(s => (
            <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Platform</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/customer/register" className="hover:text-white transition-colors">Book a Service</Link></li>
          <li><Link to="/provider/register" className="hover:text-white transition-colors">Become a Provider</Link></li>
          <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Support</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
      © 2026 QuickServe. All rights reserved. | CSE Final Year Project
    </div>
  </footer>
);

export default Footer;






// import React from "react";
// import { Link } from "react-router-dom";

// const developers = [
//   {
//     name: "Samarth Deshmukh",
//     role: "Full Stack Developer",
//     img: "/images/samarth.jpg", // place image in public/images
//   },
//   {
//     name: "Teammate Name",
//     role: "Frontend Developer",
//     img: "/images/dev2.jpg",
//   },
// ];

// const Footer = () => (
//   <footer className="bg-gray-900 text-gray-300">
//     <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      
//       {/* Brand */}
//       <div>
//         <h3 className="text-white font-display font-bold text-xl mb-3">⚡ QuickServe</h3>
//         <p className="text-sm text-gray-400 leading-relaxed">
//           Connecting you with trusted local service professionals. Fast, reliable, and verified.
//         </p>
//       </div>

//       {/* Services */}
//       <div>
//         <h4 className="text-white font-semibold mb-3">Services</h4>
//         <ul className="space-y-2 text-sm">
//           {["Plumber","Electrician","Carpenter","AC Repair","House Cleaning"].map(s => (
//             <li key={s}>
//               <a href="#services" className="hover:text-white transition-colors">{s}</a>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Platform */}
//       <div>
//         <h4 className="text-white font-semibold mb-3">Platform</h4>
//         <ul className="space-y-2 text-sm">
//           <li><Link to="/customer/register" className="hover:text-white">Book a Service</Link></li>
//           <li><Link to="/provider/register" className="hover:text-white">Become a Provider</Link></li>
//           <li><Link to="/admin/login" className="hover:text-white">Admin Portal</Link></li>
//         </ul>
//       </div>

//       {/* Support */}
//       <div>
//         <h4 className="text-white font-semibold mb-3">Support</h4>
//         <ul className="space-y-2 text-sm">
//           <li><a href="#" className="hover:text-white">Help Center</a></li>
//           <li><a href="#" className="hover:text-white">Contact Us</a></li>
//           <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
//           <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
//         </ul>
//       </div>
//     </div>

//     {/* 🔥 Developers Section */}
//     <div className="border-t border-gray-800 py-8">
//       <h4 className="text-center text-white font-semibold mb-6">Developed By</h4>

//       <div className="flex flex-wrap justify-center gap-6">
//         {developers.map((dev, index) => (
//           <div key={index} className="text-center">
//             <img
//               src={dev.img}
//               alt={dev.name}
//               className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-700 object-cover"
//             />
//             <p className="text-sm text-white">{dev.name}</p>
//             <p className="text-xs text-gray-400">{dev.role}</p>
//           </div>
//         ))}
//       </div>
//     </div>

//     {/* Bottom */}
//     <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
//       © 2026 QuickServe. All rights reserved. | CSE Final Year Project
//     </div>
//   </footer>
// );

// export default Footer;