<?php

class OpauthIdentity extends CBaseUserIdentity
{
	public $user;

	public function authenticate()
	{
		$opauth = Yii::app()->session->get('opauth');
		$opauth_provider = $opauth['auth']['provider'];
		$opauth_uid = $opauth['auth']['uid'];
		$opauth_info = $opauth['auth']['info'];
		$opauth_username = isset($opauth_info['email']) ? $opauth_info['email'] : $opauth_info['name'];
		
		$this->user = User::model()->findByAttributes(array(
			'provider' => $opauth_provider,
			'uid' => $opauth_uid,
		));

		if ($this->user === null) {
			$this->user = new User();
		}

		$this->user->attributes = array(
			'email' => $opauth_username,
			'first_name' => isset($opauth_info['first_name']) ? $opauth_info['first_name'] : $opauth_info['name'],
			'last_name' => isset($opauth_info['last_name']) ? $opauth_info['last_name'] : '',
			'provider' => $opauth_provider,
			'uid' => $opauth_uid,
		);
		$this->user->save();

		if ($this->user->id)
			$this->errorCode = self::ERROR_NONE;
		else
			$this->errorCode = self::ERROR_USERNAME_INVALID;

		return !$this->errorCode;
	}

	public function getId()
	{
		return $this->user->id;
	}

	public function getName()
	{
		return $this->user->first_name.' '.$this->user->last_name;
	}
}