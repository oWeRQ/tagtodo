<?php
$this->pageTitle=Yii::app()->name . ' - Login';
$this->breadcrumbs=array(
	'Login',
);
?>

<div id="login-wrap">

<h2>Sign in</h2>

<div class="form">
<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'login-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>

	<div class="row">
		<?php //echo $form->label($model,'username'); ?>
		<?php echo $form->textField($model,'username',array('placeholder'=>$model->getAttributeLabel('username'))); ?>
		<?php echo $form->error($model,'username'); ?>
	</div>

	<div class="row">
		<?php //echo $form->label($model,'password'); ?>
		<?php echo $form->passwordField($model,'password',array('placeholder'=>$model->getAttributeLabel('password'))); ?>
		<?php echo $form->error($model,'password'); ?>
	</div>

	<div class="row rememberMe">
		<?php echo $form->checkBox($model,'rememberMe'); ?>
		<?php echo $form->label($model,'rememberMe'); ?>
		<?php echo $form->error($model,'rememberMe'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton('Sign in'); ?>
	</div>

<?php $this->endWidget(); ?>
</div><!-- form -->

<div class="orLine"><span>or</span></div>
<div class="social">
	<?=CHtml::link(CHtml::image(Yii::app()->request->baseUrl.'/images/auth/google.png'), array('opauth/google'))?>
	<?=CHtml::link(CHtml::image(Yii::app()->request->baseUrl.'/images/auth/twitter.png'), array('opauth/twitter'))?>
	<?//=CHtml::link(CHtml::image(Yii::app()->request->baseUrl.'/images/auth/facebook.png'), array('opauth/facebook'))?>
	<?=CHtml::link(CHtml::image(Yii::app()->request->baseUrl.'/images/auth/openid.png'), array('opauth/openid'))?>
</div>

</div>