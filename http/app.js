var express = require('express');
var app = express();

app.get('/',function(req,res){
  console.log('hihi');
  res.send('Hello World!');
});

app.listen(9487,function(){
  console.log('listening 9487');
  });


