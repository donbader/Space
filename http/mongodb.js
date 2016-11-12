#!/usr/local/bin/node

var querystring = require('querystring');
var para = querystring.parse(process.env.QUERY_STRING);
var database = require('./name.json');


var express = require('express');
var mongoose = require('mongoose');
var app = express();
mongoose.connect('mongodb://wp2016_groupL:66666666@localhost/wp2016_groupL');
var db = mongoose.connection;

app.get('/',function(req,res){
  res.send("hello");
});

db.on('error',console.error.bind(console,'connection error:'));
db.once('open', function callback(){
  console.log('fk');
  });

app.listen(9487,function(){
  console.log('listening 9487');
  });

var kittySchema = mongoose.Schema({
    name: String
  });


kittySchema.methods.speak = function(){
  var greeting = this.name ? "I am " + this.name : "Who am I" ;
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);


var lam = new Kitten({ name: 'lam'});
console.log(lam.name);

lam.speak();

lam.save(function(err,lam){
  if (err) return console.error(err);
  lam.speak();
});

Kitten.find(function (err,kittens){
  if (err) return console.error(err);
  console.log(kittens);
  });
