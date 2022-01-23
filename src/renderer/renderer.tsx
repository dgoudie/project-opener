import '@fontsource/roboto-slab';

import { BaseStyles, ThemeProvider, ThemeProviderProps } from '@primer/react';

import App from './App';
import { BRIDGE } from './bridge';
import React from 'react';
import ReactDOM from 'react-dom';
import { settingsTable } from './indexed-db';

declare global {
    interface Window {
        BRIDGE?: typeof BRIDGE;
    }
}

Promise.all([
    settingsTable
        .get('THEME')
        .then(({ value }) => value as ThemeProviderProps['colorMode']),
]).then(([theme]) =>
    ReactDOM.render(
        <ThemeProvider colorMode={theme}>
            <BaseStyles>
                <App />
            </BaseStyles>
        </ThemeProvider>,
        document.getElementById('root')
    )
);
