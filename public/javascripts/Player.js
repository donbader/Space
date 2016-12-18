THREE.Player = function (gender, height, weight){
//----------------------------------------------------
	var player = this;

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 20000;

    const MOUSE_STATE = {NONE: 0, KEYDOWN: 1, KEYUP: 2};
    const PI_2 = Math.PI / 2;
    const gravity = 980;

//----------------------------------------------------
// elements
	player.posFlag = '';
	player.gender = gender || 'Male';
	player.height = height || 170;
	player.weight = weight || 70;
	player.controls = {
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
		ObjectsToPick: [],
		ObjectsColliadble: []
	};

	// body
	player.eye = new THREE.Object3D();
	player.body = new THREE.Object3D();
	player.model = new THREE.Mesh(new THREE.CubeGeometry(50,player.height,50), new THREE.MeshPhongMaterial( { color: 0xffff00 } ));
	player.light = new THREE.PointLight(0xffffff,3,500);
	// console.log(player.model);
	// init

//----------------------------------------------------
// functions
	player.init = function(){
		// add
		player.body.add(player.eye);
		player.body.add(player.model);

		// modify
		player.model.position.set(0,player.height/2,0);


		player.controls.third_person(true);
		player.controls.init();
	}

	player.controls.init = function () {
		// implement eye
		this.camera.rotation.set(0, 0, 0);
		var pitchObject = new THREE.Object3D();
		pitchObject.add(this.camera);
		player.eye.add(pitchObject);

		// add light to eye
		player.controls.camera.add(player.light);
	}

	player.controls.enable = function () {
		var on = document.addEventListener;
		on('keydown', onKeyDown);
		on('keyup', onKeyUp);
		on('mousedown', onMouseDown);
		on('dblclick', onMouseAtObject);
		on('mouseup', onMouseUp);
		on('mousemove',onMouseMove);
		on('mousewheel',onMouseWheel);

		window.isFocus = true;
		window.addEventListener('focus', ()=>window.isFocus = true);
		window.addEventListener('blur', ()=>window.isFocus = false);

		this.enabled = true;
	}

	player.controls.disable = function() {
		var off = document.removeEventListener;
		off('keydown', onKeyDown);
		off('keyup', onKeyUp);
		off('dblclick', onMouseDown);
		off('mouseup', onMouseUp);
		off('mousemove', onMouseMove);
		off('mousewheel',onMouseWheel);
		this.enabled = false;
	}

	player.controls.third_person = function(b){
		if(b){
			player.eye.position.set(0,player.height,300);
		}
		else{
			player.eye.position.set(0,player.height,0);
		}
		return ;
	}

	player.controls.zoomIn = function(zoomScale){
		if(zoomScale === undefined)
			zoomScale = getZoomScale();
		this.camera.zoom /= zoomScale;
		if(this.camera.zoom > this.zoomScaleMax)
			this.camera.zoom = this.zoomScaleMax;
		this.camera.updateProjectionMatrix();
	}

	player.controls.zoomOut = function(zoomScale){
		if(zoomScale === undefined)
			zoomScale = getZoomScale();
		this.camera.zoom *= zoomScale;
		if(this.camera.zoom < this.zoomScaleMin)
			this.camera.zoom = this.zoomScaleMin;
		this.camera.updateProjectionMatrix();
	}

	player.move = function (x, y, z){
		x = x || 0;
		y = y || 0;
		z = z || 0;

		if( !x && !y && !z)
			return ;
		else if(player.willCollide(x,y,z)){
			this.body.translateX(0);
			this.body.translateY(0);
			this.body.translateZ(0);
		}
		else{
			this.body.translateX(x);
			this.body.translateY(y);
			this.body.translateZ(z);
		}

	}
	player.position = function(position){
		if(position)this.body.position = position;
		return this.body.position;
	}

	player.moveTo = function (x, y, z){
		var position = this.position();
		position.x = x;
		position.y = y;
		position.z = z;
	}

	player.turn = function (x, y){
		x = x || 0;
		y = y || 0;
		var yawObject = this.eye;
		var pitchObject = yawObject.children[0];
		yawObject.rotation.y += x;
		pitchObject.rotation.x += y;
		pitchObject = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
	}


	player.act = function(delta){
		if(!this.controls.enabled)return;
		if(!window.isFocus)return;


		var controls = this.controls;
		// 阻力
        controls.velocity.x -= controls.velocity.x * 5 * delta;
        controls.velocity.z -= controls.velocity.z * 5 * delta;
        controls.velocity.y -= gravity * delta; // v = v0 + at

        if(Math.abs(controls.velocity.x) < 0.1) controls.velocity.x = 0;
        if(Math.abs(controls.velocity.z) < 0.1) controls.velocity.z = 0;

        if ( controls.moveForward ) controls.velocity.z -= controls.moveVelocity * delta;
        if ( controls.moveBackward ) controls.velocity.z += controls.moveVelocity * delta;
        if ( controls.moveLeft ) controls.velocity.x -= controls.moveVelocity * delta;
        if ( controls.moveRight ) controls.velocity.x += controls.moveVelocity * delta;


        this.move(controls.velocity.x * delta, controls.velocity.y * delta, controls.velocity.z * delta);

        if ( this.body.position.y <= 0 ) {
            controls.velocity.y = 0;
            this.body.position.y = 0;
            controls.canJump = true;
        }
	}
	player.isCollideObject = function () {
		var ObjectsColliadble = player.controls.ObjectsColliadble;
		var originPoint = new THREE.Vector3();
		originPoint.setFromMatrixPosition(player.model.matrixWorld);

		for(var i in player.model.geometry.vertices){
			var localVertex = player.model.geometry.vertices[i].clone();
			var ray = new THREE.Raycaster( originPoint, localVertex.clone().normalize() );
			var collisionResults = ray.intersectObjects( ObjectsColliadble );
			// console.log(ray);
			if ( collisionResults.length > 0 && collisionResults[0].distance < localVertex.length() ){
				console.log("HIT");
				return true;
			}
		}
		return false;
	}
	player.willCollide = function (x, y, z){
		var ObjectsColliadble = player.controls.ObjectsColliadble;
		var originPoint = new THREE.Vector3();
		originPoint.setFromMatrixPosition(player.model.matrixWorld);
		originPoint.set(originPoint.x+x, originPoint.y+y, originPoint.z+z);

		for(var i in player.model.geometry.vertices){
			var localVertex = player.model.geometry.vertices[i].clone();
			var ray = new THREE.Raycaster( originPoint, localVertex.clone().normalize() );
			var collisionResults = ray.intersectObjects( ObjectsColliadble );
			// console.log(ray);
			if ( collisionResults.length > 0){
				console.log("HIT");
				return true;
			}
		}
		return false;
	}

// Event Handler
	var controls = player.controls;

	function onKeyDown(event){
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
	}

	function onKeyUp(event){
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
	}

	function onMouseMove(event){
		var mouse = controls.mouse;
		if(mouse.state != MOUSE_STATE.KEYDOWN) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        player.turn(-movementX * mouse.sensitivity, -movementY * mouse.sensitivity);

	}
	function onMouseDown(event){
		controls.mouse.state = MOUSE_STATE.KEYDOWN;
	}

	function onMouseUp(event){
		controls.mouse.state = MOUSE_STATE.KEYUP;
	}
	function onMouseWheel(event){
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

	function onMouseAtObject(event){
		var mousePosition = new THREE.Vector2();
		mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mousePosition.y = 1 - ( event.clientY / window.innerHeight ) * 2;

		var ray = new THREE.Raycaster();
		ray.setFromCamera(mousePosition, controls.camera);
		var intersects = ray.intersectObjects(controls.ObjectsToPick);

		if(intersects.length){
			console.log(intersects[0].object.name);
			if(intersects[0].object.name == "floor"){
				player.posFlag.position.set(intersects[0].point.x, 5, intersects[0].point.z);
			}
		}
	}
//----------------------------------------------------
// Tool functions

	function getZoomScale(){
		return Math.pow( 0.97, controls.zoomSpeed );
	}

//----------------------------------------------------
// init
	player.init();

}