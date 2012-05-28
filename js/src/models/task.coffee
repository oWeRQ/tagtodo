define [
	'underscore'
	'backbone'
	'app'
	'collections/tags'
], (_, Backbone, App, Tags) ->
	Task = Backbone.Model.extend
		idAttribute: 'id'
		defaults:
			status: 0
			body: ''
			tags: []
			deadline: '0000-00-00'
			weight: 0

		view: null
		initialize: ->
			this.on('change:tags', this.changeTags, this)
			this.on('change:body', this.parseTags, this)
			this.on('add', this.parseTags, this)
			this.on('destroy', this.clearTags, this)

		getWeight: ->
			parseInt(this.get('weight'), 10) || this.id*1024

		getTags: ->
			new Tags(_.map(this.get('tags'), App.tags.get, App.tags))

		parseTags: ->
			task = this
			newTags = []

			createTagsTotal = 0
			createTagsDone = 0
			fireSet = ->
				if createTagsTotal is 0 or createTagsDone is createTagsTotal
					task.set('tags', newTags)
					return true

				false

			_.each this.get('body').match(/#([^\s]+)/g), (hashTag) ->
				tagName = hashTag.substr(1)
				if tagName.length is 0
					return

				tag = App.tags.where({name: tagName})[0]

				if tag
					newTags.push(tag.id)
				else
					createTagsTotal++
					App.tags.create name: tagName, tasks: [],
						wait: true
						success: (tag) ->
							newTags.push(tag.id)
							createTagsDone++
							fireSet()
			fireSet()

		changeTags: ->
			oldTags = this.previous('tags')
			newTags = this.get('tags')

			addedTags = _.difference(newTags, oldTags)
			removedTags = _.difference(oldTags, newTags)

			_.each(addedTags, this.addTag, this)
			_.each(removedTags, this.removeTag, this)

			this.save null,
				silent: true
				success: ->

		clearTags: ->
			_.each(this.get('tags'), this.removeTag, this)

		addTag: (tag_id) ->
			tag = App.tags.get(tag_id)
			tag.addTask(this.id)

		removeTag: (tag_id) ->
			tag = App.tags.get(tag_id);
			tag.removeTask(this.id);
	
	Task