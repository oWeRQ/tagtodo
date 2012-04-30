require.config({
	paths: {
		jquery: 'libs/jquery/jquery-min',
		jqueryui: 'libs/jquery-ui/jquery-ui-min',
		jqueryui_ru: 'libs/jquery-ui/jquery.ui.datepicker-ru',
		underscore: 'libs/underscore/underscore-amd-min',
		backbone: 'libs/backbone/backbone-amd-min',
		text: 'libs/require/text'
	}
});

require(['app', 'jquery'], function(App){
	require(['jqueryui', 'jqueryui_ru'], function(){
		$.datepicker.setDefaults($.datepicker.regional['ru']);
		App.init();
	});
});
