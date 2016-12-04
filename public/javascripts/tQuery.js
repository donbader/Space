
	var world	= tQuery.createWorld().boilerplate().start();
//	var object	= tQuery.createTorusKnot().addTo(world);

	world.tRenderer().setClearColor( 'black', 0);

//	world.removeCameraControls();
	world.camera().translateZ(20)
	
	// your code goes here
	tQuery.createPlane().addTo(world)
		.scaleBy(16)
		.setBasicMaterial()
			// .wireframe(true)
			// .wireframeLinewidth(3)
			.opacity(0)
			.blending(THREE.NoBlending)
			.color('black')
			.back()
		
	tQuery.createTorusKnot().addTo(world)
		.position(-8,0,-4)
		.scaleBy(12)
	tQuery.createTorusKnot().addTo(world)
		.position( 8,0, 4)
		.scaleBy(12)
		
	var rendererCSS	= new THREE.CSS3DRenderer();
	rendererCSS.setSize( window.innerWidth, window.innerHeight );
	rendererCSS.domElement.style.position	= 'absolute';
	rendererCSS.domElement.style.top	= 0;
	rendererCSS.domElement.style.margin	= 0;
	rendererCSS.domElement.style.padding	= 0;
	document.body.appendChild( rendererCSS.domElement );

	THREEx.WindowResize.bind(rendererCSS, world.camera().get(0));		

	// put the mainRenderer on top
	var rendererMain	= world.tRenderer();
	rendererMain.domElement.style.position	= 'absolute';
	rendererMain.domElement.style.top	= 0;
	rendererMain.domElement.style.zIndex	= 1;
	rendererCSS.domElement.appendChild( rendererMain.domElement );

	var element	= document.createElement('iframe')
	element.src	= 'http://learningthreejs.com'
	element.style.width = '1024px';
	element.style.height = '1024px';

	// var element = document.createElement( 'div' );
	// element.style.width = '100px';
	// element.style.height = '100px';
	// element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();

	var sceneCSS	= new THREE.Scene();
	var objectCSS 	= new THREE.CSS3DObject( element );
window.objectCSS	= objectCSS
	objectCSS.scale.multiplyScalar(1/63.5)
	sceneCSS.add( objectCSS );

	world.loop().hookPostRender(function(delta, now){
		rendererCSS.render( sceneCSS, world.tCamera() );
	})
