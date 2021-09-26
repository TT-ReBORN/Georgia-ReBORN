const requiredVersionStrLib = '1.5.0';

function is_compatible(requiredVersionStrLib) {
	const requiredVersion = requiredVersionStrLib.split('.');
	const currentVersion = utils.Version.split('.');
	if (currentVersion.length > 3) currentVersion.length = 3;
	for (let i = 0; i < currentVersion.length; ++i)
		if (currentVersion[i] != requiredVersion[i]) return currentVersion[i] > requiredVersion[i];
	return true;
}
if (!is_compatible(requiredVersionStrLib)) fb.ShowPopupMessage(`Library Tree requires v${requiredVersionStrLib}. Current component version is v${utils.Version}.`);

const fsoLib = new ActiveXObject('Scripting.FileSystemObject');
const tooltipLib = window.Tooltip;
const WshShellLib = new ActiveXObject('WScript.Shell');

class HelpersLib {
	constructor() {
		this.pl_active = plman.ActivePlaylist;
		this.scale = this.getDpi();
	}

	// Methods

	average(arr) {
		return arr.reduce((a, b) => a + b, 0) / arr.length;
	}

	browser(c) {
		if (!this.run(c)) fb.ShowPopupMessage('Unable to launch your default browser.', 'Library Tree');
	}

	buildPth(pth) {
		let result, tmpFileLoc = '';
		let UNC = pth.startsWith('\\\\');
		if (UNC) pth = pth.replace('\\\\', '');
		const pattern = /(.*?)\\/gm;
		while ((result = pattern.exec(pth))) {
			tmpFileLoc = tmpFileLoc.concat(result[0]);
			if (UNC) {
				tmpFileLoc = `\\\\${tmpFileLoc}`;
				UNC = false;
			}
			this.create(tmpFileLoc);
		}
	}

	clamp(num, min, max) {
		num = num <= max ? num : max;
		num = num >= min ? num : min;
		return num;
	}

	create(fo) {
		try {
			if (!this.folder(fo)) fsoLib.CreateFolder(fo);
		} catch (e) {}
	}

	debounce(e,r,i) {
		var o,u,a,c,v,f,d=0,m=!1,j=!1,n=!0;if('function'!=typeof e)throw new TypeError('debounce: invalid function');function T(i){var n=o,t=u;return o=u=void 0,d=i,c=e.apply(t,n)}function b(i){var n=i-f;return void 0===f||r<=n||n<0||j&&a<=i-d}function l(){var i,n,t=Date.now();if(b(t))return w(t);v=setTimeout(l,(n=r-((i=t)-f),j?Math.min(n,a-(i-d)):n))}function w(i){return v=void 0,n&&o?T(i):(o=u=void 0,c)}function t(){var i,n=Date.now(),t=b(n);if(o=arguments,u=this,f=n,t){if(void 0===v)return d=i=f,v=setTimeout(l,r),m?T(i):c;if(j)return v=setTimeout(l,r),T(f)}return void 0===v&&(v=setTimeout(l,r)),c}return r=parseFloat(r)||0,this.isObject(i)&&(m=!!i.leading,a=((j='maxWait'in i))?Math.max(parseFloat(i.maxWait)||0,r):a,n='trailing'in i?!!i.trailing:n),t.cancel=function(){void 0!==v&&clearTimeout(v),o=f=u=v=void(d=0)},t.flush=function(){return void 0===v?c:w(Date.now())},t;
	}

	folder(fo) {
		return fsoLib.FolderExists(fo);
	}

	equal(arr1, arr2) {
		let i = arr1.length;
		if (i != arr2.length) return false;
		while (i--)
			if (arr1[i] !== arr2[i]) return false;
		return true;
	}

	file(f) {
		return fsoLib.FileExists(f);
	}

	getDpi() {
		let dpi = 120;
		try {
			dpi = WshShellLib.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
		} catch (e) {}
		return Math.max(dpi / 120, 1);
	}

	gr(w, h, im, func) {
		let i = gdi.CreateImage(Math.max(w, 2), Math.max(h, 2));
		let g = i.GetGraphics();
		func(g, i);
		i.ReleaseGraphics(g);
		g = null;
		if (im) return i;
		else i = null;
	}

	isArray(arr) {
		return Array.isArray(arr);
	}

	isObject(t) {
		const e = typeof t;
		return null != t && ('object' == e || 'function' == e);
	}

	jsonParse(n, defaultVal, type) {
		switch (type) {
			case 'file':
				try {
					return JSON.parse(this.open(n));
				} catch (e) {
					return defaultVal;
				}
				default:
					try {
						return JSON.parse(n);
					} catch (e) {
						return defaultVal;
					}
		}
	}

	objHasOwnProperty(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}

	open(f) {
		return this.file(f) ? utils.ReadTextFile(f) : '';
	}

	padNumber(num, len, base) {
		if (!base) base = 10;
		return ('000000' + num.toString(base)).substr(-len);
	}

	query(h, q) {
		let l = new FbMetadbHandleList();
		try {
			l = fb.GetQueryItems(h, q);
		} catch (e) {}
		return l;
	}

	replaceAt(str, pos, chr) {
		return str.substring(0, pos) + chr + str.substring(pos + 1);
	}

