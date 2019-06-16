const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    library: 'mylib2',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // https://medium.com/@JakeXiao/window-is-undefined-in-umd-library-output-for-webpack4-858af1b881df
    globalObject: "this" //!!!This line
  },
  plugins: [new PeerDepsExternalsPlugin()],
})
