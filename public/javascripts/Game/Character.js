(function(){
const MOUSE_STATE = {NONE: 0, KEYDOWN: 1, KEYUP: 2, DRAWING: 3,};
const MODE_STATE = {FIRST_PERSON: 0, THIRD_PERSON: 1, WHITEBOARD: 2 }

const PI_2 = Math.PI / 2;
const gravity = 980;

var Scene, Eye;

var Character = this.Character = Class.extend({
	init: function(args){
		'use strict';
		// init with args

		// init with default Value
	    var VIEW_ANGLE = 45,
	        ASPECT = 16/9,
	        NEAR = 0.1,
	        FAR = 20000;
	    this.controls.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);


		/*****************
		 *    Model      *
		 *****************/
		// init eye
		this.eye.add(new THREE.Object3D().add(this.controls.camera));
		this.setMode(MODE_STATE.THIRD_PERSON);

		// init body
		this.body = new THREE.Mesh(new THREE.CubeGeometry(50, this.height,50), new THREE.MeshPhongMaterial( { color: 0x00ffff } ));
		this.body.name = this.name;
		this.body.position.set(0, this.height / 2, 0);
		this.body.add(this.eye);
        Eye = this.eye;

		// init model
		this.model.add(this.body);
		this.model.add(this.flashLight);
	    this.flashLight.position.set(0,this.height + 10,0);

		// init position Flag
		this.controls.positionFlag = new THREE.Mesh(new THREE.BoxGeometry( 5, 30, 5 ), new THREE.MeshPhongMaterial( { color: 0xff0000 } ));
		this.controls.positionFlag.height = 30;

	},
	in: function(scene, renderer){
		this.scene = scene;
        Scene = scene;
		this.renderer = renderer;
		// reset aspect
	    var SCREEN_WIDTH = renderer.getSize().width,
	        SCREEN_HEIGHT = renderer.getSize().height;
	    this.controls.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

	    scene.add(this.model);
	    scene.add(this.controls.positionFlag);

	},
	third_person: function(enable){
		if(enable){
			this.eye.position.set(0,this.height+300,500);
			this.turn(0, -0.7);
		}
		else
			this.eye.position.set(0,this.height/2-10,0);

	},
	translate: function(x, y, z){
		x = x || 0;
		y = y || 0;
		z = z || 0;

		this.model.translateX(x);
		this.model.translateY(y);
		this.model.translateZ(z);
	},
	move: function(x,y,z){
		var position = this.position();
		position.x += x;
		position.y += y;
		position.z += z;
	},
	moveTo: function (x, y, z){
		var position = this.position();
		position.x = x;
		position.y = y;
		position.z = z;
	},
	turn: function(x, y){
		x = x || 0;
		y = y || 0;
		var yawObject = this.eye;
		var pitchObject = yawObject.children[0];
		this.model.rotation.y += x;
		pitchObject.rotation.x += y;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
	},
	walkFunction: function(destination){
		var deltaX = destination.x - this.model.position.x;
		var deltaZ = destination.z - this.model.position.z;
		var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2));
		controls.velocity.x = deltaX / distance * this.controls.walk.speed;
		controls.velocity.z = deltaZ / distance * this.controls.walk.speed;
		if(distance <= 10){
			controls.walk.ing = false;
			controls.velocity.x = 0;
			controls.velocity.z = 0;
		}

	},
	position: function(){
		return this.model.position;
	},
	animate: function(delta){


		if(!this.controls.enabled)return;

		var controls = this.controls;
		if(controls.walk.ing){
    		this.walkFunction(controls.walk.destination);
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

        if ( this.model.position.y <= 0 ) {
            controls.velocity.y = 0;
            this.model.position.y = 0;
            controls.canJump = true;
        }
	},
	canSelect: function(arr){
		this.controls.ObjectsToSelect = this.controls.ObjectsToSelect.concat(arr);
		return this.controls.ObjectsToSelect;
	},
	canMoveOn: function(arr){
		this.controls.ObjectsToMoveOn = this.controls.ObjectsToMoveOn.concat(arr);
		return this.controls.ObjectsToMoveOn;
	},

	/*****************
	 *    Controls   *
	 *****************/
	// Note: zoomSpeed, moveVelicity ... make to json file, and load

	controls: {
		enabled: false,
		camera: '',
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
		walk: {
			destination: {x:0, y:0, z:0},
			ing:false,
			speed: 500.0,
			to: function(x,z){
				this.ing = true;
				this.destination.x = x;
				this.destination.z = z;
			}
		},
		ObjectsToSelect: [],
		ObjectsColliadble: [],
		ObjectsToMoveOn: [],
 		enable: function(dom){
 			dom = dom || document;
 			var on = dom.addEventListener;
 			on('keydown', this.onKeyDown);
 			on('keyup', this.onKeyUp);
			on('mousedown', this.onMouseDown);
			on('mouseup', this.onMouseUp);
			on('mousemove', this.onMouseMove);
			on('mousewheel', this.onMouseWheel);
			on('dblclick', this.onMouseAtObject);
			on('contextmenu', this.onRightClick);
            on('click', this.onLeftClick);

			this.enabled = true;
 		},
		disable: function(dom){
 			dom = dom || document;
 			var off = dom.removeEventListener;
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




	/*****************
	 *    Elements   *
	 *****************/
	name: 'Fuck',
	gender: 'Male',
	height: 170,
	weight: 70,
	model: new THREE.Object3D(),
	body: '',
	eye: new THREE.Object3D(),
	flashLight: new THREE.PointLight(0xffffff,0.3, 1000),
	mode:{
		current: MODE_STATE.FIRST_PERSON,
		previous: MODE_STATE.FIRST_PERSON,
	},
	setMode: function(m){
		this.mode.current = m;
		console.log("change mode__");
		console.log("current: "+this.mode.current);
		console.log("previous: "+this.mode.previous);
		switch (m) {
			case MODE_STATE.FIRST_PERSON:
				this.eye.position.set(0,this.height/2-10,0);
				break;
			case MODE_STATE.THIRD_PERSON:
				this.eye.position.set(0,this.height+300,500);
				this.turn(0, -0.7);
				break;
			case MODE_STATE.WHITEBOARD:
				this.walk.ing
				break;
			default:

		}
		return this;
	}
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
        break;

    case 37: // left
    case 65: // a
        controls.moveLeft = true;
        break;

    case 40: // down
    case 83: // s
        controls.moveBackward = true;
        break;

    case 39: // right
    case 68: // d
        controls.moveRight = true;
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

    controls.onMouseMove = function(event) {
        var mouse = controls.mouse;
        /*
	if(mouse.state != MOUSE_STATE.KEYDOWN) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    character.turn(-movementX * mouse.sensitivity, -movementY * mouse.sensitivity);
    */

        switch (mouse.state) {
            case MOUSE_STATE.KEYDOWN:
                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                character.turn(-movementX * mouse.sensitivity, -movementY * mouse.sensitivity);
                break;
            case MOUSE_STATE.DRAWING:
                //drawing mode 1 & 3
                controls.onLeftClick(event);
                break;
        }

    }
    controls.onMouseDown = function(event) {
        controls.mouse.state = MOUSE_STATE.KEYDOWN;

        //drawing mode 1 & 3
        controls.mouse.state = MOUSE_STATE.DRAWING;
    }

    controls.onLeftClick = function(event) {
        event.preventDefault();

        var mousePosition = new THREE.Vector3();
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = 1 - (event.clientY / window.innerHeight) * 2;

        var ray = new THREE.Raycaster();
        ray.setFromCamera(mousePosition, controls.camera);

        /*
        //drawing mode 0
        
        var intersects = ray.intersectObjects(controls.ObjectsToMoveOn, true);

        if (intersects.length) {
            //drawing point
            var point = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            point.position.set(intersects[0].point.x, intersects[0].point.y + 10, intersects[0].point.z);
            Scene.add(point);
        }
		*/

        //drawing mode 2
        var direction = ray.ray.direction;
        direction.multiplyScalar(500);
        var eyeWorldPosition = new THREE.Vector3().setFromMatrixPosition(Eye.matrixWorld);
        var point = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        point.position.set(eyeWorldPosition.x + direction.x, eyeWorldPosition.y + direction.y + 10, eyeWorldPosition.z + direction.z);
        Scene.add(point);
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
		controls.walk.to(intersects[0].point.x, intersects[0].point.z)
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
