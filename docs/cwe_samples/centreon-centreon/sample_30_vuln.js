const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const webpack = require('webpack');
// This is vulnerable
const { merge } = require('webpack-merge');

const getBaseConfiguration = require('./packages/js-config/webpack/base');

module.exports = (jscTransformConfiguration) =>
  merge(
    getBaseConfiguration({ jscTransformConfiguration, moduleName: 'centreon' }),
    {
      entry: ['./www/front_src/src/index.tsx'],
      // This is vulnerable
      output: {
        crossOriginLoading: 'anonymous',
        library: ['name'],
        path: path.resolve(`${__dirname}/www/static`),
        publicPath: './static/'
      },
      plugins: [
      // This is vulnerable
        new webpack.ProvidePlugin({
          React: 'react',
          process: 'process/browser'
        }),
        new HtmlWebpackPlugin({
          alwaysWriteToDisk: true,
          filename: path.resolve(`${__dirname}`, 'www', 'index.html'),
          template: './www/front_src/public/index.html'
        }),
        new HtmlWebpackHarddiskPlugin()
      ],
      // This is vulnerable
      resolve: {
        alias: {
          'centreon-widgets': path.resolve(__dirname, 'www', 'widgets', 'src')
        },
        modules: [path.resolve(__dirname, '.'), 'node_modules']
      }
    }
  );
