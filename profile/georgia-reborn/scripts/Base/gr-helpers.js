/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Main Helpers                         * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-05-30                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////
// * COMPONENTS * //
////////////////////
const componentEnhancedPlaycount = utils.CheckComponent('foo_enhanced_playcount');
const componentESLyric = utils.CheckComponent('foo_uie_eslyric');
const componentUIHacks = utils.CheckComponent('foo_ui_hacks');
const componentVUMeter = utils.CheckComponent('foo_vis_vumeter');


/////////////////////////
// * ACTIVEX OBJECTS * //
/////////////////////////
/** @type {*} */
const app = new ActiveXObject('Shell.Application');
/** @type {*} */
const doc = new ActiveXObject('htmlfile');
/** @type {*} */
const fso = new ActiveXObject('Scripting.FileSystemObject');
/** @type {*} */
const UIHacks = !componentUIHacks || new ActiveXObject('UIHacks');
/** @type {*} */
const vb = new ActiveXObject('ScriptControl');
/** @type {*} */
const WshShell = new ActiveXObject('WScript.Shell');


///////////////
// * DEBUG * //
///////////////
/**
 * Use the debugLog function instead of console.log to easily hide messages that I don't want cluttering the console constantly
 * @type {function(...*):void} var_args
 */
function debugLog() {
	if (arguments.length && settings.showDebugLog) console.log(...arguments);
}


function printColorObj(obj) {
	console.log('\tname: \'\',\n\tcolors: {');
	for (const propName in obj) {
		const propValue = obj[propName];

		console.log(`\t\t${propName}: ${colToRgb(propValue, true)},\t\t// #${toPaddedHexString(0xffffff & propValue, 6)}`);
	}
	console.log(`\t},\n\thint: [${colToRgb(obj.primary, true)}]`);
}


/////////////
// * WEB * //
/////////////
function makeHttpRequest(type, url, successCB) {
	/** @type {*} */
	const xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	xmlhttp.open(type, url, true);
	xmlhttp.setRequestHeader('User-Agent', 'foo_spider_monkey_georgia');
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4) {
			successCB(xmlhttp.responseText);
		}
	};
	xmlhttp.send();
}


/** Release must be in form of 2.0.0-beta1, or 2.0.1 - from: https://github.com/substack/semver-compare/issues/1#issuecomment-594765531 */
function isNewerVersion (oldVer, newVer) {
	const a = newVer.split('-');
	const b = oldVer.split('-');
	const pa = a[0].split('.');
	const pb = b[0].split('.');

	for (let i = 0; i < 3; i++) {
		const na = Number(pa[i]);
		const nb = Number(pb[i]);
		if (na > nb) return true;
		if (nb > na) return false;
		if (!isNaN(na) && isNaN(nb)) return true;
		if (isNaN(na) && !isNaN(nb)) return false;
	}

	if (a[1] && b[1]) {
		return a[1] > b[1];
	}

	return !!(!a[1] && b[1]);
}


///////////////////////
// * COMPATIBILITY * //
///////////////////////
/**
 * @returns {boolean} Detects if user has Internet Explorer installed, needed to render HTML popups
 */
 const DetectIE = () => {
	const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
	const paths = ['Program Files\\Internet Explorer\\ieinstal.exe', 'Program Files (x86)\\Internet Explorer\\ieinstal.exe'];
	return diskLetters.some((d) => {
		try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
			return IsFolder(d) ? paths.some((p) => IsFile(d + p)) : false;
		} catch (e) { return false; }
	});
}


/**
 * @returns {boolean} Detects if user's Windows OS is x64 architecture, actually used only for x86 detection.
 */
const DetectWin64 = () => {
	const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
	const paths = ['Program Files (x86)'];
	return diskLetters.some((d) => {
		try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
			return IsFolder(d) ? paths.some((p) => IsFolder(d + p)) : false;
		} catch (e) { return false }
	});
}


/**
 * @returns {boolean} Detects if user is running Wine on Linux or MacOs, default Wine mount point is Z:\
 */
const DetectWine = () => {
	const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
	const paths = ['bin\\bash', 'bin\\ls', 'bin\\sh', 'etc\\fstab'];
	return diskLetters.some((d) => {
		try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
			return IsFolder(d) ? paths.some((p) => IsFile(d + p)) : false;
		} catch (e) { return false; }
	});
}


/////////////////////////
// * FILE MANAGEMENT * //
/////////////////////////
const CreateFolder = (folder, is_recursive) => {
	if (utils.IsDirectory(folder)) {
		return;
	}

	if (is_recursive) {
		const parentPath = fso.GetParentFolderName(folder);
		if (!utils.IsDirectory(parentPath)) {
			CreateFolder(parentPath, true);
		}
	}

	try {
		return fso.CreateFolder(folder);
	} catch (e) {
		return false;
	}
};


/** Creates complete dir tree if needed up to the final folder */
function _createFolder(folder) {
	if (!folder.length) { return false; }
	if (!IsFolder(folder)) {
		if (folder.startsWith('.\\')) { folder = fb.FoobarPath + folder.replace('.\\', ''); }
		const subFolders = folder.split('\\').map((_, i, arr) => i ? arr.slice(0, i).reduce((path, name) => `${path}\\${name}`) : _);
		subFolders.forEach((path) => {
			try {
				fso.CreateFolder(path);
			} catch (e) {
				return false;
			}
		});
		return IsFolder(folder);
	}
	return false;
}


