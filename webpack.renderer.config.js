let rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isDevelopment = !!process.env.IS_DEVELOPMENT;

rules = [
    ...rules,
    {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    sourceMap: isDevelopment,
                    modules: {
                        localIdentName: isDevelopment
                            ? '[path][name]__[local]'
                            : '[hash:base64]',
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: isDevelopment,
                },
            },
        ],
    },
];
module.exports = {
    module: {
        rules,
    },
    plugins: [
        ...plugins,
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(
                        __dirname,
                        `.webpack/renderer/${
                            isDevelopment ? '' : 'main_window/'
                        }assets`
                    ),
                },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
        alias: {
            src: path.join(__dirname, 'src'),
        },
    },
};

// const rules = require('./webpack.rules');
// const plugins = require('./webpack.plugins');

// module.exports = (env, argv) => {
//   const isDevelopment = argv.mode === 'development'

//   return {
//     module: {
//       rules: [...rules,                 {
//         test: /\.module\.s(a|c)ss$/,
//         loader: [
//             MiniCssExtractPlugin.loader,
//             {
//                 loader: 'css-loader',
//                 options: {
//                     modules: true,
//                     sourceMap: isDevelopment
//                 }
//             },
//             {
//                 loader: 'sass-loader',
//                 options: {
//                     sourceMap: isDevelopment
//                 }
//             }
//         ]
//       },
//       {
//         test: /\.s(a|c)ss$/,
//         exclude: /\.module.(s(a|c)ss)$/,
//         loader: [
//             MiniCssExtractPlugin.loader,
//             'css-loader',
//             {
//                 loader: 'sass-loader',
//                 options: {
//                     sourceMap: isDevelopment
//                 }
//             }
//         ]
//       }],
//     },
//     plugins: plugins,
//     resolve: {
//       extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss']
//     },
//   };
// };
