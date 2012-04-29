define([
	'underscore',
	'backbone',
	'app',
	'text!templates/tag.html'
], function(_, Backbone, App, tagTemplate) {
	var TagView = Backbone.View.extend({
		template: _.template(tagTemplate),
		tagName: 'li',
		events: {
			'click': 'filter'
		},
		initialize: function(){
			this.model.on('destroy', this.remove, this);
			this.model.on('change:tasks', this.updateCount, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.count = this.$('.count');
			return this;
		},
		updateCount: function(){
			this.count.html(this.model.get('tasks').length);
		},
		filter: function(){
			this.$el.addClass('active').siblings().removeClass('active');
			App.tasksView.filterByTag(this.model);
			App.router.navigate('tag/'+this.model.get('name'));
		}
	});
	return TagView;
});