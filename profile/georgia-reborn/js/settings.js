/** @type {*} */
var pref = new PanelProperties(); // preferences
/** @type {*} */
let settings = {};
/** @type {*} */
let globals = {};
/** @type {*} */
let transport = {};
/** @type {MetadataGridEntry[]} */
let metadataGrid;

const currentVersion = '2.0.3b';
let configVersion = currentVersion; // will be overwritten when loaded from config file
let updateAvailable = false;
let updateHyperlink;
let is_4k = false;
let is_QHD = false;

const g_component_playcount = utils.CheckComponent('foo_playcount');
const g_component_utils = utils.CheckComponent('foo_utils');
const componentEnhancedPlaycount = utils.CheckComponent('foo_enhanced_playcount');
const componentUiHacks = utils.CheckComponent('foo_ui_hacks');

/** @type {*} */
const doc = new ActiveXObject('htmlfile');
const app = new ActiveXObject('Shell.Application');
/** @type {*} */
const WshShell = new ActiveXObject('WScript.Shell');
/** @type {*} */
const vb = new ActiveXObject('ScriptControl');
/** @type {*} */
const UIHacks = !componentUiHacks || new ActiveXObject('UIHacks');
	  UIHacks.FrameStyle = 3;
	  UIHacks.MoveStyle = 3;
	  UIHacks.Aero.Effect = 2;
	  UIHacks.Aero.Top = 1;
	  UIHacks.BlockMaximize = false;
	  let pseudoCaption;
	  let pseudoCaptionWidth;
	  let mouseInPanel = false;

