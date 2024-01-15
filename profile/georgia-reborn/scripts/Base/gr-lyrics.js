/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Lyrics                               * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred + WilB                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2024-01-15                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {Lyrics} */
let lyrics;
/** @type {<Array<string>>} */
let lyricSource;
/** @type {number} */
let lyricsSourceQueue = 0;
/** @type {string} */
let lyricType;


///////////////////////
// * LYRICS OBJECT * //
///////////////////////
/**
 * Loads and displays lyrics on album art in the Lyrics panel from the cache directory or embedded files.
 */
class Lyrics {
	constructor() {
		/** @type {<Array<string>>} */
		this.lyr = [];
		/** @type {<Array<string>>} */
		this.lyrics = [];
		/** @type {<Array<number>>} */
		this.timestamps         = /(\s*)\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}])(\s*)/g;
		/** @type {<Array<number>>} */
		this.enhancedTimestamps = /(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g;
		/** @type {<Array<number>>} */
		this.leadingTimestamps  = /^(\s*\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}]))+/;
		/** @type {number} */
		this.stepTime = 0;
		/** @type {<Array<string>>} */
		this.stringNoLyrics  = ['No lyrics found'];
		/** @type {<Array<string>>} */
		this.stringNotFound  = ['Search completed\nNo lyrics were found'];
		/** @type {<Array<string>>} */
		this.stringSearching = ['Searching for lyrics...\nPlease wait...'];
		/** @type {number} */
		this.tfLength = fb.TitleFormat('%length_seconds%');
		/** @type {number} */
		this.textPad = SCALE(12);
		/** @type {GdiFont} */
		this.font = { lyrics: pref.lyricsLargerCurrentSync ? ft.lyricsHighlight : ft.lyrics };

		/** @type {GdiGraphics} */
		GR(1, 1, false, g => {
			this.font.lyrics_h = Math.round(g.CalcTextHeight('STRING', this.font.lyrics) + (pref.lyricsLargerCurrentSync ? 0 : this.textPad));
		});

		this.clear();

		/** Changes current lyrics when changing the lyrics source, only used for ESLyric "Lyric search". */
		const changeLyrics = (meta) => {
			this.clear();
			if (!meta) return;

			lyricSource = [meta.lyricText];
			lyricSource = lyricSource.map(line => line.split('\n')).flat();

			const timestamps = /\[\d{2}:\d{2}\.\d{2}\]/;
			lyricType = timestamps.test(lyricSource) ? 'lrc' : 'txt';

			this.loadLyrics(lyricSource);
		};
		const esl = new ActiveXObject('eslyric');
		esl.SetPlayingLyricChangedCallback(changeLyrics); // Start ESLyric callback listener when lyrics change
	}

	// * METHODS * //

	/**
	 * Initializes the lyrics as follows:
	 * - Loads them from cache if found locally or from embedded tags.
	 * - Otherwise a timed search will be triggered.
	 * - When nothing was found a `No lyrics found` string will be displayed.
	 */
	initLyrics() {
		let rawLyrics = [];
		const embeddedLyrics = $(tf.lyrics);
		const foundLyrics = this.findLyrics();

		if (foundLyrics) {
			if (pref.displayLyrics) console.log('Found Lyrics:', this.fileName);
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
		} else if (componentESLyric) { // * No lyrics found locally, searching...
			this.searchLyrics();
		} else { // * Search completed, no lyrics were found
			this.loadLyrics(this.stringNoLyrics);
		}
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
		const lyricPaths = pref.customLyricsDir ? globals.customLyricsDir : globals.lyr_path;

		for (const path of lyricPaths) {
			tpath.push($($Escape(path)));
		}
		for (const filename of globals.lyricFilenamePatterns) {
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
	 * @param {string} path The lyric file path
	 * @param {string} filename The lyric file name
	 */
	checkLyrics(path, filename) {
		const types = [lyricType, 'lrc', 'txt'];

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
				this.on_size(albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h);
			}
			clearInterval(this.lyricsSearchTimer);
		}, 60000);
	}

	/**
	 * Cycles through the next lyric source in the search results, used for ESLyric's "Next lyric" feature.
	 */
	nextLyrics() {
		const nextSrc = (meta) => {
			fb.RunMainMenuCommand('View/ESLyric/Panels/Delete lyric');
			lyricsSourceQueue++;

			RepeatFunc(() => {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Select lyric/Next lyric');
				if (!meta) return;

				lyricSource = [meta.lyricText];
				lyricSource = lyricSource.map(line => line.split('\n')).flat();

				const timestamps = /\[\d{2}:\d{2}\.\d{2}\]/;
				lyricType = timestamps.test(lyricSource) ? 'lrc' : 'txt';
			}, lyricsSourceQueue);

			return lyricsSourceQueue;
		};

		nextSrc();
		setTimeout(() => { fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric'); }, 1000);
		setTimeout(() => { initLyrics(); }, 1000);
	}

	/**
	 * Automatically saves the lyrics file to cache once it was successfully found.
	 * @param {FbMetadbHandle} metadb The metadb of the track.
	 */
	saveLyrics(metadb) {
		clearInterval(this.lyricsSearchTimer);
		if (!componentESLyric && !metadb) return;

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
	 * @param {string} lyr The lyrics that will be loaded and displayed.
	 */
	loadLyrics(lyr) {
		const newLyrics = !Equal(lyr, this.lyr);
		if (newLyrics) {
			this.lyr = lyr;
			this.userOffset = 0;
		}

		this.x = albumArtSize.x + SCALE(40);
		this.y = albumArtSize.y + SCALE(40);
		this.w = albumArtSize.w - SCALE(80);
		this.h = albumArtSize.h - SCALE(80);
		if (noAlbumArtStub) resetLyricsPosition();

		this.alignCenter = StringFormat(1, 1);
		this.alignRight = StringFormat(2, 1);
		this.init = true;
		this.lineHeight = this.font.lyrics_h;
		this.arc = SCALE(6);
		this.lyricsScrollTimeMax = pref.lyricsScrollRateAvg * 0.5;
		this.lyricsScrollTimeAvg = pref.lyricsScrollRateMax;
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
		this.dropShadowLevel = pref.lyricsDropShadowLevel;
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
		this.bot = this.top + this.lineHeight * (linesDrawn - 3);

		this.parseLyrics(lyr);
	}

	/**
	 * Determines if the lyrics are synced or unsynced, formats and parses them accordingly.
	 * @param {string} lyr The lyrics that need to be parsed.
	 */
	parseLyrics(lyr) {
		if (!lyr.length) {
			this.type.none = true;
			lyr = this.stringNoLyrics;
		}

		if (!this.type.none) {
			if (lyr.some(line => this.leadingTimestamps.test(line))) this.type.synced = true;
			else this.type.unsynced = true;
		}

		switch (true) {
			case this.type.synced: {
				let lyrOffset = null;
				lyr.some(line => { lyrOffset = line.match(/^\s*\[offset\s*:(.*)\]\s*$/); return lyrOffset });
				if (lyrOffset && lyrOffset.length > 0) this.lyricsOffset = parseInt(lyrOffset[1]);
				if (isNaN(this.lyricsOffset)) this.lyricsOffset = 0;
				this.formatLyrics(this.parseSyncLyrics(lyr, this.type.none), this.type.synced);
				break;
			}
			case this.type.unsynced: {
				this.formatLyrics(this.parseUnsyncedLyrics(lyr, this.type.none));
				const ratio = isStreaming ? 2000 : this.trackLength / this.lyrics.length * 1000;
				for (const [i, line] of this.lyrics.entries()) line.timestamp = ratio * i;
				break;
			}
		}
		this.seek();
		this.start();
	}

	/**
	 * Parses synced lyrics that contain timestamps and content of each line, sorted by timestamp.
	 * @param {string} lyr The lyrics of the song. Each string in the array represents a line of lyric.
	 * @param {boolean} isNone Indicates if the lyrics array starts with a timestamp or not.
	 * @returns {Array} An array of objects with properties `timestamp` and `content`.
	 */
	parseSyncLyrics(lyr, isNone) {
		const lyrics = [];
		if (isNone) lyrics.push({ timestamp: 0, content: lyr[0] });
		for (const line of lyr) {
			const content = this.tidy(line);
			const matches = line.match(this.leadingTimestamps);
			if (matches) {
				const all = matches[0].split('][');
				for (const m of all) {
					lyrics.push({ timestamp: this.getMilliseconds(m), content });
				}
			}
		}
		return lyrics.sort((a, b) => a.timestamp - b.timestamp);
	}

	/**
	 * Parses unsynced lyrics when there are no timestamps included.
	 * @param {string} lyr The lyrics of the song.
	 * @param {boolean} isNone The first line of lyrics should be treated as a timestamp or not.
	 * @returns {Object} An array of objects with "timestamp" and "content" properties for each line of the lyric.
	 */
	parseUnsyncedLyrics(lyr, isNone) {
		const lyrics = [];
		if (isNone) lyrics.push({ timestamp: 0, content: lyr[0] });
		for (const line of lyr) {
			lyrics.push({ timestamp: 0, content: this.tidy(line) });
		}
		return lyrics;
	}

	/**
	 * Formats the lyrics with synchronization and line wrapping.
	 * @param {string} lyrics An array of objects with the properties "content" and "timestamp".
	 * @param {boolean} isSynced Whether the lyrics are synced with the audio or not.
	 */
	formatLyrics(lyrics, isSynced) {
		if (lyrics.length && this.w > 10) {
			if (isSynced && lyrics[0].content && lyrics[0].timestamp > this.durationScroll) lyrics.unshift({ timestamp: 0, content: '' });
			GR(1, 1, false, g => {
				for (let i = 0; i < lyrics.length; i++) {
					const l = g.EstimateLineWrap(lyrics[i].content, this.font.lyrics, this.w - 10);
					if (l[1] > this.maxLyrWidth) this.maxLyrWidth = l[1];
					if (l.length > 2) {
						const numLines = l.length / 2;
						let maxScrollTime = this.durationScroll * 2; // * Prevent scroll jump when displaying synced multi-lines
						if (lyrics[i + 1]) {
							maxScrollTime = Math.min(maxScrollTime * numLines, (lyrics[i + 1].timestamp - lyrics[i].timestamp) / numLines);
						}
						for (let j = 0; j < l.length; j += 2) {
							this.lyrics.push({ content: l[j].trim(), timestamp: lyrics[i].timestamp + maxScrollTime * j / 2, id: i, multiLine: !!j });
						}
					} else this.lyrics.push({ content: lyrics[i].content.trim(), timestamp: lyrics[i].timestamp, id: i });
				}
			});
		}
		this.maxLyrWidth = Math.min(this.maxLyrWidth + 40, this.w);
		const incr = Math.min(500, this.durationScroll);
		for (const [i, v] of this.lyrics.entries()) {
			const t1 = this.getTimestamp(i - 1);
			const t2 = this.getTimestamp(i);
			const t3 = this.getTimestamp(i + 1);
			if (!v.content && t3 && t2 && t1 && t3 - t2 < incr) v.timestamp = Math.max((t2 - t1) / 2 + t1, t2 - incr);
		}
		this.repaintRect();
	}

	/**
	 * Defines the draw area when lyrics should be displayed.
	 * @param {number} y The distance from the top of the screen to the top of the lyrics.
	 * @param {number} top The top position of the lyrics display area.
	 * @returns {boolean} True if the given `y` value is within the range of `top` and `top` plus the line height.
	 */
	displayLyrics(y, top) {
		return y >= top && y + (pref.lyricsFadeScroll ? this.lineHeight : 0) <= this.h + top;
	}

	/**
	 * Draws the lyrics on screen and also applies various visual effects such as fading and drop shadows.
	 * @param {GdiGraphics} gr
	 */
	drawLyrics(gr) {
		if (!(pref.displayLyrics && this.lyrics.length && this.locus >= 0)) return;

		const top = this.locus * this.lineHeight - this.locusOffset;
		const transition_factor = Clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transition_factor_in = !this.lyrics[this.locus].multiLine ? transition_factor : 1;
		const transition_factor_out = Clamp(transition_factor_in * 3, 0, 1);
		const alpha = Math.min(255 * transition_factor * 4 / 3, 255);
		const blendIn = this.type.synced ? GetBlend(col.lyricsHighlight, col.lyricsNormal, transition_factor_in) : col.lyricsNormal;
		const blendOut = this.type.synced ? GetBlend(col.lyricsNormal, col.lyricsHighlight, transition_factor_out) : col.lyricsNormal;
		const y = this.y + this.scroll;

		let color  = col.lyricsNormal;

		let fadeBot = pref.lyricsFadeScroll ? this.transBot[transition_factor] : color;
		if (!fadeBot) {
			fadeBot = RGBtoRGBA(color, alpha);
			this.transBot[transition_factor] = fadeBot;
		}

		let fadeTop = pref.lyricsFadeScroll ? this.transTop[transition_factor] : color;
		if (!fadeTop) {
			fadeTop = RGBtoRGBA(color, 255 - alpha);
			this.transTop[transition_factor] = fadeTop;
		}

		gr.SetTextRenderingHint(5);

		for (const [i, lyric] of this.lyrics.entries()) {
			const font = lyric.highlight && pref.lyricsLargerCurrentSync ? ft.lyricsHighlight : ft.lyrics;
			const lyric_y = this.lineHeight * i;
			const line_y = Math.round(y - top + lyric_y - ((this.stringSearching || this.stringNotFound) ? SCALE(24) : 0));
			const bottomLine = line_y > this.bot + this.lineHeight * (pref.lyricsFadeScroll ? 2 : 3);

			if (!this.displayLyrics(lyric_y, top)) continue;

			if (this.shadowEffect && line_y >= this.top && !bottomLine) { // * Do not show drop shadow at top and bottom
				if (this.dropNegativeShadowLevel) {
					gr.DrawString(lyric.content, font, col.lyricsShadow, this.x - this.dropNegativeShadowLevel, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
					gr.DrawString(lyric.content, font, col.lyricsShadow, this.x, line_y - this.dropNegativeShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
				}

				gr.DrawString(lyric.content, font, col.lyricsShadow, this.x + this.dropShadowLevel, line_y + this.dropShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
			}

			color = line_y >= this.top ? lyric.highlight ? blendIn : i === this.locus - 1 ? blendOut : bottomLine ? fadeBot : col.lyricsNormal : fadeTop;
			gr.DrawString(lyric.content, font, color, this.x, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
		}

		if (this.showOffset) {
			this.offsetW = gr.CalcTextWidth(`Offset: ${this.userOffset / 1000}s`, ft.notification) + this.lineHeight;
			gr.FillRoundRect(this.x + this.w - this.offsetW, this.y, this.offsetW, this.lineHeight + 1, this.arc, this.arc, col.popupBg);
			gr.DrawRoundRect(this.x + this.w - this.offsetW, this.y, this.offsetW, this.lineHeight + 1, this.arc, this.arc, 1, 0x64000000);
			gr.DrawString(`Offset: ${this.userOffset / 1000}s`, ft.notification, col.popupText, this.x - this.lineHeight * 0.5, this.y, this.w, this.lineHeight + 1, this.alignRight);
		}
	}

	/**
	 * Advances the highlighted lyric by one line.
	 */
	advanceHighLighted() {
		this.newHighlighted = true;
		this.scroll = 0;
		if (this.locus >= 0) {
			this.clearHighlight();
			this.scroll = this.lineHeight;
		}
		this.locus++;
		this.getScrollSpeed();
		this.setHighlight();
		this.repaintRect();
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
	}

	/**
	 * Removes highlight from all lines in the lyric array.
	 */
	clearHighlight() {
		for (const v of this.lyrics) { v.highlight = false }
	}

	/**
	 * Gets the index of the current lyric line.
	 */
	getCurPos() {
		return this.lyrics.findIndex(v => v.timestamp >= this.playbackTime());
	}

	/**
	 * Converts timestamped lyrics to milliseconds.
	 * @param {string} t The timestamped string.
	 * @returns {number} The time in milliseconds.
	 */
	getMilliseconds(t) {
		t = t.trim().replace(/[[\]]/, '').split(':');
		return Math.max((t.reduce((acc, time) => (60 * acc) + parseFloat(time))) * 1000, 0);
	}

	/**
	 * Gets the duration of the scroll animation.
	 * @returns {number} The duration of the scroll animation in milliseconds.
	 */
	getScrollSpeed() {
		let { durationScroll } = this;
		const t1 = this.getTimestamp(this.locus - 1);
		const t2 = this.getTimestamp(this.locus);
		const t3 = this.getTimestamp(this.locus + 1);
		if (t1 && t2 && t2 - t1 > 0) {
			durationScroll = Clamp(t2 - t1, this.minDurationScroll, this.durationScroll);
			if (t3 && t3 - t2 > 0 && t3 - t2 < this.durationScroll) durationScroll = Clamp(t3 - t2, this.minDurationScroll, this.durationScroll);
		}

		const variSpeed = this.lyricsScrollMaxMethod ? 0 : 10 * 500;
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

		this.delta = this.lineHeight * this.factor / durationScroll;
		this.transitionOffset = durationScroll / 2;
	}

	/**
	 * Gets the timestamp for a given word.
	 * @param {string} v The word to get the timestamp for.
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
		const time = isStreaming ? fb.PlaybackTime - txt.reader.trackStartTime : fb.PlaybackTime;
		return Math.round(time * 1000) + this.lyricsOffset + this.transitionOffset + this.userOffset;
	}

	/**
	 * Repaints the lyrics when scroll animation occurs.
	 */
	repaintRect() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	/**
	 * Checks if the lyrics array has more than one element and if the playback time is greater than the timestamp of the next lyric.
	 * @returns {boolean} True if the scroll needs to be updated.
	 */
	scrollUpdateNeeded() {
		return this.lyrics.length > this.locus + 1 && this.playbackTime() > this.lyrics[this.locus + 1].timestamp;
	}

	/**
	 * Seeks to the current playback position.
	 */
	seek() {
		this.clearHighlight();
		const curPos = this.getCurPos();
		this.locus = curPos < 0 ? this.lyrics.length - 1 : Math.max(0, curPos - 1);
		if (this.locus >= 0) {
			this.setHighlight();
			this.repaintRect();
		}
	}

	/**
	 * Sets the highlight for the current synced lyric.
	 */
	setHighlight() {
		const { id } = this.lyrics[this.locus];
		if (this.type.synced) for (const v of this.lyrics) { if (v.id === id) v.highlight = true; }
	}

	/**
	 * Smoothly scrolls the lyrics to the next lyric on scroll animation.
	 */
	smoothScroll() {
		if (!pref.displayLyrics) return;

		if (this.scrollUpdateNeeded()) {
			this.advanceHighLighted();
		}
		else if (this.newHighlighted) this.checkScroll();
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
	 * @param {!string|number} n The string containing timestamped data which needs cleaning up.
	 * @returns {!string} A cleaned version of the original string without any timestamps.
	 */
	tidy(n) {
		return n.replace(this.timestamps, '$1$4').replace(this.enhancedTimestamps, '$1$4').trim();
	}

	// * CALLBACKS * //

	/**
	 * Adjusts the user offset, updates the display, and seeks to the new position.
	 * @param {number} step The amount of scrolling offset that should be performed.
	 */
	on_mouse_wheel(step) {
		step *= Clamp(Math.round(500 / ((Date.now() - this.stepTime) * 5)), 1, 5);
		this.stepTime = Date.now();
		this.userOffset += 500 * -step;
		if (!this.userOffset) this.repaintRect();
		this.showOffset = this.userOffset !== 0;
		clearTimeout(this.showOffsetTimer);
		this.showOffsetTimer = setTimeout(() => {
			this.showOffset = false;
			this.repaintRect();
		}, 5000);
		this.seek();
	}

	/**
	 * Checks if the playback is paused and stops or starts accordingly.
	 * @param {boolean} isPaused Wether playback is currently paused or not.
	 */
	on_playback_pause(isPaused) {
		if (isPaused) this.stop();
		else this.start();
	}

	/**
	 * Stops the playback.
	 * @param {number} reason The type of playback stop.
	 */
	on_playback_stop(reason) {
		this.stop();
	}

	/**
	 * Adjusts the size and position of the lyrics object and repaints it.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} w The width.
	 * @param {number} h The height.
	 */
	on_size(x, y, w, h) {
		this.x = x + SCALE(40);
		this.y = y + SCALE(40);
		this.w = w - SCALE(80);
		this.h = h - SCALE(80);
		this.repaintRect();
	}
}
