'use strict';

var _ = require('underscore');

/* *************************************************************
 * delimiter() can be used to format a number with decimal and
 * thousands delimiters
 *
 * <number>:string|number   the number to be formatted
 * <decimalChar>:string     defaults to ','
 * <delimiter>:string       defaults to '.'
 *
 * returns:string           formated string
 *
 * example: delimiter(12345.6) -> 12.345,6
 * ***********************************************************/
var delimiter = function(number, decimalChar, delimiter) {
  var parts = String(number).split('.');
  var reversed = parts[0].split('').reverse();
  decimalChar = decimalChar || ',';
  delimiter = typeof(delimiter) !== 'undefined' ? delimiter : '.';
  
  var withDelimiter = _.map(reversed, function(n, i) {
    // insert <delimiter> after every 3rd character unless it is:
    // the first or the last
    if ( ((i+1) % 3 === 0) && (i > 0) && (i < reversed.length - 1) ) {
      return delimiter + n;
    } else {
      return n;
    }
  }).reverse().join('');

  return parts[1] ? withDelimiter + decimalChar + parts[1] : withDelimiter;
};

module.exports = delimiter;
