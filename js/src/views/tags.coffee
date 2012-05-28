define [
	'underscore'
	'backbone'
	'app'
	'views/tag'
], (_, Backbone, App, TagView) ->
	TagsView = Backbone.View.extend
		initialize: ->
			App.tags.on('add', this.addOne, this)
			App.tags.on('reset', this.addAll, this)

		addOne: (tag) ->
			view = new TagView(model: tag)
			idx = _.indexOf(App.tags.models, tag)
			if (idx <= 0)
				this.$el.prepend(view.render().el)
			else
				prevTag = App.tags.models[idx-1].view.$el
				prevTag.after(view.render().el)

		addAll: ->
			App.tags.each(this.addOne, this)

	TagsView