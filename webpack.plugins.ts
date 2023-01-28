import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins: any[] = [
  new ForkTsCheckerWebpackPlugin({
    logger: {
      infrastructure: 'webpack-infrastructure',
    },
  }),
];
