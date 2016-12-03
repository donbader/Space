var express = require('express');
var path = require('path');
var router = express.Router();
var login = require('../db/login');	
var querystring = require("querystring");

/* GET home page. */
router.get('/', function(req, res, next){
	console.log("[GET] '/'")
	res.sendFile(path.join(__dirname, '../', 'index.html'));
  console.log(path.join(__dirname, '../', 'index.html'));
});

router.post('/login', function(req, res){
	var body = '';
	req.on('data', function(data){
		body+=data;
	});
	req.on('end',function(){
		querystring.parse(body);
		//console.log(body);
	})
	res.send(body);
});



router.get('/About', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'About.html'));
});

router.get('/Modify', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'Modify.html'));
});

router.get('/GameTest', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'GameTest.html'));
});

router.get('/GameInterface', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'GameInterface.html'));
});

module.exports = router;
