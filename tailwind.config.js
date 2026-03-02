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
                    0: '#f1f5f9', // slate-100
                    1: '#e0e7ff', // indigo-100
                    2: '#dbeafe', // blue-100
                    3: '#e0f2fe', // sky-100
                    4: '#ecfdf5', // emerald-100
                    5: '#fef3c7', // amber-100
                    6: '#ffedd5', // orange-100
                    7: '#fce7f3', // pink-100
                    8: '#f3e8ff', // purple-100
                }
            }
        },
    },
    plugins: [],
}
