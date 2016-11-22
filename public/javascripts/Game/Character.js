const MOUSE_STATE = {NONE: 0, KEYDOWN: 1, KEYUP: 2};
const PI_2 = Math.PI / 2;
const gravity = 980;


var Character = Class.extend({
	init: function(args){
		'use strict';
		// init with args

		// init with default Value
	    var VIEW_ANGLE = 45,
	        ASPECT = 16/9,
	        NEAR = 0.1,
	        FAR = 20000;
	    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

		// init eye
		this.eye.add(new THREE.Object3D().add(this.camera));
		this.third_person(true);


		// init body
		this.body = new THREE.Mesh(new THREE.CubeGeometry(50, this.height,50), new THREE.MeshPhongMaterial( { color: 0x00ffff } ));
		this.body.name = this.name;
		this.body.position.set(0, this.height / 2, 0);
		this.body.add(this.eye);


		console.log(this.body);
		console.log("Character is created.");
	},
	in: function(scene, renderer){
		this.scene = scene;
		this.renderer = renderer;
		// reset aspect
	    var SCREEN_WIDTH = renderer.getSize().width,
	        SCREEN_HEIGHT = renderer.getSize().height;
	    this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

	    scene.add(this.body);
	},
	third_person: function(enable){
		if(enable){
			this.eye.position.set(0,this.height/2,300);
			this.eye.lookAt(0,0,0);
		}
		else
			this.eye.position.set(0,this.height/2-10,0);

	},
	move: function(x, y, z){
		x = x || 0;
		y = y || 0;
		z = z || 0;

		this.body.translateX(x);
		this.body.translateY(y);
		this.body.translateZ(z);
	},
	moveTo: function (x, y, z){
		var position = this.position();
		position.x = x;
		position.y = this.height/2 + y;
		position.z = z;
	},
	position: function(){
		return this.body.position;
	},

	/*****************
	 *    Controls   *
	 *****************/
	controls: {
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

	},


	/*****************
	 *    Elements   *
	 *****************/
	camera: '',
	name: 'Fuck',
	gender: 'Male',
	height: 170,
	weight: 70,
	body: '',
	eye: new THREE.Object3D(),

});



