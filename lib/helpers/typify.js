'use strict';

var typify = {
  get: function(variable) {
    var type = Object.prototype.toString.call(variable).slice(8, -1);
    
    if(type === 'String') {
      var casted = this.cast(variable);             
      type = Object.prototype.toString.call(casted).slice(8, -1);
    }
    return type;
  },

  is: function(variable, type) {
    return Object.prototype.toString.call(variable).slice(8, -1) === type;
  },

  cast: function(variable) {
    if(!isNaN(Number(variable))) { return Number(variable); }
    if(!isNaN(Date.parse(variable))) { return new Date(variable); }
    if(variable === 'false' || variable === 'true') { return Boolean(variable); }
    if(variable === 'undefined') { return undefined; }
    
    return variable;
  }
};

module.exports = typify;
