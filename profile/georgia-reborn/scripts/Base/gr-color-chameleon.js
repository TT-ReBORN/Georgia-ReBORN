/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Chameleon                                * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    06-07-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/**
 * A class that is responsible for the standalone chameleon single color animator.
 * For animating the full theme, use {@link ChameleonColorSystem}.
 *
 * @example
 * const anim = new ChameleonColor(400);
 * anim.start(oldBg, newBg, c => {
 *     grCol.bg = c;
 *     window.Repaint();
 * });
 */
class ChameleonColor {
	/**
	 * Creates a single-color animator instance.
	 * @param {number} [duration] - The transition duration in milliseconds.
	 * @param {number} [fps] - The target frame rate.
	 */
	constructor(duration = 400, fps = 30) {
		// * COLOR * //
		// #region COLOR
		const defaultColor = RGB(255, 255, 255);
		/** @private @type {number} The current active interpolated ARGB color. */
		this._current = defaultColor;
		/** @private @type {number} The starting ARGB color.*/
		this._fromColor = defaultColor;
		/** @private @type {number} The target ARGB color.*/
		this._toColor = defaultColor;
		/** @private @type {Object} The starting color converted to OKLCH coordinates. */
		this._fromOKLCH = null;
		/** @private @type {Object} The target color converted to OKLCH coordinates. */
		this._toOKLCH = null;
		// #endregion

		// * ANIMATION * //
		// #region ANIMATION
		/** @public @type {number} The transition duration in milliseconds. */
		this.duration = duration;
		/** @public @type {number} The timer tick interval in milliseconds (~1000/fps). */
		this.interval = Math.round(1000 / fps);
		/** @private @type {number} The progress tracking delta parameter (0 to 1). */
		this._t = 1;
		/** @private @type {ReturnType<typeof setInterval>|null} The animation frame timer loop. */
		this._timer = null;
		// #endregion
	}

	// * GETTERS * //
	// #region GETTERS
	/** @public @type {number} The current interpolated ARGB color value. */
	get current() {
		return this._current;
	}

