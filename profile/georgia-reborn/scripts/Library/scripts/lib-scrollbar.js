'use strict';

class LibScrollbar {
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
			show: libSet.sbarShow == 1,
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
			inertia: libSet.durationTouchFlick,
			full: libSet.durationScroll
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
			if ((libSet.countsRight || libSet.itemShowStatistics) && !lib.panel.imgView && !libSet.facetView && (!libSet.rootNode || lib.pop.inlineRoot)) return;
			if (this.scrollbar.zone) return;
			this.active = false;
			this.cur_active = this.active;
			this.hover = false;
			this.cur_hover = false;
			this.alpha = this.alpha1;
			lib.panel.treePaint();
		}, 5000);

		this.minimiseDebounce = $Lib.debounce(() => {
			if (this.scrollbar.zone) return lib.panel.treePaint();
			this.narrow.show = true;
			if (libSet.sbarShow == 1) lib.but.setScrollBtnsHide(true, true);
			this.scrollbar.cur_zone = this.scrollbar.zone;
			this.hover = false;
			this.cur_hover = false;
			this.alpha = this.alpha1;
			lib.panel.treePaint();
		}, 1000);

		this.updDebounce = $Lib.debounce(() => lib.lib.treeState(false, libSet.rememberTree), 400);

		this.setCol();
	}

	// * METHODS * //

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
		lib.panel.tree.x = Math.round(this.row.h * ix - this.delta);
		lib.panel.tree.y = Math.round(this.row.h * ix + lib.panel.search.h - this.delta);
	}

	checkScroll(new_scroll, type, memory) {
		const b = $Lib.clamp(new_scroll, 0, this.max_scroll);
		if (b == this.scroll) return;
		this.scroll = b;
		if (libSet.smooth && !memory) {
			this.elap = 16;
			this.event = type || 'scroll';
			lib.panel.tree.x = 0;
			lib.panel.tree.y = lib.panel.search.h;
			this.start = this.delta;
			if (this.event != 'drag') {
				if (this.bar.isDragging && Math.abs(this.delta - this.scroll) > (!lib.panel.imgView ? this.scrollbar.height : this.scrollbar.height * 3)) this.event = 'barFast';
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
		if (!libSet.sbarShow) return;
		if (this.drawBar && this.active) {
			let sbar_x = this.x;
			let sbar_w = this.w;
			let sbar_y = this.y;
			let sbar_h = this.h;
			if (libSet.sbarShow === 1) {
				sbar_x = !this.narrow.show ? this.x : this.narrow.x;
				sbar_w = !this.narrow.show ? this.w : SCALE(lib.ui.sbar.narrowWidth);
				sbar_y = !this.narrow.show ? this.y : this.narrow.y;
				sbar_h = !this.narrow.show ? this.h : SCALE(lib.ui.sbar.narrowWidth);
			}

			// Non-Reborn/Random theme scrollbar colors
			lib.ui.col.sbarNormalRGBA  = RGBtoRGBA(lib.ui.col.sbarNormal, this.alpha2 + this.alpha);
			lib.ui.col.sbarHoveredRGBA = RGBtoRGBA(lib.ui.col.sbarHovered, this.alpha);
			lib.ui.col.sbarDragRGBA    = RGBtoRGBA(lib.ui.col.sbarDrag, this.alpha2);
			// Reborn/Random theme scrollbar colors - black text color
			lib.ui.col.darkAccentRGBA_75   = RGBtoRGBA(grCol.darkAccent_75, this.alpha - 50);
			lib.ui.col.darkAccentRGBA_50   = this.hover ? RGBtoRGBA(grCol.lightAccent_50, this.alpha) : RGBtoRGBA(grCol.darkAccent_75, this.alpha);
			// Reborn/Random theme scrollbar colors - white text color
			lib.ui.col.lightAccentRGBA_80  = RGBtoRGBA(grCol.lightAccent_80, this.alpha);
			lib.ui.col.lightAccentRGBA_50  = RGBtoRGBA(grCol.lightAccent_50, this.alpha);
			lib.ui.col.lightAccentRGBA2_50 = RGBtoRGBA(grCol.lightAccent_50, this.alpha2);
			// Reborn/Random theme scrollbar colors - for nearly white album art
			lib.ui.col.lightAccentRGBA_100  = RGBA(140, 140, 140, this.alpha2 - this.alpha);
			lib.ui.col.lightAccentRGBA2_100 = RGBA(255, 255, 255, this.alpha);
			lib.ui.col.lightAccentRGBA3_100 = RGBA(255, 255, 255, this.alpha2);

			let thumbColors = [lib.ui.col.sbarNormalRGBA, lib.ui.col.sbarHoveredRGBA, lib.ui.col.sbarDragRGBA];

			if (pl.col.bg !== RGB(255, 255, 255) && !grSet.styleRebornFusion && !grSet.styleRebornFusion2) {
				if (['reborn', 'random'].includes(grSet.theme) && grCol.lightBg) {
					thumbColors = [lib.ui.col.darkAccentRGBA_75, lib.ui.col.darkAccentRGBA_50, lib.ui.col.lightAccentRGBA2_50];
				}
				else if (['reborn', 'random'].includes(grSet.theme) && !grCol.lightBg) {
					thumbColors = [lib.ui.col.lightAccentRGBA_80, lib.ui.col.lightAccentRGBA_50, lib.ui.col.lightAccentRGBA2_50];
				}
				if (['reborn', 'random'].includes(grSet.theme) && (grCol.imgBrightness > 230)) {
					thumbColors = [lib.ui.col.lightAccentRGBA_100, lib.ui.col.lightAccentRGBA2_100, lib.ui.col.lightAccentRGBA3_100];
				}
			}

			switch (lib.ui.sbar.type) {
				case 0:
					if (libSet.rowStripes && libSet.sbarShow == 2 && !this.vertical) gr.FillSolidRect(this.x, this.y, this.w, this.h, lib.ui.col.rowStripes /*ui.col.bg1*/);
					if (this.vertical) {
						gr.FillSolidRect(sbar_x + (this.narrow.show ? lib.ui.sbar.narrowWidth - SCALE(1) : HD_4K(-1, 0)), this.y + this.bar.y, sbar_w, this.bar.h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
					}
					else {
						gr.FillSolidRect(this.x + this.bar.x, sbar_y + (this.narrow.show ? lib.ui.sbar.narrowWidth - SCALE(1) : 0), this.bar.h, sbar_h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
						if (!this.narrow.show || libSet.sbarShow != 1) {
							gr.FillSolidRect(this.x + this.bar.x, sbar_y, this.bar.h, sbar_h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
						}
					}
					break;
				case 1:
					if (this.vertical) {
						if (!this.narrow.show || libSet.sbarShow != 1) {
							gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
							if (grSet.theme.startsWith('custom')) {
								gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, lib.ui.col.sbarHoveredRGBA);
							}
						}
					}
					else if (!this.narrow.show || libSet.sbarShow != 1) {
						gr.FillSolidRect(this.x + this.bar.x, sbar_y, this.bar.h, sbar_h, this.bar.isDragging ? thumbColors[2] : this.hover ? thumbColors[1] : thumbColors[0]);
						if (grSet.theme.startsWith('custom')) {
							gr.FillSolidRect(sbar_x, this.y + this.bar.y, sbar_w, this.bar.h, lib.ui.col.sbarHoveredRGBA);
						}
					}
					break;
				case 2:
					if (this.vertical) {
						lib.ui.theme.SetPartAndStateID(6, 1);
						gr.FillSolidRect(sbar_x - SCALE(12), this.y - SCALE(8), this.w + SCALE(50), this.h + SCALE(plSet.row_h) * 2 - SCALE(6), lib.ui.col.bg);
						if (!this.narrow.show || libSet.sbarShow != 1) lib.ui.theme.DrawThemeBackground(gr, sbar_x, this.y, sbar_w, this.h);
						lib.ui.theme.SetPartAndStateID(3, this.narrow.show ? 2 : !this.hover && !this.bar.isDragging ? 1 : this.hover && !this.bar.isDragging ? 2 : 3);
						lib.ui.theme.DrawThemeBackground(gr, sbar_x + (this.narrow.show ? lib.ui.sbar.narrowWidth - SCALE(1) : 0), this.y + this.bar.y, sbar_w, this.bar.h);
						if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) {
							gr.DrawImage(grCol.imgBlended, sbar_x - SCALE(12), this.y - SCALE(8), grm.ui.ww, grm.ui.wh, sbar_x - SCALE(12), this.y - SCALE(6), grCol.imgBlended.Width, grCol.imgBlended.Height);
						}
					} else {
						lib.ui.theme.SetPartAndStateID(4, 1);
						if (!this.narrow.show || libSet.sbarShow != 1) lib.ui.theme.DrawThemeBackground(gr, this.x, sbar_y, this.w, sbar_h);
						lib.ui.theme.SetPartAndStateID(2, this.narrow.show ? 2 : !this.hover && !this.bar.isDragging ? 1 : this.hover && !this.bar.isDragging ? 2 : 3);
						lib.ui.theme.DrawThemeBackground(gr, this.x + this.bar.x, sbar_y + (this.narrow.show ? lib.ui.sbar.narrowWidth - SCALE(1) : 0), this.bar.h, sbar_h);
					}
					break;
			}

			if (!lib.panel.imgView || !libImg.letter.show || !this.bar.isDragging) return;
			const ix = libImg.style.vertical ? (Math.ceil((lib.panel.m.y + lib.sbar.delta - libImg.panel.y) / libImg.row.h) - 1) * (!libSet.albumArtFlowMode ? libImg.columns : 1) : Math.ceil((lib.panel.m.x + lib.sbar.delta - libImg.panel.x) / libImg.columnWidth) - 1;
			if (ix < 0 || ix > lib.pop.tree.length - 1) return;
			let letter = lib.panel.lines == 1 || !libSet.albumArtFlipLabels ? lib.pop.tree[ix].grp : lib.pop.tree[ix].lot;
			if (lib.panel.colMarker) letter = letter.replace(/@!#.*?@!#/g, '');
			if (libImg.letter.no != 0) {
				if (libImg.letter.albumArtYearAuto) {
					let sub = letter.substring(0, 4);
					if (/\d{4}/.test(sub)) letter = sub;
					else {
						sub = letter.substring(0, 6);
						letter = /(\[|\()\d{4}(\]|\))/.test(sub) ? sub : letter.substring(0, libImg.letter.no);
					}
				} else letter = letter.substring(0, libImg.letter.no);
			}
			const letter_w = gr.CalcTextWidth(letter, lib.ui.font.main) + libImg.letter.w;
			const w1 = Math.min(letter_w, lib.ui.w - libImg.panel.x - libImg.letter.w);
			const w2 = Math.min(letter_w, lib.ui.w - libImg.panel.x) + 1;
			if (libImg.style.vertical) gr.FillSolidRect(lib.ui.x, this.y + this.bar.y + this.bar.h / 2 - libImg.text.h / 2, w2, libImg.text.h + 2, lib.ui.col.nowPlayingBg);
			if (libImg.style.vertical) gr.FillSolidRect(lib.ui.x, this.y + this.bar.y + this.bar.h / 2 - libImg.text.h / 2, w2, libImg.text.h + 2, lib.ui.col.nowPlayingBg);
			if (libImg.style.vertical) gr.GdiDrawText(letter, lib.ui.font.main, lib.ui.col.text_nowp, lib.ui.x + lib.ui.l.w + libImg.letter.w / 2, this.y + this.bar.y + this.bar.h / 2 - libImg.text.h / 2, w1, libImg.text.h, lib.panel.lc);
			else gr.GdiDrawText(letter, lib.ui.font.main, lib.ui.col.text_nowp, lib.ui.x + this.x + this.bar.x + this.bar.h / 2 - w1 / 2, sbar_y - libImg.text.h, w1, libImg.text.h, lib.panel.cc);
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
		if (!libSet.sbarShow && libSet.touchControl) return this.tap(p_x, p_y);
		const x = p_x - this.x;
		const y = p_y - this.y;
		let dir;
		switch (true) {
			case this.vertical:
				if (x > this.w || y < 0 || y > this.h || this.row.count <= this.rows_drawn) return;
				if (x < 0) {
					if (!libSet.touchControl) return;
					else return this.tap(p_x, p_y);
				}
				if (y < this.but_h || y > this.h - this.but_h) return;
				if (y < this.bar.y) dir = 1; // above bar
				else if (y > this.bar.y + this.bar.h) dir = -1; // below bar
				if (y < this.bar.y || y > this.bar.y + this.bar.h) this.shiftPage(dir, this.nearestY(y));
				else { // on bar
					this.bar.isDragging = true;
					lib.but.Dn = true;
					window.RepaintRect(this.x, this.y, this.w, this.h);
					this.initial.drag.y = y - this.bar.y + this.but_h;
				}
				break;
			case !this.vertical:
				if (y > this.h || x < 0 || x > this.w || this.row.count <= this.rows_drawn) return;
				if (y < 0) {
					if (!libSet.touchControl) return;
					else return this.tap(p_x, p_y);
				}
				if (x < this.but_h || x > this.w - this.but_h) return;
				if (x < this.bar.x) dir = 1; // above bar
				else if (x > this.bar.x + this.bar.h) dir = -1; // below bar
				if (x < this.bar.x || x > this.bar.x + this.bar.h) this.shiftPage(dir, this.nearestX(x));
				else { // on bar
					this.bar.isDragging = true;
					lib.but.Dn = true;
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
				this.touch.amplitude = libSet.flickDistance * this.touch.velocity * libSet.touchStep;
				this.touch.timestamp = Date.now();
				this.checkScroll(Math.round((this.scroll + this.touch.amplitude) / this.row.h) * this.row.h, 'inertia');
			}
		}
		if (!this.hover && this.bar.isDragging) this.paint();
		else window.RepaintRect(this.x, this.y, this.w, this.h);
		if (this.bar.isDragging) {
			this.bar.isDragging = false;
			libImg.loadThrottle();
			lib.but.Dn = false;
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
		if (!lib.men.r_up) this.scrollbar.zone = false;
		if (this.bar.isDragging || libSet.sbarShow == 1) return;
		this.hover = !this.hover;
		this.paint();
		this.hover = false;
		this.cur_hover = false;
	}

	logScroll() {
		this.scrollIX = $Lib.clamp(Math.round(lib.sbar.scroll / this.row.h + 0.4), 0, lib.pop.tree.length - 1);
	}

	metrics(x, y, w, h, rows_drawn, row_h, vertical) {
		this.vertical = vertical;
		if (this.vertical) {
			this.x = x;
			this.y = Math.round(y);
			this.w = w;
			this.h = h;
			lib.sbar.w = grSet.libraryAutoHideScrollbar && libSet.sbarShow === 1 ? 0 : SCALE(12);
			lib.ui.sbar.but_w = SCALE(12);
		} else {
			this.x = SCALE(40);
			this.y = lib.ui.y + lib.ui.h - SCALE(32);
			this.w = w - SCALE(40);
			this.h = h;
			lib.sbar.h = grSet.libraryAutoHideScrollbar && libSet.sbarShow === 1 ? 0 : SCALE(12);
			lib.ui.sbar.but_w = SCALE(12);
		}
		this.rows_drawn = rows_drawn;
		this.row.h = row_h;
		this.but_h = lib.ui.sbar.but_h;
		this.scrollStep = $Lib.clamp(libSet.scrollStep, 0, 10);
		if (lib.panel.imgView && this.scrollStep != 0) this.scrollStep = Math.max(Math.round(this.scrollStep /= 3), 1);
		// draw info
		this.scrollbar.height = this.vertical ? Math.round(this.h - this.but_h * 2) : Math.round(this.w - this.but_h * 2);
		this.bar.h = Math.max(Math.round(this.scrollbar.height * this.rows_drawn / this.row.count), $Lib.clamp(this.scrollbar.height / 2, 5, libSet.sbarShow == 2 ? libSet.sbarGripHeight : libSet.sbarGripHeight * 2));
		this.scrollbar.travel = this.scrollbar.height - this.bar.h;
		// scrolling info
		this.scrollable_lines = this.rows_drawn > 0 ? this.row.count - this.rows_drawn : 0;
		this.drawBar = this.scrollable_lines > 0 && this.scrollbar.height > 1;
		this.ratio = this.row.count / this.scrollable_lines;
		this.bar.x = this.bar.y = this.but_h + this.scrollbar.travel * (this.delta * this.ratio) / (this.row.count * this.row.h);
		this.drag_distance_per_row = this.scrollbar.travel / this.scrollable_lines;
		// panel info
		if (this.vertical) this.narrow.x = grSet.layout === 'artwork' ? this.x - 5 : this.x + this.w - $Lib.clamp(lib.ui.sbar.narrowWidth, 5, this.w);
		else this.narrow.y = this.y + this.h - $Lib.clamp(lib.ui.sbar.narrowWidth, 5, this.h);

		// lib.panel.tree.w = lib.ui.w -
		// 	Math.max(libSet.sbarShow && this.scrollable_lines > 0 ? (!libSet.countsRight && !libSet.itemShowStatistics) || libSet.facetView ? lib.ui.sbar.sp + lib.ui.sz.sel :
		// 	libSet.sbarShow == 2 ? lib.ui.sbar.sp + lib.ui.sz.margin :
		// 	libSet.sbarShow == 1 ? (lib.ui.w - this.narrow.x) + lib.ui.sz.marginRight + Math.max(this.w - 11, 0) : lib.ui.sz.sel : lib.ui.sz.sel, lib.ui.sz.margin);
		lib.panel.tree.w = // * Controlling this.countsRight from populate
			lib.ui.w - Math.max(libSet.sbarShow && this.scrollable_lines > 0 ? (!libSet.countsRight && !libSet.itemShowStatistics) || libSet.facetView ? lib.ui.sbar.sp + lib.ui.sz.sel : lib.ui.sz.sel :
			lib.ui.sz.sel, lib.ui.sz.margin);

		lib.pop.id = lib.ui.id.tree + libSet.fullLineSelection + lib.panel.tree.w + lib.panel.imgView + libSet.albumArtLabelType + libSet.albumArtFlipLabels + libSet.albumArtFlowMode;
		lib.panel.tree.stripe.w = libSet.sbarShow == 2 && this.scrollable_lines > 0 ? lib.ui.w - lib.ui.sbar.sp - lib.ui.sz.pad : lib.ui.w;
		lib.panel.tree.sel.w = lib.sbar.w ? lib.ui.w - SCALE(42) : lib.ui.w; // libSet.sbarShow == 2 && this.scrollable_lines > 0 ? lib.ui.w - lib.ui.sbar.sp - lib.ui.sz.pad * 2 : lib.ui.w - lib.ui.sz.pad * 2;
		this.max_scroll = this.scrollable_lines * this.row.h;
		if (lib.panel.imgView && this.vertical && this.row.h > lib.ui.h - lib.panel.search.h - (lib.ui.style.topBarShow ? 0 : lib.ui.sz.margin)) this.max_scroll -= this.row.h; // if (lib.panel.imgView && this.vertical && this.row.h > lib.ui.h - img.panel.h) this.max_scroll -= this.row.h;
		if (lib.panel.imgView && !this.vertical && this.row.h > lib.ui.w) this.max_scroll -= this.row.h;
		if (libSet.sbarShow != 1) lib.but.setScrollBtnsHide();
	}

	move(p_x, p_y) {
		this.active = true;
		const verticalSbarBounds = lib.sbar.vertical && (p_x > this.x - SCALE(25) && p_x < this.x + SCALE(25) && p_y > this.y);
		const horizontalSbarBounds = !lib.sbar.vertical && (p_y > this.y - SCALE(20) && p_y < this.y + SCALE(30) && p_x > this.x && p_x < this.x + this.w);

		if (verticalSbarBounds || horizontalSbarBounds) {
			this.scrollbar.zone = true;
			this.narrow.show = false;
			if (libSet.sbarShow == 1 && this.scrollbar.zone != this.scrollbar.cur_zone) {
				lib.but.setScrollBtnsHide(!this.scrollbar.zone || this.scrollable_lines < 1, true);
				this.scrollbar.cur_zone = this.scrollbar.zone;
			}
			// * Automatic Scrollbar Hide - show
			if (lib.sbar.vertical && this.scrollable_lines > 0) lib.sbar.w = SCALE(12);
			if (!lib.sbar.vertical && this.scrollable_lines > 0) lib.sbar.h = SCALE(12);
		}
		else if (libSet.sbarShow === 1 && !this.bar.isDragging) { // * Automatic Scrollbar Hide - hide
			if (grSet.libraryAutoHideScrollbar && this.scrollable_lines > 0 && lib.sbar.vertical) lib.sbar.w = 0;
			if (grSet.libraryAutoHideScrollbar && this.scrollable_lines > 0 && !lib.sbar.vertical) lib.sbar.h = 0;
			this.resetAuto();
			this.scrollbar.zone = false;
		}
		if (libSet.sbarShow == 1) {
			this.minimiseDebounce();
			this.hideDebounce();
		}
		if (libSet.touchControl) {
			const delta = this.touch.reference - (this.vertical ? p_y : p_x);
			if (delta > this.touch.diff || delta < -this.touch.diff) {
				this.touch.reference = this.vertical ? p_y : p_x;
				if (libSet.flickDistance) this.touch.offset = $Lib.clamp(this.touch.offset + delta, 0, this.max_scroll);
				if (this.touch.dn) {
					lib.ui.id.dragDrop = lib.ui.id.touch_dn = -1;
				}
			}
		}
		if (this.touch.dn && !lib.vk.k('zoom')) {
			const now = Date.now();
			if (now - this.touch.startTime > 300) this.touch.startTime = now;
			this.touch.lastDn = now;
			this.checkScroll(this.initial.scr + (this.vertical ? this.initial.y - p_y : this.initial.x - p_x) * libSet.touchStep, libSet.touchStep == 1 ? 'drag' : 'scroll');
			return;
		}
		const x = p_x - this.x;
		const y = p_y - this.y;
		this.hover = this.vertical ? !(x < 0 || x > this.w || y > this.bar.y + this.bar.h || y < this.bar.y || lib.but.Dn) : !(y < 0 || y > this.h || x > this.bar.x + this.bar.h || x < this.bar.x || lib.but.Dn);
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
			window.RepaintRect(this.x - SCALE(2), this.y, this.w + SCALE(4), this.h);
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
		return Start + (End - Start) * libEase[Event](n);
	}

	reset() {
		this.delta = this.scroll = 0;
		this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row.h, this.vertical);
		lib.lib.treeState(false, libSet.rememberTree);
	}

	resetAuto() {
		this.minimiseDebounce.cancel();
		this.hideDebounce.cancel();
		if (!libSet.sbarShow) lib.but.setScrollBtnsHide(true);
		if (libSet.sbarShow == 1) {
			lib.but.setScrollBtnsHide(true, true);
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
		libSet.rememberTree ? lib.lib.treeState(false, libSet.rememberTree) : lib.panel.treePaint();
		this.calcItem_y();
		clearTimeout(this.draw_timer);
		this.draw_timer = null;
	}

	scrollRound() {
		if (this.vertical) {
			if (lib.panel.tree.y == lib.panel.search.h) return;
			this.checkScroll((lib.panel.tree.y < lib.panel.search.h ? Math.floor(this.scroll / this.row.h) : Math.ceil(this.scroll / this.row.h)) * this.row.h);
		} else {
			if (lib.panel.tree.x == 0) return;
			this.checkScroll((lib.panel.tree.x < 0 ? Math.floor(this.scroll / this.row.h) : Math.ceil(this.scroll / this.row.h)) * this.row.h);
		}
	}

	setRows(row_count) {
		if (!row_count) {
			lib.panel.tree.x = 0;
			lib.panel.tree.y = lib.panel.search.h;
		}
		this.row.count = row_count;
		this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row.h, this.vertical);
	}

	scrollMemory(h, j) {
		let scroll = !h ? j * this.row.h : (j - 3) * this.row.h;
		if (lib.panel.imgView && libImg.style.vertical) {
			scroll /= libImg.columns;
			scroll = scroll - scroll % this.row.h;
		}
		this.checkScroll(scroll, 'full', true);
	}

	setScroll() {
		const b = $Lib.clamp(this.scrollIX * this.row.h, 0, this.max_scroll);
		if (b == this.scroll) return;
		this.scroll = b;
		lib.panel.tree.x = 0;
		lib.panel.tree.y = lib.panel.search.h;
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
		lib.panel.treePaint();
	}

	scrollToEnd() {
		this.checkScroll(this.max_scroll, 'full');
	}

	setCol() {
		const opaque = lib.ui.getOpaque();
		this.alpha =
			!lib.ui.sbar.col ? 75 :
			grSet.theme.startsWith('custom') ? 0 :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? 220 :
			grSet.styleBlackAndWhite ? 175 :
			grSet.styleBlackAndWhite2 ? 152 :
			grSet.styleBlend ? 175 :
			100;
		this.alpha1 = this.alpha;
		this.alpha2 = !lib.ui.sbar.col ? 128 : 255
		this.inStep = lib.ui.sbar.type && lib.ui.sbar.col ? 12 : 18;
		switch (lib.ui.sbar.type) {
			case 0:
				switch (lib.ui.sbar.col) {
					case 0:
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, this.alpha + i), lib.ui.col.bg) : RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 192), lib.ui.col.bg) : RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 192);
						break;
					case 1:
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(lib.ui.col.text & RGBA(255, 255, 255, this.alpha + i), lib.ui.col.bg) : lib.ui.col.text & RGBA(255, 255, 255, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(lib.ui.col.text & 0x99ffffff, lib.ui.col.bg) : lib.ui.col.text & 0x99ffffff;
						break;
				}
				break;
			case 1:
				switch (lib.ui.sbar.col) {
					case 0:
						this.col.bg = opaque ? $Lib.RGBAtoRGB(RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 15), lib.ui.col.bg) : RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 15);
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, this.alpha + i), lib.ui.col.bg) : RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 192), lib.ui.col.bg) : RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 192);
						break;
					case 1:
						this.col.bg = opaque ? $Lib.RGBAtoRGB(lib.ui.col.text & 0x15ffffff, lib.ui.col.bg) : lib.ui.col.text & 0x15ffffff;
						for (let i = 0; i < this.alpha2 - this.alpha + 1; i++) this.col[this.alpha + i] = opaque ? $Lib.RGBAtoRGB(lib.ui.col.text & RGBA(255, 255, 255, this.alpha + i), lib.ui.col.bg) : lib.ui.col.text & RGBA(255, 255, 255, this.alpha + i);
						this.col.max = opaque ? $Lib.RGBAtoRGB(lib.ui.col.text & 0x99ffffff, lib.ui.col.bg) : lib.ui.col.text & 0x99ffffff;
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
		if (!libSet.flickDistance) return;
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
			lib.ui.id.touch_dn = -1;
			lib.panel.last_pressed_coord = {
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
