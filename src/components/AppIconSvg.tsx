import { MotionAnimations, MotionDurations } from '@uifabric/fluent-theme';

import { AppTheme } from 'src/types';
import React from 'react';

interface Props {
    style?: React.CSSProperties;
    theme: AppTheme | null;
}

export default function AppIconSvg({ style, theme }: Props) {
    if (!theme) {
        return null;
    }
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            style={{
                ...style,
                animation: MotionAnimations.fadeIn,
                animationDuration: MotionDurations.duration4,
            }}
            viewBox='0 0 400 300'
        >
            <g>
                <title>background</title>
                <rect
                    fill={theme.semanticColors.primaryButtonBackground}
                    id='canvas_background'
                    height='302'
                    width='402'
                    y='-1'
                    x='-1'
                />
                <g
                    display='none'
                    overflow='visible'
                    y='0'
                    x='0'
                    height='100%'
                    width='100%'
                    id='canvasGrid'
                >
                    <rect
                        fill='url(#gridpattern)'
                        strokeWidth='0'
                        y='0'
                        x='0'
                        height='100%'
                        width='100%'
                    />
                </g>
            </g>
            <g>
                <line
                    stroke={theme.semanticColors.primaryButtonText}
                    id='svg_1'
                    y2='155'
                    x2='100'
                    y1='100'
                    x1='150'
                    strokeWidth='20'
                    fill='none'
                />
                <line
                    stroke={theme.semanticColors.primaryButtonText}
                    id='svg_3'
                    y2='200'
                    x2='150'
                    y1='142'
                    x1='100'
                    strokeWidth='20'
                    fill='none'
                />
                <line
                    stroke={theme.semanticColors.primaryButtonText}
                    id='svg_5'
                    y2='155'
                    x2='300'
                    y1='100'
                    x1='250'
                    strokeWidth='20'
                    fill='none'
                />
                <line
                    stroke={theme.semanticColors.primaryButtonText}
                    id='svg_6'
                    y2='200'
                    x2='250'
                    y1='142'
                    x1='300'
                    strokeWidth='20'
                    fill='none'
                />
                <line
                    id='svg_7'
                    y2='220'
                    x2='167.558139'
                    y1='80'
                    x1='232.441854'
                    fillOpacity='null'
                    strokeOpacity='null'
                    strokeWidth='20'
                    stroke={theme.semanticColors.primaryButtonText}
                    fill='none'
                />
            </g>
        </svg>
    );
}
