/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-purple": "#A74ED1",
        "custom-green": "#594ED1",
        "card-color":"#E4E5EC"
      },
    },
  },
  plugins: [],
};
