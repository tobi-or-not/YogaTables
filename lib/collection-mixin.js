'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
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
  if(typeof property === 'undefined') {
    throw new TypeError('missing argument <property>');
  }

  if(this.sortAttribute === property) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortAttribute = property;
    this.sortDirection = 'asc';
  }

  if(order) { this.sortDirection = order; }
  this.sort();
};

/**
 * Returns the sort order and what colum/property
 * the collections is currently sorted on
 *
 * @returns {String} asc|desc
 */
var getSortState = function() {
  return {
    direction: this.sortDirection,
    attribute: this.sortAttribute
  };
};

// accepts nested attributes
// both Backbone objects and plain javascript objects
// example: getAttribute('person.name')
var getNested = function(model, attributeChain) {
  var attributeNames = attributeChain.split('.'); 
  var ancestor = model;
  var child;   

  _.each(attributeNames, function(name) {
    if(!ancestor) { return ancestor; }
    if(ancestor instanceof Backbone.Model) {
      child = ancestor.get(name);
    } else {
      child = ancestor[name];
    }
    ancestor = child;
  });
  return ancestor;
};

var comparator = function(a, b) {
  a = getNested(a, this.sortAttribute);
  b = getNested(b, this.sortAttribute);

  a = this.optimizeForSorting(a);
  b = this.optimizeForSorting(b);

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


