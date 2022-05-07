import { dialog } from 'electron';
import { mainWindow } from '../main';

export default async function promptForDirectory(): Promise<
  string | undefined
> {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}
