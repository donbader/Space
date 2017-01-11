// TODO: onselectstart="return false"
(function() {
    var GAME_STATE = { STOP: -1, READY: 0, RUNNING: 1, PAUSE: 2 };
    var Game = this.Game = Class.extend({
        init: function(divId, player, socket) {
            console.log('Yo enter game');
            // init elements
            this.container = document.getElementById('GamePlay');
            var scope = this.scope = this;
            this.clock = new THREE.Clock();
            this.socket = socket;

            ///////////
            // SCENE //
            ///////////
            this.scene = new THREE.Scene();
            this.scene.updateMatrixWorld();
            this.CssScene = new THREE.Scene();

            //////////////
            // RENDERER //
            //////////////
            this.renderer = new THREE.WebGLRenderer({
                alpha: true
            });

            this.renderer.setClearColor(0x000);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.zIndex = 0;
            this.renderer.domElement.style.top = 0;
            this.container.appendChild(this.renderer.domElement);

            this.CssRenderer = new THREE.CSS3DRenderer();
            this.CssRenderer.setSize(window.innerWidth, window.innerHeight);
            this.CssRenderer.domElement.style.position = 'absolute';
            this.CssRenderer.domElement.style.zIndex = 0;
            this.CssRenderer.domElement.style.top = 0;
            this.container.appendChild(this.CssRenderer.domElement);
            // this.CssRenderer.domElement.appendChild(this.renderer.domElement);
            // this.renderer.domElement.appendChild(this.CssRenderer.domElement);

            ///////////
            // STATS //
            ///////////
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            //this.stats.domElement.style.bottom = '0px';
            this.stats.domElement.style.top = '0px';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.zIndex = 100;
            this.container.appendChild(this.stats.domElement);


            ///////////
            // PLAYER//
            ///////////
            this.setController(player);


            // DO
            // TODO: Think the better way to store
            // player.canMoveOn(world.ground);

            //important
            scope.camera.updateProjectionMatrix();

            /////////////////////
            // FUNCTION DEFINE //
            /////////////////////
            this.render = function() {
                var delta = scope.clock.getDelta();
                scope.ObjectsToUpdate.forEach((obj) => obj.update(delta < 0.03 ? delta : 0.03));
                scope.stats.update();

                scope.renderer.render(scope.scene, scope.camera);
                scope.CssRenderer.render(scope.CssScene, scope.camera);

                if (scope.state == GAME_STATE.RUNNING)
                    scope.requestId = requestAnimationFrame(scope.render);
                // else if(this.state == GAME_STATE.STOP)
                // cancelAnimationFrame(this.requestId);
            }
            this.pause = function() {
                console.log("PAUSE");
                scope.state = GAME_STATE.PAUSE;
            }
            this.start = function() {
                console.log("START");
                scope.state = GAME_STATE.RUNNING;
                // Avoid delta being large while not running
                scope.clock.getDelta();
                requestAnimationFrame(scope.render);
            }
            this.stop = function() {
                scope.state = GAME_STATE.STOP;
                if (scope.requestId) {
                    cancelAnimationFrame(scope.requestId);
                    console.log("Game has stopped..." + scope.requestId);
                }
                this.container.innerHTML = '';
            }

            this.state = GAME_STATE.READY;
        },
        isRunning: function() {
            return this.state === GAME_STATE.RUNNING;
        },
        add: function(obj) {
            this.scene.add(obj);
        },
        remove: function(obj) {
            this.scene.remove(obj);
        },
        addDynamicObject: function(obj, model) {
            if (!obj.update) {
                console.error("This is not an Dynamic Object");
                return;
            }

            // WARNING: This obj must have update();
            this.scene.add(model ? model : obj);
            this.ObjectsToUpdate.push(obj);
        },
        addCSSObject: function(obj, model) {
            // TODO: CssScene Must be added.
            this.CssScene.add(obj);
        },
        children: function() {
            return scene.children;
        },
        setController: function(controller) {
            if (this.Controller)
                this.Controller.controls.enable(false, this.container);

            if (this.socket)
                controller.socket = this.socket;

            // controller.in(this.scene, this.renderer);
            this.add(controller);
            this.add(controller.feet);
            this.add(controller.dummyBody);
            controller.controls = new Controls(controller).mode("normal").enable(true, this.scene, this.container);

            this.camera = controller.camera;
            this.addDynamicObject(controller);

            this.Controller = controller;
        },
        useDefaultWorld: function() {
            var scope = this;
            scene = this.scene;
            ///////////
            // LIGHT //
            ///////////

            // create a light
            var light = new THREE.PointLight(0xffffff);
            light.position.set(0, 250, 0);
            scene.add(light);
            var ambientLight = new THREE.AmbientLight(0x111111);
            scene.add(ambientLight);

            //////////////
            // GEOMETRY //
            //////////////
            var loader = new THREE.ObjectLoader();
            loader.load("3D/desk/chair.json", function(object) {
                scene.add(object);
                object.position.set(0, 0, 300);
                scope.player.canSelect([object]);
                scope.player.canMoveOn([object]);
            });

            // most objects displayed are a "mesh":
            //  a collection of points ("geometry") and
            //  a set of surface parameters ("material")

            // Sphere parameters: radius, segments along width, segments along height
            var sphereGeometry = new THREE.SphereGeometry(50, 32, 16);
            // use a "lambert" material rather than "basic" for realistic lighting.
            //   (don't forget to add (at least one) light!)
            var sphereMaterial = new THREE.MeshLambertMaterial({
                color: 0x1188ff
            });
            var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(100, 50, -50);
            sphere.name = 'sphere';
            scene.add(sphere);


            // create a set of coordinate axes to help orient user
            //    specify length in pixels in each direction
            var axes = new THREE.AxisHelper(300);
            scene.add(axes);

            var box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshPhongMaterial({ color: 0xffff00 }));
            box.position.set(0, 0, 6);
            box.name = 'box';
            scene.add(box);

            ///////////
            // FLOOR //
            ///////////

            // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
            var floorTexture = new THREE.ImageUtils.loadTexture('images/wood2.jpg');
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(10, 10);
            // DoubleSide: render texture on both sides of mesh
            var floorMaterial = new THREE.MeshBasicMaterial({
                map: floorTexture,
                side: THREE.DoubleSide
            });
            var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = -0.5;
            floor.rotation.x = Math.PI / 2;
            floor.name = "floor";
            scene.add(floor);

            /////////
            // SKY //
            /////////

            // recommend either a skybox or fog effect (can't use both at the same time)
            // without one of these, the scene's background color is determined by webpage background

            // make sure the camera's "far" value is large enough so that it will render the skyBox!
            var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
            // BackSide: render faces from inside of the cube, instead of from outside (default).
            var skyBoxMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff99,
                side: THREE.BackSide
            });
            var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
            scene.add(skyBox);

            this.player.canSelect([box, sphere]);
            this.player.canMoveOn([floor, box, sphere]);
        },
        state: GAME_STATE.STOP,
        container: '',
        stats: '',
        camera: '',
        scene: '',
        renderer: '',
        player: '',
        clock: '',
        scope: '',
        ObjectsToUpdate: []


    });




})();
