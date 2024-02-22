/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Setup                                    * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    22-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////
// * CONFIG * //
////////////////
/**
 * The instance of `ConfigDefaults` class for default config setting operations.
 * @typedef {ConfigDefaults}
 * @global
 */
const grDef = new ConfigDefaults();

/**
 * The instance of `ConfigurationManager` class for config operations.
 * @typedef {ConfigurationManager}
 * @global
 */
const grCfg = new ConfigurationManager();

grCfg.initializeConfigs();
grCfg.migrateCheck(grCfg.currentVersion, grCfg.configVersion);


//////////////
// * MAIN * //
//////////////
/**
 * A collection of all Georgia-ReBORN class instances that will be initialized at the end in gr.initialize.js.
 * @typedef  {object} grm - The Georgia-ReBORN main object.
 * @property {Utilities} utils - The instance of `Utilities` class for utility operations.
 * @property {MainUI} ui - The instance of `MainUI` class for main user interface operations.
 * @property {ThemeSettingsManager} settings - The instance of `ThemeSettingsManager` class for theme settings operations.
 * @property {Display} display - The instance of `Display` class for UI display operations.
 * @property {ColorMethods} color - The instance of `ColorMethods` class for color-related utility operations.
 * @property {ThemeColors} theme - The instance of `ThemeColors` class for theme color operations.
 * @property {StyleColors} style - The instance of `StyleColors` class for style color operations.
 * @property {ThemePreset} preset - The instance of `ThemePreset` class for theme preset operations.
 * @property {TopMenu} topMenu - The instance of `TopMenu` class for top menu interface operations.
 * @property {TopMenuOptions} options - The instance of `TopMenuOptions` class for top menu option management operations.
 * @property {ContextMenus} ctxMenu - The instance of `ContextMenus` class for context menu operations.
 * @property {InputBox} inputBox - The instance of `InputBox` class for input box operations.
 * @property {CustomMenu} cusMenu - The instance of `CustomMenu` class for custom menu base control operations.
 * @property {CustomThemeMenu} cthMenu - The instance of `CustomThemeMenu` class for custom theme menu operations.
 * @property {MetadataGridMenu} gridMenu - The instance of `MetadataGridMenu` class for metadata grid menu operations.
 * @property {ArtCache} artCache - The instance of `ArtCache` class for artwork caching operations.
 * @property {Button} button - The instance of `Button` class for button operations.
 * @property {PauseButton} pseBtn - The instance of `PauseButton` class for pause button operations.
 * @property {VolumeButton} volBtn - The instance of `VolumeButton` class for volume button operations.
 * @property {TooltipHandler} ttip - The instance of `TooltipHandler` class for tooltip handling operations.
 * @property {LowerBarTooltip} lowerTip - The instance of `LowerBarTooltip` class for lower bar tooltip operations.
 * @property {MetadataGridTooltip} gridTip - The instance of `MetadataGridTooltip` class for metadata grid tooltip operations.
 * @property {Timeline} timeline - The instance of `Timeline` class for timeline operations.
 * @property {PlaylistHistory} history - The instance of `PlaylistHistory` class for playlist history operations.
 * @property {JumpSearch} jSearch - The instance of `JumpSearch` class for jump search operations.
 * @property {ProgressBar} progBar - The instance of `ProgressBar` class for progress bar display operations.
 * @property {PeakmeterBar} peakBar - The instance of `PeakmeterBar` class for peak meter bar display operations.
 * @property {WaveformBar} waveBar - The instance of `WaveformBar` class for waveform bar display operations.
 * @property {Lyrics} lyrics - The instance of `Lyrics` class for lyrics-related operations.
 */
/** @global @type {grm} */
const grm = {};


