var core = core || {};

new function () {
	var z = core, d = document, w = window, nv = navigator, ua = nv.userAgent, v, i, f;

	v = (ua.match(/.+(rv|WebKit|era|MSIE|Safari)[\/: ](\d+(\.\d)?)/) || [])[2] - 0;
	z.Kqn = z.Opera = z.Gecko = z.IE = z.qIE = z.WebKit = z.SWF = z.Chrome = z.Safari = z.Firefox = NaN;

	if (w.opera && opera.buildNumber) {
		z.Opera = (opera.version && opera.version() || v) - 0;
	}
	else if (/Konqueror/.test(ua)) {
		z.Kqn = (+(ua.match(/Konqueror\/(\d+)/) || false)[1]) || 3;
	}
	else if (/WebKit/.test(ua)) {
		z.WebKit = (+(ua.match(/AppleWebKit\/(\d+)/) || false)[1]) || 533;

		if (i = ua.match(/Chrome\/(\d+(\.\d)?)/)) {
			z.Chrome = +i[1];
		}
		else if (i = /Apple/.test(nv.vendor) && ua.match(/Version\/(\d+(\.\d)?)/)) {
			z.Safari = +i[1];
		}
	}
	else if (/Gecko/.test(ua)) {
		if (i = ua.match(/rv:\d+\.\d+\.(\d)/)) if (i = i[1] / 100) v += i;
		z.Gecko = (v < 1.9 && d.getElementsByClassName ? 1.9 : v) || 1.9;
		if (i = ua.match(/Firefox\/(\d+(\.\d)?)/)) z.Firefox = +i[1];
	}
	else if (/xplorer/.test(nv.appName)) {
		z.IE = d.documentMode || v || 8;
		z.qIE = d.compatMode != 'CSS1Compat' ? z.IE : NaN;
	}
	else z.Gecko = 1.9;

	// test flash
	try {
		f = !z.Kqn && (/(\d+(\.\d+)?)/).exec(nv.mimeTypes['application/x-shockwave-flash'].enabledPlugin.description)[1] || false
	} catch (e) {
		f = false
	}

	if (!f && z.IE && w.ActiveXObject) {
		try {
			f = (/WIN\s+(\d+)/).exec(new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version'))[1]
		} catch (e) { }
	}

	if (f) z.SWF = +f || NaN;

	z.is_mobile = /Mobile/.test(ua);
	z.is_j2me = /J2ME[\/]/.test(nv.appVersion);
	z.is_OperaMini = /Opera Mini[\/]/.test(nv.appVersion);

	z.osWin = /Windows/.test(ua);
	z.osMac = /Mac OS/.test(ua);
	z.osLnx = /Linux/.test(ua);
};

if (core.IE == 6) try {document.execCommand('BackgroundImageCache', false, true)} catch (oh) { }; // naverno nado )


core.dom = false; // флаг что дом построен
core.domReady = (function () {
	var init, list = [], ready = false;

	push.status = false;
	
	function push(fn) {
		if (push.stop) return fn;

		if (fn === 'force' || fn === 'fastInit') {
			return init();
		};

		if (typeof fn == 'function') {
			ready ? fn() : list.push(fn);
		};

		return fn;
	};
	

	function init() {
		if (ready) return;
		core.dom = push.status = ready = true;

		var u, i = 0, x;
		while(x = list[i++]) {
			//try {x()} catch (e) {er(e)};
			x();
		};

		list = null;
	};

	function er(e) {
		setTimeout(function () {throw e}, 1)
	};

	new function () {
		var d = document, w = window, s, tm, g = init;

		if (/loaded|complete/.test(d.readyState + '')) {
			return g(); // content loaded
		};

		if (d.addEventListener) {
			d.addEventListener('DOMContentLoaded', g, false);
			w.addEventListener('load', g, false);
		
		} else if (d.attachEvent) {
			w.attachEvent('onload', g);
			d.write('<script id="__ie_domload_" defer="defer" src="javascript:void(0)"></script>'); // на https возможно браузер будет ругаться . но точно не помню
			if (s = d.getElementById('__ie_domload_')) {
				s.id = '';
				s.onreadystatechange = function () { //if (core.IE!=5.5)
					if (this.readyState == 'complete') g();
				};
			};

			/* // срабатывает не совсем там где нужно
			var tempNode = d.createElement('document:ready');
			(function() {
			try {
			tempNode.doScroll('left');
			g();
			tempNode = null;
			}
			catch(e) {
			setTimeout(arguments.callee, 10)
			}
			})();
			*/
			return;

		} else new function () {
			var ol = w.onload;
			w.onload = ol ? function () {
				g();
				ol();
				w.onload = null
			} : g;
		};

		if (core.WebKit<525 || core.Opera < 9) { ///WebKit/i.test(navigator.userAgent)
			tm = setInterval(function () {
				if (/loaded|complete/.test(d.readyState)) {
					clearInterval(tm);
					g();
				};
			}, 10);
		};
	};

	return push;
})();




core.$ = function (e, d) {
	return typeof e === 'string' ? (d || document).getElementById(e) : e;
};

core.bind = function (x, fn) {
	return function () {
		return fn.apply(x, arguments)
	};
};

core.extend = core.expand = function (o) {
	var i = 1, l = arguments.length, n, e;
	if (!o) o = {};

	while (i < l) {
		if (e = arguments[i++]) {
			for (n in e) if (e.hasOwnProperty(n)) o[n] = e[n];
			if (core.IE < 9 && e.hasOwnProperty('constructor')) o.constructor = e.constructor;
		};
	};

	return o;
};


// это не аналог Array.map из ECMA
core.map = function (a, cb) { 
	if (!a || typeof cb !== 'function') return;

	/* в ж.. такие стандарты
	if (typeof a.map === 'function') {
		return a.map(cb)
	};
	*/

	var na = [], l = a.length, i = 0;

	for (;i < l; i++) {
		na.push(cb(a[i], i, a));
	};

	return na;
};


// это не аналог Array.indexOf из ECMA
core.indexOf = function (a, x, i) {
	if (a) {
		if (x !== u && typeof a.indexOf === 'function') {  // 
			return a.indexOf(x, i);
		};

		var l = a.length, u;

		i = i > 0 ? i : i < 0 && l > -i ? l + i : 0;

		for (; i < l; i++) if (a[i] === x) return i;

	};

	return -1;
};

core.trim = ''.trim ? function (s) {
	return String(s).trim();
} : new function () {
	var rg = /^[\s|\xA0]+|[\s|\xA0]+$/g
	return function (s) {
		return typeof s == 'string' ? s.replace(rg, '') : String(s)
	}
};


core.up = function (o, e, h, x) {
	if (h === false) h = this.breakEvent;
	if (!o) return;

	var a = e.indexOf(' ') !== -1 ? e.split(' ') : [e], i = 0;
	if (o.nodeType < 0 && !o.addEventListener) o = o.node;

	while (e = a[i++]) {
		switch (e) {
			case 'mouseScroll':
				e = core.Gecko ? 'DOMMouseScroll' : 'mousewheel';
			break;

			case 'scroll':
				if (o.nodeType == 9) o = core.IE || core.Opera ? o.parentWindow : o;
			break;

			case 'resize':
				if (o.nodeType == 9) o = o.defaultView || o.parentWindow;
			break;
		};

		if (o.addEventListener) {
			o.addEventListener(e, h, x ? true : false);
		} else {
			o.attachEvent('on' + e, h);
		};
	};

	return h;
},


core.dn = function (o, e, h, x) {
	if (o && e && h) {
		var a = e.indexOf(' ') !== -1 ? e.split(' ') : [e], i = 0;

		if (o.nodeType < 0 && !o.removeEventListener) o = o.node;

		while (e = a[i++]) {
			switch (e) {
				case 'mouseScroll':
					e = core.Gecko ? 'DOMMouseScroll' : 'mousewheel';
				break;

				case 'scroll':
					if (o.nodeType == 9) o = core.IE || core.Opera ? o.parentWindow : o;
				break;

				case 'resize':
					if (o.nodeType == 9) o = o.defaultView || o.parentWindow;
				break;
			};

			if (o.removeEventListener) {
				o.removeEventListener(e, h, !!x);
			} else {
				o.detachEvent('on' + e, h);
			};
		};
	};
};

core.up_ = function (o, e, h, x) {return this.up(o, e, h, x !== false)};
core.dn_ = function (o, e, h, x) {return this.dn(o, e, h, x !== false)};

core.stopEvent = function (e) {
	if (e.stopPropagation) e.stopPropagation();
	e.cancelBubble = true; 
};


core.breakEvent = function (e) {
	if (e) {
		e.returnValue = false; // не удалять, используется в логике программ
		if (e.preventDefault) e.preventDefault();
	}
	return false;
};


core.getClientWH = function (d) {
	if (!d) d = document;
	var v = core.qIE ? d.body : d.documentElement
	return {w: v.clientWidth, h: v.clientHeight};
};

core.getClientSize = function (d) {
	if (!d) d = document;

	var u
	, v = core.qIE ? d.body : d.documentElement
	, r = {w: v.clientWidth, h: v.clientHeight}
	, w = d.defaultView
	;

	r.sw = v.scrollWidth;
	r.sh = v.scrollHeight;

	if (w) {
		r.st = w.pageYOffset;
		r.sl = w.pageXOffset;
	} else {
		r.st = v.scrollTop;
		r.sl = v.scrollLeft;
	};

	return r;
};

core.getClientScroll = function(d) {
	if (!d) d = document;
	var v, w;

	if (w = d.defaultView) {
		return {top: w.pageYOffset, left: w.pageXOffset};
	} else {
		v = core.qIE ? d.body : d.documentElement;
		return {top: v.scrollTop, left: v.scrollLeft};
	};
};



core.getAbsolutePos = document.documentElement.getBoundingClientRect ? function (n) {
	if (!n) return;
	var d = n.ownerDocument || document, w = d.parentWindow || d.defaultView, v, bx;

	if (core.IE) {
		v = core.qIE ? d.body : d.documentElement;
		if (!v) return {
			x: 0,
			y: 0
		};
	}

	bx = n.getBoundingClientRect();

	return {
		y: bx.top + ((v ? v.scrollTop - v.clientTop : w.pageYOffset) || 0),
		x: bx.left + ((v ? v.scrollLeft - v.clientLeft : w.pageXOffset) || 0)
	};

} : function (el) {
	var r = {
		x: el.offsetLeft,
		y: el.offsetTop
	}, tmp, op = el.offsetParent;
	if (op) {
		tmp = arguments.callee(op);
		if (!op.offsetParent) return r;

		if (core.IE && op.tagName == 'HTML') return r;
		r.x += tmp.x - op.scrollLeft;
		r.y += tmp.y - op.scrollTop;
	}
	return r;
};

core.getRect = document.documentElement.getBoundingClientRect ? function (n) {
	if (n) return n.getBoundingClientRect();
} : function (n) {
	if (!n) return;
	var ps = this.getAbsolutePos(n), d = n.ownerDocument || document, cwh = this.getClientWH(d);
	return {
		left: p.x - cwh.sl,
		top: p.y - cwh.st,
		right: p.x + n.offsetWidth - cwh.sl, //cwh.w -
		bottom: p.y + n.offsetHeight - cwh.st //cwh.h -
	}
};

core.getCStyle = function (n) {
	if (typeof n === 'string') n = core.$(n);
	if (n) return n.currentStyle || (n.ownerDocument || document).defaultView.getComputedStyle(n, null);
};

core.style = function (n, pr) {
	if (typeof n == 'string') n = this.$(n);
	if (!n) return;

	var st = n.style, x, a, und;

	if (typeof pr == 'object') {
		x = pr.cssText;
		if (x || x === '') {
			core.Opera < 9 ? n.setAttribute('style', x) : st.cssText = x;
		};

		if (core.IE < 9) {
			x = pr.opacity;

			if (x || x === 0 || x === '') {
				if (a = typeof n.filters !== 'object' ? null : n.filters['DXImageTransform.Microsoft.alpha'] || n.filters.alpha) {
					if (a.enabled = x !== '') a.opacity = Math.round(x * 100);
				}
				else if (x !== '') {
					st.filter += 'alpha(opacity=' + Math.round(x * 100) + ')';
				};
			};
		};

		for (x in pr) {
			if (x !== 'cssText') st[x] = pr[x];
		};

	} else {
		core.Opera < 9 ? n.setAttribute('style', pr) : st.cssText = pr;
	};
};



core.scrollTo = typeof window.scrollTo == 'function' ? function (d, x, y) {
	(d || document).defaultView.scrollTo(x > 0 ? x : 0, y > 0 ? y : 0)
} : function (d, x, y) {
	if (!d) d = document;

	if (core.IE && window.scrollTo) {
		d.parentWindow.scrollTo(x > 0 ? x : 0, y > 0 ? y : 0)
		return;
	};


	var n = core.WebKit ? d.body || false : d.documentElement;

	if (n) {
		n.scrollLeft = x > 0 ? x : 0;
		n.scrollTop = y > 0 ? y : 0;
	}
};

core.getAtt = function (n, nm, de) {
	var u, v = !n || n.nodeType !== 1 ? null : n.getAttribute(nm, 2);
	return v === null ? de !== u ? de : v : v;
};

core.removeAtt = function (nd, nm, x) {
	if (nd) {
		if (!nd.getAttributeNode) {
			// непомню почему так. толи это фикс бага толи хз
			nd.removeAttribute(nm);
		} else 
		if (nm = nd.getAttributeNode(nm)) {
			nd.removeAttributeNode(nm);
		};
	};
};

core.removeNode = function (n) {
	var p = n ? n.parentNode : false;

	if (p) {
		p.removeChild(n);

		if (core.IE < 7 && n.tagName == 'STYLE') {
			var s = (n.ownerDocument || this.document).documentElement.style;
			p = s.borderColor;
			s.borderColor = p == '#FFFFFF' ? '#FFE' : '#FFF';
			s.borderColor = p;
		}
	};

	return n;
};


core.unid = (function(x) {
	return function() {return 'unidrr_' + (++x).toString(32)}
})(
	Math.floor(Math.random()*50+1000)
);


core.new_class = (function () {
	var oc = Object.prototype.constructor;

	function cn() { } // null constructor

	return function (c) { //new_class
		var i, p, s, u;

		c = typeof c === 'function' ? new c() : c || {};

		p = c.parent;
		if (p = p ? p.prototype : false) {
			cn.prototype = p;
			p = new cn;

			if (s = c.prototype) {
				for (i in s) if (s[i] !== u) p[i] = s[i];
				c.prototype = p;
			}
		}

		s = c.constructor;
		if (p = c.prototype) s.prototype = p;

		if (i = c.varclass) {
			s.prototype[typeof i === 'string' ? i : 'varclass'] = c;
		};
	

		s.varclass = c;

		return s;
	};
})();



core.newPrototype = typeof Object.create === 'function' ? Object.create : (function () {
	var c = function () { }, cp = c.prototype;
	return function (p) {
		return c.prototype = p || cp, new c
	}
})();


core.urlEscape = encodeURIComponent;

core.htmlEscape = (function () {
	var cm = {'&': '&amp;','<': '&lt;','>': '&gt;','"': '&quot;'};
	function r(A) {return cm[A]};

	return function (A) {
		return String(A).replace(/[&<>"]/g, r); //'
	};
})();



core.jsEscape = String(window.JSON) === '[object JSON]' && JSON.stringify('\u0451') == '"\u0451"' ? // test native
	function (v) {
		return JSON.stringify(v + '').slice(1, -1).replace(/'/g, '\\\'')
	}
	: new function () {
		var rg = new RegExp('\\\\|[\"\'\\n\\r\\b\\t\\f]', 'g'), c = {
			'\\': '\\\\',
			'"': '\\"',
			'\'': '\\\'',
			'\n': '\\n',
			'\r': '\\r',
			'\b': '\\b',
			'\t': '\\t',
			'\f': '\\f'
		};
		function r(x) {
			return c[x]
		}

		return function (v) {
			return typeof v == 'string' ? v.replace(rg, r) : v + '';
		}
	}
;


core.newHttpRequest = window.XMLHttpRequest ? function () {
	return new XMLHttpRequest()
}
: function () {
	try {
		return new ActiveXObject('Microsoft.XMLHTTP')
	} catch (e) { }
};

core.each = function(m, func) {
	if (!m) return;

	for(var i = 0, l = m.length; i < l;) {
		func(m[i], i++);
	};
};

core.createSWF = function (pr, d) {
	if (!pr || !pr.src) return;
	d = (pr.parent && pr.parent.ownerDocument) || d || pr.document || this.document;

	function apIE(n, nm, v) {
		var x = d.createElement('param');
		x.name = nm;
		x.value = v;
		n.appendChild(x);
	}

	var sd, x, i, tv
	, n = d.createElement(this.IE < 9 
		? '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" name="' + (pr.name || '~z ' + d.createElement('span').uniqueID) + '">' 
		: this.IE  ? 'object' : 'embed' //object
		)
	;

	if (!this.IE) n.type = 'application/x-shockwave-flash';

	if (this.IE && pr.ieFSCommand) {
		i = d.createElement('script');
		i.event = 'FSCommand(command,args)';
		i.htmlFor = n.name;
		i.text = 'eval(args)'; // type='text/javascript'
		//d.documentElement.firstChild.appendChild(i);
		d.getElementsByTagName('head')[0].appendChild(i);
	}

	for (i in pr) {
		x = pr[i];
		switch (i = i.toLocaleLowerCase()) {
			case 'vars':
				if (pr.flashvars) break;
				i = 'flashvars';
			case 'flashvars': case 'menu': case 'quality': case 'scale': case 'wmode': case 'bgcolor': case 'swliveconnect': case 'allowscriptaccess': case 'allowfullscreen': case 'seamlesstabbing': case 'allownetworking':
				if ((tv = typeof x) == 'string' || tv == 'number' || tv == 'boolean') {
					this.IE ? apIE(n, i, x) : n.setAttribute(i, x);
				};
				break;
			case 'id': case 'className': case 'width': case 'height':
				if (x || x === 0) n[i] = x;
				break;
			case 'style':
				if (typeof x === 'string') n.style.cssText = x;
				//this.setStyle(n, x);
				break;
		}
	}


	if (x = this.Gecko && pr.parent && n.style) {
		sd = x.display;
		x.display = 'none';
	}

	if (x = pr.src) this.IE < 9 ? apIE(n, 'movie', x) : this.IE ? n.data = x : n.src = x;
	

	if (x = pr.parent) {
		x.appendChild(n);
		if (x = this.Gecko) n.style.display = sd || '';
		if (x || this.Opera) n.offsetParent;
	}

	return n;
};



/*
cfg {function|object|false}
cfg.event {function(src, true|false)}
cfg.defer {false|default true}
cfg.rm {boolean} removing tag
cfg.document {document}
cfg.charset {string|fasle} , def utf-8
*/
core.appendScript = function (src, cfg) {
	cfg = typeof cfg === 'function' ? {event: cfg} : cfg || false;

	var d = cfg.document || document, h = d.getElementsByTagName('head')[0], s = d.createElement('script'), ok;
	s.charset = cfg.charset || 'utf-8';
	s.type = 'text/javascript';

	if (cfg.defer !== false) {
		s.defer = 'defer';
	};

	function q() {
		if (ok) return;
		s.onreadystatechange = s.onload = s.onerror = null;
		ok = true;

		if (cfg.event) cfg.event(true, src);
		if (cfg.remove !== false) h.removeChild(s);
	};

	if (cfg.event) {
		if (core.IE) {
			s.onreadystatechange = function () {
				switch (s.readyState) {
					case 'complete': case 'loaded':
						q()
				};
			};
		} else {
			s.onload = q;
		};

		s.onerror = function () {
			if (ok) return;
			s.onreadystatechange = s.onload = s.onerror = null;
			ok = true;

			if (cfg.event) cfg.event(false, src);
			if (cfg.remove !== false) h.removeChild(s);
		};
	};

	s.src = src;
	s = h.insertBefore(s, h.firstChild);

	return s;
};



core.zinterval = new function() {
	var clear = clearTimeout
	var set = setTimeout

	return function(x, func) {
		var ztm = +x||10, zz;

		function step() {
			func();
			zz = setTimeout(step, ztm)
		};

		return function(cmd) {
			if (cmd === 'stop') {
				zz = clear(zz);
				return;
			};
			
			if (cmd === 'go') {
				zz = zz || set(step, ztm);
				return;
			};
		};
	};
};

core.type = new function () {
	var to = Object.prototype.toString;
	var r = typeof /x/ !== 'function';

	return function (v) {
		var x;

		if (v === x) return 'undefined';
		if (v === null) return 'null';


		switch (x = typeof v) {
			case 'function': if (r) break;
			//case 'boolean': return 'boolean';
			
			case 'object':
				//return z[x]||x;
				switch (to.call(v)) {
					case '[object Array]':	return 'array';
					case '[object Date]':	return 'date';
					case '[object RegExp]': return 'regexp';
					case '[object String]': return 'string';
					case '[object Number]': return 'number';
					case '[object Boolean]':return 'boolean';
				}
		}
		return x;
	};
};

core.printx = new function () {
	var rg = /%%|%(s|\d{1,2})%?/g, arg, u, l, p;

	function fn(s, x) {
		return s === '%%' ? '%' : x === 's' ? arg[++p] : arg[p = ++x];
	};

	return function (v) {
		if (typeof v == 'string') {
			p = 0;
			arg = arguments;
			l = arg.length;
			return v.replace(rg, fn);
		}
		return v
	};
};

core.prints = new function () {
	var rg = /%%|%(\d+|[a-z][a-z\d]*)%?/g, params;

	function fn(s, x) {
		return s === '%%' ? '%' : params[x];
	};

	return function (v, p) {
		if (typeof v == 'string') {
			params = p;

			return v.replace(rg, fn);
		};

		return v;
	};
};


core.getParentNode = function (name, node, start) {
	var x, name = String(name).toUpperCase();

	if (!start && node) {
		node = node.parentNode;
	};

	for (; node; node = node.parentNode) {
		if (node.tagName === name) return node;
	};
};