	/** @public @returns {boolean} The flag indicating if the animation transition timer is actively running. */
	get isRunning() {
		return this._timer !== null;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Clears the transition timer and resets the timer reference.
	 */
	clearTimer() {
		if (this._timer) {
			clearInterval(this._timer);
			this._timer = null;
		}
	}

	/**
	 * Sets the color immediately, cancelling any running animation.
	 * @param {number} color - The ARGB color value to apply.
	 */
	set(color) {
		this.clearTimer();
		this._fromColor = this._toColor = this._current = color;
		this._fromOKLCH = this._toOKLCH = RGBtoOKLCH(color);
		this._t = 1;
	}

	/**
	 * Starts a transition to the target color.
	 * If already animating, continues from the current blend value to prevent any visual snap.
	 * @param {number} fromColor - The initial ARGB color value.
	 * @param {number} toColor - The target ARGB color value.
	 * @param {function(number):void} onTick - Called each frame with the current interpolated ARGB color.
	 */
	start(fromColor, toColor, onTick) {
		this.clearTimer();

		this._fromColor = this._t < 1 ? this._current : fromColor;
		this._toColor = toColor;
		this._current = this._fromColor;
		this._fromOKLCH = RGBtoOKLCH(this._fromColor);
		this._toOKLCH = RGBtoOKLCH(this._toColor);
		this._t = 0;

		const step = this.interval / Math.max(1, this.duration);

		this._timer = setInterval(() => {
			this._t = Math.min(1, this._t + step);

			this._current = LerpOKLCH(
				this._fromColor, this._toColor,
				this._fromOKLCH, this._toOKLCH,
				Easing(grSet.chameleonEasing, this._t)
			);

			if (onTick) onTick(this._current);
			if (this._t >= 1) this.clearTimer();
		}, this.interval);
	}

	/**
	 * Stops the animation and immediately snaps to the target color.
	 */
	stop() {
		this.clearTimer();
		this._current = this._toColor;
		this._t = 1;
	}
	// #endregion
}


/**
 * A class that is responsible for the full chameleon color transition system.
 */
class ChameleonColorSystem {
	/**
	 * Creates the master chameleon transition manager system.
	 */
	constructor() {
		// * ANIMATION * //
		// #region ANIMATION
		/** @private @type {number} The tracked ticker frame count utilized for layout throttling. */
		this._frameCount = 0;
		/** @private @type {Array<{obj: Object, prop: string, from: number, to: number, t: number, step: number, fromOKLCH: Object, toOKLCH: Object}>} The array holding active pending property updates. */
		this._pending = [];
		/** @private @type {number} The ticks per bitmap update utilized for layout throttling. */
		this._ticksPerBitmapUpdate = 0;
		/** @private @type {ReturnType<typeof setInterval>|null} The master theme interpolation loop interval. */
		this._timer = null;
		// #endregion

		// * COLOR SNAPSHOTS * //
		// #region COLOR SNAPSHOTS
		/** @private @type {boolean} The flag tracking if any valid watch parameters altered during calculation updates. */
		this._anyPropsChanged = false;
		/** @private @type {boolean} The tracker validating if the midpoint transition logo style adjustments finished. */
		this._lightBgSwitched = false;
		/** @private @type {Record<string, *>} The captured `grCol.lightBgDetails` rules before theme modification. */
		this._lightBgSnapshot = {};
		/** @private @type {Record<string, *>} The calculated light background configuration variables. */
		this._lightBgTarget = {};
		/** @private @type {Record<string, number>} The snapshot storing the Main appearance profiles. */
		this._mainSnapshot = {};
		/** @private @type {Record<string, number>} The snapshot storing the Playlist appearance profiles. */
		this._plSnapshot = {};
		/** @private @type {Record<string, number>} The snapshot storing the Library appearance profiles. */
		this._libSnapshot = {};
		/** @private @type {Record<string, number>} The snapshot storing Library Explorer appearance profiles. */
		this._libExSnapshot = {};
		/** @private @type {Record<string, number>} The snapshot storing Biography data appearance profiles. */
		this._bioSnapshot = {};
		// #endregion

		// * COLOR PALETTE CYCLING * //
		// #region PALETTE CYCLING
		/** @private @type {ReturnType<typeof setTimeout>|null} The timing container handle processing dynamic cycle delays. */
		this._cycleTimer = null;
		/** @private @type {number[]} The extracted color codes ordered according to color weight parameters. */
		this._paletteColors = [];
		/** @private @type {number[]} The cache containing hue metadata coordinates. */
		this._paletteHues = [];
		/** @private @type {Array<Object>} The comprehensive weighting objects containing mode logic metadata. */
		this._paletteWeightedColors = [];
		/** @private @type {number} The current sequence point inside the palette collection array. */
		this._paletteIndex = 0;
		/** @private @type {number[]} The saved now-playing palette colors for restoration after Explorer closes. */
		this._savedPaletteColors = [];
		/** @private @type {number[]} The saved now-playing palette hue cache. */
		this._savedPaletteHues = [];
		/** @private @type {Array<Object>} The saved now-playing weighted color objects. */
		this._savedPaletteWeightedColors = [];
		// #endregion

		// * COLOR PROPERTIES * //
		// #region COLOR PROPERTIES
		/** @public @type {string[]} The tracked playlist color properties monitored during color sweeps. */
		this.colorPlaylistProps = [
			// * MAIN COLORS * //
			'bg',

			// * PLAYLIST MANAGER COLORS * //
			'plman_bg',
			'plman_text_normal',
			'plman_text_hovered',
			'plman_text_pressed',

			// * HEADER COLORS * //
			'header_nowplaying_bg',
			'header_sideMarker',
			'header_artist_normal',
			'header_artist_playing',
			'header_album_normal',
			'header_album_playing',
			'header_info_normal',
			'header_info_playing',
			'header_date_normal',
			'header_date_playing',
			'header_line_normal',
			'header_line_playing',

			// * ROW COLORS * //
			'row_nowplaying_bg',
			'row_stripes_bg',
			'row_selection_bg',
			'row_selection_frame',
			'row_sideMarker',
			'row_title_normal',
			'row_title_playing',
			'row_title_selected',
			'row_title_hovered',
			'row_rating_color',
			'row_disc_subheader_line',
			'row_drag_line',
			'row_drag_line_reached',

			// * SCROLLBAR COLORS * //
			'sbar_btn_normal',
			'sbar_btn_hovered',
			'sbar_thumb_normal',
			'sbar_thumb_hovered',
			'sbar_thumb_drag',
		];

		/** @public @type {string[]} The tracked library color properties monitored during color sweeps. */
		this.colorLibraryProps = [
			// * MAIN COLORS * //
			'bg',
			'rowStripes',
			'nowPlayingBg',
			'sideMarker',
			'selectionFrame',
			'selectionFrame2',
			'hoverFrame',

			// * NODE COLORS * //
			'iconPlus',
			'iconPlus_h',
			'iconPlus_sel',
			'iconPlusBg',
			'iconMinus_e',
			'iconMinus_c',
			'iconMinus_h',

			// * TEXT COLORS * //
			'text',
			'text_h',
			'text_nowp',
			'textSel',
			'txt',
			'txt_h',
			'txt_box',
			'count',
			'search',

			// * BUTTON COLORS * //
			'searchBtn',
			'crossBtn',
			'filterBtn',
			'settingsBtn',
			'line',
			's_line',

			// * SCROLLBAR COLORS * //
			'sbarBtns',
			'sbarNormal',
			'sbarHovered',
			'sbarDrag',
		];

		/** @public @type {string[]} The tracked Library Explorer color properties monitored during color sweeps. */
		this.colorLibraryExplorerProps = [
			// * BACKGROUND * //
			'column_bg',

			// * COLUMN * //
			'column_line',
			'column_text_normal',
			'column_text_hovered',
			'column_text_playing',
			'column_text_selected',

			// * GRID - ARTIST VIEW * //
			'grid_playing_bg',
			'grid_selection_bg',
			'grid_selection_frame',
			'grid_sideMarker',
			'grid_title_normal',
			'grid_title_hovered',
			'grid_title_playing',
			'grid_title_selected',

			// * TRACK ROWS - ALBUM VIEW * //
			'row_stripes_bg',
			'row_playing_bg',
			'row_selection_bg',
			'row_selection_frame',
			'row_sideMarker',
			'row_title_normal',
			'row_title_hovered',
			'row_title_playing',
			'row_title_selected',

			// * RATING * //
			'rating_star',
			'rating_star_shadow',

			// * SCROLLBAR * //
			'sbar_normal',
			'sbar_hovered',
			'sbar_drag',

			// * BUTTONS * //
			'closeBtn',
			'closeBtn_bg'
		];

		/** @public @type {string[]} The tracked biography color properties monitored during color sweeps. */
		this.colorBiographyProps = [
			// * MAIN COLORS * //
			'bg',
			'bg2',
			'rowStripes',

			// * HEADER COLORS * //
			'headingText',
			'source',
			'accent',
			'bottomLine',
			'centerLine',
			'sectionLine',

			// * TEXT COLORS * //
			'text',
			'summary',
			'track',

			// * POPUP COLORS * //
			'popupBg',
			'popupText',

			// * MISC COLORS * //
			'lyricsNormal',
			'lyricsHighlight',
			'lyricsShadow',
			'noPhotoStubBg',
			'noPhotoStubText',

			// * SCROLLBAR COLORS * //
			'sbarBtns',
			'sbarNormal',
			'sbarHovered',
			'sbarDrag'
		];

		/** @public @type {string[]} The tracked main color properties monitored during color sweeps. */
		this.colorMainProps = [
			// * MAIN COLORS * //
			'bg',
			'shadow',
			'discArtShadow',
			'noAlbumArtStub',

			// * LOWER BAR COLORS * //
			'lowerBarArtist',
			'lowerBarTitle',
			'lowerBarTime',
			'lowerBarLength',

			// * LYRICS COLORS * //
			'lyricsNormal',
			'lyricsHighlight',
			'lyricsShadow',

			// * DETAILS COLORS * //
			'detailsBg',
			'detailsText',
			'detailsRating',
			'detailsHotness',
			'timelineAdded',
			'timelinePlayed',
			'timelineUnplayed',
			'timelineFrame',

			// * POPUP COLORS * //
			'popupBg',
			'popupText',

			// * TOP MENU BUTTON COLORS * //
			'menuBgColor',
			'menuStyleBg',
			'menuRectStyleEmbossTop',
			'menuRectStyleEmbossBottom',
			'menuRectNormal',
			'menuRectHovered',
			'menuRectDown',
			'menuTextNormal',
			'menuTextHovered',
			'menuTextDown',

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			'transportEllipseBg',
			'transportEllipseNormal',
			'transportEllipseHovered',
			'transportEllipseDown',
			'transportStyleBg',
			'transportStyleTop',
			'transportStyleBottom',
			'transportIconNormal',
			'transportIconHovered',
			'transportIconDown',

			// * PROGRESS BAR COLORS * //
			'progressBar',
			'progressBarStreaming',
			'progressBarFrame',
			'progressBarFill',
			'styleProgressBar',
			'styleProgressBarLineTop',
			'styleProgressBarLineBottom',
			'styleProgressBarFill',

			// * PEAKMETER BAR COLORS * //
			'peakmeterBarProg',
			'peakmeterBarProgFill',
			'peakmeterBarFillTop',
			'peakmeterBarFillMiddle',
			'peakmeterBarFillBack',
			'peakmeterBarVertProgFill',
			'peakmeterBarVertFill',
			'peakmeterBarVertFillPeaks',

			// * WAVEFORM BAR COLORS * //
			'waveformBarFillFront',
			'waveformBarFillBack',
			'waveformBarFillPreFront',
			'waveformBarFillPreBack',
			'waveformBarIndicator',

			// * VOLUME BAR COLORS * //
			'volumeBar',
			'volumeBarFill',
			'volumeBarFrame',
			'styleVolumeBar',
			'styleVolumeBarFill',

			// * STYLE COLORS * //
			'styleBevel',
			'styleGradient',
			'styleGradient2',
			'styleAlternative'
		];
		// #endregion
	}

