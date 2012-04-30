define([
	'underscore',
	'backbone',
	'app'
], function(_, Backbone, App) {
	var TaskFormView = Backbone.View.extend({
		events: {
			'focus .body': 'focus',
			'blur .body': 'blur',
			'submit': 'submit'
		},
		initialize: function(){
			this.body = this.$('.body');
			this.deadline = this.$('.deadline');
			this.deadline.datepicker({
				dateFormat: 'yy-mm-dd'
			});
		},
		focus: function(){
			if (this.body.val() === '')
				this.body.val(this.body.attr('placeholder'));
		},
		blur: function(){
			if (this.body.val() === this.body.attr('placeholder'))
				this.body.val('');
		},
		submit: function(e){
			e.preventDefault();

			App.tasks.create({
				body: this.body.val(),
				deadline: this.deadline.val()
			}, {
				wait: true
			});

			this.body.val(this.body.attr('placeholder'));
			this.deadline.val('');
		}
	});
	return TaskFormView;
});