/*
HHS.START('/start', function(hash) {
	
})
*/

var trim = ''.trim ? function (s) {return (''+s).trim();} : new function () {
	var rg = /^[\s|\xA0]+|[\s|\xA0]+$/g;
	return function (s) {
		return typeof s == 'string' ? s.replace(rg, '') : String(s)
	}
};

var seek = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(fn) {
	setTimeout(fn, 0);
};

var module = CREATE(document);

function CREATE(document) {
	if (document._hashHistory) return document._hashHistory;

	var window = document.defaultView||document.parentWindow;
	var history = window.history;
	var historyAPI = typeof history.replaceState == 'function';

	var start = false;

	var self = document._hashHistory = {
		CREATE: CREATE,

		document: document,
		onchange: function (new_hash) { },

		current_hash: null,

		START: function(start_hash, onchange) {
			if (start) return; start = true;

			this.onchange = onchange;

			var x = document.location.hash.replace(/^#/, '') || trim(start_hash || '');
			if (x || document.location.hash) {
				document.location.replace('#' + x);
			};

			if (historyAPI) {
				window.addEventListener('popstate'
					, function(e){seek(function(){check()});}
					, false
				);
			};

			function _check() {check(); setTimeout(_check, 30)};
			_check();
		},

		replace: function (x, force) {
			if ( typeof x !== 'string' || this.current_hash == (x = trim(x)) ) {
				return
			};

			if (x || document.location.hash) document.location.replace('#'+x);
			this.current_hash = document.location.hash.replace(/^#/, '');

			change();
		},

		get: function () {return this.current_hash},

		set: function (x, force) {
			if ( typeof x !== 'string' || this.current_hash == (x = trim(x)) ) {
				return
			};

			if (x || document.location.hash) document.location.hash = x;
			this.current_hash = document.location.hash.replace(/^#/, '');

			if (historyAPI && /^#$/.test(document.location.hash)) {
				history.replaceState(history.state, document.title, document.location.href.replace(/#$/, '') );
			};

			change();
		}
	};


	return self;


	// ---------------------------------- ----------------------------------
	// ---------------------------------- ----------------------------------
	// ---------------------------------- ----------------------------------

	var _hash;
	function change() {
		if (_hash != self.current_hash) {
			_hash = self.current_hash;

			self.onchange(_hash);
		};
	};
	
	function check() {
		var x = document.location.hash.replace(/^#/, '');
		
		if (!x && historyAPI && /#$/.test(document.location.href)) {
			history.replaceState(history.state, document.title, document.location.href.replace(/#$/, '') );
		};

		if (x !== self.current_hash) {
			self.current_hash = x;
			change();
		};
	};

};