(function() {
    const PI_2 = Math.PI / 2;
    const gravity = 980;


    const MOUSE_STATE = {
        NONE: 0,
        KEYDOWN: 1,
        KEYUP: 2
    };

    const VOXEL_WIDTH = 20;


    Controls = function(player) {
        if(!player.camera)return console.error("This player didn't have camera (eye).");
        var scope = this;
        this.player = player;
        this.enabled = false;
        this.mouse = {
            state: MOUSE_STATE.NONE,
            sensitivity: 0.001,
            previousPosition: {
                x: 0, y:0
            }
        };
        this.raycaster = new THREE.Raycaster();
        /*====================
            Zoom
        ====================*/
        this.zoom = {
            speed: 0.6,
            max: 5,
            min: 1,
            func: function(delta){
                var scale = Math.pow( 0.97, this.speed );

                scope.player.camera.zoom *= delta > 0 ? scale : 1.0/scale;
                scope.player.camera.zoom = Math.min(Math.max(scope.player.camera.zoom, this.min), this.max);
                scope.player.camera.updateProjectionMatrix();
            }
        };
        /*====================
            Head Direction
        ====================*/
        this.headDirection = {
            x: 0,
            y: 0,
            enabled: false
        };

        /*====================
            Move Trigger
        ====================*/
        this.move = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            velocity: 1500.0,
            to: {
                enable: false,
                destination: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            set method(m){
                m = m.toUpperCase();
                switch(m){
                    case "KEYPRESS":this.velocity = 1500.0;break;
                    case "MOUSECLICK": this.velocity = 500.0; break;
                }
                this._method = m;
            },
            get method(){
                return this._method;
            },
            _method: "KEYPRESS",
        };
        /*====================
            Velocity
        ====================*/
        this.velocity = new THREE.Vector3();
        this.jumpVelocity = 450.0;

        /*====================
            Game Object
        ====================*/
        this.positionFlag = new SPACE_OBJECT.PositionFlag();
        this.Objects = {
            stepOn: [],
            select: [],
            collide: [],
            move: []
        };
        this.Controlling = {
            rotation: false,
            objects: []
        }
        /*====================
            Voxel Painter
        ====================*/
        this.voxelPainter = new SPACE_OBJECT.VoxelPainter();

        /*====================
            Deployment
        ====================*/
        var scope = this;
        this._mode = "NORMAL";
        this._prevMode = "NORMAL";

        var hotkey = this.hotkey = {};
        // MOVING FUNCTION
        hotkey["ARROWUP"] = hotkey["W"] =
        hotkey["ARROWDOWN"] = hotkey["S"] =
        hotkey["ARROWLEFT"] = hotkey["A"] =
        hotkey["ARROWRIGHT"] = hotkey["D"] =
            function(event, bool, key){
                if(scope._mode === "TYPING")return ;
                event.preventDefault();
                scope.move.method = "KEYPRESS";
                scope.positionFlag.visible = false;
                switch (key) {
                    case "ARROWUP":case "W": scope.move.forward = bool; break;
                    case "ARROWDOWN":case "S": scope.move.backward = bool; break;
                    case "ARROWLEFT":case "A": scope.move.left = bool; break;
                    case "ARROWRIGHT":case "D": scope.move.right = bool; break;
                }
            }
        hotkey["ALT"] = function(event,bool){
            if(bool)return ; //Disable Until KeyUp
            switch (scope._mode) {
                case "TYPING":return scope.mode(scope._prevMode);
                case "NORMAL":return scope.mode("CS");
                case "CS":return scope.mode("NORMAL");
                default: return scope.mode("NORMAL");
            }
        };
        hotkey["ENTER"] = function(event){
            (scope._mode !== "TYPING") && scope.mode("TYPING");
        };
        hotkey[" "] = function(event,bool){
            if(!bool)return ; //Disable When KeyDown
            if(scope.move.jump){
                scope.velocity.y = scope.jumpVelocity;
                scope.move.jump = false;
            }
        };
        hotkey["E"] = function(event, bool){
            if(!bool)return ; //Disable When KeyDown
            (scope._mode !== "OBJ_EDITING") ?
                scope.mode('OBJ_EDITING') :
                scope.mode(scope._prevMode);
        };
        hotkey["R"] = function(event, bool){
            scope.Controlling.rotation = bool;
        }
        hotkey["V"] = function(event, bool){
            if(!bool)return ; //Disable When KeyDown
            (scope._mode !== "VOXEL") ?
                scope.mode('VOXEL') :
                scope.mode(scope._prevMode);
        }
        hotkey["Z"] = function(event, bool){
            if(!bool)return ; //Disable When KeyDown
            if(scope._mode === "VOXEL")
                scope.voxelPainter.clear(scope.Objects['stepOn']);
        }
        hotkey["X"] = function(event, bool){
            if(!bool)return ; //Disable When KeyDown
            if(scope._mode === "VOXEL")
                scope.voxelPainter.mode("DESTROY");
        }
        hotkey["C"] = function(event, bool){
            if(!bool)return ; //Disable When KeyDown
            if(scope._mode === "VOXEL")
                scope.voxelPainter.mode("CREATE");
        }
        hotkey["N"] = function(event, bool){
            if(!bool)return;
            if(scope._mode === "VOXEL")
                scope.voxelPainter.save();
        }
    };

    Controls.prototype = {
        enable: function(e, scene, dom){
            if(e && scene){
                this.scene = scene;
                scene.add(this.positionFlag);
                scene.add(this.voxelPainter.helper);
            }
            else if(!e && scene){
                scene.remove(this.positionFlag);
                scene.remove(this.voxelPainter.helper);
            }
            var scope = this;
            dom = dom || document;
            var handle = e ? dom.addEventListener : dom.removeEventListener;

            handle('keydown', (event)=>scope.onKey("down", event));
            handle('keyup', (event)=>scope.onKey("up", event));
            handle('mousedown', (event)=>scope.onMouseDown(event));
            handle('mouseup', (event)=>scope.onMouseUp(event));
            handle('mousemove', (event)=>scope.onMouseMove(event));
            handle('contextmenu', (event)=>scope.onRightClick(event));
            handle('mousewheel', (event)=>scope.onMouseWheel(event));

            this.enabled = e;
            return this;
        },
        mode: function(m) {
            if(!m)return this._mode;
            if (typeof m !== "string")
                return console.error("Invalid Mode in Controls");

            m = m.toUpperCase();
            switch (m) {
                case "NORMAL":case "CS":
                case "TYPING":case "OBJ_EDITING":
                this.voxelPainter.helper.visible = false;
                break;
                case "VOXEL":
                    this.voxelPainter.helper.visible = true;
                break;
                default:
                    return console.error("Invalid Mode in Controls: ", m);
            }
            this._prevMode = this._mode;
            this._mode = m;
            console.log("Switch To ", m , " mode.");
            return this;
        },
        can: function(manipulate, arr){
            if(this.Objects[manipulate]){
                this.Objects[manipulate] = this.Objects[manipulate].concat(arr);
            }
        },
        getObjectOnMouse: function(event, objs, recursive){
            var mousePosition = new THREE.Vector2();
            mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mousePosition.y = 1 - ( event.clientY / window.innerHeight ) * 2;
            this.raycaster.setFromCamera(mousePosition, this.player.camera);
            return this.raycaster.intersectObjects(objs, recursive);
        },
        collisionOccur: function(target, distance){
            var targetBox = new THREE.Box3().setFromObject(target).expandByScalar(distance/2);
            for(var i in this.Objects['collide']){
                var objBox = new THREE.Box3().setFromObject(this.Objects['collide'][i]).expandByScalar(distance/2);
                if(targetBox.intersectsBox(objBox)){
                    delete objBox;
                    return true;
                }
                delete objBox;
            }
            delete targetBox;

            return false;
        },
        freeToMove: function(dummy, distance, delta){
            dummy.translateX(this.velocity.x * delta);
            dummy.translateY(this.velocity.y * delta);
            dummy.translateZ(this.velocity.z * delta);
            return !this.collisionOccur(dummy, distance);
        },
        onKey: function(dir, event) {
            event.stopPropagation();

            var key = event.key.toUpperCase();
            var bool = dir === "down" ? true : false;

            this.hotkey[key] && this.hotkey[key](event, bool, key);

            return false;
        },
        onMouseDown:function(event){
            this.mouse.state = MOUSE_STATE.KEYDOWN;
            if(this._mode === "OBJ_EDITING"){
                var intersects = this.getObjectOnMouse(event, this.Objects['move'], true);

                if(intersects.length){
                    while(intersects[0].object.parent.type != "Scene"){
                        intersects[0].object = intersects[0].object.parent;
                    }
                    this.Controlling['objects'].push(intersects[0].object);
                }
            }


        },
        onMouseUp:function(event){
            this.mouse.state = MOUSE_STATE.KEYUP;
            if(this._mode === "NORMAL"){
                this.headDirection = {x:0, y:0, enabled:false};
            }
            else if(this._mode === 'OBJ_EDITING'){
                this.Controlling['objects'] = [];
            }
            else if(this._mode === "VOXEL" && event.which !== 3){
                if(this.voxelPainter._mode === "CREATE" && this.voxelPainter.prevIntersect !== this.voxelPainter.intersect){
                    if(!this.voxelPainter.scene) this.voxelPainter.setScene(this.scene);
                    var voxel = this.voxelPainter.create();
                    this.Objects['stepOn'].push(voxel);
                    this.voxelPainter.prevIntersect = this.voxelPainter.intersect;
                }
                else if(this.voxelPainter._mode === "DESTROY"){
                    var intersects = this.getObjectOnMouse(event, this.Objects['stepOn'], false);
                    if(intersects.length){
                        this.voxelPainter.destroy(intersects[0].object);
                        this.Objects['stepOn'].splice(this.Objects['stepOn'].indexOf(intersects[0].object), 1);
                    }
                }
            }
        },
        onMouseMove: function(event){
            switch (this._mode) {
                case "TYPING":return;
                case "NORMAL":
                    if(this.mouse.state !== MOUSE_STATE.KEYDOWN)return;
                case "CS":
                    var x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                    var y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                    x = -x * this.mouse.sensitivity;
                    y = -y * this.mouse.sensitivity;
                    x = Math.abs(x) <= 0.001 ? 0 : x;
                    y = Math.abs(y) <= 0.001 ? 0 : y;
                    this.headDirection = {x:x, y:y, enabled:true};
                    return;
                case "OBJ_EDITING":
                    if(this.mouse.state !== MOUSE_STATE.KEYDOWN)return;
                    var intersects = this.getObjectOnMouse(event, this.Objects['stepOn'], true);

                    if(intersects.length && this.Controlling['objects'].length){
                        if(!this.Controlling.rotation){ // move position
                            for(var i in this.Controlling['objects']){
                                this.Controlling['objects'][i].position.set(
                                    intersects[0].point.x
                                    , this.Controlling['objects'][i].position.y
                                    , intersects[0].point.z
                                );
                            }
                        }
                        else{ // rotation
                            var deltaMove = {
                                x: event.offsetX-this.mouse.previousPosition.x,
                                y: event.offsetY-this.mouse.previousPosition.y
                            };
                            var deltaRotationQuaternion = new THREE.Quaternion()
                                .setFromEuler(new THREE.Euler(
                                    0,
                                    deltaMove.x * Math.PI / 180.0,
                                    0,
                                    'XYZ'
                                ));
                            for(var i in this.Controlling['objects']){
                                var selected = this.Controlling['objects'][i];
                                selected.quaternion.multiplyQuaternions(deltaRotationQuaternion, selected.quaternion);
                            }

                            this.mouse.previousPosition = {
                                x: event.offsetX,
                                y: event.offsetY
                            }
                        }
                    }
                    break;
                case "VOXEL":
                    var intersects = this.getObjectOnMouse(event, this.Objects['stepOn'], true);
                    if(intersects.length)
                        this.voxelPainter.updateHelper(intersects[0]);


                break;
            }
        },
        onRightClick:function(event){
        	event.preventDefault();

          console.log(this._mode);

          if (this._mode === "NORMAL"){
        	var mousePosition = new THREE.Vector2();
        	mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        	mousePosition.y = 1 - ( event.clientY / window.innerHeight ) * 2;

        	this.raycaster.setFromCamera(mousePosition, this.player.camera);
        	var intersects = this.raycaster.intersectObjects(this.Objects['stepOn'], true);

        	if(intersects.length){
        		  var positionFlag = this.positionFlag;
                  positionFlag.visible = true;
        		        positionFlag.position.set(intersects[0].point.x, intersects[0].point.y + positionFlag.height/2, intersects[0].point.z);
                    this.move.method = "MOUSECLICK";
                    this.move.to.enabled = true;
                    this.move.to.destination.x = intersects[0].point.x;
                    this.move.to.destination.y = intersects[0].point.y;
                    this.move.to.destination.z = intersects[0].point.z;
        	}
        }
        if (this._mode === "CS"){

          var objs = [];
          for(var i in Users){
            objs.push(Users[i].object.body);
          }
          var intersects = this.getObjectOnMouse(event, objs);
          if(intersects.length){
            console.log(intersects[0].object.parent.name);
          }


              $(function() {
                  $.contextMenu({
                      selector: 'intersects[0].object',
                      callback: function(key, options) {
                          var m = "clicked: " + key;
                          window.console && console.log(m) || alert(m);
                      },
                      items: {
                          "edit": {name: "Edit", icon: "edit"},
                          "cut": {name: "Cut", icon: "cut"},
                         copy: {name: "Copy", icon: "copy"},
                          "paste": {name: "Paste", icon: "paste"},
                          "delete": {name: "Delete", icon: "delete"},
                          "sep1": "---------"
                      }
                  });

                  $('intersects[0].object').on('click', function(e){
                      console.log('clicked', this);
                  })
              });


        }
          // if(this._mode === "NORMAL")
        },
        onMouseWheel:function(event){
        	event.preventDefault();
        	var delta = event.wheelDelta || - event.detail;
            this.zoom.func(delta);
        },
        update: function(delta){
            if(!this.enabled)return ;
            // Gravity and Friction
            this.velocity.x -= this.velocity.x * 5 * delta;
            this.velocity.z -= this.velocity.z * 5 * delta;
            this.velocity.y -= gravity * delta; // v = v0 + at
            if(Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
            if(Math.abs(this.velocity.z) < 0.1) this.velocity.z = 0;

            this.player.dummyBody.position.copy(this.player.position);
            this.player.dummyBody.rotation.copy(this.player.rotation);
            // Moving method
            if(this.move.method === "KEYPRESS"){
                if ( this.move.forward )this.velocity.z -= this.move.velocity * delta;
                if ( this.move.backward )this.velocity.z += this.move.velocity * delta;
                if ( this.move.left )this.velocity.x -= this.move.velocity * delta;
                if ( this.move.right )this.velocity.x += this.move.velocity * delta;

                if(this.freeToMove(this.player.dummyBody, 4, delta))
                    this.player.translate(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);
                else
                    this.player.translate(0, this.velocity.y * delta, 0);
            }
            else if(this.move.method === "MOUSECLICK"){
                // TODO: simplify distance (Vector3()'s method)
                var deltaX = this.move.to.destination.x - this.player.position.x;
                var deltaY = this.move.to.destination.y - this.player.position.y;
                var deltaZ = this.move.to.destination.z - this.player.position.z;
                var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2) + Math.pow(deltaY,2));
                this.velocity.x = deltaX / distance * this.move.velocity;
                this.velocity.y = deltaY / distance * this.move.velocity;
                this.velocity.z = deltaZ / distance * this.move.velocity;
                if(distance <= 10){
                    this.positionFlag.visible = false;
                    this.move.to.enabled = false;
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                    this.velocity.z = 0;
                }

                if(this.freeToMove(this.player.dummyBody, 4, delta))
                    this.player.move(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);
                else
                    this.player.move(0, this.velocity.y * delta, 0);
            }

            // this.player move

            if(this.headDirection.enabled){
                this.player.turn(this.headDirection.x, this.headDirection.y);
                this.headDirection.enabled = false;
            }

            // IF Stepped on floor (???)
            if ( this.player.position.y <= 0 ) {
                this.velocity.y = 0;
                this.player.position.y = 0;
                this.move.jump = true;
            }
        }
    };

    // c = new Controls().mode("normal").enable(true);





})();
