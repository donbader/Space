(function(){
var World = this.World = Class.extend({
	init: function(long, width, height){
		this.__proto__ = new THREE.Object3D();

		long = long || 1024;
		width = width || 1024;
		height = height || 300;

		// ground
		this.ground = new THREE.Mesh(
						new THREE.PlaneGeometry(width, long)
						, new THREE.MeshPhongMaterial( { color: 0xff00ff } ));
		this.ground.rotation.x = -Math.PI / 2;
		this.add(this.ground);



		// walls
		this.walls = [];
		var wallsGeo = [
            new THREE.PlaneGeometry(long, height),
            new THREE.PlaneGeometry(width, height),
            new THREE.PlaneGeometry(long, height),
            new THREE.PlaneGeometry(width, height)
		];
		var wallsMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
		for(var i in wallsGeo){
			var mesh = new THREE.Mesh(wallsGeo[i], wallsMaterial);
			mesh.position.y = height / 2;
			this.walls.push(mesh);
			this.add(this.walls[i]);
		}
        this.walls[0].rotation.y = -Math.PI / 2;
        this.walls[0].position.x = width / 2;
        this.walls[1].rotation.y = Math.PI;
        this.walls[1].position.z = long / 2;
        this.walls[2].rotation.y = Math.PI / 2;
        this.walls[2].position.x = -width / 2;
        this.walls[3].position.z = -long / 2;


        // light
        this.light = new THREE.PointLight();
        this.light.position.set(0,height,0);
        this.add(this.light);
	}


});


})();




