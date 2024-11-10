/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Theme Presets                            * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    10-11-2024                                              * //
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
	// * WHITE THEME PRESETS * //
	// #region WHITE THEME PRESETS
	/**
	 * White theme preset -> Options > Preset > White > Beveled.
	 * @returns {void}
	 */
	whiteP01() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * White theme preset -> Options > Preset > White > Black and white.
	 * @returns {void}
	 */
	whiteP02() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleBlackAndWhite = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'default';
		grSet.styleVolumeBar = 'inner';
	}

	/**
	 * White theme preset -> Options > Preset > White > Black and white blended.
	 * @returns {void}
	 */
	whiteP03() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleBlackAndWhite = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * White theme preset -> Options > Preset > White > Black and white 2.
	 * @returns {void}
	 */
	whiteP04() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleBlackAndWhite2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * White theme preset -> Options > Preset > White > Black and white 2 blended.
	 * @returns {void}
	 */
	whiteP05() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleBlackAndWhite2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * White theme preset -> Options > Preset > White > Black and white reborn.
	 * @returns {void}
	 */
	whiteP06() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleBlackAndWhiteReborn = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * White theme preset -> Options > Preset > White > Black and white reborn blended.
	 * @returns {void}
	 */
	whiteP07() {
		grSet.theme = 'white';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleBlackAndWhiteReborn = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * White theme preset -> Options > Preset > White > Minimalized.
	 * @returns {void}
	 */
	whiteP08() {
		grSet.theme = 'white';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * BLACK THEME PRESETS * //
	// #region BLACK THEME PRESETS
	/**
	 * Black theme preset -> Options > Preset > Black > Beveled.
	 * @returns {void}
	 */
	blackP01() {
		grSet.theme = 'black';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Blended.
	 * @returns {void}
	 */
	blackP02() {
		grSet.theme = 'black';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Blended alternative.
	 * @returns {void}
	 */
	blackP03() {
		grSet.theme = 'black';
		grSet.styleBlend = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Blended alternative 2.
	 * @returns {void}
	 */
	blackP04() {
		grSet.theme = 'black';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Black reborn.
	 * @returns {void}
	 */
	blackP05() {
		grSet.theme = 'black';
		grSet.styleBevel = true;
		grSet.styleBlackReborn = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Black reborn blended.
	 * @returns {void}
	 */
	blackP06() {
		grSet.theme = 'black';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleBlackReborn = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Dark gray.
	 * @returns {void}
	 */
	blackP07() {
		grSet.theme = 'black';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
		grSet.themeBrightness = 10;
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Dark gray blended.
	 * @returns {void}
	 */
	blackP08() {
		grSet.theme = 'black';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Dark gray 2 blended.
	 * @returns {void}
	 */
	blackP09() {
		grSet.theme = 'black';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Black theme preset -> Options > Preset > Black > Minimalized.
	 * @returns {void}
	 */
	blackP10() {
		grSet.theme = 'black';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * REBORN THEME PRESETS * //
	// #region REBORN THEME PRESETS
	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Beveled.
	 * @returns {void}
	 */
	rebornP01() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Blended.
	 * @returns {void}
	 */
	rebornP02() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Blended 2.
	 * @returns {void}
	 */
	rebornP03() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Gradiented.
	 * @returns {void}
	 */
	rebornP04() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Gradiented 2.
	 * @returns {void}
	 */
	rebornP05() {
		grSet.theme = 'reborn';
		grSet.styleGradient2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Minimalized.
	 * @returns {void}
	 */
	rebornP06() {
		grSet.theme = 'reborn';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Minimalized blended.
	 * @returns {void}
	 */
	rebornP07() {
		grSet.theme = 'reborn';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn white beveled.
	 * @returns {void}
	 */
	rebornP08() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleRebornWhite = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn white blended.
	 * @returns {void}
	 */
	rebornP09() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRebornWhite = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn white blended 2.
	 * @returns {void}
	 */
	rebornP10() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleRebornWhite = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black beveled.
	 * @returns {void}
	 */
	rebornP11() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleRebornBlack = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black blended.
	 * @returns {void}
	 */
	rebornP12() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRebornBlack = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black blended 2.
	 * @returns {void}
	 */
	rebornP13() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleRebornBlack = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black gradiented.
	 * @returns {void}
	 */
	rebornP14() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient = true;
		grSet.styleRebornBlack = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn black gradiented 2.
	 * @returns {void}
	 */
	rebornP15() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient2 = true;
		grSet.styleRebornBlack = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion beveled.
	 * @returns {void}
	 */
	rebornP16() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleRebornFusion = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion blended.
	 * @returns {void}
	 */
	rebornP17() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRebornFusion = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion blended 2.
	 * @returns {void}
	 */
	rebornP18() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleRebornFusion = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion gradiented.
	 * @returns {void}
	 */
	rebornP19() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient = true;
		grSet.styleRebornFusion = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion gradiented 2.
	 * @returns {void}
	 */
	rebornP20() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient2 = true;
		grSet.styleRebornFusion = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 beveled.
	 * @returns {void}
	 */
	rebornP21() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleRebornFusion2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 blended.
	 * @returns {void}
	 */
	rebornP22() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRebornFusion2 = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 blended 2.
	 * @returns {void}
	 */
	rebornP23() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleRebornFusion2 = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 gradiented.
	 * @returns {void}
	 */
	rebornP24() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient = true;
		grSet.styleRebornFusion2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 gradiented 2.
	 * @returns {void}
	 */
	rebornP25() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient2 = true;
		grSet.styleRebornFusion2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent beveled.
	 * @returns {void}
	 */
	rebornP26() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleRebornFusionAccent = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent blended.
	 * @returns {void}
	 */
	rebornP27() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRebornFusionAccent = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent blended 2.
	 * @returns {void}
	 */
	rebornP28() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleRebornFusionAccent = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent gradiented.
	 * @returns {void}
	 */
	rebornP29() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient = true;
		grSet.styleRebornFusionAccent = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent gradiented 2.
	 * @returns {void}
	 */
	rebornP30() {
		grSet.theme = 'reborn';
		grSet.styleBevel = true;
		grSet.styleGradient2 = true;
		grSet.styleRebornFusionAccent = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}
	// #endregion

	// * RANDOM THEME PRESETS * //
	// #region RANDOM THEME PRESETS
	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended alternative.
	 * @returns {void}
	 */
	randomP01() {
		grSet.theme = 'random';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended pastel.
	 * @returns {void}
	 */
	randomP02() {
		grSet.theme = 'random';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRandomPastel = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended dark.
	 * @returns {void}
	 */
	randomP03() {
		grSet.theme = 'random';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRandomDark = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled blended auto dark.
	 * @returns {void}
	 */
	randomP04() {
		grSet.theme = 'random';
		grSet.styleBevel = true;
		grSet.styleBlend = true;
		grSet.styleRandomDark = true;
		grSet.styleRandomAutoColor = 'track';
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled auto dark.
	 * @returns {void}
	 */
	randomP05() {
		grSet.theme = 'random';
		grSet.styleBevel = true;
		grSet.styleRandomDark = true;
		grSet.styleRandomAutoColor = 'track';
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Beveled dark.
	 * @returns {void}
	 */
	randomP06() {
		grSet.theme = 'random';
		grSet.styleBevel = true;
		grSet.styleRandomDark = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Gradiented.
	 * @returns {void}
	 */
	randomP07() {
		grSet.theme = 'random';
		grSet.styleGradient = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Gradiented 2.
	 * @returns {void}
	 */
	randomP08() {
		grSet.theme = 'random';
		grSet.styleGradient2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Minimalized.
	 * @returns {void}
	 */
	randomP09() {
		grSet.theme = 'random';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}

	/**
	 * Random theme preset -> Options > Preset > Random > Minimalized blended.
	 * @returns {void}
	 */
	randomP10() {
		grSet.theme = 'random';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * BLUE THEME PRESETS * //
	// #region BLUE THEME PRESETS
	/**
	 * Blue theme preset -> Options > Preset > Blue > Beveled.
	 * @returns {void}
	 */
	blueP01() {
		grSet.theme = 'blue';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Blue theme preset -> Options > Preset > Blue > Beveled 2.
	 * @returns {void}
	 */
	blueP02() {
		grSet.theme = 'blue';
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Blue theme preset -> Options > Preset > Blue > Gradiented.
	 * @returns {void}
	 */
	blueP03() {
		grSet.theme = 'blue';
		grSet.styleGradient = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Blue theme preset -> Options > Preset > Blue > Gradiented 2.
	 * @returns {void}
	 */
	blueP04() {
		grSet.theme = 'blue';
		grSet.styleGradient2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Blue theme preset -> Options > Preset > Blue > Minimalized.
	 * @returns {void}
	 */
	blueP05() {
		grSet.theme = 'blue';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * DARK BLUE THEME PRESETS * //
	// #region DARK BLUE THEME PRESETS
	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Beveled.
	 * @returns {void}
	 */
	darkblueP01() {
		grSet.theme = 'darkblue';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Beveled 2.
	 * @returns {void}
	 */
	darkblueP02() {
		grSet.theme = 'darkblue';
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Gradiented.
	 * @returns {void}
	 */
	darkblueP03() {
		grSet.theme = 'darkblue';
		grSet.styleGradient = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Gradiented 2.
	 * @returns {void}
	 */
	darkblueP04() {
		grSet.theme = 'darkblue';
		grSet.styleGradient2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Dark blue theme preset -> Options > Preset > Dark blue > Minimalized.
	 * @returns {void}
	 */
	darkblueP05() {
		grSet.theme = 'darkblue';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * RED THEME PRESETS * //
	// #region RED THEME PRESETS
	/**
	 * Red theme preset -> Options > Preset > Red > Beveled.
	 * @returns {void}
	 */
	redP01() {
		grSet.theme = 'red';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Red theme preset -> Options > Preset > Red > Beveled 2.
	 * @returns {void}
	 */
	redP02() {
		grSet.theme = 'red';
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Red theme preset -> Options > Preset > Red > Gradiented.
	 * @returns {void}
	 */
	redP03() {
		grSet.theme = 'red';
		grSet.styleGradient = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Red theme preset -> Options > Preset > Red > Gradiented 2.
	 * @returns {void}
	 */
	redP04() {
		grSet.theme = 'red';
		grSet.styleGradient2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Red theme preset -> Options > Preset > Red > Minimalized.
	 * @returns {void}
	 */
	redP05() {
		grSet.theme = 'red';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * CREAM THEME PRESETS * //
	// #region CREAM THEME PRESETS
	/**
	 * Cream theme preset -> Options > Preset > Cream > Beveled.
	 * @returns {void}
	 */
	creamP01() {
		grSet.theme = 'cream';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Cream theme preset -> Options > Preset > Cream > Beveled 2.
	 * @returns {void}
	 */
	creamP02() {
		grSet.theme = 'cream';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Cream theme preset -> Options > Preset > Cream > Alternative.
	 * @returns {void}
	 */
	creamP03() {
		grSet.theme = 'cream';
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Cream theme preset -> Options > Preset > Cream > Alternative 2.
	 * @returns {void}
	 */
	creamP04() {
		grSet.theme = 'cream';
		grSet.styleBevel = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Cream theme preset -> Options > Preset > Cream > Minimalized.
	 * @returns {void}
	 */
	creamP05() {
		grSet.theme = 'cream';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * NEON BLUE THEME PRESETS * //
	// #region NEON BLUE THEME PRESETS
	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Beveled.
	 * @returns {void}
	 */
	nblueP01() {
		grSet.theme = 'nblue';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Beveled 2.
	 * @returns {void}
	 */
	nblueP02() {
		grSet.theme = 'nblue';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Blended.
	 * @returns {void}
	 */
	nblueP03() {
		grSet.theme = 'nblue';
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Blended 2.
	 * @returns {void}
	 */
	nblueP04() {
		grSet.theme = 'nblue';
		grSet.styleBlend2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Alternative.
	 * @returns {void}
	 */
	nblueP05() {
		grSet.theme = 'nblue';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Alternative 2.
	 * @returns {void}
	 */
	nblueP06() {
		grSet.theme = 'nblue';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray.
	 * @returns {void}
	 */
	nblueP07() {
		grSet.theme = 'nblue';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray blended.
	 * @returns {void}
	 */
	nblueP08() {
		grSet.theme = 'nblue';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray 2 blended.
	 * @returns {void}
	 */
	nblueP09() {
		grSet.theme = 'nblue';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon blue theme preset -> Options > Preset > Neon blue > Minimalized.
	 * @returns {void}
	 */
	nblueP10() {
		grSet.theme = 'nblue';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * NEON GREEN THEME PRESETS * //
	// #region NEON GREEN THEME PRESETS
	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Beveled.
	 * @returns {void}
	 */
	ngreenP01() {
		grSet.theme = 'ngreen';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Beveled 2.
	 * @returns {void}
	 */
	ngreenP02() {
		grSet.theme = 'ngreen';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Blended.
	 * @returns {void}
	 */
	ngreenP03() {
		grSet.theme = 'ngreen';
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Blended 2.
	 * @returns {void}
	 */
	ngreenP04() {
		grSet.theme = 'ngreen';
		grSet.styleBlend2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Alternative.
	 * @returns {void}
	 */
	ngreenP05() {
		grSet.theme = 'ngreen';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Alternative 2.
	 * @returns {void}
	 */
	ngreenP06() {
		grSet.theme = 'ngreen';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Dark gray.
	 * @returns {void}
	 */
	ngreenP07() {
		grSet.theme = 'ngreen';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Dark gray blended.
	 * @returns {void}
	 */
	ngreenP08() {
		grSet.theme = 'ngreen';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Dark gray 2 blended.
	 * @returns {void}
	 */
	ngreenP09() {
		grSet.theme = 'ngreen';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon green theme preset -> Options > Preset > Neon green > Minimalized.
	 * @returns {void}
	 */
	ngreenP10() {
		grSet.theme = 'ngreen';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * NEON RED THEME PRESETS * //
	// #region NEON RED THEME PRESETS
	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Beveled.
	 * @returns {void}
	 */
	nredP01() {
		grSet.theme = 'nred';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Beveled 2.
	 * @returns {void}
	 */
	nredP02() {
		grSet.theme = 'nred';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Blended.
	 * @returns {void}
	 */
	nredP03() {
		grSet.theme = 'nred';
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Blended 2.
	 * @returns {void}
	 */
	nredP04() {
		grSet.theme = 'nred';
		grSet.styleBlend2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Alternative.
	 * @returns {void}
	 */
	nredP05() {
		grSet.theme = 'nred';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Alternative 2.
	 * @returns {void}
	 */
	nredP06() {
		grSet.theme = 'nred';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Dark gray.
	 * @returns {void}
	 */
	nredP07() {
		grSet.theme = 'nred';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Dark gray blended.
	 * @returns {void}
	 */
	nredP08() {
		grSet.theme = 'nred';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Dark gray 2 blended.
	 * @returns {void}
	 */
	nredP09() {
		grSet.theme = 'nred';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon red theme preset -> Options > Preset > Neon red > Minimalized.
	 * @returns {void}
	 */
	nredP10() {
		grSet.theme = 'nred';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * NEON GOLD THEME PRESETS * //
	// #region NEON GOLD THEME PRESETS
	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Beveled.
	 * @returns {void}
	 */
	ngoldP01() {
		grSet.theme = 'ngold';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Beveled 2.
	 * @returns {void}
	 */
	ngoldP02() {
		grSet.theme = 'ngold';
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Blended.
	 * @returns {void}
	 */
	ngoldP03() {
		grSet.theme = 'ngold';
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Blended 2.
	 * @returns {void}
	 */
	ngoldP04() {
		grSet.theme = 'ngold';
		grSet.styleBlend2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Alternative.
	 * @returns {void}
	 */
	ngoldP05() {
		grSet.theme = 'ngold';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Alternative 2.
	 * @returns {void}
	 */
	ngoldP06() {
		grSet.theme = 'ngold';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray.
	 * @returns {void}
	 */
	ngoldP07() {
		grSet.theme = 'ngold';
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray blended.
	 * @returns {void}
	 */
	ngoldP08() {
		grSet.theme = 'ngold';
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray 2 blended.
	 * @returns {void}
	 */
	ngoldP09() {
		grSet.theme = 'ngold';
		grSet.styleBevel = true;
		grSet.styleBlend2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
		grSet.themeBrightness = 10;
	}

	/**
	 * Neon gold theme preset -> Options > Preset > Neon gold > Minimalized.
	 * @returns {void}
	 */
	ngoldP10() {
		grSet.theme = 'ngold';
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}
	// #endregion

	// * CUSTOM THEME PRESETS * //
	// #region CUSTOM THEME PRESETS
	/**
	 * Initializes the custom theme and if no custom theme is currently active, select one randomly from the list.
	 */
	customThemeSetup() {
		const customTheme = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'];
		if (!customTheme.includes(grSet.theme)) grSet.theme = customTheme[Math.floor(Math.random() * customTheme.length)]; // If no custom theme active, pick a random one
		grm.ui.initCustomTheme();
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Beveled.
	 * @returns {void}
	 */
	customP01() {
		this.customThemeSetup();
		grSet.styleBevel = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Beveled 2.
	 * @returns {void}
	 */
	customP02() {
		this.customThemeSetup();
		grSet.styleBevel = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'bevel';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Blended.
	 * @returns {void}
	 */
	customP03() {
		this.customThemeSetup();
		grSet.styleBlend = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Blended 2.
	 * @returns {void}
	 */
	customP04() {
		this.customThemeSetup();
		grSet.styleBlend2 = true;
		grSet.styleTopMenuButtons = 'emboss';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Gradiented.
	 * @returns {void}
	 */
	customP05() {
		this.customThemeSetup();
		grSet.styleGradient = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'emboss';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Gradiented 2.
	 * @returns {void}
	 */
	customP06() {
		this.customThemeSetup();
		grSet.styleGradient2 = true;
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'bevel';
		grSet.styleProgressBar = 'bevel';
		grSet.styleProgressBarFill = 'inner';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'bevel';
		grSet.styleVolumeBarFill = 'inner';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Alternative.
	 * @returns {void}
	 */
	customP07() {
		this.customThemeSetup();
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Alternative 2.
	 * @returns {void}
	 */
	customP08() {
		this.customThemeSetup();
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'inner';
		grSet.styleTransportButtons = 'inner';
		grSet.styleProgressBarDesign = 'rounded';
		grSet.styleProgressBar = 'inner';
		grSet.styleProgressBarFill = 'bevel';
		grSet.styleVolumeBarDesign = 'rounded';
		grSet.styleVolumeBar = 'inner';
		grSet.styleVolumeBarFill = 'bevel';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Minimalized.
	 * @returns {void}
	 */
	customP09() {
		this.customThemeSetup();
		grSet.styleAlternative = true;
		grSet.styleTopMenuButtons = 'filled';
		grSet.styleTransportButtons = 'minimal';
	}

	/**
	 * Custom theme preset -> Options > Preset > Custom > Minimalized blended.
	 * @returns {void}
	 */
	customP10() {
		this.customThemeSetup();
		grSet.styleBlend = true;
		grSet.styleAlternative2 = true;
		grSet.styleTopMenuButtons = 'minimal';
		grSet.styleTransportButtons = 'minimal';
	}

	/**
	 * Custom theme preset -> Options > Preset > User preset > User settings.
	 * @returns {void}
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

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Initializes theme presets and sets the active preset if conditions are met.
	 * @param {Array} themePresets - An array of theme preset objects.
	 * @returns {boolean} - Returns true if a valid preset is found and set, otherwise false.
	 * @private
	 */
	_initThemePresets(themePresets) {
		for (const preset of themePresets) {
			if (preset.value.every(Boolean)) {
				grSet.preset = preset.preset;
				grm.ui.themePresetName = preset.name;
				return true;
			}
			grSet.preset = false;
			grm.ui.themePresetName = '';
		}

		return false;
	}

	/**
	 * Gets theme preset information about total and unique presets and if a preset is active.
	 * @param {Array} themePresets - An array of theme preset objects.
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
	 * @param {number} ms - The time in milliseconds to hide the theme preset indicator.
	 * @private
	 */
	_hideThemePresetIndicator(ms) {
		grm.ui.clearTimer('presetIndicator');
		grm.ui.presetIndicatorTimer = setTimeout(() => {
			grm.ui.themePresetName = '';
			grm.ui.themeNotification = '';
			grm.ui.clearTimer('presetIndicator');
			window.Repaint();
		}, ms);
	}

	/**
	 * Picks a random theme preset based on the current theme preset settings.
	 * @private
	 */
	_pickRandomThemePreset() {
		let randomThemePreset;

		// * Random presets
		const themePresetsRandom = [
			...grSet.presetSelectWhite    ? [this.whiteP01, this.whiteP02, this.whiteP03, this.whiteP04, this.whiteP05, this.whiteP06, this.whiteP07, this.whiteP08] : [],
			...grSet.presetSelectBlack    ? [this.blackP01, this.blackP02, this.blackP03, this.blackP04, this.blackP05, this.blackP06, this.blackP07, this.blackP08, this.blackP09, this.blackP10] : [],
			...grSet.presetSelectReborn   ? [this.rebornP01, this.rebornP02, this.rebornP03, this.rebornP04, this.rebornP05, this.rebornP06, this.rebornP07, this.rebornP08, this.rebornP09, this.rebornP10, this.rebornP11, this.rebornP12, this.rebornP13, this.rebornP14, this.rebornP15, this.rebornP16, this.rebornP17, this.rebornP18, this.rebornP19, this.rebornP20, this.rebornP21, this.rebornP22, this.rebornP23, this.rebornP24, this.rebornP25, this.rebornP26, this.rebornP27, this.rebornP28, this.rebornP29, this.rebornP30] : [],
			...grSet.presetSelectRandom   ? [this.randomP01, this.randomP02, this.randomP03, this.randomP04, this.randomP05, this.randomP06, this.randomP07, this.randomP08, this.randomP09, this.randomP10] : [],
			...grSet.presetSelectBlue     ? [this.blueP01, this.blueP02, this.blueP03, this.blueP04, this.blueP05] : [],
			...grSet.presetSelectDarkblue ? [this.darkblueP01, this.darkblueP02, this.darkblueP03, this.darkblueP04, this.darkblueP05] : [],
			...grSet.presetSelectRed      ? [this.redP01, this.redP02, this.redP03, this.redP04, this.redP05] : [],
			...grSet.presetSelectCream    ? [this.creamP01, this.creamP02, this.creamP03, this.creamP04, this.creamP05] : [],
			...grSet.presetSelectNblue    ? [this.nblueP01, this.nblueP02, this.nblueP03, this.nblueP04, this.nblueP05, this.nblueP06, this.nblueP07, this.nblueP08, this.nblueP09, this.nblueP10] : [],
			...grSet.presetSelectNgreen   ? [this.ngreenP01, this.ngreenP02, this.ngreenP03, this.ngreenP04, this.ngreenP05, this.ngreenP06, this.ngreenP07, this.ngreenP08, this.ngreenP09, this.ngreenP10] : [],
			...grSet.presetSelectNred     ? [this.nredP01, this.nredP02, this.nredP03, this.nredP04, this.nredP05, this.nredP06, this.nredP07, this.nredP08, this.nredP09, this.nredP10] : [],
			...grSet.presetSelectNgold    ? [this.ngoldP01, this.ngoldP02, this.ngoldP03, this.ngoldP04, this.ngoldP05, this.ngoldP06, this.ngoldP07, this.ngoldP08, this.ngoldP09, this.ngoldP10] : [],
			...grSet.presetSelectCustom   ? Array(10).fill([this.customP01.bind(this), this.customP02.bind(this), this.customP03.bind(this), this.customP04.bind(this), this.customP05.bind(this), this.customP06.bind(this), this.customP07.bind(this), this.customP08.bind(this), this.customP09.bind(this), this.customP10.bind(this)]).flat() /* Increase pick probability ten times ( 10 custom themes ) */ : []
		];

		// * Harmonic presets
		const themePresetsLight = [
			...grSet.presetSelectWhite  ? [this.whiteP01, this.whiteP02, this.whiteP03, this.whiteP04, this.whiteP05, this.whiteP06, this.whiteP07, this.whiteP08] : [],
			...grSet.presetSelectReborn ? [this.rebornP08, this.rebornP09, this.rebornP10] : []
		];
		const themePresetsMiddle = [
			...grSet.presetSelectReborn ? [this.rebornP01, this.rebornP02, this.rebornP03, this.rebornP04, this.rebornP05, this.rebornP06, this.rebornP07] : []
		];
		const themePresetsFusion = [
			...grSet.presetSelectReborn ? [this.rebornP16, this.rebornP17, this.rebornP18, this.rebornP19, this.rebornP20, this.rebornP21, this.rebornP22, this.rebornP23, this.rebornP24, this.rebornP25, this.rebornP26, this.rebornP27, this.rebornP28, this.rebornP29, this.rebornP30] : []
		];
		const themePresetsDark = [
			...grSet.presetSelectBlack  ? [this.blackP01, this.blackP02, this.blackP03, this.blackP04, this.blackP05, this.blackP06, this.blackP07, this.blackP08, this.blackP09, this.blackP10] : [],
			...grSet.presetSelectReborn ? [this.rebornP11, this.rebornP12, this.rebornP13, this.rebornP14, this.rebornP15] : [],
			...grSet.presetSelectRandom ? [this.randomP03, this.randomP06] : [],
			...grSet.presetSelectNblue  ? [this.nblueP01, this.nblueP02, this.nblueP03, this.nblueP04, this.nblueP05, this.nblueP06, this.nblueP07, this.nblueP08, this.nblueP09, this.nblueP10] : [],
			...grSet.presetSelectNgreen ? [this.ngreenP01, this.ngreenP02, this.ngreenP03, this.ngreenP04, this.ngreenP05, this.ngreenP06, this.ngreenP07, this.ngreenP08, this.ngreenP09, this.ngreenP10] : [],
			...grSet.presetSelectNred   ? [this.nredP01, this.nredP02, this.nredP03, this.nredP04, this.nredP05, this.nredP06, this.nredP07, this.nredP08, this.nredP09, this.nredP10] : [],
			...grSet.presetSelectNgold  ? [this.ngoldP01, this.ngoldP02, this.ngoldP03, this.ngoldP04, this.ngoldP05, this.ngoldP06, this.ngoldP07, this.ngoldP08, this.ngoldP09, this.ngoldP10] : []
		];

		if (grSet.presetSelectMode === 'harmonic') {
			grCol.colBrightness  = new Color(grCol.primary).brightness;
			grCol.colBrightness2 = new Color(grCol.primary_alt).brightness;
			grCol.imgBrightness = CalcImgBrightness(grm.ui.albumArt);

			if (grCol.colBrightness > 200 || grCol.imgBrightness > 180) { // * Light
				randomThemePreset = Math.floor(Math.random() * themePresetsLight.length);
				themePresetsLight[(randomThemePreset)]();
			}
			else if (grCol.colBrightness < 200 && grCol.colBrightness > 50 || grCol.imgBrightness < 180 && grCol.imgBrightness > 130) { // * Middle
				if (ColorDistance(grCol.primary, grCol.primary_alt) > 200) { // * Reborn fusion
					randomThemePreset = Math.floor(Math.random() * themePresetsFusion.length);
					themePresetsFusion[(randomThemePreset)]();
				} else {
					randomThemePreset = Math.floor(Math.random() * themePresetsMiddle.length);
					themePresetsMiddle[(randomThemePreset)]();
				}
			}
			else if (grCol.colBrightness < 50 || grCol.imgBrightness < 130) { // * Dark
				randomThemePreset = Math.floor(Math.random() * themePresetsDark.length);
				themePresetsDark[(randomThemePreset)]();
			}
		}
		else {
			randomThemePreset = Math.floor(Math.random() * themePresetsRandom.length);
			themePresetsRandom[(randomThemePreset)]();
		}
	}

	/**
	 * Sets and applies a new random theme preset.
	 * @private
	 */
	_setRandomThemePreset() {
		grm.ui.resetStyle('all');
		this._pickRandomThemePreset();
		grm.ui.updateStyle();
		grm.ui.themePresetMatchMode = false;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Theme preset initialization to determine if active styles match any theme presets, checks when user uses top menu Options > Style.
	 * @param {boolean} info - Displays the total and unique number of theme presets and if a preset is active or not.
	 */
	initThemePresetState(info) {
		const THEME  = grSet.theme;
		const CTHEME = grSet.theme.startsWith('custom');
		const BEVEL  = grSet.styleBevel;
		const BLEND  = grSet.styleBlend;
		const BLEND2 = grSet.styleBlend2;
		const GRAD   = grSet.styleGradient;
		const GRAD2  = grSet.styleGradient2;
		const ALT    = grSet.styleAlternative;
		const ALT2   = grSet.styleAlternative2;
		const BW     = grSet.styleBlackAndWhite;
		const BW2    = grSet.styleBlackAndWhite2;
		const BWR    = grSet.styleBlackAndWhiteReborn;
		const BR     = grSet.styleBlackReborn;
		const RW     = grSet.styleRebornWhite;
		const RB     = grSet.styleRebornBlack;
		const RF     = grSet.styleRebornFusion;
		const RF2    = grSet.styleRebornFusion2;
		const RFA    = grSet.styleRebornFusionAccent;
		const RP     = grSet.styleRandomPastel;
		const RD     = grSet.styleRandomDark;
		const RAC    = grSet.styleRandomAutoColor;
		const TMB    = grSet.styleTopMenuButtons;
		const TPB    = grSet.styleTransportButtons;
		const PBD    = grSet.styleProgressBarDesign;
		const PB     = grSet.styleProgressBar;
		const PBF    = grSet.styleProgressBarFill;
		const VBD    = grSet.styleVolumeBarDesign;
		const VB     = grSet.styleVolumeBar;
		const VBF    = grSet.styleVolumeBarFill;
		const BRT    = grSet.themeBrightness;

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
			{ preset: 'customP01', name: `${grSet.theme} preset: Beveled`,             value: [CTHEME,  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
			{ preset: 'customP02', name: `${grSet.theme} preset: Beveled 2`,           value: [CTHEME,  BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'bevel',   TPB === 'bevel',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
			{ preset: 'customP03', name: `${grSet.theme} preset: Blended`,             value: [CTHEME, !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
			{ preset: 'customP04', name: `${grSet.theme} preset: Blended 2`,           value: [CTHEME, !BEVEL, !BLEND,  BLEND2, !GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'emboss',  TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'inner',   VBD === 'rounded', VB === 'inner',   VBF === 'inner',   BRT === 'default'] },
			{ preset: 'customP05', name: `${grSet.theme} preset: Gradiented`,          value: [CTHEME, !BEVEL, !BLEND, !BLEND2,  GRAD, !GRAD2, !ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'emboss',  PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
			{ preset: 'customP06', name: `${grSet.theme} preset: Gradiented 2`,        value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD,  GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'bevel',   PBD === 'default', PB === 'bevel',   PBF === 'inner',   VBD === 'rounded', VB === 'bevel',   VBF === 'inner',   BRT === 'default'] },
			{ preset: 'customP07', name: `${grSet.theme} preset: Alternative`,         value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
			{ preset: 'customP08', name: `${grSet.theme} preset: Alternative 2`,       value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'inner',   TPB === 'inner',   PBD === 'rounded', PB === 'inner',   PBF === 'bevel',   VBD === 'rounded', VB === 'inner',   VBF === 'bevel',   BRT === 'default'] },
			{ preset: 'customP09', name: `${grSet.theme} preset: Minimalized`,         value: [CTHEME, !BEVEL, !BLEND, !BLEND2, !GRAD, !GRAD2,  ALT, !ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'filled',  TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] },
			{ preset: 'customP10', name: `${grSet.theme} preset: Minimalized blended`, value: [CTHEME, !BEVEL,  BLEND, !BLEND2, !GRAD, !GRAD2, !ALT,  ALT2, !BW, !BW2, !BWR, !BR, !RW, !RB, !RF, !RF2, !RFA, !RP, !RD, RAC === 'off', TMB === 'minimal', TPB === 'minimal', PBD === 'default', PB === 'default', PBF === 'default', VBD === 'default', VB === 'default', VBF === 'default', BRT === 'default'] }
		];

		this._initThemePresets(themePresets);

		if (info) {
			grSet.presetIndicator = true;
			grm.ui.themePresetMatchMode = false;
			this._getThemePresetInfo(themePresets);
			window.Repaint();
		}

		this._hideThemePresetIndicator(info ? 10000 : 5000);
	}

	/**
	 * Gets a random theme preset, used in Options > Preset > Auto random.
	 */
	getRandomThemePreset() {
		grm.ui.clearTimer('presetAutoRandomMode');
		grm.ui.themeNotification = '';

		if (grm.ui.hasThemeTags()) return;

		if (['off', 'track', 'album', 'dblclick'].includes(grSet.presetAutoRandomMode)) {
			this._setRandomThemePreset();
		} else {
			grm.ui.themePresetIndicator = false;
			grm.ui.presetAutoRandomModeTimer = setInterval(() => {
				if (grm.ui.activeMenu) return; // * Workaround that pauses when a context menu is active which partially blocks color initialization;
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
		if (typeof this[preset] !== 'function') return;
		grm.ui.themePresetMatchMode = false;
		grm.ui.resetStyle('all');
		this[preset](); // Call the method on the ThemePreset instance
		grm.ui.updateStyle();
		grm.details.setDiscArtShadow();
	}
	// #endregion
}
