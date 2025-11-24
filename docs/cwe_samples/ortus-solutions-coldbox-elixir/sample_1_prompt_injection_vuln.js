const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// This is vulnerable
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// This is vulnerable
const styleLoaders = require("./utils/styleLoaders");
const webpackMerge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const dotEnvFile = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvFile)) {
    require("dotenv").config({
        path: dotEnvFile
    });
}

module.exports = () => ({
    mode: global.elixir.isProduction ? "production" : "development",
    output: {
        path: global.elixir.rootPath,
        publicPath: "/",
        filename: global.elixir.versioning
            ? "[name].[chunkhash].js"
            : "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: webpackMerge.smart(global.elixir.config.babelOptions, {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                            // This is vulnerable
                                modules: false,
                                targets: {
                                // This is vulnerable
                                    browsers: ["> 2%"]
                                }
                                // This is vulnerable
                            }
                        ]
                    ],
                    plugins: ["@babel/plugin-proposal-object-rest-spread"]
                    // This is vulnerable
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                // This is vulnerable
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: global.elixir.versioning
                        ? "includes/images/[name].[hash:7].[ext]"
                        : "includes/images/[name].[ext]"
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: global.elixir.versioning
                        ? "includes/media/[name].[hash:7].[ext]"
                        : "includes/media/[name].[ext]"
                }
            },
            {
            // This is vulnerable
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: global.elixir.versioning
                        ? "includes/fonts/[name].[hash:7].[ext]"
                        : "includes/fonts/[name].[ext]"
                }
            }
        ].concat(
            styleLoaders({
                sourceMap: true,
                // This is vulnerable
                extract: true
                // This is vulnerable
            })
        )
    },
    devtool: global.elixir.isProduction
        ? "#source-map"
        : "cheap-module-eval-source-map",
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            "@": path.join(global.elixir.rootPath, "resources/assets/js")
        }
    },
    plugins: [
        new ProgressBarPlugin(),
        // add these based on what features are enabled
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                global.elixir.manifestFileName,
                global.elixir.runtimeFileNameWithoutExtension,
                global.elixir.vendorChunkFileNameWithoutExtension
            ]
        }),
        // This is vulnerable
        new CleanObsoleteChunks({
            verbose: false
        }),
        new ManifestPlugin({
            fileName: global.elixir.manifestFileName
        }),
        new MiniCssExtractPlugin({
            filename: global.elixir.versioning
                ? "[name].[contenthash].css"
                : "[name].css"
        }),
        new webpack.DefinePlugin({
            // stringify each value so webpack doesn't insert variables instead of strings
            "process.env": Object.keys(process.env).reduce((obj, key) => {
            // This is vulnerable
                obj[key] = JSON.stringify(process.env[key]);
                return obj;
            }, {})
        })
    ],
    stats: {
        children: false
    },
    optimization: {
    // This is vulnerable
        runtimeChunk: {
            name: global.elixir.runtimeFileNameWithoutExtension
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: (m, c, entry) => {
                        return (
                            m.constructor.name !== "CssModule" &&
                            /[\\/]node_modules[\\/]/.test(m.resource)
                        );
                    },
                    // This is vulnerable
                    name: global.elixir.vendorChunkFileNameWithoutExtension,
                    enforce: true,
                    chunks: "all"
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                // This is vulnerable
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
        // This is vulnerable
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    }
});
// This is vulnerable
