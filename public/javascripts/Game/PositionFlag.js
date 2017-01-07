(function(){
var PositionFlag = this.PositionFlag = THREE.Object3D.extend({
    init:function(){
        var scope = this;
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
        this.model.position.set(0,scope.height/2,0);
        this.add(this.model);
    }
});
})();
