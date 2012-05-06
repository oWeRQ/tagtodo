define([
	'underscore',
	'backbone',
	'app',
	'text!templates/tag.html'
], function(_, Backbone, App, tagTemplate) {
	function crc8(str) {
		var crc = 0xFF;
		for (var c = 0; c < str.length; c++) {
			crc ^= str.charCodeAt(c);
			for (var i = 0; i < 8; i++)
				crc = crc & 0x80 ? (crc << 1) ^ 0x31 : crc << 1;
		}
		return crc & 0xFF;
	}
	
	function crc16(str) {
		var crc = 0xFFFF;
		for (var c = 0; c < str.length; c++) {
			crc ^= str.charCodeAt(c) << 8;
			for (var i = 0; i < 8; i++)
				crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
		}
		return crc & 0xFFFF;
	}

	function str2color(str) {
		var hue = crc16(str) % 360,
			saturation = 35,
			lightness = 65;
		//hue = Math.floor(crc8(str)/0xFF*360);
		//hue = Math.floor(crc16(str)/0xFFFF*360);
		return 'hsl('+hue+','+saturation+'%,'+lightness+'%)';
	}

	var TagView = Backbone.View.extend({
		template: _.template(tagTemplate),
		tagName: 'li',
		events: {
			'click': 'toggle'
		},
		active: false,
		initialize: function(){
			this.model.view = this;
			this.model.on('destroy', this.remove, this);
			this.model.on('change:tasks', this.updateCount, this);
		},
		render: function() {
			var color = str2color(this.model.get('name'));
			this.$el.html(this.template(
				_.extend(this.model.toJSON(), {
					color: color
				})
			));
			this.count = this.$('.count');
			return this;
		},
		updateCount: function(){
			this.count.html(this.model.get('tasks').length);
		},
		setActive: function(active){
			this.active = active;
			this.$el.toggleClass('active', active);
		},
		toggle: function(){
			this.setActive(!this.active);

			if (this.active)
				App.tasksView.addFilterTags(this.model);
			else
				App.tasksView.removeFilterTag(this.model);

			App.tasksView.applyFilter();
		}
	});
	return TagView;
});