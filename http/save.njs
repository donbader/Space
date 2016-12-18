#!/usr/local/bin/node

var querystring = require('../node_modules/querystring');
var para = querystring.parse(process.env.QUERY_STRING);
var mongoose = require('../node_modules/mongoose');


console.log('content-type:text/html; charset=utf-8\n');

var in_name = para.stu_name;
var in_id = para.stu_id;


console.log('你的名字:' + in_name +'<br>你的學號:' + in_id + '<br>注冊成功');
mongoose.connect('mongodb://wp2016_groupL:66666666@localhost/wp2016_groupL');
var db = mongoose.connection;




var StudentSchema = mongoose.Schema({
  name : String,
  idnum : String
  });


var Student = mongoose.model('Student', StudentSchema);

var element = new Student({name: in_name , idnum: in_id});



element.save(function(err,element){
  if (err) return console.error(err);
  });


mongoose.connection.close();
