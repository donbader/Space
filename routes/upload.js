var Item = require('./../db/item');
var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var querystring = require("querystring");

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'Upload.html'));
});

router.post('/do', function(req, res) {

  var body = '';
  req.on('data', function(data) {
      body += data;
  });
  req.on('end', function() {

      var para = JSON.parse(body);

      var id = para.id;
      var type = para.type;
      var data = para.data;

      var element = new Item({
          "id": id,
          "type": type,
          "data": data
      });



    element.save(function(err, element) {
        if (err) return console.error(err);
      });

    res.send("success");

  })
});


module.exports = router;
