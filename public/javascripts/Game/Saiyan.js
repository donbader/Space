(function(){
    if(!this.Character){
        console.error("No Character.js included");
        return ;
    }
    this.Saiyan = Character.extend({
        init: function (){
            this._super.init.call(this);
            this.body.material.color.set("rgb(255,253,54)");
            var light = new THREE.PointLight("rgb(255,253,54)", 1, 500);
            light.position.set(0,1,0);
            this.add(light);
        }
    });

})();
