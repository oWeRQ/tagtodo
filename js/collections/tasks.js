define([
	'underscore',
	'backbone',
	'models/task'
], function(_, Backbone, Task) {
	var Tasks = Backbone.Collection.extend({
		model: Task,
		url: scriptUrl+'/api/tasks'
	});
	return Tasks;
});