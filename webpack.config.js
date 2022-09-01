const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: path.join(__dirname, './src/main.js'),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: 'bundle.js'
  },
  devServer: {
    static: path.resolve(__dirname, './src'),
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm-browser.js"
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      showErrors: true, 
      cache: false,
      template: path.join(__dirname, './index.html'),
    })
  ]
}