/**
 * This file contains the various definitions, default values, and schemeas for the
 * objects that will be written to the configuration file. Any value defined here
 * will be written to the config (although some of these objects will be modified
 * in settings.js with values that are not saved).
 * DO NOT EDIT: Editing these values will likely not provide you with the results
 * you expect as they will probably not be stored in the configs.
 */

/** @type {*} Title formatting strings used throughout the UI */
let tf = {};	// defining each entry separately for auto-complete purposes
tf.album_subtitle = '%albumsubtitle%';
tf.album_translation = '%albumtranslation%';
tf.artist_country = '%artistcountry%';
tf.artist = '$if3($meta(artist),%composer%,%performer%,%album artist%)';
tf.date = '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%,)';
tf.disc_subtitle = '%discsubtitle%';
tf.disc = '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)';
tf.edition = '[$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\')]';
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
const defaultTitleFormatStrings = _.cloneDeep(tf);

const titleFormatComments = {
	artist_country: 'Only used for displaying artist flags.',
	date: 'The full date stored for the track',
	lyrics: 'Lyrics.js will check these fields in order if no local lyrics file is found.',
	releaseCountry: 'Releases tagged from Musicbrainz with a release country of AF (Afghanistan) are almost always whole world releases that have each country listed individually, so replace with \'XW\' (Worldwide) tag.',
	title: 'Track title shown above the progress bar',
	vinyl_side: 'Used for determining what side a song appears on for vinyl releases - i.e. song A1 has a %vinyl side% of "A"',
	vinyl_tracknum: 'Used for determining the track number on vinyl releases - i.e. song A1 has %vinyl tracknumber% set to "1"',
	year: 'Just the year portion of any stored date.',
}
const titleFormatSchema = new ConfigurationObjectSchema('title_format_strings', ConfigurationObjectType.Object, undefined,
		'Title formatting strings, used throughout the display. Do NOT change the key names or add new ones.');

/**
 * @typedef {Object} MetadataGridEntry
 * @property {string} label Text that shows in the left column of the metadata grid
 * @property {string} val Evaluated text in the right column. If this evaluates to an empty string, the entry is not shown.
 * @property {boolean=} age If True, appends the "(1y 10, 23d)" style text to the evaluated val. Only valid for date strings
 * @property {string=} comment Optional comment for the .jsonc file.
 */

// Info grid visible when a song is playing.
// NOTE: If you wish to make changes to this, edit it in your georgia-config.jsonc file and NOT here.
/** @type {MetadataGridEntry[]} */
const defaultMetadataGrid = [
	{ label: 'Disc',           val: `$if(${tf.disc_subtitle},[Disc %discnumber% \u2013 ]${tf.disc_subtitle})` },
	{ label: 'Release Type',   val: '$if($strstr(%releasetype%,Album),,[%releasetype%])' },
	{ label: 'Year',           val: '$puts(d,'+tf.date+')$if($strcmp($year($get(d)),$get(d)),$get(d),)', comment: '\'Year\' is shown if the date format is YYYY' },
	{ label: 'Release Date',   val: '$puts(d,'+tf.date+')$if($strcmp($year($get(d)),$get(d)),,$get(d))', age: true, comment: '\'Release Date\' is shown if the date format is YYYY-MM-DD' },
	{ label: 'Edition',        val: tf.edition },
	{ label: 'Label',          val: '[$if($meta(label),$meta_sep(label, \u2022 ),$if3(%publisher%,%discogs_label%,))]', comment: 'The label(s) or publisher(s) that released the album.' },
	{ label: 'Catalog #',      val: `$puts(cn,$if3(%catalognumber%,%discogs_catalog%,))[$if($get(cn),$get(cn)[ / ${tf.releaseCountry}],)]` },
	{ label: 'Release Country',val: `$puts(cn,$if3(%catalognumber%,%discogs_catalog%,))[$if($get(cn),,$replace(${tf.releaseCountry},XW,))]`, comment: 'Only shown if %catalognumber% or %discogs_catalog% is not present. If release country is entire world (\'XW\') value is hidden.' },
	{ label: 'Track',          val: '$if(%tracknumber%,$num(%tracknumber%,1)$if(%totaltracks%,/$num(%totaltracks%,1))$ifgreater(%totaldiscs%,1,   CD %discnumber%/$num(%totaldiscs%,1),)' },
	{ label: 'Genre',          val: '[$meta_sep(genre, \u2022 )]' },
	{ label: 'Style',          val: '[$meta_sep(style, \u2022 )]' },
	{ label: 'Release',        val: '[%release%]' },
	{ label: 'Codec',          val: "[$if($not($strstr(%codec%,'MP3')),$replace($if2(%codec_profile%,%codec%),ATSC A/52,Dolby Digital)[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))])]" },
	{ label: 'Added',          val: '[$if2(%added_enhanced%,%added%)]', age: true },
	{ label: 'Last Played',    val: '[' + tf.last_played + ']', age: true },
	{ label: 'Hotness',        val: "$puts(X,5)$puts(Y,$div(%_dynamic_rating%,400))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$ifgreater(%_dynamic_rating%,0,   $replace($div(%_dynamic_rating%,1000)'.'$mod($div(%_dynamic_rating%,100),10),0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9),)" },
	{ label: 'View Count',     val: '[%fy_view_count%]' },
	{ label: 'Likes',          val: "[$if(%fy_like_count%,%fy_like_count% \u25B2 / %fy_dislike_count% \u25BC,)]" },
	{ label: 'Play Count',     val: '$if($or(%play_count%,%lastfm_play_count%),$puts(X,5)$puts(Y,$max(%play_count%,%lastfm_play_count%))$ifgreater($get(Y),30,,$repeat($repeat(I,$get(X)) ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))   )$get(Y))' },
	{ label: 'Rating',         val: '$if(%rating%,$repeat(\u2605 ,%rating%))' },
	{ label: 'Mood',           val: '$if(%mood%,$puts(X,5)$puts(Y,$mul(5,%mood%))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$replace(%mood%,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9))' },
];
const gridSchema = new ConfigurationObjectSchema('metadataGrid', ConfigurationObjectType.Array, [
	{ name: 'label' },
	{ name: 'val' },	// todo: change this to 'value'?
	{ name: 'age', optional: true },
], '*NOTE* Entries that evaluate to an empty string will not be shown in the grid');

