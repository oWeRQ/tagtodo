require.config({
	paths: {
		jquery: 'libs/jquery/jquery-min',
		underscore: 'libs/underscore/underscore-amd-min',
		backbone: 'libs/backbone/backbone-amd-min',
		text: 'libs/require/text'
	}
});

require(['app'], function(App){
	App.init();
});
