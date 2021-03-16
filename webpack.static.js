const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/static/index.js',
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
                loader: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|svg)$/i,
                use: [{ loader: 'url-loader', options: { limit: 5000 } }]
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
            template: './src/static/index.html',
            filename: 'index.html',
        }),
        new HTMLWebpackPlugin({
            template: './src/static/current.html',
            filename: 'current.html',
        })
    ]
};