// THEME PREFERENCES/PROPERTIES EXPLANATIONS - After initial run, these values are changed in Options Menu or by Right Click >> Properties and not here!
pref.add_properties({
	version: ['_theme_version (do not hand edit!)', currentVersion],

	// Settings chronological ordered by Options top menu

	// Theme
	theme:                              ['Georgia-ReBORN - Theme:', 'white'], // use white theme as default
	whiteTheme:                         ['Georgia-ReBORN - Theme: White', true], // use white theme
	blackTheme:                         ['Georgia-ReBORN - Theme: Black', false], // use black theme
	rebornTheme:                        ['Georgia-ReBORN - Theme: Reborn', false], // use full dynamic colors theme
	randomTheme:                        ['Georgia-ReBORN - Theme: Random', false], // use random generated colors theme
	blueTheme:                          ['Georgia-ReBORN - Theme: Blue', false], // use blue theme
	darkblueTheme:                      ['Georgia-ReBORN - Theme: Dark blue', false], // use dark blue theme
	redTheme:                           ['Georgia-ReBORN - Theme: Red', false], // use red theme
	creamTheme:                         ['Georgia-ReBORN - Theme: Cream', false], // use cream theme
	nblueTheme:                         ['Georgia-ReBORN - Theme: Neon blue', false], // use neon blue theme
	ngreenTheme:                        ['Georgia-ReBORN - Theme: Neon green', false], // use neon green theme
	nredTheme:                          ['Georgia-ReBORN - Theme: Neon red', false], // use neon red theme
	ngoldTheme:                         ['Georgia-ReBORN - Theme: Neon gold', false], // use neon gold theme

	// Theme style
	themeStyleDefault:                  ['Georgia-ReBORN - Theme style: Default', true], // default: use default theme style
	themeStyleBevel:                    ['Georgia-ReBORN - Theme style: Bevel', false], // use bevel theme style
	themeStyleBlend:                    ['Georgia-ReBORN - Theme style: Blend', false], // use blend theme style
	themeStyleBlend2:                   ['Georgia-ReBORN - Theme style: Blend2', false], // use blend2 theme style
	themeStyleGradient:                 ['Georgia-ReBORN - Theme style: Gradient', false], // use gradient theme style
	themeStyleGradient2:                ['Georgia-ReBORN - Theme style: Gradient 2', false], // use gradient2 theme style
	themeStyleAlternative:              ['Georgia-ReBORN - Theme style: Alternative Colors', false], // use alternative colors theme style
	themeStyleAlternative2:             ['Georgia-ReBORN - Theme style: Alternative Colors 2', false], // use alternative colors 2 theme style
	themeStyleBlackAndWhite:            ['Georgia-ReBORN - Theme style: Black And White', false], // use Black And White theme style
	themeStyleBlackAndWhite2:           ['Georgia-ReBORN - Theme style: Black And White 2', false], // use Black And White 2 theme style
	themeStyleBlackAndWhiteReborn:      ['Georgia-ReBORN - Theme style: Black And White Reborn', false], // use Black And White Reborn theme style
	themeStyleBlackReborn:              ['Georgia-ReBORN - Theme style: Black Reborn', false], // use Black reborn theme style
	themeStyleRebornWhite:              ['Georgia-ReBORN - Theme style: Reborn White', false], // use Reborn white theme style
	themeStyleRebornBlack:              ['Georgia-ReBORN - Theme style: Reborn Black', false], // use Reborn black theme style
	themeStyleRandomPastel:             ['Georgia-ReBORN - Theme style: Random Pastel', false], // use Random pastel theme style
	themeStyleRandomDark:               ['Georgia-ReBORN - Theme style: Random Dark', false], // use Random dark theme style
	themeStyleRandomAutoColor:          ['Georgia-ReBORN - Theme style: Random Auto Color', 'off'], // use auto color in Random theme
	themeStyleTopMenuButtons:           ['Georgia-ReBORN - Theme style: Top menu buttons', 'default'], // default = flat, style of top menu buttons
	themeStyleTransportButtons:         ['Georgia-ReBORN - Theme style: Transport buttons', 'default'], // default = flat, style of transport buttons
	themeStyleProgressBarRounded:       ['Georgia-ReBORN - Theme style: Progress bar rounded', false], // false = flat, rounded progress bar
	themeStyleProgressBar:              ['Georgia-ReBORN - Theme style: Progress bar', 'default'], // default = flat, style of progress bar
	themeStyleProgressBarFill:          ['Georgia-ReBORN - Theme style: Progress bar fill', 'default'], // default = flat, style of progress bar fill
	themeStyleVolumeBarRounded:         ['Georgia-ReBORN - Theme style: Volume bar rounded', false], // false = flat, rounded volume bar
	themeStyleVolumeBar:                ['Georgia-ReBORN - Theme style: Volume bar', 'default'], // default = flat, style of volume bar
	themeStyleVolumeBarFill:            ['Georgia-ReBORN - Theme style: Volume bar fill', 'default'], // default = flat, style of volume bar fill

	// Player size
	playerSize:                         ['Georgia-ReBORN - Player size:', 'small'], // 'small', default player size
	player_4k_small:                    ['Georgia-ReBORN - Player size: 4K Small',   false], // Player size Small 4k
	player_4k_normal:                   ['Georgia-ReBORN - Player size: 4K Normal',  false], // Player size Normal 4k
	player_4k_large:                    ['Georgia-ReBORN - Player size: 4K Large',   false], // Player size Large 4k
	player_QHD_small:                   ['Georgia-ReBORN - Player size: QHD Small',  false], // Player size Small QHD
	player_QHD_normal:                  ['Georgia-ReBORN - Player size: QHD Normal', false], // Player size Normal QHD
	player_QHD_large:                   ['Georgia-ReBORN - Player size: QHD Large',  false], // Player size Large QHD
	player_HD_small:                    ['Georgia-ReBORN - Player size: HD Small',   false], // Player size Small FHD
	player_HD_normal:                   ['Georgia-ReBORN - Player size: HD Normal',  false], // Player size Normal FHD
	player_HD_large:                    ['Georgia-ReBORN - Player size: HD Large',   false], // Player size Large FHD

	// Layout
	layout_mode:                        ['Georgia-ReBORN - System: Layout mode', 'default_mode'], // Default layout mode

	// Display resolution
	displayRes:                         ['Georgia-ReBORN - System: Display resolution', '<not_set>'], // 4k: switch to 4k res, QHD: switch to QHD res, HD: switch to HD res

	// Brightness
	themeBrightness:                    ['Georgia-ReBORN - System: Theme brightness','default'], // default: default theme brightness

	// Font size
	menu_font_size:                     ['Georgia-ReBORN - Font size: Menu font size', 12], // Default menu font size
	artist_font_size_default:           ['Georgia-ReBORN - Font size: Default mode - Artist font size', 18], // Default artist font size in Default mode
	artist_font_size_artwork:           ['Georgia-ReBORN - Font size: Artwork mode - Artist font size', 16], // Default artist font size in Artwork mode
	artist_font_size_compact:           ['Georgia-ReBORN - Font size: Compact mode - Artist font size', 16], // Default artist font size in Compact mode
	album_font_size:                    ['Georgia-ReBORN - Font size: Album font size', 20], // Default album font size
	lower_bar_font_size_default:        ['Georgia-ReBORN - Font size: Default mode - Lower bar font size', 18], // Default lower bar font size in Default mode
	lower_bar_font_size_artwork:        ['Georgia-ReBORN - Font size: Artwork mode - Lower bar font size', 16], // Default lower bar font size in Artwork mode
	lower_bar_font_size_compact:        ['Georgia-ReBORN - Font size: Compact mode - Lower bar font size', 16], // Default lower bar font size in Compact mode
	tracknum_font_size :                ['Georgia-ReBORN - Font size: Tracknumber font size', 18], // Default tracknumber font size
	MetadataGrid_key_font_size:         ['Georgia-ReBORN - Font size: MetadataGrid key font size', 17], // Default metadata grid key font size
	MetadataGrid_val_font_size:         ['Georgia-ReBORN - Font size: MetadataGrid value font size', 17], // Default metadata grid value font size
	font_size_playlist:                 ['Georgia-ReBORN - Font size: Playlist', 12], // Default playlist font size
	font_size_playlist_header:          ['Georgia-ReBORN - Font size: Playlist Header', 15], // Default playlist header font size
	lyricsFontSize:                     ['Georgia-ReBORN - Font size: Lyrics', 20], // Lyrics font size

	// Player controls
	alignAlbumArt:                      ['Georgia-ReBORN - Player controls: When player size is not proportional align album art', 'right'], // right: Align album art in default mode when player size is not proportional
	show_coloredGap_albumart:           ['Georgia-ReBORN - Player controls: When player size is not proportional show colored gap', true], // true: Show colored gap left of albumart when player size is not proportional
	cycleArt:                           ['Georgia-ReBORN - Player controls: Cycle through all images', false], // true: Use glob, false: use albumart reader (front only)
	cycleArtMWheel:                     ['Georgia-ReBORN - Player controls: Cycle through all images with mouse wheel', true], // true: Cycle through all images with mouse wheel
	playlistAutoHideScrollbar:          ['Georgia-ReBORN - Player controls: Playlist - Auto hide scrollbar', true], // Playlist automatic scrollbar hide
	smoothScrolling:                    ['Georgia-ReBORN - Player controls: Playlist - Smooth scrolling', true], // Playlist smooth scrolling
	playlistWheelScrollSteps:           ['Georgia-ReBORN - Player controls: Playlist - Mouse wheel scroll steps', 2], // Playlist mouse wheel scroll steps
	playlistWheelScrollDuration:        ['Georgia-ReBORN - Player controls: Playlist - Mouse wheel scroll smooth duration', 30], // Playlist mouse wheel scroll smooth duration in ms
	libraryAutoHideScrollbar:           ['Georgia-ReBORN - Player controls: Library - Auto hide scrollbar', true], // Library automatic scrollbar hide
	biographyAutoHideScrollbar:         ['Georgia-ReBORN - Player controls: Biography - Auto hide scrollbar', true], // Biography automatic scrollbar hide
	show_tt:                            ['Georgia-ReBORN - Player controls: Show tooltips', false], // true: Show all tooltips
	show_truncatedText_tt:              ['Georgia-ReBORN - Player controls: Show tooltips on truncated text', true], // true: Show tooltips when hovering over truncated text on lower bar, metadata grid and playlist
	show_timeline_tooltips:             ['Georgia-ReBORN - Player controls: Show timeline tooltips', true], // true: Show tooltips when hovering over the timeline that show information on plays
	autoHideVolumeBar:                  ['Georgia-ReBORN - Player controls: Auto hide volume bar', true], // Volume control bar hide
	transport_buttons_size_default:     ['Georgia-ReBORN - Player controls: Default mode - Transport button size', 32], // Size in pixels of the buttons in Default mode
	transport_buttons_spacing_default:  ['Georgia-ReBORN - Player controls: Default mode - Transport button spacing', 5], // Size in pixels of the spacing between buttons in Default mode
	transport_buttons_size_artwork:     ['Georgia-ReBORN - Player controls: Artwork mode - Transport button size', 32], // Size in pixels of the buttons in Artwork mode
	transport_buttons_spacing_artwork:  ['Georgia-ReBORN - Player controls: Artwork mode - Transport button spacing', 5], // Size in pixels of the spacing between buttons in Artwork mode
	transport_buttons_size_compact:     ['Georgia-ReBORN - Player controls: Compact mode - Transport button size', 32], // Size in pixels of the buttons in Compact mode
	transport_buttons_spacing_compact:  ['Georgia-ReBORN - Player controls: Compact mode - Transport button spacing', 5], // Size in pixels of the spacing between buttons in Compact mode
	show_progressBar_default:           ['Georgia-ReBORN - Player controls: Default mode - Show Progress Bar', true], // true: Show progress bar in Default mode, otherwise hide it (useful is using another panel for this)
	show_progressBar_artwork:           ['Georgia-ReBORN - Player controls: Artwork mode - Show Progress Bar', true], // true: Show progress bar in Artwork mode, otherwise hide it (useful is using another panel for this)
	show_progressBar_compact:           ['Georgia-ReBORN - Player controls: Compact mode - Show Progress Bar', true], // true: Show progress bar in Compact mode, otherwise hide it (useful is using another panel for this)
	show_playbackTime_default:          ['Georgia-ReBORN - Player controls: Default mode - Show playback time in lower bar', true], // Show playback time in lower bar Default mode
	show_playbackTime_artwork:          ['Georgia-ReBORN - Player controls: Artwork mode - Show playback time in lower bar', true], // Show playback time in lower bar Artwork mode
	show_playbackTime_compact:          ['Georgia-ReBORN - Player controls: Compact mode - Show playback time in lower bar', true], // Show playback time in lower bar Compact mode
	show_artist_default:                ['Georgia-ReBORN - Player controls: Default mode - Show artist in lower bar', true], // Show artist in lower bar Default mode
	show_artist_artwork:                ['Georgia-ReBORN - Player controls: Artwork mode - Show artist in lower bar', true], // Show artist in lower bar Artwork mode
	show_artist_compact:                ['Georgia-ReBORN - Player controls: Compact mode - Show artist in lower bar', true], // Show artist in lower bar Compact mode
	show_title_default:                 ['Georgia-ReBORN - Player controls: Default mode - Show song title in lower bar', true], // Show song title in lower bar Default mode
	show_title_artwork:                 ['Georgia-ReBORN - Player controls: Artwork mode - Show song title in lower bar', true], // Show song title in lower bar Artwork mode
	show_title_compact:                 ['Georgia-ReBORN - Player controls: Compact mode - Show song title in lower bar', true], // Show song title in lower bar Compact mode
	show_composer:                      ['Georgia-ReBORN - Player controls: Show composer in lower bar', false], // Show composer in lower bar
	show_flags_lowerbar:                ['Georgia-ReBORN - Player controls: Show country flags in lower bar', true], // true: Show the artist country flags in lower bar
	show_pause:                         ['Georgia-ReBORN - Player controls: Show pause on album cover', true], // true: Show pause button on album cover
	show_logo:                          ['Georgia-ReBORN - Player controls: Show logo on startup', true], // true: Show logo on foobar startup
	freq_update:                        ['Georgia-ReBORN - Player controls: Frequent progress bar updates', true], // true: Update progress bar multiple times a second. Smoother, but uses more CPU

	// Playlist
	autoHidePLM:                        ['Georgia-ReBORN - Playlist: Auto hide playlist manager', true], // Playlist Automatic Playlist Manager Hide
	showPLM_default:                    ['Georgia-ReBORN - Playlist: PLM Default mode - Show playlist manager',  true], // Show Playlist manager in Default mode
	showPLM_artwork:                    ['Georgia-ReBORN - Playlist: PLM Artwork mode - Show playlist manager', false], // Show Playlist manager in Artwork mode
	showPLM_compact:                    ['Georgia-ReBORN - Playlist: PLM Compact mode - Show playlist manager', false], // Show Playlist manager in Compact mode
	showPlaylistFulldate:               ['Georgia-ReBORN - Playlist: Show full date', false], // Playlist show full date YYYY-MM-DD
	hyperlinks_ctrl:                    ['Georgia-ReBORN - Playlist: Hyperlinks require CTRL Key', false], // true: Clicking on hyperlinks only works if CTRL key is held down
	show_weblinks:                      ['Georgia-ReBORN - Playlist: Show weblinks', true], // Show weblinks in context menu
	show_different_artist:              ['Georgia-ReBORN - Playlist: Show artist name on difference', false], // Show artist name on difference
	show_artist_playlistRows:           ['Georgia-ReBORN - Playlist: Show artist name in all playlist rows', false], // Show artist name in all playlist rows
	show_album_playlistRows:            ['Georgia-ReBORN - Playlist: Show album title in all playlist rows', false], // Show album title in all playlist rows
	playlistTimeRemaining:              ['Georgia-ReBORN - Playlist: Show time remaining on playing track', false], // Show time remaining in playlist on currently playing track
	lastFmScrobblesFallback:            ['Georgia-ReBORN - Playlist: Show last.fm scrobbles on no local plays', true], // true: Show last.fm scrobbles if no local play count exist
	startPlaylist:                      ['Georgia-ReBORN - Playlist: Display playlist on startup', true], // true: Show the playlist window when the theme starts up
	use_vinyl_nums:                     ['Georgia-ReBORN - Playlist: Use vinyl style numbering (e.g. A1)', true], // true: If the tags specified in tf.vinyl_side and tf.vinyl_tracknum are set, then we'll show vinyl style track numbers (i.e. "B2." instead of "04.")
	always_showPlayingPl:               ['Georgia-ReBORN - Playlist: Always scroll to current playing song', false], // Always scroll to current playing song in playlist
	playlistRowHover:                   ['Georgia-ReBORN - Playlist: Row mouse hover', true], // Enable playlist row mouse hover effect

	// Details
	show_artistInGrid:                  ['Georgia-ReBORN - Details: Display artist in info grid', false], // false: Don't show artist at top of info grid
	show_titleInGrid:                   ['Georgia-ReBORN - Details: Display song title in info grid', false], // false: Don't show title at top of info grid, and move album title above timeline
	show_flags_details:                 ['Georgia-ReBORN - Details: Show country flags in Details', true], // true: Show the artist country flags in Details
	no_cdartBG:                         ['Georgia-ReBORN - Details: Show full background when no disc art', true], // Fill background when no disc art is available
	labelArtOnBg:                       ['Georgia-ReBORN - Details: Art: Draw label art on background', false], // true: Don't show the theme color background behind label art
	invertedBand:                       ['Georgia-ReBORN - Details: Invert band logos to black', false], // Manually invert band logos to black
	invertedLabel:                      ['Georgia-ReBORN - Details: Invert label logos to black', false], // Manually invert label logos to black
	display_cdart:                      ['Georgia-ReBORN - Details: Art - Display CD art', true], // true: Show CD artwork behind album artwork. This artwork is expected to be named cd.png and have transparent backgrounds (can be found at fanart.tv)
	showDiscArtStub:                    ['Georgia-ReBORN - Details: Art - Show disc art placeholder if no disc art found', false], // Show disc art placeholder if no disc art found
	noDiscArtStub:                      ['Georgia-ReBORN - Details: Art - No disc art placeholder', true], // Do not show disc art placeholder
	cdArtWhiteStub:                     ['Georgia-ReBORN - Details: Art - Show CD art white placeholder', false], // Show cdArt white placeholder if no disc art exist
	cdArtBlackStub:                     ['Georgia-ReBORN - Details: Art - Show CD art black placeholder', false], // Show cdArt black placeholder if no disc art exist
	cdArtBlankStub:                     ['Georgia-ReBORN - Details: Art - Show CD art blank placeholder', false], // Show cdArt blank placeholder if no disc art exist
	cdArtTransStub:                     ['Georgia-ReBORN - Details: Art - Show CD art transparent placeholder', false], // Show cdArt transparent placeholder if no disc art exist
	cdArtCustomStub:                    ['Georgia-ReBORN - Details: Art - Show CD art custom placeholder', false], // Show cdArt custom placeholder if no disc art exist
	vinylArtWhiteStub:                  ['Georgia-ReBORN - Details: Art - Show Vinyl art white placeholder', false], // Show vinylArt white placeholder if no disc art exist
	vinylArtVoidStub:                   ['Georgia-ReBORN - Details: Art - Show Vinyl art void placeholder', false], // Show vinylArt void placeholder if no disc art exist
	vinylArtColdFusionStub:             ['Georgia-ReBORN - Details: Art - Show Vinyl art cold fusion placeholder', false], // Show vinylArt cold fusion placeholder if no disc art exist
	vinylArtRingOfFireStub:             ['Georgia-ReBORN - Details: Art - Show Vinyl art ring of fire placeholder', false], // Show vinylArt ring of fire placeholder if no disc art exist
	vinylArtMapleStub:                  ['Georgia-ReBORN - Details: Art - Show Vinyl art maple placeholder', false], // Show vinylArt maple placeholder if no disc art exist
	vinylArtBlackStub:                  ['Georgia-ReBORN - Details: Art - Show Vinyl art black placeholder', false], // Show vinylArt black placeholder if no disc art exist
	vinylArtBlackHoleStub:              ['Georgia-ReBORN - Details: Art - Show Vinyl art black hole placeholder', false], // Show vinylArt black hole placeholder if no disc art exist
	vinylArtEbonyStub:                  ['Georgia-ReBORN - Details: Art - Show Vinyl art ebony placeholder', false], // Show vinylArt ebony placeholder if no disc art exist
	vinylArtTransStub:                  ['Georgia-ReBORN - Details: Art - Show Vinyl art transparent placeholder', false], // Show vinylArt transparent placeholder if no disc art exist
	vinylArtCustomStub:                 ['Georgia-ReBORN - Details: Art - Show Vinyl art custom placeholder', false], // Show vinylArt custom placeholder if no disc art exist
	cdart_ontop:                        ['Georgia-ReBORN - Details: Art - Show CD art above front cover', false], // true: Display cdArt above front cover
	filterCdJpgsFromAlbumArt:           ['Georgia-ReBORN - Details: Art - Filter out cd/vinyl .jpgs from showing as artwork', false],
	spinCdart:                          ['Georgia-ReBORN - Details: Art - Spin CD art', false], // true: cdArt will spin while the song plays
	spinCdArtImageCount:                ['Georgia-ReBORN - Details: Art - # of images to create while spinning', 60], // Higher numbers will increase memory usage, and slow down spin
	spinCdArtRedrawInterval:            ['Georgia-ReBORN - Details: Art - Spin CD draw interval', 75], // Speed in ms with which to attempt redraw. Lower numbers will increase CPU
	rotate_cdart:                       ['Georgia-ReBORN - Details: Art - Rotate CD art on new track', true], // true: Rotate cdArt based on track number. i.e. rotationAmt = %tracknum% * x degrees
	rotation_amt:                       ['Georgia-ReBORN - Details: Art - Degrees to rotate CDart', 3], // # of degrees to rotate per track change.
	art_rotate_delay:                   ['Georgia-ReBORN - Details: Art - Seconds to display each art', 30], // Seconds per image

	// Library
	libraryDesign:                      ['Georgia-ReBORN - Library: Design', 'reborn'], // Library design - reborn (default), ultraModern, modern, traditional, listView, listView_albumCovers, listView_artistPhotos, albumCovers, flowMode
	libraryLayout:                      ['Georgia-ReBORN - Library: Layout', 'normal_width'], // Library layout - normal_width (default) or full_width
	libraryThumbnailSize:               ['Georgia-ReBORN - Library: Thumbnail size', 'auto'], // Library thumbnail size - auto (default)
	showTrackCount:                     ['Georgia-ReBORN - Library: Show track count in album art', true], // Show track count in album art
	libraryPlaylistSwitch:              ['Georgia-ReBORN - Library: Switch to playlist when adding songs', false], // When adding songs from Library auto-switch to Playlist
	always_showPlayingLib:              ['Georgia-ReBORN - Library: Always scroll to current playing song', false], // Always scroll to current playing song in library
	libraryRowHover:                    ['Georgia-ReBORN - Library: Row mouse hover', true], // Enable library row mouse hover effect

	// Biography
	biographyTheme:                     ['Georgia-ReBORN - Biography: Theme', 0], // 0 (default)
	biographyDisplay:                   ['Georgia-ReBORN - Biography: Display', 'Image+text'], // Image+text (default)

	// Lyrics
	lyricsRememberDisplay:              ['Georgia-ReBORN - Lyrics: Remember toggle setting', false], // true: Show lyrics on startup if they were displayed when theme last reloaded
	lyrics_normal_color:                ['Georgia-ReBORN - Lyrics: Text Color', 'RGBA(255, 255, 255, 255);'],
	lyrics_focus_color:                 ['Georgia-ReBORN - Lyrics: Text Highlight Color', 'RGBA(255, 241, 150, 255);'],
	displayLyrics:                      ['Georgia-ReBORN - Lyrics: Show lyrics', false], // true: Shows lyrics, always set to false at startup unless lyricsRememberDisplay is true
	albumArtLyrics:                     ['Georgia-ReBORN - Lyrics: Show album art when displaying lyrics', true], // true: Show album art when displaying lyrics

	// Settings
	devTools:                           ['Georgia-ReBORN - Settings: Enable developer tools', false], // true: Show developer tools in options context menu

	// System
	maximize_to_fullscreen:             ['Georgia-ReBORN - System: Maximize to fullscreen', true], // Maximize function
	saved_layout_mode:                  ['Georgia-ReBORN - System: Saved layout mode', 'default_mode'], // Default saved layout mode
	default_mode_saved_width:           ['Georgia-ReBORN - System: Default mode - Saved width',  is_4k ? 2800 : is_QHD ? 1260 : 1140], // Default saved width for Default mode
	default_mode_saved_height:          ['Georgia-ReBORN - System: Default mode - Saved height', is_4k ? 1720 : is_QHD ?  790 :  730], // Default saved height for Default mode
	artwork_mode_saved_width:           ['Georgia-ReBORN - System: Artwork mode - Saved width',  is_4k ? 1052 : is_QHD ?  640 :  526], // Default saved width for Artwork mode
	artwork_mode_saved_height:          ['Georgia-ReBORN - System: Artwork mode - Saved height', is_4k ? 1372 : is_QHD ?  790 :  686], // Default saved height for Artwork mode
	compact_mode_saved_width:           ['Georgia-ReBORN - System: Compact mode - Saved width',  is_4k ?  964 : is_QHD ?  540 :  484], // Default saved width for Compact mode
	compact_mode_saved_height:          ['Georgia-ReBORN - System: Compact mode - Saved height', is_4k ? 1720 : is_QHD ?  790 :  730], // Default saved height for Compact mode
	is_first_launch:                    ['Georgia-ReBORN - System: First launch', true], // true: Init DPI/RES check and setup size
	checkForUpdates:                    ['Georgia-ReBORN - System: Check for Updates', true], // true: Check github repo to determine if updates exist
	loadAsync:                          ['Georgia-ReBORN - System: Load Theme Asynchronously', true], // Loads individual theme files asynchronously at startup to reduce risk of FSM throwing slow script error on startup

	// Misc
	switchPlaybackTime:                 ['Georgia-ReBORN - Misc: Switch to playback time remaining', false], // Switch the playback time from time elapsed to time remaining
	playbackOrder:                      ['Georgia-ReBORN - Misc: Playback order', 'Default'], // Playback order 'Default' for context plus foobar menu when no transport controls are displayed

	// check_multich:		['Check for MultiChannel version', false],	// true: Search paths in tf.MultiCh_paths to see if there is a multichannel version of the current album available
});


