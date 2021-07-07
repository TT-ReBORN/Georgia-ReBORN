// Georgia-ReBORN
//
// Description  a fullscreen theme for foo_spider_monkey_panel
// Author 		TT
// Org. Author  Mordred
// Version 		2.0.3
// Dev. Started 2017-12-22
// Last change  2021-05-22
// --------------------------------------------------------------------------------------

// CONFIGURATION //////////////////////////////////////
var ft = {}; // fonts

/**
 * @typedef {Object} ColorsObj
 * @property {number=} shadow color of the shadow
 * @property {number=} accent typically, the primary color shaded by 15%
 * @property {number=} artist color of artist text on background
 * @property {number=} bg background of the entire panel from geo.top_bg_h to bottom
 * @property {number=} darkAccent typically, the primary color shaded by 30%
 * @property {number=} extraDarkAccent the primary color shaded by 50% - used for dropshadow of colored text
 * @property {number=} hotness color of hotness text in metadatagrid
 * @property {number=} primary primary theme color generated from artwork
 * @property {number=} info_text default color of text in metadatagrid
 * @property {number=} lightAccent typically, the primary color tinted (lightened) 20%
 * @property {number=} menu_bg background color under menu (i.e. from y = 0 - geo.top_bg_h)
 * @property {number=} now_playing color of the lower bar text, including tracknum, title, elapsed and remaining time
 * @property {number=} progress_bar the background of the progress bar. Fill will be `col.primary`
 * @property {number=} rating color of rating stars in metadatagrid
 * @property {number=} tl_added background color for timeline block from added to first played
 * @property {number=} tl_played background color for timeline block from first played to last played
 * @property {number=} tl_unplayed background color for timeline block from last played to present time
 */
/** @type ColorsObj */
var col = {}; // colors
/**
 * @typedef {Object} GeometryObj
 * @property {number=} aa_shadow size of albumart shadow
 * @property {number=} lower_bar_h height of song title and time + progress bar area
 * @property {number=} pause_size width and height of pause button
 * @property {number=} prog_bar_h height of progress bar
 * @property {number=} timeline_h height of timeline
 * @property {number=} top_art_spacing space between top of theme and artwork
 * @property {number=} top_bg_h height of offset color background
 */
/** @type GeometryObj */
let geo = {};

let is_4k = false;

const fontThin = 'HelveticaNeueLT Pro 35 Th'; // Helvetica Neue LT Pro 35 Thin
const fontLight = 'HelveticaNeueLT Pro 45 Lt'; // Helvetica Neue LT Pro 45 Light
const fontRegular = 'HelveticaNeueLT Pro 55 Roman'; // Helvetica Neue LT Pro 55 Roman
const fontBold = 'HelveticaNeueLT Pro 65 Md'; // Helvetica Neue LT Pro 65 Medium
const fontLightAlternate = 'NeueHaasGroteskDisp Pro XLt'; // Neue Haas Grotesk Display Pro 35 Extra Light
const fontGuiFx = 'Guifx v2 Transports'; // Guifx v2 Transports
const fontAwesome = 'FontAwesome'; // Font Awesome
const fontMarlett = 'Marlett'; // Marlett
const fontSegoeUI = 'Segoe UI'; // Segoe UI
const fontSegoeUISemibold = 'Segoe UI Semibold'; // Segoe UI Semibold
const fontSegoeUISymbol = 'Segoe UI Symbol'; // Segoe UI Symbol

var fontList = [fontThin, fontLight, fontRegular, fontBold, fontLightAlternate, fontGuiFx, fontAwesome, fontMarlett, fontSegoeUI, fontSegoeUISemibold, fontSegoeUISymbol];

// FONTS
var fontsInstalled = true;
fontList.forEach(function(fontName) {
	if (!testFont(fontName)) {
		fontsInstalled = false;
	}
});

var useNeue = false;
var fontsCreated = null;

function createFonts() {
	g_tooltip = window.Tooltip;
	g_tooltip.Text = '';	// just in case
	g_tooltip.SetFont('Segoe UI', scaleForDisplay(15));
	g_tooltip.SetMaxWidth(scaleForDisplay(300));

	function font(name, size, style) {
		var font;
		try {
			font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	}
	ft.album_lrg = font(fontBold, pref.album_font_size ? pref.album_font_size : 20, 0);
	ft.album_med = font(fontBold, pref.album_font_size ? pref.album_font_size : 18, 0);
	ft.album_sml = font(fontBold, pref.album_font_size ? pref.album_font_size : 14, 0);
	ft.album_lrg_alt = font(fontRegular, 20, 0);
	ft.album_med_alt = font(fontRegular, 18, 0);
	ft.album_sml_alt = font(fontRegular, 14, 0);
	ft.album_substitle_lrg = font(fontBold, 20, g_font_style.italic);
	ft.album_substitle_med = font(fontBold, 18, g_font_style.italic);
	ft.album_substitle_sml = font(fontBold, 14, g_font_style.italic);
	ft.title_lrg = font(fontThin, pref.album_font_size ? pref.album_font_size : 20, 0);
	ft.title_med = font(fontThin, pref.album_font_size ? pref.album_font_size : 16, 0);
	ft.title_sml = font(fontThin, pref.album_font_size ? pref.album_font_size : 12, 0);
	ft.tracknum_lrg = font(fontLight, pref.tracknum_font_size ? pref.tracknum_font_size : 20, g_font_style.bold);
	ft.tracknum_med = font(fontLight, pref.tracknum_font_size ? pref.tracknum_font_size : 16, g_font_style.bold);
	ft.tracknum_sml = font(fontLight, pref.tracknum_font_size ? pref.tracknum_font_size : 12, g_font_style.bold);
	ft.year = font(fontRegular, 22, g_font_style.bold);

	if (pref.layout_mode === 'default_mode') {
	ft.artist_lrg = font(fontBold, pref.artist_font_size ? pref.artist_font_size : 18, 0);
	} else if (pref.layout_mode === 'playlist_mode') {
	ft.artist_lrg = font(fontBold, 16, 0);
	}

	ft.artist_med = font(fontBold, pref.artist_font_size ? pref.artist_font_size : 12, 0);
	ft.artist_sml = font(fontBold, pref.artist_font_size ? pref.artist_font_size : 8, 0);
	ft.track_info = font(fontThin, 18, 0);
	ft.track_info_sml = font(fontThin, 16, 0);
	ft.grd_key_lrg = font(fontRegular, pref.MetadataGrid_key_font_size ? pref.MetadataGrid_key_font_size : 18, 0); // used instead of ft.grd_key if ww > 1280
	ft.grd_val_lrg = font(fontLight, pref.MetadataGrid_val_font_size ? pref.MetadataGrid_val_font_size : 18, 0); // used instead of ft.grd_val if ww > 1280
	ft.grd_key_med = font(fontRegular, pref.MetadataGrid_key_font_size ? pref.MetadataGrid_key_font_size : 18, 0);
	ft.grd_val_med = font(fontLight, pref.MetadataGrid_val_font_size ? pref.MetadataGrid_val_font_size : 18, 0);
	ft.grd_key_sml = font(fontRegular, pref.MetadataGrid_key_font_size ? pref.MetadataGrid_key_font_size : 18, 0);
	ft.grd_val_sml = font(fontLight, pref.MetadataGrid_val_font_size ? pref.MetadataGrid_val_font_size : 18, 0);

	if (pref.layout_mode === 'default_mode') {
	ft.lower_bar = font(fontLight, pref.lower_bar_font_size ? pref.lower_bar_font_size : 18, 0);
	if (updateHyperlink) {
		updateHyperlink.setFont(ft.lower_bar);
	}
	ft.lower_bar_bold = font(fontBold, pref.lower_bar_font_size ? pref.lower_bar_font_size : 18, 0);
	} else if (pref.layout_mode === 'playlist_mode') {
	ft.lower_bar = font(fontLight, 16, 0);
	if (updateHyperlink) {
		updateHyperlink.setFont(ft.lower_bar);
	}
	ft.lower_bar_bold = font(fontBold, 16, 0);
	}

	ft.lower_bar_sml = font(fontLight, pref.lower_bar_font_size ? pref.lower_bar_font_size : 12, 0);
	ft.lower_bar_sml_bold = font(fontBold, pref.lower_bar_font_size ? pref.lower_bar_font_size : 12, 0);
	if (utils.CheckFont(fontLightAlternate)) {
		useNeue = true;
		ft.lower_bar_artist = font(fontLightAlternate, 18, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontLightAlternate, 8, g_font_style.italic);
	} else {
		ft.lower_bar_artist = font(fontThin, 18, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontThin, 8, g_font_style.italic);
	}
	ft.small_font = font(fontRegular, 14, 0);
	ft.guifx = font(fontGuiFx, Math.floor(pref.transport_buttons_size / 2), 0);
	ft.Marlett = font('Marlett', 13, 0);
	ft.SegoeUi = font('Segoe Ui Semibold', pref.menu_font_size, 0);
	ft.library_tree = font('Segoe UI', libraryProps.baseFontSize, 0);
	ft.lyrics = font(fontRegular, pref.lyricsFontSize || 20, 1);
}

function initColors() {

	if (pref.whiteTheme) {
		col.artist = RGB(120, 120, 120);
		col.bg = RGB(245, 245, 245);
		col.menu_bg = RGB(245, 245, 245);
		col.progress_fill = RGB(180, 180, 180);
		col.progress_bar = RGB(220, 220, 220);
		col.now_playing = RGB(120, 120, 120); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 60);

	} else if (pref.blackTheme) {
		col.artist = RGB(240, 240, 240);
		col.bg = RGB(25, 25, 25);
		col.menu_bg = RGB(25, 25, 25);
		col.progress_fill = RGB(100, 100, 100);
		col.progress_bar = RGB(50, 50, 50);
		col.now_playing = RGB(200, 200, 200); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 255);

	} else if (pref.blueTheme) {
		col.artist = RGB(242, 230, 170);
		col.bg = RGB(5, 110, 195);
		col.menu_bg = RGB(5, 110, 195);
		col.progress_fill = RGB(242, 230, 170);
		col.progress_bar = RGB(10, 130, 220);
		col.now_playing = RGB(245, 245, 245); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 90);

	} else if (pref.darkblueTheme) {
		col.artist = RGB(255, 202, 128);
		col.bg = RGB(22, 40, 63);
		col.menu_bg = RGB(22, 40, 63);
		col.progress_fill = RGB(255, 202, 128);
		col.progress_bar = RGB(27, 55, 90);
		col.now_playing = RGB(230, 230, 230); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 140);

	} else if (pref.redTheme) {
		col.artist = RGB(245, 212, 165);
		col.bg = RGB(100, 20, 20);
		col.menu_bg = RGB(100, 20, 20);
		col.progress_fill = RGB(245, 212, 165);
		col.progress_bar = RGB(140, 25, 25);
		col.now_playing = RGB(220, 220, 220); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 140);

	} else if (pref.creamTheme) {
		col.artist = RGB(100, 150, 110);
		col.bg = RGB(255, 247, 240);
		col.menu_bg = RGB(255, 247, 240);
		col.progress_fill = RGB(120, 170, 130);
		col.progress_bar = RGB(255, 255, 255);
		col.now_playing = RGB(100, 100, 100); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 60);

	} else if (pref.nblueTheme) {
		col.artist = RGB(0, 200, 255);
		col.bg = RGB(20, 20, 20);
		col.menu_bg = RGB(20, 20, 20);
		col.progress_fill = RGB(0, 200, 255);
		col.progress_bar = RGB(35, 35, 35);
		col.now_playing = RGB(220, 220, 220); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 140);

	} else if (pref.ngreenTheme) {
		col.artist = RGB(0, 200, 0);
		col.bg = RGB(20, 20, 20);
		col.menu_bg = RGB(20, 20, 20);
		col.progress_fill = RGB(0, 200, 0);
		col.progress_bar = RGB(35, 35, 35);
		col.now_playing = RGB(220, 220, 220); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 140);

	} else if (pref.nredTheme) {
		col.artist = RGB(229, 7, 44);
		col.bg = RGB(20, 20, 20);
		col.menu_bg = RGB(20, 20, 20);
		col.progress_fill = RGB(229, 7, 44);
		col.progress_bar = RGB(35, 35, 35);
		col.now_playing = RGB(220, 220, 220); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 140);

	} else if (pref.ngoldTheme) {
		col.artist = RGB(254, 204, 3);
		col.bg = RGB(20, 20, 20);
		col.menu_bg = RGB(20, 20, 20);
		col.progress_fill = RGB(254, 204, 3);
		col.progress_bar = RGB(35, 35, 35);
		col.now_playing = RGB(220, 220, 220); // tracknumber, title, and time
		col.aa_border = RGBA(60, 60, 60, 128);
		col.shadow = RGBA(0, 0, 0, 140);
	}

	col.rating = RGB(255, 170, 32);
	col.hotness = RGB(192, 192, 0);
}
initColors();

function setGeometry() {
	const showingMinMaxButtons = (UIHacks && UIHacks.FrameStyle) ? true : false;
	geo.aa_shadow = scaleForDisplay(6); // size of albumart shadow
	geo.pause_size = scaleForDisplay(75);

	if (pref.layout_mode === 'default_mode') {
	geo.prog_bar_h = scaleForDisplay(12) + (ww > 1920 ? 2 : 0); // height of progress bar
	} else if (pref.layout_mode === 'playlist_mode') {
	geo.prog_bar_h = scaleForDisplay(10) + (ww > 1920 ? 2 : 0); // height of progress bar
	}

	geo.lower_bar_h = scaleForDisplay(86); // height of song title and time + progress bar area
	geo.top_art_spacing = scaleForDisplay(40); // space between top of theme and artwork
	geo.top_bg_h = scaleForDisplay(160 + (showingMinMaxButtons ? 12 : 0)); // height of offset color background
	geo.timeline_h = scaleForDisplay(18); // height of timeline
	if (!pref.show_progress_bar) {
		//geo.lower_bar_h -= geo.prog_bar_h * 2; // disabled, need the same geo.prog_bar_h height for correct artwork Y-position
	}

	const basePath = `${paths.iconsBase}${settings.iconSet}/`;
	if (is_4k) {
		settingsImg = gdi.Image(`${basePath}64/${paths.settingsIcon}`);
		propertiesImg = gdi.Image(`${basePath}64/${paths.propertiesIcon}`);
		ratingsImg = gdi.Image(`${basePath}64/${paths.ratingIcon}`);
		playlistImg = gdi.Image(`${basePath}64/${paths.playlistIcon}`);
		libraryImg = gdi.Image(`${basePath}64/${paths.libraryIcon}`);
		lyricsImg = gdi.Image(`${basePath}64/${paths.lyricsIcon}`);
	} else {
		settingsImg = gdi.Image(`${basePath}32/${paths.settingsIcon}`);
		propertiesImg = gdi.Image(`${basePath}32/${paths.propertiesIcon}`);
		ratingsImg = gdi.Image(`${basePath}32/${paths.ratingIcon}`);
		playlistImg = gdi.Image(`${basePath}32/${paths.playlistIcon}`);
		libraryImg = gdi.Image(`${basePath}32/${paths.libraryIcon}`);
		lyricsImg = gdi.Image(`${basePath}32/${paths.lyricsIcon}`);
	}
}

var playedTimesRatios = [];

// PATHS
const paths = {};
paths.iconsBase = fb.ProfilePath + 'georgia\\images\\icons\\';

paths.settingsIcon = 'settings.png';
paths.propertiesIcon = 'properties.png';
paths.playlistIcon = 'playlist.png';
paths.libraryIcon = 'library.png';
paths.lyricsIcon = 'lyrics.png';
paths.ratingIcon = 'star.png';

paths.lastFmImageRed = fb.ProfilePath + 'georgia/images/last-fm-red-36.png';
paths.lastFmImageWhite = fb.ProfilePath + 'georgia/images/last-fm-36.png';
paths.labelsBase = fb.ProfilePath + 'images/recordlabel/'; // location of the record label logos for the bottom right corner
paths.artistlogos = fb.ProfilePath + 'images/artistlogos/'; // location of High-Qualiy band logos for the bottom left corner
paths.artistlogosColor = fb.ProfilePath + 'images/artistlogos color/';
paths.flagsBase = fb.ProfilePath + 'images/flags/'; // location of artist country flags

// MOUSE WHEEL SEEKING SPEED
pref.mouse_wheel_seek_speed = 5; // seconds per wheel step

// DEBUG
// var pref.show_debug_log = window.GetProperty("Debug: Show Debug Output", false);
var timings = {
	showDebugTiming: false, 	// spam console with debug timings
	showDrawTiming: false, 		// spam console with draw times
	showExtraDrawTiming: false, // spam console with every section of the draw code to determine bottlenecks
	drawRepaintRects: false, // outline window.RepaintRect in red
}

// PLAYLIST JUNK
var btns = {};
let btnImg = undefined;
// =================================================== //

// END OF CONFIGURATION /////////////////////////////////



// VARIABLES
// Artwork
var albumart = null; // albumart image
let albumart_size = new ImageSize(0, 0, 0, 0); // position (big image)
let cdart = null; // cdart image
/** @type {GdiBitmap[]} */
let cdartArray = [];
let cdart_size = new ImageSize(0, 0, 0, 0); // cdart position (offset from albumart_size)
var albumart_scaled = null; // pre-scaled album art to speed up drawing considerably
var recordLabels = []; // array of record label images
var recordLabelsInverted = []; // array of inverted record label images
var bandLogo = null; // band logo image
var invertedBandLogo = null; // inverted band logo image
var settingsImg = null; // settings image
var propertiesImg = null; // properties image
var ratingsImg = null; // rating image
var playlistImg = null; // playlist image
var libraryImg = null; // library image
var lyricsImg = null; // lyrics image
var lastFmImg = gdi.Image(paths.lastFmImageRed); // Last.fm logo image
var lastFmWhiteImg = gdi.Image(paths.lastFmImageWhite); // white Last.fm logo image
var shadow_image = null; // shadow behind the artwork + discart
var labelShadowImg = null; // shadow behind labels
var playlist_shadow = null; // shadow behind the playlist
var flagImgs = []; // array of flag images
let releaseFlagImg = null;
var rotatedCD = null; // drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated
let disc_art_loading; // for on_load_image_done()
let album_art_loading; // for on_load_image_done()
var isStreaming = false; // is the song from a streaming source?
let newTrackFetchingArtwork = false; // only load theme colors when newTrackFetchingArtwork = true
let noArtwork = false; // only use default theme when noArtwork was found
let embeddedArt = false; // when artwork displayed is embedded and not loaded from a file
var themeColorSet = false; // when no artwork, don't set themeColor every redraw
var playCountVerifiedByLastFm = false; // show Last.fm image when we %lastfm_play_count% > 0
var art_off_center = false; // if true, album art has been shifted 40 pixels to the right
var loadFromCache = true; // always load art from cache unless this is set

/**
 * @typedef {Object} MetadataGridObj
 * @property {boolean=} age Should the age of the field also be calculated (i.e. add the "(3y 5m 11d)" to `val`)
 * @property {string} label Grid label
 * @property {string} val Grid value. If `val.trim().length === 0`. The grid entry will not be shown.
 */
/**
 * @typedef {Object} StringsObj Collection of strings and other objects to be displayed throughout UI
 * @property {string=} artist
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
 */
/** @type StringsObj */
let str = {};
var state = {}; // panel state

// TIMERS
let progressBarTimer; // 40ms repaint of progress bar
let albumArtTimeout; // setTimeout ID for rotating album art
let hideCursorTimeout; // setTimeout ID for hiding cursor
let cdartRotationTimer;

// STATUS VARIABLES
let ww = 0;
let wh = 0; // size of panel
/** @type ProgressBar */
let progressBar = null;
var last_pb; // saves last playback order
var just_dblclicked = false;
var aa_list = [];
var albumArtIndex = 0; // index of currently displayed album art if more than 1
var t_interval; // milliseconds between screen updates
let lastLeftEdge = 0; // the left edge of the record labels. Saved so we don't have to recalculate every on every on_paint unless size has changed
let lastLabelHeight = 0;
let displayPlaylist = false;
let displayLibrary = false;
let displayBiography = false;

var tl_firstPlayedRatio = 0;
var tl_lastPlayedRatio = 0;

let currentFolder;
let lastFolder;
var lastDiscNumber;
var lastVinylSide;
var currentLastPlayed = '';

/** @type {FbTooltip} */
let g_tooltip;
const tt = new TooltipHandler();

// MENU STUFF
let menu_down = false;

///////// OBJECTS

const artCache = new ArtCache(15);

var pauseBtn = new PauseButton();

var volume_btn;

// Call initialization function
on_init();

let repaintRects = [];

// ====================================== UIHACKS SETTINGS ====================================== //

var maximizeToFullScreen = window.GetProperty("Maximize To FullScreen", true);
var safeMode = false;
//var componentUiHacks = false;
//var UIHacks;

var pseudoCaption;
var pseudoCaptionWidth;
var mouseInPanel = false;
UIHacks.FrameStyle = 3;
UIHacks.MoveStyle = 3;
UIHacks.Aero.Effect = 2;
UIHacks.Aero.Top = 1;
UIHacks.BlockMaximize = true;

/*
if (!safeMode) {
	componentUiHacks = utils.CheckComponent("foo_ui_hacks");
	if (componentUiHacks) {
		UIHacks = new ActiveXObject("UIHacks");
	}
}

	var FrameStyle = {
	Default: 0,
	SmallCaption: 1,
	NoCaption: 2,
	NoBorder: 3
	}
*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param {GdiGraphics} gr
 */