function _save(file, value, bBOM = false) {
	if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
	const filePath = utils.SplitFilePath(file)[0];
	if (!IsFolder(filePath)) { _createFolder(filePath); }
	if (IsFolder(filePath) && utils.WriteTextFile(file, value, bBOM)) {
		return true;
	}
	console.log(`Error saving to ${file}`);
	return false;
}


function _saveFSO(file, value, bUTF16) {
	if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
	const filePath = utils.SplitFilePath(file)[0];
	if (!IsFolder(filePath)) { _createFolder(filePath); }
	if (IsFolder(filePath)) {
		try {
			const fileObj = fso.CreateTextFile(file, true, bUTF16);
			fileObj.Write(value);
			fileObj.Close();
			return true;
		} catch (e) {}
	}
	console.log(`Error saving to ${file}`);
	return false;
}


const DeleteFile = (file) => {
	if (utils.IsFile(file)) {
		try {
			return fso.DeleteFile(file);
		} catch (e) {
			return false;
		}
	}
};


function _deleteFile(file, force = true) {
	if (IsFile(file)) {
		if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
		try {
			fso.DeleteFile(file, force);
		} catch (e) {
			return false;
		}
		return !(IsFile(file));
	}
	return false;
}


function _deleteFolder(folder, force = true) {
	if (IsFolder(folder)) {
		if (folder.startsWith('.\\')) { folder = fb.FoobarPath + folder.replace('.\\', ''); }
		if (folder.endsWith('\\')) { folder = folder.slice(0, -1); }
		try {
			fso.DeleteFolder(folder, force);
		} catch (e) {
			return false;
		}
		return !(IsFolder(folder));
	}
	return false;
}


const IsFile = (filename) => {
	try {
		return utils.IsFile(filename);
	} catch (e) {
		return false;
	}
};


const IsFolder = (folder) => {
	try {
		return utils.IsDirectory(folder);
	} catch (e) {
		return false;
	}
};


function _open(file, codePage = 0) {
	if (IsFile(file)) {
		if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
		return tryMethod('ReadTextFile', utils)(file, codePage) || '';  // Bypasses crash on locked files by another process
	} else {
		return '';
	}
}


const OpenExplorer = (c) => {
	const run = (c, w) => {
		try {
			if (w === undefined) WshShell.Run(c);
			else WshShell.Run(c, w);
			return true;
		} catch (e) {
			return false;
		}
	};
	if (!run(c)) fb.ShowPopupMessage('Unable to open your file explorer');
};


/** Sanitize illegal chars but skip drive */
function sanitizePath(value) {
	if (!value || !value.length) { return ''; }
	const disk = (value.match(/^\w:\\/g) || [''])[0];
	return disk + (disk && disk.length ? value.replace(disk, '') : value).replace(/[/]/g, '\\').replace(/[|\u2013]/g, '-').replace(/\*/g, 'x').replace(/"/g, '\'\'').replace(/[<>]/g, '_').replace(/[?:]/g, '').replace(/(?! )\s/g, '');
}


//////////////////
// * COMMANDS * //
//////////////////
/**
 *
 * @param {string} command The command for the OS to execute. Typically a webpage, or a path to an executable.
 * @param {boolean=} wait waits?
 * @param {boolean=} show probably whether to show the command?
 * @returns {boolean} Returns true if the command was successfully executed
 */
const runCmd = (command, wait, show) => {
	try {
		WshShell.Run(command, show ? 1 : 0, wait || false);
		return true;
	} catch (e) {
		console.log(`runCmd(): failed to run command ${command}(${e})`);
		return false;
	}
};


/** Repeats a function x times */
const repeatFunc = (func, times) => {
	func();
	if (times && --times) repeatFunc(func, times);
};


const tryMethod = (fn, parent) => (...args) => {
	try {
		return parent[fn](...args);
	} catch (e) {}
};


/////////////////
// * PARSING * //
/////////////////
function parseJson(json, label, log) {
	let parsed = [];
	try {
		if (log) {
			console.log(label + json);
		}
		parsed = JSON.parse(json);
	}
	catch (e) {
		console.log('<<< ERROR IN parseJson >>>');
		console.log(json);
	}
	return parsed;
}


function _jsonParse(value) {
	try {
		return JSON.parse(value);
	} catch (e) {
		return null;
	}
}


function _jsonParseFile(file, codePage = 0) {
	return _jsonParse(_open(file, codePage));
}


//////////////////////
// * OBJECT STUFF * //
//////////////////////
function toType(a) {
	// Get fine type (object, array, function, null, error, date ...)
	return ({}).toString.call(a).match(/([a-z]+)(:?\])/i)[1];
}


function isDeepObject(obj) {
	return toType(obj) === 'Object';
}


function deepAssign(options = { nonEnum: false, symbols: false, descriptors: false, proto: false }) {
	return function deepAssignWithOptions (target, ...sources) {
		sources.forEach((source) => {
			if (!isDeepObject(source) || !isDeepObject(target)) { return; }
			// Copy source's own properties into target's own properties
			const copyProperty = (property) => {
				const descriptor = Object.getOwnPropertyDescriptor(source, property);
				// default: omit non-enumerable properties
				if (descriptor.enumerable || options.nonEnum) {
					// Copy in-depth first
					if (isDeepObject(source[property]) && isDeepObject(target[property])) {
						descriptor.value = deepAssign(options)(target[property], source[property]);
					}
					// default: omit descriptors
					if (options.descriptors) {
						Object.defineProperty(target, property, descriptor); // Shallow copy descriptor
					} else {
						target[property] = descriptor.value; // Shallow copy value only
					}
				}
			};
			// Copy string-keyed properties
			Object.getOwnPropertyNames(source).forEach(copyProperty);
			// default: omit symbol-keyed properties
			if (options.symbols) {
				Object.getOwnPropertySymbols(source).forEach(copyProperty);
			}
			// default: omit prototype's own properties
			if (options.proto) {
				// Copy source prototype's own properties into target prototype's own properties
				deepAssign(Object.assign({}, options, { proto:false }))( // Prevent deeper copy of the prototype chain
					Object.getPrototypeOf(target),
					Object.getPrototypeOf(source)
				);
			}
		});
		return target;
	}
}


