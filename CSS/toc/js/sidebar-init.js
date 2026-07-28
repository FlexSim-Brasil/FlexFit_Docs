$(function () {
	var $active = $('.topnav li.selected').last();
	$('.topnav').tendina({ activeMenu: $active.length ? $active : null });

	$('.sidebar-toggle').on('click', function () {
		$('.docs-sidebar').toggleClass('open');
		$('.sidebar-overlay').toggleClass('visible');
	});

	$('.sidebar-overlay').on('click', function () {
		$('.docs-sidebar').removeClass('open');
		$('.sidebar-overlay').removeClass('visible');
	});
});
