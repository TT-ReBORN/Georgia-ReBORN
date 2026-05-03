/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Setup                                    * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-05-2026                                              * //
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
 * @property {MainUI} ui - The instance of `MainUI` class for main user interface operations.
 * @property {Debug} debug - The instance of `Debug` class for debugging operations.
 * @property {Details} details - The instance of `Details` class for details interface operations.
 * @property {ThemeDayNight} day - The instance of `ThemeDayNight` class for theme day/night mode operations.
 * @property {ThemeSettingsManager} settings - The instance of `ThemeSettingsManager` class for theme settings operations.
 * @property {Display} display - The instance of `Display` class for UI display operations.
 * @property {Color} color - The instance of `Color` class for main color operations.
 * @property {ColorDebug} colorDebug - The instance of `ColorDebug` class for color debug operations.
 * @property {ColorSystem} colorSystem - The instance of `ColorSystem` class for color-system operations.
 * @property {ColorPalette} colorPalette - The instance of `ColorPalette` class for storing default theme colors.
 * @property {ColorManager} colorManager - The instance of `ColorManager` class for manaing theme color-related operations.
 * @property {ColorThemes} colorThemes - The instance of `ColorThemes` class for theme color operations.
 * @property {ColorStyles} colorStyles - The instance of `ColorStyles` class for style color operations.
 * @property {ThemePreset} preset - The instance of `ThemePreset` class for theme preset operations.
 * @property {TopMenu} topMenu - The instance of `TopMenu` class for top menu interface operations.
 * @property {TopMenuOptions} options - The instance of `TopMenuOptions` class for top menu option management operations.
 * @property {ContextMenus} ctxMenu - The instance of `ContextMenus` class for context menu operations.
 * @property {MenuInputBox} inputBox - The instance of `MenuInputBox` class for menu input box operations.
 * @property {CustomMenu} cusMenu - The instance of `CustomMenu` class for custom menu base control operations.
 * @property {CustomThemeMenu} cthMenu - The instance of `CustomThemeMenu` class for custom theme menu operations.
 * @property {MetadataGridMenu} gridMenu - The instance of `MetadataGridMenu` class for metadata grid menu operations.
 * @property {ArtCache} artCache - The instance of `ArtCache` class for artwork caching operations.
 * @property {BackgroundImage} bgImg - The instance of `BackgroundImage` class for background image operations.
 * @property {CPUTracker} cpuTrack - The instance of `CPUTracker` class for cpu tracking operations.
 * @property {Scaling} scaling - The instance of `Scaling` class for scaling size operations.
 * @property {MessageManager} msg - The instance of `MessageManager` class for message operations.
 * @property {Button} button - The instance of `Button` class for button operations.
 * @property {PauseButton} pauseBtn - The instance of `PauseButton` class for pause button operations.
 * @property {VolumeButton} volBtn - The instance of `VolumeButton` class for volume button operations.
 * @property {TooltipHandler} ttip - The instance of `TooltipHandler` class for tooltip handling operations.
 * @property {Timeline} timeline - The instance of `Timeline` class for timeline operations.
 * @property {PlaylistHistory} history - The instance of `PlaylistHistory` class for playlist history operations.
 * @property {JumpSearch} jSearch - The instance of `JumpSearch` class for jump search operations.
 * @property {ProgressBar} progBar - The instance of `ProgressBar` class for progress bar display operations.
 * @property {PeakmeterBar} peakBar - The instance of `PeakmeterBar` class for peak meter bar display operations.
 * @property {WaveformBar} waveBar - The instance of `WaveformBar` class for waveform bar display operations.
 * @property {Lyrics} lyrics - The instance of `Lyrics` class for lyrics-related operations.
 * @property {FileManager} fman - The instance of `FileManager` class for file and backup operations.
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
		const paths = grCfg.discArtPaths.map(path => $(path));
		return paths.flatMap(pattern => utils.Glob(pattern));
	},

	/**
	 * A collection of all disc art stub paths to search in.
	 * This method returns an object where the key is the disc art stub name and the value is the path to the image.
	 * @type {() => { [key: string]: string }} A function returning an object with string keys and string values.
	 */
	discArtStubPaths() {
		return {
			cdAlbumCover:       `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-cd-transparent.png`,
			cdWhite:            `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-cd-white.png`,
			cdBlack:            `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-cd-black.png`,
			cdBlank:            `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-cd-blank.png`,
			cdTrans:            `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-cd-transparent.png`,
			vinylAlbumCover:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-black-hole.png`,
			vinylWhite:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-white.png`,
			vinylVoid:          `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-void.png`,
			vinylColdFusion:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-cold-fusion.png`,
			vinylRingOfFire:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-ring-of-fire.png`,
			vinylMaple:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-maple.png`,
			vinylBlack:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-black.png`,
			vinylBlackHole:     `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-black-hole.png`,
			vinylEbony:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-ebony.png`,
			vinylTrans:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\common-vinyl-transparent.png`,
			themeCdBlue:        `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-blue.png`,
			themeCdDarkBlue:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-dark-blue.png`,
			themeCdRed:         `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-red.png`,
			themeCdCream:       `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-cream.png`,
			themeCdNblue:       `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-neon-blue.png`,
			themeCdNgreen:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-neon-green.png`,
			themeCdNred:        `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-neon-red.png`,
			themeCdNgold:       `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-cd-neon-gold.png`,
			themeVinylBlue:     `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-blue.png`,
			themeVinylDarkBlue: `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-dark-blue.png`,
			themeVinylRed:      `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-red.png`,
			themeVinylCream:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-cream.png`,
			themeVinylNblue:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-neon-blue.png`,
			themeVinylNgreen:   `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-neon-green.png`,
			themeVinylNred:     `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-neon-red.png`,
			themeVinylNgold:    `${fb.ProfilePath}georgia-reborn\\images\\discart\\theme-vinyl-neon-gold.png`
		};
	},

	// * CUSTOM DISC ART STUBS * //
	discArtCustomStub: `${fb.ProfilePath}georgia-reborn\\images\\custom\\discart\\${grSet.discArtStub}.png`,

	/**
	 * Generates the path to the Hi-Res audio logo based on the resolution and shape preference.
	 * @returns {string} The path to the Hi-Res audio logo image.
	 */
	hiResAudioLogoPath() {
		const plus4k = HD_4K('', '4K-');
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
	lyricsPath() {
		return [
			$('$replace($replace(%path%,%filename_ext%,),,\\)'),
			$(`${grCfg.customLyricsDir}\\`),
			`${fb.ProfilePath}cache\\lyrics\\`,
			`${fb.FoobarPath}cache\\lyrics\\`
		];
	}
};


