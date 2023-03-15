/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,jsx}'],
    theme: {
        extend: {
            colors: {
                first: '#eeeeee',
                second: '#dddddd',
                third: '#AF0404',
                fourth: '#414141',
            },
        },
    },
    plugins: [
        // ...
        require('@tailwindcss/line-clamp'),
    ],
}
