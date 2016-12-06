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
                    username: JSONData.id
                });

                // console.log("ID=",id);
                //document.getElementById("Black").style.display = "inline";
                $("#Black").css({
                    'display': 'inline'
                });
                $("#Black").animate({
                    'opacity': '1'
                }, 5000, function() {
                    $("#SignInPage").css({
                        'display': 'none'
                    });
                    console.log("1234");
                    $("#GameAll").css({
                        'display': 'inline'
                    });
                    console.log("000");
                    var Ninja = Character.extend({
                        init: function() {
                            this._super();
                            this.body.material.color.setHex(0x000000);
                        }
                    });

                    var game = new Game("GamePlay", new Ninja(), new World());
                    // game.useDefaultWorld();

                    var room = new Room(2048, 2048, 500, 0xf88399);
                    game.add(room);
                    // var world = new World();
                    // console.log(world.addLightAtWall);

                    var loader = new THREE.ObjectLoader();
                    loader.load("3D/desk/chair.json", function(object) {
                        object.position.set(0, 0, 300);
                        object.rotation.set(4.71, 0, 3.14);
                        game.add(object);
                    });

                    loader = new THREE.ObjectLoader();

                    // need ray caster ( player can select)
                    loader.load("/3D/table/table.json", function(object) {
                        object.position.set(0, 0, 150);
                        game.add(object);
                    });
                    loader = new THREE.ObjectLoader();

                    loader.load("3D/laptop/laptop.json", function(object) {
                        object.scale.set(3, 3, 3);
                        object.position.set(0, 100, 150);
                        game.add(object);
                        // var link = $('<a></a>');
                        // var dataURL =  'data:application/json;charset=utf-8' + encodeURIComponent(JSON.stringify(object));
                        // link.data("href", dataURL);
                        // link.click();

                    });

                    loader = new THREE.ObjectLoader();

                    loader.load("3D/books/book.json", function(object) {
                        object.position.set(50, 100, 150);
                        game.add(object);
                        console.log(object);
                    });



                    game.start();

                    console.log("12345");
                    $("#Black").animate({
                        'opacity': "0"
                    }, 5000, function() {
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
