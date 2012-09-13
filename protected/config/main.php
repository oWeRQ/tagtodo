<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'TagTodo',

	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
	),

	'modules'=>array(
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'nuller',
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
		'opauth' => array(
			'opauthParams' => array(
				//'Security.salt' => 'LDFmiilYf8Fyw5W10rx4W1KsVrieQCnpBzzpTBWA5vJidQKDx8pMJbmw28R1C4m',
				//'Security.salt' => '6c8d25530932e97d60e14ebbffddb095e4365525dbcd039fb2903f2f6be1e58',
				'security_salt' => '6c8d25530932e97d60e14ebbffddb095e4365525dbcd039fb2903f2f6be1e58',
				'Strategy' => array(
					'Google' => array(
						'client_id' => '258890327472.apps.googleusercontent.com',
						'client_secret' => 'Xn3pm8FcqQ7JuasD2ZVptkJA',
					),
					'Twitter' => array(
						'key' => 'yPqvNb2UNDpWXPOA9TyhAg',
						'secret' => 'CeoUvXxjREYDEKQIsm91KDjsx06YVIDLTC37Emoemc',
					),
					'OpenID' => array(),
				),
			),
		),
	),

	// application components
	'components'=>array(
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
		),
		'urlManager'=>array(
			'urlFormat'=>'path',
			'showScriptName'=>false,
			'rules'=>array(
				array('site/tasks', 'pattern'=>''),
				array('site/page', 'pattern'=>'about', 'defaultParams'=>array('view'=>'about')),
				'login'=>'site/login',
				'logout'=>'site/logout',
				// REST patterns
				array('api/list', 'pattern'=>'api/<model:\w+>', 'verb'=>'GET'),
				array('api/view', 'pattern'=>'api/<model:\w+>/<id:\w+>', 'verb'=>'GET'),
				array('api/update', 'pattern'=>'api/<model:\w+>/<id:\w+>', 'verb'=>'PUT'),
				array('api/delete', 'pattern'=>'api/<model:\w+>/<id:\w+>', 'verb'=>'DELETE'),
				array('api/create', 'pattern'=>'api/<model:\w+>', 'verb'=>'POST'),
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),
		'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=tagtodo',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => 'nuller',
			'charset' => 'utf8',
			//'enableParamLogging' => true,
			//'enableProfiling' => true,
		),
		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
				// uncomment the following to show log messages on web pages
				/*
				array(
					'class'=>'CWebLogRoute',
				),
				*/
				array( 
					'class'=>'CProfileLogRoute', 
					'report'=>'summary',
				),
			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'webmaster@example.com',
	),
);