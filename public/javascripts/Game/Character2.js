(function(){
const VIEW_ANGLE = 45,
    ASPECT = 16/9,
    NEAR = 0.1,
    FAR = 20000,
    PI_2 = Math.PI /2;

const MOUSE_STATE = {NONE: 0, KEYDOWN: 1, KEYUP: 2};
const gravity = 980;

const MODE_STATE = {FIRST_PERSON: 0, THIRD_PERSON: 1, WHITEBOARD: 2 }
var character;
var Character = this.Character = THREE.Object3D.extend({
    init: function(){
        character = this;
        this.type = "Character";


        this.position.set(0,this.height / 2,500);
        // Body
        this.body = new THREE.Mesh(new THREE.CubeGeometry(50, this.height,50), new THREE.MeshPhongMaterial( { color: 0x00ffff } ));
        this.body.position.set(0,this.height/2,0);
        this.add(this.body);

        // eye
        this.eye.add(this.controls.camera);
        this.body.add(this.eye);

        // position Flag
        this.controls.positionFlag= new THREE.Mesh(new THREE.BoxGeometry( 5, 30, 5 ), new THREE.MeshPhongMaterial( { color: 0xff0000 } ));
        this.controls.positionFlag.height = 30;

        // mode
        this.mode = {
            state: 0,
            firstPerson: function(){
                character.eye.position.set(0,character.height-10,0);
            },
            thirdPerson: function(){
                character.eye.position.set(0,character.height+300,500);
                character.direction(0, -0.7);
            },
            whiteBoard: function(){

            }
        };
        // this.mode.firstPerson();
        this.mode.thirdPerson();

    },
    animate: function(delta){

		if(!this.controls.enabled)return;

		var controls = this.controls;
		if(controls.walk.ing){
    		this.walkToDestination(controls.walk.destination);
			controls.velocity.x -= controls.velocity.x * 5 * delta;
			controls.velocity.z -= controls.velocity.z * 5 * delta;
			controls.velocity.y -= gravity * delta; // v = v0 + at
			if(Math.abs(controls.velocity.x) < 0.1) controls.velocity.x = 0;
			if(Math.abs(controls.velocity.z) < 0.1) controls.velocity.z = 0;

			this.move(controls.velocity.x * delta, controls.velocity.y * delta, controls.velocity.z * delta);
    	}
		else{
			controls.velocity.x -= controls.velocity.x * 5 * delta;
			controls.velocity.z -= controls.velocity.z * 5 * delta;
			controls.velocity.y -= gravity * delta; // v = v0 + at
	        if(Math.abs(controls.velocity.x) < 0.1) controls.velocity.x = 0;
	        if(Math.abs(controls.velocity.z) < 0.1) controls.velocity.z = 0;
			// Key
			if ( controls.moveForward )controls.velocity.z -= controls.moveVelocity * delta;
	        if ( controls.moveBackward )controls.velocity.z += controls.moveVelocity * delta;
	        if ( controls.moveLeft )controls.velocity.x -= controls.moveVelocity * delta;
	        if ( controls.moveRight )controls.velocity.x += controls.moveVelocity * delta;
			this.translate(controls.velocity.x * delta, controls.velocity.y * delta, controls.velocity.z * delta);
		}

        if ( this.position.y <= 0 ) {
            controls.velocity.y = 0;
            this.position.y = 0;
            controls.canJump = true;
        }
    },
    move: function(x, y, z){
        character.position.x += x || 0;
		character.position.y += y || 0;
		character.position.z += z || 0;
    },
    walkToDestination: function(destination){
		var deltaX = destination.x - this.position.x;
		var deltaZ = destination.z - this.position.z;
		var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2));
		controls.velocity.x = deltaX / distance * this.controls.walk.speed;
		controls.velocity.z = deltaZ / distance * this.controls.walk.speed;
		if(distance <= 10){
			controls.walk.ing = false;
			controls.velocity.x = 0;
			controls.velocity.z = 0;
		}

	},
    translate: function(x,y,z){
		character.translateX(x || 0);
		character.translateY(y || 0);
		character.translateZ(z || 0);
    },
    direction: function(x,y){
        x = x || 0;
        y = y || 0;
        character.rotation.y += x;
        character.eye.rotation.x += y;
        character.eye.rotation.x = Math.max( - PI_2, Math.min( PI_2, this.eye.rotation.x ) );
    },
    canSelect: function(arr){
        this.controls.ObjectsToSelect = this.controls.ObjectsToSelect.concat(arr);
        return this.controls.ObjectsToSelect;
    },
    canMoveOn: function(arr){
        this.controls.ObjectsToMoveOn = this.controls.ObjectsToMoveOn.concat(arr);
        return this.controls.ObjectsToMoveOn;
    },
    controls: {
        enable: false,
        camera: new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR),
        zoomSpeed: 1.0,
        zoomScaleMax: 5,
        zoomScaleMin: 1,
        mouse: {state: MOUSE_STATE.NONE, sensitivity: 0.001},
        moveForward:false,
        moveBackward:false,
        moveLeft:false,
        moveRight:false,
        canJump:false,
        velocity: new THREE.Vector3(),
		moveVelocity: 1000.0,
		jumpVelocity: 350.0,
        positionFlag: '',
        ObjectsToSelect: [],
        ObjectsToMoveOn: [],
        walk: {
			destination: {x:0, y:0, z:0},
			ing:false,
			speed: 500.0
		},
        enable: function(dom){
            var on = (dom || document).addEventListener;
            on('keydown', this.onKeyDown);
 			on('keyup', this.onKeyUp);
			on('mousedown', this.onMouseDown);
			on('mouseup', this.onMouseUp);
			on('mousemove', this.onMouseMove);
			on('mousewheel', this.onMouseWheel);
			on('dblclick', this.onMouseAtObject);
			on('contextmenu', this.onRightClick);
            this.enabled = true;
        },
        disable: function(dom){
            var off = (dom || document).addEventListener;
            off('keydown', this.onKeyDown);
 			off('keyup', this.onKeyUp);
			off('mousedown', this.onMouseDown);
			off('mouseup', this.onMouseUp);
			off('mousemove', this.onMouseMove);
			off('mousewheel', this.onMouseWheel);
			off('dblclick', this.onMouseAtObject);
			off('contextmenu', this.onRightClick);
            this.enabled = false;
        }
    },
    height: 170,
    eye: new THREE.Object3D()

});