	RGBAtoRGB(c, bg) {
		c = this.toRGBA(c);
		bg = this.toRGB(bg);
		const r = c[0] / 255;
		const g = c[1] / 255;
		const b = c[2] / 255;
		const a = c[3] / 255;
		const bgr = bg[0] / 255;
		const bgg = bg[1] / 255;
		const bgb = bg[2] / 255;
		let nR = ((1 - a) * bgr) + (a * r);
		let nG = ((1 - a) * bgg) + (a * g);
		let nB = ((1 - a) * bgb) + (a * b);
		nR = this.clamp(Math.round(nR * 255), 0, 255);
		nG = this.clamp(Math.round(nG * 255), 0, 255);
		nB = this.clamp(Math.round(nB * 255), 0, 255);
		return RGB(nR, nG, nB);
	}

	RGBtoRGBA(rgb, a) {
		return a << 24 | rgb & 0x00FFFFFF;
	}

	run(c) {
		try {
			WshShellLib.Run(c);
			return true;
		} catch (e) {
			return false;
		}
	}

	save(fn, text, bom) {
		try {
			utils.WriteTextFile(fn, text, bom)
		} catch (e) {
			this.trace('error saving: ' + fn);
		}
	}

	split(n, type) {
		switch (type) {
			case 0:
				return n.replace(/\s+|^,+|,+$/g, '').split(',');
			case 1:
				return n.replace(/^[,\s]+|[,\s]+$/g, '').split(/[,-]/);
		}
	}

	throttle(e,i,t) {
		var n=!0,r=!0;if('function'!=typeof e)throw new TypeError('throttle: invalid function');return this.isObject(t)&&(n='leading'in t?!!txt.leading:n,r='trailing'in t?!!txt.trailing:r),this.debounce(e,i,{leading:n,maxWait:i,trailing:r})
	}

	titlecase(n) {
		return n.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-/]*/g, match => {
			if (match.substr(1).search(/[A-Z]|\../) > -1) return match;
			return match.charAt(0).toUpperCase() + match.substr(1);
		});
	}

	toRGB(c) {
		return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff];
	}

	toRGBA(c) {
		return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];
	}

	trace(message) {
		console.log('Library Tree' + ': ' + message);
	}

	value(num, def, type) {
		num = parseFloat(num);
		if (isNaN(num)) return def;
		switch (type) {
			case 0:
				return num;
			case 1:
				if (num !== 1 && num !== 0) return def;
				break;
			case 2:
				if (num > 2 || num < 0) return def;
				break;
		}
		return num;
	}
}

const $Lib = new HelpersLib;

function RGB(r, g, b) {
	return 0xff000000 | r << 16 | g << 8 | b;
}

function RGBA(r, g, b, a) {
	return a << 24 | r << 16 | g << 8 | b;
}

function StringFormat() {
	const a = arguments;
	const flags = 0;
	let h_align = 0;
	let v_align = 0;
	let trimming = 0;
	switch (a.length) {
		case 3:
			trimming = a[2]; /*fall through*/
		case 2:
			v_align = a[1]; /*fall through*/
		case 1:
			h_align = a[0];
			break;
		default:
			return 0;
	}
	return (h_align << 28 | v_align << 24 | trimming << 20 | flags);
}

function Bezier(){const i=4,c=.001,o=1e-7,v=10,l=11,s=1/(l-1),n=typeof Float32Array==='function';function e(r,n){return 1-3*n+3*r}function u(r,n){return 3*n-6*r}function a(r){return 3*r}function w(r,n,t){return((e(n,t)*r+u(n,t))*r+a(n))*r}function y(r,n,t){return 3*e(n,t)*r*r+2*u(n,t)*r+a(n)}function h(r,n,t,e,u){let a,f,i=0;do{f=n+(t-n)/2;a=w(f,e,u)-r;if(a>0){t=f}else{n=f}}while(Math.abs(a)>o&&++i<v);return f}function A(r,n,t,e){for(let u=0;u<i;++u){const a=y(n,t,e);if(a===0){return n}const f=w(n,t,e)-r;n-=f/a}return n}function f(r){return r}function bezier(i,t,o,e){if(!(0<=i&&i<=1&&0<=o&&o<=1)){throw new Error('Bezier x values must be in [0, 1] range')}if(i===t&&o===e){return f}const v=n?new Float32Array(l):new Array(l);for(let r=0;r<l;++r){v[r]=w(r*s,i,o)}function u(r){const e=l-1;let n=0,t=1;for(;t!==e&&v[t]<=r;++t){n+=s}--t;const u=(r-v[t])/(v[t+1]-v[t]),a=n+u*s,f=y(a,i,o);if(f>=c){return A(r,a,i,o)}else if(f===0){return a}else{return h(r,n,n+s,i,o)}}return function r(n){if(n===0){return 0}if(n===1){return 1}return w(u(n),t,e)}} this.scroll = bezier(0.25, 0.1, 0.25, 1); this.full = this.scroll; this.step = this.scroll; this.bar = bezier(0.165,0.84,0.44,1); this.barFast = bezier(0.19, 1, 0.22, 1); this.inertia = bezier(0.23, 1, 0.32, 1);}
const ease = new Bezier;