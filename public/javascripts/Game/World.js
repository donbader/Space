(function(){
var World = this.World = Class.extend(new THREE.Object3D());

World.init = function(){
	console.log("HIHI, this is world created");
}

var world = new World();
var box = new THREE.Mesh(new THREE.BoxGeometry( 200, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0xffff00 } ));
box.position.set(0, 0, 6);
box.name = 'box';
world.add(box);

console.log(world);
})();




