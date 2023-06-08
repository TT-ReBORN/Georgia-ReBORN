/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Common                               * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2022-03-24                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * RENDERING * //
///////////////////
/**
 * Used in SetTextRenderingHint()
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534404(VS.85).aspx
 */
const TextRenderingHint = {
	SystemDefault: 0,
	SingleBitPerPixelGridFit: 1,
	SingleBitPerPixel: 2,
	AntiAliasGridFit: 3,
	AntiAlias: 4,
	ClearTypeGridFit: 5
};

/**
 * Used in SetSmoothingMode()
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx
 */
const SmoothingMode = {
	Invalid: -1,
	Default: 0,
	HighSpeed: 1,
	HighQuality: 2,
	None: 3,
	AntiAlias: 4
};

/**
 * Used in SetInterpolationMode()
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx
 */
const InterpolationMode = {
	Invalid: -1,
	Default: 0,
	LowQuality: 1,
	HighQuality: 2,
	Bilinear: 3,
	Bicubic: 4,
	NearestNeighbor: 5,
	HighQualityBilinear: 6,
	HighQualityBicubic: 7  // Highest quality
};


///////////////////////
// * FILE SETTINGS * //
///////////////////////
/** @enum{number} */
const FileMode = {
	Read: 1,
	Write: 2,
	Append: 3
};

/** @enum{number} */
const FileType = {
	SystemDefault: -2,
	Unicode: -1,
	Ascii: 0
};

/** @enum{number} */
const FileAttributes = {
	// Used with utils.Glob()
	// For more information, see: http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx
	ReadOnly: 0x00000001,
	Hidden: 0x00000002,
	System: 0x00000004,
	Directory: 0x00000010,
	Archive: 0x00000020,
	// Device:           0x00000040, // Do Not Use
	Normal: 0x00000080,
	Temporary: 0x00000100,
	SparseFile: 0x00000200,
	ReparsePoint: 0x00000400,
	Compressed: 0x00000800,
	Offline: 0x00001000,
	NotContentIndexed: 0x00002000,
	Encrypted: 0x00004000
	// Virtual:          0x00010000; // Do not use
};


////////////////
// * STATES * //
////////////////
/** @enum{number} */
const PlaybackOrder = {
	Default: 0,
	RepeatPlaylist: 1,
	RepeatTrack: 2,
	Random: 3,
	ShuffleTracks: 4,
	ShuffleAlbums: 5,
	ShuffleFolders: 6
};


///////////////////////
// * STRING FORMAT * //
///////////////////////
/** @enum{number} */
const g_string_format = {
	h_align_near: 0x00000000,
	h_align_center: 0x10000000,
	h_align_far: 0x20000000,

	v_align_near: 0x00000000,
	v_align_center: 0x01000000,
	v_align_far: 0x02000000,

	align_center: 0x11000000,

	trim_none: 0x00000000,
	trim_char: 0x00100000,
	trim_word: 0x00200000,
	trim_ellipsis_char: 0x00300000,
	trim_ellipsis_word: 0x00400000,
	trim_ellipsis_path: 0x00500000,

	dir_right_to_Left: 0x00000001,
	dir_vertical: 0x00000002,
	no_fit_black_box: 0x00000004,
	display_format_control: 0x00000020,
	no_font_fallback: 0x00000400,
	measure_trailing_spaces: 0x00000800,
	no_wrap: 0x00001000,
	line_limit: 0x00002000,
	no_clip: 0x00004000
};


//////////////////
// * GRAPHICS * //
//////////////////
/** @enum{number} */
const g_font_style = {
	regular: 0,
	bold: 1,
	italic: 2,
	bold_italic: 3,
	underline: 4,
	strikeout: 8
};

/** @enum{number} */
const DrawText = {
	Left: 0x00000000,
	Center: 0x00000001,
	Right: 0x00000002,
	VCenter: 0x00000004,
	SingleLine: 0x00000020,
	CalcRect: 0x00000400,
	NoPrefix: 0x00000800,
	EndEllipsis: 0x00008000,
	WordEllipsis: 0x00040000
};

