/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,jsx}'],
    theme: {
        extend: {
            colors: {
                first: '#E2DCC8',
                second: '#D8D8D8',
                third: '#E2DCC8',
                fourth: '#E2DCC8',
                button: '#647E68',
                buttonHover: '#F0F0F0',
            },
        },
    },
    plugins: [
        // ...
        require('@tailwindcss/line-clamp'),
    ],
}
