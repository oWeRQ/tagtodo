define([
	'underscore',
	'backbone',
	'app'
], function(_, Backbone, App) {
	var TaskFormView = Backbone.View.extend({
		events: {
			'focus .body': 'bodyFocus',
			'blur .body': 'bodyBlur',
			'submit': 'submit'
		},
		initialize: function(){
			this.body = this.$('.body');
			this.deadline = this.$('.deadline');
			this.deadline.datepicker({
				dateFormat: 'yy-mm-dd'
			});
		},
		bodyFocus: function(){
			if (this.body.val() === '')
				this.body.val(this.body.attr('placeholder'));
		},
		bodyBlur: function(){
			if (this.body.val() === this.body.attr('placeholder'))
				this.body.val('');
		},
		submit: function(e){
			e.preventDefault();

			var deadline = this.deadline.val().trim();
			if (deadline === '' && App.tasksView.currentDate !== null)
				deadline = App.tasksView.currentDate;

			App.tasks.create({
				body: this.body.val(),
				deadline: deadline
			}, {
				wait: true
			});

			this.body.val(this.body.attr('placeholder'));
			this.deadline.val('');
		}
	});
	return TaskFormView;
});