var mongoose = require('./dbconnection');

var ItemSchema = mongoose.Schema({
  id : String,
  path : String,
  draw : String
  });

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
