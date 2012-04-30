<?php
Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/flick/jquery-ui-1.8.19.custom.css');
Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/tasks.css');

Yii::app()->clientScript->registerScript('baseUrl',
	"var baseUrl = ".CJavaScript::encode(Yii::app()->request->baseUrl).";\n"
	."var scriptUrl = ".CJavaScript::encode(Yii::app()->request->scriptUrl).";",
	CClientScript::POS_HEAD);
?>

<script data-main="js/main" src="<?=Yii::app()->baseUrl?>/js/libs/require/require.js"></script>

<ul id="tagsList"></ul>

<div id="timeline">
	<div class="timelineMonth">
		<span class="prevMonth">&larr;</span>
		<span class="currentMonth">Апрель 2012</span>
		<span class="nextMonth">&rarr;</span>
	</div>
	<ul class="timelineList"></ul>
</div>

<div id="tasks">
	<ul class="tasks"></ul>

	<form class="newTask" action="/task" method="post">
		<input type="text" class="body" name="body">
		<input type="text" class="deadline" value="" placeholder="deadline">
		<input type="submit" class="submit" value="&crarr;">
	</form>
</div>
