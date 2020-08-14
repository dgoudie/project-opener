const path = require('path');

module.exports = {
    packagerConfig: {
        appCopyright: `Copyright © ${new Date().getUTCFullYear()} dgoudie`,
        appBundleId: 'dev.goudie.project-opener',
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'project_opener',
                setupIcon: path.join(__dirname, 'src/assets', 'logo.ico'),
                iconUrl: path.join(__dirname, 'src/assets', 'logo.ico'),
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: './webpack.main.config.js',
                renderer: {
                    config: './webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './src/index.html',
                            js: './src/index.tsx',
                            name: 'main_window',
                        },
                    ],
                },
            },
        ],
    ],
};
