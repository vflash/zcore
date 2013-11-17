
'use strict';

// var layer = draglayer(document);

var module = function(d) {
	return d._draglayer || (d._draglayer = new layer(d));
};


function layer(d, cursor) {
	this.document = d;
	this.cursor = cursor || null;

	var n = this.document.createElement('div');
	n.style.cssText = 'display:none; overflow: hidden;background-color:transparent;position:fixed;left:0px;top:0px;bottom:0px;right:0px;z-index:9999999999;'
		//+ (core.IE ? '_position:absolute;background-image:url(\'about:blank\');background-image: url(data:image/gif;base64,R0lGODlhMgAyAIAAAEBAQAAAACH5BAEAAAAALAAAAAAyADIAAAIzhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKicFADs=);' : '') //about:blank
		+ (core.IE ? '_position:absolute;background-image:url(\'data:;,\');' : '') //about:blank
		
		+ ''
	; 

	this.document.body.appendChild(n);
	this.layer = n;
};


layer.prototype = {
	is_rectangle: false,
	layer: null,
	cursor: null,

	show: function () {
		var u
		, d = this.document
		, n = this.layer
		, s = n.style
		;

		this.is_rectangle = false;
		this.is_show = true;

		s.width = s.height = 'auto';
		s.left = s.top = '0';


		if (core.IE < 7) {
			var v = core.qIE ? d.body : d.documentElement;
			s.width = Math.max(v.clientWidth, v.scrollWidth) + 'px';
			s.height = Math.max(v.clientHeight, v.scrollHeight) + 'px';
		};

		s.cursor = (typeof this.cursor == 'string') ? this.cursor : 'default';

		s.display = 'block';
		//n.offsetHeight;
	},

	hide: function () {
		var n = this.layer;
		if (n) n.style.display = 'none';

		this.is_rectangle = false;
		this.is_show = false;
	},

	hidden: function (x, s) {
		var n = this.layer;

		if (this.is_show) {
			n.style.display = x ? 'none' : '';
			if (core.Gecko && !x) n.offsetHeight; 
		};
	},

	setPoint: function (x, y) {
		var n = this.layer, s = n.style, is_start = !this.is_rectangle;
		
		//alert(this.cursor)

		if (is_start) {
			s.width = s.height = '240px';
			s.cursor = (typeof this.cursor == 'string') ? this.cursor : 'default';
		};

		x -= 120;
		y -= 120;

		s.left = x + 'px';
		s.top = y + 'px';
		
		//s.transform = 'translate('+x+'px, '+y+'px)';

		
		if (is_start) {
			this.is_rectangle = true;
			this.is_show = true;

			s.display = 'block';
		};
	}
};



/*
if (core.IE < 7) {
	window.pageYOffset = 0;
	window.pageOffsetH = 0;
	document.documentElement.firstChild.style.setExpression("__", "pageYOffset=document." + (core.qIE ? "body" : "documentElement") + ".scrollTop,null"); //ie6ScrollTop
	core.up(window, 'resize', function () {
		window.pageOffsetH = document[(core.qIE ? "body" : "documentElement")].offsetHeight
	})()

	core.ui_posIEfixed = function (nd) {
		var y = window.pageYOffset, d = nd._ptop;
		if (d !== y) {
			nd._ptop = y;
			if (d || d === 0) {
				if (d = y - d) nd.style.top = ((parseInt(nd.currentStyle.top) || 0) + d) + 'px';
			}
		}
	};
}
*/
