/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Lyrics                               * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-03-25                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
const lengthSeconds = fb.TitleFormat('%length_seconds%');
const LYRICS_TIMER_INTERVAL = 30; // Do not modify this value
const SCROLL_TIME = 300; // Max time in ms for new line to scroll
const SCROLL_WHEEL_TIME_OFFSET = 500; // Amount of time (ms) to adjust lyrics when scrolling
const OFFSET_DISPLAY_TIME = 5000; // Time in ms to display scroll offset at the top of the lyrics area
const LYRICS_PADDING = 24; // Padding between edge of artwork and the lyrics
const NO_LYRICS_STRING = 'No lyrics found'; // What to show when no lyrics exist
const LYRICS_NOT_FOUND_STRING = '\u200b \nSearch completed\n \nNo lyrics were found'; // What to show when no lyrics exist
const SEARCHING_LYRICS_STRING = '\u200b \nSearching for lyrics...\n \nPlease wait...'; // What to show when searching for lyrics
const timeStampRegex = /^(\s*\[\d{1,2}:\d\d(]|\.\d{1,3}]))+/;
const singleTimestampRegex = /^\s*(\[\d{1,2}:\d\d(]|\.\d{1,3}]))/;

/** @enum {number} */
const LyricsType = {
	None: 0,
	Synced: 1,
	Unsynced: 2
};

/** @type {Lyrics} */
let gLyrics;


//////////////
// * LINE * //
//////////////
/**
 * @typedef {Object} LineObj
 * @property {string} lyric The text of the line
 * @property {string} timeStamp The timestamp string
 * @property {float} time The timestamp as a float value in seconds
 * @property {number} timeMs The timestamp as an integer in milliseconds
 * @property {boolean} focus Does the line have focus
 */
class Line {
	constructor(lyricJson) {
		this.time = 0;
		this.timeStamp = '';
		this.lyric = '';
		this.focus = false;
		Object.assign(this, lyricJson);
		this.timeMs = Math.round(this.time * 1000);
		this.lines = 0;
		this.width = 0;
		this.height = 0;
		this.y = 0;
	}

	/**
	 * @param {GdiGraphics} gr
	 * @param {number} w Width
	 * @param {number} h Height
	 * @param {number} minHeight Minimum height of a line (used for blank lines)
	 * @param {number} yPosition yVal of the line in the list of lyrics
	 */
	calcSize(gr, w, h, minHeight, yPosition) {
		const strInfo = gr.MeasureString(this.lyric, pref.lyricsLargerCurrentSync && this.lyricsType === LyricsType.Synced ? ft.lyricsHighlight : ft.lyrics, 0, 0, w, h);
		this.lines = strInfo.Lines;
		this.width = strInfo.Width;
		this.height = Math.min(Math.max(minHeight, strInfo.Height), h / 2);	// At least minHeight (for blank lines) and no more than half artwork height
		this.y = yPosition;
	}

	/**
	 * @param {GdiGraphics} gr
	 * @param {number} yOffset
	 */
	draw(gr, x, width, yOffset, highlightActive) {
		const highlight = highlightActive && this.focus && !isStreaming;
		const lyricFont = highlight && pref.lyricsLargerCurrentSync ? ft.lyricsHighlight : ft.lyrics;
		const color = highlight ? col.lyricsHighlight : pref.lyricsAlbumArt ? /* Disable synced lyrics when streaming -> */ col.lyricsNormal : g_pl_colors.row_title_normal;
		const center = StringFormat(1, 1, 4);	// Center with ellipses

		// * Drop shadow behind text
		if (pref.lyricsAlbumArt) {
			gr.DrawString(this.lyric, lyricFont, col.lyricsShadow, x - 1, this.y + yOffset, width, this.height + 1, center);
			gr.DrawString(this.lyric, lyricFont, col.lyricsShadow, x, this.y + yOffset - 1, width, this.height + 1, center);
			gr.DrawString(this.lyric, lyricFont, col.lyricsShadow, x + 2, this.y + yOffset + 2, width, this.height + 1, center);
		}
		// * Text
		gr.DrawString(this.lyric, lyricFont, color, x, this.y + yOffset, width, this.height + 1, center);
	}
}


