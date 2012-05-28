define [
	'underscore'
	'backbone'
	'models/tag'
], (_, Backbone, Tag) ->
	Tags = Backbone.Collection.extend
		model: Tag
		url: scriptUrl+'/api/tags'
		comparator: (a, b) ->
			a_str = a.get('name').toUpperCase()
			b_str = b.get('name').toUpperCase()

			if a_str == b_str
				0
			else if a_str > b_str
				1
			else if a_str < b_str
				-1
	Tags