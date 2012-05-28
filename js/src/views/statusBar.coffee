define [
	'underscore'
	'backbone'
	'app'
], (_, Backbone, App) ->
	StatusBarView = Backbone.View.extend
		events:
			'click .updateTime': 'update'

		updateTimestamp: 0
		initialize: ->
			time = new Date()
			this.updateTime = this.$('.updateTime').text(this.formatTime(time))
			this.updateTimestamp = Math.floor(time.getTime() / 1000)

		formatTime: (time) ->
			hours = (if time.getHours()<10 then '0' else '')+time.getHours()
			minutes = (if time.getMinutes()<10 then '0' else '')+time.getMinutes()
			hours+':'+minutes

		update: ->
			App.tags.fetch
				add: true
				url: App.tags.url+'?ts='+this.updateTimestamp

			App.tasks.fetch
				add: true
				url: App.tasks.url+'?ts='+this.updateTimestamp

			time = new Date()
			this.updateTime.text(this.formatTime(time))
			this.updateTimestamp = Math.floor(time.getTime() / 1000)

	StatusBarView