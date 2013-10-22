
var module = ComponentEvents;

/*
componentEvents(this.parent); // перевключит всех слушателей на другой элемент
componentEvents(null); // снимит всех слушателей

componentEvents('connect', fucntion() { // добавит слушателя на элемент
	
});
*/



function ComponentEvents(cmp, x) {
	var u
	, connected = !x ? false : true
	, list = []
	;

	return function (event, handler, dn) {
		var i, x;

		if (typeof event === 'object') {
			if (event === cmp) return;
			if (cmd) {
				for (i = 0; x = list[i]; i++) {
					core.dn(cmp, x[1], x[2], x[3]);
				};
			};

			if (cmd = event) {
				for (i = 0; x = list[i]; i++) {
					core.up(cmp, x[1], x[2], x[3]);
				};
			};

			return;
		};

		list.push([event, handler, dn]);

		if (cmd) {
			core.up(cmd, event, handler, dn);
		};

		return handler;
	};
};

