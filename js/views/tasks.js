define([
	'underscore',
	'backbone',
	'app',
	'views/task',
	'views/taskForm'
], function(_, Backbone, App, TaskView, TaskFormView) {
	var TasksView = Backbone.View.extend({
		events: {
			'click .showAll': 'showAll'
		},
		currentTag: null,
		initialize: function(){
			this.breadcrumbs = {};
			this.breadcrumbs.showAll = this.$('.showAll');
			this.breadcrumbs.tag = this.$('.tag').hide();
			this.tasksList = this.$('ul.tasks');

			App.tasks.on('add', this.addOne, this);
			App.tasks.on('reset', this.addAll, this);

			this.newTask = new TaskFormView({
				el: this.$('form.newTask')
			});
		},
		addOne: function(task) {
			task.view = new TaskView({model: task});
			this.tasksList.append(task.view.render().el);
		},
		addAll: function() {
			this.tasksList.empty();
			App.tasks.each(this.addOne, this);
		},
		showAll: function() {
			this.currentTag = null;

			App.tasks.each(function(task){
				task.view.$el.show();
			}, this);

			this.breadcrumbs.tag.hide();

			App.tagsView.$el.children('li').removeClass('active');
			App.router.navigate('');
		},
		filterByTag: function(tag) {
			this.currentTag = tag;

			var ids = tag.get('tasks'),
				hashTag = '#'+tag.get('name'),
				body = this.newTask.body;

			if (body.val() === '')
				body.val(hashTag+' ');
			else
				body.val(body.val().replace(/#([^\s]+)/, hashTag));

			App.tasks.each(function(task){
				task.view.$el.toggle(_.indexOf(ids, task.id) !== -1);
			}, this);

			this.breadcrumbs.tag.text('#'+tag.get('name')).show();
		}
	});
	return TasksView;
});