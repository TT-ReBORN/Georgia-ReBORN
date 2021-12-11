// Georgia-ReBORN
//
// Description  a fullscreen theme for foo_spider_monkey_panel
// Author       TT
// Org. Author  Mordred
// Version      2.0.3
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
 * @property {number=} now_playing color of the lower bar text, including tracknum, title, elapsed and remaining time
 * @property {number=} progress_bar the background of the progress bar. Fill will be `col.primary`
 * @property {number=} rating color of rating stars in metadatagrid
 * @property {number=} tl_added background color for timeline block from added to first played
 * @property {number=} tl_played background color for timeline block from first played to last played
 * @property {number=} tl_unplayed background color for timeline block from last played to present time
 */
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
	g_tooltip.SetMaxWidth(scaleForDisplay(800));

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

	if (pref.show_artistInGrid && pref.show_titleInGrid) {
		ft.title_lrg = font(fontLight, pref.album_font_size ? pref.album_font_size : 20, 0);
	} else {
		ft.title_lrg = font(fontBold, pref.album_font_size ? pref.album_font_size : 20, 0);
	}
	ft.title_med = font(fontThin, pref.album_font_size ? pref.album_font_size : 16, 0);
	ft.title_sml = font(fontThin, pref.album_font_size ? pref.album_font_size : 12, 0);
	ft.tracknum_lrg = font(fontLight, pref.tracknum_font_size ? pref.tracknum_font_size : 20, g_font_style.bold);
	ft.tracknum_med = font(fontLight, pref.tracknum_font_size ? pref.tracknum_font_size : 16, g_font_style.bold);
	ft.tracknum_sml = font(fontLight, pref.tracknum_font_size ? pref.tracknum_font_size : 12, g_font_style.bold);
	ft.year = font(fontRegular, 22, g_font_style.bold);

	if (pref.layout_mode === 'default_mode') {
		ft.artist_lrg = font(fontBold, pref.artist_font_size_default ? pref.artist_font_size_default : 18, 0);
	} else if (pref.layout_mode === 'artwork_mode') {
		ft.artist_lrg = font(fontBold, pref.artist_font_size_artwork ? pref.artist_font_size_artwork : 16, 0);
	} else if (pref.layout_mode === 'compact_mode') {
		ft.artist_lrg = font(fontBold, pref.artist_font_size_compact ? pref.artist_font_size_compact : 16, 0);
	}
	ft.artist_med = font(fontBold, pref.artist_font_size_default ? pref.artist_font_size_default : 12, 0);
	ft.artist_sml = font(fontBold, pref.artist_font_size_default ? pref.artist_font_size_default : 8, 0);
	ft.track_info = font(fontThin, 18, 0);
	ft.track_info_sml = font(fontThin, 16, 0);
	ft.grd_key_lrg = font(fontRegular, pref.MetadataGrid_key_font_size ? pref.MetadataGrid_key_font_size : 18, 0); // used instead of ft.grd_key if ww > 1280
	ft.grd_val_lrg = font(fontLight, pref.MetadataGrid_val_font_size ? pref.MetadataGrid_val_font_size : 18, 0); // used instead of ft.grd_val if ww > 1280
	ft.grd_key_med = font(fontRegular, pref.MetadataGrid_key_font_size ? pref.MetadataGrid_key_font_size : 18, 0);
	ft.grd_val_med = font(fontLight, pref.MetadataGrid_val_font_size ? pref.MetadataGrid_val_font_size : 18, 0);
	ft.grd_key_sml = font(fontRegular, pref.MetadataGrid_key_font_size ? pref.MetadataGrid_key_font_size : 18, 0);
	ft.grd_val_sml = font(fontLight, pref.MetadataGrid_val_font_size ? pref.MetadataGrid_val_font_size : 18, 0);

	if (pref.layout_mode === 'default_mode') {
		ft.lower_bar = font(fontLight, pref.lower_bar_font_size_default ? pref.lower_bar_font_size_default : 18, 0);
		ft.lower_bar_bold = font(fontBold, pref.lower_bar_font_size_default ? pref.lower_bar_font_size_default : 18, 0);
	}
	else if (pref.layout_mode === 'artwork_mode') {
		ft.lower_bar = font(fontLight, pref.lower_bar_font_size_artwork ? pref.lower_bar_font_size_artwork : 16, 0);
		ft.lower_bar_bold = font(fontBold, pref.lower_bar_font_size_artwork ? pref.lower_bar_font_size_artwork : 16, 0);
	}
	else if (pref.layout_mode === 'compact_mode') {
		ft.lower_bar = font(fontLight, pref.lower_bar_font_size_compact ? pref.lower_bar_font_size_compact : 16, 0);
		ft.lower_bar_bold = font(fontBold, pref.lower_bar_font_size_compact ? pref.lower_bar_font_size_compact : 16, 0);
	}
	if (updateHyperlink) {
		updateHyperlink.setFont(ft.lower_bar);
	}
	ft.lower_bar_sml = font(fontLight, pref.lower_bar_font_size_default ? pref.lower_bar_font_size_default : 12, 0);
	ft.lower_bar_sml_bold = font(fontBold, pref.lower_bar_font_size_default ? pref.lower_bar_font_size_default : 12, 0);

	if (utils.CheckFont(fontLightAlternate)) {
		useNeue = true;
		ft.lower_bar_artist = font(fontLightAlternate, 18, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontLightAlternate, 8, g_font_style.italic);
	} else {
		ft.lower_bar_artist = font(fontThin, 18, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontThin, 8, g_font_style.italic);
	}

	ft.small_font = font(fontRegular, 14, 0);
	ft.guifx = font(fontGuiFx, pref.layout_mode === 'artwork_mode' ? Math.floor(pref.transport_buttons_size_artwork / 2) : pref.layout_mode === 'compact_mode' ? Math.floor(pref.transport_buttons_size_compact / 2) : Math.floor(pref.transport_buttons_size_default / 2), 0);
	ft.playbackOrder_default = font(fontGuiFx, pref.layout_mode === 'artwork_mode' ? Math.floor(pref.transport_buttons_size_artwork / 1.6) : pref.layout_mode === 'compact_mode' ? Math.floor(pref.transport_buttons_size_compact / 1.6) : Math.floor(pref.transport_buttons_size_default / 1.6), 0);
	ft.playbackOrder_replay = font(fontAwesome, pref.layout_mode === 'artwork_mode' ? Math.floor(pref.transport_buttons_size_artwork / 2) : pref.layout_mode === 'compact_mode' ? Math.floor(pref.transport_buttons_size_compact / 2) : Math.floor(pref.transport_buttons_size_default / 2), 0);
	ft.playbackOrder_shuffle = font(fontGuiFx, pref.layout_mode === 'artwork_mode' ? Math.floor(pref.transport_buttons_size_artwork / 1.65) : pref.layout_mode === 'compact_mode' ? Math.floor(pref.transport_buttons_size_compact / 1.65) : Math.floor(pref.transport_buttons_size_default / 1.65), 0);
	ft.guifx_volume = font(fontGuiFx, pref.layout_mode === 'artwork_mode' ? Math.floor(pref.transport_buttons_size_artwork / 1.33) : pref.layout_mode === 'compact_mode' ? Math.floor(pref.transport_buttons_size_compact / 1.33) : Math.floor(pref.transport_buttons_size_default / 1.33), 0);
	ft.guifx_reload = font(fontGuiFx, pref.layout_mode === 'artwork_mode' ? Math.floor(pref.transport_buttons_size_artwork / 1.5) : pref.layout_mode === 'compact_mode' ? Math.floor(pref.transport_buttons_size_compact / 1.5) : Math.floor(pref.transport_buttons_size_default / 1.5), 0);
	ft.Marlett = font('Marlett', 13, 0);
	ft.SegoeUi = font('Segoe Ui Semibold', pref.menu_font_size, 0);
	ft.library_tree = font('Segoe UI', ppt.baseFontSize, 0);
	ft.lyrics = font(fontRegular, pref.lyricsFontSize || 20, 1);
}


function setGeometry() {
	const showingMinMaxButtons = (UIHacks && UIHacks.FrameStyle) ? true : false;
	geo.aa_shadow = scaleForDisplay(6); // size of albumart shadow
	geo.pause_size = scaleForDisplay(100);

	if (pref.layout_mode === 'default_mode') {
		geo.prog_bar_h = scaleForDisplay(12) + (ww > 1920 ? 2 : 0); // height of progress bar
	} else if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
		geo.prog_bar_h = scaleForDisplay(10) + (ww > 1920 ? 2 : 0); // height of progress bar
	}

	geo.lower_bar_h = scaleForDisplay(120); // height of song title and time + progress bar area
	geo.top_art_spacing = scaleForDisplay(40); // space between top of theme and artwork
	geo.top_bg_h = scaleForDisplay(160 + (showingMinMaxButtons ? 12 : 0)); // height of offset color background
	geo.timeline_h = scaleForDisplay(18); // height of timeline
	geo.metadataGrid_tt_h = scaleForDisplay(100) // height of metadata grid tooltip area
}

var playedTimesRatios = [];

// PATHS
const paths = {};

paths.cdArtWhiteStub = fb.ProfilePath + 'georgia-reborn/images/discart/cd-white.png';
paths.cdArtBlackStub = fb.ProfilePath + 'georgia-reborn/images/discart/cd-black.png';
paths.cdArtBlankStub = fb.ProfilePath + 'georgia-reborn/images/discart/cd-blank.png';
paths.cdArtTransStub = fb.ProfilePath + 'georgia-reborn/images/discart/cd-transparent.png';
paths.vinylArtWhiteStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-white.png';
paths.vinylArtVoidStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-void.png';
paths.vinylArtColdFusionStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-cold-fusion.png';
paths.vinylArtRingOfFireStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-ring-of-fire.png';
paths.vinylArtMapleStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-maple.png';
paths.vinylArtBlackStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-black.png';
paths.vinylArtBlackHoleStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-black-hole.png';
paths.vinylArtEbonyStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-ebony.png';
paths.vinylArtTransStub = fb.ProfilePath + 'georgia-reborn/images/discart/vinyl-transparent.png';
paths.noAlbumArt = fb.ProfilePath + 'georgia-reborn/images/misc/no-cover.png';
paths.lastFmImageRed = fb.ProfilePath + 'georgia-reborn/images/misc/last-fm-red-36.png';
paths.lastFmImageWhite = fb.ProfilePath + 'georgia-reborn/images/misc/last-fm-36.png';
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
	showDrawTiming: false,  	// spam console with draw times
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
var noAlbumArt = gdi.Image(paths.noAlbumArt); // No album art stub image
var noAlbumArtStub = null; // No album art stub
var shadow_image = null; // shadow behind the artwork + discart
var labelShadowImg = null; // shadow behind labels
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
 * @property {MetadataGrid_tt=} metadataGrid_tt MetadataGrid Tooltip object
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
let displayPlaylistArtworkMode = false;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param {GdiGraphics} gr
 */
