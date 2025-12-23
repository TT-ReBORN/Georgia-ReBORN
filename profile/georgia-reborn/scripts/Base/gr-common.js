/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Common                                   * //
// * Author:         TT                                                      * //
// * Org. Author:    TheQwertiest                                            * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    16-12-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////
// * ACTIVEX OBJECTS * //
/////////////////////////
/** @global @type {ActiveXObject} The Shell.Application ActiveX object. */
const app = new ActiveXObject('Shell.Application');
/** @global @type {ActiveXObject} The eslyric ActiveX object. */
const esl = new ActiveXObject('eslyric');
/** @global @type {ActiveXObject} The htmlfile ActiveX object. */
const doc = new ActiveXObject('htmlfile');
/** @global @type {ActiveXObject} The Scripting.FileSystemObject ActiveX object. */
const fso = new ActiveXObject('Scripting.FileSystemObject');
/** @global @type {ActiveXObject} The AudioWizard ActiveX object. */
const AudioWizard = new ActiveXObject('AudioWizard');
/** @global @type {ActiveXObject} The UIWizard ActiveX object. */
const UIWizard = new ActiveXObject('UIWizard');
/** @global @type {ActiveXObject} The WScript.Shell ActiveX object. */
const WshShell = new ActiveXObject('WScript.Shell');


////////////////////
// * COMPONENTS * //
////////////////////
/**
 * A set of boolean flags indicating the presence of specific components.
 * Each flag is set based on the result of a check performed at the time of initialization.
 * @typedef  {object} Component
 * @property {boolean} AudioWizard - The state indicates if the foo_audio_wizard component is installed.
 * @property {boolean} ChronFlow - The state indicates if the foo_chronflow component or its mod version is installed.
 * @property {boolean} EnhancedPlaycount - The state indicates if the foo_enhanced_playcount component is installed.
 * @property {boolean} ESLyric - The state indicates if the foo_uie_eslyric component is installed.
 * @property {boolean} UIWizard - The state indicates if the foo_ui_wizard component is installed.
 */
/** @global @type {Component} */
const Component = {
	AudioWizard: utils.CheckComponent('foo_audio_wizard'),
	ChronFlow: utils.CheckComponent('foo_chronflow') || utils.CheckComponent('foo_chronflow_mod'),
	EnhancedPlaycount: utils.CheckComponent('foo_enhanced_playcount'),
	ESLyric: utils.CheckComponent('foo_uie_eslyric'),
	UIWizard: utils.CheckComponent('foo_ui_wizard')
};


///////////////////////
// * CONFIGURATION * //
///////////////////////
/**
 * A set of configuration type settings.
 * @typedef  {object} ConfigurationObjectType
 * @property {string} Array - The array configuration type.
 * @property {string} Object - The object configuration type.
 * @property {string} Value - The value configuration type (not currently handled).
 */
/** @global @enum @type {ConfigurationObjectType} */
const ConfigurationObjectType = {
	Array:  'array',
	Object: 'object',
	Value:  'value'
};


/////////////////
// * DISPLAY * //
/////////////////
/**
 * A set of FPS values and their corresponding refresh intervals rounded up in milliseconds (1000 / FPS).
 * @typedef  {object} FPS
 * @property {number} _360 - 2.77 ms (High-end gaming monitors).
 * @property {number} _240 - 4.17 ms (High-end gaming monitors).
 * @property {number} _165 - 6.06 ms (High-end gaming monitors).
 * @property {number} _144 - 6.94 ms (Gaming monitors).
 * @property {number} _120 - 8.33 ms (Gaming monitors).
 * @property {number} _90 - 11.11 ms (VR headsets).
 * @property {number} _75 - 13.33 ms (Older gaming monitors).
 * @property {number} _60 - 16.67 ms (Video and standard monitors).
 * @property {number} _50 - 20 ms (PAL video format).
 * @property {number} _45 - 22.22 ms (Video).
 * @property {number} _30 - 33.33 ms (Standard for many video formats).
 * @property {number} _25 - 40 ms (PAL video format).
 * @property {number} _20 - 50 ms (GDI very high rendering).
 * @property {number} _15 - 66.67 ms (GDI very high rendering).
 * @property {number} _12 - 83.33 ms (GDI very high rendering).
 * @property {number} _10 - 100 ms (GDI high rendering).
 * @property {number} _9 - 111.11 ms (GDI high rendering).
 * @property {number} _8 - 125 ms (GDI high rendering).
 * @property {number} _7 - 142.86 ms (GDI moderate rendering).
 * @property {number} _6 - 166.67 ms (GDI moderate rendering).
 * @property {number} _5 - 200 ms (GDI slow rendering).
 * @property {number} _4 - 250 ms (GDI slow rendering).
 * @property {number} _3 - 333.33 ms (GDI very slow rendering).
 * @property {number} _2 - 500 ms (GDI very slow rendering).
 * @property {number} _1 - 1000 ms (GDI very slow rendering).
 */
/** @global @enum @type {FPS} */
const FPS = {
	_360: 3,
	_240: 4,
	_165: 6,
	_144: 7,
	_120: 8,
	_90: 11,
	_75: 13,
	_60: 17,
	_50: 20,
	_45: 22,
	_30: 33,
	_25: 40,
	_20: 50,
	_15: 67,
	_12: 83,
	_10: 100,
	_9: 111,
	_8: 125,
	_7: 143,
	_6: 167,
	_5: 200,
	_4: 250,
	_3: 333,
	_2: 500,
	_1: 1000
};

/**
 * A set of display resolution state settings, initially set to false.
 * These states can be modified at runtime to reflect the current display settings.
 * @typedef  {object} RES
 * @property {boolean} _4K - The 4K resolution state.
 * @property {boolean} _QHD - The Quad HD resolution state.
 * @property {boolean} _HD - The High Definition resolution state.
 */
/** @global @type {RES} */
const RES = {
	_4K: false,
	_QHD: false,
	_HD: false
};


///////////////////
// * RENDERING * //
///////////////////
/**
 * A set of several different quality type settings for interpolation of image processing when resizing or transforming.
 * Used in SetInterpolationMode().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx.
 * @typedef  {object} InterpolationMode
 * @property {number} Invalid - Used internally.
 * @property {number} Default - Specifies the default interpolation mode.
 * @property {number} LowQuality - Specifies a low-quality mode.
 * @property {number} HighQuality - Specifies a high-quality mode.
 * @property {number} Bilinear - Specifies bilinear interpolation. No prefiltering is done. This mode is not suitable for shrinking an image below 50 percent of its original size.
 * @property {number} Bicubic - Specifies bicubic interpolation. No prefiltering is done. This mode is not suitable for shrinking an image below 25 percent of its original size.
 * @property {number} NearestNeighbor - Specifies nearest-neighbor interpolation.
 * @property {number} HighQualityBilinear - Specifies high-quality, bilinear interpolation. Prefiltering is performed to ensure high-quality shrinking.
 * @property {number} HighQualityBicubic - Specifies high-quality, bicubic interpolation. Prefiltering is performed to ensure high-quality shrinking. This mode produces the highest quality transformed images.
 */
/** @global @enum @type {InterpolationMode} */
const InterpolationMode = {
	Invalid: -1,
	Default: 0,
	LowQuality: 1,
	HighQuality: 2,
	Bilinear: 3,
	Bicubic: 4,
	NearestNeighbor: 5,
	HighQualityBilinear: 6,
	HighQualityBicubic: 7
};

/**
 * A set of several different quality type settings for anti-aliasing that is applied to the edges of lines and curves.
 * Used in SetSmoothingMode().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx.
 * @typedef  {object} SmoothingMode
 * @property {number} Invalid - Reserved.
 * @property {number} Default - Specifies that smoothing is not applied.
 * @property {number} HighSpeed - Specifies that smoothing is not applied.
 * @property {number} HighQuality - Specifies that smoothing is applied using an 8x4 box filter.
 * @property {number} None - Specifies that smoothing is not applied.
 * @property {number} AntiAlias - Specifies that smoothing is applied using an 8x4 box filter.
 */
/** @global @enum @type {SmoothingMode} */
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
 * @typedef  {object} TextRenderingHint
 * @property {number} SystemDefault - Specifies that a character is drawn using the currently selected system font smoothing mode (also called a rendering hint).
 * @property {number} SingleBitPerPixelGridFit - Specifies that a character is drawn using its glyph bitmap and hinting to improve character appearance on stems and curvature.
 * @property {number} SingleBitPerPixel - Specifies that a character is drawn using its glyph bitmap and no hinting. This results in better performance at the expense of quality.
 * @property {number} AntiAliasGridFit - Specifies that a character is drawn using its antialiased glyph bitmap and hinting. This results in much better quality due to antialiasing at a higher performance cost.
 * @property {number} AntiAlias - Specifies that a character is drawn using its antialiased glyph bitmap and no hinting. Stem width differences may be noticeable because hinting is turned off.
 * @property {number} ClearTypeGridFit - Specifies that a character is drawn using its glyph ClearType bitmap and hinting. This type of text rendering cannot be used along with CompositingModeSourceCopy.
 */
/** @global @enum @type {TextRenderingHint} */
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
 * @typedef  {object} AlbumArtId
 * @property {number} Front - The front album art image.
 * @property {number} Back - The back album art image.
 * @property {number} Disc - The disc album art image.
 * @property {number} Icon - The ccon album art image.
 * @property {number} Artist - The artist album art image.
 */
/** @global @enum @type {AlbumArtId} */
const AlbumArtId = {
	Front: 0,
	Back: 1,
	Disc: 2,
	Icon: 3,
	Artist: 4
};

/**
 * A set of different text alignment and formatting settings.
 * @typedef  {object} DrawText
 * @property {number} Left - The left text alignment.
 * @property {number} Center - The center text alignment.
 * @property {number} Right - The right text alignment.
 * @property {number} VCenter - The vertical center text alignment.
 * @property {number} SingleLine - The single line text formatting.
 * @property {number} CalcRect - The calculate rectangle dimensions.
 * @property {number} NoPrefix - The no prefix text formatting.
 * @property {number} EndEllipsis - The end ellipsis text formatting.
 * @property {number} WordEllipsis - The word ellipsis text formatting.
 */
/** @global @enum @type {DrawText} */
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
 * @typedef  {object} Stringformat
 * @property {number} H_Align_Near - The horizontal align near.
 * @property {number} H_Align_Center - The horizontal align center.
 * @property {number} H_Align_Far - The horizontal align far.
 * @property {number} V_Align_Near - The vertical align near.
 * @property {number} V_Align_Center - The vertical align center.
 * @property {number} V_Align_Far - The vertical align far.
 * @property {number} Align_Center - The align center.
 * @property {number} Trim_None - The no trimming.
 * @property {number} Trim_Char - The trim to character.
 * @property {number} Trim_Word - The trim to word.
 * @property {number} Trim_Ellipsis_Char - The trim with ellipsis at character.
 * @property {number} Trim_Ellipsis_Word - The trim with ellipsis at word.
 * @property {number} Trim_Ellipsis_Path - The trim with ellipsis at path.
 * @property {number} Dir_Right_To_Left - The right to left text direction.
 * @property {number} Dir_Vertical - The vertical text direction.
 * @property {number} No_Fit_Black_Box - The no fit black box.
 * @property {number} Display_Format_Control - The display format control.
 * @property {number} No_Font_Fallback - The no font fallback.
 * @property {number} Measure_Trailing_Spaces - The measure trailing spaces.
 * @property {number} No_Wrap - The no wrap.
 * @property {number} Line_Limit - The line limit.
 * @property {number} No_Clip - The no clip.
 */
/** @global @enum @type {Stringformat} */
const Stringformat = {
	H_Align_Near: 0x00000000,
	H_Align_Center: 0x10000000,
	H_Align_Far: 0x20000000,

	V_Align_Near: 0x00000000,
	V_Align_Center: 0x01000000,
	V_Align_Far: 0x02000000,

	Align_Center: 0x11000000,

	Trim_None: 0x00000000,
	Trim_Char: 0x00100000,
	Trim_Word: 0x00200000,
	Trim_Ellipsis_Char: 0x00300000,
	Trim_Ellipsis_Word: 0x00400000,
	Trim_Ellipsis_Path: 0x00500000,

	Dir_Right_To_Left: 0x00000001,
	Dir_Vertical: 0x00000002,
	No_Fit_Black_Box: 0x00000004,
	Display_Format_Control: 0x00000020,
	No_Font_Fallback: 0x00000400,
	Measure_Trailing_Spaces: 0x00000800,
	No_Wrap: 0x00001000,
	Line_Limit: 0x00002000,
	No_Clip: 0x00004000
};


///////////////
// * FONTS * //
///////////////
/**
 * A set of font style settings used when creating font objects.
 * @typedef  {object} FontStyle
 * @property {number} Regular - The regular font style.
 * @property {number} Bold - The bold font style.
 * @property {number} Italic - The italic font style.
 * @property {number} Bold_Italic - The bold and italic font style.
 * @property {number} Underline - The underline font style.
 * @property {number} Strikeout - The strikeout font style.
 */
/** @global @enum @type {FontStyle} */
const FontStyle = {
	Regular: 0,
	Bold: 1,
	Italic: 2,
	Bold_Italic: 3,
	Underline: 4,
	Strikeout: 8
};

