

//var module = BaseElement;


/*
	-------------------------------------
*/

var module = core.new_class(function() {

	this.constructor = function BaseElement(master) {
		this.document = master.document;
		var self = this;

		this.groupEvents = new GroupEvents(false);

		this.parentComponentEvents = new ComponentEvents(null);
		this.parentComponentEvents('connect', function(x, vv) {
			self.is_connected = (self.parent||false).is_connected ? true : false;
			self.refresh();

			self.initEvent('connect', self);
		});

	};


	this.prototype = core.extend(null, expansionEvent, {
		is_connected: false,
		nodeType: -1,

		_changes: null,

		groupEvents: null,
		parentComponentEvents: null,
		parent: null, // теневой родительский обьект

		valid: function(param, newValue, presValue) {
			return;
		},

		set: function(params, stopRefresh, sR) {
			/*
				set({key: value, ...}, stopRefresh);
				set(key, value, stopRefresh);
			*/
			if (params == null) return;

			var u, self = this, vs = this
			, ch = this._changes || (this._changes = {})
			, valid = this.valid
			, value, pv, v, i
			;

			switch (typeof params) {
				//case 'boolean': force = params; break;

				case 'string': case 'number':
					var value = stopRefresh;
					if (value === u || value === (pv = vs[params])) {
						break;
					};

					v = valid.call(self, params, value, pv);
					if (v === u || v === pv) {
						break;
					};

					ch[params] = true;
					vs[params] = v;

					if (!sR) {
						this.refresh(false, ch);
					};

					return;

				case 'object': 
					for (i in params) {
						value = params[i];
						if (value === u || value === (pv = vs[i]) ) {
							continue;
						};

						v = valid.call(self, i, value, pv);
						if (v === u || v === pv) {
							continue;
						};

						ch[i] = true;
						vs[i] = v;
					};

					break;


				default: return;
			};

			if (!stopRefresh) for (i in ch) {
				this.refresh(false, ch);
			};
		},

		refresh: function(force, changes) {
			this._changes = {};

			/*
			var changes = this._changes;
			this._changes = {};

			if (_refresh(this, changes, force) === false) {
				this._changes = changes;
			};
			*/
		},

		reflow: function(x) {
			this.initEvent('reflow', x);

			if (typeof (this.parent||false).reflow === 'function') {
				this.parent.reflow(this);
			};
		},


		connectChilds: function(nodes) {
			for(i in nodes) {
				x = nodes[i] || false;
				if (x.nodeType < 0 && typeof x.connect === 'function') {
					if (!x.parent) x.connect(this, this.is_connected);
				};
			};
		},

		connect: function(parent, is_connected) {
			var self = this;
			if (typeof parent !== 'object') return;

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
				

				this.initEvent('connect', this);
			};

			return this;
		},


		appendChild: function(x, boxNode) {
			if (x == null || typeof x !== 'object') return;

			//var boxNode = boxNode || this.box || this.node;
			for(boxNode = boxNode || this; boxNode.nodeType < 0;) {
				boxNode = boxNode.box || boxNode.node || false;
			};

			if (x.nodeType > 0) {
				return boxNode.appendChild(x);
			};

			var n = x; while(n.nodeType < 0) n = n.node || false;
			if (n.nodeType > 0) boxNode.appendChild(n);
			//if (x.node) boxNode.appendChild(x.node);

			if (typeof x.connect === 'function') {
				x.connect(this, this.is_connected);
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




