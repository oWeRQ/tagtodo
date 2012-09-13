<?php

class m120612_141045_user_relations extends CDbMigration
{
	public function up()
	{
		$this->addColumn('tasks', 'user_id', 'int(11) not null');
		$this->addColumn('tags', 'user_id', 'int(11) not null');
	}

	public function down()
	{
		$this->dropColumn('tasks', 'user_id');
		$this->dropColumn('tags', 'user_id');
	}
}