	// * GETTERS * //
	// #region GETTERS
	/** @public @returns {boolean} The flag indicating if the system animation transitions are fully finished. */
	get isAnimFinished() {
		return this._pending.length === 0;
	}

	/** @public @returns {boolean} The flag indicating if the animation transition timer is actively running. */
	get isRunning() {
		return this._timer !== null;
	}
	// #endregion

	// * PRIVATE METHODS - COMMON * //
	// #region PRIVATE METHODS - COMMON
	/**
	 * Enqueues color properties into the pending animation queue if their values have changed.
	 * @param {string[]} props - The array of property names to monitor.
	 * @param {Object} store - The snapshot object containing old color values.
	 * @param {Object} src - The target object containing new color values.
	 * @param {number} step - The precalculated animation step ratio.
	 * @private
	 */
	_enqueue(props, store, src, step) {
		// New properties with no snapshot use the bg color as the fade-from start
		const bgFallback = store.bg != null ? store.bg : src.bg;

		for (const prop of props) {
			const newColor = src[prop];
			if (newColor == null) continue;

			const oldColor = store[prop] != null ? store[prop] : bgFallback;
			if (oldColor == null || oldColor === newColor) continue;

			this._anyPropsChanged = true;
			src[prop] = oldColor;
			this._queue(src, prop, oldColor, newColor, step);
		}
	}

