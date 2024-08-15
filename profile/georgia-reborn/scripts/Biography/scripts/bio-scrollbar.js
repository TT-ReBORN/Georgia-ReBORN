'use strict';

class BioScrollbar {
	constructor() {
		this.active = true;
		this.alpha = 255;
		this.alpha1 = this.alpha;
		this.alpha2 = 255;
		this.arc = 1;
		this.but_h = 11;
		this.clock = Date.now();
		this.col = {};
		this.count = -1;
		this.cur_active = true;
		this.cur_hover = false;
		this.delta = 0;
		this.drag_distance_per_row = 0;
		this.draw_timer = null;
		this.drawBar = true;
		this.elap = 16;
		this.event = 'scroll';
		this.horizontal = false;
		this.hover = false;
		this.init = true;
		this.inStep = 18;
		this.max_scroll = 0;
		this.onSbar = false;
		this.ratio = 1;
		this.rows_drawn = 0;
		this.scroll = 0;
		this.scrollable_lines = 0;
		this.scrollStep = 3;
		this.start = 0;
		this.timer_but = null;
		this.timestamp;
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;

		this.bar = {
			isDragging: false,
			h: 0,
			timer: null,
			y: 0
		};

		this.initial = {
			drag: {
				y: 0
			},
			scr: 1,
			x: -1,
			y: -1
		};

		this.narrow = {
			show: bioSet.sbarShow == 1,
			x: 0
		};

		this.row = {
			count: 0,
			h: 0
		};

		this.scrollbar = {
			cur_zone: false,
			height: 0,
			travel: 0,
			zone: false
		};

		this.touch = {
			dn: false,
			end: 0,
			start: 0,
			amplitude: 0,
			counter: 0,
			frame: 0,
			lastDn: Date.now(),
			min: 10 * $Bio.scale,
			diff: 2 * $Bio.scale,
			offset: 0,
			reference: -1,
			startTime: 0,
			ticker: null,
			timestamp: 0,
			velocity: 1
		};

		this.duration = {
			drag: 200,
			inertia: bioSet.durationTouchFlick,
			full: bioSet.durationScroll
		};

		this.duration.scroll = Math.round(this.duration.full * 0.8);
		this.duration.step = Math.round(this.duration.full * 2 / 3);
		this.duration.bar = this.duration.full;
		this.duration.barFast = this.duration.step;

		this.pageThrottle = $Bio.throttle(dir => this.checkScroll(Math.round((this.scroll + dir * -this.rows_drawn * this.row.h) / this.row.h) * this.row.h, 'full'), 100);
		this.scrollThrottle = $Bio.throttle(() => {
			this.delta = this.scroll;
			this.scrollTo();
		}, 16);

		this.hideDebounce = $Bio.debounce(() => {
			if (this.scrollbar.zone || this.type == 'film') return;
			this.active = false;
			this.cur_active = this.active;
			this.hover = false;
			this.cur_hover = false;
			this.alpha = this.alpha1;
			this.paint();
		}, 5000);

		this.minimiseDebounce = $Bio.debounce(() => {
			if (this.scrollbar.zone || this.type == 'film') {
				this.paint();
				return;
			}
			this.narrow.show = true;
			if (bioSet.sbarShow == 1) bio.but.setScrollBtnsHide(true, this.type);
			this.scrollbar.cur_zone = this.scrollbar.zone;
			this.hover = false;
			this.cur_hover = false;
			this.alpha = this.alpha1;
			this.paint();
		}, 1000);

		if (this.type != 'film') this.setCol();
	}

	but(dir) {
		this.checkScroll(Math.round((this.scroll + dir * -this.row.h) / this.row.h) * this.row.h, 'step');
		if (!this.timer_but) {
			this.timer_but = setInterval(() => {
				if (this.count > 6) {
					this.checkScroll(this.scroll + dir * -this.row.h, 'step');
				} else this.count++;
			}, 40);
		}
	}

	checkScroll(new_scroll, type) {
		const b = $Bio.clamp(new_scroll, 0, this.max_scroll);
		if (b == this.scroll) return;
		this.scroll = b;
		if (bioSet.smooth) {
			this.event = type || 'scroll';
			this.start = this.delta;
			if (this.event != 'drag') {
				if (this.bar.isDragging && Math.abs(this.delta - this.scroll) > this.scrollbar.height) this.event = 'barFast';
				this.clock = Date.now();
				if (!this.draw_timer) {
					this.scrollTimer();
					this.smoothScroll();
				}
			} else this.scrollDrag();
		} else this.scrollThrottle();
	}

