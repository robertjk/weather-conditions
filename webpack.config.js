var path = require('path');

module.exports = {
    entry: './app/src/main.js',
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [ 'es2015' ]
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'app/build'),
        filename: 'main.bundle.js'
    }
};
