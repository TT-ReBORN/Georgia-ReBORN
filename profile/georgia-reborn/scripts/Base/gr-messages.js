/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Messages                                 * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////
// * MESSAGES * //
//////////////////
/**
 * A class that manages messages and popups for various user interactions.
 */
class MessageManager {
	/**
	 * Create the `MessageManager` instance.
	 */
	constructor() {
		/**
		 * A collection of messages related to main UI actions.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMain = {};

		/**
		 * A collection of messages related to theme color actions.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgThemeColors = {};

		/**
		 * A collection of messages related to top menu `Options` > `Design`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuDesignOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Theme`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuThemeOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Style`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuStyleOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Preset`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuPresetOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Player controls`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuPlayerControlsOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Details`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuDetailsOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Library`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuLibraryOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Biography`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuBiographyOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Settings`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuSettingsOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Developer tools`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuDevToolsOptions = {};

		/**
		 * A collection of messages related to the context menus.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgContextMenu = {};

		/**
		 * A collection of messages related to the input box actions.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgInputBox = {};
	}

	/**
	 * Initializes the message objects and their properties and keys.
	 * @returns {void}
	 */
	initMessages() {
		this.msgMain = {
			fontsNotInstalled: {
				msg: 'Georgia-ReBORN WAS UNABLE TO LOAD SOME FONTS\n\n'
					+ 'Be sure all fonts from\n'
					+ 'foobar2000\\profile\\georgia-reborn\\fonts\n'
					+ 'are correctly installed in these directories:\n\n'
					+ 'For Windows: C:\\Windows\\Fonts\\\n'
					+ 'For Linux: /usr/share/fonts or ~/.local/share/fonts\n\n'
					+ 'If you use custom fonts, all your custom fonts need to have\n'
					+ 'the exact font name / font family name in your\n'
					+ 'foobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc config file.\n\n'
					+ 'You can also check foobar\'s console ( Top menu > View > Console ),\n'
					+ 'it will show font errors with its wrong font names.'
			},
			customFontsUsed: {
				msg: '\nCustom fonts are currently being used:\n\n'
					+ `Panel default: ${grCfg.customFont.fontDefault}\n`
					+ `Top menu: ${grCfg.customFont.fontTopMenu}\n`
					+ `Lower bar artist: ${grCfg.customFont.fontLowerBarArtist}\n`
					+ `Lower bar title: ${grCfg.customFont.fontLowerBarTitle}\n`
					+ `Lower bar disc: ${grCfg.customFont.fontLowerBarDisc}\n`
					+ `Lower bar time: ${grCfg.customFont.fontLowerBarTime}\n`
					+ `Lower bar length: ${grCfg.customFont.fontLowerBarLength}\n`
					+ `Lower bar waveform bar: ${grCfg.customFont.fontLowerBarWave}\n`
					+ `Notification: ${grCfg.customFont.fontNotification}\n`
					+ `Popup: ${grCfg.customFont.fontPopup}\n`
					+ `Tooltip: ${grCfg.customFont.fontTooltip}\n`
					+ `Grid artist: ${grCfg.customFont.fontGridArtist}\n`
					+ `Grid title: ${grCfg.customFont.fontGridTitle}\n`
					+ `Grid title bold: ${grCfg.customFont.fontGridTitleBold}\n`
					+ `Grid album: ${grCfg.customFont.fontGridAlbum}\n`
					+ `Grid key: ${grCfg.customFont.fontGridKey}\n`
					+ `Grid value: ${grCfg.customFont.fontGridValue}\n`
					+ `Playlist artist normal: ${grCfg.customFont.playlistArtistNormal}\n`
					+ `Playlist artist playing: ${grCfg.customFont.playlistArtistPlaying}\n`
					+ `Playlist artist normal compact: ${grCfg.customFont.playlistArtistNormalCompact}\n`
					+ `Playlist artist playing compact: ${grCfg.customFont.playlistArtistPlayingCompact}\n`
					+ `Playlist title normal: ${grCfg.customFont.playlistTitleNormal}\n`
					+ `Playlist title selected: ${grCfg.customFont.playlistTitleSelected}\n`
					+ `Playlist title playing: ${grCfg.customFont.playlistTitlePlaying}\n`
					+ `Playlist album: ${grCfg.customFont.playlistAlbum}\n`
					+ `Playlist date: ${grCfg.customFont.playlistDate}\n`
					+ `Playlist date compact: ${grCfg.customFont.playlistDateCompact}\n`
					+ `Playlist info: ${grCfg.customFont.playlistInfo}\n`
					+ `Playlist cover: ${grCfg.customFont.playlistCover}\n`
					+ `Playlist playcount: ${grCfg.customFont.playlistPlaycount}\n`
					+ `Library: ${grCfg.customFont.fontLibrary}\n`
					+ `Biography: ${grCfg.customFont.fontBiography}\n`
					+ `Lyrics: ${grCfg.customFont.fontLyrics}\n\n`
			},
			customThemeLiveEdit: {
				msg: 'Custom theme can only be live edited in default layout:\n'
					+ 'Options > Layout > Default\n\n'
					+ 'You could manually edit your config file while reloading to take effect:\n'
					+ `${grCfg.configPathCustom}\n`
			},
			metadataGridLiveEdit: {
				msg: 'Metadata grid can only be live edited in default layout:\n'
					+ 'Options > Layout > Default\n\n'
					+ 'You could manually edit your config file while reloading to take effect:\n'
					+ `${grCfg.configPath}\n`
			},
			albumArtCorruptError: {
				msg: 'Album art could not be properly parsed!\n\n'
					+ 'Maybe it is corrupt, file format is not supported\n'
					+ 'or has an unusual ICC profile embedded.\n\n'
			},
			discArtCorruptError: {
				msg: 'Disc art could not be properly parsed!\n\n'
					+ 'Maybe it is corrupt, file format is not supported\n'
					+ 'or has an unusual ICC profile embedded.\n\n'
			},
			playlistEmptyError: {
				msg: 'The user action has been canceled.\n\n'
					+ 'Please add some tracks to your playlist first!\n\n'
			},
			themeDayNightModeNotice: {
				msg: 'Theme day/night mode is active\n'
					+ 'and has locked the theme.\n\n'
					+ 'In order to change themes,\n'
					+ 'this mode must be deactivated first.\n\n'
					+ 'Deactivate it now?\n\n',
				msgFb: 'Theme day/night mode has been deactivated in order to change themes.'
			},
			themeDayNightSetup: {
				msg: `Theme setup for ${grSet.themeSetupDay ? 'daytime' : 'nighttime'} is active:\n\n`
					+ 'Please select your theme and styles\n'
					+ `for ${grSet.themeSetupDay ? 'daytime' : 'nighttime'} usage.\n\n`
					+ 'After configuration,\n'
					+ 'revisit the theme day/night menu\n'
					+ 'to save changes.'
			},
			validateStyleNight: {
				msg: 'The "Night" theme style has been deactivated!\n\n'
					+ 'It is supported only for the following themes:\n'
					+ '"Reborn"\n"Random"\n"Custom"\n\n'
					+ 'It is not supported with these theme styles:\n'
					+ '"Reborn White"\n"Reborn Black"\n\n'
			},
			validateStyleBlackAndWhite: {
				msg: 'The "Black and white" theme styles have been deactivated!\n\n'
					+ 'It is supported only for the "White" theme.\n\n'
			},
			validateStyleBlackReborn: {
				msg: 'The "Black reborn" theme style has been deactivated!\n\n'
					+ 'It is supported only for the "Black" theme.\n\n'
			},
			validateStyleRebornSpecials: {
				msg: 'The "Reborn" special theme styles have been deactivated!\n\n'
					+ 'Only one theme style can be active\n'
					+ 'at a time for this theme style group:\n'
					+ '"Reborn white"\n"Reborn black"\n"Reborn fusion"\n'
					+ '"Reborn fusion 2"\n"Reborn fusion accent"\n\n'
					+ 'It is supported only for the "Reborn" theme.\n\n'
			},
			validateStyleGradient: {
				msg: 'The "Gradient" theme styles have been deactivated!\n\n'
					+ 'It is supported only for following themes:\n'
					+ '"Reborn"\n"Random"\n"Blue"\n"Dark blue"\n"Red"\n"Custom".\n\n'
			},
			validateStyleGroupOne: {
				msg: 'Multiple active theme styles detected!\n\n'
					+ 'Only one theme style can be active\n'
					+ 'at a time for this theme style group:\n'
					+ '"Blend"\n"Blend 2"\n"Gradient"\n"Gradient 2"\n\n'
					+ 'Other theme styles for this group\n'
					+ 'have been deactivated.\n\n'
			},
			validateStyleGroupTwo: {
				msg: 'Multiple active theme styles detected!\n\n'
					+ 'Only one theme style can be active\n'
					+ 'at a time for this theme style group:\n'
					+ '"Alternative"\n"Alternative 2"\n"Black and white"\n'
					+ '"Black and white 2"\n"Black and white reborn"\n"Black reborn"\n'
					+ '"Reborn white"\n"Reborn black"\n"Reborn fusion"\n'
					+ '"Reborn fusion 2"\n"Reborn fusion accent"\n"Random pastel"\n"Random dark"\n\n'
					+ 'Other theme styles for this group\n'
					+ 'have been deactivated.\n\n'
			}
		};

		this.msgThemeColors = {
			playlistColorsCustomTheme: {
				msg: 'Error when initializing playlist custom theme colors:\n\n'
					+ 'One or more variable color names do not exist or have wrong values in your custom config file:\n\n'
					+ `${grCfg.configPathCustom}\n`
			},
			libraryColorsCustomTheme: {
				msg: 'Error when initializing library custom theme colors:\n\n'
					+ 'One or more variable color names do not exist or have wrong values in your custom config file:\n\n'
					+ `${grCfg.configPathCustom}\n`
			},
			biographyColorsCustomTheme: {
				msg: 'Error when initializing biography custom theme colors:\n\n'
					+ 'One or more variable color names do not exist or have wrong values in your custom config file:\n\n'
					+ `${grCfg.configPathCustom}\n`
			},
			mainColorsCustomTheme: {
				msg: 'Error when initializing main custom theme colors:\n\n'
					+ 'One or more variable color names do not exist or have wrong values in your custom config file:\n\n'
					+ `${grCfg.configPathCustom}\n`
			}
		};

		this.msgMenuDesignOptions = {
			designChange: {
				content: 'Changing the design preset will reset your current\n'
					+ 'theme, style, and layout settings.\n\n',
				msg: 'Do you want to change to another design preset?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Design preset has been changed:\n\n'
					+ '{content}'
			},
			modernDayNight: {
				content: 'The Modern Day/Night design preset\n'
					+ 'will automatically switch between\n'
					+ 'light and dark styles based on\n'
					+ 'your set schedule.\n\n',
				msg: 'Do you want to enable this design preset?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Modern Day/Night preset enabled:\n\n'
					+ '{content}'
			},
			modernDayNightManualSwitch: {
				msg: 'The Modern Day/Night design is currently active.\n'
					+ 'It automatically switches styles based on time.\n\n'
					+ 'Changing styles manually will override this behavior\n'
					+ 'until the next scheduled background check.\n\n'
					+ 'Continue?'
			}
		};

		this.msgMenuThemeOptions = {
			renameCustomTheme: {
				msg: 'The renaming process was canceled.\n\n'
					+ 'Please ensure that you have selected and activated\n'
					+ 'a custom theme before attempting to rename it.\n\n'
			},
			saveCurrentColors: {
				msg: 'Do you want to save current used colors\n'
					+ 'to the selected custom theme slot?\n\n'
					+ 'This will overwrite all colors in the selected\n'
					+ 'custom theme slot.\n\n'
					+ 'It is recommended to make a backup\n'
					+ `of your custom config file:\n${grCfg.configPathCustom}\n\n`
					+ 'Saved color changes will take effect on next reload.\n\n'
					+ 'Continue?\n\n'
			}
		};

		this.msgMenuStyleOptions = {
			styleDefault: {
				msg: 'Theme style reset was canceled:\n\n'
					+ 'Active theme sandbox needs to be deactivated first\n'
					+ 'in order to reset theme styles.\n\n'
			}
		};

		this.msgMenuPresetOptions = {
			presetSelectModeDefault: {
				content: 'The default select mode will automatically choose\n'
					+ 'a random pick of 88 theme presets.\n\n'
					+ 'Double-click on the lower bar to choose\n'
					+ 'another random theme preset.\n\n'
					+ 'When random mode is activated,\n'
					+ 'all themes and style options will be available.\n\n',
				msg: 'Do you want to activate the -Default- preset select mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Default preset select mode activated:\n\n'
					+ '{content}'
			},
			presetSelectModeHarmonic: {
				content: 'The harmonic preset select mode will automatically\n'
					+ 'choose the best visual experience of themes and styles\n'
					+ 'based on album art.\n\n'
					+ 'You can also double-click on the lower bar\n'
					+ 'to choose another random harmonic preset.\n\n'
					+ 'When harmonic preset select mode is activated,\n'
					+ 'all themes and almost all style options will be disabled.\n\n',
				msg: 'Do you want to activate the -Harmonic- preset select mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Harmonic preset select mode activated:\n\n'
					+ '{content}'
			},
			presetSelectModeTheme: {
				content: 'The theme preset select mode will automatically choose\n'
					+ 'a random theme preset based on current active theme.\n\n'
					+ 'You can also double-click on the lower bar\n'
					+ 'to choose another random theme preset.\n\n'
					+ 'When theme preset select mode is activated,\n'
					+ 'all themes and style options will be available.\n\n',
				msg: 'Do you want to activate the -Theme- preset select mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Theme preset select mode activated:\n\n'
					+ '{content}'
			}
		};

		this.msgMenuPlayerControlsOptions = {
			loadEmbeddedAlbumArtFirst: {
				content: 'You also need to set it in foobar\'s preferences.\n'
					+ 'File > Preferences > Advanced > Display > Album art >\n'
					+ 'Embedded vs external: Prefer embedded.\n\n'
					+ 'A restart is required to take effect.\n\n',
				msg: 'Do you want to load embedded album art first?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Embedded album art enabled:\n\n'
					+ '{content}'
			},
			panelBrowseMode: {
				content: 'When browse mode is active,\n'
					+ 'album art and track information in Details,\n'
					+ 'Biography and Lower bar will change as you select\n'
					+ 'albums or tracks in the Playlist or Library.\n\n'
					+ 'Additionally, Library\'s play mode will be enabled.\n'
					+ 'When playing albums or tracks from the Library,\n'
					+ 'it will not modify the content of the playlist,\n'
					+ 'until the browse mode is disabled.\n\n'
					+ 'If a track is currently playing,\n'
					+ 'you can use "Show Now Playing"\n'
					+ 'or lower bar track title click to return.\n\n',
				msg: 'Do you want to enable browse mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Browse mode enabled:\n\n'
					+ '{content}'
			},
			seekbarRefreshRateFast: {
				content: 'A fast refresh rate has been selected.\n'
					+ 'This setting is recommended only for\n'
					+ 'high-end single-threaded CPUs.\n\n'
					+ 'If your CPU can not handle this rate,\n'
					+ 'you will experience lag and freezes.\n'
					+ 'Please select a slower refresh rate\n'
					+ 'to avoid these issues.\n\n',
				msg: '>>> WARNING <<<\n\n'
					+ '{content}',
				msgFb: '>>> WARNING <<<\n\n'
					+ '{content}'
			},
			seekbarRefreshRateVeryFast: {
				content: 'A very fast refresh rate has been selected.\n'
					+ 'This setting is recommended only for\n'
					+ 'top-end single-threaded CPUs or\n'
					+ 'benchmarking purposes.\n\n'
					+ 'If your CPU can not handle this rate,\n'
					+ 'you will experience lag and freezes.\n'
					+ 'Please select a slower refresh rate\n'
					+ 'to avoid these issues.\n\n',
				msg: '>>> WARNING <<<\n\n'
					+ '{content}',
				msgFb: '>>> WARNING <<<\n\n'
					+ '{content}'
			},
			waveformBarSaveModeLibrary: {
				content: 'This mode will not save any data files\n'
					+ 'if the tracks are not indexed in the library.\n\n',
				msg: 'Waveform bar\'s "Library" save mode enabled.\n\n'
					+ '{content}\n\n',
				msgFb: 'Waveform bar\'s "Library" save mode enabled.\n\n'
					+ '{content}'
			},
			waveformBarSaveModeNever: {
				content: 'This mode will never save any data files,\n'
					+ 'and analysis process will always be re-initialized.\n\n',
				msg: 'Waveform bar\'s save mode deactivated.\n\n'
					+ '{content}\n\n',
				msgFb: 'Waveform bar\'s save mode deactivated.\n\n'
					+ '{content}'
			}
		};

		this.msgMenuDetailsOptions = {
			discArtStub: {
				msg: `The custom disc art placeholder was not found in:\n${grPath.discArtCustomStub}\n\n`
					+ 'Be sure that image exist and has the correct filename\n'
					+ 'in the "customDiscArtStub" section of the\n'
					+ `custom config file:\n${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc\n\n`
			}
		};

		this.msgMenuLibraryOptions = {
			actionModeDefault: {
				content: 'This will restore the original settings, presets,\n'
					+ 'and behavior of the Library.\n\n',
				msg: 'Do you want to enable Library\'s default mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Library\'s default mode enabled:\n\n'
					+ '{content}'
			},
			actionModeBrowser: {
				content: 'This will act like a file browser to quickly see the content of the album. '
					+ 'It is not recommended for new users\n'
					+ 'who don\'t know how the library works.\n\n',
				msg: 'Do you want to enable Library\'s browser mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Library\'s browser mode enabled:\n\n'
					+ '{content}'
			},
			actionModePlayer: {
				content: 'This will act like a playlist and will not automatically add content to the playlist. '
					+ 'It is recommended for new users\n'
					+ 'who don\'t know how the library works.\n\n',
				msg: 'Do you want to enable Library\'s player mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Library\'s player mode enabled:\n\n'
					+ '{content}'
			},
			explorerFullThemeColorChange: {
				content: 'This will update the entire theme primary color\n'
					+ 'every time a new artwork is loaded in the Explorer.\n\n'
					+ 'The theme colors change as you browse albums/artists.\n'
					+ 'It works best with dynamic themes such as\n'
					+ '(White/Black/Reborn/Random).\n\n',
				msg: 'Do you want to enable\n'
					+ 'full theme color change on new artwork?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Full theme color change enabled:\n\n'
					+ '{content}'
			},
			explorerAlbumImageDLAutoEnable: {
				content: 'This will automatically download missing album covers\n'
					+ 'whenever you view an album in the Explorer.\n\n'
					+ 'The covers are saved to cache for faster loading.\n'
					+ 'The quality and post-action are configurable below.\n'
					+ 'It can generate many files over time.\n\n',
				msg: 'Do you want to enable\n'
					+ 'auto-download for album covers?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Auto-download album covers enabled:\n\n'
					+ '{content}'
			},
			explorerArtistImageDLAutoEnable: {
				content: 'This will automatically download artist images\n'
					+ 'whenever you view an artist in grid views.\n\n'
					+ 'Up to 20 high-quality images per artist.\n'
					+ 'The images are saved to cache for cycling.\n'
					+ 'It can use significant disk space over time.\n\n',
				msg: 'Do you want to enable\n'
					+ 'auto-download for artist images?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Auto-download artist images enabled:\n\n'
					+ '{content}'
			},
			explorerMissingSimilarImageDLAutoEnable: {
				content: 'This will automatically download thumbnails\n'
					+ 'for Missing Releases and Similar Artists views.\n\n'
					+ 'It improves the visual experience in grid views.\n'
					+ 'The images are cached for performance.\n'
					+ 'The file sizes are generally small.\n\n',
				msg: 'Do you want to enable\n'
					+ 'auto-download for grid thumbnails?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Auto-download grid thumbnails enabled:\n\n'
					+ '{content}'
			},
			explorerAlbumImageAutoEmbed: {
				content: 'This will automatically embed downloaded album covers\n'
					+ 'directly into the tags of every track in the album.\n\n'
					+ 'The cover becomes part of the music files.\n'
					+ 'The files will increase in size (usually ~100-300 KB per track).\n'
					+ 'The changes are permanent; consider backing up your files.\n\n'
					+ 'The downloaded covers will be limited to medium quality\n'
					+ 'to keep file size reasonable.\n\n',
				msg: 'Do you want to enable\n'
					+ 'auto-embed album covers into tracks?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Auto-embed album covers enabled:\n\n'
					+ '{content}'
			},
			explorerAlbumImageAutoEmbedFail: {
				msg: '>>> Auto-embed album cover failed! <<<\n\n'
					+ 'The downloaded cover could not be embedded\n'
					+ 'into the track tags for this album.\n\n'
					+ 'Please check:\n'
					+ '- File permissions (read-only?)\n'
					+ '- Tracks are on a connected drive\n'
					+ '- No external program is locking the files\n\n'
			},
			explorerAlbumImageAutoMove: {
				content: 'This will automatically move downloaded\n'
					+ 'album covers into each album\'s folder on disk.\n\n'
					+ 'The cover becomes part of your music collection.\n'
					+ 'The filename will be configurable (cover/folder/front).\n'
					+ 'Existing files with the same name will NOT be overwritten.\n\n',
				msg: 'Do you want to enable\n'
					+ 'auto-move album covers to folders?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Auto-move album covers enabled:\n\n'
					+ '{content}'
			},
			explorerAlbumImageAutoMoveFail: {
				msg: '>>> Auto-move album cover failed! <<<\n\n'
					+ 'The downloaded cover could not be moved\n'
					+ 'to the album folder on disk.\n\n'
					+ 'Please check:\n'
					+ '- Folder permissions\n'
					+ '- Album directory is on a connected drive\n'
					+ '- No file with the same name already exists\n'
					+ '- No external program is locking the folder\n\n'
			}
		};

		this.msgMenuBiographyOptions = {
			cycPhotoLocation: {
				msg: 'Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.\n\n'
			},
			loadCovFolder: {
				msg: 'Enter folder in options: "Server Settings"\\Cover\\Covers: cycle folder.\n\n'
					+ 'Default: artist photo folder.\n\n'
					+ 'Images are updated when the album changes. Any images arriving after choosing the current album aren\'t included.\n\n'
			}
		};

		this.msgMenuSettingsOptions = {
			themeDayNightMode: {
				content: 'The default daytime theme is White\n'
					+ 'and the nighttime theme is Black.\n\n'
					+ 'You can set up and configure\n'
					+ 'a new theme and styles for both modes\n'
					+ 'in the theme day/night mode setup.\n\n',
				msg: 'Do you want to activate the theme day/night mode?\n\n'
					+ '{content}Continue?\n\n',
				msgFb: 'Theme day/night mode is active:\n\n'
					+ '{content}'
			},
			themeSetupDay: {
				msg: '>>> Theme setup for daytime is active <<<\n\n'
					+ 'Please select your theme and styles for daytime usage.\n'
					+ 'After configuring the theme settings, revisit this menu to save them and set a new time range.\n\n'
			},
			themeSetupNight: {
				msg: '>>> Theme setup for nighttime is active <<<\n\n'
					+ 'Please select your theme and styles for nighttime usage.\n'
					+ 'After configuring the theme settings, revisit this menu to save them and set a new time range.\n\n'
			},
			themeSandboxRestore: {
				msg: 'Do you want to restore\n'
					+ 'or keep current theme settings?\n\n'
					+ 'This will restore previously used\n'
					+ 'theme, styles, preset\n'
					+ 'or use the current active.\n\n'
					+ 'Continue?\n\n'
			},
			themeSandboxRestore2: {
				msg: grSet.savedPreset
					? 'Do you want to restore\nlast used theme styles or theme preset?\n\n'
					: 'Do you want to restore\nlast used theme styles?\n\n',
				msgFb: 'Theme settings restored:\n\n'
					+ 'Theme and styles have been restored.'
			},
			themeSandbox: {
				content: 'This mode is useful when trying out\n'
					+ 'themes, styles, presets or writing theme tags.\n\n'
					+ 'After disabling the theme sandbox mode,\n'
					+ 'previously used theme settings can be restored.\n\n',
				msg: 'Do you want to activate the theme sandbox?\n\n'
					+ '{content}\n\n'
					+ 'Continue?\n\n',
				msgFb: 'Theme sandbox mode activated:\n\n'
					+ '{content}'
			},
			customThemeFonts: {
				msg: 'Do you want to use custom theme fonts?\n\n'
					+ 'You need to set your custom fonts\n'
					+ 'in your config file located in\n'
					+ 'foobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc\n\n\n'
			},
			customPreloaderLogo: {
				msg: `The custom logo placeholder can be replaced\n`
					+ 'with a new logo:\n\n'
					+ `${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\_4K-custom-logo.png and _custom-logo.png\n\n`
					+ 'Recommended logo dimensions are:\n'
					+ '500x500 pixels for 4K\n'
					+ '250x250 pixels for HD\n\n'
			},
			customThemeImages: {
				msg: `All theme images can be safely replaced\n`
					+ 'with new custom ones:\n\n'
					+ `${fb.ProfilePath}georgia-reborn\\images\\custom\\\n\n`
					+ 'Please ensure all images have the same names\n'
					+ 'as the original ones, which are located in the\n'
					+ 'parent directory.\n\n'
			},
			deleteLibraryCache: {
				msg: 'Do you want to delete the library cache?\n\n'
					+ 'This will permanently delete cached library album art thumbnails.\n\n'
					+ 'Continue?\n\n'
			},
			libraryAutoDelete: {
				msg: 'Do you want to set auto-delete for library cache?\n\n'
					+ 'This will always auto-delete cached library album art thumbnails on startup.\n\n'
					+ 'Continue?\n\n'
			},
			deleteBiographyCache: {
				msg: 'Do you want to delete the biography cache?\n\n'
					+ 'This will permanently delete downloaded biography images and text files\n\n'
					+ 'Continue?\n\n'
			},
			biographyAutoDelete: {
				msg: 'Do you want to set auto-delete for biography cache?\n\n'
					+ 'This will always auto-delete downloaded biography images\n'
					+ 'and text on startup\n\n'
					+ 'Continue?\n\n'
			},
			deleteLyricsCache: {
				msg: 'Do you want to delete all lyrics?\n\n'
					+ 'This will permanently delete downloaded lyrics.\n\n'
					+ 'Continue?\n\n'
			},
			lyricsAutoDelete: {
				msg: 'Do you want to set auto-delete for lyrics?\n\n'
					+ 'This will always auto-delete downloaded lyrics on startup.\n\n'
					+ 'Continue?\n\n'
			},
			deleteWaveformBarCache: {
				msg: 'Do you want to delete all waveform bar cache?\n\n'
					+ 'This will permanently delete analyzed files.\n\n'
					+ 'Continue?\n\n'
			},
			waveformBarAutoDelete: {
				msg: 'Do you want to set auto-delete for waveform bar?\n\n'
					+ 'This will always auto-delete waveform bar cache on startup.\n\n'
					+ 'Continue?\n\n'
			},
			makeBackup: {
				msg: `Do you want to make a backup of the theme?\n\n`
					+ `This will create a backup in ${fb.ProfilePath}backup\n\n`
					+ `On new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\n`
					+ 'If a backup already exist, you can use\n'
					+ 'Options > Settings > Theme backup > Restore backup\n\n'
					+ 'Continue?\n\n\n',
				msgFb: `You can find the Georgia-ReBORN theme backup in ${fb.ProfilePath}backup\n\n`
					+ `On new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\n`
					+ 'If a backup already exist, you can use\n'
					+ 'Options > Settings > Theme backup > Restore backup'
			},
			restoreBackup: {
				msg: `Do you want to restore your backup of the theme?\n\n`
					+ '>>> WARNING <<<\n\n'
					+ `This will restore your backup from ${fb.ProfilePath}\n\n`
					+ 'Changes and modifications since your last backup\n'
					+ '(new theme settings, new playlists and play statistics)\n'
					+ 'will be lost!\n\n'
					+ 'It is recommended to make a new backup\n'
					+ 'before you restore.\n\n'
					+ 'Continue?\n\n\n'
			},
			saveSettingsConfig: {
				msg: 'Do you want to save all current theme settings?\n\n'
					+ 'This will overwrite all settings from the top menu "Options"\n'
					+ 'in the georgia-reborn-config.jsonc file.\n\n'
					+ 'Continue?\n\n'
			},
			loadSettingsConfig: {
				msg: 'Do you want to load all theme settings\n'
					+ 'from the georgia-reborn-config.jsonc file?\n\n'
					+ 'Continue?\n\n'
			},
			loadDefaultSettingsConfig: {
				msg: 'Do you want to load default theme settings?\n\n'
					+ 'This will not overwrite the georgia-reborn-config.jsonc file,\n'
					+ 'but you should probably first save your settings.\n\n'
					+ 'Continue?\n\n'
			},
			resetSettingsMainConfig: {
				msg: 'Do you want to reset the config file to default?\n\n'
					+ '!!! WARNING !!!\n\n'
					+ 'This will set all settings to default.\n'
					+ 'You should probably make a backup first.\n\n'
					+ 'Continue?\n\n'
			},
			resetSettingsCustomConfig: {
				msg: 'Do you want to reset the custom config file to default?\n\n'
					+ '!!! WARNING !!!\n\n'
					+ 'This will delete and replace all custom themes\n'
					+ 'to the default custom theme template.\n'
					+ 'You should definitely make a backup first.\n\n'
					+ 'Continue?\n\n'
			},
			resetSettingsAll: {
				msg: 'Do you want to reset all theme settings to default?\n\n'
					+ 'This will also clear all library custom views plus filters\n'
					+ 'and Georgia-ReBORN config.\n\n'
					+ 'Continue?\n\n'
			},
			resetSettingsAllError: {
				msg: 'Something went wrong and Georgia-ReBORN has NOT been successfully reset, try again!'
			},
			themePerformance: {
				msg: 'Do you want to change the theme performance?\n\n'
					+ 'These presets will change various theme settings!\n'
					+ 'It is recommended to save current theme settings\n'
					+ 'to the config file. You should also make a backup\n'
					+ 'of your playlists to be on the safe side!\n\n'
					+ '!!! WARNING !!!\n'
					+ '"High quality" and especially "Highest Quality"\n'
					+ 'can freeze foobar, depending how fast your CPU performs.\n'
					+ 'It does not matter if you are using a multi-core CPU,\n'
					+ 'only single-core CPU performance counts!\n'
					+ 'If your foobar is unresponsive, restart\n'
					+ 'and change to a lighter preset.\n\n'
					+ 'Continue?\n\n'
			}
		};

		this.msgMenuDevToolsOptions = {
			autoDownloadBio: {
				msg: 'Do you want to enable\n'
					+ 'the auto-download biography mode?\n\n'
					+ 'This will set the playback order to shuffle\n'
					+ 'and activate a 6-second timer to automatically\n'
					+ 'download the biography.\n\n'
					+ 'This is recommended when you leave your PC\n'
					+ 'unattended for a longer period of time.\n\n'
					+ 'Continue?\n\n'
			},
			autoDownloadLyrics: {
				msg: 'Do you want to enable\n'
					+ 'the auto-download lyrics mode?\n\n'
					+ 'This will set the playback order to playlist\n'
					+ 'and activate a 15-second timer to automatically\n'
					+ 'download the lyrics.\n\n'
					+ 'This is recommended when you leave your PC\n'
					+ 'unattended for a longer period of time.\n\n'
					+ 'Continue?\n\n'
			},
			systemFirstLaunch: {
				msg: 'Do you really want to set system to first launch?\n\n'
					+ 'Continue?\n\n'
			},
			asyncThemePreloader: {
				msg: `Do you really want to set the script preloader\n`
					+ `to ${grSet.asyncThemePreloader ? 'synchronous' : 'asynchronous'}?\n\n`
					+ 'Continue?\n\n'
			}
		};

		this.msgContextMenu = {
			discArtCustomStub: {
				msg: `The custom disc art placeholder was not found in:\n${grPath.discArtCustomStub}\n\n`
					+ 'Be sure that image exist and has the correct filename\n'
					+ 'in the "customDiscArtStub" section of the\n'
					+ `custom config file:\n${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc\n\n`
			},
			deleteWaveformBarCache: {
				msg: 'Do you want to delete all waveform bar cache?\n\n'
					+ 'This will permanently delete analyzed files.\n\n'
					+ 'Continue?\n\n'
			},
			writingList: {
				msg: '>>> Attention <<<\n\n'
					+ 'This process may take anywhere\n'
					+ 'from a few seconds to several minutes to complete,\n'
					+ 'depending on the number of tracks in the playlist,\n'
					+ 'CPU power, and HDD/SSD speeds.\n\n'
					+ 'Press OK to start the process\n'
					+ 'and wait until it is finished.\n\n'
			}
		};

		this.msgCustomMenu = {
			customThemeInfo: {
				msg: 'You can modify the main colors, the playlist colors, the library colors and the biography colors.\n'
					+ 'First select a custom theme slot in the drop down menu "Options" that you want to modify.\n'
					+ 'You can either select the color via the color picker or paste a HEX value in the input field.\n'
					+ 'It will apply all changes in real time and saves it automatically in the georgia-reborn-custom.jsonc config file.\n'
					+ 'Each color has a name that you can also find in the georgia-reborn-custom.jsonc config file and modify it there.\n\n'
					+ 'To reset the colors to the default ones, select the "Reset" option from the drop down menu.\n\n'
					+ 'Tip: Download the resource pack from the Github page to open the custom theme template and modify colors in Photoshop or Gimp.\n'
					+ 'If you are happy with the result, just copy and paste the HEX values.\n\n'
					+ 'You can showcase your custom themes and share your configs here: Click on this text.'
			},
			metadataGridMenuInfo: {
				msg: 'You can modify existing entries or add your new custom patterns.\n'
					+ 'To confirm changes, press "Enter" or paste a new pattern into the input field.\n'
					+ 'All changes will be applied in real time and automatically saved in the\n'
					+ 'georgia-reborn-config.jsonc file where it can be also manually modified.\n\n'
					+ 'To reset the metadata grid to its default patterns, select the "Reset" option\n'
					+ 'from the drop down menu.\n\n'
					+ 'Tip: To reorder the entries, first copy the ones you want to change in your\n'
					+ 'notepad and paste the label and pattern afterwards.\n\n'
					+ 'Note: Not all entries will be displayed if the height of the player size is too small,\n'
					+ 'change to a larger player size if desired.\n\n'
					+ 'You can learn more about patterns here, click on this text.'
			}
		};

		this.msgInputBox = {
			addTracksPlaylist: {
				msg: 'Enter your new add tracks playlist or an existing playlist with its exact name:'
			},
			addTracksPlaylistError: {
				msg: `Playlist name is not valid:\n${grm.inputBox.inputBoxUserValue}\n\n`
					+ 'Do not use any " at the beginning and the end of the playlist name.'
			},
			customCacheDir: {
				msg: `Enter your custom ${grm.inputBox.customDirString} directory:`
			},
			customCacheDirLyrics: {
				msg: 'If the custom lyrics directory has been set and is active,\n'
					+ 'it must also be updated in the ESLyric location setting:\n\n'
					+ 'foobar\'s Preferences > Tools > ESLyric > Lyric Options > Save Settings > Location.\n\n'
			},
			customCacheDirError: {
				msg: `Path is not valid:\n${grm.inputBox.inputBoxUserValue}\n\n`
					+ 'Do not use any " at the beginning and the end of your pattern.\n\n'
					+ 'Example of a correct path:\n\n'
					+ 'D:\\Stuff\\Directory\\'
			},
			renameCustomTheme: {
				msg: 'Enter your desired name for your current active custom theme'
			},
			renameCustomThemeError: {
				msg: `Name is not valid:\n${grm.inputBox.inputBoxUserValue}\n\n`
					+ 'Something went wrong...'
			},
			playlistCustomHeaderInfo: {
				msg: 'Enter your custom playlist header info pattern:'
			},
			playlistCustomHeaderInfoError: {
				msg: `Pattern is not valid:\n${grm.inputBox.inputBoxUserValue}\n\n`
					+ 'Do not use any " at the beginning and the end of your pattern.\n\n'
					+ 'Examples of correct patterns:\n\n'
					+ '%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n'
					+ '$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%'
			},
			playlistCustomTrackRow1: {
				msg: 'Enter your custom playlist track row pattern:'
			},
			playlistCustomTrackRow2: {
				msg: 'Enter your custom playlist track row pattern when no header displayed:'
			},
			playlistCustomTrackRowError: {
				msg: `Pattern is not valid:\n${grm.inputBox.inputBoxUserValue || grm.inputBox.inputBoxUserValue2}\n\n`
					+ 'Do not use any " at the beginning and the end of your pattern.\n\n'
					+ 'Examples of correct patterns:\n\n'
					+ '%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n'
					+ '$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%'
			},
			playlistSortCustom: {
				msg: 'Enter your custom playlist order pattern:'
			},
			playlistSortCustomError: {
				msg: `Pattern is not valid:\n${grm.inputBox.inputBoxUserValue}\n\n`
					+ 'Do not use any " at the beginning and the end of your pattern.\n\n'
					+ 'Examples of correct patterns:\n\n'
					+ '%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n'
					+ '$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%'
			},
			themeDayNightCustomTimeRange: {
				msg: 'Please enter the time range for the DAYTIME period.\n'
					+ 'Use the 24-hour format (0-24).\n\n'
					+ 'Format: "StartHour-EndHour"\n'
					+ 'Example: "6-18"\n\n'
					+ '• 06:00 to 18:00 will be DAYTIME (Light)\n'
					+ '• 18:00 to 06:00 will be NIGHTTIME (Dark)\n\n'
					+ 'The theme automatically switches to Night mode\n'
					+ 'after the end time.'
			},
			themeDayNightCustomTimeRangeError: {
				msg: `Time range is not valid: ${grm.inputBox.inputBoxNewValue}\n\n`
					+ 'Please use the 24-hour format.\n'
					+ 'Examples:\n\n'
					+ '• "6-18"  : Day 6 AM - 6 PM\n'
					+ '• "17-23" : Day 5 PM - 11 PM\n'
					+ '• "22-6"  : Day 10 PM - 6 AM (wraps past midnight)\n'
					+ '• "0-24"  : Always Day (24 hours)'
			}
		};
	}

	/**
	 * Retrieves the message for a given category and key.
	 * The concatenated message includes the content and the main or feedback message.
	 * @param {string} category - The category of the message (e.g., 'main', 'menu').
	 * @param {string} key - The key of the message within the category (e.g., 'default', 'harmonic').
	 * @param {boolean} feedback - Whether to retrieve the feedback message.
	 * @returns {string} The concatenated message or an empty string if not found.
	 */
	getMessage(category, key, feedback = false) {
		this.initMessages();

		const categories = {
			main: this.msgMain,
			themeColors: this.msgThemeColors,
			menu: {
				...this.msgMenuDesignOptions,
				...this.msgMenuThemeOptions,
				...this.msgMenuStyleOptions,
				...this.msgMenuPresetOptions,
				...this.msgMenuPlayerControlsOptions,
				...this.msgMenuDetailsOptions,
				...this.msgMenuLibraryOptions,
				...this.msgMenuBiographyOptions,
				...this.msgMenuSettingsOptions,
				...this.msgMenuDevToolsOptions
			},
			contextMenu: this.msgContextMenu,
			customMenu: this.msgCustomMenu,
			inputBox: this.msgInputBox
		};

		const messages = categories[category];
		if (!messages) return '';

		const message = messages[key];
		if (!message) return '';

		const { content = '', msg = '', msgFb = '' } = message;
		const targetMsg = feedback ? msgFb : msg;

		return targetMsg.includes('{content}') ? targetMsg.replace('{content}', content) : targetMsg;
	}

	/**
	 * Displays a popup with customizable message and button labels.
	 * The behavior of the popup depends on the environment; if running under Wine or without Internet Explorer,
	 * it will show a simple popup message. Otherwise, it will show a confirm box with two buttons.
	 * @global
	 * @param {boolean} fbPopup - Determines if the fb.ShowPopupMessage should be shown.
	 * @param {string} fbMsg - The message to be displayed in the fb.ShowPopupMessage popup.
	 * @param {string} popUpMsg - The message to be displayed in the confirm box popup.
	 * @param {string} btn1Label - The label for the first button in the confirm box.
	 * @param {string} btn2Label - The label for the second button in the confirm box. If not provided, no second button is shown.
	 * @param {Function} callback - The callback function that is called with the confirmation status.
	 */
	showPopup(fbPopup, fbMsg, popUpMsg, btn1Label, btn2Label, callback) {
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) {
				callback(confirmed);
				return;
			}
			callback(confirmed);
		};

		if (DetectWine()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, btn1Label);
			if (fbPopup) fb.ShowPopupMessage(fbMsg, 'Georgia-ReBORN');
		}
		else {
			lib.popUpBox.confirm('Georgia-ReBORN', popUpMsg, btn1Label, btn2Label, false, 'center', btn2Label ? continue_confirmation : false);
		}
	}

	/**
	 * Displays a simple popup notice message without canceling.
	 * @param {string} menuKey - The key of the menu from which to retrieve the message.
	 * @param {string} messageKey - The key of the message to be displayed.
	 * @param {string} [buttonLabel] - The optional label for the popup button.
	 */
	showPopupNotice(menuKey, messageKey, buttonLabel = 'OK') {
		const msgFb = grm.msg.getMessage(menuKey, messageKey, true);
		const msg = grm.msg.getMessage(menuKey, messageKey);
		grm.msg.showPopup(true, msgFb, msg, buttonLabel, false, (confirmed) => {});
	}
}
