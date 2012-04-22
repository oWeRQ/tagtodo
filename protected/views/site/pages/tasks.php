<?php
Yii::app()->clientScript->registerScript('baseUrl',
	"var baseUrl = ".CJavaScript::encode(Yii::app()->request->baseUrl).";\n"
	."var scriptUrl = ".CJavaScript::encode(Yii::app()->request->scriptUrl).";",
	CClientScript::POS_HEAD);
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/jquery-min.js');
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/underscore.js');
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/backbone.js');
//Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/backbone-relational.js');
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/tasks.js');
Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/tasks.css');
?>

<script type="text/html" id="tagTemplate">
	<span class="name">#<%=name%></span>
	<span class="count"><%=tasks.length%></span>
</script>
<ul id="tagsList"></ul>

<div id="tasks">
	<ul class="breadcrumbs">
		<li class="showAll">Все</li>
		<li class="tag"></li>
	</ul>

	<script type="text/html" id="taskTemplate">
		<input type="checkbox" class="status" <%=status==1?'checked':''%>>
		<input type="text" class="body <%=status==1?'done':''%>" value="<%=body%>">
		<a href="#" class="delete">&times;</a>
	</script>

	<ul class="tasks"></ul>

	<form class="newTask" action="/task" method="post">
		<input type="text" class="body" name="body">
		<!-- <input type="text" class="tags" name="tags"> -->
		<input type="submit" class="submit" value="&crarr;">
	</form>
</div>
