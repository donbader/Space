function AfterLogIn(username, roomID){


////////////////////
//////SOCKET////////
////////////////////

var Users = {};
var game;
var player;
var world;

//for paint
var paint;
//

//for rtc
var rtc;
var stream;
//

console.log('YO main.js');

var socket = io.connect("/", {query: "username="+username});
socket.on('sys', function(data){
    console.log('sys:' + data);
});



socket.on('create game', function(user){
    // if(game)return ;
    console.log("[Create Game By User]" , user, user.type);
    // player = eval("new "+user.type+"()");

    // player = new Saiyan();
    // player = new Character();

    //for rtc
    player = new Character(user);
    //

    game = new Game("GamePlay", player, socket);

    //for paint
    // paint = new Paint(1000, 500, new THREE.Vector3(0, 300, -800), Users);
    // game.add(paint.mesh);
    // game.addDynamicObject(paint, 'paint');
    // game.addCSSObject(paint.dummyPaintCSSObj);
    //

    //for rtc
    rtc = new RTC(socket, player, Users);
    //
    socket.emit('game ready');
    console.log("[game created]", game.scene);
});

socket.on('start game', function(){
    if(game.isRunning())return console.log("Game is already running");
    game.start();
    console.log("[game started]");

window.username = username;
window.roomID = roomID;
window.player = player;
window.game = game;
    $("#GamePlay").trigger('AfterLogIn');

});

socket.on('render item', function(data){
    console.log("[Render Item] ",data.id);
    switch (data.type) {
        case "script":
            var scripts = "var item = ";
            scripts += data.data.scripts.join();
            eval(scripts);
            if(data.position)
                item.position.set(data.position.x, data.position.y, data.position.z);
            if(data.rotation)
                item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            game.add(item);
            item.name = data.id;

            player.manipulate(item);
            break;
        case "file":
            var loader = new THREE.ObjectLoader();
            loader.load(data.data.path, function(item) {
                if(data.position)item.position.set(data.position.x, data.position.y, data.position.z);
                if(data.rotation)item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                game.add(item);
                // Property
                item.userData.prop = data.data.prop;
                item.name = data.id;

                player.manipulate(item);

            });
            break;
        case "voxel":
            console.log(data);
            var painter = player.controls.voxelPainter;
            painter.createVoxel(game.scene, data.position, data.color);
            break;
        default:
            SPACE_OBJECT.load(game, data, (obj)=>{
                player.manipulate(obj);
                // obj.position.set(resetVector.x, resetVector.y, resetVector.z);
                // obj.position.set(resetVector);
            });
    }


});

socket.on('remove item', function(data){
    switch (data.type) {
        case "voxel":
            var painter = player.controls.voxelPainter;
            painter.deleteVoxel(data.position);
            break;
        default:

    }
});


socket.on('add user', function(userdata){
    console.log("[Add user]", userdata.name, ":",Users );

    //for rtc
    console.log('added userdata.id = ' + userdata.id);
    Users[userdata.id] = userdata;
    Users[userdata.id].object = new Character(userdata);
    Users[userdata.id].object.name = userdata.name;
    game.add(Users[userdata.id].object);
    player.manipulate(Users[userdata.id].object);
    //

    /*
    Users[userdata.id] = userdata;
    // Users[userdata.id].object = (new Character()).model;
    Users[userdata.id].object = eval('new '+userdata.type+'()');
    Users[userdata.id].object.name = userdata.name;
    game.add(Users[userdata.id].object);
    console.log(Users);
    // because pos,rot is all 0 , so we don't set them
    */
})
socket.on('remove user', function(userid){
    console.log('[remove user]',Users);

    //for rtc
    if(rtc)
        rtc.deletePeerConnection(userid);
    console.log('[remove rtc peer connection] ', userid);
    //

    if(Users[userid]){
        game.remove(Users[userid].object);
        delete Users[userid];
        console.log('now Users, ',Users);
    }
});

socket.on('fetch userdata', function(receiver){
    console.log("send data to"+receiver);
    socket.emit('update user to one',{
        receiver: receiver,
        position:game.Controller.position,
        rotation:game.Controller.rotation
    });
})



socket.on('update user', function(userdata){
    // console.log("["+userdata.name+" Move]", userdata);
    if(Users[userdata.id]){
        Users[userdata.id].object.position.x = userdata.position.x;
        Users[userdata.id].object.position.y = userdata.position.y;
        Users[userdata.id].object.position.z = userdata.position.z;
        Users[userdata.id].object.rotation.y = userdata.rotation._y;

        //for rtc
        Users[userdata.id].object.update();
        //

        // Users[userdata.id].object.rotation.x = userdata.rotation.x;
        // Users[userdata.id].object.rotation.y = userdata.rotation.y;
        // Users[userdata.id].object.rotation.z = userdata.rotation.z;
    }

});

socket.on('destroy game', function(){
    console.log("[destroy Game]");
    game.stop();
    delete game;
});

socket.on('logout', function(){
    console.log("[logout]");
    game.stop();
    delete game;
    socket.disconnect();
});

socket.on('fuck', function(){
  console.log("i am in socket");
});


////////////////////
////////MAIN////////
////////////////////

socket.on('welcome',function(){
    socket.emit('join', roomID);
})

// var Ninja = Character.extend({
//     init: function(){
//         this._super();
//         this.body.material.color.setHex( 0x000000 );
//     }
// });


//  window.view = view:

}
