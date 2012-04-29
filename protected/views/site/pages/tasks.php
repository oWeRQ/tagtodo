<?php
Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/tasks.css');

Yii::app()->clientScript->registerScript('baseUrl',
	"var baseUrl = ".CJavaScript::encode(Yii::app()->request->baseUrl).";\n"
	."var scriptUrl = ".CJavaScript::encode(Yii::app()->request->scriptUrl).";",
	CClientScript::POS_HEAD);
?>

<script data-main="js/main" src="<?=Yii::app()->baseUrl?>/js/libs/require/require.js"></script>

<ul id="tagsList"></ul>

<div id="tasks">
	<ul class="breadcrumbs">
		<li class="showAll">Все</li>
		<li class="tag"></li>
	</ul>

	<ul class="tasks"></ul>

	<form class="newTask" action="/task" method="post">
		<input type="text" class="body" name="body">
		<input type="submit" class="submit" value="&crarr;">
	</form>
</div>
