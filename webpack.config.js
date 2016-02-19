var path = require("path");
var webpack = require('webpack');
var CommonsPlugin = new require("webpack/lib/optimize/CommonsChunkPlugin")


var entry_points = {
  common: [
  ],
  "options": path.resolve("spectrum-chrome/src/options.js"),
  "popup": path.resolve("spectrum-chrome/src/popup.js"),
  "background-script": path.resolve("spectrum-chrome/src/background-script.js"),
  "content-script": path.resolve("spectrum-chrome/src/content_scripts/content-script.js"),
  "spectrum": path.resolve("spectrum-chrome/src/content_scripts/spectrum.js")

}
var config = {
  context: __dirname,
  entry: entry_points,
  output: {
      path: path.resolve('./spectrum-chrome/bundles/'),
      filename: "[name].bundle.js"
  },
  resolve: {
    modulesDirectories: [
      'node_modules'
    ],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      }
    ],
    noParse: /\.min\.js/
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    new CommonsPlugin({
      "minChunks": 3,
      name: "common",
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
    })
  ];
} else {
  config.devtool = 'cheap-module-source-map';
  config.plugins = [
    new CommonsPlugin({
      "minChunks": 3,
      name: "common",
    })
  ];
}

module.exports = config;
