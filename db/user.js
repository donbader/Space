var mongoose = require('./dbconnection');

var UserSchema = mongoose.Schema({
  name : String,
  password : String
  });

var User = mongoose.model('User', UserSchema);

module.exports = User;