function draw_ui(gr) {
	let topBarProfiler = null;
	if (timings.showExtraDrawTiming) {
		topBarProfiler = fb.CreateProfiler('on_paint -> top bar');
	}
	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	gr.SetSmoothingMode(SmoothingMode.None);

	// Background
	if (!albumart && noArtwork) { // we use noArtwork to prevent flashing of blue default theme
		albumart_size.x = isStreaming ? ww : Math.floor(ww / 2); // if there's no album art info panel takes up 1/2 screen
		albumart_size.w = albumart_size.x;
		albumart_size.y = geo.top_art_spacing;
		albumart_size.h = playlist.h + (is_4k ? 2 : 1);
		if (!themeColorSet) {
			setTheme(blueTheme.colors);
			themeColorSet = true;
		}
	}
	gr.FillSolidRect(0, 0, ww, wh, col.bg);
	//gr.FillSolidRect(0, 0, ww, geo.top_bg_h, col.menu_bg); // I don't need this
	if ((fb.IsPaused || fb.IsPlaying) && (!albumart && cdart)) {
		// info grid background drawn here before cdArt if no albumArt
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.primary);
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
	}

	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	var textLeft = scaleForDisplay(40);
	// Top bar Year, and track info
	if (((!displayPlaylist && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		const textRightGap = textLeft;
		let trackInfoHeight = 0;
		const infoWidth = ww - albumart_size.x - albumart_size.w - textRightGap;
		if (str.trackInfo) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
			let infoLeft = ww - textRightGap - infoWidth;
			if (cdart && pref.display_cdart) {
				const infoY = geo.top_bg_h - scaleForDisplay(15);
				const radius = cdart_size.h / 2;
				const angle = Math.asin((cdart_size.y + radius - infoY) / radius);
				const cdRight = cdart_size.x + radius + radius * Math.cos(angle);
				// gr.DrawLine(cdRight, geo.top_bg_h - trackInfoHeight - scaleForDisplay(15), cdRight, geo.top_bg_h - scaleForDisplay(15), 2, rgb(255,0,0));
				infoLeft = Math.ceil(Math.max(ww - textRightGap - infoWidth, cdRight));
			}
			const maxInfoWidth = ww - infoLeft - textRightGap + 1;

			let drawnInfo = str.trackInfo;
			let infoFont = ft.track_info;
			let infoSize = gr.MeasureString(drawnInfo, infoFont, 0, 0, 0, 0);
			if (infoSize.Width > maxInfoWidth) {
				infoFont = ft.track_info_sml;
				infoSize = gr.MeasureString(drawnInfo, infoFont, 0, 0, 0, 0);
			}
			while (infoSize.Width > maxInfoWidth && drawnInfo.length > 0) {
				const array = drawnInfo.split(' | ');
				array.pop();
				drawnInfo = array.join(' | ');
				infoSize = gr.MeasureString(drawnInfo, infoFont, 0, 0, 0, 0);
			}
			if (drawnInfo.length && maxInfoWidth) {
				trackInfoHeight = Math.ceil(infoSize.Height + 1);
				//gr.DrawString(drawnInfo, infoFont, col.artist, infoLeft, geo.top_bg_h - trackInfoHeight - scaleForDisplay(73), maxInfoWidth, trackInfoHeight, StringFormat(2));
				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
			}
		}
		if (str.year) {
			/** @type {MeasureStringInfo} */
			const measurements = gr.MeasureString(str.year, ft.year, 0, 0, 0, 0);
			if (measurements.Width < infoWidth) {
				//gr.DrawString(str.year, ft.year, col.artist, ww - textRightGap - infoWidth, geo.top_bg_h - trackInfoHeight - measurements.Height - scaleForDisplay(73), infoWidth, measurements.Height, StringFormat(2));
			}
		}
	}
	topBarProfiler && topBarProfiler.Print();

	// BIG ALBUMART
	if (fb.IsPlaying) {
		let drawArt = null;
		if (timings.showExtraDrawTiming) {
			drawArt = fb.CreateProfiler('on_paint -> artwork');
		}
		if (cdart && !rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart) {
			CreateRotatedCDImage();
		}
		if (!pref.darkMode && (albumart_scaled || rotatedCD)) {
			shadow_image && gr.DrawImage(shadow_image, -geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height,
				0, 0, shadow_image.Width, shadow_image.Height);
			// gr.DrawRect(-geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height, 1, RGBA(0,0,255,125)); // viewing border line
		}
		if (albumart && albumart_scaled) {
			if (!pref.cdart_ontop || pref.displayLyrics) {
				if (rotatedCD && !displayPlaylist && !displayLibrary) {
					drawCdArt(gr);
				}
				gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.Width, albumart_scaled.Height);
			} else { // draw cdart on top of front cover
				gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.Width, albumart_scaled.Height);
				if (rotatedCD && !displayPlaylist && !displayLibrary) {
					drawCdArt(gr);
				}
			}
			if (pref.displayLyrics && albumart_scaled && fb.IsPlaying) {
				gr.FillSolidRect(albumart_size.x - 1, albumart_size.y - 1, albumart_size.w + 1, albumart_size.h + 1, RGBA(0, 0, 0, 155));
				gLyrics && gLyrics.drawLyrics(gr);
			}
		} else if (rotatedCD && pref.display_cdart) {
			// cdArt, but no album art
			drawCdArt(gr);
		}
		if (timings.showExtraDrawTiming) drawArt.Print();

	}
	if (fb.IsPlaying && (albumart || !cdart) && ((!displayLibrary && !displayPlaylist) || !settings.hidePanelBgWhenCollapsed)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.primary); // info bg -- must be drawn after shadow
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
		if (isStreaming && noArtwork && pref.whiteTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 13 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 8 : 5, 90, RGBtoRGBA(col.shadow, 30), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		} else if (isStreaming && noArtwork && pref.blackTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 13 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 80), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		} else if (isStreaming && noArtwork && pref.blueTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 13 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 26)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 26)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 34), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		} else if (isStreaming && noArtwork && pref.darkblueTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 13 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 72)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 72)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 60), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		} else if (isStreaming && noArtwork && pref.redTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 13 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 72)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 72)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 72), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		} else if (isStreaming && noArtwork && pref.creamTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 13 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 18), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		} else if (isStreaming && noArtwork && pref.nblueTheme || isStreaming && noArtwork && pref.ngreenTheme || isStreaming && noArtwork && pref.nredTheme || isStreaming && noArtwork && pref.ngoldTheme) {
			gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, g_pl_colors.background); // info bg -- must be drawn after shadow
			gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 10 : 6), albumart_size.w + 2, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 180)); // Artwork's Top Pseudo Shadow Fix
			gr.FillGradRect(is_4k ? albumart_size.x - 4 : albumart_size.x - 2, is_4k ? albumart_size.y - 4 : albumart_size.y, is_4k ? 8 : 4, is_4k ? albumart_size.h + 4 : albumart_size.h, 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Artwork's Left Side Pseudo Shadow Fix
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (is_4k ? 4 : 2), albumart_size.w, is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 120), RGBtoRGBA(col.shadow, 0)); // Artwork's Bottom Pseudo Shadow Fix
		}
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}
	if (fb.IsPaused) {
		pauseBtn.draw(gr);
	}

	if (pref.layout_mode === 'default_mode') {
		var textLeft = scaleForDisplay(40);
		if (str.artist) {
			var availableWidth = displayPlaylist || displayLibrary ? Math.min(ww / 2 - 20, btns.playlist.x - textLeft) : btns.playlist.x - textLeft;
			var artistFont = chooseFontForWidth(gr, availableWidth, str.artist, [ft.artist_lrg, ft.artist_med, ft.artist_sml]);
			const height = gr.CalcTextHeight(str.artist, artistFont);
			const width = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
			var artistY = wh - geo.lower_bar_h + scaleForDisplay(2);
			let flagSize = is_4k ? 64 : 32;
			if (pref.show_flags && flagImgs.length && width + flagImgs[0].Width * flagImgs.length < availableWidth) {
				//var flagsLeft = textLeft + width + scaleForDisplay(8);
				var flagsLeft = textLeft;
				for (let i = 0; i < flagImgs.length; i++) {
					//gr.DrawImage(flagImgs[i], flagsLeft, Math.round(artistY + (is_4k ? scaleForDisplay(6) : scaleForDisplay(4)) + height / 2 - flagImgs[i].Height / 2),
					//	flagImgs[i].Width - scaleForDisplay(8), flagImgs[i].Height - scaleForDisplay(8), 0, 0, flagImgs[i].Width, flagImgs[i].Height)
					//flagsLeft += flagImgs[i].Width + scaleForDisplay(5);
					//gr.DrawString(str.artist, artistFont, col.artist, textLeft + flagSize, artistY, availableWidth, height, StringFormat(0, 0, 4));
				}
			} else {
				//gr.DrawString(str.artist, artistFont, col.artist, textLeft, artistY, availableWidth, height, StringFormat(0, 0, 4));
			}
		}
	}

	// text info grid
	if (((!displayPlaylist && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		let drawTextGrid = null;
		if (timings.showExtraDrawTiming) drawTextGrid = fb.CreateProfiler('on_paint -> textGrid');
		let gridSpace = 0;
		if (!albumart && cdart) {
			gridSpace = Math.round(cdart_size.x - geo.aa_shadow - textLeft);
		} else {
			gridSpace = Math.round(albumart_size.x - geo.aa_shadow - textLeft);
		}
		const text_width = gridSpace;

		var c = new Color(col.primary);
		if (c.brightness > 190) {
			col.info_text = rgb(55, 55, 55);
		} else {
			col.info_text = rgb(255, 255, 255);
		}
		if (pref.whiteTheme && isStreaming || pref.creamTheme && isStreaming) {
			col.info_text = rgb(120, 120, 120);
		}

		var top = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + scaleForDisplay(68);
		if (gridSpace > 120) {
			/** @type {MeasureStringInfo} */
			let txtRec;
			
			function drawTitle(top) {
				if (!str.title) return 0;
				ft.title = ft.album_lrg;
				ft.tracknum = ft.tracknum_lrg;
				let title_spacing = scaleForDisplay(8);
				var trackNumWidth = 0;
				if (str.tracknum) {
					trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
				}
				txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
				if (txtRec.Lines > 2) {
					ft.title = ft.title_med;
					ft.tracknum = ft.tracknum_med;
					title_spacing = scaleForDisplay(7);
					if (str.tracknum) {
						trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
					}
					txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
					if (txtRec.Lines > 2) {
						ft.title = ft.title_sml;
						ft.tracknum = ft.tracknum_sml;
						title_spacing = scaleForDisplay(6);
						if (str.tracknum) {
							trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
						}
						txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
					}
				}
				const tracknumHeight = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Height;
				const heightAdjustment = Math.ceil((tracknumHeight - gr.MeasureString(str.title, ft.title, 0, 0, 0, 0).Height) / 2);
				const numLines = Math.min(2, txtRec.Lines);
				const height = gr.CalcTextHeight(str.title, ft.title) * numLines + 3;

				trackNumWidth = Math.ceil(trackNumWidth);
				gr.DrawString(str.tracknum, ft.tracknum, col.info_text, textLeft, top - heightAdjustment + 1, trackNumWidth, height);
                if (is_4k) {
                    gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
                } else {
                    gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit); // thicker fonts can use anti-alias
                }
				gr.DrawString(str.title, ft.title, col.info_text, textLeft + trackNumWidth, top, text_width - trackNumWidth, height, g_string_format.trim_ellipsis_word);

				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				return height + scaleForDisplay(7);
			}
			

			top += geo.timeline_h - scaleForDisplay(55);

			function drawAlbumTitle(top, maxLines) {
				let height = 0;
				if (!str.album) return height;
				let font_array = [ft.album_lrg, ft.album_med, ft.album_sml];
				if (str.album.indexOf('Á') !== -1) {
					// some fonts don't work correctly with this character
					font_array = [ft.album_lrg_alt, ft.album_med_alt, ft.album_sml_alt];
				}
				var subtitlefont_array = [ft.album_substitle_lrg, ft.album_substitle_med, ft.album_substitle_sml];
				height = drawMultipleLines(gr, text_width, textLeft, top, col.info_text, str.album, font_array,
					str.album_subtitle, subtitlefont_array, maxLines);
				return height + scaleForDisplay(10);
			}

			if (pref.showTitleInGrid) {
				top += drawTitle(top);
			} else {
				top += drawAlbumTitle(top, 3);
			}
			//Timeline playcount bars
			if (fb.IsPlaying && str.timeline) {
				str.timeline.setSize(0, top + scaleForDisplay(4), albumart_size.x);
				str.timeline.draw(gr);
			}
			top += geo.timeline_h + scaleForDisplay(18);
			if (pref.showTitleInGrid) {
				top += drawAlbumTitle(top, 2);
			}

			// Tag grid
			var font_array = [ft.grd_key_lrg, ft.grd_key_med, ft.grd_key_sml];
			var key_font_array = [ft.grd_val_lrg, ft.grd_val_med, ft.grd_val_sml];
			let grid_key_ft = ft.grd_key_lrg;
			str.grid.forEach((el) => {
				if (font_array.length > 1) {	// only check if there's more than one entry in font_array
					grid_key_ft = chooseFontForWidth(gr, text_width / 3, el, font_array);
					while (grid_key_ft !== font_array[0]) {	// if font returned was first item in the array, then everything fits, otherwise pare down array
						font_array.shift();
						key_font_array.shift();
					}
				}
			});
			const grid_val_ft = key_font_array.shift();
			const col1_width = calculateGridMaxTextWidth(gr, str.grid, grid_key_ft);

			var column_margin = scaleForDisplay(10);
			var col2_width = text_width - column_margin - col1_width;
			var col2_left = textLeft + col1_width + column_margin;

			gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
			for (let k = 0; k < str.grid.length; k++) {
				var key = str.grid[k].label;
				var value = str.grid[k].val;
				let showLastFmImage = false;
				let showReleaseCountryFlagImage = false;
				var dropShadow = false;
				var grid_val_col = col.info_text;

				if (value.length) {
					switch (key) {
						case 'Rating':
							grid_val_col = col.rating;
							dropShadow = true;
							break;
						case 'Hotness':
							grid_val_col = col.hotness;
							dropShadow = true;
							break;
						case 'Play Count':
							showLastFmImage = true;
							break;
						case 'Catalog #':
						case 'Release Country':
							showReleaseCountryFlagImage = settings.showReleaseCountryFlag;
							break;
						default:
							break;
					}
					txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2_width, wh);
					if (top + txtRec.Height < albumart_size.y + albumart_size.h) {
						var border_w = scaleForDisplay(0.5);
						const cell_height = txtRec.Height + 5;
						if (dropShadow) {
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top - border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top - border_w, col2_width, cell_height, StringFormat(0, 0, 4));
						}
						gr.DrawString(key, grid_key_ft, col.info_text, textLeft, top, col1_width, cell_height, g_string_format.trim_ellipsis_char); // key
						gr.DrawString(value, grid_val_ft, grid_val_col, col2_left, top, col2_width, cell_height, StringFormat(0, 0, 4));

						if (playCountVerifiedByLastFm && showLastFmImage) {
							let lastFmLogo = lastFmImg;
							if (colorDistance(col.primary, rgb(185, 0, 0), false) < 133) {
								lastFmLogo = lastFmWhiteImg;
							}
							const heightRatio = (cell_height - 12) / lastFmLogo.Height;
							if (txtRec.Width + scaleForDisplay(12) + Math.round(lastFmLogo.Width * heightRatio) < col2_width) {
								gr.DrawImage(lastFmLogo, col2_left + txtRec.Width + scaleForDisplay(12), top + 3, Math.round(lastFmLogo.Width * heightRatio), cell_height - 12,
									0, 0, lastFmLogo.Width, lastFmLogo.Height);
							}
						}
						if (showReleaseCountryFlagImage && releaseFlagImg) {
							const heightRatio = (cell_height) / releaseFlagImg.Height;
							if (txtRec.Width + scaleForDisplay(10) + Math.round(releaseFlagImg.Width * heightRatio) < col2_width) {
								gr.DrawImage(releaseFlagImg, col2_left + txtRec.Width + scaleForDisplay(10), top - 3, Math.round(releaseFlagImg.Width * heightRatio), cell_height,
									0, 0, releaseFlagImg.Width, releaseFlagImg.Height);
							}
						}
						top += cell_height + 5;
					}
				}
			}
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		}
		if (timings.showExtraDrawTiming) drawTextGrid.Print();
	} /* if (!displayPlaylist && !displayLibrary) */

	if ((fb.IsPlaying && !displayPlaylist && !displayLibrary) || (!albumart && !cdart && noArtwork)) {
		let drawLogos = null;
		timings.showExtraDrawTiming && (drawLogos = fb.CreateProfiler('on_paint -> logos/labels'));
		// BAND LOGO drawing code
		const brightBackground = (new Color(col.primary).brightness) > 190;
		const availableSpace = albumart_size.y + albumart_size.h - top;
		var logo = brightBackground ? (invertedBandLogo ? invertedBandLogo : bandLogo) : bandLogo;
		if (logo && availableSpace > 75) {
			// max width we'll draw is 1/2 the full size because the HQ images are just so big
			let logoWidth = Math.min(is_4k ? logo.Width : logo.Width / 2, albumart_size.x - ww * 0.05);
			let heightScale = logoWidth / logo.Width; // width is fixed to logoWidth, so scale height accordingly
			if (logo.Height * heightScale > availableSpace) {
				// TODO: could probably do this calc just once, but the logic is complicated
				heightScale = availableSpace / logo.Height;
				logoWidth = logo.Width * heightScale;
			}
			let logoTop = Math.round(albumart_size.y + albumart_size.h - (heightScale * logo.Height)) - 4;
			if (is_4k) {
				logoTop -= 20;
			}
			gr.DrawImage(logo, Math.round(isStreaming ? scaleForDisplay(40) : albumart_size.x / 2 - logoWidth / 2), logoTop, Math.round(logoWidth), Math.round(logo.Height * heightScale),
				0, 0, logo.Width, logo.Height, 0);
		}

		// RECORD LABEL drawing code
		// this section should draw in 3ms or less always
		if (recordLabels.length > 0) {
			const labels = brightBackground && !pref.labelArtOnBg ? (recordLabelsInverted.length ? recordLabelsInverted : recordLabels) : recordLabels;
			var rightSideGap = 20, // how close last label is to right edge
				labelSpacing = 0,
				leftEdgeGap = (art_off_center ? 20 : 40) * (is_4k ? 1.8 : 1), // space between art and label
				maxLabelWidth = scaleForDisplay(200);
			let leftEdgeWidth = is_4k ? 45 : 30; // how far label background extends on left
			let totalLabelWidth = 0;
			let labelAreaWidth = 0;
			let leftEdge = 0;
			let topEdge = 0;
			let labelWidth;
			let labelHeight;
			// let drawLabelTime = null;
			// if (timings.showExtraDrawTiming) drawLabelTime = fb.CreateProfiler('on_paint -> record labels');

			for (let i = 0; i < labels.length; i++) {
				if (labels[i].Width > maxLabelWidth) {
					totalLabelWidth += maxLabelWidth;
				} else {
					if (is_4k && labels[i].Width < 200) {
						totalLabelWidth += labels[i].Width * 2;
					} else {
						totalLabelWidth += labels[i].Width;
					}
				}
			}
			if (!lastLeftEdge) { // we don't want to recalculate this every screen refresh
				debugLog('recalculating lastLeftEdge');
				labelShadowImg = null;
				labelWidth = Math.round(totalLabelWidth / labels.length);
				labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // might be recalc'd below
				if (albumart) {
					if (cdart && pref.display_cdart) {
						leftEdge = Math.round(Math.max(albumart_size.x + albumart_scaled.Width + 5, ww * 0.975 - totalLabelWidth + 1));
						var cdCenter = {};
						cdCenter.x = Math.round(cdart_size.x + cdart_size.w / 2);
						cdCenter.y = Math.round(cdart_size.y + cdart_size.h / 2);
						var radius = cdCenter.y - cdart_size.y;

						while (true) {
							const allLabelsWidth = Math.max(Math.min(Math.round((ww - leftEdge - rightSideGap) / labels.length), maxLabelWidth), 50);
							//console.log("leftEdge = " + leftEdge + ", ww-leftEdge-10 = " + (ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
							var maxWidth = is_4k && labels[0].Width < 200 ? labels[0].Width * 2 : labels[0].Width;
							labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
							labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // width is based on height scale
							topEdge = Math.round(albumart_size.y + albumart_size.h - labelHeight);

							var a = topEdge - cdCenter.y + 1; // adding 1 to a and b so that the border just touches the edge of the cdart
							var b = leftEdge - cdCenter.x + 1;

							if ((a * a + b * b) > radius * radius) {
								break;
							}
							leftEdge += 4;
						}
					} else {
						leftEdge = Math.round(Math.max(albumart_size.x + albumart_size.w + leftEdgeWidth + leftEdgeGap, ww * 0.975 - totalLabelWidth + 1));
					}
				} else {
					leftEdge = Math.round(ww * 0.975 - totalLabelWidth);
				}
				labelAreaWidth = ww - leftEdge - rightSideGap;
				lastLeftEdge = leftEdge;
				lastLabelHeight = labelHeight;
			} else {
				// already calculated
				leftEdge = lastLeftEdge;
				labelHeight = lastLabelHeight;
				labelAreaWidth = ww - leftEdge - rightSideGap;
			}
			if (labelAreaWidth >= scaleForDisplay(50)) {
				if (labels.length > 1) {
					labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				const allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
				var labelX = leftEdge;
				topEdge = albumart_size.y + albumart_size.h - labelHeight - 20;
				const origLabelHeight = labelHeight;

				if (!pref.labelArtOnBg) {
					if (!pref.darkMode) {
						if (!labelShadowImg) {
							labelShadowImg = createShadowRect(ww - labelX + leftEdgeWidth, labelHeight + 40);
						}
						gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.aa_shadow, topEdge - 20 - geo.aa_shadow, ww - labelX + leftEdgeWidth + 2 * geo.aa_shadow, labelHeight + 40 + 2 * geo.aa_shadow,
							0, 0, labelShadowImg.Width, labelShadowImg.Height);
					}
					gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
					gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40, col.primary);
					gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, col.accent);
					gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
				}
				for (let i = 0; i < labels.length; i++) {
					// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
					var maxWidth = is_4k && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
					labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
					labelHeight = Math.round(labels[i].Height * labelWidth / labels[i].Width); // width is based on height scale

					gr.DrawImage(labels[i], labelX, Math.round(topEdge + origLabelHeight / 2 - labelHeight / 2), labelWidth, labelHeight, 0, 0, recordLabels[i].Width, recordLabels[i].Height);
					// gr.DrawRect(labelX, topEdge, labelWidth, labelHeight, 1, RGB(255,0,0));	// shows bounding rect of record labels
					labelX += labelWidth + labelSpacing;
				}
				labelHeight = origLabelHeight; // restore
			}
			// if (timings.showExtraDrawTiming) drawLabelTime.Print();
		}
		if (timings.showExtraDrawTiming) drawLogos.Print();
	} /* if (!displayPlaylist && !displayLibrary) */

	// LOWER BAR
	if (pref.layout_mode === 'default_mode') {
	var lowerBarTop = wh - geo.lower_bar_h + (is_4k ? scaleForDisplay(0) : scaleForDisplay(2));
	} else if (pref.layout_mode === 'playlist_mode') {
	var lowerBarTop = wh - geo.lower_bar_h - (is_4k ? scaleForDisplay(16) : scaleForDisplay(14));
	}

	// Title & artist
	let timeAreaWidth = 0;
	if (ww > 400) {
		if (str.disc != '') {
			timeAreaWidth = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft.lower_bar);
		} else {
			timeAreaWidth = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft.lower_bar);
		}
	}

	// Playlist/Library
	if (pref.layout_mode === 'default_mode') {
		if (displayPlaylist) {
			let drawPlaylistProfiler = null;
			timings.showExtraDrawTiming && (drawPlaylistProfiler = fb.CreateProfiler('on_paint -> playlist'));
			if (!pref.darkMode) {
				if (!playlist_shadow) {
					playlist_shadow = createShadowRect(playlist.w + 2 * geo.aa_shadow, playlist.h); // extend shadow past edge
				}
				gr.DrawImage(playlist_shadow, playlist.x - geo.aa_shadow + 1, playlist.y - geo.aa_shadow + 1, playlist.w + 1 * geo.aa_shadow, playlist.h + 1 * geo.aa_shadow + 4,
					0, 0, playlist_shadow.Width, playlist_shadow.Height);
			} else {
				//gr.DrawRect(playlist.x - 1, playlist.y - 1, playlist.w + 2, playlist.h + 2, 1, rgb(64,64,64));
			}
			playlist.on_paint(gr);
			timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
		} else if (displayLibrary) {
			let drawLibraryProfiler = null;
			timings.showExtraDrawTiming && (drawLibraryProfiler = fb.CreateProfiler('on_paint -> library'));
	
			libraryPanel.on_paint(gr);
			if (pref.darkMode) {
				//gr.DrawRect(libraryPanel.x - 1, libraryPanel.y - 1, libraryPanel.w + 2, libraryPanel.h + 2, 1, rgb(64,64,64));
			}
			drawLibraryProfiler && drawLibraryProfiler.Print();
		} if (displayBiography) {
			biographyPanel.on_paint(gr);
			playlist.on_paint(gr);
		}
	} else if (pref.layout_mode === 'playlist_mode') {
		if (displayPlaylist) {
			let drawPlaylistProfiler = null;
			timings.showExtraDrawTiming && (drawPlaylistProfiler = fb.CreateProfiler('on_paint -> playlist'));
			gr.FillSolidRect(0, 0, ww, wh, col.bg); // Hide Artwork Cover when switching to Playlist Mode & Playlist Mode 'Player Size Big'
			playlist.on_paint(gr);
			timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
		}
	}

	// MENUBAR
	let drawMenuBar = null;
	timings.showExtraDrawTiming && (drawMenuBar = fb.CreateProfiler('on_paint -> menu bar'));
	for (var i in btns) {
		var x = btns[i].x,
			y = btns[i].y,
			w = btns[i].w,
			h = btns[i].h,
			img = btns[i].img;

		if (img) { // TODO: fix
			gr.DrawImage(img[0], x, y, w, h, 0, 0, w, h, 0, 255); // normal
			btns[i].hoverAlpha && gr.DrawImage(img[1], x, y, w, h, 0, 0, w, h, 0, btns[i].hoverAlpha);
			btns[i].downAlpha && gr.DrawImage(img[2], x, y, w, h, 0, 0, w, h, 0, btns[i].downAlpha);
			btns[i].enabled && img[3] && gr.DrawImage(img[3], x, y, w, h, 0, 0, w, h, 0, 255);
		}
	}

	timings.showExtraDrawTiming && drawMenuBar.Print();

	let drawLowerBarProfiler = null;
	timings.showExtraDrawTiming && (drawLowerBarProfiler = fb.CreateProfiler('on_paint -> lower bar'));

	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);

	if (pref.layout_mode === 'default_mode') {

		var ft_lower_bold = ft.lower_bar_bold;
		var ft_lower = ft.lower_bar;
		var ft_lower_orig_artist = ft.lower_bar_artist;
		var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
		var titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
		var origArtistWidth = gr.MeasureString(str.original_artist, ft_lower_orig_artist, 0, 0, 0, 0).Width;
		/*
		if (timeAreaWidth + trackNumWidth + titleMeasurements.Width + origArtistWidth > 0.95 * ww) {
			// we don't have room for all the text so use a smaller font and recalc size
			ft_lower_bold = ft.lower_bar_sml_bold;
			ft_lower = ft.lower_bar_sml;
			ft_lower_orig_artist = ft.lower_bar_artist_sml;
			titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
			trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft.lower_bar_sml_bold, 0, 0, 0, 0).Width);
			if (str.disc !== '') {
				timeAreaWidth = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft_lower);
			} else {
				timeAreaWidth = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft_lower);
			}
		}
		*/
		var heightAdjustment = is_4k ? 1 : 0;
		if (str.artist && pref.layout_mode === 'default_mode') {
			const width = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
			const height = gr.CalcTextHeight(str.artist, artistFont);
			var artistTitleTrackWidth = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width + gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0).Width;
			let flagSize = is_4k ? 64 : 32;

			if (artistTitleTrackWidth > 0.35 * ww) {
				if (pref.show_flags && flagImgs.length && width + flagImgs[0].Width * flagImgs.length) {
					var flagsLeft = textLeft - (is_4k ? 1 : 0);
					for (let i = 0; i < flagImgs.length; i++) {
						gr.DrawImage(flagImgs[i], flagsLeft,
							pref.lower_bar_font_size === 24 ? Math.round(artistY - (is_4k ? 45 : 22) + height / 2 - flagImgs[i].Height / 2) : !pref.lower_bar_font_size === 24 ? Math.round(artistY - (is_4k ? 34 : 17) + height / 2 - flagImgs[i].Height / 2) : 0 +
							pref.lower_bar_font_size === 22 ? Math.round(artistY - (is_4k ? 41 : 19) + height / 2 - flagImgs[i].Height / 2) : !pref.lower_bar_font_size === 22 ? Math.round(artistY - (is_4k ? 34 : 17) + height / 2 - flagImgs[i].Height / 2) : 0 +
							pref.lower_bar_font_size === 20 ? Math.round(artistY - (is_4k ? 40 : 19) + height / 2 - flagImgs[i].Height / 2) : !pref.lower_bar_font_size === 20 ? Math.round(artistY - (is_4k ? 34 : 17) + height / 2 - flagImgs[i].Height / 2) : 0 +
							pref.lower_bar_font_size === 18 ? Math.round(artistY - (is_4k ? 36 : 17) + height / 2 - flagImgs[i].Height / 2) : !pref.lower_bar_font_size === 18 ? Math.round(artistY - (is_4k ? 34 : 17) + height / 2 - flagImgs[i].Height / 2) : 0 +
							pref.lower_bar_font_size === 16 ? Math.round(artistY - (is_4k ? 34 : 16) + height / 2 - flagImgs[i].Height / 2) : !pref.lower_bar_font_size === 16 ? Math.round(artistY - (is_4k ? 34 : 17) + height / 2 - flagImgs[i].Height / 2) : 0,
							flagImgs[i].Width - scaleForDisplay(8), flagImgs[i].Height - scaleForDisplay(8), 0, 0, flagImgs[i].Width, flagImgs[i].Height)
						flagsLeft += flagImgs[i].Width;
					}
				}
				gr.DrawString(str.artist, artistFont, col.artist, textLeft + (pref.show_flags && flagImgs.length ? flagSize + 2 : 0) - (is_4k ? 2 : 1) +
					// X-Coordinates
					(pref.lower_bar_font_size === 24 && pref.show_flags && flagImgs.length ? scaleForDisplay(11) : pref.lower_bar_font_size === 24 && !pref.show_flags ? scaleForDisplay(1) : 0) +
					(pref.lower_bar_font_size === 22 && pref.show_flags && flagImgs.length ? scaleForDisplay(7)  : pref.lower_bar_font_size === 22 && !pref.show_flags ? scaleForDisplay(1) : 0) +
					(pref.lower_bar_font_size === 20 && pref.show_flags && flagImgs.length ? scaleForDisplay(3)  : pref.lower_bar_font_size === 20 && !pref.show_flags ? scaleForDisplay(1) : 0) +
					(pref.lower_bar_font_size === 18 && pref.show_flags && flagImgs.length ? scaleForDisplay(0)  : pref.lower_bar_font_size === 18 && !pref.show_flags ? scaleForDisplay(1) : 0) +
					(pref.lower_bar_font_size === 16 && pref.show_flags && flagImgs.length ? scaleForDisplay(-4) : pref.lower_bar_font_size === 16 && !pref.show_flags ? scaleForDisplay(2) : 0),
					// Y-Coordinates
					(pref.lower_bar_font_size === 24 ? lowerBarTop - scaleForDisplay(25) + heightAdjustment : !pref.lower_bar_font_size === 24 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : 0) +
					(pref.lower_bar_font_size === 22 ? lowerBarTop - scaleForDisplay(23) + heightAdjustment : !pref.lower_bar_font_size === 22 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : 0) +
					(pref.lower_bar_font_size === 20 ? lowerBarTop - scaleForDisplay(22) + heightAdjustment : !pref.lower_bar_font_size === 20 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : 0) +
					(pref.lower_bar_font_size === 18 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : !pref.lower_bar_font_size === 18 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : 0) +
					(pref.lower_bar_font_size === 16 ? lowerBarTop - scaleForDisplay(19) + heightAdjustment : !pref.lower_bar_font_size === 18 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : 0),
					// End String
					availableWidth, height, StringFormat(0, 0, 4));
				gr.DrawString(str.tracknum, ft_lower, col.now_playing, progressBar.x - (is_4k ? 1 : 0), lowerBarTop, trackNumWidth - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
				gr.DrawString(str.title_lower, ft_lower, col.now_playing, trackNumWidth > 0 ? progressBar.x - (is_4k ? 1 : 0) + trackNumWidth - scaleForDisplay(3) : progressBar.x - (is_4k ? 1 : 0) - scaleForDisplay(11), lowerBarTop, 0.34 * ww, titleMeasurements.Height, g_string_format.trim_ellipsis_char);
			} else {
				if (pref.show_flags && flagImgs.length && width + flagImgs[0].Width * flagImgs.length < availableWidth) {
					var flagsLeft = textLeft - (is_4k ? 1 : 0);
					for (let i = 0; i < flagImgs.length; i++) {
						gr.DrawImage(flagImgs[i], flagsLeft, Math.round(artistY + (is_4k ? scaleForDisplay(3) : scaleForDisplay(4) - 1) + height / 2 - flagImgs[i].Height / 2),
							flagImgs[i].Width - scaleForDisplay(8), flagImgs[i].Height - scaleForDisplay(8), 0, 0, flagImgs[i].Width, flagImgs[i].Height)
						flagsLeft += flagImgs[i].Width;
					}
				}
				gr.DrawString(str.artist, artistFont, col.artist, textLeft + (pref.show_flags && flagImgs.length ? flagSize + 2 : 0) - (is_4k ? 2 : 1), lowerBarTop + heightAdjustment, availableWidth, height, StringFormat(0, 0, 4));
				gr.DrawString(str.tracknum, ft_lower, col.now_playing, progressBar.x + (pref.show_flags && flagImgs.length ? flagSize + width + scaleForDisplay(9) : is_4k ? width + scaleForDisplay(8) : width + scaleForDisplay(7)), lowerBarTop, trackNumWidth - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
				gr.DrawString(str.title_lower, ft_lower, col.now_playing, progressBar.x + (pref.show_flags && flagImgs.length ? is_4k ? flagSize + trackNumWidth + width : flagSize + trackNumWidth + width + scaleForDisplay(1) : trackNumWidth + width - scaleForDisplay(1)) + (is_4k ? scaleForDisplay(1) : 0), lowerBarTop, ww < 1600 ? 0.22 * ww : 0.34 * ww, titleMeasurements.Height, g_string_format.trim_ellipsis_char);
			}
		} else {
			gr.DrawString(str.tracknum, ft_lower, col.now_playing, progressBar.x, lowerBarTop + heightAdjustment, 0.95 * ww - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(str.title_lower, ft_lower, col.now_playing, progressBar.x + trackNumWidth, lowerBarTop, 0.34 * ww, titleMeasurements.Height, g_string_format.trim_ellipsis_char);
		}
		let bottomTextWidth = timeAreaWidth + trackNumWidth;
		bottomTextWidth += Math.ceil(titleMeasurements.Width);
		if (str.original_artist && bottomTextWidth < 0.95 * ww) {
			const width = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
			let flagSize = is_4k ? 64 : 32;
			var h_spacing = 0;
			var v_spacing = 0;
			if (useNeue) {
				h_spacing = is_4k ? scaleForDisplay(4) : scaleForDisplay(2);
				v_spacing = scaleForDisplay(0);
			}
			gr.DrawString(str.original_artist, ft_lower, col.now_playing, artistTitleTrackWidth > 0.35 * ww ? progressBar.x + trackNumWidth + titleMeasurements.Width : progressBar.x + (pref.show_flags && flagImgs.length ? flagSize + 2 : 0) - (is_4k ? 2 : 1) + width + trackNumWidth + titleMeasurements.Width + h_spacing, lowerBarTop + v_spacing, artistTitleTrackWidth > 0.35 * ww ? 0.34 * ww - (trackNumWidth + titleMeasurements.Width) : 0.34 * ww - (artistTitleTrackWidth + (pref.show_flags && flagImgs.length ? flagSize + 2 : 0) - (is_4k ? 2 : 1)), titleMeasurements.Height, g_string_format.trim_ellipsis_char);
		}

	} else if (pref.layout_mode === 'playlist_mode') {

		var ft_lower_bold = ft.lower_bar_bold;
		var ft_lower = ft.lower_bar;
		var ft_lower_orig_artist = ft.lower_bar_artist;
		var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
		var titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
		var origArtistWidth = gr.MeasureString(str.original_artist, ft_lower_orig_artist, 0, 0, 0, 0).Width;
		var availableWidth = (ww);
		var artistFont = chooseFontForWidth(gr, availableWidth, str.artist, [ft.artist_lrg, ft.artist_med, ft.artist_sml]);
		height = gr.CalcTextHeight(str.artist, artistFont);
		var artistMeasurements = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0);
		var artistWidth = artistMeasurements.Width;
		/*
			if (timeAreaWidth + trackNumWidth + titleMeasurements.Width + artistWidth > 0.90 * ww) {
				lowerBarTop = wh - geo.lower_bar_h - (is_4k ? scaleForDisplay(10) : scaleForDisplay(12));
				// we don't have room for all the text so use a smaller font and recalc size
				artistFont = ft.artist_med;
				ft_lower_bold = ft.lower_bar_sml_bold;
				ft_lower = ft.lower_bar_sml;
				ft_lower_artist = ft.artist_sml;
				ft_lower_orig_artist = ft.lower_bar_artist_sml;
				titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
				trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft.lower_bar_sml_bold, 0, 0, 0, 0).Width);
				if (str.disc !== '') {
					timeAreaWidth = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft_lower);
				} else {
					timeAreaWidth = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft_lower);
				}
				gr.DrawString(str.artist, artistFont, col.now_playing, progressBar.x, lowerBarTop + (is_4k ? scaleForDisplay(1) : 0), artistWidth, titleMeasurements.Height, StringFormat(0, 0, 4));
				timeAreaWidth += artistMeasurements.Width;
				gr.DrawString(str.tracknum, ft_lower, col.now_playing, progressBar.x + artistWidth + (is_4k ? 12 : 8), lowerBarTop - 1, 0.35 * ww - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
				timeAreaWidth += trackNumWidth;
				gr.DrawString(str.title_lower, ft_lower, col.now_playing, progressBar.x + artistWidth + trackNumWidth + 4, lowerBarTop - 1, 0.70 * ww - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
				timeAreaWidth += Math.ceil(titleMeasurements.Width);
			} else {
				artistFont = ft.artist_lrg;
				artistMeasurements = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0);
			}

		*/
		gr.DrawString(str.artist, artistFont, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop + (is_4k ? scaleForDisplay(1) : 0), artistWidth + trackNumWidth, titleMeasurements.Height, g_string_format.trim_ellipsis_char);
		var heightAdjustment = is_4k ? 1 : 0;
		if (fb.IsPlaying) {
		gr.DrawString(str.tracknum, ft_lower, col.now_playing, progressBar.x - scaleForDisplay(1) + artistWidth + (is_4k ? 19 : 8), lowerBarTop + heightAdjustment, trackNumWidth - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
		} else {
		gr.DrawString(str.tracknum, ft_lower, col.now_playing, progressBar.x - scaleForDisplay(1) + artistWidth, lowerBarTop + heightAdjustment, trackNumWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
		}
		let bottomTextWidth = timeAreaWidth + trackNumWidth;
		gr.DrawString(str.title_lower, ft_lower, col.now_playing, progressBar.x + artistWidth + trackNumWidth + (is_4k ? scaleForDisplay(2) : 0), lowerBarTop + heightAdjustment, ww - (artistWidth + trackNumWidth + (0.32 * ww)), titleMeasurements.Height, g_string_format.trim_ellipsis_char);
		bottomTextWidth += Math.ceil(titleMeasurements.Width);
		if (str.original_artist && bottomTextWidth < 0.90 * ww) {
			var h_spacing = 0;
			var v_spacing = 0;
			if (useNeue) {
				h_spacing = scaleForDisplay(4);
				v_spacing = scaleForDisplay(1);
			}
			//gr.DrawString(str.original_artist, ft_lower_orig_artist, col.now_playing, progressBar.x - scaleForDisplay(1) + trackNumWidth + titleMeasurements.Width + h_spacing, lowerBarTop + v_spacing, 0.70 * ww - bottomTextWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
		}
	}

	// Progress bar/Seekbar
	if (pref.layout_mode === 'default_mode') {
	progressBar.setY(Math.round(lowerBarTop + titleMeasurements.Height) + (is_4k ? scaleForDisplay(12) - 1 : scaleForDisplay(11)));
	} else if (pref.layout_mode === 'playlist_mode') {
	progressBar.setY(Math.round(lowerBarTop + titleMeasurements.Height) + (scaleForDisplay(8)));
	}
		if (ww > 400) {
			gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
			if (fb.PlaybackLength > 0) {
				if (pref.layout_mode === 'default_mode') {
					gr.DrawString(str.length, ft_lower, col.now_playing, ww - scaleForDisplay(240), lowerBarTop, scaleForDisplay(200), titleMeasurements.Height, StringFormat(2, 0));
				} else if (pref.layout_mode === 'playlist_mode') {
					gr.DrawString(str.length, ft_lower, col.now_playing, ww - scaleForDisplay(220), lowerBarTop + heightAdjustment, scaleForDisplay(200), titleMeasurements.Height, StringFormat(2, 0));
				}
				let width = gr.CalcTextWidth('  ' + str.length, ft_lower);
				if (pref.layout_mode === 'default_mode') {
					gr.DrawString(str.time, ft_lower_bold, col.now_playing, ww - scaleForDisplay(280), lowerBarTop + heightAdjustment, scaleForDisplay(240) - width, titleMeasurements.Height, StringFormat(2, 0));
				} else if (pref.layout_mode === 'playlist_mode') {
					gr.DrawString(str.time, ft_lower_bold, col.now_playing, ww - scaleForDisplay(260), lowerBarTop + (is_4k ? scaleForDisplay(1) : 0), scaleForDisplay(240) - width, titleMeasurements.Height, StringFormat(2, 0));
				}
				width += gr.CalcTextWidth('  ' + str.time, ft_lower_bold);
				if (pref.layout_mode === 'default_mode') {
					gr.DrawString(str.disc, ft_lower, col.now_playing, ww - scaleForDisplay(320), lowerBarTop, scaleForDisplay(280) - width, titleMeasurements.Height, StringFormat(2, 0));
				} else if (pref.layout_mode === 'playlist_mode') {
					// Hide
				}
			} else if (fb.IsPlaying) { // streaming, but still want to show time
				gr.DrawString(str.time, ft.lower_bar, col.now_playing, ww - scaleForDisplay(240), lowerBarTop, scaleForDisplay(200), 0.5 * geo.lower_bar_h, StringFormat(2, 0));
			} else {
				//let color = pref.darkMode ? tintColor(col.bg, 20) : shadeColor(col.bg, 20);
				let color = col.now_playing;
				let offset = 0;
				if (updateAvailable && updateHyperlink) {
					offset = updateHyperlink.getWidth();
					updateHyperlink.setContainerWidth(ww);
					updateHyperlink.set_y(lowerBarTop);
					updateHyperlink.set_xOffset(-offset - Math.floor(ww*0.025));
					updateHyperlink.draw(gr, color);
					offset += scaleForDisplay(6);
				}
				if (pref.layout_mode === 'default_mode') {
					gr.DrawString(str.time, ft.lower_bar, color, ww - scaleForDisplay(280) - offset, lowerBarTop, scaleForDisplay(240), geo.lower_bar_h, StringFormat(2, 0));
				} else if (pref.layout_mode === 'playlist_mode') {
					gr.DrawString(str.time, ft.lower_bar, color, ww - scaleForDisplay(260) - offset, lowerBarTop, scaleForDisplay(240), geo.lower_bar_h, StringFormat(2, 0));
				}
			}
		}
		if (pref.show_progress_bar) {
			progressBar.draw(gr);
		}
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		drawLowerBarProfiler && drawLowerBarProfiler.Print();
		if (repaintRects.length) {
			repaintRects.forEach(rect => gr.DrawRect(rect.x, rect.y, rect.w, rect.h, scaleForDisplay(2), rgba(255,0,0,200)));
			repaintRects = [];
		}

		// ---> UIHacks Aero Glass Shadow Frame Fix
		if (pref.whiteTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(245, 245, 245));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(245, 245, 245));
		} else if (pref.blackTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(35, 35, 35));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(35, 35, 35));
		} else if (pref.blueTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(63, 155, 202));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(63, 155, 202));
		} else if (pref.darkblueTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(27, 55, 90));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(27, 55, 90));
		} else if (pref.redTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(125, 0, 0));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(125, 0, 0));
		} else if (pref.creamTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(255, 249, 245));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(255, 249, 245));
		} else if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		gr.DrawLine(0, 0, ww, 0, 1, RGB(30, 30, 30));
		gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(30, 30, 30));
		}
		// End

		//---> Layout Mode Switcher
		if (!has_notified) {
			// When on_paint is called all other panels are loaded and can receive notifications
			window.NotifyOthers('layoutmode_state', pss_switch.layoutmode.state);

			has_notified = true;

			// Dirty, dirty hack to adjust window size
			if (mode_handler.fix_window_size()) {
				// Size has changed, waiting for on_size
				window.Repaint();
				return;
			}
		}
		var has_notified = false;
		// End
}

