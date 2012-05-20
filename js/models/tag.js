define([
	'underscore',
	'backbone',
	'app'
], function(_, Backbone, App) {
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
		var hue = Math.floor(crc16(str)/0xFFFF*18)*20,
			saturation = 45,
			lightness = 40;

		return 'hsl('+hue+','+saturation+'%,'+lightness+'%)';
	}

	var Tag = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			name: '',
			count: 0,
			tasks: []
		},
		initialize: function(){
			this.on('destroy', this.clearTags, this);
		},
		addTask: function(task_id){
			var tagTasks = this.get('tasks');
			if (_.indexOf(tagTasks, task_id) === -1) {
				tagTasks.push(task_id);
				this.set('tasks', tagTasks);
				this.trigger('change:tasks');
			}
		},
		removeTask: function(task_id){
			var tagTasks = this.get('tasks');
			tagTasks = _.without(tagTasks, task_id);
			if (tagTasks.length === 0)
				this.destroy();
			else
				this.set('tasks', tagTasks);
		},
		clearTags: function(){
			var idx = _.indexOf(App.tasksView.currentTags, this);
			if (idx !== -1) {
				App.tasksView.currentTags.splice(idx, 1);
				App.tasksView.applyFilter();
			}
		},
		getColor: function(){
			return str2color(this.get('name'));
		}
	});
	return Tag;
});