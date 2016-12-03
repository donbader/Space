// make an extend function
// Prop must hava init();
(function(){
    this.MakeExtendable = function(ancestor){
        ancestor.extend = function(prop){
            var ancestor = this;
            function SpaceClass(){
                if(!this.initialized){
                    // this.initialized = true;
                    ancestor.call(this, arguments);
                    this.init && this.init();
                }
            }

            prop.constructor = SpaceClass;
            SpaceClass.prototype = Object.assign(Object.create(ancestor.prototype), prop);
            SpaceClass.prototype._super = ancestor.prototype;

            // make it extendable
            SpaceClass.extend = arguments.callee;
            return SpaceClass;
        }
    }


    MakeExtendable(THREE.Object3D);

})();
