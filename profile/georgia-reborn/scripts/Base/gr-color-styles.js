/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Color Styles                             * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    11-05-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////
// * COLOR STYLES * //
//////////////////////
/**
 * A class that provides the full collection of all style colors and its methods.
 */
class ColorStyles {
	/**
	 * Creates the `ColorStyles` instance and initializes theme preferences.
	 */
	constructor() {
		grAlias.update();
	}

	// * PRIVATE METHODS - STYLE BLENDING * //
	// #region PRIVATE METHODS - STYLE BLENDING
	/**
	 * Calculates contrast-adaptive alpha using smooth perceptual models.
	 * @param {number} bgLum - The background luminance (0-1).
	 * @param {number} imgLum - The image luminance (0-1).
	 * @param {number} contrast - The absolute luminance difference.
	 * @param {boolean} imageBrighter - True if image is brighter than background.
	 * @returns {number} The base adaptive alpha (before theme/saturation modifiers).
	 * @private
	 */
	_calculateContrastAdaptiveAlpha(bgLum, imgLum, contrast, imageBrighter) {
		// * EXTREME LUMINANCE PROTECTION * //
		const safeBgLum = Math.max(0.01, Math.min(0.99, bgLum));

		// * CORE PERCEPTUAL CONTRAST * //
		// Stevens' Power Law: exponent 0.42 empirically tuned for smooth alpha transitions
		const perceptualContrast = contrast ** 0.42;

		// * BASE ALPHA CALCULATION * //
		const MIN_ALPHA = 50;  // ~20%
		const MAX_ALPHA = 190; // ~75%
		const contrastFactor = 1 - perceptualContrast;
		const baseAlpha = MIN_ALPHA + (contrastFactor * (MAX_ALPHA - MIN_ALPHA));

		// * NEAR-IDENTICAL LUMINANCE SPECIAL CASE * //
		const similarityBoost = contrast < 0.05 ? Sigmoid(0.05 - contrast, 20, 0.025, 1.0, 1.35) : 1.0;

		// * LUMINANCE ZONE ADJUSTMENTS * //
		let zoneModifier = 1.0;

		if (safeBgLum < 0.18) {
			// Dark backgrounds
			if (imageBrighter) {
				// Brighter image on dark bg: reduce alpha with gradient approach
				const baseReduction = Sigmoid(safeBgLum, 15, 0.10, 0.55, 0.80);
				const intensity = Sigmoid(contrast, 12, 0.3);
				const extremeContrast = contrast > 0.30 ? 0.75 : 0.0;
				zoneModifier = baseReduction + (0.2 * (1 - intensity)) + extremeContrast;
			} else {
				// Dark on dark: boost alpha for visibility
				zoneModifier = Sigmoid(0.08 - contrast, 15, 0, 1.0, 1.3);
			}
		}
		else if (safeBgLum > 0.5) {
			// Light backgrounds
			if (!imageBrighter) {
				// Darker image on light bg: boost alpha based on contrast
				const intensity = Sigmoid(contrast, 10, 0.3);
				zoneModifier = 1.0 + (0.2 * intensity);
			} else {
				// Light on light: reduce alpha for low contrast
				zoneModifier = Sigmoid(0.08 - contrast, 12, 0, 0.95, 1.10);
			}
		}
		else {
			// Mid-tones (0.18 - 0.5): optimal range, slight edge boost
			const distFromCenter = Math.abs(safeBgLum - 0.34);
			zoneModifier = Sigmoid(distFromCenter, 8, 0.08, 1.0, 1.15);
		}

		// * BRIGHT IMAGE PROTECTION * //
		// Reduce alpha when overlaying very bright images to prevent excessive background brightening
		let brightModifier = 1.0;
		if (imgLum > 0.65) {
			const brightPenalty = Sigmoid(imgLum, 20, 0.65);
			const maxPenalty = safeBgLum < 0.25 ? 0.15 : 0.27;
			brightModifier = 1.0 - (maxPenalty * brightPenalty);
		}

		return baseAlpha * zoneModifier * similarityBoost * brightModifier;
	}

	/**
	 * Calculates perceptually optimal blur coordinated with alpha.
	 * @param {number} bgLum - The background luminance (0-1).
	 * @param {number} imgLum - The image luminance (0-1).
	 * @param {number} contrast - The luminance contrast (absolute difference).
	 * @param {number} calculatedAlpha - The pre-calculated alpha for coordination.
	 * @param {number} [imgSaturation] - The optional image saturation (0-100) for adjustment.
	 * @returns {number} The optimal blur radius in pixels.
	 * @private
	 */
	_calculatePerceptualBlur(bgLum, imgLum, contrast, calculatedAlpha, imgSaturation = null) {
		// *  PERFORMANCE SCALING * //
		// StackBlur is O(r * w * h). Scale blur cap based on resolution.

		const MAX_BLUR_CAP =
			grm.ui.wh > 2000 ? 220 : // 4K Standard
			grm.ui.wh > 1400 ? 200 : // 1440p
			180;                     // 1080p and below

		// * BASE BLUR FROM CONTRAST * //
		// High contrast → higher blur (soften jarring transitions)
		const MIN_BLUR = 140;
		const contrastBlur = MIN_BLUR + (contrast ** 0.7 * (MAX_BLUR_CAP - MIN_BLUR));

		// *  LUMINANCE ZONE SMOOTHING * //
		let zoneModifier = 1.0;

		if (bgLum < 0.12) {
			// Very dark backgrounds: increase blur for smooth, abstract appearance
			zoneModifier = Sigmoid(0.12 - bgLum, 15, 0.06, 1.0, 1.15);
		}
		else if (bgLum >= 0.18 && bgLum <= 0.5) {
			// Mid-tones: optimal blur range (peak at perceptual middle ~0.34)
			const distFromPeak = Math.abs(bgLum - 0.34);
			zoneModifier = 1.1 + (0.1 * Sigmoid(1 - distFromPeak * 5, 6, 0.5));
		}
		else if (bgLum > 0.6) {
			// Light backgrounds: moderate blur reduction
			zoneModifier = 0.92;
		}

		// * ALPHA COORDINATION * //
		// Lower alpha → slightly more blur for visual cohesion
		const alphaFactor = calculatedAlpha / 255;
		const alphaModifier = 0.95 + (0.1 * (1 - alphaFactor));

		// * EXTREME LOW CONTRAST BOOST * //
		// Very low contrast needs extra blur for any visual separation
		const contrastBoost = contrast < 0.03 ? Sigmoid(0.03 - contrast, 25, 0.015, 1.0, 1.12) : 1.0;

		// * SATURATION-BASED BLUR REDUCTION * //
		// Highly saturated images: reduce blur to preserve vibrancy
		const satModifier = imgSaturation > 60 ? 0.88 + 0.12 * (1 - Sigmoid(imgSaturation, 0.08, 70)) : 1.0;
		const finalBlur = contrastBlur * zoneModifier * alphaModifier * contrastBoost * satModifier;

		return Math.round(Math.max(100, Math.min(MAX_BLUR_CAP, finalBlur)));
	}

