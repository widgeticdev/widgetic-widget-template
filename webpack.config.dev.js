const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
  entry: ['webpack-hot-middleware/client', config.entry],
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules\/(?!@widgetic)/,
        use: {
          loader: 'svelte-loader',
          options: {
            hotReload: true,
            emitCss: true,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEVELOPMENT: true,
      PRODUCTION: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
