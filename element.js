

var module = ElementBase;


/*
	-------------------------------------
*/

var ElementBase = core.new_class(function() {

	this.constructor = function(master) {
		this.document = master.document;
		var self = this;

		this.groupEvents = new GroupEvents(false);

		if (typeof this.valid === 'function') {
			this.set = elemSet(null, this.valid, this.refresh);
		};

		this.parentComponentEvents = new ComponentEvents(null);
		this.parentComponentEvents('connect', function() {
			this.is_connected = parent.is_connected ? true : false;
			self.refresh();

			self.initEvent('connect');
		});
	};


	this.prototype = core.extend(null, expansionEvent, {
		is_connected: false,
		nodeType: -1,

		_changes: null,

		groupEvents: null,
		parentComponentEvents: null,
		parent: null, // теневой родительский обьект
		

		refresh: function(hashChange) {},
		valid: null, // function(param, newValue, presValue) {...}
		set: null,

		reflow: function(x) {this.initEvent('reflow', x)},

		connectAuto: function(nodes) {
			for(i in nodes) {
				x = nodes[i] || false;
				if (x.nodeType < 0 && typeof x.connect === 'function') {
					x.connect(this, this.is_connected);
				};
			};
		},


		connect: function(parent, is_connected) {
			var self = this;

			if (parent !== this.parent) {
				this.parentComponentEvents(this.parent = parent || null);
			};

			if (typeof is_connected !== 'boolean') {
				is_connected = (this.parent||false).is_connected ? true : false;
			};

			if (this.is_connected !== is_connected) {
				this.groupEvents(is_connected ? 'start' : 'stop');

				this.is_connected = is_connected ? true : false;
				this.refresh();

				this.initEvent('connect');
			};
		},


		appendChild: function(x, boxNode) {
			if (x == null || typef x !== 'object') return;

			var boxNode = boxNode || this.box || this.node;

			if (x.nodeType > 0) {
				return boxNode.appendChild(x);
			};

			if (x.node) boxNode.appendChild(x.node);
			if (typeof x.connect === 'function') {
				x.connect(this, this.connected);
			};
		},

		removeParent: function () { // отключается от родителя
			var x;
			if (x = (this.node || false).parentNode) {
				x.removeChild(this.node);
			};

			this.connect(null, false);
		}
		
	});


});


function elemSet(set, end) {
	return function setInterface(params, force, qF) {
		/*
			set({key: value, ...}, force);
			set(key, value, force);
		*/

		var u, self = this, vs = self
		, ch = self._changes || (self._changes = {})
		, value, pv, v, i
		;

		switch (typeof params) {
			case 'boolean': force = params; break;

			case 'string': case 'number':
				var value = force;
				if (value === u || value === (pv = vs[p])) {
					break;
				};

				v = set.call(self, p, value, pv);
				if (v === u || v === pv) {
					break;
				};

				ch[p] = true;
				vs[p] = v;

				if (qF !== false) {
					this._changes = {};

					if (end.call(self, ch) === false) {
						this._changes = ch;
					};
				};

				return;

			case 'object': 
				for (i in p) {
					value = p[i];
					if (value === u || value === (pv = vs[i]) ) {
						continue;
					};

					v = set.call(self, i, value, pv);
					if (v === u || v === pv) {
						continue;
					};

					ch[i] = true;
					vs[i] = v;
				};

				break;


			default: return;
		};

		if (force !== false) for (i in ch) {
			this._changes = {};

			if (end.call(self, ch) === false) {
				this._changes = ch;
			};
		};
	}
};