	/**
	 * Inserts or retargets a pending transition entry.
	 * On rapid track changes, `from` arrives already holding the mid-blend value
	 * captured by beforeColorUpdate(), so the new animation continues smoothly
	 * from wherever the previous one left off rather than snapping back to start.
	 * @param {Object} obj - The target color object to modify.
	 * @param {string} prop - The property name of the color to animate.
	 * @param {number} from - The starting ARGB color.
	 * @param {number} to - The target ARGB color.
	 * @param {number} step - The frame increment value.
	 * @private
	 */
	_queue(obj, prop, from, to, step) {
		const idx = this._pending.findIndex(
			a => a.obj === obj && a.prop === prop
		);

		if (idx === -1) {
			this._pending.push({
				obj, prop, from, to, t: 0, step,
				fromOKLCH: RGBtoOKLCH(from),
				toOKLCH: RGBtoOKLCH(to)
			});
		} else {
			const entry = this._pending[idx];
			entry.from = from;
			entry.fromOKLCH = RGBtoOKLCH(from);
			entry.to = to;
			entry.toOKLCH = RGBtoOKLCH(to);
			entry.t = 0;
			entry.step = step;
		}
	}

	/**
	 * Snapshots the specified color properties by copying them from the source to the store.
	 * @param {string[]} props - The property names to copy.
	 * @param {Object} store - The destination object where snapshots are saved.
	 * @param {Object} src - The source color object.
	 * @private
	 */
	_snap(props, store, src) {
		for (const p of props) {
			if (src[p] == null) {
				delete store[p];
			} else {
				store[p] = src[p];
			}
		}
	}

	/**
	 * Starts the master animation interval timer.
	 * @private
	 */
	_startTimer() {
		if (this._timer) return;

		this._frameCount = 0;
		this._ticksPerBitmapUpdate = Math.max(1, Math.round(
			(1000 / grSet.chameleonBitmapUpdateRate) / grSet.chameleonRefreshRate
		));
		this._timer = setInterval(() => this._tick(), grSet.chameleonRefreshRate);
	}

	/**
	 * Handles one animation frame tick, advancing all pending color interpolations,
	 * triggering repaints, and handling throttled UI updates.
	 * @private
	 */
	_tick() {
		const didThrottledUpdate = (++this._frameCount % this._ticksPerBitmapUpdate === 0);
		const displayDetailsWithLogoSwap = !this._lightBgSwitched && this._pending.length > 0 && grm.ui.displayDetails;
		const easing = grSet.chameleonEasing;

		// * Captured while advancing the queue below: the eased progress of grCol.detailsText's own OKLCH transition this tick.
		let detailsTextEasedT = null;

		// * Advance every pending transition (iterate backwards for safe in-place splice)
		for (let i = this._pending.length - 1; i >= 0; i--) {
			const a = this._pending[i];

			a.t = Math.min(1, a.t + a.step);
			const easedT = Easing(easing, a.t);
			a.obj[a.prop] = LerpOKLCH(a.from, a.to, a.fromOKLCH, a.toOKLCH, easedT);

			if (a.obj === grCol && a.prop === 'detailsText') {
				detailsTextEasedT = easedT;
			}

			if (a.t >= 1) {
				this._pending.splice(i, 1);
			}
		}

		// * some UI components need unthrottled recreations to prevent ugly visible color glitches due to low grSet.chameleonBitmapUpdateRate
		this.updateUIComponentsUnthrottled();

		// * Throttled recreations (~12 fps at default grSet.chameleonBitmapUpdateRate)
		if (didThrottledUpdate) this.updateUIComponents();

		// * Swap Details logos the moment grCol.detailsText's own transition crosses its midpoint.
		if (displayDetailsWithLogoSwap) {
			const snapshotLight = this._lightBgSnapshot.lightBgDetails;
			const targetLight = this._lightBgTarget.lightBgDetails;

			if (snapshotLight !== targetLight && detailsTextEasedT !== null && detailsTextEasedT >= 0.5) {
				this.initDetailsLightBg();
			}
		}

		// * All animation finished
		if (this.isAnimFinished) {
			this.clearAnimationTimer();
			this.initDetailsLightBg();
			if (!didThrottledUpdate) this.updateUIComponents();
			this.startPaletteCycle();
		}

		window.Repaint();
	}
	// #endregion

	// * PRIVATE METHODS - PALETTE MODE SELECTORS * //
	// #region PRIVATE METHODS - PALETTE MODE SELECTORS
	/**
	 * Finds and sets the palette index whose hue minimizes the diff returned by `getDiff`.
	 * @param {function(number): number} getDiff - Returns a hue-distance score for a given candidate hue.
	 * @private
	 */
	_findBestPaletteIndex(getDiff) {
		const len = this._paletteColors.length;
		let bestIdx  = (this._paletteIndex + 1) % len;
		let bestDiff = Infinity;

		for (let i = 0; i < len; i++) {
			if (i === this._paletteIndex) continue;
			const diff = getDiff(this._paletteHues[i]);
			if (diff < bestDiff) {
				bestDiff = diff;
				bestIdx  = i;
			}
		}

		this._paletteIndex = bestIdx;
	}

