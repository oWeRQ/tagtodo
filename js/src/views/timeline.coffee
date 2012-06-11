define [
	'underscore'
	'backbone'
	'app'
	'text!templates/timelineDay.html'
], (_, Backbone, App, dayTemplate) ->
	TimelineView = Backbone.View.extend
		dayTemplate: _.template(dayTemplate)
		events:
			'click .currentMonth': 'setCurrentMonth'
			'click .prevMonth': 'prevMonth'
			'click .nextMonth': 'nextMonth'
			'click li': 'showDay'

		year: 0
		month: 0
		initialize: ->
			date = new Date()
			this.year = date.getFullYear()
			this.month = date.getMonth()+1

			this.currentMonth = this.$('.currentMonth')
			this.timelineList = this.$('.timelineList')

			App.tasks.on('reset', this.render, this)
			App.tasks.on('change:deadline', this.render, this)

		render: ->
			currentDate = App.tasksView.currentDate
			today = $.datepicker.formatDate($.datepicker.ATOM, new Date())
			date = new Date(this.year, this.month, 0)
			daysInMonth = date.getDate()
			
			tagsTaskIds = App.tasksView.getCurrentTagsTaskIds()
			countByDay = App.tasks.countByDay(tagsTaskIds)
			maxByDay = _.reduce countByDay, (memo, num) ->
				if memo > num.total then memo else num.total
			, 0

			this.currentMonth.html($.datepicker.formatDate('MM, yy', date))
			this.timelineList.find('li').droppable 'destroy'
			this.timelineList.empty()

			for day in [1..daysInMonth]
				date = new Date(this.year, this.month-1, day)
				dateAtom = $.datepicker.formatDate($.datepicker.ATOM, date)

				isWeekend = date.getDay()%6 is 0
				isToday = dateAtom is today

				dayTotalTasks = countByDay[dateAtom]?.total
				dayUndoneTasks = countByDay[dateAtom]?.undone

				li = $('<li>').data('date', dateAtom).html this.dayTemplate
					day: day
					totalPercent: (if dayTotalTasks then dayTotalTasks/maxByDay*100 else 0)
					undonePercent: (if dayUndoneTasks then dayUndoneTasks/maxByDay*100 else 0)

				if dayTotalTasks
					li.attr('title', 'Total: '+dayTotalTasks+' Undone: '+dayUndoneTasks)

				if dateAtom is currentDate
					li.addClass('active')
				
				li.toggleClass('weekend', isWeekend).toggleClass('today', isToday).appendTo(this.timelineList)

				li.droppable
					tolerance: 'pointer'
					hoverClass: 'droppable-hover'
					drop: (event, ui) ->
						targetDate = $(event.target).data('date')
						task = App.tasks.get(ui.draggable.data('id'))
						task.save deadline: targetDate

			this

		setCurrentMonth: ->
			date = new Date()
			this.year = date.getFullYear()
			this.month = date.getMonth()+1
			this.render()

		prevMonth: ->
			if --this.month is 0
				this.year--
				this.month = 12

			this.render()

		nextMonth: ->
			if ++this.month is 13
				this.year++
				this.month = 1

			this.render()

		showDay: (e) ->
			li = $(e.target).closest('li')
			date = li.data('date')
			if li.hasClass('active')
				li.removeClass('active')
				App.tasksView.setFilterDate(null)
				App.tasksView.applyFilter()
			else
				li.addClass('active').siblings().removeClass('active')
				App.tasksView.setFilterDate(date)
				App.tasksView.applyFilter()

	TimelineView