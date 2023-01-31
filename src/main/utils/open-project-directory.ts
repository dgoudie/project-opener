import { BrowserWindow } from 'electron';
import { REPORT_EXCEPTION } from '../../constants/ipc-renderer-constants';
import fs from 'fs';
import openExplorer from 'open-file-explorer';
import path from 'path';

const openProjectDirectory = (projectPath: string, window: BrowserWindow) => {
  const directory = path.dirname(projectPath);
  if (!fs.existsSync(directory)) {
    window.webContents.send(
      REPORT_EXCEPTION,
      'warning',
      'Directory not found.'
    );
    return;
  }
  openExplorer(directory);
};

export default openProjectDirectory;
