var mongoose = require('./dbconnection');

var ItemSchema = new mongoose.Schema({
  id : String,
  type: String,
  data: {}
  });

ItemSchema.statics.getById = function(id, callback){
    this.findOne({id:id},callback);
};
ItemSchema.statics.render = function(client, itemID, position, rotation, callback){
    this.findOne(
        {id: itemID},
        function(err, item){
            if(err)return console.error(err);
            if(item){
                item.position = position;
                item.rotation = rotation;
                client.emit('render item', item);
                callback && callback(item);
            }
        }
    )
};

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
