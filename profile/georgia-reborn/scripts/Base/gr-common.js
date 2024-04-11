/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Common                                   * //
// * Author:         TT                                                      * //
// * Org. Author:    TheQwertiest                                            * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    12-04-2024                                              * //
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
// * MENU ITEM * //
///////////////////
/**
 * The menu item is disabled.
 * @type {number}
 * @global
 */
const MF_DISABLED = 0x00000002;

/**
 * The menu item is grayed out.
 * @type {number}
 * @global
 */
const MF_GRAYED = 0x00000001;

/**
 * The menu item is a popup menu item.
 * @type {number}
 * @global
 */
const MF_POPUP = 0x00000010;

/**
 * The menu item is a string.
 * @type {number}
 * @global
 */
const MF_STRING = 0x00000000;


////////////////////
// * MOUSE MASK * //
////////////////////
/**
 * The CTRL key is down.
 * @type {number}
 * @global
 */
const MK_CONTROL = 0x0008;

/**
 * The left mouse button is down.
 * @type {number}
 * @global
 */
const MK_LBUTTON = 0x0001;

/**
 * The middle mouse button is down.
 * @type {number}
 * @global
 */
const MK_MBUTTON = 0x0010;

/**
 * The right mouse button is down.
 * @type {number}
 * @global
 */
const MK_RBUTTON = 0x0002;

/**
 * The SHIFT key is down.
 * @type {number}
 * @global
 */
const MK_SHIFT = 0x0004;

/**
 * The first X button is down.
 * @type {number}
 * @global
 */
const MK_XBUTTON1 = 0x0020;

/**
 * The second X button is down.
 * @type {number}
 * @global
 */
const MK_XBUTTON2 = 0x0040;


//////////////////////
// * MOUSE CURSOR * //
//////////////////////
/**
 * The standard arrow cursor with small hourglass to indicate application is starting.
 * @type {number}
 * @global
 */
const IDC_APPSTARTING = 32650;

/**
 * The standard arrow cursor.
 * @type {number}
 * @global
 */
const IDC_ARROW = 32512;

/**
 * The crosshair cursor.
 * @type {number}
 * @global
 */
const IDC_CROSS = 32515;

/**
 * The pointing hand cursor.
 * @type {number}
 * @global
 */
const IDC_HAND = 32649;

/**
 * The arrow cursor with a question mark to indicate help.
 * @type {number}
 * @global
 */
const IDC_HELP = 32651;

/**
 * The text insertion cursor (I-beam).
 * @type {number}
 * @global
 */
const IDC_IBEAM = 32513;

/**
 * The application icon cursor.
 * @type {number}
 * @global
 */
const IDC_ICON = 32641;

/**
 * The slashed circle cursor indicating "no".
 * @type {number}
 * @global
 */
const IDC_NO = 32648;

/**
 * The double-headed horizontal arrow cursor.
 * @type {number}
 * @global
 */
const IDC_SIZE = 32640;

/**
 * The four-headed arrow cursor (North/South/East/West).
 * @type {number}
 * @global
 */
const IDC_SIZEALL = 32646;

/**
 * The double-headed horizontal arrow cursor (West/East).
 * @type {number}
 * @global
 */
const IDC_SIZEWE = 32644;

/**
 * The double-headed diagonal arrow cursor (Northeast/Southwest).
 * @type {number}
 * @global
 */
const IDC_SIZENESW = 32643;

/**
 * The double-headed diagonal arrow cursor (Northwest/Southeast).
 * @type {number}
 * @global
 */
const IDC_SIZENWSE = 32642;

/**
 * The double-headed vertical arrow cursor (North/South).
 * @type {number}
 * @global
 */
const IDC_SIZENS = 32645;

/**
 * The up arrow cursor.
 * @type {number}
 * @global
 */
const IDC_UPARROW = 32516;

/**
 * The wait/busy cursor.
 * @type {number}
 * @global
 */
const IDC_WAIT = 32514;


///////////////////////////
// * VIRTUAL KEY CODES * //
///////////////////////////
const VK_LBUTTON    = 0x01; // Left mouse button
const VK_RBUTTON    = 0x02; // Right mouse button
const VK_CANCEL     = 0x03; // Control-break processing
const VK_MBUTTON    = 0x04; // Middle mouse button (three-button mouse)
const VK_XBUTTON1   = 0x05; // X1 mouse button
const VK_XBUTTON2   = 0x06; // X2 mouse button

