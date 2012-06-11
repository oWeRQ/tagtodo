define [
	'underscore'
	'backbone'
	'models/task'
], (_, Backbone, Task) ->
	Tasks = Backbone.Collection.extend
		model: Task
		url: scriptUrl+'/api/tasks'
		comparator: (a, b) ->
			a_weight = a.getWeight()
			b_weight = b.getWeight()

			if a_weight == b_weight
				0
			else if a_weight > b_weight
				1
			else if a_weight < b_weight
				-1

		countByDay: (taskIds) ->
			count = {}
			this.each (task) ->
				if taskIds.length and _.indexOf(taskIds, task.id) is -1
					return

				deadline = task.get('deadline')

				if not count[deadline]
					count[deadline] = 
						total: 0
						undone: 0

				count[deadline].total++
				
				if not task.isDone()
					count[deadline].undone++

			count

	Tasks