// Fixup properties
(function() {
	var saved_layout_mode = pref.saved_layout_mode;
	if (saved_layout_mode !== 'default_mode' || saved_layout_mode !== 'compact_mode') {
		pref.saved_layout_mode = 'default_mode';
	}
})();

// Lyrics variables
// lyrics color definitions
var g_txt_normalcolour = eval(pref.lyrics_normal_color);
var g_txt_highlightcolour = eval(pref.lyrics_focus_color);
var g_txt_shadowcolor = RGBA(0, 0, 0, 255);

// TEXT FIELDS
var stoppedTime = 'Georgia-ReBORN v' + currentVersion;

/* My old ridiculous artist string:
$puts(AF,
	$ifgreater($meta_num(ArtistFilter),1,$puts(mArtist,$meta(ArtistFilter,0))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
	$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$get(mArtist)\
	$if($stricmp($get(mArtist),%artist%),$puts(feat,1),)\
	$puts(mArtist,$meta(ArtistFilter,1))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
	$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$if($get(feat), feat. ,', ')$get(mArtist)\
	$puts(mArtist,$meta(ArtistFilter,2))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
	$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),3,' & ',', ')$get(mArtist)\
	$puts(mArtist,$meta(ArtistFilter,3))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
	$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),4,' & ',', ')$get(mArtist)\
	$puts(mArtist,$meta(ArtistFilter,4))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
	$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),5,' & ',', ')$get(mArtist)\
	)))))))))),%artist%)
)
$ifequal($strcmp(%album artist%,%artist%),1,$get(AF),$if3($meta(artist),%composer%,%performer%,%album artist%))

In one line for adding to config file:
$puts(AF,$ifgreater($meta_num(ArtistFilter),1,$puts(mArtist,$meta(ArtistFilter,0))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$get(mArtist)$if($stricmp($get(mArtist),%artist%),$puts(feat,1),)$puts(mArtist,$meta(ArtistFilter,1))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$if($get(feat), feat. ,', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,2))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),3,' & ',', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,3))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),4,' & ',', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,4))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),5,' & ',', ')$get(mArtist))))))))))),%artist%))$ifequal($strcmp(%album artist%,%artist%),1,$get(AF),$if3($meta(artist),%composer%,%performer%,%album artist%))
*/


