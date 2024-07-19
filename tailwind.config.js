/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'tiny': '0.75rem',  // 12px
        'small': '0.875rem', // 14px
        'base': '1rem',      // 16px
        'large': '1.25rem',  // 20px
        'xlarge': '1.5rem',  // 24px
        '2xlarge': '2rem',   // 32px
        '3xlarge': '2.5rem'
      },
    },
    screens: {
      'sm': '430px',
    },
  },
  plugins: [],
};
