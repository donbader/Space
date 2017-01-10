var handler = {};
// TODO: client.on disconnect: ROOMID cannot get??


var User = require('./../db/user');
var Item = require('./../db/item');
var Room = require('./../db/room');
var RoomManager = new(require('./RoomManager'))();


// var mongoose = require('mongoose');


var server;

//for rtc
//in room????
var clients = {};
//

handler.setServer = function(s) {
    server = s;
}

handler.connection = function(client) {
    var USER, ROOMID;
    User.getByName(client.handshake.query.username, (err, user) => {
        USER = user;
        log("[Connection]", "(", user.name, ")", client.id);
        if (!user) return console.error("No this user");
        user.id = client.id;

        //for rtc
        clients[user.id] = client;
        //

        GameSet(user);
        client.emit('welcome');
    });

    client.on('update user to one', function(data) {
        if (!checkValid()) return;
        USER.position = data.position;
        USER.rotation = data.rotation;
        client.broadcast.to(data.receiver).emit('update user', USER);
    });
    client.on('update user to all', function(data) {
        if (!checkValid()) return;
        USER.position = data.position;
        USER.rotation = data.rotation;
        client.broadcast.to(ROOMID).emit('update user', USER);
    });

    client.on('disconnect', () => {
        var user = USER || {};
        log("[Disconnect]", user.name, " Has disconnected, room:", ROOMID);

        //for rtc
        if (clients[user.id]) {
            // need??
            clients[user.id].emit('RTC close');
            delete clients[user.id];

            RoomManager.kickUser(ROOMID, user, kickUserCallback);
        }
        //

        // // Room.KickUser("id",user, ROOMID, kickUserCallback);
        // RoomManager.kickUser(ROOMID, user, kickUserCallback);
    });

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

    //for webcam

    client.on('pushStream', function(data) {
        client.broadcast.emit('getStream', {
            mediaStream: data.mediaStream
        });
    });

    //

    function log() {
        console.log('[' + client.handshake.query.username + ']---------------------------------------(' + client.id + ')');
        process.stdout.write(tabs(2));
        console.log.apply(this, arguments);
    }

    function checkValid(id) {
        id = id || ROOMID;
        var user = USER || {};
        if (!user.name || !id) {
            sysMsg(client, 'Invalid user.name or room(' + user.name + "," + id + ')');
            return false;
        }
        return true;
    }



    function kickUserCallback(roomID, user) {
        if (!user || !roomID) return;
        log('[Kick User]', user.name, user.id);
        server.to(roomID).emit('remove user', user.id);
        server.to(user.id).emit('logout');
    }

    function addUserCallback(roomID, user) {
        if (!user || !roomID) return;
        log('[Add User]', user.name, user.id, " to ", roomID);
        client.broadcast.to(roomID).emit('add user', user);
    }

    function GameSet(user) {
        client.on("join", (roomID) => {
            if (!roomID || !user || !client) return;
            ROOMID = JSON.parse(JSON.stringify(roomID));
            log("[Join]", roomID);
            client.join(roomID);
            // create Game with user, usertype
            client.emit('create game', user);
            RoomManager.addUser(roomID, user, addUserCallback, kickUserCallback);
            RoomManager.render(roomID, user.name, {
                item: (item) => client.emit('render item', item),
                user: (anotherUser) => {
                    client.emit('add user', anotherUser);
                    client.broadcast.to(roomID).emit('fetch userdata', user.id);
                }
            });
            RoomManager.getRoom("corey").do((room) => {
                room.users.forEach((user) => {
                    console.log(user.name);
                });
            });
            // Room.AddUser(user, roomID, true, kickUserCallback, addUserCallback);
            // // render items and users
            // Room.render(roomID, user.name,
            //     (item)=>{
            //         client.emit('render item', item);
            //     },
            //     (anotherUser)=>{
            //         console.log("Found Another User");
            //         client.emit('add user', anotherUser);
            //         client.broadcast.to(roomID).emit('fetch userdata', user.id);
            //     }
            // );

            client.on('RTC msg to server', function(msg) {
                if (!clients[msg.to]) {
                    console.log('no client ' + msg.to);
                    return;
                }
                console.log('get msg from ' + msg.by + ' to ' + msg.to);

                // if(msg.type !== 'ice')
                //     console.log('msg = ', msg);
                
                clients[msg.to].emit('RTC msg to client', msg);
            });

            client.on('RTC new connection', function(id) {
                console.log('rtc new connection');

                RoomManager.getRoom(ROOMID).do((room) => {
                    room.users.forEach((roomUser) => {
                        console.log('roomUser ' + roomUser.name + ' in ' + room);

                        if (roomUser.id !== id) {
                            console.log(roomUser.id + ' connect to ' + id);
                            clients[roomUser.id].emit('RTC peer connection', { id: id });
                        }
                    });
                });


                // client.broadcast.to(ROOMID).emit('RTC peer connection', {id: id});
            });

            // RoomManager.getRoom(roomID).do((room) => {
            //     room.users.forEach((roomUser) => {
            //         console.log('roomUser ' + roomUser.name + ' in ' + room);

            //         if(roomUser.name != USER.name) {
            //             console.log('YOOO ' + roomUser.name);
            //             clients[roomUser.name].emit('RTC peer connection', {name: USER.name});
            //         }
            //     });
            // });

            // client.emit('RTC start');
            //

            client.emit("start game");

            // Event handler
            client.on('Voxel upload', function(data){
                data = JSON.parse(data);
                User.appendVoxel(user.name, data);
            });

            client.on('Voxel delete', function(name){
                User.deleteVoxel(user.name, name);
            })
        });
    }
}



function sysMsg(client, msg) {
    client.emit('sys', msg);
    // console.log(client.id +": [sys] "+ msg);
    // console.log(rooms);
}

function tabs(n) {
    return " ".repeat(n * 4);
}


module.exports = handler;
