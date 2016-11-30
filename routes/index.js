var express = require('express');
var path = require('path');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next){
	console.log("[GET] '/'")
	res.sendFile(path.join(__dirname, '../', 'index.html'));
  console.log(path.join(__dirname, '../', 'index.html'));
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
