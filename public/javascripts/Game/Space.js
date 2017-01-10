(function(global, factory){
    if (global.SPACE === undefined) {
		global.SPACE = factory();
	}
})(window, function(){
    'use strict';
    if(!Character || !THREE.Object3D)
        return console.error("Need Library: Character.js / THREE.js");


    var SPACE = {
        /**************************************
                    Characters
        **************************************/
        Saiyan: Character.extend({
            init: function (){
                this._super();
                this.body.material.color.set("rgb(255,253,54)");
                var light = new THREE.PointLight("rgb(255,253,54)", 3, 170);
                this.add(light);
                light.position.set(0,this.info.height/2,0);
            }
        }),
        /**************************************
                    Game Objects
        **************************************/
        PositionFlag: THREE.Object3D.extend({
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
        }),



    };
    return SPACE;
});
