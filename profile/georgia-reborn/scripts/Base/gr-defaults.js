/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Defaults                             * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2024-01-11                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////////////
// ! GEORGIA-REBORN-CONFIG DEFAULTS ! //
////////////////////////////////////////
// * This file contains the various definitions, default values, and schemas for the objects that will be written to the configuration file.
// * Any value defined here will be written to the config ( although some of these objects will be modified in gr-settings.js with values that are not saved ).
// ! DO NOT EDIT: Editing these values will likely not provide you with the results you expect as they will probably not be stored in the configs.
// ! NOTE: If you wish to make changes to this, edit it in your georgia-reborn-config.jsonc and georgia-reborn-custom.jsonc file and NOT here.


//////////////////////////
// * TITLE FORMATTING * //
//////////////////////////
/** @type {*} Title formatting strings used throughout the UI */
let tf = {};
tf.album_subtitle = '%albumsubtitle%';
tf.album_translation = '%albumtranslation%';
tf.artist_country = '%artistcountry%';
tf.artist = '$if3($meta(artist),%composer%,%performer%,%album artist%)';
tf.date = '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%,)';
tf.disc_subtitle = '%discsubtitle%';
tf.disc = '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)';
tf.edition = '[$if2($if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\'),$if(%originaldate%,$ifequal($year(%originaldate%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\'))]';
tf.last_played = '[$if2(%last_played_enhanced%,%last_played%)]';
tf.lyrics = '[$if3(%synced lyrics%,%syncedlyrics%,%lyrics%,%lyric%,%unsyncedlyrics%,%unsynced lyrics%,)]';
tf.original_artist = '[ \'(\'%original artist%\' cover)\']';
tf.composer = '[\' -\' %composer% \' \']';
tf.releaseCountry = '$replace($if3(%releasecountry%,%discogs_country%,),AF,XW)';
tf.title = '%title%[ \'[\'%translation%\']\']';
tf.tracknum = '[%tracknumber%.]';
tf.vinyl_side = '%vinyl side%';
tf.vinyl_tracknum = '%vinyl tracknumber%';
tf.year = '[$year($if3(%original release date%,%originaldate%,%date%,%fy_upload_date%,))]';
tf.playing_playlist = 'Do not change this value as it is handled by the theme itself';

/** @type {Object} Assigning the title formatting strings. */
const defaultTitleFormatStrings = Object.assign({}, tf);

/** @type {Object} Title formatting config name description. */
const titleFormatComments = {
	artist_country: 'Only used for displaying artist flags.',
	date: 'The full date stored for the track',
	lyrics: 'gr-lyrics.js will check these fields in order if no local lyrics file is found.',
	releaseCountry: 'Releases tagged from Musicbrainz with a release country of AF (Afghanistan) are almost always whole world releases that have each country listed individually, so replace with \'XW\' (Worldwide) tag.',
	title: 'Track title shown above the progress bar',
	vinyl_side: 'Used for determining what side a song appears on for vinyl releases - i.e. song A1 has a %vinyl side% of "A"',
	vinyl_tracknum: 'Used for determining the track number on vinyl releases - i.e. song A1 has %vinyl tracknumber% set to "1"',
	year: 'Just the year portion of any stored date.'
};

/** @type {Object} Title formatting config header description. */
const titleFormatSchema = new ConfigurationObjectSchema('title_format_strings', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* TITLE FORMATTING STRINGS:                                                                                                                                                                             ' +
	'* Used throughout the display. Do NOT change the key names or add new ones.                                                                                                                             ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////////////////
// * ARTWORK IMAGE PATHS * //
/////////////////////////////
/** @type {array} Artwork image paths load order - add, change or re-order entries as needed. */
const imgPathDefaults = [
	// * File names with formats
	'$replace(%path%,%filename_ext%,)folder*',
	'$replace(%path%,%filename_ext%,)cover*',
	'$replace(%path%,%filename_ext%,)front*',
	'$replace(%path%,%filename_ext%,)*.*',

	// * All folder images in parent directory
	'$replace(%path%,%directoryname%\\%filename_ext%,)folder*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)cover*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)front*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)*.*',

	// * Artwork, Images, Scans in root directory ( 1 Disc )
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)folder*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)cover*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)front*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)*.*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)folder*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)cover*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)front*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)*.*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)folder*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)cover*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)front*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)*.*',

	// * Artwork, Images, Scans in other subfolders ( Multi Discs )
	'$replace(%path%\\Artwork\\,%filename_ext%,)folder*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)cover*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)front*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)*.*',
	'$replace(%path%\\Images\\,%filename_ext%,)folder*',
	'$replace(%path%\\Images\\,%filename_ext%,)cover*',
	'$replace(%path%\\Images\\,%filename_ext%,)front*',
	'$replace(%path%\\Images\\,%filename_ext%,)*.*',
	'$replace(%path%\\Scans\\,%filename_ext%,)folder*',
	'$replace(%path%\\Scans\\,%filename_ext%,)cover*',
	'$replace(%path%\\Scans\\,%filename_ext%,)front*',
	'$replace(%path%\\Scans\\,%filename_ext%,)*.*'
];

