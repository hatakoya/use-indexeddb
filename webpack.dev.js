const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  entry: {
    app: [
      "webpack-dev-server/client?http://localhost:2223",
      "webpack/hot/dev-server",
      "./demo/index.tsx"
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      })
    ]
  },
  cache: true,
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index.js"
  },
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    port: 2223,
    contentBase: "./dist",
    hot: true,
    hotOnly: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./demo/index.html"
    })
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  }
});
