(function(global, factory){
    if (global.SPACE_OBJECT === undefined) {
		global.SPACE_OBJECT = factory();
	}
})(window, function(){
    // 'use strict';

    var OBJ = {
        /**************************************
                    Tools
        **************************************/
        load: function(scene, data, callback){
            var loader = new THREE.ObjectLoader();
            loader.parse(data, function(obj){
                scene.add(obj);
                callback && callback(obj);
            });
        },
        getTheOuttest: function(obj){
            if(!obj.parent)return console.error("Object type is not currect");
            if(obj.name === "ground") return obj;
            while(obj.parent.type != "Scene"){
                obj = obj.parent;
            }
            return obj;
        },
        allChildrenMoveToAnchor: function(object3d, anchor){
            if(!anchor)anchor = new THREE.Vector3();
            if(!object3d.userData.anchored){
                var bbox = new THREE.Box3().setFromObject(object3d);
                var offset = new THREE.Vector3().addVectors(bbox.max, bbox.min).divideScalar(-2);
                offset.y = 0;
                object3d.children.forEach((child)=>{
                    child.position.add(offset);
                    console.log(child.position)
                });
                object3d.updateMatrix();
                object3d.updateMatrixWorld(true);
                object3d.userData.anchored = true;
            }

            object3d.position.set(anchor.x, anchor.y, anchor.z);
        },
        collisionOccur(obj1, objs, distance){
            distance = distance || 0;
            var box1 = new THREE.Box3().setFromObject(obj1).expandByScalar(distance/2);
            // box1.min.y = obj1.position.y;
            // console.log("Y",box1.min.y,obj1.position.y);
            for(var i in objs){
                if(objs[i].children.length){ // recursive
                    var on = this.collisionOccur(obj1, objs[i].children, distance);
                    if(on)return on;
                }
                else{
                    var box2 = new THREE.Box3().setFromObject(objs[i]).expandByScalar(distance/2);
                    if(box1.intersectsBox(box2)){
                        delete box1;
                        delete box2;
                        return objs[i];
                    }
                    delete box2;
                }
            }
            delete box1;
            return ;
        },
        /**************************************
                    Game Objects
        **************************************/
        PositionFlag: THREE.Object3D.extend({
            init:function(){
                this._super();
                this.height = 1;
                /*============================
                            MODEL
                ============================*/
                this.model = new THREE.Mesh(
                    new THREE.BoxGeometry( 90, this.height, 90),
                    new THREE.MeshPhongMaterial( { color: 0xffffff } ));

                this.visible = false;
                this.model.material.transparent = true;
                this.model.material.opacity = 0.3;
                this.model.position.set(0,this.height/2,0);
                this.add(this.model);
            }
        }),
        WebCam: THREE.Object3D.extend({
            init: function(width, height, position){
                this._super();
                width = width || 100;
                height = height || 100;
                position = position || new THREE.Vector3(0, 250, 0);

                //to create the html element
                this.video = document.createElement('video');
                this.image = document.createElement('canvas');
                //<canvas id = 'videowebcamImage' width = '160' height = '120' style = 'visibility: hidden; float: left; position: fixed;'></canvas>
                this.imageContext = this.image.getContext('2d');

                //to fill up the background color
                this.imageContext.fillStyle = '#000000';
                this.imageContext.fillRect(0, 0, width, height);

                //to create the video texture
                this.texture = new THREE.Texture(this.image);
                this.texture.minFilter = THREE.LinearFilter;
                this.texture.magFilter = THREE.LinearFilter;

                var webcamMaterial = new THREE.MeshBasicMaterial({
                    map: this.texture,
                    overdraw: true,
                    side: THREE.DoubleSide
                });

                var webcamGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
                var webcamMesh = new THREE.Mesh(webcamGeometry, webcamMaterial);

                webcamMesh.position.copy(position);
                webcamMesh.name = "webcam";

                this.add(webcamMesh);
            }
        }),
        VoxelPainter: THREE.Object3D.extend({
            init: function(width, color, opacity){
                width = width || 50;
                color = color || 0x00ff00;
                opacity = opacity || 0.5;
                this._super();

                // Model
                var rollOverGeo = new THREE.BoxGeometry( 1, 1, 1 );
				var rollOverMaterial = new THREE.MeshBasicMaterial( { color: color, opacity: 0.5, transparent: true } );
                this.helper = new THREE.Mesh( rollOverGeo, rollOverMaterial );

                // To store voxels
                this.Objects = new THREE.Object3D();
                this.Objects.userData.dynamic = false;
                this.Objects.userData.prop = {
                    "select": true,
                    "stepOn": true,
                    "move": true,
                    "collide": true
                }
                this.add(this.helper);
                this.setScale(width);


                // Grid
                // var size = 5, step = width;
                //
                // var geometry = new THREE.Geometry();
                //
                // for(var i = - step*size - step/2; i <= step*size - step/2; i+=step){
                //
                //     geometry.vertices.push( new THREE.Vector3( -  step*size - step/2, 0, i ) );
                //     geometry.vertices.push( new THREE.Vector3(    step*size - step/2, 0, i ) );
                //
                //     geometry.vertices.push( new THREE.Vector3( i, 0, -  step*size - step/2 ) );
                //     geometry.vertices.push( new THREE.Vector3( i, 0,    step*size - step/2 ) );
                //
                // }
                //
                // var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );
                //
                // var line = new THREE.LineSegments( geometry, material );
                // line.position.set(0, -width/2 + 2,0);
                // this.helper.add( line );



                // Manager
                this.voxelWidth = width;
                this._mode = "CREATE";
                this.cubeGeo = this.helper.geometry;
                this.cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c});
                //
                this.visible = false;
            },
            setScale: function(width){
                this.helper.scale.set(width,width,width);
                return this;
            },
            setColor: function(hex){
                this.cubeMaterial.color.setHex(hex);
            },
            setScene: function(scene){
                this.scene && this.scene.remove(this.Objects);
                this.scene = scene;
                this.scene.add(this.Objects);
            },
            fitToFormat: function(vector){
                vector.divideScalar( this.voxelWidth ).floor().multiplyScalar( this.voxelWidth ).addScalar(this.voxelWidth/2);
            },
            create: function(material, socket){
                material = material || this.cubeMaterial;
                var voxel = new THREE.Mesh( this.cubeGeo, material );
                voxel.scale.set(this.voxelWidth, this.voxelWidth, this.voxelWidth );
                voxel.position.copy( this.intersect.point ).add( this.intersect.face.normal );
                this.fitToFormat(voxel.position);
                voxel.name = "voxel";
                this.Objects.add(voxel);
                console.log(voxel.position);
                if(socket)
                    socket.emit('voxel create', {color:material.color.getHex(), position:voxel.position})
                return voxel;
            },
            createVoxel: function(scene, position, color){
                this.cubeMaterial.color.setHex(color);
                var voxel = new THREE.Mesh( this.cubeGeo, this.cubeMaterial );
                voxel.scale.set(this.voxelWidth, this.voxelWidth, this.voxelWidth );
                voxel.position.set(position.x, position.y, position.z);
                this.fitToFormat(voxel.position);
                voxel.name = "voxel";
                console.log(voxel.position);
                scene.add(voxel);
            },
            destroy: function(voxel,socket){
                this.Objects.remove(voxel);

                if(socket)
                    socket.emit('voxel destroy', voxel.position)
            },
            destroyVoxel: function(scene, position){
                for(var i in scene.children){
                    if(scene.children[i].name === "voxel"){
                        if(scene.children[i].position.x === position.x
                            && scene.children[i].position.y === position.y
                            && scene.children[i].position.z === position.z){
                                scene.children.splice(i,1);
                                return ;
                            }
                    }
                }
            },
            updateHelper: function(intersect){

                if(this._mode === "CREATE"){
                    this.visible = true;
                    this.helper.visible = true;
                    this.helper.position.copy( intersect.point ).add( intersect.face.normal );
                }
                else if(this._mode === "DESTROY"){
                    if(intersect.object.name === "voxel"){
                        this.helper.visible = true;
                        this.helper.position.copy( intersect.object.position );
                    }
                    else{
                        this.helper.visible = false;
                    }
                }
                this.fitToFormat(this.helper.position);
                this.intersect = intersect;
            },
            clear: function(){
                var scope = this;
                if(this.Objects.children.length)
                    this.Objects.children = [];
            },
            save: function(name, socket){
                if(!name || !socket ||!this.Objects.children.length)return;
                this.Objects.name = name;
                // Reset voxel's position
                OBJ.allChildrenMoveToAnchor(this.Objects);
                this.Objects.children.forEach((child)=>{
                    this.fitToFormat(child.position);
                });
                this.Objects.updateMatrix();
                this.Objects.updateMatrixWorld();
                socket.emit('Voxel upload', JSON.stringify(this.Objects));
                console.log("You have save ", this.Objects);
            },
            delete: function(name, socket){
                if(!name || !socket)return;
                socket.emit('Voxel delete',  name);
                console.log("You have DELETE ", name);
            },
            mode: function(m){
                m = m.toUpperCase();
                switch (m) {
                    case "CREATE":
                    this.helper.material.color.setHex(0x00FF00);
                    break;
                    case "DESTROY":
                    this.helper.material.color.setHex(0xFF0000);
                    break;
                    default: return;
                }
                this._mode = m;
            }
        })
    }
    return OBJ;
});
