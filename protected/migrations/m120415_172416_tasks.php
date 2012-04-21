<?php

class m120415_172416_tasks extends CDbMigration
{
	public function up()
	{
		$this->createTable('tasks', array(
			'id' => 'pk',
			'status' => 'int(1) NOT NULL',
			'body' => 'varchar(1024) NOT NULL',
			'createdAt' => 'int(11) NOT NULL',
			'updatedAt' => 'int(11) NOT NULL',
		));
	}

	public function down()
	{
		$this->dropTable('tasks');
	}
}