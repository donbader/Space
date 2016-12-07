$('form').submit(false);

$("#GameAll").css({
    'display': 'none'
});
$("#enter").click(function() {
    //if ($('#inputEmail').val() != "" && $('#inputPassword').val() != "") {
    var send_data = {
        Account: $('#inputEmail').val(),
        Password: $("#inputPassword").val()
    }
    $.ajax({
        type: 'post',
        url: "login",
        dataTpye: "json",
        data: send_data,
        success: function(JSONData) {
            console.log(JSONData.msg);

            if (JSONData.msg == "success") {

                var socket = io.connect();
                socket.emit('join', {
                    roomID: JSONData.id
                });

                // console.log("ID=",id);
                //document.getElementById("Black").style.display = "inline";
                $("#Black").css({
                    'display': 'inline'
                });
                $("#Black").animate({
                    'opacity': '1'
                }, 2000, function() {
                    $("#SignInPage").css({
                        'display': 'none'
                    });
                    console.log("1234");
                    $("#GameAll").css({
                        'display': 'inline'
                    });
                    console.log("000");

                    // TODO: Kick the user while he is logined;
                    var username = JSONData.id;
                    var roomID = JSONData.id;

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

                        //to create gotoroomwindow
                        var goToRoomWindow = new GoToRoomWindow(500, 200, socket);
                        console.log(funcitonListWindow);
                        functionListWindow.AppendItem("GoToRoom", "GoToRoom1", goToRoomWindow);
                        //console.log("socket id" + socket.)
                        console.log(socket);
                    });

                    socket.on('start game', function(){
                        game.start();
                        console.log(game.scene);
                    });

                    socket.on('render item', function(data){
                        switch (data.item.type) {
                            case "script":
                                var scripts = "var item = ";
                                scripts += data.item.data.scripts.join();
                                eval(scripts);
                                item.position.set(data.position.x, data.position.y, data.position.z);
                                item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                                game.add(item);
                                if(item.ObjectsToMoveOn){
                                    player.canMoveOn(item.ObjectsToMoveOn);
                                }
                                break;
                            case "file":
                                var loader = new THREE.ObjectLoader();
                                loader.load(data.item.data.path, function(item) {
                                    item.position.set(data.position.x, data.position.y, data.position.z);
                                    item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                                    game.add(item);
                                });
                                break;
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

                    });
                    socket.on('destroy game', function(){
                        console.log("YO");
                        game.stop();
                        delete game;
                    });


                    ////////////////////
                    ////////MAIN////////
                    ////////////////////


                    socket.emit('join', {
                        roomID:roomID
                    });
                    //



                    console.log("12345");
                    $("#Black").animate({
                        'opacity': "0"
                    }, 3000, function() {
                        $("#Black").css({
                            'display': 'none'
                        });
                        console.log("123456");
                    });
                });
            } else {
                // alert("Wrong In Username Or Password");
                // window.location = "/";
            }
        }

    });
//  }
});
