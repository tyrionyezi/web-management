const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        bundle: path.resolve(__dirname, '../src/index.js'),
        //添加要打包在vendor里面的库
        vendors: ['react', 'react-dom', 'react-router-dom'],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name][hash].js'
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    plugins: [
                        // 引入样式为 css
                        ['import', { libraryName: 'antd', style: 'css' }],
                        // 改动: 引入样式为 less
                        //  ['import', { libraryName: 'antd', style: true }],
                    ]
                }
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.(png|jpg|gif)$/,
            //     use: [
            //       {
            //         loader: 'file-loader',
            //         options: {
            //             //编译出来是项目中对应图片文件夹的文件目录
            //             // name: 'images/[path][name].[ext]'  
            //             name: 'images/[hash].[ext]',//所有图片在一个目录
            //         }
            //       }
            //     ]
            //   }

            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[hash].[ext]',//所有图片在一个目录
                        }
                    }
                ]
            }
        ]
    },
    performance: {
        hints: false
    },
    resolve: {
        extensions: ['.js', '.jsx', 'json'],
        alias: {
            "@axios": path.resolve(__dirname, '..', 'config/axios'),
            "@utils": path.resolve(__dirname, '..', 'src/utils/index'),
            "@components": path.resolve(__dirname, '..', 'src/components')
        }
    },
    optimization: {
        // splitChunks: {
        //   cacheGroups: {
        //     commons: {
        //       test: /[\\/]node_modules[\\/]/,
        //       name: 'vendors',
        //       chunks: 'all'
        //     }
        //   }
        // }
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    // devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({//设置成production去除警告
            'process.env': {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './views/tpl/index.tpl.html',
            inject: 'body',
            hash: true,
        }),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        //     allChunks: true
        // }),
        new CleanWebpackPlugin(['dist',
            'build'], {
                root: __dirname,
                verbose: true,
                dry: false,
                exclude: ['jslibs']
            })
    ]
};