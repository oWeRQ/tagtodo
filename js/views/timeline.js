define([
	'underscore',
	'backbone',
	'app',
	'text!templates/timelineDay.html'
], function(_, Backbone, App, dayTemplate) {
	var TimelineView = Backbone.View.extend({
		dayTemplate: _.template(dayTemplate),
		events: {
			'click .currentMonth': 'setCurrentMonth',
			'click .prevMonth': 'prevMonth',
			'click .nextMonth': 'nextMonth',
			'click li': 'showDay'
		},
		year: 0,
		month: 0,
		initialize: function(){
			var date = new Date();
			this.year = date.getFullYear();
			this.month = date.getMonth();

			this.currentMonth = this.$('.currentMonth');
			this.timelineList = this.$('.timelineList');

			App.tasks.on('reset', this.render, this);
			App.tasks.on('change:deadline', this.render, this);
		},
		render: function() {
			var date = new Date(this.year, this.month, 0);
			var dateAtom;
			var daysInMonth = date.getDate();
			var countByDay = App.tasks.countByDay();
			var maxByDay = _.reduce(countByDay, function(memo, num){
				return memo > num ? memo : num;
			}, 0);

			this.currentMonth.html($.datepicker.formatDate('MM yy', date));
			this.timelineList.empty();
			for (var day=1; day <= daysInMonth; day++) {
				date = new Date(this.year, this.month-1, day);
				dateAtom = $.datepicker.formatDate($.datepicker.ATOM, date);

				var isWeekend = date.getDay()%6 === 0;
				var dayCount = countByDay[dateAtom];

				var li = $('<li>').data('date', dateAtom).html(this.dayTemplate({
					day: day,
					percent: (dayCount ? dayCount/maxByDay*100 : 0)
				}));

				if (dayCount)
					li.attr('title', 'Tasks: '+dayCount);
				
				li.toggleClass('weekend', isWeekend).appendTo(this.timelineList);
			}
			return this;
		},
		setCurrentMonth: function(){
			var date = new Date();
			this.year = date.getFullYear();
			this.month = date.getMonth();
			this.render();
		},
		prevMonth: function(){
			if (--this.month === 0) {
				this.year--;
				this.month = 12;
			}
			this.render();
		},
		nextMonth: function(){
			if (++this.month === 13) {
				this.year++;
				this.month = 1;
			}
			this.render();
		},
		showDay: function(e){
			var li = $(e.target).closest('li');
			var date = li.data('date');
			if (li.hasClass('active')) {
				li.removeClass('active');
				App.tasksView.showAll();
			} else {
				li.addClass('active').siblings().removeClass('active');
				App.tasksView.filterByDate(date);
			}
		}
	});
	return TimelineView;
});