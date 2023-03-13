const path=require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        library: "svz-accordion",
        globalObject: 'this'
    },
    devtool: "source-map",
    module: {
      rules: [
        { test: /\.(s*)css$/, 
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            'sass-loader',
            'postcss-loader',
          ],
          sideEffects: true
        },
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
    },
    plugins: [
      new MiniCssExtractPlugin({filename: 'styles.css'})
    ]
  };