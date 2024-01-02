/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Settings                             * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2024-01-02                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {string} The Georgia-ReBORN config file path. */
const configPath = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc`;
/** @type {Configuration} The Georgia-ReBORN config object. */
const config = new Configuration(configPath);
/** @type {string} The Georgia-ReBORN custom config file path. */
const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
/** @type {Configuration} The Georgia-ReBORN custom config object. */
const configCustom = new Configuration(configPathCustom);
/** @type {string} The Georgia-ReBORN current version. */
const currentVersion = '3.0-DEV';
/** @type {string} The Georgia-ReBORN version will be overwritten when loaded from config file. */
let configVersion = currentVersion;
/** @type {string} The Georgia-ReBORN version will be shown on the right side of the lower bar when nothing is playing. */
let lowerBarStoppedTime = `Georgia-ReBORN v${currentVersion}`;
/** @type {boolean} The update state if a new update is available on Github releases page. */
let updateAvailable = false;
/** @type {Hyperlink} The update link will be shown on the right side of the lower bar. */
let updateHyperlink;
/** @type {number} The update retry, don't hammer the server if it's not working, used only in checkForUpdates(). */
let updateRetryCount = 0;
/** @type {number} The update timeout timer used only in scheduleUpdateCheck(). */
let updateTimer;

/** @type {*} */
const globals = {};
/** @type {*} */
let settings = {};
/** @type {*} */
let theme = {};
/** @type {*} */
let style = {};
/** @type {*} */
let preset = {};
/** @type {*} */
let themePlayerSize = {};
/** @type {*} */
let themeLayout = {};
/** @type {*} */
let themeDisplay = {};
/** @type {*} */
let themeBrightness = {};
/** @type {*} */
let themeFontSize = {};
/** @type {*} */
let themeControls = {};
/** @type {*} */
let themePlaylist = {};
/** @type {*} */
let themeDetails = {};
/** @type {*} */
let themeLibrary = {};
/** @type {*} */
let themeBiography = {};
/** @type {*} */
let themeLyrics = {};
/** @type {*} */
let themeSettings = {};
/** @type {MetadataGridEntry[]} */
let metadataGrid;

// * Custom theme
/** @type {*} */
let customFont = {};
/** @type {*} */
let customStylePreset = {};
/** @type {*} */
let customDiscArtStub = {};
/** @type {*} */
let customTheme01 = {};
/** @type {*} */
let customTheme02 = {};
/** @type {*} */
let customTheme03 = {};
/** @type {*} */
let customTheme04 = {};
/** @type {*} */
let customTheme05 = {};
/** @type {*} */
let customTheme06 = {};
/** @type {*} */
let customTheme07 = {};
/** @type {*} */
let customTheme08 = {};
/** @type {*} */
let customTheme09 = {};
/** @type {*} */
let customTheme10 = {};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ! THEME PROPERTIES - AFTER INITIAL RUN, THESE VALUES ARE CHANGED IN OPTIONS MENU OR BY RIGHT CLICK >> PROPERTIES AND NOT HERE ! //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
pref.add_properties({
	version: ['Georgia-ReBORN - #Version: Do not hand edit!', currentVersion],

	// * Settings chronological ordered by top menu > Options

	// * Theme
	theme:                              ['Georgia-ReBORN - 01. Theme:', 'reborn'], // Use reborn theme as default
	theme_day:                          ['Georgia-ReBORN - 01. Theme_daytime:', 'white'], // Use white theme as default for daytime
	theme_night:                        ['Georgia-ReBORN - 01. Theme_nighttime:', 'black'], // Use black theme as default for nighttime
	savedTheme:                         ['Georgia-ReBORN - 01. Theme_saved:', 'reborn'], // Saved active theme state - used to restore theme state after custom [%GR_THEME%] usage

	// * Style
	styleDefault:                       ['Georgia-ReBORN - 02. Style: Default', true], // Use default style
	styleNighttime:                     ['Georgia-ReBORN - 02. Style: Nighttime', false], // Use Nighttime style
	styleBevel:                         ['Georgia-ReBORN - 02. Style: Bevel', false], // Use bevel style
	styleBlend:                         ['Georgia-ReBORN - 02. Style: Blend', false], // Use blend style
	styleBlend2:                        ['Georgia-ReBORN - 02. Style: Blend 2', false], // Use blend2 style
	styleGradient:                      ['Georgia-ReBORN - 02. Style: Gradient', false], // Use gradient style
	styleGradient2:                     ['Georgia-ReBORN - 02. Style: Gradient 2', false], // Use gradient2 style
	styleAlternative:                   ['Georgia-ReBORN - 02. Style: Alternative colors', false], // Use alternative colors style
	styleAlternative2:                  ['Georgia-ReBORN - 02. Style: Alternative colors 2', false], // Use alternative colors 2 style
	styleBlackAndWhite:                 ['Georgia-ReBORN - 02. Style: Black and white', false], // Use Black And White style
	styleBlackAndWhite2:                ['Georgia-ReBORN - 02. Style: Black and white 2', false], // Use Black And White 2 style
	styleBlackAndWhiteReborn:           ['Georgia-ReBORN - 02. Style: Black and white reborn', false], // Use Black And White Reborn style
	styleBlackReborn:                   ['Georgia-ReBORN - 02. Style: Black reborn', false], // Use Black reborn style
	styleRebornWhite:                   ['Georgia-ReBORN - 02. Style: Reborn white', false], // Use Reborn white style
	styleRebornBlack:                   ['Georgia-ReBORN - 02. Style: Reborn black', false], // Use Reborn black style
	styleRebornFusion:                  ['Georgia-ReBORN - 02. Style: Reborn fusion', false], // Use Reborn fusion style
	styleRebornFusion2:                 ['Georgia-ReBORN - 02. Style: Reborn fusion 2', false], // Use Reborn fusion 2 style
	styleRebornFusionAccent:            ['Georgia-ReBORN - 02. Style: Reborn fusion accent', false], // Use Reborn fusion accent style
	styleRandomPastel:                  ['Georgia-ReBORN - 02. Style: Random pastel', false], // Use Random pastel style
	styleRandomDark:                    ['Georgia-ReBORN - 02. Style: Random dark', false], // Use Random dark style
	styleRandomAutoColor:               ['Georgia-ReBORN - 02. Style: Random auto color', 'off'], // Use auto color in Random theme
	styleTopMenuButtons:                ['Georgia-ReBORN - 02. Style: Top menu buttons', 'default'], // default = flat, style of top menu buttons
	styleTransportButtons:              ['Georgia-ReBORN - 02. Style: Transport buttons', 'default'], // default = flat, style of transport buttons
	styleProgressBarDesign:             ['Georgia-ReBORN - 02. Style: Progress bar design', 'default'], // default = flat, progress bar design
	styleProgressBar:                   ['Georgia-ReBORN - 02. Style: Progress bar', 'default'], // default = flat, style of progress bar
	styleProgressBarFill:               ['Georgia-ReBORN - 02. Style: Progress bar fill', 'default'], // default = flat, style of progress bar fill
	styleVolumeBarDesign:               ['Georgia-ReBORN - 02. Style: Volume bar design', 'default'], // default = flat, volume bar design
	styleVolumeBar:                     ['Georgia-ReBORN - 02. Style: Volume bar', 'default'], // default = flat, style of volume bar
	styleVolumeBarFill:                 ['Georgia-ReBORN - 02. Style: Volume bar fill', 'default'], // default = flat, style of volume bar fill
	styleNighttime_day:                 ['Georgia-ReBORN - 02. Style_daytime: Nighttime', false], // Daytime nighttime style state - used for theme day/night mode usage
	styleBevel_day:                     ['Georgia-ReBORN - 02. Style_daytime: Bevel', false], // Daytime bevel style state - used for theme day/night mode usage
	styleBlend_day:                     ['Georgia-ReBORN - 02. Style_daytime: Blend', false], // Daytime blend style state - used for theme day/night mode usage
	styleBlend2_day:                    ['Georgia-ReBORN - 02. Style_daytime: Blend 2', false], // Daytime blend 2 style state - used for theme day/night mode usage
	styleGradient_day:                  ['Georgia-ReBORN - 02. Style_daytime: Gradient', false], // Daytime gradient style state - used for theme day/night mode usage
	styleGradient2_day:                 ['Georgia-ReBORN - 02. Style_daytime: Gradient 2', false], // Daytime gradient 2 style state - used for theme day/night mode usage
	styleAlternative_day:               ['Georgia-ReBORN - 02. Style_daytime: Alternative colors', false], // Daytime alternative style state - used for theme day/night mode usage
	styleAlternative2_day:              ['Georgia-ReBORN - 02. Style_daytime: Alternative colors 2', false], // Daytime alternative 2 style state - used for theme day/night mode usage
	styleBlackAndWhite_day:             ['Georgia-ReBORN - 02. Style_daytime: Black and white', false], // Daytime black and white style state - used for theme day/night mode usage
	styleBlackAndWhite2_day:            ['Georgia-ReBORN - 02. Style_daytime: Black and white 2', false], // Daytime black and white 2 style state - used for theme day/night mode usage
	styleBlackAndWhiteReborn_day:       ['Georgia-ReBORN - 02. Style_daytime: Black and white reborn', false], // Daytime black and white reborn style state - used for theme day/night mode usage
	styleBlackReborn_day:               ['Georgia-ReBORN - 02. Style_daytime: Black reborn', false], // Daytime black reborn style state - used for theme day/night mode usage
	styleRebornWhite_day:               ['Georgia-ReBORN - 02. Style_daytime: Reborn white', false], // Daytime reborn white style state - used for theme day/night mode usage
	styleRebornBlack_day:               ['Georgia-ReBORN - 02. Style_daytime: Reborn black', false], // Daytime reborn black style state - used for theme day/night mode usage
	styleRebornFusion_day:              ['Georgia-ReBORN - 02. Style_daytime: Reborn fusion', false], // Daytime reborn fusion style state - used for theme day/night mode usage
	styleRebornFusion2_day:             ['Georgia-ReBORN - 02. Style_daytime: Reborn fusion 2', false], // Daytime reborn fusion 2 style state - used for theme day/night mode usage
	styleRebornFusionAccent_day:        ['Georgia-ReBORN - 02. Style_daytime: Reborn fusion accent', false], // Daytime reborn fusion accent style state - used for theme day/night mode usage
	styleRandomPastel_day:              ['Georgia-ReBORN - 02. Style_daytime: Random pastel', false], // Daytime random pastel style state - used for theme day/night mode usage
	styleRandomDark_day:                ['Georgia-ReBORN - 02. Style_daytime: Random dark', false], // Daytime random dark style state - used for theme day/night mode usage
	styleRandomAutoColor_day:           ['Georgia-ReBORN - 02. Style_daytime: Random auto color', 'off'], // Daytime random auto color style state - used for theme day/night mode usage
	styleTopMenuButtons_day:            ['Georgia-ReBORN - 02. Style_daytime: Top menu buttons', 'default'], // Daytime top menu button style state - used for theme day/night mode usage
	styleTransportButtons_day:          ['Georgia-ReBORN - 02. Style_daytime: Transport buttons', 'default'], // Daytime transport button style state - used for theme day/night mode usage
	styleProgressBarDesign_day:         ['Georgia-ReBORN - 02. Style_daytime: Progress bar design', 'default'], // Daytime progress bar design style state - used for theme day/night mode usage
	styleProgressBar_day:               ['Georgia-ReBORN - 02. Style_daytime: Progress bar', 'default'], // Daytime progress bar style state - used for theme day/night mode usage
	styleProgressBarFill_day:           ['Georgia-ReBORN - 02. Style_daytime: Progress bar fill', 'default'], // Daytime progress bar fill style state - used for theme day/night mode usage
	styleVolumeBarDesign_day:           ['Georgia-ReBORN - 02. Style_daytime: Volume bar design', 'default'], // Daytime volume bar design style state - used for theme day/night mode usage
	styleVolumeBar_day:                 ['Georgia-ReBORN - 02. Style_daytime: Volume bar', 'default'], // Daytime volume bar style state - used for theme day/night mode usage
	styleVolumeBarFill_day:             ['Georgia-ReBORN - 02. Style_daytime: Volume bar fill', 'default'], // Daytime volume bar fill style state - used for theme day/night mode usage
	styleNighttime_night:               ['Georgia-ReBORN - 02. Style_nighttime: Nighttime', false], // Nighttime nighttime style state - used for theme day/night mode usage
	styleBevel_night:                   ['Georgia-ReBORN - 02. Style_nighttime: Bevel', false], // Nighttime bevel style state - used for theme day/night mode usage
	styleBlend_night:                   ['Georgia-ReBORN - 02. Style_nighttime: Blend', false], // Nighttime blend style state - used for theme day/night mode usage
	styleBlend2_night:                  ['Georgia-ReBORN - 02. Style_nighttime: Blend 2', false], // Nighttime blend 2 style state - used for theme day/night mode usage
	styleGradient_night:                ['Georgia-ReBORN - 02. Style_nighttime: Gradient', false], // Nighttime gradient style state - used for theme day/night mode usage
	styleGradient2_night:               ['Georgia-ReBORN - 02. Style_nighttime: Gradient 2', false], // Nighttime gradient 2 style state - used for theme day/night mode usage
	styleAlternative_night:             ['Georgia-ReBORN - 02. Style_nighttime: Alternative colors', false], // Nighttime alternative style state - used for theme day/night mode usage
	styleAlternative2_night:            ['Georgia-ReBORN - 02. Style_nighttime: Alternative colors 2', false], // Nighttime alternative 2 style state - used for theme day/night mode usage
	styleBlackAndWhite_night:           ['Georgia-ReBORN - 02. Style_nighttime: Black and white', false], // Nighttime black and white style state - used for theme day/night mode usage
	styleBlackAndWhite2_night:          ['Georgia-ReBORN - 02. Style_nighttime: Black and white 2', false], // Nighttime black and white 2 style state - used for theme day/night mode usage
	styleBlackAndWhiteReborn_night:     ['Georgia-ReBORN - 02. Style_nighttime: Black and white reborn', false], // Nighttime black and white reborn style state - used for theme day/night mode usage
	styleBlackReborn_night:             ['Georgia-ReBORN - 02. Style_nighttime: Black reborn', false], // Nighttime black reborn style state - used for theme day/night mode usage
	styleRebornWhite_night:             ['Georgia-ReBORN - 02. Style_nighttime: Reborn white', false], // Nighttime reborn white style state - used for theme day/night mode usage
	styleRebornBlack_night:             ['Georgia-ReBORN - 02. Style_nighttime: Reborn black', false], // Nighttime reborn black style state - used for theme day/night mode usage
	styleRebornFusion_night:            ['Georgia-ReBORN - 02. Style_nighttime: Reborn fusion', false], // Nighttime reborn fusion style state - used for theme day/night mode usage
	styleRebornFusion2_night:           ['Georgia-ReBORN - 02. Style_nighttime: Reborn fusion 2', false], // Nighttime reborn fusion 2 style state - used for theme day/night mode usage
	styleRebornFusionAccent_night:      ['Georgia-ReBORN - 02. Style_nighttime: Reborn fusion accent', false], // Nighttime reborn fusion accent style state - used for theme day/night mode usage
	styleRandomPastel_night:            ['Georgia-ReBORN - 02. Style_nighttime: Random pastel', false], // Nighttime random pastel style state - used for theme day/night mode usage
	styleRandomDark_night:              ['Georgia-ReBORN - 02. Style_nighttime: Random dark', false], // Nighttime random dark style state - used for theme day/night mode usage
	styleRandomAutoColor_night:         ['Georgia-ReBORN - 02. Style_nighttime: Random auto color', 'off'], // Nighttime random auto color style state - used for theme day/night mode usage
	styleTopMenuButtons_night:          ['Georgia-ReBORN - 02. Style_nighttime: Top menu buttons', 'default'], // Nighttime top menu button style state - used for theme day/night mode usage
	styleTransportButtons_night:        ['Georgia-ReBORN - 02. Style_nighttime: Transport buttons', 'default'], // Nighttime transport button style state - used for theme day/night mode usage
	styleProgressBarDesign_night:       ['Georgia-ReBORN - 02. Style_nighttime: Progress bar design', 'default'], // Nighttime progress bar design style state - used for theme day/night mode usage
	styleProgressBar_night:             ['Georgia-ReBORN - 02. Style_nighttime: Progress bar', 'default'], // Nighttime progress bar style state - used for theme day/night mode usage
	styleProgressBarFill_night:         ['Georgia-ReBORN - 02. Style_nighttime: Progress bar fill', 'default'], // Nighttime progress bar fill style state - used for theme day/night mode usage
	styleVolumeBarDesign_night:         ['Georgia-ReBORN - 02. Style_nighttime: Volume bar design', 'default'], // Nighttime volume bar design style state - used for theme day/night mode usage
	styleVolumeBar_night:               ['Georgia-ReBORN - 02. Style_nighttime: Volume bar', 'default'], // Nighttime volume bar style state - used for theme day/night mode usage
	styleVolumeBarFill_night:           ['Georgia-ReBORN - 02. Style_nighttime: Volume bar fill', 'default'], // Nighttime volume bar fill style state - used for theme day/night mode usage
	savedStyleNighttime:                ['Georgia-ReBORN - 02. Style_saved: Nighttime', false], // Saved active nighttime style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBevel:                    ['Georgia-ReBORN - 02. Style_saved: Bevel', false], // Saved active bevel style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBlend:                    ['Georgia-ReBORN - 02. Style_saved: Blend', false], // Saved active blend style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBlend2:                   ['Georgia-ReBORN - 02. Style_saved: Blend 2', false], // Saved active blend 2 style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleGradient:                 ['Georgia-ReBORN - 02. Style_saved: Gradient', false], // Saved active gradient style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleGradient2:                ['Georgia-ReBORN - 02. Style_saved: Gradient 2', false], // Saved active gradient 2 style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleAlternative:              ['Georgia-ReBORN - 02. Style_saved: Alternative colors', false], // Saved active alternative style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleAlternative2:             ['Georgia-ReBORN - 02. Style_saved: Alternative colors 2', false], // Saved active alternative 2 style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBlackAndWhite:            ['Georgia-ReBORN - 02. Style_saved: Black and white', false], // Saved active black and white style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBlackAndWhite2:           ['Georgia-ReBORN - 02. Style_saved: Black and white 2', false], // Saved active black and white 2 style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBlackAndWhiteReborn:      ['Georgia-ReBORN - 02. Style_saved: Black and white reborn', false], // Saved active black and white reborn style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleBlackReborn:              ['Georgia-ReBORN - 02. Style_saved: Black reborn', false], // Saved active black reborn style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRebornWhite:              ['Georgia-ReBORN - 02. Style_saved: Reborn white', false], // Saved active reborn white style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRebornBlack:              ['Georgia-ReBORN - 02. Style_saved: Reborn black', false], // Saved active reborn black style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRebornFusion:             ['Georgia-ReBORN - 02. Style_saved: Reborn fusion', false], // Saved active reborn fusion style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRebornFusion2:            ['Georgia-ReBORN - 02. Style_saved: Reborn fusion 2', false], // Saved active reborn fusion 2 style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRebornFusionAccent:       ['Georgia-ReBORN - 02. Style_saved: Reborn fusion accent', false], // Saved active reborn fusion accent style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRandomPastel:             ['Georgia-ReBORN - 02. Style_saved: Random pastel', false], // Saved active random pastel style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRandomDark:               ['Georgia-ReBORN - 02. Style_saved: Random dark', false], // Saved active random dark style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleRandomAutoColor:          ['Georgia-ReBORN - 02. Style_saved: Random auto color', 'off'], // Saved active random auto color style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleTopMenuButtons:           ['Georgia-ReBORN - 02. Style_saved: Top menu buttons', 'default'], // Saved active top menu button style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleTransportButtons:         ['Georgia-ReBORN - 02. Style_saved: Transport buttons', 'default'], // Saved active transport button style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleProgressBarDesign:        ['Georgia-ReBORN - 02. Style_saved: Progress bar design', 'default'], // Saved active progress bar design style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleProgressBar:              ['Georgia-ReBORN - 02. Style_saved: Progress bar', 'default'], // Saved active progress bar style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleProgressBarFill:          ['Georgia-ReBORN - 02. Style_saved: Progress bar fill', 'default'], // Saved active progress bar fill style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleVolumeBarDesign:          ['Georgia-ReBORN - 02. Style_saved: Volume bar design', 'default'], // Saved active volume bar design style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleVolumeBar:                ['Georgia-ReBORN - 02. Style_saved: Volume bar', 'default'], // Saved active volume bar style state - used to restore style state after custom [%GR_STYLE%] usage
	savedStyleVolumeBarFill:            ['Georgia-ReBORN - 02. Style_saved: Volume bar fill', 'default'], // Saved active volume bar fill style state - used to restore style state after custom [%GR_STYLE%] usage

	// * Preset
	preset:                             ['Georgia-ReBORN - 03. Preset: Active preset:', false], // Active preset
	preset_day:                         ['Georgia-ReBORN - 03. Preset: Active preset_daytime:', false], // Daytime active preset
	preset_night:                       ['Georgia-ReBORN - 03. Preset: Active preset_nighttime:', false], // Nighttime active preset
	presetSelectMode:                   ['Georgia-ReBORN - 03. Preset: Select mode', 'default'], // 'default', 'theme', 'harmonic' - preset select mode
	presetSelectWhite:                  ['Georgia-ReBORN - 03. Preset: Select presets: White', true], // Include White theme presets when using the auto random presets timer
	presetSelectBlack:                  ['Georgia-ReBORN - 03. Preset: Select presets: Black', true], // Include Black theme presets when using the auto random presets timer
	presetSelectReborn:                 ['Georgia-ReBORN - 03. Preset: Select presets: Reborn', true], // Include Reborn theme presets when using the auto random presets timer
	presetSelectRandom:                 ['Georgia-ReBORN - 03. Preset: Select presets: Random', true], // Include Random theme presets when using the auto random presets timer
	presetSelectBlue:                   ['Georgia-ReBORN - 03. Preset: Select presets: Blue', true], // Include Blue theme presets when using the auto random presets timer
	presetSelectDarkblue:               ['Georgia-ReBORN - 03. Preset: Select presets: Dark blue', true], // Include Darkblue theme presets when using the auto random presets timer
	presetSelectRed:                    ['Georgia-ReBORN - 03. Preset: Select presets: Red', true], // Include Red theme presets when using the auto random presets timer
	presetSelectCream:                  ['Georgia-ReBORN - 03. Preset: Select presets: Cream', true], // Include Cream theme presets when using the auto random presets timer
	presetSelectNblue:                  ['Georgia-ReBORN - 03. Preset: Select presets: Neon blue', true], // Include Neon blue theme presets when using the auto random presets timer
	presetSelectNgreen:                 ['Georgia-ReBORN - 03. Preset: Select presets: Neon green', true], // Include Neon green theme presets when using the auto random presets timer
	presetSelectNred:                   ['Georgia-ReBORN - 03. Preset: Select presets: Neon red', true], // Include Neon red theme presets when using the auto random presets timer
	presetSelectNgold:                  ['Georgia-ReBORN - 03. Preset: Select presets: Neon gold', true], // Include Neon gold theme presets when using the auto random presets timer
	presetSelectCustom:                 ['Georgia-ReBORN - 03. Preset: Select presets: Custom theme', true], // Include Custom theme presets when using the auto random presets timer
	presetAutoRandomMode:               ['Georgia-ReBORN - 03. Preset: Auto random mode:', 'dblclick'], // Auto random mode
	presetIndicator:                    ['Georgia-ReBORN - 03. Preset: Indicator:', true], // Preset indicator
	savedPreset:                        ['Georgia-ReBORN - 03. Preset_saved: Active preset:', false], // Saved active preset state - used for custom [%GR_PRESET%]

	// * Player size
	playerSize:                         ['Georgia-ReBORN - 04. Player size:', 'small'], // Default player size
	playerSize_4K_small:                ['Georgia-ReBORN - 04. Player size: 4K Small',   false], // Player size Small 4K
	playerSize_4K_normal:               ['Georgia-ReBORN - 04. Player size: 4K Normal',  false], // Player size Normal 4K
	playerSize_4K_large:                ['Georgia-ReBORN - 04. Player size: 4K Large',   false], // Player size Large 4K
	playerSize_QHD_small:               ['Georgia-ReBORN - 04. Player size: QHD Small',  false], // Player size Small QHD
	playerSize_QHD_normal:              ['Georgia-ReBORN - 04. Player size: QHD Normal', false], // Player size Normal QHD
	playerSize_QHD_large:               ['Georgia-ReBORN - 04. Player size: QHD Large',  false], // Player size Large QHD
	playerSize_HD_small:                ['Georgia-ReBORN - 04. Player size: HD Small',   false], // Player size Small HD
	playerSize_HD_normal:               ['Georgia-ReBORN - 04. Player size: HD Normal',  false], // Player size Normal HD
	playerSize_HD_large:                ['Georgia-ReBORN - 04. Player size: HD Large',   false], // Player size Large HD

	// * Layout
	layout:                             ['Georgia-ReBORN - 05. Layout', 'default'], // Default layout

	// * Display resolution
	displayRes:                         ['Georgia-ReBORN - 06. Display', '<not_set>'], // 4K: Switch to 4K res, QHD: switch to QHD res, HD: switch to HD res

	// * Brightness
	themeBrightness:                    ['Georgia-ReBORN - 07. Brightness', 'default'], // default: Theme brightness
	themeBrightness_day:                ['Georgia-ReBORN - 07. Brightness_daytime', 'default'], // default: Daytime theme brightness
	themeBrightness_night:              ['Georgia-ReBORN - 07. Brightness_nighttime', 'default'], // default: Nighttime theme brightness
	savedThemeBrightness:               ['Georgia-ReBORN - 07. Saved_Brightness', 'default'], // Saved active theme brightness state - used to restore brightness after custom [%GR_PRESET%] usage

	// * Font size
	menuFontSize_default:               ['Georgia-ReBORN - 08. Font size: Top menu (Default)', 12], // Top menu font size in Default layout
	menuFontSize_artwork:               ['Georgia-ReBORN - 08. Font size: Top menu (Artwork)', 12], // Top menu font size in Artwork layout
	menuFontSize_compact:               ['Georgia-ReBORN - 08. Font size: Top menu (Compact)', 12], // Top menu font size in Compact
	lowerBarFontSize_default:           ['Georgia-ReBORN - 08. Font size: Lower bar (Default)', 18], // Lower bar font size in Default layout
	lowerBarFontSize_artwork:           ['Georgia-ReBORN - 08. Font size: Lower bar (Artwork)', 16], // Lower bar font size in Artwork layout
	lowerBarFontSize_compact:           ['Georgia-ReBORN - 08. Font size: Lower bar (Compact)', 16], // Lower bar font size in Compact layout
	notificationFontSize_default:       ['Georgia-ReBORN - 08. Font size: Notification (Default)', 18], // Notification font size in Default layout
	notificationFontSize_artwork:       ['Georgia-ReBORN - 08. Font size: Notification (Artwork)', 16], // Notification font size in Artwork layout
	notificationFontSize_compact:       ['Georgia-ReBORN - 08. Font size: Notification (Compact)', 16], // Notification font size in Compact layout
	popupFontSize_default:              ['Georgia-ReBORN - 08. Font size: Popup (Default)', 16], // Popup font size in Default layout
	popupFontSize_artwork:              ['Georgia-ReBORN - 08. Font size: Popup (Artwork)', 14], // Popup font size in Artwork layout
	popupFontSize_compact:              ['Georgia-ReBORN - 08. Font size: Popup (Compact)', 14], // Popup font size in Compact layout
	tooltipFontSize_default:            ['Georgia-ReBORN - 08. Font size: Tooltip (Default)', 16], // Tooltip font size in Default layout
	tooltipFontSize_artwork:            ['Georgia-ReBORN - 08. Font size: Tooltip (Artwork)', 14], // Tooltip font size in Artwork layout
	tooltipFontSize_compact:            ['Georgia-ReBORN - 08. Font size: Tooltip (Compact)', 14], // Tooltip font size in Compact layout
	gridArtistFontSize_default:         ['Georgia-ReBORN - 08. Font size: Details artist (Default)', 18], // Details artist font size in Default layout
	gridArtistFontSize_artwork:         ['Georgia-ReBORN - 08. Font size: Details artist (Artwork)', 16], // Details artist font size in Artwork layout
	gridTrackNumFontSize_default:       ['Georgia-ReBORN - 08. Font size: Details track number (Default)', 18], // Details track number font size in Default layout
	gridTrackNumFontSize_artwork:       ['Georgia-ReBORN - 08. Font size: Details track number (Artwork)', 18], // Details track number font size in Artwork layout
	gridTitleFontSize_default:          ['Georgia-ReBORN - 08. Font size: Details title (Default)', 20], // Details album font size in Default layout
	gridTitleFontSize_artwork:          ['Georgia-ReBORN - 08. Font size: Details title (Artwork)', 20], // Details album font size in Artwork layout
	gridAlbumFontSize_default:          ['Georgia-ReBORN - 08. Font size: Details album (Default)', 20], // Details album font size in Default layout
	gridAlbumFontSize_artwork:          ['Georgia-ReBORN - 08. Font size: Details album (Artwork)', 20], // Details album font size in Artwork layout
	gridKeyFontSize_default:            ['Georgia-ReBORN - 08. Font size: Details grid key (Default)', 17], // Details key font size in Default layout
	gridKeyFontSize_artwork:            ['Georgia-ReBORN - 08. Font size: Details grid key (Artwork)', 17], // Details key font size in Artwork layout
	gridValueFontSize_default:          ['Georgia-ReBORN - 08. Font size: Details grid value (Default)', 17], // Details value font size in Default layout
	gridValueFontSize_artwork:          ['Georgia-ReBORN - 08. Font size: Details grid value (Artwork)', 17], // Details value font size in Artwork layout
	playlistFontSize_default:           ['Georgia-ReBORN - 08. Font size: Playlist (Default)', 12], // Playlist font size in Default layout
	playlistFontSize_artwork:           ['Georgia-ReBORN - 08. Font size: Playlist (Artwork)', 12], // Playlist font size in Artwork layout
	playlistFontSize_compact:           ['Georgia-ReBORN - 08. Font size: Playlist (Compact)', 12], // Playlist font size in Compact layout
	playlistHeaderFontSize_default:     ['Georgia-ReBORN - 08. Font size: Playlist Header (Default)', 15], // Playlist header font size in Default layout
	playlistHeaderFontSize_artwork:     ['Georgia-ReBORN - 08. Font size: Playlist Header (Artwork)', 15], // Playlist header font size in Artwork layout
	playlistHeaderFontSize_compact:     ['Georgia-ReBORN - 08. Font size: Playlist Header (Compact)', 15], // Playlist header font size in Compact layout
	libraryFontSize_default:            ['Georgia-ReBORN - 08. Font size: Library (Default)', 12], // Library font size in Default layout
	libraryFontSize_artwork:            ['Georgia-ReBORN - 08. Font size: Library (Artwork)', 12], // Library font size in Artwork layout
	biographyFontSize_default:          ['Georgia-ReBORN - 08. Font size: Biography (Default)', 12], // Biography font size in Default layout
	biographyFontSize_artwork:          ['Georgia-ReBORN - 08. Font size: Biography (Artwork)', 12], // Biography font size in Artwork layout
	lyricsFontSize_default:             ['Georgia-ReBORN - 08. Font size: Lyrics (Default)', 20], // Lyrics font size in Default layout
	lyricsFontSize_artwork:             ['Georgia-ReBORN - 08. Font size: Lyrics (Artwork)', 20], // Lyrics font size in Artwork layout

	// * Player controls
	showPanelDetails_default:           ['Georgia-ReBORN - 09. Player controls: Show Details panel (Default)', true], // true: Show Details panel in top menu in Default layout
	showPanelDetails_artwork:           ['Georgia-ReBORN - 09. Player controls: Show Details panel (Artwork)', true], // true: Show Details panel in top menu in Artwork layout
	showPanelLibrary_default:           ['Georgia-ReBORN - 09. Player controls: Show Library panel (Default)', true], // true: Show Library panel in top menu in Default layout
	showPanelLibrary_artwork:           ['Georgia-ReBORN - 09. Player controls: Show Library panel (Artwork)', true], // true: Show Library panel in top menu in Artwork layout
	showPanelBiography_default:         ['Georgia-ReBORN - 09. Player controls: Show Biography panel (Default)', true], // true: Show Biography panel in top menu in Default layout
	showPanelBiography_artwork:         ['Georgia-ReBORN - 09. Player controls: Show Biography panel (Artwork)', true], // true: Show Biography panel in top menu in Artwork layout
	showPanelLyrics_default:            ['Georgia-ReBORN - 09. Player controls: Show Lyrics panel (Default)', true], // true: Show Lyrics panel in top menu in Default layout
	showPanelLyrics_artwork:            ['Georgia-ReBORN - 09. Player controls: Show Lyrics panel (Artwork)', true], // true: Show Lyrics panel in top menu in Artwork layout
	showPanelRating_default:            ['Georgia-ReBORN - 09. Player controls: Show Rating panel (Default)', true], // true: Show Rating panel in top menu in Default layout
	showPanelRating_artwork:            ['Georgia-ReBORN - 09. Player controls: Show Rating panel (Artwork)', true], // true: Show Rating panel in top menu in Artwork layout
	topMenuAlignment:                   ['Georgia-ReBORN - 09. Player controls: Top menu alignment', 'center'], // 'left' or 'center' - top menu alignment
	showTopMenuCompact:                 ['Georgia-ReBORN - 09. Player controls: Show top menu compact', true], // true: will display the top menu will be displayed as a hamburger menu
	topMenuCompact:                     ['Georgia-ReBORN - 09. Player controls: Top menu compact', true], // true: top menu will be displayed as a hamburger menu
	albumArtAlign:                      ['Georgia-ReBORN - 09. Player controls: Album art alignment', 'right'], // right: Align album art in Default layout when player size is not proportional
	albumArtBg:                         ['Georgia-ReBORN - 09. Player controls: Album art background', 'left'], // 'left': Show album art background when player size is not proportional
	albumArtScale:                      ['Georgia-ReBORN - 09. Player controls: Album art scale fullscreen', 'filled'], // filled: Scale album art in Default layout when player size is maximized/fullscreen
	cycleArt:                           ['Georgia-ReBORN - 09. Player controls: Cycle through all images', false], // true: Use glob, false: use albumArt reader (front only)
	cycleArtMWheel:                     ['Georgia-ReBORN - 09. Player controls: Cycle through all images with mouse wheel', true], // true: Cycle through all images with mouse wheel
	loadEmbeddedAlbumArtFirst:          ['Georgia-ReBORN - 09. Player controls: Load embedded album art first', false], // false: Loads embedded album art from music files first
	showHiResAudioBadge:                ['Georgia-ReBORN - 09. Player controls: Show Hi-res audio badge on album cover', false], // false: Show hi-res audio badge on album cover
	showPause:                          ['Georgia-ReBORN - 09. Player controls: Show pause on album cover', true], // true: Show pause button on album cover
	hiResAudioBadgeRound:               ['Georgia-ReBORN - 09. Player controls: Show Hi-res audio badge round', false], // false: Round hi-res audio badge
	hiResAudioBadgeSize:                ['Georgia-ReBORN - 09. Player controls: Show Hi-res audio badge size', 'normal'], // 'small', 'normal', 'large': Hi-res audio badge size
	hiResAudioBadgePos:                 ['Georgia-ReBORN - 09. Player controls: Show Hi-res audio badge position', 'bottomright'], // 'topleft', 'topright', 'bottomleft', 'bottomright' : Hi-res audio badge position
	jumpSearchIncludeLibrary:           ['Georgia-ReBORN - 09. Player controls: Jump search include library', true], // true: Include library in playlist search query
	jumpSearchIncludePlaylist:          ['Georgia-ReBORN - 09. Player controls: Jump search include playlist', true], // true: Include playlist in library search query
	jumpSearchComposerOnly:             ['Georgia-ReBORN - 09. Player controls: Jump search composer only', false], // true: Composer only in jump search query
	playlistWheelScrollSteps:           ['Georgia-ReBORN - 09. Player controls: Mouse wheel scroll steps (Playlist)', 3], // Playlist mouse wheel scroll steps
	playlistWheelScrollDuration:        ['Georgia-ReBORN - 09. Player controls: Mouse wheel scroll smooth duration (Playlist)', 300], // Playlist mouse wheel scroll smooth duration in ms
	playlistAutoScrollNowPlaying:       ['Georgia-ReBORN - 09. Player controls: Auto-scroll to current playing song (Playlist)', false], // Auto-scroll to current playing song in playlist
	playlistAutoHideScrollbar:          ['Georgia-ReBORN - 09. Player controls: Auto-hide scrollbar (Playlist)', true], // Auto-hide Playlist scrollbar
	playlistSmoothScrolling:            ['Georgia-ReBORN - 09. Player controls: Smooth scrolling (Playlist)', true], // Playlist smooth scrolling
	libraryAutoScrollNowPlaying:        ['Georgia-ReBORN - 09. Player controls: Auto-scroll to current playing song (Library)', false], // Auto-scroll to current playing song in library
	libraryAutoHideScrollbar:           ['Georgia-ReBORN - 09. Player controls: Auto-hide scrollbar (Library)', true], // Auto-hide Library scrollbar
	biographyAutoHideScrollbar:         ['Georgia-ReBORN - 09. Player controls: Auto-hide scrollbar (Biography)', true], // Biography automatic scrollbar hide
	showTooltipTruncated:               ['Georgia-ReBORN - 09. Player controls: Show tooltips only on truncated text', true], // true: Show tooltips when hovering over truncated text on lower bar, metadata grid and playlist
	showTooltipTimeline:                ['Georgia-ReBORN - 09. Player controls: Show timeline tooltips', true], // true: Show tooltips when hovering over the timeline that show information on plays
	showTooltipVolume:                  ['Georgia-ReBORN - 09. Player controls: Show volume tooltips', true], // true: Show tooltips when hovering over the volume bar or when changing volume
	showTooltipVolumeInPercent:         ['Georgia-ReBORN - 09. Player controls: Show volume tooltips in percent', false], // true: Show volume tooltips when hovering over the volume bar in percent instead of dB
	showTooltipMain:                    ['Georgia-ReBORN - 09. Player controls: Show main tooltips', false], // true: Show all tooltips
	showTooltipLibrary:                 ['Georgia-ReBORN - 09. Player controls: Show library tooltips', false], // true: Show library tooltips
	showTooltipBiography:               ['Georgia-ReBORN - 09. Player controls: Show biography tooltips', false], // true: Show biography tooltips
	showStyledTooltips:                 ['Georgia-ReBORN - 09. Player controls: Show styled tooltips', true], // true: Show styled tooltips
	panelWidthAuto:                     ['Georgia-ReBORN - 09. Player controls: Use auto panel width', false], // true: Use auto panel width when player size is not proportional
	showPanelOnStartup:                 ['Georgia-ReBORN - 09. Player controls: Show panel on startup', 'playlist'], // "cover", "playlist", "details", "library", "biography", "lyrics" - show panel on foobar startup
	showPreloaderLogo:                  ['Georgia-ReBORN - 09. Player controls: Show logo on preloader', true], // true: Show logo on preloader
	showPreloaderCustomLogo:            ['Georgia-ReBORN - 09. Player controls: Show custom logo on preloader', false], // false: Show custom logo on preloader
	returnToHomeOnPlaybackStop:         ['Georgia-ReBORN - 09. Player controls: Return to home on playback stop', true], // true: Return to home on playback stop
	hideMiddlePanelShadow:              ['Georgia-ReBORN - 09. Player controls: Hide middle panel shadow', false], // false: Hides the middle panel shadow
	lockPlayerSize:                     ['Georgia-ReBORN - 09. Player controls: Lock player size', false], // false: Locks the player size
	transportButtonSize_default:        ['Georgia-ReBORN - 09. Player controls: Transport button size (Default)', 32], // Size in pixels of the buttons in Default layout
	transportButtonSize_artwork:        ['Georgia-ReBORN - 09. Player controls: Transport button size (Artwork)', 32], // Size in pixels of the buttons in Artwork layout
	transportButtonSize_compact:        ['Georgia-ReBORN - 09. Player controls: Transport button size (Compact)', 32], // Size in pixels of the buttons in Compact layout
	transportButtonSpacing_default:     ['Georgia-ReBORN - 09. Player controls: Transport button spacing (Default)', 5], // Size in pixels of the spacing between buttons in Default layout
	transportButtonSpacing_artwork:     ['Georgia-ReBORN - 09. Player controls: Transport button spacing (Artwork)', 5], // Size in pixels of the spacing between buttons in Artwork layout
	transportButtonSpacing_compact:     ['Georgia-ReBORN - 09. Player controls: Transport button spacing (Compact)', 5], // Size in pixels of the spacing between buttons in Compact layout
	showTransportControls_default:      ['Georgia-ReBORN - 09. Player controls: Show transport controls (Default)', true], // true: Show transport controls in lower bar in Default layout
	showTransportControls_artwork:      ['Georgia-ReBORN - 09. Player controls: Show transport controls (Artwork)', true], // true: Show transport controls in lower bar in Artwork layout
	showTransportControls_compact:      ['Georgia-ReBORN - 09. Player controls: Show transport controls (Compact)', true], // true: Show transport controls in lower bar in Compact layout
	showPlaybackOrderBtn_default:       ['Georgia-ReBORN - 09. Player controls: Show playback order button (Default)', true], // true: Show playback order button in lower bar in Default layout
	showPlaybackOrderBtn_artwork:       ['Georgia-ReBORN - 09. Player controls: Show playback order button (Artwork)', true], // true: Show playback order button in lower bar in Artwork layout
	showPlaybackOrderBtn_compact:       ['Georgia-ReBORN - 09. Player controls: Show playback order button (Compact)', true], // true: Show playback order button in lower bar in Compact layout
	showReloadBtn_default:              ['Georgia-ReBORN - 09. Player controls: Show reload button (Default)', false], // false: Show reload button in lower bar in Default layout
	showReloadBtn_artwork:              ['Georgia-ReBORN - 09. Player controls: Show reload button (Artwork)', false], // false: Show reload button in lower bar in Artwork layout
	showReloadBtn_compact:              ['Georgia-ReBORN - 09. Player controls: Show reload button (Compact)', false], // false: Show reload button in lower bar in Compact layout
	showVolumeBtn_default:              ['Georgia-ReBORN - 09. Player controls: Show volume button (Default)', true], // true: Show volume button in lower bar in Default layout
	showVolumeBtn_artwork:              ['Georgia-ReBORN - 09. Player controls: Show volume button (Artwork)', true], // true: Show volume button in lower bar in Artwork layout
	showVolumeBtn_compact:              ['Georgia-ReBORN - 09. Player controls: Show volume button (Compact)', true], // true: Show volume button in lower bar in Compact layout
	autoHideVolumeBar:                  ['Georgia-ReBORN - 09. Player controls: Auto-hide volume bar', true], // Volume control bar hide
	showPlaybackTime_default:           ['Georgia-ReBORN - 09. Player controls: Show playback time in lower bar (Default)', true], // Show playback time in lower bar in Default layout
	showPlaybackTime_artwork:           ['Georgia-ReBORN - 09. Player controls: Show playback time in lower bar (Artwork)', true], // Show playback time in lower bar in Artwork layout
	showPlaybackTime_compact:           ['Georgia-ReBORN - 09. Player controls: Show playback time in lower bar (Compact)', true], // Show playback time in lower bar in Compact layout
	showLowerBarArtist_default:         ['Georgia-ReBORN - 09. Player controls: Show artist in lower bar (Default)', true], // Show artist in lower bar in Default layout
	showLowerBarArtist_artwork:         ['Georgia-ReBORN - 09. Player controls: Show artist in lower bar (Artwork)', true], // Show artist in lower bar in Artwork layout
	showLowerBarArtist_compact:         ['Georgia-ReBORN - 09. Player controls: Show artist in lower bar (Compact)', true], // Show artist in lower bar in Compact layout
	showLowerBarTrackNum_default:       ['Georgia-ReBORN - 09. Player controls: Show track number in lower bar (Default)', true], // Show track number in lower bar in Default layout
	showLowerBarTrackNum_artwork:       ['Georgia-ReBORN - 09. Player controls: Show track number in lower bar (Artwork)', true], // Show track number in lower bar in Artwork layout
	showLowerBarTrackNum_compact:       ['Georgia-ReBORN - 09. Player controls: Show track number in lower bar (Compact)', true], // Show track number in lower bar in Compact layout
	showLowerBarTitle_default:          ['Georgia-ReBORN - 09. Player controls: Show song title in lower bar (Default)', true], // Show song title in lower bar in Default layout
	showLowerBarTitle_artwork:          ['Georgia-ReBORN - 09. Player controls: Show song title in lower bar (Artwork)', true], // Show song title in lower bar in Artwork layout
	showLowerBarTitle_compact:          ['Georgia-ReBORN - 09. Player controls: Show song title in lower bar (Compact)', true], // Show song title in lower bar in Compact layout
	showLowerBarComposer_default:       ['Georgia-ReBORN - 09. Player controls: Show composer in lower bar (Default)', false], // Show composer in lower bar in Default layout
	showLowerBarComposer_artwork:       ['Georgia-ReBORN - 09. Player controls: Show composer in lower bar (Artwork)', false], // Show composer in lower bar in Artwork layout
	showLowerBarComposer_compact:       ['Georgia-ReBORN - 09. Player controls: Show composer in lower bar (Compact)', false], // Show composer in lower bar in Compact layout
	showLowerBarArtistFlags_default:    ['Georgia-ReBORN - 09. Player controls: Show country flags in lower bar (Default)', true], // true: Show the artist country flags in lower bar in Default layout
	showLowerBarArtistFlags_artwork:    ['Georgia-ReBORN - 09. Player controls: Show country flags in lower bar (Artwork)', true], // true: Show the artist country flags in lower bar in Artwork layout
	showLowerBarArtistFlags_compact:    ['Georgia-ReBORN - 09. Player controls: Show country flags in lower bar (Compact)', true], // true: Show the artist country flags in lower bar in Compact layout
	showLowerBarVersion_default:        ['Georgia-ReBORN - 09. Player controls: Show software version in lower bar (Default)', true], // true: Show software version in lower bar in Default layout
	showLowerBarVersion_artwork:        ['Georgia-ReBORN - 09. Player controls: Show software version in lower bar (Artwork)', true], // true: Show software version in lower bar in Artwork layout
	showLowerBarVersion_compact:        ['Georgia-ReBORN - 09. Player controls: Show software version in lower bar (Compact)', true], // true: Show software version in lower bar in Compact layout
	showProgressBar_default:            ['Georgia-ReBORN - 09. Player controls: Show progress bar (Default)', true], // true: Show progress bar in Default layout, otherwise hide it (useful is using another panel for this)
	showProgressBar_artwork:            ['Georgia-ReBORN - 09. Player controls: Show progress bar (Artwork)', true], // true: Show progress bar in Artwork layout, otherwise hide it (useful is using another panel for this)
	showProgressBar_compact:            ['Georgia-ReBORN - 09. Player controls: Show progress bar (Compact)', true], // true: Show progress bar in Compact layout, otherwise hide it (useful is using another panel for this)
	showPeakmeterBar_default:           ['Georgia-ReBORN - 09. Player controls: Show peakmeter bar (Default)', true], // true: Show peakmeter bar in Default layout, otherwise hide it (useful is using another panel for this)
	showPeakmeterBar_artwork:           ['Georgia-ReBORN - 09. Player controls: Show peakmeter bar (Artwork)', true], // true: Show peakmeter bar in Artwork layout, otherwise hide it (useful is using another panel for this)
	showPeakmeterBar_compact:           ['Georgia-ReBORN - 09. Player controls: Show peakmeter bar (Compact)', true], // true: Show peakmeter bar in Compact layout, otherwise hide it (useful is using another panel for this)
	showWaveformBar_default:            ['Georgia-ReBORN - 09. Player controls: Show waveform bar (Default)', true], // true: Show waveform bar in Default layout, otherwise hide it (useful is using another panel for this)
	showWaveformBar_artwork:            ['Georgia-ReBORN - 09. Player controls: Show waveform bar (Artwork)', true], // true: Show waveform bar in Artwork layout, otherwise hide it (useful is using another panel for this)
	showWaveformBar_compact:            ['Georgia-ReBORN - 09. Player controls: Show waveform bar (Compact)', true], // true: Show waveform bar in Compact layout, otherwise hide it (useful is using another panel for this)
	seekbar:                            ['Georgia-ReBORN - 09. Player controls: Seekbar', 'progressbar'], // 'progressbar', 'peakmeterbar', 'waveformbar' - Seekbar type
	progressBarWheelSeekSpeed:          ['Georgia-ReBORN - 09. Player controls: Progress bar mouse wheel seek speed', 5], // Progress bar mouse wheel seeking speed, seconds per wheel step
	progressBarRefreshRate:             ['Georgia-ReBORN - 09. Player controls: Progress bar refresh rate', 'variable'], // variable - default: Update progress bar multiple times a second. Smoother, but uses more CPU
	peakmeterBarDesign:                 ['Georgia-ReBORN - 09. Player controls: Peakmeter bar design', 'horizontal'], // 'horizontal', 'horizontal_center', 'vertical' - peakmeter bar design
	peakmeterBarVertSize:               ['Georgia-ReBORN - 09. Player controls: Peakmeter bar vertical bar size', 20], // 0, 2, 4, 6, 8, 10, 20, 25, 30, 35, 40, 'min' - Width size of drawn bars in vertical design
	peakmeterBarVertDbRange:            ['Georgia-ReBORN - 09. Player controls: Peakmeter bar vertical decibel range', 220], // 220, 215, 210, 320, 315, 310, 520, 515, 510 - Decibel range in vertical design
	peakmeterBarOverBars:               ['Georgia-ReBORN - 09. Player controls: Peakmeter bar over bars', true], // true - Show peakmeter over bars
	peakmeterBarOuterBars:              ['Georgia-ReBORN - 09. Player controls: Peakmeter bar outer bars', true], // true - Show peakmeter outer bars
	peakmeterBarOuterPeaks:             ['Georgia-ReBORN - 09. Player controls: Peakmeter bar outer peaks', true], // true - Show peakmeter outer peaks
	peakmeterBarMainBars:               ['Georgia-ReBORN - 09. Player controls: Peakmeter bar main bars', true], // true - Show peakmeter main bars
	peakmeterBarMainPeaks:              ['Georgia-ReBORN - 09. Player controls: Peakmeter bar main peaks', true], // true - Show peakmeter main peaks
	peakmeterBarMiddleBars:             ['Georgia-ReBORN - 09. Player controls: Peakmeter bar middle bars', true], // true - Show peakmeter middle bars
	peakmeterBarProgBar:                ['Georgia-ReBORN - 09. Player controls: Peakmeter bar progress bar', true], // true - Show peakmeter progress bar
	peakmeterBarGaps:                   ['Georgia-ReBORN - 09. Player controls: Peakmeter bar gaps', false], // false - Show peakmeter bar gaps
	peakmeterBarGrid:                   ['Georgia-ReBORN - 09. Player controls: Peakmeter bar grid', false], // false - Show peakmeter bar grid
	peakmeterBarInfo:                   ['Georgia-ReBORN - 09. Player controls: Peakmeter bar info', false], // false - Show peakmeter bar info
	peakmeterBarVertPeaks:              ['Georgia-ReBORN - 09. Player controls: Peakmeter bar vertical peaks', true], // true - Show peakmeter bar peaks in vertical design
	peakmeterBarVertBaseline:           ['Georgia-ReBORN - 09. Player controls: Peakmeter bar baseline', true], // true - Show peakmeter bar baseline in vertical design
	peakmeterBarRefreshRate:            ['Georgia-ReBORN - 09. Player controls: Peakmeter bar refresh rate', 80], // 200, 150, 120, 100, 80, 60, 30 - Peakmeter bars refresh rate
	waveformBarMode:                    ['Georgia-ReBORN - 09. Player controls: Waveform bar mode', 'audiowaveform'], // 'ffprobe' 'audiowaveform' 'visualizer' - Which binary type the waveform bar will use
	waveformBarAnalysis:                ['Georgia-ReBORN - 09. Player controls: Waveform bar analysis', 'rms_level'], // 'rms_level'  'peak_level' 'rms_peak' - Analysis type available only with ffprobe
	waveformBarDesign:                  ['Georgia-ReBORN - 09. Player controls: Waveform bar design', 'halfbars'], // 'waveform' 'bars' 'dots' 'halfbars' - waveform bar design
	waveformBarSizeWave:                ['Georgia-ReBORN - 09. Player controls: Waveform bar waveform size', 3], // 1 - 5 - Width size of drawn waveform lines
	waveformBarSizeBars:                ['Georgia-ReBORN - 09. Player controls: Waveform bar bars size', 1], // 1 - 5 - Width size of drawn bars lines
	waveformBarSizeDots:                ['Georgia-ReBORN - 09. Player controls: Waveform bar dots size', 2], // 1 - 5 - Width size of drawn dots lines
	waveformBarSizeHalf:                ['Georgia-ReBORN - 09. Player controls: Waveform bar halfbars size', 4], // 1 - 5 - Width size of drawn halfbars lines
	waveformBarSizeNormalize:           ['Georgia-ReBORN - 09. Player controls: Waveform bar normalize width', false], // false - normalizes the width of the waveform
	waveformBarPaint:                   ['Georgia-ReBORN - 09. Player controls: Waveform bar paint', 'partial'], // 'full', 'partial' - Which paint mode the waveform bar will use
	waveformBarPrepaint:                ['Georgia-ReBORN - 09. Player controls: Waveform bar prepaint', true], // true: Should the waveform bar prepaint frames
	waveformBarPrepaintFront:           ['Georgia-ReBORN - 09. Player controls: Waveform bar prepaint front', Infinity], // Infinity, 2, 5, 10 - How much in advance should the waveform bar paint
	waveformBarAnimate:                 ['Georgia-ReBORN - 09. Player controls: Waveform bar animate', true], // true: Animate the waveform bar
	waveformBarBPM:                     ['Georgia-ReBORN - 09. Player controls: Waveform bar BPM', true], // true: Animate the waveform bar with BPM
	waveformBarInvertHalfbars:          ['Georgia-ReBORN - 09. Player controls: Waveform bar invert halfbars', true], // true: Displays the waveform bar halfbars inverted
	waveformBarIndicator:               ['Georgia-ReBORN - 09. Player controls: Waveform bar indicator', false], // false: Shows the waveform bar indicator
	waveformBarRefreshRate:             ['Georgia-ReBORN - 09. Player controls: Waveform bar refresh rate', 200], // 1000, 500, 200, 100, 60, 30 - Waveform bars refresh rate
	waveformBarRefreshRateVar:          ['Georgia-ReBORN - 09. Player controls: Waveform bar refresh rate variable', false], // false: Should the waveform bar use variable refresh rate
	maximizeToFullscreen:               ['Georgia-ReBORN - 09. Player controls: Maximize to fullscreen', true], // Maximize function
	switchPlaybackTime:                 ['Georgia-ReBORN - 09. Player controls: Switch to playback time remaining', false], // Switch the playback time from time elapsed to time remaining
	playbackOrder:                      ['Georgia-ReBORN - 09. Player controls: Playback order', 'default'], // Playback order 'default' for context plus foobar menu when no transport controls are displayed

	// * Playlist
	playlistLayout:                     ['Georgia-ReBORN - 10. Playlist: Layout', 'normal'], // Playlist layout - normal (default) or full
	playlistLayoutNormal:               ['Georgia-ReBORN - 10. Playlist: Layout atm is normal width', true], // Playlist layout at the moment - DO NOT CHANGE - when Playlist without Biography or Lyrics panel is full it will always change to normal when showing the Biography, otherwise it's overlayed by the Biography
	showPlaylistManager_default:        ['Georgia-ReBORN - 10. Playlist: Show playlist manager (Default)',  true], // Show Playlist manager in Default layout
	showPlaylistManager_artwork:        ['Georgia-ReBORN - 10. Playlist: Show playlist manager (Artwork)', false], // Show Playlist manager in Artwork layout
	showPlaylistManager_compact:        ['Georgia-ReBORN - 10. Playlist: Show playlist manager (Compact)', false], // Show Playlist manager in Compact layout
	showPlaylistHistory:                ['Georgia-ReBORN - 10. Playlist: Show playlist history', true], // Show Playlist history
	autoHidePlman:                      ['Georgia-ReBORN - 10. Playlist: Auto hide playlist manager', true], // Playlist Automatic Playlist Manager Hide
	hyperlinksCtrlClick:                ['Georgia-ReBORN - 10. Playlist: Ctrl+click to follow hyperlinks', false], // true: Clicking on hyperlinks only works if CTRL key is held down
	showWeblinks:                       ['Georgia-ReBORN - 10. Playlist: Show weblinks', true], // Show weblinks in context menu
	showPlaylistFullDate:               ['Georgia-ReBORN - 10. Playlist: Show full date', false], // Playlist show full date YYYY-MM-DD
	showPlaylistRatingGrid:             ['Georgia-ReBORN - 10. Playlist: Show rating grid', false], // Show rating grid in playlist rows
	showPlaylistTrackNumbers:           ['Georgia-ReBORN - 10. Playlist: Show track numbers', true], // Show track numbers in playlist rows
	showPlaylistIndexNumbers:           ['Georgia-ReBORN - 10. Playlist: Show index numbers', false], // Show index numbers in playlist rows
	showDifferentArtist:                ['Georgia-ReBORN - 10. Playlist: Show artist name on difference', false], // Show artist name on difference
	showArtistPlaylistRows:             ['Georgia-ReBORN - 10. Playlist: Show artist name in all playlist rows', false], // Show artist name in all playlist rows
	showAlbumPlaylistRows:              ['Georgia-ReBORN - 10. Playlist: Show album title in all playlist rows', false], // Show album title in all playlist rows
	playlistTimeRemaining:              ['Georgia-ReBORN - 10. Playlist: Show time remaining on playing track', false], // Show time remaining in playlist on currently playing track
	showVinylNums:                      ['Georgia-ReBORN - 10. Playlist: Show vinyl style numbering (e.g. A1)', true], // true: If the tags specified in tf.vinyl_side and tf.vinyl_tracknum are set, then we'll show vinyl style track numbers (i.e. "B2." instead of "04.")
	lastFmScrobblesFallback:            ['Georgia-ReBORN - 10. Playlist: Show last.fm scrobbles on no local plays', true], // true: Show last.fm scrobbles if no local play count exist
	playlistRowHover:                   ['Georgia-ReBORN - 10. Playlist: Row mouse hover', true], // Enable playlist row mouse hover effect
	playlistSortOrderAuto:              ['Georgia-ReBORN - 10. Playlist: Sort order Auto', false], // Playlist auto sort order
	playlistSortOrder:                  ['Georgia-ReBORN - 10. Playlist: Sort order', ''], // Playlist sort order
	playlistSortOrderDirection:         ['Georgia-ReBORN - 10. Playlist: Sort order direction', '_asc'], // '_asc' or '_dsc' - Playlist sort order direction

	// * Details
	showDiscArtStub:                    ['Georgia-ReBORN - 11. Details: Show disc art placeholder if no disc art found', true], // Show disc art placeholder if no disc art found
	noDiscArtStub:                      ['Georgia-ReBORN - 11. Details: No disc art placeholder', false], // Do not show disc art placeholder
	discArtStub:                        ['Georgia-ReBORN - 11. Details: Disc art placeholder', 'cdAlbumCover'], // Displays the disc art placeholder
	displayDiscArt:                     ['Georgia-ReBORN - 11. Details: Display disc art', true], // true: Show disc artwork behind album artwork. This artwork is expected to be named cd.png and have transparent backgrounds (can be found at fanart.tv)
	discArtOnTop:                       ['Georgia-ReBORN - 11. Details: Show disc art above front cover', false], // true: Display discArt above front cover
	filterDiscJpgsFromAlbumArt:         ['Georgia-ReBORN - 11. Details: Filter out cd/disc/vinyl .jpgs from showing as artwork', true],
	spinDiscArt:                        ['Georgia-ReBORN - 11. Details: Spin disc art', false], // true: discArt will spin while the song plays
	spinDiscArtImageCount:              ['Georgia-ReBORN - 11. Details: # of images to create while spinning', 72], // Higher numbers will increase memory usage, and slow down spin
	spinDiscArtRedrawInterval:          ['Georgia-ReBORN - 11. Details: Spin disc draw interval', 75], // Speed in ms with which to attempt redraw. Lower numbers will increase CPU
	rotateDiscArt:                      ['Georgia-ReBORN - 11. Details: Rotate disc art on new track', true], // true: Rotate discArt based on track number. i.e. rotationAmt = %tracknum% * x degrees
	rotationAmt:                        ['Georgia-ReBORN - 11. Details: Degrees to rotate disc art', 3], // # of degrees to rotate per track change.
	artRotateDelay:                     ['Georgia-ReBORN - 11. Details: Seconds to display each art', 30], // Seconds per image
	discArtDisplayAmount:               ['Georgia-ReBORN - 11. Details: Disc art display amount', 0.455], // 45% of the disc art from the sleeve will be shown
	detailsAlbumArtOpacity:             ['Georgia-ReBORN - 11. Details: Album art opacity', 255], // Transparency of album art displaying in Details
	detailsAlbumArtDiscAreaOpacity:     ['Georgia-ReBORN - 11. Details: Album art disc area opacity', 255], // Transparency of album art disc area displaying in Details
	showGridArtist_default:             ['Georgia-ReBORN - 11. Details: Show artist (Default)', false], // false: Don't show artist at top of metadata grid in Default layout
	showGridArtist_artwork:             ['Georgia-ReBORN - 11. Details: Show artist (Artwork)', false], // false: Don't show artist at top of metadata grid in Artwork layout
	showGridTrackNum_default:           ['Georgia-ReBORN - 11. Details: Show track number (Default)', false], // false: Don't show track number at top of metadata grid in Default layout
	showGridTrackNum_artwork:           ['Georgia-ReBORN - 11. Details: Show track number (Artwork)', false], // false: Don't show track number at top of metadata grid in Artwork layout
	showGridTitle_default:              ['Georgia-ReBORN - 11. Details: Show song title (Default)', false], // false: Don't show title at top of metadata grid, and move album title above timeline in Default layout
	showGridTitle_artwork:              ['Georgia-ReBORN - 11. Details: Show song title (Artwork)', false], // false: Don't show title at top of metadata grid, and move album title above timeline in Artwork layout
	showGridPlayingPlaylist:            ['Georgia-ReBORN - 11. Details: Show playing playlist', true], // true: Show playling playlist entry in metadata grid
	showGridTimeline_default:           ['Georgia-ReBORN - 11. Details: Show timeline (Default)', true], // true: Show timeline at top of metadata grid in Default layout
	showGridTimeline_artwork:           ['Georgia-ReBORN - 11. Details: Show timeline (Artwork)', true], // true: Show timeline at top of metadata grid in Artwork layout
	showGridArtistFlags_default:        ['Georgia-ReBORN - 11. Details: Show country flags (Default)', true], // true: Show the artist country flags at top of metadata grid in Default layout
	showGridArtistFlags_artwork:        ['Georgia-ReBORN - 11. Details: Show country flags (Artwork)', true], // true: Show the artist country flags at top of metadata grid in Artwork layout
	showGridReleaseFlags_default:       ['Georgia-ReBORN - 11. Details: Show release country flags (Default)', 'logo'], // true: Show the release country flags in the metadata grid in Default layout
	showGridReleaseFlags_artwork:       ['Georgia-ReBORN - 11. Details: Show release country flags (Artwork)', 'logo'], // true: Show the release country flags in the metadata grid in Artwork layout
	showGridCodecLogo_default:          ['Georgia-ReBORN - 11. Details: Show codec logo (Default)', 'logo'], // true: Show the codec logo in the metadata grid in Default layout
	showGridCodecLogo_artwork:          ['Georgia-ReBORN - 11. Details: Show codec logo (Artwork)', 'logo'], // true: Show the codec logo in the metadata grid in Artwork layout
	showGridChannelLogo_default:        ['Georgia-ReBORN - 11. Details: Show channel logo (Default)', 'logo'], // true: Show the channel logo in the metadata grid in Default layout
	showGridChannelLogo_artwork:        ['Georgia-ReBORN - 11. Details: Show channel logo (Artwork)', 'logo'], // true: Show the channel logo in the metadata grid in Artwork layout
	autoHideGridMetadata:               ['Georgia-ReBORN - 11. Details: Auto-hide full metadata on small player', true], // true: Auto-hides full metadata when the player size is too small
	noDiscArtBg:                        ['Georgia-ReBORN - 11. Details: Show full background when no disc art', true], // Fill background when no disc art is available
	labelArtOnBg:                       ['Georgia-ReBORN - 11. Details: Draw label art on background', false], // true: Don't show the theme color background behind label art

	// * Library
	libraryLayout:                      ['Georgia-ReBORN - 12. Library: Layout', 'normal'], // Library layout - normal (default) or full
	libraryLayoutFullPreset:            ['Georgia-ReBORN - 12. Library: Use full preset', true], // Always use full preset when changing Library layout to full and normal
	libraryLayoutSplitPreset:           ['Georgia-ReBORN - 12. Library: Use split preset (collapse)', true], // Always use playlist header auto-collapse when displaying Library and auto-expand when displaying Playlist only
	libraryLayoutSplitPreset2:          ['Georgia-ReBORN - 12. Library: Use split preset (text)', false], // Always use playlist without header art when displaying Library and auto-expand when displaying Playlist only
	libraryLayoutSplitPreset3:          ['Georgia-ReBORN - 12. Library: Use split preset (art grid)', false], // Always use library art grid with playlist header auto-collapse when displaying Library and auto-expand when displaying Playlist only
	libraryLayoutSplitPreset4:          ['Georgia-ReBORN - 12. Library: Use split preset (art header)', false], // Always use library art header with playlist header auto-collapse when displaying Library and auto-expand when displaying Playlist only
	libraryDesign:                      ['Georgia-ReBORN - 12. Library: Design', 'reborn'], // Library design - reborn (default), ultraModern, modern, traditional, facet, coversLabelsRight, coversLabelsBottom, coversLabelsBlend, flowMode
	libraryTheme:                       ['Georgia-ReBORN - 12. Library: Theme', 0], // Library theme - 0 (reborn/default), 1 - 'Dark', 2 - 'Blend', 3 - 'Light', 4 - 'Random', 5 - 'Cover'
	libraryThumbnailSize:               ['Georgia-ReBORN - 12. Library: Thumbnail size', 'auto'], // Library thumbnail size - auto (default)
	libraryThumbnailSizeSaved:          ['Georgia-ReBORN - 12. Library: Thumbnail size saved', 'auto'], // Library thumbnail size saved setting, used to restore user setting when switching from library split layout to full layout
	libraryThumbnailBorder:             ['Georgia-ReBORN - 12. Library: Thumbnail border', 'border'], // Library thumbnail border - border (default)
	libraryPlaylistSwitch:              ['Georgia-ReBORN - 12. Library: Switch to playlist when adding songs', false], // When adding songs from Library auto-switch to Playlist
	libraryRowHover:                    ['Georgia-ReBORN - 12. Library: Row mouse hover', true], // Enable library row mouse hover effect
	savedAlbumArtShow:                  ['Georgia-ReBORN - 12. Library: Album art view saved', false], // Used to resume library view mode from split layout when not using library layout presets
	savedAlbumArtLabelType:             ['Georgia-ReBORN - 12. Library: Album art label type saved', 1], // Used to resume album art label type from split layout when not using library layout presets
	librarySource:                      ['Georgia-ReBORN - 12. Library: Source', 1], // Library source, 0 - Active playlist, 1 - Library (default)
	librarySourceFixedPlaylist:         ['Georgia-ReBORN - 12. Library: Source fixed playlist', false], // Library source fixed playlist - true or false - used when using Library source selected playlist
	librarySourceFixedPlaylistName:     ['Georgia-ReBORN - 12. Library: Source fixed playlist name', ''], // Library source fixed playlist name - Selected playlist name - used when using Library source selected playlist

	// * Biography
	biographyLayout:                    ['Georgia-ReBORN - 13. Biography: Layout', 'normal'], // Biography layout - normal (default) or full
	biographyLayoutFullPreset:          ['Georgia-ReBORN - 13. Biography: Use full preset', true], // Always use full preset when changing Biography layout to full and normal
	biographyTheme:                     ['Georgia-ReBORN - 13. Biography: Theme', 0], // 0 (default)
	biographyDisplay:                   ['Georgia-ReBORN - 13. Biography: Display', 'Image+text'], // Image+text (default)

	// * Lyrics
	lyricsLayout:                       ['Georgia-ReBORN - 14. Lyrics: Layout', 'normal'], // Lyrics layout - normal (default) or full
	lyricsDropShadowLevel:              ['Georgia-ReBORN - 14. Lyrics: Show drop shadow', 2], // 0 - 3 - Show drop shadow on lyrics text
	lyricsFadeScroll:                   ['Georgia-ReBORN - 14. Lyrics: Show fade scroll', true], // true: Show lyrics fade scroll
	lyricsLargerCurrentSync:            ['Georgia-ReBORN - 14. Lyrics: Show larger current sync', true], // true: Displays larger font on current synced lyric
	lyricsAlbumArt:                     ['Georgia-ReBORN - 14. Lyrics: Show lyrics on album art', true], // true: Show lyrics on album art
	lyricsRememberActiveState:          ['Georgia-ReBORN - 14. Lyrics: Remember lyrics active state', false], // true: Show active lyrics even when switching through panels
	lyricsRememberPanelState:           ['Georgia-ReBORN - 14. Lyrics: Remember lyrics panel state', false], // true: Show lyrics on startup if they were displayed when theme last reloaded
	lyricsScrollSpeed:                  ['Georgia-ReBORN - 14. Lyrics: Scroll speed', 'normal'], // 'fastest', 'fast', 'normal', 'slow', 'slowest' - lyrics scroll speed based on scroll average and maximum
	lyricsScrollRateAvg:                ['Georgia-ReBORN - 14. Lyrics: Scroll speed avg rate', 750], // 300, 500, 750, 1000, 1500 - average lyrics scroll in ms
	lyricsScrollRateMax:                ['Georgia-ReBORN - 14. Lyrics: Scroll speed max rate', 375], // average lyrics scroll / 2 = maximum lyrics scroll in ms
	displayLyrics:                      ['Georgia-ReBORN - 14. Lyrics: Show lyrics', false], // true: Shows lyrics, always set to false at startup unless lyricsRememberDisplay is true

	// * Settings
	themeDayNightMode:                  ['Georgia-ReBORN - 15. Settings: Auto-day/night mode', false], // false: The theme day/night mode state controlled by OS clock and users set themeSettings.themeDayNightMode value
	themeDayNightTime:                  ['Georgia-ReBORN - 15. Settings: Auto-day/night time', ''], // The current time of the day as string value 'day' or 'night', auto-controlled and used for theme day/night mode
	themeSetupDay:                      ['Georgia-ReBORN - 15. Settings: Auto-day/night theme setup daytime', false], // false: The daytime setup mode state when configuring the theme for daytime
	themeSetupNight:                    ['Georgia-ReBORN - 15. Settings: Auto-day/night theme setup nighttime', false], // false: The nighttime setup mode state when configuring the theme for nighttime
	themeSandbox:                       ['Georgia-ReBORN - 15. Settings: Theme sandbox', false], // false: Enables theme sandbox, useful when trying out themes, styles, presets or writing theme tags. After disabling, it will restore last previous theme settings
	customThemeFonts:                   ['Georgia-ReBORN - 15. Settings: Use custom theme fonts', false], // false: User can set own custom theme fonts in foobar's Preferences > Display > Columns UI > Colours and fonts
	customLibraryDir:                   ['Georgia-ReBORN - 15. Settings: Use custom library directory', false], // false: Use custom library directory
	libraryAutoDelete:                  ['Georgia-ReBORN - 15. Settings: Auto-delete library cache', false], // false: This will auto-delete cached library album art thumbnails on startup
	customBiographyDir:                 ['Georgia-ReBORN - 15. Settings: Use custom biography directory', false], // false: Use custom biography directory
	biographyAutoDelete:                ['Georgia-ReBORN - 15. Settings: Auto-delete biography cache', false], // false: This will auto-delete downloaded biography images and text on startup
	customLyricsDir:                    ['Georgia-ReBORN - 15. Settings: Use custom lyrics directory', false], // false: Use custom lyrics directory
	lyricsAutoDelete:                   ['Georgia-ReBORN - 15. Settings: Auto-delete lyrics', false], // false: This will auto-delete downloaded lyrics on startup
	customWaveformBarDir:               ['Georgia-ReBORN - 15. Settings: Use custom waveform bar directory', false], // false: Use custom waveform bar directory
	waveformBarAutoDelete:              ['Georgia-ReBORN - 15. Settings: Auto-delete waveform bar cache', false], // false: This will auto-delete analyized waveform bar files on startup
	customThemeSettings:                ['Georgia-ReBORN - 15. Settings: Use custom theme settings', true], // true: User can set own custom theme settings in the config file
	themePerformance:                   ['Georgia-ReBORN - 15. Settings: Theme performance', 'balanced'], // 'balanced' - default: How the theme performs, either fast speed, balanced or good quality depending on CPU
	devTools:                           ['Georgia-ReBORN - 15. Settings: Enable developer tools', false], // true: Show developer tools in options context menu
	disableRightClick:                  ['Georgia-ReBORN - 15. Settings: Disable right-click', true], // true: Disables right-clicking on the background from bringing up the SMP context menu

	// * System
	asyncThemePreloader:                ['Georgia-ReBORN - 16. System: Asynchronously theme preloader', true], // Loads individual theme files asynchronously at startup to reduce risk of SMP throwing slow script error on startup
	checkForUpdates:                    ['Georgia-ReBORN - 16. System: Check for Updates', true], // true: Check github repo to determine if updates exist
	restoreBackupPlaylist:              ['Georgia-ReBORN - 16. System: Restore backup playlist', false], // false: Used to copy playlist files again after fb2k installation
	savedLayout:                        ['Georgia-ReBORN - 16. System: Saved layout', 'default'], // Default saved layout
	savedWidth_default:                 ['Georgia-ReBORN - 16. System: Saved width (Default)',  1140], // Default saved width for Default layout
	savedHeight_default:                ['Georgia-ReBORN - 16. System: Saved height (Default)', 730], // Default saved height for Default layout
	savedWidth_artwork:                 ['Georgia-ReBORN - 16. System: Saved width (Artwork)',  526], // Default saved width for Artwork layout
	savedHeight_artwork:                ['Georgia-ReBORN - 16. System: Saved height (Artwork)', 686], // Default saved height for Artwork layout
	savedWidth_compact:                 ['Georgia-ReBORN - 16. System: Saved width (Compact)',  484], // Default saved width for Compact layout
	savedHeight_compact:                ['Georgia-ReBORN - 16. System: Saved height (Compact)', 730], // Default saved height for Compact layout
	systemFirstLaunch:                  ['Georgia-ReBORN - 16. System: System first launch', true] // true: Init and reset to theme factory settings

	// check_multich:                      ['Check for MultiChannel version', false] // true: Search paths in tf.MultiCh_paths to see if there is a multichannel version of the current album available
});


// * Fixup properties
/** @type {string} */
const savedLayout = pref.savedLayout;
if (savedLayout !== 'default' || savedLayout !== 'artwork' || savedLayout !== 'compact') {
	pref.savedLayout = 'default';
}


////////////////////////
// * THEME SETTINGS * //
////////////////////////
/**
 * Loads default theme settings when pref.customThemeSettings is false, otherwise it loads settings from the config file.
 * When using with the parameter, it saves all settings to the config file.
 * @param {boolean} save Saves current used theme settings to config file.
 */
async function setThemeSettings(save) {
	const custom = pref.customThemeSettings;
	libraryCanReload = false;

	// * Themes
	if (save) {
		theme.theme = pref.theme;
		theme.theme_day = pref.theme_day;
		theme.theme_night = pref.theme_night;
	} else {
		pref.theme = custom ? theme.theme : 'reborn';
		pref.theme_day = custom ? theme.theme_day : 'white';
		pref.theme_night = custom ? theme.theme_night : 'black';
	}

	// * Style
	if (save) {
		style.default = pref.styleDefault;
		style.nighttime = pref.styleNighttime;
		style.bevel = pref.styleBevel;
		style.blend = pref.styleBlend;
		style.blend2 = pref.styleBlend2;
		style.gradient = pref.styleGradient;
		style.gradient2 = pref.styleGradient2;
		style.alternative = pref.styleAlternative;
		style.alternative2 = pref.styleAlternative2;
		style.blackAndWhite = pref.styleBlackAndWhite;
		style.blackAndWhite2 = pref.styleBlackAndWhite2;
		style.blackAndWhiteReborn = pref.styleBlackAndWhiteReborn;
		style.blackReborn = pref.styleBlackReborn;
		style.rebornWhite = pref.styleRebornWhite;
		style.rebornBlack = pref.styleRebornBlack;
		style.rebornFusion = pref.styleRebornFusion;
		style.rebornFusion2 = pref.styleRebornFusion2;
		style.rebornFusionAccent = pref.styleRebornFusionAccent;
		style.randomPastel = pref.styleRandomPastel;
		style.randomDark = pref.styleRandomDark;
		style.randomAutoColor = pref.styleRandomAutoColor;
		style.topMenuButtons = pref.styleTopMenuButtons;
		style.transportButtons = pref.styleTransportButtons;
		style.progressBarDesign = pref.styleProgressBarDesign;
		style.progressBar = pref.styleProgressBar;
		style.progressBarFill = pref.styleProgressBarFill;
		style.volumeBarDesign = pref.styleVolumeBarDesign;
		style.volumeBar = pref.styleVolumeBar;
		style.volumeBarFill = pref.styleVolumeBarFill;
		style.nighttime_day = pref.styleNighttime_day;
		style.bevel_day = pref.styleBevel_day;
		style.blend_day = pref.styleBlend_day;
		style.blend2_day = pref.styleBlend2_day;
		style.gradient_day = pref.styleGradient_day;
		style.gradient2_day = pref.styleGradient2_day;
		style.alternative_day = pref.styleAlternative_day;
		style.alternative2_day = pref.styleAlternative2_day;
		style.blackAndWhite_day = pref.styleBlackAndWhite_day;
		style.blackAndWhite2_day = pref.styleBlackAndWhite2_day;
		style.blackAndWhiteReborn_day = pref.styleBlackAndWhiteReborn_day;
		style.blackReborn_day = pref.styleBlackReborn_day;
		style.rebornWhite_day = pref.styleRebornWhite_day;
		style.rebornBlack_day = pref.styleRebornBlack_day;
		style.rebornFusion_day = pref.styleRebornFusion_day;
		style.rebornFusion2_day = pref.styleRebornFusion2_day;
		style.rebornFusionAccent_day = pref.styleRebornFusionAccent_day;
		style.randomPastel_day = pref.styleRandomPastel_day;
		style.randomDark_day = pref.styleRandomDark_day;
		style.randomAutoColor_day = pref.styleRandomAutoColor_day;
		style.topMenuButtons_day = pref.styleTopMenuButtons_day;
		style.transportButtons_day = pref.styleTransportButtons_day;
		style.progressBarDesign_day = pref.styleProgressBarDesign_day;
		style.progressBar_day = pref.styleProgressBar_day;
		style.progressBarFill_day = pref.styleProgressBarFill_day;
		style.volumeBarDesign_day = pref.styleVolumeBarDesign_day;
		style.volumeBar_day = pref.styleVolumeBar_day;
		style.volumeBarFill_day = pref.styleVolumeBarFill_day;
		style.nighttime_night = pref.styleNighttime_night;
		style.bevel_night = pref.styleBevel_night;
		style.blend_night = pref.styleBlend_night;
		style.blend2_night = pref.styleBlend2_night;
		style.gradient_night = pref.styleGradient_night;
		style.gradient2_night = pref.styleGradient2_night;
		style.alternative_night = pref.styleAlternative_night;
		style.alternative2_night = pref.styleAlternative2_night;
		style.blackAndWhite_night = pref.styleBlackAndWhite_night;
		style.blackAndWhite2_night = pref.styleBlackAndWhite2_night;
		style.blackAndWhiteReborn_night = pref.styleBlackAndWhiteReborn_night;
		style.blackReborn_night = pref.styleBlackReborn_night;
		style.rebornWhite_night = pref.styleRebornWhite_night;
		style.rebornBlack_night = pref.styleRebornBlack_night;
		style.rebornFusion_night = pref.styleRebornFusion_night;
		style.rebornFusion2_night = pref.styleRebornFusion2_night;
		style.rebornFusionAccent_night = pref.styleRebornFusionAccent_night;
		style.randomPastel_night = pref.styleRandomPastel_night;
		style.randomDark_night = pref.styleRandomDark_night;
		style.randomAutoColor_night = pref.styleRandomAutoColor_night;
		style.topMenuButtons_night = pref.styleTopMenuButtons_night;
		style.transportButtons_night = pref.styleTransportButtons_night;
		style.progressBarDesign_night = pref.styleProgressBarDesign_night;
		style.progressBar_night = pref.styleProgressBar_night;
		style.progressBarFill_night = pref.styleProgressBarFill_night;
		style.volumeBarDesign_night = pref.styleVolumeBarDesign_night;
		style.volumeBar_night = pref.styleVolumeBar_night;
		style.volumeBarFill_night = pref.styleVolumeBarFill_night;
	} else {
		pref.styleDefault = custom ? style.default : true;
		pref.styleNighttime = custom ? style.nighttime : false;
		pref.styleBevel = custom ? style.bevel : false;
		pref.styleBlend = custom ? style.blend : false;
		pref.styleBlend2 = custom ? style.blend2 : false;
		pref.styleGradient = custom ? style.gradient : false;
		pref.styleGradient2 = custom ? style.gradient2 : false;
		pref.styleAlternative = custom ? style.alternative : false;
		pref.styleAlternative2 = custom ? style.alternative2 : false;
		pref.styleBlackAndWhite = custom ? style.blackAndWhite : false;
		pref.styleBlackAndWhite2 = custom ? style.blackAndWhite2 : false;
		pref.styleBlackAndWhiteReborn = custom ? style.blackAndWhiteReborn : false;
		pref.styleBlackReborn = custom ? style.blackReborn : false;
		pref.styleRebornWhite = custom ? style.rebornWhite : false;
		pref.styleRebornBlack = custom ? style.rebornBlack : false;
		pref.styleRebornFusion = custom ? style.rebornFusion : false;
		pref.styleRebornFusion2 = custom ? style.rebornFusion2 : false;
		pref.styleRebornFusionAccent = custom ? style.rebornFusionAccent : false;
		pref.styleRandomPastel = custom ? style.randomPastel : false;
		pref.styleRandomDark = custom ? style.randomDark : false;
		pref.styleRandomAutoColor = custom ? style.randomAutoColor : 'off';
		pref.styleTopMenuButtons = custom ? style.topMenuButtons : 'default';
		pref.styleTransportButtons = custom ? style.transportButtons : 'default';
		pref.styleProgressBarDesign = custom ? style.progressBarDesign : 'default';
		pref.styleProgressBar = custom ? style.progressBar : 'default';
		pref.styleProgressBarFill = custom ? style.progressBarFill : 'default';
		pref.styleVolumeBarDesign = custom ? style.volumeBarDesign : 'default';
		pref.styleVolumeBar = custom ? style.volumeBar : 'default';
		pref.styleVolumeBarFill = custom ? style.volumeBarFill : 'default';
		pref.styleNighttime_day = custom ? style.nighttime_day : false;
		pref.styleBevel_day = custom ? style.bevel_day : false;
		pref.styleBlend_day = custom ? style.blend_day : false;
		pref.styleBlend2_day = custom ? style.blend2_day : false;
		pref.styleGradient_day = custom ? style.gradient_day : false;
		pref.styleGradient2_day = custom ? style.gradient2_day : false;
		pref.styleAlternative_day = custom ? style.alternative_day : false;
		pref.styleAlternative2_day = custom ? style.alternative2_day : false;
		pref.styleBlackAndWhite_day = custom ? style.blackAndWhite_day : false;
		pref.styleBlackAndWhite2_day = custom ? style.blackAndWhite2_day : false;
		pref.styleBlackAndWhiteReborn_day = custom ? style.blackAndWhiteReborn_day : false;
		pref.styleBlackReborn_day = custom ? style.blackReborn_day : false;
		pref.styleRebornWhite_day = custom ? style.rebornWhite_day : false;
		pref.styleRebornBlack_day = custom ? style.rebornBlack_day : false;
		pref.styleRebornFusion_day = custom ? style.rebornFusion_day : false;
		pref.styleRebornFusion2_day = custom ? style.rebornFusion2_day : false;
		pref.styleRebornFusionAccent_day = custom ? style.rebornFusionAccent_day : false;
		pref.styleRandomPastel_day = custom ? style.randomPastel_day : false;
		pref.styleRandomDark_day = custom ? style.randomDark_day : false;
		pref.styleRandomAutoColor_day = custom ? style.randomAutoColor_day : 'off';
		pref.styleTopMenuButtons_day = custom ? style.topMenuButtons_day : 'default';
		pref.styleTransportButtons_day = custom ? style.transportButtons_day : 'default';
		pref.styleProgressBarDesign_day = custom ? style.progressBarDesign_day : 'default';
		pref.styleProgressBar_day = custom ? style.progressBar_day : 'default';
		pref.styleProgressBarFill_day = custom ? style.progressBarFill_day : 'default';
		pref.styleVolumeBarDesign_day = custom ? style.volumeBarDesign_day : 'default';
		pref.styleVolumeBar_day = custom ? style.volumeBar_day : 'default';
		pref.styleVolumeBarFill_day = custom ? style.volumeBarFill_day : 'default';
		pref.styleNighttime_night = custom ? style.nighttime_night : false;
		pref.styleBevel_night = custom ? style.bevel_night : false;
		pref.styleBlend_night = custom ? style.blend_night : false;
		pref.styleBlend2_night = custom ? style.blend2_night : false;
		pref.styleGradient_night = custom ? style.gradient_night : false;
		pref.styleGradient2_night = custom ? style.gradient2_night : false;
		pref.styleAlternative_night = custom ? style.alternative_night : false;
		pref.styleAlternative2_night = custom ? style.alternative2_night : false;
		pref.styleBlackAndWhite_night = custom ? style.blackAndWhite_night : false;
		pref.styleBlackAndWhite2_night = custom ? style.blackAndWhite2_night : false;
		pref.styleBlackAndWhiteReborn_night = custom ? style.blackAndWhiteReborn_night : false;
		pref.styleBlackReborn_night = custom ? style.blackReborn_night : false;
		pref.styleRebornWhite_night = custom ? style.rebornWhite_night : false;
		pref.styleRebornBlack_night = custom ? style.rebornBlack_night : false;
		pref.styleRebornFusion_night = custom ? style.rebornFusion_night : false;
		pref.styleRebornFusion2_night = custom ? style.rebornFusion2_night : false;
		pref.styleRebornFusionAccent_night = custom ? style.rebornFusionAccent_night : false;
		pref.styleRandomPastel_night = custom ? style.randomPastel_night : false;
		pref.styleRandomDark_night = custom ? style.randomDark_night : false;
		pref.styleRandomAutoColor_night = custom ? style.randomAutoColor_night : 'off';
		pref.styleTopMenuButtons_night = custom ? style.topMenuButtons_night : 'default';
		pref.styleTransportButtons_night = custom ? style.transportButtons_night : 'default';
		pref.styleProgressBarDesign_night = custom ? style.progressBarDesign_night : 'default';
		pref.styleProgressBar_night = custom ? style.progressBar_night : 'default';
		pref.styleProgressBarFill_night = custom ? style.progressBarFill_night : 'default';
		pref.styleVolumeBarDesign_night = custom ? style.volumeBarDesign_night : 'default';
		pref.styleVolumeBar_night = custom ? style.volumeBar_night : 'default';
		pref.styleVolumeBarFill_night = custom ? style.volumeBarFill_night : 'default';
	}

	// * Preset
	if (save) {
		preset.selectMode = pref.presetSelectMode;
		preset.selectWhitePresets = pref.presetSelectWhite;
		preset.selectBlackPresets = pref.presetSelectBlack;
		preset.selectRebornPresets = pref.presetSelectReborn;
		preset.selectRandomPresets = pref.presetSelectRandom;
		preset.selectBluePresets = pref.presetSelectBlue;
		preset.selectDarkbluePresets = pref.presetSelectDarkblue;
		preset.selectRedPresets = pref.presetSelectRed;
		preset.selectCreamPresets = pref.presetSelectCream;
		preset.selectNbluePresets = pref.presetSelectNblue;
		preset.selectNgreenPresets = pref.presetSelectNgreen;
		preset.selectNredPresets = pref.presetSelectNred;
		preset.selectNgoldPresets = pref.presetSelectNgold;
		preset.selectCustomPresets = pref.presetSelectCustom;
		preset.autoRandomMode = pref.presetAutoRandomMode;
		preset.indicator = pref.presetIndicator;
	} else {
		pref.presetSelectMode = custom ? preset.selectMode : 'default';
		pref.presetSelectWhite = custom ? preset.selectWhitePresets : true;
		pref.presetSelectBlack = custom ? preset.selectBlackPresets : true;
		pref.presetSelectReborn = custom ? preset.selectRebornPresets : true;
		pref.presetSelectRandom = custom ? preset.selectRandomPresets : true;
		pref.presetSelectBlue = custom ? preset.selectBluePresets : true;
		pref.presetSelectDarkblue = custom ? preset.selectDarkbluePresets : true;
		pref.presetSelectRed = custom ? preset.selectRedPresets : true;
		pref.presetSelectCream = custom ? preset.selectCreamPresets : true;
		pref.presetSelectNblue = custom ? preset.selectNbluePresets : true;
		pref.presetSelectNgreen = custom ? preset.selectNgreenPresets : true;
		pref.presetSelectNred = custom ? preset.selectNredPresets : true;
		pref.presetSelectNgold = custom ? preset.selectNgoldPresets : true;
		pref.presetSelectCustom = custom ? preset.selectCustomPresets : true;
		pref.presetAutoRandomMode = custom ? preset.autoRandomMode : 'dblclick';
		pref.presetIndicator = custom ? preset.indicator : true;
	}

	// * Player size
	if (save) {
		themePlayerSize.playerSize = pref.playerSize;
		themePlayerSize.savedWidth_default = pref.savedWidth_default;
		themePlayerSize.savedHeight_default = pref.savedHeight_default;
		themePlayerSize.savedWidth_artwork = pref.savedWidth_artwork;
		themePlayerSize.savedHeight_artwork = pref.savedHeight_artwork;
		themePlayerSize.savedWidth_compact = pref.savedWidth_compact;
		themePlayerSize.savedHeight_compact = pref.savedHeight_compact;
	} else {
		pref.playerSize = custom ? themePlayerSize.playerSize : 'small';
		pref.savedWidth_default = custom ? themePlayerSize.savedWidth_default : 1140;
		pref.savedHeight_default = custom ? themePlayerSize.savedHeight_default : 730;
		pref.savedWidth_artwork = custom ? themePlayerSize.savedWidth_artwork : 526;
		pref.savedHeight_artwork = custom ? themePlayerSize.savedHeight_artwork : 686;
		pref.savedWidth_compact = custom ? themePlayerSize.savedWidth_compact : 484;
		pref.savedHeight_compact = custom ? themePlayerSize.savedHeight_compact : 730;
		pref.playerSize_4K_small = false;   // ! System setting, not configurable for users
		pref.playerSize_4K_normal = false;  // ! System setting, not configurable for users
		pref.playerSize_4K_large = false;   // ! System setting, not configurable for users
		pref.playerSize_QHD_small = false;  // ! System setting, not configurable for users
		pref.playerSize_QHD_normal = false; // ! System setting, not configurable for users
		pref.playerSize_QHD_large = false;  // ! System setting, not configurable for users
		pref.playerSize_HD_small = false;   // ! System setting, not configurable for users
		pref.playerSize_HD_normal = false;  // ! System setting, not configurable for users
		pref.playerSize_HD_large = false;   // ! System setting, not configurable for users
	}

	// * Layout
	if (save) {
		themeLayout.layout = pref.layout;
	} else {
		pref.layout = custom ? themeLayout.layout : 'default';
	}

	// * Display
	if (save) {
		themeDisplay.resolution = pref.displayRes;
	} else {
		pref.displayRes = custom ? themeDisplay.resolution : 'HD';
	}

	// * Brightness
	if (save) {
		themeBrightness.themeBrightness = pref.themeBrightness;
		themeBrightness.themeBrightness_day = pref.themeBrightness_day;
		themeBrightness.themeBrightness_night = pref.themeBrightness_night;
	} else {
		pref.themeBrightness = custom ? themeBrightness.themeBrightness : 'default';
		pref.themeBrightness_day = custom ? themeBrightness.themeBrightness_day : 'default';
		pref.themeBrightness_night = custom ? themeBrightness.themeBrightness_night : 'default';
	}

	// * Font size
	if (save) {
		themeFontSize.menuFontSize_default = pref.menuFontSize_default;
		themeFontSize.menuFontSize_artwork = pref.menuFontSize_artwork;
		themeFontSize.menuFontSize_compact = pref.menuFontSize_compact;
		themeFontSize.lowerBarFontSize_default = pref.lowerBarFontSize_default;
		themeFontSize.lowerBarFontSize_artwork = pref.lowerBarFontSize_artwork;
		themeFontSize.lowerBarFontSize_compact = pref.lowerBarFontSize_compact;
		themeFontSize.notificationFontSize_default = pref.notificationFontSize_default;
		themeFontSize.notificationFontSize_artwork = pref.notificationFontSize_artwork;
		themeFontSize.notificationFontSize_compact = pref.notificationFontSize_compact;
		themeFontSize.popupFontSize_default = pref.popupFontSize_default;
		themeFontSize.popupFontSize_artwork = pref.popupFontSize_artwork;
		themeFontSize.popupFontSize_compact = pref.popupFontSize_compact;
		themeFontSize.tooltipFontSize_default = pref.tooltipFontSize_default;
		themeFontSize.tooltipFontSize_artwork = pref.tooltipFontSize_artwork;
		themeFontSize.tooltipFontSize_compact = pref.tooltipFontSize_compact;
		themeFontSize.gridArtistFontSize_default = pref.gridArtistFontSize_default;
		themeFontSize.gridArtistFontSize_artwork = pref.gridArtistFontSize_artwork;
		themeFontSize.gridTrackNumFontSize_default = pref.gridTrackNumFontSize_default;
		themeFontSize.gridTrackNumFontSize_artwork = pref.gridTrackNumFontSize_artwork;
		themeFontSize.gridTitleFontSize_default = pref.gridTitleFontSize_default;
		themeFontSize.gridTitleFontSize_artwork = pref.gridTitleFontSize_artwork;
		themeFontSize.gridAlbumFontSize_default = pref.gridAlbumFontSize_default;
		themeFontSize.gridAlbumFontSize_artwork = pref.gridAlbumFontSize_artwork;
		themeFontSize.gridKeyFontSize_default = pref.gridKeyFontSize_default;
		themeFontSize.gridKeyFontSize_artwork = pref.gridKeyFontSize_artwork;
		themeFontSize.gridValueFontSize_default = pref.gridValueFontSize_default;
		themeFontSize.gridValueFontSize_artwork = pref.gridValueFontSize_artwork;
		themeFontSize.playlistHeaderFontSize_default = pref.playlistHeaderFontSize_default;
		themeFontSize.playlistHeaderFontSize_artwork = pref.playlistHeaderFontSize_artwork;
		themeFontSize.playlistHeaderFontSize_compact = pref.playlistHeaderFontSize_compact;
		themeFontSize.playlistFontSize_default = pref.playlistFontSize_default;
		themeFontSize.playlistFontSize_artwork = pref.playlistFontSize_artwork;
		themeFontSize.playlistFontSize_compact = pref.playlistFontSize_compact;
		themeFontSize.libraryFontSize_default = ppt.baseFontSize_default;
		themeFontSize.libraryFontSize_artwork = ppt.baseFontSize_artwork;
		themeFontSize.biographyFontSize_default = pptBio.baseFontSizeBio_default;
		themeFontSize.biographyFontSize_artwork = pptBio.baseFontSizeBio_artwork;
		themeFontSize.lyricsFontSize_default = pref.lyricsFontSize_default;
		themeFontSize.lyricsFontSize_artwork = pref.lyricsFontSize_artwork;
	} else {
		pref.menuFontSize_default = custom ? themeFontSize.menuFontSize_default : RES_QHD ? 14 : 12;
		pref.menuFontSize_artwork = custom ? themeFontSize.menuFontSize_artwork : RES_QHD ? 14 : 12;
		pref.menuFontSize_compact = custom ? themeFontSize.menuFontSize_compact : RES_QHD ? 14 : 12;
		pref.lowerBarFontSize_default = custom ? themeFontSize.lowerBarFontSize_default : RES_QHD ? 20 : 18;
		pref.lowerBarFontSize_artwork = custom ? themeFontSize.lowerBarFontSize_artwork : RES_QHD ? 18 : 16;
		pref.lowerBarFontSize_compact = custom ? themeFontSize.lowerBarFontSize_compact : RES_QHD ? 18 : 16;
		pref.notificationFontSize_default = custom ? themeFontSize.notificationFontSize_default : RES_QHD ? 20 : 18;
		pref.notificationFontSize_artwork = custom ? themeFontSize.notificationFontSize_artwork : RES_QHD ? 18 : 16;
		pref.notificationFontSize_compact = custom ? themeFontSize.notificationFontSize_compact : RES_QHD ? 18 : 16;
		pref.popupFontSize_default = custom ? themeFontSize.popupFontSize_default : RES_QHD ? 18 : 16;
		pref.popupFontSize_artwork = custom ? themeFontSize.popupFontSize_artwork : RES_QHD ? 16 : 14;
		pref.popupFontSize_compact = custom ? themeFontSize.popupFontSize_compact : RES_QHD ? 16 : 14;
		pref.tooltipFontSize_default = custom ? themeFontSize.tooltipFontSize_default : RES_QHD ? 18 : 16;
		pref.tooltipFontSize_artwork = custom ? themeFontSize.tooltipFontSize_artwork : RES_QHD ? 16 : 14;
		pref.tooltipFontSize_compact = custom ? themeFontSize.tooltipFontSize_compact : RES_QHD ? 16 : 14;
		pref.gridArtistFontSize_default = custom ? themeFontSize.gridArtistFontSize_default : RES_QHD ? 20 : 18;
		pref.gridArtistFontSize_artwork = custom ? themeFontSize.gridArtistFontSize_artwork : RES_QHD ? 20 : 18;
		pref.gridTrackNumFontSize_default = custom ? themeFontSize.gridTrackNumFontSize_default : RES_QHD ? 20 : 18;
		pref.gridTrackNumFontSize_artwork = custom ? themeFontSize.gridTrackNumFontSize_artwork : RES_QHD ? 20 : 18;
		pref.gridTitleFontSize_default = custom ? themeFontSize.gridTitleFontSize_default : RES_QHD ? 20 : 18;
		pref.gridTitleFontSize_artwork = custom ? themeFontSize.gridTitleFontSize_artwork : RES_QHD ? 20 : 18;
		pref.gridAlbumFontSize_default = custom ? themeFontSize.gridAlbumFontSize_default : RES_QHD ? 20 : 18;
		pref.gridAlbumFontSize_artwork = custom ? themeFontSize.gridAlbumFontSize_artwork : RES_QHD ? 20 : 18;
		pref.gridKeyFontSize_default = custom ? themeFontSize.gridKeyFontSize_default : RES_QHD ? 19 : 17;
		pref.gridKeyFontSize_artwork = custom ? themeFontSize.gridKeyFontSize_artwork : RES_QHD ? 19 : 17;
		pref.gridValueFontSize_default = custom ? themeFontSize.gridValueFontSize_default : RES_QHD ? 19 : 17;
		pref.gridValueFontSize_artwork = custom ? themeFontSize.gridValueFontSize_artwork : RES_QHD ? 19 : 17;
		pref.playlistHeaderFontSize_default = custom ? themeFontSize.playlistHeaderFontSize_default : RES_QHD ? 17 : 15;
		pref.playlistHeaderFontSize_artwork = custom ? themeFontSize.playlistHeaderFontSize_artwork : RES_QHD ? 17 : 15;
		pref.playlistHeaderFontSize_compact = custom ? themeFontSize.playlistHeaderFontSize_compact : RES_QHD ? 17 : 15;
		pref.playlistFontSize_default = custom ? themeFontSize.playlistFontSize_default : RES_QHD ? 14 : 12;
		pref.playlistFontSize_artwork = custom ? themeFontSize.playlistFontSize_artwork : RES_QHD ? 14 : 12;
		pref.playlistFontSize_compact = custom ? themeFontSize.playlistFontSize_compact : RES_QHD ? 14 : 12;
		ppt.baseFontSize_default = custom ? themeFontSize.libraryFontSize_default : RES_4K ? 24 : RES_QHD ? 14 : 12;
		ppt.baseFontSize_artwork = custom ? themeFontSize.libraryFontSize_artwork : RES_4K ? 24 : RES_QHD ? 14 : 12;
		pptBio.baseFontSizeBio_default = custom ? themeFontSize.biographyFontSize_default : RES_4K ? 24 : RES_QHD ? 14 : 12;
		pptBio.baseFontSizeBio_artwork = custom ? themeFontSize.biographyFontSize_artwork : RES_4K ? 24 : RES_QHD ? 14 : 12;
		pref.lyricsFontSize_default = custom ? themeFontSize.lyricsFontSize_default : RES_QHD ? 22 : 20;
		pref.lyricsFontSize_artwork = custom ? themeFontSize.lyricsFontSize_artwork : RES_QHD ? 22 : 20;
	}

	// * Player controls
	if (save) {
		themeControls.showPanelDetails_default = pref.showPanelDetails_default;
		themeControls.showPanelDetails_artwork = pref.showPanelDetails_artwork;
		themeControls.showPanelLibrary_default = pref.showPanelLibrary_default;
		themeControls.showPanelLibrary_artwork = pref.showPanelLibrary_artwork;
		themeControls.showPanelBiography_default = pref.showPanelBiography_default;
		themeControls.showPanelBiography_artwork = pref.showPanelBiography_artwork;
		themeControls.showPanelLyrics_default = pref.showPanelLyrics_default;
		themeControls.showPanelLyrics_artwork = pref.showPanelLyrics_artwork;
		themeControls.showPanelRating_default = pref.showPanelRating_default;
		themeControls.showPanelRating_artwork = pref.showPanelRating_artwork;
		themeControls.topMenuAlignment = pref.topMenuAlignment;
		themeControls.topMenuCompact = pref.topMenuCompact;
		themeControls.albumArtAlign = pref.albumArtAlign;
		themeControls.albumArtBg = pref.albumArtBg;
		themeControls.albumArtScale = pref.albumArtScale;
		themeControls.cycleArt = pref.cycleArt;
		themeControls.cycleArtMWheel = pref.cycleArtMWheel;
		themeControls.loadEmbeddedAlbumArtFirst = pref.loadEmbeddedAlbumArtFirst;
		themeControls.showHiResAudioBadge = pref.showHiResAudioBadge;
		themeControls.hiResAudioBadgeRound = pref.hiResAudioBadgeRound;
		themeControls.hiResAudioBadgeSize = pref.hiResAudioBadgeSize;
		themeControls.hiResAudioBadgePos = pref.hiResAudioBadgePos;
		themeControls.showPause = pref.showPause;
		themeControls.jumpSearchIncludeLibrary = pref.jumpSearchIncludeLibrary;
		themeControls.jumpSearchIncludePlaylist = pref.jumpSearchIncludePlaylist;
		themeControls.jumpSearchComposerOnly = pref.jumpSearchComposerOnly;
		themeControls.playlistWheelScrollSteps = pref.playlistWheelScrollSteps;
		themeControls.playlistWheelScrollDuration = pref.playlistWheelScrollDuration;
		themeControls.playlistAutoScrollNowPlaying = pref.playlistAutoScrollNowPlaying;
		themeControls.playlistAutoHideScrollbar = pref.playlistAutoHideScrollbar;
		themeControls.playlistSmoothScrolling = pref.playlistSmoothScrolling;
		themeControls.scrollStepLib = ppt.scrollStep;
		themeControls.durationScrollLib = ppt.durationScroll;
		themeControls.libraryAutoScrollNowPlaying = pref.libraryAutoScrollNowPlaying;
		themeControls.libraryAutoHideScrollbar = pref.libraryAutoHideScrollbar;
		themeControls.smoothLib = ppt.smooth;
		themeControls.scrollStepBio = pptBio.scrollStep;
		themeControls.durationScrollBio = pptBio.durationScroll;
		themeControls.biographyAutoHideScrollbar = pref.biographyAutoHideScrollbar;
		themeControls.smoothBio = pptBio.smooth;
		themeControls.showTooltipTruncated = pref.showTooltipTruncated;
		themeControls.showTooltipTimeline = pref.showTooltipTimeline;
		themeControls.showTooltipVolume = pref.showTooltipVolume;
		themeControls.showTooltipVolumeInPercent = pref.showTooltipVolumeInPercent;
		themeControls.showTooltipMain = pref.showTooltipMain;
		themeControls.showTooltipLibrary = pref.showTooltipLibrary;
		themeControls.showTooltipBiography = pref.showTooltipBiography;
		themeControls.showStyledTooltips = pref.showStyledTooltips;
		themeControls.panelWidthAuto = pref.panelWidthAuto;
		themeControls.showPanelOnStartup = pref.showPanelOnStartup;
		themeControls.showPreloaderLogo = pref.showPreloaderLogo;
		themeControls.showPreloaderCustomLogo = pref.showPreloaderCustomLogo;
		themeControls.returnToHomeOnPlaybackStop = pref.returnToHomeOnPlaybackStop;
		themeControls.hideMiddlePanelShadow = pref.hideMiddlePanelShadow;
		themeControls.lockPlayerSize = pref.lockPlayerSize;
		themeControls.transportButtonSize_default = pref.transportButtonSize_default;
		themeControls.transportButtonSize_artwork = pref.transportButtonSize_artwork;
		themeControls.transportButtonSize_compact = pref.transportButtonSize_compact;
		themeControls.transportButtonSpacing_default = pref.transportButtonSpacing_default;
		themeControls.transportButtonSpacing_artwork = pref.transportButtonSpacing_artwork;
		themeControls.transportButtonSpacing_compact = pref.transportButtonSpacing_compact;
		themeControls.showTransportControls_default = pref.showTransportControls_default;
		themeControls.showTransportControls_artwork = pref.showTransportControls_artwork;
		themeControls.showTransportControls_compact = pref.showTransportControls_compact;
		themeControls.showPlaybackOrderBtn_default = pref.showPlaybackOrderBtn_default;
		themeControls.showPlaybackOrderBtn_artwork = pref.showPlaybackOrderBtn_artwork;
		themeControls.showPlaybackOrderBtn_compact = pref.showPlaybackOrderBtn_compact;
		themeControls.showReloadBtn_default = pref.showReloadBtn_default;
		themeControls.showReloadBtn_artwork = pref.showReloadBtn_artwork;
		themeControls.showReloadBtn_compact = pref.showReloadBtn_compact;
		themeControls.showVolumeBtn_default = pref.showVolumeBtn_default;
		themeControls.showVolumeBtn_artwork = pref.showVolumeBtn_artwork;
		themeControls.showVolumeBtn_compact = pref.showVolumeBtn_compact;
		themeControls.autoHideVolumeBar = pref.autoHideVolumeBar;
		themeControls.showPlaybackTime_default = pref.showPlaybackTime_default;
		themeControls.showPlaybackTime_artwork = pref.showPlaybackTime_artwork;
		themeControls.showPlaybackTime_compact = pref.showPlaybackTime_compact;
		themeControls.showLowerBarArtist_default = pref.showLowerBarArtist_default;
		themeControls.showLowerBarArtist_artwork = pref.showLowerBarArtist_artwork;
		themeControls.showLowerBarArtist_compact = pref.showLowerBarArtist_compact;
		themeControls.showLowerBarTrackNum_default = pref.showLowerBarTrackNum_default;
		themeControls.showLowerBarTrackNum_artwork = pref.showLowerBarTrackNum_artwork;
		themeControls.showLowerBarTrackNum_compact = pref.showLowerBarTrackNum_compact;
		themeControls.showLowerBarTitle_default = pref.showLowerBarTitle_default;
		themeControls.showLowerBarTitle_artwork = pref.showLowerBarTitle_artwork;
		themeControls.showLowerBarTitle_compact = pref.showLowerBarTitle_compact;
		themeControls.showLowerBarComposer_default = pref.showLowerBarComposer_default;
		themeControls.showLowerBarComposer_artwork = pref.showLowerBarComposer_artwork;
		themeControls.showLowerBarComposer_compact = pref.showLowerBarComposer_compact;
		themeControls.showLowerBarArtistFlags_default = pref.showLowerBarArtistFlags_default;
		themeControls.showLowerBarArtistFlags_artwork = pref.showLowerBarArtistFlags_artwork;
		themeControls.showLowerBarArtistFlags_compact = pref.showLowerBarArtistFlags_compact;
		themeControls.showLowerBarVersion_default = pref.showLowerBarVersion_default;
		themeControls.showLowerBarVersion_artwork = pref.showLowerBarVersion_artwork;
		themeControls.showLowerBarVersion_compact = pref.showLowerBarVersion_compact;
		themeControls.showProgressBar_default = pref.showProgressBar_default;
		themeControls.showProgressBar_artwork = pref.showProgressBar_artwork;
		themeControls.showProgressBar_compact = pref.showProgressBar_compact;
		themeControls.showPeakmeterBar_default = pref.showPeakmeterBar_default;
		themeControls.showPeakmeterBar_artwork = pref.showPeakmeterBar_artwork;
		themeControls.showPeakmeterBar_compact = pref.showPeakmeterBar_compact;
		themeControls.showWaveformBar_default = pref.showWaveformBar_default;
		themeControls.showWaveformBar_artwork = pref.showWaveformBar_artwork;
		themeControls.showWaveformBar_compact = pref.showWaveformBar_compact;
		themeControls.seekbar = pref.seekbar;
		themeControls.progressBarWheelSeekSpeed = pref.progressBarWheelSeekSpeed;
		themeControls.progressBarRefreshRate = pref.progressBarRefreshRate;
		themeControls.peakmeterBarDesign = pref.peakmeterBarDesign;
		themeControls.peakmeterBarVertSize = pref.peakmeterBarVertSize;
		themeControls.peakmeterBarVertDbRange = pref.peakmeterBarVertDbRange;
		themeControls.peakmeterBarOverBars = pref.peakmeterBarOverBars;
		themeControls.peakmeterBarOuterBars = pref.peakmeterBarOuterBars;
		themeControls.peakmeterBarOuterPeaks = pref.peakmeterBarOuterPeaks;
		themeControls.peakmeterBarMainBars = pref.peakmeterBarMainBars;
		themeControls.peakmeterBarMainPeaks = pref.peakmeterBarMainPeaks;
		themeControls.peakmeterBarMiddleBars = pref.peakmeterBarMiddleBars;
		themeControls.peakmeterBarProgBar = pref.peakmeterBarProgBar;
		themeControls.peakmeterBarGaps = pref.peakmeterBarGaps;
		themeControls.peakmeterBarGrid = pref.peakmeterBarGrid;
		themeControls.peakmeterBarInfo = pref.peakmeterBarInfo;
		themeControls.peakmeterBarVertPeaks = pref.peakmeterBarVertPeaks;
		themeControls.peakmeterBarVertBaseline = pref.peakmeterBarVertBaseline;
		themeControls.peakmeterBarRefreshRate = pref.peakmeterBarRefreshRate;
		themeControls.waveformBarMode = pref.waveformBarMode;
		themeControls.waveformBarAnalysis = pref.waveformBarAnalysis;
		themeControls.waveformBarDesign = pref.waveformBarDesign;
		themeControls.waveformBarSizeWave = pref.waveformBarSizeWave;
		themeControls.waveformBarSizeBars = pref.waveformBarSizeBars;
		themeControls.waveformBarSizeDots = pref.waveformBarSizeDots;
		themeControls.waveformBarSizeHalf = pref.waveformBarSizeHalf;
		themeControls.waveformBarSizeNormalize = pref.waveformBarSizeNormalize;
		themeControls.waveformBarPaint = pref.waveformBarPaint;
		themeControls.waveformBarPrepaint = pref.waveformBarPrepaint;
		themeControls.waveformBarPrepaintFront = pref.waveformBarPrepaintFront === Infinity ? 'Infinity' : pref.waveformBarPrepaintFront;
		themeControls.waveformBarAnimate = pref.waveformBarAnimate;
		themeControls.waveformBarBPM = pref.waveformBarBPM;
		themeControls.waveformBarInvertHalfbars = pref.waveformBarInvertHalfbars;
		themeControls.waveformBarIndicator = pref.waveformBarIndicator;
		themeControls.waveformBarRefreshRate = pref.waveformBarRefreshRate;
		themeControls.waveformBarRefreshRateVar = pref.waveformBarRefreshRateVar;
		themeControls.maximizeToFullscreen = pref.maximizeToFullscreen;
		themeControls.switchPlaybackTime = pref.switchPlaybackTime;
		themeControls.playbackOrder = pref.playbackOrder;
	} else {
		pref.showPanelDetails_default = custom ? themeControls.showPanelDetails_default : true;
		pref.showPanelDetails_artwork = custom ? themeControls.showPanelDetails_artwork : true;
		pref.showPanelLibrary_default = custom ? themeControls.showPanelLibrary_default : true;
		pref.showPanelLibrary_artwork = custom ? themeControls.showPanelLibrary_artwork : true;
		pref.showPanelBiography_default = custom ? themeControls.showPanelBiography_default : true;
		pref.showPanelBiography_artwork = custom ? themeControls.showPanelBiography_artwork : true;
		pref.showPanelLyrics_default = custom ? themeControls.showPanelLyrics_default : true;
		pref.showPanelLyrics_artwork = custom ? themeControls.showPanelLyrics_artwork : true;
		pref.showPanelRating_default = custom ? themeControls.showPanelRating_default : true;
		pref.showPanelRating_artwork = custom ? themeControls.showPanelRating_artwork : true;
		pref.topMenuAlignment = custom ? themeControls.topMenuAlignment : 'center';
		pref.topMenuCompact = custom ? themeControls.topMenuCompact : true;
		pref.albumArtAlign = custom ? themeControls.albumArtAlign : 'right';
		pref.albumArtBg = custom ? themeControls.albumArtBg : 'left';
		pref.albumArtScale = custom ? themeControls.albumArtScale : 'filled';
		pref.cycleArt = custom ? themeControls.cycleArt : false;
		pref.cycleArtMWheel = custom ? themeControls.cycleArtMWheel : true;
		pref.loadEmbeddedAlbumArtFirst = custom ? themeControls.loadEmbeddedAlbumArtFirst : false;
		pref.showHiResAudioBadge = custom ? themeControls.showHiResAudioBadge : false;
		pref.hiResAudioBadgeRound = custom ? themeControls.hiResAudioBadgeRound : false;
		pref.hiResAudioBadgeSize = custom ? themeControls.hiResAudioBadgeSize : 'normal';
		pref.hiResAudioBadgePos = custom ? themeControls.hiResAudioBadgePos : 'bottomright';
		pref.showPause = custom ? themeControls.showPause : true;
		pref.jumpSearchIncludeLibrary = custom ? themeControls.jumpSearchIncludeLibrary : true;
		pref.jumpSearchIncludePlaylist = custom ? themeControls.jumpSearchIncludePlaylist : true;
		pref.jumpSearchComposerOnly = custom ? themeControls.jumpSearchComposerOnly : false;
		pref.playlistWheelScrollSteps = custom ? themeControls.playlistWheelScrollSteps : 3;
		pref.playlistWheelScrollDuration = custom ? themeControls.playlistWheelScrollDuration : 300;
		pref.playlistAutoScrollNowPlaying = custom ? themeControls.playlistAutoScrollNowPlaying : false;
		pref.playlistAutoHideScrollbar = custom ? themeControls.playlistAutoHideScrollbar : true;
		pref.playlistSmoothScrolling = custom ? themeControls.playlistSmoothScrolling : true;
		ppt.scrollStep = custom ? themeControls.scrollStepLib : 3;
		ppt.durationScroll = custom ? themeControls.durationScrollLib : 500;
		pref.libraryAutoScrollNowPlaying = custom ? themeControls.libraryAutoScrollNowPlaying : false;
		pref.libraryAutoHideScrollbar = custom ? themeControls.libraryAutoHideScrollbar : true;
		ppt.sbarShow = pref.libraryAutoHideScrollbar ? 1 : 2;
		ppt.smooth = custom ? themeControls.smoothLib : true;
		pptBio.scrollStep = custom ? themeControls.scrollStepBio : 3;
		pptBio.durationScroll = custom ? themeControls.durationScrollBio : 500;
		pref.biographyAutoHideScrollbar = custom ? themeControls.biographyAutoHideScrollbar : true;
		pptBio.sbarShow = pref.biographyAutoHideScrollbar ? 1 : 2;
		pptBio.smooth = custom ? themeControls.smoothBio : true;
		pref.showTooltipTruncated = custom ? themeControls.showTooltipTruncated : true;
		pref.showTooltipTimeline = custom ? themeControls.showTooltipTimeline : true;
		pref.showTooltipVolume = custom ? themeControls.showTooltipVolume : false;
		pref.showTooltipVolumeInPercent = custom ? themeControls.showTooltipVolumeInPercent : false;
		pref.showTooltipMain = custom ? themeControls.showTooltipMain : false;
		pref.showTooltipLibrary = custom ? themeControls.showTooltipLibrary : false;
		pref.showTooltipBiography = custom ? themeControls.showTooltipBiography : false;
		pref.showStyledTooltips = custom ? themeControls.showStyledTooltips : true;
		pref.panelWidthAuto = custom ? themeControls.panelWidthAuto : false;
		pref.showPanelOnStartup = custom ? themeControls.showPanelOnStartup : 'playlist';
		pref.showPreloaderLogo = custom ? themeControls.showPreloaderLogo : true;
		pref.showPreloaderCustomLogo = custom ? themeControls.showPreloaderCustomLogo : false;
		pref.returnToHomeOnPlaybackStop = custom ? themeControls.returnToHomeOnPlaybackStop : true;
		pref.hideMiddlePanelShadow = custom ? themeControls.hideMiddlePanelShadow : false;
		pref.lockPlayerSize = custom ? themeControls.lockPlayerSize : false;
		pref.transportButtonSize_default = custom ? themeControls.transportButtonSize_default : 32;
		pref.transportButtonSize_artwork = custom ? themeControls.transportButtonSize_artwork : 32;
		pref.transportButtonSize_compact = custom ? themeControls.transportButtonSize_compact : 32;
		pref.transportButtonSpacing_default = custom ? themeControls.transportButtonSpacing_default : 5;
		pref.transportButtonSpacing_artwork = custom ? themeControls.transportButtonSpacing_artwork : 5;
		pref.transportButtonSpacing_compact = custom ? themeControls.transportButtonSpacing_compact : 5;
		pref.showTransportControls_default = custom ? themeControls.showTransportControls_default : true;
		pref.showTransportControls_artwork = custom ? themeControls.showTransportControls_artwork : true;
		pref.showTransportControls_compact = custom ? themeControls.showTransportControls_compact : true;
		pref.showPlaybackOrderBtn_default = custom ? themeControls.showPlaybackOrderBtn_default : true;
		pref.showPlaybackOrderBtn_artwork = custom ? themeControls.showPlaybackOrderBtn_artwork : true;
		pref.showPlaybackOrderBtn_compact = custom ? themeControls.showPlaybackOrderBtn_compact : true;
		pref.showReloadBtn_default = custom ? themeControls.showReloadBtn_default : false;
		pref.showReloadBtn_artwork = custom ? themeControls.showReloadBtn_artwork : false;
		pref.showReloadBtn_compact = custom ? themeControls.showReloadBtn_compact : false;
		pref.showVolumeBtn_default = custom ? themeControls.showVolumeBtn_default : true;
		pref.showVolumeBtn_artwork = custom ? themeControls.showVolumeBtn_artwork : true;
		pref.showVolumeBtn_compact = custom ? themeControls.showVolumeBtn_compact : true;
		pref.autoHideVolumeBar = custom ? themeControls.autoHideVolumeBar : true;
		pref.showPlaybackTime_default = custom ? themeControls.showPlaybackTime_default : true;
		pref.showPlaybackTime_artwork = custom ? themeControls.showPlaybackTime_artwork : true;
		pref.showPlaybackTime_compact = custom ? themeControls.showPlaybackTime_compact : true;
		pref.showLowerBarArtist_default = custom ? themeControls.showLowerBarArtist_default : true;
		pref.showLowerBarArtist_artwork = custom ? themeControls.showLowerBarArtist_artwork : true;
		pref.showLowerBarArtist_compact = custom ? themeControls.showLowerBarArtist_compact : true;
		pref.showLowerBarTrackNum_default = custom ? themeControls.showLowerBarTrackNum_default : true;
		pref.showLowerBarTrackNum_artwork = custom ? themeControls.showLowerBarTrackNum_artwork : true;
		pref.showLowerBarTrackNum_compact = custom ? themeControls.showLowerBarTrackNum_compact : true;
		pref.showLowerBarTitle_default = custom ? themeControls.showLowerBarTitle_default : true;
		pref.showLowerBarTitle_artwork = custom ? themeControls.showLowerBarTitle_artwork : true;
		pref.showLowerBarTitle_compact = custom ? themeControls.showLowerBarTitle_compact : true;
		pref.showLowerBarComposer_default = custom ? themeControls.showLowerBarComposer_default : false;
		pref.showLowerBarComposer_artwork = custom ? themeControls.showLowerBarComposer_artwork : false;
		pref.showLowerBarComposer_compact = custom ? themeControls.showLowerBarComposer_compact : false;
		pref.showLowerBarArtistFlags_default = custom ? themeControls.showLowerBarArtistFlags_default : true;
		pref.showLowerBarArtistFlags_artwork = custom ? themeControls.showLowerBarArtistFlags_artwork : true;
		pref.showLowerBarArtistFlags_compact = custom ? themeControls.showLowerBarArtistFlags_compact : true;
		pref.showLowerBarVersion_default = custom ? themeControls.showLowerBarVersion_default : true;
		pref.showLowerBarVersion_artwork = custom ? themeControls.showLowerBarVersion_artwork : true;
		pref.showLowerBarVersion_compact = custom ? themeControls.showLowerBarVersion_compact : true;
		pref.showProgressBar_default = custom ? themeControls.showProgressBar_default : true;
		pref.showProgressBar_artwork = custom ? themeControls.showProgressBar_artwork : true;
		pref.showProgressBar_compact = custom ? themeControls.showProgressBar_compact : true;
		pref.showPeakmeterBar_default = custom ? themeControls.showPeakmeterBar_default : true;
		pref.showPeakmeterBar_artwork = custom ? themeControls.showPeakmeterBar_artwork : true;
		pref.showPeakmeterBar_compact = custom ? themeControls.showPeakmeterBar_compact : true;
		pref.showWaveformBar_default = custom ? themeControls.showWaveformBar_default : true;
		pref.showWaveformBar_artwork = custom ? themeControls.showWaveformBar_artwork : true;
		pref.showWaveformBar_compact = custom ? themeControls.showWaveformBar_compact : true;
		pref.seekbar = custom ? themeControls.seekbar : 'progressbar';
		pref.progressBarWheelSeekSpeed = custom ? themeControls.progressBarWheelSeekSpeed : 5;
		pref.progressBarRefreshRate = custom ? themeControls.progressBarRefreshRate : 'variable';
		pref.peakmeterBarDesign = custom ? themeControls.peakmeterBarDesign : 'horizontal';
		pref.peakmeterBarVertSize = custom ? themeControls.peakmeterBarVertSize : 20;
		pref.peakmeterBarVertDbRange = custom ? themeControls.peakmeterBarVertDbRange : 220;
		pref.peakmeterBarOverBars = custom ? themeControls.peakmeterBarOverBars : true;
		pref.peakmeterBarOuterBars = custom ? themeControls.peakmeterBarOuterBars : true;
		pref.peakmeterBarOuterPeaks = custom ? themeControls.peakmeterBarOuterPeaks : true;
		pref.peakmeterBarMainBars = custom ? themeControls.peakmeterBarMainBars : true;
		pref.peakmeterBarMainPeaks = custom ? themeControls.peakmeterBarMainPeaks : true;
		pref.peakmeterBarMiddleBars = custom ? themeControls.peakmeterBarMiddleBars : true;
		pref.peakmeterBarProgBar = custom ? themeControls.peakmeterBarProgBar : true;
		pref.peakmeterBarGaps = custom ? themeControls.peakmeterBarGaps : false;
		pref.peakmeterBarGrid = custom ? themeControls.peakmeterBarGrid : false;
		pref.peakmeterBarInfo = custom ? themeControls.peakmeterBarInfo : false;
		pref.peakmeterBarVertPeaks = custom ? themeControls.peakmeterBarVertPeaks : true;
		pref.peakmeterBarVertBaseline = custom ? themeControls.peakmeterBarVertBaseline : true;
		pref.peakmeterBarRefreshRate = custom ? themeControls.peakmeterBarRefreshRate : 80;
		pref.waveformBarMode = custom ? themeControls.waveformBarMode : 'audiowaveform';
		pref.waveformBarAnalysis = custom ? themeControls.waveformBarAnalysis : 'rms_level';
		pref.waveformBarDesign = custom ? themeControls.waveformBarDesign : 'halfbars';
		pref.waveformBarSizeWave = custom ? themeControls.waveformBarSizeWave : 3;
		pref.waveformBarSizeBars = custom ? themeControls.waveformBarSizeBars : 1;
		pref.waveformBarSizeDots = custom ? themeControls.waveformBarSizeDots : 2;
		pref.waveformBarSizeHalf = custom ? themeControls.waveformBarSizeHalf : 4;
		pref.waveformBarSizeNormalize = custom ? themeControls.waveformBarSizeNormalize : false;
		pref.waveformBarPaint = custom ? themeControls.waveformBarPaint : 'partial';
		pref.waveformBarPrepaint = custom ? themeControls.waveformBarPrepaint : true;
		pref.waveformBarPrepaintFront = custom ? themeControls.waveformBarPrepaintFront : false; // ! Do not use Infinity here, set to false has same effect
		pref.waveformBarAnimate = custom ? themeControls.waveformBarAnimate : true;
		pref.waveformBarBPM = custom ? themeControls.waveformBarBPM : true;
		pref.waveformBarInvertHalfbars = custom ? themeControls.waveformBarInvertHalfbars : true;
		pref.waveformBarIndicator = custom ? themeControls.waveformBarIndicator : false;
		pref.waveformBarRefreshRate = custom ? themeControls.waveformBarRefreshRate : 200;
		pref.waveformBarRefreshRateVar = custom ? themeControls.waveformBarRefreshRateVar : false;
		pref.maximizeToFullscreen = custom ? themeControls.maximizeToFullscreen : true;
		pref.switchPlaybackTime = custom ? themeControls.switchPlaybackTime : false;
		pref.playbackOrder = custom ? themeControls.playbackOrder : 'default';
	}

	// * Playlist
	if (save) {
		themePlaylist.playlistLayout = pref.playlistLayout;
		themePlaylist.showPlaylistManager_default = pref.showPlaylistManager_default;
		themePlaylist.showPlaylistManager_artwork = pref.showPlaylistManager_artwork;
		themePlaylist.showPlaylistManager_compact = pref.showPlaylistManager_compact;
		themePlaylist.showPlaylistHistory = pref.showPlaylistHistory;
		themePlaylist.autoHidePlman = pref.autoHidePlman;
		themePlaylist.show_album_art = g_properties.show_album_art;
		themePlaylist.auto_album_art = g_properties.auto_album_art;
		themePlaylist.show_header = g_properties.show_header;
		themePlaylist.show_rating_header = g_properties.show_rating_header;
		themePlaylist.show_PLR_header = g_properties.show_PLR_header;
		themePlaylist.use_compact_header = g_properties.use_compact_header;
		themePlaylist.auto_collapse = g_properties.auto_collapse;
		themePlaylist.hyperlinksCtrlClick = pref.hyperlinksCtrlClick;
		themePlaylist.show_disc_header = g_properties.show_disc_header;
		themePlaylist.show_group_info = g_properties.show_group_info;
		themePlaylist.showWeblinks = pref.showWeblinks;
		themePlaylist.showPlaylistFullDate = pref.showPlaylistFullDate;
		themePlaylist.show_row_stripes = g_properties.show_row_stripes;
		themePlaylist.show_playcount = g_properties.show_playcount;
		themePlaylist.show_queue_position = g_properties.show_queue_position;
		themePlaylist.show_rating = g_properties.show_rating;
		themePlaylist.use_rating_from_tags = g_properties.use_rating_from_tags;
		themePlaylist.showPlaylistRatingGrid = pref.showPlaylistRatingGrid;
		themePlaylist.show_PLR = g_properties.show_PLR;
		themePlaylist.showPlaylistTrackNumbers = pref.showPlaylistTrackNumbers;
		themePlaylist.showPlaylistIndexNumbers = pref.showPlaylistIndexNumbers;
		themePlaylist.showDifferentArtist = pref.showDifferentArtist;
		themePlaylist.showArtistPlaylistRows = pref.showArtistPlaylistRows;
		themePlaylist.showAlbumPlaylistRows = pref.showAlbumPlaylistRows;
		themePlaylist.playlistTimeRemaining = pref.playlistTimeRemaining;
		themePlaylist.showVinylNums = pref.showVinylNums;
		themePlaylist.lastFmScrobblesFallback = pref.lastFmScrobblesFallback;
		themePlaylist.playlistRowHover = pref.playlistRowHover;
		themePlaylist.playlistSortOrderAuto = pref.playlistSortOrderAuto;
		themePlaylist.playlistSortOrder = pref.playlistSortOrder;
		themePlaylist.playlistSortOrderDirection = pref.playlistSortOrderDirection;
		themePlaylist.playlist_stats_include_artist = g_properties.playlist_stats_include_artist;
		themePlaylist.playlist_stats_include_album = g_properties.playlist_stats_include_album;
		themePlaylist.playlist_stats_include_track = g_properties.playlist_stats_include_track;
		themePlaylist.playlist_stats_include_year = g_properties.playlist_stats_include_year;
		themePlaylist.playlist_stats_include_genre = g_properties.playlist_stats_include_genre;
		themePlaylist.playlist_stats_include_label = g_properties.playlist_stats_include_label;
		themePlaylist.playlist_stats_include_country = g_properties.playlist_stats_include_country;
		themePlaylist.playlist_stats_include_stats = g_properties.playlist_stats_include_stats;
		themePlaylist.playlist_stats_sort_by = g_properties.playlist_stats_sort_by;
		themePlaylist.playlist_stats_sort_direction = g_properties.playlist_stats_sort_direction;
	} else {
		pref.playlistLayout = custom ? themePlaylist.playlistLayout : 'normal';
		pref.playlistLayoutNormal = true;
		pref.showPlaylistManager_default = custom ? themePlaylist.showPlaylistManager_default : true;
		pref.showPlaylistManager_artwork = custom ? themePlaylist.showPlaylistManager_artwork : false;
		pref.showPlaylistManager_compact = custom ? themePlaylist.showPlaylistManager_compact : false;
		pref.showPlaylistHistory = custom ? themePlaylist.showPlaylistHistory : true;
		pref.autoHidePlman = custom ? themePlaylist.autoHidePlman : true;
		g_properties.show_album_art = custom ? themePlaylist.show_album_art : true;
		g_properties.auto_album_art = custom ? themePlaylist.auto_album_art : false;
		g_properties.show_header = custom ? themePlaylist.show_header : true;
		g_properties.show_rating_header = custom ? themePlaylist.show_rating_header : true;
		g_properties.show_PLR_header = custom ? themePlaylist.show_PLR_header : false;
		g_properties.use_compact_header = custom ? themePlaylist.use_compact_header : false;
		g_properties.auto_collapse = custom ? themePlaylist.auto_collapse : false;
		pref.hyperlinksCtrlClick = custom ? themePlaylist.hyperlinksCtrlClick : false;
		g_properties.show_disc_header = custom ? themePlaylist.show_disc_header : true;
		g_properties.show_group_info = custom ? themePlaylist.show_group_info : true;
		pref.showWeblinks = custom ? themePlaylist.showWeblinks : true;
		pref.showPlaylistFullDate = custom ? themePlaylist.showPlaylistFullDate : false;
		g_properties.show_row_stripes = custom ? themePlaylist.show_row_stripes : false;
		g_properties.show_playcount = custom ? themePlaylist.show_playcount : true;
		g_properties.show_queue_position = custom ? themePlaylist.show_queue_position : true;
		g_properties.show_rating = custom ? themePlaylist.show_rating : true;
		g_properties.use_rating_from_tags = custom ? themePlaylist.use_rating_from_tags : false;
		g_properties.show_PLR = custom ? themePlaylist.show_PLR : false;
		pref.showPlaylistRatingGrid = custom ? themePlaylist.showPlaylistRatingGrid : false;
		pref.showPlaylistTrackNumbers = custom ? themePlaylist.showPlaylistTrackNumbers : true;
		pref.showPlaylistIndexNumbers = custom ? themePlaylist.showPlaylistIndexNumbers : false;
		pref.showDifferentArtist = custom ? themePlaylist.showDifferentArtist : false;
		pref.showArtistPlaylistRows = custom ? themePlaylist.showArtistPlaylistRows : false;
		pref.showAlbumPlaylistRows = custom ? themePlaylist.showAlbumPlaylistRows : false;
		pref.playlistTimeRemaining = custom ? themePlaylist.playlistTimeRemaining : false;
		pref.showVinylNums = custom ? themePlaylist.showVinylNums : true;
		pref.lastFmScrobblesFallback = custom ? themePlaylist.lastFmScrobblesFallback : true;
		pref.playlistRowHover = custom ? themePlaylist.playlistRowHover : true;
		pref.playlistSortOrderAuto = custom ? themePlaylist.playlistSortOrderAuto : false;
		pref.playlistSortOrder = custom ? themePlaylist.playlistSortOrder : '';
		pref.playlistSortOrderDirection = custom ? themePlaylist.playlistSortOrderDirection : '_asc';
		g_properties.playlist_stats_include_artist = custom ? themePlaylist.playlist_stats_include_artist : true;
		g_properties.playlist_stats_include_album = custom ? themePlaylist.playlist_stats_include_album : true;
		g_properties.playlist_stats_include_track = custom ? themePlaylist.playlist_stats_include_track : true;
		g_properties.playlist_stats_include_year = custom ? themePlaylist.playlist_stats_include_year : false;
		g_properties.playlist_stats_include_genre = custom ? themePlaylist.playlist_stats_include_genre : false;
		g_properties.playlist_stats_include_label = custom ? themePlaylist.playlist_stats_include_label : false;
		g_properties.playlist_stats_include_country = custom ? themePlaylist.playlist_stats_include_country : false;
		g_properties.playlist_stats_include_stats = custom ? themePlaylist.playlist_stats_include_stats : true;
		g_properties.playlist_stats_sort_by = custom ? themePlaylist.playlist_stats_sort_by : '';
		g_properties.playlist_stats_sort_direction = custom ? themePlaylist.playlist_stats_sort_direction : '_dsc';
	}

	// * Playlist properties
	g_properties.list_left_pad = 0;
	g_properties.list_top_pad = 0;
	g_properties.list_right_pad = 0;
	g_properties.list_bottom_pad = 15;
	g_properties.show_scrollbar = false;
	g_properties.scrollbar_right_pad = 0;
	g_properties.scrollbar_top_pad = 0;
	g_properties.scrollbar_bottom_pad = 3;
	g_properties.scrollbar_w = '';
	g_properties.row_h = 20;
	g_properties.scroll_pos = 0;
	g_properties.wheel_scroll_page = false;
	g_properties.rows_in_header = 4;
	g_properties.rows_in_compact_header = 3;
	g_properties.show_playlist_info = true;
	g_properties.collapse_on_playlist_switch = false;
	g_properties.collapse_on_start = false;

	// * Details
	if (save) {
		themeDetails.showDiscArtStub = pref.showDiscArtStub;
		themeDetails.noDiscArtStub = pref.noDiscArtStub;
		themeDetails.discArtStub = pref.discArtStub;
		themeDetails.displayDiscArt = pref.displayDiscArt;
		themeDetails.discArtOnTop = pref.discArtOnTop;
		themeDetails.filterDiscJpgsFromAlbumArt = pref.filterDiscJpgsFromAlbumArt;
		themeDetails.spinDiscArt = pref.spinDiscArt;
		themeDetails.spinDiscArtImageCount = pref.spinDiscArtImageCount;
		themeDetails.spinDiscArtRedrawInterval = pref.spinDiscArtRedrawInterval;
		themeDetails.rotateDiscArt = pref.rotateDiscArt;
		themeDetails.rotationAmt = pref.rotationAmt;
		themeDetails.artRotateDelay = pref.artRotateDelay;
		themeDetails.discArtDisplayAmount = pref.discArtDisplayAmount;
		themeDetails.detailsAlbumArtOpacity = pref.detailsAlbumArtOpacity;
		themeDetails.detailsAlbumArtDiscAreaOpacity = pref.detailsAlbumArtDiscAreaOpacity;
		themeDetails.showGridArtist_default = pref.showGridArtist_default;
		themeDetails.showGridArtist_artwork = pref.showGridArtist_artwork;
		themeDetails.showGridTrackNum_default = pref.showGridTrackNum_default;
		themeDetails.showGridTrackNum_artwork = pref.showGridTrackNum_artwork;
		themeDetails.showGridTitle_default = pref.showGridTitle_default;
		themeDetails.showGridTitle_artwork = pref.showGridTitle_artwork;
		themeDetails.showGridPlayingPlaylist = pref.showGridPlayingPlaylist;
		themeDetails.showGridTimeline_default = pref.showGridTimeline_default;
		themeDetails.showGridTimeline_artwork = pref.showGridTimeline_artwork;
		themeDetails.showGridArtistFlags_default = pref.showGridArtistFlags_default;
		themeDetails.showGridArtistFlags_artwork = pref.showGridArtistFlags_artwork;
		themeDetails.showGridReleaseFlags_default = pref.showGridReleaseFlags_default;
		themeDetails.showGridReleaseFlags_artwork = pref.showGridReleaseFlags_artwork;
		themeDetails.showGridCodecLogo_default = pref.showGridCodecLogo_default;
		themeDetails.showGridCodecLogo_artwork = pref.showGridCodecLogo_artwork;
		themeDetails.showGridChannelLogo_default = pref.showGridChannelLogo_default;
		themeDetails.showGridChannelLogo_artwork = pref.showGridChannelLogo_artwork;
		themeDetails.autoHideGridMetadata = pref.autoHideGridMetadata;
		themeDetails.noDiscArtBg = pref.noDiscArtBg;
		themeDetails.labelArtOnBg = pref.labelArtOnBg;
	} else {
		pref.showDiscArtStub = custom ? themeDetails.showDiscArtStub : true;
		pref.noDiscArtStub = custom ? themeDetails.noDiscArtStub : false;
		pref.discArtStub = custom ? themeDetails.discArtStub : 'cdAlbumCover';
		pref.displayDiscArt = custom ? themeDetails.displayDiscArt : true;
		pref.discArtOnTop = custom ? themeDetails.discArtOnTop : false;
		pref.filterDiscJpgsFromAlbumArt = custom ? themeDetails.filterDiscJpgsFromAlbumArt : true;
		pref.spinDiscArt = custom ? themeDetails.spinDiscArt : false;
		pref.spinDiscArtImageCount = custom ? themeDetails.spinDiscArtImageCount : 72;
		pref.spinDiscArtRedrawInterval = custom ? themeDetails.spinDiscArtRedrawInterval : 75;
		pref.rotateDiscArt = custom ? themeDetails.rotateDiscArt : true;
		pref.rotationAmt = custom ? themeDetails.rotationAmt : 3;
		pref.artRotateDelay = custom ? themeDetails.artRotateDelay : 30;
		pref.discArtDisplayAmount = custom ? themeDetails.discArtDisplayAmount : 0.5;
		pref.detailsAlbumArtOpacity = custom ? themeDetails.detailsAlbumArtOpacity : 255;
		pref.detailsAlbumArtDiscAreaOpacity = custom ? themeDetails.detailsAlbumArtDiscAreaOpacity : 255;
		pref.showGridArtist_default = custom ? themeDetails.showGridArtist_default : false;
		pref.showGridArtist_artwork = custom ? themeDetails.showGridArtist_artwork : false;
		pref.showGridTrackNum_default = custom ? themeDetails.showGridTrackNum_default : false;
		pref.showGridTrackNum_artwork = custom ? themeDetails.showGridTrackNum_artwork : false;
		pref.showGridTitle_default = custom ? themeDetails.showGridTitle_default : false;
		pref.showGridTitle_artwork = custom ? themeDetails.showGridTitle_artwork : false;
		pref.showGridPlayingPlaylist = custom ? themeDetails.showGridPlayingPlaylist : false;
		pref.showGridTimeline_default = custom ? themeDetails.showGridTimeline_default : true;
		pref.showGridTimeline_artwork = custom ? themeDetails.showGridTimeline_artwork : true;
		pref.showGridArtistFlags_default = custom ? themeDetails.showGridArtistFlags_default : true;
		pref.showGridArtistFlags_artwork = custom ? themeDetails.showGridArtistFlags_artwork : true;
		pref.showGridReleaseFlags_default = custom ? themeDetails.showGridReleaseFlags_default : 'logo';
		pref.showGridReleaseFlags_artwork = custom ? themeDetails.showGridReleaseFlags_artwork : 'logo';
		pref.showGridCodecLogo_default = custom ? themeDetails.showGridCodecLogo_default : 'logo';
		pref.showGridCodecLogo_artwork = custom ? themeDetails.showGridCodecLogo_artwork : 'logo';
		pref.showGridChannelLogo_default = custom ? themeDetails.showGridChannelLogo_default : 'logo';
		pref.showGridChannelLogo_artwork = custom ? themeDetails.showGridChannelLogo_artwork : 'logo';
		pref.autoHideGridMetadata = custom ? themeDetails.autoHideGridMetadata : true;
		pref.noDiscArtBg = custom ? themeDetails.noDiscArtBg : true;
		pref.labelArtOnBg = custom ? themeDetails.labelArtOnBg : false;
	}

	// * Library
	if (save) {
		themeLibrary.libraryLayout = pref.libraryLayout;
		themeLibrary.libraryLayoutFullPreset = pref.libraryLayoutFullPreset;
		themeLibrary.libraryLayoutSplitPreset = pref.libraryLayoutSplitPreset;
		themeLibrary.libraryLayoutSplitPreset2 = pref.libraryLayoutSplitPreset2;
		themeLibrary.libraryLayoutSplitPreset3 = pref.libraryLayoutSplitPreset3;
		themeLibrary.libraryLayoutSplitPreset4 = pref.libraryLayoutSplitPreset4;
		themeLibrary.libraryDesign = pref.libraryDesign;
		themeLibrary.libraryTheme = pref.libraryTheme;
		themeLibrary.libraryThumbnailSize = pref.libraryThumbnailSize;
		themeLibrary.libraryThumbnailBorder = pref.libraryThumbnailBorder;
		themeLibrary.albumArtShow = ppt.albumArtShow;
		themeLibrary.itemOverlayType = ppt.itemOverlayType;
		themeLibrary.albumArtLetter = ppt.albumArtLetter;
		themeLibrary.albumArtLetterNo = ppt.albumArtLetterNo;
		themeLibrary.artId = ppt.artId;
		themeLibrary.albumArtGrpLevel = ppt.albumArtGrpLevel;
		themeLibrary.imgStyleFront = ppt.imgStyleFront;
		themeLibrary.imgStyleBack = ppt.imgStyleBack;
		themeLibrary.imgStyleDisc = ppt.imgStyleDisc;
		themeLibrary.imgStyleIcon = ppt.imgStyleIcon;
		themeLibrary.imgStyleArtist = ppt.imgStyleArtist;
		themeLibrary.albumArtLabelType = ppt.albumArtLabelType;
		themeLibrary.albumArtFlipLabels = ppt.albumArtFlipLabels;
		themeLibrary.actionMode = ppt.actionMode;
		themeLibrary.clickAction = ppt.clickAction;
		themeLibrary.dblClickAction = ppt.dblClickAction;
		themeLibrary.mbtnClickAction = ppt.mbtnClickAction;
		themeLibrary.altClickAction = ppt.altClickAction;
		themeLibrary.autoPlay = ppt.autoPlay;
		themeLibrary.keyAction = ppt.keyAction;
		themeLibrary.rememberTree = ppt.rememberTree;
		themeLibrary.artTreeSameView = ppt.artTreeSameView;
		themeLibrary.presetLoadCurView = ppt.presetLoadCurView;
		themeLibrary.libraryPlaylistSwitch = pref.libraryPlaylistSwitch;
		themeLibrary.rootNode = ppt.rootNode;
		themeLibrary.nodeCounts = ppt.nodeCounts;
		themeLibrary.countsRight = ppt.countsRight;
		themeLibrary.autoCollapse = ppt.autoCollapse;
		themeLibrary.itemShowStatistics = ppt.itemShowStatistics;
		themeLibrary.highLightNowplaying = ppt.highLightNowplaying;
		themeLibrary.showTracks = ppt.showTracks;
		themeLibrary.rowStripes = ppt.rowStripes;
		themeLibrary.fullLineSelection = ppt.fullLineSelection;
		themeLibrary.libraryRowHover = pref.libraryRowHover;
		themeLibrary.filterBy = ppt.filterBy;
		themeLibrary.sortOrder = ppt.sortOrder;
		themeLibrary.yearBeforeAlbum = ppt.yearBeforeAlbum;
		themeLibrary.albumArtViewBy = ppt.albumArtViewBy;
		themeLibrary.treeViewBy = ppt.treeViewBy;
		themeLibrary.librarySource = ppt.libSource;
		themeLibrary.librarySourceFixedPlaylist = ppt.fixedPlaylist;
		themeLibrary.librarySourceFixedPlaylistName = ppt.fixedPlaylistName;
	} else {
		pref.libraryDesign = custom ? themeLibrary.libraryDesign : 'reborn';
		setLibraryDesign();

		pref.libraryLayout = pref.libraryDesign === 'flowMode' ? 'full' : custom ? themeLibrary.libraryLayout : 'normal';
		pref.libraryLayoutFullPreset = custom ? themeLibrary.libraryLayoutFullPreset : true;
		pref.libraryLayoutSplitPreset = custom ? themeLibrary.libraryLayoutSplitPreset : true;
		pref.libraryLayoutSplitPreset2 = custom ? themeLibrary.libraryLayoutSplitPreset2 : false;
		pref.libraryLayoutSplitPreset3 = custom ? themeLibrary.libraryLayoutSplitPreset3 : false;
		pref.libraryLayoutSplitPreset4 = custom ? themeLibrary.libraryLayoutSplitPreset4 : false;
		ppt.theme = pref.libraryTheme = custom ? themeLibrary.libraryTheme : 0;
		pref.libraryThumbnailSizeSaved = ppt.thumbNailSize = pref.libraryThumbnailSize = custom ? themeLibrary.libraryThumbnailSize : 'auto';
		pref.libraryThumbnailBorder = custom ? themeLibrary.libraryThumbnailBorder : 'border';
		ppt.albumArtShow = custom ? themeLibrary.albumArtShow : false;
		ppt.itemOverlayType = custom ? themeLibrary.itemOverlayType : 0;
		ppt.albumArtLetter = custom ? themeLibrary.albumArtLetter : true;
		ppt.albumArtLetterNo = custom ? themeLibrary.albumArtLetterNo : 1;
		ppt.artId = custom ? themeLibrary.artId : 0;
		ppt.albumArtGrpLevel = custom ? themeLibrary.albumArtGrpLevel : 0;
		ppt.imgStyleFront = custom ? themeLibrary.imgStyleFront : 1;
		ppt.imgStyleBack = custom ? themeLibrary.imgStyleBack : 1;
		ppt.imgStyleDisc = custom ? themeLibrary.imgStyleDisc : 1;
		ppt.imgStyleIcon = custom ? themeLibrary.imgStyleIcon : 1;
		ppt.imgStyleArtist = custom ? themeLibrary.imgStyleArtist : 1;
		ppt.albumArtLabelType = custom ? themeLibrary.albumArtLabelType : 1;
		ppt.albumArtFlipLabels = custom ? themeLibrary.albumArtFlipLabels : false;
		ppt.actionMode = custom ? themeLibrary.actionMode : 0;
		ppt.clickAction = custom ? themeLibrary.clickAction : 0;
		ppt.dblClickAction = custom ? themeLibrary.dblClickAction : 1;
		ppt.mbtnClickAction = custom ? themeLibrary.mbtnClickAction : 1;
		ppt.altClickAction = custom ? themeLibrary.altClickAction : 1;
		ppt.autoPlay = custom ? themeLibrary.autoPlay : true;
		ppt.keyAction = custom ? themeLibrary.keyAction : 0;
		ppt.rememberTree = custom ? themeLibrary.rememberTree : false;
		ppt.artTreeSameView = custom ? themeLibrary.artTreeSameView : false;
		ppt.presetLoadCurView = custom ? themeLibrary.presetLoadCurView : true;
		pref.libraryPlaylistSwitch = custom ? themeLibrary.libraryPlaylistSwitch : false;
		ppt.rootNode = custom ? themeLibrary.rootNode : 3;
		ppt.nodeCounts = custom ? themeLibrary.nodeCounts : 1;
		ppt.countsRight = custom ? themeLibrary.countsRight : true;
		ppt.autoCollapse = custom ? themeLibrary.autoCollapse : false;
		ppt.itemShowStatistics = custom ? themeLibrary.itemShowStatistics : 0;
		ppt.highLightNowplaying = custom ? themeLibrary.highLightNowplaying : true;
		ppt.showTracks = custom ? themeLibrary.showTracks : true;
		ppt.rowStripes = custom ? themeLibrary.rowStripes : false;
		ppt.fullLineSelection = custom ? themeLibrary.fullLineSelection : true;
		pref.libraryRowHover = custom ? themeLibrary.libraryRowHover : true;
		ppt.filterBy = custom ? themeLibrary.filterBy : 0;
		ppt.sortOrder = custom ? themeLibrary.sortOrder : 'default';
		ppt.yearBeforeAlbum = custom ? themeLibrary.yearBeforeAlbum : true;
		ppt.albumArtViewBy = custom ? themeLibrary.albumArtViewBy : 0;
		ppt.treeViewBy = custom ? themeLibrary.treeViewBy : 0;
		ppt.libSource = pref.librarySource = custom ? themeLibrary.librarySource : 1;
		ppt.fixedPlaylist = pref.librarySourceFixedPlaylist = custom ? themeLibrary.librarySourceFixedPlaylist : false;
		ppt.fixedPlaylistName = pref.librarySourceFixedPlaylistName = custom ? themeLibrary.librarySourceFixedPlaylistName : '';
	}

	// * Biography
	if (save) {
		themeBiography.biographyLayout = pref.biographyLayout;
		themeBiography.biographyLayoutFullPreset = pref.biographyLayoutFullPreset;
		themeBiography.style = pptBio.style;
		themeBiography.filmStripPos = pptBio.filmStripPos;
		themeBiography.filmStripOverlay = pptBio.filmStripOverlay;
		themeBiography.biographyTheme = pref.biographyTheme;
		themeBiography.biographyDisplay = pref.biographyDisplay;
		themeBiography.showFilmStrip = pptBio.showFilmStrip;
		themeBiography.imgSeekerShow = pptBio.imgSeekerShow;
		themeBiography.heading = pptBio.heading;
		themeBiography.summaryShow = pptBio.summaryShow;
		themeBiography.summaryCompact = pptBio.summaryCompact;
		themeBiography.artistView = pptBio.artistView;
		themeBiography.focus = pptBio.focus;
		themeBiography.lockBio = pptBio.lockBio;
		themeBiography.sourceAll = pptBio.sourceAll;
		themeBiography.classicalMusicMode = pptBio.classicalMusicMode;
		themeBiography.cycPhotoLocation = pptBio.cycPhotoLocation;
		themeBiography.covType = pptBio.covType;
		themeBiography.loadCovAllFb = pptBio.loadCovAllFb;
		themeBiography.loadCovFolder = pptBio.loadCovFolder;
		themeBiography.artStyleDual = pptBio.artStyleDual;
		themeBiography.artReflDual = pptBio.artReflDual;
		themeBiography.artShadowDual = pptBio.artShadowDual;
		themeBiography.covStyleDual = pptBio.covStyleDual;
		themeBiography.covReflDual = pptBio.covReflDual;
		themeBiography.covShadowDual = pptBio.covShadowDual;
		themeBiography.artStyleImgOnly = pptBio.artStyleImgOnly;
		themeBiography.artReflImgOnly = pptBio.artReflImgOnly;
		themeBiography.artShadowImgOnly = pptBio.artShadowImgOnly;
		themeBiography.covStyleImgOnly = pptBio.covStyleImgOnly;
		themeBiography.covReflImgOnly = pptBio.covReflImgOnly;
		themeBiography.covShadowImgOnly = pptBio.covShadowImgOnly;
		themeBiography.filmPhotoStyle = pptBio.filmPhotoStyle;
		themeBiography.filmCoverStyle = pptBio.filmCoverStyle;
		themeBiography.photoNum = cfg.photoNum;
		themeBiography.cycPic = pptBio.cycPic;
		themeBiography.imgSmoothTrans = pptBio.imgSmoothTrans;
		themeBiography.cycTimePic = pptBio.cycTimePic;
	} else {
		pref.biographyLayout = custom ? themeBiography.biographyLayout : 'normal';
		pref.biographyLayoutFullPreset = custom ? themeBiography.biographyLayoutFullPreset : true;
		pptBio.style = custom ? themeBiography.style : 0;
		pptBio.filmStripPos = custom ? themeBiography.filmStripPos : 3;
		pptBio.filmStripOverlay = custom ? themeBiography.filmStripOverlay : false;
		pptBio.theme = pref.biographyTheme = custom ? themeBiography.biographyTheme : 0;

		pref.biographyDisplay = custom ? themeBiography.biographyDisplay : 'Image+text';
		setBiographyDisplay();

		pptBio.showFilmStrip = custom ? themeBiography.showFilmStrip : false;
		pptBio.imgSeekerShow = custom ? themeBiography.imgSeekerShow : 0;
		pptBio.heading = custom ? themeBiography.heading : 1;
		pptBio.summaryShow = custom ? themeBiography.summaryShow : true;
		pptBio.summaryCompact = custom ? themeBiography.summaryCompact : true;
		pptBio.artistView = custom ? themeBiography.artistView : true;
		pptBio.focus = custom ? themeBiography.focus : false;
		pptBio.lockBio = custom ? themeBiography.lockBio : false;
		pptBio.sourceAll = custom ? themeBiography.sourceAll : false;
		pptBio.classicalMusicMode = custom ? themeBiography.classicalMusicMode : false;
		pptBio.cycPhotoLocation = custom ? themeBiography.cycPhotoLocation : 0;
		pptBio.covType = custom ? themeBiography.covType : 0;
		pptBio.loadCovAllFb = custom ? themeBiography.loadCovAllFb : false;
		pptBio.loadCovFolder = custom ? themeBiography.loadCovFolder : false;
		pptBio.artStyleDual = custom ? themeBiography.artStyleDual : 1;
		pptBio.artReflDual = custom ? themeBiography.artReflDual : false;
		pptBio.artShadowDual = custom ? themeBiography.artShadowDual : false;
		pptBio.covStyleDual = custom ? themeBiography.covStyleDual : 1;
		pptBio.covReflDual = custom ? themeBiography.covReflDual : false;
		pptBio.covShadowDual = custom ? themeBiography.covShadowDual : false;
		pptBio.artStyleImgOnly = custom ? themeBiography.artStyleImgOnly : 1;
		pptBio.artReflImgOnly = custom ? themeBiography.artReflImgOnly : false;
		pptBio.artShadowImgOnly = custom ? themeBiography.artShadowImgOnly : false;
		pptBio.covStyleImgOnly = custom ? themeBiography.covStyleImgOnly : 1;
		pptBio.covReflImgOnly = custom ? themeBiography.covReflImgOnly : false;
		pptBio.covShadowImgOnly = custom ? themeBiography.covShadowImgOnly : false;
		pptBio.filmPhotoStyle = custom ? themeBiography.filmPhotoStyle : 1;
		pptBio.filmCoverStyle = custom ? themeBiography.filmCoverStyle : 1;
		cfg.photoNum = custom ? themeBiography.photoNum : 10;
		pptBio.cycPic = custom ? themeBiography.cycPic : true;
		pptBio.imgSmoothTrans = custom ? themeBiography.imgSmoothTrans : false;
		pptBio.cycTimePic = custom ? themeBiography.cycTimePic : 15;
	}

	// * Lyrics
	if (save) {
		themeLyrics.lyricsLayout = pref.lyricsLayout;
		themeLyrics.lyricsDropShadowLevel = pref.lyricsDropShadowLevel;
		themeLyrics.lyricsFadeScroll = pref.lyricsFadeScroll;
		themeLyrics.lyricsLargerCurrentSync = pref.lyricsLargerCurrentSync;
		themeLyrics.lyricsAlbumArt = pref.lyricsAlbumArt;
		themeLyrics.lyricsRememberActiveState = pref.lyricsRememberActiveState;
		themeLyrics.lyricsRememberPanelState = pref.lyricsRememberPanelState;
		themeLyrics.lyricsScrollSpeed = pref.lyricsScrollSpeed;
		themeLyrics.lyricsScrollRateAvg = pref.lyricsScrollRateAvg;
		themeLyrics.lyricsScrollRateMax = pref.lyricsScrollRateMax;
		themeLyrics.displayLyrics = pref.displayLyrics;
	} else {
		pref.lyricsLayout = custom ? themeLyrics.lyricsLayout : 'normal';
		pref.lyricsDropShadowLevel = custom ? themeLyrics.lyricsDropShadowLevel : 2;
		pref.lyricsFadeScroll = custom ? themeLyrics.lyricsFadeScroll : true;
		pref.lyricsLargerCurrentSync = custom ? themeLyrics.lyricsLargerCurrentSync : true;
		pref.lyricsAlbumArt = custom ? themeLyrics.lyricsAlbumArt : true;
		pref.lyricsRememberActiveState = custom ? themeLyrics.lyricsRememberActiveState : false;
		pref.lyricsRememberPanelState = custom ? themeLyrics.lyricsRememberPanelState : false;
		pref.lyricsScrollSpeed = custom ? themeLyrics.lyricsScrollSpeed : 'normal';
		pref.lyricsScrollRateAvg = custom ? themeLyrics.lyricsScrollRateAvg : 750;
		pref.lyricsScrollRateMax = custom ? themeLyrics.lyricsScrollRateMax : 375;
		pref.displayLyrics = custom ? themeLyrics.displayLyrics : false;
	}

	// * Settings
	if (save) {
		themeSettings.themeDayNightMode = pref.themeDayNightMode;
		themeSettings.customThemeFonts = pref.customThemeFonts;
		themeSettings.albumArtDiskCache = ppt.albumArtDiskCache;
		themeSettings.albumArtPreLoad = ppt.albumArtPreLoad;
		themeSettings.customLibraryDir = pref.customLibraryDir;
		themeSettings.libraryAutoDelete = pref.libraryAutoDelete;
		themeSettings.customBiographyDir = pref.customBiographyDir;
		themeSettings.biographyAutoDelete = pref.biographyAutoDelete;
		themeSettings.customLyricsDir = pref.customLyricsDir;
		themeSettings.lyricsAutoDelete = pref.lyricsAutoDelete;
		themeSettings.customWaveformBarDir = pref.customWaveformBarDir;
		themeSettings.waveformBarAutoDelete = pref.waveformBarAutoDelete;
		themeSettings.themePerformance = pref.themePerformance;
		themeSettings.devTools = pref.devTools;
		themeSettings.disableRightClick = pref.disableRightClick;
	} else {
		pref.themeDayNightMode = custom ? themeSettings.themeDayNightMode : false;
		pref.customThemeFonts = custom ? themeSettings.customThemeFonts : false;
		ppt.albumArtDiskCache = custom ? themeSettings.albumArtDiskCache : true;
		ppt.albumArtPreLoad = custom ? themeSettings.albumArtPreLoad : false;
		pref.customLibraryDir = custom ? themeSettings.customLibraryDir : false;
		pref.libraryAutoDelete = custom ? themeSettings.libraryAutoDelete : false;
		pref.customBiographyDir = custom ? themeSettings.customBiographyDir : false;
		pref.biographyAutoDelete = custom ? themeSettings.biographyAutoDelete : false;
		pref.customLyricsDir = custom ? themeSettings.customLyricsDir : false;
		pref.lyricsAutoDelete = custom ? themeSettings.lyricsAutoDelete : false;
		pref.customWaveformBarDir = custom ? themeSettings.customWaveformBarDir : false;
		pref.waveformBarAutoDelete = custom ? themeSettings.waveformBarAutoDelete : false;
		pref.themePerformance = custom ? themeSettings.themePerformance : 'balanced';
		pref.devTools = custom ? themeSettings.devTools : false;
		pref.disableRightClick = custom ? themeSettings.disableRightClick : true;
	}

	// * Not in the config nor in the Options menu
	pref.savedAlbumArtShow = ppt.albumArtShow;
	ppt.albumArtDropShadow = pref.libraryThumbnailBorder === 'shadow';
	pptBio.largerSyncLyricLine = pref.lyricsLargerCurrentSync;

	// * Set variable blendedImg when switching from default settings to config settings that has style Blend or Blend2 activated
	if ((pref.styleBlend || pref.styleBlend2 || pref.styleProgressBarFill === 'blend') && albumArt) setStyleBlend();

	// * Reinitialize theme presets when user has reset style settings by clicking on "Default" and reloading the config file
	initThemePresetState();

	// * Reinitialize the saved player size
	await display.initPlayerSize();

	libraryCanReload = true;
}


/**
 * Loads theme performance presets with various theme settings that affect overall performance.
 * The 'balanced' preset settings will be also applied in 'highQuality' and 'highestQuality'.
 * Used in Options > Settings > Theme performance.
 * @param {string} preset The theme performance preset to load.
 */
function setThemePerformance(preset) {
	switch (preset) {
		case 'balanced': // Default
			pref.playerSize = 'small';
			display.autoDetectRes();
			pref.styleDefault = true;
			pref.playlistAutoScrollNowPlaying = false;
			pref.playlistSmoothScrolling = true;
			pref.libraryAutoScrollNowPlaying = false;
			ppt.smooth = true;
			pptBio.smooth = true;
			pref.showStyledTooltips = true;
			pref.showPreloaderLogo = true;
			pref.showHiResAudioBadge = false;
			pref.showPause = true;
			pref.seekbar = 'progressbar';
			pref.progressBarRefreshRate = 'variable';
			pref.peakmeterBarRefreshRate = 80;
			pref.waveformBarPaint = 'partial';
			pref.waveformBarPrepaint = true;
			pref.waveformBarPrepaintFront = Infinity;
			pref.waveformBarAnimate = true;
			pref.waveformBarBPM = true;
			pref.waveformBarRefreshRate = 200;
			pref.playlistLayout = 'normal';
			g_properties.show_album_art = true;
			pref.playlistTimeRemaining = false;
			pref.playlistRowHover = true;
			pref.showDiscArtStub = true;
			pref.noDiscArtStub = false;
			pref.discArtStub = 'cdAlbumCover';
			pref.displayDiscArt = true;
			pref.spinDiscArt = false;
			pref.spinDiscArtImageCount = 72;
			pref.spinDiscArtRedrawInterval = 75;
			clearInterval(discArtRotationTimer);
			discArtArray = [];
			pref.detailsAlbumArtOpacity = 255;
			pref.detailsAlbumArtDiscAreaOpacity = 255;
			pref.showGridTimeline_default = true;
			pref.showGridTimeline_artwork = true;
			pref.libraryLayout = 'normal';
			pref.libraryDesign = 'reborn';
			pref.libraryTheme = 0;
			ppt.albumArtShow = false;
			pref.libraryRowHover = true;
			pref.biographyLayout = 'normal';
			pref.biographyTheme = 0;
			pptBio.showFilmStrip = false;
			cfg.photoNum = 10;
			ppt.albumArtDiskCache = true;
			ppt.albumArtPreLoad = false;
			pref.libraryAutoDelete = false;
			pref.biographyAutoDelete = false;
			pref.lyricsAutoDelete = false;
			pptBio.focusLoadRate = 1000;
			pptBio.focusLoadImmediate = false;
			pref.lyricsDropShadowLevel = 2;
			pref.lyricsFadeScroll = true;
			pref.lyricsAlbumArt = true;
			pref.lyricsRememberActiveState = false;
			pref.lyricsScrollSpeed = 'normal';
			pref.lyricsScrollRateAvg = 750;
			pref.lyricsScrollRateMax = 375;
			break;

		case 'lowestQuality':
			pref.playerSize = 'small';
			pref.playerSize_HD_small = true;
			display.playerSize_HD_small();
			pref.styleDefault = true;
			pref.displayRes = 'HD';
			pref.playlistAutoScrollNowPlaying = false;
			pref.playlistSmoothScrolling = false;
			pref.libraryAutoScrollNowPlaying = false;
			ppt.smooth = false;
			pptBio.smooth = false;
			pref.showStyledTooltips = false;
			pref.showPreloaderLogo = false;
			pref.showHiResAudioBadge = false;
			pref.showPause = false;
			pref.seekbar = 'progressbar';
			pref.progressBarRefreshRate = 1000;
			pref.peakmeterBarRefreshRate = 200;
			pref.waveformBarPaint = 'full';
			pref.waveformBarPrepaint = false;
			pref.waveformBarPrepaintFront = 2;
			pref.waveformBarAnimate = false;
			pref.waveformBarBPM = false;
			pref.waveformBarRefreshRate = 1000;
			pref.playlistLayout = 'normal';
			g_properties.show_album_art = false;
			pref.playlistTimeRemaining = false;
			pref.playlistRowHover = false;
			pref.showDiscArtStub = false;
			pref.noDiscArtStub = true;
			pref.displayDiscArt = false;
			pref.spinDiscArt = false;
			pref.spinDiscArtImageCount = 36;
			pref.spinDiscArtRedrawInterval = 250;
			pref.showGridTimeline_default = false;
			pref.showGridTimeline_artwork = false;
			pref.libraryLayout = 'normal';
			pref.libraryDesign = 'reborn';
			pref.libraryTheme = 0;
			ppt.albumArtShow = false;
			pref.libraryRowHover = false;
			pref.biographyLayout = 'normal';
			pref.biographyTheme = 0;
			pptBio.showFilmStrip = false;
			cfg.photoNum = 1;
			ppt.albumArtDiskCache = true;
			ppt.albumArtPreLoad = false;
			pptBio.focusLoadRate = 3000;
			pref.lyricsDropShadowLevel = 0;
			pref.lyricsFadeScroll = false;
			pref.lyricsAlbumArt = false;
			pref.lyricsRememberActiveState = false;
			pref.lyricsScrollSpeed = 'fastest';
			pref.lyricsScrollRateAvg = 300;
			pref.lyricsScrollRateMax = 150;
			break;

		case 'lowQuality':
			pref.playerSize = 'small';
			pref.styleDefault = true;
			pref.displayRes = 'HD';
			pref.showStyledTooltips = false;
			pref.seekbar = 'progressbar';
			pref.progressBarRefreshRate = 500;
			pref.peakmeterBarRefreshRate = 120;
			pref.waveformBarPaint = 'full';
			pref.waveformBarPrepaint = false;
			pref.waveformBarPrepaintFront = 2;
			pref.waveformBarAnimate = false;
			pref.waveformBarBPM = false;
			pref.waveformBarRefreshRate = 500;
			pref.playlistTimeRemaining = false;
			pref.showDiscArtStub = false;
			pref.noDiscArtStub = true;
			pref.displayDiscArt = false;
			pref.spinDiscArt = false;
			pref.spinDiscArtImageCount = 45;
			pref.spinDiscArtRedrawInterval = 125;
			pref.libraryTheme = 0;
			ppt.albumArtShow = false;
			pref.biographyTheme = 0;
			pptBio.showFilmStrip = false;
			cfg.photoNum = 5;
			ppt.albumArtDiskCache = true;
			ppt.albumArtPreLoad = false;
			pptBio.focusLoadRate = 2000;
			pref.lyricsDropShadowLevel = 0;
			pref.lyricsScrollSpeed = 'fast';
			pref.lyricsScrollRateAvg = 500;
			pref.lyricsScrollRateMax = 250;
			break;

		case 'highQuality':
			pref.playerSize = 'normal';
			pref.progressBarRefreshRate = 100;
			pref.peakmeterBarRefreshRate = 60;
			pref.waveformBarPaint = 'partial';
			pref.waveformBarPrepaint = true;
			pref.waveformBarPrepaintFront = Infinity;
			pref.waveformBarRefreshRate = 100;
			pref.waveformBarRefreshRateVar = false;
			pref.spinDiscArt = true;
			pref.spinDiscArtImageCount = 120;
			pref.spinDiscArtRedrawInterval = 40;
			setDiscArtRotationTimer();
			pref.libraryLayout = 'full';
			ppt.albumArtShow = true;
			pref.biographyLayout = 'full';
			cfg.photoNum = 15;
			ppt.albumArtDiskCache = true;
			ppt.albumArtPreLoad = true;
			pptBio.focusLoadRate = 750;
			pref.lyricsScrollSpeed = 'slow';
			pref.lyricsScrollRateAvg = 1000;
			pref.lyricsScrollRateMax = 500;
			break;

		case 'highestQuality':
			pref.playerSize = 'large';
			pref.progressBarRefreshRate = 30;
			pref.peakmeterBarRefreshRate = 30;
			pref.waveformBarPaint = 'partial';
			pref.waveformBarPrepaint = true;
			pref.waveformBarPrepaintFront = Infinity;
			pref.waveformBarRefreshRate = 30;
			pref.waveformBarRefreshRateVar = false;
			pref.spinDiscArt = true;
			pref.spinDiscArtImageCount = 180;
			pref.spinDiscArtRedrawInterval = 10;
			setDiscArtRotationTimer();
			pref.detailsAlbumArtDiscAreaOpacity = 178;
			pref.libraryLayout = 'full';
			ppt.albumArtShow = true;
			pref.biographyLayout = 'full';
			cfg.photoNum = 20;
			ppt.albumArtDiskCache = true;
			ppt.albumArtPreLoad = true;
			pptBio.focusLoadRate = 500;
			pref.lyricsScrollSpeed = 'slowest';
			pref.lyricsScrollRateAvg = 1500;
			pref.lyricsScrollRateMax = 725;
			break;
	}
}


/////////////////////
// * CONFIG FILE * //
/////////////////////
if (!config.fileExists) {
	tf = config.addConfigurationObject(titleFormatSchema, defaultTitleFormatStrings, titleFormatComments);
	config.addConfigurationObject(imgPathSchema, imgPathDefaults);

	theme            = config.addConfigurationObject(themesSchema, themeDefaults, themesComments);
	style            = config.addConfigurationObject(stylesSchema, stylesDefaults, stylesComments);
	preset           = config.addConfigurationObject(presetSchema, presetDefaults, presetComments);
	themePlayerSize  = config.addConfigurationObject(themePlayerSizeSchema, themePlayerSizeDefaults, themePlayerSizeComments);
	themeLayout      = config.addConfigurationObject(themeLayoutSchema, themeLayoutDefaults, themeLayoutComments);
	themeDisplay     = config.addConfigurationObject(themeDisplaySchema, themeDisplayDefaults, themeDisplayComments);
	themeBrightness  = config.addConfigurationObject(themeBrightnessSchema, themeBrightnessDefaults, themeBrightnessComments);
	themeFontSize    = config.addConfigurationObject(themeFontSizesSchema, themeFontSizesDefaults, themeFontSizesComments);
	themeControls    = config.addConfigurationObject(themePlayerControlsSchema, themePlayerControlsDefaults, themePlayerControlsComments);

	themePlaylist    = config.addConfigurationObject(themePlaylistSchema, themePlaylistDefaults, themePlaylistComments);
	config.addConfigurationObject(themePlaylistGroupingPresetsSchema, themePlaylistGroupingPresets);

	themeDetails     = config.addConfigurationObject(themeDetailsSchema, themeDetailsDefaults, themeDetailsComments);
	config.addConfigurationObject(gridSchema, defaultMetadataGrid); // We don't assign an object here because these aren't key/value pairs and thus can't use the get/setters

	themeLibrary     = config.addConfigurationObject(themeLibrarySchema, themeLibraryDefaults, themeLibraryComments);
	themeBiography   = config.addConfigurationObject(themeBiographySchema, themeBiographyDefaults, themeBiographyComments);
	themeLyrics      = config.addConfigurationObject(themeLyricsSchema, themeLyricsDefaults, themeLyricsComments);
					   config.addConfigurationObject(lyricFilenamesSchema, lyricFilenamesDefaults);
	themeSettings    = config.addConfigurationObject(themeSettingsSchema, themeSettingsDefaults, themeSettingsComments);
	settings         = config.addConfigurationObject(settingsSchema, settingsDefaults, settingsComments);

	console.log('> Writing', configPath);
	config.writeConfiguration();
}

if (!configCustom.fileExists) {
	configCustom.addConfigurationObject(customLibraryDirSchema, customLibraryDirDefaults);
	configCustom.addConfigurationObject(customBiographyDirSchema, customBiographyDirDefaults);
	configCustom.addConfigurationObject(customLyricsDirSchema, customLyricsDirDefaults);
	configCustom.addConfigurationObject(customWaveformBarDirSchema, customWaveformBarDirDefaults);

	customFont        = configCustom.addConfigurationObject(customFontsSchema, customFontsDefaults, customFontsComments);
	customStylePreset = configCustom.addConfigurationObject(customStylePresetSchema, customStylePresetDefaults, customStylePresetComments);
	customDiscArtStub = configCustom.addConfigurationObject(customDiscArtStubSchema, customDiscArtStubDefaults, customDiscArtStubComments);
	customTheme01     = configCustom.addConfigurationObject(customTheme01Schema, customThemeDefaults, customThemeComments);
	customTheme02     = configCustom.addConfigurationObject(customTheme02Schema, customThemeDefaults, customThemeComments);
	customTheme03     = configCustom.addConfigurationObject(customTheme03Schema, customThemeDefaults, customThemeComments);
	customTheme04     = configCustom.addConfigurationObject(customTheme04Schema, customThemeDefaults, customThemeComments);
	customTheme05     = configCustom.addConfigurationObject(customTheme05Schema, customThemeDefaults, customThemeComments);
	customTheme06     = configCustom.addConfigurationObject(customTheme06Schema, customThemeDefaults, customThemeComments);
	customTheme07     = configCustom.addConfigurationObject(customTheme07Schema, customThemeDefaults, customThemeComments);
	customTheme08     = configCustom.addConfigurationObject(customTheme08Schema, customThemeDefaults, customThemeComments);
	customTheme09     = configCustom.addConfigurationObject(customTheme09Schema, customThemeDefaults, customThemeComments);
	customTheme10     = configCustom.addConfigurationObject(customTheme10Schema, customThemeDefaults, customThemeComments);

	console.log('> Writing', configPathCustom);
	configCustom.writeConfiguration();
}

if (config.fileExists) {
	const prefs = config.readConfiguration();
	/**
	 * While we've read all the values in, we still need to call addConfigurationObject to add the getters/setters
	 * for the objects so that the file gets automatically written when a setting is changed.
	 */
	tf = config.addConfigurationObject(titleFormatSchema, Object.assign({}, defaultTitleFormatStrings, prefs.title_format_strings), titleFormatComments);
	config.addConfigurationObject(imgPathSchema, prefs.imgPaths);

	theme            = config.addConfigurationObject(themesSchema, Object.assign({}, themeDefaults, prefs.theme), themesComments);
	style            = config.addConfigurationObject(stylesSchema, Object.assign({}, stylesDefaults, prefs.style), stylesComments);
	preset           = config.addConfigurationObject(presetSchema, Object.assign({}, presetDefaults, prefs.preset), presetComments);
	themePlayerSize  = config.addConfigurationObject(themePlayerSizeSchema, Object.assign({}, themePlayerSizeDefaults, prefs.themePlayerSize), themePlayerSizeComments);
	themeLayout      = config.addConfigurationObject(themeLayoutSchema, Object.assign({}, themeLayoutDefaults, prefs.themeLayout), themeLayoutComments);
	themeDisplay     = config.addConfigurationObject(themeDisplaySchema, Object.assign({}, themeDisplayDefaults, prefs.themeDisplay), themeDisplayComments);
	themeBrightness  = config.addConfigurationObject(themeBrightnessSchema, Object.assign({}, themeBrightnessDefaults, prefs.themeBrightness), themeBrightnessComments);
	themeFontSize    = config.addConfigurationObject(themeFontSizesSchema, Object.assign({}, themeFontSizesDefaults, prefs.themeFontSize), themeFontSizesComments);
	themeControls    = config.addConfigurationObject(themePlayerControlsSchema, Object.assign({}, themePlayerControlsDefaults, prefs.themeControls), themePlayerControlsComments);

	themePlaylist    = config.addConfigurationObject(themePlaylistSchema, Object.assign({}, themePlaylistDefaults, prefs.themePlaylist), themePlaylistComments);
	config.addConfigurationObject(themePlaylistGroupingPresetsSchema, prefs.themePlaylistGroupingPresets || themePlaylistGroupingPresets);

	themeDetails     = config.addConfigurationObject(themeDetailsSchema, Object.assign({}, themeDetailsDefaults, prefs.themeDetails), themeDetailsComments);
	prefs.metadataGrid && prefs.metadataGrid.forEach(entry => {
		// Copy comments over to existing object so they aren't lost
		const gridEntryDefinition = defaultMetadataGrid.find(gridDefItem => gridDefItem.label === entry.label);
		if (gridEntryDefinition && gridEntryDefinition.comment) {
			entry.comment = gridEntryDefinition.comment;
		}
	});
	config.addConfigurationObject(gridSchema, prefs.metadataGrid || defaultMetadataGrid); // Can't Object.assign here to add new fields. Add new fields in the upgrade section of migrateCheck

	themeLibrary   = config.addConfigurationObject(themeLibrarySchema, Object.assign({}, themeLibraryDefaults, prefs.themeLibrary), themeLibraryComments);
	themeBiography = config.addConfigurationObject(themeBiographySchema, Object.assign({}, themeBiographyDefaults, prefs.themeBiography), themeBiographyComments);
	themeLyrics    = config.addConfigurationObject(themeLyricsSchema, Object.assign({}, themeLyricsDefaults, prefs.themeLyrics), themeLyricsComments);
					 config.addConfigurationObject(lyricFilenamesSchema, prefs.lyricFilenamePatterns || lyricFilenamesDefaults);
	themeSettings  = config.addConfigurationObject(themeSettingsSchema, Object.assign({}, themeSettingsDefaults, prefs.themeSettings), themeSettingsComments);
	settings       = config.addConfigurationObject(settingsSchema, Object.assign({}, settingsDefaults, prefs.settings), settingsComments);

	// Safety checks. Fix up potentially bad vals from config
	settings.discArtBasename = settings.discArtBasename && settings.discArtBasename.trim().length ? settings.discArtBasename.trim() : 'cd';
	settings.artworkDisplayTime = Math.min(Math.max(settings.artworkDisplayTime, 5), 120);	// Ensure min of 5sec and max of 120sec

	globals.imgPaths = prefs.imgPaths;
	globals.lyricFilenamePatterns = prefs.lyricFilenamePatterns;
	metadataGrid = prefs.metadataGrid;
	configVersion = prefs.configVersion || prefs.version;
	// When adding new objects to the config file, add them in the version check below

	// Safe guard when playlist grouping presets or metadata grid do not exist in the config
	if (!prefs.themePlaylistGroupingPresets || !prefs.metadataGrid) {
		const fileName = 'georgia-reborn\\configs\\georgia-reborn-config-backup.jsonc';
		fso.CopyFile(configPath, fb.ProfilePath + fileName);
		config.writeConfiguration();
	}
}

if (configCustom.fileExists) {
	const prefs = configCustom.readConfiguration();

	configCustom.addConfigurationObject(customLibraryDirSchema, prefs.customLibraryDir || customLibraryDirDefaults);
	configCustom.addConfigurationObject(customBiographyDirSchema, prefs.customBiographyDir || customBiographyDirDefaults);
	configCustom.addConfigurationObject(customLyricsDirSchema, prefs.customLyricsDir || customLyricsDirDefaults);
	configCustom.addConfigurationObject(customWaveformBarDirSchema, prefs.customWaveformBarDir || customWaveformBarDirDefaults);

	customFont        = configCustom.addConfigurationObject(customFontsSchema, Object.assign({}, customFontsDefaults, prefs.customFont), customFontsComments);
	customStylePreset = configCustom.addConfigurationObject(customStylePresetSchema, Object.assign({}, customStylePresetDefaults, prefs.customStylePreset), customStylePresetComments);
	customDiscArtStub = configCustom.addConfigurationObject(customDiscArtStubSchema, Object.assign({}, customDiscArtStubDefaults, prefs.customDiscArtStub), customDiscArtStubComments);
	customTheme01     = configCustom.addConfigurationObject(customTheme01Schema, Object.assign({}, customThemeDefaults, prefs.customTheme01), customThemeComments);
	customTheme02     = configCustom.addConfigurationObject(customTheme02Schema, Object.assign({}, customThemeDefaults, prefs.customTheme02), customThemeComments);
	customTheme03     = configCustom.addConfigurationObject(customTheme03Schema, Object.assign({}, customThemeDefaults, prefs.customTheme03), customThemeComments);
	customTheme04     = configCustom.addConfigurationObject(customTheme04Schema, Object.assign({}, customThemeDefaults, prefs.customTheme04), customThemeComments);
	customTheme05     = configCustom.addConfigurationObject(customTheme05Schema, Object.assign({}, customThemeDefaults, prefs.customTheme05), customThemeComments);
	customTheme06     = configCustom.addConfigurationObject(customTheme06Schema, Object.assign({}, customThemeDefaults, prefs.customTheme06), customThemeComments);
	customTheme07     = configCustom.addConfigurationObject(customTheme07Schema, Object.assign({}, customThemeDefaults, prefs.customTheme07), customThemeComments);
	customTheme08     = configCustom.addConfigurationObject(customTheme08Schema, Object.assign({}, customThemeDefaults, prefs.customTheme08), customThemeComments);
	customTheme09     = configCustom.addConfigurationObject(customTheme09Schema, Object.assign({}, customThemeDefaults, prefs.customTheme09), customThemeComments);
	customTheme10     = configCustom.addConfigurationObject(customTheme10Schema, Object.assign({}, customThemeDefaults, prefs.customTheme10), customThemeComments);

	globals.customLibraryDir = prefs.customLibraryDir;
	globals.customBiographyDir = prefs.customBiographyDir;
	globals.customLyricsDir = prefs.customLyricsDir;
	globals.customWaveformBarDir = prefs.customWaveformBarDir;
	customFont = prefs.customFont;
	customStylePreset = prefs.customStylePreset;
	customDiscArtStub = prefs.customDiscArtStub;
	configVersion = prefs.configVersion || prefs.version;
}

// * Do the migration check BEFORE we start adding extra crap to tf.
// TODO: Should I move all the tf. extra properties that AREN'T in the config to the globals object? Probably maybe?
migrateCheck(currentVersion, configVersion);

// ! All tf values from here below will NOT be written to the georgia-reborn-config file
tf.vinyl_track = `$if2(${tf.vinyl_side}[${tf.vinyl_tracknum}]. ,[%tracknumber%. ])`;

tf.lyr_path = [ // To add and use a new custom lyric directory, go to the customLyricsDir section in the config file
	'$replace($replace(%path%,%filename_ext%,),,\\)',
	`${fb.ProfilePath}cache\\lyrics\\`,
	`${fb.FoobarPath}cache\\lyrics\\`
];

tf.labels = [ // Array of fields to test for publisher. Add, change or re-order as needed.
	'label', // ! DO NOT put %s around the field names because we are using $meta() calls
	'publisher',
	'discogs_label'
];


///////////////////////////
// * DISC ART SETTINGS * //
///////////////////////////
{
	let count = Number(pref.spinDiscArtImageCount);
	if (Number.isNaN(count)) { // Check if NaN
		count = 72;
	}
	pref.spinDiscArtImageCount = count;
	let interval = Number(pref.spinDiscArtRedrawInterval);
	if (Number.isNaN(interval)) {
		interval = 200;
	}
	pref.spinDiscArtRedrawInterval = Math.max(10, interval);
}


////////////////////////////
// * THEME UPDATE CHECK * //
////////////////////////////
/**
 * Compares the latest version with the existing config version.
 * @param {string} version The latest version.
 * @param {string} storedVersion The config version.
 */
function migrateCheck(version, storedVersion) {
	/**
	 * Checks if settings exist in the configuration file.
	 * @param {object} settings The settings object from the configuration file.
	 * @param {...string} settingNames The names of the settings to check.
	 * @returns {boolean} Returns true if all specified settings exist, otherwise false.
	 */
	const CheckSettings = (settings, ...settingNames) => settingNames.every(settingName => Object.prototype.hasOwnProperty.call(settings, settingName));

	/**
	 * Deletes settings from the configuration file.
	 * @param {object} settings The settings object from the configuration file.
	 * @param {...string} settingNames The names of the settings to remove.
	 */
	const DeleteSettings = (settings, ...settingNames) => {
		settingNames.forEach(settingName => {
			delete settings[settingName];
		});
	};

	/**
	 * Checks if specific entry exist in the metadata grid configuration.
	 * @param {MetadataGridEntry[]} grid Each element in the array is an object with a `label` property.
	 * @param {...string} labels The labels of the settings to check.
	 * @returns {boolean} Returns true if all specified labels exist, otherwise false.
	 */
	const CheckGridEntry = (grid, ...labels) =>
		labels.every(label => grid.some(gridEntry => gridEntry.label.toLowerCase() === label.toLowerCase()));

	/**
	 * Renames an entry in the metadata grid with a new label name.
	 * @param {MetadataGridEntry[]} grid Each element in the array is an object with a `label` property.
	 * @param {string} oldLabel The old label name to rename.
	 * @param {string} newLabel The new label name that will be replaced in the config file.
	 */
	const RenameGridEntry = (grid, oldLabel, newLabel) => {
		const entryIdx = grid.findIndex(gridEntry => gridEntry && gridEntry.label.toLowerCase() === oldLabel.toLowerCase());
		if (entryIdx >= 0) {
			grid[entryIdx].label = newLabel;
		}
	};

	/**
	 * Adds or Replaces values in the metadata grid with updated string from defaults.
	 * @param {MetadataGridEntry[]} grid Each element in the array is an object with a `label` property.
	 * @param {string} label The label of the value to add or replace.
	 * @param {number} position 0-based index of place to insert new value if existing entry not found.
	 */
	const ReplaceGridEntry = (grid, label, position) => {
		const entryIdx = grid.findIndex(gridEntry => gridEntry && gridEntry.label.toLowerCase() === label.toLowerCase());
		const newVal = defaultMetadataGrid[defaultMetadataGrid.findIndex(e => e && e.label.toLowerCase() === label.toLowerCase())];
		if (entryIdx >= 0) {
			grid[entryIdx] = newVal;
		} else {
			grid.splice(position, 0, newVal);
		}
	};

	const configFile = config.readConfiguration();
	const configFileCustom = configCustom.readConfiguration();
	const fileName = `georgia-reborn\\configs\\georgia-reborn-config-${storedVersion}.jsonc`;
	const fileNameCustom = `georgia-reborn\\configs\\georgia-reborn-custom-${storedVersion}.jsonc`;

	// * Remove old settings from the config file and add the new settings
	const oldSettings = ['playlistSortArtistDateAsc', 'playlistSortArtistDateDesc', 'playlistSortAlbum', 'playlistSortTitle', 'playlistSortTracknum', 'playlistSortArtistYearAsc', 'playlistSortArtistYearDesc'];
	if (CheckSettings(configFile.settings, ...oldSettings)) {
		fso.CopyFile(configPath, fb.ProfilePath + fileName);
		config.writeConfiguration();
		DeleteSettings(configFile.settings, ...oldSettings);
		config.addConfigurationObject(settingsSchema, configFile.settings);
		config.addConfigurationObject(settingsSchema, settingsDefaults, settingsComments);
		config.writeConfiguration(configFile.settings);
	}
	if (!CheckGridEntry(configFile.metadataGrid, 'Channels')) {
		fso.CopyFile(configPath, fb.ProfilePath + fileName);
		config.addConfigurationObject(gridSchema, defaultMetadataGrid);
		config.writeConfiguration();
		window.Reload(); // Reinit new config
	}

	// * Update config settings which have changed since last update
	if (version !== storedVersion) {
		switch (storedVersion) {
			/* eslint-disable no-fallthrough */
			case '3.0-RC1':
				RenameGridEntry(configFile.metadataGrid, 'Catalog #', 'Catalog');
				config.addConfigurationObject(gridSchema, configFile.metadataGrid);
			case '3.0-RC2':
				config.addConfigurationObject(themePlaylistGroupingPresetsSchema, themePlaylistGroupingPresets);
			case '3.0-DEV':
				// This default block ( latest version ) should appear after all previous versions have fallen through
				console.log('> Upgrading Georgia-ReBORN theme settings from', storedVersion);
				console.log(`> Backing up Georgia-ReBORN configuration file to ${fileName}`);
				fso.CopyFile(configPath, fb.ProfilePath + fileName);
				config.writeConfiguration();
				fso.CopyFile(configPathCustom, fb.ProfilePath + fileNameCustom);
				configCustom.writeConfiguration();
				break;
			default:
				break;
		}
	}

	pref.version = currentVersion; // Always update the version panel property
}


/**
 * Checks if there is a new update available, also called in Options > Help > Theme > Updates > Check for latest theme update.
 * @param {boolean} openUrl Opens the Georgia-ReBORN Github releases page when hyperlink is available.
 */
function checkForUpdates(openUrl) {
	const url = 'https://api.github.com/repos/TT-ReBORN/Georgia-ReBORN/tags';
	MakeHttpRequest('GET', url, (resp) => {
		try {
			/** @type {boolean} The current Github master version, used to prevent notifying users for new update when in development state. */
			const developVersion = currentVersion.endsWith('DEV');
			const respObj = JSON.parse(resp);
			updateAvailable = developVersion ? false : IsNewerVersion(currentVersion, respObj[0].name);
			console.log(`Current released version of Georgia-ReBORN: v${respObj[0].name}`);
			if (updateAvailable) {
				console.log('>>> Georgia-ReBORN new update available. Download it from here: https://github.com/TT-ReBORN/Georgia-ReBORN/releases');
				updateHyperlink = new Hyperlink('New Update Available', ft.lower_bar_title, 'update', 0, 0, window.Width);
				if (updateHyperlink) {
					lowerBarStoppedTime = '';
					if (!fb.IsPlaying) {
						str.time = lowerBarStoppedTime;
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
			if (!updateHyperlink && updateRetryCount < 3) {
				// updateHyperlink failed to be created somehow. Let's check again after 1 minute.
				updateRetryCount++;
				updateAvailable = false;
				scheduleUpdateCheck(61000);
			}
		}
	});
}


/**
 * Schedules an update check. Sets at startup and then typically every 24 hours after unless an update is found.
 * @param {number} delay In milliseconds.
 */
function scheduleUpdateCheck(delay) {
	clearTimeout(updateTimer);
	updateTimer = setTimeout(() => {
		if (!updateAvailable) {
			checkForUpdates(false);
			scheduleUpdateCheck(1000 * 60 * 60 * 24);	// Check every 24 hours
		}
	}, delay);
}
