import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        train: {
          dark: '#080C14',
          card: '#0F172A',
          cardHover: '#1E293B',
          border: '#1E293B',
          accent: '#F59E0B',
          accentHover: '#D97706',
          freccia: '#E11D48',
          italo: '#991B1B',
          intercity: '#0284C7',
          regionale: '#059669',
          ontime: '#10B981',
          delay: '#EF4444',
          gold: '#FBBF24',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        flipBoard: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flip': 'flipBoard 0.4s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
