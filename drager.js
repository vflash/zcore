

/*
{
	mousedown: function() {
		this.drager('init', {
			document: document,
			cursore: 'move',
			rectSize: 10,
			rectElement: html_eleemnt
		});
	},
	
	drager: core.new_drager({
		start: function() {...},
		end: function() {...},
		move: function(e) {
			var deltaX = e.pageX - e.pageXStart;
			var deltaY = e.pageY - e.pageYStart;

			e.title = "x:" + deltaX;
		},

		drag: function(e) {
			var element = e.get(e.pageX, e.pageY);
		}
	})
}

*/

var module = new function() {
	return function new_drager(p) {
		var dg = create_drager();

		if (typeof p.start === 'function') dg('start', p.start);
		if (typeof p.move === 'function') dg('move', p.move);
		if (typeof p.drag === 'function') dg('drag', p.drag);
		if (typeof p.end === 'function') dg('end', p.end);

		return dg;
	};

	function create_drager() {

		var handlers = {start: [], move: [], drag: [], end: []};

		var dg = function(cmd, p) {
			switch(cmd) {
				case 'init':
					init(handlers, create_drager, p)
					break;

				case 'stop':
					break;

				case 'start':
					if (typeof p === 'function') {
						handlers.start.push(p);
					};
					break;

				case 'move':
					if (typeof p === 'function') {
						handlers.move.push(p);
					};
					break;

				case 'drag':
					if (typeof p === 'function') {
						handlers.drag.push(p);
					};
					break;

				case 'end':
					if (typeof p === 'function') {
						handlers.end.push(p);
					};
					break;
			};
		};
		
		return dg; 
	};



	function init(handlers, context, p) {
		var is_start;
		var doc = p.document || document;

		var ev = new GroupEvents(true);

		ev(doc, 'mousedown', function(event) {
			if (is_start) return;
			is_start = true;

			if (event.preventDefault) {event.preventDefault()} else {event.returnValue = false};

			var confg = {
				document: doc,
				context: context,
				handlers: handlers,
				params: p,

				interval: p.interval === false || (typeof p.interval  == 'number' && p.interval > 1) ? p.interval : 20,

				clearRange: !!p.clearRange,
				autoScroll: !!p.autoScroll || p.autoScroll == null,
				isFromPoint: !!p.isFromPoint,
				cursor: p.cursor,

				_clientX: event.clientX,
				_clientY: event.clientY
			};

			confg.hasPagePosition = typeof event.pageY == 'number';
			confg.screen = core.WebKit || doc.compatMode != 'CSS1Compat' ? doc.body : doc.documentElement;
			

			confg.clientHeight = doc.documentElement.clientHeight;
			confg.scrollHeight = doc.documentElement.scrollHeight;

			if (confg.hasPagePosition) {
				confg.pageXStart = event.pageX;
				confg.pageYStart = event.pageY;
			} else {
				confg.pageXStart = confg._clientX + confg.screen.scrollLeft;
				confg.pageYStart = confg._clientY + confg.screen.scrollTop;
			};


			start(confg, ev);
		});

		ev(document, 'mouseup', function(e) {
			if (!is_start) ev('close');
		});
	};


	function nullFunc() {};

	function start(confg, ev) {

		nullFunc.prototype = confg.params;

		var is_start, is_end, timmer
		, document = confg.document
		, draglayer = getDragLayer(document)
		, EVENT = new nullFunc()
		, context = confg.context
		, handlers_start = confg.handlers.start
		, handlers_move = confg.handlers.move
		, handlers_drag = confg.handlers.drag
		, handlers_end = confg.handlers.end
		, hasPagePosition = confg.hasPagePosition
		, autoScroll = confg.autoScroll
		, screen = confg.screen
		, interval = confg.interval
		, clientX = confg._clientX
		, clientY = confg._clientY
		, scrollX = screen.scrollLeft
		, scrollY = screen.scrollTop
		, clientHeight = confg.clientHeight // высота экрана
		, scrollHeight = confg.scrollHeight // высота документа
		, pageX, pageY
		;


		draglayer.cursor = confg.cursor;

		EVENT.clientXStart = clientX;
		EVENT.clientYStart = clientY;
		EVENT.pageXStart = confg.pageXStart;
		EVENT.pageYStart = confg.pageYStart;

		document.onselectstart = core.breakEvent;
		
		
		EVENT.get = function() {
			var n
			, x = core.IE || core.Gecko || core.Opera >= 12 ? clientX : pageX
			, y = core.IE || core.Gecko || core.Opera >= 12  ? clientY : pageY
			;

			draglayer.hidden(true);
			n = document.elementFromPoint(x, y);
			draglayer.hidden(false);

			//document.title = n;

			return n;
		};



		function setPosition(e) {
			clientX = e.clientX;
			clientY = e.clientY;

			if (hasPagePosition) {
				pageX = e.pageX;
				pageY = e.pageY;
			} else {
				pageX = clientX + scrollX;
				pageY = clientY + scrollY;
			};
		};

		function move() {
			if (timmer) clearTimeout(timmer);

			EVENT.clientX = clientX;
			EVENT.clientY = clientY;
			EVENT.pageX = pageX;
			EVENT.pageY = pageY;

			if (!is_start) {
				if (Math.sqrt(Math.pow(pageX - confg.pageXStart, 2) + Math.pow(pageY - confg.pageYStart, 2)) < 10) {
					return;
				};

				is_start = true;
				
				EVENT.type = 'start';
				initEvents(handlers_start, EVENT, context);

				if (core.IE < 9) draglayer.show(confg.cursor);
			};



			
			if (!(core.IE < 9 || is_end)) { 
				draglayer.setPoint(clientX, clientY);
			};

			EVENT.type = 'move';
			initEvents(handlers_move, EVENT, context);

			timmer = false;
		};

		ev(document, 'scroll', function(e) {
			var x = pageX, y = pageY;

  
			scrollX = screen.scrollLeft;
			scrollY = screen.scrollTop;

			pageX = clientX + scrollX;
			pageY = clientY + scrollY;
			
			if (core.IE < 9) {
				// для elementFromPoint
				document.fireEvent ('onmousemove', document.createEventObject());
			};

			if (x !== pageX || y !== pageY) {
				move();
			};
		});

		ev(document, 'mouseup', function end(e) {
			if (timmer) clearTimeout(timmer);

			document.onselectstart = null;

			ev('close');
			draglayer.hide();

			if (!is_start) return;
			is_end = true;

			setPosition(e);

			move();

			EVENT.type = 'end';
			EVENT.clientX = clientX;
			EVENT.clientY = clientY;
			EVENT.pageX = pageX;
			EVENT.pageY = pageY;

			initEvents(handlers_end, EVENT, context);
		});

		ev(document, 'mousemove', function(e) {
			setPosition(e);

			if (autoScroll) {
				var cx;
				if (cx = clientY > clientHeight - 30) {
					
					if ((scrollY + clientHeight + 30) > scrollHeight) {
						screen.scrollTop = scrollHeight - clientHeight;
					} else {
						screen.scrollTop += 27;
					};
				} 
				else if (cx = clientY < 30 && scrollY > 0) {
					screen.scrollTop -= 27;
				};

				if (cx) {
					scrollY = screen.scrollTop;
					pageY = clientY + scrollY;
					// document.fireEvent ("onmousemove", document.createEventObject());
				};
			};


			if (!timmer) {
				if (interval === false || !is_start) {
					move();
				} else {
					timmer = setTimeout(move, interval);
				};
			};
		});
	};
	
	function initEvents(handlers, data, context) {
		var i = 0, l = handlers.length;

		for (;i < l; i++) {
			handlers[i].call(context, data);
		};
	};
};




