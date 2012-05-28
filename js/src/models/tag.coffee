define [
	'underscore'
	'backbone'
	'app'
], (_, Backbone, App) ->
	crc16 = (str) ->
		crc = 0xFFFF
		for c in [0...str.length]
			crc ^= str.charCodeAt(c) << 8
			for i in [0...8]
				if crc & 0x8000
					crc = (crc << 1) ^ 0x1021
				else
					crc = crc << 1
		crc & 0xFFFF

	str2color = (str) ->
		hue = Math.floor(crc16(str)/0xFFFF*18)*20
		saturation = 45
		lightness = 40

		'hsl('+hue+','+saturation+'%,'+lightness+'%)'

	Tag = Backbone.Model.extend
		idAttribute: 'id'
		defaults:
			name: ''
			count: 0
			tasks: []

		initialize: ->
			this.on('destroy', this.clearTags, this)

		addTask: (task_id) ->
			tagTasks = this.get('tasks')
			if _.indexOf(tagTasks, task_id) is -1
				tagTasks.push(task_id)
				this.set('tasks', tagTasks)
				this.trigger('change:tasks')

		removeTask: (task_id) ->
			tagTasks = this.get('tasks')
			tagTasks = _.without(tagTasks, task_id)
			if tagTasks.length is 0
				this.destroy()
			else
				this.set('tasks', tagTasks)

		clearTags: ->
			idx = _.indexOf(App.tasksView.currentTags, this)
			if idx isnt -1
				App.tasksView.currentTags.splice(idx, 1)
				App.tasksView.applyFilter()

		getColor: ->
			str2color(this.get('name'))

	Tag