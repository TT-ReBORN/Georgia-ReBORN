'use strict';

const MF_STRING = 0x00000000;
const MF_GRAYED = 0x00000001;

const TPM_RIGHTALIGN = 0x0008;
const TPM_BOTTOMALIGN = 0x0020;

const DLGC_WANTALLKEYS = 0x0004;

const DT_LEFT = 0x00000000;
const DT_CENTER = 0x00000001;
const DT_RIGHT = 0x00000002;
const DT_VCENTER = 0x00000004;
const DT_WORDBREAK = 0x00000010;
const DT_CALCRECT = 0x00000400;
const DT_NOPREFIX = 0x00000800;
const DT_END_ELLIPSIS = 0x00008000;

const MK_LBUTTON = 0x0001;
const MK_RBUTTON = 0x0002;
const MK_SHIFT = 0x0004; // The SHIFT key is down.
const MK_CONTROL = 0x0008; // The CTRL key is down.
const MK_MBUTTON = 0x0010;
const MK_XBUTTON1 = 0x0020;
const MK_XBUTTON2 = 0x0040;

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

let g_theme = {};
g_theme.name = 'CaTRoX (QWR Edition)';
g_theme.version = '5.0.0';
g_theme.folder_name = 'CaTRoX';

g_theme.colors = {};
g_theme.colors.pss_back = _RGB(25, 25, 25);
g_theme.colors.panel_back = _RGB(30, 30, 30);
g_theme.colors.panel_front = _RGB(40, 40, 40);
g_theme.colors.panel_line = _RGB(55, 55, 55);
g_theme.colors.panel_line_selected = g_theme.colors.panel_line;
g_theme.colors.panel_text_normal = _RGB(125, 127, 129);

/** @enum{number} */
const g_font_style = {
	regular:     0,
	bold:        1,
	italic:      2,
	bold_italic: 3,
	underline:   4,
	strikeout:   8
};

/** @enum{number} */
const g_playback_order = {
	default:         0,
	repeat_playlist: 1,
	repeat_track:    2,
	random:          3,
	shuffle_tracks:  4,
	shuffle_albums:  5,
	shuffle_folders: 6
};

/** @enum{string|number} */
const g_guifx = {
	name:          'Guifx v2 Transports',
	play:          1,
	pause:         2,
	stop:          3,
	record:        4,
	rewind:        5,
	fast_forward:  6,
	previous:      7,
	next:          8,
	replay:        9,
	refresh:       0,
	mute:          '!',
	mute2:         '@',
	volume_down:   '#',
	volume_up:     '$',
	thumbs_down:   '%',
	thumbs_up:     '^',
	shuffle:       '\&',
	repeat:        '*',
	repeat1:       '(',
	zoom:          ')',
	zoom_out:      '_',
	zoom_in:       '+',
	minus:         '-',
	plus:          '=',
	up:            'W',
	down:          'S',
	left:          'A',
	right:         'D',
	up2:           'w',
	down2:         's',
	left2:         'a',
	right2:        'd',
	start:         '{',
	end:           '}',
	top:           '?',
	bottom:        '/',
	jump_backward: '[',
	jump_forward:  ']',
	slow_backward: ':',
	slow_forward:  '\'',
	eject:         '\'',
	reject:        ';',
	up3:           '.',
	down3:         ',',
	left3:         '<',
	right3:        '>',
	screen_up:     '|',
	screen_down:   '\\',
	guifx:         'g',
	power:         'q',
	checkmark:     'z',
	close:         'x',
	hourglass:     'c',
	heart:         'v',
	star:          'b',
	fire:          'i',
	medical:       'o',
	police:        'p'
};

/** @enum{number} */
const g_album_art_id = {
	front:  0,
	back:   1,
	disc:   2,
	icon:   3,
	artist: 4
};

// #endregion

// #region String formatting

/** @enum{number} */
const StringAlignment = {
	near:   0,
	center: 1,
	far:    2
};

/** @enum{number} */
const StringTrimming = {
	/** Specifies no trimming. */
	none:          0,
	/** Specifies that the text is trimmed to the nearest character. */
	char:          1,
	/** Specifies that text is trimmed to the nearest word. */
	word:          2,
	/** Specifies that the text is trimmed to the nearest character, and an ellipsis is inserted at the end of a trimmed line. */
	ellipsis_char: 3,
	/** Specifies that text is trimmed to the nearest word, and an ellipsis is inserted at the end of a trimmed line. */
	ellipsis_word: 4,
	/** The center is removed from trimmed lines and replaced by an ellipsis. The algorithm keeps as much of the last slash-delimited segment of the line as possible. */
	ellipsis_path: 5
};

