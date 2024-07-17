import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {},
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    // More details at https://daisyui.com/docs/config/
    // themes: ['dark, dim, sunset, dracula, retro, night'],
    // themes: ['cupcake', 'bumblebee', 'lemonade', 'nord' ],
    // themes: ['dark', 'retro'],
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: 'white',
          'base-300': '#f2e6fa',
        },
      },
      {
        retro: {
          ...require('daisyui/src/theming/themes')['retro'],
          primary: '#302c2c',
          'base-300': '#302c2c',
        },
      },
      {
        bumblebee: {
          ...require('daisyui/src/theming/themes')['bumblebee'],
          primary: '#302c2c',
          'base-300': '#302c2c',
        },
      },
    ],
  },
}
export default config
