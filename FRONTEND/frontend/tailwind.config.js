// ============================================================
// FILE: tailwind.config.js
// ============================================================

module.exports = {
  content: ["./src/**\/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#4F46E5",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        neutral: "#64748B",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