let repaintRectCount = 0;
window.oldRepaintRect = window.RepaintRect;
window.RepaintRect = (x, y, w, h, force = undefined) => {
	if (timings.drawRepaintRects) {
		repaintRects.push({ x, y, w, h });
		window.Repaint();
	} else {
		repaintRectCount++;
		window.oldRepaintRect(x, y, w, h, force);
	}
}

let rotatedCdIndex = 0;	// global index of current cdartArray img to draw
function setupRotationTimer() {
	clearInterval(cdartRotationTimer);
	if (pref.display_cdart && cdart && fb.IsPlaying && !fb.IsPaused && pref.spinCdart && !displayLibrary && !displayPlaylist) {
		console.log(`creating ${pref.spinCdArtImageCount} rotated cd images, shown every ${pref.spinCdArtRedrawInterval}ms`);
		cdartRotationTimer = setInterval(() => {
			rotatedCdIndex++;
			rotatedCdIndex %= pref.spinCdArtImageCount;
			if (!cdartArray[rotatedCdIndex] && cdart && cdart_size.w) {
				// debugLog(`creating cdImg: ${rotatedCdIndex} (${cdart_size.w}x${cdart_size.h}) with rotation: ${360/pref.spinCdArtImageCount * rotatedCdIndex} degrees`);
				cdartArray[rotatedCdIndex] = rotateImg(cdart, cdart_size.w, cdart_size.h, 360/pref.spinCdArtImageCount * rotatedCdIndex)
			}
			const cdLeftEdge = pref.cdart_ontop ? cdart_size.x : albumart_size.x + albumart_size.w; // the first line of cdImage that will be drawn
			window.RepaintRect(cdLeftEdge, cdart_size.y, cdart_size.w - (cdLeftEdge - cdart_size.x), cdart_size.h, !pref.cdart_ontop && !pref.displayLyrics);
		}, pref.spinCdArtRedrawInterval);
	}
}

function drawCdArt(gr) {
	if (pref.display_cdart && cdart_size.y >= albumart_size.y && cdart_size.h <= albumart_size.h) {
		// if (timings.showExtraDrawTiming) drawCdProfiler = fb.CreateProfiler('cdart');
		const cdImg = cdartArray[rotatedCdIndex] || rotatedCD;
		gr.DrawImage(cdImg, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0, 0, cdImg.Width, cdImg.Height, 0);
		// if (timings.showExtraDrawTiming) drawCdProfiler.Print();
	}
}

