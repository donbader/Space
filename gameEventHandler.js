var handler = {};
var rooms = {
    corey: [],
    lamfuck: [],
    yeemin: [],
    guangting: []
};
var server;
handler.setServer = function(s){server = s;}

handler.connection = function (socket){
    var user;
    var roomID;

    // join room
    socket.on('join', function(data){
        user = data.username;
        roomID = data.roomID;

        if(!rooms[roomID]){
            socket.emit('sys', roomID+' is not exist.');
            return;
        }
        else{
            console.log("check success");
            var r = checkUserInRooms(user);
            if(r){
                socket.emit('leave');
                return;
            }
            rooms[roomID].push(user);
            socket.join(roomID);
            server.to(roomID).emit('sys', user+" has been joined.");
            console.log(user+" has been joined:"+roomID);
        }
    });

    // leave room
    socket.on('leave',function(){
        console.log("fucku");
        if(!user || !roomID || !rooms[roomID])return;
        var index = rooms[roomID].indexOf(user);
        if(index !== -1){
            rooms[roomID].splice(index, 1);
        }
        socket.leave(roomID);
        server.to(roomID).emit('sys', user+'has been left');
        console.log(user+" has been leaved:"+roomID);
    });

    socket.on('disconnect', function () {
        socket.emit('leave');
    });

    //
    socket.on('action', function(data){
        var a = user+ ": "+ data.message;
        console.log(a);
        server.to(roomID).emit('messages', a);
    });

}

function checkUserInRooms(user){
    for(var id in rooms){
        if(!rooms[id].find((elem)=>user == elem)) continue;
        else
            return id;
    }
    return false;
}


module.exports = handler;
