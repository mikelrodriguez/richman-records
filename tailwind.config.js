/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                region: {
                    0: '#F2E8CF', // Canvas/Cream
                    1: '#A7C957', // Vintage Green
                    2: '#6A994E', // Deep Green
                    3: '#BC4749', // Record Label Red
                    4: '#F4A261', // Soft Orange
                    5: '#E9C46A', // Mustard Yellow
                    6: '#2A9D8F', // Teal
                    7: '#264653', // Deep Slate Blue
                    8: '#8AB17D', // Sage
                },
                vinyl: {
                    base: '#111111',
                    groove: '#1a1a1a',
                    highlight: '#2a2a2a'
                }
            }
        },
    },
    plugins: [],
}
