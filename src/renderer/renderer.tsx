import '@fontsource/roboto-slab';

import { BaseStyles, ThemeProvider } from '@primer/react';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <ThemeProvider colorMode='auto'>
        <BaseStyles>
            <App />
        </BaseStyles>
    </ThemeProvider>,
    document.getElementById('root')
);
