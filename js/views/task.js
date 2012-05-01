define([
	'underscore',
	'backbone',
	'app',
	'text!templates/task.html'
], function(_, Backbone, App, taskTemplate) {
	var TaskView = Backbone.View.extend({
		template: _.template(taskTemplate),
		tagName: 'li',
		events: {
			'change .status': 'changeStatus',
			'change .body': 'changeBody',
			'change .deadline': 'changeDeadline',
			'click .delete': 'destroy'
		},
		initialize: function(){
			this.$el.data('id', this.model.id);
			this.model.on('change:tags', this.changeTags, this);
			this.model.on('destroy', this.remove, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.status = this.$('.status');
			this.body = this.$('.body');
			this.deadline = this.$('.deadline');
			this.deadline.datepicker({
				dateFormat: 'yy-mm-dd'
			});
			return this;
		},
		changeStatus: function(){
			var checked = this.status.prop('checked');

			this.body.toggleClass('done', checked);

			this.model.save({
				status: +checked
			});
		},
		changeBody: function(){
			var body = this.body.val();
			if (body != this.model.get('body')) {
				this.model.set({
					body: body
				});
			}
		},
		changeDeadline: function(){
			var deadline = this.deadline.val();
			if (deadline != this.model.get('deadline')) {
				this.model.save({
					deadline: deadline
				});
			}
		},
		changeTags: function(){
			this.model.save();
		},
		destroy: function(e){
			e.preventDefault();
			if (confirm('Delete?'))
				this.model.destroy();
		}
	});
	return TaskView;
});