function on_paint(gr) {
	const start = new Date();
	draw_ui(gr);
	if (transport.showVolume) {
		volume_btn.on_paint(gr);
	}

	if (timings.showDrawTiming || timings.showExtraDrawTiming) {
		const end = Date.now();
		console.log(`${start.getHours()}:${leftPad(start.getMinutes(), 2, '0')}:${leftPad(start.getSeconds(), 2, '0')}.${leftPad(start.getMilliseconds(),3,'0')}: ` +
			`on_paint took ${end - start.getTime()}ms ${repaintRectCount > 1 ? '- ' + repaintRectCount + ' repaintRect calls' : ''}`);
	}
	repaintRectCount = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onRatingMenu(x, y) {
	menu_down = true;

	var rating = fb.TitleFormat("$if2(%rating%,0)").Eval();

	var menu = new Menu();
	menu.addRadioItems(['No rating', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'], parseInt(rating), [0,1,2,3,4,5],
		(rating) => {
			if (rating === 0) {
				fb.RunContextCommand("Playback Statistics/Rating/<not set>");
			} else {
				fb.RunContextCommand("Playback Statistics/Rating/" + rating);
			}
		});

	const idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);

	menu_down = false;
}

function onOptionsMenu(x, y) {
	menu_down = true;

	const menu = new Menu();	// helper class for creating simple menu items. See helpers.js

	var menuThemeMenu = new Menu('Change Theme');
	menuThemeMenu.addToggleItem('White', pref, 'whiteTheme', () => {
		pref.whiteTheme = 'white';
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Black', pref, 'blackTheme', () => {
		pref.blackTheme = 'black';
		pref.whiteTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Blue', pref, 'blueTheme', () => {
		pref.blueTheme = 'blue';
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Dark Blue', pref, 'darkblueTheme', () => {
		pref.darkblueTheme = 'darkblue';
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Red', pref, 'redTheme', () => {
		pref.redTheme = 'red';
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.creamTheme = false;
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Cream', pref, 'creamTheme', () => {
		pref.creamTheme = 'cream';
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Neon Blue', pref, 'nblueTheme', () => {
		pref.nblueTheme = 'nblue';
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Neon Green', pref, 'ngreenTheme', () => {
		pref.ngreenTheme = 'ngreen';
		pref.nblueTheme = false;
		pref.nredTheme = false;
		pref.ngoldTheme = false;
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Neon Red', pref, 'nredTheme', () => {
		pref.nredTheme = 'nred';
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.ngoldTheme = false;
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		on_init();
	});
	menuThemeMenu.addToggleItem('Neon Gold', pref, 'ngoldTheme', () => {
		pref.ngoldTheme = 'ngold';
		pref.nblueTheme = false;
		pref.ngreenTheme = false;
		pref.nredTheme = false;
		pref.whiteTheme = false;
		pref.blackTheme = false;
		pref.blueTheme = false;
		pref.darkblueTheme = false;
		pref.redTheme = false;
		pref.creamTheme = false;
		on_init();
	});
	menuThemeMenu.appendTo(menu);

	var menuPlayerSizeMenu = new Menu('Change Player Size');
	if (!is_4k) {
		menuPlayerSizeMenu.addToggleItem('Small', pref, 'Player_Small', () => {
			if (!is_4k) {
				pref.Player_Small = 'Player_Small';
				pref.Player_Normal = false;
				pref.Player_Big = false;
				pref.Player_4K_Small = false;
				pref.Player_4K_Normal = false;
				pref.Player_4K_Big = false;
				displayBiography = false;
				if (pref.Player_Small === 'Player_Small') {
					mode_handler.player_size_small();
					createPlaylistFonts();
					setBiographySize();
					playlist.on_size(ww, wh);
					RepaintWindow();
				}
			} else {
				pref.Player_Small = false;
			}
		});
	}
	if (!is_4k) {
		menuPlayerSizeMenu.addToggleItem('Normal', pref, 'Player_Normal', () => {
			if (!is_4k) {
				pref.Player_Normal = 'Player_Normal';
				pref.Player_Small = false;
				pref.Player_Big = false;
				pref.Player_4K_Small = false;
				pref.Player_4K_Normal = false;
				pref.Player_4K_Big = false;
				displayBiography = false;
				if (pref.Player_Normal === 'Player_Normal') {
					mode_handler.player_size_normal();
					createPlaylistFonts();
					setBiographySize();
					playlist.on_size(ww, wh);
					RepaintWindow();
				}
			} else {
				pref.Player_Normal = false;
			}
		});
	}
	if (!is_4k) {
		menuPlayerSizeMenu.addToggleItem('Big', pref, 'Player_Big', () => {
			if (!is_4k) {
				pref.Player_Big = 'Player_Big';
				pref.Player_Small = false;
				pref.Player_Normal = false;
				pref.Player_4K_Small = false;
				pref.Player_4K_Normal = false;
				pref.Player_4K_Big = false;
				displayBiography = false;
				if (pref.Player_Big === 'Player_Big') {
					mode_handler.player_size_big();
					createPlaylistFonts();
					setBiographySize();
					playlist.on_size(ww, wh);
					RepaintWindow();
				}
			} else {
				pref.Player_Big = false;
			}
		});
	}
	if (is_4k) {
		menuPlayerSizeMenu.addToggleItem('Small', pref, 'Player_4K_Small', () => {
			if (is_4k) {
				pref.Player_4K_Small = 'Player_4K_Small';
				pref.Player_4K_Normal = false;
				pref.Player_4K_Big = false;
				pref.Player_Small = false;
				pref.Player_Normal = false;
				pref.Player_Big = false;
				displayBiography = false;
				if (pref.Player_4K_Small === 'Player_4K_Small') {
					mode_handler.player_size_4K_Small();
					createPlaylistFonts();
					setBiographySize();
					playlist.on_size(ww, wh);
					RepaintWindow();
				}
			} else {
				pref.Player_4K_Small = false;
			}
		});
	}
	if (is_4k) {
		menuPlayerSizeMenu.addToggleItem('Normal', pref, 'Player_4K_Normal', () => {
			if (is_4k) {
				pref.Player_4K_Normal = 'Player_4K_Normal';
				pref.Player_4K_Small = false;
				pref.Player_4K_Big = false;
				pref.Player_Small = false;
				pref.Player_Normal = false;
				pref.Player_Big = false;
				displayBiography = false;
				if (pref.Player_4K_Normal === 'Player_4K_Normal') {
					mode_handler.player_size_4K_Normal();
					createPlaylistFonts();
					setBiographySize();
					playlist.on_size(ww, wh);
					RepaintWindow();
				}
			} else {
				pref.Player_4K_Normal = false;
			}
		});
	}
	if (is_4k) {
		menuPlayerSizeMenu.addToggleItem('Big', pref, 'Player_4K_Big', () => {
			if (is_4k) {
				pref.Player_4K_Big = 'Player_4K_Big';
				pref.Player_4K_Normal = false;
				pref.Player_4K_Small = false;
				pref.Player_Small = false;
				pref.Player_Normal = false;
				pref.Player_Big = false;
				displayBiography = false;
				if (pref.Player_4K_Big === 'Player_4K_Big') {
					mode_handler.player_size_4K_Big();
					createPlaylistFonts();
					setBiographySize();
					playlist.on_size(ww, wh);
					RepaintWindow();
				}
			} else {
				pref.Player_4K_Big = false;
			}
		});
	}
	menuPlayerSizeMenu.appendTo(menu);

	menu.createRadioSubMenu('Change Layout Mode', ['Default Mode', 'Playlist Mode'], pref.layout_mode, ['default_mode', 'playlist_mode'], (mode) => {
		pref.layout_mode = mode;
		if (pref.layout_mode === 'default_mode') {
			mode_handler.layout_mode_default_mode();
			createFonts();
			initPlaylistColors();
			RepaintWindow();
		}
		if (pref.layout_mode === 'playlist_mode') {
			displayLibrary = false;
			displayBiography = false;
			displayPlaylist = true;
			mode_handler.layout_mode_playlist_mode();
			playlist.on_size(ww, wh);
			createFonts();
			initPlaylistColors();
			RepaintWindow();
		}
	});

	menu.addSeparator();

	menu.addToggleItem('Check for theme updates', pref, 'checkForUpdates', () => { scheduleUpdateCheck(1000) });
	menu.createRadioSubMenu('Use 4K mode', ['Auto-detect', 'Never', 'Always'], pref.use_4k, ['auto', 'never', 'always'], (mode) => {
		pref.use_4k = mode;
		if (pref.use_4k === 'auto') {
			displayBiography = false;
			mode_handler.player_size_4K_Normal();
			window.Reload();
		}
		if (pref.use_4k === 'never') {
			displayBiography = false;
			mode_handler.player_size_small();
			window.Reload();
		}
		if (pref.use_4k === 'always') {
			displayBiography = false;
			mode_handler.player_size_4K_Normal();
			window.Reload();
		}
	});
	//	menu.addToggleItem('Use dark theme', pref, 'darkMode', () => {
	//		initColors();
	//		if (fb.IsPlaying) {
	//			albumart = null;
	//			loadFromCache = false;
	//			on_playback_new_track(fb.GetNowPlaying());
	//		} else {
	//			RepaintWindow();
	//		}
	//	});
	try {
		const iconsFolder = fso.GetFolder(paths.iconsBase);
		const iconSets = [];

		for (let f of iconsFolder.SubFolders) {
			const path = f.toString();
			iconSets.push(path.replace(paths.iconsBase, ''));
		}
		/*
		menu.createRadioSubMenu('Function icons set', iconSets, settings.iconSet, iconSets, (setName) => {
			settings.iconSet = setName;
			setGeometry();
			createButtonImages();
			createButtonObjects(ww, wh);
			RepaintWindow();
		});
		*/
	} catch (e) {
		console.log('Could not GetFolder at', paths.iconsBase);
	}
	menu.addToggleItem(`Cycle through all artwork (${settings.artworkDisplayTime}s delay)`, pref, 'cycleArt', () => {
		if (!pref.cycleArt) {
			clearTimeout(albumArtTimeout);
			albumArtTimeout = 0;
		} else {
			displayNextImage();
		}
	});

	const cdArtMenu = new Menu('cdArt settings');
	cdArtMenu.addToggleItem(`Display cdArt if found (${settings.cdArtBasename}.png, ${settings.cdArtBasename}2.png, vinylA.png, etc.)`, pref, 'display_cdart', () => {
		if (fb.IsPlaying) fetchNewArtwork(fb.GetNowPlaying());
		lastLeftEdge = 0; // resize labels
		ResizeArtwork(true);
		RepaintWindow();
	});
	cdArtMenu.addToggleItem('Display cdArt above cover', pref, 'cdart_ontop', () => RepaintWindow(), !pref.display_cdart);
	cdArtMenu.addToggleItem('Filter out cd/vinyl .jpgs from artwork', pref, 'filterCdJpgsFromAlbumArt');
	cdArtMenu.addSeparator();
	cdArtMenu.addToggleItem('Spin cdArt while songs play (increases memory and CPU)', pref, 'spinCdart', () => {
		if (pref.spinCdart) {
			setupRotationTimer();
		} else {
			clearInterval(cdartRotationTimer);
			cdartArray = [];
		}
	});
	cdArtMenu.createRadioSubMenu('# Rotation Images (memory usage/rotational speed)', ['36 (10 degrees)', '45 (8 degrees)', '60 (6 degrees) (default)', '72 (5 degrees)', '90 (4 degrees)'], pref.spinCdArtImageCount, [36, 45, 60, 72, 90], (count) => {
		pref.spinCdArtImageCount = count;
		rotatedCdIndex = 0;
		cdartArray = [];
		RepaintWindow();
	}, !pref.spinCdart);
	cdArtMenu.createRadioSubMenu('Spinning cdArt redraw speed', ['250ms (lower CPU)', '200ms', '150ms (default)', '125ms', '100ms', '75ms', '50ms (higher CPU)'], pref.spinCdArtRedrawInterval, [250, 200, 150, 125, 100, 75, 50], interval => {
		pref.spinCdArtRedrawInterval = interval;
		setupRotationTimer();
	}, !pref.spinCdart)
	cdArtMenu.addSeparator();
	cdArtMenu.addToggleItem('Rotate cdArt as tracks change', pref, 'rotate_cdart', () => { RepaintWindow(); }, !pref.display_cdart || pref.spinCdart);
	cdArtMenu.createRadioSubMenu('cdArt Rotation Amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(pref.rotation_amt), [2,3,4,5], (rot) => {
		pref.rotation_amt = rot;
		CreateRotatedCDImage();
		RepaintWindow();
	}, !pref.rotate_cdart || pref.spinCdart);
	cdArtMenu.appendTo(menu);

	menu.addToggleItem('Draw label art on background', pref, 'labelArtOnBg', () => RepaintWindow());
	menu.addToggleItem('Display song title in info grid', pref, 'showTitleInGrid', () => RepaintWindow());

	menu.addSeparator();
	const changeFontSizeMenu = new Menu('Change Font Sizes');
	const mainFontSizeMenu = new Menu('Main');
	mainFontSizeMenu.createRadioSubMenu('Top Menu', ['11px', '12px (default)', '13px', '14px', '16px'], pref.menu_font_size, [11,12,13,14,16], (size) => {
		if (size) {
			pref.menu_font_size = size;
		}
		ft.SegoeUi = gdi.Font('Segoe Ui Semibold', scaleForDisplay(pref.menu_font_size), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		window.Repaint();
	});
	mainFontSizeMenu.createRadioSubMenu('Lower Bar', ['16px', '18px (default)', '20px', '22px', '24px'], pref.artist_font_size && pref.lower_bar_font_size, [16,18,20,22,24], (size) => {
		if (size) {
			pref.artist_font_size = size;
			pref.lower_bar_font_size = size;
		}
		if (size === 14) {
			pref.transport_buttons_size = 28;
		} else if ( size === 16) {
			pref.transport_buttons_size = 30;
		} else {
			pref.transport_buttons_size = 32;
		}
		ft.guifx = gdi.Font(fontGuiFx, scaleForDisplay(Math.floor(pref.transport_buttons_size / 2)), 0);
		ft.artist_lrg = gdi.Font(fontBold, scaleForDisplay(pref.artist_font_size), 0);
		ft.lower_bar = gdi.Font(fontLight, scaleForDisplay(pref.lower_bar_font_size), 0);
		createFonts();
		createButtonImages();
		createButtonObjects(ww, wh);
		window.Repaint();
	});
	mainFontSizeMenu.appendTo(changeFontSizeMenu);

	const detailsFontSizeMenu = new Menu('Details');
	detailsFontSizeMenu.createRadioSubMenu('Title Album', ['11px', '12px', '13px', '14px', '16px', '18px', '20px (default)', '22px', '24px'], pref.tracknum_font_size && pref.album_font_size, [11,12,13,14,16,18,20,22,24], (size) => {
		if (size) {
			pref.tracknum_font_size = size;
			pref.album_font_size = size;
		}
		ft.tracknum_lrg = gdi.Font(fontLight, scaleForDisplay(pref.tracknum_font_size), 0);
		ft.album_lrg = gdi.Font(fontBold, scaleForDisplay(pref.album_font_size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.createRadioSubMenu('Tag Name', ['11px', '12px', '13px', '14px', '16px', '18px (default)', '20px', '22px', '24px'], pref.MetadataGrid_key_font_size, [11,12,13,14,16,18,20,22,24], (size) => {
		if (size) {
			pref.MetadataGrid_key_font_size = size;
		}
		ft.grd_key_lrg = gdi.Font(fontRegular, scaleForDisplay(pref.MetadataGrid_key_font_size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.createRadioSubMenu('Tag Value', ['11px', '12px', '13px', '14px', '16px', '18px (default)', '20px', '22px', '24px'], pref.MetadataGrid_val_font_size, [11,12,13,14,16,18,20,22,24], (size) => {
		if (size) {
			pref.MetadataGrid_val_font_size = size;
		}
		ft.grd_val_lrg = gdi.Font(fontRegular, scaleForDisplay(pref.MetadataGrid_val_font_size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.appendTo(changeFontSizeMenu);

	const playlistFontSizeMenu = new Menu('Playlist');
	playlistFontSizeMenu.createRadioSubMenu('Header', ['-1', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'], pref.font_size_playlist_header,
	[-1, 14, 15, 16, 18, 20, 22, 999],
	(size) => {
		if (size === -1) {
			pref.font_size_playlist_header--;
		} else if (size === 999) {
			pref.font_size_playlist_header++;
		} else {
			pref.font_size_playlist_header = size;
		}
		createPlaylistFonts();
		playlist.on_size(ww, wh);
		window.Repaint();
	});
	playlistFontSizeMenu.createRadioSubMenu('Row', ['-1', '11px', '12px (default)', '13px', '14px', '16px', '18px', '+1'], pref.font_size_playlist,
	[-1, 11, 12, 13, 14, 16, 18, 999],
	(size) => {
		if (size === -1) {
			pref.font_size_playlist--;
		} else if (size === 999) {
			pref.font_size_playlist++;
		} else {
			pref.font_size_playlist = size;
		}
		g_properties.row_h = Math.round(pref.font_size_playlist * 1.667);
		createPlaylistFonts();
		playlist.on_size(ww, wh);
		window.Repaint();
	});
	playlistFontSizeMenu.appendTo(changeFontSizeMenu);

	changeFontSizeMenu.createRadioSubMenu('Library', ['-1', '11px', '12px', '13px', '14px', '16px (default)', '18px', '+1'], libraryProps.baseFontSize,
	[-1, is_4k ? 11 * 1.5 : 11, is_4k ? 12 * 1.5 : 12, is_4k ? 13 * 1.5 : 13, is_4k ? 14 * 1.5 : 14, is_4k ? 16 * 1.5 : 16, is_4k ? 18 * 1.5 : 18, 999],
	(size) => {
		if (size === -1) {
			libraryProps.baseFontSize--;
			p.filterFont--;
			p.filterBtnFont--;
		} else if (size === 999) {
			libraryProps.baseFontSize++;
			p.filterFont++;
			p.filterBtnFont++;
		} else {
			libraryProps.baseFontSize = size;
			p.filterFont = size;
			p.filterBtnFont = size;
		}
		p.resetZoom();
		library_tree.create_images();
		initLibraryPanel();
		setLibrarySize();
		window.Repaint();
	});

	changeFontSizeMenu.createRadioSubMenu('Biography', ['-1', '11px', '12px (default)', '13px', '14px', '16px', '18px', '+1'], ppt.baseFontSize,
	[-1, is_4k ? 11 * 2 : 11, is_4k ? 12 * 2 : 12, is_4k ? 13 * 2 : 13, is_4k ? 14 * 2 : 14, is_4k ? 16 * 2 : 16, is_4k ? 18 * 2 : 18, 999],
	(size) => {
		if (size === -1) {
			ppt.baseFontSize--;
		} else if (size === 999) {
			ppt.baseFontSize++;
		} else {
			ppt.baseFontSize = size;
		}
		butBio.resetZoom();
		butBio.create_images();
		initBiographyPanel();
		setBiographySize();
		window.Repaint();
	});

	changeFontSizeMenu.createRadioSubMenu('Lyrics', ['-1', '16px', '18px', '20px (default)', '22px', '24px', '26px', '+1'], pref.lyricsFontSize,
	[-1, 16, 18, 20, 22, 24, 26, 999],
	(size) => {
		if (size === -1) {
			pref.lyricsFontSize--;
		} else if (size === 999) {
			pref.lyricsFontSize++;
		} else {
			pref.lyricsFontSize = size;
		}
		pref.lyricsFontSize = Math.max(6, pref.lyricsFontSize);
		createFonts();
		pref.displayLyrics && initLyrics();
		// window.Repaint();
	});
	changeFontSizeMenu.appendTo(menu);

	const scrollBarMenu = new Menu('Scrollbar Settings');
	scrollBarMenu.createRadioSubMenu('Library Scrollbar', ['Auto Hide ON', 'Auto Hide OFF'], pref.autoSbar_Library, [true,false], function (nodeIndex) {
		pref.autoSbar_Library = nodeIndex;
		window.Reload();
	});
	scrollBarMenu.addToggleItem('Library Smooth Scroll', libraryProps, 'smoothScroll');
	scrollBarMenu.createRadioSubMenu('Playlist Scrollbar', ['Auto Hide ON', 'Auto Hide OFF'], pref.autoSbar_Playlist, [true,false], function (nodeIndex) {
		pref.autoSbar_Playlist = nodeIndex;
		if (pref.autoSbar_Playlist === true) {
			g_properties.show_scrollbar = false;
			initPlaylist();
			window.Reload();
		} else if (pref.autoSbar_Playlist === false) {
			g_properties.show_scrollbar = true;
			initPlaylist();
			window.Reload();
		}
	});
	scrollBarMenu.addToggleItem('Playlist Smooth Scroll', pref, 'smoothScrolling');
	scrollBarMenu.createRadioSubMenu('Biography Scrollbar', ['Auto Hide ON', 'Auto Hide OFF'], ppt.sbarShow, [1,2], function (nodeIndex) {
		ppt.sbarShow = nodeIndex;
		window.Reload();
	});
	scrollBarMenu.addToggleItem('Biography Smooth Scroll', ppt, 'smooth');
	scrollBarMenu.appendTo(menu);

	var transportMenu = new Menu('Transport controls');
	/*
	transportMenu.addToggleItem('Show transport controls', transport, 'enableTransportControls', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportMenu.addToggleItem('Show transport below art', transport, 'displayBelowArtwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		if (displayPlaylist) {
			playlist.on_size(ww, wh);
		}
		if (displayLibrary) {
			setLibrarySize();
		}
		RepaintWindow();
	}, !transport.enableTransportControls);
	*/
	transportMenu.addToggleItem('Show random button', transport, 'showRandom', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls);
	transportMenu.addToggleItem('Show volume control', transport, 'showVolume', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls);
	//transportMenu.addToggleItem('Show reload button', transport, 'showReload', () => {
	//	createButtonObjects(ww, wh);
	//	RepaintWindow();
	//}, !transport.enableTransportControls);
	transportMenu.appendTo(menu);

	const transportSizeMenu = new Menu('Transport Button Size');
	transportSizeMenu.addRadioItems(['-2', '28px', '32px (default)', '36px', '40px', '44px', '+2'], pref.transport_buttons_size, [-1,28,32,36,40,44,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_size -= 2;
		} else if (size === 999) {
			pref.transport_buttons_size += 2;
		} else {
			pref.transport_buttons_size = size;
		}
		ft.guifx = gdi.Font(fontGuiFx, scaleForDisplay(Math.floor(pref.transport_buttons_size / 2)), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		if (transport.displayBelowArtwork) {
			ResizeArtwork(true);
		}
		RepaintWindow();
	});
	transportSizeMenu.appendTo(transportMenu);

	const transportSpacingMenu = new Menu('Transport Button Spacing');
	transportSpacingMenu.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transport_buttons_spacing, [-1,3,5,7,10,15,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_spacing -= 2;
		} else if (size === 999) {
			pref.transport_buttons_spacing += 2;
		} else {
			pref.transport_buttons_spacing = size;
		}
		createButtonImages();
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	transportSpacingMenu.appendTo(transportMenu);

	menu.addSeparator();

	menu.addToggleItem('Show timeline tooltips', pref, 'show_timeline_tooltips');
	menu.addToggleItem('Show progress bar', pref, 'show_progress_bar', () => {
		setGeometry();
		ResizeArtwork(true);
		RepaintWindow();
	});
	menu.addToggleItem('Update progress bar frequently (higher CPU)', pref, 'freq_update', () => { SetProgressBarRefresh(); }, !pref.show_progress_bar);

	menu.addSeparator();

	menu.addToggleItem('Use vinyl style numbering if available', pref, 'use_vinyl_nums', () => { RepaintWindow(); });

	menu.addSeparator();

	menu.addToggleItem('Show artist country flags', pref, 'show_flags', () => {
		loadCountryFlags();
		RepaintWindow();
	});
	menu.addToggleItem('Show release country flags', settings, 'showReleaseCountryFlag', () => {
		loadReleaseCountryFlag();
		RepaintWindow();
	});

	menu.addSeparator();

	const playlistMenu = new Menu('Playlist Settings');
	var playlistCallback = function () {
		playlist.on_size(ww, wh);
		window.Repaint();
	};
	playlistMenu.addToggleItem('Display playlist on startup', pref, 'startPlaylist');
	playlistMenu.addToggleItem('Show group header', g_properties, 'show_header', playlistCallback);
	const playlistManagerMenu = new Menu('Playlist Manager');
	playlistManagerMenu.createRadioSubMenu('Auto Hide', ['Auto Hide ON', 'Auto Hide OFF'], pref.autoHidePLM, [true,false], function (nodeIndex) {
		pref.autoHidePLM = nodeIndex;
		initPlaylistColors();
		RepaintWindow();
		});
	playlistManagerMenu.addToggleItem('Show Playlist Manager', g_properties, 'show_playlist_info', playlistCallback);
	playlistManagerMenu.appendTo(playlistMenu);
	playlistMenu.addToggleItem('Use compact group header', g_properties, 'use_compact_header', playlistCallback, !g_properties.show_header);
	playlistMenu.addToggleItem('Show full date in header', pref, 'showPlaylistFulldate', () => {
		playlist.on_size(ww, wh);
		window.Repaint();
	});
	var rowsMenu = new Menu('Rows');
	rowsMenu.addToggleItem('Alternate row color', g_properties, 'alternate_row_color', playlistCallback);
	rowsMenu.addToggleItem('Show play count', g_properties, 'show_playcount', playlistCallback, !g_component_playcount);
	rowsMenu.addToggleItem('Show queue position', g_properties, 'show_queue_position', playlistCallback);
	rowsMenu.addToggleItem('Show rating', g_properties, 'show_rating', playlistCallback);
	rowsMenu.appendTo(playlistMenu);

	playlistMenu.addToggleItem('Follow hyperlinks only if CTRL is down', pref, 'hyperlinks_ctrl');
	playlistMenu.addToggleItem('Show weblinks in context menu', pref, 'show_weblinks');
	playlistMenu.appendTo(menu);

	menu.addSeparator();

	const libraryMenu = new Menu('Library Settings');
	libraryMenu.createRadioSubMenu('Change Design', ['Traditional', 'Modern'], pref.lib_design, ['library_traditional', 'library_modern'], (mode) => {
		pref.lib_design = mode;
		if (pref.lib_design === 'library_traditional') {
			libraryProps.fullLine = '';
		} else if (pref.lib_design === 'library_modern') {
			libraryProps.fullLine = true;
		}
		library_tree.create_images();
		initBiographyColors();
		RepaintWindow();
	});
	libraryMenu.addToggleItem('Remember library state', libraryProps, 'rememberTree');
	libraryMenu.addToggleItem('Full line clickable', libraryProps, 'fullLine');
	libraryMenu.addToggleItem('Show tooltips', libraryProps, 'tooltips', () => { setLibrarySize(); });
	libraryMenu.createRadioSubMenu('Root node type', ['Hide', '"All Music"', 'View name'], libraryProps.rootNode, [0,1,2], function (nodeIndex) {
		libraryProps.rootNode = nodeIndex;
		lib_manager.rootNodes(1);
	});
	libraryMenu.createRadioSubMenu('Node item counts', ['Hidden', '# Tracks', '# Sub-Items'], libraryProps.nodeItemCounts, [0,1,2], function (nodeIndex) {
		libraryProps.nodeItemCounts = nodeIndex;
		lib_manager.rootNodes(1);
	});
	libraryMenu.addToggleItem('Show Tracks', libraryProps, 'nodeShowTracks', () => { library_tree.collapseAll(); });
	libraryMenu.addToggleItem('Show library scrollbar', libraryProps, 'showScrollbar', () => { setLibrarySize(); });
	libraryMenu.addToggleItem('Send files to current playlist', libraryProps, 'sendToCurrent');
	libraryMenu.addToggleItem('Auto-fill playlist on selection', libraryProps, 'autoFill');
	libraryMenu.createRadioSubMenu('Double-click action', ['Expand/Collapse Folders', 'Send and Play', 'Send to Playlist'], libraryProps.doubleClickAction, [0,1,2], function(action) {
		libraryProps.doubleClickAction = action;
	});
	libraryMenu.addToggleItem('Auto collapse nodes', libraryProps, 'autoCollapse');
	libraryMenu.addItem('Reset library zoom', false, () => {
		p.resetZoom();
	});
	libraryMenu.appendTo(menu);

	menu.addSeparator();

	const lyricsMenu = new Menu('Lyrics Settings');
	lyricsMenu.addToggleItem('Remember lyrics setting after restart', pref, 'lyricsRememberDisplay');
	lyricsMenu.appendTo(menu);

	menu.addSeparator();

	const debugMenu = new Menu('Debug Settings');
	debugMenu.addToggleItem('Enable debug output', settings, 'showDebugLog');
	debugMenu.addItem('Enable theme debug output', settings.showThemeLog, () => {
		settings.showThemeLog = !settings.showThemeLog;
		if (settings.showThemeLog) {
			albumart = null;
			on_playback_new_track(fb.GetNowPlaying());
		}
	});
	debugMenu.addToggleItem('Show draw timing (doesn\'t persist)', timings, 'showDrawTiming');
	debugMenu.addToggleItem('Show extra draw timing (doesn\'t persist)', timings, 'showExtraDrawTiming');
	debugMenu.addToggleItem('Show debug timing (doesn\'t persist)', timings, 'showDebugTiming');
	debugMenu.addToggleItem('Show RepaintRect areas (doesn\'t persist)', timings, 'drawRepaintRects', (val) => {
		if (!val) { repaintRects = []; window.Repaint(); }
	});
	debugMenu.addToggleItem('Show reload button', pref, 'show_reload_button', () => { window.Reload(); });
	debugMenu.appendTo(menu);

	const configMenu = new Menu('Configuration File');
	configMenu.addItem('Edit configuration file', false, () => { _.runCmd(config.getPath()); });
	configMenu.addItem('Reset configuration file', false, () => { config.resetConfiguration(); });
	configMenu.appendTo(menu);

	menu.addSeparator();

	menu.addToggleItem('Lock right click...', settings, 'locked');
	menu.addItem('Restart foobar', false, () => { fb.RunMainMenuCommand("File/Restart"); });

	var idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);

	menu_down = false;
}


// -----------------------------------------------------------------------
// CALLBACKS
// -----------------------------------------------------------------------

// custom initialisation function, called once after variable declarations
function on_init() {
	console.log("in on_init()");

	str = clearUIVariables();

	ww = window.Width;
	wh = window.Height;

	lastFolder = '';

	last_pb = fb.PlaybackOrder;

	if (pref.loadAsync) {
		on_size();	// needed when loading async, otherwise just needed in fb.IsPlaying conditional
	}
	setGeometry();
	progressBar = new ProgressBar(ww, wh);
	setTheme(blueTheme.colors);
	themeColorSet = true;

	// Main Colors
	initColors();
	// Playlist Colors
	initPlaylistColors();
	initPlaylist();
	// Library Colors
	initLibraryColors();
	// Biography Colors
	initBiographyColors();
	alb_scrollbar.setCol();
	art_scrollbar.setCol();
	butBio.create_images();

	if (displayPlaylist) {
		playlist.on_size(ww, wh);
	}
	if (displayLibrary) {
		initLibraryPanel();
		setLibrarySize();
	}
	if (displayBiography) {
		playlist.on_size(ww, wh);
		initBiographyPanel();
		setBiographySize();
	}

	if (fb.IsPlaying && fb.GetNowPlaying()) {
		on_playback_new_track(fb.GetNowPlaying());
	}
	window.Repaint();	// needed when loading async, otherwise superfluous

	/** Workaround so we can use the Edit menu or run fb.RunMainMenuCommand("Edit/Something...")
		when the panel has focus and a dedicated playlist viewer doesn't. */
	plman.SetActivePlaylistContext(); // once on startup

	if (pref.startPlaylist && !displayPlaylist && !displayLibrary && !displayBiography && !albumart) {
		displayPlaylist = false;
		setTimeout(() => {
			if (btns && btns.playlist) {
				btns.playlist.onClick();	// displays playlist
			}
		}, 30);
	}
	setTimeout(() => {
		// defer initing of library panel until everything else has loaded
		if (!libraryInitialized) {
			initLibraryPanel();
		}
	}, 10000);
	setTimeout(() => {
		// defer initing of biography panel until everything else has loaded
		if (!biographyInitialized) {
			initBiographyPanel();
		}
	}, 10000);

}

// window size changed
function on_size() {
	ww = window.Width;
	wh = window.Height;

	if (pref.layout_mode === 'default_mode' && ww === 1140 && wh === 730  || pref.layout_mode === 'playlist_mode' && ww === 484 && wh === 730)   { pref.Player_Small = true;     } else { pref.Player_Small = false;}
	if (pref.layout_mode === 'default_mode' && ww === 1600 && wh === 960  || pref.layout_mode === 'playlist_mode' && ww === 484 && wh === 960)   { pref.Player_Normal = true;    } else { pref.Player_Normal = false;}
	if (pref.layout_mode === 'default_mode' && ww === 1802 && wh === 1061 || pref.layout_mode === 'playlist_mode' && ww === 1600 && wh === 960)  { pref.Player_Big = true;       } else { pref.Player_Big = false;}
	if (pref.layout_mode === 'default_mode' && ww === 2300 && wh === 1470 || pref.layout_mode === 'playlist_mode' && ww === 964 && wh === 1470)  { pref.Player_4K_Small = true;  } else { pref.Player_4K_Small = false;}
	if (pref.layout_mode === 'default_mode' && ww === 2800 && wh === 1720 || pref.layout_mode === 'playlist_mode' && ww === 964 && wh === 1720)  { pref.Player_4K_Normal = true; } else { pref.Player_4K_Normal = false;}
	if (pref.layout_mode === 'default_mode' && ww === 3400 && wh === 2020 || pref.layout_mode === 'playlist_mode' && ww === 2800 && wh === 1720) { pref.Player_4K_Big = true;    } else { pref.Player_4K_Big = false;}

	console.log(`in on_size() => width: ${ww}, height: ${wh}`);

	if (ww <= 0 || wh <= 0) return;

	checkFor4k(ww, wh);

	if (!sizeInitialized) {
		createFonts();
		setGeometry();
		if (fb.IsPlaying) {
			loadCountryFlags(); // wrong size flag gets loaded on 4k systems
		}
		rescalePlaylist(true);
		initPlaylist();
		volume_btn = new VolumeBtn();
		artCache.clear();
		sizeInitialized = true;
		if (str.timeline) {
			str.timeline.setHeight(geo.timeline_h);
		}
	}
	progressBar && progressBar.on_size(ww, wh);

	lastLeftEdge = 0;

	ResizeArtwork(true);
	createButtonImages();
	createButtonObjects(ww, wh);

	playlist_shadow = null;
	if (displayPlaylist) {
		playlist.on_size(ww, wh);
	} else if (displayLibrary) {
		initLibraryPanel();
		setLibrarySize();
	} else if (displayBiography) {
		initBiographyPanel();
		setBiographySize();
	}

/*
	// ---> UIHacks Double Click on Caption in Fullscreen
	if (!componentUiHacks) return;

	try { // needed when double clicking on caption and UIHacks.FullScreen == true;
		if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState == 0) {
			UIHacks.MainWindowState = 0;
		}
	} catch (e) {};
	// End
*/
}

function setLibrarySize() {
	if (typeof libraryPanel !== 'undefined') {
		var x = Math.round(ww * .5);
		var y = btns[30].y + btns[30].h + (is_4k ? scaleForDisplay(17) : scaleForDisplay(18));
		var lowerSpace = calcLowerSpace();
		var library_w = ww - x;
		var library_h = Math.max(0, wh - lowerSpace + (is_4k ? scaleForDisplay(6) : scaleForDisplay(8)) - y);

		ui.sizedNode = false;
		ui.node_sz = Math.round(16 * sBio.scale);
		p.setFilterFont();	// resets filter font in case the zoom was reset
		initLibraryColors();
		libraryPanel.on_size(x, y, library_w, library_h);
	} else {
		// TODO: take this if/else out once this part is done
		displayLibrary = false;
	}
}

function setBiographySize() {
	if (typeof biographyPanel !== 'undefined') {
		var x = 0;
		var y = btns[30].y + btns[30].h + (is_4k ? scaleForDisplay(5) : scaleForDisplay(6));
		var lowerSpace = calcLowerSpace();
		var biography_w = ww / 2;
		var biography_h = Math.max(0, wh - lowerSpace + (is_4k ? scaleForDisplay(7) : scaleForDisplay(8)) - y);

		initBiographyColors();
		biographyPanel.on_size(x, y, biography_w, biography_h);

	} else {
		displayBiography = false;
	}
}

function on_playback_dynamic_info_track() {
	// how frequently does this get called?
	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : null;
	on_playback_new_track(metadb);

	if (displayPlaylist) {
		playlist.on_playback_dynamic_info_track();
	}
	if (displayBiography) {
		biography.on_playback_dynamic_info_track();
	}
	if (pref.displayLyrics) { // no need to try retrieving them if we aren't going to display them now
		initLyrics();
	}
}

/**
 * Handle new track playing
 * @param {FbMetadbHandle} metadb
 */
function on_playback_new_track(metadb) {
	if (!metadb) return;	// solve weird corner case
	let newTrackProfiler = null;
	debugLog('in on_playback_new_track()');
	if (timings.showDebugTiming) newTrackProfiler = fb.CreateProfiler('on_playback_new_track');
	lastLeftEdge = 0;
	newTrackFetchingArtwork = true;
	themeColorSet = false;
	updateTimezoneOffset();

	isStreaming = metadb ? !metadb.RawPath.match(/^file\:\/\//) : false;
	if (!isStreaming) {
		currentFolder = metadb.Path.substring(0, metadb.Path.lastIndexOf('\\'));
	} else {
		currentFolder = '';
	}

	SetProgressBarRefresh();

	if (albumArtTimeout) {
		clearTimeout(albumArtTimeout);
		albumArtTimeout = 0;
	}

	str.timeline = new Timeline(geo.timeline_h);

	// Fetch new albumart
	if ((pref.cycleArt && albumArtIndex !== 0) || isStreaming || embeddedArt || currentFolder !== lastFolder || albumart == null ||
			$('$if2(%discnumber%,0)') != lastDiscNumber || $('$if2(' + tf.vinyl_side + ',ZZ)') != lastVinylSide) {
		fetchNewArtwork(metadb);
	} else if (pref.cycleArt && aa_list.length > 1) {
		// need to do this here since we're no longer always fetching when aa_list.length > 1
		albumArtTimeout = setTimeout(() => {
			displayNextImage();
		}, settings.artworkDisplayTime * 1000);
	}
	if (cdart) {
		setupRotationTimer();
	}
	loadFromCache = true;
	// CreateRotatedCDImage(); // we need to always setup the rotated image because it rotates on every track

	/* code to retrieve record label logos */
	let labelStrings = [];
	recordLabels = [];	// will free memory from earlier loaded record label images
	recordLabelsInverted = [];
	for (let i = 0; i < tf.labels.length; i++) {
		labelStrings.push(...getMetaValues(tf.labels[i], this.metadb));
	}
	labelStrings = [... new Set(labelStrings)];
	for (let i = 0; i < labelStrings.length; i++) {
		var addLabel = LoadLabelImage(labelStrings[i]);
		if (addLabel != null) {
			recordLabels.push(addLabel);
			try {
				recordLabelsInverted.push(addLabel.InvertColours());
			} catch (e) {
				// probably not using foo_jscript v2.3.6
			}
		}
	}

	function testArtistLogo(artistStr) {
		// see if artist logo exists at various paths
		const testBandLogoPath = (imgDir, name) => {
			if (name) {
				const logoPath = imgDir + name + '.png'
				if (IsFile(logoPath)) {
					console.log('Found band logo: ' + logoPath);
					return logoPath;
				}
			}
			return false;
		};

		return testBandLogoPath(paths.artistlogos, artistStr) || // try 800x310 white
			testBandLogoPath(paths.artistlogosColor, artistStr); // try 800x310 color
	}

	/* code to retrieve band logo */
	let tryArtistList = [
		... getMetaValues('%album artist%').map(artist => replaceFileChars(artist)),
		replaceFileChars($('[%track artist%]')),
		... getMetaValues('%artist%').map(artist => replaceFileChars(artist))
	];
	tryArtistList = [... new Set(tryArtistList)];

	bandLogo = null;
	invertedBandLogo = null;
	let path;
	tryArtistList.some(artistString => {
		return path = testArtistLogo(artistString);
	});
	if (path) {
		bandLogo = artCache.getImage(path);
		if (!bandLogo) {
			const logo = gdi.Image(path);
			if (logo) {
				bandLogo = artCache.encache(logo, path);
				invertedBandLogo = artCache.encache(logo.InvertColours(), `${path}-inv`);
			}
		}
		invertedBandLogo = artCache.getImage(`${path}-inv`);
		if (!invertedBandLogo) {
			invertedBandLogo = artCache.encache(bandLogo.InvertColours(), `${path}-inv`);
		}
	}

	lastFolder = currentFolder; // for art caching purposes
	lastDiscNumber = $('$if2(%discnumber%,0)'); // for art caching purposes
	lastVinylSide = $('$if2(' + tf.vinyl_side + ',ZZ)');
	currentLastPlayed = $(tf.last_played);

	if (fb.GetNowPlaying()) {
		on_metadb_changed(); // refresh panel
	}

	on_playback_time();
	progressBar.progressLength = 0;

	if (displayPlaylist) {
		playlist.on_playback_new_track(metadb);
	} else if (displayLibrary) {
		library.on_playback_new_track(metadb);
	}
	if (displayBiography) {
		biography.on_playback_new_track();
	}

	// Lyrics stuff
	if (pref.displayLyrics) { // no need to try retrieving them if we aren't going to display them now
		initLyrics();
	}
	if (timings.showDebugTiming) newTrackProfiler.Print();
}

// tag content changed
/**
 * @param {FbMetadbHandleList=} handle_list Can be undefined when called manually from on_playback_new_track
 * @param {boolean=} fromhook
 */
function on_metadb_changed(handle_list, fromhook) {
	console.log(`on_metadb_changed(): ${handle_list ? handle_list.Count : '0'} handles, fromhook: ${fromhook}`);
	if (fb.IsPlaying) {
		var nowPlayingUpdated = !handle_list; // if we don't have a handle_list we called this manually from on_playback_new_track
		var metadb = fb.GetNowPlaying();
		if (metadb && handle_list) {
			for (let i = 0; i < handle_list.Count; i++) {
				if (metadb.RawPath === handle_list[i].RawPath) {
					nowPlayingUpdated = true;
					break;
				}
			}
		}

		if (nowPlayingUpdated) {
			// the handle_list contains the currently playing song so update
			var title = $(tf.title);
			var artist = $(tf.artist);
			var original_artist = $(tf.original_artist);
			let tracknum = '';
			if (pref.use_vinyl_nums)
				tracknum = $(tf.vinyl_track);
			else
				tracknum = $(tf.tracknum);

			str.tracknum = tracknum.trim();
			str.title = title + original_artist;
			str.title_lower = '  ' + title;
			str.original_artist = original_artist;
			str.artist = artist;
			str.year = $(tf.year);
			if (str.year === '0000') {
				str.year = '';
			}
			str.album = $("[%album%][ '['" + tf.album_translation + "']']");
			str.album_subtitle = $("[ '['" + tf.album_subtitle + "']']");
			var codec = $("$lower($if2(%codec%,$ext(%path%)))");
			if (codec == "dca (dts coherent acoustics)") {
				codec = "dts";
			}
			if (codec == "cue") {
				codec = $("$ext($info(referenced_file))");
			} else if (codec == "mpc") {
				codec = codec + "-" + $("$info(codec_profile)").replace("quality ", "q");
			} else if (codec == "dts" || codec == "ac3" || codec == "atsc a/52") {
				codec += $("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%") + " kbps";
				codec = codec.replace("atsc a/52", "Dolby Digital");
			} else if ($("$info(encoding)") == "lossy") {
				if ($("$info(codec_profile)") == "CBR") codec = codec + "-" + $("%bitrate%") + " kbps";
				else codec = codec + "-" + $("$info(codec_profile)");
			}
			str.trackInfo = $(codec + settings.extraTrackInfo);
			// TODO: Add LUFS option?
			// str.trackInfo += $('$if(%replaygain_track_gain%, | LUFS $puts(l,$sub(-1800,$replace(%replaygain_track_gain%,.,)))$div($get(l),100).$right($get(l),2) dB,)');
			if (pref.layout_mode === 'default_mode') {
			str.disc = fb.TitleFormat(tf.disc).Eval();
			} else if (pref.layout_mode === 'playlist_mode') {
			str.disc = fb.TitleFormat(tf.disc).Eval();
			}

			const h = Math.floor(fb.PlaybackLength / 3600);
			const m = Math.floor(fb.PlaybackLength % 3600 / 60);
			const s = Math.floor(fb.PlaybackLength % 60);
			str.length = (h > 0 ? h + ":" + (m < 10 ? "0" : '') + m : m) + ":" + (s < 10 ? "0" : '') + s;

			str.grid = [];
			for (let k = 0; k < metadataGrid.length; k++) {
				let val = $(metadataGrid[k].val);
				if (val && metadataGrid[k].label) {
					if (metadataGrid[k].age) {
						val = $('$date(' + val + ')'); // never show time
						var age = calcAgeDateString(val);
						if (age) {
							val += ' (' + age + ')';
						}
					}
					str.grid.push({
						age: metadataGrid[k].age,
						label: metadataGrid[k].label,
						val: val,
					});
				}
			}

			var lastfm_count = $('%lastfm_play_count%');
			if (lastfm_count !== '0' && lastfm_count !== '?') {
				playCountVerifiedByLastFm = true;
			} else {
				playCountVerifiedByLastFm = false;
			}

			const lastPlayed = $(tf.last_played);
			if (str.timeline) {	// TODO: figure out why this is null for foo_input_spotify
				str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
				// no need to call calcDateRatios if str.timeline is undefined
				calcDateRatios($date(currentLastPlayed) !== $date(lastPlayed), currentLastPlayed); // last_played has probably changed and we want to update the date bar
			}
			if (lastPlayed.length) {
				const today = dateToYMD(new Date());
				if (!currentLastPlayed.length || $date(lastPlayed) !== today) {
					currentLastPlayed = lastPlayed;
				}
			}

			const lp = str.grid.find(value => value.label === 'Last Played');
			if (lp) {
				lp.val = $date(currentLastPlayed);
				if (calcAgeDateString(lp.val)) {
					lp.val += ' (' + calcAgeDateString(lp.val) + ')';
				}
			}

			if (pref.show_flags) {
				loadCountryFlags();
			}
			if (settings.showReleaseCountryFlag) {
				loadReleaseCountryFlag();
			}
		}
	}
	if (handle_list) {	// not called manually from on_playback_new_track
		if (displayPlaylist) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_metadb_changed(handle_list, fromhook);
		} else if (displayLibrary) {
			library.on_metadb_changed(handle_list, fromhook);
		} else if (displayBiography) {
			trace_call && console.log(qwr_utils.function_name());
			biography.on_metadb_changed(handle_list, fromhook);
		}
	}
	RepaintWindow();
}


// User activity

function on_playback_order_changed(this_pb) {
	// Repaint playback order
	if (this_pb != last_pb) {
		debugLog("Repainting on_playback_order_changed");
		window.RepaintRect(0.5 * ww, wh - geo.lower_bar_h, 0.5 * ww, geo.lower_bar_h);
	}
	last_pb = this_pb;
}

function on_playback_seek() {
	progressBar.progressMoved = true;
	if (pref.displayLyrics) {
		gLyrics.seek();
	}
	on_playback_time();
	refresh_seekbar();
}

function on_mouse_lbtn_down(x, y, m) {
	window.SetCursor(32512); // arrow
	if (progressBar.mouseInThis(x, y)) {
		progressBar.on_mouse_lbtn_down(x, y);
	} else if (!volume_btn.on_mouse_lbtn_down(x, y, m)) {
		// not handled by volume_btn

	if (pref.layout_mode === 'default_mode') {
		// clicking on progress bar
		if (pref.show_progress_bar && y >= wh - 0.5 * geo.lower_bar_h && y <= wh - 0.5 * geo.lower_bar_h + geo.prog_bar_h && x >= 0.025 * ww && x < 0.975 * ww) {
			var v = (x - 0.025 * ww) / (0.95 * ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime != v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
			window.RepaintRect(0, wh - geo.lower_bar_h, ww, geo.lower_bar_h);
		}

	} else if (pref.layout_mode === 'playlist_mode') {
		// clicking on progress bar
		if (pref.show_progress_bar && y >= wh - 0.5 * geo.lower_bar_h && y <= wh - 0.5 * geo.lower_bar_h + geo.prog_bar_h - 20 && x >= 0.025 * ww && x < 0.975 * ww) {
			var v = (x - 0.025 * ww) / (0.95 * ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime != v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
			window.RepaintRect(0, wh - geo.lower_bar_h, ww, geo.lower_bar_h);
		}
	}

		buttonEventHandler(x, y, m);
		if (updateHyperlink && !fb.IsPlaying && updateHyperlink.trace(x, y)) {
			updateHyperlink.click();
		}

		if (displayPlaylist && playlist.mouse_in_this(x, y)) {// && playlist.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_mouse_lbtn_down(x, y, m);
		} else if (displayLibrary && library.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_lbtn_down(x, y, m);
		} else if (displayBiography && biography.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			biography.on_mouse_lbtn_down(x, y, m);
		}
	}
}

function on_mouse_lbtn_up(x, y, m) {
	progressBar.on_mouse_lbtn_up(x, y);

	if (!volume_btn.on_mouse_lbtn_up(x, y, m)) {
		// not handled by volume_btn
		if (displayPlaylist) { // && playlist.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_mouse_lbtn_up(x, y, m);

			qwr_utils.EnableSizing(m);
		} else if (displayLibrary) { // && library.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_lbtn_up(x, y, m);
		} if (displayBiography) { // && biography.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			biography.on_mouse_lbtn_up(x, y, m);
		}

		if (just_dblclicked) {
			// You just did a double-click, so do nothing
			just_dblclicked = false;
		} else if (pref.layout_mode === 'default_mode') {
			if ((!displayBiography && albumart && albumart_size.x <= x && albumart_size.y <= y && albumart_size.x + albumart_size.w >= x && albumart_size.y + albumart_size.h >= y) ||
				(cdart && !albumart && cdart_size.x <= x && cdart_size.y <= y && cdart_size.x + cdart_size.w >= x && cdart_size.y + cdart_size.h >= y) ||
				pauseBtn.mouseInThis(x, y)) {
				fb.PlayOrPause();
			}
		}
		on_mouse_move(x, y);
		buttonEventHandler(x, y, m);
	}
}

function on_mouse_lbtn_dblclk(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	} else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_lbtn_dblclk(x, y, m);
	} else if (displayBiography && biography.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_mouse_lbtn_dblclk(x, y, m);
	} else {
		// re-initialize the panel
		just_dblclicked = true;
		if (!buttonEventHandler(x, y, m) && fb.IsPlaying) {
			albumart = null;
			artCache.clear();
			cdartArray = [];
			cdart = null;
			on_playback_new_track(fb.GetNowPlaying());
		}
	}
}

function on_mouse_rbtn_down(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_rbtn_down(x, y, m);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		// library.on_mouse_rbtn_down(x, y, m);
	}
}

function on_mouse_rbtn_up(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return playlist.on_mouse_rbtn_up(x, y, m);
	} else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return library.on_mouse_rbtn_up(x, y, m);
	} else if (displayBiography && biography.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return biography.on_mouse_rbtn_up(x, y, m);		
	} else
		return settings.locked;
}

function on_mouse_move(x, y, m) {
	if (x != state.mouse_x || y != state.mouse_y) {
		window.SetCursor(32512); // arrow
		progressBar.on_mouse_move(x, y);
		state.mouse_x = x;
		state.mouse_y = y;

		if (settings.hideCursor && fb.IsPlaying) {
			clearTimeout(hideCursorTimeout);
			hideCursorTimeout = setTimeout(() => {
				// if there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
				if (!menu_down && fb.IsPlaying) {
					window.SetCursor(-1); // hide cursor
				}
			}, 10000);
		}

		buttonEventHandler(x, y, m);
		if (updateHyperlink) Hyperlinks_on_mouse_move(updateHyperlink, x, y);

		if (displayPlaylist && playlist.mouse_in_this(x, y)) {
			trace_call && trace_on_move && console.log(qwr_utils.function_name());

			if (mouse_move_suppress.is_supressed(x, y, m)) {
				return;
			}

			qwr_utils.DisableSizing(m);
			playlist.on_mouse_move(x, y, m);
		} else if (displayLibrary && library.mouse_in_this(x, y)) {
			library.on_mouse_move(x, y, m);
		} else if (displayBiography && biography.mouse_in_this(x, y)) {
			biography.on_mouse_move(x, y, m);			
		} else if (str.timeline && str.timeline.mouseInThis(x, y)) {
			str.timeline.on_mouse_move(x, y, m);
		}
		if (transport.enableTransportControls && transport.showVolume && volume_btn) {
			volume_btn.on_mouse_move(x, y, m);
		}

		// ---> UIHacks
		if (!mouseInPanel) mouseInPanel = true;
		buttonEventHandler(x, y, m);
		if (!componentUiHacks) return;

		try {

			if (mouseInControl || downButton) {

				UIHacks.SetPseudoCaption(0, 0, 0, 0);
				if (UIHacks.FrameStyle == 3) UIHacks.DisableSizing = true;
				pseudoCaption = false;

			} else if (!pseudoCaption || pseudoCaptionWidth != ww) {

				if (pref.layout_mode === 'default_mode' && !is_4k) {
				UIHacks.SetPseudoCaption(5, 5, ww, 40);
				} else if (pref.layout_mode === 'default_mode' && is_4k) {
				UIHacks.SetPseudoCaption(5, 5, ww, 80);
				}

				if (pref.layout_mode === 'playlist_mode' && !is_4k) {
				UIHacks.SetPseudoCaption(5, 5, ww, 50);
				} else if (pref.layout_mode === 'playlist_mode' && is_4k) {
				UIHacks.SetPseudoCaption(5, 5, ww, 100);
				}

				if (UIHacks.FrameStyle == 3) UIHacks.DisableSizing = false;
				pseudoCaption = true;
				pseudoCaptionWidth = ww;

			}

		} catch (e) {};
		// END
	}
}

function on_mouse_wheel(delta) {
	if (transport.showVolume) {
		if (volume_btn.on_mouse_wheel(delta)) return;
	}
	if (state.mouse_y > wh - geo.lower_bar_h) {
		fb.PlaybackTime = fb.PlaybackTime - delta * pref.mouse_wheel_seek_speed;
		refresh_seekbar();
		return;
	}
	if (pref.displayLyrics && state.mouse_x > albumart_size.x && state.mouse_x <= albumart_size.x + albumart_size.w &&
		state.mouse_y > albumart_size.y && state.mouse_y <= albumart_size.y + albumart_size.h) {
		gLyrics.on_mouse_wheel(delta);
	} else if (displayBiography && state.mouse_x > uiBio.x && state.mouse_x <= uiBio.x + uiBio.w &&
		state.mouse_y > uiBio.y && state.mouse_y <= uiBio.y + uiBio.h) {
		biography.on_mouse_wheel(delta);
	} else if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_wheel(delta);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_wheel(delta);
	}
}
// =================================================== //

function on_mouse_leave() {

	if (transport.showVolume) {
		volume_btn.on_mouse_leave();
	}
	if (displayPlaylist) {
		playlist.on_mouse_leave();
	} else if (displayLibrary) {
		library.on_mouse_leave();
	} else if (displayBiography) {
		biography.on_mouse_leave();
	}
}

function on_playlists_changed() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlists_changed();
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlists_changed();
	}
}

function on_playlist_switch() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_switch();
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlist_switch();
	}
}

function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}

function on_playlist_items_added(playlistIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_added(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlist_items_added(playlistIndex);
	}
}

function on_playlist_items_reordered(playlistIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_reordered(playlistIndex);
	}
}

function on_playlist_items_removed(playlistIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_removed(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlist_items_removed(playlistIndex);
	}
}

function on_playlist_items_selection_change() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_selection_change();
	}
}

function on_library_items_added(handle_list) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_library_items_added(handle_list);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_library_items_added(handle_list);
	}
}

