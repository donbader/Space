// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var webpack = require('webpack');


var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.dev.config.js');


// Routes
var index = require('./routes/index');
var signup = require('./routes/signup');
var Upload = require('./routes/upload');
var Modify = require('./routes/modify')

// App
var app = express();

var compiler = webpack(config);


app.use(webpackDevMiddleware(compiler,{
  publicPath: config.output.publicPath,
  stats: { colors: true }
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}))


// Add path
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));

app.use(favicon(__dirname + '/public/images/left_top_logo.ico'));


// Route Service
app.use('/', index);
app.use('/SignUp', signup);
app.use('/upload', Upload);
app.use('/Modify', Modify);


module.exports = app;
