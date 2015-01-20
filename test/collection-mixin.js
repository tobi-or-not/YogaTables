/*jshint expr: true */
/* global it, describe, beforeEach */
'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var expect = require('chai').expect;
var mixin = require('../lib/collection-mixin');
var col;

beforeEach(function(){
  col = new Backbone.Collection(); 
  _.extend(col, mixin);
});

describe('getSortState()', function() {
  it('should return an object', function() {
    expect(mixin.getSortState()).to.be.an('object');
  });

  it('should return an object that contains certain fields', function() {
    var keys = Object.keys(mixin.getSortState());
    expect(keys).to.include.members(['direction', 'attribute']);

  });
});

describe('updateOrder()', function() {
  it('should throw an error if no property is passed', function() {
    expect(mixin.updateOrder).to.throw(TypeError);
  });

  it('should set sort property to passed property attribute', function() {
    col.updateOrder('name');
    expect(col.sortAttribute).to.equal('name'); 
  });

  it('should set sort direction to acs if none is passed', function() {
    col.updateOrder('name');
    expect(col.sortDirection).to.equal('asc'); 
  });

  it('should reverse the sort direction if none is passed', function() {
    col.updateOrder('name');
    col.updateOrder('name');
    expect(col.sortDirection).to.equal('desc'); 
  });

  it('should set the sort direction according to the passed direction', function() {
    col.updateOrder('name', 'desc');
    expect(col.sortDirection).to.equal('desc'); 
    col.updateOrder('name', 'desc');
    expect(col.sortDirection).to.equal('desc'); 
  });
});

describe('optimizeForSorting()', function() {
  it('should convert strings to lowercase', function() {
    var res = col.optimizeForSorting('UpAndDown');
    expect(res).to.equal('upanddown');
  });
});

describe('comparator()', function() {
  it('should return 0 on equal values', function() {
    var m1 = new Backbone.Model({name: 'Cognac', age: 12});
    var m2 = new Backbone.Model({name: 'Cognac', age: 12});
    col.sortAttribute = 'name';
    expect(col.comparator(m1, m2)).to.equal(0);
  });
  it('should return correct search results', function() {
    var m1 = new Backbone.Model({name: 'Asbach', age: 12});
    var m2 = new Backbone.Model({name: 'Uralt', age: 30});

    col.sortAttribute = 'name';
    col.sortDirection = 'asc';
    expect(col.comparator(m1, m2)).to.equal(-1, 'name, asc');

    col.sortDirection = 'desc';
    expect(col.comparator(m1, m2)).to.equal(1, 'name, desc');

    col.sortAttribute = 'age';
    col.sortDirection = 'asc';
    expect(col.comparator(m1, m2)).to.equal(-1, 'age, asc');

    col.sortDirection = 'desc';
    expect(col.comparator(m1, m2)).to.equal(1, 'age, desc');
  });
});
