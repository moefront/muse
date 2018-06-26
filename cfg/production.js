'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index.tsx'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.REACT_DIRSTO': '"anujs"'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.rules.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  include: [
    path.join(__dirname, '/../src')
  ]
});

module.exports = config;
