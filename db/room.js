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


var Room = mongoose.model('Room', RoomSchema);



module.exports = Room;
