(function() {
    var App;
    App = {};

    //Init 
    App.init = function() {
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

        //to get socket
        App.socket = io.connect('/');
        App.socket.on('draw', function(data) {
            return App.draw(data.x, data.y, data.type);
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
        }

        App.setColor = function(i) {
            App.ctx.strokeStyle = App.colors[i];
        }

        App.setSize = function(i) {
            App.ctx.lineWidth = App.size[i];
        }

        App.reset = function() {
            App.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
        }

        //to set event
        App.canvasJObj.on('mousedown mouseup', mouseOnCanvas);

        for (var i = 0; i < App.colors.length; i++) {
            $('#' + App.colors[i]).on('click', function() {
                SetColor(i);
                SetTool(App.toolMode.Brush);
            });
        }

        for (var i = 0; i < App.size.length; i++) {
            $('#' + App.sizeNames[i]).on('click', function() {
                SetSize(i);
            });
        }

        $('#eraser').on('click', function() {
            SetTool(App.toolMode.Eraser);
        });

        $('#reset').on('click', function() {
            Reset();
            App.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
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
                var halfWidth = ctx.lineWidth * 0.5;
                App.ctx.clearRect(x - halfWidth, y - halfWidth, ctx.lineWidth, ctx.lineWidth);
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

    function Reset() {
        App.reset();
        App.socket.emit('reset');
    }

    //what
    $(function() {
        return App.init();
    });
}).call(this);

//call ????
