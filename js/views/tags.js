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
			var idx = _.indexOf(App.tags.models, tag);
			if (idx <= 0)
				this.$el.prepend(view.render().el);
			else {
				var prevTag = App.tags.models[idx-1].view.$el;
				prevTag.after(view.render().el);
			}
		},
		addAll: function() {
			App.tags.each(this.addOne, this);
		}
	});
	return TagsView;
});