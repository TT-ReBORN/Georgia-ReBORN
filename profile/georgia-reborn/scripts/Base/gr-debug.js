/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Debug                                    * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    16-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////
// * DEBUG * //
///////////////
/**
 * A class responsible for all kind of debugging magic in Georgia-ReBORN.
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

		// * OVERLAY DATA * //
		// #region OVERLAY DATA
		/** @public @type {number} The image alpha shown in showThemeDebugOverlay. */
		this.blendedImgAlpha = 0;
		/** @public @type {number} The image blur shown in showThemeDebugOverlay. */
		this.blendedImgBlur = 0;
		/** @public @type {string} The col.primary shown in showThemeDebugOverlay. */
		this.selectedPrimaryColor = '';
		/** @public @type {string} The col.primary_alt shown in showThemeDebugOverlay. */
		this.selectedPrimaryColor2 = '';
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
	 * Draws the color debug overlay.
	 * Displaying extracted palette colors from album art, metadata, primary/secondary markers, and WCAG contrast scores.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugColorOverlay(gr) {
		if (!grCfg.settings.showDebugColorOverlay || !grm.ui.loadingThemeComplete || !grm.ui.albumArt) return;

		gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

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
			this.fontDebugMeta = gdi.Font('Consolas', Math.round(swatchH * 0.35), 0);
			this.fontDebugLabel = gdi.Font('Consolas', Math.round(swatchH * 0.5), 1);
		}

		// Calculate positioning
		const labelX = paletteX + Math.round(swatchH * 0.25);
		const metaX = paletteX + swatchW + padding * 0.9;

		const colors = grm.color.getParsedAndWeightedColors(grm.ui.albumArt, maxColors, 255, 0);
		colors.sort((a, b) => b.weight - a.weight);

		colors.forEach((c, i) => {
			const r = GetRed(c.col.val);
			const g = GetGreen(c.col.val);
			const b = GetBlue(c.col.val);
			const lum = GetRelativeLuminance(c.col);
			const contrastWhite = GetContrastRatio(lum, 1.0).toFixed(1);
			const contrastBlack = GetContrastRatio(lum, 0.0).toFixed(1);
			const colorWhite = GetWCAGColor(contrastWhite);
			const colorBlack = GetWCAGColor(contrastBlack);
			const colorMeta = c.isValidPrimary ? RGB(220, 220, 220) : RGB(110, 110, 110);
			const colorNum = c.col.val & 0xFFFFFF;
			const colorPrimary = colorNum === grCol.primary_raw;
			const colorSecondary = colorNum === grCol.primary_alt_raw;
			const rowY = artY + (i * swatchH);

			// * Color swatch
			gr.FillSolidRect(paletteX, rowY, swatchW, swatchH, RGBA(r, g, b, c.isValidPrimary ? 255 : 200));

			// * RGB text
			const textColor = lum > 0.5 ? RGB(0, 0, 0) : RGB(255, 255, 255);
			const rgbStr = `${LeftPad(r, 3)}, ${LeftPad(g, 3)}, ${LeftPad(b, 3)}`;
			gr.DrawString(rgbStr, this.fontDebugMeta, textColor, paletteX, rowY, swatchW, swatchH, StringFormat(1, 1));

			// * Primary & Secondary color marker
			if (colorPrimary || colorSecondary) {
				gr.DrawString(colorPrimary ? 'P' : 'S', this.fontDebugLabel, textColor, labelX, rowY - SCALE(2), swatchH, swatchH, StringFormat(0, 1));
			}

			// * Metadata
			// Format strings
			const idxStr = (i + 1).toString().padStart(2, '0');
			const freqStr = (c.freq * 100).toFixed(1).padStart(5, ' ');
			const H = LeftPad(c.col.hue.toFixed(0), 3);
			const S = LeftPad(c.col.saturation.toFixed(0), 3);
			const B = LeftPad(c.col.brightness.toFixed(0), 3);
			const baseMeta = `#${idxStr} ${freqStr}%  |  HSB ${H} ${S} ${B}  |  `;

			gr.DrawString(baseMeta, this.fontDebugMeta, colorMeta, metaX, rowY, metaW, swatchH, StringFormat(0, 1));

			// Calculate actual baseWidth for this row to ensure accurate dot positioning
			const baseWidth = gr.MeasureString(baseMeta, this.fontDebugMeta, 0, 0, 0, 0).Width;
			const wcagX = metaX + baseWidth;
			const wcagStr = `  W ${contrastWhite.padStart(4)}    B ${contrastBlack.padStart(4)}`;

			gr.DrawString(wcagStr, this.fontDebugMeta, colorMeta, wcagX, rowY, metaW, swatchH, StringFormat(0, 1));

			// WCAG indicator dots - measure actual string widths
			const whitePrefix = '  W ';
			const whiteValue = contrastWhite.padStart(4);
			const blackPrefix = '    B ';
			const blackValue = contrastBlack.padStart(4);

			// Measure complete segments including the padding spaces
			const fullWhiteSegment = whitePrefix + whiteValue;
			const fullBlackSegment = whitePrefix + whiteValue + blackPrefix + blackValue;
			const dotSpacing = gr.MeasureString('X', this.fontDebugMeta, 0, 0, 0, 0).Width;
			const dot1X = wcagX + gr.MeasureString(fullWhiteSegment, this.fontDebugMeta, 0, 0, 0, 0).Width + dotSpacing;
			const dot2X = wcagX + gr.MeasureString(fullBlackSegment, this.fontDebugMeta, 0, 0, 0, 0).Width + dotSpacing;

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
			{ prop: this.selectedPrimaryColor2, log: `Primary 2 color: ${this.selectedPrimaryColor2}` },
			{ prop: grCol.colBrightness, log: `Primary color brightness: ${grCol.colBrightness}` },
			{ prop: grCol.colBrightness2, log: `Primary 2 color brightness: ${grCol.colBrightness2}` },
			{ prop: grCol.imgBrightness, log: `Image brightness: ${grCol.imgBrightness}` },
			{ prop: grSet.styleBlend || grSet.styleBlend2, log: `Image blur: ${this.blendedImgBlur}` },
			{ prop: grSet.styleBlend || grSet.styleBlend2, log: `Image alpha: ${this.blendedImgAlpha}` },
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
			if (prop) drawString(log);
			if (prop === grCol.imgBrightness) y += lineSpacing;
		}
	}

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

		// Define the transport glyphs to test (extend as needed)
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

		const font = grFont.lowerBarBtn; // Use the transport button font
		const color = grCol.transportIconNormal; // Default icon color
		const baselineY = 0; // Fixed baseline y-position (relative to gr's origin)
		let currentX = startX;
		let totalWidth = 0; // Accumulate for accurate global center line

		// Pre-compute box widths and totalWidth for precise centering
		const boxWidths = glyphsToTest.map(({ ico }) => {
			const measurements = gr.MeasureString(ico, font, 0, 0, Infinity, canvasHeight);
			const glyphW = Math.ceil(measurements.Width);
			return Math.max(glyphW + 4, 30); // Min width for visibility (outer box)
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
			// Optional: Per-glyph vertical center line (purple, thin) for the outer box
			if (showPerGlyphCenters) {
			const vCenterX = currentX + outerBoxW / 2;
				gr.DrawLine(vCenterX, baselineY, vCenterX, baselineY + canvasHeight, 1, RGBA(0, 255, 0, 100));
			}

			// Draw the glyph centered in the outer box
			const drawX = currentX + 2;
			const drawW = outerBoxW - 4;
			gr.DrawString(ico, font, color, drawX, baselineY, drawW, canvasHeight, StringFormat(1, 1));

			// Calculate tight inner bounding box position (centered within draw rect)
			const innerBoxX = drawX + (drawW - glyphW) / 2;
			const innerBoxY = baselineY + (canvasHeight - glyphH) / 2;
			// Draw the new tight bounding box (wireframe, yellow) for exact glyph ink extents
			gr.DrawRect(innerBoxX, innerBoxY, glyphW, glyphH, 1, RGB(255, 0, 0)); // Yellow outline for tight glyph bbox

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