////////////////
// * COLORS * //
////////////////
function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}


function RGBA(r, g, b, a) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
}


function RGBtoRGBA(rgb, a) {
	return a << 24 | (rgb & 0x00FFFFFF);
}


function RGBAtoRGB(rgb, a) {
	return (rgb & 0x00FFFFFF) | (a << 24);
}


function RGBtoHEX(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	return (r.length === 1 ? `0${r}` : r) + (g.length === 1 ? `0${g}` : g) + (b.length === 1 ? `0${b}` : b);
}


function RGBFtoHEX(rgb) {
	let r = rgb >> 16 & 0xff;
	let g = rgb >> 8 & 0xff;
	let b = rgb & 0xff;
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	return (r.length === 1 ? `0${r}` : r) + (g.length === 1 ? `0${g}` : g) + (b.length === 1 ? `0${b}` : b);
}


function RGBAtoHEX(r, g, b, a) {
	a = a.toString(16);
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	return (a.length === 1 ? `0${a}` : a) + (r.length === 1 ? `0${r}` : r) + (g.length === 1 ? `0${g}` : g) + (b.length === 1 ? `0${b}` : b);
}


function HEX(hex) {
	return parseInt(hex, 16);
}


function HEXtoRGB(hex) {
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return RGB(r, g, b);
}


function HEXtoRGBA(hex, a) {
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return RGBA(r, g, b, a);
}


function isHEX(hex) {
	return typeof hex === 'string' && hex.length === 6 && !isNaN(Number(`0x${hex}`))
}


function getAlpha(color) {
	return ((color >> 24) & 0xff);
}


function getRed(color) {
	return ((color >> 16) & 0xff);
}


function getGreen(color) {
	return ((color >> 8) & 0xff);
}


function getBlue(color) {
	return (color & 0xff);
}


function toRGB(c) {
	return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff];
}


function toRGBA(c) {
	return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];
}


function calcBrightness(c) {
	const r = getRed(c);
	const g = getGreen(c);
	const b = getBlue(c);
	return Math.round(Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b));
}


function calcImgBrightness(image) {
	try {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15));
		let rTot = 0;
		let gTot = 0;
		let bTot = 0;
		let freqTot = 0;

		colorSchemeArray.forEach(v => {
			const col = toRGB(v.col);
			rTot += col[0] ** 2 * v.freq;
			gTot += col[1] ** 2 * v.freq;
			bTot += col[2] ** 2 * v.freq;
			freqTot += v.freq;
		});

		const avgCol =
			Math.round([
			clamp(Math.round(Math.sqrt(rTot / freqTot)), 0, 255) +
			clamp(Math.round(Math.sqrt(gTot / freqTot)), 0, 255) +
			clamp(Math.round(Math.sqrt(bTot / freqTot)), 0, 255)
			] / 3);

		if (settings.showThemeLog) console.log('Image brightness:', avgCol);
		return avgCol;
	}
	catch (e) {
		console.log('<Error: calcImgBrightness() failed.>');
	}
}


/**
 * Calculates the color "distance" between two colors. Currently uses the redmean
 * calculation from https://en.wikipedia.org/wiki/Color_difference.
 * The purpose of this method is mostly to determine whether a color drawn next to another color will
 * provide enough visual separation. As such, adding some additional weighting based on individual colors differences.
 * @param {number} a The first color in numeric form (i.e. RGB(150,250,255))
 * @param {number} b The second color in numeric form (i.e. RGB(150,250,255))
 * @param {boolean=} log Whether to print the distance in the console. Also requires that settings.showThemeLog is true
 */
function colorDistance(a, b, log) {
	const aCol = new Color(a);
	const bCol = new Color(b);

	const rho = (aCol.r + bCol.r) / 2;
	const rDiff = aCol.r - bCol.r;
	const gDiff = aCol.g - bCol.g;
	const bDiff = aCol.b - bCol.b;
	const deltaR = rDiff ** 2;
	const deltaG = gDiff ** 2;
	const deltaB = bDiff ** 2;

	// const distance = Math.sqrt(2 * deltaR + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256); // Old version
	let distance = Math.sqrt((2 + rho / 256) * deltaR + 4 * deltaG + (2 + (255 - rho) / 256) * deltaB); // Redmean calculation
	if (rDiff >= 50 || gDiff >= 50 || bDiff >= 50) {
		// Because the colors we are diffing against are usually shades of grey, if one of the colors has a diff of 50 or more,
		// then it's very likely there will be enough visual separation between the two, so bump up the diff percentage.
		distance *= 1.1;
	}
	if (log && settings.showThemeLog) {
		console.log('Distance from:', aCol.getRGB(), 'to:', bCol.getRGB(), '=', distance);
	}
	return distance;
}