/** @enum{number} */
const StringFormatFlags = {
	/**
	 * No flags.
	 */
	none:                    0x00000000,
	/**
	 * Text is displayed from right to left.
	 */
	direction_right_to_left: 0x00000001,
	/**
	 * Text is vertically aligned.
	 */
	direction_vertical:      0x00000002,
	/**
	 * Parts of characters are allowed to overhang the string's layout rectangle.
	 * By default, characters are repositioned to avoid any overhang.
	 */
	fit_black_box:           0x00000004,
	/**
	 * Control characters such as the left-to-right mark are shown in the output with a representative glyph.
	 */
	display_format_control:  0x00000020,
	/**
	 * Fallback to alternate fonts for characters not supported in the requested font is disabled.
	 * Any missing characters are displayed with the fonts missing glyph, usually an open square.
	 */
	no_font_fallback:        0x00000400,
	/**
	 * Includes the trailing space at the end of each line.
	 * By default the boundary rectangle returned by the MeasureString method excludes the space at the end of each line.
	 * Set this flag to include that space in measurement.
	 */
	measure_trailing_spaces: 0x00000800,
	/**
	 * Text wrapping between lines when formatting within a rectangle is disabled.
	 * This flag is implied when a point is passed instead of a rectangle, or when the specified rectangle has a zero line length
	 */
	no_wrap:                 0x00001000,
	/**
	 *  Only entire lines are laid out in the formatting rectangle.
	 *  By default layout continues until the end of the text, or until no more lines are visible as a result of clipping, whichever comes first.
	 *  Note that the default settings allow the last line to be partially obscured by a formatting rectangle that is not a whole multiple of the line height.
	 *  To ensure that only whole lines are seen, specify this value and be careful to provide a formatting rectangle at least as tall as the height of one line.
	 */
	line_limit:              0x00002000,
	/**
	 * Overhanging parts of glyphs, and unwrapped text reaching outside the formatting rectangle are allowed to show.
	 * By default all text and glyph parts reaching outside the formatting rectangle are clipped.
	 */
	no_clip:                 0x00004000
};

/**
 * @param {?StringFormatFlags=} [format_flags=StringFormatFlags.none]
 * @return {StringFormat}
 * @constructor
 */
function StringFormat(format_flags) {
	if (!(this instanceof StringFormat)) {
		return new StringFormat(format_flags);
	}

	/**
	 * Returns StringFormat serialized to integer number suitable for flags argument in {@link IGdiGraphics.DrawString}
	 *
	 * @return {number}
	 */
	this.value = function () {
		return this.alignment << 28 | this.line_alignment << 24 | this.trimming << 20 | this.format_flags;
	};

	/** @type {StringAlignment} */
	this.alignment = StringAlignment.near;
	/** @type {StringAlignment} */
	this.line_alignment = StringAlignment.near;
	/** @type {StringTrimming} */
	this.trimming = StringTrimming.none;
	/** @type {StringFormatFlags} */
	this.format_flags = _.isNil(format_flags) ? StringFormatFlags.none : format_flags;
}

/**
 * {@link StringFormat} object with alignment and line_alignment set to {@link StringAlignment.center}
 *
 * @const
 * @type {StringFormat}
 */
let g_string_format_center = StringFormat();
g_string_format_center.alignment = StringAlignment.center;
g_string_format_center.line_alignment = StringAlignment.center;

// #endregion

// #region Exception types

/**
 * @param {string} msg
 * @return {ThemeError}
 * @constructor
 * @extends {Error}
 */
function ThemeError(msg) {
	if (!(this instanceof ThemeError)) {
		return new ThemeError(msg);
	}

	Error.call(this, '');

	this.name = 'ThemeError';

	let err_msg = '\n';
	err_msg += msg;
	err_msg += '\n';

	this.message = err_msg;
}

ThemeError.prototype = Object.create(Error.prototype);

/**
 * @param {string} msg
 * @return {LogicError}
 * @constructor
 * @extends {Error}
 */
function LogicError(msg) {
	if (!(this instanceof LogicError)) {
		return new LogicError(msg);
	}

	Error.call(this, '');

	this.name = 'LogicError';

	let err_msg = '\n';
	err_msg += msg;
	err_msg += '\n';

	this.message = err_msg;
}

LogicError.prototype = Object.create(Error.prototype);

/**
 * @param {string} arg_name
 * @param {string} arg_type
 * @param {string} valid_type
 * @param {string=} additional_msg
 * @return {TypeError}
 * @constructor
 * @extends {Error}
 * @return {TypeError}
 */
