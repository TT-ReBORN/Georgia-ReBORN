/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Setup                                * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-04                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////
// * COLORS * //
////////////////
/**
 * @typedef {Object} ColorsObj
 * @property {number=} darkAccent Primary color shaded by 30%
 * @property {number=} darkAccent_alt Secondary primary color shaded by 30%
 * @property {number=} accent Primary color shaded by 15%
 * @property {number=} accent_alt Secondary primary color shaded by 15%
 * @property {number=} primary Primary theme color generated from artwork
 * @property {number=} primary_alt Secondary primary theme color generated from artwork
 * @property {number=} lightAccent Primary color tinted by 20%
 * @property {number=} lightAccent_alt Secondary primary color tinted by 20%
 * @property {number=} artist Color of artist text on background
 * @property {number=} now_playing Color of the lower bar text, including tracknum, title, elapsed and remaining time
 * @property {number=} info_text Default color of text in metadatagrid
 * @property {number=} bg Background of the entire panel
 * @property {number=} rating Color of rating stars in metadatagrid
 * @property {number=} hotness Color of hotness text in metadatagrid
 * @property {number=} timelineAdded Background color for timeline block in Details from added to first played
 * @property {number=} timelinePlayed Background color for timeline block in Details from first played to last played
 * @property {number=} timelineUnplayed Background color for timeline block in Details from last played to present time
 * @property {number=} progressBar The background of the progress bar. Fill will be col.primary
 * @property {number=} shadow Color of the shadow
 */
/** @type ColorsObj */
const col = {}; // Colors

/** Used in Reborn/Random theme when init on start or when noAlbumArtStub displayed */
let isColored;

/**
 * Calculated primary color brightness used in:
 * - pref.theme === 'white'
 * - pref.theme === 'black'
 * - pref.theme === 'reborn'
 * - pref.theme === 'random'
 */
let colBrightness;

/**
 * Calculated secondary primary color brightness used in:
 * - pref.styleRebornFusion
 * - pref.styleRebornFusion2
 * - pref.styleRebornFusionAccent
 */
let colBrightness2;

/**
 * Calculated image brightness used in:
 * - pref.styleBlend
 * - pref.styleBlend2
 * - pref.styleBlackAndWhite
 * - pref.styleBlackAndWhite2
 * - pref.styleBlackAndWhiteReborn
 * @type {GdiBitmap}
 */
let imgBrightness;

/**
 * Blended image from setStyleBlend()
 * @type {GdiBitmap}
 */
let blendedImg;

/**
 * Color definition when to switch text and logos to white or black, used in:
 * - pref.theme === 'white'
 * - pref.theme === 'black'
 * - pref.theme === 'reborn'
 * - pref.theme === 'random'
 * - pref.styleBlend
 * - pref.styleBlend2
 */
let lightBg;

/**
 * Color definition when to switch text and logos to white or black, used in:
 * - ppt.theme == 1
 * - ppt.theme == 2
 * - ppt.theme == 3
 * - ppt.theme == 4
 * - ppt.theme == 5
 */
let lightBgLib;

/**
 * Color definition when to switch text and logos to white or black, used in:
 * - pptBio.theme == 1
 * - pptBio.theme == 2
 * - pptBio.theme == 3
 * - pptBio.theme == 4
 */
let lightBgBio;

/**
 * Color definition for col.bg when to shade or lighten custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 */
let lightBgMain;

/**
 * Color definition for g_pl_colors.bg when to shade or lighten custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 */
let lightBgPlaylist;

/**
 * Color definition for col.detailsBg) when to shade or lighten custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 */
let lightBgDetails;

/**
 * Color definition for ui.col.bg when to shade or lighten custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 */
let lightBgLibrary;

/**
 * Color definition for uiBio.col.bg when to shade or lighten custom theme colors:
 * - pref.theme === 'custom01' - 'custom10'
 */
let lightBgBiography;


//////////////////
// * GEOMETRY * //
//////////////////
/**
 * @typedef {Object} GeometryObj
 * @property {number=} topMenuHeight Height of the top menu
 * @property {number=} lowerBarHeight Height of the song title and time + progress bar area
 * @property {number=} progBarHeight Height of the progress bar
 * @property {number=} waveformBarHeight Height of the waveform bar
 * @property {number=} peakmeterBarHeight Height of the peakmeter bar
 * @property {number=} timelineHeight Height of the timeline
 * @property {number=} metadataGridTooltipHeight Height of the metadata grid tooltip area
 * @property {number=} pauseSize Width and height of the pause button
 * @property {number=} discArtShadow Size of the disc art shadow
 */
