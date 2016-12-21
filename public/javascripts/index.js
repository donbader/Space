$('form').submit(false);

if (navigator.cookieEnabled) {
    console.log("Cookie 功能已經啟動！")
        // 在此加入使用 Cookie 的程式碼


    console.log(Cookies.get("ID"));
    if (Cookies.get("ID") != null && Cookies.get("PW") != null)　　　 {　
        console.log(Cookies.get("ID") + "welcome");
        //COOKIE傳送回去的帳密確認

        var send_data = {
            Account: Cookies.get("ID"),
            Password: Cookies.get("PW")
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
                        console.log("Entered");

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


                    var socket = io.connect("/", { query: "username=" + username });
                    socket.on('sys', function(data) {
                        console.log('sys:' + data);
                    });
                    console.log("YO");
                    socket.on('create game', function(user) {
                        // player = eval("new " + data.character + "()");
                        // // player = new Character();
                        // game = new Game("GamePlay", player, socket);

                        // //to create gotoroomwindow
                        // var goToRoomWindow = new GoToRoomWindow(500, 200, socket);
                        // console.log(funcitonListWindow);
                        // functionListWindow.AppendItem("GoToRoom", "GoToRoom1", goToRoomWindow);
                        // //console.log("socket id" + socket.)
                        // console.log(socket);

                        console.log("[Create Game By User]", user);
                        player = eval("new " + user.type + "()");
                        // player = new Character();
                        game = new Game("GamePlay", player, socket);
                        console.log("[game created]", game.scene);
                    });

                    socket.on('start game', function() {
                        game.start();
                        console.log(game.scene);
                    });

                    socket.on('render item', function(data) {
                        // switch (data.item.type) {
                        //     case "script":
                        //         var scripts = "var item = ";
                        //         scripts += data.item.data.scripts.join();
                        //         eval(scripts);
                        //         item.position.set(data.position.x, data.position.y, data.position.z);
                        //         item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                        //         game.add(item);
                        //         if (item.ObjectsToMoveOn) {
                        //             player.canMoveOn(item.ObjectsToMoveOn);
                        //         }
                        //         break;
                        //     case "file":
                        //         var loader = new THREE.ObjectLoader();
                        //         loader.load(data.item.data.path, function(item) {
                        //             item.position.set(data.position.x, data.position.y, data.position.z);
                        //             item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                        //             game.add(item);
                        //         });
                        //         break;
                        // }

                        console.log("[Render Item] ", data.id);
                        switch (data.type) {
                            case "script":
                                var scripts = "var item = ";
                                scripts += data.data.scripts.join();
                                eval(scripts);
                                if (data.position)
                                    item.position.set(data.position.x, data.position.y, data.position.z);
                                if (data.rotation)
                                    item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                                game.add(item);
                                if (item.ObjectsToMoveOn) {
                                    player.canMoveOn(item.ObjectsToMoveOn);
                                }
                                break;
                            case "file":
                                var loader = new THREE.ObjectLoader();
                                loader.load(data.data.path, function(item) {
                                    if (data.position) item.position.set(data.position.x, data.position.y, data.position.z);
                                    if (data.rotation) item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                                    game.add(item);
                                });
                                break;
                        }


                    });


                    socket.on('add user', function(userdata) {
                        // console.log(userdata.name + " has joined");
                        // Users[userdata.id] = userdata;
                        // console.log(Users);
                        // // Users[userdata.id].object = (new Character()).model;
                        // Users[userdata.id].object = eval('new ' + userdata.type + '()');
                        // Users[userdata.id].object.name = userdata.name;
                        // game.add(Users[userdata.id].object);
                        // console.log(userdata);
                        // // because pos,rot is all 0 , so we don't set them

                        console.log("[Add user]", userdata.name, ":", Users);

                        Users[userdata.name] = userdata;
                        // Users[userdata.name].object = (new Character()).model;
                        Users[userdata.name].object = eval('new ' + userdata.type + '()');
                        Users[userdata.name].object.name = userdata.name;
                        game.add(Users[userdata.name].object);
                        // because pos,rot is all 0 , so we don't set them
                    })
                    socket.on('remove user', function(id) {
                        // console.log('remove user');
                        // console.log(Users);
                        // game.remove(Users[id].object);
                        // delete Users[username];

                        console.log('[remove user]', Users);
                        if (Users[username]) {
                            game.remove(Users[username].object);
                            delete Users[username];
                        }
                    });

                    socket.on('fetch userdata', function(receiver) {
                        // console.log("send data to" + receiver);
                        // socket.emit('update user to one', {
                        //     receiver: receiver,
                        //     position: game.Controller.position,
                        //     rotation: game.Controller.rotation
                        // });

                        console.log("send data to" + receiver);
                        socket.emit('update user to one', {
                            receiver: receiver,
                            position: game.Controller.position,
                            rotation: game.Controller.rotation
                        });
                    })




                    socket.on('update user', function(userdata) {
                        if (Users[userdata.id]) {
                            Users[userdata.id].object.position.x = userdata.position.x;
                            Users[userdata.id].object.position.y = userdata.position.y;
                            Users[userdata.id].object.position.z = userdata.position.z;
                            Users[userdata.id].object.rotation.y = userdata.rotation._y;
                            // Users[userdata.name].object.rotation.x = userdata.rotation.x;
                            // Users[userdata.name].object.rotation.y = userdata.rotation.y;
                            // Users[userdata.name].object.rotation.z = userdata.rotation.z;
                        }
                    });
                    socket.on('destroy game', function() {
                        // console.log("YO");
                        // game.stop();
                        // delete game;

                        console.log("[destroy Game]");
                        game.stop();
                        delete game;
                    });

                    socket.on('logout', function() {
                        console.log("[logout]");
                        game.stop();
                        delete game;
                        socket.disconnect();
                    });


                    ////////////////////
                    ////////MAIN////////
                    ////////////////////


                    socket.on('welcome', function() {
                        socket.emit('join', roomID);
                    })

                    // socket.emit('join', {
                    //     roomID: roomID
                    // });






                        $("#Black").animate({
                            'opacity': "0"
                        }, 3000, function() {
                            $("#Black").css({
                                'display': 'none'
                            });
                        });
                    });
                } else {
                    alert("Wrong In Username Or Password");
                    window.location = "/";
                    //加一個清除cookie?
                }
            }

        });　　　
    }
} else {
    document.write("Cookie 功能尚未啟動！");
    alert("你的瀏覽器設定不支援 Cookie，請先開啟瀏覽器的 Cookie 功能後，才能得到瀏覽本網頁的最佳效果！");
    // 在此加入不使用 Cookie 的程式碼
}






