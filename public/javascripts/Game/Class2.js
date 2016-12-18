
var Class2 = function(d){
  d.constructor.extend = function(def){
    for (var k in d) if (!def.hasOwnProperty(k)) def[k] = d[k];
    return Class2(def);
  };
  return (d.constructor.prototype = d).constructor;
};