/**
 * A set of icon mapping settings for the 'Reborn-Symbols' font used for UI symbols like transports, windows, and media controls.
 * @typedef {object} RebornSymbols
 * @property {string} Play - The play button symbol.
 * @property {string} Pause - The pause button symbol.
 * @property {string} Stop - The stop button symbol.
 * @property {string} Next - The next button symbol.
 * @property {string} Prev - The previous button symbol.
 * @property {string} Next2 - The alternative next button symbol.
 * @property {string} Prev2 - The alternative previous button symbol.
 * @property {string} Power - The power button symbol.
 *
 * @property {string} PlaybackDefault - The default playback symbol.
 * @property {string} PlaybackRepeatPlaylist - The repeat playlist symbol.
 * @property {string} PlaybackRepeatTrack - The repeat single track symbol.
 * @property {string} PlaybackShuffle - The shuffle playback symbol.
 *
 * @property {string} Volume - The volume/speaker symbol.
 * @property {string} VolumeDown - The volume down symbol.
 * @property {string} VolumeUp - The volume up symbol.
 *
 * @property {string} Hamburger - The hamburger menu symbol.
 * @property {string} Minimize - The minimize window symbol.
 * @property {string} Maximize - The maximize window symbol.
 * @property {string} Close - The close window symbol.
 * @property {string} Close2 - The close thinner symbol.
 *
 * @property {string} PlusLarge - The large plus symbol.
 * @property {string} MinusLarge - The large minus symbol.
 * @property {string} ThreeDotEllipsis - The Three Dot Ellipsis symbol.
 *
 * @property {string} ArrowLeft - The smaller backward arrow symbol.
 * @property {string} ArrowRight - The smaller forward arrow symbol.
 * @property {string} ArrowUp - The smaller upward arrow symbol.
 * @property {string} ArrowDown - The smaller downward arrow symbol.
 *
 * @property {string} ArrowLeft2 - The large thinner backward arrow symbol.
 * @property {string} ArrowRight2 - The large thinner forward arrow symbol.
 * @property {string} ArrowUp2 - The large thinner upward arrow symbol.
 * @property {string} ArrowDown2 - The large thinner downward arrow symbol.
 *
 * @property {string} ArrowLeft3 - The large thicker backward arrow symbol.
 * @property {string} ArrowRight3 - The large thicker forward arrow symbol.
 * @property {string} ArrowUp3 - The large thicker upward arrow symbol.
 * @property {string} ArrowDown3 - The large thicker downward arrow symbol.
 *
 * @property {string} ArrowLeft4 - The middle backward arrow symbol.
 * @property {string} ArrowRight4 - The middle forward arrow symbol.
 * @property {string} ArrowUp4 - The middle upward arrow symbol.
 * @property {string} ArrowDown4 - The middle downward arrow symbol.
 *
 * @property {string} AngleLeft - The thinner backward arrow symbol.
 * @property {string} AngleRight - The thinner forward arrow symbol.
 * @property {string} AngleUp - The thinner upward arrow symbol.
 * @property {string} AngleDown - The thinner downward arrow symbol.
 *
 * @property {string} CaretLeft - The filled rounded left triangle symbol.
 * @property {string} CaretRight - The filled rounded right triangle symbol.
 * @property {string} CaretUp - The filled rounded up triangle symbol.
 * @property {string} CaretDown - The filled rounded down triangle symbol.
 *
 * @property {string} BrokenBar - The Broken Bar symbol.
 * @property {string} Bullet - The Bullet symbol.
 * @property {string} BulletOperator - The Bullet Operator symbol.
 * @property {string} MiddleDot - The Middle Dot symbol.
 * @property {string} NotSign - The Not Sign symbol.
 *
 * @property {string} StarEmpty - The empty star symbol.
 * @property {string} StarQuarter - The quarter-filled star symbol.
 * @property {string} StarHalf - The half-filled star symbol.
 * @property {string} StarThreeQuarter - The three-quarter filled star symbol.
 * @property {string} StarFull - The full star symbol.
 * @property {string} Heart - The heart symbol.
 *
 * @property {string} Lastfm - The lastfm symbol.
 * @property {string} Wikipedia - The Wikipedia symbol.
 *
 * @property {string} BlackSquare - The black square symbol in 1 em size.
 * @property {string} LightBulb - The light bulb symbol.
 * @property {string} Lock - The lock symbol.
 * @property {string} Medical - The medical cross symbol.
 * @property {string} Microphone - The microphone symbol.
 * @property {string} MusicNote - The music note symbol.
 */
/** @global @enum @type {RebornSymbols} */
const RebornSymbols = {
	// Playback buttons
	Play: '\u25B6',
	Pause: '\u23F8',
	Stop: '\u23F9',
	Next: '\u23E9',
	Prev: '\u23EA',
	Next2: '\u23FD',
	Prev2: '\u23EE',
	Power: '\u23FB',

	// Playback Mode Indicators
	PlaybackDefault: '\uF2F0',
	PlaybackRepeatPlaylist: '\uF2F9',
	PlaybackRepeatTrack: '\uF2F1',
	PlaybackShuffle: '\uF074',

	// Volume Controls
	Volume: '\uF026',
	VolumeDown: '\uF027',
	VolumeUp: '\uF028',

	// Window & Layout Controls
	Hamburger: '\u2630',
	Minimize: '\uF2D1',
	Maximize: '\uF2D0',
	Close: '\uF2D2',
	Close2: '\u2715',

	// Navigation controls
	PlusLarge: '\uE109',
	MinusLarge: '\uE108',
	ThreeDotEllipsis: '\uE10C',

	// Arrows & Carets - Small thin arrows
	ArrowLeft: '\uE00E',
	ArrowRight: '\uE00F',
	ArrowUp: '\uE010',
	ArrowDown: '\uE011',

	// Arrows & Carets - Large thin arrows
	ArrowLeft2: '\uE012',
	ArrowRight2: '\uE013',
	ArrowUp2: '\uE014',
	ArrowDown2: '\uE015',

	// Arrows & Carets - Large thick arrows
	ArrowLeft3: '\uE016',
	ArrowRight3: '\uE017',
	ArrowUp3: '\uE018',
	ArrowDown3: '\uE019',

	// Arrows & Carets - Medium arrows
	ArrowLeft4: '\uE09E',
	ArrowRight4: '\uE09F',
	ArrowUp4: '\uE0A0',
	ArrowDown4: '\uE0A1',

	// Arrows & Carets - Angles
	AngleLeft: '\uF104',
	AngleRight: '\uF105',
	AngleUp: '\uF106',
	AngleDown: '\uF107',

	// Arrows & Carets - Filled caret triangles
	CaretLeft: '\uF0D9',
	CaretRight: '\uF0DA',
	CaretUp: '\uF0D8',
	CaretDown: '\uF0D7',

	// Separators & Dividers
	BrokenBar: '\u00A6',
	Bullet: '\u2022',
	BulletOperator: '\u2219',
	MiddleDot: '\u00B7',
	NotSign: '\u00AC',

	// Ratings & Favorites
	StarEmpty: '\u25CB',
	StarQuarter: '\u25D0',
	StarHalf: '\u25D1',
	StarThreeQuarter: '\u25D2',
	StarFull: '\u25CF',
	Star: '\u2605',
	Heart: '\u2764',

	// Logos
	Lastfm: '\uF202',
	Wikipedia: '\uF266',

	// Misc Utilities
	BlackSquare: '\uE002',
	LightBulb: '\uF0EB',
	Lock: '\uF023',
	Medical: '\u271A',
	Microphone: '\uF130',
	MusicNote: '\uF001',

	// Library Explorer
	Add: '\uF0CA',
	Artist: '\uF007',
	Details: '\uF044',
	Edit: '\uF4FF',
	Links: '\uF08E',
	Missing: '\uF51F',
	Now: '\uF001',
	Similar: '\uF500',
	Sort: '\uF0DC',
	Stats: '\uF201',
	ChevronLeft: '\uF053',
	ChevronRight: '\uF054',
	ChevronUp: '\uF057',
	ChevronDown: '\uF058',
	Download: '\uF019',
	Download2: '\uF361',
	External: '\uF360'
};

/**
 * A set of icon mapping unicodes.
 * @typedef {object} Unicode
 * @property {string} Apostrophe - '\u0027' `'` The Apostrophe.
 * @property {string} BeamedEighthNotes - '\u266B' `♫` The Beamed Eighth Notes.
 * @property {string} BlackSmallSquare - '\u25AA' `▪` The Black Small Square.
 * @property {string} BlackStar - '\u2605' `★` The Black Star.
 * @property {string} BlackUpTriangle - '\u25B2' `▲` The Black Up-Pointing Triangle.
 * @property {string} BlackDownTriangle - '\u25BC' `▼` The Black Down-Pointing Triangle.
 * @property {string} BrokenBar - '\u00A6' `¦` The Bullet.
 * @property {string} Bullet - '\u2022' `•` The Bullet.
 * @property {string} BulletOperator - '\u2219' `∙` The Bullet Operator.
 * @property {string} NotSign - '\u00AC' `¬` The Not Sign.
 * @property {string} Hyphen - '\u2010' `-` The Hyphen.
 * @property {string} SoftHyphen - '\u00AD' ` ` The Soft Hyphen.
 * @property {string} ArmenianHyphen - '\u058A' `֊` The Armenian Hyphen.
 * @property {string} NonBreakingHyphen - '\u2011' `‑` The Non-Breaking Hyphen.
 * @property {string} FigureDash - '\u2012' `‒` The Figure Dash.
 * @property {string} EnDash - '\u2013' `–` The En Dash.
 * @property {string} EmDash - '\u2014' `—` The Em Dash.
 * @property {string} SmallEmDash - '\uFE58' `﹘` The Small Em Dash.
 * @property {string} InformationSeparatorOne - '\u001F' `﹘` The Information Separator One.
 * @property {string} ReplacementCharacter - '\uFFFD' `�` The Replacement Character.
 * @property {string} MiddleDot - '\u00B7' `·` The Middle Dot.
 * @property {string} ZeroWidthSpace - '\u200B' `﹘` The Zero Width Space.
 */
/** @global @enum @type {Unicode} */
const Unicode = {
	Apostrophe: '\u0027',
	BeamedEighthNotes: '\u266B',
	BlackSmallSquare: '\u25AA',
	BlackStar: '\u2605',
	BlackUpTriangle: '\u25B2',
	BlackDownTriangle: '\u25BC',
	BrokenBar: '\u00A6',
	Bullet: '\u2022',
	BulletOperator: '\u2219',
	NotSign: '\u00AC',
	Hyphen: '\u2010',
	SoftHyphen: '\u00AD',
	ArmenianHyphen: '\u058A',
	NonBreakingHyphen: '\u2011',
	FigureDash: '\u2012',
	EnDash: '\u2013',
	EmDash: '\u2014',
	SmallEmDash: '\uFE58',
	InformationSeparatorOne:'\u001F',
	ReplacementCharacter: '\uFFFD',
	MiddleDot: '\u00B7',
	ZeroWidthSpace: '\u200B'
};


