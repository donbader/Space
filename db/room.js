var mongoose = require('./dbconnection');

var RoomSchema = mongoose.Schema({
  owner : String,
  name : String,
  item : [String],
  });

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
