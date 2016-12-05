// TODO: Store the previous rotation
// TODO: move() emit 'action' to socket
// TODO: Collision
(function() {
    const MOUSE_STATE = {
        NONE: 0,
        KEYDOWN: 1,
        KEYUP: 2,
        DRAWING: 3,
    };
    const MODE_STATE = {
        FIRST_PERSON: 0,
        THIRD_PERSON: 1,
        DRAW: 2
    };

    const PI_2 = Math.PI / 2;
    const gravity = 980;

    var Scene;

    var Character = this.Character = Class.extend({
        init: function(args) {
            'use strict';
            // init with args

            // init with default Value
            var VIEW_ANGLE = 45,
                ASPECT = 16 / 9,
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
            this.body = new THREE.Mesh(new THREE.CubeGeometry(50, this.height, 50), new THREE.MeshPhongMaterial({
                color: 0x00ffff
            }));
            this.body.name = this.name;
            this.body.position.set(0, this.height / 2, 0);
            this.body.add(this.eye);

            // init model
            this.model.add(this.body);
            this.model.add(this.flashLight);
            this.flashLight.position.set(0, this.height + 10, 0);

            // init position Flag
            this.controls.positionFlag = new THREE.Mesh(new THREE.BoxGeometry(5, 30, 5), new THREE.MeshPhongMaterial({
                color: 0xff0000
            }));
            this.controls.positionFlag.height = 30;
        },
        in: function(scene, renderer) {
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
        translate: function(x, y, z) {
            x = x || 0;
            y = y || 0;
            z = z || 0;

            this.model.translateX(x);
            this.model.translateY(y);
            this.model.translateZ(z);
            if(x && y && z){
                if(this.socket){
                    var scope = this;
                    socket.emit('update', {
                        id: scope.model.id,
                        scripts: [
                            "translate("+x+","+y+","+z+")"
                        ]
                    });
                }
            }
        },
        move: function(x, y, z) {
            console.log("NMOMEOOMEMOEO");
            var position = this.position();
            position.x += x;
            position.y += y;
            position.z += z;
            if(x && y && z){
                if(this.socket){
                    var scope = this;
                    socket.emit('update', {
                        id: scope.model.id,
                        scripts: [
                            "move("+x+","+y+","+z+")"
                        ]
                    });
                }
            }
        },
        moveTo: function(x, y, z) {
            var position = this.position();
            position.x = x;
            position.y = y;
            position.z = z;
            if(this.socket){
                var scope = this;
                socket.emit('update', {
                    id: scope.model.id,
                    scripts: [
                        "moveTo("+x+","+y+","+z+")"
                    ]
                });
            }
        },
        turn: function(x, y) {
            x = x || 0;
            y = y || 0;
            var yawObject = this.eye;
            var pitchObject = yawObject.children[0];
            this.model.rotation.y += x;
            pitchObject.rotation.x += y;
            pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

            if(this.socket){
                var scope = this;
                socket.emit('update', {
                    id: scope.model.id,
                    scripts: [
                        "turn("+x+","+y+")"
                    ]
                });
            }
        },
        turnTo: function(x, y){
            this.model.rotation.y = x;
            this.eye.children[0].rotation.x = y;
            if(this.socket){
                var scope = this;
                socket.emit('update', {
                    id: scope.model.id,
                    scripts: [
                        "turnTo("+x+","+y+")"
                    ]
                });
            }
        },
        walkFunction: function(destination) {
            var deltaX = destination.x - this.model.position.x;
            var deltaZ = destination.z - this.model.position.z;
            var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2));
            controls.velocity.x = deltaX / distance * this.controls.walk.speed;
            controls.velocity.z = deltaZ / distance * this.controls.walk.speed;
            if (distance <= 10) {
                controls.walk.ing = false;
                controls.velocity.x = 0;
                controls.velocity.z = 0;
            }

        },
        position: function() {
            return this.model.position;
        },
        update: function(delta) {

            if (!this.controls.enabled) return;

            var controls = this.controls;
            if (controls.walk.ing) {
                this.walkFunction(controls.walk.destination);
                controls.velocity.x -= controls.velocity.x * 5 * delta;
                controls.velocity.z -= controls.velocity.z * 5 * delta;
                controls.velocity.y -= gravity * delta; // v = v0 + at
                if (Math.abs(controls.velocity.x) < 0.1) controls.velocity.x = 0;
                if (Math.abs(controls.velocity.z) < 0.1) controls.velocity.z = 0;

                this.move(controls.velocity.x * delta, controls.velocity.y * delta, controls.velocity.z * delta);
            } else {
                controls.velocity.x -= controls.velocity.x * 5 * delta;
                controls.velocity.z -= controls.velocity.z * 5 * delta;
                controls.velocity.y -= gravity * delta; // v = v0 + at
                if (Math.abs(controls.velocity.x) < 0.1) controls.velocity.x = 0;
                if (Math.abs(controls.velocity.z) < 0.1) controls.velocity.z = 0;
                // Key
                if (controls.moveForward) controls.velocity.z -= controls.moveVelocity * delta;
                if (controls.moveBackward) controls.velocity.z += controls.moveVelocity * delta;
                if (controls.moveLeft) controls.velocity.x -= controls.moveVelocity * delta;
                if (controls.moveRight) controls.velocity.x += controls.moveVelocity * delta;
                this.translate(controls.velocity.x * delta, controls.velocity.y * delta, controls.velocity.z * delta);
            }

            if (this.model.position.y <= 0) {
                controls.velocity.y = 0;
                this.model.position.y = 0;
                controls.canJump = true;
            }

        },
        collision: function(x, y, z){

        },
        canSelect: function(arr) {
            this.controls.ObjectsToSelect = this.controls.ObjectsToSelect.concat(arr);
            return this.controls.ObjectsToSelect;
        },
        canMoveOn: function(arr) {
            this.controls.ObjectsToMoveOn = this.controls.ObjectsToMoveOn.concat(arr);
            return this.controls.ObjectsToMoveOn;
        },
        canDrawOn: function(arr) {
            this.controls.ObjectsToDrawOn = this.controls.ObjectsToDrawOn.concat(arr);
            return this.controls.ObjectsToDrawOn;
        },
        addObstacles: function(arr){

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
            mouse: {
                state: MOUSE_STATE.NONE,
                sensitivity: 0.001
            },
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            canJump: false,
            velocity: new THREE.Vector3(),
            moveVelocity: 1000.0,
            jumpVelocity: 350.0,
            positionFlag: '',
            walk: {
                destination: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                ing: false,
                speed: 500.0,
                to: function(x, z) {
                    this.ing = true;
                    this.destination.x = x;
                    this.destination.z = z;
                }
            },
            ObjectsToSelect: [],
            Obstacles: [],
            ObjectsToDrawOn: [],
            ObjectsToMoveOn: [],
            // TODO: Change To "set enabled()";
            enable: function(bool, dom) {
                if(bool){
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

                    this.enabled = true;
                }
                else {
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
        flashLight: new THREE.PointLight(0xffffff, 0.3, 1000),
        mode: {
            current: MODE_STATE.FIRST_PERSON,
            previous: MODE_STATE.FIRST_PERSON,
        },
        setMode: function(m) {
            this.mode.previous = this.mode.current;
            this.mode.current = m;
            switch (m) {
                case MODE_STATE.FIRST_PERSON:
                    console.log("第一人稱視角");
                    this.eye.position.set(0, this.height / 2 - 10, 0);
                    break;
                case MODE_STATE.THIRD_PERSON:
                    console.log("第三人稱視角");
                    this.eye.position.set(0, this.height + 300, 500);
                    this.turnTo(0, -0.7);
                    break;
                case MODE_STATE.DRAW:
                    console.log("小畫家");
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
    controls.onKeyDown = function(event) {
        // event.preventDefault();
        switch (event.keyCode) {
            case 38: // up
				event.preventDefault();
            case 87: // w
                controls.moveForward = true;
                break;

            case 37: // left
            case 65: // a
                controls.moveLeft = true;
                break;

            case 40: // down
				event.preventDefault();
            case 83: // s
                controls.moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                controls.moveRight = true;
                break;

            case 32: // space
                event.preventDefault();
                if (controls.canJump === true) controls.velocity.y += controls.jumpVelocity;
                controls.canJump = false;
                break;

            case 190: // .
                character.moveTo(0,0,0);
                break;

            case 191: // /
                if(character.mode.current == MODE_STATE.DRAW)
                    character.setMode(character.mode.previous);
                else
                    character.setMode(MODE_STATE.DRAW);
                break;
            case 77:
                if(character.mode.current == MODE_STATE.DRAW)
                    character.setMode(character.mode.previous);
                else
                    character.setMode((character.mode.current + 1)%2);
                break;
        }
    };

    controls.onKeyUp = function(event) {
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
        switch (character.mode.current) {
            case MODE_STATE.DRAW:
                draw(event);

                break;
            default:
                if (mouse.state != MOUSE_STATE.KEYDOWN) return;
                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                character.turn(-movementX * mouse.sensitivity, -movementY * mouse.sensitivity);
                break;
        }




    }
    controls.onMouseDown = function(event) {
        controls.mouse.state = MOUSE_STATE.KEYDOWN;
    }


    controls.onRightClick = function(event) {
        event.preventDefault();
        var mousePosition = new THREE.Vector2();
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = 1 - (event.clientY / window.innerHeight) * 2;

        var ray = new THREE.Raycaster();
        ray.setFromCamera(mousePosition, controls.camera);
        var intersects = ray.intersectObjects(controls.ObjectsToMoveOn, true);
        if (intersects.length) {
            var positionFlag = controls.positionFlag;
            positionFlag.position.set(intersects[0].point.x, intersects[0].point.y + positionFlag.height / 2, intersects[0].point.z);
            controls.walk.to(intersects[0].point.x, intersects[0].point.z)
        }
    }


    controls.onMouseUp = function(event) {
        controls.mouse.state = MOUSE_STATE.KEYUP;
    }

    controls.onMouseWheel = function(event) {
        event.preventDefault();

        var delta = 0;
        if (event.wheelDelta) { // WebKit / Opera / Explorer 9
            delta = event.wheelDelta;
        } else if (event.detail) { // Firefox
            delta = -event.detail;
        }

        if (delta > 0) {
            controls.zoomOut();
        } else {
            controls.zoomIn();
        }

    }
    controls.onMouseAtObject = function(event) {
        var mousePosition = new THREE.Vector2();
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = 1 - (event.clientY / window.innerHeight) * 2;

        var ray = new THREE.Raycaster();
        ray.setFromCamera(mousePosition, controls.camera);
        var intersects = ray.intersectObjects(controls.ObjectsToSelect, true);
        if (intersects.length) {
            var obj = intersects[0].object;
            while (obj.parent.type != "Scene") {
                obj = obj.parent;
            }
            console.log(obj.name);
        }
    }

    controls.zoomIn = function(zoomScale) {
        if (zoomScale === undefined)
            zoomScale = getZoomScale();
        controls.camera.zoom /= zoomScale;
        if (controls.camera.zoom > controls.zoomScaleMax)
            controls.camera.zoom = controls.zoomScaleMax;
        controls.camera.updateProjectionMatrix();
    }
    controls.zoomOut = function(zoomScale) {
        if (zoomScale === undefined)
            zoomScale = getZoomScale();
        controls.camera.zoom *= zoomScale;
        if (controls.camera.zoom < controls.zoomScaleMin)
            controls.camera.zoom = controls.zoomScaleMin;
        controls.camera.updateProjectionMatrix();
    }

    function getZoomScale() {
        return Math.pow(0.97, controls.zoomSpeed);
    }


    // var points = [];
    // var bg = new THREE.BoxGeometry(20, 20, 20);
    // var mt = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // for(var i = 0; i < 3000; ++i) {
    //     points.push(new THREE.Mesh(bg, mt));
    // }


    function draw(event) {

        var mousePosition = new THREE.Vector3();
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = 1 - (event.clientY / window.innerHeight) * 2;

        var ray = new THREE.Raycaster();
        ray.setFromCamera(mousePosition, controls.camera);


        //drawing mode 0

        var intersects = ray.intersectObjects(controls.ObjectsToDrawOn, true);

        if (intersects.length) {
            //drawing point
            var point = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 5), new THREE.MeshBasicMaterial({
                color: 0x000000
            }));
            //var point = points.pop();
            point.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            Scene.add(point);
        }


        /*
        //drawing mode 2
        var turn = ray.ray.turn;
        turn.multiplyScalar(500);
        var eyeWorldPosition = new THREE.Vector3().setFromMatrixPosition(Eye.matrixWorld);
        var point = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        point.position.set(eyeWorldPosition.x + turn.x, eyeWorldPosition.y + turn.y + 10, eyeWorldPosition.z + turn.z);
        Scene.add(point);
        */
    }

})();
