module.exports = {
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 20%, 50%, 80%, 100%': {transform: 'translateY(0)'},
	        '40%' :{transform: 'translateY(-30px)'},
	        '60%' :{transform: 'translateY(-15px)'}   
        }
      },
       animation: {
        'bounce': 'bounce 2s ease infinite;',
      }
    },
  },
  plugins: [],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
  ],
};

