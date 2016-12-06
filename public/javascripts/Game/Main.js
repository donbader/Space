// TODO: Kick the user while he is logined;
var query = window.location.href.split('?')[1].split("&");
var username = query[0].split("=")[1];
var roomID = query[1].split("=")[1];

////////////////////
//////SOCKET////////
////////////////////
var Users = {};
var game;
var player;
var world;


var socket = io.connect("/", {query: "username="+username});
socket.on('sys', function(data){
    console.log('sys:' + data);
});

socket.on('create game', function(data){
    player = eval("new "+data.character+"()");
    // player = new Character();
    game = new Game("GamePlay", player, socket);
});

socket.on('start game', function(){
    game.start();
    console.log(game.scene);
});

socket.on('render item', function(data){
    var item;
    switch (data.item.type) {
        case "script":
            var scripts = "item = ";
            scripts += data.item.data.scripts.join();
            eval(scripts);


    }
    item.position.set(data.position.x, data.position.y, data.position.z);
    item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    game.add(item);
    if(item.ObjectsToMoveOn){
        player.canMoveOn(item.ObjectsToMoveOn);
    }
});


socket.on('add user', function(userdata){
    console.log(userdata.name + " has joined");
    console.log(Users);
    Users[userdata.name] = userdata;
    // Users[userdata.name].object = (new Character()).model;
    Users[userdata.name].object = eval('new '+userdata.type+'()');
    Users[userdata.name].object.name = userdata.name;
    game.add(Users[userdata.name].object);
    console.log(userdata);
    // because pos,rot is all 0 , so we don't set them
})
socket.on('remove user', function(username){
    console.log('remove user');
    console.log(Users);
    game.remove(Users[username].object);
    delete Users[username];
});

socket.on('update user', function(userdata){
    if(Users[userdata.name]){
        Users[userdata.name].object.position.x = userdata.position.x;
        Users[userdata.name].object.position.y = userdata.position.y;
        Users[userdata.name].object.position.z = userdata.position.z;
        Users[userdata.name].object.rotation.y = userdata.rotation._y;
        // Users[userdata.name].object.rotation.x = userdata.rotation.x;
        // Users[userdata.name].object.rotation.y = userdata.rotation.y;
        // Users[userdata.name].object.rotation.z = userdata.rotation.z;
    }

})


////////////////////
////////MAIN////////
////////////////////


socket.emit('join', {
    roomID:roomID
});

// var Ninja = Character.extend({
//     init: function(){
//         this._super();
//         this.body.material.color.setHex( 0x000000 );
//     }
// });
