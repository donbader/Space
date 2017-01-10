(function() {
    const toolMode = { Brush: 0, Eraser: 1 },
        fontColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'],
        fontSizes = [1, 3, 5, 10, 15, 20],
        fontSizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];

    var Paint = this.Paint = THREE.Object3D.extend({
        init: function(width, height, position, users) {
            'use strict';

            this.width = width;
            this.height = height;
            this.paintPosition = position;
            this.users = users;

            //to create reset button
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('id', 'reset');
            button.setAttribute('value', 'Reset');
            this.reset = button;

            //to create color button
            this.colorButtons = [];
            var length = fontColors.length;
            for(var i = 0; i < length; ++i) {
                var div = document.createElement('div');
                div.setAttribute('id', fontColors[i]);
                div.setAttribute('class', 'color');
                this.colorButtons[i] = div;
            }

            //to create size button
            this.sizeButtons = [];
            length = fontSizes.length;
            for(var i = 0; i < length; ++i) {
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

            //to create the dummy paint
            this.dummyPaint = document.createElement('canvas');
            // this.dummyPaint.src = '/Paint';
            this.dummyPaint.setAttribute('width', this.width);
            this.dummyPaint.setAttribute('height', this.height);
            // this.dummyPaint.scrolling = 'no';
                        var context = this.dummyPaint.getContext('2d');
            context.fillStyle = '#000000';
            context.fillRect(0, 0, this.width, this.height);
            this.dummyPaint.style['opacity'] = 0.3;

            this.dummyPaintCSSObj = new THREE.CSS3DObject(this.dummyPaint);
            this.dummyPaintCSSObj.position.set(this.paintPosition.x, this.paintPosition.y, this.paintPosition.z);

            // //to create the dummy paint
            // this.dummyPaint = document.createElement('canvas');
            // this.dummyPaint.setAttribute('width', this.width);
            // this.dummyPaint.setAttribute('height', this.height);
            // this.dummyPaint.style['opacity'] = 0.3;

            // var context = this.dummyPaint.getContext('2d');
            // context.fillStyle = '#000000';
            // context.fillRect(0, 0, this.width, this.height);

            // this.dummyPaintJObj = $(this.dummyPaint);
            // this.dummyPaintCSSObj = new THREE.CSS3DObject(this.dummyPaint);

            // this.dummyPaintCSSObj.position.set(this.paintPosition.x, this.paintPosition.y, this.paintPosition.z);

            // //to create the true paint
            // this.paint = document.createElement('canvas');
            // this.paint.setAttribute('width', this.width);
            // this.paint.setAttribute('height', this.height);

            // this.paintJObj = $(this.paint);

            // this.context = this.paint.getContext('2d');
            // this.context.lineCap = 'round';
            // this.context.fillStyle = '#ffffff';
            // this.context.fillRect(0, 0, this.width, this.height);

            // //to create the paint texture
            // this.texture = new THREE.Texture(this.paint);
            // this.texture.minFilter = THREE.LinearFilter;
            // this.texture.magFilter = THREE.LinearFilter;

            // //to create the paint mesh
            // var paintMaterial = new THREE.MeshBasicMaterial({
            //     map: this.texture,
            //     overdraw: true,
            //     side: THREE.DoubleSide
            // });

            // var paintGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
            // this.mesh = new THREE.Mesh(paintGeometry, paintMaterial);
            // //to add to scene

            // this.mesh.position.set(this.paintPosition.x, this.paintPosition.y, this.paintPosition.z);
        
            // //to init

            // //to set dummy paint event
            // this.dummyPaintJObj.on('mousedown mouseup', (event) => this.mouseOnCanvas(event));

            // //to set button click evnet
            // length = fontColors.length;
            // for(var i = 0; i < length; ++i) {
            //     this.fontColorClick(i);
            //     // this.setContext('strokeStyle', fontColors[i]);
            // }

            // length = fontSizes.length;
            // for(var i = 0; i < length; ++i) {
            //     this.fontSizeClick(i);
            //     // this.setContext('lineWidth', fontSizes[i]);
            // }

            // $('#eraser').on('click', () => {
            //     this.setTool(toolMode.Eraser);
            // });

            // $('#reset').on('click', () => {
            //     this.clear(0, 0, this.width, this.height);
            // });


            // this.setTool(toolMode.Brush);
            // this.setContext('lineWidth', fontSizes[3]);
            // this.setContext('strokeStyle', fontColors[7]);
        },
        draw: function(x, y, type) {
            console.log('draw type = ', type);

            if (type === 'mousedown') {
                this.context.beginPath();
                this.context.moveTo(x, y);
                this.dummyPaintJObj.on('mousemove', (event) => this.mouseOnCanvas(event));
            } else if (type === 'mousemove') {
                this.mouseMove(x, y);
            } else if (type === 'mouseup') {
                this.context.closePath();
                this.dummyPaintJObj.off('mousemove', (event) => this.mouseOnCanvas(event));
            } else {
                console.error('draw type error');
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
            switch(this.tool) {
                case toolMode.Brush:
                    this.context.lineTo(x, y);
                    this.context.stroke();
                    break;
                case toolMode.Eraser:
                    var halfWidth = this.context.lineWidth * 0.5;
                    this.clear(x - halfWidth, y - halfWidth, this.context.lineWidth, this.context.lineWidth);
                    break;
            }
        },
        mouseOnCanvas: function(event) {
            var pos = this.getMousePos(this.dummyPaint, event);

            if(event.handleObj.type !== 'mousemove')
                console.log('mouse position = ', pos);
            
            this.draw(pos.x, pos.y, event.handleObj.type);
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
        }

    });

})();

// this.CssScene.add(dummyPaintCSSObj);
// this.scene.add(mesh);

// function draw (x, y, type) {
//     if(type === 'mousedown') {
//         console.log('mousedown');
//         paintContext.beginPath();
//         paintContext.moveTo(x, y);
//         dummyPaintJObj.on('mousemove', mouseOnCanvas);
//     } else if (type === 'mousemove') {
//         console.log('mousemove');
//         mouseMove(x, y);
//     } else if (type === 'mouseup') {
//         console.log('mouseup');
//         paintContext.closePath();
//         dummyPaintJObj.off('mousemove', mouseOnCanvas);
//     }
//     else {
//         console.log('draw error');
//     }
// };
// set("strokeStyle", paintFontColors[i])
// function set(attr, value){
//  paintContext[attr] = value;
// }

// function setPaintTool (tool) {
//     paintTool = tool;
// };

// function setPaintFontColor (i) {
//     paintContext.strokeStyle = paintFontColors[i];
// };

// function setPaintFontSize (i) {
//     paintContext.lineWidth = paintFontSizess[i];
// };

// function clearPaint (x, y, width, height) {
//     paintContext.clearRect(x, y, width, height);
// };

// function paintFontColorClick (i) {
//     $('#' + paintFontColors[i]).on('click', function() {
//         SetColor(i);
//         SetTool(paintToolMode.Brush);
//     })
// }

// function paintFontSizeClick (i) {
//     $('#' + paintFontSizeNames[i]).on('click', function() {
//         SetSize(i);
//     });
// }

// function SetPaintFontColor (i) {
//     setColor(i);
//     //socket
// }

// function SetPaintTool (i) {
//     setTool(tool);
//     //socket
// }

// function ClearPaint (x, y, width, height) {
//     clearPaint(x, y, width, height);
//     //socket
// }

// //to set paint event

// //to use dummyPaint event
// dummyPaintJObj.on('mousedown mouseup', mouseOnCanvas);

// for(var i = 0; i < paintFontColors.length; ++i) {
//     paintFontColorClick(i);
// }

// for(var i = 0; i < paintFontSizes.length; ++i) {
//     paintFontSizeClick(i);
// }

// $('#eraser').on('click', function() {
//     SetTool(paintToolMode.Eraser);
// });

// $('#reset').on('click', function() {
//     ClearPaint(0, 0, paint.width, paint.height);
// });

// function getMousePos(canvas, evt) {
//     console.log('get mouse position');
//     var rect = canvas.getBoundingClientRect();

//         // console.log()
//     return {
//         x: evt.clientX - rect.left,
//         y: evt.clientY - rect.top
//     };
// };

// function mouseMove(x, y) {
//     switch(paintTool) {
//         case paintToolMode.Brush:
//             paintContext.lineTo(x, y);
//             paintContext.stroke();
//             break;
//         case paintToolMode.Eraser:
//             var halfWidth = paintContext.lineWidth * 0.5;
//             paintContext.clearRect(x - halfWidth, y - halfWidth, paintContext.lineWidth, paintContext.lineWidth);
//             break;
//     }
// };

// function mouseOnCanvas(e) {
//     console.log('event');
//     var type = e.handleObj.type,
//         mousePos = getMousePos(dummyPaint, e);
//         // mousePos = getMousePos(paint, e);

//     console.log(mousePos);
//     draw(mousePos.x, mousePos.y, type);
//     //socket
// }

//             var image = new Image();
// image.src = this.paint.toDataURL('image/png');
// this.context.drawImage(image, 0, 0, paintWidth, paintHeight);

// if(this.texture) {
//     this.texture.needsUpdate = true;
//     // console.log('YO');
// }
