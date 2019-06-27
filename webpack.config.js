const PATH = require('path');
const WEBPACK = require('webpack');
const COPY_PLUGIN = require('copy-webpack-plugin');

module.exports = {
    entry: {
        game: './src/js/game/game.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/public/js'
    },
    plugins: [
        new COPY_PLUGIN([
            { from: './src/js/vendor', to: __dirname + '/public/js/vendor' },
            { from: './res', to: __dirname + '/public/game_assets' },
        ])
    ]
};