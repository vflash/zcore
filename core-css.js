// CSS 


core.css_is = function (cl, n) {
	if (typeof n == 'string') n = this.$(n);
	if (!cl || !n || !(n = n.className)) return;
	n = ' ' + n + ' ';

	if (cl.indexOf(' ') === -1) {
		return n.indexOf(' ' + cl + ' ') !== -1
	}

	cl = cl.split(' ');
	var i = cl.length, c;

	while (i--) {
		if ((c = cl[i]) && n.indexOf(' ' + c + ' ') === -1) return false;
	}

	return true
};

core.css_add = function (cl, n) {
	if (typeof n === 'string') n = this.$(n);
	if (!cl || !n) return;

	var cn = n.className, r;
	if (r = !cn) return n.className = cl, r;

	var xc = ' ' + cn + ' ';
	if (cl.indexOf(' ') === -1) {
		if (r = xc.indexOf((cl = ' ' + cl) + ' ') === -1) {
			//n.className = cn+cl;
			n.className += cl;
		}

		return r;
	}

	cl = cl.split(' ');
	var i = cl.length, c;

	while (i--) {
		if ((c = cl[i]) && xc.indexOf((c = ' ' + c) + ' ') === -1) {
			cn += c;
			r = true;
		}
	}

	if (r) n.className = cn;
	return r;
};


core.css_remove = function (cl, o, cn) {
	if (typeof o === 'string') o = this.$(o);
	if (!cl || !o || !(cn = o.className)) return;

	var ac = cn.indexOf(' ') !== -1 ? cn.split(' ') : [cn]
	, l = ac.length
	, i = -1, i2 = 0, s, flg;

	cl = ' ' + cl + ' ';

	while (++i < l) if (s = ac[i]) {
		cl.indexOf(' ' + s + ' ') !== -1 ? flg = true : ac[i2++] = s;
	}

	if (flg) {
		if (!i2) {
			o.className = '';
			if (o.removeAttribute) o.removeAttribute('class');
		}
		else {
			ac.length = i2;
			o.className = ac.join(' ');
		}
	}

	return flg;
};


core.css_flip = function (cl, o) {
	if (typeof o === 'string') o = this.$(o);
	if (o) return this.css_add(cl, o) || (this.css_remove(cl, o) && false);
},

core.css_replace = function (cl, cl2, o, x) {
	if (typeof o === 'string') o = this.$(o);

	if (x = cl && cl2 && o && o.className) {
		if (this.css_remove(cl, x = {
			className: x
		})) {
			o.className = cl2 + ' ' + x.className;
			return true;
		}
	}
},

core.css_set = function (cl, o, fl) {
	return fl ? this.css_add(cl, o) : this.css_remove(cl, o);
},

core.css_set_ = function (cl, o, sx) {
	var cn, ac;
	if (typeof o === 'string') o = this.$(o);
	if (!cl || !o || !(cn = o.className) && !sx) return;

	sx = sx ? cl + sx : false;
	if (sx && !cn) {
		o.className = sx;
		return true;
	}

	ac = cn.indexOf(' ') != 1;
	if (sx) if (ac ? (' ' + cn + ' ').indexOf(' ' + sx + ' ') != -1 : cn == sx) return;


	ac = ac ? cn.split(' ') : [cn];
	var i = 0, i2 = 0, l = ac.length, s, flg, fg2;


	while (i < l) {
		if (s = ac[i++]) {
			if (s === sx) fg2 = true;
			s !== sx && !s.indexOf(cl) ? flg = true : ac[i2++] = s;
		}
	}

	if (sx && !fg2) {
		ac[i2++] = sx;
		flg = true;
	};

	if (flg) {
		if (!i2) {
			o.className = '';
			if (o.removeAttribute) o.removeAttribute('class');
		} else {
			ac.length = i2;
			o.className = ac.join(' ');
		};
	};

	return flg;
};

core.css_get = function (cl, o) {
	if (typeof o == 'string') o = this.$(o);
	if (!o || !cl || !(o = o.className)) return;

	o = ' ' + o + ' ';
	var u, s, i = 0;

	if (cl.indexOf(' ') === -1) {
		return o.indexOf(' ' + cl + ' ') !== -1 ? cl : u;
	};

	cl = cl.split(' ');
	while (s = cl[i++], s !== u) {
		if (s && o.indexOf(' ' + s + ' ') !== -1) return s;
	};
};


