// @ts-ignore
import { defineConfig } from 'windicss/helpers'

function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map((i) => i + startAt)
}

export default defineConfig({
  safelist: [
    range(30).map((i) => `p-${i}`), // p-1 to p-30
    range(10).map((i) => `mt-${i}`), // mt-1 to mt-10
  ],
  theme: {
    extend: {
      colors: {
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
    },
  },
})