///////////////
// * PATHS * //
///////////////
/**
 * A collection of image and various other paths.
 * @typedef  {object} grPath - The Georgia-ReBORN path object.
 * @property {string} base - The theme path shortcut.
 * @property {string} images - The images+custom path shortcut.
 * @property {string} artistlogos - The artist logos filepath.
 * @property {string} artistlogosColor - The artist logos colored filepath.
 * @property {string} labelsBase - The record label filepath.
 * @property {string} flagsBase - The the flags filepath.
 * @property {string} lastFmImageRed - The last.fm red logo filepath.
 * @property {string} lastFmImageWhite - The last.fm white logo filepath.
 * @property {Function} discArtImagePaths - The collection of all disc art paths to search in.
 * @property {Function} discArtStubPaths - The collection of all disc art stub paths to search in.
 * @property {string} discArtCustomStub - The disc art custom stub filepath.
 * @property {string} hiResAudioLogoPath - The Hi-Res audio logo filepath.
 * @property {string[]} lyricsPath - The array of paths for locating cached lyrics files in the user's system.
 */
/** @global @type {grPath} */
const grPath = {
	// * THEME BASE PATH * //
	base: `${fb.ProfilePath}georgia-reborn\\`,

	// * IMAGES BASE PATH * //
	images: `${fb.ProfilePath}georgia-reborn\\${grSet.customThemeImages ? 'images\\custom' : 'images'}\\`,

	// * ARTIST & LABEL LOGOS * //
	artistlogos:      `${fb.ProfilePath}georgia-reborn\\images\\artistlogos\\`,
	artistlogosColor: `${fb.ProfilePath}georgia-reborn\\images\\artistlogos color\\`,
	labelsBase:       `${fb.ProfilePath}georgia-reborn\\images\\recordlabel\\`,

	// * MISC * //
	flagsBase:        `${fb.ProfilePath}georgia-reborn\\${grSet.customThemeImages ? 'images\\custom' : 'images'}\\flags\\`,
	lastFmImageRed:   `${fb.ProfilePath}georgia-reborn\\${grSet.customThemeImages ? 'images\\custom' : 'images'}\\misc\\last-fm-red-36.png`,
	lastFmImageWhite: `${fb.ProfilePath}georgia-reborn\\${grSet.customThemeImages ? 'images\\custom' : 'images'}\\misc\\last-fm-36.png`,

	// * DISC ART * //
	/**
	 * A collection of all disc art paths to search in.
	 * This method returns an array of paths with expressions evaluated by the title format helper.
	 * We expect disc art will be in .png with transparent background, best found at fanart.tv.
	 * @type {() => string[]} A function returning an array of string paths.
	 */
	discArtImagePaths() {
		return [
			// * CD ART ( named cd1.png, cd2.png, etc. ) * //
			$(`$directory_path(%path%)\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`),              // Root -> cd%discnumber%.png
			$(`$directory_path(%path%)\\..\\Artwork\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`), // Root Artwork -> cd%discnumber%.png
			$(`$directory_path(%path%)\\..\\Images\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`),  // Root Images -> cd%discnumber%.png
			$(`$directory_path(%path%)\\..\\Scans\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`),   // Root Scans -> cd%discnumber%.png
			$(`$directory_path(%path%)\\Artwork\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`),     // Subfolder Artwork -> cd%discnumber%.png
			$(`$directory_path(%path%)\\Images\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`),      // Subfolder Images -> cd%discnumber%.png
			$(`$directory_path(%path%)\\Scans\\${grCfg.settings.discArtBasename}$ifgreater(%totaldiscs%,1,%discnumber%,).png`),       // Subfolder Scans -> cd%discnumber%.png

			// * CD ART ( named cd.png (or whatever custom value was specified). This is the most common single disc case. ) * //
			$(`$directory_path(%path%)\\${grCfg.settings.discArtBasename}.png`),              // Root -> cd.png
			$(`$directory_path(%path%)\\..\\Artwork\\${grCfg.settings.discArtBasename}.png`), // Root Artwork -> cd.png
			$(`$directory_path(%path%)\\..\\Images\\${grCfg.settings.discArtBasename}.png`),  // Root Images -> cd.png
			$(`$directory_path(%path%)\\..\\Scans\\${grCfg.settings.discArtBasename}.png`),   // Root Scans -> cd.png
			$(`$directory_path(%path%)\\Artwork\\${grCfg.settings.discArtBasename}.png`),     // Subfolder Artwork -> cd.png
			$(`$directory_path(%path%)\\Images\\${grCfg.settings.discArtBasename}.png`),      // Subfolder Images -> cd.png
			$(`$directory_path(%path%)\\Scans\\${grCfg.settings.discArtBasename}.png`),       // Subfolder Scans -> cd.png

			// * VINYL DISC ART ( named vinylA.png, vinylB.png, etc. ) * //
			$(`$directory_path(%path%)\\vinyl$if2(${grTF.vinyl_side},).png`),              // Root -> vinyl side
			$(`$directory_path(%path%)\\..\\Artwork\\vinyl$if2(${grTF.vinyl_side},).png`), // Root Artwork -> vinyl%vinyl disc%.png
			$(`$directory_path(%path%)\\..\\Images\\vinyl$if2(${grTF.vinyl_side},).png`),  // Root Images -> vinyl%vinyl disc%.png
			$(`$directory_path(%path%)\\..\\Scans\\vinyl$if2(${grTF.vinyl_side},).png`),   // Root Scans -> vinyl%vinyl disc%.png
			$(`$directory_path(%path%)\\Artwork\\vinyl$if2(${grTF.vinyl_side},).png`),     // Subfolder Artwork -> vinyl%vinyl disc%.png
			$(`$directory_path(%path%)\\Images\\vinyl$if2(${grTF.vinyl_side},).png`),      // Subfolder Images -> vinyl%vinyl disc%.png
			$(`$directory_path(%path%)\\Scans\\vinyl$if2(${grTF.vinyl_side},).png`),       // Subfolder Scans -> vinyl%vinyl disc%.png

			// * VINYL DISC ART ( named vinylA.png, vinylB.png, etc. ) * //
			$('$directory_path(%path%)\\vinyl.png'),              // Root -> vinyl.png
			$('$directory_path(%path%)\\..\\Artwork\\vinyl.png'), // Root Artwork -> vinyl.png
			$('$directory_path(%path%)\\..\\Images\\vinyl.png'),  // Root Images -> vinyl.png
			$('$directory_path(%path%)\\..\\Scans\\vinyl.png'),   // Root Scans -> vinyl.png
			$('$directory_path(%path%)\\Artwork\\vinyl.png'),     // Subfolder Artwork -> vinyl.png
			$('$directory_path(%path%)\\Images\\vinyl.png'),      // Subfolder Images -> vinyl.png
			$('$directory_path(%path%)\\Scans\\vinyl.png')        // Subfolder Scans -> vinyl.png
		];
	},

	/**
	 * A collection of all disc art stub paths to search in.
	 * This method returns an object where the key is the disc art stub name and the value is the path to the image.
	 * @type {() => { [key: string]: string }} A function returning an object with string keys and string values.
	 */
	discArtStubPaths() {
		return {
			cdAlbumCover:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\cd-transparent.png`,
			cdWhite:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\cd-white.png`,
			cdBlack:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\cd-black.png`,
			cdBlank:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\cd-blank.png`,
			cdTrans:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\cd-transparent.png`,
			vinylAlbumCover: `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-black-hole.png`,
			vinylWhite:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-white.png`,
			vinylVoid:       `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-void.png`,
			vinylColdFusion: `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-cold-fusion.png`,
			vinylRingOfFire: `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-ring-of-fire.png`,
			vinylMaple:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-maple.png`,
			vinylBlack:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-black.png`,
			vinylBlackHole:  `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-black-hole.png`,
			vinylEbony:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-ebony.png`,
			vinylTrans:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\vinyl-transparent.png`
		};
	},

	// * CUSTOM DISC ART STUBS * //
	discArtCustomStub: `${fb.ProfilePath}georgia-reborn\\images\\custom\\discart\\${grSet.discArtStub}.png`,

	/**
	 * Generates the path to the Hi-Res audio logo based on the resolution and shape preference.
	 * @returns {string} The path to the Hi-Res audio logo image.
	 */
	hiResAudioLogoPath() {
		const plus4k = RES._4K ? '4K-' : '';
		const plusRound = grSet.hiResAudioBadgeRound ? '-round' : '';
		const imagePath = `${fb.ProfilePath}georgia-reborn\\${grSet.customThemeImages ? 'images\\custom' : 'images'}\\misc\\`;

		if (grSet.hiResAudioBadgeSize === 'small') {
			return `${imagePath}${plus4k}hi-res-audio-small${plusRound}.png`;
		} else if (grSet.hiResAudioBadgeSize === 'normal') {
			return `${imagePath}${plus4k}hi-res-audio-normal${plusRound}.png`;
		} else if (grSet.hiResAudioBadgeSize === 'large') {
			return `${imagePath}${plus4k}hi-res-audio-large${plusRound}.png`;
		}

		return `${imagePath}${plus4k}hi-res-audio-normal${plusRound}.png`;
	},

	// * LYRICS * //
	lyricsPath: [
		'$replace($replace(%path%,%filename_ext%,),,\\)',
		`${fb.ProfilePath}cache\\lyrics\\`,
		`${fb.FoobarPath}cache\\lyrics\\`
	]
};


