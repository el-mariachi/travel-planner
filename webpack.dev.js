const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        index: './src/client/index.ts',
        // form: './src/static/form.js',
        // current: './src/static/current.js'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'Client',
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
                // options: {
                //     presets: ['@babel/env']
                // }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            },
            {
                test: /\.(jpe?g|png|svg)$/i,
                use: [{ loader: 'url-loader', options: { limit: 5000 } }]
            },
            {
                test: /\.(gif)$/i,
                use: [{ loader: 'url-loader', options: { limit: 5000, mimeType: 'image/gif' } }]
            },
            // {
            //     test: /\.ico$/i,
            //     use: [{ loader: 'file-loader' }]
            // },
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/client/views/index.html',
            // chunks: ['index'],
            favicon: 'src/client/media/favicon.png'
        }),
        // new HTMLWebpackPlugin({
        //     template: './src/static/form.html',
        //     filename: 'form.html',
        //     chunks: ['form']
        // }),
        // new HTMLWebpackPlugin({
        //     template: './src/static/current.html',
        //     filename: 'current.html',
        //     chunks: ['current']
        // }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
        // new WorkboxPlugin.GenerateSW({
        //     exclude: [/\.(?:jpe?g|png)$/]
        // })
    ]
};