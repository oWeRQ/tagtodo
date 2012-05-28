define([
	'underscore',
	'backbone',
	'models/task'
], function(_, Backbone, Task) {
	var Tasks = Backbone.Collection.extend({
		model: Task,
		url: scriptUrl+'/api/tasks',
		comparator: function(a, b){
			var a_weight = a.getWeight(),
				b_weight = b.getWeight();

			if (a_weight == b_weight)
				return 0;
			else if (a_weight > b_weight)
				return 1;
			else if (a_weight < b_weight)
				return -1;
		},
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