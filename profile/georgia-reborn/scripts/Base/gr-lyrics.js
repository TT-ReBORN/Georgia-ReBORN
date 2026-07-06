/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Lyrics                                   * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    06-07-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////
// * LYRICS * //
////////////////
/**
 * A class that loads and displays lyrics on album art in the Lyrics panel
 * from the cache directory or embedded files.
 */
class Lyrics {
	/**
	 * Creates the `Lyrics` instance.
	 * Initializes variables and settings for loading and displaying lyrics.
	 */
	constructor() {
		/** @private @type {Array<string>} The array to hold individual lyrics. */
		this.lyr = [];
		/** @private @type {Array<object>} The array to hold the lyrics in a structured format. */
		this.lyrics = [];
		/** @private @type {Array<string>} The array to hold the sources of lyrics. */
		this.lyricSource = [];
		/** @private @type {number} The counter to manage lyrics source loading queue. */
		this.lyricsSourceQueue = 0;
		/** @type {boolean} The temporary flag set when lyrics load from a local file. */
		this.lyricsLoadedFromLocal = false;
		/** @type {boolean} The flag indicating if a lyrics search is currently in progress. */
		this.lyricsSearching = false;
		/** @type {boolean} The flag to ensure the ESLyric save command is sent only once per search. */
		this.lyricsSaveCommandSent = false;
		/** @type {number} The maximum number of polling retries before giving up (60 seconds). */
		this.lyricsSearchMaxRetries = 60;
		/** @type {number} The current polling retry counter. */
		this.lyricsSearchRetries = 0;
		/** @private @type {string} The type of the lyrics, `.lrc` for synced and `.txt` for unsynced. */
		this.lyricType = '';
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
		/** @private @type {Array<string>} The message displayed when no lyrics are found. */
		this.stringNoLyrics = ['No lyrics found'];
		/** @private @type {Array<string>} The message displayed when the search is completed but no lyrics were found. */
		this.stringNotFound = ['Search completed\nNo lyrics were found'];
		/** @private @type {Array<string>} The message displayed when the lyrics search is in progress. */
		this.stringSearching = ['Searching for lyrics...\nPlease wait...'];
		/** @private @type {FbTitleFormat} The titleFormat object to get the track length in seconds. */
		this.tfLength = fb.TitleFormat('%length_seconds%');
		/** @private @type {number} The padding value for text display. */
		this.textPad = SCALE(12);

		this.clear();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Sets the size and position of the lyrics.
	 */
	setLyricsPosition() {
		const lyricsLayout = grm.ui.displayDetails ? 'normal' : grSet.lyricsLayout;
		const fullW = grSet.layout === 'default' && lyricsLayout !== 'normal' && grm.ui.displayLyrics;
		const noAlbumArtSize = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;
		const margin = SCALE(40);

		this.w =
			(grm.ui.noAlbumArtStub ?
				grSet.layout === 'artwork' ? grm.ui.ww :
				grSet.panelWidthAuto ? noAlbumArtSize :
				grm.ui.ww * 0.5 :
			lyricsLayout === 'full' ? grm.ui.ww * 0.75 :
			grm.ui.albumArtSize.w) - margin * 2;

		this.h = (grm.ui.noAlbumArtStub ? grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight : grm.ui.albumArtSize.h) - margin * 2;

		this.x =
			!grm.ui.noAlbumArtStub && lyricsLayout === 'full' && grm.ui.displayLyrics ? (grm.ui.ww - this.w) * 0.5 :
			(grm.ui.noAlbumArtStub || grSet.layout === 'default' && lyricsLayout !== 'normal' ?
				fullW ? grSet.panelWidthAuto && lyricsLayout === 'normal' ? noAlbumArtSize * 0.5 :
				lyricsLayout === 'left' ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w + (grm.ui.ww - grm.ui.albumArtSize.x - grm.ui.albumArtSize.w - this.w) * 0.5 - margin :
				lyricsLayout === 'right' ? (grm.ui.albumArtSize.x - this.w) * 0.5 - margin :
				(grm.ui.ww - this.w) * 0.5 - margin :
				grSet.panelWidthAuto ? grm.ui.albumArtSize.x : 0 :
			grm.ui.albumArtSize.x) + margin;

		this.y = (grm.ui.noAlbumArtStub ? grm.ui.topMenuHeight : grm.ui.albumArtSize.y) + margin;

		this.on_size(this.x, this.y, this.w, this.h);
	}

	/**
	 * Initializes the lyrics as follows:
	 * - Loads them from cache if found locally or from embedded tags.
	 * - Otherwise a timed search will be triggered.
	 * - When nothing was found a `No lyrics found` string will be displayed.
	 */
	initLyrics() {
		this.abortSearch();
		this.clear();

		if (!fb.IsPlaying && grSet.panelBrowseMode) {
			fb.Play(); fb.Pause();
		}

		let rawLyrics = [];
		const embeddedLyrics = $(grTF.lyrics);
		const foundLyrics = this.findLyrics();

		// * Start ESLyric callback listener when lyrics change
		esl.SetPlayingLyricChangedCallback(this.changeLyrics.bind(this));

		if (foundLyrics) {
			if (grm.ui.displayLyrics) grm.debug.debugLog('Found Lyrics:', this.fileName);
			rawLyrics = utils.ReadTextFile(this.fileName, 65001).split(Regex.BreakLine);
		}
		else if (embeddedLyrics.length) {
			rawLyrics = embeddedLyrics === '.' ? [
				'Lyrics cannot be displayed.',
				'For %LYRICS% or %UNSYNCED LYRICS% to always display properly, you must edit LargeFieldsConfig.txt and comment out or remove those specific entries under "fieldSpam"'
			] : embeddedLyrics.split(Regex.BreakLine);
		}

		// * Lyrics found
		if (rawLyrics.length) {
			this.lyricsSearching = false;
			this.lyricsLoadedFromLocal = true;
			setTimeout(() => { this.lyricsLoadedFromLocal = false; }, 500);
			this.loadLyrics(rawLyrics);
		}
		// * No lyrics found locally, searching...
		else if (Component.ESLyric && !this.lyricsSearching) {
			this.lyricsSearching = true;
			this.searchLyrics();
		}
		// * Search completed, no lyrics were found
		else {
			this.loadLyrics(this.stringNoLyrics);
		}

		this.on_size(this.x, this.y, this.w, this.h);
	}

	/**
	 * Searches through the config file's list of lyric paths and file patterns to find lyrics files.
	 * @returns {boolean} True or false.
	 */
	findLyrics() {
		let foundLyrics = false;
		const tpath = [];
		const tfilename = [];
		const stripReservedChars = (filename) => filename.replace(Regex.PathIllegalFilename, '_');
		const lyricPaths = grPath.lyricsPath();

		for (const path of lyricPaths) {
			tpath.push($($Escape(path)));
		}
		for (const filename of grCfg.lyricsFilenamePatterns) {
			tfilename.push(stripReservedChars($(filename)));
		}

		for (let i = 0; i < tpath.length && !foundLyrics; i++) {
			for (const file of tfilename) {
				foundLyrics = this.checkLyrics(tpath[i], file);
				if (foundLyrics) {
					break;
				}
			}
		}

		return foundLyrics;
	}

	/**
	 * Checks if the lyrics file exists at path+filename and sets this.fileName if it does.
	 * @param {string} path - The lyric file path.
	 * @param {string} filename - The lyric file name.
	 * @returns {boolean} True if the file exists and this.fileName is set, false otherwise.
	 */
	checkLyrics(path, filename) {
		this.lyricType = this.lyricSource.some(line => Regex.LyricsTimestamp.test(line)) ? 'lrc' : 'txt';
		const types = [...new Set([this.lyricType, 'lrc', 'txt'])];

		for (const type of types) {
			const currentFile = `${path + filename}.${type}`;
			if (IsFile(currentFile)) {
				this.fileName = currentFile;
				return true;
			}
		}

		return false;
	}

	/**
	 * Starts a one minute lyrics search while waiting.
	 */
	searchLyrics() {
		this.loadLyrics(this.stringSearching);
		this.lyricsSearchRetries = 0;
		this.lyricsSaveCommandSent = false;
		this.saveLyrics(fb.GetNowPlaying());

		clearTimeout(this.searchTimeout);

		this.searchTimeout = setTimeout(() => {
			this.lyricsSearching = false;
			this.lyricsSaveCommandSent = false;
			clearInterval(this.lyricsSearchTimer);

			if (!this.findLyrics()) {
				this.loadLyrics(this.lyricSource.length ? this.lyricSource : this.stringNotFound);
				this.on_size(this.x, this.y, this.w, this.h);
			}
		}, 60000);
	}

	/**
	 * Changes current lyrics when changing the lyrics source, used only for ESLyric "Lyric search".
	 * @param {object} meta - The metadata object containing the new lyrics text.
	 */
	changeLyrics(meta) {
		// * Case 1: suppress spontaneous post-load callbacks
		if (this.lyricsLoadedFromLocal) return;

		const wasSearching = this.lyricsSearching;
		this.clear();

		if (!meta || !meta.lyricText) return;

		// Preview the found lyrics immediately
		this.lyricSource = meta.lyricText.split(Regex.BreakLine);
		this.loadLyrics(this.lyricSource);

		// * Case 2: user-triggered - save the selected lyrics and keep them displayed.
		if (!wasSearching) {
			try {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
				this.lyricsSaveCommandSent = true;
			} catch (e) {
				console.log('Lyrics search: Error running save command -', e);
			}
			return;
		}

		// * Case 3: active programmatic search, send save command once, then verify the file
		if (!this.lyricsSaveCommandSent) {
			try {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
				this.lyricsSaveCommandSent = true;
			} catch (e) {
				console.log('Lyrics search: Error running save command -', e);
			}
		}

		// * Give ESLyric time to write the file, then verify and finalize
		setTimeout(() => {
			if (!this.findLyrics()) return;
			this.abortSearch();
			this.initLyrics();
		}, 1500);
	}

	/**
	 * Cycles through the next lyric source in the search results, used only for ESLyric's "Next lyric" feature.
	 */
	nextLyrics() {
		this.lyricsLoadedFromLocal = false;

		const nextSrc = (meta) => {
			this.lyricsSourceQueue++;

			RepeatFunc(() => {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Select lyric/Next lyric');
				if (!meta) return;

				this.lyricSource = meta.lyricText.split(Regex.BreakLine);
			}, this.lyricsSourceQueue);

			return this.lyricsSourceQueue;
		};

		nextSrc();
		setTimeout(() => { fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric'); }, 1000);
		setTimeout(() => { grm.lyrics.initLyrics(); }, 1000);
	}

	/**
	 * Automatically saves the lyrics file to cache once it was successfully found.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	saveLyrics(metadb) {
		clearInterval(this.lyricsSearchTimer);
		if (!Component.ESLyric || !metadb) return;

		this.lyricsSearchRetries = 0;

		this.lyricsSearchTimer = setInterval(() => {
			this.lyricsSearchRetries++;

			if (this.lyricsSearchRetries >= this.lyricsSearchMaxRetries) {
				clearInterval(this.lyricsSearchTimer);
				this.lyricsSearching = false;
				this.lyricsSaveCommandSent = false;
				return;
			}

			if (this.findLyrics()) {
				clearInterval(this.lyricsSearchTimer);
			}
		}, 1000);
	}

	/**
	 * Initializes various variables and settings for displaying lyrics and sends them to parse.
	 * @param {Array<string>} lyr - The lyrics that will be loaded and displayed.
	 */
	loadLyrics(lyr) {
		if (!Equal(lyr, this.lyr)) {
			this.lyr = lyr;
			this.userOffset = 0;
		}

		this.stop();
		clearTimeout(this.showOffsetTimer);

		// When foobar starts in `Compact` layout with the startup panel set to `Lyrics`,
		// the lyric fonts need to be recreated first when switching back to `Normal` layout.
		if (!grFont.lyrics || !grFont.lyricsHighlight) grm.ui.createFonts();

		/** @type {GdiFont} */
		this.font = {
			lyrics: grSet.lyricsLargerCurrentSync ? grFont.lyricsHighlight : grFont.lyrics
		};

		/** @type {GdiGraphics} */
		GDI(1, 1, false, g => {
			this.font.lyrics_h = Math.round(g.CalcTextHeight('Ag', this.font.lyrics));
		});

		this.setLyricsPosition();

		// Calculate scaling factor based on font size
		const defaultFontSize = HD_QHD_4K(20, 22);
		const scaleFactor = grSet.lyricsFontSize_layout / defaultFontSize;
		this.lineHeight = SCALE(grSet.lyricsLineSpacing * scaleFactor);
		this.sentenceSpacing = SCALE(grSet.lyricsSentenceSpacing * scaleFactor);

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

		this.durationScroll = grSet.lyricsScrollAdaptive ? Math.round(grSet.lyricsScrollRateMax * 2 / 3) : grSet.lyricsScrollRateAvg * 0.5;
		this.factor = this.durationScroll < 1500 ? 20 : 24;
		this.delta = this.lineHeight * this.factor / this.durationScroll;
		this.minDurationScroll = Math.min(this.durationScroll, 250);
		this.scroll = 0;
		this.scrollStart = 0;
		this.scrollElapsed = 0;
		this.scrollEffectiveDuration = this.durationScroll * 16 / this.factor;

		// Map the string-based menu value to a numeric level.
		const shadowLevelMap = { none: 0, small: 1, normal: 2, large: 3 };
		const rawLevel = grSet.lyricsDropShadowLevel;
		this.dropShadowLevel = typeof rawLevel === 'string' ? shadowLevelMap[rawLevel] : rawLevel;
		this.shadowEffect = this.dropShadowLevel > 0;

		// Invalidate shadow bitmap cache when the level or line height changes
		const newShadowCacheKey = `${this.dropShadowLevel}|${Math.round(this.lineHeight)}|${grSet.lyricsFontSize_layout}`;
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

		const linesDrawn = Math.floor(this.h / this.lineHeight);
		const oddNumLines = linesDrawn % 2;
		this.locusOffset = this.h / 2 - (oddNumLines ? this.lineHeight / 2 : this.lineHeight);
		this.top = this.locusOffset - this.lineHeight * (Math.floor(linesDrawn / 2) - (oddNumLines ? 1 : 2)) + this.y - this.lineHeight;
		this.bot = this.top + this.lineHeight * (linesDrawn - 2);

		this.parseLyrics(lyr);
	}

	/**
	 * Filters and highlights lyrics based on settings.
	 */
	filterAndHighlightLyrics() {
		const filteredLyrics = [];
		const groupedLyrics = {};

		for (const lyric of this.lyrics) {
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
			if (grSet.lyricsTranslation) {
				for (const group of timestampGroups) { // Keep all groups
					filteredLyrics.push(...groupedLyrics[timestamp][group]);
				}
			}
			else { // Select the group based on lyricsTranslationLine
				const selectedGroupIndex = grSet.lyricsTranslationLine - 1;
				if (timestampGroups.length > 0) {
					const selectedGroup = timestampGroups[Math.min(selectedGroupIndex, timestampGroups.length - 1)];
					filteredLyrics.push(...groupedLyrics[timestamp][selectedGroup]);
				}
			}
		}

		this.lyrics = filteredLyrics;

		// Recompute yOffset for the post-filter line set
		const isBilingual = grSet.lyricsTranslation && this.lyrics.some((l, i) =>
			i > 0 && l.group !== undefined && l.group !== this.lyrics[i - 1].group && l.timestamp === this.lyrics[i - 1].timestamp
		);

		let cumulativeY = 0;
		for (let i = 0; i < this.lyrics.length; i++) {
			if (i > 0 && this.lyrics[i].sentenceGroup !== this.lyrics[i - 1].sentenceGroup) {
				cumulativeY += isBilingual ? this.sentenceSpacing : this.sentenceSpacing * 0.5;
			}
			this.lyrics[i].yOffset = cumulativeY;
			cumulativeY += this.lineHeight;
		}
	}

	/**
	 * Determines if the lyrics are synced or unsynced, formats and parses them accordingly.
	 * @param {Array<string>} lyr - The lyrics that need to be parsed.
	 */
	parseLyrics(lyr) {
		if (!lyr.length) {
			this.type.none = true;
			lyr = this.stringNoLyrics;
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
			this.formatLyrics(parsedLyrics, this.type.synced);
			this.filterAndHighlightLyrics();
		}
		else if (this.type.unsynced) {
			const parsedLines = this.parseUnsyncedLyrics(lyr, this.type.none);
			this.formatLyrics(parsedLines);
			const ratio = grm.ui.isStreaming ? 2000 : (this.trackLength / parsedLines.length) * 1000;

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
	 * Parses synced lyrics that contain timestamps and content of each line, sorted by timestamp.
	 * @param {Array<string>} lyr - The lyrics of the song. Each string in the array represents a line of lyric.
	 * @param {boolean} isNone - Indicates if the lyrics array starts with a timestamp or not.
	 * @returns {Array} An array of objects with properties `timestamp`, `content`, `group`, and `sentenceGroup`.
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
	 * Formats the lyrics with synchronization and line wrapping.
	 * @param {Array} lyrics - An array of objects with the properties "content", "timestamp", "group", and "sentenceGroup".
	 * @param {boolean} isSynced - Whether the lyrics are synced with the audio or not.
	 */
	formatLyrics(lyrics, isSynced) {
		if (lyrics.length && this.w > 10) {
			if (isSynced && lyrics[0].content && lyrics[0].timestamp > this.durationScroll) {
				lyrics.unshift({ timestamp: 0, content: '', group: -1, sentenceGroup: -1 });
			}

			const isBilingual = grSet.lyricsTranslation && lyrics.some((l, i) =>
				i > 0 && l.group !== lyrics[i - 1].group && l.timestamp === lyrics[i - 1].timestamp
			);

			GDI(1, 1, false, g => {
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
					} else {
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
					const sentenceSpacing = isBilingual ? this.sentenceSpacing : this.sentenceSpacing * 0.5;
					cumulativeY += sentenceSpacing;
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
	 * Draws a single lyric line.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {object} lyric - The lyric object.
	 * @param {number} line_y - The y-coordinate of the line.
	 * @param {number} normalColor - The panel-correct "normal" (non-highlighted) lyric text colour for this render pass.
	 * @param {number} highlightColor - The pre-computed highlight blend colour for this render pass.
	 * @param {number} shadowColor - The panel-correct lyrics shadow colour for this render pass.
	 */
	drawLyric(gr, lyric, line_y, normalColor, highlightColor, shadowColor) {
		const isHighlighted = lyric.wrapGroup === this.highlightedWrapGroup;

		const font = this.type.unsynced ? grFont.lyrics :
			isHighlighted && grSet.lyricsLargerCurrentSync ? grFont.lyricsHighlight : grFont.lyrics;

		const aboveTop = line_y < this.top;
		const visibleBounds = !aboveTop && line_y <= this.bot;

		// * Build base colour
		let color;
		let shadowAlpha = 255;
		const hasMask = grSet.lyricsTransparentMask !== 0;

		if (!visibleBounds) {
			if (!grSet.lyricsFadeScroll) return;

			const rawFade = aboveTop
				? (this.top - line_y) / this.lineHeight
				: (line_y  - this.bot) / this.lineHeight;

			let fadeAlpha = 1 - Clamp(rawFade, 0, 1);

			if (hasMask) {
				const boundaryY = aboveTop ? this.top : this.bot;
				fadeAlpha *= this.calcTransparentMaskAlpha(boundaryY);
			}

			shadowAlpha = Math.round(fadeAlpha * 255);
			color = RGBtoRGBA(normalColor, shadowAlpha);
		}
		else {
			color = isHighlighted ? highlightColor : normalColor;

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
			this.drawLyricsShadow(gr, lyric.content, font, line_y, shadowAlpha, shadowColor);
		}

		// * Text
		if (((color >>> 24) & 0xFF) === 0) return; // Skip fully transparent draw calls

		gr.DrawString(lyric.content, font, color, this.x, line_y - this.lineHeight * 0.1, this.w + 1, this.lineHeight * 1.2, this.alignCenter);
	}

	/**
	 * Draws the lyrics on screen and also applies various visual effects such as fading and drop shadows.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyrics(gr) {
		if (!grm.ui.displayLyrics || this.lyrics.length === 0 || this.locus < 0) {
			return;
		}

		grm.debug.setDebugProfile(grm.debug.showDrawExtendedTiming, 'create', 'on_paint -> lyrics');

		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const top = this.lyrics[this.locus].yOffset - this.locusOffset + this.scrollDragOffset;
		const y = this.y + this.scroll;

		const transitionFactor = Clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transitionFactorIn = this.lyrics[this.locus].multiLine ? 1 : transitionFactor;

		const lyricsNormalColor = grm.ui.displayDetails ? grCol.detailsText : grCol.lyricsNormal;
		const lyricsHighlightColor = this.type.synced ? BlendColors(lyricsNormalColor, grCol.lyricsHighlight, transitionFactorIn) : lyricsNormalColor;
		const lyricsShadowColor = grCol.lyricsShadow;

		// DEBUG gr.DrawRect(this.x, this.top, this.w, this.bot, 3, RGBA(255, 0, 0, 255));

		for (const lyric of this.lyrics) {
			const line_y = Math.round(y - top + lyric.yOffset);
			const scrollUpper  = line_y < this.top - this.lineHeight * 0.5;
			const scrollBottom = line_y > this.bot + this.lineHeight;
			if (scrollUpper || scrollBottom) continue;
			// DEBUG gr.DrawRect(this.x, line_y, this.w, this.lineHeight, 1, RGBA(0, 255, 255, 100));
			this.drawLyric(gr, lyric, line_y, lyricsNormalColor, lyricsHighlightColor, lyricsShadowColor);
		}

		this.drawLyricsOffset(gr);

		grm.debug.setDebugProfile(false, 'print', 'on_paint -> lyrics');
	}

	/**
	 * Draws the shadow effect for a lyric line using a pre-rendered blurred bitmap.
	 * The bitmap text rect mirrors the DrawString rect in drawLyric, so alignment is a simple (offset - pad) shift.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {string} text - The lyric text to draw.
	 * @param {GdiFont} font - The font to use for the text.
	 * @param {number} line_y - The vertical position of the text rect top edge.
	 * @param {number} [alpha] - The global opacity for this draw call (0-255).
	 * @param {number} [shadowColor] - The panel-correct lyrics shadow colour for this render pass.
	 */
	drawLyricsShadow(gr, text, font, line_y, alpha = 255, shadowColor = grCol.lyricsShadow) {
		if (!this.shadowEffect || alpha === 0) return;

		const shadow = this.getShadowBitmap(text, font, shadowColor);

		if (!shadow || !shadow.bmp) return;

		// Slight directional offset: larger levels get 2 px, smaller get 1 px
		const offset = this.dropShadowLevel >= 3 ? 2 : 1;
		const x = Math.round(this.x + offset - shadow.pad);
		const y = Math.round(line_y - this.lineHeight * 0.1 + offset - shadow.pad);

		gr.DrawImage(shadow.bmp, x, y, shadow.bmp.Width, shadow.bmp.Height, 0, 0, shadow.bmp.Width, shadow.bmp.Height, 0, alpha);
	}

	/**
	 * Draws the offset information on the screen.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyricsOffset(gr) {
		if (!this.showOffset) return;

		this.offsetW = gr.CalcTextWidth(`Offset: ${this.userOffset / 1000}s`, grFont.notification) + this.lineHeight;
		const offsetH = this.lineHeight + 1;
		const offsetX = this.x + this.w - this.offsetW - SCALE(8);
		const offsetY = this.y - SCALE(8);

		gr.FillRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, grCol.popupBg);
		gr.DrawRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, 1, 0x64000000);
		gr.DrawString(`Offset: ${this.userOffset / 1000}s`, grFont.notification, grCol.popupText, offsetX, offsetY, this.offsetW, offsetH, this.alignCenter);
	}

	/**
	 * Aborts any in-progress lyrics search and resets all related state.
	 */
	abortSearch() {
		this.lyricsSearching = false;
		this.lyricsSaveCommandSent = false;
		clearInterval(this.lyricsSearchTimer);
		clearTimeout(this.searchTimeout);
	}

	/**
	 * Advances the highlighted lyric to the next timestamp group.
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
	 * Creates dual smoothstep gradients: transparent = opaque from both edges inward.
	 * @param {number} line_y - The y-coordinate of the lyric line's top edge.
	 * @returns {number} The alpha factor in [0.0, 1.0].
	 */
	calcTransparentMaskAlpha(line_y) {
		if (!grSet.lyricsTransparentMask || !this.h) return 1.0;

		const visH = this.bot - this.top;
		if (visH <= 0) return 1.0;

		// Normalise line-centre to the visible range to [0, 1]
		const relY = (line_y + this.lineHeight * 0.5 - this.top) / visH;
		if (relY <= 0 || relY >= 1) return 0.0;

		const mask = grSet.lyricsTransparentMask;
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
		this.scroll = Math.max(0, this.scrollStart * (1 - Easing(grSet.lyricsScrollEasing, t)));

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
	 * Clears the edge leave timer when lyrics layout is full.
	 */
	clearFullLayoutEdgeLeaveTimer() {
		if (!grm.ui.lyricsFullLayoutEdgeLeaveTimer) return;

		clearTimeout(grm.ui.lyricsFullLayoutEdgeLeaveTimer);
		grm.ui.lyricsFullLayoutEdgeLeaveTimer = null;
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
	 * Gets the index of the current lyric line.
	 * @returns {number} The index of the current lyric line based on the playback time.
	 */
	getCurPos() {
		return this.lyrics.findIndex(v => v.timestamp >= this.playbackTime());
	}

	/**
	 * Converts timestamped lyrics to milliseconds.
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

		const variSpeed = grSet.lyricsScrollAdaptive ? 10 * 500 : 0;

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
	 * The text rect inside the bitmap mirrors the DrawString rect used in drawLyric
	 * exactly, so DrawImage alignment is a trivial (pad, pad) to (x, y) mapping.
	 * @param {string} text - The lyric text content.
	 * @param {GdiFont} font - The font used to render the text.
	 * @param {number} [shadowColor] - The panel-correct lyrics shadow colour for this render pass.
	 * @returns {{bmp: GdiBitmap, pad: number}|null} Cached entry, or null on failure.
	 */
	getShadowBitmap(text, font, shadowColor = grCol.lyricsShadow) {
		// Rebuild entire cache when the shadow colour changes (theme switch, Details toggle, etc.)
		if (this.shadowLastColor !== shadowColor) {
			this.shadowBitmapCache.clear();
			this.shadowLastColor = shadowColor;
		}

		// Separate cache slots for the highlighted (larger) font and normal font
		const fontKey = font !== grFont.lyrics ? 'H' : 'N';
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

		// Mirror the DrawString rect used in drawLyric: (this.x, line_y - 0.1·lh, this.w + 1, 1.2·lh)
		// Place the text at (blurRadius, blurRadius) inside the bitmap so blur has room on all sides
		const textW = this.w + 1;
		const textH = Math.round(this.lineHeight * 1.2);
		const bmpW  = Math.round(textW + blurRadius * 2 + 2);
		const bmpH  = Math.round(textH + blurRadius * 2 + 2);

		if (bmpW < 2 || bmpH < 2) {
			this.shadowBitmapCache.set(cacheKey, null);
			return null;
		}

		const shadowBmp = GDI(bmpW, bmpH, true, (g) => {
			g.DrawString(text, font, shadowColor, blurRadius, blurRadius, textW, textH, this.alignCenter);
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
	 * Gets the current playback time.
	 * @returns {number} The current playback time in milliseconds.
	 */
	playbackTime() {
		if (!grSet.lyricsAutoScrollUnsynced && this.type.unsynced) {
			return 0;
		}
		const time = grm.ui.isStreaming ? fb.PlaybackTime - bio.txt.reader.trackStartTime : fb.PlaybackTime;
		return Math.round(time * 1000) + this.lyricsOffset + this.transitionOffset + this.userOffset;
	}

	/**
	 * Repaints the lyrics when scroll animation occurs.
	 */
	repaintRect() {
		window.RepaintRect(this.x - SCALE(2), this.y - this.lineHeight * 0.5, this.w + SCALE(4), this.h + this.lineHeight);
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
		const highlightIdx = idxStart + Math.min(grSet.lyricsTranslationLine - 1, groupSize - 1);

		if (this.lyrics[highlightIdx]) {
			const targetWrapGroup = this.lyrics[highlightIdx].wrapGroup;
			this.highlightedWrapGroup = targetWrapGroup;
			for (const lyric of this.lyrics) {
				if (lyric.wrapGroup === targetWrapGroup) lyric.highlight = true;
			}
		}
	}

	/**
	 * Smoothly scrolls the lyrics to the next lyric on scroll animation.
	 */
	smoothScroll() {
		if (!grm.ui.displayLyrics) return;

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
	 * Tidy ups a string by removing all timestamps and enhanced timestamps.
	 * @param {!string|number} n - The string containing timestamped data which needs cleaning up.
	 * @returns {!string} A cleaned version of the original string without any timestamps.
	 */
	tidy(n) {
		return n.replace(Regex.LyricsTimestamp, '$1$4').replace(Regex.LyricsTimestampEnhanced, '$1$4').trim();
	}

	/**
	 * Updates the visible bounds whenever size or position changed.
	 */
	updateLyricsBounds() {
		if (!this.lineHeight) return;

		const linesDrawn = Math.floor(this.h / this.lineHeight);
		const oddNumLines = linesDrawn % 2;

		this.locusOffset = this.h / 2 - (oddNumLines ? this.lineHeight / 2 : this.lineHeight);
		this.top = this.locusOffset - this.lineHeight * (Math.floor(linesDrawn / 2) - (oddNumLines ? 1 : 2)) + this.y - this.lineHeight;
		this.bot = this.top + this.lineHeight * (linesDrawn - 2);
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

		this.clearFullLayoutEdgeLeaveTimer();

		if (grSet.lyricsLayout !== 'full' || !grm.ui.mouseInLyricsFullLayoutEdge) {
			return;
		}

		grm.ui.lyricsFullLayoutEdgeLeaveTimer = setTimeout(() => {
			grm.ui.lyricsFullLayoutEdgeLeaveTimer = null;
			if (grSet.lyricsLayout === 'full' && grm.ui.displayLyrics) {
				grm.ui.mouseInLyricsFullLayoutEdge = false;
				grm.debug.repaintWindow();
			}
		}, 2000);
	}

	/**
	 * Updates the scroll position during a drag operation when the mouse is moved.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		this.clearFullLayoutEdgeLeaveTimer();

		if (!this.scrollDrag) return;

		if (utils.IsKeyPressed(VKey.MENU)) {
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
		const scrollStepOffset = utils.IsKeyPressed(VKey.SHIFT) ? 5000 : this.type.synced ? 500 : 1000;
		step *= Clamp(Math.round(scrollStepOffset / ((Date.now() - this.stepTime) * 5)), 1, 5);
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
	 * Checks if the playback is paused and stops or starts accordingly.
	 * @param {boolean} isPaused - Whether playback is currently paused or not.
	 */
	on_playback_pause(isPaused) {
		if (isPaused) this.stop();
		else this.start();
	}

	/**
	 * Stops the playback.
	 * @param {number} reason - The type of playback stop.
	 */
	on_playback_stop(reason) {
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
