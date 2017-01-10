$("#GamePlay").on('AfterLogIn', ()=>{

var gui = new dat.GUI({
    width: 350,
    height: 700
});
gui.domElement.id = 'gui';
$(gui.domElement).on('dragover',function(event){
  event.preventDefault();
})
var parameters = {
    name: function() {},
    room: roomID,

    Control_Mode: function() {},
    FirstPerson_view: function() {
        player.view();
    },
    ThirdPerson_view: function() {
        player.view();
    },

    Normal_Mode: function() {
        player.controls.mode("NORMAL");
    },
    CS_Mode: function() {
        player.controls.mode("CS");
    },
    Edit_Mode: function() {
        player.controls.mode("OBJ_EDITING");
    },

    VoXEL: function() {

    },
    Create_mode: function() {
        player.controls.mode("VOXEL");
        player.controls.voxelPainter.mode("CREATE");
    },
    Destory_mode: function() {
        player.controls.mode("VOXEL");
        player.controls.voxelPainter.mode("DESTROY");
    },
    Add_Friend: "",
    Painting_Brush: function(){},
    Painting_Eraser: function(){},
    color : [ 0, 128, 255 ],
    FontSize : 100,
    Painting_Reset: function(){},
    


    //
    //
    // friend1 : function(){alert("hi")},
    // friend2 : function(){},
    // friend3 : function(){}, // numeric

    // b: 200, // numeric slider
    // c: "Hello, GUI!", // string
    //   d: false, // boolean (checkbox)
    // e: "#ff8800", // color (hex)
    // f: function() { alert("Hello!") },
    // g: function() { alert( parameters ) },
    // v : 0,    // dummy value, only type is important
    // w: "...", // dummy value, only type is important
    // x: 0, y: 0, z: 0
};

gui.add(parameters, 'name').name("WELLCOME  " + username);

var ToolsFolder = gui.addFolder('TOOLS');
ToolsFolder.add(parameters, 'Painting_Brush').name('Brush');

ToolsFolder.addColor(parameters, 'color');

var controller = ToolsFolder.add(parameters,'FontSize',0,25);
controller.onChange(function(value){});

ToolsFolder.add(parameters, 'Painting_Eraser').name('Eraser');
ToolsFolder.add(parameters, 'Painting_Reset').name('Reset');

var ViewsFloder = gui.addFolder('VIEWS');
ViewsFloder.add(parameters, 'FirstPerson_view').name("First-Person");
ViewsFloder.add(parameters, 'ThirdPerson_view').name("Third-Person");

var ControlsFloder = gui.addFolder('MANIPULATE')
ControlsFloder.add(parameters, 'Normal_Mode').name("Normal");
ControlsFloder.add(parameters, 'CS_Mode').name("CS");
ControlsFloder.add(parameters, 'Edit_Mode').name("Edit");

var VoXEL_Mode = ControlsFloder.addFolder("VoXEL");
VoXEL_Mode.add(parameters, "Create_mode").name("Create");
VoXEL_Mode.add(parameters, "Destory_mode").name("Destory");

var FriendsFolder = gui.addFolder('FRIENDS');

/////////////////////////SwitchRoom//////////////////////////
var switchRoom = FriendsFolder.add(parameters,'room' ).name('Switch Room');
// var switchRoom = gui.add(parameters, 'room').name("Switch Room");
switchRoom.onChange(function(value) {
    player.controls.mode('TYPING');
})

switchRoom.onFinishChange(function(value) {
    // Connect to other's room
});

switchRoom.domElement.addEventListener('click', function(event) {
    console.log(event);
    player.controls.mode("TYPING");
})                        



/////////////////////////Add Friend//////////////////////////
var Add_Friend = FriendsFolder.add(parameters,'Add_Friend' ).name('Add Friends');
// var Add_Friend = gui.add(parameters, 'Add_Friend').name("Add Friends")
var FriendListFolder = FriendsFolder.addFolder('Friend List');
Add_Friend.onFinishChange(function(value) {
    console.log(value);
    parameters[value] = function() {
        socket.emit('fuck', roomID);
        console.log("fuck");
    };
    console.log(parameters);
    FriendListFolder.add(parameters, value).name(value);
    player.controls.mode("NORMAL");
});

Add_Friend.domElement.addEventListener('click', function(event) {
    console.log(event);
    player.controls.mode("TYPING");
    console.log("1");
})


/////////////////////////Add Friend//////////////////////////


// gui.add( parameters, 'b' ).min(128).max(256).step(16).name('Slider');
// gui.add( parameters, 'c' ).name('String');
// gui.add( parameters, 'd' ).name('Boolean');
//
// gui.addColor( parameters, 'e' ).name('Color');
//
// var numberList = [1, 2, 3];
// gui.add( parameters, 'v', numberList ).name('List');
//
// var stringList = ["One", "Two", "Three"];
// gui.add( parameters, 'w', stringList ).name('List');
//
// gui.add( parameters, 'f' ).name('Say "Hello!"');
// gui.add( parameters, 'g' ).name("Alert Message");
//
// var FriendsFloder = gui.addFolder('Friends');
// FriendsFloder.add( parameters, 'friend1' );
// FriendsFloder.add( parameters, 'friend2' );
// FriendsFloder.add( parameters, 'friend3' );
// folder1.add( parameters, 'y' );
// folder1.close();
gui.open();
});