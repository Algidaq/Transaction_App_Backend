const path = require('path');
const nodeExternals = require('webpack-node-externals');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  target: 'node',
  entry: './src/app.ts',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'pack'),
  },
  optimization: { minimize: false },
  module: {
    rules: [{ test: /\.ts$/, use: ['ts-loader'] }],
  },
  mode: 'production',
  externals: [nodeExternals()],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts'],
  },
};
