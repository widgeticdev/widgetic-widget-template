const path = require('path');
const webpack = require('webpack');
const packageInfo = require('./package.json');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
      },
      { // CSS loader
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader'],
          fallback: 'style-loader',
        }),
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
    new ExtractTextPlugin('widget.css'),
    new webpack.DefinePlugin({
      WIDGET_NAME: JSON.stringify(packageInfo.name),
      VERSION: JSON.stringify(packageInfo.version),
      NATIVE_CSS_VARIABLES: true,
    }),
  ],
};