const configPath = fb.ProfilePath + 'georgia-reborn\\georgia-reborn-config.jsonc';
const config = new Configuration(configPath);
let titleformat = {};
if (!config.fileExists) {
	settings = config.addConfigurationObject(settingsSchema, settingsDefaults, settingsComments);
	tf = config.addConfigurationObject(titleFormatSchema, defaultTitleFormatStrings, titleFormatComments);
	config.addConfigurationObject(gridSchema, defaultMetadataGrid);	// we don't assign an object here because these aren't key/value pairs and thus can't use the get/setters
	config.addConfigurationObject(imgPathSchema, imgPathDefaults);
	config.addConfigurationObject(lyricFilenamesSchema, lyricFilenamesDefaults);
	config.addConfigurationObject(transportSchema, transportDefaults);
	console.log('> Writing', configPath);
	config.writeConfiguration();
}
if (config.fileExists) {
	const prefs = config.readConfiguration();
	/**
	 * While we've read all the values in, we still need to call addConfigurationObject to add the getters/setters
	 * for the objects so that the file gets automatically written when a setting is changed.
	 **/
	settings = config.addConfigurationObject(settingsSchema, Object.assign({}, settingsDefaults, prefs.settings), settingsComments);
	transport = config.addConfigurationObject(transportSchema, Object.assign({}, transportDefaults, prefs.transport), transportComments);
	tf = config.addConfigurationObject(titleFormatSchema, Object.assign({}, defaultTitleFormatStrings, prefs.title_format_strings), titleFormatComments);
	prefs.metadataGrid.forEach(entry => {
		// copy comments over to existing object so they aren't lost
		const gridEntryDefinition = defaultMetadataGrid.find(gridDefItem => gridDefItem.label === entry.label);
		if (gridEntryDefinition && gridEntryDefinition.comment) {
			entry.comment = gridEntryDefinition.comment;
		}
	});
	config.addConfigurationObject(gridSchema, prefs.metadataGrid);	// can't Object.assign here to add new fields. Add new fields in the upgrade section of migrateCheck
	config.addConfigurationObject(imgPathSchema, prefs.imgPaths);
	config.addConfigurationObject(lyricFilenamesSchema, prefs.lyricFilenamePatterns || lyricFilenamesDefaults);

	/* Safety checks. Fix up potentially bad vals from config */
	settings.cdArtBasename = settings.cdArtBasename && settings.cdArtBasename.trim().length ? settings.cdArtBasename.trim() : 'cd';
	settings.artworkDisplayTime = Math.min(Math.max(settings.artworkDisplayTime, 5),120);	// ensure min of 5sec and max of 120sec

	globals.imgPaths = prefs.imgPaths;
	globals.lyricFilenamePatterns = prefs.lyricFilenamePatterns;
	metadataGrid = prefs.metadataGrid;
	configVersion = prefs.configVersion || prefs.version;
	// when adding new objects to the config file, add them in the version check below
}