function on_library_items_removed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_library_items_removed(handle_list);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_library_items_removed(handle_list);
	}
}

function on_library_items_changed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_library_items_changed(handle_list);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_library_items_changed(handle_list);
	}
}

function on_item_focus_change(playlist_arg, from, to) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_item_focus_change(playlist_arg, from, to);
	} else if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_item_focus_change();
	} else if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_item_focus_change();
	}
}

function on_key_down(vkey) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());

		if (key_down_suppress.is_supressed(vkey)) {
			return;
		}

		playlist.on_key_down(vkey);
	} else if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_key_down(vkey);
	} else if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_key_down(vkey);
	}

	switch (vkey) {
		case 0x6B: // VK_ADD ??
		case 0x6D: // VK_SUBTRACT ??
			if (CtrlKeyPressed && ShiftKeyPressed) {
				var action = vkey === 0x6B ? '+' : '-';
				if (fb.IsPlaying) {
					var metadb = fb.GetNowPlaying();
					fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + action, metadb);
				} else if (!metadb && displayPlaylist) {
					var metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
					if (metadbList.Count === 1) {
						fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + action, metadbList[0]);
					} else {
						console.log('Won\'t change rating with more than one selected item');
					}
				}
			}
			break;
	}
}
// =================================================== //


function on_char(code) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_char(code);
	}
}

