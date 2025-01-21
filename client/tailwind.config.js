/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./ConfigPage/index.html",
    "./ConfigPage/configMain.tsx",
    "./ConfigPage/ConfigPage.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        'genshin': ["Genshin", "serif"],
      },
      colors: {
        pyro: '#EC4923',
        hydro: '#00BFFF',
        anemo: '#359697',
        electro: '#945dc4',
        dendro: '#608a00',
        cryo: '#4682B4',
        geo: '#debd6c',
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      backgroundImage: {
        'config-enka': "url('https://hitol1.github.io/u-ttv-ext-enka/watercolorenka.png')"
      }
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}