// do the migration check BEFORE we start adding extra crap to tf.
// TODO: Should I move all the tf. extra properties that AREN'T in the config to the globals object? Probably maybe?
migrateCheck(currentVersion, configVersion);

/* All tf values from here below will NOT be written to the georgia-reborn-config file */
tf.vinyl_track = '$if2(' + tf.vinyl_side + '[' + tf.vinyl_tracknum + ']. ,[%tracknumber%. ])';

tf.lyr_path = [ // simply add, change or re-order entries as needed
	'$replace($replace(%path%,%filename_ext%,),\,\\)',
	fb.ProfilePath + 'lyrics\\',
	fb.FoobarPath + 'lyrics\\',
];

tf.labels = [ // Array of fields to test for publisher. Add, change or re-order as needed.
	'label', // DO NOT put %s around the field names because we are using $meta() calls
	'publisher',
	'discogs_label'
];

// CD-ART SETTINGS
// we expect cd-art will be in .png with transparent background, best found at fanart.tv.
pref.vinylside_path = '$directory_path(%path%)\\vinyl$if2(' + tf.vinyl_side + ',).png'; // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.vinylside_path_artwork_root = '$directory_path(%path%)\\..\\Artwork\\vinyl$if2(' + tf.vinyl_side + ',).png'; // Root Artwork
pref.vinylside_path_images_root = '$directory_path(%path%)\\..\\Images\\vinyl$if2(' + tf.vinyl_side + ',).png'; // Root Images
pref.vinylside_path_scans_root = '$directory_path(%path%)\\..\\Scans\\vinyl$if2(' + tf.vinyl_side + ',).png'; // Root Scans
pref.vinylside_path_artwork = '$directory_path(%path%)\\Artwork\\vinyl$if2(' + tf.vinyl_side + ',).png'; // Subfolder Artwork
pref.vinylside_path_images = '$directory_path(%path%)\\Images\\vinyl$if2(' + tf.vinyl_side + ',).png'; // Subfolder Images
pref.vinylside_path_scans = '$directory_path(%path%)\\Scans\\vinyl$if2(' + tf.vinyl_side + ',).png'; // Subfolder Scans

