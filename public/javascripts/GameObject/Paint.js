(function(){
	const toolMode = { Brush: 0, Eraser: 1},
			fontColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'],
			fontSizes = [1, 3, 5, 10, 15, 20],
			fontSizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];

	var Paint = THREE.Object3D.extend({
	init: function(width, height, position){
		'use strict';

		this.width = width;
		this.height = height;
		this.Position = position;

		//to create the dummy paint
		this.dummyPaint = document.createElement('canvas');
		this.dummyPaint.setAttribute('width', this.width);
		this.dummyPaint.setAttribute('height', this.height);
		this.dummyPaint.style['opacity'] = 0;

		this.dummyPaintJObj = $(dummyPaint);
		this.dummyPaintCSSObj = new THREE.CSS3DObject(dummyPaint);
		//to add to css scnen

		this.dummyPaintCSSObj.position.set(this.Position.x, this.Position.y, this.Position.z);

		//to create the true paint
		this.paint = document.createElement('canvas');
		this.paint.setAttribute('width', this.width);
		this.paint.setAttribute('height', this.height);

		this.paintJObj = $(this.paint);

		this.paintContext = this.paint.getContext('2d');
		this.paintContext.lineCap = 'round';
		this.paintContext.fillStyle = '#ffffff';
		this.paintContext.fillRect(0, 0, this.width, this.height);

		//to create the paint texture
		this.paintTexture = new THREE.Texture(this.paint);
		this.paintTexture.minFilter = THREE.LinearFilter;
		this.paintTexture.magFilter = THREE.LinearFilter;

		//to create the paint mesh
		var paintMaterial = new THREE.MeshBasicMaterial({
			map: this.paintTexture,
			overdraw: true,
			side: THREE.DoubleSide
		});

		var paintGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
		var paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
		//to add to scene

		paintMesh.position.set(this.Position.x, this.Position.y, this.Position.z);
	},
	update: function(){
		
	}

});

})();

            this.CssScene.add(dummyPaintCSSObj);
            this.scene.add(paintMesh);

            function draw (x, y, type) {
                if(type === 'mousedown') {
                    console.log('mousedown');
                    paintContext.beginPath();
                    paintContext.moveTo(x, y);
                    dummyPaintJObj.on('mousemove', mouseOnCanvas);
                } else if (type === 'mousemove') {
                    console.log('mousemove');
                    mouseMove(x, y);
                } else if (type === 'mouseup') {
                    console.log('mouseup');
                    paintContext.closePath();
                    dummyPaintJObj.off('mousemove', mouseOnCanvas);
                }
                else {
                    console.log('draw error');
                }
            };
            set("strokeStyle", paintFontColors[i])
            function set(attr, value){
            	paintContext[attr] = value;
            }

            function setPaintTool (tool) {
                paintTool = tool;
            };

            function setPaintFontColor (i) {
                paintContext.strokeStyle = paintFontColors[i];
            };

            function setPaintFontSize (i) {
                paintContext.lineWidth = paintFontSizess[i];
            };

            function clearPaint (x, y, width, height) {
                paintContext.clearRect(x, y, width, height);
            };

            function paintFontColorClick (i) {
                $('#' + paintFontColors[i]).on('click', function() {
                    SetColor(i);
                    SetTool(paintToolMode.Brush);
                })
            }

            function paintFontSizeClick (i) {
                $('#' + paintFontSizeNames[i]).on('click', function() {
                    SetSize(i);
                });
            }

            function SetPaintFontColor (i) {
                setColor(i);
                //socket
            }

            function SetPaintTool (i) {
                setTool(tool);
                //socket
            }

            function ClearPaint (x, y, width, height) {
                clearPaint(x, y, width, height);
                //socket
            }

            //to set paint event

            //to use dummyPaint event
            dummyPaintJObj.on('mousedown mouseup', mouseOnCanvas);

            for(var i = 0; i < paintFontColors.length; ++i) {
                paintFontColorClick(i);
            }

            for(var i = 0; i < paintFontSizes.length; ++i) {
                paintFontSizeClick(i);
            }

            $('#eraser').on('click', function() {
                SetTool(paintToolMode.Eraser);
            });

            $('#reset').on('click', function() {
                ClearPaint(0, 0, paint.width, paint.height);
            });

            function getMousePos(canvas, evt) {
                console.log('get mouse position');
                var rect = canvas.getBoundingClientRect();

                    // console.log()
                return {
                    x: evt.clientX - rect.left,
                    y: evt.clientY - rect.top
                };
            };

            function mouseMove(x, y) {
                switch(paintTool) {
                    case paintToolMode.Brush:
                        paintContext.lineTo(x, y);
                        paintContext.stroke();
                        break;
                    case paintToolMode.Eraser:
                        var halfWidth = paintContext.lineWidth * 0.5;
                        paintContext.clearRect(x - halfWidth, y - halfWidth, paintContext.lineWidth, paintContext.lineWidth);
                        break;
                }
            };

            function mouseOnCanvas(e) {
                console.log('event');
                var type = e.handleObj.type,
                    mousePos = getMousePos(dummyPaint, e);
                    // mousePos = getMousePos(paint, e);

                console.log(mousePos);
                draw(mousePos.x, mousePos.y, type);
                //socket
            }