function colToRgb(c, showPrefix) {
	if (typeof showPrefix === 'undefined') showPrefix = true;
	const alpha = getAlpha(c);
	let prefix = '';
	if (alpha < 255) {
		if (showPrefix) prefix = 'rgba';
		return `${prefix}(${getRed(c)}, ${getGreen(c)}, ${getBlue(c)}, ${alpha})`;
	} else {
		if (showPrefix) prefix = 'rgb';
		return `${prefix}(${getRed(c)}, ${getGreen(c)}, ${getBlue(c)})`;
	}
}


function combineColors(c1, c2, f) {
	// When fraction is 0, result is 100% color1, when f is 1, result is 100% color2.
	c1 = toRGB(c1);
	c2 = toRGB(c2);

	const r = Math.round(c1[0] + f * (c2[0] - c1[0]));
	const g = Math.round(c1[1] + f * (c2[1] - c1[1]));
	const b = Math.round(c1[2] + f * (c2[2] - c1[2]));

	return (0xff000000 | (r << 16) | (g << 8) | (b));
}


function darkenColorVal(color, percent) {
	const shift = Math.max(color * percent / 100, percent / 2);
	const val = Math.round(color - shift);
	return Math.max(val, 0);
}


function lightenColorVal(color, percent) {
	const val = Math.round(color + ((255 - color) * (percent / 100)));
	return Math.min(val, 255);
}


function shadeColor(color, percent) {
	const red = getRed(color);
	const green = getGreen(color);
	const blue = getBlue(color);

	return RGBA(darkenColorVal(red, percent), darkenColorVal(green, percent), darkenColorVal(blue, percent), getAlpha(color));
}


function tintColor(color, percent) {
	const red = getRed(color);
	const green = getGreen(color);
	const blue = getBlue(color);

	return RGBA(lightenColorVal(red, percent), lightenColorVal(green, percent), lightenColorVal(blue, percent), getAlpha(color));
}


//////////////////
// * GRAPHICS * //
//////////////////
class ImageSize {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}


/** Custom fill gradient ellipse function, not implemented in SMP */
function FillGradEllipse(gr, x, y, w, h, angle, color1, color2, focus) {
	const lw = scaleForDisplay(2);
	// * Mask
	const maskImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillEllipse(Math.floor(lw / 2), Math.floor(lw / 2), w - lw - scaleForDisplay(1), h - lw - scaleForDisplay(1), 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Gradient ellipse
	const gradEllipseImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	g = gradEllipseImg.GetGraphics();
	g.FillGradRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw - scaleForDisplay(1), h - lw - scaleForDisplay(1), angle, color1, color2, focus);
	gradEllipseImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + scaleForDisplay(1), h + scaleForDisplay(1));
	gradEllipseImg.ApplyMask(mask);

	gr.DrawImage(gradEllipseImg, x, y, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, 0, w, h, 0, 255);
}


/** Custom fill gradient round rectangle function, not implemented in SMP */
function FillGradRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, color1, color2, focus) {
	// * Mask
	const maskImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillRoundRect(0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Gradient rect
	const gradRectImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	g = gradRectImg.GetGraphics();
	g.FillGradRect(0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), angle, color1, color2, focus);
	gradRectImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + scaleForDisplay(1), h + scaleForDisplay(1));
	gradRectImg.ApplyMask(mask);

	gr.DrawImage(gradRectImg, x, y, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, 0, w, h, 0, 255);
}


/** Custom fill blended round rectangle function, not implemented in SMP */
function FillBlendedRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, focus) {
	// * Mask
	const maskImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillRoundRect(0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Blended rect
	const gradRectImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	g = gradRectImg.GetGraphics();
	g.DrawImage(blendedImg, 0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, h, blendedImg.Width, blendedImg.Height);
	gradRectImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + scaleForDisplay(1), h + scaleForDisplay(1));
	gradRectImg.ApplyMask(mask);

	gr.DrawImage(gradRectImg, x, y, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, 0, w, h, 0, 255);
}


function MaskAlbumArtDiscArea(gr, x, y, w, h, srcX, srcY, srcW, srcH, angle, alpha) {
	// * First draw album art in the background
	gr.DrawImage(albumArtScaled, x, y, w, h, 0, 0, w, h, 0, alpha);

	// * Mask
	const maskImg = gdi.CreateImage(w, h);
	let g = maskImg.GetGraphics();
	g.FillEllipse(discArtSize.x - albumArtSize.x + geo.discArtShadow - scaleForDisplay(4), discArtSize.y - albumArtSize.y + scaleForDisplay(2),
				  discArtSize.w - geo.discArtShadow + scaleForDisplay(4), discArtSize.h - geo.discArtShadow + scaleForDisplay(2), 0xffffffff);
	maskImg.ReleaseGraphics(g);

	// * Album art
	const albumArtImg = gdi.CreateImage(w, h);
	g = albumArtImg.GetGraphics();
	g.DrawImage(albumArtScaled, 0, 0, w, h, 0, 0, albumArtScaled.Width, albumArtScaled.Height);
	albumArtImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w, h);
	albumArtImg.ApplyMask(mask);

	gr.DrawImage(albumArtImg, x, y, w, h, 0, 0, w, h, 0, 255);
}


////////////////////
// * FORMATTING * //
////////////////////
/**
 *
 * @param {string} titleFormatString Title format string to evaluate
 * @param {FbMetadbHandle=} metadb Handle to evaluate string with
 * @param {boolean=} force Force evaluate. Optional.
 */
function $(titleFormatString, metadb = undefined, force = false) {
	try {
		return metadb ? fb.TitleFormat(titleFormatString).EvalWithMetadb(metadb) : fb.TitleFormat(titleFormatString).Eval(force);
	} catch (e) {
		return `${e} (Invalid metadb!)`;
	}
}


