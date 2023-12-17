/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Setup                                * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-12-17                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * COMPATIBILITY * //
///////////////////////
/**
 * Detects if user has Internet Explorer installed, needed to render HTML popups.
 * @returns {boolean} Returns `true` if IE installed, otherwise `false`.
 * @type {Function}
 */
let detectIE = false;
detectIE = DetectIE();

/**
 * Detects if the user's system is running on Windows 64 bit.
 * @returns {boolean} Returns `true` if Windows is 64 bit, otherwise `false`.
 * @type {Function}
 */
let detectWin64 = false;
detectWin64 = DetectWin64();

/**
 * Detects if the user's system is running Wine on Linux or MacOs.
 * @returns {boolean} Returns `true` if Wine is running, otherwise `false`.
 * @type {Function}
 */
let detectWine = false;
detectWine = DetectWine();


////////////////
// * COLORS * //
////////////////
/**
 * @typedef  {Object} ColorsObj
 * @property {number=} darkAccent The primary color shaded by 30%.
 * @property {number=} darkAccent_alt The secondary primary color shaded by 30%.
 * @property {number=} accent The primary color shaded by 15%.
 * @property {number=} accent_alt The secondary primary color shaded by 15%.
 * @property {number=} primary The primary theme color generated from artwork.
 * @property {number=} primary_alt The secondary primary theme color generated from artwork.
 * @property {number=} lightAccent The primary color tinted by 20%.
 * @property {number=} lightAccent_alt The secondary primary color tinted by 20%.
 * @property {number=} artist The color of artist text on background.
 * @property {number=} now_playing The color of the lower bar text, including tracknum, title, elapsed and remaining time.
 * @property {number=} info_text The default color of text in metadata grid.
 * @property {number=} bg The background of the entire panel.
 * @property {number=} rating The color of rating stars in metadata grid.
 * @property {number=} hotness The color of hotness text in metadat agrid.
 * @property {number=} timelineAdded The background color for timeline block in Details from added to first played.
 * @property {number=} timelinePlayed The background color for timeline block in Details from first played to last played.
 * @property {number=} timelineUnplayed The background color for timeline block in Details from last played to present time.
 * @property {number=} progressBar The background of the progress bar. Fill will be col.primary.
 * @property {number=} shadow The color of the shadow.
 */

/** @type {ColorsObj} Colors */
const col = {};

/**
 * Calculated primary color brightness used in:
 * - pref.theme === 'white'
 * - pref.theme === 'black'
 * - pref.theme === 'reborn'
 * - pref.theme === 'random'
 * @type {number}
 */
let colBrightness;

/**
 * Calculated secondary color brightness used in:
 * - pref.styleRebornFusion
 * - pref.styleRebornFusion2
 * - pref.styleRebornFusionAccent
 * @type {number}
 */
let colBrightness2;

/**
 * Calculated image brightness used in:
 * - pref.styleBlend
 * - pref.styleBlend2
 * - pref.styleBlackAndWhite
 * - pref.styleBlackAndWhite2
 * - pref.styleBlackAndWhiteReborn
 * @type {number}
 */
let imgBrightness;

/**
 * Blended image from setStyleBlend().
 * @type {GdiBitmap}
 */
let blendedImg;

/**
 * Checks if background color is not full white RGB(255, 255, 255).
 * Used in Reborn/Random theme when init on start or when noAlbumArtStub displayed.
 * @type {boolean}
 */
let isColored;

/**
 * Color definition when to switch text and logos to white or black, used in:
 * - pref.theme === 'white'
 * - pref.theme === 'black'
 * - pref.theme === 'reborn'
 * - pref.theme === 'random'
 * - pref.styleBlend
 * - pref.styleBlend2
 * @type {boolean}
 */
let lightBg;

/**
 * Color definition when to switch text and logos to white or black, used in:
 * - ppt.theme === 1
 * - ppt.theme === 2
 * - ppt.theme === 3
 * - ppt.theme === 4
 * - ppt.theme === 5
 * @type {boolean}
 */
let lightBgLib;

/**
 * Color definition when to switch text and logos to white or black, used in:
 * - pptBio.theme === 1
 * - pptBio.theme === 2
 * - pptBio.theme === 3
 * - pptBio.theme === 4
 * @type {boolean}
 */
let lightBgBio;

/**
 * Color definition for col.bg when to lighten or darken custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 * @type {boolean}
 */
let lightBgMain;

/**
 * Color definition for g_pl_colors.bg when to lighten or darken custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 * @type {boolean}
 */
let lightBgPlaylist;

/**
 * Color definition for col.detailsBg) when to lighten or darken custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 * @type {boolean}
 */
let lightBgDetails;

/**
 * Color definition for ui.col.bg when to lighten or darken custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 * @type {boolean}
 */
let lightBgLibrary;

/**
 * Color definition for uiBio.col.bg when to lighten or darken custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 * @type {boolean}
 */
let lightBgBiography;


//////////////////
// * GEOMETRY * //
//////////////////
/**
 * @typedef  {Object} GeometryObj
 * @property {number} topMenuHeight The height of the top menu.
 * @property {number} lowerBarHeight The height of the song title and time + progress bar area.
 * @property {number} progBarHeight The height of the progress bar.
 * @property {number} waveformBarHeight The height of the waveform bar.
 * @property {number} peakmeterBarHeight The height of the peakmeter bar.
 * @property {number} timelineHeight The height of the timeline.
 * @property {number} metadataGridTooltipHeight The height of the metadata grid tooltip area.
 * @property {number} pauseSize The width and height of the pause button.
 * @property {number} discArtShadow The size of the disc art shadow.
 */

/** @type {GeometryObj} */
const geo = {};

/**
 * Sets the sizes for various UI elements.
 */
