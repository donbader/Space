(function(){
    if(!this.Character){
        console.error("No Character.js included");
        return ;
    }
    this.Saiyan = Character.extend({
        init: function (){
            this.body.material.color.set("rgb(255,253,54)");
            var light = new THREE.PointLight("rgb(255,253,54)", 3, 170);
            this.add(light);
            light.position.set(0,this.info.height/2,0);
        }
    });

})();
