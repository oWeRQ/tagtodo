<?php

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'My Console Application',
	// application components
	'components'=>array(
		'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=tagtodo',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => 'nuller',
			'charset' => 'utf8',
		),
	),
);