const VK_COPY       = 0x03; // Copy command
const VK_CUT        = 0x18; // Cut command
const VK_PASTE      = 0x16; // Paste command
const VK_SELECT_ALL = 0x01; // Select All command

const VK_BACK       = 0x08; // BACKSPACE key
const VK_TAB        = 0x09; // TAB key
const VK_CLEAR      = 0x0C; // CLEAR key
const VK_RETURN     = 0x0D; // ENTER key
const VK_SHIFT      = 0x10; // SHIFT key
const VK_CONTROL    = 0x11; // CTRL key
const VK_MENU       = 0x12; // ALT key
const VK_PAUSE      = 0x13; // PAUSE key
const VK_CAPITAL    = 0x14; // CAPS LOCK key
const VK_KANA       = 0x15; // IME Kana mode
const VK_HANGUEL    = 0x15; // IME Hanguel mode (maintained for compatibility; use const VK_HANGUL)
const VK_HANGUL     = 0x15; // IME Hangul mode
const VK_IME_ON     = 0x16; // IME On
const VK_JUNJA      = 0x17; // IME Junja mode
const VK_FINAL      = 0x18; // IME final mode
const VK_HANJA      = 0x19; // IME Hanja mode
const VK_KANJI      = 0x19; // IME Kanji mode
const VK_IME_OFF    = 0x1A; // IME Off
const VK_ESCAPE     = 0x1B; // ESC key
const VK_CONVERT    = 0x1C; // IME convert
const VK_NONCONVERT = 0x1D; // IME nonconvert
const VK_ACCEPT     = 0x1E; // IME accept
const VK_MODECHANGE = 0x1F; // IME mode change request
const VK_SPACE      = 0x20; // SPACEBAR
const VK_PRIOR      = 0x21; // PAGE UP key
const VK_NEXT       = 0x22; // PAGE DOWN key
const VK_END        = 0x23; // END key
const VK_HOME       = 0x24; // HOME key
const VK_LEFT       = 0x25; // LEFT ARROW key
const VK_UP         = 0x26; // UP ARROW key
const VK_RIGHT      = 0x27; // RIGHT ARROW key
const VK_DOWN       = 0x28; // DOWN ARROW key
const VK_SELECT     = 0x29; // SELECT key
const VK_PRINT      = 0x2A; // PRINT key
const VK_EXECUTE    = 0x2B; // EXECUTE key
const VK_SNAPSHOT   = 0x2C; // PRINT SCREEN key
const VK_INSERT     = 0x2D; // INS key
const VK_DELETE     = 0x2E; // DEL key
const VK_HELP       = 0x2F; // HELP key

const VK_KEY_0 = 0x30; // 0 key
const VK_KEY_1 = 0x31; // 1 key
const VK_KEY_2 = 0x32; // 2 key
const VK_KEY_3 = 0x33; // 3 key
const VK_KEY_4 = 0x34; // 4 key
const VK_KEY_5 = 0x35; // 5 key
const VK_KEY_6 = 0x36; // 6 key
const VK_KEY_7 = 0x37; // 7 key
const VK_KEY_8 = 0x38; // 8 key
const VK_KEY_9 = 0x39; // 9 key

const VK_KEY_A = 0x41; // A key
const VK_KEY_B = 0x42; // B key
const VK_KEY_C = 0x43; // C key
const VK_KEY_D = 0x44; // D key
const VK_KEY_E = 0x45; // E key
const VK_KEY_F = 0x46; // F key
const VK_KEY_G = 0x47; // G key
const VK_KEY_H = 0x48; // H key
const VK_KEY_I = 0x49; // I key
const VK_KEY_J = 0x4A; // J key
const VK_KEY_K = 0x4B; // K key
const VK_KEY_L = 0x4C; // L key
const VK_KEY_M = 0x4D; // M key
const VK_KEY_N = 0x4E; // N key
const VK_KEY_O = 0x4F; // O key
const VK_KEY_P = 0x50; // P key
const VK_KEY_Q = 0x51; // Q key
const VK_KEY_R = 0x52; // R key
const VK_KEY_S = 0x53; // S key
const VK_KEY_T = 0x54; // T key
const VK_KEY_U = 0x55; // U key
const VK_KEY_V = 0x56; // V key
const VK_KEY_W = 0x57; // W key
const VK_KEY_X = 0x58; // X key
const VK_KEY_Y = 0x59; // Y key
const VK_KEY_Z = 0x5A; // Z key