/*******************
 * Controls Events *
 *******************/
var character = Character.prototype;
var controls = character.controls;
controls.onKeyDown = function(event){
	event.preventDefault();
	switch(event.keyCode){
    case 38: // up
    case 87: // w
        controls.moveForward = true;
		controls.walk.ing = false;
        break;

    case 37: // left
    case 65: // a
        controls.moveLeft = true;
		controls.walk.ing = false;
        break;

    case 40: // down
    case 83: // s
        controls.moveBackward = true;
		controls.walk.ing = false;
        break;

    case 39: // right
    case 68: // d
        controls.moveRight = true;
		controls.walk.ing = false;
        break;

    case 32: // space
        if (controls.canJump === true) controls.velocity.y += controls.jumpVelocity;
        controls.canJump = false;
        break;
	}
};

controls.onKeyUp = function(event){
	event.preventDefault();
    switch (event.keyCode) {

        case 38: // up
        case 87: // w
            controls.moveForward = false;
            break;

        case 37: // left
        case 65: // a
            controls.moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            controls.moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            controls.moveRight = false;
            break;
    }
};

controls.onMouseMove = function(event){
	var mouse = controls.mouse;
	if(mouse.state != MOUSE_STATE.KEYDOWN) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    character.direction(-movementX * mouse.sensitivity, -movementY * mouse.sensitivity);

}
controls.onMouseDown = function(event){
	controls.mouse.state = MOUSE_STATE.KEYDOWN;
}

controls.onRightClick = function(event){
	event.preventDefault();
	var mousePosition = new THREE.Vector2();
	mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mousePosition.y = 1 - ( event.clientY / window.innerHeight ) * 2;

	var ray = new THREE.Raycaster();
	ray.setFromCamera(mousePosition, controls.camera);
	var intersects = ray.intersectObjects(controls.ObjectsToMoveOn, true);

	if(intersects.length){
		var positionFlag = controls.positionFlag;
		positionFlag.position.set(intersects[0].point.x, intersects[0].point.y + positionFlag.height/2, intersects[0].point.z);
		controls.walk.ing = true;
		controls.walk.destination.x = intersects[0].point.x;
		controls.walk.destination.z = intersects[0].point.z;
	}
}

controls.onMouseUp = function(event){
	controls.mouse.state = MOUSE_STATE.KEYUP;
}

controls.onMouseWheel = function(event){
	event.preventDefault();

	var delta = 0;
	if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
		delta = event.wheelDelta;
	}
	else if ( event.detail ) { // Firefox
		delta = - event.detail;
	}

	if ( delta > 0 ) {
		controls.zoomOut();
	} else {
		controls.zoomIn();
	}

}
controls.onMouseAtObject = function(event){
    // event.preventDefault();
	var mousePosition = new THREE.Vector2();
	mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mousePosition.y = 1 - ( event.clientY / window.innerHeight ) * 2;

	var ray = new THREE.Raycaster();
	ray.setFromCamera(mousePosition, controls.camera);
	var intersects = ray.intersectObjects(controls.ObjectsToSelect, true);
	if(intersects.length){
		var obj = intersects[0].object;
		while(obj.parent.type != "Scene"){obj = obj.parent;}
		console.log(obj.name);
	}
}

controls.zoomIn = function(zoomScale){
	if(zoomScale === undefined)
		zoomScale = getZoomScale();
	controls.camera.zoom /= zoomScale;
	if(controls.camera.zoom > controls.zoomScaleMax)
		controls.camera.zoom = controls.zoomScaleMax;
	controls.camera.updateProjectionMatrix();
}
controls.zoomOut = function(zoomScale){
	if(zoomScale === undefined)
		zoomScale = getZoomScale();
	controls.camera.zoom *= zoomScale;
	if(controls.camera.zoom < controls.zoomScaleMin)
		controls.camera.zoom = controls.zoomScaleMin;
	controls.camera.updateProjectionMatrix();
}

function getZoomScale(){
	return Math.pow( 0.97, controls.zoomSpeed );
}

})();
