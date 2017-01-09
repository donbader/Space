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

    const iceConfig = { 'iceServers': [{ 'urls': 'stun:stun.iptel.org' }] };

    var RTC = this.RTC = THREE.Object3D.extend({
        init: function(server, player, users) {
            'use strict';

            //need?

            // this.server = server;
            // this.server = { 'iceServers': [{ 'urls': 'stun:stun.iptel.org' }] };
            // this.player = player;
            this.server = server;
            //main player
            this.player = player;

            //others
            // this.users = {};
            this.users = users;
            console.log('users in init = ', this.users);

            //no users???
            // foreach(var userID in users) {
            //     console.log('create peer in init');
            //     this.users[userID] = {};
            // }

            // this.users = {};
            // this.remoteStreams = {};

            // console.log('this.server in init = ' + this.server);

            // this.planeWidth = 100;
            // this.planeHeight = 100;

            //<video id = 'monitor' autoplay width = '160' height = '120' style = 'visibility: hidden; float: left; position: fixed;'></video>

            console.log('I am ' + this.player.name + ' id = ' + this.player.userID);

            // this.localVideo = document.createElement('video');
            // // this.remoteVideo = document.createElement('video');

            // var temp = null;
            // temp = this.addMeshToPlayer(new THREE.Vector3(0, 250, 0));
            // this.localVideoImage = temp[0];
            // this.localVideoImageContext = temp[1];
            // this.localVideoTexture = temp[2];

            // temp = this.addMeshToPlayer(new THREE.Vector3(0, 400, 0));
            // this.remoteVideoImage = temp[0];
            // this.remoteVideoImageContext = temp[1];
            // this.remoteVideoTexture = temp[2];

            // console.log('this.server in init = ' + this.server);

            this.getLocalStream();

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
        createPeerConnection(id) {
            if(this.users[id] && this.users[id].pc) {
                console.log('id = ' + id + ' has created');
                return this.users[id].pc;
            }

            //to create new peer
            console.log('create a new peer connection');

            var pc = new RTCPeerConnection(iceConfig);
            this.users[id].pc = pc;

            pc.onicecandidate = (event) => {
                console.log('on ice candidate');
                this.server.emit('RTC msg to server', { by: this.player.userID, to: id, ice: event.candidate, type: 'ice' });
            };

            pc.onaddstream = (event) => {
                console.log('receiving new stream');

                //??
                event.stream.onended = function() {
                    console.log('id ' + this.player.userID + ' stream end');
                }

                // this.server.emit('set new remote stream', event);
                this.setRemoteStream(event, id);
            };

            pc.onremovestream = (evnet) => {
                this.trace('id ' + this.player.userID + ' stream close');
            }

            pc.addStream(this.stream);

            return pc;
        },
        getPeerConnection: function(id) {
            console.log('users in get peer connection = ', this.users);
            if (this.users[id] && this.users[id].pc) {
                //be created in advance
                return this.users[id].pc;
            }

            return this.createPeerConnection(id);
        },
        deletePeerConnection: function(id) {
            if(!this.users[id]) {    
                return;
            }

            this.users[id].stream.stop();
            this.users[id].pc.removeStream(this.users[id].stream);
            this.users[id].pc.close();
            // delete this.users[id];
        },
        makeOffer: function(id) {
            var pc = this.getPeerConnection(id);
            console.log('offer');
            //why pc create offer ???
            pc.createOffer((sdp) => {
                pc.setLocalDescription(sdp);
                console.log('creating an offer for', id);

                this.server.emit('RTC msg to server', { by: this.player.userID, to: id, sdp: sdp, type: 'sdp-offer' });
            }, (error) => this.errorHandler(error));
        },
        handleMessage(msg) {
            var pc = this.getPeerConnection(msg.by);
            switch (msg.type) {
                case 'sdp-offer':
                    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), () => {
                        console.log('setting remote description by offer');
                        pc.createAnswer((sdp) => {
                            pc.setLocalDescription(sdp);
                            console.log('send out answer from ' + this.player.userID + ' to ' + msg.by);
                            this.server.emit('RTC msg to server', {by: this.player.userID, to: msg.by, sdp: sdp, type: 'sdp-answer'});
                        }, (error) => this.errorHandler(error)
                    );
                    });
                    break;
                case 'sdp-answer':
                    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), () => {
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
            // this.server.on('RTC start', function())

            this.server.on('RTC peer connection', (msg) => {
                console.log('receiving peer connection to ' + this.player.userID);
                this.makeOffer(msg.id);
            });

            this.server.on('RTC peer disconnection', (msg) => {
                //do something
                console.log('client disconnection');
                this.deletePeerConnection(msg.id);
            });

            this.server.on('RTC msg to client', (msg) => {
                console.log('receiving msg');
                this.handleMessage(msg);
            });

            this.server.on('RTC close', () => {
                console.log('rtc close');
                // this.localStream.stop();
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
        getLocalStream: function(RTCstream) {
            console.log('requesting local stream');

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia(constraints, (stream) => {
                        console.log('receiving local stream');

                        this.stream = stream;
                        console.log('local stream = ', stream);
                        console.log('local stream length = ' + stream.getVideoTracks().length)
                        this.player.setStream(stream);
                        this.addHandlers();
                        this.server.emit('RTC new connection', this.player.userID)
                    },
                    function(error) {
                        //??
                        conosole.log('getUserMedia error: ', error);
                    }
                );
            } else {
                console.log('navigator.getUserMedia is null');
            }
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
        setRemoteStream: function(event, id) {
            // this.remoteVideo.src = window.URL.createObjectURL(stream);
            // console.log('remote video in got remote stream = ' + this.remoteVideo);
            // console.log('this in got remote stream = ' + this);
            // console.log('event in set remote stream = ', event);

            console.log('id = ' + id);

            if(this.users[id]) {
                console.log('new stream');

                this.users[id].stream = event.stream;
                console.log('this.users in set remote stream = ', this.users);
                console.log('remote stream = ', event.stream);
                console.log('remote stream length = ' + event.stream.getVideoTracks().length)
                this.users[id].object.setStream(event.stream);


                // this.users[event.id].video] = document.createElement('video');
                // var temp = this.addMeshToPlayer(new THREE.Vector3(0, 400, 0));
                // this.users[event.id].image] = temp[0];
                // this.users[event.id].imageContext] = temp[1];
                // this.users[event.id].texture] = temp[2];

                // this.users[event.id].video].src = window.URL.createObjectURL(event.stream);
                this.trace('Received remote stream');
            }
            else {
                this.trace('no user has id = ' + id);
            }
        },
        start: function() {
            this.trace('requesting local stream');

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
        start1: function(call) {
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
            // if (this.localVideo.readyState === this.localVideo.HAVE_ENOUGH_DATA) {
            //     this.localVideoImageContext.drawImage(this.localVideo, 0, 0, this.localVideoImage.width, this.localVideoImage.height);

            //     if (this.localVideoTexture) {
            //         this.localVideoTexture.needsUpdate = true;
            //     }
            // }

            // for(var id in this.users) {

            // if (this.users[id].video] && this.users[id].video].readyState === this.users[id].video].HAVE_ENOUGH_DATA) {
            //     this.users[id].imageContext].drawImage(this.users[id].video], 0, 0,  this.users[id].image].width,  this.users[id].image].height);

            //     if ( this.users[id].texture]) {
            //         this.users[id].texture].needsUpdate = true;
            //     }
            // }
            // }

            // this.users.forEach((peer) => {
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
