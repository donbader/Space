// TODO: Kick the user while he is logined;
var query = window.location.href.split('?')[1].split("&");
var username = query[0].split("=")[1];
var roomID = query[1].split("=")[1];

////////////////////
//////SOCKET////////
////////////////////
var Users = [];


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

socket.on('add user', function(data){
    // create ( SCRIPT);
    console.log('add');
    console.log(data.username);
    console.log(data.script);
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

var Ninja = Character.extend({
    init: function(){
        this._super();
        this.body.material.color.setHex( 0x000000 );
    }
});

var ninja = new Ninja();


var game = new Game("GamePlay", ninja, new World(), socket);
var room = new Room (2048,2048,500, 0xf88399);



game.add(room);
game.start();
