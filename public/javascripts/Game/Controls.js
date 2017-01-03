(function() {
    const PI_2 = Math.PI / 2;
    const gravity = 980;



    const MOUSE_STATE = {
        NONE: 0,
        KEYDOWN: 1,
        KEYUP: 2
    };

    const MODE_VIEW = {
        FIRST_PERSON: 0,
        THIRD_PERSON: 1
    };


    Controls = function(player) {
        if(!player.camera)return console.error("This player didn't have camera (eye).");
        var scope = this;
        this.player = player;
        this.enabled = false;
        this.mouse = {
            state: MOUSE_STATE.NONE,
            sensitivity: 0.001
        };
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
        this.positionFlag = new PositionFlag();
        // this.contextmemu = $("");
        this.Obstacles = [];
        this.ObjectsToSelect = [];
        this.ObjectsToMoveOn = [];


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
            }
        };
        hotkey["ENTER"] = function(event){
            (scope._mode !== "TYPING") && scope.mode("TYPING");
        }
        hotkey[" "] = function(event,bool){
            if(!bool)return ; //Disable When KeyDown
            if(scope.move.jump){
                scope.velocity.y = scope.jumpVelocity;
                scope.move.jump = false;
            }
        }
    };

    Controls.prototype = {
        enable: function(e,dom){
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
                case "NORMAL":
                case "CS":
                case "TYPING":
                    this._prevMode = this._mode;
                    this._mode = m;
                    console.log("Switch To ", m , " mode.");
                    return this;
                default:
                    return console.error("Invalid Mode in Controls: ", m);
            }
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
        },
        onMouseUp:function(event){
            this.mouse.state = MOUSE_STATE.KEYUP;
            if(this._mode === "NORMAL"){
                this.headDirection = {x:0, y:0, enabled:false};
            }
        },
        onMouseMove: function(event){
            event.preventDefault();
            if(this._mode === "TYPING")return;
            if(this._mode === "CS" || this.mouse.state === MOUSE_STATE.KEYDOWN){
                var x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                x = -x * this.mouse.sensitivity;
                y = -y * this.mouse.sensitivity;
                x = Math.abs(x) <= 0.001 ? 0 : x;
                y = Math.abs(y) <= 0.001 ? 0 : y;
                this.headDirection = {x:x, y:y, enabled:true};
            }
        },
        onRightClick:function(event){
        	event.preventDefault();
        	var mousePosition = new THREE.Vector2();
        	mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        	mousePosition.y = 1 - ( event.clientY / window.innerHeight ) * 2;

        	var ray = new THREE.Raycaster();
        	ray.setFromCamera(mousePosition, this.player.camera);
        	var intersects = ray.intersectObjects(this.ObjectsToMoveOn, true);

        	if(intersects.length){
        		var positionFlag = this.positionFlag;
                positionFlag.visible = true;
        		positionFlag.position.set(intersects[0].point.x, intersects[0].point.y + positionFlag.height/2, intersects[0].point.z);
                this.move.method = "MOUSECLICK";
                this.move.to.enabled = true;
                this.move.to.destination.x = intersects[0].point.x;
                this.move.to.destination.z = intersects[0].point.z;
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

            // Moving method
            if(this.move.method === "KEYPRESS"){
                if ( this.move.forward )this.velocity.z -= this.move.velocity * delta;
                if ( this.move.backward )this.velocity.z += this.move.velocity * delta;
                if ( this.move.left )this.velocity.x -= this.move.velocity * delta;
                if ( this.move.right )this.velocity.x += this.move.velocity * delta;
                this.player.translate(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);
            }
            else if(this.move.method === "MOUSECLICK"){
                var deltaX = this.move.to.destination.x - this.player.position.x;
                var deltaZ = this.move.to.destination.z - this.player.position.z;
                var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2));
                this.velocity.x = deltaX / distance * this.move.velocity;
                this.velocity.z = deltaZ / distance * this.move.velocity;
                if(distance <= 10){
                    this.positionFlag.visible = false;
                    this.move.to.enabled = false;
                    this.velocity.x = 0;
                    this.velocity.z = 0;
                }
                this.player.move(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);
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
