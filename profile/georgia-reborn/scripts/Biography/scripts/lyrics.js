'use strict';

class LyricsBio {
	constructor() {
		this.noLyrics = ['No lyrics found'];
		this.enhancedTimestamps = /(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g;
		this.leadingTimestamps = /^(\s*\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}]))+/;
		this.lyr = [];
		this.lyrics = [];
		this.stepTime = 0;
		this.tfLength = fb.TitleFormat('%length_seconds%');
		this.timestamps = /(\s*)\[(\d{1,2}:|)\d{1,2}:\d{2}(]|\.\d{1,3}])(\s*)/g;
	}

	// Methods

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
		this.lyrics.forEach(v => v.highlight = false);
	}

	display() {
		return this.lyrics.length && this.locus >= 0 && txt.lyricsDisplayed();
	}

	draw(gr) {
		if (!this.display()) return;
		const top = this.locus * this.lineHeight - this.locusOffset;
		const transition_factor = $Bio.clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transition_factor_in = !this.lyrics[this.locus].multiLine ? transition_factor : 1;
		const transition_factor_out = $Bio.clamp(transition_factor_in * 3, 0, 1);
		const alpha = Math.min(255 * transition_factor * 4 / 3, 255);
		const blendIn = this.type.synced ? uiBio.getBlend(uiBio.col.lyricsHighlight, uiBio.col.lyricsNormal, transition_factor_in) : uiBio.col.lyricsNormal;
		const blendOut = this.type.synced ? uiBio.getBlend(uiBio.col.lyricsNormal, uiBio.col.lyricsHighlight, transition_factor_out) : uiBio.col.lyricsNormal;
		const y = this.y + this.scroll;

		let col = uiBio.col.lyricsNormal;

		let fadeBot = !this.shadowEffect ? this.transBot[transition_factor] : col;
		if (!fadeBot) {
			fadeBot = $Bio.RGBtoRGBA(col, alpha);
			this.transBot[transition_factor] = fadeBot;
		}

		let fadeTop = !this.shadowEffect ? this.transTop[transition_factor] : col;
		if (!fadeTop) {
			fadeTop = $Bio.RGBtoRGBA(col, 255 - alpha);
			this.transTop[transition_factor] = fadeTop;
		}

		gr.SetTextRenderingHint(5);

		this.lyrics.forEach((lyric, i) => {
			const lyric_y = this.lineHeight * i;
			const line_y = Math.round(y - top + lyric_y);
			const bottomLine = line_y > this.bot;
			if (this.showlyric(lyric_y, top)) {
				const font = !lyric.highlight ? uiBio.font.lyrics : this.font.lyrics;
				if (this.shadowEffect) {
					if (this.dropNegativeShadowLevel) {
						gr.DrawString(lyric.content, font, uiBio.col.dropShadow, this.x - this.dropNegativeShadowLevel, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
						gr.DrawString(lyric.content, font, uiBio.col.dropShadow, this.x, line_y - this.dropNegativeShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
					}

					gr.DrawString(lyric.content, font, uiBio.col.dropShadow, this.x + this.dropShadowLevel, line_y + this.dropShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
				}
				col = line_y >= this.top ? lyric.highlight ? blendIn : i == this.locus - 1 ? blendOut : bottomLine ? fadeBot : uiBio.col.lyricsNormal : fadeTop;
				gr.DrawString(lyric.content, font, col, this.x, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
			}
		});
		if (this.showOffset) {
			gr.DrawString(`Offset: ${this.userOffset / 1000}s`, uiBio.font.main, uiBio.col.lyricsHighlight, this.x, this.top, this.w, this.lineHeight + 1, this.alignRight);
		}
	}

	format(lyrics, isSynced) {
		if (lyrics.length && this.w > 10) {
			if (isSynced && lyrics[0].content && lyrics[0].timestamp > this.durationScroll) lyrics.unshift({ timestamp: 0, content: '' });
			$Bio.gr(1, 1, false, g => {
				for (let i = 0; i < lyrics.length; i++) {
					const l = g.EstimateLineWrap(lyrics[i].content, this.font.lyrics, this.w - 10);
					if (l[1] > this.maxLyrWidth) this.maxLyrWidth = l[1];
					if (l.length > 2) {
						const numLines = l.length / 2;
						let maxScrollTime = this.durationScroll;
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

	getCurPos() {
		return this.lyrics.findIndex(v => v.timestamp >= this.playbackTime());
	}

	getMilliseconds(t) {
		t = t.trim().replace(/[[\]]/, '').split(':');
		return Math.max((t.reduce((acc, time) => (60 * acc) + parseFloat(time))) * 1000, 0);
	}

	getScrollSpeed() {
		let durationScroll = this.durationScroll;
		const t1 = this.getTimestamp(this.locus - 1);
		const t2 = this.getTimestamp(this.locus);
		const t3 = this.getTimestamp(this.locus + 1);
		if (t1 && t2 && t2 - t1 > 0) {
			durationScroll = $Bio.clamp(t2 - t1, this.minDurationScroll, this.durationScroll);
			if (t3 && t3 - t2 > 0 && t3 - t2 < this.durationScroll) durationScroll = $Bio.clamp(t3 - t2, this.minDurationScroll, this.durationScroll);
		}

		const variSpeed = !pptBio.lyricsScrollMaxMethod ? 10 * 500 : 0;
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

	load(lyr) {
		const newLyrics = !$Bio.equal(lyr, this.lyr);
		if (newLyrics) {
			this.lyr = lyr;
			this.userOffset = 0;
		}
		this.font = {
			lyrics: !pptBio.largerSyncLyricLine ? uiBio.font.lyrics : gdi.Font(uiBio.font.main.Name, uiBio.font.zoomSize * 1.33, uiBio.font.lyrics.Style)
		}
		this.alignCenter = StringFormat(1, 1);
		this.alignRight = StringFormat(2, 1);
		this.init = true;
		this.lineHeight = !pptBio.largerSyncLyricLine ? uiBio.font.lyrics_h + 4 * $Bio.scale : uiBio.font.lyrics_h * 1.33;
		pptBio.lyricsScrollTimeMax = $Bio.clamp(Math.round(pptBio.lyricsScrollTimeMax), 0, 3000);
		pptBio.lyricsScrollTimeAvg = $Bio.clamp(Math.round(pptBio.lyricsScrollTimeAvg), 0, 3000);
		this.durationScroll = pptBio.lyricsScrollMaxMethod ? pptBio.lyricsScrollTimeMax : Math.round(pptBio.lyricsScrollTimeAvg * 2 / 3);
		this.factor = this.durationScroll < 1500 ? 20 : 24;
		this.delta = this.lineHeight * this.factor / this.durationScroll;
		this.locus = -1;
		this.lyrics = [];
		this.lyricsOffset = 0;
		this.maxLyrWidth = 0;
		this.minDurationScroll = Math.min(this.durationScroll, 250);
		this.newHighlighted = false;
		this.scroll = 0;
		this.shadowEffect = pptBio.dropShadowLevel > 0;
		this.dropShadowLevel = pptBio.dropShadowLevel;
		this.dropNegativeShadowLevel = this.dropShadowLevel > 1 ? Math.floor(this.dropShadowLevel / 2) : 0;
		this.showOffsetTimer = null;
		this.timer = null;
		this.trackLength = parseInt(this.tfLength.Eval(true));
		this.transitionOffset = this.durationScroll / 2;
		this.transBot = {};
		this.transTop = {};
		pptBio.lyricsFadeHeight = $Bio.clamp(pptBio.lyricsFadeHeight, -1, 2);
		const fadeHeight = this.lineHeight * pptBio.lyricsFadeHeight;
		this.x = panelBio.text.l;
		this.y = panelBio.text.t - (!this.shadowEffect ? this.lineHeight + fadeHeight : 0);
		this.w = panelBio.text.w;
		this.h = panelBio.lines_drawn * uiBio.font.main_h + (!this.shadowEffect ? this.lineHeight * 2 - fadeHeight * 2 : 0);

		const linesDrawn = Math.floor(this.h / this.lineHeight);
		const oddNumLines = linesDrawn % 2;
		const realHeight = this.lineHeight * linesDrawn;

		this.locusOffset = this.h / 2 - (oddNumLines ? this.lineHeight / 2 : this.lineHeight);
		this.top = this.locusOffset - this.lineHeight * (Math.floor(linesDrawn / 2) - (oddNumLines ? 1 : 2)) + this.y;
		this.bot = this.top + this.lineHeight * (linesDrawn - 3);

		this.type = {
			none: false,
			synced: false,
			unsynced: false
		};

		this.parse(lyr);
	}

	on_mouse_wheel(step) {
		step *= $Bio.clamp(Math.round(1000 / ((Date.now() - this.stepTime) * 5)), 1, 5);
		this.stepTime = Date.now();
		this.userOffset += 1000 * -step;
		if (!this.userOffset) this.repaintRect();
		this.showOffset = this.type.synced && this.userOffset != 0;
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

	parse(lyr) {
		if (!lyr.length) {
			this.type.none = true;
			lyr = this.noLyrics;
		}

		if (!this.type.none) {
			if (lyr.some(line => this.leadingTimestamps.test(line))) this.type.synced = true;
			else this.type.unsynced = true;
		}

		switch (true) {
			case this.type.synced: {
				let lyrOffset = null;
				lyr.some(line => lyrOffset = line.match(/^\s*\[offset\s*:(.*)\]\s*$/));
				if (lyrOffset && lyrOffset.length > 0) this.lyricsOffset = parseInt(lyrOffset[1]);
				if (isNaN(this.lyricsOffset)) this.lyricsOffset = 0;
				this.format(this.parseSyncLyrics(lyr, this.type.none), this.type.synced);
				break;
			}
			case this.type.unsynced: {
				this.format(this.parseUnsyncedLyrics(lyr, this.type.none));
				const ratio = !panelBio.isRadio() ? this.trackLength / this.lyrics.length * 1000 : 2000;
				this.lyrics.forEach((line, i) => line.timestamp = ratio * i);
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

	playbackTime() {
		const time = !panelBio.isRadio() ? fb.PlaybackTime : fb.PlaybackTime - txt.reader.trackStartTime;
		return Math.round(time * 1000) + this.lyricsOffset + this.transitionOffset + this.userOffset;
	}

	repaintRect() {
		window.RepaintRect(this.x + (this.w - this.maxLyrWidth) / 2, this.y, this.maxLyrWidth, this.h + this.lineHeight);
		if (this.showOffset) window.RepaintRect(this.x, this.top, this.w, this.lineHeight + 1);
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
		const id = this.lyrics[this.locus].id;
		if (this.type.synced) this.lyrics.forEach(v => { if (v.id == id) v.highlight = true; });
	}

	showlyric(y, top) {
		return y >= top && y + this.lineHeight * (!this.shadowEffect ? 2 : 1) <= this.h + top;
	}

	smoothScroll() {
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
}
