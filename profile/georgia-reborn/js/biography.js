﻿'use strict';
//window.DefinePanel('Biography', {author:'WilB', version: '1.1.3'});
const requiredVersionStr = '1.2.2'; function is_compatible(requiredVersionStr) {const requiredVersion = requiredVersionStr.split('.'), currentVersion = utils.Version.split('.'); if (currentVersion.length > 3) currentVersion.length = 3; for (let i = 0; i < currentVersion.length; ++i) if (currentVersion[i] != requiredVersion[i]) return currentVersion[i] > requiredVersion[i]; return true;} if (!is_compatible(requiredVersionStr)) fb.ShowPopupMessage(`Biography requires v${requiredVersionStr}. Current component version is v${utils.Version}.`);

const $Bio = {
	getDpi : () => {let dpi = 120; try {dpi = $Bio.WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");} catch (e) {} return Math.max(dpi / 120, 1);},
	isArray : arr => Array.isArray(arr),
	shuffle : arr => {for (let i = arr.length - 1; i >= 0; i--) {const randomIndex = Math.floor(Math.random() * (i + 1)), itemAtIndex = arr[randomIndex]; arr[randomIndex] = arr[i]; arr[i] = itemAtIndex;} return arr;},
	take : (arr, ln) => {if (ln >= arr.length) return arr; else arr.length = ln > 0 ? ln : 0; return arr;},
	WshShell : new ActiveXObject('WScript.Shell')
}

const sBio = {
	browser : (c, b) => {if (!sBio.run(c)) fb.ShowPopupMessage(b ? "Unable to launch your default browser." : "Unable to open windows explorer", "Biography");},
	buildPth : pth => {let result, tmpFileLoc = ""; const pattern = /(.*?)\\/gm; while ((result = pattern.exec(pth))) {tmpFileLoc = tmpFileLoc.concat(result[0]); sBio.create(tmpFileLoc);}},
	clamp : (num, min, max) => {num = num <= max ? num : max; num = num >= min ? num : min; return num;},
	create : fo => {try {if (!sBio.folder(fo)) sBio.fs.CreateFolder(fo);} catch (e) {}},
	debounce : (e,r,i) => {var o,u,a,c,v,f,d=0,m=!1,j=!1,n=!0;if("function"!=typeof e)throw new TypeError('debounce: invalid function');function T(i){var n=o,t=u;return o=u=void 0,d=i,c=e.apply(t,n)}function b(i){var n=i-f;return void 0===f||r<=n||n<0||j&&a<=i-d}function l(){var i,n,t=Date.now();if(b(t))return w(t);v=setTimeout(l,(n=r-((i=t)-f),j?Math.min(n,a-(i-d)):n))}function w(i){return v=void 0,n&&o?T(i):(o=u=void 0,c)}function t(){var i,n=Date.now(),t=b(n);if(o=arguments,u=this,f=n,t){if(void 0===v)return d=i=f,v=setTimeout(l,r),m?T(i):c;if(j)return v=setTimeout(l,r),T(f)}return void 0===v&&(v=setTimeout(l,r)),c}return r=parseFloat(r)||0,sBio.isObject(i)&&(m=!!i.leading,a=((j="maxWait"in i))?Math.max(parseFloat(i.maxWait)||0,r):a,n="trailing"in i?!!i.trailing:n),t.cancel=function(){void 0!==v&&clearTimeout(v),o=f=u=v=void(d=0)},t.flush=function(){return void 0===v?c:w(Date.now())},t}, isObject : function(t) {var e=typeof t;return null!=t&&("object"==e||"function"==e)},
	doc : new ActiveXObject('htmlfile'),
	file : f => sBio.fs.FileExists(f),
	folder : fo => sBio.fs.FolderExists(fo),
	fs : new ActiveXObject('Scripting.FileSystemObject'),
	get : function getProp(n, keys, defaultVal) {keys = $Bio.isArray(keys) ? keys : keys.split('.'); n = n[keys[0]]; if (n && keys.length > 1) {return getProp(n, keys.slice(1), defaultVal);} return n === undefined ? defaultVal : n;},
	gr : (w, h, im, func) => {let i = gdi.CreateImage(Math.max(w, 2), Math.max(h, 2)), g = i.GetGraphics(); func(g, i); i.ReleaseGraphics(g); g = null; if (im) return i; else i = null;},
	handle : (focus, ignoreLock) => !pBio.lock || ignoreLock ? fb.IsPlaying && !focus ? fb.GetNowPlaying() : fb.GetFocusItem() : pBio.lockHandle,
	htmlParse : (n, prop, match, func) => {
		 const ln = n == null ? 0 : n.length, sw = prop ? 0 : 1; let i = 0;
		 switch (sw) {
			 case 0: while (i < ln) {if (n[i][prop] == match) if (func(n[i]) === true) break; i++;} break;
			 case 1: while (i < ln) {if (func(n[i]) === true) break; i++;} break;
		}
	},
	jsonParse : (n, defaultVal, type, keys, isValid) => {
		switch (type) {
			case 'file': try {return JSON.parse(sBio.open(n));} catch (e) {return defaultVal;}
			case 'get': {if (isValid) {isValid = isValid.split("|"); if (!isValid.every(v => n.includes(v))) return false;} let data; try {data = JSON.parse(n);} catch (e) {return defaultVal;} if (keys) return sBio.get(data, keys, defaultVal); return data;}
			default: try {return JSON.parse(n);} catch (e) {return defaultVal;}
		}
	},
	lastModified : file => {try {return Date.parse(sBio.fs.GetFile(file).DateLastModified);} catch (e) {}}, // added try catch for rare cases where fileExists yet errors here [SMP not handling some special characters]
	objHasOwnProperty : (obj, key) => Object.prototype.hasOwnProperty.call(obj, key),
	open : f => sBio.file(f) ? utils.ReadTextFile(f) : '',
	padNumber : (num, len, base) => {if (!base) base = 10; return ('000000' + num.toString(base)).substr(-len);},
	query : (h, q) => {let l = FbMetadbHandleList(); try {l = fb.GetQueryItems(h, q);} catch (e) {} return l;},
	removeDiacritics : str => str.replace(/[^\u0000-\u007E]/g, n => sBio.diacriticsMap[n] || n), defaultDiacriticsRemovalMap : [{'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'}, {'base':'AA','letters':'\uA732'}, {'base':'AE','letters':'\u00C6\u01FC\u01E2'}, {'base':'AO','letters':'\uA734'}, {'base':'AU','letters':'\uA736'}, {'base':'AV','letters':'\uA738\uA73A'}, {'base':'AY','letters':'\uA73C'}, {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'}, {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'}, {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'}, {'base':'DZ','letters':'\u01F1\u01C4'}, {'base':'Dz','letters':'\u01F2\u01C5'}, {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'}, {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'}, {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'}, {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'}, {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'}, {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'}, {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'}, {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'}, {'base':'LJ','letters':'\u01C7'}, {'base':'Lj','letters':'\u01C8'}, {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'}, {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'}, {'base':'NJ','letters':'\u01CA'}, {'base':'Nj','letters':'\u01CB'}, {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'}, {'base':'OI','letters':'\u01A2'}, {'base':'OO','letters':'\uA74E'}, {'base':'OU','letters':'\u0222'}, {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'}, {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'}, {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'}, {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'}, {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'}, {'base':'TZ','letters':'\uA728'}, {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'}, {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'}, {'base':'VY','letters':'\uA760'}, {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'}, {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'}, {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'}, {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'}, {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'}, {'base':'aa','letters':'\uA733'}, {'base':'ae','letters':'\u00E6\u01FD\u01E3'}, {'base':'ao','letters':'\uA735'}, {'base':'au','letters':'\uA737'}, {'base':'av','letters':'\uA739\uA73B'}, {'base':'ay','letters':'\uA73D'}, {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'}, {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'}, {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'}, {'base':'dz','letters':'\u01F3\u01C6'}, {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'}, {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'}, {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'}, {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'}, {'base':'hv','letters':'\u0195'}, {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'}, {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'}, {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'}, {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'}, {'base':'lj','letters':'\u01C9'}, {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'}, {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'}, {'base':'nj','letters':'\u01CC'}, {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'}, {'base':'oi','letters':'\u01A3'}, {'base':'ou','letters':'\u0223'}, {'base':'oo','letters':'\uA74F'}, {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'}, {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'}, {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'}, {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'}, {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'}, {'base':'tz','letters':'\uA729'}, {'base':'u','letters':'\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'}, {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'}, {'base':'vy','letters':'\uA761'}, {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'}, {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'}, {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'}, {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}], diacriticsMap : {}, createDiacriticsMap : () => sBio.defaultDiacriticsRemovalMap.forEach(v => {for (let i = 0; i < v.letters.length; i++) sBio.diacriticsMap[v.letters[i]] = v.base;}),
	removeNulls : o => {const isArray = $Bio.isArray(o); Object.keys(o).forEach(v => {if (o[v].length == 0) isArray ? o.splice(v, 1) : delete o[v]; else if (typeof o[v] == "object") sBio.removeNulls(o[v]);});},
	replaceAt : (str, pos, chr) => str.substring(0, pos) + chr + str.substring(pos + 1),
	run : (c, w) => {try {typeof w === 'undefined' ? $Bio.WshShell.Run(c) : $Bio.WshShell.Run(c, w); return true;} catch (e) {return false;}},
	save : (fn, txt, bom) => {try {utils.WriteTextFile(fn, txt, bom)} catch (e) {sBio.trace("error saving: " + fn);}},
	scale : $Bio.getDpi(),
	sortKeys : o => Object.keys(o).sort().reduce((a, c) => (a[c] = o[c], a), {}),
	throttle : (e,i,t) => {var n=!0,r=!0;if("function"!=typeof e)throw new TypeError('throttle: invalid function');return sBio.isObject(t)&&(n="leading"in t?!!t.leading:n,r="trailing"in t?!!t.trailing:r),sBio.debounce(e,i,{leading:n,maxWait:i,trailing:r})},
	toRGB : c => [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff],
	trace : (message, n) => console.log("Biography" + (n ? " Server" : "") + ": " + message),
	value : (num, def, type) => {num = parseFloat(num); if (isNaN(num)) return def; switch (type) {case 0: return num; case 1: if (num !== 1 && num !== 0) return def; break; case 2: if (num > 2 || num < 0) return def; break;} return num;}
}

class PanelPropertyBio {
	constructor(name, default_value) {
		this.name = name;
		this.value = ppt.get(this.name, default_value);
	}

	get() {return this.value;}
	set(new_value) {if (this.value !== new_value) {ppt.set(this.name, new_value); this.value = new_value;}}
}

class PanelPropertiesBio {
	constructor() {
		this.name_list = {}; // collision checks only
	}
	init(type, properties, thisArg) {
		switch (type) {
			case 'auto':
				properties.forEach(v => {
					// this.validate(v); // debug
					this.add(v);
				});
				break;
			case 'manual':
				properties.forEach(v => thisArg[v[2]] = this.get(v[0], v[1]));
				break;
		}
	}

	validate(item) {
		if (!$Bio.isArray(item) || item.length !== 3 || typeof item[2] !== 'string') {
			throw ('invalid property: requires array: [string, any, string]');
		}
		if (item[2] === 'add') {
			throw ('property_id: '+ item[2] + '\nThis id is reserved');
		}
		if (this[item[2]] != null || this[item[2] + '_internal'] != null) {
			throw ('property_id: '+ item[2] + '\nThis id is already occupied');
		}
		if (this.name_list[item[0]] != null) {
			throw ('property_name: '+ item[0] + '\nThis name is already occupied');
		}
	}

	add(item) {
		this.name_list[item[0]] = 1;

		this[item[2] + '_internal'] = new PanelPropertyBio(item[0], item[1]);

		Object.defineProperty(this, item[2], {
			get() {return this[item[2] + '_internal'].get();},
			set(new_value) {this[item[2] + '_internal'].set(new_value);}
		});
	}

	get(n, v) {return window.GetProperty(`\u200A${n}`, v);}
	set(n, v) {return window.SetProperty(`\u200A${n}`, v);}
}

let properties = [
	[" Fallback  Text  Biography: Heading|No Heading", "Nothing Found|There is no biography to display", "bioFallbackText"],
	[" Fallback  Text  Review: Heading|No Heading", "Nothing Found|There is no review to display", "revFallbackText"],
	[" Heading  Title Format  Album Review [AllMusic]", "$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)", "amRevHeading"],
	[" Heading  Title Format  Album Review [Last.fm]", "$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)", "lfmRevHeading"],
	[" Heading  Title Format  Biography [AllMusic]", "$if2(%BIO_ARTIST%,Artist Unknown)", "amBioHeading"],
	[" Heading  Title Format  Biography [Last.fm]", "$if2(%BIO_ARTIST%,Artist Unknown)", "lfmBioHeading"],
	[" Heading  Title Format  Track Review [Last.fm]", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)", "lfmTrackHeading"],
	[" Heading Items 0 or 1", "BtnBg,1,BtnName,1,BtnRedLastfm,0,Text,1", "show"],
	[" Heading Metrics +/-", "Gap,0,BottomLinePad,0,BtnSize,0,BtnPad,0", "headerConfig"],
	[" Highlight Colour 0 or 1", "Btn,0,Heading,1,Line,1,Rim,1,Stars,1,Subheadings,1,Text,0", "hl"],
	[" Image Reflection Setting (0-100)", "Strength,14.5,Size,100,Gradient,10", "reflSetup"],
	[" Image Smooth Transition Level (0-100)", 92, "transLevel"],
	[" Layout Internal Padding", 20, "gap"],
	[" Layout Outer Padding Image  Left", 20, "borL"],
	[" Layout Outer Padding Image  Right", 20, "borR"],
	[" Layout Outer Padding Image  Top", 20, "borT"],
	[" Layout Outer Padding Image Bottom", 20, "borB"],
	[" Layout Outer Padding Text  Left", 20, "textL"],
	[" Layout Outer Padding Text  Right", 20, "textR"],
	[" Layout Outer Padding Text  Top", 20, "textT"],
	[" Layout Outer Padding Text Bottom", 0, "textB"],
	[" Menu Items Hide-0 Shift-1 Show-2", "Paste Text From Clipboard,1,Playlists,0,Write Tags to Selected Files,1,Missing Data,0", "menu_items"],
	[" Overlay Setting", "Strength,84.5%,Gradient,10%,RimWidth,1px", "fadeSetup"],
	[" Rating Position Prefer Heading-1 Text-2", 1, "star"],
	[" Rating Show AllMusic", true, "amRating"],
	[" Rating Show Last.fm", true, "lfmRating"],
	[" Rating Text Name AllMusic", "Album rating", "allmusic_name"],
	[" Rating Text Name Last.fm", "Album rating", "lastfm_name"],
	[" Rating Text Position Auto-0 Embed-1 Own Line-2", 0, "ratingTextPos"],
	[" Scroll Step 0-10 (0 = Page)", 3, "scrollStep"],
	[" Scrollbar Arrow Custom: Icon // Examples", "\uE0A0 // \u25B2 \uE014 \u2B9D \uE098 \uE09C \uE0A0 \u2BC5 \u23EB \u23F6 \u290A \uE018 \uE010 \uE0E4", "arrowSymbol"],
	[" Scrollbar Arrow Custom: Icon: Vertical Offset %", -24, "sbarButPad"],
	[" Scrollbar Colour Grey-0 Blend-1", 0, "sbarCol"],
	[" Scrollbar Narrow Bar Width 2-10 (0 = Default)", 0, "narrowSbarWidth"],
	[" Scrollbar Size", "Bar," + Math.round(11 * sBio.scale) + ",Arrow," + Math.round(11 * sBio.scale) + ",Gap(+/-),0,GripMinHeight," + Math.round(20 * sBio.scale), "sbarMetrics"],
	[" Scrollbar Type Default-0 Styled-1 Themed-2", "0", "sbarType"],
	[" Statistics Show Last.fm Metacritic Score", true, "score"],
	[" Statistics Show Last.fm Scrobbles & Listeners", true, "stats"],
	[" Subheading  [Source]  Text  Biography [AllMusic]: Heading|No Heading", "AllMusic|AllMusic Biography", "amBioSubHead"],
	[" Subheading  [Source]  Text  Biography [Last.fm]: Heading|No Heading", "Last.fm|Last.fm Biography", "lfmBioSubHead"],
	[" Subheading  [Source]  Text  Review [AllMusic]: Heading|No Heading", "AllMusic|AllMusic Review", "amRevSubHead"],
	[" Subheading  [Source]  Text  Review [Last.fm]: Heading|No Heading", "Last.fm|Last.fm Review", "lfmRevSubHead"],
	[" Subheading  [Track Review]  Title Format  [Last.fm]", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)", "lfmTrackSubHeading"],
	[" Text Align Always Top", true, "topAlign"],
	[" Touch Step 1-10", 1, "touchStep"],
	[" Zoom Button Size (%)", 100, "zoomBut"],
	[" Zoom Font Size (%)", 100, "zoomFont"],
	[" Zoom Heading Font Size (%)", 115, "zoomHead"],
	["_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0", "customInfo"],
	["_CUSTOM COLOURS/FONTS: USE", false, "customCol"],
	["_Custom.Font (Name,Size,Style[0-4])", "Segoe UI,16,0", "custFont"],
	["_Custom.Font Heading (Name,Size,Style[0-4])", "", "custHeadFont"],
	["_Custom.Font Icon [Scroll] (Name,Style[0or1])", "Segoe UI Symbol,0", "butCustIconFont"],
	["ADV.Heading BtnName Biography [AllMusic]", "allmusic", "amBioBtn"],
	["ADV.Heading BtnName Biography [Last.fm]", "last.fm", "lfmBioBtn"],
	["ADV.Heading BtnName Review [AllMusic]", "allmusic", "amRevBtn"],
	["ADV.Heading BtnName Review [Last.fm]", "last.fm", "lfmRevBtn"],
	["ADV.Image Blur Background Auto-Fill", false, "blurAutofill"],
	["ADV.Image Blur Background Level (0-100)", 90, "blurTemp"],
	["ADV.Image Blur Background Opacity (0-100)", 30, "blurAlpha"],
	["ADV.Scrollbar Height Always Full", false, "sbarStyle"],
	["ADV.Smooth Duration 0-5000 msec (Max)", "Scroll,500,TouchFlick,3000", "duration"],
	["ADV.Touch Flick Distance 0-10", 0.8, "flickDistance"],
	["SYSTEM.Album History", JSON.stringify([]), "albumHistory"],
	["SYSTEM.Allmusic Alb", true, "allmusic_alb"],
	["SYSTEM.Allmusic Bio", false, "allmusic_bio"],
	["SYSTEM.Artist History", JSON.stringify([]), "artistHistory"],
	["SYSTEM.Artist View", true, "artistView"],
	["SYSTEM.Bio & Rev Same Style", true, "sameStyle"],
	["SYSTEM.Blur Blend Theme", false, "blurBlend"],
	["SYSTEM.Blur Dark Theme", false, "blurDark"],
	["SYSTEM.Blur Light Theme", false, "blurLight"],
	["SYSTEM.Both Bio", false, "bothBio"],
	["SYSTEM.Both Rev", false, "bothRev"],
	["SYSTEM.Button More Items", true, "mul_item"],
	["SYSTEM.Colour Swap", false, "swapCol"],
	["SYSTEM.Cover Border-1 Shadow-2 Both-3 [Dual Mode] ", 0, "covBorderDual"],
	["SYSTEM.Cover Border-1 Shadow-2 Both-3 [Image Only]", 0, "covBorderImgOnly"],
	["SYSTEM.Cover Circular [Dual Mode]", false, "covCircDual"],
	["SYSTEM.Cover Circular [Image Only]", false, "covCircImgOnly"],
	["SYSTEM.Cover Crop [Dual Mode]", true, "covCropDual"],
	["SYSTEM.Cover Crop [Image Only]", true, "covCropImgOnly"],
	["SYSTEM.Cover Load All", false, "loadCovAllFb"],
	["SYSTEM.Cover Load Folder", false, "loadCovFolder"],
	["SYSTEM.Cover Reflection [Dual Mode]", false, "covReflDual"],
	["SYSTEM.Cover Reflection [Image Only]", false, "covReflImgOnly"],
	["SYSTEM.Cover Type", 0, "covType"],
	["SYSTEM.Cycle Item", false, "cycItem"],
	["SYSTEM.Cycle Photo", true, "cycPhoto"],
	["SYSTEM.Cycle Photo Last.fm Only", true, "cycPhotoLfmOnly"],
	["SYSTEM.Cycle Picture", true, "cycPic"],
	["SYSTEM.Cycle Time Item", 45, "cycTimeItem"],
	["SYSTEM.Cycle Time Picture", 15, "cycTimePic"],
	["SYSTEM.Font Size", scaleForDisplay(12), "baseFontSize"],
	["SYSTEM.Freestyle Custom", JSON.stringify([]), "styles"],
	["SYSTEM.Heading Always Full Width", true, "fullWidthHeading"],
	["SYSTEM.Heading Button Hide-0 Left-1 Right-2", 2, "src"],
	["SYSTEM.Heading Button Icon", 0, "btnIcon"],
	["SYSTEM.Heading Center", false, "hdCenter"],
	["SYSTEM.Heading Line Hide-0 Bottom-1 Center-2", 1, "hdLine"],
	["SYSTEM.Heading Position", 0, "hdRight"],
	["SYSTEM.Heading Style", 2, "headFontStyle"],
	["SYSTEM.Heading", true, "heading"],
	["SYSTEM.Image Align Auto", true, "alignAuto"],
	["SYSTEM.Image Align With Text", true, "textAlign"],
	["SYSTEM.Image Alignment Horizontal", 0, "alignH"],
	["SYSTEM.Image Alignment Vertical", 0, "alignV"],
	["SYSTEM.Image Auto Enlarge", false, "autoEnlarge"],
	["SYSTEM.Image Bar", 0, "imgBar"],
	["SYSTEM.Image Bar Dots", 1, "imgBarDots"],
	["SYSTEM.Image Blur Background Always Use Front Cover", false, "covBlur"],
	["SYSTEM.Image Counter", false, "imgCounter"],
	["SYSTEM.Image Only", false, "img_only"],
	["SYSTEM.Image Reflection Type", 0, "imgReflType"],
	["SYSTEM.Image Smooth Transition", false, "imgSmoothTrans"],
	["SYSTEM.Layout Bio Mode", 1, "bioMode"],
	["SYSTEM.Layout Bio", 0, "bioStyle"],
	["SYSTEM.Layout Dual Style Auto", true, "imgText"],
	["SYSTEM.Layout Image Size 0-1", 0.7, "rel_imgs"],
	["SYSTEM.Layout Rev Mode", 0, "revMode"],
	["SYSTEM.Layout Rev", 0, "revStyle"],
	["SYSTEM.Layout", 0, "style"],
	["SYSTEM.Line Padding", 0, "textPad"],
	["SYSTEM.Lock Bio", false, "lockBio"],
	["SYSTEM.Lock Rev", false, "lockRev"],
	["SYSTEM.Lock Auto", false, "autoLock"],
	["SYSTEM.Overlay Type", 0, "overlayStyle"],
	["SYSTEM.Overlay", JSON.stringify({"name":"Overlay", "imL":0, "imR":0, "imT":0, "imB":0, "txL":0, "txR":0, "txT":0.632, "txB":0}), "overlay"],
	["SYSTEM.Panel Active", true, "panelActive"],
	["SYSTEM.Photo Border-1 Shadow-2 Both-3 [Dual Mode]", 0, "artBorderDual"],
	["SYSTEM.Photo Border-1 Shadow-2 Both-3 [Image Only]", 0, "artBorderImgOnly"],
	["SYSTEM.Photo Circular [Dual Mode]", false, "artCircDual"],
	["SYSTEM.Photo Circular [Image Only]", false, "artCircImgOnly"],
	["SYSTEM.Photo Crop [Dual Mode]", true, "artCropDual"],
	["SYSTEM.Photo Crop [Image Only]", true, "artCropImgOnly"],
	["SYSTEM.Photo Reflection [Dual Mode]", false, "artReflDual"],
	["SYSTEM.Photo Reflection [Image Only]", false, "artReflImgOnly"],
	["SYSTEM.Prefer Focus", false, "focus"],
	["SYSTEM.Scroll: Smooth Scroll", true, "smooth"],
	["SYSTEM.Scrollbar Button Type", 0, "sbarButType"],
	["SYSTEM.Scrollbar Show", 1, "sbarShow"],
	["SYSTEM.Scrollbar Width Bar", 11, "sbarBase_w"],
	["SYSTEM.Scrollbar Windows Metrics", false, "sbarWinMetrics"],
	["SYSTEM.Show Album History", true, "showAlbumHistory"],
	["SYSTEM.Show Artist History", true, "showArtistHistory"],
	["SYSTEM.Show More Tags", true, "showMoreTags"],
	["SYSTEM.Show Similar Artists", true, "showSimilarArtists"],
	["SYSTEM.Show Top Albums", true, "showTopAlbums"],
	["SYSTEM.Summary First", true, "summaryFirst"],
	["SYSTEM.Subheading Source Hide-0 Auto-1 Show-2", 1, "sourceHeading"],
	["SYSTEM.Subheading Source Style", 1, "sourceStyle"],
	["SYSTEM.Subheading Track Hide-0 Auto-1 Show-2", 1, "trackHeading"],
	["SYSTEM.Subheading Track Style", 1, "trackStyle"],
	["SYSTEM.Text Only", false, "text_only"],
	["SYSTEM.Touch Control", false, "touchControl"],
	["SYSTEM.Track Review", 0, "inclTrackRev"],
];
const ppt = new PanelPropertiesBio;
ppt.init('auto', properties); properties = undefined;

if (!ppt.get("SYSTEM.Properties Updated", false)) {
	ppt.lfmTrackHeading = "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)";
	ppt.lfmTrackSubHeading = "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)";
	ppt.set(" Scrollbar Arrow Custom", null);
	ppt.set(" Text Spacing Pad", null);
	ppt.set("SYSTEM.Properties Updated", true);
} else if (!ppt.get("SYSTEM.Properties Upd", false)) {
	if (ppt.lfmRevHeading == "$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)") {
		ppt.lfmTrackHeading = ppt.lfmTrackHeading.replace("$if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE% - Track Review,Title Unknown)", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)");
		ppt.lfmTrackSubHeading = ppt.lfmTrackSubHeading.replace("$if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE% - Track Review,Title Unknown)", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)");
	}
	ppt.set("SYSTEM.Properties Upd", true);
}

String.prototype.clean = function() {return this.replace(/[/\\|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/^\./, "_").replace(/\.+$/, "").replace(/^\s+|[\n\s]+$/g, "");}
String.prototype.cut = function() {const n = this.split("(")[0].trim(); return n.length > 3 ? n : this;}
String.prototype.regex_escape = function() {return this.replace(/([*+\-?^!:&"~${}()|[\]/\\])/g, "\\$1");}
String.prototype.splt = function(n) {switch (n) {case 0: return this.replace(/\s+|^,+|,+$/g, "").split(","); case 1: return this.replace(/^[,\s]+|[,\s]+$/g, "").split(",");}}
String.prototype.strip = function() {return this.replace(/[.,!?:;'\u2019"\-_\u2010\s+]/g, "").toLowerCase();}
String.prototype.tf_escape = function() {let str = this.replace(/'/g, "''").replace(/[()[\],%]/g, "'$&'"); if (str.indexOf("$") != -1) {const strSplit = str.split("$"); str = strSplit.join("'$$'");} return str;}
String.prototype.titlecase = function() {return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, match => {if (match.substr(1).search(/[A-Z]|\../) > -1) return match; return match.charAt(0).toUpperCase() + match.substr(1);});}
/*Use for smallWord handling*///String.prototype.titlecase = function() {const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i; if (this == "N/A") return this; return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match, index, title) => {if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') && title.charAt(index - 1).search(/[^\s-]/) < 0) {return match.toLowerCase();} if (match.substr(1).search(/[A-Z]|\../) > -1) return match; return match.charAt(0).toUpperCase() + match.substr(1);});}

let uiBio = new UserInterfaceBio, vkBio = new VkeysBio, pBio = new PanelBio, name = new Names, alb_scrollbar = new ScrollbarBio, art_scrollbar = new ScrollbarBio, butBio = new ButtonsBio, menBio = new MenuItemsBio, t = new Text, tagBio = new TaggerBio, tb = new TextBoxBio, libBio = new LibraryBio, imgBio = new ImagesBio, timerBio = new TimersBio, servBio = new ServerBio; window.DlgCode = 0x004; sBio.createDiacriticsMap(); if (ppt.menu_items.length < 80) ppt.menu_items += ",Missing Data,0";

function UserInterfaceBio() {
	this.x; this.y; this.w; this.h;
	const pptCol = [["_Custom.Colour Background", "", "bg", 1], ["_Custom.Colour Overlay Rect & RoundRect", "", "rectOv", 0], ["_Custom.Colour Overlay Rect & RoundRect Rim", "", "rectOvBor", 0], ["_Custom.Colour Text", "", "text", 0], ["_Custom.Colour Text Highlight", "", "text_h", 0], ["_Custom.Colour Transparent Fill", "", "bgTrans", 1]];
	const fadeSetup = ppt.fadeSetup.splt(0), headerConfig = ppt.headerConfig.splt(0), hl = ppt.hl.splt(0), show = ppt.show.splt(0), btn_h = sBio.value(hl[1], 0, 1), head_h = sBio.value(hl[3], 1, 1), line_h = sBio.value(hl[5], 1, 1), rim_h = sBio.value(hl[7], 1, 1), star_h = sBio.value(hl[9], 1, 1), subhead_h = sBio.value(hl[11], 1, 1), text_h = sBio.value(hl[13], 0, 1);
	if (fadeSetup.length> 2 && fadeSetup[2] == "FadeGradient") {fadeSetup[2] = "Gradient"; ppt.fadeSetup = fadeSetup.toString();}
	if ([0, 1, 2, 3, 16, 18].every(v => v !== ppt.headFontStyle)) ppt.headFontStyle =  2; if (ppt.overlayStyle > 4 || ppt.overlayStyle < 0) ppt.overlayStyle = 0;
	let baseHeadFontSize = 16, headerGapAdjust = sBio.value(headerConfig[1], 0, 0), headerLnAdjust = sBio.value(headerConfig[3], 0, 0), tcol = "", tcol_h = "", sbarMetrics = ppt.sbarMetrics.splt(0), style = 1, zoomFontSize = 16, zoomBold = 1;
	this.arc_w = ppt.overlayStyle != 2 && ppt.overlayStyle != 4 ? 0 : sBio.clamp(sBio.value(fadeSetup[5], 1, 0), 1, 10); this.arrow_pad = sBio.value(sbarMetrics[5], 0, 0); this.bg = false; this.blurAlpha = sBio.clamp(ppt.blurAlpha, 0, 100) / 30; this.blurLevel = ppt.blurBlend ? 91.05 - sBio.clamp(ppt.blurTemp, 1.05, 90) : sBio.clamp(ppt.blurTemp * 2, 0, 254); this.BtnBg = sBio.value(show[1], 1, 1); this.BtnName = sBio.value(show[3], 1, 1); this.local = typeof conf === 'undefined' ? false : true; this.c_c = this.local && typeof opt_c_c !== 'undefined'; this.col = {}; this.custHeadFont = false; this.dui = window.InstanceType; this.fadeAlpha = sBio.clamp(255 * (100 - sBio.value(fadeSetup[1], 14.5, 0)) / 100, 0, 255); this.fadeSlope = sBio.clamp(sBio.value(fadeSetup[3], 10, 0) / 10 - 1, -1, 9); this.font = ""; this.font_h = 37; this.fontAwesomeInstalled = utils.CheckFont("FontAwesome"); this.grip_h = sBio.value(sbarMetrics[7], 12, 0); this.headFont = ""; this.headFont_h = 37; this.heading_h = 56; ppt.hdLine = sBio.value(ppt.hdLine, 1, 2); this.head_ln_h = 46; this.headText = sBio.value(show[7], 0, 1); this.l_h = Math.round(1 * sBio.scale); this.lfmTheme = sBio.value(show[5], 0, 1); this.messageFont = ""; this.smallFont = ""; if (ppt.narrowSbarWidth != 0) ppt.narrowSbarWidth = sBio.clamp(ppt.narrowSbarWidth, 2, 10); this.narrowSbarWidth = 2; ppt.sbarCol = sBio.clamp(ppt.sbarCol, 0, 1); this.sbarCol = ppt.sbarCol; this.src_pad = sBio.value(headerConfig[7], 0, 0); ppt.src = sBio.value(ppt.src, 2, 2); this.srcSizeAdjust = sBio.value(headerConfig[5], 0, 0); this.sourceFont = ""; this.trans = false;

	const chgBrightness = (c, percent) => {c = sBio.toRGB(c); return RGB(sBio.clamp(c[0] + (256 - c[0]) * percent / 100, 0, 255), sBio.clamp(c[1] + (256 - c[1]) * percent / 100, 0, 255), sBio.clamp(c[2] + (256 - c[2]) * percent / 100, 0, 255));}
	const dim = (c, bg, alpha) => {c = sBio.toRGB(c); bg = sBio.toRGB(bg); const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, a = alpha / 255, bgr = bg[0] / 255, bgg = bg[1] / 255, bgb = bg[2] / 255; let nR = ((1 - a) * bgr) + (a * r), nG = ((1 - a) * bgg) + (a * g), nB = ((1 - a) * bgb) + (a * b); nR = sBio.clamp(Math.round(nR * 255), 0, 255); nG = sBio.clamp(Math.round(nG * 255), 0, 255); nB = sBio.clamp(Math.round(nB * 255), 0, 255); return RGB(nR, nG, nB);}
	const pptColour = () => {pptCol.forEach(v => this.col[v[2]] = set_custom_col(ppt.get(v[0], v[1]), v[3]));}
	const RGBtoRGBA = (rgb, a) => a << 24 | rgb & 0x00FFFFFF;
	const set_custom_col = (c, t) => {if (!ppt.customCol) return ""; c = c.split("-"); let cc = ""; if (c.length != 3 && c.length != 4) return ""; switch (t) {case 0: cc = RGB(c[0], c[1], c[2]); break; case 1: switch (c.length) {case 3: cc = RGB(c[0], c[1], c[2]); break; case 4: cc = RGBA(c[0], c[1], c[2], c[3]); break;} break;} return cc;}
	const getLineCol = type => this.get_blend(ppt.blurDark ? RGB(0, 0, 0) : ppt.blurLight ? RGB(255, 255, 255) : this.col.bg == 0 ? 0xff000000 : this.col.bg, line_h ? tcol_h : tcol, type == 'bottom' || this.blur ? 0.25 : 0.5, false);
	const toRGBA = c => [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];

	this.chgBlur = n => {ppt.blurDark = false; ppt.blurBlend = false; ppt.blurLight = false; switch (n) {case 1: ppt.blurDark = true; break; case 2: ppt.blurBlend = true; break; case 3: ppt.blurLight = true; break;} this.blurLevel = ppt.blurBlend ? 91.05 - sBio.clamp(ppt.blurTemp, 1.05, 90) : sBio.clamp(ppt.blurTemp * 2, 0, 254); on_colours_changed(true);}
	this.draw = gr => {

		if (this.bg) gr.FillSolidRect(this.x, this.y, pBio.w, pBio.h, this.col.bg)

		if (pref.layout_mode === 'default_mode') {
			if (albumart) {
				// Biography's top shadow
				gr.FillGradRect(this.x, is_4k ? this.y - 10 : this.y - 6, this.w, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0),
					pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
					pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
					pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
					pref.darkblueTheme ? RGBtoRGBA(col.shadow, 72) :
					pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
					pref.creamTheme ? RGBtoRGBA(col.shadow, 24) :
					pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
				);
				// Biography's bottom shadow
				gr.FillGradRect(this.x, is_4k ? this.y + (pref.blackTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? this. h : this.h + 1) : this.y + this.h - 1, this.w, scaleForDisplay(5), 90,
					pref.whiteTheme ? RGBtoRGBA(col.shadow, 18) :
					pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
					pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
					pref.darkblueTheme ? RGBtoRGBA(col.shadow, 74) :
					pref.redTheme ? RGBtoRGBA(col.shadow, 74) :
					pref.creamTheme ? RGBtoRGBA(col.shadow, 18) :
					pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 86) : '',
					RGBtoRGBA(col.shadow, 0)
				);
			}
			// Biography's left shadow
			gr.FillGradRect(ww / 2 - 4, this.y, 4, this.h, 0, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 38) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 60) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 64) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 28) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
			);
		}
	}

	this.get_blend = (c1, c2, f, alpha) => {const nf = 1 - f; let r, g, b, a; switch (true) {case !alpha: c1 = sBio.toRGB(c1); c2 = sBio.toRGB(c2); r = c1[0] * f + c2[0] * nf; g = c1[1] * f + c2[1] * nf; b = c1[2] * f + c2[2] * nf; return RGB(Math.round(r), Math.round(g), Math.round(b)); case alpha: c1 = toRGBA(c1); c2 = toRGBA(c2); r = c1[0] * f + c2[0] * nf; g = c1[1] * f + c2[1] * nf; b = c1[2] * f + c2[2] * nf; a = c1[3] * f + c2[3] * nf; return RGBA(Math.round(r), Math.round(g), Math.round(b), Math.round(a));}}
	this.get_selcol = (c, n, bypass) => {if (!bypass) c = sBio.toRGB(c); const cc = c.map(v => {v /= 255; return v <= 0.03928 ? v /= 12.92 : Math.pow(((v + 0.055 ) / 1.055), 2.4);}); const L = 0.2126 * cc[0] + 0.7152 * cc[1] + 0.0722 * cc[2]; if (L > 0.31) return n ? 50 : RGB(0, 0, 0); else return n ? 200 : RGB(255, 255, 255);}
	this.lines = gr => {if (!this.c_c) return; if (ppt.artistView && !ppt.img_only || !ppt.artistView && !ppt.img_only && t.text) {gr.DrawRect(0, 0, pBio.w - 1, pBio.h - 1, 1, RGB(155, 155, 155)); gr.DrawRect(1, 1, pBio.w - 3, pBio.h - 3, 1, RGB(0, 0, 0));}}
	this.reset_colors = () => {pptCol.forEach(v => this.col[v[2]] = ""); tcol = ""; tcol_h = ""; this.trans = false;}

	this.get_colors = () => {
		pptColour();
		this.blur = ppt.blurBlend || ppt.blurDark || ppt.blurLight;
		if (ppt.blurDark) {this.col.bg_light = RGBA(0, 0, 0, Math.min(160 / this.blurAlpha, 255)); this.col.bg_dark = RGBA(0, 0, 0, Math.min(80 / this.blurAlpha, 255)); if (ppt.overlayStyle) this.col.blurOv = RGBA(0, 0, 0, 255 - this.fadeAlpha);}
		if (ppt.blurLight) {this.col.bg_light = RGBA(255, 255, 255, Math.min(160 / this.blurAlpha, 255)); this.col.bg_dark = RGBA(255, 255, 255, Math.min(205 / this.blurAlpha, 255)); if (ppt.overlayStyle) this.col.blurOv = RGBA(255, 255, 255, 255 - this.fadeAlpha);}
		this.stars = sBio.value(ppt.star, 1, 2);
		if ((!ppt.heading || !ppt.src || ppt.hdCenter) && this.stars == 1) this.stars = 2; if (!ppt.amRating && !ppt.lfmRating) this.stars = 0;
		if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
			if (this.col.bg === "") this.col.bg = window.GetColourDUI(1);
			tcol = window.GetColourDUI(0); tcol_h = window.GetColourDUI(2);
		} else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
			if (this.col.bg === "") this.col.bg = g_pl_colors.background;
			tcol = pref.creamTheme ? rgb(120, 170, 130) : g_pl_colors.artist_playing; tcol_h = g_pl_colors.artist_playing;
		}
		const lightBg = this.get_selcol(this.col.bg == 0 ? 0xff000000 : this.col.bg, true) == 50;
		if (this.col.text === "") tcol = ppt.blurBlend ? chgBrightness(tcol, lightBg ? -10 : 10) : ppt.blurDark ? RGB(255, 255, 255) : ppt.blurLight ? RGB(0, 0, 0) : tcol; else tcol = this.col.text;
		if (this.col.text_h === "") tcol_h = ppt.blurBlend ? chgBrightness(tcol_h, lightBg ? -10 : 10) : ppt.blurDark ? RGB(255, 255, 255) : ppt.blurLight ? RGB(71, 129, 183) : tcol_h; else tcol_h = this.col.text_h;
		if (window.IsTransparent && this.col.bgTrans) {this.bg = true; this.col.bg = this.col.bgTrans}
		if (!window.IsTransparent || this.dui) this.bg = true; if (this.local) {this.trans = c_trans; this.col.bg = c_backcol; tcol = ppt.blurBlend ? chgBrightness(c_textcol, this.get_selcol(c_backcol == 0 ? 0xff000000 : c_backcol, true) == 50 ? -10 : 10) : ppt.blurDark ? RGB(255, 255, 255) : ppt.blurLight ? RGB(0, 0, 0) : c_textcol; tcol_h = ppt.blurBlend ? chgBrightness(c_textcol_h, this.get_selcol(c_backcol == 0 ? 0xff000000 : c_backcol, true) == 50 ? -10 : 10) : ppt.blurDark || !this.bg && this.trans && !ppt.blurLight ? RGB(255, 255, 255) : ppt.blurLight ? RGB(71, 129, 183) : c_textcol_h;}
		if (ppt.swapCol) {const colH = tcol_h; tcol_h = tcol; tcol = colH;}

		this.col.text = !text_h ? tcol : tcol_h;
		this.col.text_h = !text_h ? tcol_h : tcol;
		this.col.btn = btn_h ? tcol_h : tcol;
		this.col.shadow = this.get_selcol(this.col.text_h, false); this.col.t = this.bg ? this.get_selcol(this.col.bg, true) : 200;
		this.col.starcol = rgb(195, 195, 195);
		this.col.starcol_h = rgb(255, 190, 0);
		if (this.stars) {["starOn", "starOff", "starBor"].forEach((v, i) => {
			this.col[v] = i < 2 ? (this.stars == 2 ? RGBtoRGBA(star_h ? this.col.starcol : this.col.starcol_h, !i ? 255 : 80) :
			this.bg || !this.bg && !this.trans || ppt.blurDark || ppt.blurLight ? RGBtoRGBA(star_h ? this.col.starcol_h : this.col.starcol, !i ? 255 : 80) : RGBA(255, 255, 255, !i ? 255 : 80)) : RGBA(0, 0, 0, 0);
		});}
		this.col.bottomLine = getLineCol('bottom');
		this.col.centerLine = getLineCol('center');
		this.col.source = ppt.blurDark ? RGB(240, 240, 240) : !ppt.blurLight && (ppt.sourceStyle == 1 || ppt.sourceStyle == 3) && (ppt.headFontStyle != 1 && ppt.headFontStyle != 3) ?
		dim(subhead_h ? tcol_h : tcol, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : subhead_h ? tcol_h : tcol;
		this.col.track = ppt.blurDark ? RGB(240, 240, 240) : !ppt.blurLight && (ppt.trackStyle == 1 || ppt.trackStyle == 3) && (ppt.headFontStyle != 1 && ppt.headFontStyle != 3) ?
		dim(subhead_h ? tcol_h : tcol , !window.IsTransparent ? this.col.bg : 0xff000000, 240) : subhead_h ? tcol_h : tcol;
		if (this.col.rectOv === "") this.col.rectOv = this.col.bg; this.col.rectOv = RGBtoRGBA(this.col.rectOv, 255 - this.fadeAlpha);
		if (this.col.rectOvBor === "") {this.col.rectOvBor = rim_h ? tcol_h : tcol; this.col.rectOvBor = RGBtoRGBA(this.col.rectOvBor, 228);}
		this.col.edBg = (ppt.blurDark ? RGB(0, 0, 0) : ppt.blurLight ? RGB(255, 255, 255) : this.col.bg) & 0x99ffffff;
		this.sbarCol = ppt.blurDark || ppt.blurLight ? 1 : ppt.sbarCol;
		if (!ppt.heading) return;
		this.col.head = head_h ? tcol_h : tcol; ["blend1", "blend2", "blend3"].forEach((v, i) => {
			this.col[v] = ppt.blurBlend ? this.col.btn & RGBA(255, 255, 255, i == 2 ? 40 : 12) : ppt.blurDark || !this.bg && this.trans && !ppt.blurLight ? (i == 2 ? RGBA(255, 255, 255, 50) : RGBA(0, 0, 0, 40)) : ppt.blurLight ? RGBA(0, 0, 0, i == 2 ? 40 : 15) : this.get_blend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.btn, !i ? 0.9 : i == 2 ? 0.87 : (this.blur ? 0.75 : 0.82), false);
		});
		this.col.blend4 = toRGBA(this.col.blend1);
	}
	this.get_colors();

	this.get_font = () => {
		if (ppt.customCol && ppt.custFont.length) {const custFont = ppt.custFont.splt(1); this.font = gdi.Font(custFont[0], Math.round(sBio.value(custFont[1], 16, 0)), Math.round(sBio.value(custFont[2], 0, 0)));}
		else if (this.dui) this.font = window.GetFontDUI(3); else this.font = window.GetFontCUI(0);
		if (!this.font) {this.font = gdi.Font("Segoe UI", 16, 0); sBio.trace("Spider Monkey Panel is unable to use your default font. Using Segoe UI at default size & style instead");}
		if (this.font.Size != ppt.baseFontSize) ppt.zoomFont = 100;
		//ppt.baseFontSize = baseHeadFontSize = this.font.Size;
		ppt.baseFontSize = ppt.baseFontSize; baseHeadFontSize = ppt.baseFontSize;
		zoomFontSize = Math.max(Math.round(ppt.baseFontSize * ppt.zoomFont / 100), 1);
		const setSegoeUI = ppt.heading && ppt.headFontStyle > 15 || ppt.sourceHeading && ppt.sourceStyle > 15 || pBio.inclTrackRev && ppt.trackHeading && ppt.trackStyle > 15;
		if (ppt.customCol && ppt.custHeadFont.length) {const custHeadFont = ppt.custHeadFont.splt(1); baseHeadFontSize = Math.round(sBio.value(custHeadFont[1], 16, 0)); this.headFont = gdi.Font(custHeadFont[0], baseHeadFontSize, style); style = Math.round(sBio.value(custHeadFont[2], 3, 0)); this.custHeadFont = true;}
		else {style = ppt.headFontStyle; this.headFont = gdi.Font(!setSegoeUI ? this.font.Name : ppt.headFontStyle < 16 ? "Segoe UI" : "Segoe UI Semibold", this.font.Size, style);}
		zoomBold = style != 1 && style != 16 && style != 18 ? 1 : 1.5;
		this.font = gdi.Font(!setSegoeUI ? this.font.Name : "Segoe UI", zoomFontSize, this.font.Style);
		this.headFont = gdi.Font(this.headFont.Name, Math.max(Math.round(baseHeadFontSize * ppt.zoomFont / 100 * (100 + ((ppt.zoomHead - 100) / zoomBold)) / 100), 1), style);
		headerGapAdjust = sBio.clamp(headerGapAdjust, -ppt.gap * 2, this.font.Size * 5); headerLnAdjust = sBio.clamp(headerLnAdjust, -ppt.gap, this.font.Size * 5);
		ppt.zoomFont = Math.round(zoomFontSize / ppt.baseFontSize * 100);
		this.sourceFont = gdi.Font(!setSegoeUI ? this.font.Name : ppt.sourceStyle < 16 ? "Segoe UI" : "Segoe UI Semibold", this.font.Size, ppt.sourceStyle);
		this.trackFont = gdi.Font(!setSegoeUI ? this.font.Name : ppt.trackStyle < 16 ? "Segoe UI" : "Segoe UI Semibold", this.font.Size, ppt.trackStyle);
		this.messageFont = gdi.Font(this.font.Name, this.font.Size * 1.5, 1);
		this.smallFont = gdi.Font(this.font.Name, Math.round(this.font.Size * 12 / 14), this.font.Style);
		this.narrowSbarWidth = ppt.narrowSbarWidth == 0 ? sBio.clamp(Math.floor(this.font.Size / 7), 2, 10) : ppt.narrowSbarWidth;
		if (this.local) {this.font = c_font; this.sourceFont = gdi.Font(this.font.Name, this.font.Size, ppt.sourceStyle); this.trackFont = gdi.Font(this.font.Name, this.font.Size, ppt.trackStyle); this.messageFont = gdi.Font(this.font.Name, this.font.Size * 1.5, 1); if (ppt.sbarShow) {this.sbarType = 0; this.sbar_w = c_scr_w; this.scr_but_w = this.sbar_w + 1; this.but_h = this.sbar_w + 1; this.sbar_sp = this.sbar_w + 1;}}
		this.calc_text(); pBio.sizes(); butBio.create_stars(); t.get_widths(); t.art_calc(); t.alb_calc();
	}

	this.calc_text = () => {
		sBio.gr(1, 1, false, g => {
			this.font_h = Math.round(g.CalcTextHeight("String", this.font) + ppt.textPad);
			this.headFont_h = g.CalcTextHeight("String", this.headFont);
		});
		this.head_ln_h = ppt.heading ? Math.round(this.headFont_h * (ppt.hdLine == 1 ? 1.25 : 1.1) + (ppt.hdLine == 1 ? headerLnAdjust : 0)) : 0;
		this.heading_h = ppt.heading ? Math.round(this.head_ln_h + (ppt.gap * (ppt.hdLine == 1 ? 0.75 : 0.25)) + headerGapAdjust) : 0;
	}

	this.wheel = step => {
		if (!pBio || (ppt.mul_item && butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y)) || !pBio.text_trace) return;
		if (vkBio.k('ctrl')) {
			if (ppt.heading && butBio.btns["heading"].trace(pBio.m_x, pBio.m_y)) {
				if (!butBio.trace_src(pBio.m_x, pBio.m_y)) {
					ppt.zoomHead = sBio.clamp(ppt.zoomHead += step * 5, 25, 400);
					this.headFont = gdi.Font(this.headFont.Name, Math.max(Math.round(baseHeadFontSize * zoomFontSize / ppt.baseFontSize * (100 + ((ppt.zoomHead - 100) / zoomBold)) / 100), 1), style);
				} else butBio.set_src_fs(step);
			} else {
				zoomFontSize += step; zoomFontSize = Math.max(zoomFontSize, 1);
				this.font = gdi.Font(this.font.Name, zoomFontSize, this.font.Style);
				this.headFont = gdi.Font(this.headFont.Name, Math.max(Math.round(baseHeadFontSize * zoomFontSize / ppt.baseFontSize * (100 + ((ppt.zoomHead - 100) / zoomBold)) / 100), 1), style);
				this.sourceFont = gdi.Font(this.sourceFont.Name, zoomFontSize, ppt.sourceStyle);
				this.trackFont = gdi.Font(this.trackFont.Name, zoomFontSize, ppt.trackStyle);
				this.messageFont = gdi.Font(this.font.Name, zoomFontSize * 1.5, 1);
				this.smallFont = gdi.Font(this.font.Name, Math.round(zoomFontSize * 12 / 14), this.font.Style);
				this.narrowSbarWidth = ppt.narrowSbarWidth == 0 ? sBio.clamp(Math.floor(zoomFontSize / 7), 2, 10) : ppt.narrowSbarWidth;
			}
			this.calc_text(); butBio.create_stars(); t.get_widths(); window.Repaint(); ppt.zoomFont = Math.round(zoomFontSize / ppt.baseFontSize * 100); t.toggle(13);
		}
		if (vkBio.k('shift') && ppt.style > 3) {
			this.fadeAlpha += (-step * 5); this.fadeAlpha = sBio.clamp(this.fadeAlpha, 0, 255);
			ppt.fadeSetup = "Strength," + Math.round((255 - this.fadeAlpha) / 2.55) + "%,FadeGradient," + fadeSetup[3] + ",RimWidth," + fadeSetup[5];
			this.get_colors(); imgBio.resetFade = true; if (!ppt.overlayStyle) {imgBio.adjustMode = true; if (ppt.artistView && ppt.cycPhoto) imgBio.clear_a_rs_cache(); if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) imgBio.get_images(); else imgBio.get_multi(pBio.art_ix, pBio.alb_ix);} else t.paint();
		}
	}

	this.sbarSet = () => {
		this.sbarType = sBio.value(ppt.sbarType.replace(/\s+/g, "").charAt(), 0, 2); if (this.sbarType == 2)  ppt.sbarType = "2 // Scrollbar Arrow Settings N/A For Themed"; else ppt.sbarType = "" + this.sbarType + "";
		if (this.sbarType == 2) {this.theme = window.CreateThemeManager("scrollbar"); sBio.gr(21, 21, false, g => {try {this.theme.SetPartAndStateID(6, 1); this.theme.DrawThemeBackground(g, 0, 0, 21, 50); for (let k = 0; k < 3; k++) {this.theme.SetPartAndStateID(3, k + 1); this.theme.DrawThemeBackground(g, 0, 0, 21, 50);} for (let k = 0; k < 3; k++) {this.theme.SetPartAndStateID(1, k + 1); this.theme.DrawThemeBackground(g, 0, 0, 21, 21);}} catch (e) {this.sbarType = 1; ppt.sbarType = "" + 1 + "";}});}
		this.arrow_pad = sBio.value(sbarMetrics[5], 0, 0);
		this.sbar_w = sBio.clamp(sBio.value(sbarMetrics[1], 11, 0), 0, 400); ppt.sbarBase_w = sBio.clamp(ppt.sbarBase_w, 0, 400);
		if (this.sbar_w != ppt.sbarBase_w) {this.scr_but_w = Math.min(sBio.value(sbarMetrics[3], 11, 0), this.sbar_w, 400); ppt.sbarMetrics = "Bar," + this.sbar_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h;} else {this.scr_but_w = sBio.clamp(sBio.value(sbarMetrics[3], 11, 0), 0, 400); this.sbar_w = sBio.clamp(this.sbar_w, this.scr_but_w, 400); ppt.sbarMetrics = "Bar," + this.sbar_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h;}
		ppt.sbarBase_w = this.sbar_w;
			let themed_w = 21; try {themed_w = utils.GetSystemMetrics(2);} catch (e) {}
			if (ppt.sbarWinMetrics) {
				this.sbar_w = themed_w;
				this.scr_but_w = this.sbar_w;
			}
			else if (ppt.sbarMetrics) {
				this.sbar_w = is_4k ? 26 : 12;
				this.scr_but_w = is_4k ? 26 : 12;
			}
			if (!ppt.sbarWinMetrics && this.sbarType == 2) this.sbar_w = Math.max(this.sbar_w, 12);
			if (!ppt.sbarShow) this.sbar_w = 0; this.but_h = this.sbar_w + (this.sbarType != 2 ? 1 : 0);
			if (this.sbarType != 2) {
				if (ppt.sbarButType || !this.sbarType && this.scr_but_w < Math.round(15 * sBio.scale)) this.scr_but_w += 1;
				else if (this.sbarType == 1 && this.scr_but_w < Math.round(14 * sBio.scale)) this.arrow_pad += 1;
			}
			const sp = this.sbar_w - this.scr_but_w < 5 || this.sbarType == 2 ? Math.round(1 * sBio.scale) : 0;
			this.sbar_sp = this.sbar_w ? this.sbar_w + sp : 0;
			this.arrow_pad = sBio.clamp(-this.but_h / 5, this.arrow_pad, this.but_h / 5);
	}; this.sbarSet();

	this.updSbar = () => {
		if (ppt.sameStyle) {this.sbarSet(); butBio.setSbarIcon(); alb_scrollbar.active = true; art_scrollbar.active = true; uiBio.get_font();
		alb_scrollbar.setCol(); art_scrollbar.setCol(); butBio.create_images(); butBio.create_mt(); butBio.refresh(true); alb_scrollbar.resetAuto(); art_scrollbar.resetAuto(); t.toggle(12);} else window.Reload();
	}

	this.set = (n, i) => {
		switch (n) {
			case 'lineSpacing': {const ns = utils.InputBox(window.ID, "Enter number to pad line height\n\n0 or higher", "Line Spacing", ppt.textPad); if (!ns || ns == ppt.textPad) return false; ppt.textPad = Math.round(ns); if (isNaN(ppt.textPad)) ppt.textPad = 0; ppt.textPad = sBio.clamp(ppt.textPad, 0, 100); this.updSbar(); break;}
			case 'sbarButType': ppt.sbarButType = i; this.updSbar(); break;
			case 'sbarMetrics': ppt.sbarWinMetrics = !ppt.sbarWinMetrics; this.updSbar(); break;
			case 'sbarType': this.sbarType = i; if (this.sbarType == 2)  ppt.sbarType = "2 // Scrollbar Arrow Settings N/A For Themed"; else ppt.sbarType = ppt.sbarType = "" + i + "";  this.updSbar(); break;
			case 'scrollbar': ppt.sbarShow = i; this.updSbar(); break;
		}
	}
}

function BezierBio(){const i=4,c=.001,o=1e-7,v=10,l=11,s=1/(l-1),n=typeof Float32Array==="function";function e(r,n){return 1-3*n+3*r}function u(r,n){return 3*n-6*r}function a(r){return 3*r}function w(r,n,t){return((e(n,t)*r+u(n,t))*r+a(n))*r}function y(r,n,t){return 3*e(n,t)*r*r+2*u(n,t)*r+a(n)}function h(r,n,t,e,u){let a,f,i=0;do{f=n+(t-n)/2;a=w(f,e,u)-r;if(a>0){t=f}else{n=f}}while(Math.abs(a)>o&&++i<v);return f}function A(r,n,t,e){for(let u=0;u<i;++u){const a=y(n,t,e);if(a===0){return n}const f=w(n,t,e)-r;n-=f/a}return n}function f(r){return r}function bezier(i,t,o,e){if(!(0<=i&&i<=1&&0<=o&&o<=1)){throw new Error("Bezier x values must be in [0, 1] range")}if(i===t&&o===e){return f}const v=n?new Float32Array(l):new Array(l);for(let r=0;r<l;++r){v[r]=w(r*s,i,o)}function u(r){const e=l-1;let n=0,t=1;for(;t!==e&&v[t]<=r;++t){n+=s}--t;const u=(r-v[t])/(v[t+1]-v[t]),a=n+u*s,f=y(a,i,o);if(f>=c){return A(r,a,i,o)}else if(f===0){return a}else{return h(r,n,n+s,i,o)}}return function r(n){if(n===0){return 0}if(n===1){return 1}return w(u(n),t,e)}} this.scroll = bezier(0.25, 0.1, 0.25, 1); this.full = this.scroll; this.step = this.scroll; this.bar = bezier(0.165,0.84,0.44,1); this.barFast = bezier(0.19, 1, 0.22, 1); this.inertia = bezier(0.23, 1, 0.32, 1);} const easeBio = new BezierBio;
function on_colours_changed(clear) {uiBio.reset_colors(); uiBio.get_colors(); alb_scrollbar.setCol(); art_scrollbar.setCol(); imgBio.create_images(); butBio.create_images(); butBio.create_mt(); butBio.refresh(true); alb_scrollbar.resetAuto(); art_scrollbar.resetAuto(); if (uiBio.headFont && uiBio.headFont.Size) butBio.create_stars(); if (ppt.blurBlend || clear) {imgBio.clear_rs_cache(); imgBio.get_images();} t.paint();}
function on_font_changed() {uiBio.get_font(); alb_scrollbar.reset(); art_scrollbar.reset(); alb_scrollbar.resetAuto(); art_scrollbar.resetAuto(); t.on_size(); imgBio.on_size(); window.Repaint();}
function VkeysBio() {this.k = n => {switch (n) {case 'shift': return utils.IsKeyPressed(0x10); case 'ctrl': return utils.IsKeyPressed(0x11); case 'alt': return utils.IsKeyPressed(0x12);}}}

function PanelBio() {
	this.x; this.y; this.w; this.h;
	this.pBioProfiler = fb.CreateProfiler();
	const bio_sim = [], id = {alb: "", alb_o: "", artist: "", artist_o: "", lockAlb: "", lockArt: "",   tr: "", tr_o: ""}, inBio = [false, false, true, true, true, false, false], inRev = [true, true, false, false, false, true, true], q = n => n.split("").reverse().join(""), sbarStyle = !ppt.sbarStyle ? 2 : 0, t_l = ppt.textL + uiBio.arc_w, t_t = ppt.textT + uiBio.arc_w;
	let alb_top = [], albumHistory = [], artFieldsArr = [], artistHistory = [], calc = true, enabled = 0, enlarged_img = false, history_a = "", history_aa_l = "", init_albums = [], init_artists = [], i = 0, j = 0, langSetOK = false, nn = 0, t_r = ppt.textR + uiBio.arc_w, t_b = ppt.textB + uiBio.arc_w, txt_sp = 0;
	this.alb_ix = 0; this.albums = []; this.albumsUniq = []; this.arc = 10; this.art_ix = 0; this.artistHistory = sBio.jsonParse(ppt.artistHistory, []); this.albumHistory = sBio.jsonParse(ppt.albumHistory, []); this.artists = []; this.artistsUniq = []; this.bor_l = ppt.borL; this.bor_r = ppt.borR; this.bor_t = ppt.borT; this.bor_b = ppt.borB; this.calcText = false; this.clicked = false; this.clip = false; this.covView = 1; this.cycTimeItem = Math.max(ppt.cycTimeItem, 30); this.h = 0; this.heading_x = 0; this.heading_w = 200; this.iBoxL = 0; this.iBoxT = 0; this.iBoxH = 100; this.iBoxW = 100; this.im_l = 0; this.im_r = 100; this.im_t = 0; this.im_b = 100; this.img_l = 20; this.img_r = 20; this.img_t = 0; this.img_b = 0; this.imgs = 0; this.imgText = !ppt.imgText; this.inclTrackRev = ppt.inclTrackRev; this.langArr = ["EN", "DE", "ES", "FR", "IT", "JA", "PL", "PT", "RU", "SV", "TR", "ZH"]; this.last_pressed_coord = {x: -1, y: -1}; this.lfmLang_ix = 0; this.local = sBio.file("C:\\check_local\\1450343922.txt"); this.lock = 0; this.lockHandle = null; this.m_x = 0; this.m_y = 0; this.max_y = 0; this.minH = 50; this.moreTags = false; this.mul = {}; this.newStyle = false; this.overlay = sBio.jsonParse(ppt.overlay, false); this.pth = {}; this.rp_x = 0; this.rp_y = 0; this.rp_w = 0; this.rp_h = 0; this.top_corr = 0; this.sbar_o = 0; this.sbar_x = 0; this.sbar_y = 0; this.sbar_h = 0; this.style_arr = []; this.styles = sBio.jsonParse(ppt.styles, false); this.sup = {}; this.tag = []; this.tBoxL = 0; this.tBoxT = 0; this.tBoxH = 100; this.tBoxW = 100; this.text_trace = false; this.text_w = 0; this.tx_l = 0; this.tx_r = 100; this.tx_t = 0; this.tx_b = 100; this.tf = {}; this.w = 0; let txt_h = this.h; if (ppt.overlayStyle == 2 || ppt.overlayStyle == 4) {t_r += 1; t_b += 1;}

	const albumsSame = () => {if (ppt.mul_item && this.alb_ix && this.albums.length && JSON.stringify(init_albums) === JSON.stringify(this.albums)) return true; return false;}
	const getLangIndex = n => {
		if (n) this.lfmLang = n;
		this.langArr.some((v, i) => {
			if (v.toLowerCase() == this.lfmLang) {this.lfmLang_ix = i; return langSetOK = true;}
		});
	}
	const getSimilar_search_done = (artist, list) => {bio_sim.push({name:artist, similar:list}); this.get_multi(true);}
	const getTopAlb_search_done = (artist, list) => {alb_top.push({name:artist, album:list}); this.get_multi(true);}
	const sort = (data, prop) => {data.sort((a, b) => {a = a[prop].toLowerCase(); b = b[prop].toLowerCase(); return a.localeCompare(b);}); return data;}
	const uniqAlbum = a => {
		const flags = []; let result = [];
		a.forEach(v => {
			const name = v.artist.toLowerCase() + " - " + v.album.toLowerCase();
			if (flags[name]) return;
			result.push(v); flags[name] = true;
		});
		return result = result.filter(v => v.type != "label");
	}
	const uniqArtist = a => {
		const flags = []; let result = [];
		a.forEach(v => {
			if (flags[v.name]) return;
			result.push(v); flags[v.name] = true;
		});
		return result;
	}

	this.artistsSame = () => {if (ppt.mul_item && this.art_ix && this.artists.length && JSON.stringify(init_artists) === JSON.stringify(this.artists)) return true; return false;}
	this.changed = () => {if (ppt.focus || !fb.IsPlaying) this.getData(false, ppt.focus, "multi_tag_bio", 0); else if (this.server) this.getData(false, ppt.focus, "", 1);}
	this.cleanPth = (pth, item, type, a, l, bio) => {
		pth = pth.trim().replace(/\//g, "\\"); if (pth.toLowerCase().includes("%profile%")) {let fbPth = fb.ProfilePath.replace(/'/g, "''").replace(/(\(|\)|\[|\]|%|,)/g, "'$1'"); if (fbPth.includes("$")) {const fbPthSplit = fbPth.split("$"); fbPth = fbPthSplit.join("'$$'");} pth = pth.replace(/%profile%(\\|)/gi, fbPth);}
		switch (type) {
			case 'mul': pth = bio ? tfBio(pth, a, item) : tfRev(pth, a, l, item); break;
			case 'server': pth = this.eval(pth, item, true); break;
			case 'tag': {const tf_p = FbTitleFormat(pth); pth = tf_p.EvalWithMetadb(item); break;}
			default: pth = this.eval(pth, item); break;
		}
		if (!pth) return ""; if (!pth.endsWith("\\")) pth += "\\"; const c_pos = pth.indexOf(":"); pth = pth.replace(/[/|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/\\\./g, "\\_").replace(/\.+\\/, "\\").replace(/\s*\\\s*/g, "\\"); if(c_pos < 3 && c_pos != -1) pth = sBio.replaceAt(pth, c_pos, ":"); while (pth.includes("\\\\")) pth = pth.replace(/\\\\/g,"\\_\\"); return pth.trim();
	}
	this.click = (x, y) => {if (this.zoom() || x < 0 || y < 0 || x > this.w || y > this.h || butBio.Dn) return; if (ppt.touchControl && !pBio.dblClick && Math.sqrt((Math.pow(this.last_pressed_coord.x - x, 2) + Math.pow(this.last_pressed_coord.y - y, 2))) > 3 * sBio.scale) return; if (t.text && (!ppt.img_only || ppt.text_only) && t.scrollbar_type().onSbar || ppt.heading && t.head && !ppt.img_only && (butBio.btns["heading"] && butBio.btns["heading"].trace(x, y) || butBio.btns["mt"] && butBio.btns["mt"].trace(x, y))) return; this.clicked = true; t.logScrollPos(); ppt.artistView = !ppt.artistView; if (ppt.cycPic) {ppt.artistView ? imgBio.photoTimestamp = Date.now() : imgBio.covTimestamp = Date.now();} if (!ppt.sameStyle && (ppt.bioMode != ppt.revMode || ppt.bioStyle != ppt.revStyle)) this.sizes(); t.na = ""; timerBio.clear(timerBio.source); ppt.sameStyle || (ppt.bioMode == ppt.revMode && ppt.bioStyle == ppt.revStyle) ? butBio.check() : butBio.refresh(true); if (calc) calc = ppt.artistView ? 1 : 2; if (!this.lock && this.multi_new()) {this.get_multi(true); if (!ppt.artistView) t.album_reset();} if (ppt.showAlbumHistory && ppt.artistView && !this.art_ix && this.alb_ix && this.albums[this.alb_ix].type.includes("history")) {t.get_multi(calc, this.art_ix, 0); imgBio.get_images();} else if (!this.art_ix && ppt.artistView) {t.getText(calc); imgBio.get_images();} else if (!this.alb_ix && !ppt.artistView) {pBio.inclTrackRev != 1 || !ppt.mul_item ? t.getText(calc) : t.get_multi(calc, this.art_ix, this.alb_ix); imgBio.get_images();} else {t.get_multi(calc, this.art_ix, this.alb_ix); imgBio.get_multi(this.art_ix, this.alb_ix);} if (ppt.img_only) imgBio.setCrop(true); if (!ppt.artistView) imgBio.set_chk_arr(null); this.move(x, y, true); t.getScrollPos(); calc = false;}; this.d = parseFloat(q("0000029142")); this.lfm = q("f50a8f9d80158a0fa0c673faec4584be=yek_ipa&");
	this.moveIni = n => {
		const d = new Date, timestamp = [d.getFullYear(), sBio.padNumber((d.getMonth()+1), 2), sBio.padNumber(d.getDate(), 2)].join("-") + "_" + [sBio.padNumber(d.getHours(), 2), sBio.padNumber(d.getMinutes(), 2), sBio.padNumber(d.getSeconds(), 2)].join("-");
		try {const fn = yttm + "biography_old_" + timestamp + ".ini"; if (!sBio.file(fn)) sBio.fs.MoveFile(this.bio_ini, fn);} catch (e) {if (n) fb.ShowPopupMessage("Unable to reset server settings.\n\nbiography.ini is being used by another program.", "Biography");}
	}
	this.eval = (n, focus, ignoreLock) => {if (!n) return ""; const tfo = FbTitleFormat(n); if (this.ir(focus)) return tfo.Eval(); const handle = sBio.handle(focus, ignoreLock); return handle ? tfo.EvalWithMetadb(handle) : "";}
	this.focus_load = sBio.debounce(() => {if (!ppt.img_only) t.on_playback_new_track(); if (!ppt.text_only || uiBio.blur) imgBio.on_playback_new_track();}, 250, {'leading':true, 'trailing': true});
	this.focus_serv = sBio.debounce(() => {this.changed();}, 1000);
	this.getData = (force, focus, notify, type) => {
		switch (type) {
			case 0: if (this.server) servBio.fetch(force, {ix:this.art_ix, focus:focus, arr:this.artists.slice(0)}, {ix:this.alb_ix, focus:focus, arr:this.albums.slice(0)}); else window.NotifyOthers(notify, [{ix:this.art_ix, focus:focus, arr:this.artists.slice(0)}, {ix:this.alb_ix, focus:focus, arr:this.albums.slice(0)}]); break;
			case 1: servBio.fetch(force, {ix:this.art_ix, focus:focus, arr:this.artists.slice(0)}, {ix:this.alb_ix, focus:focus, arr:this.albums.slice(0)}); break;}
	}
	this.getPth = (sw, focus, artist, album, stnd, supCache, a, aa, l, src, basic, server) => {
		let fo, pth;
		switch (sw) {
			case 'bio':
				if (stnd === "") stnd = std(this.art_ix, this.artists);
				if (server) fo = stnd ? this.cleanPth(this.pth[src], focus, 'server') : this.cleanPth(this.mul[src], focus, 'mul', artist, "", 1);
				else fo = stnd && !this.lock ? this.cleanPth(this.pth[src], focus) : this.cleanPth(this.mul[src], focus, 'mul', artist, "", 1);
				pth = fo + a + ".txt";
				if (!stnd && supCache && !sBio.file(pth)) fo = this.cleanPth(this.sup[src], focus, 'mul', artist, "", 1); pth = fo + a + ".txt";
				if (basic) return {fo:fo, pth:pth}; else return [fo, pth, a ? true : false, sBio.file(pth)];
			case 'rev':
				if (stnd === "") stnd = std(this.alb_ix, this.albums); if (!stnd) aa = a;
				if (server) fo = stnd ? this.cleanPth(this.pth[src], focus, 'server') : this.cleanPth(this.mul[src], focus, 'mul', artist, album, 0);
				else fo = stnd && !this.lock ? this.cleanPth(this.pth[src], focus) : this.cleanPth(this.mul[src], focus, 'mul', artist, album, 0);
				pth = fo + aa + " - " + l + ".txt";
				if (!stnd && supCache && !sBio.file(pth)) fo = this.cleanPth(this.sup[src], focus, 'mul', artist, album, 0); pth = fo + aa + " - " + l + ".txt";
				if (basic) return {fo:fo, pth:pth}; else return [fo, pth, aa && l ? true : false, sBio.file(pth)];
			case 'track':
				fo = this.cleanPth(this.mul[src], focus, 'mul', artist, album, 0); pth = fo + a + " - " + l + ".json";
				if (basic) return {fo:fo, pth:pth}; else return [fo, pth, a ? true : false, sBio.file(pth)];
			case 'cov':
				fo = this.cleanPth(this.pth.imgCov, focus, 'server'); pth = fo + this.eval(this.pth.imgCovFn, focus, true).clean();
				return {fo:fo, pth:pth};
			case 'img': {
				fo = this.cleanPth(this.mul.imgRev, focus, 'mul', artist, album, 0); const fn = (artist + " - " + album).clean(); pth = fo + fn;
				if (typeof supCache === 'undefined') return {fo:fo, fn:fn, pth:pth};
				const pe = [fo]; if (supCache) pe.push(this.cleanPth(this.sup.imgRev, focus, 'mul', artist, album, 0)); return {pe:pe, fe:fn}
			}
		}
	}
	const ini = (name, o, prop, b, space, f) => {const ln = !f ? o.length : 3; for (let i = b; i < ln; i++) utils.WriteINI(this.bio_ini, name, o[i].name, o[i][prop] + (space ? (!f ? (i == o.length - 1 ? "\r\n" : "") : (i == 2 ? "\r\n" : "")) : ""));}
	const ir_focus = () => {if (this.lock) return true; const fid = plman.ActivePlaylist.toString() + plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist).toString(), np = plman.GetPlayingItemLocation(); let pid = -2; if (np.IsValid) pid = plman.PlayingPlaylist.toString() + np.PlaylistItemIndex.toString(); return fid == pid;}
	const std = (a, b) => !a || a + 1 > b.length;
	const tfBio = (n, a, focus) => {n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, "$&#@!%path%#@!").replace(/%bio_artist%/gi, a.tf_escape()).replace(/%bio_album%/gi, this.tf.l).replace(/%bio_title%/gi, this.tf.t); n = this.eval(n, focus); n = n.replace(/#@!.*?#@!/g, ""); return n;}
	const tfRev = (n, aa, l, focus) => {n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*(%bio_albumartist%|%bio_album%)/gi, "$&#@!%path%#@!").replace(/%bio_albumartist%/gi, aa.tf_escape()).replace(/%bio_album%/gi, l.tf_escape()).replace(/%bio_title%/gi, this.tf.t); n = this.eval(n, focus); n = n.replace(/#@!.*?#@!/g, ""); return n;}
	this.inactivate = () => {ppt.panelActive = !ppt.panelActive; window.NotifyOthers("status_bio", ppt.panelActive); window.Reload();}
	this.ir = focus => fb.IsPlaying && fb.PlaybackLength <= 0 && (!focus || ir_focus());
	this.leave = () => {if (!ppt.autoEnlarge || menBio.right_up) return; if (ppt.img_only) {this.mode(0); enlarged_img = false;}}
	this.logAlbumHistory = (aa, l) => {if (aa != "Artist Unknown" && l != "Album Unknown") this.albumHistory.unshift({artist: aa, album: l, type: "history"}); this.albumHistory = uniqAlbum(this.albumHistory); if (this.albumHistory.length > 20) this.albumHistory.length = 20; ppt.albumHistory = JSON.stringify(this.albumHistory);}
	this.logArtistHistory = a => {if (a != "Artist Unknown") this.artistHistory.unshift({name: a, field: "", type: "history"}); this.artistHistory = uniqArtist(this.artistHistory); if (this.artistHistory.length > 20) this.artistHistory.length = 20; ppt.artistHistory = JSON.stringify(this.artistHistory);}
	this.mbtn_up = (x, y, menuLock) => {if (x < 0 || y < 0 || x > this.w || y > this.h) return; if (ppt.mul_item && (butBio.btns["mt"].trace(x, y) || menuLock)) {let mArtist = ppt.artistView && this.art_ix; if (!this.lock && !mArtist) imgBio.artist_reset(); if (!this.lock) {id.lockArt = this.eval(artFieldsArr, ppt.focus); id.lockAlb = name.albID(ppt.focus, 'full') + (this.inclTrackRev ? name.trackID(ppt.focus) : ""); this.lockHandle = sBio.handle(ppt.focus); imgBio.set_id(); imgBio.albFolder = pBio.cleanPth(pBio.albCovFolder, ppt.focus);} this.lock = this.lock == 0 || menuLock ? 1 : 0; t.curHeadingID = this.lock ? t.headingID() : ""; if (!this.lock && (ppt.artistView && id.lockArt != this.eval(artFieldsArr, ppt.focus) || !ppt.artistView && id.lockAlb != name.albID(ppt.focus, 'full') + (this.inclTrackRev ? name.trackID(ppt.focus) : ""))) {t.on_playback_new_track(true); imgBio.on_playback_new_track(true);} butBio.check(); t.paint(); return;} switch (true) {case (ppt.img_only || ppt.text_only): this.mode(0); break; case !this.text_trace && imgBio.trace(x, y): this.mode(1); break; case this.text_trace: this.mode(2); break;} this.move(x, y, true);}
	this.metadb_serv = sBio.debounce(() => {this.changed();}, 500);
	this.multi_new = () => {switch (true) {case ppt.artistView: id.artist_o = id.artist; id.artist = this.eval(artFieldsArr, ppt.focus); if (!ppt.mul_item) return true; else return id.artist != id.artist_o || !this.artists.length || !this.art_ix; case !ppt.artistView: id.alb_o = id.alb; id.alb = name.albID(ppt.focus, 'simple'); if (this.inclTrackRev) {id.tr_o = id.tr; id.tr = name.trackID(ppt.focus);} else id.tr_o = id.tr = ""; if (!ppt.mul_item) return true; else return id.alb != id.alb_o || id.tr != id.tr_o || !this.albums.length || !this.alb_ix;}}
	this.multi_serv = sBio.debounce(() => {this.getData(false, ppt.focus, "multi_tag_bio", 0);}, 1500);
	this.move = (x, y, click) => {if (ppt.text_only) this.text_trace = true; else if (ppt.img_only || !t.text) this.text_trace = false; else if (ppt.style < 4) {switch (ppt.style) {case 0: this.text_trace = y > this.img_t + this.imgs; break; case 1: this.text_trace = x < this.w - this.imgs - this.img_r; break; case 2: this.text_trace = y < this.img_t; break; case 3: this.text_trace =  x > this.img_l + this.imgs; break;}} else this.text_trace = y > this.tBoxT && y < this.tBoxT + this.tBoxH && x > this.tBoxL && x < this.tBoxL + this.tBoxW; if (!ppt.autoEnlarge || click || this.zoom()) return; const enlarged_img_o = enlarged_img; enlarged_img = !this.text_trace && imgBio.trace(x, y); if (enlarged_img && !ppt.text_only && !ppt.img_only && !enlarged_img_o) this.mode(1);}
	this.paint = () => window.RepaintRect(this.rp_x, this.rp_y + scaleForDisplay(40), this.rp_w, this.rp_h);
	this.resetAlbumHistory = () => {this.alb_ix = 0; this.lock = 0; this.albumHistory = []; ppt.albumHistory = JSON.stringify([]); history_aa_l = ""; this.get_multi(true);}
	this.resetArtistHistory = () => {this.art_ix = 0; this.lock = 0; this.artistHistory = []; ppt.artistHistory = JSON.stringify([]); history_a = ""; this.get_multi(true);}
	this.server = true; window.NotifyOthers("not_server_bio", 0);
	this.setBorder = (imgFull, bor, refl) => {if (imgFull) {this.bor_l = this.bor_r = this.bor_b = bor > 1 && !refl ? 10 * sBio.scale : 0; this.bor_t = 0;} else {this.bor_l = bor < 2 || refl ? ppt.borL : Math.max(ppt.borL, 10 * sBio.scale); this.bor_r = bor < 2 || refl ? ppt.borR : Math.max(ppt.borR, 10 * sBio.scale); this.bor_t = ppt.borT; this.bor_b = bor < 2 || refl ? ppt.borB : Math.max(ppt.borB, 10 * sBio.scale);}}
	this.setCycItem = () => {const ns = utils.InputBox(window.ID, "Enter time in seconds\n\nMinimum = 30 seconds", "Item: Cycle Time", this.cycTimeItem); if (!ns || ns == this.cycTimeItem) return false; this.cycTimeItem = Math.round(ns); if (!this.cycTimeItem || isNaN(this.cycTimeItem)) this.cycTimeItem = 30; this.cycTimeItem = Math.max(this.cycTimeItem, 30); ppt.cycTimeItem = this.cycTimeItem;}
	this.setCycPic = () => {const ns = utils.InputBox(window.ID, "\n\nEnter time in seconds", "Photo: Cycle Time", ppt.cycTimePic); if (!ns || ns == ppt.cycTimePic) return false; ppt.cycTimePic = Math.round(ns); if (!ppt.cycTimePic || isNaN(ppt.cycTimePic)) ppt.cycTimePic = 15; imgBio.delay = Math.min(ppt.cycTimePic, 7) * 1000;}
	this.setSimTagNo = () => {const ns = utils.InputBox(window.ID, "Enter number 0-100 (0 Disables writing the tag)\n\nUp to 6 are read from the biography\nUsing 6+ requires saved lists\n\nSaving auto-enables while 6+\nLists save on playing tracks etc\n", "Set Number of Similar Artists to Write to Tag ", this.tag[8].enabled); if (!ns || ns == this.tag[8].enabled) return false; this.tag[8].enabled = parseFloat(ns); this.updIniTag(8);}
	this.updIniClickAction = n => {utils.WriteINI(this.bio_ini, "MISCELLANEOUS", this.def_tf[9].name, n); window.NotifyOthers("refresh_bio", "refresh_bio");}
	this.updIniLang = n => utils.WriteINI(this.bio_ini, "LASTFM LANGUAGE", this.lang[0].name, n);
	this.updIniTag = n => {enabled = this.tag[n].enabled; if (n < 8) {if (enabled !== 1 && enabled !== 0) enabled = advTag[n].tag;} else {enabled = sBio.clamp(enabled, 0, 100);} this.tag[n].enabled = enabled; utils.WriteINI(this.bio_ini, "ADVANCED: TAG WRITER", advTag[n].name, enabled); window.NotifyOthers("refresh_bio", "refresh_bio");}
	this.valueIni = (section, key, def, type) => {let n = ""; switch (type) {case 0: n = utils.ReadINI(this.bio_ini, section, key); if (!n) return def; break; case 1: n = parseFloat(utils.ReadINI(this.bio_ini, section, key)); if (n !== 1 && n !== 0) return def; break; case 2: n = parseFloat(utils.ReadINI(this.bio_ini, section, key)); if (isNaN(n)) return def; break;} return n;}
	const yttm = fb.ProfilePath + "yttm\\"; sBio.create(yttm); this.bio_ini = yttm + "biography.ini";
	this.zoom = () => vkBio.k('shift') || vkBio.k('ctrl');

	this.def_dn = [
		{name:"Biography [Allmusic] Auto-Fetch", dn:1},
		{name:"Biography [Lastfm] Auto-Fetch", dn:1},
		{name:"Album Review [Allmusic] Auto-Fetch", dn:1},
		{name:"Album Review [Lastfm] Auto-Fetch", dn:1},
		{name:"Image [Artist] Auto-Fetch", dn:1},
		{name:"Image [Review] Auto-Fetch", dn:1}
	];
	const def_paths = [
		{name:"Album Review [Allmusic] Folder", path:"%profile%\\yttm\\review\\allmusic\\$lower($cut(%BIO_ALBUMARTIST%,1))"},
		{name:"Album Review [Lastfm] Folder",path:"%profile%\\yttm\\review\\lastfm\\$lower($cut(%BIO_ALBUMARTIST%,1))"},
		{name:"Biography [Allmusic] Folder", path:"%profile%\\yttm\\biography\\allmusic\\$lower($cut(%BIO_ARTIST%,1))"},
		{name:"Biography [Lastfm] Folder", path:"%profile%\\yttm\\biography\\lastfm\\$lower($cut(%BIO_ARTIST%,1))"},
		{name:"Image [Artist] Folder", path:"%profile%\\yttm\\art_img\\$lower($cut(%BIO_ARTIST%,1))\\%BIO_ARTIST%"},
		{name:"Image [Review] Folder", path:"%profile%\\yttm\\rev_img\\$lower($cut(%BIO_ALBUMARTIST%,1))\\%BIO_ALBUMARTIST%"}
	];
	this.cov = [
		{name:"Auto-Save", path:0},
		{name:"Auto-Save Folder", path:"$directory_path(%path%)"},
		{name:"Auto-Save File Name", path:"cover"}
	];
	const covFolder = {name:"Folder", path:"%profile%\\yttm\\art_img\\$lower($cut(%BIO_ARTIST%,1))\\%BIO_ARTIST%"};
	this.def_tf = [
		{name:"%BIO_ALBUMARTIST%", tf:"$if3($meta(album artist,0),$meta(artist,0),$meta(composer,0),$meta(performer,0))"},
		{name:"%BIO_ARTIST%", tf:"$if3($meta(artist,0),$meta(album artist,0),$meta(composer,0),$meta(performer,0))"},
		{name:"%BIO_ALBUM%", tf:"$meta(album,0)"},
		{name:"%BIO_TITLE%", tf:"$meta(title,0)"},
		{name:"Album Name Auto-Clean", tf:0},
		{name:"Cache Expiry (days: minimum 28)", tf:28},
		{name:"Image [Artist] Initial Fetch Number (1-20)", tf:5},
		{name:"Image [Artist] Auto-Add New", tf:1},
		{name:"Image [Artist] Cache Limit", tf:""},
		{name:"Mouse Left Button Click: Map To Double-Click", tf:0},
		{name:"Search: Include Partial Matches", tf:1},
		{name:"Various Artists", tf:"Various Artists"}
	];
	this.lang = [
		{name:"Lastfm Language", tf:"EN"},
		{name:"Lastfm Language Fallback To English", tf:0}
	];
	const advCov = [
		{name:"Image [Cover] Check Custom Paths", path:0},
		{name:"Image [Cover] Custom Path 1 [Full Path Minus Extension]", path:""},
		{name:"Image [Cover] Custom Path 2 [Full Path Minus Extension]", path:""},
		{name:"Image [Cover] Custom Path 3 [Full Path Minus Extension]", path:""},
		{name:"Image [Cover] Custom Path 4 [Full Path Minus Extension]", path:""},
		{name:"Image [Cover] Custom Path 5 [Full Path Minus Extension]", path:""}
	];
	const advMore = [
		{name:"Use Supplemental Cache", path:0},
		{name:"Supplemental Cache [Use Find>Replace on SAVE paths]", path:"yttm>yttm\\bio_supplemental"},
		{name:"Review Image Quality 0-Medium 1-High", path:0},
		{name:"Similar Artists: Number to Display(0-10)", path:4}
	];
	const advSimilar = [
		{name:"Save List 0-Never 1-Auto", tag:1},
		{name:"Save Folder", tag:"%profile%\\yttm\\lastfm\\$lower($cut(%BIO_ARTIST%,1))"}
	];
	const advTag = [
		{name:"Write Tag: Album Genre AllMusic", tag:1},
		{name:"Write Tag: Album Mood AllMusic", tag:1},
		{name:"Write Tag: Album Rating AllMusic", tag:1},
		{name:"Write Tag: Album Theme AllMusic", tag:1},
		{name:"Write Tag: Artist Genre AllMusic", tag:1},
		{name:"Write Tag: Album Genre Last.fm", tag:1},
		{name:"Write Tag: Artist Genre Last.fm", tag:1},
		{name:"Write Tag: Similar Artists Last.fm: Number to Write (0-100)", tag:4},
		{name:"Tag Name: Album Genre AllMusic", tag:"Album Genre AllMusic"},
		{name:"Tag Name: Album Mood AllMusic", tag:"Album Mood AllMusic"},
		{name:"Tag Name: Album Rating AllMusic", tag:"Album Rating AllMusic"},
		{name:"Tag Name: Album Theme AllMusic", tag:"Album Theme AllMusic"},
		{name:"Tag Name: Artist Genre AllMusic", tag:"Artist Genre AllMusic"},
		{name:"Tag Name: Album Genre Last.fm", tag:"Album Genre Last.fm"},
		{name:"Tag Name: Artist Genre Last.fm", tag:"Artist Genre Last.fm"},
		{name:"Tag Name: Similar Artists Last.fm", tag:"Similar Artists Last.fm"}
	];
	const helpText = "A foobar2000 restart is required for any changes to take effect. Only change entries after the equal signs. Entries have a 255 character limit.\r\n\r\n"
		+ "Biography.ini Version A0001\r\n\r\n"
		+ "========================================\r\n"
		+ "CUSTOMISATION HELP:\r\n\r\nEnter 0 or 1 or as indicated.\r\n\r\n"
		+ "AUTO-FETCH:\r\n1 Enable web search for source. Results are cached.\r\n0 Disable web search for source. Existing data cached to disc will be loaded.\r\n\r\n"
		+ "NAMES:\r\nUsed in search, folder + file names & headings. %BIO_ALBUMARTIST%, %BIO_ARTIST% and %BIO_ALBUM% define titleformat used for albumartist, artist and album, respectively. Variables are specific to Biography. Change default title formatting if required.\r\n\r\n"
		+ "SAVE:\r\nEnter title formatting or absolute paths. Always use the variables %BIO_ALBUMARTIST%, %BIO_ARTIST% or %BIO_ALBUM%, if applicable, to ensure correct functionality (copy style of defaults). The 2 reviews (& 2 biographies) must be saved in different folders. %profile% can be put at the start of the path and resolves to the foobar2000 profile folder or program folder in portable mode. Don't use %path% in save paths - it's incompatible with radio streams etc. As with title formatting, enclose literal ()[]'%$ in single quotes. It is recommended to validate changes by checking save paths of a few files. Trailing \\ not needed. File names are auto generated. To organise by artist instead of source, search documentation for SAVE & paste patterns therein.\r\n\r\n"
		+ "COVERS: MUSIC FILES:\r\nEnable auto-save to have music file covers saved to a specified location.\r\n\r\n"
		+ "LASTFM LANGUAGE:\r\nEnter language code: EN, DE, ES, FR, IT, JA, PL, PT, RU, SV, TR or ZH, or use \"Sources Menu\". Optional fallback to trying English (EN) server if no results. AllMusic info is only available in English.\r\n\r\n"
		+ "MISCELLANEOUS:\r\nImage [Artist] Cache Limit: limits number of images stored to value set. If used with \"Auto-Add New\", newer images are added & older removed to give a fixed number of up-to-date images.\r\n\r\n"
		+ "ADVANCED:\r\nCustom cover paths. Most users shouldn't need this feature as covers are auto-loaded via foobar2000 album art reader or from save locations. Enable if required.\r\nSimilar Artists (\"Tagger\" & \"More Menu\"). Up to 4 are read from the biography. Using 5+ requires a saved list. Saving auto-enables by default while either set to 5+.\r\nWrite Tag: sets which tags are available to be written. Enter 0 or 1 or as indicated. Change tag names as required.\r\n***See documentation for full info on advanced items.***"

	let bio_ini = sBio.open(this.bio_ini); if (sBio.file(this.bio_ini) && !bio_ini.includes("Version A0001") && !bio_ini.includes("Version A0002")) this.moveIni(); // Check correct ini. Remove & back-up any can't auto-update. Back compatibility: number as A0002.x.x etc to avoid old bios resetting; use A0003 etc to force reset
	if (!sBio.file(this.bio_ini)) { // No ini: fresh install, reset or unable to auto-update. Create new ini
		utils.WriteINI(this.bio_ini, helpText, "", "=======================================\r\n");
		ini("AUTO-FETCH", this.def_dn, 'dn', 0, 1);
		ini("NAMES", this.def_tf, 'tf', 0, 1, 3);
		ini("SAVE", def_paths, 'path', 0, 1);
		ini("COVERS: MUSIC FILES", this.cov, 'path', 0, 1);
		ini("LASTFM LANGUAGE", this.lang, 'tf', 0, 1);
		ini("MISCELLANEOUS", this.def_tf, 'tf', 4, 1);
		ini("ADVANCED: CUSTOM COVER PATHS", advCov, 'path', 0, 1);
		ini("ADVANCED: MORE MENU ITEMS", advMore, 'path', 0, 1);
		ini("ADVANCED: SIMILAR ARTISTS", advSimilar, 'tag', 0, 1);
		ini("ADVANCED: TAG WRITER", advTag, 'tag', 0, 0);
	}

	bio_ini = sBio.open(this.bio_ini);
	if (!bio_ini.includes("Version A0002")) { // Update A0001 to A0002
		bio_ini = bio_ini
			.replace("Version A0001", "Version A0002")
			.replace("%path% here -", "%path% in save paths -")
			.replace("specified location.", "specified location.\r\n\r\nCOVERS: CYCLE FOLDER:\r\nEnter folder. Title formatting, %BIO_ALBUMARTIST%, %BIO_ARTIST%, %BIO_ALBUM%, %profile% and absolute paths are supported.")
			.replace("limits number of images stored to value set", "number per artist. Blank = no limit")
			.replace("[LASTFM LANGUAGE]", "[COVERS: CYCLE FOLDER]\r\nFolder=" + utils.ReadINI(this.bio_ini, "SAVE", def_paths[4].name) + "\r\n\r\n[LASTFM LANGUAGE]")
			.replace("written. Enter 0 or 1 or as indicated", "written. Enter 0 or 1 or as indicated, or use \"Write Tags... Menu\"")
			.replace("Write Tag: Similar Artists Last.fm", "Write Tag: Locale Last.fm=1\r\nWrite Tag: Similar Artists Last.fm")
			.replace("Tag Name: Similar Artists Last.fm", "Tag Name: Locale Last.fm=Locale Last.fm\r\nTag Name: Similar Artists Last.fm");
	}

	if (!bio_ini.includes("Version A0002.1")) { // Update A0002 to A0002.1
		bio_ini = bio_ini
			.replace("Version A0002", "Version A0002.1")
			.replace(" and %BIO_ALBUM%", ", %BIO_ALBUM% and %BIO_TITLE%")
			.replace("artist and album", "artist, album and title")
			.replace(" or %BIO_ALBUM%", ", %BIO_ALBUM% or %BIO_TITLE")
			.replace(", %BIO_ALBUM%,", ", %BIO_ALBUM%, %BIO_TITLE,")
			.replace("\r\n\r\n[SAVE]", "\r\n" + this.def_tf[3].name + "=" + this.def_tf[3].tf + "\r\n\r\n[SAVE]");
			this.moveIni();
		sBio.save(this.bio_ini, bio_ini, true);
	}

	if (!bio_ini.includes("Version A0002.1.1")) { // Update A0002.1 to A0002.1.1
		bio_ini = bio_ini
			.replace("Version A0002.1", "Version A0002.1.1")
			.replace("Number to Display(0-10)=4", "Number to Display(0-10)=6")
			.replace("Number to Write (0-100)=4", "Number to Write (0-100)=6")
			.replace("4 are read from the biography. Using 5+ requires a saved list. Saving auto-enables by default while either set to 5+", "6 are read from the biography. Using 7+ requires a saved list. Saving auto-enables by default while either set to 7+")
			this.moveIni();
		sBio.save(this.bio_ini, bio_ini, true);
	} advTag.splice(7, 0, {name:"Write Tag: Locale Last.fm", tag:1}); advTag.splice(16, 0, {name:"Tag Name: Locale Last.fm", tag:"Locale Last.fm"}); // finalise advTag

	let pthArr = ["amRev", "lfmRev", "amBio", "lfmBio", "imgArt", "imgCov", "imgCovFn", "lfmSim"]; const tfArr = ["aa", "a", "l", "t"]; tfArr.forEach((v, i) => this.tf[v] = this.valueIni("NAMES", this.def_tf[i].name, this.def_tf[i].tf, 0).replace(RegExp(this.def_tf[i].name, "gi"), "")); // replace self
	for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) this.tf[tfArr[i]] = this.tf[tfArr[i]].replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]); // substitute titleformat

	pthArr.forEach((v, i) => { // standard
		if (i < 5) this.pth[v] = this.valueIni("SAVE", def_paths[i].name, def_paths[i].path, 0);
	});

	pthArr.forEach((v, i) => {
		if (i > 4 && i < 7) this.pth[v] = this.valueIni("COVERS: MUSIC FILES", this.cov[i - 4].name, this.cov[i - 4].path, 0);
	}); this.pth[pthArr[7]] = this.valueIni("ADVANCED: SIMILAR ARTISTS", advSimilar[1].name, advSimilar[1].tag, 0);

	pthArr.forEach(v => { // substitute titleformat
		for (j = 0; j < 4; j++) this.pth[v] = this.pth[v].replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]);
	});

	this.dblClick = this.valueIni("MISCELLANEOUS", this.def_tf[9].name, this.def_tf[9].tf, 1);
	this.extra = this.valueIni("ADVANCED: CUSTOM COVER PATHS", advCov[0].name, advCov[0].path, 1);
	this.lfmLang = utils.ReadINI(this.bio_ini, "LASTFM LANGUAGE", this.lang[0].name).toLowerCase(); getLangIndex(); if (!langSetOK) this.lfmLang = "en";
	this.rev_img = this.valueIni("AUTO-FETCH", this.def_dn[5].name, this.def_dn[5].dn, 1);
	let similarNo = parseFloat(utils.ReadINI(this.bio_ini, "ADVANCED: MORE MENU ITEMS", advMore[3].name)); similarNo = sBio.clamp(similarNo, 0, 10);
	this.va = this.valueIni("MISCELLANEOUS", this.def_tf[11].name, this.def_tf[11].tf, 0); this.va = this.va.toLowerCase();

	pthArr = ["amRev", "lfmRev", "amBio", "lfmBio", "imgArt", "imgRev"]; pthArr.forEach((v, i) => { // look up
		this.mul[v] = this.valueIni("SAVE", def_paths[i].name, def_paths[i].path, 0);
		if (inRev[i]) this.mul[v] = this.mul[v].replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, "%BIO_ALBUMARTIST%"); // simplify later substitutions + convert case
		if (inBio[i]) this.mul[v] = this.mul[v].replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, "%BIO_ARTIST%"); // simplify later substitutions + convert case
	});

	pthArr = ["Cache", "imgRevHQ"]; pthArr.forEach((v, i) => this.sup[v] = this.valueIni("ADVANCED: MORE MENU ITEMS", advMore[i * 2].name, advMore[i * 2].path, 1));

	advTag.forEach((v, i) => {
		if (i < 9) {
			enabled = parseFloat(utils.ReadINI(this.bio_ini, "ADVANCED: TAG WRITER", v.name));
			if (i < 8) {if (enabled !== 1 && enabled !== 0) enabled = v.tag;}
			else {enabled = sBio.clamp(enabled, 0, 100);}
			nn = this.valueIni("ADVANCED: TAG WRITER", advTag[i + 9].name, advTag[i + 9].tag, 0);
			this.tag[i] = {name:nn, enabled:enabled};
		}
	}); this.lfm_sim = this.valueIni("ADVANCED: SIMILAR ARTISTS", advSimilar[0].name, advSimilar[0].tag, 1); if (this.lfm_sim && similarNo < 7 && this.tag[8].enabled < 7) this.lfm_sim = 0; if (this.local) {this.lfm_sim = 0; this.sup.imgRevHQ = 1; this.sup.Cache = 1;}

	if (this.sup.Cache) { // supplemental
		pthArr = ["amRev", "lfmRev", "amBio", "lfmBio", "imgArt", "imgRev"];
		const arr1 = [], arr2 = [], replace = utils.ReadINI(this.bio_ini, "ADVANCED: MORE MENU ITEMS", advMore[1].name).replace(/>/g, "|").split("|");
		replace.forEach((v, i) => {
			if (i % 2 == 0) arr1.push(v.trim() || "yttm"); else arr2.push(v.trim() || "yttm\\bio_supplemental");
		});
		pthArr.forEach((v, i) => {
			this.sup[v] = this.valueIni("SAVE", def_paths[i].name, def_paths[i].path, 0);
			if (arr1.length == arr2.length) for (j = 0; j < arr1.length; j++) this.sup[v] = this.sup[v].replace(RegExp(arr1[j], "gi"), arr2[j]);
			if (inRev[i]) this.sup[v] = this.sup[v].replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, "%BIO_ALBUMARTIST%");
			if (inBio[i]) this.sup[v] = this.sup[v].replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, "%BIO_ARTIST%");
		});
	}

	["albartFields", "artFields", "albFields"].forEach((v, i) => this[v] = this.tf[tfArr[i]].replace(/\$.*?\(/gi, "").replace(/(,(|\s+)\d+)/gi,"").replace(/[,()[\]%]/gi,"|").split("|"));

	this.albartFields = this.albartFields.filter(v => v.trim());
	this.artFields = this.artFields.filter(v => v.trim());
	artFieldsArr = this.artFields.map(v => "%" + v + "%");
	this.albFields = this.albFields.filter(v => v.trim());

	this.albCovFolder = this.valueIni("COVERS: CYCLE FOLDER", covFolder.name, covFolder.path, 0);
	for (j = 0; j < 4; j++) this.albCovFolder = this.albCovFolder.replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]);

	if (this.extra) { // extra covers
		this.extraPaths = []; for (i = 1; i < advCov.length; i++) {
			let ep = utils.ReadINI(this.bio_ini, "ADVANCED: CUSTOM COVER PATHS", advCov[i].name).replace(/%profile%\\/i, fb.ProfilePath);
			for (j = 0; j < 4; j++) ep = ep.replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]); if (ep) this.extraPaths.push(ep);
		}
	}

	this.get_multi = p_clear => {
		if (!ppt.mul_item) return; let a = name.artist(ppt.focus, true) || "Artist Unknown", aa = name.alb_artist(ppt.focus, true) || "Artist Unknown", l = name.album(ppt.focus, true) || "Album Unknown";
		if (this.lock) {this.logArtistHistory(a); this.logAlbumHistory(aa, l); return;}

		let ix = -1, k = 0, kw = ""; const lfmBio = this.cleanPth(this.pth.lfmBio, ppt.focus) + a.clean() + ".txt", lfm_a = sBio.open(lfmBio), lfmSim = this.cleanPth(this.pth.lfmSim, ppt.focus) + a.clean() + " And Similar Artists.json", mult_arr = []; let mn = "", nm = "", sa = "", ta = ""; init_albums = this.albums.slice(0); this.albums = []; init_artists = this.artists.slice(0); this.artists = []; this.artists.push({name: a, field: "", type: "Artist"});
		if (ppt.showSimilarArtists) {
			if (sBio.file(lfmSim)) {
				const lfm_s = sBio.jsonParse(lfmSim, false, 'file'); let newStyle = false;
				if (lfm_s) {
					if (sBio.objHasOwnProperty(lfm_s[0], 'name')) newStyle = true; lfm_s.shift();
					$Bio.take(lfm_s, similarNo);
					if (lfm_s.length) {
						this.artists.push({name: "Similar Artists:", field: "", type: "label"});
						lfm_s.forEach((v, i, arr) => this.artists.push({name: newStyle ? v.name : v, field: "", type: i != arr.length - 1 ? "similar" : "similarend"}));
					}
				}
			} else {
				if (sBio.file(lfmBio)) {
					kw = "Similar Artists: |Ähnliche Künstler: |Artistas Similares: |Artistes Similaires: |Artisti Simili: |似ているアーティスト: |Podobni Wykonawcy: |Artistas Parecidos: |Похожие исполнители: |Liknande Artister: |Benzer Sanatçılar: |相似艺术家: "
					let found = false, sim = lfm_a.match(RegExp(kw)); if (sim) {sim = sim.toString(); ix = lfm_a.lastIndexOf(sim); if (ix != -1) {sa = lfm_a.substring(ix + sim.length); sa = sa.split('\n')[0].trim().split(", ");}}
					if (sa.length < 7 && sa) {$Bio.take(sa, similarNo); found = true;}
					if (!found) {
						bio_sim.some(v => {
							if (v.name == a) {sa = $Bio.take(v.similar, similarNo); return found = true;}
						});
						if (!found) {const getSimilar = new Lfm_similar_artists(() => getSimilar.on_state_change(), getSimilar_search_done); getSimilar.Search(a, "", "", 6);}
					}
					if (found && $Bio.isArray(sa) && sa.length) {
						this.artists.push({name: "Similar Artists:", field: "", type: "label"});
						sa.forEach((v, i) => this.artists.push({name: v, field: "", type: i != sa.length - 1 ? "similar" : "similarend"}));
					}
				}
			}
		}
		if (ppt.showMoreTags) {
			this.moreTags = false;
			artFieldsArr.forEach(v => {
				nm = v.replace(/%/g, "");
				for (let h = 0; h < this.eval("$meta_num(" + nm + ")", ppt.focus); h++) {
					mn = "$trim($meta(" + nm + "," + h + "))";
					const name = this.eval(mn, ppt.focus);
					if (this.artists.every(v => v.name !== name) && name.toLowerCase() != this.va) mult_arr.push({name: name, field: " ~ " + nm.titlecase(), type: "tag"});
				}
			});
			if (mult_arr.length > 1) {sort(mult_arr, "name"); k = mult_arr.length; while (k--) if (k != 0 && mult_arr[k].name.toLowerCase() == mult_arr[k - 1].name.toLowerCase()) {
				if (!mult_arr[k - 1].field.toLowerCase().includes(mult_arr[k].field.toLowerCase())) mult_arr[k - 1].field += mult_arr[k].field;
				mult_arr.splice(k, 1);
			}}
			if (mult_arr.length) {
				this.moreTags = true;
				this.artists.push({name: "More Tags:", field: "", type: "label"}); this.artists = this.artists.concat(mult_arr); this.artists[this.artists.length - 1].type = "tagend";}
		}

		if (!a || !history_a || a != history_a) {
			artistHistory = JSON.parse(JSON.stringify(this.artistHistory));
			if (artistHistory.length && artistHistory[0].name == a) artistHistory.shift();
			this.logArtistHistory(a);
			history_a = a;
		}

		if (!(aa + l) || !history_aa_l || aa + l != history_aa_l) {
			albumHistory = JSON.parse(JSON.stringify(this.albumHistory));
			if (albumHistory.length && albumHistory[0].artist == aa && albumHistory[0].album == l) albumHistory.shift();
			this.logAlbumHistory(aa, l);
			this.inclTrackRev = ppt.inclTrackRev;
			history_aa_l = aa + l;
		}

		if (artistHistory.length && ppt.showArtistHistory) {
			this.artists.push({name: "Artist History:", field: "", type: "label"});
			for (let h = 0; h < artistHistory.length; h++) this.artists.push(artistHistory[h]);
			this.artists[this.artists.length - 1].type = "historyend";
		}

		this.artists.forEach((v, i) => v.ix = i);
		this.artistsUniq = this.artists.filter(v => v.type != "label");

		if (ppt.showTopAlbums && sBio.file(lfmBio)) {
			kw = "Top Albums: |Top-Alben: |Álbumes Más Escuchados: |Top Albums: |Album Più Ascoltati: |人気アルバム: |Najpopularniejsze Albumy: |Álbuns Principais: |Популярные альбомы: |Toppalbum: |En Sevilen Albümler: |最佳专辑: "; ix = -1;
			let found = false, talb = lfm_a.match(RegExp(kw)); if (talb) {talb = talb.toString(); ix = lfm_a.lastIndexOf(talb); if (ix != -1) {ta = lfm_a.substring(ix + talb.length); ta = ta.split('\n')[0].trim().split(", ");}}
			if (ta.length < 7 && ta) found = true;
			if (!found) {
				alb_top.some(v => {
					if (v.name == a) {ta = $Bio.take(v.album, 6); return found = true;}
				});
				if (!found) {const getTopAlb = new Lfm_top_albums(() => getTopAlb.on_state_change(), getTopAlb_search_done); getTopAlb.Search(a);}
			}
			this.albums = [];
			this.albums.push({artist: aa, album: l, type: "Current Album"});
			if (found && $Bio.isArray(ta) && ta.length) {
				this.albums.push({artist: "Last.fm Top Albums: " + a + ":", album: "Last.fm Top Albums: " + a + ":", type: "label"});
				ta.forEach((v, i) => this.albums.push({artist: a, album: v, type: i != ta.length - 1 ? "album" : "albumend"}));
			}
		} else {this.albums = []; this.albums.push({artist: aa, album: l, type: "Current Album"});}

		if (albumHistory.length && ppt.showAlbumHistory) {
			this.albums.push({artist: "Album History:", l: "", album: "Album History:", type: "label"});
			for (let h = 0; h < albumHistory.length; h++) this.albums.push(albumHistory[h]);
			this.albums[this.albums.length - 1].type = "historyend";
		}

		this.albums.forEach((v, i) => v.ix = i);
		this.albumsUniq = uniqAlbum(this.albums);
		if (!this.artistsSame() && p_clear) this.art_ix = 0; if (!albumsSame() && p_clear) this.alb_ix = 0;
	}

	if (!this.styles || !$Bio.isArray(this.styles)) {ppt.set("SYSTEM.Freestyle Custom BackUp", ppt.styles); this.styles = []; ppt.styles = JSON.stringify(this.styles); fb.ShowPopupMessage("Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to \"SYSTEM.Freestyle Custom BackUp\" in panel properties.", "Biography");}
	else {let valid = true; this.styles.forEach(v => {if (!sBio.objHasOwnProperty(v, 'name') || isNaN(v.imL) || isNaN(v.imR) || isNaN(v.imT) || isNaN(v.imB) || isNaN(v.txL) || isNaN(v.txR) || isNaN(v.txT) || isNaN(v.txB)) valid = false;}); if (!valid) {ppt.set("SYSTEM.Freestyle Custom BackUp", ppt.styles); this.styles = []; ppt.styles = JSON.stringify(this.styles); fb.ShowPopupMessage("Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to \"SYSTEM.Freestyle Custom BackUp\" in panel properties.", "Biography");}}
	if (!this.overlay || !sBio.objHasOwnProperty(this.overlay, 'name') || isNaN(this.overlay.imL) || isNaN(this.overlay.imR) || isNaN(this.overlay.imT) || isNaN(this.overlay.imB) || isNaN(this.overlay.txL) || isNaN(this.overlay.txR) || isNaN(this.overlay.txT) || isNaN(this.overlay.txB)) {ppt.set("SYSTEM.Overlay BackUp", ppt.overlay); this.overlay = {"name":"Overlay", "imL":0, "imR":0, "imT":0, "imB":0, "txL":0, "txR":0, "txT":0.632, "txB":0}; ppt.overlay = JSON.stringify(this.overlay); fb.ShowPopupMessage("Unable to load \"SYSTEM.Overlay\".\n\nThe save location was corrupt. The overlay style has been reset to default.\n\nThe original should be backed up to \"SYSTEM.Overlay BackUp\" in panel properties.", "Biography");}
	const styleArr = () => {
		this.style_arr = ["Top", "Right", "Bottom", "Left", "Overlay"];
		this.styles.forEach(v => this.style_arr.push(v.name));
	}
	styleArr();

	this.sizes = bypass => {
		if (ppt.get("SYSTEM.Bottom Size Correction", false)) {this.w = ppt.img_only ? window.Width : window.Width - window.Width * 18 / 1018; this.h = ppt.img_only ? window.Height : window.Height - window.Height * 18 / 1018;} // size correction can be set to true for optimal text positioning where panel size is increased to compensate for shadow effect
		this.sbar_o = [2 + uiBio.arrow_pad, Math.max(Math.floor(uiBio.scr_but_w * 0.2), 2) + uiBio.arrow_pad * 2, 0][uiBio.sbarType]; this.top_corr = [this.sbar_o - (uiBio.but_h - uiBio.scr_but_w) / 2, this.sbar_o, 0][uiBio.sbarType]; const bot_corr = [(uiBio.but_h - uiBio.scr_but_w) / 2 - this.sbar_o, -this.sbar_o, 0][uiBio.sbarType];
		this.clip = false;
		if (!ppt.sameStyle) {
			switch (true) {
				case ppt.artistView:
					if (ppt.bioMode == 1) {ppt.img_only = true; ppt.text_only = false;}
					else if (ppt.bioMode == 2) {ppt.img_only = false; ppt.text_only = true;}
					else {ppt.img_only = false; ppt.text_only = false; ppt.style = ppt.bioStyle;}
					break;
				case !ppt.artistView:
					if (ppt.revMode == 1) {ppt.img_only = true; ppt.text_only = false;}
					else if (ppt.revMode == 2) {ppt.img_only = false; ppt.text_only = true;}
					else {ppt.img_only = false; ppt.text_only = false; ppt.style = ppt.revStyle;}
					break;
			}
		}
		switch (true){
			case ppt.img_only: // img_only
				this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
				this.imgs = sBio.clamp(this.h - this.bor_t - this.bor_b, 10, this.w - this.bor_l - this.bor_r);
				break;
			case ppt.text_only: // text_only
				this.lines_drawn = Math.max(Math.floor((this.h - ppt.textT - ppt.textB - uiBio.heading_h) / uiBio.font_h), 0);
				this.text_l = ppt.textL;
				this.text_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR;
				this.text_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - this.lines_drawn * uiBio.font_h + uiBio.heading_h) / 2 : ppt.textT + uiBio.heading_h;
				this.text_w = this.w - this.text_l - this.text_r - ppt.borR;
				this.heading_x = this.text_l;
				this.heading_w = this.text_w + ppt.borR;
				if (ppt.sbarShow) {this.sbar_x = this.w - uiBio.sbar_sp - ppt.borR + scaleForDisplay(1); this.sbar_y = (uiBio.sbarType < sbarStyle ? this.text_t : 0) + this.top_corr + scaleForDisplay(13); this.sbar_h = (uiBio.sbarType < sbarStyle ? uiBio.font_h * this.lines_drawn + bot_corr : this.h - this.sbar_y) + bot_corr;}
				this.rp_x = 0; this.rp_y = 0; this.rp_w = this.w; this.rp_h = this.h;
				break;
			case ppt.style == 0: // top
				this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
				txt_h = Math.round((this.h - this.img_t - ppt.textB) * (1 - ppt.rel_imgs));
				this.lines_drawn = Math.max(Math.floor((txt_h + uiBio.heading_h - scaleForDisplay(20)) / uiBio.font_h), 0);
				txt_h = this.lines_drawn * uiBio.font_h + ppt.gap;
				this.imgs = Math.max(this.h - txt_h - this.img_t - ppt.textB - uiBio.heading_h - scaleForDisplay(40), 10);
				this.text_l = ppt.textL;
				this.text_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR;
				this.text_t = this.img_t + this.imgs + ppt.gap + uiBio.heading_h + scaleForDisplay(40);
				this.text_w = this.w - this.text_l - this.text_r - scaleForDisplay(24);
				this.text_h = txt_h + uiBio.heading_h;
				this.heading_x = this.text_l;
				this.heading_w = this.text_w + scaleForDisplay(24);
				if (ppt.sbarShow) {this.sbar_x = this.w - uiBio.sbar_sp - ppt.borR + scaleForDisplay(1); this.sbar_y = (uiBio.sbarType < sbarStyle || ppt.heading ? this.text_t : this.img_t + this.imgs) + this.top_corr + scaleForDisplay(13); this.sbar_h = (uiBio.sbarType < sbarStyle ? uiBio.font_h * this.lines_drawn + bot_corr : this.h - this.sbar_y) + bot_corr;}
				this.rp_x = 0; this.rp_y = this.img_t + this.imgs; this.rp_w = this.w; this.rp_h = this.h - this.rp_y;
				break;
			case ppt.style == 1: // right
				this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
				txt_sp = Math.round((this.w - ppt.textL - this.img_r + scaleForDisplay(100)) * (1 - ppt.rel_imgs)); txt_h = this.h - ppt.textT - ppt.textB;
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading_h) / uiBio.font_h), 0);
				this.imgs = Math.max(this.w - txt_sp -  this.img_r - ppt.textL - ppt.gap, 10);
				if (ppt.sbarShow) txt_sp -= (uiBio.sbar_sp + 10);
				this.text_l = ppt.textL;
				this.text_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR;
				this.text_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - this.lines_drawn * uiBio.font_h + uiBio.heading_h) / 2 : ppt.textT + uiBio.heading_h - scaleForDisplay(4);
				this.text_w = txt_sp;
				this.text_h = this.lines_drawn * uiBio.font_h + uiBio.heading_h;
				this.heading_x = this.text_l;
				this.heading_w = !ppt.fullWidthHeading ? this.text_w : this.w - this.heading_x - this.img_r;
				if (ppt.fullWidthHeading) this.img_t = this.text_t - scaleForDisplay(24);
				this.img_l = ppt.textL + txt_sp + ppt.gap + (ppt.sbarShow ? uiBio.sbar_sp + 10 : 0);
				if (ppt.sbarShow) {this.sbar_x = this.text_l + this.text_w + scaleForDisplay(8); this.sbar_x = this.sbar_x - (uiBio.sbar_w - uiBio.scr_but_w < 5 || uiBio.sbarType == 3 ? 1 : 0); this.sbar_y = (uiBio.sbarType < sbarStyle || ppt.heading ? this.text_t : 0) + this.top_corr + scaleForDisplay(13); this.sbar_h = uiBio.sbarType < sbarStyle ? uiBio.font_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar_y  + bot_corr;}
				this.rp_x = 0; this.rp_y = 0; this.rp_w = this.img_l; this.rp_h = this.h;
				break;
			case ppt.style == 2: // bottom
				this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
				txt_h = Math.round((this.h - ppt.textT - this.img_b) * (1 - ppt.rel_imgs));
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading_h + scaleForDisplay(20)) / uiBio.font_h), 0);
				txt_h = this.lines_drawn * uiBio.font_h + ppt.gap;
				this.imgs = Math.max(this.h - txt_h - this.img_b - ppt.textT - uiBio.heading_h, 10);
				this.img_t = this.h - this.bor_b - this.imgs;
				this.text_l = ppt.textL;
				this.text_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR;
				this.text_t = this.img_t - txt_h - scaleForDisplay(4);
				this.text_w = this.w - this.text_l - this.text_r - scaleForDisplay(24);
				this.text_h = txt_h - ppt.gap + uiBio.heading_h;
				this.heading_x = this.text_l;
				this.heading_w = this.text_w + scaleForDisplay(24);
				if (ppt.sbarShow) {this.sbar_x = this.w - uiBio.sbar_sp - ppt.borR + scaleForDisplay(1); this.sbar_y = (uiBio.sbarType < sbarStyle || ppt.heading ? this.text_t : 0) + this.top_corr + scaleForDisplay(13); this.sbar_h = uiBio.sbarType < sbarStyle ? uiBio.font_h * this.lines_drawn + bot_corr * 2 : this.img_t - this.sbar_y + bot_corr;}
				this.rp_x = 0; this.rp_y = 0; this.rp_w = this.w; this.rp_h = this.img_t;
				break;
			case ppt.style == 3: // left
				this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
				this.text_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR;
				txt_sp = Math.round((this.w - this.img_l - this.text_r + scaleForDisplay(100)) * (1 - ppt.rel_imgs));
				this.text_h = this.h - ppt.textT - ppt.textB;
				this.lines_drawn = Math.max(Math.floor((this.text_h - uiBio.heading_h) / uiBio.font_h), 0);
				this.imgs = Math.max(this.w - txt_sp -  this.img_l -  this.text_r - ppt.gap, 10);
				this.text_l = this.img_l + this.imgs + ppt.gap + scaleForDisplay(4);
				this.text_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - this.lines_drawn * uiBio.font_h + uiBio.heading_h) / 2 : ppt.textT + uiBio.heading_h - scaleForDisplay(4);
				this.text_w = txt_sp - scaleForDisplay(27);
				this.heading_x = !ppt.fullWidthHeading ? this.text_l : this.img_l;
				this.heading_w = !ppt.fullWidthHeading ? this.text_w : this.w - this.heading_x - this.text_r;
				if (ppt.fullWidthHeading) this.img_t = this.text_t - scaleForDisplay(24);
				if (ppt.sbarShow) {this.sbar_x = this.w - uiBio.sbar_sp - ppt.borR + scaleForDisplay(2); this.sbar_y = (uiBio.sbarType < sbarStyle || ppt.heading ? this.text_t : 0) + this.top_corr + scaleForDisplay(13); this.sbar_h = uiBio.sbarType < sbarStyle ? uiBio.font_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar_y  + bot_corr;}
				this.rp_x = this.text_l; this.rp_y = 0; this.rp_w = this.w - this.rp_x; this.rp_h = this.h;
				break;
			case ppt.style > 3: {
				if (ppt.style - 5 >= this.styles.length) getStyleFallback();
				const obj = ppt.style == 4 ? this.overlay : this.styles[ppt.style - 5];
				if (!bypass) {this.im_l = sBio.clamp(obj.imL, 0, 1); this.im_r = sBio.clamp(obj.imR, 0, 1); this.im_t = sBio.clamp(obj.imT, 0, 1); this.im_b = sBio.clamp(obj.imB, 0, 1); this.tx_l = sBio.clamp(obj.txL, 0, 1); this.tx_r = sBio.clamp(obj.txR, 0, 1); this.tx_t = sBio.clamp(obj.txT, 0, 1); this.tx_b = sBio.clamp(obj.txB, 0, 1);}
				const imL = Math.round(this.im_l * this.w), imR = Math.round(this.im_r * this.w), imT = Math.round(this.im_t * this.h), imB = Math.round(this.im_b * this.h), txL = Math.round(this.tx_l * this.w), txR = Math.round(this.tx_r * this.w), txT = Math.round(this.tx_t * this.h), txB = Math.round(this.tx_b * this.h);
				this.iBoxL = Math.max(imL, 0); this.iBoxT = Math.max(imT, 0); this.iBoxW = this.w - imL - imR; this.iBoxH = this.h - imT - imB;
				this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
				txt_h = Math.round((this.h - this.img_t - ppt.textB) * (1 - ppt.rel_imgs));
				this.lines_drawn = Math.max(Math.floor((txt_h + uiBio.heading_h - scaleForDisplay(20)) / uiBio.font_h), 0);
				txt_h = this.lines_drawn * uiBio.font_h + ppt.gap;
				this.imgs = Math.max(this.h - txt_h - this.img_t - ppt.textB - uiBio.heading_h - scaleForDisplay(40), 10);
				this.text_l = ppt.textL;
				this.text_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR;
				this.text_t = this.img_t + this.imgs + ppt.gap + uiBio.heading_h + scaleForDisplay(40);
				this.text_w = this.w - this.text_l - this.text_r - ppt.borR;
				this.text_h = txt_h + uiBio.heading_h;
				this.heading_x = this.text_l;
				this.heading_w = this.text_w + ppt.borR;
				if (ppt.fullWidthHeading) this.img_t = this.bor_t;
				this.tBoxL = Math.max(txL, 0); this.tBoxT = Math.max(txT, 0) - scaleForDisplay(40); this.tBoxW = this.w - Math.max(txL, 0) - Math.max(txR, 0); this.tBoxH = this.h - Math.max(txT, 0) - Math.max(txB, 0) + scaleForDisplay(40); this.minH = uiBio.font_h + uiBio.heading_h + t_t + t_b;
				if (ppt.overlayStyle == 2) this.arc_w = Math.max(Math.min(this.arc_w, this.tBoxW / 3, this.tBoxH / 3), 1);
				if (ppt.overlayStyle) this.arc = Math.max(uiBio.font_h / 1.5, 1);
				this.clip = this.iBoxT + 100 < this.tBoxT && this.tBoxT < this.iBoxT + this.iBoxH && (this.tBoxL < this.iBoxL + this.iBoxW || this.tBoxL + this.tBoxW < this.iBoxL + this.iBoxW);
				this.imgs = this.clip ? this.tBoxT - this.iBoxT : Math.min(this.h - imT - imB - this.bor_t - this.bor_b, this.w - imL - imR - this.bor_l - this.bor_r);
				if (ppt.sbarShow) {this.sbar_x = this.tBoxL + this.tBoxW - uiBio.sbar_sp - uiBio.arc_w - ppt.borR + scaleForDisplay(1); this.sbar_y = this.text_t + this.top_corr + scaleForDisplay(13); this.sbar_h = uiBio.font_h * this.lines_drawn + bot_corr * 2;}
				this.rp_x = this.tBoxL; this.rp_y = this.tBoxT; this.rp_w = this.tBoxW; this.rp_h = this.tBoxH;
				break;
			}
		}
		if (uiBio.sbarType == 2) {this.sbar_y += 1; this.sbar_h -= 2;} this.text_w = Math.max(this.text_w, 10);
		this.max_y = this.lines_drawn * uiBio.font_h + this.text_t - uiBio.font_h * 0.9;
		this.covView = ppt.artistView ? 0: 1;
	}

	this.imgBox = (x, y) => {
		if (ppt.style < 4) {
			switch (ppt.style) {
				case 0: case 2: return y > this.img_t && y < this.img_t + this.imgs;
				case 1: case 3: return x > this.img_l && x < this.img_l + this.imgs;
			}
		} else return y > this.iBoxT && y < this.iBoxT + this.iBoxH && x > this.iBoxL && x < this.iBoxL + this.iBoxW;
	}

	this.mode = n => {
		if (!ppt.sameStyle) ppt.artistView ? ppt.bioMode = n : ppt.revMode = n; let calcText = true;
		switch (n) {
			case 0:
				calcText = this.calcText || ppt.text_only; ppt.img_only = false; ppt.text_only = false; this.sizes(); imgBio.clear_rs_cache();
				if (calcText && !ppt.sameStyle && (ppt.bioMode != ppt.revMode || ppt.bioStyle != ppt.revStyle)) calcText = ppt.artistView ? 1 : 2;
				if (!this.art_ix && ppt.artistView && !t.mulArtist || !this.alb_ix && !ppt.artistView && !t.mulAlbum) {t.album_reset(); t.artist_reset(); t.getText(calcText); imgBio.get_images();} else {t.get_multi(calcText, this.art_ix, this.alb_ix); imgBio.get_multi(this.art_ix, this.alb_ix);}
				break;
			case 1:
				ppt.img_only = true; ppt.text_only = false;
				imgBio.setCrop(); this.sizes(); imgBio.clear_rs_cache(); imgBio.get_images();
				break;
			case 2:
				ppt.img_only = false; ppt.text_only = true; this.sizes(); if (uiBio.blur) imgBio.clear_rs_cache();
				if (!ppt.sameStyle && (ppt.bioMode != ppt.revMode || ppt.bioStyle != ppt.revStyle)) calcText = ppt.artistView ? 1 : 2;
				if (!this.art_ix && ppt.artistView && !t.mulArtist || !this.alb_ix && !ppt.artistView && !t.mulAlbum) {t.album_reset(); t.artist_reset(); t.getText(calcText);
				if (uiBio.blur) imgBio.get_images();} else {t.get_multi(calcText, this.art_ix, this.alb_ix);
				if (uiBio.blur) imgBio.get_multi(this.art_ix, this.alb_ix); imgBio.set_chk_arr(null);}
				break;
		}
		this.calcText = false;
		butBio.refresh();
	}

	this.createStyle = () => {
		let ns;
		try {ns = utils.InputBox(window.ID, "Enter new style name\n\nProceed?\n\nFreestyle layouts offer drag style positioning of image && text boxes + text overlay\n\nPress CTRL to alter layouts", "Create New Freestyle Layout", "My Style", true);} catch (e) {return false;} if (!ns) return false;
		let lines_drawn, imgs, te_t;
		switch (ppt.style) {
			case 0: txt_h = Math.round((this.h - this.bor_t - ppt.textB) * (1 - ppt.rel_imgs)); lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading_h) / uiBio.font_h), 0); txt_h = lines_drawn * uiBio.font_h + ppt.gap; imgs = Math.max(this.h - txt_h - this.bor_t  - ppt.textB - uiBio.heading_h, 10); this.im_b = (this.h - this.bor_t - imgs - this.bor_b) / this.h; this.tx_t = (this.bor_t + imgs - ppt.textT + ppt.gap) / this.h; this.im_l = 0; this.im_r = 0; this.im_t = 0; this.tx_l = 0; this.tx_r = 0; this.tx_b = 0; break;
			case 1: txt_sp = Math.round((this.w - ppt.textL - this.bor_r) * (1 - ppt.rel_imgs)); lines_drawn = Math.max(Math.floor((this.h - ppt.textT - ppt.textB - uiBio.heading_h) / uiBio.font_h), 0); te_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - lines_drawn * uiBio.font_h + uiBio.heading_h) / 2 : ppt.textT + uiBio.heading_h; this.im_l = (txt_sp + ppt.gap + (ppt.sbarShow ? uiBio.sbar_sp + 10 : 0)) / this.w; this.tx_r = (this.w - (txt_sp + ppt.textR)) / this.w; this.tx_t = (te_t - uiBio.heading_h - ppt.textT) / this.h; this.im_r = 0; this.im_t = 0; this.im_b = 0; this.tx_l = 0; this.tx_b = 0; break;
			case 2: {txt_h = Math.round((this.h - ppt.textT - this.bor_b) * (1 - ppt.rel_imgs)); lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading_h) / uiBio.font_h), 0); txt_h = lines_drawn * uiBio.font_h + ppt.gap; imgs = Math.max(this.h - txt_h - this.bor_b  - ppt.textT - uiBio.heading_h, 10); const img_t = this.h - this.bor_b - imgs; this.im_t = img_t / this.h; this.tx_b = (this.h - img_t - ppt.textB + ppt.gap) / this.h; this.im_l = 0; this.im_r = 0; this.im_b = 0; this.tx_l = 0; this.tx_r = 0; this.tx_t = 0; break;}
			case 3: {const te_r = ppt.sbarShow ? Math.max(ppt.textR, uiBio.sbar_sp + 10) : ppt.textR; txt_sp = Math.round((this.w - this.bor_l - te_r) * (1 - ppt.rel_imgs)); imgs = Math.max(this.w - txt_sp -  this.bor_l -  te_r - ppt.gap, 10); lines_drawn = Math.max(Math.floor((this.h - ppt.textT - ppt.textB - uiBio.heading_h) / uiBio.font_h), 0); te_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - lines_drawn * uiBio.font_h + uiBio.heading_h) / 2 : ppt.textT + uiBio.heading_h; this.im_r = (this.w - this.bor_l - imgs - this.bor_r) / this.w; this.tx_l = (this.bor_l + imgs - ppt.textL + ppt.gap) / this.w; this.tx_t = (te_t - uiBio.heading_h - ppt.textT) / this.h; this.im_l = 0; this.im_t = 0; this.im_b = 0; this.tx_r = 0; this.tx_b = 0; break;}
		}
		this.styles.forEach(v => {if (v.name == ns) ns = ns + " New";});
		if (ppt.style > 3 && (ppt.img_only || ppt.text_only)) {
			if (ppt.style - 5 >= this.styles.length) getStyleFallback();
			const obj = ppt.style == 4 ? this.overlay : this.styles[ppt.style - 5];
			this.im_l = sBio.clamp(obj.imL, 0, 1); this.im_r = sBio.clamp(obj.imR, 0, 1); this.im_t = sBio.clamp(obj.imT, 0, 1); this.im_b = sBio.clamp(obj.imB, 0, 1); this.tx_l = sBio.clamp(obj.txL, 0, 1); this.tx_r = sBio.clamp(obj.txR, 0, 1); this.tx_t = sBio.clamp(obj.txT, 0, 1); this.tx_b = sBio.clamp(obj.txB, 0, 1);
		}
		this.styles.push({"name":ns, "imL":this.im_l, "imR":this.im_r, "imT":this.im_t, "imB":this.im_b, "txL":this.tx_l, "txR":this.tx_r, "txT":this.tx_t, "txB":this.tx_b})
		sort(this.styles, "name"); ppt.styles = JSON.stringify(this.styles);
		this.styles.some((v, i) => {
			if (v.name == ns) {
				if (ppt.sameStyle) ppt.style = i + 5;
				else if (ppt.artistView) ppt.bioStyle = i + 5;
				else ppt.revStyle = i + 5;
				return true;
			}
		})
		styleArr(); t.toggle(8); timerBio.clear(timerBio.source); timerBio.source.id = setTimeout(() => {this.newStyle = false; window.Repaint(); timerBio.source.id = null;}, 10000); if (timerBio.source.id !== 0) {this.newStyle = true; window.Repaint();}
	}

	const getStyleFallback = () => {ppt.style = 4; if (!ppt.sameStyle) {if (ppt.artistView) ppt.bioStyle = 4; else ppt.revStyle = 4;} fb.ShowPopupMessage("Unable to locate style. Using overlay layout instead.", "Biography");}

	this.deleteStyle = n => {const ns = $Bio.WshShell.Popup("Delete: " + this.style_arr[n] + "\n\nStyle will be set to top", 0, "Delete Current Style", 1); if (ns != 1) return false; this.styles.splice(n - 5, 1); ppt.styles = JSON.stringify(this.styles); ppt.style = 0; if (!ppt.sameStyle) {if (ppt.artistView) ppt.bioStyle = 0; else ppt.revStyle = 0;} styleArr(); t.toggle(8);}
	this.exportStyle = n => {const ns = $Bio.WshShell.Popup("Export: " + this.style_arr[n], 0, "Export Current Style To Other Biography Panels", 1); if (ns != 1) return false; window.NotifyOthers("custom_style_bio", JSON.stringify(this.styles[n - 5]));}
	this.on_notify = info => {const rec = sBio.jsonParse(info, false); this.styles.forEach(v => {if (v.name == rec.name) rec.name = rec.name + " New";}); this.styles.push(rec); sort(this.styles, "name"); ppt.styles = JSON.stringify(this.styles); styleArr();}
	this.renameStyle = n => {let ns = utils.InputBox(window.ID, "Rename style: " + this.style_arr[n] + "\n\nEnter new name\n\nProceed?", "Rename Current Style", this.style_arr[n]); if (!ns || ns == this.style_arr[n]) return false; this.styles.forEach(v => {if (v.name == ns) ns = ns + " New";}); this.styles[n - 5].name = ns; sort(this.styles, "name"); ppt.styles = JSON.stringify(this.styles); this.styles.some((v, i) => {if (v.name == ns) {ppt.style = i + 5; return true;}}); styleArr(); window.Repaint();}
	this.resetStyle = n => {const ns = $Bio.WshShell.Popup("Reset to Default " + (ppt.style < 4 ? this.style_arr[n] : "Overlay") + " Style", 0, "Reset Current Style", 1); if (ns != 1) return false; if (ppt.style < 4) ppt.rel_imgs = 0.7; else {const obj = ppt.style == 4 ? this.overlay : this.styles[ppt.style - 5]; obj.name = this.style_arr[n]; obj.imL = 0; obj.imR = 0; obj.imT = 0; obj.imB = 0; obj.txL = 0; obj.txR = 0; obj.txT = 0.632; obj.txB = 0; ppt.style == 4 ? ppt.overlay = JSON.stringify(this.overlay) : ppt.styles = JSON.stringify(this.styles);} t.toggle(13);}

	console.log("Biography Initialized in: " + this.pBioProfiler.Time + 'ms');
}

function Lfm_similar_artists(state_callback, on_search_done_callback) {
	let artist, done, fn_sim, list = [], handles, lmt, pth_sim, retry = false; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback;
	this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {if (this.xmlhttp.status == 200) this.func(); else if (this.on_search_done_callback) this.on_search_done_callback(artist, list, done, handles);}}

	this.Search = (p_artist, p_done, p_handles, p_lmt, p_pth_sim, p_fn_sim) => {
		artist = p_artist; done = p_done; handles = p_handles; lmt = p_lmt; pth_sim = p_pth_sim; fn_sim = p_fn_sim; if (retry) lmt = lmt == 249 ? 235 + Math.floor(Math.random() * 14) : lmt + 10; this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = "http://ws.audioscrobbler.com/2.0/?format=json" + pBio.lfm + "&method=artist.getSimilar&artist=" + encodeURIComponent(artist) + "&limit=" + lmt + "&autocorrect=1";
		this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (retry) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT'); this.xmlhttp.send();
	}

	this.Analyse = () => {
		const data = sBio.jsonParse(this.xmlhttp.responseText, false, 'get', 'similarartists.artist', 'name":');
		if ((!data || data.length < lmt) && !retry) {retry = true; return this.Search(artist, done, handles, lmt, pth_sim, fn_sim);}
		switch (true) {
			case lmt < 17: if (data) {$Bio.take(data, 6); list = data.map(v => v.name);}
			if (data || retry) this.on_search_done_callback(artist, list, done, handles); break;
			case lmt > 99: if (data) {
					list = data.map(v => ({name: v.name, score: Math.round(v.match * 100)}));
					list.unshift({name:artist, score:100}); sBio.buildPth(pth_sim); sBio.save(fn_sim, JSON.stringify(list), true); if (pBio.lfm_sim) {pBio.get_multi(); window.NotifyOthers("get_multi_bio", "get_multi_bio");}
				} break;
		}
	}
}

function Lfm_top_albums(state_callback, on_search_done_callback) {
	const list = [], popAlbums = []; let artist, i = 0, topAlbums = []; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback;
	this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {if (this.xmlhttp.status == 200) this.func(); else {this.on_search_done_callback(artist, list);}}}

	this.Search = (p_artist) => {
		artist = p_artist; this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = "https://www.last.fm/music/" + encodeURIComponent(artist) + "/+albums";
		this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.send();
	}

	this.Analyse = () => {
		sBio.doc.open(); const div = sBio.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
		sBio.htmlParse(div.getElementsByTagName('h3'), 'className', 'resource-list--release-list-item-name', v => {i < 4 ? popAlbums.push(v.innerText.trim().titlecase()) : topAlbums.push(v.innerText.trim().titlecase()); i++; if (i == 10) return true;});
		sBio.doc.close();
		if (popAlbums.length) {
			const mapAlbums = topAlbums.map(v => v.cut());
			const match = mapAlbums.includes(popAlbums[0].cut());
			if (topAlbums.length > 5 && !match) topAlbums.splice(5, 0, popAlbums[0]);
			else topAlbums = topAlbums.concat(popAlbums);
		}
		topAlbums = [...new Set(topAlbums)];
		topAlbums.length = Math.min(6, topAlbums.length);
		this.on_search_done_callback(artist, topAlbums);
	}
}

function Names() {
	this.alb_strip = pBio.valueIni("MISCELLANEOUS", pBio.def_tf[3].name, pBio.def_tf[3].tf, 1);
	this.alb_artist = (focus, ignoreLock) => pBio.eval("[$trim(" + pBio.tf.aa + ")]", focus, ignoreLock);
	this.artist = (focus, ignoreLock) => pBio.eval("[$trim(" + pBio.tf.a + ")]", focus, ignoreLock);
	this.alb = focus => pBio.eval("[$trim(" + pBio.tf.l + ")]", focus);
	this.albID = (focus, n) => {
		if (!this.alb(focus)) return pBio.eval(pBio.tf.a + pBio.tf.aa + "%path%", focus);
		else switch (n) {
			case 'simple': return pBio.eval(pBio.tf.a + pBio.tf.aa + pBio.tf.l, focus);
			case 'stnd': return pBio.eval(pBio.tf.aa + pBio.tf.l + "%discnumber%%date%", focus);
			case 'full': return pBio.eval(pBio.tf.a + pBio.tf.aa + pBio.tf.l + "%discnumber%%date%", focus);
		}
	}
	this.albm = (focus, ignoreLock) => pBio.eval("[" + pBio.tf.l + "]", focus, ignoreLock).replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();
	this.album = (focus, ignoreLock) => {if (!this.alb_strip) return this.albm(focus); return pBio.eval("[" + pBio.tf.l + "]", focus, ignoreLock).replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();}
	this.title = (focus, ignoreLock) => {let n = pBio.eval("[$trim(" + pBio.tf.t + ")]", focus, ignoreLock); if (pBio.local && pBio.ir(focus)) {const kw = "(-\\s*|\\s+)\\d\\d\\d\\d"; let ix = -1, yr = n.match(RegExp(kw)); if (yr) {yr = yr[0].toString(); ix = n.indexOf(yr);} if (ix != -1) n = n.slice(0, ix).trim();} return n;}
	this.trackID = focus => pBio.eval(pBio.tf.a + pBio.tf.t, focus);
}

function ScrollbarBio() {
	this.x; this.y; this.w; this.h;
	let duration = ppt.duration.splt(0); duration = {drag : 200, inertia : sBio.clamp(sBio.value(duration[3], 3000, 0), 0, 5000), full : sBio.clamp(sBio.value(duration[1], 500, 0), 0, 5000)}; duration.scroll = Math.round(duration.full * 0.8); duration.step = Math.round(duration.full * 2 / 3); duration.bar = duration.full; duration.barFast = duration.step;
	let active_o = true, alpha = 255, alpha1 = alpha, alpha2 = 255, amplitude, b_is_dragging = false, bar_ht = 0, bar_timer = null, bar_y = 0, but_h = 0, clock = Date.now(), counter = 0, drag_distance_per_row = 0, draw = true, elap = 0, event = 'scroll', frame, hover = false, hover_o = false, init = true, initial_drag_y = 0, initial_scr = 1, initial_y = -1, ix = -1, inStep = 18, lastTouchDn = Date.now(), narrowSbar_x = 0, offset = 0, ratio = 1, reference = -1, sbarZone = false, sbarZone_o = false, scrollbar_height = 0, scrollbar_travel = 0, start = 0, startTime = 0, ticker, timestamp, ts, velocity;
	const col = {}, min = 10 * sBio.scale, mv = 2 * sBio.scale;
	this.active = true; this.count = -1; this.delta = 0; ppt.flickDistance = sBio.clamp(ppt.flickDistance, 0, 10); this.draw_timer = null; this.item_y = 0; this.max_scroll = 0; this.narrow = ppt.sbarShow == 1 ? true : false; this.onSbar = false; this.row_count = 0; this.rows_drawn = 0; this.row_h = 0; this.scroll = 0; this.scrollable_lines = 0; ppt.scrollStep = sBio.clamp(ppt.scrollStep, 0, 10); ppt.touchStep = sBio.clamp(ppt.touchStep, 1, 10); this.timer_but = null; this.touch = {dn: false, end: 0, start: 0}; this.x = 0; this.y = 0; this.w = 0; this.h = 0;

	this.setCol = () => {
		let opaque = false;
		alpha = !uiBio.sbarCol ? 75 : (!uiBio.sbarType ? 68 : 51);
		alpha1 = alpha; alpha2 = !uiBio.sbarCol ? 128 : (!uiBio.sbarType ? 119 : 85);
		inStep = uiBio.sbarType && uiBio.sbarCol ? 12 : 18;
		switch (uiBio.sbarType) {
			case 0:
				if (pref.whiteTheme) {
					switch (uiBio.sbarCol) {
						case 0:
							for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, alpha + i), uiBio.col.bg) : RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, alpha + i);
							col.max = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 192), uiBio.col.bg) : RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 192); break;
						case 1:
							for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? sBio.RGBAtoRGB(uiBio.col.text & RGBA(255, 255, 255, alpha + i), uiBio.col.bg) : uiBio.col.text & RGBA(255, 255, 255, alpha + i);
							col.max = opaque ? sBio.RGBAtoRGB(uiBio.col.text & 0x99ffffff, uiBio.col.bg) : uiBio.col.text & 0x99ffffff; break;
					}
				} else if (pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
					switch (uiBio.sbarCol) {
						case 0:
							for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, alpha + i), uiBio.col.bg) :
								pref.blackTheme ? RGBA(100, 100, 100, 200 + i) :
								pref.blueTheme ? RGBA(10, 135, 225, 200 + i) :
								pref.darkblueTheme ? RGBA(27, 55, 90, 200 + i) :
								pref.redTheme ? RGBA(200, 200, 200, 200 + i) :
								pref.creamTheme ? RGBA(200, 200, 200, 200 + i) :
								pref.nblueTheme ? RGBA(0, 200, 255, 200 + i) :
								pref.ngreenTheme ? RGBA(0, 200, 0, 200 + i) :
								pref.nredTheme ? RGBA(229, 7, 44, 200 + i) :
								pref.ngoldTheme ? RGBA(254, 204, 3, 200 + i) : '';

							col.max = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 192), uiBio.col.bg) :
								pref.blackTheme ? RGBA(160, 160, 160, 255) :
								pref.blueTheme ? RGBA(242, 230, 170, 255) :
								pref.darkblueTheme ? RGBA(255, 202, 128, 255) :
								pref.redTheme ? RGBA(245, 212, 165, 255) :
								pref.creamTheme ? RGBA(120, 170, 130, 255) :
								pref.nblueTheme ? RGBA(0, 238, 255, 255) :
								pref.ngreenTheme ? RGBA(0, 255, 0, 255) :
								pref.nredTheme ? RGBA(255, 0, 0, 255) :
								pref.ngoldTheme ? RGBA(255, 242, 3, 255) : '';

						break;
					}
				}
				break;
			case 1:
				switch (uiBio.sbarCol) {
					case 0:
					col.bg = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 15), uiBio.col.bg) : RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 15);
					for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, alpha + i), uiBio.col.bg) : RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, alpha + i);
					col.max = opaque ? sBio.RGBAtoRGB(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 192), uiBio.col.bg) : RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 192); break;
					case 1:
						col.bg = opaque ? sBio.RGBAtoRGB(uiBio.col.text & 0x15ffffff, uiBio.col.bg) : uiBio.col.text & 0x15ffffff;
						for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? sBio.RGBAtoRGB(uiBio.col.text & RGBA(255, 255, 255, alpha + i), uiBio.col.bg) : uiBio.col.text & RGBA(255, 255, 255, alpha + i);
						col.max = opaque ? sBio.RGBAtoRGB(uiBio.col.text & 0x99ffffff, uiBio.col.bg) : uiBio.col.text & 0x99ffffff; break;
				}
			break;
		}
	}; this.setCol();

	const minimise_debounce = sBio.debounce(() => {
		if (sbarZone) return t.paint();
		this.narrow = true;
		if (ppt.sbarShow == 1) butBio.set_scroll_btns_hide(true, this.type);
		sbarZone_o = sbarZone;
		hover = false; hover_o = false;
		alpha = alpha1;
		t.paint();
	}, 1000);

	const hide_debounce = sBio.debounce(() => {
		if (sbarZone) return;
		this.active = false;
		active_o = this.active;
		hover = false; hover_o = false;
		alpha = alpha1;
		t.paint()
	}, 5000);

	this.resetAuto = () => {
		minimise_debounce.cancel(); hide_debounce.cancel();
		if (!ppt.sbarShow) butBio.set_scroll_btns_hide(true); if (ppt.sbarShow == 1) {butBio.set_scroll_btns_hide(true, "both"); this.narrow = true;} if (ppt.sbarShow == 2) this.narrow = false;
	}

	const nearest = y => {y = (y - but_h) / scrollbar_height * this.max_scroll; y = y / this.row_h; y = Math.round(y) * this.row_h; return y;}
	const scroll_throttle = sBio.throttle(() => {this.delta = this.scroll; scroll_to();}, 16);
	const scroll_timer = () => {this.draw_timer = setInterval(() => {if (pBio.w < 1 || !window.IsVisible) return; smooth_scroll();}, 16);}

	this.leave = () => {if (this.touch.dn) this.touch.dn = false; if (!menBio.right_up) sbarZone = false; if (b_is_dragging || ppt.sbarShow == 1) return; hover = !hover; this.paint(); hover = false; hover_o = false;}
	this.page_throttle = sBio.throttle(dir => this.check_scroll(Math.round((this.scroll + dir * -this.rows_drawn * this.row_h) / this.row_h) * this.row_h, 'full'), 100);
	this.reset = () => {this.delta = this.scroll = 0; this.item_y = 0; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
	this.set_rows = row_count => {if (!row_count) this.item_y = 0; this.row_count = row_count; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
	this.set_scroll = new_scroll => {clock = 0; const b = Math.max(0, Math.min(new_scroll, this.max_scroll)); if (b == this.scroll) return; this.scroll = b; this.delta = this.scroll; bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h); pBio.paint();}
	this.wheel = step => this.check_scroll(Math.round((this.scroll + step * -(!ppt.scrollStep ? this.rows_drawn : ppt.scrollStep) * this.row_h) / this.row_h) * this.row_h, ppt.scrollStep ? 'step' : 'full');

	this.metrics = (x, y, w, h, rows_drawn, row_h) => {
		this.x = x; this.y = Math.round(y); this.w = w; this.h = h; this.rows_drawn = rows_drawn; this.row_h = row_h; but_h = uiBio.but_h;
		// draw info
		scrollbar_height = Math.round(this.h - but_h * 2);
		bar_ht = Math.max(Math.round(scrollbar_height * this.rows_drawn / this.row_count), sBio.clamp(scrollbar_height / 2, 5, ppt.sbarShow == 2 ? uiBio.grip_h : uiBio.grip_h * 2));
		scrollbar_travel = scrollbar_height - bar_ht;
		// scrolling info
		this.scrollable_lines = this.rows_drawn > 0 ? this.row_count - this.rows_drawn : 0;
		draw = this.scrollable_lines > 0 && scrollbar_height > 1;
		ratio = this.row_count / this.scrollable_lines;
		bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h);
		drag_distance_per_row = scrollbar_travel / this.scrollable_lines;
		// panel info
		narrowSbar_x = this.x + this.w - sBio.clamp(uiBio.narrowSbarWidth, 5, this.w);
		this.max_scroll = this.scrollable_lines * this.row_h;
		if (ppt.sbarShow != 1) butBio.set_scroll_btns_hide();
	}

	this.draw = gr => {
		if (draw && this.active) {
			let sbar_x = this.x, sbar_w = this.w;
			//if (ppt.sbarShow == 1) {sbar_x = !this.narrow ? this.x : narrowSbar_x; sbar_w = !this.narrow ? this.w : uiBio.narrowSbarWidth;}
			if (ppt.sbarShow == 1) {sbar_x = !this.narrow ? this.x : narrowSbar_x; sbar_w = !this.narrow ? this.w : 0;} // Hide mini scrollbar
			switch (uiBio.sbarType) {
				case 0:
					gr.FillSolidRect(sbar_x, this.y + bar_y, sbar_w, bar_ht, this.narrow ? col[alpha2] : !b_is_dragging ? col[alpha] : col['max']); break;
				case 1:
					if (!this.narrow || ppt.sbarShow != 1) gr.FillSolidRect(sbar_x, this.y - pBio.sbar_o, this.w, this.h + pBio.sbar_o * 2, col['bg']);
					gr.FillSolidRect(sbar_x, this.y + bar_y, sbar_w, bar_ht, this.narrow ? col[alpha2] : !b_is_dragging ? col[alpha] : col['max']); break;
				case 2:
					uiBio.theme.SetPartAndStateID(6, 1); if (!this.narrow || ppt.sbarShow != 1) uiBio.theme.DrawThemeBackground(gr, sbar_x, this.y, sbar_w, this.h);
					uiBio.theme.SetPartAndStateID(3, this.narrow ? 2 : !hover && !b_is_dragging ? 1 : hover && !b_is_dragging ? 2 : 3);
					uiBio.theme.DrawThemeBackground(gr, sbar_x, this.y + bar_y, sbar_w, bar_ht); break;
			}
		}
	}

	this.paint = () => {
		if (init) return; alpha = hover ? alpha1 : alpha2;
		clearTimeout(bar_timer); bar_timer = null;
		bar_timer = setInterval(() => {alpha = hover ? Math.min(alpha += inStep, alpha2) : Math.max(alpha -= 3, alpha1); window.RepaintRect(this.x, this.y, this.w, this.h);
		if (hover && alpha == alpha2 || !hover && alpha == alpha1) {hover_o = hover; clearTimeout(bar_timer); bar_timer = null;}}, 25);
	}

	this.lbtn_dn = (p_x, p_y) => {
		this.onSbar = false;
		if (!ppt.sbarShow && ppt.touchControl) return tap(p_y);
		const x = p_x - this.x, y = p_y - this.y; let dir;
		if (x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
		if (x < 0) {if (!ppt.touchControl) return; else return tap(p_y);}
		this.onSbar = true;
		if (y < but_h || y > this.h - but_h) return;
		if (y < bar_y) dir = 1; // above bar
		else if (y > bar_y + bar_ht) dir = -1; // below bar
		if (y < bar_y || y > bar_y + bar_ht) shift_page(dir, nearest(y));
		else { // on bar
			b_is_dragging = true; butBio.Dn = true; window.RepaintRect(this.x, this.y, this.w, this.h);
			initial_drag_y = y - bar_y + but_h;
		}
	}

	this.lbtn_dblclk = (p_x, p_y) => {
		const x = p_x - this.x, y = p_y - this.y; let dir;
		if (x < 0 || x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
		if (y < but_h || y > this.h - but_h) return;
		if (y < bar_y) dir = 1; // above bar
		else if (y > bar_y + bar_ht) dir = -1; // below bar
		if (y < bar_y || y > bar_y + bar_ht) shift_page(dir, nearest(y));
	}

	this.move = (p_x, p_y) => {
		this.active = true;
		const x = p_x - this.x, y = p_y - this.y;
		if (x >= 0 && x <= this.w && y >= 0 && y <= this.h) {
			sbarZone = true;
			this.narrow = false;
			if (ppt.sbarShow == 1 && sbarZone != sbarZone_o) {butBio.set_scroll_btns_hide(!sbarZone || this.scrollable_lines < 1 || ppt.img_only, this.type); sbarZone_o = sbarZone;}
		} else sbarZone = false;
		if (ppt.sbarShow == 1) {minimise_debounce(); hide_debounce();}
		if (ppt.touchControl) {
			const delta = reference - p_y;
			if (delta > mv || delta < -mv) {
				reference = p_y;
				if (ppt.flickDistance) offset = sBio.clamp(offset + delta, 0, this.max_scroll);
			}
		}
		if (this.touch.dn) {if (butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y) || !pBio.text_trace) return; ts = Date.now(); if (ts - startTime > 300) startTime = ts; lastTouchDn = ts; this.check_scroll(initial_scr + (initial_y - p_y) * ppt.touchStep, ppt.touchStep == 1 ? 'drag' : 'scroll'); return;}
		if (x < 0 || x > this.w || y > bar_y + bar_ht || y < bar_y || butBio.Dn) hover = false; else hover = true;
		if (!bar_timer && (hover != hover_o || this.active != active_o)) {init = false; this.paint(); active_o = this.active;}
		if (!b_is_dragging || this.row_count <= this.rows_drawn) return;
		this.check_scroll(Math.round((y - initial_drag_y) / drag_distance_per_row) * this.row_h, 'bar');
	}

	this.lbtn_drag_up = () => {
		if (this.touch.dn) {
			this.touch.dn = false;
			clearInterval(ticker);
			if (!counter) track(true);
			if (Math.abs(velocity) > min && Date.now() - startTime < 300) {
				amplitude = ppt.flickDistance * velocity * ppt.touchStep;
				timestamp = Date.now();
				this.check_scroll(Math.round((this.scroll + amplitude) / this.row_h) * this.row_h, 'inertia');
			}
		}
	}

	this.lbtn_up = () => {
		if (pBio.clicked) {if (ppt.sbarShow == 1 && this.narrow) butBio.set_scroll_btns_hide(true, this.type); return;}
		if (butBio.Dn == "heading") return;
		if (!hover && b_is_dragging) this.paint(); else window.RepaintRect(this.x, this.y, this.w, this.h); if (b_is_dragging) {b_is_dragging = false; butBio.Dn = false;} initial_drag_y = 0;
		if (this.timer_but) {clearTimeout(this.timer_but); this.timer_but = null;} this.count = -1;
	}

	const tap = (p_y) => {
		if (!pBio.text_trace) return;
		if (amplitude) {clock = 0; this.scroll = this.delta;}
		counter = 0; initial_scr = this.scroll;
		this.touch.dn = true; initial_y = reference = p_y; if (!offset) offset = p_y;
		velocity = amplitude = 0;
		if (!ppt.flickDistance) return;
		frame = offset;
		startTime = timestamp = Date.now();
		clearInterval(ticker);
		ticker = setInterval(track, 100);
	}

	const track = (initial) => {
		let now, elapsed, delta, v;
		counter++; now = Date.now();
		if (now - lastTouchDn < 10000 && counter == 4)  pBio.last_pressed_coord = {x: -1, y: -1};
		elapsed = now - timestamp; if (initial) elapsed = Math.max(elapsed, 32);
		timestamp = now;
		delta = offset - frame;
		frame = offset;
		v = 1000 * delta / (1 + elapsed);
		velocity = 0.8 * v + 0.2 * velocity;
	}

	this.check_scroll = (new_scroll, type) => {
		const b = sBio.clamp(new_scroll, 0, this.max_scroll);
		if (b == this.scroll) return; this.scroll = b;
		if (ppt.smooth) {
			elap = 16; event = type || 'scroll'; this.item_y = 0; start = this.delta;
			if (event != 'drag') {
				if (b_is_dragging && Math.abs(this.delta - this.scroll) > scrollbar_height) event = 'barFast';
				clock = Date.now(); if (!this.draw_timer) {scroll_timer(); smooth_scroll();}
			} else scroll_drag();
		} else scroll_throttle();
	}

	const calc_item_y = () => {ix = Math.round(this.delta / uiBio.font_h + 0.4); this.item_y = Math.round(uiBio.font_h * ix + pBio.text_t - this.delta);}
	const position = (Start, End, Elapsed, Duration, Event) => {if (Elapsed > Duration) return End; if (Event == 'drag') return; const n = Elapsed / Duration; return Start + (End - Start) * easeBio[Event](n);}
	const scroll_drag = () => {this.delta = this.scroll; scroll_to(); calc_item_y();}
	const scroll_finish = () => {if (!this.draw_timer) return; this.delta = this.scroll; scroll_to(); calc_item_y(); clearTimeout(this.draw_timer); this.draw_timer = null;}
	const scroll_to = () => {bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h); pBio.paint();}
	const shift = (dir, nearest_y) => {let target = Math.round((this.scroll + dir * -this.rows_drawn * this.row_h) / this.row_h) * this.row_h; if (dir == 1) target = Math.max(target, nearest_y); else target = Math.min(target, nearest_y); return target;}
	const shift_page = (dir, nearest_y) => {this.check_scroll(shift(dir, nearest_y), 'full'); if (!this.timer_but) {this.timer_but = setInterval(() => {if (this.count > 1) {this.check_scroll(shift(dir, nearest_y), 'full');} else this.count++;}, 100);}}
	const smooth_scroll = () => {
		this.delta = position(start, this.scroll, Date.now() - clock + elap, duration[event], event);
		if (Math.abs(this.scroll - this.delta) > 0.5) scroll_to(); else scroll_finish();
	}

	this.butBio = dir => {this.check_scroll(Math.round((this.scroll + dir * -this.row_h) / this.row_h) * this.row_h, 'step'); if (!this.timer_but) {this.timer_but = setInterval(() => {if (this.count > 6) {this.check_scroll(this.scroll + dir * -this.row_h, 'step');} else this.count++;}, 40);}}
	this.scroll_to_end = () => this.check_scroll(this.max_scroll, 'full');
}
alb_scrollbar.type = "alb"; art_scrollbar.type = "art";

function ButtonsBio() {
	this.x; this.y; this.w; this.h;
	let amBioBtn = "", amRevBtn = "", lfmBioBtn = "", lfmRevBtn = "", amlfmBioBtn = "", amlfmRevBtn = "", lfmamBioBtn = "", lfmamRevBtn = "";
	const albScrBtns = ["alb_scrollDn", "alb_scrollUp"], artScrBtns = ["art_scrollDn", "art_scrollUp"], bahnSemiBoldCond = "Bahnschrift SemiBold SemiConden", bahnSemiBoldCondInstalled = utils.CheckFont(bahnSemiBoldCond), orig_mt_sz = 15 * sBio.scale, scc = 2, scrBtns = albScrBtns.concat(artScrBtns);
	let arrow_symb = 0, b_x, btnIcon = false, btnTxt = false, btnVisible = false, byDn, byUp, cur_btn = null, drawTxt = "", dx3 = 0, hoverCol = uiBio.col.text & RGBA(255, 255, 255, 51), iconFontName = "Segoe UI Symbol", iconFontStyle = 0, init = true, l = false, m = false, mt = false, mtL = false, name_w = 0, r = false, sAlpha = 255, sbarButPad = sBio.clamp(ppt.sbarButPad / 100, -0.5, 0.3), scrollBtn = false, scrollBtn_x, scrollDn_y, scrollUp_y, sp_w = [], src_fs = 12, src_h = 19, src_im = false, src_w = 50, src_font = gdi.Font("Segoe UI", src_fs, 1), ico_font = src_font, tooltip, transition, tt_start = Date.now() - 2000, y_offset = 0, zoom_mt_sz = Math.max(Math.round(orig_mt_sz * ppt.zoomBut / 100), 7), scale = Math.round(zoom_mt_sz / orig_mt_sz * 100); ppt.zoomBut = scale;
	let mt_w = 12, mtCol = sBio.toRGB(uiBio.col.text), mtFont = gdi.Font("FontAwesome", ppt.baseFontSize * 1.4 * scale / 100, 0), mtFontL = gdi.Font("FontAwesome", ppt.baseFontSize * 1.5 * scale / 100, 0);
	this.btns = {}; this.Dn = false; this.r_h1 = 0; this.r_h2 = 0; this.r_w1 = 0; this.r_w2 = 0; this.ratingImages = []; if (uiBio.stars == 1 && uiBio.lfmTheme) this.ratingImagesLfm = []; this.show_tt = true;

	this.setSbarIcon = () => {
		switch (ppt.sbarButType) {
			case 0:
				iconFontName = "Segoe UI Symbol"; iconFontStyle = 0;
				if (!uiBio.sbarType) {
					arrow_symb = uiBio.scr_but_w < Math.round(14 * sBio.scale) ? "\uE018" : "\uE0A0"; sbarButPad = uiBio.scr_but_w < Math.round(15 * sBio.scale) ? -0.3 : -0.22;
				} else {
					arrow_symb = uiBio.scr_but_w < Math.round(14 * sBio.scale) ? "\uE018" : "\uE0A0"; sbarButPad = uiBio.scr_but_w < Math.round(14 * sBio.scale) ? -0.26 : -0.22;
				}
				break;
			case 1: arrow_symb = 0; break;
			case 2:
				arrow_symb = ppt.arrowSymbol.replace(/\s+/g, "").charAt(); if (!arrow_symb.length) arrow_symb = 0;
				if (ppt.customCol && ppt.butCustIconFont.length) {
					const butCustIconFont = ppt.butCustIconFont.splt(1);
					iconFontName = butCustIconFont[0];
					iconFontStyle = Math.round(sBio.value(butCustIconFont[1], 0, 0));
				}
				break;
			}
	}; this.setSbarIcon();

	const clear = () => {this.Dn = false; Object.values(this.btns).forEach(v => v.down = false);}
	const scroll_alb = () => ppt.sbarShow && !ppt.artistView && !ppt.img_only && t.alb_txt && alb_scrollbar.scrollable_lines > 0 && alb_scrollbar.active && !alb_scrollbar.narrow;
	const scroll_art = () => ppt.sbarShow && ppt.artistView && !ppt.img_only && t.art_txt && art_scrollbar.scrollable_lines > 0 && art_scrollbar.active && !art_scrollbar.narrow;
	const src_tiptext = () => "Switch To " + (ppt.artistView ? (!ppt.allmusic_bio ? (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "AllMusic" + (ppt.bothBio ? " First" : "") : (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "Last.fm" + (ppt.bothBio ? " First" : "")) : (!ppt.allmusic_alb ? (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "AllMusic"  + (ppt.bothRev ? " First" : ""): (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "Last.fm" + (ppt.bothRev ? " First" : "")));
	const tt = (n, force) => {if (tooltip.Text !== n || force) {tooltip.Text = n; tooltip.SetMaxWidth(800); tooltip.Activate();}}

	this.clear_tooltip = () => {if (!tooltip.Text || !this.btns["mt"].tt) return; this.btns["mt"].tt.stop();}
	this.create_tooltip = () => tooltip = window.CreateTooltip("Segoe UI", scaleForDisplay(15) * sBio.scale * ppt.get(" Zoom Tooltip (%)", 100) / 100, 0); this.create_tooltip();
	this.draw = gr => Object.values(this.btns).forEach(v => {if (!v.hide) v.draw(gr);});
	this.lbtn_dn = (x, y) => {this.move(x, y); if (!cur_btn || cur_btn.hide) {this.Dn = false; return false} else this.Dn = cur_btn.name; cur_btn.down = true; cur_btn.cs("down"); cur_btn.lbtn_dn(x, y); return true;}
	this.leave = () => {if (cur_btn) {cur_btn.cs("normal"); if (!cur_btn.hide) transition.start();} cur_btn = null;}
	this.on_script_unload = () => tt("");
	this.reset = () => transition.stop();
	this.set_src_btn_hide = () => {if (this.btns.heading) this.btns.heading.hide = !ppt.heading || !t.head || ppt.img_only;}
	this.trace_src = (x, y) => {if (!ppt.src || ppt.hdCenter) return false; return x > dx3 && x < dx3 + src_w && y > pBio.text_t - uiBio.heading_h && y < pBio.text_t - uiBio.heading_h + uiBio.headFont_h;}

	this.create_images = () => {
		const sz = arrow_symb == 0 ? Math.max(Math.round(uiBio.but_h * 1.666667), 1) : 100, sc = sz / 100, iconFont = gdi.Font(iconFontName, sz, iconFontStyle);
		sAlpha = !uiBio.sbarCol ? [75, 192, 228] : [68, 153, 255];
		const hovAlpha = (!uiBio.sbarCol ? 75 : (!uiBio.sbarType ? 68 : 51)) * 0.4;
		hoverCol = !uiBio.sbarCol ? RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, hovAlpha) : uiBio.col.text & RGBA(255, 255, 255, hovAlpha);
		scrollBtn = sBio.gr(sz, sz, true, g => {g.SetTextRenderingHint(3); g.SetSmoothingMode(2); if (ppt.sbarCol) {arrow_symb == 0 ? g.FillPolygon(uiBio.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, iconFont, uiBio.col.text, 0, sz * sbarButPad, sz, sz, StringFormat(1, 1));} else {arrow_symb == 0 ? g.FillPolygon(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, iconFont, RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 255), 0, sz * sbarButPad, sz, sz, StringFormat(1, 1));} g.SetSmoothingMode(0);});
		if (pref.whiteTheme || pref.creamTheme) {
			scrollBtn = sBio.gr(sz, sz, true, g => {
				g.DrawString(arrow_symb, iconFont, RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 255), 0, sz * sbarButPad, sz, sz, StringFormat(1, 1));
			});
		} else if (pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
			scrollBtn = sBio.gr(sz, sz, true, g => {
				g.DrawString(arrow_symb, iconFont,
					pref.blackTheme ? RGBA(160, 160, 160, 160, 160, 160, 160, 160, 160, 255) :
					pref.blueTheme || pref.darkblueTheme || pref.redTheme ? RGBA(255, 255, 255, 255, 255, 255, 255, 255, 255, 255) :
					pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBA(200, 200, 200, 200, 200, 200, 200, 200, 200, 255) : '',
					0, sz * sbarButPad, sz, sz, StringFormat(1, 1)
				);
			});
		}
	}; this.create_images();

	this.create_mt = () => {
		switch (uiBio.fontAwesomeInstalled) {
			case true:
				mtCol = sBio.toRGB(uiBio.col.text);
				sBio.gr(1, 1, true, g => {
					mt_w = Math.max(g.CalcTextWidth("\uF107", mtFont), g.CalcTextWidth("\uF023", mtFontL), g.CalcTextHeight("\uF107", mtFont), g.CalcTextHeight("\uF023", mtFontL));});
				break;
			case false: {
				const sz = Math.max(Math.round(20 * scale / 100), 20), sc = sz / 100;
				mt = sBio.gr(sz, sz, true, g => {g.SetSmoothingMode(2);
				g.FillPolygon(uiBio.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]);
				g.SetSmoothingMode(0);});
				mtL = sBio.gr(sz, sz, true, g => {g.SetSmoothingMode(2);
				g.FillSolidRect(0, 0, sz, sz, uiBio.col.text);
				g.SetSmoothingMode(0);});
				break;
				}
		}
	}; this.create_mt();


	this.resetZoom = () => {
		ppt.zoomFont = 100; ppt.zoomHead = 115;
		zoom_mt_sz = orig_mt_sz;
		scale = ppt.zoomBut = 100;
		mtFont = gdi.Font("FontAwesome", ppt.baseFontSize * 1.4 * scale / 100, 0);
		mtFontL = gdi.Font("FontAwesome", ppt.baseFontSize * 1.5 * scale / 100, 0);
		ppt.headerConfig = ppt.headerConfig.replace(/BtnSize,(-|)\d+/, "BtnSize,0");
		uiBio.srcSizeAdjust = 0; ppt.set(" Zoom Tooltip (%)", 100); uiBio.get_font(); butBio.create_stars(); this.create_mt(); this.create_tooltip(); this.refresh(true); t.toggle(12);
	}

	this.set_scroll_btns_hide = (set, autoHide) => {
		if (autoHide) {
			const arr = autoHide == "both" ? scrBtns : autoHide == "alb" ? albScrBtns : artScrBtns;
			arr.forEach(v => {if (this.btns[v]) this.btns[v].hide = set;}); t.paint();
		} else {
			if (!ppt.sbarShow && !set) return;
			scrBtns.forEach((v, i) => {if (this.btns[v]) this.btns[v].hide = i < 2 ? !scroll_alb() : !scroll_art();});
		}
	}

	const drawPolyStar = (gr, x, y, out_radius, in_radius, points, line_thickness, line_color, fill_color) => {
		const point_arr = []; let rr = 0;
		for (let i = 0; i != points; i++) {i % 2 ? rr = Math.round((out_radius-line_thickness * 4) / 2) / in_radius : rr = Math.round((out_radius-line_thickness * 4) / 2); const x_point = Math.floor(rr * Math.cos(Math.PI * i / points * 2 - Math.PI / 2)), y_point = Math.ceil(rr * Math.sin(Math.PI * i / points * 2 - Math.PI / 2)); point_arr.push(x_point + out_radius/2); point_arr.push(y_point + out_radius/2);}
		const img = sBio.gr(out_radius, out_radius, true, g => {g.SetSmoothingMode(2); g.FillPolygon(fill_color, 1, point_arr); if (line_thickness > 0) g.DrawPolygon(line_color, line_thickness, point_arr);});
		gr.DrawImage(img, x, y, out_radius, out_radius, 0, 0, out_radius, out_radius);
	}

	const setRatingImages = (w, h, onCol, offCol, borCol, lfm) => {
		if (btnIcon && uiBio.stars == 1) onCol = onCol & 0xe0ffffff;
		w = w * scc; h = h * scc;
		const star_indent = 2;
		let img = null, real_rating = -1, star_height = h, star_padding = -1, star_size = h;
		while (star_padding <= 0) {star_size = star_height; star_padding = Math.round((w - 5 * star_size) / 4); star_height--;}
		const star_vpadding = star_height < h ? Math.floor((h - star_height) / 2) : 0;
		for (let rating = 0; rating < 11; rating++) {
			real_rating = rating / 2;
			if (Math.round(real_rating) != real_rating) {
				const img_off = sBio.gr(w, h, true, g => {for (let i = 0; i < 5; i++) drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, offCol);});
				const img_on = sBio.gr(w, h, true, g => {for (let i = 0; i < 5; i++) drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, onCol);});
				const half_mask_left = sBio.gr(w, h, true, g => {g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255)); g.FillSolidRect(0, 0, Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));});
				const half_mask_right = sBio.gr(w, h, true, g => {g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255)); g.FillSolidRect(Math.round(w * rating / 10), 0, w - Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));});
				img_on.ApplyMask(half_mask_left); img_off.ApplyMask(half_mask_right);
				img = sBio.gr(w, h, true, g => {g.DrawImage(img_off, 0, 0, w, h, 0, 0, w, h); g.DrawImage(img_on, 0, 0, w, h, 0, 0, w, h);});
			} else img = sBio.gr(w, h, true, g => {for (let i = 0; i < 5; i++) drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, i < real_rating ? onCol : offCol);});
			!lfm ? this.ratingImages[rating] = img : this.ratingImagesLfm[rating] = img;
		}
		if (!lfm) {this.r_w1 = this.ratingImages[10].Width; this.r_w2 = this.r_w1 / scc; this.r_h1 = this.ratingImages[10].Height; this.r_h2 = this.r_h1 / scc;}
	}

	this.set_src_fs = step => {
		src_fs += step;
		src_fs = sBio.clamp(src_fs, uiBio.stars != 1 ? (btnIcon ? 11 : 10) * sBio.scale : (is_4k ? 26 : 14), uiBio.headFont.Size)
		uiBio.srcSizeAdjust = src_fs - Math.round(uiBio.headFont.Size * 0.47);
		ppt.headerConfig = ppt.headerConfig.replace(/BtnSize,(-|)\d+/, "BtnSize," + uiBio.srcSizeAdjust.toString());
	}

	this.create_stars = () => {
		btnIcon = ppt.btnIcon && uiBio.BtnName && uiBio.fontAwesomeInstalled ? 1 : 0;
		const fs = uiBio.headFont.Size; src_fs = sBio.clamp(Math.round(fs * 0.47 + uiBio.srcSizeAdjust), uiBio.stars != 1 ? (btnIcon ? 11 : 10) * sBio.scale : (is_4k ? 26 : 14), fs); src_font = gdi.Font("Segoe UI", src_fs, 1);
		sBio.gr(1, 1, false, g => {
			src_h = g.CalcTextHeight("allmusic", src_font);
		});
		switch (btnIcon) {
			case 0:
				amBioBtn = ppt.amBioBtn; amRevBtn = ppt.amRevBtn; lfmBioBtn = ppt.lfmBioBtn; lfmRevBtn = ppt.lfmRevBtn;
				amlfmBioBtn = ""; amlfmRevBtn = ""; lfmamBioBtn = ""; lfmamRevBtn = "";
				if (!uiBio.BtnName) {amBioBtn = ""; amRevBtn = ""; lfmBioBtn = ""; lfmRevBtn = "";} else {amlfmBioBtn = amBioBtn + " | " + lfmBioBtn; amlfmRevBtn = amRevBtn + " | " + lfmRevBtn; lfmamBioBtn = lfmBioBtn + " | " + amBioBtn; lfmamRevBtn = lfmRevBtn + " | " + amRevBtn;}
				sBio.gr(1, 1, false, g => {
					sp_w = [" ", amRevBtn, lfmRevBtn, amBioBtn, lfmBioBtn, amlfmRevBtn, amlfmBioBtn].map(v => g.CalcTextWidth(v, uiBio.headFont));
				});
				break;
			case 1: {
				amBioBtn = amRevBtn = "allmusic"; lfmBioBtn = lfmRevBtn = "\uF202";
				src_font = gdi.Font(bahnSemiBoldCondInstalled ? bahnSemiBoldCond : "Segoe UI Semibold", src_fs, 0);
				ico_font = gdi.Font("FontAwesome", Math.round(src_fs * (bahnSemiBoldCondInstalled ? 1.09 : 1.16)), 0);
				const fonts = [src_font, src_font, ico_font, src_font, ico_font, src_font, src_font, src_font, ico_font];
				sBio.gr(1, 1, false, g => {
					sp_w = [" ", amRevBtn, lfmRevBtn, amBioBtn, lfmBioBtn, "0", "0", " | ", " "].map((v, i) => g.CalcTextWidth(v, fonts[i]));
				});
				sp_w[0] = Math.max(sp_w[0], sp_w[8]);
				sp_w[5] = sp_w[1] + sp_w[7] + sp_w[2];
				sp_w[6] = sp_w[3] + sp_w[7] + sp_w[4];
				y_offset = src_fs > 11 ? 0 : 1;
				break;
			}
		}
		this.ratingImages = []; if (uiBio.stars == 1 && uiBio.lfmTheme) this.ratingImagesLfm = [];
		if (uiBio.stars == 1) setRatingImages(Math.round(src_h / 1.5) * 5, Math.round(src_h / 1.5), uiBio.col.starOn, uiBio.col.starOff, uiBio.col.starBor, false);
		else if (uiBio.stars == 2) {setRatingImages(Math.round(uiBio.font_h / 1.75) * 5, Math.round(uiBio.font_h / 1.75), uiBio.col.starOn, uiBio.col.starOff, uiBio.col.starBor, false);}
		if (uiBio.stars == 1 && uiBio.lfmTheme) setRatingImages(Math.round(src_h / 1.5) * 5, Math.round(src_h / 1.5), RGBA(225, 225, 245, 255), RGB(225, 225, 245, 60), uiBio.col.starBor, true);
		m = (/[gjpqy]/).test(amRevBtn+lfmRevBtn+amBioBtn+lfmBioBtn);
	}

	const Btn = function(x, y, w, h, type, ft, txt, stat, im, hide, l_dn, l_up, tiptext, hand, name) {
		this.draw = gr => {
			switch (this.type) {
				case 5: uiBio.theme.SetPartAndStateID(1, im[this.state]); uiBio.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h); break;
				case 6: drawHeading(gr); break;
				case 7: drawMT(gr); break;
				default: drawScrollBtn(gr); break;
			}
		}

		this.cs = state => {this.state = state; if (state === "down" || state === "normal") this.tt.clear(); this.repaint();}
		this.lbtn_dn = () => {if (!butBio.Dn) return; this.l_dn && this.l_dn(x, y);}
		this.lbtn_up = (x, y) => {if (ppt.touchControl && Math.sqrt((Math.pow(pBio.last_pressed_coord.x - x, 2) + Math.pow(pBio.last_pressed_coord.y - y, 2))) > 3 * sBio.scale) return; if (this.l_up) this.l_up();}
		this.repaint = () => {const expXY = 2, expWH = 4; window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);}
		this.trace = (x, y) => {return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;}

		this.x = x; this.y = y; this.w = w; this.h = h; this.type = type; this.hide = hide; this.l_dn = l_dn; this.l_up = l_up; this.tt = new Tooltip; this.tiptext = tiptext; this.transition_factor = 0; this.state = "normal"; this.hand = hand; this.name = name;

		const drawHeading = gr => {
			let dh, dx1, dx2;
			if (!ppt.hdCenter) {if (ppt.src < 2) {dh = ppt.src ? (r || btnTxt ? (!ppt.hdRight && uiBio.BtnBg ? "" :  (ppt.hdLine != 2 ? "  " : " ")) : "") + t.heading + t.na : t.heading + t.na; dx1 = this.x + src_w; dx2 = dx3 = this.x;} else {dh = t.heading + t.na; dx1 = this.x; dx2 = dx3 = this.x + this.w - src_w;}} else dh = t.heading + t.na;
			switch (true) {
				case ppt.hdLine == 1: gr.DrawLine(this.x, this.y + uiBio.head_ln_h + scaleForDisplay(8), this.x + this.w + scaleForDisplay(20) - 1, this.y + uiBio.head_ln_h + scaleForDisplay(8), uiBio.l_h, uiBio.col.bottomLine); break;
				case ppt.hdLine == 2:
					if (!ppt.hdCenter) {
						let dh_w = gr.CalcTextWidth(dh, uiBio.headFont) + sp_w[0] * (!ppt.hdRight || !btnVisible ? 2 : 0);
						if (ppt.src == 2 && dh_w < this.w - src_w - sp_w[0] * (!ppt.hdRight || !btnVisible ? 3 : 1)) gr.DrawLine(this.x + dh_w, Math.round(this.y + this.h / 2), this.x + this.w - src_w - sp_w[0] * 3, Math.round(this.y + this.h / 2), uiBio.l_h, uiBio.col.centerLine);
						if (ppt.src < 2 && src_w + sp_w[0] * 2 + dh_w < this.w) gr.DrawLine(dx1 + (btnVisible ? sp_w[0] * 3 : ppt.hdRight ? 0 : dh_w), Math.ceil(this.y + this.h / 2), this.x + this.w - (ppt.src ? dh_w : ppt.hdRight ? dh_w : 0), Math.ceil(this.y + this.h / 2), uiBio.l_h, uiBio.col.centerLine);
					} else {
						let dh_w = gr.CalcTextWidth(dh, uiBio.headFont) + sp_w[0] * 4, ln_l = (this.w - dh_w) / 2;
						if (ln_l > 1) {gr.DrawLine(this.x, Math.ceil(this.y + this.h / 2), this.x + ln_l, Math.ceil(this.y + this.h / 2), uiBio.l_h, uiBio.col.centerLine); gr.DrawLine(this.x + ln_l + dh_w, Math.ceil(this.y + this.h / 2), this.x + this.w, Math.ceil(this.y + this.h / 2), uiBio.l_h, uiBio.col.centerLine);}
					} break;
			}
			gr.GdiDrawText(dh, uiBio.headFont, uiBio.col.head, !ppt.hdCenter ? dx1 : this.x, this.y, !ppt.hdCenter ? this.w - src_w - (ppt.src == 2 ? 10 : 0) : this.w, this.h, !ppt.hdCenter ? t.c[ppt.hdRight] : t.cc);
			if (!btnVisible) return; let col;
			/*
			if (uiBio.BtnBg) {
				gr.SetSmoothingMode(2);
				if (l || !uiBio.lfmTheme) {
					if (this.state !== "down") gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, RGBA(uiBio.col.blend4[0], uiBio.col.blend4[1], uiBio.col.blend4[2], uiBio.col.blend4[3] * (1 - this.transition_factor)));
					col = this.state !== "down" ? uiBio.get_blend(uiBio.col.blend2, uiBio.col.blend1, this.transition_factor, true) : uiBio.col.blend2;
					gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, col);
					gr.DrawRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, 1, uiBio.col.blend3);
				} else {
					gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, RGBA(210, 19, 9, 114));
					col = this.state !== "down" ? uiBio.get_blend(RGBA(244, 31, 19, 255), RGBA(210, 19, 9, 228), this.transition_factor, true) : RGBA(244, 31, 19, 255);
					gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, col);
				}
			}
			*/
			col = this.state !== "down" ? uiBio.get_blend(src_im.hover, src_im.normal, this.transition_factor, false) : src_im.hover;
			col = uiBio.col.head;
			switch (btnIcon) {
				case 0: gr.GdiDrawText(drawTxt, uiBio.headFont, col, dx2, ft - (!is_4k && initDPI.dpi() > 120 ? 2 : 1), src_w, src_h, !r ? t.cc : t.c[0]); break;
				case 1:
					if (!ppt.artistView && !t.btnRevBoth || ppt.artistView && !t.btnBioBoth) gr.GdiDrawText(drawTxt, l ? src_font : ico_font, col, dx2, ft + (l ? 0 : y_offset), src_w, src_h, !r ? t.cc : t.c[0]);
					else {
						if (ui.BtnBg) dx2 += sp_w[0];
						if (!ppt.artistView && t.btnRevBoth) {
							switch (l) {
								case 0:
									gr.GdiDrawText(lfmRevBtn, ico_font, col, dx2, ft + y_offset, sp_w[2], src_h, t.c[0]);
									gr.GdiDrawText(" | " + amRevBtn, src_font, col, dx2 + sp_w[2], ft, sp_w[1] + sp_w[7], src_h, t.c[0]);
									break;
								case 1:
									gr.GdiDrawText(amRevBtn + " | ", src_font, col, dx2, ft, sp_w[1] + sp_w[7], src_h, t.c[0]);
									gr.GdiDrawText(lfmRevBtn, ico_font, col, dx2 + sp_w[1] + sp_w[7], ft + y_offset, sp_w[2], src_h, t.c[0]);
									break;
								}
						}
						if (ppt.artistView && t.btnBioBoth) {
							switch (l) {
								case 0:
									gr.GdiDrawText(lfmBioBtn, ico_font, col, dx2, ft + y_offset, sp_w[4], src_h, t.c[0]);
									gr.GdiDrawText(" | " + amBioBtn, src_font, col, dx2 + sp_w[4], ft, sp_w[3] + sp_w[7], src_h, t.c[0]);
									break;
								case 1:
									gr.GdiDrawText(amBioBtn + " | ", src_font, col, dx2, ft , sp_w[3] + sp_w[7], src_h, t.c[0]);
									gr.GdiDrawText(lfmBioBtn, ico_font, col, dx2 + sp_w[3] + sp_w[7], ft + y_offset, sp_w[4], src_h, t.c[0]);
									break;
							}
						}
					}
				break;
			}
			if (r) gr.DrawImage(t.alb_allmusic ? butBio.ratingImages[!t.btnRevBoth ? t.amRating : t.avgRating] : uiBio.BtnBg && uiBio.lfmTheme ? butBio.ratingImagesLfm[!t.btnRevBoth ? t.lfmRating : t.avgRating] : butBio.ratingImages[!t.btnRevBoth? t.lfmRating : t.avgRating], ppt.src == 2 ? this.x + this.w - butBio.r_w2 - (uiBio.BtnBg ? sp_w[0] : 0) : dx2 + name_w, ft + (Math.round(src_h - butBio.r_h2) / 2) - ((is_4k ? 0 : 1) || (!is_4k && initDPI.dpi() > 120 ? 2 : 1)), butBio.r_w2, butBio.r_h2, 0, 0, butBio.r_w1, butBio.r_h1, 0, 255);
		}

		const drawMT = gr => {
			switch (uiBio.fontAwesomeInstalled) {
				case true: {
					//const col = this.state !== "down" ? uiBio.get_blend(im.hover, im.normal, this.transition_factor, true) : im.hover;
					const col = uiBio.col.head;
					gr.SetTextRenderingHint(5);
					if (!ppt.img_only) { // Fix crash if ppt.img_only on startup is enabled
						!pBio.lock ? gr.DrawString(!pBio.moreTags || !ppt.artistView ? "\uF107" : "\uF107", mtFont, col, this.x, this.y, ft, txt, StringFormat(1, 1)) :
						gr.DrawString("\uF023", mtFontL, col, this.x, this.y + 3 * sBio.scale, ft, txt, StringFormat(1, 1));
						//!pBio.lock ? gr.DrawString(!pBio.moreTags || !ppt.artistView ? "\uF107" : "\uF13A", mtFont, col, this.x, this.y, ft, txt, StringFormat(1, 1)) :
						//gr.DrawString("\uF023", mtFontL, col, this.x, this.y + 3 * s.scale, ft, txt, StringFormat(1, 1));
					}
					break;
				}
				case false: {
					const a = this.state !== "down" ? Math.min(sAlpha[0] + (sAlpha[1] - sAlpha[0]) * this.transition_factor, sAlpha[1]) : sAlpha[2];
					if (im[pBio.lock]) gr.DrawImage(im[pBio.lock], this.x, this.y, this.w / 1.5, this.h / 1.5, 0, 0, im[pBio.lock].Width, im[pBio.lock].Height, 180, a);
					break;
				}
			}
		}

		const drawScrollBtn = gr => {
			const a = this.state !== "down" ? Math.min(sAlpha[0] + (sAlpha[1] - sAlpha[0]) * this.transition_factor, sAlpha[1]) : sAlpha[2];
			if (this.state !== "normal" && uiBio.sbarType == 1) gr.FillSolidRect(pBio.sbar_x, this.y, uiBio.sbar_w, this.h, hoverCol);
			if (scrollBtn) gr.DrawImage(scrollBtn, this.x + ft, txt, stat, stat, 0, 0, scrollBtn.Width, scrollBtn.Height, this.type == 1 || this.type == 3 ? 0 : 180, a);
		}
	}

	this.move = (x, y) => {
		const hover_btn = Object.values(this.btns).find(v => {
			 if (!v.hide && (!this.Dn || this.Dn == v.name)) return v.trace(x, y);
		});
		let hand = false; init = false;
		check_scrollBtns(x, y, hover_btn); if (hover_btn) hand = hover_btn.hand; if (!tb.down) window.SetCursor(!hand && !imgBio.bar.hand ? 32512 : 32649);
		if (hover_btn && hover_btn.hide) {if (cur_btn) {cur_btn.cs("normal"); transition.start();} cur_btn = null; return null;} // btn hidden, ignore
		if (cur_btn === hover_btn) return cur_btn;
		if (cur_btn) {cur_btn.cs("normal"); transition.start();} // return prev btn to normal state
		if (hover_btn && !(hover_btn.down && hover_btn.type < 6)) {hover_btn.cs("hover"); if (this.show_tt && hover_btn.tiptext) hover_btn.tt.show(hover_btn.tiptext()); transition.start();}
		cur_btn = hover_btn;
		return cur_btn;
	}

	this.lbtn_up = (x, y) => {
		if (!cur_btn || cur_btn.hide || this.Dn != cur_btn.name) {clear(); return false;}
		clear();
		if (cur_btn.trace(x, y)) cur_btn.cs("hover");
		cur_btn.lbtn_up(x, y);
		return true;
	}

	this.wheel = step => {
		if (!ppt.mul_item || !this.btns["mt"] || !this.btns["mt"].trace(pBio.m_x, pBio.m_y)) return;
		zoom_mt_sz += step; zoom_mt_sz = sBio.clamp(zoom_mt_sz, 7, 100);
		window.RepaintRect(this.btns["mt"].x, this.btns["mt"].y, this.btns["mt"].w, this.btns["mt"].h);
		scale = Math.round(zoom_mt_sz / orig_mt_sz * 100);
		mtFont = gdi.Font("FontAwesome", 15 * scale / 100, 0);
		mtFontL = gdi.Font("FontAwesome", 14 * scale / 100, 0);
		this.create_mt(); this.refresh(true); ppt.zoomBut = scale;
	}

	this.check = refresh => {
		if (!refresh) {this.set_scroll_btns_hide(); if (ppt.sbarShow == 1 && init) butBio.set_scroll_btns_hide(true, "both"); this.set_src_btn_hide();}
		if (!this.btns.heading || !ppt.heading) return;
		l = ppt.artistView && t.bio_allmusic || !ppt.artistView && t.alb_allmusic ? 1 : 0; r = uiBio.stars == 1 && !ppt.artistView && (t.alb_allmusic && (!t.btnRevBoth ? t.amRating != -1 : t.avgRating != -1) || !t.alb_allmusic && (!t.btnRevBoth ? t.lfmRating != -1 : t.avgRating != -1));
		drawTxt = l ? (uiBio.BtnBg ? " " : "") + (!ppt.artistView ? (!t.btnRevBoth ? amRevBtn : amlfmRevBtn) : (!t.btnBioBoth ? amBioBtn : amlfmBioBtn)) + (uiBio.BtnBg || r ? " " : "") : (uiBio.BtnBg ? " " : "") + (!ppt.artistView ? (!t.btnRevBoth ? lfmRevBtn : lfmamRevBtn) : (!t.btnBioBoth ? lfmBioBtn : lfmamBioBtn)) + (uiBio.BtnBg || r ? " " : "");
		btnTxt = btnIcon || drawTxt.trim().length ? true : false; btnVisible = ppt.src && (r || btnTxt) && !ppt.hdCenter;
		if (!ppt.src || (!r && !btnTxt) || ppt.hdCenter) src_w = 0; else {
			name_w = 0;
			if (r) name_w = t.alb_allmusic ? (!t.btnRevBoth ? sp_w[1] : sp_w[5]) : (!t.btnRevBoth ? sp_w[2] : sp_w[5]);
			name_w = name_w + sp_w[0] * (uiBio.BtnBg ? (name_w ? 2 : 1) : 0);
			src_w = r ? name_w + this.r_w2 + (btnTxt || uiBio.BtnBg ? sp_w[0] : 0) : btnTxt ? (ppt.artistView ? (t.bio_allmusic ? (!t.btnBioBoth ? sp_w[3] : sp_w[6]) : (!t.btnBioBoth ? sp_w[4] : sp_w[6])) : (t.alb_allmusic ? (!t.btnRevBoth ? sp_w[1] : sp_w[5]) : (!t.btnRevBoth ? sp_w[2] : sp_w[5]))) + sp_w[0] * (uiBio.BtnBg ? 2 : 0) : 0; if (!uiBio.BtnBg) name_w += sp_w[0] * (btnTxt ? 2 : 0);
		}
	}

	this.refresh = upd => {
		if (upd) {b_x = pBio.sbar_x; byUp = Math.round(pBio.sbar_y); byDn = Math.round(pBio.sbar_y + pBio.sbar_h - uiBio.but_h); if (uiBio.sbarType < 2) {b_x -= 1; scrollBtn_x = (uiBio.but_h - uiBio.scr_but_w) / 2; scrollUp_y = -uiBio.arrow_pad + byUp + (uiBio.but_h - 1 - uiBio.scr_but_w) / 2; scrollDn_y = uiBio.arrow_pad + byDn + (uiBio.but_h - 1 - uiBio.scr_but_w) / 2;}}
		if (ppt.heading) {
			this.check();
			this.btns.heading = new Btn(pBio.heading_x, pBio.text_t - uiBio.heading_h, pBio.heading_w - scaleForDisplay(20), uiBio.headFont_h, 6, sBio.clamp(Math.round(pBio.text_t - uiBio.heading_h + (uiBio.headFont_h - src_h) / 2 + uiBio.src_pad), pBio.text_t - uiBio.heading_h, pBio.text_t - uiBio.heading_h + uiBio.headFont_h - src_h), "", "", "", !ppt.heading || !t.head || ppt.img_only, "", () => {t.toggle(ppt.artistView ? (!ppt.bothBio ? 0 : 6) : (!ppt.bothRev ? 1 : 7)); butBio.check(true); if (uiBio.blur) window.Repaint();}, () => src_tiptext(), true, "heading");
		}
		src_im = {normal: l || (!uiBio.lfmTheme || uiBio.lfmTheme && !uiBio.BtnBg) ? uiBio.bg || !uiBio.bg && !uiBio.trans || ppt.blurDark || ppt.blurLight ? uiBio.col.btn : RGB(255, 255, 255) : RGB(225, 225, 245), hover: l || (!uiBio.lfmTheme || uiBio.lfmTheme && !uiBio.BtnBg) ?  uiBio.bg || !uiBio.bg && !uiBio.trans || ppt.blurDark || ppt.blurLight ? uiBio.col.text_h : RGB(255, 255, 255) : RGB(225, 225, 245)};
		if (ppt.mul_item) {
			if (ppt.style === 0 || ppt.style > 3) {
				switch (uiBio.fontAwesomeInstalled) {
					case true:
						this.btns.mt = new Btn(b_x - scaleForDisplay(2), pBio.text_t - uiBio.heading_h + scaleForDisplay(1), mt_w * 1.5, mt_w * 1.5, 7, mt_w, mt_w, "", {normal: RGBA(mtCol[0], mtCol[1], mtCol[2], 50), hover: RGBA(mtCol[0], mtCol[1], mtCol[2], sAlpha[1])}, !ppt.mul_item, "", () => menBio.button(12 * scale / 100, 16), () => "Click: More...\r\nMiddle Click: " + (!pBio.lock ? "Lock: Stop Track Change Updates" : "Unlock") + "...", true, "mt");
						break;
					case false:
						this.btns.mt = new Btn(b_x - scaleForDisplay(2), pBio.text_t - uiBio.heading_h + scaleForDisplay(1), 12 * scale / 100 * 1.5, 12 * scale / 100 * 1.5, 7, "", "", "", [mt, mtL], !ppt.mul_item, "", () => menBio.button(12 * scale / 100, 16), () => "Click: More...\r\nMiddle Click: " + (!pBio.lock ? "Lock: Stop Track Change Updates" : "Unlock") + "...", true, "mt");
						break;
				}
			} else if (ppt.style === 1 || ppt.style === 2 || ppt.style === 3) {
				switch (uiBio.fontAwesomeInstalled) {
					case true:
						this.btns.mt = new Btn(ww / 2 - ppt.borR - scaleForDisplay(13), pBio.text_t - uiBio.heading_h + scaleForDisplay(2), mt_w * 1.5, mt_w * 1.5, 7, mt_w, mt_w, "", {normal: RGBA(mtCol[0], mtCol[1], mtCol[2], 50), hover: RGBA(mtCol[0], mtCol[1], mtCol[2], sAlpha[1])}, !ppt.mul_item, "", () => menBio.button(12 * scale / 100, 16), () => "Click: More...\r\nMiddle Click: " + (!pBio.lock ? "Lock: Stop Track Change Updates" : "Unlock") + "...", true, "mt");
						break;
					case false:
						this.btns.mt = new Btn(ww / 2 - ppt.borR - scaleForDisplay(13), pBio.text_t - uiBio.heading_h + scaleForDisplay(2), 12 * scale / 100 * 1.5, 12 * scale / 100 * 1.5, 7, "", "", "", [mt, mtL], !ppt.mul_item, "", () => menBio.button(12 * scale / 100, 16), () => "Click: More...\r\nMiddle Click: " + (!pBio.lock ? "Lock: Stop Track Change Updates" : "Unlock") + "...", true, "mt");
						break;
				}
			}
		} else delete this.btns.mt;
		if (ppt.sbarShow) {
			switch (uiBio.sbarType) {
				case 2:
					this.btns.alb_scrollUp = new Btn(b_x, byUp, uiBio.but_h, uiBio.but_h, 5, "", "", "", {normal: 1, hover: 2, down: 3}, ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.butBio(1), "", "", false, "alb_scrollUp");
					this.btns.alb_scrollDn = new Btn(b_x, byDn, uiBio.but_h, uiBio.but_h, 5, "", "", "", {normal: 5, hover: 6, down: 7}, ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.butBio(-1), "", "", false, "alb_scrollDn");
					this.btns.art_scrollUp = new Btn(b_x, byUp, uiBio.but_h, uiBio.but_h, 5, "", "", "", {normal: 1, hover: 2, down: 3}, ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.butBio(1), "", "", false, "art_scrollUp");
					this.btns.art_scrollDn = new Btn(b_x, byDn, uiBio.but_h, uiBio.but_h, 5, "", "", "", {normal: 5, hover: 6, down: 7}, ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.butBio(-1), "", "", false, "art_scrollDn");
					break;
				default:
					this.btns.alb_scrollUp = new Btn(b_x, byUp - pBio.top_corr, uiBio.but_h, uiBio.but_h + pBio.top_corr, 1, scrollBtn_x, scrollUp_y, uiBio.scr_but_w, "", ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.butBio(1), "", "", false, "alb_scrollUp");
					this.btns.alb_scrollDn = new Btn(b_x, byDn, uiBio.but_h, uiBio.but_h + pBio.top_corr, 2, scrollBtn_x, scrollDn_y, uiBio.scr_but_w, "", ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.butBio(-1), "", "", false, "alb_scrollDn");
					this.btns.art_scrollUp = new Btn(b_x, byUp - pBio.top_corr, uiBio.but_h, uiBio.but_h + pBio.top_corr, 3, scrollBtn_x, scrollUp_y, uiBio.scr_but_w, "", ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.butBio(1), "", "", false, "art_scrollUp");
					this.btns.art_scrollDn = new Btn(b_x, byDn, uiBio.but_h, uiBio.but_h + pBio.top_corr, 4, scrollBtn_x, scrollDn_y, uiBio.scr_but_w, "", ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.butBio(-1), "", "", false, "art_scrollDn");
					break;
			}
		}
		transition = new Transition(this.btns, v => v.state !== 'normal');
	}

	const Transition = function(items_arg, hover_predicate) {
		this.start = () => {
			const hover_in_step = 0.2, hover_out_step = 0.06;
			if (!transition_timer) {
				transition_timer = setInterval(() => {
					Object.values(items).forEach(v => {
						const saved = v.transition_factor;
						if (hover(v)) v.transition_factor = Math.min(1, v.transition_factor += hover_in_step);
						else v.transition_factor = Math.max(0, v.transition_factor -= hover_out_step);
						if (saved !== v.transition_factor) v.repaint();
					});
					const running = Object.values(items).some(v => v.transition_factor > 0 && v.transition_factor < 1);
					if (!running) this.stop();
				}, 25);
			}
		}
		this.stop = () => {
			if (transition_timer) {
				clearInterval(transition_timer);
				transition_timer = null;
			}
		}
	const items = items_arg, hover = hover_predicate; let transition_timer = null;
	}

	const Tooltip = function() {
		this.show = text => {if (Date.now() - tt_start > 2000) this.showDelayed(text); else this.showImmediate(text); tt_start = Date.now();}
		this.showDelayed = text => tt_timer.start(this.id, text);
		this.showImmediate = text => {tt_timer.set_id(this.id); tt_timer.stop(this.id); tt(text);}
		this.clear = () => tt_timer.stop(this.id);
		this.stop = () => tt_timer.force_stop();
		this.id = Math.ceil(Math.random().toFixed(8) * 1000);
		const tt_timer = TooltipTimer;
	}

	const TooltipTimer = new function() {
		let delay_timer, tt_caller = undefined;
		this.start = (id, text) => {
			const old_caller = tt_caller; tt_caller = id;
			if (!delay_timer && tooltip.Text) tt(text, old_caller !== tt_caller );
			else {
				this.force_stop();
				if (!delay_timer) {
					delay_timer = setTimeout(() => {
						tt(text);
						delay_timer = null;
					}, 500);
				}
			}
		}
		this.set_id = id => tt_caller = id;
		this.stop = id => {if (tt_caller === id) this.force_stop();}
		this.force_stop = () => {
			tt("");
			if (delay_timer) {
				clearTimeout(delay_timer);
				delay_timer = null;
			}
		}
	}

	const check_scrollBtns = (x, y, hover_btn) => {
			const arr = alb_scrollbar.timer_but ? albScrBtns : art_scrollbar.timer_but ? artScrBtns : false;
			if (arr) {
			   if ((this.btns[arr[0]].down || this.btns[arr[1]].down) && !this.btns[arr[0]].trace(x, y) && !this.btns[arr[1]].trace(x, y)) {
				   this.btns[arr[0]].cs("normal"); this.btns[arr[1]].cs("normal");
				   if (alb_scrollbar.timer_but) {clearTimeout(alb_scrollbar.timer_but); alb_scrollbar.timer_but = null; alb_scrollbar.count = -1;}
				   if (art_scrollbar.timer_but) {clearTimeout(art_scrollbar.timer_but); art_scrollbar.timer_but = null; art_scrollbar.count = -1;}
				}
			} else if (hover_btn) scrBtns.forEach(v => {
				if (hover_btn.name == v && hover_btn.down) {this.btns[v].cs("down"); hover_btn.l_dn();}
			});
		}
}

function MenuItemsBio() {
	this.x; this.y; this.w; this.h;
	const items = ppt.menu_items.splt(0), check_show = sBio.value(items[7], 0, 2), cov_type_arr = ["Front", "Back", "Disc", "Icon", "Artist", "Cycle Above", "Cycle From Folder"], ln = pBio.tag.length, MenuMap = [], MF_GRAYED = 0x00000001, MF_SEPARATOR = 0x00000800, MF_STRING = 0x00000000, pl_show = sBio.value(items[3], 0, 2), popUpText = (n2, n3) => `Check media library and create playlist: ${n2} ${n3} Missing\n\nServer setting will be used.\n\nWARNING: This operation analyses a lot of data. It may trigger an "Unresponsive script" pop-up. If that happens choose "Continue" or "Don't ask me again". Choosing "Stop script" will trigger an error.\n\nProceed?`, popUpName = "Missing Data:", sendToPlaylist = (m, n2, n3) => {if (m.Count) {const pln = plman.FindOrCreatePlaylist(`${n2} ${n3} Missing`, false); plman.ActivePlaylist = pln; plman.ClearPlaylist(pln); plman.InsertPlaylistItems(pln, 0, m);} else fb.ShowPopupMessage(`${n2} ${n3}: None missing`, "Biography");}, tags_show = sBio.value(items[5], 1, 2);
	let amPth = [], b_n = "", bn, imgArtist = "", imgBlk = true, imgName = "", imgPth = false, lfmPth = [], imgList, paste_show = sBio.value(items[1], 1, 2), OrigIndex = 0, pl_menu = [], pths = [], shift = false, style_arr = [], tracksPth = [], undoFo = "", undoPth = "", undoTxt = "#!#";
	this.bioCounter = 0; this.revCounter = 0; this.right_up = false;

	const newMenuItem = (index, type, value) => {MenuMap[index] = {}; MenuMap[index].type = type; MenuMap[index].value = value;}
	const alignTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ppt.style == 0 || ppt.style == 2 ? ["Left", "Centre", "Right", "Auto Align with Text"] : ["Top", "Centre", "Bottom", "Auto Align With Text"]; n.forEach((v, i) => {newMenuItem(Index, "Align", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Index++; else Menu.CheckMenuItem(Index++, ppt.textAlign); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + (ppt.style == 0 || ppt.style == 2 ? ppt.alignH : ppt.alignV)); return Index;}
	const alignHTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Left", "Centre", "Right"]; n.forEach((v, i) => {newMenuItem(Index, "alignH", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.alignH); return Index;}
	const alignVTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [!ppt.alignV && !ppt.alignAuto, ppt.alignV == 1 && !ppt.alignAuto, ppt.alignV == 2 && !ppt.alignAuto, ppt.alignAuto], n = ["Top", "Centre", "Bottom", "Auto"]; n.forEach((v, i) => {newMenuItem(Index, "AlignV", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const biographyTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; newMenuItem(Index, "Sources", 0); Index++; return Index;}
	const biogTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.mul_item, ppt.cycPic, false, false], n = ["Show More Items Button", "Auto Cycle Images", "Cycle Time...", "Force Update"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 22); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i != 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const bioTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.allmusic_bio && !ppt.bothBio, !ppt.allmusic_bio && !ppt.bothBio, ppt.bothBio, ppt.lockBio], n = [(!ppt.lockBio ? "Prefer " : "") + "AllMusic", (!ppt.lockBio ? "Prefer " : "") + "Last.fm", "Prefer Both", "Lock To Single Source"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 1); Menu.AppendMenuItem((i < 2 || i == 3) && ppt.bothBio ? MF_GRAYED : MF_STRING, Index, v); if (i > 1) Menu.CheckMenuItem(Index++, c[i]); else {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} if (i == 1 || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const borderTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artBorderImgOnly == 1 || ppt.artBorderImgOnly == 3, ppt.artBorderDual == 1 || ppt.artBorderDual == 3, ppt.covBorderImgOnly == 1 || ppt.covBorderImgOnly == 3, ppt.covBorderDual == 1 || ppt.covBorderDual == 3], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Border", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const checkTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Album Review [AllMusic]", "Album Review [Last.fm]", "Biography [AllMusic]", "Biography [Last.fm]", "Artist Images [Last.fm]"]; n.forEach((v, i) => {newMenuItem(Index, "Check", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (i == 1 || i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const circTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artCircImgOnly, ppt.artCircDual, ppt.covCircImgOnly, ppt.covCircDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Circular", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const covTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [false, false, false, false, false, ppt.loadCovAllFb, ppt.loadCovFolder], n = cov_type_arr; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 15); Menu.AppendMenuItem(imgBio.cycCov && i < 5 ? MF_GRAYED : MF_STRING, Index, v); if (i > 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 4, StartIndex + ppt.covType); return Index;}
	const cropTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artCropImgOnly, ppt.artCropDual, ppt.covCropImgOnly, ppt.covCropDual], g = [ppt.artCircImgOnly, ppt.artCircDual, ppt.covCircImgOnly, ppt.covCircDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Crop", i); Menu.AppendMenuItem(!g[i] ? MF_STRING : MF_GRAYED, Index, v + (g[i] ? " N/A: Circular Set" : "")); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const defaultTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = [ppt.panelActive ? "Inactivate" : "Activate Biography", "Panel Properties", "Configure..."]; if (ppt.panelActive) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); n.forEach((v, i) => {newMenuItem(Index, "Default", i); if (i == 1 || shift || !ppt.panelActive) Menu.AppendMenuItem(MF_STRING, Index++, v); if ((shift || !ppt.panelActive) && !i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const headingTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.heading, !ppt.hdRight && !ppt.hdCenter, ppt.hdRight && !ppt.hdCenter, ppt.hdCenter, ppt.fullWidthHeading, ppt.src], n = !uiBio.custHeadFont ? ["Show", "Left", "Right", "Center", "Always Full Width", "Button"] : ["Show", "Left", "Right", "Center", "Button"]; n.forEach((v, i) => {newMenuItem(Index, "Heading", i); Menu.AppendMenuItem(!i || ppt.heading && !(i == 5 && ppt.hdCenter) ? MF_STRING : MF_GRAYED, Index, v); if (i > 0 && i < 4 ) {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} else {Menu.CheckMenuItem(Index++, c[i]);} if (!i || i > 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const headingFormatTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.hdLine == 1, ppt.hdLine == 2, !uiBio.custHeadFont ? ppt.headFontStyle == 1 : false, !uiBio.custHeadFont ? ppt.headFontStyle == 2 : false, ppt.headFontStyle == 3, ppt.headFontStyle == 16, ppt.headFontStyle == 18], n = !uiBio.custHeadFont ? ["Line Bottom", "Line Center", "Bold", "Italic", "Bold Italic", "SemiBold [Segoe UI]", "SemiBold Italic [Segoe UI]", "Heading Title Format..."] : ["Line Bottom", "Line Center", "Font: Custom...", "Heading Title Format..."]; n.forEach((v, i) => {newMenuItem(Index, "Heading", i + 6); Menu.AppendMenuItem(ppt.heading ? MF_STRING : MF_GRAYED, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i == 1 || i == 4 || i == n.length - 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const iconTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [!uiBio.BtnName, !ppt.btnIcon && uiBio.BtnName, ppt.btnIcon && uiBio.BtnName, uiBio.BtnBg], n = ["No Text or Icon", "Text", "Icon" + (uiBio.fontAwesomeInstalled ? "" : " N/A Requires FontAwesome"), "Background", "Size: Ctrl + Wheel Over Button"]; n.forEach((v, i) => {newMenuItem(Index, "Icon", i); Menu.AppendMenuItem(ppt.heading && (i != 2 || uiBio.fontAwesomeInstalled) && i < 4 ? MF_STRING : MF_GRAYED, Index, v); if (i < 3) {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} else if (i == 3) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 2 || i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const imageTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.autoEnlarge, ppt.imgSmoothTrans], n = ["Enlarge on Hover", "Smooth Transition"]; n.forEach((v, i) => {newMenuItem(Index, "Image", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const langTypeMenu= (Menu, StartIndex) => {let Index = StartIndex; const n = pBio.langArr; n.forEach((v, i) => {newMenuItem(Index, "Language", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + n.length - 1, StartIndex + pBio.lfmLang_ix); return Index;}
	const lfmRevTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Album", "Album + Track", "Track"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 9); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.inclTrackRev); return Index;}
	const modeTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = [!pBio.imgText ? "Auto Display" : "Image+Text", "Image Only", "Text Only"]; n.forEach((v, i) => {newMenuItem(Index, "Mode", i); Menu.AppendMenuItem(i != 1 || !ppt.autoEnlarge ? MF_STRING : MF_GRAYED, Index, v); Index++; if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + (ppt.sameStyle ? (!ppt.img_only && !ppt.text_only ? 0 : ppt.img_only ? 1 : 2) : ppt.artistView ? ppt.bioMode : ppt.revMode)); return Index;}
	const moreAlbMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Manual Cycle: Wheel Over Button", "Auto Cycle Items", "Cycle Time...", "Reload"]; pBio.albums.forEach((v, i) => {newMenuItem(Index, "More-Album", i); Menu.AppendMenuItem(v.type != "label" ? MF_STRING : MF_GRAYED, Index, !i || v.type.includes("history") ? v.artist.replace(/&/g, "&&") + " - " + v.album.replace(/&/g, "&&") : v.album.replace(/&/g, "&&")); Index++; if (!i || v.type == "albumend" || v.type == "label" || v.type == "historyend") Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); if (pBio.albums.length) Menu.CheckMenuRadioItem(StartIndex, StartIndex + pBio.albums.length, StartIndex + pBio.alb_ix); n.forEach((v, i) => {newMenuItem(Index, "More-Album", pBio.albums.length + i); Menu.AppendMenuItem(!i ? MF_GRAYED : MF_STRING, Index, v); if (i == 1) Menu.CheckMenuItem(Index++, ppt.cycItem); else Index++; if (!i || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const moreArtMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Manual Cycle: Wheel Over Button", "Auto Cycle Items", "Cycle Time...", "Reload"]; pBio.artists.forEach((v, i) => {newMenuItem(Index, "More-Artist", i); Menu.AppendMenuItem(v.type != "label" ? MF_STRING : MF_GRAYED, Index, v.name.replace(/&/g, "&&") + v.field.replace(/&/g, "&&")); Index++; if (!i || v.type == "similarend" || v.type == "label" || v.type == "tagend" || v.type == "historyend") Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); if (pBio.artists.length) Menu.CheckMenuRadioItem(StartIndex, StartIndex + pBio.artists.length, StartIndex + pBio.art_ix); n.forEach((v, i) => {newMenuItem(Index, "More-Artist", pBio.artists.length + i); Menu.AppendMenuItem(!i ? MF_GRAYED : MF_STRING, Index, v); if (i == 1) Menu.CheckMenuItem(Index++, ppt.cycItem); else Index++; if (!i || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const openTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const fo = [imgPth, amPth[3], lfmPth[3], tracksPth[3]], n = ["Image", ppt.artistView ? "Biography [AllMusic]" : "Review [AllMusic]", ppt.artistView ? "Biography [Last.fm]" : "Review [Last.fm]", ppt.artistView ? "" : "Tracks [Last.fm]"]; let i = n.length; while (i--) if (!fo[i]) {n.splice(i, 1); fo.splice(i, 1); pths.splice(i, 1);} n.forEach((v, i) => {newMenuItem(Index, "Open", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (!i && n.length > 1 && imgPth) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const optionsTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.sameStyle, !pBio.imgText, ppt.smooth, ppt.touchControl, pBio.dblClick, false, false, false, false], n = ["Use Same Style for Artist && Album", "Dual Style Auto", "Smooth Scroll", "Touch Control", "Click Action: Use Double Click", "Fallback Text...", "Line Spacing...", "Reset Zoom", "Reload"]; n.forEach((v, i) => {newMenuItem(Index, "Options", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 2 || i > 2 && i < 6) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Menu.CheckMenuItem(Index++, c[i]);}); return Index;}
	const overlayTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Gradient", "Standard", "Standard + Rim", "Rounded", "Rounded + Rim"]; n.forEach((v, i) => {newMenuItem(Index, "Overlay", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, i == ppt.overlayStyle); if (!i || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const pasteTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = [ppt.artistView ? "Biography [AllMusic Location]" : "Review [AllMusic Location]", ppt.artistView ? "Biography [Last.fm Location]" : "Review [Last.fm Location]", "Open Last Edited", "Undo"]; n.forEach((v, i) => {newMenuItem(Index, "Paste", i); Menu.AppendMenuItem(!i && !amPth[2] || i == 1 && !lfmPth[2] || i == 2 && !undoPth || i == 3 && undoTxt == "#!#" ? MF_GRAYED : MF_STRING, Index, v); Index++; if (i == 1 || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const photoTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.cycPhoto, !ppt.cycPhoto, ppt.cycPhotoLfmOnly], n = ["Cycle From Folder", "Artist", "Filter: " + (!ppt.cycPhoto ? "N/A: Single Artist Image Set" : "Last.fm Artist Images")]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 12); Menu.AppendMenuItem(i != 2 || ppt.cycPhoto ? MF_STRING : MF_GRAYED, Index, v); if (i == 2) Menu.CheckMenuItem(Index++, c[i]); else {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const playlistTypeMenu = (i, Menu, StartIndex) => {let Index = StartIndex; for (let j = i * 30; j < Math.min(pl_menu.length, 30 + i * 30); j++) {newMenuItem(Index, "Playlists", j); Menu.AppendMenuItem(MF_STRING, Index, pl_menu[j].name); Index++;} if (OrigIndex + plman.ActivePlaylist >= StartIndex && OrigIndex + plman.ActivePlaylist <= StartIndex + 29) Menu.CheckMenuRadioItem(StartIndex, StartIndex + 29, OrigIndex + plman.ActivePlaylist); return Index;}
	const reflTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artReflImgOnly, ppt.artReflDual, ppt.covReflImgOnly, ppt.covReflDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]", "Auto Position", "Top", "Left", "Bottom", "Right"]; n.forEach((v, i) => {newMenuItem(Index, "Reflection", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 1 || i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex + 4, StartIndex + 8, StartIndex + ppt.imgReflType + 4); return Index;}
	const revTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.allmusic_alb && !ppt.bothRev, !ppt.allmusic_alb && !ppt.bothRev, ppt.bothRev, ppt.lockRev], n = [(!ppt.lockRev ? "Prefer " : "") + "AllMusic", (!ppt.lockRev ? "Prefer " : "") + "Last.fm", "Prefer Both", "Lock To Single Source"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 5); Menu.AppendMenuItem((i < 2 || i == 3) && ppt.bothRev ? MF_GRAYED : MF_STRING, Index, v); if (i > 1) Menu.CheckMenuItem(Index++, c[i]); else {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} if (i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const sbarTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Hide", "Auto", "Show", "Default", "Styled", "Themed", "Use Theme Metrics", "Arrows", "Triangles", "Custom Arrows", "Set Custom Arrows..."]; n.forEach((v, i) => {newMenuItem(Index, "Scrollbar", i); Menu.AppendMenuItem(uiBio.sbarType != 2 || i < 7 ? MF_STRING : MF_GRAYED, Index, v); if (i == 2 || i == 5 || i == 6 || i == 9) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); if ( i == 6) Menu.CheckMenuItem(Index++, ppt.sbarWinMetrics); else Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.sbarShow); Menu.CheckMenuRadioItem(StartIndex + 3, StartIndex + 5, StartIndex + 3 + uiBio.sbarType); Menu.CheckMenuRadioItem(StartIndex + 7, StartIndex + 9, StartIndex + 7 + ppt.sbarButType); return Index;}
	const seekerTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [false, false, false, ppt.imgBarDots == 2, ppt.imgBarDots == 1, ppt.imgCounter], n = ["Hide", "Auto", "Show", "Bar", "Dots", "Counter"]; n.forEach((v, i) => {newMenuItem(Index, "Seeker", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); if (i > 2) Menu.CheckMenuItem(Index++, c[i]); else Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.imgBar); return Index;}
	const selectionTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Prefer Now Playing", "Follow Selected Track (Playlist)"]; n.forEach((v, i) => {newMenuItem(Index, "Selection", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + ppt.focus); return Index;}
	const serverTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; newMenuItem(Index, "Server", 0); if (shift && vkBio.k('ctrl')) {Menu.AppendMenuItem(MF_GRAYED, Index, "Biography Server"); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;} return Index;}
	const servTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Configure...", "Reset To Default"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 26); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); return Index;}
	const shadowTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artBorderImgOnly > 1, ppt.artBorderDual > 1, ppt.covBorderImgOnly > 1, ppt.covBorderDual > 1], g = [ppt.artReflImgOnly, ppt.artReflDual, ppt.covReflImgOnly, ppt.covReflDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Shadow", i); Menu.AppendMenuItem(!g[i] ? MF_STRING : MF_GRAYED, Index, v + (g[i] ? " N/A: Reflection Set" : "")); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const sort = data => data.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	const sourceHeadTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [false, false, false, ppt.sourceStyle == 1, ppt.sourceStyle == 2, ppt.sourceStyle == 3, ppt.sourceStyle == 16, ppt.sourceStyle == 18, false], n = ["Hide", "Auto", "Show", "Bold", "Italic", "Bold Italic", "SemiBold [Segoe UI]", "SemiBold Italic [Segoe UI]", "Subheading Text..."]; n.forEach((v, i) => {newMenuItem(Index, "SourceHead", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Index++; else Menu.CheckMenuItem(Index++, c[i]); if (i == 2 || i == 5 || i == 7) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.sourceHeading); return Index;}
	const stylesEditorTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Press CTRL to Alter Existing Styles", "Create New Style...", "Rename Custom Style...", "Delete Custom Style...", "Export Custom Style...", "Reset Style..."]; n.forEach((v, i) => {newMenuItem(Index, "Styles", i); Menu.AppendMenuItem(!i ? MF_GRAYED : i == 1 || ppt.style > 4 || i == 5 ? MF_STRING : MF_GRAYED, Index, v); Index++; if (!i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const styleTypeMenu = (Menu, StartIndex) => {style_arr = pBio.style_arr.slice(); let Index = StartIndex; style_arr.forEach((v, i) => {newMenuItem(Index, "Style", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); if (style_arr.length > 5 && i == style_arr.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); const CheckIndex = StartIndex + (ppt.sameStyle ? ppt.style : ppt.artistView ? ppt.bioStyle : ppt.revStyle), MaxIndex = StartIndex + style_arr.length - 1; if (CheckIndex <= MaxIndex) Menu.CheckMenuRadioItem(StartIndex, MaxIndex, CheckIndex); return Index;}
	const tagsTypeMenu = (Menu, StartIndex) => {let Index = StartIndex, tags = false; for (let i = 0; i < ln; i++) if (pBio.tag[i].enabled) {tags = true; break;} for (let i = 0; i < ln + 3; i++) {newMenuItem(Index, "Tags", i); Menu.AppendMenuItem(!i || i == ln + 1 && !tags ? MF_GRAYED : MF_STRING, Index, !i ? "Write Existing File Info to Tags: " : i == ln + 1 ? "Proceed" + (tags ? "" : " N/A No Tags Enabled") : i == ln + 2 ? "Cancel" : i == ln ? pBio.tag[i - 1].name + (pBio.tag[i - 1].enabled ? " (" + pBio.tag[i - 1].enabled + ")" : "") : pBio.tag[i - 1].name); if (i && i < ln + 1) Menu.CheckMenuItem(Index++, pBio.tag[i - 1].enabled); else Index++; if (!i || i == 5 || i == 9) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0)} return Index;}
	const themeTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [!ppt.blurDark && !ppt.blurBlend && !ppt.blurLight, ppt.blurDark, ppt.blurBlend, ppt.blurLight, ppt.covBlur, ppt.swapCol, ppt.summaryFirst], n = ["None", "Dark", "Blend", "Light", "Always Cover-Based", "Swap Colours", "Text: Summary First"]; n.forEach((v, i) 	=> {newMenuItem(Index, "Theme", i); Menu.AppendMenuItem(!uiBio.blur && i == 4 ? MF_GRAYED : MF_STRING, Index, v); if (i < 4) {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} else Menu.CheckMenuItem(Index++, c[i]); if (!i || i == 3  || i == 4 || i == 5) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const toggleTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ppt.artistView ? "Biography: Switch To " + (!ppt.allmusic_bio ? (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "AllMusic" + (ppt.bothBio ? " First" : "") : (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "Last.fm" + (ppt.bothBio ? " First" : "")) : "Review: Switch To " + (!ppt.allmusic_alb ? (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "AllMusic" + (ppt.bothRev ? " First" : "") : (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "Last.fm" + (ppt.bothRev ? " First" : "")); newMenuItem(Index, "Toggle", 0); Menu.AppendMenuItem(MF_STRING, Index, n); Index++; Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); return Index;}
	const trackHeadTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [false, false, false, ppt.trackStyle == 1, ppt.trackStyle == 2, ppt.trackStyle == 3, ppt.trackStyle == 16, ppt.trackStyle == 18, false], n = ["Hide", "Auto", "Show", "Bold", "Italic", "Bold Italic", "SemiBold [Segoe UI]", "SemiBold Italic [Segoe UI]", "Subheading Title Format..."]; n.forEach((v, i) => {newMenuItem(Index, "TrackHead", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Index++; else Menu.CheckMenuItem(Index++, c[i]); if (i == 2 || i == 5 || i == 7) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.trackHeading); return Index;}
	const webAlbumTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const artist = pBio.artists.length ? pBio.artists[0].name : name.artist(ppt.focus), c = [ppt.showTopAlbums, ppt.showAlbumHistory, ppt.autoLock], n = ["Show Top Albums", "Show Album History", "Auto Lock", "Reset Album History...", "Last.fm: " + artist + "...", "Last.fm: " + artist + ": Similar Artists...", "Last.fm: " + artist + ": Top Albums...", "AllMusic: " + artist + "..."]; n.forEach((v, i) => {newMenuItem(Index, "Web", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 1 || i == 2 || i == 3 || i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const webArtistTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const artist = pBio.artists.length ? pBio.artists[0].name : name.artist(ppt.focus), c = [ppt.showSimilarArtists, ppt.showMoreTags, ppt.showArtistHistory, ppt.autoLock], n = ["Show Similar Artists", "Show More Tags" + (uiBio.fontAwesomeInstalled ? " (Circle Button if Present)" : ""), "Show Artist History", "Auto Lock", "Reset Artist History...", "Last.fm: " + artist + "...", "Last.fm: " + artist + ": Similar Artists...", "Last.fm: " + artist + ": Top Albums...", "AllMusic: " + artist + "..."]; n.forEach((v, i) => {newMenuItem(Index, "Web", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 2 || i == 3 || i == 4 || i == 5) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}

	const blacklistImageMenu = (Menu, StartIndex) => {
		let blacklist = [], Index = StartIndex; bn = fb.ProfilePath + "yttm\\" + "blacklist_image.json";
		if (!sBio.file(bn)) sBio.save(bn, JSON.stringify({"blacklist":{}}), true); if (sBio.file(bn)) {b_n = imgArtist.clean().toLowerCase(); imgList = sBio.jsonParse(bn, false, 'file'); blacklist = imgList.blacklist[b_n] || [];}
		const n = [imgBlk ? "+ Add to Black List: " + imgArtist + "_" + imgName : "+ Add to Black List: " + (imgName ? "N/A - Requires Last.fm Artist Image. Selected Image : " + imgName : "N/A - No Image"), blacklist.length ? " - Remove from Black List (Click Name): " : "No Black Listed Images For Current Artist", "Undo"];
		for (let i = 0; i < 3; i++) {newMenuItem(Index, "ImageBlacklist", i); if (i < 2 || imgBio.undo[0] == b_n) Menu.AppendMenuItem(!i && imgBlk || i == 2 ? MF_STRING : MF_GRAYED, Index, n[i]); if (!i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;}
		blacklist.forEach((v, i) => {newMenuItem(Index, "ImageBlacklist", i + (imgBio.undo[0] == b_n ? 3 : 2)); Menu.AppendMenuItem(MF_STRING, Index, (imgArtist + "_" + v).replace(/&/g, "&&")); Index++;});
		return Index;
	}

	const images = v => (/_([a-z0-9]){32}\.jpg$/).test(sBio.fs.GetFileName(v));
	const mArtImg = (n1, n2, n3) => {const ns = $Bio.WshShell.Popup(popUpText(n2, n3), 0, popUpName, 1); if (ns != 1) return false; const handleList = fb.GetLibraryItems(); if (!handleList) return; const tf_a = FbTitleFormat(pBio.tf.a), sort = FbTitleFormat(pBio.tf.a + " | " + pBio.tf.l + " | [[%discnumber%.]%tracknumber%. ][%track artist% - ]" + pBio.tf.t); let a = "", a_o = "####", found = false, m = FbMetadbHandleList(); handleList.OrderByFormat(sort, 1); const artists = tf_a.EvalWithMetadbs(handleList); handleList.Convert().forEach((h, i) => {a = artists[i].toLowerCase(); if (a != a_o) {a_o = a; const pth = pBio.cleanPth(pBio.pth[n1], h, 'tag'); let files = utils.Glob(pth + "*"); files = files.some(images); if (a && !files) {found = false; m.Insert(m.Count, h);} else found = true;} else if (!found) m.Insert(m.Count, h);}); sendToPlaylist(m, n2, n3);}
	const mBio = (n1, n2, n3) => {const ns = $Bio.WshShell.Popup(popUpText(n2, n3), 0, popUpName, 1); if (ns != 1) return false; const handleList = fb.GetLibraryItems(); if (!handleList) return; const tf_a = FbTitleFormat(pBio.tf.a), sort = FbTitleFormat(pBio.tf.a + " | " + pBio.tf.l + " | [[%discnumber%.]%tracknumber%. ][%track artist% - ]" + pBio.tf.t); let a = "", a_o = "####", found = false, m = FbMetadbHandleList(); handleList.OrderByFormat(sort, 1); const artists = tf_a.EvalWithMetadbs(handleList); handleList.Convert().forEach((h, i) => {a = artists[i].toLowerCase(); if (a != a_o) {a_o = a; const pth = pBio.cleanPth(pBio.pth[n1], h, 'tag') + a.clean() + ".txt"; if (a && !sBio.file(pth)) {found = false; m.Insert(m.Count, h);} else found = true;} else if (!found) m.Insert(m.Count, h);}); sendToPlaylist(m, n2, n3);}
	const mRev = (n1, n2, n3) => {const ns = $Bio.WshShell.Popup(popUpText(n2, n3), 0, popUpName, 1); if (ns != 1) return false; const handleList = fb.GetLibraryItems(); if (!handleList) return; const tf_aa = FbTitleFormat(pBio.tf.aa), tf_l = FbTitleFormat(pBio.tf.l), sort = FbTitleFormat(pBio.tf.aa + " | " + pBio.tf.l + " | [[%discnumber%.]%tracknumber%. ][%track artist% - ]" + pBio.tf.t); let aa = "", aa_o = "####", l = "", l_o = "####", found = false, m = FbMetadbHandleList(); handleList.OrderByFormat(sort, 1); const albumartists = tf_aa.EvalWithMetadbs(handleList), albums = tf_l.EvalWithMetadbs(handleList); handleList.Convert().forEach((h, i) => {aa = albumartists[i].toLowerCase(); l = albums[i].toLowerCase(); if (!name.alb_strip) l = l.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim(); else l = l.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim(); if (aa + l != aa_o + l_o) {aa_o = aa; l_o = l; const pth = pBio.cleanPth(pBio.pth[n1], h, 'tag') + aa.clean() + " - " + l.clean() + ".txt"; if (aa && l && !sBio.file(pth)) {found = false; m.Insert(m.Count, h);} else found = true;} else if (!found) m.Insert(m.Count, h);}); sendToPlaylist(m, n2, n3);}
	const updImages = () => {if (!ppt.artistView) imgBio.clear_art_cache(); if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) imgBio.get_images(true); else imgBio.get_multi(pBio.art_ix, pBio.alb_ix, true);}

	this.fresh = () => {
		if (t.block() || !ppt.cycItem || pBio.zoom()) return;
		if (ppt.artistView) {
			this.bioCounter++; if (this.bioCounter < ppt.cycTimeItem) return; this.bioCounter = 0;
			if (pBio.artists.length < 2) return; this.wheel(1, true, false);
		}
		else {
			this.revCounter++; if (this.revCounter < ppt.cycTimeItem) return; this.revCounter = 0;
			if (pBio.albums.length < 2) return; this.wheel(1, true, false);
		}
	}

	this.playlists_changed = () => {if (!pl_show) return; pl_menu = []; for (let i = 0; i < plman.PlaylistCount; i++) pl_menu.push({name:plman.GetPlaylistName(i).replace(/&/g, "&&"), ix:i});}; this.playlists_changed();

	this.rbtn_up = (x, y) => {
		shift = vkBio.k('shift'); this.right_up = true; const popupMenu = ["alignMenu", "alignHMenu", "alignVMenu", "bioMenu", "biographyMenu", "blackImageMenu", "borderMenu", "checkMenu", "circMenu", "covMenu", "cropMenu", "headingMenu", "iconMenu", "imageMenu", "langMenu", "lfmRevMenu", "menu", "openMenu", "optionsMenu", "overlayMenu", "pasteMenu", "photoMenu", "reflMenu", "revMenu", "sbarMenu", "seekerMenu", "selectionMenu", "servMenu", "shadowMenu", "styleMenu", "stylesEditorMenu", "sourceHeadMenu", "tagsMenu", "themeMenu", "trackHeadMenu"]; let handles, imgInfo = imgBio.pth();
		popupMenu.forEach(v => this[v] = window.CreatePopupMenu()); let PlaylistsMenu; if (pl_show) PlaylistsMenu = window.CreatePopupMenu();
		amPth = ppt.artistView ? t.amBioPth() : t.amRevPth(); imgArtist = imgInfo.artist; imgPth = imgInfo.imgPth; imgBlk = imgInfo.blk && imgPth; imgName = imgBlk ? imgPth.slice(imgPth.lastIndexOf("_") + 1) : imgPth.slice(imgPth.lastIndexOf("\\") + 1); lfmPth = ppt.artistView ? t.lfmBioPth() : t.lfmRevPth(); tracksPth = t.lfmTrackPth(); pths = [imgPth, amPth[1], lfmPth[1], tracksPth[1]];
		const docTxt = sBio.doc.parentWindow.clipboardData.getData('text'); let idx, Index = 1;
		if (pBio.server) Index = serverTypeMenu(this.menu, Index);
		if (!ppt.img_only) Index = toggleTypeMenu(this.menu, Index);
		Index = modeTypeMenu(this.menu, Index);
		Index = biographyTypeMenu(this.biographyMenu, Index); this.biographyMenu.AppendTo(this.menu, MF_STRING, "Sources");
		Index = bioTypeMenu(this.bioMenu, Index); this.bioMenu.AppendTo(this.biographyMenu, MF_STRING, "Biography: " + (ppt.allmusic_bio ? !ppt.bothBio ? (!ppt.lockBio ? "Prefer " : "") + "AllMusic" : "Prefer Both" :  !ppt.bothBio ? (!ppt.lockBio ? "Prefer " : "") + "Last.fm" : "Prefer Both" ));
		Index = revTypeMenu(this.revMenu, Index); this.revMenu.AppendTo(this.biographyMenu, MF_STRING, "Review: " + (ppt.allmusic_alb ? !ppt.bothRev ? (!ppt.lockRev ? "Prefer " : "") + "AllMusic" : "Prefer Both" : !ppt.bothRev ? (!ppt.lockRev ? "Prefer " : "") + "Last.fm" : "Prefer Both")); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = lfmRevTypeMenu(this.lfmRevMenu, Index); this.lfmRevMenu.AppendTo(this.revMenu, MF_STRING, "Last.fm Type");
		Index = photoTypeMenu(this.photoMenu, Index); this.photoMenu.AppendTo(this.biographyMenu, MF_STRING, "Photo: " + (ppt.cycPhoto ? "Cycle" : "Artist"));
		Index = covTypeMenu(this.covMenu, Index); this.covMenu.AppendTo(this.biographyMenu, !pBio.alb_ix || ppt.artistView ? MF_STRING : MF_GRAYED, "Cover: " + (!pBio.alb_ix || ppt.artistView ? ppt.loadCovAllFb || ppt.loadCovFolder ? "Cycle" : cov_type_arr[ppt.covType] : "Front")); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = selectionTypeMenu(this.selectionMenu, Index); this.selectionMenu.AppendTo(this.biographyMenu, MF_STRING, "Selection Mode"); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = openTypeMenu(this.openMenu, Index); this.openMenu.AppendTo(this.biographyMenu, imgPth || amPth[3] || lfmPth[3] || tracksPth[3] ? MF_STRING : MF_GRAYED, "Open Containing Folder"); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		if (paste_show == 2 || paste_show && shift) {Index = pasteTypeMenu(this.pasteMenu, Index); this.pasteMenu.AppendTo(this.biographyMenu, docTxt && !ppt.img_only ? MF_STRING : MF_GRAYED, "Paste Text From Clipboard"); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);}
		Index = biogTypeMenu(this.biographyMenu, Index);
		Index = servTypeMenu(this.servMenu, Index); this.servMenu.AppendTo(this.biographyMenu, MF_STRING, "Server Settings..."); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = langTypeMenu(this.langMenu, Index); this.langMenu.AppendTo(this.biographyMenu, MF_STRING, "Last.fm Language");
		Index = styleTypeMenu(this.styleMenu, Index); this.styleMenu.AppendTo(this.menu, MF_STRING, "Layout");
		Index = stylesEditorTypeMenu(this.stylesEditorMenu, Index); this.stylesEditorMenu.AppendTo(this.styleMenu, MF_STRING, "Create && Manage Styles"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = headingTypeMenu(this.headingMenu, Index); this.headingMenu.AppendTo(this.styleMenu, MF_STRING, "Heading");
		Index = iconTypeMenu(this.iconMenu, Index); this.iconMenu.AppendTo(this.headingMenu, ppt.heading && !ppt.hdCenter ? MF_STRING : MF_GRAYED, "Button Style"); this.headingMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = headingFormatTypeMenu(this.headingMenu, Index); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = sourceHeadTypeMenu(this.sourceHeadMenu, Index); this.sourceHeadMenu.AppendTo(this.styleMenu, MF_STRING, "Subheading [Source]"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = trackHeadTypeMenu(this.trackHeadMenu, Index); this.trackHeadMenu.AppendTo(this.styleMenu, ppt.inclTrackRev ? MF_STRING : MF_GRAYED, "Subheading [Track Review]"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = sbarTypeMenu(this.sbarMenu, Index); this.sbarMenu.AppendTo(this.styleMenu, MF_STRING, "Scrollbar"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = themeTypeMenu(this.themeMenu, Index); this.themeMenu.AppendTo(this.styleMenu, MF_STRING, "Theme");
		Index = overlayTypeMenu(this.overlayMenu, Index); this.overlayMenu.AppendTo(this.themeMenu, ppt.style < 4 ? MF_GRAYED : MF_STRING, "Overlay Type"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = optionsTypeMenu(this.optionsMenu, Index); this.optionsMenu.AppendTo(this.styleMenu, MF_STRING, "Mode");
		Index = imageTypeMenu(this.imageMenu, Index); this.imageMenu.AppendTo(this.menu, MF_STRING, "Image");
		Index = seekerTypeMenu(this.seekerMenu, Index); this.seekerMenu.AppendTo(this.imageMenu, !imgBio.bar.disabled ? MF_STRING : MF_GRAYED, !imgBio.bar.disabled ? "Seeker && Counter" : "Seeker && Counter N/A with Current Overlay Metrics"); this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		if (ppt.style < 4) {Index = alignTypeMenu(this.alignMenu, Index); this.alignMenu.AppendTo(this.imageMenu, !ppt.img_only && t.text && !ppt.text_only ? MF_STRING : MF_GRAYED, "Alignment");}
		else {Index = alignHTypeMenu(this.alignHMenu, Index); this.alignHMenu.AppendTo(this.imageMenu, !ppt.img_only && t.text && !ppt.text_only ? MF_STRING : MF_GRAYED, "Alignment Horizontal"); Index = alignVTypeMenu(this.alignVMenu, Index); this.alignVMenu.AppendTo(this.imageMenu, !ppt.img_only && t.text && !ppt.text_only ? MF_STRING : MF_GRAYED, "Alignment Vertical");} this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = blacklistImageMenu(this.blackImageMenu, Index); this.blackImageMenu.AppendTo(this.imageMenu, MF_STRING, "Black List"); this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = circTypeMenu(this.circMenu, Index); this.circMenu.AppendTo(this.imageMenu, MF_STRING, "Circular");
		Index = cropTypeMenu(this.cropMenu, Index); this.cropMenu.AppendTo(this.imageMenu, MF_STRING, "Auto-Fill"); this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = reflTypeMenu(this.reflMenu, Index); this.reflMenu.AppendTo(this.imageMenu, MF_STRING, "Reflection");
		Index = borderTypeMenu(this.borderMenu, Index); this.borderMenu.AppendTo(this.imageMenu, MF_STRING, "Border");
		Index = shadowTypeMenu(this.shadowMenu, Index); this.shadowMenu.AppendTo(this.imageMenu, MF_STRING, "Shadow");
		if (pl_show == 2 || pl_show && shift) {this.menu.AppendMenuItem(MF_SEPARATOR, 0, 0); PlaylistsMenu.AppendTo(this.menu, MF_STRING, "Playlists"); const pl_me = [], pl_no = Math.ceil(pl_menu.length / 30); OrigIndex = Index; for (let j = 0; j < pl_no; j++) {pl_me[j] = window.CreatePopupMenu(); Index = playlistTypeMenu(j, pl_me[j], Index); pl_me[j].AppendTo(PlaylistsMenu, MF_STRING, "# " + (j * 30 + 1 +  " - " + Math.min(pl_menu.length, 30 + j * 30) + (30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? "  >>>" : "")));}}
		if (tags_show == 2 || tags_show && shift) {this.menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = tagsTypeMenu(this.tagsMenu, Index); handles = plman.GetPlaylistSelectedItems(plman.ActivePlaylist); this.tagsMenu.AppendTo(this.menu, handles.Count ? MF_STRING : MF_GRAYED, "Write Tags to Selected Tracks" + (handles.Count ? "" : ": N/A No Playlist Tracks Selected"));}
		if (check_show == 2 || check_show && shift) {this.menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = checkTypeMenu(this.checkMenu, Index); this.checkMenu.AppendTo(this.menu, MF_STRING, "Missing Data");}
		Index = defaultTypeMenu(this.menu, Index);

		idx = this.menu.TrackPopupMenu(x, y);
		if (idx >= 1 && idx <= Index) {
			const i = MenuMap[idx].value;
			switch (MenuMap[idx].type) {
				case "Toggle": t.toggle(ppt.artistView ? (!ppt.bothBio ? 0 : 6) : (!ppt.bothRev ? 1 : 7)); break;
				case "Mode": if (ppt.sameStyle) pBio.mode(i); else {ppt.artistView ? ppt.bioMode = i : ppt.revMode = i; t.toggle(8);} break;
				case "Sources":
					switch (i) {
						case 1: case 2: t.toggle(0); break; case 3: t.toggle(4); break; case 4: t.toggle(2); break; case 5: case 6: t.toggle(1); break; case 7: t.toggle(5); break; case 8: t.toggle(3); break;
						case 9: case 10: case 11: ppt.inclTrackRev = i - 9; pBio.inclTrackRev = ppt.inclTrackRev; if (ppt.inclTrackRev) servBio.chk_track({force: true, artist: pBio.artists.length ? pBio.artists[0].name : name.artist(ppt.focus), title: name.title(ppt.focus)}); t.toggle(9); break;
						case 12: case 13: ppt.cycPhoto = !ppt.cycPhoto; updImages(); break; case 14: ppt.cycPhotoLfmOnly = !ppt.cycPhotoLfmOnly; updImages(); break;
						case 15: case 16: case 17: case 18:  case 19:  ppt.covType = i - 15; imgBio.get_images(); break;
						case 20: imgBio.toggle('loadCovAllFb'); break;
						case 21: imgBio.toggle('loadCovFolder'); break;
						case 22: t.toggle(14); break;
						case 23: ppt.cycPic = !ppt.cycPic; break;
						case 24: pBio.setCycPic(); break;
						case 25: pBio.getData(1, ppt.focus, "force_update_bio", 0); break;
						case 26: {const open = (c, w) => {if (!sBio.run(c, w)) fb.ShowPopupMessage("Unable to launch your default text editor.", "Biography");}; open("\"" + pBio.bio_ini, 1); break;}
						case 27: {const ns = $Bio.WshShell.Popup("Reset server settings to default (biography.ini)\n\nOriginal will be backed up\n\nProceed?", 0, "Reset Server Settings", 1); if (ns != 1) return false; pBio.moveIni(true); window.Reload(); window.NotifyOthers("refresh_bio", "refresh_bio"); break;}
					}
					break;
				case "Selection": ppt.focus = !ppt.focus; pBio.changed(); t.on_playback_new_track(); imgBio.on_playback_new_track(); break;
				case "Open": sBio.browser('explorer /select,' + pths[i], false); break;
				case "Paste":
					switch (i) {
						case 0: {undoFo = amPth[0]; undoPth = amPth[1]; undoTxt = sBio.open(undoPth); sBio.buildPth(undoFo); sBio.save(undoPth, docTxt + "\r\n\r\nCustom " + (ppt.artistView ? "Biography" : "Review"), true); const amPth_n = ppt.artistView ? t.amBioPth() : t.amRevPth(); if (amPth[1] == amPth_n[1]) {ppt.artistView ? ppt.allmusic_bio = true : ppt.allmusic_alb = true;} window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab(); if (ppt.text_only) t.paint(); break;}
						case 1: {undoFo = lfmPth[0]; undoPth = lfmPth[1]; undoTxt = sBio.open(undoPth); sBio.buildPth(undoFo); sBio.save(undoPth, docTxt + "\r\n\r\nCustom " + (ppt.artistView ? "Biography" : "Review"), true); const lfmPth_n = ppt.artistView ? t.lfmBioPth() : t.lfmRevPth(); if (lfmPth[1] == lfmPth_n[1]) {ppt.artistView ? ppt.allmusic_bio = false: ppt.allmusic_alb = false;} window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab(); if (ppt.text_only) t.paint(); break;}
						case 2: {const open = (c, w) => {if (!sBio.run(c, w)) fb.ShowPopupMessage("Unable to launch your default text editor.", "Biography");}; open("\"" + undoPth, 1); break;}
						case 3: if (!undoTxt.length && sBio.file(undoPth)) {sBio.fs.DeleteFile(undoPth); window.NotifyOthers("reload_bio", "reload_bio"); if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) window.Reload(); else {t.artistFlush(); t.albumFlush(); t.grab(); if (ppt.text_only) t.paint();} break;} sBio.buildPth(undoFo); sBio.save(undoPth, undoTxt, true); undoTxt = "#!#"; window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab(); if (ppt.text_only) t.paint(); break;} break;
				case "Language": pBio.lfmLang_ix = i; pBio.updIniLang(pBio.langArr[pBio.lfmLang_ix]); pBio.lfmLang = pBio.langArr[pBio.lfmLang_ix].toLowerCase(); pBio.server = true; window.NotifyOthers("not_server_bio", 0); if (pBio.server) {servBio.setLfm(pBio.lfmLang); pBio.getData(2, ppt.focus, "", 1); window.NotifyOthers("refresh_bio", "refresh_bio");} break;
				case "Style":
					switch (true) {
						case ppt.sameStyle: if (i < 5) ppt.style = i; else ppt.style = i; break;
						case ppt.artistView: if (i < 5) ppt.bioStyle = i; else ppt.bioStyle = i; break;
						case !ppt.artistView: if (i < 5) ppt.revStyle = i; else ppt.revStyle = i; break;
					}
					t.toggle(8);
					break;
				case "Overlay": ppt.overlayStyle = i; window.Reload(); break;
				case "Styles": switch (i) {case 1: pBio.createStyle(); break; case 2: pBio.renameStyle(ppt.style); break; case 3: pBio.deleteStyle(ppt.style); break; case 4: pBio.exportStyle(ppt.style); break; case 5: pBio.resetStyle(ppt.style); break;} break;
				case "Heading":
					switch (i) {
						case 0: ppt.heading = !ppt.heading; t.toggle(9); break;
						case 1: case 2: ppt.hdRight = i - 1; if (ppt.src) !ppt.hdRight ? ppt.src = 2 : ppt.src = 1; ppt.hdCenter = false; t.toggle(9); break;
						case 3: ppt.hdCenter = !ppt.hdCenter; t.toggle(9); break;
						case 4: ppt.fullWidthHeading = !ppt.fullWidthHeading; t.toggle(9); break;
						case 5: !ppt.hdRight ? (ppt.src ? ppt.src = 0 : ppt.src = 2) : (ppt.src ? ppt.src = 0 : ppt.src = 1); t.toggle(9); break;
						case 6: case 7: ppt.hdLine = ppt.hdLine == i - 5 ? 0 : i - 5; t.toggle(10); break;
						case 8: if (!uiBio.custHeadFont) {ppt.headFontStyle = ppt.headFontStyle == 1 ? 0 : 1; t.toggle(12);} else window.ShowProperties(); break;
						case 9: if (!uiBio.custHeadFont) {ppt.headFontStyle = ppt.headFontStyle == 2 ? 0 : 2; t.toggle(12);} else window.ShowProperties(); break;
						case 10: ppt.headFontStyle = ppt.headFontStyle == 3 ? 0 : 3; t.toggle(12); break;
						case 11: ppt.headFontStyle = ppt.headFontStyle == 16 ? 0 : 16; t.toggle(12); break;
						case 12: ppt.headFontStyle = ppt.headFontStyle == 18 ? 0 : 18; t.toggle(12); break;
						case 13: window.ShowProperties(); break;
					}
					break;
				case "Icon":
					switch (i) {
						case 0: uiBio.BtnName = 0; break;
						case 1: case 2: uiBio.BtnName = 1; ppt.btnIcon = i - 1; break;
						case 3: uiBio.BtnBg = uiBio.BtnBg ? 0 : 1; break;
					}
					ppt.show = `BtnBg,${uiBio.BtnBg},BtnName,${uiBio.BtnName},BtnRedLastfm,${uiBio.lfmTheme},Text,${uiBio.headText}`;
					t.toggle(9);
					break;
				case "SourceHead": switch (i) {case 3: ppt.sourceStyle = ppt.sourceStyle == 1 ? 0 : 1; t.toggle(12); break; case 4: ppt.sourceStyle = ppt.sourceStyle == 2 ? 0 : 2; t.toggle(12); break; case 5: ppt.sourceStyle = ppt.sourceStyle == 3 ? 0 : 3; t.toggle(12); break; case 6: ppt.sourceStyle = ppt.sourceStyle == 16 ? 0 : 16; t.toggle(12); break; case 7: ppt.sourceStyle = ppt.sourceStyle == 18 ? 0 : 18; t.toggle(12); break; case 8: window.ShowProperties(); break; default: ppt.sourceHeading = i; t.toggle(11); break;} break;
				case "TrackHead": switch (i) {case 3: ppt.trackStyle = ppt.trackStyle == 1 ? 0 : 1; t.toggle(12); break; case 4: ppt.trackStyle = ppt.trackStyle == 2 ? 0 : 2; t.toggle(12); break; case 5: ppt.trackStyle = ppt.trackStyle == 3 ? 0 : 3; t.toggle(12); break; case 6: ppt.trackStyle = ppt.trackStyle == 16 ? 0 : 16; t.toggle(12); break; case 7: ppt.trackStyle = ppt.trackStyle == 18 ? 0 : 18; t.toggle(12); break; case 8: window.ShowProperties(); break; default: ppt.trackHeading = i; t.toggle(11); break;} break;
				case "Theme":
					switch (true) {
						case (i < 4): uiBio.chgBlur(i); initBiographyColors(); break;
						case (i == 4): ppt.covBlur = !ppt.covBlur; on_colours_changed(true); break;
						case (i == 5): {ppt.swapCol = !ppt.swapCol; on_colours_changed(true); break;}
						default: {ppt.summaryFirst = !ppt.summaryFirst; t.toggle(9); break;}
					}
					break;
				case "Scrollbar":
					switch (i) {
						case 0: case 1: case 2: uiBio.set('scrollbar', i); break;
						case 3: case 4: case 5: uiBio.set('sbarType', i - 3); break;
						case 6: uiBio.set('sbarMetrics'); break;
						case 7: case 8: case 9: uiBio.set('sbarButType', i - 7); break;
						case 10: window.ShowProperties(); break;
					}
					break;
				case "Options":
					switch (i) {
						case 0: ppt.sameStyle = !ppt.sameStyle; t.toggle(8); break;
						case 1: pBio.imgText = !pBio.imgText; ppt.imgText = !pBio.imgText; t.toggle(8); break;
						case 2: ppt.smooth = !ppt.smooth; break;
						case 3: ppt.touchControl = !ppt.touchControl; break;
						case 4: pBio.dblClick = !pBio.dblClick ? 1 : 0; pBio.updIniClickAction(pBio.dblClick); break;
						case 5: window.ShowProperties(); break;
						case 6: uiBio.set('lineSpacing'); break;
						case 7: butBio.resetZoom(); break;
						case 8: window.Reload(); break;
					}
				break;
				case "Image": switch (i) {case 0: ppt.autoEnlarge = !ppt.autoEnlarge; break; case 1: ppt.imgSmoothTrans = !ppt.imgSmoothTrans; if (uiBio.blur) {imgBio.clear_rs_cache(); imgBio.get_images();} break;} break;
				case "Seeker":
					switch (i) {
						case 0: case 1: case 2: ppt.imgBar = i; imgBio.bar.show = !ppt.artistView && pBio.alb_ix || ppt.imgBar != 2 ? false : true; break;
						case 3: ppt.imgBarDots = ppt.imgBarDots == 2 ? 0 : 2; break;
						case 4: ppt.imgBarDots = ppt.imgBarDots == 1 ? 0 : 1; break;
						case 5: ppt.imgCounter = !ppt.imgCounter; break;
					}
					imgBio.clear_rs_cache(); imgBio.get_images(); break;
				case "Align":switch (i) {case 3: ppt.textAlign = !ppt.textAlign; pBio.sizes(); imgBio.clear_rs_cache(); imgBio.get_images(); break; default: if (ppt.style == 0 || ppt.style == 2) ppt.alignH = i; else ppt.alignV = i; imgBio.clear_rs_cache(); imgBio.get_images(); break;} break;
				case "alignH": ppt.alignH = i; imgBio.clear_rs_cache(); imgBio.get_images(); break;
				case "AlignV": switch (i) {case 3: ppt.alignAuto = true; pBio.sizes(); imgBio.clear_rs_cache(); imgBio.get_images(); break; default: ppt.alignV = i; ppt.alignAuto = false; pBio.sizes(); imgBio.clear_rs_cache(); imgBio.get_images(); break;} break;
				case "ImageBlacklist": {
					if (!i) {
						if (!imgList.blacklist[b_n]) imgList.blacklist[b_n] = []; imgList.blacklist[b_n].push(imgName);
					}
					else if (imgBio.undo[0] == b_n && i == 2) {
						if (!imgList.blacklist[imgBio.undo[0]]) imgList.blacklist[b_n] = []; if (imgBio.undo[1].length) imgList.blacklist[imgBio.undo[0]].push(imgBio.undo[1]); imgBio.undo = [];
					}
					else {
						const bl_ind = i - (imgBio.undo[0] == b_n ? 3 : 2); imgBio.undo = [b_n, imgList.blacklist[b_n][bl_ind]]; imgList.blacklist[b_n].splice(bl_ind, 1); sBio.removeNulls(imgList);
					}
					let bl = imgList.blacklist[b_n]; if (bl) imgList.blacklist[b_n] = sort([...new Set(bl)]); imgBio.blkArtist = ""; sBio.save(bn, JSON.stringify({"blacklist": sBio.sortKeys(imgList.blacklist)}, null, 3), true);
					imgBio.chkArtImg(); window.NotifyOthers("blacklist_bio", "blacklist_bio");
					break;
				}
				case "Circular":
					switch (i) {
						case 0: ppt.artCircImgOnly = !ppt.artCircImgOnly; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images(); break;
						case 1: ppt.artCircDual = !ppt.artCircDual; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images(); break;
						case 2: ppt.covCircImgOnly = !ppt.covCircImgOnly; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images();  break;
						case 3: ppt.covCircDual = !ppt.covCircDual; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images(); break;
					}
					break;
				case "Crop":
					switch (i) {
						case 0: ppt.artCropImgOnly = !ppt.artCropImgOnly; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images(); break;
						case 1: ppt.artCropDual = !ppt.artCropDual; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images(); break;
						case 2: ppt.covCropImgOnly = !ppt.covCropImgOnly; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images();  break;
						case 3: ppt.covCropDual = !ppt.covCropDual; imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images(); break;
					}
					break;
				case "Reflection":
					switch (i) {
						case 0: ppt.artReflImgOnly = !ppt.artReflImgOnly; break;
						case 1: ppt.artReflDual = !ppt.artReflDual; break;
						case 2: ppt.covReflImgOnly = !ppt.covReflImgOnly; break;
						case 3: ppt.covReflDual = !ppt.covReflDual; break;
						default: ppt.imgReflType = i - 4; break;
					}
					imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images();
					break;
				case "Border":
					switch (i) {
						case 0: ppt.artBorderImgOnly = ppt.artBorderImgOnly == 0 ? 1 : ppt.artBorderImgOnly == 1 ? 0 : ppt.artBorderImgOnly == 2 ? 3 : 2; break;
						case 1: ppt.artBorderDual = ppt.artBorderDual == 0 ? 1 : ppt.artBorderDual == 1 ? 0 : ppt.artBorderDual == 2 ? 3 : 2; break;
						case 2: ppt.covBorderImgOnly = ppt.covBorderImgOnly == 0 ? 1 : ppt.covBorderImgOnly == 1 ? 0 : ppt.covBorderImgOnly == 2 ? 3 : 2; break;
						case 3: ppt.covBorderDual = ppt.covBorderDual == 0 ? 1 : ppt.covBorderDual == 1 ? 0 : ppt.covBorderDual == 2 ? 3 : 2; break;
					}
					imgBio.create_images(); imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images();
					break;
				case "Shadow":
					switch (i) {
						case 0: ppt.artBorderImgOnly = ppt.artBorderImgOnly == 0 ? 2 : ppt.artBorderImgOnly == 1 ? 3 : ppt.artBorderImgOnly == 2 ? 0 : 1; break;
						case 1: ppt.artBorderDual = ppt.artBorderDual == 0 ? 2 : ppt.artBorderDual == 1 ? 3 : ppt.artBorderDual == 2 ? 0 : 1; break;
						case 2: ppt.covBorderImgOnly = ppt.covBorderImgOnly == 0 ? 2 : ppt.covBorderImgOnly == 1 ? 3 : ppt.covBorderImgOnly == 2 ? 0 : 1; break;
						case 3: ppt.covBorderDual = ppt.covBorderDual == 0 ? 2 : ppt.covBorderDual == 1 ? 3 : ppt.covBorderDual == 2 ? 0 : 1; break;
					}
					imgBio.setCrop(true); imgBio.clear_rs_cache(); imgBio.get_images();
					break;
				case "Tags": if (i && i < ln) {pBio.tag[i - 1].enabled = pBio.tag[i - 1].enabled ? 0 : 1; pBio.updIniTag(i - 1);} if (i == ln) pBio.setSimTagNo(); if (i == ln + 1) {if (pBio.tag[8].enabled && pBio.tag[8].enabled < 7) tagBio.check(handles); else tagBio.write_tags(handles);} break;
				case "Playlists": plman.ActivePlaylist = pl_menu[i].ix; break;
				case "Check":
					switch (i) {
						case 0: mRev('amRev', 'AllMusic', 'Album Review'); break;
						case 1: mRev('lfmRev', 'Last.fm', 'Album Review'); break;
						case 2: mBio('amBio', 'AllMusic', 'Biography'); break;
						case 3: mBio('lfmBio', 'Last.fm', 'Biography'); break;
						case 4: mArtImg('imgArt', 'Last.fm', 'Artist Image'); break;
					}
					break;
				case "Default": switch (i) {case 0: shift ? pBio.inactivate() : window.ShowProperties(); break; case 1: window.ShowProperties(); break; case 2: window.ShowConfigure(); break;}
			}
		} this.right_up = false;
	}

	this.activate = (x, y) => {
		const menu = window.CreatePopupMenu(); let idx, Index = 1; Index = defaultTypeMenu(menu, Index);
		idx = menu.TrackPopupMenu(x, y);
		if (idx >= 1 && idx <= Index) {
			switch (MenuMap[idx].value) {case 0: pBio.inactivate(); break; case 1: window.ShowProperties(); break; case 2: window.ShowConfigure(); break;}
		}
	}

	this.button = (x, y) => {
		const menu = window.CreatePopupMenu(), WebMenu = window.CreatePopupMenu(); let idx, Index = 1; Index = ppt.artistView ? moreArtMenu(menu, Index) : moreAlbMenu(menu, Index); menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = ppt.artistView ? webArtistTypeMenu(WebMenu, Index) : webAlbumTypeMenu(WebMenu, Index); WebMenu.AppendTo(menu, MF_STRING, "More...");
		const origArr = JSON.stringify(pBio.artists), origArrl = JSON.stringify(pBio.albums);
		idx = menu.TrackPopupMenu(x = ww / 2 - ppt.borR, y = pBio.text_t - uiBio.heading_h);
		if (idx >= 1 && idx <= Index) {
			const i = MenuMap[idx].value;
			switch (MenuMap[idx].type) {
				case "More-Artist":
					switch (true) {
						case i < pBio.artists.length: if (origArr != JSON.stringify(pBio.artists) || !i && !pBio.art_ix || pBio.art_ix == i) break;
							t.logScrollPos(); pBio.art_ix = i; imgBio.get = false; t.get = 0;
							t.get_multi(false, pBio.art_ix, pBio.alb_ix); t.getScrollPos(); imgBio.get_multi(pBio.art_ix, pBio.alb_ix); pBio.getData(false, ppt.focus, "multi_tag_bio", 0);
							if (ppt.autoLock) pBio.mbtn_up(1, 1, true);
							if (pBio.artists[pBio.art_ix].type.includes("history")) break;
							pBio.logArtistHistory(pBio.artists[pBio.art_ix].name);
							pBio.get_multi();
							break;
						case i == pBio.artists.length + 1: ppt.cycItem = !ppt.cycItem; break;
						case i == pBio.artists.length + 2: pBio.setCycItem(); break;
						case i == pBio.artists.length + 3: window.Reload(); break;
					}
					this.bioCounter = 0;
					break;
				case "More-Album":
					switch (true) {
						case i < pBio.albums.length: {
						if (origArrl != JSON.stringify(pBio.albums) || !i && !pBio.alb_ix || pBio.alb_ix == i) break;
							t.logScrollPos(); pBio.alb_ix = i; imgBio.get = false; t.get = 0; let force = false; pBio.inclTrackRev = ppt.inclTrackRev;
							if (ppt.showAlbumHistory && ppt.inclTrackRev) {
								if (pBio.albums[pBio.alb_ix].type.includes("history")) pBio.inclTrackRev = 0;
								t.albumFlush(); force = true;
							}
							t.get_multi(false, pBio.art_ix, pBio.alb_ix, force); t.getScrollPos(); imgBio.get_multi(pBio.art_ix, pBio.alb_ix); pBio.getData(false, ppt.focus, "multi_tag_bio", 0);
							if (ppt.autoLock) pBio.mbtn_up(1, 1, true);
							if (pBio.albums[pBio.alb_ix].type.includes("history")) break;
							pBio.logAlbumHistory(pBio.albums[pBio.alb_ix].artist, pBio.albums[pBio.alb_ix].album); pBio.get_multi();
							break;
						}
						case i == pBio.albums.length + 1: ppt.cycItem = !ppt.cycItem; break;
						case i == pBio.albums.length + 2: pBio.setCycItem(); break;
						case i == pBio.albums.length + 3: window.Reload(); break;
					}
					this.revCounter = 0;
					break;
				case "Web":
					switch (true) {
						case ppt.artistView:
							switch (i) {
								case 0: pBio.art_ix = 0; ppt.showSimilarArtists = !ppt.showSimilarArtists; pBio.get_multi(!ppt.showSimilarArtists ? true : false); break;
								case 1: pBio.art_ix = 0; ppt.showMoreTags = !ppt.showMoreTags; pBio.get_multi(!ppt.showMoreTags ? true : false); break;
								case 2: pBio.art_ix = 0; ppt.showArtistHistory = !ppt.showArtistHistory; pBio.get_multi(!ppt.showArtistHistory ? true : false); break;
								case 3: ppt.autoLock = !ppt.autoLock; break;
								case 4: pBio.resetArtistHistory(); break;
								default: {const artist = pBio.artists.length ? pBio.artists[0].name : name.artist(ppt.focus), brArr = ["", "/+similar", "/+albums"]; if (i < 8) sBio.browser("https://" + "www.last.fm/" + (pBio.lfmLang == "en" ? "" : pBio.lfmLang + "/") + "music/" + encodeURIComponent(artist) + brArr[i - 5], true); else sBio.browser("https://www.allmusic.com/search/artists/" + encodeURIComponent(artist), true); break;}
							}
							if (i < 5) {
								t.logScrollPos(); imgBio.get = false; t.get = 0;
								t.get_multi(false, pBio.art_ix, pBio.alb_ix); t.getScrollPos(); imgBio.get_multi(pBio.art_ix, pBio.alb_ix); pBio.getData(false, ppt.focus, "multi_tag_bio", 0);
							}
							break;
						case !ppt.artistView:
							switch (i) {
								case 0: pBio.alb_ix = 0; ppt.showTopAlbums = !ppt.showTopAlbums; pBio.get_multi(!ppt.showTopAlbums ? true : false); break;
								case 1: pBio.alb_ix = 0; ppt.showAlbumHistory = !ppt.showAlbumHistory; pBio.get_multi(!ppt.showAlbumHistory ? true : false); break;
								case 2: ppt.autoLock = !ppt.autoLock; break;
								case 3: pBio.resetAlbumHistory(); break;
								default: {const artist = pBio.artists.length ? pBio.artists[0].name : name.artist(ppt.focus), brArr = ["", "/+similar", "/+albums"]; if (i < 7) sBio.browser("https://" + "www.last.fm/" + (pBio.lfmLang == "en" ? "" : pBio.lfmLang + "/") + "music/" + encodeURIComponent(artist) + brArr[i - 4], true); else sBio.browser("https://www.allmusic.com/search/artists/" + encodeURIComponent(artist), true); break;}
							}
							if (i < 4) {
								t.logScrollPos(); imgBio.get = false; t.get = 0; pBio.inclTrackRev = ppt.inclTrackRev;
								if (ppt.inclTrackRev) {
									if (pBio.albums[pBio.alb_ix].type.includes("history")) pBio.inclTrackRev = 0;
									t.albumFlush();
								}
								t.get_multi(false, pBio.art_ix, pBio.alb_ix, true); t.getScrollPos(); imgBio.get_multi(pBio.art_ix, pBio.alb_ix); pBio.getData(false, ppt.focus, "multi_tag_bio", 0);
							}
							break;
				}
			}
		}
	}

	this.wheel = (step, resetCounters) => {
		let i = 0; butBio.clear_tooltip(); let force = false;
		switch (true) {
			case ppt.artistView:
				if (!pBio.artistsUniq.length) break; for (i = 0; i < pBio.artistsUniq.length; i++) if (!pBio.art_ix && name.artist(ppt.focus) == pBio.artistsUniq[i].name || pBio.art_ix == pBio.artistsUniq[i].ix) break;
				i += step; if (i < 0) i = pBio.artistsUniq.length - 1; else if (i >= pBio.artistsUniq.length) i = 0; t.logScrollPos(); pBio.art_ix = pBio.artistsUniq[i].ix;
				if (pBio.artists[pBio.art_ix].type.includes("history")) break; pBio.logArtistHistory(pBio.artists[pBio.art_ix].name); pBio.get_multi(); break;
			case !ppt.artistView:
				if (!pBio.albumsUniq.length) break; for (i = 0; i < pBio.albumsUniq.length; i++) if (!pBio.alb_ix && name.alb_artist(ppt.focus) + " - " +  name.album(ppt.focus) == pBio.albumsUniq[i].artist + " - " + pBio.albumsUniq[i].album || pBio.alb_ix == pBio.albumsUniq[i].ix) break;
				i += step; if (i < 0) i = pBio.albumsUniq.length - 1; else if (i >= pBio.albumsUniq.length) i = 0; t.logScrollPos(); pBio.alb_ix = pBio.albumsUniq[i].ix; if (pBio.alb_ix) imgBio.bar.show = false;
				if (ppt.showAlbumHistory && ppt.inclTrackRev) {
					pBio.inclTrackRev = ppt.inclTrackRev;
					if (pBio.albums[pBio.alb_ix].type.includes("history")) pBio.inclTrackRev = 0;
					t.albumFlush(); force = true;
				}
				if (pBio.albums[pBio.alb_ix].type.includes("history")) break; pBio.logAlbumHistory(pBio.albums[pBio.alb_ix].artist, pBio.albums[pBio.alb_ix].album); pBio.get_multi();
				break;
		} imgBio.get = false; t.get_multi(false, pBio.art_ix, pBio.alb_ix, force); t.getScrollPos(); imgBio.get_multi(pBio.art_ix, pBio.alb_ix); pBio.multi_serv(); if (resetCounters) ppt.artistView ? this.bioCounter = 0 : this.revCounter = 0;
	}
}

function Text() {
	this.x; this.y; this.w; this.h;
	const amBioSubHead = ppt.amBioSubHead.split("|"), amRevSubHead = ppt.amRevSubHead.split("|"), lfmBioSubHead = ppt.lfmBioSubHead.split("|"), lfmRevSubHead = ppt.lfmRevSubHead.split("|");
	const bioFallbackText = ppt.bioFallbackText.split("|"), revFallbackText = ppt.revFallbackText.split("|");
	const DT_CENTER = 0x00000001, DT_RIGHT = 0x00000002, DT_VCENTER = 0x00000004, DT_SINGLELINE = 0x00000020, DT_CALCRECT = 0x00000400, DT_NOPREFIX = 0x00000800, DT_WORD_ELLIPSIS = 0x00040000, extra_y = Math.round(Math.max(1, uiBio.font_h * 0.05));
	const d = {ax1: 0, ax2: 0, aB1: false, aB2: false, aR1: false, aR2: false, bothB_ix: -1, bothR_ix: -1, lB1: false, lB2: false, lR1: false, lR2: false, lx1: 0, lx2: 0, w: []}
	const done = {amBio: false, amRev: false,  lfmBio: false, lfmRev: false}
	const id = {alb: "", alb_o: "", album: "", album_o: "",   tr: "", tr_o: ""}
	const mod = {amBio: "", amBio_o: "", amRev: "", amRev_o: "", lfmBio: "", lfmBio_o: "", lfmRev: "", lfmRev_o: ""}
	const popNow = "Popular Now: |Beliebt Jetzt: |Popular Ahora: |Populaire Maintenant: |Popolare Ora: |今人気: |Popularne Teraz: |Popular Agora: |Популярные сейчас: |Populär Nu: |ŞImdi Popüler: |热门 现在";
	const releaseDate = "Release Date: |Veröffentlichungsdatum: |Fecha De Lanzamiento: |Date De Sortie: |Data Di Pubblicazione: |リリース日: |Data Wydania: |Data De Lançamento: |Дата релиза: |Utgivningsdatum: |Yayınlanma Tarihi: |发布日期: ";
	const topTags = ["Tags", "Tags", "Tags", "Tags", "Tag", "タグ", "Tagi", "Tags", "Теги", "Taggar", "Etiketler", "标签"];
	const yrsActive = "Years Active: |Jahre aktiv: |Años de actividad: |Années d'activité: |Anni di attività: |活動期間: |Lata aktywności: |Anos de atividade: |Активность \\(лет\\): |År aktiv: |Aktif yıllar: |活跃年份: |Born: |Geburtstag: |Fecha de nacimiento: |Né\\(e\\) le: |Data di nascita: |生年月日: |Urodzony: |Data de nascimento: |Год рождения: |Född: |Doğum tarihi: |出生";
	let alb_inf = "", alb_txt_arr = [], alb_txt_o = "", album = "", albumartist = "", amBio = "", amRev = "", art_txt_arr = [], art_txt_o = "", artist = "", artist_o = "", bioSubHead = 0, calc = true, checkedTrackSubHead = true, init = true, initialise = true, lfmBio = "", lfmRev = "", new_text = false, revSubHead = 0, scrollBioPos = {}, scrollRevPos = {}, showTrackHead = true, textUpdate = 0, track = "", trackartist = "";
	this.alb_allmusic = true; this.alb_txt = ""; this.art_txt = ""; this.avgRating = -1; this.bio_allmusic = false; this.btnBioBoth = 0; this.btnRevBoth = 0; this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS; this.get = 1; this.head = true; this.heading = ""; this.l = DT_NOPREFIX; this.lfmRating = -1; const lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS, rc = DT_RIGHT | + lc; this.c = [lc, rc]; this.ccc = DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS; this.mulAlbum = false; this.mulArtist = false; this.na = ""; this.amRating = -1; this.rp = true; this.text = ""; ppt.sourceHeading = sBio.clamp(ppt.sourceHeading, 0, 2); ppt.trackHeading = sBio.clamp(ppt.trackHeading, 0, 2);

	const getTxtFallback = () => {if (this.scrollbar_type().draw_timer) return; if (!pBio.multi_new()) return; if (!this.get && !textUpdate) return; this.na = ""; if (textUpdate) updText(); if (this.get) {this.album_reset(); this.artist_reset(); if (calc) calc = ppt.artistView ? 1 : 2; this.getText(calc); if (this.get == 2) pBio.focus_serv(); calc = false; this.get = 0;}}
	const halt = () => pBio.w <= 10 || pBio.h <= 10;
	const updText = () => {this.getText(false, true); imgBio.getArtImg(); imgBio.getFbImg(); textUpdate = 0; done.amBio = done.lfmBio = done.amRev = done.lfmRev = false;}
	const updTrackSubHead = () => {if (ppt.artistView || pBio.inclTrackRev != 2 || checkedTrackSubHead || !showTrackHead || !ppt.bothRev || !amRev) return false; mod.amRev = amRev = lfmRev = mod.lfmRev = ""; mod.amRev_o = mod.lfmRev_o = "1"; done.amRev = done.lfmRev = false; checkedTrackSubHead = true; return true;}

	this.albumFlush = () => {this.text = false; mod.amRev = amRev = lfmRev = mod.lfmRev = ""; mod.amRev_o = mod.lfmRev_o = "1"; checkedTrackSubHead = done.amRev = done.lfmRev = false; this.alb_txt = ""; this.head = false; butBio.set_scroll_btns_hide(); butBio.set_src_btn_hide();}
	this.amBioPth = () => {if (ppt.img_only) return ["", "", false, false]; return pBio.getPth('bio', ppt.focus, artist, "", "", pBio.sup.Cache, artist.clean(), "", "", 'amBio', false);}
	this.amRevPth = () => {if (ppt.img_only) return ["", "", false, false]; return pBio.getPth('rev', ppt.focus, artist, album, "", pBio.sup.Cache, artist.clean(), albumartist.clean(), album.clean(), 'amRev', false);}
	this.artistFlush = () => {this.text = false; done.amBio = done.lfmBio = false; mod.amBio = amBio = mod.lfmBio = lfmBio = ""; mod.amBio_o = mod.lfmBio_o = "1"; this.art_txt = ""; this.head = false; butBio.set_scroll_btns_hide(); butBio.set_src_btn_hide();}
	this.album_reset = upd => {if (pBio.lock) return; id.album_o = id.album; id.album = name.albID(ppt.focus, 'simple'); const new_album = id.album != id.album_o; if (new_album) id.alb = ""; if (new_album || upd) {album = name.album(ppt.focus); albumartist = name.alb_artist(ppt.focus); this.albumFlush(); this.mulAlbum = false;} if (pBio.inclTrackRev) {id.tr_o = id.tr; id.tr = name.trackID(ppt.focus); const new_track = id.tr != id.tr_o; if (new_track) {checkedTrackSubHead = done.amRev = done.lfmRev = false; if (pBio.inclTrackRev == 1) this.logScrollPos('rev');}}}
	this.artist_reset = upd => {if (pBio.artistsSame() || pBio.lock) return; artist_o = artist; artist = name.artist(ppt.focus); const new_artist = artist != artist_o; if (new_artist || upd) {this.mulArtist = false; this.artistFlush();}}
	this.get_multi = (p_calc, art_ix, alb_ix, force) => {if (ppt.img_only) return; switch (true) {case ppt.artistView: {artist_o = artist; artist = art_ix < pBio.artists.length ? pBio.artists[art_ix].name : name.artist(ppt.focus); const new_artist = artist != artist_o; if (new_artist) {this.artistFlush(); pBio.art_ix = art_ix; this.mulArtist = true;} this.getText(p_calc); this.get = 0; break;} case !ppt.artistView: {id.alb_o = id.alb; artist = alb_ix < pBio.albums.length ? pBio.albums[alb_ix].artist : name.alb_artist(ppt.focus); const alb = alb_ix < pBio.albums.length ? pBio.albums[alb_ix].album : name.album(ppt.focus); id.alb = artist + alb; const new_album = id.alb != id.alb_o; if (new_album || force) {album = alb; albumartist = artist; this.albumFlush(); this.mulAlbum = true;} this.getText(p_calc); this.get = 0; break;}}}
	this.block = () => halt() || !window.IsVisible;
	this.get_widths = () => {sBio.gr(1, 1, false, g => d.w = [" ", amBioSubHead[0] + " ", lfmBioSubHead[0] + " ", amRevSubHead[0] + " ", lfmRevSubHead[0] + " ", amBioSubHead[1] + " ", lfmBioSubHead[1] + " ", amRevSubHead[1] + " ", lfmRevSubHead[1] + " "].map(v => Math.max(g.CalcTextWidth(v, uiBio.sourceFont), 1)));}
	this.grab = () => {textUpdate = 1; if (this.block()) return; updText();}
	this.headingID = () => ppt.artistView + "-" + pBio.art_ix + "-" + pBio.alb_ix + "-" + ppt.allmusic_bio + "-" + ppt.allmusic_alb + "-" + pBio.inclTrackRev;
	this.lfmBioPth = () => {if (ppt.img_only) return ["", "", false, false]; return pBio.getPth('bio', ppt.focus, artist, "", "", pBio.sup.Cache, artist.clean(), "", "", 'lfmBio', false);}
	this.lfmRevPth = () => {if (ppt.img_only) return ["", "", false, false]; return pBio.getPth('rev', ppt.focus, artist, album, "", pBio.sup.Cache, artist.clean(), albumartist.clean(), album.clean(), 'lfmRev', false);}
	this.lfmTrackPth = () => {if (ppt.img_only || ppt.artistView) return ["", "", false, false]; return pBio.getPth('track', ppt.focus, artist, "Track Reviews", "", "", artist.clean(), "", "Track Reviews", 'lfmRev', false);}
	this.messageDraw = gr => {if (ppt.heading || !this.na) return; const j_x = Math.round(pBio.text_w / 2) + pBio.text_l, j_h = Math.round(uiBio.font_h * 1.5), j_y = pBio.text_t + (pBio.lines_drawn * uiBio.font_h - j_h) / 3, rs1 = Math.min(5, j_h / 2), rs2 = Math.min(4, (j_h - 2) / 2); gr.SetSmoothingMode(4); const j_w = gr.CalcTextWidth(this.na, uiBio.messageFont) + 25; gr.FillRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 0xDB000000); gr.DrawRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 1, 0x64000000); gr.DrawRoundRect(j_x - j_w / 2 + 1, j_y + 1, j_w - 2, j_h - 2, rs2, rs2, 1, 0x28ffffff); gr.GdiDrawText(this.na, uiBio.messageFont, RGB(0, 0, 0), j_x - j_w / 2 + 1, j_y + 1 , j_w, j_h, this.cc); gr.GdiDrawText(this.na, uiBio.messageFont, 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, this.cc);}
	this.on_playback_new_track = force => {if (pBio.lock) pBio.get_multi(); if (!pBio.multi_new() && !force) return; if (this.block()) {this.get = 1; if (!pBio.lock) pBio.get_multi(true); this.logScrollPos(); this.album_reset(); this.artist_reset();} else {if (!pBio.lock) pBio.get_multi(true); this.logScrollPos(); this.album_reset(); this.artist_reset(); this.na = ""; this.getText(false); this.get = 0;}}
	this.on_size = () => {if (initialise) {this.album_reset(); this.artist_reset(); initialise = false;} scrollBioPos = {}; scrollRevPos = {}; this.getText(false); pBio.get_multi(true); butBio.refresh();}
	this.paint = () => {if (this.rp) window.Repaint();}
	this.scrollbar_type = () => ppt.artistView ? art_scrollbar : alb_scrollbar;

	this.getScrollPos = () => {
		let v;
		switch (ppt.artistView) {
			case true:
				v = artist + "-" + this.bio_allmusic + "-" + ppt.lockBio + "-" + ppt.bothBio;
				if (!scrollBioPos[v]) return art_scrollbar.set_scroll(0);
				if (scrollBioPos[v].text === art_txt_arr.length + "-" + this.art_txt) art_scrollbar.set_scroll(scrollBioPos[v].scroll || 0);
				else {scrollBioPos[v].scroll = 0; scrollBioPos[v].text = "";}
				break;
			case false: {
				v = (this.alb_allmusic || pBio.inclTrackRev != 2 || ppt.bothRev ? albumartist + album + "-" : "") + this.alb_allmusic + "-" + ppt.lockRev + "-" + ppt.bothRev + "-" + ppt.inclTrackRev;
				if (!scrollRevPos[v]) return alb_scrollbar.set_scroll(0);
				let match = false;
				if (pBio.inclTrackRev != 1) {
					if (scrollRevPos[v].text === uiBio.font.Size + "-" + pBio.text_w + "-" + this.alb_txt) match = true;
				} else {
					const tx1 = (uiBio.font.Size + "-" + pBio.text_w).toString(), tx2 = (alb_inf || lfmRev).strip(), tx3 = amRev.strip();
					if (scrollRevPos[v].text.startsWith(tx1) && (tx2 && scrollRevPos[v].text.includes(tx2) || tx3 && scrollRevPos[v].text.includes(tx3))) match = true;
				}
				if (match) {
					const set_scroll = pBio.inclTrackRev != 1 ? scrollRevPos[v].scroll : Math.min(scrollRevPos[v].scroll, alb_scrollbar.max_scroll);
					alb_scrollbar.set_scroll(set_scroll || 0);
				}
				else {scrollRevPos[v].scroll = 0; scrollRevPos[v].text = "";}
				break;
			}
		}
	}

	this.logScrollPos = n => {
		let keys = [], v;
		n = n == 'rev' ? false : ppt.artistView;
		switch (n) {
			case true:
				keys = Object.keys(scrollBioPos);
				if (keys.length > 70) delete scrollBioPos[keys[0]];
				v = artist + "-" + this.bio_allmusic + "-" + ppt.lockBio + "-" + ppt.bothBio;
				scrollBioPos[v] = {};
				scrollBioPos[v].scroll = art_scrollbar.scroll;
				scrollBioPos[v].text = art_txt_arr.length + "-" + this.art_txt;
				break;
			case false:
				keys = Object.keys(scrollRevPos);
				if (keys.length > 70) delete scrollRevPos[keys[0]];
				v = (this.alb_allmusic || pBio.inclTrackRev != 2 || ppt.bothRev ? albumartist + album + "-" : "") + this.alb_allmusic + "-" + ppt.lockRev + "-" + ppt.bothRev + "-" + ppt.inclTrackRev;
				scrollRevPos[v] = {};
				scrollRevPos[v].scroll = alb_scrollbar.scroll;
				scrollRevPos[v].text = uiBio.font.Size + "-" + pBio.text_w + "-" + (pBio.inclTrackRev != 1 ? this.alb_txt : ((alb_inf || lfmRev) + amRev).strip());
				break;
		}
	}

	const summaryFirstText = (s1, s2, text, s3, rating) => {
		if (!text) return text;
		let ix = -1, m = text.match(RegExp(s2, "gi")), sub1 = "", sub2 = ""; ix = text.lastIndexOf(s1);
		if (ix != -1) {
			sub1 = text.substring(ix); sub1 = sub1.split('\n')[0].trim();
			text = text.replace(RegExp(sub1), "");
			sub1 = sub1.replace(RegExp(s1), "").replace(/, /g, " \u2219 ");
			let sub1_w = 0; sBio.gr(1, 1, false, g => sub1_w = g.CalcTextWidth(sub1, uiBio.font));
			if (sub1) sub1 += sub1_w < pBio.text_w || init ? "\r\n" : "  |  ";
		}
		init = false;
		if (m) {ix = -1; m = m[m.length - 1].toString(); ix = text.lastIndexOf(m);}
		if (ix != -1) {sub2 = text.substring(ix); sub2 = sub2.split('\n')[0].trim();
			text = text.replace(RegExp(sub2.regex_escape()), "");
			sub2 = sub2.replace(" | ", "  |  ");
			if (sub2 && rating && !s3) sub2 += ("  |  " + rating);
			if (sub2 && !s3) sub2 += "\r\n";
		}
		if (!s3) {
			text = sub1 + sub2.titlecase() + (sub1 || sub2 ? "\r\n" : "") + text;
			return "¦|¦\r\n" + text.trim() + "\r\n¦|¦";
		}
		let sub3 = "", sub4 = ""; ix = -1; m = text.match(RegExp(s3, "i"));
		if (m) {
			m = m.toString();
			ix = text.lastIndexOf(m);
			if (ix != -1) {
				sub3 = text.substring(ix).replace("\r\n\r\n", ";"); sub3 = sub3.split(';')[0].trim();
				text = text.replace(RegExp(sub3.regex_escape() + "; "), ""); text = text.replace(RegExp(sub3.regex_escape() + "\r\n\r\n"), "");
			}
		}
		if (sub2 && sub3) sub4 += sub2 + "  |  " + sub3; else sub4 += sub2 + sub3;
		if (sub4) sub4 += "\r\n";
		text = sub1 + sub4.titlecase() + (sub1 || sub4 ? "\r\n" : "") + text;
		return  "¦|¦\r\n" + text.trim() + "\r\n¦|¦";
	}

	const tf = (n, trackreview) => {
		if (pBio.lock) n = n.replace(/%artist%|\$meta\(artist,0\)/g, "#¦#¦#%artist%#¦#¦#").replace(/%title%|\$meta\(title,0\)/g, "#!#!#%title%#!#!#");
		let a = (ppt.artistView ? artist : (!trackreview ? (pBio.alb_ix ? albumartist : artist) : trackartist)).tf_escape(), aa = (ppt.artistView ? (pBio.art_ix ? artist : albumartist) : (!trackreview ? albumartist : trackartist)).tf_escape(), l = album.replace("Album Unknown", "").tf_escape(), tr = track.tf_escape();
		const stnd = ppt.artistView && !pBio.art_ix || !ppt.artistView && !pBio.alb_ix; n = n.replace(/%more_item%/gi, !stnd ? "$&#@!%path%#@!" : "$&");
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? "$&#@!%path%#@!" : "$&").replace(/%bio_artist%/gi, a).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? "$&#@!%path%#@!" : "$&").replace(/%bio_albumartist%/gi, aa).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? "$&#@!%path%#@!" : "$&").replace(/%bio_album%/gi, l).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? "$&#@!%path%#@!" : "$&").replace(/%bio_title%/gi, tr);
		n = pBio.eval(n, ppt.focus);
		if (pBio.lock) n = n.replace(/#¦#¦#.*?#¦#¦#/g, trackartist).replace(/#!#!#.*?#!#!#/g, track); n = n.replace(/#@!.*?#@!/g, "") || "No Selection";
		return n;
	}

	this.getText = (p_calc, update) => {
		if (ppt.img_only) return; const a = artist.clean(); new_text = false; if (!pBio.lock) {trackartist = name.artist(ppt.focus); track = name.title(ppt.focus);}
		switch (true) {
			case ppt.artistView:
				if (!a) break;
				if (ppt.bothBio) {if (!done.amBio || update) {done.amBio = true; am_bio(a); if (!done.lfmBio || update) {done.lfmBio = true; lfm_bio(a);}} break;}
				if (!ppt.allmusic_bio && (!done.lfmBio || update)) {done.lfmBio = true; lfm_bio(a); if (!lfmBio && !ppt.lockBio && (!done.amBio || update)) {done.amBio = true; am_bio(a);}}
				if (ppt.allmusic_bio && (!done.amBio || update)) {done.amBio = true; am_bio(a); if (!amBio && !ppt.lockBio && (!done.lfmBio || update)) {done.lfmBio = true; lfm_bio(a);}}
				break;
			case !ppt.artistView: {
				const aa = albumartist.clean(), l = album.clean();
				if (!aa || !l && !pBio.inclTrackRev) {this.amRating = -1; this.lfmRating = -1; this.avgRating = -1; butBio.check(); break;}
				if (pBio.ir(ppt.focus) && !pBio.inclTrackRev && !pBio.alb_ix) break;
				if (ppt.bothRev) {if (!done.amRev || update) {done.amRev = true; am_rev(a, aa, l); if (!done.lfmRev || update) {done.lfmRev = true; lfm_rev(a, aa, l);}} break;}
				if (ppt.allmusic_alb && (!done.amRev || update)) {done.amRev = true; am_rev(a, aa, l); if (!amRev && !ppt.lockRev && (!done.lfmRev || update)) {done.lfmRev = true; lfm_rev(a, aa, l);}}
				if (!ppt.allmusic_alb && (!done.lfmRev || update)) {done.lfmRev = true; lfm_rev(a, aa, l); if (!lfmRev && !ppt.lockRev && (!done.amRev || update)) {done.amRev = true; am_rev(a, aa, l);}}
				break;
			}
		}
		if (!update || new_text) {
			this.alb_txt = ""; d.aB1 = false; d.aB2 = false; d.aR1 = false; d.aR2 = false; this.art_txt = ""; this.head = true; butBio.set_src_btn_hide(); d.lB1 = false; d.lB2 = false; d.lR1 = false; d.lR2 = false;
			switch (true) {
				case !ppt.bothBio:
					if (ppt.allmusic_bio) {if (ppt.sourceHeading == 2 && !amRev && lfmRev) lfmRev = lfmRev.replace(/Last.fm: /g, "");
					this.art_txt = !ppt.lockBio ? amBio ? (ppt.sourceHeading == 2 ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio : (ppt.sourceHeading == 2 && lfmBio ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio : (ppt.sourceHeading == 2 && (amBio || pBio.imgText || ppt.text_only) ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" + (amBio ? "" : "Nothing Found") : "") + amBio; if (amBio || ppt.lockBio) d.aB1 = true; else if (lfmBio) d.lB1 = true; if (amBio || ppt.lockBio) this.bio_allmusic = true; else if (lfmBio) this.bio_allmusic = false; else this.bio_allmusic = true;}
					else {if (ppt.sourceHeading == 2 && lfmBio) lfmBio = lfmBio.replace(/Last.fm: /g, ""); this.art_txt = !ppt.lockBio ? lfmBio ? (ppt.sourceHeading == 2 ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio : (ppt.sourceHeading == 2 && amBio ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio : (ppt.sourceHeading == 2 && (lfmBio || pBio.imgText || ppt.text_only) ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" + (lfmBio ? "" : "Nothing Found") : "") + lfmBio; if (lfmBio || ppt.lockBio) d.lB1 = true; else if (amBio) d.aB1 = true; if (lfmBio || ppt.lockBio) this.bio_allmusic = false; else if (amBio) this.bio_allmusic = true; else this.bio_allmusic = false;} this.btnBioBoth = false; break;
				case ppt.bothBio:
					if (ppt.allmusic_bio) {if (amBio) {this.art_txt = (ppt.sourceHeading ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio; d.aB1 = true;} if (lfmBio) {lfmBio = lfmBio.replace(/Last.fm: /g, ""); this.art_txt = this.art_txt + (amBio ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio; d.lB2 = true;} if (amBio) this.bio_allmusic = true; else if (lfmBio) this.bio_allmusic = false; else this.bio_allmusic = true;}
					else {if (lfmBio) {lfmBio = lfmBio.replace(/Last.fm: /g, ""); this.art_txt = (ppt.sourceHeading ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio; d.lB1 = true;} if (amBio) {this.art_txt = this.art_txt + (lfmBio ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio; d.aB2 = true;} if (lfmBio) this.bio_allmusic = false; else if (amBio) this.bio_allmusic = true; else this.bio_allmusic = false;}
					this.btnBioBoth = amBio && lfmBio || !amBio && !lfmBio ? true : false; break;
			}
			switch (true) {
				case !ppt.bothRev:
					if (ppt.allmusic_alb) {if (ppt.sourceHeading == 2 && !amRev && lfmRev) lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = !ppt.lockRev ? amRev ? (ppt.sourceHeading == 2 ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev : (ppt.sourceHeading == 2 && lfmRev ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev : (ppt.sourceHeading == 2 && (amRev || pBio.imgText || ppt.text_only) ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" + (amRev ? "" : "Nothing Found") : "") + amRev; if (amRev || ppt.lockRev) d.aR1 = true; else if (lfmRev) d.lR1 = true; if (amRev || ppt.lockRev) this.alb_allmusic = true; else if (lfmRev) this.alb_allmusic = false; else this.alb_allmusic = true;}
					else {if (ppt.sourceHeading == 2 && lfmRev) lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = !ppt.lockRev ? lfmRev ? (ppt.sourceHeading == 2 ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev : (ppt.sourceHeading == 2 && amRev ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev : (ppt.sourceHeading == 2 && (lfmRev || pBio.imgText || ppt.text_only) ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" + (lfmRev ? "" : "Nothing Found") : "") + lfmRev; if (lfmRev || ppt.lockRev) d.lR1 = true; else if (amRev) d.aR1 = true; if (lfmRev || ppt.lockRev) this.alb_allmusic = false; else if (amRev) this.alb_allmusic = true; else this.alb_allmusic = false;} this.btnRevBoth = false; break;
				case ppt.bothRev:
					if (ppt.allmusic_alb) {if (amRev) {this.alb_txt = (ppt.sourceHeading ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev; d.aR1 = true;} if (lfmRev) {lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = this.alb_txt + (amRev ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev; d.lR2 = true;} if (amRev) this.alb_allmusic = true; else if (lfmRev) this.alb_allmusic = false; else this.alb_allmusic = true;}
					else {if (lfmRev) {lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = (ppt.sourceHeading ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev; d.lR1 = true;} if (amRev) {this.alb_txt = this.alb_txt + (lfmRev ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev; d.aR2 = true;} if (lfmRev) this.alb_allmusic = false; else if (amRev) this.alb_allmusic = true; else this.alb_allmusic = false;}
					this.btnRevBoth = amRev && lfmRev || !amRev && !lfmRev ? true : false; break;
			}
			bioSubHead = !ppt.sourceHeading || !this.art_txt || !ppt.bothBio && ppt.sourceHeading != 2 ? 0 : 1; revSubHead = !ppt.sourceHeading || !this.alb_txt || !ppt.bothRev && ppt.sourceHeading != 2 ? 0 : 1;
			if (uiBio.stars == 1 && ppt.src && this.btnRevBoth) {let c = 0; this.avgRating = -1; if (this.amRating != -1 || this.lfmRating != -1) {this.avgRating = 0; if (this.amRating != -1) {this.avgRating += this.amRating; c++;} if (this.lfmRating != -1) {this.avgRating += this.lfmRating; c++;} this.avgRating /= c; this.avgRating = Math.round(this.avgRating);}}
			if (!pBio.imgText) this.text = ppt.artistView ? this.art_txt ? true : false : this.alb_txt ? true : false; else this.text = true; imgBio.setCrop(true);
			if (!this.art_txt && (ppt.text_only || pBio.imgText)) this.art_txt = !ppt.heading ? bioFallbackText[1] : bioFallbackText[0];
			if (!this.alb_txt && (ppt.text_only || pBio.imgText)) this.alb_txt = !ppt.heading ? revFallbackText[1] : revFallbackText[0];
			if ((ppt.artistView && !this.art_txt || !ppt.artistView && !this.alb_txt) && !ppt.text_only) {this.head = false; butBio.set_src_btn_hide();}
			if (this.art_txt != art_txt_o || p_calc && p_calc !== 2) {art_txt_o = this.art_txt; this.art_calc();}
			if (this.alb_txt != alb_txt_o || p_calc && p_calc !== 1) {alb_txt_o = this.alb_txt; this.alb_calc();}
			if (ppt.text_only && !uiBio.blur) this.paint();
			if (pBio.alb_ix && pBio.inclTrackRev) this.paint();
		}
		if (!ppt.heading) {new_text = false; return;}
		if (updTrackSubHead()) return this.getText(false);
		if (pBio.lock && !new_text) {if (this.curHeadingID == this.headingID()) {new_text = false; return;} else this.curHeadingID = this.headingID();}
		new_text = false;
		if (ppt.artistView) this.heading = uiBio.headText ? tf(this.bio_allmusic ? ppt.amBioHeading : ppt.lfmBioHeading) : "";
		else this.heading = uiBio.headText ? (pBio.inclTrackRev && !this.alb_allmusic && showTrackHead ? tf(ppt.lfmTrackHeading, true) : tf(this.alb_allmusic ? ppt.amRevHeading : ppt.lfmRevHeading)) : "";
		if (pBio.lock) this.curHeadingID = this.headingID();
	}

	this.alb_calc = () => {
		if (!this.alb_txt || ppt.img_only) return; alb_txt_arr = []; d.bothR_ix = -1; let l = [];
		sBio.gr(1, 1, false, g => {if (pBio.inclTrackRev) {let ti = this.alb_txt.match(/#!!#.+?$/m); if (ti) {ti = ti.toString(); if (g.CalcTextWidth(ti, uiBio.font) > pBio.text_w) {const new_ti = g.EstimateLineWrap(ti, uiBio.font, pBio.text_w - g.CalcTextWidth("... ", uiBio.font))[0] +"..."; this.alb_txt = this.alb_txt.replace(RegExp(ti.regex_escape()), new_ti);}}} l = g.EstimateLineWrap(this.alb_txt, uiBio.font, pBio.text_w);});
		for (let i = 0; i < l.length; i += 2) alb_txt_arr.push(l[i].trim())
		if (ppt.summaryFirst) {
			const hdMarkers = [];
			alb_txt_arr.forEach((v, i) => {
				if (v == "¦|¦") hdMarkers.push(i);
			});
			if (hdMarkers.length > 1) for (let i = hdMarkers[0]; i < hdMarkers[1] + 1; i++) alb_txt_arr[i] = alb_txt_arr[i].replace(/^\u2219 |^\| {2}/, "").replace(/\|$/, "");
			if (hdMarkers.length == 4) for (let i = hdMarkers[2]; i < hdMarkers[3] + 1; i++) alb_txt_arr[i] = alb_txt_arr[i].replace(/^\u2219 |^\| {2}/, "").replace(/\|$/, "");
			let i = alb_txt_arr.length; while (i--) {if (alb_txt_arr[i] == "¦|¦") alb_txt_arr.splice(i, 1);}
		}
		if (revSubHead) alb_txt_arr.some((v, i, arr) => {if (v.includes("#!#")) {d.bothR_ix = i; arr[i] = arr[i].replace("#!#", ""); return true;}});
		butBio.refresh(true); alb_scrollbar.reset(); alb_scrollbar.metrics(pBio.sbar_x, pBio.sbar_y, uiBio.sbar_w, pBio.sbar_h, pBio.lines_drawn, uiBio.font_h); alb_scrollbar.set_rows(alb_txt_arr.length);
		d.r = !ppt.summaryFirst && (uiBio.stars == 2 || uiBio.stars == 1 && !ppt.src) && (ppt.ratingTextPos == 2 || revSubHead && !ppt.ratingTextPos) && !ppt.artistView && alb_txt_arr.length > 1 && (!revSubHead ? (this.alb_allmusic && this.amRating != -1 || !this.alb_allmusic && this.lfmRating != -1) : true);
		d.aw1 = d.w[ppt.heading ? 3 : 7]; d.aw2 = d.w[ppt.heading ? 3 : 7]; d.lw1 = d.w[ppt.heading ? 4 : 8]; d.lw2 = d.w[ppt.heading ? 4 : 8];
		if (d.r) {
			if (this.amRating >= 0) {if (d.aR1) d.aw1 += d.w[0] + butBio.r_w2; if (d.aR2) d.aw2 += d.w[0] + butBio.r_w2; if (d.aR1 || d.aR2) d.ax = pBio.text_l + d.w[ppt.heading ? 3 : 7];}
			if (this.lfmRating >= 0) {if (d.lR1) d.lw1 += d.w[0] + butBio.r_w2; if (d.lR2) d.lw2 += d.w[0] + butBio.r_w2; if (d.lR1 || d.lR2)  d.lx = pBio.text_l + d.w[ppt.heading ? 4 : 8];}
			d.ry = Math.round((uiBio.font_h - butBio.r_h1 / 2) / 1.8);
		}
		if (!ppt.heading && revSubHead) {d.xa1 = pBio.text_l + d.aw1; d.xl1 = pBio.text_l +  d.lw1; d.x1a = pBio.text_l + d.aw2; d.x1l = pBio.text_l + d.lw2; const lw = pBio.text_l + pBio.text_w; d.xa2 = Math.max(d.xa1, lw); d.xl2 = Math.max(d.xl1, lw); d.x2a = Math.max(d.x1a, lw); d.x2l = Math.max(d.x1l, lw);}
		if (pBio.inclTrackRev == 1) this.getScrollPos();
	}

	this.art_calc = () => {
		if (!this.art_txt || ppt.img_only) return; art_txt_arr = []; d.bothB_ix = -1; let l = [];
		sBio.gr(1, 1, false, g => l = g.EstimateLineWrap(this.art_txt, uiBio.font, pBio.text_w));
		for (let i = 0; i < l.length; i += 2) art_txt_arr.push(l[i].trim());
		if (ppt.summaryFirst) {
			const hdMarkers = [];
			art_txt_arr.forEach((v, i) => {
				if (v == "¦|¦") hdMarkers.push(i);
			});
			if (hdMarkers.length > 1) for (let i = hdMarkers[0]; i < hdMarkers[1] + 1; i++) art_txt_arr[i] = art_txt_arr[i].replace(/^\u2219 |^\| {2}/, "").replace(/\|$/, "");
			if (hdMarkers.length == 4) for (let i = hdMarkers[2]; i < hdMarkers[3] + 1; i++) art_txt_arr[i] = art_txt_arr[i].replace(/^\u2219 |^\| {2}/, "").replace(/\|$/, "");
			let i = art_txt_arr.length; while (i--) {if (art_txt_arr[i] == "¦|¦") art_txt_arr.splice(i, 1);}
		}
		if (bioSubHead) art_txt_arr.some((v, i, arr) => {if (v.includes("#!#")) {d.bothB_ix = i; arr[i] = arr[i].replace("#!#", ""); return true;}});
		butBio.refresh(true); art_scrollbar.reset(); art_scrollbar.metrics(pBio.sbar_x, pBio.sbar_y, uiBio.sbar_w, pBio.sbar_h, pBio.lines_drawn, uiBio.font_h); art_scrollbar.set_rows(art_txt_arr.length);
		if (!ppt.heading && bioSubHead) {d.ax1 = pBio.text_l + d.w[5]; d.ax2 = Math.max(d.ax1, pBio.text_l + pBio.text_w); d.lx1 = pBio.text_l + d.w[6]; d.lx2 = Math.max(d.lx1, pBio.text_l + pBio.text_w);}
	}

	const lfm_bio = a => {
		const lfm_a = pBio.getPth('bio', ppt.focus, artist, "", "", pBio.sup.Cache, a, "", "", 'lfmBio', true).pth;
		if (!sBio.file(lfm_a)) return; mod.lfmBio = sBio.lastModified(lfm_a); if (mod.lfmBio == mod.lfmBio_o) return; lfmBio = sBio.open(lfm_a).trim(); if (!ppt.stats) {const f = lfmBio.indexOf("Last.fm: "); if (f != -1) lfmBio = lfmBio.slice(0, f).trim();}
		if (ppt.summaryFirst) lfmBio = summaryFirstText("Top Tags: ", yrsActive, lfmBio, popNow).replace(/(?:\s*\r\n){3,}/g, "\r\n\r\n");
		else if (pBio.lfmLang_ix > 3) lfmBio = lfmBio.replace("Top Tags: ", topTags[pBio.lfmLang_ix] + ": ");
		new_text = true; mod.lfmBio_o = mod.lfmBio;
	}

	const am_bio = a => {
		const am_a = pBio.getPth('bio', ppt.focus, artist, "", "", pBio.sup.Cache, a, "", "", 'amBio', true).pth;
		if (!sBio.file(am_a)) return; mod.amBio = sBio.lastModified(am_a); if (mod.amBio == mod.amBio_o) return; amBio = sBio.open(am_a).trim();
		if (ppt.summaryFirst) amBio = summaryFirstText("Genre: ", "Active: ", amBio).replace(/(?:\s*\r\n){3,}/g, "\r\n\r\n");
		new_text = true; mod.amBio_o = mod.amBio;
	}

	const am_rev = (a, aa, l) => {
		const am_b = pBio.getPth('rev', ppt.focus, artist, album, "", pBio.sup.Cache, a, aa, l, 'amRev', true).pth; let rat = "";
		if (!sBio.file(am_b)) {this.amRating = -1; butBio.check(); return;} mod.amRev = sBio.lastModified(am_b); if (mod.amRev == mod.amRev_o) return; amRev = sBio.open(am_b).trim();
		new_text = true; mod.amRev_o = mod.amRev; this.amRating = -1;
		let b = amRev.indexOf(">> Album rating: ") + 17; const f = amRev.indexOf(" <<"), subHeadOn = ppt.bothRev && ppt.sourceHeading || ppt.sourceHeading == 2;
		if (ppt.amRating) {if (b !=-1 && f != -1 && f > b) this.amRating = amRev.substring(b, f); if (!isNaN(this.amRating) && this.amRating != 0 && this.amRating != -1) this.amRating *= 2; else this.amRating = -1;}
		if ((uiBio.stars == 1 && ppt.src || !ppt.amRating) && f != -1) amRev = amRev.substring(f + 5);
		else if (!ppt.summaryFirst && (uiBio.stars == 2 || uiBio.stars == 1 && !ppt.src) && (ppt.ratingTextPos == 2 || subHeadOn && !ppt.ratingTextPos) && this.amRating != -1) {amRev = (!subHeadOn ? ppt.allmusic_name + ":\r\n\r\n" : "") + amRev.substring(f + 5);}
		else {if (!uiBio.stars || this.amRating == -1 || ppt.summaryFirst) {b = amRev.indexOf(" <<"); if (b != -1) amRev = amRev.slice(b + 3); if (ppt.summaryFirst) rat = this.amRating != -1 ? ppt.allmusic_name + ": " + this.amRating / 2 : "";} else if (ppt.allmusic_name != "Album rating") amRev = amRev.replace("Album rating", ppt.allmusic_name);}
		if (ppt.summaryFirst) amRev = summaryFirstText("Genre: ", "Release Date: ", amRev, "", rat).replace(/(?:\s*\r\n){3,}/g, "\r\n\r\n");
		if (!amRev) butBio.check();
	}

	const lfm_rev = (a, aa, l) => {
		let lfm_tr_mod = "", rat = "", trackRev = "", trk = ""; const lfm_b = pBio.getPth('rev', ppt.focus, artist, album, "", pBio.sup.Cache, a, aa, l, 'lfmRev', true).pth;
		if (!sBio.file(lfm_b)) {this.lfmRating = -1; butBio.check(); if (!pBio.inclTrackRev) {alb_inf = ""; return;}}
		if (pBio.inclTrackRev) {
			trk = track.toLowerCase();
			trackRev = sBio.jsonParse(pBio.getPth('track', ppt.focus, trackartist, "Track Reviews", "", "", trackartist.clean(), "", "Track Reviews", 'lfmRev', true).pth, false, 'file');
			if (trackRev[trk] && trackRev[trk].update) lfm_tr_mod = trackRev[trk].update;
		}
		mod.lfmRev = sBio.file(lfm_b) && pBio.inclTrackRev != 2 ? sBio.lastModified(lfm_b) + lfm_tr_mod : lfm_tr_mod;
		if (mod.lfmRev == mod.lfmRev_o) return; alb_inf = "";
		if (pBio.inclTrackRev != 2) alb_inf = sBio.open(lfm_b).trim();
		new_text = true; mod.lfmRev_o = mod.lfmRev; this.lfmRating = -1;
		if (pBio.inclTrackRev != 2) {
			if (ppt.lfmRating) {const b = alb_inf.indexOf("Rating: "); if (b != -1) {this.lfmRating = alb_inf.substring(b).replace(/\D/g, "");
			this.lfmRating = Math.min(((Math.floor(0.1111 * this.lfmRating + 0.3333) / 2)), 5);
			if (uiBio.stars == 1 && ppt.src) this.lfmRating *= 2;
			if ((uiBio.stars == 2 || uiBio.stars == 1 && !ppt.src) && this.lfmRating != -1) {const subHeadOn = ppt.bothRev && ppt.sourceHeading || ppt.sourceHeading == 2; if (ppt.ratingTextPos == 2 || subHeadOn && !ppt.ratingTextPos) {this.lfmRating *= 2; if (!ppt.summaryFirst) alb_inf = (!subHeadOn ? ppt.lastfm_name + ":\r\n\r\n" : "") + alb_inf; else rat = ppt.lastfm_name + ": " + this.lfmRating;} else {if (!ppt.summaryFirst) alb_inf = ">> " + ppt.lastfm_name + ": " + this.lfmRating + " <<  " + ((/^Top Tags: /).test(alb_inf) ? "\r\n\r\n" : "") + alb_inf; else rat = ppt.lastfm_name + ": " + this.lfmRating;}}}}
			alb_inf = ppt.score ? alb_inf.replace("Rating: ", "") : alb_inf.replace(/^Rating: .*$/m, "").trim();
			if (ppt.summaryFirst) alb_inf = summaryFirstText("Top Tags: ", releaseDate, alb_inf, "", rat);
			else if (pBio.lfmLang_ix > 3) alb_inf = alb_inf.replace("Top Tags: ", topTags[pBio.lfmLang_ix] + ": ");
		}
		if (!ppt.stats) {alb_inf = alb_inf.replace(/^Last.fm: .*$(\n)?/gm, "").trim();}
		lfmRev = alb_inf;
		if (pBio.inclTrackRev) {
			if (trackRev && trackRev[trk]) {
				let wiki = ""; if (trackRev[trk].releases) wiki = trackRev[trk].releases;
				if (trackRev[trk].wiki) wiki += wiki ? "\r\n\r\n" + trackRev[trk].wiki : trackRev[trk].wiki;
				if (trackRev[trk].stats) wiki += wiki ? "\r\n\r\n" + trackRev[trk].stats : trackRev[trk].stats;
				if (wiki) {if (ppt.trackHeading == 1 && (alb_inf || !ppt.heading || ppt.bothRev && pBio.inclTrackRev == 2 && (alb_inf || amRev)) || ppt.trackHeading == 2) {showTrackHead = false; trackRev =  "#!!#" + tf(ppt.lfmTrackSubHeading, true) + "\r\n" + wiki;} else {showTrackHead = true; trackRev = wiki;} lfmRev = alb_inf + (alb_inf ? "\r\n\r\n" : "") + trackRev;} else showTrackHead = false;
				if ((alb_inf || amRev) && ppt.heading && !ppt.trackHeading) showTrackHead = false;
			}
		}
		if (!ppt.stats) {lfmRev = lfmRev.replace(/^Last.fm: .*$(\n)?/gm, "").trim();}
		if (ppt.summaryFirst || !ppt.stats) lfmRev = lfmRev.replace(/(?:\s*\r\n){3,}/g, "\r\n\r\n");
		if (!lfmRev) butBio.check();
	}

	this.draw = gr => {
		this.x; this.y; this.w; this.h;
		if (!ppt.img_only || ppt.text_only) {
			getTxtFallback();
			if (ppt.overlayStyle && ppt.style > 3 && this.text && !ppt.text_only) {gr.SetSmoothingMode(2); const c = !ppt.blurDark && !ppt.blurLight ? uiBio.col.rectOv : uiBio.col.blurOv; let o = 0;
				switch (ppt.overlayStyle) {
					case 1: gr.FillSolidRect(pBio.tBoxL, pBio.tBoxT, pBio.tBoxW, pBio.tBoxH, c); break;
					case 2: o = Math.round(uiBio.arc_w / 2); gr.FillSolidRect(pBio.tBoxL + o, pBio.tBoxT + o, pBio.tBoxW - o * 2, pBio.tBoxH - o * 2, c); gr.DrawRect(pBio.tBoxL + o, pBio.tBoxT + o, pBio.tBoxW - uiBio.arc_w - 1, pBio.tBoxH - uiBio.arc_w - 1, uiBio.arc_w, uiBio.col.rectOvBor); break;
					case 3: gr.FillRoundRect(pBio.tBoxL, pBio.tBoxT, pBio.tBoxW, pBio.tBoxH, pBio.arc, pBio.arc, c); break;
					case 4: o = Math.round(uiBio.arc_w / 2); gr.FillRoundRect(pBio.tBoxL + o, pBio.tBoxT + o, pBio.tBoxW - o * 2, pBio.tBoxH - o * 2, pBio.arc, pBio.arc, c); gr.DrawRoundRect(pBio.tBoxL + o, pBio.tBoxT + o, pBio.tBoxW - uiBio.arc_w - 1, pBio.tBoxH - uiBio.arc_w - 1, pBio.arc, pBio.arc, uiBio.arc_w, uiBio.col.rectOvBor); break;
				}
			}
			if (ppt.artistView && this.art_txt) {
				const b = Math.max(Math.round(art_scrollbar.delta / uiBio.font_h + 0.4), 0), f = Math.min(b + pBio.lines_drawn, art_txt_arr.length);
				for (let i = b; i < f; i++) {
					const item_y = uiBio.font_h * i + pBio.text_t - art_scrollbar.delta + scaleForDisplay(13);
					if (item_y < pBio.max_y) {
						if (!ppt.heading && bioSubHead) {const iy = Math.round(item_y + uiBio.font_h / 2);
							if (!i && d.aB1) gr.DrawLine(d.ax1, iy, d.ax2, iy, uiBio.l_h, uiBio.col.centerLine);
							if (!i && d.lB1) gr.DrawLine(d.lx1, iy, d.lx2, iy, uiBio.l_h, uiBio.col.centerLine);
							if (i == d.bothB_ix && d.aB2) gr.DrawLine(d.ax1, iy, d.ax2, iy, uiBio.l_h, uiBio.col.centerLine);
							if (i == d.bothB_ix && d.lB2) gr.DrawLine(d.lx1, iy, d.lx2, iy, uiBio.l_h, uiBio.col.centerLine);
						}
					if (bioSubHead && (!i || i == d.bothB_ix)) gr.GdiDrawText(art_txt_arr[i], uiBio.sourceFont, uiBio.col.source, pBio.text_l, item_y, pBio.text_w, uiBio.font_h, this.l);
					else gr.GdiDrawText(art_txt_arr[i], uiBio.font, uiBio.col.text, pBio.text_l, item_y, pBio.text_w, uiBio.font_h, this.l);
					}
				}
				if (ppt.sbarShow) art_scrollbar.draw(gr);
			}
			if (!ppt.artistView && this.alb_txt) {
				const b = Math.max(Math.round(alb_scrollbar.delta / uiBio.font_h + 0.4), 0), f = Math.min(b + pBio.lines_drawn, alb_txt_arr.length);
				const r = !ppt.summaryFirst && (uiBio.stars == 2 || uiBio.stars == 1 && !ppt.src) && (ppt.ratingTextPos == 2 || revSubHead && !ppt.ratingTextPos) && !ppt.artistView && alb_txt_arr.length > 1 && (!revSubHead ? (this.alb_allmusic && this.amRating != -1 || !this.alb_allmusic && this.lfmRating != -1) : true);
				let song = -1;
				for (let i = b; i < f; i++) {
					let item_y = uiBio.font_h * i + pBio.text_t - alb_scrollbar.delta + scaleForDisplay(13);
					if (item_y < pBio.max_y) {
						if (alb_txt_arr[i].startsWith("#!!#")) song = i; if (i > song && song != -1 && !revSubHead) item_y += extra_y;
						if (r) switch (revSubHead) {
							case 0: {
								const rating = this.alb_allmusic ? this.amRating : this.lfmRating; if (i == 0 && rating >= 0)
								gr.DrawImage(butBio.ratingImages[rating], pBio.text_l + gr.CalcTextWidth((this.alb_allmusic ? ppt.allmusic_name : ppt.lastfm_name) + ":  ", uiBio.font), item_y + d.ry, butBio.r_w1 / 2, butBio.r_h1 / 2, 0, 0, butBio.r_w1, butBio.r_h1, 0, 255);
								break;
							}
							case 1:
								if (!i) {
									if (d.aR1 && this.amRating >= 0) {gr.DrawImage(butBio.ratingImages[this.amRating], d.ax, item_y + d.ry, butBio.r_w1 / 2, butBio.r_h1 / 2, 0, 0, butBio.r_w1, butBio.r_h1, 0, 255);}
									if (d.lR1 && this.lfmRating >= 0) {gr.DrawImage(butBio.ratingImages[this.lfmRating], d.lx, item_y + d.ry, butBio.r_w1 / 2, butBio.r_h1 / 2, 0, 0, butBio.r_w1, butBio.r_h1, 0, 255);}
								}
								if (i == d.bothR_ix) {
									if (d.aR2 && this.amRating >= 0) {gr.DrawImage(butBio.ratingImages[this.amRating], d.ax, item_y + d.ry, butBio.r_w1 / 2, butBio.r_h1 / 2, 0, 0, butBio.r_w1, butBio.r_h1, 0, 255);}
									if (d.lR2 && this.lfmRating >= 0) {gr.DrawImage(butBio.ratingImages[this.lfmRating], d.lx, item_y + d.ry, butBio.r_w1 / 2, butBio.r_h1 / 2, 0, 0, butBio.r_w1, butBio.r_h1, 0, 255);}
								}
								break;
						}
						if (!ppt.heading && revSubHead) {const iy = Math.round(item_y + uiBio.font_h / 2);
							if (!i) {
								if (d.aR1) gr.DrawLine(d.xa1, iy, d.xa2, iy, uiBio.l_h, uiBio.col.centerLine);
								if (d.lR1) gr.DrawLine(d.xl1, iy, d.xl2, iy, uiBio.l_h, uiBio.col.centerLine);
							}
							if (i == d.bothR_ix) {
								if (d.aR2) gr.DrawLine(d.x1a, iy, d.x2a, iy, uiBio.l_h, uiBio.col.centerLine);
								if (d.lR2) gr.DrawLine(d.x1l, iy, d.x2l, iy, uiBio.l_h, uiBio.col.centerLine);
							}
						}
						if (revSubHead && (!i || i == d.bothR_ix)) gr.GdiDrawText(alb_txt_arr[i], uiBio.sourceFont, uiBio.col.source, pBio.text_l, item_y, pBio.text_w, uiBio.font_h, this.l);
						else if (song == i) {
							const trlabel = alb_txt_arr[i].replace("#!!#", "");
							if (!ppt.heading && !i) {const iy = Math.round(item_y + uiBio.font_h / 2); const x1 = pBio.text_l + gr.CalcTextWidth(trlabel + " ", uiBio.trackFont); gr.DrawLine(x1, iy, Math.max(x1, pBio.text_l + pBio.text_w), iy, uiBio.l_h, uiBio.col.centerLine);}
							gr.GdiDrawText(trlabel, uiBio.trackFont, uiBio.col.track, pBio.text_l, item_y, pBio.text_w, uiBio.font_h, this.l);
						}
						else gr.GdiDrawText(alb_txt_arr[i], uiBio.font, uiBio.col.text, pBio.text_l, item_y, pBio.text_w, uiBio.font_h, this.l);
					}
				} if (ppt.sbarShow) alb_scrollbar.draw(gr);}
		}
	}

	this.toggle = (n) => {
		const text_state = this.text;
		switch (n) {
			case 0:
				this.logScrollPos(); ppt.allmusic_bio = !ppt.allmusic_bio; if (ppt.allmusic_bio) done.amBio = false; else done.lfmBio = false; this.getText(false);
				if (ppt.allmusic_bio != this.bio_allmusic) {if (ppt.heading) this.na = ppt.allmusic_bio ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_bio ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timerBio.clear(timerBio.source); timerBio.source.id = setTimeout(() => {this.na = ""; this.paint(); timerBio.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) imgBio.clear_rs_cache(); imgBio.get_images();
				break;
			case 1:
				this.logScrollPos(); ppt.allmusic_alb = !ppt.allmusic_alb; if (ppt.allmusic_alb) done.amRev = false; else done.lfmRev = false; this.getText(false);
				if (ppt.allmusic_alb != this.alb_allmusic) {if (ppt.heading) this.na = ppt.allmusic_alb ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_alb ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timerBio.clear(timerBio.source); timerBio.source.id = setTimeout(() => {this.na = ""; this.paint(); timerBio.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) imgBio.clear_rs_cache(); imgBio.get_images();
				break;
			case 2: ppt.lockBio = !ppt.lockBio; if (ppt.allmusic_bio) done.amBio = false; else done.lfmBio = false; this.getText(false); imgBio.clear_rs_cache(); imgBio.get_images(); butBio.check(); break;
			case 3: ppt.lockRev = !ppt.lockRev; if (ppt.allmusic_alb) done.amRev = false; else done.lfmRev = false; this.getText(false); imgBio.clear_rs_cache(); imgBio.get_images(); butBio.check(); break;
			case 4: ppt.bothBio = !ppt.bothBio; done.amBio = false; done.lfmBio = false; this.getText(true); imgBio.clear_rs_cache(); imgBio.get_images(); butBio.check(); break;
			case 5: ppt.bothRev = !ppt.bothRev; this.albumFlush(); this.getText(true); imgBio.clear_rs_cache(); imgBio.get_images(); butBio.check(); break;
			case 6:
				this.logScrollPos(); ppt.allmusic_bio = !ppt.allmusic_bio; done.amBio = false; done.lfmBio = false; this.getText(1);
				if (ppt.allmusic_bio != this.bio_allmusic) {if (ppt.heading) this.na = ppt.allmusic_bio ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_bio ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timerBio.clear(timerBio.source); timerBio.source.id = setTimeout(() => {this.na = ""; this.paint(); timerBio.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) imgBio.clear_rs_cache(); imgBio.get_images();
				break;
			case 7:
				this.logScrollPos(); ppt.allmusic_alb = !ppt.allmusic_alb; done.amRev = false; done.lfmRev = false; this.getText(2);
				if (ppt.allmusic_alb != this.alb_allmusic) {if (ppt.heading) this.na = ppt.allmusic_alb ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_alb ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timerBio.clear(timerBio.source); timerBio.source.id = setTimeout(() => {this.na = ""; this.paint(); timerBio.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) imgBio.clear_rs_cache(); imgBio.get_images();
				break;
			case 8: pBio.sizes(); imgBio.clear_rs_cache(); this.albumFlush(); this.artistFlush(); alb_txt_o = ""; art_txt_o = ""; this.getText(true); imgBio.get_images(); break;
			case 9: if (pBio.inclTrackRev == 1) this.logScrollPos(); uiBio.get_font(); uiBio.calc_text(); pBio.sizes(); uiBio.get_colors(); butBio.create_stars(); this.albumFlush(); this.artistFlush(); if (!ppt.img_only ) imgBio.clear_rs_cache(); alb_txt_o = ""; art_txt_o = ""; this.getText(true); butBio.refresh(true); imgBio.get_images(); break;
			case 10: if (pBio.inclTrackRev == 1) this.logScrollPos(); uiBio.calc_text(); pBio.sizes(); if (!ppt.img_only ) imgBio.clear_rs_cache(); alb_txt_o = ""; art_txt_o = ""; this.alb_calc(); this.art_calc(); imgBio.get_images(); if (ppt.text_only && !uiBio.blur) this.paint(); break;
			case 11: if (pBio.inclTrackRev == 1) uiBio.get_colors(); uiBio.get_font(); pBio.sizes(); if (!ppt.img_only ) imgBio.clear_rs_cache(); this.albumFlush(); this.getText(false); imgBio.get_images(); break;
			case 12: if (pBio.inclTrackRev == 1) this.logScrollPos(); uiBio.get_colors(); uiBio.get_font(); pBio.sizes(); if (!ppt.img_only ) imgBio.clear_rs_cache(); alb_txt_o = ""; art_txt_o = ""; this.alb_calc(); this.art_calc(); imgBio.get_images(); if (ppt.text_only && !uiBio.blur) this.paint(); break;
			case 13: pBio.sizes(); this.albumFlush(); this.artistFlush(); imgBio.clear_rs_cache(); if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) {this.getText(false); imgBio.get_images();} else {this.get_multi(false, pBio.art_ix, pBio.alb_ix); imgBio.get_multi(pBio.art_ix, pBio.alb_ix);} if (ppt.artistView) {alb_txt_o = ""; this.art_calc();} else {art_txt_o = ""; this.alb_calc();} break;
			case 14: ppt.mul_item = !ppt.mul_item; if (ppt.mul_item) pBio.get_multi(); else {pBio.lock = 0; pBio.alb_ix = 0; pBio.art_ix = 0; pBio.albums = []; pBio.artists = []; this.album_reset(true); this.artist_reset(true); this.getText(false); imgBio.get_images(true);} butBio.refresh(); this.paint(); break;
		}
	}
}

function TaggerBio() {
	let pt = [["ADV.Last.fmGenreTag Find>Replace", "-melancholic->melancholy|alt country>alt-country|alternativ>alternative|american artist>american|americana>american|america>american|andes>andean|australian artist>australian|australia>australian|avantgarde>avant-garde|blue eyed soul>blue-eyed soul|bluesrock>blues rock|blues-rock>blues rock|boyband>boybands|brasil>brazilian|british artist>british|britpop>brit pop|canada>canadian|canterbury>canterbury scene|chill out>chillout|christmas music>christmas|christmas songs>christmas|classique>classical|composer>composers|covers>cover|cover songs>cover|doo-wop>doo wop|duets>duet|easy-listening>easy listening|england>english|eurovision song contest>eurovision|experimental hip hop>experimental hip-hop|favourite albums of all time>favourite albums|favourite lps>favourite albums|favorite song>favourite song|favourite song>favourite albums|favorit>favourite albums|favourite>favourite albums|female>female vocalists|female vocalist>female vocalists|female vocals>female vocalists|fok rock>folk rock|folk-rock>folk rock|genre: psychedelic rock>psychedelic rock|good cd>good stuff|girl group>girl groups|greek music>greek|hip hop>hip-hop|is this what they call music nowedays>is this what they call music nowadays|jamaican artist>jamaican|jamaica>jamaican|jazz-rock>jazz rock|love songs>love|male>male vocalists|male vocals>male vocalists|mis albumes favoritos>favourite albums|motown soul>motown|movie>soundtrack|my favorites>favourite albums|musical>musicals|new orleans>new orleans blues|new orleans rhythm and blues>new orleans blues|nu-metal>nu metal|one hit wonder>one hit wonders|orchestra>orchestral|pop - adult>pop|pop-rock>pop rock|post punk>post-punk|prog>progressive|progressiv>progressive|prog rock>progressive rock|prog-rock>progressive rock|punk albums>punk|R&b>rnb|relaxation>relaxing|relax>relaxing|rhythm and blues>rnb|rock - progressive>progressive rock|rock & roll>rock n roll|rock and roll>rock n roll|rock n' roll>rock n roll|rock'n'roll>rock n roll|rock progressif>progressive rock|san fransico>san francisco|singer-songwriters>singer-songwriter|soul new>soul|synth>synthesiser|synthesizer>synthesiser|synthpop>synth pop|tech-house>tech house|underrated albums>underrated|weallgetold>we all get old|xmas>christmas|allboutguitar lesson>allboutguitar|allboutguitarcom>allboutguitar|-Progressive-And-Classic-Rock->|38 Special>|a good song>|acdc>|album cold play>|albums i have listened to>|albums i have on mp3>|albums i listened to>|albums i love>|albums i own>|albums i own on cd>|albums i own on vinyl>|albumsiown>|aleister crowley>|all>|barkley james harvest>|beatles>|best>|best album>|best albums ever>|best albums of all time>|best debut albums>|best top-rated albums>|bill bruford>|black sabbath>|blink 182>|bob dylan>|bob marley>|bowie>|cd i own>|christopher lee>|christine mcvie>|chupo buceta>|classic best of>|danny kirwan>|destinys child>|dylan>|ellie goulding>|elton john>|elvis costello>|featuring>|fleetwood mac>|frank zappa>|freddie mercury>|george michael and elton john>|girls aloud>|gonna listen>|grace slick>|guns n roses>|heaven and hell>|hello nadine>|intro>|j holiday>|j holiday - suffocate>|jan akkerman>|jan dismas zelenka>|jean michel jarre>|jecks>|joanne>|joe lynn turner>|jon anderson>|jonanderson>|jj cale>|jonas brothers>|judas priest>|kanye west>|kelis - kelis was here>|kesha>|lana del rey>|led zeppelin>|lesley garret>|liam gallagher>|lil boosie>|lord of the dance>|love this album>|love it>|loved>|lovely>|marillion>|michael jackson>|mia>|mike patton>|monkees>|music i love>|must-have>|my albums>|my collection>|my private work station>|my vinyl>|myhits>|n yepes>|neil young>|neil-young>|noel>|nyoung>|own cd>|own on vinyl>|paul kantner>|paul mccartney>|pavarotti>|pink>|pink floyd>|pj Harvey>|prince>|queen>|r kelly>|rahsaan patterson>|raul seixas>|robert plant>|rob halford>|roger waters>|rolling stones>|ryan adams>|selena gomez>|shirley bassey>|singles>|smashing pumpkins>|smokey robinson>|sonny terry>|special>|spice girls>|steelydan>|steve albini>|tarantino>|tatu>|the beatles>|the phantom of the opera>|to buy>|to listen>|tom petty>|tony visconti>|top cd>|trasy chapman-crossroads>|traveling wilburys>|try before i buy>|vinyl i own>|vinyl>|vocalist of the two- tone band the beat>|watson>|work bitch>|yes>|yes type>", "replace"], ["ADV.Last.fmGenreTag Number Clean Up", true, "cleanNo"], ["ADV.Last.fmGenreTag Run Find>Replace", true, "runReplace"], ["ADV.Last.fmGenreTag Strip Artist+Album Names", true, "stripNames"]]; ppt.init('manual', pt, this); pt = undefined;
	const arr1 = [], arr2 = [], simList = [];
	let ix = -1; this.replace = this.replace.replace(/>/g, "|").split("|");
	this.replace.forEach((v, i) => {if (i % 2 == 0) arr1.push(v.trim()); else arr2.push(v.trim());}); this.replace = undefined;
	const kww = "Founded In: |Born In: |Gegründet: |Formado en: |Fondé en: |Luogo di fondazione: |出身地: |Założono w: |Local de fundação: |Место основания: |Grundat år: |Kurulduğu tarih: |创建于: |Geboren in: |Lugar de nacimiento: |Né\\(e\\) en: |Luogo di nascita: |出身地: |Urodzony w: |Local de nascimento: |Место рождения: |Född: |Doğum yeri: |生于: ";
	const kw = "Similar Artists: |Ähnliche Künstler: |Artistas Similares: |Artistes Similaires: |Artisti Simili: |似ているアーティスト: |Podobni Wykonawcy: |Artistas Parecidos: |Похожие исполнители: |Liknande Artister: |Benzer Sanatçılar: |相似艺术家: ";

	const uniq = a => {const out = [], seen = {}; let j = 0; a.forEach(v => {const item = v.toLowerCase(); if (seen[item] !== 1) {seen[item] = 1; out[j++] = v.titlecase().replace(/\bAor\b/g, "AOR").replace(/\bDj\b/g, "DJ").replace(/\bFc\b/g, "FC").replace(/\bIdm\b/g, "IDM").replace(/\bNwobhm\b/g, "NWOBHM").replace(/\bR&b\b/g, "R&B").replace(/\bRnb\b/g, "RnB").replace(/\bUsa\b/g, "USA").replace(/\bUs\b/g, "US").replace(/\bUk\b/g, "UK");}}); return out;}

	const lfmTidy = (n, a, l) => {
		n = n.split('\n')[0].trim().split(", ");
		const match = (v, a, l) => {v = v.toLowerCase(); if (v == a.toLowerCase() || v == sBio.removeDiacritics(a).toLowerCase() || v == l.toLowerCase()) return true;}
		if (this.cleanNo) n.forEach((v, i) => {n[i] = v.replace(/\b(\d\d\d\d).+\b/g, "$1").replace(/\b(\d\d)'s\b/gi, "$1s").replace(/^\b(twenties|192\d(s|))\b/gi, "20s").replace(/^\b(thirties|193\d(s|))\b/gi, "30s").replace(/^\b(forties|194\d(s|))\b/gi, "40s").replace(/^\b(fifties|195\d(s|))\b/gi, "50s").replace(/^\b(sixties|196\d(s|))\b/gi, "60s").replace(/^\b(seventies|197\d(s|))\b/gi, "70s").replace(/^\b(eighties|198\d(s|))\b/gi, "80s").replace(/^\b(nineties|199\d(s|))\b/gi, "90s").replace(/^\b(noughties|200\d(s|))\b/gi, "00s").replace(/^\b(tens|201\d(s|))\b/gi, "10s"); if ((/\b\d\ds\b/).test(n[i])) n[i] = n[i].replace(/\b(\d\ds).+\b/, "$1"); else n[i] = n[i].replace(/.*\d.*/, "");});
		if (this.stripNames) n = n.filter(v => !match(v, a, l));
		if (this.runReplace) n.forEach((v, i) => {arr1.forEach((w, j) => {if (v.toLowerCase() == w.toLowerCase()) n[i] = arr2[j];});});
		n = n.filter(v => v); n = uniq(n); return n;
	}

	this.check = handles => {
		if (!handles) return;
		let a = "", a_o = "####", rec = 0, writeSent = false;
		const tf_a = FbTitleFormat(pBio.tf.a), artists = tf_a.EvalWithMetadbs(handles), sa = [], simArr = [];
		for (let i = 0; i < handles.Count; i++) {a = artists[i].toUpperCase(); if (a != a_o) {a_o = a; sa[i] = ""; const lfmBio = pBio.cleanPth(pBio.pth.lfmBio, handles[i], 'tag') + a.clean() + ".txt"; if (sBio.file(lfmBio)) {const lfm_a = sBio.open(lfmBio); let sim = lfm_a.match(RegExp(kw)); if (sim) {sim = sim.toString(); ix = lfm_a.lastIndexOf(sim); if (ix != -1) {sa[i] = lfm_a.substring(ix + sim.length); sa[i] = sa[i].split('\n')[0].trim().split(", "); if (sa[i].length > 6) simArr.push(a);}}}}}
		if (simArr.length) {let i = 0; timerBio.clear(timerBio.sim1); timerBio.sim1.id = setInterval(() => {if (i < simArr.length) {const lfm_similar = new Lfm_similar_artists(() => lfm_similar.on_state_change(), lfm_similar_search_done); lfm_similar.Search(simArr[i], simArr.length, handles, 6); i++;} else timerBio.clear(timerBio.sim1);}, simArr.length < 100 ? 20 : 300);} else this.write_tags(handles);
		const lfm_similar_search_done = (res1, res2, p_done, p_handles) => {rec++; if (!timerBio.sim2.id) timerBio.sim2.id = setTimeout(() => {writeSent = true; this.write_tags(p_handles); timerBio.sim2.id = null;}, 60000); simList.push({name:res1,similar:res2}); if (p_done == rec && !writeSent) {timerBio.clear(timerBio.sim2); this.write_tags(p_handles);}};
	}

	this.write_tags = handles => {
		if (!handles) return;
		let a = "", a_o = "####",  aa = "", aa_o = "####", l = "", l_o = "####";
		const albGenre_am = [], albTags = [], amMoods = [], amRating = [], amThemes = [], artGenre_am = [], artTags = [], cue = [], locale = [], rem = [], sa = [], tags = [];
		const tf_a = FbTitleFormat(pBio.tf.a), tf_aa = FbTitleFormat(pBio.tf.aa), tf_cue = FbTitleFormat("$ext(%path%)"), tf_l = FbTitleFormat(pBio.tf.l);
		const artists = tf_a.EvalWithMetadbs(handles), albumartists = tf_aa.EvalWithMetadbs(handles), cues = tf_cue.EvalWithMetadbs(handles), albums = tf_l.EvalWithMetadbs(handles);
		for (let i = 0; i < handles.Count; i++) {
			a = artists[i].toUpperCase(); aa = albumartists[i].toUpperCase(); cue[i] = cues[i].toLowerCase() == "cue"; l = albums[i].toUpperCase();
			if (!name.alb_strip) l = l.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();
			else l = l.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();
			if (a != a_o) {
				a_o = a; sa[i] = "";
				if (pBio.tag[6].enabled || pBio.tag[7].enabled || pBio.tag[8].enabled && pBio.tag[8].enabled < 7) {
					artTags[i] = ""; locale[i] = ""; const lfmBio = pBio.cleanPth(pBio.pth.lfmBio, handles[i], 'tag') + a.clean() + ".txt";
					if (sBio.file(lfmBio)) {
						const lfm_a = sBio.open(lfmBio);
						if (pBio.tag[6].enabled) {ix = lfm_a.lastIndexOf("Top Tags: "); if (ix != -1) {artTags[i] = lfm_a.substring(ix + 10); artTags[i] = lfmTidy(artTags[i], a, l);}}
						if (pBio.tag[7].enabled) {
							let loc = lfm_a.match(RegExp(kww, "i")); if (loc) {
								loc = loc.toString();
								ix = lfm_a.lastIndexOf(loc);
								if (ix != -1) {
									locale[i] = lfm_a.substring(ix + loc.length);
									locale[i] = locale[i].split('\n')[0].trim().split(", ");
						}}}
						if (pBio.tag[8].enabled && pBio.tag[8].enabled < 7) {
							let sim = lfm_a.match(RegExp(kw)); if (sim) {
								sim = sim.toString(); ix = lfm_a.lastIndexOf(sim); if (ix != -1) {
									sa[i] = lfm_a.substring(ix + sim.length); sa[i] = sa[i].split('\n')[0].trim().split(", ");
								}
								if (sa[i].length > 6) {
									sa[i] = ""; simList.some(v => {
										if (v.name == a && v.similar.length) {
											sa[i] =  v.similar; return true;
								}});}
								if (sa[i]) $Bio.take(sa[i], pBio.tag[8].enabled);
				}}}}
				if (pBio.tag[8].enabled > 6) {
					const lfmSim = pBio.cleanPth(pBio.pth.lfmSim, handles[i], 'tag') + a.clean() + " And Similar Artists.json"; let nm = ""; sa[i] = "";
					if (sBio.file(lfmSim)) {const lfm_s = sBio.jsonParse(lfmSim, false, 'file'); let newStyle = false; if (lfm_s) {
						if (sBio.objHasOwnProperty(lfm_s[0], 'name')) {newStyle = true; lfm_s.shift();}
						$Bio.take(lfm_s, pBio.tag[8].enabled);
						if (lfm_s.length) {
							sa[i] = [];
							lfm_s.forEach(v => {
								nm = newStyle ? v.name : v; if (nm) sa[i].push(nm);
				});}}}}
				if (!sa[i].length) sa[i] = "";
				if (pBio.tag[4].enabled) {
					artGenre_am[i] = ""; const amBio = pBio.cleanPth(pBio.pth.amBio, handles[i], 'tag') + a.clean() + ".txt";
					if (sBio.file(amBio)) {const am_a = sBio.open(amBio); ix = am_a.lastIndexOf("Genre: "); if (ix != -1) {artGenre_am[i] = am_a.substring(ix + 7); artGenre_am[i] = artGenre_am[i].split('\n')[0].trim().split(", ");}}
				}
			} else {artGenre_am[i] = artGenre_am[i - 1]; artTags[i] = artTags[i - 1]; locale[i] = locale[i - 1]; sa[i] = sa[i - 1];}
			if (aa + l != aa_o + l_o) {
				aa_o = aa; l_o = l;
				if (pBio.tag[0].enabled || pBio.tag[1].enabled || pBio.tag[2].enabled || pBio.tag[3].enabled) {
					albGenre_am[i] = ""; amMoods[i] = ""; amRating[i] = ""; amThemes[i] = ""; const amRev = pBio.cleanPth(pBio.pth.amRev, handles[i], 'tag') + aa.clean() + " - " + l.clean() + ".txt";
					if (sBio.file(amRev)) {
						const aRev = sBio.open(amRev);
						if (pBio.tag[0].enabled) {ix = aRev.lastIndexOf("Genre: "); if (ix != -1) {albGenre_am[i] = aRev.substring(ix + 7); albGenre_am[i] = albGenre_am[i].split('\n')[0].trim().split(", ");}}
						if (pBio.tag[1].enabled) {ix = aRev.lastIndexOf("Album Moods: "); if (ix != -1) {amMoods[i] = aRev.substring(ix + 13); amMoods[i] = amMoods[i].split('\n')[0].trim().split(", ");}}
						if (pBio.tag[2].enabled) {const b = aRev.indexOf(">> Album rating: ") + 17, f = aRev.indexOf(" <<"); if (b != -1 && f != -1 && f > b) {amRating[i] = aRev.substring(b, f).trim() * 2; if (amRating[i] == 0) amRating[i] = "";}}
						if (pBio.tag[3].enabled) {ix = aRev.lastIndexOf("Album Themes: "); if (ix != -1) {amThemes[i] = aRev.substring(ix + 14); amThemes[i] = amThemes[i].split('\n')[0].trim().split(", ");}}
					}
				}
				if (pBio.tag[5].enabled) {
					albTags[i] = ""; const lfmRev = pBio.cleanPth(pBio.pth.lfmRev, handles[i], 'tag') + aa.clean() + " - " + l.clean() + ".txt";
					if (sBio.file(lfmRev)) {const lRev = sBio.open(lfmRev); ix = lRev.lastIndexOf("Top Tags: "); if (ix != -1) {albTags[i] = lRev.substring(ix + 10); albTags[i] = lfmTidy(albTags[i], aa, l);}}
				}
			} else {albGenre_am[i] = albGenre_am[i - 1]; amMoods[i] = amMoods[i - 1]; amRating[i] = amRating[i - 1]; amThemes[i] = amThemes[i- 1]; albTags[i] = albTags[i - 1];}
		}
		for (let i = 0; i < handles.Count; i++) {
			let tg = {}, albG_amkey = "", albM_amkey = "", albR_amkey = "", albT_amkey = "", artG_amkey = "", albG_lfkey = "", artG_lfkey = "", localekey = "", sikey = "";
			if (!cue[i] && (albGenre_am[i] || amMoods[i] || amRating[i] || amThemes[i] || artGenre_am[i] ||  albTags[i] || artTags[i] || locale[i] || sa[i])) {tg = {};
				albG_amkey = albGenre_am[i] ? pBio.tag[0].name : "##Null##"; tg[albG_amkey] = albGenre_am[i];
				albM_amkey = amMoods[i] ? pBio.tag[1].name : "##Null##"; tg[albM_amkey] = amMoods[i];
				albR_amkey = amRating[i] ? pBio.tag[2].name : "##Null##"; tg[albR_amkey] = amRating[i];
				albT_amkey = amThemes[i] ? pBio.tag[3].name : "##Null##"; tg[albT_amkey] = amThemes[i];
				artG_amkey = artGenre_am[i] ? pBio.tag[4].name : "##Null##"; tg[artG_amkey] = artGenre_am[i];
				albG_lfkey = albTags[i] ? pBio.tag[5].name : "##Null##"; tg[albG_lfkey] = albTags[i];
				artG_lfkey = artTags[i] ? pBio.tag[6].name : "##Null##"; tg[artG_lfkey] = artTags[i];
				localekey = locale[i] ? pBio.tag[7].name : "##Null##"; tg[localekey] = locale[i];
				sikey = sa[i] ? pBio.tag[8].name : "##Null##"; tg[sikey] = sa[i];
				tags.push(tg);
			} else rem.push(i);
		}
		let i = rem.length; while (i--) handles.RemoveById(rem[i]);
		if (handles.Count) handles.UpdateFileInfoFromJSON(JSON.stringify(tags));
	}
}

function TextBoxBio() {
	this.x; this.y; this.w; this.h;
	const font_e = gdi.Font("Segoe UI", 15 * sBio.scale, 1), lc = StringFormat(0, 1);
	let init_x = 0, init_y = 0, x_init = 0, y_init = 0, si = "", st = ""; this.down = false; this.focus = true;

	const editText = () => (ppt.text_only ? "Type: Text Only" : (ppt.img_only ? "Type: Image Only" : "Name: " + pBio.style_arr[ppt.style] + (ppt.style < 4 ? "\n\nType: Auto\n - Layout Adjust: Drag Line" : "\n\nType: Freestyle\n - Layout Adjust: Drag Lines or Boxes: Ctrl (Any), Ctrl + Alt (Image) or Ctrl + Shift (Text)\n - Overlay Strength: Shift + Wheel Over Text"))) + (imgBio.reflection() && !ppt.text_only ? "\n - Reflection Strength: Shift + Wheel Over Main Image" : "") + (!ppt.img_only ? "\n - Text Size: Ctrl + Wheel Over Text" : "") + "\n - Padding: Panel Properties";
	const sizes = bypass => {pBio.sizes(bypass); butBio.check(); t.paint();}

	this.lbtn_dn = (x, y) => {pBio.newStyle = false; if (!vkBio.k('ctrl')) return; this.down = true; init_x = x; init_y = y; x_init = x; y_init = y;}

	this.lbtn_up = () => {
		if (!this.down) return; window.SetCursor(32512); this.down = false; imgBio.resetFade = true;
		if (ppt.style > 3) {
			const obj = ppt.style == 4 ? pBio.overlay : pBio.styles[ppt.style - 5];
			const imL = Math.round(pBio.im_l * pBio.w), imR = Math.round(pBio.im_r * pBio.w), imT = Math.round(pBio.im_t * pBio.h), imB = Math.round(pBio.im_b * pBio.h), txL = Math.round(pBio.tx_l * pBio.w), txR = Math.round(pBio.tx_r * pBio.w), txT = Math.round(pBio.tx_t * pBio.h), txB = Math.round(pBio.tx_b * pBio.h);
			let sv = false;
			if (pBio.h > txB + txT + ppt.textT + ppt.textB + 10 && pBio.w > txR + txL + ppt.textL + ppt.textR + 10) {obj.txL = pBio.tx_l; obj.txR = pBio.tx_r; obj.txT = pBio.tx_t; obj.txB = pBio.tx_b; sv = true;}
			if (pBio.h > imB + imT + pBio.bor_t + pBio.bor_b + 10 && pBio.w > imR + imL + pBio.bor_l + pBio.bor_r + 10) {obj.imL = pBio.im_l; obj.imR = pBio.im_r; obj.imT = pBio.im_t; obj.imB = pBio.im_b; sv = true;}
			if (sv) {ppt.style == 4 ? ppt.overlay = JSON.stringify(pBio.overlay) : ppt.styles = JSON.stringify(pBio.styles);}
			else {pBio.im_l = sBio.clamp(obj.imL, 0, 1); pBio.im_r = sBio.clamp(obj.imR, 0, 1); pBio.im_t = sBio.clamp(obj.imT, 0, 1); pBio.im_b = sBio.clamp(obj.imB, 0, 1); pBio.tx_l = sBio.clamp(obj.txL, 0, 1); pBio.tx_r = sBio.clamp(obj.txR, 0, 1); pBio.tx_t = sBio.clamp(obj.txT, 0, 1); pBio.tx_b = sBio.clamp(obj.txB, 0, 1);}
		} t.toggle(13);
	}

	const setCursor = n => {
		let c = 0; switch (n) {
			case "all": c = 32646; break;
			case "left": case "right": c = 32644; break;
			case "ne": case "sw": c = 32643; break;
			case "nw": case "se": c = 32642; break;
			case "top": case "bottom": c = 32645; break;
		}
		if (c) window.SetCursor(c);
	}

	this.move = (x, y) => {
		if (ppt.style < 4 || !vkBio.k('ctrl') || vkBio.k('alt') || !this.focus) return;
		if (!this.down) {
			st = y > pBio.tBoxT - 5 && y < pBio.tBoxT + 5 && x > pBio.tBoxL + 10 && x < pBio.tBoxL + pBio.tBoxW - 10 ? "top" :
			y > pBio.tBoxT - 5 && y < pBio.tBoxT + 15 && x > pBio.tBoxL && x < pBio.tBoxL + 10 ? "nw" :
			y > pBio.tBoxT - 5 && y < pBio.tBoxT + 15 && x > pBio.tBoxL + pBio.tBoxW - 10 && x < pBio.tBoxL + pBio.tBoxW ? "ne" :
			y > pBio.tBoxT + pBio.tBoxH - 5 && y < pBio.tBoxT + pBio.tBoxH + 5 && x > pBio.tBoxL + 10 && x < pBio.tBoxL + pBio.tBoxW - 10 ? "bottom" :
			y > pBio.tBoxT + pBio.tBoxH - 15 && y < pBio.tBoxT + pBio.tBoxH + 5 && x > pBio.tBoxL && x < pBio.tBoxL + 10 ? "sw" :
			y > pBio.tBoxT + pBio.tBoxH - 15 && y < pBio.tBoxT + pBio.tBoxH + 5 && x > pBio.tBoxL + pBio.tBoxW - 10 && x < pBio.tBoxL + pBio.tBoxW ? "se" :
			y > pBio.tBoxT + 10 && y < pBio.tBoxT + pBio.tBoxH && x > pBio.tBoxL - 5 && x < pBio.tBoxL + 5 ? "left" :
			y > pBio.tBoxT + 10 && y < pBio.tBoxT + pBio.tBoxH && x > pBio.tBoxL + pBio.tBoxW - 5 && x < pBio.tBoxL + pBio.tBoxW + 5 ? "right" :
			y > pBio.tBoxT + 20 && y < pBio.tBoxT + pBio.tBoxH - 20 && x > pBio.tBoxL + 20 && x < pBio.tBoxL + pBio.tBoxW - 20 ? "all": "";
			setCursor(st);
		} if (!this.down) return; let txT = Math.round(pBio.tx_t * pBio.h), txB = Math.round(pBio.tx_b * pBio.h), txL = Math.round(pBio.tx_l * pBio.w), txR = Math.round(pBio.tx_r * pBio.w);
		switch (st){
			case "top": if (y > pBio.h - txB - pBio.minH) break; pBio.tx_t = sBio.clamp(y / pBio.h, 0, 1); break;
			case "nw": if (y < pBio.h - txB - pBio.minH) pBio.tx_t = sBio.clamp(y / pBio.h, 0, 1); if (x > pBio.w - txR - 30) break; pBio.tx_l = sBio.clamp(x / pBio.w, 0, 1); break;
			case "ne": if (y < pBio.h - txB - pBio.minH) pBio.tx_t = sBio.clamp(y / pBio.h, 0, 1); if (x < txL + 30) break; pBio.tx_r = sBio.clamp((pBio.w - x) / pBio.w, 0, 1); break;
			case "left": if (x > pBio.w - txR - 30) break; pBio.tx_l = sBio.clamp(x / pBio.w, 0, 1); break;
			case "bottom": if (y < txT + pBio.minH) break; pBio.tx_b = sBio.clamp((pBio.h - y) / pBio.h, 0, 1); break;
			case "sw": if (x < pBio.w - txR - 30) pBio.tx_l = sBio.clamp(x / pBio.w, 0, 1); if (y < txT + pBio.minH) break; pBio.tx_b = sBio.clamp((pBio.h - y) / pBio.h, 0, 1); break;
			case "se": if (y > txT + pBio.minH) pBio.tx_b = sBio.clamp((pBio.h - y) / pBio.h, 0, 1); if (x < txL + 30) break; pBio.tx_r = sBio.clamp((pBio.w - x) / pBio.w, 0, 1); break;
			case "right": if (x < txL + 30) break; pBio.tx_r = sBio.clamp((pBio.w - x) / pBio.w, 0, 1); break;
			case "all": if ((txT >= pBio.h - pBio.tBoxH && y - init_y > 0) || (txL >= pBio.w - pBio.tBoxW && x - init_x > 0)) break; txT += (y - init_y); pBio.tx_t = sBio.clamp(txT / pBio.h, 0, 1); txL += (x - init_x); pBio.tx_l = sBio.clamp(txL / pBio.w, 0, 1); txB = pBio.h - Math.max(txT, 0) - pBio.tBoxH; pBio.tx_b = sBio.clamp(txB / pBio.h, 0, 1); txR = pBio.w - Math.max(txL, 0) - pBio.tBoxW; pBio.tx_r = sBio.clamp(txR / pBio.w, 0, 1); break;
		} sizes(true); init_x = x; init_y = y;
	}

	this.img_move = (x, y) => {
		if (!this.focus) return;
		switch (true) {
			case ppt.style > 3: {
				if (!vkBio.k('ctrl') || vkBio.k('shift')) break;
				if (!this.down) {
					si = y > pBio.iBoxT - 5 && y < pBio.iBoxT + 5 && x > pBio.iBoxL + 10 && x < pBio.iBoxL + pBio.iBoxW - 10 ? "top" :
					y > pBio.iBoxT - 5 && y < pBio.iBoxT + 15 && x > pBio.iBoxL && x < pBio.iBoxL + 10 ? "nw" :
					y > pBio.iBoxT - 5 && y < pBio.iBoxT + 15 && x > pBio.iBoxL + pBio.iBoxW - 10 && x < pBio.iBoxL + pBio.iBoxW ? "ne" :
					y > pBio.iBoxT + pBio.iBoxH - 5 && y < pBio.iBoxT + pBio.iBoxH + 5 && x > pBio.iBoxL + 10 && x < pBio.iBoxL + pBio.iBoxW - 5 ? "bottom" :
					y > pBio.iBoxT + pBio.iBoxH - 15 && y < pBio.iBoxT + pBio.iBoxH + 5 && x > pBio.iBoxL && x < pBio.iBoxL + 10 ? "sw" :
					y > pBio.iBoxT + pBio.iBoxH - 15 && y < pBio.iBoxT + pBio.iBoxH + 5 && x > pBio.iBoxL + pBio.iBoxW - 10 && x < pBio.iBoxL + pBio.iBoxW ? "se" :
					y > pBio.iBoxT && y < pBio.iBoxT + pBio.iBoxH && x > pBio.iBoxL - 5 && x < pBio.iBoxL + 5 ? "left" :
					y > pBio.iBoxT && y < pBio.iBoxT + pBio.iBoxH && x > pBio.iBoxL + pBio.iBoxW - 5 && x < pBio.iBoxL + pBio.iBoxW + 5 ? "right" :
					y > pBio.iBoxT + 20 && y < pBio.iBoxT + pBio.iBoxH - 20 && x > pBio.iBoxL + 20 && x < pBio.iBoxL + pBio.iBoxW - 20 ? "all": "";
					setCursor(si);
				} if (!this.down) return;
				let imT = Math.round(pBio.im_t * pBio.h), imB = Math.round(pBio.im_b * pBio.h), imL = Math.round(pBio.im_l * pBio.w), imR = Math.round(pBio.im_r * pBio.w);
				switch (si){
					case "top": if (y > pBio.h - imB - 30) break; pBio.im_t = sBio.clamp(y / pBio.h, 0, 1); break;
					case "nw": if (y < pBio.h - imB - 30) pBio.im_t = sBio.clamp(y / pBio.h, 0, 1); if (x > pBio.w - imR - 30) break; pBio.im_l = sBio.clamp(x / pBio.w, 0, 1); break;
					case "ne": if (y < pBio.h - imB - 30) pBio.im_t = sBio.clamp(y / pBio.h, 0, 1); if (x < imL + 30) break; pBio.im_r = sBio.clamp((pBio.w - x) / pBio.w, 0, 1); break;
					case "left": if (x > pBio.w - imR - 30) break; pBio.im_l = sBio.clamp(x / pBio.w, 0, 1); break;
					case "bottom": if (y < imT + 30) break; pBio.im_b = sBio.clamp((pBio.h - y) / pBio.h, 0, 1); break;
					case "sw": if (x < pBio.w - imR - 30) pBio.im_l = sBio.clamp(x / pBio.w, 0, 1); if (y < imT + 30) break; pBio.im_b = sBio.clamp((pBio.h - y) / pBio.h, 0, 1); break;
					case "se":if (y > imT + 30) pBio.im_b = sBio.clamp((pBio.h - y) / pBio.h, 0, 1); if (x < imL + 30) break; pBio.im_r = sBio.clamp((pBio.w - x) / pBio.w, 0, 1); break;
					case "right": if (x < imL + 30) break; pBio.im_r = sBio.clamp((pBio.w - x) / pBio.w, 0, 1); break;
					case "all": if ((imT >= pBio.h - pBio.iBoxH && y - y_init > 0) || (imL >= pBio.w - pBio.iBoxW && x - x_init > 0)) break; imT += (y - y_init); pBio.im_t = sBio.clamp(imT / pBio.h, 0, 1); imB = pBio.h - Math.max(imT, 0) - pBio.iBoxH; pBio.im_b = sBio.clamp(imB / pBio.h, 0, 1); imL += (x - x_init); pBio.im_l = sBio.clamp(imL / pBio.w, 0, 1); imR = pBio.w - Math.max(imL, 0) - pBio.iBoxW; pBio.im_r = sBio.clamp(imR / pBio.w, 0, 1); break;
				} sizes(true);
				break;
			}
			case ppt.style < 4:
				if (!vkBio.k('ctrl')) break;
				if (!this.down) {switch (ppt.style) {case 0: si = y > pBio.img_t + pBio.imgs && y < pBio.img_t + pBio.imgs + 5; if (si) window.SetCursor(32645); break; case 1: si = x > pBio.img_l - 5 && x < pBio.img_l; if (si) window.SetCursor(32644); break; case 2: si = y > pBio.img_t - 5 && y < pBio.img_t; if (si) window.SetCursor(32645); break; case 3: si = x > pBio.img_l + pBio.imgs && x < pBio.img_l + pBio.imgs + 5; if (si) window.SetCursor(32644); break;}}
				if (!this.down || !si) return;
				switch (ppt.style) {case 0: ppt.rel_imgs = (ppt.rel_imgs * pBio.h + y - y_init) / pBio.h; break; case 1: ppt.rel_imgs = (ppt.rel_imgs * pBio.w + x_init - x) / pBio.w; break; case 2: ppt.rel_imgs = (ppt.rel_imgs * pBio.h + y_init - y) / pBio.h; break; case 3: ppt.rel_imgs = (ppt.rel_imgs * pBio.w + x - x_init) / pBio.w; break;}
				ppt.rel_imgs = sBio.clamp(ppt.rel_imgs, 0.1, 0.9); sizes();
				break;
		} x_init = x; y_init = y;
	}

	this.drawEd = gr => {
		if (vkBio.k('ctrl') && this.focus && pBio.m_y != -1 || pBio.newStyle) {
			const ed = gr.MeasureString(editText(), font_e, 15, 15, pBio.w - 15, pBio.h - 15, lc);
			gr.FillSolidRect(10, 10, ed.Width + 10, ed.Height + 10, uiBio.col.edBg);
			if (!ppt.text_only && !ppt.img_only) {
				if (ppt.style > 3) {if (!vkBio.k('shift')) gr.DrawRect(pBio.iBoxL + 2, pBio.iBoxT + 2, pBio.iBoxW - 4, pBio.iBoxH - 4, 5, RGB(0, 255, 0)); if (!vkBio.k('alt')) gr.DrawRect(pBio.tBoxL + 2, pBio.tBoxT + 2, pBio.tBoxW - 4, pBio.tBoxH - 4, 5, RGB(255, 0, 0));}
				else if (ppt.style < 4) {switch (ppt.style) {case 0: gr.FillSolidRect(0, pBio.img_t + pBio.imgs, pBio.w, 5, RGB(255, 128, 0)); break; case 1: gr.FillSolidRect(pBio.img_l - 5, 0, 5, pBio.h, RGB(255, 128, 0)); break; case 2: gr.FillSolidRect(0, pBio.img_t - 5, pBio.w, 5, RGB(255, 128, 0)); break; case 3: gr.FillSolidRect(pBio.img_l + pBio.imgs, 0, 5, pBio.h, RGB(255, 128, 0)); break;}}
			} gr.SetTextRenderingHint(5); gr.DrawString(editText(), font_e, uiBio.col.shadow, 16, 16, ed.Width, ed.Height, lc); gr.DrawString(editText(), font_e, uiBio.col.text_h, 15, 15, ed.Width, ed.Height, lc);
		}
	}
}

function LibraryBio() {
	let db_lib, items, q = "", ql; this.update = true; this.get_lib_items = () => {if (!this.update) return db_lib; this.update = false; db_lib = fb.GetLibraryItems(); return db_lib;}
	this.in_library = (type, a, l) => {
		switch (type) {
			case 1:
				q = ""; ql = "";
				pBio.albartFields.forEach((v, i) => q += (i ? " OR " : "") + v + " IS " + a);
				pBio.albFields.forEach((v, i) => ql += (i ? " OR " : "") + v + " IS " + l);
				items = sBio.query(this.get_lib_items(), "(" + q + ") AND (" + ql + ")"); if (!items.Count) return false; return items.Count;
			case 2:
				q = "(" + "\"" + pBio.def_tf[0].tf + "\"" + " IS " + a + ") AND ((" + "\"" + pBio.def_tf[2].tf + "\"" + " IS " + l + ") OR (" + "\"" + "$trim($replace($replace(" + pBio.def_tf[2].tf + ",CD1,,CD2,,CD3,,CD 1,,CD 2,,CD 3,,CD.01,,CD.02,,CD.03,,CD One,,CD Two,,CD Three,,Disc1,,Disc2,,Disc3,,Disc 1,,Disc 2,,Disc 3,,Disc One,,Disc Two,,Disc Three,,Disc I,,Disc II,,Disc III,,'()',,'[]',),  , ,'()',,'[]',))" + "\"" + " IS " + l + "))";
				items = sBio.query(this.get_lib_items(), q); if (!items.Count) return false; return items[0];
			default: q = "";
				pBio.artFields.forEach((v, i) => q += (i ? " OR " : "") + v + " IS " + a);
				items = sBio.query(this.get_lib_items(), q); if (!items.Count) return false; return !type ? true : items[0];
		}
}}

function ImagesBio() {
	this.x; this.y; this.w; this.h;
	this.albFolder = ""; this.blkArtist = ""; this.cycCov = ppt.loadCovAllFb || ppt.loadCovFolder; this.covTimestamp = Date.now(); this.crop = false; this.delay = Math.min(ppt.cycTimePic, 7) * 1000; this.displayed_other_panel = null; this.down = false; this.get = true; this.photoTimestamp = Date.now(); this.resetFade = false; this.adjustMode = false; this.touch = {dn: false, end: 0, start: 0}; this.undo = [];
	this.imgBar = ppt.imgBar;
	this.bar = {
		debounce: sBio.debounce(() => {if (this.imgBar == 2 || pBio.m_x > this.bar.x1 && pBio.m_x < this.bar.x1 + this.bar.w1 && pBio.m_y > this.bar.y1 + this.bar.y4 && pBio.m_y < this.bar.y1 + this.bar.y5) return; this.bar.show = false; paint();}, 3000),
		dn: false, disabled: false, dot_w: 4, grip_h: 10 * sBio.scale, gripOffset: 2, hand: false, imgNo: 0, l: 0, progMin: 0, progMax: 200, overlap: false, overlapCorr: 0, show: this.imgBar == 2 ? true : false, verticalCorr: 1.1565, x1: 25, x2: 26, x3: 25, x4: 29, y1: 25, y2: 200, y3: 201, y4: 200, y5: 200, w1: 100, w2: 110, h: 6 * sBio.scale
	}
	const aPth = fb.ProfilePath + "yttm\\artist_stub_user", art_img = {}, artImgFolder = pBio.albCovFolder.toUpperCase() == pBio.pth.imgArt.toUpperCase(), cov_img = {}, cPth = fb.ProfilePath + "yttm\\front_cover_stub_user", exclArr = [6467, 6473, 6500, 24104, 24121, 34738, 35875, 37235, 47700, 68626, 86884, 92172], ext = [".jpg", ".png", ".gif", ".bmp", ".jpeg"], blacklist_img = fb.ProfilePath + "yttm\\" + "blacklist_image.json", noimg = [], reflSetup = ppt.reflSetup.splt(0), reflSlope = sBio.clamp(sBio.value(reflSetup[5], 10, 0) / 10 - 1, -1, 9), reflSz = sBio.clamp(sBio.value(reflSetup[3], 100, 0) / 100, 0.1, 1); let transLevel = sBio.clamp(100 - ppt.transLevel, 0.1, 100); const transIncr = Math.pow(284.2171 / transLevel, 0.0625), userArtStubFile = fb.ProfilePath + "yttm\\artist_stub_user.png", userCovStubFile = fb.ProfilePath + "yttm\\front_cover_stub_user.png";
	const id = {albCounter: "", albCounter_o: "", albCyc: "", albCyc_o: "", album: "", album_o: "", artCounter: "", artCounter_o: "", blur: "", blur_o: "", img: "", img_o: "", w1: 0, w2: 0}
	let a_run = true, all_files_o_length = 0, alpha = 255, ap = "", artImages = [], artist = "", artist_o = "", blkArtist = "", blacklist = [], bor_w1 = 0, bor_w2 = 0, border = 0, chk_arr = [], circular = false, counter = 0, covCycle_ix = 1, covers = [{id: 0, pth: ""}], covImages = [], cp = "", cur_blur = null, cur_handle = null, cur_img = null, cur_imgPth = "", f_blur = null, fade_mask = null, fe_done = "", folder = "", folderSup = "", g_mask = null, i_x = 0, ix = 0, imgb = 0, imgx = 0, imgy = 0, imgw = 100, imgh = 100, init = true, new_BlurAlb = false, nh = 10, nhh = 10, nw = 10, refl_mask = null, reflAlpha = sBio.clamp(255 * sBio.value(reflSetup[1], 14.5, 0) / 100, 0, 255), reflection = false, s1 = 1, s2 = 1, sc = 1, sh_img = null, tw = 0, th = 0, userArtStub = null, userCovStub = null, validate = [], x_l = 0, x_r = 0, xa = 0, y_b = 0, y_t = 0, ya = 0;

	if (transLevel == 100) transLevel = 255;
	ext.some(v => {ap = aPth + v; if (sBio.file(ap)) {userArtStub = gdi.Image(ap); return true;}});
	ext.some(v => {cp = cPth + v; if (sBio.file(cp)) {userCovStub = gdi.Image(cp); return true;}});

	const blackListed = v => {blkArtist = this.blkArtist; this.blkArtist = artist || name.artist(ppt.focus); if (this.blkArtist && this.blkArtist != blkArtist) {blacklist = this.blacklist(this.blkArtist.clean().toLowerCase());} return blacklist.includes(v.slice(v.lastIndexOf("_") + 1));}
	const blurCheck = () => {if (!(ppt.covBlur && uiBio.blur) && !ppt.imgSmoothTrans) return; id.blur_o = id.blur; id.blur = name.albID(ppt.focus, 'stnd'); id.blur += ppt.covType; if (id.blur != id.blur_o) {new_BlurAlb = true; t.mulAlbum = false;}}
	const changeCov = incr => {covCycle_ix += incr; if (covCycle_ix < 1) covCycle_ix = covers.length - 1; else if (covCycle_ix >= covers.length) covCycle_ix = 1; i_x = covCycle_ix; if (cov.cacheHit(i_x, covers[i_x].pth)) return; cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, covers[i_x].pth);}
	const changePhoto = incr => {ix += incr; if (ix < 0) ix = artImages.length - 1; else if (ix >= artImages.length) ix = 0; let i = 0; while (this.displayed_other_panel == artImages[ix] && i < artImages.length) {ix += incr; if (ix < 0) ix = artImages.length - 1; else if (ix >= artImages.length) ix = 0; i++;} this.set_chk_arr(artImages[ix]); loadArtImage();}
	const clear = (a, type) => {a.forEach((v, i) => {if (!v) return; if (type == 0 && i == 0 || type == 1 && i) {if (v.img) v.img = null; v.time = 0; if (v.blur) v.blur = null;}});}
	const clear_cov_cache = () => cov.cache = [];
	const defStub = () => {if (sBio.handle(ppt.focus)) {const n = ppt.artistView ? 1 : 0; return noimg[n].Clone(0, 0, noimg[n].Width, noimg[n].Height);} else {return noimg[2].Clone(0, 0, noimg[2].Width, noimg[2].Height);}}
	const getImgFallback = () => {if (t.scrollbar_type().draw_timer) return; if (!pBio.multi_new()) {paint(); this.get = false; return;} this.get_images(); this.get = false;}
	const incl_lge = 0; // incl_lge 0 & 1 - exclude & include artist images > 8 MB
	const images = v => {if (!sBio.file(v)) return false; const fileSize = utils.FileTest(v, "s"); return (incl_lge || fileSize <= 8388608) && ((/_([a-z0-9]){32}\.jpg$/).test(sBio.fs.GetFileName(v)) || !ppt.cycPhotoLfmOnly && (/(?:jpe?g|gif|png|bmp)$/i).test(sBio.fs.GetExtensionName(v)) && !(/ - /).test(sBio.fs.GetBaseName(v))) && !exclArr.includes(fileSize) && !blackListed(v);}
	const cycImages = artImgFolder ? images : v => {if (!sBio.file(v)) return false; const fileSize = utils.FileTest(v, "s"); return (incl_lge || fileSize <= 8388608) && (/(?:jpe?g|gif|png|bmp)$/i).test(sBio.fs.GetExtensionName(v));}
	const imgBorder = () => {switch (ppt.artistView) {case true: return !ppt.img_only ? ppt.artBorderDual : ppt.artBorderImgOnly; case false: return !ppt.img_only ? ppt.covBorderDual : ppt.covBorderImgOnly;}}
	const imgCircular = () => ppt.artistView && (ppt.artCircImgOnly && ppt.img_only || ppt.artCircDual && !ppt.img_only) || !ppt.artistView && (ppt.covCircImgOnly && ppt.img_only || ppt.covCircDual && !ppt.img_only);
	const intersectRect = () => !(pBio.tBoxL > pBio.iBoxL + pBio.iBoxW || pBio.tBoxL + pBio.tBoxW < pBio.iBoxL || pBio.tBoxT > pBio.iBoxT + pBio.iBoxH || pBio.tBoxT + pBio.tBoxH < pBio.iBoxT);
	const memoryLimit = () => window.PanelMemoryUsage / window.MemoryLimit > 0.4 || window.TotalMemoryUsage / window.MemoryLimit > 0.5;
	const paint = () => {if (!ppt.imgSmoothTrans) {alpha = 255; t.paint(); return;} id.img_o = id.img; id.img = cur_imgPth; if (id.img_o != id.img) alpha = transLevel; else alpha = 255; timerBio.clear(timerBio.transition); timerBio.transition.id = setInterval(() => {alpha = Math.min(alpha *= transIncr, 255); t.paint(); if (alpha == 255) timerBio.clear(timerBio.transition);}, 12);}
	const resetCounters = () => {if (pBio.lock) return; id.albCounter_o = id.albCounter; id.albCounter = name.albID(ppt.focus, 'full'); if (id.albCounter != id.albCounter_o || !id.albCounter) {counter = 0; menBio.revCounter = 0;} id.artCounter_o = id.artCounter; id.artCounter = name.artist(ppt.focus); if (id.artCounter && id.artCounter != id.artCounter_o || !id.artCounter) {counter = 0; menBio.bioCounter = 0;}}
	const setCov = sBio.debounce(() => {if (i_x < 1) i_x = covers.length - 1; else if (i_x >= covers.length) i_x = 1; covCycle_ix = i_x; if (cov.cacheHit(i_x, covers[i_x].pth)) return; cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, covers[i_x].pth); this.covTimestamp = Date.now();}, 100);
	const setPhoto = sBio.debounce(() => {if (ix < 0) ix = artImages.length - 1; else if (ix >= artImages.length) ix = 0; loadArtImage(); this.photoTimestamp = Date.now();}, 100);
	const setReflStrength = n => {reflAlpha += n; reflAlpha = sBio.clamp(reflAlpha, 0, 255); ppt.reflSetup = "Strength," + Math.round(reflAlpha / 2.55) + ",Size," + reflSetup[3] + ",Gradient," + reflSetup[5]; refl_mask = false; this.adjustMode = true; if (ppt.artistView && ppt.cycPhoto) this.clear_a_rs_cache(); if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) this.get_images(); else this.get_multi(pBio.art_ix, pBio.alb_ix);}
	const sort = (data, prop) => {data.sort((a, b) => a[prop] - b[prop]); return data;}
	const uniq = a => [...new Set(a)];
	const uniqPth = a => {const flags = []; let result = []; a.forEach(v => {const vpth = v.pth.toLowerCase(); if (flags[vpth]) return; result.push(v); flags[vpth] = true;}); return result;}

	this.artist_reset = force => {if (pBio.lock) return; blurCheck(); artist_o = artist; artist = name.artist(ppt.focus); const new_artist = artist && artist != artist_o || !artist || ppt.covBlur && uiBio.blur && id.blur != id.blur_o || force; if (new_artist) {folderSup = ""; folder = pBio.cleanPth(pBio.pth.imgArt, ppt.focus); this.clear_art_cache(); if (ppt.cycPhoto) a_run = true; if (!artImages.length) {all_files_o_length = 0; ix = 0;}}}
	this.blacklist = clean_artist => {let black_list = []; if (!sBio.file(blacklist_img)) return black_list; const list = sBio.jsonParse(blacklist_img, false, 'file'); return list.blacklist[clean_artist] || black_list;}
	this.chk_arr = info => {if (t.block()) return; if (artImages.length < 2 || !ppt.artistView || ppt.text_only || !ppt.cycPhoto) return; if (!validate.includes(info[0])) validate.push(info[0]); this.displayed_other_panel = info[1]; if (!id.w1) id.w1 = info[0]; id.w2 = (id.w1== info[0]) ? 0 : info[0]; if (artImages[ix] != info[2] && !id.w2) {chk_arr = [window.ID, artImages[ix], this.displayed_other_panel]; window.NotifyOthers("chk_arr_bio", chk_arr);} if (window.ID > info[0]) return; if (artImages[ix] == this.displayed_other_panel && validate.length < 2) changePhoto(1);}
	this.chkArtImg = () => {id.albCyc = ""; id.albCyc_o = ""; this.clear_art_cache(); clear_cov_cache(); if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) {a_run = true; if (!artImages.length) {all_files_o_length = 0; ix = 0;} if (ppt.artistView && ppt.cycPhoto) this.getArtImg(); else this.getFbImg();} else this.get_multi(pBio.art_ix, pBio.alb_ix, true);}
	this.clear_a_rs_cache = () => {art.cache = []; clear(cov.cache, 0);}
	this.clear_c_rs_cache = () => clear(cov.cache, 1);
	this.clear_art_cache = () => {artImages = []; validate = []; this.clear_a_rs_cache();}
	this.clear_rs_cache = () => {this.clear_c_rs_cache(); this.clear_a_rs_cache();}
	this.create_images = () => {const cc = StringFormat(1, 1), font1 = gdi.Font("Segoe UI", 184, 1), font2 = gdi.Font("Segoe UI", 80, 1), font3 = gdi.Font("Segoe UI", 200, 1), font4 = gdi.Font("Segoe UI", 90, 1), tcol = !ppt.blurDark && !ppt.blurLight && !ppt.style === 0 || (ppt.imgBorder != 1 && ppt.imgBorder != 3) ? uiBio.col.text : uiBio.dui ? window.GetColourDUI(0) : window.GetColourCUI(0); for (let i = 0; i < 3; i++) {noimg[i] = sBio.gr(500, 500, true, g => {g.SetSmoothingMode(2); if (!ppt.blurDark && !ppt.blurLight && !ppt.style === 0 || ppt.artBorderImgOnly == 1 || ppt.artBorderImgOnly == 3 || ppt.artBorderDual == 1 || ppt.artBorderDual == 3 || ppt.covBorderImgOnly == 1 || ppt.covBorderImgOnly == 3 || ppt.covBorderDual == 1 || ppt.covBorderDual == 3) {g.FillSolidRect(0, 0, 500, 500, tcol); g.FillGradRect(-1, 0, 505, 500, 90, uiBio.col.bg & 0xbbffffff, uiBio.col.bg, 1.0);} g.SetTextRenderingHint(3); g.DrawString("NO", i == 2 ? font3 : font1, tcol & (pref.whiteTheme || pref.blackTheme ? 0x80ffffff : 0xffffffff), 0, 0, 500, 355, cc); g.DrawString(["COVER", "PHOTO", "SELECTION"][i], i == 2 ? font4 : font2, tcol & (pref.whiteTheme || pref.blackTheme ? 0x80ffffff : 0xffffffff), 2.5, 220, 500, 260, cc); g.SetSmoothingMode(3); g.FillSolidRect(60, 290, 380, 2, tcol & (pref.whiteTheme || pref.blackTheme ? 0x80ffffff : 0xffffffff));}); g_mask = sBio.gr(500, 500, true, g => {g.FillSolidRect(0, 0, 500, 500, RGB(255, 255, 255)); g.SetSmoothingMode(2); g.FillEllipse(1, 1, 498, 498, RGBA(0, 0, 0, 255));});} this.get = true;}; this.create_images();
	this.fresh = () => {
		counter++; if (counter < ppt.cycTimePic) return; counter = 0;
		if (t.block() || !ppt.cycPic || ppt.text_only || this.bar.dn || pBio.zoom()) return;
		if (ppt.artistView) {
			if (artImages.length < 2 || Date.now() - this.photoTimestamp < this.delay || !ppt.cycPhoto) return; changePhoto(1);
		} else if (this.cycCov) {
			if (covers.length < 2 || Date.now() - this.covTimestamp < this.delay || pBio.alb_ix) return; changeCov(1);
		}
	}
	this.get_images = force => {if (ppt.text_only && !uiBio.blur) return; if (ppt.artistView && ppt.cycPhoto) {if (!pBio.art_ix) this.artist_reset(force); this.getArtImg();} else this.getFbImg();}
	this.getArtImg = update => {if (!ppt.artistView || ppt.text_only && !uiBio.blur) return; if (a_run || update) {a_run = false; if (artist) getArtImages();} this.set_chk_arr(ppt.cycPhoto ? artImages[ix] : null); loadArtImage();}
	this.grab = force => {if (t.block()) return this.get = true; this.getArtImg(true); if (force) this.getFbImg();}
	this.leave = () => {if (this.touch.dn) {this.touch.dn = false; this.touch.start = 0;}}
	this.on_playback_new_track = force => {resetCounters(); if (!pBio.multi_new() && !force) return; if (t.block()) {this.get = true; this.artist_reset();} else {if (ppt.artistView && ppt.cycPhoto) {this.artist_reset(); this.getArtImg();} else this.getFbImg(); this.get = false;}}
	this.on_size = () => {if (ppt.text_only) {this.clear_c_rs_cache(); this.getFbImg();} if (ppt.text_only && !uiBio.blur) return init = false; this.clear_a_rs_cache(); this.clear_c_rs_cache(); if (ppt.artistView) {if (init) this.artist_reset(); this.getArtImg();} else this.getFbImg(); init = false; if (ppt.img_only) pBio.get_multi(true); butBio.refresh(true);}
	this.pth = () => ({imgPth: ppt.text_only || !sBio.file(cur_imgPth) ? "" : cur_imgPth, artist: artist || name.artist(ppt.focus), blk: (/_([a-z0-9]){32}\.jpg$/).test(sBio.fs.GetFileName(cur_imgPth))});
	this.reflection = () => ppt.artistView && (ppt.artReflImgOnly && ppt.img_only || ppt.artReflDual && !ppt.img_only) || !ppt.artistView && (ppt.covReflImgOnly && ppt.img_only || ppt.covReflDual && !ppt.img_only);
	this.set_chk_arr = arr_ix => {chk_arr = [window.ID, arr_ix, this.displayed_other_panel]; window.NotifyOthers("chk_arr_bio", chk_arr);}
	this.set_id = () => {id.albCyc_o = id.albCyc; id.albCyc = name.albID(ppt.focus, 'full');}
	this.setCrop = sz => {const imgRefresh = ppt.img_only || !ppt.text_only && !t.text; this.crop = imgCircular() ? false : ppt.artistView && (ppt.artCropImgOnly && imgRefresh || ppt.artCropDual && !ppt.img_only) || !ppt.artistView && (ppt.covCropImgOnly && imgRefresh || ppt.covCropDual && !ppt.img_only); pBio.setBorder(imgRefresh && this.crop, imgBorder(), this.reflection()); if (sz) {pBio.sizes(); if (ppt.heading && !ppt.img_only) butBio.check();}}; if (ppt.img_only) this.setCrop(true);
	this.trace = (x, y) => {if (!ppt.autoEnlarge) return true; let arr = [], ex; if (ppt.artistView && ppt.cycPhoto && artImages.length) {arr = art.cache; ex = ix;} else {arr = cov.cache; ex = i_x;} if (ex >= arr.length || !arr[ex]) return false; return x > arr[ex].x && x < arr[ex].x + arr[ex].w && y > arr[ex].y && y < arr[ex].y + arr[ex].h;}
	this.wheel = step => {switch (vkBio.k('shift')) {case false: if (artImages.length > 1 && ppt.artistView && !ppt.text_only && ppt.cycPhoto) {changePhoto(-step); if (ppt.cycPic) this.photoTimestamp = Date.now();} if (this.cycCov && covers.length > 1 && !ppt.artistView && !ppt.text_only && !pBio.alb_ix) {changeCov(-step); if (this.cycCov) this.covTimestamp = Date.now();} break; case true: if (!pBio || (ppt.mul_item && butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y)) || pBio.text_trace || !this.reflection()) break; setReflStrength(-step * 5); break;}}

	this.chkPths = (pths, fn, type, extraPaths) => {
		let h = false;
		pths.some(v => {
			if (h) return true;
			const ph = !extraPaths ? v + fn : pBio.eval(v + fn, ppt.focus);
			ext.some(w => {
				const ep = ph + w;
				if (sBio.file(ep)) {
					h = true;
					switch (type) {
						case 0:
							if (cov.cacheHit(i_x, ep)) return true;
							cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, ep); return true;
						case 1: f_blur = gdi.Image(ep); return true;
						case 2: return true;
						case 3: h = ep; return true;
					}
				}
			});
		});
		return h;
	}

	this.get_multi = (art_ix, alb_ix, force) => {
		switch (true) {
			case ppt.artistView: {
				if (ppt.text_only && !uiBio.blur) return; artist_o = artist; const stndBio = !art_ix || art_ix + 1 > pBio.artists.length; artist = !stndBio ? pBio.artists[art_ix].name : !pBio.lock ? name.artist(ppt.focus) :  pBio.artists.length ? pBio.artists[0].name : artist; const new_artist = artist && artist != artist_o || !artist || force; if (new_artist) menBio.bioCounter = 0;
				if (ppt.cycPhoto) {if (new_artist) {counter = 0; folder = pBio.lock ? pBio.cleanPth(pBio.mul.imgArt, ppt.focus, 'mul', artist, "", 1) : stndBio ? pBio.cleanPth(pBio.pth.imgArt, ppt.focus) : pBio.cleanPth(pBio.mul.imgArt, ppt.focus, 'mul', artist, "", 1); folderSup = ""; if (!stndBio && pBio.sup.Cache && !sBio.folder(folder)) folderSup = pBio.cleanPth(pBio.sup.imgArt, ppt.focus, 'mul', artist, "", 1); this.clear_art_cache(); a_run = true; if (!artImages.length) all_files_o_length = 0; ix = 0;} this.getArtImg();}
				else this.getFbImg(); this.get = false;
				break;
			}
			case !ppt.artistView: {
				const stndAlb = !alb_ix || alb_ix + 1 > pBio.albums.length;
				if (stndAlb) resetCounters();
				else if (!pBio.lock) {
					id.album_o = id.album;
					id.album = (!pBio.art_ix ? artist : pBio.artists[0].name) + pBio.albums[alb_ix].name;
					if (id.album != id.album_o || force) {counter = 0; menBio.revCounter = 0;}
				}
				t.mulAlbum = true; if (alb_ix) cov_img.id = -1; /*stop occ late async loading of covCyc img*/ this.getFbImg(); this.get = false;
				break;
			}
		}
	}

	const getArtImages = () => {
		let all_files = folder ? utils.Glob(folder + "*") : [];
		if (!all_files.length && folderSup) all_files = utils.Glob(folderSup + "*");
		if (all_files.length == all_files_o_length) return; let newArr = false;
		if (!artImages.length) {newArr = true; art.cache = [];}
		all_files_o_length = all_files.length;
		const arr = all_files.filter(images); artImages = artImages.concat(arr);
		if (artImages.length > 1) artImages = uniq(artImages); if (newArr && artImages.length > 1) artImages = $Bio.shuffle(artImages);
	}

	this.load_image_done = (id, image, image_path) => {
		switch (true) {
			case cov_img.id == id:
				if (!t.mulAlbum && !this.cycCov) clear_cov_cache();
				if (!image) {
					if (cov.cacheHit(cov_img.i_x, cp)) return;
					if (userCovStub) {image = userCovStub; image_path = cp;}
					else {image = defStub(); image_path = "stub";}
				}
				if (!image) return;
				cov.cacheIt(cov_img.i_x, image, image_path, 1);
				break;
			case art_img.id == id:
				if (!image) {artImages.splice(art_img.ix, 1); if (artImages.length > 1) changePhoto(1); return;}
				art.cacheIt(art_img.ix, image, image_path, 0);
				break;
		}
	}

	const loadArtImage = () => {
		if (artImages.length && ppt.cycPhoto) {
			if (art.cacheHit(ix, artImages[ix])) return; art_img.ix = ix; art_img.id = gdi.LoadImageAsync(window.ID, artImages[ix]);
		} else if (!init) this.getFbImg();
	}

	const getCovImages = () => {
		if (ppt.artistView || !this.cycCov || pBio.alb_ix) return false;
		if (!pBio.lock) this.set_id();
		const new_album = id.albCyc != id.albCyc_o || !id.albCyc;
		if (ppt.loadCovFolder && !pBio.lock) this.albFolder = pBio.cleanPth(pBio.albCovFolder, ppt.focus);
		if (new_album) {
			clear_cov_cache();
			covers = [];
			i_x = covCycle_ix = 1;
			if (ppt.loadCovFolder) {
					covImages = this.albFolder ? utils.Glob(this.albFolder + "*") : [];
					covImages = covImages.filter(cycImages);
					if (artImgFolder) covImages = $Bio.shuffle(covImages);
				for (let i = 0; i < covImages.length; i++) {
					covers[i + 10] = {}
					covers[i + 10].id = i + 10;
					covers[i + 10].pth = covImages[i];
				}
			covers = covers.filter(Boolean);
			covers.unshift({id: 0, pth: ""});
			}
			if (ppt.loadCovAllFb) {
				const handle = sBio.handle(ppt.focus);
				if (handle) {cur_handle = handle; for (let i = 0; i < 5; i++) utils.GetAlbumArtAsync(window.ID, handle, i, false, false, true);}
			}
		}
		if (!new_album || !ppt.loadCovAllFb) {
			const ep = covers[i_x] ? covers[i_x].pth : "";
			if (!ep) return false;
			if (cov.cacheHit(i_x, ep)) return true;
			cov_img.i_x = i_x;
			cov_img.id = gdi.LoadImageAsync(window.ID, ep);
		}
		return true;
	}

	const loadCycCov = (art_id, image_path) => { // stndAlb
		if (!this.cycCov) return false;
		if (blackListed(image_path)) image_path = "";
		if (ppt.loadCovAllFb) {
			if (covers.every(v => v.id !== art_id + 1)) {
				if (!art_id) {
					let path = "";
					if (pBio.extra) path = this.chkPths(pBio.extraPaths, "", 3, true);
					if (image_path && !pBio.extra || !path) path = image_path;
					if (!path) path = this.chkPths([pBio.getPth('cov', ppt.focus).pth, pBio.getPth('img', ppt.focus, name.alb_artist(ppt.focus), name.album(ppt.focus)).pth], "", 3);
					if (path) {
						let ln = covers.length;
						covers[ln] = {};
						covers[ln].id = art_id + 1;
						covers[ln].pth = path;
					}
				} else if (image_path) {
					let ln = covers.length; covers[ln] = {};
					covers[ln].id = art_id + 1;
					covers[ln].pth = image_path;
				}
				covers = covers.filter(Boolean);
				covers.unshift({id: 0, pth: ""});
				sort(covers, 'id');
				covers = uniqPth(covers);
			}
		}
		if (!ppt.artistView && !pBio.alb_ix) {
			const ep = covers[i_x] ? covers[i_x].pth : "";
			if (!ep) return false;
			cov_img.i_x = i_x;
			cov_img.id = gdi.LoadImageAsync(window.ID, ep);
			return true;
		}
	}

	const loadAltCov = (handle, n) => {
		let a, l;
		switch (n) {
			case 0: { // !stndAlb inLib !fbImg: chkCov save pths: if !found get_rev_img else load stub || metadb
				a = pBio.albums[pBio.alb_ix].artist; l = pBio.albums[pBio.alb_ix].album; const pth = pBio.getPth('img', ppt.focus, a, l, "", pBio.sup.Cache);
				if (this.chkPths(pth.pe, pth.fe, 0)) return;
				if (pth.fe != fe_done && pBio.rev_img) {const pth_cov = pth.pe[!pBio.sup.Cache ? 0 : 1], fn_cov = pth_cov + pth.fe; if (pBio.server) servBio.get_rev_img(a, l, pth_cov, fn_cov, false); else window.NotifyOthers("get_rev_img_bio", [a, l, pth_cov, fn_cov]); fe_done = pth.fe;}
				cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, "");
				return;
			}
			case 1: // stndAlb !fbImg: chkCov save pths: if !found chk/save stubCovUser
				a = name.alb_artist(ppt.focus); l = name.album(ppt.focus);
				if (this.chkPths([pBio.getPth('cov', ppt.focus).pth, pBio.getPth('img', ppt.focus, a, l).pth], "", 0)) return true;
				if (cov.cacheHit(i_x, cp)) return true;
				if (!userCovStub) {const stubCovUser = utils.GetAlbumArtV2(handle, 0); if (stubCovUser) stubCovUser.SaveAs(userCovStubFile); if (sBio.file(userCovStubFile)) {userCovStub = gdi.Image(userCovStubFile); cp = userCovStubFile;}}
				return false;
		}
	}

	const loadStndCov = (handle, art_id, image, image_path) => { // stndAlb load fbImg else stub
		if (blackListed(image_path)) {image = null; image_path = "";}
		if (!image && ppt.artistView) {
			if (cov.cacheHit(i_x, ap)) return;
			if (!userArtStub) {
				const stubArtUser = utils.GetAlbumArtV2(handle, 4);
				if (stubArtUser) stubArtUser.SaveAs(userArtStubFile);
				if (sBio.file(userArtStubFile)) {userArtStub = gdi.Image(userArtStubFile); ap = userArtStubFile;}} if (userArtStub) {image = userArtStub; image_path = ap;} // chk/save/load stubArtUser
		}
		if (!t.mulAlbum) clear_cov_cache();
		if (!image) {
			if (cov.cacheHit(i_x, "stub" + art_id)) return;
			image = defStub(); image_path = "stub" + art_id;
		} if (!image) return;
		cov.cacheIt(i_x, image, image_path, 1);
	}

	this.get_album_art_done = (handle, art_id, image, image_path) => {
		if (!cur_handle || !cur_handle.Compare(handle) || image && cov.cacheHit(i_x, image_path)) return;
		if (loadCycCov(art_id, image_path)) return;
		if (pBio.alb_ix && pBio.alb_ix < pBio.albums.length && !image && !ppt.artistView) return loadAltCov(handle, 0);
		if (!image && !ppt.artistView && !art_id && !pBio.alb_ix) {
			if (loadAltCov(handle, 1)) return; if (userCovStub) {image = userCovStub; image_path = cp;}
		}
		loadStndCov(handle, art_id, image, image_path);
	}

	this.getFbImg = () => {
		if (ppt.artistView && artImages.length && ppt.cycPhoto) return;
		i_x = ppt.artistView ? 0 : this.cycCov && !pBio.alb_ix ? covCycle_ix : pBio.alb_ix + 1;
		blurCheck(); if (getCovImages()) return;
		if (pBio.alb_ix && pBio.alb_ix < pBio.albums.length && !ppt.artistView) { // !stndAlb
			const a = pBio.albums[pBio.alb_ix].artist, l = pBio.albums[pBio.alb_ix].album, l_handle = libBio.in_library(2, a, l);
			if (l_handle) {cur_handle = l_handle; utils.GetAlbumArtAsync(window.ID, l_handle, 0, false); return;} // check local
			else {
				const pth = pBio.getPth('img', ppt.focus, a, l, "", pBio.sup.Cache);
				if (this.chkPths(pth.pe, pth.fe, 0)) return;
				if (pth.fe != fe_done && pBio.rev_img) {const pth_cov = pth.pe[!pBio.sup.Cache ? 0 : 1], fn_cov = pth_cov + pth.fe; if (pBio.server) servBio.get_rev_img(a, l, pth_cov, fn_cov, false); else window.NotifyOthers("get_rev_img_bio", [a, l, pth_cov, fn_cov]); fe_done = pth.fe;}
				cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, ""); return;
			}
		}
		if (!pBio.alb_ix && pBio.extra && !ppt.artistView && !ppt.covType) {
			if (this.chkPths(pBio.extraPaths, "", 0, true)) return;
		}
		if (pBio.art_ix && pBio.art_ix < pBio.artists.length && ppt.artistView) { // !stndBio
			const a_handle = libBio.in_library(3, artist);
			if (a_handle) {cur_handle = a_handle; utils.GetAlbumArtAsync(window.ID, a_handle, 0, false); return;}
			if (cov.cacheHit(i_x, ap)) return;
			let image = null, image_path = "";
			if (userArtStub) {image = userArtStub; image_path = ap;} else {image = defStub(); image_path = "stub"}
			if (!image) return; cov.cacheIt(i_x, image, image_path, 1); return;
		}
		// stndAlb
		const handle = sBio.handle(ppt.focus);
		if (handle) {cur_handle = handle; utils.GetAlbumArtAsync(window.ID, handle, ppt.artistView ? 0 : ppt.covType, !ppt.covType || ppt.artistView ? false: true); return;}
		if (fb.IsPlaying && handle) return; if (pBio.imgText) t.text = true; if (cov.cacheHit(i_x, "noitem")) return;
		let image = defStub(); if (!image) return; cov.cacheIt(i_x, image, "noitem", 1);
	}

	const bar_metrics = (horizontal, vertical) => {
		this.bar.disabled = ppt.style > 3 && !ppt.img_only && t.text && !pBio.clip && intersectRect();
		this.imgBar = !this.bar.disabled ? ppt.imgBar : 0;
		if (!this.imgBar) {this.bar.show = false; paint(); return;}
		this.bar.imgNo = ppt.artistView ? artImages.length : covers.length - 1;
		if (this.bar.imgNo < 2) return;
		this.bar.overlap = ppt.style > 3 && !ppt.img_only && t.text && pBio.clip;
		this.bar.overlapCorr = this.bar.overlap ? pBio.bor_t : 0;
		const alignBottom = vertical && !this.crop && ppt.alignV == 2 && !this.bar.overlap;
		const alignCenter = vertical && !this.crop && ppt.alignV == 1 && !this.bar.overlap;
		const alignLeft = horizontal && !this.crop && ppt.alignH == 0;
		const alignRight = horizontal && !this.crop && ppt.alignH == 2;
		this.bar.verticalCorr = circular ? ppt.imgBorder == 1 || ppt.imgBorder == 3 ? 1.25 : 1.2 : 1.1565;
		nhh = !t.text || ppt.img_only ? nh : ppt.style < 4 ? Math.min(!this.crop ? nw * (!alignBottom ? this.bar.verticalCorr : 1) : nh, nh) : this.bar.overlap ? pBio.imgs : Math.min(!this.crop ? (pBio.iBoxW - pBio.bor_l - pBio.bor_r) * (!alignBottom ? this.bar.verticalCorr : 1) : pBio.iBoxH - pBio.bor_t - pBio.bor_b, pBio.iBoxH - pBio.bor_t - pBio.bor_b);
		const bar_img_t = nw * (!alignBottom ? this.bar.verticalCorr : 1) < nh ? alignCenter ? (nh - nw) / 2 : alignBottom ? nh - nw : 0 : 0;
		this.bar.h = (ppt.imgBarDots == 1 ? 6 : 5) * sBio.scale;
		this.bar.grip_h = (ppt.imgBarDots == 1 ? 10 : 11) * sBio.scale;
		this.bar.gripOffset = Math.round((this.bar.grip_h - this.bar.h) / 2) + Math.ceil(uiBio.l_h / 2);
		this.bar.w1 = ppt.imgBarDots == 1 ? Math.min(this.bar.imgNo * 30 * sBio.scale, (!this.crop ? Math.min(nw, nhh) : nw) - 30 * sBio.scale) : Math.round((!this.crop ? Math.min(nw, nhh) : nw) * 2 / 3);
		this.bar.w2 = this.bar.w1 + Math.round(this.bar.grip_h);
		this.bar.l = !t.text ? pBio.bor_l : pBio.img_l;
		this.bar.x1 = alignLeft ? Math.round(this.bar.l + 15 * sBio.scale) : alignRight ? Math.round(pBio.w - (!t.text ? pBio.bor_r : pBio.img_r) - 15 * sBio.scale - this.bar.w1) : Math.round(this.bar.l + (nw - this.bar.w1) / 2);
		this.bar.x3 = this.bar.x1 - Math.round(this.bar.grip_h / 2);
		this.bar.y1 = !t.text ? pBio.bor_t + bar_img_t : pBio.img_t + bar_img_t;
		this.bar.y2 = Math.round(this.bar.y1 + nhh * 0.9 - this.bar.h / 2) - this.bar.overlapCorr;
		this.bar.y3 = this.bar.y2 + Math.ceil(uiBio.l_h / 2);
		this.bar.y4 = nhh * 0.8 - this.bar.overlapCorr;
		this.bar.y5 = nhh - this.bar.overlapCorr;
		if (ppt.imgBarDots == 1) {
			this.bar.dot_w =  Math.floor(sBio.clamp(this.bar.w1 / this.bar.imgNo, 2, this.bar.h));
			this.bar.x2 = this.bar.x1 - Math.round(this.bar.dot_w / 2);
			this.bar.progMin = 0.5 / this.bar.imgNo * this.bar.w1 - (this.bar.grip_h - this.bar.dot_w) / 2;
			this.bar.progMax = ((this.bar.imgNo - 0.5) / this.bar.imgNo) * this.bar.w1 - (this.bar.grip_h - this.bar.dot_w) / 2;
		} else this.bar.x2 = this.bar.x1 + Math.ceil(uiBio.l_h / 2);
	}

	const img_metrics = (image, n) => {
		if (!ppt.img_only && t.text && ppt.textAlign && ppt.style < 4) {if (ppt.style == 0 || ppt.style == 2) {pBio.img_l = pBio.text_l; pBio.img_r = pBio.text_r;} if ((ppt.style == 1 || ppt.style == 3) && !ppt.fullWidthHeading) {pBio.img_t = Math.round(pBio.text_t - uiBio.heading_h + uiBio.font_h / 4.1); pBio.img_b = Math.round(pBio.h - (pBio.text_t + pBio.lines_drawn * uiBio.font_h - uiBio.font_h / 12.5 - ppt.textPad));}}
		x_l = !t.text ? pBio.bor_l : pBio.img_l; x_r = !t.text ? pBio.bor_r : pBio.img_r; y_t = !t.text ? pBio.bor_t : pBio.img_t; y_b = !t.text ? pBio.bor_b : pBio.img_b;
		nw = !ppt.style || ppt.style == 2 || ppt.style > 3 && t.text ? pBio.w - pBio.img_l - pBio.img_r : !ppt.img_only && t.text ? pBio.imgs : pBio.w - x_l - x_r;
		nh = t.text && (ppt.style == 1 || ppt.style == 3 || ppt.style > 3 && !ppt.alignAuto) ? pBio.h - pBio.img_t - pBio.img_b : !ppt.img_only && t.text ? pBio.imgs : pBio.h - y_t - y_b;
		border = imgBorder();
		if (border == 1 || border == 3) {const i_sz = sBio.clamp(nh, 0, nw) / sBio.scale; bor_w1 = !i_sz || i_sz > 500 ? 5 * sBio.scale : Math.ceil(5 * sBio.scale * i_sz / 500);} else bor_w1 = 0; bor_w2 = bor_w1 * 2;
		nw = Math.max(nw - bor_w2, 10); nh = Math.max(nh - bor_w2, 10);
		circular = imgCircular();
		reflection = this.reflection();
		switch (true) {
			case circular: {
				if (ppt.style > 3 && ppt.alignAuto && t.text && !ppt.img_only) nh = Math.max(pBio.h - pBio.img_t - pBio.img_b - bor_w2, 10);
				const szz = nh > nw ? nw : nh;
				s1 = image.Width / szz; s2 = image.Height / szz;
				if (s1 > s2) {imgw = Math.round(szz * s2); imgh = image.Height; imgx = Math.round((image.Width - imgw) / 2); imgy = 0; tw = Math.round(szz); th = Math.round(szz);} else {imgw = image.Width; imgh = Math.round(szz * s1); imgx = 0; imgy = Math.round((image.Height - imgh) / 8); tw = Math.round(szz); th = Math.round(szz);}
				break;
			}
			case !this.crop:
				if (ppt.style < 4 || !ppt.alignAuto || !t.text || ppt.img_only) {sc = Math.min(nh / image.Height, nw / image.Width); tw = Math.round(image.Width * sc); th = Math.round(image.Height * sc);}
				else {
					s1 = image.Width / image.Height; s2 = nw / nh;
					if (s1 > s2) {sc = Math.min(nh / image.Height, nw / image.Width); tw = Math.round(image.Width * sc); th = Math.round(image.Height * sc); y_t = Math.round((nh - th) / 2 + y_t);}
					else {y_t = pBio.img_t; nh = Math.max(pBio.h - pBio.img_t - pBio.img_b - bor_w2, 10); sc = Math.min(nh / image.Height, nw / image.Width); tw = Math.round(image.Width * sc); th = Math.round(image.Height * sc);}
				}
				break;
			case this.crop:
				if (ppt.style > 3 && t.text) nh = Math.max(pBio.h - pBio.img_t - pBio.img_b - bor_w2, 10);
				s1 = image.Width / nw; s2 = image.Height / nh;
				if (n && Math.abs(s1 / s2 - 1) < 0.05) {imgx = 0; imgy = 0; imgw = image.Width; imgh = image.Height; tw = Math.round(nw); th = Math.round(nh);}
				else {if (s1 > s2) {imgw = Math.round(nw * s2); imgh = image.Height; imgx = Math.round((image.Width - imgw) / 2); imgy = 0; tw = Math.round(nw); th = Math.round(nh);} else {imgw = image.Width; imgh = Math.round(nh * s1); imgx = 0; imgy = Math.round((image.Height - imgh) / 8); tw = Math.round(nw); th = Math.round(nh);}}
				break;
		}
		const horizontal = (ppt.style == 0 || ppt.style == 2 || ppt.style > 3) && !ppt.img_only && t.text;
		const vertical = (ppt.style == 1 || ppt.style == 3 || ppt.style > 3 && !ppt.alignAuto) && !ppt.img_only && t.text;
		if (horizontal && ppt.alignH != 1) {if (ppt.alignH == 2) x_l = Math.round(pBio.w - pBio.img_r - tw - bor_w2);} else x_l = Math.round((nw - tw) / 2 + x_l);
		if (vertical && ppt.alignV != 1) {if (ppt.alignV == 2) y_t = Math.round(pBio.h - pBio.img_b - th - bor_w2);} else if (ppt.style < 4 || !ppt.alignAuto || !t.text || ppt.img_only) y_t = Math.round((nh - th) / 2 + y_t);
		bar_metrics(horizontal, vertical);
	}

	const blur_img = (image, im) => {
		if (!image || !im || !pBio.w || !pBio.h) return;
		if (ppt.covBlur && uiBio.blur && (ppt.artistView || this.cycCov || ppt.text_only || pBio.alb_ix) && new_BlurAlb) {
			let handle = null; f_blur = null;
			if (pBio.extra && !ppt.covType) {this.chkPths(pBio.extraPaths, "", 1, true);}
			if (!f_blur) {handle = sBio.handle(ppt.focus); if (handle) f_blur = utils.GetAlbumArtV2(handle, ppt.covType, !ppt.covType ? false: true);}
			if (!f_blur && !ppt.covType) {
				const pth_cov = pBio.getPth('cov', ppt.focus).pth;
				ext.some(v => {if (sBio.file(pth_cov + v)) {f_blur = gdi.Image(pth_cov + v); return true;}});
			}
			if (!f_blur && !ppt.covType) {
				const a = name.alb_artist(ppt.focus), l = name.album(ppt.focus), pth_cov = [pBio.getPth('cov', ppt.focus).pth, pBio.getPth('img', ppt.focus, a, l).pth];
				this.chkPths(pth_cov, "", 1);
			}
			if (!f_blur && !ppt.covType) if (handle) f_blur = utils.GetAlbumArtV2(handle, 0); if (!f_blur) f_blur = noimg[0].Clone(0, 0, noimg[0].Width, noimg[0].Height); new_BlurAlb = false; if (f_blur && !ppt.blurAutofill) f_blur = f_blur.Resize(pBio.w, pBio.h);
		}
		if (ppt.covBlur && uiBio.blur && (ppt.artistView || this.cycCov || ppt.text_only || pBio.alb_ix) && f_blur) image = f_blur;
		if (ppt.blurAutofill) {const s1 = image.Width / pBio.w, s2 = image.Height / pBio.h; let imgw, imgh, imgx, imgy; if (s1 > s2) {imgw = Math.round(pBio.w * s2); imgh = image.Height; imgx = Math.round((image.Width - imgw) / 2); imgy = 0;} else {imgw = image.Width; imgh = Math.round(pBio.h * s1); imgx = 0; imgy = Math.round((image.Height - imgh) / 8);} image = image.Clone(imgx, imgy, imgw, imgh);}
			const i = sBio.gr(pBio.w, pBio.h, true, (g, gi) => {
				g.SetInterpolationMode(0);
				if (ppt.blurBlend) {
					const iSmall = image.Resize(pBio.w * uiBio.blurLevel / 100, pBio.h * uiBio.blurLevel / 100, 2), iFull = iSmall.Resize(pBio.w, pBio.h, 2), offset = 90 - uiBio.blurLevel;
					g.DrawImage(iFull, 0 - offset, 0 - offset, pBio.w + offset * 2, pBio.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, 63 * uiBio.blurAlpha);
				} else {
					g.DrawImage(image, 0, 0, pBio.w, pBio.h, 0, 0, image.Width, image.Height); if (uiBio.blurLevel > 1) gi.StackBlur(uiBio.blurLevel);
					g.FillSolidRect(0, 0, pBio.w, pBio.h, darkImage(gi) ? uiBio.col.bg_light : uiBio.col.bg_dark);
				}
			});
		return i;
	}

	const darkImage = image => {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15)); let rTot = 0, gTot = 0, bTot = 0, freqTot = 0;
		colorSchemeArray.forEach(v => {const col = sBio.toRGB(v.col); rTot += col[0] ** 2 * v.freq; gTot += col[1] ** 2 * v.freq; bTot += col[2] ** 2 * v.freq; freqTot += v.freq;});
		const avgCol = [sBio.clamp(Math.round(Math.sqrt(rTot / freqTot)), 0 , 255), sBio.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0 , 255), sBio.clamp(Math.round(Math.sqrt(bTot / freqTot)), 0 , 255)];
		return uiBio.get_selcol(avgCol, true, true) == 50 ? true : false;
	}

	const fade_img = (image, x, y, w, h) => {
		const xl = Math.max(0, pBio.tBoxL - x); let f = Math.min(w, pBio.tBoxL - x + pBio.tBoxW); this.adjustMode = false; if (xl >= f) return image; const wl = f - xl, yl = Math.max(0, pBio.tBoxT - y); f = Math.min(h, pBio.tBoxT - y + pBio.tBoxH); if (yl >= f) return image; const hl = f - yl;
		if (!fade_mask || this.resetFade) {const km = uiBio.fadeSlope != -1 && pBio.img_t <= pBio.text_t - uiBio.heading_h ? uiBio.fadeAlpha / 500 + uiBio.fadeSlope / 10 : 0;  fade_mask = sBio.gr(500, 500, true, g => {for (let k = 0; k < 500; k++) {const c = 255 - sBio.clamp(uiBio.fadeAlpha - k * km, 0, 255); g.FillSolidRect(0, k, 500, 1, RGB(c, c, c));}}); this.resetFade = false;}
		const fade = image.Clone(0, 0, image.Width, image.Height), f_mask = fade_mask.Clone(0, 0, fade_mask.Width, fade_mask.Height);
		const fadeI = sBio.gr(w, h, true, g => g.DrawImage(f_mask, xl, yl, wl, hl, 0, 0, f_mask.Width, f_mask.Height));
		fade.ApplyMask(fadeI); return fade;
	}

	const refl_img = (image, i, x, y, w, h, cache) => {
		if (!refl_mask) {const km = reflSlope != -1 ? reflAlpha / 500 + reflSlope  / 10 : 0; refl_mask = sBio.gr(500, 500, true, g => {for (let k = 0; k < 500; k++) {const c = 255 - sBio.clamp(reflAlpha - k * km, 0, 255); g.FillSolidRect(0, k, 500, 1, RGB(c, c, c));}});} let r_mask, refl, reflImg, ref_sz, sw = 0;
		if (!ppt.imgReflType) {switch (ppt.style) {case 0: case 2: sw = ppt.alignH == 1 ? ppt.style : ppt.alignH == 0 ? 3 : 1; break; case 1: case 3: sw = ppt.alignV == 1 ? ppt.style : ppt.alignV == 0 ? 0 : 2; break; default: sw = ppt.alignH == 1 ? 0 : 3 - ppt.alignH; break;}} else sw = [2, 1, 0, 3][ppt.imgReflType - 1]; this.adjustMode = false;
		switch (sw) {
			case 0: ref_sz = Math.round(Math.min(pBio.h - y - h, image.Height * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(0, image.Height - ref_sz, image.Width, ref_sz); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(6); refl.ApplyMask(r_mask);} reflImg = sBio.gr(w, h + ref_sz, true, g => {g.DrawImage(image, 0, 0, w, h, 0, 0, w, h); g.DrawImage(refl, 0, h, w, h, 0, 0, w, h);}); cache[i].h = h + ref_sz; break;
			case 1: ref_sz = Math.round(Math.min(x, image.Width * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(0, 0, ref_sz, image.Height); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); r_mask.RotateFlip(1); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(4); refl.ApplyMask(r_mask);} reflImg = sBio.gr(ref_sz + w, h, true, g => {g.DrawImage(image, ref_sz, 0, w, h, 0, 0, w, h); g.DrawImage(refl, 0, 0, ref_sz, h, 0, 0, ref_sz, h);}); xa = x - ref_sz; cache[i].x = xa; cache[i].w = w + ref_sz; break;
			case 2: ref_sz = Math.round(Math.min(y, image.Height * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(0, 0, image.Width, ref_sz); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); r_mask.RotateFlip(2); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(6); refl.ApplyMask(r_mask);} reflImg = sBio.gr(w, ref_sz + h, true, g => {g.DrawImage(image, 0, ref_sz, w, h, 0, 0, w, h); g.DrawImage(refl, 0, 0, w, ref_sz, 0, 0, w, ref_sz);}); ya = y  - ref_sz; cache[i].y = ya; cache[i].h = ref_sz + h; break;
			case 3: ref_sz = Math.round(Math.min(pBio.w - x - w, image.Width * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(image.Width - ref_sz, 0, ref_sz, image.Height); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); r_mask.RotateFlip(3); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(4); refl.ApplyMask(r_mask);} reflImg = sBio.gr(w + ref_sz, h, true, g => {g.DrawImage(image, 0, 0, w, h, 0, 0, w, h); g.DrawImage(refl, w, 0, ref_sz, h, 0, 0, ref_sz, h);}); cache[i].w = w + ref_sz; break;
		} return reflImg;
	}

	const getBorder = (image, w, h, bor_w1, bor_w2) => {
		const imgo = 7, dpiCorr = (sBio.scale - 1) * imgo, imb = imgo - dpiCorr;
		if (border > 1 && !reflection) {imgb = 15 + dpiCorr; sh_img = sBio.gr(Math.floor(w + bor_w2 + imb), Math.floor(h + bor_w2 + imb), true, g => !circular ? g.FillSolidRect(imgo, imgo, w + bor_w2 - imgb, h + bor_w2 - imgb, RGB(0, 0, 0)) : g.FillEllipse(imgo, imgo, w + bor_w2 - imgb, h + bor_w2 - imgb, RGB(0, 0, 0))); sh_img.StackBlur(12);}
		let bor_img = sBio.gr(Math.floor(w + bor_w2 + imgb), Math.floor(h + bor_w2 + imgb), true, g => {
		if (border > 1 && !reflection) g.DrawImage(sh_img, 0, 0, Math.floor(w + bor_w2 + imgb), Math.floor(h + bor_w2 + imgb), 0, 0, sh_img.Width, sh_img.Height);
		if (border == 1 || border == 3) {
			if (!circular) g.FillSolidRect(0, 0, w + bor_w2, h + bor_w2, RGB(255, 255, 255));
			else {
				g.SetSmoothingMode(2);
				g.FillEllipse(0, 0, w + bor_w2, h + bor_w2, RGB(255, 255, 255));
			}
		}
		g.DrawImage(image, bor_w1, bor_w1, w, h, 0, 0, image.Width, image.Height);
		}); sh_img = null;
		return bor_img;
	}

	const circularMask = (image, tw, th) => {
		const g_img_mask = g_mask, mask = g_img_mask.Resize(tw, th);
		image.ApplyMask(mask);
	}

	const ImageCache = function () {
		this.cache = [];
		this.trimCache = function(n) { // keep slowest to resize
			let lowest = n;
			for (let i = n + 1; i < this.cache.length; i++) { // n = 1 keep fb fallback artist img
				const v1 = this.cache[i] && this.cache[i].time || Infinity, v2 = this.cache[lowest] && this.cache[lowest].time || Infinity;
				if (v1 < v2) lowest = i;
			}
			if (this.cache[lowest]) {this.cache[lowest].img = null; this.cache[lowest].time = null; if (this.cache[lowest].blur) this.cache[lowest].blur = null;}
		}

		this.cacheIt = (i, image, image_path, n) => {
			try {
				if (!image || ppt.cycPhoto && !ppt.sameStyle && n != pBio.covView && artImages.length) return paint();
				if (memoryLimit()) this.trimCache(n);
				const start = Date.now();
				img_metrics(image, n);
				let tx = x_l, ty = y_t; xa = tx; ya = ty;
				this.cache[i] = {};
				this.cache[i].x = tx; this.cache[i].y = ty; this.cache[i].w = tw; this.cache[i].h = th; this.cache[i].text = t.text; imgb = 0;
				switch (border) {
					case 0:
						this.cache[i].img = !imgBio.crop && !circular ? image : image.Clone(imgx, imgy, imgw, imgh);
						this.cache[i].img = this.cache[i].img.Resize(tw, th, 2);
						if (circular) circularMask(this.cache[i].img, tw, th);
						if (!ppt.overlayStyle && ppt.style > 3 && t.text && !ppt.img_only) this.cache[i].img = fade_img(this.cache[i].img, tx, ty, tw, th);
						if (reflection) {this.cache[i].img = refl_img(this.cache[i].img, i, tx, ty, tw, th, this.cache); tx = this.cache[i].x; ty = this.cache[i].y;}
						if (uiBio.blur && this.cache[i].img && !(ppt.img_only && imgBio.crop)) {
							this.cache[i].blur = blur_img(image, this.cache[i].img);
							cur_blur = this.cache[i].blur;
						}
						cur_img = this.cache[i].img;
						break;
					default: {
						this.cache[i].img = image.Clone(0, 0, image.Width, image.Height);
						if (imgBio.crop || circular) image = image.Clone(imgx, imgy, imgw, imgh);
						if (circular) circularMask(image, imgw, imgh);
						let bor_img = getBorder(image, tw, th, bor_w1, bor_w2);
						if (!ppt.overlayStyle && ppt.style > 3 && t.text && !ppt.img_only) bor_img = fade_img(bor_img, tx, ty, bor_img.Width, bor_img.Height);
						if (reflection) {bor_img = refl_img(bor_img, i, tx, ty, bor_img.Width, bor_img.Height, this.cache); tx = this.cache[i].x; ty = this.cache[i].y; }
						if (uiBio.blur && bor_img && !(ppt.img_only && imgBio.crop && border < 2)) {
							this.cache[i].blur = blur_img(this.cache[i].img, bor_img);
							cur_blur = this.cache[i].blur;
						}
						this.cache[i].img = bor_img;
						cur_img = bor_img;
						break;
					}
				}
				this.cache[i].pth = image_path;
				cur_imgPth = image_path;
				this.cache[i].time = Date.now() - start;
				paint();
			} catch (e) {paint(); sBio.trace("unable to load image: " + image_path);}
		}

		this.cacheHit = (i, imgPth) => {
			if (!this.cache[i] || !this.cache[i].img || this.cache[i].pth != imgPth || !ppt.img_only && this.cache[i].text != t.text || imgBio.adjustMode) return false;
			xa = this.cache[i].x; ya = this.cache[i].y; if (uiBio.blur && this.cache[i].blur && !(ppt.img_only && imgBio.crop)) cur_blur = this.cache[i].blur; cur_img = this.cache[i].img; cur_imgPth = imgPth;
			paint(); return true;
		}
	}
	const art = new ImageCache, cov = new ImageCache;

	this.draw = gr => {
		if (ppt.text_only && !uiBio.blur) return;
		if (uiBio.blur && cur_blur) gr.DrawImage(cur_blur, this.x - 1, this.y - 1, cur_blur.Width + 2, cur_blur.Height + 2, 0, 0, cur_blur.Width, cur_blur.Height);
		if (this.get) return getImgFallback();
		if (!ppt.text_only && cur_img) gr.DrawImage(cur_img, xa, ya + scaleForDisplay(40), cur_img.Width, cur_img.Height, 0, 0, cur_img.Width, cur_img.Height, 0, alpha);

		if (!this.bar.show || this.bar.imgNo < 2) return;
		if (ppt.text_only || !(ppt.cycPhoto && ppt.artistView && artImages.length > 1) && !(this.cycCov && !ppt.artistView && covers.length > 2 && !pBio.alb_ix)) return;

		let prog = 0;
		switch (ppt.imgBarDots) {
			case 1:
				gr.SetSmoothingMode(2);
				prog = this.bar.dn ? sBio.clamp(pBio.m_x - this.bar.x2 - this.bar.grip_h / 2, this.bar.progMin, this.bar.progMax) : (ppt.artistView ? ix + 0.5 : i_x - 0.5) * this.bar.w1 / this.bar.imgNo - (this.bar.grip_h - this.bar.dot_w) / 2;
				for (let i = 0; i < this.bar.imgNo; i++) {
					gr.FillEllipse(this.bar.x2 + ((i + 0.5) / this.bar.imgNo) * this.bar.w1, this.bar.y2, this.bar.dot_w, this.bar.h, RGB(245, 245, 245));
					gr.DrawEllipse(this.bar.x2 + ((i + 0.5) / this.bar.imgNo) * this.bar.w1, this.bar.y2, this.bar.dot_w, this.bar.h, uiBio.l_h, RGB(128, 128, 128));
				}
				gr.FillEllipse(this.bar.x2 + prog, this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
				gr.DrawEllipse(this.bar.x2 + prog, this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, uiBio.l_h, RGB(128, 128, 128));
				break;
			case 2:
				prog = this.bar.dn ? sBio.clamp(pBio.m_x - this.bar.x1, 0, this.bar.w1) : (ppt.artistView ? ix + 1 : i_x) * this.bar.w1 / this.bar.imgNo;
				gr.DrawRect(this.bar.x1, this.bar.y2, this.bar.w1, this.bar.h, uiBio.l_h, RGB(128, 128, 128));
				gr.FillSolidRect(this.bar.x2, this.bar.y3, this.bar.w1 - uiBio.l_h, this.bar.h - uiBio.l_h, RGBA(0, 0, 0, 75));
				gr.FillSolidRect(this.bar.x2, this.bar.y3, prog - uiBio.l_h, this.bar.h - uiBio.l_h, RGB(245, 245, 245));
				gr.SetSmoothingMode(2);
				gr.FillEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
				gr.DrawEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, uiBio.l_h, RGB(128, 128, 128));
				break;
		}
		if (ppt.imgCounter) {
			if (ppt.imgBarDots == 1) prog += Math.round(this.bar.grip_h / 2 - this.bar.dot_w / 2);
			const count = (ppt.artistView ? ix + 1 : i_x) + (" / " + this.bar.imgNo), count_m = (this.bar.imgNo + (" / " + this.bar.imgNo)) + " ";
			if (count) {
				const count_w = gr.CalcTextWidth(count_m, uiBio.smallFont), count_x = ppt.imgBarDots ? Math.round(sBio.clamp(this.bar.x1 - count_w / 2 + prog, this.bar.l + 2, this.bar.l + nw + (!t.text ? pBio.bor_r : pBio.img_r) - count_w - 4)) : xa + uiBio.l_h * 2 + bor_w1, count_h = gr.CalcTextHeight(count, uiBio.smallFont), count_y = ppt.imgBarDots ? Math.round(this.bar.y2 - this.bar.gripOffset - count_h * 1.5) : ya + uiBio.l_h * 2 + bor_w1;
				gr.FillRoundRect(count_x, count_y, count_w + 2, count_h + 2, 3, 3, RGBA(0, 0, 0, 210));
				gr.DrawRoundRect(count_x + 1, count_y + 1, count_w, count_h, 1, 1, 1, RGBA(255, 255, 255, 60));
				gr.DrawRoundRect(count_x, count_y, count_w + 2, count_h + 2, 1, 1, 1, RGBA(0, 0, 0, 200));
				gr.GdiDrawText(count, uiBio.smallFont, RGB(250, 250, 250), count_x + 1, count_y, count_w, count_h + 2, t.cc);
			}
		}
		gr.SetSmoothingMode(0);
	}

	this.lbtn_dn = (p_x, p_y) => {
		this.bar.dn = false;
		this.down = true;
		if (this.imgBar) {
			if (!ppt.text_only && ((ppt.cycPhoto && ppt.artistView && artImages.length > 1) || (this.cycCov && !ppt.artistView && covers.length > 2 && !pBio.alb_ix)))
				this.bar.dn = p_x > this.bar.x3 && p_x < this.bar.x3 + this.bar.w2 && p_y > this.bar.y1 + this.bar.y4 && p_y < this.bar.y1 + this.bar.y5;

		if (this.bar.dn) {
			const prog = sBio.clamp(p_x - this.bar.x1, 0, this.bar.w1);
			if (ppt.artistView) {
				const new_ix = Math.min(Math.floor(prog / this.bar.w1 * artImages.length), artImages.length - 1);
				if (new_ix != ix) {ix = new_ix; setPhoto();}
		} else {
				const new_i_x = Math.min(Math.floor(prog / this.bar.w1 * (covers.length - 1) + 1), covers.length - 1);
				if (new_i_x != i_x) {i_x = new_i_x; setCov();}
			}
			paint();
		}

		}
		if (!ppt.touchControl || pBio.text_trace || this.bar.dn) return; this.touch.dn = true; this.touch.start = p_x;
	}

	this.lbtn_up = () => {
		if (ppt.imgBar && !this.bar.dn && cur_img && !ppt.text_only) img_metrics(cur_img, ppt.artistView ? 0 : 1);
		this.bar.dn = false;
		this.down = false;
		if (this.touch.dn) {this.touch.dn = false;}
		if (this.imgBar) paint();
	}

	this.move = (p_x, p_y) => {
		this.bar.hand = false;
		if (this.imgBar) {
			const trace = p_x > this.bar.l && p_x < this.bar.l + nw && p_y > this.bar.y1 && p_y < this.bar.y1 + this.bar.y5;
			const show = !ppt.text_only && (ppt.artistView || !pBio.alb_ix) && (this.imgBar == 2 || trace);
			if (!ppt.text_only && ((ppt.cycPhoto && ppt.artistView && artImages.length > 1) || (this.cycCov && !ppt.artistView && covers.length > 2 && !pBio.alb_ix)))
				if (!this.down || this.bar.dn) this.bar.hand = p_x > this.bar.x3 && p_x < this.bar.x3 + this.bar.w2 && p_y > this.bar.y1 + nhh * 0.8  - this.bar.overlapCorr && p_y < this.bar.y1 + this.bar.y5;
			if (show != this.bar.show && !ppt.text_only && trace) paint();
			if (show) this.bar.show = true;
			this.bar.debounce();
		}

		if (this.bar.dn) {
			const prog = sBio.clamp(p_x - this.bar.x1, 0, this.bar.w1);
			if (ppt.artistView) {
				const new_ix = Math.min(Math.floor(prog / this.bar.w1 * artImages.length), artImages.length - 1);
				if (new_ix != ix) {ix = new_ix; setPhoto();}
			} else {
				const new_i_x = Math.min(Math.floor(prog / this.bar.w1 * (covers.length - 1) + 1), covers.length - 1);
				if (new_i_x != i_x) {i_x = new_i_x; setCov();}
			}
			paint();
		}

		if (this.touch.dn) {
			if (!pBio.imgBox(p_x, p_y)) return;
			this.touch.end = p_x;
			const x_delta = this.touch.end - this.touch.start;
			if (x_delta > pBio.imgs / 5) {this.wheel(1); this.touch.start = this.touch.end;}
			if (x_delta < -pBio.imgs / 5) {this.wheel(-1); this.touch.start = this.touch.end;}
		}
	}

	this.toggle = function(n) {
		switch (n) {
			case 'loadCovAllFb':
				ppt.loadCovAllFb = !ppt.loadCovAllFb; this.cycCov = ppt.loadCovAllFb || ppt.loadCovFolder; covCycle_ix = 1;
				id.albCyc = ""; id.albCyc_o = ""; if (ppt.artistView) break;
				if (this.cycCov) getCovImages(); else this.get_images(); break;
			case 'loadCovFolder':
				ppt.loadCovFolder = !ppt.loadCovFolder; this.cycCov = ppt.loadCovAllFb || ppt.loadCovFolder; covCycle_ix = 1;
				id.albCyc = ""; id.albCyc_o = ""; if (ppt.artistView) break;
				if (this.cycCov) getCovImages(); else this.get_images();
				if (ppt.loadCovFolder && !ppt.get("SYSTEM.Cover Folder Checked", false)) {fb.ShowPopupMessage("Enter folder in \"Server Settings\": [COVERS: CYCLE FOLDER].\n\nDefault: artist image folder.\n\nThis is a static load: images arriving after choosing the current album aren't included.", "Biography: load folder for cover cycling"); ppt.set("SYSTEM.Cover Folder Checked", true);} break;
		}
	}
}

function TimersBio() {
	const timerArr = ["dl", "img", "sim1", "sim2", "source", "transition", "zSearch"], times = [1000, 1000, 1000, 1000, 2000, 4000, 5000, 6000, 7000];
	timerArr.forEach(v => this[v] = {id: null});
	const res = force => {window.NotifyOthers("get_img_bio", force); if (pBio.server) imgBio.grab(force);}
	this.clear = timerBio => {if (timerBio) clearTimeout(timerBio.id); timerBio.id = null;}
	this.decelerating = function(p_force) {
		let counter = 0; this.clear(this.dl);
		const func = () => {res(p_force); counter++; if (counter < times.length) timer_dl(); else this.clear(this.dl);}
		const timer_dl = () => {this.dl.id = setTimeout(func, times[counter]);}
		timer_dl();
	}
	this.image = () => {if (!pBio.server) return; this.clear(this.img); this.img.id = setInterval(() => {imgBio.fresh(); menBio.fresh(); window.NotifyOthers("img_chg_bio", 0);}, 1000);}
}
timerBio.image();

function on_focus(is_focused) {tb.focus = is_focused;}
function on_get_album_art_done(handle, art_id, image, image_path) {imgBio.get_album_art_done(handle, art_id, image, image_path);}
function on_item_focus_change() {if (!ppt.panelActive) return; if (fb.IsPlaying && !ppt.focus) return; if (ppt.mul_item) pBio.get_multi(true); else if (!pBio.multi_new()) return; if (t.block() && !pBio.server) {imgBio.get = true; t.get = ppt.focus ? 2 : 1; imgBio.artist_reset(); t.album_reset(); t.artist_reset();} else {if (t.block() && pBio.server) {imgBio.get = true; t.get = 1; imgBio.artist_reset(); t.album_reset(); t.artist_reset();} else {imgBio.get = false; t.get = 0;} pBio.focus_load(); pBio.focus_serv();}}
function on_key_down(vkey) {switch(vkey) {case 0x10: case 0x11: case 0x12: t.paint(); break; case 0x21: if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().page_throttle(1); break; case 0x22: if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().page_throttle(-1); break; case 35: if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().scroll_to_end(); break; case 36:if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().check_scroll(0, 'full'); break; case 37: imgBio.wheel(1); break; case 39: imgBio.wheel(-1); break;}}
function on_key_up(vkey) {if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) t.paint();}
function on_library_items_added() {if (!ppt.panelActive) return; if (!libBio) return; libBio.update = true;} function on_library_items_removed() {if (!ppt.panelActive) return; if (!libBio) return; libBio.update = true;} function on_library_items_changed() {if (!ppt.panelActive) return; if (!libBio) return; libBio.update = true;}
function on_load_image_done(id, image, image_path) {imgBio.load_image_done(id, image, image_path);}
function on_metadb_changed() {if (!ppt.panelActive) return; if (pBio.ir(ppt.focus) || t.block() && !pBio.server || !pBio.multi_new()) return; pBio.get_multi(true); if (!ppt.img_only) t.on_playback_new_track(); if (!ppt.text_only || uiBio.blur) imgBio.on_playback_new_track(); pBio.metadb_serv();}
function on_mouse_lbtn_dblclk(x, y) {if (!ppt.panelActive) return; butBio.lbtn_dn(x, y); t.scrollbar_type().lbtn_dblclk(x, y); if (!pBio.dblClick) return; if (ppt.touchControl) pBio.last_pressed_coord = {x: x, y: y}; pBio.click(x, y);}
function on_mouse_lbtn_down(x, y) {if (!ppt.panelActive) return; if (ppt.touchControl) pBio.last_pressed_coord = {x: x, y: y}; tb.lbtn_dn(x, y); butBio.lbtn_dn(x, y); t.scrollbar_type().lbtn_dn(x, y); imgBio.lbtn_dn(x, y);}
function on_mouse_lbtn_up(x, y) {if (!ppt.panelActive) return; t.scrollbar_type().lbtn_drag_up(); if (!pBio.dblClick && !butBio.Dn && !imgBio.bar.dn) pBio.click(x, y); t.scrollbar_type().lbtn_up(); pBio.clicked = false; tb.lbtn_up(); butBio.lbtn_up(x, y); imgBio.lbtn_up(x, y);}
function on_mouse_leave() {if (!ppt.panelActive) return; pBio.leave(); butBio.leave(); t.scrollbar_type().leave(); imgBio.leave(); pBio.m_y = -1;}
function on_mouse_mbtn_up(x, y, mask) {if (mask == 0x0004) pBio.inactivate(); else if (ppt.panelActive) pBio.mbtn_up(x, y);}
function on_mouse_move(x, y) {if (!ppt.panelActive) return; if (pBio.m_x == x && pBio.m_y == y) return; pBio.move(x, y); butBio.move(x, y); t.scrollbar_type().move(x, y); tb.img_move(x, y); tb.move(x, y); imgBio.move(x, y); pBio.m_x = x; pBio.m_y = y;}
function on_mouse_rbtn_up(x, y) {if (!ppt.panelActive) {menBio.activate(x, y); return true} menBio.rbtn_up(x, y); return true;}
function on_mouse_wheel(step) {if (!ppt.panelActive) return; switch (pBio.zoom()) {case false: if (butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y)) menBio.wheel(step, true); else if (pBio.text_trace) {if (!ppt.img_only) t.scrollbar_type().wheel(step, false);} else imgBio.wheel(step); break; case true: uiBio.wheel(step); if (vkBio.k('ctrl')) butBio.wheel(step); if (vkBio.k('shift')) {if (!pBio.text_trace) imgBio.wheel(step); if (butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y)) menBio.wheel(step, true);} break;}}
function on_notify_data(name, info) {let clone; if (uiBio.local) {clone = typeof info === 'string' ? String(info) : info; on_cui_notify(name, clone);} switch (name) {case "chkTrackRev_bio": if (!pBio.server && pBio.inclTrackRev) {clone = JSON.parse(JSON.stringify(info)); clone.inclTrackRev = true; window.NotifyOthers("isTrackRev_bio", clone);} break; case "isTrackRev_bio": if (pBio.server && info.inclTrackRev == true) {clone = JSON.parse(JSON.stringify(info)); servBio.get_track(clone);} break; case "img_chg_bio": imgBio.fresh(); menBio.fresh(); break; case "chk_arr_bio": clone = JSON.parse(JSON.stringify(info)); imgBio.chk_arr(clone); break; case "custom_style_bio": clone = String(info); pBio.on_notify(clone); break; case "force_update_bio": if (pBio.server) {clone = JSON.parse(JSON.stringify(info)); servBio.fetch(1, clone[0], clone[1]);} break; case "get_multi_bio": pBio.get_multi(); break; case "get_rev_img_bio": if (pBio.server) {clone = JSON.parse(JSON.stringify(info)); servBio.get_rev_img(clone[0], clone[1], clone[2], clone[3], false);} break; case "get_img_bio": imgBio.grab(info ? true : false); break; case "get_txt_bio": t.grab(); break; case "multi_tag_bio": if (pBio.server) {clone = JSON.parse(JSON.stringify(info)); servBio.fetch(false, clone[0], clone[1]);} break; case "not_server_bio": pBio.server = false; timerBio.clear(timerBio.img); timerBio.clear(timerBio.zSearch); break; case "blacklist_bio": imgBio.blkArtist = ""; imgBio.chkArtImg(); break; case "script_unload_bio": pBio.server = true; window.NotifyOthers("not_server_bio", 0); break; case "refresh_bio": window.Reload(); break; case "reload_bio": if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) window.Reload(); else {t.artistFlush(); t.albumFlush(); t.grab(); if (ppt.text_only) t.paint();} break; case "status_bio": ppt.panelActive = info; window.Reload(); break;}}
//function on_paint(gr) {uiBio.draw(gr); if (!ppt.panelActive) {gr.GdiDrawText("Biography Inactive\r\n\r\nNo Internet Searches. No Text or Image Loading.\r\n\r\nACTIVATE: RIGHT CLICK\r\n\r\n(Toggle: Shift + Middle Click)", uiBio.font, uiBio.col.text, 0, 0, pBio.w, pBio.h, t.ccc); return;} img.draw(gr); t.draw(gr); t.messageDraw(gr); butBio.draw(gr); tb.drawEd(gr); uiBio.lines(gr);}
function on_playback_dynamic_info_track() {if (!ppt.panelActive) return; if (pBio.server) servBio.fetch_dynamic(); t.on_playback_new_track(); imgBio.on_playback_new_track();}
function on_playback_new_track() {if (!ppt.panelActive) return; if (pBio.server) servBio.fetch(false, {ix:0, focus:false, arr:[]}, {ix:0, focus:false, arr:[]}); if (ppt.focus) return; t.on_playback_new_track(); imgBio.on_playback_new_track();}
function on_playback_stop(reason) {if (!ppt.panelActive) return; if (reason == 2) return; on_item_focus_change();}
function on_playlist_items_added() {if (!ppt.panelActive) return; on_item_focus_change();}
function on_playlist_items_removed() {if (!ppt.panelActive) return; on_item_focus_change();}
function on_playlist_switch() {if (!ppt.panelActive) return; on_item_focus_change();}
function on_playlists_changed() {if (!ppt.panelActive) return; menBio.playlists_changed();}
function on_script_unload() {if (pBio.server) {window.NotifyOthers("script_unload_bio", 0); timerBio.clear(timerBio.img);} butBio.on_script_unload();}
//function on_size(w, h) {t.rp = false; pBio.w = w; pBio.h = h; if (!pBio.w || !pBio.h) return; uiBio.get_font(); if (!ppt.panelActive) return; pBio.calcText = true; t.on_size(); img.on_size(); t.rp = true; img.displayed_other_panel = null;}
function RGB(r, g, b) {return 0xff000000 | r << 16 | g << 8 | b;}
function RGBA(r, g, b, a) {return a << 24 | r << 16 | g << 8 | b;}
function StringFormat() {const a = arguments, flags = 0; let h_align = 0, v_align = 0, trimming = 0; switch (a.length) {case 3: trimming = a[2]; /*fall through*/ case 2: v_align = a[1]; /*fall through*/ case 1: h_align = a[0]; break; default: return 0;} return (h_align << 28 | v_align << 24 | trimming << 20 | flags);}

function ServerBio() {
	if (!pBio.server) return;
	String.prototype.format = function() {return this.replace(/<P><\/P>/gi, "").replace(/<p[^>]*>/gi, "").replace(/\r/g, "").replace(/\n/g, "").replace(/<\/p>/gi, "\r\n\r\n").replace(/<br>/gi, "\r\n").replace(/(<([^>]+)>)/ig, '').replace(/&amp(;|)/g,"&").replace(/&quot(;|)/g,'"').replace(/&#39(;|)/g,"'").replace(/&gt(;|)/g, ">").replace(/&nbsp(;|)/g, "").replace(/^ +/gm, "").replace(/^\s+|\s+$/g, "");}
	let albm = "", album = "", alb_artist = "", album_id = "", artist = "", auto_corr = 1, last_get_track = Date.now(), title_id = "", trackID1 = "", trackID2 = "";
	const bioCacheSave = n => {if (!$Bio.isArray(imgToDelete)) {imgToDelete = []; n = true;} if (n) sBio.save(bioCache, JSON.stringify(imgToDelete, null, 3), true);}
	const bioCache = fb.ProfilePath + "yttm\\" + "cache_bio.json"; let imgToDelete = []; if (sBio.file(bioCache)) imgToDelete = sBio.jsonParse(bioCache, false, 'file'); bioCacheSave();
	if (pBio.server) {
		const dn_arr = ["am_bio", "lfm_bio", "am_rev", "lfm_rev", "dl_art_img", "lfm_cov"];
		dn_arr.forEach((v, i, arr) => {
			if (i < arr.length - 1) this[v] = pBio.valueIni("AUTO-FETCH", pBio.def_dn[i].name, pBio.def_dn[i].dn, 1);
			else this[v] = pBio.valueIni("COVERS: MUSIC FILES", pBio.cov[0].name, pBio.cov[0].path, 1);
		});
	}
	const auto_add = pBio.valueIni("MISCELLANEOUS", pBio.def_tf[7].name, pBio.def_tf[7].tf, 1); let exp = Math.max(pBio.d * utils.ReadINI(pBio.bio_ini, "MISCELLANEOUS", pBio.def_tf[5].name) / 28, pBio.d), upd = pBio.d / 28, url = {lfm: "https://ws.audioscrobbler.com/2.0/?format=json" + pBio.lfm, lfm_sf: "https://www.songfacts.com/"}; if (!exp || isNaN(exp)) exp = pBio.d; const expiry = exp * 3;
	const imgNo = sBio.clamp(pBio.valueIni("MISCELLANEOUS", pBio.def_tf[6].name, pBio.def_tf[6].tf, 2), 0, 40);
	let artLimit = parseFloat(utils.ReadINI(pBio.bio_ini, "MISCELLANEOUS", pBio.def_tf[8].name)); artLimit = artLimit ? Math.max(artLimit, imgNo) : 0; if (artLimit && !ppt.get("SYSTEM.Cache Limit Advisory", false)) {let f_pth = pBio.cleanPth(pBio.pth.imgArt, ppt.focus); f_pth = f_pth ? f_pth : "N/A"; fb.ShowPopupMessage("Artist image cache limit: now enabled. \r\n\r\nLimits number of images stored per artist to the value set*. If used with auto-add, newer images are added & older removed to give a fixed number of up-to-date images.\r\n\r\nOnly considers images ending in \"_32-alphanumeric-string.jpg\", e.g. Coldplay_421cac7d8e42662f069c4b69e7934d7b.jpg.\r\n\r\nIf a custom save location is used, ensure images are saving where expected & there aren't other matching images.\r\n\r\nCurrent save folder: " + f_pth + "\r\n\r\nThe cache limit is applied following image update and when images are no longer in use.\r\n\r\n*Actual number also depends on minimum target number (initial fetch number) and whether auto-add is enabled (tops up to a minimum of 5) as these take precedence.", "Biography"); ppt.set("SYSTEM.Cache Limit Advisory", true);}
	const bio_json = fb.ProfilePath + "yttm\\" + "update_bio.json"; if (!sBio.file(bio_json)) sBio.save(bio_json, JSON.stringify([{"name":"update", "time":Date.now()}], null, 3), true); let m = sBio.jsonParse(bio_json, false, 'file'); if (!$Bio.isArray(m)) {m = [{"name":"update", "time":Date.now()}]; sBio.save(bio_json, JSON.stringify(m, null, 3), true);} if (m[0].name != "update") {m.unshift({"name":"update", "time":Date.now()}); sBio.save(bio_json, JSON.stringify(m, null, 3), true)}

	const done = (f, exp) => {if (!sBio.file(bio_json)) return false; const m = sBio.jsonParse(bio_json, false, 'file'); const n = Date.now(), r = n - exp, u = n - upd; let k = m.length; if (m.length && m[0].time < u) {while (k--) if (m[k].time < r && k) m.splice(k, 1); m[0].time = n; sBio.save(bio_json, JSON.stringify(m, null, 3), true);} for (k = 0; k < m.length; k++) if (m[k].name == f) return true; return false;}
	const update = f => {if (!sBio.file(bio_json)) return; const m = sBio.jsonParse(bio_json, false, 'file'), n = Date.now(); let k = m.length; for (k = 0; k < m.length; k++) if (m[k].name == f) return; m.push({"name":f, "time":n}); sBio.save(bio_json, JSON.stringify(m, null, 3), true);}
	const expired = (f, exp, f_done, langCheck, type) => {if (langCheck) {let i = 0; switch (type) {case 0: for (i = 0; i < similar.length; i++) if (langCheck.includes(similar[i]) && i != pBio.lfmLang_ix) return true; for (i = 0; i < listeners.length; i++) if (langCheck.includes(listeners[i]) && i != pBio.lfmLang_ix) return true; break; case 1: for (i = 0; i < releaseDate.length; i++) if (langCheck.includes(releaseDate[i]) && i != pBio.lfmLang_ix) return true; for (i = 0; i < listeners.length; i++) if (langCheck.includes(listeners[i]) && i != pBio.lfmLang_ix) return true; break;}} if (f_done && done(f_done, exp)) return false; if (!sBio.file(f)) return true; return Date.now() - sBio.lastModified(f) > exp;}
	const cov_loc = handle => {return !handle.RawPath.startsWith('fy+') && !handle.RawPath.startsWith('3dydfy:') && !handle.RawPath.startsWith('http');}
	const fallback = pBio.valueIni("LASTFM LANGUAGE", pBio.lang[1].name, pBio.lang[1].tf, 1);
	let lfm_server = pBio.lfmLang, def_server_EN = lfm_server == "www.last.fm", serverFallback = fallback && !def_server_EN;
	const fuzzy_match = (n, l) => {return 1 - levenshtein(n, l) / (n.length > l.length ? n.length : l.length) > 0.8;} // 0.8 sets fuzzy match level
	const levenshtein = (a, b) => {if (a.length === 0) return b.length; if (b.length === 0) return a.length; let i, j, prev, row, tmp, val; if (a.length > b.length) {tmp = a; a = b; b = tmp;} row = Array(a.length + 1); for (i = 0; i <= a.length; i++) row[i] = i; for (i = 1; i <= b.length; i++) {prev = i; for (j = 1; j <= a.length; j++) {if (b[i - 1] === a[j - 1]) val = row[j - 1]; else val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1)); row[j - 1] = prev; prev = val;} row[a.length] = prev;} return row[a.length];}
	this.setLfm = lang => {if (lang) lfm_server = lang; lfm_server = lfm_server == "en" ? "www.last.fm" : "www.last.fm/" + lfm_server; def_server_EN = lfm_server == "www.last.fm"; serverFallback = fallback && !def_server_EN;}; this.setLfm();
	const listeners = ["Listeners", "Hörer", "Oyentes", "Auditeurs", "Ascoltatori", "リスナー", "Słuchaczy", "Ouvintes", "Слушатели", "Lyssnare", "Dinleyiciler", "听众"];
	const noWiki = n => (/wiki|vikimiz|\u0412\u0438\u043A\u0438|\u7EF4\u57FA/i).test(n);
	const partial_match = pBio.valueIni("MISCELLANEOUS", pBio.def_tf[10].name, pBio.def_tf[10].tf, 1);
	const releaseDate = ["Release Date: ", "Veröffentlichungsdatum: ", "Fecha De Lanzamiento: ", "Date De Sortie: ", "Data Di Pubblicazione: ", "リリース日: ", "Data Wydania: ", "Data De Lançamento: ", "Дата релиза: ", "Utgivningsdatum: ", "Yayınlanma Tarihi: ", "发布日期: "];
	const res = () => {window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab();}
	const similar = ["Similar Artists: ", "Ähnliche Künstler: ", "Artistas Similares: ", "Artistes Similaires: ", "Artisti Simili: ", "似ているアーティスト: ", "Podobni Wykonawcy: ", "Artistas Parecidos: ", "Похожие исполнители: ", "Liknande Artister: ", "Benzer Sanatçılar: ", "相似艺术家: "];
	const sort = data => data.sort((a, b) => a.m - b.m);
	const stripAmp = n => n.replace(/&/g, "") || n;
	const tidy = (n, cutLeadThe) => {const nn = cutLeadThe ? n.replace(/^The /i, "") : n; return nn.replace(/&amp(;|)/g,"&").replace(/&quot(;|)/g,'"').replace(/&#39(;|)/g,"'").replace(/&gt(;|)/g, ">").replace(/&nbsp(;|)/g, "").replace(/\band\b|\//gi, "&").replace(/[.,!?:;'\u2019"\-_()[\]\u2010\s+]/g, "").replace(/\$/g, "s").toLowerCase() || n.trim();}
	const topAlb = ["Top Albums: ", "Top-Alben: ", "Álbumes Más Escuchados: ", "Top Albums: ", "Album Più Ascoltati: ", "人気アルバム: ", "Najpopularniejsze Albumy: ", "Álbuns Principais: ", "Популярные альбомы: ", "Toppalbum: ", "En Sevilen Albümler: ", "最佳专辑: "];
	this.fetch = (force, art, alb) => {get_bio(force, art); get_rev(force, art, alb, force == 2 ? true : false);}
	this.fetch_dynamic = () => {get_bio(false, {ix:0, focus:false, arr:[]}); amBio(false, {ix:0, focus:false, arr:[]})}
	function create_dl_file() {const n = fb.ProfilePath + "yttm\\foo_lastfm_img.vbs"; if (!sBio.file(n) || sBio.fs.GetFile(n).Size == "696") {const dl_im = "If (WScript.Arguments.Count <> 2) Then\r\nWScript.Quit\r\nEnd If\r\n\r\nurl = WScript.Arguments(0)\r\nfile = WScript.Arguments(1)\r\n\r\nSet objFSO = Createobject(\"Scripting.FileSystemObject\")\r\nIf objFSO.Fileexists(file) Then\r\nSet objFSO = Nothing\r\nWScript.Quit\r\nEnd If\r\n\r\nSet objXMLHTTP = CreateObject(\"MSXML2.XMLHTTP\")\r\nobjXMLHTTP.open \"GET\", url, false\r\nobjXMLHTTP.send()\r\n\r\nIf objXMLHTTP.Status = 200 Then\r\nSet objADOStream = CreateObject(\"ADODB.Stream\")\r\nobjADOStream.Open\r\nobjADOStream.Type = 1\r\nobjADOStream.Write objXMLHTTP.ResponseBody\r\nobjADOStream.Position = 0\r\nobjADOStream.SaveToFile file\r\nobjADOStream.Close\r\nSet objADOStream = Nothing\r\nEnd If\r\n\r\nSet objFSO = Nothing\r\nSet objXMLHTTP = Nothing"; sBio.save(n, dl_im, false);}} if (pBio.server) create_dl_file();

	const img_exp = (p_dl_ar, imgFolder, ex) => {
		const f = imgFolder + "update.txt", imgExisting = []; let allFiles = []; if (!sBio.file(f)) return [imgNo, 0, allFiles];
		const getNew = Date.now() - sBio.lastModified(f) > ex;
		if (!getNew) return [0, auto_add, allFiles];
		allFiles = utils.Glob(imgFolder + "*"); let imNo = 0;
		allFiles.forEach(v => {
			if ((/_([a-z0-9]){32}\.jpg$/).test(sBio.fs.GetFileName(v))) {
				imNo++; if (artLimit) imgExisting.push({p: v, m: sBio.lastModified(v)});
			}
		});
		if (artLimit) sort(imgExisting);
		const newImgNo = imgNo - imNo
		if (newImgNo > 0) return [newImgNo, 0, allFiles]; else if (!auto_add) {
			if (artLimit) {
				const remove = imgExisting.length - artLimit; if (remove > 0) {
					for (let j = 0; j < remove; j++) imgToDelete.push({a: p_dl_ar, p: imgExisting[j].p});
					bioCacheSave(true);}} return [0, auto_add, allFiles];} else return [5, auto_add, allFiles, imgExisting];
	}

	const match = (p_a, p_release, list, type) => {
		const rel_m = [], art_m = []; let a = sBio.removeDiacritics(tidy(p_a, true)), i = 0, rel = sBio.removeDiacritics(tidy(p_release, true));
		for (i = 0; i < list.length; i++) {
			rel_m[i] = list[i].nextSibling ? sBio.removeDiacritics(tidy(list[i].nextSibling.innerText, true)) : "N/A";
			art_m[i] = list[i].nextSibling && list[i].nextSibling.nextSibling ? sBio.removeDiacritics(tidy(list[i].nextSibling.nextSibling.innerText, true)) : "N/A";
			if (rel == rel_m[i] && art_m[i] == a) return i;
		}
		if (!partial_match) return -1;
		switch (true) {
			case type == 'rev':
				for (i = 0; i < list.length; i++) if (rel_m[i].includes(rel) && art_m[i].includes(a)) return i;
				a = stripAmp(a); rel = stripAmp(rel);
				for (i = 0; i < list.length; i++) if (fuzzy_match(rel, stripAmp(rel_m[i])) && stripAmp(art_m[i]).includes(a.replace(/&/g, ""))) return i;
				break;
			case type == 'title':
				for (i = 0; i < list.length; i++) if (rel_m[i].includes(rel) && art_m[i] == a) return i;
				for (i = 0; i < list.length; i++) if (fuzzy_match(rel, rel_m[i]) && art_m[i] == a) return i;
				break;
		}
		return -1;
	}

	const get_bio = (force, art) => {
		const stndBio = !art.ix || art.ix + 1 > art.arr.length;
		let artist_done = false, new_artist = stndBio ? name.artist(art.focus, true) : art.arr[art.ix].name, supCache = false;
		if (new_artist == artist && !force || new_artist == "") artist_done = true; else artist = new_artist;
		if (!stndBio) supCache = pBio.sup.Cache && !libBio.in_library(0, artist);
		if (this.lfm_bio && !artist_done) {
			const lfm_bio = pBio.getPth('bio', art.focus, artist, "", stndBio, supCache, artist.clean(), "", "", 'lfmBio', true, true), text = sBio.open(lfm_bio.pth), custBio = text.includes("Custom Biography");
			if (expired(lfm_bio.pth, exp, "", text, 0) && !custBio || force == 2 && !custBio || force == 1) {const dl_lfm_bio = new Dl_lastfm_bio(() => dl_lfm_bio.on_state_change()); dl_lfm_bio.Search(artist, lfm_bio.fo, lfm_bio.pth, force);}
		}
		this.chk_track({force: force, artist: stndBio ? artist : name.artist(art.focus, true), title: name.title(art.focus, true)});
		if (!artist_done) {
			if (this.dl_art_img) {const dl_art = new Dl_art_images; dl_art.run(artist, force, art, stndBio, supCache);} else timerBio.decelerating();
			if (pBio.lfm_sim && stndBio) {
				const fo_sim = pBio.cleanPth(pBio.pth.lfmSim, ppt.focus, 'server'), pth_sim = fo_sim + artist.clean() + " And Similar Artists.json";
				let len = 0, valid = false;
				if (sBio.file(pth_sim)) {const list = sBio.jsonParse(pth_sim, false, 'file'); if (list) {valid = sBio.objHasOwnProperty(list[0], 'name'); len = list.length;}}
				if (expired(pth_sim, exp) || !valid || force) {const dl_lfm_sim = new Lfm_similar_artists(() => dl_lfm_sim.on_state_change()); dl_lfm_sim.Search(artist, "", "", len > 115 ? 249 : 100, fo_sim, pth_sim);}
			}
			if (stndBio && artLimit && !pBio.lock) {
				let j = imgToDelete.length; while (j--) {
					if (imgToDelete[j].a != name.artist(true) && imgToDelete[j].a != name.artist(false)) {
					try {if (sBio.file(imgToDelete[j].p)) sBio.fs.DeleteFile(imgToDelete[j].p);} catch (e) {}
					if (!sBio.file(imgToDelete[j].p)) imgToDelete.splice(j, 1)
					}
				}
				bioCacheSave(true);
			}
		}
	}

	this.chk_track = tr => {
		let track_done = false; if (tr.artist + tr.title == trackID1 && !tr.force || tr.artist == "" || tr.title == "") track_done = true; else trackID1 = tr.artist + tr.title;
		if (this.lfm_rev && !track_done) {if (ppt.inclTrackRev) this.get_track(tr); else window.NotifyOthers("chkTrackRev_bio", tr);}
	}

	this.get_track = tr => {
		if (Date.now() - last_get_track < 500) tr.force = false; else last_get_track = Date.now();
		if (trackID2 == tr.artist + tr.title && !tr.force) return; trackID2 = tr.artist + tr.title;
		const lfm_tracks = pBio.getPth('track', ppt.focus, tr.artist, "Track Reviews", "", "", tr.artist.clean(), "", "Track Reviews", 'lfmRev', true, true), text = sBio.jsonParse(lfm_tracks.pth, false, 'file'), trk = tr.title.toLowerCase();
		if (!text || !text[trk] || text[trk].update < Date.now() - exp || text[trk].lang != pBio.lfmLang || tr.force) {const dl_lfm_track = new Lfm_track(() => dl_lfm_track.on_state_change()); dl_lfm_track.Search(tr.artist, trk, lfm_tracks.fo, lfm_tracks.pth, tr.force);}
	}

	const amBio = (force, art) => {
		const stndBio = !art.ix || art.ix + 1 > art.arr.length;
		if (!stndBio || !this.am_bio) return; const title = name.title(art.focus, true);
		if (!artist || !title) return;
		const am_bio = pBio.getPth('bio', art.focus, artist, "", stndBio, false, artist.clean(), "", "", 'amBio', true, true);
		if (force || expired(am_bio.pth, exp, "Bio " + partial_match + " " + artist + " - " + title, false) && !sBio.open(am_bio.pth).includes("Custom Biography")) {
		const dl_am_bio = new Dl_allmusic_bio(() => dl_am_bio.on_state_change()); dl_am_bio.Search(0, "https://www.allmusic.com/search/songs/" + encodeURIComponent(title + " " + artist), title, artist, am_bio.fo, am_bio.pth, force);
		}
	}

	const get_rev = (force, art, alb, onlyForceLfm) => {
		const stndAlb = !alb.ix || alb.ix + 1 > alb.arr.length, new_album_id = stndAlb ? pBio.eval(pBio.tf.aa + pBio.tf.l, alb.focus, true) : alb.arr[alb.ix].artist + alb.arr[alb.ix].album, new_title_id = name.title(art.focus, true);
		let supCache = false, title_done = false;
		if (new_title_id == title_id) title_done = true; else title_id = new_title_id;
		if (new_album_id == album_id && !force) {if (!title_done) amBio(force, art); return;}
		album_id = new_album_id; album = stndAlb ? name.album(alb.focus, true) : alb.arr[alb.ix].album; albm = stndAlb ? name.albm(alb.focus, true) : alb.arr[alb.ix].album;
		alb_artist = stndAlb ? name.alb_artist(alb.focus, true) : alb.arr[alb.ix].artist;
		if (!album || !alb_artist) return amBio(force, art);
		if (!stndAlb) supCache = pBio.sup.Cache && !libBio.in_library(1, alb_artist, album);
		if (stndAlb) {if (albm) get_cover(force, alb);} else if (force && pBio.rev_img) this.get_rev_img(alb_artist, album, "", "", force);
		if (this.am_rev && !onlyForceLfm) {
			const am_rev = pBio.getPth('rev', alb.focus, alb_artist, album, stndAlb, supCache, alb_artist.clean(), alb_artist.clean(), album.clean(), 'amRev', true, true);
			const artiste = stndAlb ? name.artist(alb.focus, true) : alb_artist;
			const am_bio = pBio.getPth('bio', alb.focus, artiste, "", stndAlb, pBio.sup.Cache && !libBio.in_library(0, artiste), artiste.clean(), "", "", 'amBio', true, true);
			const art_upd = expired(am_bio.pth, exp, "Bio " + partial_match + " " + am_rev.pth, false) && !sBio.open(am_bio.pth).includes("Custom Biography");
			let rev_upd = !done("Rev " + partial_match + " " + am_rev.pth, exp);
			if (rev_upd) {
				let amRev = sBio.open(am_rev.pth);
				rev_upd = !amRev || (!amRev.includes("Genre: ") || !amRev.includes("Review by ") && Date.now() - sBio.lastModified(sBio.file(am_rev.pth)) < exp) && !amRev.includes("Custom Review");
			}
			let dn_type = "";
			if (rev_upd || art_upd || force) {
				if ((this.am_rev && rev_upd) && (this.am_bio && art_upd) || force) dn_type = "both"; else if (this.am_rev && rev_upd || force) dn_type = "review"; else if (this.am_bio && art_upd || force) dn_type = "bio";
				const dl_am_rev = new Dl_allmusic_rev(() => dl_am_rev.on_state_change());
				const va = alb_artist.toLowerCase() == pBio.va || alb_artist.toLowerCase() != artiste.toLowerCase();
				dl_am_rev.Search(0, "https://www.allmusic.com/search/albums/" + encodeURIComponent(album + (!va ? " " + alb_artist : "")), album, alb_artist, artiste, va, dn_type, am_rev.fo, am_rev.pth, am_bio.fo, am_bio.pth, art, force);
			} else amBio(force, art);
		}
		if (!this.lfm_rev) return;
		const lfm_rev = pBio.getPth('rev', alb.focus, alb_artist, album, stndAlb, supCache, alb_artist.clean(), alb_artist.clean(), album.clean(), 'lfmRev', true, true), lfmRev = sBio.open(lfm_rev.pth), custRev = lfmRev.includes("Custom Review");
		if ((!expired(lfm_rev.pth, exp, "", lfmRev, 1) || custRev) && !force || custRev && force == 2) return;
		const lfm_alb = new Lfm_album(() => lfm_alb.on_state_change()); lfm_alb.Search(alb_artist, album, true, lfm_rev.fo, lfm_rev.pth, "", force, false);
	}

	const get_cover = (force, alb) => { // stndAlb
		const handle = sBio.handle(alb.focus, true); if (!handle) return;
		const g_img = utils.GetAlbumArtV2(handle, 0, false); if (g_img) return;
		const sw = this.lfm_cov && cov_loc(handle) ? 1 : pBio.rev_img ? 0 : 2; let lfm_cov;
		switch (sw) {
			case 1: { // cover
				const cov = pBio.getPth('cov', alb.focus, 'server');
				if (done(alb_artist + " - " + album + " " +  auto_corr + " " + cov.pth, exp) && !force) return;
				if (imgBio.chkPths([cov.pth], "", 2)) return;
				if (pBio.extra && imgBio.chkPths(pBio.extraPaths, "", 2, true)) return;
				lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(alb_artist, album, false, cov.fo, cov.pth, albm, force, false);
				break;
			}
			case 0: { // rev_img
				const rev_img = pBio.getPth('img', alb.focus, alb_artist, album);
				if (done(alb_artist + " - " + album + " " +  auto_corr + " " + rev_img.pth, exp) && !force) return;
				if (imgBio.chkPths([rev_img.pth, pBio.getPth('cov', alb.focus).pth], "", 2)) return;
				if (pBio.extra && imgBio.chkPths(pBio.extraPaths, "", 2, true)) return;
				lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(alb_artist, album, false, rev_img.fo, rev_img.pth, albm, force, true);
				break;
			}
		}
	}

	this.get_rev_img = (a, l, pe, fe, force) => { // !stndAlb
		if (!force) {if (done(a + " - " + l + " " +  auto_corr + " " + fe, exp)) return; const lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(a, l, false, pe, fe, l, false, true);}
		else {
			const metadb = libBio.in_library(2, a, l);
			if (metadb) {const g_img = utils.GetAlbumArtV2(metadb, 0, false); if (g_img) return;}
			else {
				const pth = pBio.getPth('img', ppt.focus, a, l, "", pBio.sup.Cache);
				if (imgBio.chkPths(pth.pe, pth.fe, 2)) return;
				const lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(a, l, false, pth.pe[pBio.sup.Cache], pth.pe[pBio.sup.Cache] + pth.fe, l, true, true);
			}
		}
	}

	function Dl_allmusic_bio(state_callback) {
		let artist = "", artistLink = "", fo_bio, pth_bio, sw = 0, title = ""; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
		this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {sBio.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);}}}

		this.Search = (p_sw, URL, p_title, p_artist, p_fo_bio, p_pth_bio, force) => {
			sw = p_sw; if (!sw) {fo_bio = p_fo_bio; pth_bio = p_pth_bio; title = p_title; artist = p_artist;}
			this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
		}

		this.Analyse = () => {
			switch (sw) {
				case 0: {
					sBio.doc.open(); const div = sBio.doc.createElement('div'); let i = 0, list;
					try {div.innerHTML = this.xmlhttp.responseText.replace(/by\s*<a href/gi, "<a href");
					list = div.getElementsByTagName('h4'); i = match(artist, title, list, 'title');
					if (i != -1) {
						artistLink = list[i].nextSibling.nextSibling.firstChild.getAttribute('href');
						if (artistLink) {sw = 1; sBio.doc.close(); return this.Search(sw, artistLink + "/biography");}
						update("Bio " + partial_match + " " + artist + " - " + title); sBio.trace("allmusic biography: " + artist + ": not found", true);
					} update("Bio " + partial_match + " " + artist + " - " + title); sBio.trace("allmusic biography: " + artist + ": not found", true);
					} catch (e) {update("Bio " + partial_match + " " + artist + " - " + title); sBio.trace("allmusic biography: " + artist + ": not found", true);}
					sBio.doc.close();
					break;
				}
				case 1:
					processAmBio(this.xmlhttp.responseText, artist, "", title, fo_bio, pth_bio, "");
					break;
			}
		}
	}

	const processAmBio = (responseText, artist, album, title, fo_bio, pth_bio, pth_rev) => {
		sBio.doc.open(); const div = sBio.doc.createElement('div');
		try {div.innerHTML = responseText; const dv = div.getElementsByTagName('div'); let active = "", biography = "", biographyAuthor = "", biographyGenre = [], tg = "";
		sBio.htmlParse(dv, 'className', 'text', v => biography = v.innerHTML.format());
		sBio.htmlParse(dv, 'className', 'active-dates', v => active = (v.childNodes[0].innerText + ": " + v.childNodes[1].innerText).trim());
		sBio.htmlParse(div.getElementsByTagName('a'), false, false, v => {const str = v.toString(); if (str.includes("www.allmusic.com/genre") || str.includes("www.allmusic.com/style")) {tg = v.innerText.trim(); if (tg) biographyGenre.push(tg);}});
		if (active.length) active = "\r\n\r\n" + active;
		if (biographyGenre.length) biographyGenre = "\r\n\r\n" + "Genre: " + biographyGenre.join(", ");
		sBio.htmlParse(div.getElementsByTagName('h3'), 'className', 'headline', v => biographyAuthor = v.innerHTML.format()); if (biographyAuthor) biographyAuthor = "\r\n\r\n" + biographyAuthor;
		biography = biography + biographyGenre + active + biographyAuthor;
		biography = biography.trim();
		if (biography.length > 19) {sBio.buildPth(fo_bio); sBio.save(pth_bio, biography, true); res();}
		else {album ? update("Bio " + partial_match + " " + pth_rev) : update("Bio " + partial_match + " " + artist + " - " + title); sBio.trace("allmusic biography: " + artist + ": not found", true);}
		} catch (e) {album ? update("Bio " + partial_match + " " + pth_rev) : update("Bio " + partial_match + " " + artist + " - " + title); sBio.trace("allmusic biography: " + artist + ": not found", true);}
		sBio.doc.close();
	}

	function Dl_allmusic_rev(state_callback) {
		let alb_artist, album, art, artist = "", artistLink = "", dn_type = "", fo_bio, fo_rev, force, pth_bio, pth_rev, sw = 0, va = false; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
		this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {sBio.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);}}}

		this.Search = (p_sw, URL, p_album, p_alb_artist, p_artist, p_va, p_dn_type, p_fo_rev, p_pth_rev, p_fo_bio, p_pth_bio, p_art, p_force) => {
			sw = p_sw; if (!sw) {dn_type = p_dn_type; fo_rev = p_fo_rev; pth_rev = p_pth_rev; fo_bio = p_fo_bio; pth_bio = p_pth_bio; album = p_album; alb_artist = p_alb_artist; artist = p_artist; va = p_va; art = p_art; force = p_force;}
			this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
		}

		this.Analyse = () => {
			sBio.doc.open(); const div = sBio.doc.createElement('div'); let i = 0, list, str = "", tg = "";
			switch (sw) {
				case 0:
					try {div.innerHTML = this.xmlhttp.responseText;
					list = div.getElementsByTagName('h4'); i = match(alb_artist, album, list, 'rev');
					if (i != -1) {
						if (!va) artistLink = list[i].nextSibling.nextSibling.firstChild.getAttribute('href');
						if (dn_type == "both" || dn_type == "review") {sw = 1; sBio.doc.close(); return this.Search(sw, list[i].nextSibling.firstChild.getAttribute('href'));}
						else if (dn_type == "bio" && !va) {sw = 2; sBio.doc.close(); return this.Search(sw, artistLink + "/biography");}
					} amBio(force, art); update("Bio " + partial_match + " " + pth_rev); update("Rev " + partial_match + " " + pth_rev); sBio.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);
					} catch (e) {amBio(force, art); update("Bio " + partial_match + " " + pth_rev); update("Rev " + partial_match + " " + pth_rev); sBio.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);}
					sBio.doc.close();
					break;
				case 1:
					try {div.innerHTML = this.xmlhttp.responseText;
					const a = div.getElementsByTagName('a'), dv = div.getElementsByTagName('div');
					let rating = "x", releaseDate = "", review = "", reviewAuthor = "", reviewGenre = [], reviewMood = [], reviewTheme = [];
					sBio.htmlParse(dv, 'className', 'text', v => review = v.innerHTML.format());
					sBio.htmlParse(dv, 'className', 'release-date', v => releaseDate = (v.childNodes[0].innerText + ": " + v.childNodes[1].innerText).trim());
					sBio.htmlParse(a, false, false, v => {str = v.toString(); if (str.includes("www.allmusic.com/genre") || str.includes("www.allmusic.com/style")) {tg = v.innerText.trim(); if (tg) reviewGenre.push(tg);}})
					sBio.htmlParse(a, false, false, v => {str = v.toString(); if (str.includes("www.allmusic.com/mood")) {const tm = v.innerText.trim(); if (tm) reviewMood.push(tm);} if (str.includes("www.allmusic.com/theme")) {const tth = v.innerText.trim(); if (tth) reviewTheme.push(tth);}})
					if (releaseDate.length) releaseDate = "\r\n\r\n" + releaseDate;
					if (reviewGenre.length) reviewGenre = "\r\n\r\n" + "Genre: " + reviewGenre.join(", ");
					if (reviewMood.length) reviewMood = "\r\n\r\n" + "Album Moods: " + reviewMood.join(", ");
					if (reviewTheme.length) reviewTheme = "\r\n\r\n" + "Album Themes: " + reviewTheme.join(", ");
					sBio.htmlParse(div.getElementsByTagName('h3'), 'className', 'review-author headline', v => reviewAuthor = v.innerHTML.format()); if (reviewAuthor) reviewAuthor = "\r\n\r\n" + reviewAuthor;
					review = review + reviewGenre + reviewMood + reviewTheme + releaseDate + reviewAuthor;
					review = review.trim();
					sBio.htmlParse(div.getElementsByTagName('li'), 'id', 'microdata-rating', v => rating = v.childNodes[2].innerText / 2);
					review = ">> Album rating: " + rating + " <<  " + review;
					if (review.length > 22) {sBio.buildPth(fo_rev); sBio.save(pth_rev, review, true); res();} else {update("Rev " + partial_match + " " + pth_rev); sBio.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);}
					} catch (e) {update("Rev " + partial_match + " " + pth_rev); sBio.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);}
					sBio.doc.close();
					if (dn_type != "both") return;
					if (artistLink) {sw = 2; return this.Search(sw, artistLink + "/biography");} amBio(force, art);
					break;
				case 2:
					sBio.doc.close();
					processAmBio(this.xmlhttp.responseText, artist, album, "", fo_bio, pth_bio, pth_rev);
					break;
			}
		}
	}

	function Dl_lastfm_bio(state_callback) {
		const popAlbums = [], scrobbles = ["", ""]; let artist, con = "", counts = ["", ""], fo_bio, itemDate = "", itemName = ["", ""], itemValue = ["", "", ""], pop = "", pth_bio, retry = false, searchBio = 0, simArtists = [], tags = [], topAlbums = []; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
		const r1 = ["Popular this week", "Beliebt diese Woche", "Popular esta semana", "Populaire cette semaine", "Popolare questa settimana", "今週の人気音楽", "Popularne w tym tygodniu", "Mais ouvida na semana", "Популярно на этой неделе", "Populärt denna vecka", "Bu hafta popüler olanlar", "本周热门"];
		const r2 = ["Popular Now", "Beliebt Jetzt", "Popular Ahora", "Populaire Maintenant", "Popolare Ora", "今人気", "Popularne Teraz", "Popular Agora", "Популярные сейчас", "Populär Nu", "Şimdi Popüler", "热门 现在"];
		this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {if (searchBio < 2 || searchBio == 2 && itemValue[0]) {searchBio++; this.Search(artist, fo_bio, pth_bio);} if (searchBio == 3) this.func(true);}}}

		this.Search = (p_artist, p_fo_bio, p_pth_bio, force) => {
			artist = p_artist; fo_bio = p_fo_bio; pth_bio = p_pth_bio;
			this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			const URL = searchBio == 3 ? "https://" + lfm_server + "/music/" + encodeURIComponent(artist) + "/" + encodeURIComponent(itemValue[0]) : searchBio == 2 ? "https://www.last.fm/music/" + encodeURIComponent(artist) + "/+albums" : "https://" + (!retry ? lfm_server : "www.last.fm") + "/music/" + encodeURIComponent(artist) + (searchBio ? "/+wiki" : "");
			this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
		}

		this.Analyse = saveOnly => {
			if (!saveOnly) {
				sBio.doc.open(); const div = sBio.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
				let i = 0;
				switch (searchBio) {
					case 0: {
						const h3 = div.getElementsByTagName('h3'), h4 = div.getElementsByTagName('h4'); let j = 0;
						sBio.htmlParse(div.getElementsByTagName('li'), 'className', 'tag', v => tags.push(v.innerText.trim().titlecase().replace(/\bAor\b/g, "AOR").replace(/\bDj\b/g, "DJ").replace(/\bFc\b/g, "FC").replace(/\bIdm\b/g, "IDM").replace(/\bNwobhm\b/g, "NWOBHM").replace(/\bR&b\b/g, "R&B").replace(/\bRnb\b/g, "RnB").replace(/\bUsa\b/g, "USA").replace(/\bUs\b/g, "US").replace(/\bUk\b/g, "UK")));
						sBio.htmlParse(h4, 'className', 'artist-header-featured-items-item-header', v => {itemName[j] = v.innerText.trim(); j++;}); j = 0;
						sBio.htmlParse(h3, 'className', 'artist-header-featured-items-item-name', v => {itemValue[j] = v.innerText.trim(); j++;}); j = 0;
						sBio.htmlParse(div.getElementsByTagName('p'), 'className', 'artist-header-featured-items-item-aux-text artist-header-featured-items-item-date', v => {itemDate = v.innerText.trim(); return true;});
						sBio.htmlParse(h3, 'className', 'catalogue-overview-similar-artists-full-width-item-name', v => {simArtists.push(v.innerText.trim().titlecase())});
						sBio.htmlParse(h4, 'className', 'header-metadata-tnew-title', v => {scrobbles[j] = v.innerText.trim().titlecase(); j++;}); j = 0;
						sBio.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {counts[j] = v.innerText.trim().titlecase(); j++;});
						if (tags.length) tags = "\r\n\r\n" + "Top Tags: " + tags.join(", "); else tags = "";
						if (itemValue[1].length) {
							r1.forEach((v, i) => itemName[1] = itemName[1].replace(RegExp(v, "i"), r2[i]));
							pop = "\r\n\r\n" + itemName[1] + ": " + itemValue[1];
						}
						if (itemValue[0].length) {
							if (!itemValue[1].length) {
								r1.forEach((v, i) => itemName[0] = itemName[0].replace(RegExp(v, "i"), r2[i]));
							}
							pop += (itemValue[1].length ? "; " : "\r\n\r\n") + itemName[0].titlecase() + ": " + itemValue[0];
						}
						if (simArtists.length) simArtists = "\r\n\r\n" + similar[pBio.lfmLang_ix] + simArtists.join(", "); else simArtists = ""; sBio.doc.close();
						searchBio = 1;
						return this.Search(artist, fo_bio, pth_bio);
					}
					case 1: {
						let factbox = ""; con = "";
						sBio.htmlParse(div.getElementsByTagName('div'), 'className', 'wiki-content', v => {con = v.innerHTML.format(); return true;});
						sBio.htmlParse(div.getElementsByTagName('li'), 'className', 'factbox-item', v => {factbox = ""; factbox = v.innerHTML.replace(/<\/H4>/gi, ": ").replace(/\s*<\/LI>\s*/gi, ", ").replace(/\s*Show all members…\s*/gi, "").format().replace(/,$/, ""); if (factbox) con += ("\r\n\r\n" + factbox);});
						sBio.doc.close();
						if (!retry) {searchBio = 2; return this.Search(artist, fo_bio, pth_bio);}
						break;
					}
					case 2:
						i = 0;
						sBio.htmlParse(div.getElementsByTagName('h3'), 'className', 'resource-list--release-list-item-name', v => {i < 4 ? popAlbums.push(v.innerText.trim().titlecase()) : topAlbums.push(v.innerText.trim().titlecase()); i++; if (i == 10) return true;});
						sBio.doc.close();
						if (popAlbums.length) {
							const mapAlbums = topAlbums.map(v => v.cut()), match = mapAlbums.includes(popAlbums[0].cut());
							if (topAlbums.length > 5 && !match) topAlbums.splice(5, 0, popAlbums[0]); else topAlbums = topAlbums.concat(popAlbums);
						}
						topAlbums = [...new Set(topAlbums)];
						topAlbums.length = Math.min(6, topAlbums.length);
						if (topAlbums.length) topAlbums = "\r\n\r\n" + topAlb[pBio.lfmLang_ix] + topAlbums.join(", "); else topAlbums = "";
						if (itemValue[0]) {searchBio = 3; return this.Search(artist, fo_bio, pth_bio);}
						break;
					case 3:
						sBio.htmlParse(div.getElementsByTagName('dd'), 'className', 'catalogue-metadata-description', v => {itemValue[2] = v.innerText.trim().split(',')[0]; return true});
						sBio.doc.close();
						if (itemValue[0].length) {
							const item = itemDate.length && itemValue[2].length && itemDate.length != itemValue[2].length ? " (" + itemDate + " - " + itemValue[2] + ")" : itemValue[2].length ? " (" + itemValue[2] + ")" : itemDate.length ? " (" + itemDate + ")" : "";
							if (item) pop += item;
						}
						break;
				}
			}
			if ((!con.length || con.length < 45 && noWiki(con)) && serverFallback && !retry) {retry = true; searchBio = 1; return this.Search(artist, fo_bio, pth_bio);}
			if (con.length < 45 && noWiki(con)) con = "";
			con += tags; con += topAlbums; con += pop; con += simArtists; if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) con += ("\r\n\r\nLast.fm: " + (counts[1].length ? scrobbles[1] + " " + counts[1] + "; " : "") + (counts[0].length ? scrobbles[0] + " " + counts[0] : "")); con = con.trim();
			if (!con.length) {sBio.trace("last.fm biography: " + artist +  ": not found", true); return;}
			sBio.buildPth(fo_bio); sBio.save(pth_bio, con, true); res(); pBio.get_multi(); window.NotifyOthers("get_multi_bio", "get_multi_bio");
		}
	}

	function Dl_art_images() {
		this.run = (dl_ar, force, art, p_stndBio, p_supCache) => {
			if (!sBio.file(fb.ProfilePath + "yttm\\foo_lastfm_img.vbs")) return;
			let img_folder = p_stndBio ? pBio.cleanPth(pBio.pth.imgArt, art.focus, 'server') : pBio.cleanPth(pBio.mul.imgArt, art.focus, 'mul', dl_ar, "", 1);
			if (p_supCache && !sBio.folder(img_folder)) img_folder = pBio.cleanPth(pBio.sup.imgArt, art.focus, 'mul', dl_ar, "", 1);
			const getNo = img_exp(dl_ar, img_folder, !force ? exp : 0); if (!getNo[0]) return; const lfm_art = new Lfm_art_img(() => lfm_art.on_state_change()); lfm_art.Search(dl_ar, img_folder, getNo[0], getNo[1], getNo[2], getNo[3], force);
		}
	}

	function Lfm_art_img(state_callback) {
		let allFiles, autoAdd, dl_ar, getNo, imgExisting, img_folder, retry = false; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
		this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {sBio.trace("last.fm artist images: " + dl_ar + ": none found" + " Status error: " + this.xmlhttp.status, true);}}}

		this.Search = (p_dl_ar, p_img_folder, p_getNo, p_autoAdd, p_allFiles, p_imgExisting, force) => {
			dl_ar = p_dl_ar; img_folder = p_img_folder; getNo = p_getNo; autoAdd = p_autoAdd; allFiles = p_allFiles; imgExisting = p_imgExisting;
			this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			const URL = "https://" + (!retry ? lfm_server : "www.last.fm") + "/music/" + encodeURIComponent(dl_ar) + "/+images";
			this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
		}

		this.Analyse = () => {
			const a = dl_ar.clean(); sBio.doc.open();
			const div = sBio.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
			const list = div.getElementsByTagName('img'); let links = []; if (!list) {if (serverFallback && !retry) {retry = true; sBio.doc.close(); return this.Search(dl_ar, img_folder);} sBio.doc.close(); return sBio.trace("last.fm artist images: " + dl_ar + ": none found", true);}
			sBio.htmlParse(list, false, false, v => {const attr = v.getAttribute("src"); if (attr.includes("avatar170s/")) links.push(attr.replace("avatar170s/", ""));});
			sBio.doc.close();
			const blacklist = imgBio.blacklist(a.toLowerCase());
			links = links.filter(v => !blacklist.includes(v.substring(v.lastIndexOf("/") + 1) + ".jpg"));
			if (links.length) {
				sBio.buildPth(img_folder); if (sBio.folder(img_folder)) {
					if (autoAdd && artLimit) {
						let k = 0, noNewLinks = 0; for (k = 0; k < Math.min(links.length, 5); k++) {
							const iPth = img_folder + a + "_" + links[k].substring(links[k].lastIndexOf("/") + 1) + ".jpg";
							if (imgExisting.every(v => v.p !== iPth)) noNewLinks++; if (noNewLinks == 5) break;
						}
						let remove = imgExisting.length + noNewLinks - artLimit; remove = Math.min(remove, imgExisting.length); if (remove > 0) {
							for (k = 0; k < remove; k++) imgToDelete.push({a: a, p: imgExisting[k].p}); bioCacheSave(true);
						}
					}
					sBio.save(img_folder + "update.txt", "", true); timerBio.decelerating();
					if (autoAdd) {
						$Bio.take(links, getNo).forEach(v => sBio.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + v + "\" \"" + img_folder + a + "_" + v.substring(v.lastIndexOf("/") + 1) + ".jpg" + "\"", 0));
					} else {
						let c = 0;
						$Bio.take(links, imgNo).some(v => {
							const imPth = img_folder + a + "_" + v.substring(v.lastIndexOf("/") + 1) + ".jpg";
							if (!allFiles.includes(imPth)) {
								sBio.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + v + "\" \"" + imPth + "\"", 0); c++;
								return c == getNo;
							}
						});
					}
				}
			}
		}
	}

	function Lfm_album(state_callback) {
		const scrobbles = ["", "", ""];
		let alb_artist, albm, album, counts = ["", "", ""], fo, getStats = true, pth, rd = "", rd_n = "", retry = false, rev, rev_img, stats = "", tags = [], tr = "", URL = ""; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
		this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {if (getStats && rev) {getStats = false; return this.Search(alb_artist, album, rev, fo, pth);} sBio.trace("last.fm album " + (rev ? "review: " :"cover: ") + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);}}}

		this.Search = (p_alb_artist, p_album, p_rev, p_fo, p_pth, p_albm, force, p_rev_img) => {
			alb_artist = p_alb_artist; album = p_album; rev = p_rev; fo = p_fo; pth = p_pth; albm = p_albm; rev_img = p_rev_img;
			if (!getStats && rev || !rev) {
				URL = url.lfm; if (rev && !def_server_EN && !retry) URL += "&lang=" + pBio.lfmLang;
				URL += "&method=album.getInfo&artist=" + encodeURIComponent(alb_artist) + "&album=" + encodeURIComponent(rev || retry ? album : albm) + "&autocorrect=" + auto_corr;
			} else URL = "https://" + lfm_server + "/music/" + encodeURIComponent(alb_artist) + "/" + encodeURIComponent(album.replace(/\+/g, "%2B"));
			this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
			if (!getStats && rev || !rev) this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
		}

		this.Analyse = () => {
			if (!getStats && rev) {
				let wiki = sBio.jsonParse(this.xmlhttp.responseText, false, 'get', 'album.wiki.content', 'name":');
				if (!wiki) {if (serverFallback && !retry) {retry = true; return this.Search(alb_artist, album, rev, fo, pth);} if (!stats.length) return sBio.trace("last.fm album review: " + album + " / " + alb_artist + ": not found", true);}
				else {wiki = wiki.replace(/<[^>]+>/ig,""); const f = wiki.indexOf(" Read more on Last.fm"); if (f != -1) wiki = wiki.slice(0, f); wiki = wiki.replace(/\n/g, "\r\n").replace(/(\r\n)(\r\n)+/g, "\r\n\r\n").trim();}
				wiki = wiki ? wiki + tags + stats : tags + stats; wiki = wiki.trim(); sBio.buildPth(fo); sBio.save(pth, wiki, true); res();
			} else if (rev) {
				sBio.doc.open(); const div = sBio.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText; let j = 0;
				sBio.htmlParse(div.getElementsByTagName('li'), 'className', 'tag', v => tags.push(v.innerText.trim().titlecase().replace(/\bAor\b/g, "AOR").replace(/\bDj\b/g, "DJ").replace(/\bFc\b/g, "FC").replace(/\bIdm\b/g, "IDM").replace(/\bNwobhm\b/g, "NWOBHM").replace(/\bR&b\b/g, "R&B").replace(/\bRnb\b/g, "RnB").replace(/\bUsa\b/g, "USA").replace(/\bUs\b/g, "US").replace(/\bUk\b/g, "UK")));
				sBio.htmlParse(div.getElementsByTagName('dt'), 'className', 'catalogue-metadata-heading', v => {if (j) {rd_n = v.innerText.trim().titlecase(); return true;} j++;}); j = 0;
				sBio.htmlParse(div.getElementsByTagName('dd'), 'className', 'catalogue-metadata-description', v => {if (!j) tr = v.innerText.trim().replace(/\b1 tracks/, "1 track").split(',')[0]; else {rd = v.innerText.trim(); return true;} j++;}); j = 0;
				sBio.htmlParse(div.getElementsByTagName('h4'), 'className', 'header-metadata-tnew-title', v => {scrobbles[j] = v.innerText.trim().titlecase(); j++}); j = 0;
				sBio.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {counts[j] = v.innerText.trim().titlecase(); j++});
				sBio.doc.close();
				if (tags.length) {tags = [...new Set(tags)]; tags.length = Math.min(5, tags.length); tags = "\r\n\r\n" + "Top Tags: " + tags.join(", ");} else tags = "";
				if (rd_n && rd && (/\d\d\d\d/).test(rd)) stats += ("\r\n\r\n" + rd_n + ": " + rd + (tr ? " | " + tr : ""));
				if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) stats += ("\r\n\r\nLast.fm: " + (counts[1].length ? scrobbles[1] + " " + counts[1] + "; " : "") + (counts[1].length ? scrobbles[0] + " " + counts[0] : ""));
				if (scrobbles[2] && counts[2] && scrobbles[2] != scrobbles[0] && scrobbles[1] != scrobbles[0]) stats += ("\r\n\r\n" + "Rating: " + scrobbles[2] + ": " + counts[2]);
				getStats = false; return this.Search(alb_artist, album, rev, fo, pth);
			} else {
				if (!sBio.file(fb.ProfilePath + "yttm\\foo_lastfm_img.vbs")) return;
				const data = sBio.jsonParse(this.xmlhttp.responseText, false, 'get', 'album.image', 'name":'); if (!data || data.length < 5) {update(alb_artist + " - " + (retry ? album : albm) + " " + auto_corr + " " + pth); if (!retry && name.alb_strip && album != albm) {retry = true; return this.Search(alb_artist, album, rev, fo, pth, albm);} return sBio.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found", true);}
				let link = data[pBio.sup.imgRevHQ || !rev_img ? 4 : 3]["#text"];
				if (link && (pBio.sup.imgRevHQ || !rev_img)) {const linkSplit = link.split("/"); linkSplit.splice(linkSplit.length - 2, 1); link = linkSplit.join("/");} if (!link) {update(alb_artist + " - " + (retry ? album : albm) + " " + auto_corr + " " + pth); if (!retry && name.alb_strip && album != albm) {retry = true; return this.Search(alb_artist, album, rev, fo, pth, albm);} return sBio.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found", true);} timerBio.decelerating(true);
				sBio.buildPth(fo); sBio.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + link + "\" \"" + pth + link.slice(-4) + "\"", 0);
			}
		}
	}

	function Lfm_track(state_callback) {
		const counts = ["", ""], scrobbles = ["", ""];
		const formatName = n => n.replace(/[\s/]/g, "-").replace(/[.,!?:;'\u2019"_\u2010+()[\]&]/g, "").replace(/\$/g, "s").replace(/-+/g, "-").toLowerCase();
		let album = "", artist, feat = "", fo, force = false, from = "", getIDs = true, getStats = true, lfm_done = false, pth, releases = "", retry = false, src = 0, stats = "", text = {ids:{}}, track, URL = "", wiki = "";
		this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
		this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {if (getStats) {getStats = false; return this.Search(artist, track, fo, pth, force);} if (lfm_done) revSave(releases || stats.length ? false : true);}}}

		this.Search = (p_artist, p_track, p_fo, p_pth, p_force) => {
			artist = p_artist; track = p_track; fo = p_fo; pth = p_pth; force = p_force;
			if (!lfm_done) {
				if (!getStats) {
					URL = url.lfm; if (!def_server_EN && !retry) URL += "&lang=" + pBio.lfmLang;
					URL += "&method=track.getInfo&artist=" + encodeURIComponent(artist) + "&track=" + encodeURIComponent(track) + "&autocorrect=" + auto_corr;
				} else {
					text = sBio.jsonParse(pth, false, 'file'); if (!text) text = {ids:{}}
					URL = "https://" + lfm_server + "/music/" + encodeURIComponent(artist) + "/_/" + encodeURIComponent(track);
				}
			} else {
				if (text[track] && text[track].wiki && !force) {wiki = text[track].wiki; if (text[track].s) src = text[track].s; return revSave();}
				if (getIDs && (!text.ids['ids_update'] || text.ids['ids_update'] < Date.now() - expiry || force)) URL = url.lfm_sf + "songs/" + formatName(artist);
				else if (text.ids[tidy(track)]) {getIDs = false; URL = url.lfm_sf + text.ids[tidy(track)];}
				else return revSave();
			}
			this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
			if (!getStats && !lfm_done) this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
	}

		this.Analyse = () => {
			if (!lfm_done) {
				if (!getStats) {
					wiki = sBio.jsonParse(this.xmlhttp.responseText, false, 'get', 'track.wiki.content', 'name":');
					if (wiki) {wiki = wiki.replace(/<[^>]+>/ig,""); const f = wiki.indexOf(" Read more on Last.fm"); if (f != -1) wiki = wiki.slice(0, f); wiki = wiki.replace(/\n/g, "\r\n").replace(/(\r\n)(\r\n)+/g, "\r\n\r\n").replace(/\[edit\]\s*$/i,"").trim();}
					if (!wiki) {
						if (serverFallback && !retry) {retry = true; return this.Search(artist, track, fo, pth, force);}
						if (!lfm_done && (pBio.lfmLang == "en" || serverFallback)) {lfm_done = true; return this.Search(artist, track, fo, pth, force);}
						if (!releases && !stats.length) return revSave(true);
					} else src = 1;
					revSave();
				} else {
					sBio.doc.open(); const div = sBio.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText; let j = 0;
					sBio.htmlParse(div.getElementsByTagName('h3'), 'className', 'text-18', v => {if (v.parentNode && v.parentNode.className && v.parentNode.className == 'visible-xs') {from = v.innerText.trim(); return true;}});
					sBio.htmlParse(div.getElementsByTagName('h4'), 'className', 'source-album-name', v => {album = v.innerText.trim(); return true;});
					if (!pBio.lfmLang_ix) sBio.htmlParse(div.getElementsByTagName('p'), 'className', 'more-link-fullwidth', v => {feat = v.innerText.trim(); return true;});
					sBio.htmlParse(div.getElementsByTagName('h4'), 'className', 'header-metadata-tnew-title', v => {scrobbles[j] = v.innerText.trim().titlecase(); j++}); j = 0;
					sBio.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {counts[j] = v.innerText.trim().titlecase(); j++});
					sBio.doc.close();
					if (from && album) releases += from + ": " + album + ".";
					if (feat) {const featNo = feat.replace(/\D/g, ""), rel = featNo != "1" ? "releases" : "release"; feat = ` Also featured on ${featNo} other ${rel}.`; releases += feat;}
					if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) stats += ("Last.fm: " + (counts[1].length ? scrobbles[1] + " " + counts[1] + "; " : "") + (counts[0].length ? scrobbles[0] + " " + counts[0] : ""));
					getStats = false; return this.Search(artist, track, fo, pth, force);
				}
			} else {
				sBio.doc.open(); const div = sBio.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
				if (!getIDs) {
					let j = 0; div.innerHTML = this.xmlhttp.responseText;
					sBio.htmlParse(div.getElementsByTagName('div'), 'className', 'inner', v => {let tx = v.innerText; if (tx && tx.includes(" >>")) tx = tx.split(" >>")[0]; if (tx) {if (!j) wiki = tx; else wiki += "\r\n\r\n" + tx; j++;}}); wiki = wiki.trim();
					sBio.doc.close();
					if (!wiki) {if (!releases && !stats.length) return revSave(true);} else src = 2; revSave();
				} else {
					text.ids = {}
					sBio.htmlParse(div.getElementsByTagName('a'), false, false, v => {if (v.href.includes("/facts/") && !v.innerText.includes("Artistfacts")) text.ids[tidy(v.innerText)] = v.href.replace("about:/", "");});
					text.ids['ids_update'] = Date.now();
					sBio.doc.close(); getIDs = false; this.Search(artist, track, fo, pth, force);
				}
			}
		}

		const revSave = ret => {
			if (text[track] && text[track].lang == pBio.lfmLang) {
				if (!releases) releases = text[track].releases;
				if (!wiki && !force) {wiki = text[track].wiki; if (wiki) src = text[track].s;}
				if (!stats) stats = text[track].stats;
			}
			text[track] = {releases: releases, wiki: wiki || "", stats: stats, s: src, lang: pBio.lfmLang, update: Date.now()}; sBio.buildPth(fo); sBio.save(pth, JSON.stringify(text, null, 3), true); if (ret) return sBio.trace("last.fm track review: " + track.titlecase() + " / " + artist + ": not found", true); res();
		}
	}
}
timerBio.clear(timerBio.zSearch); timerBio.zSearch.id = setTimeout(() => {if (pBio.server && ppt.panelActive) {servBio.fetch(false, {ix:0, focus:false}, {ix:0, focus:false}); servBio.fetch(false, {ix:0, focus:true}, {ix:0, focus:true});} timerBio.zSearch.id = null;}, 3000);

//if (!ppt.get("SYSTEM.Software Notice Checked", false)) fb.ShowPopupMessage("THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.", "Biography"); ppt.set("SYSTEM.Software Notice Checked", true);
ppt.set("SYSTEM.Image Border-1 Shadow-2 Both-3", null); ppt.set("SYSTEM.Image Reflection", null);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function BiographyCallbacks() {
	this.on_focus = function(is_focused) {tb.focus = is_focused;}
	this.on_get_album_art_done = function(handle, art_id, image, image_path)  {imgBio.get_album_art_done(handle, art_id, image, image_path);}
	this.on_item_focus_change = function() {if (!ppt.panelActive) return; if (fb.IsPlaying && !ppt.focus) return; if (ppt.mul_item) pBio.get_multi(true); else if (!pBio.multi_new()) return; if (t.block() && !pBio.server) {imgBio.get = true; t.get = ppt.focus ? 2 : 1; imgBio.artist_reset(); t.album_reset(); t.artist_reset();} else {if (t.block() && pBio.server) {imgBio.get = true; t.get = 1; imgBio.artist_reset(); t.album_reset(); t.artist_reset();} else {imgBio.get = false; t.get = 0;} pBio.focus_load(); pBio.focus_serv();}}
	this.on_key_down = function(vkey) {switch(vkey) {case 0x10: case 0x11: case 0x12: t.paint(); break; case 0x21: if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().page_throttle(1); break; case 0x22: if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().page_throttle(-1); break; case 35: if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().scroll_to_end(); break; case 36:if (!ppt.img_only && !pBio.zoom()) t.scrollbar_type().check_scroll(0, 'full'); break; case 37: imgBio.wheel(1); break; case 39: imgBio.wheel(-1); break;}}
	this.on_key_up = function(vkey) {if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) t.paint();}
	this.on_library_items_added = function() {if (!ppt.panelActive) return; if (!libBio) return; libBio.update = true;}
	this.on_library_items_removed = function() {if (!ppt.panelActive) return; if (!libBio) return; libBio.update = true;}
	this.on_library_items_changed = function() {if (!ppt.panelActive) return; if (!libBio) return; libBio.update = true;}
	this.on_load_image_done = function(id, image, image_path) {imgBio.load_image_done(id, image, image_path);}
	this.on_metadb_changed = function() {if (!ppt.panelActive) return; if (pBio.ir(ppt.focus) || t.block() && !pBio.server || !pBio.multi_new()) return; pBio.get_multi(true); if (!ppt.img_only) t.on_playback_new_track(); if (!ppt.text_only || uiBio.blur) imgBio.on_playback_new_track(); pBio.metadb_serv();}
	this.on_mouse_lbtn_dblclk = function(x, y, m) {if (!ppt.panelActive) return; butBio.lbtn_dn(x, y); t.scrollbar_type().lbtn_dblclk(x, y); if (!pBio.dblClick) return; if (ppt.touchControl) pBio.last_pressed_coord = {x: x, y: y}; pBio.click(x, y);}
	this.on_mouse_lbtn_down = function(x, y) {if (!ppt.panelActive) return; if (ppt.touchControl) pBio.last_pressed_coord = {x: x, y: y}; tb.lbtn_dn(x, y); butBio.lbtn_dn(x, y); t.scrollbar_type().lbtn_dn(x, y); imgBio.lbtn_dn(x, y);}
	this.on_mouse_lbtn_up = function(x, y) {if (!ppt.panelActive) return; t.scrollbar_type().lbtn_drag_up(); if (!pBio.dblClick && !butBio.Dn && !imgBio.bar.dn) pBio.click(x, y); t.scrollbar_type().lbtn_up(); pBio.clicked = false; tb.lbtn_up(); butBio.lbtn_up(x, y); imgBio.lbtn_up(x, y);}
	this.on_mouse_leave = function() {if (!ppt.panelActive) return; pBio.leave(); butBio.leave(); t.scrollbar_type().leave(); imgBio.leave(); pBio.m_y = -1;}
	this.on_mouse_mbtn_up = function(x, y, mask) {if (mask == 0x0004) pBio.inactivate(); else if (ppt.panelActive) pBio.mbtn_up(x, y);}
	this.on_mouse_move = function(x, y, m) {if (!ppt.panelActive) return; if (pBio.m_x == x && pBio.m_y == y) return; pBio.move(x, y); butBio.move(x, y); t.scrollbar_type().move(x, y); tb.img_move(x, y); tb.move(x, y); imgBio.move(x, y); pBio.m_x = x; pBio.m_y = y;}
	this.on_mouse_rbtn_up = function(x, y) {if (!ppt.panelActive) {menBio.activate(x, y); return true} menBio.rbtn_up(x, y); return true;}
	this.on_mouse_wheel = function(step) {if (!ppt.panelActive) return; switch (pBio.zoom()) {case false: if (butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y)) menBio.wheel(step, true); else if (pBio.text_trace) {if (!ppt.img_only) t.scrollbar_type().wheel(step, false);} else imgBio.wheel(step); break; case true: uiBio.wheel(step); if (vkBio.k('ctrl')) butBio.wheel(step); if (vkBio.k('shift')) {if (!pBio.text_trace) imgBio.wheel(step); if (butBio.btns["mt"] && butBio.btns["mt"].trace(pBio.m_x, pBio.m_y)) menBio.wheel(step, true);} break;}}
	this.on_notify_data = function(name, info) {let clone; if (uiBio.local) {clone = typeof info === 'string' ? String(info) : info; on_cui_notify(name, clone);} switch (name) {case "chkTrackRev_bio": if (!pBio.server && pBio.inclTrackRev) {clone = JSON.parse(JSON.stringify(info)); clone.inclTrackRev = true; window.NotifyOthers("isTrackRev_bio", clone);} break; case "isTrackRev_bio": if (pBio.server && info.inclTrackRev == true) {clone = JSON.parse(JSON.stringify(info)); servBio.get_track(clone);} break; case "img_chg_bio": imgBio.fresh(); menBio.fresh(); break; case "chk_arr_bio": clone = JSON.parse(JSON.stringify(info)); imgBio.chk_arr(clone); break; case "custom_style_bio": clone = String(info); pBio.on_notify(clone); break; case "force_update_bio": if (pBio.server) {clone = JSON.parse(JSON.stringify(info)); servBio.fetch(1, clone[0], clone[1]);} break; case "get_multi_bio": pBio.get_multi(); break; case "get_rev_img_bio": if (pBio.server) {clone = JSON.parse(JSON.stringify(info)); servBio.get_rev_img(clone[0], clone[1], clone[2], clone[3], false);} break; case "get_img_bio": imgBio.grab(info ? true : false); break; case "get_txt_bio": t.grab(); break; case "multi_tag_bio": if (pBio.server) {clone = JSON.parse(JSON.stringify(info)); servBio.fetch(false, clone[0], clone[1]);} break; case "not_server_bio": pBio.server = false; timerBio.clear(timerBio.img); timerBio.clear(timerBio.zSearch); break; case "blacklist_bio": imgBio.blkArtist = ""; imgBio.chkArtImg(); break; case "script_unload_bio": pBio.server = true; window.NotifyOthers("not_server_bio", 0); break; case "refresh_bio": window.Reload(); break; case "reload_bio": if (!pBio.art_ix && ppt.artistView || !pBio.alb_ix && !ppt.artistView) window.Reload(); else {t.artistFlush(); t.albumFlush(); t.grab(); if (ppt.text_only) t.paint();} break; case "status_bio": ppt.panelActive = info; window.Reload(); break;}}
	//this.on_paint = function(gr) {uiBio.draw(gr); if (!ppt.panelActive) {gr.GdiDrawText("Biography Inactive\r\n\r\nNo Internet Searches. No Text or Image Loading.\r\n\r\nACTIVATE: RIGHT CLICK\r\n\r\n(Toggle: Shift + Middle Click)", uiBio.font, uiBio.col.text, 0, 0, pBio.w, pBio.h, t.ccc); return;} img.draw(gr); t.draw(gr); t.messageDraw(gr); butBio.draw(gr); tb.drawEd(gr); uiBio.lines(gr);}
	this.on_playback_dynamic_info_track = function() {if (!ppt.panelActive) return; if (pBio.server) servBio.fetch_dynamic(); t.on_playback_new_track(); imgBio.on_playback_new_track();}
	this.on_playback_new_track = function() {if (!ppt.panelActive) return; if (pBio.server) servBio.fetch(false, {ix:0, focus:false, arr:[]}, {ix:0, focus:false, arr:[]}); if (ppt.focus) return; t.on_playback_new_track(); imgBio.on_playback_new_track();}
	this.on_playback_stop = function(reason) {if (!ppt.panelActive) return; if (reason == 2) return; on_item_focus_change();}
	this.on_playlist_items_added = function() {if (!ppt.panelActive) return; on_item_focus_change();}
	this.on_playlist_items_removed = function() {if (!ppt.panelActive) return; on_item_focus_change();}
	this.on_playlist_switch = function() {if (!ppt.panelActive) return; on_item_focus_change();}
	this.on_playlists_changed = function() {if (!ppt.panelActive) return; menBio.playlists_changed();}
	this.on_script_unload = function() {if (pBio.server) {window.NotifyOthers("script_unload_bio", 0); timerBio.clear(timerBio.img);} butBio.on_script_unload();}
	//this.on_size = function(w, h) {t.rp = false; pBio.w = w; pBio.h = h; if (!pBio.w || !pBio.h) return; uiBio.get_font(); if (!ppt.panelActive) return; pBio.calcText = true; t.on_size(); img.on_size(); t.rp = true; img.displayed_other_panel = null;}
	this.RGB = function(r, g, b) {return 0xff000000 | r << 16 | g << 8 | b;}
	this.RGBA = function(r, g, b, a) {return a << 24 | r << 16 | g << 8 | b;}
	this.StringFormat = function() {const a = arguments, flags = 0; let h_align = 0, v_align = 0, trimming = 0; switch (a.length) {case 3: trimming = a[2]; /*fall through*/ case 2: v_align = a[1]; /*fall through*/ case 1: h_align = a[0]; break; default: return 0;} return (h_align << 28 | v_align << 24 | trimming << 20 | flags);}
	this.mouse_in_this = function (x, y) { return (x >= uiBio.x && x < uiBio.x + uiBio.w && y >= uiBio.y && y < uiBio.y + uiBio.h);}
}


function BiographyPanel() {

	// Set Biography Window Size and Padding
	ppt.borT  = scaleForDisplay(30);
	ppt.borB  = scaleForDisplay(30);
	ppt.borL  = scaleForDisplay(40);
	ppt.borR  = scaleForDisplay(40);
	ppt.textT = scaleForDisplay(70);
	ppt.textL = scaleForDisplay(40);
	ppt.textR = scaleForDisplay(40);
	ppt.gap   = scaleForDisplay(11);

	this.on_paint = function (gr) {

		uiBio.draw(gr);
		if (!ppt.panelActive) {
			gr.GdiDrawText("Biography Inactive\r\n\r\nNo Internet Searches. No Text or Image Loading.\r\n\r\nACTIVATE: RIGHT CLICK\r\n\r\n(Toggle: Shift + Middle Click)", uiBio.font, uiBio.col.text, 0, 0, pBio.w, pBio.h, t.ccc);
			return;
		}
		imgBio.draw(gr);
		t.draw(gr);
		t.messageDraw(gr);
		butBio.draw(gr);
		tb.drawEd(gr);
		uiBio.lines(gr);
	}

	this.on_size = function (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		uiBio.x = x;
		uiBio.y = y;
		uiBio.w = width;
		uiBio.h = height;
		name.x = x;
		name.y = y;
		name.w = width;
		name.h = height;
		alb_scrollbar.x = x;
		alb_scrollbar.y = y;
		alb_scrollbar.w = width;
		alb_scrollbar.h	= height;
		art_scrollbar.x = x;
		art_scrollbar.y = y;
		art_scrollbar.w = width;
		art_scrollbar.h = height;
		butBio.x = x;
		butBio.y = y;
		butBio.w = width;
		butBio.h = height;
		menBio.button.x = x;
		menBio.button.y = y;
		t.x = x;
		t.y = y;
		t.w = width;
		t.h = height;
		tb.x = x;
		tb.y = y;
		tb.w = width;
		tb.h = height;
		imgBio.x = x;
		imgBio.y = y;
		imgBio.w = width;
		imgBio.h = height;

		t.rp = false;
		pBio.w = width;
		pBio.h = height;
		if (!pBio.w || !pBio.h) return;
		uiBio.get_font();
		if (!ppt.panelActive) return;
		pBio.calcText = true;
		t.on_size();
		imgBio.on_size();
		t.rp = true;
		imgBio.displayed_other_panel = null;
	}

	this.x;
	this.y;
	this.w;
	this.h;

}

var biographyPanel = new BiographyPanel();
var biography;
var biographyInitialized = false;

function initBiographyPanel() {
	if (!biographyInitialized) {
		uiBio = new UserInterfaceBio();
		vkBio = new VkeysBio();
		pBio = new PanelBio();
		name = new Names();
		alb_scrollbar = new ScrollbarBio();
		art_scrollbar = new ScrollbarBio();
		butBio = new ButtonsBio();
		menBio = new MenuItemsBio();
		t = new Text();
		tagBio = new TaggerBio();
		tb = new TextBoxBio();
		libBio = new LibraryBio();
		imgBio = new ImagesBio();
		timerBio = new TimersBio();
		servBio = new ServerBio();
		biographyPanel = new BiographyPanel();
		biography = new BiographyCallbacks();

		biographyInitialized = true;
	}
}

function freeBiographyPanel() {
	uiBio = null;
	vkBio = null;
	pBio = null;
	name = null;
	alb_scrollbar = null;
	art_scrollbar = null;
	butBio = null;
	menBio = null;
	t = null;
	tagBio = null;
	tb = null;
	libBio = null;
	imgBio = null;
	timerBio = null;
	servBio = null;
	biographyPanel = null;
	biographyInitialized = false;
}

uiBio.get_font();