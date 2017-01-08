var express = require('express');
var path = require('path');
var User = require('./../db/user');
var router = express.Router();
var querystring = require("querystring");
var mongoose = require('mongoose');



/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(req.session.isVisit);
    console.log("[GET] '/'");
    res.sendFile(path.join(__dirname, '../view', 'index.html'));
    console.log(path.join(__dirname, '../view', 'upload.html'));

});


router.post('/login', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var para = querystring.parse(body);
        var name = para.Account;
        var password = para.Password;

        User.findOne({
            "name": name
        }, 'password', function(err, user) {
            if (err) return console.log(err);
            if (user == null || user.password != password)
                res.send({
                    msg: "fail"
                });
            else
                res.send({
                    msg: "success",
                    "id": name
                });
        });
    })
});



router.get('/About', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'About.html'));
});

router.get('/GameTest', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'GameTest.html'));
});

router.get('/GameInterface', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'GameInterface.html'));
});

router.get('/SocketTest', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'SocketTest.html'));
});

router.get('/SocketTest0', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'SocketTest0.html'));
});

router.get('/Paint', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'Paint.html'));
});

router.get('/Webcam', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'Webcam.html'));
});

router.get('/WebcamCanvas', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'WebcamCanvas.html'));
});





module.exports = router;
