# Backbone Tables

Backbone Tables can be used to dynamically create html tables within a Backbone project. The project comprises three components:

- table-mixin (to be mixed into a view) **TODO: not a mixin - fix!**
- sort-mixin (to be mixed into a collection)
- _table_template (to render data into html)

- [1. Usage](#usage)
	- [a. Generating a Table](#generate-table)
		- [1.1 Full example](#full-example)
		- [1.2 Step by Step](#step-by-ste)
	- [b. Making a Table sortable](#sort-table)
		- [2.1 Full example](#full-example)
		- [2.2 Step by Step](#step-by-ste)
- [2. Advanced](#advanced)
	- [Defining columns](#display-columns)
	- [Formatters](#formatters)
		- [Custom Formatters](#custom-formatters)
	- [Options](#options)

## Usage
The readme assumes that you are using RequireJS


<a name="generate-table"></a>
### 1. Generating a Table


<a name="full-example"></a>
#### Full example:

```
define([
  'jquery', 'underscore', 'backbone',
  
  '_stats/templates/_table_template.ejs',
  '_stats/helpers/table-mixin',
], function (
  $, _, Backbone,
  TableTemplate, TableMixin
){
  'use strict';

  var View = Backbone.View.extend({

    template: _.template(QualityTemplate),

	initialize: function() {
		this.myCollection = new Backbone.Collection();
		
		var displayColumns = [
			'productName',
			{property: 'price', type: 'number'}
		];
		
		this.table = new TableMixin();
		this.table.setUp({
			collection: this.myCollection,
			columns: displayColumns
		});
	},

    render: function(){
      	var context = {
        	columns: _this.table.getHeaders(),
        	rows: _this.table.getRows(),
      	};
      
    	this.$el.html(_this.template(context));
    	return _this;
    }
  });

  return QualityView;
});

```

#### Step by Step
 Include the table-mixin.js and the _table_template into a view

```
define([
  'jquery', 'underscore', 'backbone',
  
  '_stats/templates/_table_template.ejs',
  '_stats/helpers/table-mixin',
], function (
  $, _, Backbone,
  TableTemplate, TableMixin
){
```

Define an array of properties/fields of the models inside the collection that shall be displayed in the html table. (`displayColumns` in this example)

```
  'use strict';

  var View = Backbone.View.extend({

    template: _.template(TableTemplate),

	initialize: function() {
		this.myCollection = new Backbone.Collection();
		
		var displayColumns = [
			'productName',
			{property: 'price', type: 'number'}
		];
```

Create a new instance of the `TableMixin` and use `table.setup()` to register the collection and the displayed columns (see the section [Display Columns](#displayColumns) for more details) with the mixin.

```		
		this.table = new TableMixin();
		this.table.setUp({
			collection: this.myCollection,
			columns: displayColumns
		});
	},
```

The template expects you to pass `columns` to generate the table header and `rows` to fill the table with data.

```
    render: function(){
      	var context = {
        	columns: _this.table.getHeaders(),
        	rows: _this.table.getRows(),
      	};
      
    	this.$el.html(_this.template(context));
    	return _this;
    }
  });

  return QualityView;
});

```


<a name="sort-table"></a>
### 2. Making a Table sortable
Sorting tables is accomplished by sorting the underlying collection. To augment a standard `Backbone.Collection`, `sort-mixin' needs to be mixed in.

#### Full example

```
define([
  'jquery', 'underscore', 'backbone',
  '_stats/helpers/sort-mixin',
], function (
  $, _, Backbone,
  sortMixin
){
  'use strict';

  var Collection = Backbone.Collection.extend({
    model: Backbone.Model, 

    url: 'https://url/to/some/api/endpoint',

    initialize: function(models, options) {
      _.extend(this, sortMixin);
    },

  });

  return Collection;
});

```

**In the [view](#full-example), add the following two parts:**


```
    events: {
      'click th': 'onClickHead'
    },

    onClickHead: function(evt) {
      this.collection.updateOrder(evt.currentTarget.dataset.fieldName);
    },

```

#### Step by Step

Include `sort-mixin`

```
define([
  'jquery', 'underscore', 'backbone',
  '_stats/helpers/sort-mixin',
], function (
  $, _, Backbone,
  sortMixin
  
````

Extend the collection (`this`) with the mixin (`sortMixin`) to make its methods available from within the collection.

```
){
  'use strict';

  var Collection = Backbone.Collection.extend({
    model: Backbone.Model, 

    url: 'https://url/to/some/api/endpoint',

    initialize: function(models, options) {
      _.extend(this, sortMixin);
    },

  });

  return Collection;
});

```


**In the [view](#full-example), add the following two parts:**

Listen for a `click` event on the table head and call the `onClickHead` method.

```
    events: {
      'click th': 'onClickHead'
    },
    
```

Add a function that handles the click event and sorts the collection on the table column that corresponds to `fieldName`

```
    onClickHead: function(evt) {
      this.collection.updateOrder(evt.currentTarget.dataset.fieldName);
    },

```


<a name="advanced"></a>
## Advanced

<a name="display-columns"></a>
### Defining columns

#### Array of Strings
The columns to be displayed is an array of strings, objects or a mix of both. The simplest form is an `array` of `strings`

**Example:** [‘name’, ‘birthday’, ‘salary’]

Every string in the array corresponds to a model property inside <collection> that gets passed to the `setUp()` method

#### Array of Objects
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

For every entry specified in this format, a `property` needs to be specified. `type`determines the formatter method that will be applied to the properties value. Further options can be passed depending on the respective formatter method. Read more in the following section.


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

## TODO
* implement translation function
* document render() -> sort: collection.getSortState()
* document collection.listenTo 'sort' -> render