function on_key_up(vkey) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_key_up(vkey);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_key_up(vkey);
	}
}

function on_playback_queue_changed(origin) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playback_queue_changed(origin);
}


function on_playback_pause(pausing) {
	refreshPlayButton();
	if (pausing || fb.PlaybackLength < 0) {
		clearInterval(progressBarTimer);
		clearInterval(cdartRotationTimer);
		window.RepaintRect(0, geo.top_art_spacing, Math.max(albumart_size.x, scaleForDisplay(40)), playlist.h);
	} else { // unpausing
		clearInterval(progressBarTimer); // clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		debugLog("on_playback_pause: creating refresh_seekbar() interval with delay = " + t_interval);
		progressBarTimer = setInterval(() => {
			refresh_seekbar();
		}, t_interval);
		cdart && pref.spinCdart && setupRotationTimer();
	}

	pauseBtn.repaint();
	if (albumart && pref.displayLyrics) { // if we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		gLyrics.on_playback_pause(pausing);
	}

	if (displayPlaylist) {
		playlist.on_playback_pause(pausing);
	}
}

function on_playback_stop(reason) {
	if (reason !== 2) { // 2 = starting_another
		// clear all variables and repaint
		str = clearUIVariables()
		debugLog(`Repainting on_playback_stop:`, reason);
		RepaintWindow();
		lastFolder = '';
		lastDiscNumber = '0';
		recordLabels = [];
		recordLabelsInverted = [];
		refreshPlayButton();
		loadFromCache = false;
	}
	clearInterval(cdartRotationTimer);
	clearInterval(progressBarTimer);
	clearTimeout(albumArtTimeout);
	if (albumart && ((pref.cycleArt && albumArtIndex !== 0) || lastFolder == '')) {
		debugLog("disposing artwork");
		albumart = null;
		albumart_scaled = null;
		displayBiography = false;
	}
	bandLogo = null;
	invertedBandLogo = null;
	if (pref.displayLyrics && gLyrics) {
		gLyrics.on_playback_stop(reason);
	}

	flagImgs = [];
	rotatedCD = null;
	albumArtTimeout = 0;

	if (reason === 0 || reason === 1) {	// Stop or end of playlist
		cdart = disposeCDImg(cdart);
		cdartArray = [];	// clear Images
		window.Repaint();
	}
	if (displayPlaylist) {
		playlist.on_playback_stop(reason);
	}
	if (displayBiography) {
		biography.on_playback_stop(reason);
	}
	initColors();
}

function on_playback_starting(cmd, is_paused) {
	if (settings.hideCursor) {
		window.SetCursor(-1); // hide cursor
	}
	refreshPlayButton();
}

function on_drag_enter(action, x, y, mask) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_enter(action, x, y, mask);
	}
}

function on_drag_leave() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_leave();
	}
}

function on_drag_drop(action, x, y, mask) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_drop(action, x, y, mask);
	}
}

function on_focus(is_focused) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_focus(is_focused);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_focus(is_focused);
	}	
	if (is_focused) {
		plman.SetActivePlaylistContext(); // When the panel gets focus but not on every click.
	} else {
		clearTimeout(hideCursorTimeout); // not sure this is required, but I think the mouse was occasionally disappearing
	}
}

function on_notify_data(name, info) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_notify_data(name, info);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_notify_data(name, info);
	}
}

function on_volume_change(val) {
	trace_call && console.log(qwr_utils.function_name());
	volume_btn.on_volume_change(val);
}

var debounced_init_playlist = _.debounce(function (playlistIndex) {
	trace_call && console.log('debounced_init_playlist');
	playlist.on_playlist_items_added(playlistIndex);
	biography.on_playlist_items_added(playlistIndex);
}, 0, {
	leading: false,
	trailing: true
});

// =================================================== //

function clearUIVariables() {
	return {
		artist: '',
		tracknum: $(settings.stoppedString1, undefined, true),
		title_lower: '  ' + $(settings.stoppedString2, undefined, true),
		year: '',
		grid: [],
		time: stoppedTime
	}
}

// album art retrieved from GetAlbumArtAsync
function on_get_album_art_done(metadb, art_id, image, image_path) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		// library.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_get_album_art_done(metadb, art_id, image, image_path);
	}
}

function on_script_unload() {
	console.log('Unloading Script');
	// it appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
	if (pBio.server) {window.NotifyOthers("script_unload_bio", 0); timerBio.clear(timerBio.img);} butBio.on_script_unload();
}

// Timed events

function on_playback_time() {
	// Refresh playback time
	str.time = $('%playback_time%');
}

function refresh_seekbar() {
	if (pref.layout_mode === 'default_mode') {
		window.RepaintRect(scaleForDisplay(40), wh - geo.lower_bar_h - 24, ww - scaleForDisplay(80), geo.lower_bar_h, pref.spinCdart && !pref.displayLyrics);
	}
	if (pref.layout_mode === 'playlist_mode') {
		window.RepaintRect(scaleForDisplay(20), wh - geo.lower_bar_h - 24, ww - scaleForDisplay(40), geo.lower_bar_h, pref.spinCdart && !pref.displayLyrics);
	}
}

// TIMER Callback functions
function displayNextImage() {
	debugLog("Repainting in displayNextImage: " + albumArtIndex);
	albumArtIndex = (albumArtIndex + 1) % aa_list.length;
	loadImageFromAlbumArtList(albumArtIndex, true);
	lastLeftEdge = 0;
	RepaintWindow();
	albumArtTimeout = setTimeout(() => {
		displayNextImage();
	}, settings.artworkDisplayTime * 1000);
}

function createShadowRect(width, height) {
	var shadow = gdi.CreateImage(width + 2 * geo.aa_shadow, height + 2 * geo.aa_shadow);
	var shimg = shadow.GetGraphics();
	shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, width, height, 0.5 * geo.aa_shadow, 0.5 * geo.aa_shadow, col.shadow);
	shadow.ReleaseGraphics(shimg);
	shadow.StackBlur(geo.aa_shadow);

	return shadow;
}

// HELPER FUNCTIONS
function createDropShadow() {
	let shadowProfiler = null;
	if (timings.showDebugTiming) shadowProfiler = fb.CreateProfiler("createDropShadow");
	if ((albumart && albumart_size.w > 0) || (cdart && pref.display_cdart && cdart_size.w > 0)) {
		if (cdart && !displayPlaylist && !displayLibrary && pref.display_cdart)
			shadow_image = gdi.CreateImage(cdart_size.x + cdart_size.w + 2 * geo.aa_shadow, cdart_size.h + 4 + 2 * geo.aa_shadow);
		else
			shadow_image = gdi.CreateImage(albumart_size.x + albumart_size.w + 2 * geo.aa_shadow, albumart_size.h + 2 * geo.aa_shadow);
		if (shadow_image) {
			const shimg = shadow_image.GetGraphics();
			if (albumart && !displayBiography) {
				shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, albumart_size.x + albumart_size.w, albumart_size.h,
					0.5 * geo.aa_shadow, 0.5 * geo.aa_shadow, col.shadow);
			}

			if (cdart && pref.display_cdart && !displayPlaylist && !displayLibrary) {
				var offset = cdart_size.w * 0.40; // don't change this value
				var xVal = cdart_size.x;
				var shadowOffset = geo.aa_shadow * 2;
				shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + 1, cdart_size.w - shadowOffset, cdart_size.w - shadowOffset, geo.aa_shadow, col.shadow); // outer shadow
				shimg.DrawEllipse(xVal + geo.aa_shadow + offset - 2, offset + geo.aa_shadow + 1, cdart_size.w - offset * 2, cdart_size.h - offset * 2, 60, col.shadow); // inner shadow
			}
			shadow_image.ReleaseGraphics(shimg);
			shadow_image.StackBlur(geo.aa_shadow);
		}
	}

	if (timings.showDebugTiming) shadowProfiler.Print();
}

function SetProgressBarRefresh() {
	debugLog("SetProgressBarRefresh()");
	if (fb.PlaybackLength > 0) {
		if (pref.freq_update) {
			t_interval = Math.abs(Math.ceil(1000 / ((0.95 * ww) / fb.PlaybackLength))); // we want to update the progress bar for every pixel so divide total time by number of pixels in progress bar
			while (t_interval > 500) // we want even multiples of the base t_interval, so that the progress bar always updates as smoothly as possible
				t_interval = Math.floor(t_interval / 2);
			while (t_interval < 32)	// roughly 30fps
				t_interval *= 2;
		} else {
			t_interval = 333; // for slow computers, only update 3x a second
		}
	} else {
		t_interval = 1000;
	}

	if (timings.showDebugTiming)
		console.log(`Progress bar will update every ${t_interval}ms or ${1000 / t_interval} times per second.`);

	progressBarTimer && clearInterval(progressBarTimer);
	progressBarTimer = null;
	if (!fb.IsPaused) { // only create progressTimer if actually playing
		progressBarTimer = setInterval(() => {
			refresh_seekbar();
		}, t_interval);
	}
}

function parseJson(json, label, log) {
	var parsed = [];
	try {
		if (log) {
			console.log(label + json);
		}
		parsed = JSON.parse(json);
	} catch (e) {
		console.log('<<< ERROR IN parseJson >>>');
		console.log(json);
	}
	return parsed;
}

var lfmPlayedTimesJsonLast = '';
var playedTimesJsonLast = '';

function calcDateRatios(dontUpdateLastPlayed, currentLastPlayed) {
	var newDate = new Date();
	dontUpdateLastPlayed = dontUpdateLastPlayed || false;

	playedTimesRatios = [];
	var added = toTime($('$if2(%added_enhanced%,%added%)'));
	var first_played = toTime($('$if2(%first_played_enhanced%,%first_played%)'));
	let last_played = toTime($('$if2(%last_played_enhanced%,%last_played%)'));
	const today = dateToYMD(newDate);
	if (dontUpdateLastPlayed && $date(last_played) === today) {
		last_played = toTime(currentLastPlayed);
	}

	var lfmPlayedTimes = [];
	var playedTimes = [];
	if (componentEnhancedPlaycount) {
		const playedTimesJson = $('[%played_times_js%]', fb.GetNowPlaying());
		const lastfmJson = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
		var log = true;
		if (playedTimesJson == playedTimesJsonLast && lastfmJson == lfmPlayedTimesJsonLast) {
			log = false;    // cut down on spam
		}
		lfmPlayedTimesJsonLast = lastfmJson;
		playedTimesJsonLast = playedTimesJson;
		lfmPlayedTimes = parseJson(lastfmJson, 'lastfm: ', log);
		playedTimes = parseJson(playedTimesJson, 'foobar: ', log);
	} else {
		playedTimes.push(first_played);
		playedTimes.push(last_played);
	}

	if (first_played) {
		if (!added) {
			added = first_played;
		}
		const age = calcAge(added);

		tl_firstPlayedRatio = calcAgeRatio(first_played, age);
		tl_lastPlayedRatio = calcAgeRatio(last_played, age);
		if (tl_lastPlayedRatio < tl_firstPlayedRatio) {
			// due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
			tl_lastPlayedRatio = tl_firstPlayedRatio;
		}

		if (playedTimes.length) {
			for (let i = 0; i < playedTimes.length; i++) {
				var ratio = calcAgeRatio(playedTimes[i], age);
				playedTimesRatios.push(ratio);
			}
		} else {
			playedTimesRatios = [tl_firstPlayedRatio, tl_lastPlayedRatio];
			playedTimes = [first_played, last_played];
		}

		var j = 0;
		var tempPlayedTimesRatios = playedTimesRatios.slice();
		tempPlayedTimesRatios.push(1.0001); // pick up every last.fm time after last_played fb knows about
		for (let i = 0; i < tempPlayedTimesRatios.length; i++) {
			while (j < lfmPlayedTimes.length &&
				(ratio = calcAgeRatio(lfmPlayedTimes[j], age)) < tempPlayedTimesRatios[i]) {
				playedTimesRatios.push(ratio);
				playedTimes.push(lfmPlayedTimes[j]);
				j++;
			}
			if (ratio === tempPlayedTimesRatios[i]) { // skip one instance
				// console.log('skipped -->', ratio);
				j++;
			}
		}
		playedTimesRatios.sort();
		playedTimes.sort();

		tl_firstPlayedRatio = playedTimesRatios[0];
		tl_lastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
	} else {
		tl_firstPlayedRatio = 0.33;
		tl_lastPlayedRatio = 0.66;
	}
	str.timeline.setPlayTimes(tl_firstPlayedRatio, tl_lastPlayedRatio, playedTimesRatios, playedTimes);
}

/**
 * Loads an image from the aa_list array.
 * @param {number} index Index of aa_list signifying which image to load
 * @param {boolean} loadFromCache Retrieve image from cache instead of reading from disc.
 */
function loadImageFromAlbumArtList(index, loadFromCache) {
	let tempAlbumArt;
	if (loadFromCache) {
		tempAlbumArt = artCache.getImage(aa_list[index]);
	}
	if (tempAlbumArt) {
		albumart = tempAlbumArt;
		if (index === 0 && newTrackFetchingArtwork) {
			newTrackFetchingArtwork = false;
			getThemeColors(albumart);
		}
	} else {
		gdi.LoadImageAsyncV2(window.ID, aa_list[index]).then(coverImage => {
			albumart = artCache.encache(coverImage, aa_list[index]);
			if (newTrackFetchingArtwork) {
				getThemeColors(albumart);
				newTrackFetchingArtwork = false;
			}
			ResizeArtwork(true);
			cdart && CreateRotatedCDImage();
			lastLeftEdge = 0; // recalc label location
			RepaintWindow();
		});
	}
	ResizeArtwork(false); // recalculate image positions
	if (cdart) {
		CreateRotatedCDImage();
	}
}

function disposeCDImg(cdImage) {
	cdart_size = new ImageSize(0, 0, 0, 0);
	cdImage = null;
	return null;
}

/**
 * Creates a rotated image
 * @param {GdiBitmap} img The source image
 * @param {number} w Width of image
 * @param {number} h Height of image
 * @param {number} degrees
 */
function rotateImg(img, w, h, degrees) {
	/** @type {GdiBitmap} */ let rotatedImg;
	if (degrees === 0) {
		rotatedImg = img.Clone(0, 0, img.Width, img.Height).Resize(w, h);
	} else {
		rotatedImg = gdi.CreateImage(w, h);
		const gotGraphics = rotatedImg.GetGraphics();
		gotGraphics.DrawImage(img, 0, 0, w, h, 0, 0, img.Width, img.Height, degrees);
		rotatedImg.ReleaseGraphics(gotGraphics);
	}
	return rotatedImg;
}

// TODO: Once spinning art is done, scrap this and the rotation amount crap and just use indexes into the cdartArray when needed
// IDEA: Smooth rotation to new position?
function CreateRotatedCDImage() {
	if (pref.display_cdart) { // drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated in on_paint
		if (cdart && cdart_size.w > 0) { // cdart must be square so just use cdart_size.w (width)
			let trackNum = parseInt(fb.TitleFormat('$num($if(' + tf.vinyl_tracknum + ',$sub($mul(' + tf.vinyl_tracknum + ',2),1),$if2(%tracknumber%,1)),1)').Eval()) - 1;
			if (!pref.rotate_cdart || trackNum != trackNum) trackNum = 0; // avoid NaN issues when changing tracks rapidly
			rotatedCD = rotateImg(cdart, cdart_size.w, cdart_size.h, trackNum * pref.rotation_amt);
		}
	}
}

function calcLowerSpace() {
	return transport.displayBelowArtwork ? geo.lower_bar_h + scaleForDisplay(pref.transport_buttons_size + 10) : geo.lower_bar_h + scaleForDisplay(16);
}

function ResizeArtwork(resetCDPosition) {
	debugLog('Resizing artwork');
	var hasArtwork = false;
	var lowerSpace = calcLowerSpace();
	if (albumart && albumart.Width && albumart.Height) {
		// Size for big albumart
		let xCenter = 0;
		var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.50 * ww : 0.75 * ww) / albumart.Width,
									(wh - lowerSpace - scaleForDisplay(32)) / albumart.Height);
		if (displayPlaylist || displayLibrary) {
			xCenter = 0.25 * ww;
		} else if (ww / wh < 1.40) { // when using a roughly 4:3 display the album art crowds, so move it slightly off center
			xCenter = 0.56 * ww; // TODO: check if this is still needed?
		} else {
			xCenter = 0.5 * ww;
			art_off_center = false;
			if (album_scale == 0.75 * ww / albumart.Width) {
				xCenter += 0.1 * ww;
				art_off_center = true; // TODO: We should probably suppress labels in this case
			}
		}

			// ---> UIHacks FullScreen Artwork & Biography Panel Padding Reposition
			if (UIHacks.FullScreen === true && displayPlaylist || UIHacks.FullScreen === true && displayLibrary) {
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.545 * ww : 0.75 * ww) / albumart.Width,
									(wh - lowerSpace - scaleForDisplay(32)) / albumart.Height);
				xCenter = is_4k ? 0.261 * ww : 0.23 * ww;

			} else if (UIHacks.FullScreen === true && displayBiography === true && is_4k) {
			// Set Biography Window Size and Padding
			ppt.borT = scaleForDisplay(30);
			ppt.borB = scaleForDisplay(30);
			ppt.borL = scaleForDisplay(40);
			ppt.borR = scaleForDisplay(40);
			ppt.textT = scaleForDisplay(70);
			ppt.textL = scaleForDisplay(40);
			ppt.textR = scaleForDisplay(40);
			ppt.gap = scaleForDisplay(11);
			} else {
			// Set Biography Window Size and Padding
			ppt.borT = scaleForDisplay(30);
			ppt.borB = scaleForDisplay(30);
			ppt.borL = scaleForDisplay(40);
			ppt.borR = scaleForDisplay(40);
			ppt.textT = scaleForDisplay(70);
			ppt.textL = scaleForDisplay(40);
			ppt.textR = scaleForDisplay(40);
			ppt.gap = scaleForDisplay(11);
			}

			// ---> Can't use because UIHack Fullscreen function is same as UIHack Maximize function!?
			// ---> Disabled UIHack Maximize function in Preferences -> Display -> Default User Interface -> Main Window - > Disable window maximization
			/* 
			if (UIHacks.MainWindowState == 2 && displayPlaylist || displayLibrary) {
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.55 * ww : 0.75 * ww) / albumart.Width, (wh - geo.top_art_spacing - geo.lower_bar_h - 32) / albumart.Height);
				xCenter = 0.24 * ww;
			} else if (UIHacks.MainWindowState == 0 && displayPlaylist || displayLibrary) {
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.50 * ww : 0.75 * ww) / albumart.Width, (wh - geo.top_art_spacing - geo.lower_bar_h - 32) / albumart.Height);
				xCenter = 0.25 * ww;
			}
			*/
			// End

		albumart_size.w = Math.floor(albumart.Width * album_scale); // width
		albumart_size.h = Math.floor(albumart.Height * album_scale); // height
		albumart_size.x = Math.floor(xCenter - 0.5 * albumart_size.w); // left
		if (album_scale !== (wh - geo.top_art_spacing - lowerSpace - 6) / albumart.Height) {
			// restricted by width
			var y = Math.floor(((wh - geo.lower_bar_h) / 2) - albumart_size.h / 2) + 3;
			albumart_size.y = Math.min(y, scaleForDisplay(150) + 10);	// 150 or 300 + 10? Not sure where 160 comes from
		} else {
			const showingMinMaxButtons = (UIHacks && UIHacks.FrameStyle) ? true : false;	// add a bit of extra space because we move transport down slightly
			albumart_size.y = geo.top_art_spacing + (showingMinMaxButtons ? scaleForDisplay(10) : 0); // height of menu bar + spacing + height of Artist text (32+32+32)
		}
		if (btns.playlist && albumart_size.x + albumart_size.w > btns.playlist.x - 50) {
			albumart_size.y += 6 - transport.enableTransportControls * 6;
		}

		if (albumart_scaled) {
			albumart_scaled = null;
		}
		albumart_scaled = albumart.Resize(albumart_size.w, albumart_size.h);
		pauseBtn.setCoords(albumart_size.x + albumart_size.w / 2, albumart_size.y + albumart_size.h / 2);
		hasArtwork = true;
	} else {
		albumart_size = new ImageSize(0, geo.top_art_spacing, 0, 0);
	}
	if (cdart) {
		if (hasArtwork) {
			if (resetCDPosition) {
				if (ww - (albumart_size.x + albumart_size.w) < albumart_size.h * pref.cdart_amount + 5)
					cdart_size.x = Math.floor(0.99 * ww - albumart_size.h);
				else
					cdart_size.x = Math.floor(albumart_size.x + albumart_size.w - (albumart_size.h - 4) * (1 - pref.cdart_amount));
				cdart_size.y = albumart_size.y + 2;
				cdart_size.w = albumart_size.h - 4; // cdart must be square so use the height of album art for width of cdart
				cdart_size.h = cdart_size.w;
			} else { // when CDArt moves because folder images are different sizes we want to push it outwards, but not move it back in so it jumps around less
				cdart_size.x = Math.max(cdart_size.x, Math.floor(Math.min(0.99 * ww - albumart_size.h, albumart_size.x + albumart_size.w - (albumart_size.h - 4) * (1 - pref.cdart_amount))));
				cdart_size.y = cdart_size.y > 0 ? Math.min(cdart_size.y, albumart_size.y + 2) : albumart_size.y + 2;
				cdart_size.w = Math.max(cdart_size.w, albumart_size.h - 4);
				cdart_size.h = cdart_size.w;
				if (cdart_size.x + cdart_size.w > ww) {
					cdart_size.x = ww - cdart_size.w - scaleForDisplay(15);
				}
			}
			// console.log(cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h);
		} else {
			// no album art so we need to calc size of disc
			const cd_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.47 * ww : 0.75 * ww) / cdart.Width, (wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / cdart.Height);
			let xCenter = 0;
			if (displayPlaylist || displayLibrary) {
				xCenter = 0.25 * ww;
			} else if (ww / wh < 1.40) { // when using a roughly 4:3 display the album art crowds, so move it slightly off center
				xCenter = 0.56 * ww; // TODO: check if this is still needed?
			} else {
				xCenter = 0.5 * ww;
				art_off_center = false;
				if (cd_scale == 0.75 * ww / cdart.Width) {
					xCenter += 0.1 * ww;
					art_off_center = true; // TODO: We should probably suppress labels in this case
				}
			}
			// need to -4 from height and add 2 to y to avoid skipping cdArt drawing - not sure this is needed
			cdart_size.w = Math.floor(cdart.Width * cd_scale) - 4; // width
			cdart_size.h = cdart_size.w; // height
			cdart_size.x = Math.floor(xCenter - 0.5 * cdart_size.w); // left
			if (cd_scale !== (wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / cdart.Height) {
				// restricted by width
				var y = geo.top_art_spacing + Math.floor(((wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / 2) - cdart_size.h / 2);
				cdart_size.y = Math.min(y, 160);
			} else {
				cdart_size.y = geo.top_art_spacing + 2; // top
			}
			pauseBtn.setCoords(cdart_size.x + cdart_size.w / 2, cdart_size.y + cdart_size.h / 2);
			hasArtwork = true;
		}
	} else {
		cdart_size = new ImageSize(0, 0, 0, 0);
	}
	if (hasArtwork) {
		if (gLyrics) {
			gLyrics.on_size(albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h);
		}
		if (!pref.darkMode) {
			createDropShadow();
		}
	} else {
		if (displayLibrary || displayPlaylist) {
			pauseBtn.setCoords(ww * (0.50 / 2), wh / 2 - (geo.top_art_spacing));
		} else {
			pauseBtn.setCoords(ww / 2, wh / 2);
		}
	}
}

