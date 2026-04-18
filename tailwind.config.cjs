/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const safeListFile = 'safelist.txt'

// colors.indigo
const SAFELIST_COLORS = 'colors'

module.exports = {
    mode: 'jit',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './safelist.txt'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            comfortaa: ['Comfortaa', 'sans-serif'],
            roboto: ['Roboto', 'sans-serif'],
            normsPro: ['TT Norms Pro', 'sans-serif'],
            sans: [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                '"Noto Sans"',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                '"Noto Color Emoji"',
            ],
            serif: [
                'ui-serif',
                'Georgia',
                'Cambria',
                '"Times New Roman"',
                'Times',
                'serif',
            ],
            mono: [
                'ui-monospace',
                'SFMono-Regular',
                'Menlo',
                'Monaco',
                'Consolas',
                '"Liberation Mono"',
                '"Courier New"',
                'monospace',
            ],
        },
        screens: {
            xs: '576',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                red: {
                    600: '#EE3851',
                    'shade-1': '#FD6D6D',
                    'shade-2': '#A65F5F',
                    'shade-3': '#FF9090',
                    'shade-4': '#BD7878',
                },
                'green-shade': {
                    1: '#F5F8ED',
                    2: '#B7F04C',
                    3: '#2E7D32',
                },
                'gray-shade': {
                    1: '#595959',
                    2: '#DDDDDD',
                    3: '#5A5A5A',
                    4: '#F6F3F3',
                    5: '#323232',
                    6: '#EBEDF0',
                    7: '#49454F',
                    8: '#AFAEAE',
                    9: '#969696',
                    10: '#747474',
                    11: '#F9FAFB',
                    12: '#EFECEC',
                    13: '#BEBCBC',
                    14: '#D9D9D9',
                    15: '#F6F6F6',
                    16: '#848484',
                    17: '#737373',
                    18: '#dadada',
                },
                'black-shade': {
                    1: '#3C3C3C',
                    2: '#1F1F1F',
                    3: '#283F27',
                },
                primary: {
                    100: '#FFDFDF',
                    200: '#B3B3B3',
                    text: '#EE3851',
                },
            },
            letterSpacing: {
                para: '0.15px',
            },
            boxShadow: {
                card: '0px 2px 6px 3px rgba(0, 0, 0, 0.25)',
                sidebar: '0px 0px 25px 5px rgba(216, 216, 216, 1)',
                'elevation-1': '0px 2px 1px -1px rgba(0, 0, 0, 0.2)',
                'elevation-2': '0px 1px 1px 0px rgba(0, 0, 0, 0.14)',
                'elevation-3': '0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                'elevation-4': '0px 0px 8px 3px rgba(0, 0, 0, 0.25)',
                'elevation-5': '0px 2.97px 2.97px 0px rgba(0, 0, 0, 0.25)',
                'elevation-6': '0px 1px 6px -2px rgba(0, 0, 0, 0.25)',
            },

            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.500'),
                        maxWidth: '65ch',
                    },
                },
                invert: {
                    css: {
                        color: theme('colors.gray.400'),
                    },
                },
            }),
        },
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./twSafelistGenerator')({
            path: safeListFile,
            patterns: [
                `text-{${SAFELIST_COLORS}}`,
                `bg-{${SAFELIST_COLORS}}`,
                `dark:bg-{${SAFELIST_COLORS}}`,
                `dark:hover:bg-{${SAFELIST_COLORS}}`,
                `dark:active:bg-{${SAFELIST_COLORS}}`,
                `hover:text-{${SAFELIST_COLORS}}`,
                `hover:bg-{${SAFELIST_COLORS}}`,
                `active:bg-{${SAFELIST_COLORS}}`,
                `ring-{${SAFELIST_COLORS}}`,
                `hover:ring-{${SAFELIST_COLORS}}`,
                `focus:ring-{${SAFELIST_COLORS}}`,
                `focus-within:ring-{${SAFELIST_COLORS}}`,
                `border-{${SAFELIST_COLORS}}`,
                `focus:border-{${SAFELIST_COLORS}}`,
                `focus-within:border-{${SAFELIST_COLORS}}`,
                `dark:text-{${SAFELIST_COLORS}}`,
                `dark:hover:text-{${SAFELIST_COLORS}}`,
                `h-{height}`,
                `w-{width}`,
            ],
        }),
        require('@tailwindcss/typography'),
    ],
}
