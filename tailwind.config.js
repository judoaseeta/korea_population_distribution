module.exports = {
    content: ['./src/**/*.{html,tsx}'],
    theme: {
        extend: {
            spacing: {
                ih: '2rem',
            },
            fontSize: {
                ssm: '0.6rem',
            },
            colors: {
                background: '#f8f0e7',
                border: '#0c96bd',
                treeLine: '#e66f9c',
                lineChart: '#a454aa',
                dot: '#d94906',
            },
            gridTemplateColumns: {
                node: '20rem 20rem 15rem 5rem',
            },
        },
    },
    plugins: [],
}
