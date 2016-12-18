var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './app.js'
    ],
    output: {
        path: '/',
        publicPath: 'http://localhost:3001/scripts/',
        filename: '[name].js'
    },
    module: {
        preLoaders: [{
            test: /\.json$/,
            loader: 'json'
        }   ],
        loaders: [{
            test: /\.css$/,
            loader: 'style!css',

        }]
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