///////////////
// * FONTS * //
///////////////
/**
 * A collection of theme fonts that are assigned at runtime in the `createFonts` method.
 * @typedef  {object} grFont - The Georgia-ReBORN font object.
 * @property {string} fontDefault - The 'Segoe UI' font name.
 * @property {string} fontSegoeUISymbol - The 'Segoe UI Symbol' font name.
 * @property {string} fontTopMenu - The 'Segoe UI Semibold' font name.
 * @property {string} fontTopMenuCaption - The 'Marlett' font name.
 * @property {string} fontGuiFx - The 'Guifx v2 Transports' font name.
 * @property {string} fontAwesome - The 'FontAwesome' font name.
 * @property {string} fontLowerBarArtist - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontLowerBarTitle - The 'HelveticaNeueLT Pro 45 Lt' font name.
 * @property {string} fontLowerBarDisc - The 'HelveticaNeueLT Pro 45 Lt' font name.
 * @property {string} fontLowerBarTime - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontLowerBarLength - The 'HelveticaNeueLT Pro 45 Lt' font name.
 * @property {string} fontLowerBarWave - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontNotification - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontPopup - The 'Segoe UI' font name.
 * @property {string} fontTooltip - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontGridArtist - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontGridTitle - The 'HelveticaNeueLT Pro 45 Lt' font name.
 * @property {string} fontGridTitleBold - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontGridAlbum - The 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontGridKey - The 'HelveticaNeueLT Pro 75 Bd' or 'HelveticaNeueLT Pro 65 Md' font name.
 * @property {string} fontGridValue - The 'HelveticaNeueLT Pro 45 Lt' font name.
 * @property {string} fontLibrary - The 'Segoe UI' font name.
 * @property {string} fontBiography - The 'Segoe UI' font name.
 * @property {string} fontLyrics - The 'Segoe UI' font name.
 * @property {GdiFont} topMenu - Theme font 'Segoe UI Semibold' used for top menu buttons.
 * @property {GdiFont} topMenuCaption - Theme font 'Marlett' used for top menu 🗕 🗖 ✖ caption buttons.
 * @property {GdiFont} topMenuCompact - Theme font 'FontAwesome' used for the top menu compact button.
 * @property {GdiFont} lowerBarArtist - Theme artist font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} lowerBarTitle - Theme title font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lowerBarDisc - Theme disc font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lowerBarTime - Theme time font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} lowerBarLength - Theme length font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lowerBarWave - Theme waveform bar font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} guifx - Theme font 'Guifx v2 Transports' used for the lower bar transport/playback buttons.
 * @property {GdiFont} pboDefault - Theme font 'Guifx v2 Transports' used for the lower bar transport playback order button.
 * @property {GdiFont} pboRepeatPlaylist - Theme font 'FontAwesome' used for the lower bar transport playback order button.
 * @property {GdiFont} pboRepeatTrack - Theme font 'FontAwesome' used for the lower bar transport playback order button.
 * @property {GdiFont} pboShuffle - Theme font 'Guifx v2 Transports' used for the lower bar transport playback order button.
 * @property {GdiFont} guifxReload - Theme font 'Guifx v2 Transports' used for the lower bar transport reload button.
 * @property {GdiFont} guifxAddTrack - Theme font 'Guifx v2 Transports' used for the lower bar transport add tracks button.
 * @property {GdiFont} guifxVolume - Theme font 'Guifx v2 Transports' used for the lower bar transport volume button.
 * @property {GdiFont} noAlbumArtStub - Theme font 'FontAwesome' used for no album art music note symbol.
 * @property {GdiFont} symbol - Panel font 'Segoe UI Symbol' used for special chars, scrollbar buttons, etc.
 * @property {GdiFont} notification - Theme font 'HelveticaNeueLT Pro 65 Md' used for notifications.
 * @property {GdiFont} popup - Theme font 'Segoe UI' used for popups.
 * @property {GdiFont} tooltip - Theme font 'HelveticaNeueLT Pro 65 Md' used for styled tooltips.
 * @property {GdiFont} gridArtist - Theme font 'HelveticaNeueLT Pro 65 Md' used for metadata grid artist.
 * @property {GdiFont} gridTrackNumber - Theme font 'HelveticaNeueLT Pro 45 Lt' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid track number.
 * @property {GdiFont} gridTitle - Theme font 'HelveticaNeueLT Pro 45 Lt' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid title.
 * @property {GdiFont} gridAlbum - Theme font 'HelveticaNeueLT Pro 65 Md' used for metadata grid album.
 * @property {GdiFont} gridKey - Theme font 'HelveticaNeueLT Pro 75 Bd' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid key.
 * @property {GdiFont} gridVal - Theme font 'HelveticaNeueLT Pro 45 Lt' used for metadata grid value.
 * @property {GdiFont} library - Panel font 'Segoe UI' used in the Library.
 * @property {GdiFont} biography - Panel font 'Segoe UI' used in the Biography.
 * @property {GdiFont} lyrics - Panel font 'Segoe UI' used in the Lyrics.
 * @property {GdiFont} lyricsHighlight - Panel font 'Segoe UI' used in Lyrics for synced lines.
 */
