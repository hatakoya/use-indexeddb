const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx", "scss"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
  },
  optimization: {
    minimize: false // <---- disables uglify.
    // minimizer: [new UglifyJsPlugin()] if you want to customize it.
  },
  module: {
    rules: [
      // {
      //   test: /\.(jsx?)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: "babel-loader",
      //       options: {
      //         presets: [
      //           ["@babel/react"],
      //           [
      //             "@babel/env",
      //             {
      //               useBuiltIns: "usage",
      //               corejs: 3,
      //               modules: false
      //             }
      //           ]
      //         ],
      //         cacheDirectory: true
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          experimentalWatchApi: true
        }
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
};
