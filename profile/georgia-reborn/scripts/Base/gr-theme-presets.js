/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Theme Presets                            * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-05-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * THEME PRESETS * //
///////////////////////
/**
 * A class that contains all theme presets and methods to apply various theme and style settings.
 * These theme presets can be accessed through the Options -> Preset menu.
 */
class ThemePreset {
	/**
	 * Creates a `ThemePreset` instance.
	 * @constructor
	 */
	constructor() {
		/**
		 * The central preset configuration object containing all theme preset definitions.
		 * Only properties that differ from defaults need to be specified for each preset.
		 * @typedef  {object} PRESET_CONFIGS - Individual preset configuration object.
		 * @property {string} name - The preset display name shown in the menu.
		 * @property {string} theme - The theme identifier (white, black, reborn, random, blue, darkblue, red, cream, nblue, ngreen, nred, ngold, custom).
		 * @property {boolean} [styleNighttime] - Options > Style > Nighttime (Reborn/Random themes).
		 * @property {boolean} [styleBevel] - Options > Style > Bevel.
		 * @property {boolean} [styleBlend] - Options > Style > Blend.
		 * @property {boolean} [styleBlend2] - Options > Style > Blend 2.
		 * @property {boolean} [styleGradient] - Options > Style > Gradient.
		 * @property {boolean} [styleGradient2] - Options > Style > Gradient 2.
		 * @property {boolean} [styleAlternative] - Options > Style > Alternative.
		 * @property {boolean} [styleAlternative2] - Options > Style > Alternative 2.
		 * @property {boolean} [styleBlackAndWhite] - Options > Style > Black and white (White theme).
		 * @property {boolean} [styleBlackAndWhite2] - Options > Style > Black and white 2 (White theme).
		 * @property {boolean} [styleBlackAndWhiteReborn] - Options > Style > Black and white reborn (White theme).
		 * @property {boolean} [styleBlackReborn] - Options > Style > Black reborn (Black theme).
		 * @property {boolean} [styleRebornWhite] - Options > Style > Reborn white (Reborn theme).
		 * @property {boolean} [styleRebornBlack] - Options > Style > Reborn black (Reborn theme).
		 * @property {boolean} [styleRebornFusion] - Options > Style > Reborn fusion (Reborn theme).
		 * @property {boolean} [styleRebornFusion2] - Options > Style > Reborn fusion 2 (Reborn theme).
		 * @property {boolean} [styleRebornFusionAccent] - Options > Style > Reborn fusion accent (Reborn theme).
		 * @property {boolean} [styleRandomPastel] - Options > Style > Random pastel (Random theme).
		 * @property {boolean} [styleRandomDark] - Options > Style > Random dark (Random theme).
		 * @property {string}  [styleRandomAutoColor] - Options > Style > Auto color (Random theme). Values: 'off', 'track', 'album'.
		 * @property {string}  [styleTopMenuButtons] - Options > Style > Buttons > Top menu. Values: 'default', 'filled', 'bevel', 'inner', 'emboss', 'minimal'.
		 * @property {string}  [styleTransportButtons] - Options > Style > Buttons > Transport. Values: 'default', 'bevel', 'inner', 'emboss', 'minimal'.
		 * @property {string}  [styleProgressBarDesign] - Options > Style > Progress bar > Design. Values: 'default', 'rounded'.
		 * @property {string}  [styleProgressBar] - Options > Style > Progress bar > Background. Values: 'default', 'bevel', 'inner'.
		 * @property {string}  [styleProgressBarFill] - Options > Style > Progress bar > Progress fill. Values: 'default', 'bevel', 'inner'.
		 * @property {string}  [styleVolumeBarDesign] - Options > Style > Volume bar > Design. Values: 'default', 'rounded'.
		 * @property {string}  [styleVolumeBar] - Options > Style > Volume bar > Background. Values: 'default', 'bevel', 'inner'.
		 * @property {string}  [styleVolumeBarFill] - Options > Style > Volume bar > Volume fill. Values: 'default', 'bevel', 'inner'.
		 * @property {string|number} [themeBrightness] - Options > Display > Brightness. Values: 'default' or number.
		 */
		/** @type {Object.<string, PRESET_CONFIGS>} */
		this.PRESET_CONFIGS = {
			// * WHITE THEME PRESETS * //
			// #region WHITE THEME PRESETS
			whiteP01: {
				name: 'White preset: Beveled',
				theme: 'white',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBarFill: 'bevel',
			},
			whiteP02: {
				name: 'White preset: Black and white',
				theme: 'white',
				styleBevel: true,
				styleBlackAndWhite: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'default',
				styleVolumeBar: 'inner',
			},
			whiteP03: {
				name: 'White preset: Black and white blended',
				theme: 'white',
				styleBevel: true,
				styleBlend: true,
				styleBlackAndWhite: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			whiteP04: {
				name: 'White preset: Black and white 2',
				theme: 'white',
				styleBevel: true,
				styleBlackAndWhite2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			whiteP05: {
				name: 'White preset: Black and white 2 blended',
				theme: 'white',
				styleBevel: true,
				styleBlend: true,
				styleBlackAndWhite2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			whiteP06: {
				name: 'White preset: Black and white reborn',
				theme: 'white',
				styleBevel: true,
				styleBlackAndWhiteReborn: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			whiteP07: {
				name: 'White preset: Black and white reborn blended',
				theme: 'white',
				styleBevel: true,
				styleBlend: true,
				styleBlackAndWhiteReborn: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			whiteP08: {
				name: 'White preset: Minimalized',
				theme: 'white',
				styleAlternative: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * BLACK THEME PRESETS * //
			// #region BLACK THEME PRESETS
			blackP01: {
				name: 'Black preset: Beveled',
				theme: 'black',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			blackP02: {
				name: 'Black preset: Blended',
				theme: 'black',
				styleBevel: true,
				styleBlend: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			blackP03: {
				name: 'Black preset: Blended alternative',
				theme: 'black',
				styleBlend: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			blackP04: {
				name: 'Black preset: Blended alternative 2',
				theme: 'black',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			blackP05: {
				name: 'Black preset: Black reborn',
				theme: 'black',
				styleBevel: true,
				styleBlackReborn: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			blackP06: {
				name: 'Black preset: Black reborn blended',
				theme: 'black',
				styleBevel: true,
				styleBlend: true,
				styleBlackReborn: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			blackP07: {
				name: 'Black preset: Dark gray',
				theme: 'black',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
				themeBrightness: 10,
			},
			blackP08: {
				name: 'Black preset: Dark gray blended',
				theme: 'black',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			blackP09: {
				name: 'Black preset: Dark gray 2 blended',
				theme: 'black',
				styleBevel: true,
				styleBlend2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			blackP10: {
				name: 'Black preset: Minimalized',
				theme: 'black',
				styleAlternative: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * REBORN THEME PRESETS * //
			// #region REBORN THEME PRESETS
			rebornP01: {
				name: 'Reborn preset: Beveled',
				theme: 'reborn',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP02: {
				name: 'Reborn preset: Blended',
				theme: 'reborn',
				styleBevel: true,
				styleBlend: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP03: {
				name: 'Reborn preset: Blended 2',
				theme: 'reborn',
				styleBevel: true,
				styleBlend2: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP04: {
				name: 'Reborn preset: Gradiented',
				theme: 'reborn',
				styleBevel: true,
				styleGradient: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP05: {
				name: 'Reborn preset: Gradiented 2',
				theme: 'reborn',
				styleGradient2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP06: {
				name: 'Reborn preset: Minimalized',
				theme: 'reborn',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			rebornP07: {
				name: 'Reborn preset: Minimalized blended',
				theme: 'reborn',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			rebornP08: {
				name: 'Reborn preset: Reborn white beveled',
				theme: 'reborn',
				styleBevel: true,
				styleRebornWhite: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBarFill: 'bevel',
			},
			rebornP09: {
				name: 'Reborn preset: Reborn white blended',
				theme: 'reborn',
				styleBevel: true,
				styleBlend: true,
				styleRebornWhite: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP10: {
				name: 'Reborn preset: Reborn white blended 2',
				theme: 'reborn',
				styleBevel: true,
				styleBlend2: true,
				styleRebornWhite: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP11: {
				name: 'Reborn preset: Reborn black beveled',
				theme: 'reborn',
				styleBevel: true,
				styleRebornBlack: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			rebornP12: {
				name: 'Reborn preset: Reborn black blended',
				theme: 'reborn',
				styleBevel: true,
				styleBlend: true,
				styleRebornBlack: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP13: {
				name: 'Reborn preset: Reborn black blended 2',
				theme: 'reborn',
				styleBevel: true,
				styleBlend2: true,
				styleRebornBlack: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP14: {
				name: 'Reborn preset: Reborn black gradiented',
				theme: 'reborn',
				styleBevel: true,
				styleGradient: true,
				styleRebornBlack: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP15: {
				name: 'Reborn preset: Reborn black gradiented 2',
				theme: 'reborn',
				styleBevel: true,
				styleGradient2: true,
				styleRebornBlack: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP16: {
				name: 'Reborn preset: Reborn fusion beveled',
				theme: 'reborn',
				styleBevel: true,
				styleRebornFusion: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP17: {
				name: 'Reborn preset: Reborn fusion blended',
				theme: 'reborn',
				styleBevel: true,
				styleBlend: true,
				styleRebornFusion: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP18: {
				name: 'Reborn preset: Reborn fusion blended 2',
				theme: 'reborn',
				styleBevel: true,
				styleBlend2: true,
				styleRebornFusion: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP19: {
				name: 'Reborn preset: Reborn fusion gradiented',
				theme: 'reborn',
				styleBevel: true,
				styleGradient: true,
				styleRebornFusion: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP20: {
				name: 'Reborn preset: Reborn fusion gradiented 2',
				theme: 'reborn',
				styleBevel: true,
				styleGradient2: true,
				styleRebornFusion: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP21: {
				name: 'Reborn preset: Reborn fusion 2 beveled',
				theme: 'reborn',
				styleBevel: true,
				styleRebornFusion2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP22: {
				name: 'Reborn preset: Reborn fusion 2 blended',
				theme: 'reborn',
				styleBevel: true,
				styleBlend: true,
				styleRebornFusion2: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP23: {
				name: 'Reborn preset: Reborn fusion 2 blended 2',
				theme: 'reborn',
				styleBevel: true,
				styleBlend2: true,
				styleRebornFusion2: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP24: {
				name: 'Reborn preset: Reborn fusion 2 gradiented',
				theme: 'reborn',
				styleBevel: true,
				styleGradient: true,
				styleRebornFusion2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP25: {
				name: 'Reborn preset: Reborn fusion 2 gradiented 2',
				theme: 'reborn',
				styleBevel: true,
				styleGradient2: true,
				styleRebornFusion2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP26: {
				name: 'Reborn preset: Reborn fusion accent beveled',
				theme: 'reborn',
				styleBevel: true,
				styleRebornFusionAccent: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP27: {
				name: 'Reborn preset: Reborn fusion accent blended',
				theme: 'reborn',
				styleBevel: true,
				styleBlend: true,
				styleRebornFusionAccent: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP28: {
				name: 'Reborn preset: Reborn fusion accent blended 2',
				theme: 'reborn',
				styleBevel: true,
				styleBlend2: true,
				styleRebornFusionAccent: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP29: {
				name: 'Reborn preset: Reborn fusion accent gradiented',
				theme: 'reborn',
				styleBevel: true,
				styleGradient: true,
				styleRebornFusionAccent: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			rebornP30: {
				name: 'Reborn preset: Reborn fusion accent gradiented 2',
				theme: 'reborn',
				styleBevel: true,
				styleGradient2: true,
				styleRebornFusionAccent: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			// #endregion

			// * RANDOM THEME PRESETS * //
			// #region RANDOM THEME PRESETS
			randomP01: {
				name: 'Random preset: Beveled blended alternative',
				theme: 'random',
				styleBevel: true,
				styleBlend: true,
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			randomP02: {
				name: 'Random preset: Beveled blended pastel',
				theme: 'random',
				styleBevel: true,
				styleBlend: true,
				styleRandomPastel: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			randomP03: {
				name: 'Random preset: Beveled blended dark',
				theme: 'random',
				styleBevel: true,
				styleBlend: true,
				styleRandomDark: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			randomP04: {
				name: 'Random preset: Beveled blended auto dark',
				theme: 'random',
				styleBevel: true,
				styleBlend: true,
				styleRandomDark: true,
				styleRandomAutoColor: 'track',
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			randomP05: {
				name: 'Random preset: Beveled auto dark',
				theme: 'random',
				styleBevel: true,
				styleRandomDark: true,
				styleRandomAutoColor: 'track',
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			randomP06: {
				name: 'Random preset: Beveled dark',
				theme: 'random',
				styleBevel: true,
				styleRandomDark: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			randomP07: {
				name: 'Random preset: Gradiented',
				theme: 'random',
				styleGradient: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			randomP08: {
				name: 'Random preset: Gradiented 2',
				theme: 'random',
				styleGradient2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			randomP09: {
				name: 'Random preset: Minimalized',
				theme: 'random',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			randomP10: {
				name: 'Random preset: Minimalized blended',
				theme: 'random',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * BLUE THEME PRESETS * //
			// #region BLUE THEME PRESETS
			blueP01: {
				name: 'Blue preset: Beveled',
				theme: 'blue',
				styleBevel: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			blueP02: {
				name: 'Blue preset: Beveled 2',
				theme: 'blue',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			blueP03: {
				name: 'Blue preset: Gradiented',
				theme: 'blue',
				styleGradient: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			blueP04: {
				name: 'Blue preset: Gradiented 2',
				theme: 'blue',
				styleGradient2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'inner',
			},
			blueP05: {
				name: 'Blue preset: Minimalized',
				theme: 'blue',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * DARK BLUE THEME PRESETS * //
			// #region DARK BLUE THEME PRESETS
			darkblueP01: {
				name: 'Dark blue preset: Beveled',
				theme: 'darkblue',
				styleBevel: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			darkblueP02: {
				name: 'Dark blue preset: Beveled 2',
				theme: 'darkblue',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			darkblueP03: {
				name: 'Dark blue preset: Gradiented',
				theme: 'darkblue',
				styleGradient: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			darkblueP04: {
				name: 'Dark blue preset: Gradiented 2',
				theme: 'darkblue',
				styleGradient2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'inner',
			},
			darkblueP05: {
				name: 'Dark blue preset: Minimalized',
				theme: 'darkblue',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * RED THEME PRESETS * //
			// #region RED THEME PRESETS
			redP01: {
				name: 'Red preset: Beveled',
				theme: 'red',
				styleBevel: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			redP02: {
				name: 'Red preset: Beveled 2',
				theme: 'red',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			redP03: {
				name: 'Red preset: Gradiented',
				theme: 'red',
				styleGradient: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			redP04: {
				name: 'Red preset: Gradiented 2',
				theme: 'red',
				styleGradient2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'inner',
			},
			redP05: {
				name: 'Red preset: Minimalized',
				theme: 'red',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * CREAM THEME PRESETS * //
			// #region RED THEME PRESETS
			creamP01: {
				name: 'Cream preset: Beveled',
				theme: 'cream',
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			creamP02: {
				name: 'Cream preset: Beveled 2',
				theme: 'cream',
				styleBevel: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			creamP03: {
				name: 'Cream preset: Alternative',
				theme: 'cream',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			creamP04: {
				name: 'Cream preset: Alternative 2',
				theme: 'cream',
				styleBevel: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'bevel',
			},
			creamP05: {
				name: 'Cream preset: Minimalized',
				theme: 'cream',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * NEON BLUE THEME PRESETS * //
			// #region RED THEME PRESETS
			nblueP01: {
				name: 'Neon blue preset: Beveled',
				theme: 'nblue',
				styleBevel: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			nblueP02: {
				name: 'Neon blue preset: Beveled 2',
				theme: 'nblue',
				styleBevel: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			nblueP03: {
				name: 'Neon blue preset: Blended',
				theme: 'nblue',
				styleBlend: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			nblueP04: {
				name: 'Neon blue preset: Blended 2',
				theme: 'nblue',
				styleBlend2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			nblueP05: {
				name: 'Neon blue preset: Alternative',
				theme: 'nblue',
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			nblueP06: {
				name: 'Neon blue preset: Alternative 2',
				theme: 'nblue',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			nblueP07: {
				name: 'Neon blue preset: Dark gray',
				theme: 'nblue',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
				themeBrightness: 10,
			},
			nblueP08: {
				name: 'Neon blue preset: Dark gray blended',
				theme: 'nblue',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			nblueP09: {
				name: 'Neon blue preset: Dark gray 2 blended',
				theme: 'nblue',
				styleBevel: true,
				styleBlend2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			nblueP10: {
				name: 'Neon blue preset: Minimalized',
				theme: 'nblue',
				styleAlternative: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * NEON GREEN THEME PRESETS * //
			// #region RED THEME PRESETS
			ngreenP01: {
				name: 'Neon green preset: Beveled',
				theme: 'ngreen',
				styleBevel: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			ngreenP02: {
				name: 'Neon green preset: Beveled 2',
				theme: 'ngreen',
				styleBevel: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			ngreenP03: {
				name: 'Neon green preset: Blended',
				theme: 'ngreen',
				styleBlend: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			ngreenP04: {
				name: 'Neon green preset: Blended 2',
				theme: 'ngreen',
				styleBlend2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			ngreenP05: {
				name: 'Neon green preset: Alternative',
				theme: 'ngreen',
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			ngreenP06: {
				name: 'Neon green preset: Alternative 2',
				theme: 'ngreen',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			ngreenP07: {
				name: 'Neon green preset: Dark gray',
				theme: 'ngreen',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
				themeBrightness: 10,
			},
			ngreenP08: {
				name: 'Neon green preset: Dark gray blended',
				theme: 'ngreen',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			ngreenP09: {
				name: 'Neon green preset: Dark gray 2 blended',
				theme: 'ngreen',
				styleBevel: true,
				styleBlend2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			ngreenP10: {
				name: 'Neon green preset: Minimalized',
				theme: 'ngreen',
				styleAlternative: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * NEON RED THEME PRESETS * //
			// #region NEON RED THEME PRESETS
			nredP01: {
				name: 'Neon red preset: Beveled',
				theme: 'nred',
				styleBevel: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			nredP02: {
				name: 'Neon red preset: Beveled 2',
				theme: 'nred',
				styleBevel: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			nredP03: {
				name: 'Neon red preset: Blended',
				theme: 'nred',
				styleBlend: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			nredP04: {
				name: 'Neon red preset: Blended 2',
				theme: 'nred',
				styleBlend2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			nredP05: {
				name: 'Neon red preset: Alternative',
				theme: 'nred',
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			nredP06: {
				name: 'Neon red preset: Alternative 2',
				theme: 'nred',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			nredP07: {
				name: 'Neon red preset: Dark gray',
				theme: 'nred',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
				themeBrightness: 10,
			},
			nredP08: {
				name: 'Neon red preset: Dark gray blended',
				theme: 'nred',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			nredP09: {
				name: 'Neon red preset: Dark gray 2 blended',
				theme: 'nred',
				styleBevel: true,
				styleBlend2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			nredP10: {
				name: 'Neon red preset: Minimalized',
				theme: 'nred',
				styleAlternative: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * NEON GOLD THEME PRESETS * //
			// #region NEON GOLD THEME PRESETS
			ngoldP01: {
				name: 'Neon gold preset: Beveled',
				theme: 'ngold',
				styleBevel: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			ngoldP02: {
				name: 'Neon gold preset: Beveled 2',
				theme: 'ngold',
				styleBevel: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			ngoldP03: {
				name: 'Neon gold preset: Blended',
				theme: 'ngold',
				styleBlend: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			ngoldP04: {
				name: 'Neon gold preset: Blended 2',
				theme: 'ngold',
				styleBlend2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			ngoldP05: {
				name: 'Neon gold preset: Alternative',
				theme: 'ngold',
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			ngoldP06: {
				name: 'Neon gold preset: Alternative 2',
				theme: 'ngold',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			ngoldP07: {
				name: 'Neon gold preset: Dark gray',
				theme: 'ngold',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
				themeBrightness: 10,
			},
			ngoldP08: {
				name: 'Neon gold preset: Dark gray blended',
				theme: 'ngold',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			ngoldP09: {
				name: 'Neon gold preset: Dark gray 2 blended',
				theme: 'ngold',
				styleBevel: true,
				styleBlend2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
				themeBrightness: 10,
			},
			ngoldP10: {
				name: 'Neon gold preset: Minimalized',
				theme: 'ngold',
				styleAlternative: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion

			// * CUSTOM THEME PRESETS * //
			// #region CUSTOM THEME PRESETS
			customP01: {
				name: 'Custom preset: Beveled',
				theme: 'custom',
				styleBevel: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			customP02: {
				name: 'Custom preset: Beveled 2',
				theme: 'custom',
				styleBevel: true,
				styleAlternative: true,
				styleTopMenuButtons: 'bevel',
				styleTransportButtons: 'bevel',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			customP03: {
				name: 'Custom preset: Blended',
				theme: 'custom',
				styleBlend: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			customP04: {
				name: 'Custom preset: Blended 2',
				theme: 'custom',
				styleBlend2: true,
				styleTopMenuButtons: 'emboss',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'inner',
			},
			customP05: {
				name: 'Custom preset: Gradiented',
				theme: 'custom',
				styleGradient: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'emboss',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			customP06: {
				name: 'Custom preset: Gradiented 2',
				theme: 'custom',
				styleGradient2: true,
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'bevel',
				styleProgressBar: 'bevel',
				styleProgressBarFill: 'inner',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'bevel',
				styleVolumeBarFill: 'inner',
			},
			customP07: {
				name: 'Custom preset: Alternative',
				theme: 'custom',
				styleAlternative: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			customP08: {
				name: 'Custom preset: Alternative 2',
				theme: 'custom',
				styleAlternative2: true,
				styleTopMenuButtons: 'inner',
				styleTransportButtons: 'inner',
				styleProgressBarDesign: 'rounded',
				styleProgressBar: 'inner',
				styleProgressBarFill: 'bevel',
				styleVolumeBarDesign: 'rounded',
				styleVolumeBar: 'inner',
				styleVolumeBarFill: 'bevel',
			},
			customP09: {
				name: 'Custom preset: Minimalized',
				theme: 'custom',
				styleAlternative: true,
				styleTopMenuButtons: 'filled',
				styleTransportButtons: 'minimal',
			},
			customP10: {
				name: 'Custom preset: Minimalized blended',
				theme: 'custom',
				styleBlend: true,
				styleAlternative2: true,
				styleTopMenuButtons: 'minimal',
				styleTransportButtons: 'minimal',
			},
			// #endregion
		};

		this._initThemePresetMethods();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Applies a preset configuration to grSet by copying all style properties from the config.
	 * @param {string} presetId - The preset identifier (e.g., 'whiteP01').
	 * @private
	 */
	_applyPresetConfig(presetId) {
		const config = this.PRESET_CONFIGS[presetId];

		if (!config) {
			console.log(`Preset config not found: ${presetId}`);
			return;
		}

		// Reset all style properties to their defaults before applying preset
		this._resetStyleDefaults();

		// Apply all properties from config to grSet
		for (const [key, value] of Object.entries(config)) {
			if (key === 'name') continue;

			// Handle custom theme special case
			if (key === 'theme' && value === 'custom') {
				this._customThemeSetup();
				continue;
			}

			grSet[key] = value;
		}
	}

	/**
	 * Builds a boolean array for matching current state against a preset config.
	 * @param {object} config - The preset configuration object.
	 * @returns {Array<boolean>} - THe array of boolean values for matching.
	 * @private
	 */
	_buildPresetMatchArray(config) {
		const {
			THEME, CTHEME, NIGHTTIME, BEVEL, BLEND, BLEND2, GRAD, GRAD2, ALT, ALT2,
			BW, BW2, BWR, BR, RW, RB, RF, RF2, RFA, RP, RD, RAC,
			TMB, TPB, PBD, PB, PBF, VBD, VB, VBF, BRT
		} = grAlias;

		const themeMatch = config.theme === 'custom' ? CTHEME : THEME === config.theme;

		return [
			themeMatch,
			NIGHTTIME === (config.styleNighttime || false),
			BEVEL === (config.styleBevel || false),
			BLEND === (config.styleBlend || false),
			BLEND2 === (config.styleBlend2 || false),
			GRAD === (config.styleGradient || false),
			GRAD2 === (config.styleGradient2 || false),
			ALT === (config.styleAlternative || false),
			ALT2 === (config.styleAlternative2 || false),
			BW === (config.styleBlackAndWhite || false),
			BW2 === (config.styleBlackAndWhite2 || false),
			BWR === (config.styleBlackAndWhiteReborn || false),
			BR === (config.styleBlackReborn || false),
			RW === (config.styleRebornWhite || false),
			RB === (config.styleRebornBlack || false),
			RF === (config.styleRebornFusion || false),
			RF2 === (config.styleRebornFusion2 || false),
			RFA === (config.styleRebornFusionAccent || false),
			RP === (config.styleRandomPastel || false),
			RD === (config.styleRandomDark || false),
			RAC === (config.styleRandomAutoColor || 'off'),
			TMB === (config.styleTopMenuButtons || 'default'),
			TPB === (config.styleTransportButtons || 'default'),
			PBD === (config.styleProgressBarDesign || 'default'),
			PB === (config.styleProgressBar || 'default'),
			PBF === (config.styleProgressBarFill || 'default'),
			VBD === (config.styleVolumeBarDesign || 'default'),
			VB === (config.styleVolumeBar || 'default'),
			VBF === (config.styleVolumeBarFill || 'default'),
			BRT === (config.themeBrightness || 'default')
		];
	}

	/**
	 * Initializes the custom theme and if no custom theme is currently active, select one randomly from the list.
	 * @private
	 */
	_customThemeSetup() {
		const customTheme = [
			'custom01', 'custom02', 'custom03', 'custom04', 'custom05',
			'custom06', 'custom07', 'custom08', 'custom09', 'custom10'
		];

		if (!customTheme.includes(grSet.theme)) {
			grSet.theme = customTheme[Math.floor(Math.random() * customTheme.length)];
		}

		grm.ui.initCustomTheme();
	}

	/**
	 * Filters presets based on harmonic color matching.
	 * @param {Array<string>} eligiblePresets - The array of preset IDs to filter.
	 * @returns {Array<string>} - The filtered array of preset IDs that match current color harmony.
	 * @private
	 */
	_getHarmonicPresets(eligiblePresets) {
		const lightThemes  = ['white'];
		const darkThemes   = ['black', 'nblue', 'ngreen', 'nred', 'ngold'];
		const fusionThemes = ['reborn']; // Fusion presets
		const middleThemes = ['reborn']; // Non-fusion reborn presets

		let targetThemes = [];

		// Determine which theme category matches current colors
		if (grCol.colLuminance > 0.60 || grCol.imgLuminance > 0.50) {
			// Light colors
			targetThemes = lightThemes;
		}
		else if (grCol.colLuminance < 0.02 || grCol.imgLuminance < 0.20) {
			// Dark colors
			targetThemes = darkThemes;
		}
		else if (ColorDistance(grCol.primary, grCol.secondary) > 0.60) {
			// High color contrast - fusion presets
			return eligiblePresets.filter(presetId => {
				const config = this.PRESET_CONFIGS[presetId];
				return fusionThemes.includes(config.theme) &&
					(config.styleRebornFusion || config.styleRebornFusion2 || config.styleRebornFusionAccent);
			});
		}
		else {
			// Middle range
			targetThemes = middleThemes;
		}

		return eligiblePresets.filter(presetId => {
			const config = this.PRESET_CONFIGS[presetId];
			return targetThemes.includes(config.theme);
		});
	}

	/**
	 * Gets all preset IDs for a given theme.
	 * @param {string} theme - The theme name (e.g. 'white', 'black', 'reborn').
	 * @returns {Array<string>} - The array of preset IDs for the theme.
	 * @private
	 */
	_getPresetsForTheme(theme) {
		return Object.keys(this.PRESET_CONFIGS).filter(presetId => {
			const config = this.PRESET_CONFIGS[presetId];
			return config.theme === theme;
		});
	}

	/**
	 * Gets theme preset information about total and unique presets and if a preset is active.
	 * @param {Array} themePresets - The array of theme preset objects.
	 * @private
	 */
	_getThemePresetInfo(themePresets) {
		const uniquePresets = new Set(themePresets.map(preset => {
			const filteredValue = preset.value.slice(1);
			return JSON.stringify(filteredValue);
		}));

		grm.ui.themeNotification = `Theme presets:\nTotal: ${themePresets.length}\nUnique: ${uniquePresets.size}\n\nActive preset:\n${grm.ui.themePresetName || 'none'}`;
	}

	/**
	 * Hides the theme preset indicator after a specified time.
	 * @param {number} time - The time in milliseconds to hide the theme preset indicator.
	 * @private
	 */
	_hideThemePresetIndicator(time) {
		grm.ui.clearTimer('presetIndicator');

		grm.ui.presetIndicatorTimer = setTimeout(() => {
			grm.ui.themePresetName = '';
			grm.ui.themeNotification = '';
			grm.ui.clearTimer('presetIndicator');
			window.Repaint();
		}, time);
	}

	/**
	 * Initializes and dynamically creates all preset methods.
	 * This allows calling presets like: grm.preset.whiteP01();
	 * @private
	 */
	_initThemePresetMethods() {
		for (const presetId of Object.keys(this.PRESET_CONFIGS)) {
			this[presetId] = function() {
				this._applyPresetConfig(presetId);
			};
		}
	}

	/**
	 * Picks a random theme preset based on the current theme preset settings.
	 * @private
	 */
	_pickRandomThemePreset() {
		const presetSelections = {
			presetSelectWhite:    'white',
			presetSelectBlack:    'black',
			presetSelectReborn:   'reborn',
			presetSelectRandom:   'random',
			presetSelectBlue:     'blue',
			presetSelectDarkblue: 'darkblue',
			presetSelectRed:      'red',
			presetSelectCream:    'cream',
			presetSelectNblue:    'nblue',
			presetSelectNgreen:   'ngreen',
			presetSelectNred:     'nred',
			presetSelectNgold:    'ngold'
		};

		const presetPool = [];

		// Populate the pool based on user settings
		for (const [setting, themeName] of Object.entries(presetSelections)) {
			if (grSet[setting]) {
				presetPool.push(...this._getPresetsForTheme(themeName));
			}
		}

		if (grSet.presetSelectCustom) {
			const customPresets = this._getPresetsForTheme('custom');

			// Custom themes get 10x weight (since there are 10 custom theme slots)
			for (let i = 0; i < 10; i++) {
				presetPool.push(...customPresets);
			}
		}

		// Default to whiteP01 if no presets selected
		if (presetPool.length === 0) {
			this._applyPresetConfig('whiteP01');
			return;
		}

		let selectionPool = presetPool;

		// For harmonic mode, filter presets based on current colors
		if (grSet.presetSelectMode === 'harmonic') {
			const harmonicPresets = this._getHarmonicPresets(presetPool);
			if (harmonicPresets.length > 0) {
				selectionPool = harmonicPresets;
			}
		}

		const randomIndex = Math.floor(Math.random() * selectionPool.length);
		this._applyPresetConfig(selectionPool[randomIndex]);
	}

	/**
	 * Resets all style properties to their default values.
	 * @private
	 */
	_resetStyleDefaults() {
		grSet.styleNighttime = false;
		grSet.styleBevel = false;
		grSet.styleBlend = false;
		grSet.styleBlend2 = false;
		grSet.styleGradient = false;
		grSet.styleGradient2 = false;
		grSet.styleAlternative = false;
		grSet.styleAlternative2 = false;
		grSet.styleBlackAndWhite = false;
		grSet.styleBlackAndWhite2 = false;
		grSet.styleBlackAndWhiteReborn = false;
		grSet.styleBlackReborn = false;
		grSet.styleRebornWhite = false;
		grSet.styleRebornBlack = false;
		grSet.styleRebornFusion = false;
		grSet.styleRebornFusion2 = false;
		grSet.styleRebornFusionAccent = false;
		grSet.styleRandomPastel = false;
		grSet.styleRandomDark = false;
		grSet.styleRandomAutoColor = 'off';
		grSet.styleTopMenuButtons = 'default';
		grSet.styleTransportButtons = 'default';
		grSet.styleProgressBarDesign = 'default';
		grSet.styleProgressBar = 'default';
		grSet.styleProgressBarFill = 'default';
		grSet.styleVolumeBarDesign = 'default';
		grSet.styleVolumeBar = 'default';
		grSet.styleVolumeBarFill = 'default';
		grSet.themeBrightness = 'default';
	}

	/**
	 * Sets and applies a new random theme preset.
	 * @private
	 */
	_setRandomThemePreset() {
		grm.ui.resetStyle('all');
		this._pickRandomThemePreset();
		grm.ui.updateStyle();
		grm.day.applyFoobarTheme();
		grm.ui.themePresetMatchMode = false;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Theme preset initialization to determine if active styles match any theme presets.
	 * Checks when user uses top menu Options > Style.
	 * @param {boolean} info - Displays the total and unique number of theme presets and if a preset is active or not.
	 */
	initThemePresetState(info) {
		grAlias.update();

		// Build theme presets array for matching
		const themePresets = Object.entries(this.PRESET_CONFIGS).map(([presetId, config]) => ({
			preset: presetId,
			name: config.name,
			value: this._buildPresetMatchArray(config)
		}));

		grSet.preset = false;
		grm.ui.themePresetName = '';

		for (const themePreset of themePresets) {
			if (themePreset.value.every(Boolean)) {
				grSet.preset = themePreset.preset;
				grm.ui.themePresetName = themePreset.name;
				break; // Found a match, stop looking
			}
		}

		if (info) {
			grSet.presetIndicator = true;
			grm.ui.themePresetMatchMode = false;
			this._getThemePresetInfo(themePresets);
			window.Repaint();
		}

		this._hideThemePresetIndicator(info ? 10000 : 5000);
	}

	/**
	 * Generates a random theme preset, used in Options > Preset > Auto random.
	 */
	generateRandomThemePreset() {
		grm.ui.clearTimer('presetAutoRandomMode');
		grm.ui.themeNotification = '';

		if (grm.ui.hasThemeTags()) return;

		if (['off', 'track', 'album', 'dblclick'].includes(grSet.presetAutoRandomMode)) {
			this._setRandomThemePreset();
		} else {
			grm.ui.themePresetIndicator = false;
			grm.ui.presetAutoRandomModeTimer = setInterval(() => {
				if (grm.ui.activeMenu) return;
				this._setRandomThemePreset();
			}, grSet.presetAutoRandomMode);
		}

		if (grCfg.settings.showDebugThemeLog) console.log('preset:', grSet.preset);
	}

	/**
	 * Sets chosen theme preset when using Options > Preset.
	 * @param {string} preset - The name of the theme preset.
	 */
	setThemePreset(preset) {
		if (!this.PRESET_CONFIGS[preset] && typeof this[preset] !== 'function') {
			console.log(`Preset not found: ${preset}`);
			return;
		}

		grm.ui.themePresetMatchMode = false;
		grm.ui.resetStyle('all');

		this[preset](); // Call the dynamically created method
		grm.ui.updateStyle();

		grm.day.applyFoobarTheme();
		grm.details.setDiscArtShadow();
	}

	/**
	 * Applies the user preset configuration.
	 */
	user() {
		grSet.theme = grCfg.customStylePreset.theme;
		grSet.styleNighttime = grCfg.customStylePreset.nighttime;
		grSet.styleBevel = grCfg.customStylePreset.bevel;
		grSet.styleBlend = grCfg.customStylePreset.blend;
		grSet.styleBlend2 = grCfg.customStylePreset.blend2;
		grSet.styleGradient = grCfg.customStylePreset.gradient;
		grSet.styleGradient2 = grCfg.customStylePreset.gradient2;
		grSet.styleAlternative = grCfg.customStylePreset.alternative;
		grSet.styleAlternative2 = grCfg.customStylePreset.alternative2;
		grSet.styleBlackAndWhite = grCfg.customStylePreset.blackAndWhite;
		grSet.styleBlackAndWhite2 = grCfg.customStylePreset.blackAndWhite2;
		grSet.styleBlackAndWhiteReborn = grCfg.customStylePreset.blackAndWhiteReborn;
		grSet.styleBlackReborn = grCfg.customStylePreset.blackReborn;
		grSet.styleRebornWhite = grCfg.customStylePreset.rebornWhite;
		grSet.styleRebornBlack = grCfg.customStylePreset.rebornBlack;
		grSet.styleRebornFusion = grCfg.customStylePreset.rebornFusion;
		grSet.styleRebornFusion2 = grCfg.customStylePreset.rebornFusion2;
		grSet.styleRebornFusionAccent = grCfg.customStylePreset.rebornFusionAccent;
		grSet.styleRandomPastel = grCfg.customStylePreset.randomPastel;
		grSet.styleRandomDark = grCfg.customStylePreset.randomDark;
		grSet.styleRandomAutoColor = grCfg.customStylePreset.randomAutoColor;
		grSet.styleTopMenuButtons = grCfg.customStylePreset.topMenuButtons;
		grSet.styleTransportButtons = grCfg.customStylePreset.transportButtons;
		grSet.styleProgressBarDesign = grCfg.customStylePreset.progressBarDesign;
		grSet.styleProgressBar = grCfg.customStylePreset.progressBar;
		grSet.styleProgressBarFill = grCfg.customStylePreset.progressBarFill;
		grSet.styleVolumeBarDesign = grCfg.customStylePreset.volumeBarDesign;
		grSet.styleVolumeBar = grCfg.customStylePreset.volumeBar;
		grSet.styleVolumeBarFill = grCfg.customStylePreset.volumeBarFill;
		grSet.themeBrightness = grCfg.customStylePreset.themeBrightness;
	}
	// #endregion
}
