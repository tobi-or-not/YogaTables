'use strict';

var typify = require('./helpers/typify');


/**
 * Sets what attribute to sort on and the order and then sorts
 *
 * @param {String} property The name of a model attribute to sort on
 * @param {String} [order] What order to take on -> asc|desc
 *
 * Default sort order is 'asc'. If called on the same property twice,
 * the order gets reversed
 */
var updateOrder = function(property, order) {
  var _this = this;
  if(typeof property === 'undefined') {
    throw new Error('missing argument <property>');
  }

  if(_this.sortAttribute === property) {
    _this.sortDirection = _this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    _this.sortAttribute = property;
    _this.sortDirection = 'asc';
  }

  if(order) { _this.sortDirection = order; }
  _this.sort();
};

/**
 * Returns the sort order and what colum/property
 * the collections is currently sorted on
 *
 * @returns {String} asc|desc
 */
var getSortState = function() {
  var _this = this;
  return {
    direction: _this.sortDirection,
    attribute: _this.sortAttribute
  };
};

var comparator = function(a, b) {
  var _this = this;

  a = _this.optimizeForSorting( a.get(_this.sortAttribute) );
  b = _this.optimizeForSorting( b.get(_this.sortAttribute) );

  if (a === b) { return 0; }

  if (this.sortDirection === 'asc') {
    return a > b ? 1 : -1;
  } else {
    return a < b ? 1 : -1;
  }
};

var optimizeForSorting = function(value) {
  var cast = typify.cast(value);
  if(typify.is(cast, 'String')) { return cast.toLowerCase(); }

  return cast;
};

module.exports = {
  updateOrder: updateOrder,
  getSortState: getSortState,
  comparator: comparator,
  optimizeForSorting: optimizeForSorting
};


