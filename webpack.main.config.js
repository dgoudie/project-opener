const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/main.ts',
    // Put your normal webpack config below here
    module: {
        rules: [
            ...require('./webpack.rules'),
            {
                test: /\.(jpe?g|png|svg|ico|icns)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/logo.ico'),
                    to: path.resolve(__dirname, '.webpack/main'),
                },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
};