function setGeometry() {
	geo.topMenuHeight  = SCALE(40);
	geo.lowerBarHeight = SCALE(120);
	geo.progBarHeight  = SCALE(pref.layout !== 'default' && (pref.styleProgressBarDesign === 'default' || pref.styleProgressBarDesign === 'rounded') ? 10 : 12) + (ww > 1920 ? 2 : 0);
	geo.peakmeterBarHeight = SCALE(pref.layout !== 'default' ? 16 : 26) + (ww > 1920 ? 2 : 0);
	geo.waveformBarHeight  = SCALE(pref.layout !== 'default' ? 16 : 26) + (ww > 1920 ? 2 : 0);
	geo.timelineHeight = Math.round(geo.progBarHeight * 0.66);
	geo.metadataGridTooltipHeight = SCALE(100);
	geo.pauseSize = SCALE(100);
	geo.discArtShadow = SCALE(6);
}


//////////////////
// * POSITION * //
//////////////////
/** @type {number} The width of time string in the lower bar. */
let lowerBarTimeW;
/** @type {number} The height of time string in the lower bar. */
let lowerBarTimeH;
/** @type {number} The x-position of the time string in the lower bar. */
let lowerBarTimeX;
/** @type {number} The y-position of the time string in the lower bar. */
let lowerBarTimeY;
/** @type {number} The y-position of the progress bar in the lower bar. */
let progressBarY;
/** @type {number} The y-position of the peakmeter bar in the lower bar. */
let peakmeterBarY;
/** @type {number} The y-position of the waveform bar in the lower bar. */
let waveformBarY;


///////////////////////
// * STRING OBJECT * //
///////////////////////
/**
 * @typedef  {Object} MetadataGridObj
 * @property {boolean=} age Should the age of the field also be calculated (i.e. add the "(3y 5m 11d)" to `val`).
 * @property {string} label The metadata grid label.
 * @property {string} val The metadata grid value. If `val.trim().length === 0`. The grid entry will not be shown.
 */

/**
 * @typedef  {Object} StringsObj A collection of strings and other objects to be displayed throughout UI.
 * @property {string=} artist The artist will be shown in Details and in the lower bar.
 * @property {string=} composer The composer will be shown in the lower bar if it exist and enabled.
 * @property {string=} album The album will be shown in Details.
 * @property {string=} album_subtitle Currently not used in the theme.
 * @property {string=} disc By default, this string is displayed in the lower bar if there is more than one total disc. Formatted like: "CD1/2".
 * @property {Array<MetadataGridObj>=} grid
 * @property {string=} length The length of the song in MM:SS format.
 * @property {string=} original_artist If %original artist% exist it will be displayed by the right side of the title in the lower bar.
 * @property {string=} time The current time of the song in MM:SS format in the lower bar.
 * @property {string=} title The title of the song.
 * @property {string=} title_lower The title of the song to be displayed above the progress bar. Can include more information such as translation, original artist, etc.
 * @property {string=} tracknum The Tracknumber of the song.
 * @property {*=} trackInfo Currently not used in the theme.
 * @property {string=} year Currently not used in the theme.
 * @property {Timeline=} timeline The timeline object.
 * @property {MetadataGridTooltip=} metadata_grid_tt The metadata grid tooltip object.
 * @property {LowerBarTooltip=} lowerBar_tt The lower bar tooltip object.
 */

/** @type {StringsObj} */
let str = {};


///////////////
// * FONTS * //
///////////////
/**
 * @typedef  {Object} GdiFont
 * @property {GdiFont} top_menu Theme font 'Segoe UI Semibold' used for top menu buttons.
 * @property {GdiFont} top_menu_caption Theme font 'Marlett' used for top menu 🗕 🗖 ✖ caption buttons.
 * @property {GdiFont} top_menu_compact Theme font 'FontAwesome' used for the top menu compact button.
 * @property {GdiFont} lower_bar_artist Theme artist font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} lower_bar_title Theme title font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lower_bar_disc Theme disc font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lower_bar_time Theme time font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} lower_bar_length Theme length font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lower_bar_wave Theme waveform bar font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} guifx Theme font 'Guifx v2 Transports' used for the lower bar transport/playback buttons.
 * @property {GdiFont} pbo_default Theme font 'Guifx v2 Transports' used for the lower bar transport playback order button.
 * @property {GdiFont} pbo_repeat_playlist Theme font 'FontAwesome' used for the lower bar transport playback order button.
 * @property {GdiFont} pbo_repeat_track Theme font 'FontAwesome' used for the lower bar transport playback order button.
 * @property {GdiFont} pbo_shuffle Theme font 'Guifx v2 Transports' used for the lower bar transport playback order button.
 * @property {GdiFont} guifx_reload Theme font 'Guifx v2 Transports' used for the lower bar transport reload button.
 * @property {GdiFont} guifx_volume Theme font 'Guifx v2 Transports' used for the lower bar transport volume button.
 * @property {GdiFont} no_album_art_stub Theme font 'FontAwesome' used for no album art music note symbol.
 * @property {GdiFont} symbol Panel font 'Segoe UI Symbol' used for special chars, scrollbar buttons, etc.
 * @property {GdiFont} notification Theme font 'HelveticaNeueLT Pro 65 Md' used for notifications.
 * @property {GdiFont} popup Theme font 'Segoe UI' used for popups.
 * @property {GdiFont} tooltip Theme font 'HelveticaNeueLT Pro 65 Md' used for styled tooltips.
 * @property {GdiFont} grd_artist Theme font 'HelveticaNeueLT Pro 65 Md' used for metadata grid artist.
 * @property {GdiFont} grd_tracknum Theme font 'HelveticaNeueLT Pro 45 Lt' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid track number.
 * @property {GdiFont} grd_title Theme font 'HelveticaNeueLT Pro 45 Lt' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid title.
 * @property {GdiFont} grd_album Theme font 'HelveticaNeueLT Pro 65 Md' used for metadata grid album.
 * @property {GdiFont} grd_key Theme font 'HelveticaNeueLT Pro 75 Bd' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid key.
 * @property {GdiFont} grd_val Theme font 'HelveticaNeueLT Pro 45 Lt' used for metadata grid value.
 * @property {GdiFont} library Panel font 'Segoe UI' used in the Library.
 * @property {GdiFont} biography Panel font 'Segoe UI' used in the Biography.
 * @property {GdiFont} lyrics Panel font 'Segoe UI' used in the Lyrics.
 * @property {GdiFont} lyricsHighlight Panel font 'Segoe UI' used in Lyrics for synced lines.
 */

