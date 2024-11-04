/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                // Inclus le fichier index.html à la racine
    "./src/**/*.{js,jsx,ts,tsx}",  // Inclus tous les fichiers dans `src` avec extensions JS, JSX, TS et TSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