const imgPathDefaults = [ // simply add, change or re-order entries as needed
	'$replace(%path%,%filename_ext%,)folder*',
	'$replace(%path%,%filename_ext%,)cover*',
	'$replace(%path%,%filename_ext%,)front*',
	'$replace(%path%,%filename_ext%,)booklet*',
	'$replace(%path%,%filename_ext%,)artwork*',
	'$replace(%path%,%filename_ext%,)image*',
	'$replace(%path%,%filename_ext%,)scan*',
	'$replace(%path%,%filename_ext%,)back*',
	'$replace(%path%,%filename_ext%,)*.jpg',
	'$replace(%path%,%filename_ext%,)*.png',

	// All folder images in parent directory
	'$replace(%path%,%directoryname%\\%filename_ext%,)folder*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)cover*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)front*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)booklet*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)artwork*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)image*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)scan*',
	'$replace(%path%,%directoryname%\\%filename_ext%,)back*',

	// Artwork, Images, Scans in root folder ( 1 CD )
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)folder*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)cover*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)front*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)artwork*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)image*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)scan*',
	'$replace(%path%\\..\\Artwork\\,%filename_ext%,)back*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)folder*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)cover*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)front*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)artwork*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)image*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)scan*',
	'$replace(%path%\\..\\Images\\,%filename_ext%,)back*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)folder*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)cover*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)front*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)booklet*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)artwork*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)image*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)scan*',
	'$replace(%path%\\..\\Scans\\,%filename_ext%,)back*',

	// Artwork, Images, Scans in other subfolders ( Multi CDs)
	'$replace(%path%\\Artwork\\,%filename_ext%,)folder*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)cover*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)front*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)booklet*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)artwork*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)image*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)scan*',
	'$replace(%path%\\Artwork\\,%filename_ext%,)back*',
	'$replace(%path%\\Images\\,%filename_ext%,)folder*',
	'$replace(%path%\\Images\\,%filename_ext%,)cover*',
	'$replace(%path%\\Images\\,%filename_ext%,)front*',
	'$replace(%path%\\Images\\,%filename_ext%,)booklet*',
	'$replace(%path%\\Images\\,%filename_ext%,)artwork*',
	'$replace(%path%\\Images\\,%filename_ext%,)image*',
	'$replace(%path%\\Images\\,%filename_ext%,)scan*',
	'$replace(%path%\\Images\\,%filename_ext%,)back*',
	'$replace(%path%\\Scans\\,%filename_ext%,)folder*',
	'$replace(%path%\\Scans\\,%filename_ext%,)cover*',
	'$replace(%path%\\Scans\\,%filename_ext%,)front*',
	'$replace(%path%\\Scans\\,%filename_ext%,)booklet*',
	'$replace(%path%\\Scans\\,%filename_ext%,)artwork*',
	'$replace(%path%\\Scans\\,%filename_ext%,)image*',
	'$replace(%path%\\Scans\\,%filename_ext%,)scan*',
	'$replace(%path%\\Scans\\,%filename_ext%,)back*'
];
const imgPathSchema = new ConfigurationObjectSchema('imgPaths', ConfigurationObjectType.Array, undefined,
	'The titleformatting defined paths for artwork to be displayed. The first image matched will be shown first.' +
	' Re-arrange, add, or remove as needed. NOTE: folder delimiters must be double-slashes ("\\\\")');