/** @global @type {grFont} */
const grFont = {
	fontDefault:        grSet.customThemeFonts ? grCfg.customFont.fontDefault : 'Segoe UI',
	fontSegoeUISymbol:  'Segoe UI Symbol',
	fontTopMenu:        grSet.customThemeFonts ? grCfg.customFont.fontTopMenu : 'Segoe UI Semibold',
	fontTopMenuCaption: 'Marlett',

	fontGuiFx:          'Guifx v2 Transports',
	fontAwesome:        'FontAwesome',
	fontLowerBarArtist: grSet.customThemeFonts ? grCfg.customFont.fontLowerBarArtist : 'HelveticaNeueLT Pro 65 Md',
	fontLowerBarTitle:  grSet.customThemeFonts ? grCfg.customFont.fontLowerBarTitle  : 'HelveticaNeueLT Pro 45 Lt',
	fontLowerBarDisc:   grSet.customThemeFonts ? grCfg.customFont.fontLowerBarDisc   : 'HelveticaNeueLT Pro 45 Lt',
	fontLowerBarTime:   grSet.customThemeFonts ? grCfg.customFont.fontLowerBarTime   : 'HelveticaNeueLT Pro 65 Md',
	fontLowerBarLength: grSet.customThemeFonts ? grCfg.customFont.fontLowerBarLength : 'HelveticaNeueLT Pro 45 Lt',
	fontLowerBarWave:   grSet.customThemeFonts ? grCfg.customFont.fontLowerBarWave   : 'HelveticaNeueLT Pro 65 Md',

	fontNotification:   grSet.customThemeFonts ? grCfg.customFont.fontNotification   : 'HelveticaNeueLT Pro 65 Md',
	fontPopup:          grSet.customThemeFonts ? grCfg.customFont.fontPopup          : 'Segoe UI',
	fontTooltip:        grSet.customThemeFonts ? grCfg.customFont.fontTooltip        : 'HelveticaNeueLT Pro 65 Md',

	fontGridArtist:     grSet.customThemeFonts ? grCfg.customFont.fontGridArtist     : 'HelveticaNeueLT Pro 65 Md',
	fontGridTitle:      grSet.customThemeFonts ? grCfg.customFont.fontGridTitle      : 'HelveticaNeueLT Pro 45 Lt',
	fontGridTitleBold:  grSet.customThemeFonts ? grCfg.customFont.fontGridTitleBold  : 'HelveticaNeueLT Pro 65 Md',
	fontGridAlbum:      grSet.customThemeFonts ? grCfg.customFont.fontGridAlbum      : 'HelveticaNeueLT Pro 65 Md',
	fontGridKey:        grSet.customThemeFonts ? grCfg.customFont.fontGridKey        :
						Detect.Wine            ? 'HelveticaNeueLT Pro 65 Md'         : 'HelveticaNeueLT Pro 75 Bd',
	fontGridValue:      grSet.customThemeFonts ? grCfg.customFont.fontGridValue      : 'HelveticaNeueLT Pro 45 Lt',

	fontLibrary:        grSet.customThemeFonts ? grCfg.customFont.fontLibrary        : 'Segoe UI',
	fontBiography:      grSet.customThemeFonts ? grCfg.customFont.fontBiography      : 'Segoe UI',
	fontLyrics:         grSet.customThemeFonts ? grCfg.customFont.fontLyrics         : 'Segoe UI'
};


