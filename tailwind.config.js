/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      padding: {
        '68': '17rem', // Adds pl-68 utility
      },
    },
    variants: {
      // Ensure 'print' is included for the utilities you want to control
      extend: {
        display: ['print'],
      },
    },
  },
  plugins: [],
}
