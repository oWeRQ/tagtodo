<?php

class OpauthModule extends CWebModule {

	public $opauthParams = array();

	public function init() {
		$this->setImport(array(
			'opauth.vendors.Opauth.Opauth',
			'opauth.vendors.Opauth.OpauthStrategy',
			'opauth.vendors.Opauth.Strategy.Facebook.FacebookStrategy',
			'opauth.vendors.Opauth.Strategy.Google.GoogleStrategy',
			'opauth.vendors.Opauth.Strategy.OpenID.OpenIDStrategy',
			'opauth.vendors.Opauth.Strategy.Twitter.TwitterStrategy',
		));
		$path = Yii::app()->createUrl($this->id).'/';
		if ($_SERVER['REQUEST_URI'] != $path.'callback') {
			$this->opauthParams['path'] = $path;
			$opauth = new Opauth($this->opauthParams);
		}
	}

	public function beforeControllerAction($controller, $action) {
		if (parent::beforeControllerAction($controller, $action)) {
			return true;
		}
		else
			return false;
	}

}
