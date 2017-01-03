// make an extend function
// Prop must have init();
(function(){
    this.MakeExtendable = function(ancestor){
        ancestor.prototype.init = ancestor.prototype.init || ancestor.prototype.constructor;
        ancestor.extend = function(prop){
            function SpaceClass(){
                // ancestor.call(this, arguments);
                this.init && this.init.apply(this, arguments);
            }

            prop.constructor = SpaceClass;
            SpaceClass.prototype = Object.assign(new this(), prop);
            SpaceClass.prototype._super = this.prototype;

            // make it extendable
            SpaceClass.extend = arguments.callee;
            return SpaceClass;
        }
    }
    MakeExtendable(THREE.Object3D);

})();
