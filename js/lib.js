var Class = function(methods) {  
    var klass = function() {   
        this.initialize.apply(this, arguments);         
    }; 
    var property;
    for (property in methods) {
       klass.prototype[property] = methods[property];
    }
         
    if (!klass.prototype.initialize) klass.prototype.initialize = function(){};     
   
    return klass;   
};