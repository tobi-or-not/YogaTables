# YogaTables for Backbone

Disclaimer: This package comes out of a browserify project and has not been used or tested with anything else (yet).

Backbone Tables can be used to dynamically create html tables within a Backbone project. The project comprises three components:

- view-library (the centerpiece of the table)
- sort-mixin (to be mixed into a collection)
- template (to render data into html)


## TOC
- [1. Usage](#usage)
	- [1.0 The Template](#the-template)
	- [1.1 Generating a Table](#generate-table)
	- [1.2 Making a Table Sortable](#sort-table)
- [2. Advanced](#advanced)
	- [Defining columns](#display-columns)
	- [Formatters](#formatters)
		- [Custom Formatters](#custom-formatters)
	- [Options](#options)
	- [Recipes](#recipes)

## Usage

<a name="the-template"></a>
### 1.0 The Template
The template that comes with the package (/lib/template.ejs) is supposed to be copied into your project and should be adjusted to your needs. This is to keep the presentation layer flexible instead of passing tons of configuration to the library.


<a name="generate-table"></a>
### 1.1 Generating a Table

Instanciate a collection.

```
var teaCollection = new Backbone.Collection([
	{ name: 'Sencha', origin: 'Japan', brewTemperatur: '75' },  
	{ name: 'Gunpowder', origin: 'China', brewTemperatur: 80 }
]);
```

Include the table-lib and the template into a view

```
var Table = require('table-lib').Table;
```

Define the columns of the table as an array of properties/fields that shall be displayed.

```
var displayColums = ['name', 'origin', 'brewTemparature'];
```

Create a new instance of the `Table` and use `table.setup()` to register the collection and the displayColumns (see the section [Display Columns](#displayColumns) for more details).

```
this.table = new Table();
this.table.setUp({
	collection: teaCollection,
	columns: displayColumns
});
```

The template expects you to pass `columns` to generate the table header and `rows` to fill the table with data.

In your render method pass the table data into your template

```
render: function() {
	var context = {
		table: this.table.toJSON()
	};
	this.$el.html(_.template(context)());
}
```

<a name="sort-table"></a>
### 2. Making a Table Sortable
Sorting tables is accomplished by sorting the underlying collection. To augment a standard `Backbone.Collection`, sort-mixin needs to be mixed in.

**Collection**

```
var sortMixin = require('table-lib').collectionMixin;

var ExampleCollection = Backbone.Collection.extend({
  initialize: function() {
    _.extend(this, sortMixin); 
  },
});
```
Extend the collection (`this`) with the mixin (`sortMixin`) to make its methods available from within the collection.

**View**

To update the table after sorting and to make the table header clickable, we need to pass a view instance into the table instance

```
this.table = new Table();
this.table.setUp({
	collection: teaCollection,
	columns: displayColumns,
	view: this
});
```



<a name="advanced"></a>
## Advanced

<a name="display-columns"></a>
### Defining columns
Simple and advanced can be use together/mixed.

#### Array of Strings (simple)
The columns to be displayed is an array of strings, objects or a mix of both. The simplest form is an `array` of `strings`

**Example:** [‘name’, ‘birthday’, ‘salary’]

Every string in the array corresponds to a model property inside <collection> that gets passed to the `setUp()` method

#### Array of Objects (advanced)
If a data type and more specific options need to be passed, this can be done by using `objects` instead of `strings`.

**Example:**  

```
[
	{
		property: ‘salary’,
		type: ‘number’,
		decimals: 5
	}, {
		property: ‘birthday’,
		type: ‘date’,
		format: ‘YYYY-MM-DD’
	}
]
```

For every entry specified in this format, a `property` needs to be specified. `type` determines the formatter method that will be applied to the properties value. Further options can be passed depending on the respective formatter method. Read more in the following section.


### Formatters
- formatters always expect a first parameter `value`
- can accept a second param `options`
- return a formatted string

Standard formatters right now:  
**string:**	{property: 'x', type: 'string'}  
**number:** {property: 'x', type: 'number', decimals: 2}  
**date:** {property: 'x', type: 'date', format: 'YYYY-MM-DD'}

`type` corresponds to a formatter function. If type: ‘currency’ is defined, there needs to be a method `table.currency()` defined.


 
#### Custom Formatters
If custom formatter functions/types are needed, they can be defined inline, on an existing instance of TableMixin

```
table.percent = function(value, options) {
	decimals = options.decimals || 2;
	return value.toFixed(decimals);
};
```


### Options:

**defaultType:** {type: ‘number’} | {type: ‘number’, decimals: 5}

If nothing else is specified and a column is listed as `string`, the columns type will be handled as `string`. If the majority of values in a table, however are numbers, the `defaultType` can be set to number to save some typing.


<a name="recipes"></a>
### Recipes

#### HTML in Table Cell
If more complex data structures are needed, or additional markup (for example links), the template needs to be changed from `<%- column %>` to `<%= column %>`. This will stop underscore templates from escaping the html.

## TODO
* implement translation function
* implement filtering
* support nested attributes
