<?php

class m120520_183154_tasks_weight extends CDbMigration
{
	public function up()
	{
		$this->addColumn('tasks', 'weight', 'int(11) not null default \'0\'');
	}

	public function down()
	{
		$this->dropColumn('tasks', 'weight');
	}
}