/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Lyrics                                   * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred + WilB                                          * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    16-10-2025                                              * //
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
		/** @private @type {Array<string>} An array to hold individual lyrics. */
		this.lyr = [];
		/** @private @type {Array<string>} An array to hold the lyrics in a structured format. */
		this.lyrics = [];
		/** @private @type {Array<string>} An array to hold the sources of lyrics. */
		this.lyricSource = [];
		/** @private @type {string} The type of the lyrics, `.lrc` for synced and `.txt` for unsynced. */
		this.lyricType = '';
		/** @private @type {number} A counter to manage lyrics source loading queue. */
		this.lyricsSourceQueue = 0;
		/** @private @type {RegExp} A regular expression to match standard timestamps in lyrics. */
		this.timestamps = /(\s*)\[(\d{1,2}:|)\d{1,2}:\d{2}(\.\d{0,3})?\](\s*)/g;
		/** @private @type {RegExp} A regular expression to match enhanced timestamps in lyrics. */
		this.enhancedTimestamps = /(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g;
		/** @private @type {RegExp} A regular expression to match leading timestamps in lyrics. */
		this.leadingTimestamps = /^(\s*\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}]))+/;
		/** @private @type {boolean} A boolean state value for lyric drag scrolling. */
		this.scrollDrag = false;
		/** @private @type {number} A y-coordinate value for the lyric drag scrolling. */
		this.scrollDragY = 0;
		/** @private @type {number} A offset value for the lyric drag scrolling. */
		this.scrollDragOffset = 0;
		/** @private @type {number} A time step value for manual adjusting lyrics synchronization. */
		this.stepTime = 0;
		/** @private @type {Array<string>} A message displayed when no lyrics are found. */
		this.stringNoLyrics = ['No lyrics found'];
		/** @private @type {Array<string>} A message displayed when the search is completed but no lyrics were found. */
		this.stringNotFound = ['Search completed\nNo lyrics were found'];
		/** @private @type {Array<string>} A message displayed when the lyrics search is in progress. */
		this.stringSearching = ['Searching for lyrics...\nPlease wait...'];
		/** @private @type {number} A TitleFormat object to get the track length in seconds. */
		this.tfLength = fb.TitleFormat('%length_seconds%');
		/** @private @type {number} A padding value for text display. */
		this.textPad = SCALE(12);

		this.clear();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Sets the size and position of the lyrics.
	 */
	setLyricsPosition() {
		const fullW = grSet.layout === 'default' && grSet.lyricsLayout !== 'normal' && grm.ui.displayLyrics;
		const noAlbumArtSize = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;
		const margin = SCALE(40);

		this.w =
			(grm.ui.noAlbumArtStub ?
				grSet.layout === 'artwork' ? grm.ui.ww :
				grSet.panelWidthAuto ? noAlbumArtSize :
				grm.ui.ww * 0.5 :
			grSet.lyricsLayout === 'full' ? grm.ui.ww * 0.75 :
			grm.ui.albumArtSize.w) - margin * 2;

		this.h = (grm.ui.noAlbumArtStub ? grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight : grm.ui.albumArtSize.h) - margin * 2;

		this.x =
			(grm.ui.noAlbumArtStub || grSet.lyricsLayout !== 'normal' ?
				fullW ? grSet.panelWidthAuto && grSet.lyricsLayout === 'normal' ? noAlbumArtSize * 0.5 :
				grSet.lyricsLayout === 'left'  ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w + margin * 1.5 :
				grSet.lyricsLayout === 'right' ? grm.ui.albumArtSize.x - grm.ui.albumArtSize.w - margin * 1.5 :
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
			if (grm.ui.displayLyrics) console.log('Found Lyrics:', this.fileName);
			rawLyrics = utils.ReadTextFile(this.fileName, 65001).split('\n');
		}
		else if (embeddedLyrics.length) {
			if (embeddedLyrics === '.') {
				rawLyrics = [
					'Lyrics cannot be displayed.',
					'For %LYRICS% or %UNSYNCED LYRICS% to always display properly, you must edit LargeFieldsConfig.txt and comment out or remove those specific entries under "fieldSpam"'
				];
			} else {
				rawLyrics = embeddedLyrics.split('\n');
				if (rawLyrics.length === 1) {
					rawLyrics = embeddedLyrics.split('\r');
				}
			}
		}

		if (rawLyrics.length) { // * Lyrics found
			this.loadLyrics(rawLyrics);
		} else if (Component.ESLyric) { // * No lyrics found locally, searching...
			this.searchLyrics();
		} else { // * Search completed, no lyrics were found
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
		const stripReservedChars = (filename) => filename.replace(/[<>:"/\\|?*]/g, '_');
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
		this.lyricType = this.timestamps.test(this.lyricSource) ? 'lrc' : 'txt';
		const types = [this.lyricType, 'lrc', 'txt'];

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
		this.saveLyrics(fb.GetNowPlaying());
		clearTimeout(this.searchTimeout);

		this.searchTimeout = setTimeout(() => {
			if (!this.findLyrics()) {
				this.loadLyrics(this.stringNotFound);
				this.on_size(this.x, this.y, this.w, this.h);
			}
			clearInterval(this.lyricsSearchTimer);
		}, 60000);
	}

	/**
	 * Changes current lyrics when changing the lyrics source, used only for ESLyric "Lyric search".
	 * @param {object} meta - The metadata object containing the new lyrics text.
	 */
	changeLyrics(meta) {
		this.clear();
		if (!meta) return;

		this.lyricSource = [meta.lyricText];
		this.lyricSource = this.lyricSource.map(line => line.split('\n')).flat();

		this.loadLyrics(this.lyricSource);
		setTimeout(() => { this.initLyrics(); }, 1000);
	}

	/**
	 * Cycles through the next lyric source in the search results, used only for ESLyric's "Next lyric" feature.
	 */
	nextLyrics() {
		const nextSrc = (meta) => {
			this.lyricsSourceQueue++;

			RepeatFunc(() => {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Select lyric/Next lyric');
				if (!meta) return;

				this.lyricSource = [meta.lyricText];
				this.lyricSource = this.lyricSource.map(line => line.split('\n')).flat();
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
		if (!Component.ESLyric && !metadb) return;

		this.lyricsSearchTimer = setInterval(() => {
			if (this.findLyrics()) {
				clearInterval(this.lyricsSearchTimer);
				this.initLyrics();
			} else {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
			}
		}, 1000);
	}

	/**
	 * Initializes various variables and settings for displaying lyrics and sends them to parse.
	 * @param {string} lyr - The lyrics that will be loaded and displayed.
	 */
	loadLyrics(lyr) {
		if (!Equal(lyr, this.lyr)) {
			this.lyr = lyr;
			this.userOffset = 0;
		}

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
		this.lyricsScrollTimeMax = grSet.lyricsScrollRateAvg * 0.5;
		this.lyricsScrollTimeAvg = grSet.lyricsScrollRateMax;
		this.lyricsScrollMaxMethod = 0;
		this.durationScroll = this.lyricsScrollMaxMethod ? this.lyricsScrollTimeMax : Math.round(this.lyricsScrollTimeAvg * 2 / 3);
		this.factor = this.durationScroll < 1500 ? 20 : 24;
		this.delta = this.lineHeight * this.factor / this.durationScroll;
		this.locus = -1;
		this.lyrics = [];
		this.lyricsOffset = 0;
		this.maxLyrWidth = 0;
		this.minDurationScroll = Math.min(this.durationScroll, 250);
		this.newHighlighted = false;
		this.scroll = 0;
		this.dropShadowLevel = grSet.lyricsDropShadowLevel;
		this.dropNegativeShadowLevel = this.dropShadowLevel > 1 ? Math.floor(this.dropShadowLevel / 2) : 0;
		this.shadowEffect = this.dropShadowLevel > 0;
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
	}

	/**
	 * Determines if the lyrics are synced or unsynced, formats and parses them accordingly.
	 * @param {string} lyr - The lyrics that need to be parsed.
	 */
	parseLyrics(lyr) {
		if (!lyr.length) {
			this.type.none = true;
			lyr = this.stringNoLyrics;
		}

		if (!this.type.none) {
			this.type.synced = lyr.some(line => this.leadingTimestamps.test(line));
			this.type.unsynced = !this.type.synced;
		}

		if (this.type.synced) {
			let lyrOffset = null;
			lyr.some(line => {
				lyrOffset = line.match(/^\s*\[offset\s*:(.*)\]\s*$/);
				return lyrOffset;
			});
			this.lyricsOffset = lyrOffset && lyrOffset.length > 0 ? parseInt(lyrOffset[1]) : 0;
			if (isNaN(this.lyricsOffset)) this.lyricsOffset = 0;

			const parsedLyrics = this.parseSyncLyrics(lyr, this.type.none);
			this.formatLyrics(parsedLyrics, this.type.synced);
			this.filterAndHighlightLyrics();
		}
		else if (this.type.unsynced) {
			this.formatLyrics(this.parseUnsyncedLyrics(lyr, this.type.none));
			const ratio = grm.ui.isStreaming ? 2000 : (this.trackLength / this.lyrics.length) * 1000;
			for (const [i, line] of this.lyrics.entries()) {
				line.timestamp = ratio * i;
			}
		}

		this.seek();
		this.start();
	}

	/**
	 * Parses synced lyrics that contain timestamps and content of each line, sorted by timestamp.
	 * @param {string} lyr - The lyrics of the song. Each string in the array represents a line of lyric.
	 * @param {boolean} isNone - Indicates if the lyrics array starts with a timestamp or not.
	 * @returns {Array} An array of objects with properties `timestamp`, `content`, `group`, and `sentenceGroup`.
	 */
	parseSyncLyrics(lyr, isNone) {
		const lyrics = [];
		const offsetRegex = /^\s*\[offset\s*:(.*)\]\s*$/;
		let groupId = 0;
		let sentenceGroup = 0;
		let prevTimestamp = null;

		if (isNone) {
			lyrics.push({ timestamp: 0, content: lyr[0], group: 0, sentenceGroup: 0 });
		}

		for (const line of lyr) {
			if (!this.lyricsOffset && offsetRegex.test(line)) {
				this.lyricsOffset = parseInt(line.match(offsetRegex)[1]) || 0;
				continue;
			}
			const matches = line.match(this.leadingTimestamps);
			if (matches) {
				const content = this.tidy(line);
				const timestamps = matches[0].match(/\[.*?\]/g);
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

		return lyrics.sort((a, b) => a.timestamp - b.timestamp || a.sentenceGroup - b.sentenceGroup);
	}

	/**
	 * Parses unsynced lyrics when there are no timestamps included.
	 * @param {string} lyr - The lyrics of the song.
	 * @param {boolean} isNone - The first line of lyrics should be treated as a timestamp or not.
	 * @returns {object} An array of objects with "timestamp", "content", and "sentenceGroup" properties for each line of the lyric.
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
	 * @param {object} bounds - The object containing bounds information.
	 */
	drawLyric(gr, lyric, line_y, bounds) {
		const transition_factor = Clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transition_factor_in = !this.lyrics[this.locus].multiLine ? transition_factor : 1;
		const blendIn = this.type.synced ? GetBlend(grCol.lyricsHighlight, grCol.lyricsNormal, transition_factor_in) : grCol.lyricsNormal;

		const fadeFactor =
			grSet.lyricsFadeScroll && bounds.outsideVisibleBounds ? (bounds.aboveTop ? (this.top - line_y) / this.lineHeight :
			(line_y - this.bot) / this.lineHeight) : 0;

		const isHighlighted = this.lyrics.some(l => l.wrapGroup === lyric.wrapGroup && l.highlight);
		const font = this.type.unsynced ? grFont.lyrics :
			isHighlighted && grSet.lyricsLargerCurrentSync ? grFont.lyricsHighlight : grFont.lyrics;

		const color =
			bounds.outsideVisibleBounds	? RGBtoRGBA(grCol.lyricsNormal, 255 * (1 - Clamp(fadeFactor, 0, 1))) :
			(isHighlighted ? blendIn : grCol.lyricsNormal);

		if (bounds.visibleBounds) {
			this.drawLyricsShadow(gr, lyric.content, font, line_y);
		}

		gr.DrawString(lyric.content, font, color, this.x, line_y - this.lineHeight * 0.1, this.w + 1, this.lineHeight * 1.2, this.alignCenter);
	}

	/**
	 * Draws the lyrics on screen and also applies various visual effects such as fading and drop shadows.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyrics(gr) {
		if (!grm.ui.displayLyrics || this.lyrics.length === 0 || this.locus < 0) return;

		grm.utils.profile(grm.ui.showDrawExtendedTiming, 'create', 'on_paint -> lyrics');

		const top = this.lyrics[this.locus].yOffset - this.locusOffset + this.scrollDragOffset;
		const y = this.y + this.scroll;

		// DEBUG gr.DrawRect(this.x, this.top, this.w, this.bot, 3, RGBA(255, 0, 0, 255));
		gr.SetTextRenderingHint(5);

		for (const [i, lyric] of this.lyrics.entries()) {
			const lyric_y = this.lyrics[i].yOffset;
			const line_y = Math.round(y - top + lyric_y);
			const bounds = this.checkBounds(line_y);

			if (bounds.lyricsDrawBounds) {
				// DEBUG gr.DrawRect(this.x, line_y, this.w, this.lineHeight, 1, RGBA(0, 255, 255, 100));
				this.drawLyric(gr, lyric, line_y, bounds);
			}
		}

		this.drawLyricsOffset(gr);

		grm.utils.profile(false, 'print', 'on_paint -> lyrics');
	}

	/**
	 * Draws the shadow effect for the lyrics.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {string} text - The lyric text to draw.
	 * @param {GdiFont} font - The font to use for the text.
	 * @param {number} line_y - The vertical position where the text should be drawn.
	 */
	drawLyricsShadow(gr, text, font, line_y) {
		if (!this.shadowEffect) return;

		if (this.dropNegativeShadowLevel) {
			gr.DrawString(text, font, grCol.lyricsShadow, this.x - this.dropNegativeShadowLevel, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
			gr.DrawString(text, font, grCol.lyricsShadow, this.x, line_y - this.dropNegativeShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
		}

		gr.DrawString(text, font, grCol.lyricsShadow, this.x + this.dropShadowLevel, line_y + this.dropShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
	}

	/**
	 * Draws the offset information on the screen.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyricsOffset(gr) {
		if (!this.showOffset) return;

		const margin = SCALE(20);
		this.offsetW = gr.CalcTextWidth(`Offset: ${this.userOffset / 1000}s`, grFont.notification) + this.lineHeight;
		const offsetH = this.lineHeight + 1;
		const offsetX = this.x + this.w - this.offsetW - margin;
		const offsetXS = this.x - this.lineHeight * 0.5 - margin;
		const offsetY = this.y + margin;

		gr.FillRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, grCol.popupBg);
		gr.DrawRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, 1, 0x64000000);
		gr.DrawString(`Offset: ${this.userOffset / 1000}s`, grFont.notification, grCol.popupText, offsetXS, offsetY, this.w, offsetH, this.alignRight);
	}

	/**
	 * Advances the highlighted lyric to the next timestamp group.
	 */
	advanceHighLighted() {
		this.newHighlighted = true;
		this.scroll = 0;

		if (this.locus >= 0) {
			this.clearHighlight();

			let currentStart = this.locus;
			while (currentStart > 0 && this.lyrics[currentStart - 1].sentenceGroup === this.lyrics[this.locus].sentenceGroup) currentStart--;

			let currentEnd = this.locus;
			while (currentEnd < this.lyrics.length - 1 && this.lyrics[currentEnd + 1].sentenceGroup === this.lyrics[this.locus].sentenceGroup) currentEnd++;

			const previousGroupHeight = this.lyrics[currentEnd].yOffset - this.lyrics[currentStart].yOffset + this.lineHeight;
			const nextStart = currentEnd + 1;

			if (nextStart < this.lyrics.length) {
				this.locus = nextStart;
				let end = nextStart;
				while (end < this.lyrics.length - 1 && this.lyrics[end + 1].sentenceGroup === this.lyrics[nextStart].sentenceGroup) end++;
				const nextGroupSize = end - nextStart + 1;
				const highlightIndex = grSet.lyricsTranslationLine - 1;

				if (highlightIndex < nextGroupSize) {
					this.lyrics[nextStart + highlightIndex].highlight = true;
				} else {
					this.lyrics[end].highlight = true;
				}
				this.scroll = previousGroupHeight;
			}
			else {
				this.locus = this.lyrics.length - 1;
			}
		}

		this.getScrollSpeed();
		this.repaintRect();
	}

	/**
	 * Checks various positional bounds for a given line's y-coordinate.
	 * @param {number} line_y - The y-coordinate of the line.
	 * @returns {object} An object containing various bounds-related properties:
	 * - {boolean} aboveTop - Whether the line is above the top boundary.
	 * - {boolean} visibleBounds - Whether the line is within the visible bounds.
	 * - {boolean} outsideVisibleBounds - Whether the line is outside the visible bounds.
	 * - {boolean} lyricsDrawBounds - Whether the line is inside the lyrics draw bounds.
	 */
	checkBounds(line_y) {
		return {
			aboveTop: (line_y < this.top),
			visibleBounds: (line_y >= this.top) && (line_y <= this.bot),
			outsideVisibleBounds: (line_y < this.top || line_y > this.bot),
			lyricsDrawBounds: (line_y >= this.top - this.lineHeight * 0.5) && (line_y <= this.bot + this.lineHeight)
		};
	}

	/**
	 * Decrements the lyrics scroll amount by delta.
	 */
	checkScroll() {
		this.scroll = Math.max(0, this.scroll - this.delta);

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
	}

	/**
	 * Removes highlight from all lines in the lyric array.
	 */
	clearHighlight() {
		for (const v of this.lyrics) {
			v.highlight = false
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
		t = t.trim().replace(/[[\]]/g, '');

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
		const variSpeed = this.lyricsScrollMaxMethod ? 0 : 10 * 500;

		if (t1 && t2 && t2 - t1 > 0) {
			durationScroll = Clamp(t2 - t1, this.minDurationScroll, this.durationScroll);
			if (t3 && t3 - t2 > 0 && t3 - t2 < this.durationScroll) {
				durationScroll = Clamp(t3 - t2, this.minDurationScroll, this.durationScroll);
			}
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
			durationScroll += Math.min(diff1, diff2);
		}

		this.delta = this.scroll * this.factor / durationScroll;
		this.transitionOffset = durationScroll / 2;
	}

	/**
	 * Gets the timestamp for a given word.
	 * @param {string} v - The word to get the timestamp for.
	 * @returns {number} The timestamp for the word, or undefined if the word is not found.
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
	 * Checks if the lyrics array has more than one element and if the playback time exceeds the next group's timestamp.
	 * @returns {boolean} True if the scroll needs to be updated.
	 */
	scrollUpdateNeeded() {
		if (this.locus >= this.lyrics.length - 1) return false;

		const currentSentenceGroup = this.lyrics[this.locus].sentenceGroup;
		let nextIndex = this.locus;

		while (nextIndex < this.lyrics.length && this.lyrics[nextIndex].sentenceGroup === currentSentenceGroup) {
			nextIndex++;
		}

		if (nextIndex < this.lyrics.length) {
			const nextTimestamp = this.lyrics[nextIndex].timestamp;
			const actualTime = grm.ui.isStreaming ? fb.PlaybackTime - bio.txt.reader.trackStartTime : fb.PlaybackTime;
			const curTime = Math.round(actualTime * 1000) + this.lyricsOffset + this.userOffset;
			return curTime >= nextTimestamp; // Adjusted to start at the exact timestamp
		}

		return false;
	}

	/**
	 * Seeks to the current playback position and highlights the appropriate line.
	 */
	seek() {
		this.clearHighlight();
		const actualTime = grm.ui.isStreaming ? fb.PlaybackTime - bio.txt.reader.trackStartTime : fb.PlaybackTime;
		const curTime = Math.round(actualTime * 1000) + this.lyricsOffset + this.userOffset;

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
			const currentSentenceGroup = this.lyrics[currentIndex].sentenceGroup;
			let startIndex = currentIndex;
			let endIndex = currentIndex;

			while (startIndex > 0 && this.lyrics[startIndex - 1].sentenceGroup === currentSentenceGroup) {
				startIndex--;
			}
			while (endIndex < this.lyrics.length - 1 && this.lyrics[endIndex + 1].sentenceGroup === currentSentenceGroup) {
				endIndex++;
			}

			const groupSize = endIndex - startIndex + 1;
			const highlightIndex = grSet.lyricsTranslationLine - 1;

			if (highlightIndex < groupSize) {
				this.lyrics[startIndex + highlightIndex].highlight = true;
			} else {
				this.lyrics[endIndex].highlight = true;
			}
			this.locus = startIndex;
		}
		else {
			this.locus = 0;
		}

		this.repaintRect();
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
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	/**
	 * Tidy ups a string by removing all timestamps and enhanced timestamps.
	 * @param {!string|number} n - The string containing timestamped data which needs cleaning up.
	 * @returns {!string} A cleaned version of the original string without any timestamps.
	 */
	tidy(n) {
		return n.replace(this.timestamps, '$1$4').replace(this.enhancedTimestamps, '$1$4').trim();
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
	 * Releases the scroll drag operation when the left mouse button is pressed.
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
	 * Adjusts the user offset, updates the display, and seeks to the new position.
	 * @param {number} step - The amount of scrolling offset that should be performed.
	 */
	on_mouse_wheel(step) {
		const scrollStepOffset = this.type.synced ? 500 : 1000;
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
	}
	// #endregion
}
