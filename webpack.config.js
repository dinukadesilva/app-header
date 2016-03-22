// [name] under the output section denotes the entry prop names
module.exports = {
  entry: {
   dev_demo: ['webpack/hot/dev-server', './demo/src/demo.js'],
   dev_bundle: ['webpack/hot/dev-server', './main.js'],
   dist: ['./main.js']
  },
  output: {
    path: './',
    filename: 'build/[name].app-header.js'
  },
  contentBase: "./demo", // for webpack dev server
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
        exclude: /node_modules/
      }
    ]
  }
};