function TypeError(arg_name, arg_type, valid_type, additional_msg) {
	if (!(this instanceof TypeError)) {
		return new TypeError(arg_name, arg_type, valid_type, additional_msg);
	}

	Error.call(this, '');

	this.name = 'TypeError';

	let err_msg = '\n';
	err_msg += '\'' + arg_name + '\' is not a ' + valid_type + ', it\'s a ' + arg_type;
	if (additional_msg) {
		err_msg += '\n' + additional_msg;
	}
	err_msg += '\n';

	this.message = err_msg;
}

TypeError.prototype = Object.create(Error.prototype);

/**
 * @param {string} arg_name
 * @param {*} arg_value
 * @param {string=} additional_msg
 * @return {ArgumentError}
 * @constructor
 * @extends {Error}
 */
function ArgumentError(arg_name, arg_value, additional_msg) {
	if (!(this instanceof ArgumentError)) {
		return new ArgumentError(arg_name, arg_value, additional_msg);
	}

	Error.call(this, '');

	this.name = 'ArgumentError';

	let err_msg = '\n';
	err_msg += '\'' + arg_name + '\' has invalid value: ' + arg_value.toString();
	if (additional_msg) {
		err_msg += '\n' + additional_msg;
	}
	err_msg += '\n';

	this.message = err_msg;
}

ArgumentError.prototype = Object.create(Error.prototype);

/**
 * @param {boolean} predicate
 * @param {T} exception_type
 * @param {...} args
 * @throws {T}
 * @template T
 */
function assert(predicate, exception_type, args) {
	if (!predicate) {
		throw exception_type.apply(null, Array.prototype.slice.call(arguments, 2));
	}
}

// #endregion

