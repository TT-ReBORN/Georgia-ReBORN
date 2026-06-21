/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Color Manager                            * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    21-06-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * COLOR MANAGER * //
///////////////////////
/**
 * A class that provides theme base colors and specific methods responsible for handling color operations.
 * Allows for creation, manipulation, adjustment, and application of colors to the theme.
 */
class ColorManager {
	/**
	 * Creates the `ColorManager` instance and initializes theme preferences.
	 */
	constructor() {
		/** @type {Map<number, Color>} The cache for Color objects to minimize memory allocation. */
		this.colorCache = new Map();
		/** @type {number} The maximum number of color objects to keep in memory at once. */
		this.colorCacheMaxSize = 100;

		/**
		 * The configuration constants for `_calculateColorWeight`.
		 * The object controls frequency, luminance, saturation scoring and vibrancy/penalty multipliers.
		 * The configuration defines the scoring algorithm parameters for ranking dominant colors in image analysis.
		 * @typedef {Object} colorWeightsConfig
		 *
		 * @property {number} LUM_TARGET - The ideal UI luminance (0.25) - scoring biases toward this value for optimal readability.
		 * @property {number} FREQ_HIGH - The threshold when one color covers 70%+ of image - heavily diminish its score to prevent bland backgrounds dominating.
		 * @property {number} FREQ_MED - The threshold when one color covers 45-70% - moderately diminish to allow accent colors to compete.
		 * @property {number} FREQ_LOW - The threshold when one color covers 30-45% - slight diminishing, still favors common colors.
		 * @property {number} LUM_TIGHT_BAND - The range within 0.12 of target luminance - near-ideal range, minimal score penalty.
		 * @property {number} LUM_WIDE_BAND - The range within 0.25 of target luminance - acceptable range, moderate score reduction.
		 * @property {number} LUM_FAR_DECAY - The denominator controlling how fast score decays beyond the wide band.
		 * @property {number} SAT_HIGH - The threshold at 70%+ saturation - vivid "pop" color, gets a strong score multiplier bonus.
		 * @property {number} SAT_MED - The range at 50-70% saturation - clearly colorful but not electric, moderate bonus.
		 * @property {number} SAT_LOW - The range at 35-50% saturation - muted but still readable as a color, small bonus.
		 * @property {number} SAT_FLOOR - The range at 20-35% saturation - borderline gray, minimal bonus before near-grayscale penalty.
		 * @property {number} SAT_MAX - The saturation scale ceiling (100) - used to normalize the sub-floor linear falloff.
		 * @property {number} VIBRANCY_SAT_HIGH - The threshold at 50%+ saturation qualifying for the high vibrancy bonus.
		 * @property {number} VIBRANCY_SAT_MED - The range at 40-50% saturation qualifying for the medium vibrancy bonus.
		 * @property {number} VIBRANCY_LUM_MIN - The lower luminance bound for vibrancy bonus (0.15) - excludes near-black colors that appear dull regardless of saturation.
		 * @property {number} VIBRANCY_LUM_MIN2 - The slightly relaxed lower luminance bound for medium vibrancy bonus (0.10).
		 * @property {number} VIBRANCY_LUM_MAX - The upper luminance bound for high vibrancy bonus (0.60) - excludes pastel/washed colors above this.
		 * @property {number} VIBRANCY_LUM_MAX2 - The slightly relaxed upper bound for medium vibrancy bonus (0.65) - allows softer colors to still qualify.
		 * @property {number} PENALTY_DARK_CUTOFF - The luminance threshold below 0.03 - near-black, score halved to prevent invisible/unusable theme colors.
		 * @property {number} PENALTY_LIGHT_CUTOFF - The luminance threshold above 0.70 - near-white or washed out, score cut to 30% to avoid bleached themes.
		 *
		 * @property {number} FREQ_LOG_INPUT_SCALE - The input scale for frequency log curve (100) - separates freq scoring from sat scoring.
		 * @property {number} FREQ_LOG_SCALE_HIGH - The log curve weight for very dominant colors (0.25) - heavily suppresses background takeover.
		 * @property {number} FREQ_LOG_SCALE_MED - The log curve weight for moderately dominant colors (0.50) - mild suppression.
		 * @property {number} FREQ_LOG_SCALE_LOW - The log curve weight for slightly dominant colors (0.70) - minimal suppression.
		 * @property {number} FREQ_LINEAR_BOOST - The quadratic self-boost for rare colors (0.50) - rewards genuine accent colors.
		 * @property {number} LUM_SCORE_PEAK - The maximum luminance score (1.00) - awarded at exactly the target luminance.
		 * @property {number} LUM_SCORE_TIGHT_DROP - The amount score drops crossing the tight band (0.15) - keeps near-ideal colors close to peak.
		 * @property {number} LUM_SCORE_MID - The luminance score at the tight band boundary (0.85) - start of moderate penalty zone.
		 * @property {number} LUM_SCORE_MID_DROP - The amount score drops crossing the wide band (0.45) - penalizes colors drifting from ideal.
		 * @property {number} LUM_SCORE_FAR - The luminance score at the wide band boundary (0.40) - start of steep decay zone.
		 * @property {number} LUM_SCORE_FAR_DROP - The total score reduction applied across the far decay zone (0.35).
		 * @property {number} LUM_SCORE_MIN - The floor value (0.05) - ensures even extreme luminance colors retain a trace of score.
		 * @property {number} SAT_SCORE_HIGH_BASE - The base score for colors above SAT_HIGH (1.20) - vivid colors start above neutral.
		 * @property {number} SAT_SCORE_HIGH_SCALE - The divisor for above-SAT_HIGH bonus (100) - each saturation point above 70 adds 0.01.
		 * @property {number} SAT_SCORE_MED_BASE - The base score for colors in the SAT_MED range (0.90).
		 * @property {number} SAT_SCORE_MED_SCALE - The divisor for SAT_MED range (66.67) - maps 50-70 sat linearly onto 0.90-1.20.
		 * @property {number} SAT_SCORE_LOW_BASE - The base score for colors in the SAT_LOW range (0.50).
		 * @property {number} SAT_SCORE_LOW_SCALE - The divisor for SAT_LOW range (50) - maps 35-50 sat linearly onto 0.50-0.80.
		 * @property {number} SAT_SCORE_FLOOR_BASE - The base score for colors in the SAT_FLOOR range (0.20).
		 * @property {number} SAT_SCORE_FLOOR_SCALE - The divisor for SAT_FLOOR range (50) - maps 20-35 sat linearly onto 0.20-0.50.
		 * @property {number} VIBRANCY_BONUS_HIGH - The score multiplier for colors in the high vibrancy sweet spot (1.30).
		 * @property {number} VIBRANCY_BONUS_MED - The score multiplier for colors in the medium vibrancy sweet spot (1.15).
		 * @property {number} VIBRANCY_BONUS_NONE - The neutral multiplier (1.00) - no vibrancy bonus applied.
		 * @property {number} PENALTY_DARK_FACTOR - The near-black penalty multiplier (0.50) - halves the score.
		 * @property {number} PENALTY_LIGHT_FACTOR - The near-white penalty multiplier (0.30) - cuts score to 30%.
		 * @property {number} PENALTY_NONE - The neutral multiplier (1.00) - no penalty applied.
		 * @property {number} WEIGHT_OUTPUT_SCALE - The final output scale (10) - lifts scores into a human-readable range for debug logging.
		 */
		/** @public @type {colorWeightsConfig} */
		this.colorWeightsConfig = {
			// * INPUT THRESHOLDS
			LUM_TARGET:            0.25,
			FREQ_HIGH:             0.70,
			FREQ_MED:              0.45,
			FREQ_LOW:              0.30,
			LUM_TIGHT_BAND:        0.12,
			LUM_WIDE_BAND:         0.25,
			LUM_FAR_DECAY:         0.50,
			SAT_HIGH:                70,
			SAT_MED:                 50,
			SAT_LOW:                 35,
			SAT_FLOOR:               20,
			SAT_MAX:                100,
			VIBRANCY_SAT_HIGH:       50,
			VIBRANCY_SAT_MED:        40,
			VIBRANCY_LUM_MIN:      0.15,
			VIBRANCY_LUM_MIN2:     0.10,
			VIBRANCY_LUM_MAX:      0.60,
			VIBRANCY_LUM_MAX2:     0.65,
			PENALTY_DARK_CUTOFF:   0.03,
			PENALTY_LIGHT_CUTOFF:  0.70,

			// * OUTPUT MULTIPLIERS
			FREQ_LOG_INPUT_SCALE:   100,
			FREQ_LOG_SCALE_HIGH:   0.25,
			FREQ_LOG_SCALE_MED:    0.50,
			FREQ_LOG_SCALE_LOW:    0.70,
			FREQ_LINEAR_BOOST:     0.50,
			LUM_SCORE_PEAK:        1.00,
			LUM_SCORE_TIGHT_DROP:  0.15,
			LUM_SCORE_MID:         0.85,
			LUM_SCORE_MID_DROP:    0.45,
			LUM_SCORE_FAR:         0.40,
			LUM_SCORE_FAR_DROP:    0.35,
			LUM_SCORE_MIN:         0.05,
			SAT_SCORE_HIGH_BASE:   1.20,
			SAT_SCORE_HIGH_SCALE:   100,
			SAT_SCORE_MED_BASE:    0.90,
			SAT_SCORE_MED_SCALE:  66.67,
			SAT_SCORE_LOW_BASE:    0.50,
			SAT_SCORE_LOW_SCALE:     50,
			SAT_SCORE_FLOOR_BASE:  0.20,
			SAT_SCORE_FLOOR_SCALE:   50,
			VIBRANCY_BONUS_HIGH:   1.30,
			VIBRANCY_BONUS_MED:    1.15,
			VIBRANCY_BONUS_NONE:   1.00,
			PENALTY_DARK_FACTOR:   0.50,
			PENALTY_LIGHT_FACTOR:  0.30,
			PENALTY_NONE:          1.00,
			WEIGHT_OUTPUT_SCALE:     10
		};

		/**
		 * The configuration constants for `getAdaptiveMinFrequency`.
		 * The object controls how minimum frequency thresholds adapt to color dominance in the image.
		 * The configuration enables dynamic threshold adjustment based on color distribution analysis.
		 * @typedef {Object} minFreqConfig
		 * @property {number} DOMINANT_THRESHOLD - The threshold when one color covers 70%+ of image - lower threshold significantly to find accent colors.
		 * @property {number} MODERATE_THRESHOLD - The threshold when one color covers 40-70% - lower threshold moderately.
		 * @property {number} FREQ_MIN_DOMINANT - The minimum frequency when one color dominates (0.005).
		 * @property {number} FREQ_MIN_MODERATE - The minimum frequency when distribution is somewhat dominant (0.008).
		 * @property {number} FREQ_MIN_BALANCED - The minimum frequency for a balanced color distribution (0.015).
		 */
		/** @public @type {minFreqConfig} */
		this.minFreqConfig = {
			DOMINANT_THRESHOLD:  0.70,
			MODERATE_THRESHOLD:  0.40,
			FREQ_MIN_DOMINANT:  0.005,
			FREQ_MIN_MODERATE:  0.008,
			FREQ_MIN_BALANCED:  0.015
		};

		/**
		 * The configuration constants for `applyColorSaturationAuto`.
		 * Centralizes all tuning knobs for the perceptual loudness / eye-strain protection algorithm.
		 * @typedef {Object} satAutoConfig
		 * @property {number} CHROMA_BASE - The pleasant chroma baseline (0.12). Colors below this read as soft/muted and are never touched.
		 * @property {number} CHROMA_RANGE - The normalization band above baseline (0.18), spanning the 0.12-0.30 chroma zone.
		 * @property {number} THRESHOLD - The loudness score at which correction begins (0.38). Slightly lower than original 0.40 - the
		 *   two-peak hue fix raises red loudness so much that this is safe without touching warm muted colors.
		 * @property {number} FULL_CORRECT_AT - The loudness score at which 100% correction is applied (1.00).
		 * @property {number} MAX_CUT - The maximum chroma fraction removable (0.55 = 55%). Slightly above original 0.50 for more decisive treatment of extreme neons.
		 * @property {number} MAX_ABSOLUTE_CUT - The hard ceiling on the effective MAX_CUT after night multiplier (0.75). Prevents the night boost from ever washing a color to near-gray.
		 *
		 * TWO-PEAK HUE LOUDNESS MODEL
		 * The original single photopic curve (one peak at H=128°) rated red (H≈25°) at only ~0.55 - barely enough to cross the
		 * threshold at typical album-art chroma. Red is perceptually loud for different reasons (warning-color salience,
		 * chromostereopsis, advancing hue) that the photopic curve cannot express. The dual-peak model fixes this:
		 * two peaks (green H=128°, red H=25°), one trough at cyan-blue (H=255°), each peak's arc normalized by its own reach
		 * to the trough so both hit exactly 1.0. Blue remains at ~0.26 - genuinely less straining, correctly uncorrected.
		 *
		 * @property {number} HUE_PEAK_GREEN - The OKLCH hue of the photopic loudness peak (128°).
		 * @property {number} HUE_PEAK_RED - The OKLCH hue of the red loudness peak (25°).
		 * @property {number} HUE_TROUGH - The OKLCH hue of the perceptual minimum (255°, cyan-blue).
		 * @property {number} HUE_LOUDNESS_FLOOR - The minimum hue weight at the trough (0.25).
		 *
		 * NIGHT-TIME AGGRESSION (wall-clock, independent of the eye-protection schedule)
		 * At night, ambient light drops and pupils dilate. The same chroma that reads as "pleasant" at noon is genuinely
		 * fatiguing at midnight. The algorithm automatically becomes more aggressive inside the configurable night window
		 * by lowering THRESHOLD, lowering FULL_CORRECT_AT, and raising MAX_CUT.
		 * This is derived entirely from the wall clock in getNighttimeFactor() - independent of albumArtColorSaturationEyeSchedule:
		 * - Schedule '0-24' (always on), or unset: algorithm runs 24/7; night boost still activates 20:00-07:00.
		 * - Schedule '20-8': both schedule gate AND night boost apply; no double-counting problem.
		 * Transitions use cubic smoothstep over TRANSITION_HOURS to prevent any visible color pop at dawn or dusk.
		 *
		 * @property {number} NIGHT_FLOOR_CHROMA_RATIO - The multiplier used to calculate the absolute chroma floor at night (0.50).
		 * The night boost never reduces chroma below (CHROMA_BASE × this value), preventing extreme desaturation.
		 * @property {number} NIGHT_THRESHOLD_MULTIPLIER - The THRESHOLD × this at deep night (0.78).
		 * The effective threshold at peak night = 0.38 × 0.78 ≈ 0.297: catches noticeably more colors.
		 * @property {number} NIGHT_MAXCUT_MULTIPLIER - The MAX_CUT × this at deep night (1.20).
		 * Applied as an independent Lerp step: a fully-corrected color at peak night is blended from blendedC toward C*(1−effectiveMaxCut).
		 * The effective night value = min(MAX_ABSOLUTE_CUT, 0.55×1.20) = 0.66.
		 * @property {number} NIGHT_FULLCORRECT_MULTIPLIER - The FULL_CORRECT_AT × this at deep night (0.88).
		 * The effective FULL_CORRECT_AT = 1.00 × 0.88 = 0.88: reaches 100% correction sooner.
		 * @property {number} NIGHT_START_HOUR - The hour when the night window opens (20 = 8 PM, inclusive).
		 * @property {number} NIGHT_END_HOUR - The hour when the night window closes (7 = 7 AM, exclusive).
		 * The window wraps midnight (NIGHT_START_HOUR > NIGHT_END_HOUR).
		 * @property {number} TRANSITION_HOURS - The crossfade width in hours centered on dawn/dusk (2).
		 */
		/** @public @type {satAutoConfig} */
		this.satAutoConfig = {
			CHROMA_BASE:      0.12,
			CHROMA_RANGE:     0.18,
			THRESHOLD:        0.38,
			FULL_CORRECT_AT:  1.00,
			MAX_CUT:          0.55,
			MAX_ABSOLUTE_CUT: 0.75,

			// * TWO-PEAK HUE MODEL
			HUE_PEAK_GREEN:     128,
			HUE_PEAK_RED:        25,
			HUE_TROUGH:         255,
			HUE_LOUDNESS_FLOOR: 0.25,

			// * NIGHT BOOST
			NIGHT_FLOOR_CHROMA_RATIO:     0.50,
			NIGHT_THRESHOLD_MULTIPLIER:   0.78,
			NIGHT_MAXCUT_MULTIPLIER:      1.20,
			NIGHT_FULLCORRECT_MULTIPLIER: 0.88,
			NIGHT_START_HOUR:               20,
			NIGHT_END_HOUR:                  7,
			TRANSITION_HOURS:                2
		};

		/**
		 * The configuration constants for two-color detection and clustering logic.
		 * The object defines thresholds for identifying dominant color pairs and accent colors.
		 * @typedef {Object} twoColorConfig
		 * @property {number} DOMINANT_THRESHOLD - The threshold when one cluster covers >50% - considered dominant.
		 * @property {number} BALANCED_MIN - The minimum coverage each cluster needs >20% for a "balanced" pair.
		 * @property {number} BALANCED_TOTAL - The combined coverage required for a balanced two-color pair (0.75).
		 * @property {number} HUE_CLUSTER_THRESHOLD - The hue distance in degrees to merge similar colors into one cluster (30).
		 * @property {number} LUM_SPREAD_GRADIENT_THRESHOLD - The luminance range limit (0-1) to detect gradients/photographic images (0.20).
		 * @property {number} MIN_ACCENT_FREQ - The minimum 0.3% frequency for an accent color to count (0.003).
		 */
		/** @public @type {twoColorConfig} */
		this.twoColorConfig = {
			DOMINANT_THRESHOLD:            0.50,
			BALANCED_MIN:                  0.20,
			BALANCED_TOTAL:                0.75,
			HUE_CLUSTER_THRESHOLD:           30,
			LUM_SPREAD_GRADIENT_THRESHOLD: 0.20,
			MIN_ACCENT_FREQ:               0.003
		};
	}