	/**
	 * Advances palette index one step in linear sequence.
	 * @private
	 */
	_selectPaletteColorAll() {
		this._paletteIndex = (this._paletteIndex + 1) % this._paletteColors.length;
	}

	/**
	 * Advances palette index to the palette entry whose hue is closest to the current hue.
	 * Stays within the same color family extracted from the album art.
	 * @private
	 */
	_selectPaletteColorMonochromatic() {
		const curH = this._paletteHues[this._paletteIndex];
		this._findBestPaletteIndex(h => GetCircularHueDifference(h, curH));
	}

	/**
	 * Advances palette index to the next adjacent color using strictly clockwise angular distance.
	 * The positive-only (clockwise) drift prevents ping-ponging between two visually similar colors.
	 * @private
	 */
	_selectPaletteColorAnalogous() {
		const curH = this._paletteHues[this._paletteIndex];
		this._findBestPaletteIndex(h => (h - curH + 360) % 360);
	}

	/**
	 * Advances palette index to the color closest to a split-complementary hue: (H+150°) or (H+210°).
	 * More harmonious than a direct complementary pair - the slight offset softens the contrast.
	 * @private
	 */
	_selectPaletteColorSplitComplementary() {
		const curH = this._paletteHues[this._paletteIndex];
		const h150 = (curH + 150) % 360;
		const h210 = (curH + 210) % 360;

		this._findBestPaletteIndex(h => Math.min(
			GetCircularHueDifference(h, h150), GetCircularHueDifference(h, h210)
		));
	}

	/**
	 * Advances palette index to the color closest to the direct complementary hue (H+180°).
	 * @private
	 */
	_selectPaletteColorComplementary() {
		const curH = this._paletteHues[this._paletteIndex];
		const compH = (curH + 180) % 360;
		this._findBestPaletteIndex(h => GetCircularHueDifference(h, compH));
	}

	/**
	 * Advances palette index to the color closest to a triadic hue: (H+120°) or (H+240°).
	 * @private
	 */
	_selectPaletteColorTriadic() {
		const curH = this._paletteHues[this._paletteIndex];
		const h120 = (curH + 120) % 360;
		const h240 = (curH + 240) % 360;

		this._findBestPaletteIndex(h => Math.min(
			GetCircularHueDifference(h, h120), GetCircularHueDifference(h, h240)
		));
	}

	/**
	 * Advances palette index to the color closest to a tetradic hue: (H+90°) or (H+270°) - square tetradic.
	 * @private
	 */
	_selectPaletteColorTetradic() {
		const curH = this._paletteHues[this._paletteIndex];
		const h90  = (curH +  90) % 360;
		const h270 = (curH + 270) % 360;

		this._findBestPaletteIndex(h => Math.min(
			GetCircularHueDifference(h, h90), GetCircularHueDifference(h, h270)
		));
	}

	/**
	 * Advances palette index to the next perceptually distinct color using OKLAB Euclidean distance.
	 * Falls back to a plain linear +1 step if no colour clears the threshold after a full sweep.
	 * @private
	 */
	_selectPaletteColorDistinct() {
		const len = this._paletteColors.length;
		const cur = this._paletteColors[this._paletteIndex];
		const MIN_OKLAB_DIST = 0.15;
		let idx = (this._paletteIndex + 1) % len;
		let attempts = 0;

		while (attempts < len - 1) {
			if (OKLABColorDistance(cur, this._paletteColors[idx]) >= MIN_OKLAB_DIST) break;
			idx = (idx + 1) % len;
			attempts++;
		}

		this._paletteIndex = attempts >= len - 1 ? (this._paletteIndex + 1) % len : idx;
	}

	/**
	 * Advances palette index to a random position different from the current one.
	 * @private
	 */
	_selectPaletteColorRandom() {
		let idx;
		let attempts = 0;
		const attemptsMax = 10;
		const len = this._paletteColors.length;

		do {
			idx = Math.floor(Math.random() * len);
			attempts++;
		}
		while (idx === this._paletteIndex && len > 1 && attempts < attemptsMax);

		this._paletteIndex = idx;
	}
	// #endregion

