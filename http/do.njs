#!/usr/local/bin/node

var querystring = require('querystring');
var para = querystring.parse(process.env.QUERY_STRING);
var database = require('./name.json');
var count = 0;


console.log('content-type:text/html; charset=utf-8\n');

for (i=0; i<database.groupmate.length;i++)
{
  if (para.number == database.groupmate[i].id)
  {
    console.log('<h1>Hello</h1><hr>' + 
                database.groupmate[i].id +
                database.groupmate[i].name);
    count++;
  }
}

if (count != 0)
{
  console.log('<br><h2>Weclome to the real world</h2>'); 
}
else 
{
  console.log('<h1>Who are you</h1>');
}