	// * PUBLIC METHODS - GENERAL * //
	// #region PUBLIC METHODS - GENERAL
	/**
	 * Adjusts a color's brightness in OKLCH space for perceptually uniform results.
	 * Used by adjustThemeBrightness and adjustTextButtonColors.
	 * OKLCH provides perfect perceptual uniformity and hue/chroma preservation, eliminating all saturation compensation artifacts from HSL.
	 * @param {number} color - The RGB color value.
	 * @param {number} percent - The percentage to adjust (-100 to +100).
	 * @param {boolean} isDarkening - True if darkening, false if lightening.
	 * @returns {number} The adjusted RGB color value.
	 */
	adjustColorBrightness(color, percent, isDarkening) {
		const alpha = GetAlpha(color);
		const oklch = RGBtoOKLCH(color);

		// Calculate new lightness based on percentage
		const adjustment = Math.abs(percent) / 100;
		const newL = isDarkening
			? Math.max(0, oklch.L * (1 - adjustment))
			: Math.min(1, oklch.L + (1 - oklch.L) * adjustment);

		// Perfect hue and chroma preservation - C and H stay constant!
		return AdjustOKLCH(color, newL, alpha);
	}

	/**
	 * Batch processes multiple colors with the same brightness adjustment.
	 * @param {Object} colorObj - The object containing color properties to adjust.
	 * @param {Array<string>} props - The array of property names to adjust.
	 * @param {number} percent - The adjustment percentage.
	 * @param {boolean} isDarkening - True if darkening.
	 */
	adjustColorBrightnessBatch(colorObj, props, percent, isDarkening) {
		for (const prop of props) {
			if (colorObj[prop] !== undefined) {
				colorObj[prop] = this.adjustColorBrightness(colorObj[prop], percent, isDarkening);
			}
		}
	}

	/**
	 * Adjusts text and button colors using OKLCH with perceptually uniform brightness.
	 * OKLCH's cylindrical coordinates (L, C, H) preserve hue and colorfulness perfectly.
	 * @param {number} percent - The percentage to adjust the brightness by.
	 * @param {boolean} darken - Whether to darken the color.
	 * @param {boolean} darkenMax - Whether to apply maximum darkening.
	 * @param {boolean} lighten - Whether to lighten the color.
	 * @param {boolean} lightenMax - Whether to apply maximum lightening.
	 */
	adjustTextButtonColors(percent, darken, darkenMax, lighten, lightenMax) {
		/**
		 * Adjusts color brightness based on mode using OKLCH.
		 * @param {number} color - The base color to be adjusted.
		 * @param {boolean} [boost] - If true, increases the intensity.
		 * @param {boolean} [soften] - If true, decreases the intensity.
		 * @returns {number} The adjusted color.
		 */
		const SetColor = (color, boost = false, soften = false) => {
			if (!darken && !darkenMax && !lighten && !lightenMax) {
				return color;
			}

			let adjustPercent;
			let isDarkening;

			if (darken) {
				adjustPercent = percent * (boost ? 1.75 : soften ? 1.25 : 1.5);
				isDarkening = true;
			}
			else if (darkenMax) {
				adjustPercent = boost ? 100 : soften ? 60 : 85;
				isDarkening = true;
			}
			else if (lighten) {
				adjustPercent = percent * (boost ? 1.75 : soften ? 1.25 : 1.5);
				isDarkening = false;
			}
			else if (lightenMax) {
				adjustPercent = boost ? 100 : soften ? 60 : 85;
				isDarkening = false;
			}

			return this.adjustColorBrightness(color, adjustPercent, isDarkening);
		};

		// * PLAYLIST COLORS * //
		const playlistColors = {
			plman_text_normal: grSet.autoHidePlman ? pl.col.bg : SetColor(pl.col.plman_text_normal),
			plman_text_hovered: SetColor(pl.col.plman_text_hovered, true),
			plman_text_pressed: SetColor(pl.col.plman_text_pressed, true),
			header_artist_normal: SetColor(pl.col.header_artist_normal),
			header_artist_playing: SetColor(pl.col.header_artist_playing, true),
			header_album_normal: SetColor(pl.col.header_album_normal),
			header_album_playing: SetColor(pl.col.header_album_playing, true),
			header_info_normal: SetColor(pl.col.header_info_normal, true),
			header_info_playing: SetColor(pl.col.header_info_playing, true),
			header_date_normal: SetColor(pl.col.header_date_normal),
			header_date_playing: SetColor(pl.col.header_date_playing, true),
			row_title_normal: SetColor(pl.col.row_title_normal),
			row_title_playing: SetColor(pl.col.row_title_playing, true),
			row_title_selected: SetColor(pl.col.row_title_selected, true),
			row_title_hovered: SetColor(pl.col.row_title_hovered, true),
			sbar_btn_normal: SetColor(pl.col.sbar_btn_normal),
			sbar_btn_hovered: SetColor(pl.col.sbar_btn_hovered, true),
			sbar_thumb_normal: SetColor(pl.col.sbar_thumb_normal, false, true),
			sbar_thumb_hovered: SetColor(pl.col.sbar_thumb_hovered, true),
			sbar_thumb_drag: SetColor(pl.col.sbar_thumb_drag, true)
		};
		Object.assign(pl.col, playlistColors);

		// * LIBRARY COLORS * //
		const libraryColors = {
			iconPlus: SetColor(lib.ui.col.iconPlus),
			iconPlus_h: SetColor(lib.ui.col.iconPlus_h, true),
			iconPlus_sel: SetColor(lib.ui.col.iconPlus_sel, true),
			iconPlusBg: SetColor(lib.ui.col.iconPlusBg),
			iconMinus_e: SetColor(lib.ui.col.iconMinus_e),
			iconMinus_h: SetColor(lib.ui.col.iconMinus_h, true),
			text: SetColor(lib.ui.col.text),
			text_h: SetColor(lib.ui.col.text_h, true),
			text_nowp: SetColor(lib.ui.col.text_nowp, true),
			textSel: SetColor(lib.ui.col.textSel, true),
			txt_box: SetColor(lib.ui.col.txt_box),
			search: SetColor(lib.ui.col.search),
			searchBtn: SetColor(lib.ui.col.searchBtn),
			crossBtn: SetColor(lib.ui.col.crossBtn),
			filterBtn: SetColor(lib.ui.col.filterBtn),
			settingsBtn: SetColor(lib.ui.col.settingsBtn),
			line: SetColor(lib.ui.col.line),
			sbarBtns: SetColor(lib.ui.col.sbarBtns),
			sbarNormal: SetColor(lib.ui.col.sbarNormal),
			sbarHovered: SetColor(lib.ui.col.sbarHovered, true),
			sbarDrag: SetColor(lib.ui.col.sbarDrag, true)
		};
		Object.assign(lib.ui.col, libraryColors);

		// * BIOGRAPHY COLORS * //
		const biographyColors = {
			headingText: SetColor(bio.ui.col.headingText),
			iconMinus_e: SetColor(bio.ui.col.iconMinus_e),
			iconMinus_h: SetColor(bio.ui.col.iconMinus_h),
			text: SetColor(bio.ui.col.text),
			source: SetColor(bio.ui.col.source),
			accent: SetColor(bio.ui.col.accent),
			summary: SetColor(bio.ui.col.summary),
			sbarBtns: SetColor(bio.ui.col.sbarBtns),
			sbarNormal: SetColor(bio.ui.sbarNormal),
			sbarHovered: SetColor(bio.ui.col.sbarHovered, true),
			sbarDrag: SetColor(bio.ui.col.sbarDrag, true)
		};
		Object.assign(bio.ui.col, biographyColors);

		// * MAIN COLORS * //
		const mainColors = {
			detailsText: SetColor(grCol.detailsText),
			popupText: SetColor(grCol.popupText),
			noAlbumArtStub: SetColor(grCol.noAlbumArtStub),
			lowerBarArtist: SetColor(grCol.lowerBarArtist),
			lowerBarTitle: SetColor(grCol.lowerBarTitle),
			lowerBarTime: SetColor(grCol.lowerBarTime),
			lowerBarLength: SetColor(grCol.lowerBarLength),
			menuTextNormal: SetColor(grCol.menuTextNormal),
			menuTextHovered: SetColor(grCol.menuTextHovered, true),
			menuTextDown: SetColor(grCol.menuTextDown, true),
			transportIconNormal: !['reborn', 'random'].includes(grSet.theme) ? SetColor(grCol.transportIconNormal) : grCol.transportIconNormal,
			transportIconHovered: !['reborn', 'random'].includes(grSet.theme) ? SetColor(grCol.transportIconHovered, true) : grCol.transportIconHovered,
			transportIconDown: !['reborn', 'random'].includes(grSet.theme) ? SetColor(grCol.transportIconDown, true) : grCol.transportIconDown
		};
		Object.assign(grCol, mainColors);

		window.Repaint();
	}

