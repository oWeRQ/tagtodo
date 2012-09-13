<?php

class m120612_131522_users extends CDbMigration
{
	public function up()
	{
		$this->createTable('users', array(
			'id' => 'pk',
			'email' => 'string',
			'first_name' => 'string',
			'last_name' => 'string',
			'provider' => 'string',
			'uid' => 'string',
			'createdAt' => 'interger',
			'updatedAt' => 'interger',
		));
	}

	public function down()
	{
		$this->dropTable('users');
	}
}