/////////////////
// * STRINGS * //
/////////////////
/**
 * A collection of strings and other objects to be displayed throughout UI.
 * @typedef  {object} grStr - The Georgia-ReBORN string object.
 * @property {string} artist - The artist will be shown in Details and in the lower bar.
 * @property {string} composer - The composer will be shown in the lower bar if it exist and enabled.
 * @property {string} album - The album will be shown in Details.
 * @property {string} album_subtitle - Currently not used in the theme.
 * @property {string} disc - By default, this string is displayed in the lower bar if there is more than one total disc. Formatted like: "CD1/2".
 * @property {Array} grid - The metadata grid strings in Details.
 * @property {string} length - The length of the song in MM:SS format.
 * @property {string} original_artist - If %original artist% exist it will be displayed by the right side of the title in the lower bar.
 * @property {string} time - The current time of the song in MM:SS format in the lower bar.
 * @property {string} title - The title of the song.
 * @property {string} titleLower - The title of the song to be displayed above the progress bar. Can include more information such as translation, original artist, etc.
 * @property {string} trackInfo - Currently not used in the theme.
 * @property {string} tracknum - The track number of the song.
 * @property {string} year - Currently not used in the theme.
 */
/** @global @type {grStr} */
const grStr = {
	artist: '',
	composer: '',
	album: '',
	album_subtitle: '',
	disc: '',
	grid: [],
	length: '',
	original_artist: '',
	time: '',
	title: '',
	titleLower: '',
	trackInfo: '',
	tracknum: '',
	year: ''
};


