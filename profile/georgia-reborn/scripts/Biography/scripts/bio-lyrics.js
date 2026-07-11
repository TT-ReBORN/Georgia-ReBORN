/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Bio Lyrics                               * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    11-07-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////
// * BIO LYRICS * //
////////////////////
/**
 * A class that loads and displays bio lyrics in the Biography panel
 * from the cache directory or embedded files.
 */
class BioLyrics {
	/**
	 * Creates the `BioLyrics` instance.
	 * Initializes variables and settings for loading and displaying lyrics.
	 */
	constructor() {
		/** @private @type {Array<string>} The array to hold individual lyrics (for change detection). */
		this.lyr = [];
		/** @private @type {Array<object>} The array to hold the lyrics in a structured format. */
		this.lyrics = [];
		/** @private @type {Array<string>} The message displayed when no lyrics are found. */
		this.noLyrics = ['No lyrics found'];
		/** @private @type {boolean} The boolean state value for lyric drag scrolling. */
		this.scrollDrag = false;
		/** @private @type {number} The y-coordinate value for the lyric drag scrolling. */
		this.scrollDragY = 0;
		/** @private @type {number} The offset value for the lyric drag scrolling. */
		this.scrollDragOffset = 0;
		/** @private @type {number} The total duration in ms for the current eased scroll animation. */
		this.scrollEffectiveDuration = 200;
		/** @private @type {number} The elapsed time in ms for the current eased scroll animation. */
		this.scrollElapsed = 0;
		/** @private @type {number} The starting scroll distance captured when a new line becomes highlighted. */
		this.scrollStart = 0;
		/** @private @type {Map<string, {bmp: GdiBitmap, pad: number}|null>} The pre-rendered blurred shadow bitmap cache. */
		this.shadowBitmapCache = new Map();
		/** @private @type {string|null} The compound key `level|lineHeight`; detects when cache must be cleared. */
		this.shadowCacheKey = null;
		/** @private @type {number|null} The last lyricsShadow color; triggers full cache rebuild on change. */
		this.shadowLastColor = null;
		/** @private @type {number} The time step value for manual adjusting lyrics synchronization. */
		this.stepTime = 0;
		/** @private @type {FbTitleFormat} The titleFormat object to get the track length in seconds. */
		this.tfLength = fb.TitleFormat('%length_seconds%');
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Advances the highlighted lyric to the next sentence group.
	 */
	advanceHighLighted() {
		this.newHighlighted = true;
		this.scroll = 0;

		if (this.locus >= 0) {
			this.clearHighlight();

			const currentSentenceGroup = this.lyrics[this.locus].sentenceGroup;
			let currentStart = this.locus;
			let currentEnd = this.locus;

			while (currentStart > 0 && this.lyrics[currentStart - 1].sentenceGroup === currentSentenceGroup) {
				currentStart--;
			}
			while (currentEnd < this.lyrics.length - 1 && this.lyrics[currentEnd + 1].sentenceGroup === currentSentenceGroup) {
				currentEnd++;
			}

			const nextStart = currentEnd + 1;

			if (nextStart < this.lyrics.length) {
				this.scroll = this.lyrics[nextStart].yOffset - this.lyrics[this.locus].yOffset;
				this.locus = nextStart;
			}
			else {
				this.locus = this.lyrics.length - 1;
			}
		}

		this.scrollStart = this.scroll;
		this.scrollElapsed = 0;
		this.getScrollSpeed();
		this.setHighlight();
		this.repaintRect();
	}

	/**
	 * Calculates the transparent mask alpha for a lyric line based on its vertical position.
	 * Creates dual smoothstep gradients: fully opaque in the center, fading toward both edges.
	 * @param {number} line_y - The y-coordinate of the lyric line's top edge.
	 * @returns {number} The alpha factor in [0.0, 1.0].
	 */
	calcTransparentMaskAlpha(line_y) {
		if (!bioSet.lyricsTransparentMask || !this.h) return 1.0;

		const visH = this.bot - this.top;
		if (visH <= 0) return 1.0;

		// Normalise line-centre to the visible range to [0, 1]
		const relY = (line_y + this.lineHeight * 0.5 - this.top) / visH;
		if (relY <= 0 || relY >= 1) return 0.0;

		const mask = bioSet.lyricsTransparentMask;
		const topFade = relY < mask ? Easing('easeInOutSine', relY / mask) : 1.0;
		const botFade = (1 - relY) < mask ? Easing('easeInOutSine', (1 - relY) / mask) : 1.0;

		return Math.min(topFade, botFade);
	}

	/**
	 * Advances the scroll position using a time-based easing curve toward zero.
	 */
	checkScroll() {
		this.scrollElapsed += 16;
		const t = Math.min(this.scrollElapsed / this.scrollEffectiveDuration, 1);
		this.scroll = Math.max(0, this.scrollStart * (1 - Easing(bioSet.lyricsScrollEasing, t)));

		if (this.scroll <= 0) {
			this.newHighlighted = false;
		}

		this.repaintRect();
	}

	/**
	 * Clears the lyrics and stops the animation.
	 */
	clear() {
		this.stop();
		this.lyrics = [];
		this.scrollDragOffset = 0;
		this.highlightedWrapGroup = -1;
		this.shadowBitmapCache.clear();
	}

	/**
	 * Removes highlight from all lines in the lyric array.
	 */
	clearHighlight() {
		this.highlightedWrapGroup = -1;

		for (const v of this.lyrics) {
			v.highlight = false;
		}
	}

	/**
	 * Checks whether lyrics are ready to be displayed.
	 * @returns {boolean} True if lyrics can be drawn.
	 */
	display() {
		return this.lyrics.length && this.locus >= 0 && bio.txt.lyricsDisplayed();
	}

	/**
	 * Draws a single lyric line with fade, mask, and shadow support.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {object} lyric - The lyric object.
	 * @param {number} line_y - The y-coordinate of the line.
	 * @param {number} blendIn - The pre-computed highlight blend colour for this render pass.
	 */
	drawLyric(gr, lyric, line_y, blendIn) {
		const isHighlighted = lyric.highlight;
		const font = isHighlighted ? this.font.lyrics : bio.ui.font.lyrics;
		const aboveTop = line_y < this.top;
		const visibleBounds = !aboveTop && line_y <= this.bot;
		const hasMask = bioSet.lyricsTransparentMask !== 0;

		let color;
		let shadowAlpha = 255;

		if (!visibleBounds) {
			if (!bioSet.lyricsFadeScroll) return;

			const rawFade = aboveTop
				? (this.top - line_y) / this.lineHeight
				: (line_y - this.bot) / this.lineHeight;

			let fadeAlpha = 1 - Clamp(rawFade, 0, 1);

			if (hasMask) {
				const boundaryY = aboveTop ? this.top : this.bot;
				fadeAlpha *= this.calcTransparentMaskAlpha(boundaryY);
			}

			shadowAlpha = Math.round(fadeAlpha * 255);
			color = RGBtoRGBA(bio.ui.col.lyricsNormal, shadowAlpha);
		}
		else {
			color = isHighlighted ? blendIn : bio.ui.col.lyricsNormal;

			// * Transparent mask (visible lines)
			if (hasMask) {
				const maskFactor = this.calcTransparentMaskAlpha(line_y);
				if (maskFactor <= 0) return;

				const baseAlpha = (color >>> 24) & 0xFF;
				shadowAlpha = Math.round(baseAlpha * maskFactor);
				color = (shadowAlpha << 24) | (color & 0x00FFFFFF);
			}
		}

		// * Shadow (visible lines only)
		if (shadowAlpha > 0) {
			this.drawLyricsShadow(gr, lyric.content, font, line_y, shadowAlpha);
		}

		// * Text
		if (((color >>> 24) & 0xFF) === 0) return; // Skip fully transparent draw calls

		gr.DrawString(lyric.content, font, color, this.x, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
	}

	/**
	 * Draws the lyrics on screen and applies visual effects such as fading and drop shadows.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyrics(gr) {
		if (!this.display()) return;

		const top = this.lyrics[this.locus].yOffset - this.locusOffset + this.scrollDragOffset;
		const y = this.y + this.scroll;

		// DEBUG gr.DrawRect(this.x, this.top, this.w, this.bot, 3, RGBA(255, 0, 0, 255));
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const transition_factor = Clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transition_factor_in = !this.lyrics[this.locus].multiLine ? transition_factor : 1;
		const blendIn = this.type.synced ? BlendColors(bio.ui.col.lyricsNormal, bio.ui.col.lyricsHighlight, transition_factor_in) : bio.ui.col.lyricsNormal;

		for (const lyric of this.lyrics) {
			const line_y = Math.round(y - top + lyric.yOffset);
			if (line_y < this.top - this.lineHeight * 0.5 || line_y > this.bot + this.lineHeight) continue;
			// DEBUG gr.DrawRect(this.x, line_y, this.w, this.lineHeight, 1, RGBA(0, 255, 255, 100));
			this.drawLyric(gr, lyric, line_y, blendIn);
		}

		this.drawLyricsOffset(gr);
	}

	/**
	 * Draws the shadow effect for a lyric line using a pre-rendered blurred bitmap.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {string} text - The lyric text to draw.
	 * @param {GdiFont} font - The font to use for the text.
	 * @param {number} line_y - The vertical position of the text rect top edge.
	 * @param {number} [alpha] - The global opacity for this draw call (0-255).
	 */
	drawLyricsShadow(gr, text, font, line_y, alpha = 255) {
		if (!this.shadowEffect || alpha === 0) return;

		const shadow = this.getShadowBitmap(text, font);
		if (!shadow || !shadow.bmp) return;

		// Slight directional offset: larger levels get 2 px, smaller get 1 px
		const offset = this.dropShadowLevel >= 3 ? 2 : 1;
		const x = Math.round(this.x + offset - shadow.pad);
		const y = Math.round(line_y + offset - shadow.pad);

		gr.DrawImage(shadow.bmp, x, y, shadow.bmp.Width, shadow.bmp.Height, 0, 0, shadow.bmp.Width, shadow.bmp.Height, 0, alpha);
	}

	/**
	 * Draws the offset information on the screen.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyricsOffset(gr) {
		if (!this.showOffset) return;

		this.offsetW = gr.CalcTextWidth(`Offset: ${this.userOffset / 1000}s`, bio.ui.font.lyrics) + this.lineHeight;
		const offsetH = this.lineHeight + 1;
		const offsetX = this.x + this.w - this.offsetW - SCALE(8);
		const offsetY = this.top - SCALE(8);

		gr.FillRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, bio.ui.col.popupBg);
		gr.DrawRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, 1, 0x64000000);
		gr.DrawString(`Offset: ${this.userOffset / 1000}s`, bio.ui.font.lyrics, bio.ui.col.popupText, offsetX, offsetY, this.offsetW, offsetH, this.alignCenter);
	}

	/**
	 * Filters parsed (pre-wrap) lyrics based on the translation setting.
	 * When translation is disabled only the line selected by lyricsTranslationLine is kept per timestamp group.
	 * @param {Array<object>} lyrics - The parsed lyrics with `timestamp` and `group` properties.
	 * @returns {Array<object>} The filtered lyrics, or the original array unchanged when translation is shown.
	 */
	filterAndHighlightLyrics(lyrics) {
		if (bioSet.lyricsTranslation) {
			return lyrics;
		}

		const filteredLyrics = [];
		const groupedLyrics = {};

		for (const lyric of lyrics) {
			if (!groupedLyrics[lyric.timestamp]) {
				groupedLyrics[lyric.timestamp] = {};
			}

			if (!groupedLyrics[lyric.timestamp][lyric.group]) {
				groupedLyrics[lyric.timestamp][lyric.group] = [];
			}

			groupedLyrics[lyric.timestamp][lyric.group].push(lyric);
		}

		for (const timestamp in groupedLyrics) {
			const timestampGroups = Object.keys(groupedLyrics[timestamp]).sort((a, b) => a - b);
			const selectedGroupIndex = bioSet.lyricsTranslationLine - 1;
			const selectedGroup = timestampGroups[Math.min(selectedGroupIndex, timestampGroups.length - 1)];

			filteredLyrics.push(...groupedLyrics[timestamp][selectedGroup]);
		}

		filteredLyrics.sort((a, b) => a.timestamp - b.timestamp || a.sentenceGroup - b.sentenceGroup);

		return filteredLyrics;
	}

	/**
	 * Formats the lyrics with synchronization, line wrapping, and yOffset for sentence spacing.
	 * @param {Array} lyrics - An array of lyric objects with content, timestamp, group and sentenceGroup.
	 * @param {boolean} isSynced - Whether the lyrics are synced with the audio.
	 */
	formatLyrics(lyrics, isSynced) {
		if (lyrics.length && this.w > 10) {
			if (isSynced && lyrics[0].content && lyrics[0].timestamp > this.durationScroll) {
				lyrics.unshift({ timestamp: 0, content: '', group: -1, sentenceGroup: -1 });
			}

			const isBilingual = bioSet.lyricsTranslation && lyrics.some((l, i) =>
				i > 0 && l.group !== undefined && l.group !== lyrics[i - 1].group && l.timestamp === lyrics[i - 1].timestamp
			);

			$Bio.gr(1, 1, false, g => {
				for (let i = 0; i < lyrics.length; i++) {
					const l = g.EstimateLineWrap(lyrics[i].content, this.font.lyrics, this.w - 10);
					if (l[1] > this.maxLyrWidth) this.maxLyrWidth = l[1];
					if (l.length > 2) {
						const numLines = l.length / 2;
						let maxScrollTime = this.durationScroll * 2;
						if (lyrics[i + 1]) {
							maxScrollTime = Math.min(maxScrollTime * numLines, (lyrics[i + 1].timestamp - lyrics[i].timestamp) / numLines);
						}
						for (let j = 0; j < l.length; j += 2) {
							this.lyrics.push({
								content: l[j].trim(),
								timestamp: lyrics[i].timestamp + maxScrollTime * j / 2,
								id: i,
								multiLine: !!j,
								group: lyrics[i].group,
								wrapGroup: i,
								sentenceGroup: lyrics[i].sentenceGroup
							});
						}
					}
					else {
						this.lyrics.push({
							content: lyrics[i].content.trim(),
							timestamp: lyrics[i].timestamp,
							id: i,
							group: lyrics[i].group,
							wrapGroup: i,
							sentenceGroup: lyrics[i].sentenceGroup
						});
					}
				}
			});

			// Compute cumulative vertical offsets, adding sentence spacing at group boundaries
			let cumulativeY = 0;
			for (let i = 0; i < this.lyrics.length; i++) {
				if (i > 0 && this.lyrics[i].sentenceGroup !== this.lyrics[i - 1].sentenceGroup) {
					cumulativeY += isBilingual ? this.sentenceSpacing : this.sentenceSpacing * 0.5;
				}
				this.lyrics[i].yOffset = cumulativeY;
				cumulativeY += this.lineHeight;
			}
		}

		this.maxLyrWidth = Math.min(this.maxLyrWidth + 40, this.w);
		const incr = Math.min(500, this.durationScroll);

		for (const [i, v] of this.lyrics.entries()) {
			const t1 = this.getTimestamp(i - 1);
			const t2 = this.getTimestamp(i);
			const t3 = this.getTimestamp(i + 1);
			if (!v.content && t3 && t2 && t1 && t3 - t2 < incr) {
				v.timestamp = Math.max((t2 - t1) / 2 + t1, t2 - incr);
			}
		}

		this.repaintRect();
	}

	/**
	 * Gets the index of the current lyric line.
	 * @returns {number} The index of the current lyric line based on the playback time.
	 */
	getCurPos() {
		return this.lyrics.findIndex(v => v.timestamp >= this.playbackTime());
	}

	/**
	 * Converts a timestamped string to milliseconds.
	 * @param {string} t - The timestamped string.
	 * @returns {number} The time in milliseconds.
	 */
	getMilliseconds(t) {
		t = t.trim().replace(Regex.PunctBracket, '');

		const [minutes = '0', secondsPart = '0'] = t.split(':');
		const [seconds = '0', frac = '0'] = secondsPart.split('.');
		const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds) + parseFloat(`0.${frac}`) || 0;

		return Math.max(totalSeconds * 1000, 0);
	}

	/**
	 * Gets the duration of the scroll animation.
	 */
	getScrollSpeed() {
		let { durationScroll } = this;

		const t1 = this.getTimestamp(this.locus - 1);
		const t2 = this.getTimestamp(this.locus);
		const t3 = this.getTimestamp(this.locus + 1);

		const variSpeed = bioSet.lyricsScrollAdaptive ? 10 * 500 : 0;

		if (t1 && t2 && t2 - t1 > 0) {
			const backward = t2 - t1;
			const forward  = (t3 && t3 - t2 > 0) ? t3 - t2 : backward;
			durationScroll = Clamp(Math.min(backward, forward), this.minDurationScroll, this.durationScroll);
		}

		if (variSpeed) {
			let diff1 = 0;
			let diff2 = 0;

			if (t1 && t2) {
				diff1 = t2 - t1;
				diff1 = diff1 > this.durationScroll ? diff1 * this.durationScroll / variSpeed : 0;
			}
			if (t2 && t3) {
				diff2 = t3 - t2;
				diff2 = diff2 > this.durationScroll ? diff2 * this.durationScroll / variSpeed : 0;
			}

			const maxExtension = this.durationScroll * 2;
			durationScroll += Math.min(Math.min(diff1, diff2), maxExtension);
		}

		this.delta = this.scroll * this.factor / durationScroll;
		this.scrollEffectiveDuration = durationScroll * 16 / this.factor;
		this.transitionOffset = durationScroll / 2;
	}

	/**
	 * Gets or creates a cached pre-rendered blurred shadow bitmap for a lyric line.
	 * The text rect inside the bitmap mirrors the DrawString rect in drawLyric exactly,
	 * so DrawImage alignment is a trivial (pad, pad) to (x, y) mapping.
	 * @param {string} text - The lyric text content.
	 * @param {GdiFont} font - The font used to render the text.
	 * @returns {{bmp: GdiBitmap, pad: number}|null} Cached entry, or null on failure.
	 */
	getShadowBitmap(text, font) {
		// Rebuild entire cache when the shadow colour changes (theme switch, etc.)
		if (this.shadowLastColor !== bio.ui.col.lyricsShadow) {
			this.shadowBitmapCache.clear();
			this.shadowLastColor = bio.ui.col.lyricsShadow;
		}

		// Separate cache slots for the highlighted (larger) font and normal font
		const fontKey = font !== bio.ui.font.lyrics ? 'H' : 'N';
		const cacheKey = `${text}|${this.shadowCacheKey}|${fontKey}`;

		if (this.shadowBitmapCache.has(cacheKey)) {
			return this.shadowBitmapCache.get(cacheKey);
		}

		// Bounded FIFO eviction
		if (this.shadowBitmapCache.size >= 200) {
			this.shadowBitmapCache.delete(this.shadowBitmapCache.keys().next().value);
		}

		// Larger blur radius = softer, more spread shadow; values tuned for each level
		const blurRadius = this.dropShadowLevel === 1 ? 3 : this.dropShadowLevel === 2 ? 5 : 8;

		// Mirror the DrawString rect used in drawLyric: (this.x, line_y, this.w+1, this.lineHeight+1)
		// Place the text at (blurRadius, blurRadius) inside the bitmap so blur has room on all sides
		const textW = this.w + 1;
		const textH = Math.round(this.lineHeight + 1);
		const bmpW  = Math.round(textW + blurRadius * 2 + 2);
		const bmpH  = Math.round(textH + blurRadius * 2 + 2);

		if (bmpW < 2 || bmpH < 2) {
			this.shadowBitmapCache.set(cacheKey, null);
			return null;
		}

		const shadowBmp = GDI(bmpW, bmpH, true, (g) => {
			g.DrawString(text, font, bio.ui.col.lyricsShadow, blurRadius, blurRadius, textW, textH, this.alignCenter);
		});

		if (shadowBmp) shadowBmp.StackBlur(blurRadius);

		const entry = shadowBmp ? { bmp: shadowBmp, pad: blurRadius } : null;
		this.shadowBitmapCache.set(cacheKey, entry);
		return entry;
	}

	/**
	 * Gets the timestamp for a given index.
	 * @param {number} v - The lyrics array index.
	 * @returns {number} The timestamp in milliseconds, or undefined if out of range.
	 */
	getTimestamp(v) {
		return this.lyrics[v] && this.lyrics[v].timestamp;
	}

	/**
	 * Initializes various variables and settings for displaying lyrics and sends them to parse.
	 * @param {Array<string>} lyr - The lyrics that will be loaded and displayed.
	 */
	loadLyrics(lyr) {
		if (!$Bio.equal(lyr, this.lyr)) {
			this.lyr = lyr;
			this.userOffset = 0;
		}

		this.stop();
		clearTimeout(this.showOffsetTimer);

		this.font = {
			lyrics: bioSet.lyricsLargerCurrentSync
				? gdi.Font(bio.ui.font.main.Name, Math.floor(bio.ui.font.lyricsZoomSize * 1.33), bio.ui.font.lyrics.Style)
				: bio.ui.font.lyrics
		};

		$Bio.gr(1, 1, false, g => {
			this.font.lyrics_h = Math.round(g.CalcTextHeight('Ag', this.font.lyrics));
		});

		const minLineHeight = Math.round(this.font.lyrics_h * 1.15);
		this.lineHeight = Math.max(SCALE(bioSet.lyricsLineSpacing), minLineHeight);
		this.sentenceSpacing = SCALE(bioSet.lyricsSentenceSpacing);

		this.alignCenter = StringFormat(1, 1);
		this.alignRight = StringFormat(2, 1);
		this.init = true;
		this.arc = SCALE(6);

		this.locus = -1;
		this.lyrics = [];
		this.lyricsOffset = 0;
		this.maxLyrWidth = 0;
		this.highlightedWrapGroup = -1;
		this.newHighlighted = false;

		this.durationScroll = bioSet.lyricsScrollAdaptive ? Math.round(bioSet.lyricsScrollRateMax * 2 / 3) : bioSet.lyricsScrollRateAvg * 0.5;
		this.factor = this.durationScroll < 1500 ? 20 : 24;
		this.delta = this.lineHeight * this.factor / this.durationScroll;
		this.minDurationScroll = Math.min(this.durationScroll, 250);
		this.scroll = 0;
		this.scrollStart = 0;
		this.scrollElapsed = 0;
		this.scrollEffectiveDuration = this.durationScroll * 16 / this.factor;

		// Map the string-based drop-shadow level to a numeric value
		const shadowLevelMap = { none: 0, small: 1, normal: 2, large: 3 };
		const rawLevel = bioSet.lyricsDropShadowLevel;
		this.dropShadowLevel = typeof rawLevel === 'string' ? shadowLevelMap[rawLevel] : rawLevel;
		this.shadowEffect = this.dropShadowLevel > 0;

		// Invalidate shadow bitmap cache when the level or line height changes
		const newShadowCacheKey = `${this.dropShadowLevel}|${Math.round(this.lineHeight)}|${bio.ui.font.lyricsZoomSize}`;
		if (this.shadowCacheKey !== newShadowCacheKey) {
			this.shadowBitmapCache.clear();
			this.shadowCacheKey = newShadowCacheKey;
		}

		this.showOffsetTimer = null;
		this.timer = null;
		this.trackLength = parseInt(this.tfLength.Eval(true));
		this.transitionOffset = this.durationScroll / 2;
		this.transBot = {};
		this.transTop = {};
		this.type = {
			none: false,
			synced: false,
			unsynced: false
		};

		this.updateLyricsBounds();
		this.parseLyrics(lyr);
	}

	/**
	 * Gets the current playback time adjusted for lyrics offset and transition.
	 * @returns {number} The adjusted playback time in milliseconds.
	 */
	playbackTime() {
		if (!bioSet.scrollUnsynced && this.type.unsynced) {
			return 0;
		}
		const time = bio.panel.isRadio() ? fb.PlaybackTime - bio.txt.reader.trackStartTime : fb.PlaybackTime;
		return Math.round(time * 1000) + this.lyricsOffset + this.transitionOffset + this.userOffset;
	}

	/**
	 * Parses the lyrics, determines their type, and routes to the appropriate parser.
	 * @param {Array<string>} lyr - The lyrics that need to be parsed.
	 */
	parseLyrics(lyr) {
		if (!lyr.length) {
			this.type.none = true;
			lyr = this.noLyrics;
		}

		if (!this.type.none) {
			this.type.synced = lyr.some(line => Regex.LyricsTimestampLeading.test(line));
			this.type.unsynced = !this.type.synced;
		}

		if (this.type.synced) {
			let lyrOffset = null;
			lyr.some(line => {
				lyrOffset = line.match(Regex.LyricsOffset);
				return lyrOffset;
			});
			this.lyricsOffset = lyrOffset && lyrOffset.length > 0 ? parseInt(lyrOffset[1]) : 0;
			if (isNaN(this.lyricsOffset)) this.lyricsOffset = 0;

			const parsedLyrics = this.parseSyncLyrics(lyr, this.type.none);
			const filteredLyrics = this.filterAndHighlightLyrics(parsedLyrics);
			this.formatLyrics(filteredLyrics, this.type.synced);
		}
		else if (this.type.unsynced) {
			const parsedLines = this.parseUnsyncedLyrics(lyr, this.type.none);
			this.formatLyrics(parsedLines);
			const ratio = bio.panel.isRadio() ? 2000 : (this.trackLength / parsedLines.length) * 1000;

			let groupIndex = -1;
			let groupTimestamp = 0;

			for (const line of this.lyrics) {
				if (!line.multiLine) {
					groupIndex++;
					groupTimestamp = ratio * groupIndex;
				}
				line.timestamp = groupTimestamp;
			}
		}

		this.seek();
		this.start();
	}

	/**
	 * Parses synced lyrics that contain timestamps, tracking group and sentenceGroup for translation support.
	 * @param {Array<string>} lyr - The lyrics of the song.
	 * @param {boolean} isNone - Whether the lyrics array starts with a timestamp or not.
	 * @returns {Array<object>} An array of objects with `timestamp`, `content`, `group`, and `sentenceGroup`.
	 */
	parseSyncLyrics(lyr, isNone) {
		const lyrics = [];
		let groupId = 0;
		let sentenceGroup = 0;
		let prevTimestamp = null;

		if (isNone) {
			lyrics.push({
				timestamp: 0,
				content: lyr[0],
				group: 0,
				sentenceGroup: 0
			});
		}

		for (const line of lyr) {
			if (!this.lyricsOffset && Regex.LyricsOffset.test(line)) {
				this.lyricsOffset = parseInt(line.match(Regex.LyricsOffset)[1]) || 0;
				continue;
			}

			const matches = line.match(Regex.LyricsTimestampLeading);

			if (matches) {
				const content = this.tidy(line);
				const timestamps = matches[0].match(Regex.PunctBracketed);
				const currentTimestamp = this.getMilliseconds(timestamps[0]);

				if (prevTimestamp !== null && currentTimestamp !== prevTimestamp) {
					sentenceGroup++;
				}

				for (const ts of timestamps) {
					lyrics.push({
						timestamp: this.getMilliseconds(ts),
						content,
						group: groupId,
						sentenceGroup
					});
				}

				groupId++;
				prevTimestamp = currentTimestamp;
			}
		}

		return lyrics.sort((a, b) =>
			a.timestamp - b.timestamp || a.sentenceGroup - b.sentenceGroup
		);
	}

	/**
	 * Parses unsynced lyrics when there are no timestamps included.
	 * @param {Array<string>} lyr - The lyrics of the song.
	 * @param {boolean} isNone - The first line of lyrics should be treated as a timestamp or not.
	 * @returns {Array<object>} An array of objects with "timestamp", "content", and "sentenceGroup" properties for each line of the lyric.
	 */
	parseUnsyncedLyrics(lyr, isNone) {
		const lyrics = [];

		if (isNone) {
			lyrics.push({ timestamp: 0, content: lyr[0], sentenceGroup: 0 });
		}

		for (const [i, line] of lyr.entries()) {
			lyrics.push({ timestamp: 0, content: this.tidy(line), sentenceGroup: i });
		}

		return lyrics;
	}

	/**
	 * Repaints the lyrics when scroll animation occurs.
	 */
	repaintRect() {
		if (!grm.ui.displayBiography) return;

		window.RepaintRect(this.x + (this.w - this.maxLyrWidth) / 2, this.y, this.maxLyrWidth, this.h + this.lineHeight);

		if (this.showOffset) {
			const offsetWidth = (this.lineHeight + this.arc) * 2;
			window.RepaintRect(this.x + this.w - offsetWidth, this.top, offsetWidth * 2 + this.lineHeight, this.lineHeight + SCALE(6));
		}
	}

	/**
	 * Checks if the scroll needs to advance to the next sentence group.
	 * @returns {boolean} True if scroll needs to be updated.
	 */
	scrollUpdateNeeded() {
		if (this.locus >= this.lyrics.length - 1) return false;

		let nextIndex = this.locus + 1;
		const currentSentenceGroup = this.lyrics[this.locus].sentenceGroup;

		while (nextIndex < this.lyrics.length && this.lyrics[nextIndex].sentenceGroup === currentSentenceGroup) {
			nextIndex++;
		}

		if (nextIndex < this.lyrics.length) {
			return this.playbackTime() >= this.lyrics[nextIndex].timestamp;
		}

		return false;
	}

	/**
	 * Seeks to the current playback position and highlights the appropriate line.
	 */
	seek() {
		this.clearHighlight();
		const curTime = this.playbackTime();

		let low = 0;
		let high = this.lyrics.length - 1;
		let currentIndex = -1;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			if (this.lyrics[mid].timestamp <= curTime) {
				currentIndex = mid;
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}

		if (currentIndex >= 0) {
			const sg = this.lyrics[currentIndex].sentenceGroup;
			let startIndex = currentIndex;
			while (startIndex > 0 && this.lyrics[startIndex - 1].sentenceGroup === sg) {
				startIndex--;
			}
			this.locus = startIndex;
			this.setHighlight();
		} else {
			this.locus = 0;
		}

		this.repaintRect();
	}

	/**
	 * Highlights the translation line within the current sentence group.
	 */
	setHighlight() {
		if (!this.type.synced || this.locus < 0) return;

		const currentSentenceGroup = this.lyrics[this.locus].sentenceGroup;
		const idxStart = this.locus;
		let idxEnd = this.locus;

		while (idxEnd < this.lyrics.length - 1 && this.lyrics[idxEnd + 1].sentenceGroup === currentSentenceGroup) {
			idxEnd++;
		}

		const groupSize = idxEnd - idxStart + 1;
		const highlightIdx = idxStart + Math.min(bioSet.lyricsTranslationLine - 1, groupSize - 1);

		if (this.lyrics[highlightIdx]) {
			const targetWrapGroup = this.lyrics[highlightIdx].wrapGroup;
			this.highlightedWrapGroup = targetWrapGroup;
			for (const lyric of this.lyrics) {
				if (lyric.wrapGroup === targetWrapGroup) lyric.highlight = true;
			}
		}
	}

	/**
	 * Smoothly scrolls the lyrics to the next lyric on each animation tick.
	 */
	smoothScroll() {
		if (!bio.txt.lyricsDisplayed()) return;

		if (this.scrollUpdateNeeded()) {
			this.advanceHighLighted();
		}
		else if (this.newHighlighted) {
			this.checkScroll();
		}
	}

	/**
	 * Starts the lyrics scroll animation with a timer.
	 */
	start() {
		if (this.timer || !fb.IsPlaying || fb.IsPaused) return;

		this.timer = setInterval(() => {
			if (!this.init) this.smoothScroll();
			else this.init = false;
		}, 16);
	}

	/**
	 * Stops the timer if it is running.
	 */
	stop() {
		if (!this.timer) return;
		clearInterval(this.timer);
		this.timer = null;
	}

	/**
	 * Removes all timestamps and enhanced timestamps from a lyrics line.
	 * @param {string} n - The string containing timestamped data.
	 * @returns {string} A cleaned version without any timestamps.
	 */
	tidy(n) {
		return n.replace(Regex.LyricsTimestamp, '$1$4').replace(Regex.LyricsTimestampEnhanced, '$1$4').trim();
	}

	/**
	 * Updates the visible bounds whenever size or position changed.
	 */
	updateLyricsBounds() {
		if (!this.lineHeight) return;

		bioSet.lyricsFadeHeight = $Bio.clamp(bioSet.lyricsFadeHeight, -1, 2);
		const fadeHeight = this.lineHeight * bioSet.lyricsFadeHeight;

		this.x = bio.panel.text.l;
		this.y = bio.panel.text.t - this.lineHeight + fadeHeight;
		this.w = bio.panel.text.w;
		this.h = (bio.panel.style.max_y - bio.panel.text.t) + this.lineHeight * 2 - fadeHeight * 2;

		const linesDrawn = Math.floor(this.h / this.lineHeight);
		const oddNumLines = linesDrawn % 2;

		this.locusOffset = this.h / 2 - (oddNumLines ? this.lineHeight / 2 : this.lineHeight);
		this.top = this.locusOffset - this.lineHeight * (Math.floor(linesDrawn / 2) - (oddNumLines ? 1 : 2)) + this.y;
		this.bot = Math.round(this.top + this.lineHeight * (linesDrawn - 2));
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Initiates a scroll drag operation when the left mouse button is pressed.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_down(x, y, m) {
		this.scrollDrag = true;
		this.scrollDragY = y;
	}

	/**
	 * Releases the scroll drag operation when the left mouse button is released.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_up(x, y, m) {
		this.scrollDrag = false;
	}

	/**
	 * Ends the scroll drag operation when the mouse leaves.
	 */
	on_mouse_leave() {
		this.scrollDrag = false;
	}

	/**
	 * Updates the scroll position during a drag operation when the mouse is moved.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		if (!this.scrollDrag) return;

		if (bio.vk.k('alt')) {
			this.scrollDragOffset = 0;
			this.userOffset = 0;
		} else {
			this.scrollDragOffset += (y - this.scrollDragY);
			this.scrollDragY = y;
		}

		this.repaintRect();
	}

	/**
	 * Adjusts the user offset and seeks to the new position on mouse wheel scroll.
	 * @param {number} step - The amount of scrolling offset that should be performed.
	 */
	on_mouse_wheel(step) {
		const scrollStepOffset = bio.vk.k('shift') ? 5000 : this.type.synced ? 500 : 1000;
		step *= $Bio.clamp(Math.round(scrollStepOffset / ((Date.now() - this.stepTime) * 5)), 1, 5);
		this.stepTime = Date.now();
		this.userOffset += scrollStepOffset * -step;

		if (!this.userOffset) this.repaintRect();
		this.showOffset = this.type.synced && this.userOffset !== 0;

		clearTimeout(this.showOffsetTimer);
		this.showOffsetTimer = setTimeout(() => {
			this.showOffset = false;
			this.repaintRect();
		}, 5000);

		this.seek();
	}

	/**
	 * Checks if playback is paused and stops or starts the animation accordingly.
	 * @param {boolean} isPaused - Whether playback is currently paused.
	 */
	on_playback_pause(isPaused) {
		if (isPaused) this.stop();
		else this.start();
	}

	/**
	 * Stops the animation on playback stop.
	 */
	on_playback_stop() {
		this.stop();
	}

	/**
	 * Adjusts the size and position of the lyrics object and repaints it.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 */
	on_size(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.updateLyricsBounds();
	}
	// #endregion
}
