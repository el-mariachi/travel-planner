const HTMLWebpackPlugin = require('html-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        index: './src/client/index.js',
        form: './src/static/form.js',
        current: './src/static/current.js'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'Client',
        clean: true
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
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
                test: /\.ico$/i,
                use: [{ loader: 'file-loader' }]
            },
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
            chunks: ['index']
        }),
        new HTMLWebpackPlugin({
            template: './src/static/form.html',
            filename: 'form.html',
            chunks: ['form']
        }),
        new HTMLWebpackPlugin({
            template: './src/static/current.html',
            filename: 'current.html',
            chunks: ['current']
        })
        // new WorkboxPlugin.GenerateSW({
        //     exclude: [/\.(?:jpe?g|png)$/]
        // })
    ]
};