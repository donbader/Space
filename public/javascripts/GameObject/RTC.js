(function() {
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

    var RTC = this.RTC = THREE.Object3D.extend({
        init: function(server, player) {
            'use strict';

            //need?

            // this.server = server;
            this.server = { 'iceServers': [{ 'urls': 'stun:stun.iptel.org' }] };
            this.player = player;

            console.log('this.server in init = ' + this.server);

            this.planeWidth = 100;
            this.planeHeight = 100;

            //<video id = 'monitor' autoplay width = '160' height = '120' style = 'visibility: hidden; float: left; position: fixed;'></video>

            this.localVideo = document.createElement('video');
            this.remoteVideo = document.createElement('video');

            var temp = null;
            temp = this.addMeshToPlayer(new THREE.Vector3(0, 250, 0));
            this.localVideoImage = temp[0];
            this.localVideoImageContext = temp[1];
            this.localVideoTexture = temp[2];

            temp = this.addMeshToPlayer(new THREE.Vector3(0, 400, 0));
            this.remoteVideoImage = temp[0];
            this.remoteVideoImageContext = temp[1];
            this.remoteVideoTexture = temp[2];

            this.start(() => this.call());
            //this.call();
        },
        trace: function(text) {
            // console.log((performance.now() / 1000).toFixed(3) + ': ' + text);
            console.log('text = ' + text);
        },
        gotStream: function(stream) {
            console.log("got stream this = ", this);
            this.trace('Received local stream');

            // this.localVideo.src = window.URL.createObjectURL(stream);

            window.URL = window.URL || window.webkitURL;
            console.log("stream = " + stream);
            console.log('video = ' + this.localVideo);
            console.log('window.URL = ' + window.URL);

            this.localVideo.src = window.URL.createObjectURL(stream);
            this.localStream = stream;
        },
        start: function(call) {
            this.trace('Requesting local stream');

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (navigator.getUserMedia) {
                navigator.getUserMedia(constraints, (stream) => {
                        this.gotStream(stream);
                        call();
                    },
                    function(error) {
                        //??
                        this.trace('getUserMedia error: ', error);
                    }
                );
            } else {
                console.log('gg');
            }

        },
        call: function() {
            this.trace('Starting call');

            //???
            if (this.localStream.getVideoTracks().length > 0) {
                this.trace('Using video device: ' + this.localStream.getVideoTracks()[0].label);
            }
            if (this.localStream.getAudioTracks().length > 0) {
                this.trace('Using audio device: ' + this.localStream.getAudioTracks()[0].label);
            }

            console.log('this.server in calll = ' + this.server);

            this.localPeerConnection = new RTCPeerConnection(this.server);
            this.trace('Created local peer connection object localPeerConnection');
            this.localPeerConnection.onicecandidate = (event) => this.gotLocalIceCandidate(event);

            this.remotePeerConnection = new RTCPeerConnection(this.server);
            this.trace('Created remote peer connection object remotePeerConnection');
            this.remotePeerConnection.onicecandidate = (event) => this.gotRemoteIceCandidate(event);
            this.remotePeerConnection.onaddstream = (event) => this.gotRemoteStream(event);

            this.localPeerConnection.addStream(this.localStream);
            this.trace('Added localStream to localPeerConnection');
            this.localPeerConnection.createOffer((description) => this.gotLocalDescription(description),
                function(error) {
                    this.trace('localPeerConnection.createOffer error: ', error);
                }
            );

            console.log('this.localStream = ' + this.localStream);
        },
        gotLocalDescription: function(description) {
            //???
            this.localPeerConnection.setLocalDescription(description);
            // this.trace('Offer from localPeerConnection: \n' + description.sdp);
            this.trace('Offer from localPeerConnection');
            this.remotePeerConnection.setRemoteDescription(description);
            this.remotePeerConnection.createAnswer((description) => this.gotRemoteDescription(description),
                function(error) {
                    this.trace('remotePeerConnection.createAnswer error: ', error);
                }
            );
        },
        gotRemoteDescription: function(description) {
            //???
            this.remotePeerConnection.setLocalDescription(description);
            // this.trace('Answer from remotePeerConnection: \n' + description.sdp);
            this.trace('Answer from remotePeerConnection');
            this.localPeerConnection.setRemoteDescription(description);
        },
        gotRemoteStream: function(event) {
            // this.remoteVideo.src = window.URL.createObjectURL(stream);
            console.log('remote video in got remote stream = ' + this.remoteVideo);
            console.log('this in got remote stream = ' + this);
            this.remoteVideo.src = window.URL.createObjectURL(event.stream);
            this.trace('Received remote stream');
        },
        gotLocalIceCandidate: function(event) {
            //???
            console.log('this in got local ice candidate = ' + this);

            if (event.candidate) {
                this.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
                this.trace('Local ICE candidate: \n' + event.candidate.candidate);
            }
        },
        gotRemoteIceCandidate: function(event) {
            //???
            if (event.candidate) {
                this.localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
                this.trace('Remote ICE candidate: \n' + event.candidate.candidate);
            }
        },
        addMeshToPlayer: function(position) {
            //to create the html element
            var videoImage = document.createElement('canvas');
            //<canvas id = 'videoImage' width = '160' height = '120' style = 'visibility: hidden; float: left; position: fixed;'></canvas>
            var videoImageContext = videoImage.getContext('2d');

            //to fill up the background color
            videoImageContext.fillStyle = '#000000';
            videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

            //to create the video texture
            var videoTexture = new THREE.Texture(videoImage);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;

            var videoMaterial = new THREE.MeshBasicMaterial({
                map: videoTexture,
                overdraw: true,
                side: THREE.DoubleSide
            });

            var videoGeometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight, 1, 1);
            var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

            videoMesh.position.set(position.x, position.y, position.z);

            this.player.add(videoMesh);
            
            return [videoImage, videoImageContext, videoTexture]
        },
        update: function() {
            if (this.localVideo.readyState === this.localVideo.HAVE_ENOUGH_DATA) {
                this.localVideoImageContext.drawImage(this.localVideo, 0, 0, this.localVideoImage.width, this.localVideoImage.height);

                if (this.localVideoTexture) {
                    this.localVideoTexture.needsUpdate = true;
                }
            }

            if (this.remoteVideo.readyState === this.remoteVideo.HAVE_ENOUGH_DATA) {
                this.remoteVideoImageContext.drawImage(this.remoteVideo, 0, 0, this.remoteVideoImage.width, this.remoteVideoImage.height);

                if (this.remoteVideoTexture) {
                    this.remoteVideoTexture.needsUpdate = true;
                }
            }
        },
        close: function() {
            this.trace('close RTC');

            this.localPeerConnection.close();
            this.remotePeerConnection.close();
            this.localPeerConnection = null;
            this.remotePeerConnection = null;
        }
    });
})();