$("#GameAll").css({
    'display': 'none'
});
$("#enter").click(function() {
    //if ($('#inputEmail').val() != "" && $('#inputPassword').val() != "") {
    var send_data = {
        Account: $('#inputEmail').val(),
        Password: $("#inputPassword").val()
    }
    console.log(send_data.Account.length);
    if (checkCharacter(send_data.Account) == false || checkCharacter(send_data.Password) == false) {
        console.log("false");
        alert("請輸入正確的字元 (僅接受數字及大小寫英文字母!)");
        window.location = "/";
    }









    $.ajax({
        type: 'post',
        url: "login",
        dataTpye: "json",
        data: send_data,
        success: function(JSONData) {
            console.log(JSONData.msg);

            if (JSONData.msg == "success") {
                //cookie儲存
                Cookies.set("ID", $('#inputEmail').val(), { expires: 1 / 1440 });
                Cookies.set("PW", $('#inputPassword').val(), { expires: 1 / 1440 });
                console.log(Cookies.get(""));

                //var socket = io.connect();

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
                    console.log("Entered");

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


                    var socket = io.connect("/", { query: "username=" + username });
                    socket.on('sys', function(data) {
                        console.log('sys:' + data);
                    });
                    console.log("YO");
                    socket.on('create game', function(user) {
                        // player = eval("new " + data.character + "()");
                        // // player = new Character();
                        // game = new Game("GamePlay", player, socket);

                        // //to create gotoroomwindow
                        // var goToRoomWindow = new GoToRoomWindow(500, 200, socket);
                        // console.log(funcitonListWindow);
                        // functionListWindow.AppendItem("GoToRoom", "GoToRoom1", goToRoomWindow);
                        // //console.log("socket id" + socket.)
                        // console.log(socket);

                        console.log("[Create Game By User]", user);
                        player = eval("new " + user.type + "()");
                        // player = new Character();
                        game = new Game("GamePlay", player, socket);
                        console.log("[game created]", game.scene);
                    });

                    socket.on('start game', function() {
                        game.start();
                        console.log(game.scene);
                    });

                    socket.on('render item', function(data) {
                        // switch (data.item.type) {
                        //     case "script":
                        //         var scripts = "var item = ";
                        //         scripts += data.item.data.scripts.join();
                        //         eval(scripts);
                        //         item.position.set(data.position.x, data.position.y, data.position.z);
                        //         item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                        //         game.add(item);
                        //         if (item.ObjectsToMoveOn) {
                        //             player.canMoveOn(item.ObjectsToMoveOn);
                        //         }
                        //         break;
                        //     case "file":
                        //         var loader = new THREE.ObjectLoader();
                        //         loader.load(data.item.data.path, function(item) {
                        //             item.position.set(data.position.x, data.position.y, data.position.z);
                        //             item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                        //             game.add(item);
                        //         });
                        //         break;
                        // }

                        console.log("[Render Item] ", data.id);
                        switch (data.type) {
                            case "script":
                                var scripts = "var item = ";
                                scripts += data.data.scripts.join();
                                eval(scripts);
                                if (data.position)
                                    item.position.set(data.position.x, data.position.y, data.position.z);
                                if (data.rotation)
                                    item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                                game.add(item);
                                if (item.ObjectsToMoveOn) {
                                    player.canMoveOn(item.ObjectsToMoveOn);
                                }
                                break;
                            case "file":
                                var loader = new THREE.ObjectLoader();
                                loader.load(data.data.path, function(item) {
                                    if (data.position) item.position.set(data.position.x, data.position.y, data.position.z);
                                    if (data.rotation) item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                                    game.add(item);
                                });
                                break;
                        }


                    });


                    socket.on('add user', function(userdata) {
                        // console.log(userdata.name + " has joined");
                        // Users[userdata.id] = userdata;
                        // console.log(Users);
                        // // Users[userdata.id].object = (new Character()).model;
                        // Users[userdata.id].object = eval('new ' + userdata.type + '()');
                        // Users[userdata.id].object.name = userdata.name;
                        // game.add(Users[userdata.id].object);
                        // console.log(userdata);
                        // // because pos,rot is all 0 , so we don't set them

                        console.log("[Add user]", userdata.name, ":", Users);

                        Users[userdata.name] = userdata;
                        // Users[userdata.name].object = (new Character()).model;
                        Users[userdata.name].object = eval('new ' + userdata.type + '()');
                        Users[userdata.name].object.name = userdata.name;
                        game.add(Users[userdata.name].object);
                        // because pos,rot is all 0 , so we don't set them
                    })
                    socket.on('remove user', function(id) {
                        // console.log('remove user');
                        // console.log(Users);
                        // game.remove(Users[id].object);
                        // delete Users[username];

                        console.log('[remove user]', Users);
                        if (Users[username]) {
                            game.remove(Users[username].object);
                            delete Users[username];
                        }
                    });

                    socket.on('fetch userdata', function(receiver) {
                        // console.log("send data to" + receiver);
                        // socket.emit('update user to one', {
                        //     receiver: receiver,
                        //     position: game.Controller.position,
                        //     rotation: game.Controller.rotation
                        // });

                        console.log("send data to" + receiver);
                        socket.emit('update user to one', {
                            receiver: receiver,
                            position: game.Controller.position,
                            rotation: game.Controller.rotation
                        });
                    })




                    socket.on('update user', function(userdata) {
                        if (Users[userdata.id]) {
                            Users[userdata.id].object.position.x = userdata.position.x;
                            Users[userdata.id].object.position.y = userdata.position.y;
                            Users[userdata.id].object.position.z = userdata.position.z;
                            Users[userdata.id].object.rotation.y = userdata.rotation._y;
                            // Users[userdata.name].object.rotation.x = userdata.rotation.x;
                            // Users[userdata.name].object.rotation.y = userdata.rotation.y;
                            // Users[userdata.name].object.rotation.z = userdata.rotation.z;
                        }
                    });
                    socket.on('destroy game', function() {
                        // console.log("YO");
                        // game.stop();
                        // delete game;

                        console.log("[destroy Game]");
                        game.stop();
                        delete game;
                    });

                    socket.on('logout', function() {
                        console.log("[logout]");
                        game.stop();
                        delete game;
                        socket.disconnect();
                    });


                    ////////////////////
                    ////////MAIN////////
                    ////////////////////


                    socket.on('welcome', function() {
                        socket.emit('join', roomID);
                    })

                    // socket.emit('join', {
                    //     roomID: roomID
                    // });



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
                alert("Wrong In Username Or Password");
                window.location = "/";
            }
        }

    });
});
