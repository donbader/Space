var express = require('express');
var app = express();

app.get('/',function(req,res){
  console.log('hihi');
  res.send();
});

app.get('/admin',function(req,res){
  console.log('admin');
  res.send();
});



app.listen(9487,function(){
  console.log('listening 9487');
  });