/** @enum{string|number} */
const g_guifx = {
	name: 'Guifx v2 Transports',
	play: 1,
	pause: 2,
	stop: 3,
	record: 4,
	rewind: 5,
	fast_forward: 6,
	previous: 7,
	next: 8,
	replay: 9,
	refresh: 0,
	mute: '!',
	mute2: '@',
	volume_down: '#',
	volume_up: '$',
	thumbs_down: '%',
	thumbs_up: '^',
	shuffle: '&',
	repeat: '*',
	repeat1: '(',
	zoom: ')',
	zoom_out: '_',
	zoom_in: '+',
	minus: '-',
	plus: '=',
	up: 'W',
	down: 'S',
	left: 'A',
	right: 'D',
	up2: 'w',
	down2: 's',
	left2: 'a',
	right2: 'd',
	start: '{',
	end: '}',
	top: '?',
	bottom: '/',
	jump_backward: '[',
	jump_forward: ']',
	slow_backward: ':',
	slow_forward: '\'',
	eject: '\'',
	reject: ';',
	up3: '.',
	down3: ',',
	left3: '<',
	right3: '>',
	screen_up: '|',
	screen_down: '\\',
	guifx: 'g',
	power: 'q',
	checkmark: 'z',
	close: 'x',
	hourglass: 'c',
	heart: 'v',
	star: 'b',
	fire: 'i',
	medical: 'o',
	police: 'p'
};

/** @enum{number} */
const g_album_art_id = {
	front: 0,
	back: 1,
	disc: 2,
	icon: 3,
	artist: 4
};


/////////////////
// * UIHACKS * //
/////////////////
const MainMenuState = {
	Show: 0,
	Hide: 1,
	Auto: 2
};

const FrameStyle = {
	Default: 0,
	SmallCaption: 1,
	NoCaption: 2,
	NoBorder: 3
};

const MoveStyle = {
	Default: 0,
	Middle: 1,
	Left: 2,
	Both: 3
};


///////////////////
// * MENU ITEM * //
///////////////////
const MF_STRING   = 0x00000000;
const MF_GRAYED   = 0x00000001;
const MF_DISABLED = 0x00000002;
const MF_POPUP    = 0x00000010;


////////////////////
// * MOUSE MASK * //
////////////////////
const MK_LBUTTON = 0x0001;
const MK_RBUTTON = 0x0002;
const MK_SHIFT = 0x0004; // The SHIFT key is down.
const MK_CONTROL = 0x0008; // The CTRL key is down.
const MK_MBUTTON = 0x0010;
const MK_XBUTTON1 = 0x0020;
const MK_XBUTTON2 = 0x0040;


//////////////////////
// * MOUSE CURSOR * //
//////////////////////
const IDC_ARROW = 32512;
const IDC_IBEAM = 32513;
const IDC_WAIT = 32514;
const IDC_CROSS = 32515;
const IDC_UPARROW = 32516;
const IDC_SIZE = 32640;
const IDC_ICON = 32641;
const IDC_SIZENWSE = 32642;
const IDC_SIZENESW = 32643;
const IDC_SIZEWE = 32644;
const IDC_SIZENS = 32645;
const IDC_SIZEALL = 32646;
const IDC_NO = 32648;
const IDC_APPSTARTING = 32650;
const IDC_HAND = 32649;
const IDC_HELP = 32651;


