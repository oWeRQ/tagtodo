<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="<?=Yii::app()->baseUrl?>/css/tasks.css">
	<title><?=CHtml::encode($this->pageTitle)?></title>
</head>
<body>
<div id="wrap">

	<div id="header">
		<div id="logo"><?=CHtml::encode(Yii::app()->name)?></div>
	</div><!-- #header -->

	<?=$content?>

	<div id="footer">
		<? if (!Yii::app()->user->isGuest): ?>
			<div id="user">
				<?=Yii::app()->user->name?>
				(<?=CHtml::link('logout', array('site/logout'))?>)
			</div>
		<? endif ?>
		<div id="design">
			Design by oWeRQ
		</div>
	</div><!-- #footer -->

</div><!-- #wrap -->
</body>
</html>