	// * PUBLIC METHODS - COLORS * //
	// #region PUBLIC METHODS - COLORS
	/**
	 * Queues smooth transitions for every changed color, then starts the master timer.
	 * Call immediately AFTER album art / theme color computation.
	 */
	afterColorUpdate() {
		if (!grSet.chameleon || !grm.ui.loadingThemeComplete ||
			grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2 || grSet.styleBlackAndWhiteReborn) {
			return;
		}

		this._anyPropsChanged = false;
		const step = grSet.chameleonRefreshRate / Math.max(1, grSet.chameleonDuration);

		// * grCol properties always have defined old values, no "fade-from-bg" fallback needed.
		for (const prop of this.colorMainProps) {
			const oldColor = this._mainSnapshot[prop];
			const newColor = grCol[prop];

			if (oldColor == null || newColor == null || oldColor === newColor) {
				continue;
			}

			this._anyPropsChanged = true;
			grCol[prop] = oldColor; // Reset to old so first paint is correct
			this._queue(grCol, prop, oldColor, newColor, step);
		}

		// * Prevent instant white flash on the very first startup when switching from normal to playing row
		if (this._plSnapshot.row_nowplaying_bg == null && pl.col.row_nowplaying_bg != null) {
			this._plSnapshot.row_title_playing = this._plSnapshot.row_title_normal;
		}

		this._enqueue(this.colorPlaylistProps, this._plSnapshot, pl.col, step);
		this._enqueue(this.colorLibraryProps, this._libSnapshot, lib.ui.col, step);
		this._enqueue(this.colorLibraryExplorerProps, this._libExSnapshot, lib.ex.color, step);
		this._enqueue(this.colorBiographyProps, this._bioSnapshot, bio.ui.col, step);

		if (!this._anyPropsChanged) return;

		// * Light bg restoration
		this.initDetailsLightBgProps('target');
		this.initDetailsLightBg(true);

		// * Refresh
		this.updateUIComponents();
		this._startTimer();
	}

	/**
	 * Snapshots all watched color properties.
	 * Call immediately BEFORE album art / theme color computation.
	 */
	beforeColorUpdate() {
		if (!grSet.chameleon) return;

		this.initDetailsLightBgProps('snapshot');

		this._snap(this.colorMainProps, this._mainSnapshot, grCol);
		this._snap(this.colorPlaylistProps, this._plSnapshot, pl.col);
		this._snap(this.colorLibraryProps, this._libSnapshot, lib.ui.col);
		this._snap(this.colorLibraryExplorerProps, this._libExSnapshot, lib.ex.color);
		this._snap(this.colorBiographyProps, this._bioSnapshot, bio.ui.col);
	}

	/**
	 * Sets the current album's color palette sorted by visual weight for cycling.
	 * @param {Array<{col: {val: number}, freq: number}>} colorScheme - The raw output of `GetAlbumArtColors`.
	 * @param {boolean} [saveNowPlaying] - Whether to save the current now-playing color palette.
	 */
	setAlbumArtPaletteColors(colorScheme, saveNowPlaying = false) {
		if (!colorScheme || colorScheme.length < 2) return;

		this.stopPaletteCycle();
		this._paletteIndex = 0;
		this._paletteColors = [];
		this._paletteHues = [];
		this._paletteWeightedColors = [];

		const minFreq = grm.colorManager.getAdaptiveMinFrequency(colorScheme);
		const minLum  = grm.colorManager.getMinLuminance(colorScheme);
		const maxLum  = grm.colorManager.getMaxLuminance();
		const weighted = grm.colorManager.getAlbumArtWeightedColors(colorScheme, minFreq, minLum, maxLum);
		weighted.sort((a, b) => b.weight - a.weight);

		const filtered = weighted.filter(c => c.isValidPrimary).slice(0, 14);
		this._paletteColors = filtered.map(c => c.col.val);
		this._paletteHues = filtered.map(c => RGBtoOKLCH(c.col.val).H); // Optimized cache for cyclic loops
		this._paletteWeightedColors = filtered; // Full objects for mode logic + secondary selection

		if (!saveNowPlaying) return;

		this._savedPaletteColors = [...this._paletteColors];
		this._savedPaletteHues  = [...this._paletteHues];
		this._savedPaletteWeightedColors = [...this._paletteWeightedColors];
	}

	/**
	 * Immediately snaps one color property to the given value, cancelling its pending
	 * animation without disrupting any other ongoing transitions.
	 * Use when a layout switch requires a specific color to reflect its new value instantly
	 * rather than animating from the previous state.
	 * @param {Object} obj - The target color object (e.g. grCol).
	 * @param {string} prop - The property name.
	 * @param {number} color - The ARGB color to apply immediately.
	 */
	snapProperty(obj, prop, color) {
		obj[prop] = color;

		const idx = this._pending.findIndex(a => a.obj === obj && a.prop === prop);

		if (idx !== -1) {
			this._pending.splice(idx, 1);
		}

		// Keep the snapshot in sync so the next beforeColorUpdate starts from the correct value
		if (obj === grCol && this._mainSnapshot[prop] !== undefined) {
			this._mainSnapshot[prop] = color;
		}
	}
	// #endregion

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes the chameleon cycle animation.
	 */
	initChameleonCycle() {
		if (fb.IsPlaying && grSet.chameleon && grSet.chameleonMode === 'full') {
			this.startPaletteCycle();
		} else {
			this.stopPaletteCycle();
		}
	}

	/**
	 * Initializes or captures the light background properties for snapshots or target values.
	 * @param {'snapshot'|'target'} type - The operation type specifying whether to capture snapshots or targets.
	 */
	initDetailsLightBgProps(type) {
		if (type === 'snapshot') {
			this._lightBgSnapshot = {
				lightBgMain: grCol.lightBgMain,
				lightBgDetails: grCol.lightBgDetails
			};
		}
		else if (type === 'target') {
			this._lightBgTarget = {
				lightBgMain: grCol.lightBgMain,
				lightBgDetails: grCol.lightBgDetails
			};

			this._lightBgSwitched = false;
		}
	}

