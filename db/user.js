var mongoose = require('./dbconnection');

var UserSchema = new mongoose.Schema({
  name : String,
  password : String,
  type: String
  });

UserSchema.statics.getByName = function(name,callback){
    if(!name)return ;
    return this.findOne({name:name},(err, user)=>{
        if(user)
            callback(err, {name:user.name, type:user.type});
        else {
            callback(err);
        }
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
