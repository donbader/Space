var RoomDB = require('../db/room');
var UserDB = require('../db/user');
var ItemDB = require('../db/item');

var Room = function(owner, done){
    var scope = this;
    this.doQueue = [];
    this.sockets = {};
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
Room.prototype.addUser = function(user, socket, addUserCallback, kickUserCallback){
    this.do(function(room){
        if(!room.users) room.users = [];
        var index = room.users.findIndex((element)=>element.name === user.name);

        if(index !== -1){
            kickUserCallback && kickUserCallback(room.owner, room.users[index]);
            room.users.splice(index, 1);
        }
        room.users.push(user);
        room.sockets[socket.id] = socket;
        addUserCallback && addUserCallback(room.owner, user);
    });
}

Room.prototype.kickUser = function(user, kickUserCallback){
    this.do(function(room){
        if(room.users && room.users.length){
            var index = room.users.findIndex((element)=>(element.name === user.name) && (element.id === user.id));
            if(index !== -1){
                kickUserCallback && kickUserCallback(room.owner, room.users[index]);
                room.users.splice(index, 1);
            }
        }
    });
};

Room.prototype.appendItem = function(item, callback){
    this.do(function(room){
        if(!item || !item.name ||! item.from)return;
        var index = room.items.findIndex((element)=>element.name === item.name);
        if(index !== -1){
            room.items[index].from = item.from;
        }
        else{
            room.items.push(item);
        }
        RoomDB.appendItem(room.owner, item);

        callback && callback();
    });
}

Room.prototype.render = function(username, callbacks){
    if(!callbacks)return;
    this.do(function(room){
        room.items.forEach((item)=>{
            if(!item.from)return;
            if(item.from === "public"){
                ItemDB.getById(item.id, (err, itemdata)=>{
                    if(!itemdata)return;
                    Object.assign(item, itemdata._doc);
                    callbacks.item && callbacks.item(item);
                });
                return;
            }
            else if(item.from === "voxel"){
                callbacks.voxel && callbacks.voxel(item);
            }
            else{
                var from = item.from.split(".");
                if(from[1] === "VoxelWarehouse"){
                    UserDB.getVoxel(from[0], item.name, (item)=>{
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

Room.prototype.appendVoxel = function(posName, color, callback){
    this.do((room)=>{
        var index = room.items.findIndex((e)=>{e.from === "voxel"});
        if(index === -1){
            // create a
            var item = {};
            item.from = "voxel";
            item.type = "voxel";
            item[posName] = color;
            room.items.push(item);
        }
        else {
            room.items[index][posName] = color;
        }
        // update to user
        callback && callback(posName, color);
    });
};

Room.prototype.deleteVoxel = function(posName, callback){
    this.do((room)=>{
        var index = room.items.findIndex((e)=>{e.from === "voxel"});
        if(index === -1)return;
        else {
            delete room.items[index][posName];
        }
        // update to user
        callback && callback(posName);
    });
}

//Manager


var RoomManager = function(){
    this.rooms = {};
}

RoomManager.prototype.getRoom = function(owner){
    if(!this.rooms[owner])
        this.rooms[owner] = new Room(owner);
    return this.rooms[owner];
};

RoomManager.prototype.addUser = function(owner, user, socket, addUserCallback, kickUserCallback){
    this.getRoom(owner).addUser(user, socket, addUserCallback, kickUserCallback);
}

RoomManager.prototype.kickUser = function(owner, user, kickUserCallback){
    this.getRoom(owner).kickUser(user, kickUserCallback);
}

RoomManager.prototype.render = function(owner, username, callbacks){
    this.getRoom(owner).render(username, callbacks);
}



module.exports = RoomManager;