let qwr_utils = {
	/**
	 * @return {string}
	 */
	caller:               function () {
		let caller = /^function\s+([^(]+)/.exec(/** @type{string} */ arguments.callee.caller.caller);
		return caller ? caller[1] : '';
	},
	/**
	 * @return {string}
	 */
	function_name:        function () {
		let caller = /^function\s+([^(]+)/.exec(/** @type{string} */ arguments.callee.caller);
		return caller ? caller[1] : '';
	},
	/**
	 * @param{Array<string>} fonts
	 */
	check_fonts:          function (fonts) {
		let msg = '';
		let fail_counter = 0;

		fonts.forEach(function (item) {
			let check = utils.CheckFont(item);
			if (!check) {
				++fail_counter;
			}
			msg += ('\n' + item + (check ? ': Installed.' : ': NOT INSTALLED!'));
		});

		if (fail_counter) {
			msg += '\n\nPlease install missing ' + (fail_counter > 1 ? 'fonts' : 'font') + ' and restart foobar!';
			throw ThemeError(msg);
		}
	},
	/**
	 * @param{string|Array<string>} path_or_paths
	 * @return{string}
	 */
	common_include: function(path_or_paths) {
		if (_.isArray(path_or_paths)) {
			for (let path of path_or_paths) {
				include(path);
			}
		}
		else {
			include(path);
		}
	},
	/**
	 * @param{string} asset_path
	 * @param{?string=} [package_id=null]
	 * @return{string}
	 */
	get_package_asset: function(asset_path, package_id=null) {
		if (!package_id) {
			package_id = window.ScriptInfo.PackageId;
		}
		return `${utils.GetPackageInfo(package_id).Directories.Assets}\\${asset_path}`;
	},
	/**
	 * @param{?string=} [package_id=null]
	 * @return{string}
	 */
	get_package_storage: function(package_id=null) {
		if (!package_id) {
			package_id = window.ScriptInfo.PackageId;
		}
		return `${utils.GetPackageInfo(package_id).Directories.Storage}`;
	},
	/**
	 * @param{string} site
	 * @param{FbMetadbHandle} metadb
	 */
	link:                 function (site, metadb) {
		if (!metadb) {
			return;
		}

		let meta_info = metadb.GetFileInfo();
		let artist = meta_info.MetaValue(meta_info.MetaFind('artist'), 0).replace(/\s+/g, '+').replace(/&/g, '%26');
		let album = meta_info.MetaValue(meta_info.MetaFind('album'), 0).replace(/\s+/g, '+');
		let title = meta_info.MetaValue(meta_info.MetaFind('title'), 0).replace(/\s+/g, '+');

		let search_term = artist ? artist : title;

		switch (site.toLowerCase()) {
			case 'google':
				site = (search_term ? 'https://images.google.com/search?q=' + search_term + '&ie=utf-8' : null);
				break;
			case 'googleimages':
				site = (search_term ? 'https://images.google.com/images?hl=en&q=' + search_term + '&ie=utf-8' : null);
				break;
			case 'wikipedia':
				site = (artist ? 'https://en.wikipedia.org/wiki/' + artist.replace(/\+/g, '_') : null);
				break;
			case 'youtube':
				site = (search_term ? 'https://www.youtube.com/results?search_type=&search_query=' + search_term + '&ie=utf-8' : null);
				break;
			case 'lastfm':
				site = (search_term ? 'https://www.last.fm/music/' + search_term.replace('/', '%252F') : null);
				break;
			case 'discogs':
				site = (search_term || album ? 'https://www.discogs.com/search?q=' + search_term + '+' + album + '&ie=utf-8' : null);
				break;
			default:
				site = '';
		}

		if (!site) {
			return;
		}

		_run(site);
	},
	/**
	 * @constructor
	 */
	MouseMoveSuppress:    function () {
		this.is_supressed = function (x, y, m) {
			if (saved_x === x && saved_y === y && saved_m === m) {
				return true;
			}

			saved_x = x;
			saved_y = y;
			saved_m = m;

			return false;
		};

		let saved_x;
		let saved_y;
		let saved_m;
	},
	/**
	 * @constructor
	 */
	KeyModifiersSuppress: function () {
		this.is_supressed = function (key) {
			if ((VK_SHIFT === key || VK_CONTROL === key || VK_MENU === key) && saved_key === key) {
				return true;
			}

			saved_key = key;

			return false;
		};

		let saved_key;
	},
	/**
	 * @return {string}
	 */
	get_windows_version:  _.once(function () {
		let version = '';
		let ret = _.attempt(function () {
			version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
		});

		if (!_.isError(ret)) {
			return version;
		}

		ret = _.attempt(function () {
			version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
		});

		if (!_.isError(ret)) {
			return version;
		}

		return '6.1';
	})
};

/**
 * @constructor
 */
function KeyActionHandler() {
	/**
	 * @param{string} key
	 * @param{function({ctrl: ?boolean, alt: ?boolean, shift: ?boolean})} action_callback
	 */
	this.register_key_action = function (key, action_callback) {
		if (!action_callback) {
			throw ArgumentError('action_callback', action_callback);
		}

		if (!_.isNil(actions[key])) {
			throw ArgumentError('key', key.toString(), 'This key is already used');
		}

		actions[key] = action_callback;
	};

	/**
	 * @param{string} key
	 * @param{object=} [key_modifiers={}] passed to key action callback
	 * @param{boolean=} [key_modifiers.ctrl=false]
	 * @param{boolean=} [key_modifiers.alt=false]
	 * @param{boolean=} [key_modifiers.shift=false]
	 * @return{boolean} true, if key is registered, false - otherwise
	 */
	this.invoke_key_action = function (key, key_modifiers) {
		let key_action = actions[key];
		if (!actions[key]) {
			return false;
		}

		key_action(key_modifiers ? key_modifiers : {});

		return true;
	};

	/** @type {Object<number, function({ctrl: ?boolean, alt: ?boolean, shift: ?boolean})>} */
	let actions = {};
}

/**
 * @param{string} name
 * @param{*} default_value
 * @constructor
 */
function PanelProperty(name, default_value) {
	/**
	 * @return {*}
	 */
	this.get = function () {
		return value;

	};
	/**
	 * @param {*} new_value
	 */
	this.set = function (new_value) {
		if (value !== new_value) {
			window.SetProperty(this.name, new_value);
			value = new_value;
		}
	};

	/** @const {string} */
	this.name = name;

	/** @type {*} */
	let value = window.GetProperty(this.name, default_value);
}

/**
 * @hideconstructor
 */
let PanelProperties = (function () {
	/**
	 * @constructor
	 */
	function PanelProperties() {
		/**
		 * @param {Object<string, Array<string, *>>} properties Each item in array is an object of the following type { string, [string, any] }
		 */
		this.add_properties = function (properties) {
			_.forEach(properties, function (item, i) {
				validate_property_item(item, i);
				add_property_item(item, i);
			});
		};

		function validate_property_item(item, item_id) {
			if (!_.isArray(item) || item.length !== 2 || !_.isString(item[0])) {
				throw TypeError('property', typeof item, '{ string, [string, any] }', 'Usage: add_properties({\n  property_id: [property_name, property_default_value]\n})');
			}
			if (item_id === 'add_properties') {
				throw ArgumentError('property_id', item_id, 'This id is reserved');
			}
			if (!_.isNil(that[item_id]) || !_.isNil(that[item_id + '_internal'])) {
				throw ArgumentError('property_id', item_id, 'This id is already occupied');
			}
			if (!_.isNil(name_list[item[0]])) {
				throw ArgumentError('property_name', item[0], 'This name is already occupied');
			}
		}

		function add_property_item(item, item_id) {
			name_list[item[0]] = 1;

			that[item_id + '_internal'] = new PanelProperty(item[0], item[1]);

			Object.defineProperty(that, item_id, {
				get: function () {
					return that[item_id + '_internal'].get()
				},
				set: function (new_value) {
					that[item_id + '_internal'].set(new_value)
				}
			});
		}

		let that = this;
		/**
		 * Used for collision checks only
		 *
		 * @type {Object<string, number>}
		 */
		let name_list = {};
	}

	let instance = null;

	return {
		/**
		 * @alias PanelProperties.get_instance
		 * @returns {PanelProperties}
		 */
		get_instance: function () {
			if (!instance) {
				instance = new PanelProperties();
				delete instance.constructor;
			}
			return instance;
		}
	};
})();

let g_properties = PanelProperties.get_instance();

function _alpha_timer(items_arg, hover_predicate_arg) {
	this.start = () => {
		var hover_in_step = 50;
		var hover_out_step = 15;

		if (!alpha_timer_internal) {
			alpha_timer_internal = window.SetInterval(_.bind(function () {
				_.forEach(items, function (item) {
					var saved_alpha = item.hover_alpha;
					if (hover_predicate(item)) {
						item.hover_alpha = Math.min(255, item.hover_alpha += hover_in_step);
					}
					else {
						item.hover_alpha = Math.max(0, item.hover_alpha -= hover_out_step);
					}

					if (saved_alpha !== item.hover_alpha) {
						item.repaint();
					}
				});

				var alpha_in_progress = _.some(items, function (item) {
					return item.hover_alpha > 0 && item.hover_alpha < 255;
				});

				if (!alpha_in_progress) {
					this.stop();
				}
			}, this), 25);
		}
	}

	this.stop = () => {
		if (alpha_timer_internal) {
			window.ClearInterval(alpha_timer_internal);
			alpha_timer_internal = null;
		}
	};

	var alpha_timer_internal = null;
	var items = items_arg;
	var hover_predicate = hover_predicate_arg;
}

function _cc(name) {
	return utils.CheckComponent(name, true);
}

function _isInstanceOf(a, b) {
	return (a instanceof b);
}

function _q(value) {
	return '"' + value + '"';
}

function _RGB(r, g, b) {
	return 0xFF000000 | r << 16 | g << 8 | b;
}

function _RGBA(r, g, b, a) {
	return a << 24 | r << 16 | g << 8 | b;
}

function _run() {
	try {
		WshShell.Run(_.map(arguments, _q).join(' '));
		return true;
	} catch (e) {
		return false;
	}
}
function _runCmd(command, wait, show) {
	try {
		WshShell.Run(command, show ? 1 : 0, !_.isNil(wait) ? wait : false);
		return true;
	} catch (e) {
		return false;
	}
}

function _tf(t, metadb) {
	if (!metadb) {
		return '';
	}
	let tfo = fb.TitleFormat(t);
	return tfo.EvalWithMetadb(metadb);
}

function _tfe(t, force) {
	let tfo = fb.TitleFormat(t);
	return tfo.Eval(force);
}

function _trimArray(array, count, fromStart) {
	if (array.length === count) {
		array.length = 0;
		return;
	}

	/// Length deduction is much faster then _.drop or slice, since it does not create a new array
	if (fromStart) {
		array.reverse();
		array.length -= count;
		array.reverse();
	}
	else {
		array.length -= count;
	}
}

const TextRenderingHint = {
	SystemDefault:            0,
	SingleBitPerPixelGridFit: 1,
	SingleBitPerPixel:        2,
	AntiAliasGridFit:         3,
	AntiAlias:                4,
	ClearTypeGridFit:         5
};

const SmoothingMode = {
	Invalid:     -1,
	Default:     0,
	HighSpeed:   1,
	HighQuality: 2,
	None:        3,
	AntiAlias:   4
};

const InterpolationMode = {
	Invalid:             -1,
	Default:             0,
	LowQuality:          1,
	HighQuality:         2,
	Bilinear:            3,
	Bicubic:             4,
	NearestNeighbor:     5,
	HighQualityBilinear: 6,
	HighQualityBicubic:  7
};

let WshShell = new ActiveXObject('WScript.Shell');
let fso = new ActiveXObject('Scripting.FileSystemObject');