/** @type GeometryObj */
const geo = {};

function setGeometry() {
	geo.topMenuHeight = scaleForDisplay(40);
	geo.lowerBarHeight = scaleForDisplay(120);
	geo.progBarHeight = scaleForDisplay(pref.layout !== 'default' && (pref.styleProgressBarDesign === 'default' || pref.styleProgressBarDesign === 'rounded') ? 10 : 12) + (ww > 1920 ? 2 : 0);
	geo.waveformBarHeight = scaleForDisplay(pref.layout !== 'default' ? 16 : 26) + (ww > 1920 ? 2 : 0);
	geo.peakmeterBarHeight = scaleForDisplay(pref.layout !== 'default' ? 16 : 26) + (ww > 1920 ? 2 : 0);
	geo.timelineHeight = Math.round(geo.progBarHeight * 0.66);
	geo.metadataGridTooltipHeight = scaleForDisplay(100);
	geo.pauseSize = scaleForDisplay(100);
	geo.discArtShadow = scaleForDisplay(6);
}


//////////////////
// * POSITION * //
//////////////////
let lowerBarTimeX;
let lowerBarTimeY;
let lowerBarTimeW;
let lowerBarTimeH;
let progressBarY;
let waveformBarY;
let peakmeterBarY;


///////////////////////
// * STRING OBJECT * //
///////////////////////
/**
 * @typedef {Object} MetadataGridObj
 * @property {boolean=} age Should the age of the field also be calculated (i.e. add the "(3y 5m 11d)" to `val`)
 * @property {string} label Grid label
 * @property {string} val Grid value. If `val.trim().length === 0`. The grid entry will not be shown.
 */
/**
 * @typedef {Object} StringsObj Collection of strings and other objects to be displayed throughout UI
 * @property {string=} artist
 * @property {string=} composer
 * @property {string=} album
 * @property {string=} album_subtitle
 * @property {string=} disc By default this string is displayed if there is more than one total disc. Formated like: "CD1/2"
 * @property {Array<MetadataGridObj>=} grid
 * @property {string=} length Length of the song in MM:SS format
 * @property {string=} original_artist
 * @property {string=} time Current time of the song in MM:SS format
 * @property {string=} title Title of the song
 * @property {string=} title_lower Title of the song to be displayed above the progress bar. Can include more information such as translation, original artist, etc.
 * @property {string=} tracknum
 * @property {*=} trackInfo The piece of text shown in the upper right corner under the year
 * @property {string=} year
 * @property {Timeline=} timeline Timeline object
 * @property {MetadataGridTooltip=} metadata_grid_tt Metadata grid tooltip object
 * @property {LowerBarTooltip=} lowerBar_tt Lower bar tooltip object
 */
/** @type StringsObj */
let str = {};


///////////////
// * FONTS * //
///////////////
/** @type Fonts */
const ft = {};
const fontDefault        = pref.customThemeFonts ? customFont.fontDefault : 'Segoe UI'; // Panel font used as default and panel related elements in Playlist, Library and Biography
const fontSegoeUISymbol  = 'Segoe UI Symbol'; // Panel font used for special chars, scrollbar buttons, etc
const fontTopMenu        = pref.customThemeFonts ? customFont.fontTopMenu : 'Segoe UI Semibold'; // Theme font used for top menu buttons
const fontTopMenuCaption = 'Marlett'; // Theme font used for top menu 🗕 🗖 ✖ caption buttons

