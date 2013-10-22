
var goY, goX, timmer;
var doc = document;
var SPEED = 20;
var lastScrollTime = false;

var module = function(x, y, speed) {
	y = Math.floor(+y);
	x = Math.floor(+x);

	if (speed >= 0) SPEED = speed;

	if (x < 0) x = 0;
	if (y < 0) y = 0;

	if (x == x && y == y) {
		step(goX = x, goY = y);

	} else {
		
	};
};


core.extend(module, expansion_event);

module.progress = false;

function step() {
	timmer = false;

	var csz = core.getClientSize(doc);

	var X = Math.floor(csz.sl);
	var Y = Math.floor(csz.st);

	var tm = +new Date(), dSTm =  lastScrollTime !== false ? tm - lastScrollTime : 0;
	lastScrollTime = tm;

	var KS = dSTm < 100 ? 6 : dSTm < 200 ? 5 : dSTm < 500 ? 3 : 1.5;

	if (goX < 0) {goX = 0} else if (goX > csz.sw) {goX = csz.sw};
	if (goY < 0) {goY = 0} else if (goY > Math.floor(csz.sh - csz.h)) {goY = Math.floor(csz.sh - csz.h)};

	if (Y != goY || X != goX) {
		
		if (Y < goY) {
			Y = goY - Y < 30 ? goY : Math.min(goY, Y + Math.max(24, Math.min(800, Math.round((goY - Y)/KS))) );
		} else {
			Y = Y - goY < 30 ? goY : Math.max(goY, Y - Math.max(24, Math.min(800, Math.round((Y - goY)/KS))) );
		};

		if (X < goX) {
			X = Math.min(goX, X+20);
		} else {
			X = Math.max(goX, X-20);
		};

		module.progress = Y != goY || X != goX;

		module.initEvent('prestep', X, Y, goX, goY);
		core.scrollTo(doc, X, Y);
		module.initEvent('step', X, Y, goX, goY);

		if (Y != goY || X != goX) {
			timmer = setTimeout(step, SPEED);
		} else {
			lastScrollTime = false;
			module.initEvent('end');
		};

	} else {
		module.progress = false;
		lastScrollTime = false;
		module.initEvent('end');
	};
};


core.up(document, 'mouseScroll mousedown touchstart', function() {
	var xx = module.progress;
	module.progress = false;
	lastScrollTime = false;

	if (timmer) clearTimeout(timmer);
	goY = null;
	
	if (xx) module.initEvent('end');
});

