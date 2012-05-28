define [
	'underscore'
	'backbone'
	'app'
], (_, Backbone, App) ->
	TaskFormView = Backbone.View.extend
		events:
			'focus .body': 'bodyFocus'
			'blur .body': 'bodyBlur'
			'submit': 'submit'

		initialize: ->
			this.body = this.$('.body')
			this.deadline = this.$('.deadline')
			this.deadline.datepicker(dateFormat: 'yy-mm-dd')

		bodyFocus: ->
			if this.body.val() is ''
				this.body.val(this.body.attr('placeholder'))

		bodyBlur: ->
			if this.body.val() is this.body.attr('placeholder')
				this.body.val('')

		submit: (e) ->
			e.preventDefault()

			deadline = this.deadline.val().trim()
			if deadline is '' and App.tasksView.currentDate isnt null
				deadline = App.tasksView.currentDate

			App.tasks.create
				body: this.body.val()
				deadline: deadline
			,
				wait: true

			this.body.val(this.body.attr('placeholder'))
			this.deadline.val('')
	
	TaskFormView