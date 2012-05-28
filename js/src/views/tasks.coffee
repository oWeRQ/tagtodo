define [
	'underscore'
	'backbone'
	'app'
	'models/tag'
	'views/task'
	'views/taskForm'
], (_, Backbone, App, Tag, TaskView, TaskFormView) ->
	TasksView = Backbone.View.extend
		currentDate: null
		currentTags: []
		initialize: ->
			this.tasksList = this.$('ul.tasks')

			App.tasks.on('add', this.addOne, this)
			App.tasks.on('reset', this.addAll, this)
			App.tasks.on('change', this.applyFilter, this)
			App.tasks.on('add', this.applyFilter, this)
			App.tasks.on('remove', this.applyFilter, this)

			this.newTask = new TaskFormView
				el: this.$('form.newTask')

			this.tasksList.sortable
				axis: 'y'
				handle: '.sortable-handle'
				update: (event, ui) ->
					task_id = ui.item.data('id')
					prev_id = ui.item.prev().data('id')
					next_id = ui.item.next().data('id')

					prev_weight = if prev_id then App.tasks.get(prev_id).getWeight() else 0
					next_weight = if next_id then App.tasks.get(next_id).getWeight() else prev_id+1024

					if !prev_id && next_id
						prev_weight = next_weight-1024

					App.tasks.get(task_id).save
						weight: prev_weight+(next_weight-prev_weight)/2
		
		addOne: (task) ->
			task.view = new TaskView(model: task)
			this.tasksList.append(task.view.render().el)
		
		addAll: ->
			this.tasksList.empty()
			App.tasks.each(this.addOne, this)
		
		getCurrentTagsTaskIds: ->
			if this.currentTags.length 
				_.intersection.apply this,
					_.map this.currentTags, (tag) ->
						if tag then tag.get('tasks') else []
			else
				[]
		
		updateNavigate: ->
			navigate = []

			if this.currentDate
				navigate.push('date/'+this.currentDate)
				this.newTask.deadline.attr('placeholder', this.currentDate)
			else
				this.newTask.deadline.attr('placeholder', 'deadline')

			if this.currentTags.length
				currentTagNames = _.map this.currentTags, (tag) ->
					tag.get('name')

				navigate.push('tags/'+currentTagNames.join('/'))
				this.newTask.body.attr('placeholder', '#'+currentTagNames.join(' #')+' ')
			else
				this.newTask.body.attr('placeholder', '')

			App.router.navigate(navigate.join('/'))
		
		applyFilter: ->
			_.each this.currentTags, (tag) ->
				tag.view.setActive(true)

			tagsTaskIds = this.getCurrentTagsTaskIds()

			App.tasks.each (task) ->
				if !task.view
					return
				isTagsTask = this.currentTags.length is 0 || _.indexOf(tagsTaskIds, task.id) isnt -1
				isDate = !this.currentDate || task.get('deadline') is this.currentDate
				task.view.$el.toggle(isTagsTask && isDate)
			, this

			App.timelineView.render()
			this.updateNavigate()

			this
		
		addFilterTags: (tags) ->
			if !(tags instanceof Tag)
				tags = _.compact _.map tags, (tag) ->
					if !(tag instanceof Tag)
						if (_.isString(tag))
							tag = App.tags.where({name: decodeURIComponent(tag)})[0]
						else
							return null
					tag

			this.currentTags = _.union(this.currentTags, tags)
		
		removeFilterTag: (tag) ->
			this.currentTags = _.without(this.currentTags, tag)
		
		setFilterDate: (date) ->
			this.currentDate = date

	TasksView