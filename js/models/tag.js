define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var Tag = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			name: '',
			count: 0,
			tasks: []
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
		}
	});
	return Tag;
});