/** @type {GdiFont} */
const ft = {};

/** Panel font used as default and panel related elements in Playlist, Library and Biography. */
const fontDefault        = pref.customThemeFonts ? customFont.fontDefault : 'Segoe UI';
const fontSegoeUISymbol  = 'Segoe UI Symbol';
const fontTopMenu        = pref.customThemeFonts ? customFont.fontTopMenu : 'Segoe UI Semibold';
const fontTopMenuCaption = 'Marlett';

const fontGuiFx          = 'Guifx v2 Transports';
const fontAwesome        = 'FontAwesome';
const fontLowerBarArtist = pref.customThemeFonts ? customFont.fontLowerBarArtist : 'HelveticaNeueLT Pro 65 Md';
const fontLowerBarTitle  = pref.customThemeFonts ? customFont.fontLowerBarTitle  : 'HelveticaNeueLT Pro 45 Lt';
const fontLowerBarDisc   = pref.customThemeFonts ? customFont.fontLowerBarDisc   : 'HelveticaNeueLT Pro 45 Lt';
const fontLowerBarTime   = pref.customThemeFonts ? customFont.fontLowerBarTime   : 'HelveticaNeueLT Pro 65 Md';
const fontLowerBarLength = pref.customThemeFonts ? customFont.fontLowerBarLength : 'HelveticaNeueLT Pro 45 Lt';
const fontLowerBarWave   = pref.customThemeFonts ? customFont.fontLowerBarWave   : 'HelveticaNeueLT Pro 65 Md';

const fontNotification   = pref.customThemeFonts ? customFont.fontNotification   : 'HelveticaNeueLT Pro 65 Md';
const fontPopup          = pref.customThemeFonts ? customFont.fontPopup          : 'Segoe UI';
const fontTooltip        = pref.customThemeFonts ? customFont.fontTooltip        : 'HelveticaNeueLT Pro 65 Md';

const fontGridArtist     = pref.customThemeFonts ? customFont.fontGridArtist     : 'HelveticaNeueLT Pro 65 Md';
const fontGridTitle      = pref.customThemeFonts ? customFont.fontGridTitle      : 'HelveticaNeueLT Pro 45 Lt';
const fontGridTitleBold  = pref.customThemeFonts ? customFont.fontGridTitleBold  : 'HelveticaNeueLT Pro 65 Md';
const fontGridAlbum      = pref.customThemeFonts ? customFont.fontGridAlbum      : 'HelveticaNeueLT Pro 65 Md';
const fontGridKey        = pref.customThemeFonts ? customFont.fontGridKey        :
						   detectWine            ? 'HelveticaNeueLT Pro 65 Md'   : 'HelveticaNeueLT Pro 75 Bd';
const fontGridValue      = pref.customThemeFonts ? customFont.fontGridValue      : 'HelveticaNeueLT Pro 45 Lt';

const fontLibrary        = pref.customThemeFonts ? customFont.fontLibrary        : 'Segoe UI';
const fontBiography      = pref.customThemeFonts ? customFont.fontBiography      : 'Segoe UI';
const fontLyrics         = pref.customThemeFonts ? customFont.fontLyrics         : 'Segoe UI';

const fontList = [
	fontDefault, fontSegoeUISymbol, fontTopMenu, fontTopMenuCaption,
	fontGuiFx, fontAwesome, fontLowerBarArtist, fontLowerBarTitle, fontLowerBarDisc, fontLowerBarTime, fontLowerBarLength, fontLowerBarWave,
	fontNotification, fontPopup, fontTooltip,
	fontGridArtist, fontGridTitle, fontGridTitleBold, fontGridAlbum, fontGridKey, fontGridValue,
	fontLibrary, fontBiography, fontLyrics
];

/** @type {boolean} The state of installed fonts on system, will return false if one is missing. */
let fontsInstalled = true;

if (!fontList.every((fontName) => TestFont(fontName))) {
	fontsInstalled = false;
	fb.ShowPopupMessage('Georgia-ReBORN WAS UNABLE TO LOAD SOME FONTS\n\n' +
	'Be sure all fonts from\nfoobar2000\\profile\\georgia-reborn\\fonts\nare correctly installed in these directories:\n\n' +
	'For Windows: C:\\Windows\\Fonts\\\nFor Linux: /usr/share/fonts or ~/.local/share/fonts\n\n' +
	'If you use custom fonts, all your custom fonts need to have\nthe exact font name / font family name in your\n' +
	'foobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc config file.\n\n' +
	'You can also check foobar\'s console ( Top menu > View > Console ),\nit will show font errors with its wrong font names.', 'FONT ERROR WARNING');
}