function loadFlagImage(country) {
	const countryName = convertIsoCountryCodeToFull(country) || country;	// in case we have a 2-digit country code
	const path = $(paths.flagsBase) + (is_4k ? '64\\' : '32\\') + countryName.trim().replace(/ /g, '-') + '.png';
	return gdi.Image(path);
}

function loadCountryFlags() {
	flagImgs = [];
	getMetaValues(tf.artist_country).forEach(country => {
		const flagImage = loadFlagImage(country);
		flagImage && flagImgs.push(flagImage);
	});
}

function loadReleaseCountryFlag() {
	releaseFlagImg = loadFlagImage($(tf.releaseCountry));
}

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

function LoadLabelImage(publisherString) {
	let recordLabel = null;
	const d = new Date();
	let labelStr = replaceFileChars(publisherString);
	if (labelStr) {
		/* First check for record label folder */
		const lastSrchYear = d.getFullYear();
		let dir = paths.labelsBase; // also used below
		if (IsFolder(dir + labelStr) ||
			IsFolder(dir + (labelStr = labelStr.replace(/ Records$/, '')
					.replace(/ Recordings$/, '')
					.replace(/ Music$/, '')
					.replace(/\.$/, '')))) {
			let year = parseInt($('$year(%date%)'));
			for (; year <= lastSrchYear; year++) {
				const yearFolder = dir + labelStr + '\\' + year;
				if (IsFolder(yearFolder)) {
					console.log('Found folder for ' + labelStr + ' for year ' + year + '.');
					dir += labelStr + '\\' + year + '\\';
					break;
				}
			}
			if (year > lastSrchYear) {
				dir += labelStr + '\\'; /* we didn't find a year folder so use the "default" logo in the root */
			}
		}
		/* actually load the label from either the directory we found above, or the base record label folder */
		labelStr = replaceFileChars(publisherString); // we need to start over with the original string when searching for the file, just to be safe
		let label = dir + labelStr + '.png';
		if (IsFile(label)) {
			recordLabel = gdi.Image(label);
			console.log('Found Record label:', label, !recordLabel ? '<COULD NOT LOAD>' : '');
		} else {
			labelStr = labelStr.replace(/ Records$/, '').replace(/ Recordings$/, '').replace(/ Music$/, '');
			label = dir + labelStr + '.png';
			if (IsFile(label)) {
				recordLabel = gdi.Image(label);
			} else {
				label = dir + labelStr + ' Records.png';
				if (IsFile(label)) {
					recordLabel = gdi.Image(label);
				}
			}
		}
	}
	return recordLabel;
}

function fetchNewArtwork(metadb) {
	let fetchArtworkProfiler = null;
	let cdartPath;
	if (timings.showDebugTiming) fetchArtworkProfiler = fb.CreateProfiler('fetchNewArtwork');
	console.log('Fetching new art'); // can remove this soon
	aa_list = [];
	var disc_art_exists = true;

	if (pref.display_cdart && !isStreaming) { // we must attempt to load CD/vinyl art first so that the shadow is drawn correctly
		cdartPath = $(pref.vinylside_path); // try vinyl%vinyl disc%.png first
		if (!IsFile(cdartPath)) {
			cdartPath = $(pref.vinyl_path); // try vinyl.png
			if (!IsFile(cdartPath)) {
				cdartPath = $(pref.cdartdisc_path); // try cd%discnumber%.png
				if (!IsFile(cdartPath)) {
					cdartPath = $(pref.cdart_path); // cd%discnumber%.png didn't exist so try cd.png.
					if (!IsFile(cdartPath)) {
						disc_art_exists = false; // didn't find anything
					}
				}
			}
		}
		if (disc_art_exists) {
			let temp_cdart;
			if (loadFromCache) {
				temp_cdart = artCache.getImage(cdartPath);
			}
			if (temp_cdart) {
				disposeCDImg(cdart);
				cdart = temp_cdart;
				ResizeArtwork(true);
				CreateRotatedCDImage();
				if (pref.spinCdart) {
					cdartArray = [];	// clear last image
					setupRotationTimer();
				}
			} else {
				gdi.LoadImageAsyncV2(window.ID, cdartPath).then(cdImage => {
					disposeCDImg(cdart); // delay disposal so we don't get flashing
					cdart = artCache.encache(cdImage, cdartPath);
					ResizeArtwork(true);
					CreateRotatedCDImage();
					if (pref.spinCdart) {
						cdartArray = [];	// clear last image
						setupRotationTimer();
					}
					lastLeftEdge = 0; // recalc label location
					RepaintWindow();
				});
			}
		} else {
			cdart = disposeCDImg(cdart);
		}
	}
	if (timings.showDebugTiming) fetchArtworkProfiler.Print();

	if (isStreaming) {
		cdart = disposeCDImg(cdart);
		albumart = utils.GetAlbumArtV2(metadb);
		pref.showTitleInGrid = true;
		if (albumart) {
			getThemeColors(albumart);
			ResizeArtwork(true);
		} else {
			noArtwork = true;
			shadow_image = null;
		}
	} else {
		pref.showTitleInGrid = false;
		aa_list = globals.imgPaths.map(path => utils.Glob($(path), FileAttributes.Directory | FileAttributes.Hidden)).flat();
		const filteredFileTypes = pref.filterCdJpgsFromAlbumArt ? '(png|jpg)' : 'png';
		const pattern = new RegExp('(cd|vinyl|' + settings.cdArtBasename + ')([0-9]*|[a-h])\.' + filteredFileTypes, 'i');
		const imageType = /jpg|png$/i;	// TODO: Add gifs?
		// remove duplicates and cd/vinyl art and make sure all files are jpg or pngs
		aa_list = [... new Set(aa_list)].filter(path => !pattern.test(path) && imageType.test(path));

		if (aa_list.length) {
			noArtwork = false;
			embeddedArt = false;
			if (aa_list.length > 1 && pref.cycleArt) {
				albumArtTimeout = setTimeout(() => {
					displayNextImage();
				}, settings.artworkDisplayTime * 1000);
			}
			albumArtIndex = 0;
			loadImageFromAlbumArtList(albumArtIndex, loadFromCache); // display first image
		} else if (metadb && (albumart = utils.GetAlbumArtV2(metadb))) {
			getThemeColors(albumart);
			ResizeArtwork(true);
			embeddedArt = true;
		} else {
			noArtwork = true;
			albumart = null;
			ResizeArtwork(true);
			debugLog("Repainting on_playback_new_track due to no cover image");
			RepaintWindow();
		}
	}
	if (timings.showDebugTiming) fetchArtworkProfiler.Print();
}


function RepaintWindow() {
	debugLog("Repainting from RepaintWindow()");
	window.Repaint();
}