///////////////
// * FONTS * //
///////////////
/**
 * A collection of theme fonts that are assigned at runtime in the `createFonts` method.
 * @typedef  {object} grFont - The Georgia-ReBORN font object.
 * @property {string} fontRebornSymbols - The 'Reborn-Symbols' font name.
 * @property {string} fontSegoeUISymbol - The 'Segoe UI Symbol' font name.
 * @property {string} fontDefault - The 'Segoe UI' font name.
 * @property {string} fontTopMenu - The 'Segoe UI Semibold' font name.
 * @property {string} fontTopMenuCaption - The 'Reborn-Symbols' font name.
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
 * @property {string} fontLibExHeader - The 'Segoe UI Semibold' font name.
 * @property {string} fontBiography - The 'Segoe UI' font name.
 * @property {string} fontLyrics - The 'Segoe UI' font name.
 * @property {GdiFont} topMenu - The theme font 'Segoe UI Semibold' used for top menu buttons.
 * @property {GdiFont} topMenuCaption - The theme font 'Reborn-Symbols' used for top menu 🗕 🗖 ✖ caption buttons.
 * @property {GdiFont} topMenuCompact - The theme font 'Reborn-Symbols' used for the top menu compact button.
 * @property {GdiFont} lowerBarArtist - The theme artist font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} lowerBarTitle - The theme title font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lowerBarDisc - The theme disc font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lowerBarTime - The theme time font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} lowerBarLength - The theme length font 'HelveticaNeueLT Pro 45 Lt' used in lower bar.
 * @property {GdiFont} lowerBarWave - The theme waveform bar font 'HelveticaNeueLT Pro 65 Md' used in lower bar.
 * @property {GdiFont} noAlbumArtStub - The theme font ''Reborn-Symbols' used for no album art music note symbol.
 * @property {GdiFont} noAlbumArtStub2 - The theme font ''Reborn-Symbols' used for no album art music radio symbol.
 * @property {GdiFont} notification - The theme font 'HelveticaNeueLT Pro 65 Md' used for notifications.
 * @property {GdiFont} popup - The theme font 'Segoe UI' used for popups.
 * @property {GdiFont} tooltip - The theme font 'HelveticaNeueLT Pro 65 Md' used for styled tooltips.
 * @property {GdiFont} gridArtist - The theme font 'HelveticaNeueLT Pro 65 Md' used for metadata grid artist.
 * @property {GdiFont} gridTrackNumber - The theme font 'HelveticaNeueLT Pro 45 Lt' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid track number.
 * @property {GdiFont} gridTitle - The theme font 'HelveticaNeueLT Pro 45 Lt' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid title.
 * @property {GdiFont} gridAlbum - The theme font 'HelveticaNeueLT Pro 65 Md' used for metadata grid album.
 * @property {GdiFont} gridKey - The theme font 'HelveticaNeueLT Pro 75 Bd' or 'HelveticaNeueLT Pro 65 Md' used for metadata grid key.
 * @property {GdiFont} gridVal - The theme font 'HelveticaNeueLT Pro 45 Lt' used for metadata grid value.
 * @property {GdiFont} library - The panel font 'Segoe UI' used in the Library.
 * @property {GdiFont} libExClose - The close button font 'Reborn-Symbols' used in the Library Explorer.
 * @property {GdiFont} libExHeader - The header font 'Segoe UI Semibold' used in the Library Explorer.
 * @property {GdiFont} libExPlaying - The playback font 'Reborn-Symbols' used in the Library Explorer.
 * @property {GdiFont} libExRebornSymbols - The reborn symbols font 'Reborn-Symbols' used in the Library Explorer.
 * @property {GdiFont} libExRebornSymbolsLarge - The reborn symbols font 'Reborn-Symbols' used in the Library Explorer.
 * @property {GdiFont} libExRebornSymbolsXL - The reborn symbols font 'Reborn-Symbols' used in the Library Explorer.
 * @property {GdiFont} biography - The panel font 'Segoe UI' used in the Biography.
 * @property {GdiFont} lyrics - The panel font 'Segoe UI' used in the Lyrics.
 * @property {GdiFont} lyricsHighlight - The panel font 'Segoe UI' used in Lyrics for synced lines.
 */
