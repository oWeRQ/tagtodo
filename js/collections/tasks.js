define([
	'underscore',
	'backbone',
	'models/task'
], function(_, Backbone, Task) {
	var Tasks = Backbone.Collection.extend({
		model: Task,
		url: scriptUrl+'/api/tasks',
		countByDay: function(){
			var count = {};
			this.each(function(task){
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