/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Debug                                    * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-05-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////////
// * CUSTOM ERROR - ARGUMENT * //
/////////////////////////////////
/**
 * A class that handles argument errors with detailed messages.
 * @augments {Error}
 */
class ArgumentError extends Error {
	/**
	 * Creates the `ArgumentError` instance.
	 * @param {string} arg_name - The name of the argument that has an invalid value.
	 * @param {*} arg_value - The value of the argument that is considered invalid.
	 * @param {string} [additional_msg] - An optional message to provide more information about the error.
	 */
	constructor(arg_name, arg_value, additional_msg = '') {
		super('');
		/** @private @type {string} */
		this.name = 'ArgumentError';
		/** @private @type {string} */
		this.message = `\n'${arg_name}' has invalid value: ${arg_value}${additional_msg ? `\n${additional_msg}` : ''}\n`;
	}
}


/////////////////////////////////////
// * CUSTOM ERROR - INVALID TYPE * //
/////////////////////////////////////
/**
 * A class that handles invalid type errors with detailed messages.
 * @augments {Error}
 */
class InvalidTypeError extends Error {
	/**
	 * Creates the `InvalidTypeError` instance.
	 * @param {string} arg_name - The name of the argument that caused the error.
	 * @param {string} arg_type - The actual type of the argument that was passed.
	 * @param {string} valid_type - The expected type of the argument.
	 * @param {string} [additional_msg] - An optional message to provide more information about the error.
	 */
	constructor(arg_name, arg_type, valid_type, additional_msg = '') {
		super('');
		/** @private @type {string} */
		this.name = 'InvalidTypeError';
		/** @private @type {string} */
		this.message = `\n'${arg_name}' is not a ${valid_type}, it's a ${arg_type}${additional_msg ? `\n${additional_msg}` : ''}\n`;
	}
}


//////////////////////////////
// * CUSTOM ERROR - LOGIC * //
//////////////////////////////
/**
 * A class that handles logic errors with detailed messages.
 * @augments {Error}
 */
class LogicError extends Error {
	/**
	 * Creates the `LogicError` instance.
	 * @param {string} msg - The error message.
	 */
	constructor(msg) {
		super(msg);
		/** @private @type {string} */
		this.name = 'LogicError';
		/** @private @type {string} */
		this.message = `\n${msg}\n`;
	}
}


//////////////////////////////
// * CUSTOM ERROR - THEME * //
//////////////////////////////
/**
 * A class that handles theme errors with detailed messages.
 * @augments {Error}
 */
class ThemeError extends Error {
	/**
	 * Creates the `ThemeError` instance.
	 * @param {string} msg - The error message.
	 */
	constructor(msg) {
		super(msg);
		/** @private @type {string} */
		this.name = 'ThemeError';
		/** @private @type {string} */
		this.message = `\n${msg}\n`;
	}
}


/////////////////////
// * COLOR DEBUG * //
/////////////////////
/**
 * A class responsible for all color-related debugging.
 * This includes the APCA calibration overlay, color palette overlay, theme style overlay, etc.
 */