const lyricFilenamesDefaults = [
	'%title%',
	'%artist% - %title%',
	'%artist% -%title%',
	'%tracknumber% - %title%',
	'%tracknumber% - %artist% - %title%',
];
const lyricFilenamesSchema = new ConfigurationObjectSchema('lyricFilenamePatterns', ConfigurationObjectType.Array, undefined,
	'The titleformatting defined patterns for the names of lyrics files. Do not include file extensions. Special characters ' +
	'which are not allowed in filenames (i.e. / : " etc.) will be stripped from the filenames automatically and replaced with underscores.');

const settingsDefaults = {
	artworkDisplayTime: 30,
	cdArtBasename: 'cd',
	defaultSortString: '$if2(%artist sort order%,%album artist%) $if3(%album sort order%,%original release date%,%date%) %album% %edition% %codec% %discnumber% %tracknumber%',
	extraTrackInfo: '$ifequal(%samplerate%,44100,, |$ifgreater($info(bitspersample),16, $info(bitspersample)bit,) $div(%samplerate%,1000).$left($right(%samplerate%,3),1)kHz)[ | $replace(%replaygain_album_gain%, dB,dB)]',
	playlistAlwaysShowBitrate: false,
	hideCursor: false,
	hidePanelBgWhenCollapsed: false,
	showDebugLog: false,
	showReleaseCountryFlag: true,
	showThemeLog: false,
	stoppedString1: 'foobar2000',
	stoppedString1acr: 'fb2k',
	stoppedString2: '$replace(%_foobar2000_version%,foobar2000 ,)',
	locked: true,
}
const settingsComments = {
	artworkDisplayTime: 'Number of seconds to show each image if more than one is found and "Cycle through all artwork" option is enabled. (Min: 5, Max: 120)',
	cdArtBasename: 'Do not include extension. Example: "discart", if the image provider uses that name for saving cdart and you want those filtered from showing up as albumart. Would also filter out discart1.png, etc.',
	defaultSortString: 'Default sort playlists generated from Library selections or clicking on playlist Hyperlinks',
	extraTrackInfo: 'Portion of the trackInfo in the upper right, directly under the year. Only part of the info string is customizable',
	playlistAlwaysShowBitrate: "Always show the codec sample rate and bitrate in all album descriptions on the Playlist.",
	hideCursor: 'Hides cursor when song is playing after 10 seconds of no mouse activity',
	hidePanelBgWhenCollapsed: 'Hide panel background when playing an album and the playlist or library view is active',
	showDebugLog: 'Enables extra logging in the console. Probably not needed unless you encounter a problem or you\'re asked to enable it.',
	showReleaseCountryFlag: 'Shows the country flag for releases when the value specified in title_format_strings.releaseCountry is found',
	showThemeLog: 'Logs the output of the algorithm which determines the primary theme color.',
	stoppedString1: 'The bolded portion of text shown above the progress bar when nothing is playing',
	stoppedString2: 'The second (non-bold) portion of text shown above the progress bar when nothing is playing',
	locked: 'Locks theme by preventing right-clicking on the background from bringing up a menu.',
}
const settingsSchema = new ConfigurationObjectSchema('settings', ConfigurationObjectType.Object,
		// will display as key/val pairs with comments attached
		undefined, 'General settings for the theme.');

const transportDefaults = {
	enableTransportControls_default: true,
	enableTransportControls_artwork: true,
	enableTransportControls_compact: true,
	show_playbackOrder_default: true,
	show_playbackOrder_artwork: true,
	show_playbackOrder_compact: true,
	show_volume_default: true,
	show_volume_artwork: true,
	show_volume_compact: true,
	show_reload_default: false,
	show_reload_artwork: false,
	show_reload_compact: false,
}

const transportComments = {
	enableTransportControls_default: 'Should transport controls be displayed in Default mode. If false, all other transport settings are ignored.',
	enableTransportControls_artwork: 'Should transport controls be displayed in Default mode. If false, all other transport settings are ignored.',
	enableTransportControls_compact: 'Should transport controls be displayed in Compact mode. If false, all other transport settings are ignored.',
	show_playbackOrder_default: 'Show the Playback order button in Default mode',
	show_playbackOrder_artwork: 'Show the Playback order button in Artwork mode',
	show_playbackOrder_compact: 'Show the Playback order button in Compact mode',
	show_volume_default: 'Show the volume control in Default mode',
	show_volume_artwork: 'Show the volume control in Artwork mode',
	show_volume_compact: 'Show the volume control in Compact mode',
	show_reload_default: 'Show the reload theme button in Default mode',
	show_reload_artwork: 'Show the reload theme button in Artwork mode',
	show_reload_compact: 'Show the reload theme button in Compact mode',
}

const transportSchema = new ConfigurationObjectSchema('transport', ConfigurationObjectType.Object, undefined, 'Transport controls settings');
