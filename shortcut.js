// shortcut 

var module = new new_shortcut(document);

var KEYS = {
	'192': '`',
	'222': '\'',
	'191': '?',
	'109': '-',
	'107': '+',
	'190': '>',
	'188': '<',
	'32': 'space',
	'8': 'backspace',
	'13': 'enter',
	'9': 'tab',
	'27': 'esc',
	'37': 'left',
	'38': 'up',
	'39': 'right',
	'40': 'down'
};

function conv_comb(cmb) {
	if (!cmb) return;

	var u
	, a = cmb.toLowerCase().split('+')
	, i, v, key, kC, kS, kA
	;

	for (i in a) {
		switch (v = rr.trim(a[i])) {
			case 'ctrl':
				kC = true;
				break;
			case 'shift':
				kS = true;
				break;
			case 'alt':
				kA = true;
				break;
			default:
				if (v) key = v;
		};
	};

	if (key) {
		v = '';
		v += kC ? 'ctrl+' : '';
		v += kA ? 'alt+' : '';
		v += kS ? 'shift+': '';
		return v + key;
	};
};


function new_shortcut(doc) {
	var events = {};
	var doc = doc || document;
	var stopKeyPress;
	var noinit = true;
	
	if (doc.__shortcut_) return doc.__shortcut_;

	function up_event(cmb, func, up) {
		if (typeof cmb !== 'string' || typeof func !== 'function') {
			return;
		};


		var u
		, m = cmb.split(/[\s,]+/)
		, l = m.length
		, i = 0
		, name, x, a
		;

		for(; i < l; i++) {
			if (name = m[i]) {
				name = String(name).toLowerCase();
				a = events[name] || (events[name]=[]);
				top ? a.unshift(func) : a.push(func);
			};
		};

		noinit = false;
	};

	function dn_event(cmb, func) {
		if (typeof cmb !== 'string' || typeof func !== 'function') {
			return;
		};

		var u
		, m = cmb.split(/[\s,]+/)
		, l = m.length
		, i = 0, j = 0, p
		, name, x, a, p
		;

		for(; i < l; i++) {
			if (name = m[i]) {
				name = String(name).toLowerCase();

				if (a = events[name]) {
					for(p = 0, j = 0; x = a[j++];) {
						if (x !== func) a[p++] = x;
					};

					a.length = p;
				};
			};
		};
	};

	var NKEYUP = 0;

	function ev_keydown(e) {
		if (noinit) return;

		stopKeyPress = false;

		var u
		, code = e.keyCode || e.which || null
		, key = code > 111 && code < 124 ? 'f' + (code - 111) : KEYS[code] || String.fromCharCode(code).toLowerCase()
		, comb, evn, func, i, m
		;


		if (code > 15 && code < 19) {
			return;
		};

		comb = '';
		comb += e.ctrlKey ? 'ctrl+' : '';
		comb += e.altKey ? 'alt+' : '';
		comb += e.shiftKey ? 'shift+' + key : key;

		var i, evn = {
			event: e,
			target: e.target || e.srcElement,
			NKEYUP: NKEYUP,

			stopPropagation: function() {
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				i = m.length;
			},
			

			preventDefault: function() {
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				stopKeyPress = true;
			},

			code: code,
			key: key,
			comb: comb
		};

		var m = events[comb];
		m = m ? m.concat() : false;

		for(i = 0; func = m[i++];) {
			func(evn);
		};
	};

	new function() {
		if (doc.addEventListener) {
			doc.addEventListener('keydown', ev_keydown, true);
			doc.addEventListener('keyup', function() {++NKEYUP}, true);

			if (!doc.documentMode) { // !IE
				doc.addEventListener('keypress'
					, function(e) {
						if (stopKeyPress) {
							e.preventDefault ? e.preventDefault() : e.returnValue = false;
						};
					}
					, true
				);
			};

		} else {
			doc.attachEvent('onkeydown', ev_keydown);
			doc.attachEvent('onkeyup', function() {++NKEYUP});
		};
	};

	return doc.__shortcut_ = {
		clone: new_shortcut,

		up: up_event,
		addEventListener: up_event,

		dn: dn_event,
		removeEventListener: dn_event
	};
};



