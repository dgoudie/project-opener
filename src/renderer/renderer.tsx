import '@fontsource/roboto-slab';

import { BaseStyles, ThemeProvider } from '@primer/react';

import App from './App';
import { BRIDGE_APIS } from './bridge';
import React from 'react';
import ReactDOM from 'react-dom';

declare global {
    interface Window {
        BRIDGE_APIS?: typeof BRIDGE_APIS;
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
