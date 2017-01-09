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
                antialias: true
            });

			// this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = 0;
            // this.renderer.domElement.style.zIndex = 5;
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


   //          var paintWidth = 160, paintHeight = 120;
   //          var dummyPaint = document.createElement('canvas');
   //          // element.src = '/Paint';
   //          // element.innerHTML = "FUCK　ＹＯＵ＠！＠1321251351351313213213515311531514531848564658<br><br><br><br><br><br><br><br>41";
   //          // element.style['font-size'] = '100px';
   //          // element.style["background-color"] = "green" ;
   //          // element.style["width"] = '1004px !important' ;
   //          // element.style["height"] = '504px !important' ;
   //          // element.width = 1004;
   //          // element.height = 504;
   //          dummyPaint.style['opacity'] = 0;
   //          // dummyPaint.style['background-color'] = 'blue';
   //          dummyPaint.setAttribute('width', paintWidth);
   //          dummyPaint.setAttribute('height', paintHeight);

   //          var dummyPaintJObj = $(dummyPaint);
   //          dummyPaintJObj.on('click', function() {
   //              console.log('canvas click');
   //          });

   //          // element.scrolling = 'no';
			// var dummyPaintCSSObj = new THREE.CSS3DObject(dummyPaint);
			// // cssObj.position.copy(planeMesh.position);
   // //          cssObj.rotation.copy(planeMesh.rotation);
			//  dummyPaintCSSObj.position.set(0, 300, -800);
   //          //cssObj.rotation.copy(planeMesh.rotation);
   //          this.CssScene.add(dummyPaintCSSObj);

   //          //to create the paint system
   //          var paintToolMode = this.paintToolMode = { Brush: 0, Eraser: 1 };
   //          var paintTool = this.paintTool = paintToolMode.Brush;
   //          var paintFontColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'];
   //          var paintFontSizes = [1, 3, 5, 10, 15, 20];
   //          var paintFontSizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];
   //          var paint = this.paint = document.getElementById('paint');
   //          var paintJObj = this.paintJObj = $('paint');

   //          // this.paint.setAttribute('width', 160);
   //          // this.paint.setAttribute('height', 120);
   //          paint.style['border'] = '1px solid #000';
   //          paint.style['background-color'] = 'white';
   //          // paint.style['color'] = 'white';
   //          var paintContext = this.paintContext = this.paint.getContext('2d');
   //          // paint.style['opacity'] = 1;

   //          //to fill up the background color
   //          this.paintContext.fillStyle = 'solid';
   //          // this.paintContext.fillRect(0, 0, paintWidth, paintHeight);

   //          // this.paintContext.fillRect(0, 0, this.paint.width, this.paint.height);
   //          this.paintContext.lineCap = 'round';
   //          this.paintContext.fillStyle = '#ffffff';
   //          this.paintContext.fillRect(0,0,paintWidth,paintHeight);
   //          // this.paintContext.fillStyle = '#000000';
   //          // this.paintContext.fillRect(0, 0, paintWidth, paintHeight);




   //          //to create the video texture
   //          this.paintTexture = new THREE.Texture(this.paint);
   //          this.paintTexture.minFilter = THREE.LinearFilter;
   //          this.paintTexture.magFilter = THREE.LinearFilter;

   //          var paintMaterial = new THREE.MeshBasicMaterial({
   //              map: this.paintTexture,
   //              overdraw: true,
   //              side: THREE.DoubleSide
   //          });

   //          var paintGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
   //          var paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
   //          paintMesh.position.set(0, 300, -800);
   //          this.scene.add(paintMesh);

   //          function draw (x, y, type) {
   //              if(type === 'mousedown') {
   //                  console.log('mousedown');
   //                  paintContext.beginPath();
   //                  paintContext.moveTo(x, y);
   //                  dummyPaintJObj.on('mousemove', mouseOnCanvas);
   //              } else if (type === 'mousemove') {
   //                  console.log('mousemove');
   //                  mouseMove(x, y);
   //              } else if (type === 'mouseup') {
   //                  console.log('mouseup');
   //                  paintContext.closePath();
   //                  dummyPaintJObj.off('mousemove', mouseOnCanvas);
   //              }
   //              else {
   //                  console.log('draw error');
   //              }
   //          };

   //          paintContext.strokeStyle = paintFontColors[0];
   //          paintContext.lineWidth = paintFontSizes[5];

   //          function setPaintTool (tool) {
   //              paintTool = tool;
   //          };

   //          function setPaintFontColor (i) {
   //              paintContext.strokeStyle = paintFontColors[i];
   //          };

   //          function setPaintFontSize (i) {
   //              paintContext.lineWidth = paintFontSizess[i];
   //          };

   //          function clearPaint (x, y, width, height) {
   //              paintContext.clearRect(x, y, width, height);
   //          };

   //          function paintFontColorClick (i) {
   //              $('#' + paintFontColors[i]).on('click', function() {
   //                  SetColor(i);
   //                  SetTool(paintToolMode.Brush);
   //              })
   //          }

   //          function paintFontSizeClick (i) {
   //              $('#' + paintFontSizeNames[i]).on('click', function() {
   //                  SetSize(i);
   //              });
   //          }

   //          function SetPaintFontColor (i) {
   //              setColor(i);
   //              //socket
   //          }

   //          function SetPaintTool (i) {
   //              setTool(tool);
   //              //socket
   //          }

   //          function ClearPaint (x, y, width, height) {
   //              clearPaint(x, y, width, height);
   //              //socket
   //          }

   //          //to set paint event

   //          //to use dummyPaint event
   //          dummyPaintJObj.on('mousedown mouseup', mouseOnCanvas);

   //          for(var i = 0; i < paintFontColors.length; ++i) {
   //              paintFontColorClick(i);
   //          }

   //          for(var i = 0; i < paintFontSizes.length; ++i) {
   //              paintFontSizeClick(i);
   //          }

   //          $('#eraser').on('click', function() {
   //              SetTool(paintToolMode.Eraser);
   //          });

   //          $('#reset').on('click', function() {
   //              ClearPaint(0, 0, paint.width, paint.height);
   //          });

   //          function getMousePos(canvas, evt) {
   //              console.log('get mouse position');
   //              var rect = canvas.getBoundingClientRect();

   //                  // console.log()
   //              return {
   //                  x: evt.clientX - rect.left,
   //                  y: evt.clientY - rect.top
   //              };
   //          };

   //          function mouseMove(x, y) {
   //              switch(paintTool) {
   //                  case paintToolMode.Brush:
   //                      paintContext.lineTo(x, y);
   //                      paintContext.stroke();
   //                      break;
   //                  case paintToolMode.Eraser:
   //                      var halfWidth = paintContext.lineWidth * 0.5;
   //                      paintContext.clearRect(x - halfWidth, y - halfWidth, paintContext.lineWidth, paintContext.lineWidth);
   //                      break;
   //              }
   //          };

   //          function mouseOnCanvas(e) {
   //              console.log('event');
   //              var type = e.handleObj.type,
   //                  mousePos = getMousePos(dummyPaint, e);
   //                  // mousePos = getMousePos(paint, e);

   //              console.log(mousePos);
   //              draw(mousePos.x, mousePos.y, type);
   //              //socket
   //          }

            // to create the web camera


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

            //web RTC
            //var rtc = new RTC(null, player);
            //to get the web camera
            // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // window.URL = window.URL || window.webkitURL;

            // var video = this.video = document.getElementById('monitor');
            // var constraints = {audio: true, video: true};

            // // var constraints = {
            // //     'audio': true,
            // //     'video': {
            // //         'width': {
            // //             'min': '327',
            // //             'max': '640'
            // //         },
            // //         'height': {
            // //             'min': '200',
            // //             'max': '480'
            // //         }
            // //     }
            // // };

            // if(navigator.getUserMedia) {
            //     navigator.getUserMedia(constraints, successCallback, errorCallback);
            // }
            // else {
            //     console.log('webcam GG');
            // }

            // function successCallback(stream) {
            //     console.log('stream = ' + stream);
            //     console.log(video);
            //     if(window.URL) {
            //         video.src = window.URL.createObjectURL(stream);
            //         //URL.revokeObjectURL()   release
            //     }
            //     else {
            //         //Opera
            //         video.src = stream;
            //     }

            //     video.onerror = function(e) {
            //         stream.stop();
            //     };

            //     stream.onended = errorCallback;
            //     // video.play()
            // }

            // function errorCallback(e) {
            //     var msg = '';

            //     if(e.code == 1) {
            //         msg = 'User denied access to use camera';
            //     }

            //     console.log('navigator.getUserMedia error: ', error, msg);
            // }


            // //to get the html element

            // this.videoImage = document.getElementById('videoImage');
            // this.videoImageContext = this.videoImage.getContext('2d');

            // //to fill up the background color
            // this.videoImageContext.fillStyle = '#000000';
            // this.videoImageContext.fillRect(0, 0, this.videoImage.width, this.videoImage.height);

            // //to create the video texture
            // this.videoTexture = new THREE.Texture(this.videoImage);
            // this.videoTexture.minFilter = THREE.LinearFilter;
            // this.videoTexture.magFilter = THREE.LinearFilter;

            // var videoMaterial = new THREE.MeshBasicMaterial({
            //     map: this.videoTexture,
            //     overdraw: true,
            //     side: THREE.DoubleSide
            // });

            // var videoGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
            // var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

            // videoMesh.position.set(0, 50, 0);
            // this.scene.add(videoMesh);
            // // player.addObj(videoMesh, new THREE.Vector3(0, player.height - 10, 0));


            //important
			scope.camera.updateProjectionMatrix();

                //             var image = new Image();
                // image.src = scope.paint.toDataURL('image/png');
                // scope.

            // Canvas2Image.saveAsPNG(this.paint);

            /////////////////////
            // FUNCTION DEFINE //
            /////////////////////
            this.render = function() {
                var delta = scope.clock.getDelta();
                scope.ObjectsToUpdate.forEach((obj)=>obj.update(delta < 0.03 ? delta : 0.03));
                scope.stats.update();

                // if( scope.video.readyState === scope.video.HAVE_ENOUGH_DATA ) {
                //     scope.videoImageContext.drawImage(scope.video, 0, 0, scope.videoImage.width, scope.videoImage.height);
                //     // scope.paintContext.drawImage(scope.video, 0, 0, paintWidth, paintHeight);



                //     if( scope.videoTexture ){
                //         scope.videoTexture.needsUpdate = true;
                //     }


                // }


                // scope.paint

                //             var image = new Image();
                // image.src = scope.paint.toDataURL('image/png');
                // scope.paintContext.drawImage(image, 0, 0, paintWidth, paintHeight);

                // if(scope.paintTexture) {
                //     scope.paintTexture.needsUpdate = true;
                //     // console.log('YO');
                // }


                // scope.paintContext.drawImage(scope.dummyPaint, 0, 0, scope.videoImage.width, scope.videoImage.height);

                scope.renderer.render(scope.scene, scope.camera);
                scope.CssRenderer.render(scope.CssScene, scope.camera);

                if(scope.state == GAME_STATE.RUNNING)
                    scope.requestId = requestAnimationFrame(scope.render);
                // else if(this.state == GAME_STATE.STOP)
                    // cancelAnimationFrame(this.requestId);
            }
            this.pause = function(){
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
                if (scope.requestId){
                    cancelAnimationFrame(scope.requestId);
                    console.log("Game has stopped..."+scope.requestId);
                }
            }

            this.state = GAME_STATE.READY;
        },
        isRunning: function(){
            return this.state === GAME_STATE.RUNNING;
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
        addCSSObject: function(obj, model){
            if(!obj.update){
                console.error("There is no update() in", obj);
                return ;
            }
            // TODO: CssScene Must be added.
            this.CssScene.add(obj);
            this.ObjectsToUpdate.push(obj);
        },
        children: function() {
            return scene.children;
        },
        setController: function(controller){
            if(this.Controller)
                this.Controller.controls.enable(false, this.container);

            // controller.in(this.scene, this.renderer);
            this.add(controller);
            this.add(controller.feet);
            this.add(controller.dummyBody);
            controller.controls.enable(true, this.scene, this.container);

            if(this.socket)
                controller.socket = this.socket;

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
