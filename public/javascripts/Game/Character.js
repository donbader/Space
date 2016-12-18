(function(){
const VIEW_ANGLE = 45,
    ASPECT = 16/9,
    NEAR = 0.1,
    FAR = 20000,
    PI_2 = Math.PI /2;

const MOUSE_STATE = {NONE: 0, KEYDOWN: 1, KEYUP: 2};
const gravity = 980;

const MODE_STATE = {FIRST_PERSON: 0, THIRD_PERSON: 1, DRAW: 2 }
var Character = this.Character = THREE.Object3D.extend({
    init: function(){
        'use strict';
        var scope = this;
        var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.type = "Character";


        this.position.set(0,this.height / 2,500);
        // Body
        this.body = new THREE.Mesh(new THREE.CubeGeometry(50, this.height,50), new THREE.MeshPhongMaterial( { color: 0x00ffff } ));
        this.body.position.set(0,this.height/2,0);
        this.add(this.body);

        // eye
        this.eye = new THREE.Object3D();
        this.eye.add(camera);
        this.body.add(this.eye);

        // mode
        this.mode = {
            state: 0,
            firstPerson: function(){
                scope.eye.position.set(0,scope.height-10,0);
            },
            thirdPerson: function(){
                scope.eye.position.set(0,scope.height+300,500);
                scope.turn(0, -0.7);
            },
            whiteBoard: function(){

            }
        };
        this.mode.thirdPerson();
        ////////////////////////////
        ///// Controls /////////////
        ////////////////////////////
        var controls = this.controls = {
            enable: false,
            camera: camera,
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
            positionFlag: new THREE.Mesh(new THREE.BoxGeometry( 5, 30, 5 ), new THREE.MeshPhongMaterial( { color: 0xff0000 } )),
            Obstacles: [],
            ObjectsToSelect: [],
            ObjectsToMoveOn: [],
            walk: {
    			destination: {x:0, y:0, z:0},
    			ing:false,
    			speed: 500.0
    		},
            /*******************
             * Controls Events *
             *******************/
            enable: function(bool, dom){
                dom = dom || document;

                if(bool){
                    var on = dom.addEventListener;
                    on('keydown', controls.onKeyDown);
                    on('keyup', controls.onKeyUp);
                    on('mousedown', controls.onMouseDown);
                    on('mouseup', controls.onMouseUp);
                    on('mousemove', controls.onMouseMove);
                    on('mousewheel', controls.onMouseWheel);
                    on('dblclick', controls.onMouseAtObject);
                    on('contextmenu', controls.onRightClick);

                    controls.enabled = true;
                }
                else {
                    var off = dom.removeEventListener;
                    off('keydown', controls.onKeyDown);
                    off('keyup', controls.onKeyUp);
                    off('mousedown', controls.onMouseDown);
                    off('mouseup', controls.onMouseUp);
                    off('mousemove', controls.onMouseMove);
                    off('mousewheel', controls.onMouseWheel);
                    off('dblclick', controls.onMouseAtObject);
                    off('contextmenu', controls.onRightClick);

                    controls.enabled = false;
                }
            },
            onKeyDown: function(event){
            	switch(event.keyCode){
                case 38: // up
                    event.preventDefault();
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
                    event.preventDefault();
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
                    event.preventDefault();
                    if (controls.canJump === true) controls.velocity.y += controls.jumpVelocity;
                    controls.canJump = false;
                    break;
            	}
            },
            onKeyUp: function(event){
                switch (event.keyCode) {
                    case 38: // up
                        event.preventDefault();
                    case 87: // w
                        controls.moveForward = false;
                        break;

                    case 37: // left
                    case 65: // a
                        controls.moveLeft = false;
                        break;

                    case 40: // down
                        event.preventDefault();
                    case 83: // s
                        controls.moveBackward = false;
                        break;

                    case 39: // right
                    case 68: // d
                        controls.moveRight = false;
                        break;
                }
            },
            onMouseMove: function(event){
            	var mouse = controls.mouse;
            	if(mouse.state != MOUSE_STATE.KEYDOWN) return;

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                scope.turn(-movementX * mouse.sensitivity, -movementY * mouse.sensitivity);

            },
            onMouseDown: function(event){
            	controls.mouse.state = MOUSE_STATE.KEYDOWN;
            },
            onRightClick: function(event){
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
            },
            onMouseUp:function(event){
            	controls.mouse.state = MOUSE_STATE.KEYUP;
            },
            onMouseWheel: function(event){
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
            },
            onMouseAtObject: function(event){
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
            },
            zoomIn: function(zoomScale){
            	if(zoomScale === undefined)
            		zoomScale = controls.getZoomScale();
            	controls.camera.zoom /= zoomScale;
            	if(controls.camera.zoom > controls.zoomScaleMax)
            		controls.camera.zoom = controls.zoomScaleMax;
            	controls.camera.updateProjectionMatrix();
            },
            zoomOut: function(zoomScale){
            	if(zoomScale === undefined)
            		zoomScale = controls.getZoomScale();
            	controls.camera.zoom *= zoomScale;
            	if(controls.camera.zoom < controls.zoomScaleMin)
            		controls.camera.zoom = controls.zoomScaleMin;
            	controls.camera.updateProjectionMatrix();
            },
            getZoomScale: ()=>Math.pow( 0.97, controls.zoomSpeed )


        };

        controls.positionFlag.height = 30;

    },
    update: function(delta){

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

        if ( this.position.y <= 0 ) {
            controls.velocity.y = 0;
            this.position.y = 0;
            controls.canJump = true;
        }
    },
    ServerUpdate: function(){
        if(!this.socket)return;
        var scope = this;
        this.socket.emit('update user to all', {
            position: scope.position,
            rotation: scope.rotation
        });
    },
    move: function(x, y, z){
        this.position.x += x || 0;
		this.position.y += y || 0;
		this.position.z += z || 0;
        if(x || y || z && this.socket){
            this.ServerUpdate();
        }
    },
    translate: function(x,y,z){
        this.translateX(x || 0);
        this.translateY(y || 0);
        this.translateZ(z || 0);
        if(x || this.position.y || z && this.socket){
            this.ServerUpdate();
        };
    },
    turn: function(x,y){
        x = x || 0;
        y = y || 0;
        this.rotation.y += x;
        this.eye.rotation.x += y;
        this.eye.rotation.x = Math.max( - PI_2, Math.min( PI_2, this.eye.rotation.x ) );
        if(x || y && this.socket){
            this.ServerUpdate();
        }
    },
    walkFunction: function(destination){
		var deltaX = destination.x - this.position.x;
		var deltaZ = destination.z - this.position.z;
		var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2));
		this.controls.velocity.x = deltaX / distance * this.controls.walk.speed;
		this.controls.velocity.z = deltaZ / distance * this.controls.walk.speed;
		if(distance <= 10){
			this.controls.walk.ing = false;
			this.controls.velocity.x = 0;
			this.controls.velocity.z = 0;
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
    addObj: function(obj, position){
        this.body.add(obj);
        obj.position.set(position.x, position.y, position.z);
    },
    height: 170,


});



})();