///////////////////////////
// * VIRTUAL KEY CODES * //
///////////////////////////
const VK_BACKSPACE = 0x08;
const VK_SHIFT = 0x10;
const VK_CONTROL = 0x11;
const VK_MENU = 0x12; // ALT
const VK_PAUSE = 0x13;
const VK_ESCAPE = 0x1B;
const VK_SPACE = 0x20;
const VK_DELETE = 0x2E;
const VK_PRIOR = 0x21; // PAGE UP key
const VK_NEXT = 0x22; // PAGE DOWN key
const VK_END = 0x23;
const VK_HOME = 0x24;
const VK_LEFT = 0x25;
const VK_UP = 0x26;
const VK_RIGHT = 0x27;
const VK_DOWN = 0x28;
const VK_RETURN = 0x0D; // Enter
const VK_LSHIFT = 0xA0; // Left SHIFT key
const VK_RSHIFT = 0xA1; // Right SHIFT key
const VK_LCONTROL = 0xA2; // Left CONTROL key
const VK_RCONTROL = 0xA3; // Right CONTROL key
const VK_LMENU = 0xA4; // Left MENU key (Left Alt)
const VK_RMENU = 0xA5; // Right MENU key (Right Alt)
const VK_SELECT_ALL = 0x01;
const VK_COPY = 0x03;
const VK_ENTER = 0x0D;
const VK_PASTE = 0x16;
const VK_CUT = 0x18;

const VK_KEY_0 = 0x30; //	0
const VK_KEY_1 = 0x31; //	1
const VK_KEY_2 = 0x32; //	2
const VK_KEY_3 = 0x33; //	3
const VK_KEY_4 = 0x34; //	4
const VK_KEY_5 = 0x35; //	5
const VK_KEY_6 = 0x36; //	6
const VK_KEY_7 = 0x37; //	7
const VK_KEY_8 = 0x38; //	8
const VK_KEY_9 = 0x39; //	9
const VK_KEY_A = 0x41; //	A
const VK_KEY_B = 0x42; //	B
const VK_KEY_C = 0x43; //	C
const VK_KEY_D = 0x44; //	D
const VK_KEY_E = 0x45; //	E
const VK_KEY_F = 0x46; //	F
const VK_KEY_G = 0x47; //	G
const VK_KEY_H = 0x48; //	H
const VK_KEY_I = 0x49; //	I
const VK_KEY_J = 0x4A; //	J
const VK_KEY_K = 0x4B; //	K
const VK_KEY_L = 0x4C; //	L
const VK_KEY_M = 0x4D; //	M
const VK_KEY_N = 0x4E; //	N
const VK_KEY_O = 0x4F; //	O
const VK_KEY_P = 0x50; //	P
const VK_KEY_Q = 0x51; //	Q
const VK_KEY_R = 0x52; //	R
const VK_KEY_S = 0x53; //	S
const VK_KEY_T = 0x54; //	T
const VK_KEY_U = 0x55; //	U
const VK_KEY_V = 0x56; //	V
const VK_KEY_W = 0x57; //	W
const VK_KEY_X = 0x58; //	X
const VK_KEY_Y = 0x59; //	Y
const VK_KEY_Z = 0x5A; //	Z

const VK_F1 = 0x70; // F1
const VK_F10 = 0x79; // F10
const VK_F11 = 0x7A; // F11
const VK_F12 = 0x7B; // F12
const VK_F13 = 0x7C; // F13
const VK_F14 = 0x7D; // F14
const VK_F15 = 0x7E; // F15
const VK_F16 = 0x7F; // F16
const VK_F17 = 0x80; // F17
const VK_F18 = 0x81; // F18
const VK_F19 = 0x82; // F19
const VK_F2 = 0x71; // F2
const VK_F20 = 0x83; // F20
const VK_F21 = 0x84; // F21
const VK_F22 = 0x85; // F22
const VK_F23 = 0x86; // F23
const VK_F24 = 0x87; // F24
const VK_F3 = 0x72; // F3
const VK_F4 = 0x73; // F4
const VK_F5 = 0x74; // F5
const VK_F6 = 0x75; // F6
const VK_F7 = 0x76; // F7
const VK_F8 = 0x77; // F8
const VK_F9 = 0x78; // F9


////////////////////////////////////
// * LODASH NATIVE REPLACEMENTS * //
////////////////////////////////////
const attempt = (func, ...args) => {
	try {
		return func(...args);
	} catch (e) {
		return e;
	}
};


