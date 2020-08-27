const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules\/(?!@widgetic)/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEVELOPMENT: false,
      PRODUCTION: true,
    }),
  ],
});
