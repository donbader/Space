// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

// Routes
var index = require('./routes/index');


// App
var app = express();


// Add path
app.use(express.static(path.join(__dirname, 'public')));


// Route Service
app.use('/', index);




module.exports = app;