function draw_ui(gr) {
	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	gr.SetSmoothingMode(SmoothingMode.None);

	// Background
	if (!albumart && noArtwork) { // we use noArtwork to prevent flashing of blue default theme

		if (!displayPlaylist && pref.layout_mode === 'artwork_mode' || !displayLibrary) {
			albumart_size.x = ww; // if there's no album art and no playlist/library, info panel takes up fullscreen
		}
		if (displayPlaylist && pref.layout_mode !== 'artwork_mode' || displayLibrary) {
			albumart_size.x = Math.floor(ww / 2); // if there's no album art and playlist/library is displayed, art info panel takes up 1/2 screen
		}
		albumart_size.w = albumart_size.x;
		albumart_size.y = geo.top_art_spacing;
		albumart_size.h = wh - geo.top_art_spacing - geo.lower_bar_h;
		if (!themeColorSet) {
			pref.whiteTheme ? setTheme(whiteTheme.colors) :
			pref.blackTheme ? setTheme(blackTheme.colors) :
			pref.rebornTheme ? setTheme(rebornTheme.colors) :
			pref.blueTheme ? setTheme(blueTheme.colors) :
			pref.darkblueTheme ? setTheme(darkblueTheme.colors) :
			pref.redTheme ? setTheme(redTheme.colors) :
			pref.creamTheme ? setTheme(creamTheme.colors) :
			pref.nblueTheme ? setTheme(nblueTheme.colors) :
			pref.ngreenTheme ? setTheme(ngreenTheme.colors) :
			pref.nredTheme ? setTheme(nredTheme.colors) :
			pref.ngoldTheme ? setTheme(ngoldTheme.colors) : '';
			if (pref.rebornTheme) initTheme();
			themeColorSet = true;
		}
	}
	gr.FillSolidRect(0, 0, ww, wh, col.bg);
	if ((fb.IsPaused || fb.IsPlaying) && (!albumart && cdart)) {
		// info grid background drawn here before cdArt if no albumArt
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.primary);
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
	}

	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	var textLeft = scaleForDisplay(40);

	// BIG ALBUMART
	if (fb.IsPlaying) {
		let drawArt = null;
		if (timings.showExtraDrawTiming) {
			drawArt = fb.CreateProfiler('on_paint -> artwork');
		}
		if (cdart && !rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart) {
			CreateRotatedCDImage();
		}
		if ((!pref.blackTheme || !pref.nblueTheme || !pref.ngreenTheme || !pref.nredTheme || !pref.ngoldTheme) && albumart && (albumart_scaled || rotatedCD) && pref.layout_mode !== 'artwork_mode') {
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
	if (fb.IsPlaying && (albumart || !cdart || !albumart && cdart) && ((!displayLibrary && !displayPlaylist) || !settings.hidePanelBgWhenCollapsed)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, pref.layout_mode === 'artwork_mode' ? g_pl_colors.background : col.primary); // info background -- must be drawn after shadow

		if (!cdart) {
			if (pref.no_cdartBG) {
				if (albumart) {
					gr.FillSolidRect(ww - albumart_size.x - (pref.layout_mode === 'artwork_mode' ? 0 : 1), albumart_size.y, albumart_size.x + (pref.layout_mode === 'artwork_mode' ? 0 : 1), albumart_size.h, pref.layout_mode === 'artwork_mode' ? g_pl_colors.background : col.primary);
				}
			}
		}
		if (!pref.display_cdart) {
			if (albumart) {
				gr.FillSolidRect(ww - albumart_size.x - (pref.layout_mode === 'artwork_mode' ? 0 : 1), albumart_size.y, albumart_size.x + (pref.layout_mode === 'artwork_mode' ? 0 : 1), albumart_size.h, pref.layout_mode === 'artwork_mode' ? g_pl_colors.background : col.primary);
			}
		}

		if (pref.whiteTheme && (isStreaming && noArtwork || !albumart && noArtwork) && pref.layout_mode !== 'artwork_mode') {
			// Info background top shadow
			gr.FillGradRect(0, geo.top_art_spacing  - (is_4k ? 10 : 6), displayLibrary ? ww / 2 : ww, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24));
			// Info background bottom shadow
			gr.FillGradRect(0, wh - geo.lower_bar_h - (is_4k ? -1 : 1), displayLibrary ? ww / 2 : ww, scaleForDisplay(5), 90, RGBtoRGBA(col.shadow, 18), RGBtoRGBA(col.shadow, 0));
		}
		if (pref.layout_mode === 'artwork_mode' && !displayBiography) {
			if (pref.whiteTheme) {
				// Info background top shadow
				gr.FillGradRect(0, geo.top_art_spacing  - (is_4k ? 10 : 6), displayLibrary ? ww / 2 : ww, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24));
				// Info background bottom shadow
				gr.FillGradRect(0, wh - geo.lower_bar_h - (is_4k ? -1 : 1), displayLibrary ? ww / 2 : ww, scaleForDisplay(5), 90, RGBtoRGBA(col.shadow, 18), RGBtoRGBA(col.shadow, 0));
			} else {
				// Info background top shadow
				gr.FillGradRect(0, geo.top_art_spacing - (is_4k ? 10 : 6), ww, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 40));
				// Info background bottom shadow
				gr.FillGradRect(0, wh - geo.lower_bar_h - (is_4k ? -1 : 1), ww, scaleForDisplay(5), 90, RGBtoRGBA(col.shadow, 30), RGBtoRGBA(col.shadow, 0));
			}
		}
		if ((pref.blackTheme || pref.rebornTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) && (isStreaming && noArtwork || !albumart && noArtwork) && pref.layout_mode !== 'artwork_mode') {
			// Info background top shadow
			gr.FillGradRect(0, albumart_size.y - (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? (is_4k ? 8 : 6) : (is_4k ? 10 : 6)), displayLibrary ? ww / 2 : ww, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0),
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 180) : ''
			);
			// Info background bottom shadow
			gr.FillGradRect(0, albumart_size.y + albumart_size.h - (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? (is_4k ? 0 : 1) : (is_4k ? -1 : 1)), displayLibrary ? ww / 2 : ww, scaleForDisplay(5), 90,
				pref.blackTheme ? RGBtoRGBA(col.shadow, 80) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 30) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 34) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 60) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : '',
				RGBtoRGBA(col.shadow, 0)
			);
		}
		if ((isStreaming && noArtwork || !albumart && noArtwork)) {
			gr.FillSolidRect(0, geo.top_art_spacing, ww, wh - geo.top_art_spacing - geo.lower_bar_h, g_pl_colors.background); // Info background -- must be drawn after shadow
		}
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}

	// noAlbumArtStub if no album cover exist
	if (!albumart && noArtwork && (fb.IsPlaying || fb.IsPaused)) {
		noAlbumArtStub = true;
		if (!isStreaming || isStreaming && (displayPlaylist || displayLibrary) || isStreaming && !displayPlaylistArtworkMode && pref.layout_mode === 'artwork_mode') {
			albumart = null;
			artCache.clear();
			cdartArray = [];
			cdart = null;

			albumart_size.x =
			pref.layout_mode === 'default_mode' ? displayPlaylist || displayLibrary ? 0 : ww / 2 :
			pref.layout_mode === 'artwork_mode' ? !displayPlaylist ? 0 : ww : 0;

			albumart_size.w =
			pref.layout_mode === 'default_mode' ? displayPlaylist || displayLibrary ? albumart_size.w : albumart_size.w / 2 :
			pref.layout_mode === 'artwork_mode' ? displayPlaylist ? ww : ww : 0;
		}
		if (!isStreaming || isStreaming && (displayPlaylist || !displayPlaylistArtworkMode || displayLibrary)) {
			gr.FillSolidRect(albumart_size.x, geo.top_art_spacing, albumart_size.w, albumart_size.h - 1, g_pl_colors.background);
			gr.DrawImage(noAlbumArt, albumart_size.x, geo.top_art_spacing, albumart_size.w, albumart_size.h, 0, 0, noAlbumArt.Width, noAlbumArt.Height);
			if (pref.displayLyrics && fb.IsPlaying) {
				gr.FillSolidRect(albumart_size.x - 1, albumart_size.y, albumart_size.w + 1, albumart_size.h,
					pref.whiteTheme || pref.rebornTheme || pref.creamTheme ? RGB(120, 120, 120) :
					pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.background : ''
				);
				gLyrics && gLyrics.drawLyrics(gr);
			}
		}
		if (pref.layout_mode !== 'artwork_mode' && !isStreaming && !displayPlaylist && !displayLibrary) {
			// Info background left shadow
			gr.FillGradRect(ww / 2 - 4, geo.top_art_spacing, 4, wh - geo.top_art_spacing - geo.lower_bar_h, 0, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 38) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 60) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 64) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 28) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
			);
		}
	} else {
		noAlbumArtStub = false;
	}
	if (pref.show_pause) {
		if (fb.IsPaused) {
			pauseBtn.draw(gr);
		}
	}

	// flag info grid
	if (pref.layout_mode === 'default_mode' || pref.layout_mode === 'artwork_mode') {
		var textLeft = scaleForDisplay(40);
		if (str.artist) {
			var availableWidth = displayPlaylist || displayLibrary ? Math.min(ww / 2 - 20, btns.playlist.x - textLeft) : btns.playlist.x - textLeft;
			var artistFont = chooseFontForWidth(gr, availableWidth, str.artist, [ft.artist_lrg, ft.artist_med, ft.artist_sml]);
			const height = gr.CalcTextHeight(str.artist, artistFont);
			const width = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
			var artistY = wh - geo.lower_bar_h + scaleForDisplay(2);
			if (pref.layout_mode === 'default_mode' && (!displayPlaylist && !displayLibrary && pref.show_artistInGrid || ((displayPlaylist || displayLibrary) && !albumart && pref.show_artistInGrid)) ||
			   (pref.layout_mode === 'artwork_mode' && displayPlaylist && !albumart && pref.show_artistInGrid) &&
				pref.show_flags_details && flagImgs.length && width + flagImgs[0].Width * flagImgs.length) {
				var flagsLeft = textLeft;
				var top = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + scaleForDisplay(33);
				for (let i = 0; i < flagImgs.length; i++) {
					gr.DrawImage(flagImgs[i], flagsLeft,
					// Flag Y-Coordinates
					 pref.album_font_size === 24 ? top + (is_4k ? 3 : 1) :
					 pref.album_font_size === 22 ? top + (is_4k ? 2 : 1) :
					 pref.album_font_size === 20 ? top + (is_4k ? 1 : 0) :
					 pref.album_font_size === 18 ? top + (is_4k ? 1 : 0) :
					 pref.album_font_size === 16 ? top + (is_4k ? 0 : 0) :
					 pref.album_font_size === 14 ? top + (is_4k ? 1 : 0) :
					 pref.album_font_size === 13 ? top - (is_4k ? 0 : 1) :
					 pref.album_font_size === 12 ? top - (is_4k ? 1 : 1) :
					 pref.album_font_size === 11 ? top - (is_4k ? 1 : 1) :
					top, flagImgs[i].Width - scaleForDisplay(28) + scaleForDisplay(pref.album_font_size), flagImgs[i].Height - scaleForDisplay(28) + scaleForDisplay(pref.album_font_size), 0, 0, flagImgs[i].Width, flagImgs[i].Height),
					flagsLeft += flagImgs[i].Width - scaleForDisplay(20) + scaleForDisplay(pref.album_font_size);
					// Maximum 3 flags
					if (i > 1) break;
				}
			}
		}
	}

	// text info grid
	if (((!displayPlaylist && !displayLibrary || !displayPlaylistArtworkMode && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		let drawTextGrid = null;
		if (timings.showExtraDrawTiming) drawTextGrid = fb.CreateProfiler('on_paint -> textGrid');
		let gridSpace = 0;
		let textRight = scaleForDisplay(20);
		if (!albumart && cdart) {
			gridSpace = Math.round(cdart_size.x - geo.aa_shadow - textLeft - textRight);
		} else {
			gridSpace = Math.round(albumart_size.x - geo.aa_shadow - textLeft - textRight);
		}
		const text_width = gridSpace;

		var c = new Color(pref.layout_mode === 'artwork_mode' ? g_pl_colors.background : col.primary);
		if (c.brightness > 130) {
			col.info_text = rgb(55, 55, 55);
			if (pref.rebornTheme) col.info_text = col.superDarkAccent;
		} else {
			col.info_text = rgb(255, 255, 255);
			if (pref.rebornTheme) col.info_text = !albumart ? rgb(120, 120, 120) : col.maxLightAccent;
		}
		if ((pref.layout_mode === 'artwork_mode' && (pref.whiteTheme || pref.creamTheme) || pref.whiteTheme && isStreaming || pref.whiteTheme && !albumart) || pref.creamTheme && isStreaming || pref.creamTheme && !albumart) {
			col.info_text = rgb(120, 120, 120);
		}
		if (pref.layout_mode === 'artwork_mode' && c.brightness > 130 && (pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme)) {
			col.info_text = rgb(220, 220, 220);
		}

		var top = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + scaleForDisplay(68);
		if (gridSpace > 120) {
			/** @type {MeasureStringInfo} */
			let txtRec;
			let artist_txtRec;
			let title_txtRec;

			function drawArtist(top) {
				if (!str.artist) return 0;
				ft.artist = ft.album_lrg;

				const flagSize =
				pref.album_font_size === 24 ? flagImgs.length >= 3 ? '                 ' : flagImgs.length === 2 ? '            ' : '      ' :
				pref.album_font_size === 22 ? flagImgs.length >= 3 ? '                 ' : flagImgs.length === 2 ? '            ' : '      ' :
				pref.album_font_size === 20 ? flagImgs.length >= 3 ? '                  ' : flagImgs.length === 2 ? '            ' : '      ' :
				pref.album_font_size === 18 ? flagImgs.length >= 3 ? '                  ' : flagImgs.length === 2 ? '             ' : '      ' :
				pref.album_font_size === 16 ? flagImgs.length >= 3 ? '                   ' : flagImgs.length === 2 ? '             ' : '      ' :
				pref.album_font_size === 14 ? flagImgs.length >= 3 ? '                    ' : flagImgs.length === 2 ? '              ' : '      ' :
				pref.album_font_size === 13 ? flagImgs.length >= 3 ? '                     ' : flagImgs.length === 2 ? '              ' : '      ' :
				pref.album_font_size === 12 ? flagImgs.length >= 3 ? '                      ' : flagImgs.length === 2 ? '               ' : '      ' :
				pref.album_font_size === 11 ? flagImgs.length >= 3 ? '                       ' : flagImgs.length === 2 ? '               ' : '      ' : '';

				if (pref.show_flags_details && flagImgs.length) {
					artist_txtRec = gr.MeasureString(str.artist, ft.artist, 0, 0, text_width - flagsLeft, wh);
				} else {
					artist_txtRec = gr.MeasureString(str.artist, ft.artist, 0, 0, text_width, wh);
				}

				const numLines = Math.min(2, artist_txtRec.Lines);
				const height = gr.CalcTextHeight(str.artist, ft.artist) * numLines + 3;

				if (is_4k) {
					gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				} else {
					gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit); // thicker fonts can use anti-alias
				}
				if (pref.show_flags_details && flagImgs.length) {
					gr.DrawString(flagSize + str.artist, ft.artist, col.info_text, textLeft, top, text_width, height, g_string_format.trim_ellipsis_char);
				} else {
					gr.DrawString(str.artist, ft.artist, col.info_text, textLeft, top, text_width, height, g_string_format.trim_ellipsis_char);
				}

				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				return height + (is_4k ? 17 : 7);
			}

			top += geo.timeline_h - scaleForDisplay(15);

			function drawTitle(top) {
				if (!str.title) return 0;
				ft.title = ft.title_lrg;
				ft.tracknum = ft.tracknum_lrg;
				let title_spacing = scaleForDisplay(6);
				var trackNumWidth = 0;
				if (str.tracknum) {
					trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
				}
				title_txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);

				const tracknumHeight = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Height;
				const heightAdjustment = Math.ceil((tracknumHeight - gr.MeasureString(str.title, ft.title, 0, 0, 0, 0).Height) / 2);
				const numLines = Math.min(2, title_txtRec.Lines);
				const height = gr.CalcTextHeight(str.title, ft.title) * numLines + 3;

				trackNumWidth = Math.ceil(trackNumWidth);
				//gr.DrawString(str.tracknum, ft.tracknum, col.info_text, title_txtRec.Lines > 1 ? textLeft - scaleForDisplay(32) : textLeft, top - heightAdjustment + 1, trackNumWidth, height);
				if (is_4k) {
					gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				} else {
					gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit); // thicker fonts can use anti-alias
				}
				gr.DrawString(isStreaming ? str.tracknum + str.title : str.tracknum + ' ' + str.title, ft.title, col.info_text, textLeft, top, text_width, height, g_string_format.trim_ellipsis_char);

				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				return height + (is_4k ? 17 : 7);
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
				// Add other working antialiasing on smaller font sizes in FHD
				if (!is_4k && pref.album_font_size < 18) {
					gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
				} else {
					gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				}
				var subtitlefont_array = [ft.album_substitle_lrg, ft.album_substitle_med, ft.album_substitle_sml];
				height = drawMultipleLines(gr, text_width, textLeft, top, col.info_text, str.album, font_array,
					str.album_subtitle, subtitlefont_array, maxLines);
				return height + scaleForDisplay(10);
			}

			if (pref.show_artistInGrid) {
				top += drawArtist(top);
			}
			if (pref.show_titleInGrid) {
				top += drawTitle(top);
			} else if (!pref.show_artistInGrid) {
				top += drawAlbumTitle(top, 3);
			}
			// Timeline playcount bars
			if (fb.IsPlaying && str.timeline) {
				str.timeline.setSize(0, top + scaleForDisplay(4), albumart_size.x);
				str.timeline.draw(gr);
			}
			// Metadata grid tooltip
			if (fb.IsPlaying && str.metadataGrid_tt) {
				str.metadataGrid_tt.setSize(0, geo.top_art_spacing, albumart_size.x);
				str.metadataGrid_tt.draw(gr);
			}
			top += geo.timeline_h + scaleForDisplay(18);
			if (pref.show_artistInGrid || pref.show_titleInGrid) {
				top += drawAlbumTitle(top, 2);
			}

			// Tag grid
			var font_array = [ft.grd_key_lrg, ft.grd_key_med, ft.grd_key_sml];
			var key_font_array = [ft.grd_val_lrg, ft.grd_val_med, ft.grd_val_sml];
			let grid_key_ft = ft.grd_key_lrg;
			str.grid.forEach((el) => {
				if (font_array.length > 1) {	// only check if there's more than one entry in font_array
					grid_key_ft = chooseFontForWidth(gr, text_width / 3, el, font_array);
					while (grid_key_ft !== font_array[0]) { // if font returned was first item in the array, then everything fits, otherwise pare down array
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
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top + border_w, col2_width + scaleForDisplay(2), cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top + border_w, col2_width + scaleForDisplay(2), cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top - border_w, col2_width + scaleForDisplay(2), cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top - border_w, col2_width + scaleForDisplay(2), cell_height, StringFormat(0, 0, 4));
						}
						gr.DrawString(key, grid_key_ft, col.info_text, textLeft, top, col1_width, cell_height, g_string_format.trim_ellipsis_char); // key
						gr.DrawString(value, grid_val_ft, grid_val_col, col2_left, top, col2_width + scaleForDisplay(2), cell_height, StringFormat(0, 0, 4));

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

	if ((fb.IsPlaying && (!displayPlaylist && pref.layout_mode === 'default_mode') && !displayLibrary) || (!albumart && !cdart && noArtwork && !displayPlaylist && pref.layout_mode === 'default_mode')) {
		let drawLogos = null;
		timings.showExtraDrawTiming && (drawLogos = fb.CreateProfiler('on_paint -> logos/labels'));
		// BAND LOGO drawing code
		const brightBackground = (new Color(col.primary).brightness) > 190;
		const availableSpace = albumart_size.y + albumart_size.h - top;
		var logo = brightBackground ? (invertedBandLogo ? invertedBandLogo : bandLogo) : pref.invertedBand ? invertedBandLogo : bandLogo;
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
			const labels = brightBackground && !pref.labelArtOnBg ? (recordLabelsInverted.length ? recordLabelsInverted : recordLabels) : pref.invertedLabel ? recordLabelsInverted : recordLabels;
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
					if (!pref.no_cdartBG) {
						if (!pref.blackTheme || !pref.nblueTheme || !pref.ngreenTheme || !pref.nredTheme || !pref.ngoldTheme) {
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
				} else if (pref.no_cdartBG && !pref.display_cdart) {
					gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.aa_shadow, topEdge - 20 - geo.aa_shadow, ww - labelX + leftEdgeWidth + 2 * geo.aa_shadow, labelHeight + 40 + 2 * geo.aa_shadow,
						0, 0, labelShadowImg.Width, labelShadowImg.Height);
				}
				if (pref.no_cdartBG && pref.display_cdart && cdart) {
					if (!pref.blackTheme || !pref.nblueTheme || !pref.ngreenTheme || !pref.nredTheme || !pref.ngoldTheme) {
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
		var lowerBarTop = wh - geo.lower_bar_h + (is_4k ? 65 : 35);
	} else if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
		var lowerBarTop = wh - geo.lower_bar_h + (is_4k ? 33 : 18);
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
			playlist.on_paint(gr);
			timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
		}
		else if (displayLibrary) {
			let drawLibraryProfiler = null;
			timings.showExtraDrawTiming && (drawLibraryProfiler = fb.CreateProfiler('on_paint -> library'));
			libraryPanel.on_paint(gr);
			drawLibraryProfiler && drawLibraryProfiler.Print();
		}
		if (displayBiography) {
			let drawBiographyProfiler = null;
			timings.showExtraDrawTiming && (drawBiographyProfiler = fb.CreateProfiler('on_paint -> biography'));
			biographyPanel.on_paint(gr);
			drawBiographyProfiler && drawBiographyProfiler.Print();
		}
	} else if (pref.layout_mode === 'artwork_mode') {
		if (displayPlaylistArtworkMode) {
			let drawPlaylistProfiler = null;
			timings.showExtraDrawTiming && (drawPlaylistProfiler = fb.CreateProfiler('on_paint -> playlist'));
			playlist.on_paint(gr);
			timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
		}
		else if (displayLibrary) {
			let drawLibraryProfiler = null;
			timings.showExtraDrawTiming && (drawLibraryProfiler = fb.CreateProfiler('on_paint -> library'));
			libraryPanel.on_paint(gr);
			drawLibraryProfiler && drawLibraryProfiler.Print();
		}
		if (displayBiography) {
			let drawBiographyProfiler = null;
			timings.showExtraDrawTiming && (drawBiographyProfiler = fb.CreateProfiler('on_paint -> biography'));
			biographyPanel.on_paint(gr);
			drawBiographyProfiler && drawBiographyProfiler.Print();
		}
	}
	else if (pref.layout_mode === 'compact_mode') {
		if (displayPlaylist) {
			let drawPlaylistProfiler = null;
			timings.showExtraDrawTiming && (drawPlaylistProfiler = fb.CreateProfiler('on_paint -> playlist'));
			gr.FillSolidRect(0, 0, ww, wh, col.bg); // Hide artwork cover when switching to Playlist mode & Playlist mode 'Player size Large'
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

	// Lower bar flag, artist, title
	if (pref.layout_mode === 'default_mode') {
		// Add other working antialiasing on smaller font sizes in FHD
		if (!is_4k && pref.lower_bar_font_size_default < 18) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		} else {
			gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		}

		var ft_lower_bold = ft.lower_bar_bold;
		var ft_lower = ft.lower_bar;
		var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
		var titleMeasurements = gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0);
		var heightAdjustment = is_4k ? 1 : 0;

		const lowerMargin_default = scaleForDisplay(80); // 40px left + 40px right
		const flagSize = flagImgs.length >= 3 ? scaleForDisplay(42) + scaleForDisplay(pref.lower_bar_font_size_default * 3) : flagImgs.length === 2 ? scaleForDisplay(28) + scaleForDisplay(pref.lower_bar_font_size_default * 2) : scaleForDisplay(14) + scaleForDisplay(pref.lower_bar_font_size_default);

		// Calculate all transport buttons width
		const buttonSize_default = scaleForDisplay(pref.transport_buttons_size_default);
		const count = 4 + (transport.show_playbackOrder_default ? 1 : 0) + (transport.show_reload_default ? 1 : 0) + (transport.show_volume_default ? 1 : 0);
		const w = buttonSize_default;
		const p = scaleForDisplay(pref.transport_buttons_spacing_default);

		// Setup width for artist and song title
		const availableWidth = transport.enableTransportControls_default ? Math.min(ww / 2 - ((w * count) + (p * count) / 2) - (pref.show_flags_lowerbar && flagImgs.length ? flagSize : 0)) : Math.min(ww - lowerMargin_default - (pref.show_flags_lowerbar && flagImgs.length ? flagSize : 0) - timeAreaWidth);
		const artistMaxWidth = (pref.show_artist_default || pref.show_title_default) && transport.enableTransportControls_default ? availableWidth : Math.min(ww - lowerMargin_default - trackNumWidth - timeAreaWidth);
		const titleMaxWidth =  (pref.show_artist_default || pref.show_title_default) && transport.enableTransportControls_default ? availableWidth : Math.min(ww - lowerMargin_default - trackNumWidth - timeAreaWidth);

		// Measure width and height for artist, orig artist and song title
		const artistWidth = gr.MeasureString(str.artist, ft_lower_bold, 0, 0, artistMaxWidth, 0).Width;
		const artistHeight = gr.CalcTextHeight(str.artist, ft_lower_bold);
		const titleWidth = gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, titleMaxWidth, 0).Width;
		const titleHeight = gr.CalcTextHeight(str.title_lower, ft_lower);
		const artistTitleWidth = gr.MeasureString(str.artist, ft_lower_bold, 0, 0, 0, 0).Width + gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(str.original_artist, ft_lower, 0, 0, 0, 0).Width;

		if (artistTitleWidth > availableWidth) { // Two lines

			if (pref.show_flags_lowerbar && flagImgs.length && artistWidth + flagImgs[0].Width * flagImgs.length && pref.show_artist_default && pref.show_title_default) { // Two lines flag position
				var flagsLeft = textLeft - (is_4k ? 1 : 0);
				for (let i = 0; i < flagImgs.length; i++) {
					gr.DrawImage(flagImgs[i], flagsLeft,
					// Flag Y-Coordinates
					 pref.lower_bar_font_size_default === 24 ? Math.round(artistY + (is_4k ? 15 : 8)  + artistHeight / 2 - flagImgs[i].Height / 2) : 0 +
					 pref.lower_bar_font_size_default === 22 ? Math.round(artistY + (is_4k ? 20 : 11) + artistHeight / 2 - flagImgs[i].Height / 2) : 0 +
					 pref.lower_bar_font_size_default === 20 ? Math.round(artistY + (is_4k ? 23 : 13) + artistHeight / 2 - flagImgs[i].Height / 2) : 0 +
					 pref.lower_bar_font_size_default === 18 ? Math.round(artistY + (is_4k ? 29 : 16) + artistHeight / 2 - flagImgs[i].Height / 2) : 0 +
					 pref.lower_bar_font_size_default === 16 ? Math.round(artistY + (is_4k ? 33 : 18) + artistHeight / 2 - flagImgs[i].Height / 2) : 0,
					flagImgs[i].Width + scaleForDisplay(pref.lower_bar_font_size_default) - scaleForDisplay(26), flagImgs[i].Height + scaleForDisplay(pref.lower_bar_font_size_default) - scaleForDisplay(26), 0, 0, flagImgs[i].Width, flagImgs[i].Height),
					flagsLeft += flagImgs[i].Width - scaleForDisplay(20) + scaleForDisplay(pref.lower_bar_font_size_default);
					// Maximum 3 flags
					if (i > 1) break;
				}
			} else { // On two lines -> one line flag position
				if (pref.show_flags_lowerbar && flagImgs.length && artistWidth + flagImgs[0].Width * flagImgs.length && pref.show_artist_default && pref.show_title_default < availableWidth) {
					var flagsLeft = textLeft - (is_4k ? 1 : 0);
					for (let i = 0; i < flagImgs.length; i++) {
						gr.DrawImage(flagImgs[i], flagsLeft, Math.round(lowerBarTop - (flagImgs[i].Height / artistHeight)),
						flagImgs[i].Width + scaleForDisplay(pref.lower_bar_font_size_default) - scaleForDisplay(26), flagImgs[i].Height + scaleForDisplay(pref.lower_bar_font_size_default) - scaleForDisplay(26), 0, 0, flagImgs[i].Width, flagImgs[i].Height),
						flagsLeft += flagImgs[i].Width - scaleForDisplay(20) + scaleForDisplay(pref.lower_bar_font_size_default);
						// Maximum 3 flags
						if (i > 1) break;
					}
				}
			}
			gr.DrawString(pref.show_artist_default ? str.artist : '', ft_lower_bold, col.artist, textLeft +
			// Artist X-Coordinates
			 (pref.lower_bar_font_size_default === 24 && pref.show_flags_lowerbar && flagImgs.length ? flagSize + scaleForDisplay(5)  : pref.lower_bar_font_size_default === 24 && !pref.show_flags_lowerbar ? 0 : 0) +
			 (pref.lower_bar_font_size_default === 22 && pref.show_flags_lowerbar && flagImgs.length ? flagSize + scaleForDisplay(3)  : pref.lower_bar_font_size_default === 22 && !pref.show_flags_lowerbar ? 0 : 0) +
			 (pref.lower_bar_font_size_default === 20 && pref.show_flags_lowerbar && flagImgs.length ? flagSize + scaleForDisplay(1)  : pref.lower_bar_font_size_default === 20 && !pref.show_flags_lowerbar ? 0 : 0) +
			 (pref.lower_bar_font_size_default === 18 && pref.show_flags_lowerbar && flagImgs.length ? flagSize + scaleForDisplay(0)  : pref.lower_bar_font_size_default === 18 && !pref.show_flags_lowerbar ? 0 : 0) +
			 (pref.lower_bar_font_size_default === 16 && pref.show_flags_lowerbar && flagImgs.length ? flagSize + scaleForDisplay(-2) : pref.lower_bar_font_size_default === 16 && !pref.show_flags_lowerbar ? 0 : 0),
			// Artist Y-Coordinates
			 pref.show_artist_default && !pref.show_title_default ? lowerBarTop + heightAdjustment :
			 (pref.lower_bar_font_size_default === 24 ? lowerBarTop - scaleForDisplay(25) + heightAdjustment : 0) +
			 (pref.lower_bar_font_size_default === 22 ? lowerBarTop - scaleForDisplay(23) + heightAdjustment : 0) +
			 (pref.lower_bar_font_size_default === 20 ? lowerBarTop - scaleForDisplay(22) + heightAdjustment : 0) +
			 (pref.lower_bar_font_size_default === 18 ? lowerBarTop - scaleForDisplay(20) + heightAdjustment : 0) +
			 (pref.lower_bar_font_size_default === 16 ? lowerBarTop - scaleForDisplay(19) + heightAdjustment : 0),
			availableWidth, artistHeight, g_string_format.trim_ellipsis_char);

			gr.DrawString(pref.show_title_default || !pref.show_title_default && !fb.IsPlaying ? str.tracknum : '', ft_lower, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop, trackNumWidth - timeAreaWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(pref.show_title_default || !pref.show_title_default && !fb.IsPlaying ? pref.show_composer && fb.IsPlaying ? str.title_lower + str.original_artist + str.composer : str.title_lower : '', ft_lower, col.now_playing, trackNumWidth > 0 ? progressBar.x - scaleForDisplay(4) + trackNumWidth : progressBar.x - (is_4k ? 1 : 0) - scaleForDisplay(11), lowerBarTop, availableWidth, titleHeight, g_string_format.trim_ellipsis_char);

		} else { // One line
			if (pref.show_artist_default && pref.show_flags_lowerbar && flagImgs.length && artistWidth + flagImgs[0].Width * flagImgs.length < availableWidth) {
				var flagsLeft = textLeft - (is_4k ? 1 : 0);
				for (let i = 0; i < flagImgs.length; i++) {
					gr.DrawImage(flagImgs[i], flagsLeft, Math.round(lowerBarTop - (flagImgs[i].Height / artistHeight)),
					flagImgs[i].Width + scaleForDisplay(pref.lower_bar_font_size_default) - scaleForDisplay(26), flagImgs[i].Height + scaleForDisplay(pref.lower_bar_font_size_default) - scaleForDisplay(26), 0, 0, flagImgs[i].Width, flagImgs[i].Height),
					flagsLeft += flagImgs[i].Width - scaleForDisplay(20) + scaleForDisplay(pref.lower_bar_font_size_default);
					// Maximum 3 flags
					if (i > 1) break;
				}
			}
			gr.DrawString(pref.show_artist_default ? str.artist : '', ft_lower_bold, col.artist, textLeft + (pref.show_flags_lowerbar && flagImgs.length ? flagSize + 2 : 0) - scaleForDisplay(1), lowerBarTop + heightAdjustment, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
			gr.DrawString(pref.show_title_default || !pref.show_title_default && !fb.IsPlaying ? str.tracknum : '', ft_lower, col.now_playing, pref.show_artist_default ? fb.IsPlaying ? progressBar.x + (pref.show_flags_lowerbar && flagImgs.length ? flagSize + artistWidth + scaleForDisplay(9) : is_4k ? artistWidth + 16 : artistWidth + 7) : progressBar.x : progressBar.x, lowerBarTop, trackNumWidth - timeAreaWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(pref.show_title_default || !pref.show_title_default && !fb.IsPlaying ? pref.show_composer && fb.IsPlaying ? str.title_lower + str.composer : str.title_lower : '', ft_lower, col.now_playing, pref.show_artist_default ? progressBar.x + (pref.show_flags_lowerbar && flagImgs.length ? is_4k ? flagSize + trackNumWidth + artistWidth : flagSize + trackNumWidth + artistWidth + scaleForDisplay(1) : trackNumWidth + artistWidth - scaleForDisplay(1)) + (is_4k ? 2 : 0) : progressBar.x + trackNumWidth - scaleForDisplay(1) + (is_4k ? 2 : 0), lowerBarTop, fb.IsPlaying ? availableWidth : ww, titleHeight, g_string_format.trim_ellipsis_char);
		}

	} else if (pref.layout_mode === 'artwork_mode') {
		// Add other working antialiasing on smaller font sizes in FHD
		if (!is_4k && (pref.lower_bar_font_size_artwork) < 18) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		} else {
			gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		}

		var ft_lower_bold = ft.lower_bar_bold;
		var ft_lower = ft.lower_bar;
		var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
		var titleMeasurements = gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0);
		var heightAdjustment = is_4k ? 1 : 0;

		const textLeftArtwork = scaleForDisplay(20);
		const lowerMargin_artwork = scaleForDisplay(40); // 20px left + 20px right
		const flagSize = flagImgs.length >= 3 ? scaleForDisplay(42) + scaleForDisplay(pref.lower_bar_font_size_artwork * 3) : flagImgs.length === 2 ? scaleForDisplay(28) + scaleForDisplay(pref.lower_bar_font_size_artwork * 2) : scaleForDisplay(14) + scaleForDisplay(pref.lower_bar_font_size_artwork);

		// Setup width for artist and song title
		const availableWidth = Math.min(ww - lowerMargin_artwork - (pref.show_flags_lowerbar && flagImgs.length ? flagSize : 0) - timeAreaWidth - scaleForDisplay(20));
		const artistMaxWidth = Math.min(ww - lowerMargin_artwork - timeAreaWidth);
		const titleMaxWidth =  Math.min(ww - lowerMargin_artwork - trackNumWidth - timeAreaWidth - scaleForDisplay(20));

		// Measure width and height for artist, orig artist and song title
		const artistWidth = gr.MeasureString(str.artist, ft_lower_bold, 0, 0, artistMaxWidth, 0).Width;
		const artistHeight = gr.CalcTextHeight(str.artist, ft_lower_bold);
		const titleWidth = gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, titleMaxWidth, 0).Width;
		const titleHeight = gr.CalcTextHeight(str.title_lower, ft_lower);
		const artistTitleWidth = gr.MeasureString(str.artist, ft_lower_bold, 0, 0, 0, 0).Width + gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(str.original_artist, ft_lower, 0, 0, 0, 0).Width;

		if (artistTitleWidth < availableWidth) { // Artist + title displayed if space available
			if (pref.show_artist_artwork && pref.show_flags_lowerbar && flagImgs.length && artistWidth + flagImgs[0].Width * flagImgs.length < availableWidth) {
				var flagsLeft = textLeftArtwork - (is_4k ? 1 : 0);
				for (let i = 0; i < flagImgs.length; i++) {
					gr.DrawImage(flagImgs[i], flagsLeft, Math.round(lowerBarTop - (flagImgs[i].Height / artistHeight)),
					flagImgs[i].Width + scaleForDisplay(pref.lower_bar_font_size_artwork) - scaleForDisplay(26), flagImgs[i].Height + scaleForDisplay(pref.lower_bar_font_size_artwork) - scaleForDisplay(26), 0, 0, flagImgs[i].Width, flagImgs[i].Height),
					flagsLeft += flagImgs[i].Width - scaleForDisplay(20) + scaleForDisplay(pref.lower_bar_font_size_artwork);
					// Maximum 3 flags
					if (i > 1) break;
				}
			}
			gr.DrawString(pref.show_artist_artwork ? str.artist : '', ft_lower_bold, col.artist, textLeftArtwork + (pref.show_flags_lowerbar && flagImgs.length ? flagSize + 2 : 0) - scaleForDisplay(1), lowerBarTop + heightAdjustment, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
			gr.DrawString(pref.show_title_artwork || !pref.show_title_artwork && !fb.IsPlaying ? str.tracknum : '', ft_lower, col.now_playing, pref.show_artist_artwork ? fb.IsPlaying ? progressBar.x + (pref.show_flags_lowerbar && flagImgs.length ? flagSize + artistWidth + scaleForDisplay(9) : is_4k ? artistWidth + 16 : artistWidth + 7) : progressBar.x : progressBar.x, lowerBarTop, trackNumWidth - timeAreaWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(pref.show_title_artwork || !pref.show_title_artwork && !fb.IsPlaying ? pref.show_composer && fb.IsPlaying ? str.title_lower + str.composer : str.title_lower : '', ft_lower, col.now_playing, pref.show_artist_artwork ? progressBar.x + (pref.show_flags_lowerbar && flagImgs.length ? is_4k ? flagSize + trackNumWidth + artistWidth : flagSize + trackNumWidth + artistWidth + scaleForDisplay(1) : trackNumWidth + artistWidth - scaleForDisplay(1)) + (is_4k ? 2 : 0) : progressBar.x + trackNumWidth - scaleForDisplay(1) + (is_4k ? 2 : 0), lowerBarTop, fb.IsPlaying ? availableWidth : ww, titleHeight, g_string_format.trim_ellipsis_char);
		}
		else { // Artist hidden if too long
			gr.DrawString(pref.show_artist_artwork && !pref.show_title_artwork ? str.artist : '', ft_lower_bold, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop + heightAdjustment, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
			gr.DrawString(pref.show_title_artwork  || !pref.show_title_artwork && !fb.IsPlaying ? str.tracknum : '', ft_lower, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop, fb.IsPlaying ? trackNumWidth - timeAreaWidth : trackNumWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(pref.show_title_artwork  || !pref.show_title_artwork && !fb.IsPlaying ? pref.show_composer && fb.IsPlaying ? str.title_lower + str.original_artist + str.composer : str.title_lower : '', ft_lower, col.now_playing, progressBar.x + trackNumWidth + (is_4k ? 4 : 0), lowerBarTop, fb.IsPlaying ? availableWidth : ww, titleHeight, g_string_format.trim_ellipsis_char);
		}
	} else if (pref.layout_mode === 'compact_mode') {
		// Add other working antialiasing on smaller font sizes in FHD
		if (!is_4k && (pref.lower_bar_font_size_compact) < 18) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		} else {
			gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		}

		var ft_lower_bold = ft.lower_bar_bold;
		var ft_lower = ft.lower_bar;
		var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
		var titleMeasurements = gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0);
		var heightAdjustment = is_4k ? 1 : 0;

		const lowerMargin_compact = scaleForDisplay(40); // 20px left + 20px right

		// Setup width for artist and song title
		const availableWidth = Math.min(ww - lowerMargin_compact - timeAreaWidth - scaleForDisplay(20));
		const artistMaxWidth = Math.min(ww - lowerMargin_compact - timeAreaWidth);
		const titleMaxWidth =  Math.min(ww - lowerMargin_compact - trackNumWidth - timeAreaWidth - scaleForDisplay(20));

		// Measure width and height for artist, orig artist and song title
		const artistWidth = gr.MeasureString(str.artist, ft_lower_bold, 0, 0, artistMaxWidth, 0).Width;
		const artistHeight = gr.CalcTextHeight(str.artist, ft_lower_bold);
		const titleWidth = gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, titleMaxWidth, 0).Width;
		const titleHeight = gr.CalcTextHeight(str.title_lower, ft_lower);
		const artistTitleWidth = gr.MeasureString(str.artist, ft_lower_bold, 0, 0, 0, 0).Width + gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(pref.show_composer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0).Width + gr.MeasureString(str.original_artist, ft_lower, 0, 0, 0, 0).Width;

		if (artistTitleWidth < availableWidth) { // Artist + title displayed if space available
			gr.DrawString(pref.show_artist_compact ? str.artist : '', ft_lower_bold, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop + heightAdjustment, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
			gr.DrawString(pref.show_title_compact || !pref.show_title_compact && !fb.IsPlaying ? str.tracknum : '', ft_lower, col.now_playing, pref.show_artist_compact ? progressBar.x - scaleForDisplay(1) + artistWidth + (fb.IsPlaying ? (is_4k ? 19 : 8) : 0) : progressBar.x, lowerBarTop, trackNumWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(pref.show_title_compact || !pref.show_title_compact && !fb.IsPlaying ? pref.show_composer && fb.IsPlaying ? str.title_lower + str.original_artist + str.composer : str.title_lower : '', ft_lower, col.now_playing, pref.show_artist_compact ? progressBar.x + artistWidth + trackNumWidth + (is_4k ? 4 : 0) : progressBar.x + trackNumWidth + (is_4k ? 4 : 0), lowerBarTop, availableWidth, titleHeight, g_string_format.trim_ellipsis_char);
		}
		else { // Artist hidden if too long
			gr.DrawString(pref.show_artist_compact && !pref.show_title_compact ? str.artist : '', ft_lower_bold, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop + heightAdjustment, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
			gr.DrawString(pref.show_title_compact || !pref.show_title_compact && !fb.IsPlaying ? str.tracknum : '', ft_lower, col.now_playing, progressBar.x - scaleForDisplay(1), lowerBarTop, fb.IsPlaying ? trackNumWidth - timeAreaWidth : trackNumWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
			gr.DrawString(pref.show_title_compact || !pref.show_title_compact && !fb.IsPlaying ? pref.show_composer && fb.IsPlaying ? str.title_lower + str.original_artist + str.composer : str.title_lower : '', ft_lower, col.now_playing, progressBar.x + trackNumWidth + (is_4k ? 4 : 0), lowerBarTop, fb.IsPlaying ? availableWidth : ww, titleHeight, g_string_format.trim_ellipsis_char);
		}
	}

	// Progress bar/Seekbar
	progressBar.setY(Math.round(lowerBarTop + titleMeasurements.Height + progressBar.h));

	if (ww > 400) {
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		if (fb.PlaybackLength > 0) {
			if (pref.show_playbackTime_default && pref.layout_mode === 'default_mode') {
				gr.DrawString(str.length, ft_lower, col.now_playing, ww - scaleForDisplay(260), lowerBarTop, scaleForDisplay(220), titleMeasurements.Height, StringFormat(2, 0));
				let width = gr.CalcTextWidth('  ' + str.length, ft_lower);
				gr.DrawString(str.time, ft_lower_bold, col.now_playing, ww - scaleForDisplay(300), lowerBarTop + heightAdjustment, scaleForDisplay(260) - width, titleMeasurements.Height, StringFormat(2, 0));
				width += gr.CalcTextWidth('  ' + str.time, ft_lower_bold);
				gr.DrawString(str.disc, ft_lower, col.now_playing, ww - scaleForDisplay(340), lowerBarTop, scaleForDisplay(300) - width, titleMeasurements.Height, StringFormat(2, 0));
			}
			else if (pref.show_playbackTime_artwork && pref.layout_mode === 'artwork_mode') {
				gr.DrawString(str.length, ft_lower, col.now_playing, ww - scaleForDisplay(240), lowerBarTop, scaleForDisplay(220), titleMeasurements.Height, StringFormat(2, 0));
				let width = gr.CalcTextWidth('  ' + str.length, ft_lower);
				gr.DrawString(str.time, ft_lower_bold, col.now_playing, ww - scaleForDisplay(280), lowerBarTop + heightAdjustment, scaleForDisplay(260) - width, titleMeasurements.Height, StringFormat(2, 0));
				width += gr.CalcTextWidth('  ' + str.time, ft_lower_bold);
				gr.DrawString('', ft_lower, col.now_playing, ww - scaleForDisplay(340), lowerBarTop, scaleForDisplay(300) - width, titleMeasurements.Height, StringFormat(2, 0));
			}
			else if (pref.show_playbackTime_compact && pref.layout_mode === 'compact_mode') {
				gr.DrawString(str.length, ft_lower, col.now_playing, ww - scaleForDisplay(240), lowerBarTop, scaleForDisplay(220), titleMeasurements.Height, StringFormat(2, 0));
				let width = gr.CalcTextWidth('  ' + str.length, ft_lower);
				gr.DrawString(str.time, ft_lower_bold, col.now_playing, ww - scaleForDisplay(280), lowerBarTop + heightAdjustment, scaleForDisplay(260) - width, titleMeasurements.Height, StringFormat(2, 0));
				width += gr.CalcTextWidth('  ' + str.time, ft_lower_bold);
				gr.DrawString('', ft_lower, col.now_playing, ww - scaleForDisplay(340), lowerBarTop, scaleForDisplay(300) - width, titleMeasurements.Height, StringFormat(2, 0));
			}
		} else if (fb.IsPlaying) { // streaming, but still want to show time
			if (pref.show_playbackTime_default && pref.layout_mode === 'default_mode') {
				gr.DrawString(str.time, ft.lower_bar, col.now_playing, ww - scaleForDisplay(260), lowerBarTop, scaleForDisplay(220), 0.5 * geo.lower_bar_h, StringFormat(2, 0));
			}
			else if (pref.show_playbackTime_artwork && pref.layout_mode === 'artwork_mode') {
				gr.DrawString(str.time, ft.lower_bar, col.now_playing, ww - scaleForDisplay(240), lowerBarTop, scaleForDisplay(220), 0.5 * geo.lower_bar_h, StringFormat(2, 0));
			}
			else if (pref.show_playbackTime_compact && pref.layout_mode === 'compact_mode') {
				gr.DrawString(str.time, ft.lower_bar, col.now_playing, ww - scaleForDisplay(240), lowerBarTop, scaleForDisplay(220), 0.5 * geo.lower_bar_h, StringFormat(2, 0));
			}
		}
		else {
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
			if (pref.show_playbackTime_default && pref.layout_mode === 'default_mode') {
				gr.DrawString(str.time, ft.lower_bar, color, ww - scaleForDisplay(300) - offset, lowerBarTop, scaleForDisplay(260), geo.lower_bar_h, StringFormat(2, 0));
			}
			else if (pref.show_playbackTime_artwork && pref.layout_mode === 'artwork_mode') {
				gr.DrawString(str.time, ft.lower_bar, color, ww - scaleForDisplay(280) - offset, lowerBarTop, scaleForDisplay(260), geo.lower_bar_h, StringFormat(2, 0));
			}
			else if (pref.show_playbackTime_compact && pref.layout_mode === 'compact_mode') {
				gr.DrawString(str.time, ft.lower_bar, color, ww - scaleForDisplay(280) - offset, lowerBarTop, scaleForDisplay(260), geo.lower_bar_h, StringFormat(2, 0));
			}
		}
		if (pref.show_playbackTime_default && fb.IsPlaying && pref.layout_mode === 'default_mode') {
			btns.playbackTime = new Button(ww - timeAreaWidth - scaleForDisplay(40), wh - scaleForDisplay(105) + scaleForDisplay(pref.lower_bar_font_size_default),
			timeAreaWidth, scaleForDisplay(20), pref.show_playbackTime_default ? 'PlaybackTime' : '', '', pref.show_playbackTime_default ? 'Switch playback time' : '');
		}
		else if (pref.show_playbackTime_artwork && fb.IsPlaying && pref.layout_mode === 'artwork_mode') {
			btns.playbackTime = new Button(ww - timeAreaWidth - scaleForDisplay(20), wh - scaleForDisplay(120) + scaleForDisplay(pref.lower_bar_font_size_artwork),
			timeAreaWidth, scaleForDisplay(20), pref.show_playbackTime_artwork ? 'PlaybackTime' : '', '', pref.show_playbackTime_artwork ? 'Switch playback time' : '');
		}
		else if (pref.show_playbackTime_compact && fb.IsPlaying && pref.layout_mode === 'compact_mode') {
			btns.playbackTime = new Button(ww - timeAreaWidth - scaleForDisplay(20), wh - scaleForDisplay(120) + scaleForDisplay(pref.lower_bar_font_size_compact),
			timeAreaWidth, scaleForDisplay(20), pref.show_playbackTime_compact ? 'PlaybackTime' : '', '', pref.show_playbackTime_compact ? 'Switch playback time' : '');
		}
	}
	if (pref.layout_mode === 'default_mode') {
		if (pref.show_progress_bar_default) {
			progressBar.draw(gr);
		}
	} else if (pref.layout_mode === 'artwork_mode') {
		if (pref.show_progress_bar_artwork) {
			progressBar.draw(gr);
		}
	} else if (pref.layout_mode === 'compact_mode') {
		if (pref.show_progress_bar_compact) {
			progressBar.draw(gr);
		}
	}

	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	drawLowerBarProfiler && drawLowerBarProfiler.Print();
	if (repaintRects.length) {
		repaintRects.forEach(rect => gr.DrawRect(rect.x, rect.y, rect.w, rect.h, scaleForDisplay(2), rgba(255,0,0,200)));
		repaintRects = [];
	}

	// UIHacks Aero Glass Shadow Frame Fix
	gr.DrawLine(0, 0, ww, 0, 1,
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(35, 35, 35) :
		pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.primary : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(63, 155, 202) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(125, 0, 0) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : ''
	);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1,
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(35, 35, 35) :
		pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.primary : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(63, 155, 202) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(125, 0, 0) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : ''
	);

	// Layout Mode Switcher
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

let rotatedCdIndex = 0; // global index of current cdartArray img to draw
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

	if (transport.show_volume_default && pref.layout_mode === 'default_mode') {
		volume_btn.on_paint(gr);
	}
	if (transport.show_volume_artwork && pref.layout_mode === 'artwork_mode') {
		volume_btn.on_paint(gr);
	}
	if (transport.show_volume_compact && pref.layout_mode === 'compact_mode') {
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

	const themeMenu = new Menu('Theme');
	themeMenu.addToggleItem('White', pref, 'whiteTheme', () => {
		pref.whiteTheme      = 'white';
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Black', pref, 'blackTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = 'black';
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Reborn', pref, 'rebornTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = 'reborn';
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addSeparator();
	themeMenu.addToggleItem('Blue', pref, 'blueTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = 'blue';
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Dark blue', pref, 'darkblueTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = 'darkblue';
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Red', pref, 'redTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = 'red';
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Cream', pref, 'creamTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = 'cream';
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addSeparator();
	themeMenu.addToggleItem('Neon blue', pref, 'nblueTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = 'nblue';
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Neon green', pref, 'ngreenTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = 'ngreen';
		pref.nredTheme       = false;
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Neon red', pref, 'nredTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = 'nred';
		pref.ngoldTheme      = false;
		initTheme();
	});
	themeMenu.addToggleItem('Neon gold', pref, 'ngoldTheme', () => {
		pref.whiteTheme      = false;
		pref.blackTheme      = false;
		pref.rebornTheme     = false;
		pref.blueTheme       = false;
		pref.darkblueTheme   = false;
		pref.redTheme        = false;
		pref.creamTheme      = false;
		pref.nblueTheme      = false;
		pref.ngreenTheme     = false;
		pref.nredTheme       = false;
		pref.ngoldTheme      = 'ngold';
		initTheme();
	});
	themeMenu.appendTo(menu);

	const playerSizeMenu = new Menu('Player size');
	if (!is_4k) {
		playerSizeMenu.addToggleItem('Small', pref, 'player_small', () => {
			pref.player_small     = 'player_small';
			pref.player_normal    = false;
			pref.player_large     = false;
			pref.player_4k_small  = false;
			pref.player_4k_normal = false;
			pref.player_4k_large  = false;
			mode_handler.player_size_small();
			createPlaylistFonts();
			setBiographySize();
			playlist.on_size(ww, wh);
			RepaintWindow();
		});
	}
	if (!is_4k) {
		playerSizeMenu.addToggleItem('Normal', pref, 'player_normal', () => {
			pref.player_small     = false;
			pref.player_normal    = 'player_normal';
			pref.player_large     = false;
			pref.player_4k_small  = false;
			pref.player_4k_normal = false;
			pref.player_4k_large  = false;
			mode_handler.player_size_normal();
			createPlaylistFonts();
			setBiographySize();
			playlist.on_size(ww, wh);
			RepaintWindow();
		});
	}
	if (!is_4k) {
		playerSizeMenu.addToggleItem('Large', pref, 'player_large', () => {
			pref.player_small     = false;
			pref.player_normal    = false;
			pref.player_large     = 'player_large';
			pref.player_4k_small  = false;
			pref.player_4k_normal = false;
			pref.player_4k_large  = false;
			mode_handler.player_size_large();
			createPlaylistFonts();
			setBiographySize();
			playlist.on_size(ww, wh);
			RepaintWindow();
		});
	}
	if (is_4k) {
		playerSizeMenu.addToggleItem('Small', pref, 'player_4k_small', () => {
			pref.player_small     = false;
			pref.player_normal    = false;
			pref.player_large     = false;
			pref.player_4k_small  = 'player_4k_small';
			pref.player_4k_normal = false;
			pref.player_4k_large  = false;
			mode_handler.player_size_4k_small();
			createPlaylistFonts();
			setBiographySize();
			playlist.on_size(ww, wh);
			RepaintWindow();
		});
	}
	if (is_4k) {
		playerSizeMenu.addToggleItem('Normal', pref, 'player_4k_normal', () => {
			pref.player_small     = false;
			pref.player_normal    = false;
			pref.player_large     = false;
			pref.player_4k_small  = false;
			pref.player_4k_normal = 'player_4k_normal';
			pref.player_4k_large  = false;
			mode_handler.player_size_4k_normal();
			createPlaylistFonts();
			setBiographySize();
			playlist.on_size(ww, wh);
			RepaintWindow();
		});
	}
	if (is_4k) {
		playerSizeMenu.addToggleItem('Large', pref, 'player_4k_large', () => {
			pref.player_small     = false;
			pref.player_normal    = false;
			pref.player_large     = false;
			pref.player_4k_small  = false;
			pref.player_4k_normal = false;
			pref.player_4k_large  = 'player_4k_large';
			mode_handler.player_size_4k_large();
			createPlaylistFonts();
			setBiographySize();
			playlist.on_size(ww, wh);
			RepaintWindow();
		});
	}
	playerSizeMenu.appendTo(menu);

	menu.createRadioSubMenu('Layout', ['Default', 'Artwork', 'Compact'], pref.layout_mode, ['default_mode', 'artwork_mode', 'compact_mode'], (mode) => {
		pref.layout_mode = mode;
		if (pref.layout_mode === 'default_mode') {
			if (pref.startPlaylist) { // Switch back to playlist from Artwork mode to Default mode
				displayPlaylist = true;
				displayBiography = false;
				pref.displayLyrics = false;
			} else { // Switch back to Details from Artwork mode to Default mode
				displayPlaylist = false;
				displayBiography = false;
				pref.displayLyrics = false;
			}
			mode_handler.layout_mode_default_mode();
			createFonts();
			setGeometry();
			ResizeArtwork(true);
			if (transport.enableTransportControls_default) {
				createButtonImages();
				createButtonObjects(ww, wh);
			}
			initTheme();
			initPlaylistColors();
			playlist.on_size(ww, wh);
			progressBar = new ProgressBar(ww, wh);
			RepaintWindow();
		}
		if (pref.layout_mode === 'artwork_mode') {
			displayLibrary = false;
			displayBiography = false;
			displayPlaylist = false;
			mode_handler.layout_mode_artwork_mode();
			createFonts();
			setGeometry();
			ResizeArtwork(true);
			if (transport.enableTransportControls_artwork) {
				createButtonImages();
				createButtonObjects(ww, wh);
			}
			initTheme();
			initPlaylistColors();
			playlist.on_size(ww, wh);
			progressBar = new ProgressBar(ww, wh);
			RepaintWindow();
		}
		if (pref.layout_mode === 'compact_mode') {
			pref.displayLyrics = false;
			displayLibrary = false;
			displayBiography = false;
			displayPlaylist = true;
			mode_handler.layout_mode_compact_mode();
			createFonts();
			setGeometry();
			ResizeArtwork(true);
			if (transport.enableTransportControls_compact) {
				createButtonImages();
				createButtonObjects(ww, wh);
			}
			initTheme();
			initPlaylistColors();
			playlist.on_size(ww, wh);
			progressBar = new ProgressBar(ww, wh);
			RepaintWindow();
		}
	});

	menu.createRadioSubMenu('4K mode', ['Auto-detect', 'Disabled', 'Enabled'], pref.use_4k, ['auto', 'never', 'always'], (mode) => {
		pref.use_4k = mode;
		if (pref.use_4k === 'auto') {
			if (pref.layout_mode === 'default_mode') {
				set_window_size(1140, 730); // Reset player size for initialization
				mode_handler.layout_mode_default_mode();
			}
			else if (pref.layout_mode === 'artwork_mode') {
				set_window_size(526, 686); // Reset player size for initialization
				mode_handler.layout_mode_artwork_mode();
			}
			else if (pref.layout_mode === 'compact_mode') {
				set_window_size(484, 730); // Reset player size for initialization
				mode_handler.layout_mode_compact_mode();
			}
		}
		if (pref.use_4k === 'never' || pref.use_4k === 'always') {
			if (pref.layout_mode === 'default_mode') {
				mode_handler.layout_mode_default_mode();
			}
			else if (pref.layout_mode === 'artwork_mode') {
				mode_handler.layout_mode_artwork_mode();
			}
			else if (pref.layout_mode === 'compact_mode') {
				mode_handler.layout_mode_compact_mode();
			}
		}
		ppt.baseFontSize = scaleForDisplay(12); // Sets Library font size to 12px (FHD) or 24 pixel (4k)
		initLibraryPanel(); setLibrarySize(); pop.createImages(); panel.zoomReset(); // Resets Library
		pptBio.baseFontSizeBio = scaleForDisplay(12); // Sets Biography font size to 12px (FHD) or 24 pixel (4k)
		initBiographyPanel(); setBiographySize(); uiBio.setSbar(); butBio.createImages(); butBio.resetZoom(); initBiographyColors(); // Resets Biography
		window.Repaint();
	});

	const changeFontSizeMenu = new Menu('Font size');
	const mainFontSizeMenu = new Menu('Main');
	mainFontSizeMenu.createRadioSubMenu('Top menu', ['11px', '12px (default)', '13px', '14px', '16px'], pref.menu_font_size, [11,12,13,14,16], (size) => {
		if (size) {
			pref.menu_font_size = size;
		}
		ft.SegoeUi = gdi.Font('Segoe Ui Semibold', scaleForDisplay(pref.menu_font_size), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		window.Repaint();
	});
	if (pref.layout_mode === 'default_mode') {
		mainFontSizeMenu.createRadioSubMenu('Lower bar', ['16px', '18px (default)', '20px', '22px', '24px'], pref.artist_font_size_default && pref.lower_bar_font_size_default, [16,18,20,22,24], (size_default) => {
			if (size_default) {
				pref.artist_font_size_default = size_default;
				pref.lower_bar_font_size_default = size_default;
			}
			createFonts();
			createButtonImages();
			createButtonObjects(ww, wh);
			window.Repaint();
		});
	}
	if (pref.layout_mode === 'artwork_mode') {
		mainFontSizeMenu.createRadioSubMenu('Lower bar', ['16px (default)', '18px', '20px', '22px', '24px'], pref.artist_font_size_artwork && pref.lower_bar_font_size_artwork, [16,18,20,22,24], (size_artwork) => {
			if (size_artwork) {
				pref.artist_font_size_artwork = size_artwork;
				pref.lower_bar_font_size_artwork = size_artwork;
			}
			createFonts();
			createButtonImages();
			createButtonObjects(ww, wh);
			window.Repaint();
		});
	}
	if (pref.layout_mode === 'compact_mode') {
		mainFontSizeMenu.createRadioSubMenu('Lower bar', ['16px (default)', '18px', '20px', '22px', '24px'], pref.artist_font_size_compact && pref.lower_bar_font_size_compact, [16,18,20,22,24], (size_compact) => {
			if (size_compact) {
				pref.artist_font_size_compact = size_compact;
				pref.lower_bar_font_size_compact = size_compact;
			}
			createFonts();
			createButtonImages();
			createButtonObjects(ww, wh);
			window.Repaint();
		});
	}
	mainFontSizeMenu.appendTo(changeFontSizeMenu);

	const detailsFontSizeMenu = new Menu('Details');
	detailsFontSizeMenu.createRadioSubMenu('Title album', ['11px', '12px', '13px', '14px', '16px', '18px', '20px (default)', '22px', '24px'], pref.tracknum_font_size && pref.album_font_size, [11,12,13,14,16,18,20,22,24], (size) => {
		if (size) {
			pref.tracknum_font_size = size;
			pref.album_font_size = size;
		}
		ft.tracknum_lrg = gdi.Font(fontLight, scaleForDisplay(pref.tracknum_font_size), 0);
		ft.album_lrg = gdi.Font(fontBold, scaleForDisplay(pref.album_font_size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.createRadioSubMenu('Tag name', ['11px', '12px', '13px', '14px', '16px', '18px (default)', '20px', '22px', '24px'], pref.MetadataGrid_key_font_size, [11,12,13,14,16,18,20,22,24], (size) => {
		if (size) {
			pref.MetadataGrid_key_font_size = size;
		}
		ft.grd_key_lrg = gdi.Font(fontRegular, scaleForDisplay(pref.MetadataGrid_key_font_size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.createRadioSubMenu('Tag value', ['11px', '12px', '13px', '14px', '16px', '18px (default)', '20px', '22px', '24px'], pref.MetadataGrid_val_font_size, [11,12,13,14,16,18,20,22,24], (size) => {
		if (size) {
			pref.MetadataGrid_val_font_size = size;
		}
		ft.grd_val_lrg = gdi.Font(fontRegular, scaleForDisplay(pref.MetadataGrid_val_font_size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.appendTo(changeFontSizeMenu);

	const playlistFontSizeMenu = new Menu('Playlist');
	playlistFontSizeMenu.createRadioSubMenu('Header', pref.layout_mode === 'default_mode' ? ['-1', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'] : ['14px', '15px (default)', '16px', '18px'],
	pref.font_size_playlist_header, pref.layout_mode === 'default_mode' ? [-1, 14, 15, 16, 18, 20, 22, 999] : [14, 15, 16, 18], (size) => {
		if (size === -1) {
			pref.font_size_playlist_header--;
		} else if (size === 999) {
			pref.font_size_playlist_header++;
		} else {
			pref.font_size_playlist_header = size;
		}
		createPlaylistFonts();
		reinitPlaylist();
		playlist.on_size(ww, wh);
		window.Repaint();
	});
	playlistFontSizeMenu.createRadioSubMenu('Row', pref.layout_mode === 'default_mode' ? ['-1', '11px', '12px (default)', '13px', '14px', '16px', '18px', '+1'] : ['11px', '12px (default)', '13px', '14px'],
	pref.font_size_playlist, pref.layout_mode === 'default_mode' ? [-1, 11, 12, 13, 14, 16, 18, 999] : [11, 12, 13, 14], (size) => {
		if (size === -1) {
			pref.font_size_playlist--;
		} else if (size === 999) {
			pref.font_size_playlist++;
		} else {
			pref.font_size_playlist = size;
		}
		g_properties.row_h = Math.round(pref.font_size_playlist * 1.667);
		createPlaylistFonts();
		rescalePlaylist(true);
		initPlaylist();
		playlist.on_size(ww, wh);
		window.Repaint();
	});
	playlistFontSizeMenu.appendTo(changeFontSizeMenu);

	changeFontSizeMenu.createRadioSubMenu('Library', ['-1', '11px', '12px (default)', '13px', '14px', '16px', '18px', '+1'], ppt.baseFontSize,
	[-1, is_4k ? 11 * 1.5 : 11, is_4k ? 12 * 1.5 : 12, is_4k ? 13 * 1.5 : 13, is_4k ? 14 * 1.5 : 14, is_4k ? 16 * 1.5 : 16, is_4k ? 18 * 1.5 : 18, 999], (size) => {
		if (size === -1) {
			ppt.baseFontSize--;
			panel.filter.font--;
			panel.settings.font.Size--;
		} else if (size === 999) {
			ppt.baseFontSize++;
			panel.filter.font++;
			panel.settings.font.Size++;
		} else {
			ppt.baseFontSize = size;
			panel.filter.font = size;
			panel.settings.font.Size = size;
		}
		initLibraryPanel();
		setLibrarySize();
		panel.zoomReset();
		pop.createImages();
		window.Repaint();
	});

	changeFontSizeMenu.createRadioSubMenu('Biography', ['-1', '11px', '12px (default)', '13px', '14px', '16px', '18px', '+1'], pptBio.baseFontSizeBio,
	[-1, is_4k ? 11 * 2 : 11, is_4k ? 12 * 2 : 12, is_4k ? 13 * 2 : 13, is_4k ? 14 * 2 : 14, is_4k ? 16 * 2 : 16, is_4k ? 18 * 2 : 18, 999], (size) => {
		if (size === -1) {
			pptBio.baseFontSizeBio--;
		} else if (size === 999) {
			pptBio.baseFontSizeBio++;
		} else {
			pptBio.baseFontSizeBio = size;
		}
		initBiographyPanel();
		setBiographySize();
		butBio.resetZoom();
		butBio.createImages();
		window.Repaint();
	});

	changeFontSizeMenu.createRadioSubMenu('Lyrics', ['-1', '16px', '18px', '20px (default)', '22px', '24px', '26px', '+1'], pref.lyricsFontSize, [-1, 16, 18, 20, 22, 24, 26, 999], (size) => {
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
	});
	changeFontSizeMenu.appendTo(menu);
	menu.addSeparator();

	// Player controls options

	const playerControlsMenu = new Menu('Player controls');

	const transportSizeMenu = new Menu('Transport button size');
	const transportSizeMenuDefault = new Menu('Default');
	transportSizeMenuDefault.addRadioItems(['24px', '26px', '28px', '32px (default)', '34px', '36px', '38px'], pref.transport_buttons_size_default, [24,26,28,32,34,36,38], (size) => {
		if (size === -1) {
			pref.transport_buttons_size_default -= 2;
		} else if (size === 999) {
			pref.transport_buttons_size_default += 2;
		} else {
			pref.transport_buttons_size_default = size;
		}
		ft.guifx                    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_default / 2    )), 0);
		ft.playbackOrder_default    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_default / 1.6  )), 0);
		ft.playbackOrder_replay     = gdi.Font(fontAwesome, Math.floor(scaleForDisplay(pref.transport_buttons_size_default / 2    )), 0);
		ft.playbackOrder_shuffle    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_default / 1.65 )), 0);
		ft.guifx_volume             = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_default / 1.33 )), 0);
		ft.guifx_reload             = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_default / 1.5  )), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportSizeMenuDefault.appendTo(transportSizeMenu);

	const transportSizeMenuArtwork = new Menu('Artwork');
	transportSizeMenuArtwork.addRadioItems(['26px', '28px', '32px (default)', '34px', '36px'], pref.transport_buttons_size_artwork, [26,28,32,34,36], (size) => {
		if (size === -1) {
			pref.transport_buttons_size_artwork -= 2;
		} else if (size === 999) {
			pref.transport_buttons_size_artwork += 2;
		} else {
			pref.transport_buttons_size_artwork = size;
		}
		ft.guifx                    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_artwork / 2    )), 0);
		ft.playbackOrder_default    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_artwork / 1.6  )), 0);
		ft.playbackOrder_replay     = gdi.Font(fontAwesome, Math.floor(scaleForDisplay(pref.transport_buttons_size_artwork / 2    )), 0);
		ft.playbackOrder_shuffle    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_artwork / 1.65 )), 0);
		ft.guifx_volume             = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_artwork / 1.33 )), 0);
		ft.guifx_reload             = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_artwork / 1.5  )), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportSizeMenuArtwork.appendTo(transportSizeMenu);

	const transportSizeMenuCompact = new Menu('Compact');
	transportSizeMenuCompact.addRadioItems(['26px', '28px', '32px (default)', '34px', '36px'], pref.transport_buttons_size_compact, [26,28,32,34,36], (size) => {
		if (size === -1) {
			pref.transport_buttons_size_compact -= 2;
		} else if (size === 999) {
			pref.transport_buttons_size_compact += 2;
		} else {
			pref.transport_buttons_size_compact = size;
		}
		ft.guifx                    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_compact / 2    )), 0);
		ft.playbackOrder_default    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_compact / 1.6  )), 0);
		ft.playbackOrder_replay     = gdi.Font(fontAwesome, Math.floor(scaleForDisplay(pref.transport_buttons_size_compact / 2    )), 0);
		ft.playbackOrder_shuffle    = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_compact / 1.65 )), 0);
		ft.guifx_volume             = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_compact / 1.33 )), 0);
		ft.guifx_reload             = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transport_buttons_size_compact / 1.5  )), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportSizeMenuCompact.appendTo(transportSizeMenu);
	transportSizeMenu.appendTo(playerControlsMenu);

	const transportSpacingMenu = new Menu('Transport button spacing');
	const transportSpacingMenuDefault = new Menu('Default');
	transportSpacingMenuDefault.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transport_buttons_spacing_default, [-1,3,5,7,10,15,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_spacing_default -= 2;
		} else if (size === 999) {
			pref.transport_buttons_spacing_default += 2;
		} else {
			pref.transport_buttons_spacing_default = size;
		}
		createButtonImages();
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	transportSpacingMenuDefault.appendTo(transportSpacingMenu);

	const transportSpacingMenuArtwork = new Menu('Artwork');
	transportSpacingMenuArtwork.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transport_buttons_spacing_artwork, [-1,3,5,7,10,15,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_spacing_artwork -= 2;
		} else if (size === 999) {
			pref.transport_buttons_spacing_artwork += 2;
		} else {
			pref.transport_buttons_spacing_artwork = size;
		}
		createButtonImages();
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	transportSpacingMenuArtwork.appendTo(transportSpacingMenu);

	const transportSpacingMenuCompact = new Menu('Compact');
	transportSpacingMenuCompact.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transport_buttons_spacing_compact, [-1,3,5,7,10,15,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_spacing_compact -= 2;
		} else if (size === 999) {
			pref.transport_buttons_spacing_compact += 2;
		} else {
			pref.transport_buttons_spacing_compact = size;
		}
		createButtonImages();
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	transportSpacingMenuCompact.appendTo(transportSpacingMenu);
	transportSpacingMenu.appendTo(playerControlsMenu);
	playerControlsMenu.addSeparator();

	const transportControlsMenu = new Menu('Show transport controls');
	transportControlsMenu.addToggleItem('Default', transport, 'enableTransportControls_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportControlsMenu.addToggleItem('Artwork', transport, 'enableTransportControls_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportControlsMenu.addToggleItem('Compact', transport, 'enableTransportControls_compact', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportControlsMenu.appendTo(playerControlsMenu);

	const playbackOrderBtnMenu = new Menu('Show playback order button');
	playbackOrderBtnMenu.addToggleItem('Default', transport, 'show_playbackOrder_default', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_default);
	playbackOrderBtnMenu.addToggleItem('Artwork', transport, 'show_playbackOrder_artwork', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_artwork);
	playbackOrderBtnMenu.addToggleItem('Compact', transport, 'show_playbackOrder_compact', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_compact);
	playbackOrderBtnMenu.appendTo(playerControlsMenu);

	const reloadBtnMenu = new Menu('Show reload button');
	reloadBtnMenu.addToggleItem('Default', transport, 'show_reload_default', () => {
		volume_btn = new VolumeBtn(); // create new volume btn for new width size
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_default);
	reloadBtnMenu.addToggleItem('Artwork', transport, 'show_reload_artwork', () => {
		volume_btn = new VolumeBtn(); // create new volume btn for new width size
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_artwork);
	reloadBtnMenu.addToggleItem('Compact', transport, 'show_reload_compact', () => {
		volume_btn = new VolumeBtn(); // create new volume btn for new width size
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_compact);
	reloadBtnMenu.appendTo(playerControlsMenu);

	const volumeBtnMenu = new Menu('Show volume control button');
	volumeBtnMenu.addToggleItem('Default', transport, 'show_volume_default', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_default);
	volumeBtnMenu.addToggleItem('Artwork', transport, 'show_volume_artwork', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_artwork);
	volumeBtnMenu.addToggleItem('Compact', transport, 'show_volume_compact', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !transport.enableTransportControls_compact);
	volumeBtnMenu.appendTo(playerControlsMenu);

	const progressBarMenu = new Menu('Show progress bar');
	progressBarMenu.addToggleItem('Default', pref, 'show_progress_bar_default', () => {
		setGeometry();
		ResizeArtwork(true);
		RepaintWindow();
	});
	progressBarMenu.addToggleItem('Artwork', pref, 'show_progress_bar_artwork', () => {
		setGeometry();
		ResizeArtwork(true);
		RepaintWindow();
	});
	progressBarMenu.addToggleItem('Compact', pref, 'show_progress_bar_compact', () => {
		setGeometry();
		ResizeArtwork(true);
		RepaintWindow();
	});
	progressBarMenu.appendTo(playerControlsMenu);

	const playbackTimeMenu = new Menu('Show playback time in lower bar');
	playbackTimeMenu.addToggleItem('Default', pref, 'show_playbackTime_default', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	playbackTimeMenu.addToggleItem('Artwork', pref, 'show_playbackTime_artwork', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	playbackTimeMenu.addToggleItem('Compact', pref, 'show_playbackTime_compact', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	playbackTimeMenu.appendTo(playerControlsMenu);

	const showArtistMenu = new Menu('Show artist in lower bar');
	showArtistMenu.addToggleItem('Default', pref, 'show_artist_default', () => { RepaintWindow(); });
	showArtistMenu.addToggleItem('Artwork', pref, 'show_artist_artwork', () => { RepaintWindow(); });
	showArtistMenu.addToggleItem('Compact', pref, 'show_artist_compact', () => { RepaintWindow(); });
	showArtistMenu.appendTo(playerControlsMenu);

	const showTitleMenu = new Menu('Show song title in lower bar');
	showTitleMenu.addToggleItem('Default', pref, 'show_title_default', () => { RepaintWindow(); });
	showTitleMenu.addToggleItem('Artwork', pref, 'show_title_artwork', () => { RepaintWindow(); });
	showTitleMenu.addToggleItem('Compact', pref, 'show_title_compact', () => { RepaintWindow(); });
	showTitleMenu.appendTo(playerControlsMenu);

	playerControlsMenu.addToggleItem('Show composer in lower bar', pref, 'show_composer');
	playerControlsMenu.addToggleItem('Show artist country flags in lower bar', pref, 'show_flags_lowerbar', () => {
		loadCountryFlags();
		RepaintWindow();
	});
	playerControlsMenu.addToggleItem('Show pause on album cover', pref, 'show_pause', () => { RepaintWindow(); });
	playerControlsMenu.addToggleItem('Show logo on startup', pref, 'show_logo', () => { RepaintWindow(); });
	playerControlsMenu.addSeparator();

	playerControlsMenu.addToggleItem('Enable tooltips', pref, 'show_tt', () => {
		if (pref.show_tt) {
			pref.show_tt = true;
			pref.show_truncatedText_tt = true;
			pref.show_timeline_tooltips = true;
			ppt.tooltips = true;
		} else {
			pref.show_tt = false;
			pref.show_truncatedText_tt = false;
			pref.show_timeline_tooltips = false;
			ppt.tooltips = false;
		}
	});
	playerControlsMenu.addToggleItem('Enable tooltips on truncated text', pref, 'show_truncatedText_tt', () => {
		if (pref.show_truncatedText_tt) {
			pref.show_truncatedText_tt = true;
			ppt.tooltips = true;
		} else {
			pref.show_truncatedText_tt = false;
			ppt.tooltips = false;
		}
	});
	playerControlsMenu.addToggleItem('Enable timeline tooltips', pref, 'show_timeline_tooltips');
	playerControlsMenu.addSeparator();

	playerControlsMenu.addToggleItem(`Cycle album artwork (${settings.artworkDisplayTime}s delay)`, pref, 'cycleArt', () => {
		if (!pref.cycleArt) {
			clearTimeout(albumArtTimeout);
			albumArtTimeout = 0;
		} else {
			displayNextImage();
		}
	});
	playerControlsMenu.addToggleItem('Cycle album artwork with mouse wheel', pref, 'cycleArtMWheel');
	playerControlsMenu.addToggleItem('Update progress bar frequently (higher CPU)', pref, 'freq_update', () => {
		SetProgressBarRefresh();
	}, !pref.show_progress_bar_default || !pref.show_progress_bar_artwork || !pref.show_progress_bar_compact);
	playerControlsMenu.appendTo(menu);
	menu.addSeparator();

	// Playlist panel options

	const playlistMenu = new Menu('Playlist');
	var playlistCallback = function () {
		playlist.on_size(ww, wh);
		window.Repaint();
	};

	const playlistScrollBarMenu = new Menu('Scrollbar');
	playlistScrollBarMenu.addToggleItem('Auto-hide', pref, 'autoHideScrollbar_Playlist',  () => {
		if (pref.autoHideScrollbar_Playlist) {
			g_properties.show_scrollbar = false;
			playlistCallback();
		} else {
			g_properties.show_scrollbar = true;
			playlistCallback();
		}
	});
	playlistScrollBarMenu.addToggleItem('Smooth scroll', pref, 'smoothScrolling');
	playlistScrollBarMenu.appendTo(playlistMenu);

	const playlistManagerMenu = new Menu('Playlist manager');
	playlistManagerMenu.addToggleItem('Auto-hide', pref, 'autoHidePLM',  () => {
		if (pref.autoHidePLM) {
			initPlaylistColors();
			RepaintWindow();
		} else {
			initPlaylistColors();
			RepaintWindow();
		}
	});
	const playlistManagerShowMenu = new Menu('Show playlist manager');
	playlistManagerShowMenu.addToggleItem('Default', pref, 'showPLM_default', playlistCallback);
	playlistManagerShowMenu.addToggleItem('Artwork', pref, 'showPLM_artwork', playlistCallback);
	playlistManagerShowMenu.addToggleItem('Compact', pref, 'showPLM_compact', playlistCallback);
	playlistManagerShowMenu.appendTo(playlistManagerMenu);
	playlistManagerMenu.appendTo(playlistMenu);

	const playlistAlbumMenu = new Menu('Album headers');
	playlistAlbumMenu.addToggleItem('Show album header', g_properties, 'show_header', playlistCallback);
	playlistAlbumMenu.addToggleItem('Use compact group header', g_properties, 'use_compact_header', playlistCallback, !g_properties.show_header);
	playlistAlbumMenu.addToggleItem('Show long release date (YYYY-MM-DD)', pref, 'showPlaylistFulldate', () => { initPlaylist(); playlistCallback(); });
	playlistAlbumMenu.addToggleItem('Ctrl+click to follow links', pref, 'hyperlinks_ctrl');
	playlistAlbumMenu.addToggleItem('Show weblinks in context menu', pref, 'show_weblinks');
	playlistAlbumMenu.appendTo(playlistMenu);

	const rowsMenu = new Menu('Track rows');
	rowsMenu.addToggleItem('Alternate row color', g_properties, 'alternate_row_color', playlistCallback);
	rowsMenu.addToggleItem('Show play count', g_properties, 'show_playcount', playlistCallback, !g_component_playcount);
	rowsMenu.addToggleItem('Show queue position', g_properties, 'show_queue_position', playlistCallback);
	rowsMenu.addToggleItem('Show rating', g_properties, 'show_rating', playlistCallback);
	rowsMenu.appendTo(playlistMenu);
	playlistMenu.addSeparator();

	playlistMenu.addToggleItem('Show artist name in row', pref, 'show_artist_playlistRow', () => { initPlaylist(); playlistCallback(); });
	playlistMenu.addToggleItem('Show album title in row', pref, 'show_album_playlistRow', () => { initPlaylist(); playlistCallback(); });
	playlistMenu.addToggleItem('Show time remaining on playing track', pref, 'playlistTimeRemaining', () => { RepaintWindow(); });
	playlistMenu.addToggleItem('Always scroll to current playing song', pref, 'always_showPlayingPl');
	playlistMenu.addToggleItem('Show playlist on startup', pref, 'startPlaylist');
	playlistMenu.addToggleItem('Use vinyl style numbering if available', pref, 'use_vinyl_nums', () => { RepaintWindow(); });
	playlistMenu.addSeparator();
	playlistMenu.addToggleItem('Row mouse hover', pref, 'playlistRowHover', () => { RepaintWindow(); });

	playlistMenu.appendTo(menu);

	// Details panel options

	const detailsMenu = new Menu('Details');
	detailsMenu.addToggleItem('Show artist', pref, 'show_artistInGrid', () => { createFonts(); RepaintWindow(); });
	detailsMenu.addToggleItem('Show song title', pref, 'show_titleInGrid', () => { createFonts(); RepaintWindow(); });
	detailsMenu.addToggleItem('Show artist country flags', pref, 'show_flags_details', () => {
		loadCountryFlags();
		RepaintWindow();
	});
	detailsMenu.addToggleItem('Show release country flags', settings, 'showReleaseCountryFlag', () => {
		loadReleaseCountryFlag();
		RepaintWindow();
	});
	detailsMenu.addToggleItem('Show full background when no disc art', pref, 'no_cdartBG', () => {
		if (pref.labelArtOnBg) {
			pref.labelArtOnBg = false;
		}
		RepaintWindow();
	});
	detailsMenu.addToggleItem('Show label art on background', pref, 'labelArtOnBg', () => RepaintWindow(), pref.no_cdartBG);
	detailsMenu.addSeparator();

	detailsMenu.addToggleItem('Invert band logos to black', pref, 'invertedBand', () => RepaintWindow());
	detailsMenu.addToggleItem('Invert label logos to black', pref, 'invertedLabel', () => RepaintWindow());
	detailsMenu.addSeparator();

	const cdArtMenu = new Menu('Disc art');
	const displayDiscArtMenu = new Menu('Display disc art placeholder');
	displayDiscArtMenu.addToggleItem('No placeholder', pref, 'noDiscArtStub',() => {
		pref.noDiscArtStub          = true;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addSeparator();
	displayDiscArtMenu.addToggleItem('CD - White', pref, 'cdArtWhiteStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = true;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('CD - Black', pref, 'cdArtBlackStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = true;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('CD - Blank', pref, 'cdArtBlankStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = true;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('CD - Transparent', pref, 'cdArtTransStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = true;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addSeparator();
	displayDiscArtMenu.addToggleItem('Vinyl - White', pref, 'vinylArtWhiteStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = true;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Void', pref, 'vinylArtVoidStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = true;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Cold fusion', pref, 'vinylArtColdFusionStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = true;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Ring of fire', pref, 'vinylArtRingOfFireStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = true;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Maple', pref, 'vinylArtMapleStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = true;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Black', pref, 'vinylArtBlackStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = true;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Black hole', pref, 'vinylArtBlackHoleStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = true;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Ebony', pref, 'vinylArtEbonyStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = true;
		pref.vinylArtTransStub      = false;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.addToggleItem('Vinyl - Transparent', pref, 'vinylArtTransStub',() => {
		pref.noDiscArtStub          = false;
		pref.cdArtWhiteStub         = false;
		pref.cdArtBlackStub         = false;
		pref.cdArtBlankStub         = false;
		pref.cdArtTransStub         = false;
		pref.vinylArtWhiteStub      = false;
		pref.vinylArtVoidStub       = false;
		pref.vinylArtColdFusionStub = false;
		pref.vinylArtRingOfFireStub = false;
		pref.vinylArtMapleStub      = false;
		pref.vinylArtBlackStub      = false;
		pref.vinylArtBlackHoleStub  = false;
		pref.vinylArtEbonyStub      = false;
		pref.vinylArtTransStub      = true;
		fetchNewArtwork(fb.GetNowPlaying());
		RepaintWindow();
	}, !pref.display_cdart);
	displayDiscArtMenu.appendTo(cdArtMenu);

	cdArtMenu.addToggleItem(`Display disc art if found (${settings.cdArtBasename}.png, ${settings.cdArtBasename}2.png, vinylA.png, etc.)`, pref, 'display_cdart', () => {
		if (fb.IsPlaying) fetchNewArtwork(fb.GetNowPlaying());
		lastLeftEdge = 0; // resize labels
		ResizeArtwork(true);
		RepaintWindow();
	});

	cdArtMenu.addToggleItem('Display disc art above cover', pref, 'cdart_ontop', () => RepaintWindow(), !pref.display_cdart);
	cdArtMenu.addToggleItem('Filter cd/vinyl .jpgs from artwork', pref, 'filterCdJpgsFromAlbumArt');
	cdArtMenu.addSeparator();
	cdArtMenu.addToggleItem('Spin disc art while songs play (increases memory and CPU)', pref, 'spinCdart', () => {
		if (pref.spinCdart) {
			setupRotationTimer();
		} else {
			clearInterval(cdartRotationTimer);
			cdartArray = [];
		}
	});
	cdArtMenu.createRadioSubMenu('# Rotation images (memory usage/rotational speed)', ['36 (10 degrees)', '45 (8 degrees)', '60 (6 degrees) (default)', '72 (5 degrees)', '90 (4 degrees)'], pref.spinCdArtImageCount, [36, 45, 60, 72, 90], (count) => {
		pref.spinCdArtImageCount = count;
		rotatedCdIndex = 0;
		cdartArray = [];
		RepaintWindow();
	}, !pref.spinCdart);
	cdArtMenu.createRadioSubMenu('Spinning disc art redraw speed', ['250ms (lower CPU)', '200ms', '150ms (default)', '125ms', '100ms', '75ms', '50ms (higher CPU)'], pref.spinCdArtRedrawInterval, [250, 200, 150, 125, 100, 75, 50], interval => {
		pref.spinCdArtRedrawInterval = interval;
		setupRotationTimer();
	}, !pref.spinCdart)
	cdArtMenu.addSeparator();
	cdArtMenu.addToggleItem('Rotate disc art as tracks change', pref, 'rotate_cdart', () => { RepaintWindow(); }, !pref.display_cdart || pref.spinCdart);
	cdArtMenu.createRadioSubMenu('Disc art rotation amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(pref.rotation_amt), [2,3,4,5], (rot) => {
		pref.rotation_amt = rot;
		CreateRotatedCDImage();
		RepaintWindow();
	}, !pref.rotate_cdart || pref.spinCdart);
	cdArtMenu.appendTo(detailsMenu);

	detailsMenu.appendTo(menu);

	// Library panel options

	const libraryMenu = new Menu('Library');
	libraryMenu.createRadioSubMenu('Design', ['Georgia-ReBORN', 'Ultra-modern', 'Modern', 'Traditional', 'List view', 'List view + album covers', 'List view + artist photos', 'Album covers', 'Flow mode', ], pref.libraryDesign,
	['reborn', 'ultraModern', 'modern', 'traditional', 'listView', 'listView_albumCovers', 'listView_artistPhotos', 'albumCovers', 'flowMode'], (mode) => {
		pref.libraryDesign = mode;
		if (pref.libraryDesign === 'reborn') {
			panel.set('quickSetup', 9);
		} else if (pref.libraryDesign === 'ultraModern') {
			panel.set('quickSetup', 2);
		} else if (pref.libraryDesign === 'modern') {
			panel.set('quickSetup', 1);
		} else if (pref.libraryDesign === 'traditional') {
			panel.set('quickSetup', 0);
		} else if (pref.libraryDesign === 'listView') {
			panel.set('quickSetup', 3);
		} else if (pref.libraryDesign === 'listView_albumCovers') {
			panel.set('quickSetup', 4);
		} else if (pref.libraryDesign === 'listView_artistPhotos') {
			panel.set('quickSetup', 5);
		} else if (pref.libraryDesign === 'albumCovers') {
			panel.set('quickSetup', 6);
		} else if (pref.libraryDesign === 'flowMode') {
			pref.libraryLayout = 'full_width';
			panel.set('quickSetup', 7);
		}
	});
	const libraryAlbumArtMenu = new Menu('Album art');
	libraryAlbumArtMenu.createRadioSubMenu('Layout', pref.libraryDesign === 'flowMode' ? ['Only "Full" available when flow mode is active'] : ['Normal', 'Full'], pref.libraryLayout, pref.libraryDesign === 'flowMode' ? ['full_width'] : ['normal_width', 'full_width'], function (libraryLayout) {
		pref.libraryLayout = libraryLayout;
		setLibrarySize();
		window.Repaint();
	}, !ppt.albumArtShow || ppt.albumArtShow && (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos'));
	libraryAlbumArtMenu.createRadioSubMenu('Thumbnail size', ['Auto (default)', 'Small', 'Regular', 'Medium', 'Large'], pref.libraryThumbnailSize, ['auto', 0,1,2,3], function (thumbnailSize) {
		pref.libraryThumbnailSize = thumbnailSize;
		if (pref.libraryThumbnailSize === 0) {
			ppt.thumbNailSize = 0;
		} else if (pref.libraryThumbnailSize === 1) {
			ppt.thumbNailSize = 1;
		} else if (pref.libraryThumbnailSize === 2) {
			ppt.thumbNailSize = 2;
		} else if (pref.libraryThumbnailSize === 3) {
			ppt.thumbNailSize = 3;
		}
		setLibrarySize();
		window.Repaint();
	}, !ppt.albumArtShow);
	if (!ppt.albumArtShow) {
		libraryAlbumArtMenu.addToggleItem('Activate options or change design to album art', ppt, 'albumArtShow', () => {
			if (pref.libraryDesign === 'flowMode') pref.libraryLayout = 'full_width';
			lib.logTree();
			pop.clearTree();
			ppt.toggle('albumArtShow');
			panel.imgView = ppt.albumArtShow = true;
			men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
			initLibraryPanel();
			setLibrarySize();
			initLibraryColors();
			displayPlaylist = false;
			displayLibrary = true;
			btns.library.enabled = true;
			btns.library.changeState(ButtonState.Down);
		}, ppt.albumArtShow);
		libraryAlbumArtMenu.addSeparator();
	}
	libraryAlbumArtMenu.appendTo(libraryMenu);

	const libraryViewMenu = new Menu('View');
	libraryViewMenu.addRadioItems(['Front (default)', 'Back', 'Disc', 'Icon', 'Artist'], ppt.artId, [0, 1, 2, 3, 4], function(view) {
		ppt.artId = view;
		men.setAlbumart(view)
		panel.updateProp(1);
	});
	libraryViewMenu.addSeparator();
	libraryViewMenu.addRadioItems(['Group: auto', 'Group: top level', 'Group: two levels'], ppt.albumArtGrpLevel, [0, 1, 2], function(view) {
		ppt.albumArtGrpLevel = view;
		men.setAlbumart(view - 5)
		panel.updateProp(1);
	});
	libraryViewMenu.appendTo(libraryAlbumArtMenu);

	const libraryImageMenu = new Menu('Image');
	libraryImageMenu.createRadioSubMenu('Front', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleFront, [0, 1, 2], function(style) {
		ppt.imgStyleFront = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Back', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleBack, [0, 1, 2], function(style) {
		ppt.imgStyleBack = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Disc', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleDisc, [0, 1, 2], function(style) {
		ppt.imgStyleDisc = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Icon', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleIcon, [0, 1, 2], function(style) {
		ppt.imgStyleIcon = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Artist', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleArtist, [0, 1, 2], function(style) {
		ppt.imgStyleArtist = style;
		panel.updateProp(1);
	});
	libraryImageMenu.appendTo(libraryAlbumArtMenu);

	const libraryLabelsMenu = new Menu('Labels');
	libraryLabelsMenu.addRadioItems(['Bottom (default)', 'Right', 'Blend', 'Dark', 'None'], ppt.albumArtLabelType, [1, 2, 3, 4, 0], (style) => {
		ppt.albumArtLabelType = style;
		panel.updateProp(1);
	});
	libraryLabelsMenu.addSeparator();
	libraryLabelsMenu.addToggleItem('Flip', ppt, 'albumArtFlipLabels', () => {  panel.updateProp(1); });
	libraryLabelsMenu.appendTo(libraryAlbumArtMenu);

	const libraryScrollBarMenu = new Menu('Scrollbar');
	libraryScrollBarMenu.addToggleItem('Auto-hide', pref, 'autoHideScrollbar_Library', () => {
		if (pref.autoHideScrollbar_Library) {
			g_properties.show_scrollbar = false;
			ppt.sbarShow = 1;
			setLibrarySize();
		} else {
			g_properties.show_scrollbar = true;
			ppt.sbarShow = 2;
			setLibrarySize();
		}
	});
	libraryScrollBarMenu.addToggleItem('Smooth scroll', ppt, 'smooth');
	libraryScrollBarMenu.appendTo(libraryMenu);
	libraryMenu.addSeparator();

	libraryMenu.createRadioSubMenu('Node root type', ['Hide', 'All Music', 'View name', 'Summary item'], ppt.rootNode, [0,1,2,3], function (nodeIndex) {
		ppt.rootNode = nodeIndex;
		panel.updateProp(1);
	});
	libraryMenu.createRadioSubMenu('Node item counts', ['Hidden', '# Tracks', '# Sub-Items'], ppt.nodeCounts, [0,1,2], function (nodeIndex) {
		ppt.nodeCounts = nodeIndex;
		panel.updateProp(1);
	});
	libraryMenu.createRadioSubMenu('Node item counts position', ['Right', 'Left'], ppt.countsRight, [true,false], function (nodeCounts) {
		ppt.countsRight = nodeCounts;
		panel.updateProp(1);
	});
	libraryMenu.createRadioSubMenu('Node auto collapse', ['On', 'Off'], ppt.autoCollapse, [true,false], function (nodeCollapse) {
		ppt.autoCollapse = nodeCollapse;
		panel.updateProp(1);
	});
	libraryMenu.addSeparator();

	libraryMenu.createRadioSubMenu('Double-click action', ['Send to playlist', 'Send to playlist and play', 'Expand/Collapse tree'], ppt.dblClickAction, [0,1,2], function(action) {
		ppt.dblClickAction = action;
	});
	libraryMenu.addSeparator();

	libraryMenu.addToggleItem('Remember library state', ppt, 'rememberTree', () => { panel.updateProp(1); });
	libraryMenu.addToggleItem('Full line clickable', ppt, 'fullLineSelection', () => { panel.updateProp(1); });
	libraryMenu.addToggleItem('Show now playing', ppt, 'highLightNowplaying', () => { panel.updateProp(1); });
	libraryMenu.addToggleItem('Show tooltips', ppt, 'tooltips', () => {
		if (ppt.tooltips) {
			ppt.tooltips = true;
			pref.show_truncatedText_tt = true;
			setLibrarySize();
		} else {
			ppt.tooltips = false;
			pref.show_truncatedText_tt = false;
			setLibrarySize();
		}
	});
	libraryMenu.addToggleItem('Show tracks when expanding nodes', ppt, 'showTracks', () => { pop.collapseAll(); panel.updateProp(1); });
	libraryMenu.addToggleItem('Show track count in album art', pref, 'showTrackCount', () => { panel.updateProp(1); });
	libraryMenu.addToggleItem('Show row stripes', ppt, 'rowStripes', () => { panel.updateProp(1); });
	libraryMenu.addToggleItem('Switch to playlist when adding songs', pref, 'libraryPlaylistSwitch');
	libraryMenu.addToggleItem('Always scroll to current playing song', pref, 'always_showPlayingLib');
	libraryMenu.addSeparator();
	libraryMenu.addToggleItem('Always load View by same as tree', ppt, 'artTreeSameView', () => { panel.updateProp(1); });
	libraryMenu.addToggleItem('Always load preset with current view pattern', ppt, 'presetLoadCurView', () => { panel.updateProp(1); });
	libraryMenu.addSeparator();
	libraryMenu.addToggleItem('Row mouse hover', pref, 'libraryRowHover', () => { RepaintWindow(); });
	libraryMenu.addSeparator();

	libraryMenu.addItem('Reset library zoom', false, () => {
		panel.zoomReset();
	});

	libraryMenu.appendTo(menu);

	// Biography panel options

	const biographyMenu = new Menu('Biography');

	const biographyThemeMenu = new Menu('Theme');
	biographyThemeMenu.addRadioItems(['Georgia-ReBORN', 'Dark', 'Blend', 'Light'], pref.biographyTheme, [0, 1, 2, 3], (theme) => {
		pref.biographyTheme = theme;
		if (pref.biographyTheme === 0) {
			pptBio.theme = 0; // User interface ( Default )
		} else if (pref.biographyTheme === 1) {
			pptBio.theme = 1; // Dark
		} else if (pref.biographyTheme === 2) {
			pptBio.theme = 2; // Blend
		} else if (pref.biographyTheme === 3) {
			pptBio.theme = 3; // Light
		}
		uiBio.updateProp(1);
		txt.refresh(4); // Needed to correctly update and paint Blend theme
		initTheme();
	});
	biographyThemeMenu.appendTo(biographyMenu);

	const biographyDisplayMenu = new Menu('Display');
	biographyDisplayMenu.addRadioItems(['Image + text', 'Image', 'Text'], pref.biographyDisplay, ['Image+text', 'Image', 'Text'], (display) => {
		pref.biographyDisplay = display;
		if (pref.biographyDisplay === 'Image+text') {
			pptBio.style = 0;
			pptBio.img_only = false;
			pptBio.text_only = false;
		} else if (pref.biographyDisplay === 'Image') {
			pptBio.img_only = true;
			pptBio.text_only = false;
		} else if (pref.biographyDisplay === 'Text') {
			pptBio.img_only = false;
			pptBio.text_only = true;
		}
		uiBio.updateProp(1);
	});
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addToggleItem('Filmstrip', pptBio, 'showFilmStrip', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addToggleItem('Seeker', pptBio, 'imgSeeker', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addToggleItem('Heading', pptBio, 'heading', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addRadioItems(['Artist view', 'Album view'], pptBio.artistView, [true, false], (view) => {
		pptBio.artistView = view;
		uiBio.updateProp(1);
	});
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addRadioItems(['Prefer now playing', 'Follow selected track (playlist)'], pptBio.focus, [false, true], (view) => {
		pptBio.focus = view;
		uiBio.updateProp(1);
	});
	biographyDisplayMenu.appendTo(biographyMenu);

	const biographyLayoutMenu = new Menu('Layout');
	biographyLayoutMenu.addRadioItems(['Top (default)', 'Right', 'Bottom', 'Left', 'Overlay'], pptBio.style, [0, 1, 2, 3, 4], (layout) => {
		pptBio.style = layout;
		uiBio.updateProp(1);
	});
	biographyLayoutMenu.addSeparator();
	biographyLayoutMenu.appendTo(biographyMenu);

	const biographyFilmstripMenu = new Menu('Filmstrip');
	biographyFilmstripMenu.addRadioItems(['Top', 'Right', 'Bottom', 'Left (default)'], pptBio.filmStripPos, [0, 1, 2, 3], (pos) => {
		pptBio.filmStripPos = pos;
		uiBio.updateProp(1);
	});
	biographyFilmstripMenu.appendTo(biographyLayoutMenu);

	const biographyImageMenu = new Menu('Image');
	const biographyImageDefaultMenu = new Menu('Image + text');
	biographyImageDefaultMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.artStyleDual, [0, 1, 2], function(style) {
		pptBio.artStyleDual = style;
		uiBio.updateProp(1);
	});
	biographyImageDefaultMenu.addToggleItem('Reflection', pptBio, 'artReflDual', () => { pptBio.artShadowDual = false; uiBio.updateProp(1); });
	biographyImageDefaultMenu.addToggleItem('Shadow', pptBio, 'artShadowDual', () => { pptBio.artReflDual = false; uiBio.updateProp(1); });
	biographyImageDefaultMenu.addSeparator();
	biographyImageDefaultMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.covStyleDual, [0, 1, 2], function(style) {
		pptBio.covStyleDual = style;
		uiBio.updateProp(1);
	});
	biographyImageDefaultMenu.addToggleItem('Reflection', pptBio, 'covReflDual', () => { pptBio.covShadowDual = false; uiBio.updateProp(1); });
	biographyImageDefaultMenu.addToggleItem('Shadow', pptBio, 'covShadowDual', () => { pptBio.covReflDual = false; uiBio.updateProp(1); });

	biographyImageDefaultMenu.appendTo(biographyImageMenu);
	const biographyImageOnlyMenu = new Menu('Image only');
	biographyImageOnlyMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.artStyleImgOnly, [0, 1, 2], function(style) {
		pptBio.artStyleImgOnly = style;
		uiBio.updateProp(1);
	});
	biographyImageOnlyMenu.addToggleItem('Reflection', pptBio, 'artReflImgOnly', () => { pptBio.artShadowImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.addToggleItem('Shadow', pptBio, 'artShadowImgOnly', () => { pptBio.artReflImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.addSeparator();
	biographyImageOnlyMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.covStyleImgOnly, [0, 1, 2], function(style) {
		pptBio.covStyleImgOnly = style;
		uiBio.updateProp(1);
	});
	biographyImageOnlyMenu.addToggleItem('Reflection', pptBio, 'covReflImgOnly', () => { pptBio.covShadowImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.addToggleItem('Shadow', pptBio, 'covShadowImgOnly', () => { pptBio.covReflImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.appendTo(biographyImageMenu);

	const biographyImageFilmstripMenu = new Menu('Filmstrip');
	biographyImageFilmstripMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.filmPhotoStyle, [0, 1, 2], function(style) {
		pptBio.filmPhotoStyle = style;
		uiBio.updateProp(1);
	});
	biographyImageFilmstripMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.filmCoverStyle, [0, 1, 2], function(style) {
		pptBio.filmCoverStyle = style;
		uiBio.updateProp(1);
	});
	biographyImageFilmstripMenu.appendTo(biographyImageMenu);
	biographyImageMenu.addSeparator();

	biographyImageMenu.addToggleItem('Auto cycle', pptBio, 'cycPic', () => { uiBio.updateProp(1); });
	biographyImageMenu.appendTo(biographyMenu);

	const biographySourcesMenu = new Menu('Sources');
	const biographyPreferLastfmMenu = new Menu('Biography: prefer last.fm');
	if (!pptBio.bothBio) {
		biographyPreferLastfmMenu.addRadioItems(['Prefer allmusic', 'Prefer last.fm'], pptBio.allmusic_bio, [true, false], function(source) {
			pptBio.allmusic_bio = source;
			uiBio.updateProp(1);
		});
		biographyPreferLastfmMenu.addSeparator();
	}
	biographyPreferLastfmMenu.addToggleItem('Prefer both', pptBio, 'bothBio', () => { uiBio.updateProp(1); });
	biographyPreferLastfmMenu.addSeparator();
	biographyPreferLastfmMenu.addToggleItem('Lock to single source', pptBio, 'lockBio', () => { uiBio.updateProp(1); }, pptBio.bothBio);
	biographyPreferLastfmMenu.appendTo(biographySourcesMenu);

	const biographyPreferAllmusicMenu = new Menu('Review: prefer allmusic');
	if (!pptBio.bothRev) {
		biographyPreferAllmusicMenu.addRadioItems(['Prefer allmusic', 'Prefer last.fm'], pptBio.allmusic_alb, [true, false], function(source) {
			pptBio.allmusic_alb = source;
			uiBio.updateProp(1);
		});
	}
	biographyPreferAllmusicMenu.addSeparator();
	biographyPreferAllmusicMenu.addToggleItem('Prefer both', pptBio, 'bothRev', () => { uiBio.updateProp(1); });
	biographyPreferAllmusicMenu.addSeparator();
	biographyPreferAllmusicMenu.addToggleItem('Lock to single source', pptBio, 'lockRev', () => { uiBio.updateProp(1); }, pptBio.bothRev);
	biographyPreferAllmusicMenu.addSeparator();
	biographyPreferAllmusicMenu.createRadioSubMenu('Last.fm type', ['Album', 'Album + track', 'Track'], pptBio.inclTrackRev, [0,1,2], function(source) {
		pptBio.inclTrackRev = source;
	});
	biographyPreferAllmusicMenu.appendTo(biographySourcesMenu);

	biographySourcesMenu.createRadioSubMenu('Photo: cycle', ['Cycle from folder', 'Artist (single image [fb2k: display])'], pptBio.cycPhoto, [true,false], function(cycle) {
		pptBio.cycPhoto = cycle;
	});

	const biographyCoverSrcMenu = new Menu('Cover: front');
	biographyCoverSrcMenu.createRadioSubMenu('Cycle', ['Front', 'Back', 'Disc', 'Icon', 'Artist'], pptBio.covType, [0, 1, 2, 3, 4], (cycle) => {
		pptBio.covType = cycle;
		uiBio.updateProp(1);
	}, !pptBio.loadCovAllFb);
	biographyCoverSrcMenu.addSeparator();
	biographyCoverSrcMenu.addToggleItem('Cycle above', pptBio, 'loadCovAllFb', () => {
		uiBio.updateProp(1);
	});
	biographyCoverSrcMenu.addToggleItem('Cycle from folder', pptBio, 'loadCovFolder', () => {
		pptBio.toggle(['cycPhoto', 'cycPhoto']);
		fb.ShowPopupMessage("Enter folder in options: \"Server Settings\"\\Cover\\Covers: cycle folder.\n\nDefault: artist photo folder.\n\nImages are updated when the album changes. Any images arriving after choosing the current album aren't included.", 'Biography: load folder for cover cycling');
		uiBio.updateProp(1);
	});
	biographyCoverSrcMenu.appendTo(biographySourcesMenu);

	biographySourcesMenu.appendTo(biographyMenu);

	const biographyScrollBarMenu = new Menu('Scrollbar');
	biographyScrollBarMenu.addToggleItem('Auto-hide', pref, 'autoHideScrollbar_Biography', () => {
		if (pref.autoHideScrollbar_Biography) {
			pptBio.sbarShow = 1;
			butBio.set_src_btn_hide();
			butBio.set_scroll_btns_hide();
			window.Repaint();
		} else {
			pptBio.sbarShow = 2;
			art_scrollbar.narrow = false;
			alb_scrollbar.narrow = false;
			butBio.set_scroll_btns_hide(false);
			art_scrollbar.resetAuto();
			alb_scrollbar.resetAuto();
			window.Repaint();
		}
	});
	biographyScrollBarMenu.addToggleItem('Smooth scroll', ppt, 'smooth');
	biographyScrollBarMenu.appendTo(biographyMenu);

	biographyMenu.appendTo(menu);

	// Lyrics panel options

	const lyricsMenu = new Menu('Lyrics');
	lyricsMenu.addToggleItem('Remember lyrics setting after restart', pref, 'lyricsRememberDisplay');
	lyricsMenu.appendTo(menu);

	menu.addSeparator();

	// Settings options

	const settingsMenu = new Menu('Settings');
	// Disabled for now, waiting for TheQwertiest to implement callback funcs for SMP panel properties - Clear, Import, Export
	// const themeSettingsMenu = new Menu('Theme settings');
	// themeSettingsMenu.addItem('Create a backup', false, () => { window.ShowProperties(); });
	// themeSettingsMenu.addItem('Restore a backup', false, () => { window.ShowProperties(); });
	// themeSettingsMenu.addSeparator();
	// themeSettingsMenu.addItem('Reset all', false, () => {
	// 	const msg = '                                        Do you want to reset all theme settings to default?\n\nThis will also clear all library custom views and filters and resets all biography server settings.\n\n                                                                           Continue?';
	// 	const continue_confirmation = (status, confirmed) => {
	// 		if (confirmed) {
	// 			was_first_launch = pref.is_first_launch;
	// 			pref.is_first_launch = true; // reset all Georgia-ReBORN theme settings
	// 			panel.updateProp(ppt, 'default_value'); // reset all library panel settings
	// 			uiBio.updateProp(pptBio, 'default_value'); // reset all biography panel settings
	// 			const serverBio = new SettingsBio;
	// 			serverBio.resetCfg(); // reset all biography server settings
	// 			return was_first_launch;
	// 		}
	// 	}
	// 	popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', continue_confirmation);
	// });
	// themeSettingsMenu.appendTo(settingsMenu);

	const configMenu = new Menu('Theme configuration');
	configMenu.addItem('Edit configuration file', false, () => { _.runCmd(config.getPath()); });
	configMenu.addToggleItem('Reload configuration', pref, 'show_reload_button', () => { window.Reload(); });
	configMenu.addItem('Reset configuration file', false, () => { config.resetConfiguration(); });
	configMenu.appendTo(settingsMenu);
	settingsMenu.addSeparator();
	settingsMenu.addToggleItem('Developer tools', pref, 'devTools', () => { if (pref.devTools) settings.locked = false; else settings.locked = true; });
	settingsMenu.addToggleItem('Disable right-click', settings, 'locked');
	settingsMenu.appendTo(menu);
	if (pref.devTools) menu.addSeparator();

	// Developer options

	if (pref.devTools) {
		const debugMenu = new Menu('Developer tools');
		debugMenu.addToggleItem('Enable debug output', settings, 'showDebugLog');
		debugMenu.addItem('Enable theme debug output', settings.showThemeLog, () => {
			settings.showThemeLog = !settings.showThemeLog;
			if (settings.showThemeLog) {
				albumart = null;
				on_playback_new_track(fb.GetNowPlaying());
			}
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show draw timing (doesn\'t persist)', timings, 'showDrawTiming');
		debugMenu.addToggleItem('Show extra draw timing (doesn\'t persist)', timings, 'showExtraDrawTiming');
		debugMenu.addToggleItem('Show debug timing (doesn\'t persist)', timings, 'showDebugTiming');
		debugMenu.addToggleItem('Show RepaintRect areas (doesn\'t persist)', timings, 'drawRepaintRects', (val) => {
			if (!val) { repaintRects = []; window.Repaint(); }
		});
		debugMenu.appendTo(menu);
	}

	var idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);

	menu_down = false;
}


// -----------------------------------------------------------------------
// CALLBACKS
// -----------------------------------------------------------------------

// custom initialisation function for themes
function initTheme() {
	console.log("initTheme()");
	lastFolder = '';

	// Main Colors
	initColors();
	createButtonImages();
	createButtonObjects(ww, wh);
	// Playlist Colors
	initPlaylistColors();
	// Library Colors
	initLibraryColors();
	but.createImages();
	but.refresh(true);
	// Biography Colors
	uiBio.getColours();
	alb_scrollbar.setCol();
	art_scrollbar.setCol();
	butBio.createImages('all');
	imgBio.createImages();
	initBiographyColors();

	if (pref.rebornTheme) { // Needed to init col.primary once again when !albumart, switching through themes and going back to Reborn theme
		initColors();
		initPlaylistColors();
		createButtonImages();
		createButtonObjects(ww, wh);
		playlist.on_size(ww, wh); // Needed to update playlist scrollbar colors -> calling on_size(); from Control_List
	}

	initButtonState();
	if (pref.playlistRowHover) repaintPlaylistRows();
	window.Repaint();
}

// custom initialisation function, called once after variable declarations
function on_init() {
	console.log("in on_init()");

	/** Added additional conditions to show playlist and not 'Details' in Compact Mode if playlist is not displayed on startup while starting in Compact Mode,
		this also fixes ugly switch from Default to Compact Mode */
	if (pref.startPlaylist && !displayPlaylist && !displayLibrary && !displayBiography && pref.layout_mode !== 'artwork_mode' || !pref.startPlaylist && pref.layout_mode === 'compact_mode') {
		displayPlaylist = true;
	}

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
	if (pref.rebornTheme) {
		setTheme(rebornTheme.colors);
	} else {
		setTheme(whiteTheme.colors);
	}
	themeColorSet = true;

	if (displayPlaylist || displayPlaylistArtworkMode) {
		playlist.on_size(ww, wh);
	}
	else if (displayLibrary) {
		initLibraryPanel();
		setLibrarySize();
	}
	else if (displayBiography) {
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

	// /** Added additional conditions to show playlist and not 'Details' in Compact Mode if playlist is not displayed on startup while starting in Compact Mode,
	// 	this also fixes ugly switch from Default to Compact Mode */
	// if (pref.startPlaylist && !displayPlaylist && !displayLibrary && !displayBiography && pref.layout_mode !== 'artwork_mode' || !pref.startPlaylist && pref.layout_mode === 'compact_mode') {
	// 	displayPlaylist = false;
	// 	setTimeout(() => {
	// 		if (btns && btns.playlist) {
	// 			btns.playlist.onClick();	// displays playlist
	// 		}
	// 	}, 30);
	// }

	if (!libraryInitialized) {
		initLibraryPanel(); // Need to init library right away, otherwise we get in trouble in library options -> panel.updateProp(1); if !libraryInitialized ( i.e user didn't click displayLibrary )
		setTimeout(() => {
			panel.updateProp(1); // Wait for full library init and update library tree, otherwise some nodes are not painted correctly
		}, 500);
	}
	if (!biographyInitialized) {
		initBiographyPanel();
	}
}

// window size changed
function on_size() {
	ww = window.Width;
	wh = window.Height;

	if (pref.layout_mode === 'default_mode' && ww === 1140 && wh === 730  || pref.layout_mode === 'artwork_mode' && ww === 526  && wh === 686   || pref.layout_mode === 'compact_mode' && ww === 484  && wh === 730)  pref.player_small     = true; else pref.player_small     = false;
	if (pref.layout_mode === 'default_mode' && ww === 1600 && wh === 960  || pref.layout_mode === 'artwork_mode' && ww === 700  && wh === 860   || pref.layout_mode === 'compact_mode' && ww === 484  && wh === 960)  pref.player_normal    = true; else pref.player_normal    = false;
	if (pref.layout_mode === 'default_mode' && ww === 1802 && wh === 1061 || pref.layout_mode === 'artwork_mode' && ww === 901  && wh === 1062  || pref.layout_mode === 'compact_mode' && ww === 1600 && wh === 960)  pref.player_large     = true; else pref.player_large     = false;
	if (pref.layout_mode === 'default_mode' && ww === 2300 && wh === 1470 || pref.layout_mode === 'artwork_mode' && ww === 1052 && wh === 1372  || pref.layout_mode === 'compact_mode' && ww === 964  && wh === 1470) pref.player_4k_small  = true; else pref.player_4k_small  = false;
	if (pref.layout_mode === 'default_mode' && ww === 2800 && wh === 1720 || pref.layout_mode === 'artwork_mode' && ww === 1400 && wh === 1720  || pref.layout_mode === 'compact_mode' && ww === 964  && wh === 1720) pref.player_4k_normal = true; else pref.player_4k_normal = false;
	if (pref.layout_mode === 'default_mode' && ww === 3400 && wh === 2020 || pref.layout_mode === 'artwork_mode' && ww === 1699 && wh === 2020  || pref.layout_mode === 'compact_mode' && ww === 2800 && wh === 1720) pref.player_4k_large  = true; else pref.player_4k_large  = false;

	console.log(`in on_size() => width: ${ww}, height: ${wh}`);

	if (ww <= 0 || wh <= 0) return;

	checkFor4k(ww, wh);

	if (sizeInitialized) reinitPlaylist(); // TODO: Is there another workaround? It's a performance killer when active playlist has a ridicouls amount of tracks - Needed to reposition playlist panel after player size has changed

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
		if (str.metadataGrid_tt) {
			str.metadataGrid_tt.setHeight(geo.metadataGrid_tt_h);
		}
	}
	progressBar && progressBar.on_size(ww, wh);

	lastLeftEdge = 0;

	ResizeArtwork(true);
	createButtonImages();
	createButtonObjects(ww, wh);

	if (displayPlaylist || displayPlaylistArtworkMode) {
		playlist.on_size(ww, wh);
	}
	if (displayLibrary) {
		initLibraryPanel();
		setLibrarySize();
	}
	if (displayBiography) {
		initBiographyPanel();
		setBiographySize();
	}

	initButtonState();

	// UIHacks double click on caption in fullscreen
	if (!componentUiHacks) return;

	try { // Needed when double clicking on caption and UIHacks.FullScreen == true; also disabling maximize in Artwork mode
		if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState == WindowState.Normal || pref.layout_mode === 'artwork_mode' && UIHacks.MainWindowState == WindowState.Maximized) {
			UIHacks.MainWindowState = WindowState.Normal;
		}
	} catch (e) {};
}

function initButtonState() {
	if (!displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics && pref.layout_mode !== 'artwork_mode') {
		btns.playlist.enabled = true;
		btns.playlist.changeState(ButtonState.Down);
	}
	else if (displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics && pref.layout_mode === 'artwork_mode') {
		btns.playlist.enabled = true;
		btns.playlist.changeState(ButtonState.Down);
	}
	else if (displayPlaylistArtworkMode && !displayLibrary && !displayBiography && !pref.displayLyrics && pref.layout_mode === 'artwork_mode') {
		btns.playlistArtworkMode.enabled = true;
		btns.playlistArtworkMode.changeState(ButtonState.Down);
	}
	else if (displayLibrary) {
		if (!displayPlaylist) { // Fixes active library button state when switching from Artwork mode to Default mode and pref.startPlaylist is active
			btns.library.enabled = true;
			btns.library.changeState(ButtonState.Down);
		}
	}
	else if (pref.displayLyrics) {
		btns.lyrics.enabled = true;
		btns.lyrics.changeState(ButtonState.Down);
	}
	else if (displayBiography) {
		btns.biography.enabled = true;
		btns.biography.changeState(ButtonState.Down);
	}
	else if (!pref.startPlaylist && pref.displayLyrics) {
		btns.playlist.enabled = true;
		btns.playlist.changeState(ButtonState.Down);
	}
}

function setLibrarySize() {
	if (typeof libraryPanel !== 'undefined') {
		var x = pref.layout_mode === 'artwork_mode' || pref.libraryLayout === 'full_width' || (pref.libraryDesign === 'library_flowMode' && ppt.albumArtShow) ? 0 : Math.round(ww * .5);
		var y = geo.top_art_spacing;
		var lowerSpace = calcLowerSpace();
		var library_w = pref.layout_mode === 'artwork_mode' || pref.libraryLayout === 'full_width' || (pref.libraryDesign === 'library_flowMode' && ppt.albumArtShow) ? ww : ww - x;
		var library_h = Math.max(0, wh - lowerSpace - y);
		ppt.zoomNode = 100; // Sets correct node zoom value, i.e when switching to 4K
		panel.setTopBar();	// Resets filter font in case the zoom was reset, also needed when changing font size
		initLibraryColors();
		libraryPanel.on_size(x, y, library_w, library_h);
	} else {
		// TODO: take this if/else out once this part is done
		displayLibrary = false;
	}
}

function setBiographySize() {
	if (typeof biographyPanel !== 'undefined') {
		var x = pptBio.borL;
		var y = pptBio.borT;
		var lowerSpace = calcLowerSpace();
		var biography_w = pref.layout_mode === 'artwork_mode' ? ww : ww / 2;
		var biography_h = Math.max(0, wh - lowerSpace - y);
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

	if (displayPlaylist || displayPlaylistArtworkMode) {
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
	str.metadataGrid_tt = new MetadataGrid_tt(geo.metadataGrid_tt_h);

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
	if (pref.rotate_cdart && !pref.spinCdart) {
		CreateRotatedCDImage(); // we need to always setup the rotated image because it rotates on every track
	}

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

	if (displayPlaylist || displayPlaylistArtworkMode || !displayPlaylist) {
		playlist.on_playback_new_track(metadb);
	}
	if (displayLibrary) {
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
			var composer = $(tf.composer);
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
			str.composer = composer;
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
			} else if (pref.layout_mode === 'artwork_mode') {
				str.disc = fb.TitleFormat(tf.disc).Eval();
			} else if (pref.layout_mode === 'compact_mode') {
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
			if (str.timeline) { // TODO: figure out why this is null for foo_input_spotify
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

			if (pref.show_flags_details || pref.show_flags_lowerbar) {
				loadCountryFlags();
			}
			if (settings.showReleaseCountryFlag) {
				loadReleaseCountryFlag();
			}
		}
	}
	if (handle_list) {	// not called manually from on_playback_new_track
		if (displayPlaylist || displayPlaylistArtworkMode || !displayPlaylist) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_metadb_changed(handle_list, fromhook);
		}
		if (displayLibrary) {
			library.on_metadb_changed(handle_list, fromhook);
		}
		if (displayBiography) {
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

	// Link foobar's playback order menu functions with playback order button
	if ((transport.show_playbackOrder_default || transport.show_playbackOrder_artwork || transport.show_playbackOrder_compact) && (transport.enableTransportControls_default && transport.enableTransportControls_artwork && transport.enableTransportControls_compact)) {
		pbo = this_pb;
		if (pbo === PlaybackOrder.Default) {
			pref.playbackOrder = 'Default';
			btns.playbackOrder.img = btnImg.PlaybackDefault;
		}
		else if (pbo === PlaybackOrder.RepeatTrack || pbo === PlaybackOrder.RepeatPlaylist) {
			pref.playbackOrder = 'Repeat';
			btns.playbackOrder.img = btnImg.PlaybackReplay;
		}
		else if (pbo === PlaybackOrder.ShuffleTracks || pbo === PlaybackOrder.ShuffleAlbums || pbo === PlaybackOrder.ShuffleFolders || pbo === PlaybackOrder.Random) {
			pref.playbackOrder = 'Shuffle';
			btns.playbackOrder.img = btnImg.PlaybackShuffle;
		}
	} else if ((!transport.show_playbackOrder_default || !transport.show_playbackOrder_artwork || !transport.show_playbackOrder_compact) || (!transport.enableTransportControls_default || !transport.enableTransportControls_artwork || !transport.enableTransportControls_compact)) {
		pbo = this_pb;
		if (pbo === PlaybackOrder.Default) {
			pref.playbackOrder = 'Default';
		}
		else if (pbo === PlaybackOrder.RepeatTrack) {
			pref.playbackOrder = 'Repeat';
		}
		else if (pbo === PlaybackOrder.ShuffleTracks) {
			pref.playbackOrder = 'Shuffle';
		}
	}
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
			if (pref.show_progress_bar_default && y >= wh - 0.5 * geo.lower_bar_h && y <= wh - 0.5 * geo.lower_bar_h + geo.prog_bar_h && x >= 0.025 * ww && x < 0.975 * ww) {
				var v = (x - 0.025 * ww) / (0.95 * ww);
				v = (v < 0) ? 0 : (v < 1) ? v : 1;
				if (fb.PlaybackTime != v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
				window.RepaintRect(0, wh - geo.lower_bar_h, ww, geo.lower_bar_h);
			}
		} else if (pref.layout_mode === 'artwork_mode') {
			// clicking on progress bar
			if (pref.show_progress_bar_artwork && y >= wh - 0.5 * geo.lower_bar_h && y <= wh - 0.5 * geo.lower_bar_h + geo.prog_bar_h - 20 && x >= 0.025 * ww && x < 0.975 * ww) {
				var v = (x - 0.025 * ww) / (0.95 * ww);
				v = (v < 0) ? 0 : (v < 1) ? v : 1;
				if (fb.PlaybackTime != v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
				window.RepaintRect(0, wh - geo.lower_bar_h, ww, geo.lower_bar_h);
			}
		} else if (pref.layout_mode === 'compact_mode') {
			// clicking on progress bar
			if (pref.show_progress_bar_compact && y >= wh - 0.5 * geo.lower_bar_h && y <= wh - 0.5 * geo.lower_bar_h + geo.prog_bar_h - 20 && x >= 0.025 * ww && x < 0.975 * ww) {
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

		if ((displayPlaylist || displayPlaylistArtworkMode) && playlist.mouse_in_this(x, y)) {// && playlist.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_mouse_lbtn_down(x, y, m);
		}
		else if (displayLibrary && library.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_lbtn_down(x, y, m);
		}
		else if (displayBiography && biography.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			biography.on_mouse_lbtn_down(x, y, m);
		}
	}
}

function on_mouse_lbtn_up(x, y, m) {
	progressBar.on_mouse_lbtn_up(x, y);

	if (!volume_btn.on_mouse_lbtn_up(x, y, m)) {
		// not handled by volume_btn
		if (displayPlaylist || displayPlaylistArtworkMode) { // && playlist.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_mouse_lbtn_up(x, y, m);

			qwr_utils.EnableSizing(m);
		}
		else if (displayLibrary) { // && library.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_lbtn_up(x, y, m);
		}
		if (displayBiography && state.mouse_x > uiBio.x && state.mouse_x <= uiBio.x + uiBio.w &&
			state.mouse_y > uiBio.y && state.mouse_y <= uiBio.y + uiBio.h) {
			trace_call && console.log(qwr_utils.function_name());
			biography.on_mouse_lbtn_up(x, y, m);
		}

		if (just_dblclicked) {
			// You just did a double-click, so do nothing
			just_dblclicked = false;
		}
		/** Workaround when using maximize ( double click on top menu ) by adding additional condition UIHacks.MainWindowState == WindowState.Normal otherwise registered
			on_mouse_lbtn_up click will be in Y-hitarea causing unnecessary pause when maximized/enlarged. In maximized state pauseBtn.mouseInThis area is much bigger */
		if (albumart && !displayBiography && (pref.layout_mode === 'default_mode' || !displayPlaylistArtworkMode && !displayLibrary && pref.layout_mode === 'artwork_mode') && (UIHacks.MainWindowState == WindowState.Normal || pauseBtn.mouseInThis(x, y))) {
			if ((albumart_size.x <= x && albumart_size.y <= y && albumart_size.x + albumart_size.w >= x && albumart_size.y + albumart_size.h >= y) ||
				(cdart && !albumart && cdart_size.x <= x && cdart_size.y <= y && cdart_size.x + cdart_size.w >= x && cdart_size.y + cdart_size.h >= y) || pauseBtn.mouseInThis(x, y)) {
				// Do not pause when library is in flow mode or library layout is in full width
				if (!(ppt.albumArtShow && pref.libraryLayout === 'full_width' && displayLibrary || pref.libraryDesign === 'flowMode' && pref.libraryLayout === 'full_width' && displayLibrary || pref.libraryDesign === 'albumCovers' && pref.libraryLayout === 'full_width' && displayLibrary)) {
					fb.PlayOrPause();
				}
			}
		}
		else if (!albumart && !displayBiography && (pref.layout_mode === 'default_mode' || !displayPlaylistArtworkMode && !displayLibrary && pref.layout_mode === 'artwork_mode') && (UIHacks.MainWindowState == WindowState.Normal || pauseBtn.mouseInThis(x, y))) {
			if (state.mouse_x > 0 && state.mouse_x <= (displayPlaylist || displayLibrary ? ww / 2 : !displayPlaylist || !displayLibrary ? ww :  ww / 2) &&
				state.mouse_y > albumart_size.y && state.mouse_y <= albumart_size.h + geo.top_art_spacing || pauseBtn.mouseInThis(x, y)) {
				// Do not pause when library is in flow mode or library layout is in full width
				if (!(ppt.albumArtShow && pref.libraryLayout === 'full_width' && displayLibrary || pref.libraryDesign === 'flowMode' && pref.libraryLayout === 'full_width' && displayLibrary || pref.libraryDesign === 'albumCovers' && pref.libraryLayout === 'full_width' && displayLibrary)) {
					fb.PlayOrPause();
				}
			}
		}
		on_mouse_move(x, y);
		buttonEventHandler(x, y, m);
	}
}

function on_mouse_lbtn_dblclk(x, y, m) {
	if ((displayPlaylist || displayPlaylistArtworkMode) && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayBiography && biography.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_mouse_lbtn_dblclk(x, y, m);
	}
	else {
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
	if ((displayPlaylist || displayPlaylistArtworkMode) && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_rbtn_down(x, y, m);
	}
	else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		// library.on_mouse_rbtn_down(x, y, m);
	}
}

function on_mouse_rbtn_up(x, y, m) {
	if (((fb.IsPlaying || fb.IsPaused) && !displayBiography && (pref.layout_mode === 'default_mode' || !displayPlaylistArtworkMode && !displayLibrary && pref.layout_mode === 'artwork_mode')) &&
		state.mouse_x > 0 && state.mouse_x <= ((isStreaming || !albumart && noArtwork || albumart) && (displayPlaylist || displayLibrary) && pref.layout_mode === 'default_mode' ? ww / 2 : !displayPlaylist || !displayLibrary ? ww : albumart_size.w) &&
		state.mouse_y > albumart_size.y && state.mouse_y <= albumart_size.h + geo.top_art_spacing) {

		// Do not show album cover context menu when library is in flow mode or library layout is in full width
		if (!(ppt.albumArtShow && pref.libraryLayout === 'full_width' || (pref.libraryDesign === 'flowMode' || pref.libraryDesign === 'albumCovers') && pref.libraryLayout === 'full_width' && displayLibrary)) {
			trace_call && console.log(qwr_utils.function_name());
			const cmac = new ContextMainMenu();
			qwr_utils.append_albumCover_context_menu_to(cmac);

			menu_down = true;
			cmac.execute(x, y);
			menu_down = false;

			return true;
		}
	}
	if ((displayPlaylist || displayPlaylistArtworkMode) && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return playlist.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return library.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayBiography && biography.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return biography.on_mouse_rbtn_up(x, y, m);
	}
	else
		return settings.locked;
}

function on_mouse_move(x, y, m) {
	if (x != state.mouse_x || y != state.mouse_y) {

		if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
			g_tooltip.SetFont('Segoe UI', scaleForDisplay(15));
			g_tooltip.SetMaxWidth(scaleForDisplay(400));
		} else {
			g_tooltip.SetFont('Segoe UI', scaleForDisplay(15));
			g_tooltip.SetMaxWidth(scaleForDisplay(800));
		}

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

		if ((displayPlaylist || displayPlaylistArtworkMode) && playlist.mouse_in_this(x, y)) {
			trace_call && trace_on_move && console.log(qwr_utils.function_name());

			if (mouse_move_suppress.is_supressed(x, y, m)) {
				return;
			}

			qwr_utils.DisableSizing(m);
			playlist.on_mouse_move(x, y, m);
		}
		else if (displayLibrary && library.mouse_in_this(x, y)) {
			library.on_mouse_move(x, y, m);
		}
		else if (displayBiography && biography.mouse_in_this(x, y)) {
			biography.on_mouse_move(x, y, m);
		}
		if (str.timeline && str.timeline.mouseInThis(x, y) && (pref.layout_mode === 'default_mode' && !displayPlaylist || pref.layout_mode === 'artwork_mode' && displayPlaylist)) { // Prevent tooltips on album cover when Artwork mode is active
			str.timeline.on_mouse_move(x, y, m);
		}
		if (str.metadataGrid_tt && str.metadataGrid_tt.mouseInThis(x, y)) {
			str.metadataGrid_tt.on_mouse_move(x, y, m);
		}
		if ((transport.enableTransportControls_default && pref.layout_mode === 'default_mode' || transport.enableTransportControls_artwork && pref.layout_mode === 'artwork_mode' || transport.enableTransportControls_compact && pref.layout_mode === 'compact_mode') &&
			(transport.show_volume_default && pref.layout_mode === 'default_mode' || transport.show_volume_artwork && pref.layout_mode === 'artwork_mode' || transport.show_volume_compact && pref.layout_mode === 'compact_mode') && volume_btn) {
			volume_btn.on_mouse_move(x, y, m);
		}

		// UIHacks
		if (!mouseInPanel) mouseInPanel = true;
		if (!componentUiHacks) return;

		try {
			if (mouseInControl || downButton) {
				UIHacks.SetPseudoCaption(0, 0, 0, 0);

				if (UIHacks.FrameStyle == 3) UIHacks.DisableSizing = true;
					pseudoCaption = false;

			} else if (!pseudoCaption || pseudoCaptionWidth != ww) {

				if (pref.layout_mode === 'default_mode') {
					UIHacks.SetPseudoCaption(0, 0, ww, geo.top_art_spacing);
				}
				if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
					UIHacks.SetPseudoCaption(0, 0, ww, geo.top_art_spacing + scaleForDisplay(5));
				}

				if (UIHacks.FrameStyle == 3) UIHacks.DisableSizing = false;
					pseudoCaption = true;
					pseudoCaptionWidth = ww;
			}
		} catch (e) {};
	}
}

function on_mouse_wheel(delta) {
	if (transport.show_volume_default && pref.layout_mode === 'default_mode' || transport.show_volume_artwork && pref.layout_mode === 'artwork_mode' || transport.show_volume_compact && pref.layout_mode === 'compact_mode') {
		if (volume_btn.on_mouse_wheel(delta)) return;
	}
	if (state.mouse_y > wh - geo.lower_bar_h) {
		fb.PlaybackTime = fb.PlaybackTime - delta * pref.mouse_wheel_seek_speed;
		refresh_seekbar();
		return;
	}
	if (pref.cycleArtMWheel && aa_list.length > 1 && (!pref.displayLyrics && !displayBiography && (!(displayLibrary && pref.layout_mode === 'artwork_mode')) && !displayPlaylistArtworkMode && pref.libraryLayout !== 'full_width') &&
		state.mouse_x > albumart_size.x && state.mouse_x <= albumart_size.x + albumart_size.w && state.mouse_y > albumart_size.y && state.mouse_y <= albumart_size.y + albumart_size.h) {
		if (delta > 0) { // Prev
			if (albumArtIndex !== 0) albumArtIndex = (albumArtIndex - 1) % aa_list.length;
		} else { // Next
			if (albumArtIndex !== aa_list.length - 1) albumArtIndex = (albumArtIndex + 1) % aa_list.length;
		}
		loadImageFromAlbumArtList(albumArtIndex, true);
		lastLeftEdge = 0;
		RepaintWindow();
	} else {
		if (pref.displayLyrics && state.mouse_x > albumart_size.x && state.mouse_x <= albumart_size.x + albumart_size.w &&
			state.mouse_y > albumart_size.y && state.mouse_y <= albumart_size.y + albumart_size.h) {
			gLyrics.on_mouse_wheel(delta);
		}
		else if (displayBiography && state.mouse_x > uiBio.x && state.mouse_x <= uiBio.x + uiBio.w &&
			state.mouse_y > uiBio.y && state.mouse_y <= uiBio.y + uiBio.h) {
			biography.on_mouse_wheel(delta);
		}
		else if (displayPlaylist || displayPlaylistArtworkMode) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_mouse_wheel(delta);
		}
		else if (displayLibrary) {
			// trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_wheel(delta);
		}
	}
}
// =================================================== //

function on_mouse_leave() {

	if (transport.show_volume_default && pref.layout_mode === 'default_mode' || transport.show_volume_compact && pref.layout_mode === 'compact_mode') {
		volume_btn.on_mouse_leave();
	}
	if (displayPlaylist || displayPlaylistArtworkMode) {
		playlist.on_mouse_leave();
	}
	else if (displayLibrary) {
		library.on_mouse_leave();
	}
	else if (displayBiography) {
		biography.on_mouse_leave();
	}
}

function on_playlists_changed() {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlists_changed();
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlists_changed();
	}
}

function on_playlist_switch() {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_switch();
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlist_switch();
	}
}

function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}

function on_playlist_items_added(playlistIndex) {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_added(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlist_items_added(playlistIndex);
	}
}

function on_playlist_items_reordered(playlistIndex) {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_reordered(playlistIndex);
	}
}

function on_playlist_items_removed(playlistIndex) {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_removed(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_playlist_items_removed(playlistIndex);
	}
}

function on_playlist_items_selection_change() {
	if (displayPlaylist || displayPlaylistArtworkMode) {
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
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_item_focus_change(playlist_arg, from, to);
	}
	else if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_item_focus_change();
	}
	else if (displayBiography) {
		trace_call && console.log(qwr_utils.function_name());
		biography.on_item_focus_change();
	}
}

function on_key_down(vkey) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());

		if (key_down_suppress.is_supressed(vkey)) {
			return;
		}

		playlist.on_key_down(vkey);
	}
	else if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_key_down(vkey);
	}
	else if (displayBiography) {
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
				} else if (!metadb && (displayPlaylist || displayPlaylistArtworkMode)) {
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
		window.RepaintRect(0, geo.top_art_spacing, Math.max(albumart_size.x, scaleForDisplay(40)), wh - geo.top_art_spacing - geo.lower_bar_h);
	} else { // unpausing
		clearInterval(progressBarTimer); // clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		debugLog("on_playback_pause: creating refresh_seekbar() interval with delay = " + t_interval);
		progressBarTimer = setInterval(() => {
			refresh_seekbar();
		}, t_interval);
		cdart && pref.spinCdart && setupRotationTimer();
	}

	pauseBtn.repaint();
	if ((albumart || noAlbumArtStub) && pref.displayLyrics) { // if we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		gLyrics.on_playback_pause(pausing);
	}

	if (displayPlaylist || displayPlaylistArtworkMode) {
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
	if (displayPlaylist || displayPlaylistArtworkMode) {
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
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_enter(action, x, y, mask);
	}
}

function on_drag_leave() {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_leave();
	}
}

function on_drag_drop(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_drop(action, x, y, mask);
	}
}

function on_focus(is_focused) {
	if (displayPlaylist || displayPlaylistArtworkMode) {
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
	if (displayPlaylist || displayPlaylistArtworkMode) {
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
	if (displayPlaylist || displayPlaylistArtworkMode) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	else if (displayLibrary) {
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
	if (panelBio.serverBio) {window.NotifyOthers("script_unload_bio", 0); timerBio.clear(timerBio.img);} butBio.on_script_unload();
}

// Timed events

function on_playback_time() {
	// Refresh playback time
	str.time = pref.switchPlaybackTime ? $('-%playback_time_remaining%') : $('%playback_time%');
}

function refresh_seekbar() {
	if (pref.layout_mode === 'default_mode') {
		window.RepaintRect(scaleForDisplay(40), wh - geo.lower_bar_h, ww - scaleForDisplay(80), geo.lower_bar_h, pref.spinCdart && !pref.displayLyrics);
	}
	if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
		window.RepaintRect(scaleForDisplay(20), wh - geo.lower_bar_h, ww - scaleForDisplay(40), geo.lower_bar_h, pref.spinCdart && !pref.displayLyrics);
	}
}

// TIMER Callback functions
function displayNextImage() {
	debugLog("Repainting in displayNextImage: " + albumArtIndex);
	albumArtIndex = (albumArtIndex + 1) % aa_list.length;
	loadImageFromAlbumArtList(albumArtIndex, true);
	lastLeftEdge = 0;
	if (pref.rebornTheme) initTheme();
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
				shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + 4, cdart_size.w - shadowOffset - 2, cdart_size.w - shadowOffset - 2, geo.aa_shadow, col.discArtShadow); // outer shadow
				shimg.DrawEllipse(xVal + geo.aa_shadow + offset - 2, offset + geo.aa_shadow + 1, cdart_size.w - offset * 2, cdart_size.h - offset * 2, 60, col.discArtShadow); // inner shadow
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
			while (t_interval < 32) // roughly 30fps
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
			if (pref.rebornTheme) initTheme();
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
	return geo.lower_bar_h;
}

function ResizeArtwork(resetCDPosition) {
	debugLog('Resizing artwork');
	var hasArtwork = false;
	var lowerSpace = calcLowerSpace();
	if (albumart && albumart.Width && albumart.Height) {
		// Size for big albumart
		let xCenter = 0;
		var album_scale = pref.layout_mode === 'artwork_mode' ?
		Math.min((ww / albumart.Width), (wh - lowerSpace - geo.top_art_spacing) / albumart.Height) :
		Math.min(((displayPlaylist || displayLibrary) ? 0.50 * ww : 0.75 * ww) / albumart.Width, (wh - lowerSpace - geo.top_art_spacing) / albumart.Height);
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
		// UIHacks FullScreen Artwork & Biography Panel Padding Reposition
		if (UIHacks.FullScreen && (displayPlaylist || displayLibrary)) {
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.545 * ww : 0.75 * ww) / albumart.Width, (wh - lowerSpace - geo.top_art_spacing) / albumart.Height);
			xCenter = is_4k ? 0.261 * ww : 0.23 * ww;
		}
		else if (UIHacks.MainWindowState == WindowState.Maximized && (displayPlaylist || displayLibrary || displayBiography)) {
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.55 * ww : 0.75 * ww) / albumart.Width, (wh - lowerSpace - geo.top_art_spacing) / albumart.Height);
			xCenter = is_4k ? 0.267 * ww : 0.24 * ww;
		} else {
			// Set Biography Window Size and Padding
			pptBio.borT  = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(70) : scaleForDisplay(70);
			pptBio.borL  = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
			pptBio.borR  = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
			pptBio.textT = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(70) : scaleForDisplay(70);
			pptBio.textL = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
			pptBio.textR = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
			pptBio.gap   = scaleForDisplay(11);
		}
		if (UIHacks.MainWindowState == WindowState.Normal && (displayPlaylist || displayLibrary || displayBiography)) {
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.50 * ww : 0.75 * ww) / albumart.Width, (wh - lowerSpace - geo.top_art_spacing) / albumart.Height);
			xCenter = 0.25 * ww;
		}
		if (pref.layout_mode === 'artwork_mode') { // Full width/height artwork in Artwork mode
			var album_scale = Math.min(ww / albumart.Width, (wh - lowerSpace - geo.top_art_spacing) / albumart.Height);
			xCenter = 0;
		}

		albumart_size.w = Math.floor(albumart.Width * album_scale); // width
		albumart_size.h = Math.floor(albumart.Height * album_scale); // height
		albumart_size.x = pref.layout_mode === 'artwork_mode' && (!displayPlaylist || pref.displayLyrics) ? 0 : pref.layout_mode === 'artwork_mode' && displayPlaylist ? ww : Math.floor(xCenter - 0.5 * albumart_size.w); // left
		if (album_scale !== (wh - geo.top_art_spacing - lowerSpace) / albumart.Height) {
			// restricted by width
			var y = Math.floor(((wh - geo.lower_bar_h + geo.top_art_spacing) / 2) - albumart_size.h / 2);
			albumart_size.y = Math.min(y, scaleForDisplay(150) + 10);	// 150 or 300 + 10? Not sure where 160 comes from
		} else {
			//const showingMinMaxButtons = (UIHacks && UIHacks.FrameStyle) ? true : false;	// add a bit of extra space because we move transport down slightly
			albumart_size.y = geo.top_art_spacing; /* + (showingMinMaxButtons ? scaleForDisplay(10) : 0); */ // height of menu bar + spacing + height of Artist text (32+32+32)
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
	if (hasArtwork || noAlbumArtStub) {
		if (gLyrics) {
			gLyrics.on_size(noAlbumArtStub ? 0 : albumart_size.x, noAlbumArtStub ? geo.top_art_spacing : albumart_size.y, noAlbumArtStub ? pref.layout_mode === 'artwork_mode' ? ww : ww / 2 : albumart_size.w, noAlbumArtStub ? wh - geo.top_art_spacing - geo.lower_bar_h : albumart_size.h);
		}
		if ((!pref.blackTheme || !pref.nblueTheme || !pref.ngreenTheme || !pref.nredTheme || !pref.ngoldTheme) && pref.layout_mode !== 'artwork_mode') {
			createDropShadow();
		}
	}
	if ((displayLibrary || displayPlaylist) && pref.layout_mode !== 'artwork_mode') {
		pauseBtn.setCoords(ww * (0.5 / 2), wh / 2 - (geo.top_art_spacing));
	} else {
		pauseBtn.setCoords(ww / 2, wh / 2 - (geo.top_art_spacing));
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
			cdartPath = $(pref.vinylside_path_artwork_root); // try vinyl%vinyl disc%.png first in root Artwork.
			if (!IsFile(cdartPath)) {
				cdartPath = $(pref.vinylside_path_images_root); // try vinyl%vinyl disc%.png first in root Images.
				if (!IsFile(cdartPath)) {
					cdartPath = $(pref.vinylside_path_scans_root); // try vinyl%vinyl disc%.png first in root Scans.
					if (!IsFile(cdartPath)) {
						cdartPath = $(pref.vinylside_path_artwork); // try vinyl%vinyl disc%.png first in subfolder Artwork.
						if (!IsFile(cdartPath)) {
							cdartPath = $(pref.vinylside_path_images); // try vinyl%vinyl disc%.png first in subfolder Images.
							if (!IsFile(cdartPath)) {
								cdartPath = $(pref.vinylside_path_scans); // try vinyl%vinyl disc%.png first in subfolder Scans.
								if (!IsFile(cdartPath)) {
									cdartPath = $(pref.vinyl_path); // try vinyl.png
									if (!IsFile(cdartPath)) {
										cdartPath = $(pref.vinyl_path_artwork_root); // try vinyl.png in root Artwork.
										if (!IsFile(cdartPath)) {
											cdartPath = $(pref.vinyl_path_images_root); // try vinyl.png in root Images.
											if (!IsFile(cdartPath)) {
												cdartPath = $(pref.vinyl_path_scans_root); // try vinyl.png in root Scans.
												if (!IsFile(cdartPath)) {
													cdartPath = $(pref.vinyl_path_artwork); // try vinyl.png in subfolder Artwork.
													if (!IsFile(cdartPath)) {
														cdartPath = $(pref.vinyl_path_images); // try vinyl.png in subfolder Images.
														if (!IsFile(cdartPath)) {
															cdartPath = $(pref.vinyl_path_scans); // try vinyl.png in subfolder Scans.
															if (!IsFile(cdartPath)) {
																cdartPath = $(pref.cdartdisc_path); // try cd%discnumber%.png
																if (!IsFile(cdartPath)) {
																	cdartPath = $(pref.cdartdisc_path_artwork_root); // try cd%discnumber%.png in root Artwork.
																	if (!IsFile(cdartPath)) {
																		cdartPath = $(pref.cdartdisc_path_images_root); // try cd%discnumber%.png in root Images.
																		if (!IsFile(cdartPath)) {
																			cdartPath = $(pref.cdartdisc_path_scans_root); // try cd%discnumber%.png in root Scans.
																			if (!IsFile(cdartPath)) {
																				cdartPath = $(pref.cdartdisc_path_artwork); // try cd%discnumber%.png in subfolder Artwork.
																				if (!IsFile(cdartPath)) {
																					cdartPath = $(pref.cdartdisc_path_images); // try cd%discnumber%.png in subfolder Images.
																					if (!IsFile(cdartPath)) {
																						cdartPath = $(pref.cdartdisc_path_scans); // try cd%discnumber%.png in subfolder Scans.
																						if (!IsFile(cdartPath)) {
																							cdartPath = $(pref.cdart_path); // cd%discnumber%.png didn't exist so try cd.png.
																							if (!IsFile(cdartPath)) {
																								cdartPath = $(pref.cdart_path_artwork_root); // cd%discnumber%.png didn't exist so try cd.png in root Artwork.
																								if (!IsFile(cdartPath)) {
																									cdartPath = $(pref.cdart_path_images_root); // cd%discnumber%.png didn't exist so try cd.png in root Images.
																									if (!IsFile(cdartPath)) {
																										cdartPath = $(pref.cdart_path_scans_root); // cd%discnumber%.png didn't exist so try cd.png in root Scans.
																										if (!IsFile(cdartPath)) {
																											cdartPath = $(pref.cdart_path_artwork); // cd%discnumber%.png didn't exist so try cd.png in subfolder Artwork.
																											if (!IsFile(cdartPath)) {
																												cdartPath = $(pref.cdart_path_images); // cd%discnumber%.png didn't exist so try cd.png in subfolder Images.
																												if (!IsFile(cdartPath)) {
																													cdartPath = $(pref.cdart_path_scans); // cd%discnumber%.png didn't exist so try cd.png in subfolder Scans.
																													if (!IsFile(cdartPath)) {
																														if (!noAlbumArtStub && pref.noDiscArtStub) disc_art_exists = false; // didn't find anything
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		// Display custom disc art placeholders
		if (!pref.noDiscArtStub) {
			disc_art_exists = true;
			if (pref.cdArtWhiteStub) {
				cdartPath = paths.cdArtWhiteStub; // Use white cdArt stub if enabled
			}
			else if (pref.cdArtBlackStub) {
				cdartPath = paths.cdArtBlackStub; // Use black cdArt stub if enabled
			}
			else if (pref.cdArtBlankStub) {
				cdartPath = paths.cdArtBlankStub; // Use blank cdArt stub if enabled
			}
			else if (pref.cdArtTransStub) {
				cdartPath = paths.cdArtTransStub; // Use transparent cdArt stub if enabled
			}
			else if (pref.vinylArtWhiteStub) {
				cdartPath = paths.vinylArtWhiteStub; // Use white vinylArt stub if enabled
			}
			else if (pref.vinylArtVoidStub) {
				cdartPath = paths.vinylArtVoidStub; // Use void vinylArt stub if enabled
			}
			else if (pref.vinylArtColdFusionStub) {
				cdartPath = paths.vinylArtColdFusionStub; // Use cold fusion vinylArt stub if enabled
			}
			else if (pref.vinylArtRingOfFireStub) {
				cdartPath = paths.vinylArtRingOfFireStub; // Use ring of fire vinylArt stub if enabled
			}
			else if (pref.vinylArtMapleStub) {
				cdartPath = paths.vinylArtMapleStub; // Use maple vinylArt stub if enabled
			}
			else if (pref.vinylArtBlackStub) {
				cdartPath = paths.vinylArtBlackStub; // Use black vinylArt stub if enabled
			}
			else if (pref.vinylArtBlackHoleStub) {
				cdartPath = paths.vinylArtBlackHoleStub; // Use black hole vinylArt stub if enabled
			}
			else if (pref.vinylArtEbonyStub) {
				cdartPath = paths.vinylArtEbonyStub; // Use ebony vinylArt stub if enabled
			}
			else if (pref.vinylArtTransStub) {
				cdartPath = paths.vinylArtTransStub; // Use transparent vinylArt stub if enabled
			}
			else {
				disc_art_exists = false;
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
		pref.show_titleInGrid = true;
		if (albumart) {
			getThemeColors(albumart);
			ResizeArtwork(true);
		} else {
			noArtwork = true;
			shadow_image = null;
		}
	} else {
		if (!pref.show_titleInGrid) {
			pref.show_titleInGrid = false;
		}
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
	if (pref.rebornTheme) initTheme();
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

	var buttonSize_default = scaleForDisplay(pref.transport_buttons_size_default);
	var buttonSize_artwork = scaleForDisplay(pref.transport_buttons_size_artwork);
	var buttonSize_compact = scaleForDisplay(pref.transport_buttons_size_compact);
	//---> Transport buttons

	if (pref.layout_mode === 'default_mode') {

		if (transport.enableTransportControls_default) {
			let count = 4 + (transport.show_playbackOrder_default ? 1 : 0) + (transport.show_reload_default ? 1 : 0) + (transport.show_volume_default ? 1 : 0);

			const y = wh - buttonSize_default - scaleForDisplay(78) + scaleForDisplay(pref.lower_bar_font_size_default);
			const w = buttonSize_default;
			const h = w;
			const p = scaleForDisplay(pref.transport_buttons_spacing_default); // space between buttons
			const x = (ww - w * count - p * (count - 1)) / 2;

			const calcX = (index) => {
				return x + (w + p) * index;
			}

			count = 0;
			btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
			btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
			btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
			btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');
			if (transport.show_playbackOrder_default) {
				if (plman.PlaybackOrder === 0) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackDefault);
				}
				else if (plman.PlaybackOrder === 1 || plman.PlaybackOrder === 2) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackReplay);
				}
				else if (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4 || plman.PlaybackOrder === 5 || plman.PlaybackOrder === 6) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackShuffle);
				}
			}
			if (transport.show_reload_default) {
				btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
			}
			if (transport.show_volume_default) {
				btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
				volume_btn.setPosition(btns.volume.x, y, w);
			}
		}
	}

	if (pref.layout_mode === 'artwork_mode') {

		if (transport.enableTransportControls_artwork) {
			let count = 4 + (transport.show_playbackOrder_artwork ? 1 : 0) + (transport.show_reload_artwork ? 1 : 0) + (transport.show_volume_artwork ? 1 : 0);

			const y = wh - buttonSize_artwork - scaleForDisplay(36) + scaleForDisplay(pref.lower_bar_font_size_artwork);
			const w = buttonSize_artwork;
			const h = w;
			const p = scaleForDisplay(pref.transport_buttons_spacing_artwork); // space between buttons
			const x = (ww - w * count - p * (count - 1)) / 2;

			const calcX = (index) => {
				return x + (w + p) * index;
			}

			count = 0;
			btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
			btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
			btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
			btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');
			if (transport.show_playbackOrder_artwork) {
				if (plman.PlaybackOrder === 0) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackDefault);
				}
				else if (plman.PlaybackOrder === 1 || plman.PlaybackOrder === 2) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackReplay);
				}
				else if (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4 || plman.PlaybackOrder === 5 || plman.PlaybackOrder === 6) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackShuffle);
				}
			}
			if (transport.show_reload_artwork) {
				btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
			}
			if (transport.show_volume_artwork) {
				btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
				volume_btn.setPosition(btns.volume.x, y, w);
			}
		}
	}

	if (pref.layout_mode === 'compact_mode') {

		if (transport.enableTransportControls_compact) {
			let count = 4 + (transport.show_playbackOrder_compact ? 1 : 0) + (transport.show_reload_compact ? 1 : 0) + (transport.show_volume_compact ? 1 : 0);

			const y = wh - buttonSize_compact - scaleForDisplay(36) + scaleForDisplay(pref.lower_bar_font_size_compact);
			const w = buttonSize_compact;
			const h = w;
			const p = scaleForDisplay(pref.transport_buttons_spacing_compact); // space between buttons
			const x = (ww - w * count - p * (count - 1)) / 2;

			const calcX = (index) => {
				return x + (w + p) * index;
			}

			count = 0;
			btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
			btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
			btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
			btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');
			if (transport.show_playbackOrder_compact) {
				if (plman.PlaybackOrder === 0) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackDefault);
				}
				else if (plman.PlaybackOrder === 1 || plman.PlaybackOrder === 2) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackReplay);
				}
				else if (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4 || plman.PlaybackOrder === 5 || plman.PlaybackOrder === 6) {
					btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackShuffle);
				}
			}
			if (transport.show_reload_compact) {
				btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
			}
			if (transport.show_volume_compact) {
				btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
				volume_btn.setPosition(btns.volume.x, y, w);
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
		}
		else if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
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
			if (!is_4k && ww < 1600 || is_4k && ww < 2800) {
				centerMenu = is_4k ? 396 : 204;
			} else {
				centerMenu = is_4k ? 532 : 264;
			}
		} else if (pref.menu_font_size === 12) {
			if (!is_4k && ww < 1600 || is_4k && ww < 2800) {
				centerMenu = is_4k ? 550 : 280;
			} else {
				centerMenu = is_4k ? 564 : 280;
			}
		} else if (pref.menu_font_size === 13) {
			if (!is_4k && ww < 1600 || is_4k && ww < 2800) {
				centerMenu = is_4k ? 708 : 356;
			} else {
				centerMenu = is_4k ? 593 : 295;
			}
		} else if (pref.menu_font_size === 14) {
			if (!is_4k && ww < 1600 || is_4k && ww < 2800) {
				centerMenu = is_4k ? 856 : 432;
			} else {
				centerMenu = is_4k ? 626 : 314;
			}
		} else if (pref.menu_font_size === 16) {
			if (!is_4k && ww < 1600 || is_4k && ww < 2800) {
				centerMenu = is_4k ? 1158 : 584;
			} else {
				centerMenu = is_4k ? 688 : 343;
			}
		}

		if (pref.menu_font_size === 11) y += scaleForDisplay(1);
		if (pref.menu_font_size === 12) y += scaleForDisplay(0);
		if (pref.menu_font_size === 13) y -= scaleForDisplay(1);
		if (pref.menu_font_size === 14) y -= scaleForDisplay(2);
		if (pref.menu_font_size === 16) y -= scaleForDisplay(3);
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
		h = img[0].Height + 4;

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
		btns.library = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'ShowLibrary', img, 'Display Library');
		img = btnImg.Playlist;
		x -= (img[0].Width) - (is_4k ? 3 : 2);
		btns.playlist = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Playlist', img, 'Display Details');

	} else if (pref.layout_mode === 'artwork_mode') {

		/** @type {GdiBitmap[]} */
		let img = btnImg.File;
		let x = is_4k ? 18 : 8;
		let y = is_4k ? 16 : 9;
		let h = img[0].Height;
		let w = img[0].Width;
		let centerMenu = is_4k ? 666 : 338;

		if (pref.menu_font_size === 11) {
			if (!is_4k && ww < 700 || is_4k && ww < 1400) {
				centerMenu = is_4k ? 512 : 262;
			} else {
				centerMenu = is_4k ? 647 : 322;
			}
		} else if (pref.menu_font_size === 12) {
			if (!is_4k && ww < 700 || is_4k && ww < 1400) {
				centerMenu = is_4k ? 666 : 338;
			} else {
				centerMenu = is_4k ? 696 : 345;
			}
		} else if (pref.menu_font_size === 13) {
			if (!is_4k && ww < 700 || is_4k && ww < 1400) {
				centerMenu = is_4k ? 824 : 414;
			} else {
				centerMenu = is_4k ? 748 : 372;
			}
		} else if (pref.menu_font_size === 14) {
			if (!is_4k && ww < 700 || is_4k && ww < 1400) {
				centerMenu = is_4k ? 972 : 490;
			} else {
				centerMenu = is_4k ? 798 : 394;
			}
		} else if (pref.menu_font_size === 16) {
			if (!is_4k && ww < 700 || is_4k && ww < 1400) {
				centerMenu = is_4k ? 1274 : 542;
			} else {
				centerMenu = is_4k ? 893 : 445;
			}
		}

		if (pref.menu_font_size === 11) y += scaleForDisplay(1);
		if (pref.menu_font_size === 12) y += scaleForDisplay(0);
		if (pref.menu_font_size === 13) y -= scaleForDisplay(1);
		if (pref.menu_font_size === 14) y -= scaleForDisplay(2);
		if (pref.menu_font_size === 16) y -= scaleForDisplay(3);
		btns[20] = new Button(x, y, w, h, 'File', img);
		x += img[0].Width - (is_4k ? 3 : 2);

		img = btnImg.Options;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 120 : 60);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 127 : 64);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 134 : 68);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 136 : 70);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 132 : 66);
		} else {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 118 : 60);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 125 : 64);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 134 : 67);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 141 : 71);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 155 : 78);
		}
		btns[27] = new Button(x, y, img[0].Width, h, 'Options', img);

		let buttonY = 15;
		if (showingMinMaxButtons) {
			buttonY = 15 + btns.Minimize.h;
		}

		img = btnImg.Settings;
		x = Math.round(ww * .5 + (centerMenu / 2) + scaleForDisplay(23));
		h = img[0].Height + 4;

		btns[30] = new Button(x, y, 0, h, img);

		img = btnImg.Rating;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 36 : 23);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 8 : 0);
			if (pref.menu_font_size === 13) x -= img[0].Width + (is_4k ? 47 : 29);
			if (pref.menu_font_size === 14) x -= img[0].Width + (is_4k ? 111 : 63);
			if (pref.menu_font_size === 16) x -= img[0].Width + (is_4k ? 260 : 88);
	 	} else {
			x -= (img[0].Width);
		}
		btns[32] = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Rating', img, 'Rate Song');

		img = btnImg.Lyrics;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 3 : 0);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 3 : 2);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 8 : 5);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 14 : 8);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 26 : 14);
		} else {
			x -= (img[0].Width) - (is_4k ? 3 : 2);
		}
		btns.lyrics = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Lyrics', img, 'Display Lyrics');

		img = btnImg.Biography;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 3 : 0);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 3 : 2);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 8 : 5);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 14 : 8);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 26 : 14);
		} else {
			x -= (img[0].Width) - (is_4k ? 3 : 2);
		}
		btns.biography = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Biography', img, 'Display Biography');

		img = btnImg.ShowLibrary;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 3 : 0);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 3 : 2);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 8 : 5);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 14 : 8);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 26 : 14);
		} else {
			x -= (img[0].Width) - (is_4k ? 3 : 2);
		}
		btns.library = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'ShowLibrary', img, 'Display Library');

		img = btnImg.playlistArtworkMode;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 3 : 0);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 3 : 2);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 8 : 5);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 14 : 8);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 26 : 14);
		} else {
			x -= (img[0].Width) - (is_4k ? 3 : 2);
		}
		btns.playlistArtworkMode = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'playlistArtworkMode', img, 'Display Playlist');

		img = btnImg.Playlist;
		if (!is_4k && ww < 700 || is_4k && ww < 1400) {
			if (pref.menu_font_size === 11) x -= img[0].Width - (is_4k ? 3 : 0);
			if (pref.menu_font_size === 12) x -= img[0].Width - (is_4k ? 3 : 2);
			if (pref.menu_font_size === 13) x -= img[0].Width - (is_4k ? 8 : 5);
			if (pref.menu_font_size === 14) x -= img[0].Width - (is_4k ? 14 : 8);
			if (pref.menu_font_size === 16) x -= img[0].Width - (is_4k ? 26 : 14);
		} else {
			x -= (img[0].Width) - (is_4k ? 3 : 2);
		}
		btns.playlist = new Button(x, y, img[0].Width, is_4k ? h + 7 : h + 2, 'Playlist', img, 'Display Details');

	} else if (pref.layout_mode === 'compact_mode') {

		/** @type {GdiBitmap[]} */
		let img = btnImg.File;
		let x = is_4k ? 16 : 8;
		let y = is_4k ? 16 : 9;
		let h = img[0].Height;
		let w = img[0].Width;

		if (pref.menu_font_size === 11) y += scaleForDisplay(1);
		if (pref.menu_font_size === 12) y += scaleForDisplay(0);
		if (pref.menu_font_size === 13) y -= scaleForDisplay(1);
		if (pref.menu_font_size === 14) y -= scaleForDisplay(2);
		if (pref.menu_font_size === 16) y -= scaleForDisplay(3);
		btns[20] = new Button(x, y, w, h, 'File', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.Edit;
		btns[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.View;
		btns[22] = new Button(x, y, img[0].Width, h, 'View', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.Playback;
		btns[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.Library;
		btns[24] = new Button(x, y, img[0].Width, h, 'Library', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.Help;
		btns[25] = new Button(x, y, img[0].Width, h, 'Help', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.Playlists;
		btns[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);

		if (pref.menu_font_size === 11) x += img[0].Width + (is_4k ? 3 : 0);
		if (pref.menu_font_size === 12) x += img[0].Width - (is_4k ? 3 : 2);
		if (pref.menu_font_size === 13) x += img[0].Width - (is_4k ? 8 : 5);
		if (pref.menu_font_size === 14) x += img[0].Width - (is_4k ? 14 : 8);
		if (pref.menu_font_size === 16) x += img[0].Width - (is_4k ? 26 : 14);
		img = btnImg.Options;
		btns[27] = new Button(x, y, img[0].Width, h, 'Options', img);

		let buttonY = 15;
		if (showingMinMaxButtons) {
			buttonY = 15 + btns.Minimize.h;
		}

		btns[30] = new Button(x, y, 0, h, img);
		btns.playlist = new Button(x, y, img[0].Width, h, 'Playlist', img, 'Display Details');

	}

	/* if a new image button is added to the left of playlist we need to update the ResizeArtwork code */
}

// =================================================== //

function createButtonImages() {
	let createButtonProfiler = null;
	if (timings.showExtraDrawTiming) createButtonProfiler = fb.CreateProfiler('createButtonImages');
	const transportCircleSize = pref.layout_mode === 'artwork_mode' ? Math.round(pref.transport_buttons_size_artwork * 0.93333) : pref.layout_mode === 'compact_mode' ? Math.round(pref.transport_buttons_size_compact * 0.93333) : Math.round(pref.transport_buttons_size_default * 0.93333);
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
			PlaybackDefault: {
				ico: g_guifx.right,
				font: ft.playbackOrder_default,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackReplay: {
				ico: "\uf021",
				font: ft.playbackOrder_replay,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackShuffle: {
				ico: g_guifx.shuffle,
				font: ft.playbackOrder_shuffle,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			ShowVolume: {
				ico:  g_guifx.volume_down,
				font: ft.guifx_volume,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Reload: {
				ico: g_guifx.power,
				font: ft.guifx_reload,
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
			playlistArtworkMode: {
				ico: "Playlist",
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
		console.log('ATTENTION: Buttons could not be created');
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
		let h = btns[i].h;
		let lw = scaleForDisplay(2);

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

			var menuTextColor =
			pref.whiteTheme ? RGB(120, 120, 120) :
			pref.blackTheme ? RGB(180, 180, 180) :
			pref.rebornTheme ? RGB(120, 120, 120) :
			pref.blueTheme ? RGB(230, 230, 230) :
			pref.darkblueTheme ? RGB(230, 230, 230) :
			pref.redTheme ? RGB(220, 220, 220) :
			pref.creamTheme ? RGB(100, 150, 110) :
			pref.nblueTheme ? RGB(0, 200, 255) :
			pref.ngreenTheme ? RGB(0, 200, 0) :
			pref.nredTheme ? RGB(242, 7, 46) :
			pref.ngoldTheme ? RGB(254, 204, 3) : '';

			var menuRectColor =
			pref.whiteTheme ? RGB(140, 140, 140) :
			pref.blackTheme ? RGB(60, 60, 60) :
			pref.rebornTheme ? RGB(140, 140, 140) :
			pref.blueTheme ? RGB(76, 175, 255) :
			pref.darkblueTheme ? RGB(200, 200, 200) :
			pref.redTheme ? RGB(200, 200, 200) :
			pref.creamTheme ? RGB(100, 150, 110) :
			pref.nblueTheme ? RGB(0, 200, 255) :
			pref.ngreenTheme ? RGB(0, 200, 0) :
			pref.nredTheme ? RGB(242, 7, 46) :
			pref.ngoldTheme ? RGB(254, 204, 3) : '';

			var minMaxIcoColor =
			pref.whiteTheme ? RGB(120, 120, 120) :
			pref.blackTheme ? RGB(180, 180, 180) :
			pref.rebornTheme ? RGB(120, 120, 120) :
			pref.blueTheme ? RGB(220, 220, 220) :
			pref.darkblueTheme ? RGB(220, 220, 220) :
			pref.redTheme ? RGB(200, 200, 200) :
			pref.creamTheme ? RGB(100, 150, 110) :
			pref.nblueTheme ? RGB(0, 200, 255) :
			pref.ngreenTheme ? RGB(0, 200, 0) :
			pref.nredTheme ? RGB(242, 7, 46) :
			pref.ngoldTheme ? RGB(254, 204, 3) : '';

			var transportIconColor =
			pref.whiteTheme ? RGB(120, 120, 120) :
			pref.blackTheme ? RGB(160, 160, 160) :
			pref.rebornTheme ? RGB(120, 120, 120) :
			pref.blueTheme ? RGB(242, 230, 170) :
			pref.darkblueTheme ? RGB(255, 202, 128) :
			pref.redTheme ? RGB(245, 212, 165) :
			pref.creamTheme ? RGB(100, 150, 110) :
			pref.nblueTheme ? RGB(0, 200, 255) :
			pref.ngreenTheme ? RGB(0, 200, 0) :
			pref.nredTheme ? RGB(242, 7, 46) :
			pref.ngoldTheme ? RGB(254, 204, 3) : '';

			var transportEllipseColor =
			pref.whiteTheme ? RGB(220, 220, 220) :
			pref.blackTheme ? RGB(60, 60, 60) :
			pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.darkMiddleAccent : RGB(220, 220, 220) :
			pref.blueTheme ? RGB(22, 107, 186) :
			pref.darkblueTheme ? RGB(20, 33, 48) :
			pref.redTheme ? RGB(82, 19, 19) :
			pref.creamTheme ? RGB(220, 220, 220) :
			pref.nblueTheme ? RGB(50, 50, 50) :
			pref.ngreenTheme ? RGB(50, 50, 50) :
			pref.nredTheme ? RGB(50, 50, 50) :
			pref.ngoldTheme ? RGB(50, 50, 50) : '';

			var transportEllipseBGColor =
			pref.whiteTheme ? RGB(255, 255, 255) :
			pref.blackTheme ? RGB(35, 35, 35) :
			pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : RGB(255, 255, 255) :
			pref.blueTheme ? RGB(10, 130, 220) :
			pref.darkblueTheme ? RGB(27, 55, 90) :
			pref.redTheme ? RGB(140, 25, 25) :
			pref.creamTheme ? RGB(255, 255, 255) :
			pref.nblueTheme ? RGB(35, 35, 35) :
			pref.ngreenTheme ? RGB(35, 35, 35) :
			pref.nredTheme ? RGB(35, 35, 35) :
			pref.ngoldTheme ? RGB(35, 35, 35) : '';

			var iconAlpha = 255;

			switch (s) {
				case ButtonState.Hovered:
					menuTextColor =
					pref.whiteTheme ? RGB(80, 80, 80) :
					pref.blackTheme ? RGB(255, 255, 255) :
					pref.rebornTheme ? RGB(80, 80, 80) :
					pref.blueTheme ? RGB(255, 255, 255) :
					pref.darkblueTheme ? RGB(255, 255, 255) :
					pref.redTheme ? RGB(255, 255, 255) :
					pref.creamTheme ? RGB(100, 100, 100) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					menuRectColor =
					pref.whiteTheme ? RGB(200, 200, 200) :
					pref.blackTheme ? RGB(120, 120, 120) :
					pref.rebornTheme ? RGB(200, 200, 200) :
					pref.blueTheme ? RGB(76, 175, 255) :
					pref.darkblueTheme ? RGB(50, 90, 150) :
					pref.redTheme ? RGB(204, 45, 45) :
					pref.creamTheme ? RGB(190, 190, 190) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					minMaxIcoColor =
					pref.whiteTheme ? RGB(80, 80, 80) :
					pref.blackTheme ? RGB(255, 255, 255) :
					pref.rebornTheme ? RGB(80, 80, 80) :
					pref.blueTheme ? RGB(255, 255, 255) :
					pref.darkblueTheme ? RGB(255, 255, 255) :
					pref.redTheme ? RGB(255, 255, 255) :
					pref.creamTheme ? RGB(100, 100, 100) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					transportIconColor =
					pref.whiteTheme ? RGB(80, 80, 80) :
					pref.blackTheme ? RGB(255, 255, 255) :
					pref.rebornTheme ? RGB(80, 80, 80) :
					pref.blueTheme ? RGB(255, 255, 255) :
					pref.darkblueTheme ? RGB(255, 255, 255) :
					pref.redTheme ? RGB(255, 255, 255) :
					pref.creamTheme ? RGB(100, 100, 100) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					transportEllipseColor =
					pref.whiteTheme ? RGB(200, 200, 200) :
					pref.blackTheme ? RGB(120, 120, 120) :
					pref.rebornTheme ? RGB(200, 200, 200) :
					pref.blueTheme ? RGB(76, 175, 255) :
					pref.darkblueTheme ? RGB(50, 90, 150) :
					pref.redTheme ? RGB(204, 45, 45) :
					pref.creamTheme ? RGB(200, 200, 200) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					iconAlpha = 215;
					break;

				case ButtonState.Down:
					menuTextColor =
					pref.whiteTheme ? RGB(80, 80, 80) :
					pref.blackTheme ? RGB(255, 255, 255) :
					pref.rebornTheme ? RGB(80, 80, 80) :
					pref.blueTheme ? RGB(255, 255, 255) :
					pref.darkblueTheme ? RGB(255, 255, 255) :
					pref.redTheme ? RGB(255, 255, 255) :
					pref.creamTheme ? RGB(100, 100, 100) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					menuRectColor =
					pref.whiteTheme ? RGB(200, 200, 200) :
					pref.blackTheme ? RGB(120, 120, 120) :
					pref.rebornTheme ? RGB(200, 200, 200) :
					pref.blueTheme ? RGB(76, 175, 255) :
					pref.darkblueTheme ? RGB(50, 90, 150) :
					pref.redTheme ? RGB(204, 45, 45) :
					pref.creamTheme ? RGB(190, 190, 190) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					minMaxIcoColor =
					pref.whiteTheme ? RGB(80, 80, 80) :
					pref.blackTheme ? RGB(255, 255, 255) :
					pref.rebornTheme ? RGB(80, 80, 80) :
					pref.blueTheme ? RGB(255, 255, 255) :
					pref.darkblueTheme ? RGB(255, 255, 255) :
					pref.redTheme ? RGB(255, 255, 255) :
					pref.creamTheme ? RGB(100, 100, 100) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					transportIconColor =
					pref.whiteTheme ? RGB(80, 80, 80) :
					pref.blackTheme ? RGB(255, 255, 255) :
					pref.rebornTheme ? RGB(80, 80, 80) :
					pref.blueTheme ? RGB(255, 255, 255) :
					pref.darkblueTheme ? RGB(255, 255, 255) :
					pref.redTheme ? RGB(255, 255, 255) :
					pref.creamTheme ? RGB(100, 100, 100) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					transportEllipseColor =
					pref.whiteTheme ? RGB(200, 200, 200) :
					pref.blackTheme ? RGB(120, 120, 120) :
					pref.rebornTheme ? RGB(200, 200, 200) :
					pref.blueTheme ? RGB(76, 175, 255) :
					pref.darkblueTheme ? RGB(50, 90, 150) :
					pref.redTheme ? RGB(204, 45, 45) :
					pref.creamTheme ? RGB(200, 200, 200) :
					pref.nblueTheme ? RGB(0, 238, 255) :
					pref.ngreenTheme ? RGB(0, 255, 0) :
					pref.nredTheme ? RGB(255, 8, 8) :
					pref.ngoldTheme ? RGB(255, 242, 3) : '';

					iconAlpha = 190;
					break;
				case ButtonState.Enabled:
					iconAlpha = 250;
					break;
			}

			let bgColor = col.primary;
			if (g_pl_colors.background != RGB(255, 255, 255)) {
				if (pref.rebornTheme && (new Color(bgColor).brightness > 130)) {
					menuTextColor = col.superDarkAccent;
					menuRectColor = col.darkAccent;
					minMaxIcoColor = col.superDarkAccent;
					transportIconColor = col.extraDarkAccent;
					transportEllipseColor = col.accent;
					iconAlpha = 255;
					switch (s) {
						case ButtonState.Hovered:
							menuTextColor = col.maxDarkAccent;
							menuRectColor = col.darkAccent;
							minMaxIcoColor = col.maxDarkAccent;
							transportIconColor = col.maxDarkAccent;
							transportEllipseColor = col.darkAccent;
							iconAlpha = 215;
						break;
						case ButtonState.Down:
							menuTextColor = col.maxDarkAccent;
							menuRectColor = col.darkAccent;
							minMaxIcoColor = col.maxDarkAccent;
							transportIconColor = col.maxDarkAccent;
							transportEllipseColor = col.darkAccent;
							iconAlpha = 190;
						break;
						case ButtonState.Enabled:
							iconAlpha = 250;
						break;
					}
				}
				else if (pref.rebornTheme && (new Color(bgColor).brightness < 131)) {
					menuTextColor = col.superLightAccent;
					menuRectColor = col.extraLightAccent;
					minMaxIcoColor = col.superLightAccent;
					transportIconColor = col.extraDarkAccent;
					transportEllipseColor = col.accent;
					switch (s) {
						case ButtonState.Hovered:
							menuTextColor = col.maxLightAccent;
							menuRectColor = col.extraLightAccent;
							minMaxIcoColor = col.maxLightAccent;
							transportIconColor = col.maxDarkAccent;
							transportEllipseColor = col.darkAccent;
							iconAlpha = 215;
						break;
						case ButtonState.Down:
							menuTextColor = col.maxLightAccent;
							menuRectColor = col.extraLightAccent;
							minMaxIcoColor = col.maxLightAccent;
							transportIconColor = col.maxDarkAccent;
							transportEllipseColor = col.darkAccent;
							iconAlpha = 190;
						break;
						case ButtonState.Enabled:
							iconAlpha = 250;
						break;
					}
				}
			}

			if (btns[i].type == 'menu') {
				s && g.DrawRoundRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 3, 3, 1, menuRectColor);
				g.DrawString(btns[i].ico, btns[i].font, menuTextColor, 0, 0, w, h - 1, StringFormat(1, 1));
			}
			else if (btns[i].type == 'window') { // min/max/close controls for UIHacks
				s && g.DrawRoundRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 3, 3, 1, menuRectColor);
				g.DrawString(btns[i].ico, btns[i].font, minMaxIcoColor, 0, 0, w, h, StringFormat(1, 1));
			}
			else if (btns[i].type == 'transport') {
				g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, transportEllipseColor);
				g.FillEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, transportEllipseBGColor);
				g.DrawString(btns[i].ico, btns[i].font, transportIconColor, 1, (i == 'Stop' || i == 'Reload') ? 0 : 1, w, h, StringFormat(1, 1));
			}
			else if (btns[i].type == 'image') {
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

	var settings_path = fb.ProfilePath + 'georgia-reborn\\settings\\' + g_theme.folder_name;
	_.createFolder(fb.ProfilePath + 'georgia-reborn\\settings');
	_.createFolder(settings_path);

	/** @type {StateObject} */
	this.layoutmode = new StateObject('layoutmode', ['default_mode', 'artwork_mode', 'compact_mode'], 'default_mode');
	this.player_size = new StateObject('player_size', ['player_small', 'player_normal', 'player_large', 'player_4k_small', 'player_4k_normal', 'player_4k_large'], 'player_small');

};

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
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.layoutmode.state = new_layoutmode_state;

			// Fix for FULL HD Res that causes ugly resize from Compact Mode with Player Size 'Normal' to Default Mode
			if (pref.layout_mode === 'default_mode' && !pref.player_normal === 'player_normal') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
			}
			else if (is_4k && pref.layout_mode === 'default_mode') {
				set_window_size(2800, 1720);
			}
			if (!is_4k) {
				UIHacks.MinSize.Width   = 1140;
				UIHacks.MinSize.Height  = 730;
				UIHacks.MinSize.Enabled = true;
			} else if (is_4k) {
				UIHacks.MinSize.Width   = 2300;
				UIHacks.MinSize.Height  = 1470;
				UIHacks.MinSize.Enabled = true;
			}
			// End

			if (pref.use_4k === 'auto') {
				if (initDPI.dpi() > 120) {
					set_window_size(2800, 1720);
					if (ww > 2560 && wh > 1600) {
						is_4k = true;
						pref.player_4k_normal = 'player_4k_normal';
						pref.player_small = false;
					}
					else if (ww < 2560 && wh < 1600) {
						set_window_size(1140, 730);
					}
				} else {
					if (ww < 2560 && wh < 1600) {
						set_window_size(1140, 730);
						is_4k = false;
						pref.player_small = 'player_small';
						pref.player_4k_small = false;
					}
				}

			} else if (pref.use_4k === 'always') {
				set_window_size(2800, 1720);
				is_4k = true;
				pref.player_4k_normal = 'player_4k_normal';
				pref.player_small = false;

			} else if (pref.use_4k === 'never') {
				set_window_size(1140, 730);
				is_4k = false;
				pref.player_small = 'player_small';
				pref.player_4k_normal = false;
			}
		}
	};

	this.layout_mode_artwork_mode = function() {
		var new_layoutmode_state = 'artwork_mode';
		if (new_layoutmode_state === 'artwork_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.artwork_mode_saved_width = fb_handle.Width;
					pref.artwork_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.layoutmode.state = new_layoutmode_state;

			if (pref.use_4k === 'auto') {

				if (initDPI.dpi() > 120) {
					set_window_size(1052, 1372);
					if (wh > 1200) {
						set_window_size(1052, 1372);
						is_4k = true;
						pref.player_4k_small = 'player_4k_small';
						pref.player_small = false;
					}
					else if (wh < 1600) {
						set_window_size(526, 686);
					}
				} else {
					if (wh < 1200) {
						set_window_size(526, 686);
						is_4k = false;
						pref.player_small = 'player_small';
						pref.player_4k_small = false;
					}
				}

			} else if (pref.use_4k === 'always') {
				set_window_size(1052, 1372);
				is_4k = true;
				pref.player_4k_small = 'player_4k_small';
				pref.player_small = false;

			} else if (pref.use_4k === 'never') {
				set_window_size(526, 686);
				is_4k = false;
				pref.player_small = 'player_small';
				pref.player_4k_normal = false;
			}
		}
	};

	this.layout_mode_compact_mode = function() {
		var new_layoutmode_state = 'compact_mode';
		if (new_layoutmode_state === 'compact_mode') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.compact_mode_saved_width = fb_handle.Width;
					pref.compact_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.layoutmode.state = new_layoutmode_state;

			if (pref.use_4k === 'auto') {

				if (initDPI.dpi() > 120) {
					set_window_size(964, 1720);
					if (wh > 1600) {
						set_window_size(964, 1720);
						is_4k = true;
						pref.player_4k_normal = 'player_4k_normal';
						pref.player_small = false;
					}
					else if (wh < 1600) {
						set_window_size(484, 730);
					}
				} else {
					if (wh < 1600) {
						set_window_size(484, 730);
						is_4k = false;
						pref.player_small = 'player_small';
						pref.player_4k_small = false;
					}
				}

			} else if (pref.use_4k === 'always') {
				set_window_size(964, 1720);
				is_4k = true;
				pref.player_4k_normal = 'player_4k_normal';
				pref.player_small = false;

			} else if (pref.use_4k === 'never') {
				set_window_size(484, 730);
				is_4k = false;
				pref.player_small = 'player_small';
				pref.player_4k_normal = false;
			}
		}
	};

	this.player_size_small = function() {
		var new_player_size_state = 'player_small';
		if (new_player_size_state === 'player_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1140;
				UIHacks.MinSize.Height  = 730;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'never' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(1140, 730);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(526, 686);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(484, 730);
		}
	};

	this.player_size_normal = function() {
		var new_player_size_state = 'player_normal';
		if (new_player_size_state === 'player_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1600;
				UIHacks.MinSize.Height  = 960;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'never' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(1600, 960);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(700, 860);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(484, 960);
		}
	};

	this.player_size_large = function() {
		var new_player_size_state = 'player_large';
		if (new_player_size_state === 'player_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			} else {
				if (fb_handle) {
					pref.default_mode_saved_width = fb_handle.Width;
					pref.default_mode_saved_height = fb_handle.Height;
				}
			}
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 1802;
				UIHacks.MinSize.Height  = 1061;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'never' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww < 2560 && wh < 1600 && pref.layout_mode === 'default_mode') {
			set_window_size(1802, 1061);
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(901, 1062);
		}
		if (pref.layout_mode === 'compact_mode') {
			set_window_size(1600, 960);
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
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 2300;
				UIHacks.MinSize.Height  = 1470;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'always' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww > 2560 && wh > 1600 && pref.layout_mode === 'default_mode') {
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
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 2800;
				UIHacks.MinSize.Height  = 1720;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'always' && pref.layout_mode === 'compact_mode') {
			set_window_size(964, 1720);
			is_4k = true;
			pref.player_4k_normal = 'player_4k_normal';
			pref.player_small = false;
		}
		if (pref.layout_mode === 'artwork_mode') {
			set_window_size(1400, 1720);
		}
		if (pref.layout_mode === 'compact_mode' && is_4k) {
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
			pss_switch.player_size.state = new_player_size_state;
			if (pref.layout_mode === 'default_mode') {
				set_window_size(pref.default_mode_saved_width, pref.default_mode_saved_height);
				UIHacks.MinSize.Width   = 3400;
				UIHacks.MinSize.Height  = 2020;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.use_4k === 'always' && pref.layout_mode === 'default_mode' || pref.use_4k === 'auto' && ww > 2560 && wh > 1600 && pref.layout_mode === 'default_mode') {
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
		} else if (layoutmode === 'artwork_mode') {
			if (!is_4k) {
				min_w = 526;
				min_h = 686;
			} else if (is_4k) {
				min_w_4K = 1052;
				min_h_4K = 1372;
			}
		} else if (layoutmode === 'compact_mode') {
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
			var was_first_launch = pref.is_first_launch;
		}

		if (pref.is_first_launch) {
			// Set default mode and pref.whiteTheme on first launch
			pref.layout_mode      = 'default_mode';
			pref.whiteTheme       = 'white';
			pref.libraryDesign    = 'reborn';
			pref.blackTheme       = false;
			pref.rebornTheme      = false;
			pref.blueTheme        = false;
			pref.darkblueTheme    = false;
			pref.redTheme         = false;
			pref.creamTheme       = false;
			pref.nblueTheme       = false;
			pref.ngreenTheme      = false;
			pref.nredTheme        = false;
			pref.ngoldTheme       = false;
			pref.player_normal    = false;
			pref.player_large     = false;
			pref.player_4k_normal = false;
			pref.player_4k_large  = false;

			// Init 4k resolution check and player size on first launch
			set_window_size(1140, 730); // Reset player size for initialization

			if (initDPI.dpi() > 120) {
				set_window_size(2800, 1720);
				if (ww > 2560 && wh > 1600) {
					is_4k = true;
					pref.player_4k_normal = 'player_4k_normal';
					pref.player_small = false;
					ppt.baseFontSize = 24; // Sets Library font size to 24 pixel for 4K
					pptBio.baseFontSizeBio = 24; // Sets Biography font size for 24 pixel for 4K
					default_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved width',  2800);
					default_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved height', 1720);
					artwork_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved width',  1052);
					artwork_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved height', 1372);
					compact_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved width',   964);
					compact_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved height', 1720);
				}
				else if (ww < 2560 && wh < 1600) {
					set_window_size(1140, 730);
				}
			} else {
				if (ww < 2560 && wh < 1600) {
					set_window_size(1140, 730);
					is_4k = false;
					pref.player_small = 'player_small';
					pref.player_4k_small = false;
					ppt.baseFontSize = 12; // Sets Library font size to 12 pixel for FHD
					pptBio.baseFontSizeBio = 12; // Sets Biography font size for 12 pixel for FHD
					default_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved width', 1140);
					default_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Default mode - Saved height', 730);
					artwork_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved width',  526);
					artwork_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Artwork mode - Saved height', 686);
					compact_mode_saved_width  = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved width',  484);
					compact_mode_saved_height = window.SetProperty('Georgia-ReBORN - System: Compact mode - Saved height', 730);
				}
			}
			window.Reload(); // Needed to prevent ugly playlist shadow flash after reset
			pref.is_first_launch = false;
		}

		// Workaround for messed up settings file or properties
		this.set_window_size_limits_for_mode(pss_switch.layoutmode.state);

		if (fb_handle) {
			return last_w !== fb_handle.Width || last_h !== fb_handle.Height;
		} else {
			return was_first_launch;
		}
	};

	var fb_handle = undefined;
}

function set_window_size(width, height) {
	//To avoid resizing bugs, when the window is bigger\smaller than the saved one.
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

	window.NotifyOthers('layoutmode_state_size', pss_switch.layoutmode.state);
}

function set_window_size_limits(min_w, min_w_4K, max_w, max_w_4K, min_h, min_h_4K, max_h,max_h_4K) {
	UIHacks.MinSize.Enabled = !!min_w || !!min_w_4K;
	UIHacks.MinSize.Width   =   min_w ||   min_w_4K;

	UIHacks.MaxSize.Enabled = !!max_w || !!max_w_4K;
	UIHacks.MaxSize.Width   =   max_w ||   max_w_4K;

	UIHacks.MinSize.Enabled = !!min_h || !!min_h_4K;
	UIHacks.MinSize.Height  =   min_h ||   min_h_4K;

	UIHacks.MaxSize.Enabled = !!max_h || !!max_h_4K;
	UIHacks.MaxSize.Height  =   max_h ||   max_h_4K;
}
