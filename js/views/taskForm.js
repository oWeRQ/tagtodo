define([
	'underscore',
	'backbone',
	'app'
], function(_, Backbone, App) {
	var TaskFormView = Backbone.View.extend({
		events: {
			'submit': 'submit'
		},
		initialize: function(){
			this.body = this.$('.body');
		},
		submit: function(e){
			e.preventDefault();

			// var newTask = new Task();

			// var createTask = function(){
			// 	App.tasks.create(newTask);
			// 	newTask.off('change:tags', createTask);
			// };
			// newTask.on('change:tags', createTask);

			// newTask.set({
			// 	body: this.body.val()
			// });

			App.tasks.create({
				body: this.body.val()
			}, {
				wait: true
			});

			if (App.tasksView.currentTag)
				this.body.val('#'+App.tasksView.currentTag.get('name')+' ');
			else
				this.body.val('');
		}
	});
	return TaskFormView;
});