const clamp = (num, min, max) => {
	num = num <= max ? num : max;
	return num >= min ? num : min;
};


const difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));

const debounce = (func, delay, { leading } = {}) => {
	let timerId;

	return (...args) => {
		if (!timerId && leading) {
		func(...args)
		}
		clearTimeout(timerId)

		timerId = setTimeout(() => func(...args), delay)
	}
}


const findKey = (obj, predicate = (o) => o) => Object.keys(obj).find((key) => predicate(obj[key], key, obj));

const isEmpty = (obj) => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

const isError = (err) => err instanceof Error;

const isString = (str) => {
	if (str != null && typeof str.valueOf() === 'string') {
		return true;
	}
	return false;
};


const isObject = (a) => a instanceof Object;

const last = (arr) => arr[arr.length - 1];

const once = (fn) => {
	let called = false;
	let result;
	return (...args) => {
		if (!called) {
			result = fn(...args);
			called = true;
		}
		return result;
	};
};


const range = (start, end, increment) => {
	const isEndDef = typeof end !== 'undefined';
	end = isEndDef ? end : start;
	start = isEndDef ? start : 0;

	if (typeof increment === 'undefined') {
		increment = Math.sign(end - start);
	}

	const length = Math.abs((end - start) / (increment || 1));

	const { result } = Array.from({ length }).reduce(
		({ result, current }) => ({
			result: [...result, current],
			current: current + increment
		}),
		{ current: start, result: [] }
	);
	return result;
};


const throttle = (func, timeFrame) => {
	let lastTime = 0;
	return (...args) => {
		const now = new Date();
		if (now - lastTime >= timeFrame) {
			func(...args);
			lastTime = now;
		}
	};
};


const _throttle = (fn, delay, immediate = false, parent = this) => {
	let timerId;
	return (...args) => {
		const boundFunc = fn.bind(parent, ...args);
		if (timerId) {
			return;
		}
		if (immediate && !timerId) {
			boundFunc();
		}
		timerId = setTimeout(() => {
			if (!immediate) {
				boundFunc();
			}
			timerId = null;
		}, delay);
	};
};


const trimArray = (array, count, fromHead) => {
	/// Length deduction is much faster then _.drop or slice, since it does not create a new array
	if (fromHead) {
		array.reverse();
		array.length -= count;
		array.reverse();
	}
	else {
		array.length -= count;
	}
};


const union = (arr, ...args) => [...new Set(arr.concat(...args))];

const zip = (arr, ...args) => arr.map((value, idx) => [value, ...args.map((arr) => arr[idx])]);


///////////////////////
// * ERROR HANDLER * //
///////////////////////
/**
 * @param {string} msg
 * @constructor
 * @extends {Error}
 * @return {ThemeError}
 */
class ThemeError extends Error {
	constructor(msg) {
		super(msg);

		this.name = 'ThemeError';

		let err_msg = '\n';
		err_msg += msg;
		err_msg += '\n';

		this.message = err_msg;
	}
}


/**
 * @param {string} msg
 * @constructor
 * @extends {Error}
 */
class LogicError extends Error {
	constructor (msg) {
		super(msg);

		this.name = 'LogicError';

		let err_msg = '\n';
		err_msg += msg;
		err_msg += '\n';

		this.message = err_msg;
	}
}


/**
 * @param {string} arg_name
 * @param {string} arg_type
 * @param {string} valid_type
 * @param {string=} additional_msg
 * @constructor
 * @extends {Error}
 */
class InvalidTypeError extends Error {
	constructor (arg_name, arg_type, valid_type, additional_msg) {
		super('');

		this.name = 'InvalidTypeError';

		let err_msg = '\n';
		err_msg += `'${arg_name}' is not a ${valid_type}, it's a ${arg_type}`;
		if (additional_msg) {
			err_msg += `\n${additional_msg}`;
		}
		err_msg += '\n';

		this.message = err_msg;
	}
}