	/**
	 * Initializes the light background states and updates Details panel logos at the midpoint or start of transitions.
	 * @param {boolean} [checkLightBg] - Whether to perform a check against the snapshot before updating.
	 */
	initDetailsLightBg(checkLightBg = false) {
		if (checkLightBg) {
			const { lightBgDetails: snapDetails, lightBgMain: snapMain } = this._lightBgSnapshot;
			const { lightBgDetails: targetDetails, lightBgMain: targetMain } = this._lightBgTarget;

			const update =
				(snapDetails !== undefined && snapDetails !== targetDetails)
				||
				(snapMain !== undefined && snapMain !== targetMain);

			if (update) {
				grCol.lightBgMain = snapMain;
				grCol.lightBgDetails = snapDetails;
				this.updateDetailsLogos();
				return;
			}
		}

		if (this._lightBgSwitched) return;

		this._lightBgSwitched = true;
		let changed = false;

		const lightDetails = this._lightBgTarget.lightBgDetails !== undefined
			&& grCol.lightBgDetails !== this._lightBgTarget.lightBgDetails;

		const lightMain = this._lightBgTarget.lightBgMain !== undefined
			&& grCol.lightBgMain !== this._lightBgTarget.lightBgMain;

		if (lightDetails) {
			grCol.lightBgDetails = this._lightBgTarget.lightBgDetails;
			changed = true;
		}
		if (lightMain) {
			grCol.lightBgMain = this._lightBgTarget.lightBgMain;
			changed = true;
		}
		if (changed) {
			this.updateDetailsLogos();
		}
	}
	// #endregion

	// * PUBLIC METHODS - PALETTE CYCLING * //
	// #region PALETTE CYCLING
	/**
	 * Clears the master animation interval timer.
	 */
	clearAnimationTimer() {
		if (this._timer) {
			clearInterval(this._timer);
			this._timer = null;
		}
	}

	/**
	 * Advances to the next palette color and triggers a full theme transition.
	 * Reschedules the next shift once the transition completes.
	 */
	cyclePaletteColor() {
		const nextColor = this.selectPaletteColor();

		if (nextColor == null) return;

		this.beforeColorUpdate();
		const scaledColor = grm.colorManager.applyColorSaturation(nextColor, grSet.albumArtColorSaturation);

		// * Reborn Fusion needs both primary AND secondary updated;
		// * otherwise only the primary shifts while the panel bg/accent stays stuck on the old secondary.
		if (grm.colorManager.isRebornFusion() && this._paletteWeightedColors.length >= 2) {
			const primaryObj = grm.colorManager.getCachedColor(scaledColor);
			const secondaryObj = grm.colorManager.getSecondaryFromPalette(primaryObj, this._paletteWeightedColors);
			const scaledSecondary = secondaryObj ? grm.colorManager.applyColorSaturation(secondaryObj.val, grSet.albumArtColorSaturation) : undefined;
			grm.colorManager.setPrimaryColor(scaledColor, scaledSecondary);
			return;
		}

		grm.colorManager.setPrimaryColor(scaledColor);
	}

	/**
	 * Restores the saved now-playing palette colors.
	 */
	restoreNowPlayingPalette() {
		if (this._savedPaletteColors.length === 0) return;

		this.stopPaletteCycle();

		this._paletteIndex = 0;
		this._paletteColors = [...this._savedPaletteColors];
		this._paletteHues = [...this._savedPaletteHues];
		this._paletteWeightedColors = [...this._savedPaletteWeightedColors];
	}

	/**
	 * Selects the next palette color when cycling is active.
	 * Available modes (ordered from most cohesive to most varied):
	 * `all` | `monochromatic` | `analogous` | `splitComplementary` |
	 * `complementary` | `triadic` | `tetradic` | `distinct` | `random`
	 * @returns {number} The next palette color (packed RGB).
	 */
	selectPaletteColor() {
		if (this._paletteColors.length === 0) {
			return null;
		}

		switch (grSet.chameleonCycleColor) {
			case 'all': {
				this._selectPaletteColorAll();
				break;
			}
			case 'monochromatic': {
				this._selectPaletteColorMonochromatic();
				break;
			}
			case 'analogous': {
				this._selectPaletteColorAnalogous();
				break;
			}
			case 'splitComplementary': {
				this._selectPaletteColorSplitComplementary();
				break;
			}
			case 'complementary': {
				this._selectPaletteColorComplementary();
				break;
			}
			case 'triadic': {
				this._selectPaletteColorTriadic();
				break;
			}
			case 'tetradic': {
				this._selectPaletteColorTetradic();
				break;
			}
			case 'distinct': {
				this._selectPaletteColorDistinct();
				break;
			}
			case 'random': {
				this._selectPaletteColorRandom();
				break;
			}
			default: {
				this._selectPaletteColorAll();
				break;
			}
		}

		return this._paletteColors[this._paletteIndex];
	}

	/**
	 * Schedules the next palette color shift.
	 * Only runs in 'full' mode with more than 2 valid palette colors.
	 */
	startPaletteCycle() {
		this.stopPaletteCycle();

		if (!fb.IsPlaying || !grSet.chameleon || grSet.chameleonMode !== 'full' || this._paletteColors.length < 2
			||
			(grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2 || grSet.styleBlackAndWhiteReborn)
			||
			!['white', 'black', 'reborn', 'random'].includes(grSet.theme)) {
			return;
		}

		this._cycleTimer = setTimeout(() => {
			this._cycleTimer = null;
			this.cyclePaletteColor();
		}, grSet.chameleonCycleTime * 1000);
	}

