//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
// var user = new Character();
var Ninja = Character.extend({
    init: function(){
        this._super();
        this.body.material.color.setHex( 0x000000 );
    }
});


var user = new Ninja();
var clock = new THREE.Clock();

var needToRender = true;
window.addEventListener('focus', ()=>needToRender = true);
window.addEventListener('blur', ()=>needToRender = false);

// initialization
init();

// animation loop / game loop
gameloop();

//------------------------------------------------------------
///////////////
// FUNCTIONS //
///////////////

function init() {
    ///////////
    // SCENE //
    ///////////
    scene = new THREE.Scene();
    scene.updateMatrixWorld();
    camera = user.controls.camera;




    //////////////
    // RENDERER //
    //////////////
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // attach div element to variable to contain the renderer
    container = document.getElementById('GamePlay');
    // alternatively: to create the div at runtime, use:
    //   container = document.createElement( 'div' );
    //    document.body.appendChild( container );

    // attach renderer to the container div
    container.appendChild(renderer.domElement);


    user.in(scene, renderer);
    user.controls.enable();
    // user.controls.disable();
    user.move(0,0,100);
    ///////////
    // STATS //
    ///////////

    // displays current and past frames per second attained by scene
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    ///////////
    // LIGHT //
    ///////////

    // create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    //////////////
    // GEOMETRY //
    //////////////
    var loader = new THREE.ObjectLoader();
        console.log("HI");

    // loader.load("3D/desk/desk2.json", function(object){
    //     console.log(object);
    //     scene.add(object);
    //     object.position.set(0,0,300);
    //     user.canSelect([object]);
    // });

    // most objects displayed are a "mesh":
    //  a collection of points ("geometry") and
    //  a set of surface parameters ("material")    

    // Sphere parameters: radius, segments along width, segments along height
    var sphereGeometry = new THREE.SphereGeometry(50, 32, 16);
    // use a "lambert" material rather than "basic" for realistic lighting.
    //   (don't forget to add (at least one) light!)
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x1188ff
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(100, 50, -50);
    sphere.name = 'sphere';
    scene.add(sphere);


    // create a set of coordinate axes to help orient user
    //    specify length in pixels in each direction
    var axes = new THREE.AxisHelper(300);
    scene.add(axes);

    var box = new THREE.Mesh(new THREE.BoxGeometry( 20, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0xffff00 } ));
    box.position.set(0, 0, 6);
    box.name = 'box';
    scene.add(box);

    ///////////
    // FLOOR //
    ///////////

    // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
    var floorTexture = new THREE.ImageUtils.loadTexture('images/wood2.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    // DoubleSide: render texture on both sides of mesh
    var floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    floor.name = "floor";
    scene.add(floor);

    /////////
    // SKY //
    /////////

    // recommend either a skybox or fog effect (can't use both at the same time) 
    // without one of these, the scene's background color is determined by webpage background

    // make sure the camera's "far" value is large enough so that it will render the skyBox!
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    // BackSide: render faces from inside of the cube, instead of from outside (default).
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff99,
        side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);


    user.canSelect([box, sphere, floor]);

}

function gameloop() {
    requestAnimationFrame(gameloop);
    var delta = clock.getDelta();
    if(needToRender){
        user.animate(delta);
        stats.update();
        renderer.render(scene, camera);
    }
}



//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------