$(function(){

	var App = {
		router: null,
		tags: null,
		tasks: null,
		tagsView: null,
		tasksView: null,
		init: function(){
			App.tags = new Tags;
			App.tasks = new Tasks;

			App.tagsView = new TagsView({
				el: $("#tagsList")
			});
			App.tasksView = new TasksView({
				el: $("#tasks")
			});

			App.tags.fetch({
				success: function(){
					App.tasks.fetch({
						success: function(){
							App.onload();
						}
					});
				}
			});
		},
		onload: function(){
			App.router = new AppRouter();
			Backbone.history.start();
		}
	};

	var AppRouter = Backbone.Router.extend({
		routes: {
			'tag/:tagName': 'tag',
		},
		tag: function(tagName) {
			var tag = App.tags.where({name: tagName})[0];
			if (tag)
				App.tasksView.filterByTag(tag);
		}
	});

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

				var tag = App.tags.where({name: name})[0];

				if (tag) {
					newTags.add(tag);
				} else {
					createTagsTotal++;
					App.tags.create({name: name, tasks: []}, {
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

			if (App.tasksView.currentTag)
				this.body.val('#'+App.tasksView.currentTag.get('name')+' ');
			else
				this.body.val('');
		}
	});

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
				el: this.$('form.newTask'),
				collection: App.tasks
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
			App.tasksView.filterByTag(this.model);
			App.router.navigate('tag/'+this.model.get('name'));
		}
	});
	
	var TagsView = Backbone.View.extend({
		initialize: function(){
			App.tags.on('add', this.addOne, this);
			App.tags.on('reset', this.addAll, this);
		},
		addOne: function(tag) {
			var view = new TagView({model: tag});
			this.$el.append(view.render().el);
		},
		addAll: function() {
			App.tags.each(this.addOne, this);
		}
	});

	App.init();

});