/**
 * Accepts 1-4 parameters, corresponding to h_align, v_align, trimming, flags
 * @param {number} [h_align] - 0: Near, 1: Center, 2: Far
 * @param {number} [v_align] - 0: Near, 1: Center, 2: Far
 * @param {number} [trimming] - 0: None, 1: Char, 2: Word, 3: Ellipses char, 4: Ellipses word, 5: Ellipses path
 * @param {number} [flags] - `|`'d together flags. See g_string_format in Common.js
 */
function StringFormat(h_align, v_align, trimming, flags) {
	if (!h_align) h_align = 0;
	if (!v_align) v_align = 0;
	if (!trimming) trimming = 0;
	if (!flags) flags = 0;

	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}


/**
 * Given a metadata field of name, returns an array of all corresponding metadata values.
 * Will strip leading and trailing %'s from name.
 * @param {string} name
 * @param {FbMetadbHandle=} metadb
 * @returns {Array<string>}
 */
function getMetaValues(name, metadb = undefined) {
	let vals = [];
	const searchName = name.replace(/%/g, '');
	for (let i = 0; i < parseInt($(`$meta_num(${searchName})`, metadb)); i++) {
		vals.push($(`$meta(${searchName},${i})`, metadb));
	}
	if (!vals.length) {
		// This is a fallback in case the `name` property is a complex tf field and meta_num evaluates to 0.
		// In that case we want to evaluate the entire field, after wrapping in brackets and split on commas.
		const unsplit = $(`[${name}]`, metadb);
		if (unsplit.length) {
			vals = unsplit.split(', ');
		}
	}

	return vals;
}


const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

const longestString = arr => arr.reduce((a, b) => a.length > b.length ? a : b);


/**
 * Strips out unicode characters such as apostrophes and multi-timestamps which will print as crap in the lyrics.
 * May not be needed when using UTF-8 code page
 * @param {*} rawString
 */
