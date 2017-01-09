(function(global, factory){
    if (global.SPACE_OBJECT === undefined) {
		global.SPACE_OBJECT = factory();
	}
})(window, function(){
    'use strict';

    var OBJ = {
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
                this.Objects = new THREE.Object3D;
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
            create: function(material){
                material = material || this.cubeMaterial;
                var voxel = new THREE.Mesh( this.cubeGeo, material );
                voxel.scale.set(this.voxelWidth, this.voxelWidth, this.voxelWidth );
                voxel.position.copy( this.intersect.point ).add( this.intersect.face.normal );
                voxel.position.divideScalar( this.voxelWidth ).floor().multiplyScalar( this.voxelWidth ).addScalar( this.voxelWidth/2 );
                this.Objects.add(voxel);
                voxel.name = "voxel";
                // console.log("CREATE", voxel);
                return voxel;
            },
            destroy: function(voxel){
                this.Objects.remove(voxel);
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
                this.helper.position.divideScalar( this.voxelWidth ).floor().multiplyScalar( this.voxelWidth ).addScalar( this.voxelWidth/2 );
                this.intersect = intersect;
            },
            clear: function(objs){
                var scope = this;
                objs.filter((element)=>{
                    if(element.name === "voxel")
                        scope.Objects.remove(element);
                    return element.name !== "voxel";
                })
            },
            save: function(name){
                this.Objects.name = name;
                console.log(this.Objects.children.length);
                // upload???
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
