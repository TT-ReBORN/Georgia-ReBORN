'use strict';

class LibButtons {
	constructor() {
		this.alpha = 255;
		this.arc = 1;
		this.cur = null;
		this.Dn = false;
		this.hoverArea = 4;
		this.hot_h = 4;
		this.margin = Math.max(libSet.margin * 2 + 2, 12) / 4;
		this.trace = false;
		this.transition;
		this.vertical = true;

		this.b = {};
		this.btns = {};
		this.s = {};

		this.cross = {
			hover: null,
			normal: null
		};

		this.q = {
			s_img: null
		};

		this.scr = {
			bg: null,
			btns: ['scrollUp', 'scrollDn'],
			iconFontName: 'Segoe UI Symbol',
			iconFontStyle: 0,
			img: null,
			opaque: lib.ui.getOpaque(),
			pad: $Lib.clamp(libSet.sbarButPad / 100, -0.5, 0.3)
		};

		this.tooltipLib = {
			delay: true,
			show: grSet.showTooltipLibrary || grSet.showTooltipTruncated,
			start: Date.now() - 2000
		};

		this.setSbarIcon();
		this.createImages();
	}

	// * METHODS * //

	checkScrollBtns(x, y, hover_btn) {
		if (lib.sbar.timer_but) {
			if ((this.btns.scrollUp.down || this.btns.scrollDn.down) && !this.btns.scrollUp.trace(x, y) && !this.btns.scrollDn.trace(x, y)) {
				this.btns.scrollUp.cs('normal');
				this.btns.scrollDn.cs('normal');
				clearTimeout(lib.sbar.timer_but);
				lib.sbar.timer_but = false;
				lib.sbar.count = -1;
			}
		} else if (hover_btn) { this.scr.btns.forEach(v => {
			if (hover_btn.name == v && hover_btn.down) {
				this.btns[v].cs('down');
				hover_btn.l_dn();
			}
		}); }
	}

	clear() {
		this.Dn = false;
		Object.values(this.btns).forEach(v => v.down = false);
	}

	createImages() {
		let sz = this.scr.arrow == 0 ? Math.max(Math.round(lib.ui.sbar.but_h * 1.666667), 1) : 100;
		const sc = sz / 100;
		const iconFont = gdi.Font(this.scr.iconFontName, sz, this.scr.iconFontStyle);
		this.alpha = !lib.ui.sbar.col ? [75, 192, 228] : [210, 255, 255];
		const hovAlpha = (!lib.ui.sbar.col ? 75 : (!lib.ui.sbar.type ? 68 : 51)) * 0.4;
		this.scr.hover = !lib.ui.sbar.col ? RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, hovAlpha) : lib.ui.col.text & RGBA(255, 255, 255, hovAlpha);
		this.q.s_img = $Lib.gr(100, 100, true, g => {
			g.SetSmoothingMode(2);
			g.DrawLine(69, 71, 88, 90, 12, !lib.ui.id.local ? lib.ui.col.searchBtn : lib.ui.col.searchBtn);
			g.DrawEllipse(8, 11, 67, 67, 10, !lib.ui.id.local ? lib.ui.col.searchBtn : lib.ui.col.searchBtn);
			// g.FillEllipse(15, 17, 55, 55, lib.ui.col.bg); // Don't need this
			g.SetSmoothingMode(0);
		});
		this.q.s_img.RotateFlip(4);

