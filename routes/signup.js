var express = require('express');
var path = require('path');
var User = require('./../db/user');
var Room = require('./../db/room');
var router = express.Router();
var querystring = require("querystring");
var mongoose = require('mongoose');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../view', 'SignUp.html'));
});

router.post('/add', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {

        var para = querystring.parse(body);
        var in_password = para.Password;
        var in_name = para.Account;

        var userdata = new User({
            name: in_name,
            password: in_password,
            type: "Character"
        });



        // TODO: Avoid Callback Hell (Use findOne.exec())
        // TODO: Room save error handler, success handler
        User.findOne({
            name: in_name
        }, function(err, user) {
            if (err) return console.log(err);
            if (user == null) {
                userdata.save(function(err) {
                    if (err) return console.error(err);
                    res.send({
                        msg: "success"
                    });
                });

                var roomdata = new Room({
                    owner: in_name,
                    name: in_name + "\'s room",
                    items: [{
                        id: "Room_000",
                        from: "public"
                    }],
                    users: [],
                    paint: "",
                });
                roomdata.save(function(err) {
                    if (err) return console.error(err);
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
