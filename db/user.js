var mongoose = require('dbconnection');

var UserSchema = mongoose.Schema({
  name : String,
  id : String,
  password : String
  });

var User = mongoose.model('User', UserSchema);

exports = mongoose;
/*var mongodb = require ('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({

  name : String,
  id : String,
  password : String });

var User = mongodb.mongoose.model("User",UserSchema);
*/
