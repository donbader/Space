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
var user = require('./routes/user'); //front-end json

// Route Service
app.use('/', index);


app.get('/index/add',user.UserAdd); //add		
 /*app.post('/index/add',index.doUserAdd); //submit		
 app.get('/index/:id',index.userAdd); //edit		
 app.get('/index/json/:id',index.userJSON); //require*/



module.exports = app;
