/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Lyrics                               * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred + WilB                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-07-19                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {Lyrics} */
let lyrics;
/** @type {number} */
let lyricsSrc = 0;


///////////////////////
// * LYRICS OBJECT * //
///////////////////////
class Lyrics {
	constructor() {
		this.lyr = [];
		this.lyrics = [];
		this.timestamps         = /(\s*)\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}])(\s*)/g;
		this.enhancedTimestamps = /(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g;
		this.leadingTimestamps  = /^(\s*\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}]))+/;
		this.stepTime = 0;
		this.stringNoLyrics  = ['No lyrics found'];
		this.stringNotFound  = ['Search completed\nNo lyrics were found'];
		this.stringSearching = ['Searching for lyrics...\nPlease wait...'];
		this.tfLength = fb.TitleFormat('%length_seconds%');
		this.textPad = scaleForDisplay(12);

		this.font = {
			lyrics: pref.lyricsLargerCurrentSync ? ft.lyricsHighlight : ft.lyrics
		};

		gr(1, 1, false, g => {
			this.font.lyrics_h = Math.round(g.CalcTextHeight('STRING', this.font.lyrics) + (pref.lyricsLargerCurrentSync ? 0 : this.textPad));
		});

		this.clear();
	}

	// * METHODS * //

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
	 * Checks if lyrics file exists at path+filename and sets this.fileName if it does
	 * @param {string} path
	 * @param {string} filename
	 */
	checkLyrics(path, filename) {
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

	saveLyrics(metadb) {
		clearInterval(this.lyricsSearchTimer);
		if (!componentESLyric || !metadb) return;

		// * Automatic lyric file saver
		this.lyricsSearchTimer = setInterval(() => {
			if (this.findLyrics()) {
				clearInterval(this.lyricsSearchTimer);
				this.initLyrics();
			} else {
				fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
			}
		}, 1000);
	}

	loadLyrics(lyr) {
		const newLyrics = !equal(lyr, this.lyr);
		if (newLyrics) {
			this.lyr = lyr;
			this.userOffset = 0;
		}

		this.alignCenter = StringFormat(1, 1);
		this.alignRight = StringFormat(2, 1);
		this.init = true;
		this.lineHeight = this.font.lyrics_h;
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
		this.x = albumArtSize.x + scaleForDisplay(40);
		this.y = albumArtSize.y + scaleForDisplay(40);
		this.w = albumArtSize.w - scaleForDisplay(80);
		this.h = albumArtSize.h - scaleForDisplay(80);

		this.parseLyrics(lyr);
	}

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
				this.lyrics.forEach((line, i) => { line.timestamp = ratio * i });
				break;
			}
		}
		this.seek();
		this.start();
	}

	parseSyncLyrics(lyr, isNone) {
		const lyrics = [];
		if (isNone) lyrics.push({ timestamp: 0, content: lyr[0] });
		lyr.forEach(line => {
			const content = this.tidy(line);
			const matches = line.match(this.leadingTimestamps);
			if (matches) {
				const all = matches[0].split('][');
				all.forEach(m => {
					lyrics.push({ timestamp: this.getMilliseconds(m), content });
				});
			}
		});
		return lyrics.sort((a, b) => a.timestamp - b.timestamp);
	}

	parseUnsyncedLyrics(lyr, isNone) {
		const lyrics = [];
		if (isNone) lyrics.push({ timestamp: 0, content: lyr[0] });
		lyr.forEach(line => {
			lyrics.push({ timestamp: 0, content: this.tidy(line) });
		});
		return lyrics;
	}

	formatLyrics(lyrics, isSynced) {
		if (lyrics.length && this.w > 10) {
			if (isSynced && lyrics[0].content && lyrics[0].timestamp > this.durationScroll) lyrics.unshift({ timestamp: 0, content: '' });
			gr(1, 1, false, g => {
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
		this.lyrics.forEach((v, i) => {
			const t1 = this.getTimestamp(i - 1);
			const t2 = this.getTimestamp(i);
			const t3 = this.getTimestamp(i + 1);
			if (!v.content && t3 && t2 && t1 && t3 - t2 < incr) v.timestamp = Math.max((t2 - t1) / 2 + t1, t2 - incr);
		});
		this.repaintRect();
	}

	displayLyrics(y, top) {
		return y >= top && y + (pref.lyricsFadeScroll ? this.lineHeight : 0) <= this.h + top;
	}

	drawLyrics(gr) {
		if (!(pref.displayLyrics && this.lyrics.length && this.locus >= 0)) return;

		const top = this.locus * this.lineHeight - this.locusOffset;
		const transition_factor = clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transition_factor_in = !this.lyrics[this.locus].multiLine ? transition_factor : 1;
		const transition_factor_out = clamp(transition_factor_in * 3, 0, 1);
		const alpha = Math.min(255 * transition_factor * 4 / 3, 255);
		const blendIn = this.type.synced ? getBlend(col.lyricsHighlight, col.lyricsNormal, transition_factor_in) : col.lyricsNormal;
		const blendOut = this.type.synced ? getBlend(col.lyricsNormal, col.lyricsHighlight, transition_factor_out) : col.lyricsNormal;
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

		this.lyrics.forEach((lyric, i) => {
			const font = lyric.highlight && pref.lyricsLargerCurrentSync ? ft.lyricsHighlight : ft.lyrics;
			const lyric_y = this.lineHeight * i;
			const line_y = Math.round(y - top + lyric_y - ((this.stringSearching || this.stringNotFound) ? scaleForDisplay(24) : 0));
			const bottomLine = line_y > this.bot + this.lineHeight * (pref.lyricsFadeScroll ? 2 : 3);

			if (!this.displayLyrics(lyric_y, top)) return;

			if (this.shadowEffect && line_y >= this.top && !bottomLine) { // * Do not show drop shadow at top and bottom
				if (this.dropNegativeShadowLevel) {
					gr.DrawString(lyric.content, font, col.lyricsShadow, this.x - this.dropNegativeShadowLevel, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
					gr.DrawString(lyric.content, font, col.lyricsShadow, this.x, line_y - this.dropNegativeShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
				}

				gr.DrawString(lyric.content, font, col.lyricsShadow, this.x + this.dropShadowLevel, line_y + this.dropShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
			}

			color = line_y >= this.top ? lyric.highlight ? blendIn : i === this.locus - 1 ? blendOut : bottomLine ? fadeBot : col.lyricsNormal : fadeTop;
			gr.DrawString(lyric.content, font, color, this.x, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
		});

		if (this.showOffset) {
			gr.DrawString(`Offset: ${this.userOffset / 1000}s`, ft.lyrics, col.lyricsHighlight, this.x, this.y, this.w, this.lineHeight + 1, this.alignRight);
		}
	}

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

	checkScroll() {
		this.scroll = Math.max(0, this.scroll - this.delta);
		if (this.scroll <= 0) {
			this.newHighlighted = false;
		}
		this.repaintRect();
	}

	clear() {
		this.stop();
		this.lyrics = [];
	}

	clearHighlight() {
		this.lyrics.forEach(v => { v.highlight = false });
	}

	getCurPos() {
		return this.lyrics.findIndex(v => v.timestamp >= this.playbackTime());
	}

	getMilliseconds(t) {
		t = t.trim().replace(/[[\]]/, '').split(':');
		return Math.max((t.reduce((acc, time) => (60 * acc) + parseFloat(time))) * 1000, 0);
	}

	getScrollSpeed() {
		let { durationScroll } = this;
		const t1 = this.getTimestamp(this.locus - 1);
		const t2 = this.getTimestamp(this.locus);
		const t3 = this.getTimestamp(this.locus + 1);
		if (t1 && t2 && t2 - t1 > 0) {
			durationScroll = clamp(t2 - t1, this.minDurationScroll, this.durationScroll);
			if (t3 && t3 - t2 > 0 && t3 - t2 < this.durationScroll) durationScroll = clamp(t3 - t2, this.minDurationScroll, this.durationScroll);
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

	getTimestamp(v) {
		return this.lyrics[v] && this.lyrics[v].timestamp;
	}

	playbackTime() {
		const time = isStreaming ? fb.PlaybackTime - txt.reader.trackStartTime : fb.PlaybackTime;
		return Math.round(time * 1000) + this.lyricsOffset + this.transitionOffset + this.userOffset;
	}

	repaintRect() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	scrollUpdateNeeded() {
		return this.lyrics.length > this.locus + 1 && this.playbackTime() > this.lyrics[this.locus + 1].timestamp;
	}

	seek() {
		this.clearHighlight();
		const curPos = this.getCurPos();
		this.locus = curPos < 0 ? this.lyrics.length - 1 : Math.max(0, curPos - 1);
		if (this.locus >= 0) {
			this.setHighlight();
			this.repaintRect();
		}
	}

	setHighlight() {
		const { id } = this.lyrics[this.locus];
		if (this.type.synced) this.lyrics.forEach(v => { if (v.id === id) v.highlight = true; });
	}

	smoothScroll() {
		if (!pref.displayLyrics) return;

		if (this.scrollUpdateNeeded()) {
			this.advanceHighLighted();
		}
		else if (this.newHighlighted) this.checkScroll();
	}

	start() {
		if (this.timer || !fb.IsPlaying || fb.IsPaused) return;
		this.timer = setInterval(() => {
			if (!this.init) this.smoothScroll();
			else this.init = false;
		}, 16);
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	tidy(n) {
		return n.replace(this.timestamps, '$1$4').replace(this.enhancedTimestamps, '$1$4').trim();
	}

	// * CALLBACKS * //

	on_mouse_wheel(step) {
		step *= clamp(Math.round(500 / ((Date.now() - this.stepTime) * 5)), 1, 5);
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

	on_playback_pause(isPaused) {
		if (isPaused) this.stop();
		else this.start();
	}

	on_playback_stop(reason) {
		this.stop();
	}

	on_size(x, y, w, h) {
		this.x = x + scaleForDisplay(40);
		this.y = y + scaleForDisplay(40);
		this.w = w - scaleForDisplay(80);
		this.h = h - scaleForDisplay(80);
		this.repaintRect();
	}
}
