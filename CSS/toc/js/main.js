$(document).ready(function() {
	components.expander.init();
});

var components = components || {};
components.class = components.class || {};

components.expander = {
	expanders: [],
	init: function() {
		var self = this;
		$('[data-component="image-expander"]').each(function() {
			var expander = new components.class.Expander(this);
			self.expanders.push(expander);
		});
	},
	destroy: function() {
		$(window).off('.Expander');
	}
}

components.class.Expander = function(elem) {
	var self = this;
	self.el = $(elem);
	self.img = $(elem).find('img');
	self.img.wrap($('<div class="image-expander-container"></div>'));
	self.icon = $('<div class="icon"></div>');
	self.imgBox = self.el.find('.image-expander-container');
	self.imgBox.append(self.icon);
	self.originalWidth = '';
	self.maxWidth = '';
	var tempImage = new Image;
	tempImage.src = self.img.attr('src');
	tempImage.onload = function() { self.init(); }
}
components.class.Expander.prototype.init = function() {
	var self = this;
	self.isExpanded = false;
	self.originalWidth = self.el.width();
	self.resize();
	$(window).on('resize.Expander', function() { self.resize(); });
	self.shrink();
	self.el.on('click.Expander', function() {
		if(self.isExpanded) self.shrink();
		else self.expand();
	});
}
components.class.Expander.prototype.resize = function() {
	var self = this;
	self.maxWidth = (self.originalWidth > $(window).width()) ? $(window).width() : self.originalWidth;
	if(self.isExpanded) self.img.css('width', self.maxWidth);
}
components.class.Expander.prototype.expand = function() {
	var self = this;
	self.el.removeClass('shrunk');
	self.img.css('width', self.maxWidth);
	self.icon.text('-');
	self.isExpanded = true;
}
components.class.Expander.prototype.shrink = function() {
	var self = this;
	self.el.addClass('shrunk');
	self.icon.text('+');
	self.img.css('width', '');
	self.isExpanded = false;
}