/**
 * @param {string} arg_name
 * @param {*} arg_value
 * @param {string=} additional_msg
 * @constructor
 * @extends {Error}
 */
class ArgumentError extends Error {
	constructor (arg_name, arg_value, additional_msg) {
		super('');

		this.name = 'ArgumentError';

		let err_msg = '\n';
		err_msg += `'${arg_name}' has invalid value: ${arg_value.toString()}`;
		if (additional_msg) {
			err_msg += `\n${additional_msg}`;
		}
		err_msg += '\n';

		this.message = err_msg;
	}
}


/**
 * @param {boolean} predicate
 * @param {Function} exception_type
 * @param {...*} args
 * @throws {T}
 * @template T
 */
function assert(predicate, exception_type, args) {
	if (!predicate) {
		throw exception_type(...Array.prototype.slice.call(arguments, 2));
	}
}


/////////////////////////
// * UTILITY HANDLER * //
/////////////////////////
const qwr_utils = {
	EnableSizing(m) {
		try {
			if (UIHacks && UIHacks.FrameStyle === 3 && UIHacks.DisableSizing) {
				UIHacks.DisableSizing = false;
			}
		}
		catch (e) {
			console.log(e);
		}
	},
	DisableSizing(m) {
		try {
			if (m && UIHacks && UIHacks.FrameStyle === 3 && !UIHacks.DisableSizing) {
				UIHacks.DisableSizing = true;
			}
		}
		catch (e) {
			console.log(e);
		}
	},
	/**
	 * @param{string} site
	 * @param{FbMetadbHandle} metadb
	 */
	link(site, metadb) {
		if (!metadb) {
			return;
		}

		const meta_info = metadb.GetFileInfo();
		const artist = meta_info.MetaValue(meta_info.MetaFind('artist'), 0).replace(/\s+/g, '+').replace(/&/g, '%26');
		const album = meta_info.MetaValue(meta_info.MetaFind('album'), 0).replace(/\s+/g, '+');
		const title = meta_info.MetaValue(meta_info.MetaFind('title'), 0).replace(/\s+/g, '+');

		const search_term = artist || title;

		switch (site.toLowerCase()) {
			case 'google':
				site = (search_term ? `http://images.google.com/search?q=${search_term}&ie=utf-8` : null);
				break;
			case 'googleimages':
				site = (search_term ? `http://images.google.com/images?hl=en&q=${search_term}&ie=utf-8` : null);
				break;
			case 'wikipedia':
				site = (artist ? `http://en.wikipedia.org/wiki/${artist.replace(/\+/g, '_')}` : null);
				break;
			case 'youtube':
				site = (search_term ? `http://www.youtube.com/results?search_type=&search_query=${search_term}&ie=utf-8` : null);
				break;
			case 'lastfm':
				site = (search_term ? `http://www.last.fm/music/${search_term.replace('/', '%252F')}` : null);
				break;
			case 'discogs':
				site = (search_term || album ? `http://www.discogs.com/search?q=${search_term}+${album}&ie=utf-8` : null);
				break;
			default:
				site = '';
		}

		if (!site) {
			return;
		}

		runCmd(site);
	},
	MouseMoveSuppress: function () {
		let saved_x;
		let saved_y;
		let saved_m;

		this.is_supressed = (x, y, m) => {
			if (saved_x === x && saved_y === y && saved_m === m) {
				return true;
			}

			saved_x = x;
			saved_y = y;
			saved_m = m;

			return false;
		};
	},
	/**
	 * @param{string} path
	 * @return{string}
	 */
	prepare_html_file(path) {
		const html_code = utils.ReadTextFile(path);

		const new_css = (qwr_utils.get_windows_version() === '6.1') ? 'styles7.css' : 'styles10.css';
		const css_path = `${fb.FoobarPath}${g_pl_colors.script_folder}html\\${new_css}`;

		return html_code.replace(/href="styles10.css"/i, `href="${css_path}"`);
	},
	KeyModifiersSuppress: function () {
		let saved_key;

		this.is_supressed = (key) => {
			if ((VK_SHIFT === key || VK_CONTROL === key || VK_MENU === key) && saved_key === key) {
				return true;
			}

			saved_key = key;

			return false;
		};
	},
	/**
	 * @return {string}
	 */
	get_windows_version: once(() => {
		let version = '';
		let ret = attempt(() => {
			version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
		});

		if (!isError(ret)) {
			return version;
		}

		ret = attempt(() => {
			version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
		});

		if (!isError(ret)) {
			return version;
		}

		return '6.1';
	})
};


