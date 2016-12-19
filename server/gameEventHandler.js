var handler = {};
// TODO: client.on disconnect: ROOMID cannot get??


var User = require('./../db/user');
var Item = require('./../db/item');
var Room = require('./../db/room');
// var mongoose = require('mongoose');


var server;

handler.setServer = function(s) {
    server = s;
}

handler.connection = function(client) {
    var USER, ROOMID;
    User.getByName(client.handshake.query.username, (err, user)=>{
        USER = user;
        log("[Connection]", client.id);
        if(!user) return "No this user";
        user.id = client.id;
        GameSet(user);
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
        log("[Disconnect]",user.name," Has disconnected, room:",ROOMID);
        Room.KickUser("id",user, ROOMID, kickUserCallback);
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

    function log() {
        console.log('[' + client.handshake.query.username + ']---------------------------------------(' + client.id + ')');
        process.stdout.write(tabs(2));
        console.log.apply(this, arguments);
    }

    function checkValid(id) {
        id = id || ROOMID;
        var user = USER || {};
        if ( !user.name || !id) {
            sysMsg(client, 'Invalid user.name or room(' + user.name + "," + id + ')');
            return false;
        }
        return true;
    }



    function kickUserCallback(userdata, roomID){
        if(!userdata || !roomID)return;
        log('[Kick User]', userdata.name, userdata.id);
        server.to(roomID).emit('remove user', client.id);
        server.to(userdata.id).emit('logout');
    }
    function addUserCallback(userdata, roomID){
        if(!userdata || !roomID)return ;
        log('[Add User]', userdata.name, userdata.id, " to ", roomID);
        client.broadcast.to(roomID).emit('add user', userdata);
    }


    function GameSet(user){
        client.on("join", (roomID)=>{
            if(!roomID || !user || !client)return;
            ROOMID = JSON.parse(JSON.stringify(roomID));
            log("[Join]", roomID);
            client.join(roomID);
            // create Game with user, usertype
            client.emit('create game', user);

            Room.AddUser(user, roomID, true, kickUserCallback, addUserCallback);
            // render items and users
            Room.render(roomID, user.name,
                (item)=>{
                    client.emit('render item', item);
                },
                (anotherUser)=>{
                    console.log("Found Another User");
                    client.emit('add user', anotherUser);
                    client.broadcast.to(roomID).emit('fetch userdata', user.id);
                }
            );
            client.emit("start game");
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
