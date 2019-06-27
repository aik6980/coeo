const PATH = require('path');
const WEBPACK = require('webpack');

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
    }
};