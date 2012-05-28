require.config({
	paths: {
		underscore: 'libs/underscore/underscore-amd-min',
		backbone: 'libs/backbone/backbone-amd-min',
		text: 'libs/require/text'
	}
});

require(['app'], function(App){
	App.init();
});
