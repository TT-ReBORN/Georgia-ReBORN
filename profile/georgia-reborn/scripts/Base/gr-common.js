/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Common                                   * //
// * Author:         TT                                                      * //
// * Org. Author:    TheQwertiest                                            * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    15-08-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////
// * ACTIVEX OBJECTS * //
/////////////////////////
/** @global @type {ActiveXObject} */
const app = new ActiveXObject('Shell.Application');
/** @global @type {ActiveXObject} */
const esl = new ActiveXObject('eslyric');
/** @global @type {ActiveXObject} */
const doc = new ActiveXObject('htmlfile');
/** @global @type {ActiveXObject} */
const fso = new ActiveXObject('Scripting.FileSystemObject');
/** @global @type {ActiveXObject} */
const UIHacks = new ActiveXObject('UIHacks');
/** @global @type {ActiveXObject} */
const vb = new ActiveXObject('ScriptControl');
/** @global @type {ActiveXObject} */
const WshShell = new ActiveXObject('WScript.Shell');


////////////////////
// * COMPONENTS * //
////////////////////
/**
 * A set of boolean flags indicating the presence of specific components.
 * Each flag is set based on the result of a check performed at the time of initialization.
 * @global
 * @enum {boolean}
 */
const Component = {
	/** Indicates if the foo_chronflow component or its mod version is installed. */
	ChronFlow: utils.CheckComponent('foo_chronflow') || utils.CheckComponent('foo_chronflow_mod'),
	/** Indicates if the foo_enhanced_playcount component is installed. */
	EnhancedPlaycount: utils.CheckComponent('foo_enhanced_playcount'),
	/** Indicates if the foo_uie_eslyric component is installed. */
	ESLyric: utils.CheckComponent('foo_uie_eslyric'),
	/** Indicates if the foo_vis_vumeter component is installed. */
	VUMeter: utils.CheckComponent('foo_vis_vumeter')
};


///////////////////////
// * COMPATIBILITY * //
///////////////////////
/**
 * A set of boolean flags indicating various environment conditions.
 * @global
 * @enum {boolean}
 */
const Detect = {
	/** Indicates if user has Internet Explorer installed, needed to render HTML popups. */
	IE: DetectIE(),
	/** Indicates if the user's system is running on Windows 64 bit. */
	Win64: DetectWin64(),
	/** Indicates if the user's system is running Wine on Linux or macOS. */
	Wine: DetectWine()
};


///////////////////////
// * CONFIGURATION * //
///////////////////////
/**
 * A set of configuration type settings.
 * @global
 * @enum {string}
 */
const ConfigurationObjectType = {
	Array:  'array',
	Object: 'object',
	Value:  'value' // Not currently handled
};


/////////////////
// * DISPLAY * //
/////////////////
/**
 * A set of display resolution state settings, initially set to false.
 * These states can be modified at runtime to reflect the current display settings.
 * @global
 * @enum {boolean}
 */
const RES = {
	/** 4K resolution state. */
	_4K: false,

	/** Quad HD resolution state. */
	_QHD: false,

	/** High Definition resolution state. */
	_HD: false
};


///////////////////
// * RENDERING * //
///////////////////
/**
 * A set of several different quality type settings for interpolation of image processing when resizing or transforming.
 * Used in SetInterpolationMode().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx.
 * @global
 * @enum {number}
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

/**
 * A set of several different quality type settings for anti-aliasing that is applied to the edges of lines and curves.
 * Used in SetSmoothingMode().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx.
 * @global
 * @enum {number}
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
 * A set of several different quality type settings for text rendering.
 * Used in SetTextRenderingHint().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534404(VS.85).aspx.
 * @global
 * @enum {number}
 */
const TextRenderingHint = {
	SystemDefault: 0,
	SingleBitPerPixelGridFit: 1,
	SingleBitPerPixel: 2,
	AntiAliasGridFit: 3,
	AntiAlias: 4,
	ClearTypeGridFit: 5
};


//////////////////
// * GRAPHICS * //
//////////////////
/**
 * A set of foobar's album art ID settings used to identify which album art image to load.
 * @global
 * @enum {number}
 */
const AlbumArtId = {
	front: 0,
	back: 1,
	disc: 2,
	icon: 3,
	artist: 4
};

/**
 * A set of different text alignment and formatting settings.
 * @global
 * @enum {number}
 */
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

/**
 * A set of text formatting settings used in gr.DrawString() or gr.GdiDrawText().
 * @global
 * @enum {number}
 */
