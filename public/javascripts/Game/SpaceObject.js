// make an extend function
// Prop must have init();
(function(){
    this.MakeExtendable = function(ancestor){
        var fnTest = /xyz/.test(function() {
            console.log(xyz);
            xyz;
        }) ? /\b_super\b/ : /.*/;
        var initializing = false;

        // Override init and constructor
        ancestor.prototype.init = ancestor.prototype.init || ancestor.prototype.constructor;
        ancestor.prototype.constructor = function(){
            if(!initializing && this.init)
                this.init.apply(this, arguments);
        }
        //
        ancestor.extend = function(prop){
            var _super = this.prototype;
            initializing = true;
            var prototype = new this();
            initializing = false;

            // clone all prop to prototype
            for(var name in prop){
                prototype[name] = typeof prop[name] === "function" &&
                    typeof _super[name] === "function"  && fnTest.test(prop[name]) ?
                    (function(name, fn) { // if it is a function
                        return function(){
                            var tmp = this._super;
                            // call the method on ._super class
                            this._super = _super[name];
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;
                            return ret;
                        };
                    })(name, prop[name])
                    : prop[name]; // else
            }

            function SpaceClass(){
                if(!initializing && this.init)
                    this.init.apply(this, arguments);
            }

            // Populate our constructed prototype object
            SpaceClass.prototype = prototype;
            // Enforce the constructor to be what we expect
            SpaceClass.prototype.constructor = Class;
            // Make it extendable
            SpaceClass.extend = arguments.callee;
            return SpaceClass;
        }
    }

    MakeExtendable(THREE.Object3D);

})();
