/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Settings                                 * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    21-03-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////////
// * PANEL PROPERTIES * //
//////////////////////////
/**
 * A class that creates an object with a name and a value, and provides methods to get and set the value while also storing.
 */
class PanelProperty {
	/**
	 * Creates the `PanelProperty` instance.
	 * @param {string} name - The name of the property, used as a key to store and retrieve the property value.
	 * @param {*} defaultValue - The initial value that will be used if there is no existing value stored for the property.
	 */
	constructor(name, defaultValue) {
		/** @constant {string} */
		this.name = name;
		/** @private @type {*} */
		this.value = window.GetProperty(this.name, defaultValue);
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets the current value of the panel property (backward compatibility method).
	 * @returns {*} The current value of the property.
	 */
	get() {
		return this.value;
	}

	/**
	 * Sets the panel property to a new value and updates the internal state as well as the stored value.
	 * @param {*} newValue - The new value to set for the property.
	 */
	set(newValue) {
		if (this.value !== newValue) {
			window.SetProperty(this.name, newValue);
			this.value = newValue;
		}
	}
	// #endregion
}


/**
 * A class that allows to add and manage SMP properties with their names and default values.
 */
class PanelProperties {
	/**
	 * Creates the `PanelProperties` instance.
	 */
	constructor() {
		/** @private @type {{[key: string]: boolean}} An object used for collision checks only and shared between objects. */
		this.properties_name_list = {};
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Adds a new property to an object and creates a getter and setter for that property.
	 * @param {Array} item - An array that contains the name and default value.
	 * @param {string} itemId - A unique identifier for the property item.
	 * @returns {*} Defining a new property on an object and setting its getter and setter methods.
	 * @private
	 */
	_addPropertyItem(item, itemId) {
		this.properties_name_list[item[0]] = 1;

		this[`${itemId}_internal`] = new PanelProperty(item[0], item[1]);

		Object.defineProperty(this, itemId, {
			get() {
				return this[`${itemId}_internal`].get();
			},
			set(newValue) {
				this[`${itemId}_internal`].set(newValue);
			}
		});
	}

	/**
	 * Validates a property item and throws appropriate errors if any validation fails.
	 * @param {Array} item - An array where the first element is a string representing the property name, and the second element is the default value of the property.
	 * @param {string} itemId - A unique identifier for the property item.
	 * @throws {InvalidTypeError} Throws an error if the property item is not an array of the expected format.
	 * @throws {ArgumentError} Throws an error if the property_id is reserved, already occupied, or if the property_name is already taken.
	 * @private
	 */
	_validatePropertyItem(item, itemId) {
		if (!Array.isArray(item) || item.length !== 2 || !IsString(item[0])) {
			throw new InvalidTypeError('property', typeof item, '{ string, [string, any] }', 'Usage: addProperties({\n  property_id: [property_name, property_default_value]\n})');
		}
		if (itemId === 'add_properties') {
			throw new ArgumentError('property_id', itemId, 'This id is reserved');
		}
		if (this[itemId] || this[`${itemId}_internal`]) {
			throw new ArgumentError('property_id', itemId, 'This id is already occupied');
		}
		if (this.properties_name_list[item[0]]) {
			throw new ArgumentError('property_name', item[0], 'This name is already occupied');
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Adds multiple properties to the object by defining a new property with a getter and setter for each item in the `properties` object.
	 * @param {{[key: string]: [string, *]}} properties - An object where keys are property identifiers, and values are arrays containing the property name and default value.
	 */
	addProperties(properties) {
		for (const key of Object.keys(properties)) {
			this._validatePropertyItem(properties[key], key);
			this._addPropertyItem(properties[key], key);
		}
	}
	// #endregion
}


////////////////////////
// * THEME SETTINGS * //
////////////////////////
/**
 * The instance of `PanelProperties` class for Georgia-ReBORN panel property settings.
 * @typedef {PanelProperties}
 * @global
 */
const grSet = new PanelProperties();

/**
 * ! AFTER INITIAL RUN, THESE VALUES ARE CHANGED IN OPTIONS MENU OR BY RIGHT CLICK > PROPERTIES AND NOT HERE.
 * Settings chronological ordered by top menu > Options.
 */
grSet.addProperties({
	version:                            ['Georgia-ReBORN - #Version: Do not hand edit!', '3.0-DEV'],

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
	albumArtScale:                      ['Georgia-ReBORN - 09. Player controls: Album art scale fullscreen', 'cropped'], // cropped: Scale album art in Default layout when player size is maximized/fullscreen
	albumArtAspectRatioLimit:           ['Georgia-ReBORN - 09. Player controls: Album art aspect ratio limits fullscreen', 1.5], // 1.5: Keep wide and tall artworks proportional when player size is maximized/fullscreen
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
	jumpSearchDisabled:                 ['Georgia-ReBORN - 09. Player controls: Jump search disabled', false], // true: Disable jump search
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
	returnToHomeOnPlaybackStop:         ['Georgia-ReBORN - 09. Player controls: Return to home on playback stop', true], // true: Return to home on playback stop
	addTracksPlaylistSwitch:            ['Georgia-ReBORN - 09. Player controls: Switch to playlist when adding songs', false], // When adding songs from Library or Playlist to another playlist
	hideMiddlePanelShadow:              ['Georgia-ReBORN - 09. Player controls: Hide middle panel shadow', false], // false: Hides the middle panel shadow
	fullscreenESCDisabled:              ['Georgia-ReBORN - 09. Player controls: Disable fullscreen ESC', false], // Enable or disable ESC fullscreen exit
	fullscreenMaximize:                 ['Georgia-ReBORN - 09. Player controls: Maximize to fullscreen', true], // Enable or disable maximize function
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
	showAddTracksBtn_default:           ['Georgia-ReBORN - 09. Player controls: Show add tracks button (Default)', false], // false: Show add tracks button in lower bar in Default layout
	showAddTracksBtn_artwork:           ['Georgia-ReBORN - 09. Player controls: Show add tracks button (Artwork)', false], // false: Show add tracks button in lower bar in Artwork layout
	showAddTracksBtn_compact:           ['Georgia-ReBORN - 09. Player controls: Show add tracks button (Compact)', false], // false: Show add tracks button in lower bar in Compact layout
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
	addTracksPlaylist:                  ['Georgia-ReBORN - 09. Player controls: Add tracks playlist', 'Favorites'], // 'Favorites', the playlist where tracks will be added when using the add tracks button.
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
	lyricsRememberPanelState:           ['Georgia-ReBORN - 14. Lyrics: Remember lyrics panel state', false], // true: Displays lyrics panel state on startup and when switching through panels
	lyricsScrollSpeed:                  ['Georgia-ReBORN - 14. Lyrics: Scroll speed', 'normal'], // 'fastest', 'fast', 'normal', 'slow', 'slowest' - lyrics scroll speed based on scroll average and maximum
	lyricsScrollRateAvg:                ['Georgia-ReBORN - 14. Lyrics: Scroll speed avg rate', 750], // 300, 500, 750, 1000, 1500 - average lyrics scroll in ms
	lyricsScrollRateMax:                ['Georgia-ReBORN - 14. Lyrics: Scroll speed max rate', 375], // average lyrics scroll / 2 = maximum lyrics scroll in ms
	lyricsPanelState:                   ['Georgia-ReBORN - 14. Lyrics: Lyrics panel state', false], // false: Saved the lyrics panel state, used for lyricsRememberPanelState

	// * Settings
	themeDayNightMode:                  ['Georgia-ReBORN - 15. Settings: Auto-day/night mode', false], // false: The theme day/night mode state controlled by OS clock and users set themeSettings.themeDayNightMode value
	themeDayNightTime:                  ['Georgia-ReBORN - 15. Settings: Auto-day/night time', ''], // The current time of the day as string value 'day' or 'night', auto-controlled and used for theme day/night mode
	themeSetupDay:                      ['Georgia-ReBORN - 15. Settings: Auto-day/night theme setup daytime', false], // false: The daytime setup mode state when configuring the theme for daytime
	themeSetupNight:                    ['Georgia-ReBORN - 15. Settings: Auto-day/night theme setup nighttime', false], // false: The nighttime setup mode state when configuring the theme for nighttime
	themeSandbox:                       ['Georgia-ReBORN - 15. Settings: Theme sandbox', false], // false: Enables theme sandbox, useful when trying out themes, styles, presets or writing theme tags. After disabling, it will restore last previous theme settings
	customThemeFonts:                   ['Georgia-ReBORN - 15. Settings: Use custom theme fonts', false], // false: User can set own custom theme fonts in foobar's Preferences > Display > Columns UI > Colours and fonts
	customPreloaderLogo:                ['Georgia-ReBORN - 15. Settings: Use custom preloader logo', false], // false: Use custom preloader logo
	customThemeImages:                  ['Georgia-ReBORN - 15. Settings: Use custom theme images', false], // false: Use custom theme images
	customLibraryDir:                   ['Georgia-ReBORN - 15. Settings: Use custom library directory', false], // false: Use custom library directory
	libraryAutoDelete:                  ['Georgia-ReBORN - 15. Settings: Auto-delete library cache', false], // false: This will auto-delete cached library album art thumbnails on startup
	customBiographyDir:                 ['Georgia-ReBORN - 15. Settings: Use custom biography directory', false], // false: Use custom biography directory
	biographyAutoDelete:                ['Georgia-ReBORN - 15. Settings: Auto-delete biography cache', false], // false: This will auto-delete downloaded biography images and text on startup
	customLyricsDir:                    ['Georgia-ReBORN - 15. Settings: Use custom lyrics directory', false], // false: Use custom lyrics directory
	lyricsAutoDelete:                   ['Georgia-ReBORN - 15. Settings: Auto-delete lyrics', false], // false: This will auto-delete downloaded lyrics on startup
	customWaveformBarDir:               ['Georgia-ReBORN - 15. Settings: Use custom waveform bar directory', false], // false: Use custom waveform bar directory
	waveformBarAutoDelete:              ['Georgia-ReBORN - 15. Settings: Auto-delete waveform bar cache', false], // false: This will auto-delete analyzed waveform bar files on startup
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
});


////////////////////////////////
// * THEME SETTINGS MANAGER * //
////////////////////////////////
/**
 * A class that manages theme settings for the application, allowing to save, load, and apply default configurations.
 */
class ThemeSettingsManager {
	/**
	 * Creates the `ThemeSettingsManager` instance.
	 * @param {boolean} saveCfg - The current settings will be saved to the configuration.
	 * @param {boolean} loadCfg - The settings will be loaded from the configuration.
	 * @param {boolean} defaultCfg - The default settings will be applied.
	 */
	constructor(saveCfg, loadCfg, defaultCfg) {
		/** @private @type {boolean} */
		this.saveCfg = saveCfg;
		/** @private @type {boolean} */
		this.loadCfg = loadCfg;
		/** @private @type {boolean} */
		this.defaultCfg = defaultCfg;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Sets an individual setting based on the config args from the other set methods as follows:
	 * - `saveCfg`: configObj.keyname = prefObj.keyname;
	 * - `loadCfg`: prefObj.keyname = configObj.keyname;
	 * - `defaultCfg`: prefObj.keyname = defaultValue;.
	 * @param {object} prefObj - The preferences object.
	 * @param {string} prefKey - The pref key in the preferences object.
	 * @param {object} configObj - The config object.
	 * @param {string} configKey - The config key in the presets object.
	 * @param {*} defaultValue - The default value to set if defaultCfg is true.
	 * @private
	 */
	_setSetting(prefObj, prefKey, configObj, configKey, defaultValue) {
		if (this.saveCfg && configKey !== false) {
			configObj[configKey] = prefObj[prefKey];
		}
		else if (this.loadCfg && configKey !== false) {
			prefObj[prefKey] = configObj[configKey];
		}
		else if (this.defaultCfg) {
			prefObj[prefKey] = defaultValue;
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Loads default theme settings when grSet.customThemeSettings is false, otherwise it loads settings from the config file.
	 * When using with the parameter, it saves all settings to the config file.
	 * @param {boolean} saveCfg - Saves current theme settings from the `pref` panel properties object to config file.
	 * @param {boolean} loadCfg - Loads theme settings from the config file to the `pref` panel properties object.
	 * @param {boolean} defaultCfg - Loads theme settings based on default setting values.
	 */
	async setThemeSettings(saveCfg = false, loadCfg = false, defaultCfg = false) {
		grm.ui.libraryCanReload = false;

		this.saveCfg = saveCfg;
		this.loadCfg = loadCfg;
		this.defaultCfg = defaultCfg;

		this.setTheme();
		this.setStyle();
		this.setPreset();
		this.setPlayerSize();
		this.setLayout();
		this.setDisplay();
		this.setBrightness();
		this.setFontSize();
		this.setPlayerControls();
		this.setPlaylist();
		this.setDetails();
		this.setLibrary();
		this.setBiography();
		this.setLyrics();
		this.setSettings();
		this.setSettingsNotInConfig();

		// * Set variable imgBlended when switching from default settings to config settings that has style Blend or Blend2 activated
		this.setStyleBlend();

		// * Reinitialize theme presets when user has reset style settings by clicking on "Default" and reloading the config file
		grm.preset.initThemePresetState();

		// * Reinitialize the saved player size
		grm.display.initPlayerSize();

		grm.ui.libraryCanReload = true;
	}

	/**
	 * Sets theme settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setTheme() {
		this._setSetting(grSet, 'theme', grCfg.theme, 'theme', 'reborn');
		this._setSetting(grSet, 'theme_day', grCfg.theme, 'theme_day', 'white');
		this._setSetting(grSet, 'theme_night', grCfg.theme, 'theme_night', 'black');
	}

	/**
	 * Sets style settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setStyle() {
		this._setSetting(grSet, 'styleDefault', grCfg.style, 'default', true);
		this._setSetting(grSet, 'styleNighttime', grCfg.style, 'nighttime', false);
		this._setSetting(grSet, 'styleBevel', grCfg.style, 'bevel', false);
		this._setSetting(grSet, 'styleBlend', grCfg.style, 'blend', false);
		this._setSetting(grSet, 'styleBlend2', grCfg.style, 'blend2', false);
		this._setSetting(grSet, 'styleGradient', grCfg.style, 'gradient', false);
		this._setSetting(grSet, 'styleGradient2', grCfg.style, 'gradient2', false);
		this._setSetting(grSet, 'styleAlternative', grCfg.style, 'alternative', false);
		this._setSetting(grSet, 'styleAlternative2', grCfg.style, 'alternative2', false);
		this._setSetting(grSet, 'styleBlackAndWhite', grCfg.style, 'blackAndWhite', false);
		this._setSetting(grSet, 'styleBlackAndWhite2', grCfg.style, 'blackAndWhite2', false);
		this._setSetting(grSet, 'styleBlackAndWhiteReborn', grCfg.style, 'blackAndWhiteReborn', false);
		this._setSetting(grSet, 'styleBlackReborn', grCfg.style, 'blackReborn', false);
		this._setSetting(grSet, 'styleRebornWhite', grCfg.style, 'rebornWhite', false);
		this._setSetting(grSet, 'styleRebornBlack', grCfg.style, 'rebornBlack', false);
		this._setSetting(grSet, 'styleRebornFusion', grCfg.style, 'rebornFusion', false);
		this._setSetting(grSet, 'styleRebornFusion2', grCfg.style, 'rebornFusion2', false);
		this._setSetting(grSet, 'styleRebornFusionAccent', grCfg.style, 'rebornFusionAccent', false);
		this._setSetting(grSet, 'styleRandomPastel', grCfg.style, 'randomPastel', false);
		this._setSetting(grSet, 'styleRandomDark', grCfg.style, 'randomDark', false);
		this._setSetting(grSet, 'styleRandomAutoColor', grCfg.style, 'randomAutoColor', 'off');
		this._setSetting(grSet, 'styleTopMenuButtons', grCfg.style, 'topMenuButtons', 'default');
		this._setSetting(grSet, 'styleTransportButtons', grCfg.style, 'transportButtons', 'default');
		this._setSetting(grSet, 'styleProgressBarDesign', grCfg.style, 'progressBarDesign', 'default');
		this._setSetting(grSet, 'styleProgressBar', grCfg.style, 'progressBar', 'default');
		this._setSetting(grSet, 'styleProgressBarFill', grCfg.style, 'progressBarFill', 'default');
		this._setSetting(grSet, 'styleVolumeBarDesign', grCfg.style, 'volumeBarDesign', 'default');
		this._setSetting(grSet, 'styleVolumeBar', grCfg.style, 'volumeBar', 'default');
		this._setSetting(grSet, 'styleVolumeBarFill', grCfg.style, 'volumeBarFill', 'default');
		this._setSetting(grSet, 'styleNighttime_day', grCfg.style, 'nighttime_day', false);
		this._setSetting(grSet, 'styleBevel_day', grCfg.style, 'bevel_day', false);
		this._setSetting(grSet, 'styleBlend_day', grCfg.style, 'blend_day', false);
		this._setSetting(grSet, 'styleBlend2_day', grCfg.style, 'blend2_day', false);
		this._setSetting(grSet, 'styleGradient_day', grCfg.style, 'gradient_day', false);
		this._setSetting(grSet, 'styleGradient2_day', grCfg.style, 'gradient2_day', false);
		this._setSetting(grSet, 'styleAlternative_day', grCfg.style, 'alternative_day', false);
		this._setSetting(grSet, 'styleAlternative2_day', grCfg.style, 'alternative2_day', false);
		this._setSetting(grSet, 'styleBlackAndWhite_day', grCfg.style, 'blackAndWhite_day', false);
		this._setSetting(grSet, 'styleBlackAndWhite2_day', grCfg.style, 'blackAndWhite2_day', false);
		this._setSetting(grSet, 'styleBlackAndWhiteReborn_day', grCfg.style, 'blackAndWhiteReborn_day', false);
		this._setSetting(grSet, 'styleBlackReborn_day', grCfg.style, 'blackReborn_day', false);
		this._setSetting(grSet, 'styleRebornWhite_day', grCfg.style, 'rebornWhite_day', false);
		this._setSetting(grSet, 'styleRebornBlack_day', grCfg.style, 'rebornBlack_day', false);
		this._setSetting(grSet, 'styleRebornFusion_day', grCfg.style, 'rebornFusion_day', false);
		this._setSetting(grSet, 'styleRebornFusion2_day', grCfg.style, 'rebornFusion2_day', false);
		this._setSetting(grSet, 'styleRebornFusionAccent_day', grCfg.style, 'rebornFusionAccent_day', false);
		this._setSetting(grSet, 'styleRandomPastel_day', grCfg.style, 'randomPastel_day', false);
		this._setSetting(grSet, 'styleRandomDark_day', grCfg.style, 'randomDark_day', false);
		this._setSetting(grSet, 'styleRandomAutoColor_day', grCfg.style, 'randomAutoColor_day', 'off');
		this._setSetting(grSet, 'styleTopMenuButtons_day', grCfg.style, 'topMenuButtons_day', 'default');
		this._setSetting(grSet, 'styleTransportButtons_day', grCfg.style, 'transportButtons_day', 'default');
		this._setSetting(grSet, 'styleProgressBarDesign_day', grCfg.style, 'progressBarDesign_day', 'default');
		this._setSetting(grSet, 'styleProgressBar_day', grCfg.style, 'progressBar_day', 'default');
		this._setSetting(grSet, 'styleProgressBarFill_day', grCfg.style, 'progressBarFill_day', 'default');
		this._setSetting(grSet, 'styleVolumeBarDesign_day', grCfg.style, 'volumeBarDesign_day', 'default');
		this._setSetting(grSet, 'styleVolumeBar_day', grCfg.style, 'volumeBar_day', 'default');
		this._setSetting(grSet, 'styleVolumeBarFill_day', grCfg.style, 'volumeBarFill_day', 'default');
		this._setSetting(grSet, 'styleNighttime_night', grCfg.style, 'nighttime_night', false);
		this._setSetting(grSet, 'styleBevel_night', grCfg.style, 'bevel_night', false);
		this._setSetting(grSet, 'styleBlend_night', grCfg.style, 'blend_night', false);
		this._setSetting(grSet, 'styleBlend2_night', grCfg.style, 'blend2_night', false);
		this._setSetting(grSet, 'styleGradient_night', grCfg.style, 'gradient_night', false);
		this._setSetting(grSet, 'styleGradient2_night', grCfg.style, 'gradient2_night', false);
		this._setSetting(grSet, 'styleAlternative_night', grCfg.style, 'alternative_night', false);
		this._setSetting(grSet, 'styleAlternative2_night', grCfg.style, 'alternative2_night', false);
		this._setSetting(grSet, 'styleBlackAndWhite_night', grCfg.style, 'blackAndWhite_night', false);
		this._setSetting(grSet, 'styleBlackAndWhite2_night', grCfg.style, 'blackAndWhite2_night', false);
		this._setSetting(grSet, 'styleBlackAndWhiteReborn_night', grCfg.style, 'blackAndWhiteReborn_night', false);
		this._setSetting(grSet, 'styleBlackReborn_night', grCfg.style, 'blackReborn_night', false);
		this._setSetting(grSet, 'styleRebornWhite_night', grCfg.style, 'rebornWhite_night', false);
		this._setSetting(grSet, 'styleRebornBlack_night', grCfg.style, 'rebornBlack_night', false);
		this._setSetting(grSet, 'styleRebornFusion_night', grCfg.style, 'rebornFusion_night', false);
		this._setSetting(grSet, 'styleRebornFusion2_night', grCfg.style, 'rebornFusion2_night', false);
		this._setSetting(grSet, 'styleRebornFusionAccent_night', grCfg.style, 'rebornFusionAccent_night', false);
		this._setSetting(grSet, 'styleRandomPastel_night', grCfg.style, 'randomPastel_night', false);
		this._setSetting(grSet, 'styleRandomDark_night', grCfg.style, 'randomDark_night', false);
		this._setSetting(grSet, 'styleRandomAutoColor_night', grCfg.style, 'randomAutoColor_night', 'off');
		this._setSetting(grSet, 'styleTopMenuButtons_night', grCfg.style, 'topMenuButtons_night', 'default');
		this._setSetting(grSet, 'styleTransportButtons_night', grCfg.style, 'transportButtons_night', 'default');
		this._setSetting(grSet, 'styleProgressBarDesign_night', grCfg.style, 'progressBarDesign_night', 'default');
		this._setSetting(grSet, 'styleProgressBar_night', grCfg.style, 'progressBar_night', 'default');
		this._setSetting(grSet, 'styleProgressBarFill_night', grCfg.style, 'progressBarFill_night', 'default');
		this._setSetting(grSet, 'styleVolumeBarDesign_night', grCfg.style, 'volumeBarDesign_night', 'default');
		this._setSetting(grSet, 'styleVolumeBar_night', grCfg.style, 'volumeBar_night', 'default');
		this._setSetting(grSet, 'styleVolumeBarFill_night', grCfg.style, 'volumeBarFill_night', 'default');
	}

	/**
	 * Sets preset settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setPreset() {
		this._setSetting(grSet, 'presetSelectMode', grCfg.preset, 'selectMode', 'default');
		this._setSetting(grSet, 'presetSelectWhite', grCfg.preset, 'selectWhitePresets', true);
		this._setSetting(grSet, 'presetSelectBlack', grCfg.preset, 'selectBlackPresets', true);
		this._setSetting(grSet, 'presetSelectReborn', grCfg.preset, 'selectRebornPresets', true);
		this._setSetting(grSet, 'presetSelectRandom', grCfg.preset, 'selectRandomPresets', true);
		this._setSetting(grSet, 'presetSelectBlue', grCfg.preset, 'selectBluePresets', true);
		this._setSetting(grSet, 'presetSelectDarkblue', grCfg.preset, 'selectDarkbluePresets', true);
		this._setSetting(grSet, 'presetSelectRed', grCfg.preset, 'selectRedPresets', true);
		this._setSetting(grSet, 'presetSelectCream', grCfg.preset, 'selectCreamPresets', true);
		this._setSetting(grSet, 'presetSelectNblue', grCfg.preset, 'selectNbluePresets', true);
		this._setSetting(grSet, 'presetSelectNgreen', grCfg.preset, 'selectNgreenPresets', true);
		this._setSetting(grSet, 'presetSelectNred', grCfg.preset, 'selectNredPresets', true);
		this._setSetting(grSet, 'presetSelectNgold', grCfg.preset, 'selectNgoldPresets', true);
		this._setSetting(grSet, 'presetSelectCustom', grCfg.preset, 'selectCustomPresets', true);
		this._setSetting(grSet, 'presetAutoRandomMode', grCfg.preset, 'autoRandomMode', 'dblclick');
		this._setSetting(grSet, 'presetIndicator', grCfg.preset, 'indicator', true);
	}

	/**
	 * Sets player size settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setPlayerSize() {
		this._setSetting(grSet, 'playerSize', grCfg.themePlayerSize, 'playerSize', 'small');
		this._setSetting(grSet, 'savedWidth_default', grCfg.themePlayerSize, 'savedWidth_default', 1140);
		this._setSetting(grSet, 'savedHeight_default', grCfg.themePlayerSize, 'savedHeight_default', 730);
		this._setSetting(grSet, 'savedWidth_artwork', grCfg.themePlayerSize, 'savedWidth_artwork', 526);
		this._setSetting(grSet, 'savedHeight_artwork', grCfg.themePlayerSize, 'savedHeight_artwork', 686);
		this._setSetting(grSet, 'savedWidth_compact', grCfg.themePlayerSize, 'savedWidth_compact', 484);
		this._setSetting(grSet, 'savedHeight_compact', grCfg.themePlayerSize, 'savedHeight_compact', 730);

		// ! System settings not configurable
		grSet.playerSize_4K_small = false;
		grSet.playerSize_4K_normal = false;
		grSet.playerSize_4K_large = false;
		grSet.playerSize_QHD_small = false;
		grSet.playerSize_QHD_normal = false;
		grSet.playerSize_QHD_large = false;
		grSet.playerSize_HD_small = false;
		grSet.playerSize_HD_normal = false;
		grSet.playerSize_HD_large = false;
	}

	/**
	 * Sets layout settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setLayout() {
		this._setSetting(grSet, 'layout', grCfg.themeLayout, 'layout', 'default');
	}

	/**
	 * Sets display settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setDisplay() {
		this._setSetting(grSet, 'displayRes', grCfg.themeDisplay, 'resolution', 'HD');
	}

	/**
	 * Sets brightness settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setBrightness() {
		this._setSetting(grSet, 'themeBrightness', grCfg.themeBrightness, 'themeBrightness', 'default');
		this._setSetting(grSet, 'themeBrightness_day', grCfg.themeBrightness, 'themeBrightness_day', 'default');
		this._setSetting(grSet, 'themeBrightness_night', grCfg.themeBrightness, 'themeBrightness_night', 'default');
	}

	/**
	 * Sets font size settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setFontSize() {
		this._setSetting(grSet, 'menuFontSize_default', grCfg.themeFontSize, 'menuFontSize_default', RES._QHD ? 14 : 12);
		this._setSetting(grSet, 'menuFontSize_artwork', grCfg.themeFontSize, 'menuFontSize_artwork', RES._QHD ? 14 : 12);
		this._setSetting(grSet, 'menuFontSize_compact', grCfg.themeFontSize, 'menuFontSize_compact', RES._QHD ? 14 : 12);
		this._setSetting(grSet, 'lowerBarFontSize_default', grCfg.themeFontSize, 'lowerBarFontSize_default', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'lowerBarFontSize_artwork', grCfg.themeFontSize, 'lowerBarFontSize_artwork', RES._QHD ? 18 : 16);
		this._setSetting(grSet, 'lowerBarFontSize_compact', grCfg.themeFontSize, 'lowerBarFontSize_compact', RES._QHD ? 18 : 16);
		this._setSetting(grSet, 'notificationFontSize_default', grCfg.themeFontSize, 'notificationFontSize_default', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'notificationFontSize_artwork', grCfg.themeFontSize, 'notificationFontSize_artwork', RES._QHD ? 18 : 16);
		this._setSetting(grSet, 'notificationFontSize_compact', grCfg.themeFontSize, 'notificationFontSize_compact', RES._QHD ? 18 : 16);
		this._setSetting(grSet, 'popupFontSize_default', grCfg.themeFontSize, 'popupFontSize_default', RES._QHD ? 18 : 16);
		this._setSetting(grSet, 'popupFontSize_artwork', grCfg.themeFontSize, 'popupFontSize_artwork', RES._QHD ? 16 : 14);
		this._setSetting(grSet, 'popupFontSize_compact', grCfg.themeFontSize, 'popupFontSize_compact', RES._QHD ? 16 : 14);
		this._setSetting(grSet, 'tooltipFontSize_default', grCfg.themeFontSize, 'tooltipFontSize_default', RES._QHD ? 18 : 16);
		this._setSetting(grSet, 'tooltipFontSize_artwork', grCfg.themeFontSize, 'tooltipFontSize_artwork', RES._QHD ? 16 : 14);
		this._setSetting(grSet, 'tooltipFontSize_compact', grCfg.themeFontSize, 'tooltipFontSize_compact', RES._QHD ? 16 : 14);
		this._setSetting(grSet, 'gridArtistFontSize_default', grCfg.themeFontSize, 'gridArtistFontSize_default', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridArtistFontSize_artwork', grCfg.themeFontSize, 'gridArtistFontSize_artwork', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridTrackNumFontSize_default', grCfg.themeFontSize, 'gridTrackNumFontSize_default', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridTrackNumFontSize_artwork', grCfg.themeFontSize, 'gridTrackNumFontSize_artwork', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridTitleFontSize_default', grCfg.themeFontSize, 'gridTitleFontSize_default', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridTitleFontSize_artwork', grCfg.themeFontSize, 'gridTitleFontSize_artwork', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridAlbumFontSize_default', grCfg.themeFontSize, 'gridAlbumFontSize_default', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridAlbumFontSize_artwork', grCfg.themeFontSize, 'gridAlbumFontSize_artwork', RES._QHD ? 20 : 18);
		this._setSetting(grSet, 'gridKeyFontSize_default', grCfg.themeFontSize, 'gridKeyFontSize_default', RES._QHD ? 19 : 17);
		this._setSetting(grSet, 'gridKeyFontSize_artwork', grCfg.themeFontSize, 'gridKeyFontSize_artwork', RES._QHD ? 19 : 17);
		this._setSetting(grSet, 'gridValueFontSize_default', grCfg.themeFontSize, 'gridValueFontSize_default', RES._QHD ? 19 : 17);
		this._setSetting(grSet, 'gridValueFontSize_artwork', grCfg.themeFontSize, 'gridValueFontSize_artwork', RES._QHD ? 19 : 17);
		this._setSetting(grSet, 'playlistHeaderFontSize_default', grCfg.themeFontSize, 'playlistHeaderFontSize_default', RES._QHD ? 17 : 15);
		this._setSetting(grSet, 'playlistHeaderFontSize_artwork', grCfg.themeFontSize, 'playlistHeaderFontSize_artwork', RES._QHD ? 17 : 15);
		this._setSetting(grSet, 'playlistHeaderFontSize_compact', grCfg.themeFontSize, 'playlistHeaderFontSize_compact', RES._QHD ? 17 : 15);
		this._setSetting(grSet, 'playlistFontSize_default', grCfg.themeFontSize, 'playlistFontSize_default', RES._QHD ? 14 : 12);
		this._setSetting(grSet, 'playlistFontSize_artwork', grCfg.themeFontSize, 'playlistFontSize_artwork', RES._QHD ? 14 : 12);
		this._setSetting(grSet, 'playlistFontSize_compact', grCfg.themeFontSize, 'playlistFontSize_compact', RES._QHD ? 14 : 12);
		this._setSetting(libSet, 'baseFontSize_default', grCfg.themeFontSize, 'libraryFontSize_default', RES._4K ? 24 : RES._QHD ? 14 : 12);
		this._setSetting(libSet, 'baseFontSize_artwork', grCfg.themeFontSize, 'libraryFontSize_artwork', RES._4K ? 24 : RES._QHD ? 14 : 12);
		this._setSetting(bioSet, 'baseFontSizeBio_default', grCfg.themeFontSize, 'biographyFontSize_default', RES._4K ? 24 : RES._QHD ? 14 : 12);
		this._setSetting(bioSet, 'baseFontSizeBio_artwork', grCfg.themeFontSize, 'biographyFontSize_artwork', RES._4K ? 24 : RES._QHD ? 14 : 12);
		this._setSetting(grSet, 'lyricsFontSize_default', grCfg.themeFontSize, 'lyricsFontSize_default', RES._QHD ? 22 : 20);
		this._setSetting(grSet, 'lyricsFontSize_artwork', grCfg.themeFontSize, 'lyricsFontSize_artwork', RES._QHD ? 22 : 20);
	}

	/**
	 * Sets player controls settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setPlayerControls() {
		// * Special cases
		if (this.saveCfg) {
			grCfg.themeControls.waveformBarPrepaintFront = grSet.waveformBarPrepaintFront === Infinity ? 'Infinity' : grSet.waveformBarPrepaintFront;
		} else {
			grSet.waveformBarPrepaintFront = this.loadCfg ? grCfg.themeControls.waveformBarPrepaintFront : false; // ! Do not use Infinity here, set to false has same effect
		}

		this._setSetting(grSet, 'showPanelDetails_default', grCfg.themeControls, 'showPanelDetails_default', true);
		this._setSetting(grSet, 'showPanelDetails_artwork', grCfg.themeControls, 'showPanelDetails_artwork', true);
		this._setSetting(grSet, 'showPanelLibrary_default', grCfg.themeControls, 'showPanelLibrary_default', true);
		this._setSetting(grSet, 'showPanelLibrary_artwork', grCfg.themeControls, 'showPanelLibrary_artwork', true);
		this._setSetting(grSet, 'showPanelBiography_default', grCfg.themeControls, 'showPanelBiography_default', true);
		this._setSetting(grSet, 'showPanelBiography_artwork', grCfg.themeControls, 'showPanelBiography_artwork', true);
		this._setSetting(grSet, 'showPanelLyrics_default', grCfg.themeControls, 'showPanelLyrics_default', true);
		this._setSetting(grSet, 'showPanelLyrics_artwork', grCfg.themeControls, 'showPanelLyrics_artwork', true);
		this._setSetting(grSet, 'showPanelRating_default', grCfg.themeControls, 'showPanelRating_default', true);
		this._setSetting(grSet, 'showPanelRating_artwork', grCfg.themeControls, 'showPanelRating_artwork', true);
		this._setSetting(grSet, 'topMenuAlignment', grCfg.themeControls, 'topMenuAlignment', 'center');
		this._setSetting(grSet, 'topMenuCompact', grCfg.themeControls, 'topMenuCompact', true);
		this._setSetting(grSet, 'albumArtAlign', grCfg.themeControls, 'albumArtAlign', 'right');
		this._setSetting(grSet, 'albumArtBg', grCfg.themeControls, 'albumArtBg', 'left');
		this._setSetting(grSet, 'albumArtScale', grCfg.themeControls, 'albumArtScale', 'cropped');
		this._setSetting(grSet, 'albumArtAspectRatioLimit', grCfg.themeControls, 'albumArtAspectRatioLimit', true);
		this._setSetting(grSet, 'cycleArt', grCfg.themeControls, 'cycleArt', false);
		this._setSetting(grSet, 'cycleArtMWheel', grCfg.themeControls, 'cycleArtMWheel', true);
		this._setSetting(grSet, 'loadEmbeddedAlbumArtFirst', grCfg.themeControls, 'loadEmbeddedAlbumArtFirst', false);
		this._setSetting(grSet, 'showHiResAudioBadge', grCfg.themeControls, 'showHiResAudioBadge', false);
		this._setSetting(grSet, 'hiResAudioBadgeRound', grCfg.themeControls, 'hiResAudioBadgeRound', false);
		this._setSetting(grSet, 'hiResAudioBadgeSize', grCfg.themeControls, 'hiResAudioBadgeSize', 'normal');
		this._setSetting(grSet, 'hiResAudioBadgePos', grCfg.themeControls, 'hiResAudioBadgePos', 'bottomright');
		this._setSetting(grSet, 'showPause', grCfg.themeControls, 'showPause', true);
		this._setSetting(grSet, 'jumpSearchIncludeLibrary', grCfg.themeControls, 'jumpSearchIncludeLibrary', true);
		this._setSetting(grSet, 'jumpSearchIncludePlaylist', grCfg.themeControls, 'jumpSearchIncludePlaylist', true);
		this._setSetting(grSet, 'jumpSearchComposerOnly', grCfg.themeControls, 'jumpSearchComposerOnly', false);
		this._setSetting(grSet, 'jumpSearchDisabled', grCfg.themeControls, 'jumpSearchDisabled', false);
		this._setSetting(grSet, 'playlistWheelScrollSteps', grCfg.themeControls, 'playlistWheelScrollSteps', 3);
		this._setSetting(grSet, 'playlistWheelScrollDuration', grCfg.themeControls, 'playlistWheelScrollDuration', 300);
		this._setSetting(grSet, 'playlistAutoScrollNowPlaying', grCfg.themeControls, 'playlistAutoScrollNowPlaying', false);
		this._setSetting(grSet, 'playlistAutoHideScrollbar', grCfg.themeControls, 'playlistAutoHideScrollbar', true);
		this._setSetting(grSet, 'playlistSmoothScrolling', grCfg.themeControls, 'playlistSmoothScrolling', true);
		this._setSetting(libSet, 'scrollStep', grCfg.themeControls, 'scrollStepLib', 3);
		this._setSetting(libSet, 'durationScroll', grCfg.themeControls, 'durationScrollLib', 500);
		this._setSetting(grSet, 'libraryAutoScrollNowPlaying', grCfg.themeControls, 'libraryAutoScrollNowPlaying', false);
		this._setSetting(grSet, 'libraryAutoHideScrollbar', grCfg.themeControls, 'libraryAutoHideScrollbar', true);
		this._setSetting(libSet, 'sbarShow', false, false, grSet.libraryAutoHideScrollbar ? 1 : 2);
		this._setSetting(libSet, 'smooth', grCfg.themeControls, 'smoothLib', true);
		this._setSetting(bioSet, 'scrollStep', grCfg.themeControls, 'scrollStepBio', 3);
		this._setSetting(bioSet, 'durationScroll', grCfg.themeControls, 'durationScrollBio', 500);
		this._setSetting(grSet, 'biographyAutoHideScrollbar', grCfg.themeControls, 'biographyAutoHideScrollbar', true);
		this._setSetting(bioSet, 'sbarShow', false, false, grSet.biographyAutoHideScrollbar ? 1 : 2);
		this._setSetting(bioSet, 'smooth', grCfg.themeControls, 'smoothBio', true);
		this._setSetting(grSet, 'showTooltipTruncated', grCfg.themeControls, 'showTooltipTruncated', true);
		this._setSetting(grSet, 'showTooltipTimeline', grCfg.themeControls, 'showTooltipTimeline', true);
		this._setSetting(grSet, 'showTooltipVolume', grCfg.themeControls, 'showTooltipVolume', false);
		this._setSetting(grSet, 'showTooltipVolumeInPercent', grCfg.themeControls, 'showTooltipVolumeInPercent', false);
		this._setSetting(grSet, 'showTooltipMain', grCfg.themeControls, 'showTooltipMain', false);
		this._setSetting(grSet, 'showTooltipLibrary', grCfg.themeControls, 'showTooltipLibrary', false);
		this._setSetting(grSet, 'showTooltipBiography', grCfg.themeControls, 'showTooltipBiography', false);
		this._setSetting(grSet, 'showStyledTooltips', grCfg.themeControls, 'showStyledTooltips', true);
		this._setSetting(grSet, 'panelWidthAuto', grCfg.themeControls, 'panelWidthAuto', false);
		this._setSetting(grSet, 'showPanelOnStartup', grCfg.themeControls, 'showPanelOnStartup', 'playlist');
		this._setSetting(grSet, 'showPreloaderLogo', grCfg.themeControls, 'showPreloaderLogo', true);
		this._setSetting(grSet, 'returnToHomeOnPlaybackStop', grCfg.themeControls, 'returnToHomeOnPlaybackStop', true);
		this._setSetting(grSet, 'addTracksPlaylistSwitch', grCfg.themeControls, 'addTracksPlaylistSwitch', false);
		this._setSetting(grSet, 'hideMiddlePanelShadow', grCfg.themeControls, 'hideMiddlePanelShadow', false);
		this._setSetting(grSet, 'fullscreenESCDisabled', grCfg.themeControls, 'fullscreenESCDisabled', false);
		this._setSetting(grSet, 'fullscreenMaximize', grCfg.themeControls, 'fullscreenMaximize', true);
		this._setSetting(grSet, 'lockPlayerSize', grCfg.themeControls, 'lockPlayerSize', false);
		this._setSetting(grSet, 'transportButtonSize_default', grCfg.themeControls, 'transportButtonSize_default', 32);
		this._setSetting(grSet, 'transportButtonSize_artwork', grCfg.themeControls, 'transportButtonSize_artwork', 32);
		this._setSetting(grSet, 'transportButtonSize_compact', grCfg.themeControls, 'transportButtonSize_compact', 32);
		this._setSetting(grSet, 'transportButtonSpacing_default', grCfg.themeControls, 'transportButtonSpacing_default', 5);
		this._setSetting(grSet, 'transportButtonSpacing_artwork', grCfg.themeControls, 'transportButtonSpacing_artwork', 5);
		this._setSetting(grSet, 'transportButtonSpacing_compact', grCfg.themeControls, 'transportButtonSpacing_compact', 5);
		this._setSetting(grSet, 'showTransportControls_default', grCfg.themeControls, 'showTransportControls_default', true);
		this._setSetting(grSet, 'showTransportControls_artwork', grCfg.themeControls, 'showTransportControls_artwork', true);
		this._setSetting(grSet, 'showTransportControls_compact', grCfg.themeControls, 'showTransportControls_compact', true);
		this._setSetting(grSet, 'showPlaybackOrderBtn_default', grCfg.themeControls, 'showPlaybackOrderBtn_default', true);
		this._setSetting(grSet, 'showPlaybackOrderBtn_artwork', grCfg.themeControls, 'showPlaybackOrderBtn_artwork', true);
		this._setSetting(grSet, 'showPlaybackOrderBtn_compact', grCfg.themeControls, 'showPlaybackOrderBtn_compact', true);
		this._setSetting(grSet, 'showReloadBtn_default', grCfg.themeControls, 'showReloadBtn_default', false);
		this._setSetting(grSet, 'showReloadBtn_artwork', grCfg.themeControls, 'showReloadBtn_artwork', false);
		this._setSetting(grSet, 'showReloadBtn_compact', grCfg.themeControls, 'showReloadBtn_compact', false);
		this._setSetting(grSet, 'showAddTracksBtn_default', grCfg.themeControls, 'showAddTracksBtn_default', false);
		this._setSetting(grSet, 'showAddTracksBtn_artwork', grCfg.themeControls, 'showAddTracksBtn_artwork', false);
		this._setSetting(grSet, 'showAddTracksBtn_compact', grCfg.themeControls, 'showAddTracksBtn_compact', false);
		this._setSetting(grSet, 'showVolumeBtn_default', grCfg.themeControls, 'showVolumeBtn_default', true);
		this._setSetting(grSet, 'showVolumeBtn_artwork', grCfg.themeControls, 'showVolumeBtn_artwork', true);
		this._setSetting(grSet, 'showVolumeBtn_compact', grCfg.themeControls, 'showVolumeBtn_compact', true);
		this._setSetting(grSet, 'autoHideVolumeBar', grCfg.themeControls, 'autoHideVolumeBar', true);
		this._setSetting(grSet, 'showPlaybackTime_default', grCfg.themeControls, 'showPlaybackTime_default', true);
		this._setSetting(grSet, 'showPlaybackTime_artwork', grCfg.themeControls, 'showPlaybackTime_artwork', true);
		this._setSetting(grSet, 'showPlaybackTime_compact', grCfg.themeControls, 'showPlaybackTime_compact', true);
		this._setSetting(grSet, 'showLowerBarArtist_default', grCfg.themeControls, 'showLowerBarArtist_default', true);
		this._setSetting(grSet, 'showLowerBarArtist_artwork', grCfg.themeControls, 'showLowerBarArtist_artwork', true);
		this._setSetting(grSet, 'showLowerBarArtist_compact', grCfg.themeControls, 'showLowerBarArtist_compact', true);
		this._setSetting(grSet, 'showLowerBarTrackNum_default', grCfg.themeControls, 'showLowerBarTrackNum_default', true);
		this._setSetting(grSet, 'showLowerBarTrackNum_artwork', grCfg.themeControls, 'showLowerBarTrackNum_artwork', true);
		this._setSetting(grSet, 'showLowerBarTrackNum_compact', grCfg.themeControls, 'showLowerBarTrackNum_compact', true);
		this._setSetting(grSet, 'showLowerBarTitle_default', grCfg.themeControls, 'showLowerBarTitle_default', true);
		this._setSetting(grSet, 'showLowerBarTitle_artwork', grCfg.themeControls, 'showLowerBarTitle_artwork', true);
		this._setSetting(grSet, 'showLowerBarTitle_compact', grCfg.themeControls, 'showLowerBarTitle_compact', true);
		this._setSetting(grSet, 'showLowerBarComposer_default', grCfg.themeControls, 'showLowerBarComposer_default', false);
		this._setSetting(grSet, 'showLowerBarComposer_artwork', grCfg.themeControls, 'showLowerBarComposer_artwork', false);
		this._setSetting(grSet, 'showLowerBarComposer_compact', grCfg.themeControls, 'showLowerBarComposer_compact', false);
		this._setSetting(grSet, 'showLowerBarArtistFlags_default', grCfg.themeControls, 'showLowerBarArtistFlags_default', true);
		this._setSetting(grSet, 'showLowerBarArtistFlags_artwork', grCfg.themeControls, 'showLowerBarArtistFlags_artwork', true);
		this._setSetting(grSet, 'showLowerBarArtistFlags_compact', grCfg.themeControls, 'showLowerBarArtistFlags_compact', true);
		this._setSetting(grSet, 'showLowerBarVersion_default', grCfg.themeControls, 'showLowerBarVersion_default', true);
		this._setSetting(grSet, 'showLowerBarVersion_artwork', grCfg.themeControls, 'showLowerBarVersion_artwork', true);
		this._setSetting(grSet, 'showLowerBarVersion_compact', grCfg.themeControls, 'showLowerBarVersion_compact', true);
		this._setSetting(grSet, 'showProgressBar_default', grCfg.themeControls, 'showProgressBar_default', true);
		this._setSetting(grSet, 'showProgressBar_artwork', grCfg.themeControls, 'showProgressBar_artwork', true);
		this._setSetting(grSet, 'showProgressBar_compact', grCfg.themeControls, 'showProgressBar_compact', true);
		this._setSetting(grSet, 'showPeakmeterBar_default', grCfg.themeControls, 'showPeakmeterBar_default', true);
		this._setSetting(grSet, 'showPeakmeterBar_artwork', grCfg.themeControls, 'showPeakmeterBar_artwork', true);
		this._setSetting(grSet, 'showPeakmeterBar_compact', grCfg.themeControls, 'showPeakmeterBar_compact', true);
		this._setSetting(grSet, 'showWaveformBar_default', grCfg.themeControls, 'showWaveformBar_default', true);
		this._setSetting(grSet, 'showWaveformBar_artwork', grCfg.themeControls, 'showWaveformBar_artwork', true);
		this._setSetting(grSet, 'showWaveformBar_compact', grCfg.themeControls, 'showWaveformBar_compact', true);
		this._setSetting(grSet, 'addTracksPlaylist', grCfg.themeControls, 'addTracksPlaylist', 'Favorites');
		this._setSetting(grSet, 'seekbar', grCfg.themeControls, 'seekbar', 'progressbar');
		this._setSetting(grSet, 'progressBarWheelSeekSpeed', grCfg.themeControls, 'progressBarWheelSeekSpeed', 5);
		this._setSetting(grSet, 'progressBarRefreshRate', grCfg.themeControls, 'progressBarRefreshRate', 'variable');
		this._setSetting(grSet, 'peakmeterBarDesign', grCfg.themeControls, 'peakmeterBarDesign', 'horizontal');
		this._setSetting(grSet, 'peakmeterBarVertSize', grCfg.themeControls, 'peakmeterBarVertSize', 20);
		this._setSetting(grSet, 'peakmeterBarVertDbRange', grCfg.themeControls, 'peakmeterBarVertDbRange', 220);
		this._setSetting(grSet, 'peakmeterBarOverBars', grCfg.themeControls, 'peakmeterBarOverBars', true);
		this._setSetting(grSet, 'peakmeterBarOuterBars', grCfg.themeControls, 'peakmeterBarOuterBars', true);
		this._setSetting(grSet, 'peakmeterBarOuterPeaks', grCfg.themeControls, 'peakmeterBarOuterPeaks', true);
		this._setSetting(grSet, 'peakmeterBarMainBars', grCfg.themeControls, 'peakmeterBarMainBars', true);
		this._setSetting(grSet, 'peakmeterBarMainPeaks', grCfg.themeControls, 'peakmeterBarMainPeaks', true);
		this._setSetting(grSet, 'peakmeterBarMiddleBars', grCfg.themeControls, 'peakmeterBarMiddleBars', true);
		this._setSetting(grSet, 'peakmeterBarProgBar', grCfg.themeControls, 'peakmeterBarProgBar', true);
		this._setSetting(grSet, 'peakmeterBarGaps', grCfg.themeControls, 'peakmeterBarGaps', false);
		this._setSetting(grSet, 'peakmeterBarGrid', grCfg.themeControls, 'peakmeterBarGrid', false);
		this._setSetting(grSet, 'peakmeterBarInfo', grCfg.themeControls, 'peakmeterBarInfo', false);
		this._setSetting(grSet, 'peakmeterBarVertPeaks', grCfg.themeControls, 'peakmeterBarVertPeaks', true);
		this._setSetting(grSet, 'peakmeterBarVertBaseline', grCfg.themeControls, 'peakmeterBarVertBaseline', true);
		this._setSetting(grSet, 'peakmeterBarRefreshRate', grCfg.themeControls, 'peakmeterBarRefreshRate', 80);
		this._setSetting(grSet, 'waveformBarMode', grCfg.themeControls, 'waveformBarMode', 'audiowaveform');
		this._setSetting(grSet, 'waveformBarAnalysis', grCfg.themeControls, 'waveformBarAnalysis', 'rms_level');
		this._setSetting(grSet, 'waveformBarDesign', grCfg.themeControls, 'waveformBarDesign', 'halfbars');
		this._setSetting(grSet, 'waveformBarSizeWave', grCfg.themeControls, 'waveformBarSizeWave', 3);
		this._setSetting(grSet, 'waveformBarSizeBars', grCfg.themeControls, 'waveformBarSizeBars', 1);
		this._setSetting(grSet, 'waveformBarSizeDots', grCfg.themeControls, 'waveformBarSizeDots', 2);
		this._setSetting(grSet, 'waveformBarSizeHalf', grCfg.themeControls, 'waveformBarSizeHalf', 4);
		this._setSetting(grSet, 'waveformBarSizeNormalize', grCfg.themeControls, 'waveformBarSizeNormalize', false);
		this._setSetting(grSet, 'waveformBarPaint', grCfg.themeControls, 'waveformBarPaint', 'partial');
		this._setSetting(grSet, 'waveformBarPrepaint', grCfg.themeControls, 'waveformBarPrepaint', true);
		this._setSetting(grSet, 'waveformBarAnimate', grCfg.themeControls, 'waveformBarAnimate', true);
		this._setSetting(grSet, 'waveformBarBPM', grCfg.themeControls, 'waveformBarBPM', true);
		this._setSetting(grSet, 'waveformBarInvertHalfbars', grCfg.themeControls, 'waveformBarInvertHalfbars', true);
		this._setSetting(grSet, 'waveformBarIndicator', grCfg.themeControls, 'waveformBarIndicator', false);
		this._setSetting(grSet, 'waveformBarRefreshRate', grCfg.themeControls, 'waveformBarRefreshRate', 200);
		this._setSetting(grSet, 'waveformBarRefreshRateVar', grCfg.themeControls, 'waveformBarRefreshRateVar', false);
		this._setSetting(grSet, 'switchPlaybackTime', grCfg.themeControls, 'switchPlaybackTime', false);
		this._setSetting(grSet, 'playbackOrder', grCfg.themeControls, 'playbackOrder', 'default');
	}

	/**
	 * Sets Playlist settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setPlaylist() {
		this._setSetting(grSet, 'playlistLayout', grCfg.themePlaylist, 'playlistLayout', 'normal');
		this._setSetting(grSet, 'playlistLayoutNormal', false, false, true);
		this._setSetting(grSet, 'showPlaylistManager_default', grCfg.themePlaylist, 'showPlaylistManager_default', true);
		this._setSetting(grSet, 'showPlaylistManager_artwork', grCfg.themePlaylist, 'showPlaylistManager_artwork', false);
		this._setSetting(grSet, 'showPlaylistManager_compact', grCfg.themePlaylist, 'showPlaylistManager_compact', false);
		this._setSetting(grSet, 'showPlaylistHistory', grCfg.themePlaylist, 'showPlaylistHistory', true);
		this._setSetting(grSet, 'autoHidePlman', grCfg.themePlaylist, 'autoHidePlman', true);
		this._setSetting(plSet, 'show_album_art', grCfg.themePlaylist, 'show_album_art', true);
		this._setSetting(plSet, 'auto_album_art', grCfg.themePlaylist, 'auto_album_art', false);
		this._setSetting(plSet, 'show_header', grCfg.themePlaylist, 'show_header', true);
		this._setSetting(plSet, 'show_rating_header', grCfg.themePlaylist, 'show_rating_header', true);
		this._setSetting(plSet, 'show_PLR_header', grCfg.themePlaylist, 'show_PLR_header', false);
		this._setSetting(plSet, 'use_compact_header', grCfg.themePlaylist, 'use_compact_header', false);
		this._setSetting(plSet, 'auto_collapse', grCfg.themePlaylist, 'auto_collapse', false);
		this._setSetting(grSet, 'hyperlinksCtrlClick', grCfg.themePlaylist, 'hyperlinksCtrlClick', false);
		this._setSetting(plSet, 'show_disc_header', grCfg.themePlaylist, 'show_disc_header', true);
		this._setSetting(plSet, 'show_group_info', grCfg.themePlaylist, 'show_group_info', true);
		this._setSetting(grSet, 'showWeblinks', grCfg.themePlaylist, 'showWeblinks', true);
		this._setSetting(grSet, 'showPlaylistFullDate', grCfg.themePlaylist, 'showPlaylistFullDate', false);
		this._setSetting(plSet, 'show_row_stripes', grCfg.themePlaylist, 'show_row_stripes', false);
		this._setSetting(plSet, 'show_playcount', grCfg.themePlaylist, 'show_playcount', true);
		this._setSetting(plSet, 'show_queue_position', grCfg.themePlaylist, 'show_queue_position', true);
		this._setSetting(plSet, 'show_rating', grCfg.themePlaylist, 'show_rating', true);
		this._setSetting(plSet, 'use_rating_from_tags', grCfg.themePlaylist, 'use_rating_from_tags', false);
		this._setSetting(plSet, 'show_PLR', grCfg.themePlaylist, 'show_PLR', false);
		this._setSetting(grSet, 'showPlaylistRatingGrid', grCfg.themePlaylist, 'showPlaylistRatingGrid', false);
		this._setSetting(grSet, 'showPlaylistTrackNumbers', grCfg.themePlaylist, 'showPlaylistTrackNumbers', true);
		this._setSetting(grSet, 'showPlaylistIndexNumbers', grCfg.themePlaylist, 'showPlaylistIndexNumbers', false);
		this._setSetting(grSet, 'showDifferentArtist', grCfg.themePlaylist, 'showDifferentArtist', false);
		this._setSetting(grSet, 'showArtistPlaylistRows', grCfg.themePlaylist, 'showArtistPlaylistRows', false);
		this._setSetting(grSet, 'showAlbumPlaylistRows', grCfg.themePlaylist, 'showAlbumPlaylistRows', false);
		this._setSetting(grSet, 'playlistTimeRemaining', grCfg.themePlaylist, 'playlistTimeRemaining', false);
		this._setSetting(grSet, 'showVinylNums', grCfg.themePlaylist, 'showVinylNums', true);
		this._setSetting(grSet, 'lastFmScrobblesFallback', grCfg.themePlaylist, 'lastFmScrobblesFallback', true);
		this._setSetting(grSet, 'playlistRowHover', grCfg.themePlaylist, 'playlistRowHover', true);
		this._setSetting(grSet, 'playlistSortOrderAuto', grCfg.themePlaylist, 'playlistSortOrderAuto', false);
		this._setSetting(grSet, 'playlistSortOrder', grCfg.themePlaylist, 'playlistSortOrder', '');
		this._setSetting(grSet, 'playlistSortOrderDirection', grCfg.themePlaylist, 'playlistSortOrderDirection', '_asc');
		this._setSetting(plSet, 'playlist_stats_include_artist', grCfg.themePlaylist, 'playlist_stats_include_artist', true);
		this._setSetting(plSet, 'playlist_stats_include_album', grCfg.themePlaylist, 'playlist_stats_include_album', true);
		this._setSetting(plSet, 'playlist_stats_include_track', grCfg.themePlaylist, 'playlist_stats_include_track', true);
		this._setSetting(plSet, 'playlist_stats_include_year', grCfg.themePlaylist, 'playlist_stats_include_year', false);
		this._setSetting(plSet, 'playlist_stats_include_genre', grCfg.themePlaylist, 'playlist_stats_include_genre', false);
		this._setSetting(plSet, 'playlist_stats_include_label', grCfg.themePlaylist, 'playlist_stats_include_label', false);
		this._setSetting(plSet, 'playlist_stats_include_country', grCfg.themePlaylist, 'playlist_stats_include_country', false);
		this._setSetting(plSet, 'playlist_stats_include_stats', grCfg.themePlaylist, 'playlist_stats_include_stats', true);
		this._setSetting(plSet, 'playlist_stats_sort_by', grCfg.themePlaylist, 'playlist_stats_sort_by', '');
		this._setSetting(plSet, 'playlist_stats_sort_direction', grCfg.themePlaylist, 'playlist_stats_sort_direction', '_dsc');

		// ! System settings not configurable
		plSet.list_left_pad = 0;
		plSet.list_top_pad = 0;
		plSet.list_right_pad = 0;
		plSet.list_bottom_pad = 15;
		plSet.show_scrollbar = false;
		plSet.scrollbar_right_pad = 0;
		plSet.scrollbar_top_pad = 0;
		plSet.scrollbar_bottom_pad = 3;
		plSet.scrollbar_w = '';
		plSet.row_h = 20;
		plSet.scrollbar_pos = 0;
		plSet.scrollbar_wheel_scroll_page = false;
		plSet.rows_in_header = 4;
		plSet.rows_in_compact_header = 3;
		plSet.show_plman = true;
		plSet.collapse_on_playlist_switch = false;
		plSet.collapse_on_start = false;
	}

	/**
	 * Sets Details settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setDetails() {
		this._setSetting(grSet, 'showDiscArtStub', grCfg.themeDetails, 'showDiscArtStub', true);
		this._setSetting(grSet, 'noDiscArtStub', grCfg.themeDetails, 'noDiscArtStub', false);
		this._setSetting(grSet, 'discArtStub', grCfg.themeDetails, 'discArtStub', 'cdAlbumCover');
		this._setSetting(grSet, 'displayDiscArt', grCfg.themeDetails, 'displayDiscArt', true);
		this._setSetting(grSet, 'discArtOnTop', grCfg.themeDetails, 'discArtOnTop', false);
		this._setSetting(grSet, 'filterDiscJpgsFromAlbumArt', grCfg.themeDetails, 'filterDiscJpgsFromAlbumArt', true);
		this._setSetting(grSet, 'spinDiscArt', grCfg.themeDetails, 'spinDiscArt', false);
		this._setSetting(grSet, 'spinDiscArtImageCount', grCfg.themeDetails, 'spinDiscArtImageCount', 72);
		this._setSetting(grSet, 'spinDiscArtRedrawInterval', grCfg.themeDetails, 'spinDiscArtRedrawInterval', 75);
		this._setSetting(grSet, 'rotateDiscArt', grCfg.themeDetails, 'rotateDiscArt', true);
		this._setSetting(grSet, 'rotationAmt', grCfg.themeDetails, 'rotationAmt', 3);
		this._setSetting(grSet, 'artRotateDelay', grCfg.themeDetails, 'artRotateDelay', 30);
		this._setSetting(grSet, 'discArtDisplayAmount', grCfg.themeDetails, 'discArtDisplayAmount', 0.5);
		this._setSetting(grSet, 'detailsAlbumArtOpacity', grCfg.themeDetails, 'detailsAlbumArtOpacity', 255);
		this._setSetting(grSet, 'detailsAlbumArtDiscAreaOpacity', grCfg.themeDetails, 'detailsAlbumArtDiscAreaOpacity', 255);
		this._setSetting(grSet, 'showGridArtist_default', grCfg.themeDetails, 'showGridArtist_default', false);
		this._setSetting(grSet, 'showGridArtist_artwork', grCfg.themeDetails, 'showGridArtist_artwork', false);
		this._setSetting(grSet, 'showGridTrackNum_default', grCfg.themeDetails, 'showGridTrackNum_default', false);
		this._setSetting(grSet, 'showGridTrackNum_artwork', grCfg.themeDetails, 'showGridTrackNum_artwork', false);
		this._setSetting(grSet, 'showGridTitle_default', grCfg.themeDetails, 'showGridTitle_default', false);
		this._setSetting(grSet, 'showGridTitle_artwork', grCfg.themeDetails, 'showGridTitle_artwork', false);
		this._setSetting(grSet, 'showGridPlayingPlaylist', grCfg.themeDetails, 'showGridPlayingPlaylist', false);
		this._setSetting(grSet, 'showGridTimeline_default', grCfg.themeDetails, 'showGridTimeline_default', true);
		this._setSetting(grSet, 'showGridTimeline_artwork', grCfg.themeDetails, 'showGridTimeline_artwork', true);
		this._setSetting(grSet, 'showGridArtistFlags_default', grCfg.themeDetails, 'showGridArtistFlags_default', true);
		this._setSetting(grSet, 'showGridArtistFlags_artwork', grCfg.themeDetails, 'showGridArtistFlags_artwork', true);
		this._setSetting(grSet, 'showGridReleaseFlags_default', grCfg.themeDetails, 'showGridReleaseFlags_default', 'logo');
		this._setSetting(grSet, 'showGridReleaseFlags_artwork', grCfg.themeDetails, 'showGridReleaseFlags_artwork', 'logo');
		this._setSetting(grSet, 'showGridCodecLogo_default', grCfg.themeDetails, 'showGridCodecLogo_default', 'logo');
		this._setSetting(grSet, 'showGridCodecLogo_artwork', grCfg.themeDetails, 'showGridCodecLogo_artwork', 'logo');
		this._setSetting(grSet, 'showGridChannelLogo_default', grCfg.themeDetails, 'showGridChannelLogo_default', 'logo');
		this._setSetting(grSet, 'showGridChannelLogo_artwork', grCfg.themeDetails, 'showGridChannelLogo_artwork', 'logo');
		this._setSetting(grSet, 'autoHideGridMetadata', grCfg.themeDetails, 'autoHideGridMetadata', true);
		this._setSetting(grSet, 'noDiscArtBg', grCfg.themeDetails, 'noDiscArtBg', true);
		this._setSetting(grSet, 'labelArtOnBg', grCfg.themeDetails, 'labelArtOnBg', false);
	}

	/**
	 * Sets Library settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setLibrary() {
		this._setSetting(grSet, 'libraryDesign', grCfg.themeLibrary, 'libraryDesign', 'reborn');
		if (!this.saveCfg) grm.ui.setLibraryDesign();

		// * Special cases
		if (this.saveCfg) {
			grCfg.themeLibrary.libraryLayout = grSet.libraryLayout;
			grCfg.themeLibrary.libraryTheme = grSet.libraryTheme;
			grCfg.themeLibrary.librarySource = libSet.libSource;
			grCfg.themeLibrary.librarySourceFixedPlaylist = libSet.fixedPlaylist;
			grCfg.themeLibrary.librarySourceFixedPlaylistName = libSet.fixedPlaylistName;
		} else {
			grSet.libraryLayout = grSet.libraryDesign === 'flowMode' ? 'full' : this.loadCfg ? grCfg.themeLibrary.libraryLayout : 'normal';
			libSet.theme = grSet.libraryTheme = this.loadCfg ? grCfg.themeLibrary.libraryTheme : 0;
			grSet.libraryThumbnailSizeSaved = libSet.thumbNailSize = grSet.libraryThumbnailSize = this.loadCfg ? grCfg.themeLibrary.libraryThumbnailSize : 'auto';
			libSet.libSource = grSet.librarySource = this.loadCfg ? grCfg.themeLibrary.librarySource : 1;
			libSet.fixedPlaylist = grSet.librarySourceFixedPlaylist = this.loadCfg ? grCfg.themeLibrary.librarySourceFixedPlaylist : false;
			libSet.fixedPlaylistName = grSet.librarySourceFixedPlaylistName = this.loadCfg ? grCfg.themeLibrary.librarySourceFixedPlaylistName : '';
		}

		this._setSetting(grSet, 'libraryLayoutFullPreset', grCfg.themeLibrary, 'libraryLayoutFullPreset', true);
		this._setSetting(grSet, 'libraryLayoutSplitPreset', grCfg.themeLibrary, 'libraryLayoutSplitPreset', true);
		this._setSetting(grSet, 'libraryLayoutSplitPreset2', grCfg.themeLibrary, 'libraryLayoutSplitPreset2', false);
		this._setSetting(grSet, 'libraryLayoutSplitPreset3', grCfg.themeLibrary, 'libraryLayoutSplitPreset3', false);
		this._setSetting(grSet, 'libraryLayoutSplitPreset4', grCfg.themeLibrary, 'libraryLayoutSplitPreset4', false);
		this._setSetting(grSet, 'libraryThumbnailBorder', grCfg.themeLibrary, 'libraryThumbnailBorder', 'border');
		this._setSetting(libSet, 'albumArtShow', grCfg.themeLibrary, 'albumArtShow', false);
		this._setSetting(libSet, 'itemOverlayType', grCfg.themeLibrary, 'itemOverlayType', 0);
		this._setSetting(libSet, 'albumArtLetter', grCfg.themeLibrary, 'albumArtLetter', true);
		this._setSetting(libSet, 'albumArtLetterNo', grCfg.themeLibrary, 'albumArtLetterNo', 1);
		this._setSetting(libSet, 'artId', grCfg.themeLibrary, 'artId', 0);
		this._setSetting(libSet, 'albumArtGrpLevel', grCfg.themeLibrary, 'albumArtGrpLevel', 0);
		this._setSetting(libSet, 'imgStyleFront', grCfg.themeLibrary, 'imgStyleFront', 1);
		this._setSetting(libSet, 'imgStyleBack', grCfg.themeLibrary, 'imgStyleBack', 1);
		this._setSetting(libSet, 'imgStyleDisc', grCfg.themeLibrary, 'imgStyleDisc', 1);
		this._setSetting(libSet, 'imgStyleIcon', grCfg.themeLibrary, 'imgStyleIcon', 1);
		this._setSetting(libSet, 'imgStyleArtist', grCfg.themeLibrary, 'imgStyleArtist', 1);
		this._setSetting(libSet, 'albumArtLabelType', grCfg.themeLibrary, 'albumArtLabelType', 1);
		this._setSetting(libSet, 'albumArtFlipLabels', grCfg.themeLibrary, 'albumArtFlipLabels', false);
		this._setSetting(libSet, 'actionMode', grCfg.themeLibrary, 'actionMode', 0);
		this._setSetting(libSet, 'clickAction', grCfg.themeLibrary, 'clickAction', 0);
		this._setSetting(libSet, 'dblClickAction', grCfg.themeLibrary, 'dblClickAction', 1);
		this._setSetting(libSet, 'mbtnClickAction', grCfg.themeLibrary, 'mbtnClickAction', 1);
		this._setSetting(libSet, 'altClickAction', grCfg.themeLibrary, 'altClickAction', 1);
		this._setSetting(libSet, 'autoPlay', grCfg.themeLibrary, 'autoPlay', true);
		this._setSetting(libSet, 'keyAction', grCfg.themeLibrary, 'keyAction', 0);
		this._setSetting(libSet, 'rememberTree', grCfg.themeLibrary, 'rememberTree', false);
		this._setSetting(libSet, 'artTreeSameView', grCfg.themeLibrary, 'artTreeSameView', false);
		this._setSetting(libSet, 'presetLoadCurView', grCfg.themeLibrary, 'presetLoadCurView', true);
		this._setSetting(libSet, 'rootNode', grCfg.themeLibrary, 'rootNode', 3);
		this._setSetting(libSet, 'nodeCounts', grCfg.themeLibrary, 'nodeCounts', 1);
		this._setSetting(libSet, 'countsRight', grCfg.themeLibrary, 'countsRight', true);
		this._setSetting(libSet, 'autoCollapse', grCfg.themeLibrary, 'autoCollapse', false);
		this._setSetting(libSet, 'itemShowStatistics', grCfg.themeLibrary, 'itemShowStatistics', 0);
		this._setSetting(libSet, 'highLightNowplaying', grCfg.themeLibrary, 'highLightNowplaying', true);
		this._setSetting(libSet, 'showTracks', grCfg.themeLibrary, 'showTracks', true);
		this._setSetting(libSet, 'rowStripes', grCfg.themeLibrary, 'rowStripes', false);
		this._setSetting(libSet, 'fullLineSelection', grCfg.themeLibrary, 'fullLineSelection', true);
		this._setSetting(grSet, 'libraryRowHover', grCfg.themeLibrary, 'libraryRowHover', true);
		this._setSetting(libSet, 'filterBy', grCfg.themeLibrary, 'filterBy', 0);
		this._setSetting(libSet, 'sortOrder', grCfg.themeLibrary, 'sortOrder', 'default');
		this._setSetting(libSet, 'yearBeforeAlbum', grCfg.themeLibrary, 'yearBeforeAlbum', true);
		this._setSetting(libSet, 'albumArtViewBy', grCfg.themeLibrary, 'albumArtViewBy', 0);
		this._setSetting(libSet, 'treeViewBy', grCfg.themeLibrary, 'treeViewBy', 0);
	}

	/**
	 * Sets Biography settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setBiography() {
		// * Special cases
		if (this.saveCfg) {
			grCfg.themeBiography.biographyTheme = grSet.biographyTheme;
		} else {
			bioSet.theme = grSet.biographyTheme = this.loadCfg ? grCfg.themeBiography.biographyTheme : 0;
		}

		this._setSetting(grSet, 'biographyLayout', grCfg.themeBiography, 'biographyLayout', 'normal');
		this._setSetting(grSet, 'biographyLayoutFullPreset', grCfg.themeBiography, 'biographyLayoutFullPreset', true);
		this._setSetting(bioSet, 'style', grCfg.themeBiography, 'style', 0);
		this._setSetting(bioSet, 'filmStripPos', grCfg.themeBiography, 'filmStripPos', 3);
		this._setSetting(bioSet, 'filmStripOverlay', grCfg.themeBiography, 'filmStripOverlay', false);

		this._setSetting(grSet, 'biographyDisplay', grCfg.themeBiography, 'biographyDisplay', 'Image+text');
		if (!this.saveCfg) grm.ui.setBiographyDisplay();

		this._setSetting(bioSet, 'showFilmStrip', grCfg.themeBiography, 'showFilmStrip', false);
		this._setSetting(bioSet, 'imgSeekerShow', grCfg.themeBiography, 'imgSeekerShow', 0);
		this._setSetting(bioSet, 'heading', grCfg.themeBiography, 'heading', 1);
		this._setSetting(bioSet, 'summaryShow', grCfg.themeBiography, 'summaryShow', true);
		this._setSetting(bioSet, 'summaryCompact', grCfg.themeBiography, 'summaryCompact', true);
		this._setSetting(bioSet, 'artistView', grCfg.themeBiography, 'artistView', true);
		this._setSetting(bioSet, 'focus', grCfg.themeBiography, 'focus', false);
		this._setSetting(bioSet, 'lockBio', grCfg.themeBiography, 'lockBio', false);
		this._setSetting(bioSet, 'sourceAll', grCfg.themeBiography, 'sourceAll', false);
		this._setSetting(bioSet, 'classicalMusicMode', grCfg.themeBiography, 'classicalMusicMode', false);
		this._setSetting(bioSet, 'cycPhotoLocation', grCfg.themeBiography, 'cycPhotoLocation', 0);
		this._setSetting(bioSet, 'covType', grCfg.themeBiography, 'covType', 0);
		this._setSetting(bioSet, 'loadCovAllFb', grCfg.themeBiography, 'loadCovAllFb', false);
		this._setSetting(bioSet, 'loadCovFolder', grCfg.themeBiography, 'loadCovFolder', false);
		this._setSetting(bioSet, 'artStyleDual', grCfg.themeBiography, 'artStyleDual', 1);
		this._setSetting(bioSet, 'artReflDual', grCfg.themeBiography, 'artReflDual', false);
		this._setSetting(bioSet, 'artShadowDual', grCfg.themeBiography, 'artShadowDual', false);
		this._setSetting(bioSet, 'covStyleDual', grCfg.themeBiography, 'covStyleDual', 1);
		this._setSetting(bioSet, 'covReflDual', grCfg.themeBiography, 'covReflDual', false);
		this._setSetting(bioSet, 'covShadowDual', grCfg.themeBiography, 'covShadowDual', false);
		this._setSetting(bioSet, 'artStyleImgOnly', grCfg.themeBiography, 'artStyleImgOnly', 1);
		this._setSetting(bioSet, 'artReflImgOnly', grCfg.themeBiography, 'artReflImgOnly', false);
		this._setSetting(bioSet, 'artShadowImgOnly', grCfg.themeBiography, 'artShadowImgOnly', false);
		this._setSetting(bioSet, 'covStyleImgOnly', grCfg.themeBiography, 'covStyleImgOnly', 1);
		this._setSetting(bioSet, 'covReflImgOnly', grCfg.themeBiography, 'covReflImgOnly', false);
		this._setSetting(bioSet, 'covShadowImgOnly', grCfg.themeBiography, 'covShadowImgOnly', false);
		this._setSetting(bioSet, 'filmPhotoStyle', grCfg.themeBiography, 'filmPhotoStyle', 1);
		this._setSetting(bioSet, 'filmCoverStyle', grCfg.themeBiography, 'filmCoverStyle', 1);
		this._setSetting(bioCfg, 'photoNum', grCfg.themeBiography, 'photoNum', 10);
		this._setSetting(bioSet, 'cycPic', grCfg.themeBiography, 'cycPic', true);
		this._setSetting(bioSet, 'imgSmoothTrans', grCfg.themeBiography, 'imgSmoothTrans', false);
		this._setSetting(bioSet, 'cycTimePic', grCfg.themeBiography, 'cycTimePic', 15);
	}

	/**
	 * Sets Lyrics settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setLyrics() {
		this._setSetting(grSet, 'lyricsLayout', grCfg.themeLyrics, 'lyricsLayout', 'normal');
		this._setSetting(grSet, 'lyricsDropShadowLevel', grCfg.themeLyrics, 'lyricsDropShadowLevel', 2);
		this._setSetting(grSet, 'lyricsFadeScroll', grCfg.themeLyrics, 'lyricsFadeScroll', true);
		this._setSetting(grSet, 'lyricsLargerCurrentSync', grCfg.themeLyrics, 'lyricsLargerCurrentSync', true);
		this._setSetting(grSet, 'lyricsAlbumArt', grCfg.themeLyrics, 'lyricsAlbumArt', true);
		this._setSetting(grSet, 'lyricsRememberPanelState', grCfg.themeLyrics, 'lyricsRememberPanelState', false);
		this._setSetting(grSet, 'lyricsScrollSpeed', grCfg.themeLyrics, 'lyricsScrollSpeed', 'normal');
		this._setSetting(grSet, 'lyricsScrollRateAvg', grCfg.themeLyrics, 'lyricsScrollRateAvg', 750);
		this._setSetting(grSet, 'lyricsScrollRateMax', grCfg.themeLyrics, 'lyricsScrollRateMax', 375);
		this._setSetting(grSet, 'displayLyrics', grCfg.themeLyrics, 'displayLyrics', false);
	}

	/**
	 * Sets Settings settings based on the state of `this.saveCfg`, `this.loadCfg`, `this.defaultCfg`.
	 */
	setSettings() {
		this._setSetting(grSet, 'themeDayNightMode', grCfg.themeSettings, 'themeDayNightMode', false);
		this._setSetting(grSet, 'customThemeFonts', grCfg.themeSettings, 'customThemeFonts', false);
		this._setSetting(grSet, 'customPreloaderLogo', grCfg.themeSettings, 'customPreloaderLogo', false);
		this._setSetting(grSet, 'customThemeImages', grCfg.themeSettings, 'customThemeImages', false);
		this._setSetting(libSet, 'albumArtDiskCache', grCfg.themeSettings, 'albumArtDiskCache', true);
		this._setSetting(libSet, 'albumArtPreLoad', grCfg.themeSettings, 'albumArtPreLoad', false);
		this._setSetting(grSet, 'customLibraryDir', grCfg.themeSettings, 'customLibraryDir', false);
		this._setSetting(grSet, 'libraryAutoDelete', grCfg.themeSettings, 'libraryAutoDelete', false);
		this._setSetting(grSet, 'customBiographyDir', grCfg.themeSettings, 'customBiographyDir', false);
		this._setSetting(grSet, 'biographyAutoDelete', grCfg.themeSettings, 'biographyAutoDelete', false);
		this._setSetting(grSet, 'customLyricsDir', grCfg.themeSettings, 'customLyricsDir', false);
		this._setSetting(grSet, 'lyricsAutoDelete', grCfg.themeSettings, 'lyricsAutoDelete', false);
		this._setSetting(grSet, 'customWaveformBarDir', grCfg.themeSettings, 'customWaveformBarDir', false);
		this._setSetting(grSet, 'waveformBarAutoDelete', grCfg.themeSettings, 'waveformBarAutoDelete', false);
		this._setSetting(grSet, 'themePerformance', grCfg.themeSettings, 'themePerformance', 'balanced');
		this._setSetting(grSet, 'devTools', grCfg.themeSettings, 'devTools', false);
		this._setSetting(grSet, 'disableRightClick', grCfg.themeSettings, 'disableRightClick', true);
	}

	/**
	 * Sets settings not in the config nor in the Options menu.
	 */
	setSettingsNotInConfig() {
		grSet.savedAlbumArtShow = libSet.albumArtShow;
		libSet.albumArtDropShadow = grSet.libraryThumbnailBorder === 'shadow';
		bioSet.largerSyncLyricLine = grSet.lyricsLargerCurrentSync;
	}

	/**
	 * Sets variable imgBlended when switching from default settings to config settings that has style Blend or Blend2 activated.
	 */
	setStyleBlend() {
		if ((grSet.styleBlend || grSet.styleBlend2 || grSet.styleProgressBarFill === 'blend') && grm.ui.albumArt) {
			grm.color.setStyleBlend();
		}
	}

	/**
	 * Sets theme performance presets with various theme settings that affect overall performance.
	 * The 'balanced' preset settings will be also applied in 'highQuality' and 'highestQuality'.
	 * Used in Options > Settings > Theme performance.
	 * @param {string} preset - The theme performance preset to load.
	 */
	setThemePerformance(preset) {
		switch (preset) {
			case 'balanced': // Default
				grSet.playerSize = 'small';
				grm.display.autoDetectRes();
				grSet.styleDefault = true;
				grSet.playlistAutoScrollNowPlaying = false;
				grSet.playlistSmoothScrolling = true;
				grSet.libraryAutoScrollNowPlaying = false;
				libSet.smooth = true;
				bioSet.smooth = true;
				grSet.showStyledTooltips = true;
				grSet.showPreloaderLogo = true;
				grSet.showHiResAudioBadge = false;
				grSet.showPause = true;
				grSet.seekbar = 'progressbar';
				grSet.progressBarRefreshRate = 'variable';
				grSet.peakmeterBarRefreshRate = 80;
				grSet.waveformBarPaint = 'partial';
				grSet.waveformBarPrepaint = true;
				grSet.waveformBarPrepaintFront = Infinity;
				grSet.waveformBarAnimate = true;
				grSet.waveformBarBPM = true;
				grSet.waveformBarRefreshRate = 200;
				grSet.playlistLayout = 'normal';
				plSet.show_album_art = true;
				grSet.playlistTimeRemaining = false;
				grSet.playlistRowHover = true;
				grSet.showDiscArtStub = true;
				grSet.noDiscArtStub = false;
				grSet.discArtStub = 'cdAlbumCover';
				grSet.displayDiscArt = true;
				grSet.spinDiscArt = false;
				grSet.spinDiscArtImageCount = 72;
				grSet.spinDiscArtRedrawInterval = 75;
				clearInterval(grm.ui.discArtRotationTimer);
				grm.ui.discArtArray = [];
				grSet.detailsAlbumArtOpacity = 255;
				grSet.detailsAlbumArtDiscAreaOpacity = 255;
				grSet.showGridTimeline_default = true;
				grSet.showGridTimeline_artwork = true;
				grSet.libraryLayout = 'normal';
				grSet.libraryDesign = 'reborn';
				grSet.libraryTheme = 0;
				libSet.albumArtShow = false;
				grSet.libraryRowHover = true;
				grSet.biographyLayout = 'normal';
				grSet.biographyTheme = 0;
				bioSet.showFilmStrip = false;
				bioCfg.photoNum = 10;
				libSet.albumArtDiskCache = true;
				libSet.albumArtPreLoad = false;
				grSet.libraryAutoDelete = false;
				grSet.biographyAutoDelete = false;
				grSet.lyricsAutoDelete = false;
				bioSet.focusLoadRate = 1000;
				bioSet.focusLoadImmediate = false;
				grSet.lyricsDropShadowLevel = 2;
				grSet.lyricsFadeScroll = true;
				grSet.lyricsAlbumArt = true;
				grSet.lyricsRememberPanelState = false;
				grSet.lyricsScrollSpeed = 'normal';
				grSet.lyricsScrollRateAvg = 750;
				grSet.lyricsScrollRateMax = 375;
				break;

			case 'lowestQuality':
				grSet.playerSize = 'small';
				grSet.playerSize_HD_small = true;
				grm.display.playerSize_HD_small();
				grSet.styleDefault = true;
				grSet.displayRes = 'HD';
				grSet.playlistAutoScrollNowPlaying = false;
				grSet.playlistSmoothScrolling = false;
				grSet.libraryAutoScrollNowPlaying = false;
				libSet.smooth = false;
				bioSet.smooth = false;
				grSet.showStyledTooltips = false;
				grSet.showPreloaderLogo = false;
				grSet.showHiResAudioBadge = false;
				grSet.showPause = false;
				grSet.seekbar = 'progressbar';
				grSet.progressBarRefreshRate = 1000;
				grSet.peakmeterBarRefreshRate = 200;
				grSet.waveformBarPaint = 'full';
				grSet.waveformBarPrepaint = false;
				grSet.waveformBarPrepaintFront = 2;
				grSet.waveformBarAnimate = false;
				grSet.waveformBarBPM = false;
				grSet.waveformBarRefreshRate = 1000;
				grSet.playlistLayout = 'normal';
				plSet.show_album_art = false;
				grSet.playlistTimeRemaining = false;
				grSet.playlistRowHover = false;
				grSet.showDiscArtStub = false;
				grSet.noDiscArtStub = true;
				grSet.displayDiscArt = false;
				grSet.spinDiscArt = false;
				grSet.spinDiscArtImageCount = 36;
				grSet.spinDiscArtRedrawInterval = 250;
				grSet.showGridTimeline_default = false;
				grSet.showGridTimeline_artwork = false;
				grSet.libraryLayout = 'normal';
				grSet.libraryDesign = 'reborn';
				grSet.libraryTheme = 0;
				libSet.albumArtShow = false;
				grSet.libraryRowHover = false;
				grSet.biographyLayout = 'normal';
				grSet.biographyTheme = 0;
				bioSet.showFilmStrip = false;
				bioCfg.photoNum = 1;
				libSet.albumArtDiskCache = true;
				libSet.albumArtPreLoad = false;
				bioSet.focusLoadRate = 3000;
				grSet.lyricsDropShadowLevel = 0;
				grSet.lyricsFadeScroll = false;
				grSet.lyricsAlbumArt = false;
				grSet.lyricsRememberPanelState = false;
				grSet.lyricsScrollSpeed = 'fastest';
				grSet.lyricsScrollRateAvg = 300;
				grSet.lyricsScrollRateMax = 150;
				break;

			case 'lowQuality':
				grSet.playerSize = 'small';
				grSet.styleDefault = true;
				grSet.displayRes = 'HD';
				grSet.showStyledTooltips = false;
				grSet.seekbar = 'progressbar';
				grSet.progressBarRefreshRate = 500;
				grSet.peakmeterBarRefreshRate = 120;
				grSet.waveformBarPaint = 'full';
				grSet.waveformBarPrepaint = false;
				grSet.waveformBarPrepaintFront = 2;
				grSet.waveformBarAnimate = false;
				grSet.waveformBarBPM = false;
				grSet.waveformBarRefreshRate = 500;
				grSet.playlistTimeRemaining = false;
				grSet.showDiscArtStub = false;
				grSet.noDiscArtStub = true;
				grSet.displayDiscArt = false;
				grSet.spinDiscArt = false;
				grSet.spinDiscArtImageCount = 45;
				grSet.spinDiscArtRedrawInterval = 125;
				grSet.libraryTheme = 0;
				libSet.albumArtShow = false;
				grSet.biographyTheme = 0;
				bioSet.showFilmStrip = false;
				bioCfg.photoNum = 5;
				libSet.albumArtDiskCache = true;
				libSet.albumArtPreLoad = false;
				bioSet.focusLoadRate = 2000;
				grSet.lyricsDropShadowLevel = 0;
				grSet.lyricsScrollSpeed = 'fast';
				grSet.lyricsScrollRateAvg = 500;
				grSet.lyricsScrollRateMax = 250;
				break;

			case 'highQuality':
				grSet.playerSize = 'normal';
				grSet.progressBarRefreshRate = 100;
				grSet.peakmeterBarRefreshRate = 60;
				grSet.waveformBarPaint = 'partial';
				grSet.waveformBarPrepaint = true;
				grSet.waveformBarPrepaintFront = Infinity;
				grSet.waveformBarRefreshRate = 100;
				grSet.waveformBarRefreshRateVar = false;
				grSet.spinDiscArt = true;
				grSet.spinDiscArtImageCount = 120;
				grSet.spinDiscArtRedrawInterval = 40;
				grm.ui.setDiscArtRotationTimer();
				grSet.libraryLayout = 'full';
				libSet.albumArtShow = true;
				grSet.biographyLayout = 'full';
				bioCfg.photoNum = 15;
				libSet.albumArtDiskCache = true;
				libSet.albumArtPreLoad = true;
				bioSet.focusLoadRate = 750;
				grSet.lyricsScrollSpeed = 'slow';
				grSet.lyricsScrollRateAvg = 1000;
				grSet.lyricsScrollRateMax = 500;
				break;

			case 'highestQuality':
				grSet.playerSize = 'large';
				grSet.progressBarRefreshRate = 30;
				grSet.peakmeterBarRefreshRate = 30;
				grSet.waveformBarPaint = 'partial';
				grSet.waveformBarPrepaint = true;
				grSet.waveformBarPrepaintFront = Infinity;
				grSet.waveformBarRefreshRate = 30;
				grSet.waveformBarRefreshRateVar = false;
				grSet.spinDiscArt = true;
				grSet.spinDiscArtImageCount = 180;
				grSet.spinDiscArtRedrawInterval = 10;
				grm.ui.setDiscArtRotationTimer();
				grSet.detailsAlbumArtDiscAreaOpacity = 178;
				grSet.libraryLayout = 'full';
				libSet.albumArtShow = true;
				grSet.biographyLayout = 'full';
				bioCfg.photoNum = 20;
				libSet.albumArtDiskCache = true;
				libSet.albumArtPreLoad = true;
				bioSet.focusLoadRate = 500;
				grSet.lyricsScrollSpeed = 'slowest';
				grSet.lyricsScrollRateAvg = 1500;
				grSet.lyricsScrollRateMax = 725;
				break;
		}
	}
	// #endregion
}