	draw(gr) { // not called by film type
		if (this.drawBar && this.active) {
			let sbar_x = this.x;
			let sbar_w = this.w;
			if (bioSet.sbarShow == 1) {
				sbar_x = !this.narrow.show ? this.x : this.narrow.x;
				sbar_w = !this.narrow.show ? this.w : bio.ui.sbar.type == 1 ? 0 : SCALE(bio.ui.narrowSbarWidth);
			}

			// Non-Reborn/Random theme scrollbar colors
			bio.ui.col.sbarNormalRGBA  = RGBtoRGBA(bio.ui.col.sbarNormal, this.alpha2 + this.alpha);
			bio.ui.col.sbarHoveredRGBA = RGBtoRGBA(bio.ui.col.sbarHovered, this.alpha);
			bio.ui.col.sbarDragRGBA    = RGBtoRGBA(bio.ui.col.sbarDrag, this.alpha2);
			// Reborn/Random theme scrollbar colors - black text color
			bio.ui.col.darkAccentRGBA_75 = RGBtoRGBA(grCol.darkAccent_75, this.alpha - 50);
			bio.ui.col.darkAccentRGBA_50 = this.hover ? RGBtoRGBA(grCol.lightAccent_50, this.alpha) : RGBtoRGBA(grCol.darkAccent_75, this.alpha);
			// Reborn/Random theme scrollbar colors - white text color
			bio.ui.col.lightAccentRGBA_80  = RGBtoRGBA(grCol.lightAccent_80, this.alpha);
			bio.ui.col.lightAccentRGBA_50  = RGBtoRGBA(grCol.lightAccent_50, this.alpha);
			bio.ui.col.lightAccentRGBA2_50 = RGBtoRGBA(grCol.lightAccent_50, this.alpha2);
			// Reborn/Random theme scrollbar colors - for nearly white album art
			bio.ui.col.lightAccentRGBA_100  = RGBA(140, 140, 140, this.alpha2 - this.alpha);
			bio.ui.col.lightAccentRGBA2_100 = RGBA(255, 255, 255, this.alpha);
			bio.ui.col.lightAccentRGBA3_100 = RGBA(255, 255, 255, this.alpha2);

			let thumbColors = [bio.ui.col.sbarNormalRGBA, bio.ui.col.sbarHoveredRGBA, bio.ui.col.sbarDragRGBA];

			if (pl.col.bg !== RGB(255, 255, 255) && !grSet.styleRebornFusion && !grSet.styleRebornFusion2) {
				if ((grSet.theme === 'reborn' || grSet.theme === 'random') && grCol.lightBg) {
					thumbColors = [bio.ui.col.darkAccentRGBA_75, bio.ui.col.darkAccentRGBA_50, bio.ui.col.lightAccentRGBA2_50];
				}
				else if ((grSet.theme === 'reborn' || grSet.theme === 'random') && !grCol.lightBg) {
					thumbColors = [bio.ui.col.lightAccentRGBA_80, bio.ui.col.lightAccentRGBA_50, bio.ui.col.lightAccentRGBA2_50];
				}
				if ((grSet.theme === 'reborn' || grSet.theme === 'random') && (grCol.imgBrightness > 230)) {
					thumbColors = [bio.ui.col.lightAccentRGBA_100, bio.ui.col.lightAccentRGBA2_100, bio.ui.col.lightAccentRGBA3_100];
				}
			}
			// Theme Light scrollbar colors
			if (bioSet.theme == 3) thumbColors = [RGBA(100, 100, 100, this.alpha2 + this.alpha), RGBA(60, 60, 60, this.alpha), RGBA(60, 60, 60, this.alpha2)];

			gr.SetSmoothingMode(this.narrow.show || bioSet.sbarType == 2 || this.arc < 1 ? 3 : 4);
			switch (bio.ui.sbar.type) {
				case 0:
					if (this.arc > 0 && !this.narrow.show) gr.FillRoundRect(sbar_x - 0.5, this.y + this.bar.y, sbar_w, this.bar.h, this.arc, this.arc, this.narrow.show ? this.col[this.alpha2] : !this.bar.isDragging ? this.col[this.alpha] : this.col.max);
					else gr.FillSolidRect(sbar_x + (this.narrow.show ? bio.ui.sbar.narrowWidth + HD_4K(1, -4) : 0), this.y + this.bar.y, sbar_w, this.bar.h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
					break;
				case 1:
					if (this.arc > 0 && !this.narrow.show) gr.FillRoundRect(sbar_x - 0.5, this.y + this.bar.y, sbar_w, this.bar.h, this.arc, this.arc, this.narrow.show ? this.col[this.alpha2] : !this.bar.isDragging ? this.col[this.alpha] : this.col.max);
					else gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
					if (grSet.theme.startsWith('custom')) {
						gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, bio.ui.col.sbarHoveredRGBA);
					}
					break;
				case 2: // windows
					switch (bioSet.sbarType) {
						case 2: // light mode
							bio.ui.theme.SetPartAndStateID(6, 1);
							if (!this.narrow.show || bioSet.sbarShow != 1) bio.ui.theme.DrawThemeBackground(gr, sbar_x, this.y, sbar_w, this.h);
							bio.ui.theme.SetPartAndStateID(3, this.narrow.show ? 2 : !this.hover && !this.bar.isDragging ? 1 : this.hover && !this.bar.isDragging ? 2 : 3);
							bio.ui.theme.DrawThemeBackground(gr, sbar_x, this.y + this.bar.y, sbar_w, this.bar.h);
							break;
						case 3: // dark mode
							if (!this.narrow.show || bioSet.sbarShow != 1) gr.FillSolidRect(sbar_x, this.y - bio.panel.sbar.offset, this.w, this.h + bio.panel.sbar.offset * 2, this.col.bg);
							if (this.arc > 0 && !this.narrow.show) gr.FillRoundRect(sbar_x + (this.narrow.show ?  0 : bio.ui.style.l_w) - 0.5, this.y + this.bar.y, sbar_w - (this.narrow.show ? 0 : bio.ui.style.l_w * 2), this.bar.h, this.arc, this.arc, this.narrow.show ? RGB(77, 77, 77) : !this.bar.isDragging ? this.col[this.alpha] : this.col.max);
							else gr.FillSolidRect(sbar_x + (this.narrow.show ?  0 : bio.ui.style.l_w), this.y + this.bar.y, sbar_w - (this.narrow.show ? 0 : bio.ui.style.l_w * 2), this.bar.h, this.narrow.show ? RGB(77, 77, 77) : !this.bar.isDragging ? this.col[this.alpha] : this.col.max);
							break;
					}
				gr.SetSmoothingMode(0);
			}
		}
	}