//////////////////////////
// * TITLE FORMATTING * //
//////////////////////////
/**
 * A collection of title formatting strings used throughout the UI.
 * All of these default title formats can be changed in the config file.
 * @typedef  {object} grTF
 * @property {string} album_subtitle - %albumsubtitle%.
 * @property {string} album_translation - %albumtranslation%.
 * @property {string} artist_country - '%artistcountry%'.
 * @property {string} artist - '$if3($meta(artist),%composer%,%performer%,%album artist%)'.
 * @property {string} date - '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%,)'.
 * @property {string} disc_subtitle - '%discsubtitle%'.
 * @property {string} disc - '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)'.
 * @property {string} edition - '[$if2($if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\'),$if(%originaldate%,$ifequal($year(%originaldate%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\'))]'.
 * @property {string} last_played - '[$if2(%last_played_enhanced%,%last_played%)]'.
 * @property {string} lyrics - '[$if3(%synced lyrics%,%syncedlyrics%,%lyrics%,%lyric%,%unsyncedlyrics%,%unsynced lyrics%,)]'.
 * @property {string} original_artist - '[ \'(\'%original artist%\' cover)\']'.
 * @property {string} composer - '[\' -\' %composer% \' \']'.
 * @property {string} releaseCountry - '$replace($if3(%releasecountry%,%discogs_country%,),AF,XW)'.
 * @property {string} title - '%title%[ \'[\'%translation%\']\']'.
 * @property {string} tracknum - '[%tracknumber%.]'.
 * @property {string} vinyl_side - '%vinyl side%'.
 * @property {string} vinyl_tracknum - '%vinyl tracknumber%'.
 * @property {string} vinyl_track - '$if2(%vinyl side%[%vinyl tracknumber%]. ,[%tracknumber%. ])'.
 * @property {string} year - '[$year($if3(%original release date%,%originaldate%,%date%,%fy_upload_date%,))]'.
 * @property {string} playing_playlist - 'Do not change this value as it is handled by the theme itself'.
 */
