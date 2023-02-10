import '@fontsource/roboto-slab';
import '@fontsource/source-sans-pro';

import {
  BaseStyles,
  ThemeProvider,
  ThemeProviderProps,
  theme,
} from '@primer/react';

import App from './App';
import { BRIDGE } from './bridge';
import React from 'react';
import { createRoot } from 'react-dom/client';
import deepmerge from 'deepmerge';
import { ipcRenderer } from 'electron';
import { settingsTable } from './indexed-db';

declare global {
  interface Window {
    BRIDGE?: typeof BRIDGE;
  }
}

const customTheme = deepmerge(theme, {
  fonts: {
    normal: "'Source Sans Pro', sans-serif;",
  },
});

Promise.all([
  settingsTable
    .get('THEME')
    .then(({ value }) => value as ThemeProviderProps['colorMode']),
]).then(([theme]) =>
  createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={customTheme} colorMode={theme}>
      <BaseStyles>
        <App />
      </BaseStyles>
    </ThemeProvider>
  )
);
