import * as path from 'path';

import { BrowserWindow, app } from 'electron';

import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        title: 'project-opener',
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
        frame: false,
        resizable: false,
        movable: true,
        fullscreenable: false,
        icon: 'src/icon.ico'
    });
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:8080'
            : `file://${path.join(__dirname, 'index.html')}`
    );
    mainWindow.on('closed', () => mainWindow.destroy());
    if (!isDev) {
        mainWindow.setMenu(null);
    }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
    app.on('ready', createWindow);
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
}