	/**
	 * Formats the image with alpha and adaptive blur.
	 * Uses progressive downscale-blur-upscale for expensive high-res operations.
	 * @param {GdiBitmap} image - The source album art image.
	 * @param {number} imageW - The target width (panel width).
	 * @param {number} imageH - The target height (panel height).
	 * @param {number} imageLuminance - The image luminance (0-1).
	 * @param {number} [imageSaturation] - The optional image saturation (0-100).
	 * @returns {GdiBitmap|null} The processed image or null on error.
	 * @private
	 */
	_formatStyleBlendImage(image, imageW, imageH, imageLuminance, imageSaturation = null) {
		if (!image || !imageW || !imageH) return image;

		let tempImg;
		const currentBgLuminance = Color.LUM(grCol.bg);

		const alpha = this.getStyleBlendImageAlpha(imageLuminance, currentBgLuminance, imageSaturation);
		const blur = this.getStyleBlendImageBlur(imageLuminance, currentBgLuminance, alpha, imageSaturation);

		try {
			tempImg = gdi.CreateImage(imageW, imageH);
			const g = tempImg.GetGraphics();
			g.DrawImage(image, 0, 0, grm.ui.ww, grm.ui.wh, 0, 0, image.Width, image.Height, 0, alpha);
			tempImg.ReleaseGraphics(g);

			// * PROGRESSIVE BLUR OPTIMIZATION * //
			const pixelCount = imageW * imageH;
			const isExpensive = blur > 200 && pixelCount > 3000000;

			if (isExpensive) {
				// Downscale → blur → upscale for performance
				const scaleFactor = Math.max(0.5, 1 - (blur - 200) / 400);
				const scaledW = Math.round(imageW * scaleFactor);
				const scaledH = Math.round(imageH * scaleFactor);
				const scaledBlur = Math.round(blur * scaleFactor);
				const smallImg = tempImg.Resize(scaledW, scaledH);

				smallImg.StackBlur(scaledBlur);
				tempImg = smallImg.Resize(imageW, imageH);

				if (grCfg.settings.showDebugThemeLog) {
					console.log(`_formatStyleBlendImage => Progressive blur: ${blur}px ${Unicode.RightArrow} downscale ${scaleFactor.toFixed(2)} ${Unicode.RightArrow} blur ${scaledBlur}px ${Unicode.RightArrow} upscale`);
				}
			} else {
				tempImg.StackBlur(blur);
			}
		}
		catch (e) {
			console.log('\n>>> Error => _formatStyleBlendImage failed!\n');
			return null;
		}

		if (grCfg.settings.showDebugThemeLog) {
			const satInfo = imageSaturation !== null ? `, sat=${imageSaturation.toFixed(1)}` : '';
			console.log(`_formatStyleBlendImage => Intelligent blend: bg=${currentBgLuminance.toFixed(3)}, img=${imageLuminance.toFixed(3)}${satInfo}, alpha=${alpha}, blur=${blur}`);
		}

		return tempImg;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE BLENDING * //
	// #region PUBLIC METHODS - STYLE BLENDING
	/**
	 * Calculates perceptually optimal alpha for blended images.
	 *
	 * DESIGN:
	 * - Uses Stevens' Power Law (x^0.42) for perceptual contrast
	 *   (empirically tuned between cube root and square root for smooth transitions)
	 * - Sigmoid smoothing for organic zone transitions
	 * - Inverse relationship: high contrast → lower alpha
	 * - Coordinated with blur for visual harmony
	 * - Saturation compensation (saturated images "pop" more at lower alpha)
	 *
	 * @param {number} imgLuminance - The image luminance (0.0-1.0).
	 * @param {number} [bgLuminance] - The background luminance (0.0-1.0).
	 * @param {number} [imgSaturation] - The optional image saturation (0-100) for compensation.
	 * @returns {number} The optimal alpha value (0-255).
	 */
	getStyleBlendImageAlpha(imgLuminance, bgLuminance = null, imgSaturation = null) {
		if (bgLuminance === null) {
			bgLuminance = Color.LUM(grCol.bg);
		}

		let saturationModifier = 1.0;
		const contrast = Math.abs(bgLuminance - imgLuminance);
		const imageBrighter = imgLuminance > bgLuminance;
		const baseAlpha = this._calculateContrastAdaptiveAlpha(bgLuminance, imgLuminance, contrast, imageBrighter);

		// High saturation: reduce alpha (saturated colors "pop" more)
		if (imgSaturation && imgSaturation > 50) {
			const satIntensity = Sigmoid(imgSaturation, 0.08, 60);
			const baseReduction = 0.10;
			const lumContext = imgLuminance < 0.2 ? 0.6 : 1.0; // Extra reduction for dark saturated images
			saturationModifier = 1.0 - (baseReduction * satIntensity * lumContext);
		}
		// Low saturation: boost alpha (desaturated images need more presence)
		if (imgSaturation && imgSaturation < 25) {
			const lowSatBoost = Sigmoid(20 - imgSaturation, 15, 10);
			saturationModifier += 0.10 * lowSatBoost;
		}

		if (bgLuminance > LUM.Y90) {
			const maxAlpha =
				imgLuminance < LUM.Y10 ? 15 :
				imgLuminance < LUM.Y19 ? 30 :
				imgLuminance < LUM.Y26 ? 50 :
				imgLuminance < LUM.Y40 ? 70 : 80;

			const adjusted = Math.round(baseAlpha * saturationModifier);
			return Math.max(15, Math.min(maxAlpha, adjusted));
		}

		if (bgLuminance < LUM.Y1_8) {
			const maxAlpha = imgLuminance > LUM.Y95 ? 30 : imgLuminance > LUM.Y67 ? 100 : 80;
			const adjusted = Math.round(baseAlpha * saturationModifier);
			return Math.max(15, Math.min(maxAlpha, adjusted));
		}

		const themeModifiers = {
			white:    0.7,
			black:    0.5,
			reborn:   1.0,
			random:   1.0,
			cream:    0.75,
			blue:     0.85,
			darkblue: 0.8,
			red:      0.7,
			nblue:    0.75,
			ngreen:   0.75,
			nred:     0.75,
			ngold:    0.75,
			default:  0.8
		};

		const themeModifier = themeModifiers[grSet.theme] || themeModifiers.default;
		const themeAlpha = baseAlpha * saturationModifier * themeModifier;

		return Math.round(Math.max(15, Math.min(240, themeAlpha)));
	}

	/**
	 * Calculates perceptually optimal blur coordinated with alpha.
	 *
	 * DESIGN:
	 * - High contrast → higher blur (soften jarring transitions)
	 * - Low contrast → lower blur (preserve detail)
	 * - Coordinated with alpha for visual harmony
	 * - Resolution-aware caps to maintain performance
	 * - Saturation-aware reduction to preserve color vibrancy
	 *
	 * @param {number} imgLuminance - The image luminance (0.0-1.0).
	 * @param {number} [bgLuminance] - The background luminance (0.0-1.0).
	 * @param {number} [calculatedAlpha] - The optional precalculated alpha for coordination.
	 * @param {number} [imgSaturation] - The optional image saturation (0-100).
	 * @returns {number} The blur radius in pixels (100-200).
	 */
	getStyleBlendImageBlur(imgLuminance, bgLuminance = null, calculatedAlpha = null, imgSaturation = null) {
		if (bgLuminance === null) {
			bgLuminance = Color.LUM(grCol.bg);
		}

		if (calculatedAlpha === null) {
			calculatedAlpha = this.getStyleBlendImageAlpha(imgLuminance, bgLuminance, imgSaturation);
		}

		const contrast = Math.abs(bgLuminance - imgLuminance);
		const baseBlur = this._calculatePerceptualBlur(bgLuminance, imgLuminance, contrast, calculatedAlpha, imgSaturation);

		if (bgLuminance > LUM.Y90) {
			return Math.round(Math.max(100, Math.min(120, baseBlur * 0.45)));
		}

		if (bgLuminance < LUM.Y1_8) {
			return Math.round(Math.max(100, Math.min(180, baseBlur * 0.65)));
		}

		const themeBlurModifiers = {
			white:   0.5,
			black:   0.65,
			reborn:  1.0,
			random:  1.0,
			cream:   0.8,
			default: 1.0
		};

		const themeMod = themeBlurModifiers[grSet.theme] || themeBlurModifiers.default;
		const finalBlur = baseBlur * themeMod;

		return Math.round(Math.max(100, Math.min(220, finalBlur)));
	}

	/**
	 * Sets the style blend images for the album art based on current theme settings.
	 * Calculates optimal alpha and blur values, then creates the processed blend image.
	 * Only runs when grSet.styleBlend, grSet.styleBlend2, or blend progress bar is enabled.
	 * @param {GdiBitmap} image - The album art image to analyze.
	 * @param {Array} cache - The cache array for album art color extraction to avoid repeated GetColourSchemeJSON calls.
	 */
	setStyleBlend(image = grm.ui.albumArt, cache = grm.ui.cachedAlbumArtColors) {
		if (!image || (!grSet.styleBlend && !grSet.styleBlend2 && grSet.styleProgressBarFill !== 'blend')) {
			return;
		}

		grm.debug.setDebugProfile(grm.debug.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay, 'create', 'setStyleBlend');

		grCol.imgSaturation = CalcImgSaturation(image, cache);
		grCol.imgBlended = this._formatStyleBlendImage(image, grm.ui.ww, grm.ui.wh, grCol.imgLuminance, grCol.imgSaturation);

		grm.debug.setDebugProfile(false, 'print', 'setStyleBlend');
	}
	// #endregion

	// * PUBLIC METHODS - STYLE GRADIENT * //
	// #region PUBLIC METHODS - STYLE GRADIENT
	/**
	 * Calculates perceptually-weighted gradient impact with top/bottom bar bias.
	 * Top bar (menu text) weighted more heavily than bottom bar (transport icons).
	 * @param {number} bgLuminance - The background luminance (0-1).
	 * @param {number} gradientLuminance - The gradient color luminance (0-1).
	 * @returns {number} The perceptually-weighted gradient weight (0.0-1.0).
	 */
	getStyleGradientWeight(bgLuminance, gradientLuminance) {
		// * IMPORTANCE-WEIGHTED AREA COVERAGE * //
		const totalHeight = grm.ui.wh;
		const topBarHeight = grm.ui.topMenuHeight;
		const bottomBarHeight = grm.ui.lowerBarHeight;

		// Top bar = critical text (full weight)
		// Bottom bar = icons/buttons (reduced weight)
		const topBarImportance = 1.0;
		const bottomBarImportance = 0.65;
		const weightedBarHeight = (topBarHeight * topBarImportance) + (bottomBarHeight * bottomBarImportance);
		const geometricCoverage = weightedBarHeight / totalHeight;

		// * CONTRAST-ADAPTIVE BAR INTENSITY * //
		// Base: styleGradient=100% at bars, styleGradient2=50% at bars
		// BUT: High contrast overrides intensity penalty
		const contrast = Math.abs(bgLuminance - gradientLuminance);
		const perceptualContrast = contrast ** 0.42; // Stevens' Power Law

		const baseIntensity = grSet.styleGradient ? 1.0 : 0.5;

		// When contrast is high, even 50% gradient has strong visual impact
		// Boost Gradient 2 intensity based on contrast
		const contrastBoost = grSet.styleGradient ? 0 : (0.6 * Sigmoid(contrast, 10, 0.25));
		const barIntensity = Math.min(1.0, baseIntensity + contrastBoost);

		// High contrast = gradient is very visible
		const contrastFactor = 0.5 + (0.8 * perceptualContrast);

		// * ATTENTION WEIGHTING * //
		const baseAttention = 2.5;
		const topBias = 1.0 + (0.15 * (topBarHeight / (topBarHeight + bottomBarHeight)));
		const attentionMultiplier = baseAttention * topBias;

		// * LUMINANCE ZONE ADJUSTMENT * //
		let zoneModifier = 1.0;

		if (bgLuminance < 0.18) {
			// Dark backgrounds
			zoneModifier = gradientLuminance > bgLuminance ? 1.25 + (0.3 * Sigmoid(contrast, 8, 0.2)) : 0.85;
		}
		else if (bgLuminance > 0.45) {
			// Light backgrounds - CRITICAL ZONE for failures
			if (gradientLuminance < bgLuminance) {
				// Darker gradient on light bg: VERY noticeable
				const intensity = Sigmoid(contrast, 8, 0.25);
				zoneModifier = 1.15 + (0.35 * intensity);
			} else {
				// Light on light: subtle
				zoneModifier = 0.90;
			}
		}

		// * SIMILARITY REDUCTION * //
		const similarityFactor = contrast < 0.05 ? 0.3 + (0.7 * (contrast / 0.05)) : 1.0;

		// * POLARITY BOUNDARY PROTECTION * //
		// Near APCA polarity switch, be conservative
		const avgLuminance = bgLuminance + (gradientLuminance - bgLuminance) * 0.5;
		const distFromBoundary = Math.abs(avgLuminance - 0.18);
		const boundaryFactor = Sigmoid(distFromBoundary, 12, 0.08, 0.92, 1.0);

		// * FINAL CALCULATION * //
		const baseWeight = geometricCoverage * attentionMultiplier;
		const finalWeight = baseWeight * barIntensity * contrastFactor * zoneModifier * similarityFactor * boundaryFactor;

		const maxWeight = 0.65;
		const result = Math.max(0.05, Math.min(maxWeight, finalWeight));

		if (grCfg.settings.showDebugThemeLog) {
			console.log(`getStyleGradientWeight => Gradient weight calc: top=${topBarHeight}px (x${topBarImportance}), bottom=${bottomBarHeight}px (x${bottomBarImportance}), contrast=${contrast.toFixed(3)}, barIntensity=${barIntensity.toFixed(2)}, final=${result.toFixed(3)}`);
		}

		return result;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE ALTERNATIVE * //
	// #region PUBLIC METHODS - STYLE ALTERNATIVE
	/**
	 * Any active theme used in Options > Style > Alternative.
	 */
	styleAlternativeColors() {
		const { THEME, CTHEME, BEVEL, TPB } = grAlias;
		const THEME_NEON = ['nblue', 'ngreen', 'nred', 'ngold'].includes(THEME);

		// * PLAYLIST * //
		pl.col.bg =
			THEME === 'white' ? RGB(245, 245, 245) :
			THEME === 'black' ? TintColorOKLCH(pl.col.bg, 6) :
			THEME === 'reborn' || THEME === 'random' ? ShadeColorOKLCH(pl.col.bg, 5) :
			THEME === 'blue' ? RGB(8, 110, 190) :
			THEME === 'darkblue' ? RGB(17, 35, 57) :
			THEME === 'red' ? RGB(106, 18, 18) :
			THEME === 'cream' ? RGB(255, 247, 240) :
			THEME_NEON ? TintColorOKLCH(pl.col.bg, 10) :
			CTHEME ? ShadeColorOKLCH(pl.col.bg, 5) : '';

		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;

		pl.col.header_nowplaying_bg =
			THEME === 'blue' ? RGB(20, 120, 205) :
			THEME === 'darkblue' ? RGB(18, 42, 70) :
			THEME === 'red' ? RGB(130, 25, 25) :
			pl.col.header_nowplaying_bg;

		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_selection_bg = pl.col.row_nowplaying_bg;

		// * LIBRARY * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;

		// * BIOGRAPHY * //
		bio.ui.col.bg = pl.col.bg;

		// * MAIN * //
		grCol.bg =
			THEME === 'white' ? RGB(255, 255, 255) :
			THEME === 'black' ? TintColorOKLCH(grCol.bg, 4) :
			THEME === 'reborn' || THEME === 'random' ? TintColorOKLCH(grCol.bg, 8) :
			THEME === 'blue' ? RGB(20, 120, 205) :
			THEME === 'darkblue' ? RGB(18, 42, 70) :
			THEME === 'red' ? RGB(130, 25, 25) :
			THEME === 'cream' ? RGB(255, 255, 255) :
			THEME_NEON ? RGB(30, 30, 30) :
			CTHEME ? TintColorOKLCH(grCol.bg, 8) : '';

		grCol.shadow =
			THEME === 'reborn' || THEME === 'random' ? RGBA(0, 0, 0, 25) :
			THEME === 'blue' ? grCol.shadow + RGBA(0, 0, 0, 25) :
			THEME_NEON ? RGBA(0, 0, 0, 255) :
			grCol.shadow + RGBA(0, 0, 0, 10);

		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = pl.col.row_title_normal;

		// * LOWER BAR TRANSPORT BUTTONS * //
		grCol.transportEllipseBg =
			THEME === 'white' ? TintColor(grCol.transportEllipseBg, 100) :
			THEME === 'black' ? TintColor(grCol.transportEllipseBg, 4) :
			THEME === 'reborn' || THEME === 'random' ? TintColor(grCol.transportEllipseBg, 0) :
			THEME === 'blue' ? TintColor(grCol.transportEllipseBg, 6) :
			THEME === 'darkblue' ? TintColor(grCol.transportEllipseBg, 0) :
			THEME === 'red' ? RGB(158, 30, 30) :
			THEME === 'cream' ? pl.col.bg :
			THEME_NEON ? ShadeColor(grCol.transportEllipseBg, 20) :
			ShadeColor(grCol.transportEllipseBg, 10);

		grCol.transportEllipseNormal =
			THEME === 'black' ? ShadeColor(grCol.transportEllipseNormal, 6) :
			THEME === 'red' ? RGB(106, 18, 18) :
			THEME_NEON ? ShadeColor(grCol.transportEllipseNormal, 90) :
			TintColor(grCol.transportEllipseNormal, 6);

		grCol.transportEllipseHovered = TintColor(grCol.transportEllipseHovered, 6);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			THEME === 'black' ? TintColorOKLCH(grCol.transportStyleBg, 4) :
			THEME === 'blue' ? TintColorOKLCH(grCol.transportStyleBg, 6) :
			THEME === 'darkblue' ? TintColorOKLCH(grCol.transportStyleBg, 0) :
			THEME === 'red' ? TintColorOKLCH(grCol.transportStyleBg, 2) :
			THEME_NEON ? ShadeColorOKLCH(grCol.transportStyleBg, 6) :
			TintColorOKLCH(grCol.transportStyleBg, 6);

		grCol.transportStyleTop =
			THEME === 'black' ? ShadeColorOKLCH(grCol.transportStyleTop, 6) :
			THEME === 'blue' ? ShadeColorOKLCH(grCol.transportStyleTop, 6) :
			THEME === 'darkblue' ? ShadeColorOKLCH(grCol.transportStyleTop, 0) :
			THEME === 'red' ? TintColorOKLCH(grCol.transportStyleTop, TPB === 'emboss' ? 6 : 2) :
			THEME_NEON ? ShadeColorOKLCH(grCol.transportStyleTop, 6) :
			TintColorOKLCH(grCol.transportStyleTop, 6);

		grCol.transportStyleBottom =
			THEME === 'black' ? ShadeColorOKLCH(grCol.transportStyleBottom, 0) :
			THEME === 'blue' ? ShadeColorOKLCH(grCol.transportStyleBottom, 6) :
			THEME === 'darkblue' ? ShadeColorOKLCH(grCol.transportStyleBottom, 0) :
			THEME === 'red' ? TintColorOKLCH(grCol.transportStyleBottom, TPB === 'emboss' ? 6 : 2) :
			THEME_NEON ? ShadeColorOKLCH(grCol.transportStyleBottom, 6) :
			TintColorOKLCH(grCol.transportStyleBottom, 6);

		// * PROGRESS BAR * //
		grCol.progressBar =
			THEME === 'white' ? TintColorOKLCH(grCol.progressBar, BEVEL ? 60 : 40) :
			THEME === 'black' ? TintColorOKLCH(grCol.progressBar, 2) :
			THEME === 'reborn' || THEME === 'random' ? grCol.colLuminance < 0.02 && grCol.isColored ? TintColorOKLCH(grCol.primary, 12) : grCol.isColored && !grm.ui.noAlbumArtStub ? pl.col.bg : grCol.progressBar :
			THEME === 'blue' ? TintColorOKLCH(grCol.progressBar, 2) :
			THEME === 'darkblue' ? TintColorOKLCH(grCol.progressBar, 0) :
			THEME === 'red' ? RGB(158, 30, 30) :
			THEME_NEON ? ShadeColorOKLCH(grCol.progressBar, BEVEL ? 60 : 35) :
			CTHEME ? ShadeColorOKLCH(grCol.progressBar, 5) :
			pl.col.bg;

		// * VOLUME BAR * //
		grCol.volumeBar = grCol.progressBar;
		grCol.volumeBarFill = grCol.progressBarFill;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE ALTERNATIVE 2 * //
	// #region PUBLIC METHODS - STYLE ALTERNATIVE 2
	/**
	 * Any active theme used in Options > Style > Alternative 2.
	 */
	styleAlternative2Colors() {
		const { THEME, CTHEME, BEVEL, BLEND, } = grAlias;
		const THEME_NEON = ['nblue', 'ngreen', 'nred', 'ngold'].includes(THEME);

		// * PLAYLIST * //
		pl.col.bg =
			THEME === 'white' ? TintColorOKLCH(pl.col.bg, 4) :
			THEME === 'black' ? TintColorOKLCH(pl.col.bg, 3) :
			THEME === 'reborn' || THEME === 'random' ? TintColorOKLCH(pl.col.bg, 5) :
			THEME === 'blue' ? RGB(20, 120, 205) :
			THEME === 'darkblue' ? RGB(18, 42, 70) :
			THEME === 'red' ? RGB(120, 22, 22) :
			THEME === 'cream' ? RGB(255, 255, 255) :
			THEME_NEON ? TintColorOKLCH(pl.col.bg, 6) :
			CTHEME ? TintColorOKLCH(pl.col.bg, 5) : '';

		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;

		pl.col.header_nowplaying_bg =
			THEME === 'black' && grCol.colLuminance < 0.02 && !grm.ui.noAlbumArtStub ? grCol.primary_oklch_t015 :
			THEME === 'reborn' || THEME === 'random' ? RGBtoRGBA(grCol.primary_rgb_s030, BLEND ? 60 : 40) :
			THEME === 'red' ? RGB(140, 25, 25) :
			THEME_NEON ? TintColorOKLCH(pl.col.header_nowplaying_bg, 6) :
			pl.col.header_nowplaying_bg;

		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_selection_bg = pl.col.row_nowplaying_bg;

		// * LIBRARY * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;

		// * BIOGRAPHY * //
		bio.ui.col.bg = pl.col.bg;

		// * MAIN * //
		grCol.bg =
			THEME === 'white' ? ShadeColorOKLCH(grCol.bg, 6) :
			THEME === 'black' ? TintColorOKLCH(grCol.bg, 10) :
			THEME === 'reborn' || THEME === 'random' ? ShadeColorOKLCH(grCol.bg, 8) :
			THEME === 'blue' ? RGB(8, 102, 180) :
			THEME === 'darkblue' ? RGB(17, 35, 57) :
			THEME === 'red' ? RGB(95, 15, 15) :
			THEME === 'cream' ? RGB(255, 247, 240) :
			THEME_NEON ? RGB(25, 25, 25) :
			CTHEME ? ShadeColorOKLCH(grCol.bg, 8) : '';

		grCol.shadow =
			THEME === 'black' ? grCol.shadow - RGBA(0, 0, 0, 80) :
			THEME_NEON ? grCol.shadow :
			grCol.shadow + RGBA(0, 0, 0, 5);

		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = pl.col.row_title_normal;

		// * LOWER BAR TRANSPORT BUTTONS * //
		grCol.transportEllipseBg =
			THEME === 'white' ? TintColor(grCol.transportEllipseBg, 100) :
			THEME === 'black' ? ShadeColor(grCol.transportEllipseBg, 6) :
			THEME === 'darkblue' ? TintColor(grCol.transportEllipseBg, 0) :
			THEME === 'red' ? RGB(140, 25, 25) :
			TintColor(grCol.transportEllipseBg, 6);

		grCol.transportEllipseNormal =
			THEME === 'black' ? ShadeColor(grCol.transportEllipseNormal, 60) :
			TintColor(grCol.transportEllipseNormal, 6);

		grCol.transportEllipseHovered = TintColor(grCol.transportEllipseHovered, 6);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			THEME === 'white' ? ShadeColorOKLCH(grCol.transportStyleBg, BEVEL ? 10 : 7) :
			THEME === 'darkblue' ? TintColorOKLCH(grCol.transportStyleBg, 0) :
			THEME === 'red' ? TintColorOKLCH(grCol.transportStyleBg, 2) :
			THEME === 'cream' ? RGB(230, 230, 230) :
			TintColorOKLCH(grCol.transportStyleBg, 6);

		grCol.transportStyleTop =
			THEME === 'white' ? ShadeColorOKLCH(grCol.transportStyleTop, 6) :
			THEME === 'blue' ? TintColorOKLCH(grCol.transportStyleTop, 12) :
			THEME === 'darkblue' ? TintColorOKLCH(grCol.transportStyleTop, 0) :
			THEME === 'red' ? TintColorOKLCH(grCol.transportStyleTop, 2) :
			TintColorOKLCH(grCol.transportStyleTop, 6);

		grCol.transportStyleBottom =
			THEME === 'white' ? ShadeColorOKLCH(grCol.transportStyleBottom, 6) :
			THEME === 'blue' ? ShadeColorOKLCH(grCol.transportStyleBottom, 10) :
			THEME === 'darkblue' ? TintColorOKLCH(grCol.transportStyleBottom, 0) :
			THEME === 'red' ? TintColorOKLCH(grCol.transportStyleBottom, 2) :
			TintColorOKLCH(grCol.transportStyleBottom, 6);

		// * PROGRESS BAR * //
		grCol.progressBar =
			THEME === 'white' ? TintColorOKLCH(grCol.progressBar, BEVEL ? 60 : 100) :
			THEME === 'black' ? ShadeColorOKLCH(grCol.progressBar, 16) :
			THEME === 'reborn' || THEME === 'random' ? grCol.colLuminance < 0.02 && grCol.isColored ? TintColorOKLCH(grCol.primary, 12) : pl.col.bg :
			THEME === 'blue' ? pl.col.bg :
			THEME === 'darkblue' ? pl.col.row_nowplaying_bg :
			THEME === 'red' ? TintColorOKLCH(grCol.progressBar, 0) :
			THEME_NEON ? TintColorOKLCH(grCol.progressBar, 3) :
			CTHEME ? ShadeColorOKLCH(grCol.progressBar, 2) :
			pl.col.bg;

		// * VOLUME BAR * //
		grCol.volumeBar = grCol.progressBar;
		grCol.volumeBarFill = grCol.progressBarFill;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE REBORN FUSION * //
	// #region PUBLIC METHODS - STYLE REBORN FUSION
	/**
	 * Active Reborn theme used in Options > Style > Reborn fusion, Reborn fusion 2, Reborn fusion accent.
	 */
	styleRebornFusionColors() {
		const { BEVEL, BLEND, BLEND2, RF, RF2, RFA, TPB } = grAlias;

		if (!RF && !RF2 && !RFA) return;

		const { primary, secondary, ctx, theme } = { ...grm.colorThemes._createThemeContext('main') };

		// Get optimized color assignments
		const optimized = this.getThemeRebornFusionColorRoles();
		const mainColor = RF ? secondary : primary;
		const getColor = grm.colorThemes._getColor(mainColor, Color.LUM(mainColor), false, false, ctx);

		// * PLAYLIST PANEL CONTEXT * //
		const panelPrimary = optimized.playlistBg.val;
		const panelLUM = optimized.playlistBg.luminance;
		const panelSat = optimized.playlistBg.saturation / 100;

		const panelContext = {
			bevel: BEVEL, blend: BLEND, blend2: BLEND2, imgLuminance: grCol.imgLuminance, saturation: panelSat
		};

		const nowplayingColor = grm.colorSystem.applyColor(panelPrimary, panelLUM, 'oklch', 'nowPlaying.bg', panelContext);

		// * MAIN PANEL CONTEXT * //
		const mainBgLum = RF ? grCol.colLuminance2 : grCol.colLuminance;
		const mainPrimary = optimized.mainBg.val;
		const mainLUM = optimized.mainBg.luminance;
		const mainSat = optimized.mainBg.saturation / 100;

		const mainContext = {
			bevel: BEVEL, blend: BLEND, blend2: BLEND2, imgLuminance: grCol.imgLuminance, saturation: mainSat
		};

		// * PLAYLIST - MAIN COLORS * //
		pl.col.bg = RF2 ? grCol.secondary : grCol.primary;

		// * PLAYLIST - PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;

		// * PLAYLIST - HEADER COLORS * //
		pl.col.header_nowplaying_bg = BLEND ? RGBtoRGBA(nowplayingColor, 130) : nowplayingColor;
		pl.col.header_sideMarker = optimized.sidemarker.val;
		pl.col.header_line_normal = grm.colorSystem.applyColor(panelPrimary, panelLUM, 'oklch', 'line.normal', panelContext);
		pl.col.header_line_playing = grm.colorSystem.applyColor(panelPrimary, panelLUM, 'oklch', 'line.playing', panelContext);

		// * PLAYLIST - ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_selection_frame = pl.col.header_line_normal;
		pl.col.row_sideMarker = optimized.sidemarker.val;
		pl.col.row_disc_subheader_line = pl.col.header_line_normal;

		const dragLum = Color.LUM(optimized.sidemarker.val);
		const dragAmount = grm.colorSystem.interpolateKeyframes(grm.colorSystem.accentKeyframes, dragLum, 'value');
		const dragModified = grm.colorSystem.applyContextModifiers(dragAmount, 'accent', dragLum, mainContext);
		const dragAdjust = Math.min(dragModified * 0.4, 50);

		pl.col.row_drag_line = optimized.sidemarker.val;
		pl.col.row_drag_line_reached = dragLum > LUM.Y67
			? ShadeColorOKLCH(optimized.sidemarker.val, Math.round(dragAdjust * 0.5))
			: TintColorOKLCH(optimized.sidemarker.val, Math.round(dragAdjust));

		// * LIBRARY - MAIN COLORS * //
		lib.ui.col.bg = pl.col.bg;

		// * LIBRARY - ROW COLORS * //
		lib.ui.col.nowPlayingBg = pl.col.header_nowplaying_bg;
		lib.ui.col.sideMarker = optimized.sidemarker.val;
		lib.ui.col.selectionFrame = pl.col.header_line_normal;

		// * LIBRARY - BUTTON COLORS * //
		lib.ui.col.line = pl.col.header_line_playing;

		// * BIOGRAPHY - MAIN COLORS * //
		bio.ui.col.bg = pl.col.bg;

		// * MAIN - MAIN COLORS * //
		grCol.bg = RF ? grCol.secondary : grCol.primary;

		// * MAIN - POPUP COLORS * //
		grCol.popupBg = RGBtoRGBA(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = pl.col.header_artist_playing;

		// * MAIN - TOP MENU BUTTON COLORS * //
		grCol.menuBgColor = getColor(mainColor, 'menu.bg', 'oklch');
		grCol.menuStyleBg = getColor(theme.grCol_menuStyleBg, 'menu.styleBg', 'oklch');
		grCol.menuRectStyleEmbossTop = getColor(theme.grCol_menuRectStyleEmbossTop, 'menu.styleRectEmbossTop', 'oklch');
		grCol.menuRectStyleEmbossBottom = getColor(theme.grCol_menuRectStyleEmbossBottom, 'menu.styleRectEmbossBottom', 'oklch');
		grCol.menuRectNormal = getColor(mainColor, 'menu.rect', 'rgb', false, ctx, ctx.menuBevelOrInner);
		grCol.menuRectHovered = getColor(mainColor, 'menu.rect', 'rgb', false, ctx, ctx.menuBevelOrInner);
		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = getColor(theme.grCol_menuTextNormal, 'menu.text');
		grCol.menuTextHovered = getColor(theme.grCol_menuTextHovered, 'text.active');
		grCol.menuTextDown = grCol.menuTextHovered;

		// * MAIN - LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = getColor(theme.grCol_transportEllipseBg, 'transport.bg');
		grCol.transportEllipseNormal = getColor(theme.grCol_transportEllipseNormal, 'transport.ellipse', 'oklch');
		grCol.transportEllipseHovered = theme.grCol_transportEllipseHovered;
		grCol.transportEllipseDown = theme.grCol_transportEllipseDown;
		grCol.transportStyleBg = grm.colorSystem.applyColor(RF ? grCol.secondary_rgb_s075 : grCol.primary_rgb_s075, mainBgLum, 'rgb', 'transport.styleBg', ctx);
		grCol.transportStyleTop = grm.colorSystem.applyColor(RF ? grCol.secondary_rgb_t080 : grCol.primary_rgb_t080, mainBgLum, 'rgb', 'transport.styleTop', ctx);
		grCol.transportStyleBottom = grm.colorSystem.applyColor(RF ? grCol.secondary_rgb_s075 : grCol.primary_rgb_s075, mainBgLum, 'rgb', 'transport.styleBottom', ctx);
		grCol.transportIconNormal = grm.colorSystem.applyColor(mainColor, TPB !== 'minimal' ? Color.LUM(grCol.transportEllipseBg) : mainBgLum, 'rgb', TPB !== 'minimal' ? 'transport.icon' : 'transport.iconMinimal', ctx);
		grCol.transportIconHovered = grm.colorSystem.applyColor(mainColor, TPB !== 'minimal' ? Color.LUM(grCol.transportEllipseBg) : mainBgLum, 'rgb', TPB !== 'minimal' ? 'transport.iconHovered' : 'transport.iconMinimalHovered', ctx);
		grCol.transportIconDown = theme.grCol_transportIconDown;

		// * MAIN - PROGRESS BAR COLORS * //
		const amount = grm.colorSystem.interpolateKeyframes(grm.colorSystem.progressBarKeyframes.bg, mainLUM, 'value');
		const progBarBg = grm.colorSystem.applyColor(mainPrimary, mainLUM, 'oklch', 'progressBar.bg', mainContext);
		grCol.progressBar = grm.colorSystem.validateColorContrast(grCol.bg, progBarBg, mainLUM, 'progressBar.bg', mainContext, amount);
		grCol.progressBarFill = optimized.progressFill.val;
		grCol.styleProgressBar = grm.colorSystem.applyColor(RGB(0, 0, 0), mainBgLum, 'rgb', 'progressBar.highlight', ctx);
		grCol.styleProgressBarLineTop = grm.colorSystem.applyColor(RGB(0, 0, 0), mainBgLum, 'rgb', 'progressBar.lineTop', ctx);
		grCol.styleProgressBarLineBottom = grm.colorSystem.applyColor(RGB(255, 255, 255), mainBgLum, 'rgb', 'progressBar.lineBottom', ctx);
		grCol.styleProgressBarFill = grm.colorSystem.applyColor(RGB(0, 0, 0), mainBgLum, 'oklch', 'shadow.fill', ctx);

		// * MAIN - VOLUME BAR COLORS * //
		grCol.volumeBar = getColor(theme.grCol_volumeBar, 'volumeBar.bg');
		grCol.volumeBarFill = optimized.progressFill.val;
		grCol.volumeBarFrame = grCol.transportEllipseNormal;

		// * MAIN - STYLE COLORS * //
		grCol.styleBevel     = getColor(primary, 'style.bevel', 'oklch');
		grCol.styleGradient  = getColor(mainPrimary, 'style.gradient', 'oklch', true);
		grCol.styleGradient2 = getColor(mainPrimary, 'style.gradient', 'oklch', true);
	}

	/**
	 * Assigns colors to roles using perceptual contrast.
	 * Uses global Weber contrast and JND helpers for consistent visibility.
	 * @returns {object} The role assignments {mainBg, playlistBg, progressFill, sidemarker}.
	 */
	getThemeRebornFusionColorRoles() {
		const { RF, RF2, RFA } = grAlias;

		const SAT_BOOST_THRESHOLD = 40;
		const SAT_BOOST_MULTIPLIER = 1.5;
		const GRAY_BOOST_SAT = 40;
		const GRAY_BOOST_MULTIPLIER = 1.8;

		const primary = grm.colorManager.getCachedColor(grCol.primary);
		const secondary = grm.colorManager.getCachedColor(grCol.secondary);
		const pLum = primary.luminance;
		const sLum = secondary.luminance;
		const pSat = primary.saturation;
		const sSat = secondary.saturation;

		// RFA should only tint accents, not swap backgrounds
		const mainBg = RF ? secondary : primary;
		const mainLum = RF ? sLum : pLum;
		const playlistBg = RF ? primary : RFA ? primary : secondary;
		const playlistLum = RF ? pLum : RFA ? pLum : sLum;

		// Check hue distinction
		const areDistinctHues = AreDistinctHues(primary, secondary, 90);

		// For RFA, force secondary for accents
		if (RFA) {
			return { mainBg, playlistBg, progressFill: secondary, sidemarker: secondary };
		}

		// Selection with saturation weighting
		const selectBestColor = (bgColor, bgLum, threshold, isStrict) => {
			const candidates = [
				{ color: primary,   lum: pLum, sat: pSat, name: 'primary' },
				{ color: secondary, lum: sLum, sat: sSat, name: 'secondary' }
			]
			.map(c => {
				const weber = CalcWeberContrast(c.lum, bgLum);
				const colorDist = ColorDistance(c.color.val, bgColor.val, true);
				const passesJND = HasPerceptualContrast(c.lum, bgLum);

				// Saturation and gray weighting
				const saturationBoost = c.sat > SAT_BOOST_THRESHOLD ? SAT_BOOST_MULTIPLIER : 1.0;
				const grayBoost = bgColor.isCloseToGrayscale && c.sat > GRAY_BOOST_SAT ? GRAY_BOOST_MULTIPLIER : 1.0;

				return {
					...c, weber, colorDist, passesJND, saturationBoost, grayBoost,
					finalScore: weber * saturationBoost * grayBoost
				};
			});

			// Sort by final score
			candidates.sort((a, b) => b.finalScore - a.finalScore);

			let choice = candidates[0];

			// Swap logic if hue/lum too similar
			if (choice.colorDist < threshold && !areDistinctHues) {
				const other = candidates[1];

				if (other.colorDist > choice.colorDist * 1.5) {
					choice = other;
					if (grCfg.settings.showDebugThemeLog) {
						console.log(`  ${Unicode.RightArrow} Swapped to ${choice.name} (hue contrast insufficient)`);
					}
				}
			}

			// Failsafe: JND enforcement
			if (!choice.passesJND && !areDistinctHues && isStrict) {
				const jndNeeded = CalcJNDThreshold(bgLum);
				const currentWeber = CalcWeberContrast(choice.lum, bgLum);
				const needed = jndNeeded - currentWeber;
				const percent = Math.min(needed * bgLum * 100, 15);
				const adjusted = bgLum < 0.5 ? TintColor(choice.color.val, percent) : ShadeColor(choice.color.val, percent);

				choice.color = grm.colorManager.getCachedColor(adjusted);

				if (grCfg.settings.showDebugThemeLog) {
					console.log(`  ${Unicode.RightArrow} Failsafe: ${percent.toFixed(0)}% adjustment for JND`);
				}
			}

			return choice.color;
		};

		// Apply selection
		const sidemarker = selectBestColor(playlistBg, playlistLum, 35, true);
		const progressFill = selectBestColor(mainBg, mainLum, 25, false);

		if (grCfg.settings.showDebugThemeLog) {
			const fusionMode = RF ? '1' : RF2 ? '2' : 'Accent';
			const lumMain = mainLum.toFixed(3);
			const lumPlaylist = playlistLum.toFixed(3);
			const weberSidemarker = CalcWeberContrast(Color.LUM(sidemarker), playlistLum).toFixed(2);
			const weberProgressFill = CalcWeberContrast(Color.LUM(progressFill), mainLum).toFixed(2);

			console.log(`${Unicode.ArtistPalette} Reborn Fusion ${fusionMode} (Complementary: ${areDistinctHues})`);
			console.log(`  Progress fill: ${ColToRgb(progressFill.val)} (Weber: ${weberProgressFill})`);
			console.log(`  Main: ${ColToRgb(mainBg.val)} (lum ${lumMain})`);
			console.log(`  Playlist: ${ColToRgb(playlistBg.val)} (lum ${lumPlaylist})`);
			console.log(`  Sidemarker: ${ColToRgb(sidemarker.val)} (Weber: ${weberSidemarker})`);
		}

		return { mainBg, playlistBg, progressFill, sidemarker };
	}
	// #endregion

	// * PUBLIC METHODS - STYLE INITIALIZATION * //
	// #region PUBLIC METHODS - STYLE INITIALIZATION
	/**
	 * Init all colors that are used in styles, mostly called from grm.ui.initTheme().
	 */
	initStyleColors() {
		this.setStyleBlend();

		if (grSet.styleAlternative) {
			this.styleAlternativeColors();
		}
		if (grSet.styleAlternative2) {
			this.styleAlternative2Colors();
		}

		if (grAlias.RF || grAlias.RF2 || grAlias.RFA) {
			this.initRebornFusion();
		}
	}

	/**
	 * Init style Black And White Reborn, dynamically change between style Black and white 1 and 2.
	 */
	initBlackAndWhiteReborn() {
		if (!grSet.styleBlackAndWhiteReborn) return;

		if (grCol.imgLuminance > 0.33) {
			grSet.styleBlackAndWhite2 = true; // White background
			grSet.styleBlackAndWhite = false;
		}
		else {
			grSet.styleBlackAndWhite = true; // Black background
			grSet.styleBlackAndWhite2 = false;
		}
	}

	/**
	 * Initializes style Reborn Fusion, Reborn Fusion 2, Reborn Fusion Accent.
	 */
	initRebornFusion() {
		if (!fb.IsPlaying || grm.ui.isStreaming || grm.ui.isPlayingCD || grm.ui.noAlbumArtStub) {
			return;
		}
		this.styleRebornFusionColors();
	}
	// #endregion
}