function replaceChars(rawString) {
	return rawString.trim()
	.replace(/&amp(;|)/g, '&')
	.replace(/&gt(;|)/g, '>')
	.replace(/&lt(;|)/g, '<')
	.replace(/&nbsp(;|)/g, '')
	.replace(/&quot(;|)/g, '"')
	.replace(/<br>/gi, '')
	.replace(/\uFF1A/g, ':')
	.replace(/\uFF08/g, '(')
	.replace(/\uFF09/g, ')')
	.replace(/\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(;|)|â€˜(;|)|&#39(;|)|&apos(;|)/g, "'") // Apostroph variants
	.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g, ' ') // Whitespace variants
	.replace(/(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g, '$1$4'); // Fix enhanced LRC format
}


/** Replace special chars in filenames */
function replaceFileChars(s) {
	return s.replace(/:/g, '_')
			.replace(/\\/g, '-')
			.replace(/\//g, '-')
			.replace(/\?/g, '')
			.replace(/</g, '')
			.replace(/>/g, '')
			.replace(/\*/g, '')
			.replace(/"/g, '\'')
			.replace(/\|/g, '-');
}


function padNumber(num, len, base) {
	if (!base) {
		base = 10;
	}
	return (`000000${num.toString(base)}`).substr(-len);
}


function leftPad(val, size, ch) {
	let result = String(val);
	if (!ch) {
		ch = ' ';
	}
	while (result.length < size) {
		result = ch + result;
	}
	return result;
}


function colorToHSLString(col) {
	return `${leftPad(col.hue, 3)} ${leftPad(col.saturation, 3)} ${leftPad(col.lightness, 3)}`;
}


function toPaddedHexString(num, len) {
	return padNumber(num, len, 16);
}


function toFixed(number, precision) {
	const factor = 10 ** precision;
	return Math.round(number * factor) / factor;
}


function round(floatnum, decimals, eps = 10 ** -14) {
	let result;
	if (decimals > 0) {
		result = decimals === 15 ? floatnum : Math.round(floatnum * 10 ** decimals + eps) / 10 ** decimals;
	} else {
		result = Math.round(floatnum);
	}
	return result;
}


///////////////
// * FONTS * //
///////////////
function font(name, size, style) {
	let font;
	try {
		font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
	} catch (e) {
		console.log('\nFailed to load font >>>', name, size, style);
	}
	return font;
}


function testFont(fontName) {
	if (!utils.CheckFont(fontName)) {
		console.log(`\nError: Font "${fontName}" was not found.\nPlease install it from the fonts folder or if you use custom theme fonts, use the correct font name / font family name.`);
		return false;
	}
	return true;
}


function measureString(text, font, x, y, width, height) {
	const img = gdi.CreateImage(1, 1);
	const g = img.GetGraphics();
	const size = g.MeasureString(text, font, x, y, width, height);
	img.ReleaseGraphics(g);
	return size;
}


function calculateGridMaxTextWidth(gr, gridArray, font) {
	let maxWidth = 0;
	gridArray && gridArray.forEach((el) => {
		const width = Math.ceil(gr.MeasureString(el.label, font, 0, 0, ww, wh).Width) + 1;
		if (width > maxWidth) {
			maxWidth = width;
		}
	});
	return maxWidth;
}


/**
 * Given an array of fonts, returns a single font which the given text will fully fit the
 * availableSpace, or the last font in the list (should be the smallest and text will be truncated)
 */
function chooseFontForWidth(gr, availableWidth, text, fontList, maxLines) {
	maxLines = (typeof maxLines !== 'undefined') ? maxLines : 1;
	let fontIndex;
	for (let i = 0; i < fontList.length; i++) {
		fontIndex = i;
		const measurements = gr.MeasureString(text, fontList[fontIndex], 0, 0, availableWidth, 0);
		if (measurements.Lines <= maxLines) {
			break;
		}
	}
	return fontIndex !== undefined ? fontList[fontIndex] : null;
}


/** Given two different texts, and two different font arrays, draws both lines of text
 *  in the maximum number of lines available, using the largest font where all of the text
 *  will fit. Where text1 ends and text2 begins will be on the same line if possible, switching
 *  fonts in between.
 * @param {GdiGraphics} gr
 * @param {number} availableWidth The maximum width a line of text can occupy.
 * @param {number} left X-coordinate to draw text at
 * @param {number} top Y-coordinate to draw text at
 * @param {number} color Color of the text to be drawn
 * @param {string} text1 First text snippet to draw
 * @param {GdiFont[]} fontList1 Array of fonts to try to fit text1 within availableWidth and maxLines
 * @param {string=} text2 Second text snippet to draw if supplied
 * @param {GdiFont[]=} fontList2 Array of fonts to try to fit text2 within availableWidth and maxLines after drawing text1
 * @param {number} [maxLines=2] Max number of lines to attempt to draw text1 & text2 in. If text doesn't fit ellipses will be added
 * @returns {number} The height of the drawn text
 */
function drawMultipleLines(gr, availableWidth, left, top, color, text1, fontList1, text2, fontList2, maxLines) {
	maxLines = (typeof maxLines !== 'undefined') ? maxLines : 2;
	let textArray;
	let lineHeight;
	let continuation;
	for (let fontIndex = 0; fontIndex < fontList1.length && (!text2 || fontIndex < fontList2.length); fontIndex++) {
		textArray = [];
		lineHeight = Math.max(gr.CalcTextHeight(text1, fontList1[fontIndex]),
							(text2 ? gr.CalcTextHeight(text2, fontList2[fontIndex]) : 0));
		continuation = false;	// Does font change on same line
		/** @type {any[]} */
		const lineText = gr.EstimateLineWrap(text1, fontList1[fontIndex], availableWidth);
		for (let i = 0; i < lineText.length; i += 2) {
			textArray.push({ text: lineText[i].trim(), x_offset: 0, font: fontList1[fontIndex] });
		}
		if (textArray.length <= maxLines && text2) {
			const lastLineWidth = lineText[lineText.length - 1];
			/** @type {any[]} */
			let secondaryText = gr.EstimateLineWrap(text2, fontList2[fontIndex], availableWidth - lastLineWidth - 5);
			const firstSecondaryLine = secondaryText[0];	// Need to subtract the contination of the previous line from text2
			const textRemainder = text2.substr(firstSecondaryLine.length).trim();
			if (firstSecondaryLine.trim().length) {
				textArray.push({ text: firstSecondaryLine, x_offset: lastLineWidth + 5, font: fontList2[fontIndex] });
				continuation = true;	// Font changes on same line
			}
			secondaryText = gr.EstimateLineWrap(textRemainder, fontList2[fontIndex], availableWidth);
			for (let i = 0; i < secondaryText.length; i += 2) {
				textArray.push({ text: secondaryText[i], x_offset: 0, font: fontList2[fontIndex] });
			}
		}
		if (textArray.length - (continuation ? 1 : 0) <= maxLines) break;
	}
	let yOffset = 0;
	let linesDrawn = 0;
	const cutoff = textArray.length > maxLines + (continuation ? 1 : 0);
	textArray.splice(maxLines + (continuation ? 1 : 0));
	for (let i = 0; i < textArray.length; i++) {
		const line = textArray[i];
		if (line.x_offset) {
			// Continuation line, so move back up for drawing
			yOffset -= lineHeight;
		} else if (line.text.length) {
			linesDrawn++;
		}
		if (i === textArray.length - 1 && cutoff) {
			line.text += ' ABCDEFGHIJKMLNOPQRSTUVWXYZABCDEFGHIJKMLNOPQRSTUVWXYZ';	// Trigger elipses
		}
		gr.DrawString(line.text, line.font, color, left + line.x_offset, top + yOffset,
			availableWidth - line.x_offset, lineHeight, g_string_format.trim_ellipsis_word);
		yOffset += lineHeight;
	}
	return linesDrawn * lineHeight;
}


/////////////////////
// * DATE & TIME * //
/////////////////////
/**
 * Returns the diff between a start and end date in the form of "2y 3m 24d". Order of the two dates does not matter.
 * @param {string} startingDate
 * @param {string=} endingDate If no endingDate is supplied, use current time
 * @returns {string}
 */
function dateDiff(startingDate, endingDate) {
	if (!startingDate) return '';
	const hasStartDay = (startingDate.length > 7);
	if (!hasStartDay) {
		startingDate += '-02';    // Avoid timezone issues
	}
	let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
	if (!endingDate) {
		const now = new Date().getTime() - timezoneOffset;	// Subtract timezone offset because we're stripping timzone from ISOString
		endingDate = new Date(now).toISOString().substr(0, 10);    // Need date in YYYY-MM-DD format
	}
	let endDate = new Date(endingDate);
	if (startDate > endDate) {
		const swap = startDate;
		startDate = endDate;
		endDate = swap;
	}
	const startYear = startDate.getFullYear();
	const februaryDays = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
	const daysInMonth = [31, februaryDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	let yearDiff = endDate.getFullYear() - startYear;
	let monthDiff = endDate.getMonth() - startDate.getMonth();
	let dayDiff = 0;
	if (monthDiff < 0) {
		yearDiff--;
		monthDiff += 12;
	}
	if (hasStartDay) {
		dayDiff = endDate.getDate() - startDate.getDate();
		if (dayDiff < 0) {
			if (monthDiff > 0) {
				monthDiff--;
			} else {
				yearDiff--;
				monthDiff = 11;
			}
			dayDiff += daysInMonth[startDate.getMonth()];
		}
	}

	return (yearDiff ? `${yearDiff}y ` : '') + (monthDiff > 0 ? `${monthDiff}m ` : '') + (dayDiff ? `${dayDiff}d` : '');
}


function calcAgeDateString(date) {
	let str = '';
	if (date.length) {
		try {
			str = dateDiff($date(date));
		} catch (e) {
			console.log('date has invalid value', date, 'in calcAgeDateString()');
			// Throw new ArgumentError('date', date, 'in calcAgeDateString()');
		}
	}

	return str.trim();
}


function $date(dateStr) {
	return $(`$date(${dateStr})`);
}


function dateToYMD(date) {
	const d = date.getDate();
	const m = date.getMonth() + 1; // Month from 0 to 11
	const y = date.getFullYear();
	return `${y}-${(m <= 9 ? `0${m}` : m)}-${(d <= 9 ? `0${d}` : d)}`;
}


function toDatetime(dateTimeStr) {
	// Convert FB datetime string into one that we can call new Date() on
	return dateTimeStr.replace(' ', 'T');
}


let timezoneOffset = 0;
function updateTimezoneOffset() {
	// This method is called from on_playback_new_track so we can gracefully handle DST adjustments and the like
	const temp = new Date();
	timezoneOffset = temp.getTimezoneOffset() * 60 * 1000;
}


/**
 * foobar time strings are already in local time, so converting them to date objects treats
 * them as UTC time, and again adjusts to local time, and the timezone offset is applied twice.
 * Therefore we need to add it back in here.
 * @param {string} dateTimeStr
 * @returns {number} Time value in ms
 */
function toTime(dateTimeStr) {
	if (dateTimeStr === 'N/A') {
		return undefined;
	}
	return new Date(toDatetime(dateTimeStr)).getTime() + timezoneOffset;
}


function calcAge(date) {
	const round = 1000;		// Round to the second
	const now = new Date();
	return Math.floor(now.getTime() / round) - Math.floor(date / round);
}


function calcAgeRatio(num, divisor) {
	return toFixed(1.0 - (calcAge(num) / divisor), 3);
}


///////////////////////
// * COUNTRY CODES * //
///////////////////////
const countryCodes = {
	US: 'United States',
	GB: 'United Kingdom',
	AU: 'Australia',
	DE: 'Germany',
	FR: 'France',
	SE: 'Sweden',
	NO: 'Norway',
	IT: 'Italy',
	JP: 'Japan',
	CN: 'China',
	FI: 'Finland',
	KR: 'South Korea',
	RU: 'Russia',
	IE: 'Ireland',
	GR: 'Greece',
	IS: 'Iceland',
	IN: 'India',
	AD: 'Andorra',
	AE: 'United Arab Emirates',
	AF: 'Afghanistan',
	AG: 'Antigua and Barbuda',
	AI: 'Anguilla',
	AL: 'Albania',
	AM: 'Armenia',
	AO: 'Angola',
	AQ: 'Antarctica',
	AR: 'Argentina',
	AS: 'American Samoa',
	AT: 'Austria',
	AW: 'Aruba',
	AX: 'Åland',
	AZ: 'Azerbaijan',
	BA: 'Bosnia and Herzegovina',
	BB: 'Barbados',
	BD: 'Bangladesh',
	BE: 'Belgium',
	BF: 'Burkina Faso',
	BG: 'Bulgaria',
	BH: 'Bahrain',
	BI: 'Burundi',
	BJ: 'Benin',
	BL: 'Saint Barthelemy',
	BM: 'Bermuda',
	BN: 'Brunei Darussalam',
	BO: 'Bolivia',
	BQ: 'Bonaire, Sint Eustatius and Saba',
	BR: 'Brazil',
	BS: 'Bahamas',
	BT: 'Bhutan',
	BV: 'Bouvet Island',
	BW: 'Botswana',
	BY: 'Belarus',
	BZ: 'Belize',
	CA: 'Canada',
	CC: 'Cocos Keeling Islands',
	CD: 'Democratic Republic of the Congo',
	CF: 'Central African Republic',
	CH: 'Switzerland',
	CI: 'Cote d\'Ivoire',
	CK: 'Cook Islands',
	CL: 'Chile',
	CM: 'Cameroon',
	CO: 'Colombia',
	CR: 'Costa Rica',
	CU: 'Cuba',
	CV: 'Cape Verde',
	CX: 'Christmas Island',
	CY: 'Cyprus',
	CZ: 'Czech Republic',
	DJ: 'Djibouti',
	DK: 'Denmark',
	DM: 'Dominica',
	DO: 'Dominican Republic',
	DZ: 'Algeria',
	EC: 'Ecuador',
	EE: 'Estonia',
	EG: 'Egypt',
	EH: 'Western Sahara',
	ER: 'Eritrea',
	ES: 'Spain',
	ET: 'Ethiopia',
	FJ: 'Fiji',
	FK: 'Falkland Islands',
	FM: 'Micronesia',
	FO: 'Faroess',
	GA: 'Gabon',
	GD: 'Grenada',
	GE: 'Georgia',
	GG: 'Guernsey',
	GH: 'Ghana',
	GI: 'Gibraltar',
	GL: 'Greenland',
	GM: 'Gambia',
	GN: 'Guinea',
	GQ: 'Equatorial Guinea',
	GS: 'South Georgia and the South Sandwich Islands',
	GT: 'Guatemala',
	GU: 'Guam',
	GW: 'Guinea-Bissau',
	GY: 'Guyana',
	HK: 'Hong Kong',
	HN: 'Honduras',
	HR: 'Croatia',
	HT: 'Haiti',
	HU: 'Hungary',
	ID: 'Indonesia',
	IL: 'Israel',
	IM: 'Isle of Man',
	IQ: 'Iraq',
	IR: 'Iran',
	JE: 'Jersey',
	JM: 'Jamaica',
	JO: 'Jordan',
	KE: 'Kenya',
	KG: 'Kyrgyzstan',
	KH: 'Cambodia',
	KI: 'Kiribati',
	KM: 'Comoros',
	KN: 'Saint Kitts and Nevis',
	KP: 'North Korea',
	KW: 'Kuwait',
	KY: 'Cayman Islands',
	KZ: 'Kazakhstan',
	LA: 'Laos',
	LB: 'Lebanon',
	LC: 'Saint Lucia',
	LI: 'Liechtenstein',
	LK: 'Sri Lanka',
	LR: 'Liberia',
	LS: 'Lesotho',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	LV: 'Latvia',
	LY: 'Libya',
	MA: 'Morocco',
	MC: 'Monaco',
	MD: 'Moldova',
	ME: 'Montenegro',
	MF: 'Saint Martin',
	MG: 'Madagascar',
	MH: 'Marshall Islands',
	MK: 'Macedonia',
	ML: 'Mali',
	MM: 'Myanmar',
	MN: 'Mongolia',
	MO: 'Macao',
	MP: 'Northern Mariana Islands',
	MQ: 'Martinique',
	MR: 'Mauritania',
	MS: 'Montserrat',
	MT: 'Malta',
	MU: 'Mauritius',
	MV: 'Maldives',
	MW: 'Malawi',
	MX: 'Mexico',
	MY: 'Malaysia',
	MZ: 'Mozambique',
	NA: 'Namibia',
	NC: 'New Caledonia',
	NE: 'Niger',
	NF: 'Norfolk Island',
	NG: 'Nigeria',
	NI: 'Nicaragua',
	NL: 'Netherlands',
	NP: 'Nepal',
	NR: 'Nauru',
	NU: 'Niue',
	NZ: 'New Zealand',
	OM: 'Oman',
	PA: 'Panama',
	PE: 'Peru',
	PF: 'French Polynesia',
	PG: 'Papua New Guinea',
	PH: 'Philippines',
	PK: 'Pakistan',
	PL: 'Poland',
	PM: 'Saint Pierre and Miquelon',
	PN: 'Pitcairn',
	PR: 'Puerto Rico',
	PS: 'Palestine',
	PT: 'Portugal',
	PW: 'Palau',
	PY: 'Paraguay',
	QA: 'Qatar',
	RE: 'Réunion',
	RO: 'Romania',
	RS: 'Serbia',
	RW: 'Rwanda',
	SA: 'Saudi Arabia',
	SB: 'Solomon Islands',
	SC: 'Seychelles',
	SD: 'Sudan',
	SG: 'Singapore',
	SH: 'Saint Helena',
	SI: 'Slovenia',
	SJ: 'Svalbard and Jan Mayen',
	SK: 'Slovakia',
	SL: 'Sierra Leone',
	SM: 'San Marino',
	SN: 'Senegal',
	SO: 'Somalia',
	SR: 'Suriname',
	SS: 'South Sudan',
	ST: 'Sao Tome and Principe',
	SV: 'El Salvador',
	SX: 'Sint Maarten',
	SY: 'Syrian Arab Republic',
	SZ: 'Swaziland',
	TC: 'Turks and Caicos Islands',
	TD: 'Chad',
	TF: 'French Southern Territories',
	TG: 'Togo',
	TH: 'Thailand',
	TJ: 'Tajikistan',
	TK: 'Tokelau',
	TL: 'Timor-Leste',
	TM: 'Turkmenistan',
	TN: 'Tunisia',
	TO: 'Tonga',
	TR: 'Turkey',
	TT: 'Trinidad and Tobago',
	TV: 'Tuvalu',
	TW: 'Taiwan',
	TZ: 'Tanzania',
	UA: 'Ukraine',
	UG: 'Uganda',
	UY: 'Uruguay',
	UZ: 'Uzbekistan',
	VA: 'Vatican City',
	VC: 'Saint Vincent and the Grenadines',
	VE: 'Venezuela',
	VI: 'US Virgin Islands',
	VN: 'Vietnam',
	VU: 'Vanuatu',
	WF: 'Wallis and Futuna',
	WS: 'Samoa',
	XE: 'European Union', // Musicbrainz code for European releases. Council of Europe uses same flag as EU.
	XW: 'United Nations', // Musicbrainz code for all World releases. Uses the UN flag which is the MB standard.
	YE: 'Yemen',
	YT: 'Mayotte',
	ZA: 'South Africa',
	ZM: 'Zambia',
	ZW: 'Zimbabwe'
};


function convertIsoCountryCodeToFull(code) {
	if (code.length === 2) {
		return countryCodes[code];
	}
	return code;
}
