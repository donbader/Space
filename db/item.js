var mongoose = require('./dbconnection');

var ItemSchema = mongoose.Schema({
  id : String,
  type: String,
  data: {}
  });

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;


// {
//     id: "0",
//     type: "script",
//     data: {
//         type: "Room",
//         scripts: "new Room(2048, 2048, 500, 0xf88399)"
//     }
// }
