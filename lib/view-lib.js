'use strict';

var _ = require('underscore');
var delimiter = require('./helpers/delimiter');
var moment = require('moment');

  var ViewLib = {
    setUp: function(options) {
      this.collection = options.collection;
      this.columns = options.columns;
      this.view = options.view;

      if(typeof options.defaultType === 'string') { 
        throw new Error('defaultType must be passed as object');
      }
      this.defaultType = options.defaultType || {type: 'string'};

      if(typeof this.collection.getSortState === 'function') {
        if(typeof this.view === 'undefined') {
          throw new Error('to enable sorting, pass a view instance on setup');
        }
        this.activateSorting();
      }
    },

    activateSorting: function() {
      this.view.$el.on('click', 'th', _.bind(this.onClickHeader, this));
      this.view.render();
    },

    onClickHeader: function(evt) {
      this.collection.updateOrder(evt.currentTarget.dataset.fieldName);
    },

    getRows: function() {
      var _this = this;
      var data = _this.collection.toJSON();

      return _.map(data, function(model) {
        return _this.format(model);
      });
    },

    getHeaders: function() {
      return _.map(this.columns, function(column) {
        return column.property || column; 
      });
    },

    toJSON: function() {
      var sortState = {};

      if(typeof this.collection.getSortState === 'function') {
        sortState = this.collection.getSortState(); 
      }

      return {
        rows: this.getRows(),
        columns: this.getHeaders(),
        sort: sortState 
      };
    },

    format: function(jsonModel) {
      var _this = this;

      _.each(_this.columns, function(column) {
        column = typeof(column) === 'string' ? {property: column} : column;

        var defaultType = _.clone(_this.defaultType);
        column = _.extend(defaultType, column);

        var property = column.property;
        var type = column.type;
				try {
					jsonModel[property] = _this[type](jsonModel[property], column);
				} catch(err) {
					throw new Error('Formatter function for type "' + type + '" does not exist');
					}
      });

      return jsonModel;
    },


    // format converter methods

    /**
     * Converts a data string to a momentjs object and formats
     * it according to options.format
     *
     * @param {string} value - A date
     * @param {object} [options] - Can have following attributes
     *                 options.format - A string defining a momentjs format
     */
    date: function(value, options) {
      var format = options.format || 'YY-MM-DD HH:mm';
      var noValuePlaceholder = options.noValuePlaceholder || '---';
      return value ? moment(value).format(format) : noValuePlaceholder;
    },

    number: function(value, options) {
      var decimals = typeof(options.decimals) !== 'undefined' ? options.decimals : 2;
      var noValuePlaceholder = options.noValuePlaceholder || '---';
      if(typeof value !== 'undefined') {
        var adjustedDecimals = Number(value).toFixed(decimals);
        return delimiter(adjustedDecimals, ',', ' ');
      } else {
        return noValuePlaceholder;
      }
    },

    /**
     * This isn't doing anything but is needed if the defaultType is something
     * other than 'string'
     */
    string: function(value) {
      return value;
    }

  };

  module.exports = function() { return ViewLib; };

