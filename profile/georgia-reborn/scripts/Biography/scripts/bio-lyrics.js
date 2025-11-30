'use strict';

class BioLyrics {
	constructor() {
		this.noLyrics = ['No lyrics found'];
		this.lyr = [];
		this.lyrics = [];
		this.scrollDrag = false;
		this.scrollDragY = 0;
		this.scrollDragOffset = 0;
		this.stepTime = 0;
		this.tfLength = fb.TitleFormat('%length_seconds%');
	}

	// * METHODS * //

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

	checkBounds(line_y) {
		return {
			aboveTop: (line_y < this.top),
			visibleBounds: (line_y >= this.top) && (line_y <= this.bot),
			outsideVisibleBounds: (line_y < this.top || line_y > this.bot),
			lyricsDrawBounds: (line_y >= this.top - this.lineHeight * 0.5) && (line_y <= this.bot + this.lineHeight)
		};
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
		this.scrollDragOffset = 0;
	}

	clearHighlight() {
		this.lyrics.forEach(v => { v.highlight = false; });
	}

	display() {
		return this.lyrics.length && this.locus >= 0 && bio.txt.lyricsDisplayed();
	}

	draw(gr) {
		if (!(this.lyrics.length && this.locus >= 0 && bio.txt.lyricsDisplayed())) return;

		const top = this.locus * this.lineHeight - this.locusOffset + this.scrollDragOffset;
		const y = this.y + this.scroll;
		gr.SetTextRenderingHint(5);

		this.lyrics.forEach((lyric, i) => {
			const lyric_y = this.lineHeight * i;
			const line_y = Math.round(y - top + lyric_y);
			const bounds = this.checkBounds(line_y);
			if (bounds.lyricsDrawBounds) {
				const font = !lyric.highlight ? bio.ui.font.lyrics : this.font.lyrics;
				this.drawLyric(gr, lyric, font, line_y, bounds);
			}
		});

		this.drawOffset(gr);
	}

	drawLyric(gr, lyric, font, line_y, bounds) {
		const transition_factor = Clamp((this.lineHeight - this.scroll) / this.lineHeight, 0, 1);
		const transition_factor_in = !this.lyrics[this.locus].multiLine ? transition_factor : 1;
		const blendIn = this.type.synced ? GetBlend(bio.ui.col.lyricsHighlight, bio.ui.col.lyricsNormal, transition_factor_in) : bio.ui.col.lyricsNormal;

		if (bounds.visibleBounds) {
			this.drawShadow(gr, lyric.content, font, line_y);
		}

		const fadeFactor = grSet.lyricsFadeScroll &&
			bounds.outsideVisibleBounds	? (bounds.aboveTop ? (this.top - line_y) / this.lineHeight :
			(line_y - this.bot) / this.lineHeight) : 0;

		const color =
			bounds.outsideVisibleBounds	? RGBtoRGBA(bio.ui.col.lyricsNormal, 255 * (1 - Clamp(fadeFactor, 0, 1))) :
			(lyric.highlight ? blendIn : bio.ui.col.lyricsNormal);

		gr.DrawString(lyric.content, font, color, this.x, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
	}

	drawOffset(gr) {
		if (!this.showOffset) return;

		this.offsetW = gr.CalcTextWidth(`Offset: ${this.userOffset / 1000}s`, bio.ui.font.lyrics) + this.lineHeight;
		const offsetTextW = this.x + this.offsetW * 0.5 - this.lineHeight * 0.5;
		const offsetH = this.lineHeight + 1;
		const offsetX = this.x + this.w - this.offsetW * 0.5 + this.arc;
		const offsetY = this.top;

		gr.FillRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, bio.ui.col.popupBg);
		gr.DrawRoundRect(offsetX, offsetY, this.offsetW, offsetH, this.arc, this.arc, 1, 0x64000000);
		gr.DrawString(`Offset: ${this.userOffset / 1000}s`, bio.ui.font.lyrics, bio.ui.col.popupText, offsetTextW, offsetY, this.w, offsetH, this.alignRight);
	}

