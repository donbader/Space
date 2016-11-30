var User = require('./user');
var querystring = require('querystring');
var url = require('url');



exports.doFinal = function(req, res){



///////////////////////////////////////////
var preparse = '';
for (i=5; i<req.length; i++)
	preparse = preparse + req[i];

//Due to some reasons , it need to be pre-parse.

///////////////////////////////////////////



var para = querystring.parse(preparse);
var in_password = para.password;
var in_name = para.account;


console.log(para);


var element = new User({
	name: in_name ,
	id: "laochanlam" ,
	password: in_password });


element.save(function(err,element){
  if (err) return console.error(err);
  });



}