	/**
	 * Stops palette cycling without interrupting any running color transitions.
	 */
	stopPaletteCycle() {
		if (this._cycleTimer) {
			clearTimeout(this._cycleTimer);
			this._cycleTimer = null;
		}
	}
	// #endregion

	// * PUBLIC METHODS - UPDATE * //
	// #region PUBLIC METHODS - UPDATE
	/**
	 * Snaps all pending transitions immediately to their target values and stops palette cycling.
	 */
	stopAll() {
		this.stopPaletteCycle();
		this.clearAnimationTimer();

		for (const a of this._pending) {
			a.obj[a.prop] = a.to;
		}
		this._pending = [];

		this.initDetailsLightBg();
		this.updateUIComponents();
		window.Repaint();
	}

	/**
	 * Updates the button bitmaps to match the current color state during transition.
	 */
	updateButtons() {
		// * Main buttons always updated
		if (grm.ui.ww > 1 && grm.ui.wh > 1) {
			grm.button.createButtons(grm.ui.ww, grm.ui.wh, true, false);
			this.isAnimFinished && grm.button.initButtonState();
		}

		// * Playlist scrollbar updated only when visible
		if (grm.ui.displayPlaylist && plSet.show_scrollbar) {
			pl.playlist.updateScrollbarColors();
		}

		// * Library scrollbar updated only when visible
		if (grm.ui.displayLibrary && lib.sbar.scrollbar.zone) {
			lib.sbar.setCol();
			lib.but.createImages();
		}

		// * Biography scrollbar updated only when visible
		if (grm.ui.displayBiography && (bio.alb_scrollbar.scrollbar.zone || bio.art_scrollbar.scrollbar.zone)) {
			bio.alb_scrollbar.setCol();
			bio.art_scrollbar.setCol();
			bio.but.createImages('all');
		}
	}

	/**
	 * Updates codec and channel logos for the Details panel so they match the current light background variants.
	 */
	updateDetailsLogos() {
		if (!grm.ui.displayDetails) return;
		grm.details.updateGridLogos();
	}

	/**
	 * Updates playlist header caches and triggers an update for all playlist headers.
	 */
	updatePlaylistHeaders() {
		pl.cache_header = true;
		pl.playlist.update_playlist_headers();
	}

	/**
	 * Updates the per-item color values in the Biography text arrays from the current palette roles.
	 */
	updateBioTextColors() {
		if (!grm.ui.displayBiography) return;

		const bioArr = bio.txt.bio && bio.txt.bio.arr;
		const revArr = bio.txt.rev && bio.txt.rev.arr;

		if (!bioArr && !revArr) return;

		const colMap = {
			bg2: bio.ui.col.bg2,
			rowStripes: bio.ui.col.rowStripes,
			accent:  bio.ui.col.accent,
			source:  bio.ui.col.source,
			summary: bio.ui.col.summary,
			text:    bio.ui.col.text,
			track:   bio.ui.col.track
		};

		if (bioArr) {
			for (const v of bioArr) {
				if (v.colKey && v.colKey in colMap) v.col = colMap[v.colKey];
				if (v.colKeyRowStripes && v.colKeyRowStripes in colMap) v.rowStripe = colMap[v.colKeyRowStripes];
			}
		}
		if (revArr) {
			for (const v of revArr) {
				if (v.colKey && v.colKey in colMap) v.col = colMap[v.colKey];
				if (v.colKeyRowStripes && v.colKeyRowStripes in colMap) v.rowStripe = colMap[v.colKeyRowStripes];
			}
		}
	}

	/**
	 * Updates all relevant UI sub-components that need to be unthrottled.
	 */
	updateUIComponentsUnthrottled() {
		const displayPlaylistWithScrollbar = grm.ui.displayPlaylist && plSet.show_scrollbar;
		const displayBiographyWithStub = grm.ui.displayBiography && (bio.img.art.images.length < 1 || bio.img.cov.images.length < 1);
		const displayBiographyWithPropertiesView = grm.ui.displayBiography && bioSet.rowStripes && bio.panel.id.propsSource;

		// * Needs unthrottled recreations of playlist scrollbar colors
		if (displayPlaylistWithScrollbar) {
			pl.playlist.updateScrollbarColors();
		}
		// * Needs unthrottled recreations of rowStripe colors in item properties view
		if (displayBiographyWithPropertiesView) {
			this.updateBioTextColors();
		}
		// * Needs unthrottled recreations of noPhotoStubBg colors in item properties view
		if (displayBiographyWithStub) {
			bio.img.createImages();
			bio.img.clearCache();
			bio.img.getImages();
		}
	}

	/**
	 * Updates all relevant UI sub-components including buttons, playlist headers, and text colors.
	 */
	updateUIComponents() {
		this.updateButtons();
		this.updatePlaylistHeaders();
		this.updateBioTextColors();
	}
	// #endregion
}
