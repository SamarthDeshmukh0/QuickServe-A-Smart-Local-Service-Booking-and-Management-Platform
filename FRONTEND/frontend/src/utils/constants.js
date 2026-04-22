// ============================================================
// FILE: src/utils/constants.js
// ============================================================

export const SERVICES = [
  { name: "Plumber", icon: "🔧", description: "Fix leaks, pipes, and water issues", amount: 499 },
  { name: "Electrician", icon: "⚡", description: "Wiring, fuses, and electrical repairs", amount: 399 },
  { name: "Carpenter", icon: "🔨", description: "Furniture, doors, and woodwork", amount: 599 },
  { name: "AC Repair", icon: "❄️", description: "AC servicing, installation, and repair", amount: 699 },
  { name: "House Cleaning", icon: "🏠", description: "Deep cleaning for homes and offices", amount: 799 },
  { name: "Painting", icon: "🎨", description: "Interior and exterior painting", amount: 1499 },
  { name: "Pest Control", icon: "🐛", description: "Termite, cockroach, and pest treatment", amount: 999 },
  { name: "Appliance Repair", icon: "⚙️", description: "Washing machine, fridge, and more", amount: 499 },
  { name: "Water Purifier", icon: "💧", description: "RO service and filter replacement", amount: 349 },
  { name: "Salon Service", icon: "✂️", description: "Haircut, facial, and grooming at home", amount: 599 },
];

export const CITIES = [
  "Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum",
  "Davangere", "Tumkur", "Shimoga", "Bellary", "Udupi",
];

export const TIME_SLOTS = [
  { id: "S1", label: "8 AM - 9 AM", value: "08:00-09:00" },
  { id: "S2", label: "9 AM - 10 AM", value: "09:00-10:00" },
  { id: "S3", label: "10 AM - 11 AM", value: "10:00-11:00" },
  { id: "S4", label: "11 AM - 12 PM", value: "11:00-12:00" },
  { id: "S5", label: "12 PM - 1 PM", value: "12:00-13:00" },
  { id: "S6", label: "2 PM - 3 PM", value: "14:00-15:00" },
  { id: "S7", label: "3 PM - 4 PM", value: "15:00-16:00" },
  { id: "S8", label: "4 PM - 5 PM", value: "16:00-17:00" },
  { id: "S9", label: "5 PM - 6 PM", value: "17:00-18:00" },
];

export const BOOKING_STATUSES = {
  BOOKED: { label: "Booked", color: "bg-blue-100 text-blue-700" },
  ACCEPTED: { label: "Accepted", color: "bg-indigo-100 text-indigo-700" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  PAID: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export const PLATFORM_FEE = 49;

//export const API_BASE_URL = "http://localhost:8080";

export const API_BASE_URL = import.meta.env.VITE_SPRING_URL || "http://localhost:8080";
export const FLASK_BASE_URL = import.meta.env.VITE_FLASK_URL || "http://localhost:5001";