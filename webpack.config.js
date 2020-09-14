const path = require('path');
const webpack = require('webpack');
const packageInfo = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/define.js',
  output: {
    filename: 'widget.js',
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/widget/',
  },
  context: __dirname,
  module: {
    rules: [
      // Svelte 3 loader
      {
        test: /\.svelte$/,
        use: ['svelte-loader'],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      }
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.html'],
    alias: {
      Components: '@widgetic/components/components',
      Utils: '@widgetic/components/utils',
      Services: '@widgetic/components/services',
      svelte: path.resolve('node_modules', 'svelte')
    },
  },
  externals: [
    function(context, request, callback) {
      if (/^(core\/|spine|editor)/.test(request))
        return callback(null, 'window.require("' + request + '")');
      callback();
    },
    { jquery: '$' },
  ],
  plugins: [
    new ExtractTextPlugin('widget.css'),
    new webpack.DefinePlugin({
      WIDGET_NAME: JSON.stringify(packageInfo.name),
      VERSION: JSON.stringify(packageInfo.version),
      NATIVE_CSS_VARIABLES: true,
    }),
  ],
};
