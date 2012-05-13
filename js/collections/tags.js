define([
	'underscore',
	'backbone',
	'models/tag'
], function(_, Backbone, Tag) {
	var Tags = Backbone.Collection.extend({
		model: Tag,
		url: scriptUrl+'/api/tags',
		comparator: function(a, b){
			var a_str = a.get('name').toUpperCase(),
				b_str = b.get('name').toUpperCase();

			if (a_str == b_str)
				return 0;
			else if (a_str > b_str)
				return 1;
			else if (a_str < b_str)
				return -1;
		}
	});
	return Tags;
});