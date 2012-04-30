define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var App = {
		router: null,
		tags: null,
		tasks: null,
		tagsView: null,
		tasksView: null,
		timelineView: null,
		init: function(){
			require([
				'collections/tags',
				'collections/tasks',
				'views/tags',
				'views/tasks',
				'views/timeline'
			], function(Tags, Tasks, TagsView, TasksView, TimelineView){
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
			'tags/*tags': 'tags'
		},
		date: function(date) {
			App.tasksView.filterByDate(date);
		},
		tags: function(tags){
			App.tasksView.filterByTags(tags.split('/'));
		}
	});

	return App;
});