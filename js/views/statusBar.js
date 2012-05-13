define([
	'underscore',
	'backbone',
	'app'
], function(_, Backbone, App) {
	var StatusBarView = Backbone.View.extend({
		events: {
			'click .update': 'update'
		},
		updateTimestamp: 0,
		initialize: function(){
			var time = new Date();
			this.updateTime = this.$('.updateTime').text(this.formatTime(time));
			this.updateTimestamp = Math.floor(time.getTime() / 1000);
		},
		formatTime: function(time){
			return (time.getHours()<10?'0':'')+time.getHours()+
				':'+(time.getMinutes()<10?'0':'')+time.getMinutes();
		},
		update: function(){
			App.tags.fetch({
				add: true,
				url: App.tags.url+'?ts='+this.updateTimestamp
			});
			App.tasks.fetch({
				add: true,
				url: App.tasks.url+'?ts='+this.updateTimestamp
			});
			var time = new Date();
			this.updateTime.text(this.formatTime(time));
			this.updateTimestamp = Math.floor(time.getTime() / 1000);
		}
	});
	return StatusBarView;
});