class ColorDebug {
	/**
	 * Creates the `ColorDebug` instance.
	 */
	constructor() {
		// * APCA * //
		// #region APCA
		/**
		 * Defines the available style combinations for context-aware APCA testing.
		 * Determines how modifiers and rescue boosts are triggered in the debug overlay.
		 * @type {Array<{name: string, bevel: boolean, blend: boolean, blend2: boolean, alt: boolean, alt2: boolean, grad: boolean, grad2: boolean}>}
		 */
		this.apcaContextStyles = [
			// * BASIC MODES * //
			{ name: 'base',           bevel: false, blend: false, blend2: false, alt: false, alt2: false, grad: false, grad2: false },
			{ name: 'bevel',          bevel: true,  blend: false, blend2: false, alt: false, alt2: false, grad: false, grad2: false },

			// * GROUP 1 * //
			{ name: 'blend',          bevel: false, blend: true,  blend2: false, alt: false, alt2: false, grad: false, grad2: false },
			{ name: 'blend2',         bevel: false, blend: false, blend2: true,  alt: false, alt2: false, grad: false, grad2: false },
			{ name: 'grad',           bevel: false, blend: false, blend2: false, alt: false, alt2: false, grad: true,  grad2: false },
			{ name: 'grad2',          bevel: false, blend: false, blend2: false, alt: false, alt2: false, grad: false, grad2: true  },

			// * GROUP 2 * //
			{ name: 'alt',            bevel: false, blend: false, blend2: false, alt: true,  alt2: false, grad: false, grad2: false },
			{ name: 'alt2',           bevel: false, blend: false, blend2: false, alt: false, alt2: true,  grad: false, grad2: false },

			// * CROSS-GROUP COMBOS * //
			{ name: 'altBlend',       bevel: false, blend: true,  blend2: false, alt: true,  alt2: false, grad: false, grad2: false },
			{ name: 'alt2Blend2',     bevel: false, blend: false, blend2: true,  alt: false, alt2: true,  grad: false, grad2: false },
			{ name: 'altGrad',        bevel: false, blend: false, blend2: false, alt: true,  alt2: false, grad: true,  grad2: false },
			{ name: 'alt2Grad2',      bevel: false, blend: false, blend2: false, alt: false, alt2: true,  grad: false, grad2: true  },

			// * FULL STACK COMBOS * //
			{ name: 'bevAltBlend',    bevel: true,  blend: true,  blend2: false, alt: true,  alt2: false, grad: false, grad2: false },
			{ name: 'bevAlt2Blend2',  bevel: true,  blend: false, blend2: true,  alt: false, alt2: true,  grad: false, grad2: false }
		];

		/**
		 * The array of grayscale tone references for APCA calibration.
		 * Each entry contains a name and reference to a LUM_REF anchor point.
		 * @type {Array<{name: string, ref: object}>}
		 */
		this.apcaGrayscaleTones = [
			// * VERY DARK ZONE * //
			{ name: 'Y0',    ref: LUM_REF.Y0    },
			{ name: 'Y0_1',  ref: LUM_REF.Y0_1  },
			{ name: 'Y0_2',  ref: LUM_REF.Y0_2  },
			{ name: 'Y0_5',  ref: LUM_REF.Y0_5  },
			{ name: 'Y1_0',  ref: LUM_REF.Y1_0  },
			{ name: 'Y1_8',  ref: LUM_REF.Y1_8  },

			// * DARK ZONE * //
			{ name: 'Y3_5',  ref: LUM_REF.Y3_5  },
			{ name: 'Y5_5',  ref: LUM_REF.Y5_5  },
			{ name: 'Y7_5',  ref: LUM_REF.Y7_5  },
			{ name: 'Y10',   ref: LUM_REF.Y10   },

			// * MID ZONE * //
			{ name: 'Y15',   ref: LUM_REF.Y15   },
			{ name: 'Y16',   ref: LUM_REF.Y16   },
			{ name: 'Y19',   ref: LUM_REF.Y19   },
			{ name: 'Y22',   ref: LUM_REF.Y22   },
			{ name: 'Y26',   ref: LUM_REF.Y26   },
			{ name: 'Y32',   ref: LUM_REF.Y32   },

			// * THE PERCEPTUAL PIVOT * //
			{ name: 'Y36_2', ref: LUM_REF.Y36_2 },
			{ name: 'Y36_7', ref: LUM_REF.Y36_7 },
			{ name: 'Y40',   ref: LUM_REF.Y40   },

			// * MID-BRIGHT ZONE * //
			{ name: 'Y45',   ref: LUM_REF.Y45   },
			{ name: 'Y50',   ref: LUM_REF.Y50   },
			{ name: 'Y60',   ref: LUM_REF.Y60   },
			{ name: 'Y67',   ref: LUM_REF.Y67   },
			{ name: 'Y75',   ref: LUM_REF.Y75   },

			// * VERY BRIGHT ZONE * //
			{ name: 'Y80',   ref: LUM_REF.Y80   },
			{ name: 'Y85',   ref: LUM_REF.Y85   },
			{ name: 'Y90',   ref: LUM_REF.Y90   },
			{ name: 'Y95',   ref: LUM_REF.Y95   },
			{ name: 'Y100',  ref: LUM_REF.Y100  }
		];

		/** @public @type {number} Current color channel mode index (0=grayscale, 1=red, 2=green, 3=blue) */
		this.apcaColorModeIndex = 0;
		/** @private @type {string[]} Available color modes */
		this.apcaColorModes = ['Grayscale', 'Red', 'Green', 'Blue'];
		/** @private @type {number|undefined} The last applied color to the APCA calibration overlay.*/
		this.apcaLastAppliedColor = undefined;
		/** @public @type {number} The current APCA calibration tone index (0-24). */
		this.apcaCalibrationIndex = 11;
		/** @public @type {string} The current APCA calibration context mode, determines which style combination is being tested. */
		this.apcaCalibrationContext = 'base';
		/** @private @type {object} The hover state object for APCA calibration overlay controls. */
		this.apcaControlsHover = {};
		/** @private @type {GdiFont|null} The font for APCA overlay icons and controls. */
		this.apcaFontIcon = null;
		/** @private @type {GdiFont|null} The font for APCA overlay headers. */
		this.apcaFontHeader = null;
		/** @private @type {GdiFont|null} The font for APCA overlay labels. */
		this.apcaFontLabel = null;
		/** @private @type {GdiFont|null} The font for APCA overlay values. */
		this.apcaFontValue = null;
		/** @private @type {number} The cached height for APCA overlay font scaling detection. */
		this.apcaLastDebugH = 0;
		/** @private @type {Object.<string, number>} The custom override values for keyframes. */
		this.apcaCustomValues = {};
		/** @private @type {string|null} The currently focused input field (e.g., 'accent_Y10'). */
		this.apcaFocusedInput = null;
		/** @private @type {string} The text buffer for the currently editing field. */
		this.apcaInputBuffer = '';
		/** @private @type {Array<{key: string, x: number, y: number, w: number, h: number}>} The hitboxes for all editable fields in the current frame. */
		this.apcaInputHitboxes = [];
		// #endregion

		// * OVERLAY DATA * //
		// #region OVERLAY DATA
		/** @public @type {number} The image alpha shown in showThemeDebugOverlay. */
		this.blendedImgAlpha = 0;
		/** @public @type {number} The image blur shown in showThemeDebugOverlay. */
		this.blendedImgBlur = 0;
		/** @public @type {string} The col.primary shown in showThemeDebugOverlay. */
		this.selectedPrimaryColor = '';
		/** @public @type {string} The col.secondary shown in showThemeDebugOverlay. */
		this.selectedSecondaryColor = '';
		// #endregion

		// * APCA REPAINT * //
		//#region APCA REPAINT
		/** @public @type {Function} The functions that throttles and limits repaint requests for the APCA overlay to 30 FPS. */
		this.repaintDebugAPCAOverlay = Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), FPS._30);
		//#endregion
	}

	// * PUBLIC METHODS - DRAW * //
	//#region PUBLIC METHODS - DRAW
	/**
	 * Draws the APCA calibration debug overlay.
	 * Cycles through 23 grayscale tones, applies them as primary colors, and displays all APCA keyframe values and calculated results.
	 * Use arrow keys to navigate: ← → to change tone, ↑ ↓ to cycle context modes.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugAPCACalibrationOverlay(gr) {
		if (!grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.loadingThemeComplete) return;

		gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		// * LAYOUT CONSTANTS * //
		const fullH = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;
		const panelW = Math.floor(grm.ui.ww * 0.50);
		const outerPadding = SCALE(40);
		const innerPadding = SCALE(15);
		const contentY = SCALE(25);
		const sectionGap = SCALE(25);
		const lineH = SCALE(25);
		const rowH = SCALE(40);

		// * INITIALIZE FONTS (CACHED) * //
		if (this.apcaLastDebugH !== fullH || !this.apcaFontIcon) {
			this.apcaLastDebugH = fullH;
			this.apcaFontIcon = gdi.Font('Reborn-Symbols', SCALE(14), 1);
			this.apcaFontHeader = gdi.Font('Segoe UI', SCALE(14), 1);
			this.apcaFontLabel = gdi.Font('Consolas', SCALE(12), 1);
			this.apcaFontValue = gdi.Font('Consolas', SCALE(12), 0);
		}

		// * TONE DATA * //
		const currentTone = this.apcaGrayscaleTones[this.apcaCalibrationIndex];
		const { Y } = currentTone.ref;
		const context = this.getAPCACalibrationContextConfig(Y);
		const { bevel, blend, blend2, gradient, gradient2, rebornBlack } = context;

		// * ENHANCED COLORS * //
		const testColor = this.getAPCACalibrationToneColor();
		const textColor = RGB(220, 220, 220);
		const dimTextColor = RGB(160, 160, 160);
		const successColor = RGB(100, 220, 100);
		const warningColor = RGB(255, 180, 50);
		const errorColor = RGB(255, 100, 100);
		const editingColor = RGB(255, 255, 100);
		const inputBgColor = RGB(35, 35, 50);
		const hoverBgColor = RGB(45, 45, 65);
		const cardBgColor = RGB(25, 25, 40);
		const rowBgValid = RGB(20, 40, 20);
		const rowBgInvalid = RGB(40, 20, 20);
		const rowBgAlt = RGB(25, 25, 40);

		// * BACKGROUND * //
		gr.FillSolidRect(grm.ui.albumArtSize.x, grm.ui.topMenuHeight, panelW, fullH, testColor);

		// * CONTENT AREA SETUP * //
		let dataY = contentY + outerPadding;
		const dataX = outerPadding + grm.ui.albumArtSize.x;
		const dataW = panelW - (outerPadding * 2);

		// * HEADER CARD * //
		const headerText = this.getAPCAHeaderText(testColor, context);
		const headerH = lineH + innerPadding;
		const caretSize = SCALE(22);
		const caretGroupGap = SCALE(12);
		const caretX = dataX + dataW - (caretSize * 4) - caretGroupGap - innerPadding;

		// Header card background
		gr.FillSolidRect(dataX, dataY, dataW, headerH, pl.col.header_nowplaying_bg);

		// Header text with padding
		gr.DrawString(headerText, this.apcaFontHeader, pl.col.row_title_playing, dataX + innerPadding, dataY + innerPadding * 0.5, dataW - innerPadding * 2, lineH, StringFormat(0, 1));

		// Context Up/Down carets
		const caretY = dataY + innerPadding * 0.5;
		gr.DrawString(RebornSymbols.CaretUp, this.apcaFontIcon, this.apcaControlsHover.caretUp ? successColor : pl.col.row_title_normal, caretX, caretY, caretSize, lineH, StringFormat(1, 1));
		gr.DrawString(RebornSymbols.CaretDown, this.apcaFontIcon, this.apcaControlsHover.caretDown ? successColor : pl.col.row_title_normal, caretX + caretSize, caretY, caretSize, lineH, StringFormat(1, 1));

		// Tone Left/Right carets
		gr.DrawString(RebornSymbols.CaretLeft, this.apcaFontIcon, this.apcaControlsHover.caretLeft ? successColor : pl.col.row_title_normal, caretX + (caretSize * 2) + caretGroupGap, caretY, caretSize, lineH, StringFormat(1, 1));
		gr.DrawString(RebornSymbols.CaretRight, this.apcaFontIcon, this.apcaControlsHover.caretRight ? successColor : pl.col.row_title_normal, caretX + (caretSize * 3) + caretGroupGap, caretY, caretSize, lineH, StringFormat(1, 1));

		dataY += headerH;

		// * TABLE HEADER - DATA ROWS * //
		const tableHeaderH = lineH + SCALE(8);
		gr.FillSolidRect(dataX, dataY, dataW, tableHeaderH, cardBgColor);

		// Column headers with improved spacing - aligned with data columns
		const colWidths = [
			Math.floor(dataW * 0.30), // Role
			Math.floor(dataW * 0.10), // Base
			Math.floor(dataW * 0.10), // Modified
			Math.floor(dataW * 0.10), // Rescue
			Math.floor(dataW * 0.20), // Result Color
			Math.floor(dataW * 0.05), // Contrast
			Math.floor(dataW * 0.15)  // Status
		];

		const headers = ['ROLE', 'BASE', 'MOD', 'RESCUE', 'RESULT', 'Lc', 'STATUS'];
		let colX = dataX;

		headers.forEach((header, i) => {
			const headerX = i === 0 ? colX + innerPadding : colX;
			const headerW = i === 0 ? colWidths[i] - innerPadding : colWidths[i];
			const headerAlign = i === 0 ? 0 : 1; // 0 = left, 1 = center

			gr.DrawString(header, this.apcaFontLabel, dimTextColor, headerX, dataY + SCALE(4), headerW, lineH, StringFormat(headerAlign, 1));
			colX += colWidths[i];
		});

		dataY += tableHeaderH;

		// * RESET HITBOXES FOR THIS FRAME * //
		this.apcaInputHitboxes = [];

		// * DATA ROWS WITH ENHANCED STYLING * //
		const roles = ['accent', 'progressBar.bg', 'progressBar.fill', 'nowPlaying', 'line.normal', 'line.playing'];
		const mouseX = grm.ui.state.mouse_x;
		const mouseY = grm.ui.state.mouse_y;

		for (let rowIdx = 0; rowIdx < roles.length; rowIdx++) {
			const role = roles[rowIdx];
			const keyframes = grm.colorSystem.getKeyframesByRole(role);
			const baseAmount = grm.colorSystem.interpolateKeyframes(keyframes, Y, 'value');
			const modifiedAmount = grm.colorSystem.applyContextModifiers(baseAmount, role, Y, context);
			const rescueType = role.includes('accent') ? 'accent' : 'progressBarBg';
			const rescueBoost = grm.colorSystem.getAdaptiveRescueBoost(Y, rescueType, context);

			// Check for custom overrides
			const baseKey = `${role}_${currentTone.name}_base`;
			const modKey = `${role}_${currentTone.name}_mod`;
			const rescueKey = `${role}_${currentTone.name}_rescue`;

			const finalBase = this.apcaCustomValues[baseKey] !== undefined ? this.apcaCustomValues[baseKey] : baseAmount;
			const finalMod = this.apcaCustomValues[modKey] !== undefined ? this.apcaCustomValues[modKey] : modifiedAmount;
			const finalRescue = this.apcaCustomValues[rescueKey] !== undefined ? this.apcaCustomValues[rescueKey] : rescueBoost;

			// Apply the final modified amount to get result color
			const resultColor = grm.colorSystem.applyColorTransform(testColor, finalMod, 'rgb', role);

			// Calculate contrast
			const contrast = grm.colorSystem.getContrast(testColor, resultColor);
			const minContrast = grm.colorSystem.interpolateKeyframes(
				grm.colorSystem.minContrast[role.includes('accent') ? 'accent' : 'progressBarBg'], Y, 'value'
			);

			// Validation
			const isValid = Math.abs(contrast) >= (minContrast * 100);
			const resultLum = Color.LUM(resultColor);

			// * DRAW ROW WITH ALTERNATING BACKGROUND * //
			const rowColor = isValid ? rowBgValid : rowBgInvalid;
			const altRowColor = rowIdx % 2 === 0 ? rowColor : rowBgAlt;

			colX = dataX;

			// Row background
			gr.FillSolidRect(dataX, dataY, dataW, rowH, altRowColor);

			// * ROLE COLUMN * //
			gr.DrawString(role, this.apcaFontLabel, textColor, colX + innerPadding, dataY, colWidths[0], rowH, StringFormat(0, 1));
			colX += colWidths[0];

			// * BASE COLUMN WITH ENHANCED INPUT STYLING * //
			const baseEditing = this.apcaFocusedInput === baseKey;
			const baseHovered = !baseEditing && mouseX >= colX && mouseX < colX + colWidths[1] && mouseY >= dataY && mouseY < dataY + rowH;
			const baseDisplay = baseEditing ? this.apcaInputBuffer : finalBase > 0 ? `+${finalBase.toFixed(0)}` : finalBase.toFixed(0);

			// Store hitbox
			this.apcaInputHitboxes.push({ key: baseKey, x: colX, y: dataY, w: colWidths[1], h: rowH });

			// Draw input background with padding
			const inputPad = SCALE(4);
			if (baseEditing) {
				gr.FillSolidRect(colX + inputPad, dataY + inputPad, colWidths[1] - inputPad * 2, rowH - inputPad * 2, inputBgColor);
				gr.DrawRect(colX + inputPad, dataY + inputPad, colWidths[1] - inputPad * 2, rowH - inputPad * 2, 1, editingColor);
			} else if (baseHovered) {
				gr.FillSolidRect(colX + inputPad, dataY + inputPad, colWidths[1] - inputPad * 2, rowH - inputPad * 2, hoverBgColor);
			}

			const baseColor = baseEditing ? editingColor : this.apcaCustomValues[baseKey] !== undefined ? successColor : textColor;
			gr.DrawString(baseDisplay, this.apcaFontValue, baseColor, colX, dataY, colWidths[1], rowH, StringFormat(1, 1));
			colX += colWidths[1];

			// * MOD COLUMN * //
			const modEditing = this.apcaFocusedInput === modKey;
			const modHovered = !modEditing && mouseX >= colX && mouseX < colX + colWidths[2] && mouseY >= dataY && mouseY < dataY + rowH;
			const modDisplay = modEditing ? this.apcaInputBuffer : finalMod > 0 ? `+${finalMod.toFixed(0)}` : finalMod.toFixed(0);

			this.apcaInputHitboxes.push({ key: modKey, x: colX, y: dataY, w: colWidths[2], h: rowH });

			if (modEditing) {
				gr.FillSolidRect(colX + inputPad, dataY + inputPad, colWidths[2] - inputPad * 2, rowH - inputPad * 2, inputBgColor);
				gr.DrawRect(colX + inputPad, dataY + inputPad, colWidths[2] - inputPad * 2, rowH - inputPad * 2, 1, editingColor);
			} else if (modHovered) {
				gr.FillSolidRect(colX + inputPad, dataY + inputPad, colWidths[2] - inputPad * 2, rowH - inputPad * 2, hoverBgColor);
			}

			const modColor = modEditing ? editingColor :this.apcaCustomValues[modKey] !== undefined ? successColor : Math.abs(finalMod - finalBase) > 0.5 ? warningColor : textColor;
			gr.DrawString(modDisplay, this.apcaFontValue, modColor, colX, dataY, colWidths[2], rowH, StringFormat(1, 1));
			colX += colWidths[2];

			// * RESCUE COLUMN * //
			const rescueEditing = this.apcaFocusedInput === rescueKey;
			const rescueHovered = !rescueEditing && mouseX >= colX && mouseX < colX + colWidths[3] && mouseY >= dataY && mouseY < dataY + rowH;
			const rescueDisplay = rescueEditing ? this.apcaInputBuffer : finalRescue > 0 ? `+${finalRescue.toFixed(0)}` : '-';

			this.apcaInputHitboxes.push({ key: rescueKey, x: colX, y: dataY, w: colWidths[3], h: rowH });

			if (rescueEditing) {
				gr.FillSolidRect(colX + inputPad, dataY + inputPad, colWidths[3] - inputPad * 2, rowH - inputPad * 2, inputBgColor);
				gr.DrawRect(colX + inputPad, dataY + inputPad, colWidths[3] - inputPad * 2, rowH - inputPad * 2, 1, editingColor);
			} else if (rescueHovered) {
				gr.FillSolidRect(colX + inputPad, dataY + inputPad, colWidths[3] - inputPad * 2, rowH - inputPad * 2, hoverBgColor);
			}

			const rescueColor = rescueEditing ? editingColor : this.apcaCustomValues[rescueKey] !== undefined ? successColor : textColor;
			gr.DrawString(rescueDisplay, this.apcaFontValue, rescueColor, colX, dataY, colWidths[3], rowH, StringFormat(1, 1));
			colX += colWidths[3];

			// * RESULT COLOR SWATCH WITH BORDER * //
			const swatchPad = SCALE(10);
			const swatchW = colWidths[4] - swatchPad * 4;
			const swatchX = colX + swatchPad * 2;
			const swatchY = dataY + swatchPad;
			const swatchH = rowH - swatchPad * 2;

			gr.FillSolidRect(swatchX, swatchY, swatchW, swatchH, resultColor);

			// Luminance label on swatch
			const lumStr = resultLum.toFixed(3);
			const swatchTextColor = resultLum > 0.5 ? RGB(0, 0, 0) : RGB(255, 255, 255);
			gr.DrawString(lumStr, this.apcaFontValue, swatchTextColor, swatchX, swatchY, swatchW, swatchH, StringFormat(1, 1));
			colX += colWidths[4];

			// * CONTRAST Lc * //
			const lcStr = Math.abs(contrast).toFixed(0);
			const lcColor = grm.colorSystem.getStatusColor(lcStr);
			gr.DrawString(lcStr, this.apcaFontValue, lcColor, colX, dataY, colWidths[5], rowH, StringFormat(1, 1));
			colX += colWidths[5];

			// * STATUS * //
			const statusStr = isValid ? Unicode.CheckMark : Unicode.BallotX;
			const statusColor = isValid ? successColor : errorColor;
			gr.DrawString(statusStr, this.apcaFontLabel, statusColor, colX, dataY, colWidths[6], rowH, StringFormat(1, 1));

			dataY += rowH;
		}

		if (grm.ui.styledTooltipText) grm.ui.drawStyledTooltips(gr);

		// * ADDITIONAL KEYFRAMES SECTION WITH CARD STYLING * //
		if (!gradient && !gradient2 && !blend && !blend2 && !bevel) return;

		dataY += sectionGap;

		// Header Text
		const dynamicHeader = (blend || blend2) ? 'BLEND OVERLAY' : (gradient || gradient2) ? 'GRADIENT OVERLAY' : (bevel) ? 'BEVEL' : 'ADDITIONAL KEYFRAMES';

		// Draw Header Card
		gr.FillSolidRect(dataX, dataY, dataW, headerH, pl.col.header_nowplaying_bg);
		gr.DrawString(dynamicHeader, this.apcaFontHeader, pl.col.row_title_playing, dataX + innerPadding, dataY + SCALE(4), dataW - innerPadding * 2, lineH, StringFormat(0, 1));

		dataY += headerH;

		// Calculate Dynamic Content Height
		const bevelH = bevel ? lineH * 3 : 0;
		const blendH = (blend || blend2) ? lineH : 0;
		const blend2H = blend2 ? lineH * (grm.colorSystem.modifiersConfig.blend2.reductionTable.length + 1) : 0;
		const gradientH = (gradient || gradient2) ? lineH : 0;
		const contentItemsH = innerPadding + bevelH + blendH + blend2H + gradientH;

		gr.FillSolidRect(dataX, dataY, dataW, contentItemsH + innerPadding, rowBgAlt);

		let textY = dataY + innerPadding;

		// * BEVEL/TRANSPORT KEYFRAMES * //
		if (bevel) {
			const embossLight = grm.colorSystem.interpolateKeyframes(grm.colorSystem.transportKeyframes.embossLight, Y, 'value');
			const embossDark = grm.colorSystem.interpolateKeyframes(grm.colorSystem.transportKeyframes.embossDark, Y, 'value');
			const bottomShift = grm.colorSystem.interpolateKeyframes(grm.colorSystem.transportKeyframes.bottom, Y, 'value');

			gr.DrawString(`Light: +${embossLight.toFixed(0)}`, this.apcaFontValue, textColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
			textY += lineH;
			gr.DrawString(`Dark: ${embossDark > 0 ? '+' : ''}${embossDark.toFixed(0)}`, this.apcaFontValue, textColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
			textY += lineH;
			gr.DrawString(`Bottom: ${bottomShift > 0 ? '+' : ''}${bottomShift.toFixed(0)}`, this.apcaFontValue, textColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
			textY += lineH;
		}

		// * BLEND/BLEND2 KEYFRAMES * //
		if (blend || blend2) {
			const blendAlpha = grm.colorStyles.getStyleBlendImageAlpha(Y, Y, 50);
			const blendBlur = grm.colorStyles.getStyleBlendImageBlur(Y, Y, blendAlpha, 50);

			gr.DrawString(`Alpha: ${blendAlpha}  |  Blur: ${blendBlur}`, this.apcaFontValue, textColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
			textY += lineH;

			if (blend2) {
				gr.DrawString(`Reduction (imgLum dependent):`, this.apcaFontValue, textColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
				textY += lineH;
				const { reductionTable } = grm.colorSystem.modifiersConfig.blend2;
				for (const entry of reductionTable) {
					gr.DrawString(`Lum < ${entry.max.toFixed(2)}: -${entry.reduction}%`, this.apcaFontValue, dimTextColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
					textY += lineH;
				}
			}
		}

		// * GRADIENT/GRADIENT2 KEYFRAMES * //
		if (gradient || gradient2) {
			const gradientKeyframes = rebornBlack ? grm.colorSystem.styleKeyframes.gradientRebornBlack : grm.colorSystem.styleKeyframes.gradient;
			const gradientAmount = grm.colorSystem.interpolateKeyframes(gradientKeyframes, Y, 'value');
			const gradientLabel = rebornBlack ? '(RebornBlack)' : gradient2 ? '(Grad 2)' : '(Grad 1)';

			gr.DrawString(`Gradient ${gradientLabel}: ${gradientAmount > 0 ? '+' : ''}${gradientAmount.toFixed(0)}`, this.apcaFontValue, textColor, dataX + innerPadding, textY, dataW - innerPadding * 2, lineH, StringFormat(0, 1));
		}
	}

	/**
	 * Draws the color debug overlay.
	 * Displaying extracted palette colors from album art, metadata, primary/secondary markers, and APCA contrast scores.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugColorOverlay(gr) {
		if (!grCfg.settings.showDebugColorOverlay || !grm.ui.loadingThemeComplete || !grm.ui.albumArt) return;

		gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const getFormatDetails = (H, S, B, okL, okC, okH) => ({
			full: `HSB ${H} ${S} ${B}  |  LCH ${okL} ${okC} ${okH}  |  `,
			medium: `HSB ${H} ${S} ${B}  |  `,
			minimal: ''
		});

		// Artwork setup
		const maxColors = 14;
		const padding = grm.ui.seekbarX;
		const contentH = grm.ui.albumArtSize.h - padding * 2;
		const artH = contentH;
		const artW = Math.round(artH * (grm.ui.albumArt.Width / grm.ui.albumArt.Height));
		const artX = grm.ui.seekbarX;
		const artY = grm.ui.albumArtSize.y + padding;

		gr.FillSolidRect(grm.ui.albumArtSize.x, grm.ui.albumArtSize.y, grm.ui.ww, grm.ui.albumArtSize.h, RGB(0, 0, 0));
		gr.DrawImage(grm.ui.albumArt, artX, artY, artW, artH, 0, 0, grm.ui.albumArt.Width, grm.ui.albumArt.Height);

		// Palette geometry
		const paletteX = artX + artW + padding;
		const paletteW = (grm.ui.ww - paletteX) - padding;
		const swatchW = Math.round(paletteW * 0.25);
		const metaW = paletteW - swatchW - padding * 0.5;
		const swatchH = artH / maxColors;

		// Responsive font sizes - only recreate when window size changed
		if (this.lastDebugH !== contentH || !this.fontDebugMeta) {
			this.lastDebugH = contentH;
			this.fontDebugMeta = gdi.Font('Consolas', Math.round(swatchH * (grm.ui.wh > 900 ? 0.25 : 0.35)), 0);
			this.fontDebugLabel = gdi.Font('Consolas', Math.round(swatchH * (grm.ui.wh > 900 ? 0.4 : 0.5)), 1);
		}

		// Calculate positioning
		const labelX = paletteX + Math.round(swatchH * 0.25);
		const metaX = paletteX + swatchW + padding * 0.9;
		const format = metaW > 500 ? 'full' : metaW > 300 ? 'medium' : 'minimal';

		// Get album art colors palette
		const scheme = GetAlbumArtColors(grm.ui.albumArt, grm.ui.cachedAlbumArtColors, maxColors);
		const minFrequency = grm.colorManager.getAdaptiveMinFrequency(scheme);
		const minLuminance = grm.colorManager.getMinLuminance(scheme);
		const maxLuminance = grm.colorManager.getMaxLuminance();
		const colors = grm.colorManager.getAlbumArtWeightedColors(scheme, minFrequency, minLuminance, maxLuminance);
		colors.sort((a, b) => b.weight - a.weight);

		colors.forEach((c, i) => {
			const { r, g, b, hue, saturation, brightness, oklchL, oklchC, oklchH } = c.col;

			const rgbStr = `${LeftPad(r, 3)}, ${LeftPad(g, 3)}, ${LeftPad(b, 3)}`;

			const H = LeftPad(hue.toFixed(0), 3);
			const S = LeftPad(saturation.toFixed(0), 3);
			const B = LeftPad(brightness.toFixed(0), 3);

			const okL = oklchL.toFixed(3).padStart(5);
			const okC = oklchC.toFixed(3).padStart(6);
			const okH = oklchH.toFixed(0).padStart(3);

			const textColor = grm.colorSystem.getTextColor(c.col.val, RGB(220, 220, 220), RGB(80, 80, 80), 45).color;
			const lcWhite = grm.colorSystem.getContrast(c.col.val, RGB(220, 220, 220));
			const lcBlack = grm.colorSystem.getContrast(c.col.val, RGB(80, 80, 80));
			const colorWhite = grm.colorSystem.getStatusColor(lcWhite);
			const colorBlack = grm.colorSystem.getStatusColor(lcBlack);

			const colorMeta = c.isValidPrimary ? RGB(220, 220, 220) : RGB(110, 110, 110);
			const colorPrimary = c.col.val === grCol.primary_raw;
			const colorSecondary = c.col.val === grCol.secondary_raw;

			const rowY = artY + (i * swatchH);

			// * Color swatch
			gr.FillSolidRect(paletteX, rowY, swatchW, swatchH, RGBA(r, g, b, c.isValidPrimary ? 255 : 200));
			gr.DrawString(rgbStr, this.fontDebugMeta, textColor, paletteX, rowY, swatchW, swatchH, StringFormat(1, 1));

			// * Primary & Secondary color markers
			if (colorPrimary || colorSecondary) {
				const label = colorPrimary ? 'P' : 'S';
				gr.DrawString(label, this.fontDebugLabel, textColor, labelX, rowY - SCALE(2), swatchH, swatchH, StringFormat(0, 1));
			}

			// * Metadata - adaptive format based on available width
			const idxStr = (i + 1).toString().padStart(2, '0');
			const freqStr = (c.freq * 100).toFixed(1).padStart(5, ' ');
			const detailsStr = getFormatDetails(H, S, B, okL, okC, okH);
			const baseMeta = `#${idxStr} ${freqStr}%  |  ${detailsStr[format] || ''}`;

			gr.DrawString(baseMeta, this.fontDebugMeta, colorMeta, metaX, rowY, metaW, swatchH, StringFormat(0, 1));

			// * APCA contrast info
			const baseWidth = gr.MeasureString(baseMeta, this.fontDebugMeta, 0, 0, 0, 0).Width;
			const apcaX = metaX + baseWidth;
			const lcWhiteStr = Math.abs(lcWhite).toFixed(0).padStart(3);
			const lcBlackStr = Math.abs(lcBlack).toFixed(0).padStart(3);
			const apcaStr = `  W ${lcWhiteStr}    B ${lcBlackStr}`;

			gr.DrawString(apcaStr, this.fontDebugMeta, colorMeta, apcaX, rowY, metaW, swatchH, StringFormat(0, 1));

			// * APCA indicator dots
			const whitePrefix = '  W ';
			const blackPrefix = '    B ';
			const fullWhiteSegment = whitePrefix + lcWhiteStr;
			const fullBlackSegment = whitePrefix + lcWhiteStr + blackPrefix + lcBlackStr;
			const dotSpacing = gr.MeasureString('X', this.fontDebugMeta, 0, 0, 0, 0).Width;
			const dot1X = apcaX + gr.MeasureString(fullWhiteSegment, this.fontDebugMeta, 0, 0, 0, 0).Width + dotSpacing;
			const dot2X = apcaX + gr.MeasureString(fullBlackSegment, this.fontDebugMeta, 0, 0, 0, 0).Width + dotSpacing;

			gr.DrawString(Unicode.BlackCircle, this.fontDebugMeta, colorWhite, dot1X, rowY, metaW, swatchH, StringFormat(0, 1));
			gr.DrawString(Unicode.BlackCircle, this.fontDebugMeta, colorBlack, dot2X, rowY, metaW, swatchH, StringFormat(0, 1));

			// * Color weighting bars
			const barH = SCALE(4);
			const barY = rowY + swatchH - barH;
			const barMaxW = (grm.ui.ww - metaX) - padding;
			const barW = barMaxW * (c.weight / colors[0].weight);
			gr.FillSolidRect(metaX, barY, barMaxW, SCALE(2), RGB(50, 50, 50));
			gr.FillSolidRect(metaX, barY - 1, barW, barH, RGB(r, g, b));
		});
	}

	/**
	 * Draws the debug theme overlay in the album art area when `Enable debug theme overlay` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugThemeOverlay(gr) {
		if (!grCfg.settings.showDebugThemeOverlay || !grm.ui.loadingThemeComplete) return;

		const blend = grSet.styleBlend || grSet.styleBlend2;
		const fullW = grSet.layout === 'default' && grSet.lyricsLayout !== 'normal' && grm.ui.displayLyrics && grm.ui.noAlbumArtStub || grSet.layout === 'artwork';
		const titleWidth = grm.ui.albumArtSize.w - SCALE(80);
		const titleHeight = gr.CalcTextHeight(' ', grFont.popup);
		const lineSpacing = titleHeight * 1.5;
		const logColor = RGB(255, 255, 255);
		const x = grm.ui.albumArtSize.x + grm.ui.edgeMargin;
		let y = grm.ui.albumArtSize.y;

		const createBlock = (obj) => Object.keys(obj).find(key => obj[key]) || '';

		const tsBlock0 = createBlock({
			'Nighttime,': grSet.styleNighttime
		});

		const tsBlock1 = createBlock({
			'Bevel,': grSet.styleBevel
		});

		const tsBlock2 = createBlock({
			'Blend,': grSet.styleBlend,
			'Blend 2,': grSet.styleBlend2,
			'Gradient,': grSet.styleGradient,
			'Gradient 2,': grSet.styleGradient2
		});

		const tsBlock3 = createBlock({
			'Alternative ': grSet.styleAlternative,
			'Alternative 2': grSet.styleAlternative2,
			'Black and white': grSet.styleBlackAndWhite,
			'Black and white 2': grSet.styleBlackAndWhite2,
			'Black and white reborn': grSet.styleBlackAndWhiteReborn,
			'Black reborn': grSet.styleBlackReborn,
			'Reborn white': grSet.styleRebornWhite,
			'Reborn black': grSet.styleRebornBlack,
			'Reborn fusion': grSet.styleRebornFusion,
			'Reborn fusion 2': grSet.styleRebornFusion2,
			'Reborn fusion accent': grSet.styleRebornFusionAccent,
			'Random pastel': grSet.styleRandomPastel,
			'Random dark': grSet.styleRandomDark
		});

		const tsTopMenuButtons = grSet.styleTopMenuButtons !== 'default' ? CapitalizeString(`${grSet.styleTopMenuButtons}`) : '';
		const tsTransportButtons = grSet.styleTransportButtons !== 'default' ? CapitalizeString(`${grSet.styleTransportButtons}`) : '';
		const tsProgressBar1 = grSet.styleProgressBarDesign === 'rounded' ? 'Rounded,' : '';
		const tsProgressBar2 = grSet.styleProgressBar !== 'default' ? `Bg: ${CapitalizeString(`${grSet.styleProgressBar},`)}` : '';
		const tsProgressBar3 = grSet.styleProgressBarFill !== 'default' ? `Fill: ${CapitalizeString(`${grSet.styleProgressBarFill}`)}` : '';
		const tsVolumeBar1 = grSet.styleVolumeBarDesign === 'rounded' ? 'Rounded,' : '';
		const tsVolumeBar2 = grSet.styleVolumeBar !== 'default' ? `Bg: ${CapitalizeString(`${grSet.styleVolumeBar},`)}` : '';
		const tsVolumeBar3 = grSet.styleVolumeBarFill !== 'default' ? `Fill: ${CapitalizeString(`${grSet.styleVolumeBarFill}`)}` : '';

		const propertiesLog = [
			{ prop: this.selectedPrimaryColor, log: `Primary color: ${this.selectedPrimaryColor}` },
			{ prop: this.selectedSecondaryColor, log: `Secondary color: ${this.selectedSecondaryColor}` },
			{ prop: grCol.colBrightness, log: `Primary color brightness: ${grCol.colBrightness}` },
			{ prop: grCol.colBrightness2, log: `Secondary color brightness: ${grCol.colBrightness2}` },
			{ prop: grCol.colLuminance, log: `Primary color luminance: ${grCol.colLuminance.toFixed(4)}` },
			{ prop: grCol.colLuminance2, log: `Secondary color luminance: ${grCol.colLuminance2.toFixed(4)}` },
			{ prop: grCol.imgBrightness, log: `Image brightness: ${grCol.imgBrightness}` },
			{ prop: grCol.imgLuminance, log: `Image luminance: ${grCol.imgLuminance.toFixed(4)}` },
			{ prop: blend, log: `Image blur: ${this.blendedImgBlur}` },
			{ prop: blend, log: `Image alpha: ${this.blendedImgAlpha}` },
			{ prop: grSet.preset, log: `Theme preset: ${grSet.preset}` },
			{ prop: grSet.themeBrightness !== 'default', log: `Theme brightness: ${grSet.themeBrightness}%` },
			{ prop: tsBlock0 || tsBlock1 || tsBlock2 || tsBlock3, log: `Styles: ${tsBlock0} ${tsBlock1} ${tsBlock2} ${tsBlock3}` },
			{ prop: tsTopMenuButtons, log: `Top menu button style: ${tsTopMenuButtons}` },
			{ prop: tsTransportButtons, log: `Transport button style: ${tsTransportButtons}` },
			{ prop: tsProgressBar1 || tsProgressBar2 || tsProgressBar3, log: tsProgressBar1 || tsProgressBar2 || tsProgressBar3 ? `Progressbar styles: ${tsProgressBar1} ${tsProgressBar2} ${tsProgressBar3}` : '' },
			{ prop: tsVolumeBar1 || tsVolumeBar2 || tsVolumeBar3, log: `Volumebar styles: ${tsVolumeBar1} ${tsVolumeBar2} ${tsVolumeBar3}` }
		];

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(fullW ? 0 : grm.ui.albumArtSize.x, fullW ? grm.ui.topMenuHeight : grm.ui.albumArtSize.y, fullW ? grm.ui.ww : grm.ui.albumArtSize.w, fullW ? grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight : grm.ui.albumArtSize.h, RGBA(0, 0, 0, 180));
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const drawString = (str) => {
			y += lineSpacing;
			gr.DrawString(str, grFont.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
		};

		for (const { prop, log } of propertiesLog) {
			if (prop) {
				drawString(log);
				if (log.startsWith('Secondary color luminance: ')) {
					y += lineSpacing;
				}
				if ((blend && log.startsWith('Image alpha: ')) || (!blend && log.startsWith('Image luminance: '))) {
					y += lineSpacing;
				}
			}
		}
	}
	//#endregion

	// * PUBLIC METHODS - APCA DEBUG OVERLAY * //
	// #region PUBLIC METHODS - APCA DEBUG OVERLAY
	/**
	 * Shifts the APCA calibration tone index by a given delta.
	 * Validates bounds against the available grayscale tones.
	 * @param {number} delta - The amount to shift (e.g., 1 or -1).
	 * @returns {boolean} True if the index was changed, false if out of bounds.
	 */
	changeAPCACalibrationTone(delta) {
		const newIdx = this.apcaCalibrationIndex + delta;

		if (newIdx >= 0 && newIdx < this.apcaGrayscaleTones.length) {
			this.apcaCalibrationIndex = newIdx;
			grm.colorManager.setPrimaryColor(this.apcaLastAppliedColor);
			return true;
		}

		return false;
	}

	/**
	 * Cycles through APCA context configurations by actually activating theme styles.
	 * Each context represents a real style combination that gets applied to the theme.
	 * @param {number} delta - The direction to shift (-1 for up, +1 for down).
	 * @returns {boolean} True if the context was updated, false if out of bounds.
	 */
	changeAPCACalibrationContext(delta) {
		const idx = this.apcaContextStyles.findIndex(c => c.name === this.apcaCalibrationContext);
		const newIdx = idx + delta;

		if (newIdx < 0 || newIdx >= this.apcaContextStyles.length) {
			return false;
		}

		grm.ui.resetStyle('all');

		// Update context tracking
		const config = this.apcaContextStyles[newIdx];
		this.apcaCalibrationContext = config.name;

		grSet.styleDefault = false;
		grSet.styleBevel = config.bevel;
		grSet.styleBlend = config.blend;
		grSet.styleBlend2 = config.blend2;
		grSet.styleGradient = config.grad;
		grSet.styleGradient2 = config.grad2;
		grSet.styleAlternative = config.alt;
		grSet.styleAlternative2 = config.alt2;

		grm.colorManager.setPrimaryColor(this.apcaLastAppliedColor);

		if (grCfg.settings.showDebugThemeLog) {
			console.log(`APCA Context changed to: ${this.apcaCalibrationContext} (Bevel:${config.bevel}, Blend:${config.blend}, Blend2:${config.blend2})`);
		}

		return true;
	}

	/**
	 * Cycles through color channel modes (Grayscale → Red → Green → Blue).
	 * @returns {boolean} Always true (key was handled).
	 */
	cycleAPCAColorMode() {
		this.apcaColorModeIndex = (this.apcaColorModeIndex + 1) % this.apcaColorModes.length;
		grm.colorManager.setPrimaryColor(this.apcaLastAppliedColor);

		if (grCfg.settings.showDebugThemeLog) {
			console.log(`APCA Color Mode ${Unicode.RightArrow} ${this.apcaColorModes[this.apcaColorModeIndex]}`);
		}

		return true;
	}

	/**
	 * Generates the formatted header string for the APCA calibration display.
	 * @param {Color} testColor - The Color object.
	 * @param {Object} context - The context configuration (label, modifiers, etc).
	 * @returns {string} The fully assembled header text string.
	 */
	getAPCAHeaderText(testColor, context) {
		const currentTone = this.apcaGrayscaleTones[this.apcaCalibrationIndex];
		const currentToneIndex = `${this.apcaCalibrationIndex + 1}/${this.apcaGrayscaleTones.length}`;
		const { Y, L, gray } = currentTone.ref;

		const actualY = grm.colorSystem.getRelativeLuminance(new Color(testColor));
		const exactMatchY = this.apcaColorModeIndex === 0 || Math.abs(actualY - Y) < 0.001;
		const clipLabel = actualY < Y ? ' (clip)' : '';

		const displayY = exactMatchY ? Y.toFixed(3) :
			`${Y.toFixed(3)} ${Unicode.TriangularBullet} ${actualY.toFixed(3)}${clipLabel}`;

		const group1 = `${currentTone.name} ${currentToneIndex} ${Unicode.MiddleDot}`;
		const group2 = `${context.label} ${Unicode.MiddleDot}`;
		const group3 = `Y ${displayY} L ${L.toFixed(4)} Gray ${gray}`;

		return `${group1} ${group2} ${group3}`;
	}

	/**
	 * Prints changed custom values in the console for hardcoding into APCA keyframes.
	 */
	printAPCACustomValues() {
		fb.RunMainMenuCommand('View/Console');

		const header = '\n>>> APCA CUSTOM VALUES EXPORT <<<\n';
		const end = '\n>>> END EXPORT <<<\n';

		if (Object.keys(this.apcaCustomValues).length === 0) {
			console.log(header);
			console.log('No custom values to export');
			console.log(end);
			return;
		}

		console.log(header);

		// Group by tone
		const byTone = {};
		for (const [key, value] of Object.entries(this.apcaCustomValues)) {
			const [role, toneName, type] = key.split('_');
			if (!byTone[toneName]) byTone[toneName] = {};
			if (!byTone[toneName][role]) byTone[toneName][role] = {};
			byTone[toneName][role][type] = value;
		}

		// Print organized output
		for (const [toneName, roles] of Object.entries(byTone)) {
			console.log(`${toneName}:`);
			for (const [role, types] of Object.entries(roles)) {
				const parts = [];
				if (types.base !== undefined) parts.push(`${role}: ${types.base}`);
				if (types.mod !== undefined) parts.push(`${role}_modified: ${types.mod}`);
				if (types.rescue !== undefined) parts.push(`${role}_rescue: ${types.rescue}`);
				console.log(`  ${parts.join(', ')}`);
			}
			console.log('');
		}

		console.log(end);
	}

	/**
	 * Retrieves the current APCA calibration context configuration based on active theme styles.
	 * Maps actual grSet.style* settings to context flags used by APCA calculations.
	 * @param {number} luminance - The Y (luminance) value of the current background tone. Used for dynamic blend offsets.
	 * @returns {object} The context configuration object including labels and style flags.
	 */
	getAPCACalibrationContextConfig(luminance) {
		const {
			styleBevel: bevel, styleBlend: blend, styleBlend2: blend2,
			styleGradient: grad, styleGradient2: grad2,
			styleAlternative: alt, styleAlternative2: alt2,
			styleRebornBlack: rebornBlack
		} = grSet;

		const styleBlend = blend2 ? 'Blend2' : blend ? 'Blend' : null;
		const styleGradient = grad2 ? 'Grad2' : grad ? 'Grad' : null;

		const label = [bevel && 'Bevel', styleBlend, styleGradient, alt && 'Alt', alt2 && 'Alt2']
			.filter(Boolean).join(' + ') || 'No Styles';

		const lum = styleBlend ? luminance * (styleBlend === 'Blend2' ? 0.7 : 0.8) : undefined;
		const sat = styleBlend ? (styleBlend === 'Blend2' ? 65 : 50) : undefined;

		return {
			label, bevel, blend, blend2, gradient: grad, gradient2: grad2, alt, rebornBlack,
			imgLuminance: lum, saturation: sat
		};
	}

	/**
	 * Calculates the hitboxes for the calibration overlay header controls.
	 * Used for both hover rendering and mouse click interaction.
	 * @param {number} x - The starting X coordinate of the header area.
	 * @param {number} y - The starting Y coordinate (top of the line).
	 * @param {number} w - The total available width for the header.
	 * @param {number} h - The height of the interaction line.
	 * @returns {Object} The object containing boolean hover states for each control element.
	 */
	getAPCACalibrationHitboxes(x, y, w, h) {
		const caretSize = SCALE(22);
		const caretGroupGap = SCALE(12);
		const innerPadding = SCALE(15);
		const iconX = x + w - (caretSize * 4) - caretGroupGap - innerPadding;
		const textW = w - (caretSize * 4) - caretGroupGap - innerPadding * 2;

		const mx = grm.ui.state.mouse_x;
		const my = grm.ui.state.mouse_y;
		const isWithinLine = my >= y && my <= y + h;

		return {
			headerText: isWithinLine && mx >= x && mx <= x + textW,
			caretUp:    isWithinLine && mx >= iconX && mx < iconX + caretSize,
			caretDown:  isWithinLine && mx >= iconX + caretSize && mx < iconX + caretSize * 2,
			caretLeft:  isWithinLine && mx >= iconX + caretSize * 2 + caretGroupGap && mx < iconX + caretSize * 3 + caretGroupGap,
			caretRight: isWithinLine && mx >= iconX + caretSize * 3 + caretGroupGap && mx <= iconX + caretSize * 4 + caretGroupGap
		};
	}

	/**
	 * Retrieves the current test color based on calibration index and active color mode.
	 * For channel modes, scales the single channel to exactly match the reference APCA luminance Y
	 * using the precise APCA exponent 2.4 and per-channel weights.
	 * @returns {number} The calculated RGB color value (0xRRGGBB).
	 */
	getAPCACalibrationToneColor() {
		const mode = this.apcaColorModes[this.apcaColorModeIndex];
		const { Y, gray } = this.apcaGrayscaleTones[this.apcaCalibrationIndex].ref;

		const CHANNELS = ['Red', 'Green', 'Blue'];
		const WEIGHTS = [0.2126729, 0.7151522, 0.0721750];

		const rgb = WEIGHTS.map((weight, i) => {
			if (mode === 'Grayscale') {
				return gray;
			}
			if (mode === CHANNELS[i] && Y > 0) {
				const ratio = Math.min(1, Y / weight);
				return Math.round(255 * (ratio ** (1 / 2.4)));
			}
			return 0;
		});

		return (this.apcaLastAppliedColor = RGB(...rgb));
	}

	/**
	 * Handles mouse clicks for the entire APCA debug overlay (inputs + header controls).
	 * @param {number} x - The mouse X coordinate.
	 * @param {number} y - The mouse Y coordinate.
	 * @returns {boolean} True if click was handled.
	 */
	handleAPCACalibrationClick(x, y) {
		if (this.handleAPCACalibrationInputClick(x, y)) {
			window.Repaint();
			return;
		}

		const hover = this.apcaControlsHover;

		if (!(hover && (hover.caretUp || hover.caretDown || hover.caretLeft || hover.caretRight))) {
			return;
		}

		const changed =
			hover.caretRight ? grm.debug.changeAPCACalibrationTone(1) :
			hover.caretLeft  ? grm.debug.changeAPCACalibrationTone(-1) :
			hover.caretDown  ? grm.debug.changeAPCACalibrationContext(1) :
			hover.caretUp    ? grm.debug.changeAPCACalibrationContext(-1) :
			false;

		if (changed) {
			grm.colorManager.setPrimaryColor(grm.debug.apcaLastAppliedColor);
			window.Repaint();
		}

		return;
	}

	/**
	 * Handles mouse clicks on editable input fields in the APCA calibration overlay.
	 * Detects clicks on BASE, MOD, and RESCUE columns and activates editing mode.
	 * @param {number} x - The mouse X coordinate.
	 * @param {number} y - The mouse Y coordinate.
	 * @returns {boolean} True if click was handled.
	 */
	handleAPCACalibrationInputClick(x, y) {
		if (!grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.loadingThemeComplete) {
			return false;
		}

		const hitHitbox = this.apcaInputHitboxes.find(hitbox =>
			x >= hitbox.x && x < hitbox.x + hitbox.w &&
			y >= hitbox.y && y < hitbox.y + hitbox.h
		);

		if (!hitHitbox) return false;

		this.apcaFocusedInput = hitHitbox.key;

		const getDefaultValue = (role, toneName, column) => {
			const tone = this.apcaGrayscaleTones.find(t => t.name === toneName);
			if (!tone) return 0;

			const { Y } = tone.ref;
			const context = this.getAPCACalibrationContextConfig(Y);

			const columnHandlers = {
				base: () => {
					// Use ACCENT_KEYFRAMES for accent roles, or getKeyframesByRole for others
					const keyframes = role.includes('accent')
						? grm.colorSystem.accentKeyframes
						: grm.colorSystem.getKeyframesByRole(role);
					return grm.colorSystem.interpolateKeyframes(keyframes, Y, 'value');
				},
				mod: () => {
					const keyframes = role.includes('accent')
						? grm.colorSystem.accentKeyframes
						: grm.colorSystem.getKeyframesByRole(role);
					const baseAmt = grm.colorSystem.interpolateKeyframes(keyframes, Y, 'value');
					return grm.colorSystem.applyContextModifiers(baseAmt, role, Y, context);
				},
				rescue: () => {
					const rescueType = role.includes('accent') ? 'accent' : 'bar';
					return grm.colorSystem.getAdaptiveRescueBoost(Y, rescueType, context);
				}
			};

			const handler = columnHandlers[column];
			return handler ? handler() : 0;
		};

		let value;
		const custom = this.apcaCustomValues[hitHitbox.key];

		if (custom === undefined) {
			const [role, toneName, column] = hitHitbox.key.split('_');
			value = getDefaultValue(role, toneName, column);
		} else {
			value = custom;
		}

		this.apcaInputBuffer = Math.round(value || 0).toString();
		window.Repaint();

		return true;
	}

	/**
	 * Handles character input for editing APCA values.
	 * Allows typing numbers and +/- signs in the focused input field.
	 * @param {number} code - The character code from on_char event.
	 * @returns {boolean} True if handled.
	 */
	handleAPCACalibrationChar(code) {
		if (!this.apcaFocusedInput) return false;

		const char = String.fromCharCode(code);
		Regex.NumDigit.lastIndex = 0;
		Regex.NumSign.lastIndex = 0;

		// Digits: always append
		if (Regex.NumDigit.test(char)) {
			this.apcaInputBuffer += char;
			window.Repaint();
			return true;
		}

		// Signs: only allowed at start (or replacing existing sign)
		if (Regex.NumSign.test(char)) {
			const isEmpty = this.apcaInputBuffer.length === 0;
			const isOnlySign = this.apcaInputBuffer.length === 1 && Regex.NumSign.test(this.apcaInputBuffer);

			if (isEmpty || isOnlySign) {
				this.apcaInputBuffer = char;
				window.Repaint();
				return true;
			}

			return true;
		}

		return false;
	}

	/**
	 * Handles keyboard navigation for the APCA calibration overlay.
	 * Enhanced to support input field editing with ENTER/ESC/BACKSPACE.
	 * @param {number} vkey - The virtual key code.
	 * @returns {boolean} True if handled.
	 */
	handleAPCACalibrationKey(vkey) {
		const inputKeyActions = {
			[VKey.RETURN]: () => {
				const value = parseFloat(this.apcaInputBuffer);

				if (!isNaN(value)) {
					// * Apply to APCA engine *
					this.apcaCustomValues[this.apcaFocusedInput] = value;
					grm.colorSystem.customOverrides[this.apcaFocusedInput] = value;

					if (grCfg.settings.showDebugThemeLog) {
						console.log(`${Unicode.CheckMark} APCA Override Applied: ${this.apcaFocusedInput} = ${value}`);
					}

					grm.ui.initTheme();
					grm.colorManager.setPrimaryColor(this.apcaLastAppliedColor);
				}

				// Exit editing mode
				this.apcaFocusedInput = null;
				this.apcaInputBuffer = '';
			},

			[VKey.ESCAPE]: () => {
				this.apcaFocusedInput = null;
				this.apcaInputBuffer = '';
			},

			[VKey.BACK]: () => {
				this.apcaInputBuffer = this.apcaInputBuffer.slice(0, -1);
			}
		};

		const navigationKeyActions = {
			[VKey.LEFT]:  () => this.changeAPCACalibrationTone(-1),
			[VKey.RIGHT]: () => this.changeAPCACalibrationTone(1),
			[VKey.UP]:    () => this.changeAPCACalibrationContext(-1),
			[VKey.DOWN]:  () => this.changeAPCACalibrationContext(1),
			[VKey.KEY_C]: () => this.cycleAPCAColorMode(),
			[VKey.KEY_P]: () => this.printAPCACustomValues(),
			[VKey.KEY_R]: () => this.resetAPCACalibration()
		};

		const actions = this.apcaFocusedInput ? inputKeyActions : navigationKeyActions;
		const handler = actions[vkey];

		if (handler) {
			handler();
			window.Repaint();
			return true;
		}

		return !!this.apcaFocusedInput;
	}

	/**
	 * Resets the APCA calibration to its default state.
	 * Clears all custom value overrides and exits editing mode.
	 */
	resetAPCACalibration() {
		this.apcaColorModeIndex = 0;
		this.apcaCalibrationIndex = 10;
		this.apcaCalibrationContext = 'base';
		this.apcaCustomValues = {};
		this.apcaFocusedInput = null;
		this.apcaInputBuffer = '';

		grm.colorSystem.customOverrides = {};
		grm.ui.resetStyle('all');
		grm.colorManager.setPrimaryColor(this.apcaLastAppliedColor);

		if (grCfg.settings.showDebugThemeLog) {
			console.log(`${Unicode.CheckMark} APCA Calibration Reset - All overrides cleared`);
		}
	}

	/**
	 * Updates APCA control hover states based on current mouse position.
	 * Called from on_mouse_move to ensure hitboxes are fresh for clicks.
	 */
	updateAPCAControlsHover() {
		if (!grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.loadingThemeComplete) {
			return;
		}

		const fullH = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;
		const panelW = Math.floor(grm.ui.ww * 0.50);
		const outerPadding = SCALE(40);
		const contentY = SCALE(25);
		const lineH = SCALE(25);
		const innerPadding = SCALE(15);
		const headerH = lineH + innerPadding;
		const dataY = contentY + outerPadding;
		const dataX = outerPadding;
		const dataW = panelW - (outerPadding * 2);

		this.apcaControlsHover = this.getAPCACalibrationHitboxes(dataX, dataY, dataW, headerH);

		grm.ui.styledTooltipText = this.apcaControlsHover.headerText ?
			'Arrow left/right: Tone  |  Up/down: Context  |  C: Mode  |  P: Print  |  R: Reset  |  Click values to edit' : '';

		this.repaintDebugAPCAOverlay(0, grm.ui.topMenuHeight, panelW, fullH);
	}
	// #endregion
}


