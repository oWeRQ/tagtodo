define [
	'underscore',
	'backbone',
	'app',
	'text!templates/task.html'
], (_, Backbone, App, taskTemplate) ->
	TaskView = Backbone.View.extend
		template: _.template(taskTemplate)
		tagName: 'li'
		events:
			'change .status': 'changeStatus'
			'change .body': 'changeBody'
			'change .deadline': 'changeDeadline'
			'blur .body': 'cancelBody'
			'click .bodyText': 'editBody'
			'click .delete': 'destroy'

		initialize: ->
			this.$el.data('id', this.model.id)
			this.model.on('change:tags', this.changeTags, this)
			this.model.on('change:tags', this.updateBodyText, this)
			this.model.on('change:body', this.updateBodyText, this)
			this.model.on('change:deadline', this.updateDeadlineText, this)
			this.model.on('destroy', this.remove, this)

		render: ->
			this.$el.html(this.template(this.model.toJSON()))
			this.status = this.$('.status')
			this.bodyText = this.$('.bodyText')
			this.body = this.$('.body')
			this.deadline = this.$('.deadline')
			this.deadline.datepicker(dateFormat: 'yy-mm-dd')
			this.updateBodyText()
			this

		updateBodyText: ->
			body = this.model.get('body')

			this.model.getTags().each (tag) ->
				tagName = tag.get('name')
				return if tagName is ''
				hashTag = '#'+tagName
				body = body.replace(hashTag, '<span class="tag" style="background:white;color:'+tag.getColor()+'">'+hashTag+'</span>')

			this.bodyText.html(body)

		updateDeadlineText: ->
			this.deadline.val this.model.get('deadline')

		cancelBody: ->
			this.bodyText.show()
			this.body.hide()

		editBody: ->
			this.bodyText.hide()
			this.body.show().focus()

		changeStatus: ->
			checked = this.status.prop('checked')

			this.bodyText.toggleClass('done', checked)

			this.model.save(status: +checked)

		changeBody: ->
			body = this.body.val()
			if body != this.model.get('body')
				this.model.save(body: body)

		changeDeadline: ->
			deadline = this.deadline.val()
			if deadline != this.model.get('deadline')
				this.model.save(deadline: deadline)

		changeTags: ->
			#this.model.save();

		destroy: (e) ->
			e.preventDefault()
			if confirm('Delete?')
				this.model.destroy()

	TaskView