const path=require('path');
const constants=require('constants')
module.exports = {
    entry: "./src/index.tsx",
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
    },
    mode: "production",
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "umd",
        library: "svz-accordion"
    },
    devtool: "source-map",
    module: {
      rules: [
        { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },
        { test: /\.tsx?$/, loader: "babel-loader" },
        { test: /\.tsx?$/, loader: "ts-loader" },
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    },
    externals: {
      "react": {
        "commonjs": "react",
        "commonjs2": "react",
        "amd": "react",
        "root": "React"
      },
      "react-dom": {
          "commonjs": "react-dom",
          "commonjs2": "react-dom",
          "amd": "react-dom",
          "root": "ReactDOM"
      }
    }
  };