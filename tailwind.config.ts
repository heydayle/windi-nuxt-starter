// @ts-ignore
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './Error.{js,ts,vue}',
    './error.{js,ts,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C16A',
        green: {
          50: '#EFFDF5',
          100: '#D9FBE8',
          200: '#B3F5D1',
          300: '#75EDAE',
          400: '#00DC82',
          500: '#00C16A',
          600: '#00A155',
          700: '#007F45',
          800: '#016538',
          900: '#0A5331',
          950: '#052e16',
        },
      },
      animation: {
        text: 'text-color 3s ease-in-out infinite',
      },
      keyframes: {
        'text-color': {
          '0%, 100%': {
            'background-opacity': '0',
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-opacity': '1',
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
}