////////////////
// * REGEXP * //
////////////////
/**
 * A centralized collection of pre-compiled regular expressions used throughout Georgia-ReBORN.
 * ! Warning: Patterns with /g or /gi flags maintain state via lastIndex.
 * ! Always reset before using .exec() or .test(): `Regex.SomePattern.lastIndex = 0;`
 * ! Safe alternatives: .match(), .replace(), .search(), .split() handle state automatically.
 * ? Note: When adding new patterns, avoid the sequence `*` plus `/` in documentation as it closes JSDoc comments.
 * ? Ensure the flags (/g, /gi) are placed outside the backticks to prevent parsing issues.
 * @typedef {object} Regex
 *
 * @property {RegExp} ArtAlbumArtExtensions - Matches album art extensions `/\.(jpg|png|webp)$/i`.
 * @property {RegExp} ArtAlbumArtWildcard - Matches album art path wildcards `/(\*|\b(folder|cover|front)\b)\.\*`/g. Captures: wildcard or keyword.
 * @property {RegExp} ArtDiscArtFilename - Matches disc art filenames `/(cd|disc|vinyl)([0-9]*|[a-h])\.(png|jpg)/i`. Captures: base, suffix.
 * @property {RegExp} ArtDiscArtWildcard - Matches disc art path wildcards `/(\*|\b(cd|disc|vinyl)\b)\.\*`/g. Captures: wildcard or keyword.
 * @property {RegExp} ArtImageExtensions - Matches common image extensions `/(?:jpe?g|png|webp|gif|bmp)$/i`.
 * @property {RegExp} ArtImageFileSortNumber - Matches _number.jpg|png|webp in filenames `/_(\d+)\.(jpe?g|png|webp)$/i`. Captures: number.
 * @property {RegExp} ArtImageLabelSuffix - Matches trailing label suffixes `/ (Records|Recordings|Music)$/`.
 *
 * @property {RegExp} PathBackslash - Matches single backslashes `/\\/g`.
 * @property {RegExp} PathBackslashEndsWith - Matches paths ending with a single backslash `/\\$/`.
 * @property {RegExp} PathBackslashPadded - Matches backslash with optional surrounding spaces `/\s*\\\s*`/g.
 * @property {RegExp} PathBackslashSingle - Matches a single backslash `/\\/`.
 * @property {RegExp} PathBackslashTrailing - Matches one or more trailing backslashes `/\\+$/`.
 * @property {RegExp} PathDoubleBackslash - Matches double backslashes `/\\\\/g`.
 * @property {RegExp} PathDrivePrefix - Matches Windows drive prefixes `/^[a-zA-Z]:\\/g`.
 * @property {RegExp} PathEscapedDot - Matches escaped dot "\." `/\\\./g`.
 * @property {RegExp} PathFileExtension - Matches simple file extensions (alphanumeric + underscore only) `/\.\w+$/`.
 * @property {RegExp} PathFileExtensionFinal - Matches the final file extension robustly (any chars except / and .) `/\.[^/.]+$/`.
 * @property {RegExp} PathFilenameExtract - Matches and extracts filename from full path `/[^/\\]*$/`.
 * @property {RegExp} PathFilenameStrict - Matches and extracts filename (requires at least one char) `/[^\\\/]+$/`.
 * @property {RegExp} PathForwardSlash - Matches all forward slashes `/\//g`.
 * @property {RegExp} PathGlobSpecials - Matches glob special chars for escaping `/[\.\+\^\$\(\)\{\}\|\[\]\\\?-]/g`.
 * @property {RegExp} PathHiddenSystem - Matches hidden/system paths `/([/\\]).((?:foobar2000|fb2k)[^/\\]*|cache|local)([/\\])/g`. Captures: sep, segment, sep.
 * @property {RegExp} PathIllegalFilename - Matches illegal Windows/NTFS chars in filenames `/[<>:"\/\\|?*]+/g`.
 * @property {RegExp} PathMultiDisc - Matches multi-disc directories `/\\(CD|Vinyl|Disc|Bonus|Vol\.?|Volume)\s*(\d+|I{1,3}|IV|V(?:I{0,3}|X)?|X{0,3})$/i`. Captures: prefix, number.
 * @property {RegExp} PathMultipleDotBackslash - Matches "..\" or "..\ " etc. `/\.+\\/`.
 * @property {RegExp} PathProfileDir - Matches profile placeholder directory with backslash `/%profile%\\/i`.
 * @property {RegExp} PathProfileDirGlobal - Matches profile placeholder directory with backslash globally `/%profile%\\/gi`.
 * @property {RegExp} PathProfileDirStart - Matches profile placeholder at start with optional backslash `/^%profile%\\?/i`.
 * @property {RegExp} PathRelativeStartsWith - Matches relative paths starting with `.\` `/^\.\\/`.
 * @property {RegExp} PathSeparators - Matches path separators `/[/\\|:]/g`.
 * @property {RegExp} PathSplitter - Splits paths into segments `/(.*?)\\/gm`. Captures: segment.
 * @property {RegExp} PathStorageDir - Matches storage directory placeholder with backslash `/%storage_folder%\\/i`.
 * @property {RegExp} PathStorageDirStart - Matches storage placeholder at start with optional backslash `/^%storage_folder%\\?/i`.
 * @property {RegExp} PathUpperOrParent - Matches uppercase letter or parent dir `/[A-Z]|\../`.
 * @property {RegExp} PathWildcardAsterisk - Matches asterisk wildcards `/\*`/g.
 *
 * @property {RegExp} ColorHex - Matches and validates hex colors `/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i`. Captures: hex digits.
 * @property {RegExp} ColorHexDigit - Matches single hex digits `/([0-9a-f])/gi`. Captures: digit.
 * @property {RegExp} ColorHexLeading - Matches leading `#` `/^#/`.
 * @property {RegExp} ColorHSL - Matches and validates hsl/hsla() `/^hsla?\((\d{1,3}?),\s*(\d{1,3}%),\s*(\d{1,3}%)(,\s*[01]?\.?\d*)?\)$/`.
 * @property {RegExp} ColorHSLCapture - Matches and captures H, S, L, optional A from hsl/hsla() `/^hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(,\s*([01]?\.?\d*))?\)$/`.
 * @property {RegExp} ColorPercent - Matches percentage values `/^\d+(\.\d+)*%$/`.
 * @property {RegExp} ColorRGB - Matches and validates rgb/rgba() `/^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*[01]?\.?\d*)?\)$/`.
 * @property {RegExp} ColorRGBCapture - Matches and captures R, G, B, optional A from rgb/rgba() `/^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*([01]?\.?\d*))?\)$/`.
 * @property {RegExp} ColorRGBLoose - Matches loose RGB tuples `/\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/`. Captures: R, G, B.
 *
 * @property {RegExp} DateFull - Matches full date format like "1 January 2000" `/^\d+\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(19|20)\d{2}$/i`.
 * @property {RegExp} DateMonthDayYear - Matches and captures month day year like "January 1, 2000" `/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+),?\s+((19|20)\d{2})/g`. Captures: month, day, year.
 * @property {RegExp} DatePipeCapture - Matches and captures pipe-prefixed year/date tags `/(\|\s*)(.*?(%year%|%date%))/g`. Captures: pipe+space, tag.
 * @property {RegExp} DatePipeCheck - Matches pipe-separated %year%/%date% tags `/\|.*?(%year%|%date%)/`.
 * @property {RegExp} DatePipeThreeDigits - Matches three digits separated by pipes with optional spaces `/(\d+)\s*\|(\d+)\s*\|(\d+)\s*`/.
 * @property {RegExp} DateYearBracketed - Matches bracketed years `/(\[|\()\d{4}(\]|\))/`. Captures: open, close.
 * @property {RegExp} DateYearLeading - Matches leading year prefixes `/^\s*[[({]?\d{4}[\])}]?\s*[-.]\s*`/.
 * @property {RegExp} DateYearPlain - Matches standalone 4-digit years `/\d{4}/`.
 *
 * @property {RegExp} TimeColonFormat - Matches time in mm:ss format `/\d+:\d+/`.
 * @property {RegExp} TimeLeadingZero - Matches leading zeros in times `/(^|[^\d])0(\d)(:\d\d$)/g`. Captures: prefix, digit, suffix.
 * @property {RegExp} TimeMinSec - Matches time in 'min sec' format `/\d+\s*min\s*\d+\s*sec/i`.
 * @property {RegExp} TimeRange - Matches time ranges `/^\s*(\d+)\s*-\s*(\d+)\s*$/`. Captures: start, end.
 * @property {RegExp} TimeSingleDigit - Matches single digits after `:` in times `/:(\d([^\d]|$))/g`. Captures: digit, suffix.
 *
 * @property {RegExp} NumDigit - Matches single digit `/\d/`.
 * @property {RegExp} NumHttpStatus - Matches 3-digit HTTP status codes `/\b\d{3}\b/`. Captures: status code.
 * @property {RegExp} NumLeading - Matches digits at start `/^\d+/`.
 * @property {RegExp} NumNonDigits - Matches non-digits `/\D/g`.
 * @property {RegExp} NumNonNumeric - Matches non-numeric `/[^0-9.,-]/g`.
 * @property {RegExp} NumNonNumericStrict - Matches anything not a digit, + or - `/[^0-9+-]/g`.
 * @property {RegExp} NumTrailing - Matches digits at end `/\d+$/`.
 *
 * @property {RegExp} CommaEnclosed - Matches ",something," (enclosed content) `/,[^,]+,/`.
 * @property {RegExp} CommaLeading - Matches leading `,` `/^,/`.
 * @property {RegExp} CommaLeadingTrailing - Matches leading/trailing `,` and spaces `/^[,\s]+|[,\s]+$/g`.
 * @property {RegExp} CommaMultiple - Matches 2+ consecutive `,` `/,+/g`.
 * @property {RegExp} CommaNoSpace - Matches `,` without following space `/,(?=\S)/g`.
 * @property {RegExp} CommaPadded - Matches space before `,` without following space `/ ?,(?=\S)/g`.
 * @property {RegExp} CommaSpace - Matches comma followed by space `/, /g`.
 * @property {RegExp} CommaSpaceDigits - Matches `,` (space?) digits `/(,(|\s+)\d+)/gi`. Captures: match, space.
 * @property {RegExp} CommaSpaceOptional - Matches `, ,?` `/, ,?/g`.
 * @property {RegExp} CommaSpaced - Matches ` , ` `/ , /g`.
 * @property {RegExp} CommaTrailing - Matches trailing `,` `/,$/`.
 * @property {RegExp} CommaTrim - Matches spaces and edge `,` for trimming `/\s+|^,+|,+$/g`.
 * @property {RegExp} CommaWhitespace - Matches comma followed by any whitespace `/,\s/`.
 *
 * @property {RegExp} DelimColonComma - Matches `:, ` `/:,/g`.
 * @property {RegExp} DelimEquals - Matches all equals signs `/=/g`.
 * @property {RegExp} DelimEqualsLine - Matches entire lines consisting of one or more equals signs `/^=+$/`.
 * @property {RegExp} DelimListPunct - Matches list punctuation (comma, parens, brackets, percent) `/[,()[\]%]/gi`.
 * @property {RegExp} DelimPipe - Matches `| ` `/\|/g`.
 * @property {RegExp} DelimPipeComma - Matches `|` with optional `,` `/\|,?/g`.
 * @property {RegExp} DelimPipeSingle - Matches a single pipe character `/\|/`.
 * @property {RegExp} DelimPipeSpace - Matches pipes with optional spaces `/\s*\|\s*`/.
 * @property {RegExp} DelimPipeTrailing - Matches trailing `|` with padding `/\s*\|$/`.
 * @property {RegExp} DelimSemicolon - Matches `;` `/;/g`.
 * @property {RegExp} DelimZeroWidthColonCommaAnd - Matches zero-width space with colon/comma or " and " `/\u200b:\s|\u200b,\s|\s\u200band\s/`.
 * @property {RegExp} DelimZeroWidthComma - Matches zero-width space followed by comma and space `/\u200b,\s/`.
 * @property {RegExp} DelimZeroWidthPipe - Matches zero-width `|` patterns `/\s\u200b\|[\d.,\s]*?;/g`.
 * @property {RegExp} DelimZeroWidthPipeMulti - Matches multiline zero-width `|` patterns `/\u200b\|[\d.,\s]*?$/gm`.
 * @property {RegExp} DelimZeroWidthPipeNumbersEnd - Matches zero-width space pipe followed by numbers at line end `/\u200b\|[\d.,\s]*$/gm`.
 * @property {RegExp} DelimZeroWidthPipeNumbersSemicolon - Matches zero-width space pipe followed by numbers and semicolon `/\u200b\|[\d.,\s]*;/g`.
 *
 * @property {RegExp} EdgeBulletTrailing - Matches trailing bullet `•` with optional space `/\u2219\s?$/`.
 * @property {RegExp} EdgeBulletPipeLeading - Matches bullet or pipe at line start with space `/^\u2219\s|^\|\s+/`.
 * @property {RegExp} EdgeColonLeading - Matches leading `: ` `/^:/g`.
 * @property {RegExp} EdgeDashTrailingPadded - Matches trailing " - " (dash + optional spaces) `/-\s*$/g`.
 * @property {RegExp} EdgeDotAfterNonUpper - Matches `.` after non-uppercase `/([^A-Z])\.$/`. Captures: letter.
 * @property {RegExp} EdgeDotLeading - Matches leading `.` `/^\./`.
 * @property {RegExp} EdgeDotQuote - Matches dot before quote without space `/\."([^\s"])/g`. Captures: next char.
 * @property {RegExp} EdgeDotSingleTrailing - Matches single trailing dot `/\.$/`.
 * @property {RegExp} EdgeDotSpaceTrailing - Matches trailing `./spaces` `/[\.\s]+$/g`.
 * @property {RegExp} EdgeDotTrailing - Matches trailing `.` `/\.+$/`.
 * @property {RegExp} EdgeFullStop - Matches periods needing line breaks `/([^A-Z.\s])\.([^a-z\s\d.'"\u201d,;/)[\]])/g`. Captures: prev, next.
 * @property {RegExp} EdgeNonDigitColon - Matches non-digit before `:` `/([^\d]):/g`. Captures: non-digit.
 *
 * @property {RegExp} PunctAll - Matches extended punctuation `/[.,!?:;'\u2019"\u201C\u201D\-_()[\]\u2010\s+]/g`.
 * @property {RegExp} PunctAllExtended - Matches extended punctuation set including ellipsis `/[.\u2026,!?:;'\u2019"\-_\u2010\s+]/g`.
 * @property {RegExp} PunctAllExtended2 - Matches extended punctuation set including "&" `/[.,!?:;'\u2019"_\u2010+()[\]&]/g`.
 * @property {RegExp} PunctAngle - Matches `< > ` `/[<>]/g`.
 * @property {RegExp} PunctAsteriskPadding - Matches spaces around `*` `/\s*\*\s*`/g.
 * @property {RegExp} PunctBackslash - Matches forward or back slash `/[\\/]/g`.
 * @property {RegExp} PunctBasic - Matches basic punctuation `/[^\w\s]/g`.
 * @property {RegExp} PunctBrace - Matches `{ } ` `/[{}]/g`.
 * @property {RegExp} PunctBracket - Matches `[ ] ` `/[[\]]/g`.
 * @property {RegExp} PunctBracketed - Matches content in `[ ]` `/\[.*?\]/g`.
 * @property {RegExp} PunctBracketsParens - Matches brackets and parentheses together `/[[()\]]/g`.
 * @property {RegExp} PunctColonDigit - Matches punctuation colon space digit `/[.,]:\s\d+/g`.
 * @property {RegExp} PunctCommaDash - Matches comma or dash `/[,-]/`.
 * @property {RegExp} PunctCommaDotSpace - Matches commas, dots, or spaces `/[,.\s]/g`.
 * @property {RegExp} PunctCommaSemicolonSpace - Matches one or more comma, semicolon, or space `/[,; ]+/`.
 * @property {RegExp} PunctDollar - Matches `$` `/\$/g`.
 * @property {RegExp} PunctEmptyContainers - Matches empty () or [] (with optional internal spaces) `/\(\s*\)|\[\s*\]/g`.
 * @property {RegExp} PunctEmptyParen - Matches empty parentheses `/\(\)/g`.
 * @property {RegExp} PunctListExtra - Matches additional list punctuation including % `/[()[\],%]/g`.
 * @property {RegExp} PunctNumberParen - Matches parenthesized numbers like "(12)" `/\(\d+\)/`.
 * @property {RegExp} PunctParen - Matches parentheses only `/[()]/g`.
 * @property {RegExp} PunctParenSemicolon - Matches paren semicolon space `/\(;\s/g`.
 * @property {RegExp} PunctParenWord - Matches `)` before word `/\)(?=\w)/g`.
 * @property {RegExp} PunctParenthesized - Matches content in `( )` `/\([^)]+\)/g`.
 * @property {RegExp} PunctPlus - Matches plus sign `/\+/g`.
 * @property {RegExp} PunctQuestion - Matches `? ` `/\?/g`.
 * @property {RegExp} PunctQuoteBracket - Matches `" [ ]` `/["[\]]/`.
 * @property {RegExp} PunctQuoteDouble - Matches `" ` `/"/g`.
 * @property {RegExp} PunctSeparatorsExtra - Matches slash, pipe or colon `/[/|:]/g`.
 * @property {RegExp} PunctSpaceSlash - Matches space or forward slash `/[\s/]/g`.
 * @property {RegExp} PunctUnderscore - Matches underscore `/_/g`.
 * @property {RegExp} PunctWildcard - Matches asterisk or question mark `/[*?]/`.
 * @property {RegExp} PunctWordParen - Matches word before `(` `/(\w)\(/g`. Captures: word.
 *
 * @property {RegExp} BreakCarriage - Matches `\r ` `/\r/g`.
 * @property {RegExp} BreakDotNewline - Matches dot followed by newlines `/\.\n+/g`.
 * @property {RegExp} BreakLine - Matches `\r?\n|\r ` `/\r?\n|\r/g`.
 * @property {RegExp} BreakLineMulti - Matches line breaks `/(\r\n|\n|\r)/gm`. Captures: break.
 * @property {RegExp} BreakMultipleCRLF - Matches multiple CRLF `/(\r\n)(\r\n)+/g`.
 * @property {RegExp} BreakMultipleNewline - Matches multiple newlines `/\n+/g`.
 * @property {RegExp} BreakMultipleThreeNewline - Matches three or more spaced CRLF `/(?:\s*\r\n){3,}/g`.
 * @property {RegExp} BreakNewline - Matches `\n ` `/\n/g`.
 *
 * @property {RegExp} SpaceAll - Matches 1+ whitespace `/\s+/g`.
 * @property {RegExp} SpaceDouble - Matches exactly two consecutive space characters `/ {2}/g`.
 * @property {RegExp} SpaceDoubleAny - Matches exactly two consecutive whitespace characters `/\s{2}/g`.
 * @property {RegExp} SpaceEach - Matches every individual whitespace character `/\s/g`.
 * @property {RegExp} SpaceInvisible - Matches Unicode invisible/zero-width characters `/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g`.
 * @property {RegExp} SpaceLeading - Matches leading whitespace (1+) `/^\s+/`.
 * @property {RegExp} SpaceLeadingMultiline - Matches leading spaces per line `/^ +/gm`.
 * @property {RegExp} SpaceLeadingSingle - Matches one leading whitespace `/^\s/`.
 * @property {RegExp} SpaceLeadingTrailing - Matches leading/trailing whitespace `/^\s+|\s+$/g`.
 * @property {RegExp} SpaceMultiple - Matches 2+ spaces `/ {2,}/g`.
 * @property {RegExp} SpaceMultipleAny - Matches 2+ whitespace `/\s{2,}/g`.
 * @property {RegExp} SpaceMultipleTwo - Matches two or more consecutive whitespace `/\s\s+/g`.
 * @property {RegExp} SpaceNon - Matches non-whitespace `/\S/g`.
 * @property {RegExp} SpaceNonLeading - Matches internal spaces `/(?! )\s/g`.
 * @property {RegExp} SpaceParenContent - Matches a space followed by parenthesized content `/\s\(.*?\)/`.
 * @property {RegExp} SpaceSingle - Matches single space characters `/ /g`.
 * @property {RegExp} SpaceSingleWithBoundary - Matches a space followed by a word boundary `/ \b/`.
 * @property {RegExp} SpaceTrailing - Matches trailing whitespace (1+) `/\s+$/`.
 * @property {RegExp} SpaceTrailingSingle - Matches one trailing whitespace `/\s$/`.
 *
 * @property {RegExp} TextAlbumDisc - Matches album disc suffixes `/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Dis(c|k)\s*\d|Dis(c|k)\s*(III|II|I|One|Two|Three)\b/gi`.
 * @property {RegExp} TextAlbumEdition - Matches album edition suffixes `/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Dis(c|k)\s*\d|Dis(c|k)\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi`.
 * @property {RegExp} TextAmpersand - Matches `and` or `/` for replacement with `&` `/\band\b|\//gi`.
 * @property {RegExp} TextAndConnector - Matches " and " with spaces `/ and /gi`.
 * @property {RegExp} TextApostrophe - Matches apostrophe/quote variants `/\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(?:;|)|â€˜(?:;|)|&apos(?:;|)|&#39(?:;|)|(?:&#(?:039|8216|8217|8220|8221|8222|8223|x27);)/g`.
 * @property {RegExp} TextCodecAtscA52 - Matches Dolby Digital codecs `/atsc a\/52/i`.
 * @property {RegExp} TextDash - Matches dash/hyphen variants `/[\u2010\u2011\u2012\u2013\u2014]/g`.
 * @property {RegExp} TextDashLeading - Matches leading ` - ` `/^\s-\s/`.
 * @property {RegExp} TextDashMultiple - Matches one or more consecutive dashes `/-+/g`.
 * @property {RegExp} TextDashPadded - Matches padded dash `/ - /`.
 * @property {RegExp} TextDollarParen - Matches `$` to `(` for replacements `/\$.*?\(/gi`.
 * @property {RegExp} TextInPadded - Matches "in" with optional spaces `/\s*in\s/`.
 * @property {RegExp} TextJunior - Matches ", Jr." suffix `/, Jr\./g`.
 * @property {RegExp} TextNonAscii - Matches non-ASCII characters `/[^\u0000-\u007E]/g`.
 * @property {RegExp} TextPhD - Matches 'Ph.D.' `/Ph\.D\./g`.
 * @property {RegExp} TextPrefixThe - Matches leading `The ` (case-insens.) `/^[Tt]he\s+/i`.
 * @property {RegExp} TextPrefixTheThe - Matches exact string "The The" case-insensitively `/^The The$/i`.
 * @property {RegExp} TextTatu - Matches "t.A.T.u." typo `/t\.\r\n\r\nA.T.u./g`.
 * @property {RegExp} TextTitleWord - Matches words for title-casing `/[A-Za-z0-9\u00C0-\u00FF]+[^\s-/]*`/g.
 * @property {RegExp} TextWordBoundary - Matches word-start chars `/\b\w/g`.
 * @property {RegExp} TextWords - Matches all word sequences `/\S+/g`.
 *
 * @property {RegExp} UniBrokenPipe - Matches broken pipe `¦` or normal pipe `| ` `/[\u00a6|]/g`.
 * @property {RegExp} UniColon - Matches full-width `：` `/\uFF1A/g`.
 * @property {RegExp} UniEnDash - Matches en dash `/\u2013/g`.
 * @property {RegExp} UniMinus - Matches minus sign `/\u2212/g`.
 * @property {RegExp} UniMultiply - Matches `×` `/\u00D7/g`.
 * @property {RegExp} UniParenLeft - Matches `/\uFF08/g`.
 * @property {RegExp} UniParenRight - Matches `/\uFF09/g`.
 * @property {RegExp} UniZeroWidth - Matches zero-width spaces `/\u200b/g`.
 * @property {RegExp} UniZeroWidthPipe - Matches zero-width space followed by pipe `/\u200b\|/`.
 *
 * @property {RegExp} HtmlEntityAmp  - Matches `&amp` (with/without `;`) `/&amp(?:;|)/g`.
 * @property {RegExp} HtmlEntityGt - Matches `&gt` (with/without `;`) `/&gt(?:;|)/g`.
 * @property {RegExp} HtmlEntityLt - Matches `&lt` (with/without `;`) `/&lt(?:;|)/g`.
 * @property {RegExp} HtmlEntityMinus - Matches `&minus;` `/&minus;/g`.
 * @property {RegExp} HtmlEntityNbsp - Matches `&nbsp` (with/without `;`) `/&nbsp(?:;|)/g`.
 * @property {RegExp} HtmlEntityNbspVariant - Matches `&nbsp;` or `{{nbsp}}` `/&nbsp;|{{nbsp}}/g`.
 * @property {RegExp} HtmlEntityNdash - Matches `&ndash;`, `mdash`, or `{{ndash}}` `/&ndash;|mdash|{{ndash}}/gi`.
 * @property {RegExp} HtmlEntityQuot - Matches `&quot` (with/without `;`) `/&quot(?:;|)/g`.
 * @property {RegExp} HtmlTagAny - Matches any HTML tag `/<[^<>]*>/g`.
 * @property {RegExp} HtmlTagBr - Matches `<br>` `/<br>/gi`.
 * @property {RegExp} HtmlTagBrVariants - Matches br tag variants `/<\/?br\s?\/?>/gi`.
 * @property {RegExp} HtmlTagComment - Matches HTML comments `/<!--([\s\S]*?)-->/g`. Captures: comment content.
 * @property {RegExp} HtmlTagGeneric - Matches any HTML tag (strict) `/<[^>]+>/ig`.
 * @property {RegExp} HtmlTagH2Close - Matches closing H2 tag `/<\/h2>/i`.
 * @property {RegExp} HtmlTagH3Close - Matches closing H3 tag `/<\/h3>/i`.
 * @property {RegExp} HtmlTagH4Close - Matches closing H4 tag `/<\/H4>/gi`.
 * @property {RegExp} HtmlTagLiClosePadded - Matches padded closing LI tag `/\s*<\/LI>\s*`/gi.
 * @property {RegExp} HtmlTagNowiki - Matches nowiki tags `/<\/?nowiki\/>/g`.
 * @property {RegExp} HtmlTagParaClose - Matches closing p tag `/<\/p>/gi`.
 * @property {RegExp} HtmlTagParaEmpty - Matches empty p tags `/<P><\/P>/gi`.
 * @property {RegExp} HtmlTagParaOpen - Matches opening p tag with attributes `/<p[^>]*>/gi`.
 * @property {RegExp} HtmlTagRef - Matches reference tags `/<ref[\s\S]+?(<\/ref>|\/>)/g`.
 * @property {RegExp} HtmlTagSmall - Matches small tags `/<\/?small>/g`.
 * @property {RegExp} HtmlTagSpanClose - Matches closing span tag `/<\/span>/g`.
 * @property {RegExp} HtmlTagSpanOpenCapture - Matches opening span tag with attributes `/<span([\s\S]+?)>/g`. Captures: attributes.
 * @property {RegExp} HtmlTagSupClose - Matches closing sup tag `/<\/sup>/g`.
 * @property {RegExp} HtmlTagSupOpen - Matches opening sup tag `/<sup>/g`.
 *
 * @property {RegExp} WebAllMusicDataReleaseYear - Matches data-releaseyear attribute `/data-releaseyear=\s*"\s*\d+\s*"/i`.
 * @property {RegExp} WebAllMusicRating - Matches AllMusic rating class `/allmusicRating ratingAllmusic(\d)/i`. Captures: digit.
 * @property {RegExp} WebBandcampArtUrlAny - Matches any standalone Bandcamp artwork URL in the page source `/(https?:\/\/f\d*\.bcbits\.com\/img\/a\d{10,}_\d+\.(?:jpg|png))/i`.
 * @property {RegExp} WebBandcampImgSrc - Matches Bandcamp <img> tag src attribute containing the artwork URL `/<img[^>]*src=["'](https?:\/\/f\d*\.bcbits\.com\/img\/a\d{10,}_\d+\.(?:jpg|png))["']/i`.
 * @property {RegExp} WebBandcampPopupImageLink - Matches Bandcamp popupImage link with href containing the artwork URL `/<a[^>]*class=["']?[^"']*\bpopupImage\b[^"']*["']?[^>]*href=["'](https?:\/\/f\d*\.bcbits\.com\/img\/a\d{10,}_\d+\.(?:jpg|png))["']/i`.
 * @property {RegExp} WebBandcampSizeSuffix -Matches the size suffix (_10, _5, _0 etc.) at the end of a Bandcamp image URL before the extension `/_\d+(\.(?:jpg|png))$/i`.
 * @property {RegExp} WebDomain - Matches domain from URL `/:\/\/(www\.)?([^/]+)/`. Captures: optional www., domain.
 * @property {RegExp} WebLastFmDotSpace - Matches "Last.fm: " variant `/Last\.fm: /g`.
 * @property {RegExp} WebLastFmHyphen - Matches "Last-fm:" variant `/Last-fm:/g`.
 * @property {RegExp} WebLastFmImg - Matches Last.fm image URLs `/https:\/\/lastfm\.freetls\.fastly\.net\/i\/u\/(avatar170s)\/[a-f0-9]+(\.(jpg|png|webp))?/gi`. Captures: size, hash, optional ext.
 * @property {RegExp} WebLastFmLine - Matches full Last.fm lines with optional newline `/^Last\.fm: .*$(\n)?/gm`.
 * @property {RegExp} WebLastFmPrefix - Matches Last.fm prefix with space `/^Last\.fm:\s/gm`.
 * @property {RegExp} WebLastFmVariant - Matches Last.fm variants ending with semicolon `/^Last(\.|-)fm:.*?;/g`.
 * @property {RegExp} WebStreaming - Matches streaming sources `/^(http|fy\+|3dydfy:|spotify)/`.
 * @property {RegExp} WebTopLevelDomain - Matches top-level domain `/\.[^/.]+$/`.
 *
 * @property {RegExp} WikiBirthDate - Matches birth date template `/{{birth\sdate([^}]+)}}/gi`.
 * @property {RegExp} WikiBoldItalic - Matches wiki bold/italic markup `/'''?/g`.
 * @property {RegExp} WikiBraceCloseOpen - Matches closing then opening braces `/}}}{{/g`.
 * @property {RegExp} WikiCitationNeeded - Matches citation needed template `/{{citation needed[^}]+}}/g`.
 * @property {RegExp} WikiDash - Matches wiki dash template `/{{-}}/g`.
 * @property {RegExp} WikiDeathDateAndAge - Matches wiki death date and age template parameters `/(\d+)\s*\|(\d+)\s*\|(\d+)\s*\|(\d+)\s*\|?(\d+)?\s*\|?(\d+)?\s*`/.
 * @property {RegExp} WikiDfY - Matches date format y parameter `/df=y\|/i`.
 * @property {RegExp} WikiDfYes - Matches date format yes parameter `/df=yes\|/i`.
 * @property {RegExp} WikiDisambiguationPage - Matches first line of wiki disambiguation pages `/^.*may refer to:$/`.
 * @property {RegExp} WikiDisplayInline - Matches display inline parameter `/\|display=inline/g`.
 * @property {RegExp} WikiDoubleBracketSpace - Matches spaced double brackets `/\]\]\s+\[\[/g`.
 * @property {RegExp} WikiDurationColon - Matches wiki duration template in colon format `/{{Duration\|(\d+:)?\d+:\d+}}/i`. Captures: optional hours.
 * @property {RegExp} WikiDurationColonGlobal - Matches all wiki duration templates in colon format `/{{Duration\|((\d+:)?\d+:\d+)}}/gi`. Captures: full time, optional hours.
 * @property {RegExp} WikiDurationHMS - Matches wiki duration template in HMS format `/{{Duration\|(h=)?(\d+)?\|?m=(\d+)\|s=(\d+)}}/i`. Captures: optional h=, optional hours, minutes, seconds.
 * @property {RegExp} WikiDurationHMSGlobal - Matches all wiki duration templates in HMS format `/{{Duration\|(h=)?(\d+)?\|?m=(\d+)\|s=(\d+)}}/gi`. Captures: optional h=, optional hours, minutes, seconds.
 * @property {RegExp} WikiEdit - Matches edit link `/\[edit\]\s*$/i`.
 * @property {RegExp} WikiEfn - Matches efn template `/{{efn\|([^}]+)}}/g`.
 * @property {RegExp} WikiEmbed - Matches embed for wiki keys `/embed/i`.
 * @property {RegExp} WikiEndDate - Matches end date template `/{{end\s?date\|/gi`.
 * @property {RegExp} WikiExternalLink - Matches external links `/\[https:[^\]]+\]/g`.
 * @property {RegExp} WikiFlagIcon - Matches flagicon template `/{{flagicon\|([^}]+)}}/gi`.
 * @property {RegExp} WikiFlatList - Matches flat list template `/{{Flat\s?list\|/i`.
 * @property {RegExp} WikiHList - Matches hlist template `/{{hlist\|/i`.
 * @property {RegExp} WikiHlistComma - Matches hlist comma template `/{{hlist-comma\s*`/i.
 * @property {RegExp} WikiHlistPattern - Matches hlist patterns `/(\[\[|{{)([^\]}]+)(}}|\]\]) /`.
 * @property {RegExp} WikiInfoboxStart - Matches start of wiki infobox templates `/{{\w*box/`.
 * @property {RegExp} WikiLanguagePrefix - Matches Wikipedia language prefix `/Wikipedia language:\s[A-Z]{2}/`.
 * @property {RegExp} WikiLink - Matches wiki links `/\[\[[^\]]+\]\]/g`.
 * @property {RegExp} WikiLinkOrTemplate - Matches links or templates `/(\[\[|{{)[^\]}]+(}}|\]\])/g`.
 * @property {RegExp} WikiLinkPattern - Matches wiki link patterns `/(\[\[)([^\]]+)\]\]/`.
 * @property {RegExp} WikiLinkPipe - Matches wiki links with pipe `/\[\[[^\]]+?\|/g`.
 * @property {RegExp} WikiListTemplates - Matches various list templates `/{{(hlist|flat\s?list|plain\s?list|unbulleted\s?list)[^|]*\|[^[\]}]+}}/i`.
 * @property {RegExp} WikiModule - Matches module for wiki keys `/module/i`.
 * @property {RegExp} WikiNowrap - Matches nowrap template `/{{\s*nowrap\s*\|([^\n}]+)}}/gi`.
 * @property {RegExp} WikiNumberedListPt - Matches numbered list in pt `/\n\|\d\s*=\s*[^[]+\[\[/g`.
 * @property {RegExp} WikiParamEmpty - Matches empty params `/\|[^=]+=($|\}\})/`.
 * @property {RegExp} WikiParamNoValue - Matches params without value `/\|[^=|]+=($|\}\})/`.
 * @property {RegExp} WikiParamStart - Matches param starts `/(\s*\|[^|=]+=[\s*[{])/g`.
 * @property {RegExp} WikiPlainList - Matches plain list template `/{{plain\s?list\|/i`.
 * @property {RegExp} WikiRedirect - Matches wiki redirect directives `/#REDIRECT/i`.
 * @property {RegExp} WikiRefA - Matches ref a template `/{{ref\|a}}/g`.
 * @property {RegExp} WikiRefn - Matches refn template `/{{refn/g`.
 * @property {RegExp} WikiSectionHeading - Matches wiki section headings `/==+(?:(?!\n)\s?)(?:(?!==|\n)[^])+(?:(?!\n)\s?)==+/g`.
 * @property {RegExp} WikiSeeBelow - Matches (see below) for removal `/\(see below\)/g`.
 * @property {RegExp} WikiSeeLengthVariations - Matches (see length variations) for removal `/\(see length variations\)/gi`.
 * @property {RegExp} WikiSeeList - Matches see list for removal `/\|''See list''/g`.
 * @property {RegExp} WikiSfn - Matches sfn template `/{{sfn\|([^}]+)}}/g`.
 * @property {RegExp} WikiSmall - Matches small template `/{{small\|([^}]+)}}/gi`.
 * @property {RegExp} WikiSpecialChars - Matches wiki special chars `/[[\]{}]/`.
 * @property {RegExp} WikiStartDate - Matches start date template `/{{start\s?date\|/i`.
 * @property {RegExp} WikiStartDateFull - Matches full start date template `/{{start\s?date\|([^}]+?)\}\}/gi`.
 * @property {RegExp} WikiStartDatePattern - Matches plain start date text `/start\s?date/i`.
 * @property {RegExp} WikiStartDateReplace - Matches start date for replacement `/{{start\s?date\|[^}]+\}\}/i`.
 * @property {RegExp} WikiStubDetector - Matches Last.fm placeholder text `/wiki|vikimiz|\u0412\u0438\u043A\u0438|\u7EF4\u57FA/i`.
 * @property {RegExp} WikiTemplate - Matches wiki templates `/{{([^}]+)}}/`.
 * @property {RegExp} WikiThumb - Matches leading thumb newlines `/^thumb\r\n\r\n/i`.
 * @property {RegExp} WikiTitlePt - Matches title in pt `/\s*(title|t\u00edtulo)[^[]+\[\[/gi`.
 * @property {RegExp} WikiTrailingBrace - Matches trailing braces `/\}\}$/`.
 * @property {RegExp} WikiUbl - Matches ubl template `/{{ubl\|/i`.
 * @property {RegExp} WikiUnbulletedList - Matches unbulleted list template `/{{unbulleted\s?list\|/i`.
 *
 * @property {RegExp} TFAlbum - Matches album percent placeholder `/%album%/g`.
 * @property {RegExp} TFAlbumMulti - Matches album multi-value placeholder `/%<album>%/i`.
 * @property {RegExp} TFAlbumArtist - Matches album artist placeholder `/%<album artist>%/i`.
 * @property {RegExp} TFArtistMulti - Matches artist multi-value placeholder `/%<artist>%/i`.
 * @property {RegExp} TFBioAlbum - Matches bio album placeholder `/%bio_album%/gi`.
 * @property {RegExp} TFBioAlbumConditional - Matches conditional expressions around `%bio_album%` `/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi`.
 * @property {RegExp} TFBioAlbumArtist - Matches bio album artist placeholder `/%bio_albumartist%/gi`.
 * @property {RegExp} TFBioAlbumArtistAndArtist - Matches bio album artist variants `/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi`.
 * @property {RegExp} TFBioAlbumArtistConditional - Matches conditional expressions around `%bio_albumartist%` or `%bio_album%` `/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*(%bio_albumartist%|%bio_album%)/gi`.
 * @property {RegExp} TFBioAlbumArtistConditionalStrict - Matches strict conditional expressions around `%bio_albumartist%` `/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi`.
 * @property {RegExp} TFBioArtist - Matches bio artist placeholder `/%bio_artist%/gi`.
 * @property {RegExp} TFBioArtistAndAlbumArtist - Matches bio artist variants `/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi`.
 * @property {RegExp} TFBioArtistConditional - Matches conditional expressions around `%bio_artist%` `/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi`.
 * @property {RegExp} TFBioArtistOrMeta - Matches %artist% or $meta(artist,0) placeholders `/%artist%|\$meta\(artist,0\)/g`.
 * @property {RegExp} TFBioLookupItem - Matches %lookup_item% placeholder `/%lookup_item%/gi`.
 * @property {RegExp} TFBioOpenCapture - Matches `$Bio...(` patterns `/\$Bio.*?\(/gi`. Captures: content.
 * @property {RegExp} TFBioTextReaderStubInfo - Matches %playback_time, %bitrate% or $progress `/%playback_time|%bitrate%|\$progress/i`.
 * @property {RegExp} TFBioTitle - Matches bio title placeholder `/%bio_title%/gi`.
 * @property {RegExp} TFBioTitleConditional - Matches conditional expressions around `%bio_title%` `/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi`.
 * @property {RegExp} TFBioTitleOrMeta - Matches %title% or $meta(title,0) placeholders `/%title%|\$meta\(title,0\)/g`.
 * @property {RegExp} TFPlDiscNumberTotalDiscsSubtitle - Matches %discnumber%, %totaldiscs% or %subtitle% placeholders `/%discnumber%|%totaldiscs%|%subtitle%/g`.
 * @property {RegExp} TFLibColour - Matches colour function `/\$colour{.*?}/g`.
 * @property {RegExp} TFLibNowPlaying - Matches nowplaying function with capture `/\$nowplaying{(.+?)}/`. Captures: content.
 * @property {RegExp} TFLibSearchText - Matches searchtext function `/\$searchtext/g`.
 * @property {RegExp} TFLibSelected - Matches selected function with capture `/\$selected{(.+?)}/`. Captures: content.
 * @property {RegExp} TFLibStripBranchPrefix - Matches strip branch prefix open `/\$stripbranchprefix{/`.
 * @property {RegExp} TFLibSwapBranchPrefix - Matches swap branch prefix open `/\$swapbranchprefix{/`.
 * @property {RegExp} TFLibViewName - Matches %view_name% placeholder `/%view_name%/i`.
 * @property {RegExp} TFLibYearOrDate - Matches %year% or %date% placeholders `/%year%|%date%/`.
 *
 * @property {RegExp} TrackHasNumber - Matches leading 1-2 digit number + non-space `/^\d{1,2} \S/`.
 * @property {RegExp} TrackHasSeparator- Matches track separators `/[-._]/`.
 * @property {RegExp} TrackNumberLeading - Matches leading track numbers with sep `/^\d{1,2}([-.]\d{1,2})?([-. _]+)(?=\S)/`. Captures: main, sub-num, sep.
 *
 * @property {RegExp} BioActive - Matches active dates prefix `/Active/i`.
 * @property {RegExp} BioAlbumGenres - Matches album genres prefix `/Album\sGenres:\s/`.
 * @property {RegExp} BioAlbumRatingCapture - Matches and captures album rating with delimiters `/>>\sAlbum\srating:\s(.*?)\s<<\s{2}/`.
 * @property {RegExp} BioBorn - Matches born prefix `/Born/i`.
 * @property {RegExp} BioComposersLeading - Matches leading composers line `/^Composers:\s/`.
 * @property {RegExp} BioCountsLikeDislikeView - Matches like/dislike/view count fields `/like count|dislike count|view count/i`.
 * @property {RegExp} BioDied - Matches died prefix `/Died/i`.
 * @property {RegExp} BioDisbanded - Matches disbanded prefix `/Disbanded/i`.
 * @property {RegExp} BioDuration - Matches duration prefix with space `/Duration:\s/g`.
 * @property {RegExp} BioDurationLeading - Matches leading duration line `/^Duration:\s/g`.
 * @property {RegExp} BioFooYoutube - Matches foo_youtube field `/foo_youtube/i`.
 * @property {RegExp} BioFormed - Matches formed prefix `/Formed/i`.
 * @property {RegExp} BioGeneral - Matches general wildcard field `/General\*`/i.
 * @property {RegExp} BioGenreMoodTheme - Matches album/track genre/mood/theme with captures `/(Album|Track)\s(Genre|Mood|Theme)(s|):\s/g`. Captures: type, category, plural.
 * @property {RegExp} BioGroupMembers - Matches group members prefix `/Group Members: /g`.
 * @property {RegExp} BioItemProperties - Matches item properties field `/item_properties/i`.
 * @property {RegExp} BioMarkerArtistLocked - Matches locked artist markers `/#\u00a6#\u00a6#.*?#\u00a6#\u00a6#/g`.
 * @property {RegExp} BioMarkerMultiProcessWrapped - Matches wrapped multi-value processing markers `/#!#!#.*?#!#!#/g`.
 * @property {RegExp} BioMarkerShortAtExclAt - Matches short marker `/@!@/g`.
 * @property {RegExp} BioMarkerShortExclAtExcl - Matches short marker `/!@!/g`.
 * @property {RegExp} BioMarkerTFProtected - Matches protected title formatting markers `/#@!.*?#@!/g`.
 * @property {RegExp} BioMarkerTrackIdentifier - Matches lines starting with `!\u00a6` to end of line `/!\u00a6.+?$/gm`.
 * @property {RegExp} BioMembersLeading - Matches leading members line `/^Members:\s/`.
 * @property {RegExp} BioMetadata - Matches metadata wildcard field `/Metadata\*`/i.
 * @property {RegExp} BioMetadataGeneralOther - Matches metadata/general/other wildcards `/Metadata\*|General\*|Other\*`/i.
 * @property {RegExp} BioMetadataShowFalse - Matches and captures metadata show false `/("Metadata\*":\s{\s*?"show":\s)false/`. Captures: prefix.
 * @property {RegExp} BioMoodsAlbumTrack - Matches album/track moods prefix `/(Album\s|Track\s)Moods: /g`.
 * @property {RegExp} BioNowPlaying - Matches nowplaying field `/nowplaying/i`.
 * @property {RegExp} BioOther - Matches sentencia other wildcard field `/Other\*`/i.
 * @property {RegExp} BioRatingLeading - Matches leading rating line with any content `/^Rating: .*$/m`.
 * @property {RegExp} BioReleaseDate - Matches release date field `/Release Date/i`.
 * @property {RegExp} BioSectionsShowTrue - Matches and captures sections show true `/(("Metadata"|"Popularity"|"AllMusic"|"Last.fm"|"Wikipedia"):\s{\s*?"show":\s)true/g`. Captures: prefix, section.
 * @property {RegExp} BioShortDescription - Matches short description field `/Short description/i`.
 * @property {RegExp} BioShowAllMembers - Matches show all members with ellipsis and padding `/\s*Show all members\u2026\s*`/gi.
 * @property {RegExp} BioTagsExclude - Matches excluded tags like asin, bpm, etc. `/\basin\b|\bbpm\b|\bid\b|\bisrc\b|\bcue_|\bmcn\b|\bmd5\b|\bmp3_|\burl\b/i`.
 * @property {RegExp} BioTrackGenre - Matches track genre prefix `/Track\sGenre/`.
 *
 * @property {RegExp} LibMarkerColor - Matches color formatting tags `/@!#.*?@!#/g`.
 * @property {RegExp} LibMarkerDoubleTildeHash - Matches library multi-process marker `/~~#!#/g`.
 * @property {RegExp} LibMarkerDoubleTildePercent - Matches library marker `/~~%/`.
 * @property {RegExp} LibMarkerExcl - Matches exclamation tags `/<!>/g`.
 * @property {RegExp} LibMarkerImgView - Matches image view separator `/\^@\^/g`.
 * @property {RegExp} LibMarkerMultiPercent - Matches multi-value processing tags `/(~~%<|~%<|%<).*?>%/g`.
 * @property {RegExp} LibMarkerMultiProcess - Matches multi-value separator `/#!#/g`.
 * @property {RegExp} LibMarkerNoDisplay - Matches inline hide marker `/#@#/g`.
 * @property {RegExp} LibMarkerNoDisplayContent - Matches no-display content between markers `/#@#.*?#@#/g`.
 * @property {RegExp} LibMarkerPercent - Matches conditional processing tags `/%<.*?>%/g`.
 * @property {RegExp} LibMarkerPercentClose - Matches closing percent marker `/>%/g`.
 * @property {RegExp} LibMarkerPercentOpen - Matches opening percent marker `/%</g`.
 * @property {RegExp} LibMarkerSharpClose - Matches temporary sharp close marker `/#>/g`.
 * @property {RegExp} LibMarkerSharpOpen - Matches temporary sharp open marker `/<#/g`.
 * @property {RegExp} LibMarkerSingleTildeHash - Matches library marker `/~#!#/g`.
 * @property {RegExp} LibMarkerTildeHash - Matches tilde hash marker `/~#~/g`.
 * @property {RegExp} LibMarkerTildePercent - Matches tilde percent marker `/~%/`.
 * @property {RegExp} LibPlayCountRating - Matches play count or auto rating fields `/play(_|)count|auto(_|)rating/`.
 * @property {RegExp} LibSimilarArtist - Matches similar artist with space `/(similar artist)\s/gi`.
 * @property {RegExp} LibTypesPlural - Matches plural types like albums, artists `/(album|artist|top|track)s\s/gi`.
 * @property {RegExp} LibViewBy - Matches view by or leading by `/view by|^by\b/i`.
 * @property {RegExp} LibYearsAlbums - Matches years albums `/years - albums/gi`.
 *
 * @property {RegExp} LyricsFiles - Matches lyric/text files `/\.(lrc|txt)$/`.
 * @property {RegExp} LyricsFilesUnderscore - Matches underscored lyric/text files `/_\.(lrc|txt)$/`.
 * @property {RegExp} LyricsOffset - Matches `[offset:±ms]` `/^\s*\[offset\s*:(.*)\]\s*$/`. Captures: value.
 * @property {RegExp} LyricsTimestamp - Matches `[mm:ss.xx]` `/(\s*)\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}])(\s*)/g`. Captures: space, optional min, sec+ms, space.
 * @property {RegExp} LyricsTimestampEnhanced - Matches `<mm:ss.xx>` `/(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g`. Captures: space, optional min, sec+ms, space.
 * @property {RegExp} LyricsTimestampLeading - Matches 1+ timestamps at line start `/^(\s*\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}]))+/`. Captures: full.
 *
 * @property {RegExp} UtilCleanStr - Matches two letters between the pipe `/.{2}\|.{2}/g`.
 * @property {RegExp} UtilFontDescenders - Matches letters with descenders `/[gjpqy]/`.
 * @property {RegExp} UtilFontNeedsSymbols - Matches symbols/emojis needing fallback `/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2020-\u2021\u2023-\u23F7\u23F9-\u25B5\u25B7-\u26FF]|\uD83E[\uDD10-\uDDFF]/`.
 * @property {RegExp} UtilFontTahoma - Matches tahoma field `/tahoma/i`.
 * @property {RegExp} UtilObjectType - Matches type extraction from toString() `/([a-z]+)(:?\])/i`. Captures: type, optional `:]`.
 * @property {RegExp} UtilRegexEscape - Matches chars needing RegExp escape `/[.*+?^${}()|[\]\\-]/g`.
 * @property {RegExp} UtilRegexParser - Matches stringified regex `/^(!)?\/(.*?)\/([gimsuy]*)$/`. Captures: neg, pat, flags.
 */