/*
domReady(function() {
	var _ = domMaster, ns = {};

	_('body'
		, ns.node = _('div', {style: 'width:120px;height:120px;background-color:#f00;position: absolute;left:100px;top:100px;z-index:9999;'})
	)

	var drager = core.new_drager({
		start: function(e) {
			var s = core.getCStyle(ns.node);

			e.startPosLeft = ns.node.offsetLeft;
			e.startPosTop = ns.node.offsetTop;
			
			core.style(ns.node, {opacity: 0.5});
		},

		end: function(e) {
			var s = ns.node.style, xn;
			s.display = 'none';
			xn = e.get();
			s.display = '';
			
			core.style(ns.node, {opacity: 1});
		},

		move: function(e) {
			var deltaX = e.pageX - e.pageXStart;
			var deltaY = e.pageY - e.pageYStart;


			var s = ns.node.style, xn;

			s.display = 'none';
			xn = e.get();
			s.left = (e.startPosLeft + deltaX) + 'px';
			s.top = (e.startPosTop + deltaY) + 'px';
			s.display = '';

			if (xn) {
					document.title = xn.nodeName + (xn.className ? '.'+xn.className : '') + (xn.id ? '#'+xn.id : '');
			};
			
		}
	});
	
	core.up(ns.node, 'mousedown', function() {
		drager('init', {
			interval: 10,
			document: document,
			cursore: 'move',
			rectSize: 10
		});
	})

})
*/