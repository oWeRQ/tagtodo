<?php

class m120415_172425_tags extends CDbMigration
{
	public function up()
	{
		$this->createTable('tags', array(
			'id' => 'pk',
			'name' => 'varchar(1024) NOT NULL',
			'count' => 'int(11) NOT NULL',
			'createdAt' => 'int(11) NOT NULL',
			'updatedAt' => 'int(11) NOT NULL',
		));
	}

	public function down()
	{
		$this->dropTable('tags');
	}
}