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
    //

    const iceConfig = { 'iceServers': [{ 'urls': 'stun:stun.iptel.org' }] };

    var RTC = this.RTC = THREE.Object3D.extend({
        init: function(server, player, users) {
            'use strict';

            //need?
            this.server = server;
            //main player
            this.player = player;
            //others
            this.users = users;

            this.trace('I am ' + this.player.name + ' id = ' + this.player.userID);

            //to get camera stream
            this.getLocalStream();
        },
        trace: function(text) {
            console.log((performance.now() / 1000).toFixed(3) + ': ', text);
        },
        errorHandler: function(error) {
            this.trace('error = ', error);
        },
        createPeerConnection(id) {
            if (this.users[id] && this.users[id].pc) {
                this.trace('id = ' + id + ' has created');
                return this.users[id].pc;
            }

            //to create new peer
            this.trace('creating a new peer connection');

            var pc = new RTCPeerConnection(iceConfig);
            this.users[id].pc = pc;

            pc.onicecandidate = (event) => {
                // this.trace('on ice candidate');
                this.server.emit('RTC msg to server', { by: this.player.userID, to: id, ice: event.candidate, type: 'ice' });
            };

            pc.onaddstream = (event) => {
                this.trace('receiving new stream');

                //??
                event.stream.onended = () => {
                    this.trace('id ' + this.player.userID + ' stream end');
                }

                this.setRemoteStream(event, id);
            };

            pc.onremovestream = (evnet) => {
                this.trace('id ' + this.player.userID + ' stream close');
            }

            pc.addStream(this.stream);

            return pc;
        },
        getPeerConnection: function(id) {
            if (this.users[id] && this.users[id].pc) {
                //be created in advance
                return this.users[id].pc;
            }

            return this.createPeerConnection(id);
        },
        deletePeerConnection: function(id) {
            if (!this.users[id] || !this.users[id].pc) {
                this.trace('there is no users with id = ' + id);
                return;
            }

            if(this.users[id].stream.getVideoTracks()[0])
                this.users[id].stream.getVideoTracks()[0].stop();

            if(this.users[id].stream.getAudioTracks()[0])
                this.users[id].stream.getAudioTracks()[0].stop();

            this.users[id].pc.removeStream(this.users[id].stream);
            this.users[id].pc.close();
            this.users[id].pc = null;
            delete this.users[id].pc;
        },
        makeOffer: function(id) {
            var pc = this.getPeerConnection(id);
            //why pc create offer ???
            pc.createOffer((sdp) => {
                pc.setLocalDescription(sdp);
                this.trace('creating an offer for', id);

                this.server.emit('RTC msg to server', { by: this.player.userID, to: id, sdp: sdp, type: 'sdp-offer' });
            }, (error) => this.errorHandler(error));
        },
        handleMessage(msg) {
            var pc = this.getPeerConnection(msg.by);
            switch (msg.type) {
                case 'sdp-offer':
                    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), () => {
                        this.trace('setting remote description by offer');
                        pc.createAnswer((sdp) => {
                            pc.setLocalDescription(sdp);
                            this.trace('send out answer from ' + this.player.userID + ' to ' + msg.by);
                            this.server.emit('RTC msg to server', { by: this.player.userID, to: msg.by, sdp: sdp, type: 'sdp-answer' });
                        }, (error) => this.errorHandler(error));
                    });
                    break;
                case 'sdp-answer':
                    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), () => {
                        this.trace('setting remote description by answer');
                    }, (error) => this.errorHandler(error));
                    break;
                case 'ice':
                    if (msg.ice) {
                        // this.trace('adding ice candidates');
                        pc.addIceCandidate(new RTCIceCandidate(msg.ice));
                    }
                    break;
            }
        },
        addHandlers: function() {
            this.server.on('RTC peer connection', (msg) => {
                // this.trace('receiving peer connection to ' + this.player.userID);
                this.makeOffer(msg.id);
            });

            this.server.on('RTC peer disconnection', (msg) => {
                this.trace('client disconnection');
                this.deletePeerConnection(msg.id);
            });

            this.server.on('RTC msg to client', (msg) => {
                // this.trace('receiving msg');
                this.handleMessage(msg);
            });

            this.server.on('RTC close', () => {
                this.trace('rtc close');
                this.close();
                // this.localStream.stop();
            });
        },
        getLocalStream: function(RTCstream) {
            this.trace('requesting local stream');

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia(constraints, (stream) => {
                        this.trace('receiving local stream');

                        this.stream = stream;
                        this.player.setStream(stream);

                        //to add handlers after setting up local stream
                        this.addHandlers();
                        this.server.emit('RTC new connection', this.player.userID)
                    },
                    (error) => {
                        this.trace('getUserMedia error: ', error);
                    }
                );
            } else {
                this.trace('navigator.getUserMedia is null');
            }
        },
        setRemoteStream: function(event, id) {
            if (this.users[id] && this.users[id].object) {
                this.users[id].stream = event.stream;
                this.users[id].object.setStream(event.stream);
            } else {
                this.trace('no user has id = ' + id + ' or user with id has no character object');
            }
        },
        close: function() {
            this.trace('closing RTC self');

            for (var id in this.users) {
                deletePeerConnection(id);
            }
        }
    });
})();
