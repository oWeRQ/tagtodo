define [
	'underscore'
	'backbone'
	'text!templates/app.html'
], (_, Backbone, AppTemplate) ->
	App =
		el: $('#tasksApp')
		template: _.template(AppTemplate)
		router: null
		tags: null
		tasks: null
		tagsView: null
		tasksView: null
		timelineView: null
		statusBarView: null
		init: ->
			this.el.html(this.template())

			require [
				'collections/tags',
				'collections/tasks',
				'views/tags',
				'views/tasks',
				'views/timeline',
				'views/statusBar'
			], (Tags, Tasks, TagsView, TasksView, TimelineView, StatusBarView) ->
				App.tags = new Tags()
				App.tasks = new Tasks()

				App.tagsView = new TagsView
					el: $("#tagsList")

				App.tasksView = new TasksView
					el: $("#tasks")

				App.timelineView = new TimelineView
					el: $("#timeline")

				App.statusBarView = new StatusBarView
					el: $("#statusBar")

				
				$.when(App.tags.fetch(), App.tasks.fetch()).done(App.onLoad)

		onLoad: ->
			App.router = new AppRouter()
			Backbone.history.start()

	AppRouter = Backbone.Router.extend
		routes:
			'date/:date': 'date'
			'date/:date/tags/*tags': 'dateTags'
			'tags/*tags': 'tags'

		date: (date) ->
			App.tasksView.setFilterDate(date)
			App.tasksView.applyFilter()

		dateTags: (date, tags) ->
			App.tasksView.setFilterDate(date)
			App.tasksView.addFilterTags(tags.split('/'))
			App.tasksView.applyFilter()

		tags: (tags) ->
			App.tasksView.addFilterTags(tags.split('/'))
			App.tasksView.applyFilter()

	App