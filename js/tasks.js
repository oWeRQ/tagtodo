//Backbone.emulateJSON = true;

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
			//console.log(this.getTags());
			this.on('change:body', this.parseTags, this);
			this.on('add', this.parseTags, this);
			//this.on('all', function(e){
			//	console.log(e, this);
			//}, this);

			//var task = this;
			//console.log(this.get('body'), this.get('tags'),
			//	_.map(task.tags, function(tag){
			//		return tag.get('name');
			//	}));
		},
		getTags: function(){
			var task = this;
			if (task._tags === null) {
				//task._tags = [];
				task._tags = new Tags;
				_.each(this.get('tags'), function(tag_id){
					//task._tags.push(tags.get(tag_id));
					task._tags.add(tags.get(tag_id));
				});
			}
			return task._tags;
		},
		setTags: function(newTags){
			var task = this;
			var oldTags = task.getTags();

			task._tags = newTags;
			//this.set('tags', _.pluck(newTags, 'id'));
			this.set('tags', newTags.pluck('id'));

			oldTags.each(function(tag){
				/*if (_.indexOf(task.tags, tag) === -1) {
					tag.removeTask(task);
				}*/
			});
			newTags.each(function(tag){
				/*if (_.indexOf(oldTags, tag) === -1) {
					if (!tag.isNew()) {
						tag.addTask(task);
					}
				}*/
			});
		},
		parseTags: function(event){
			var newTags = [];
			_.each(this.get('body').match(/#(\w+)/g), function(hashTag){
				var name = hashTag.substr(1);
				if (name.length === 0)
					return;

				var tag = tags.where({name: name})[0];

				if (tag) {
					newTags.add(tag);
				} else {
					newTags.add(tags.create({name: name, count: 1}));
				}
			});
			this.setTags(newTags);
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
			var tasks = this.get('tasks');
			tasks.push(task.id);
			this.set('tasks', tasks);
		},
		removeTask: function(task){
			var tasks = this.get('tasks');
			this.set('tasks', _.without(tasks, task.id));
		}
	});

	var Tags = Backbone.Collection.extend({
		model: Tag,
		url: scriptUrl+'/api/tags'
	});

	var TaskTags = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			task_id: 0,
			tag_id: 0
		}
	});

	var TaskTagsList = Backbone.Collection.extend({
		model: TaskTags,
		url: scriptUrl+'/api/taskTags'
	});

	var TaskView = Backbone.View.extend({
		template: _.template($('#taskTemplate').html()),
		tagName: 'li',
		events: {
			'change .status': 'changeStatus',
			'change .body': 'changeBody',
			//'keyup .body': 'changeBody',
			'click .delete': 'delete'
		},
		saveTimeout: null,
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.status = this.$el.find('.status');
			this.body = this.$el.find('.body');
			//this.$el.toggleClass('done', this.model.get('done'));
			//this.input = this.$('.edit');
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
			var model = this.model;
			var body = this.body.val();

			if (body != this.model.get('body')) {
				//clearTimeout(this.saveTimeout);
				//this.saveTimeout = setTimeout(function(){
					model.save({
						body: body
					});
				//}, 500);
				/*this.model.save({
					body: body
				});*/
				//this.model.parseTags();
			}
		},
		delete: function(e){
			e.preventDefault();

			if (confirm('Delete?')) {
				this.$el.remove();
				this.model.destroy();
			}
		}
	});

	var TaskFormView = Backbone.View.extend({
		events: {
			'submit': 'submit'
		},
		initialize: function(){
			this.body = this.$el.find('.body');
		},
		submit: function(e){
			e.preventDefault();

			var task = this.collection.create({body: this.body.val()});
			//task.parseTags();
			this.body.val('');
		}
	});

	var TasksView = Backbone.View.extend({
		events: {
			'click .showAll': 'showAll'
		},
		initialize: function(){
			this.breadcrumbs = {};
			this.breadcrumbs.showAll = this.$el.find('.showAll').hide();
			this.breadcrumbs.tag = this.$el.find('.tag').hide();
			this.tasksList = this.$el.find('ul.tasks');

			tasks.on('add', this.addOne, this);
			tasks.on('reset', this.addAll, this);
			tasks.fetch();

			this.newTask = new TaskFormView({
				el: this.$el.find('form.newTask'),
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
			this.breadcrumbs.showAll.hide();
			this.breadcrumbs.tag.hide();

			tagsView.$el.children('li').removeClass('active');
		},
		filterByTag: function(tag) {
			var ids = tag.get('tasks');
			tasks.each(function(task){
				task.view.$el.toggle(_.indexOf(ids, task.id) !== -1);
			}, this);
			this.breadcrumbs.showAll.show();
			this.breadcrumbs.tag.text('#'+tag.get('name')).show();
		}
	});

	var TagView = Backbone.View.extend({
		template: _.template($('#tagTemplate').html()),
		tagName: 'li',
		events: {
			'click .name': 'filter'
		},
		initialize: function(){
			this.model.on('destroy', this.remove, this);
			//this.model.on('change:count', this.updateCount, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			//this.count = this.$el.find('.count');
			return this;
		},
		/*updateCount: function(){
			this.count.html(this.model.get('count'));
		},*/
		filter: function(){
			/*var tasksList = [];
			_.each(this.model.get('tasks'), function(task_id){
				console.log(tasks.get(task_id));
				tasksList.push(tasks.get(task_id).toJSON());
			});
			console.log(tasksList);*/
			//tasks.reset(tasksList);
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

	var tasks = new Tasks;
	var tags = new Tags;
	var taskTags = new TaskTagsList;

	var tagsView = new TagsView({
		el: $("#tagsList")
	});

	var tasksView = null;

	taskTags.fetch();
	tags.fetch({
		success: function(collection, resp){
			tasksView = new TasksView({
				el: $("#tasks")
			});
		}
	});

});
