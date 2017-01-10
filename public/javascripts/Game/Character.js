(function(){
const VIEW_ANGLE = 45,
    ASPECT = window.innerWidth/window.innerHeight,
    NEAR = 0.1,
    FAR = 20000,
    PI_2 = Math.PI /2;




var Character = this.Character = THREE.Object3D.extend({
    init: function(info){
        'use strict';
        this._super();
        var scope = this;
        var camera = this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.type = "Character";
        this.info = info || {};
        this.info.height = this.info.height || 170;
        this.info.width = this.info.width || 50;
        this.info.thickness = this.info.thickness || 50;

        // this.socket = {};

        this.position.set(0,this.info.height / 2,500);
        // Body
        this.body = new THREE.Mesh(new THREE.CubeGeometry(this.info.width, this.info.height, this.info.thickness), new THREE.MeshPhongMaterial( { color: 0x00ffff } ));
        this.body.position.set(0,this.info.height/2,0);
        this.add(this.body);

        // eye
        this.eye = new THREE.Object3D();
        this.eye.add(camera);
        this.body.add(this.eye);

        // feets (plane)
        this.feet = new THREE.Mesh(new THREE.CubeGeometry(this.info.width - 10, this.info.height, this.info.thickness - 10), new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity:1} ));
        this.feet.visible = false;
        this.feet.name = "feet";
        // this.body.add(this.feet);


        // dummyMesh (for detecting collision)
        this.dummyBody = new THREE.Mesh(this.body.geometry, this.body.material);
        this.dummyBody.visible = false;
        this.dummyBody.name = "dummy";

        // feetRay (for detecting the object underfeet)
        // this.feetRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

        this._view = "THIRD_PERSON";
        this.view(this._view);
        ////////////////////////////
        ///// Controls /////////////
        ////////////////////////////
        this.controls = new Controls(this).mode("normal");
        // this.webcam = new RTC(this.socket, this);
    },
    update: function(delta){
        // update dummy, feet
        this.feet.position.copy(this.position);
        this.feet.position.y += this.info.height / 2 - 10;
        this.feet.rotation.copy(this.rotation);

        this.dummyBody.position.copy(this.position);
        this.dummyBody.position.y += this.info.height / 2;
        this.dummyBody.rotation.copy(this.rotation);

        // Control moving
        if(this.controls)
            this.controls.update(delta);
        // this.webcam.update();
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
        if(this._view !== "GOD_VIEW")
            this.eye.rotation.x = Math.max( - PI_2, Math.min( PI_2, this.eye.rotation.x ) );
        if(x || y && this.socket){
            this.ServerUpdate();
        }
    },
    turnTo: function(x,y){
        x = x || 0;
        y = y || 0;
        this.rotation.y = x;
        this.eye.rotation.x = y;
        if(x || y && this.socket){
            this.ServerUpdate();
        }
    },
    manipulate: function(item){
        this.controls.manipulate(item);
    },
    isOnObject: function(objs, distance){
        this.onObject = SPACE_OBJECT.collisionOccur(this.feet, objs, distance);
        return this.onObject;
    },
    willCollideObject: function(tendency, objs, distance){
        this.dummyBody.translateX(tendency.x);
        this.dummyBody.translateY(tendency.y);
        this.dummyBody.translateZ(tendency.z);
        this.collideObject = SPACE_OBJECT.collisionOccur(this.dummyBody, objs, distance);
        return this.collideObject;
    },
    view: function(v){
        if(!v){
            if(this._view === "FIRST_PERSON")
                v = "THIRD_PERSON";
            else if((this._view) === "THIRD_PERSON")
                v = "GOD_VIEW";
            else
                v = "FIRST_PERSON";
            this._view = v;
        }
        v = v.toUpperCase();
        this._view = v;
        switch (this._view) {
            case "FIRST_PERSON":
                this.eye.position.set(0,this.info.height-10,0);
                break;
            case "THIRD_PERSON":
                this.eye.position.set(0,this.info.height+300,500);
                this.turnTo(0, -0.5);
                break;
            case "GOD_VIEW":
                this.eye.position.set(0, 1600 ,0);
                this.turnTo(0, -Math.PI / 2);
                break;
        }
    }
});



})();