const VK_LWIN  = 0x5B; // Left Windows key (Natural keyboard)
const VK_RWIN  = 0x5C; // Right Windows key (Natural keyboard)
const VK_APPS  = 0x5D; // Applications key (Natural keyboard)
const VK_SLEEP = 0x5F; // Computer Sleep key

const VK_NUMPAD0 = 0x60; // Numeric keypad 0 key
const VK_NUMPAD1 = 0x61; // Numeric keypad 1 key
const VK_NUMPAD2 = 0x62; // Numeric keypad 2 key
const VK_NUMPAD3 = 0x63; // Numeric keypad 3 key
const VK_NUMPAD4 = 0x64; // Numeric keypad 4 key
const VK_NUMPAD5 = 0x65; // Numeric keypad 5 key
const VK_NUMPAD6 = 0x66; // Numeric keypad 6 key
const VK_NUMPAD7 = 0x67; // Numeric keypad 7 key
const VK_NUMPAD8 = 0x68; // Numeric keypad 8 key
const VK_NUMPAD9 = 0x69; // Numeric keypad 9 key

const VK_MULTIPLY  = 0x6A; // Multiply key
const VK_ADD       = 0x6B; // Add key
const VK_SEPARATOR = 0x6C; // Separator key
const VK_SUBTRACT  = 0x6D; // Subtract key
const VK_DECIMAL   = 0x6E; // Decimal key
const VK_DIVIDE    = 0x6F; // Divide key

const VK_F1  = 0x70; // F1 key
const VK_F2  = 0x71; // F2 key
const VK_F3  = 0x72; // F3 key
const VK_F4  = 0x73; // F4 key
const VK_F5  = 0x74; // F5 key
const VK_F6  = 0x75; // F6 key
const VK_F7  = 0x76; // F7 key
const VK_F8  = 0x77; // F8 key
const VK_F9  = 0x78; // F9 key
const VK_F10 = 0x79; // F10 key
const VK_F11 = 0x7A; // F11 key
const VK_F12 = 0x7B; // F12 key
const VK_F13 = 0x7C; // F13 key
const VK_F14 = 0x7D; // F14 key
const VK_F15 = 0x7E; // F15 key
const VK_F16 = 0x7F; // F16 key
const VK_F17 = 0x80; // F17 key
const VK_F18 = 0x81; // F18 key
const VK_F19 = 0x82; // F19 key
const VK_F20 = 0x83; // F20 key
const VK_F21 = 0x84; // F21 key
const VK_F22 = 0x85; // F22 key
const VK_F23 = 0x86; // F23 key
const VK_F24 = 0x87; // F24 key

const VK_NUMLOCK  = 0x90; // NUM LOCK key
const VK_SCROLL   = 0x91; // SCROLL LOCK key
const VK_LSHIFT   = 0xA0; // Left SHIFT key
const VK_RSHIFT   = 0xA1; // Right SHIFT key
const VK_LCONTROL = 0xA2; // Left CONTROL key
const VK_RCONTROL = 0xA3; // Right CONTROL key
const VK_LMENU    = 0xA4; // Left ALT key
const VK_RMENU    = 0xA5; // Right ALT key

const VK_BROWSER_BACK      = 0xA6; // Browser Back key
const VK_BROWSER_FORWARD   = 0xA7; // Browser Forward key
const VK_BROWSER_REFRESH   = 0xA8; // Browser Refresh key
const VK_BROWSER_STOP      = 0xA9; // Browser Stop key
const VK_BROWSER_SEARCH    = 0xAA; // Browser Search key
const VK_BROWSER_FAVORITES = 0xAB; // Browser Favorites key
const VK_BROWSER_HOME      = 0xAC; // Browser Start and Home key

const VK_VOLUME_MUTE = 0xAD; // Volume Mute key
const VK_VOLUME_DOWN = 0xAE; // Volume Down key
const VK_VOLUME_UP   = 0xAF; // Volume Up key

const VK_MEDIA_NEXT_TRACK = 0xB0; // Next Track key
const VK_MEDIA_PREV_TRACK = 0xB1; // Previous Track key
const VK_MEDIA_STOP       = 0xB2; // Stop Media key
const VK_MEDIA_PLAY_PAUSE = 0xB3; // Play/Pause Media key

const VK_LAUNCH_MAIL         = 0xB4; // Start Mail key
const VK_LAUNCH_MEDIA_SELECT = 0xB5; // Select Media key
const VK_LAUNCH_APP1         = 0xB6; // Start Application 1 key
const VK_LAUNCH_APP2         = 0xB7; // Start Application 2 key

