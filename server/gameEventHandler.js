var handler = {};
// TODO: Write statics function to Room, Item, User


var User = require('./../db/user');
var Item = require('./../db/item');
var Room = require('./../db/room');
// var mongoose = require('mongoose');


var server;

handler.setServer = function(s) {
    server = s;
}

handler.connection = function(client) {
    var username = client.handshake.query.username;
    var roomID = username;
    var Character_type;
    console.log(username + " ON CONNECTION");

    //Get type
    if (username) {
        User.findOne({
            name: username
        }, function(err, data) {
            Character_type = data.type;
        });
    }




    // join room
    client.on('join', (data) => {
        roomID = data.roomID;
        // remove from prev room
        Room.findAndModify({
                users: {
                    $in: [username]
                }
            }, {
                $pull: {
                    users: username
                }
            },
            function(err, obj) {
                if (err) console.error(err);
                if (obj && obj.value) {
                    leave(obj.value.owner);
                }
            }
        );

        // join main
        // try to find room's config..
        Room.findOne({
            owner: roomID
        }, function(err, obj) {
            if (err) return console.error(err);
            if (!obj) {
                sysMsg(client, "There is no room: " + roomID);
                return;
            }
            // create game

            client.emit('create game', {
                character: Character_type
            });
            // render items
            obj.items.forEach((element, index, array) => {
                Item.findOne({
                    id: element.id
                }, function(err, data) {
                    if (err) return console.log(err);
                    if (data) {
                        client.emit('render item', {
                            item: data,
                            position: element.position,
                            rotation: element.rotation
                        });
                    }
                });
            });

            // render users
            // for(var j=0; j< obj.users.length; ++j){
            //     User.findOne({
            //         name: obj.users[j]
            //     }, function(err,user){
            //         if(err)return console.log(err);
            //         if(user){
            //             console.log(user);
            //             client.emit('render user', {
            //                 name: user.name,
            //                 type: user.type,
            //                 position: ,
            //
            //             });
            //         }
            //     })
            // }

            client.emit("start game");
            var userdata = {
                name: username,
                type: Character_type,
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            };
            Room.update({
                owner: roomID
            }, {
                $push: {
                    users: userdata
                }
            }, function(err, msg) {
                if (msg.ok && msg.nModified) {
                    server.to(roomID).emit('add user', userdata);
                    client.join(roomID);
                }
            });
        });

        // BroadCast
    });
    client.on('update user', function(data) {
        if (!checkValid()) return;
        server.to(roomID).emit('update user', {
            name: username,
            position: data.position,
            rotation: data.rotation
        });

        Room.update({
            owner: roomID,
            "users.name": username
        }, {
            $set: {
                "users.$.position": data.position,
                "users.$.rotation": data.rotation
            }
        });

    });
    // client.on('update', (data) => {
    //     if (!checkValid()) return;
    //     server.to(roomID).emit('update', {
    //         username: username,
    //         object: data
    //     });
    // });


    client.on('disconnect', leave);

    client.on('drawClick', function(data) {
        client.broadcast.emit('draw', {
            x: data.x,
            y: data.y,
            type: data.type
        });
    });

    client.on('setColor', function(data) {
        client.broadcast.emit('setColor', {
            i: data.i
        });
    });

    client.on('setSize', function(data) {
        client.broadcast.emit('setSize', {
            i: data.i
        });
    });

    client.on('setTool', function(data) {
        client.broadcast.emit('setTool', {
            tool: data.tool
        });
    });

    client.on('clear', function(data) {
        client.broadcast.emit('clear', {
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height
        });
    });

    function checkValid(id) {
        id = id || roomID;
        if (!username || !id) {
            sysMsg(client, 'Invalid username or room(' + username + "," + roomID + ')');
            return false;
        }
        return true;
    }

    function leave(id) {
        if (!checkValid(id)) return;
        console.log("ON LEAVE");
        id = id || roomID;
        client.leave(id);
        server.to(id).emit('remove user', username);
        Room.update({
            owner: roomID
        }, {
            $pull: {
                users: {
                    name: username
                }
            }
        }, {
            multi: true
        }, function(err, obj) {});
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
