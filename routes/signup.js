var express = require('express');
var path = require('path');
var User = require('./../db/user');
var router = express.Router();
var querystring = require("querystring");
var mongoose = require('mongoose');



router.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'SignUp.html'));
});

router.post('/add', function(req, res){
	var body = '';
	req.on('data', function(data){
		body+=data;
	});
	req.on('end',function(){

		var para = querystring.parse(body);
		var in_password = para.Password;
		var in_name = para.Account;

		var element = new User({
			name: in_name ,
			password: in_password
		 });

	User.findOne({ name : in_name },  function (err, user) {
	  		if (err) return console.log(err);
	  		if (user == null) {
	  			element.save(function(err,element){
	  			if (err) return console.error(err);
	  			res.send({msg:"success"});
	  			});
	  		}
	  		else
	  			res.send({msg:"fail"});
		});

	})

});


module.exports = router;