/////////////////////////
// * KEYBOARD EVENTS * //
/////////////////////////
/**
 * @constructor
 */
function KeyActionHandler() {
	const actions = {};

	/**
	 * @param {string|number} key
	 * @param {function} action_callback
	 */
	this.register_key_action = (key, action_callback) => {
		if (!action_callback) {
			throw new ArgumentError('action_callback', action_callback);
		}

		if (actions[key]) {
			throw new ArgumentError('key', key.toString(), 'This key is already used');
		}

		actions[key] = action_callback;
	};

	/**
	 * @param {string} key
	 * @param {object} [key_modifiers={}] passed to key action callback
	 * @param {boolean=} [key_modifiers.ctrl=false]
	 * @param {boolean=} [key_modifiers.alt=false]
	 * @param {boolean=} [key_modifiers.shift=false]
	 * @return {boolean} true, if key is registered, false - otherwise
	 */
	this.invoke_key_action = (key, key_modifiers) => {
		const key_action = actions[key];
		if (!actions[key]) {
			return false;
		}

		key_action(key_modifiers || {});

		return true;
	};
}


//////////////////////////
// * PANEL PROPERTIES * //
//////////////////////////
/**
 * @param {string} name
 * @param {*} default_value
 * @constructor
 */
function PanelProperty(name, default_value) {
	/** @const {string} */
	this.name = name;

	/** @type {*} */
	let value = window.GetProperty(this.name, default_value);

	/**
	 * @return {*}
	 */
	this.get = () => value;
	/**
	 * @param {*} new_value
	 */
	this.set = function (new_value) {
		if (value !== new_value) {
			window.SetProperty(this.name, new_value);
			value = new_value;
		}
	};
}


const properties_name_list = {}; // Used for collision checks only, shared between objects

class PanelProperties {
	/**
	 * @param {Object<string, [string, *]>} properties Each item in array is an object of the following type { string, [string, any] }
	 */
	add_properties(properties) {
		Object.keys(properties).forEach(key => {
			this.validate_property_item(properties[key], key);
			this.add_property_item(properties[key], key);
		});
	}

	validate_property_item(item, item_id) {
		if (!Array.isArray(item) || item.length !== 2 || !isString(item[0])) {
			throw new InvalidTypeError('property', typeof item, '{ string, [string, any] }', 'Usage: add_properties({\n  property_id: [property_name, property_default_value]\n})');
		}
		if (item_id === 'add_properties') {
			throw new ArgumentError('property_id', item_id, 'This id is reserved');
		}
		if (this[item_id] || this[item_id + '_internal']) {
			throw new ArgumentError('property_id', item_id, 'This id is already occupied');
		}
		if (properties_name_list[item[0]]) {
			throw new ArgumentError('property_name', item[0], 'This name is already occupied');
		}
	}

	add_property_item(item, item_id) {
		properties_name_list[item[0]] = 1;

		this[item_id + '_internal'] = new PanelProperty(item[0], item[1]);

		Object.defineProperty(this, item_id, {
			get() {
				return this[item_id + '_internal'].get();
			},
			set(new_value) {
				this[item_id + '_internal'].set(new_value);
			}
		});
	}
}


/** @type {*} */
const g_properties = new PanelProperties();
const g_script_list = ['Common.js'];
