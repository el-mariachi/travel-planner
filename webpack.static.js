const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/static/index.js',
    output: {
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
            template: './src/static/index.html'
        }),
    ]
};