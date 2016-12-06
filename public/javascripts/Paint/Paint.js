var canvas = document.getElementById('art');
var ctx = canvas.getContext('2d');

var toolMode = {Brush: 0, Eraser: 1};
var tool = toolMode.Brush;

canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

/*
var canvasJObj = $(canvas);
console.log(canvasJObj);

canvasJObj.setAttribute('width', window.innerWidth);
canvasJObj.setAttribute('height', window.innerHeight);
*/

console.log(window.innerWidth);
console.log(window.innerHeight);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function mouseMove(evt) {
    var mousePos = getMousePos(canvas, evt);
    //console.log(mousePos);

    switch(tool) {
        case toolMode.Brush:
              ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    break;
        case toolMode.Eraser:
          //ctx.clearRect(mousePos.x - ctx.lineWidth, mousePos.y - ctx.lineWidth, mousePos.x + ctx.lineWidth, mousePos.y + ctx.lineWidth);
          
          var eraserWidth = ctx.lineWidth * 0.5;

          ctx.clearRect(mousePos.x - eraserWidth, mousePos.y - eraserWidth, ctx.lineWidth, ctx.lineWidth);
          break;
    }
}

canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y);
    evt.preventDefault();
    canvas.addEventListener('mousemove', mouseMove, false);
});

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', mouseMove, false);
}, false);

document.getElementById('eraser').addEventListener('click', function() {
    tool = toolMode.Eraser;
}, false);

document.getElementById('reset').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}, false);

var colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'];
var size = [1, 3, 5, 10, 15, 20];
var sizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];

function listener(i) {
    document.getElementById(colors[i]).addEventListener('click', function() {
        ctx.strokeStyle = colors[i];
        tool = toolMode.Brush;
    }, false);
}

function fontSizes(i) {
    document.getElementById(sizeNames[i]).addEventListener('click', function() {
        //console.log(ctx);
        ctx.lineWidth = size[i];
    }, false);
}

for (var i = 0; i < colors.length; i++) {
    listener(i);
}

for (var i = 0; i < size.length; i++) {
    fontSizes(i);
}