const fontGuiFx          = 'Guifx v2 Transports'; // Theme font used for lower bar transport/playback buttons
const fontAwesome        = 'FontAwesome';         // Theme font used for lower bar transport/playback buttons
const fontLowerBarArtist = pref.customThemeFonts ? customFont.fontLowerBarArtist : 'HelveticaNeueLT Pro 65 Md'; // Theme artist font used in lower bar
const fontLowerBarTitle  = pref.customThemeFonts ? customFont.fontLowerBarTitle  : 'HelveticaNeueLT Pro 45 Lt'; // Theme title font used in lower bar
const fontLowerBarDisc   = pref.customThemeFonts ? customFont.fontLowerBarDisc   : 'HelveticaNeueLT Pro 45 Lt'; // Theme disc font used in lower bar
const fontLowerBarTime   = pref.customThemeFonts ? customFont.fontLowerBarTime   : 'HelveticaNeueLT Pro 65 Md'; // Theme time font used in lower bar
const fontLowerBarLength = pref.customThemeFonts ? customFont.fontLowerBarLength : 'HelveticaNeueLT Pro 45 Lt'; // Theme length font used in lower bar
const fontLowerBarWave   = pref.customThemeFonts ? customFont.fontLowerBarWave   : 'HelveticaNeueLT Pro 65 Md'; // Theme waveform bar font used in lower bar

const fontNotification   = pref.customThemeFonts ? customFont.fontNotification   : 'HelveticaNeueLT Pro 65 Md'; // Theme notification font
const fontPopup          = pref.customThemeFonts ? customFont.fontPopup          : 'Segoe UI'; // Theme popup font
const fontTooltip        = pref.customThemeFonts ? customFont.fontTooltip        : 'HelveticaNeueLT Pro 65 Md'; // Theme tooltip font

const fontGridArtist     = pref.customThemeFonts ? customFont.fontGridArtist     : 'HelveticaNeueLT Pro 65 Md'; // Theme font used in metadata grid
const fontGridTitle      = pref.customThemeFonts ? customFont.fontGridTitle      : 'HelveticaNeueLT Pro 45 Lt'; // Theme font used in metadata grid
const fontGridTitleBold  = pref.customThemeFonts ? customFont.fontGridTitleBold  : 'HelveticaNeueLT Pro 65 Md'; // Theme font used in metadata grid
const fontGridAlbum      = pref.customThemeFonts ? customFont.fontGridAlbum      : 'HelveticaNeueLT Pro 65 Md'; // Theme font used in metadata grid
const fontGridKey        = pref.customThemeFonts ? customFont.fontGridKey        :
						   DetectWine()          ? 'HelveticaNeueLT Pro 65 Md'   : 'HelveticaNeueLT Pro 75 Bd'; // Theme font used in metadata grid
const fontGridValue      = pref.customThemeFonts ? customFont.fontGridValue      : 'HelveticaNeueLT Pro 45 Lt'; // Theme font used in metadata grid

const fontLibrary        = pref.customThemeFonts ? customFont.fontLibrary        : 'Segoe UI'; // Library font
const fontBiography      = pref.customThemeFonts ? customFont.fontBiography      : 'Segoe UI'; // Biography font
const fontLyrics         = pref.customThemeFonts ? customFont.fontLyrics         : 'Segoe UI'; // Lyrics font

const fontList = [
	fontDefault, fontSegoeUISymbol, fontTopMenu, fontTopMenuCaption,
	fontGuiFx, fontAwesome, fontLowerBarArtist, fontLowerBarTitle, fontLowerBarDisc, fontLowerBarTime, fontLowerBarLength, fontLowerBarWave,
	fontNotification, fontPopup, fontTooltip,
	fontGridArtist, fontGridTitle, fontGridTitleBold, fontGridAlbum, fontGridKey, fontGridValue,
	fontLibrary, fontBiography, fontLyrics
];

let fontsInstalled = true;

