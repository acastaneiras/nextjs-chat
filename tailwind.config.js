/** @type {import('tailwindcss').Config} */

module.exports = {
  purge: {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./theme/*.{js,ts,jsx,tsx}",
    ],
  },
  theme: {
    extend: {
      colors: {
        'chat-white': '#f1f4f6',
        'blue1': '#146c90',
        'blue2': '#56a2c2',
      },
    },
  },
  plugins: [],
};
