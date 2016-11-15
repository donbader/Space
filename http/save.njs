#!/usr/local/bin/node

var querystring = require('../node_modules/querystring');
var para = querystring.parse(process.env.QUERY_STRING);
var mongoose = require('../node_modules/mongoose');








mongoose.connect('mongodb://wp2016_groupL:66666666@localhost/wp2016_groupL');
var db = mongoose.connection;



console.log('content-type:text/html; charset=utf-8\n');

var in_name = para.stu_name;
var in_id = para.stu_id;


var StudentSchema = mongoose.Schema({
  name : String,
  idnum : String
  });

var Student = mongoose.model('Student', StudentSchema);

var element = new Student({name: in_name , idnum: in_id});
console.log(in_name +'and' + in_id);

element.save(function(err,element){
  console.log("HIHIHI");
  if (err) return console.error(err);
  });

