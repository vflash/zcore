﻿
var module = {
	addEvent: function (p, h, up) {
		switch (typeof p) {
			case 'string':
				return this.addEventListener(p, h, up);

			case 'object':
				for (var i in p) {
					if (typeof p[i] == 'function') {
						this.addEventListener(i, p[i], up);
					};
				};

				return this;
		}
	},

	// n {string} - name
	// cb {function} - Listener
	// f {boolean} - first
	addEventListener: function (n, cb, f) { //f - first
		if (n && cb) {
			var g = this._events_list || (this._events_list = {}), a = g[n];
			a ? f ? a.unshift(cb) : a.push(cb) : g[n] = [cb];
		}

		return cb;
	},

	removeEventListener: function (n, cb) {
		var g = this._events_list, a, u, i;
		if (a = g && g[n]) {
			for (i = a.length; i--; ) if (a[i] === cb) a.splice(i, 1)
		}
	},

	removeEventAll: function (n) {
		var g = this._events_list;
		if (g && g[n]) delete (g[n]);
	},

	initEvent: function (n, e1, e2, e3) {
		var u
		, a = (this._events_list||false)[n]
		, call = Function.call
		, ag = arguments
		, i = 0, fn
		;

		if (a) {
			ag[0] = this;

			while (i < a.length) if (fn = a[i++]) {
				if (call.apply(fn, ag) === false) return false;
			};
		};
	},

	initEvent_: function (name, as) {
		var u
		, a = (this._events_list||false)[name]
		, i = 0, fn
		;

		if (a) {

			if (typeof as === 'function') {
				while (i < a.length) if (fn = a[i++]) {
					if ( as(fn) === false ) return false;
				};

			} else if (as) {
				while (i < a.length) if (fn = a[i++]) {
					if (fn.apply(this, as) === false) return false;
				};
			};
		};
	}
};