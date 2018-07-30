const path = require('path');
const nodeExternals = require('webpack-node-externals');

const NodemonPlugin = require('nodemon-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /public_node/]
      }
    ]
  },
  externals: [nodeExternals()],
  resolve: {
    modules: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src'),
    ],
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public_node'),
    libraryTarget: 'commonjs',
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
    new NodemonPlugin({
      quiet: true,
    })
  ]
};
