var express = require('express');
var path = require('path');
var router = express.Router();

var register = require('../db/register');

router.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'SignUp.html'));
});

router.get('/add', function(req, res){
	register.doFinal(req.url);
    res.redirect('/');
});


module.exports = router;
