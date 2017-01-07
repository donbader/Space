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

    var RTC = THREE.Object3D.extend({
        init: function(server, player) {
            'use strict';

            //need?
            // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // window.URL = window.URL || window.webkitURL;

            this.server = server;
            this.player = player;

            this.planeWidth = 100;
            this.planeHeight = 100;

            this.localVideo = document.createElement('video');
            this.remoteVideo = document.createElement('video');

            addMeshToPlayer(this.localVideoImage, this.localVideoImageContext, this.localVideoTexture, this.player);
            addMeshToPlayer(this.remoteVideoImage, this.remoteVideoImageContext, this.remoteVideoTexture, this.player);

            this.start();
            this.call();
        },
        trace: function(text) {
            // console.log((performance.now() / 1000).toFixed(3) + ': ' + text);
            console.log('text = ' + text);
        },
        gotStream(stream) {
            trace('Received local stream');

            // this.localVideo.src = window.URL.createObjectURL(stream);
            this.localVideo.src = URL.createObjectURL(stream);
            this.localStream = stream;
        },
        start: function() {
            trace('Requesting local stream');

            // if(navigator.getUserMedia)
            getUserMedia(constrains, this.gotStream,
                function(error) {
                    //??
                    trace('getUserMedia error: ', error);
                }
            );
        },
        call: function() {
            trace('Starting call');

            //???
            if (this.localStream.getVideoTracks().length > 0) {
                trace('Using video device: ' + this.localStream.getVideoTracks()[0].label);
            }
            if (this.localStream.getAudioTracks().length > 0) {
                trace('Using audio device: ' + this.localStream.getAudioTracks()[0].label);
            }

            this.localPeerConnection = new RTCPeerConnection(this.server);
            trace('Created local peer connection object localPeerConnection');
            this.localPeerConnection.onicecandidate = gotLocalIceCandidate;

            this.remotePeerConnection = new RTCPeerConnection(this.server);
            trace('Created remote peer connection object remotePeerConnection');
            this.remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
            this.remotePeerConnection.onaddstream = gotRemoteStream;

            this.localPeerConnection.addStream(this.localStream);
            trace('Added localStream to localPeerConnection');
            this.localPeerConnection.createOffer(gotLocalDescription,
                function(error) {
                    trace('localPeerConnection.createOffer error: ', error);
                }
            );
        },
        gotLocalDescription: function(description) {
            //???
            this.localPeerConnection.setLocalDescription(description);
            trace('Offer from localPeerConnection: \n' + description.sdp);
            this.remotePeerConnection.setRemoteDescription(description);
            this.remotePeerConnection.createAnswer(gotRemoteDescription,
                function(error) {
                    trace('remotePeerConnection.createAnswer error: ', error);
                }
            );
        },
        gotRemoteDescription: function(description) {
            //???
            this.remotePeerConnection.setLocalDescription(description);
            trace('Answer from remotePeerConnection: \n' + description.sdp);
            this.localPeerConnection.setRemoteDescription(description);
        },
        gotRemoteStream: function(event) {
            // this.remoteVideo.src = window.URL.createObjectURL(stream);
            this.remoteVideo.src = URL.createObjectURL(stream);
            trace('Received remote stream');
        },
        gotLocalIceCandidate: function(event) {
            //???
            if (event.candidate) {
                this.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
                trace('Local ICE candidate: \n' + event.candidate.candidate);
            }
        },
        gotRemoteIceCandidate: function(event) {
            //???
            if (event.candidate) {
                this.localPeerConnection.addIceCandidate(newRTCIceCandidate(event.candidate));
                trace('Remote ICE candidate: \n' + event.candidate.candidate);
            }
        },
        addMeshToPlayer: function(videoImage, videoImageContext, videoTexture, player) {

            //to create the html element
            this.videoImage = document.createElement('canvas');
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

            var videoGeometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight, 1, 1);
            var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

            // videoMesh.position.set(0, 50, 0);
            // this.scene.add(videoMesh);
            player.addObj(videoMesh, new THREE.Vector3(0, player.height - 10, 0));
        }
        close: function() {
            trace('close RTC');

            this.localPeerConnection.close();
            this.remotePeerConnection.close();
            this.localPeerConnection = null;
            this.remotePeerConnection = null;
        }
    });
})();