/** @global @type {grFont} */
const grFont = {
	fontRebornSymbols:  'Reborn-Symbols',
	fontSegoeUISymbol:  'Segoe UI Symbol',

	fontDefault:        grSet.customThemeFonts ? grCfg.customFont.fontDefault : 'Segoe UI',
	fontTopMenu:        grSet.customThemeFonts ? grCfg.customFont.fontTopMenu : 'Segoe UI Semibold',
	fontTopMenuCaption: 'Reborn-Symbols',

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
						DetectWine()           ? 'HelveticaNeueLT Pro 65 Md'         : 'HelveticaNeueLT Pro 75 Bd',
	fontGridValue:      grSet.customThemeFonts ? grCfg.customFont.fontGridValue      : 'HelveticaNeueLT Pro 45 Lt',

	fontLibrary:        grSet.customThemeFonts ? grCfg.customFont.fontLibrary        : 'Segoe UI',
	fontLibExHeader:    grSet.customThemeFonts ? grCfg.customFont.fontLibExHeader    : 'Segoe UI Semibold',
	fontBiography:      grSet.customThemeFonts ? grCfg.customFont.fontBiography      : 'Segoe UI',
	fontLyrics:         grSet.customThemeFonts ? grCfg.customFont.fontLyrics         : 'Segoe UI'
};


/////////////////
// * STRINGS * //
/////////////////
/**
 * A collection of strings and other objects to be displayed throughout UI.
 * @typedef  {object} grStr - The Georgia-ReBORN string object.
 * @property {string} artist - The artist will be shown in Details.
 * @property {string} artistLower - The artist will be shown will be shown above the progress bar in the lower bar.
 * @property {string} composer - The composer will be shown in the lower bar if it exist and enabled.
 * @property {string} album - The album will be shown in Details.
 * @property {string} album_subtitle - The album subtitle string is currently not used in the theme.
 * @property {string} disc - The disc string by default is displayed in the lower bar if there is more than one total disc.
 * @property {Array} grid - The metadata grid strings in Details.
 * @property {string} length - The length of the song in MM:SS format.
 * @property {string} original_artist - The original artist will be shown on the right side of the title in the lower bar.
 * @property {string} time - The current time of the song in MM:SS format in the lower bar.
 * @property {string} title - The title of the song.
 * @property {string} titleLower - The title of the song will be shown above the progress bar in the lower bar. Can include more information such as translation, original artist, etc.
 * @property {string} tracknum - The track number of the song.
 * @property {string} year - The year string is currently not used in the theme.
 */
