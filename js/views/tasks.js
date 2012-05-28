define([
	'underscore',
	'backbone',
	'app',
	'models/tag',
	'views/task',
	'views/taskForm'
], function(_, Backbone, App, Tag, TaskView, TaskFormView) {
	var TasksView = Backbone.View.extend({
		currentDate: null,
		currentTags: [],
		initialize: function(){
			this.tasksList = this.$('ul.tasks');

			App.tasks.on('add', this.addOne, this);
			App.tasks.on('reset', this.addAll, this);
			App.tasks.on('change', this.applyFilter, this);
			App.tasks.on('add', this.applyFilter, this);
			App.tasks.on('remove', this.applyFilter, this);

			this.newTask = new TaskFormView({
				el: this.$('form.newTask')
			});

			this.tasksList.sortable({
				axis: 'y',
				handle: '.sortable-handle',
				update: function(event, ui){
					var task_id = ui.item.data('id'),
						prev_id = ui.item.prev().data('id'),
						next_id = ui.item.next().data('id');

					var prev_weight = prev_id ? App.tasks.get(prev_id).getWeight() : 0,
						next_weight = next_id ? App.tasks.get(next_id).getWeight() : prev_id+1024;

					if (!prev_id && next_id)
						prev_weight = next_weight-1024;

					App.tasks.get(task_id).save({
						weight: prev_weight+(next_weight-prev_weight)/2
					});
				}
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
		getCurrentTagsTaskIds: function(){
			return this.currentTags.length ? _.intersection.apply(
				this,
				_.map(this.currentTags, function(tag){
					return tag ? tag.get('tasks') : [];
				})
			) : [];
		},
		updateNavigate: function(){
			var navigate = [];

			if (this.currentDate) {
				navigate.push('date/'+this.currentDate);
				this.newTask.deadline.attr('placeholder', this.currentDate);
			} else {
				this.newTask.deadline.attr('placeholder', 'deadline');
			}

			if (this.currentTags.length) {
				var currentTagNames = _.map(this.currentTags, function(tag){
					return tag.get('name');
				});

				navigate.push('tags/'+currentTagNames.join('/'));
				this.newTask.body.attr('placeholder', '#'+currentTagNames.join(' #')+' ');
			} else {
				this.newTask.body.attr('placeholder', '');
			}
			App.router.navigate(navigate.join('/'));
		},
		applyFilter: function(){
			_.each(this.currentTags, function(tag){
				tag.view.setActive(true);
			});

			var tagsTaskIds = this.getCurrentTagsTaskIds();

			App.tasks.each(function(task){
				if (!task.view)
					return;
				var isTagsTask = this.currentTags.length === 0 || _.indexOf(tagsTaskIds, task.id) !== -1;
				var isDate = !this.currentDate || task.get('deadline') === this.currentDate;
				task.view.$el.toggle(isTagsTask && isDate);
			}, this);

			App.timelineView.render();
			this.updateNavigate();

			return this;
		},
		addFilterTags: function(tags) {
			if (!(tags instanceof Tag)) {
				tags = _.compact(_.map(tags, function(tag){
					if (!(tag instanceof Tag)) {
						if (_.isString(tag))
							tag = App.tags.where({name: decodeURIComponent(tag)})[0];
						else
							return null;
					}
					return tag;
				}));
			}
			this.currentTags = _.union(this.currentTags, tags);
		},
		removeFilterTag: function(tag) {
			this.currentTags = _.without(this.currentTags, tag);
		},
		setFilterDate: function(date){
			this.currentDate = date;
		}
	});
	return TasksView;
});