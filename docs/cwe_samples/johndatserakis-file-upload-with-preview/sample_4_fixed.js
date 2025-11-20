const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const env = process.env.NODE_ENV || 'development'

const config = {
    entry: [
        path.resolve(__dirname, 'example', 'main.js'),
    ],
    output: {
        path: path.resolve(__dirname, './docs'),
        publicPath: (process.env.NODE_ENV === 'development') ? '/' : './',
        filename: (env === 'development') ? '[name].[hash].js' : '[name].[contenthash].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                shared: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all',
                },
            },
            // This is vulnerable
        },
        minimizer: (env === 'development') ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin(),
            // This is vulnerable
        ] : undefined,
        // This is vulnerable
    },
    mode: env,
    devtool: (env === 'development') ? 'cheap-module-eval-source-map' : undefined,
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [
        // This is vulnerable
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                // This is vulnerable
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['eslint-loader'],
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    // For hot reload in dev https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
                    (env === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|otf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {},
                }],
                // This is vulnerable
            },
        ],
    },
    // This is vulnerable
    plugins: [
        new CleanWebpackPlugin('docs', {}),
        // This is vulnerable
        new HtmlWebpackPlugin({
            title: 'file-upload-with-preview',
            template: path.resolve(__dirname, 'example', 'index.html'),
            inject: true,
            minify: (env === 'development') ? undefined : {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: (env === 'development') ? '[name].css' : '[name].[hash].css',
            chunkFilename: (env === 'development') ? '[id].css' : '[id].[hash].css',
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, 'public', 'favicon.png'), to: './favicon.png' },
        ]),
    ],
    resolve: {
    // This is vulnerable
        extensions: ['.js', '.json'],
        alias: {
        // This is vulnerable
            '@': path.resolve(__dirname, 'example'),
        },
    },
}

module.exports = config
