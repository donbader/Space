var mongoose = require('./dbconnection');
var Item = require('./item');

var RoomSchema = new mongoose.Schema({
  owner : String,
  name : String,
  items : [],
  users: []
  });


RoomSchema.statics.appendItem = function(owner, item, callback){
    if(!item.name || !item.from)return;
    this.update(
        {owner:owner},
        {$push: {"items": item}},
        {safe: true, upsert: true, new : true},
        function(err, result){
            callback && callback(result);
        }
    );
}

RoomSchema.statics.findRoom = function(owner, callback){
    this.findOne(
        {owner: owner},
        function(err, room){
            if(err)return console.error(err);
            if(!room)
                console.log("No room: ",owner);
            return callback(room);
        }
    );
}

RoomSchema.statics.refresh = function(owner, roomdata){
    this.update(
        {owner:roomdata.owner},
        {$set:
            {items: roomdata.items}},
        (err, msg)=>{err && console.error(err);}
    );
}


var Room = mongoose.model('Room', RoomSchema);


module.exports = Room;