		this.scr.img = $Lib.gr(sz, sz, true, g => {
			g.SetTextRenderingHint(3);
			g.SetSmoothingMode(2);
			if (lib.ui.sbar.col) {
				this.scr.arrow == 0 ? g.FillPolygon(lib.ui.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
				g.DrawString(this.scr.arrow, iconFont, lib.ui.col.sbarBtns, 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
			} else {
				this.scr.arrow == 0 ? g.FillPolygon(RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
					g.DrawString(this.scr.arrow, iconFont, RGBA(lib.ui.col.t, lib.ui.col.t, lib.ui.col.t, 255), 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
			}
			g.SetSmoothingMode(0);
		});

		this.scr.bg = $Lib.gr(sz, sz, true, g => {
			g.SetTextRenderingHint(3);
			g.SetSmoothingMode(2);
			if (lib.ui.sbar.col) {
				this.scr.arrow == 0 ? g.FillPolygon(lib.ui.col.bg, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(this.scr.arrow, iconFont, lib.ui.col.bg, 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
			} else {
				this.scr.arrow == 0 ? g.FillPolygon(lib.ui.col.bg, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
					g.DrawString(this.scr.arrow, iconFont, lib.ui.col.bg, 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
			}
			g.SetSmoothingMode(0);
		});
		sz = 100;
		this.cross.normal = $Lib.gr(sz, sz, true, g => {
			g.SetTextRenderingHint(3);
			g.SetSmoothingMode(2);
			const nn = 31;
			const offset1 = 12;
			const offset2 = 2;
			g.DrawLine(offset1, nn - offset2, 100 - nn * 2 + offset1, 100 - nn - offset2, 5, !lib.ui.id.local ? lib.ui.col.crossBtn : lib.ui.col.crossBtn);
			g.DrawLine(offset1, 100 - nn - offset2, 100 - nn * 2 + offset1, nn - offset2, 5, !lib.ui.id.local ? lib.ui.col.crossBtn : lib.ui.col.crossBtn);
			g.SetSmoothingMode(0);
		});
		this.cross.hover = $Lib.gr(sz, sz, true, g => {
			g.SetTextRenderingHint(3);
			g.SetSmoothingMode(2);
			const nn = 28;
			const offset1 = 9;
			const offset2 = 2;
			g.DrawLine(offset1, nn - offset2, 100 - nn * 2 + offset1, 100 - nn - offset2, 5, !lib.ui.id.local ? lib.ui.col.crossBtn : lib.ui.col.crossBtn);
			g.DrawLine(offset1, 100 - nn - offset2, 100 - nn * 2 + offset1, nn - offset2, 5, !lib.ui.id.local ? lib.ui.col.crossBtn : lib.ui.col.crossBtn);
			g.SetSmoothingMode(0);
		});
	}

	draw(gr) {
		Object.values(this.btns).forEach(v => {
			if (!v.hide) v.draw(gr);
		});
	}

	lbtn_dn(x, y) {
		this.move(x, y);
		if (!this.cur || this.cur.hide) {
			this.Dn = false;
			return false;
		} else this.Dn = this.cur.name;
		this.cur.down = true;
		this.cur.cs('down');
		this.cur.lbtn_dn(x, y);
		return true;
	}

	lbtn_up(x, y) {
		if (!this.cur || this.cur.hide || this.Dn != this.cur.name) {
			this.clear();
			return false;
		}
		this.clear();
		if (this.cur.trace(x, y)) this.cur.cs('hover');
		this.cur.lbtn_up(x, y);
		return true;
	}

	leave() {
		if (this.cur) {
			this.cur.cs('normal');
			if (!this.cur.hide) this.transition.start();
		}
		this.cur = null;
	}

	move(x, y) {
		const hover_btn = Object.values(this.btns).find(v => {
			if (!this.Dn || this.Dn == v.name) return v.trace(x, y);
		});
		let hand = false;
		this.checkScrollBtns(x, y, hover_btn);
		if (hover_btn) {
			grm.ui.styledTooltipText = grSet.showTooltipLibrary && typeof hover_btn.tiptext === 'function' ? hover_btn.tiptext() : '';
			hand = hover_btn.hand;
		}
		lib.pop.hand = hand;
		if (hover_btn && hover_btn.hide) {
			if (this.cur) {
				this.cur.cs('normal');
				this.transition.start();
			}
			this.cur = null;
			return null;
		} // btn hidden, ignore
		if (this.cur === hover_btn) return this.cur;
		if (this.cur) {
			this.cur.cs('normal');
			this.transition.start();
		} // return prev btn to normal state
		if (hover_btn && !(hover_btn.down && hover_btn.type < 4)) {
			hover_btn.cs('hover');
			if (grSet.showTooltipLibrary && this.tooltipLib.show && hover_btn.tiptext) hover_btn.tt.show(hover_btn.tiptext());
			this.transition.start();
		}
		this.cur = hover_btn;
		return this.cur;
	}

	on_script_unload() {
		this.tt('');
	}

	reset() {
		this.transition.stop();
	}

	setSbarIcon() {
		switch (libSet.sbarButType) {
			case 0:
				this.scr.iconFontName = 'Segoe UI Symbol';
				this.scr.iconFontStyle = 0;
				if (!lib.ui.sbar.type) {
					this.scr.arrow = lib.ui.sbar.but_w < Math.round(14 * $Lib.scale) ? '\uE018' : '\uE0A0';
					this.scr.pad = lib.ui.sbar.but_w < Math.round(15 * $Lib.scale) ? -0.3 : -0.22;
				} else {
					this.scr.arrow = lib.ui.sbar.but_w < Math.round(14 * $Lib.scale) ? '\uE018' : '\uE0A0';
					this.scr.pad = lib.ui.sbar.but_w < Math.round(14 * $Lib.scale) ? -0.26 : -0.22;
				}
				break;
			case 1:
				this.scr.arrow = 0;
				break;
			case 2:
				this.scr.iconFontName = libSet.butCustIconFont;
				this.scr.iconFontStyle = 0;
				this.scr.arrow = libSet.arrowSymbol.charAt().trim();
				if (!this.scr.arrow.length) this.scr.arrow = 0;
				this.scr.pad = $Lib.clamp(libSet.sbarButPad / 100, -0.5, 0.3);
				break;
		}
	}

	setScrollBtnsHide(set, autoHide) {
		if (autoHide) {
			this.scr.btns.forEach(v => {
				if (this.btns[v]) this.btns[v].hide = set;
			});
			lib.panel.treePaint();
		} else {
			if (!this.btns || (!libSet.sbarShow && !set)) return;
			this.scr.btns.forEach(v => {
				if (this.btns[v]) this.btns[v].hide = lib.sbar.scrollable_lines < 1 || !libSet.sbarShow;
			});
		}
	}

	setSearchBtnsHide() {
		const noShow = !libSet.searchShow;
		const searching = (libSet.filterShow || libSet.settingsShow) && lib.panel.search.txt;
		const o1 = this.btns.s_img;
		if (o1) o1.hide = noShow || searching;
		const o2 = this.btns.cross2;
		if (o2) o2.hide = noShow || !searching;
	}

	refresh(upd) {
		if (upd) {
			this.b.x = lib.ui.w - lib.ui.sz.marginSearch - Math.round(lib.ui.row.h * 0.59);
			this.b.h = lib.ui.row.h;
			this.b.y = lib.ui.y + Math.round((lib.panel.search.sp - this.b.h * 0.4) / 2 - this.b.h * 0.27);
			this.scr.opaque = lib.ui.getOpaque();
			this.vertical = !lib.panel.imgView || libImg.style.vertical;
			switch (true) {
				case this.vertical:
					this.scr.x1 = lib.panel.sbar_x + HD_4K(0, 6);
					this.scr.yUp1 = lib.sbar.y;
					this.scr.yDn1 = lib.sbar.y + lib.sbar.h - lib.ui.sbar.but_h;
					if (lib.ui.sbar.type != 2) {
						this.scr.x1 -= 1;
						this.scr.hotOffset = this.scr.yUp1 - lib.panel.search.h;
						this.scr.x2 = (lib.ui.sbar.but_h - lib.ui.sbar.but_w) / 2;
						this.scr.yUp2 = -lib.ui.sbar.arrowPad + this.scr.yUp1 + (lib.ui.sbar.but_h - 1 - lib.ui.sbar.but_w) / 2;
						this.scr.yDn2 = lib.ui.sbar.arrowPad + this.scr.yDn1 + (lib.ui.sbar.but_h - 1 - lib.ui.sbar.but_w) / 2;
					}
					break;
				case !this.vertical:
					this.scr.x1 = lib.sbar.x;
					this.scr.x3 = lib.sbar.x + lib.sbar.w - lib.ui.sbar.but_h;
					this.scr.xLeft1 = lib.sbar.x;
					this.scr.xRight1 = lib.sbar.x + lib.sbar.w - lib.ui.sbar.but_h;
					this.scr.y1 = lib.panel.sbar_y;
					if (lib.ui.sbar.type != 2) {
						this.scr.y1 -= 1;
						this.scr.hotOffset = this.scr.xLeft1 - 0;
						this.scr.y2 = (lib.ui.sbar.but_h - lib.ui.sbar.but_w) / 2;
						this.scr.xLeft2 = -lib.ui.sbar.arrowPad + this.scr.xLeft1 + (lib.ui.sbar.but_h - 1 - lib.ui.sbar.but_w) / 2;
						this.scr.xRight2 = lib.ui.sbar.arrowPad + this.scr.xRight1 + (lib.ui.sbar.but_h - 1 - lib.ui.sbar.but_w) / 2;
					}
					break;
			}


			this.q.x = lib.ui.x + lib.ui.sz.marginSearch;
			this.q.y = lib.ui.y + (lib.panel.search.sp - lib.ui.row.h * 0.6) / 2 + (lib.ui.row.h - lib.ui.font.main.Size) % 2;
			this.q.h = lib.ui.row.h * 0.6;
			this.hoverArea = Math.round(lib.panel.search.sp / 8);
			this.hot_h = Math.max(lib.panel.search.sp - this.hoverArea * 4, 4);
			this.margin = Math.max(libSet.margin * 2 + 2, 12) / 4;
			this.arc = Math.max(Math.round(Math.min(lib.panel.search.sp - this.hoverArea * 2, lib.panel.settings.w + this.margin / 2) / 4), 1);
			this.s.w1 = lib.panel.settings.w + lib.but.margin;
			this.s.w2 = lib.ui.w - lib.ui.sz.marginSearch - 1 + lib.panel.settings.offset;
			this.s.x = this.s.w2 - lib.panel.settings.w - lib.but.margin / 2;
		}
		if (libSet.sbarShow) {
			switch (lib.ui.sbar.type) {
				case 2:
					switch (true) {
						case this.vertical:
							this.btns.scrollUp = new LibBtn(this.scr.x1, this.scr.yUp1, lib.ui.sbar.but_h, lib.ui.sbar.but_h, 3, '', '', '', {
								normal: 1,
								hover: 2,
								down: 3
							}, libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(1), '', '', false, 'scrollUp');
							this.btns.scrollDn = new LibBtn(this.scr.x1, this.scr.yDn1, lib.ui.sbar.but_h, lib.ui.sbar.but_h, 3, '', '', '', {
								normal: 5,
								hover: 6,
								down: 7
							}, libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(-1), '', '', false, 'scrollDn');
							break;
						case !this.vertical:
							this.btns.scrollUp = new LibBtn(lib.ui.x + this.scr.xLeft1, this.scr.y1 - HD_4K(19, 46), lib.ui.sbar.but_h, lib.ui.sbar.but_h, 3, '', '', '', {
								normal: 9,
								hover: 10,
								down: 11
							}, libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(1), '', '', false, 'scrollUp');
							this.btns.scrollDn = new LibBtn(this.scr.xRight1, this.scr.y1 - HD_4K(19, 46), lib.ui.sbar.but_h, lib.ui.sbar.but_h, 3, '', '', '', {
								normal: 13,
								hover: 14,
								down: 15
							}, libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(-1), '', '', false, 'scrollDn');
							break;
					}
					break;
				default:
					switch (true) {
						case this.vertical:
							this.btns.scrollUp = new LibBtn(this.scr.x1, this.scr.yUp1, lib.ui.sbar.but_h, lib.ui.sbar.but_h, 1, this.scr.x2, this.scr.yUp2, lib.ui.sbar.but_w, '', libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(1), '', '', false, 'scrollUp');
							this.btns.scrollDn = new LibBtn(this.scr.x1, this.scr.yDn1, lib.ui.sbar.but_h, lib.ui.sbar.but_h, 2, this.scr.x2, this.scr.yDn2, lib.ui.sbar.but_w, '', libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(-1), '', '', false, 'scrollDn');
							break;
						case !this.vertical:
							this.btns.scrollUp = new LibBtn(this.scr.xLeft1 - this.scr.hotOffset + SCALE(40), this.scr.y1 - HD_4K(19, 46), lib.ui.sbar.but_h, lib.ui.sbar.but_h + this.scr.hotOffset, 1, this.scr.y2, this.scr.xLeft2, lib.ui.sbar.but_w, '', libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(1), '', '', false, 'scrollUp');
							this.btns.scrollDn = new LibBtn(this.scr.xRight1, this.scr.y1 - HD_4K(19, 46), lib.ui.sbar.but_h, lib.ui.sbar.but_h + this.scr.hotOffset, 2, this.scr.y2, this.scr.xRight2, lib.ui.sbar.but_w, '', libSet.sbarShow == 1 && lib.sbar.narrow.show || lib.sbar.scrollable_lines < 1, () => lib.sbar.but(-1), '', '', false, 'scrollDn');
							break;
					}
					break;
			}
		}
		this.transition = new LibTransition(this.btns, v => v.state !== 'normal');
		this.btns.s_img = new LibBtn(this.q.x - this.margin / 2, lib.ui.y + this.hoverArea, this.q.h + this.margin, this.hot_h, 4, this.q.x, this.q.y, this.q.h, {
			normal: this.q.s_img
		}, false, '', () => libSMenu.load(this.q.x - this.margin / 2 - HD_4K(9, 22), lib.ui.y + lib.panel.search.h - SCALE(12)), () => 'History and query syntax help. Ctrl+E focuses search', true, 's_img');

		this.btns.cross2 = new LibBtn(this.q.x - this.margin / 2, lib.ui.y + this.hoverArea, this.q.h + this.margin, this.hot_h, 5, this.q.x, this.b.y, this.b.h, {
			normal: this.cross.normal,
			hover: this.cross.hover
		}, true, '', () => lib.search.clear(), () => lib.panel.search.txt ? 'Clear search text (escape). Double click to show history' : 'No search text to clear', true, 'cross2');
		this.btns.filter = new LibBtn(libSet.searchShow ? lib.panel.filter.x + this.margin / 2 : lib.panel.filter.x - this.margin / 2, lib.ui.y, libSet.searchShow ? lib.panel.filter.w - this.margin : lib.panel.filter.w + this.margin, lib.panel.search.sp, 6, lib.panel.filter.x, libSet.searchShow ? lib.panel.cc : lib.panel.lc, lib.panel.filter.w, {
			normal: lib.ui.col.txt_box,
			hover: !lib.ui.id.local ? (!lib.ui.img.blurDark ? lib.ui.col.txt_box_h : lib.ui.col.text) : lib.ui.col.txt_box
		}, !libSet.filterShow, '', () => libFMenu.load(lib.panel.filter.x - HD_4K(5, -29), lib.ui.y + lib.panel.search.h - SCALE(12)), () => 'Filter', true, 'filter');

		this.btns.settings = new LibBtn(lib.ui.x + this.s.x, lib.ui.y + lib.panel.settings.offset, this.s.w1, lib.panel.search.sp, 7, this.s.w2, lib.panel.search.sp, lib.panel.settings.y, {
			normal: lib.ui.col.txt_box,
			hover: !lib.ui.id.local ? (!lib.ui.img.blurDark ? lib.ui.col.txt_box_h : lib.ui.col.text) : lib.ui.col.txt_box
		}, !libSet.settingsShow, '', () => lib.men.rbtn_up(lib.ui.x + this.s.x - HD_4K(28, 21), lib.ui.y + lib.panel.search.h - SCALE(12), true), () => 'Settings', true, 'settings');

		this.btns.cross1 = new LibBtn(this.b.x - this.margin / 2, lib.ui.y + this.hoverArea, this.q.h + this.margin, this.hot_h, 5, this.b.x, this.b.y, this.b.h, {
			normal: this.cross.normal,
			hover: this.cross.hover
		}, !libSet.searchShow || libSet.filterShow || libSet.settingsShow, '', () => lib.search.clear(), () => lib.panel.search.txt ? 'Clear search text (escape)' : 'No search text to clear', true, 'cross1');
		this.setSearchBtnsHide();
	}

	traceBtn(btn, x, y) {
		const o = this.btns[btn];
		return o && o.trace(x, y);
	}

	tt(n, force) {
		if (libTooltip.Text === n && !force) return;
		lib.pop.checkTooltipFont('btn');
		libTooltip.Text = n;
		libTooltip.Activate();
	}
}

class LibBtn {
	constructor(x, y, w, h, type, p1, p2, p3, item, hide, l_dn, l_up, tiptext, hand, name) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.type = type;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.item = item;
		this.hide = hide;
		this.l_dn = l_dn;
		this.l_up = l_up;
		this.tt = new LibTooltip();
		this.tiptext = tiptext;
		this.hand = hand;
		this.name = name;
		this.transition_factor = 0;
		this.state = 'normal';
	}

	// * METHODS * //

	cs(state) {
		this.state = state;
		if (state === 'down' || state === 'normal') this.tt.clear();
		this.repaint();
	}

	draw(gr) {
		switch (this.type) {
			case 1:
			case 2:
				this.drawScrollBtn(gr);
				break;
			case 3:
				lib.ui.theme.SetPartAndStateID(1, this.item[this.state]);
				lib.ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
				break;
			case 4:
				this.drawSearch(gr);
				break;
			case 5:
				this.drawCross(gr);
				break;
			case 6:
				this.drawFilter(gr);
				break;
			case 7:
				this.drawSettings(gr);
				break;
		}
	}

	drawCross(gr) {
		const a = !lib.ui.id.local ? lib.panel.search.txt ? (this.state !== 'down' ? Math.min(200 + (255 - 100) * this.transition_factor, 255) : 255) : 100 : 255;
		const crossIm = this.state === 'normal' || !lib.panel.search.txt ? this.item.normal : this.item.hover;
		// const colRect = this.state !== 'down' ? lib.ui.getBlend(lib.ui.col.bg4, lib.ui.col.bg5, this.transition_factor, true) : lib.ui.col.bg4;
		gr.SetSmoothingMode(2);
		// gr.FillRoundRect(this.x, this.y, this.w, this.h, lib.but.arc, lib.but.arc, colRect); // Hover effect
		gr.SetSmoothingMode(0);
		gr.SetInterpolationMode(2);
		if (crossIm) gr.DrawImage(crossIm, this.p1, this.p2 - SCALE(2), this.p3, this.p3, 0, 0, crossIm.Width, crossIm.Height, 0, a);
		gr.SetInterpolationMode(0);
	}

	drawFilter(gr) {
		// const colText = !lib.ui.id.local ? (this.state !== 'down' ? lib.ui.getBlend(this.item.hover, this.item.normal, this.transition_factor, true) : this.item.hover) : this.item.normal;
		// const colRect = this.state !== 'down' ? lib.ui.getBlend(lib.ui.col.bg4, lib.ui.col.bg5, this.transition_factor, true) : lib.ui.col.bg4;
		gr.SetSmoothingMode(2);
		// gr.FillRoundRect(this.x, lib.ui.y + lib.but.hoverArea, this.w, lib.but.hot_h, lib.but.arc, lib.but.arc, colRect); // Hover effect
		gr.SetSmoothingMode(0);
		if (!lib.ui.img.blurDark) gr.GdiDrawText(lib.panel.filter.mode[libSet.filterBy].name, lib.panel.filter.font, lib.ui.col.filterBtn, this.p1 + HD_4K(9, 22), lib.ui.y, this.p3, this.h, this.p2);
		else {
			gr.SetTextRenderingHint(5);
			gr.DrawString(lib.panel.filter.mode[libSet.filterBy].name, lib.panel.filter.font, lib.ui.col.filterBtn, this.p1 + HD_4K(8, 21), lib.ui.y - 1, this.p3, this.h, StringFormat(1, 1));
		}
	}

	drawScrollBtn(gr) {
		const a = this.state !== 'down' ? Math.min(lib.but.alpha[0] + (lib.but.alpha[1] - lib.but.alpha[0]) * this.transition_factor, lib.but.alpha[1]) : lib.but.alpha[2];
		switch (true) {
			case lib.but.vertical:
				if (this.state !== 'normal' && lib.ui.sbar.type == 1) gr.FillSolidRect(lib.sbar.x, this.y + (this.type == 1 ? lib.but.scr.hotOffset - lib.panel.sbar_o : 0), lib.sbar.w, this.h - lib.but.scr.hotOffset + lib.panel.sbar_o, lib.ui.col.bg);
				if (lib.but.scr.opaque && lib.but.scr.bg) gr.DrawImage(lib.but.scr.bg, lib.panel.sbar_x /* this.x + this.p1 */, this.p2, this.p3, this.p3, 0, 0, lib.but.scr.bg.Width, lib.but.scr.bg.Height, this.type == 1 ? 0 : 180);
				if (lib.but.scr.img) gr.DrawImage(lib.but.scr.img, lib.panel.sbar_x /* this.x + this.p1 */, this.p2, this.p3, this.p3, 0, 0, lib.but.scr.img.Width, lib.but.scr.img.Height, this.type == 1 ? 0 : 180, a);
				break;
			case !lib.but.vertical:
				if (this.state !== 'normal' && lib.ui.sbar.type == 1) gr.FillSolidRect(this.x + (this.type == 1 ? lib.but.scr.hotOffset - lib.panel.sbar_o : 0), lib.sbar.y, this.w - lib.but.scr.hotOffset + lib.panel.sbar_o, lib.sbar.h, lib.ui.col.bg);
				if (lib.but.scr.opaque && lib.but.scr.bg) gr.DrawImage(lib.but.scr.bg, this.p2, lib.sbar.y /* this.y + this.p1 */, this.p3, this.p3, 0, 0, lib.but.scr.bg.Width, lib.but.scr.bg.Height, this.type == 1 ? 270 : 90);
				if (lib.but.scr.img) gr.DrawImage(lib.but.scr.img, this.p2, lib.sbar.y /* this.y + this.p1 */, this.p3, this.p3, 0, 0, lib.but.scr.img.Width, lib.but.scr.img.Height, this.type == 1 ? 270 : 90, a);
				break;
		}
	}

	drawSearch(gr) {
		const a = !lib.ui.id.local ? (this.state !== 'down' ? Math.min(255 + (240 - 180) * this.transition_factor, 240) : 240) : 255;
		// const colRect = this.state !== 'down' ? lib.ui.getBlend(lib.ui.col.bg4, lib.ui.col.bg5, this.transition_factor, true) : lib.ui.col.bg4;
		// gr.SetSmoothingMode(2);
		// gr.FillRoundRect(this.x, lib.ui.y + SCALE(6), this.w, this.h, lib.but.arc, lib.but.arc, colRect); // Hover effect
		// gr.SetSmoothingMode(0);
		gr.SetInterpolationMode(2);
		if (this.item.normal) gr.DrawImage(this.item.normal, this.p1, lib.ui.y + SCALE(18), this.p3, this.p3, 0, 0, this.item.normal.Width, this.item.normal.Height, 0, a);
		// gr.SetInterpolationMode(0); // Causes ugly rendering of lower bar flags when switching to Library
	}

	drawSettings(gr) {
		// const colText = !lib.ui.id.local ? (this.state !== 'down' ? lib.ui.getBlend(this.item.hover, this.item.normal, this.transition_factor, true) : this.item.hover) : this.item.normal;
		// const colRect = this.state !== 'down' ? lib.ui.getBlend(lib.ui.col.bg4, lib.ui.col.bg5, this.transition_factor, true) : lib.ui.col.bg4;
		gr.SetSmoothingMode(2);
		// gr.FillRoundRect(this.x, lib.ui.y + lib.but.hoverArea, this.w, lib.but.hot_h, lib.but.arc, lib.but.arc, colRect); // Hover effect
		gr.SetSmoothingMode(0);
		if (!lib.ui.img.blurDark) gr.GdiDrawText(lib.panel.settings.icon, lib.panel.settings.font, lib.ui.col.settingsBtn, lib.ui.x + HD_4K(0, 1), lib.ui.y + SCALE(2), this.p1, this.p2, lib.panel.rc);
		else {
			gr.SetTextRenderingHint(5);
			gr.DrawString(lib.panel.settings.icon, lib.panel.settings.font, lib.ui.col.settingsBtn, lib.ui.x + HD_4K(0, 1), lib.ui.y + SCALE(2) - 1, this.p1, this.p2, StringFormat(2, 1));
		}
	}

	lbtn_dn(x, y) {
		if (!lib.but.Dn) return;
		this.l_dn && this.l_dn(x, y);
	}

	lbtn_up() {
		if (this.l_up) this.l_up();
	}

	repaint() {
		const expXY = 2;
		const expWH = 4;
		window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
	}

	trace(x, y) {
		lib.but.trace = !this.hide && x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
		return lib.but.trace;
	}
}

class LibTooltip {
	constructor() {
		this.id = Math.ceil(Math.random().toFixed(8) * 1000);
		this.tt_timer = new LibTooltipTimer();
	}

	// * METHODS * //

	clear() {
		this.tt_timer.stop(this.id);
	}

	show(text) {
		if (Date.now() - lib.but.tooltipLib.start > 2000 && lib.but.tooltipLib.delay) this.showDelayed(text);
		else this.showImmediate(text);
		lib.but.tooltipLib.start = Date.now();
	}

	showDelayed(text) {
		grm.ui.styledTooltipText = text;
		if (!grSet.showStyledTooltips) {
			this.tt_timer.start(this.id, text);
		}
	}

	showImmediate(text) {
		grm.ui.styledTooltipText = text;
		if (!grSet.showStyledTooltips) {
			this.tt_timer.set_id(this.id);
			this.tt_timer.stop(this.id);
			lib.but.tt(text);
		}
	}

	stop() {
		this.tt_timer.forceStop();
	}
}

class LibTooltipTimer {
	constructor() {
		this.delay_timer;
		this.tt_caller = undefined;
	}

	// * METHODS * //

	forceStop() {
		lib.but.tooltipLib.delay = true;
		lib.but.tt('');
		if (this.delay_timer) {
			clearTimeout(this.delay_timer);
			this.delay_timer = null;
		}
	}

	set_id(id) {
		this.tt_caller = id;
	}

	start(id, text) {
		const old_caller = this.tt_caller;
		this.tt_caller = id;
		if (!this.delay_timer && libTooltip.Text) lib.but.tt(text, old_caller !== this.tt_caller);
		else {
			this.forceStop();
			if (!this.delay_timer) {
				this.delay_timer = setTimeout(() => {
					lib.but.tt(text);
					this.delay_timer = null;
				}, 500);
			}
		}
	}

	stop(id) {
		if (this.tt_caller === id) this.forceStop();
	}
}

class LibTransition {
	constructor(items, hover) {
		this.hover = hover;
		this.items = items;
		this.transition_timer = null;
	}

	// * METHODS * //

	start() {
		const hover_in_step = 0.2;
		const hover_out_step = 0.06;
		if (!this.transition_timer) {
			this.transition_timer = setInterval(() => {
				Object.values(this.items).forEach(v => {
					const saved = v.transition_factor;
					v.transition_factor = this.hover(v) ? Math.min(1, v.transition_factor += hover_in_step) : Math.max(0, v.transition_factor -= hover_out_step);
					if (saved !== v.transition_factor) {
						v.repaint();
					}
				});
				const running = Object.values(this.items).some(v => v.transition_factor > 0 && v.transition_factor < 1);
				if (!running) this.stop();
			}, 25);
		}
	}

	stop() {
		if (this.transition_timer) {
			clearInterval(this.transition_timer);
			this.transition_timer = null;
		}
	}
}
