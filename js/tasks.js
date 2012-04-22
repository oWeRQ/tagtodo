$(function(){

	var Task = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			status: 0,
			body: '',
			tags: []
		},
		view: null,
		_tags: null,
		initialize: function(attr){
			this.on('change:body', this.parseTags, this);
			this.on('add', this.parseTags, this);
			this.on('destroy', this.clearTags, this);
		},
		getTags: function(){
			var task = this;
			if (task._tags === null) {
				task._tags = new Tags;
				_.each(this.get('tags'), function(tag_id){
					task._tags.add(tags.get(tag_id));
				});
			}
			return task._tags;
		},
		setTags: function(newTags){
			if (this.isNew())
				return false;

			var task = this;
			var oldTags = task.getTags();

			oldTags.each(function(tag){
				if (!newTags.get(tag.id)) {
					tag.removeTask(task);
				}
			});
			newTags.each(function(tag){
				if (!oldTags.get(tag.id)) {
					tag.addTask(task);
				}
			});

			task._tags = newTags;
			this.set('tags', newTags.pluck('id'));
			this.save(null, {
				silent: true,
				success: function(){}
			});
		},
		parseTags: function(){
			var task = this;
			var newTags = new Tags;

			var createTagsTotal = 0;
			var createTagsDone = 0;
			var fireSet = function(){
				if (createTagsTotal === 0 || createTagsDone === createTagsTotal) {
					task.setTags(newTags);
					return true;
				}
				return false;
			};

			_.each(this.get('body').match(/#([^\s]+)/g), function(hashTag){
				var name = hashTag.substr(1);
				if (name.length === 0)
					return;

				var tag = tags.where({name: name})[0];

				if (tag) {
					newTags.add(tag);
				} else {
					createTagsTotal++;
					tags.create({name: name, tasks: []}, {
						wait: true,
						success: function(tag){
							newTags.add(tag);
							createTagsDone++;
							fireSet();
						}
					});
				}
			});
			fireSet();
		},
		clearTags: function(){
			var task = this;
			this.getTags().each(function(tag){
				tag.removeTask(task);
			});
		}
	});

	var Tasks = Backbone.Collection.extend({
		model: Task,
		url: scriptUrl+'/api/tasks'
	});

	var Tag = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			name: '',
			count: 0,
			tasks: []
		},
		addTask: function(task){
			var tagTasks = this.get('tasks');
			if (_.indexOf(tagTasks, task.id) === -1) {
				tagTasks.push(task.id);
				this.set('tasks', tagTasks);
				this.trigger('change:tasks');
			}
		},
		removeTask: function(task){
			var tagTasks = this.get('tasks');
			tagTasks = _.without(tagTasks, task.id);
			if (tagTasks.length === 0)
				this.destroy();
			else
				this.set('tasks', tagTasks);
		}
	});

	var Tags = Backbone.Collection.extend({
		model: Tag,
		url: scriptUrl+'/api/tags'
	});

	var TaskView = Backbone.View.extend({
		template: _.template($('#taskTemplate').html()),
		tagName: 'li',
		events: {
			'change .status': 'changeStatus',
			'change .body': 'changeBody',
			'click .delete': 'delete'
		},
		initialize: function(){
			this.model.on('destroy', this.remove, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.status = this.$('.status');
			this.body = this.$('.body');
			return this;
		},
		changeStatus: function(){
			var checked = this.status.prop('checked');

			this.body.toggleClass('done', checked);

			this.model.save({
				status: +checked
			});
		},
		changeBody: function(){
			var body = this.body.val();
			if (body != this.model.get('body')) {
				this.model.save({
					body: body
				});
			}
		},
		delete: function(e){
			e.preventDefault();
			if (confirm('Delete?'))
				this.model.destroy();
		}
	});

	var TaskFormView = Backbone.View.extend({
		events: {
			'submit': 'submit'
		},
		initialize: function(){
			this.body = this.$('.body');
		},
		submit: function(e){
			e.preventDefault();

			this.collection.create({
				body: this.body.val()
			}, {
				wait: true
			});

			this.body.val('');
		}
	});

	var TasksView = Backbone.View.extend({
		events: {
			'click .showAll': 'showAll'
		},
		initialize: function(){
			this.breadcrumbs = {};
			this.breadcrumbs.showAll = this.$('.showAll');
			this.breadcrumbs.tag = this.$('.tag').hide();
			this.tasksList = this.$('ul.tasks');

			tasks.on('add', this.addOne, this);
			tasks.on('reset', this.addAll, this);

			this.newTask = new TaskFormView({
				el: this.$('form.newTask'),
				collection: tasks
			});
		},
		addOne: function(task) {
			task.view = new TaskView({model: task});
			this.tasksList.append(task.view.render().el);
		},
		addAll: function() {
			this.tasksList.empty();
			tasks.each(this.addOne, this);
		},
		showAll: function() {
			tasks.each(function(task){
				task.view.$el.show();
			}, this);

			this.breadcrumbs.tag.hide();

			tagsView.$el.children('li').removeClass('active');
		},
		filterByTag: function(tag) {
			var ids = tag.get('tasks'),
				hashTag = '#'+tag.get('name'),
				body = this.newTask.body;

			if (body.val() === '')
				body.val(hashTag+' ');
			else
				body.val(body.val().replace(/#([^\s]+)/, hashTag));

			tasks.each(function(task){
				task.view.$el.toggle(_.indexOf(ids, task.id) !== -1);
			}, this);

			this.breadcrumbs.tag.text('#'+tag.get('name')).show();
		}
	});

	var TagView = Backbone.View.extend({
		template: _.template($('#tagTemplate').html()),
		tagName: 'li',
		events: {
			'click': 'filter'
		},
		initialize: function(){
			this.model.on('destroy', this.remove, this);
			this.model.on('change:tasks', this.updateCount, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.count = this.$('.count');
			return this;
		},
		updateCount: function(){
			this.count.html(this.model.get('tasks').length);
		},
		filter: function(){
			this.$el.addClass('active').siblings().removeClass('active');
			tasksView.filterByTag(this.model);
		}
	});
	
	var TagsView = Backbone.View.extend({
		initialize: function(){
			tags.on('add', this.addOne, this);
			tags.on('reset', this.addAll, this);
		},
		addOne: function(tag) {
			var view = new TagView({model: tag});
			this.$el.append(view.render().el);
		},
		addAll: function() {
			tags.each(this.addOne, this);
		}
	});

	var tags = new Tags;
	var tasks = new Tasks;

	var tagsView = new TagsView({
		el: $("#tagsList")
	});
	var tasksView = new TasksView({
		el: $("#tasks")
	});

	tags.fetch({
		success: function(collection, resp){
			tasks.fetch();
		}
	});

});
