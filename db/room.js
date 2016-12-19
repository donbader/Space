var mongoose = require('./dbconnection');

var RoomSchema = new mongoose.Schema({
  owner : String,
  name : String,
  items : [],
  users: []
  });


RoomSchema.statics.pushUser = function(owner, userdata, callback ){
    console.log("[Push User]", userdata);
    this.update({
        owner: owner
    }, {
        $push: {
            users: userdata
        }
    }, function(err, msg) {
        if (msg.ok && msg.nModified) {
            callback && callback(userdata, owner);
        }
    });
};

//
RoomSchema.statics.AddUser = function(user, roomID, exclusive, kickUserCallback, addUserCallback){
    if(!user || !user.name || !roomID)
        return console.error("[Error]Invalid input: room:",roomID,",user:", user);
    var Rooms = this;
    if(exclusive){
        Rooms.KickUser("name",user, undefined, kickUserCallback, ()=>{
            Rooms.pushUser(roomID, user, addUserCallback);
        });
    }
    else{
        Rooms.pushUser(roomID, user, addUserCallback);
    }
};


RoomSchema.statics.KickUser = function(attr, userdata, roomID, callback, aftercallback){
    if(!userdata[attr])return console.error("[Error]Invalid input:"+attr,"--", userdata[attr]);
    // console.log("[Kick User By "+attr+"]", userdata[attr], roomID);
    // find roomID in Room
    var Rooms = this;
    if(!roomID){ // find all and Kick
        var query = {};
        query["users."+attr] = userdata[attr];
        Rooms.find(
            query,
            (err, arr)=>{
                if(err)return console.error(err);
                if(arr.length){
                    arr.forEach((room)=>{
                        Rooms.KickUser(attr, userdata, room.owner, callback, aftercallback);
                    });
                }
                else {
                    aftercallback&&aftercallback();
                }
            }
        );
    }
    else{
        var exe = {$pull:{users:{}}};
        exe.$pull.users[attr] = userdata[attr];
        // console.log("[EXE]", exe);
        Rooms.findOneAndUpdate(
            {"owner":roomID},
            exe,
            {new:false},
            (err, room)=>{
                if(err)return console.error(err);
                if(room){
                    room.users.forEach((user)=>{
                        if(user[attr] === userdata[attr])
                            callback && callback(user, roomID);
                    });
                    aftercallback && aftercallback();
                }
            }
        )
    }


};

RoomSchema.statics.render = function(roomID, username, renderItem, renderUser){
    // console.log("[Room Render]",roomID,",",username);

    this.findOne(
        {owner: roomID},
        function(err, room){
            if(err)return console.error(err);
            if(room){
                renderItem && room.items.forEach(renderItem);
                renderUser && room.users.forEach((user)=>{
                    if(!user.name || !user.type || user.name == username)
                        return;
                    else renderUser(user);
                })
            };
        }
    );
}


var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
