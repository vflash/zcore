
var module = unEntities;

var SFCCode = String.fromCharCode;
var xharsQuot={constructor: false, hasOwnProperty: false, isPrototypeOf: false, propertyIsEnumerable: false, toLocaleString: false, toString: false, valueOf: false
	, quot: '"'
	, QUOT: '"'
	, amp: '&'
	, AMP: '&'
	, nbsp: '\u00A0'
	, apos: '\''
	, lt: '<'
	, LT: '<'
	, gt: '>'
	, GT: '>'
	, copy: '\u00A9'
	, laquo: '\u00AB'
	, raquo: '\u00BB'
	, reg: '\u00AE'
	, deg: '\u00B0'
	, plusmn: '\u00B1'
	, sup2: '\u00B2'
	, sup3: '\u00B3'
	, micro: '\u00B5'
	, para: '\u00B6'
};

function unEntities(s) {
	s = String(s);
	if (s.length > 3 && s.indexOf('&') !== -1) {
		s = s.replace(/&#(\d+);|&#x([0123456789abcdef]+);|&(\w+);/ig, rpEntities);
	};

	return s;
};

function rpEntities(s, d, x, z) {
	if (z) {
		return xharsQuot[z] || s;
	};

	return d ? SFCCode(d) : SFCCode(parseInt(x, 16));
};

