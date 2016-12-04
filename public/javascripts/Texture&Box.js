function CreateBoxWithTexture() {
    
	var loader = new THREE.CubeTextureLoader();
	loader.setPath("images/");

	var textureCube = loader.load([
		'CC.png', 'CC.png',
		'CC.png', 'CC.png',
		'CC.png', 'CC.png'
	]);

	console.log(textureCube);

	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		envMap: textureCube
	});

	var Box = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
	console.log(Box);

	return Box;
    //var bg = new THREE.BoxGeometry(20, 20, 20);
    //var mt = new THREE.MeshBasicMaterial({ color: 0xffffff });
}
