var User = require('./user');


exports.hihi = function(req, res){

console.log("123456hihi");

var element = new User({
	name: "lam" ,
	id: "laochanlam" ,
	password: "123456" });


element.save(function(err,element){
	console.log("success");
  if (err) return console.error(err);
  });

User.mongoose.connection.close();



}