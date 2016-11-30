var User = require('./user');


exports.doFinal = function(req, res){

console.log("123456hihi");

var element = new User({
	name: "lam" ,
	id: "laochanlam" ,
	password: "123456" });


element.save(function(err,element){
  if (err) return console.error(err);
  });



}
