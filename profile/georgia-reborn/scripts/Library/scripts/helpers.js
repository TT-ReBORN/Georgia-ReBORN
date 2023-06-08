'use strict';

const requiredVersionStrLib = '1.5.2';

function is_compatible(requiredVersionStrLib) {
	const requiredVersion = requiredVersionStrLib.split('.');
	const currentVersion = utils.Version.split('.');
	if (currentVersion.length > 3) currentVersion.length = 3;
	for (let i = 0; i < currentVersion.length; ++i) {
		if (currentVersion[i] != requiredVersion[i]) return currentVersion[i] > requiredVersion[i];
	}
	return true;
}
if (!is_compatible(requiredVersionStrLib)) fb.ShowPopupMessage(`Library Tree requires v${requiredVersionStrLib}. Current component version is v${utils.Version}.`);

// const doc = new ActiveXObject('htmlfile');
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
		let result; let tmpFileLoc = '';
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
		return num >= min ? num : min;
	}

	create(fo) {
		try {
			if (!this.folder(fo)) fsoLib.CreateFolder(fo);
		} catch (e) {}
	}

	debounce(e, r, i) { // eslint-disable-next-line
		var o,u,a,c,v,f,d=0,m=!1,j=!1,n=!0;if('function'!=typeof e)throw new TypeError('debounce: invalid function');function T(i){var n=o,t=u;return o=u=void 0,d=i,c=e.apply(t,n);}function b(i){var n=i-f;return void 0===f||r<=n||n<0||j&&a<=i-d;}function l(){var i,n,t=Date.now();if(b(t))return w(t);v=setTimeout(l,(n=r-((i=t)-f),j?Math.min(n,a-(i-d)):n));}function w(i){return v=void 0,n&&o?T(i):(o=u=void 0,c);}function t(){var i,n=Date.now(),t=b(n);if(o=arguments,u=this,f=n,t){if(void 0===v)return d=i=f,v=setTimeout(l,r),m?T(i):c;if(j)return v=setTimeout(l,r),T(f);}return void 0===v&&(v=setTimeout(l,r)),c;}return r=parseFloat(r)||0,this.isObject(i)&&(m=!!i.leading,a=((j='maxWait'in i))?Math.max(parseFloat(i.maxWait)||0,r):a,n='trailing'in i?!!i.trailing:n),t.cancel=function(){void 0!==v&&clearTimeout(v),o=f=u=v=void(d=0);},t.flush=function(){return void 0===v?c:w(Date.now());},t;
	}

	equal(arr1, arr2) {
		if (!this.isArray(arr1) || !this.isArray(arr2)) return false;
		let i = arr1.length;
		if (i != arr2.length) return false;
		while (i--) {
			if (arr1[i] !== arr2[i]) return false;
		}
		return true;
	}

	equalHandles(arr1, arr2) {
		if (!this.isArray(arr1) || !this.isArray(arr2)) return false;
		let i = arr1.length;
		if (i != arr2.length) return false;
		while (i--) {
			if (!arr1[i].Compare(arr2[i])) return false;
		}
		return true;
	}

	file(f) {
		return typeof f === 'string' && fsoLib.FileExists(f);
	}

	folder(fo) {
		return typeof fo === 'string' && fsoLib.FolderExists(fo);
	}

	getClipboardData() {
		try {
			return utils.GetClipboardText();
		} catch (e) {
			try {
				return doc.parentWindow.clipboardData.getData('Text');
			} catch (e) {
				return null;
			}
		}
	}

	getDpi() {
		let dpi = 120;
		try {
			dpi = WshShellLib.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
		} catch (e) {}
		return Math.max(dpi / 120, 1);
	}

	gr(w, h, im, func) {
		if (isNaN(w) || isNaN(h)) return;
		const i = gdi.CreateImage(Math.max(w, 2), Math.max(h, 2));
		let g = i.GetGraphics();
		func(g, i);
		i.ReleaseGraphics(g);
		g = null;
		return im ? i : null;
	}

	isArray(arr) {
		return Array.isArray(arr);
	}

	isObject(t) {
		const e = typeof t;
		return t != null && (e == 'object' || e == 'function');
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
		try { // handle locked files
			return this.file(f) ? utils.ReadTextFile(f) : '';
		} catch (e) {
			return '';
		}
	}

	padNumber(num, len, base) {
		if (!base) base = 10;
		return (`000000${num.toString(base)}`).substr(-len);
	}

	query(h, q) {
		try {
			return fb.GetQueryItems(h, q);
		} catch (e) {}
		return new FbMetadbHandleList();
	}

	range(start, stop, step) {
		step = step || 1;
		return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
	}

	regexEscape(n) {
		return n.replace(/[*+\-?^!:&"~${}()|[\]/\\]/g, '\\$&');
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
			utils.WriteTextFile(fn, text, bom);
		} catch (e) {
			this.trace(`error saving: ${fn}`);
		}
	}

	setClipboardData(n) {
		try {
			utils.SetClipboardText(n);
		} catch (e) {
			try {
				doc.parentWindow.clipboardData.setData('Text', n);
			} catch (e) {
				this.trace('unable to set clipboard text');
			}
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

	throttle(e, i, t) {
		let n = !0; let r = !0; if (typeof e != 'function') throw new TypeError('throttle: invalid function'); return this.isObject(t) && (n = 'leading' in t ? !!txt.leading : n, r = 'trailing' in t ? !!txt.trailing : r), this.debounce(e, i, { leading:n, maxWait:i, trailing:r });
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
		console.log(`Library Tree: ${message}`);
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

	wshPopup(prompt, caption) {
		try {
			const ns = WshShell.Popup(prompt, 0, caption, 1);
			if (ns == 1) return true;
			return false;
		} catch (e) {
			return true;
		}
	}
}

const $Lib = new HelpersLib();

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

/* eslint-disable */
function Bezier(){const i=4,c=.001,o=1e-7,v=10,l=11,s=1/(l-1),n=typeof Float32Array==='function';function e(r,n){return 1-3*n+3*r;}function u(r,n){return 3*n-6*r;}function a(r){return 3*r;}function w(r,n,t){return((e(n,t)*r+u(n,t))*r+a(n))*r;}function y(r,n,t){return 3*e(n,t)*r*r+2*u(n,t)*r+a(n);}function h(r,n,t,e,u){let a,f,i=0;do{f=n+(t-n)/2;a=w(f,e,u)-r;if(a>0){t=f;}else{n=f;}}while(Math.abs(a)>o&&++i<v);return f;}function A(r,n,t,e){for(let u=0;u<i;++u){const a=y(n,t,e);if(a===0){return n;}const f=w(n,t,e)-r;n-=f/a;}return n;}function f(r){return r;}function bezier(i,t,o,e){if(!(0<=i&&i<=1&&0<=o&&o<=1)){throw new Error('Bezier x values must be in [0, 1] range');}if(i===t&&o===e){return f;}const v=n?new Float32Array(l):new Array(l);for(let r=0;r<l;++r){v[r]=w(r*s,i,o);}function u(r){const e=l-1;let n=0,t=1;for(;t!==e&&v[t]<=r;++t){n+=s;}--t;const u=(r-v[t])/(v[t+1]-v[t]),a=n+u*s,f=y(a,i,o);if(f>=c){return A(r,a,i,o);}else if(f===0){return a;}else{return h(r,n,n+s,i,o);}}return function r(n){if(n===0){return 0;}if(n===1){return 1;}return w(u(n),t,e);};} this.scroll = bezier(0.25, 0.1, 0.25, 1); this.full = this.scroll; this.step = this.scroll; this.bar = bezier(0.165,0.84,0.44,1); this.barFast = bezier(0.19, 1, 0.22, 1); this.inertia = bezier(0.23, 1, 0.32, 1);}
const ease = new Bezier;

function MD5(){const b=function(l,n){let m=l[0],j=l[1],p=l[2],o=l[3];m+=(j&p|~j&o)+n[0]-680876936|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[1]-389564586|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[2]+606105819|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[3]-1044525330|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[4]-176418897|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[5]+1200080426|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[6]-1473231341|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[7]-45705983|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[8]+1770035416|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[9]-1958414417|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[10]-42063|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[11]-1990404162|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[12]+1804603682|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[13]-40341101|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[14]-1502002290|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[15]+1236535329|0;j=(j<<22|j>>>10)+p|0;m+=(j&o|p&~o)+n[1]-165796510|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[6]-1069501632|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[11]+643717713|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[0]-373897302|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[5]-701558691|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[10]+38016083|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[15]-660478335|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[4]-405537848|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[9]+568446438|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[14]-1019803690|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[3]-187363961|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[8]+1163531501|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[13]-1444681467|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[2]-51403784|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[7]+1735328473|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[12]-1926607734|0;j=(j<<20|j>>>12)+p|0;m+=(j^p^o)+n[5]-378558|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[8]-2022574463|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[11]+1839030562|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[14]-35309556|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[1]-1530992060|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[4]+1272893353|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[7]-155497632|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[10]-1094730640|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[13]+681279174|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[0]-358537222|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[3]-722521979|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[6]+76029189|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[9]-640364487|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[12]-421815835|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[15]+530742520|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[2]-995338651|0;j=(j<<23|j>>>9)+p|0;m+=(p^(j|~o))+n[0]-198630844|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[7]+1126891415|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[14]-1416354905|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[5]-57434055|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[12]+1700485571|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[3]-1894986606|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[10]-1051523|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[1]-2054922799|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[8]+1873313359|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[15]-30611744|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[6]-1560198380|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[13]+1309151649|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[4]-145523070|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[11]-1120210379|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[2]+718787259|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[9]-343485551|0;j=(j<<21|j>>>11)+p|0;l[0]=m+l[0]|0;l[1]=j+l[1]|0;l[2]=p+l[2]|0;l[3]=o+l[3]|0;};const e='0123456789abcdef';const d=[];const c=function(k){const q=e;const o=d;let r,p,l;for(let m=0;m<4;m++){p=m*8;r=k[m];for(l=0;l<8;l+=2){o[p+1+l]=q.charAt(r&15);r>>>=4;o[p+0+l]=q.charAt(r&15);r>>>=4;}}return o.join('');};const i=function(){this._dataLength=0;this._state=new Int32Array(4);this._buffer=new ArrayBuffer(68);this._bufferLength=0;this._buffer8=new Uint8Array(this._buffer,0,68);this._buffer32=new Uint32Array(this._buffer,0,17);this.start();};const a=new Int32Array([1732584193,-271733879,-1732584194,271733878]);const h=new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);i.prototype.appendStr=function(n){const k=this._buffer8;const j=this._buffer32;let o=this._bufferLength;for(let l=0;l<n.length;l++){let m=n.charCodeAt(l);if(m<128){k[o++]=m;}else{if(m<2048){k[o++]=(m>>>6)+192;k[o++]=m&63|128;}else{if(m<55296||m>56319){k[o++]=(m>>>12)+224;k[o++]=(m>>>6&63)|128;k[o++]=(m&63)|128;}else{m=((m-55296)*1024)+(n.charCodeAt(++l)-56320)+65536;if(m>1114111){throw'Unicode standard supports code points up to U+10FFFF';}k[o++]=(m>>>18)+240;k[o++]=(m>>>12&63)|128;k[o++]=(m>>>6&63)|128;k[o++]=(m&63)|128;}}}if(o>=64){this._dataLength+=64;b(this._state,j);o-=64;j[0]=j[16];}}this._bufferLength=o;return this;};i.prototype.appendAsciiStr=function(o){const l=this._buffer8;const k=this._buffer32;let p=this._bufferLength;let n=0,m=0;for(;;){n=Math.min(o.length-m,64-p);while(n--){l[p++]=o.charCodeAt(m++);}if(p<64){break;}this._dataLength+=64;b(this._state,k);p=0;}this._bufferLength=p;return this;};i.prototype.start=function(){this._dataLength=0;this._bufferLength=0;this._state.set(a);return this;};i.prototype.end=function(){const q=this._bufferLength;this._dataLength+=q;const r=this._buffer8;r[q]=128;r[q+1]=r[q+2]=r[q+3]=0;const k=this._buffer32;const m=(q>>2)+1;k.set(h.subarray(m),m);if(q>55){b(this._state,k);k.set(h);}const j=this._dataLength*8;if(j<=4294967295){k[14]=j;}else{const n=j.toString(16).match(/(.*?)(.{0,8})$/);const o=parseInt(n[2],16);const l=parseInt(n[1],16)||0;k[14]=o;k[15]=l;}b(this._state,k);return c(this._state);};const f=new i();i.hashStr=function(k){return f.start().appendStr(k).end();};return i;} // https://github.com/gorhill/yamd5.js
const md5 = new MD5;
