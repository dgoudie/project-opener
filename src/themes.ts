import { IPartialTheme } from '@uifabric/styling';

const themes: ({ name: string } & IPartialTheme)[] = [
    {
        name: 'Edge',
        palette: {
            themePrimary: '#3392ff',
            themeLighterAlt: '#02060a',
            themeLighter: '#081729',
            themeLight: '#0f2c4d',
            themeTertiary: '#1f5899',
            themeSecondary: '#2d81e0',
            themeDarkAlt: '#479dff',
            themeDark: '#64acff',
            themeDarker: '#8dc2ff',
            neutralLighterAlt: '#2b3137',
            neutralLighter: '#32393f',
            neutralLight: '#3e454c',
            neutralQuaternaryAlt: '#454d54',
            neutralQuaternary: '#4b535b',
            neutralTertiaryAlt: '#666e77',
            neutralTertiary: '#fcfcfc',
            neutralSecondary: '#fcfcfc',
            neutralPrimaryAlt: '#fdfdfd',
            neutralPrimary: '#f9fafa',
            neutralDark: '#fefefe',
            black: '#fefefe',
            white: '#24292e',
        },
    },
    {
        name: 'Edge (Light)',
        palette: {
            themePrimary: '#025ec7',
            themeLighterAlt: '#f3f7fd',
            themeLighter: '#cfe1f6',
            themeLight: '#a7c8ee',
            themeTertiary: '#5a97dd',
            themeSecondary: '#1a6ece',
            themeDarkAlt: '#0254b3',
            themeDark: '#024797',
            themeDarker: '#01356f',
            neutralLighterAlt: '#f3f3f3',
            neutralLighter: '#efefef',
            neutralLight: '#e5e5e5',
            neutralQuaternaryAlt: '#d6d6d6',
            neutralQuaternary: '#cccccc',
            neutralTertiaryAlt: '#c4c4c4',
            neutralTertiary: '#aab1b8',
            neutralSecondary: '#9199a1',
            neutralPrimaryAlt: '#79818a',
            neutralPrimary: '#24292e',
            neutralDark: '#4c545c',
            black: '#373e45',
            white: '#fafafa',
        },
    },
    {
        name: 'Bright',
        palette: {
            themePrimary: '#f64c72',
            themeLighterAlt: '#0a0304',
            themeLighter: '#270c12',
            themeLight: '#491722',
            themeTertiary: '#932e43',
            themeSecondary: '#d74363',
            themeDarkAlt: '#f65d7e',
            themeDark: '#f77692',
            themeDarker: '#f999ae',
            neutralLighterAlt: '#151579',
            neutralLighter: '#1b1b7e',
            neutralLight: '#242487',
            neutralQuaternaryAlt: '#2a2a8d',
            neutralQuaternary: '#2f2f91',
            neutralTertiaryAlt: '#4848a4',
            neutralTertiary: '#c8c8c8',
            neutralSecondary: '#d0d0d0',
            neutralPrimaryAlt: '#dadada',
            neutralPrimary: '#ffffff',
            neutralDark: '#f4f4f4',
            black: '#f8f8f8',
            white: '#101073',
        },
    },
    {
        name: 'Sky',
        palette: {
            themePrimary: '#ffffff',
            themeLighterAlt: '#767676',
            themeLighter: '#a6a6a6',
            themeLight: '#c8c8c8',
            themeTertiary: '#d0d0d0',
            themeSecondary: '#dadada',
            themeDarkAlt: '#eaeaea',
            themeDark: '#f4f4f4',
            themeDarker: '#f8f8f8',
            neutralLighterAlt: '#325ea5',
            neutralLighter: '#3863a8',
            neutralLight: '#426bae',
            neutralQuaternaryAlt: '#4871b2',
            neutralQuaternary: '#4d75b5',
            neutralTertiaryAlt: '#6689c2',
            neutralTertiary: '#c8c8c8',
            neutralSecondary: '#d0d0d0',
            neutralPrimaryAlt: '#dadada',
            neutralPrimary: '#ffffff',
            neutralDark: '#f4f4f4',
            black: '#f8f8f8',
            white: '#2b58a1',
        },
    },
    {
        name: 'Abyss',
        palette: {
            themePrimary: '#8aa1bd',
            themeLighterAlt: '#060608',
            themeLighter: '#161a1e',
            themeLight: '#293039',
            themeTertiary: '#536071',
            themeSecondary: '#798da6',
            themeDarkAlt: '#94a9c3',
            themeDark: '#a3b6cd',
            themeDarker: '#b9c8da',
            neutralLighterAlt: '#070943',
            neutralLighter: '#0b0d4b',
            neutralLight: '#121457',
            neutralQuaternaryAlt: '#17195f',
            neutralQuaternary: '#1b1e65',
            neutralTertiaryAlt: '#32357f',
            neutralTertiary: '#eeeeee',
            neutralSecondary: '#f1f1f1',
            neutralPrimaryAlt: '#f4f4f4',
            neutralPrimary: '#e6e6e6',
            neutralDark: '#f9f9f9',
            black: '#fcfcfc',
            white: '#04063b',
        },
    },
    {
        name: 'Bee',
        palette: {
            themePrimary: '#dedb3a',
            themeLighterAlt: '#090902',
            themeLighter: '#232309',
            themeLight: '#434211',
            themeTertiary: '#858323',
            themeSecondary: '#c3c133',
            themeDarkAlt: '#e1df4b',
            themeDark: '#e6e465',
            themeDarker: '#eceb8a',
            neutralLighterAlt: '#262626',
            neutralLighter: '#2f2f2f',
            neutralLight: '#3d3d3d',
            neutralQuaternaryAlt: '#464646',
            neutralQuaternary: '#4d4d4d',
            neutralTertiaryAlt: '#6b6b6b',
            neutralTertiary: '#c8c8c8',
            neutralSecondary: '#d0d0d0',
            neutralPrimaryAlt: '#dadada',
            neutralPrimary: '#f2f2f2',
            neutralDark: '#f4f4f4',
            black: '#f8f8f8',
            white: '#1c1c1c',
        },
    },
    {
        name: 'Coal',
        palette: {
            themePrimary: '#e67409',
            themeLighterAlt: '#090500',
            themeLighter: '#251301',
            themeLight: '#452303',
            themeTertiary: '#8a4506',
            themeSecondary: '#ca6608',
            themeDarkAlt: '#e88020',
            themeDark: '#ec9340',
            themeDarker: '#f1ae6f',
            neutralLighterAlt: '#261717',
            neutralLighter: '#2f1d1d',
            neutralLight: '#3d2827',
            neutralQuaternaryAlt: '#462f2e',
            neutralQuaternary: '#4d3534',
            neutralTertiaryAlt: '#6b4f4e',
            neutralTertiary: '#c8c8c8',
            neutralSecondary: '#d0d0d0',
            neutralPrimaryAlt: '#dadada',
            neutralPrimary: '#f2f2f2',
            neutralDark: '#f4f4f4',
            black: '#f8f8f8',
            white: '#1c1110',
        },
    },
    {
        name: 'Cherry',
        palette: {
            themePrimary: '#990011',
            themeLighterAlt: '#060001',
            themeLighter: '#180003',
            themeLight: '#2e0005',
            themeTertiary: '#5c000b',
            themeSecondary: '#870010',
            themeDarkAlt: '#a31021',
            themeDark: '#b12b3a',
            themeDarker: '#c65764',
            neutralLighterAlt: '#f6efee',
            neutralLighter: '#f2ebea',
            neutralLight: '#e8e2e1',
            neutralQuaternaryAlt: '#d8d2d1',
            neutralQuaternary: '#cec9c8',
            neutralTertiaryAlt: '#c6c1c0',
            neutralTertiary: '#595959',
            neutralSecondary: '#373737',
            neutralPrimaryAlt: '#2f2f2f',
            neutralPrimary: '#000000',
            neutralDark: '#151515',
            black: '#0b0b0b',
            white: '#fcf6f5',
        },
    },
    {
        name: 'Beach',
        palette: {
            themePrimary: '#2c6eab',
            themeLighterAlt: '#f4f8fc',
            themeLighter: '#d5e4f2',
            themeLight: '#b3cde6',
            themeTertiary: '#72a1cd',
            themeSecondary: '#3f7cb5',
            themeDarkAlt: '#28639a',
            themeDark: '#225382',
            themeDarker: '#193d60',
            neutralLighterAlt: '#f8edce',
            neutralLighter: '#f4e9cb',
            neutralLight: '#eadfc2',
            neutralQuaternaryAlt: '#dad0b5',
            neutralQuaternary: '#d0c7ad',
            neutralTertiaryAlt: '#c8bfa6',
            neutralTertiary: '#595959',
            neutralSecondary: '#373737',
            neutralPrimaryAlt: '#2f2f2f',
            neutralPrimary: '#000000',
            neutralDark: '#151515',
            black: '#0b0b0b',
            white: '#fff3d4',
        },
    },
    {
        name: 'Crane',
        palette: {
            themePrimary: '#ff6190',
            themeLighterAlt: '#fff9fb',
            themeLighter: '#ffe6ed',
            themeLight: '#ffd0de',
            themeTertiary: '#ffa0bd',
            themeSecondary: '#ff749e',
            themeDarkAlt: '#e65782',
            themeDark: '#c24a6e',
            themeDarker: '#8f3651',
            neutralLighterAlt: '#280328',
            neutralLighter: '#310531',
            neutralLight: '#3f0b3f',
            neutralQuaternaryAlt: '#480f48',
            neutralQuaternary: '#4f134f',
            neutralTertiaryAlt: '#6d286d',
            neutralTertiary: '#f6f6f6',
            neutralSecondary: '#f8f8f8',
            neutralPrimaryAlt: '#f9f9f9',
            neutralPrimary: '#f2f2f2',
            neutralDark: '#fcfcfc',
            black: '#fdfdfd',
            white: '#1f011f',
        },
    },
    {
        name: 'Neon',
        palette: {
            themePrimary: '#85ffc2',
            themeLighterAlt: '#050a08',
            themeLighter: '#15291f',
            themeLight: '#284d3a',
            themeTertiary: '#509974',
            themeSecondary: '#75e0ab',
            themeDarkAlt: '#91ffc8',
            themeDark: '#a2ffd0',
            themeDarker: '#baffdd',
            neutralLighterAlt: '#2f3b4d',
            neutralLighter: '#354254',
            neutralLight: '#3f4c60',
            neutralQuaternaryAlt: '#455367',
            neutralQuaternary: '#4b596d',
            neutralTertiaryAlt: '#637186',
            neutralTertiary: '#c8c8c8',
            neutralSecondary: '#d0d0d0',
            neutralPrimaryAlt: '#dadada',
            neutralPrimary: '#ffffff',
            neutralDark: '#f4f4f4',
            black: '#f8f8f8',
            white: '#2a3546',
        },
    },
    {
        name: 'Purple',
        palette: {
            themePrimary: '#9b70ff',
            themeLighterAlt: '#fbf9ff',
            themeLighter: '#efe8ff',
            themeLight: '#e1d4ff',
            themeTertiary: '#c3a9ff',
            themeSecondary: '#a781ff',
            themeDarkAlt: '#8c65e6',
            themeDark: '#7655c2',
            themeDarker: '#573f8f',
            neutralLighterAlt: '#edecf8',
            neutralLighter: '#e9e8f4',
            neutralLight: '#dfdeea',
            neutralQuaternaryAlt: '#d0cfda',
            neutralQuaternary: '#c6c6d0',
            neutralTertiaryAlt: '#bfbec8',
            neutralTertiary: '#595959',
            neutralSecondary: '#373737',
            neutralPrimaryAlt: '#2f2f2f',
            neutralPrimary: '#000000',
            neutralDark: '#151515',
            black: '#0b0b0b',
            white: '#f3f2ff',
        },
    },
];

export default themes;