	lbtn_dblclk(p_x, p_y) { // not called by film type
		const x = p_x - this.x;
		const y = p_y - this.y;
		let dir;
		if (x < 0 || x > this.w || y < 0 || y > this.h || this.row.count <= this.rows_drawn) return;
		if (y < this.but_h || y > this.h - this.but_h) return;
		if (y < this.bar.y) dir = 1; // above bar
		else if (y > this.bar.y + this.bar.h) dir = -1; // below bar
		if (y < this.bar.y || y > this.bar.y + this.bar.h) this.shiftPage(dir, this.nearest(y));
	}

	lbtn_dn(p_x, p_y) {
		this.onSbar = false;
		if ((!bioSet.sbarShow || bio.panel.trace.film) && bioSet.touchControl) return this.tap(p_x, p_y);
		if (this.type == 'film') return;
		const x = p_x - this.x;
		const y = p_y - this.y;
		let dir;
		if (x > this.w || y < 0 || y > this.h || this.row.count <= this.rows_drawn) return;
		if (x < 0) {
			if (!bioSet.touchControl) return;
			else return this.tap(p_x, p_y);
		}
		this.onSbar = true;
		if (y < this.but_h || y > this.h - this.but_h) return;
		if (y < this.bar.y) dir = 1; // above bar
		else if (y > this.bar.y + this.bar.h) dir = -1; // below bar
		if (y < this.bar.y || y > this.bar.y + this.bar.h) this.shiftPage(dir, this.nearest(y));
		else { // on bar
			this.bar.isDragging = true;
			bio.but.Dn = true;
			this.paint();
			this.initial.drag.y = y - this.bar.y + this.but_h;
		}
	}

	lbtn_drag_up() {
		if (this.touch.dn) {
			this.touch.dn = false;
			clearInterval(this.touch.ticker);
			if (!this.touch.counter) this.track(true);
			if (Math.abs(this.touch.velocity) > this.touch.min && Date.now() - this.touch.startTime < 300) {
				this.touch.amplitude = bioSet.flickDistance * this.touch.velocity * bioSet.touchStep;
				this.touch.timestamp = Date.now();
				this.checkScroll(Math.round((this.scroll + this.touch.amplitude) / this.row.h) * this.row.h, 'inertia');
			}
		}
	}

