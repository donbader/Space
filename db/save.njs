var Item = require('./item');
var mongoose = require('mongoose');




var element = new Item({
    id: "0",
    type: "script",
    data: {
        type: "Room",
        scripts: "new Room(2048, 2048, 500, 0xf88399)"
    }
});



element.save(function(err, element) {
    if (err) return console.error(err);
});


mongoose.connection.close();