/** @global @type {grStr} */
const grStr = {
	artist: '',
	artistLower: '',
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
 *
 * // BASE COLORS
 * @property {number} primary - The primary theme color in RGB (adjusted for visibility).
 * @property {number} secondary - The secondary theme color in RGB (adjusted for visibility).
 * @property {number} primary_raw - The original, unadjusted primary color selected from the artwork palette.
 * @property {number} secondary_raw - The original, unadjusted secondary color selected from the artwork palette.
 *
 * // PRIMARY RGB TONES
 * @property {number} primary_rgb_t000 - The primary color with 0% tint.
 * @property {number} primary_rgb_t002 - The primary color with 2% tint.
 * @property {number} primary_rgb_t005 - The primary color with 5% tint.
 * @property {number} primary_rgb_t007 - The primary color with 7% tint.
 * @property {number} primary_rgb_t010 - The primary color with 10% tint.
 * @property {number} primary_rgb_t015 - The primary color with 15% tint.
 * @property {number} primary_rgb_t020 - The primary color with 20% tint.
 * @property {number} primary_rgb_t025 - The primary color with 25% tint.
 * @property {number} primary_rgb_t030 - The primary color with 30% tint.
 * @property {number} primary_rgb_t035 - The primary color with 35% tint.
 * @property {number} primary_rgb_t040 - The primary color with 40% tint.
 * @property {number} primary_rgb_t045 - The primary color with 45% tint.
 * @property {number} primary_rgb_t050 - The primary color with 50% tint.
 * @property {number} primary_rgb_t060 - The primary color with 60% tint.
 * @property {number} primary_rgb_t065 - The primary color with 65% tint.
 * @property {number} primary_rgb_t075 - The primary color with 75% tint.
 * @property {number} primary_rgb_t080 - The primary color with 80% tint.
 * @property {number} primary_rgb_t090 - The primary color with 90% tint.
 * @property {number} primary_rgb_t100 - The primary color with 100% tint.
 *
 * @property {number} primary_rgb_s000 - The primary color with 0% shade.
 * @property {number} primary_rgb_s002 - The primary color with 2% shade.
 * @property {number} primary_rgb_s005 - The primary color with 5% shade.
 * @property {number} primary_rgb_s007 - The primary color with 7% shade.
 * @property {number} primary_rgb_s010 - The primary color with 10% shade.
 * @property {number} primary_rgb_s015 - The primary color with 15% shade.
 * @property {number} primary_rgb_s020 - The primary color with 20% shade.
 * @property {number} primary_rgb_s025 - The primary color with 25% shade.
 * @property {number} primary_rgb_s030 - The primary color with 30% shade.
 * @property {number} primary_rgb_s035 - The primary color with 35% shade.
 * @property {number} primary_rgb_s040 - The primary color with 40% shade.
 * @property {number} primary_rgb_s045 - The primary color with 45% shade.
 * @property {number} primary_rgb_s050 - The primary color with 50% shade.
 * @property {number} primary_rgb_s060 - The primary color with 60% shade.
 * @property {number} primary_rgb_s065 - The primary color with 65% shade.
 * @property {number} primary_rgb_s075 - The primary color with 75% shade.
 * @property {number} primary_rgb_s080 - The primary color with 80% shade.
 * @property {number} primary_rgb_s090 - The primary color with 90% shade.
 * @property {number} primary_rgb_s100 - The primary color with 100% shade.
 *
 * // SECONDARY RGB TONES
 * @property {number} secondary_rgb_t000 - The secondary color with 0% tint.
 * @property {number} secondary_rgb_t002 - The secondary color with 2% tint.
 * @property {number} secondary_rgb_t005 - The secondary color with 5% tint.
 * @property {number} secondary_rgb_t007 - The secondary color with 7% tint.
 * @property {number} secondary_rgb_t010 - The secondary color with 10% tint.
 * @property {number} secondary_rgb_t015 - The secondary color with 15% tint.
 * @property {number} secondary_rgb_t020 - The secondary color with 20% tint.
 * @property {number} secondary_rgb_t025 - The secondary color with 25% tint.
 * @property {number} secondary_rgb_t030 - The secondary color with 30% tint.
 * @property {number} secondary_rgb_t035 - The secondary color with 35% tint.
 * @property {number} secondary_rgb_t040 - The secondary color with 40% tint.
 * @property {number} secondary_rgb_t045 - The secondary color with 45% tint.
 * @property {number} secondary_rgb_t050 - The secondary color with 50% tint.
 * @property {number} secondary_rgb_t060 - The secondary color with 60% tint.
 * @property {number} secondary_rgb_t065 - The secondary color with 65% tint.
 * @property {number} secondary_rgb_t075 - The secondary color with 75% tint.
 * @property {number} secondary_rgb_t080 - The secondary color with 80% tint.
 * @property {number} secondary_rgb_t090 - The secondary color with 90% tint.
 * @property {number} secondary_rgb_t100 - The secondary color with 100% tint.
 *
 * @property {number} secondary_rgb_s000 - The secondary color with 0% shade.
 * @property {number} secondary_rgb_s002 - The secondary color with 2% shade.
 * @property {number} secondary_rgb_s005 - The secondary color with 5% shade.
 * @property {number} secondary_rgb_s007 - The secondary color with 7% shade.
 * @property {number} secondary_rgb_s010 - The secondary color with 10% shade.
 * @property {number} secondary_rgb_s015 - The secondary color with 15% shade.
 * @property {number} secondary_rgb_s020 - The secondary color with 20% shade.
 * @property {number} secondary_rgb_s025 - The secondary color with 25% shade.
 * @property {number} secondary_rgb_s030 - The secondary color with 30% shade.
 * @property {number} secondary_rgb_s035 - The secondary color with 35% shade.
 * @property {number} secondary_rgb_s040 - The secondary color with 40% shade.
 * @property {number} secondary_rgb_s045 - The secondary color with 45% shade.
 * @property {number} secondary_rgb_s050 - The secondary color with 50% shade.
 * @property {number} secondary_rgb_s060 - The secondary color with 60% shade.
 * @property {number} secondary_rgb_s065 - The secondary color with 65% shade.
 * @property {number} secondary_rgb_s075 - The secondary color with 75% shade.
 * @property {number} secondary_rgb_s080 - The secondary color with 80% shade.
 * @property {number} secondary_rgb_s090 - The secondary color with 90% shade.
 * @property {number} secondary_rgb_s100 - The secondary color with 100% shade.
 *
 * // PRIMARY OKLCH TONES - Perceptually uniform
 * @property {number} primary_oklch_t000 - The primary color with 0% tint in OKLCH.
 * @property {number} primary_oklch_t002 - The primary color with 2% tint in OKLCH.
 * @property {number} primary_oklch_t005 - The primary color with 5% tint in OKLCH.
 * @property {number} primary_oklch_t007 - The primary color with 7% tint in OKLCH.
 * @property {number} primary_oklch_t010 - The primary color with 10% tint in OKLCH.
 * @property {number} primary_oklch_t015 - The primary color with 15% tint in OKLCH.
 * @property {number} primary_oklch_t020 - The primary color with 20% tint in OKLCH.
 * @property {number} primary_oklch_t025 - The primary color with 25% tint in OKLCH.
 * @property {number} primary_oklch_t030 - The primary color with 30% tint in OKLCH.
 * @property {number} primary_oklch_t035 - The primary color with 35% tint in OKLCH.
 * @property {number} primary_oklch_t040 - The primary color with 40% tint in OKLCH.
 * @property {number} primary_oklch_t045 - The primary color with 45% tint in OKLCH.
 * @property {number} primary_oklch_t050 - The primary color with 50% tint in OKLCH.
 * @property {number} primary_oklch_t060 - The primary color with 60% tint in OKLCH.
 * @property {number} primary_oklch_t065 - The primary color with 65% tint in OKLCH.
 * @property {number} primary_oklch_t075 - The primary color with 75% tint in OKLCH.
 * @property {number} primary_oklch_t080 - The primary color with 80% tint in OKLCH.
 * @property {number} primary_oklch_t090 - The primary color with 90% tint in OKLCH.
 * @property {number} primary_oklch_t100 - The primary color with 100% tint in OKLCH.
 *
 * @property {number} primary_oklch_s000 - The primary color with 0% shade in OKLCH.
 * @property {number} primary_oklch_s002 - The primary color with 2% shade in OKLCH.
 * @property {number} primary_oklch_s005 - The primary color with 5% shade in OKLCH.
 * @property {number} primary_oklch_s007 - The primary color with 7% shade in OKLCH.
 * @property {number} primary_oklch_s010 - The primary color with 10% shade in OKLCH.
 * @property {number} primary_oklch_s015 - The primary color with 15% shade in OKLCH.
 * @property {number} primary_oklch_s020 - The primary color with 20% shade in OKLCH.
 * @property {number} primary_oklch_s025 - The primary color with 25% shade in OKLCH.
 * @property {number} primary_oklch_s030 - The primary color with 30% shade in OKLCH.
 * @property {number} primary_oklch_s035 - The primary color with 35% shade in OKLCH.
 * @property {number} primary_oklch_s040 - The primary color with 40% shade in OKLCH.
 * @property {number} primary_oklch_s045 - The primary color with 45% shade in OKLCH.
 * @property {number} primary_oklch_s050 - The primary color with 50% shade in OKLCH.
 * @property {number} primary_oklch_s060 - The primary color with 60% shade in OKLCH.
 * @property {number} primary_oklch_s065 - The primary color with 65% shade in OKLCH.
 * @property {number} primary_oklch_s075 - The primary color with 75% shade in OKLCH.
 * @property {number} primary_oklch_s080 - The primary color with 80% shade in OKLCH.
 * @property {number} primary_oklch_s090 - The primary color with 90% shade in OKLCH.
 * @property {number} primary_oklch_s100 - The primary color with 100% shade in OKLCH.
 *
 * // SECONDARY OKLCH TONES
 * @property {number} secondary_oklch_t000 - The secondary color with 0% tint in OKLCH.
 * @property {number} secondary_oklch_t002 - The secondary color with 2% tint in OKLCH.
 * @property {number} secondary_oklch_t005 - The secondary color with 5% tint in OKLCH.
 * @property {number} secondary_oklch_t007 - The secondary color with 7% tint in OKLCH.
 * @property {number} secondary_oklch_t010 - The secondary color with 10% tint in OKLCH.
 * @property {number} secondary_oklch_t015 - The secondary color with 15% tint in OKLCH.
 * @property {number} secondary_oklch_t020 - The secondary color with 20% tint in OKLCH.
 * @property {number} secondary_oklch_t025 - The secondary color with 25% tint in OKLCH.
 * @property {number} secondary_oklch_t030 - The secondary color with 30% tint in OKLCH.
 * @property {number} secondary_oklch_t035 - The secondary color with 35% tint in OKLCH.
 * @property {number} secondary_oklch_t040 - The secondary color with 40% tint in OKLCH
 * @property {number} secondary_oklch_t045 - The secondary color with 45% tint in OKLCH
 * @property {number} secondary_oklch_t050 - The secondary color with 50% tint in OKLCH.
 * @property {number} secondary_oklch_t060 - The secondary color with 60% tint in OKLCH.
 * @property {number} secondary_oklch_t065 - The secondary color with 65% tint in OKLCH.
 * @property {number} secondary_oklch_t075 - The secondary color with 75% tint in OKLCH.
 * @property {number} secondary_oklch_t080 - The secondary color with 80% tint in OKLCH.
 * @property {number} secondary_oklch_t090 - The secondary color with 90% tint in OKLCH.
 * @property {number} secondary_oklch_t100 - The secondary color with 100% tint in OKLCH.
 *
 * @property {number} secondary_oklch_s000 - The secondary color with 0% shade in OKLCH.
 * @property {number} secondary_oklch_s002 - The secondary color with 2% shade in OKLCH.
 * @property {number} secondary_oklch_s005 - The secondary color with 5% shade in OKLCH.
 * @property {number} secondary_oklch_s007 - The secondary color with 7% shade in OKLCH.
 * @property {number} secondary_oklch_s010 - The secondary color with 10% shade in OKLCH.
 * @property {number} secondary_oklch_s015 - The secondary color with 15% shade in OKLCH.
 * @property {number} secondary_oklch_s020 - The secondary color with 20% shade in OKLCH.
 * @property {number} secondary_oklch_s025 - The secondary color with 25% shade in OKLCH.
 * @property {number} secondary_oklch_s030 - The secondary color with 30% shade in OKLCH.
 * @property {number} secondary_oklch_s035 - The secondary color with 35% shade in OKLCH.
 * @property {number} secondary_oklch_s040 - The secondary color with 40% shade in OKLCH.
 * @property {number} secondary_oklch_s045 - The secondary color with 45% shade in OKLCH.
 * @property {number} secondary_oklch_s050 - The secondary color with 50% shade in OKLCH.
 * @property {number} secondary_oklch_s060 - The secondary color with 60% shade in OKLCH.
 * @property {number} secondary_oklch_s065 - The secondary color with 65% shade in OKLCH.
 * @property {number} secondary_oklch_s075 - The secondary color with 75% shade in OKLCH.
 * @property {number} secondary_oklch_s080 - The secondary color with 80% shade in OKLCH.
 * @property {number} secondary_oklch_s090 - The secondary color with 90% shade in OKLCH.
 * @property {number} secondary_oklch_s100 - The secondary color with 100% shade in OKLCH.
 *
 * // UI ELEMENT COLORS
 * @property {number} artist - The color of artist text on background.
 * @property {number} bg - The background of the main panel.
 * @property {number} rating - The color of rating stars in metadata grid.
 * @property {number} hotness - The color of hotness text in metadata grid.
 * @property {number} timelineAdded - The background color for timeline block in Details from added to first played.
 * @property {number} timelinePlayed - The background color for timeline block in Details from first played to last played.
 * @property {number} timelineUnplayed - The background color for timeline block in Details from last played to present time.
 * @property {number} progressBar - The background of the progress bar. Fill will be primary.
 * @property {number} shadow - The color of the shadow.
 *
 * // COLOR METRICS AND STATES
 * @property {number} colBrightness - The calculated primary color brightness used in grSet.theme === 'white, 'black', 'reborn', 'random'.
 * @property {number} colBrightness2 - The calculated secondary color brightness used in grSet.styleRebornFusion, grSet.styleRebornFusion2, grSet.styleRebornFusionAccent.
 * @property {number} colLuminance - The calculated primary color APCA luminance (0.0-1.0) used in grSet.theme === 'white', 'black', 'reborn', 'random'.
 * @property {number} colLuminance2 - The calculated secondary color APCA luminance (0.0-1.0) used in grSet.styleRebornFusion, grSet.styleRebornFusion2, grSet.styleRebornFusionAccent.
 * @property {number} imgBrightness - The calculated image brightness used in grSet.styleBlend, grSet.styleBlend2, grSet.styleBlackAndWhite, grSet.styleBlackAndWhite2, grSet.styleBlackAndWhiteReborn.
 * @property {GdiBitmap} imgBlended - The blended image from grm.colorStyles.setStyleBlend().
 * @property {number} imgLuminance - The calculated image APCA luminance (0.0-1.0) used in grSet.styleBlend, grSet.styleBlend2, grSet.styleBlackAndWhite, grSet.styleBlackAndWhite2, grSet.styleBlackAndWhiteReborn.
 * @property {number} imgSaturation - The calculated average image saturation (0-100) weighted by color frequency, used for saturation compensation in styleBlend.
 * @property {boolean} isColored - The color state that checks if background color is not full white RGB(255, 255, 255), used in Reborn/Random theme when init on start or when noAlbumArtStub displayed.
 * @property {boolean} lightBgMain - The color definition for col.bg when to lighten or darken custom theme colors.
 * @property {boolean} lightBgPlaylist - The color definition for pl.col.bg when to lighten or darken custom theme colors.
 * @property {boolean} lightBgDetails - The color definition for col.detailsBg when to lighten or darken custom theme colors.
 * @property {boolean} lightBgLibrary - The color definition for ui.col.bg when to lighten or darken custom theme colors.
 * @property {boolean} lightBgBiography - The color definition for bio.ui.col.bg when to lighten or darken custom theme colors.
 */
/** @global @type {grCol} */
const grCol = {
	colBrightness: 0,
	colBrightness2: 0,
	colLuminance: 0,
	colLuminance2: 0,
	imgBrightness: 0,
	imgBlended: null,
	imgLuminance: 0,
	imgSaturation: 0,
	isColored: false,
	lightBgMain: false,
	lightBgPlaylist: false,
	lightBgDetails: false,
	lightBgLibrary: false,
	lightBgBiography: false
};


///////////////
// * ALIAS * //
///////////////
/**
 * A collection of A live "Namespace Alias" for grSet settings.
 * @typedef  {object} grAlias     - The Georgia-ReBORN alias object.
 * @property {string}  THEME      - Options > Theme.
 * @property {boolean} DYNTHEME   - Options > Theme > White, Black, Reborn, Random.
 * @property {boolean} CTHEME     - Options > Theme > Custom.
 * @property {boolean} BEVEL      - Options > Style > Bevel.
 * @property {boolean} BLEND      - Options > Style > Blend.
 * @property {boolean} BLEND2     - Options > Style > Blend 2.
 * @property {boolean} BLEND12    - Options > Style > Blend or Blend 2.
 * @property {boolean} GRAD       - Options > Style > Gradient.
 * @property {boolean} GRAD2      - Options > Style > Gradient 2.
 * @property {boolean} GRAD12     - Options > Style > Gradient or Gradient 2.
 * @property {boolean} ALT        - Options > Style > Alternative.
 * @property {boolean} ALT2       - Options > Style > Alternative 2.
 * @property {boolean} BW         - Options > Style > Black and white ( White theme ).
 * @property {boolean} BW2        - Options > Style > Black and white 2 ( White theme ).
 * @property {boolean} BWR        - Options > Style > Black and white reborn ( White theme ).
 * @property {boolean} BR         - Options > Style > Black reborn ( Black theme ).
 * @property {boolean} RW         - Options > Style > Reborn white ( Reborn theme ).
 * @property {boolean} RB         - Options > Style > Reborn black ( Reborn theme ).
 * @property {boolean} RF         - Options > Style > Reborn fusion ( Reborn theme ).
 * @property {boolean} RF2        - Options > Style > Reborn fusion 2 ( Reborn theme ).
 * @property {boolean} RF12       - Options > Style > Reborn fusion and Reborn fusion 2 ( Reborn theme ).
 * @property {boolean} RFA        - Options > Style > Reborn fusion accent ( Reborn theme ).
 * @property {boolean} RP         - Options > Style > Random pastel ( Random theme ).
 * @property {boolean} RD         - Options > Style > Random dark ( Random theme ).
 * @property {string}  RAC        - Options > Style > Auto color ( Random theme ).
 * @property {string}  TMB        - Options > Style > Buttons > Top menu.
 * @property {string}  TPB        - Options > Style > Buttons > Transport.
 * @property {string}  PBD        - Options > Style > Progress bar > Design.
 * @property {string}  PB         - Options > Style > Progress bar > Background.
 * @property {string}  PBF        - Options > Style > Progress bar > Progress fill.
 * @property {string}  VBD        - Options > Style > Volume bar > Design.
 * @property {string}  VB         - Options > Style > Volume bar > Background.
 * @property {string}  VBF        - Options > Style > Volume bar > Volume fill.
 * @property {string|number} BRT  - Options > Display > Brightness.
 * @property {string}  LAYOUT     - Options > Layout.
 * @property {boolean} NIGHTTIME  - The state when theme is nighttime.
 * @property {function} update    - Updates the values of all style flags based on current grSet settings.
 *
 * Template:
 * const {
 *	THEME, DYNTHEME, CTHEME, BEVEL, BLEND, BLEND2, BLEND12, GRAD, GRAD2, GRAD12, ALT, ALT2,
 *	BW, BW2, BWR, BR, RW, RB, RF, RF2, RF12, RFA, RP, RD, RAC,
 *	TMB, TPB, PBD, PB, PBF, VBD, VB, VBF, LAYOUT, NIGHTTIME
 *} = grAlias;
 */
/** @global @type {grAlias} */
const grAlias = {
	THEME: '',
	DYNTHEME: false,
	CTHEME: false,
	BEVEL: false,
	BLEND: false,
	BLEND2: false,
	BLEND12: false,
	GRAD: false,
	GRAD2: false,
	GRAD12: false,
	ALT: false,
	ALT2: false,
	BW: false,
	BW2: false,
	BWR: false,
	BR: false,
	RW: false,
	RB: false,
	RF: false,
	RF2: false,
	RF12: false,
	RFA: false,
	RP: false,
	RD: false,
	RAC: '',
	TMB: '',
	TPB: '',
	PBD: '',
	PB: '',
	PBF: '',
	VBD: '',
	VB: '',
	VBF: '',
	BRT: '',
	LAYOUT: '',
	NIGHTTIME: false,

	update() {
		this.THEME     = grSet.theme;
		this.DYNTHEME  = ['white', 'black', 'reborn', 'random'].includes(grSet.theme);
		this.CTHEME    = grSet.theme.startsWith('custom');
		this.BEVEL     = grSet.styleBevel;
		this.BLEND     = grSet.styleBlend;
		this.BLEND2    = grSet.styleBlend2;
		this.BLEND12   = grSet.styleBlend || grSet.styleBlend2;
		this.GRAD      = grSet.styleGradient;
		this.GRAD2     = grSet.styleGradient2;
		this.GRAD12    = grSet.styleGradient || grSet.styleGradient2;
		this.ALT       = grSet.styleAlternative;
		this.ALT2      = grSet.styleAlternative2;
		this.BW        = grSet.styleBlackAndWhite;
		this.BW2       = grSet.styleBlackAndWhite2;
		this.BWR       = grSet.styleBlackAndWhiteReborn;
		this.BR        = grSet.styleBlackReborn;
		this.RW        = grSet.styleRebornWhite;
		this.RB        = grSet.styleRebornBlack;
		this.RF        = grSet.styleRebornFusion;
		this.RF2       = grSet.styleRebornFusion2;
		this.RF12      = grSet.styleRebornFusion || grSet.styleRebornFusion2;
		this.RFA       = grSet.styleRebornFusionAccent;
		this.RP        = grSet.styleRandomPastel;
		this.RD        = grSet.styleRandomDark;
		this.RAC       = grSet.styleRandomAutoColor;
		this.TMB       = grSet.styleTopMenuButtons;
		this.TPB       = grSet.styleTransportButtons;
		this.PBD       = grSet.styleProgressBarDesign;
		this.PB        = grSet.styleProgressBar;
		this.PBF       = grSet.styleProgressBarFill;
		this.VBD       = grSet.styleVolumeBarDesign;
		this.VB        = grSet.styleVolumeBar;
		this.VBF       = grSet.styleVolumeBarFill;
		this.BRT       = grSet.themeBrightness;
		this.LAYOUT    = grSet.layout;
		this.NIGHTTIME = !grSet.styleRebornWhite &&
			(['reborn', 'random'].includes(grSet.theme) && grSet.styleNighttime ||
			grSet.themeDayNightEnabled && grSet.themeDayNightTime === 'night');
	}
};