	drawShadow(gr, text, font, line_y) {
		if (!this.shadowEffect) return;

		if (this.dropNegativeShadowLevel) {
			gr.DrawString(text, font, bio.ui.col.dropShadow, this.x - this.dropNegativeShadowLevel, line_y, this.w + 1, this.lineHeight + 1, this.alignCenter);
			gr.DrawString(text, font, bio.ui.col.dropShadow, this.x, line_y - this.dropNegativeShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
		}

		gr.DrawString(text, font, bio.ui.col.dropShadow, this.x + this.dropShadowLevel, line_y + this.dropShadowLevel, this.w + 1, this.lineHeight + 1, this.alignCenter);
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
						let maxScrollTime = this.durationScroll * 2;
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
		t = t.trim().replace(Regex.PunctBracket, '').split(':');
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

		const variSpeed = !bioSet.lyricsScrollMaxMethod ? 10 * 500 : 0;
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
			lyrics: !bioSet.largerSyncLyricLine ? bio.ui.font.lyrics : gdi.Font(bio.ui.font.main.Name, Math.floor(bio.ui.font.zoomSize * 1.33), bio.ui.font.lyrics.Style)
		}
		this.alignCenter = StringFormat(1, 1);
		this.alignRight = StringFormat(2, 1);
		this.init = true;
		this.lineHeight = !bioSet.largerSyncLyricLine ? bio.ui.font.lyrics_h + 4 * $Bio.scale : Math.floor(bio.ui.font.lyrics_h * 1.33);
		this.arc = SCALE(6);
		bioSet.lyricsScrollTimeMax = $Bio.clamp(Math.round(bioSet.lyricsScrollTimeMax), 0, 3000);
		bioSet.lyricsScrollTimeAvg = $Bio.clamp(Math.round(bioSet.lyricsScrollTimeAvg), 0, 3000);
		this.durationScroll = bioSet.lyricsScrollMaxMethod ? bioSet.lyricsScrollTimeMax : Math.round(bioSet.lyricsScrollTimeAvg * 2 / 3);
		this.factor = this.durationScroll < 1500 ? 20 : 24;
		this.delta = this.lineHeight * this.factor / this.durationScroll;
		this.locus = -1;
		this.lyrics = [];
		this.lyricsOffset = 0;
		this.maxLyrWidth = 0;
		this.minDurationScroll = Math.min(this.durationScroll, 250);
		this.newHighlighted = false;
		this.scroll = 0;
		this.shadowEffect = bioSet.dropShadowLevel > 0;
		this.dropShadowLevel = bioSet.dropShadowLevel;
		this.dropNegativeShadowLevel = this.dropShadowLevel > 1 ? Math.floor(this.dropShadowLevel / 2) : 0;
		this.showOffsetTimer = null;
		this.timer = null;
		this.trackLength = parseInt(this.tfLength.Eval(true));
		this.transitionOffset = this.durationScroll / 2;
		this.transBot = {};
		this.transTop = {};
		bioSet.lyricsFadeHeight = $Bio.clamp(bioSet.lyricsFadeHeight, -1, 2);
		const fadeHeight = this.lineHeight * bioSet.lyricsFadeHeight;
		this.x = bio.panel.text.l;
		this.y = bio.panel.text.t - this.lineHeight + fadeHeight;
		this.w = bio.panel.text.w;
		this.h = bio.panel.lines_drawn * bio.ui.font.main_h + this.lineHeight * 2 - fadeHeight * 2;
		const linesDrawn = Math.floor(this.h / this.lineHeight);
		const oddNumLines = linesDrawn % 2;

		this.locusOffset = this.h / 2 - (oddNumLines ? this.lineHeight / 2 : this.lineHeight);
		this.top = this.locusOffset - this.lineHeight * (Math.floor(linesDrawn / 2) - (oddNumLines ? 1 : 2)) + this.y;
		this.bot = Math.round(this.top + this.lineHeight * (linesDrawn - 3));

		this.type = {
			none: false,
			synced: false,
			unsynced: false
		};

		this.parse(lyr);
	}

	on_mouse_lbtn_down(x, y, m) {
		this.scrollDrag = true;
		this.scrollDragY = y;
	}

	on_mouse_lbtn_up(x, y, m) {
		this.scrollDrag = false;
	}

	on_mouse_leave() {
		this.scrollDrag = false;
	}

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
			if (lyr.some(line => Regex.LyricsTimestampLeading.test(line))) this.type.synced = true;
			else this.type.unsynced = true;
		}

		switch (true) {
			case this.type.synced: {
				let lyrOffset = null;
				lyr.some(line => lyrOffset = line.match(Regex.LyricsOffset));
				if (lyrOffset && lyrOffset.length > 0) this.lyricsOffset = parseInt(lyrOffset[1]);
				if (isNaN(this.lyricsOffset)) this.lyricsOffset = 0;
				this.format(this.parseSyncLyrics(lyr, this.type.none), this.type.synced);
				break;
			}
			case this.type.unsynced: {
				this.format(this.parseUnsyncedLyrics(lyr, this.type.none));
				const ratio = !bio.panel.isRadio() ? this.trackLength / this.lyrics.length * 1000 : 2000;
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
			const matches = line.match(Regex.LyricsTimestampLeading);
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
		if (!grSet.lyricsAutoScrollUnsynced && this.type.unsynced) return 0;
		const time = !bio.panel.isRadio() ? fb.PlaybackTime : fb.PlaybackTime - bio.txt.reader.trackStartTime;
		return Math.round(time * 1000) + this.lyricsOffset + this.transitionOffset + this.userOffset;
	}

	repaintRect() {
		if (!grm.ui.displayBiography) return;
		window.RepaintRect(this.x + (this.w - this.maxLyrWidth) / 2, this.y, this.maxLyrWidth, this.h + this.lineHeight);
		if (this.showOffset) {
			const offsetWidth = (this.lineHeight + this.arc) * 2;
			window.RepaintRect(this.x + this.w - offsetWidth, this.top,	offsetWidth * 2 + this.lineHeight, this.lineHeight + SCALE(6));
		}
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
		return n.replace(Regex.LyricsTimestamp, '$1$4').replace(Regex.LyricsTimestampEnhanced, '$1$4').trim();
	}
}
