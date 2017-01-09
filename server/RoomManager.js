var RoomDB = require('../db/room');
var UserDB = require('../db/user');
var ItemDB = require('../db/item');

var Room = function(owner, done){
    var scope = this;
    this.doQueue = [];
    this.initialized = false;
    RoomDB.findRoom(owner, (room)=>{
        room && Object.assign(scope, room._doc);
        this.initialized = true;
        this.consumeQueue();
    });

};
Room.prototype.do = function(fn){
    if(!this.initialized) this.doQueue.push(fn);
    else if(this.owner)fn(this);
}
Room.prototype.consumeQueue = function(){
    var scope = this;
    this.doQueue.forEach((fn)=>fn(scope));
}


var RoomManager = function(){
    this.rooms = {};
}

RoomManager.prototype.getRoom = function(owner){
    if(!this.rooms[owner])
        this.rooms[owner] = new Room(owner);
    return this.rooms[owner];
};

RoomManager.prototype.addUser = function(owner, user, addUserCallback, kickUserCallback){
    var scope = this;

    this.getRoom(owner).do(function(room){
        if(!room.users) room.users = [];
        var index = room.users.findIndex((element)=>element.name === user.name);

        if(index !== -1){
            kickUserCallback && kickUserCallback(owner, room.users[index]);
            room.users.splice(index, 1);
        }
        // room.users.filter((userdata)=>{
        //     if(userdata.name === user.name && userdata.id !== user.id)
        //         kickUserCallback && kickUserCallback(owner, userdata);
        //     return userdata.name !== user.name;
        // });
        room.users.push(user);
        addUserCallback && addUserCallback(owner, user);
    });
}

RoomManager.prototype.kickUser = function(owner, user, kickUserCallback){
    this.getRoom(owner).do(function(room){
        if(room.users && room.users.length){
            var index = room.users.findIndex((element)=>(element.name === user.name) && (element.id === user.id));
            if(index !== -1){
                kickUserCallback && kickUserCallback(owner, room.users[index]);
                room.users.splice(index, 1);
            }
        }

    });
}

RoomManager.prototype.render = function(owner, username, callbacks){
    if(!callbacks)return;
    this.getRoom(owner).do(function(room){
        room.items.forEach((item)=>{
            ItemDB.getById(item.id, (err, itemdata)=>{
                if(!itemdata)return;
                Object.assign(item, itemdata._doc);
                callbacks.item && callbacks.item(item);
            });
        });
        room.users.forEach((userdata)=>{
            if(callbacks.user && userdata.name !== username){
                callbacks.user(userdata);
            }
        })
    });
}



module.exports = RoomManager;
