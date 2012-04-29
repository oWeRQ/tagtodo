define([
	'underscore',
	'backbone',
	'app',
	'views/tag'
], function(_, Backbone, App, TagView) {
	var TagsView = Backbone.View.extend({
		initialize: function(){
			App.tags.on('add', this.addOne, this);
			App.tags.on('reset', this.addAll, this);
		},
		addOne: function(tag) {
			var view = new TagView({model: tag});
			this.$el.append(view.render().el);
		},
		addAll: function() {
			App.tags.each(this.addOne, this);
		}
	});
	return TagsView;
});