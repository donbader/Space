var express = require('express');
var path = require('path');
var User = require('./../db/user');
var router = express.Router();
var querystring = require("querystring");
var mongoose = require('mongoose');



router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'Modify.html'));
});

router.post('/edit', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {

        var para = querystring.parse(body);
        var old_password = para.old_Password;
        var new_password = para.new_Password;
        var in_name = para.Account;


        // TODO: Avoid Callback Hell (Use findOne.exec())
        // TODO: Room save error handler, success handler
        User.findOne({
            name: in_name
        }, function(err, user) {
            if (err) return console.log(err);
            if (user != null && user.password == old_password) {
                user.password = new_password;
                user.save(function(err, updatedUser) {
                    if (err) return console.error(err);
                    res.send({
                        msg: "success"
                    });
                });
            } else {
                res.send({
                    msg: "fail"
                });
            }
        });
    })

});


module.exports = router;
