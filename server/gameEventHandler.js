var handler = {};
  /*
var rooms = {
    corey: [],
    lamfuck: [],
    yeemin: [],
    guangting: []
};
*/


// var User = require('./../db/user');
// var Item = require('./../db/item');
// var Room = require('./../db/room');
// var mongoose = require('mongoose');

var rooms = {
    corey: {},
    yee: {},
    lam: {},
    ting: {}
};

var server;

handler.setServer = function(s){server = s;}

handler.connection = function (client){
    var username = client.handshake.query.username;
    var roomID;


    // join room
    client.on('join', (data)=>{
        roomID = data.roomID;
        if(!checkValid())return;
        var prevRoom = checkUserInRooms(username);
        if(prevRoom){
            if(roomID == prevRoom){
                sysMsg(client, 'already in '+roomID);
                return;
            }
            else{
                leave();
            }
        }

        // join main
        // try to find room's config..
        // client.emit('doscript', {rommmmm});
        client.join(roomID);
        rooms[roomID][username] = true;
        server.to(roomID).emit('add user', {
            username: username,
            script: "new Ninja(000,9992,2);"
        });
    });

    client.on('update',(data)=>{
        if(!checkValid())return;
        server.to(roomID).emit('update', {
            username: username,
            object: data
        });
    });


    client.on('disconnect', leave);


    function checkValid(){
        if(!username || !roomID || !rooms[roomID]){
            sysMsg(client, 'Invalid username or room('+username+","+roomID+')');
            return false;
        }
        return true;
    }

    function leave(){
        if(!checkValid())return;

        client.leave(roomID);

        if(checkUserInRooms(username, roomID)){
            server.to(roomID).emit('pop user', {username: username});
        }

        if(rooms[roomID][username])
            delete rooms[roomID][username];

        sysMsg(client, 'leave '+roomID);
    }


}

function checkUserInRooms(username, roomID){
    if(roomID !== undefined && rooms[roomID][username]){
        return roomID;
    }
    else{
        for(var id in rooms){
            if(rooms[id][username])return id;
        }
    }
    return false;
}

function replaceID(client, server, id){
    client.id = id;
    server.adapter

}
function sysMsg(client, msg){
    client.emit('sys', msg);
    // console.log(client.id +": [sys] "+ msg);
    console.log(rooms);
}
function onJoin(){

}

function onLeave(){

}

module.exports = handler;
