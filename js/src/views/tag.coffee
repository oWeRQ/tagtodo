define [
	'underscore'
	'backbone'
	'app'
	'text!templates/tag.html'
], (_, Backbone, App, tagTemplate) ->
	TagView = Backbone.View.extend
		template: _.template(tagTemplate)
		tagName: 'li'
		events:
			'click': 'toggle'

		active: false
		initialize: ->
			this.model.view = this
			this.model.on('destroy', this.remove, this)
			this.model.on('change:tasks', this.updateCount, this)

		render: ->
			this.$el.html(this.template(
				_.extend(this.model.toJSON(), {
					color: this.model.getColor()
				})
			));
			this.count = this.$('.count')
			this

		updateCount: ->
			this.count.html(this.model.get('tasks').length)

		setActive: (active) ->
			this.active = active
			this.$el.toggleClass('active', active)

		toggle: ->
			this.setActive(!this.active)

			if (this.active)
				App.tasksView.addFilterTags(this.model)
			else
				App.tasksView.removeFilterTag(this.model)

			App.tasksView.applyFilter()

	TagView