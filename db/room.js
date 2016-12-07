var mongoose = require('./dbconnection');

var RoomSchema = new mongoose.Schema({
  owner : String,
  name : String,
  items : [],
  users: []
  });


RoomSchema.statics.findAndModify = function (query, doc, callback) {
    return this.collection.findAndModify(query, {}, doc, {new: true}, callback);
};

RoomSchema.statics.pushUser = function(owner, userdata, callback){
    this.update({
        owner: owner
    }, {
        $push: {
            users: userdata
        }
    }, function(err, msg) {
        if (msg.ok && msg.nModified) {
            callback(userdata);
        }
    });
};

RoomSchema.statics.pullUserFromPrevRoom = function(username, callback){
    this.findAndModify({
            users: {
                $in: [username]
            }
        }, {
            $pull: {
                users: {
                    name: username
                }
            }
        },
        function(err, obj) {
            if (err) console.error(err);
            if (obj && obj.value) {
                callback(obj.value.owner);
                console.log(username+" leave "+obj.value.owner);
            }
        }
    );
}


var Room = mongoose.model('Room', RoomSchema);



module.exports = Room;
