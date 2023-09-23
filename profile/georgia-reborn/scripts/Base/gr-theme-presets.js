/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Theme Presets                        * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC2                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-09-24                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * WHITE THEME PRESETS * //
/////////////////////////////
/**
 * White theme preset -> Options > Preset > White > Beveled.
 * @returns {string|boolean}
 */
const whiteP01 = () => {
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
};

/**
 * White theme preset -> Options > Preset > White > Black and white.
 * @returns {string|boolean}
 */
const whiteP02 = () => {
	pref.theme = 'white';
	pref.styleBevel = true;
	pref.styleBlackAndWhite = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'default';
	pref.styleVolumeBar = 'inner';
};

/**
 * White theme preset -> Options > Preset > White > Black and white blended.
 * @returns {string|boolean}
 */
const whiteP03 = () => {
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
};

/**
 * White theme preset -> Options > Preset > White > Black and white 2.
 * @returns {string|boolean}
 */
const whiteP04 = () => {
	pref.theme = 'white';
	pref.styleBevel = true;
	pref.styleBlackAndWhite2 = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * White theme preset -> Options > Preset > White > Black and white 2 blended.
 * @returns {string|boolean}
 */
const whiteP05 = () => {
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
};

/**
 * White theme preset -> Options > Preset > White > Black and white reborn.
 * @returns {string|boolean}
 */
const whiteP06 = () => {
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
};

/**
 * White theme preset -> Options > Preset > White > Black and white reborn blended.
 * @returns {string|boolean}
 */
const whiteP07 = () => {
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
};

/**
 * White theme preset -> Options > Preset > White > Minimalized.
 * @returns {string|boolean}
 */
const whiteP08 = () => {
	pref.theme = 'white';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


/////////////////////////////
// * BLACK THEME PRESETS * //
/////////////////////////////
/**
 * Black theme preset -> Options > Preset > Black > Beveled.
 * @returns {string|boolean}
 */
const blackP01 = () => {
	pref.theme = 'black';
	pref.styleAlternative2 = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'bevel';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'bevel';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Black theme preset -> Options > Preset > Black > Blended.
 * @returns {string|boolean}
 */
const blackP02 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Blended alternative.
 * @returns {string|boolean}
 */
const blackP03 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Blended alternative 2.
 * @returns {string|boolean}
 */
const blackP04 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Black reborn.
 * @returns {string|boolean}
 */
const blackP05 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Black reborn blended.
 * @returns {string|boolean}
 */
const blackP06 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Dark gray.
 * @returns {string|boolean|number}
 */
const blackP07 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Dark gray blended.
 * @returns {string|boolean|number}
 */
const blackP08 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Dark gray 2 blended.
 * @returns {string|boolean|number}
 */
const blackP09 = () => {
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
};

/**
 * Black theme preset -> Options > Preset > Black > Minimalized.
 * @returns {string|boolean}
 */
const blackP10 = () => {
	pref.theme = 'black';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


//////////////////////////////
// * REBORN THEME PRESETS * //
//////////////////////////////
/**
 * Reborn theme preset -> Options > Preset > Reborn > Beveled.
 * @returns {string|boolean}
 */
const rebornP01 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'bevel';
	pref.styleTransportButtons = 'bevel';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Blended.
 * @returns {string|boolean}
 */
const rebornP02 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleBlend = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Blended 2.
 * @returns {string|boolean}
 */
const rebornP03 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleBlend2 = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Gradiented.
 * @returns {string|boolean}
 */
const rebornP04 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleGradient = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Gradiented 2.
 * @returns {string|boolean}
 */
const rebornP05 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Minimalized.
 * @returns {string|boolean}
 */
const rebornP06 = () => {
	pref.theme = 'reborn';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Minimalized blended.
 * @returns {string|boolean}
 */
const rebornP07 = () => {
	pref.theme = 'reborn';
	pref.styleBlend = true;
	pref.styleAlternative2 = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn white beveled.
 * @returns {string|boolean}
 */
const rebornP08 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn white blended.
 * @returns {string|boolean}
 */
const rebornP09 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn white blended 2.
 * @returns {string|boolean}
 */
const rebornP10 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn black beveled.
 * @returns {string|boolean}
 */
const rebornP11 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleRebornBlack = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBar = 'bevel';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'bevel';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn black blended.
 * @returns {string|boolean}
 */
const rebornP12 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn black blended 2.
 * @returns {string|boolean}
 */
const rebornP13 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn black gradiented.
 * @returns {string|boolean}
 */
const rebornP14 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn black gradiented 2.
 * @returns {string|boolean}
 */
const rebornP15 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion beveled.
 * @returns {string|boolean}
 */
const rebornP16 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleRebornFusion = true;
	pref.styleTopMenuButtons = 'bevel';
	pref.styleTransportButtons = 'bevel';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion blended.
 * @returns {string|boolean}
 */
const rebornP17 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion blended 2.
 * @returns {string|boolean}
 */
const rebornP18 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion gradiented.
 * @returns {string|boolean}
 */
const rebornP19 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion gradiented 2.
 * @returns {string|boolean}
 */
const rebornP20 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 beveled.
 * @returns {string|boolean}
 */
const rebornP21 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleRebornFusion2 = true;
	pref.styleTopMenuButtons = 'bevel';
	pref.styleTransportButtons = 'bevel';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 blended.
 * @returns {string|boolean}
 */
const rebornP22 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 blended 2.
 * @returns {string|boolean}
 */
const rebornP23 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 gradiented.
 * @returns {string|boolean}
 */
const rebornP24 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion 2 gradiented 2.
 * @returns {string|boolean}
 */
const rebornP25 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent beveled.
 * @returns {string|boolean}
 */
const rebornP26 = () => {
	pref.theme = 'reborn';
	pref.styleBevel = true;
	pref.styleRebornFusionAccent = true;
	pref.styleTopMenuButtons = 'bevel';
	pref.styleTransportButtons = 'bevel';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent blended.
 * @returns {string|boolean}
 */
const rebornP27 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent blended 2.
 * @returns {string|boolean}
 */
const rebornP28 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent gradiented.
 * @returns {string|boolean}
 */
const rebornP29 = () => {
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
};

/**
 * Reborn theme preset -> Options > Preset > Reborn > Reborn fusion accent gradiented 2.
 * @returns {string|boolean}
 */
const rebornP30 = () => {
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
};


//////////////////////////////
// * RANDOM THEME PRESETS * //
//////////////////////////////
/**
 * Random theme preset -> Options > Preset > Random > Beveled blended alternative.
 * @returns {string|boolean}
 */
const randomP01 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Beveled blended pastel.
 * @returns {string|boolean}
 */
const randomP02 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Beveled blended dark.
 * @returns {string|boolean}
 */
const randomP03 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Beveled blended auto dark.
 * @returns {string|boolean}
 */
const randomP04 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Beveled auto dark.
 * @returns {string|boolean}
 */
const randomP05 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Beveled dark.
 * @returns {string|boolean}
 */
const randomP06 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Gradiented.
 * @returns {string|boolean}
 */
const randomP07 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Gradiented 2.
 * @returns {string|boolean}
 */
const randomP08 = () => {
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
};

/**
 * Random theme preset -> Options > Preset > Random > Minimalized.
 * @returns {string|boolean}
 */
const randomP09 = () => {
	pref.theme = 'random';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};

/**
 * Random theme preset -> Options > Preset > Random > Minimalized blended.
 * @returns {string|boolean}
 */
const randomP10 = () => {
	pref.theme = 'random';
	pref.styleBlend = true;
	pref.styleAlternative2 = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


////////////////////////////
// * BLUE THEME PRESETS * //
////////////////////////////
/**
 * Blue theme preset -> Options > Preset > Blue > Beveled.
 * @returns {string|boolean}
 */
const blueP01 = () => {
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
};

/**
 * Blue theme preset -> Options > Preset > Blue > Beveled 2.
 * @returns {string|boolean}
 */
const blueP02 = () => {
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
};

/**
 * Blue theme preset -> Options > Preset > Blue > Gradiented.
 * @returns {string|boolean}
 */
const blueP03 = () => {
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
};

/**
 * Blue theme preset -> Options > Preset > Blue > Gradiented 2.
 * @returns {string|boolean}
 */
const blueP04 = () => {
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
};

/**
 * Blue theme preset -> Options > Preset > Blue > Minimalized.
 * @returns {string|boolean}
 */
const blueP05 = () => {
	pref.theme = 'blue';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};


/////////////////////////////////
// * DARK BLUE THEME PRESETS * //
/////////////////////////////////
/**
 * Dark blue theme preset -> Options > Preset > Dark blue > Beveled.
 * @returns {string|boolean}
 */
const darkblueP01 = () => {
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
};

/**
 * Dark blue theme preset -> Options > Preset > Dark blue > Beveled 2.
 * @returns {string|boolean}
 */
const darkblueP02 = () => {
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
};

/**
 * Dark blue theme preset -> Options > Preset > Dark blue > Gradiented.
 * @returns {string|boolean}
 */
const darkblueP03 = () => {
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
};

/**
 * Dark blue theme preset -> Options > Preset > Dark blue > Gradiented 2.
 * @returns {string|boolean}
 */
const darkblueP04 = () => {
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
};

/**
 * Dark blue theme preset -> Options > Preset > Dark blue > Minimalized.
 * @returns {string|boolean}
 */
const darkblueP05 = () => {
	pref.theme = 'darkblue';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};


///////////////////////////
// * RED THEME PRESETS * //
///////////////////////////
/**
 * Red theme preset -> Options > Preset > Red > Beveled.
 * @returns {string|boolean}
 */
const redP01 = () => {
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
};

/**
 * Red theme preset -> Options > Preset > Red > Beveled 2.
 * @returns {string|boolean}
 */
const redP02 = () => {
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
};

/**
 * Red theme preset -> Options > Preset > Red > Gradiented.
 * @returns {string|boolean}
 */
const redP03 = () => {
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
};

/**
 * Red theme preset -> Options > Preset > Red > Gradiented 2.
 * @returns {string|boolean}
 */
const redP04 = () => {
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
};

/**
 * Red theme preset -> Options > Preset > Red > Minimalized.
 * @returns {string|boolean}
 */
const redP05 = () => {
	pref.theme = 'red';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};


/////////////////////////////
// * CREAM THEME PRESETS * //
/////////////////////////////
/**
 * Cream theme preset -> Options > Preset > Cream > Beveled.
 * @returns {string|boolean}
 */
const creamP01 = () => {
	pref.theme = 'cream';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'bevel';
	pref.styleTransportButtons = 'bevel';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Cream theme preset -> Options > Preset > Cream > Beveled 2.
 * @returns {string|boolean}
 */
const creamP02 = () => {
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
};

/**
 * Cream theme preset -> Options > Preset > Cream > Alternative.
 * @returns {string|boolean}
 */
const creamP03 = () => {
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
};

/**
 * Cream theme preset -> Options > Preset > Cream > Alternative 2.
 * @returns {string|boolean}
 */
const creamP04 = () => {
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
};

/**
 * Cream theme preset -> Options > Preset > Cream > Minimalized.
 * @returns {string|boolean}
 */
const creamP05 = () => {
	pref.theme = 'cream';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};


/////////////////////////////////
// * NEON BLUE THEME PRESETS * //
/////////////////////////////////
/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Beveled.
 * @returns {string|boolean}
 */
const nblueP01 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Beveled 2.
 * @returns {string|boolean}
 */
const nblueP02 = () => {
	pref.theme = 'nblue';
	pref.styleBevel = true;
	pref.styleTopMenuButtons = 'emboss';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Blended.
 * @returns {string|boolean}
 */
const nblueP03 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Blended 2.
 * @returns {string|boolean}
 */
const nblueP04 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Alternative.
 * @returns {string|boolean}
 */
const nblueP05 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Alternative 2.
 * @returns {string|boolean}
 */
const nblueP06 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray.
 * @returns {string|boolean|number}
 */
const nblueP07 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray blended.
 * @returns {string|boolean|number}
 */
const nblueP08 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Dark gray 2 blended.
 * @returns {string|boolean|number}
 */
const nblueP09 = () => {
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
};

/**
 * Neon blue theme preset -> Options > Preset > Neon blue > Minimalized.
 * @returns {string|boolean}
 */
const nblueP10 = () => {
	pref.theme = 'nblue';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


//////////////////////////////////
// * NEON GREEN THEME PRESETS * //
//////////////////////////////////
/**
 * Neon green theme preset -> Options > Preset > Neon green > Beveled.
 * @returns {string|boolean}
 */
const ngreenP01 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Beveled 2.
 * @returns {string|boolean}
 */
const ngreenP02 = () => {
	pref.theme = 'ngreen';
	pref.styleBevel = true;
	pref.styleTopMenuButtons = 'emboss';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Blended.
 * @returns {string|boolean}
 */
const ngreenP03 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Blended 2.
 * @returns {string|boolean}
 */
const ngreenP04 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Alternative.
 * @returns {string|boolean}
 */
const ngreenP05 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Alternative 2.
 * @returns {string|boolean}
 */
const ngreenP06 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Dark gray.
 * @returns {string|boolean|number}
 */
const ngreenP07 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Dark gray blended.
 * @returns {string|boolean|number}
 */
const ngreenP08 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Dark gray 2 blended.
 * @returns {string|boolean|number}
 */
const ngreenP09 = () => {
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
};

/**
 * Neon green theme preset -> Options > Preset > Neon green > Minimalized.
 * @returns {string|boolean}
 */
const ngreenP10 = () => {
	pref.theme = 'ngreen';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


////////////////////////////////
// * NEON RED THEME PRESETS * //
////////////////////////////////
/**
 * Neon red theme preset -> Options > Preset > Neon red > Beveled.
 * @returns {string|boolean}
 */
const nredP01 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Beveled 2.
 * @returns {string|boolean}
 */
const nredP02 = () => {
	pref.theme = 'nred';
	pref.styleBevel = true;
	pref.styleTopMenuButtons = 'emboss';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Blended.
 * @returns {string|boolean}
 */
const nredP03 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Blended 2.
 * @returns {string|boolean}
 */
const nredP04 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Alternative.
 * @returns {string|boolean}
 */
const nredP05 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Alternative 2.
 * @returns {string|boolean}
 */
const nredP06 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Dark gray.
 * @returns {string|boolean|number}
 */
const nredP07 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Dark gray blended.
 * @returns {string|boolean|number}
 */
const nredP08 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Dark gray 2 blended.
 * @returns {string|boolean|number}
 */
const nredP09 = () => {
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
};

/**
 * Neon red theme preset -> Options > Preset > Neon red > Minimalized.
 * @returns {string|boolean}
 */
const nredP10 = () => {
	pref.theme = 'nred';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


/////////////////////////////////
// * NEON GOLD THEME PRESETS * //
/////////////////////////////////
/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Beveled.
 * @returns {string|boolean}
 */
const ngoldP01 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Beveled 2.
 * @returns {string|boolean}
 */
const ngoldP02 = () => {
	pref.theme = 'ngold';
	pref.styleBevel = true;
	pref.styleTopMenuButtons = 'emboss';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Blended.
 * @returns {string|boolean}
 */
const ngoldP03 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Blended 2.
 * @returns {string|boolean}
 */
const ngoldP04 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Alternative.
 * @returns {string|boolean}
 */
const ngoldP05 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Alternative 2.
 * @returns {string|boolean}
 */
const ngoldP06 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray.
 * @returns {string|boolean|number}
 */
const ngoldP07 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray blended.
 * @returns {string|boolean|number}
 */
const ngoldP08 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Dark gray 2 blended.
 * @returns {string|boolean|number}
 */
const ngoldP09 = () => {
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
};

/**
 * Neon gold theme preset -> Options > Preset > Neon gold > Minimalized.
 * @returns {string|boolean}
 */
const ngoldP10 = () => {
	pref.theme = 'ngold';
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


//////////////////////////////
// * CUSTOM THEME PRESETS * //
//////////////////////////////
/**
 * Initializes the custom theme and if no custom theme is currently active, select one randomly from the list.
 * @returns {string}
 */
const customThemeSetup = () => {
	const customTheme = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'];
	if (!customTheme.includes(pref.theme)) pref.theme = customTheme[Math.floor(Math.random() * customTheme.length)]; // If no custom theme active, pick a random one
	initCustomTheme();
};

/**
 * Custom theme preset -> Options > Preset > Custom > Beveled.
 * @returns {string|boolean}
 */
const customP01 = () => {
	customThemeSetup();
	pref.styleBevel = true;
	pref.styleTopMenuButtons = 'bevel';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBarDesign = 'rounded';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Beveled 2.
 * @returns {string|boolean}
 */
const customP02 = () => {
	customThemeSetup();
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
};

/**
 * Custom theme preset -> Options > Preset > Custom > Blended.
 * @returns {string|boolean}
 */
const customP03 = () => {
	customThemeSetup();
	pref.styleBlend = true;
	pref.styleTopMenuButtons = 'emboss';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBarDesign = 'rounded';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'inner';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Blended 2.
 * @returns {string|boolean}
 */
const customP04 = () => {
	customThemeSetup();
	pref.styleBlend2 = true;
	pref.styleTopMenuButtons = 'emboss';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBarDesign = 'rounded';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'inner';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Gradiented.
 * @returns {string|boolean}
 */
const customP05 = () => {
	customThemeSetup();
	pref.styleGradient = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'emboss';
	pref.styleProgressBarDesign = 'rounded';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Gradiented 2.
 * @returns {string|boolean}
 */
const customP06 = () => {
	customThemeSetup();
	pref.styleGradient2 = true;
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'bevel';
	pref.styleProgressBar = 'bevel';
	pref.styleProgressBarFill = 'inner';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'bevel';
	pref.styleVolumeBarFill = 'inner';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Alternative.
 * @returns {string|boolean}
 */
const customP07 = () => {
	customThemeSetup();
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBarDesign = 'rounded';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Alternative 2.
 * @returns {string|boolean}
 */
const customP08 = () => {
	customThemeSetup();
	pref.styleAlternative2 = true;
	pref.styleTopMenuButtons = 'inner';
	pref.styleTransportButtons = 'inner';
	pref.styleProgressBarDesign = 'rounded';
	pref.styleProgressBar = 'inner';
	pref.styleProgressBarFill = 'bevel';
	pref.styleVolumeBarDesign = 'rounded';
	pref.styleVolumeBar = 'inner';
	pref.styleVolumeBarFill = 'bevel';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Minimalized.
 * @returns {string|boolean}
 */
const customP09 = () => {
	customThemeSetup();
	pref.styleAlternative = true;
	pref.styleTopMenuButtons = 'filled';
	pref.styleTransportButtons = 'minimal';
};

/**
 * Custom theme preset -> Options > Preset > Custom > Minimalized blended.
 * @returns {string|boolean}
 */
const customP10 = () => {
	customThemeSetup();
	pref.styleBlend = true;
	pref.styleAlternative2 = true;
	pref.styleTopMenuButtons = 'minimal';
	pref.styleTransportButtons = 'minimal';
};


//////////////////////////
// * SET THEME PRESET * //
//////////////////////////
/**
 * Sets chosen theme preset when using Options > Preset
 * @param {string} preset The name of the theme preset.
 */
function setThemePreset(preset) {
	// eslint-disable-next-line
	const applyPreset = new Function(`${preset}()`);
	themePresetMatchMode = false;
	resetStyle('all');
	applyPreset();
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
			...pref.presetSelectWhite    ? [whiteP01, whiteP02, whiteP03, whiteP04, whiteP05, whiteP06, whiteP07, whiteP08] : [],
			...pref.presetSelectBlack    ? [blackP01, blackP02, blackP03, blackP04, blackP05, blackP06, blackP07, blackP08, blackP09, blackP10] : [],
			...pref.presetSelectReborn   ? [rebornP01, rebornP02, rebornP03, rebornP04, rebornP05, rebornP06, rebornP07, rebornP08, rebornP09, rebornP10, rebornP11, rebornP12, rebornP13, rebornP14, rebornP15, rebornP16, rebornP17, rebornP18, rebornP19, rebornP20, rebornP21, rebornP22, rebornP23, rebornP24, rebornP25, rebornP26, rebornP27, rebornP28, rebornP29, rebornP30] : [],
			...pref.presetSelectRandom   ? [randomP01, randomP02, randomP03, randomP04, randomP05, randomP06, randomP07, randomP08, randomP09, randomP10] : [],
			...pref.presetSelectBlue     ? [blueP01, blueP02, blueP03, blueP04, blueP05] : [],
			...pref.presetSelectDarkblue ? [darkblueP01, darkblueP02, darkblueP03, darkblueP04, darkblueP05] : [],
			...pref.presetSelectRed      ? [redP01, redP02, redP03, redP04, redP05] : [],
			...pref.presetSelectCream    ? [creamP01, creamP02, creamP03, creamP04, creamP05] : [],
			...pref.presetSelectNblue    ? [nblueP01, nblueP02, nblueP03, nblueP04, nblueP05, nblueP06, nblueP07, nblueP08, nblueP09, nblueP10] : [],
			...pref.presetSelectNgreen   ? [ngreenP01, ngreenP02, ngreenP03, ngreenP04, ngreenP05, ngreenP06, ngreenP07, ngreenP08, ngreenP09, ngreenP10] : [],
			...pref.presetSelectNred     ? [nredP01, nredP02, nredP03, nredP04, nredP05, nredP06, nredP07, nredP08, nredP09, nredP10] : [],
			...pref.presetSelectNgold    ? [ngoldP01, ngoldP02, ngoldP03, ngoldP04, ngoldP05, ngoldP06, ngoldP07, ngoldP08, ngoldP09, ngoldP10] : [],
			...pref.presetSelectCustom   ? Array(10).fill([customP01, customP02, customP03, customP04, customP05, customP06, customP07, customP08, customP09, customP10]).flat() /* Increase pick probability ten times ( 10 custom themes ) */ : []
		];

		// * Harmonic presets
		const themePresetsLight = [
			...pref.presetSelectWhite  ? [whiteP01, whiteP02, whiteP03, whiteP04, whiteP05, whiteP06, whiteP07, whiteP08] : [],
			...pref.presetSelectReborn ? [rebornP08, rebornP09, rebornP10] : []
		];
		const themePresetsMiddle = [
			...pref.presetSelectReborn ? [rebornP01, rebornP02, rebornP03, rebornP04, rebornP05, rebornP06, rebornP07] : []
		];
		const themePresetsFusion = [
			...pref.presetSelectReborn ? [rebornP16, rebornP17, rebornP18, rebornP19, rebornP20, rebornP21, rebornP22, rebornP23, rebornP24, rebornP25, rebornP26, rebornP27, rebornP28, rebornP29, rebornP30] : []
		];
		const themePresetsDark = [
			...pref.presetSelectBlack  ? [blackP01, blackP02, blackP03, blackP04, blackP05, blackP06, blackP07, blackP08, blackP09, blackP10] : [],
			...pref.presetSelectReborn ? [rebornP11, rebornP12, rebornP13, rebornP14, rebornP15] : [],
			...pref.presetSelectRandom ? [randomP03, randomP06] : [],
			...pref.presetSelectNblue  ? [nblueP01, nblueP02, nblueP03, nblueP04, nblueP05, nblueP06, nblueP07, nblueP08, nblueP09, nblueP10] : [],
			...pref.presetSelectNgreen ? [ngreenP01, ngreenP02, ngreenP03, ngreenP04, ngreenP05, ngreenP06, ngreenP07, ngreenP08, ngreenP09, ngreenP10] : [],
			...pref.presetSelectNred   ? [nredP01, nredP02, nredP03, nredP04, nredP05, nredP06, nredP07, nredP08, nredP09, nredP10] : [],
			...pref.presetSelectNgold  ? [ngoldP01, ngoldP02, ngoldP03, ngoldP04, ngoldP05, ngoldP06, ngoldP07, ngoldP08, ngoldP09, ngoldP10] : []
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
	}

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
