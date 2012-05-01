define([
	'underscore',
	'backbone',
	'models/task'
], function(_, Backbone, Task) {
	var Tasks = Backbone.Collection.extend({
		model: Task,
		url: scriptUrl+'/api/tasks',
		countByDay: function(taskIds){
			var count = {};
			this.each(function(task){
				if (taskIds.length && _.indexOf(taskIds, task.id) === -1)
					return;

				var deadline = task.get('deadline');

				if (count[deadline])
					count[deadline]++;
				else
					count[deadline]=1;
			});
			return count;
		}
	});
	return Tasks;
});