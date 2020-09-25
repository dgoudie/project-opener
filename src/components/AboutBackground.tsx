import { keyframes, mergeStyleSets } from '@fluentui/react';

import { AppTheme } from 'src/types';
import React from 'react';

interface Props {
    theme: AppTheme;
}

export default function AboutBackground({ theme }: Props) {
    const classes = buildClasses(theme);
    return (
        <svg
            version='1.1'
            id='home-anim'
            x='0px'
            y='0px'
            viewBox='0 0 1820 1080'
            className={classes.root}
        >
            <g className={classes.home}>
                <defs>
                    <rect id='masque' y='0.4' width='1820' height='1080' />
                </defs>
                <g className={classes.secondary2}>
                    <line x1='630.8' y1='894.3' x2='476.3' y2='1048.8' />
                    <line x1='1294.3' y1='387.8' x2='1448.8' y2='233.3' />
                    <line x1='1503' y1='22.1' x2='1348.5' y2='176.6' />
                    <line x1='895.6' y1='1166.6' x2='1050.1' y2='1012.1' />
                    <line x1='1104.3' y1='800.9' x2='949.8' y2='955.4' />
                    <line x1='1331.7' y1='730.5' x2='1486.2' y2='576' />
                    <line x1='1540.4' y1='364.8' x2='1385.9' y2='519.3' />
                    <line x1='1767.8' y1='294.4' x2='1922.3' y2='139.9' />
                    <line x1='1976.5' y1='-71.3' x2='1822' y2='83.2' />
                    <line x1='1369.1' y1='1073.2' x2='1523.6' y2='918.7' />
                    <line x1='1577.8' y1='707.5' x2='1423.3' y2='862' />
                    <line x1='1805.2' y1='637.1' x2='1959.7' y2='482.6' />
                    <line x1='1624' y1='1041.4' x2='1469.4' y2='1195.9' />
                    <line x1='-134.7' y1='674.9' x2='19.8' y2='520.4' />
                    <line x1='74' y1='309.2' x2='-80.5' y2='463.7' />
                    <line x1='301.4' y1='238.8' x2='455.9' y2='84.3' />
                    <line x1='510.1' y1='-126.9' x2='355.6' y2='27.6' />
                    <line x1='-88.6' y1='1008.9' x2='65.9' y2='854.4' />
                    <line x1='120.1' y1='643.1' x2='-34.4' y2='797.7' />
                    <line x1='317.5' y1='602.8' x2='472' y2='448.3' />
                    <line x1='556.2' y1='207.1' x2='401.7' y2='361.6' />
                    <line x1='783.6' y1='136.7' x2='938.1' y2='-17.8' />
                    <line x1='157.6' y1='985.8' x2='3' y2='1140.3' />
                    <line x1='384.9' y1='915.5' x2='539.4' y2='760.9' />
                    <line x1='1029.7' y1='113.6' x2='875.2' y2='268.2' />
                    <line x1='1257.1' y1='43.3' x2='1411.6' y2='-111.2' />
                </g>
                <g className={classes.secondary1}>
                    <line x1='794.4' y1='883.4' x2='639.8' y2='1037.9' />
                    <line x1='1230.4' y1='447.3' x2='1075.9' y2='601.8' />
                    <line x1='1130.7' y1='398.7' x2='1285.2' y2='244.2' />
                    <line x1='1666.5' y1='11.2' x2='1512' y2='165.7' />
                    <line x1='732' y1='1177.5' x2='886.6' y2='1023' />
                    <line x1='1267.9' y1='790' x2='1113.3' y2='944.5' />
                    <line x1='1168.1' y1='741.4' x2='1322.7' y2='586.9' />
                    <line x1='1703.9' y1='353.9' x2='1549.4' y2='508.4' />
                    <line x1='1604.2' y1='305.3' x2='1758.7' y2='150.8' />
                    <line x1='1205.5' y1='1084.1' x2='1360.1' y2='929.6' />
                    <line x1='1741.4' y1='696.5' x2='1586.8' y2='851.1' />
                    <line x1='1641.6' y1='648' x2='1796.2' y2='493.5' />
                    <line x1='1787.5' y1='1030.5' x2='1633' y2='1185' />
                    <line x1='1687.8' y1='981.9' x2='1842.3' y2='827.4' />
                    <line x1='200.1' y1='-44.4' x2='45.6' y2='110.1' />
                    <line x1='237.5' y1='298.3' x2='83' y2='452.8' />
                    <line x1='137.8' y1='249.7' x2='292.3' y2='95.2' />
                    <line x1='673.6' y1='-137.8' x2='519.1' y2='16.7' />
                    <line x1='283.7' y1='632.2' x2='129.2' y2='786.8' />
                    <line x1='184' y1='583.7' x2='338.5' y2='429.2' />
                    <line x1='719.8' y1='196.2' x2='595.2' y2='320.7' />
                    <line x1='620' y1='147.6' x2='774.6' y2='-6.9' />
                    <line x1='321.1' y1='974.9' x2='166.6' y2='1129.4' />
                    <line x1='221.4' y1='926.4' x2='375.9' y2='771.8' />
                    <line x1='1083.3' y1='182.7' x2='938.7' y2='327.3' />
                    <line x1='1093.5' y1='54.2' x2='1248.1' y2='-100.3' />
                </g>
                <g className={classes.primary}>
                    <line x1='225.8' y1='1151' x2='534.9' y2='841.9' />
                    <line x1='827.1' y1='1003.3' x2='518' y2='1312.3' />
                    <line x1='1263.1' y1='567.2' x2='954.1' y2='876.3' />
                    <line x1='1098' y1='278.8' x2='1407.1' y2='-30.2' />
                    <line x1='1699.2' y1='131.1' x2='1390.2' y2='440.2' />
                    <line x1='699.3' y1='1057.6' x2='1008.4' y2='748.5' />
                    <line x1='1300.6' y1='909.9' x2='991.5' y2='1218.9' />
                    <line x1='1135.4' y1='621.5' x2='1444.5' y2='312.4' />
                    <line x1='1736.6' y1='473.8' x2='1427.6' y2='782.8' />
                    <line x1='1571.5' y1='185.4' x2='1880.6' y2='-123.6' />
                    <line x1='1172.8' y1='964.2' x2='1481.9' y2='655.1' />
                    <line x1='1774.1' y1='816.5' x2='1465' y2='1125.5' />
                    <line x1='1608.9' y1='528.1' x2='1918' y2='219' />
                    <line x1='1219' y1='1298.1' x2='1528' y2='989.1' />
                    <line x1='1655.1' y1='862' x2='1964.1' y2='553' />
                    <line x1='232.8' y1='75.5' x2='-76.2' y2='384.6' />
                    <line x1='270.2' y1='418.2' x2='-38.8' y2='727.3' />
                    <line x1='105.1' y1='129.8' x2='414.2' y2='-179.2' />
                    <line x1='706.3' y1='-17.9' x2='397.3' y2='291.2' />
                    <line x1='-284.8' y1='899.9' x2='24.2' y2='590.8' />
                    <line x1='316.4' y1='752.2' x2='7.3' y2='1061.2' />
                    <line x1='151.3' y1='463.8' x2='460.3' y2='154.7' />
                    <line x1='587.3' y1='27.7' x2='896.4' y2='-281.4' />
                    <line x1='1188.6' y1='-120' x2='879.5' y2='189' />
                    <line x1='-247.4' y1='1242.5' x2='61.6' y2='933.5' />
                    <line x1='188.7' y1='806.4' x2='467.7' y2='527.4' />
                    <line x1='674.8' y1='320.4' x2='933.8' y2='61.3' />
                    <line x1='1662.1' y1='-213.4' x2='1353' y2='95.6' />
                </g>
            </g>
        </svg>
    );
}

const draw = keyframes({ to: { strokeDashoffset: '0' } });

const show = keyframes({
    '0%': { opacity: 0.5 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.5 },
});

const buildClasses = (theme: AppTheme) => {
    return mergeStyleSets({
        root: {
            position: 'absolute',
            bottom: 70,
            pointerEvents: 'none',
        },
        home: { clipPath: 'url(#cache)' },
        primary: {
            fill: 'none',
            stroke: theme.semanticColors.primaryButtonBackground,
            strokeWidth: '12',
            strokeMiterlimit: '10',
            animationName: show,
            animationDuration: '4s',
            animationFillMode: 'forwards',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
        },
        secondary1: {
            fill: 'none',
            stroke: theme.semanticColors.bodyBackgroundHovered,
            strokeWidth: '12',
            strokeMiterlimit: '10',
            animationName: show,
            animationDuration: '4s',
            animationFillMode: 'forwards',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
        },
        secondary2: {
            fill: 'none',
            stroke: theme.semanticColors.bodyDivider,
            strokeWidth: '6',
            strokeMiterlimit: '10',
            strokeDasharray: '200',
            strokeDashoffset: '800',
            animationName: draw,
            animationDuration: '4s',
            animationFillMode: 'forwards',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
        },
    });
};
