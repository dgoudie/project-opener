import '@fontsource/roboto-slab';

import { BaseStyles, ThemeProvider } from '@primer/react';

import App from './App';
import { BRIDGE } from './bridge';
import React from 'react';
import ReactDOM from 'react-dom';

declare global {
    interface Window {
        BRIDGE?: typeof BRIDGE;
    }
}

ReactDOM.render(
    <ThemeProvider colorMode='auto'>
        <BaseStyles>
            <App />
        </BaseStyles>
    </ThemeProvider>,
    document.getElementById('root')
);
