'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const isProd = () => process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: !isProd(),
    allChunks: true
});

const cleanPlugin = isProd() ? new CleanWebpackPlugin(['dist']) : () => {};

module.exports = {
    devtool: isProd() ? false : 'eval-source-map',
    entry: {
        app: [path.join(__dirname, 'app', 'app.js')]
    },
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: ['react-hot-loader', 'babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer('last 45 versions')]
                    }
                }],
                fallback: 'style-loader'
            })
        }, {
            test: /\.(wav|mp3|jpg|png)$/,
            loader: 'file-loader'
        }]
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'app', 'index.html')
        }),
        cleanPlugin
    ],
    devServer: {
        port: 8080,
        historyApiFallback: true
    }
};
