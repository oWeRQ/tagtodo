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
			'click': 'toggle'
		},
		active: false,
		initialize: function(){
			this.model.view = this;
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
		setActive: function(active){
			this.active = active;
			this.$el.toggleClass('active', active);
		},
		toggle: function(){
			this.setActive(!this.active);

			if (this.active)
				App.tasksView.addFilterTags(this.model);
			else
				App.tasksView.removeFilterTag(this.model);

			App.tasksView.applyFilter();
		}
	});
	return TagView;
});