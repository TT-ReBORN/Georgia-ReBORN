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

const currentVersion = '2.0.3-dev';
let configVersion = currentVersion; // will be overwritten when loaded from config file
let updateAvailable = false;
let updateHyperlink;

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
const fso = new ActiveXObject('Scripting.FileSystemObject');
/** @type {*} */
const vb = new ActiveXObject('ScriptControl');
/** @type {*} */
const UIHacks = !componentUiHacks || new ActiveXObject('UIHacks');

// THEME PREFERENCES/PROPERTIES EXPLANATIONS - After initial run, these values are changed in Options Menu or by Right Click >> Properties and not here!
pref.add_properties({
	version: ['_theme_version (do not hand edit!)', currentVersion],
	rotation_amt: ['Art: Degrees to rotate CDart', 3], // # of degrees to rotate per track change.
	cycleArt: ['Art: Cycle through all images', true], // true: use glob, false: use albumart reader (front only)
	display_cdart: ['Art: Display CD art', true], // true: show CD artwork behind album artwork. This artwork is expected to be named cd.png and have transparent backgrounds (can be found at fanart.tv)
	art_rotate_delay: ['Art: Seconds to display each art', 30], // seconds per image
	rotate_cdart: ['Art: Rotate CD art on new track', true], // true: rotate cdArt based on track number. i.e. rotationAmt = %tracknum% * x degrees
	cdart_ontop: ['Art: Show CD art above front cover', false], // true: display cdArt above front cover
	spinCdart: ['Art: Spin CD art', false], // true: cdArt will spin while the song plays
	spinCdArtImageCount: ['Art: # of images to create while spinning', 60], // higher numbers will increase memory usage, and slow down spin
	spinCdArtRedrawInterval: ['Art: Spin CD draw interval', 200], // speed in ms with which to attempt redraw. Lower numbers will increase CPU
	filterCdJpgsFromAlbumArt: ['Art: Filter out cd/vinyl .jpgs from showing as artwork', false],
	labelArtOnBg: ['Art: Draw label art on background', false], // true: don't show the theme color background behind label art
	show_flags: ['Show country flags', true], // true: show the artist country flags
	// check_multich:		['Check for MultiChannel version', false],	// true: search paths in tf.MultiCh_paths to see if there is a multichannel version of the current album available
	use_vinyl_nums: ['Use vinyl style numbering (e.g. A1)', true], // true: if the tags specified in tf.vinyl_side and tf.vinyl_tracknum are set, then we'll show vinyl style track numbers (i.e. "B2." instead of "04.")
	startPlaylist: ['Display playlist on startup', true], // true: show the playlist window when the theme starts up
	show_progress_bar: ['Show Progress Bar', true], // true: show progress bar, otherwise hide it (useful is using another panel for this)
	transport_buttons_size: ['Transport: Button size', 32], // size in pixels of the buttons
	transport_buttons_spacing: ['Transport: Button spacing', 5], // size in pixels of the spacing between buttons
	showTitleInGrid: ['Display song title in info grid', false], // false: don't show title at top of info grid, and move album title above timeline

	show_timeline_tooltips: ['Show timeline tooltips', true], // true: show tooltips when hovering over the timeline that show information on plays

	menu_font_size: ['Menu font size', 12],

	freq_update: ['Frequent progress bar updates', true], // true: update progress bar multiple times a second. Smoother, but uses more CPU
	darkMode: ['Use Dark Theme', false], // true: use a darker background
	whiteTheme: ['Georgia ReBORN White Theme', 'white'], // white: use white theme
	blackTheme: ['Georgia ReBORN Black Theme', 'black'], // dark: use dark theme
	blueTheme: ['Georgia ReBORN Blue Theme', 'blue'], // blue: use blue theme
	darkblueTheme: ['Georgia ReBORN Dark Blue Theme', 'darkblue'], // darkblue: use dark blue theme
	redTheme: ['Georgia ReBORN Red Theme', 'red'], // red: use red theme
	creamTheme: ['Georgia ReBORN Cream Theme', 'cream'], // cream: use cream theme
	nblueTheme: ['Georgia ReBORN Neon Blue Theme', 'nblue'], // nblue: use Neon Blue theme
	ngreenTheme: ['Georgia ReBORN Neon Green Theme', 'ngreen'], // ngreen: use Neon Green theme
	nredTheme: ['Georgia ReBORN Neon Red Theme', 'nred'], // nred: use Neon Red theme
	ngoldTheme: ['Georgia ReBORN Neon Gold Theme', 'ngold'], // ngold: use Neon Gold theme
	layout_mode: ['Georgia ReBORN Layout Mode', 'default_mode'],
	Player_Small: ['Georgia ReBORN Player Small', 'Player_Small'],
	Player_Normal: ['Georgia ReBORN Player Normal', 'Player_Normal'],
	Player_Big: ['Georgia ReBORN Player Big', 'Player_Big'],
	Player_4K_Small: ['Georgia ReBORN Player 4K Small', 'Player_4K_Small'],
	Player_4K_Normal: ['Georgia ReBORN Player 4K Normal', 'Player_4K_Normal'],
	Player_4K_Big: ['Georgia ReBORN Player 4K Big', 'Player_4K_Big'],
	autoSbar_Library: ['Georgia ReBORN Auto Sbar Library', true], // Library Automatic Scrollbar Hide
	autoSbar_Playlist: ['Georgia ReBORN Auto Sbar Playlist', true], // Playlist Automatic Scrollbar Hide
	autoHidePLM: ['Georgia ReBORN Auto Hide Playlist Manager', true], // Playlist Automatic Playlist Manager Hide
	lib_design: ['Georgia ReBORN Library Design', 'library_modern'], // Library Design - library_modern (default) or library_traditional
	
	use_4k: ['Detect 4k', 'auto'], // auto: switch to 4k mode when window width wide enough, never: never use 4k mode, always: always use 4k mode
	checkForUpdates: ['Check for Updates', true], // true: check github repo to determine if updates exist
	loadAsync: ['Load Theme Asynchronously', true], // loads individual theme files asynchronously at startup to reduce risk of FSM throwing slow script error on startup

	lyrics_normal_color: ['Lyrics: Text Color', 'RGBA(255, 255, 255, 255);'],
	lyrics_focus_color: ['Lyrics: Text Highlite Color', 'RGBA(255, 241, 150, 255);'],
	lyricsRememberDisplay: ['Lyrics: Remember toggle setting', false], // true: show lyrics on startup if they were displayed when theme last reloaded
	displayLyrics: ['Lyrics: Show lyrics', false], // true: shows lyrics, always set to false at startup unless lyricsRememberDisplay is true

	showPlaylistFulldate: ['Playlist: Show full date', false],
	hyperlinks_ctrl: ['Playlist: Hyperlinks require CTRL Key', false], // true: clicking on hyperlinks only works if CTRL key is held down
	show_weblinks: ['Playlist: Show weblinks', true],
	smoothScrolling: ['Playlist: Smooth scrolling', true],

	font_size_playlist: ['Font Size: Playlist', 12],
	font_size_playlist_header: ['Font Size: Playlist Header', 15],
	lyricsFontSize: ['Font Size: Lyrics', 20],
});

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