pref.vinyl_path = '$directory_path(%path%)\\vinyl.png'; // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.vinyl_path_artwork_root = '$directory_path(%path%)\\..\\Artwork\\vinyl.png'; // Root Artwork
pref.vinyl_path_images_root = '$directory_path(%path%)\\..\\Images\\vinyl.png'; // Root Images
pref.vinyl_path_scans_root = '$directory_path(%path%)\\..\\Scans\\vinyl.png'; // Root Scans
pref.vinyl_path_artwork = '$directory_path(%path%)\\Artwork\\vinyl.png'; // Subfolder Artwork
pref.vinyl_path_images = '$directory_path(%path%)\\Images\\vinyl.png'; // Subfolder Images
pref.vinyl_path_scans = '$directory_path(%path%)\\Scans\\vinyl.png'; // Subfolder Scans

pref.cdartdisc_path = '$directory_path(%path%)\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // cdart named cd1.png, cd2.png, etc.
pref.cdartdisc_path_artwork_root = '$directory_path(%path%)\\..\\Artwork\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // Root Artwork
pref.cdartdisc_path_images_root = '$directory_path(%path%)\\..\\Images\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // Root Images
pref.cdartdisc_path_scans_root = '$directory_path(%path%)\\..\\Scans\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // Root Scans
pref.cdartdisc_path_artwork = '$directory_path(%path%)\\Artwork\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // Subfolder Artwork
pref.cdartdisc_path_images = '$directory_path(%path%)\\Images\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // Subfolder Images
pref.cdartdisc_path_scans = '$directory_path(%path%)\\Scans\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // Subfolder Scans

