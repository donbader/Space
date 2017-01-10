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

//for paint
RoomManager.prototype.getPaint = function(owner, callback) {
    if(!owner) return;

    // console.log('paint in get paint = ', this.rooms[owner].paint);

    return callback(this.rooms[owner].paint);
}

RoomManager.prototype.uploadPaint = function(owner, url, callback) {
    if(!owner || !url) return;

    RoomDB.update(
        {owner: owner},
        {$set: {'paint': url}},
        {safe: true, upsert: true, new : true},
        function(err, result) {
            callback && callback();
        }
    );

    
}
//

RoomManager.prototype.render = function(owner, username, callbacks){
    if(!callbacks)return;
    this.getRoom(owner).do(function(room){
        room.items.forEach((item)=>{
            if(!item.from)return;
            if(item.from === "public"){
                ItemDB.getById(item.id, (err, itemdata)=>{
                    Object.assign(item, itemdata._doc);
                    callbacks.item && callbacks.item(item);
                });
                return;
            }
            else{
                var from = item.from.split(".");
                if(from[0] === "VoxelWarehouse"){
                    UserDB.getVoxel(from[1], item.name, (item)=>{
                        callbacks.item && callbacks.item(item);
                    });
                }
            }
        });
        room.users.forEach((userdata)=>{
            if(callbacks.user && userdata.name !== username){
                callbacks.user(userdata);
            }
        })
    });
}



module.exports = RoomManager;
