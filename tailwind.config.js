export default {
  darkMode: 'class',
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy:   "#0F172A",
        gold:   "#F5A623",
        solar:  "#38BDF8",
        sgreen: "#0EA5E9",
      },
      fontFamily: {
        heading: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["SF Mono", "JetBrains Mono", "IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      }
    }
  },
  plugins: []
}
