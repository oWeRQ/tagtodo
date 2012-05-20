define([
	'underscore',
	'backbone',
	'app',
	'text!templates/task.html'
], function(_, Backbone, App, taskTemplate) {
	var TaskView = Backbone.View.extend({
		template: _.template(taskTemplate),
		tagName: 'li',
		events: {
			'change .status': 'changeStatus',
			'change .body': 'changeBody',
			'change .deadline': 'changeDeadline',
			'blur .body': 'cancelBody',
			'click .bodyText': 'editBody',
			'click .delete': 'destroy'
		},
		initialize: function(){
			this.$el.data('id', this.model.id);
			this.model.on('change:tags', this.changeTags, this);
			this.model.on('change:tags', this.updateBodyText, this);
			this.model.on('change:body', this.updateBodyText, this);
			this.model.on('destroy', this.remove, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.status = this.$('.status');
			this.bodyText = this.$('.bodyText');
			this.body = this.$('.body');
			this.deadline = this.$('.deadline');
			this.deadline.datepicker({
				dateFormat: 'yy-mm-dd'
			});
			this.updateBodyText();
			return this;
		},
		updateBodyText: function(){
			var body = this.model.get('body');

			this.model.getTags().each(function(tag){
				var hashTag = '#'+tag.get('name');
				body = body.replace(hashTag, '<span class="tag" style="background:white;color:'+tag.getColor()+'">'+hashTag+'</span>');
			});

			this.bodyText.html(body);
		},
		cancelBody: function(){
			this.bodyText.show();
			this.body.hide();
		},
		editBody: function(){
			this.bodyText.hide();
			this.body.show().focus();
		},
		changeStatus: function(){
			var checked = this.status.prop('checked');

			this.bodyText.toggleClass('done', checked);

			this.model.save({
				status: +checked
			});
		},
		changeBody: function(){
			var body = this.body.val();
			if (body != this.model.get('body')) {
				this.model.save({
					body: body
				});
			}
		},
		changeDeadline: function(){
			var deadline = this.deadline.val();
			if (deadline != this.model.get('deadline')) {
				this.model.save({
					deadline: deadline
				});
			}
		},
		changeTags: function(){
			//this.model.save();
		},
		destroy: function(e){
			e.preventDefault();
			if (confirm('Delete?'))
				this.model.destroy();
		}
	});
	return TaskView;
});