/** @global @type {grTF} */
const grTF = {
	album_subtitle: grCfg.titleFormat.album_subtitle || grDef.titleFormatDefaults.album_subtitle,
	album_translation: grCfg.titleFormat.album_translation || grDef.titleFormatDefaults.album_translation,
	artist_country: grCfg.titleFormat.artist_country || grDef.titleFormatDefaults.artist_country,
	artist: grCfg.titleFormat.artist || grDef.titleFormatDefaults.artist,
	date: grCfg.titleFormat.date || grDef.titleFormatDefaults.date,
	disc_subtitle: grCfg.titleFormat.disc_subtitle || grDef.titleFormatDefaults.disc_subtitle,
	disc: grCfg.titleFormat.disc || grDef.titleFormatDefaults.disc,
	edition: grCfg.titleFormat.edition || grDef.titleFormatDefaults.edition,
	last_played: grCfg.titleFormat.last_played || grDef.titleFormatDefaults.last_played,
	lyrics: grCfg.titleFormat.lyrics || grDef.titleFormatDefaults.lyrics,
	original_artist: grCfg.titleFormat.original_artist || grDef.titleFormatDefaults.original_artist,
	composer: grCfg.titleFormat.composer || grDef.titleFormatDefaults.composer,
	releaseCountry: grCfg.titleFormat.releaseCountry || grDef.titleFormatDefaults.releaseCountry,
	title: grCfg.titleFormat.title || grDef.titleFormatDefaults.title,
	tracknum: grCfg.titleFormat.tracknum || grDef.titleFormatDefaults.tracknum,
	vinyl_side: grCfg.titleFormat.vinyl_side || grDef.titleFormatDefaults.vinyl_side,
	vinyl_tracknum: grCfg.titleFormat.vinyl_tracknum || grDef.titleFormatDefaults.vinyl_tracknum,
	vinyl_track: grCfg.titleFormat.vinyl_track || grDef.titleFormatDefaults.vinyl_track,
	year: grCfg.titleFormat.year || grDef.titleFormatDefaults.year,
	playing_playlist: grCfg.titleFormat.playing_playlist || grDef.titleFormatDefaults.playing_playlist
};


