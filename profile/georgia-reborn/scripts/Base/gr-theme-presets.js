/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Theme Presets                        * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-12-15                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * THEME PRESETS * //
///////////////////////
/**
 * Contains all theme preset functions that configure various theme and style settings.
 * These theme presets can be accessed through the Options -> Preset menu.
 */
const presets = {
	/////////////////////////////
	// * WHITE THEME PRESETS * //
	/////////////////////////////
	/**
	 * White theme preset -> Options > Preset > White > Beveled.
	 * @returns {void}
	 */
	whiteP01: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * White theme preset -> Options > Preset > White > Black and white.
	 * @returns {void}
	 */
	whiteP02: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleBlackAndWhite = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'default';
		pref.styleVolumeBar = 'inner';
	},

	/**
	 * White theme preset -> Options > Preset > White > Black and white blended.
	 * @returns {void}
	 */
	whiteP03: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleBlackAndWhite = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * White theme preset -> Options > Preset > White > Black and white 2.
	 * @returns {void}
	 */
	whiteP04: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleBlackAndWhite2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * White theme preset -> Options > Preset > White > Black and white 2 blended.
	 * @returns {void}
	 */
	whiteP05: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleBlackAndWhite2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * White theme preset -> Options > Preset > White > Black and white reborn.
	 * @returns {void}
	 */
	whiteP06: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleBlackAndWhiteReborn = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * White theme preset -> Options > Preset > White > Black and white reborn blended.
	 * @returns {void}
	 */
	whiteP07: () => {
		pref.theme = 'white';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleBlackAndWhiteReborn = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * White theme preset -> Options > Preset > White > Minimalized.
	 * @returns {void}
	 */
	whiteP08: () => {
		pref.theme = 'white';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	/////////////////////////////
	// * BLACK THEME PRESETS * //
	/////////////////////////////
	/**
	 * Black theme preset -> Options > Preset > Black > Beveled.
	 * @returns {void}
	 */
	blackP01: () => {
		pref.theme = 'black';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Blended.
	 * @returns {void}
	 */
	blackP02: () => {
		pref.theme = 'black';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Blended alternative.
	 * @returns {void}
	 */
	blackP03: () => {
		pref.theme = 'black';
		pref.styleBlend = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Blended alternative 2.
	 * @returns {void}
	 */
	blackP04: () => {
		pref.theme = 'black';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Black reborn.
	 * @returns {void}
	 */
	blackP05: () => {
		pref.theme = 'black';
		pref.styleBevel = true;
		pref.styleBlackReborn = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Black reborn blended.
	 * @returns {void}
	 */
	blackP06: () => {
		pref.theme = 'black';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleBlackReborn = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Dark gray.
	 * @returns {string|boolean|number}
	 */
	blackP07: () => {
		pref.theme = 'black';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
		pref.themeBrightness = 10;
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Dark gray blended.
	 * @returns {string|boolean|number}
	 */
	blackP08: () => {
		pref.theme = 'black';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Dark gray 2 blended.
	 * @returns {string|boolean|number}
	 */
	blackP09: () => {
		pref.theme = 'black';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Black theme preset -> Options > Preset > Black > Minimalized.
	 * @returns {void}
	 */
	blackP10: () => {
		pref.theme = 'black';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	//////////////////////////////
	// * REBORN THEME PRESETS * //
	//////////////////////////////
	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Beveled.
	 * @returns {void}
	 */
	rebornP01: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Blended.
	 * @returns {void}
	 */
	rebornP02: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Blended 2.
	 * @returns {void}
	 */
	rebornP03: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Gradiented.
	 * @returns {void}
	 */
	rebornP04: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Gradiented 2.
	 * @returns {void}
	 */
	rebornP05: () => {
		pref.theme = 'reborn';
		pref.styleGradient2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Minimalized.
	 * @returns {void}
	 */
	rebornP06: () => {
		pref.theme = 'reborn';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Minimalized blended.
	 * @returns {void}
	 */
	rebornP07: () => {
		pref.theme = 'reborn';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn white beveled.
	 * @returns {void}
	 */
	rebornP08: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleRebornWhite = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn white blended.
	 * @returns {void}
	 */
	rebornP09: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRebornWhite = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn white blended 2.
	 * @returns {void}
	 */
	rebornP10: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleRebornWhite = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black beveled.
	 * @returns {void}
	 */
	rebornP11: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleRebornBlack = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black blended.
	 * @returns {void}
	 */
	rebornP12: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRebornBlack = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black blended 2.
	 * @returns {void}
	 */
	rebornP13: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleRebornBlack = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black gradiented.
	 * @returns {void}
	 */
	rebornP14: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient = true;
		pref.styleRebornBlack = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black gradiented 2.
	 * @returns {void}
	 */
	rebornP15: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient2 = true;
		pref.styleRebornBlack = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion beveled.
	 * @returns {void}
	 */
	rebornP16: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleRebornFusion = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion blended.
	 * @returns {void}
	 */
	rebornP17: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRebornFusion = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion blended 2.
	 * @returns {void}
	 */
	rebornP18: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleRebornFusion = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion gradiented.
	 * @returns {void}
	 */
	rebornP19: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient = true;
		pref.styleRebornFusion = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion gradiented 2.
	 * @returns {void}
	 */
	rebornP20: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient2 = true;
		pref.styleRebornFusion = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 beveled.
	 * @returns {void}
	 */
	rebornP21: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleRebornFusion2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 blended.
	 * @returns {void}
	 */
	rebornP22: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRebornFusion2 = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 blended 2.
	 * @returns {void}
	 */
	rebornP23: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleRebornFusion2 = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 gradiented.
	 * @returns {void}
	 */
	rebornP24: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient = true;
		pref.styleRebornFusion2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 gradiented 2.
	 * @returns {void}
	 */
	rebornP25: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient2 = true;
		pref.styleRebornFusion2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent beveled.
	 * @returns {void}
	 */
	rebornP26: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleRebornFusionAccent = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent blended.
	 * @returns {void}
	 */
	rebornP27: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRebornFusionAccent = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent blended 2.
	 * @returns {void}
	 */
	rebornP28: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleRebornFusionAccent = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent gradiented.
	 * @returns {void}
	 */
	rebornP29: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient = true;
		pref.styleRebornFusionAccent = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent gradiented 2.
	 * @returns {void}
	 */
	rebornP30: () => {
		pref.theme = 'reborn';
		pref.styleBevel = true;
		pref.styleGradient2 = true;
		pref.styleRebornFusionAccent = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},


	//////////////////////////////
	// * RANDOM THEME PRESETS * //
	//////////////////////////////
	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended alternative.
	 * @returns {void}
	 */
	randomP01: () => {
		pref.theme = 'random';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended pastel.
	 * @returns {void}
	 */
	randomP02: () => {
		pref.theme = 'random';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRandomPastel = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended dark.
	 * @returns {void}
	 */
	randomP03: () => {
		pref.theme = 'random';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRandomDark = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended auto dark.
	 * @returns {void}
	 */
	randomP04: () => {
		pref.theme = 'random';
		pref.styleBevel = true;
		pref.styleBlend = true;
		pref.styleRandomDark = true;
		pref.styleRandomAutoColor = 'track';
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled auto dark.
	 * @returns {void}
	 */
	randomP05: () => {
		pref.theme = 'random';
		pref.styleBevel = true;
		pref.styleRandomDark = true;
		pref.styleRandomAutoColor = 'track';
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled dark.
	 * @returns {void}
	 */
	randomP06: () => {
		pref.theme = 'random';
		pref.styleBevel = true;
		pref.styleRandomDark = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Gradiented.
	 * @returns {void}
	 */
	randomP07: () => {
		pref.theme = 'random';
		pref.styleGradient = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Gradiented 2.
	 * @returns {void}
	 */
	randomP08: () => {
		pref.theme = 'random';
		pref.styleGradient2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Minimalized.
	 * @returns {void}
	 */
	randomP09: () => {
		pref.theme = 'random';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},

	/**
	 * Random theme preset -> Options > Preset > Random > Minimalized blended.
	 * @returns {void}
	 */
	randomP10: () => {
		pref.theme = 'random';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	////////////////////////////
	// * BLUE THEME PRESETS * //
	////////////////////////////
	/**
	 * Blue theme preset -> Options > Preset > Blue > Beveled.
	 * @returns {void}
	 */
	blueP01: () => {
		pref.theme = 'blue';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Blue theme preset -> Options > Preset > Blue > Beveled 2.
	 * @returns {void}
	 */
	blueP02: () => {
		pref.theme = 'blue';
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Blue theme preset -> Options > Preset > Blue > Gradiented.
	 * @returns {void}
	 */
	blueP03: () => {
		pref.theme = 'blue';
		pref.styleGradient = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Blue theme preset -> Options > Preset > Blue > Gradiented 2.
	 * @returns {void}
	 */
	blueP04: () => {
		pref.theme = 'blue';
		pref.styleGradient2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Blue theme preset -> Options > Preset > Blue > Minimalized.
	 * @returns {void}
	 */
	blueP05: () => {
		pref.theme = 'blue';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},


	/////////////////////////////////
	// * DARK BLUE THEME PRESETS * //
	/////////////////////////////////
	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Beveled.
	 * @returns {void}
	 */
	darkblueP01: () => {
		pref.theme = 'darkblue';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Beveled 2.
	 * @returns {void}
	 */
	darkblueP02: () => {
		pref.theme = 'darkblue';
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Gradiented.
	 * @returns {void}
	 */
	darkblueP03: () => {
		pref.theme = 'darkblue';
		pref.styleGradient = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Gradiented 2.
	 * @returns {void}
	 */
	darkblueP04: () => {
		pref.theme = 'darkblue';
		pref.styleGradient2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Minimalized.
	 * @returns {void}
	 */
	darkblueP05: () => {
		pref.theme = 'darkblue';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},


	///////////////////////////
	// * RED THEME PRESETS * //
	///////////////////////////
	/**
	 * Red theme preset -> Options > Preset > Red > Beveled.
	 * @returns {void}
	 */
	redP01: () => {
		pref.theme = 'red';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Red theme preset -> Options > Preset > Red > Beveled 2.
	 * @returns {void}
	 */
	redP02: () => {
		pref.theme = 'red';
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Red theme preset -> Options > Preset > Red > Gradiented.
	 * @returns {void}
	 */
	redP03: () => {
		pref.theme = 'red';
		pref.styleGradient = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Red theme preset -> Options > Preset > Red > Gradiented 2.
	 * @returns {void}
	 */
	redP04: () => {
		pref.theme = 'red';
		pref.styleGradient2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Red theme preset -> Options > Preset > Red > Minimalized.
	 * @returns {void}
	 */
	redP05: () => {
		pref.theme = 'red';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},


	/////////////////////////////
	// * CREAM THEME PRESETS * //
	/////////////////////////////
	/**
	 * Cream theme preset -> Options > Preset > Cream > Beveled.
	 * @returns {void}
	 */
	creamP01: () => {
		pref.theme = 'cream';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Cream theme preset -> Options > Preset > Cream > Beveled 2.
	 * @returns {void}
	 */
	creamP02: () => {
		pref.theme = 'cream';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Cream theme preset -> Options > Preset > Cream > Alternative.
	 * @returns {void}
	 */
	creamP03: () => {
		pref.theme = 'cream';
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Cream theme preset -> Options > Preset > Cream > Alternative 2.
	 * @returns {void}
	 */
	creamP04: () => {
		pref.theme = 'cream';
		pref.styleBevel = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Cream theme preset -> Options > Preset > Cream > Minimalized.
	 * @returns {void}
	 */
	creamP05: () => {
		pref.theme = 'cream';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},


	/////////////////////////////////
	// * NEON BLUE THEME PRESETS * //
	/////////////////////////////////
	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Beveled.
	 * @returns {void}
	 */
	nblueP01: () => {
		pref.theme = 'nblue';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Beveled 2.
	 * @returns {void}
	 */
	nblueP02: () => {
		pref.theme = 'nblue';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Blended.
	 * @returns {void}
	 */
	nblueP03: () => {
		pref.theme = 'nblue';
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Blended 2.
	 * @returns {void}
	 */
	nblueP04: () => {
		pref.theme = 'nblue';
		pref.styleBlend2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Alternative.
	 * @returns {void}
	 */
	nblueP05: () => {
		pref.theme = 'nblue';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Alternative 2.
	 * @returns {void}
	 */
	nblueP06: () => {
		pref.theme = 'nblue';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray.
	 * @returns {string|boolean|number}
	 */
	nblueP07: () => {
		pref.theme = 'nblue';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray blended.
	 * @returns {string|boolean|number}
	 */
	nblueP08: () => {
		pref.theme = 'nblue';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray 2 blended.
	 * @returns {string|boolean|number}
	 */
	nblueP09: () => {
		pref.theme = 'nblue';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Minimalized.
	 * @returns {void}
	 */
	nblueP10: () => {
		pref.theme = 'nblue';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	//////////////////////////////////
	// * NEON GREEN THEME PRESETS * //
	//////////////////////////////////
	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Beveled.
	 * @returns {void}
	 */
	ngreenP01: () => {
		pref.theme = 'ngreen';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Beveled 2.
	 * @returns {void}
	 */
	ngreenP02: () => {
		pref.theme = 'ngreen';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Blended.
	 * @returns {void}
	 */
	ngreenP03: () => {
		pref.theme = 'ngreen';
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Blended 2.
	 * @returns {void}
	 */
	ngreenP04: () => {
		pref.theme = 'ngreen';
		pref.styleBlend2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Alternative.
	 * @returns {void}
	 */
	ngreenP05: () => {
		pref.theme = 'ngreen';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Alternative 2.
	 * @returns {void}
	 */
	ngreenP06: () => {
		pref.theme = 'ngreen';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Dark gray.
	 * @returns {string|boolean|number}
	 */
	ngreenP07: () => {
		pref.theme = 'ngreen';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Dark gray blended.
	 * @returns {string|boolean|number}
	 */
	ngreenP08: () => {
		pref.theme = 'ngreen';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Dark gray 2 blended.
	 * @returns {string|boolean|number}
	 */
	ngreenP09: () => {
		pref.theme = 'ngreen';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Minimalized.
	 * @returns {void}
	 */
	ngreenP10: () => {
		pref.theme = 'ngreen';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	////////////////////////////////
	// * NEON RED THEME PRESETS * //
	////////////////////////////////
	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Beveled.
	 * @returns {void}
	 */
	nredP01: () => {
		pref.theme = 'nred';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Beveled 2.
	 * @returns {void}
	 */
	nredP02: () => {
		pref.theme = 'nred';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Blended.
	 * @returns {void}
	 */
	nredP03: () => {
		pref.theme = 'nred';
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Blended 2.
	 * @returns {void}
	 */
	nredP04: () => {
		pref.theme = 'nred';
		pref.styleBlend2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Alternative.
	 * @returns {void}
	 */
	nredP05: () => {
		pref.theme = 'nred';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Alternative 2.
	 * @returns {void}
	 */
	nredP06: () => {
		pref.theme = 'nred';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Dark gray.
	 * @returns {string|boolean|number}
	 */
	nredP07: () => {
		pref.theme = 'nred';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Dark gray blended.
	 * @returns {string|boolean|number}
	 */
	nredP08: () => {
		pref.theme = 'nred';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Dark gray 2 blended.
	 * @returns {string|boolean|number}
	 */
	nredP09: () => {
		pref.theme = 'nred';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Minimalized.
	 * @returns {void}
	 */
	nredP10: () => {
		pref.theme = 'nred';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	/////////////////////////////////
	// * NEON GOLD THEME PRESETS * //
	/////////////////////////////////
	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Beveled.
	 * @returns {void}
	 */
	ngoldP01: () => {
		pref.theme = 'ngold';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Beveled 2.
	 * @returns {void}
	 */
	ngoldP02: () => {
		pref.theme = 'ngold';
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Blended.
	 * @returns {void}
	 */
	ngoldP03: () => {
		pref.theme = 'ngold';
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Blended 2.
	 * @returns {void}
	 */
	ngoldP04: () => {
		pref.theme = 'ngold';
		pref.styleBlend2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Alternative.
	 * @returns {void}
	 */
	ngoldP05: () => {
		pref.theme = 'ngold';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Alternative 2.
	 * @returns {void}
	 */
	ngoldP06: () => {
		pref.theme = 'ngold';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray.
	 * @returns {string|boolean|number}
	 */
	ngoldP07: () => {
		pref.theme = 'ngold';
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray blended.
	 * @returns {string|boolean|number}
	 */
	ngoldP08: () => {
		pref.theme = 'ngold';
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray 2 blended.
	 * @returns {string|boolean|number}
	 */
	ngoldP09: () => {
		pref.theme = 'ngold';
		pref.styleBevel = true;
		pref.styleBlend2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
		pref.themeBrightness = 10;
	},

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Minimalized.
	 * @returns {void}
	 */
	ngoldP10: () => {
		pref.theme = 'ngold';
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	},


	//////////////////////////////
	// * CUSTOM THEME PRESETS * //
	//////////////////////////////
	/**
	 * Initializes the custom theme and if no custom theme is currently active, select one randomly from the list.
	 * @returns {string}
	 */
	customThemeSetup: () => {
		const customTheme = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'];
		if (!customTheme.includes(pref.theme)) pref.theme = customTheme[Math.floor(Math.random() * customTheme.length)]; // If no custom theme active, pick a random one
		initCustomTheme();
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Beveled.
	 * @returns {void}
	 */
	customP01: () => {
		presets.customThemeSetup();
		pref.styleBevel = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Beveled 2.
	 * @returns {void}
	 */
	customP02: () => {
		presets.customThemeSetup();
		pref.styleBevel = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'bevel';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Blended.
	 * @returns {void}
	 */
	customP03: () => {
		presets.customThemeSetup();
		pref.styleBlend = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Blended 2.
	 * @returns {void}
	 */
	customP04: () => {
		presets.customThemeSetup();
		pref.styleBlend2 = true;
		pref.styleTopMenuButtons = 'emboss';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Gradiented.
	 * @returns {void}
	 */
	customP05: () => {
		presets.customThemeSetup();
		pref.styleGradient = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'emboss';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Gradiented 2.
	 * @returns {void}
	 */
	customP06: () => {
		presets.customThemeSetup();
		pref.styleGradient2 = true;
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'bevel';
		pref.styleProgressBar = 'bevel';
		pref.styleProgressBarFill = 'inner';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'bevel';
		pref.styleVolumeBarFill = 'inner';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Alternative.
	 * @returns {void}
	 */
	customP07: () => {
		presets.customThemeSetup();
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Alternative 2.
	 * @returns {void}
	 */
	customP08: () => {
		presets.customThemeSetup();
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'inner';
		pref.styleTransportButtons = 'inner';
		pref.styleProgressBarDesign = 'rounded';
		pref.styleProgressBar = 'inner';
		pref.styleProgressBarFill = 'bevel';
		pref.styleVolumeBarDesign = 'rounded';
		pref.styleVolumeBar = 'inner';
		pref.styleVolumeBarFill = 'bevel';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Minimalized.
	 * @returns {void}
	 */
	customP09: () => {
		presets.customThemeSetup();
		pref.styleAlternative = true;
		pref.styleTopMenuButtons = 'filled';
		pref.styleTransportButtons = 'minimal';
	},

	/**
	 * Custom theme preset -> Options > Preset > Custom > Minimalized blended.
	 * @returns {void}
	 */
	customP10: () => {
		presets.customThemeSetup();
		pref.styleBlend = true;
		pref.styleAlternative2 = true;
		pref.styleTopMenuButtons = 'minimal';
		pref.styleTransportButtons = 'minimal';
	}
};


//////////////////////////
// * SET THEME PRESET * //
//////////////////////////
/**
 * Sets chosen theme preset when using Options > Preset.
 * @param {string} preset The name of the theme preset.
 */
function setThemePreset(preset) {
	if (!Object.prototype.hasOwnProperty.call(presets, preset)) return;
	themePresetMatchMode = false;
	resetStyle('all');
	presets[preset]();
	updateStyle();
}


///////////////////////////////
// * THEME PRESET MATCHING * //
///////////////////////////////
/**
 * Theme preset initialization to determine if active styles match any theme presets, checks when user uses top menu Options > Style.
 */
function initThemePresetState() {
	const THEME  = pref.theme;
	const BEVEL  = pref.styleBevel;
	const BLEND  = pref.styleBlend;
	const BLEND2 = pref.styleBlend2;
	const GRAD   = pref.styleGradient;
	const GRAD2  = pref.styleGradient2;
	const ALT    = pref.styleAlternative;
	const ALT2   = pref.styleAlternative2;
	const BW     = pref.styleBlackAndWhite;
	const BW2    = pref.styleBlackAndWhite2;
	const BWR    = pref.styleBlackAndWhiteReborn;
	const BR     = pref.styleBlackReborn;
	const RW     = pref.styleRebornWhite;
	const RB     = pref.styleRebornBlack;
	const RF     = pref.styleRebornFusion;
	const RF2    = pref.styleRebornFusion2;
	const RFA    = pref.styleRebornFusionAccent;
	const RP     = pref.styleRandomPastel;
	const RD     = pref.styleRandomDark;
	const RAC    = pref.styleRandomAutoColor;
	const TMB    = pref.styleTopMenuButtons;
	const TPB    = pref.styleTransportButtons;
	const PBD    = pref.styleProgressBarDesign;
	const PB     = pref.styleProgressBar;
	const PBF    = pref.styleProgressBarFill;
	const VBD    = pref.styleVolumeBarDesign;
	const VB     = pref.styleVolumeBar;
	const VBF    = pref.styleVolumeBarFill;
	const BRT    = pref.themeBrightness;
	const CTHEME = pref.theme.startsWith('custom');

	const themePresets = [
		// * White theme presets settings
		{ preset: 'whiteP01', name: 'White preset: Beveled',                        value: [THEME === 'white',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR,    !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'default', VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'whiteP02', name: 'White preset: Black and white',                value: [THEME === 'white',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2,  BW, !BW2, !BWR, !BR,    !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'default', VBD === 'default', VB === 'inner',   VBF === 'default', BRT === 'default'] },
		{ preset: 'whiteP03', name: 'White preset: Black and white blended',        value: [THEME === 'white',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2,  BW, !BW2, !BWR, !BR,    !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'whiteP04', name: 'White preset: Black and white 2',              value: [THEME === 'white',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW,  BW2, !BWR, !BR,    !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'whiteP05', name: 'White preset: Black and white 2 blended',      value: [THEME === 'white',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW,  BW2, !BWR, !BR,    !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'default', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'whiteP06', name: 'White preset: Black and white reborn',         value: [THEME === 'white',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, (BW || BW2 || BWR), !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'whiteP07', name: 'White preset: Black and white reborn blended', value: [THEME === 'white',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, (BW || BW2 || BWR), !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'whiteP08', name: 'White preset: Minimalized',                    value: [THEME === 'white', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR,    !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Black theme presets settings
		{ preset: 'blackP01', name: 'Black preset: Beveled',               value: [THEME === 'black', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'bevel',   PBF === 'bevel',   VBD === 'default', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'blackP02', name: 'Black preset: Blended',               value: [THEME === 'black',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'blackP03', name: 'Black preset: Blended alternative',   value: [THEME === 'black', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'blackP04', name: 'Black preset: Blended alternative 2', value: [THEME === 'black', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'blackP05', name: 'Black preset: Black reborn',          value: [THEME === 'black',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR,  BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'blackP06', name: 'Black preset: Black reborn blended',  value: [THEME === 'black',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR,  BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'blackP07', name: 'Black preset: Dark gray',             value: [THEME === 'black', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 10] },
		{ preset: 'blackP08', name: 'Black preset: Dark gray blended',     value: [THEME === 'black', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'blackP09', name: 'Black preset: Dark gray 2 blended',   value: [THEME === 'black',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'blackP10', name: 'Black preset: Minimalized',           value: [THEME === 'black', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Reborn theme presets settings
		{ preset: 'rebornP01', name: 'Reborn preset: Beveled',                           value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP02', name: 'Reborn preset: Blended',                           value: [THEME === 'reborn',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP03', name: 'Reborn preset: Blended 2',                         value: [THEME === 'reborn',  BEVEL,  !BLEND, BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP04', name: 'Reborn preset: Gradiented',                        value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP05', name: 'Reborn preset: Gradiented 2',                      value: [THEME === 'reborn', !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP06', name: 'Reborn preset: Minimalized',                       value: [THEME === 'reborn', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },
		{ preset: 'rebornP07', name: 'Reborn preset: Minimalized blended',               value: [THEME === 'reborn', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },
		{ preset: 'rebornP08', name: 'Reborn preset: Reborn white beveled',              value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR,  RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'default', VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP09', name: 'Reborn preset: Reborn white blended',              value: [THEME === 'reborn',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR,  RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP10', name: 'Reborn preset: Reborn white blended 2',            value: [THEME === 'reborn',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR,  RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP11', name: 'Reborn preset: Reborn black beveled',              value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW,  RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'bevel',   PBF === 'bevel',   VBD === 'default', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP12', name: 'Reborn preset: Reborn black blended',              value: [THEME === 'reborn',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW,  RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP13', name: 'Reborn preset: Reborn black blended 2',            value: [THEME === 'reborn',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW,  RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP14', name: 'Reborn preset: Reborn black gradiented',           value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW,  RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP15', name: 'Reborn preset: Reborn black gradiented 2',         value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW,  RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP16', name: 'Reborn preset: Reborn fusion beveled',             value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB,  RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP17', name: 'Reborn preset: Reborn fusion blended',             value: [THEME === 'reborn',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB,  RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP18', name: 'Reborn preset: Reborn fusion blended 2',           value: [THEME === 'reborn',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB,  RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP19', name: 'Reborn preset: Reborn fusion gradiented',          value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB,  RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP20', name: 'Reborn preset: Reborn fusion gradiented 2',        value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB,  RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP21', name: 'Reborn preset: Reborn fusion 2 beveled',           value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF,  RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP22', name: 'Reborn preset: Reborn fusion 2 blended',           value: [THEME === 'reborn',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF,  RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP23', name: 'Reborn preset: Reborn fusion 2 blended 2',         value: [THEME === 'reborn',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF,  RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP24', name: 'Reborn preset: Reborn fusion 2 gradiented',        value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF,  RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP25', name: 'Reborn preset: Reborn fusion 2 gradiented 2',      value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF,  RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP26', name: 'Reborn preset: Reborn fusion accent beveled',      value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2,  RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP27', name: 'Reborn preset: Reborn fusion accent blended',      value: [THEME === 'reborn',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2,  RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP28', name: 'Reborn preset: Reborn fusion accent blended 2',    value: [THEME === 'reborn',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2,  RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP29', name: 'Reborn preset: Reborn fusion accent gradiented',   value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2,  RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'rebornP30', name: 'Reborn preset: Reborn fusion accent gradiented 2', value: [THEME === 'reborn',  BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2,  RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },

		// * Random theme presets settings
		{ preset: 'randomP01', name: 'Random preset: Beveled blended alternative', value: [THEME === 'random',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off',   TMB === 'filled',  TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP02', name: 'Random preset: Beveled blended pastel',      value: [THEME === 'random',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA,  RP, !RD, RAC === 'off',   TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP03', name: 'Random preset: Beveled blended dark',        value: [THEME === 'random',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP,  RD, RAC === 'off',   TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP04', name: 'Random preset: Beveled blended auto dark',   value: [THEME === 'random',  BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP,  RD, RAC === 'track', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP05', name: 'Random preset: Beveled auto dark',           value: [THEME === 'random',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP,  RD, RAC === 'track', TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP06', name: 'Random preset: Beveled dark',                value: [THEME === 'random',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP,  RD, RAC === 'off',   TMB === 'bevel',   TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP07', name: 'Random preset: Gradiented',                  value: [THEME === 'random', !BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off',   TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP08', name: 'Random preset: Gradiented 2',                value: [THEME === 'random', !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off',   TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'default', PBF === 'inner',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'randomP09', name: 'Random preset: Minimalized',                 value: [THEME === 'random', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off',   TMB === 'filled',  TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },
		{ preset: 'randomP10', name: 'Random preset: Minimalized blended',         value: [THEME === 'random', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off',   TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Blue theme presets settings
		{ preset: 'blueP01', name: 'Blue preset: Beveled',      value: [THEME === 'blue',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'blueP02', name: 'Blue preset: Beveled 2',    value: [THEME === 'blue',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'blueP03', name: 'Blue preset: Gradiented',   value: [THEME === 'blue', !BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'blueP04', name: 'Blue preset: Gradiented 2', value: [THEME === 'blue', !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'bevel',   PBD === 'default', PB === 'bevel',   PBF === 'inner',   VBD === 'rounded', VB === 'bevel',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'blueP05', name: 'Blue preset: Minimalized',  value: [THEME === 'blue', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Dark blue theme presets settings
		{ preset: 'darkblueP01', name: 'Dark blue preset: Beveled',      value: [THEME === 'darkblue',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'darkblueP02', name: 'Dark blue preset: Beveled 2',    value: [THEME === 'darkblue',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'darkblueP03', name: 'Dark blue preset: Gradiented',   value: [THEME === 'darkblue', !BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'darkblueP04', name: 'Dark blue preset: Gradiented 2', value: [THEME === 'darkblue', !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'bevel',   PBD === 'default', PB === 'bevel',   PBF === 'inner',   VBD === 'rounded', VB === 'bevel',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'darkblueP05', name: 'Dark blue preset: Minimalized',  value: [THEME === 'darkblue', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Red theme presets settings
		{ preset: 'redP01', name: 'Red preset: Beveled',      value: [THEME === 'red',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'redP02', name: 'Red preset: Beveled 2',    value: [THEME === 'red',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'redP03', name: 'Red preset: Gradiented',   value: [THEME === 'red', !BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'redP04', name: 'Red preset: Gradiented 2', value: [THEME === 'red', !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'bevel',   PBD === 'default', PB === 'bevel',   PBF === 'inner',   VBD === 'rounded', VB === 'bevel',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'redP05', name: 'Red preset: Minimalized',  value: [THEME === 'red', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Cream theme presets settings
		{ preset: 'creamP01', name: 'Cream preset: Beveled',      value: [THEME === 'cream', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',  TPB === 'bevel',   PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'creamP02', name: 'Cream preset: Beveled 2',    value: [THEME === 'cream',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'creamP03', name: 'Cream preset: Gradiented',   value: [THEME === 'cream',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'inner',   PBD === 'default', PB === 'bevel',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'creamP04', name: 'Cream preset: Gradiented 2', value: [THEME === 'cream',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',  TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'bevel',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'creamP05', name: 'Cream preset: Minimalized',  value: [THEME === 'cream', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Neon blue theme presets settings
		{ preset: 'nblueP01', name: 'Neon blue preset: Beveled',             value: [THEME === 'nblue',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'nblueP02', name: 'Neon blue preset: Beveled 2',           value: [THEME === 'nblue',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'nblueP03', name: 'Neon blue preset: Blended',             value: [THEME === 'nblue', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'nblueP04', name: 'Neon blue preset: Blended 2',           value: [THEME === 'nblue', !BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'nblueP05', name: 'Neon blue preset: Alternative',         value: [THEME === 'nblue', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'nblueP06', name: 'Neon blue preset: Alternative 2',       value: [THEME === 'nblue', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'nblueP07', name: 'Neon blue preset: Dark gray',           value: [THEME === 'nblue', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 10] },
		{ preset: 'nblueP08', name: 'Neon blue preset: Dark gray blended',   value: [THEME === 'nblue', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'nblueP09', name: 'Neon blue preset: Dark gray 2 blended', value: [THEME === 'nblue',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'nblueP10', name: 'Neon blue preset: Minimalized',         value: [THEME === 'nblue', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Neon green theme presets settings
		{ preset: 'ngreenP01', name: 'Neon green preset: Beveled',             value: [THEME === 'ngreen',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'ngreenP02', name: 'Neon green preset: Beveled 2',           value: [THEME === 'ngreen',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'ngreenP03', name: 'Neon green preset: Blended',             value: [THEME === 'ngreen', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'ngreenP04', name: 'Neon green preset: Blended 2',           value: [THEME === 'ngreen', !BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'ngreenP05', name: 'Neon green preset: Alternative',         value: [THEME === 'ngreen', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'ngreenP06', name: 'Neon green preset: Alternative 2',       value: [THEME === 'ngreen', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'ngreenP07', name: 'Neon green preset: Dark gray',           value: [THEME === 'ngreen', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 10] },
		{ preset: 'ngreenP08', name: 'Neon green preset: Dark gray blended',   value: [THEME === 'ngreen', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'ngreenP09', name: 'Neon green preset: Dark gray 2 blended', value: [THEME === 'ngreen',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'ngreenP10', name: 'Neon green preset: Minimalized',         value: [THEME === 'ngreen', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Neon red theme presets settings
		{ preset: 'nredP01', name: 'Neon red preset: Beveled',             value: [THEME === 'nred',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'nredP02', name: 'Neon red preset: Beveled 2',           value: [THEME === 'nred',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'nredP03', name: 'Neon red preset: Blended',             value: [THEME === 'nred', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'nredP04', name: 'Neon red preset: Blended 2',           value: [THEME === 'nred', !BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'nredP05', name: 'Neon red preset: Alternative',         value: [THEME === 'nred', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'nredP06', name: 'Neon red preset: Alternative 2',       value: [THEME === 'nred', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'nredP07', name: 'Neon red preset: Dark gray',           value: [THEME === 'nred', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 10] },
		{ preset: 'nredP08', name: 'Neon red preset: Dark gray blended',   value: [THEME === 'nred', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'nredP09', name: 'Neon red preset: Dark gray 2 blended', value: [THEME === 'nred',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'nredP10', name: 'Neon red preset: Minimalized',         value: [THEME === 'nred', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Neon gold theme presets settings
		{ preset: 'ngoldP01', name: 'Neon gold preset: Beveled',             value: [THEME === 'ngold',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'ngoldP02', name: 'Neon gold preset: Beveled 2',           value: [THEME === 'ngold',  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'default', PB === 'inner',   PBF === 'bevel',   VBD === 'default', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'ngoldP03', name: 'Neon gold preset: Blended',             value: [THEME === 'ngold', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'ngoldP04', name: 'Neon gold preset: Blended 2',           value: [THEME === 'ngold', !BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'ngoldP05', name: 'Neon gold preset: Alternative',         value: [THEME === 'ngold', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'ngoldP06', name: 'Neon gold preset: Alternative 2',       value: [THEME === 'ngold', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'ngoldP07', name: 'Neon gold preset: Dark gray',           value: [THEME === 'ngold', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'default', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 10] },
		{ preset: 'ngoldP08', name: 'Neon gold preset: Dark gray blended',   value: [THEME === 'ngold', !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'ngoldP09', name: 'Neon gold preset: Dark gray 2 blended', value: [THEME === 'ngold',  BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 10] },
		{ preset: 'ngoldP10', name: 'Neon gold preset: Minimalized',         value: [THEME === 'ngold', !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },

		// * Custom theme presets settings
		{ preset: 'customP01', name: `${pref.theme} preset: Beveled`,             value: [CTHEME,  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'customP02', name: `${pref.theme} preset: Beveled 2`,           value: [CTHEME,  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'customP03', name: `${pref.theme} preset: Blended`,             value: [CTHEME, !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'customP04', name: `${pref.theme} preset: Blended 2`,           value: [CTHEME, !BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'customP05', name: `${pref.theme} preset: Gradiented`,          value: [CTHEME, !BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'customP06', name: `${pref.theme} preset: Gradiented 2`,        value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'bevel',   PBD === 'default', PB === 'bevel',   PBF === 'inner',   VBD === 'rounded', VB === 'bevel',   VBF === 'inner',   BRT === 'default'] },
		{ preset: 'customP07', name: `${pref.theme} preset: Alternative`,         value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'customP08', name: `${pref.theme} preset: Alternative 2`,       value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
		{ preset: 'customP09', name: `${pref.theme} preset: Minimalized`,         value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },
		{ preset: 'customP10', name: `${pref.theme} preset: Minimalized blended`, value: [CTHEME, !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] }
	];

	const hidePresetIndicator = () => {
		presetIndicatorTimer = setTimeout(() => {
			themePresetName = '';
			clearTimeout(presetIndicatorTimer);
			presetIndicatorTimer = null;
			window.Repaint();
		}, 5000);
	};

	for (const preset of themePresets) {
		if (preset.value.every(Boolean)) {
			pref.preset = preset.preset;
			themePresetName = preset.name;
			hidePresetIndicator();
			break;
		}
		else {
			pref.preset = false;
			themePresetName = '';
		}
	}
}


/////////////////////////////
// * THEME PRESET PICKER * //
/////////////////////////////
/**
 * Gets a random theme preset, used in Options > Preset > Auto random.
 */
function getRandomThemePreset() {
	clearInterval(presetAutoRandomModeTimer);
	presetAutoRandomModeTimer = null;

	if ($('[%GR_THEME%]') || $('[%GR_STYLE%]') || $('[%GR_PRESET%]')) return;

	const pickRandomPreset = () => {
		let randomThemePreset;
		let lastIndex;

		// * Random presets
		const themePresetsRandom = [
			...pref.presetSelectWhite    ? [presets.whiteP01, presets.whiteP02, presets.whiteP03, presets.whiteP04, presets.whiteP05, presets.whiteP06, presets.whiteP07, presets.whiteP08] : [],
			...pref.presetSelectBlack    ? [presets.blackP01, presets.blackP02, presets.blackP03, presets.blackP04, presets.blackP05, presets.blackP06, presets.blackP07, presets.blackP08, presets.blackP09, presets.blackP10] : [],
			...pref.presetSelectReborn   ? [presets.rebornP01, presets.rebornP02, presets.rebornP03, presets.rebornP04, presets.rebornP05, presets.rebornP06, presets.rebornP07, presets.rebornP08, presets.rebornP09, presets.rebornP10, presets.rebornP11, presets.rebornP12, presets.rebornP13, presets.rebornP14, presets.rebornP15, presets.rebornP16, presets.rebornP17, presets.rebornP18, presets.rebornP19, presets.rebornP20, presets.rebornP21, presets.rebornP22, presets.rebornP23, presets.rebornP24, presets.rebornP25, presets.rebornP26, presets.rebornP27, presets.rebornP28, presets.rebornP29, presets.rebornP30] : [],
			...pref.presetSelectRandom   ? [presets.randomP01, presets.randomP02, presets.randomP03, presets.randomP04, presets.randomP05, presets.randomP06, presets.randomP07, presets.randomP08, presets.randomP09, presets.randomP10] : [],
			...pref.presetSelectBlue     ? [presets.blueP01, presets.blueP02, presets.blueP03, presets.blueP04, presets.blueP05] : [],
			...pref.presetSelectDarkblue ? [presets.darkblueP01, presets.darkblueP02, presets.darkblueP03, presets.darkblueP04, presets.darkblueP05] : [],
			...pref.presetSelectRed      ? [presets.redP01, presets.redP02, presets.redP03, presets.redP04, presets.redP05] : [],
			...pref.presetSelectCream    ? [presets.creamP01, presets.creamP02, presets.creamP03, presets.creamP04, presets.creamP05] : [],
			...pref.presetSelectNblue    ? [presets.nblueP01, presets.nblueP02, presets.nblueP03, presets.nblueP04, presets.nblueP05, presets.nblueP06, presets.nblueP07, presets.nblueP08, presets.nblueP09, presets.nblueP10] : [],
			...pref.presetSelectNgreen   ? [presets.ngreenP01, presets.ngreenP02, presets.ngreenP03, presets.ngreenP04, presets.ngreenP05, presets.ngreenP06, presets.ngreenP07, presets.ngreenP08, presets.ngreenP09, presets.ngreenP10] : [],
			...pref.presetSelectNred     ? [presets.nredP01, presets.nredP02, presets.nredP03, presets.nredP04, presets.nredP05, presets.nredP06, presets.nredP07, presets.nredP08, presets.nredP09, presets.nredP10] : [],
			...pref.presetSelectNgold    ? [presets.ngoldP01, presets.ngoldP02, presets.ngoldP03, presets.ngoldP04, presets.ngoldP05, presets.ngoldP06, presets.ngoldP07, presets.ngoldP08, presets.ngoldP09, presets.ngoldP10] : [],
			...pref.presetSelectCustom   ? Array(10).fill([presets.customP01, presets.customP02, presets.customP03, presets.customP04, presets.customP05, presets.customP06, presets.customP07, presets.customP08, presets.customP09, presets.customP10]).flat() /* Increase pick probability ten times ( 10 custom themes ) */ : []
		];

		// * Harmonic presets
		const themePresetsLight = [
			...pref.presetSelectWhite  ? [presets.whiteP01, presets.whiteP02, presets.whiteP03, presets.whiteP04, presets.whiteP05, presets.whiteP06, presets.whiteP07, presets.whiteP08] : [],
			...pref.presetSelectReborn ? [presets.rebornP08, presets.rebornP09, presets.rebornP10] : []
		];
		const themePresetsMiddle = [
			...pref.presetSelectReborn ? [presets.rebornP01, presets.rebornP02, presets.rebornP03, presets.rebornP04, presets.rebornP05, presets.rebornP06, presets.rebornP07] : []
		];
		const themePresetsFusion = [
			...pref.presetSelectReborn ? [presets.rebornP16, presets.rebornP17, presets.rebornP18, presets.rebornP19, presets.rebornP20, presets.rebornP21, presets.rebornP22, presets.rebornP23, presets.rebornP24, presets.rebornP25, presets.rebornP26, presets.rebornP27, presets.rebornP28, presets.rebornP29, presets.rebornP30] : []
		];
		const themePresetsDark = [
			...pref.presetSelectBlack  ? [presets.blackP01, presets.blackP02, presets.blackP03, presets.blackP04, presets.blackP05, presets.blackP06, presets.blackP07, presets.blackP08, presets.blackP09, presets.blackP10] : [],
			...pref.presetSelectReborn ? [presets.rebornP11, presets.rebornP12, presets.rebornP13, presets.rebornP14, presets.rebornP15] : [],
			...pref.presetSelectRandom ? [presets.randomP03, presets.randomP06] : [],
			...pref.presetSelectNblue  ? [presets.nblueP01, presets.nblueP02, presets.nblueP03, presets.nblueP04, presets.nblueP05, presets.nblueP06, presets.nblueP07, presets.nblueP08, presets.nblueP09, presets.nblueP10] : [],
			...pref.presetSelectNgreen ? [presets.ngreenP01, presets.ngreenP02, presets.ngreenP03, presets.ngreenP04, presets.ngreenP05, presets.ngreenP06, presets.ngreenP07, presets.ngreenP08, presets.ngreenP09, presets.ngreenP10] : [],
			...pref.presetSelectNred   ? [presets.nredP01, presets.nredP02, presets.nredP03, presets.nredP04, presets.nredP05, presets.nredP06, presets.nredP07, presets.nredP08, presets.nredP09, presets.nredP10] : [],
			...pref.presetSelectNgold  ? [presets.ngoldP01, presets.ngoldP02, presets.ngoldP03, presets.ngoldP04, presets.ngoldP05, presets.ngoldP06, presets.ngoldP07, presets.ngoldP08, presets.ngoldP09, presets.ngoldP10] : []
		];

		if (pref.presetSelectMode === 'harmonic') {
			colBrightness  = new Color(col.primary).brightness;
			colBrightness2 = new Color(col.primary_alt).brightness;
			imgBrightness = CalcImgBrightness(albumArt);

			if (colBrightness > 200 || imgBrightness > 180) { // * Light
				while ((randomThemePreset = Math.floor(Math.random() * themePresetsLight.length)) === lastIndex);
				themePresetsLight[(lastIndex = randomThemePreset)]();
				console.log('themePresetsLight');
			}
			else if (colBrightness < 200 && colBrightness > 50 || imgBrightness < 180 && imgBrightness > 130) { // * Middle
				if (ColorDistance(col.primary, col.primary_alt) > 200) { // * Reborn fusion
					while ((randomThemePreset = Math.floor(Math.random() * themePresetsFusion.length)) === lastIndex);
					themePresetsFusion[(lastIndex = randomThemePreset)]();
					console.log('themePresetsFusion');
				} else {
					while ((randomThemePreset = Math.floor(Math.random() * themePresetsMiddle.length)) === lastIndex);
					themePresetsMiddle[(lastIndex = randomThemePreset)]();
					console.log('themePresetsMiddle');
				}
			}
			else if (colBrightness < 50 || imgBrightness < 130) { // * Dark
				while ((randomThemePreset = Math.floor(Math.random() * themePresetsDark.length)) === lastIndex);
				themePresetsDark[(lastIndex = randomThemePreset)]();
				console.log('themePresetsDark');
			}
		}
		else {
			if (themePresetsRandom.length === 0) return;
			while ((randomThemePreset = Math.floor(Math.random() * themePresetsRandom.length)) === lastIndex);
			themePresetsRandom[(lastIndex = randomThemePreset)]();
		}
	}

	const setRandomPreset = () => {
		resetStyle('all');
		pickRandomPreset();
		updateStyle();
		themePresetMatchMode = false;
	};

	if (['off', 'track', 'album', 'dblclick'].includes(pref.presetAutoRandomMode)) {
		setRandomPreset();
	}
	else {
		themePresetIndicator = false;
		presetAutoRandomModeTimer = setInterval(() => {
			if (activeMenu) return; // * Workaround that pauses when a context menu is active which partially blocks color initialization;
			setRandomPreset();
		}, pref.presetAutoRandomMode);
	}

	if (settings.showThemeLog) console.log('preset:', pref.preset);
}