core.css_get_ = function (cl, o, cn) {
	if (typeof o === 'string') o = this.$(o);
	if (!cl || !o || !(cn = o.className)) return;

	var s = (' ' + cn).indexOf(' ' + cl), e;
	if (s !== -1) {
		e = cn.indexOf(' ', s);
		return e !== -1 ? cn.substring(s+cl.length, e) : cn.substring(s+cl.length)
	}
};


core.css_first = function (cl, o) {
	if (typeof o === 'string') o = this.$(o);
	if (o) {
		o = o.firstChild;
		while (o) {
			if (this.css_is(cl, o)) return o;
			o = o.nextSibling;
		}
	}
};

core.css_next = function (cl, o) {
	if (typeof o === 'string') o = this.$(o);
	if (o) while (o = o.nextSibling) {
		if (this.css_is(cl, o)) return o;
	}
};

core.css_prev = function (cl, o) {
	if (o = _g(o)) {
		while (o = o.previousSibling) {
			if (this.css_is(cl, o)) return o;
		};
	};
};

core.css_parent = function (cl, o, f) {
	if (typeof o === 'string') o = this.$(o);
	if (!o || !cl) return;

	var t = this, v;

	if (!f) o = o.parentNode;
	t.css_return = v;

	for (; o; o = o.parentNode) {
		if (v = t.css_get(cl, o)) {
			t.css_return = v;
			return o;
		};
	};
};

core.css_switch = function (c, n, ix) {
	if (!n || c === null) return;
	var css = n.className, ncss = css, nc, x, j, r, i, index_of;

	switch (typeof c) {
		case 'string':
			c = c.split(' ');
			break;
		case 'object':
			break;
		default:
			return
	};

	if (ix !== ix || typeof ix !== 'number') {
		ix = c.length < 2 ? 0 : false;
	};

	if (!css) {
		if (x = c[ix || 0]) {
			n.className += ' ' + x;
		}
		return !!x;
	};

	index_of = !!c.indexOf;

	if (css.indexOf(' ') === -1) {
		j = index_of ? c.indexOf(css) : core.indexOf(c, css);

		if (j === -1) {
			x = c[ix || 0];

			if (r = x && x !== '~') {
				n.className += ' ' + x;
			}

			return r;
		}

		if (ix !== false) {
			x = c[ix];
			if (x === '~') x = '';

			if (r = x !== css) {
				n.className = c[ix] || '';
			}

			return r;
		}

		ix = j + 1 < c.length ? j + 1 : 0;

		if (x = ix !== j) {
			n.className = c[ix] || '';
		}

		return x;
	};

	var acss = css.split(' '), l = acss.length;
	var ncss = [], change = false, has_nc;

	if (ix !== false) {
		nc = c[ix];
		if (nc === '~') nc = '';

		for (i = 0; i < l; i++) if (x = acss[i]) {
			if (nc === x) {
				if (!has_nc) ncss.push(nc);
				has_nc = true;
				continue;
			}

			j = index_of ? c.indexOf(x) : this.indexOf(c, x);

			if (j !== -1) {
				change = true;
				continue;
			}

			ncss.push(x);
		}

		if (!has_nc) {
			ncss.push(nc);
			change = true;
		}

		if (change) {
			n.className = ncss.join(' ');
		}

		return change;
	};

	r = -1;
	for (i = 0; i < l; i++) if (x = acss[i]) {
		j = index_of ? c.indexOf(x) : this.indexOf(c, x);

		if (j === -1) {
			ncss.push(x);
			continue;
		}

		r = j;
	};

	if (++r >= c.length) {
		r = 0;
	};

	x = c[r];
	if (x && x !== '~') {
		ncss.push(x);
	};

	n.className = ncss.join(' ');

	return true;
};


core.near = function (s, node, cb) {
	var n = core.css_first(s, node.parentNode);

	for (; n; n = core.css_next(s, n)) {
		if (n !== node && cb(n) === false) {
			break;
		};
	};
};

