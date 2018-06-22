'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',  // 局部修改页面
        'react-hot-loader/patch',
        path.join(__dirname, './app/index.js')
    ],
    output: {
        path: path.join(__dirname, './dist/'),
        filename: '[name].js',
        publicPath: '/',
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.tpl.html',
            inject: 'body',
            filename: './index.html'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        rules: [   // webpack1使用loaders,webpack2使用rules
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',   // 将es6转成es5
                query:
                  {
                    presets: ['react','es2015']
                  }
            },
            {
                test: /\.css$/,
                loader: 'style!css!postcss'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    }
}
