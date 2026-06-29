/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EE",
        ink: "#17201B",
        "ink-muted": "#4F5D55",
        "ink-subtle": "#7A867F",
        "brand-green": "#2FA36B",
        "brand-blue": "#2F6FDB",
        "brand-teal": "#1E9C8E",
        "brand-gold": "#C9972F",
        "brand-red": "#D94A45",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
