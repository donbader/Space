// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var helmet = require('helmet');
// Routes
var index = require('./routes/index');
var signup = require('./routes/signup');
var Upload = require('./routes/upload');
var Modify = require('./routes/modify');
var session = require('express-session');

// App
var app = express();


// Add path
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'view')));



// app.use(session({
//   secret: 'ActuallyIReallyDontKnowWhyLamIsFuckingHandsome'
// }));



app.use(favicon(__dirname + '/public/images/left_top_logo.ico'));
app.use(helmet());

// Route Service
app.use('/', index);
app.use('/SignUp', signup);
// // app.use('/upload', Upload);
app.use('/Modify', Modify);


module.exports = app;