if (pref.customThemeFonts) {
	console.log('\nUser\'s set custom fonts are being used:\n\n'
		+ `Panel default: ${customFont.fontDefault}\n`
		+ `Top menu: ${customFont.fontTopMenu}\n`
		+ `Lower bar artist: ${customFont.fontLowerBarArtist}\n`
		+ `Lower bar title: ${customFont.fontLowerBarTitle}\n`
		+ `Lower bar disc: ${customFont.fontLowerBarDisc}\n`
		+ `Lower bar time: ${customFont.fontLowerBarTime}\n`
		+ `Lower bar length: ${customFont.fontLowerBarLength}\n`
		+ `Lower bar waveform bar: ${customFont.fontLowerBarWave}\n`
		+ `Notification: ${customFont.fontNotification}\n`
		+ `Popup: ${customFont.fontPopup}\n`
		+ `Tooltip: ${customFont.fontTooltip}\n`
		+ `Grid artist: ${customFont.fontGridArtist}\n`
		+ `Grid title: ${customFont.fontGridTitle}\n`
		+ `Grid title bold: ${customFont.fontGridTitleBold}\n`
		+ `Grid album: ${customFont.fontGridAlbum}\n`
		+ `Grid key: ${customFont.fontGridKey}\n`
		+ `Grid value: ${customFont.fontGridValue}\n`
		+ `Playlist artist normal: ${customFont.playlistArtistNormal}\n`
		+ `Playlist artist playing: ${customFont.playlistArtistPlaying}\n`
		+ `Playlist artist normal compact: ${customFont.playlistArtistNormalCompact}\n`
		+ `Playlist artist playing compact: ${customFont.playlistArtistPlayingCompact}\n`
		+ `Playlist title normal: ${customFont.playlistTitleNormal}\n`
		+ `Playlist title selected: ${customFont.playlistTitleSelected}\n`
		+ `Playlist title playing: ${customFont.playlistTitlePlaying}\n`
		+ `Playlist album: ${customFont.playlistAlbum}\n`
		+ `Playlist date: ${customFont.playlistDate}\n`
		+ `Playlist date compact: ${customFont.playlistDateCompact}\n`
		+ `Playlist info: ${customFont.playlistInfo}\n`
		+ `Playlist cover: ${customFont.playlistCover}\n`
		+ `Playlist playcount: ${customFont.playlistPlaycount}\n`
		+ `Library: ${customFont.fontLibrary}\n`
		+ `Biography: ${customFont.fontBiography}\n`
		+ `Lyrics: ${customFont.fontLyrics}\n\n`
	);
}

/**
 * Creates and sets all theme fonts.
 */
