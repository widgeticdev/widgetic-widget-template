const path = require('path');
const webpack = require('webpack');
const packageInfo = require('./package.json');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'widget.js',
    path: path.resolve(__dirname, 'lib')
  },
  mode,
  devtool: prod ? false: 'source-map',
  context: __dirname,
  module: {
    rules: [ 
      { // Svelte 3 loader
        test: /\.svelte$/,
        use: ['svelte-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.svelte', '.html'],
    alias: {
      Components: '@widgetic/components/components',
      Utils: '@widgetic/components/utils',
      Services: '@widgetic/components/services',
      svelte: path.resolve('node_modules', 'svelte')
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      WIDGET_NAME: JSON.stringify(packageInfo.name),
      VERSION: JSON.stringify(packageInfo.version),
      NATIVE_CSS_VARIABLES: true,
    }),
  ],
};
