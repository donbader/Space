var Item = require('./../db/item');
var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'Upload.html'));
});

router.get('/do', function(req, res) {
    console.log("here");
    // element.save(function(err, element) {
    //     if (err) return console.error(err);

    res.send("hi");
    //  });
});


module.exports = router;
