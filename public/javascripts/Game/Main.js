// TODO: Kick the user while he is logined;
var query = window.location.href.split('?')[1].split("&");
var username = query[0].split("=")[1];
var roomID = query[1].split("=")[1];

////////////////////
//////SOCKET////////
////////////////////
var Users = [];
var game;
var player;
var world;


var socket = io.connect("/", {query: "username="+username});
socket.on('sys', function(data){
    console.log('sys:' + data);
});

socket.on('update',function (data){
    console.log(data);
    // for(var i in data){
    //     console.log(data[i]);
    //     // var object = .get(data[i].id);
    //     // object.position.set(data[i].position);
    //     // object.rotation.set(data[i].rotation);
    // }
});
socket.on('create game', function(data){
    player = eval("new "+data.character+"()");
    game = new Game("GamePlay", player, socket);
});

socket.on('start game', function(){
    game.start();
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


socket.on('render user', function(data){
    console.log('render user');
    console.log(data);
});
socket.on('pop user', function(data){
    console.log('pop');
    console.log(data.username);
});
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
