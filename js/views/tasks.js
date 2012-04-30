define([
	'underscore',
	'backbone',
	'app',
	'models/tag',
	'views/task',
	'views/taskForm'
], function(_, Backbone, App, Tag, TaskView, TaskFormView) {
	var TasksView = Backbone.View.extend({
		events: {},
		currentTags: [],
		initialize: function(){
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
			this.currentTags = [];

			App.tags.each(function(tag){
				tag.view.setActive(false);
			});

			App.tasks.each(function(task){
				task.view.$el.show();
			}, this);

			App.router.navigate('');
			this.newTask.body.attr('placeholder', '');
		},
		filterByDate: function(date) {
			App.tasks.each(function(task){
				task.view.$el.toggle(task.get('deadline') === date);
			}, this);

			App.router.navigate('date/'+date);
		},
		filterByTags: function(tags) {
			this.currentTags = _.compact(_.map(tags, function(tag){
				if (!(tag instanceof Tag)) {
					if (_.isString(tag))
						tag = App.tags.where({name: decodeURIComponent(tag)})[0];
					else
						return null;
				}

				if (tag)
					tag.view.setActive(true);

				return tag;
			}));

			if (this.currentTags.length === 0)
				return this.showAll();

			var ids = _.intersection.apply(
				this,
				_.map(this.currentTags, function(tag){
					return tag ? tag.get('tasks') : [];
				})
			);

			App.tasks.each(function(task){
				task.view.$el.toggle(_.indexOf(ids, task.id) !== -1);
			}, this);

			var currentTagNames = _.map(this.currentTags, function(tag){
				return tag.get('name');
			});

			App.router.navigate('tags/'+currentTagNames.join('/'));
			this.newTask.body.attr('placeholder', '#'+currentTagNames.join(' #')+' ');
		},
		addFilterTags: function(tags) {
			this.filterByTags(_.union(this.currentTags, tags));
		},
		removeFilterTag: function(tag) {
			this.filterByTags(_.without(this.currentTags, tag));
		}
	});
	return TasksView;
});