function createButtonObjects(ww, wh) {
	btns = [];
	const showingMinMaxButtons = (UIHacks && UIHacks.FrameStyle) ? true : false;

	if (ww <= 0 || wh <= 0) {
		return;
	} else if (typeof btnImg === 'undefined') {
		createButtonImages();
	}

	var buttonSize = scaleForDisplay(pref.transport_buttons_size);
	//---> Transport buttons

	if (pref.layout_mode === 'default_mode') {

		if (transport.enableTransportControls) {
			let count = 4 + (transport.showRandom ? 1 : 0) +
					(transport.showVolume ? 1 : 0) +
					(transport.showReload ? 1 : 0);

			const y = transport.displayBelowArtwork ? wh - geo.lower_bar_h + (is_4k ? scaleForDisplay(27) : scaleForDisplay(28)) - buttonSize : scaleForDisplay(10) + (showingMinMaxButtons ? scaleForDisplay(5) : 0);
			const w = buttonSize;
			const h = w;
			const p = scaleForDisplay(pref.transport_buttons_spacing); // space between buttons
			const x = (ww - w * count - p * (count - 1)) / 2;

			const calcX = (index) => {
				return x + (w + p) * index;
			}

			count = 0;
			btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
			btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
			btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
			btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');
			if (transport.showRandom) {
				btns.random = new Button(calcX(++count), y, w, h, 'Playback/Random', btnImg.PlaybackRandom, 'Randomize Playlist');
			}
			if (transport.showVolume) {
				btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
				volume_btn.setPosition(btns.volume.x, y, w);
			}
			if (transport.showReload) {
				btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
			}
		}
	}

	if (pref.layout_mode === 'playlist_mode') {

		if (transport.enableTransportControls) {
			let count = 4 + (transport.showRandom ? 1 : 0) +
					(transport.showVolume ? 1 : 0) +
					(transport.showReload ? 1 : 0);

			const y = transport.displayBelowArtwork ? wh - geo.lower_bar_h + (is_4k ? scaleForDisplay(63) : scaleForDisplay(65)) - buttonSize : scaleForDisplay(10);
			const w = buttonSize;
			const h = w;
			const p = scaleForDisplay(pref.transport_buttons_spacing); // space between buttons
			const x = (ww - w * count - p * (count - 1)) / 2;

			const calcX = (index) => {
				return x + (w + p) * index;
			}

			count = 0;
			btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
			btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
			btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
			btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');
			if (transport.showRandom) {
				btns.random = new Button(calcX(++count), y, w, h, 'Playback/Random', btnImg.PlaybackRandom, 'Randomize Playlist');
			}
			if (transport.showVolume) {
				btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
				volume_btn.setPosition(btns.volume.x, y, w);
			}
			if (transport.showReload) {
				btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
			}
		}
	}

	//---> Caption buttons
	if (showingMinMaxButtons) {
		let hideClose;

		(UIHacks.FrameStyle == FrameStyle.SmallCaption && UIHacks.FullScreen != true) ? hideClose = true : hideClose = false;

		const y = is_4k ? 21 : 8;
		const w = scaleForDisplay(22);
		const h = w;
		const p = 3;
		const x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - (is_4k ? 21 : 14);

		if (pref.layout_mode === 'default_mode') {
		btns.Minimize = new Button(x, y, w, h, "Minimize", btnImg.Minimize);
		btns.Maximize = new Button(x + w + p, y, w, h, "Maximize", btnImg.Maximize);
		if (!hideClose)
			btns.Close = new Button(x + (w + p) * 2, y, w, h, "Close", btnImg.Close);
		} else if (pref.layout_mode === 'playlist_mode') {
			btns.Minimize = new Button(x + (w + p), y, w, h, "Minimize", btnImg.Minimize);
			if (!hideClose)
				btns[12] = new Button(x + (w + p) * 2, y, w, h, "Close", btnImg.Close);
		}
	}

	if (pref.layout_mode === 'default_mode') {

		/** @type {GdiBitmap[]} */
		let img = btnImg.File;
		let x = is_4k ? 18 : 8;
		let y = is_4k ? 16 : 9;
		let h = img[0].Height;
		let w = img[0].Width;
		let centerMenu = is_4k ? 550 : 280;

		if (pref.menu_font_size === 11) {
			if (pref.Player_Small && ww < 1600 || pref.Player_4K_Small) {
				centerMenu = is_4k ? 396 : 204;
			} else {
				centerMenu = is_4k ? 532 : 264;
			}
		} else if (pref.menu_font_size === 12) {
			if (pref.Player_Small && ww < 1600 || pref.Player_4K_Small) {
				centerMenu = is_4k ? 550 : 280;
			} else {
				centerMenu = is_4k ? 564 : 280;
			}
		} else if (pref.menu_font_size === 13) {
			if (pref.Player_Small && ww < 1600 || pref.Player_4K_Small) {
				centerMenu = is_4k ? 708 : 356;
			} else {
				centerMenu = is_4k ? 593 : 295;
			}
		} else if (pref.menu_font_size === 14) {
			if (pref.Player_Small && ww < 1600 || pref.Player_4K_Small) {
				centerMenu = is_4k ? 856 : 432;
			} else {
				centerMenu = is_4k ? 626 : 314;
			}
		} else if (pref.menu_font_size === 16) {
			if (pref.Player_Small && ww < 1600 || pref.Player_4K_Small) {
				centerMenu = is_4k ? 1158 : 584;
			} else {
				centerMenu = is_4k ? 688 : 343;
			}
		}

		btns[20] = new Button(x, y, w, h, 'File', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.Edit;
		btns[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.View;
		btns[22] = new Button(x, y, img[0].Width, h, 'View', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.Playback;
		btns[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.Library;
		btns[24] = new Button(x, y, img[0].Width, h, 'Library', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.Help;
		btns[25] = new Button(x, y, img[0].Width, h, 'Help', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.Playlists;
		btns[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);

		x += img[0].Width - (is_4k ? 3 : 2);
		img = btnImg.Options;
		btns[27] = new Button(x, y, img[0].Width, h, 'Options', img);

		let buttonY = 15;
		if (showingMinMaxButtons) {
			buttonY = 15 + btns.Minimize.h;
		}

		img = btnImg.Settings;
		x = Math.round(ww * .5 + (centerMenu / 2));
		y = is_4k ? 16 : 9;
		h = img[0].Height + 4;
		if (pref.menu_font_size === 11) { is_4k ? h = img[0].Height + 6 : h = img[0].Height + 5; }
		if (pref.menu_font_size === 12) { h = img[0].Height + 4; }
		if (pref.menu_font_size === 13) { is_4k ? h = img[0].Height + 1 : h = img[0].Height + 2; }
		if (pref.menu_font_size === 14) { is_4k ? h = img[0].Height - 2 : h = img[0].Height + 1; }
		if (pref.menu_font_size === 16) { is_4k ? h = img[0].Height - 7 : h = img[0].Height - 2; }
		btns[30] = new Button(x, y, 0, h, img);
		img = btnImg.Rating;
		x -= (img[0].Width);
		btns[32] = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Rating', img, 'Rate Song');
		img = btnImg.Lyrics;
		x -= (img[0].Width) - (is_4k ? 3 : 2);
		btns.lyrics = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Lyrics', img, 'Display Lyrics');
		img = btnImg.Biography;
		x -= (img[0].Width) - (is_4k ? 3 : 2);
		btns.biography = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Biography', img, 'Display Biography');
		img = btnImg.ShowLibrary;
		x -= (img[0].Width) - (is_4k ? 3 : 2);
		btns.library = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'ShowLibrary', img, 'Show Library');
		img = btnImg.Playlist;
		x -= (img[0].Width) - (is_4k ? 3 : 2);
		btns.playlist = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Playlist', img, 'Show Playlist');

	} else if (pref.layout_mode === 'playlist_mode') {

		/** @type {GdiBitmap[]} */
		let img = btnImg.File;
		let x = is_4k ? 16 : 8;
		let y = is_4k ? 16 : 9;
		let h = img[0].Height;
		let w = img[0].Width;
		
		btns[20] = new Button(x, y, w, h, 'File', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.Edit;
		btns[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.View;
		btns[22] = new Button(x, y, img[0].Width, h, 'View', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.Playback;
		btns[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.Library;
		btns[24] = new Button(x, y, img[0].Width, h, 'Library', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.Help;
		btns[25] = new Button(x, y, img[0].Width, h, 'Help', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.Playlists;
		btns[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);

		if (pref.menu_font_size === 11) { x += img[0].Width + (is_4k ? 3 : 0); }
		if (pref.menu_font_size === 12) { x += img[0].Width - (is_4k ? 3 : 2); }
		if (pref.menu_font_size === 13) { x += img[0].Width - (is_4k ? 8 : 5); }
		if (pref.menu_font_size === 14) { x += img[0].Width - (is_4k ? 14 : 8); }
		if (pref.menu_font_size === 16) { x += img[0].Width - (is_4k ? 26 : 14); }
		img = btnImg.Options;
		btns[27] = new Button(x, y, img[0].Width, h, 'Options', img);

		let buttonY = 15;
		if (showingMinMaxButtons) {
			buttonY = 15 + btns.Minimize.h;
		}

		btns[30] = new Button(x, y, 0, h, img);
		btns.playlist = new Button(x, y, img[0].Width, h, 'Playlist', img, 'Show Playlist');

	}

	/* if a new image button is added to the left of playlist we need to update the ResizeArtwork code */
}

// =================================================== //

function createButtonImages() {
	let createButtonProfiler = null;
	if (timings.showExtraDrawTiming) createButtonProfiler = fb.CreateProfiler('createButtonImages');
	const transportCircleSize = Math.round(pref.transport_buttons_size * 0.93333);
	let btns = {}

	try {
		btns = {
			Stop: {
				ico: g_guifx.stop,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Previous: {
				ico: g_guifx.previous,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Play: {
				ico: g_guifx.play,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Pause: {
				ico: g_guifx.pause,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Next: {
				ico: g_guifx.next,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackRandom: {
				ico: g_guifx.shuffle,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			ShowVolume: {
				ico:  g_guifx.volume_up,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Reload: {
				ico: g_guifx.power,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Minimize: {
				ico: '0',
				font: ft.Marlett,
				type: "window",
				w: 22,
				h: 22
			},
			Maximize: {
				ico: '2',
				font: ft.Marlett,
				type: "window",
				w: 22,
				h: 22
			},
			Close: {
				ico: 'r',
				font: ft.Marlett,
				type: "window",
				w: 22,
				h: 22
			},
			File: {
				ico: "File",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Edit: {
				ico: "Edit",
				font: ft.SegoeUi,
				type: 'menu'
			},
			View: {
				ico: "View",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Playback: {
				ico: "Playback",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Library: {
				ico: "Library",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Help: {
				ico: "Help",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Playlists: {
				ico: "Playlists",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Options: {
				ico: "Options",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Playlist: {
				ico: "Details",
				font: ft.SegoeUi,
				type: "menu"
			},
			ShowLibrary: {
				ico: "Library",
				font: ft.SegoeUi,
				type: "menu"
			},
			Lyrics: {
				ico: "Lyrics",
				font: ft.SegoeUi,
				type: "menu"
			},
			Biography: {
				ico: "Biography",
				font: ft.SegoeUi,
				type: "menu"
			},
			Rating: {
				ico: "Rating",
				font: ft.SegoeUi,
				type: "menu"
			},
			Properties: {
				ico: "Properties",
				font: ft.SegoeUi,
				type: "menu"
			},
			Settings: {
				ico: "Settings",
				font: ft.SegoeUi,
				type: "menu"
			},
		};
	} catch (e) {
		console.log('**********************************');
		console.log('ATTENTION: Buttons could not be created, most likely because the icon images were not found in "' + paths.iconsBasePath + settings.iconSet + '"');
		console.log('Make sure you installed the theme correctly to ' + fb.ProfilePath + '.');
		console.log('**********************************');
	}


	btnImg = [];

	for (var i in btns) {

		if (btns[i].type === 'menu') {
			const img = gdi.CreateImage(100, 100);
			const g = img.GetGraphics();

			const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);
			btns[i].w = Math.ceil(measurements.Width + 20);
			img.ReleaseGraphics(g);
			btns[i].h = Math.ceil(measurements.Height + 5);
		}

		let w = btns[i].w;
		let	h = btns[i].h;
		let	lw = scaleForDisplay(2);

		if (is_4k && btns[i].type === 'transport') {
			w *= 2;
			h *= 2;
		} else if (is_4k && btns[i].type !== 'menu') {
			w = Math.round(btns[i].w * 1.5);
			h = Math.round(btns[i].h * 1.6);
		} else if (is_4k) {
			w += 20;
			h += 10;
		}

		var stateImages = []; // 0=ButtonState.Default, 1=hover, 2=down, 3=Enabled;
		for (let s = 0; s <= 3; s++) {
			if (s === 3 && btns[i].type !== 'image') {
				break;
			}
			var img = gdi.CreateImage(w, h);
			const g = img.GetGraphics();
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			if (btns[i].type !== 'transport') {
				g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit); // positions playback icons weirdly
			} else {
				g.SetTextRenderingHint(TextRenderingHint.AntiAlias)
			}

			var useDarkTransport = !pref.darkMode && transport.displayBelowArtwork;
			var transportButtonColor = useDarkTransport ? rgb(140, 140, 140) : rgb(0, 2, 4);
			var transportOutlineColor = useDarkTransport ? rgb(220, 220, 220) : rgb(120, 120, 120);
			var menuTextColor = RGB(140, 142, 144);
			var menuRectColor = RGB(120, 122, 124);
			var minMaxIcoColor = RGB(140, 142, 144);
			var transportIconColor = transportButtonColor;
			var transportEllipseColor = transportOutlineColor;

			if (pref.whiteTheme) {
				var menuTextColor = RGB(120, 120, 120);
				var menuRectColor = RGB(140, 140, 140);
				var minMaxIcoColor = RGB(120, 120, 120);
				var transportIconColor = RGB(120, 120, 120);
				var transportEllipseColor = RGB(220, 220, 220);
				var transportEllipseBGColor = RGB(255, 255, 255);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(80, 80, 80);
						menuRectColor = RGB(200, 200, 200);
						minMaxIcoColor = RGB(80, 80, 80);
						transportIconColor = RGB(80, 80, 80);
						transportEllipseColor = RGB(200, 200, 200);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(80, 80, 80);
						menuRectColor = RGB(200, 200, 200);
						minMaxIcoColor = RGB(120, 120, 120);
						transportIconColor = RGB(120, 120, 120);
						transportEllipseColor = RGB(200, 200, 200);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.blackTheme) {
				var menuTextColor = RGB(180, 180, 180);
				var menuRectColor = RGB(60, 60, 60);
				var minMaxIcoColor = RGB(180, 180, 180);
				var transportIconColor = RGB(160, 160, 160);
				var transportEllipseColor = RGB(60, 60, 60);
				var transportEllipseBGColor = RGB(35, 35, 35);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(120, 120, 120);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(120, 120, 120);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(120, 120, 120);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(120, 120, 120);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.blueTheme) {
				var menuTextColor = RGB(230, 230, 230);
				var menuRectColor = RGB(76, 175, 255);
				var minMaxIcoColor = RGB(220, 220, 220);
				var transportIconColor = RGB(242, 230, 170);
				var transportEllipseColor = RGB(22, 107, 186);
				var transportEllipseBGColor = RGB(10, 130, 220);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(76, 175, 255);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(76, 175, 255);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(76, 175, 255);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(76, 175, 255);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.darkblueTheme) {
				var menuTextColor = RGB(230, 230, 230);
				var menuRectColor = RGB(200, 200, 200);
				var minMaxIcoColor = RGB(220, 220, 220);
				var transportIconColor = RGB(255, 202, 128);
				var transportEllipseColor = RGB(20, 33, 48);
				var transportEllipseBGColor = RGB(27, 55, 90);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(50, 90, 150);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(50, 90, 150);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(50, 90, 150);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(50, 90, 150);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.redTheme) {
				var menuTextColor = RGB(220, 220, 220);
				var menuRectColor = RGB(204, 45, 45);
				var minMaxIcoColor = RGB(200, 200, 200);
				var transportIconColor = RGB(245, 212, 165);
				var transportEllipseColor = RGB(82, 19, 19);
				var transportEllipseBGColor = RGB(140, 25, 25);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(204, 45, 45);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(204, 45, 45);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(255, 255, 255);
						menuRectColor = RGB(204, 45, 45);
						minMaxIcoColor = RGB(255, 255, 255);
						transportIconColor = RGB(255, 255, 255);
						transportEllipseColor = RGB(204, 45, 45);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if  (pref.creamTheme) {
				var menuTextColor = RGB(100, 150, 110);
				var menuRectColor = RGB(100, 150, 110);
				var minMaxIcoColor = RGB(100, 150, 110);
				var transportIconColor = RGB(100, 150, 110);
				var transportEllipseColor = RGB(220, 220, 220);
				var transportEllipseBGColor = RGB(255, 255, 255);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(100, 100, 100);
						menuRectColor = RGB(190, 190, 190);
						minMaxIcoColor = RGB(100, 100, 100);
						transportIconColor = RGB(100, 100, 100);
						transportEllipseColor = RGB(200, 200, 200);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(100, 100, 100);
						menuRectColor = RGB(190, 190, 190);
						minMaxIcoColor = RGB(100, 100, 100);
						transportIconColor = RGB(100, 100, 100);
						transportEllipseColor = RGB(200, 200, 200);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.nblueTheme) {
				var menuTextColor = RGB(0, 200, 255);
				var menuRectColor = RGB(0, 200, 255);
				var minMaxIcoColor = RGB(0, 200, 255);
				var transportIconColor = RGB(0, 200, 255);
				var transportEllipseColor = RGB(50, 50, 50);
				var transportEllipseBGColor = RGB(35, 35, 35);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(0, 238, 255);
						menuRectColor = RGB(0, 238, 255);
						minMaxIcoColor = RGB(0, 238, 255);
						transportIconColor = RGB(0, 238, 255);
						transportEllipseColor = RGB(0, 238, 255);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(0, 238, 255);
						menuRectColor = RGB(0, 238, 255);
						minMaxIcoColor = RGB(0, 238, 255);
						transportIconColor = RGB(0, 238, 255);
						transportEllipseColor = RGB(0, 238, 255);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.ngreenTheme) {
				var menuTextColor = RGB(0, 200, 0);
				var menuRectColor = RGB(0, 200, 0);
				var minMaxIcoColor = RGB(0, 200, 0);
				var transportIconColor = RGB(0, 200, 0);
				var transportEllipseColor = RGB(50, 50, 50);
				var transportEllipseBGColor = RGB(35, 35, 35);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(0, 255, 0);
						menuRectColor = RGB(0, 255, 0);
						minMaxIcoColor = RGB(0, 255, 0);
						transportIconColor = RGB(0, 255, 0);
						transportEllipseColor = RGB(0, 255, 0);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(0, 255, 0);
						menuRectColor = RGB(0, 255, 0);
						minMaxIcoColor = RGB(0, 255, 0);
						transportIconColor = RGB(0, 255, 0);
						transportEllipseColor = RGB(0, 255, 0);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.nredTheme) {
				var menuTextColor = RGB(242, 7, 46);
				var menuRectColor = RGB(242, 7, 46);
				var minMaxIcoColor = RGB(242, 7, 46);
				var transportIconColor = RGB(242, 7, 46);
				var transportEllipseColor = RGB(50, 50, 50);
				var transportEllipseBGColor = RGB(35, 35, 35);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(255, 8, 8);
						menuRectColor = RGB(255, 8, 8);
						minMaxIcoColor = RGB(255, 8, 8);
						transportIconColor = RGB(255, 8, 8);
						transportEllipseColor = RGB(255, 8, 8);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(255, 8, 8);
						menuRectColor = RGB(255, 8, 8);
						minMaxIcoColor = RGB(255, 8, 8);
						transportIconColor = RGB(255, 8, 8);
						transportEllipseColor = RGB(255, 8, 8);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}

			} else if (pref.ngoldTheme) {
				var menuTextColor = RGB(254, 204, 3);
				var menuRectColor = RGB(254, 204, 3);
				var minMaxIcoColor = RGB(254, 204, 3);
				var transportIconColor = RGB(254, 204, 3);
				var transportEllipseColor = RGB(50, 50, 50);
				var transportEllipseBGColor = RGB(35, 35, 35);
				var iconAlpha = 255;

				switch (s) {
					case ButtonState.Hovered:
						menuTextColor = RGB(255, 242, 3);
						menuRectColor = RGB(255, 242, 3);
						minMaxIcoColor = RGB(255, 242, 3);
						transportIconColor = RGB(255, 242, 3);
						transportEllipseColor = RGB(255, 242, 3);
						iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = RGB(255, 242, 3);
						menuRectColor = RGB(255, 242, 3);
						minMaxIcoColor = RGB(255, 242, 3);
						transportIconColor = RGB(255, 242, 3);
						transportEllipseColor = RGB(255, 242, 3);
						iconAlpha = 190;
						break;
					case ButtonState.Enabled:
						iconAlpha = 250;
						break;
				}
			}

			if (btns[i].type == 'menu') {
				s && g.DrawRoundRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 3, 3, 1, menuRectColor);
				g.DrawString(btns[i].ico, btns[i].font, menuTextColor, 0, 0, w, h - 1, StringFormat(1, 1));
			} else if (btns[i].type == 'window') { // min/max/close controls for UIHacks
				s && g.DrawRoundRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 3, 3, 1, menuRectColor);
				g.DrawString(btns[i].ico, btns[i].font, minMaxIcoColor, 0, 0, w, h, StringFormat(1, 1));
			} else if (btns[i].type == 'transport') {
				g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, transportEllipseColor);
				g.FillEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, transportEllipseBGColor) 
				g.DrawString(btns[i].ico, btns[i].font, transportIconColor, 1, (i == 'Stop' || i == 'Reload') ? 0 : 1, w, h, StringFormat(1, 1));
			} else if (btns[i].type == 'image') {
				g.DrawImage(btns[i].ico, Math.round((w - btns[i].ico.Width) / 2), Math.round((h - btns[i].ico.Height) / 2), btns[i].ico.Width, btns[i].ico.Height, 0, 0, btns[i].ico.Width, btns[i].ico.Height, 0, iconAlpha);
			}

			img.ReleaseGraphics(g);
			stateImages[s] = img;
		}

		btnImg[i] = stateImages;
	}
	if (timings.showExtraDrawTiming) createButtonProfiler.Print();
}


// ================================================ LAYOUT MODE SWITCHER ====================================================== //

var pss_switch = new function() {

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
			fso.CreateTextFile(pathToState + default_idx, true);
			return default_state;
		}

		function write_state(new_state) {
			var pathToState = settings_path + '\\' + name.toUpperCase() + '_';

			var index_new = states_list.indexOf(new_state);

			if (index_new === -1) {
				throw Error('Argument Error:\nUnknown state ' + new_state);
			}

			states_list.forEach(function(item,i) {
				_.deleteFile(pathToState + i);
			});
			if (!fso.FileExists(pathToState + index_new)) {
				fso.CreateTextFile(pathToState + index_new, true);
			}

			window.NotifyOthers(name + '_state', new_state);
			refresh_pss();
		}

		// private:
		var name = name_arg;
		var default_state = default_state_arg;
		var states_list = states_list_arg;

		var cur_state;

		initialize();
	}

	function refresh_pss() {
		if (fb.IsPlaying || fb.IsPaused) {
			fb.RunMainMenuCommand('Playback/Play or Pause');
			fb.RunMainMenuCommand('Playback/Play or Pause');
		}
		else {
			fb.RunMainMenuCommand('Playback/Play');
			fb.RunMainMenuCommand('Playback/Stop');
		}
	}

	// private:

	var settings_path = fb.ProfilePath + 'theme_settings\\' + g_theme.folder_name;
	_.createFolder(fb.ProfilePath + 'theme_settings');
	_.createFolder(settings_path);

	/** @type {StateObject} */
	this.layoutmode = new StateObject('layoutmode', ['default_mode', 'playlist_mode'], 'default_mode');
	
	this.player_size = new StateObject('player_size', ['Player_Small', 'Player_Normal', 'Player_Big', 'Player_4K_Small', 'Player_4K_Normal', 'Player_4K_Big'], 'Player_Small');

};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

g_properties.add_properties(
	{
		maximize_to_fullscreen: 	['user.window.maximize_to_fullscreen', true],
		saved_mode: 				['system.window.saved_mode', 'default_mode'],
		default_mode_saved_width:	['system.window.default_mode.saved_width', is_4k ? 2800 : 1140],
		default_mode_saved_height:	['system.window.default_mode.saved_height', is_4k ? 1720 : 730],
		playlist_mode_saved_width:	['system.window.playlist_mode.saved_width', is_4k ? 964 : 484],
		playlist_mode_saved_height: ['system.window.playlist_mode.saved_height', is_4k ? 1720 : 730],
		is_first_launch: 			['system.first_launch', true], // true: init DPI/RES check and setup size
	}
);

// USING for creating foo_ui_columns.dll.cfg to set system.first_launch', true
// For automatic 4k detection and pre-configured Georgia-ReBORN settings.
// Always create a new foo_ui_columns.dll.cfg in FULL HD resolution when a new Georgia version was published or new settings/features were added.
// Uncomment, save georgia-main.js, start foobar and clear Panel Properties, close foobar. A new generated foo_ui_columns.dll.cfg was created in the configuration folder.
//is_first_launch = window.SetProperty('system.first_launch', true);

// Fixup properties
(function() {
	var saved_mode = g_properties.saved_mode;
	if (saved_mode !== 'default_mode' || saved_mode !== 'playlist_mode') {
		g_properties.saved_mode = 'default_mode';
	}
})();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var mode_handler = new LayoutModeHandler();

function LayoutModeHandler() {

	this.layout_mode_default_mode = function() {
		var new_layoutmode_state = 'default_mode';
		if (new_layoutmode_state === 'default_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.layoutmode.state = new_layoutmode_state;
			if (pref.layout_mode === 'default_mode' && !pref.Player_Normal === 'Player_Normal') { // Fix for FULL HD Res that causes ugly resize from Playlist Mode with Player Size 'Normal' to Default Mode
			set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
			} else if (is_4k && pref.layout_mode === 'default_mode') {
			set_window_size(2800, 1720);
			}
			if (!is_4k) {
				UIHacks.MinSize.Width = 1140;
				UIHacks.MinSize.Height = 730;
				UIHacks.MinSize.Enabled = true;
			} else if (is_4k) {
				UIHacks.MinSize.Width = 2300;
				UIHacks.MinSize.Height = 1470;
				UIHacks.MinSize.Enabled = true;
			}
			if (pref.use_4k === 'never' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600) {
				set_window_size(1140, 730);
			}
		}
	};

	this.layout_mode_playlist_mode = function() {
		var new_layoutmode_state = 'playlist_mode';
		if (new_layoutmode_state === 'playlist_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.playlist_mode_saved_width = fb_handle.Width;
					g_properties.playlist_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.layoutmode.state = new_layoutmode_state;
			set_window_size(g_properties.playlist_mode_saved_width, g_properties.playlist_mode_saved_height);
			if (!is_4k) {
				UIHacks.MinSize.Width = 484;
				UIHacks.MinSize.Height = 730;
				UIHacks.MinSize.Enabled = true;
			} else if (is_4k) {
				UIHacks.MinSize.Width = 964;
				UIHacks.MinSize.Height = 1470;
				UIHacks.MinSize.Enabled = true;
			}
		}
	};

	this.player_size_small = function() {
		var new_player_size_state = 'Player_Small';
		if (new_player_size_state === 'Player_Small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
				UIHacks.MinSize.Width = 1140;
				UIHacks.MinSize.Height = 730;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'never' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(1140, 730);
			orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 16); // sets library font size to 16 pixel for FHD
			libraryProps.zoomNode = window.SetProperty(prefix + 'Zoom Node Size (%)', 100); // resets library node size
			ppt.baseFontSize = 12; // sets biography font size for 12 pixel for FHD
			ppt.set(" Scrollbar Size", "Bar," + 12 + ",Arrow," + 12 + ",Gap(+/-),0,GripMinHeight," + 20, "sbarMetrics") // sets biography scrollbar size for FHD
		}
		if (pref.layout_mode === 'playlist_mode') {
			set_window_size(484, 730);
		}
	};

	this.player_size_normal = function() {
		var new_player_size_state = 'Player_Normal';
		if (new_player_size_state === 'Player_Normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
				UIHacks.MinSize.Width = 1600;
				UIHacks.MinSize.Height = 960;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'never' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(1600, 960);
		}
		if (pref.layout_mode === 'playlist_mode') {
			set_window_size(484, 960);
		}
	};

	this.player_size_big = function() {
		var new_player_size_state = 'Player_Big';
		if (new_player_size_state === 'Player_Big') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
				UIHacks.MinSize.Width = 1802;
				UIHacks.MinSize.Height = 1061;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'never' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(1802, 1061);
		}
		if (pref.layout_mode === 'playlist_mode') {
			set_window_size(1600, 960);
		}
	};

	this.player_size_4K_Small = function() {
		var new_player_size_state = 'Player_4K_Small';
		if (new_player_size_state === 'Player_4K_Small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
				UIHacks.MinSize.Width = 2300;
				UIHacks.MinSize.Height = 1470;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'always' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww > 2560 && wh > 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(2300, 1470);
		}
		if (pref.layout_mode === 'playlist_mode') {
			set_window_size(964, 1470);
		}
	};

	this.player_size_4K_Normal = function() {
		var new_player_size_state = 'Player_4K_Normal';
		if (new_player_size_state === 'Player_4K_Normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
				UIHacks.MinSize.Width = 2800;
				UIHacks.MinSize.Height = 1720;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'auto' && pref.layout_mode === 'default_mode') {
			if (initDPI.dpi() > 120) {
				set_window_size(2800, 1720);
				if (ww > 2560 && wh > 1600) {
					is_4k = true;
					pref.Player_4K_Normal = 'Player_4K_Normal';
					pref.Player_Small = false;
					orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 24); // sets library font size to 24 pixel for 4K
					ppt.baseFontSize = 24; // sets biography font size for 24 pixel for 4K
					ppt.set(" Scrollbar Size", "Bar," + 26 + ",Arrow," + 26 + ",Gap(+/-),0,GripMinHeight," + 36, "sbarMetrics") // sets biography scrollbar size for 4K
				} else if (ww < 2560 && wh < 1600) {
					set_window_size(1140, 730);
				}
			} else {
				if (ww < 2560 && wh < 1600) {
					set_window_size(1140, 730);
					is_4k = false;
					pref.Player_Small = 'Player_Small';
					pref.Player_4K_Small = false;
					orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 16); // sets library font size to 16 pixel for FHD
					libraryProps.zoomNode = window.SetProperty(prefix + 'Zoom Node Size (%)', 100); // resets library node size
					ppt.baseFontSize = 12; // sets biography font size for 12 pixel for FHD
					ppt.set(" Scrollbar Size", "Bar," + 12 + ",Arrow," + 12 + ",Gap(+/-),0,GripMinHeight," + 20, "sbarMetrics") // sets biography scrollbar size for FHD
				}
			}
		} else if (pref.use_4k === 'auto' && pref.layout_mode === 'playlist_mode') {
			if (initDPI.dpi() > 120) {
				set_window_size(964, 1720);
				if (wh > 1600) {
					set_window_size(964, 1720);
					is_4k = true;
					pref.Player_4K_Normal = 'Player_4K_Normal';
					pref.Player_Small = false;
					orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 24); // sets library font size to 24 pixel for 4K
					ppt.baseFontSize = 24; // sets biography font size for 24 pixel for 4K
					ppt.set(" Scrollbar Size", "Bar," + 26 + ",Arrow," + 26 + ",Gap(+/-),0,GripMinHeight," + 36, "sbarMetrics") // sets biography scrollbar size for 4K
					window.Repaint();
				} else if (wh < 1600) {
					set_window_size(484, 730);
				}
			} else {
				if (wh < 1600) {
					set_window_size(484, 730);
					is_4k = false;
					pref.Player_Small = 'Player_Small';
					pref.Player_4K_Small = false;
					orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 16); // sets library font size to 16 pixel for FHD
					libraryProps.zoomNode = window.SetProperty(prefix + 'Zoom Node Size (%)', 100); // resets library node size
					ppt.baseFontSize = 12; // sets biography font size for 12 pixel for FHD
					ppt.set(" Scrollbar Size", "Bar," + 12 + ",Arrow," + 12 + ",Gap(+/-),0,GripMinHeight," + 20, "sbarMetrics") // sets biography scrollbar size for FHD
				}
			}
		}
		if (pref.use_4k === 'always' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww > 2560 && wh > 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(2800, 1720);
			is_4k = true;
			pref.Player_4K_Normal = 'Player_4K_Normal';
			pref.Player_Small = false;
			orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 24); // sets library font size to 24 pixel for 4K
			ppt.baseFontSize = 24; // sets biography font size for 24 pixel for 4K
			ppt.set(" Scrollbar Size", "Bar," + 26 + ",Arrow," + 26 + ",Gap(+/-),0,GripMinHeight," + 36, "sbarMetrics") // sets biography scrollbar size for 4K
		} else if (pref.use_4k === 'always' && pref.layout_mode === 'playlist_mode') {
			set_window_size(964, 1720);
			is_4k = true;
			pref.Player_4K_Normal = 'Player_4K_Normal';
			pref.Player_Small = false;
			orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 24); // sets library font size to 24 pixel for 4K
			ppt.baseFontSize = 24; // sets biography font size for 24 pixel for 4K
			ppt.set(" Scrollbar Size", "Bar," + 26 + ",Arrow," + 26 + ",Gap(+/-),0,GripMinHeight," + 36, "sbarMetrics") // sets biography scrollbar size for 4K
		}
		if (pref.layout_mode === 'playlist_mode' && is_4k) {
			set_window_size(964, 1720);
		}
	};

	this.player_size_4K_Big = function() {
		var new_player_size_state = 'Player_4K_Big';
		if (new_player_size_state === 'Player_4K_Big') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					g_properties.default_mode_saved_width = fb_handle.Width;
					g_properties.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(g_properties.default_mode_saved_width, g_properties.default_mode_saved_height);
				UIHacks.MinSize.Width = 3400;
				UIHacks.MinSize.Height = 2020;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'always' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww > 2560 && wh > 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(3400, 2020);
		}
		if (pref.layout_mode === 'playlist_mode') {
			set_window_size(2800, 1720);
		}
	};

	this.set_window_size_limits_for_mode = function(layoutmode) {
		var min_w = 0, max_w = 0, min_h = 0, max_h = 0,
			min_w_4K = 0, max_w_4K = 0, min_h_4K = 0, max_h_4K = 0;
		if (layoutmode === 'default_mode') {
			if (!is_4k) {
			min_w = 1140;
			min_h = 730;
			} else if (is_4k) {
			min_w_4K = 2300;
			min_h_4K = 1470;
			}
		} else if (layoutmode === 'playlist_mode') {
			if (!is_4k) {
			min_w = 484;
			min_h = 730;
			} else if (is_4k) {
			min_w_4K = 964;
			min_h_4K = 1470;
			}
		}
		set_window_size_limits(min_w, min_w_4K, max_w, max_w_4K, min_h, min_h_4K, max_h,max_h_4K);
	};

	this.fix_window_size = function() {

		if (fb_handle) {
			var last_w = fb_handle.Width;
			var last_h = fb_handle.Height;
		} else {
			var was_first_launch = g_properties.is_first_launch;
		}

		if (g_properties.is_first_launch) {

			// Set default mode and pref.whiteTheme on first launch
			pref.layout_mode = 'default_mode';
			pref.darkMode = false;
			pref.whiteTheme = 'white';
			pref.blackTheme = false;
			pref.blueTheme = false;
			pref.darkblueTheme = false;
			pref.redTheme = false;
			pref.creamTheme = false;
			pref.nblueTheme = false;
			pref.ngreenTheme = false;
			pref.nredTheme = false;
			pref.ngoldTheme = false;
			pref.Player_Normal = false;
			pref.Player_Big = false;
			pref.Player_4K_Normal = false;
			pref.Player_4K_Big = false;

			// Init 4k resolution check and player size on first launch
			if (initDPI.dpi() > 120) {
				set_window_size(2800, 1720);
				if (ww > 2560 && wh > 1600) {
					is_4k = true;
					pref.Player_4K_Normal = 'Player_4K_Normal';
					pref.Player_Small = false;
					orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 24); // sets library font size to 24 pixel for 4K
					ppt.baseFontSize = 24; // sets biography font size for 24 pixel for 4K
					ppt.set(" Scrollbar Size", "Bar," + 26 + ",Arrow," + 26 + ",Gap(+/-),0,GripMinHeight," + 36, "sbarMetrics") // sets biography scrollbar size for 4K
					default_mode_saved_width = window.SetProperty('system.window.default_mode.saved_width', 2800);
					default_mode_saved_height = window.SetProperty('system.window.default_mode.saved_height', 1720);
					playlist_mode_saved_width = window.SetProperty('system.window.playlist_mode.saved_width', 964);
					playlist_mode_saved_height = window.SetProperty('system.window.playlist_mode.saved_height', 1720);
				} else if (ww < 2560 && wh < 1600) {
					set_window_size(1140, 730);
				}
			} else {
				if (ww < 2560 && wh < 1600) {
					set_window_size(1140, 730);
					is_4k = false;
					pref.Player_Small = 'Player_Small';
					pref.Player_4K_Small = false;
					orig_font_sz = window.SetProperty(systemPrefix + 'Font Size', 16); // sets library font size to 16 pixel for FHD
					ppt.baseFontSize = 12; // sets biography font size for 12 pixel for FHD
					ppt.set(" Scrollbar Size", "Bar," + 12 + ",Arrow," + 12 + ",Gap(+/-),0,GripMinHeight," + 20, "sbarMetrics") // sets biography scrollbar size for FHD
					default_mode_saved_width = window.SetProperty('system.window.default_mode.saved_width', 1140);
					default_mode_saved_height = window.SetProperty('system.window.default_mode.saved_height', 730);
					playlist_mode_saved_width = window.SetProperty('system.window.playlist_mode.saved_width', 484);
					playlist_mode_saved_height = window.SetProperty('system.window.playlist_mode.saved_height', 730);
				}
			}

			initColors();
			window.Reload();
			g_properties.is_first_launch = false;
		}

		// Workaround for messed up settings file or properties
		this.set_window_size_limits_for_mode(pss_switch.layoutmode.state);

		if (fb_handle) {
			return last_w !== fb_handle.Width || last_h !== fb_handle.Height;
		} else {
			return was_first_launch;
		}
	};

	function set_window_size(width, height) {
		//To avoid resizing bugs, when the window is bigger\smaller than the saved one.
		UIHacks.MinSize.Enabled = false;
		UIHacks.MaxSize.Enabled = false;
		UIHacks.MinSize.Width = width;
		UIHacks.MinSize.Height = height;
		UIHacks.MaxSize.Width = width;
		UIHacks.MaxSize.Height = height;

		UIHacks.MaxSize.Enabled = true;
		UIHacks.MaxSize.Enabled = false;
		UIHacks.MinSize.Enabled = true;
		UIHacks.MinSize.Enabled = false;

		window.NotifyOthers('layoutmode_state_size', pss_switch.layoutmode.state);
	}

	function set_window_size_limits(min_w, min_w_4K, max_w, max_w_4K, min_h, min_h_4K, max_h,max_h_4K) {
		UIHacks.MinSize.Enabled = !!min_w || !!min_w_4K;
		UIHacks.MinSize.Width = min_w || min_w_4K;

		UIHacks.MaxSize.Enabled = !!max_w || !!max_w_4K;
		UIHacks.MaxSize.Width = max_w || max_w_4K;

		UIHacks.MinSize.Enabled = !!min_h || !!min_h_4K;
		UIHacks.MinSize.Height = min_h || min_h_4K;

		UIHacks.MaxSize.Enabled = !!max_h || !!max_h_4K;
		UIHacks.MaxSize.Height = max_h || max_h_4K;
	}

	var fb_handle = undefined;
}

// ================================================ END ====================================================== //