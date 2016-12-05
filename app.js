// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

// Routes
var index = require('./routes/index');
var signup = require('./routes/signup');


// App
var app = express();


// Add path
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));

app.use(favicon(__dirname + '/public/images/left_top_logo.ico'));


// Route Service
app.use('/', index);
app.use('/SignUp', signup);




module.exports = app;
