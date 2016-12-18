#!/usr/local/bin/node

var querystring = require('../node_modules/querystring');
var para = querystring.parse(process.env.QUERY_STRING);
var mongoose = require('../node_modules/mongoose');


console.log('content-type:text/html; charset=utf-8\n');

var in_id = para.stu_id;

mongoose.connect('mongodb://wp2016_groupL:66666666@localhost/wp2016_groupL');
var db = mongoose.connection;


var StudentSchema = mongoose.Schema({
  name : String,
  idnum : String
  });


var Student = mongoose.model('Student', StudentSchema);

Student.findOne({idnum: para.stu_id}, function(err,doc){
  if (err) console.log(err);
  else console.log(doc.name + "<br>" + doc.idnum);
  });

mongoose.connection.close();
