var handler = {};



var User = require('./../db/user');
var Item = require('./../db/item');
var Room = require('./../db/room');
// var mongoose = require('mongoose');


var server;

handler.setServer = function(s) {
    server = s;
}

handler.connection = function(client) {
    console.log("connection");
    var username = client.handshake.query.username;
    var roomID = username;
    var Character_type;

    //Get type
    User.findOne({
        name: username
    }, function(err, data) {
        Character_type = data.type;
    });




    // join room
    client.on('join', (data) => {
        roomID = data.roomID;
        // remove from prev room
        Room.findAndModify(
            {users: {$in: [username]}},
            {$pull: {users: username}},
            function(err, obj){
                if(err)console.error(err);
                if(obj && obj.value){
                    leave(obj.value.owner);
                }
            }
        );

        // join main
        // try to find room's config..
        Room.findOne({
            owner: roomID
        }, function(err, obj){
            if(err)return console.error(err);
            // create game

            client.emit('create game', {
                character: Character_type
            });
            // render items
            obj.items.forEach((element, index, array)=>{
                Item.findOne({
                    id: element.id
                }, function(err,data){
                    if(err)return console.log(err);
                    if(data){
                        client.emit('render item', {
                            item: data,
                            position: element.position,
                            rotation: element.rotation
                        });
                    }
                });
            });

            // render users
            for(var j=0; j< obj.users.length; ++j){
                User.findOne({
                    name: obj.users[j]
                }, function(err,user){
                    if(err)return console.log(err);
                    if(user){
                        console.log(user);
                        client.emit('render user', user.type);
                    }
                })
            }

            client.emit("start game");
        });

        // BroadCast
        client.join(roomID);
        server.to(roomID).emit('render user', Character_type);


    });

    client.on('update', (data) => {
        if (!checkValid()) return;
        server.to(roomID).emit('update', {
            username: username,
            object: data
        });
    });


    client.on('disconnect', leave);


    function checkValid(id) {
        id = id || roomID;
        if (!username || !id) {
            sysMsg(client, 'Invalid username or room(' + username + "," + roomID + ')');
            return false;
        }
        return true;
    }

    function leave(id) {
        if(!checkValid(id))return;
        id = id || roomID;
        client.leave(id);
        server.to(id).emit('pop user', {username: username});

        sysMsg(client, 'leave ' + roomID);
    }


}

function checkUserInRooms(username, roomID) {
    return roomID;
}


function sysMsg(client, msg) {
    client.emit('sys', msg);
    // console.log(client.id +": [sys] "+ msg);
    // console.log(rooms);
}


module.exports = handler;
