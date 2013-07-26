module = xhr_send;


var clss = function(){};
clss.prototype = {
	xhr: null,
	
	abort: function () {
		var xhr = this.xhr;
		if (xhr) {
			this.xhr = null;
			try {
				xhr.abort();
				xhr.onreadystatechange = null
			} catch (e) { }
		}
	}
};

function paramsTo_xFormUrlEncoded(p) {
	var q = [], i, j, x;

	for (i in p) {
		x = p[i];

		switch (core.type(x)) {
			case 'number':
				q.push(i + '=' + x);
				break;

			case 'string':
				q.push(i + '=' + encodeURIComponent(x));
				break;
			
			case 'boolean':
				q.push(x ? i + '=true' : i + '=false');
				break;

			case 'array':
				for (j = 0; j < x.length; j+=1) {
					switch (typeof x[j]) {
						case 'number':
							q.push(i + '=' + x[j]);
							break;

						case 'string':
							q.push(i + '=' + encodeURIComponent(x[j]));
							break;
						
						case 'boolean':
							q.push(x[j] ? i + '=true' : i + '=false');
							break;
					};
				};

				break;
		}
	};

	return q.join('&');
};





function xhr_send(prm) {
	if (!prm || !prm.url) return;

	var obj = new clss();
	var xhr = core.newHttpRequest();

	var cb = typeof prm.event == 'function' ? prm.event : null;
	var end = typeof prm.end == 'function' ? prm.end : null;

	var i, x;
	var async = prm.async !== false;
	var url = prm.url;
	var p = prm.data, q = '';
	var json = prm.dataType == 'json';

	var postType = prm.post && typeof prm.post == 'string' ? prm.post : 'application/x-www-form-urlencoded';


	function complit() {
		var status = xhr.status;
		var text = xhr.responseText;
		var data = text;


		if (json) {
			try {
				data = window.JSON && JSON.__native_ !== false ? JSON.parse(data) : (new Function('return ' + data))()
			} catch (e) {
				status = 'error json';
				data = null;
			};
		};

		if (end) {
			if (status == 200) status = true;
			json ? end(status, data, text) : end(status, text);
		} ;

		if (cb) { // 
			if (status == 200) status = false;
			json ? cb(data, status, text) : cb(text, status);
		};
	};

	switch (postType) {
		case 'multipart/form-data':
			break;

		case 'application/json':
			q = typeof p == 'string' ? p : JSON.stringify(p);
			break;

		case 'text/plain':
			q = typeof p == 'string' ? p : null;
			break;

		case 'application/x-www-form-urlencoded':
		default:
			if (typeof p === 'string') {
				q = p;
			} else if (typeof p == 'object' && p) {
				q = paramsTo_xFormUrlEncoded(p);
			};
	};

	if (!prm.post && q) {
		url += (url.indexOf('?') != -1 ? (/[\?\&]$/.test(url) ? '' : '&') : '?') + q;
	};

	if (prm.rndURL) {
		url += (url.indexOf('?') != -1 ? (/[\?\&]$/.test(url) ? '' : '&') : '?')
			+ (typeof prm.rndURL == 'string' ? prm.rndURL + '=' : 'rnd=')
			+ Math.random().toString(32).substr(2, 5)
		;
	};

	if (prm.post && xhr.overrideMimeType) {
		xhr.overrideMimeType('text/plain');
	};

	/*
	if (async && typeof prm.timeout === 'number') {
		xhr.timeout = typeof prm.timeout === 'number' ? prm.timeout : 7000;
	};
	*/


	/*
	var timeST = +new Date(), xlog = [];
	function log(x) {
		if (x === true) return alert(xlog.join('\n'))
		xlog.push((new Date() - timeST) +'\t\t'+x);
	};
	*/


	/* -- */
	var tmEnd = +new Date() + (typeof prm.timeout === 'number' ? prm.timeout : 7000), tmLimit = tmEnd + 60000;
	var timeout = !async ? false : setTimeout(tmout, 500);

	xhr.onprogress = !async ? null : function(e) {
		if (tmEnd - new Date() < 5000) {
			tmEnd = Math.min(+new Date() + 5000, tmLimit);
		};

		//log('progress - '+ (tmEnd - timeST))
	};

	function tmout() {
		if (+new Date() < tmEnd) {
			timeout = setTimeout(tmout, 500);
			return;
		};

		var x = xhr;
		xhr = {status: 0, responseText: ''};

		obj.xhr = null;

		try {x.abort(); x.onreadystatechange = null} catch (e) { };
		complit();

		//log('ontimeout'); log(true);
	};


	xhr.open(prm.post ? 'POST' : 'GET', url, async);

	if ((cb||end) && async) {
		obj.xhr = xhr;

		xhr.onreadystatechange = function () {
			//log('~change: '+ xhr.readyState);

			if (!obj.xhr || xhr.readyState != 4) return;
			clearTimeout(timeout);

			obj.xhr = null;

			var x = xhr;
			xhr = {
				status: x.status,
				responseText: x.responseText
			};

			try {x.abort(); x.onreadystatechange = null} catch (e) { };
			setTimeout(complit, 1);
			
			//log(true);
		};
	};

	if (prm.post) {
		xhr.setRequestHeader('Content-Type', postType);
		if (q) xhr.setRequestHeader('Content-Length', q.length);
	};

	try {
		xhr.send(prm.post && q ? q : null);

	} catch (e) {
		xhr = {status: 0, responseText: null};
		obj.xhr = null;

		if (async) {
			xhr.onreadystatechange = null;
			setTimeout(complit, 1);
		};
	};


	if ((cb||end) && !async) {
		complit();
	};

	return obj;
};