////////////////
// * LYRICS * //
////////////////
class Lyrics {
	/**
	 * @param {FbMetadbHandle} metadb
	 * @param {?*} lyrics User specified lyrics
	 */
	constructor(metadb, lyrics = undefined) {
		this.metadb = metadb;
		this.fileName = '';
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.lyricsType = LyricsType.None;

		/** @protected */ this.songLength = parseInt(lengthSeconds.Eval());
		/** @protected {Line[]} */
		this.lines = [];
		/** @protected */ this.activeLine = -1; // Index into this.lines
		/** @protected */ this.scrolling = false;
		/** @protected */ this.scrollOffset = 0;
		/** @protected */ this.scrollStep = 0;	// When scrolling to a new value, how much should we scroll
		/** @protected */ this.timeOffset = 0;
		/** @protected */ this.lineSpacing = scaleForDisplay(10);
		/** @protected */ this.lineHeight = 0;
		/** @protected */ this.timerId = 0;
		/** @protected */ this.loadingTimerId = 0;	// Timer when loading embedded lyrics
		/** @protected */ this.showOffsetTimerId = 0; // Timer to hide offset
		/** @protected */ this.showOffset = false;
		/** @protected */ this.lyricsSearchTimer = 0;
		/** @protected */ this.searchTimeoutTimer = 0;

		this.loadLyrics();
		if (fb.IsPlaying) {
			this.seek();
			if (!fb.IsPaused) {
				this.startTimer();
			}
		}
	}

	// * METHODS * //

