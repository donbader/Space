(function() {
    const toolMode = { Brush: 0, Eraser: 1 },
        fontColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'],
        fontSizes = [1, 3, 5, 10, 15, 20],
        fontSizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];

    var Paint = this.Paint = THREE.Object3D.extend({
        init: function(width, height, position, server) {
            'use strict';
            this._super();

            this.width = width;
            this.height = height;
            this.paintPosition = position;
            this.server = server;
            this.pivot = new THREE.Vector3(this.paintPosition.x - this.width * 0.5, this.paintPosition.y + this.height * 0.5, this.paintPosition.z);

            //to create reset button
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('id', 'reset');
            button.setAttribute('value', 'Reset');
            this.reset = button;

            //to create color button
            this.colorButtons = [];
            var length = fontColors.length;
            for (var i = 0; i < length; ++i) {
                var div = document.createElement('div');
                div.setAttribute('id', fontColors[i]);
                div.setAttribute('class', 'color');
                this.colorButtons[i] = div;
            }

            //to create size button
            this.sizeButtons = [];
            length = fontSizes.length;
            for (var i = 0; i < length; ++i) {
                var div = document.createElement('div');
                div.setAttribute('id', fontSizeNames[i]);
                div.setAttribute('class', 'color');
                $(div).text(fontSizes[i]);
                this.sizeButtons[i] = div;
            }

            //to create eraser button
            var div = document.createElement('div');
            div.setAttribute('id', 'eraser');
            div.setAttribute('class', 'color');
            $(div).html('<img src = "images/Eraser.jpg">');
            this.eraser = div;

            this.userData.prop = {
                paint: true
            };

            //to create the paint
            this.paint = document.createElement('canvas');
            this.paint.setAttribute('width', this.width);
            this.paint.setAttribute('height', this.height);

            this.paintJObj = $(this.paint);

            this.context = this.paint.getContext('2d');
            this.context.lineCap = 'round';
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(0, 0, this.width, this.height);

            //to create the paint texture
            this.texture = new THREE.Texture(this.paint);
            this.texture.minFilter = THREE.LinearFilter;
            this.texture.magFilter = THREE.LinearFilter;

            //to create the paint mesh
            var paintMaterial = new THREE.MeshBasicMaterial({
                map: this.texture,
                overdraw: true,
                side: THREE.DoubleSide
            });

            var paintGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
            this.mesh = new THREE.Mesh(paintGeometry, paintMaterial);
            this.mesh.name = 'paintMesh';

            //to add to scene
            this.mesh.position.set(this.paintPosition.x, this.paintPosition.y, this.paintPosition.z);
            // this.mesh.context = this.context;
            this.add(this.mesh);

            //to init
            //to set button click evnet
            length = fontColors.length;
            for (var i = 0; i < length; ++i) {
                this.fontColorClick(i);
                // this.setContext('strokeStyle', fontColors[i]);
            }

            length = fontSizes.length;
            for (var i = 0; i < length; ++i) {
                this.fontSizeClick(i);
                // this.setContext('lineWidth', fontSizes[i]);
            }

            $('#eraser').on('click', () => {
                this.setTool(toolMode.Eraser);
            });

            $('#reset').on('click', () => {
                this.clear(0, 0, this.width, this.height);
            });

            this.setTool(toolMode.Brush);
            this.setContext('lineWidth', fontSizes[3]);
            this.setContext('strokeStyle', fontColors[7]);

            this.addHandlers();
        },
        drawStart: function(x, y) {
            this.context.beginPath();
            this.context.moveTo(x, y);
        },
        drawing: function(x, y) {
            this.context.lineTo(x, y);
            this.context.stroke();
        },
        erasing: function(x, y) {
            var halfWidth = this.context.lineWidth * 0.5;
            this.clear(x - halfWidth, y - halfWidth, this.context.lineWidth, this.context.lineWidth);
        },
        drawEnd: function() {
            this.context.closePath();
        },
        draw: function(x, y, type) {
            console.log('draw type = ', type);

            if (type === 'mousedown') {
                // this.context.beginPath();
                // this.context.moveTo(x, y);
                this.drawStart(x, y);
                this.isDraw = true;

                this.server.emit('draw start', { x: x, y: y });
            } else if (type === 'mousemove' && this.isDraw) {
                this.mouseMove(x, y);
            } else if (type === 'mouseup') {
                this.drawEnd();
                this.isDraw = false;

                this.server.emit('draw end');
            }
        },
        setContext: function(attr, value) {
            this.context[attr] = value;

            //socket
        },
        setTool: function(tool) {
            this.tool = tool;

            //socket
        },
        clear: function(x, y, width, height) {
            this.context.clearRect(x, y, width, height);

            //socket
        },
        getMousePos: function(canvas, event) {
            console.log('get mouser position');

            var rect = canvas.getBoundingClientRect();
            console.log('event.clientX = ' + event.clientX + ' event.clientY = ' + event.clientY);
            console.log('rect left = ' + rect.left + ' rect.top = ' + rect.top);
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        },
        mouseMove: function(x, y) {
            switch (this.tool) {
                case toolMode.Brush:
                    this.drawing(x, y);
                    this.server.emit('drawing paint', { x: x, y: y });
                    break;
                case toolMode.Eraser:
                    this.erasing(x, y);
                    this.server.emit('erasing paint', { x: x, y: y });
                    break;
            }
        },
        mouseOnCanvas: function(position, type) {
            var pos = new THREE.Vector2(position.x - this.pivot.x, this.pivot.y - position.y);
            this.draw(pos.x, pos.y, type);
        },
        addHandlers: function() {
            this.server.on('drawn start', (info) => {
                this.drawStart(info.x, info.y);
            });

            this.server.on('drawn paint', (info) => {
                this.drawing(info.x, info.y);
            });

            this.server.on('erased paint', (info) => {
                this.erasing(info.x, info.y);
            });

            this.server.on('drawn end', (info) => {
                this.drawEnd();
            });

            this.server.on('set paint url', (url) => {
                var image = new Image();
                image.src = url;
                this.context.drawImage(image, 0, 0, this.width, this.height);

                if (this.texture) {
                    // console.log('update paint texture');
                    this.texture.needsUpdate = true;
                }
            });
        },
        fontColorClick: function(i) {
            $(this.colorButtons[i]).on('click', () => {
                this.setContext('strokeStyle', fontColors[i]);
                this.setTool(toolMode.Brush);
            });

            // $('#' + fontColors[i]).on('click', () => {
            //     this.setContext('strokeStyle', fontColors[i]);
            //     this.setTool(toolMode.Brush);
            // });
        },
        fontSizeClick: function(i) {
            $(this.sizeButtons[i]).on('click', () => {
                this.setContext('lineWidth', fontSizes[i]);
            });

            // $('#' + fontSizeNames[i]).on('click', () => {
            //     this.setContext('lineWidth', fontSizes[i]);
            // });
        },
        update: function() {
            var image = new Image();
            image.src = this.paint.toDataURL('image/png');
            this.context.drawImage(image, 0, 0, this.width, this.height);

            if (this.texture) {
                // console.log('update paint texture');
                this.texture.needsUpdate = true;
            }
        },
        save: function(name, socket) {
            if (!name || !socket) return;

            // var image = new Image();
            var url = this.paint.toDataURL('image/png');

            console.log('url in local = ', url);
            // console.log('url string in local = ', JSON.stringify(url));

            // socket.emit('paint upload', JSON.stringify(url));
            socket.emit('paint upload', url);
            console.log('paint has saved');
        }
    });

})();
