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

        this._view = "THIRD_PERSON";
        this.view(this._view);
        ////////////////////////////
        ///// Controls /////////////
        ////////////////////////////
        this.controls = new Controls(this).mode("normal");
        this.webcam = new RTC(this.socket, this);
    },
    update: function(delta){
        // Control moving
        this.controls.update(delta);
        this.webcam.update();
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
        if(item.Objects){
            for(var manipulate in item.Objects){
                this.can(manipulate, item.Objects[manipulate]);
            }
        }
        if(item.prop){
            for(var manipulate in item.prop){
                if(item.prop[manipulate])
                    this.can(manipulate, [item]);
            }
        }
    },
    can: function(manipulate, arr){
        this.controls.can(manipulate, arr);
    },
    view: function(v){
        if(!v){
            if(this._view === "FIRST_PERSON")
                v = "THIRD_PERSON";
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
        }
    }
});



})();
