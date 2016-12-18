// TODO: onselectstart="return false"
(function() {
    var GAME_STATE = { STOP: -1, READY: 0, RUNNING: 1, PAUSE: 2 };
    var Game = this.Game = Class.extend({
        init: function(divId, player, socket) {
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
			//this.CssScene = new THREE.Scene();

            //////////////
            // RENDERER //
            //////////////
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });

			// this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = 0;
            this.container.appendChild(this.renderer.domElement);

			this.CssRenderer = new THREE.CSS3DRenderer();
            this.CssRenderer.setSize(window.innerWidth, window.innerHeight);
            this.CssRenderer.domElement.style.position = 'absolute';
            this.CssRenderer.domElement.style.top = 0;
            this.container.appendChild(this.CssRenderer.domElement);

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

			//to create the plane mesh
            // var iframeWidth = 1004, iframeHeight = 504;
            // var planeMaterial = new THREE.MeshBasicMaterial({ wireframe: true , color: 0x000000});
            // var planeGeometry = new THREE.PlaneGeometry(iframeWidth, iframeHeight);
            // var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            // planeMesh.position.set(0, 250, -1000);
            // this.add(planeMesh);

			//to create the dom element
   //          var element = document.createElement('iframe');
   //          element.src = '/Paint';
   //          element.width = 1004;
   //          element.height = 504;
   //          element.scrolling = 'no';
			// var cssObj = new THREE.CSS3DObject(element);
			// // cssObj.position.copy(planeMesh.position);
   // //          cssObj.rotation.copy(planeMesh.rotation);
			//          cssObj.position.set(0, 250, -1000);
   //          //cssObj.rotation.copy(planeMesh.rotation);
   //          this.CssScene.add(cssObj);

            //to create the paint
            var paint = this.paint = document.getElementById('paint');
            
            console.log(this.paint);
            var test = $('#paint');
            console.log(test);
            console.log(test == this.paint);

            this.paint.setAttribute('width', 1000);
            this.paint.setAttribute('height', 600);
            var paintContext = this.paintContext = this.paint.getContext('2d');

            //to fill up the background color
            this.paintContext.fillStyle = '#000000';
            this.paintContext.fillRect(0, 0, this.paint.width, this.paint.height);

            //to create the video texture
            this.paintTexture = new THREE.Texture(this.paint);
            this.paintTexture.minFilter = THREE.LinearFilter;
            this.paintTexture.magFilter = THREE.LinearFilter;

            var paintMaterial = new THREE.MeshBasicMaterial({
                map: this.paintTexture,
                overdraw: true,
                side: THREE.DoubleSide
            });

            var paintGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
            var paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
            this.scene.add(paintMesh);
            paintMesh.position.set(0, 50, 0);

            //to set paint
            var paintFontColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'];
            var paintFontSize = [1, 3, 5, 10, 15, 20];
            var paintFontSizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];

            function draw (x, y, type) {
                if(type === 'mousedown') {
                    paintContext.beginPath();
                    paintContext.moveTo(x, y);
                    paint.on('mousemove', mouseOnCanvas);
                } else if (type === 'mousemove') {
                    mouseMove(x, y);
                } else if (type === 'mouseup') {
                    paintContext.closePath();
                    paint.off('mousemove', mouseOnCanvas);
                }
                else {
                    console.log('draw error');
                }
            };

            // function setTool (tool) {
                
            // }


            //to create the web camera

            // var element1 = document.createElement('iframe');
            // element1.src = '/Webcam';
            // element1.with = 504;
            // element1.height = 404;
            // element1.scrolling = 'no';
            // var cssObj1 = new THREE.CSS3DObject(element1);
            // cssObj1.position.set(200, 250,1000);
            // //cssObj.rotation.copy(planeMesh.rotation);
            // this.CssScene.add(cssObj1);

            // var element2 = document.createElement('iframe');
            // element2.src = '/WebcamCanvas';
            // element2.with = 504;
            // element2.height = 404;
            // element2.scrolling = 'no';
            // var cssObj2 = new THREE.CSS3DObject(element2);
            // cssObj2.position.set(400, 250, 1000);
            // //cssObj2.rotation.copy(planeMesh.rotation);
            // this.CssScene.add(cssObj2);

            //to get the web camera
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            var video = this.video = document.getElementById('monitor');

            if(navigator.getUserMedia) {
                navigator.getUserMedia({video: true}, gotStream, noStream);
            }
            else {
                console.log('webcam GG');
            }

            function gotStream(stream) {
                console.log(stream);
                console.log(video);
                if(window.URL) {
                    video.src = window.URL.createObjectURL(stream);
                }
                else {
                    //Opera
                    video.src = stream;
                }

                video.onerror = function(e) {
                    stream.stop();
                };

                stream.onended = noStream;
            }

            function noStream(e) {
                var msg = 'No camera available';

                if(e.code == 1) {
                    msg = 'User denied access to use camera';
                }
                
                console.log(msg);
            }


            //to get the html element
            
            this.videoImage = document.getElementById('videoImage');
            this.videoImageContext = this.videoImage.getContext('2d');

            //to fill up the background color
            this.videoImageContext.fillStyle = '#000000';
            this.videoImageContext.fillRect(0, 0, this.videoImage.width, this.videoImage.height);

            //to create the video texture
            this.videoTexture = new THREE.Texture(this.videoImage);
            this.videoTexture.minFilter = THREE.LinearFilter;
            this.videoTexture.magFilter = THREE.LinearFilter;

            var videoMaterial = new THREE.MeshBasicMaterial({
                map: this.videoTexture,
                overdraw: true,
                side: THREE.DoubleSide
            });

            var videoGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
            var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

            videoMesh.position.set(0, 50, 0);
            // this.scene.add(videoMesh);
            console.log(player.height);
            player.addObj(videoMesh, new THREE.Vector3(0, player.height - 10, 0));

            //important
			scope.camera.updateProjectionMatrix();

            /////////////////////
            // FUNCTION DEFINE //
            /////////////////////
            this.render = function() {
                var delta = scope.clock.getDelta();
                scope.ObjectsToUpdate.forEach((obj)=>obj.update(delta));
                scope.stats.update();

                if( scope.video.readyState === scope.video.HAVE_ENOUGH_DATA ) {
                    scope.videoImageContext.drawImage(scope.video, 0, 0, scope.videoImage.width, scope.videoImage.height);

                    if( scope.videoTexture ){
                        scope.videoTexture.needsUpdate = true;
                    }
                }

                scope.renderer.render(scope.scene, scope.camera);
                // scope.CssRenderer.render(scope.CssScene, scope.camera);

                if(scope.state == GAME_STATE.RUNNING)
                    scope.requestId = requestAnimationFrame(scope.render);
                // else if(this.state == GAME_STATE.STOP)
                    // cancelAnimationFrame(this.requestId);
            }
            this.start = function() {
                scope.state = GAME_STATE.RUNNING;
                requestAnimationFrame(scope.render);
            }
            this.stop = function() {
                scope.state = GAME_STATE.STOP;
                if (scope.requestId){
                    cancelAnimationFrame(scope.requestId);
                    console.log("Game has stopped..."+scope.requestId);
                }
            }

            /////////////
            //TODO: NO 寫死
            /////
                    var loader = new THREE.ObjectLoader();
        loader.load("3D/desk/chair.json", function(object) {
            object.position.set(0, 0, -200);
            object.rotation.set(4.71, 0, 3.14);
            scope.add(object);
        });

        loader = new THREE.ObjectLoader();

        // need ray caster ( player can select)
        loader.load("/3D/table/table.json", function(object) {
            // object.scale.set(250,250,250);
            object.position.set(0, 0, -350);
            scope.add(object);
        });
        loader = new THREE.ObjectLoader();

        loader.load("3D/laptop/laptop.json", function(object) {
            object.scale.set(3, 3, 3);
            object.position.set(0, 100, -350);
            scope.add(object);
            console.log("done");
        });
        loader = new THREE.ObjectLoader();
                loader.load("3D/books/book.json", function(object) {
            //object.scale.set(100,100,100);
            object.position.set(50, 100, -350);
            scope.add(object);
            console.log(object);

        });
            this.state = GAME_STATE.READY;
        },
        add: function(obj) {
            this.scene.add(obj);
        },
        remove: function(obj){
            this.scene.remove(obj);
        },
        addDynamicObject: function(obj, model){
            if(!obj.update){
                console.error("This is not an Dynamic Object");
                return;
            }
            // WARNING: This obj must have update();
            this.scene.add(model ? model : obj);
            this.ObjectsToUpdate.push(obj);
        },
        children: function() {
            return scene.children;
        },
        setController: function(controller){
            if(this.Controller)
                this.Controller.controls.enable(false);

            // controller.in(this.scene, this.renderer);
            this.add(controller);
            this.add(controller.controls.positionFlag);
            controller.controls.enable(true, this.container);

            if(this.socket)
                controller.socket = this.socket;

            this.camera = controller.controls.camera;
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
