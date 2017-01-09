(function() {
    const VIEW_ANGLE = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.1,
        FAR = 20000,
        PI_2 = Math.PI / 2;


    const MODE_VIEW = { FIRST_PERSON: 0, THIRD_PERSON: 1 };

    //for rtc
    const constraints = { audio: true, video: true };
    // const constrains = {
    //     'audio': true,
    //     'video': {
    //         'width': {
    //             'min': '327',
    //             'max': '640'
    //         },
    //         'height': {
    //             'min': '200',
    //             'max': '480'
    //         }
    //     }
    // };
    //

    var Character = this.Character = THREE.Object3D.extend({
        init: function(data, info) {
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
            // this.server = server;
            //

            // this.socket = {};

            this.position.set(0, this.info.height / 2, 500);
            // Body
            this.body = new THREE.Mesh(new THREE.CubeGeometry(this.info.width, this.info.height, this.info.thickness), new THREE.MeshPhongMaterial({ color: 0x00ffff }));
            this.body.position.set(0, this.info.height / 2, 0);
            this.add(this.body);

            // eye
            this.eye = new THREE.Object3D();
            this.eye.add(camera);
            this.body.add(this.eye);

            // mode
            this.mode = {
                set view(v) {
                    switch (v) {
                        case MODE_VIEW.FIRST_PERSON:
                            scope.eye.position.set(0, scope.info.height - 10, 0);
                            break;
                        case MODE_VIEW.THIRD_PERSON:
                            scope.eye.position.set(0, scope.info.height + 300, 500);
                            scope.turn(0, -0.7);
                            break;
                    }
                }
            };
            this.mode.view = MODE_VIEW.THIRD_PERSON;

            ////////////////////////////
            ///// Controls /////////////
            ////////////////////////////
            this.controls = new Controls(this).mode("normal");

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
            //
        },
        update: function(delta) {
            // Control moving
            this.controls.update(delta);

            //for rtc
            if (this.webcamVideo.readyState === this.webcamVideo.HAVE_ENOUGH_DATA) {
                
                this.webcamImageContext.drawImage(this.webcamVideo, 0, 0, this.webcamImage.width, this.webcamImage.height);

                if (this.webcamTexture) {
                    this.webcamTexture.needsUpdate = true;
                }
            }
            //
        },
        ServerUpdate: function() {
            if (!this.socket) return;
            var scope = this;
            this.socket.emit('update user to all', {
                position: scope.position,
                rotation: scope.rotation
            });
        },
        move: function(x, y, z) {
            this.position.x += x || 0;
            this.position.y += y || 0;
            this.position.z += z || 0;
            if (x || y || z && this.socket) {
                this.ServerUpdate();
            }
        },
        translate: function(x, y, z) {
            this.translateX(x || 0);
            this.translateY(y || 0);
            this.translateZ(z || 0);
            if (x || this.position.y || z && this.socket) {
                this.ServerUpdate();
            };
        },
        turn: function(x, y) {
            x = x || 0;
            y = y || 0;
            this.rotation.y += x;
            this.eye.rotation.x += y;
            this.eye.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.eye.rotation.x));
            if (x || y && this.socket) {
                this.ServerUpdate();
            }
        },
        manipulate: function(item) {
            if (item.Objects) {
                for (var manipulate in item.Objects) {
                    this.can(manipulate, item.Objects[manipulate]);
                }
            }
            if (item.prop) {
                for (var manipulate in item.prop) {
                    if (item.prop[manipulate])
                        this.can(manipulate, [item]);
                }
            }
        },
        can: function(manipulate, arr) {
            this.controls.can(manipulate, arr);
        },
        setStream: function(stream) {
            console.log('character ' + this.name + ' set stream');

            window.URL = window.URL || window.webkitURL;
            this.webcamVideo.src = window.URL.createObjectURL(stream);
            this.stream = stream;
        }
    });

})();