function createFonts() {
	g_tooltip = window.Tooltip;
	if (g_tooltip) {
		g_tooltip.Text = ''; // Just in case
		g_tooltip.SetFont(fontDefault, SCALE(15));
		g_tooltip.SetMaxWidth(SCALE(pref.layout !== 'default' ? 600 : 800));
	}

	// * FONT SIZES * //
	const menuFontSize          = pref[`menuFontSize_${pref.layout}`];
	const menuCaptionFontSize   = pref[`menuFontSize_${pref.layout}`] + 1;
	const lowerBarFontSize      = pref[`lowerBarFontSize_${pref.layout}`];
	const notificationFontSize  = pref[`notificationFontSize_${pref.layout}`];
	const popupFontSize         = pref[`popupFontSize_${pref.layout}`];
	const tooltipFontSize       = pref[`tooltipFontSize_${pref.layout}`];

	const guiFxBtnFontSize      = pref[`transportButtonSize_${pref.layout}`] / 2;
	const pboDefaultBtnFontSize = pref[`transportButtonSize_${pref.layout}`] / 1.6;
	const pboReplayBtnFontSize  = pref[`transportButtonSize_${pref.layout}`] / 2;
	const pboShuffleBtnFontSize = pref[`transportButtonSize_${pref.layout}`] / 1.65;
	const reloadBtnFontSize     = pref[`transportButtonSize_${pref.layout}`] / 1.5;
	const volumeBtnFontSize     = pref[`transportButtonSize_${pref.layout}`] / 1.33;

	const gridArtistFontSize    = pref[`gridArtistFontSize_${pref.layout}`];
	const gridTrackNumFontSize  = pref[`gridTrackNumFontSize_${pref.layout}`];
	const gridTitleFontSize     = pref[`gridTitleFontSize_${pref.layout}`];
	const gridAlbumFontSize     = pref[`gridAlbumFontSize_${pref.layout}`];
	const gridKeyFontSize       = pref[`gridKeyFontSize_${pref.layout}`];
	const gridValueFontSize     = pref[`gridValueFontSize_${pref.layout}`] + 1;

	const playlistFontSize      = pref[`playlistFontSize_${pref.layout}`];
	const libraryFontSize       = ppt[`baseFontSize_${pref.layout}`];
	const biographyFontSize     = pptBio[`baseFontSizeBio_${pref.layout}`];
	const lyricsFontSize        = pref[`lyricsFontSize_${pref.layout}`];

	// * STYLE CHANGE * //
	const artistTitle = pref.showGridArtist_default && pref.showGridTitle_default || pref.showGridArtist_artwork && pref.showGridTitle_artwork;

	// * TOP MENU BUTTONS * //
	ft.top_menu         = Font(fontTopMenu, menuFontSize, 0);
	ft.top_menu_caption = Font(fontTopMenuCaption, menuCaptionFontSize, 0);
	ft.top_menu_compact = Font(fontAwesome, menuFontSize, 0);

	// * LOWER BAR * //
	ft.lower_bar_artist = Font(fontLowerBarArtist, lowerBarFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.lower_bar_title  = Font(fontLowerBarTitle,  lowerBarFontSize, 0);
	ft.lower_bar_disc   = Font(fontLowerBarDisc,   lowerBarFontSize, 0);
	ft.lower_bar_time   = Font(fontLowerBarTime,   lowerBarFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.lower_bar_length = Font(fontLowerBarLength, lowerBarFontSize, 0);
	ft.lower_bar_wave   = Font(fontLowerBarWave,   lowerBarFontSize - 6, pref.customThemeFonts ? g_font_style.bold : 0);

	if (updateHyperlink) updateHyperlink.setFont(ft.lower_bar_title);

	// * LOWER BAR TRANSPORT BUTTONS * //
	ft.guifx               = Font(fontGuiFx,   Math.floor(guiFxBtnFontSize), 0);
	ft.pbo_default         = Font(fontGuiFx,   Math.floor(pboDefaultBtnFontSize), 0);
	ft.pbo_repeat_playlist = Font(fontAwesome, Math.floor(pboReplayBtnFontSize), 0);
	ft.pbo_repeat_track    = Font(fontAwesome, Math.floor(pboReplayBtnFontSize), 0);
	ft.pbo_shuffle         = Font(fontGuiFx,   Math.floor(pboShuffleBtnFontSize), 0);
	ft.guifx_reload        = Font(fontGuiFx,   Math.floor(reloadBtnFontSize), 0);
	ft.guifx_volume        = Font(fontGuiFx,   Math.floor(volumeBtnFontSize), 0);

	// * MISC * //
	ft.no_album_art_stub = Font(fontAwesome, 160, 0);
	ft.symbol            = Font(fontSegoeUISymbol, playlistFontSize, 0);
	ft.notification      = Font(fontNotification, notificationFontSize, 0);
	ft.popup             = Font(fontPopup, popupFontSize, 0);
	ft.tooltip           = Font(fontTooltip, tooltipFontSize, 0);

	if (pref.layout === 'compact') return; // These fonts below are not available in Compact layout, so skip these to prevent errors

	// * DETAILS METADATA GRID * //
	ft.grd_artist   = Font(fontGridArtist, gridArtistFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.grd_tracknum = Font(artistTitle ? fontGridTitle : fontGridTitleBold, gridTrackNumFontSize, 0);
	ft.grd_title    = Font(artistTitle ? fontGridTitle : fontGridTitleBold, gridTitleFontSize, 0);
	ft.grd_album    = Font(fontGridAlbum, gridAlbumFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.grd_key      = Font(fontGridKey, gridKeyFontSize, 0);
	ft.grd_val      = Font(fontGridValue, gridValueFontSize, 0);

	// * LIBRARY * //
	ft.library = Font(fontLibrary, libraryFontSize, 0);

	// * BIOGRAPHY * //
	ft.biography = Font(fontBiography, biographyFontSize, 0);

	// * LYRICS * //
	ft.lyrics          = Font(fontLyrics, lyricsFontSize, 1);
	ft.lyricsHighlight = Font(fontLyrics, lyricsFontSize * 1.5, 1);
}


///////////////
// * PATHS * //
///////////////
/** @type {Object} The Georgia-ReBORN images path object. */
const paths = {};
/** @type {string} The Georgia-ReBORN images path shortcut. */
const imagesPath = `${fb.ProfilePath}georgia-reborn/images/`;

// We expect disc art will be in .png with transparent background, best found at fanart.tv.

// * CD ART ( named cd1.png, cd2.png, etc. ) * //
pref.cdartdisc_path              = `$directory_path(%path%)\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Root -> cd%discnumber%.png
pref.cdartdisc_path_artwork_root = `$directory_path(%path%)\\..\\Artwork\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Root Artwork -> cd%discnumber%.png
pref.cdartdisc_path_images_root  = `$directory_path(%path%)\\..\\Images\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Root Images -> cd%discnumber%.png
pref.cdartdisc_path_scans_root   = `$directory_path(%path%)\\..\\Scans\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Root Scans -> cd%discnumber%.png
pref.cdartdisc_path_artwork      = `$directory_path(%path%)\\Artwork\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Subfolder Artwork -> cd%discnumber%.png
pref.cdartdisc_path_images       = `$directory_path(%path%)\\Images\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Subfolder Images -> cd%discnumber%.png
pref.cdartdisc_path_scans        = `$directory_path(%path%)\\Scans\\${settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`; // Subfolder Scans -> cd%discnumber%.png

// * CD ART ( named cd.png (or whatever custom value was specified). This is the most common single disc case. ) * //
pref.cdart_path                  = `$directory_path(%path%)\\${settings.discArtBasename}.png`; // Root -> cd.png
pref.cdart_path_artwork_root     = `$directory_path(%path%)\\..\\Artwork\\${settings.discArtBasename}.png`; // Root Artwork -> cd.png
pref.cdart_path_images_root      = `$directory_path(%path%)\\..\\Images\\${settings.discArtBasename}.png`; // Root Images -> cd.png
pref.cdart_path_scans_root       = `$directory_path(%path%)\\..\\Scans\\${settings.discArtBasename}.png`; // Root Scans -> cd.png
pref.cdart_path_artwork          = `$directory_path(%path%)\\Artwork\\${settings.discArtBasename}.png`; // Subfolder Artwork -> cd.png
pref.cdart_path_images           = `$directory_path(%path%)\\Images\\${settings.discArtBasename}.png`; // Subfolder Images -> cd.png
pref.cdart_path_scans            = `$directory_path(%path%)\\Scans\\${settings.discArtBasename}.png`; // Subfolder Scans -> cd.png

// * VINYL DISC ART ( named vinylA.png, vinylB.png, etc. ) * //
pref.vinylside_path              = `$directory_path(%path%)\\vinyl$if2(${tf.vinyl_side},).png`; // Root -> vinyl side
pref.vinylside_path_artwork_root = `$directory_path(%path%)\\..\\Artwork\\vinyl$if2(${tf.vinyl_side},).png`; // Root Artwork -> vinyl%vinyl disc%.png
pref.vinylside_path_images_root  = `$directory_path(%path%)\\..\\Images\\vinyl$if2(${tf.vinyl_side},).png`; // Root Images -> vinyl%vinyl disc%.png
pref.vinylside_path_scans_root   = `$directory_path(%path%)\\..\\Scans\\vinyl$if2(${tf.vinyl_side},).png`; // Root Scans -> vinyl%vinyl disc%.png
pref.vinylside_path_artwork      = `$directory_path(%path%)\\Artwork\\vinyl$if2(${tf.vinyl_side},).png`; // Subfolder Artwork -> vinyl%vinyl disc%.png
pref.vinylside_path_images       = `$directory_path(%path%)\\Images\\vinyl$if2(${tf.vinyl_side},).png`; // Subfolder Images -> vinyl%vinyl disc%.png
pref.vinylside_path_scans        = `$directory_path(%path%)\\Scans\\vinyl$if2(${tf.vinyl_side},).png`; // Subfolder Scans -> vinyl%vinyl disc%.png

// * VINYL DISC ART ( named vinylA.png, vinylB.png, etc. ) * //
pref.vinyl_path                  = '$directory_path(%path%)\\vinyl.png'; // Root -> vinyl.png
pref.vinyl_path_artwork_root     = '$directory_path(%path%)\\..\\Artwork\\vinyl.png'; // Root Artwork -> vinyl.png
pref.vinyl_path_images_root      = '$directory_path(%path%)\\..\\Images\\vinyl.png'; // Root Images -> vinyl.png
pref.vinyl_path_scans_root       = '$directory_path(%path%)\\..\\Scans\\vinyl.png'; // Root Scans -> vinyl.png
pref.vinyl_path_artwork          = '$directory_path(%path%)\\Artwork\\vinyl.png'; // Subfolder Artwork -> vinyl.png
pref.vinyl_path_images           = '$directory_path(%path%)\\Images\\vinyl.png'; // Subfolder Images -> vinyl.png
pref.vinyl_path_scans            = '$directory_path(%path%)\\Scans\\vinyl.png'; // Subfolder Scans -> vinyl.png

// * CD ART STUBS * //
paths.cdArtWhiteStub         = `${imagesPath}discart/cd-white.png`;
paths.cdArtBlackStub         = `${imagesPath}discart/cd-black.png`;
paths.cdArtBlankStub         = `${imagesPath}discart/cd-blank.png`;
paths.cdArtTransStub         = `${imagesPath}discart/cd-transparent.png`;
paths.cdArtCustomStub        = `${imagesPath}discart/cd-custom.png`;

// * VINYL ART STUBS * //
paths.vinylArtWhiteStub      = `${imagesPath}discart/vinyl-white.png`;
paths.vinylArtVoidStub       = `${imagesPath}discart/vinyl-void.png`;
paths.vinylArtColdFusionStub = `${imagesPath}discart/vinyl-cold-fusion.png`;
paths.vinylArtRingOfFireStub = `${imagesPath}discart/vinyl-ring-of-fire.png`;
paths.vinylArtMapleStub      = `${imagesPath}discart/vinyl-maple.png`;
paths.vinylArtBlackStub      = `${imagesPath}discart/vinyl-black.png`;
paths.vinylArtBlackHoleStub  = `${imagesPath}discart/vinyl-black-hole.png`;
paths.vinylArtEbonyStub      = `${imagesPath}discart/vinyl-ebony.png`;
paths.vinylArtTransStub      = `${imagesPath}discart/vinyl-transparent.png`;
paths.vinylArtCustomStub     = `${imagesPath}discart/vinyl-custom.png`;

// * ARTIST & LABEL LOGOS * //
paths.artistlogos      = `${imagesPath}artistlogos/`;
paths.artistlogosColor = `${imagesPath}artistlogos color/`;
paths.labelsBase       = `${imagesPath}recordlabel/`;

// * MISC * //
paths.flagsBase        = `${imagesPath}flags/`;
paths.lastFmImageRed   = `${imagesPath}misc/last-fm-red-36.png`;
paths.lastFmImageWhite = `${imagesPath}misc/last-fm-36.png`;


/////////////////
// * ARTWORK * //
/////////////////
/** @type {ArtCache} The cached images from album art. */
let artCache;
/** @type {GdiBitmap} The big album art image displayed on the left side. */
let albumArt = null;
/** @type {array} The album art list array containing album and disc art images. */
let albumArtList = [];
/** @type {number} The index of currently displayed album art if more than 1. */
let albumArtIndex = 0;
/** @type {Object} The album art position ( big image ). */
let albumArtSize = new ImageSize(0, 0, 0, 0);
/** @type {GdiBitmap} The pre-scaled album art to speed up drawing considerably. */
let albumArtScaled = null;
/** @type {boolean} The off-center position of the album art, if true, it will shift 40 pixels to the right. */
let artOffCenter = false;
/** @type {boolean} The state when artwork displayed is embedded and not loaded from a file. */
let embeddedArt = false;
/** @type {boolean} The state to always load art from cache unless this is set. */
let loadFromCache = true;
/** @type {boolean} The state when album art or disc art has artwork loaded. */
let hasArtwork = false;
/** @type {boolean} The "no album art stub" when no album cover was found. */
let noAlbumArtStub = false;
/** @type {GdiBitmap} The disc art image used in Details. */
let discArt = null;
/** @type {GdiBitmap} The disc art album cover image used in Details. */
let discArtCover = null;
/** @type {GdiBitmap[]} The array of disc art images used in Details. */
let discArtArray = [];
/** @type {GdiBitmap[]} The array of disc art album cover images used in Details. */
let discArtArrayCover = [];
/** @type {boolean} The state when disc art was found on hard drive used in Details. */
let discArtFound = false;
/** @type {Object} The disc art position used in Details ( offset from albumArtSize ). */
let discArtSize = new ImageSize(0, 0, 0, 0);
/** @type {GdiBitmap} The rotated disc art from the RotateImg helper used in Details. */
let discArtRotation = null;
/** @type {GdiBitmap} The rotated disc art album cover from the RotateImg helper used in Details. */
let discArtRotationCover = null;
/** @type {number} The global index of current discArtArray img to draw used in Details. */
let discArtRotationIndex = 0;
/** @type {number} The global index of current discArtArrayCover img to draw used in Details. */
let discArtRotationIndexCover = 0;
/** @type {GdiBitmap[]} The array of record label images used in Details. */
let recordLabels = [];
/** @type {GdiBitmap[]} The array of inverted record label images used in Details. */
let recordLabelsInverted = [];
/** @type {GdiBitmap} The band logo image used in Details. */
let bandLogo = null;
/** @type {GdiBitmap} The inverted band logo image shown in Details. */
let invertedBandLogo = null;
/** @type {GdiBitmap[]} The array of flag images shown in Details and in the lower bar. */
let flagImgs = [];
/** @type {GdiBitmap} The release country flag image shown in the metadata grid in Details. */
let releaseFlagImg = null;
/** @type {GdiBitmap} The codec logo image shown in the metadata grid in Details. */
let codecLogo = null;
/** @type {GdiBitmap} The channel logo image shown in the metadata grid in Details. */
let channelLogo = null;
/** @type {GdiBitmap} The Hi-Res Audio badge logo image shown on album art when enabled. */
let hiResAudioImg = null;
/** @type {boolean} The last.fm logo image displayed when we %lastfm_play_count% > 0, shown in the metadata grid in Details. */
let playCountVerifiedByLastFm = false;
/** @type {GdiBitmap} The shadow behind labels used in Details. */
let labelShadowImg = null;
/** @type {GdiBitmap} The shadow behind the artwork + discart used in Details. */
let shadowImg = null;


///////////////
// * STATE * //
///////////////
/** @param {number} width window.Width. */
let ww = 0;
/** @param {number} height window.Height. */
let wh = 0;
/** @param {number} top The metadata grid top position. */
let gridTop = 0;
/** @type {ProgressBar} Creates the progress bar object. */
let progressBar = null;
/** @type {WaveformBar} Creates the waveform bar object. */
let waveformBar = null;
/** @type {PeakmeterBar} Creates the peakmeter bar object. */
let peakmeterBar = null;
/** @type {JumpSearch} Creates the jump search object. */
let jumpSearch = null;
/** @type {PlaylistHistory} Creates the playlist history object. */
let playlistHistory;
/** @type {boolean} The Playlist history state, used for playlist scroll. */
let playlistHistoryUsed;
/** @type {boolean} The display state of the Playlist panel. */
let displayPlaylist = false;
/** @type {boolean} The display state of the Playlist panel in Artwork layout. */
let displayPlaylistArtwork = false;
/** @type {boolean} The display state of the Details panel. */
let displayDetails = pref.showPanelOnStartup === 'details';
/** @type {boolean} The display state of the Library panel. */
let displayLibrary = false;
/** @type {boolean} The display state of the Biography panel. */
let displayBiography = false;
/** @type {number} The left edge of the record labels in Details. Saved so we don't have to recalculate every on every on_paint unless size has changed. */
let lastLeftEdge = 0;
/** @type {number} The last label height of the record labels in Details. Saved so we don't have to recalculate every on every on_paint unless size has changed. */
let lastLabelHeight = 0;
/** @type {number} The first played ratio used on the timeline in Details. */
let timelineFirstPlayedRatio = 0;
/** @type {number} The last played ratio used on the timeline in Details. */
let timelineLastPlayedRatio = 0;
/** @type {string} The path of the current playing album directory, used for art caching purposes on_playback_new_track. */
let currentAlbumFolder;
/** @type {string} The path of the last played album directory, used for art caching purposes on_playback_new_track. */
let lastAlbumFolder;
/** @type {string} %album% tag of the current playing album, used for art caching purposes on_playback_new_track. */
let lastAlbumFolderTag;
/** @type {string} The disc number of the last played album directory, used for art caching purposes on_playback_new_track. */
let lastAlbumDiscNumber;
/** @type {string} The vinyl side of the last played album, used for art caching purposes on_playback_new_track. */
let lastAlbumVinylSide;
/** @type {string} The date and time of the current last played album, used for art caching purposes on_playback_new_track. */
let currentLastPlayed = '';
/** @type {string} Displays the active playlist of the current playing track in the metadata grid in Details. */
let playingPlaylist = '';
/** @type {number} Saves last playback order. */
let lastPlaybackOrder;
/** @type {boolean} Saves active full width lyrics layout via pref.lyricsLayout. */
let lyricsLayoutFullWidth;
/** @type {boolean} Is the song from a streaming source? */
let isStreaming = false;
/** @type {boolean} Is the song playing from a CD? */
let isPlayingCD = false;
/** @type {boolean} Used to restore theme state after custom [%GR_THEME%] or [%GR_STYLE%] or [%GR_PRESET%] usage. */
let themeRestoreState = false;
/** @type {boolean} When active styles match any theme presets, used for the notification popup in the showThemePresetIndicator. */
let themePresetMatchMode = false;
/** @type {boolean} Used to hide theme preset indicator under certain conditions. */
let themePresetIndicator = true;
/** @type {string} The name of the current theme preset. */
let themePresetName = '';
/** @type {string} The text of the theme notification. */
let themeNotification = '';
/** @type {boolean} When no artwork, don't set themeColor every redraw. */
let themeColorSet = false;
/** @type {boolean} The state to override condition in getRandomThemeColor() when using "Generate new color" from context menu. */
let getRandomThemeColorContextMenu = false;
/** @type {boolean} Only use default theme when noArtwork was found. */
let noArtwork = false;
/** @type {boolean} Only load theme colors when newTrackFetchingArtwork = true. */
let newTrackFetchingArtwork = false;
/** @type {boolean} The state when new album art / disc art loaded and other things finished, used for smoother Playlist auto-scrolling. */
let newTrackFetchingDone = false;
/** @type {boolean} The state when Library should not call window.Reload() from panel.set() -> panel.load(), i.e when saving theme settings or restoring theme backup. */
let libraryCanReload = true;
/** @type {boolean} The state if initTheme() needs to be fully executed to save performance. */
let initThemeFull = false;
/** @type {boolean} The state to skip most initTheme() and get getThemeColors(albumArt), mostly used for theme presets to prevent double inits. */
let initThemeSkip = false;
/** @type {boolean} The state when the theme is loading on startup or reload. */
let loadingTheme = false;
/** @type {boolean} The state when the theme has completely loaded, used for pseudo delay background logo mask on startup or reload. */
let loadingThemeComplete = false;


//////////////
// * MENU * //
//////////////
/** @type {number} The menu start index, can be anything except 0. */
const menuStartIndex = 100;
/** @type {Menu} The menu item index. */
let _MenuItemIndex = menuStartIndex;
/** @type {Menu} SMP does not yet have support for "fields" and so we cannot create static members shared across all classes. */
let _MenuCallbacks = [];
/** @type {Menu} We must use these ugly shared globals instead. */
let _MenuVariables = [];


/////////////////////
// * CUSTOM MENU * //
/////////////////////
/** @type {BaseControl} The customMenu object. */
let customMenu;
/** @type {boolean} The custom theme menu was called, used only when customThemeMenu Biography button was used and then top menu Details button. */
let customThemeMenuCall;
/** @type {Object} Used to change prefix and switch colors between custom theme 1-10. */
let customColor = customTheme01;
/** @type {boolean} The display state of custom theme menu when using Options > Theme > Edit custom theme. */
let displayCustomThemeMenu = false;
/** @type {boolean} The display state of the metadata grid menu. */
let displayMetadataGridMenu = false;
/** @type {Object} The control list object used in custom theme menu. */
let controlList = [];
/** @type {Object} The active control object used in custom theme menu. */
let activeControl;
/** @type {Object} The hovered control object used in custom theme menu. */
let hoveredControl;
/** @type {boolean} The mouse button pressed state, used in custom theme menu. */
let mouseDown = false;


/////////////////////////
// * BUTTONS & MOUSE * //
/////////////////////////
/** @type {ButtonEventHandler} The topMenu object. */
let topMenu;
/** @type {boolean} The top menu compact state, used to cancel top menu compact collapse when mouse is again in top menu area. */
let topMenuCompactExpanded = false;
/** @type {PauseButton} The album art pause button. */
let pauseBtn;
/** @type {VolumeBtn} The lower bar volume button. */
let volumeBtn;
/** @type {Object} The theme button object. */
let btns = {};
/** @type {GdiGraphics} The theme button images. */
let btnImg;
/** @type {boolean} The top menu and contextual menu state, is it open ( active ) or not. */
let activeMenu = false;
/** @type {boolean} The double click mouse state. */
let doubleClicked = false;
/** @type {Object} The mouse move position state. */
let state = {};


/////////////////
// * UIHACKS * //
/////////////////
/** @type {boolean} UIHacks pseudo caption state, used in setWindowDrag. */
let pseudoCaption;
/** @type {number} UIHacks sets pseudo caption width when dragging foobar, used in setWindowDrag. */
let pseudoCaptionWidth;
/** Preferences > Display > Main Window > Frame style: No border. */
UIHacks.FrameStyle = 3;
/** Preferences > Display > Main Window > Move with: Any method. */
UIHacks.MoveStyle = 3;
/** Preferences > Display > Main Window > Aero effects: Glass frame. */
UIHacks.Aero.Effect = 2;
/** Preferences > Display > Main Window > Aero top: 1 px fix for window drop shadow. */
UIHacks.Aero.Top = 1;
/** Preferences > Display > Main Window > Constraints: Disable window maximization. */
UIHacks.BlockMaximize = false;


////////////////
// * TIMERS * //
////////////////
/** @type {number} The setTimeout ID for cycling album art. */
let albumArtTimeout;
/** @type {number} The timer when disc art spins while song is playing. */
let discArtRotationTimer;
/** @type {number} The setTimeout ID for hiding cursor. */
let hideCursorTimeout;
/** @type {number} The timer of progress bar. */
let progressBarTimer;
/** @type {number} The timer interval between progress bar updates. */
let progressBarTimerInterval;
/** @type {number} The timer for style auto random preset. */
let presetAutoRandomModeTimer;
/** @type {number} The timer for theme preset indicator. */
let presetIndicatorTimer;
/** @type {number} The timer for style auto color in Random theme. */
let randomThemeAutoColorTimer;
/** @type {number} The 10 minute timer for theme day/night mode. */
let themeDayNightModeTimer;


/////////////////
// * TOOLTIP * //
/////////////////
/** @type {FbTooltip} The tooltip object. */
let g_tooltip;
/** @type {TooltipTimer} The tooltip timer. */
let g_tooltip_timer;
/** @type {TooltipHandler} The tooltip object. */
let tt;
/** @type {string} The tooltip text handler for styled tooltip. */
let styledTooltipText;
/** @type {boolean} The draw state of styled tooltip. */
let styledTooltipReady;


///////////////
// * DEBUG * //
///////////////
/** @type {number} Shows the image alpha in showThemeDebugOverlay. */
let blendedImgAlpha;
/** @type {number} Shows the image blur in showThemeDebugOverlay. */
let blendedImgBlur;
/** @type {string} Shows the col.primary in showThemeDebugOverlay. */
let selectedPrimaryColor;
/** @type {string} Shows the col.primary_alt in showThemeDebugOverlay. */
let selectedPrimaryColor2;
/** @type {array} Used in drawDebugRectAreas(). */
let repaintRects = [];
/** @type {number} Used in repaintRectAreas(). */
let repaintRectCount = 0;
/** @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
let trace_call = false;
/** @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
let trace_on_paint = false;
/** @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
let trace_on_move = false;
/** @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
let trace_initialize_list_performance = false;

window.oldRepaintRect = window.RepaintRect;

/**
 * @typedef  {Object} TimingsObj
 * @property {boolean} showDebugTiming Spams the console with debug timings.
 * @property {boolean} showDrawTiming Spams the console with draw times.
 * @property {boolean} showExtraDrawTiming Spams the console with every section of the draw code to determine bottlenecks.
 * @property {boolean} showRamUsage Spams the console with memory statistic.
 * @property {boolean} drawRepaintRects Draws all window.RepaintRect as red outlines in the theme.
 * @property {boolean} showPanelTraceCall Spams the console with panel trace call.
 * @property {boolean} showPanelTraceOnMove Spams the console with panel trace on move.
 * @property {boolean} showPlaylistTraceListPerf Spams the console with playlist list performance.
 */

/** @type {TimingsObj} */
const timings = {
	showDebugTiming: false,
	showDrawTiming: false,
	showExtraDrawTiming: false,
	showRamUsage: false,
	drawRepaintRects: false,
	showPanelTraceCall: false,
	showPanelTraceOnMove: false,
	showPlaylistTraceListPerf: false
};