const VK_OEM_1      = 0xBA; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the ';:' key
const VK_OEM_PLUS   = 0xBB; // For any country/region, the '+' key
const VK_OEM_COMMA  = 0xBC; // For any country/region, the ',' key
const VK_OEM_MINUS  = 0xBD; // For any country/region, the '-' key
const VK_OEM_PERIOD = 0xBE; // For any country/region, the '.' key
const VK_OEM_2      = 0xBF; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '/?' key
const VK_OEM_3      = 0xC0; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '`~' key
const VK_OEM_4      = 0xDB; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '[{' key
const VK_OEM_5      = 0xDC; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '\|' key
const VK_OEM_6      = 0xDD; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the ']}' key
const VK_OEM_7      = 0xDE; // Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the 'single-quote/double-quote' key
const VK_OEM_8      = 0xDF; // Used for miscellaneous characters; it can vary by keyboard.
const VK_OEM_102    = 0xE2; // The <> keys on the US standard keyboard, or the \\| key on the non-US 102-key keyboard
const VK_PROCESSKEY = 0xE5; // IME PROCESS key
const VK_PACKET     = 0xE7; // Used to pass Unicode characters as if they were keystrokes. The const VK_PACKET key is the low word of a 32-bit Virtual Key value used for non-keyboard input methods. For more information, see Remark in KEYBDINPUT, SendInput, WM_KEYDOWN, and WM_KEYUP
const VK_ATTN       = 0xF6; // Attn key
const VK_CRSEL      = 0xF7; // CrSel key
const VK_EXSEL      = 0xF8; // ExSel key
const VK_EREOF      = 0xF9; // Erase EOF key
const VK_PLAY       = 0xFA; // Play key
const VK_ZOOM       = 0xFB; // Zoom key
const VK_NONAME     = 0xFC; // Reserved
const VK_PA1        = 0xFD; // PA1 key
const VK_OEM_CLEAR  = 0xFE; // Clear key

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
	 * Constructs a search URL for a specified site using available track metadata.
	 * @param {string} site - The name of the site to generate a search URL for.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 */
	link(site, metadb) {
		if (!metadb) return;

		const metaInfo = metadb.GetFileInfo();
		const artist = metaInfo.MetaValue(metaInfo.MetaFind('artist'), 0).replace(/\s+/g, '+').replace(/&/g, '%26');
		const album = metaInfo.MetaValue(metaInfo.MetaFind('album'), 0).replace(/\s+/g, '+');
		const title = metaInfo.MetaValue(metaInfo.MetaFind('title'), 0).replace(/\s+/g, '+');

		const searchQuerry = artist || title;

		switch (site.toLowerCase()) {
			case 'google':
				site = (searchQuerry ? `http://images.google.com/search?q=${searchQuerry}&ie=utf-8` : null);
				break;
			case 'googleimages':
				site = (searchQuerry ? `http://images.google.com/images?hl=en&q=${searchQuerry}&ie=utf-8` : null);
				break;
			case 'wikipedia':
				site = (artist ? `http://en.wikipedia.org/wiki/${artist.replace(/\+/g, '_')}` : null);
				break;
			case 'youtube':
				site = (searchQuerry ? `http://www.youtube.com/results?search_type=&search_query=${searchQuerry}&ie=utf-8` : null);
				break;
			case 'lastfm':
				site = (searchQuerry ? `http://www.last.fm/music/${searchQuerry.replace('/', '%252F')}` : null);
				break;
			case 'discogs':
				site = (searchQuerry || album ? `http://www.discogs.com/search?q=${searchQuerry}+${album}&ie=utf-8` : null);
				break;
			case 'musicbrainz':
				site = (searchQuerry || album ? `https://musicbrainz.org/taglookup/index?tag-lookup.artist=${searchQuerry}&tag-lookup.release=${album}&ie=utf-8` : null);
				break;
			default:
				site = '';
		}

		if (!site) return;

		RunCmd(site);
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
			window.SetCursor(32512); // Arrow
		}

		if (grCfg.settings.hideCursor && fb.IsPlaying) {
			clearTimeout(grm.ui.hideCursorTimeout);
			grm.ui.hideCursorTimeout = setTimeout(() => {
				// * If there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
				if (!grm.ui.activeMenu && fb.IsPlaying) {
					window.SetCursor(-1); // Hide cursor
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
		if ((VK_SHIFT === key || VK_CONTROL === key || VK_MENU === key) && this.savedKey === key) {
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
