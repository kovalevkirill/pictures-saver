const path = require('path');
const webpack = require('webpack');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './client/index.js',
    output: {path: __dirname + '/views', filename: 'bundle.js'},
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-2', 'react']
                }
            }
        ]
    }/*,
     plugins: [
     new UglifyJSPlugin()
     ]*/
};