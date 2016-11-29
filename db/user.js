var mongodb = require ('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({

  name : String,
  id : String,
  password : String });

var User = mongodb.mongoose.model("User",UserSchema);
var UserDAO = function(){};
module.exports = new UserDAO();