	/**
	 * Lightens or darkens the theme based on grSet.themeBrightness value, used in Options > Brightness.
	 * Uses OKLCH color space for perceptually uniform brightness adjustments with perfect hue/chroma preservation.
	 * Unlike HSL, OKLCH requires no saturation compensation and provides mathematically accurate perceptual uniformity.
	 * @param {number} percent - The percentage number for lightening or darkening all colors in the theme.
	 */
	adjustThemeBrightness(percent = grSet.themeBrightness) {
		if (grSet.themeBrightness === 'default') return;

		const adjustment = Math.abs(percent);
		const isDarkening = grSet.themeBrightness < 0;

		// * PLAYLIST COLORS * //
		this.adjustColorBrightnessBatch(pl.col, [
			'bg', 'plman_bg', 'plman_text_normal',
			'header_nowplaying_bg', 'header_sideMarker',
			'header_line_normal', 'header_line_playing',
			'row_nowplaying_bg', 'row_stripes_bg',
			'row_selection_bg', 'row_selection_frame',
			'row_sideMarker', 'row_disc_subheader_line',
			'sbar_btn_normal', 'sbar_btn_hovered',
			'sbar_thumb_normal', 'sbar_thumb_hovered', 'sbar_thumb_drag'
		], adjustment, isDarkening);

		// * LIBRARY COLORS * //
		lib.ui.col.bg = pl.col.bg; // Share with playlist
		this.adjustColorBrightnessBatch(lib.ui.col, [
			'line', 's_line', 'nowPlayingBg',
			'sideMarker', 'sideMarker_nobw', 'selectionFrame',
			'sbarBtns', 'sbarNormal', 'sbarHovered', 'sbarDrag'
		], adjustment, isDarkening);

		// * BIOGRAPHY COLORS * //
		bio.ui.col.bg = pl.col.bg; // Share with playlist
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = pl.col.header_line_normal;
		this.adjustColorBrightnessBatch(bio.ui.col, [
			'sbarBtns', 'sbarNormal', 'sbarHovered', 'sbarDrag'
		], adjustment, isDarkening);

		// * MAIN COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'bg', 'shadow', 'detailsBg',
			'timelineAdded', 'timelinePlayed', 'timelineUnplayed', 'timelineFrame',
			'popupBg'
		], adjustment, isDarkening);

		// * TOP MENU BUTTON COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'menuBgColor', 'menuStyleBg',
			'menuRectStyleEmbossTop', 'menuRectStyleEmbossBottom',
			'menuRectNormal', 'menuRectHovered'
		], adjustment, isDarkening);
		grCol.menuRectDown = grCol.menuRectHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'transportEllipseBg', 'transportEllipseNormal',
			'transportEllipseHovered',
			'transportStyleBg', 'transportStyleTop', 'transportStyleBottom'
		], adjustment, isDarkening);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		// * PROGRESS BAR COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'progressBar', 'progressBarStreaming',
			'progressBarFrame', 'progressBarFill'
		], adjustment, isDarkening);

		// * PEAKMETER BAR COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'peakmeterBarProg', 'peakmeterBarProgFill',
			'peakmeterBarFillTop', 'peakmeterBarFillMiddle', 'peakmeterBarFillBack',
			'peakmeterBarVertProgFill', 'peakmeterBarVertFill', 'peakmeterBarVertFillPeaks'
		], adjustment, isDarkening);

		// * WAVEFORM BAR COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'waveformBarFillFront', 'waveformBarFillBack',
			'waveformBarFillPreFront', 'waveformBarFillPreBack',
			'waveformBarIndicator'
		], adjustment, isDarkening);

		// * VOLUME BAR COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'volumeBar', 'volumeBarFrame', 'volumeBarFill'
		], adjustment, isDarkening);

		// * STYLE COLORS * //
		this.adjustColorBrightnessBatch(grCol, [
			'styleProgressBar', 'styleProgressBarLineTop', 'styleProgressBarLineBottom',
			'styleVolumeBar'
		], adjustment, isDarkening);

		// * TEXT AND BUTTON COLOR ADJUSTMENTS * //
		// Only adjust text colors based on luminance thresholds
		if (isDarkening) {
			const bgColBrightness = Color.LUM(grCol.bg);
			const txtColBrightness = Color.LUM(pl.col.row_title_normal);
			if (bgColBrightness < LUM.Y60 && txtColBrightness < LUM.Y32) {
				this.adjustTextButtonColors(adjustment, true, false, false, false);
			}
		} else if (grCol.colLuminance < LUM.Y32 && grCol.colLuminance > LUM.Y0_5) {
			this.adjustTextButtonColors(adjustment, false, false, true, false);
		}

		// * EXTREME BRIGHTNESS ADJUSTMENTS * //
		if (grSet.themeBrightness > 20 && grCol.colLuminance < LUM.Y32 && grCol.colLuminance > LUM.Y15) {
			grCol.lightBgMain = false;
			this.adjustTextButtonColors(adjustment, false, true, false, false);
		}
		else if (grSet.themeBrightness < -20 && grCol.colLuminance < LUM.Y32 && grCol.colLuminance > LUM.Y0_5) {
			grCol.lightBgMain = false;
			this.adjustTextButtonColors(adjustment, false, false, false, true);
		}
	}

	/**
	 * Creates the color objects with systematic RGB and OKLCH tone palettes.
	 * Naming: {source}_{colorspace}_{t|s}{percentage} (zero-padded to 3 digits)
	 * t = tint, s = shade
	 * @param {number} primaryColor - The primary color.
	 * @param {number} [secondaryColor] - The optional secondary color.
	 * @returns {Object} The base color palette reference.
	 */
	createThemeColorPalette(primaryColor, secondaryColor = primaryColor) {
		const color1 = this.getCachedColor(primaryColor);
		const color2 = this.getCachedColor(secondaryColor);
		const primary = grCfg.settings.showDebugAPCACalibrationOverlay ? grm.colorDebug.getAPCACalibrationToneColor() : color1.val;

		// Store base colors
		grCol.primary = primary;
		grCol.secondary = color2.val;

		/**
		 * Generates systematic tone scales for a base color
		 * @param {number} baseColor - The RGB color value
		 * @param {string} source - 'primary' or 'secondary'
		 */
		const generateToneScales = (baseColor, source) => {
			const tones = [0, 2, 5, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 75, 80, 90, 100];

			for (const percent of tones) {
				const percentPad = percent.toString().padStart(3, '0');

				// RGB TONES
				grCol[`${source}_rgb_t${percentPad}`] = TintColor(baseColor, percent);
				grCol[`${source}_rgb_s${percentPad}`] = ShadeColor(baseColor, percent);

				// OKLCH TONES
				grCol[`${source}_oklch_t${percentPad}`] = TintColorOKLCH(baseColor, percent);
				grCol[`${source}_oklch_s${percentPad}`] = ShadeColorOKLCH(baseColor, percent);
			}
		};

		// Generate all tone scales
		generateToneScales(grCol.primary, 'primary');
		generateToneScales(grCol.secondary, 'secondary');

		return {
			primary: grCol.primary,
			secondary: grCol.secondary
		};
	}

	/**
	 * Gets or creates a cached Color object to avoid repeated instantiation within a single album's processing pass.
	 * @param {number} rgb - The RGB value.
	 * @returns {Color} The cached or new Color object.
	 */
	getCachedColor(rgb) {
		if (this.colorCache.has(rgb)) {
			return this.colorCache.get(rgb);
		}

		const color = new Color(rgb);

		// FIFO eviction: Map insertion order = oldest entry first
		if (this.colorCache.size >= this.colorCacheMaxSize) {
			const oldestKey = this.colorCache.keys().next().value;
			this.colorCache.delete(oldestKey);
		}

		this.colorCache.set(rgb, color);
		return color;
	}

	/**
	 * Computes the shared lyrics color set (highlight, shadow) from a primary color.
	 * @param {number} primary - The primary RGB color value.
	 * @param {boolean} isLightBg - The flag if the background is light.
	 * @param {boolean} staticTheme - The flag if the theme is static (non-dynamic).
	 * @param {object} themeObj - The current theme palette object.
	 * @returns {{ lyricsHighlight: number, lyricsShadow: number }}
	 */
	getLyricsColors(primary, isLightBg, staticTheme, themeObj) {
		const oklchPrimary = RGBtoOKLCH(primary);
		const highlightH = (oklchPrimary.H + 180) % 360;
		const highlightL = isLightBg ? 0.50 : 0.90;
		const highLightC = this.getMaxGamutChroma(highlightL, highlightH) * 0.75;
		const lyricsHighlight = OKLCHtoRGB(highlightL, highLightC, highlightH);

		const shadedShadow = ShadeColorOKLCH(primary, 75);
		const lyricsShadow = staticTheme ? themeObj :
			isLightBg ? RGBtoRGBA(shadedShadow, 100) :
			RGBtoRGBA(shadedShadow, 200);

		return { lyricsHighlight, lyricsShadow };
	}

	/**
	 * Gets the shadow color for the middle album art and panel shadow based on active theme styles.
	 * @returns {number} The shadow color.
	 */
	getMiddleShadowColor() {
		return (
			grSet.styleBlackAndWhite && grm.ui.noAlbumArtStub ? RGB(0, 0, 0) :
			grSet.styleNighttime || grSet.styleBlackAndWhite2 || grSet.styleRebornBlack ? RGBA(0, 0, 0, 30) :
			grCol.shadow
		);
	}

	/**
	 * Gets the light and dark text color candidates for the Main panel (lowerBarTitle).
	 * @returns {{light: number, dark: number}} The light and dark text color options for APCA evaluation.
	 */
	getTextColorMain() {
		const { THEME, CTHEME, BLEND12, BW2, BR, RW, RB, RF, RF2 } = grAlias;
		const theme = THEME === 'random' ? 'reborn' : THEME;

		// Default fallback
		let light = RGB(220, 220, 220);
		let dark = RGB(80, 80, 80);

		// Style overrides
		if (BW2 || RF || RF2) {
			return { light, dark };
		}
		if (BR) {
			light = grCol.primary_rgb_t100;
			dark = grCol.primary_rgb_s075;
			return { light, dark };
		}
		if (RW) {
			dark = BLEND12 ? RGB(50, 50, 50) : RGB(100, 100, 100);
			return { light, dark };
		}
		if (RB) {
			light = BLEND12 ? RGB(220, 220, 220) : RGB(200, 200, 200);
			return { light, dark };
		}

		// Custom theme
		if (CTHEME && grCfg.cTheme.grCol_lowerBarTitle) {
			const base = HEXtoRGB(grCfg.cTheme.grCol_lowerBarTitle);
			light = TintColor(base, BLEND12 ? 10 : 0);
			dark = ShadeColor(base, BLEND12 ? 30 : 20);
			return { light, dark };
		}

		// Theme-specific adjustments
		const themeTextColors = {
			white:    { light: RGB(220, 220, 220), dark: BLEND12 ? RGB(80, 80, 80) : RGB(120, 120, 120) },
			black:    { light: BLEND12 ? RGB(220, 220, 220) : RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			reborn:   { light: grCol.primary_rgb_t080, dark: grCol.primary_rgb_s065 },
			blue:     { light: RGB(245, 245, 245), dark: RGB(80, 80, 80) },
			darkblue: { light: RGB(230, 230, 230), dark: RGB(80, 80, 80) },
			red:      { light: RGB(220, 220, 220), dark: RGB(80, 80, 80) },
			cream:    { light: RGB(220, 220, 220), dark: BLEND12 ? RGB(90, 90, 90) : RGB(100, 100, 100) },
			nblue:    { light: RGB(220, 220, 220), dark: RGB(80, 80, 80) },
			ngreen:   { light: RGB(220, 220, 220), dark: RGB(80, 80, 80) },
			nred:     { light: RGB(220, 220, 220), dark: RGB(80, 80, 80) },
			ngold:    { light: RGB(220, 220, 220), dark: RGB(80, 80, 80) }
		};

		const textColor = themeTextColors[theme];
		if (textColor) return textColor;

		return { light, dark };
	}

	/**
	 * Gets the light and dark text color candidates for the Details panel (detailsText).
	 * @returns {{light: number, dark: number}} The light and dark text color options for APCA evaluation.
	 */
	getTextColorDetails() {
		const { THEME, CTHEME, BLEND } = grAlias;
		const theme = THEME === 'random' ? 'reborn' : THEME;

		// Default fallback
		let light = RGB(255, 255, 255);
		let dark = RGB(80, 80, 80);

		// Style overrides
		if (grSet.styleBlackAndWhite2 || grSet.styleRebornFusion || grSet.styleRebornFusion2) {
			dark = RGB(60, 60, 60);
			return { light, dark };
		}

		// Custom theme
		if (CTHEME && grCfg.cTheme.grCol_detailsText) {
			const base = HEXtoRGB(grCfg.cTheme.grCol_detailsText);
			light = TintColor(base, 20);
			dark = base;
			return { light, dark };
		}

		// Theme-specific adjustments
		if (['blue', 'darkblue', 'red', 'nblue', 'ngreen', 'nred', 'ngold'].includes(theme)) {
			return { light, dark };
		}

		const themeTextColors = {
			white:  { light: RGB(255, 255, 255), dark: RGB(55, 55, 55) },
			black:  { light: RGB(255, 255, 255), dark: RGB(55, 55, 55) },
			reborn: { light: grCol.primary_rgb_t080, dark: grCol.primary_rgb_s065 },
			cream:  { light: RGB(220, 220, 220), dark: BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120) }
		};

		const textColor = themeTextColors[theme];
		if (textColor) return textColor;

		return { light, dark };
	}

	/**
	 * Gets the light and dark text color candidates for the Playlist panel (row_title_normal).
	 * @returns {{light: number, dark: number}} The light and dark text color options for APCA evaluation.
	 */
	getTextColorPlaylist() {
		const { THEME, CTHEME, BLEND, LAYOUT } = grAlias;
		const theme = THEME === 'random' ? 'reborn' : THEME;

		// Default fallback
		let light = RGB(200, 200, 200);
		let dark = RGB(80, 80, 80);

		// Style overrides
		if (grSet.styleBlackAndWhite2 || grSet.styleRebornFusion || grSet.styleRebornFusion2) {
			light = RGB(200, 200, 220);
			return { light, dark };
		}

		// Custom theme
		if (CTHEME && grCfg.cTheme.pl_col_row_title_normal) {
			const base = HEXtoRGB(grCfg.cTheme.pl_col_row_title_normal);
			light = base;
			dark = ShadeColor(base, BLEND ? 10 : 5);
			return { light, dark };
		}

		// Theme-specific adjustments
		const themeTextColors = {
			white: {
				light: RGB(220, 220, 220),
				dark: LAYOUT === 'compact' ? (BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120)) :
											 (BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100))
			},
			black:    { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			reborn:   { light: grCol.primary_rgb_t080, dark: grCol.primary_rgb_s065 },
			blue:     { light: RGB(230, 230, 230), dark: RGB(80, 80, 80) },
			darkblue: { light: RGB(230, 230, 230), dark: RGB(80, 80, 80) },
			red:      { light: RGB(220, 220, 220), dark: RGB(80, 80, 80) },
			cream:    { light: RGB(200, 200, 200), dark: BLEND ? RGB(60, 60, 60) : RGB(90, 90, 90) },
			nblue:    { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			ngreen:   { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			nred:     { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			ngold:    { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) }
		};

		const textColor = themeTextColors[theme];
		if (textColor) return textColor;

		return { light, dark };
	}

	/**
	 * Gets the light and dark text color candidates for the Library panel (col.text).
	 * @returns {{light: number, dark: number}} The light and dark text color options for APCA evaluation.
	 */
	getTextColorLibrary() {
		const { THEME, CTHEME, BLEND } = grAlias;
		const theme = THEME === 'random' ? 'reborn' : THEME;

		// Default fallback
		let light = RGB(200, 200, 200);
		let dark = RGB(80, 80, 80);

		// Style overrides
		if (grSet.styleBlackAndWhite2 || grSet.styleRebornFusion || grSet.styleRebornFusion2) {
			return { light, dark };
		}

		// Custom theme
		if (CTHEME && grCfg.cTheme.lib_ui_col_text) {
			const base = HEXtoRGB(grCfg.cTheme.lib_ui_col_text);
			light = TintColor(base, 40);
			dark = TintColor(base, BLEND ? 10 : 0);
			return { light, dark };
		}

		// Theme-specific adjustments
		const themeTextColors = {
			white:    { light: RGB(220, 220, 220), dark: BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100) },
			black:    { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			reborn:   { light: grCol.primary_rgb_t080, dark: grCol.primary_rgb_s065 },
			blue:     { light: RGB(230, 230, 230), dark: RGB(80, 80, 80) },
			darkblue: { light: RGB(230, 230, 230), dark: RGB(80, 80, 80) },
			red:      { light: RGB(230, 230, 230), dark: RGB(80, 80, 80) },
			cream:    { light: RGB(220, 220, 220), dark: BLEND ? RGB(65, 65, 65) : RGB(90, 90, 90) },
			nblue:    { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			ngreen:   { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			nred:     { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) },
			ngold:    { light: RGB(200, 200, 200), dark: RGB(80, 80, 80) }
		};

		const textColor = themeTextColors[theme];
		if (textColor) return textColor;

		return { light, dark };
	}

	/**
	 * Gets the light and dark text color candidates for the Biography panel (col.text).
	 * @returns {{light: number, dark: number}} The light and dark text color options for APCA evaluation.
	 */
	getTextColorBiography() {
		const { THEME, CTHEME, BLEND, LAYOUT } = grAlias;
		const theme = THEME === 'random' ? 'reborn' : THEME;

		// Default fallback
		let light = RGB(200, 200, 200);
		let dark = RGB(80, 80, 80);

		// Style overrides
		if (grSet.styleBlackAndWhite2 || grSet.styleRebornFusion || grSet.styleRebornFusion2) {
			return this.getTextColorPlaylist();
		}

		// Custom theme
		if (CTHEME && grCfg.cTheme.bio_ui_col_text) {
			const base = HEXtoRGB(grCfg.cTheme.bio_ui_col_text);
			light = base;
			dark = TintColor(base, BLEND ? 10 : 0);
			return { light, dark };
		}

		// Theme-specific adjustments
		if (['black', 'blue', 'darkblue', 'red', 'cream', 'nblue', 'ngreen', 'nred', 'ngold'].includes(theme)) {
			return this.getTextColorPlaylist();
		}

		const themeTextColors = {
			white: {
				light: RGB(220, 220, 220),
				dark: LAYOUT === 'compact' ? (BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120)) :
											 (BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100))
			},
			reborn: { light: grCol.primary_rgb_t080, dark: grCol.primary_rgb_s065 },
		};

		const textColor = themeTextColors[theme];
		if (textColor) return textColor;

		return { light, dark };
	}

	/**
	 * Determines if the Reborn Fusion styles are being currently used.
	 * @returns {boolean} - Returns true if any reborn fusion style is active.
	 */
	isRebornFusion() {
		return grSet.theme === 'reborn' && (
			grSet.styleRebornFusion || grSet.styleRebornFusion2 || grSet.styleRebornFusionAccent
		);
	}
	// #endregion

	// * PUBLIC METHODS - SET THEME COLORS * //
	// #region PUBLIC METHODS - SET THEME COLORS
	/**
	 * Sets Main, Playlist, Details, Library and Biography background brightness rules using APCA (WCAG 3.0).
	 * Determines whether each panel's background is light or dark based on color and accent brightness.
	 * Used to choose readable text/icon colors (black or white).
	 * Applies to White, Black, Reborn, Random, Fusion, Gradient, and Custom themes.
	 */
	setBackgroundBrightnessRules() {
		grCol.colBrightness  = Color.BRT(grCol.primary);
		grCol.colBrightness2 = Color.BRT(grCol.secondary);
		grCol.colLuminance   = Color.LUM(grCol.primary);
		grCol.colLuminance2  = Color.LUM(grCol.secondary);

		const { THEME, DYNTHEME, CTHEME, BLEND, BLEND2, GRAD12, BR, RF, RF2 } = grAlias;

		// * Static themes - skip ACPA bg check for performance
		if (!CTHEME && !DYNTHEME) {
			const brightThemes = ['cream', 'white'].includes(THEME);

			grCol.lightBgMain = grCol.lightBgDetails = grCol.lightBgPlaylist =
			grCol.lightBgLibrary = grCol.lightBgBiography = brightThemes;

			return;
		}

		// * Dynamic themes - do ACPA bg check
		const getBgColor = (customKey, isBgMain) => {
			// Check custom themes
			const cThemeKey = grCfg.cTheme[customKey];
			if (CTHEME && cThemeKey) return HEXtoRGB(cThemeKey);

			// Check static colors of the theme palette
			const theme = grm.colorPalette.getTheme(THEME);
			const paletteColor = theme ? theme[customKey] : null;
			if (paletteColor && !['reborn', 'random'].includes(grSet.theme) && !BR) return paletteColor;

			// No album art: always use the palette color
			if (grm.ui.noAlbumArtStub && paletteColor) return paletteColor;

			// Check dynamic colors
			// Reborn Fusion swap: main panel uses RF primary color, other panels use RF2 secondary color
			const rebornFusionSecondary = isBgMain ? RF : RF2;
			return rebornFusionSecondary ? grCol.secondary : grCol.primary;
		};

		const getContrastOptionsACPA = (isBgMain) => {
			const opts = {};

			if (grCol.imgLuminance && (BLEND || BLEND2 && isBgMain)) {
				const bgColor = getBgColor(isBgMain ? 'grCol_bg' : 'pl_col_bg', isBgMain);
				const bgLuminance = Color.LUM(bgColor);

				const renderAlpha = grm.colorStyles.getStyleBlendImageAlpha(grCol.imgLuminance, bgLuminance, grCol.imgSaturation);
				const blurLevel = grm.colorStyles.getStyleBlendImageBlur(grCol.imgLuminance, bgLuminance, renderAlpha, grCol.imgSaturation);

				opts.imgLuminance = grCol.imgLuminance;
				opts.overlayAlpha = renderAlpha;
				opts.blurLevel = blurLevel;

				if (grCfg.settings.showDebugThemeLog) {
					console.log(`APCA blend: render alpha ${renderAlpha}, blur ${blurLevel}`);
				}
			}

			if (isBgMain && GRAD12) {
				const gradientColor = grSet.styleGradient ? grCol.styleGradient : grCol.styleGradient2;
				const gradientLum = Color.LUM(gradientColor);
				const mainBgLum = RF ? grCol.colLuminance2 : grCol.colLuminance;
				const adaptiveWeight = grm.colorStyles.getStyleGradientWeight(mainBgLum, gradientLum);

				opts.gradientColor = gradientColor;
				opts.gradientWeight = adaptiveWeight;

				if (grCfg.settings.showDebugThemeLog) {
					const barCoverage = ((grm.ui.topMenuHeight + grm.ui.lowerBarHeight) / grm.ui.wh * 100).toFixed(1);
					console.log(`APCA gradient: style=${grSet.styleGradient ? 1 : 2}, bars=${barCoverage}% of screen, bg=${grCol.colLuminance.toFixed(3)}, grad=${gradientLum.toFixed(3)}, weight=${adaptiveWeight.toFixed(3)}`);
				}
			}

			return opts;
		};

		// Get panel specific text color candidates
		const mainText = this.getTextColorMain();
		const detailsText = this.getTextColorDetails();
		const playlistText = this.getTextColorPlaylist();
		const libraryText = this.getTextColorLibrary();
		const biographyText = this.getTextColorBiography();

		grCol.lightBgPrimary = grm.colorSystem.isLightBackground(
			grCol.primary, playlistText.light, playlistText.dark, getContrastOptionsACPA(false)
		);
		grCol.lightBgMain = grm.colorSystem.isLightBackground(
			getBgColor('grCol_bg', true), mainText.light, mainText.dark, getContrastOptionsACPA(true)
		);
		grCol.lightBgDetails = BR ? false : grm.colorSystem.isLightBackground(
			getBgColor('grCol_detailsBg', false), detailsText.light, detailsText.dark, getContrastOptionsACPA(false)
		);
		grCol.lightBgPlaylist = grm.colorSystem.isLightBackground(
			getBgColor('pl_col_bg', false), playlistText.light, playlistText.dark, getContrastOptionsACPA(false)
		);
		grCol.lightBgLibrary = grm.colorSystem.isLightBackground(
			getBgColor('lib_ui_col_bg', false), libraryText.light, libraryText.dark, getContrastOptionsACPA(false)
		);
		grCol.lightBgBiography = grm.colorSystem.isLightBackground(
			getBgColor('bio_ui_col_bg', false), biographyText.light, biographyText.dark, getContrastOptionsACPA(false)
		);
	}

	/**
	 * Sets calculated image brightness from album art, mainly used when using style Blend 1 and 2 or style Black and white reborn.
	 * @param {GdiBitmap} [image] - The album art image to analyze.
	 * @param {Array} [cache] - The cache array for album art color extraction to avoid repeated GetColourSchemeJSON calls.
	 */
	setImageBrightness(image = grm.ui.albumArt, cache = grm.ui.cachedAlbumArtColors) {
		if (!grCfg.settings.showDebugThemeOverlay && !image) return;

		const needBrightness = (
			grSet.styleBlend || grSet.styleBlend2 || grSet.styleBlackAndWhiteReborn ||
			grSet.presetSelectMode === 'harmonic' || libSet.theme !== 0
		);

		if (needBrightness) {
			grCol.imgBrightness = CalcImgBrightness(image, cache);
			grSet.styleBlackAndWhiteReborn && grm.colorStyles.initBlackAndWhiteReborn();
		}
	}

	/**
	 * Sets calculated image luminance from album art, mainly used when using style Blend 1 and 2 or style Black and white reborn.
	 * @param {GdiBitmap} [image] - The album art image to analyze.
	 * @param {Array} [cache] - The cache array for album art color extraction to avoid repeated GetColourSchemeJSON calls.
	 */
	setImageLuminance(image = grm.ui.albumArt, cache = grm.ui.cachedAlbumArtColors) {
		if (!image) return;

		const needLuminance = (
			grSet.styleBlend || grSet.styleBlend2 || grSet.styleBlackAndWhiteReborn ||
			grSet.presetSelectMode === 'harmonic' || libSet.theme !== 0
		);

		if (needLuminance) {
			grCol.imgLuminance = grm.colorSystem.calcImgLuminance(image, cache);
			grSet.styleBlackAndWhiteReborn && grm.colorStyles.initBlackAndWhiteReborn();
		}
	}

	/**
	 * Sets a new primary theme color either from a provided color or by restoring the previously saved one.
	 * This updates `grCol.primary` and triggers a full theme refresh with `initTheme`.
	 * Use this for propagating color changes from external modules (e.g., library explorer artwork overrides).
	 * @param {number} [primaryColor] - The new primary color to apply (RGB value). Ignored if `restore` is true.
	 * @param {number} [secondaryColor] - The new secondary primary color to apply (RGB value). Ignored if `restore` is true.
	 * @param {boolean} [restore] - If true, restores the saved primary color (`grCol.primary_saved`) instead of using `primaryColor`.
	 */
	setPrimaryColor(primaryColor, secondaryColor = undefined, restore = false) {
		const primary = restore ? grCol.primary_saved : primaryColor;
		const secondary = restore ? grCol.secondary_saved : secondaryColor;

		// Generate full palette from primary/secondary colors
		const palette = this.isRebornFusion() && secondary !== undefined
			? this.createThemeColorPalette(primary, secondary)
			: this.createThemeColorPalette(primary);

		this.setThemeColorPalette(palette, true);
		grm.ui.initTheme();
	}

	/**
	 * Sets and updates the theme color palette to the `grCol` color object.
	 * @param {object} palette - The color palette from createColorPalette.
	 * @param {boolean} [newPrimary] - Whether this is an externally generated color.
	 */
	setThemeColorPalette(palette, newPrimary = false) {
		// Apply all palette values to grCol
		Object.assign(grCol, palette);

		if (grm.ui.isStreaming && (['white', 'black', 'reborn', 'random'].includes(grSet.theme))) {
			grCol.primary = RGB(207, 0, 5);
		}

		// * Saves the internal original now playing primary color from main
		// * Can be used to restore the main primary color in external scripts after color manipulations
		if (!newPrimary) {
			grCol.primary_saved = grCol.primary;
			grCol.secondary_saved = grCol.secondary;
		}
	}

	// * PUBLIC METHODS - RANDOM COLOR * //
	// #region PUBLIC METHODS - RANDOM COLOR
	/**
	 * Generates a random theme color using OKLCH color space for perceptually uniform results.
	 * OKLCH provides better perceptual uniformity than HSL, ensuring consistent visual results.
	 */
	generateRandomThemeColor() {
		if (grSet.theme !== 'random' || grm.ui.isStreaming || grm.ui.isPlayingCD ||
			!grm.ui.getRandomThemeColorContextMenu && ($('[%GR_THEMECOLOR%]') || $('[%GR_THEMECOLOR2%]'))) {
			return;
		}

		const generateRandomColor = () => {
			let color;
			let luminance;
			let attempts = 0;

			do {
				// Hue is always fully random (0-360)
				const h = Math.random() * 360;
				let targetL;
				let targetC;

				if (grSet.styleRandomNeon) { // Neon: electric, high-vibrancy colors
					targetL = 0.55 + Math.random() * 0.15; // 0.55-0.70
					targetC = 0.20 + Math.random() * 0.15; // 0.20-0.35 (electric!)
				}
				else if (grSet.styleRandomPastel) { // Pastel: soft, creamy colors
					targetL = 0.75 + Math.random() * 0.15; // 0.75-0.90
					targetC = 0.05 + Math.random() * 0.08; // 0.05-0.13 (soft colors)
				}
				else if (grSet.styleRandomDark) { // Dark: rich, deep colors
					targetL = 0.25 + Math.random() * 0.15; // 0.25-0.40
					targetC = 0.08 + Math.random() * 0.12; // 0.08-0.20 (rich colors)
				}
				else { // General: full spectrum (covers dark, vibrant, and light)
					targetL = 0.30 + Math.random() * 0.45; // 0.30-0.75
					targetC = 0.08 + Math.random() * 0.17; // 0.08-0.25
				}

				// Gamut-aware C cap: clamp to 95% of the maximum in-gamut chroma so OKLCHtoRGB
				// never silently clips the result to a different color than intended.
				// Most important for neon mode where targetC can reach 0.35.
				const maxC = this.getMaxGamutChroma(targetL, h);
				targetC = Math.min(targetC, maxC * 0.95);

				const rgb = OKLCHtoRGB(targetL, targetC, h);
				color = new Color(rgb);
				luminance = color.luminance;
				attempts++;
			}
			while (luminance > 0.8 && attempts < 20); // Repeat if too bright, bounded to 20 attempts

			return color;
		};

		const color = generateRandomColor();
		const palette = this.createThemeColorPalette(color.val);
		this.setThemeColorPalette(palette);

		if (grCfg.settings.showDebugThemeLog) {
			console.log('Random generated color:', color.getRGB(true));
			console.log('Random color OKLCH:', `L:${color.oklchL.toFixed(2)} C:${color.oklchC.toFixed(2)} H:${color.oklchH.toFixed(0)}°`);
		}

		if (grCfg.settings.showDebugThemeOverlay) {
			grm.debug.selectedPrimaryColor = color.getRGB(true);
		}
	}

	/**
	 * Auto generates new colors depending on time interval, used in style Random theme auto color.
	 */
	generateRandomThemeAutoColor() {
		grm.ui.clearTimer('randomThemeAutoColor');

		if (grSet.styleRandomAutoColor !== 'off' && grSet.styleRandomAutoColor !== 'track') {
			grm.ui.randomThemeAutoColorTimer = setInterval(() => {
				grm.ui.initTheme();
			}, grSet.styleRandomAutoColor);
		}
		else if (grSet.styleRandomAutoColor === 'track') {
			grm.ui.initTheme();
		}

		grm.debug.debugLog('\n>>> initTheme => generateRandomThemeAutoColor <<<\n');
	}
	// #endregion

	// * PRIVATE METHODS - ALBUM ART COLOR * //
	// #region PRIVATE METHODS - ALBUM ART COLOR
	/**
	 * Adjusts a color's brightness to ensure it remains visible against the theme background.
	 * Uses OKLCH color space with binary search for precise perceptually-uniform adjustments.
	 * OKLCH's cylindrical coordinates ensure perfect hue and chroma preservation during adjustments.
	 * @param {number} color - The RGB/HEX color value to check.
	 * @param {Array} colorScheme - The raw color scheme from GetAlbumArtColors.
	 * @param {boolean} [isTwoColor] - The optional flag if this is a two-color design.
	 * @returns {Color} The adjusted Color object with optimal visibility.
	 * @private
	 */
	_applyBrightnessLimits(color, colorScheme, isTwoColor = null) {
		const ITERATIONS = 6;
		const cached = this.getCachedColor(color);
		const currentLum = cached.luminance;
		const minLum = this.getMinLuminance(colorScheme, isTwoColor);
		const maxLum = this.getMaxLuminance();

		// Fast path: Check if already in valid range
		if (currentLum <= maxLum && currentLum >= minLum) {
			return cached;
		}

		// Extract OKLCH and alpha once
		const alpha = GetAlpha(color);
		const oklch = RGBtoOKLCH(color);

		// Determine adjustment direction
		const isDarkening = currentLum > maxLum;
		const targetLum = isDarkening ? maxLum : minLum;

		// Binary search bounds in OKLCH lightness
		let low = isDarkening ? 0 : oklch.L;
		let high = isDarkening ? oklch.L : 1;
		let bestMatch = color;

		// Binary search in OKLCH space
		for (let i = 0; i < ITERATIONS; i++) {
			const testL = (low + high) / 2;

			// C and H stay constant
			const testRGB = AdjustOKLCH(color, testL, alpha);
			const testLum = this.getCachedColor(testRGB).luminance;

			// Binary search
			if (isDarkening) {
				if (testLum <= targetLum) {
					bestMatch = testRGB;
					low = testL;
				} else {
					high = testL;
				}
			} else if (testLum >= targetLum) {
				bestMatch = testRGB;
				high = testL;
			} else {
				low = testL;
			}
		}

		return this.getCachedColor(bestMatch);
	}

	/**
	 * Calculates a visual weight score for a color based on frequency, luminance, and saturation.
	 * @param {Color} col - The Color object.
	 * @param {number} freq - The color frequency (0-1).
	 * @returns {number} The final calculated weight.
	 * @private
	 */
	_calculateColorWeight(col, freq) {
		const W = this.colorWeightsConfig;
		const lum = col.luminance;
		const sat = col.saturation;
		const lumDiff = Math.abs(lum - W.LUM_TARGET);

		// FREQUENCY SCORING: Diminishes returns for dominant colors to prevent background takeover
		const freqScore =
			freq > W.FREQ_HIGH ? Math.log(freq * W.FREQ_LOG_INPUT_SCALE + 1) * W.FREQ_LOG_SCALE_HIGH :
			freq > W.FREQ_MED  ? Math.log(freq * W.FREQ_LOG_INPUT_SCALE + 1) * W.FREQ_LOG_SCALE_MED  :
			freq > W.FREQ_LOW  ? Math.log(freq * W.FREQ_LOG_INPUT_SCALE + 1) * W.FREQ_LOG_SCALE_LOW  :
			freq * (1 + freq * W.FREQ_LINEAR_BOOST);

		// LUMINANCE SCORING: Biases toward LUM_TARGET for ideal UI visibility
		const lumScore =
			lumDiff <= W.LUM_TIGHT_BAND ? W.LUM_SCORE_PEAK - (lumDiff / W.LUM_TIGHT_BAND) * W.LUM_SCORE_TIGHT_DROP :
			lumDiff <= W.LUM_WIDE_BAND  ? W.LUM_SCORE_MID  - ((lumDiff - W.LUM_TIGHT_BAND) / (W.LUM_WIDE_BAND - W.LUM_TIGHT_BAND)) * W.LUM_SCORE_MID_DROP :
			Math.max(W.LUM_SCORE_FAR    - ((lumDiff - W.LUM_WIDE_BAND) / W.LUM_FAR_DECAY) * W.LUM_SCORE_FAR_DROP, W.LUM_SCORE_MIN);

		// SATURATION SCORING: Higher multipliers for vibrant "pop" colors
		const satScore =
			sat >= W.SAT_HIGH  ? W.SAT_SCORE_HIGH_BASE  + (sat - W.SAT_HIGH)  / W.SAT_SCORE_HIGH_SCALE  :
			sat >= W.SAT_MED   ? W.SAT_SCORE_MED_BASE   + (sat - W.SAT_MED)   / W.SAT_SCORE_MED_SCALE   :
			sat >= W.SAT_LOW   ? W.SAT_SCORE_LOW_BASE   + (sat - W.SAT_LOW)   / W.SAT_SCORE_LOW_SCALE   :
			sat >= W.SAT_FLOOR ? W.SAT_SCORE_FLOOR_BASE + (sat - W.SAT_FLOOR) / W.SAT_SCORE_FLOOR_SCALE :
			sat / W.SAT_MAX;

		// VIBRANCY BONUS: Rewards colors in the "sweet spot" of both saturation and luminance
		const vibrancy =
			(sat >= W.VIBRANCY_SAT_HIGH && lum >= W.VIBRANCY_LUM_MIN  && lum <= W.VIBRANCY_LUM_MAX)  ? W.VIBRANCY_BONUS_HIGH :
			(sat >= W.VIBRANCY_SAT_MED  && lum >= W.VIBRANCY_LUM_MIN2 && lum <= W.VIBRANCY_LUM_MAX2) ? W.VIBRANCY_BONUS_MED  :
			W.VIBRANCY_BONUS_NONE;

		// EXTREME PENALTY: Aggressively filters out near-black or washed-out white
		const penalty =
			lum < W.PENALTY_DARK_CUTOFF  ? W.PENALTY_DARK_FACTOR  :
			lum > W.PENALTY_LIGHT_CUTOFF ? W.PENALTY_LIGHT_FACTOR :
			W.PENALTY_NONE;

		return freqScore * lumScore * satScore * vibrancy * penalty * W.WEIGHT_OUTPUT_SCALE;
	}

	/**
	 * Calculates the perceptual loudness weight of a hue using a dual-peak model.
	 * Two peaks: yellow-green (H≈128°) and red (H≈25°) both score 1.0; blue (H≈255°) scores the floor.
	 *
	 * Each peak's arc to the shared trough (H=255°) is normalized independently so both lobes
	 * reach HUE_LOUDNESS_FLOOR at exactly HUE_TROUGH despite different arc lengths:
	 * - reachGreen = GetCircularHueDifference(128, 255) = 127°
	 * - reachRed   = GetCircularHueDifference( 25, 255) = 130°
	 *
	 * At any hue, the score is driven by whichever peak is nearer (minimum t wins).
	 * @param {number} H - The OKLCH hue angle (0-360°).
	 * @returns {number} The loudness weight in [HUE_LOUDNESS_FLOOR, 1.0].
	 * @private
	 */
	_calcHueLoudness(H) {
		const { HUE_PEAK_GREEN, HUE_PEAK_RED, HUE_TROUGH, HUE_LOUDNESS_FLOOR } = this.satAutoConfig;
		H = ((H % 360) + 360) % 360;

		// Angular distance from H to each peak, and each peak's reach to the shared trough
		const distGreen  = GetCircularHueDifference(H, HUE_PEAK_GREEN);
		const distRed    = GetCircularHueDifference(H, HUE_PEAK_RED);
		const reachGreen = GetCircularHueDifference(HUE_PEAK_GREEN, HUE_TROUGH); // 127°
		const reachRed   = GetCircularHueDifference(HUE_PEAK_RED,   HUE_TROUGH); // 130°

		// Normalized progress toward the trough: 0 at the nearer peak, 1 at/beyond the trough.
		// Independent normalization ensures both lobes hit HUE_LOUDNESS_FLOOR at exactly HUE_TROUGH.
		const tGreen = Math.min(1, distGreen / reachGreen);
		const tRed   = Math.min(1, distRed   / reachRed);
		const t      = Math.min(tGreen, tRed); // Driven by the nearer peak

		// Raised cosine: 1.0 at either peak (t=0), HUE_LOUDNESS_FLOOR at the trough (t=1)
		return HUE_LOUDNESS_FLOOR + (1 - HUE_LOUDNESS_FLOOR) * (0.5 + 0.5 * Math.cos(t * Math.PI));
	}

	/**
	 * Calculates the lightness-based factor for perceptual loudness scoring.
	 * Mid-bright colors (L 0.50-0.85) are the harshest zone; very dark colors (L < 0.25)
	 * and very light colors (L > 0.85) are naturally less eye-straining at the same chroma.
	 * The dark zone ramps smoothly to zero - near-black colors cannot cause eye strain
	 * regardless of saturation and should contribute nothing to the loudness score.
	 * All zone transitions use cubic smoothstep interpolation, eliminating the C¹ slope
	 * discontinuities (kinks) that the original piecewise-linear version had at L = 0.25
	 * and L = 0.50. Anchor values are preserved: 0.0 at L=0, 0.30 at L=0.25, 1.0 at L=0.50-0.85, 0.30 at L=1.0.
	 * @param {number} L - The OKLCH lightness (0-1).
	 * @returns {number} The loudness factor (0.0-1.0).
	 * @private
	 */
	_calcLoudnessLightnessFactor(L) {
		if (L < 0.25) {
			// Smoothstep ramp 0 to 0.30: near-black causes no strain; C¹ smooth at both ends
			return 0.3 * SmoothstepRange(L, 0, 0.25);
		}
		if (L < 0.50) {
			// Smoothstep ramp 0.30 to 1.0: C¹ smooth join to both adjacent zones
			return 0.3 + 0.7 * SmoothstepRange(L, 0.25, 0.50);
		}
		if (L <= 0.85) {
			// Harshest zone: full weight
			return 1.0;
		}
		// Smoothstep decline 1.0 to 0.30: washed-out colors cause diminishing strain
		return Math.max(0.3, 1.0 - SmoothstepRange(L, 0.85, 1.0) * 0.7);
	}

	/**
	 * Clusters colors by hue similarity using DBSCAN-like approach.
	 * @param {Array} colors - The sorted color array.
	 * @param {number} hueThreshold - The max hue distance for same cluster (degrees).
	 * @returns {Array} The array of {representativeColor, totalFreq, colors[]}.
	 * @private
	 */
	_getClusterByHue(colors, hueThreshold) {
		const clusters = [];

		for (const c of colors) {
			let foundCluster = null;
			const col = this.getCachedColor(c.col);

			// Find existing cluster within threshold
			for (const cluster of clusters) {
				const clusterHue = cluster.representativeColor.hue;
				const hueDiff = GetCircularHueDifference(col.hue, clusterHue);

				if (hueDiff <= hueThreshold) {
					foundCluster = cluster;
					break;
				}
			}

			if (foundCluster) {
				// Add to existing cluster
				foundCluster.colors.push({ col, freq: c.freq });
				foundCluster.totalFreq += c.freq;

				// Update representative (most frequent)
				if (c.freq > foundCluster.maxFreq) {
					foundCluster.representativeColor = col;
					foundCluster.maxFreq = c.freq;
				}
			} else {
				// Create new cluster
				clusters.push({
					representativeColor: col,
					totalFreq: c.freq,
					maxFreq: c.freq,
					colors: [{ col, freq: c.freq }]
				});
			}
		}

		// Sort clusters by total frequency
		return clusters.sort((a, b) => b.totalFreq - a.totalFreq);
	}

	/**
	 * Selects the primary color from the weighted color array.
	 * @param {Array} colors - The weighted and sorted color array.
	 * @param {number} minLuminance - The minimum allowed luminance.
	 * @param {number} maxLuminance - The maximum allowed luminance.
	 * @param {boolean} isTwoColor - The flag if this is a two-color design.
	 * @returns {Color} The selected primary color.
	 * @private
	 */
	_selectPrimaryColor(colors, minLuminance, maxLuminance, isTwoColor = false) {
		const categories = {
			valid: [],
			highSat: [],   // sat >= 40
			mediumSat: [], // sat >= 25
			anyInRange: []
		};

		// Only skip dark bg if there are vibrant alternatives available
		const hasViableAlternative = isTwoColor && colors.some(c =>
			!c.isDarkBg && c.col.luminance >= minLuminance && c.col.luminance <= maxLuminance
		);

		for (const c of colors) {
			// Skip dark background only when there is something better available
			if (hasViableAlternative && c.isDarkBg) {
				if (grCfg.settings.showDebugThemeLog) {
					console.log(`_selectPrimaryColor => Skipping dark BG in two-color mode: ${c.col.getRGB(true)} lum=${c.col.luminance.toFixed(3)} freq=${(c.freq*100).toFixed(1)}%`);
				}
				continue;
			}

			const inRange = c.col.luminance >= minLuminance && c.col.luminance <= maxLuminance;

			if (!inRange) continue;

			// Colors array is already weight-sorted, so category arrays preserve weight order
			if (c.isValidPrimary) {
				categories.valid.push(c);
			}
			if (c.col.saturation >= 40 && c.freq >= 0.005) {
				categories.highSat.push(c);
			}
			if (c.col.saturation >= 25 && c.freq >= 0.005) {
				categories.mediumSat.push(c);
			}
			categories.anyInRange.push(c);
		}

		// Try each category in order (no re-sort needed, insertion order is already weight-descending)
		if (categories.valid.length > 0) {
			return categories.valid[0].col;
		}
		if (categories.highSat.length > 0) {
			return categories.highSat[0].col;
		}
		if (categories.mediumSat.length > 0) {
			return categories.mediumSat[0].col;
		}
		if (categories.anyInRange.length > 0) {
			return categories.anyInRange[0].col;
		}

		// Last resort
		const fallback = grm.colorSystem.getBrightestColor(colors, minLuminance, maxLuminance, 0.005);

		if (fallback) {
			if (grCfg.settings.showDebugThemeLog) {
				console.log('_selectPrimaryColor => Final fallback to brightest:', fallback.getRGB(true));
			}
			return fallback;
		}

		if (grCfg.settings.showDebugThemeLog) {
			console.log('_selectPrimaryColor => Ultimate fallback - using first color');
		}

		return colors[0] ? colors[0].col : this.getCachedColor(0xff000000);
	}

	/**
	 * Selects a secondary color that contrasts well with the primary color.
	 * Strategy: Complementary -> Max Contrast -> Fallback.
	 * @param {Array} colors - The weighted color objects.
	 * @param {Color} primaryColor - The primary color to contrast against.
	 * @param {number} minDistanceThreshold - The minimum color distance required.
	 * @param {number} minFrequency - The adaptive minimum frequency threshold.
	 * @param {number} minLuminance - The minimum allowed luminance.
	 * @param {number} maxLuminance - The maximum allowed luminance.
	 * @returns {Color} The selected secondary color.
	 * @private
	 */
	_selectSecondaryColor(colors, primaryColor, minDistanceThreshold, minFrequency, minLuminance, maxLuminance) {
		const minDistSq = minDistanceThreshold * minDistanceThreshold;

		const candidates = colors.filter(c => {
			const distSq = ColorDistanceSq(primaryColor, c.col);
			const meetsFreq = c.freq >= minFrequency * 0.5;
			const inLumRange = c.col.luminance >= minLuminance && c.col.luminance <= maxLuminance;
			return distSq >= minDistSq && meetsFreq && inLumRange;
		});

		if (candidates.length === 0) {
			if (grCfg.settings.showDebugThemeLog) {
				console.log('_selectSecondaryColor => No candidates found, using fallback');
			}

			const relaxedCandidates = colors.filter(c => {
				const distSq = ColorDistanceSq(primaryColor, c.col);
				const inLumRange = c.col.luminance >= minLuminance && c.col.luminance <= maxLuminance;
				return distSq >= minDistSq * 0.5 && inLumRange;
			});

			if (relaxedCandidates.length > 0) {
				relaxedCandidates.sort((a, b) => b.weight - a.weight);
				return relaxedCandidates[0].col;
			}

			return colors[1] ? colors[1].col : primaryColor;
		}

		let selectedColor = this.getHarmoniousColor(candidates, primaryColor);

		if (!selectedColor) {
			selectedColor = this.getMaxContrastColor(candidates, primaryColor);
		}

		if (selectedColor.luminance < minLuminance || selectedColor.luminance > maxLuminance) {
			const fallback = grm.colorSystem.getBrightestColor(colors, minLuminance, maxLuminance, minFrequency * 0.5);

			if (fallback) {
				const distSq = ColorDistanceSq(primaryColor, fallback);
				const isDistinctEnough = candidates.length === 0 || distSq >= minDistSq * 0.75;

				if (isDistinctEnough) {
					selectedColor = fallback;
					if (grCfg.settings.showDebugThemeLog) {
						console.log('_selectSecondaryColor => Using fallback (luminance out of range)');
					}
				}
			}
		}

		return selectedColor;
	}
	// #endregion

	// * PUBLIC METHODS - ALBUM ART * //
	// #region PUBLIC METHODS - ALBUM ART
	/**
	 * Gets album art weighted color scheme from the cached image color extraction.
	 * @param {Array} colorScheme - The raw color scheme from GetAlbumArtColors.
	 * @param {number} minFrequency - The minimum frequency threshold for valid primary colors.
	 * @param {number} minLuminance - The minimum luminance threshold for valid primary colors.
	 * @param {number} maxLuminance - The maximum luminance threshold for valid primary colors.
	 * @param {boolean} isTwoColor - The flag if this is a two-color design.
	 * @returns {Array} The array of color objects with weight and validity metadata.
	 */
	getAlbumArtWeightedColors(colorScheme, minFrequency, minLuminance, maxLuminance, isTwoColor = false) {
		if (!colorScheme || colorScheme.length === 0) return [];

		// True if color is a skippable dark background in two-color design
		const isDarkBgInTwoColor = (col, freq) => isTwoColor && col.luminance < 0.015 && freq > 0.40;

		const processed = colorScheme.map(c => {
			const col = this.getCachedColor(c.col);
			const weight = this._calculateColorWeight(col, c.freq);
			const isInLumRange = col.luminance >= minLuminance && col.luminance <= maxLuminance;
			const isDarkBg = isDarkBgInTwoColor(col, c.freq);
			const isValidPrimary = isInLumRange && !isDarkBg && c.freq >= minFrequency && !col.isCloseToGrayscale;

			return { col, freq: c.freq, weight, isInLumRange, isValidPrimary, isDarkBg };
		});

		if (grCfg.settings.showDebugThemeLog) {
			grm.debug.logAlbumArtColors(processed, minFrequency);
		}

		return processed;
	}

	/**
	 * Extracts the primary and secondary optional color from an image.
	 * @param {GdiBitmap} image - The image to extract the colors from.
	 * @param {Array} colorCache - The cache array for this image source.
	 * @param {boolean} [secondaryColor] - The optional flag to also return a secondary color.
	 * @returns {{primary: number, secondary?: number, colorScheme: Array}|null} The object containing color values or null on error.
	 */
	getAlbumArtThemeColors(image, colorCache, secondaryColor = false) {
		const colorScheme = GetAlbumArtColors(image, colorCache);

		if (!colorScheme || colorScheme.length === 0) return null;

		const isTwoColor = this.isAlbumArtTwoColored(colorScheme);
		const minDistance = 100;
		const minFrequency = this.getAdaptiveMinFrequency(colorScheme);
		const minLuminance = this.getMinLuminance(colorScheme, isTwoColor);
		const maxLuminance = this.getMaxLuminance();
		const colors = this.getAlbumArtWeightedColors(colorScheme, minFrequency, minLuminance, maxLuminance, isTwoColor);

		if (colors.length === 0) return null;

		colors.sort((a, b) => b.weight - a.weight);

		const paletteColor = this.selectAlbumArtPaletteColor(colors, grSet.albumArtColorPalette);
		const primary = paletteColor || this._selectPrimaryColor(colors, minLuminance, maxLuminance, isTwoColor);
		const secondary = secondaryColor ? this._selectSecondaryColor(
			colors, primary, minDistance, minFrequency, minLuminance, maxLuminance,
		) : null;

		if (grCfg.settings.showDebugThemeLog) {
			const maxFreq = Math.max(...colorScheme.map(c => c.freq));
			console.log(`Adaptive minFreq: ${minFrequency} (max color freq: ${(maxFreq * 100).toFixed(1)}%)`);
			isTwoColor && console.log(`${Unicode.ArtistPalette} Two-color design mode active`);
			console.log('Primary:', primary.getRGB(true), `| Lum:${primary.luminance.toFixed(3)} Sat:${primary.saturation} Hue:${primary.hue.toFixed(0)}°`);

			if (paletteColor) {
				console.log(`albumArtColorPalette (${grSet.albumArtColorPalette}) => picked ${primary.getRGB(true)} over default`);
			}

			if (secondaryColor && secondary) {
				console.log('Secondary:', secondary.getRGB(true), `| Lum:${secondary.luminance.toFixed(3)} Sat:${secondary.saturation} Hue:${secondary.hue.toFixed(0)}°`);
			}
		}

		if (grCfg.settings.showDebugThemeOverlay) {
			grm.debug.selectedPrimaryColor = primary.getRGB(true);
			if (secondaryColor && secondary) grm.debug.selectedSecondaryColor = secondary.getRGB(true);
		}

		return { primary: primary.val, secondary: secondary && secondary.val, colorScheme };
	}

	/**
	 * Sets the primary or secondary color from `getAlbumArtThemeColors` or from custom `GR-tag`.
	 * @param {GdiBitmap} image - The image from which the colors will be picked.
	 * @param {Array} colorCache - The cache array for this image source.
	 */
	setAlbumArtThemeColors(image, colorCache) {
		this.colorCache.clear();

		let colPrimaryVal;
		let colSecondaryVal;
		let colorScheme;

		const overridePrimary = $('[%GR_THEMECOLOR%]');
		const overrideSecondary = $('[%GR_THEMECOLOR2%]');
		const rebornFusion = this.isRebornFusion();

		if (overridePrimary.length) {
			colPrimaryVal = ColStringToRGB(overridePrimary);
			colSecondaryVal = overrideSecondary.length ? ColStringToRGB(overrideSecondary) : undefined;
			colorScheme = GetAlbumArtColors(image, colorCache);
		} else {
			const colors = this.getAlbumArtThemeColors(image, colorCache, rebornFusion);
			if (!colors) return;

			colPrimaryVal = colors.primary;
			colSecondaryVal = colors.secondary;
			colorScheme = colors.colorScheme;
		}

		if (isNaN(colPrimaryVal)) return;

		// Track raw primary and secondary color
		grCol.primary_raw = colPrimaryVal;
		grCol.secondary_raw = colSecondaryVal !== undefined ? colSecondaryVal : undefined;
		grm.colorChameleon.setAlbumArtPaletteColors(colorScheme, true);

		const isTwoColor = this.isAlbumArtTwoColored(colorScheme);

		// Process colors with adaptive brightness limits
		const primaryColor = this._applyBrightnessLimits(colPrimaryVal, colorScheme, isTwoColor);
		const secondaryColor = rebornFusion && colSecondaryVal !== undefined ?
			this._applyBrightnessLimits(colSecondaryVal, colorScheme, isTwoColor) : null;

		// Apply saturation limiter if active
		const finalPrimary = this.applyColorSaturation(primaryColor.val, grSet.albumArtColorSaturation);
		const finalSecondary = secondaryColor ? this.applyColorSaturation(secondaryColor.val, grSet.albumArtColorSaturation) : null;

		// Apply theme colors
		const palette = rebornFusion && finalSecondary
			? this.createThemeColorPalette(finalPrimary, finalSecondary)
			: this.createThemeColorPalette(finalPrimary);

		this.setThemeColorPalette(palette);

		if (grCfg.settings.showDebugThemeLog) {
			grm.debug.debugLog('setAlbumArtThemeColors => Final Primary luminance:', primaryColor.luminance.toFixed(3));
			secondaryColor && grm.debug.debugLog('setAlbumArtThemeColors => Final Secondary luminance:', secondaryColor.luminance.toFixed(3));

			if (grSet.albumArtColorSaturation === 'auto') {
				const nightFactor = this.getNighttimeFactor();
				const scheduleFactor = grm.day.getEyeProtectionScheduleFactor(grSet.albumArtColorSaturationEyeSchedule);
				const primaryOKLCH = RGBtoOKLCH(primaryColor.val);
				const finalOKLCH = RGBtoOKLCH(finalPrimary);
				grm.debug.debugLog(`Color saturation (auto, schedule=${(scheduleFactor * 100).toFixed(0)}%, night=${(nightFactor * 100).toFixed(0)}%) => Primary C: ${primaryOKLCH.C.toFixed(3)} => ${finalOKLCH.C.toFixed(3)}`);
			}
			else if (grSet.albumArtColorSaturation !== 100) {
				const primaryOKLCH = RGBtoOKLCH(primaryColor.val);
				const finalOKLCH = RGBtoOKLCH(finalPrimary);
				grm.debug.debugLog(`Color saturation (${grSet.albumArtColorSaturation}%) => Primary C: ${primaryOKLCH.C.toFixed(3)} => ${finalOKLCH.C.toFixed(3)}`);
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS - ALBUM ART UTILITIES * //
	// #region PUBLIC METHODS - ALBUM ART UTILITIES
	/**
	 * Applies a color saturation scaling to a color in OKLCH space.
	 * 'auto' = selective eye protection (only loud hues reduced, schedule factor is smoothly ramped),
	 * 100    = full vividness (no effect),
	 * 0-99   = uniform chroma scaling.
	 * @param {number} color - The RGB color value.
	 * @param {number|string} saturation - The saturation value.
	 * @returns {number} The adjusted RGB color value.
	 */
	applyColorSaturation(color, saturation) {
		if (saturation === 100) return color;

		if (saturation === 'auto') {
			const scheduleFactor = grm.day.getEyeProtectionScheduleFactor(grSet.albumArtColorSaturationEyeSchedule);
			if (scheduleFactor <= 0) return color;
			return this.applyColorSaturationAuto(color, scheduleFactor);
		}

		const factor = saturation / 100;
		return AdjustChromaOKLCH(color, factor);
	}

	/**
	 * Applies automatic selective chroma reduction to perceptually "loud" colors only.
	 * Routine album art colors are completely untouched; only neon/electric tones that
	 * exceed the perceptual loudness threshold receive a progressive reduction.
	 *
	 * The loudness score = chromaExcess × hueLoudness × lightFactor.
	 * - chromaExcess:  how far the color's chroma exceeds CHROMA_BASE, normalized to CHROMA_RANGE.
	 * - hueLoudness:   dual-peak model. Red (H≈25°) and yellow-green (H≈128°) both score ~1.0; blue (H≈255°) scores the floor. See _calcHueLoudness.
	 * - lightFactor:   zero for near-black, full weight in the mid-bright zone (L 0.50-0.85). See _calcLoudnessLightnessFactor.
	 *
	 * NIGHT BOOST: threshold, fullCorrect, and maxCut are smoothly blended between daytime and
	 * nighttime values based on getNighttimeFactor() - wall-clock-only, independent of
	 * albumArtColorSaturationEyeSchedule. A '0-24' (always-on) schedule still benefits from the boost.
	 * The night boost itself can be disabled independently via grSet.albumArtColorSaturationEyeNightCor
	 * (default: true) - for users who keep a light on at night, where the room isn't actually dark despite
	 * the wall-clock hour. When off, getNighttimeFactor() always returns 0.0 and the algorithm behaves
	 * identically around the clock within its active schedule window.
	 *
	 * Colors with loudness ≤ threshold:   returned completely unchanged.
	 * Colors with loudness in (threshold, fullCorrect]:  progressive smoothstep correction.
	 * Colors with loudness > fullCorrect: full correction (blendFactor = 1).
	 *
	 * targetC is the exact chroma that would produce loudness = threshold at the color's current
	 * hue/lightness. Proof that targetC < C whenever loudness > threshold:
	 * - loudness > threshold
	 * - (C − BASE)/RANGE × hf × lf > threshold
	 * - C > BASE + (threshold / (hf × lf)) × RANGE = targetC  ∎
	 *
	 * @param {number} color - The RGB color value (packed integer).
	 * @param {number} [scheduleFactor] - The smooth eye-protection intensity from
	 * {@link ThemeDayNight#getEyeProtectionScheduleFactor} (0.0-1.0, default 1.0).
	 * 1.0 = full correction (schedule window fully active or always-on).
	 * 0 < factor < 1 = partial correction during the boundary ramp.
	 * The caller guarantees factor > 0; the <= 0 case is short-circuited in
	 * {@link ColorManager#applyColorSaturation} before this method is reached.
	* @returns {number} The adjusted RGB color value, unchanged if below threshold.
	 */
	applyColorSaturationAuto(color, scheduleFactor = 1.0) {
		const alpha = GetAlpha(color);
		const oklch = RGBtoOKLCH(color);

		const { L, C, H } = oklch;
		const {
			CHROMA_BASE, CHROMA_RANGE, THRESHOLD, FULL_CORRECT_AT, MAX_CUT, MAX_ABSOLUTE_CUT,
			NIGHT_FLOOR_CHROMA_RATIO, NIGHT_THRESHOLD_MULTIPLIER, NIGHT_FULLCORRECT_MULTIPLIER, NIGHT_MAXCUT_MULTIPLIER
		} = this.satAutoConfig;

		// * Fast path: C at or below CHROMA_BASE always produces loudness ≤ 0, regardless of night boost.
		if (C <= CHROMA_BASE) return color;

		// * Blend daytime/nighttime parameters via wall-clock factor.
		const nightFactor = this.getNighttimeFactor();
		let threshold   = THRESHOLD;
		let fullCorrect = FULL_CORRECT_AT;
		let maxCut      = MAX_CUT;

		if (nightFactor > 0) {
			const nightThreshold   = THRESHOLD * NIGHT_THRESHOLD_MULTIPLIER;
			const nightFullCorrect = FULL_CORRECT_AT * NIGHT_FULLCORRECT_MULTIPLIER;
			const nightMaxCut      = Math.min(MAX_ABSOLUTE_CUT, MAX_CUT * NIGHT_MAXCUT_MULTIPLIER);

			threshold   = Lerp(THRESHOLD, nightThreshold, nightFactor);
			fullCorrect = Lerp(FULL_CORRECT_AT, nightFullCorrect, nightFactor);
			maxCut      = Lerp(MAX_CUT, nightMaxCut, nightFactor);
		}

		const chromaExcess = (C - CHROMA_BASE) / CHROMA_RANGE;
		const hueFactor    = this._calcHueLoudness(H);
		const lightFactor  = this._calcLoudnessLightnessFactor(L);
		const loudness     = chromaExcess * hueFactor * lightFactor;

		if (loudness <= threshold) return color;

		const denominator = hueFactor * lightFactor;
		if (denominator <= 0) return color;
		const targetC = CHROMA_BASE + (threshold / denominator) * CHROMA_RANGE;

		// Cubic smoothstep blend: 0% correction at threshold = 100% at fullCorrect = full beyond.
		const correctionRange = fullCorrect - threshold;
		const blendFactor = correctionRange <= 0 ? 1 : SmoothstepRange(loudness, threshold, fullCorrect);
		const blendedC = Lerp(C, targetC, blendFactor);

		// Math.min: ensures the night step only ever reduces chroma, never raises it
		// (rawNightC can theoretically exceed blendedC for near-gamut-limit colors at low nightFactor)
		const rawNightC = Lerp(blendedC, C * (1 - maxCut), nightFactor * blendFactor);
		const newC = Math.max(CHROMA_BASE * NIGHT_FLOOR_CHROMA_RATIO, Math.min(blendedC, rawNightC));

		// Apply schedule factor: smoothly scales the overall correction strength.
		// scheduleFactor=1 = full night+loudness correction; <1 = partial (ramp-in/out at boundary).
		// The caller already gates scheduleFactor <= 0, so this lerp always has factor > 0.
		const finalC = Lerp(C, newC, scheduleFactor);

		return (OKLCHtoRGB(L, finalC, H) & 0x00FFFFFF) | (alpha << 24);
	}

	/**
	 * Calculates an adaptive minimum frequency threshold based on color distribution.
	 * If one color dominates >70%, lower the threshold to allow accent colors through.
	 * @param {Array} colorScheme - The raw color scheme from GetAlbumArtColors.
	 * @returns {number} The adaptive minimum frequency threshold.
	 */
	getAdaptiveMinFrequency(colorScheme) {
		const {
			DOMINANT_THRESHOLD, MODERATE_THRESHOLD, FREQ_MIN_DOMINANT, FREQ_MIN_MODERATE, FREQ_MIN_BALANCED
		} = this.minFreqConfig;

		if (!colorScheme || colorScheme.length === 0) {
			return FREQ_MIN_BALANCED;
		}

		const maxFreq = Math.max(...colorScheme.map(c => c.freq));

		return (
			maxFreq > DOMINANT_THRESHOLD ? FREQ_MIN_DOMINANT :
			maxFreq > MODERATE_THRESHOLD ? FREQ_MIN_MODERATE :
										   FREQ_MIN_BALANCED
		);
	}

	/**
	 * Binary-searches for the maximum in-gamut OKLCH chroma at a given lightness and hue.
	 * OKLCHtoRGB silently clamps out-of-gamut coordinates; clamping is detected by round-tripping
	 * through RGBtoOKLCH and comparing the recovered chroma against the probed value.
	 * @param {number} L - The OKLCH lightness (0-1).
	 * @param {number} H - The OKLCH hue angle (0-360°).
	 * @param {number} [maxSearch] - The upper chroma bound for the binary search (default: 0.40).
	 * @returns {number} The largest chroma that survives the round-trip within a 0.005 tolerance.
	 */
	getMaxGamutChroma(L, H, maxSearch = 0.40) {
		let lo = 0;
		let hi = maxSearch;

		for (let i = 0; i < 8; i++) {
			const mid = (lo + hi) / 2;
			const rgb = OKLCHtoRGB(L, mid, H);
			const rt  = RGBtoOKLCH(rgb);

			// If the round-tripped chroma matches what we asked for, mid is in gamut
			if (Math.abs(rt.C - mid) < 0.005) {
				lo = mid;
			} else {
				hi = mid;
			}
		}

		return lo;
	}

	/**
	 * Gets the maximum luminance threshold based on active theme and style.
	 * @returns {number} The maximum luminance threshold.
	 */
	getMaxLuminance() {
		const maximum = (
			grSet.theme === 'black' || grSet.styleBlend ||
			(['reborn', 'random'].includes(grSet.theme) && grSet.styleBlend2)
		);

		return maximum ? 1.0 : 0.90;
	}

	/**
	 * Gets the minimum luminance threshold based on album art color distribution.
	 * Allows darker colors for 2-color designs to preserve artistic intent.
	 * @param {Array} colorScheme - The raw color scheme from GetAlbumArtColors.
	 * @returns {number} The minimum luminance threshold.
	 */
	getMinLuminance(colorScheme, isTwoColor = null) {
		const twoColor = isTwoColor !== null ? isTwoColor : this.isAlbumArtTwoColored(colorScheme);
		return twoColor ? 0.001 : 0.01;
	}

	/**
	 * Computes a smooth night-time intensity factor [0.0 = full day, 1.0 = deep night]
	 * derived entirely from the wall clock, completely independent of the eye-protection schedule.
	 *
	 * Uses an elapsed-time coordinate system re-based on NIGHT_START_HOUR so that midnight
	 * wrapping is handled correctly for any configuration, including NIGHT_START_HOUR < TRANSITION_HOURS.
	 * elapsed=0 is the start of deep night; elapsed increments until the next NIGHT_START_HOUR.
	 *
	 * Default timing (NIGHT_START_HOUR=20, NIGHT_END_HOUR=7, TRANSITION_HOURS=2):
	 * - elapsed range  wall clock        factor
	 * - [0,  11)       20:00-07:00       1.0  (deep night, wraps midnight)
	 * - [11, 13)       07:00-09:00       1→0  (ramp-out)
	 * - [13, 22)       09:00-18:00       0.0  (daytime)
	 * - [22, 24)       18:00-20:00       0→1  (ramp-in)
	 *
	 * All transitions use cubic smoothstep to eliminate visible color pops at dawn and dusk.
	 * @returns {number} The night intensity factor in [0.0, 1.0].
	 */
	getNighttimeFactor() {
		if (!grSet.albumArtColorSaturationEyeNightCor) return 0.0;

		const { NIGHT_START_HOUR, NIGHT_END_HOUR, TRANSITION_HOURS } = this.satAutoConfig;
		const now = new Date();
		const hour = now.getHours() + now.getMinutes() / 60; // Decimal hours for sub-hour smoothness

		const nightDuration = (NIGHT_END_HOUR - NIGHT_START_HOUR + 24) % 24;
		const elapsed = (hour - NIGHT_START_HOUR + 24) % 24;

		// * Deep night: elapsed ∈ [0, nightDuration)
		if (elapsed < nightDuration) return 1.0;

		// * Ramp-out: gradual return to day after deep night ends
		const rampOutEdge = Math.min(nightDuration + TRANSITION_HOURS, 24);
		if (elapsed < rampOutEdge) {
			return 1 - SmoothstepRange(elapsed, nightDuration, rampOutEdge);
		}

		// * Ramp-in: gradual approach to night in the window immediately before NIGHT_START_HOUR
		const rampInStart = Math.max(nightDuration + TRANSITION_HOURS, 24 - TRANSITION_HOURS);
		if (elapsed >= rampInStart) {
			const effectiveTransition = 24 - rampInStart;
			if (effectiveTransition <= 0) return 0.0;
			return SmoothstepRange(elapsed, rampInStart, 24);
		}

		// * Pure daytime
		return 0.0;
	}

	/**
	 * Estimates the perceptual color contrast in the current album art.
	 * Prefers grCol.secondary when it was actually extracted (differs from primary);
	 * otherwise reads the top-2 frequency colors directly from the raw color cache.
	 * This avoids the stale-secondary problem where grCol.secondary reflects the
	 * previous track's extraction (only done when a fusion preset is active).
	 * @returns {number} The OKLAB distance (0 = monochrome, >0.28 = two clearly distinct colors).
	 */
	getAlbumArtColorContrast() {
		if (grCol.secondary !== grCol.primary) {
			return OKLABColorDistance(grCol.primary, grCol.secondary);
		}

		const cache = grm.ui.cachedAlbumArtColors;
		if (!cache || cache.length < 2) return 0;

		return OKLABColorDistance(cache[0].col, cache[1].col);
	}

	/**
	 * Creates an analogous color harmony (adjacent colors on wheel) using OKLCH.
	 * Returns an array of colors that work well together.
	 * @param {number} color - The base RGB color.
	 * @param {number} [angle] - The optional Hue rotation angle (default: 30 degrees).
	 * @returns {number[]} The array of [color1, baseColor, color2].
	 */
	getAnalogousColors(color, angle = 30) {
		const oklch = RGBtoOKLCH(color);

		const hue1 = (oklch.H - angle + 360) % 360;
		const hue2 = (oklch.H + angle) % 360;

		return [
			OKLCHtoRGB(oklch.L, oklch.C, hue1),
			color,
			OKLCHtoRGB(oklch.L, oklch.C, hue2)
		];
	}

	/**
	 * Creates a complementary color (opposite on color wheel) using OKLCH.
	 * Useful for creating accent colors that contrast well with the primary.
	 * @param {number} color - The base RGB color.
	 * @param {boolean} [adjustLightness] - The optional flag to adjust lightness for better contrast.
	 * @returns {number} The complementary RGB color.
	 */
	getComplementaryColor(color, adjustLightness = true) {
		const oklch = RGBtoOKLCH(color);

		// Rotate hue by 180 degrees for complementary
		const compHue = (oklch.H + 180) % 360;
		// Optionally adjust lightness for better contrast
		let compL = oklch.L;

		if (adjustLightness) {
			compL = oklch.L > 0.5 ? oklch.L * 0.7 : oklch.L * 1.3;
			compL = Math.max(0, Math.min(1, compL));
		}

		return OKLCHtoRGB(compL, oklch.C, compHue);
	}

	/**
	 * Finds a color that forms a harmonious relationship with the primary color.
	 * Uses OKLCH hue for perceptually accurate color wheel relationships.
	 * @param {Array} candidates - The array of candidate colors.
	 * @param {Color} primaryColor - The primary color to harmonize with.
	 * @returns {Color|null} The harmonious color or null if none found.
	 */
	getHarmoniousColor(candidates, primaryColor) {
		const primaryOKLCH = RGBtoOKLCH(primaryColor.val);

		const scoredCandidates = candidates.map(c => {
			const candOKLCH = RGBtoOKLCH(c.col.val);
			const hueDiff = Math.abs(candOKLCH.H - primaryOKLCH.H);
			const circularHueDiff = Math.min(hueDiff, 360 - hueDiff);

			let harmonyScore = 0;

			// Complementary - 150-210° opposite
			if (circularHueDiff >= 150 && circularHueDiff <= 210) {
				harmonyScore = 1.0;
			}
			// Triadic - 120° separation
			else if (Math.abs(circularHueDiff - 120) <= 15 || Math.abs(circularHueDiff - 240) <= 15) {
				harmonyScore = 0.85;
			}
			// Split-complementary
			else if ((circularHueDiff >= 140 && circularHueDiff < 150) || (circularHueDiff > 210 && circularHueDiff <= 220)) {
				harmonyScore = 0.75;
			}
			// Analogous - adjacent hues
			else if (circularHueDiff >= 25 && circularHueDiff <= 60) {
				harmonyScore = 0.5;
			}

			// Check for distinct luminance
			const l1 = c.col.luminance + 0.05;
			const l2 = primaryColor.luminance + 0.05;
			const hasDistinctLuminance = (l1 / l2) > 1.25 || (l2 / l1) > 1.25;
			const hasChroma = candOKLCH.C > 0.03;

			if (!hasChroma || !hasDistinctLuminance) {
				harmonyScore *= 0.6;
			}

			const perceptualDist = OKLABColorDistance(primaryColor.val, c.col.val);
			const chromaBonus = candOKLCH.C / 0.25; // 0.25 is typical max chroma

			return {
				...c,
				harmonyType:
					harmonyScore >= 0.85 ? 'complementary' :
					harmonyScore >= 0.70 ? 'triadic' :
					harmonyScore >= 0.45 ? 'analogous' : 'contrast',
				score: harmonyScore * perceptualDist * chromaBonus
			};
		});

		const validCandidates = scoredCandidates.filter(c => c.score > 0);

		if (validCandidates.length === 0) return null;

		validCandidates.sort((a, b) => b.score - a.score);
		const selected = validCandidates[0];

		if (grCfg.settings.showDebugThemeLog) {
			const selectedOKLCH = RGBtoOKLCH(selected.col.val);
			const hueDiff = Math.abs(selectedOKLCH.H - primaryOKLCH.H);
			const circularHueDiff = Math.min(hueDiff, 360 - hueDiff);
			console.log(`getHarmoniousColor => Secondary: ${selected.harmonyType} (Δhue: ${circularHueDiff.toFixed(0)}°, score: ${selected.score.toFixed(2)})`);
		}

		return selected.col;
	}

	/**
	 * Finds the color with maximum perceptual contrast to the primary color.
	 * Uses OKLCH color distance for perceptually accurate contrast measurement.
	 * @param {Array} candidates - The array of candidate colors.
	 * @param {Color} primaryColor - The primary color to contrast against.
	 * @returns {Color} The color with maximum contrast score.
	 */
	getMaxContrastColor(candidates, primaryColor) {
		const primaryOKLCH = RGBtoOKLCH(primaryColor.val);

		const scored = candidates.map(c => {
			const candOKLCH = RGBtoOKLCH(c.col.val);
			const perceptualDist = OKLABColorDistance(primaryColor.val, c.col.val);
			const chromaBonus = Math.max(candOKLCH.C / 0.25, 0.5);
			const grayBoost = primaryOKLCH.C < 0.01 && candOKLCH.C > 0.08 ? 1.8 : 1.0;
			const score = Math.log(perceptualDist + 1) * c.freq * chromaBonus * grayBoost;
			return { ...c, score };
		});

		scored.sort((a, b) => b.score - a.score);

		if (grCfg.settings.showDebugThemeLog) {
			console.log('getMaxContrastColor => Secondary: Max Perceptual Contrast');
		}

		return scored[0].col;
	}

	/**
	 * Selects a secondary color from a pre-built weighted palette, contrasting with the given primary.
	 * @param {Color} primaryColorObj - The primary Color object (from getCachedColor).
	 * @param {Array} weightedCandidates - The weighted color array stored from _buildPalette.
	 * @returns {Color|null} The selected secondary Color, or null if selection fails.
	 */
	getSecondaryFromPalette(primaryColorObj, weightedCandidates) {
		if (!weightedCandidates || weightedCandidates.length < 2) {
			return null;
		}

		const others = weightedCandidates.filter(c => c.col.val !== primaryColorObj.val);
		if (others.length === 0) return null;

		const minLum = this.getMinLuminance([]);
		const maxLum = this.getMaxLuminance();

		return this._selectSecondaryColor(others, primaryColorObj, 100, 0, minLum, maxLum);
	}

	/**
	 * Creates a triadic color harmony (evenly spaced on wheel) using OKLCH.
	 * Perfect for creating vibrant, balanced color schemes.
	 * @param {number} color - The base RGB color.
	 * @returns {number[]} The array of [baseColor, color2, color3].
	 */
	getTriadicColors(color) {
		const oklch = RGBtoOKLCH(color);
		const hue2 = (oklch.H + 120) % 360;
		const hue3 = (oklch.H + 240) % 360;

		return [
			color,
			OKLCHtoRGB(oklch.L, oklch.C, hue2),
			OKLCHtoRGB(oklch.L, oklch.C, hue3)
		];
	}

	/**
	 * Detects if an album cover has a simple 2-color design that warrants allowing very dark colors.
	 * Groups similar hues to avoid false negatives from shade variations.
	 * @param {Array} scheme - The raw color scheme from GetAlbumArtColors.
	 * @returns {boolean} True if two-color design.
	 */
	isAlbumArtTwoColored(scheme) {
		if (!scheme || scheme.length < 2) return false;

		const {
			DOMINANT_THRESHOLD, BALANCED_MIN, BALANCED_TOTAL, HUE_CLUSTER_THRESHOLD, MIN_ACCENT_FREQ, LUM_SPREAD_GRADIENT_THRESHOLD
		} = this.twoColorConfig;

		const sorted = [...scheme].sort((a, b) => b.freq - a.freq);
		const clusters = this._getClusterByHue(sorted, HUE_CLUSTER_THRESHOLD);

		if (clusters.length < 2) return false;

		const clusterFreq1 = clusters[0].totalFreq;
		const clusterFreq2 = clusters[1].totalFreq;
		const clusterFreq3 = clusters[2] ? clusters[2].totalFreq : 0;
		const clusterFreqTop3 = clusterFreq1 + clusterFreq2 + clusterFreq3;

		// Detect gradient/photographic images: dominant cluster spans a wide luminance range
		const dominantLums = clusters[0].colors.map(c => c.col.luminance);
		const lumSpread = Math.max(...dominantLums) - Math.min(...dominantLums);
		const isGradientLike = lumSpread > LUM_SPREAD_GRADIENT_THRESHOLD;

		const case1 = // Dominant cluster + accent
			clusterFreq1 > DOMINANT_THRESHOLD &&
			clusterFreq2 > MIN_ACCENT_FREQ &&
			!isGradientLike;

		const case2 = // Two balanced clusters - must actually be only 2
			clusters.length === 2 &&
			clusterFreq1 > BALANCED_MIN &&
			clusterFreq2 > BALANCED_MIN &&
			clusterFreq1 + clusterFreq2 > BALANCED_TOTAL;

		const case3 = // Three clusters = two visual colors
			clusters.length === 3 &&
			clusterFreqTop3 > BALANCED_TOTAL &&
			clusters[2].totalFreq > MIN_ACCENT_FREQ;

		const qualifies = case1 || case2 || case3;

		if (grCfg.settings.showDebugThemeLog && qualifies) {
			const freq1 = (clusterFreq1 * 100).toFixed(1);
			const freq2 = (clusterFreq2 * 100).toFixed(1);
			console.log(`${Unicode.ArtistPalette} Two-color design: ${clusters.length} hue clusters, top2 = ${freq1}% + ${freq2}%`);
		}

		return qualifies;
	}

	/**
	 * Selects a primary color from the weighted palette based on a color-theory relationship mode.
	 * Stateless single-pick operation: uses the top-weighted valid color as the hue reference,
	 * then returns the candidate whose hue best satisfies the requested relationship.
	 *
	 * Unlike the ChameleonColorSystem palette-cycle selectors (which advance a persistent index),
	 * this method makes exactly one selection per call with no side-effects.
	 *
	 * Available modes:
	 * `auto`: null (fall through to the default weighted algorithm).
	 * `monochromatic`: closest hue to the reference color.
	 * `analogous`: smallest strictly-clockwise hue offset from the reference.
	 * `splitComplementary`: closest hue to (H+150°) or (H+210°).
	 * `complementary`: closest hue to (H+180°).
	 * `triadic`: closest hue to (H+120°) or (H+240°).
	 * `tetradic`: closest hue to (H+90°) or (H+270°).
	 * `distinct`: first candidate exceeding OKLAB distance 0.15 from the reference.
	 * `random`: uniformly random pick from all valid candidates.
	 *
	 * @param {Array} weightedColors - The weighted/sorted color objects from getAlbumArtWeightedColors.
	 * @param {string} mode - The selection mode string (grSet.albumArtColorPalette).
	 * @returns {Color|null} The selected Color object, or null to fall through to the default algorithm.
	 */
	selectAlbumArtPaletteColor(weightedColors, mode) {
		if (!weightedColors || weightedColors.length < 2 || !mode || mode === 'auto') {
			return null;
		}

		const valid = weightedColors.filter(c => c.isValidPrimary);
		if (valid.length < 2) return null;

		const reference = valid[0].col;
		const refHue = RGBtoOKLCH(reference.val).H;
		const rest = valid.slice(1);
		const restHues  = rest.map(c => RGBtoOKLCH(c.col.val).H);

		/** Returns the rest-color whose hue minimizes getDiff. */
		const pickBest = (getDiff) => {
			let best = 0;
			let bestDiff = Infinity;

			for (let i = 0; i < rest.length; i++) {
				const diff = getDiff(restHues[i]);
				if (diff < bestDiff) { bestDiff = diff; best = i; }
			}

			return rest[best].col;
		};

		switch (mode) {
			case 'monochromatic': { // Closest hue to reference (stays in the same color family)
				return pickBest(h => GetCircularHueDifference(h, refHue));
			}

			case 'analogous': { // Smallest strictly-clockwise offset (smooth hue drift)
				return pickBest(h => (h - refHue + 360) % 360);
			}

			case 'splitComplementary': { // Nearest to H+150° or H+210°
				const h150 = (refHue + 150) % 360;
				const h210 = (refHue + 210) % 360;
				return pickBest(h => Math.min(
					GetCircularHueDifference(h, h150), GetCircularHueDifference(h, h210)
				));
			}

			case 'complementary': { // Nearest to H+180°
				const compHue = (refHue + 180) % 360;
				return pickBest(h => GetCircularHueDifference(h, compHue));
			}

			case 'triadic': { // Nearest to H+120° or H+240°
				const h120 = (refHue + 120) % 360;
				const h240 = (refHue + 240) % 360;
				return pickBest(h => Math.min(
					GetCircularHueDifference(h, h120), GetCircularHueDifference(h, h240)
				));
			}

			case 'tetradic': { // Nearest to H+90° or H+270°
				const h90 = (refHue + 90) % 360;
				const h270 = (refHue + 270) % 360;
				return pickBest(h => Math.min(
					GetCircularHueDifference(h, h90), GetCircularHueDifference(h, h270)
				));
			}

			case 'distinct': { // First candidate exceeding OKLAB perceptual distance threshold
				const MIN_OKLAB_DIST = 0.15;
				for (const c of rest) {
					if (OKLABColorDistance(reference.val, c.col.val) >= MIN_OKLAB_DIST) {
						return c.col;
					}
				}
				return rest.length > 0 ? rest[0].col : reference;
			}

			case 'random': { // Uniformly random from all valid candidates (including reference)
				return valid[Math.floor(Math.random() * valid.length)].col;
			}

			default: {
				return null;
			}
		}
	}
	// #endregion
}
