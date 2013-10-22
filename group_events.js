


var module = function (x) {
	var u
	, connected = !x ? false : true
	, list = []
	;

	return function (node, event, handler, dn) {
		var i, x;

		switch (node) {
			case 'start': case 'open':
				if (!connected) {
					connected = true;
					for (i = 0; x = list[i]; i++) {
						core.up(x[0], x[1], x[2], x[3]);
					}
				}
				return;

			case 'close':
				if (connected) { connected = false;
					for (i = 0; x = list[i]; i++) {
						core.dn(x[0], x[1], x[2], x[3]);
					}
				};
				return;

			case 'reset':
				if (connected) { connected = false;
					for (i = 0; x = list[i]; i++) {
						core.dn(x[0], x[1], x[2], x[3]);
					}
				};

				list.length = 0;
				return;
		};

		list.push([node, event, handler, dn]);

		if (connected) {
			core.up(node, event, handler, dn);
		};

		return handler;
	};
};


