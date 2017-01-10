(function(){
const VIEW_ANGLE = 45,
    ASPECT = window.innerWidth/window.innerHeight,
    NEAR = 0.1,
    FAR = 20000,
    PI_2 = Math.PI /2;




var Character = this.Character = THREE.Object3D.extend({
    init: function(data, info){
        'use strict';
        this._super();
        var scope = this;
        var camera = this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.type = "Character";
        this.info = info || {};
        this.info.height = this.info.height || 170;
        this.info.width = this.info.width || 50;
        this.info.thickness = this.info.thickness || 50;

        //for rtc
        this.name = data.name;
        this.userID = data.id;
        //

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
        this.feet = new THREE.Mesh(new THREE.CubeGeometry(this.info.width - 20, this.info.height, this.info.thickness - 20), new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity:1} ));
        // this.feet.visible = false;
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

        //for rtc
        // this.webcam = new RTC(this, this.server);

        //to set webcam
        this.webcamWidth = 100;
        this.webcamHeight = 100;
        this.webcamPosition = new THREE.Vector3(0, 250, 0);

        //to create the html element
        this.webcamVideo = document.createElement('video');
        this.webcamImage = document.createElement('canvas');
        //<canvas id = 'videowebcamImage' width = '160' height = '120' style = 'visibility: hidden; float: left; position: fixed;'></canvas>
        this.webcamImageContext = this.webcamImage.getContext('2d');

        //to fill up the background color
        this.webcamImageContext.fillStyle = '#000000';
        this.webcamImageContext.fillRect(0, 0, this.webcamImage.width, this.webcamImage.height);

        //to create the video texture
        this.webcamTexture = new THREE.Texture(this.webcamImage);
        this.webcamTexture.minFilter = THREE.LinearFilter;
        this.webcamTexture.magFilter = THREE.LinearFilter;

        var webcamMaterial = new THREE.MeshBasicMaterial({
            map: this.webcamTexture,
            overdraw: true,
            side: THREE.DoubleSide
        });

        var webcamGeometry = new THREE.PlaneGeometry(this.webcamWidth, this.webcamHeight, 1, 1);
        var webcamMesh = new THREE.Mesh(webcamGeometry, webcamMaterial);

        webcamMesh.position.set(this.webcamPosition.x, this.webcamPosition.y, this.webcamPosition.z);

        this.add(webcamMesh);
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

        //for rtc
        if (this.webcamVideo.readyState === this.webcamVideo.HAVE_ENOUGH_DATA) {

            this.webcamImageContext.drawImage(this.webcamVideo, 0, 0, this.webcamImage.width, this.webcamImage.height);

            if (this.webcamTexture) {
                this.webcamTexture.needsUpdate = true;
            }
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
    },
    setStream: function(stream) {
        console.log('character ' + this.name + ' set stream');
        window.URL = window.URL || window.webkitURL;
        this.webcamVideo.src = window.URL.createObjectURL(stream);
        this.stream = stream;
    }
});

})();
