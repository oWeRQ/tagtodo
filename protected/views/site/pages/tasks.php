<?php
Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/flick/jquery-ui-1.8.19.custom.css');
Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/tasks.css');

Yii::app()->clientScript->registerScript('baseUrl',
	"var baseUrl = ".CJavaScript::encode(Yii::app()->request->baseUrl).";\n"
	."var scriptUrl = ".CJavaScript::encode(Yii::app()->request->scriptUrl).";",
	CClientScript::POS_HEAD);
?>

<script data-main="js/main" src="<?=Yii::app()->baseUrl?>/js/libs/require/require.js"></script>

<div id="tasksApp"></div>