pref.cdart_path = '$directory_path(%path%)\\' + settings.cdArtBasename + '.png'; // cdart named cd.png (or whatever custom value was specified). This is the most common single disc case.
pref.cdart_path_artwork_root = '$directory_path(%path%)\\..\\Artwork\\' + settings.cdArtBasename + '.png'; // Root Artwork
pref.cdart_path_images_root = '$directory_path(%path%)\\..\\Images\\' + settings.cdArtBasename + '.png'; // Root Images
pref.cdart_path_scans_root = '$directory_path(%path%)\\..\\Scans\\' + settings.cdArtBasename + '.png'; // Root Scans
pref.cdart_path_artwork = '$directory_path(%path%)\\Artwork\\' + settings.cdArtBasename + '.png'; // Subfolder Artwork
pref.cdart_path_images = '$directory_path(%path%)\\Images\\' + settings.cdArtBasename + '.png'; // Subfolder Images
pref.cdart_path_scans = '$directory_path(%path%)\\Scans\\' + settings.cdArtBasename + '.png'; // Subfolder Scans
pref.cdart_amount = 0.48; // show 48% of the CD image if it will fit on the screen
{
	let count = Number(pref.spinCdArtImageCount);
	if (count !== count) { // check if NaN
		count = 72;
	}
	pref.spinCdArtImageCount = count;
	let interval = Number(pref.spinCdArtRedrawInterval);
	if (interval !== interval) {
		interval = 200;
	}
	pref.spinCdArtRedrawInterval = Math.max(50, interval);
}