const Stringformat = {
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

/**
 * A set of font style settings used when creating font objects.
 * @global
 * @enum {number}
 */
const FontStyle = {
	regular: 0,
	bold: 1,
	italic: 2,
	bold_italic: 3,
	underline: 4,
	strikeout: 8
};

/**
 * A set of font mapping settings for the 'Guifx v2 Transports' font used for button symbols.
 * @global
 * @enum {string|number}
 */
const Guifx = {
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


///////////////////////
// * FILE SETTINGS * //
///////////////////////
/**
 * A set of file attribute settings that specifies the attributes of a file, used with utils.Glob().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx.
 * @global
 * @enum {number}
 */
const FileAttributes = {
	ReadOnly: 0x00000001,
	Hidden: 0x00000002,
	System: 0x00000004,
	Directory: 0x00000010,
	Archive: 0x00000020,
	// Device: 0x00000040, // ! Do Not Use
	Normal: 0x00000080,
	Temporary: 0x00000100,
	SparseFile: 0x00000200,
	ReparsePoint: 0x00000400,
	Compressed: 0x00000800,
	Offline: 0x00001000,
	NotContentIndexed: 0x00002000,
	Encrypted: 0x00004000
	// Virtual: 0x00010000; // ! Do not use
};

/**
 * A set of file mode settings that specifies how the operating system should open a file.
 * @global
 * @enum {number}
 */
const FileMode = {
	Read: 1,
	Write: 2,
	Append: 3
};

/**
 * A set of file type settings that specifies the file format.
 * @global
 * @enum {number}
 */
const FileType = {
	SystemDefault: -2,
	Unicode: -1,
	Ascii: 0
};


////////////////
// * STATES * //
////////////////
/**
 * A set of all button state settings.
 * @global
 * @enum {number}
 */
const ButtonState = {
	Default: 0,
	Hovered: 1,
	Down:    2,
	Enabled: 3
};

/**
 * A set of all hyperlink state settings.
 * @global
 * @enum {number}
 */
const HyperlinkStates = {
	Normal: 0,
	Hovered: 1
};

/**
 * A set of all available foobar playback order state settings.
 * @global
 * @enum {number}
 */
const PlaybackOrder = {
	Default: 0,
	RepeatPlaylist: 1,
	RepeatTrack: 2,
	Random: 3,
	ShuffleTracks: 4,
	ShuffleAlbums: 5,
	ShuffleFolders: 6
};


/////////////////
// * UIHACKS * //
/////////////////
/**
 * A set of UIHacks main menu state settings.
 * @global
 * @enum {number}
 */
const MainMenuState = {
	Show: 0,
	Hide: 1,
	Auto: 2
};

/**
 * A set of UIHacks window state settings.
 * @global
 * @enum {number}
 */
const WindowState = {
	Normal:    0,
	Minimized: 1,
	Maximized: 2
};

/**
 * A set of UIHacks frame style settings, see foobar's Preferences > Display > Main Window > Frame style.
 * @global
 * @enum {number}
 */
const FrameStyle = {
	Default: 0,
	SmallCaption: 1,
	NoCaption: 2,
	NoBorder: 3
};

/**
 * A set of UIHacks move style settings, see foobar's Preferences > Display > Main Window > Move with.
 * @global
 * @enum {number}
 */
const MoveStyle = {
	Default: 0,
	Middle: 1,
	Left: 2,
	Both: 3
};


///////////////////////
// * COUNTRY CODES * //
///////////////////////
/**
 * A set of country codes that maps two digit country codes to full names, mostly used for displaying flag images via tags.
 * @global
 * @enum {string}
 */
const CountryCodes = {
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
}


///////////////////
// * MENU FLAG * //
///////////////////
/**
 * A set of menu item enums.
 * @typedef  {object} MenuFlag
 * @property {number} Disabled - The menu item is disabled.
 * @property {number} Grayed - The menu item is grayed out.
 * @property {number} Popup - The menu item is a popup menu item.
 * @property {number} String - The menu item is a string.
 */
/** @global @type {MenuFlag} */
const MenuFlag = {
	Disabled: 0x00000002,
	Grayed: 0x00000001,
	Popup: 0x00000010,
	String: 0x00000000
};


///////////////////
// * MOUSE KEY * //
///////////////////
/**
 * A set of mouse key enums.
 * @typedef  {object} MouseKey
 * @property {number} Control - The CTRL key is down.
 * @property {number} LButton - The left mouse button is down.
 * @property {number} MButton - The middle mouse button is down.
 * @property {number} RButton - The right mouse button is down.
 * @property {number} Shift - The SHIFT key is down.
 * @property {number} XButton1 - The first X button is down.
 * @property {number} XButton2 - The second X button is down.
 */
/** @global @type {MouseKey} */
const MouseKey = {
	Control: 0x0008,
	LButton: 0x0001,
	MButton: 0x0010,
	RButton: 0x0002,
	Shift: 0x0004,
	XButton1: 0x0020,
	XButton2: 0x0040
};


//////////////////////
// * MOUSE CURSOR * //
//////////////////////
/**
 * A set of mouse cursor symbol enums.
 * @typedef  {object} Cursor
 * @property {number} AppStarting - The standard arrow cursor with a small hourglass to indicate the application is starting.
 * @property {number} Arrow - The standard arrow cursor.
 * @property {number} Cross - The crosshair cursor.
 * @property {number} Hand - The pointing hand cursor.
 * @property {number} Help - The arrow cursor with a question mark to indicate help.
 * @property {number} Hide - The cursor will be hidden.
 * @property {number} IBeam - The text insertion cursor (I-beam).
 * @property {number} Icon - The application icon cursor.
 * @property {number} No - The slashed circle cursor indicating "no".
 * @property {number} Size - The double-headed horizontal arrow cursor.
 * @property {number} SizeAll - The four-headed arrow cursor (North/South/East/West).
 * @property {number} SizeWE - The double-headed horizontal arrow cursor (West/East).
 * @property {number} SizeNESW - The double-headed diagonal arrow cursor (Northeast/Southwest).
 * @property {number} SizeNWSE - The double-headed diagonal arrow cursor (Northwest/Southeast).
 * @property {number} SizeNS - The double-headed vertical arrow cursor (North/South).
 * @property {number} UpArrow - The up arrow cursor.
 * @property {number} Wait - The wait/busy cursor.
 */
/** @global @type {Cursor} */
const Cursor = {
	AppStarting: 32650,
	Arrow: 32512,
	Cross: 32515,
	Hand: 32649,
	Help: 32651,
	Hide: -1,
	IBeam: 32513,
	Icon: 32641,
	No: 32648,
	Size: 32640,
	SizeAll: 32646,
	SizeWE: 32644,
	SizeNESW: 32643,
	SizeNWSE: 32642,
	SizeNS: 32645,
	UpArrow: 32516,
	Wait: 32514
};


///////////////////////////
// * VIRTUAL KEY CODES * //
///////////////////////////
/**
 * A set of virtual key codes.
 * @typedef  {object} VKey
 * @property {number} LBUTTON - The left mouse button.
 * @property {number} RBUTTON - The right mouse button.
 * @property {number} CANCEL - The control-break processing.
 * @property {number} MBUTTON - The middle mouse button (three-button mouse).
 * @property {number} XBUTTON1 - The X1 mouse button.
 * @property {number} XBUTTON2 - The X2 mouse button.
 * @property {number} COPY - The Copy command.
 * @property {number} CUT - The Cut command.
 * @property {number} PASTE - The Paste command.
 * @property {number} SELECT_ALL - The Select All command.
 * @property {number} BACK - The BACKSPACE key.
 * @property {number} TAB - The TAB key.
 * @property {number} CLEAR - The CLEAR key.
 * @property {number} RETURN - The ENTER key.
 * @property {number} SHIFT - The SHIFT key.
 * @property {number} CONTROL - The CTRL key.
 * @property {number} MENU - The ALT key.
 * @property {number} PAUSE - The PAUSE key.
 * @property {number} CAPITAL - The CAPS LOCK key.
 * @property {number} KANA - The IME Kana mode.
 * @property {number} HANGUEL - The IME Hanguel mode (maintained for compatibility; use HANGUL).
 * @property {number} HANGUL - The IME Hangul mode.
 * @property {number} IME_ON - The IME On.
 * @property {number} JUNJA - The IME Junja mode.
 * @property {number} FINAL - The IME final mode.
 * @property {number} HANJA - The IME Hanja mode.
 * @property {number} KANJI - The IME Kanji mode.
 * @property {number} IME_OFF - The IME Off.
 * @property {number} ESCAPE - The ESC key.
 * @property {number} CONVERT - The IME convert.
 * @property {number} NONCONVERT - The IME nonconvert.
 * @property {number} ACCEPT - The IME accept.
 * @property {number} MODECHANGE - The IME mode change request.
 * @property {number} SPACE - The SPACEBAR key.
 * @property {number} PRIOR - The PAGE UP key.
 * @property {number} NEXT - The PAGE DOWN key.
 * @property {number} END - The END key.
 * @property {number} HOME - The HOME key.
 * @property {number} LEFT - The LEFT ARROW key.
 * @property {number} UP - The UP ARROW key.
 * @property {number} RIGHT - The RIGHT ARROW key.
 * @property {number} DOWN - The DOWN ARROW key.
 * @property {number} SELECT - The SELECT key.
 * @property {number} PRINT - The PRINT key.
 * @property {number} EXECUTE - The EXECUTE key.
 * @property {number} SNAPSHOT - The PRINT SCREEN key.
 * @property {number} INSERT - The INS key.
 * @property {number} DELETE - The DEL key.
 * @property {number} HELP - The HELP key.
 * @property {number} KEY_0 - The 0 key.
 * @property {number} KEY_1 - The 1 key.
 * @property {number} KEY_2 - The 2 key.
 * @property {number} KEY_3 - The 3 key.
 * @property {number} KEY_4 - The 4 key.
 * @property {number} KEY_5 - The 5 key.
 * @property {number} KEY_6 - The 6 key.
 * @property {number} KEY_7 - The 7 key.
 * @property {number} KEY_8 - The 8 key.
 * @property {number} KEY_9 - The 9 key.
 * @property {number} KEY_A - The A key.
 * @property {number} KEY_B - The B key.
 * @property {number} KEY_C - The C key.
 * @property {number} KEY_D - The D key.
 * @property {number} KEY_E - The E key.
 * @property {number} KEY_F - The F key.
 * @property {number} KEY_G - The G key.
 * @property {number} KEY_H - The H key.
 * @property {number} KEY_I - The I key.
 * @property {number} KEY_J - The J key.
 * @property {number} KEY_K - The K key.
 * @property {number} KEY_L - The L key.
 * @property {number} KEY_M - The M key.
 * @property {number} KEY_N - The N key.
 * @property {number} KEY_O - The O key.
 * @property {number} KEY_P - The P key.
 * @property {number} KEY_Q - The Q key.
 * @property {number} KEY_R - The R key.
 * @property {number} KEY_S - The S key.
 * @property {number} KEY_T - The T key.
 * @property {number} KEY_U - The U key.
 * @property {number} KEY_V - The V key.
 * @property {number} KEY_W - The W key.
 * @property {number} KEY_X - The X key.
 * @property {number} KEY_Y - The Y key.
 * @property {number} KEY_Z - The Z key.
 * @property {number} LWIN - The left Windows key (Natural keyboard).
 * @property {number} RWIN - The right Windows key (Natural keyboard).
 * @property {number} APPS - The applications key (Natural keyboard).
 * @property {number} SLEEP - The computer sleep key.
 * @property {number} NUMPAD0 - The numeric keypad 0 key.
 * @property {number} NUMPAD1 - The numeric keypad 1 key.
 * @property {number} NUMPAD2 - The numeric keypad 2 key.
 * @property {number} NUMPAD3 - The numeric keypad 3 key.
 * @property {number} NUMPAD4 - The numeric keypad 4 key.
 * @property {number} NUMPAD5 - The numeric keypad 5 key.
 * @property {number} NUMPAD6 - The numeric keypad 6 key.
 * @property {number} NUMPAD7 - The numeric keypad 7 key.
 * @property {number} NUMPAD8 - The numeric keypad 8 key.
 * @property {number} NUMPAD9 - The numeric keypad 9 key.
 * @property {number} MULTIPLY - The MULTIPLY key.
 * @property {number} ADD - The ADD key.
 * @property {number} SEPARATOR - The Separator key.
 * @property {number} SUBTRACT - The Subtract key.
 * @property {number} DECIMAL - The Decimal key.
 * @property {number} DIVIDE - The Divide key.
 * @property {number} F1 - The F1 key.
 * @property {number} F2 - The F2 key.
 * @property {number} F3 - The F3 key.
 * @property {number} F4 - The F4 key.
 * @property {number} F5 - The F5 key.
 * @property {number} F6 - The F6 key.
 * @property {number} F7 - The F7 key.
 * @property {number} F8 - The F8 key.
 * @property {number} F9 - The F9 key.
 * @property {number} F10 - The F10 key.
 * @property {number} F11 - The F11 key.
 * @property {number} F12 - The F12 key.
 * @property {number} F13 - The F13 key.
 * @property {number} F14 - The F14 key.
 * @property {number} F15 - The F15 key.
 * @property {number} F16 - The F16 key.
 * @property {number} F17 - The F17 key.
 * @property {number} F18 - The F18 key.
 * @property {number} F19 - The F19 key.
 * @property {number} F20 - The F20 key.
 * @property {number} F21 - The F21 key.
 * @property {number} F22 - The F22 key.
 * @property {number} F23 - The F23 key.
 * @property {number} F24 - The F24 key.
 * @property {number} NUMLOCK - The NUM LOCK key.
 * @property {number} SCROLL - The SCROLL LOCK key.
 * @property {number} LSHIFT - The Left SHIFT key.
 * @property {number} RSHIFT - The Right SHIFT key.
 * @property {number} LCONTROL - The Left CONTROL key.
 * @property {number} RCONTROL - The Right CONTROL key.
 * @property {number} LMENU - The Left ALT key.
 * @property {number} RMENU - The Right ALT key.
 * @property {number} BROWSER_BACK - The Browser Back key.
 * @property {number} BROWSER_FORWARD - The Browser Forward key.
 * @property {number} BROWSER_REFRESH - The Browser Refresh key.
 * @property {number} BROWSER_STOP - The Browser Stop key.
 * @property {number} BROWSER_SEARCH - The Browser Search key.
 * @property {number} BROWSER_FAVORITES - The Browser Favorites key.
 * @property {number} BROWSER_HOME - The Browser Start and Home key.
 * @property {number} VOLUME_MUTE - The Volume Mute key.
 * @property {number} VOLUME_DOWN - The Volume Down key.
 * @property {number} VOLUME_UP - The Volume Up key.
 * @property {number} MEDIA_NEXT_TRACK - The Next Track key.
 * @property {number} MEDIA_PREV_TRACK - The Previous Track key.
 * @property {number} MEDIA_STOP - The Stop Media key.
 * @property {number} MEDIA_PLAY_PAUSE - The Play/Pause Media key.
 * @property {number} LAUNCH_MAIL - The Start Mail key.
 * @property {number} LAUNCH_MEDIA_SELECT - The Select Media key.
 * @property {number} LAUNCH_APP1 - The Start Application 1 key.
 * @property {number} LAUNCH_APP2 - The Start Application 2 key.
 * @property {number} OEM_1 - The ';:' key for the US standard keyboard.
 * @property {number} OEM_PLUS - The '+' key for any country/region.
 * @property {number} OEM_COMMA - The ',' key for any country/region.
 * @property {number} OEM_MINUS - The '-' key for any country/region.
 * @property {number} OEM_PERIOD - The '.' key for any country/region.
 * @property {number} OEM_2 - The '/?' key for the US standard keyboard.
 * @property {number} OEM_3 - The '`~' key for the US standard keyboard.
 * @property {number} OEM_4 - The '[{' key for the US standard keyboard.
 * @property {number} OEM_5 - The '\|' key for the US standard keyboard.
 * @property {number} OEM_6 - The ']}' key for the US standard keyboard.
 * @property {number} OEM_7 - The 'single-quote/double-quote' key for the US standard keyboard.
 * @property {number} OEM_8 - The Miscellaneous characters key.
 * @property {number} OEM_102 - The '<>' or '\\|' key for the US standard or non-US 102-key keyboard.
 * @property {number} PROCESSKEY - The IME PROCESS key.
 * @property {number} PACKET - The Packet key for passing Unicode characters as if they were keystrokes.
 * @property {number} ATTN - The Attn key.
 * @property {number} CRSEL - The CrSel key.
 * @property {number} EXSEL - The ExSel key.
 * @property {number} EREOF - The Erase EOF key.
 * @property {number} PLAY - The Play key.
 * @property {number} ZOOM - The Zoom key.
 * @property {number} NONAME - Reserved.
 * @property {number} PA1 - The PA1 key.
 * @property {number} OEM_CLEAR - The Clear key.
 */
/** @global @type {VKey} */
const VKey = {
	LBUTTON:    0x01,
	RBUTTON:    0x02,
	CANCEL:     0x03,
	MBUTTON:    0x04,
	XBUTTON1:   0x05,
	XBUTTON2:   0x06,

	COPY:       0x03,
	CUT:        0x18,
	PASTE:      0x16,
	SELECT_ALL: 0x01,

	BACK:       0x08,
	TAB:        0x09,
	CLEAR:      0x0C,
	RETURN:     0x0D,
	SHIFT:      0x10,
	CONTROL:    0x11,
	MENU:       0x12,
	PAUSE:      0x13,
	CAPITAL:    0x14,
	KANA:       0x15,
	HANGUEL:    0x15, // Maintained for compatibility
	HANGUL:     0x15,
	IME_ON:     0x16,
	JUNJA:      0x17,
	FINAL:      0x18,
	HANJA:      0x19,
	KANJI:      0x19,
	IME_OFF:    0x1A,
	ESCAPE:     0x1B,
	CONVERT:    0x1C,
	NONCONVERT: 0x1D,
	ACCEPT:     0x1E,
	MODECHANGE: 0x1F,
	SPACE:      0x20,
	PRIOR:      0x21,
	NEXT:       0x22,
	END:        0x23,
	HOME:       0x24,
	LEFT:       0x25,
	UP:         0x26,
	RIGHT:      0x27,
	DOWN:       0x28,
	SELECT:     0x29,
	PRINT:      0x2A,
	EXECUTE:    0x2B,
	SNAPSHOT:   0x2C,
	INSERT:     0x2D,
	DELETE:     0x2E,
	HELP:       0x2F,

	KEY_0:      0x30,
	KEY_1:      0x31,
	KEY_2:      0x32,
	KEY_3:      0x33,
	KEY_4:      0x34,
	KEY_5:      0x35,
	KEY_6:      0x36,
	KEY_7:      0x37,
	KEY_8:      0x38,
	KEY_9:      0x39,

	KEY_A:      0x41,
	KEY_B:      0x42,
	KEY_C:      0x43,
	KEY_D:      0x44,
	KEY_E:      0x45,
	KEY_F:      0x46,
	KEY_G:      0x47,
	KEY_H:      0x48,
	KEY_I:      0x49,
	KEY_J:      0x4A,
	KEY_K:      0x4B,
	KEY_L:      0x4C,
	KEY_M:      0x4D,
	KEY_N:      0x4E,
	KEY_O:      0x4F,
	KEY_P:      0x50,
	KEY_Q:      0x51,
	KEY_R:      0x52,
	KEY_S:      0x53,
	KEY_T:      0x54,
	KEY_U:      0x55,
	KEY_V:      0x56,
	KEY_W:      0x57,
	KEY_X:      0x58,
	KEY_Y:      0x59,
	KEY_Z:      0x5A,

	LWIN:       0x5B,
	RWIN:       0x5C,
	APPS:       0x5D,
	SLEEP:      0x5F,

	NUMPAD0:    0x60,
	NUMPAD1:    0x61,
	NUMPAD2:    0x62,
	NUMPAD3:    0x63,
	NUMPAD4:    0x64,
	NUMPAD5:    0x65,
	NUMPAD6:    0x66,
	NUMPAD7:    0x67,
	NUMPAD8:    0x68,
	NUMPAD9:    0x69,

	MULTIPLY:   0x6A,
	ADD:        0x6B,
	SEPARATOR:  0x6C,
	SUBTRACT:   0x6D,
	DECIMAL:    0x6E,
	DIVIDE:     0x6F,

	F1:        0x70,
	F2:        0x71,
	F3:        0x72,
	F4:        0x73,
	F5:        0x74,
	F6:        0x75,
	F7:        0x76,
	F8:        0x77,
	F9:        0x78,
	F10:       0x79,
	F11:       0x7A,
	F12:       0x7B,
	F13:       0x7C,
	F14:       0x7D,
	F15:       0x7E,
	F16:       0x7F,
	F17:       0x80,
	F18:       0x81,
	F19:       0x82,
	F20:       0x83,
	F21:       0x84,
	F22:       0x85,
	F23:       0x86,
	F24:       0x87,

	NUMLOCK:   0x90,
	SCROLL:    0x91,
	LSHIFT:    0xA0,
	RSHIFT:    0xA1,
	LCONTROL:  0xA2,
	RCONTROL:  0xA3,
	LMENU:     0xA4,
	RMENU:     0xA5,

	BROWSER_BACK: 0xA6,
	BROWSER_FORWARD: 0xA7,
	BROWSER_REFRESH: 0xA8,
	BROWSER_STOP: 0xA9,
	BROWSER_SEARCH: 0xAA,
	BROWSER_FAVORITES: 0xAB,
	BROWSER_HOME: 0xAC,

	VOLUME_MUTE: 0xAD,
	VOLUME_DOWN: 0xAE,
	VOLUME_UP: 0xAF,

	MEDIA_NEXT_TRACK: 0xB0,
	MEDIA_PREV_TRACK: 0xB1,
	MEDIA_STOP: 0xB2,
	MEDIA_PLAY_PAUSE: 0xB3,

	LAUNCH_MAIL: 0xB4,
	LAUNCH_MEDIA_SELECT: 0xB5,
	LAUNCH_APP1: 0xB6,
	LAUNCH_APP2: 0xB7,

	OEM_1: 0xBA,
	OEM_PLUS: 0xBB,
	OEM_COMMA: 0xBC,
	OEM_MINUS: 0xBD,
	OEM_PERIOD: 0xBE,
	OEM_2: 0xBF,
	OEM_3: 0xC0,
	OEM_4: 0xDB,
	OEM_5: 0xDC,
	OEM_6: 0xDD,
	OEM_7: 0xDE,
	OEM_8: 0xDF,
	OEM_102: 0xE2,
	PROCESSKEY: 0xE5,
	PACKET: 0xE7,
	ATTN: 0xF6,
	CRSEL: 0xF7,
	EXSEL: 0xF8,
	EREOF: 0xF9,
	PLAY: 0xFA,
	ZOOM: 0xFB,
	NONAME: 0xFC,
	PA1: 0xFD,
	OEM_CLEAR: 0xFE

	/************************/
	// 0x0A-0B // Reserved
	// 0x0E-0F // Undefined
	// 0x3A-40 // Undefined
	// 0x5E    // Reserved
	// 0x88-8F // Unassigned
	// 0x92-96 // OEM specific
	// 0x97-9F // Unassigned
	// 0xB8-B9 // Reserved
	// 0xC1-D7 // Reserved
	// 0xD8-DA // Unassigned
	// 0xE0    // Reserved
	// 0xE1    // OEM specific
	// 0xE3-E4 // OEM specific
	// 0xE6    // OEM specific
	// 0xE8    // Unassigned
	// 0xE9-F5 // OEM specific
	/************************/
};


///////////////
// * ERROR * //
///////////////
/**
 * A class that handles theme errors with detailed messages.
 * @augments {Error}
 */
class ThemeError extends Error {
	/**
	 * Creates the `ThemeError` instance.
	 * @param {string} msg - The error message.
	 */
	constructor(msg) {
		super(msg);
		/** @private @type {string} */
		this.name = 'ThemeError';
		/** @private @type {string} */
		this.message = `\n${msg}\n`;
	}
}


/**
 * A class that handles logic errors with detailed messages.
 * @augments {Error}
 */
class LogicError extends Error {
	/**
	 * Creates the `LogicError` instance.
	 * @param {string} msg - The error message.
	 */
	constructor(msg) {
		super(msg);
		/** @private @type {string} */
		this.name = 'LogicError';
		/** @private @type {string} */
		this.message = `\n${msg}\n`;
	}
}


/**
 * A class that handles invalid type errors with detailed messages.
 * @augments {Error}
 */
class InvalidTypeError extends Error {
	/**
	 * Creates the `InvalidTypeError` instance.
	 * @param {string} arg_name - The name of the argument that caused the error.
	 * @param {string} arg_type - The actual type of the argument that was passed.
	 * @param {string} valid_type - The expected type of the argument.
	 * @param {string} [additional_msg] - An optional message to provide more information about the error.
	 */
	constructor(arg_name, arg_type, valid_type, additional_msg = '') {
		super('');
		/** @private @type {string} */
		this.name = 'InvalidTypeError';
		/** @private @type {string} */
		this.message = `\n'${arg_name}' is not a ${valid_type}, it's a ${arg_type}${additional_msg ? `\n${additional_msg}` : ''}\n`;
	}
}


/**
 * A class that handles argument errors with detailed messages.
 * @augments {Error}
 */
class ArgumentError extends Error {
	/**
	 * Creates the `ArgumentError` instance.
	 * @param {string} arg_name - The name of the argument that has an invalid value.
	 * @param {*} arg_value - The value of the argument that is considered invalid.
	 * @param {string} [additional_msg] - An optional message to provide more information about the error.
	 */
	constructor(arg_name, arg_value, additional_msg = '') {
		super('');
		/** @private @type {string} */
		this.name = 'ArgumentError';
		/** @private @type {string} */
		this.message = `\n'${arg_name}' has invalid value: ${arg_value}${additional_msg ? `\n${additional_msg}` : ''}\n`;
	}
}


///////////////////
// * UTILITIES * //
///////////////////
/**
 * A class that provides a collection of utilities for various operations.
 * @type {object}
 */
class Utilities {
	/**
	 * Creates the `Utilities` instance.
	 * Initializes default values for saved coordinates and modifier keys.
	 */
	constructor() {
		/** @private @type {number} */
		this.savedX = 0;
		/** @private @type {number} */
		this.savedY = 0;
		/** @private @type {number} */
		this.savedM = 0;
		/** @private @type {number} */
		this.savedKey = 0;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Disables window resizing if certain conditions are met via UIHacks.
	 * @param {number} m - The mouse mask.
	 */
	disableSizing(m) {
		try {
			if (m && UIHacks && UIHacks.FrameStyle === 3 && !UIHacks.DisableSizing) {
				UIHacks.DisableSizing = true;
			}
		}
		catch (e) {
			console.log(e);
		}
	}

	/**
	 * Enables window resizing if certain conditions are met via UIHacks.
	 * @param {number} m - The mouse mask.
	 */
	enableSizing(m) {
		try {
			if (UIHacks && UIHacks.FrameStyle === 3 && UIHacks.DisableSizing) {
				UIHacks.DisableSizing = false;
			}
		}
		catch (e) {
			console.log(e);
		}
	}

	/**
	 * Gets the major and minor version of Windows operating system from the registry.
	 * Falls back to a default version if registry read is unsuccessful.
	 * @returns {string} The Windows version in 'major.minor' format or a default if not obtainable.
	 */
	getWindowsVersion() {
		return Once(() => {
			let version = '';
			let ret = Attempt(() => {
				version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
				version += '.';
				version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
			});

			if (!IsError(ret)) {
				return version;
			}

			ret = Attempt(() => {
				version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
			});

			if (!IsError(ret)) {
				return version;
			}

			return '6.1';
		});
	}

	/**
	 * Constructs a search URL for a specified website using available track metadata.
	 * @param {string} website - The name of the website to generate a search URL for.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 */
	link(website, metadb) {
		if (!metadb) return;

		const metaInfo = metadb.GetFileInfo();
		const artist = metaInfo.MetaValue(metaInfo.MetaFind('artist'), 0).replace(/\s+/g, '+').replace(/&/g, '%26');
		const album = metaInfo.MetaValue(metaInfo.MetaFind('album'), 0).replace(/\s+/g, '+');
		const title = metaInfo.MetaValue(metaInfo.MetaFind('title'), 0).replace(/\s+/g, '+');
		const searchQuery = artist || title;

		const replacePlaceholders = (link) => link
			.replace('{artist}', artist)
			.replace('{title}', title)
			.replace('{album}', album);

		const urls = {
			google: searchQuery ? `https://google.com/search?q=${searchQuery}` : null,
			googleImages: searchQuery ? `https://images.google.com/images?hl=en&q=${searchQuery}` : null,
			wikipedia: artist ? `https://en.wikipedia.org/wiki/${artist.replace(/\+/g, '_')}` : null,
			youTube: searchQuery ? `https://www.youtube.com/results?search_type=&search_query=${searchQuery}` : null,
			lastfm: searchQuery ? `https://www.last.fm/music/${searchQuery.replace('/', '%252F')}` : null,
			allMusic: searchQuery ? `https://www.allmusic.com/search/all/${searchQuery}` : null,
			discogs: searchQuery || album ? `https://www.discogs.com/search?q=${searchQuery}+${album}` : null,
			musicBrainz: searchQuery || album ? `https://musicbrainz.org/taglookup/index?tag-lookup.artist=${searchQuery}&tag-lookup.release=${album}` : null,
			bandcamp: searchQuery || album ? `https://bandcamp.com/search?q=${searchQuery}&item_type` : null,
			default: 'https://github.com/TT-ReBORN/Georgia-ReBORN'
		};

		// Add custom URLs to the urls object
		grCfg.customWebsiteLinks.forEach((link) => {
			const domain = this.extractDomainName(link);
			urls[domain] = replacePlaceholders(link);
		});

		website = urls[website] || urls.default;

		RunCmd(website);
	}

	/**
	 * Extracts the domain name from a given URL and formats it.
	 * @param {string} url - The URL from which to extract the domain name.
	 * @returns {string} The formatted domain name.
	 */
	extractDomainName(url) {
		const domain = url.match(/:\/\/(www\.)?([^/]+)/)[2];
		return domain.charAt(0).toUpperCase() + domain.slice(1).replace(/\.[^/.]+$/, '');
	}

	/**
	 * Generates labels and values for predefined and custom website links.
	 * @param {Array} customWebsiteLinks - Array of custom website URLs.
	 * @returns {object} - Object containing combined labels and values.
	 */
	generateWebsiteLinks(customWebsiteLinks) {
		const customLabels = customWebsiteLinks.map((url) => this.extractDomainName(url));
		const customValues = customWebsiteLinks.map((url) => this.extractDomainName(url));

		const labels = ['Google', 'Google Images', 'Wikipedia', 'YouTube', 'Last.fm', 'AllMusic', 'Discogs', 'MusicBrainz', 'Bandcamp'];
		const values = ['google', 'googleImages', 'wikipedia', 'youTube', 'lastfm', 'allMusic', 'discogs', 'musicBrainz', 'bandcamp'];

		const websiteLabels = labels.concat(customLabels);
		const websiteValues = values.concat(customValues);

		return { websiteLabels, websiteValues };
	}

	/**
	 * Opens a website based on the provided site name or opens all predefined websites.
	 * @param {string} website - The name of the website to open.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 * @param {boolean} openAll - Whether to open all predefined websites.
	 */
	openWebsite(website, metadb, openAll) {
		const websites = [
			'google',
			'googleImages',
			'wikipedia',
			'youTube',
			'lastfm',
			'allMusic',
			'discogs',
			'musicBrainz',
			'bandcamp'
		];

		if (openAll) {
			for (const site of websites) {
				this.link(site, metadb);
			}
		} else {
			this.link(website, metadb);
		}
	}

	/**
	 * Prepares an HTML file by replacing the CSS file reference with a new CSS file based on the Windows version.
	 * @param {string} path - The file path of the HTML file that needs to be prepared.
	 * @returns {string} The modified HTML content with the updated CSS file reference.
	 */
	prepareHTML(path) {
		const htmlCode = utils.ReadTextFile(path);
		const newCss = grm.utils.getWindowsVersion() === '6.1' ? 'styles7.css' : 'styles10.css';
		const cssPath = `${fb.FoobarPath}georgia-reborn\\scripts\\playlist\\assets\\html\\${newCss}`;

		return htmlCode.replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	/**
	 * Sets the mouse cursor appearance based on position and application state.
	 * @param {number} x - The current x-coordinate of the mouse.
	 * @param {number} y - The current y-coordinate of the mouse.
	 */
	setMouseCursor(x, y) {
		if (!mouseInLibrarySearch(x, y)) {
			SetCursor('Arrow');
		}

		if (grCfg.settings.hideCursor && fb.IsPlaying) {
			grm.ui.clearTimer('hideCursor');
			grm.ui.hideCursorTimeout = setTimeout(() => {
				// * If there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
				if (!grm.ui.activeMenu && fb.IsPlaying) {
					SetCursor('Hide');
				}
			}, 10000);
		}
	}

	/**
	 * Suppresses key events for SHIFT, CONTROL, and MENU keys if they are triggered in quick succession.
	 * @param {number} key - The keycode of the key to potentially suppress.
	 * @returns {boolean} Whether the key event should be suppressed.
	 */
	suppressKey(key) {
		if ((VKey.SHIFT === key || VKey.CONTROL === key || VKey.MENU === key) && this.savedKey === key) {
			return true;
		}

		this.savedKey = key;
		return false;
	}

	/**
	 * Suppresses mouse movement events if the current position and modifier keys are the same as the last.
	 * @param {number} x - The current x-coordinate of the mouse.
	 * @param {number} y - The current y-coordinate of the mouse.
	 * @param {number} m - The current mouse mask.
	 * @returns {boolean} Whether the mouse move event should be suppressed.
	 */
	suppressMouseMove(x, y, m) {
		if (this.savedX === x && this.savedY === y && this.savedM === m) {
			return true;
		}

		this.savedX = x;
		this.savedY = y;
		this.savedM = m;
		return false;
	}
	// #endregion
}
