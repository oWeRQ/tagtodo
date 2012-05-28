// Generated by CoffeeScript 1.3.3
(function() {

  define(['underscore', 'backbone', 'app', 'text!templates/task.html'], function(_, Backbone, App, taskTemplate) {
    var TaskView;
    TaskView = Backbone.View.extend({
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
      initialize: function() {
        this.$el.data('id', this.model.id);
        this.model.on('change:tags', this.changeTags, this);
        this.model.on('change:tags', this.updateBodyText, this);
        this.model.on('change:body', this.updateBodyText, this);
        return this.model.on('destroy', this.remove, this);
      },
      render: function() {
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
      updateBodyText: function() {
        var body;
        body = this.model.get('body');
        this.model.getTags().each(function(tag) {
          var hashTag;
          hashTag = '#' + tag.get('name');
          return body = body.replace(hashTag, '<span class="tag" style="background:white;color:' + tag.getColor() + '">' + hashTag + '</span>');
        });
        return this.bodyText.html(body);
      },
      cancelBody: function() {
        this.bodyText.show();
        return this.body.hide();
      },
      editBody: function() {
        this.bodyText.hide();
        return this.body.show().focus();
      },
      changeStatus: function() {
        var checked;
        checked = this.status.prop('checked');
        this.bodyText.toggleClass('done', checked);
        return this.model.save({
          status: +checked
        });
      },
      changeBody: function() {
        var body;
        body = this.body.val();
        if (body !== this.model.get('body')) {
          return this.model.save({
            body: body
          });
        }
      },
      changeDeadline: function() {
        var deadline;
        deadline = this.deadline.val();
        if (deadline !== this.model.get('deadline')) {
          return this.model.save({
            deadline: deadline
          });
        }
      },
      changeTags: function() {},
      destroy: function(e) {
        e.preventDefault();
        if (confirm('Delete?')) {
          return this.model.destroy();
        }
      }
    });
    return TaskView;
  });

}).call(this);
