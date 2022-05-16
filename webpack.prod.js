const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.ts',
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new CSSMinimizerPlugin()]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(jpe?g|png|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: { limit: 500 }
                }]
            },
            {
                test: /\.(gif)$/i,
                use: [{ loader: 'url-loader', options: { limit: 5000, mimeType: 'image/gif' } }]
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                    // , {
                    //     loader: 'sass-resources-loader',
                    //     options: {
                    //         resources: ['./src/client/styles/vars.scss']
                    //     }
                    // }
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/client/views/index.html',
            favicon: 'src/client/media/favicon.png'
        }),
        new MiniCssExtractPlugin(),
        // new WorkboxPlugin.GenerateSW({
        //     exclude: [/\.(?:jpe?g|png)$/]
        // })
    ]
};