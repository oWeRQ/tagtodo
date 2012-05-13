define([
	'underscore',
	'backbone',
	'app'
], function(_, Backbone, App) {
	var Tag = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			name: '',
			count: 0,
			tasks: []
		},
		initialize: function(){
			this.on('destroy', this.clearTags, this);
		},
		addTask: function(task_id){
			var tagTasks = this.get('tasks');
			if (_.indexOf(tagTasks, task_id) === -1) {
				tagTasks.push(task_id);
				this.set('tasks', tagTasks);
				this.trigger('change:tasks');
			}
		},
		removeTask: function(task_id){
			var tagTasks = this.get('tasks');
			tagTasks = _.without(tagTasks, task_id);
			if (tagTasks.length === 0)
				this.destroy();
			else
				this.set('tasks', tagTasks);
		},
		clearTags: function(){
			var idx = _.indexOf(App.tasksView.currentTags, this);
			if (idx !== -1) {
				App.tasksView.currentTags.splice(idx, 1);
				App.tasksView.applyFilter();
			}
		}
	});
	return Tag;
});