if (!fontList.every((fontName) => testFont(fontName))) {
	fontsInstalled = false;
	fb.ShowPopupMessage('Georgia-ReBORN WAS UNABLE TO LOAD SOME FONTS\n\n' +
	'Be sure all fonts from\nfoobar2000\\profile\\georgia-reborn\\fonts\nare correctly installed in these directories:\n\n' +
	'For Windows: C:\\Windows\\fonts\\\nFor Linux: /usr/share/fonts or ~/.local/share/fonts\n\n' +
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

function createFonts() {
	g_tooltip = window.Tooltip;
	if (g_tooltip) {
		g_tooltip.Text = '';	// Just in case
		g_tooltip.SetFont(fontDefault, scaleForDisplay(15));
		g_tooltip.SetMaxWidth(scaleForDisplay(pref.layout !== 'default' ? 600 : 800));
	}

	// * FONT SIZES * //
	const menuFontSize         = pref.layout === 'compact' ? pref.menuFontSize_compact         : pref.layout === 'artwork' ? pref.menuFontSize_artwork         : pref.menuFontSize_default;
	const menuCaptionFontSize  = pref.layout === 'compact' ? pref.menuFontSize_compact + 1     : pref.layout === 'artwork' ? pref.menuFontSize_artwork + 1     : pref.menuFontSize_default + 1;
	const lowerBarFontSize     = pref.layout === 'compact' ? pref.lowerBarFontSize_compact     : pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork     : pref.lowerBarFontSize_default;
	const notificationFontSize = pref.layout === 'compact' ? pref.notificationFontSize_compact : pref.layout === 'artwork' ? pref.notificationFontSize_artwork : pref.notificationFontSize_default;
	const popupFontSize        = pref.layout === 'compact' ? pref.popupFontSize_compact        : pref.layout === 'artwork' ? pref.popupFontSize_artwork        : pref.popupFontSize_default;
	const tooltipFontSize      = pref.layout === 'compact' ? pref.tooltipFontSize_compact      : pref.layout === 'artwork' ? pref.tooltipFontSize_artwork      : pref.tooltipFontSize_default;

	const guiFxBtnFontSize      = pref.layout === 'compact' ? pref.transportButtonSize_compact / 2    : pref.layout === 'artwork' ? pref.transportButtonSize_artwork / 2    : pref.transportButtonSize_default /    2;
	const pboDefaultBtnFontSize = pref.layout === 'compact' ? pref.transportButtonSize_compact / 1.6  : pref.layout === 'artwork' ? pref.transportButtonSize_artwork / 1.6  : pref.transportButtonSize_default /  1.6;
	const pboReplayBtnFontSize  = pref.layout === 'compact' ? pref.transportButtonSize_compact / 2    : pref.layout === 'artwork' ? pref.transportButtonSize_artwork / 2    : pref.transportButtonSize_default /    2;
	const pboShuffleBtnFontSize = pref.layout === 'compact' ? pref.transportButtonSize_compact / 1.65 : pref.layout === 'artwork' ? pref.transportButtonSize_artwork / 1.65 : pref.transportButtonSize_default / 1.65;
	const reloadBtnFontSize     = pref.layout === 'compact' ? pref.transportButtonSize_compact / 1.5  : pref.layout === 'artwork' ? pref.transportButtonSize_artwork / 1.5  : pref.transportButtonSize_default /  1.5;
	const volumeBtnFontSize     = pref.layout === 'compact' ? pref.transportButtonSize_compact / 1.33 : pref.layout === 'artwork' ? pref.transportButtonSize_artwork / 1.33 : pref.transportButtonSize_default / 1.33;

	const gridArtistFontSize   = pref.layout === 'artwork' ? pref.gridArtistFontSize_artwork    : pref.gridArtistFontSize_default;
	const gridTrackNumFontSize = pref.layout === 'artwork' ? pref.gridTrackNumFontSize_artwork  : pref.gridTrackNumFontSize_default;
	const gridTitleFontSize    = pref.layout === 'artwork' ? pref.gridTitleFontSize_artwork     : pref.gridTitleFontSize_default;
	const gridAlbumFontSize    = pref.layout === 'artwork' ? pref.gridAlbumFontSize_artwork     : pref.gridAlbumFontSize_default;
	const gridKeyFontSize      = pref.layout === 'artwork' ? pref.gridKeyFontSize_artwork       : pref.gridKeyFontSize_default;
	const gridValueFontSize    = pref.layout === 'artwork' ? pref.gridValueFontSize_artwork + 1 : pref.gridValueFontSize_default + 1;

	const playlistFontSize  = pref.layout === 'compact' ? pref.playlistFontSize_compact  : pref.layout === 'artwork' ? pref.playlistFontSize_artwork : pref.playlistFontSize_default;
	const libraryFontSize   = pref.layout === 'artwork' ? ppt.baseFontSize_artwork       : ppt.baseFontSize_default;
	const biographyFontSize = pref.layout === 'artwork' ? pptBio.baseFontSizeBio_artwork : pptBio.baseFontSizeBio_default;
	const lyricsFontSize    = pref.layout === 'artwork' ? pref.lyricsFontSize_artwork    : pref.lyricsFontSize_default || 20;

	// * STYLE CHANGE * //
	const artistTitle = pref.showGridArtist_default && pref.showGridTitle_default || pref.showGridArtist_artwork && pref.showGridTitle_artwork;

	// * TOP MENU BUTTONS * //
	ft.top_menu         = font(fontTopMenu, menuFontSize, 0);
	ft.top_menu_caption = font(fontTopMenuCaption, menuCaptionFontSize, 0);
	ft.top_menu_compact = font(fontAwesome, menuFontSize, 0);

	// * LOWER BAR * //
	ft.lower_bar_artist = font(fontLowerBarArtist, lowerBarFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.lower_bar_title  = font(fontLowerBarTitle,  lowerBarFontSize, 0);
	ft.lower_bar_disc   = font(fontLowerBarDisc,   lowerBarFontSize, 0);
	ft.lower_bar_time   = font(fontLowerBarTime,   lowerBarFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.lower_bar_length = font(fontLowerBarLength, lowerBarFontSize, 0);
	ft.lower_bar_wave   = font(fontLowerBarWave,   lowerBarFontSize - 6, pref.customThemeFonts ? g_font_style.bold : 0);

	if (updateHyperlink) updateHyperlink.setFont(ft.lower_bar_title);

	// * LOWER BAR TRANSPORT BUTTONS * //
	ft.guifx                  = font(fontGuiFx,   Math.floor(guiFxBtnFontSize), 0);
	ft.playback_order_default = font(fontGuiFx,   Math.floor(pboDefaultBtnFontSize), 0);
	ft.playback_order_replay  = font(fontAwesome, Math.floor(pboReplayBtnFontSize), 0);
	ft.playback_order_shuffle = font(fontGuiFx,   Math.floor(pboShuffleBtnFontSize), 0);
	ft.guifx_reload           = font(fontGuiFx,   Math.floor(reloadBtnFontSize), 0);
	ft.guifx_volume           = font(fontGuiFx,   Math.floor(volumeBtnFontSize), 0);

	// * MISC * //
	ft.no_album_art_stub = font(fontAwesome, 160, 0);
	ft.symbol            = font(fontSegoeUISymbol, playlistFontSize, 0);
	ft.notification      = font(fontNotification, notificationFontSize, 0);
	ft.popup             = font(fontPopup, popupFontSize, 0);
	ft.tooltip           = font(fontTooltip, tooltipFontSize, 0);

	// * DETAILS METADATA GRID * //
	ft.grd_artist   = font(fontGridArtist, gridArtistFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.grd_tracknum = font(artistTitle ? fontGridTitle : fontGridTitleBold, gridTrackNumFontSize, 0);
	ft.grd_title    = font(artistTitle ? fontGridTitle : fontGridTitleBold, gridTitleFontSize, 0);
	ft.grd_album    = font(fontGridAlbum, gridAlbumFontSize, pref.customThemeFonts ? g_font_style.bold : 0);
	ft.grd_key      = font(fontGridKey, gridKeyFontSize, 0);
	ft.grd_val      = font(fontGridValue, gridValueFontSize, 0);

	// * LIBRARY * //
	ft.library = font(fontLibrary, libraryFontSize, 0);

	// * BIOGRAPHY * //
	ft.biography = font(fontBiography, biographyFontSize, 0);

	// * LYRICS * //
	ft.lyrics          = font(fontLyrics, lyricsFontSize, 1);
	ft.lyricsHighlight = font(fontLyrics, lyricsFontSize * 1.5, 1);
}


///////////////
// * PATHS * //
///////////////
const paths = {};
const imagesPath             = `${fb.ProfilePath}georgia-reborn/images/`;

// * CDART STUBS * //
paths.cdArtWhiteStub         = `${imagesPath}discart/cd-white.png`;
paths.cdArtBlackStub         = `${imagesPath}discart/cd-black.png`;
paths.cdArtBlankStub         = `${imagesPath}discart/cd-blank.png`;
paths.cdArtTransStub         = `${imagesPath}discart/cd-transparent.png`;
paths.cdArtCustomStub        = `${imagesPath}discart/cd-custom.png`;

// * VINYLART STUBS * //
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
paths.artistlogos            = `${imagesPath}artistlogos/`;
paths.artistlogosColor       = `${imagesPath}artistlogos color/`;
paths.labelsBase             = `${imagesPath}recordlabel/`;

// * MISC * //
paths.flagsBase              = `${imagesPath}flags/`;
paths.lastFmImageRed         = `${imagesPath}misc/last-fm-red-36.png`;
paths.lastFmImageWhite       = `${imagesPath}misc/last-fm-36.png`;


/////////////////
// * ARTWORK * //
/////////////////
/** @type {ArtCache} */
let artCache;
let albumArt = null; // Album art image
let albumArtSize = new ImageSize(0, 0, 0, 0); // Position ( big image )
/** @type {GdiBitmap} */
let albumArtScaled = null; // Pre-scaled album art to speed up drawing considerably
let artOffCenter = false; // If true, album art has been shifted 40 pixels to the right
let embeddedArt = false; // When artwork displayed is embedded and not loaded from a file
let loadFromCache = true; // Always load art from cache unless this is set
let noAlbumArtStub = false; // No album art stub
let discArt = null; // Disc art image
/** @type {GdiBitmap[]} */
let discArtArray = [];
let discArtSize = new ImageSize(0, 0, 0, 0); // Disc art position ( offset from albumArtSize )
let rotatedDiscArt = null; // Drawing discArt rotated is slow, so first draw it rotated into the rotatedDiscArt image, and then draw rotatedDiscArt image unrotated
let rotatedDiscArtIndex = 0; // Global index of current discArtArray img to draw
let recordLabels = []; // Array of record label images
let recordLabelsInverted = []; // Array of inverted record label images
let bandLogo = null; // Band logo image
let invertedBandLogo = null; // Inverted band logo image
let flagImgs = []; // Array of flag images
let releaseFlagImg = null; // Release country flag
let codecLogo = null; // Codec logo image
let hiResAudioImg = null; // Hi-Res Audio badge image
let playCountVerifiedByLastFm = false; // Show Last.fm image when we %lastfm_play_count% > 0
let labelShadowImg = null; // Shadow behind labels
let shadowImg = null; // Shadow behind the artwork + discart


////////////////
// * STATUS * //
////////////////
/** @param {number} width - window.Width */
let ww = 0;
/** @param {number} height - window.Height */
let wh = 0;
/** @param {number} top - metadataGrid top */
let gridTop = 0;
/** @type ProgressBar */
let progressBar = null;
/** @type WaveformBar */
let waveformBar = null;
/** @type PeakmeterBar */
let peakmeterBar = null;
/** @type JumpSearch */
let jumpSearch = null;
/** @type {PlaylistHistory} */
let playlistHistory;
let playlistHistoryUsed; // Used for playlist scroll
let state = {}; // Panel state
let displayPlaylist = false;
let displayPlaylistArtworkLayout = false;
let displayDetails = pref.showPanelOnStartup === 'details';
let displayLibrary = false;
let displayBiography = false;
let albumArtList = [];
let albumArtIndex = 0; // Index of currently displayed album art if more than 1
let lastLeftEdge = 0; // The left edge of the record labels. Saved so we don't have to recalculate every on every on_paint unless size has changed
let lastLabelHeight = 0;
let timelineFirstPlayedRatio = 0;
let timelineLastPlayedRatio = 0;
let currentFolder;
let lastFolder;
let lastAlbum;
let lastDiscNumber;
let lastVinylSide;
let currentLastPlayed = '';
let playingPlaylist = '';
let lastPlaybackOrder; // Saves last playback order
let lyricsLayoutFullWidth; // Saves full width lyrics layout
let doubleClicked = false;
let isStreaming = false; // Is the song from a streaming source?
let isPlayingCD = false; // Is the song playing from a CD?
let themePresetMatchMode = false; // When active styles match any theme presets
let themePresetName = ''; // Name of the current theme preset
let themeColorSet = false; // When no artwork, don't set themeColor every redraw
let noArtwork = false; // Only use default theme when noArtwork was found
let newTrackFetchingArtwork = false; // Only load theme colors when newTrackFetchingArtwork = true
let newTrackFetchingDone = false; // State when new album art / disc art loaded and other things finished, used for smoother Playlist auto-scrolling
let libraryCanReload = true; // State when Library should not call window.Reload() from panel.set() -> panel.load(), i.e when saving theme settings or restoring theme backup
let initThemeFull = false; // State if initTheme() needs to be fully executed to save performance
let initThemeSkip = false; // State to skip most initTheme() and get getThemeColors(albumArt), mostly used for theme presets to prevent double inits
let loadingTheme = false; // State when the theme is loading on startup or reload
let loadingThemeComplete = false; // State when the theme has completely loaded, used for pseudo delay background logo mask on startup or reload


//////////////
// * MENU * //
//////////////
const menuStartIndex = 100; // Can be anything except 0
let _MenuItemIndex = menuStartIndex;
let _MenuCallbacks = []; // SMP does not yet have support for "fields" and so we cannot create static members shared across all classes.
let _MenuVariables = []; // We must use these ugly shared globals instead


/////////////////////
// * CUSTOM MENU * //
/////////////////////
let customMenu;
let customThemeMenuCall; // Used only when customThemeMenu Biography button was used and then top menu Details button
let customColor = customTheme01; // Used to change prefix and switch colors between custom theme 1-5
let displayCustomThemeMenu = false; // Display custom theme menu
let displayMetadataGridMenu = false; // Display metadata grid menu
let controlList = [];
let activeControl;
let hoveredControl;
let mouseDown = false;


/////////////////////////
// * BUTTONS & MOUSE * //
/////////////////////////
/** @type ButtonEventHandler */
let topMenu;
/** Used to cancel top menu compact collapse when mouse is again in top menu area */
let topMenuCompactExpanded = false;
/** @type PauseBtn */
let pauseBtn;
/** @type VolumeBtn */
let volumeBtn;
let btns = {};
let btnImg;
let activeMenu = false;
let mouseInPanel = false;
let on_mouse_wheel_albumart = false;


/////////////////
// * UIHACKS * //
/////////////////
let pseudoCaption;
let pseudoCaptionWidth;
UIHacks.FrameStyle = 3;
UIHacks.MoveStyle = 3;
UIHacks.Aero.Effect = 2;
UIHacks.Aero.Top = 1;
UIHacks.BlockMaximize = false;


////////////////
// * TIMERS * //
////////////////
let albumArtTimeout; // setTimeout ID for rotating album art
let discArtRotationTimer; // Timer when disc art spins while song is playing
let hideCursorTimeout; // setTimeout ID for hiding cursor
let progressBarTimer; // 40 ms repaint of progress bar
let progressBarTimerInterval; // Milliseconds between progress bar updates
let presetAutoRandomModeTimer; // Timer for style auto random preset
let presetIndicatorTimer; // Timer for theme preset indicator
let randomThemeAutoColorTimer; // Timer for style auto color in Random theme
let themeDayNightModeTimer; // 10 minute timer check for theme day/night mode


/////////////////
// * TOOLTIP * //
/////////////////
/** @type {FbTooltip} */
let g_tooltip;
/** @type {TooltipTimer} */
let g_tooltip_timer;
/** @type {TooltipHandler} */
let tt;
/** Passed tooltip handler text for styled tooltip */
let styledTooltipText;
/** Draw state of styled tooltip */
let styledTooltipReady;


///////////////
// * DEBUG * //
///////////////
let blendedImgAlpha;
let blendedImgBlur;
let selectedPrimaryColor;
let selectedPrimaryColor2;
let repaintRects = [];
let repaintRectCount = 0;                       // Used in repaintRectAreas();
let trace_call = false;                         // DO NOT CHANGE, can be activated via top menu Options > Developer tools
let trace_on_paint = false;                     // DO NOT CHANGE, can be activated via top menu Options > Developer tools
let trace_on_move = false;                      // DO NOT CHANGE, can be activated via top menu Options > Developer tools
let trace_initialize_list_performance = false;  // DO NOT CHANGE, can be activated via top menu Options > Developer tools

window.oldRepaintRect = window.RepaintRect;

const timings = {
	showDebugTiming: false,          // Spam console with debug timings
	showDrawTiming: false,           // Spam console with draw times
	showExtraDrawTiming: false,      // Spam console with every section of the draw code to determine bottlenecks
	showRamUsage: false,             // Spam console with memory statistic
	drawRepaintRects: false,         // Outline window.RepaintRect in red
	showPlaylistTraceCall: false,    // Spam console with playlist trace call
	showPlaylistTraceOnMove: false,  // Spam console with playlist trace on move
	showPlaylistTraceListPerf: false // Spam console with playlist list performance
};
