define([
	'underscore',
	'backbone',
	'models/tag'
], function(_, Backbone, Tag) {
	var Tags = Backbone.Collection.extend({
		model: Tag,
		url: scriptUrl+'/api/tags'
	});
	return Tags;
});