import '@fontsource/roboto-slab';

import { BaseStyles, ThemeProvider } from '@primer/react';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { bridgeApis } from './bridge';

declare global {
    interface Window {
        bridgeApis?: typeof bridgeApis;
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
