(function() {
    const toolMode = ['Brush', 'Eraser'];

    var Paint = this.Paint = THREE.Object3D.extend({
        init: function(width, height, position, server) {
            'use strict';
            this._super();

            this.width = width;
            this.height = height;
            this.paintPosition = position;
            this.server = server;
            this.pivot = new THREE.Vector3(this.paintPosition.x - this.width * 0.5, this.paintPosition.y + this.height * 0.5, this.paintPosition.z);

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
            this.add(this.mesh);

            this.setTool('Brush');
            //for GUI
            this.color = '#000000';
            this.context.lineWidth = 10;
            this.context.strokeStyle = this.color;

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
            // console.log('draw type = ', type);

            if (type === 'mousedown') {
                this.setContext('strokeStyle', this.color);
                this.drawStart(x, y);
                this.isDraw = true;

                this.server.emit('draw start',  { x: x, y: y, lineWidth: this.context.lineWidth, color: this.context.strokeStyle, tool: this.tool});
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
        },
        setTool: function(tool) {
            this.tool = tool;
        },
        clear: function(x, y, width, height) {
            this.context.clearRect(x, y, width, height);

            //socket
        },
        mouseMove: function(x, y) {
            switch (this.tool) {
                case 'Brush':
                    this.drawing(x, y);
                    this.server.emit('drawing paint', { x: x, y: y});
                    break;
                case 'Eraser':
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
                this.preLineWidth = this.context.lineWidth;
                this.setContext('lineWidth', info.lineWidth);

                this.preColor = this.context.strokeStyle;
                this.setContext('strokeStyle', info.color);

                this.preTool = this.tool;
                this.tool = info.tool;

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

                this.setContext('lineWidth', this.preLineWidth);
                this.setContext('strokeStyle', this.preColor);
                this.tool = this.preTool;
            });

            this.server.on('set paint url', (url) => {
                var image = new Image();
                image.src = url;
                this.context.drawImage(image, 0, 0, this.width, this.height);

                if (this.texture) {
                    this.texture.needsUpdate = true;
                }
            });
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

            var url = this.paint.toDataURL('image/png');
            socket.emit('paint upload', url);
            console.log('paint has saved');
        }
    });

})();
