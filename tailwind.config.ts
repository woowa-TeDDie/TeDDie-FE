import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#F5A623',
        'brand-yellow-hover': '#E09518',
        'bg-dark': '#1A120B',
        'bg-dark-secondary': '#231810',
        surface: '#2C1F14',
        'surface-hover': '#3A2A1C',
        'text-primary': '#F5EDE0',
        'text-muted': '#9B8B7A',
        'border-subtle': '#3D2E20',
        success: '#4CAF50',
        danger: '#F44336',
        warning: '#FF9800',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