///////////////
// * DEBUG * //
///////////////
/**
 * A class responsible for all kind of debugging magic.
 */
class Debug {
	/**
	 * Creates the `Debug` instance.
	 */
	constructor() {
		// * COMMON * //
		// #region COMMON
		/** @public @type {Array} The array that stores the debug timing logs. */
		this.debugTimingsArray = [];
		/** @private @type {GdiFont} The font for debug metadata text. */
		this.fontDebugMeta = null;
		/** @private @type {GdiFont} The font for debug labels (P/S markers). */
		this.fontDebugLabel = null;
		/** @private @type {number} The cached height to detect window resizing for font scaling. */
		this.lastDebugH = 0;
		// #endregion

		// * DEVELOPER TOOLS * //
		// #region DEVELOPER TOOLS
		/** @public @type {boolean} The auto-download bio state, auto-downloading of artist biographies during shuffle playback with a 5-seconds timer. */
		this.autoDownloadBio = false;
		/** @public @type {boolean} The auto-download lyrics state, auto-downloading of lyrics during repeat playlist playback with a 15-seconds timer. */
		this.autoDownloadLyrics = false;
		/** @public @type {boolean} The flag that spams the console with draw times. */
		this.showDrawTiming = false;
		/** @public @type {boolean} The flag that spams the console with every section of the draw code to determine bottlenecks. */
		this.showDrawExtendedTiming = false;
		/** @public @type {boolean} The flag that spams the console with debug timing. */
		this.showDebugTiming = false;
		/** @public @type {boolean} The flag that draws all window.RepaintRect as red outlines in the theme. */
		this.drawRepaintRects = false;
		/** @public @type {boolean} The flag that spams the console with panel trace call. */
		this.showPanelTraceCall = false;
		/** @public @type {boolean} The flag that spams the console with panel trace on move. */
		this.showPanelTraceOnMove = false;
		/** @public @type {boolean} The flag that spams the console with playlist list performance. */
		this.showPlaylistTraceListPerf = false;
		/** @public @type {boolean} The trace call state (DO NOT CHANGE), can be activated via Options > Developer tools. */
		this.traceCall = false;
		/** @public @type {boolean} The trace on move state (DO NOT CHANGE), can be activated via Options > Developer tools. */
		this.traceOnMove = false;
		/** @public @type {boolean} The trace list performance state (DO NOT CHANGE), can be activated via Options > Developer tools. */
		this.traceListPerformance = false;
		// #endregion

		// * REPAINT * //
		// #region REPAINT
		/** @public @type {Array} The array used in drawDebugRectAreas(). */
		this.repaintRects = [];
		/** @public @type {number} The count used in RepaintRectAreas(). */
		this.repaintRectCount = 0;
		/** @public @type {Function} The functions that throttles and limits repaint requests for the debug system overlay to 1 sec. */
		this.repaintDebugSystemOverlay = Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), FPS._1);
		/** @public @type {Function} The function that throttles and limits repaint requests for the debug system overlay seekbar area to 1 sec. */
		this.repaintDebugSystemOverlaySeekbar = Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), FPS._1);
		// #endregion
	}

	// * PUBLIC METHODS - DRAW * //
	// #region PUBLIC METHODS - DRAW
	/**
	 * Draws the debug performance overlay in the album art area when `Enable debug performance overlay` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugPerformanceOverlay(gr) {
		if (!grCfg.settings.showDebugPerformanceOverlay || !grm.ui.loadingThemeComplete) return;

		if (grm.cpuTrack.cpuTrackerTimer === null) {
			grm.cpuTrack.start();
		}

		const debugTimingsSorted = this.debugTimingsArray.slice().sort((a, b) => a.localeCompare(b));
		const fullW = grSet.layout === 'default' && grSet.lyricsLayout !== 'normal' && grm.ui.displayLyrics && grm.ui.noAlbumArtStub || grSet.layout === 'artwork';
		const titleWidth = grm.ui.albumArtSize.w - SCALE(80);
		const titleHeight = gr.CalcTextHeight(' ', grFont.popup);
		const titleMaxWidthRepaint = gr.CalcTextWidth('Ram usage for current panel: 6291456 MB', grFont.popup);
		const lineSpacing = titleHeight * 1.5;
		const logColor = RGB(255, 255, 255);
		const x = grm.ui.albumArtSize.x + grm.ui.edgeMargin;
		let y = grm.ui.albumArtSize.y + lineSpacing;
		let seekbarLogY = 0;

		const seekbarLog = () => {
			const seekbarTiming = `${grm.ui.seekbarTimerInterval} ms / ${(1000 / grm.ui.seekbarTimerInterval).toFixed(2)} Hz`;
			const existingIndex = this.debugTimingsArray.findIndex(value => value.includes('Seekar'));
			this.debugTimingsArray[existingIndex] = seekbarTiming;
			return seekbarTiming;
		};

		const performanceLog = [
			{ title: 'System: ', log: '' },
			{ title: 'CPU usage: ', log: `${grm.cpuTrack.getCpuUsage()}%` },
			{ title: 'GUI usage: ', log: `${grm.cpuTrack.getGuiCpuUsage()}%` },
			{ title: 'Ram usage for current panel: ', log: FormatSize(window.JsMemoryStats.MemoryUsage) },
			{ title: 'Ram usage for all panels: ', log: FormatSize(window.JsMemoryStats.TotalMemoryUsage) },
			{ title: 'Ram usage limit: ', log: FormatSize(window.JsMemoryStats.TotalMemoryLimit) },
			{ title: 'Separator', log: '' },
			{ title: 'Timings: ', log: '' },
			{ title: 'Seekbar: ', log: seekbarLog() },
			{ title: '', log: debugTimingsSorted.join('\n') }
		];

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(fullW ? 0 : grm.ui.albumArtSize.x, fullW ? grm.ui.topMenuHeight : grm.ui.albumArtSize.y, fullW ? grm.ui.ww : grm.ui.albumArtSize.w, fullW ? grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight : grm.ui.albumArtSize.h, RGBA(0, 0, 0, 180));
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const drawString = (title, log) => {
			const lines = log.split('\n');
			lines.forEach((line, index) => {
				const fullString = title.length > 0 ? `${title} ${line}` : line;
				gr.DrawString(fullString, grFont.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
				y += lineSpacing;
			});
		};

		for (const { title, log } of performanceLog) {
			if (title !== 'Separator') {
				drawString(title, log);
				if (title === 'Seekbar: ') {
					seekbarLogY = y - lineSpacing;
				}
			} else {
				y += lineSpacing;
			}
		}

		this.repaintDebugSystemOverlay(x, grm.ui.albumArtSize.y + lineSpacing * 2, titleMaxWidthRepaint, lineSpacing * 4);
		this.repaintDebugSystemOverlaySeekbar(x, seekbarLogY, titleMaxWidthRepaint, lineSpacing);
	}

	/**
	 * Draws the draw timing in the console when `Show draw timing` or `Show draw extended timing` in Developer tools is active.
	 * @param {Date} drawTimingStart - The start time of the operation.
	 */
	drawDebugTiming(drawTimingStart) {
		if (!drawTimingStart) return;

		const drawTimingEnd = new Date();
		const duration = drawTimingEnd - drawTimingStart;
		const hours = String(drawTimingStart.getHours()).padStart(2, '0');
		const minutes = String(drawTimingStart.getMinutes()).padStart(2, '0');
		const seconds = String(drawTimingStart.getSeconds()).padStart(2, '0');
		const milliseconds = String(drawTimingStart.getMilliseconds()).padStart(3, '0');
		const time = `${hours}:${minutes}:${seconds}.${milliseconds}`;
		const repaintRectCalls = this.repaintRectCount > 1 ? ` - ${this.repaintRectCount} repaintRect calls` : '';

		if (this.showDrawExtendedTiming && fb.IsPlaying) {
			console.log(`Spider Monkey Panel v${utils.Version}: profiler (on_paint -> seekbar): ${grm.ui.seekbarProfiler.Time} ms => refresh rate: ${grm.ui.seekbarTimerInterval} ms`);
		}

		console.log(`${time}: on_paint total: ${duration}ms${repaintRectCalls}`);
	}

	/**
	 * Draws red rectangles for debugging to show all painted areas in all panels when `Show draw areas` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugRectAreas(gr) {
		if (!this.repaintRects.length) return;
		this.repaintRectCount = 0;

		try {
			for (const rect of this.repaintRects) {
				gr.DrawRect(rect.x, rect.y, rect.w, rect.h, SCALE(2), RGBA(255, 0, 0, 200));
			}
			this.repaintRects = [];
		} catch (e) {}
	}

	/**
	 * Draws the glyph alignment overloay to render all glyphs (symbols) side-by-side at a fixed baseline y-position (y=0 relative to the canvas).
	 * @param {GdiGraphics} gr - The graphics context to draw on.
	 * @param {number} [startX] - The optional starting x-position for the first glyph.
	 * @param {number} [spacing] - The optional horizontal spacing between glyphs.
	 * @param {number} [canvasHeight] - The optional height of the mockup canvas.
	 * @param {boolean} [showPerGlyphCenters] - The optional flag if that draws thin vertical lines at each glyph's horizontal center for per-icon alignment checks.
	 * @param {SmoothingMode} [SmoothRender] - The optional Smoothing mode for rendering.
	 * @param {TextRenderingHint} [TextRender] - The optional text rendering hint.
	 */
	drawGlyphAlignmentOverlay(gr, startX = 25, spacing = 25, canvasHeight = 50, showPerGlyphCenters = true, SmoothRender = SmoothingMode.AntiAlias, TextRender = TextRenderingHint.ClearTypeGridFit) {
		if (!grm.button.btnMap || IsEmpty(grm.button.btnMap)) {
			grm.button.btnMap = grm.button._createButtonMap();
		}

		const glyphsToTest = [
			{ key: 'Stop', ico: grm.button.btnMap.Stop.ico },
			{ key: 'Previous', ico: grm.button.btnMap.Previous.ico },
			{ key: 'Play', ico: grm.button.btnMap.Play.ico },
			{ key: 'Pause', ico: grm.button.btnMap.Pause.ico },
			{ key: 'Next', ico: grm.button.btnMap.Next.ico },
			{ key: 'PlaybackDefault', ico: grm.button.btnMap.PlaybackDefault.ico },
			{ key: 'PlaybackRepeatPlaylist', ico: grm.button.btnMap.PlaybackRepeatPlaylist.ico },
			{ key: 'PlaybackRepeatTrack', ico: grm.button.btnMap.PlaybackRepeatTrack.ico },
			{ key: 'PlaybackShuffle', ico: grm.button.btnMap.PlaybackShuffle.ico },
			{ key: 'ShowVolume', ico: grm.button.btnMap.ShowVolume.ico },
			{ key: 'Reload', ico: grm.button.btnMap.Reload.ico },
			{ key: 'AddTracks', ico: grm.button.btnMap.AddTracks.ico }
		];

		const font = grFont.lowerBarBtn;
		const color = grCol.transportIconNormal;
		const baselineY = 0;
		let currentX = startX;
		let totalWidth = 0;

		// Pre-compute box widths and totalWidth for precise centering
		const boxWidths = glyphsToTest.map(({ ico }) => {
			const measurements = gr.MeasureString(ico, font, 0, 0, Infinity, canvasHeight);
			const glyphW = Math.ceil(measurements.Width);
			return Math.max(glyphW + 4, 30);
		});

		totalWidth = boxWidths.reduce((sum, bw) => sum + bw, 0) + spacing * (glyphsToTest.length - 1);
		gr.SetSmoothingMode(SmoothRender);
		gr.SetTextRenderingHint(TextRender);
		gr.FillSolidRect(0, 0, grm.ui.ww, grm.ui.wh, RGB(0, 0, 0));

		glyphsToTest.forEach(({ key, ico }, index) => {
			const outerBoxW = boxWidths[index];
			const glyphMeasurements = gr.MeasureString(ico, font, 0, 0, Infinity, canvasHeight);
			const glyphW = Math.ceil(glyphMeasurements.Width);
			const glyphH = Math.ceil(glyphMeasurements.Height);

			// Draw a horizontal baseline line for reference (green, at vertical center of outer box)
			const hCenter = canvasHeight / 2;

			gr.DrawLine(currentX, baselineY + hCenter, currentX + outerBoxW, baselineY + hCenter, 1, RGBA(0, 255, 0, 180));
			if (showPerGlyphCenters) {
				const vCenterX = currentX + outerBoxW / 2;
				gr.DrawLine(vCenterX, baselineY, vCenterX, baselineY + canvasHeight, 1, RGBA(0, 255, 0, 100));
			}

			// Draw the glyph centered in the outer box
			const drawX = currentX + 2;
			const drawW = outerBoxW - 4;
			gr.DrawString(ico, font, color, drawX, baselineY, drawW, canvasHeight, StringFormat(1, 1));

			// Draw the new tight bounding box (wireframe, yellow) for exact glyph ink extents
			const innerBoxX = drawX + (drawW - glyphW) / 2;
			const innerBoxY = baselineY + (canvasHeight - glyphH) / 2;
			gr.DrawRect(innerBoxX, innerBoxY, glyphW, glyphH, 1, RGB(255, 0, 0));

			// Draw label below for identification
			gr.DrawString(key, gdi.Font('Segoe UI', 10, 0), color, currentX, baselineY + canvasHeight + 2, outerBoxW, 20, StringFormat(0, 0));
			currentX += outerBoxW + spacing;
		});
	}
	// #endregion

	// * PUBLIC METHODS - PERFORMANCE * //
	// #region PUBLIC METHODS - PERFORMANCE
	/**
	 * Calculates and logs the average execution time of given functions (code blocks) over a specified number of iterations.
	 * Optionally compares the performance of two code blocks with their respective arguments.
	 * @param {number} iterations - The number of times the code blocks should be executed.
	 * @param {Function} func1 - The first function whose performance is to be measured.
	 * @param {Array} [args1] - The optional arguments for the first function as an array.
	 * @param {Function} [func2] - The optional second function to measure and compare performance against the first.
	 * @param {Array} [args2] - The optional arguments for the second function as an array.
	 * @example
	 * // Usage without arguments:
	 * CalcExecutionTime(1000, function1, [], function2, []);
	 * @example
	 * // Usage with arguments:
	 * CalcExecutionTime(1000, function1, ['arg1', 'arg2'], function2, ['arg1', 'arg2']);
	 * @example
	 * // Usage with methods, use .bind(this):
	 * CalcExecutionTime(1000, this.method1.bind(this), [], this.method2.bind(this), []);
	 */
	calcExecutionTime(iterations, func1, args1 = [], func2, args2 = []) {
		// Measure and log function1 performance
		const start1 = Date.now();
		for (let i = 0; i < iterations; i++) {
			func1.apply(this, args1);
		}
		const end1 = Date.now();
		const totalTime1 = end1 - start1;
		console.log(`Function 1 took: ${(totalTime1 / iterations).toFixed(3)} ms`);

		if (!func2) return;

		// Measure and log function2 performance
		const start2 = Date.now();
		for (let i = 0; i < iterations; i++) {
			func2.apply(this, args2);
		}
		const end2 = Date.now();
		const totalTime2 = end2 - start2;
		console.log(`Function 2 took: ${(totalTime2 / iterations).toFixed(3)} ms`);

		// Measure, log and compare both function1 and function2 performances
		const diff = totalTime1 - totalTime2;
		const percent = (Math.abs(diff) / ((totalTime1 + totalTime2) / 2)) * 100;
		const faster = diff > 0 ? 'FUNCTION 2 IS FASTER' : 'FUNCTION 1 IS FASTER';
		console.log(`${faster} BY: ${Math.abs(diff / iterations).toFixed(3)} ms - ${percent.toFixed(2)}%`);
	}

	/**
	 * Calculates and logs one or two given functions over a specified duration and compares their performance if both are provided.
	 * @param {number} duration - The duration (in milliseconds) for which the functions should be executed.
	 * @param {Function} func1 - The first function to be measured.
	 * @param {Array} [args1] - The optional arguments for the first function as an array.
	 * @param {Function} [func2] - The optional second function to be measured.
	 * @param {Array} [args2] - The optional arguments for the second function as an array.
	 * @example
	 * // Usage without arguments:
	 * CalcExecutionDuration(5000, function1, [], function2, []);
	 * @example
	 * // Usage with arguments:
	 * CalcExecutionDuration(5000, function1, ['arg1', 'arg2'], function2, ['arg1', 'arg2']);
	 * @example
	 * // Usage with methods, use .bind(this):
	 * CalcExecutionDuration(5000, this.method1.bind(this), [], this.method2.bind(this), []);
	 */
	calcExecutionDuration(duration, func1, args1, func2, args2) {
		const profiler1 = fb.CreateProfiler('Performance Profiler 1');
		const profiler2 = func2 ? fb.CreateProfiler('Performance Profiler 2') : null;

		const measureFunc = (func, args, profiler) => {
			console.log(`Starting performance measurement for ${func.name}...`);
			const startTime = Date.now();
			const endTime = startTime + duration;
			let count = 0;

			// Execute the function until the duration elapses
			while (Date.now() < endTime) {
				func(...args);
				count++;
			}

			profiler.Print();
			console.log(`Performance measurement for ${func.name} completed.`);
			return { totalTime: Date.now() - startTime, count };
		};

		// Measure and log function1 performance
		const result1 = measureFunc(func1, args1, profiler1);
		const avgTime1 = result1.totalTime / result1.count;
		console.log(`Function 1 (${func1.name}) took an average of ${avgTime1.toFixed(3)} ms per execution`);

		if (!func2) return;

		// Measure and log function2 performance
		const result2 = measureFunc(func2, args2, profiler2);
		const avgTime2 = result2.totalTime / result2.count;
		console.log(`Function 2 (${func2.name}) took an average of ${avgTime2.toFixed(3)} ms per execution`);

		// Measure, log and compare both function1 and function2 performances
		const diff = avgTime1 - avgTime2;
		const percent = (Math.abs(diff) / ((avgTime1 + avgTime2) / 2)) * 100;
		const faster = diff > 0 ? 'FUNCTION 2 IS FASTER' : 'FUNCTION 1 IS FASTER';
		console.log(`${faster} BY: ${Math.abs(diff).toFixed(3)} ms - ${percent.toFixed(2)}%`);
	}

	/**
	 * Calculates and logs the performance of given functions either by iterations or duration.
	 * @param {string} mode - The mode of performance measurement ('time' for iterations or 'duration' for time-based).
	 * @param {number} metric - The number of iterations or the duration in milliseconds.
	 * @param {Function} func1 - The first function whose performance is to be measured.
	 * @param {Array} [args1] - The optional arguments for the first function as an array.
	 * @param {Function} [func2] - The optional second function to measure and compare performance against the first.
	 * @param {Array} [args2] - The optional arguments for the second function as an array.
	 * @example
	 * // Measure performance by iterations:
	 * CalcPerformance('time', 1000, function1, [], function2, []);
	 * @example
	 * // Measure performance by duration:
	 * CalcPerformance('duration', 5000, function1, ['arg'], function2, ['arg']);
	 * @example
	 * // Measure performance by iterations with arguments:
	 * CalcPerformance('time', 1000, function1, ['arg1', 'arg2'], function2, ['arg1', 'arg2']);
	 * @example
	 * // Measure performance by duration with methods, use .bind(this):
	 * CalcPerformance('duration', 5000, this.method1.bind(this), [], this.method2.bind(this), []);
	 */
	calcPerformance(mode, metric, func1, args1 = [], func2, args2 = []) {
		if (mode === 'time') {
			CalcExecutionTime(metric, func1, args1, func2, args2);
		}
		else if (mode === 'duration') {
			CalcExecutionDuration(metric, func1, args1, func2, args2);
		}
		else {
			console.log('Invalid mode. Use "time" for iteration-based or "duration" for time-based performance measurement.');
		}
	}
	// #endregion

	// * PUBLIC METHODS - LOGGING * //
	// #region PUBLIC METHODS - LOGGING
	/**
	 * Prints logs for specific callback actions.
	 * Will be shown in the console when `Show panel calls` in Developer tools is active.
	 * @param {string} msg - The callback action message to log.
	 */
	callLog(msg) {
		if (!this.traceCall) return;
		console.log(msg);
	}

	/**
	 * Prints exclusive theme debug logs and avoids cluttering the console constantly.
	 * Will be shown in the console when `Enable debug log` in Developer tools is active.
	 * @param {...any} args - The debug messages to log.
	 */
	debugLog(...args) {
		if (args.length === 0 || !grCfg.settings.showDebugLog) return;
		console.log(...args);
	}

	/**
	 * Prints logs for specific callback on_mouse_move actions.
	 * Will be shown in the console when `Show panel moves` in Developer tools is active.
	 * @param {string} msg - The callback mouse move message to log.
	 */
	moveLog(msg) {
		if (!this.traceCall || !this.traceOnMove) return;
		console.log(msg);
	}

	/**
	 * Logs a detailed tabular breakdown of album art color analysis to the console.
	 * @param {Array<Object>} processed - The array of processed color objects.
	 * @param {number} minFreq - The minimum frequency threshold for valid colors.
	 */
	logAlbumArtColors(processed, minFreq) {
		console.log('Rank\tFreq %\tWeight\tRGB             \tLum\tSat\tStatus');
		console.log('------\t--------\t--------\t---------------\t-------\t-------\t-------');

		const forLog = processed.slice().sort((a, b) => b.weight - a.weight);

		for (let i = 0; i < forLog.length; i++) {
			const c = forLog[i];

			const rank = String(i + 1).padStart(3);
			const freq = `${(c.freq * 100).toFixed(2).padStart(7)}%`;
			const weight = c.weight.toFixed(2).padStart(6);

			const R = GetRed(c.col.val).toString().padStart(3);
			const G = GetGreen(c.col.val).toString().padStart(3);
			const B = GetBlue(c.col.val).toString().padStart(3);
			const rgb = `${R}, ${G}, ${B} `;

			const lum = c.col.luminance.toFixed(3);
			const sat = String(c.col.saturation).padStart(3);

			const status =
				  c.isValidPrimary ? 'Valid'
				: c.col.isCloseToGrayscale ? 'Gray'
				: c.freq < minFreq ? 'Freq'
				: c.isInLumRange ? 'Invalid'
				: c.col.luminance < 0.01 ? 'Lum-D' : 'Lum-L';

			console.log(`${rank}\t${freq}\t${weight}\t${rgb}\t${lum}\t${sat}\t${status}`);
		}
	}

	/**
	 * Prints a color object to the console.
	 * This is primarily for debugging and for the benefit of other tools that rely on color objects.
	 * @param {object} obj - The object to print.
	 */
	printColorObj(obj) {
		console.log('\tname: \'\',\n\tcolors: {');

		for (const propName in obj) {
			const propValue = obj[propName];

			console.log(`\t\t${propName}: ${ColToRgb(propValue, true)},\t\t// #${ToPaddedHexString(0xffffff & propValue, 6)}`);
		}

		console.log(`\t},\n\thint: [${ColToRgb(obj.primary, true)}]`);
	}

	/**
	 * Handles the profiler setup and printing based on the given condition and action.
	 * @param {boolean} condition - The condition to check before proceeding with the profiler operation.
	 * @param {string} action - The action to perform ('create' or 'print').
	 * @param {string} message - The log message to use when creating the profiler (required for 'create' action).
	 */
	setDebugProfile(condition, action, message) {
		// Initialize properties on first call
		if (typeof this.setDebugProfile.profiler === 'undefined') {
			this.setDebugProfile.profiler = {};
			this.setDebugProfile.profilerActive = false;
		}

		if (condition && action === 'create') {
			this.setDebugProfile.profiler[message] = fb.CreateProfiler(message);
			this.setDebugProfile.profilerActive = condition;
		}
		else if (this.setDebugProfile.profiler[message] && this.setDebugProfile.profilerActive && action === 'print') {
			this.setDebugProfile.profiler[message].Print();
			if (grCfg.settings.showDebugPerformanceOverlay) {
				this.debugTimingsArray.push(`${message}: ${this.setDebugProfile.profiler[message].Time} ms`);
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS - REPAINT * //
	// #region PUBLIC METHODS - REPAINT
	/**
	 * Displays red rectangles to show all repaint areas when activating "Draw areas" in dev tools, used for debugging.
	 */
	repaintRectAreas() {
		const originalRepaintRect = window.RepaintRect.bind(window);

		window.RepaintRect = (x, y, w, h, force = undefined) => {
			if (this.drawRepaintRects) {
				this.repaintRects.push({ x, y, w, h });
				this.repaintRectCount++;
				window.Repaint();
				return;
			}
			this.repaintRectCount = 0;
			originalRepaintRect(x, y, w, h, force);
		};
	}

	/**
	 * Prints logs for window.Repaint() in the console, used for debugging.
	 */
	repaintWindow() {
		this.debugLog('Paint => Repainting from repaintWindow()');
		window.Repaint();
	}
	// #endregion
}
