define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/app.html'
], function($, _, Backbone, AppTemplate){
	var App = {
		el: $('#tasksApp'),
		template: _.template(AppTemplate),
		router: null,
		tags: null,
		tasks: null,
		tagsView: null,
		tasksView: null,
		timelineView: null,
		statusBarView: null,
		init: function(){
			this.el.html(this.template());

			require([
				'collections/tags',
				'collections/tasks',
				'views/tags',
				'views/tasks',
				'views/timeline',
				'views/statusBar'
			], function(Tags, Tasks, TagsView, TasksView, TimelineView, StatusBarView){
				App.tags = new Tags();
				App.tasks = new Tasks();

				App.tagsView = new TagsView({
					el: $("#tagsList")
				});
				App.tasksView = new TasksView({
					el: $("#tasks")
				});
				App.timelineView = new TimelineView({
					el: $("#timeline")
				});
				App.statusBarView = new StatusBarView({
					el: $("#statusBar")
				});
				
				$.when(App.tags.fetch(), App.tasks.fetch()).done(App.onLoad);
			});
		},
		onLoad: function(){
			App.router = new AppRouter();
			Backbone.history.start();
		}
	};

	var AppRouter = Backbone.Router.extend({
		routes: {
			'date/:date': 'date',
			'date/:date/tags/*tags': 'dateTags',
			'tags/*tags': 'tags'
		},
		date: function(date) {
			App.tasksView.setFilterDate(date);
			App.tasksView.applyFilter();
		},
		dateTags: function(date, tags) {
			App.tasksView.setFilterDate(date);
			App.tasksView.addFilterTags(tags.split('/'));
			App.tasksView.applyFilter();
		},
		tags: function(tags){
			App.tasksView.addFilterTags(tags.split('/'));
			App.tasksView.applyFilter();
		}
	});

	return App;
});