/** @type {Object} Artwork image paths config header description. */
const imgPathSchema = new ConfigurationObjectSchema('imgPaths', ConfigurationObjectType.Array, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* ARTWORK IMAGE PATHS:                                                                                                                                                                                  ' +
	'* The title formatting defined paths for artwork to be displayed. The first image matched will be shown first.                                                                                          ' +
	'* Re-arrange, add, or remove as needed. Folder delimiters must be double-slashes.                                                                                                                       ' +
	'* Note: This setting will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                          ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


///////////////
// * THEME * //
///////////////
/** @type {Object} Options > Theme settings with default value. */
const themeDefaults = {
	theme: 'reborn',
	theme_day: 'white',
	theme_night: 'black'
};

/** @type {Object} Options > Theme settings config name description. */
const themesComments = {
	theme: 'Values: "white", "black", "reborn", "random", "blue", "darkblue", "red", "cream", "nblue", "ngreen", "nred", "ngold", "custom01-custom10" - Options > Theme',
	theme_day: 'Values: "white", "black", "reborn", "random", "blue", "darkblue", "red", "cream", "nblue", "ngreen", "nred", "ngold", "custom01-custom10" - Options > Theme - daytime theme',
	theme_night: 'Values: "white", "black", "reborn", "random", "blue", "darkblue", "red", "cream", "nblue", "ngreen", "nred", "ngold", "custom01-custom10" - Options > Theme - nighttime theme'
};

/** @type {Object} Options > Theme settings config header description. */
const themesSchema = new ConfigurationObjectSchema('theme', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* THEME:                                                                                                                                                                                                ' +
	'* Top menu Options > Theme                                                                                                                                                                              ' +
	'* You can set and select between the 12 available themes that will be used.                                                                                                                             ' +
	'* If you choose to enable harmonic mode, your selected theme will be overriden once harmonic mode is deactivated again.                                                                                 ' +
	'* Note: This setting will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                              ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


///////////////
// * STYLE * //
///////////////
/** @type {Object} Options > Style settings with default values */
const stylesDefaults = {
	default: true,
	nighttime: false,
	bevel: false,
	blend: false,
	blend2: false,
	gradient: false,
	gradient2: false,
	alternative: false,
	alternative2: false,
	blackAndWhite: false,
	blackAndWhite2: false,
	blackAndWhiteReborn: false,
	blackReborn: false,
	rebornWhite: false,
	rebornBlack: false,
	rebornFusion: false,
	rebornFusion2: false,
	rebornFusionAccent: false,
	randomPastel: false,
	randomDark: false,
	randomAutoColor: 'off',
	topMenuButtons: 'default',
	transportButtons: 'default',
	progressBarDesign: 'default',
	progressBar: 'default',
	progressBarFill: 'default',
	volumeBarDesign: 'default',
	volumeBar: 'default',
	volumeBarFill: 'default',
	nighttime_day: false,
	bevel_day: false,
	blend_day: false,
	blend2_day: false,
	gradient_day: false,
	gradient2_day: false,
	alternative_day: false,
	alternative2_day: false,
	blackAndWhite_day: false,
	blackAndWhite2_day: false,
	blackAndWhiteReborn_day: false,
	blackReborn_day: false,
	rebornWhite_day: false,
	rebornBlack_day: false,
	rebornFusion_day: false,
	rebornFusion2_day: false,
	rebornFusionAccent_day: false,
	randomPastel_day: false,
	randomDark_day: false,
	randomAutoColor_day: 'off',
	topMenuButtons_day: 'default',
	transportButtons_day: 'default',
	progressBarDesign_day: 'default',
	progressBar_day: 'default',
	progressBarFill_day: 'default',
	volumeBarDesign_day: 'default',
	volumeBar_day: 'default',
	volumeBarFill_day: 'default',
	nighttime_night: false,
	bevel_night: false,
	blend_night: false,
	blend2_night: false,
	gradient_night: false,
	gradient2_night: false,
	alternative_night: false,
	alternative2_night: false,
	blackAndWhite_night: false,
	blackAndWhite2_night: false,
	blackAndWhiteReborn_night: false,
	blackReborn_night: false,
	rebornWhite_night: false,
	rebornBlack_night: false,
	rebornFusion_night: false,
	rebornFusion2_night: false,
	rebornFusionAccent_night: false,
	randomPastel_night: false,
	randomDark_night: false,
	randomAutoColor_night: 'off',
	topMenuButtons_night: 'default',
	transportButtons_night: 'default',
	progressBarDesign_night: 'default',
	progressBar_night: 'default',
	progressBarFill_night: 'default',
	volumeBarDesign_night: 'default',
	volumeBar_night: 'default',
	volumeBarFill_night: 'default'
};

/** @type {Object} Options > Style settings config name description. */
const stylesComments = {
	default: 'Values: true, false - can be used in all themes',
	nighttime: 'Values: true, false - special style can only be used with reborn, random, custom theme',
	bevel: 'Values: true, false - can be used in all themes',
	blend: 'Values: true, false - can be used in all themes',
	blend2: 'Values: true, false - can be used in all themes',
	gradient: 'Values: true, false - can only be used with reborn, random, blue, darkblue, red theme',
	gradient2: 'Values: true, false - can only be used with reborn, random, blue, darkblue, red theme',
	alternative: 'Values: true, false - can be used in all themes but not with special styles',
	alternative2: 'Values: true, false - can be used in all themes but not with special styles',
	blackAndWhite: 'Values: true, false - special white style can only be used with white theme',
	blackAndWhite2: 'Values: true, false - special white style can only be used with white theme',
	blackAndWhiteReborn: 'Values: true, false - special white style can only be used with white theme',
	blackReborn: 'Values: true, false - special black style can only be used with black theme',
	rebornWhite: 'Values: true, false - special reborn style can only be used with reborn theme',
	rebornBlack: 'Values: true, false - special reborn style can only be used with reborn theme',
	rebornFusion: 'Values: true, false - special reborn style can only be used with reborn theme',
	rebornFusion2: 'Values: true, false - special reborn style can only be used with reborn theme',
	rebornFusionAccent: 'Values: true, false - special reborn style can only be used with reborn theme',
	randomPastel: 'Values: true, false - special random style can only be used with random theme',
	randomDark: 'Values: true, false - special random style can only be used with random theme',
	randomAutoColor: 'Values: "off", 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, "track" - can only be used with random theme',
	topMenuButtons: 'Values: "default", "filled", "bevel", "inner", "emboss", "minimal"',
	transportButtons: 'Values: "default", "bevel", "inner", "emboss", "minimal"',
	progressBarDesign: 'Values: "default", "rounded", "lines", "blocks", "dots", "thin"',
	progressBar: 'Values: "default", "bevel", "inner"',
	progressBarFill: 'Values: "default", "bevel", "inner", "blend"',
	volumeBarDesign: 'Values: "default", "rounded"',
	volumeBar: 'Values: "default", "bevel", "inner"',
	volumeBarFill: 'Values: "default", "bevel", "inner"',
	nighttime_day: 'Values: true, false - daytime theme - special style can only be used with reborn, random, custom theme',
	bevel_day: 'Values: true, false - daytime theme - can be used in all themes',
	blend_day: 'Values: true, false - daytime theme - can be used in all themes',
	blend2_day: 'Values: true, false - daytime theme - can be used in all themes',
	gradient_day: 'Values: true, false - daytime theme - can only be used with reborn, random, blue, darkblue, red theme',
	gradient2_day: 'Values: true, false - daytime theme - can only be used with reborn, random, blue, darkblue, red theme',
	alternative_day: 'Values: true, false - daytime theme - can be used in all themes but not with special styles',
	alternative2_day: 'Values: true, false - daytime theme - can be used in all themes but not with special styles',
	blackAndWhite_day: 'Values: true, false - daytime theme - special white style can only be used with white theme',
	blackAndWhite2_day: 'Values: true, false - daytime theme - special white style can only be used with white theme',
	blackAndWhiteReborn_day: 'Values: true, false - daytime theme - special white style can only be used with white theme',
	blackReborn_day: 'Values: true, false - daytime theme - special black style can only be used with black theme',
	rebornWhite_day: 'Values: true, false - daytime theme - special reborn style can only be used with reborn theme',
	rebornBlack_day: 'Values: true, false - daytime theme - special reborn style can only be used with reborn theme',
	rebornFusion_day: 'Values: true, false - daytime theme - special reborn style can only be used with reborn theme',
	rebornFusion2_day: 'Values: true, false - daytime theme - special reborn style can only be used with reborn theme',
	rebornFusionAccent_day: 'Values: true, false - daytime theme - special reborn style can only be used with reborn theme',
	randomPastel_day: 'Values: true, false - daytime theme - special random style can only be used with random theme',
	randomDark_day: 'Values: true, false - daytime theme - special random style can only be used with random theme',
	randomAutoColor_day: 'Values: "off", 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, "track" - daytime theme - can only be used with random theme',
	topMenuButtons_day: 'Values: "default", "filled", "bevel", "inner", "emboss", "minimal" - daytime theme',
	transportButtons_day: 'Values: "default", "bevel", "inner", "emboss", "minimal" - daytime theme',
	progressBarDesign_day: 'Values: "default", "rounded", "lines", "blocks", "dots", "thin" - daytime theme',
	progressBar_day: 'Values: "default", "bevel", "inner" - daytime theme',
	progressBarFill_day: 'Values: "default", "bevel", "inner", "blend" - daytime theme',
	volumeBarDesign_day: 'Values: "default", "rounded" - daytime theme',
	volumeBar_day: 'Values: "default", "bevel", "inner" - daytime theme',
	volumeBarFill_day: 'Values: "default", "bevel", "inner" - daytime theme',
	nighttime_night: 'Values: true, false - nighttime theme - special style can only be used with reborn, random, custom theme',
	bevel_night: 'Values: true, false - nighttime theme - can be used in all themes',
	blend_night: 'Values: true, false - nighttime theme - can be used in all themes',
	blend2_night: 'Values: true, false - nighttime theme - can be used in all themes',
	gradient_night: 'Values: true, false - nighttime theme - can only be used with reborn, random, blue, darkblue, red theme',
	gradient2_night: 'Values: true, false - nighttime theme - can only be used with reborn, random, blue, darkblue, red theme',
	alternative_night: 'Values: true, false - nighttime theme - can be used in all themes but not with special styles',
	alternative2_night: 'Values: true, false - nighttime theme - can be used in all themes but not with special styles',
	blackAndWhite_night: 'Values: true, false - nighttime theme - special white style can only be used with white theme',
	blackAndWhite2_night: 'Values: true, false - nighttime theme - special white style can only be used with white theme',
	blackAndWhiteReborn_night: 'Values: true, false - nighttime theme - special white style can only be used with white theme',
	blackReborn_night: 'Values: true, false - nighttime theme - special black style can only be used with black theme',
	rebornWhite_night: 'Values: true, false - nighttime theme - special reborn style can only be used with reborn theme',
	rebornBlack_night: 'Values: true, false - nighttime theme - special reborn style can only be used with reborn theme',
	rebornFusion_night: 'Values: true, false - nighttime theme - special reborn style can only be used with reborn theme',
	rebornFusion2_night: 'Values: true, false - nighttime theme - special reborn style can only be used with reborn theme',
	rebornFusionAccent_night: 'Values: true, false - nighttime theme - special reborn style can only be used with reborn theme',
	randomPastel_night: 'Values: true, false - nighttime theme - special random style can only be used with random theme',
	randomDark_night: 'Values: true, false - nighttime theme - special random style can only be used with random theme',
	randomAutoColor_night: 'Values: "off", 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, "track" - nighttime theme - can only be used with random theme',
	topMenuButtons_night: 'Values: "default", "filled", "bevel", "inner", "emboss", "minimal" - nighttime theme',
	transportButtons_night: 'Values: "default", "bevel", "inner", "emboss", "minimal" - nighttime theme',
	progressBarDesign_night: 'Values: "default", "rounded", "lines", "blocks", "dots", "thin" - nighttime theme',
	progressBar_night: 'Values: "default", "bevel", "inner" - nighttime theme',
	progressBarFill_night: 'Values: "default", "bevel", "inner", "blend" - nighttime theme',
	volumeBarDesign_night: 'Values: "default", "rounded" - nighttime theme',
	volumeBar_night: 'Values: "default", "bevel", "inner" - nighttime theme',
	volumeBarFill_night: 'Values: "default", "bevel", "inner" - nighttime theme'
};

/** @type {Object} Options > Style settings config header description. */
const stylesSchema = new ConfigurationObjectSchema('style', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* STYLES:                                                                                                                                                                                               ' +
	'* Top menu Options > Style                                                                                                                                                                              ' +
	'* If you set a style, you need to set default: false,                                                                                                                                                   ' +
	'* Basic style "gradient" and "gradient2" is only supported and can be used with reborn, random, blue, darkblue, red theme.                                                                              ' +
	'* Basic style "alternative" and "alternative2" can not be used with special styles except "nighttime".                                                                                                  ' +
	'* Special style "nighttime" can only be used with "reborn", "random", "custom" theme.                                                                                                                   ' +
	'* Special style "blackAndWhite", "blackAndWhite2" and "blackAndWhiteReborn" can only be used with "white" theme.                                                                                        ' +
	'* Special style "blackReborn" can only be used with "black" theme.                                                                                                                                      ' +
	'* Special style "rebornWhite", "rebornBlack", "rebornFusion", "rebornFusion2" and "rebornFusionAccent" can only be used with "reborn" theme.                                                            ' +
	'* Special style "randomPastel", "randomDark" and "randomAutoColor" can only be used with "random" theme.                                                                                                ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////
// * PRESET * //
////////////////
/** @type {Object} Options > Preset settings with default values. */
const presetDefaults = {
	selectMode: 'default',
	selectWhitePresets: true,
	selectBlackPresets: true,
	selectRebornPresets: true,
	selectRandomPresets: true,
	selectBluePresets: true,
	selectDarkbluePresets: true,
	selectRedPresets: true,
	selectCreamPresets: true,
	selectNbluePresets: true,
	selectNgreenPresets: true,
	selectNredPresets: true,
	selectNgoldPresets: true,
	selectCustomPresets: true,
	autoRandomMode: 'dblclick',
	indicator: true
};

/** @type {Object} Options > Preset settings config name description. */
const presetComments = {
	selectMode: 'Values: "default", "harmonic", "theme" - Options > Preset > Select mode',
	selectWhitePresets: 'Values: true, false - Options > Preset > Select presets > White',
	selectBlackPresets: 'Values: true, false - Options > Preset > Select presets > Black',
	selectRebornPresets: 'Values: true, false - Options > Preset > Select presets > Reborn',
	selectRandomPresets: 'Values: true, false - Options > Preset > Select presets > Random',
	selectBluePresets: 'Values: true, false - Options > Preset > Select presets > Blue',
	selectDarkbluePresets: 'Values: true, false - Options > Preset > Select presets > Dark blue',
	selectRedPresets: 'Values: true, false - Options > Preset > Select presets > Red',
	selectCreamPresets: 'Values: true, false - Options > Preset > Select presets > Cream',
	selectNbluePresets: 'Values: true, false - Options > Preset > Select presets > Neon blue',
	selectNgreenPresets: 'Values: true, false - Options > Preset > Select presets > Neon green',
	selectNredPresets: 'Values: true, false - Options > Preset > Select presets > Neon red',
	selectNgoldPresets: 'Values: true, false - Options > Preset > Select presets > Neon gold',
	selectCustomPresets: 'Values: true, false - Options > Preset > Select presets > Custom theme',
	autoRandomMode: 'Values: "off", 5000, 10000, 15000, 30000, 60000, 300000, 600000, 900000, 1800000, 3600000, "track", "album", "dblclick" - Options > Preset > Auto random',
	indicator: 'Values: true, false - Options > Preset > Indicator'
};

/** @type {Object} Options > Preset settings config header description. */
const presetSchema = new ConfigurationObjectSchema('preset', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* PRESET:                                                                                                                                                                                               ' +
	'* Top menu Options > Preset                                                                                                                                                                             ' +
	'* You can set the preset select mode and preset auto-random mode and deactivate theme presets to be excluded in the preset selection when preset select mode or preset auto-random mode is being used.  ' +
	'* If you choose to change the preset select mode, your active theme will be overriden once preset select mode is not set to "default".                                                                  ' +
	'* This behavior also applies to the preset auto-random mode when "dblclick" has not been set.                                                                                                           ' +
	'* Note: This setting will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                              ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////////
// * PLAYER SIZE * //
/////////////////////
/** @type {Object} Options > Player size settings with default value. */
const themePlayerSizeDefaults = {
	playerSize: 'small',
	savedWidth_default: 1140,
	savedHeight_default: 730,
	savedWidth_artwork: 526,
	savedHeight_artwork: 686,
	savedWidth_compact: 484,
	savedHeight_compact: 730
};

/** @type {Object} Options > Player size settings config name description. */
const themePlayerSizeComments = {
	playerSize: 'Values: "small", "normal", "large" - Options > Player size',
	savedWidth_default: 'The saved player width for the Default layout - Options > Layout > Default',
	savedHeight_default: 'The saved player height for the Default layout - Options > Layout > Default',
	savedWidth_artwork: 'The saved player width for the Artwork layout - Options > Layout > Artwork',
	savedHeight_artwork: 'The saved player height for the Artwork layout - Options > Layout > Artwork',
	savedWidth_compact: 'The saved player width for the Compact layout - Options > Layout > Compact',
	savedHeight_compact: 'The saved player height for the Compact layout - Options > Layout > Compact'
};

/** @type {Object} Options > Player size settings config header description. */
const themePlayerSizeSchema = new ConfigurationObjectSchema('themePlayerSize', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* PLAYER SIZE:                                                                                                                                                                                          ' +
	'* Top menu Options > Player size                                                                                                                                                                        ' +
	'* You can set and select between the 3 available player sizes that will be used.                                                                                                                        ' +
	'* Note: This setting will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                              ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////
// * LAYOUT * //
////////////////
/** @type {Object} Options > Layout settings with default value. */
const themeLayoutDefaults = {
	layout: 'default'
};

/** @type {Object} Options > Layout settings config name description. */
const themeLayoutComments = {
	layout: 'Values: "default", "artwork", "compact" - Options > Layout'
};

/** @type {Object} Options > Layout settings config header description. */
const themeLayoutSchema = new ConfigurationObjectSchema('themeLayout', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* LAYOUT:                                                                                                                                                                                               ' +
	'* Top menu Options > Layout                                                                                                                                                                             ' +
	'* You can set and select between the 3 available layouts that will be used.                                                                                                                             ' +
	'* Note: This setting will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                              ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////
// * DISPLAY * //
/////////////////
/** @type {Object} Options > Display settings with default value. */
const themeDisplayDefaults = {
	resolution: 'HD'
};

/** @type {Object} Options > Display settings config name description. */
const themeDisplayComments = {
	resolution: 'Values: "4K", "QHD", "HD" - Options > Display'
};

/** @type {Object} Options > Display settings config header description. */
const themeDisplaySchema = new ConfigurationObjectSchema('themeDisplay', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* DISPLAY:                                                                                                                                                                                              ' +
	'* Top menu Options > Display                                                                                                                                                                            ' +
	'* You can set and select between the 3 available resolution that will be used.                                                                                                                          ' +
	'* Note: This setting will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                              ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////////
// * BRIGHTNESS * //
////////////////////
/** @type {Object} Options > Brightness settings with default value. */
const themeBrightnessDefaults = {
	themeBrightness: 'default',
	themeBrightness_day: 'default',
	themeBrightness_night: 'default'
};

/** @type {Object} Options > Brightness settings config name description. */
const themeBrightnessComments = {
	themeBrightness: 'Values: -50, -40, -30, -25, -20, -15, -10, -5, "default", 5, 10, 15, 20, 25, 30, 40, 50 - Options > Brightness',
	themeBrightness_day: 'Values: -50, -40, -30, -25, -20, -15, -10, -5, "default", 5, 10, 15, 20, 25, 30, 40, 50 - Options > Brightness - daytime theme',
	themeBrightness_night: 'Values: -50, -40, -30, -25, -20, -15, -10, -5, "default", 5, 10, 15, 20, 25, 30, 40, 50 - Options > Brightness - nighttime theme'
};

/** @type {Object} Options > Brightness settings config header description. */
const themeBrightnessSchema = new ConfigurationObjectSchema('themeBrightness', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* THEME BRIGHTNESS:                                                                                                                                                                                     ' +
	'* Top menu Options > Brightness                                                                                                                                                                         ' +
	'* You can set and select between the 11 available brightness settings that will be used.                                                                                                                ' +
	'* Note: This setting will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                              ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


///////////////////
// * FONT SIZE * //
///////////////////
/** @type {Object} Options > Font size settings with default values. */
const themeFontSizesDefaults = {
	menuFontSize_default: RES_QHD ? 14 : 12,
	menuFontSize_artwork: RES_QHD ? 14 : 12,
	menuFontSize_compact: RES_QHD ? 14 : 12,
	lowerBarFontSize_default: RES_QHD ? 20 : 18,
	lowerBarFontSize_artwork: RES_QHD ? 18 : 16,
	lowerBarFontSize_compact: RES_QHD ? 18 : 16,
	notificationFontSize_default: RES_QHD ? 20 : 18,
	notificationFontSize_artwork: RES_QHD ? 18 : 16,
	notificationFontSize_compact: RES_QHD ? 18 : 16,
	popupFontSize_default: RES_QHD ? 18 : 16,
	popupFontSize_artwork: RES_QHD ? 16 : 14,
	popupFontSize_compact: RES_QHD ? 16 : 14,
	tooltipFontSize_default: RES_QHD ? 18 : 16,
	tooltipFontSize_artwork: RES_QHD ? 16 : 14,
	tooltipFontSize_compact: RES_QHD ? 16 : 14,
	gridArtistFontSize_default: RES_QHD ? 20 : 18,
	gridArtistFontSize_artwork: RES_QHD ? 20 : 18,
	gridTrackNumFontSize_default: RES_QHD ? 20 : 18,
	gridTrackNumFontSize_artwork: RES_QHD ? 20 : 18,
	gridTitleFontSize_default: RES_QHD ? 20 : 18,
	gridTitleFontSize_artwork: RES_QHD ? 20 : 18,
	gridAlbumFontSize_default: RES_QHD ? 20 : 18,
	gridAlbumFontSize_artwork: RES_QHD ? 20 : 18,
	gridKeyFontSize_default: RES_QHD ? 19 : 17,
	gridKeyFontSize_artwork: RES_QHD ? 19 : 17,
	gridValueFontSize_default: RES_QHD ? 19 : 17,
	gridValueFontSize_artwork: RES_QHD ? 19 : 17,
	playlistHeaderFontSize_default: RES_QHD ? 17 : 15,
	playlistHeaderFontSize_artwork: RES_QHD ? 17 : 15,
	playlistHeaderFontSize_compact: RES_QHD ? 17 : 15,
	playlistFontSize_default: RES_QHD ? 14 : 12,
	playlistFontSize_artwork: RES_QHD ? 14 : 12,
	playlistFontSize_compact: RES_QHD ? 14 : 12,
	libraryFontSize_default: RES_4K ? 24 : RES_QHD ? 14 : 12,
	libraryFontSize_artwork: RES_4K ? 24 : RES_QHD ? 14 : 12,
	biographyFontSize_default: RES_4K ? 24 : RES_QHD ? 14 : 12,
	biographyFontSize_artwork: RES_4K ? 24 : RES_QHD ? 14 : 12,
	lyricsFontSize_default: RES_QHD ? 22 : 20,
	lyricsFontSize_artwork: RES_QHD ? 22 : 20
};

/** @type {Object} Options > Font size settings config name description. */
const themeFontSizesComments = {
	menuFontSize_default: 'Values: 8, 10, 11, 12, 13, 14, 16 - Options > Font size > Main > Top menu - when Default layout is active',
	menuFontSize_artwork: 'Values: 8, 10, 11, 12, 13, 14, 16 - Options > Font size > Main > Top menu - when Artwork layout is active',
	menuFontSize_compact: 'Values: 8, 10, 11, 12, 13, 14, 16 - Options > Font size > Main > Top menu - when Compact layout is active',
	lowerBarFontSize_default: 'Values: 10, 12, 14, 16, 18, 20, 22, 24, 26 - Options > Font size > Main > Lower bar - when Default layout is active',
	lowerBarFontSize_artwork: 'Values: 10, 12, 14, 16, 18, 20, 22, 24, 26 - Options > Font size > Main > Lower bar - when Artwork layout is active',
	lowerBarFontSize_compact: 'Values: 10, 12, 14, 16, 18, 20, 22, 24, 26 - Options > Font size > Main > Lower bar - when Compact layout is active',
	notificationFontSize_default: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Notification - when Default layout is active',
	notificationFontSize_artwork: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Notification - when Artwork layout is active',
	notificationFontSize_compact: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Notification - when Compact layout is active',
	popupFontSize_default: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Popup - when Default layout is active',
	popupFontSize_artwork: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Popup - when Artwork layout is active',
	popupFontSize_compact: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Popup - when Compact layout is active',
	tooltipFontSize_default: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Tooltip - when Default layout is active',
	tooltipFontSize_artwork: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Tooltip - when Artwork layout is active',
	tooltipFontSize_compact: 'Values: 10, 12, 14, 16, 18, 20, 22, 24 - Options > Font size > Main > Tooltip - when Compact layout is active',
	gridArtistFontSize_default: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Artist - when Default layout is active',
	gridArtistFontSize_artwork: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Artist - when Artwork layout is active',
	gridTrackNumFontSize_default: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - not in Options, track number before song title in grid - when Default layout is active',
	gridTrackNumFontSize_artwork: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - not in Options, track number before song title in grid - when Artwork layout is active',
	gridTitleFontSize_default: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Title - when Default layout is active',
	gridTitleFontSize_artwork: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Title - when Artwork layout is active',
	gridAlbumFontSize_default: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Album - when Default layout is active',
	gridAlbumFontSize_artwork: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Album - when Artwork layout is active',
	gridKeyFontSize_default: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Tag name - when Default layout is active',
	gridKeyFontSize_artwork: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Tag name - when Artwork layout is active',
	gridValueFontSize_default: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Tag value - when Default layout is active',
	gridValueFontSize_artwork: 'Values: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24 - Options > Font size > Details > Tag value - when Artwork layout is active',
	playlistHeaderFontSize_default: 'Values: 10, 12, 13, 14, 15, 16, 17, 18, 20, 22 - Options > Font size > Playlist - when Default layout is active',
	playlistHeaderFontSize_artwork: 'Values: 10, 12, 13, 14, 15, 16, 17, 18 - Options > Font size > Playlist - when Artwork layout is active',
	playlistHeaderFontSize_compact: 'Values: 10, 12, 13, 14, 15, 16, 17, 18 - Options > Font size > Playlist - when Compact layout is active',
	playlistFontSize_default: 'Values: 10, 12, 13, 14, 15, 16, 17, 18, 20, 22 - Options > Font size > Playlist - when Default layout is active',
	playlistFontSize_artwork: 'Values: 10, 12, 13, 14, 15, 16, 17, 18 - Options > Font size > Playlist - when Artwork layout is active',
	playlistFontSize_compact: 'Values: 10, 12, 13, 14, 15, 16, 17, 18 - Options > Font size > Playlist - when Compact layout is active',
	libraryFontSize_default: 'Values: 8, 10, 11, 12, 13, 14, 16, 18 - Options > Font size > Library - when Default layout is active',
	libraryFontSize_artwork: 'Values: 8, 10, 11, 12, 13, 14, 16, 18 - Options > Font size > Library - when Artwork layout is active',
	biographyFontSize_default: 'Values: 8, 10, 11, 12, 13, 14, 16, 18 - Options > Font size > Biography - when Default layout is active',
	biographyFontSize_artwork: 'Values: 8, 10, 11, 12, 13, 14, 16, 18 - Options > Font size > Biography - when Artwork layout is active',
	lyricsFontSize_default: 'Values: 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 - Options > Font size > Lyrics - when Default layout is active',
	lyricsFontSize_artwork: 'Values: 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 - Options > Font size > Lyrics - when Artwork layout is active'
};

/** @type {Object} Options > Font size settings config header description. */
const themeFontSizesSchema = new ConfigurationObjectSchema('themeFontSize', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* FONT SIZES:                                                                                                                                                                                           ' +
	'* Top menu Options > Font size                                                                                                                                                                          ' +
	'* Default, Artwork and Compact font sizes can be independently customized and will be used when changing between layouts.                                                                               ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////////////
// * PLAYER CONTROLS * //
/////////////////////////
/** @type {Object} Options > Player controls settings with default values. */
const themePlayerControlsDefaults = {
	showPanelDetails_default: true,
	showPanelDetails_artwork: true,
	showPanelLibrary_default: true,
	showPanelLibrary_artwork: true,
	showPanelBiography_default: true,
	showPanelBiography_artwork: true,
	showPanelLyrics_default: true,
	showPanelLyrics_artwork: true,
	showPanelRating_default: true,
	showPanelRating_artwork: true,
	topMenuAlignment: 'center',
	topMenuCompact: true,
	albumArtAlign: 'right',
	albumArtBg: 'left',
	albumArtScale: 'cropped',
	albumArtAspectRatioLimit: 1.5,
	cycleArt: false,
	cycleArtMWheel: true,
	loadEmbeddedAlbumArtFirst: false,
	showHiResAudioBadge: false,
	hiResAudioBadgeRound: false,
	hiResAudioBadgeSize: 'normal',
	hiResAudioBadgePos: 'bottomright',
	showPause: true,
	jumpSearchIncludeLibrary: true,
	jumpSearchIncludePlaylist: true,
	jumpSearchComposerOnly: false,
	playlistWheelScrollSteps: 3,
	playlistWheelScrollDuration: 300,
	playlistAutoScrollNowPlaying: false,
	playlistAutoHideScrollbar: true,
	playlistSmoothScrolling: true,
	scrollStepLib: 3,
	durationScrollLib: 500,
	libraryAutoScrollNowPlaying: false,
	libraryAutoHideScrollbar: true,
	smoothLib: true,
	scrollStepBio: 3,
	durationScrollBio: 500,
	biographyAutoHideScrollbar: true,
	smoothBio: true,
	showTooltipTruncated: true,
	showTooltipTimeline: true,
	showTooltipVolume: false,
	showTooltipVolumeInPercent: false,
	showTooltipMain: false,
	showTooltipLibrary: false,
	showTooltipBiography: false,
	showStyledTooltips: true,
	panelWidthAuto: false,
	showPanelOnStartup: 'playlist',
	showPreloaderLogo: true,
	returnToHomeOnPlaybackStop: true,
	hideMiddlePanelShadow: false,
	lockPlayerSize: false,
	maximizeToFullscreen: true,
	switchPlaybackTime: false,
	transportButtonSize_default: 32,
	transportButtonSize_artwork: 32,
	transportButtonSize_compact: 32,
	transportButtonSpacing_default: 5,
	transportButtonSpacing_artwork: 5,
	transportButtonSpacing_compact: 5,
	showTransportControls_default: true,
	showTransportControls_artwork: true,
	showTransportControls_compact: true,
	showPlaybackOrderBtn_default: true,
	showPlaybackOrderBtn_artwork: true,
	showPlaybackOrderBtn_compact: true,
	showReloadBtn_default: false,
	showReloadBtn_artwork: false,
	showReloadBtn_compact: false,
	showVolumeBtn_default: true,
	showVolumeBtn_artwork: true,
	showVolumeBtn_compact: true,
	autoHideVolumeBar: true,
	showPlaybackTime_default: true,
	showPlaybackTime_artwork: true,
	showPlaybackTime_compact: true,
	showLowerBarArtist_default: true,
	showLowerBarArtist_artwork: true,
	showLowerBarArtist_compact: true,
	showLowerBarTrackNum_default: true,
	showLowerBarTrackNum_artwork: true,
	showLowerBarTrackNum_compact: true,
	showLowerBarTitle_default: true,
	showLowerBarTitle_artwork: true,
	showLowerBarTitle_compact: true,
	showLowerBarComposer_default: false,
	showLowerBarComposer_artwork: false,
	showLowerBarComposer_compact: false,
	showLowerBarArtistFlags_default: true,
	showLowerBarArtistFlags_artwork: true,
	showLowerBarArtistFlags_compact: true,
	showLowerBarVersion_default: true,
	showLowerBarVersion_artwork: true,
	showLowerBarVersion_compact: true,
	showProgressBar_default: true,
	showProgressBar_artwork: true,
	showProgressBar_compact: true,
	showPeakmeterBar_default: true,
	showPeakmeterBar_artwork: true,
	showPeakmeterBar_compact: true,
	showWaveformBar_default: true,
	showWaveformBar_artwork: true,
	showWaveformBar_compact: true,
	seekbar: 'progressbar',
	progressBarWheelSeekSpeed: 5,
	progressBarRefreshRate: 'variable',
	peakmeterBarDesign: 'horizontal',
	peakmeterBarVertSize: 20,
	peakmeterBarVertDbRange: 220,
	peakmeterBarOverBars: true,
	peakmeterBarOuterBars: true,
	peakmeterBarOuterPeaks: true,
	peakmeterBarMainBars: true,
	peakmeterBarMainPeaks: true,
	peakmeterBarMiddleBars: true,
	peakmeterBarProgBar: true,
	peakmeterBarGaps: false,
	peakmeterBarGrid: false,
	peakmeterBarInfo: false,
	peakmeterBarVertPeaks: true,
	peakmeterBarVertBaseline: true,
	peakmeterBarRefreshRate: 80,
	waveformBarMode: 'audiowaveform',
	waveformBarAnalysis: 'rms_level',
	waveformBarDesign: 'halfbars',
	waveformBarSizeWave: 3,
	waveformBarSizeBars: 1,
	waveformBarSizeDots: 2,
	waveformBarSizeHalf: 4,
	waveformBarSizeNormalize: false,
	waveformBarPaint: 'partial',
	waveformBarPrepaint: true,
	waveformBarPrepaintFront: 'Infinity',
	waveformBarAnimate: true,
	waveformBarBPM: true,
	waveformBarInvertHalfbars: true,
	waveformBarIndicator: false,
	waveformBarRefreshRate: 200,
	waveformBarRefreshRateVar: false,
	waveformBarAutoDelete: false,
	playbackOrder: 'default'
};

/** @type {Object} Options > Player controls settings config name description. */
const themePlayerControlsComments = {
	showPanelDetails_default: 'Values: true, false - Options > Player controls > Top menu > Default > Details',
	showPanelDetails_artwork: 'Values: true, false - Options > Player controls > Top menu > Artwork > Details',
	showPanelLibrary_default: 'Values: true, false - Options > Player controls > Top menu > Default > Library',
	showPanelLibrary_artwork: 'Values: true, false - Options > Player controls > Top menu > Artwork > Library',
	showPanelBiography_default: 'Values: true, false - Options > Player controls > Top menu > Default > Biography',
	showPanelBiography_artwork: 'Values: true, false - Options > Player controls > Top menu > Artwork > Biography',
	showPanelLyrics_default: 'Values: true, false - Options > Player controls > Top menu > Default > Lyrics',
	showPanelLyrics_artwork: 'Values: true, false - Options > Player controls > Top menu > Artwork > Lyrics',
	showPanelRating_default: 'Values: true, false - Options > Player controls > Top menu > Default > Rating',
	showPanelRating_artwork: 'Values: true, false - Options > Player controls > Top menu > Artwork > Rating',
	topMenuAlignment: 'Values: left, center - Options > Player controls > Top menu',
	topMenuCompact: 'Values: true, false - Options > Player controls > Top menu > Compact top menu',
	albumArtAlign: 'Values: "left", "leftMargin", "center", "right" - Options > Player controls > Album art > When player size is not proportional',
	albumArtBg: 'Values: "left", "full", "none" - Options > Player controls > Album art > When player size is not proportional',
	albumArtScale: 'Values: "cropped", "stretched", "proportional" - Options > Player controls > Album art > When player size is maximized/fullscreen',
	albumArtAspectRatioLimit: 'Values: 1, 1.25, 1.5, 1.75, 2 - Options > Player controls > Album art > When player size is maximized/fullscreen > Keep wide and tall artworks proportional',
	cycleArt: 'Values: min: 5, max: 120 in seconds - Options > Player controls > Album art > Cycle album artwork',
	cycleArtMWheel: 'Values: true, false - Options > Player controls > Album art > Cycle album artwork with mouse wheel',
	loadEmbeddedAlbumArtFirst: 'Values: true, false - Options > Player controls > Album art > Load embedded album art first',
	showHiResAudioBadge: 'Values: true, false - Options > Player controls > Album art > Show hi-res audio badge on album cover > Enabled',
	hiResAudioBadgeRound: 'Values: true, false - Options > Player controls > Album art > Show hi-res audio badge on album cover > Round',
	hiResAudioBadgeSize: 'Values: "small", "normal", "large" - Options > Player controls > Album art > Show hi-res audio badge on album cover',
	hiResAudioBadgePos: 'Values: "topleft", "topright", "bottomleft", "bottomright" - Options > Player controls > Album art > Show hi-res audio badge on album cover',
	showPause: 'Values: true, false - Options > Player controls > Album art > Show pause on album cover',
	jumpSearchIncludeLibrary: 'Values: true, false - Options > Player controls > Jump search > Include library in playlist search query',
	jumpSearchIncludePlaylist: 'Values: true, false - Options > Player controls > Jump search > Include playlist in library search query',
	jumpSearchComposerOnly: 'Values: true, false - Options > Player controls > Jump search > Composer only in jump search query',
	playlistWheelScrollSteps: 'Values: 0.5, 2, 3, 4, 5, 6, 7, 8, 9, 10 - Options > Player controls > Scrollbar > Playlist > Mouse wheel scroll steps',
	playlistWheelScrollDuration: 'Values: 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000 - Options > Player controls > Scrollbar > Playlist > Mouse wheel scroll smooth duration',
	playlistAutoScrollNowPlaying: 'Values: true, false - Options > Player controls > Scrollbar > Playlist > Auto-scroll to current playing song',
	playlistAutoHideScrollbar: 'Values: true, false - Options > Player controls > Scrollbar > Playlist > Auto-hide',
	playlistSmoothScrolling: 'Values: true, false - Options > Player controls > Scrollbar > Playlist > Smooth scroll',
	scrollStepLib: 'Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 - Options > Player controls > Scrollbar > Library > Mouse wheel scroll steps',
	durationScrollLib: 'Values: 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000 - Options > Player controls > Scrollbar > Library > Mouse wheel scroll smooth duration',
	libraryAutoScrollNowPlaying: 'Values: true, false - Options > Player controls > Scrollbar > Library > Auto-scroll to current playing song',
	libraryAutoHideScrollbar: 'Values: true, false - Options > Player controls > Scrollbar > Library > Auto-hide',
	smoothLib: 'Values: true, false - Options > Player controls > Scrollbar > Library > Smooth scroll',
	scrollStepBio: 'Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 - Options > Player controls > Scrollbar > Biography > Mouse wheel scroll steps',
	durationScrollBio: 'Values: 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000 - Options > Player controls > Scrollbar > Biography > Mouse wheel scroll smooth duration',
	biographyAutoHideScrollbar: 'Values: true, false - Options > Player controls > Scrollbar > Biography > Auto-hide',
	smoothBio: 'Values: true, false - Options > Player controls > Scrollbar > Biography > Smooth scroll',
	showTooltipTruncated: 'Values: true, false - Options > Player controls > Tooltip > Show tooltips only on truncated text',
	showTooltipTimeline: 'Values: true, false - Options > Player controls > Tooltip > Show timeline tooltips',
	showTooltipVolume: 'Values: true, false - Options > Player controls > Tooltip > Show volume tooltips',
	showTooltipVolumeInPercent: 'Values: true, false - Options > Player controls > Tooltip > Show volume tooltips in percent',
	showTooltipMain: 'Values: true, false - Options > Player controls > Tooltip > Show main tooltips',
	showTooltipLibrary: 'Values: true, false - Options > Player controls > Tooltip > Show library tooltips',
	showTooltipBiography: 'Values: true, false - Options > Player controls > Tooltip > Show biography tooltips',
	showStyledTooltips: 'Values: true, false - Options > Player controls > Tooltip > Show styled tooltips',
	panelWidthAuto: 'Values: true, false - Options > Player controls > Panel > Width > Use auto panel width',
	showPanelOnStartup: 'Values: "cover", "playlist", "details", "library", "biography", "lyrics" - Options > Player controls > Panel > Show panel on startup',
	showPreloaderLogo: 'Values: true, false - Options > Player controls > Panel > Show logo on preloader',
	returnToHomeOnPlaybackStop: 'Values: true, false - Options > Player controls > Panel > Return to home on playback stop',
	hideMiddlePanelShadow: 'Values: true, false - Options > Player controls > Panel > Hide middle panel shadow',
	lockPlayerSize: 'Values: true, false - Options > Player controls > Panel > Lock player size',
	maximizeToFullscreen: 'Values: true, false - not in Options - enable or disable the maximize to fullscreen function',
	switchPlaybackTime: 'Values: true, false - not in Options - switch to playback time remaining when clicking on the playback time in the lower bar',
	transportButtonSize_default: 'Values: 28, 30, 32, 34, 36, 38, 40, 42 - Options > Player controls > Transport button size > Default',
	transportButtonSize_artwork: 'Values: 28, 30, 32, 34, 36 - Options > Player controls > Lower bar > Transport button size > Artwork',
	transportButtonSize_compact: 'Values: 28, 30, 32, 34, 36 - Options > Player controls > Lower bar > Transport button size > Compact',
	transportButtonSpacing_default: 'Values: 3, 5, 7, 10, 15 - Options > Player controls > Lower bar > Transport button spacing > Default',
	transportButtonSpacing_artwork: 'Values: 3, 5, 7, 10, 15 - Options > Player controls > Lower bar > Transport button spacing > Artwork',
	transportButtonSpacing_compact: 'Values: 3, 5, 7, 10, 15 - Options > Player controls > Lower bar > Transport button spacing > Compact',
	showTransportControls_default: 'Values: true, false - Options > Player controls > Lower bar > Show transport controls > Default',
	showTransportControls_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show transport controls > Artwork',
	showTransportControls_compact: 'Values: true, false - Options > Player controls > Lower bar > Show transport controls > Compact',
	showPlaybackOrderBtn_default: 'Values: true, false - Options > Player controls > Lower bar > Show playback order button > Default',
	showPlaybackOrderBtn_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show playback order button > Artwork',
	showPlaybackOrderBtn_compact: 'Values: true, false - Options > Player controls > Lower bar > Show playback order button > Compact',
	showReloadBtn_default: 'Values: true, false - Options > Player controls > Lower bar > Show reload button > Default',
	showReloadBtn_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show reload button > Artwork',
	showReloadBtn_compact: 'Values: true, false - Options > Player controls > Lower bar > Show reload button > Compact',
	showVolumeBtn_default: 'Values: true, false - Options > Player controls > Lower bar > Show volume button > Default',
	showVolumeBtn_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show volume button > Artwork',
	showVolumeBtn_compact: 'Values: true, false - Options > Player controls > Lower bar > Show volume button > Compact',
	autoHideVolumeBar: 'Values: true, false - Options > Player controls > Lower bar > Show volume button > Auto-hide bar',
	showPlaybackTime_default: 'Values: true, false - Options > Player controls > Lower bar > Show playback time > Default',
	showPlaybackTime_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show playback time > Artwork',
	showPlaybackTime_compact: 'Values: true, false - Options > Player controls > Lower bar > Show playback time > Compact',
	showLowerBarArtist_default: 'Values: true, false - Options > Player controls > Lower bar > Show artist > Default',
	showLowerBarArtist_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show artist > Artwork',
	showLowerBarArtist_compact: 'Values: true, false - Options > Player controls > Lower bar > Show artist > Compact',
	showLowerBarTrackNum_default: 'Values: true, false - Options > Player controls > Lower bar > Show track number > Default',
	showLowerBarTrackNum_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show track number > Artwork',
	showLowerBarTrackNum_compact: 'Values: true, false - Options > Player controls > Lower bar > Show track number > Compact',
	showLowerBarTitle_default: 'Values: true, false - Options > Player controls > Lower bar > Show song title > Default',
	showLowerBarTitle_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show song title > Artwork',
	showLowerBarTitle_compact: 'Values: true, false - Options > Player controls > Lower bar > Show song title > Compact',
	showLowerBarComposer_default: 'Values: true, false - Options > Player controls > Lower bar > Show composer > Default',
	showLowerBarComposer_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show composer > Artwork',
	showLowerBarComposer_compact: 'Values: true, false - Options > Player controls > Lower bar > Show composer > Compact',
	showLowerBarArtistFlags_default: 'Values: true, false - Options > Player controls > Lower bar > Show artist country flags > Default',
	showLowerBarArtistFlags_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show artist country flags > Artwork',
	showLowerBarArtistFlags_compact: 'Values: true, false - Options > Player controls > Lower bar > Show artist country flags > Compact',
	showLowerBarVersion_default: 'Values: true, false - Options > Player controls > Lower bar > Show software version > Default',
	showLowerBarVersion_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show software version > Artwork',
	showLowerBarVersion_compact: 'Values: true, false - Options > Player controls > Lower bar > Show software version > Compact',
	showProgressBar_default: 'Values: true, false - Options > Player controls > Lower bar > Show progress bar > Default',
	showProgressBar_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show progress bar > Artwork',
	showProgressBar_compact: 'Values: true, false - Options > Player controls > Lower bar > Show progress bar > Compact',
	showPeakmeterBar_default: 'Values: true, false - Options > Player controls > Lower bar > Show peakmeter bar > Default',
	showPeakmeterBar_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show peakmeter bar > Artwork',
	showPeakmeterBar_compact: 'Values: true, false - Options > Player controls > Lower bar > Show peakmeter bar > Compact',
	showWaveformBar_default: 'Values: true, false - Options > Player controls > Lower bar > Show waveform bar > Default',
	showWaveformBar_artwork: 'Values: true, false - Options > Player controls > Lower bar > Show waveform bar > Artwork',
	showWaveformBar_compact: 'Values: true, false - Options > Player controls > Lower bar > Show waveform bar > Compact',
	seekbar: 'Values: "progressbar", "peakmeterBar", "waveformbar", - Options > Player controls > Seekbar > Type',
	progressBarWheelSeekSpeed: 'Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 - Options > Player controls > Seekbar > Progress bar > Mouse wheel seek speed',
	progressBarRefreshRate: 'Values: 1000, 500, 333, "variable", 100, 60, 30 - Options > Player controls > Seekbar > Progress bar > Refresh rate',
	peakmeterBarDesign: 'Values: "horizontal", "horizontal_center", "vertical" - Options > Player controls > Seekbar > Peakmeter bar > Style',
	peakmeterBarVertSize: 'Values: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 25, 30, 35, 40, "min" - Options > Player controls > Seekbar > Peakmeter bar > Size',
	peakmeterBarVertDbRange: 'Values: 220, 215, 210, 320, 315, 310, 520, 515, 510 - Options > Player controls > Seekbar > Peakmeter bar > Decibel range',
	peakmeterBarOverBars: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show over bars',
	peakmeterBarOuterBars: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show outer bars',
	peakmeterBarOuterPeaks: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show outer peaks',
	peakmeterBarMainBars: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show main bars',
	peakmeterBarMainPeaks: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show main peaks',
	peakmeterBarMiddleBars: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show middle bars',
	peakmeterBarProgBar: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show progress bar',
	peakmeterBarGaps: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show gaps',
	peakmeterBarGrid: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show grid',
	peakmeterBarInfo: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show info',
	peakmeterBarVertPeaks: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show peaks',
	peakmeterBarVertBaseline: 'Values: true, false - Options > Player controls > Seekbar > Peakmeter bar > Display > Show baseline',
	peakmeterBarRefreshRate: 'Values: 200, 150, 120, 100, 80, 60, 30 - Options > Player controls > Seekbar > Peakmeter bar > Refresh rate',
	waveformBarMode: 'Values: "ffprobe", "audiowaveform", "visualizer" - Options > Player controls > Seekbar > Waveform bar > Mode',
	waveformBarAnalysis: 'Values: "rms_level", "peak_level", "rms_peak" - Options > Player controls > Seekbar > Waveform bar > Analysis',
	waveformBarDesign: 'Values: "waveform", "bars", "dots", "halfbars" - Options > Player controls > Seekbar > Waveform bar > Shape',
	waveformBarSizeWave: 'Values: 1, 2, 3, 4, 5 - Options > Player controls > Seekbar > Waveform bar > Size > Waveform',
	waveformBarSizeBars: 'Values: 1, 2, 3, 4, 5 - Options > Player controls > Seekbar > Waveform bar > Size > Bars',
	waveformBarSizeDots: 'Values: 1, 2, 3, 4, 5 - Options > Player controls > Seekbar > Waveform bar > Size > Dots',
	waveformBarSizeHalf: 'Values: 1, 2, 3, 4, 5 - Options > Player controls > Seekbar > Waveform bar > Size > Halfbars',
	waveformBarSizeNormalize: 'Values:true, false - Options > Player controls > Seekbar > Waveform bar > Size > Normalize width',
	waveformBarPaint: 'Values: "full", "partial" - Options > Player controls > Seekbar > Waveform bar > Display',
	waveformBarPrepaint: 'Values: true, false - Options > Player controls > Seekbar > Waveform bar > Display > Prepaint',
	waveformBarPrepaintFront: 'Values: "Infinity", 2, 5, 10, - Options > Player controls > Seekbar > Waveform bar > Display > Prepaint front',
	waveformBarAnimate: 'Values: true, false - Options > Player controls > Seekbar > Waveform bar > Display > Animate',
	waveformBarBPM: 'Values: true, false - Options > Player controls > Seekbar > Waveform bar > Display > Use BPM',
	waveformBarInvertHalfbars: 'Values: true, false - Options > Player controls > Seekbar > Waveform bar > Display > Invert halfbars',
	waveformBarIndicator: 'Values: true, false - Options > Player controls > Seekbar > Waveform bar > Display > Show indicator',
	waveformBarRefreshRate: 'Values: 1000, 500, 200, 100, 80, 60, 30, - Options > Player controls > Seekbar > Waveform bar > Refresh rate',
	waveformBarRefreshRateVar: 'Values: true, false - Options > Player controls > Seekbar > Waveform bar > Refresh rate > Variable',
	playbackOrder: 'Values: "default", "repeatPlaylist", "repeatTrack", "shuffle" - not in Options - playback order state button'
};

/** @type {Object} Options > Player controls settings config header description. */
const themePlayerControlsSchema = new ConfigurationObjectSchema('themeControls', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* PLAYER CONTROLS:                                                                                                                                                                                      ' +
	'* Top menu Options > Player controls                                                                                                                                                                    ' +
	'* You can set and select between various player control settings that will be used.                                                                                                                     ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


//////////////////
// * PLAYLIST * //
//////////////////
/** @type {Object} Options > Playlist settings with default values. */
const themePlaylistDefaults = {
	playlistLayout: 'normal',
	showPlaylistManager_default: true,
	showPlaylistManager_artwork: false,
	showPlaylistManager_compact: false,
	showPlaylistHistory: true,
	autoHidePlman: true,
	show_album_art: true,
	auto_album_art: false,
	show_header: true,
	show_rating_header: true,
	show_PLR_header: false,
	use_compact_header: false,
	auto_collapse: false,
	hyperlinksCtrlClick: false,
	show_disc_header: true,
	show_group_info: true,
	showWeblinks: true,
	showPlaylistFullDate: false,
	show_row_stripes: false,
	show_playcount: true,
	show_queue_position: true,
	show_rating: true,
	use_rating_from_tags: false,
	showPlaylistRatingGrid: false,
	show_PLR: false,
	showPlaylistTrackNumbers: true,
	showPlaylistIndexNumbers: false,
	showDifferentArtist: false,
	showArtistPlaylistRows: false,
	showAlbumPlaylistRows: false,
	playlistTimeRemaining: false,
	showVinylNums: true,
	lastFmScrobblesFallback: true,
	playlistRowHover: true,
	playlistSortOrderAuto: false,
	playlistSortOrder: '',
	playlistSortOrderDirection: '_asc',
	playlist_stats_include_artist: true,
	playlist_stats_include_album : true,
	playlist_stats_include_track: true,
	playlist_stats_include_year: false,
	playlist_stats_include_genre: false,
	playlist_stats_include_label: false,
	playlist_stats_include_country: false,
	playlist_stats_include_stats: true,
	playlist_stats_sort_by: '',
	playlist_stats_sort_direction: '_dsc'
};

/** @type {Object} Options > Playlist settings config name description. */
const themePlaylistComments = {
	playlistLayout: 'Values: "normal", "full" - Options > Playlist > Layout',
	showPlaylistManager_default: 'Values: true, false - Options > Playlist > Playlist manager > Show playlist manager > Default',
	showPlaylistManager_artwork: 'Values: true, false - Options > Playlist > Playlist manager > Show playlist manager > Artwork',
	showPlaylistManager_compact: 'Values: true, false - Options > Playlist > Playlist manager > Show playlist manager > Compact',
	showPlaylistHistory: 'Values: true, false - Options > Playlist > Playlist manager > Show playlist history',
	autoHidePlman: 'Values: true, false - Options > Playlist > Playlist manager > Auto-hide',
	show_album_art: 'Values: true, false - Options > Playlist > Album header > Album art > Show',
	auto_album_art: 'Values: true, false - Options > Playlist > Album header > Album art > Auto-hide when no cover',
	show_header: 'Values: true, false - Options > Playlist > Album header > Album header',
	show_rating_header: 'Values: true, false - Options > Playlist > Album Header > Show rating',
	show_PLR_header: 'Values: true, false - Options > Playlist > Album Header > Show PLR value',
	use_compact_header: 'Values: true, false - Options > Playlist > Album header > Compact header',
	auto_collapse: 'Values: true, false - Options > Playlist > Album header > Auto collapse and expand',
	hyperlinksCtrlClick: 'Values: true, false - Options > Playlist > Album header > Ctrl+click to follow hyperlinks',
	show_disc_header: 'Values: true, false - Options > Playlist > Album header > Show disc sub-header',
	show_group_info: 'Values: true, false - Options > Playlist > Album header > Show group info',
	showWeblinks: 'Values: true, false - Options > Playlist > Album header > Show weblinks in context menu',
	showPlaylistFullDate: 'Values: true, false - Options > Playlist > Album header > Show long release date (YYYY-MM-DD)',
	show_row_stripes: 'Values: true, false - Options > Playlist > Track row > Show row stripes',
	show_playcount: 'Values: true, false - Options > Playlist > Track row > Show play count',
	show_queue_position: 'Values: true, false - Options > Playlist > Track row > Show queue position',
	show_rating: 'Values: true, false - Options > Playlist > Track row > Show rating',
	use_rating_from_tags: 'Values: true, false - Options > Playlist > Track row > Show rating from tags',
	showPlaylistRatingGrid: 'Values: true, false - Options > Playlist > Track row > Show rating grid',
	show_PLR: 'Values: true, false - Options > Playlist > Track row > Show PLR value',
	showPlaylistTrackNumbers: 'Values: true, false - Options > Playlist > Track row > Show track numbers',
	showPlaylistIndexNumbers: 'Values: true, false - Options > Playlist > Track row > Show index numbers',
	showDifferentArtist: 'Values: true, false - Options > Playlist > Track row > Show artist name on difference',
	showArtistPlaylistRows: 'Values: true, false - Options > Playlist > Track row > Show artist name in all rows',
	showAlbumPlaylistRows: 'Values: true, false - Options > Playlist > Track row > Show album title in all rows',
	playlistTimeRemaining: 'Values: true, false - Options > Playlist > Track row > Show time remaining on playing track',
	showVinylNums: 'Values: true, false - Options > Playlist > Track row > Show vinyl style numbering if available',
	lastFmScrobblesFallback: 'Values: true, false - Options > Playlist > Track row > Show last.fm scrobbles on no local plays',
	playlistRowHover: 'Values: true, false - Options > Playlist > Track row > Row mouse hover',
	playlistSortOrderAuto: 'Values: true, false - Options > Playlist > Sort order > Always auto-sort',
	playlistSortOrder: 'Values: "", "default", "artistDate_asc", "artistDate_dsc", "album", "title", "trackNumber", "year_asc", "year_dsc", "filePath", "custom" - Options > Playlist > Sort order',
	playlistSortOrderDirection: 'Values: "_asc", "_dsc" - Options > Playlist > Sort order',
	playlist_stats_include_artist: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include artist',
	playlist_stats_include_album: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include album',
	playlist_stats_include_track: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include track',
	playlist_stats_include_year: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include year',
	playlist_stats_include_genre: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include genre',
	playlist_stats_include_label: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include label',
	playlist_stats_include_country: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include country',
	playlist_stats_include_stats: 'Values: true, false - Playlist context menu > Write playlist statistics to list > Include stats',
	playlist_stats_sort_by: 'Values: "", "artist", "albumTitle", "year", "genre" - playlist context menu - Write playlist statistics to text',
	playlist_stats_sort_direction: 'Values: "_asc", "_dsc" - playlist context menu - Write playlist statistics to text'
};

/** @type {Object} Options > Playlist settings config header description. */
const themePlaylistSchema = new ConfigurationObjectSchema('themePlaylist', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* PLAYLIST:                                                                                                                                                                                             ' +
	'* Top menu Options > Playlist                                                                                                                                                                           ' +
	'* You can set and select between various playlist settings that will be used.                                                                                                                           ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {PlaylistGroupingPresets[]} Playlist grouping presets with default entries and values. */
const themePlaylistGroupingPresets = [
	{
		name: 'artist',
		description: 'by artist',
		group_query: '%album artist%',
		title_query: '[%album artist%]',
		sub_title_query: "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']",
		show_date: false,
		show_disc: false
	},
	{
		name: 'artist_album',
		description: 'by artist / album',
		group_query: '%album artist%%album%',
		title_query: '[%album artist%]',
		sub_title_query: "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']",
		show_date: true,
		show_disc: false
	},
	{
		name: 'artist_album_disc',
		description: 'by artist / album / disc number',
		group_query: '%album artist%%album%%discnumber%',
		title_query: '[%album artist%]',
		sub_title_query: "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']",
		show_date: true,
		show_disc: true
	},
	{
		name: 'artist_album_disc_edition',
		description: 'by artist / album / disc number / edition / codec',
		group_query: '%album artist%%album%%discnumber%%edition%%codec%',
		title_query: '[%album artist%]',
		sub_title_query: "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']",
		show_date: true,
		show_disc: true
	},
	{
		name: 'path',
		description: 'by path',
		group_query: '$directory_path(%path%)',
		title_query: '[%album artist%]',
		sub_title_query: "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']",
		show_date: true,
		show_disc: false
	},
	{
		name: 'date',
		description: 'by date',
		group_query: '%date%',
		title_query: '[%album artist%]',
		sub_title_query: "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']",
		show_date: true,
		show_disc: false
	}
];

/** @type {Object} Playlist grouping presets config header description. */
const themePlaylistGroupingPresetsSchema = new ConfigurationObjectSchema('themePlaylistGroupingPresets', ConfigurationObjectType.Array, [
	{ name: 'name' },
	{ name: 'description' },
	{ name: 'group_query' },
	{ name: 'title_query' },
	{ name: 'sub_title_query' },
	{ name: 'show_date' },
	{ name: 'show_disc' }],
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* PLAYLIST GROUPING PRESETS:                                                                                                                                                                            ' +
	'* You can add new entries with grouping patterns or reorder entries that will be displayed in the Playlist grouping manager.                                                                            ' +
	'* The playlist grouping manager can be accessed via right clicking in the Playlist > Grouping > Manage presets.                                                                                         ' +
	'* Changes will be saved to the config file after reload when creating new grouping presets or modifications in the Playlist grouping manager.                                                           ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////
// * DETAILS * //
/////////////////
/** @type {Object} Options > Details settings with default values. */
const themeDetailsDefaults = {
	showDiscArtStub: true,
	noDiscArtStub: false,
	discArtStub: 'cdAlbumCover',
	displayDiscArt: true,
	discArtOnTop: false,
	filterDiscJpgsFromAlbumArt: true,
	spinDiscArt: false,
	spinDiscArtImageCount: 72,
	spinDiscArtRedrawInterval: 75,
	rotateDiscArt: true,
	rotationAmt: 3,
	artRotateDelay: 30,
	discArtDisplayAmount: 0.5,
	detailsAlbumArtOpacity: 255,
	detailsAlbumArtDiscAreaOpacity: 255,
	showGridArtist_default: false,
	showGridArtist_artwork: false,
	showGridTitle_default: false,
	showGridTrackNum_default: false,
	showGridTrackNum_artwork: false,
	showGridTitle_artwork: false,
	showGridPlayingPlaylist: false,
	showGridTimeline_default: true,
	showGridTimeline_artwork: true,
	showGridArtistFlags_default: true,
	showGridArtistFlags_artwork: true,
	showGridReleaseFlags_default: 'logo',
	showGridReleaseFlags_artwork: 'logo',
	showGridCodecLogo_default: 'logo',
	showGridCodecLogo_artwork: 'logo',
	showGridChannelLogo_default: 'logo',
	showGridChannelLogo_artwork: 'logo',
	autoHideGridMetadata: true,
	noDiscArtBg: true,
	labelArtOnBg: false
};

/** @type {Object} Options > Details settings config name description. */
const themeDetailsComments = {
	showDiscArtStub: 'Values: true, false - Options > Details > Disc art > Disc art placeholder > Show placeholder if no disc art found',
	noDiscArtStub: 'Values: true, false - Options > Details > Disc art > Disc art placeholder > No placeholder',
	discArtStub: 'Values: "cdAlbumCover", "cdWhite", "cdBlack", "cdBlank", "cdTrans", "vinylAlbumCover", "vinylWhite", "vinylVoid", "vinylColdFusion", "vinylRingOfFire", "vinylMaple", "vinylBlack", "vinylBlackHole", "vinylEbony", "vinylTrans" - Options > Details > Disc art > Disc art placeholder',
	displayDiscArt: 'Values: true, false - Options > Details > Disc art > Display disc art if found',
	discArtOnTop: 'Values: true, false - Options > Details > Disc art > Display disc art above cover',
	filterDiscJpgsFromAlbumArt: 'Values: true, false - Options > Details > Disc art > Filter cd/disc/vinyl .jpgs from artwork',
	spinDiscArt: 'Values: true, false - Options > Details > Disc art > Spin disc art while songs play (increases memory and CPU)',
	spinDiscArtImageCount: 'Values: 36, 45, 60, 72, 90, 120, 180 - Options > Details > Disc art > # Rotation images (memory usage/rotational speed)',
	spinDiscArtRedrawInterval: 'Values: 250, 200, 150, 125, 100, 75, 50, 40, 30, 20, 10 - Options > Details > Disc art > Spinning disc art redraw speed',
	rotateDiscArt: 'Values: true, false - Options > Details > Disc art > Rotate disc art as tracks change',
	rotationAmt: 'Values: 2, 3, 4, 5 - Options > Details > Disc art > Disc art rotation amount',
	artRotateDelay: 'Values: free to choose - not in Options - seconds to display each art',
	discArtDisplayAmount: 'Values: 1, 0.5, 0.455, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1 - Options > Details > Disc art > Disc art display amount',
	detailsAlbumArtOpacity: 'Values: 255, 230, 204, 178, 153, 128, 102, 76, 51, 25 - from 100% - 10% - Options > Details > Album art > Full artwork opacity',
	detailsAlbumArtDiscAreaOpacity: 'Values: 255, 230, 204, 178, 153, 128, 102, 76, 51, 25 - from 100% - 10% - Options > Details > Album art > Disc area opacity',
	showGridArtist_default: 'Values: true, false - Options > Details > Metadata grid > Show artist - when Default layout is active',
	showGridArtist_artwork: 'Values: true, false - Options > Details > Metadata grid > Show artist - when Artwork layout is active',
	showGridTrackNum_default: 'Values: true, false - Options > Details > Metadata grid > Show track number - when Default layout is active',
	showGridTrackNum_artwork: 'Values: true, false - Options > Details > Metadata grid > Show track number - when Artwork layout is active',
	showGridTitle_default: 'Values: true, false - Options > Details > Metadata grid > Show song title - when Default layout is active',
	showGridTitle_artwork: 'Values: true, false - Options > Details > Metadata grid > Show song title - when Artwork layout is active',
	showGridPlayingPlaylist: 'Values: true, false - Options > Details > Metadata grid > Show playing playlist',
	showGridTimeline_default: 'Values: true, false - Options > Details > Metadata grid > Show timeline - when Default layout is active',
	showGridTimeline_artwork: 'Values: true, false - Options > Details > Metadata grid > Show timeline - when Artwork layout is active',
	showGridArtistFlags_default: 'Values: true, false - Options > Details > Metadata grid > Show artist country flags - when Default layout is active',
	showGridArtistFlags_artwork: 'Values: true, false - Options > Details > Metadata grid > Show artist country flags - when Artwork layout is active',
	showGridReleaseFlags_default: 'Values: false, logo, textlogo - Options > Details > Metadata grid > Show release country flags - when Default layout is active',
	showGridReleaseFlags_artwork: 'Values: false, logo, textlogo - Options > Details > Metadata grid > Show release country flags - when Artwork layout is active',
	showGridCodecLogo_default: 'Values: false, logo, textlogo - Options > Details > Metadata grid > Show codec logo - when Default layout is active',
	showGridCodecLogo_artwork: 'Values: false, logo, textlogo - Options > Details > Metadata grid > Show codec logo - when Artwork layout is active',
	showGridChannelLogo_default: 'Values: false, logo, textlogo - Options > Details > Metadata grid > Show channel logo - when Default layout is active',
	showGridChannelLogo_artwork: 'Values: false, logo, textlogo - Options > Details > Metadata grid > Show channel logo - when Artwork layout is active',
	autoHideGridMetadata: 'Values: true, false - Options > Details > Metadata grid > Auto-hide full metadata on small player',
	noDiscArtBg: 'Values: true, false - Options > Details > Background > Show full background when no disc art',
	labelArtOnBg: 'Values: true, false - Options > Details > Background > Show label art on background'
};

/** @type {Object} Options > Details settings config header description. */
const themeDetailsSchema = new ConfigurationObjectSchema('themeDetails', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* DETAILS:                                                                                                                                                                                              ' +
	'* Top menu Options > Details                                                                                                                                                                            ' +
	'* You can set and select between various details settings that will be used.                                                                                                                            ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/**
 * @typedef {Object} MetadataGridEntry
 * @property {string} label Text that shows in the left column of the metadata grid.
 * @property {string} val Evaluated text in the right column. If this evaluates to an empty string, the entry is not shown.
 * @property {boolean=} age If True, appends the "(1y 10, 23d)" style text to the evaluated val. Only valid for date strings.
 * @property {string=} comment Optional comment for the .jsonc file.
 */

/** @type {MetadataGridEntry[]} Metadata grid default entries and values. */
const defaultMetadataGrid = [
	{ label: 'Disc',            val: `$if(${tf.disc_subtitle},[Disc %discnumber% \u2013 ]${tf.disc_subtitle})` },
	{ label: 'Rel. Type',       val: '$if($stricmp(%releasetype%,Album),,[%releasetype%])' },
	{ label: 'Year',            val: `$puts(d,${tf.date})$if($strcmp($year($get(d)),$get(d)),$get(d),)`, comment: '\'Year\' is shown if the date format is YYYY' },
	{ label: 'Rel. Date',       val: `$puts(d,${tf.date})$if($strcmp($year($get(d)),$get(d)),,$get(d))`, age: true, comment: '\'Release Date\' is shown if the date format is YYYY-MM-DD' },
	{ label: 'Edition',         val: tf.edition },
	{ label: 'Label',           val: '[$if($meta(label),$meta_sep(label, \u00B7 ),$if3(%publisher%,%discogs_label%,))]', comment: 'The label(s) or publisher(s) that released the album.' },
	{ label: 'Catalog',         val: `$puts(cn,$if3(%catalognumber%,%discogs_catalog%,))[$if($get(cn),$get(cn)[ / ${tf.releaseCountry}],)]` },
	{ label: 'Rel. Country',    val: `$puts(cn,$if3(%catalognumber%,%discogs_catalog%,))[$if($get(cn),,$replace(${tf.releaseCountry},XW,))]`, comment: 'Only shown if %catalognumber% or %discogs_catalog% is not present. If release country is entire world (\'XW\') value is hidden.' },
	{ label: 'Track',           val: '$if(%tracknumber%,$num(%tracknumber%,1)$if(%totaltracks%,/$num(%totaltracks%,1))$ifgreater(%totaldiscs%,1,   CD %discnumber%/$num(%totaldiscs%,1),)' },
	{ label: 'Genre',           val: '[$meta_sep(genre, \u00B7 )]' },
	{ label: 'Style',           val: '[$meta_sep(style, \u00B7 )]' },
	{ label: 'Release',         val: '[%release%]' },
	{ label: 'Codec',           val: '[%codec%]' },
	{ label: 'Channels',        val: '[%channels%]' },
	{ label: 'Source',          val: '[%codec_profile%$if(%__bitspersample%, \u00B7 )]$if($strcmp(%__encoding%,lossless),%__bitspersample% bit)$ifgreater(%samplerate%,44100,$if($if2(%codec_profile%,%__bitspersample%), \u00B7 )$div(%samplerate%,1000)$replace($insert($right($div(%samplerate%,100),1),.,0),.0,) kHz,)[ \u00B7 $if3(%media%,%mediatype%,%media type%)]' },
	{ label: 'Data',            val: '%__bitrate% kbps \u00B7 $div(%filesize%,1048576).$num($div($mul($mod(%filesize%,1048576),10),1048576),0) MB' },
	{ label: 'Added',           val: '[$if2(%added_enhanced%,%added%)]', age: true },
	{ label: 'Last Played',     val: `[${tf.last_played}]`, age: true },
	{ label: 'Hotness',         val: "$puts(X,5)$puts(Y,$div(%_dynamic_rating%,400))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$ifgreater(%_dynamic_rating%,0,   $replace($div(%_dynamic_rating%,1000)'.'$mod($div(%_dynamic_rating%,100),10),0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9),)" },
	{ label: 'View Count',      val: '[%fy_view_count%]' },
	{ label: 'Likes',           val: '[$if(%fy_like_count%,%fy_like_count% \u25B2 / %fy_dislike_count% \u25BC,)]' },
	{ label: 'Play Count',      val: '$if($or(%play_count%,%lastfm_play_count%),$puts(X,5)$puts(Y,$max(%play_count%,%lastfm_play_count%))$ifgreater($get(Y),30,,$repeat($repeat(I,$get(X)) ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))   )$get(Y))' },
	{ label: 'Rating',          val: '$if(%rating%,$repeat(\u2605 ,%rating%))' },
	{ label: 'Mood',            val: '$if(%mood%,$puts(X,5)$puts(Y,$mul(5,%mood%))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$replace(%mood%,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9))' },
	{ label: 'Playing List',    val: tf.playing_playlist },
	{ label: 'Blank 01',        val: '' },
	{ label: 'Blank 02',        val: '' },
	{ label: 'Blank 03',        val: '' },
	{ label: 'Blank 04',        val: '' },
	{ label: 'Blank 05',        val: '' },
	{ label: 'Blank 06',        val: '' },
	{ label: 'Blank 07',        val: '' },
	{ label: 'Blank 08',        val: '' }
];

/** @type {Object} Metadata grid config header description. */
const gridSchema = new ConfigurationObjectSchema('metadataGrid', ConfigurationObjectType.Array, [
	{ name: 'label' },
	{ name: 'val' },
	{ name: 'age', optional: true }],
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* DETAILS METADATA GRID:                                                                                                                                                                                ' +
	'* You can add new tags or reorder entries that will be displayed in the metadata grid in top menu Details.                                                                                              ' +
	'* If there are too many entries and no space available in Details, tags will be hidden. You can change to a larger player size.                                                                         ' +
	'* Entries that evaluate to an empty string will not be shown in the grid.                                                                                                                               ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////
// * LIBRARY * //
/////////////////
/** @type {Object} Options > Library settings with default values. */
const themeLibraryDefaults = {
	libraryLayout: 'normal',
	libraryLayoutFullPreset: true,
	libraryLayoutSplitPreset: true,
	libraryLayoutSplitPreset2: false,
	libraryLayoutSplitPreset3: false,
	libraryLayoutSplitPreset4: false,
	libraryDesign: 'reborn',
	libraryTheme: 0,
	libraryThumbnailSize: 'auto',
	libraryThumbnailBorder: 'border',
	albumArtShow: false,
	itemOverlayType: 0,
	albumArtLetter: true,
	albumArtLetterNo: 1,
	artId: 0,
	albumArtGrpLevel: 0,
	imgStyleFront: 1,
	imgStyleBack: 1,
	imgStyleDisc: 1,
	imgStyleIcon: 1,
	imgStyleArtist: 1,
	albumArtLabelType: 1,
	albumArtFlipLabels: false,
	actionMode: 0,
	clickAction: 0,
	dblClickAction: 1,
	mbtnClickAction: 1,
	altClickAction: 1,
	autoPlay: true,
	keyAction: 0,
	rememberTree: false,
	artTreeSameView: false,
	presetLoadCurView: true,
	libraryPlaylistSwitch: false,
	rootNode: 3,
	nodeCounts: 1,
	countsRight: true,
	autoCollapse: false,
	itemShowStatistics: 0,
	highLightNowplaying: true,
	showTracks: true,
	rowStripes: false,
	fullLineSelection: true,
	libraryRowHover: true,
	filterBy: 0,
	sortOrder: 'default',
	yearBeforeAlbum: true,
	albumArtViewBy: 0,
	treeViewBy: 0,
	librarySource: 1,
	librarySourceFixedPlaylist: false,
	librarySourceFixedPlaylistName: ''
};

/** @type {Object} Options > Library settings config name dscription. */
const themeLibraryComments = {
	libraryLayout: 'Values: "normal", "full", "split" - Options > Library > Layout',
	libraryLayoutFullPreset: 'Values: true, false - Options > Library > Layout > Use full preset',
	libraryLayoutSplitPreset: 'Values: true (only one split preset can be active), false - Options > Library > Layout > Use split preset (collapse)',
	libraryLayoutSplitPreset2: 'Values: true (only one split preset can be active), false - Options > Library > Layout > Use split preset (text)',
	libraryLayoutSplitPreset3: 'Values: true (only one split preset can be active), false - Options > Library > Layout > Use split preset (art grid)',
	libraryLayoutSplitPreset4: 'Values: true (only one split preset can be active), false - Options > Library > Layout > Use split preset (art header)',
	libraryDesign: 'Values: "reborn", "traditional", "modern", "ultraModern", "clean", "facet", "coversLabelsRight", "coversLabelsBottom", "coversLabelsBlend", "flowMode" - Options > Library > Design',
	libraryTheme: 'Values: 0, 1, 2, 3, 4, 5 - Options > Library > Theme',
	libraryThumbnailSize: 'Values: "auto", "playlist", 0, 1, 2, 3, 4, 5, 6, 7 - Options > Library > Album art > Thumbnail size',
	libraryThumbnailBorder: 'Values: "none", "border", "shadow" - Options > Library > Album art > Thumbnail border',
	albumArtShow: 'Values: true, false - Options > Library > Album art > Activate option or change design to album art',
	itemOverlayType: 'Values: 0, 1, 2 - Options > Library > Album art > Overlay',
	albumArtLetter: 'Values: true, false - Options > Library > Album art > Index > Show on scrollbar drag',
	albumArtLetterNo: 'Values: 0, 1 - Options > Library > Album art > Index',
	artId: 'Values: 0, 1, 2, 3, 4 - Options > Library > Album art > View',
	albumArtGrpLevel: 'Values: 0, 1, 2 - Options > Library > Album art > View',
	imgStyleFront: 'Values: 0, 1, 2 - Options > Library > Album art > Image > Front',
	imgStyleBack: 'Values: 0, 1, 2 - Options > Library > Album art > Image > Back',
	imgStyleDisc: 'Values: 0, 1, 2 - Options > Library > Album art > Image > Disc',
	imgStyleIcon: 'Values: 0, 1, 2 - Options > Library > Album art > Image > Icon',
	imgStyleArtist: 'Values: 0, 1, 2 - Options > Library > Album art > Image > Artist',
	albumArtLabelType: 'Values: 1, 2, 3, 4, 0 - Options > Library > Album art > Labels',
	albumArtFlipLabels: 'Values: true, false - Options > Library > Album art > Labels',
	actionMode: 'Values: 0, 1, 2 - Options > Library > Controls > Action mode',
	clickAction: 'Values: 0, 1, 2, 3 - Options > Library > Controls > Single-click action',
	dblClickAction: 'Values: 0, 1, 2, 3 - Options > Library > Controls > Double-click action',
	mbtnClickAction: 'Values: 0, 1, 2 - Options > Library > Controls > Middle-mouse click action',
	altClickAction: 'Values: 0, 1, 2 - Options > Library > Controls > Alt + mouse click action',
	autoPlay: 'Values: true, false - Options > Library > Controls > Keystroke action > Play on Enter or send from menu',
	keyAction: 'Values: 0, 1 - Options > Library > Controls > Keystroke action',
	rememberTree: 'Values: true, false - Options > Library > Controls > Always remember library state',
	artTreeSameView: 'Values: true, false - Options > Library > Controls > Always load View by same as tree',
	presetLoadCurView: 'Values: true, false - Options > Library > Controls > Always load preset with current view pattern',
	libraryPlaylistSwitch: 'Values: true, false - Options > Library > Controls > Switch to playlist when adding songs',
	rootNode: 'Values: 0, 1, 2, 3 - Options > Library > Track row > Node root type',
	nodeCounts: 'Values: 0, 1, 2 - Options > Library > Track row > Node item counts',
	countsRight: 'Values: true, false - Options > Library > Track row > Node item counts position',
	autoCollapse: 'Values: true, false - Options > Library > Track row > Node auto collapse',
	itemShowStatistics: 'Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 - Options > Library > Track row > Statistics',
	highLightNowplaying: 'Values: true, false - Options > Library > Track row > Show now playing',
	showTracks: 'Values: true, false - Options > Library > Track row > Show tracks when expanding nodes',
	rowStripes: 'Values: true, false - Options > Library > Track row > Show row stripes',
	fullLineSelection: 'Values: true, false - Options > Library > Track row > Row fully clickable',
	libraryRowHover: 'Values: true, false - Options > Library > Track row > Row mouse hover',
	filterBy: 'Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 - Options > Library > Filter order',
	sortOrder: 'Values: 0, 1, 2, 3, 4 - Options > Library > Sort order',
	yearBeforeAlbum: 'Values: true, false - Options > Library > Sort order',
	albumArtViewBy: 'Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 - Options > Library > View order',
	treeViewBy: 'Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 - Options > Library > View order',
	librarySource: 'Values: 0, 1 - Options > Library > Source',
	librarySourceFixedPlaylist: 'Values: true, false - not in Options, managed by Library source menu',
	librarySourceFixedPlaylistName: 'Values: "selected playlist name" - not in Options, managed by Library source menu'
};

/** @type {Object} Options > Library settings config header dscription. */
const themeLibrarySchema = new ConfigurationObjectSchema('themeLibrary', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* LIBRARY:                                                                                                                                                                                              ' +
	'* Top menu Options > Library                                                                                                                                                                            ' +
	'* You can set and select between various library settings that will be used.                                                                                                                            ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


///////////////////
// * BIOGRAPHY * //
///////////////////
/** @type {Object} Options > Biography settings with default values. */
const themeBiographyDefaults = {
	biographyLayout: 'normal',
	biographyLayoutFullPreset: true,
	style: 0,
	filmStripPos: 3,
	filmStripOverlay: false,
	biographyTheme: 0,
	biographyDisplay: 'Image+text',
	showFilmStrip: false,
	imgSeekerShow: 0,
	heading: 1,
	summaryShow: true,
	summaryCompact: true,
	artistView: true,
	focus: false,
	lockBio: false,
	sourceAll: false,
	classicalMusicMode: false,
	cycPhotoLocation: 0,
	covType: 0,
	loadCovAllFb: false,
	loadCovFolder: false,
	artStyleDual: 1,
	artReflDual: false,
	artShadowDual: false,
	covStyleDual: 1,
	covReflDual: false,
	covShadowDual: false,
	artStyleImgOnly: 1,
	artReflImgOnly: false,
	artShadowImgOnly: false,
	covStyleImgOnly: 1,
	covReflImgOnly: false,
	covShadowImgOnly: false,
	filmPhotoStyle: 1,
	filmCoverStyle: 1,
	photoNum: 10,
	cycPic: true,
	imgSmoothTrans: false,
	cycTimePic: 15
};

/** @type {Object} Options > Biography settings config name description. */
const themeBiographyComments = {
	biographyLayout: 'Values: "normal", "full" - Options > Biography > Layout',
	biographyLayoutFullPreset: 'Values: true, false - Options > Biography > Layout > Use full preset',
	style: 'Values: 0, 1, 2, 3, 4, 5 - Options > Biography > Layout',
	filmStripPos: 'Values: 0, 1, 2, 3 - Options > Biography > Layout > Filmstrip',
	filmStripOverlay: 'Values: true, false - Options > Biography > Layout > Filmstrip > Overlay image area',
	biographyTheme: 'Values: 0, 1, 2, 3 - Options > Biography > Theme',
	biographyDisplay: 'Values: "Image+text", "Image", "Text" - Options > Biography > Display',
	showFilmStrip: 'Values: true, false - Options > Biography > Display',
	imgSeekerShow: 'Values: 0, 1 - Options > Biography > Display',
	heading: 'Values: 0, 1 - Options > Biography > Display',
	summaryShow: 'Values: true, false - Options > Biography > Display',
	summaryCompact: 'Values: true, false - Options > Biography > Display',
	artistView: 'Values: true, false - Options > Biography > Display',
	focus: 'Values: true, false - Options > Biography > Display',
	lockBio: 'Values: true, false - Options > Biography > Source > Text',
	sourceAll: 'Values: true, false - Options > Biography > Source > Text > Amalgamate',
	classicalMusicMode: 'Values: true, false - Options > Biography > Source > Text > Prefer composition (allmusic && wikipedia review)',
	cycPhotoLocation: 'Values: 0, 1, 2 - Options > Biography > Source > Photo',
	covType: 'Values: 0, 1, 2, 3, 4 - Options > Biography > Source > Cover',
	loadCovAllFb: 'Values: true, false - Options > Biography > Source > Cover > Cycle above',
	loadCovFolder: 'Values: true, false - Options > Biography > Source > Cover > Cycle from download folder',
	artStyleDual: 'Values: 0, 1, 2 - Options > Biography > Image > Image + text > Photo',
	artReflDual: 'Values: true, false - Options > Biography > Image > Image + text > Reflection (Photo)',
	artShadowDual: 'Values: true, false - Options > Biography > Image > Image + text > Shadow (Photo)',
	covStyleDual: 'Values: 0, 1, 2 - Options > Biography > Image > Image + text > Cover',
	covReflDual: 'Values: true, false - Options > Biography > Image > Image + text > Reflection (Cover)',
	covShadowDual: 'Values: true, false - Options > Biography > Image > Image + text > Shadow (Cover)',
	artStyleImgOnly: 'Values: 0, 1, 2 - Options > Biography > Image > Image only > Photo',
	artReflImgOnly: 'Values: true, false - Options > Biography > Image > Image only > Reflection (Photo)',
	artShadowImgOnly: 'Values: true, false - Options > Biography > Image > Image only > Shadow (Photo)',
	covStyleImgOnly: 'Values: 0, 1, 2 - Options > Biography > Image > Image only > Cover',
	covReflImgOnly: 'Values: true, false - Options > Biography > Image > Image only > Reflection (Cover)',
	covShadowImgOnly: 'Values: true, false - Options > Biography > Image > Image only > Shadow (Cover)',
	filmPhotoStyle: 'Values: 0, 1, 2 - Options > Biography > Image > Filmstrip > Photo',
	filmCoverStyle: 'Values: 0, 1, 2 - Options > Biography > Image > Filmstrip > Cover',
	photoNum: 'Values: 5, 10, 15, 20 - Options > Biography > Image > Downloads',
	cycPic: 'Values: true, false - Options > Biography > Image > Auto cycle > Auto cycle',
	imgSmoothTrans: 'Values: true, false - Options > Biography > Image > Auto cycle > Smooth transition',
	cycTimePic: 'Values: 5, 10, 15, 30, 60 - Options > Biography > Image > Auto cycle'
};

/** @type {Object} Options > Biography settings config header description. */
const themeBiographySchema = new ConfigurationObjectSchema('themeBiography', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* BIOGRAPHY:                                                                                                                                                                                            ' +
	'* Top menu Options > Biography                                                                                                                                                                          ' +
	'* You can set and select between various biography settings that will be used.                                                                                                                          ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////
// * LYRICS * //
////////////////
/** @type {Object} Options > Lyrics settings with default values. */
const themeLyricsDefaults = {
	lyricsLayout: 'normal',
	lyricsDropShadowLevel: 2,
	lyricsFadeScroll: true,
	lyricsLargerCurrentSync: true,
	lyricsAlbumArt: true,
	lyricsRememberActiveState: false,
	lyricsRememberPanelState: false,
	lyricsScrollSpeed: 'normal',
	lyricsScrollRateAvg: 750,
	lyricsScrollRateMax: 375
};

/** @type {Object} Options > Lyrics settings config name dscription. */
const themeLyricsComments = {
	lyricsLayout: 'Values: "normal", "full" - Options > Lyrics > Layout',
	lyricsDropShadowLevel: 'Values: 0, 1, 2, 3 - Options > Lyrics > Display > Show drop shadow',
	lyricsFadeScroll: 'Values: true, false - Options > Lyrics > Display > Show fade scroll',
	lyricsLargerCurrentSync: 'Values: true, false - Options > Lyrics > Display > Larger current sync',
	lyricsAlbumArt: 'Values: true, false - Options > Lyrics > Display > Show lyrics on album art',
	lyricsRememberActiveState: 'Values: true, false - Options > Lyrics > Display > Remember active lyrics state',
	lyricsRememberPanelState: 'Values: true, false - Options > Lyrics > Display > Remember lyrics panel state',
	lyricsScrollSpeed: 'Values: "fastest", "fast", "normal", "slow", "slowest" - Options > Lyrics > Scroll speed',
	lyricsScrollRateAvg: 'Values: false, 300, 500, 750, 1000, 1500 - not in Options, set by lyricsScrollSpeed',
	lyricsScrollRateMax: 'Values: false, 150, 250, 375, 500, 725 - not in Options, set by lyricsScrollSpeed'
};

/** @type {Object} Options > Lyrics settings config header dscription. */
const themeLyricsSchema = new ConfigurationObjectSchema('themeLyrics', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* LYRICS:                                                                                                                                                                                               ' +
	'* Top menu Options > Lyrics                                                                                                                                                                             ' +
	'* You can set and select between various lyrics settings that will be used.                                                                                                                             ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {array} Lyrics filename defaults. */
const lyricFilenamesDefaults = [
	'%title%',
	'%artist% - %title%',
	'%artist% -%title%',
	'%tracknumber% - %title%',
	'%tracknumber% - %artist% - %title%'
];

/** @type {Object} Lyrics filename config header description. */
const lyricFilenamesSchema = new ConfigurationObjectSchema('lyricFilenamePatterns', ConfigurationObjectType.Array, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* LYRICS TITLE FORMATTING:                                                                                                                                                                              ' +
	'* The title formatting defined patterns for the names of lyrics files. Do not include file extensions.                                                                                                  ' +
	'* Special characters which are not allowed in filenames (i.e. / : " etc.) will be stripped from the filenames automatically and replaced with underscores.                                              ' +
	'* Note: This setting will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                          ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


//////////////////
// * SETTINGS * //
//////////////////
/** @type {Object} Options > Settings with default values. */
const themeSettingsDefaults = {
	themeDayNightMode: false,
	customThemeFonts: false,
	customPreloaderLogo: false,
	customThemeImages: false,
	albumArtDiskCache: true,
	albumArtPreLoad: false,
	customLibraryDir: false,
	libraryAutoDelete: false,
	customBiographyDir: false,
	biographyAutoDelete: false,
	customLyricsDir: false,
	lyricsAutoDelete: false,
	customWaveformBarDir: false,
	waveformBarAutoDelete: false,
	themePerformance: 'balanced',
	devTools: false,
	disableRightClick: true
};

/** @type {Object} Options > Settings config name description. */
const themeSettingsComments = {
	themeDayNightMode: 'Values: false, or a custom string value in 24 hour time format e.g "6-18" - Options > Settings > Theme day/night mode',
	customThemeFonts: 'Values: true, false - Options > Settings > Theme fonts > Use custom theme fonts',
	customPreloaderLogo: 'Values: true, false - Options > Settings > Theme images > Use custom preloader logo',
	customThemeImages: 'Values: true, false - Options > Settings > Theme images > Use custom theme images',
	albumArtDiskCache: 'Values: true, false - Options > Settings > Theme cache > Library > Image disk cache enabled',
	albumArtPreLoad: 'Values: true, false - Options > Settings > Theme cache > Library > Preload images in disk cache',
	customLibraryDir: 'Values: true, false - Options > Settings > Theme cache > Library > Use custom library directory',
	libraryAutoDelete: 'Values: true, false - Options > Settings > Theme cache > Library > Auto-delete library cache on startup',
	customBiographyDir: 'Values: true, false - Options > Settings > Theme cache > Library > Use custom biography directory',
	biographyAutoDelete: 'Values: true, false - Options > Settings > Theme cache > Biography > Auto-delete biography cache on startup',
	customLyricsDir: 'Values: true, false - Options > Settings > Theme cache > Library > Use custom lyrics directory',
	lyricsAutoDelete: 'Values: true, false - Options > Settings > Theme cache > Lyrics > Auto-delete lyrics cache on startup',
	customWaveformBarDir: 'Values: true, false - Options > Settings > Theme cache > Waveform bar > Use custom waveform bar directory',
	waveformBarAutoDelete: 'Values: true, false - Options > Settings > Theme cache > Waveform bar > Auto-delete waveform bar cache on startup',
	themePerformance: 'Values: "lowestQuality", "lowQuality", "balanced", "highQuality", "highestQuality" - Options > Settings > Theme performance',
	devTools: 'Values: true, false - Options > Settings > Developer tools',
	disableRightClick: 'Values: true, false - Options > Settings > Disable right-click'
};

/** @type {Object} Options > Settings config header description. */
const themeSettingsSchema = new ConfigurationObjectSchema('themeSettings', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* SETTINGS:                                                                                                                                                                                             ' +
	'* Top menu Options > Settings                                                                                                                                                                           ' +
	'* You can set and select between various lyrics settings that will be used.                                                                                                                             ' +
	'* Note: These settings will be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                            ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} General settings with default values. */
const settingsDefaults = {
	artworkDisplayTime: 30,
	discArtBasename: 'cd',
	playlistCustomHeaderInfo: '',
	playlistCustomTitle: '',
	playlistCustomTitleNoHeader: '',
	playlistSortDefault: '$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortArtistDate_asc: '$if2(%artist sort order%,%album artist%) $if3(%album sort order%,%original release date%,%originaldate%,%date%) %album% %edition% %codec% %discnumber% %tracknumber%',
	playlistSortArtistDate_dsc: '$if2(%artist sort order%,%album artist%) $if3(%album sort order%,$sub(99999,%original release date%),$sub(99999,%originaldate%),$sub(99999,%date%)) %album% %edition% %codec% %discnumber% %tracknumber%',
	playlistSortAlbumTitle: '%album% $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortAlbumRating_asc: '%albumrating% $if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortAlbumRating_dsc: '$sub(99999,%albumrating%) $if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortAlbumPlaycount_asc: '%albumplaycount% $if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortAlbumPlaycount_dsc: '$sub(99999,%albumplaycount%) $if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortTrackTitle: '%title% $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortTrackNumber: '%tracknumber% $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortTrackRating_asc: '%rating% $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortTrackRating_dsc: '$sub(99999,%rating%) $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortTrackPlaycount_asc: '%play_count% $if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortTrackPlaycount_dsc: '$sub(99999,%play_count%) $if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortYear_asc: '%year% $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortYear_dsc: '$sub(99999,%year%) $if3($sub(99999,%original release date%),$sub(99999,%originaldate%),$sub(99999,%date%)) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortGenre: '%genre% %artist% %album% %edition% %codec% %discnumber% %tracknumber%',
	playlistSortLabel: '%label% %artist% %album% %edition% %codec% %discnumber% %tracknumber%',
	playlistSortCountry: '%artistcountry% %artist% %album% %edition% %codec% %discnumber% %tracknumber%',
	playlistSortFilePath: '%path_sort% $if3(%original release date%,%originaldate%,%date%) $if2(%artist sort order%,%album artist%) %edition% %codec% %discnumber% %tracknumber%',
	playlistSortCustom: '$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%',
	playlistShowBitSampleAlways: false,
	extraTrackInfo: '$ifequal(%samplerate%,44100,, |$ifgreater($info(bitspersample),16, $info(bitspersample)bit,) $div(%samplerate%,1000).$left($right(%samplerate%,3),1)kHz)[ | $replace(%replaygain_album_gain%, dB,dB)]',
	hideCursor: false,
	hidePanelBgWhenCollapsed: false,
	doubleClickRefresh: false,
	showDebugLog: false,
	showDebugThemeLog: false,
	showDebugThemeOverlay: false,
	stoppedString1: 'foobar2000',
	stoppedString1acr: 'fb2k',
	stoppedString2: '$replace(%_foobar2000_version%,foobar2000 ,)'
};

/** @type {Object} General settings config name description. */
const settingsComments = {
	artworkDisplayTime: 'Number of seconds to show each image if more than one is found and "Cycle through all artwork" option is enabled. (Min: 5, Max: 120)',
	discArtBasename: 'Do not include extension. Example: "discart", if the image provider uses that name for saving discArt and you want those filtered from showing up as albumArt. Would also filter out discart1.png, etc.',
	playlistCustomHeaderInfo: 'You can use your own custom pattern for the playlist header info',
	playlistCustomTitle: 'You can use your own custom title pattern for the playlist row',
	playlistCustomTitleNoHeader: 'You can use your own custom title pattern for the playlist row - when playlist header is not being displayed',
	playlistSortDefault: 'Options > Playlist > Sort order > Default - sort pattern to sort playlists generated from Library selections or clicking on hyperlinks in the Playlist',
	playlistSortArtistDate_asc: 'Options > Playlist > Sort order > Artist | date ascending',
	playlistSortArtistDate_dsc: 'Options > Playlist > Sort order > Artist | date descending',
	playlistSortAlbumTitle: 'Options > Playlist > Sort order > Album',
	playlistSortAlbumRating_asc: 'Options > Playlist > Sort order > Album rating | ascending',
	playlistSortAlbumRating_dsc: 'Options > Playlist > Sort order > Album rating | descending',
	playlistSortAlbumPlaycount_asc: 'Options > Playlist > Sort order > Album playcount | ascending',
	playlistSortAlbumPlaycount_dsc: 'Options > Playlist > Sort order > Album playcount | descending',
	playlistSortTrackTitle: 'Options > Playlist > Sort order > Track',
	playlistSortTrackNumber: 'Options > Playlist > Sort order > Track number',
	playlistSortTrackRating_asc: 'Options > Playlist > Sort order > Track rating | ascending',
	playlistSortTrackRating_dsc: 'Options > Playlist > Sort order > Track rating | descending',
	playlistSortTrackPlaycount_asc: 'Options > Playlist > Sort order > Track playcount | ascending',
	playlistSortTrackPlaycount_dsc: 'Options > Playlist > Sort order > Track playcount | descending',
	playlistSortYear_asc: 'Options > Playlist > Sort order > Year | ascending',
	playlistSortYear_dsc: 'Options > Playlist > Sort order > Year | descending',
	playlistSortGenre: 'Options > Playlist > Sort order > Genre',
	playlistSortLabel: 'Options > Playlist > Sort order > Label',
	playlistSortCountry: 'Options > Playlist > Sort order > Country',
	playlistSortFilePath: 'Options > Playlist > Sort order > File path',
	playlistSortCustom: 'Options > Playlist > Sort order > Custom',
	playlistShowBitSampleAlways: 'Always show the bit depth and sample rate in the playlist header.',
	extraTrackInfo: 'Portion of the trackInfo in the upper right, directly under the year. Only part of the info string is customizable',
	hideCursor: 'Hides cursor when song is playing after 10 seconds of no mouse activity',
	hidePanelBgWhenCollapsed: 'Hide panel background when playing an album and the playlist or library view is active',
	doubleClickRefresh: 'Will refresh the theme when double clicking for example on the lower bar',
	showDebugLog: 'Enables extra logging in the console. Probably not needed unless you encounter a problem or you\'re asked to enable it.',
	showDebugThemeLog: 'Logs the output of the algorithm which determines the primary theme color.',
	showDebugThemeOverlay: 'Displays various theme debug logs on the album art as an overlay.',
	stoppedString1: 'The bolded portion of text shown above the progress bar when nothing is playing',
	stoppedString2: 'The second (non-bold) portion of text shown above the progress bar when nothing is playing'
};

/** @type {Object} General settings config header description. */
const settingsSchema = new ConfigurationObjectSchema('settings', ConfigurationObjectType.Object, /* Will display as key/val pairs with comments attached. */ undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* GENERAL SETTINGS:                                                                                                                                                                                     ' +
	'* These settings are not in the top menu options.                                                                                                                                                       ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////////////////////////////
// ! GEORGIA-REBORN-CUSTOM DEFAULTS ! //
////////////////////////////////////////


//////////////////////////////////
// * CUSTOM LIBRARY DIRECTORY * //
//////////////////////////////////
/** @type {array} Custom library cache directory. */
const customLibraryDirDefaults = [
	'C:\\Replace_this_path_to_your_new_library\\Directory\\'
];

/** @type {Object} Custom library cache directory config header description. */
const customLibraryDirSchema = new ConfigurationObjectSchema('customLibraryDir', ConfigurationObjectType.Array, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM LIBRARY DIRECTORY:                                                                                                                                                                             ' +
	'* You can set your own custom library directory.                                                                                                                                                        ' +
	'* Replace the path below and activate in top menu Options > Settings > Theme cache > Library > Use custom library directory. Restart foobar to take effect.                                             ' +
	'* Note: This setting will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                          ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////////////////////////
// * CUSTOM BIOGRAPHY DIRECTORY * //
////////////////////////////////////
/** @type {array} Custom biography cache directory. */
const customBiographyDirDefaults = [
	'C:\\Replace_this_path_to_your_new_biography\\Directory\\'
];

/** @type {Object} Custom biography cache directory config header description. */
const customBiographyDirSchema = new ConfigurationObjectSchema('customBiographyDir', ConfigurationObjectType.Array, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM BIOGRAPHY DIRECTORY:                                                                                                                                                                           ' +
	'* You can set your own custom biography directory.                                                                                                                                                      ' +
	'* Replace the path below and activate in top menu Options > Settings > Theme cache > Library > Use custom biography directory. Restart foobar to take effect.                                           ' +
	'* Note: This setting will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                          ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////////////////////
// * CUSTOM LYRICS DIRECTORY * //
/////////////////////////////////
/** @type {array} Custom lyrics cache directory. */
const customLyricsDirDefaults = [
	'C:\\Replace_this_path_to_your_new_lyrics\\Directory\\'
];

/** @type {Object} Custom lyrics cache directory config header description. */
const customLyricsDirSchema = new ConfigurationObjectSchema('customLyricsDir', ConfigurationObjectType.Array, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM LYRICS DIRECTORY:                                                                                                                                                                              ' +
	'* You can set your own custom lyric directory.                                                                                                                                                          ' +
	'* Change in foobar\'s Preferences > ESLyric > Lyric options > Location to your custom lyric folder and replace the path below.                                                                          ' +
	'* Activate in top menu Options > Settings > Theme cache > Lyrics > Use custom lyrics directory. Restart foobar to take effect.                                                                          ' +
	'* Note: This setting will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                          ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


///////////////////////////////////////
// * CUSTOM WAVEFORM BAR DIRECTORY * //
///////////////////////////////////////
/** @type {array} Custom waveform bar cache directory. */
const customWaveformBarDirDefaults = [
	'C:\\Replace_this_path_to_your_new_waveform\\Directory\\'
];

/** @type {Object} Custom waveform bar cache directory config header description. */
const customWaveformBarDirSchema = new ConfigurationObjectSchema('customWaveformBarDir', ConfigurationObjectType.Array, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM WAVEFORM BAR DIRECTORY:                                                                                                                                                                        ' +
	'* You can set your own custom waveform bar directory.                                                                                                                                                   ' +
	'* Replace the path below and activate in top menu Options > Settings > Theme cache > Waveform bar > Use custom waveform bar directory. Restart foobar to take effect.                                   ' +
	'* Note: This setting will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                          ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


////////////////////////////
// * CUSTOM THEME FONTS * //
////////////////////////////
/** @type {Object} Custom fonts with default Open Sans type. */
const customFontsDefaults = {
	fontDefault: 'Open Sans',
	fontTopMenu: 'Open Sans SemiBold',
	fontLowerBarArtist: 'Open Sans SemiBold',
	fontLowerBarTitle: 'Open Sans',
	fontLowerBarDisc: 'Open Sans',
	fontLowerBarTime: 'Open Sans SemiBold',
	fontLowerBarLength: 'Open Sans',
	fontLowerBarWave: 'Open Sans SemiBold',
	fontNotification: 'Open Sans',
	fontPopup: 'Open Sans',
	fontTooltip: 'Open Sans',
	fontGridArtist: 'Open Sans',
	fontGridTitle: 'Open Sans',
	fontGridTitleBold: 'Open Sans SemiBold',
	fontGridAlbum: 'Open Sans',
	fontGridKey: 'Open Sans SemiBold',
	fontGridValue: 'Open Sans',
	playlistTitleNormal: 'Open Sans',
	playlistTitleSelected: 'Open Sans',
	playlistTitlePlaying: 'Open Sans SemiBold',
	playlistArtistNormal: 'Open Sans',
	playlistArtistPlaying: 'Open Sans',
	playlistArtistNormalCompact: 'Open Sans SemiBold',
	playlistArtistPlayingCompact: 'Open Sans SemiBold',
	playlistAlbum: 'Open Sans SemiBold',
	playlistDate: 'Open Sans SemiBold',
	playlistDateCompact: 'Open Sans',
	playlistInfo: 'Open Sans',
	playlistCover: 'Open Sans',
	playlistPlaycount: 'Open Sans',
	fontLibrary: 'Open Sans',
	fontBiography: 'Open Sans',
	fontLyrics: 'Open Sans'
};

/** @type {Object} Custom fonts config name description. */
const customFontsComments = {
	fontDefault: 'Default font: Segoe UI - panel font used as default and panel related elements in Playlist, Library, Biography',
	fontTopMenu: 'Default font: Segoe UI Semibold - theme font used for top menu buttons',
	fontLowerBarArtist: 'Default font: HelveticaNeueLT Pro 65 Md - theme artist font used in lower bar',
	fontLowerBarTitle: 'Default font: HelveticaNeueLT Pro 45 Lt - theme title font used in lower bar',
	fontLowerBarDisc: 'Default font: HelveticaNeueLT Pro 45 Lt - theme disc font used in lower bar',
	fontLowerBarTime: 'Default font: HelveticaNeueLT Pro 65 Md - theme time font used in lower bar',
	fontLowerBarLength: 'Default font: HelveticaNeueLT Pro 45 Lt - theme length font used in lower bar',
	fontLowerBarWave: 'Default font: HelveticaNeueLT Pro 65 Md - theme waveform bar font used in lower bar',
	fontNotification: 'Default font: HelveticaNeueLT Pro 65 Md - theme notification font used in jump search and style indicator',
	fontPopup: 'Default font: Segoe UI - theme popup font used in custom theme menu and theme log overlay',
	fontTooltip: 'Default font: HelveticaNeueLT Pro 65 Md - theme tooltip font used in styled tooltips',
	fontGridArtist: 'Default font: HelveticaNeueLT Pro 65 Md - theme artist font used in metadata grid ( Details )',
	fontGridTitle: 'Default font: HelveticaNeueLT Pro 45 Lt - theme title font used in metadata grid ( Details )',
	fontGridTitleBold: 'Default font: HelveticaNeueLT Pro 65 Md - theme title bold font used in metadata grid ( Details )',
	fontGridAlbum: 'Default font: HelveticaNeueLT Pro 65 Md - theme album font used in metadata grid ( Details )',
	fontGridKey: 'Default font: HelveticaNeueLT Pro 55 Roman - theme key font used in metadata grid ( Details )',
	fontGridValue: 'Default font: HelveticaNeueLT Pro 45 Lt - theme value font used in metadata grid ( Details )',
	playlistTitleNormal: 'Default font: Segoe UI - playlist title font used in rows, normal state',
	playlistTitleSelected: 'Default font: Segoe UI - playlist title font used in rows, selected state',
	playlistTitlePlaying: 'Default font: Segoe UI - playlist title font used in rows, playing state',
	playlistArtistNormal: 'Default font: Segoe UI Semibold - playlist artist font used in headers, normal state',
	playlistArtistPlaying: 'Default font: Segoe UI Semibold - playlist artist font used in headers, playing state',
	playlistArtistNormalCompact: 'Default font: Segoe UI Semibold - playlist artist font for compact mode used in headers, normal state',
	playlistArtistPlayingCompact: 'Default font: Segoe UI Semibold - playlist artist font for compact mode used in headers, playing state',
	playlistAlbum: 'Default font: Segoe UI Semibold - playlist album font used in headers',
	playlistDate: 'Default font: Segoe UI Semibold - playlist date font used in headers',
	playlistDateCompact: 'Default font: Segoe UI Semibold - playlist date font for compact mode used in headers',
	playlistInfo: 'Default font: Segoe UI - playlist info font used in headers',
	playlistCover: 'Default font: Segoe UI Semibold - playlist cover font used in thumbnails',
	playlistPlaycount: 'Default font: Segoe UI - playlist playcount font used in rows',
	fontLibrary: 'Default font: Segoe UI - library font',
	fontBiography: 'Default font: Segoe UI - biography font',
	fontLyrics: 'Default font: Segoe UI - lyrics font'
};

/** @type {Object} Custom fonts config header description. */
const customFontsSchema = new ConfigurationObjectSchema('customFont', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME FONTS:                                                                                                                                                                                   ' +
	'* Top menu Options > Settings > Theme fonts > Use custom theme fonts                                                                                                                                    ' +
	'* Here you can set your own custom fonts if top menu Options > Settings > Theme fonts > Use custom theme fonts was activated.                                                                           ' +
	'* If you change the Open Sans placeholder, it needs to be the exact name of the font name/family.                                                                                                       ' +
	'* Note: If you mix different fonts all together, there will be issues with Y-alignment because fonts have different line heights than others.                                                           ' +
	'* For example, if you want to use more than one font in the lower bar, the fonts need to have the same line height.                                                                                     ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////////////////
// * CUSTOM STYLE PRESET * //
/////////////////////////////
/** @type {Object} Custom style preset with default values. */
const customStylePresetDefaults = {
	theme: 'white',
	nighttime: false,
	bevel: false,
	blend: false,
	blend2: false,
	gradient: false,
	gradient2: false,
	alternative: false,
	alternative2: false,
	blackAndWhite: false,
	blackAndWhite2: false,
	blackAndWhiteReborn: false,
	blackReborn: false,
	rebornWhite: false,
	rebornBlack: false,
	randomPastel: false,
	randomDark: false,
	randomAutoColor: 'off',
	topMenuButtons: 'default',
	transportButtons: 'default',
	progressBarDesign: 'default',
	progressBar: 'default',
	progressBarFill: 'default',
	volumeBarDesign: 'default',
	volumeBar: 'default',
	volumeBarFill: 'default',
	themeBrightness: 'default'
};

/** @type {Object} Custom style preset config name description. */
const customStylePresetComments = {
	theme: 'Values: "white", "black", "reborn", "random", "blue", "darkblue", "red", "cream", "nblue", "ngreen", "nred", "ngold"',
	nighttime: 'Values: true, false - special style can only be used with reborn, random, custom theme',
	bevel: 'Values: true, false - can be used in all themes',
	blend: 'Values: true, false - can be used in all themes',
	blend2: 'Values: true, false - can be used in all themes',
	gradient: 'Values: true, false - can only be used with reborn, random, blue, darkblue, red theme',
	gradient2: 'Values: true, false - can only be used with reborn, random, blue, darkblue, red theme',
	alternative: 'Values: true, false - can be used in all themes but not with special styles',
	alternative2: 'Values: true, false - can be used in all themes but not with special styles',
	blackAndWhite: 'Values: true, false - special white style can only be used with white theme',
	blackAndWhite2: 'Values: true, false - special white style can only be used with white theme',
	blackAndWhiteReborn: 'Values: true, false - special white style can only be used with white theme',
	blackReborn: 'Values: true, false - special black style can only be used with black theme',
	rebornWhite: 'Values: true, false - special reborn style can only be used with reborn theme',
	rebornBlack: 'Values: true, false - special reborn style can only be used with reborn theme',
	randomPastel: 'Values: true, false - special random style can only be used with random theme',
	randomDark: 'Values: true, false - special random style can only be used with random theme',
	randomAutoColor: 'Values: "off", 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, "track", - can only be used with random theme',
	topMenuButtons: 'Values: "default", "filled", "bevel", "inner", "emboss", "minimal"',
	transportButtons: 'Values: "default", "bevel", "inner", "emboss", "minimal"',
	progressBarDesign: 'Values: "default", "rounded", "lines", "blocks", "dots", "thin"',
	progressBar: 'Values: "default", "bevel", "inner"',
	progressBarFill: 'Values: "default", "bevel", "inner", "blend"',
	volumeBarDesign: 'Values: "default", "rounded"',
	volumeBar: 'Values: "default", "bevel", "inner"',
	volumeBarFill: 'Values: "default", "bevel", "inner"',
	themeBrightness: 'Values: -50, -40, -30, -25, -20, -15, -10, -5, "default", 5, 10, 15, 20, 25, 30, 40, 50'
};

/** @type {Object} Custom style preset config header description. */
const customStylePresetSchema = new ConfigurationObjectSchema('customStylePreset', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM STYLE PRESET:                                                                                                                                                                                  ' +
	'* Top menu Options > Preset > User preset > User settings                                                                                                                                               ' +
	'* You can set your own custom style preset if top menu Options > Preset > User preset > User settings is selected.                                                                                      ' +
	'* First you need to set only one theme in theme: and set the theme to true, all other themes need to be set to false.                                                                                   ' +
	'* Second, only one style per column can be set, see top menu Options > Style. For example, only Blend or Blend 2 can be active at the same time.                                                        ' +
	'* It is the same for Alternative or Alternative 2 or if this particular column has an additional special style, see comment in styles section.                                                          ' +
	'* Best practice would be to first set each style in top menu Options > Style, note these styles and modify them in the config here.                                                                     ' +
	'* If something goes wrong, you can reset your theme settings in top menu Options > Settings > Theme configuration > Reset all                                                                           ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


/////////////////////////////////////
// * CUSTOM DISC ART PLACEHOLDER * //
/////////////////////////////////////
/** @type {Object} Custom disc art placeholder with default values. */
const customDiscArtStubDefaults = {
	cdName01: 'Custom CD - Name 01',
	cdStub01: 'cd-custom01.png',
	cdName02: 'Custom CD - Name 02',
	cdStub02: '',
	cdName03: 'Custom CD - Name 03',
	cdStub03: '',
	cdName04: 'Custom CD - Name 04',
	cdStub04: '',
	cdName05: 'Custom CD - Name 05',
	cdStub05: '',
	vinylName01: 'Custom Vinyl - Name 01',
	vinylStub01: 'vinyl-custom01.png',
	vinylName02: 'Custom Vinyl - Name 02',
	vinylStub02: '',
	vinylName03: 'Custom Vinyl - Name 03',
	vinylStub03: '',
	vinylName04: 'Custom Vinyl - Name 04',
	vinylStub04: '',
	vinylName05: 'Custom Vinyl - Name 05',
	vinylStub05: ''
};

/** @type {Object} Custom disc art placeholder config name description. */
const customDiscArtStubComments = {
	cdName01: 'Value: the name of the first CD placeholder, e.g. Custom CD - Name 01',
	cdStub01: 'Value: the filename of the first CD placeholder, e.g. cd-custom01.png',
	cdName02: 'Value: the name of the second CD placeholder, e.g. Custom CD - Name 02',
	cdStub02: 'Value: the filename of the second CD placeholder, e.g. cd-custom02.png',
	cdName03: 'Value: the name of the third CD placeholder, e.g. Custom CD - Name 03',
	cdStub03: 'Value: the filename of the third CD placeholder, e.g. cd-custom03.png',
	cdName04: 'Value: the name of the fourth CD placeholder, e.g. Custom CD - Name 04',
	cdStub04: 'Value: the filename of the fourth CD placeholder, e.g. cd-custom04.png',
	cdName05: 'Value: the name of the fifth CD placeholder, e.g. Custom CD - Name 05',
	cdStub05: 'Value: the filename of the fifth CD placeholder, e.g. cd-custom05.png',
	vinylName01: 'Value: the name of the first vinyl placeholder, e.g. Custom vinyl - Name 01',
	vinylStub01: 'Value: the filename of the first vinyl placeholder, e.g. vinyl-custom01.png',
	vinylName02: 'Value: the name of the second vinyl placeholder, e.g. Custom vinyl - Name 02',
	vinylStub02: 'Value: the filename of the second vinyl placeholder, e.g. vinyl-custom02.png',
	vinylName03: 'Value: the name of the third vinyl placeholder, e.g. Custom vinyl - Name 03',
	vinylStub03: 'Value: the filename of the third vinyl placeholder, e.g. vinyl-custom03.png',
	vinylName04: 'Value: the name of the fourth vinyl placeholder, e.g. Custom vinyl - Name 04',
	vinylStub04: 'Value: the filename of the fourth vinyl placeholder, e.g. vinyl-custom04.png',
	vinylName05: 'Value: the name of the fifth vinyl placeholder, e.g. Custom vinyl - Name 05',
	vinylStub05: 'Value: the filename of the fifth vinyl placeholder, e.g. vinyl-custom05.png'
};

/** @type {Object} Custom disc art placeholder config header description. */
const customDiscArtStubSchema = new ConfigurationObjectSchema('customDiscArtStub', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM DISC ART PLACEHOLDER:                                                                                                                                                                          ' +
	'* Top menu Options > Details > Disc art > Disc art placeholder                                                                                                                                          ' +
	'* You can add your own custom CD and Vinyl placeholders that will be dynamically appended to the disc art placeholder menu.                                                                             ' +
	'* It is recommended to use the predefined prefix naming convention for CD and Vinyl placeholders, such as "Custom CD - YourName" or "Custom Vinyl - YourName".                                          ' +
	'* The filenames must end with .png, for example, "cd-custom01.png" or "vinyl-custom01.png".                                                                                                             ' +
	'* If the placeholders cdStub02, cdStub03, cdStub04, cdStub05, vinylStub02, vinylStub03, vinylStub04, vinylStub05 etc, do not have any filename values, they will not be added to the menu.              ' +
	'* The custom disc art placeholders are located in the directory "georgia-reborn/images/custom/discart".                                                                                                 ' +
	'* Note: These settings will NOT be automatically set if you use top menu Options > Settings > Theme configuration > Save settings to config file                                                        ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');


//////////////////////
// * CUSTOM THEME * //
//////////////////////
/** @type {Object} Custom theme with default HEX color values. */
const customThemeDefaults = {
	name: '',

	//////////////////////////
	// * PRELOADER COLORS * //
	//////////////////////////

	preloaderBg: '372355',
	preloaderLogo: 'violet-play-logo.png',
	preloaderLowerBarTitle: 'ffffff',
	preloaderProgressBar: '412d64',
	preloaderProgressBarFill: 'ebc841',
	preloaderProgressBarFrame: '372355',
	preloaderUIHacksFrame: '372355',

	/////////////////////////
	// * PLAYLIST COLORS * //
	/////////////////////////

	// * MAIN COLORS * //
	g_pl_colors_bg: '321946',

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors_plman_text_normal: 'd2d2d2',
	g_pl_colors_plman_text_hovered: 'ffffff',
	g_pl_colors_plman_text_pressed: '3cfaa0',

	// * HEADER COLORS * //
	g_pl_colors_header_nowplaying_bg: '372355',
	g_pl_colors_header_sideMarker: '3cfaa0',
	g_pl_colors_header_artist_normal: 'd2d2d2',
	g_pl_colors_header_artist_playing: '3cfaa0',
	g_pl_colors_header_album_normal: 'd2d2d2',
	g_pl_colors_header_album_playing: 'ffffff',
	g_pl_colors_header_info_normal: 'd2d2d2',
	g_pl_colors_header_info_playing: 'ffffff',
	g_pl_colors_header_date_normal: 'd2d2d2',
	g_pl_colors_header_date_playing: '3cfaa0',
	g_pl_colors_header_line_normal: '503782',
	g_pl_colors_header_line_playing: '6450b4',

	// * ROW COLORS * //
	g_pl_colors_row_nowplaying_bg: '372355',
	g_pl_colors_row_stripes_bg: '372355',
	g_pl_colors_row_selection_frame: '503782',
	g_pl_colors_row_sideMarker: '3cfaa0',
	g_pl_colors_row_title_normal: 'd2d2d2',
	g_pl_colors_row_title_playing: 'ffffff',
	g_pl_colors_row_title_selected: '3cfaa0',
	g_pl_colors_row_title_hovered: 'ffffff',
	g_pl_colors_row_rating_color: 'ebc841',
	g_pl_colors_row_disc_subheader_line: '503782',
	g_pl_colors_row_drag_line: '6450b4',
	g_pl_colors_row_drag_line_reached: '3cfaa0',

	// * SCROLLBAR COLORS * //
	g_pl_colors_sbar_btn_normal: 'd2d2d2',
	g_pl_colors_sbar_btn_hovered: 'ebc841',
	g_pl_colors_sbar_thumb_normal: '412d64',
	g_pl_colors_sbar_thumb_hovered: 'ebc841',
	g_pl_colors_sbar_thumb_drag: '3cfaa0',

	////////////////////////
	// * LIBRARY COLORS * //
	////////////////////////

	// * MAIN COLORS * //
	ui_col_bg: '321946',
	ui_col_rowStripes: '372355',

	// * ROW COLORS * //
	ui_col_nowPlayingBg: '372350',
	ui_col_sideMarker: '3cfaa0',
	ui_col_selectionFrame: '503782',
	ui_col_selectionFrame2: '503782',
	ui_col_hoverFrame: '503782',

	// * NODE COLORS * //
	ui_col_iconPlus: 'ebc841',
	ui_col_iconPlus_h: '3cfaa0',
	ui_col_iconPlus_sel: '3cfaa0',
	ui_col_iconPlusBg: '372355',
	ui_col_iconMinus_e: 'ebc841',
	ui_col_iconMinus_c: 'ebc841',
	ui_col_iconMinus_h: 'ebc841',

	// * TEXT COLORS * //
	ui_col_text: 'd2d2d2',
	ui_col_text_h: 'ffffff',
	ui_col_text_nowp: 'ffffff',
	ui_col_textSel: '3cfaa0',
	ui_col_txt: 'd2d2d2',
	ui_col_txt_h: 'ffffff',
	ui_col_txt_box: 'ffffff',
	ui_col_search: 'ffffff',

	// * BUTTON COLORS * //
	ui_col_searchBtn: 'ffffff',
	ui_col_crossBtn: 'ffffff',
	ui_col_filterBtn: 'ffffff',
	ui_col_settingsBtn: 'ffffff',
	ui_col_line: '503782',
	ui_col_s_line: '503782',

	// * SCROLLBAR COLORS * //
	ui_col_sbarBtns: 'd2d2d2',
	ui_col_sbarNormal: '504673',
	ui_col_sbarHovered: 'ebc841',
	ui_col_sbarDrag: '3cfaa0',

	//////////////////////////
	// * BIOGRAPHY COLORS * //
	//////////////////////////

	// * MAIN COLORS * //
	uiBio_col_bg: '321946',
	uiBio_col_rowStripes: '372350',

	// * HEADER COLORS * //
	uiBio_col_headingText: 'ffffff',
	uiBio_col_bottomLine: '503782',
	uiBio_col_centerLine: '503782',
	uiBio_col_sectionLine: '503782',

	// * TEXT COLORS * //
	uiBio_col_accent: 'ebc841',
	uiBio_col_source: 'd2d2d2',
	uiBio_col_summary: 'd2d2d2',
	uiBio_col_text: 'd2d2d2',

	// * MISC COLORS * //
	uiBio_col_lyricsNormal: 'd2d2d2',
	uiBio_col_lyricsHighlight: 'ebc841',
	uiBio_col_noPhotoStubBg: '372355',
	uiBio_col_noPhotoStubText: '3cfaa0',

	// * SCROLLBAR COLORS * //
	uiBio_col_sbarBtns: 'd2d2d2',
	uiBio_col_sbarNormal: '504673',
	uiBio_col_sbarHovered: 'ebc841',
	uiBio_col_sbarDrag: '3cfaa0',

	/////////////////////
	// * MAIN COLORS * //
	/////////////////////

	// * MAIN COLORS * //
	col_bg: '372355',
	col_shadow: '000000',
	col_discArtShadow: '000000',
	col_noAlbumArtStub: '3cfaa0',
	col_lowerBarArtist: '3cfaa0',
	col_lowerBarTitle: 'ffffff',
	col_lowerBarTime: 'ffffff',
	col_lowerBarLength: 'ffffff',
	col_lyricsNormal: 'ffffff',
	col_lyricsHighlight: 'ebc841',
	col_lyricsShadow: '000000',

	// * DETAILS * //
	col_detailsBg: '321946',
	col_detailsText: 'd2d2d2',
	col_detailsRating: 'ebc841',
	col_timelineAdded: '3cfaa0',
	col_timelinePlayed: '32d287',
	col_timelineUnplayed: '28aa6e',
	col_timelineFrame: '321946',

	// * POPUP COLORS * //
	col_popupBg: '372355',
	col_popupText: 'd2d2d2',

	// * TOP MENU BUTTON COLORS * //
	col_menuBgColor: '503782',
	col_menuStyleBg: '372355',
	col_menuRectStyleEmbossTop: '6450b4',
	col_menuRectStyleEmbossBottom: '151515',
	col_menuRectNormal: '6450b4',
	col_menuRectHovered: '6450b4',
	col_menuRectDown: '6450b4',
	col_menuTextNormal: 'ffffff',
	col_menuTextHovered: 'ebc841',
	col_menuTextDown: '3cfaa0',

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col_transportEllipseBg: '503782',
	col_transportEllipseNormal: '503c8c',
	col_transportEllipseHovered: '6450b4',
	col_transportEllipseDown: '6450b4',
	col_transportStyleBg: '372355',
	col_transportStyleTop: '503c8c',
	col_transportStyleBottom: '151515',
	col_transportIconNormal: '3cfaa0',
	col_transportIconHovered: 'ebc841',
	col_transportIconDown: '3cfaa0',

	// * PROGRESS BAR COLORS * //
	col_progressBar: '412d64',
	col_progressBarStreaming: 'cf0005',
	col_progressBarFrame: '372355',
	col_progressBarFill: 'ebc841',

	// * PEAKMETER BAR COLORS * //
	col_peakmeterBarProg: '412d64',
	col_peakmeterBarProgFill: 'ebc841',
	col_peakmeterBarFillTop: '3cfaa0',
	col_peakmeterBarFillMiddle: '32d287',
	col_peakmeterBarFillBack: '28aa6e',
	col_peakmeterBarVertProgFill: 'ebc841',
	col_peakmeterBarVertFill: 'ebc841',
	col_peakmeterBarVertFillPeaks: 'fff0af',

	// * WAVEFORM BAR COLORS * //
	col_waveformBarFillFront: 'ebc841',
	col_waveformBarFillBack: 'b99b32',
	col_waveformBarFillPreFront: '7d55cd',
	col_waveformBarFillPreBack: '5f419b',
	col_waveformBarIndicator: '3cfaa0',

	// * VOLUME BAR COLORS * //
	col_volumeBar: '412d64',
	col_volumeBarFrame: '372355',
	col_volumeBarFill: '3cfaa0',

	// * STYLE COLORS * //
	col_styleBevel: '1e0f2d',
	col_styleGradient: '1e1428',
	col_styleGradient2: '5a003c',
	col_styleProgressBar: '372355',
	col_styleProgressBarLineTop: '321946',
	col_styleProgressBarLineBottom: '503782',
	col_styleProgressBarFill: '8c6914',
	col_styleVolumeBar: '372355',
	col_styleVolumeBarFill: '19826e'
};

/** @type {Object} Custom theme config name description. */
const customThemeComments = {
	name: 'Custom theme name will be displayed in the options theme menu',

	//////////////////////////
	// * PRELOADER COLORS * //
	//////////////////////////

	preloaderBg: 'Preloader background color. If this value is empty, the default color will be used',
	preloaderLogo: 'Preloader logo must end with .png, for example, logo.png. If this value is empty, the default logo will be used',
	preloaderLowerBarTitle: 'Preloader lower bar title color. If this value is empty, the default color will be used',
	preloaderProgressBar: 'Preloader progress bar color. If this value is empty, the default color will be used',
	preloaderProgressBarFill: 'Preloader progress bar fill color. If this value is empty, the default color will be used',
	preloaderProgressBarFrame: 'Preloader progress bar frame color. If this value is empty, the default color will be used',
	preloaderUIHacksFrame: 'Preloader UIHacks frame color. Should have the same color as preloaderBg. If this value is empty, the default color will be used',

	/////////////////////////
	// * PLAYLIST COLORS * //
	/////////////////////////

	// * MAIN COLORS * //
	g_pl_colors_bg: 'Playlist main background color',

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors_plman_text_normal: 'Playlist manager text color in normal state',
	g_pl_colors_plman_text_hovered: 'Playlist manager text color in hovered state',
	g_pl_colors_plman_text_pressed: 'Playlist manager text color in pressed state',

	// * HEADER COLORS * //
	g_pl_colors_header_nowplaying_bg: 'Playlist header nowplaying bg color',
	g_pl_colors_header_sideMarker: 'Playlist header side marker color',
	g_pl_colors_header_artist_normal: 'Playlist header artist text color in normal state',
	g_pl_colors_header_artist_playing: 'Playlist header artist text color in playing state',
	g_pl_colors_header_album_normal: 'Playlist header album text color in normal state',
	g_pl_colors_header_album_playing: 'Playlist header album text color in playing state',
	g_pl_colors_header_info_normal: 'Playlist header info text color in normal state',
	g_pl_colors_header_info_playing: 'Playlist header info text color in playing state',
	g_pl_colors_header_date_normal: 'Playlist header date text color in normal state',
	g_pl_colors_header_date_playing: 'Playlist header date text color in playing state',
	g_pl_colors_header_line_normal: 'Playlist header line color in normal state',
	g_pl_colors_header_line_playing: 'Playlist header line color in playing state',

	// * ROW COLORS * //
	g_pl_colors_row_nowplaying_bg: 'Playlist row nowplaying bg color',
	g_pl_colors_row_stripes_bg: 'Playlist row alternate bg color',
	g_pl_colors_row_selection_frame: 'Playlist row selection frame color',
	g_pl_colors_row_sideMarker: 'Playlist row side marker color',
	g_pl_colors_row_title_normal: 'Playlist row title text color in normal state',
	g_pl_colors_row_title_playing: 'Playlist row title text color in playing state',
	g_pl_colors_row_title_selected: 'Playlist row title text color in selected state',
	g_pl_colors_row_title_hovered: 'Playlist row title text color in hovered state',
	g_pl_colors_row_rating_color: 'Playlist row rating color',
	g_pl_colors_row_disc_subheader_line: 'Playlist row disc sub header line color',
	g_pl_colors_row_drag_line: 'Playlist track reorder drag line color',
	g_pl_colors_row_drag_line_reached: 'Playlist track reorder reached drag line color',

	// * SCROLLBAR COLORS * //
	g_pl_colors_sbar_btn_normal: 'Playlist scrollbar button color in normal state',
	g_pl_colors_sbar_btn_hovered: 'Playlist scrollbar button color in hovered state',
	g_pl_colors_sbar_thumb_normal: 'Playlist scrollbar thumb color in normal state',
	g_pl_colors_sbar_thumb_hovered: 'Playlist scrollbar thumb color in hovered state',
	g_pl_colors_sbar_thumb_drag: 'Playlist scrollbar thumb color in dragged state',

	////////////////////////
	// * LIBRARY COLORS * //
	////////////////////////

	// * MAIN COLORS * //
	ui_col_bg: 'Library main background color',
	ui_col_rowStripes: 'Library row stripes background color',

	// * ROW COLORS * //
	ui_col_nowPlayingBg: 'Library row now playing bg color',
	ui_col_sideMarker: 'Library row side marker color',
	ui_col_selectionFrame: 'Library row selection frame color',
	ui_col_selectionFrame2: 'Library row selection frame color 2',
	ui_col_hoverFrame: 'Library row hover frame color',

	// * NODE COLORS * //
	ui_col_iconPlus: 'Library tree plus node icon color',
	ui_col_iconPlus_h: 'Library tree plus node icon color in hovered state',
	ui_col_iconPlus_sel: 'Library tree plus node icon color in selected state',
	ui_col_iconPlusBg: 'Library tree plus node icon background color for traditional tree',
	ui_col_iconMinus_e: 'Library tree minus node icon color in expanded state for traditional tree',
	ui_col_iconMinus_c: 'Library tree minus node icon color in collapsed state for traditional tree',
	ui_col_iconMinus_h: 'Library tree minus node icon color in hovered state for traditional tree',

	// * TEXT COLORS * //
	ui_col_text: 'Library row text color',
	ui_col_text_h: 'Library row text color in hovered state',
	ui_col_text_nowp: 'Library row now playing text color',
	ui_col_textSel: 'Library row text color in selected state',
	ui_col_txt: 'Library user interface text color',
	ui_col_txt_h: 'Library user interface text color in hovered state',
	ui_col_txt_box: 'Library user interface text box color',
	ui_col_search: 'Library search text color',

	// * BUTTON COLORS * //
	ui_col_searchBtn: 'Library search button color',
	ui_col_crossBtn: 'Library cross button color',
	ui_col_filterBtn: 'Library filter button color',
	ui_col_settingsBtn: 'Library settings button color',
	ui_col_line: 'Library line color',
	ui_col_s_line: 'Library line color when selected',

	// * SCROLLBAR COLORS, ALSO LINKED WITH BIOGRAPHY SCROLLBAR COLORS * //
	ui_col_sbarBtns: 'Library scrollbar button color',
	ui_col_sbarNormal: 'Library scrollbar normal color',
	ui_col_sbarHovered: 'Library scrollbar hovered color',
	ui_col_sbarDrag: 'Library scrollbar drag color',

	//////////////////////////
	// * BIOGRAPHY COLORS * //
	//////////////////////////

	// * MAIN COLORS * //
	uiBio_col_bg: 'Biography main background color',
	uiBio_col_rowStripes: 'Biography row stripes background color',

	// * HEADER COLORS * //
	uiBio_col_headingText: 'Biography header text color',
	uiBio_col_bottomLine: 'Biography header bottom line color',
	uiBio_col_centerLine: 'Biography header center line color',
	uiBio_col_sectionLine: 'Biography header section line color',

	// * TEXT COLORS * //
	uiBio_col_source: 'Biography source text color',
	uiBio_col_accent: 'Biography accent text color (used in item properties)',
	uiBio_col_summary: 'Biography summary text color',
	uiBio_col_text: 'Biography text color',

	// * MISC COLORS * //
	uiBio_col_lyricsNormal: 'Biography lyrics normal color',
	uiBio_col_lyricsHighlight: 'Biography lyrics highlight color',
	uiBio_col_noPhotoStubBg: 'Biography no photo stub background color',
	uiBio_col_noPhotoStubText: 'Biography no photo stub text color',

	// * SCROLLBAR COLORS * //
	uiBio_col_sbarBtns: 'Biography scrollbar button color',
	uiBio_col_sbarNormal: 'Biography scrollbar thumb normal color',
	uiBio_col_sbarHovered: 'Biography scrollbar thumb hovered color',
	uiBio_col_sbarDrag: 'Biography scrollbar thumb drag color',

	/////////////////////
	// * MAIN COLORS * //
	/////////////////////

	// * MAIN COLORS * //
	col_bg: 'Main background color',
	col_shadow: 'Panel shadow color',
	col_discArtShadow: 'Disc art shadow color',
	col_noAlbumArtStub: 'No album art stub color',
	col_lowerBarArtist: 'Lower bar artist text color',
	col_lowerBarTitle: 'Lower bar title text color',
	col_lowerBarTime: 'Lower bar playback time text color',
	col_lowerBarLength: 'Lower bar playback length text color',
	col_lyricsNormal: 'Lyrics normal color',
	col_lyricsHighlight: 'Lyrics highlight color',
	col_lyricsShadow: 'Lyrics shadow color',

	// * DETAILS * //
	col_detailsBg: 'Details background color',
	col_detailsText: 'Details text color',
	col_detailsRating: 'Details rating color',
	col_timelineAdded: 'Details timeline added color',
	col_timelinePlayed: 'Details timeline played color',
	col_timelineUnplayed: 'Details timeline unplayed color',
	col_timelineFrame: 'Details timeline frame color',

	// * POPUP COLORS * //
	col_popupBg: 'Popup background color',
	col_popupText: 'Popup text color',

	// * TOP MENU BUTTON COLORS * //
	col_menuBgColor: 'Top menu background color',
	col_menuStyleBg: 'Top menu style background color',
	col_menuRectStyleEmbossTop: 'Top menu rectangle style emboss top color',
	col_menuRectStyleEmbossBottom: 'Top menu rectangle style emboss bottom color',
	col_menuRectNormal:	'Top menu rectangle color',
	col_menuRectHovered: 'Top menu rectangle color when hovered',
	col_menuRectDown: 'Top menu rectangle color when down',
	col_menuTextNormal: 'Top menu text color',
	col_menuTextHovered: 'Top menu text color when hovered',
	col_menuTextDown: 'Top menu text color when down',

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col_transportEllipseBg: 'Lower bar transport ellipse background color',
	col_transportEllipseNormal: 'Lower bar transport ellipse color',
	col_transportEllipseHovered: 'Lower bar transport ellipse color when hovered',
	col_transportEllipseDown: 'Lower bar transport ellipse color when down',
	col_transportStyleBg: 'Lower bar transport style background color',
	col_transportStyleTop: 'Lower bar transport style top color',
	col_transportStyleBottom: 'Lower bar transport style bottom color',
	col_transportIconNormal: 'Lower bar transport icon color',
	col_transportIconHovered: 'Lower bar transport icon color when hovered',
	col_transportIconDown: 'Lower bar transport icon color when down',

	// * PROGRESS BAR COLORS * //
	col_progressBar: 'Progress bar color',
	col_progressBarStreaming: 'Progress bar when streaming color',
	col_progressBarFrame: 'Progress bar frame color',
	col_progressBarFill: 'Progress bar fill color',

	// * PEAKMETER BAR COLORS * //
	col_peakmeterBarProg: 'Peakmeter bar progress bg color',
	col_peakmeterBarProgFill: 'Peakmeter bar progress fill color',
	col_peakmeterBarFillTop: 'Peakmeter bar top fill color',
	col_peakmeterBarFillMiddle: 'Peakmeter bar middle fill color',
	col_peakmeterBarFillBack: 'Peakmeter bar back fill color',
	col_peakmeterBarVertProgFill: 'Peakmeter bar vertical progress fill color',
	col_peakmeterBarVertFill: 'Peakmeter bar vertical fill color',
	col_peakmeterBarVertFillPeaks: 'Peakmeter bar vertical peaks fill color',

	// * WAVEFORM BAR COLORS * //
	col_waveformBarFillFront: 'Waveform bar front fill color',
	col_waveformBarFillBack: 'Waveform bar back fill color',
	col_waveformBarFillPreFront: 'Waveform bar prepaint front fill color',
	col_waveformBarFillPreBack: 'Waveform bar prepaint back fill color',
	col_waveformBarIndicator: 'Waveform bar progress indicator color',

	// * VOLUME BAR COLORS * //
	col_volumeBar: 'Volume bar color',
	col_volumeBarFrame: 'Volume bar frame color',
	col_volumeBarFill: 'Volume bar fill color',

	// * STYLE COLORS * //
	col_styleBevel: 'Style bevel color',
	col_styleGradient: 'Style gradient color',
	col_styleGradient2: 'Style gradient 2 color',
	col_styleProgressBar: 'Style progress bar color',
	col_styleProgressBarLineTop: 'Style progress bar line top color',
	col_styleProgressBarLineBottom: 'Style progress bar line bottom color',
	col_styleProgressBarFill: 'Style progress bar fill color',
	col_styleVolumeBar: 'Style volume bar color',
	col_styleVolumeBarFill: 'Style volume bar fill color'
};

/** @type {Object} Custom theme 01 config header description. */
const customTheme01Schema = new ConfigurationObjectSchema('customTheme01', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 01:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 01                                                                                                                                                          ' +
	'* This is the first custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                       ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 02 config header description. */
const customTheme02Schema = new ConfigurationObjectSchema('customTheme02', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 02:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 02                                                                                                                                                          ' +
	'* This is the second custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                      ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 03 config header description. */
const customTheme03Schema = new ConfigurationObjectSchema('customTheme03', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 03:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 03                                                                                                                                                          ' +
	'* This is the third custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                       ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 04 config header description. */
const customTheme04Schema = new ConfigurationObjectSchema('customTheme04', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 04:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 04                                                                                                                                                          ' +
	'* This is the fourth custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                      ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 05 config header description. */
const customTheme05Schema = new ConfigurationObjectSchema('customTheme05', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 05:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 05                                                                                                                                                          ' +
	'* This is the fifth custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                       ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 06 config header description. */
const customTheme06Schema = new ConfigurationObjectSchema('customTheme06', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 06:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 06                                                                                                                                                          ' +
	'* This is the sixth custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                       ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 07 config header description. */
const customTheme07Schema = new ConfigurationObjectSchema('customTheme07', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 07:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 07                                                                                                                                                          ' +
	'* This is the seventh custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                     ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 08 config header description. */
const customTheme08Schema = new ConfigurationObjectSchema('customTheme08', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 08:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 08                                                                                                                                                          ' +
	'* This is the eighth custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                      ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 09 config header description. */
const customTheme09Schema = new ConfigurationObjectSchema('customTheme09', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 09:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 09                                                                                                                                                          ' +
	'* This is the ninth custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                       ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');

/** @type {Object} Custom theme 10 config header description. */
const customTheme10Schema = new ConfigurationObjectSchema('customTheme10', ConfigurationObjectType.Object, undefined,
	'/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   ' +
	'* CUSTOM THEME 10:                                                                                                                                                                                      ' +
	'* Top menu Options > Theme > Custom > Theme 10                                                                                                                                                          ' +
	'* This is the tenth custom theme that contains all colors for Main, Playlist, Library, Biography.                                                                                                       ' +
	'* Note: All colors will be automatically saved here if you do live editing with top menu Options > Theme > Custom > Edit custom theme                                                                   ' +
	'///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ');
