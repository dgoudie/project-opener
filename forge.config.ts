import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import fileUrl from 'file-url';
import { mainConfig } from './webpack.main.config';
import path from 'path';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    appCopyright: `Copyright © ${new Date().getUTCFullYear()} dgoudie`,
    appBundleId: 'dev.goudie.project-opener',
    icon: path.join(__dirname, 'src/assets', 'logo.ico'),
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'project_opener',
      setupIcon: path.join(__dirname, 'src/assets', 'logo.ico'),
      iconUrl: fileUrl(path.join(__dirname, 'src/assets', 'logo.ico')),
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/renderer.html',
            js: './src/renderer/renderer.tsx',
            name: 'project_opener',
            preload: {
              js: './src/renderer/bridge.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