/** @global @enum @type {Regex} */
const Regex = {
	// * ARTWORK & IMAGES * //
	ArtAlbumArtExtensions: /\.(jpg|png|webp)$/i,
	ArtAlbumArtWildcard: /(\*|\b(folder|cover|front)\b)\.\*/g,
	ArtDiscArtFilename: /(cd|disc|vinyl)([0-9]*|[a-h])\.(png|jpg)/i,
	ArtDiscArtWildcard: /(\*|\b(cd|disc|vinyl)\b)\.\*/g,
	ArtImageExtensions: /(?:jpe?g|png|webp|gif|bmp)$/i,
	ArtImageFileSortNumber: /_(\d+)\.(jpe?g|png|webp)$/i,
	ArtImageLabelSuffix: / (Records|Recordings|Music)$/,

	// * PATHS & FILESYSTEM * //
	PathBackslash: /\\/g,
	PathBackslashEndsWith: /\\$/,
	PathBackslashPadded: /\s*\\\s*/g,
	PathBackslashSingle: /\\/,
	PathBackslashTrailing: /\\+$/,
	PathDoubleBackslash: /\\\\/g,
	PathDrivePrefix: /^[a-zA-Z]:\\/g,
	PathEscapedDot: /\\\./g,
	PathFileExtension: /\.\w+$/,
	PathFileExtensionFinal: /\.[^/.]+$/,
	PathFilenameExtract: /[^/\\]*$/,
	PathFilenameStrict: /[^\\\/]+$/,
	PathForwardSlash: /\//g,
	PathGlobSpecials: /[\.\+\^\$\(\)\{\}\|\[\]\\\?-]/g,
	PathHiddenSystem: /([/\\]).((?:foobar2000|fb2k)[^/\\]*|cache|local)([/\\])/g,
	PathIllegalFilename: /[<>:"\/\\|?*]+/g,
	PathMultiDisc: /\\(CD|Vinyl|Disc|Bonus|Vol\.?|Volume)\s*(\d+|I{1,3}|IV|V(?:I{0,3}|X)?|X{0,3})$/i,
	PathMultipleDotBackslash: /\.+\\/,
	PathProfileDir: /%profile%\\/i,
	PathProfileDirGlobal: /%profile%\\/gi,
	PathProfileDirStart: /^%profile%\\?/i,
	PathRelativeStartsWith: /^\.\\/,
	PathSeparators: /[/\\|:]/g,
	PathSplitter: /(.*?)\\/gm,
	PathStorageDir: /%storage_folder%\\/i,
	PathStorageDirStart: /^%storage_folder%\\?/i,
	PathUpperOrParent: /[A-Z]|\../,
	PathWildcardAsterisk: /\*/g,

	// * COLORS * //
	ColorHex: /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i,
	ColorHexDigit: /([0-9a-f])/gi,
	ColorHexLeading: /^#/,
	ColorHSL: /^hsla?\((\d{1,3}?),\s*(\d{1,3}%),\s*(\d{1,3}%)(,\s*[01]?\.?\d*)?\)$/,
	ColorHSLCapture: /^hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(,\s*([01]?\.?\d*))?\)$/,
	ColorPercent: /^\d+(\.\d+)*%$/,
	ColorRGB: /^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*[01]?\.?\d*)?\)$/,
	ColorRGBCapture: /^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*([01]?\.?\d*))?\)$/,
	ColorRGBLoose: /\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/,

	// * DATE * //
	DateFull: /^\d+\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(19|20)\d{2}$/i,
	DateMonthDayYear: /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+),?\s+((19|20)\d{2})/g,
	DatePipeCapture: /(\|\s*)(.*?(%year%|%date%))/g,
	DatePipeCheck: /\|.*?(%year%|%date%)/,
	DatePipeThreeDigits: /(\d+)\s*\|(\d+)\s*\|(\d+)\s*/,
	DateYearBracketed: /(\[|\()\d{4}(\]|\))/,
	DateYearLeading: /^\s*[[({]?\d{4}[\])}]?\s*[-.]\s*/,
	DateYearPlain: /\d{4}/,

	// * TIME * //
	TimeColonFormat: /\d+:\d+/,
	TimeLeadingZero: /(^|[^\d])0(\d)(:\d\d$)/g,
	TimeMinSec: /\d+\s*min\s*\d+\s*sec/i,
	TimeRange: /^\s*(\d+)\s*-\s*(\d+)\s*$/,
	TimeSingleDigit: /:(\d([^\d]|$))/g,

	// * NUMERIC * //
	NumDigit: /\d/,
	NumHttpStatus: /\b\d{3}\b/,
	NumLeading: /^\d+/,
	NumNonDigits: /\D/g,
	NumNonNumeric: /[^0-9.,-]/g,
	NumNonNumericStrict: /[^0-9+-]/g,
	NumTrailing: /\d+$/,

	// * COMMAS * //
	CommaEnclosed: /,[^,]+,/,
	CommaLeading: /^,/,
	CommaLeadingTrailing: /^[,\s]+|[,\s]+$/g,
	CommaMultiple: /,+/g,
	CommaNoSpace: /,(?=\S)/g,
	CommaPadded: / ?,(?=\S)/g,
	CommaSpace: /, /g,
	CommaSpaceDigits: /(,(|\s+)\d+)/gi,
	CommaSpaceOptional: /, ,?/g,
	CommaSpaced: / , /g,
	CommaTrailing: /,$/,
	CommaTrim: /\s+|^,+|,+$/g,
	CommaWhitespace: /,\s/,

	// * DELIMITERS * //
	DelimColonComma: /:,/g,
	DelimEquals: /=/g,
	DelimEqualsLine: /^=+$/,
	DelimListPunct: /[,()[\]%]/gi,
	DelimPipe: /\|/g,
	DelimPipeComma: /\|,?/g,
	DelimPipeSingle: /\|/,
	DelimPipeSpace: /\s*\|\s*/,
	DelimPipeTrailing: /\s*\|$/,
	DelimSemicolon: /;/g,
	DelimZeroWidthColonCommaAnd: /\u200b:\s|\u200b,\s|\s\u200band\s/,
	DelimZeroWidthComma: /\u200b,\s/,
	DelimZeroWidthPipe: /\s\u200b\|[\d.,\s]*?;/g,
	DelimZeroWidthPipeMulti: /\u200b\|[\d.,\s]*?$/gm,
	DelimZeroWidthPipeNumbersEnd: /\u200b\|[\d.,\s]*$/gm,
	DelimZeroWidthPipeNumbersSemicolon: /\u200b\|[\d.,\s]*;/g,

	// * EDGE CHARACTERS* //
	EdgeBulletTrailing: /\u2219\s?$/,
	EdgeBulletPipeLeading: /^\u2219\s|^\|\s+/,
	EdgeColonLeading: /^:/g,
	EdgeDashTrailingPadded: /-\s*$/g,
	EdgeDotAfterNonUpper: /([^A-Z])\.$/,
	EdgeDotLeading: /^\./,
	EdgeDotQuote: /\."([^\s"])/g,
	EdgeDotSingleTrailing: /\.$/,
	EdgeDotSpaceTrailing: /[\.\s]+$/g,
	EdgeDotTrailing: /\.+$/,
	EdgeFullStop: /([^A-Z.\s])\.([^a-z\s\d.'"\u201d,;/)[\]])/g,
	EdgeNonDigitColon: /([^\d]):/g,

	// * PUNCTUATION * //
	PunctAll: /[.,!?:;'\u2019"\u201C\u201D\-_()[\]\u2010\s+]/g,
	PunctAllExtended: /[.\u2026,!?:;'\u2019"\-_\u2010\s+]/g,
	PunctAllExtended2: /[.,!?:;'\u2019"_\u2010+()[\]&]/g,
	PunctAngle: /[<>]/g,
	PunctAsteriskPadding: /\s*\*\s*/g,
	PunctBackslash: /[\\/]/g,
	PunctBasic: /[^\w\s]/g,
	PunctBrace: /[{}]/g,
	PunctBracket: /[[\]]/g,
	PunctBracketed: /\[.*?\]/g,
	PunctBracketsParens: /[[()\]]/g,
	PunctColonDigit: /[.,]:\s\d+/g,
	PunctCommaDash: /[,-]/,
	PunctCommaDotSpace: /[,.\s]/g,
	PunctCommaSemicolonSpace: /[,; ]+/,
	PunctDollar: /\$/g,
	PunctEmptyContainers: /\(\s*\)|\[\s*\]/g,
	PunctEmptyParen: /\(\)/g,
	PunctListExtra: /[()[\],%]/g,
	PunctNumberParen: /\(\d+\)/,
	PunctParen: /[()]/g,
	PunctParenSemicolon: /\(;\s/g,
	PunctParenWord: /\)(?=\w)/g,
	PunctParenthesized: /\([^)]+\)/g,
	PunctPlus: /\+/g,
	PunctQuestion: /\?/g,
	PunctQuoteBracket: /["[\]]/,
	PunctQuoteDouble: /"/g,
	PunctSeparatorsExtra: /[/|:]/g,
	PunctSpaceSlash: /[\s/]/g,
	PunctUnderscore: /_/g,
	PunctWildcard: /[*?]/,
	PunctWordParen: /(\w)\(/g,

	// * LINE BREAKS * //
	BreakCarriage: /\r/g,
	BreakDotNewline: /\.\n+/g,
	BreakLine: /\r?\n|\r/g,
	BreakLineMulti: /(\r\n|\n|\r)/gm,
	BreakMultipleCRLF: /(\r\n)(\r\n)+/g,
	BreakMultipleNewline: /\n+/g,
	BreakMultipleThreeNewline: /(?:\s*\r\n){3,}/g,
	BreakNewline: /\n/g,

	// * WHITESPACE * //
	SpaceAll: /\s+/g,
	SpaceDouble: / {2}/g,
	SpaceDoubleAny: /\s{2}/g,
	SpaceEach: /\s/g,
	SpaceInvisible: /[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g,
	SpaceLeading: /^\s+/,
	SpaceLeadingMultiline: /^ +/gm,
	SpaceLeadingSingle: /^\s/,
	SpaceLeadingTrailing: /^\s+|\s+$/g,
	SpaceMultiple: / {2,}/g,
	SpaceMultipleAny: /\s{2,}/g,
	SpaceMultipleTwo: /\s\s+/g,
	SpaceNon: /\S/g,
	SpaceNonLeading: /(?! )\s/g,
	SpaceParenContent: /\s\(.*?\)/,
	SpaceSingle: / /g,
	SpaceSingleWithBoundary: / \b/,
	SpaceTrailing: /\s+$/,
	SpaceTrailingSingle: /\s$/,

	// * TEXT FORMATTING * //
	TextAlbumDisc: /CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Dis(c|k)\s*\d|Dis(c|k)\s*(III|II|I|One|Two|Three)\b/gi,
	TextAlbumEdition: /CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Dis(c|k)\s*\d|Dis(c|k)\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi,
	TextAmpersand: /\band\b|\//gi,
	TextAndConnector: / and /gi,
	TextApostrophe: /\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(?:;|)|â€˜(?:;|)|&apos(?:;|)|&#39(?:;|)|(?:&#(?:039|8216|8217|8220|8221|8222|8223|x27);)/g,
	TextCodecAtscA52: /atsc a\/52/i,
	TextDash: /[\u2010\u2011\u2012\u2013\u2014]/g,
	TextDashLeading: /^\s-\s/,
	TextDashMultiple: /-+/g,
	TextDashPadded: / - /,
	TextDollarParen: /\$.*?\(/gi,
	TextInPadded: /\s*in\s/,
	TextJunior: /, Jr\./g,
	TextNonAscii: /[^\u0000-\u007E]/g,
	TextPhD: /Ph\.D\./g,
	TextPrefixThe: /^[Tt]he\s+/i,
	TextPrefixTheThe: /^The The$/i,
	TextTatu: /t\.\r\n\r\nA.T.u./g,
	TextTitleWord: /[A-Za-z0-9\u00C0-\u00FF]+[^\s-/]*/g,
	TextWordBoundary: /\b\w/g,
	TextWords: /\S+/g,

	// * UNICODE * //
	UniBrokenPipe: /[\u00a6|]/g,
	UniColon: /\uFF1A/g,
	UniEnDash: /\u2013/g,
	UniMinus: /\u2212/g,
	UniMultiply: /\u00D7/g,
	UniParenLeft: /\uFF08/g,
	UniParenRight: /\uFF09/g,
	UniZeroWidth: /\u200b/g,
	UniZeroWidthPipe: /\u200b\|/,

	// * HTML * //
	HtmlEntityAmp: /&amp(?:;|)/g,
	HtmlEntityGt: /&gt(?:;|)/g,
	HtmlEntityLt: /&lt(?:;|)/g,
	HtmlEntityMinus: /&minus;/g,
	HtmlEntityNbsp: /&nbsp(?:;|)/g,
	HtmlEntityNbspVariant: /&nbsp;|{{nbsp}}/g,
	HtmlEntityNdash: /&ndash;|mdash|{{ndash}}/gi,
	HtmlEntityQuot: /&quot(?:;|)/g,
	HtmlTagAny: /<[^<>]*>/g,
	HtmlTagBr: /<br>/gi,
	HtmlTagBrVariants: /<\/?br\s?\/?>/gi,
	HtmlTagComment: /<!--([\s\S]*?)-->/g,
	HtmlTagGeneric: /<[^>]+>/ig,
	HtmlTagH2Close: /<\/h2>/i,
	HtmlTagH3Close: /<\/h3>/i,
	HtmlTagH4Close: /<\/H4>/gi,
	HtmlTagLiClosePadded: /\s*<\/LI>\s*/gi,
	HtmlTagNowiki: /<\/?nowiki\/>/g,
	HtmlTagParaClose: /<\/p>/gi,
	HtmlTagParaEmpty: /<P><\/P>/gi,
	HtmlTagParaOpen: /<p[^>]*>/gi,
	HtmlTagRef: /<ref[\s\S]+?(<\/ref>|\/>)/g,
	HtmlTagSmall: /<\/?small>/g,
	HtmlTagSpanClose: /<\/span>/g,
	HtmlTagSpanOpenCapture: /<span([\s\S]+?)>/g,
	HtmlTagSupClose: /<\/sup>/g,
	HtmlTagSupOpen: /<sup>/g,

	// * WEB * //
	WebAllMusicDataReleaseYear: /data-releaseyear=\s*"\s*\d+\s*"/i,
	WebAllMusicRating: /allmusicRating ratingAllmusic(\d)/i,
	WebBandcampArtUrlAny: /(https?:\/\/f\d*\.bcbits\.com\/img\/a\d{10,}_\d+\.(?:jpg|png))/i,
	WebBandcampImgSrc: /<img[^>]*src=["'](https?:\/\/f\d*\.bcbits\.com\/img\/a\d{10,}_\d+\.(?:jpg|png))["']/i,
	WebBandcampPopupImageLink: /<a[^>]*class=["']?[^"']*\bpopupImage\b[^"']*["']?[^>]*href=["'](https?:\/\/f\d*\.bcbits\.com\/img\/a\d{10,}_\d+\.(?:jpg|png))["']/i,
	WebBandcampSizeSuffix: /_\d+(\.(?:jpg|png))$/i,
	WebDomain: /:\/\/(www\.)?([^/]+)/,
	WebLastFmDotSpace: /Last\.fm: /g,
	WebLastFmHyphen: /Last-fm:/g,
	WebLastFmImg: /https:\/\/lastfm\.freetls\.fastly\.net\/i\/u\/(avatar170s)\/[a-f0-9]+(\.(jpg|png|webp))?/gi,
	WebLastFmLine: /^Last\.fm: .*$(\n)?/gm,
	WebLastFmPrefix: /^Last\.fm:\s/gm,
	WebLastFmVariant: /^Last(\.|-)fm:.*?;/g,
	WebStreaming: /^(http|fy\+|3dydfy:|spotify)/,
	WebTopLevelDomain: /\.[^/.]+$/,

	// * WIKI * //
	WikiBirthDate: /{{birth\sdate([^}]+)}}/gi,
	WikiBoldItalic: /'''?/g,
	WikiBraceCloseOpen: /}}}{{/g,
	WikiCitationNeeded: /{{citation needed[^}]+}}/g,
	WikiDash: /{{-}}/g,
	WikiDeathDateAndAge: /(\d+)\s*\|(\d+)\s*\|(\d+)\s*\|(\d+)\s*\|?(\d+)?\s*\|?(\d+)?\s*/,
	WikiDfY: /df=y\|/i,
	WikiDfYes: /df=yes\|/i,
	WikiDisambiguationPage: /^.*may refer to:$/,
	WikiDisplayInline: /\|display=inline/g,
	WikiDoubleBracketSpace: /\]\]\s+\[\[/g,
	WikiDurationColon: /{{Duration\|(\d+:)?\d+:\d+}}/i,
	WikiDurationColonGlobal: /{{Duration\|((\d+:)?\d+:\d+)}}/gi,
	WikiDurationHMS: /{{Duration\|(h=)?(\d+)?\|?m=(\d+)\|s=(\d+)}}/i,
	WikiDurationHMSGlobal: /{{Duration\|(h=)?(\d+)?\|?m=(\d+)\|s=(\d+)}}/gi,
	WikiEdit: /\[edit\]\s*$/i,
	WikiEfn: /{{efn\|([^}]+)}}/g,
	WikiEmbed: /embed/i,
	WikiEndDate: /{{end\s?date\|/gi,
	WikiExternalLink: /\[https:[^\]]+\]/g,
	WikiFlagIcon: /{{flagicon\|([^}]+)}}/gi,
	WikiFlatList: /{{Flat\s?list\|/i,
	WikiHList: /{{hlist\|/i,
	WikiHlistComma: /{{hlist-comma\s*/i,
	WikiHlistPattern: /(\[\[|{{)([^\]}]+)(}}|\]\]) /,
	WikiInfoboxStart: /{{\w*box/,
	WikiLanguagePrefix: /Wikipedia language:\s[A-Z]{2}/,
	WikiLink: /\[\[[^\]]+\]\]/g,
	WikiLinkOrTemplate: /(\[\[|{{)[^\]}]+(}}|\]\])/g,
	WikiLinkPattern: /(\[\[)([^\]]+)\]\]/,
	WikiLinkPipe: /\[\[[^\]]+?\|/g,
	WikiListTemplates: /{{(hlist|flat\s?list|plain\s?list|unbulleted\s?list)[^|]*\|[^[\]}]+}}/i,
	WikiModule: /module/i,
	WikiNowrap: /{{\s*nowrap\s*\|([^\n}]+)}}/gi,
	WikiNumberedListPt: /\n\|\d\s*=\s*[^[]+\[\[/g,
	WikiParamEmpty: /\|[^=]+=($|\}\})/,
	WikiParamNoValue: /\|[^=|]+=($|\}\})/,
	WikiParamStart: /(\s*\|[^|=]+=[\s*[{])/g,
	WikiPlainList: /{{plain\s?list\|/i,
	WikiRedirect: /#REDIRECT/i,
	WikiRefA: /{{ref\|a}}/g,
	WikiRefn: /{{refn/g,
	WikiSectionHeading: /==+(?:(?!\n)\s?)(?:(?!==|\n)[^])+(?:(?!\n)\s?)==+/g,
	WikiSeeBelow: /\(see below\)/g,
	WikiSeeLengthVariations: /\(see length variations\)/gi,
	WikiSeeList: /\|''See list''/g,
	WikiSfn: /{{sfn\|([^}]+)}}/g,
	WikiSmall: /{{small\|([^}]+)}}/gi,
	WikiSpecialChars: /[[\]{}]/,
	WikiStartDate: /{{start\s?date\|/i,
	WikiStartDateFull: /{{start\s?date\|([^}]+?)\}\}/gi,
	WikiStartDatePattern: /start\s?date/i,
	WikiStartDateReplace: /{{start\s?date\|[^}]+\}\}/i,
	WikiStubDetector: /wiki|vikimiz|\u0412\u0438\u043A\u0438|\u7EF4\u57FA/i,
	WikiTemplate: /{{([^}]+)}}/,
	WikiThumb: /^thumb\r\n\r\n/i,
	WikiTitlePt: /\s*(title|t\u00edtulo)[^[]+\[\[/gi,
	WikiTrailingBrace: /\}\}$/,
	WikiUbl: /{{ubl\|/i,
	WikiUnbulletedList: /{{unbulleted\s?list\|/i,

	// * TITLE FORMAT * //
	TFAlbum: /%album%/g,
	TFAlbumMulti: /%<album>%/i,
	TFAlbumArtist: /%<album artist>%/i,
	TFArtistMulti: /%<artist>%/i,
	TFBioAlbum: /%bio_album%/gi,
	TFBioAlbumConditional: /((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi,
	TFBioAlbumArtist: /%bio_albumartist%/gi,
	TFBioAlbumArtistAndArtist: /%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi,
	TFBioAlbumArtistConditional: /((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*(%bio_albumartist%|%bio_album%)/gi,
	TFBioAlbumArtistConditionalStrict: /((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi,
	TFBioArtist: /%bio_artist%/gi,
	TFBioArtistAndAlbumArtist: /%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi,
	TFBioArtistConditional: /((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi,
	TFBioArtistOrMeta: /%artist%|\$meta\(artist,0\)/g,
	TFBioLookupItem: /%lookup_item%/gi,
	TFBioOpenCapture: /\$Bio.*?\(/gi,
	TFBioTextReaderStubInfo: /%playback_time|%bitrate%|\$progress/i,
	TFBioTitle: /%bio_title%/gi,
	TFBioTitleConditional: /((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi,
	TFBioTitleOrMeta: /%title%|\$meta\(title,0\)/g,
	TFPlDiscNumberTotalDiscsSubtitle: /%discnumber%|%totaldiscs%|%subtitle%/g,
	TFLibColour: /\$colour{.*?}/g,
	TFLibNowPlaying: /\$nowplaying{(.+?)}/,
	TFLibSearchText: /\$searchtext/g,
	TFLibSelected: /\$selected{(.+?)}/,
	TFLibStripBranchPrefix: /\$stripbranchprefix{/,
	TFLibSwapBranchPrefix: /\$swapbranchprefix{/,
	TFLibViewName: /%view_name%/i,
	TFLibYearOrDate: /%year%|%date%/,

	// * TRACK METADATA * //
	TrackHasNumber: /^\d{1,2} \S/,
	TrackHasSeparator: /[-._]/,
	TrackNumberLeading: /^\d{1,2}([-.]\d{1,2})?([-. _]+)(?=\S)/,

	// * BIOGRAPHY * //
	BioActive: /Active/i,
	BioAlbumGenres: /Album\sGenres:\s/,
	BioAlbumRatingCapture: />>\sAlbum\srating:\s(.*?)\s<<\s{2}/,
	BioBorn: /Born/i,
	BioComposersLeading: /^Composers:\s/,
	BioCountsLikeDislikeView: /like count|dislike count|view count/i,
	BioDied: /Died/i,
	BioDisbanded: /Disbanded/i,
	BioDuration: /Duration:\s/g,
	BioDurationLeading: /^Duration:\s/g,
	BioFooYoutube: /foo_youtube/i,
	BioFormed: /Formed/i,
	BioGeneral: /General\*/i,
	BioGenreMoodTheme: /(Album|Track)\s(Genre|Mood|Theme)(s|):\s/g,
	BioGroupMembers: /Group Members: /g,
	BioItemProperties: /item_properties/i,
	BioMarkerArtistLocked: /#\u00a6#\u00a6#.*?#\u00a6#\u00a6#/g,
	BioMarkerMultiProcessWrapped: /#!#!#.*?#!#!#/g,
	BioMarkerShortAtExclAt: /@!@/g,
	BioMarkerShortExclAtExcl: /!@!/g,
	BioMarkerTFProtected: /#@!.*?#@!/g,
	BioMarkerTrackIdentifier: /!\u00a6.+?$/gm,
	BioMembersLeading: /^Members:\s/,
	BioMetadata: /Metadata\*/i,
	BioMetadataGeneralOther: /Metadata\*|General\*|Other\*/i,
	BioMetadataShowFalse: /("Metadata\*":\s{\s*?"show":\s)false/,
	BioMoodsAlbumTrack: /(Album\s|Track\s)Moods: /g,
	BioNowPlaying: /nowplaying/i,
	BioOther: /Other\*/i,
	BioRatingLeading: /^Rating: .*$/m,
	BioReleaseDate: /Release Date/i,
	BioSectionsShowTrue: /(("Metadata"|"Popularity"|"AllMusic"|"Last.fm"|"Wikipedia"):\s{\s*?"show":\s)true/g,
	BioShortDescription: /Short description/i,
	BioShowAllMembers: /\s*Show all members\u2026\s*/gi,
	BioTagsExclude: /\basin\b|\bbpm\b|\bid\b|\bisrc\b|\bcue_|\bmcn\b|\bmd5\b|\bmp3_|\burl\b/i,
	BioTrackGenre: /Track\sGenre/,

	// * LIBRARY * //
	LibMarkerColor: /@!#.*?@!#/g,
	LibMarkerDoubleTildeHash: /~~#!#/g,
	LibMarkerDoubleTildePercent: /~~%/,
	LibMarkerExcl: /<!>/g,
	LibMarkerImgView: /\^@\^/g,
	LibMarkerMultiPercent: /(~~%<|~%<|%<).*?>%/g,
	LibMarkerMultiProcess: /#!#/g,
	LibMarkerNoDisplay: /#@#/g,
	LibMarkerNoDisplayContent: /#@#.*?#@#/g,
	LibMarkerPercent: /%<.*?>%/g,
	LibMarkerPercentClose: />%/g,
	LibMarkerPercentOpen: /%</g,
	LibMarkerSharpClose: /#>/g,
	LibMarkerSharpOpen: /<#/g,
	LibMarkerSingleTildeHash: /~#!#/g,
	LibMarkerTildeHash: /~#~/g,
	LibMarkerTildePercent: /~%/,
	LibPlayCountRating: /play(_|)count|auto(_|)rating/,
	LibSimilarArtist: /(similar artist)\s/gi,
	LibTypesPlural: /(album|artist|top|track)s\s/gi,
	LibViewBy: /view by|^by\b/i,
	LibYearsAlbums: /years - albums/gi,

	// * LYRICS * //
	LyricsFiles: /\.(lrc|txt)$/,
	LyricsFilesUnderscore: /_\.(lrc|txt)$/,
	LyricsOffset: /^\s*\[offset\s*:(.*)\]\s*$/,
	LyricsTimestamp: /(\s*)\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}])(\s*)/g,
	LyricsTimestampEnhanced: /(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g,
	LyricsTimestampLeading: /^(\s*\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}]))+/,

	// * UTILITY * //
	UtilCleanStr: /.{2}\|.{2}/g,
	UtilFontDescenders: /[gjpqy]/,
	UtilFontNeedsSymbols: /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2020-\u2021\u2023-\u23F7\u23F9-\u25B5\u25B7-\u26FF]|\uD83E[\uDD10-\uDDFF]/,
	UtilFontTahoma: /tahoma/i,
	UtilObjectType: /([a-z]+)(:?\])/i,
	UtilRegexEscape: /[.*+?^${}()|[\]\\-]/g,
	UtilRegexParser: /^(!)?\/(.*?)\/([gimsuy]*)$/,
};


///////////////////////
// * FILE SETTINGS * //
///////////////////////
/**
 * A set of file attribute settings that specifies the attributes of a file, used with utils.Glob().
 * For more information, see: http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx.
 * @typedef  {object} FileAttributes
 * @property {number} Archive - The file or directory marked for backup or removal.
 * @property {number} Compressed - The file or directory with data compression.
 * @property {number} Directory - The handle that identifies a directory.
 * @property {number} Encrypted - The file or directory with encrypted data.
 * @property {number} Hidden - The file or directory that is hidden.
 * @property {number} Normal - The file with no other attributes set.
 * @property {number} NotContentIndexed - The file or directory not indexed by content indexing service.
 * @property {number} Offline - The file with data moved to offline storage.
 * @property {number} ReadOnly - The file that is read-only.
 * @property {number} ReparsePoint - The file or directory with an associated reparse point.
 * @property {number} SparseFile - The file that is a sparse file.
 * @property {number} System - The file or directory used by the operating system.
 * @property {number} Temporary - The file used for temporary storage.
 */
/** @global @enum @type {FileAttributes} */
const FileAttributes = {
	Archive: 0x00000020,
	Compressed: 0x00000800,
	Directory: 0x00000010,
	Encrypted: 0x00004000,
	Hidden: 0x00000002,
	Normal: 0x00000080,
	NotContentIndexed: 0x00002000,
	Offline: 0x00001000,
	ReadOnly: 0x00000001,
	ReparsePoint: 0x00000400,
	SparseFile: 0x00000200,
	System: 0x00000004,
	Temporary: 0x00000100
	// Device: 0x00000040, // ! Do Not Use
	// Virtual: 0x00010000; // ! Do not use
};

/**
 * A set of file mode settings that specifies how the operating system should open a file.
 * @typedef  {object} FileMode
 * @property {number} Read - The mode to open a file for reading.
 * @property {number} Write - The mode to open a file for writing.
 * @property {number} Append - The mode to open a file and append to it.
 */
/** @global @enum @type {FileMode} */
const FileMode = {
	Read: 1,
	Write: 2,
	Append: 3
};

/**
 * A set of file type settings that specifies the file format.
 * @typedef  {object} FileType
 * @property {number} SystemDefault - The system default file format.
 * @property {number} Unicode - The Unicode file format.
 * @property {number} Ascii - The ASCII file format.
 */
/** @global @enum @type {FileType} */
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
 * @typedef  {object} ButtonState
 * @property {number} Default - The default button state.
 * @property {number} Hovered - The hovered button state.
 * @property {number} Down - The button is pressed down.
 * @property {number} Enabled - The button is enabled.
 */
/** @global @enum @type {ButtonState} */
const ButtonState = {
	Default: 0,
	Hovered: 1,
	Down:    2,
	Enabled: 3
};

/**
 * A set of all hyperlink state settings.
 * @typedef  {object} HyperlinkStates
 * @property {number} Normal - The normal hyperlink state.
 * @property {number} Hovered - The hovered hyperlink state.
 */
/** @global @enum @type {HyperlinkStates} */
const HyperlinkStates = {
	Normal: 0,
	Hovered: 1
};

/**
 * A set of all available foobar playback order state settings.
 * @typedef  {object} PlaybackOrder
 * @property {number} Default - The default playback order.
 * @property {number} RepeatPlaylist - The order to repeat the entire playlist.
 * @property {number} RepeatTrack - The order to repeat the current track.
 * @property {number} Random - The order to play tracks in random order.
 * @property {number} ShuffleTracks - The order to shuffle tracks.
 * @property {number} ShuffleAlbums - The order to shuffle albums.
 * @property {number} ShuffleFolders - The order to shuffle folders.
 */
/** @global @enum @type {PlaybackOrder} */
const PlaybackOrder = {
	Default: 0,
	RepeatPlaylist: 1,
	RepeatTrack: 2,
	Random: 3,
	ShuffleTracks: 4,
	ShuffleAlbums: 5,
	ShuffleFolders: 6
};


///////////////////
// * UI WIZARD * //
///////////////////
/**
 * A set of UI Wizard main menu state settings.
 * @typedef  {object} MainMenuState
 * @property {number} Show - The state to show the main menu.
 * @property {number} Hide - The state to hide the main menu.
 * @property {number} Auto - The state to automatically show or hide the main menu.
 */
/** @global @enum @type {MainMenuState} */
const MainMenuState = {
	Show: 0,
	Hide: 1,
	Auto: 2
};

/**
 * A set of UI Wizard window state settings.
 * @typedef  {object} WindowState
 * @property {number} Normal - The window is in normal state.
 * @property {number} Maximized - The window is maximized.
 * @property {number} Fullscreen - The window is fullscreen.
 */
/** @global @enum @type {WindowState} */
const WindowState = {
	Normal: 0,
	Maximized: 1,
	Fullscreen: 2
};

/**
 * A set of UI Wizard frame style settings, see foobar's Preferences > Display > UI Wizard > Frame style.
 * @typedef  {object} FrameStyle
 * @property {number} Default - The default frame style.
 * @property {number} SmallCaption - The frame style with small caption.
 * @property {number} NoCaption - The frame style with no caption.
 * @property {number} NoBorder - The frame style with no border.
 * @property {number} NoBorderAutoHide - The frame style with no border and auto hide.
 */
/** @global @enum @type {FrameStyle} */
const FrameStyle = {
	Default: 0,
	SmallCaption: 1,
	NoCaption: 2,
	NoBorder: 3,
	NoBorderAutoHide: 4
};

/**
 * A set of UI Wizard move style settings, see foobar's Preferences > Display > UI Wizard > Move with.
 * @typedef  {object} MoveStyle
 * @property {number} Default - The default move style.
 * @property {number} Middle - The move style with middle mouse button.
 * @property {number} Left - The move style with left mouse button.
 * @property {number} Both - The move style with both left and middle mouse buttons.
 */
/** @global @enum @type {MoveStyle} */
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
 * A set of country codes that maps two-digit country codes to full names, mostly used for displaying flag images via tags.
 * @typedef  {object} CountryCodes
 * @property {string} US - United States.
 * @property {string} GB - United Kingdom.
 * @property {string} AU - Australia.
 * @property {string} DE - Germany.
 * @property {string} FR - France.
 * @property {string} SE - Sweden.
 * @property {string} NO - Norway.
 * @property {string} IT - Italy.
 * @property {string} JP - Japan.
 * @property {string} CN - China.
 * @property {string} FI - Finland.
 * @property {string} KR - South Korea.
 * @property {string} RU - Russia.
 * @property {string} IE - Ireland.
 * @property {string} GR - Greece.
 * @property {string} IS - Iceland.
 * @property {string} IN - India.
 * @property {string} AD - Andorra.
 * @property {string} AE - United Arab Emirates.
 * @property {string} AF - Afghanistan.
 * @property {string} AG - Antigua and Barbuda.
 * @property {string} AI - Anguilla.
 * @property {string} AL - Albania.
 * @property {string} AM - Armenia.
 * @property {string} AO - Angola.
 * @property {string} AQ - Antarctica.
 * @property {string} AR - Argentina.
 * @property {string} AS - American Samoa.
 * @property {string} AT - Austria.
 * @property {string} AW - Aruba.
 * @property {string} AX - Åland.
 * @property {string} AZ - Azerbaijan.
 * @property {string} BA - Bosnia and Herzegovina.
 * @property {string} BB - Barbados.
 * @property {string} BD - Bangladesh.
 * @property {string} BE - Belgium.
 * @property {string} BF - Burkina Faso.
 * @property {string} BG - Bulgaria.
 * @property {string} BH - Bahrain.
 * @property {string} BI - Burundi.
 * @property {string} BJ - Benin.
 * @property {string} BL - Saint Barthelemy.
 * @property {string} BM - Bermuda.
 * @property {string} BN - Brunei Darussalam.
 * @property {string} BO - Bolivia.
 * @property {string} BQ - Bonaire, Sint Eustatius and Saba.
 * @property {string} BR - Brazil.
 * @property {string} BS - Bahamas.
 * @property {string} BT - Bhutan.
 * @property {string} BV - Bouvet Island.
 * @property {string} BW - Botswana.
 * @property {string} BY - Belarus.
 * @property {string} BZ - Belize.
 * @property {string} CA - Canada.
 * @property {string} CC - Cocos Keeling Islands.
 * @property {string} CD - Democratic Republic of the Congo.
 * @property {string} CF - Central African Republic.
 * @property {string} CH - Switzerland.
 * @property {string} CI - Cote d'Ivoire.
 * @property {string} CK - Cook Islands.
 * @property {string} CL - Chile.
 * @property {string} CM - Cameroon.
 * @property {string} CO - Colombia.
 * @property {string} CR - Costa Rica.
 * @property {string} CU - Cuba.
 * @property {string} CV - Cape Verde.
 * @property {string} CX - Christmas Island.
 * @property {string} CY - Cyprus.
 * @property {string} CZ - Czech Republic.
 * @property {string} DJ - Djibouti.
 * @property {string} DK - Denmark.
 * @property {string} DM - Dominica.
 * @property {string} DO - Dominican Republic.
 * @property {string} DZ - Algeria.
 * @property {string} EC - Ecuador.
 * @property {string} EE - Estonia.
 * @property {string} EG - Egypt.
 * @property {string} EH - Western Sahara.
 * @property {string} ER - Eritrea.
 * @property {string} ES - Spain.
 * @property {string} ET - Ethiopia.
 * @property {string} FJ - Fiji.
 * @property {string} FK - Falkland Islands.
 * @property {string} FM - Micronesia.
 * @property {string} FO - Faroess.
 * @property {string} GA - Gabon.
 * @property {string} GD - Grenada.
 * @property {string} GE - Georgia.
 * @property {string} GG - Guernsey.
 * @property {string} GH - Ghana.
 * @property {string} GI - Gibraltar.
 * @property {string} GL - Greenland.
 * @property {string} GM - Gambia.
 * @property {string} GN - Guinea.
 * @property {string} GQ - Equatorial Guinea.
 * @property {string} GS - South Georgia and the South Sandwich Islands.
 * @property {string} GT - Guatemala.
 * @property {string} GU - Guam.
 * @property {string} GW - Guinea-Bissau.
 * @property {string} GY - Guyana.
 * @property {string} HK - Hong Kong.
 * @property {string} HN - Honduras.
 * @property {string} HR - Croatia.
 * @property {string} HT - Haiti.
 * @property {string} HU - Hungary.
 * @property {string} ID - Indonesia.
 * @property {string} IL - Israel.
 * @property {string} IM - Isle of Man.
 * @property {string} IQ - Iraq.
 * @property {string} IR - Iran.
 * @property {string} JE - Jersey.
 * @property {string} JM - Jamaica.
 * @property {string} JO - Jordan.
 * @property {string} KE - Kenya.
 * @property {string} KG - Kyrgyzstan.
 * @property {string} KH - Cambodia.
 * @property {string} KI - Kiribati.
 * @property {string} KM - Comoros.
 * @property {string} KN - Saint Kitts and Nevis.
 * @property {string} KP - North Korea.
 * @property {string} KW - Kuwait.
 * @property {string} KY - Cayman Islands.
 * @property {string} KZ - Kazakhstan.
 * @property {string} LA - Laos.
 * @property {string} LB - Lebanon.
 * @property {string} LC - Saint Lucia.
 * @property {string} LI - Liechtenstein.
 * @property {string} LK - Sri Lanka.
 * @property {string} LR - Liberia.
 * @property {string} LS - Lesotho.
 * @property {string} LT - Lithuania.
 * @property {string} LU - Luxembourg.
 * @property {string} LV - Latvia.
 * @property {string} LY - Libya.
 * @property {string} MA - Morocco.
 * @property {string} MC - Monaco.
 * @property {string} MD - Moldova.
 * @property {string} ME - Montenegro.
 * @property {string} MF - Saint Martin.
 * @property {string} MG - Madagascar.
 * @property {string} MH - Marshall Islands.
 * @property {string} MK - Macedonia.
 * @property {string} ML - Mali.
 * @property {string} MM - Myanmar.
 * @property {string} MN - Mongolia.
 * @property {string} MO - Macao.
 * @property {string} MP - Northern Mariana Islands.
 * @property {string} MQ - Martinique.
 * @property {string} MR - Mauritania.
 * @property {string} MS - Montserrat.
 * @property {string} MT - Malta.
 * @property {string} MU - Mauritius.
 * @property {string} MV - Maldives.
 * @property {string} MW - Malawi.
 * @property {string} MX - Mexico.
 * @property {string} MY - Malaysia.
 * @property {string} MZ - Mozambique.
 * @property {string} NA - Namibia.
 * @property {string} NC - New Caledonia.
 * @property {string} NE - Niger.
 * @property {string} NF - Norfolk Island.
 * @property {string} NG - Nigeria.
 * @property {string} NI - Nicaragua.
 * @property {string} NL - Netherlands.
 * @property {string} NP - Nepal.
 * @property {string} NR - Nauru.
 * @property {string} NU - Niue.
 * @property {string} NZ - New Zealand.
 * @property {string} OM - Oman.
 * @property {string} PA - Panama.
 * @property {string} PE - Peru.
 * @property {string} PF - French Polynesia.
 * @property {string} PG - Papua New Guinea.
 * @property {string} PH - Philippines.
 * @property {string} PK - Pakistan.
 * @property {string} PL - Poland.
 * @property {string} PM - Saint Pierre and Miquelon.
 * @property {string} PN - Pitcairn.
 * @property {string} PR - Puerto Rico.
 * @property {string} PS - Palestine.
 * @property {string} PT - Portugal.
 * @property {string} PW - Palau.
 * @property {string} PY - Paraguay.
 * @property {string} QA - Qatar.
 * @property {string} RE - Réunion.
 * @property {string} RO - Romania.
 * @property {string} RS - Serbia.
 * @property {string} RW - Rwanda.
 * @property {string} SA - Saudi Arabia.
 * @property {string} SB - Solomon Islands.
 * @property {string} SC - Seychelles.
 * @property {string} SD - Sudan.
 * @property {string} SG - Singapore.
 * @property {string} SH - Saint Helena.
 * @property {string} SI - Slovenia.
 * @property {string} SJ - Svalbard and Jan Mayen.
 * @property {string} SK - Slovakia.
 * @property {string} SL - Sierra Leone.
 * @property {string} SM - San Marino.
 * @property {string} SN - Senegal.
 * @property {string} SO - Somalia.
 * @property {string} SR - Suriname.
 * @property {string} SS - South Sudan.
 * @property {string} ST - Sao Tome and Principe.
 * @property {string} SV - El Salvador.
 * @property {string} SX - Sint Maarten.
 * @property {string} SY - Syrian Arab Republic.
 * @property {string} SZ - Swaziland.
 * @property {string} TC - Turks and Caicos Islands.
 * @property {string} TD - Chad.
 * @property {string} TF - French Southern Territories.
 * @property {string} TG - Togo.
 * @property {string} TH - Thailand.
 * @property {string} TJ - Tajikistan.
 * @property {string} TK - Tokelau.
 * @property {string} TL - Timor-Leste.
 * @property {string} TM - Turkmenistan.
 * @property {string} TN - Tunisia.
 * @property {string} TO - Tonga.
 * @property {string} TR - Turkey.
 * @property {string} TT - Trinidad and Tobago.
 * @property {string} TV - Tuvalu.
 * @property {string} TW - Taiwan.
 * @property {string} TZ - Tanzania.
 * @property {string} UA - Ukraine.
 * @property {string} UG - Uganda.
 * @property {string} UY - Uruguay.
 * @property {string} UZ - Uzbekistan.
 * @property {string} VA - Vatican City.
 * @property {string} VC - Saint Vincent and the Grenadines.
 * @property {string} VE - Venezuela.
 * @property {string} VI - US Virgin Islands.
 * @property {string} VN - Vietnam.
 * @property {string} VU - Vanuatu.
 * @property {string} WF - Wallis and Futuna.
 * @property {string} WS - Samoa.
 * @property {string} XE - European Union - Musicbrainz code for European releases. Council of Europe uses same flag as EU.
 * @property {string} XW - United Nations - Musicbrainz code for all World releases. Uses the UN flag which is the MB standard.
 * @property {string} YE - Yemen.
 * @property {string} YT - Mayotte.
 * @property {string} ZA - South Africa.
 * @property {string} ZM - Zambia.
 * @property {string} ZW - Zimbabwe.
 */
/** @global @enum @type {CountryCodes} */
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
	XE: 'European Union',
	XW: 'United Nations',
	YE: 'Yemen',
	YT: 'Mayotte',
	ZA: 'South Africa',
	ZM: 'Zambia',
	ZW: 'Zimbabwe'
};


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
/** @global @enum @type {MenuFlag} */
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
/** @global @enum @type {MouseKey} */
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
/** @global @enum @type {Cursor} */
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
/** @global @enum @type {VKey} */
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
