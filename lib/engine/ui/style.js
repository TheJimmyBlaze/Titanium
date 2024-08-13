import tinycolor from 'tinycolor2';

const colour = {
    lime: '#00ff00',
    blue: '#0d6efd',
    indigo: '#6610f2',
    purple: '#6f42c1',
    pink: '#d63384',
    red: '#dc3545',
    orange: '#fd7e14',
    yellow: '#ffc107',
    green: '#198754',
    teal: '#20c997',
    cyan: '#0dcaf0'
};

const mono = {
    white: '#fff',
    gray100: '#f8f9fa',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
    black: '#1a1e21'
};

const darken = colour => tinycolor(colour).darken(20).desaturate(20).toString();

const font = 'courier new';
const fontSize = 12;

const defaultStyle = {

    ...colour,
    ...mono,

    debug: colour.lime,

    primary: colour.blue,
    secondary: mono.gray700,
    success: colour.green,
    info: colour.cyan,
    warning: colour.yellow,
    danger: colour.red,

    light: mono.gray300,
    dark: mono.black,

    darken,

    font,
    fontSize,
};
export default defaultStyle;