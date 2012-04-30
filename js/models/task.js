define([
	'underscore',
	'backbone',
	'app',
	'collections/tags'
], function(_, Backbone, App, Tags) {
	var Task = Backbone.Model.extend({
		idAttribute: 'id',
		defaults: {
			status: 0,
			body: '',
			tags: [],
			deadline: '0000-00-00'
		},
		view: null,
		initialize: function(){
			this.on('change:tags', this.changeTags, this);
			this.on('change:body', this.parseTags, this);
			this.on('add', this.parseTags, this);
			this.on('destroy', this.clearTags, this);
		},
		getTags: function(){
			return new Tags(_.map(this.get('tags'), App.tags.get, App.tags));
		},
		parseTags: function(){
			var task = this;
			var newTags = [];

			var createTagsTotal = 0;
			var createTagsDone = 0;
			var fireSet = function(){
				if (createTagsTotal === 0 || createTagsDone === createTagsTotal) {
					task.set('tags', newTags);
					return true;
				}
				return false;
			};

			_.each(this.get('body').match(/#([^\s]+)/g), function(hashTag){
				var tagName = hashTag.substr(1);
				if (tagName.length === 0)
					return;

				var tag = App.tags.where({name: tagName})[0];

				if (tag) {
					newTags.push(tag.id);
				} else {
					createTagsTotal++;
					App.tags.create({name: tagName, tasks: []}, {
						wait: true,
						success: function(tag){
							newTags.push(tag.id);
							createTagsDone++;
							fireSet();
						}
					});
				}
			});
			fireSet();
		},
		changeTags: function(){
			var oldTags = this.previous('tags');
			var newTags = this.get('tags');

			var addedTags = _.difference(newTags, oldTags);
			var removedTags = _.difference(oldTags, newTags);

			_.each(addedTags, this.addTag, this);
			_.each(removedTags, this.removeTag, this);

			this.save(null, {
				silent: true,
				success: function(){}
			});
		},
		clearTags: function(){
			_.each(this.get('tags'), this.removeTag, this);
		},
		addTag: function(tag_id){
			var tag = App.tags.get(tag_id);
			tag.addTask(this.id);
		},
		removeTag: function(tag_id){
			var tag = App.tags.get(tag_id);
			tag.removeTask(this.id);
		}
	});
	return Task;
});