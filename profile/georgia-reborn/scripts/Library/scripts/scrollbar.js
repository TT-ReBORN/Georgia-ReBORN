'use strict';

class Scrollbar {
	constructor() {
		this.active = true;
		this.alpha = 255;
		this.alpha1 = this.alpha;
		this.alpha2 = 255;
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
		this.elap = 0;
		this.event = 'scroll';
		this.hover = false;
		this.init = true;
		this.inStep = 18;
		this.max_scroll = 0;
		this.ratio = 1;
		this.rows_drawn = 0;
		this.scroll = 0;
		this.scrollable_lines = 0;
		this.scrollIX = 0;
		this.scrollStep = 3;
		this.start = 0;
		this.timer_but = null;
		this.vertical = true;
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
				x: 0,
				y: 0
			},
			scr: 1,
			x: -1,
			y: -1
		};

		this.narrow = {
			show: ppt.sbarShow == 1,
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
			min: 10 * $Lib.scale,
			diff: 2 * $Lib.scale,
			offset: 0,
			reference: -1,
			startTime: 0,
			ticker: null,
			timestamp: 0,
			velocity: 1
		};

		this.duration = {
			drag: 200,
			inertia: ppt.durationTouchFlick,
			full: ppt.durationScroll
		};

		this.duration.scroll = Math.round(this.duration.full * 0.8);
		this.duration.step = Math.round(this.duration.full * 2 / 3);
		this.duration.bar = this.duration.full;
		this.duration.barFast = this.duration.step;

		this.pageThrottle = $Lib.throttle(dir => this.checkScroll(Math.round((this.scroll + dir * -(this.rows_drawn - 1) * this.row.h) / this.row.h) * this.row.h, 'full'), 100);

		this.scrollThrottle = $Lib.throttle(() => {
			this.delta = this.scroll;
			this.scrollTo();
		}, 16);

		this.hideDebounce = $Lib.debounce(() => {
			if ((ppt.countsRight || ppt.itemShowStatistics) && !panel.imgView && !ppt.facetView && (!ppt.rootNode || pop.inlineRoot)) return;
			if (this.scrollbar.zone) return;
			this.active = false;
			this.cur_active = this.active;
			this.hover = false;
			this.cur_hover = false;
			this.alpha = this.alpha1;
			panel.treePaint();
		}, 5000);

		this.minimiseDebounce = $Lib.debounce(() => {
			if (this.scrollbar.zone) return panel.treePaint();
			this.narrow.show = true;
			if (ppt.sbarShow == 1) but.setScrollBtnsHide(true, true);
			this.scrollbar.cur_zone = this.scrollbar.zone;
			this.hover = false;
			this.cur_hover = false;
			this.alpha = this.alpha1;
			panel.treePaint();
		}, 1000);

		this.updDebounce = $Lib.debounce(() => lib.treeState(false, ppt.rememberTree), 400);

		this.setCol();
	}

	// Methods

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

	calcItem_y() {
		const ix = Math.round(this.delta / this.row.h + 0.4);
		panel.tree.x = Math.round(this.row.h * ix - this.delta);
		panel.tree.y = Math.round(this.row.h * ix + panel.search.h - this.delta);
	}

	checkScroll(new_scroll, type, memory) {
		const b = $Lib.clamp(new_scroll, 0, this.max_scroll);
		if (b == this.scroll) return;
		this.scroll = b;
		if (ppt.smooth && !memory) {
			this.elap = 16;
			this.event = type || 'scroll';
			panel.tree.x = 0;
			panel.tree.y = panel.search.h;
			this.start = this.delta;
			if (this.event != 'drag') {
				if (this.bar.isDragging && Math.abs(this.delta - this.scroll) > (!panel.imgView ? this.scrollbar.height : this.scrollbar.height * 3)) this.event = 'barFast';
				this.clock = Date.now();
				if (!this.draw_timer) {
					this.scrollTimer();
					this.smoothScroll();
				}
			} else this.scrollDrag();
		} else {
			this.scrollThrottle();
			this.updDebounce();
		}
	}

	draw(gr) {
		if (!ppt.sbarShow) return;
		if (this.drawBar && this.active) {
			let sbar_x = this.x;
			let sbar_w = this.w;
			let sbar_y = this.y;
			let sbar_h = this.h;
			if (ppt.sbarShow === 1) {
				sbar_x = !this.narrow.show ? this.x : this.narrow.x;
				sbar_w = !this.narrow.show ? this.w : ui.sbar.narrowWidth;
				sbar_y = !this.narrow.show ? this.y : this.narrow.y;
				sbar_h = !this.narrow.show ? this.h : ui.sbar.narrowWidth;
			}

			// Non-Reborn/Random theme scrollbar colors
			ui.col.sbarNormalRGBA  = RGBtoRGBA(ui.col.sbarNormal, this.alpha2 + this.alpha);
			ui.col.sbarHoveredRGBA = RGBtoRGBA(ui.col.sbarHovered, this.alpha);
			ui.col.sbarDragRGBA    = RGBtoRGBA(ui.col.sbarDrag, this.alpha2);
			// Reborn/Random theme scrollbar colors - black text color
			ui.col.darkAccentRGBA_75   = RGBtoRGBA(col.darkAccent_75, this.alpha - 50);
			ui.col.darkAccentRGBA_50   = this.hover ? RGBtoRGBA(col.lightAccent_50, this.alpha) : RGBtoRGBA(col.darkAccent_75, this.alpha);
			// Reborn/Random theme scrollbar colors - white text color
			ui.col.lightAccentRGBA_80  = RGBtoRGBA(col.lightAccent_80, this.alpha);
			ui.col.lightAccentRGBA_50  = RGBtoRGBA(col.lightAccent_50, this.alpha);
			ui.col.lightAccentRGBA2_50 = RGBtoRGBA(col.lightAccent_50, this.alpha2);
			// Reborn/Random theme scrollbar colors - for nearly white album art
			ui.col.lightAccentRGBA_100  = RGBA(140, 140, 140, this.alpha2 - this.alpha);
			ui.col.lightAccentRGBA2_100 = RGBA(255, 255, 255, this.alpha);
			ui.col.lightAccentRGBA3_100 = RGBA(255, 255, 255, this.alpha2);

			let thumbColors = [ui.col.sbarNormalRGBA, ui.col.sbarHoveredRGBA, ui.col.sbarDragRGBA];

			if (g_pl_colors.bg !== RGB(255, 255, 255)) {
				if ((pref.theme === 'reborn' || pref.theme === 'random') && lightBg) {
					thumbColors = [ui.col.darkAccentRGBA_75, ui.col.darkAccentRGBA_50, ui.col.lightAccentRGBA2_50];
				}
				else if ((pref.theme === 'reborn' || pref.theme === 'random') && !lightBg) {
					thumbColors = [ui.col.lightAccentRGBA_80, ui.col.lightAccentRGBA_50, ui.col.lightAccentRGBA2_50];
				}
				if ((pref.theme === 'reborn' || pref.theme === 'random') && (imgBrightness > 230)) {
					thumbColors = [ui.col.lightAccentRGBA_100, ui.col.lightAccentRGBA2_100, ui.col.lightAccentRGBA3_100];
				}
			}

			switch (ui.sbar.type) {
				case 0:
					if (ppt.rowStripes && ppt.sbarShow == 2 && !this.vertical) gr.FillSolidRect(this.x, this.y, this.w, this.h, ui.col.rowStripes /*ui.col.bg1*/);
					if (this.vertical) {
						gr.FillSolidRect(sbar_x + (this.narrow.show ? ui.sbar.narrowWidth - scaleForDisplay(1) : is_4k ? 0 : -1), this.y + this.bar.y, sbar_w, this.bar.h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
					}
					else {
						gr.FillSolidRect(this.x + this.bar.x, sbar_y + (this.narrow.show ? ui.sbar.narrowWidth - scaleForDisplay(1) : 0), this.bar.h, sbar_h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
						if (!this.narrow.show || ppt.sbarShow != 1) {
							gr.FillSolidRect(this.x + this.bar.x, sbar_y, this.bar.h, sbar_h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
						}
					}
					break;
				case 1:
					if (this.vertical) {
						if (!this.narrow.show || ppt.sbarShow != 1) {
							gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
							if (['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
								gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, ui.col.sbarHoveredRGBA);
							}
						}
					}
					else if (!this.narrow.show || ppt.sbarShow != 1) {
						gr.FillSolidRect(this.x + this.bar.x, sbar_y, this.bar.h, sbar_h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
						if (['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
							gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, ui.col.sbarHoveredRGBA);
						}
					}
					break;
				case 2:
					if (this.vertical) {
						ui.theme.SetPartAndStateID(6, 1);
						gr.FillSolidRect(sbar_x - scaleForDisplay(12), this.y - scaleForDisplay(8), this.w + scaleForDisplay(50), this.h + scaleForDisplay(g_properties.row_h) * 2 - scaleForDisplay(6), ui.col.bg);
						if (!this.narrow.show || ppt.sbarShow != 1) ui.theme.DrawThemeBackground(gr, sbar_x, this.y, sbar_w, this.h);
						ui.theme.SetPartAndStateID(3, this.narrow.show ? 2 : !this.hover && !this.bar.isDragging ? 1 : this.hover && !this.bar.isDragging ? 2 : 3);
						ui.theme.DrawThemeBackground(gr, sbar_x + (this.narrow.show ? ui.sbar.narrowWidth - scaleForDisplay(1) : 0), this.y + this.bar.y, sbar_w, this.bar.h);
						if (pref.styleBlend && albumArt && blendedImg) {
							gr.DrawImage(blendedImg, sbar_x - scaleForDisplay(12), this.y - scaleForDisplay(8), ww, wh, sbar_x - scaleForDisplay(12), this.y - scaleForDisplay(6), blendedImg.Width, blendedImg.Height);
						}
					} else {
						ui.theme.SetPartAndStateID(4, 1);
						if (!this.narrow.show || ppt.sbarShow != 1) ui.theme.DrawThemeBackground(gr, this.x, sbar_y, this.w, sbar_h);
						ui.theme.SetPartAndStateID(2, this.narrow.show ? 2 : !this.hover && !this.bar.isDragging ? 1 : this.hover && !this.bar.isDragging ? 2 : 3);
						ui.theme.DrawThemeBackground(gr, this.x + this.bar.x, sbar_y + (this.narrow.show ? ui.sbar.narrowWidth - scaleForDisplay(1) : 0), this.bar.h, sbar_h);
					}
					break;
			}

			if (!panel.imgView || !img.letter.show || !this.bar.isDragging) return;
			const ix = img.style.vertical ? (Math.ceil((panel.m.y + sbar.delta - img.panel.y) / img.row.h) - 1) * (!ppt.albumArtFlowMode ? img.columns : 1) : Math.ceil((panel.m.x + sbar.delta - img.panel.x) / img.columnWidth) - 1;
			if (ix < 0 || ix > pop.tree.length - 1) return;
			let letter = panel.lines == 1 || !ppt.albumArtFlipLabels ? pop.tree[ix].grp : pop.tree[ix].lot;
			if (panel.colMarker) letter = letter.replace(/@!#.*?@!#/g, '');
			if (img.letter.no != 0) {
				if (img.letter.albumArtYearAuto) {
					let sub = letter.substring(0, 4);
					if (/\d{4}/.test(sub)) letter = sub;
					else {
						sub = letter.substring(0, 6);
						letter = /(\[|\()\d{4}(\]|\))/.test(sub) ? sub : letter.substring(0, img.letter.no);
					}
				} else letter = letter.substring(0, img.letter.no);
			}
			const letter_w = gr.CalcTextWidth(letter, ui.font.main) + img.letter.w;
			const w1 = Math.min(letter_w, ui.w - img.panel.x - img.letter.w);
			const w2 = Math.min(letter_w, ui.w - img.panel.x) + 1;
			if (img.style.vertical) gr.FillSolidRect(ui.x, this.y + this.bar.y + this.bar.h / 2 - img.text.h / 2, w2, img.text.h + 2, ui.col.nowPlayingBg);
			if (img.style.vertical) gr.FillSolidRect(ui.x, this.y + this.bar.y + this.bar.h / 2 - img.text.h / 2, w2, img.text.h + 2, ui.col.nowPlayingBg);
			if (img.style.vertical) gr.GdiDrawText(letter, ui.font.main, ui.col.text_nowp, ui.x + ui.l.w + img.letter.w / 2, this.y + this.bar.y + this.bar.h / 2 - img.text.h / 2, w1, img.text.h, panel.lc);
			else gr.GdiDrawText(letter, ui.font.main, ui.col.text_nowp, ui.x + this.x + this.bar.x + this.bar.h / 2 - w1 / 2, sbar_y - img.text.h, w1, img.text.h, panel.cc);
		}
	}

	lbtn_dblclk(p_x, p_y) {
		const x = p_x - this.x;
		const y = p_y - this.y;
		let dir;
		switch (true) {
			case this.vertical:
				if (x < 0 || x > this.w || y < 0 || y > this.h || this.row.count <= this.rows_drawn) return;
				if (y < this.but_h || y > this.h - this.but_h) return;
				if (y < this.bar.y) dir = 1; // above bar
				else if (y > this.bar.y + this.bar.h) dir = -1; // below bar
				if (y < this.bar.y || y > this.bar.y + this.bar.h) this.shiftPage(dir, this.nearestY(y));
				break;
			case !this.vertical:
				if (y < 0 || y > this.h || x < 0 || x > this.w || this.row.count <= this.rows_drawn) return;
				if (x < this.but_h || x > this.w - this.but_h) return;
				if (x < this.bar.x) dir = 1; // above bar
				else if (x > this.bar.x + this.bar.h) dir = -1; // below bar
				if (x < this.bar.x || x > this.bar.x + this.bar.h) this.shiftPage(dir, this.nearestX(x));
				break;
		}
	}

	lbtn_dn(p_x, p_y) {
		if (!ppt.sbarShow && ppt.touchControl) return this.tap(p_x, p_y);
		const x = p_x - this.x;
		const y = p_y - this.y;
		let dir;
		switch (true) {
			case this.vertical:
				if (x > this.w || y < 0 || y > this.h || this.row.count <= this.rows_drawn) return;
				if (x < 0) {
					if (!ppt.touchControl) return;
					else return this.tap(p_x, p_y);
				}
				if (y < this.but_h || y > this.h - this.but_h) return;
				if (y < this.bar.y) dir = 1; // above bar
				else if (y > this.bar.y + this.bar.h) dir = -1; // below bar
				if (y < this.bar.y || y > this.bar.y + this.bar.h) this.shiftPage(dir, this.nearestY(y));
				else { // on bar
					this.bar.isDragging = true;
					but.Dn = true;
					window.RepaintRect(this.x, this.y, this.w, this.h);
					this.initial.drag.y = y - this.bar.y + this.but_h;
				}
				break;
			case !this.vertical:
				if (y > this.h || x < 0 || x > this.w || this.row.count <= this.rows_drawn) return;
				if (y < 0) {
					if (!ppt.touchControl) return;
					else return this.tap(p_x, p_y);
				}
				if (x < this.but_h || x > this.w - this.but_h) return;
				if (x < this.bar.x) dir = 1; // above bar
				else if (x > this.bar.x + this.bar.h) dir = -1; // below bar
				if (x < this.bar.x || x > this.bar.x + this.bar.h) this.shiftPage(dir, this.nearestX(x));
				else { // on bar
					this.bar.isDragging = true;
					but.Dn = true;
					window.RepaintRect(this.x, this.y, this.w, this.h);
					this.initial.drag.x = x - this.bar.x + this.but_h;
				}
				break;
		}
	}

	lbtn_up() {
		if (this.touch.dn) {
			this.touch.dn = false;
			clearInterval(this.touch.ticker);
			if (!this.touch.counter) this.track(true);
			if (Math.abs(this.touch.velocity) > this.touch.min && Date.now() - this.touch.startTime < 300) {
				this.touch.amplitude = ppt.flickDistance * this.touch.velocity * ppt.touchStep;
				this.touch.timestamp = Date.now();
				this.checkScroll(Math.round((this.scroll + this.touch.amplitude) / this.row.h) * this.row.h, 'inertia');
			}
		}
		if (!this.hover && this.bar.isDragging) this.paint();
		else window.RepaintRect(this.x, this.y, this.w, this.h);
		if (this.bar.isDragging) {
			this.bar.isDragging = false;
			img.loadThrottle();
			but.Dn = false;
		}
		this.initial.drag.x = 0;
		this.initial.drag.y = 0;
		if (this.timer_but) {
			clearTimeout(this.timer_but);
			this.timer_but = null;
		}
		this.count = -1;
	}

	leave() {
		if (this.touch.dn) this.touch.dn = false;
		if (!men.r_up) this.scrollbar.zone = false;
		if (this.bar.isDragging || ppt.sbarShow == 1) return;
		this.hover = !this.hover;
		this.paint();
		this.hover = false;
		this.cur_hover = false;
	}

	logScroll() {
		this.scrollIX = $Lib.clamp(Math.round(sbar.scroll / this.row.h + 0.4), 0, pop.tree.length - 1);
	}

	metrics(x, y, w, h, rows_drawn, row_h, vertical) {
		this.vertical = vertical;
		if (this.vertical) {
			this.x = x;
			this.y = Math.round(y);
			this.w = w;
			this.h = h;
			sbar.w = pref.libraryAutoHideScrollbar && ppt.sbarShow === 1 ? 0 : scaleForDisplay(12);
			ui.sbar.but_w = scaleForDisplay(12);
		} else {
			this.x = scaleForDisplay(40);
			this.y = ui.y + ui.h - scaleForDisplay(32);
			this.w = w - scaleForDisplay(40);
			this.h = h;
			sbar.h = pref.libraryAutoHideScrollbar && ppt.sbarShow === 1 ? 0 : scaleForDisplay(12);
			ui.sbar.but_w = scaleForDisplay(12);
		}
		this.rows_drawn = rows_drawn;
		this.row.h = row_h;
		this.but_h = ui.sbar.but_h;
		this.scrollStep = $Lib.clamp(ppt.scrollStep, 0, 10);
		if (panel.imgView && this.scrollStep != 0) this.scrollStep = Math.max(Math.round(this.scrollStep /= 3), 1);
		// draw info
		this.scrollbar.height = this.vertical ? Math.round(this.h - this.but_h * 2) : Math.round(this.w - this.but_h * 2);
		this.bar.h = Math.max(Math.round(this.scrollbar.height * this.rows_drawn / this.row.count), $Lib.clamp(this.scrollbar.height / 2, 5, ppt.sbarShow == 2 ? ppt.sbarGripHeight : ppt.sbarGripHeight * 2));
		this.scrollbar.travel = this.scrollbar.height - this.bar.h;
		// scrolling info
		this.scrollable_lines = this.rows_drawn > 0 ? this.row.count - this.rows_drawn : 0;
		this.drawBar = this.scrollable_lines > 0 && this.scrollbar.height > 1;
		this.ratio = this.row.count / this.scrollable_lines;
		this.bar.x = this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		this.drag_distance_per_row = this.scrollbar.travel / this.scrollable_lines;
		// panel info
		if (this.vertical) this.narrow.x = pref.layout === 'artwork' ? this.x - 5 : this.x + this.w - $Lib.clamp(ui.sbar.narrowWidth, 5, this.w);
		else this.narrow.y = this.y + this.h - $Lib.clamp(ui.sbar.narrowWidth, 5, this.h);

		// panel.tree.w = ui.w -
		// 	Math.max(ppt.sbarShow && this.scrollable_lines > 0 ? (!ppt.countsRight && !ppt.itemShowStatistics) || ppt.facetView ? ui.sbar.sp + ui.sz.sel :
		// 	ppt.sbarShow == 2 ? ui.sbar.sp + ui.sz.margin :
		// 	ppt.sbarShow == 1 ? (ui.w - this.narrow.x) + ui.sz.marginRight + Math.max(this.w - 11, 0) : ui.sz.sel : ui.sz.sel, ui.sz.margin);
		panel.tree.w = // * Controlling this.countsRight from populate
			ui.w - Math.max(ppt.sbarShow && this.scrollable_lines > 0 ? (!ppt.countsRight && !ppt.itemShowStatistics) || ppt.facetView ? ui.sbar.sp + ui.sz.sel : ui.sz.sel :
			ui.sz.sel, ui.sz.margin);

		pop.id = ui.id.tree + ppt.fullLineSelection + panel.tree.w + panel.imgView + ppt.albumArtLabelType + ppt.albumArtFlipLabels + ppt.albumArtFlowMode;
		panel.tree.stripe.w = ppt.sbarShow == 2 && this.scrollable_lines > 0 ? ui.w - ui.sbar.sp - ui.sz.pad : ui.w;
		panel.tree.sel.w = sbar.w ? ui.w - scaleForDisplay(42) : ui.w; // ppt.sbarShow == 2 && this.scrollable_lines > 0 ? ui.w - ui.sbar.sp - ui.sz.pad * 2 : ui.w - ui.sz.pad * 2;
		this.max_scroll = this.scrollable_lines * this.row.h;
		if (panel.imgView && this.vertical && this.row.h > ui.h - panel.search.h - (ui.style.topBarShow ? 0 : ui.sz.margin)) this.max_scroll -= this.row.h; // if (panel.imgView && this.vertical && this.row.h > ui.h - img.panel.h) this.max_scroll -= this.row.h;
		if (panel.imgView && !this.vertical && this.row.h > ui.w) this.max_scroll -= this.row.h;
		if (ppt.sbarShow != 1) but.setScrollBtnsHide();
	}

	move(p_x, p_y) {
		this.active = true;
		if (p_x > this.x - scaleForDisplay(25) && p_x < this.x + scaleForDisplay(25) && (sbar.vertical ? p_y > this.y : p_y > this.y - scaleForDisplay(20) && p_y < this.y + scaleForDisplay(30))) {
			this.scrollbar.zone = true;
			this.narrow.show = false;
			if (ppt.sbarShow == 1 && this.scrollbar.zone != this.scrollbar.cur_zone) {
				but.setScrollBtnsHide(!this.scrollbar.zone || this.scrollable_lines < 1, true);
				this.scrollbar.cur_zone = this.scrollbar.zone;
			}
			// * Automatic Scrollbar Hide - show
			if (sbar.vertical && this.scrollable_lines > 0) sbar.w = scaleForDisplay(12);
			if (!sbar.vertical && this.scrollable_lines > 0) sbar.h = scaleForDisplay(12);
		}
		else if (ppt.sbarShow === 1 && !this.bar.isDragging) { // * Automatic Scrollbar Hide - hide
			if (pref.libraryAutoHideScrollbar && this.scrollable_lines > 0 && sbar.vertical) sbar.w = 0;
			if (pref.libraryAutoHideScrollbar && this.scrollable_lines > 0 && !sbar.vertical) sbar.h = 0;
			this.resetAuto();
			this.scrollbar.zone = false;
		}
		if (ppt.sbarShow == 1) {
			this.minimiseDebounce();
			this.hideDebounce();
		}
		if (ppt.touchControl) {
			const delta = this.touch.reference - (this.vertical ? p_y : p_x);
			if (delta > this.touch.diff || delta < -this.touch.diff) {
				this.touch.reference = this.vertical ? p_y : p_x;
				if (ppt.flickDistance) this.touch.offset = $Lib.clamp(this.touch.offset + delta, 0, this.max_scroll);
				if (this.touch.dn) {
					ui.id.dragDrop = ui.id.touch_dn = -1;
				}
			}
		}
		if (this.touch.dn && !vk.k('zoom')) {
			const now = Date.now();
			if (now - this.touch.startTime > 300) this.touch.startTime = now;
			this.touch.lastDn = now;
			this.checkScroll(this.initial.scr + (this.vertical ? this.initial.y - p_y : this.initial.x - p_x) * ppt.touchStep, ppt.touchStep == 1 ? 'drag' : 'scroll');
			return;
		}
		const x = p_x - this.x;
		const y = p_y - this.y;
		this.hover = this.vertical ? !(x < 0 || x > this.w || y > this.bar.y + this.bar.h || y < this.bar.y || but.Dn) : !(y < 0 || y > this.h || x > this.bar.x + this.bar.h || x < this.bar.x || but.Dn);
		if (!this.bar.timer && (this.hover != this.cur_hover || this.active != this.cur_active)) {
			this.init = false;
			this.paint();
			this.cur_active = this.active;
		}
		if (!this.bar.isDragging || this.row.count <= this.rows_drawn) return;
		this.checkScroll(Math.round(this.vertical ? y - this.initial.drag.y : x - this.initial.drag.x) / this.drag_distance_per_row * this.row.h, 'bar');
	}

	nearestY(y) {
		y = (y - this.but_h) / this.scrollbar.height * this.max_scroll;
		y = y / this.row.h;
		return Math.round(y) * this.row.h;
	}

	nearestX(x) {
		x = (x - this.but_h) / this.scrollbar.height * this.max_scroll;
		x = x / this.row.h;
		return Math.round(x) * this.row.h;
	}

	paint() {
		if (this.init) return;
		this.alpha = this.hover ? this.alpha1 : this.alpha2;
		clearTimeout(this.bar.timer);
		this.bar.timer = null;
		this.bar.timer = setInterval(() => {
			this.alpha = this.hover ? Math.min(this.alpha += this.inStep, this.alpha2) : Math.max(this.alpha -= 12, this.alpha1);
			window.RepaintRect(this.x - scaleForDisplay(2), this.y, this.w + scaleForDisplay(4), this.h);
			if (this.hover && this.alpha == this.alpha2 || !this.hover && this.alpha == this.alpha1) {
				this.cur_hover = this.hover;
				clearTimeout(this.bar.timer);
				this.bar.timer = null;
			}
		}, 25);
	}

	position(Start, End, Elapsed, Duration, Event) {
		if (Elapsed > Duration) return End;
		if (Event == 'drag') return;
		const n = Elapsed / Duration;
		return Start + (End - Start) * ease[Event](n);
	}

	reset() {
		this.delta = this.scroll = 0;
		this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row.h, this.vertical);
		lib.treeState(false, ppt.rememberTree);
	}

	resetAuto() {
		this.minimiseDebounce.cancel();
		this.hideDebounce.cancel();
		if (!ppt.sbarShow) but.setScrollBtnsHide(true);
		if (ppt.sbarShow == 1) {
			but.setScrollBtnsHide(true, true);
			this.narrow.show = true;
			this.scrollbar.cur_zone = false;
		}
	}

	scrollDrag() {
		this.delta = this.scroll;
		this.scrollTo();
		this.calcItem_y();
		this.updDebounce();
	}

	scrollFinish() {
		if (!this.draw_timer) return;
		this.delta = this.scroll;

		if (this.vertical) this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		else this.bar.x = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		ppt.rememberTree ? lib.treeState(false, ppt.rememberTree) : panel.treePaint();
		this.calcItem_y();
		clearTimeout(this.draw_timer);
		this.draw_timer = null;
	}

	scrollRound() {
		if (this.vertical) {
			if (panel.tree.y == panel.search.h) return;
			this.checkScroll((panel.tree.y < panel.search.h ? Math.floor(this.scroll / this.row.h) : Math.ceil(this.scroll / this.row.h)) * this.row.h);
		} else {
			if (panel.tree.x == 0) return;
			this.checkScroll((panel.tree.x < 0 ? Math.floor(this.scroll / this.row.h) : Math.ceil(this.scroll / this.row.h)) * this.row.h);
		}
	}

	setRows(row_count) {
		if (!row_count) {
			panel.tree.x = 0;
			panel.tree.y = panel.search.h;
		}
		this.row.count = row_count;
		this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row.h, this.vertical);
	}

	scrollMemory(h, j) {
		let scroll = !h ? j * this.row.h : (j - 3) * this.row.h;
		if (panel.imgView && img.style.vertical) {
			scroll /= img.columns;
			scroll = scroll - scroll % this.row.h;
		}
		this.checkScroll(scroll, 'full', true);
	}

	setScroll() {
		const b = $Lib.clamp(this.scrollIX * this.row.h, 0, this.max_scroll);
		if (b == this.scroll) return;
		this.scroll = b;
		panel.tree.x = 0;
		panel.tree.y = panel.search.h;
		this.scrollThrottle();
		this.updDebounce();
	}

	scrollTimer() {
		this.draw_timer = setInterval(() => {
			this.smoothScroll();
		}, 16);
	}

	scrollTo() {
		if (this.vertical) this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		else this.bar.x = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		panel.treePaint();
	}

	scrollToEnd() {
		this.checkScroll(this.max_scroll, 'full');
	}

	setCol() {
		const opaque = ui.getOpaque();
		this.alpha =
			!ui.sbar.col ? 75 :
			['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? 0 :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? 220 :
			pref.styleBlackAndWhite ? 175 :
			pref.styleBlackAndWhite2 ? 152 :
			pref.styleBlend ? 175 :
			100;
		this.alpha1 = this.alpha;
		this.alpha2 = !ui.sbar.col ? 128 : 255
		this.inStep = ui.sbar.type && ui.sbar.col ? 12 : 18;
		switch (ui.sbar.type) {
			case 0:
				switch (ui.sbar.col) {
					case 0:
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, this.alpha + i), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, 192), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, 192);
						break;
					case 1:
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(ui.col.text & RGBA(255, 255, 255, this.alpha + i), ui.col.bg) : ui.col.text & RGBA(255, 255, 255, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(ui.col.text & 0x99ffffff, ui.col.bg) : ui.col.text & 0x99ffffff;
						break;
				}
				break;
			case 1:
				switch (ui.sbar.col) {
					case 0:
						this.col.bg = opaque ? $Lib.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, 15), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, 15);
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, this.alpha + i), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, 192), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, 192);
						break;
					case 1:
						this.col.bg = opaque ? $Lib.RGBAtoRGB(ui.col.text & 0x15ffffff, ui.col.bg) : ui.col.text & 0x15ffffff;
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(ui.col.text & RGBA(255, 255, 255, this.alpha + i), ui.col.bg) : ui.col.text & RGBA(255, 255, 255, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(ui.col.text & 0x99ffffff, ui.col.bg) : ui.col.text & 0x99ffffff;
						break;
				}
				break;
		}
	}

	shift(dir, nearest_y) {
		let target = Math.round((this.scroll + dir * -(((this.rows_drawn - 1) || 1) * this.row.h)) / this.row.h) * this.row.h;
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
		if (this.touch.amplitude) {
			this.clock = 0;
			// this.scroll = this.delta; // stopping correct scroll on expanding bottom node after touch event
		}
		this.touch.counter = 0;
		this.initial.scr = this.scroll;
		this.touch.dn = true;
		if (this.vertical) {
			this.initial.y = this.touch.reference = p_y;
			if (!this.touch.offset) this.touch.offset = p_y;
		} else {
			this.initial.x = this.touch.reference = p_x;
			if (!this.touch.offset) this.touch.offset = p_x;
		}
		this.touch.velocity = this.touch.amplitude = 0;
		if (!ppt.flickDistance) return;
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
			ui.id.touch_dn = -1;
			panel.last_pressed_coord = {
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

	wheel(step) {
		this.checkScroll(Math.round((this.scroll + step * -(!this.scrollStep ? this.rows_drawn - 1 : this.scrollStep) * this.row.h) / this.row.h) * this.row.h, this.scrollStep ? 'step' : 'full');
	}
}