	loadLyrics() {
		let rawLyrics = [];
		const foundLyrics = this.findLyrics();
		if (foundLyrics) {
			if (pref.displayLyrics) console.log('Found Lyrics:', this.fileName);
			rawLyrics = utils.ReadTextFile(this.fileName, 65001).split('\n');
		}
		else {
			const embeddedLyrics = $(tf.lyrics);
			if (embeddedLyrics.length) {
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
		}
		if (rawLyrics.length) {
			this.processLyrics(rawLyrics);
		}
		else {
			// * No lyrics found locally
			if (componentESLyric) {
				this.searchingLyrics();
			} else {
				this.processLyrics([NO_LYRICS_STRING]);
			}
		}
	}

	/**
	 * Searches through config file's list of lyric paths and file patterns to find lyrics files
	 * @returns {boolean}
	 */
	findLyrics() {
		let foundLyrics = false;
		const tpath = [];
		const tfilename = [];

		const stripReservedChars = (filename) => filename.replace(/[<>:"/\\|?*]/g, '_');
		const lyricPaths = pref.customLyricsDir ? globals.customLyricsDir : tf.lyr_path;

		lyricPaths.forEach(path => {
			tpath.push($(path));
		});
		globals.lyricFilenamePatterns.forEach(filename => {
			tfilename.push(stripReservedChars($(filename)));
		});

		for (let i = 0; i < tpath.length && !foundLyrics; i++) {
			for (let j = 0; j < tfilename.length; j++) {
				foundLyrics = this.checkFile(tpath[i], tfilename[j]);
				if (foundLyrics) {
					break;
				}
			}
		}

		return foundLyrics;
	}

	/**
	 * Checks if lyrics file exists at path+filename and sets this.fileName if it does
	 * @param {string} path
	 * @param {string} filename
	 */
	checkFile(path, filename) {
		let found = true;
		if (IsFile(`${path + filename}.lrc`)) {
			this.fileName = `${path + filename}.lrc`;
		}
		else if (IsFile(`${path + filename}.txt`)) {
			this.fileName = `${path + filename}.txt`;
		}
		else {
			found = false;
		}
		return found;
	}

	searchingLyrics() {
		this.processLyrics([SEARCHING_LYRICS_STRING]);
		this.lyricSave(fb.GetNowPlaying());
		clearTimeout(this.searchTimeout);

		this.searchTimeout = setTimeout(() => {
			if (!this.findLyrics()) {
				this.processLyrics([LYRICS_NOT_FOUND_STRING]);
				this.on_size(albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h);
			}
			clearInterval(this.lyricsSearchTimer);
		}, 60000);
	}

	lyricSave(metadb) { // * Automatic lyric file saver
		if (!componentESLyric) return;
		clearInterval(this.lyricsSearchTimer);
		if (!metadb) return;

		this.lyricsSearchTimer = setInterval(() => {
			if (this.findLyrics()) {
				clearInterval(this.lyricsSearchTimer);
				initLyrics();
			} else {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
			}
		}, 1000);
	}

	/**
	 * @param {String[]} rawLyrics
	 */
	processLyrics(rawLyrics) {
		let tsCount = 0;
		const noLyrics = rawLyrics[0] === NO_LYRICS_STRING;

		// Reset lyric time state when new track on stream starts to make lyrics work correctly again
		this.streamOffset = isStreaming ? Math.round(fb.PlaybackTime * 1000) : 0;

		rawLyrics.forEach(line => {
			if (timeStampRegex.test(line)) {
				tsCount++;
			}
		});
		if (tsCount > rawLyrics.length * 0.3 && !noLyrics) {
			this.lyricsType = LyricsType.Synced;
		}
		const lyrics = [{ timeStamp: '00:00.00', time: 0, lyric: noLyrics ? NO_LYRICS_STRING : '' }];
		if (this.lyricsType === LyricsType.Synced) {
			// Check for embedded offset in lrc file
			let lyricOffset = null;
			rawLyrics.some(line => {
				lyricOffset = line.match(/^\s*\[offset\s*:(.*)\]\s*$/);
				return lyricOffset;
			});
			if (lyricOffset && lyricOffset.length > 0) this.timeOffset = parseInt(lyricOffset[1]);
			if (isNaN(this.timeOffset)) this.timeOffset = 0;

			rawLyrics.forEach(line => {
				const r = timeStampRegex.exec(line);
				if (r && r[0]) {
					// Line has at least one timestamp
					let timestampStr = r[0];
					const lyric = replaceChars(line.substr(timestampStr.length));

					let ts;
					while (timestampStr.length && (ts = singleTimestampRegex.exec(timestampStr))) {
						timestampStr = timestampStr.substr(ts[0].length);
						const timeComponents = ts[0].trim().replace('[', '').replace(']', '').split(':');
						const time = (parseInt(timeComponents[0]) * 60) + parseFloat(timeComponents[1]);
						lyrics.push({ timeStamp: ts[0], time, lyric });
					}
				}
			});
		}
		else if (!noLyrics) {
			this.lyricsType = LyricsType.Unsynced;
			const unsyncedScrollDelay = Math.max(Math.floor(this.songLength * 0.08), 10);	// Num seconds to wait before scrolling at start of song.
			const availSecs = this.songLength - unsyncedScrollDelay * 2;
			const lineTiming = availSecs / rawLyrics.length;
			rawLyrics.forEach((line, i) => {
				const lyric = replaceChars(line);
				const time = isStreaming ? rawLyrics.length / 30 * i : unsyncedScrollDelay + lineTiming * i;
				lyrics.push({ timeStamp: '--', time, lyric });
			});
			let done = false;
			while (lyrics.length && !done) {
				// Remove all empty trailing lines
				if (!lyrics[lyrics.length - 1].lyric.length) {
					lyrics.pop();
				} else {
					done = true;
				}
			}
		}
		this.lines = lyrics.sort((a, b) => a.time - b.time).map(lyric => new Line(lyric));
	}

	/**
	 * Sets the focus line. Should be called when playback starts, or whenever seeking in the file
	 */
	seek() {
		const time = Math.round(fb.PlaybackTime * 1000) + this.timeOffset - this.streamOffset;
		this.lines.forEach(l => { l.focus = false });
		const index = this.lines.findIndex(l => l.timeMs >= time);
		this.activeLine = index === -1 ? this.lines.length - 1 : Math.max(0, index - 1);	// If time > all timeMs values, then we're on the last line of the song, otherwise choose previous line

		if (this.activeLine >= 0) {
			this.lines[this.activeLine].focus = true;
			this.repaint();
		}
	}

	startTimer() {
		this.clearTimer();
		this.timerId = setInterval(() => { this.timerTick(); }, LYRICS_TIMER_INTERVAL);
	}

	clearTimer() {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = 0;
		}
		clearTimeout(this.loadingTimerId);
		clearTimeout(this.showOffsetTimerId);
	}

	timerTick() {
		/** @type {float} */
		const time = Math.round(fb.PlaybackTime * 1000) + this.timeOffset - this.streamOffset;
		if ((this.lines.length > this.activeLine + 1) && (time > this.lines[this.activeLine + 1].timeMs)) {
			// Advance active Line
			this.scrolling = true;
			if (this.activeLine !== -1) {
				this.lines[this.activeLine].focus = false;
				this.scrollOffset = this.lines[this.activeLine].height + this.lineSpacing;	// scrollOffset is actually the previously activeline that we want to scroll out of the way
				this.scrollStep = Math.max(1, Math.round(this.scrollOffset / (SCROLL_TIME / LYRICS_TIMER_INTERVAL)));
			} else {
				this.scrollOffset = 0;
			}
			this.lines[++this.activeLine].focus = true;
		}
		else if (this.scrolling) {
			this.scrollOffset = Math.max(0, this.scrollOffset - this.scrollStep);
			if (this.scrollOffset <= 0) {
				this.scrolling = false;
			}
			this.repaint();
		}
		else {
			// Otherwise nothing to do this tick
		}
	}

	repaint() {
		window.RepaintRect(this.x - LYRICS_PADDING, this.y - LYRICS_PADDING, this.w + LYRICS_PADDING * 2, this.h + LYRICS_PADDING * 3);
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	drawLyrics(gr) {
		if (this.lines.length && this.activeLine >= 0) {
			let activeTop = Math.floor(this.h * 0.37);	// Position of the active line
			const extraSpacing = Math.floor(this.h * 0.26) * (this.activeLine / this.lines.length);
			activeTop += this.lines.length > 9 ? extraSpacing : 0;	// Adjusting position looks dumb if very few lines
			const activeY = this.lines[this.activeLine].y;

			const viewportTop = activeY - activeTop;
			const highlightActive = this.lyricsType !== LyricsType.Unsynced;	// Highlight no lyrics text
			this.lines.forEach(l => {
				if (l.y > viewportTop && l.y + l.height < this.h + viewportTop) {
					l.draw(gr, this.x, this.w, this.y - viewportTop + this.scrollOffset, highlightActive);
				}
			});
			if (this.lyricsType === LyricsType.Synced && this.timeOffset && this.showOffset) {
				gr.DrawString(`Offset: ${this.timeOffset / 1000}s`, ft.lyrics, col.lyricsHighlight, this.x, this.y, this.w, this.h + 1, StringFormat(2, 0));
			}
		}
	}

	// * CALLBACKS * //

	on_playback_pause(state) {
		if (state) {
			this.clearTimer();
		} else {	// Unpausing
			this.startTimer();
		}
	}

	on_playback_stop(reason) {
		this.clearTimer();
		this.lines = [];
	}

	on_mouse_wheel(delta) {
		if (delta > 0) {
			this.timeOffset -= SCROLL_WHEEL_TIME_OFFSET;
		} else {
			this.timeOffset += SCROLL_WHEEL_TIME_OFFSET;
		}
		this.showOffset = this.timeOffset !== 0;
		clearTimeout(this.showOffsetTimerId);
		this.showOffsetTimerId = setTimeout(() => {
			this.showOffset = false;
			this.repaint();
		}, OFFSET_DISPLAY_TIME);
		this.seek();
	}

	on_size(x, y, w, h) {
		this.x = x + LYRICS_PADDING;
		this.y = y + LYRICS_PADDING;
		this.w = w - LYRICS_PADDING * 2;	// Should width/height be split?
		this.h = h - LYRICS_PADDING * 3;
		this.lineSpacing = scaleForDisplay(10);
		if (this.lines.length && this.w > 10 && this.h > 100) {
			const tmpImg = gdi.CreateImage(this.w, Math.round(this.h / 5));
			const gr = tmpImg.GetGraphics();
			const minHeight = gr.MeasureString('I', pref.lyricsLargerCurrentSync && this.lyricsType === LyricsType.Synced ? ft.lyricsHighlight : ft.lyrics, 0, 0, this.w, this.h).Height;
			for (let i = 0, yPos = 0; i < this.lines.length; i++) {
				this.lines[i].calcSize(gr, this.w, this.h, minHeight, yPos);
				yPos += this.lines[i].height + this.lineSpacing;
			}
			tmpImg.ReleaseGraphics(gr);
		}
		this.repaint();
	}
}


/**
 * Load lyrics of nowPlaying song, and sets size of the lyrics draw area
 */
function initLyrics() {
	gLyrics = new Lyrics(fb.GetNowPlaying());
	if (gLyrics.lyricsType === LyricsType.None) {
		gLyrics.loadingTimerId = setTimeout(() => {
			gLyrics.loadLyrics();
			gLyrics.seek();
			gLyrics.on_size(albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h);
		}, 500);
	}
	gLyrics.on_size(albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h);
}
