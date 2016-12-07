
// Webcam.set({
//     width: 320,
//     height: 240,
//     image_format: 'jpeg',
//     jpeg_quality: 90
// });

// Webcam.attach('#camera');


(function webcam() {
    /*
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

if (!navigator.getUserMedia) {
    return alert('getUserMedia not supported in this browser.');
}
*/



var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var audioSource;
var cw = Math.floor(canvas.clientWidth / 2);
var ch = Math.floor(canvas.clientHeight/2);
var stream;
//canvas.width = cw;
//canvas.height = ch;

//off dom video player
var video = document.createElement("video");
video.autoplay="autoplay";
video.addEventListener('playing', function(){
    //delay for settling...
    console.log(this);
    setTimeout(draw,50,this,context,(currentSource*canvas.clientWidth/2),cw,ch);
},false);

//to set socket

var socket = io.connect('/');
socket.on('getStream', function(data) {
    //return next(data.mediaStream);
    stream = data.mediaStream;
});

function captureVideo() {
    //console.log("Capturing " + currentSource,videosources[currentSource]);
    var mediaOptions = {
        audio: {
            optional: [{sourceId: audioSource}]
        },
        video: {
            optional: [
                {sourceId: videosources[currentSource].id}
            ]
        }};
    //navigator.getUserMedia(mediaOptions, success, errorCallback);

    success(stream);
}

var currentSource=0;
var videosources = [];
var lastStream;
function errorCallback(error){
    //console.log("navigator.getUserMedia error: ", error);
}
function success(stream) {
    //console.log("the stream" + currentSource,stream);
    video.src = window.URL.createObjectURL(stream);
    video.play();
    lastStream=stream;
}

function next(){
    //console.log("next");
    //console.log(lastStream);
    if(lastStream){
        lastStream.getTracks()[0].stop();
    }
    video.src = "";
    if(currentSource < videosources.length-1){
        currentSource+=1;
    }
    else
    {
        currentSource=0;
    }

    //stream = mediaStream;

    captureVideo();
}
function draw(v,c,l,w,h) {
    if(v.paused || v.ended) return false;
    //console.log("drawing",l)
    c.drawImage(v,l,0,w,h);
    setTimeout(next,25);
}

MediaStreamTrack.getSources(function (sourceInfos) {

    for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audio') {
            //console.log(sourceInfo.id, sourceInfo.label || 'microphone');
            audioSource=sourceInfo.id;

        } else if (sourceInfo.kind === 'video') {
            //console.log(sourceInfo.id, sourceInfo.facing, sourceInfo.label || 'camera');
            videosources.push(sourceInfo);

        } else {
            //console.log('Some other kind of source: ', sourceInfo);
        }
    }
console.log("sources",videosources)
    next();
});
})();

/*
(function() {
    var App;
    App = {};

    //Init 
    App.init = function() {
    	//to set webcam



        //to set tool and tool mode
        App.toolMode = { Brush: 0, Eraser: 1 };
        App.tool = App.toolMode.Brush;

        //to get the canvas and set its attribute
        App.canvas = document.getElementById('art');
        App.canvas.setAttribute('width', window.innerWidth);
        App.canvas.setAttribute('height', window.innerHeight);

        //to get the renderer
        App.ctx = App.canvas.getContext("2d");
        App.ctx.fillStyle = "solid";
        App.ctx.lineCap = "round";

        App.canvasJObj = $('canvas');
        App.colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'];
        App.size = [1, 3, 5, 10, 15, 20];
        App.sizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];

        //to set socket
        App.socket = io.connect('/');
        App.socket.on('draw', function(data) {
            return App.draw(data.x, data.y, data.type);
        });
        App.socket.on('setColor', function(data) {
            return App.setColor(data.i);
        });
        App.socket.on('setSize', function(data) {
            return App.setSize(data.i);
        });
        App.socket.on('setTool', function(data) {
            return App.setTool(data.tool);
        });
        App.socket.on('clear', function(data) {
            return App.clear(data.x, data.y, data.width, data.height);
        });

        App.draw = function(x, y, type) {
            if (type === "mousedown") {
                App.ctx.beginPath();
                App.ctx.moveTo(x, y);
                App.canvasJObj.on('mousemove', mouseOnCanvas);
            } else if (type === "mousemove") {
                mouseMove(x, y);
            } else {
                //mouseup
                App.ctx.closePath();
                App.canvasJObj.off('mousemove', mouseOnCanvas);
            }
        };

        App.setTool = function(tool) {
            App.tool = tool;
        };

        App.setColor = function(i) {
            App.ctx.strokeStyle = App.colors[i];
        };

        App.setSize = function(i) {
            App.ctx.lineWidth = App.size[i];
        };

        App.clear = function(x, y, width, height) {
            App.ctx.clearRect(x, y, width, height);
        };

        //to set event
        App.canvasJObj.on('mousedown mouseup', mouseOnCanvas);

        for (var i = 0; i < App.colors.length; i++) {
            colorAction(i);
        }

        for (var i = 0; i < App.size.length; i++) {
            sizeAction(i);
        }

        $('#eraser').on('click', function() {
            SetTool(App.toolMode.Eraser);
        });

        $('#reset').on('click', function() {
            Clear(0, 0, App.canvas.width, App.canvas.height);
        });
    };

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function mouseMove(x, y) {
        switch (App.tool) {
            case App.toolMode.Brush:
                App.ctx.lineTo(x, y);
                App.ctx.stroke();
                break;
            case App.toolMode.Eraser:
                var halfWidth = App.ctx.lineWidth * 0.5;
                App.ctx.clearRect(x - halfWidth, y - halfWidth, App.ctx.lineWidth, App.ctx.lineWidth);
                break;
        }
    };

    function mouseOnCanvas(e) {
        var type = e.handleObj.type,
            mousePos = getMousePos(App.canvas, e);

        App.draw(mousePos.x, mousePos.y, type);
        App.socket.emit('drawClick', {
            x: mousePos.x,
            y: mousePos.y,
            type: type
        });
    }

    function colorAction(i) {
        $('#' + App.colors[i]).on('click', function() {
            SetColor(i);
            SetTool(App.toolMode.Brush);
        });
    }

    function sizeAction(i) {
        $('#' + App.sizeNames[i]).on('click', function() {
            SetSize(i);
        });
    }

    function SetColor(i) {
        App.setColor(i);
        App.socket.emit('setColor', {
            i: i
        });
    }

    function SetSize(i) {
        App.setSize(i);
        App.socket.emit('setSize', {
            i: i
        });
    }

    function SetTool(tool) {
        App.setTool(tool);
        App.socket.emit('setTool', {
            tool: tool
        });
    }

    function Clear(x, y, width, height) {
        App.clear(x, y, width, height);
        App.socket.emit('clear', {
            x: x,
            y: y,
            width: width,
            height: height
        });
    }

    //what
    $(function() {
        return App.init();
    });
}).call(this);*/