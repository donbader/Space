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
        if (!user) return console.error("No this user");
        USER = user;
        log("[Connection]", "(", user.name, ")", client.id);
        user.id = client.id;

        clients[client.id] = client;

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
        RoomManager.getRoom(ROOMID).do((room) => {
            if(!room.sockets[user.id])return ;
            room.sockets[user.id].emit('RTC close');
            delete room.sockets[user.id];

            RoomManager.getRoom(ROOMID).kickUser(user, kickUserCallback);
        });

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
            RoomManager.getRoom(roomID).addUser(user, client, addUserCallback, kickUserCallback);
            RoomManager.getRoom(roomID).render(user.name, {
                item: (item) => {
                    client.emit('render item', item);
                },
                user: (anotherUser) => {
                    client.emit('add user', anotherUser);
                    client.broadcast.to(roomID).emit('fetch userdata', user.id);
                }
            });
            RoomManager.getRoom("corey").do((room) => {
                room.users.forEach((user) => {
                    console.log(user.name, user.id);
                    console.log(room.sockets[user.id].id);
                    console.log("-----------");
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
                RoomManager.getRoom(roomID).do((room) => {
                    if(!room.sockets[msg.to])return console.log('no client ' + msg.to);
                    console.log('get msg from ' + msg.by + ' to ' + msg.to);
                    room.sockets[msg.to].emit('RTC msg to client', msg);
                });
            });

            client.on('RTC new connection', function(id) {
                console.log('rtc new connection');

                RoomManager.getRoom(roomID).do((room) => {
                    room.users.forEach((roomUser) => {
                        console.log('roomUser ' + roomUser.name + ' in ' + room);

                        if (roomUser.id !== client.id) {
                            console.log(roomUser.id + ' connect to ' + id);
                            room.sockets[roomUser.id].emit('RTC peer connection', { id: id });
                        }
                    });
                });


                // client.broadcast.to(ROOMID).emit('RTC peer connection', {id: id});
            });

            //for paint
            client.on('draw start', (info) => {
                console.log('draw start');
                RoomManager.getRoom(ROOMID).do((room) => {

                console.log('info[x] = ' + info.x,' info[y] = ', info.y, ' lineWidth = ' + info.lineWidth);

                    room.users.forEach((roomUser) => {
                        // console.log('roomUser ' + roomUser.name + ' in ' + room);

                        if (roomUser.id !== client.id) {
                            // console.log(roomUser.id + ' connect to ' + id);
                            console.log(client.id + ' to ' + roomUser.id);
                            clients[roomUser.id].emit('drawn start', info);
                        }
                    });
                });
            });

            client.on('drawing paint', (info) => {
                RoomManager.getRoom(ROOMID).do((room) => {
                    room.users.forEach((roomUser) => {
                        // console.log('roomUser ' + roomUser.name + ' in ' + room);

                        if (roomUser.id !== client.id) {
                            // console.log(roomUser.id + ' connect to ' + id);
                            clients[roomUser.id].emit('drawn paint', info);
                        }
                    });
                });
            });

            client.on('erasing paint', (info) => {
                RoomManager.getRoom(ROOMID).do((room) => {
                    room.users.forEach((roomUser) => {
                        // console.log('roomUser ' + roomUser.name + ' in ' + room);

                        if (roomUser.id !== client.id) {
                            // console.log(roomUser.id + ' connect to ' + id);
                            clients[roomUser.id].emit('erased paint', info);
                        }
                    });
                });
            });

            client.on('draw end', (info) => {
                console.log('draw end');
                RoomManager.getRoom(ROOMID).do((room) => {
                    room.users.forEach((roomUser) => {
                        // console.log('roomUser ' + roomUser.name + ' in ' + room);

                        if (roomUser.id !== client.id) {
                            // console.log(roomUser.id + ' connect to ' + id);
                            clients[roomUser.id].emit('drawn end', info);
                        }
                    });
                });
            });

            client.on('paint upload', function(data){
                RoomManager.uploadPaint(ROOMID, data, () => {
                    console.log('room manager upload paint call back');
                });
            });
            //

            //for friend
            client.on('adding friend', function(data) {
                User.appendFriend(data.name, data.friendName);
            });

            client.on('removing friend', function(data) {
                User.removeFriend(data.name, data.friendName);
            });
            //

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
                User.getVoxel(user.name, data.object.name, (result)=>{
                    if(result){
                        // Ask if want to overwrite
                        // or overwrite directly
                        User.deleteVoxel(user.name, data.object.name);
                    }
                    User.appendVoxel(user.name, data);
                })
                RoomManager.getRoom(roomID).appendItem({name: data.object.name, from: user.name+".VoxelWarehouse"});
            });

            client.on('Voxel delete', function(name){
                User.deleteVoxel(user.name, name);
            });

            //for paint
            //to set paint when entering room
            RoomManager.getPaint(ROOMID, (url) => {
                if(!url) return;
                client.emit('set paint url', url);
            });
            //
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
