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

    const iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }] };

    var RTC = this.RTC = THREE.Object3D.extend({
        init: function(player, server) {
            'use strict';

            //need?

            // this.server = server;
            // this.server = { 'iceServers': [{ 'urls': 'stun:stun.iptel.org' }] };
            this.player = player;
            this.server = server;

            this.peers = {};


            // this.peers = {};
            // this.remoteStreams = {};

            // console.log('this.server in init = ' + this.server);

            this.planeWidth = 100;
            this.planeHeight = 100;

            //<video id = 'monitor' autoplay width = '160' height = '120' style = 'visibility: hidden; float: left; position: fixed;'></video>

            this.localVideo = document.createElement('video');
            // this.remoteVideo = document.createElement('video');

            var temp = null;
            temp = this.addMeshToPlayer(new THREE.Vector3(0, 250, 0));
            this.localVideoImage = temp[0];
            this.localVideoImageContext = temp[1];
            this.localVideoTexture = temp[2];

            // temp = this.addMeshToPlayer(new THREE.Vector3(0, 400, 0));
            // this.remoteVideoImage = temp[0];
            // this.remoteVideoImageContext = temp[1];
            // this.remoteVideoTexture = temp[2];

            console.log('this.server in init = ' + this.server);

            this.addHandlers();

            // this.start(() => this.call());
            //this.call();
        },
        trace: function(text) {
            // console.log((performance.now() / 1000).toFixed(3) + ': ' + text);
            console.log('text = ' + text);
        },
        errorHandler: function(error) {
            console.log('error = ', error);
        },
        getPeerConnection: function(name) {
            if (this.peers[name][pc]) {
                //be created in advance
                return this.peers[name][pc];
            }

            //to create new peer connection
            console.log('create a new peer connection');
            this.peers[name] = {};

            var pc = new RTCPeerConnection(iceConfig);
            this.peers[name][pc] = pc;

            //to get local stream
            this.localStream = this.getLocalStream();
            pc.addStream(this.localStream);

            pc.onicecandidate = (event) => {
                this.server.emit('RTC msg to server', { from: this.name, to: name, ice: event.candidate, type: 'ice' });
            };

            pc.onaddstream = (event) => {
                console.log('receiving new stream');

                //??
                event.stream.onended = function() {
                    console.log('name ' + this.name + ' stream end');
                }

                // this.server.emit('set new remote stream', event);
                this.setRemoteStream(event);
            };

            pc.onremovestream = (evnet) => {
                this.trace('name ' + this.name + ' stream close');
            }

            return pc;
        },
        deletePeerConnection: function(name) {
            if(!this.peers[name][pc]) {
                return;
            }

            this.peers[name][stream].stop();
            this.peers[name][pc].removeStream(this.peers[name][stream]);
            this.peers[name][pc].close();
            delete this.peers[name];
        },
        makeOffer: function(name) {
            var pc = getPeerConnection(name);
            //why pc create offer ???
            pc.createOffer((sdp) => {
                pc.setLocalDescription(sdp);
                console.log('creating an offer for', name);

                this.server.emit('RTC msg to server', { by: this.name, to: name, sdp: sdp, type: 'sdp-offer' });
            }, (error) => this.errorHandler(error));
        },
        handleMessage(msg) {
            var pc = getPeerConnection(msg.by);
            switch (msg.type) {
                case 'sdp-offer':
                    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), function() {
                        console.log('setting remote description by offer');
                        pc.createAnswer(function(sdp) {
                            pc.setLocalDescription(sdp);
                            this.server.emit('RTC msg to server', {by: this.name, to: msg.by, sdp: sdp, type: 'sdp-answer'});
                        });
                    });
                    break;
                case 'sdp-answer':
                    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), function() {
                        console.log('setting remote description by answer');

                    }, (error) => this.errorHandler(error)
                    );
                    break;
                case 'ice':
                    if(msg.ice) {
                        console.log('adding ice candidates');
                        pc.addIceCandidate(new RTCIceCandidate(msg.ice));
                    }
                    break;
            }
        },
        addHandlers: function() {
            console.log('this.server in addHandlers = ' + this.server);

            this.server.on('RTC peer connection', function(msg) {
                makeOffer(msg.name);
            });

            this.server.on('RTC peer disconnection', function(msg) {
                //do something
                console.log('client disconnection');
                deletePeerConnection(msg.name);
            });

            this.server.on('RTC msg  to client', function(msg) {
                handleMessage(msg);
            });

            this.server.on('RTC close', function() {
                this.localStream.stop();
            });
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
        getLocalStream: function() {
            this.trace('Requesting local stream');

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (navigator.getUserMedia) {
                navigator.getUserMedia(constraints, (stream) => {
                        this.trace('receive local stream');
                        this.setLocalStream(stream);
                        return stream;
                    },
                    function(error) {
                        //??
                        this.trace('getUserMedia error: ', error);
                    }
                );
            } else {
                this.trace('navigator.getUserMedia is null');
            }

            return null;
        },
        setLocalStream: function(stream) {
            this.trace('set local stream');
            // this.localVideo.src = window.URL.createObjectURL(stream);

            window.URL = window.URL || window.webkitURL;
            console.log("stream = " + stream);
            console.log('video = ' + this.localVideo);
            console.log('window.URL = ' + window.URL);

            this.localVideo.src = window.URL.createObjectURL(stream);
            this.localStream = stream;
        },
        setRemoteStream: function(event) {
            // this.remoteVideo.src = window.URL.createObjectURL(stream);
            // console.log('remote video in got remote stream = ' + this.remoteVideo);
            // console.log('this in got remote stream = ' + this);
            console.log('event in set remote stream = ', event);

            if(!this.peers[event.name][stream]) {
                console.log('new stream');

                this.peers[event.name][stream] = event.stream;
                this.peers[event.name][video] = document.createElement('video');
                var temp = this.addMeshToPlayer(new THREE.Vector3(0, 400, 0));
                this.peers[event.name][image] = temp[0];
                this.peers[event.name][imageContext] = temp[1];
                this.peers[event.name][texture] = temp[2];

                this.peers[event.name][video].src = window.URL.createObjectURL(event.stream);
                this.trace('Received remote stream');
            }
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
                this.trace('navigator.getUserMedia is null');
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

            // console.log('this.server in calll = ' + this.server);

            this.localPeerConnection = new RTCPeerConnection(iceConfig);
            this.trace('Created local peer connection object localPeerConnection');
            this.localPeerConnection.onicecandidate = (event) => this.gotLocalIceCandidate(event);

            this.localPeerConnection.onaddstream = (event) => this.gotRemoteStream(evnet);
            this.localPeerConnection.onnegotiationneeded = () => {
                this.localPeerConnection.createOffer((description) => this.gotLocalDescription(description),
                    function(error) {
                        this.trace('localPeerConnection.createOffer error: ', error);
                    }
                );
            }

            // this.remotePeerConnection = new RTCPeerConnection(this.server);
            // this.trace('Created remote peer connection object remotePeerConnection');
            // this.remotePeerConnection.onicecandidate = (event) => this.gotRemoteIceCandidate(event);
            // this.remotePeerConnection.onaddstream = (event) => this.gotRemoteStream(event);

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
            // console.log('remote video in got remote stream = ' + this.remoteVideo);
            // console.log('this in got remote stream = ' + this);
            this.remoteVideo.src = window.URL.createObjectURL(event.stream);
            this.trace('Received remote stream');
        },
        gotLocalIceCandidate: function(event) {
            //???
            // console.log('this in got local ice candidate = ' + this);

            if (event.candidate) {
                // this.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
                // this.trace('Local ICE candidate: \n' + event.candidate.candidate);

                this.trace('Local ICE candidate');
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

            for(var name in this.peers) {
            if (this.peers[name][video].readyState === this.peers[name][video].HAVE_ENOUGH_DATA) {
                this.peers[name][imageContext].drawImage(this.peers[name][video], 0, 0,  this.peers[name][image].width,  this.peers[name][image].height);

                if ( this.peers[name][texture]) {
                    this.peers[name][texture].needsUpdate = true;
                }
            }
            }

            // this.peers.forEach((peer) => {
            // if (peer[video].readyState === peer[video].HAVE_ENOUGH_DATA) {
            //     peer[imageContext].drawImage(peer[video], 0, 0,  peer[image].width,  peer[image].height);

            //     if ( peer[texture]) {
            //         peer[texture].needsUpdate = true;
            //     }
            // }
            // });

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
