
core.cookie_get = function (n, def, doc) {
	var u, c = (doc||document).cookie, p = n + '=', e, b;
	if (!c) return def !== u ? def : null;

	b = c.indexOf('; ' + p);

	if (b == -1) {
		b = c.indexOf(p);
		if (b != 0) return def !== u ? def : null;
	} else
		b += 2;

	e = c.indexOf(';', b);
	if (e == -1) e = c.length;
	return unescape(
		c.substring(b + p.length, e)
	);
};

// name, value, expires, path, domain, secure
core.cookie_set = function (n, v, e, p, d, s) {
	if (typeof e == 'number') {
		e = new Date(new Date().getTime() + (e||0) * 1000);
	};

	document.cookie = n + '=' + escape(v) +
		((e) ? '; expires=' + e.toGMTString() : '') +
		((p) ? '; path=' + escape(p) : '') +
		((d) ? '; domain=' + d : '') +
		((s) ? '; secure' : '')
	;
};

core.cookie_remove = function (n, p, d) {
	this.cookie_set(n, '', -1000, p, d);
};
