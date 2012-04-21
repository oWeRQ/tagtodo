<?php

class m120415_172435_tasks_tags extends CDbMigration
{
	public function up()
	{
		$this->createTable('tasks_tags', array(
			'id' => 'pk',
			'task_id' => 'int(11) NOT NULL',
			'tag_id' => 'int(11) NOT NULL',
		));
	}

	public function down()
	{
		$this->dropTable('tasks_tags');
	}
}