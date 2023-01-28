import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src', 'assets'),
        to: path.resolve(__dirname, '.webpack/renderer', 'assets'),
      },
    ],
  })
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