	lbtn_up() { // not called by film type
		if (bio.panel.clicked) {
			if (bioSet.sbarShow == 1 && this.narrow.show) bio.but.setScrollBtnsHide(true, this.type);
			return;
		}
		if (bio.but.Dn == 'heading') return;
		if (!this.hover && this.bar.isDragging) this.transitionPaint();
		else this.paint();
		if (this.bar.isDragging) {
			this.bar.isDragging = false;
			bio.but.Dn = false;
		}
		this.initial.drag.y = 0;
		if (this.timer_but) {
			clearTimeout(this.timer_but);
			this.timer_but = null;
		}
		this.count = -1;
	}

	leave() {
		if (this.touch.dn) this.touch.dn = false;
		if (!bio.men.right_up) this.scrollbar.zone = false;
		if (this.bar.isDragging || bioSet.sbarShow == 1 || this.type == 'film') return;
		this.hover = !this.hover;
		this.transitionPaint();
		this.hover = false;
		this.cur_hover = false;
	}

	metrics(x, y, w, h, rows_drawn, row_h, horizontal) {
		this.x = x;
		this.y = Math.round(y);
		this.w = w;
		this.h = h;
		this.rows_drawn = rows_drawn;
		this.row.h = row_h;
		this.horizontal = horizontal;
		this.but_h = bio.ui.sbar.but_h;
		this.scrollStep = $Bio.clamp(bioSet.scrollStep, 0, 10);
		if (this.type == 'film' && this.scrollStep != 0) this.scrollStep = Math.max(Math.round(this.scrollStep /= 3), 1);
		// draw info
		this.scrollbar.height = Math.round(this.h - this.but_h * 2);
		this.bar.h = Math.max(Math.round(this.scrollbar.height * this.rows_drawn / this.row.count), $Bio.clamp(this.scrollbar.height / 2, 5, bioSet.sbarShow == 2 ? bioSet.sbarGripHeight : bioSet.sbarGripHeight * 2));
		let min_w = Math.min(this.w, this.bar.h); if (bioSet.sbarType == 3) min_w -= bio.ui.style.l_w * 2;
		this.arc = !bioSet.sbarGripRounded ? 0 : Math.floor(min_w / 2);
		this.scrollbar.travel = this.scrollbar.height - this.bar.h;
		// scrolling info
		this.scrollable_lines = this.rows_drawn > 0 ? this.row.count - this.rows_drawn : 0;
		this.drawBar = this.scrollable_lines > 0 && this.scrollbar.height > 1;
		this.ratio = this.row.count / this.scrollable_lines;
		this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		this.drag_distance_per_row = this.scrollbar.travel / this.scrollable_lines;
		// panel info
		this.narrow.x = this.x + this.w - $Bio.clamp(bio.ui.narrowSbarWidth, 5, this.w) - (bioSet.sbarType > 1 ? 1 : 0);
		this.max_scroll = this.scrollable_lines * this.row.h;
		if (bioSet.sbarShow != 1) bio.but.setScrollBtnsHide();
	}

	move(p_x, p_y) {
		this.active = true;
		const x = p_x - this.x;
		const y = p_y - this.y;
		if (this.type != 'film' && x >= 0 && x <= this.w && y >= 0 && y <= this.h) {
			this.scrollbar.zone = true;
			this.narrow.show = false;
			if (bioSet.sbarShow == 1 && this.scrollbar.zone != this.scrollbar.cur_zone) {
				bio.but.setScrollBtnsHide(!this.scrollbar.zone || this.scrollable_lines < 1 || bioSet.img_only || bio.txt.lyricsDisplayed(), this.type);
				this.scrollbar.cur_zone = this.scrollbar.zone;
			}
			this.paint(); // Needed for mouse_hover scrollbar height, not scrollbar thumb
		} else this.scrollbar.zone = false;
		if (bioSet.sbarShow == 1) {
			this.minimiseDebounce();
			this.hideDebounce();
		}
		if (bioSet.touchControl) {
			const delta = this.touch.reference - (this.horizontal ? p_x : p_y);
			if (delta > this.touch.diff || delta < -this.touch.diff) {
				this.touch.reference = this.horizontal ? p_x : p_y;
				if (bioSet.flickDistance) this.touch.offset = $Bio.clamp(this.touch.offset + delta, 0, this.max_scroll);
				if (this.touch.dn) bio.ui.id.touch_dn = -1;
			}
		}
		if (this.touch.dn) {
			if (bio.but.trace('lookUp', bio.panel.m.x, bio.panel.m.y) || this.type == 'film' && !bio.panel.trace.film || this.type != 'film' && !bio.panel.trace.text) return;
			const now = Date.now();
			if (now - this.touch.startTime > 300) this.touch.startTime = now;
			this.touch.lastDn = now;
			this.checkScroll(this.initial.scr + (this.horizontal ? this.initial.x - p_x : this.initial.y - p_y) * bioSet.touchStep, bioSet.touchStep == 1 ? 'drag' : 'scroll');
			return;
		}
		if (this.type != 'film') {
			this.hover = !(x < 0 || x > this.w || y > this.bar.y + this.bar.h || y < this.bar.y || bio.but.Dn);
			if (!this.bar.timer && (this.hover != this.cur_hover || this.active != this.cur_active)) {
				this.init = false;
				this.transitionPaint();
				this.cur_active = this.active;
			}
		}
		if (!this.bar.isDragging || this.row.count <= this.rows_drawn) return;
		this.checkScroll(Math.round(y - this.initial.drag.y) / this.drag_distance_per_row * this.row.h, 'bar');
	}

