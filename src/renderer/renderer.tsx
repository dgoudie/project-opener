import '@fontsource/roboto-slab';

import { BaseStyles, ThemeProvider, ThemeProviderProps } from '@primer/react';

import App from './App';
import { BRIDGE } from './bridge';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ipcRenderer } from 'electron';
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
  createRoot(document.getElementById('root')).render(
    <ThemeProvider colorMode={theme}>
      <BaseStyles>
        <App />
      </BaseStyles>
    </ThemeProvider>
  )
);
