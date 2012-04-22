<?php
Yii::app()->clientScript->registerScript('baseUrl',
	"var baseUrl = ".CJavaScript::encode(Yii::app()->request->baseUrl).";\n"
	."var scriptUrl = ".CJavaScript::encode(Yii::app()->request->scriptUrl).";",
	CClientScript::POS_HEAD);
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/jquery-min.js');
//Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/jquery-ui.min.js');
//Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/tag-it.js');
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/underscore.js');
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/backbone.js');
//Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/backbone-relational.js');
Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/js/tasks.js');

//Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/jquery-ui.css');
//Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/jquery.tagit.css');
//Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/tagit.ui-zendesk.css');
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

<style type="text/css">
	.breadcrumbs {
		margin: 0 4px 8px;
		padding: 0;
	}
	.breadcrumbs li {
		list-style: none;
		display: inline-block;
		color: #0066CC;
		cursor: pointer;
	}
	.breadcrumbs li:before {
		content: '/ ';
		vertical-align: middle;
		color: #666;
		font-size: 1.2em;
	}
	.breadcrumbs li:hover {
		color: #0099ff;
	}

	ul.tasks {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	ul.tasks input.status {
		vertical-align: middle;
	}
	ul.tasks input.body,
	form.newTask input.body {
		padding: 3px 0;
		width: 400px;
		border: none;
		border-bottom: 1px solid #ddd;
	}
	ul.tasks input.body:focus,
	form.newTask input.body:focus {
		background: #f9f9f9;
		border-bottom-color: #c0c0c0;
	}
	/*form.newTask input.tags {
		color: #666;
		padding: 2px 8px;
		border: 1px solid #c0c0c0;
		border-radius: 10px;
		box-shadow: inset 0 2px 4px #e6e6e6;
	}*/
	ul.tasks input.body.done {
		font-style: italic;
		text-decoration: line-through;
	}
	ul.tasks a.delete {
		vertical-align: middle;
		color: #ddd;
		font-size: 20px;
		text-decoration: none;
	}
	ul.tasks a.delete:hover {
		color: gray;
	}
	form.newTask {
		padding-left: 25px;
	}
	form.newTask .submit {
		display: none;
		vertical-align: bottom;
		margin-left: -4px;
		padding: 1px 2px;
		color: #666;
		background: #f9f9f9;
		background: #f0f0f0;
		border: none;
		border-bottom: 1px solid #c0c0c0;
		border-right: 1px solid #c0c0c0;
	}
	form.newTask input.body {
		color: #aaa;
	}
	form.newTask input.body:focus {
		color: #3C3C3C;
	}
	form.newTask input.body:focus + .submit {
		display: inline;
	}

	#tasks {
		overflow: auto;
	}

	#tagsList {
		float: left;
		list-style: none;
		margin-right: 20px;
		padding: 0;
		width: 100px;
	}
	#tagsList li {
		margin-bottom: 6px;
		padding-left: 6px;
		border-radius: 4px;
		cursor: pointer;
	}
	#tagsList li .name {
		display:inline-block;
		overflow:hidden;
		text-overflow:ellipsis;
		width:75px;
		color: #0066CC;
		/*text-decoration: underline;*/
	}
	#tagsList li:hover .name {
		color: #0099ff;
	}
	#tagsList .count {
		float: right;
		padding: 3px 6px;
		font-size: 0.8em;
		color: #999;
		background: #eee;
		border-radius: 4px;
	}
	#tagsList li.active {
		overflow: hidden;
		/*background: #eee;*/
		background: #0066CC;
	}
	#tagsList li.active .name {
		color: white;
	}
	#tagsList li.active .count {
		color: white;
		background: #0099ff;
		border-radius: 0px;
	}
</style>