/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Police personnalisée
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      
      // Couleurs personnalisées
      colors: {
        premium: {
          black: "#000000",
          dark: "#0a0a0a",
          gray: {
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
          },
        },
      },
      
      // Animations personnalisées
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "gradient": "gradient-shift 5s ease infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      
      // Keyframes personnalisées
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 255, 255, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      
      // Espacement personnalisé
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },
      
      // Bordures personnalisées
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      
      // Ombres personnalisées
      boxShadow: {
        "premium": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "premium-lg": "0 20px 40px 0 rgba(0, 0, 0, 0.5)",
        "premium-xl": "0 30px 60px 0 rgba(0, 0, 0, 0.6)",
        "glow": "0 0 20px rgba(255, 255, 255, 0.2)",
        "glow-lg": "0 0 40px rgba(255, 255, 255, 0.3)",
        "glow-xl": "0 0 60px rgba(255, 255, 255, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(255, 255, 255, 0.1)",
      },
      
      // Backdrop blur personnalisé
      backdropBlur: {
        "4xl": "40px",
        "5xl": "50px",
      },
      
      // Transition personnalisée
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      
      // Durée de transition personnalisée
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "900": "900ms",
      },
      
      // Z-index personnalisé
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      
      // Opacité personnalisée
      opacity: {
        "15": "0.15",
        "35": "0.35",
        "65": "0.65",
        "85": "0.85",
      },
      
      // Scale personnalisé
      scale: {
        "102": "1.02",
        "103": "1.03",
        "104": "1.04",
      },
      
      // Rotate personnalisé
      rotate: {
        "15": "15deg",
        "30": "30deg",
        "60": "60deg",
        "120": "120deg",
        "135": "135deg",
        "150": "150deg",
      },
      
      // Blur personnalisé
      blur: {
        "4xl": "40px",
        "5xl": "50px",
      },
      
      // Brightness personnalisé
      brightness: {
        "25": ".25",
        "175": "1.75",
        "200": "2",
      },
      
      // Contrast personnalisé
      contrast: {
        "25": ".25",
        "175": "1.75",
        "200": "2",
      },
      
      // Saturate personnalisé
      saturate: {
        "25": ".25",
        "175": "1.75",
        "200": "2",
      },
      
      // Grayscale personnalisé
      grayscale: {
        "50": "0.5",
      },
      
      // Invert personnalisé
      invert: {
        "50": "0.5",
      },
      
      // Sepia personnalisé
      sepia: {
        "50": "0.5",
      },
    },
  },
  plugins: [],
};
