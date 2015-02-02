'use strict';

var _ = require('underscore');

var setFilter = function(filterString) {
  this.filterString = filterString;
  this.trigger('update:filter');
};

var filtered = function() {
  var selection = _.filter(this.models, function(model) {
    for(var i=0, l = this.filterOn.length; i < l; i++) {
      var value = model.get(this.filterOn[i]);
      if(String(value).toLowerCase().indexOf(this.filterString) !== -1) {
        return true;
      }
    }
  }, this);

  var filteredCol = this.clone(this);
  filteredCol.comparator = undefined;
  filteredCol.reset(selection, {silent: true});

  return filteredCol;
};

module.exports = {
  setFilter: setFilter,
  filtered: filtered
};

