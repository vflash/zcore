
var JSONPLOADER = window.JSONPLOADER = {idx: 1};
var module = jsonp_loader;

function jsonp_loader(url, event) {
	if (!url || !JSONPLOADER.idx) return;
	var e = 'ev' + (JSONPLOADER.idx++).toString(32), ok;

	JSONPLOADER[e] = function(v) {
		if (ok) return;
		ok = true;

		delete(JSONPLOADER[e]);
		if (event) event(true, v);
	};

	core.appendScript(
		url+(url.indexOf('?')?"&":"?")+"rnd="+(Math.random().toString(32).substr(2, 6))+"&jsonp=JSONPLOADER."+e
		, {
			charset: "utf-8",
			defer: true,

			event: function(status, s) {
				if (ok) return;
				ok = true;

				delete(JSONPLOADER[e]);
				if (event) event(false);
			}
		}
	);
};