////////////////
// * COLORS * //
////////////////
/**
 * A collection of main colors and states used throughout the theme.
 * @typedef  {object} grCol - The Georgia-ReBORN color object.
 * @property {number} darkAccent - The primary color shaded by 30%.
 * @property {number} darkAccent_alt - The secondary primary color shaded by 30%.
 * @property {number} accent - The primary color shaded by 15%.
 * @property {number} accent_alt - The secondary primary color shaded by 15%.
 * @property {number} primary - The primary theme color generated from artwork.
 * @property {number} primary_alt - The secondary primary theme color generated from artwork.
 * @property {number} lightAccent - The primary color tinted by 20%.
 * @property {number} lightAccent_alt - The secondary primary color tinted by 20%.
 * @property {number} artist - The color of artist text on background.
 * @property {number} bg - The background of the main panel.
 * @property {number} rating - The color of rating stars in metadata grid.
 * @property {number} hotness - The color of hotness text in metadata grid.
 * @property {number} timelineAdded - The background color for timeline block in Details from added to first played.
 * @property {number} timelinePlayed - The background color for timeline block in Details from first played to last played.
 * @property {number} timelineUnplayed - The background color for timeline block in Details from last played to present time.
 * @property {number} progressBar - The background of the progress bar. Fill will be col.primary.
 * @property {number} shadow - The color of the shadow.
 * @property {number} colBrightness - Calculated primary color brightness used in grSet.theme === 'white, grSet.theme === 'black, grSet.theme === 'reborn, grSet.theme === 'random.
 * @property {number} colBrightness2 - Calculated secondary color brightness used in grSet.styleRebornFusion, grSet.styleRebornFusion2, grSet.styleRebornFusionAccent.
 * @property {number} imgBrightness - Calculated image brightness used in grSet.styleBlend, grSet.styleBlend2, grSet.styleBlackAndWhite, grSet.styleBlackAndWhite2, grSet.styleBlackAndWhiteReborn.
 * @property {GdiBitmap} imgBlended - Blended image from grMain.color.setStyleBlend().
 * @property {boolean} isColored - Checks if background color is not full white RGB(255, 255, 255), used in Reborn/Random theme when init on start or when noAlbumArtStub displayed.
 * @property {boolean} lightBg - Color definition when to switch text and logos to white or black, used in grSet.theme === 'white', grSet.theme === 'black', grSet.theme === 'reborn', grSet.theme === 'random', grSet.styleBlend, grSet.styleBlend2.
 * @property {boolean} lightBgLib - Color definition when to switch text and logos to white or black, used in libSet.theme === 1 - 5.
 * @property {boolean} lightBgBio - Color definition when to switch text and logos to white or black, used in bioSet.theme === 1 - 4.
 * @property {boolean} lightBgMain - Color definition for col.bg when to lighten or darken custom theme colors, used in grSet.theme === 'custom01' - 'custom10'.
 * @property {boolean} lightBgPlaylist - Color definition for pl.col.bg when to lighten or darken custom theme colors, used in grSet.theme === 'custom01' - 'custom10'.
 * @property {boolean} lightBgDetails - Color definition for col.detailsBg) when to lighten or darken custom theme colors, used in grSet.theme === 'custom01' - 'custom10'.
 * @property {boolean} lightBgLibrary - Color definition for ui.col.bg when to lighten or darken custom theme colors, used in grSet.theme === 'custom01' - 'custom10'.
 * @property {boolean} lightBgBiography - Color definition for bio.ui.col.bg when to lighten or darken custom theme colors, used in grSet.theme === 'custom01' - 'custom10'.
 */
/** @global @type {grCol} */
const grCol = {
	colBrightness: 0,
	colBrightness2: 0,
	imgBrightness: 0,
	imgBlended: null,
	isColored: false,
	lightBg: false,
	lightBgLib: false,
	lightBgBio: false,
	lightBgMain: false,
	lightBgPlaylist: false,
	lightBgDetails: false,
	lightBgLibrary: false,
	lightBgBiography: false
};
