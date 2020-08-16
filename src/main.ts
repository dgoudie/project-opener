import { BrowserWindow, app } from 'electron';
import { setupServices, tearDownServices } from 'src/main-utils/ipc-listeners';

import isDev from 'electron-is-dev';
import path from 'path';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const gotTheLock = app.requestSingleInstanceLock();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

if (require('electron-squirrel-startup') || !gotTheLock) {
    app.quit();
} else {
    const createWindow = () => {
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            title: 'project-opener',
            width: 1200,
            height: 700,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
            },
            icon: path.join(__dirname, 'logo.ico'),
            frame: false,
            resizable: false,
            movable: true,
            fullscreenable: false,
        });

        // and load the index.html of the app.
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

        // Open the DevTools.
        !!isDev && mainWindow.webContents.openDevTools();

        app.on('second-instance', () => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainWindow) {
                mainWindow.show();
                mainWindow.focus();
            }
        });
    };

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
        setupServices();
        createWindow();
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and import them here.

    app.on('quit', () => {
        tearDownServices();
    });
}