const configPath = fb.ProfilePath + 'georgia\\georgia-config.jsonc';
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

/* All tf values from here below will NOT be written to the georgia-config file */
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
pref.vinylside_path = '$directory_path(%path%)\\vinyl$if2(' + tf.vinyl_side + ',).png' // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.vinyl_path = '$directory_path(%path%)\\vinyl.png' // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.cdartdisc_path = '$directory_path(%path%)\\' + settings.cdArtBasename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // cdart named cd1.png, cd2.png, etc.
pref.cdart_path = '$directory_path(%path%)\\' + settings.cdArtBasename + '.png'; // cdart named cd.png (or whatever custom value was specified). This is the most common single disc case.
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
				window.SetProperty('Art: Seconds to display each art', null);
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

				// this block should appear after all previous versions have fallen through
				console.log('> Upgrading Georgia Theme settings from', storedVersion);
				const fileName = `georgia\\georgia-config-${storedVersion}.jsonc`;
				console.log(`> Backing up Georgia Configuration file to ${fileName}`);
				fso.CopyFile(configPath, fb.ProfilePath + fileName);
				config.writeConfiguration();
				window.Reload();

			case '2.0.2':
			case '2.0.3-dev':

			default:
				break;

		}
	}
	pref.version = currentVersion;	// always update the version panel property
}

let retryCount = 0; // don't hammer if it's not working

function checkForUpdates(openUrl) {
	var url = 'https://api.github.com/repos/kbuffington/Georgia/tags';
	makeHttpRequest('GET', url, function (resp) {
		try {
			var respObj = JSON.parse(resp);
			updateAvailable = isNewerVersion(currentVersion, respObj[0].name);
			console.log('Current released version of Georgia: v' + respObj[0].name);
			if (updateAvailable) {
				console.log('>>> Georgia update available. Download it here: https://github.com/kbuffington/Georgia/releases');
				updateHyperlink = new Hyperlink('Update Available', ft.lower_bar, 'update', 0, 0, window.Width);
				if (updateHyperlink) {
					stoppedTime += ' - ';
					if (!fb.IsPlaying) {
						str.time = stoppedTime;
						RepaintWindow();
					}
					if (openUrl) {
						updateHyperlink.click();
					}
				}
			} else {
				console.log('You are on the most current version of Georgia');
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
