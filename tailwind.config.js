import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // KOOSMIC AI Brand Colors
        'primary-purple': '#7C3AED',
        'purple-light': '#A78BFA',
        'purple-dark': '#6D28D9',
        
        // Backgrounds
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F9FAFB',
        'bg-secondary-alt': '#F3F4F6',
        'sidebar-bg': '#1F2937',
        'border-gray': '#E5E7EB',
        
        // Text
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'text-on-dark': '#FFFFFF',
        
        // Status Colors
        'success-green': '#10B981',
        'warning-orange': '#F59E0B',
        'error-red': '#EF4444',
        'info-blue': '#3B82F6',
        
        // Keep existing colors
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'metric-lg': ['2.25rem', { lineHeight: '1', fontWeight: '700' }],
        'metric-md': ['1.5rem', { lineHeight: '1', fontWeight: '600' }],
        'button': ['0.875rem', { lineHeight: '1', fontWeight: '500' }],
        'badge': ['0.75rem', { lineHeight: '1', fontWeight: '500' }],
      },
      spacing: {
        'xxs': '0.25rem',
        'xs': '0.5rem',
        'sm': '0.75rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
