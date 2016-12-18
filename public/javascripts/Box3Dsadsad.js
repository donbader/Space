var info = document.createElement('div');
info.style.position = 'absolute';
info.style.top = '10px';
info.style.width = '100%';
info.style.textAlign = 'center';
info.innerHTML = 'Click and drag to rotate the cube. Mousewheel for zoom. Pages are interactive.';
document.body.appendChild(info);

var camera, scene, renderer;

var controls;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(200, 200, 200);

    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    scene = new THREE.Scene();

    var urls = [
        ['http://mrdoob.com/projects/chromeexperiments/ball_pool/', 0, 0, 100, 0, 0, 0],
        ['http://mrdoob.com/projects/glsl_sandbox/', 100, 0, 0, 0, 1.57, 0],
        ['http://mrdoob.com/lab/javascript/effects/ie6/', 0, 0, -100, 0, 3.14, 0],
        ['http://mrdoob.com/lab/javascript/effects/fire/01/', -100, 0, 0, 0, 4.71, 0],
        ['http://mrdoob.com/lab/javascript/effects/solitaire/', 0, 100, 0, 4.71, 0, 0],
        ['http://mrdoob.com/projects/code-editor/', 0, -100, 0, 1.57, 0, 0]
    ];

    for (var i = 0; i < urls.length; i++) {

        var element = document.createElement('iframe');
        element.src = urls[i][0];
        element.style.width = '800px';
        element.style.height = '800px';
        element.style.border = '0px';

        var object = new THREE.CSS3DObject(element);
        object.position.x = urls[i][1];
        object.position.y = urls[i][2];
        object.position.z = urls[i][3];
        object.rotation.x = urls[i][4];
        object.rotation.y = urls[i][5];
        object.rotation.z = urls[i][6];
        object.scale.x = 0.25;
        object.scale.y = 0.25;
        scene.add(object);

    }

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);


}