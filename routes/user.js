var User = require('./../db/user.js');		
exports.UserAdd = function(req, res) {		
	if (req.params.id)		
 	{		
		console.log("edit " + req.params.id);		
	}		
 	else		
 	{		
 		console.log("add new " + req.params.id);		
 	}		
 		
 /*exports.doUserAdd = function(req, res) {		
 	console.log("you have been add bro.");		
 	}*/		
 		
 } 