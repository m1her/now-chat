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
        "primary-dark": "var(--primary-dark-color)",
        "primary-light": "var(--primary-light-color)",
        "secondary-dark": "var(--secondary-dark-color)",
        "secondary-light": "var(--secondary-light-color)",
        "third-color": "var(--third-color)",
      },
    },
  },
  plugins: [],
}
export default config
