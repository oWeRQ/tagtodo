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
		init: function(){
			require([
				'collections/tags',
				'collections/tasks',
				'views/tags',
				'views/tasks'
			], function(Tags, Tasks, TagsView, TasksView){
				App.tags = new Tags();
				App.tasks = new Tasks();

				App.tagsView = new TagsView({
					el: $("#tagsList")
				});
				App.tasksView = new TasksView({
					el: $("#tasks")
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
			'tag/:tagName': 'tag'
		},
		tag: function(tagName) {
			var tag = App.tags.where({name: decodeURIComponent(tagName)})[0];
			if (tag)
				App.tasksView.filterByTag(tag);
			else
				App.router.navigate('');
		}
	});

	return App;
});