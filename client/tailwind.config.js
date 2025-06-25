/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: "#4F46E5",       // Indigo-600
        primaryHover: "#4338CA",  // Indigo-700
        accent: "#22C55E",        // Green-500
        accentHover: "#16A34A",   // Green-600
        lightBg: "#f0f4f8",
        card: "#ffffffb3",        // white/70
        borderLight: "#e5e7eb",   // Gray-200
        errorBg: "#fee2e2",       // Red-100
        errorText: "#b91c1c",     // Red-700
        placeholder: "#9ca3af",   // Gray-400
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

