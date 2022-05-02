/** @type {*} */
const fso = new ActiveXObject('Scripting.FileSystemObject');

function IsFile(filename) {
	return utils.IsFile(filename);
}

function IsFolder(folder) {
	return utils.IsDirectory(folder);
}

function _createFolder(folder, is_recursive) {
	if (utils.IsDirectory(folder)) {
		return;
	}

	if (is_recursive) {
		let parent_path = fso.GetParentFolderName(folder);
		if (!utils.IsDirectory(parent_path)) {
			_createFolder(parent_path, true);
		}
	}

	fso.CreateFolder(folder);
}

function _deleteFile(file) {
	if (utils.IsFile(file)) {
		try {
			fso.DeleteFile(file);
		} catch (e) {
		}
	}
}

/**
 *
 * @param {string} titleFormatString Title format string to evaluate
 * @param {FbMetadbHandle=} metadb Handle to evaluate string with
 * @param {boolean=} force Force evaluate. Optional.
 */
function $(titleFormatString, metadb = undefined, force = false) {
	var tf;
	try {
		if (metadb) {
			tf = fb.TitleFormat(titleFormatString).EvalWithMetadb(metadb);
		} else {
			tf = fb.TitleFormat(titleFormatString).Eval(force);
		}
	} catch (e) {
		tf = e + " (Invalid metadb!)"
	};
	return tf;
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
		// this is a fallback in case the `name` property is a complex tf field and meta_num evaluates to 0.
		// In that case we want to evaluate the entire field, after wrapping in brackets and split on commas.
		const unsplit = $(`[${name}]`, metadb);
		if (unsplit.length) {
			vals = unsplit.split(', ');
		}
	}

	return vals;
}

/**
 * Use the debugLog function instead of console.log to easily hide messages that I don't want cluttering the console constantly
 * @type {function(...*):void} var_args
 */
function debugLog() {
	if (arguments.length) {
		// @ts-ignore-line
		if (settings.showDebugLog) console.log(...arguments);
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

function RGB(r, g, b) { return (0xff000000 | (r << 16) | (g << 8) | (b)); }
function RGBA(r, g, b, a) { return ((a << 24) | (r << 16) | (g << 8) | (b)); }
function RGBtoRGBA (rgb, a) { return a << 24 | (rgb & 0x00FFFFFF); }
function toRGB(c) { return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff]; }
var rgb = RGB;
var rgba = RGBA;

function colToRgb(c, showPrefix) {
	if (typeof showPrefix === 'undefined') showPrefix = true;
	var alpha = getAlpha(c);
	var prefix = '';
	if (alpha < 255) {
		if (showPrefix) prefix = 'rgba'
		return prefix + '('+ getRed(c) + ', ' + getGreen(c) + ', ' + getBlue(c) + ', ' + alpha + ')';
	} else {
		if (showPrefix) prefix = 'rgb'
		return prefix + '(' + getRed(c) + ', ' + getGreen(c) + ', ' + getBlue(c) + ')';
	}
}

function clamp(num, min, max) {
	num = num <= max ? num : max;
	num = num >= min ? num : min;
	return num;
}

function calcBrightness(c) {
	var r = getRed(c);
	var g = getGreen(c);
	var b = getBlue(c);
	return Math.round(Math.sqrt( 0.299*r*r + 0.587*g*g + 0.114*b*b ));
}

function calcImageBrightness(image) {
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

		if (settings.showThemeLog) console.log(`Image brightness:`, avgCol);
		return avgCol;

	} catch (e) {
		console.log(`<Error: GetColourSchemeJSON failed.>`);
	}
}

function FillGradEllipse(gr, x, y, w, h, angle, color1, color2, focus) {
	let lw = scaleForDisplay(2);
	// Mask
	let maskImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillEllipse(Math.floor(lw / 2), Math.floor(lw / 2), w - lw - scaleForDisplay(1), h - lw - scaleForDisplay(1), 0xff000000);
	maskImg.ReleaseGraphics(g);

	// Gradient ellipse
	let gradEllipseImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	g = gradEllipseImg.GetGraphics();
	g.FillGradRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw - scaleForDisplay(1), h - lw - scaleForDisplay(1), angle, color1, color2, focus);
	gradEllipseImg.ReleaseGraphics(g);

	let mask = maskImg.Resize(w + scaleForDisplay(1), h + scaleForDisplay(1));
	gradEllipseImg.ApplyMask(mask);

	gr.DrawImage(gradEllipseImg, x, y, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, 0, w, h, 0, 255);
}

function FillGradRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, color1, color2, focus) {
	// Mask
	let maskImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillRoundRect(0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// Gradient rect
	let gradRectImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	g = gradRectImg.GetGraphics();
	g.FillGradRect(0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), angle, color1, color2, focus);
	gradRectImg.ReleaseGraphics(g);

	let mask = maskImg.Resize(w + scaleForDisplay(1), h + scaleForDisplay(1));
	gradRectImg.ApplyMask(mask);

	gr.DrawImage(gradRectImg, x, y, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, 0, w, h, 0, 255);
}

function FillBlendedRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, focus) {
	// Mask
	let maskImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillRoundRect(0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// Blended rect
	let gradRectImg = gdi.CreateImage(w + scaleForDisplay(1), h + scaleForDisplay(1));
	g = gradRectImg.GetGraphics();
	g.DrawImage(blendedImg, 0, 0, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, h, blendedImg.Width, blendedImg.Height);
	gradRectImg.ReleaseGraphics(g);

	let mask = maskImg.Resize(w + scaleForDisplay(1), h + scaleForDisplay(1));
	gradRectImg.ApplyMask(mask);

	gr.DrawImage(gradRectImg, x, y, w - scaleForDisplay(1), h - scaleForDisplay(1), 0, 0, w, h, 0, 255);
}

class ImageSize {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}

function testFont(fontName) {
	if (!utils.CheckFont(fontName)) {
		console.log('Error: Font "' + fontName + '" was not found. Please install it from the fonts folder');
		return false;
	}
	return true;
}

function calculateGridMaxTextWidth(gr, gridArray, font) {
	var maxWidth = 0;
	gridArray && gridArray.forEach(function (el) {
		const width = Math.ceil(gr.MeasureString(el.label, font, 0, 0, ww, wh).Width) + 1;
		if (width > maxWidth) {
			maxWidth = width;
		}
	});
	return maxWidth;
}

/** Given an array of fonts, returns a single font which the given text will fully fit the
 *  availableSpace, or the last font in the list (should be the smallest and text will be truncated)
 * */
function chooseFontForWidth(gr, availableWidth, text, fontList, maxLines) {
	maxLines = (typeof maxLines !== 'undefined') ? maxLines : 1;
	var fontIndex = undefined;
	for (var i = 0; i < fontList.length; i++) {
		fontIndex = i;
		var measurements = gr.MeasureString(text, fontList[fontIndex], 0, 0, availableWidth, 0);
		if (measurements.Lines <= maxLines)
			break;
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
	var textArray;
	var lineHeight;
	let continuation;
	for (let fontIndex = 0; fontIndex < fontList1.length && (!text2 || fontIndex < fontList2.length); fontIndex++) {
		textArray = [];
		lineHeight = Math.max(gr.CalcTextHeight(text1, fontList1[fontIndex]),
							 (text2 ? gr.CalcTextHeight(text2, fontList2[fontIndex]) : 0))
		continuation = false;	// does font change on same line
		/** @type {any[]} */
		var lineText = gr.EstimateLineWrap(text1, fontList1[fontIndex], availableWidth);
		for (var i = 0; i < lineText.length; i += 2) {
			textArray.push({ text: lineText[i].trim(), x_offset: 0, font: fontList1[fontIndex] });
		}
		if (textArray.length <= maxLines && text2) {
			var lastLineWidth = lineText[lineText.length - 1];
			/** @type {any[]} */
			var secondaryText = gr.EstimateLineWrap(text2, fontList2[fontIndex], availableWidth - lastLineWidth - 5);
			let firstSecondaryLine = secondaryText[0];	// need to subtract the contination of the previous line from text2
			let textRemainder = text2.substr(firstSecondaryLine.length).trim();
			if (firstSecondaryLine.trim().length) {
				textArray.push({ text: firstSecondaryLine, x_offset: lastLineWidth + 5, font: fontList2[fontIndex] });
				continuation = true;	// font changes on same line
			}
			secondaryText = gr.EstimateLineWrap(textRemainder, fontList2[fontIndex], availableWidth);
			for (var i = 0; i < secondaryText.length; i += 2) {
				textArray.push({ text: secondaryText[i], x_offset: 0, font: fontList2[fontIndex] });
			}
		}
		if (textArray.length - (continuation ? 1 : 0) <= maxLines) break;
	}
	var y_offset = 0;
	var linesDrawn = 0;
	var cutoff = false;
	if (textArray.length > maxLines + (continuation ? 1 : 0)) {
		cutoff = true;
	}
	textArray.splice(maxLines + (continuation ? 1 : 0));
	for (var i = 0; i < textArray.length; i++) {
		var line = textArray[i];
		if (line.x_offset) {
			// continuation line, so move back up for drawing
			y_offset -= lineHeight;
		} else if (line.text.length) {
			linesDrawn++;
		}
		if (i === textArray.length - 1 && cutoff) {
			line.text += ' ABCDEFGHIJKMLNOPQRSTUVWXYZABCDEFGHIJKMLNOPQRSTUVWXYZ';	// trigger elipses
		}
		gr.DrawString(line.text, line.font, color, left + line.x_offset, top + y_offset,
			availableWidth - line.x_offset, lineHeight, g_string_format.trim_ellipsis_word);
		y_offset += lineHeight;
	}
	return linesDrawn * lineHeight;
}

/**
 * Returns the diff between a start and end date in the form of "2y 3m 24d". Order of the two dates does not matter.
 * @param {string} startingDate
 * @param {string=} endingDate if no endingDate is supplied, use current time
 * @returns {string}
 */
 function dateDiff(startingDate, endingDate) {
	if (!startingDate) return '';
	const hasStartDay = (startingDate.length > 7) ? true : false;
	if (!hasStartDay) {
		startingDate = startingDate + '-02';    // avoid timezone issues
	}
	let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
	if (!endingDate) {
		const now = new Date().getTime() - timezoneOffset;	// subtract timezone offset because we're stripping timzone from ISOString
		endingDate = new Date(now).toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
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

	return (yearDiff ? yearDiff + 'y ' : '') + (monthDiff > 0 ? monthDiff + 'm ': '') + (dayDiff ? dayDiff + 'd': '');
}

function calcAgeDateString(date) {
	var str = '';
	if (date.length) {
		try {
			str = dateDiff($date(date));
		} catch (e) {
			console.log('date has invalid value', date, 'in calcAgeDateString()');
			// throw new ArgumentError('date', date, 'in calcAgeDateString()');
		}
	}

	return str.trim();
}

function $date(dateStr) {
	return $('$date(' + dateStr + ')');
}

function dateToYMD(date) {
	var d = date.getDate();
	var m = date.getMonth() + 1; //Month from 0 to 11
	var y = date.getFullYear();
	return `${y}-${(m<=9 ? `0${m}` : m)}-${(d <= 9 ? `0${d}` : d)}`;
}

function toDatetime(dateTimeStr) {
	// convert FB datetime string into one that we can call new Date() on
	return dateTimeStr.replace(' ', 'T');
}

var timezoneOffset = 0;
function updateTimezoneOffset() {
	// this method is called from on_playback_new_track so we can gracefully handle DST adjustments and the like
	var temp = new Date();
	timezoneOffset = temp.getTimezoneOffset() * 60 * 1000;
}

/**
 * foobar time strings are already in local time, so converting them to date objects treats
 * them as UTC time, and again adjusts to local time, and the timezone offset is applied twice.
 * Therefore we need to add it back in here.
 * @param {string} dateTimeStr
 * @returns {number} time value in ms
 */
 function toTime(dateTimeStr) {
	if (dateTimeStr === 'N/A') {
		return undefined;
	}
	return new Date(toDatetime(dateTimeStr)).getTime() + timezoneOffset;
}

function calcAge(date) {
	var round = 1000;		// round to the second
	var now = new Date();
	var age = Math.floor(now.getTime() / round) - Math.floor(date / round);

	return age;
}

function calcAgeRatio(num, divisor) {
	return toFixed(1.0 - (calcAge(num) / divisor), 3);
}

function toFixed(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

function printColorObj(obj) {
	console.log('\tname: \'\',\n\tcolors: {');
	for(var propName in obj) {
		const propValue = obj[propName]

		console.log('\t\t' + propName + ': ' + colToRgb(propValue, true) + ',\t\t// #' + toPaddedHexString(0xffffff & propValue, 6));
	}
	console.log('\t},\n\thint: [' + colToRgb(obj.primary, true) + ']');
}

function colorToHSLString(col) {
	return leftPad(col.hue, 3) + ' '  + leftPad(col.saturation, 3) + ' ' + leftPad(col.lightness,3);
}

function toPaddedHexString(num, len) {
	return padNumber(num, len, 16);
}

function padNumber(num, len, base) {
	if (!base) {
		base = 10;
	}
	return ('000000' + num.toString(base)).substr(-len);
}

function leftPad(val, size, ch) {
	var result = String(val);
	if(!ch) {
		ch = ' ';
	}
	while (result.length < size) {
		result = ch + result;
	}
	return result;
}

function makeHttpRequest(type, url, successCB) {
	/** @type {*} */
	var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	xmlhttp.open(type, url, true);
	xmlhttp.setRequestHeader('User-Agent', 'foo_spider_monkey_georgia');
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState == 4) {
			successCB(xmlhttp.responseText);
		}
	};
	xmlhttp.send();
}

// from: https://github.com/substack/semver-compare/issues/1#issuecomment-594765531
// release must be in form of 2.0.0-beta1, or 2.0.1
function isNewerVersion (oldVer, newVer) {
	const a = newVer.split('-');
	const b = oldVer.split('-');
	var pa = a[0].split('.');
	var pb = b[0].split('.');
	for (var i = 0; i < 3; i++) {
		var na = Number(pa[i]);
		var nb = Number(pb[i]);
		if (na > nb) return true;
		if (nb > na) return false;
		if (!isNaN(na) && isNaN(nb)) return true;
		if (isNaN(na) && !isNaN(nb)) return false;
	}
	if (a[1] && b[1]) {
		return a[1] > b[1] ? true : false;
	}
	return !a[1] && b[1] ? true : false;
}

const menuStartIndex = 100; // can be anything except 0
// SMP does not yet have support for "fields" and so we cannot create static members shared across all classes.
// We must use these ugly shared globals instead
let _MenuItemIndex = menuStartIndex;
let _MenuCallbacks = [];
let _MenuVariables = [];

/**
 * Helper class for creating Menus, submenus, radio groups, toggle items, etc.
 */
class Menu {
	/**
	 * @param {string=} title Title of the menu. If this is the parent menu, should be undefined.
	 */
	constructor(title = '') {
		_MenuItemIndex++;
		this.menu = window.CreatePopupMenu();
		this.title = title;
		this.systemMenu = false;
		this.menuManager = null;
	}

	/**
	 * Creates default foobar menu corresponding to `name`.
	 * @param {string} name
	 */
	initFoobarMenu(name) {
		if (name) {
			this.systemMenu = true;
			this.menuManager = fb.CreateMainMenuManager();
			this.menuManager.Init(name);
			this.menuManager.BuildMenu(this.menu, 1, 1000);
		}
	};

	/**
	 * Adds a separator to the menu.
	 */
	addSeparator() {
		this.menu.AppendMenuSeparator();
	};

	/**
	 *
	 * @param {string} label
	 * @param {boolean} checked Should the menu item be checked
	 * @param {Function} callback
	 * @param {boolean=} [disabled=false]
	 */
	addItem(label, checked, callback, disabled = false) {
		this.addItemWithVariable(label, checked, undefined, callback, disabled);
	};

	/**
	 * Similar to addItem, but takes an object and property name which will automatically be set when the callback is called,
	 * before calling any user specified callback. If the property you wish to toggle is options.repeat, then propertiesObj
	 * is options, and the propertyName must be "repeat" as a string.
	 * @param {string} label
	 * @param {object} propertiesObj An object which contains propertyName
	 * @param {string} propertyName The name of the property to toggle on/off
	 * @param {?Function} callback
	 * @param {?boolean=} [disabled=false]
	 */
	addToggleItem(label, propertiesObj, propertyName, callback = () => { }, disabled = false) {
		this.addItem(label, propertiesObj[propertyName], () => {
			propertiesObj[propertyName] = !propertiesObj[propertyName];
			if (callback) {
				callback();
			}
		}, disabled);
	};

	/**
	 * Creates a set of radio items and checks the value specified
	 * @param {string[]} labels Array of strings which corresponds to each radio item
	 * @param {*} selectedValue Value of the radio item to be checked
	 * @param {*[]} variables Array of values which correspond to each radio entry. `selectedValue` will be checked against these values.
	 * @param {Function} callback
	 */
	addRadioItems(labels, selectedValue, variables, callback) {
		var startIndex = _MenuItemIndex;
		var selectedIndex;
		for (var i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MF_STRING, _MenuItemIndex, labels[i]);
			_MenuCallbacks[_MenuItemIndex] = callback;
			_MenuVariables[_MenuItemIndex] = variables[i];
			if (selectedValue === variables[i]) {
				selectedIndex = _MenuItemIndex;
			}
			_MenuItemIndex++;
		}
		if (selectedIndex) {
			this.menu.CheckMenuRadioItem(startIndex, _MenuItemIndex - 1, selectedIndex);
		}
	};

	/**
	 * Creates a submenu consisting of radio items
	 * @param {string} subMenuName
	 * @param {string[]} labels Array of strings which corresponds to each radio item
	 * @param {*} selectedValue Value of the radio item to be checked
	 * @param {*[]} variables Array of values which correspond to each radio entry. `selectedValue` will be checked against these values.
	 * @param {Function} callback
	 * @param {boolean=} [disabled=false]
	 */
	createRadioSubMenu(subMenuName, labels, selectedValue, variables, callback, disabled = false) {
		var subMenu = new Menu(subMenuName);
		subMenu.addRadioItems(labels, selectedValue, variables, callback);
		subMenu.appendTo(this, disabled);
	};

	/**
	 * @param {string} label
	 * @param {boolean} checked Should the menu item be checked
	 * @param {*} variable Variable which will be passed to callback when item is clicked
	 * @param {Function} callback
	 * @param {boolean} disabled
	 */
	addItemWithVariable(label, checked, variable, callback, disabled) {
		this.menu.AppendMenuItem(MF_STRING | (disabled ? MF_DISABLED : 0), _MenuItemIndex, label);
		this.menu.CheckMenuItem(_MenuItemIndex, checked);
		_MenuCallbacks[_MenuItemIndex] = callback;
		if (typeof variable !== 'undefined') {
			_MenuVariables[_MenuItemIndex] = variable;
		}
		_MenuItemIndex++;
	};

	/**
	 * Appends menu to a parent menu
	 * @param {Menu} parentMenu The Menu to append the subMenu to
	 * @param {boolean=} [disabled=false]
	 */
	appendTo(parentMenu, disabled = false) {
		this.menu.AppendTo(parentMenu.menu, MF_STRING | (disabled ? MF_DISABLED : 0), this.title);
	};

	/**
	 * handles callback and automatically Disposes menu
	 * @param {number} idx Value of the menu item's callback to call. Comes from menu.trackPopupMenu(x, y).
	 */
	doCallback(idx) {
		if (idx > menuStartIndex && _MenuCallbacks[idx]) {
			_MenuCallbacks[idx](_MenuVariables[idx]);
		} else if (this.systemMenu && idx) {
			this.menuManager.ExecuteByID(idx - 1);
			this.menuManager = null;
		}
		this.menu = null;
		// reset globals as menu is about to be destroyed
		_MenuCallbacks = [];
		_MenuVariables = [];
		_MenuItemIndex = menuStartIndex;
	};

	/**
	 * @return {number} index of the menu item clicked on
	 */
	trackPopupMenu(x, y) {
		return this.menu.TrackPopupMenu(x, y);
	};
}

// setup variables for 4k check
var sizeInitialized = false;
var last_size = undefined;

// Check DPI via registry for possible 4k resolution
let initDPI = {
	dpi : () => {var dpi = 120; try {dpi = initDPI.WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");} catch (e) {} return dpi;},
	WshShell : new ActiveXObject('WScript.Shell')
}

function checkForRes(w, h) {
	if (pref.displayRes === '4k') {
		is_4k = true;
		is_QHD = false;
		default_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved width',  2800);
		default_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved height', 1720);
		artwork_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved width',  1052);
		artwork_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved height', 1372);
		compact_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved width',   964);
		compact_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved height', 1720);
	}
	else if (pref.displayRes === 'QHD') {
		is_4k = false;
		is_QHD = true;
		default_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved width',  1280);
		default_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved height',  800);
		artwork_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved width',   640);
		artwork_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved height',  800);
		compact_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved width',   540);
		compact_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved height',  800);
	}
	else if (pref.displayRes === 'HD') {
		is_4k = false;
		is_QHD = false;
		default_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved width', 1140);
		default_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved height', 730);
		artwork_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved width',  526);
		artwork_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved height', 686);
		compact_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved width',  484);
		compact_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved height', 730);
	}
	if (last_size !== is_4k) {
		sizeInitialized = false;
		last_size = is_4k;
	}
}

function checkForPlayerSize() {
	if (!is_4k && !is_QHD) {
		if (pref.layout_mode === 'default_mode' && ww === 1140 && wh ===  730 || pref.layout_mode === 'artwork_mode' && ww ===  526 && wh ===  686 || pref.layout_mode === 'compact_mode' && ww ===  484 && wh ===  730) { pref.playerSize = 'small';  pref.player_HD_small   = true; } else { pref.player_HD_small   = false; }
		if (pref.layout_mode === 'default_mode' && ww === 1600 && wh ===  960 || pref.layout_mode === 'artwork_mode' && ww ===  700 && wh ===  860 || pref.layout_mode === 'compact_mode' && ww ===  484 && wh ===  960) { pref.playerSize = 'normal'; pref.player_HD_normal  = true; } else { pref.player_HD_normal  = false; }
		if (pref.layout_mode === 'default_mode' && ww === 1802 && wh === 1061 || pref.layout_mode === 'artwork_mode' && ww ===  901 && wh === 1062 || pref.layout_mode === 'compact_mode' && ww === 1600 && wh ===  960) { pref.playerSize = 'large';  pref.player_HD_large   = true; } else { pref.player_HD_large   = false; }
	}
	if (is_QHD) {
		if (pref.layout_mode === 'default_mode' && ww === 1280 && wh ===  800 || pref.layout_mode === 'artwork_mode' && ww ===  640 && wh ===  800 || pref.layout_mode === 'compact_mode' && ww ===  540 && wh ===  800) { pref.playerSize = 'small';  pref.player_QHD_small  = true; } else { pref.player_QHD_small  = false; }
		if (pref.layout_mode === 'default_mode' && ww === 1802 && wh === 1061 || pref.layout_mode === 'artwork_mode' && ww ===  901 && wh === 1061 || pref.layout_mode === 'compact_mode' && ww ===  540 && wh === 1061) { pref.playerSize = 'normal'; pref.player_QHD_normal = true; } else { pref.player_QHD_normal = false; }
		if (pref.layout_mode === 'default_mode' && ww === 2280 && wh === 1300 || pref.layout_mode === 'artwork_mode' && ww === 1140 && wh === 1300 || pref.layout_mode === 'compact_mode' && ww === 2080 && wh === 1300) { pref.playerSize = 'large';  pref.player_QHD_large  = true; } else { pref.player_QHD_large  = false; }
	}
	if (is_4k) {
		if (pref.layout_mode === 'default_mode' && ww === 2300 && wh === 1470 || pref.layout_mode === 'artwork_mode' && ww === 1052 && wh === 1372 || pref.layout_mode === 'compact_mode' && ww ===  964 && wh === 1470) { pref.playerSize = 'small';  pref.player_4k_small   = true; } else { pref.player_4k_small   = false; }
		if (pref.layout_mode === 'default_mode' && ww === 2800 && wh === 1720 || pref.layout_mode === 'artwork_mode' && ww === 1400 && wh === 1720 || pref.layout_mode === 'compact_mode' && ww ===  964 && wh === 1720) { pref.playerSize = 'normal'; pref.player_4k_normal  = true; } else { pref.player_4k_normal  = false; }
		if (pref.layout_mode === 'default_mode' && ww === 3400 && wh === 2020 || pref.layout_mode === 'artwork_mode' && ww === 1699 && wh === 2020 || pref.layout_mode === 'compact_mode' && ww === 2800 && wh === 1720) { pref.playerSize = 'large';  pref.player_4k_large   = true; } else { pref.player_4k_large   = false; }
	}
	if (!(pref.player_HD_small   || pref.player_HD_normal  || pref.player_HD_large  ||
		  pref.player_QHD_small  || pref.player_QHD_normal || pref.player_QHD_large ||
		  pref.player_4k_small   || pref.player_4k_normal  || pref.player_4k_large)) {
		pref.playerSize = 'custom';
	}
}

function autoDetectRes() {
	function resetSize() { // Reset player size for initialization
		is_4k = false;
		is_QHD = false;
		setSizesFor4KorHD();
		pref.displayRes = 'HD';
		pref.player_4k_small  = false;
		pref.player_QHD_small = false;
		pref.player_HD_small  = 'player_HD_small';
	}

	function check4k() {
		set_window_size(2800, 1720); // Check if player size 'Normal' for 4k can be attained
		if (ww > 2560 && wh > 1600) {
			is_4k = true;
			setSizesFor4KorHD();
			pref.displayRes = '4k';
			pref.player_4k_normal = 'player_4k_normal';
			pref.player_QHD_small = false;
			pref.player_HD_small  = false;
		}
	}

	function checkQHD() {
		if (ww < 2800 && wh < 1720) {
			set_window_size(2500, 1400);  // Check if this resolution for QHD can be attained
			if (ww < 2500 && wh < 1400) { // If not, set to HD mode
				resetSize();
			}
			else { // Set to QHD mode
				is_QHD = true;
				setSizesForQHD();
				pref.displayRes = 'QHD';
				pref.player_4k_normal = false;
				pref.player_QHD_small = 'player_QHD_small';
				pref.player_HD_small  = false;
			}
		}
	}

	function updatePanels() {
		if (pref.layout_mode === 'default_mode') {
			mode_handler.default_mode();
		}
		else if (pref.layout_mode === 'artwork_mode') {
			mode_handler.artwork_mode();
		}
		else if (pref.layout_mode === 'compact_mode') {
			mode_handler.compact_mode();
		}
		initPanels();
	}

	async function startDetection() {
		await resetSize();
		await check4k();
		await checkQHD();
		await updatePanels();
	}

	startDetection();
}

function setSizesFor4KorHD() {
	is_QHD = false;

	// Main
	pref.menu_font_size = 12;
	pref.artist_font_size_default = 18;
	pref.artist_font_size_artwork = 16;
	pref.artist_font_size_compact = 16;
	pref.lower_bar_font_size_default = 18;
	pref.lower_bar_font_size_artwork = 16;
	pref.lower_bar_font_size_compact = 16;
	pref.transport_buttons_size_default = 32;
	pref.transport_buttons_size_artwork = 32;
	pref.transport_buttons_size_compact = 32;

	// Details
	pref.album_font_size = 18;
	pref.tracknum_font_size = 18;
	pref.MetadataGrid_key_font_size = 17;
	pref.MetadataGrid_val_font_size = 17;

	// Playlist
	pref.font_size_playlist_header = 15;
	pref.font_size_playlist = 12;
	g_properties.row_h = Math.round(pref.font_size_playlist * 1.667);

	if (is_4k) {
		ppt.baseFontSize = 24; // Library
		pptBio.baseFontSizeBio = 24; // Biography
	} else {
		ppt.baseFontSize = 12; // Library
		pptBio.baseFontSizeBio = 12; // Biography
	}
}

function setSizesForQHD() {
	is_4k = false;
	is_QHD = true;
	pref.player_4k_normal = false;
	pref.player_QHD_small = 'player_QHD_small';
	pref.player_HD_small  = false;

	// Main
	pref.menu_font_size = 14;
	pref.artist_font_size_default = 20;
	pref.artist_font_size_artwork = 18;
	pref.artist_font_size_compact = 18;
	pref.lower_bar_font_size_default = 20;
	pref.lower_bar_font_size_artwork = 18;
	pref.lower_bar_font_size_compact = 18;
	pref.transport_buttons_size_default = 34;
	pref.transport_buttons_size_artwork = 34;
	pref.transport_buttons_size_compact = 34;

	// Details
	pref.album_font_size = 20;
	pref.tracknum_font_size = 20;
	pref.MetadataGrid_key_font_size = 19;
	pref.MetadataGrid_val_font_size = 19;

	// Playlist
	pref.font_size_playlist_header = 17;
	pref.font_size_playlist = 14;
	g_properties.row_h = Math.round(pref.font_size_playlist * 1.667);

	// Library
	ppt.baseFontSize = 14;

	// Biography
	pptBio.baseFontSizeBio = 14;
}

/**
 * Scales the value based on 4k mode or not. TODO: Use _.scale() instead of is_4k.
 * @param {number} val
 * @return {number}
 */
function scaleForDisplay(val) {
	return is_4k ? val * 2 : val;
}


// ================================================ LAYOUT MODE SWITCHER ====================================================== //

var ui_switch = new function() {
	const fso = new ActiveXObject('Scripting.FileSystemObject');
	/**
	* @constructor
	*/
	function StateObject(name_arg, states_list_arg, default_state_arg) {

		// public:

		Object.defineProperty(this, "state", {

			/**
			 * @return {string}
			 */
			get : function () {
				return cur_state;
			},

			/**
			 * @param {string} val
			 */
			set : function (val) {
				cur_state = val;
				write_state(val);
			}
		});

		this.refresh = function() {
			write_state(cur_state);
		};

		// private:
		function initialize() {
			cur_state = read_state(name);
		}

		function read_state() {
			var pathToState = settings_path + '\\' + name.toUpperCase() + '_';

			var state = null;
			states_list.forEach(function(item,i) {
				if (fso.FileExists(pathToState + i)) {
					state = item;
					return false;
				}
			});
			if (state !== null) {
				return state;
			}

			var default_idx = states_list.indexOf(default_state);
			fso.CreateTextFile(pathToState + default_idx, true).Close();
			return default_state;
		}

		function write_state(new_state) {
			var pathToState = settings_path + '\\' + name.toUpperCase() + '_';

			var index_new = states_list.indexOf(new_state);

			if (index_new === -1) {
				throw Error('Argument Error:\nUnknown state ' + new_state);
			}

			states_list.forEach(function(item,i) {
				_deleteFile(pathToState + i);
			});
			if (!fso.FileExists(pathToState + index_new)) {
				fso.CreateTextFile(pathToState + index_new, true).Close();
			}

			window.NotifyOthers(name + '_state', new_state);
			refresh_ui();
		}

		// private:
		var name = name_arg;
		var default_state = default_state_arg;
		var states_list = states_list_arg;

		var cur_state;

		initialize();
	}

	function refresh_ui() {
		if (fb.IsPlaying) {
			fb.RunMainMenuCommand('Playback/Play or Pause');
			fb.RunMainMenuCommand('Playback/Play or Pause');
		}
		else {
			fb.RunMainMenuCommand('Playback/Play');
			fb.RunMainMenuCommand('Playback/Stop');
		}
	}

	// private:
	var settings_path = fb.ProfilePath + 'georgia-reborn\\settings\\';
	_createFolder(settings_path, true);

	/** @type {StateObject} */
	this.layout_mode = new StateObject('layout_mode', ['default_mode', 'artwork_mode', 'compact_mode'], 'default_mode');
	this.player_size = new StateObject('player_size', ['player_HD_small', 'player_HD_normal', 'player_HD_large', 'player_QHD_small', 'player_QHD_normal', 'player_QHD_large', 'player_4k_small', 'player_4k_normal', 'player_4k_large'], 'player_HD_small');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var mode_handler = new LayoutModeHandler();

function LayoutModeHandler() {

	this.default_mode = function() {
		var new_layout_mode_state = 'default_mode';
		if (new_layout_mode_state === 'default_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.layout_mode.state = new_layout_mode_state;

			if (pref.displayRes === '4k') {
				pref.player_4k_normal   = 'player_4k_normal';
				pref.player_QHD_small   = false;
				pref.player_HD_small    = false;
				UIHacks.MinSize.Width   = 2300;
				UIHacks.MinSize.Height  = 1470;
				UIHacks.MinSize.Enabled = true;
				set_window_size(2800, 1720);
			}
			if (pref.displayRes === 'QHD') {
				pref.player_4k_normal   = false;
				pref.player_QHD_small   = 'player_QHD_small';
				pref.player_HD_small    = false;
				UIHacks.MinSize.Width   = 1280;
				UIHacks.MinSize.Height  = 800;
				UIHacks.MinSize.Enabled = true;
				set_window_size(1280, 800);
			}
			if (pref.displayRes === 'HD') {
				pref.player_4k_normal   = false;
				pref.player_QHD_small   = false;
				pref.player_HD_small    = 'player_HD_small';
				UIHacks.MinSize.Width   = 1140;
				UIHacks.MinSize.Height  = 730;
				UIHacks.MinSize.Enabled = true;
				set_window_size(1140, 730);
			}
		}
	};

	this.artwork_mode = function() {
		var new_layout_mode_state = 'artwork_mode';
		if (new_layout_mode_state === 'artwork_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.artwork_mode_saved_width = fb_handle.Width;
					pref.artwork_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.layout_mode.state = new_layout_mode_state;

			if (pref.displayRes === '4k') {
				pref.player_4k_small  = 'player_4k_small';
				pref.player_QHD_small = false;
				pref.player_HD_small  = false;
				set_window_size(1052, 1372);
			}
			else if (pref.displayRes === 'QHD') {
				pref.player_4k_normal = false;
				pref.player_QHD_small = 'player_QHD_small';
				pref.player_HD_small  = false;
				set_window_size(640, 800);
			}
			else if (pref.displayRes === 'HD') {
				pref.player_4k_normal = false;
				pref.player_QHD_small = false;
				pref.player_HD_small  = 'player_HD_small';
				set_window_size(526, 686);
			}
		}
	};

	this.compact_mode = function() {
		var new_layout_mode_state = 'compact_mode';
		if (new_layout_mode_state === 'compact_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.compact_mode_saved_width = fb_handle.Width;
					pref.compact_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.layout_mode.state = new_layout_mode_state;

			if (pref.displayRes === '4k') {
				pref.player_4k_normal = 'player_4k_normal';
				pref.player_QHD_small = false;
				pref.player_HD_small  = false;
				set_window_size(964, 1720);
			}
			else if (pref.displayRes === 'QHD') {
				pref.player_4k_normal = false;
				pref.player_QHD_small = 'player_QHD_small';
				pref.player_HD_small  = false;
				set_window_size(540, 800);
			}
			else if (pref.displayRes === 'HD') {
				pref.player_4k_normal = false;
				pref.player_QHD_small = false;
				pref.player_HD_small  = 'player_HD_small';
				set_window_size(484, 730);
			}
		}
	};

	this.player_size_HD_small = function() {
		var new_player_size_state = 'player_HD_small';
		if (new_player_size_state === 'player_HD_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1140;
				UIHacks.MinSize.Height  = 730;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(1140, 730);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(526, 686);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(484, 730);
		}
	};

	this.player_size_HD_normal = function() {
		var new_player_size_state = 'player_HD_normal';
		if (new_player_size_state === 'player_HD_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1600;
				UIHacks.MinSize.Height  = 960;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(1600, 960);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(700, 860);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(484, 960);
		}
	};

	this.player_size_HD_large = function() {
		var new_player_size_state = 'player_HD_large';
		if (new_player_size_state === 'player_HD_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1802;
				UIHacks.MinSize.Height  = 1061;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(1802, 1061);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(901, 1062);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(1600, 960);
		}
	};

	this.player_size_QHD_small = function() {
		var new_player_size_state = 'player_QHD_small';
		if (new_player_size_state === 'player_QHD_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1280;
				UIHacks.MinSize.Height  = 800;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(1280, 800);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(640, 800);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(540, 800);
		}
	};

	this.player_size_QHD_normal = function() {
		var new_player_size_state = 'player_QHD_normal';
		if (new_player_size_state === 'player_QHD_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1802;
				UIHacks.MinSize.Height  = 1061;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(1802, 1061);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(901, 1061);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(540, 1061);
		}
	};

	this.player_size_QHD_large = function() {
		var new_player_size_state = 'player_QHD_large';
		if (new_player_size_state === 'player_QHD_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 2100;
				UIHacks.MinSize.Height  = 1300;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(2280, 1300);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(1140, 1300);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(2080, 1300);
		}
	};

	this.player_size_4k_small = function() {
		var new_player_size_state = 'player_4k_small';
		if (new_player_size_state === 'player_4k_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 2300;
				UIHacks.MinSize.Height  = 1470;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(2300, 1470);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(1052, 1372);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(964, 1470);
		}
	};

	this.player_size_4k_normal = function() {
		var new_player_size_state = 'player_4k_normal';
		if (new_player_size_state === 'player_4k_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 2800;
				UIHacks.MinSize.Height  = 1720;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(2800, 1720);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(1400, 1720);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(964, 1720);
		}
	};

	this.player_size_4k_large = function() {
		var new_player_size_state = 'player_4k_large';
		if (new_player_size_state === 'player_4k_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			ui_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				// set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 3400;
				UIHacks.MinSize.Height  = 2020;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout_mode === 'default_mode') {
			set_window_size(3400, 2020);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(1699, 2020);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(2800, 1720);
		}
	};

	this.set_window_size_limits_for_mode = function(layoutmode) {
		var min_w_4k  = 0, max_w_4k  = 0, min_h_4k  = 0, max_h_4k  = 0,
			min_w_QHD = 0, max_w_QHD = 0, min_h_QHD = 0, max_h_QHD = 0,
			min_w_HD  = 0, max_w_HD  = 0, min_h_HD  = 0, max_h_HD  = 0;
		if (layoutmode === 'default_mode') {
			if (is_4k) {
				min_w_4k = 2300;
				min_h_4k = 1470;
			} else if (is_QHD) {
				min_w_QHD = 1280;
				min_h_QHD = 800;
			} else if (!is_4k && !is_QHD) {
				min_w_HD = 1140;
				min_h_HD = 730;
			}
		} else if (layoutmode === 'artwork_mode') {
			if (is_4k) {
				min_w_4k = 1052;
				min_h_4k = 1372;
			} else if (is_QHD) {
				min_w_QHD = 640;
				min_h_QHD = 800;
			} else if (!is_4k && !is_QHD) {
				min_w_HD = 526;
				min_h_HD = 686;
			}
		} else if (layoutmode === 'compact_mode') {
			if (is_4k) {
				min_w_4k = 964;
				min_h_4k = 1470;
			} else if (is_QHD) {
				min_w_QHD = 540;
				min_h_QHD = 800;
			} else if (!is_4k && !is_QHD) {
				min_w_HD = 484;
				min_h_HD = 730;
			}
		}
		set_window_size_limits(min_w_4k, max_w_4k, min_h_4k, max_h_4k, min_w_QHD, max_w_QHD, min_h_QHD, max_h_QHD, min_w_HD, max_w_HD, min_h_HD, max_h_HD);
	};

	this.fix_window_size = function() {

		if (fb_handle) {
			var last_w = fb_handle.Width;
			var last_h = fb_handle.Height;
		} else {
			var was_first_launch = pref.is_first_launch;
		}

		// Setup Georgia-ReBORN theme defaults on first startup or theme reset
		if (pref.is_first_launch) { // TODO: Once SMP has implemented Panel Properties 'Clear' callback, replace it
			// Themes
			pref.theme = 'white';
			pref.whiteTheme = true;
			pref.blackTheme = false;
			pref.rebornTheme = false;
			pref.randomTheme = false;
			pref.blueTheme = false;
			pref.darkblueTheme = false;
			pref.redTheme = false;
			pref.creamTheme = false;
			pref.nblueTheme = false;
			pref.ngreenTheme = false;
			pref.nredTheme = false;
			pref.ngoldTheme = false;
			// Theme style
			pref.themeStyleDefault = true;
			pref.themeStyleBevel = false;
			pref.themeStyleBlend = false;
			pref.themeStyleBlend2 = false;
			pref.themeStyleGradient = false;
			pref.themeStyleGradient2 = false;
			pref.themeStyleAlternative = false;
			pref.themeStyleAlternative2 = false;
			pref.themeStyleBlackAndWhite = false;
			pref.themeStyleBlackAndWhite2 = false;
			pref.themeStyleBlackAndWhiteReborn = false;
			pref.themeStyleBlackReborn = false;
			pref.themeStyleRebornWhite = false;
			pref.themeStyleRebornBlack = false;
			pref.themeStyleRandomPastel = false;
			pref.themeStyleRandomDark = false;
			pref.themeStyleRandomAutoColor = 'off';
			pref.themeStyleTopMenuButtons = 'default';
			pref.themeStyleTransportButtons = 'default';
			pref.themeStyleProgressBarRounded = false;
			pref.themeStyleProgressBar = 'default';
			pref.themeStyleProgressBarFill = 'default';
			pref.themeStyleVolumeBarRounded = false;
			pref.themeStyleVolumeBar = 'default';
			pref.themeStyleVolumeBarFill = 'default';
			// Player size
			pref.playerSize = 'small';
			pref.player_4k_normal = false;
			pref.player_4k_large = false;
			pref.player_QHD_normal = false;
			pref.player_QHD_large = false;
			pref.player_HD_normal = false;
			pref.player_HD_large = false;
			// Layout
			pref.layout_mode = 'default_mode';
			// Brightness
			pref.themeBrightness = 'default';
			// Player controls
			pref.alignAlbumArt = 'right';
			pref.show_coloredGap_albumart = true;
			pref.cycleArt = false;
			pref.cycleArtMWheel = true;
			pref.playlistAutoHideScrollbar = true;
			pref.smoothScrolling = true;
			pref.playlistWheelScrollSteps = 2;
			pref.playlistWheelScrollDuration = 30;
			pref.libraryAutoHideScrollbar = true;
			pref.biographyAutoHideScrollbar = true;
			pref.show_tt = false;
			pref.show_truncatedText_tt = true;
			pref.show_timeline_tooltips = true;
			pref.autoHideVolumeBar = true;
			pref.transport_buttons_size_default = 32;
			pref.transport_buttons_spacing_default = 5;
			pref.transport_buttons_size_artwork = 32;
			pref.transport_buttons_spacing_artwork = 5;
			pref.transport_buttons_size_compact = 32;
			pref.transport_buttons_spacing_compact = 5;
			pref.show_progressBar_default = true;
			pref.show_progressBar_artwork = true;
			pref.show_progressBar_compact = true;
			pref.show_playbackTime_default = true;
			pref.show_playbackTime_artwork = true;
			pref.show_playbackTime_compact = true;
			pref.show_artist_default = true;
			pref.show_artist_artwork = true;
			pref.show_artist_compact = true;
			pref.show_title_default = true;
			pref.show_title_artwork = true;
			pref.show_title_compact = true;
			pref.show_composer = false;
			pref.show_flags_lowerbar = true;
			pref.show_pause = true;
			pref.show_logo = true;
			pref.freq_update = true;
			// Playlist
			pref.autoHidePLM = true;
			pref.showPLM_default = true;
			pref.showPLM_artwork = false;
			pref.showPLM_compact = false;
			pref.showPlaylistFulldate = false;
			pref.hyperlinks_ctrl = false;
			pref.show_weblinks = true;
			pref.show_different_artist = false;
			pref.show_artist_playlistRows = false;
			pref.show_album_playlistRows = false;
			pref.playlistTimeRemaining = false;
			pref.lastFmScrobblesFallback = true;
			pref.startPlaylist = true;
			pref.use_vinyl_nums = true;
			pref.always_showPlayingPl = false;
			pref.playlistRowHover = true;
			// Details
			pref.show_artistInGrid = false;
			pref.show_titleInGrid = false;
			pref.show_flags_details = true;
			pref.no_cdartBG = true;
			pref.labelArtOnBg = false;
			pref.invertedBand = false;
			pref.invertedLabel = false;
			pref.display_cdart = true;
			pref.showDiscArtStub = false;
			pref.noDiscArtStub = true;
			pref.cdArtWhiteStub = false;
			pref.cdArtBlackStub = false;
			pref.cdArtBlankStub = false;
			pref.cdArtTransStub = false;
			pref.cdArtCustomStub = false;
			pref.vinylArtWhiteStub = false;
			pref.vinylArtVoidStub = false;
			pref.vinylArtColdFusionStub = false;
			pref.vinylArtRingOfFireStub = false;
			pref.vinylArtMapleStub = false;
			pref.vinylArtBlackStub = false;
			pref.vinylArtBlackHoleStub = false;
			pref.vinylArtEbonyStub = false;
			pref.vinylArtTransStub = false;
			pref.vinylArtCustomStub = false;
			pref.cdart_ontop = false;
			pref.filterCdJpgsFromAlbumArt = false;
			pref.spinCdart = false;
			pref.spinCdArtImageCount = 60;
			pref.spinCdArtRedrawInterval = 75;
			pref.rotate_cdart = true;
			pref.rotation_amt = 3;
			pref.art_rotate_delay = 30;
			// Library
			pref.libraryDesign = 'reborn';
			pref.libraryLayout = 'normal_width';
			pref.libraryThumbnailSize = 'auto';
			pref.showTrackCount = true;
			pref.libraryPlaylistSwitch = false;
			pref.always_showPlayingLib = false;
			pref.libraryRowHover = true;
			// Biography
			pref.biographyTheme = 0;
			pref.biographyDisplay = 'Image+text';
			// Lyrics
			pref.albumArtLyrics = true;
			pref.lyricsRememberDisplay = false;
			pref.lyrics_normal_color = 'RGBA(255, 255, 255, 255);';
			pref.lyrics_focus_color = 'RGBA(255, 241, 150, 255);';
			pref.displayLyrics = false;
			// Settings
			pref.devTools = false;
			// Misc
			pref.switchPlaybackTime = false;
			pref.playbackOrder = 'Default';
			// Playlist properties
			g_properties.list_left_pad = 0;
			g_properties.list_top_pad = 0;
			g_properties.list_right_pad = 0;
			g_properties.list_bottom_pad = 15;
			g_properties.show_scrollbar = true;
			g_properties.scrollbar_right_pad = 0;
			g_properties.scrollbar_top_pad = 0;
			g_properties.scrollbar_bottom_pad = 3;
			g_properties.scrollbar_w = '';
			g_properties.row_h = 20;
			g_properties.scroll_pos = 0;
			g_properties.wheel_scroll_page = false;
			g_properties.rows_in_header = 4;
			g_properties.rows_in_compact_header = 3;
			g_properties.show_playlist_info = true;
			g_properties.show_header = true;
			g_properties.use_compact_header = g_is_mini_panel;
			g_properties.show_album_art = true;
			g_properties.auto_album_art = false;
			g_properties.show_group_info = true;
			g_properties.show_disc_header = true;
			g_properties.alternate_row_color = false;
			g_properties.show_playcount = g_component_playcount;
			g_properties.show_rating = g_component_playcount && !g_is_mini_panel;
			g_properties.use_rating_from_tags = false;
			g_properties.show_queue_position = true;
			g_properties.auto_collapse = g_is_mini_panel;
			g_properties.collapse_on_playlist_switch = false;
			g_properties.collapse_on_start = false;
			g_properties.playlist_group_data = '';
			g_properties.playlist_custom_group_data = '';
			g_properties.default_group_name = '';
			g_properties.group_presets = '';

			// Init auto resolution check and player size on first launch
			autoDetectRes();
			on_init();
			initTheme();
			pref.is_first_launch = false;
		}

		// Workaround for messed up settings file or properties
		this.set_window_size_limits_for_mode(ui_switch.layout_mode.state);

		if (fb_handle) {
			return last_w !== fb_handle.Width || last_h !== fb_handle.Height;
		} else {
			return was_first_launch;
		}
	};

	var fb_handle = undefined;
}

function set_window_size(width, height) {
	// To avoid resizing bugs, when the window is bigger\smaller than the saved one.
	UIHacks.MinSize.Enabled = false;
	UIHacks.MaxSize.Enabled = false;
	UIHacks.MinSize.Width   = width;
	UIHacks.MinSize.Height  = height;
	UIHacks.MaxSize.Width   = width;
	UIHacks.MaxSize.Height  = height;

	UIHacks.MaxSize.Enabled = true;
	UIHacks.MaxSize.Enabled = false;
	UIHacks.MinSize.Enabled = true;
	UIHacks.MinSize.Enabled = false;

	window.NotifyOthers('layout_mode_state_size', ui_switch.layout_mode.state);
}

function set_window_size_limits(min_w_4k, max_w_4k, min_h_4k, max_h_4k, min_w_QHD, max_w_QHD, min_h_QHD, max_h_QHD, min_w_HD, max_w_HD, min_h_HD, max_h_HD) {
	UIHacks.MinSize.Enabled = !!min_w_4k || !!min_w_QHD || !!min_w_HD;
	UIHacks.MinSize.Width   =   min_w_4k ||   min_w_QHD ||   min_w_HD;

	UIHacks.MaxSize.Enabled = !!max_w_4k || !!max_w_QHD || !!max_w_HD;
	UIHacks.MaxSize.Width   =   max_w_4k ||   max_w_QHD ||   max_w_HD;

	UIHacks.MinSize.Enabled = !!min_h_4k || !!min_h_QHD || !!min_h_HD;
	UIHacks.MinSize.Height  =   min_h_4k ||   min_h_QHD ||   min_h_HD;

	UIHacks.MaxSize.Enabled = !!max_h_4k || !!max_h_QHD || !!max_h_HD;
	UIHacks.MaxSize.Height  =   max_h_4k ||   max_h_QHD ||   max_h_HD;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const countryCodes = {
	'US': 'United States',
	'GB': 'United Kingdom',
	'AU': 'Australia',
	'DE': 'Germany',
	'FR': 'France',
	'SE': 'Sweden',
	'NO': 'Norway',
	'IT': 'Italy',
	'JP': 'Japan',
	'CN': 'China',
	'FI': 'Finland',
	'KR': 'South Korea',
	'RU': 'Russia',
	'IE': 'Ireland',
	'GR': 'Greece',
	'IS': 'Iceland',
	'IN': 'India',
	'AD': 'Andorra',
	'AE': 'United Arab Emirates',
	'AF': 'Afghanistan',
	'AG': 'Antigua and Barbuda',
	'AI': 'Anguilla',
	'AL': 'Albania',
	'AM': 'Armenia',
	'AO': 'Angola',
	'AQ': 'Antarctica',
	'AR': 'Argentina',
	'AS': 'American Samoa',
	'AT': 'Austria',
	'AW': 'Aruba',
	'AX': 'Åland',
	'AZ': 'Azerbaijan',
	'BA': 'Bosnia and Herzegovina',
	'BB': 'Barbados',
	'BD': 'Bangladesh',
	'BE': 'Belgium',
	'BF': 'Burkina Faso',
	'BG': 'Bulgaria',
	'BH': 'Bahrain',
	'BI': 'Burundi',
	'BJ': 'Benin',
	'BL': 'Saint Barthelemy',
	'BM': 'Bermuda',
	'BN': 'Brunei Darussalam',
	'BO': 'Bolivia',
	'BQ': 'Bonaire, Sint Eustatius and Saba',
	'BR': 'Brazil',
	'BS': 'Bahamas',
	'BT': 'Bhutan',
	'BV': 'Bouvet Island',
	'BW': 'Botswana',
	'BY': 'Belarus',
	'BZ': 'Belize',
	'CA': 'Canada',
	'CC': 'Cocos Keeling Islands',
	'CD': 'Democratic Republic of the Congo',
	'CF': 'Central African Republic',
	'CH': 'Switzerland',
	'CI': 'Cote d\'Ivoire',
	'CK': 'Cook Islands',
	'CL': 'Chile',
	'CM': 'Cameroon',
	'CO': 'Colombia',
	'CR': 'Costa Rica',
	'CU': 'Cuba',
	'CV': 'Cape Verde',
	'CX': 'Christmas Island',
	'CY': 'Cyprus',
	'CZ': 'Czech Republic',
	'DJ': 'Djibouti',
	'DK': 'Denmark',
	'DM': 'Dominica',
	'DO': 'Dominican Republic',
	'DZ': 'Algeria',
	'EC': 'Ecuador',
	'EE': 'Estonia',
	'EG': 'Egypt',
	'EH': 'Western Sahara',
	'ER': 'Eritrea',
	'ES': 'Spain',
	'ET': 'Ethiopia',
	'FJ': 'Fiji',
	'FK': 'Falkland Islands',
	'FM': 'Micronesia',
	'FO': 'Faroess',
	'GA': 'Gabon',
	'GD': 'Grenada',
	'GE': 'Georgia',
	'GG': 'Guernsey',
	'GH': 'Ghana',
	'GI': 'Gibraltar',
	'GL': 'Greenland',
	'GM': 'Gambia',
	'GN': 'Guinea',
	'GQ': 'Equatorial Guinea',
	'GS': 'South Georgia and the South Sandwich Islands',
	'GT': 'Guatemala',
	'GU': 'Guam',
	'GW': 'Guinea-Bissau',
	'GY': 'Guyana',
	'HK': 'Hong Kong',
	'HN': 'Honduras',
	'HR': 'Croatia',
	'HT': 'Haiti',
	'HU': 'Hungary',
	'ID': 'Indonesia',
	'IL': 'Israel',
	'IM': 'Isle of Man',
	'IQ': 'Iraq',
	'IR': 'Iran',
	'JE': 'Jersey',
	'JM': 'Jamaica',
	'JO': 'Jordan',
	'KE': 'Kenya',
	'KG': 'Kyrgyzstan',
	'KH': 'Cambodia',
	'KI': 'Kiribati',
	'KM': 'Comoros',
	'KN': 'Saint Kitts and Nevis',
	'KP': 'North Korea',
	'KW': 'Kuwait',
	'KY': 'Cayman Islands',
	'KZ': 'Kazakhstan',
	'LA': 'Laos',
	'LB': 'Lebanon',
	'LC': 'Saint Lucia',
	'LI': 'Liechtenstein',
	'LK': 'Sri Lanka',
	'LR': 'Liberia',
	'LS': 'Lesotho',
	'LT': 'Lithuania',
	'LU': 'Luxembourg',
	'LV': 'Latvia',
	'LY': 'Libya',
	'MA': 'Morocco',
	'MC': 'Monaco',
	'MD': 'Moldova',
	'ME': 'Montenegro',
	'MF': 'Saint Martin',
	'MG': 'Madagascar',
	'MH': 'Marshall Islands',
	'MK': 'Macedonia',
	'ML': 'Mali',
	'MM': 'Myanmar',
	'MN': 'Mongolia',
	'MO': 'Macao',
	'MP': 'Northern Mariana Islands',
	'MQ': 'Martinique',
	'MR': 'Mauritania',
	'MS': 'Montserrat',
	'MT': 'Malta',
	'MU': 'Mauritius',
	'MV': 'Maldives',
	'MW': 'Malawi',
	'MX': 'Mexico',
	'MY': 'Malaysia',
	'MZ': 'Mozambique',
	'NA': 'Namibia',
	'NC': 'New Caledonia',
	'NE': 'Niger',
	'NF': 'Norfolk Island',
	'NG': 'Nigeria',
	'NI': 'Nicaragua',
	'NL': 'Netherlands',
	'NP': 'Nepal',
	'NR': 'Nauru',
	'NU': 'Niue',
	'NZ': 'New Zealand',
	'OM': 'Oman',
	'PA': 'Panama',
	'PE': 'Peru',
	'PF': 'French Polynesia',
	'PG': 'Papua New Guinea',
	'PH': 'Philippines',
	'PK': 'Pakistan',
	'PL': 'Poland',
	'PM': 'Saint Pierre and Miquelon',
	'PN': 'Pitcairn',
	'PR': 'Puerto Rico',
	'PS': 'Palestine',
	'PT': 'Portugal',
	'PW': 'Palau',
	'PY': 'Paraguay',
	'QA': 'Qatar',
	'RE': 'Réunion',
	'RO': 'Romania',
	'RS': 'Serbia',
	'RW': 'Rwanda',
	'SA': 'Saudi Arabia',
	'SB': 'Solomon Islands',
	'SC': 'Seychelles',
	'SD': 'Sudan',
	'SG': 'Singapore',
	'SH': 'Saint Helena',
	'SI': 'Slovenia',
	'SJ': 'Svalbard and Jan Mayen',
	'SK': 'Slovakia',
	'SL': 'Sierra Leone',
	'SM': 'San Marino',
	'SN': 'Senegal',
	'SO': 'Somalia',
	'SR': 'Suriname',
	'SS': 'South Sudan',
	'ST': 'Sao Tome and Principe',
	'SV': 'El Salvador',
	'SX': 'Sint Maarten',
	'SY': 'Syrian Arab Republic',
	'SZ': 'Swaziland',
	'TC': 'Turks and Caicos Islands',
	'TD': 'Chad',
	'TF': 'French Southern Territories',
	'TG': 'Togo',
	'TH': 'Thailand',
	'TJ': 'Tajikistan',
	'TK': 'Tokelau',
	'TL': 'Timor-Leste',
	'TM': 'Turkmenistan',
	'TN': 'Tunisia',
	'TO': 'Tonga',
	'TR': 'Turkey',
	'TT': 'Trinidad and Tobago',
	'TV': 'Tuvalu',
	'TW': 'Taiwan',
	'TZ': 'Tanzania',
	'UA': 'Ukraine',
	'UG': 'Uganda',
	'UY': 'Uruguay',
	'UZ': 'Uzbekistan',
	'VA': 'Vatican City',
	'VC': 'Saint Vincent and the Grenadines',
	'VE': 'Venezuela',
	'VI': 'US Virgin Islands',
	'VN': 'Vietnam',
	'VU': 'Vanuatu',
	'WF': 'Wallis and Futuna',
	'WS': 'Samoa',
	'XE': 'European Union', // Musicbrainz code for European releases. Council of Europe uses same flag as EU.
	'XW': 'United Nations', // Musicbrainz code for all World releases. Uses the UN flag which is the MB standard.
	'YE': 'Yemen',
	'YT': 'Mayotte',
	'ZA': 'South Africa',
	'ZM': 'Zambia',
	'ZW': 'Zimbabwe'
};
function convertIsoCountryCodeToFull(code) {
	if (code.length === 2) {
		return countryCodes[code];
	}
	return code;
}

let DPI = 96;
try {
	DPI = WshShell.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
} catch (e) {
}

class TooltipTimer {
	constructor() {
		this.tooltip_timer = undefined;
		this.tt_caller = undefined;
	}

	start(id, text) {
		var old_caller = this.tt_caller;
		this.tt_caller = id;

		if (!this.tooltip_timer && g_tooltip.Text) {
			this.tt(text, old_caller !== this.tt_caller );
		}
		else {
			if (this.tooltip_timer) {
				this.force_stop(); /// < There can be only one tooltip present at all times, so we can kill the timer w/o any worries
			}

			if (!this.tooltip_timer) {
				this.tooltip_timer = setTimeout(() => {
					this.tt(text);
					this.tooltip_timer = null;
				}, 300);
			}
		}
	}

	stop(id) {
		if (this.tt_caller === id) {// Do not stop other callers
			this.force_stop();
		}
	}

	force_stop() {
		this.tt('');
		if (this.tooltip_timer) {
			clearTimeout(this.tooltip_timer);
			this.tooltip_timer = null;
			this.tt_caller = null;
		}
	}

	/**
	 * Actually displays the tooltip
	 * @param {string} text The text to show in the tooltip
	 * @param {boolean=} force Activate the tooltip whether or not text has changed
	 */
	tt(text, force) {
		if (g_tooltip.Text !== text.toString() || force) {
			g_tooltip.Text = text;
			g_tooltip.Activate();
		}
	};
}

const gTooltipTimer = new TooltipTimer();
class TooltipHandler {
	constructor() {
		this.id = Math.ceil(Math.random() * 10000);
		this.timer = gTooltipTimer;
	}

	/**
	 * Show tooltip after delay (300ms)
	 * @param {string} text
	 */
	showDelayed(text) {
		this.timer.start(this.id, text);
	}

	/**
	 * Show tooltip now
	 * @param {string} text
	 */
	showImmediate(text) {
		this.timer.stop(this.id);
		this.timer.tt(text);
	}

	/**
	 * Clear this tooltip if this handler created it
	 */
	clear() {
		this.timer.stop(this.id);
	}

	/**
	 * Clear tooltip regardless of which handler created it
	 */
	stop() {
		this.timer.force_stop();
	}
}