	nearest(y) {
		y = (y - this.but_h) / this.scrollbar.height * this.max_scroll;
		y = y / this.row.h;
		return Math.round(y) * this.row.h;
	}

	paint() {
		window.RepaintRect(this.x - SCALE(2), this.y, this.w + SCALE(4), this.h);
	}

	position(Start, End, Elapsed, Duration, Event) {
		if (Elapsed > Duration) return End;
		if (Event == 'drag') return;
		const n = Elapsed / Duration;
		return Start + (End - Start) * bioEase[Event](n);
	}

	reset() {
		this.delta = this.scroll = 0;
		this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row.h, this.horizontal);
	}

	resetAuto() {
		this.minimiseDebounce.cancel();
		this.hideDebounce.cancel();
		if (!bioSet.sbarShow) bio.but.setScrollBtnsHide(true);
		if (bioSet.sbarShow == 1) {
			bio.but.setScrollBtnsHide(true, 'both');
			this.narrow.show = true;
		}
		if (bioSet.sbarShow == 2) this.narrow.show = false;
	}

	scrollDrag() {
		this.delta = this.scroll;
		this.scrollTo();
	}

	scrollFinish() {
		if (!this.draw_timer) return;
		this.delta = this.scroll;
		this.scrollTo();
		bio.txt.logScrollPos();
		bio.filmStrip.logScrollPos();
		clearTimeout(this.draw_timer);
		this.draw_timer = null;
	}

	scrollTimer() {
		this.draw_timer = setInterval(() => {
			if (bio.panel.w < 1 || !window.IsVisible) return;
			this.smoothScroll();
		}, 16);
	}

	scrollTo() {
		this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		this.type != 'film' ? bio.panel.text_paint() : bio.filmStrip.paint();
	}

	scrollToEnd() {
		this.checkScroll(this.max_scroll, 'full');
	}

	setCol() { // not called by film type
		this.alpha =
			bioSet.sbarType == 3 ? 140 :
			!bio.ui.sbar.col ? 75 :
			grSet.theme.startsWith('custom') ? 0 :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? 220 :
			grSet.styleBlackAndWhite ? 175 :
			grSet.styleBlackAndWhite2 ? 152 :
			grSet.styleBlend ? 175 :
			100;
		this.alpha1 = this.alpha;
		this.alpha2 = bioSet.sbarType == 3 ? 255 : !bio.ui.sbar.col ? 128 : 255;
		this.inStep = bio.ui.sbar.type && bio.ui.sbar.col ? 12 : 18;
		switch (bio.ui.sbar.type) {
			case 0:
				switch (bio.ui.sbar.col) {
					case 0:
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, this.alpha + i);
						this.col.max = RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, 192);
						break;
					case 1:
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = bio.ui.col.text & RGBA(255, 255, 255, this.alpha + i);
						this.col.max = bio.ui.col.text & 0x99ffffff;
						break;
				}
				break;
			case 1:
				switch (bio.ui.sbar.col) {
					case 0:
						this.col.bg = RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, 15);
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, this.alpha + i);
						this.col.max = RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, 192);
						break;
					case 1:
						this.col.bg = bio.ui.col.text & 0x15ffffff;
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = bio.ui.col.text & RGBA(255, 255, 255, this.alpha + i);
						this.col.max = bio.ui.col.text & 0x99ffffff;
						break;
				}
				break;
		}

		if (bioSet.sbarType == 3) { // dark mode
			this.col.bg = RGB(23, 23, 23);
			for (let i = 0; i < 116; i++) {
				this.col[this.alpha + i] = RGBA(122, 122, 122, 140 + i);
			}
			this.col.max = RGBA(166, 166, 166, 255);
		}
	}

	setScroll(new_scroll) {
		this.clock = 0;
		const b = Math.max(0, Math.min(new_scroll, this.max_scroll));
		if (b == this.scroll) return;
		this.scroll = b;
		this.delta = this.scroll;
		this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		this.type != 'film' ? bio.panel.text_paint() : bio.filmStrip.paint();
	}

	setRows(row_count) {
		this.row.count = row_count;
		this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row.h, this.horizontal);
	}

	shift(dir, nearest_y) {
		let target = Math.round((this.scroll + dir * -this.rows_drawn * this.row.h) / this.row.h) * this.row.h;
		target = dir == 1 ? Math.max(target, nearest_y) : Math.min(target, nearest_y);
		return target;
	}

	shiftPage(dir, nearest_y) {
		this.checkScroll(this.shift(dir, nearest_y), 'full');
		if (!this.timer_but) {
			this.timer_but = setInterval(() => {
				if (this.count > 1) {
					this.checkScroll(this.shift(dir, nearest_y), 'full');
				} else this.count++;
			}, 100);
		}
	}

	smoothScroll() {
		this.delta = this.position(this.start, this.scroll, Date.now() - this.clock + this.elap, this.duration[this.event], this.event);
		if (Math.abs(this.scroll - this.delta) > 0.5) this.scrollTo();
		else this.scrollFinish();
	}

	tap(p_x, p_y) {
		if (this.type == 'film') {
			if (!bio.panel.trace.film) return;
		} else if (!bio.panel.trace.text) return;
		if (this.touch.amplitude) {
			this.clock = 0;
			this.scroll = this.delta;
		}
		this.touch.counter = 0;
		this.initial.scr = this.scroll;
		this.touch.dn = true;
		if (this.horizontal) {
			this.initial.x = this.touch.reference = p_x;
			if (!this.touch.offset) this.touch.offset = p_x;
		} else {
			this.initial.y = this.touch.reference = p_y;
			if (!this.touch.offset) this.touch.offset = p_y;
		}
		this.touch.velocity = this.touch.amplitude = 0;
		if (!bioSet.flickDistance) return;
		this.touch.frame = this.touch.offset;
		this.touch.startTime = this.touch.timestamp = Date.now();
		clearInterval(this.touch.ticker);
		this.touch.ticker = setInterval(() => this.track, 100);
	}

	track(initial) {
		let elapsed;
		this.touch.counter++;
		const now = Date.now();
		if (now - this.touch.lastDn < 10000 && this.touch.counter == 4) {
			bio.ui.id.touch_dn = -1;
			bio.panel.id.last_pressed_coord = {
				x: -1,
				y: -1
			};
		}
		elapsed = now - this.touch.timestamp;
		if (initial) elapsed = Math.max(elapsed, 32);
		this.touch.timestamp = now;
		const delta = this.touch.offset - this.touch.frame;
		this.touch.frame = this.touch.offset;
		const v = 1000 * delta / (1 + elapsed);
		this.touch.velocity = 0.8 * v + 0.2 * this.touch.velocity;
	}

	transitionPaint() {
		if (this.init) return;
		this.alpha = this.hover ? this.alpha1 : this.alpha2;
		clearTimeout(this.bar.timer);
		this.bar.timer = null;
		this.bar.timer = setInterval(() => {
			this.alpha = this.hover ? Math.min(this.alpha += this.inStep, this.alpha2) : Math.max(this.alpha -= 12, this.alpha1);
			this.paint();
			if (this.hover && this.alpha == this.alpha2 || !this.hover && this.alpha == this.alpha1) {
				this.cur_hover = this.hover;
				clearTimeout(this.bar.timer);
				this.bar.timer = null;
			}
		}, 25);
	}

	wheel(step) {
		this.checkScroll(Math.round((this.scroll + step * -(!this.scrollStep ? this.rows_drawn : this.scrollStep) * this.row.h) / this.row.h) * this.row.h, this.scrollStep ? 'step' : 'full');
	}
}