if (!pref.lyricsRememberDisplay) {
	pref.displayLyrics = false;
}

function migrateCheck(version, storedVersion) {
	/**
	 * Adds or Replaces value in the grid with updated string from defaults
	 * @param {MetadataGridEntry[]} grid
	 * @param {string} label Label of the value to add or replace
	 * @param {number} position 0-based index of place to insert new value if existing entry not found
	 */
	const replaceGridEntry = (grid, label, position) => {
		const entryIdx = grid.findIndex(gridEntry => gridEntry && gridEntry.label.toLowerCase() === label.toLowerCase());
		const newVal = defaultMetadataGrid[defaultMetadataGrid.findIndex(e => e && e.label.toLowerCase() === label.toLowerCase())];
		if (entryIdx >= 0) {
			grid[entryIdx] = newVal;
		} else {
			grid.splice(position, 0, newVal);
		}
	}

	if (version !== storedVersion) {
		const configFile = config.readConfiguration();
		/** @type {MetadataGridEntry[]} */
		const grid = configFile.metadataGrid;

		// this function clears default values which have changed
		switch (storedVersion) {

			case '2.0.0-beta1':
			case '2.0.0-beta2':
				window.SetProperty('Georgia-ReBORN - Details: Art - Seconds to display each art', null);
				tf.lyrics = defaultTitleFormatStrings.lyrics;
			case '2.0.0-beta3':
				config.addConfigurationObject(lyricFilenamesSchema, lyricFilenamesDefaults);
			case '2.0.0-beta4':
				settings.extraTrackInfo = settingsDefaults.extraTrackInfo;
				config.addConfigurationObject(transportSchema, transportDefaults);

			case '2.0.0':
			case '2.0.1':
				settings.defaultSortString = settingsDefaults.defaultSortString;
				tf.releaseCountry = defaultTitleFormatStrings.releaseCountry;
				replaceGridEntry(grid, 'Label', 5);
				replaceGridEntry(grid, 'Catalog #', 6);
				replaceGridEntry(grid, 'Release Country', 7);
				config.addConfigurationObject(gridSchema, grid);

			case '2.0.2':
			case '2.0.3-dev':
				window.SetProperty('ADV.Limit Menu Expand: 10-6000', undefined);
				window.SetProperty('SYSTEM: Filter By', undefined);
				window.SetProperty('SYSTEM: View By', undefined);

				// this block should appear after all previous versions have fallen through
				console.log('> Upgrading Georgia-ReBORN Theme settings from', storedVersion);
				const fileName = `georgia\\georgia-config-${storedVersion}.jsonc`;
				console.log(`> Backing up Georgia-ReBORN Configuration file to ${fileName}`);
				fso.CopyFile(configPath, fb.ProfilePath + fileName);
				config.writeConfiguration();
				window.Reload();

			case '2.0.3':

			default:
				break;

		}
	}
	pref.version = currentVersion;	// always update the version panel property
}

let retryCount = 0; // don't hammer if it's not working

function checkForUpdates(openUrl) {
	var url = 'https://api.github.com/repos/TT-ReBORN/Georgia-ReBORN/tags';
	makeHttpRequest('GET', url, function (resp) {
		try {
			var respObj = JSON.parse(resp);
			updateAvailable = isNewerVersion(currentVersion, respObj[0].name);
			console.log('Current released version of Georgia-ReBORN: v' + respObj[0].name);
			if (updateAvailable) {
				console.log('>>> Georgia-ReBORN update available. Download it here: https://github.com/TT-ReBORN/Georgia-ReBORN/releases');
				updateHyperlink = new Hyperlink('Update Available', ft.lower_bar, 'update', 0, 0, window.Width);
				if (updateHyperlink) {
					stoppedTime = '';
					if (!fb.IsPlaying) {
						str.time = stoppedTime;
						RepaintWindow();
					}
					if (openUrl) {
						updateHyperlink.click();
					}
				}
			} else {
				console.log('You are on the most current version of Georgia-ReBORN');
			}
		} catch (e) {
			if (!updateHyperlink && retryCount < 3) {
				// updateHyperlink failed to be created somehow. Let's check again after 1 minute.
				retryCount++;
				updateAvailable = false;
				scheduleUpdateCheck(61000);
			}
		}
	});
}


/**
 * Schedule an update check. Set at startup and then typically every 24 hours after unless an update is found
 * @param {number} delay in milliseconds
 */
let updateTimer;
function scheduleUpdateCheck(delay) {
	clearTimeout(updateTimer);
	updateTimer = setTimeout(() => {
		if (!updateAvailable) {
			checkForUpdates(false);
			scheduleUpdateCheck(1000 * 60 * 60 * 24);	// check every 24 hours
		}
	}, delay)
}
