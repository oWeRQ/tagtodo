<?php

class CallbackController extends Controller
{
	public function actionIndex()
	{
		$identity = new OpauthIdentity();
		$identity->authenticate();

		if ($identity->errorCode === UserIdentity::ERROR_NONE) {
			Yii::app()->user->login($identity);
			$this->redirect(array('/'));
		}
	}
}
