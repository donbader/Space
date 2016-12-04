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
//var user = require('./routes/user'); //front-end json

// Route Service
app.use('/', index);

app.use('/SignUp',signup);




module.exports = app;
