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
  },
  plugins: [],
}
