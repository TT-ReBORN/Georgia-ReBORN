'use strict';

class ButtonsBio {
	constructor() {
		this.alpha = 255;
		this.btns = {};
		this.cur = null;
		this.Dn = false;
		this.traceBtn = false;
		this.transition;

		this.flag = {
			x: panelBio.heading.x,
			w: Math.round(uiBio.font.heading_h * 1.2)
		};
		this.flag.h = Math.round(this.flag.w * 0.6);
		this.flag.y = panelBio.text.t - uiBio.heading.h + Math.round((uiBio.font.heading_h - this.flag.h) / 2);
		this.flag.sp = Math.round(this.flag.w * 1.42);

		this.lookUp = {
			baseSize: 15 * $Bio.scale,
			col: $Bio.toRGB(uiBio.col.text),
			gap: 8,
			img: null,
			imgLock: null,
			pos: 1,
			x: 0,
			y: 0,
			w: 12,
			h: 12,
			sz: 12
		};

		this.rating = {
			h1: 0,
			h2: 0,
			hash: '',
			images: [],
			scale: 2,
			show: false,
			w1: 30,
			w2: 30
		};

		this.scr = {
			albBtns: ['alb_scrollDn', 'alb_scrollUp'],
			artBtns: ['art_scrollDn', 'art_scrollUp'],
			img: null,
			iconFontName: 'Segoe UI Symbol',
			iconFontStyle: 0,
			init: true,
			pad: $Bio.clamp(pptBio.sbarButPad / 100, -0.5, 0.3)
		};

		this.src = {
			amBio: '',
			amRev: '',
			allmusic: 0,
			bahn: 'Bahnschrift SemiBold SemiConden',
			bahnInstalled: utils.CheckFont('Bahnschrift SemiBold SemiConden'),
			col: {},
			font: gdi.Font('Segoe UI Symbol', 12, 1),
			h: 19,
			icon: false,
			item_w: {
				amBio: 30,
				amRev: 30,
				lfmBio: 30,
				lfmRev: 30,
				space: 4,
				spaceIconFont: 4,
				txtBio: 30,
				txtRev: 30,
				wikiBio: 30,
				wikiRev: 30
			},
			lfmBio: '',
			lfmRev: '',
			pxShift: false,
			name: '',
			name_w: 40,
			text: false,
			space: ' ',
			txtBio: '',
			txtRev: '',
			visible: false,
			w: 50,
			wikiBio: '',
			wikiRev: '',
			x: 0,
			y: 0
		};

		this.tooltipBio = {
			heading: '',
			name: false,
			show: pref.showTooltipBiography || pref.showTooltipTruncated,
			start: Date.now() - 2000,
			x: 0,
			w: 100
		};

		this.lookUp.zoomSize = Math.max(Math.round(this.lookUp.baseSize * pptBio.zoomLookUpBtn / 100), 7);
		this.lookUp.scale = Math.round(this.lookUp.zoomSize / this.lookUp.baseSize * 100);
		this.lookUp.font = gdi.Font('FontAwesome', scaleForDisplay(18) * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font('FontAwesome', scaleForDisplay(17) * this.lookUp.scale / 100, 0);

		this.scr.btns = this.scr.albBtns.concat(this.scr.artBtns);
		this.src.iconFont = this.src.font;
		if (uiBio.stars == 1 && uiBio.show.btnRedLastfm) this.rating.imagesLfm = [];

		pptBio.zoomLookUpBtn = this.lookUp.scale;

		this.setSbarIcon();
		this.createImages('all');
	}

	// Methods

	check(refresh) {
		if (!refresh) {
			(pptBio.sbarShow != 1 || !this.scr.init) && !txt.lyricsDisplayed() ? this.setScrollBtnsHide() : this.setScrollBtnsHide(true, 'both');
		}
		this.rating.show = uiBio.stars == 1 && !pptBio.artistView && (txt.rev.loaded.am && txt.rating.am != -1 || txt.rev.loaded.lfm && txt.rating.lfm != -1);
		this.src.name = uiBio.show.btnBg ? ' ' : '';
		switch (true) {
			case !pptBio.artistView: {
				const ix = txt.rev.loaded.ix == -1 ? pptBio.sourcerev : txt.rev.loaded.ix;
				this.src.name += [this.src.amRev, this.src.lfmRev, this.src.wikiRev, this.src.txtRev][ix];
				break;
			}
			case pptBio.artistView: {
				const ix = txt.bio.loaded.ix == -1 ? pptBio.sourcebio : txt.bio.loaded.ix;
				this.src.name += [this.src.amBio, this.src.lfmBio, this.src.wikiBio, this.src.txtBio][ix];
				break;
			}
		}
		this.src.name += uiBio.show.btnBg || this.rating.show ? ' ' : '';
		this.src.text = pptBio.heading && this.btns.heading && pptBio.hdBtnShow && (!!(this.src.icon || this.src.name.trim().length));
		if (!this.btns.heading || !pptBio.heading) return;
		this.src.visible = pptBio.hdBtnShow && (this.rating.show || this.src.text) && pptBio.hdPos != 2;
		if (!this.src.visible) this.src.w = 0;
		else {
			this.src.name_w = 0;
			if (this.rating.show) this.src.name_w = txt.rev.loaded.am ? this.src.item_w.amRev : this.src.item_w.lfmRev;
			this.src.name_w = this.src.name_w + this.src.item_w.space * (uiBio.show.btnBg ? (this.src.name_w ? 2 : 1) : 0);
			this.src.w = 0;
			switch (true) {
				case this.rating.show:
					this.src.w = this.src.name_w + this.rating.w2 + (this.src.text || uiBio.show.btnBg ? this.src.item_w.space : 0);
					break;
				case this.src.text:
					switch (true) {
						case !pptBio.artistView: {
							const ix = txt.rev.loaded.ix == -1 ? pptBio.sourcerev : txt.rev.loaded.ix;
							this.src.w = [this.src.item_w.amRev, this.src.item_w.lfmRev, this.src.item_w.wikiRev, this.src.item_w.txtRev][ix];
							break;
						}
						case pptBio.artistView: {
							const ix = txt.bio.loaded.ix == -1 ? pptBio.sourcebio : txt.bio.loaded.ix;
							this.src.w = [this.src.item_w.amBio, this.src.item_w.lfmBio, this.src.item_w.wikiBio, this.src.item_w.txtBio][ix];
							break;
						}
					}
					this.src.w += this.src.item_w.space * (uiBio.show.btnBg ? 2 : 0);
					break;
			}
			if (!uiBio.show.btnBg) this.src.name_w += this.src.item_w.space * (this.src.text ? 2 : 0);
		}
	}

	checkScrollBtns(x, y, hover_btn) {
		const arr = alb_scrollbar.timer_but ? this.scr.albBtns : art_scrollbar.timer_but ? this.scr.artBtns : false;
		if (arr) {
			if ((this.btns[arr[0]].down || this.btns[arr[1]].down) && !this.btns[arr[0]].trace(x, y) && !this.btns[arr[1]].trace(x, y)) {
				this.btns[arr[0]].cs('normal');
				this.btns[arr[1]].cs('normal');
				if (alb_scrollbar.timer_but) {
					clearTimeout(alb_scrollbar.timer_but);
					alb_scrollbar.timer_but = null;
					alb_scrollbar.count = -1;
				}
				if (art_scrollbar.timer_but) {
					clearTimeout(art_scrollbar.timer_but);
					art_scrollbar.timer_but = null;
					art_scrollbar.count = -1;
				}
			}
		} else if (hover_btn) {
			this.scr.btns.forEach(v => {
				if (hover_btn.name == v && hover_btn.down) {
					this.btns[v].cs('down');
					hover_btn.l_dn();
				}
			});
		}
	}

	clear() {
		this.Dn = false;
		Object.values(this.btns).forEach(v => v.down = false);
	}

	clearTooltip() {
		if (!tooltipBio.Text || !this.btns.lookUp.tt) return;
		this.btns.lookUp.tt.stop();
	}

	createImages(n) {
		if (n == 'all') {
			const sz = this.scr.arrow == 0 ? Math.max(Math.round(uiBio.sbar.but_h * 1.666667), 1) : 100;
			const sc = sz / 100;
			const iconFont = gdi.Font(this.scr.iconFontName, sz, this.scr.iconFontStyle);
			this.alpha = !uiBio.sbar.col ? [180, 220, 255] : [180, 220, 255];
			const hovAlpha = (!uiBio.sbar.col ? 75 : (!uiBio.sbar.type ? 68 : 51)) * 0.4;
			this.scr.hover = !uiBio.sbar.col ? RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, hovAlpha) : uiBio.col.text & RGBA(255, 255, 255, hovAlpha);
			this.scr.img = $Bio.gr(sz, sz, true, g => {
				g.SetTextRenderingHint(3);
				g.SetSmoothingMode(2);
				if (pptBio.sbarCol) {
					this.scr.arrow == 0 ? g.FillPolygon(uiBio.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
					g.DrawString(this.scr.arrow, iconFont, uiBio.col.sbarBtns, 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				} else {
					this.scr.arrow == 0 ? g.FillPolygon(RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
					g.DrawString(this.scr.arrow, iconFont, RGBA(uiBio.col.t, uiBio.col.t, uiBio.col.t, 255), 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				}
				g.SetSmoothingMode(0);
			});
		}
		if (n == 'all' || n == 'lookUp') {
			this.lookUp.col = $Bio.toRGB(uiBio.col.text);
			$Bio.gr(1, 1, false, g => {
				this.lookUp.sz = Math.max(g.CalcTextWidth('\uF107', this.lookUp.font), g.CalcTextWidth('\uF023', this.lookUp.fontLock), g.CalcTextHeight('\uF107', this.lookUp.font), g.CalcTextHeight('\uF023', this.lookUp.fontLock));
			});
		}
	}

	createStars(force) {
		this.src.icon = uiBio.show.btnLabel == 2 ? 1 : 0;
		const hs = uiBio.font.heading.Size;
		const fs = uiBio.stars != 1 ? (this.src.icon ? (this.src.bahnInstalled ? 12 : 11) : 10) * $Bio.scale : (is_4k ? 26 : 14);
		const srcFontSize = this.src.fontSize;
		const biographyFontSize = pref.layout === 'artwork' ? pptBio.baseFontSizeBio_artwork : pptBio.baseFontSizeBio_default;
		this.src.fontSize = $Bio.clamp(Math.round(hs * 1.0) + (pptBio.zoomHeadBtn - 100) / 10, Math.min(fs, hs), Math.max(fs, hs));
		if (this.src.fontSize != srcFontSize || force) this.src.font = gdi.Font('Segoe UI', this.src.fontSize, 1);
		$Bio.gr(1, 1, false, g => {
			this.src.h = g.CalcTextHeight('allmusic', this.src.font);
			switch (this.src.icon) {
				case 0:
					this.src.amBio = cfg.amDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.amRev = cfg.amDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.lfmBio = cfg.lfmDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.lfmRev = cfg.lfmDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.wikiBio = cfg.wikiDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.wikiRev = cfg.wikiDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.txtBio = (txt.bio.subhead.txt[0] || '').toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.txtRev = (txt.rev.subhead.txt[0] || '').toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					if (!uiBio.show.btnLabel) {
						this.src.amBio = '';
						this.src.amRev = '';
						this.src.lfmBio = '';
						this.src.lfmRev = '';
						this.src.wikiBio = '';
						this.src.wikiRev = '';
						this.src.txtBio = '';
						this.src.txtRev = '';
					}
					$Bio.gr(1, 1, false, g => {
						['space', 'amRev', 'lfmRev', 'wikiRev', 'txtRev', 'amBio', 'lfmBio', 'wikiBio', 'txtBio'].forEach(v => this.src.item_w[v] = g.CalcTextWidth(this.src[v], this.src.font, true))
					});
					break;
				case 1: {
					this.src.amBio = this.src.amRev = cfg.amDisplayName.toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.lfmBio = this.src.lfmRev = `\uF202${!pptBio.sourceAll ? '' : '... '}`;
					this.src.wikiBio = this.src.wikiRev = `\uF266${!pptBio.sourceAll ? '' : '... '}`;
					this.src.txtBio = (txt.bio.subhead.txt[0] || '').toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					this.src.txtRev = (txt.rev.subhead.txt[0] || '').toLowerCase() + (!pptBio.sourceAll ? '' : '... ');
					if (this.src.fontSize != srcFontSize || force) {
						this.src.font = gdi.Font(uiBio.font.heading.Name, Math.max(Math.round(uiBio.font.headingBaseSize * uiBio.font.zoomSize / (biographyFontSize) * (100 + ((pptBio.zoomHead - 100) / uiBio.font.boldAdjust)) / 100), 6), uiBio.font.headingStyle); // gdi.Font(this.src.bahnInstalled ? this.src.bahn : 'Segoe UI Semibold', this.src.fontSize, 0);
						this.src.iconFont = gdi.Font('FontAwesome', Math.round(this.src.fontSize * (this.src.bahnInstalled ? 1.09 : 1.16)), 0);
					}
					const alt_w = [];
					alt_w[9] = ' ';
					const fonts = [this.src.font, this.src.font, this.src.iconFont, this.src.iconFont, this.src.font, this.src.font, this.src.iconFont, this.src.iconFont, this.src.font, this.src.iconFont];
					['space', 'amRev', 'lfmRev', 'wikiRev', 'txtRev', 'amBio', 'lfmBio', 'wikiBio', 'txtBio', 'spaceIconFont'].forEach((v, i) => {
						this.src.item_w[v] = g.CalcTextWidth(i < 9 ? this.src[v] : alt_w[i], fonts[i], true);
					});
					this.src.item_w.space = Math.max(this.src.item_w.space, this.src.item_w.spaceIconFont);
					const n = pptBio.artistView ? 'bio' : 'rev';
					this.src.y = this.src.fontSize < 12 || txt[n].loaded.ix == 2 ? 1 : 0;
					break;
				}
			}
		});
		if (uiBio.stars == 1) this.setRatingImages(Math.round(this.src.h / 1.3) * 5, Math.round(this.src.h / 1.3), uiBio.col.starOn, uiBio.col.starOff, uiBio.col.starBor, false);
		else if (uiBio.stars == 2) {
			this.setRatingImages(Math.round(uiBio.font.main_h / 1.75) * 5, Math.round(uiBio.font.main_h / 1.75), uiBio.col.starOn, uiBio.col.starOff, uiBio.col.starBor, false);
		}
		if (uiBio.stars == 1 && uiBio.show.btnRedLastfm) this.setRatingImages(Math.round(this.src.h / 1.5) * 5, Math.round(this.src.h / 1.5), RGBA(225, 225, 245, 255), RGBA(225, 225, 245, 60), uiBio.col.starBor, true);

		this.src.pxShift = /[gjpqy]/.test(this.src.amRev + this.src.lfmRev + this.src.wikiRev + this.src.txtRev + this.src.amBio + this.src.lfmBio + this.src.wikiBio + this.src.txtBio);
	}

	draw(gr) {
		Object.values(this.btns).forEach(v => {
			if (!v.hide) v.draw(gr);
		});
	}

	drawStar(g, col, pts, line_thickness) {
		g.SetSmoothingMode(2);
		g.FillPolygon(col, 1, pts);
		if (line_thickness > 0) g.DrawPolygon(col, line_thickness, pts);
	}

	getStarPoints(star_size, star_padding, star_indent, star_vpadding, points, line_thickness) {
		const point_arr = [];
		let rr = 0;
		for (let i = 0; i != points; i++) {
			i % 2 ? rr = Math.round((star_size - line_thickness * 4) / 2) / star_indent : rr = Math.round((star_size - line_thickness * 4) / 2);
			const x_point = Math.floor(rr * Math.cos(Math.PI * i / points * 2 - Math.PI / 2));
			const y_point = Math.ceil(rr * Math.sin(Math.PI * i / points * 2 - Math.PI / 2));
			point_arr.push(x_point + star_size / 2);
			point_arr.push(y_point + star_size / 2);
		}
		const pts = [];
		for (let i = 0; i < 5; i++) {
			pts[i] = point_arr.map((v, j) => j % 2 === 0 ? v + i * (star_size + star_padding) : v + star_vpadding);
		}
		return pts;
	}

	isNextSourceAvailable() {
		let n = pptBio.artistView ? 'Bio' : 'Rev';
		if (pptBio.lockBio && !pptBio.sourceAll) return true;
		n = pptBio.artistView ? 'bio' : 'rev';
		const types = txt[n].reader && panelBio.stndItem() ? $Bio.source.amLfmWikiTxt : $Bio.source.amLfmWiki;
		let found = 0;
		return types.some(type => {
			if (txt[n][type]) found++;
			if (found == 2) return true;
		});
	}

	lbtn_dn(x, y) {
		this.move(x, y, true);
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

	move(x, y, lDn) {
		const hover_btn = Object.values(this.btns).find(v => {
			if (!this.Dn || this.Dn == v.name) return v.trace(x, y);
		});
		let hand = false;
		this.scr.init = false;
		this.checkScrollBtns(x, y, hover_btn);
		if (hover_btn) hand = hover_btn.hand;
		if (!resize.down) window.SetCursor(!hand && !seeker.hand && !filmStrip.hand ? 32512 : 32649);
		if (hover_btn && hover_btn.hide) {
			if (this.cur) {
				this.cur.cs('normal');
				this.transition.start();
			}
			this.cur = null;
			return null;
		} // btn hidden, ignore
		if (this.cur === hover_btn) {
			if (this.cur && this.cur.name == 'heading') {
				const new_tt = hover_btn.tiptext();
				if (this.tooltipBio.heading != new_tt) {
					if (this.tooltipBio.show && hover_btn.tiptext && !lDn) hover_btn.tt.show(new_tt);
					this.tooltipBio.heading = new_tt;
				}
			}
			return this.cur;
		}
		if (this.cur) {
			this.cur.cs('normal');
			this.transition.start();
		} // return prev btn to normal state
		if (hover_btn && !(hover_btn.down && hover_btn.type < 6)) {
			hover_btn.cs('hover');
			if (this.tooltipBio.show && hover_btn.tiptext && !lDn) hover_btn.tt.show(hover_btn.tiptext());
			this.transition.start();
		}
		this.cur = hover_btn;
		return this.cur;
	}

	on_script_unload() {
		this.tt('');
	}

	refresh(upd) {
		if (upd) {
			this.scr.x1 = panelBio.sbar.x;
			this.scr.yUp1 = Math.round(panelBio.sbar.y);
			this.scr.yDn1 = Math.round(panelBio.sbar.y + panelBio.sbar.h - uiBio.sbar.but_h);
			if (uiBio.sbar.type < 2) {
				this.scr.x1 -= 1;
				this.scr.x2 = (uiBio.sbar.but_h - uiBio.sbar.but_w) / 2;
				this.scr.yUp2 = -uiBio.sbar.arrowPad + this.scr.yUp1 + (uiBio.sbar.but_h - 1 - uiBio.sbar.but_w) / 2;
				this.scr.yDn2 = uiBio.sbar.arrowPad + this.scr.yDn1 + (uiBio.sbar.but_h - 1 - uiBio.sbar.but_w) / 2;
			}
			this.setLookUpPos();
		}
		this.check();
		if (pptBio.heading) {
			this.btns.heading = new BtnBio(panelBio.heading.x, panelBio.text.t - uiBio.heading.h, panelBio.heading.w - (this.lookUp.pos == 2 ? this.lookUp.sz + (pptBio.hdPos != 2 ? this.lookUp.gap : 10) * $Bio.scale : 0), uiBio.font.heading_h, 6, $Bio.clamp(Math.round(panelBio.text.t - uiBio.heading.h + (uiBio.font.heading_h - this.src.h) / 2 + pptBio.hdBtnPad), panelBio.text.t - uiBio.heading.h, panelBio.text.t - uiBio.heading.h + uiBio.font.heading_h - this.src.h), '', '', '', !pptBio.heading || pptBio.img_only, '', () => {
				if (this.isNextSourceAvailable()) {
					txt.na = '';
					menBio.toggle('', pptBio.artistView ? 'Bio' : 'Rev', '', panelBio.m.x > panelBio.heading.x + panelBio.heading.w / 2 ? 1 : -1);
				} else {
					txt.na = panelBio.m.x > panelBio.heading.x + panelBio.heading.w / 2 ? 'Next N/A: ' : 'Previous N/A: ';
					txt.paint();
					timerBio.clear(timerBio.source);
					timerBio.source.id = setTimeout(() => {
						txt.na = '';
						txt.paint();
						timerBio.source.id = null;
					}, 5000);
				}
				this.check(true);
				if (uiBio.style.isBlur) window.Repaint();
			}, () => this.srcTiptext(), true, 'heading');
			const n = pptBio.artistView ? 'bio' : 'rev';
			this.src.col = {
				normal: txt[n].loaded.ix != 1 || !uiBio.show.btnRedLastfm ? uiBio.style.bg || !uiBio.style.bg && !uiBio.style.trans || uiBio.blur.dark || uiBio.blur.light || uiBio.col.headingBtn !== '' ? uiBio.col.headBtn : RGB(255, 255, 255) : RGB(225, 225, 245),
				hover: txt[n].loaded.ix != 1 || !uiBio.show.btnRedLastfm ? uiBio.style.bg || !uiBio.style.bg && !uiBio.style.trans || uiBio.blur.dark || uiBio.blur.light || uiBio.col.headingBtn !== '' ? uiBio.col.text_h : RGB(255, 255, 255) : RGB(225, 225, 245)
			};
			if (!pptBio.hdPos) {
				this.flag = {
					x: panelBio.heading.x,
					w: Math.round(uiBio.font.heading_h * 0.9)
				};
				this.flag.h = Math.round(this.flag.w * 0.65);
				this.flag.y = panelBio.text.t - uiBio.heading.h + Math.round((uiBio.font.heading_h - this.flag.h) / 2);
				if (uiBio.font.heading_h >= 28 && uiBio.font.heading_h % 2 == 0) this.flag.y++;
				this.flag.sp = Math.round(this.flag.w * 1.42);
			} else this.flag.sp = 0;
		} else delete this.btns.heading;
		if (panelBio.id.lookUp) {
			this.btns.lookUp = new BtnBio(this.lookUp.x, this.lookUp.y, this.lookUp.w, this.lookUp.h, 7, this.lookUp.p1, this.lookUp.p2, '', {
				normal: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 100 : 50),
				hover: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 200 : this.alpha[1])
			}, !panelBio.id.lookUp, '', () => bMenu.load(this.lookUp.x + this.lookUp.p1, this.lookUp.y + this.lookUp.h), () => pref.showTooltipBiography ? `Click: look up...\r\n${!panelBio.id.lyricsSource && !panelBio.id.nowplayingSource ? `Middle click: ${!panelBio.lock ? 'lock: stop track change updates' : 'Unlock'}...` : 'Lock N/A with enabled lyrics or nowplaying sources'}` : '', true, 'lookUp');
		} else delete this.btns.lookUp;
		if (pptBio.summaryShow) {
			this.btns.summary = new Btn(panelBio.text.l, panelBio.text.t, panelBio.text.w, pptBio.artistView ? (txt.line.h.bio * txt.bio.summaryEnd) : (txt.line.h.rev * txt.rev.summaryEnd), 8, this.lookUp.p1, this.lookUp.p2, '', {
				normal: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 100 : 50),
				hover: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 200 : this.alpha[1])
			}, '', '', () => { pptBio.toggle('summaryCompact'); txt.refresh(1); }, '', false, 'summary');
		} else delete this.btns.summary;
		if (pptBio.sbarShow) {
			switch (uiBio.sbar.type) {
				case 2:
					this.btns.alb_scrollUp = new BtnBio(this.scr.x1, this.scr.yUp1, uiBio.sbar.but_h, uiBio.sbar.but_h, 5, '', '', '', {
						normal: 1,
						hover: 2,
						down: 3
					}, pptBio.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(1), '', '', false, 'alb_scrollUp');
					this.btns.alb_scrollDn = new BtnBio(this.scr.x1, this.scr.yDn1, uiBio.sbar.but_h, uiBio.sbar.but_h, 5, '', '', '', {
						normal: 5,
						hover: 6,
						down: 7
					}, pptBio.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(-1), '', '', false, 'alb_scrollDn');
					this.btns.art_scrollUp = new BtnBio(this.scr.x1, this.scr.yUp1, uiBio.sbar.but_h, uiBio.sbar.but_h, 5, '', '', '', {
						normal: 1,
						hover: 2,
						down: 3
					}, pptBio.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(1), '', '', false, 'art_scrollUp');
					this.btns.art_scrollDn = new BtnBio(this.scr.x1, this.scr.yDn1, uiBio.sbar.but_h, uiBio.sbar.but_h, 5, '', '', '', {
						normal: 5,
						hover: 6,
						down: 7
					}, pptBio.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(-1), '', '', false, 'art_scrollDn');
					break;
				default:
					this.btns.alb_scrollUp = new BtnBio(this.scr.x1, this.scr.yUp1 - panelBio.sbar.top_corr, uiBio.sbar.but_h, uiBio.sbar.but_h + panelBio.sbar.top_corr, 1, this.scr.x2, this.scr.yUp2, uiBio.sbar.but_w, '', pptBio.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(1), '', '', false, 'alb_scrollUp');
					this.btns.alb_scrollDn = new BtnBio(this.scr.x1, this.scr.yDn1, uiBio.sbar.but_h, uiBio.sbar.but_h + panelBio.sbar.top_corr, 2, this.scr.x2, this.scr.yDn2, uiBio.sbar.but_w, '', pptBio.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(-1), '', '', false, 'alb_scrollDn');
					this.btns.art_scrollUp = new BtnBio(this.scr.x1, this.scr.yUp1 - panelBio.sbar.top_corr, uiBio.sbar.but_h, uiBio.sbar.but_h + panelBio.sbar.top_corr, 3, this.scr.x2, this.scr.yUp2, uiBio.sbar.but_w, '', pptBio.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(1), '', '', false, 'art_scrollUp');
					this.btns.art_scrollDn = new BtnBio(this.scr.x1, this.scr.yDn1, uiBio.sbar.but_h, uiBio.sbar.but_h + panelBio.sbar.top_corr, 4, this.scr.x2, this.scr.yDn2, uiBio.sbar.but_w, '', pptBio.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(-1), '', '', false, 'art_scrollDn');
					break;
			}
		}
		this.transition = new TransitionBio(this.btns, v => v.state !== 'normal');
	}

	reset() {
		this.transition.stop();
	}

	resetZoom() {
		txt.bio.scrollPos = {};
		txt.rev.scrollPos = {};
		pptBio.zoomFont = 100;
		pptBio.zoomHead = 115;
		this.lookUp.zoomSize = this.lookUp.baseSize;
		this.lookUp.scale = pptBio.zoomLookUpBtn = 100;
		this.lookUp.font = gdi.Font('FontAwesome', scaleForDisplay(18) * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font('FontAwesome', scaleForDisplay(17) * this.lookUp.scale / 100, 0);
		pptBio.zoomHeadBtn = 100;
		pptBio.zoomTooltip = 100;
		uiBio.getFont();
		this.createStars();
		this.createImages('lookUp');
		this.setTooltipFont();
		this.refresh(true);
		txt.refresh(2);
		const n = pptBio.artistView ? 'bio' : 'rev';
		if (txt[n].loaded.txt && txt.reader[n].lyrics) txt.getText();
		initTheme();
		debugLog('initTheme -> Biography -> resetZoom');
	}

	scrollAlb() {
		return pptBio.sbarShow && !pptBio.artistView && !pptBio.img_only && txt.rev.text.length && alb_scrollbar.scrollable_lines > 0 && alb_scrollbar.active && !alb_scrollbar.narrow.show && !txt.lyricsDisplayed();
	}

	scrollArt() {
		return pptBio.sbarShow && pptBio.artistView && !pptBio.img_only && txt.bio.text.length && art_scrollbar.scrollable_lines > 0 && art_scrollbar.active && !art_scrollbar.narrow.show && !txt.lyricsDisplayed();
	}

	setLookUpPos() {
		this.lookUp.pos = pptBio.hdLine == 2 && pptBio.hdPos == 2 ? 0 : uiBio.sbar.type < panelBio.sbar.style || !pptBio.text_only ? panelBio.id.lookUp : 0;
		this.lookUp.x = [0, 1 * $Bio.scale, (!pptBio.heading || pptBio.img_only ? panelBio.w - 1 * $Bio.scale - this.lookUp.sz - 1 : panelBio.heading.x + panelBio.heading.w - this.lookUp.sz) - 9 * $Bio.scale][this.lookUp.pos];
		this.lookUp.y = [0, 0, !pptBio.heading || pptBio.img_only ? /*0*/ 9999 : panelBio.text.t - uiBio.heading.h + (uiBio.font.heading_h - this.lookUp.sz) / 2][this.lookUp.pos];
		this.lookUp.w = [12, this.lookUp.sz * 1.5, panelBio.w - this.lookUp.x][this.lookUp.pos];
		this.lookUp.h = [12, this.lookUp.sz * 1.5, Math.max(uiBio.font.heading_h, this.lookUp.sz)][this.lookUp.pos];
		this.lookUp.p1 = [12, this.lookUp.sz + 1, this.lookUp.sz + 1 + 9 * $Bio.scale][this.lookUp.pos];
		this.lookUp.p2 = this.lookUp.sz + 1;
	}

	setRatingImages(w, h, onCol, offCol, borCol, lfm) {
		const hash = `${w}-${h}-${onCol}-${offCol}-${borCol}-${lfm}`;
		if (hash == this.rating.hash) return;
		else this.rating.hash = hash;
		if (lfm) this.rating.imagesLfm = [];
		if (this.src.icon && uiBio.stars == 1) onCol = onCol & 0xe0ffffff;
		w = w * this.rating.scale;
		h = h * this.rating.scale;
		const star_indent = 2;
		let img = null;
		let real_rating = -1;
		let star_height = h;
		let star_padding = -1;
		let star_size = h;
		while (star_padding <= 0) {
			star_size = star_height;
			star_padding = Math.round((w - 5 * star_size) / 4);
			star_height--;
		}
		const line_thickness = 0;
		const star_vpadding = star_height < h ? Math.floor((h - star_height) / 2) : 0;
		const pts = this.getStarPoints(star_size, star_padding, star_indent, star_vpadding, 10, line_thickness);
		for (let rating = 0; rating < 11; rating++) {
			real_rating = rating / 2;
			if (Math.round(real_rating) != real_rating) {
				const img_off = $Bio.gr(w, h, true, g => {
					for (let i = 0; i < 5; i++) this.drawStar(g, offCol, pts[i], line_thickness);
				});
				const img_on = $Bio.gr(w, h, true, g => {
					for (let i = 0; i < 5; i++) this.drawStar(g, onCol, pts[i], line_thickness);
				});
				const half_mask_left = $Bio.gr(w, h, true, g => {
					g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255));
					g.FillSolidRect(0, 0, Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));
				});
				const half_mask_right = $Bio.gr(w, h, true, g => {
					g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255));
					g.FillSolidRect(Math.round(w * rating / 10), 0, w - Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));
				});
				img_on.ApplyMask(half_mask_left);
				img_off.ApplyMask(half_mask_right);
				img = $Bio.gr(w, h, true, g => {
					g.DrawImage(img_off, 0, 0, w, h, 0, 0, w, h);
					g.DrawImage(img_on, 0, 0, w, h, 0, 0, w, h);
				});
			} else {
				img = $Bio.gr(w, h, true, g => {
					for (let i = 0; i < 5; i++) this.drawStar(g, i < real_rating ? onCol : offCol, pts[i], line_thickness);
				});
			}
			!lfm ? this.rating.images[rating] = img : this.rating.imagesLfm[rating] = img;
		}
		if (!lfm) {
			this.rating.w1 = this.rating.images[10].Width;
			this.rating.w2 = this.rating.w1 / this.rating.scale;
			this.rating.h1 = this.rating.images[10].Height;
			this.rating.h2 = this.rating.h1 / this.rating.scale;
		}
	}

	setSbarIcon() {
		switch (pptBio.sbarButType) {
			case 0:
				this.scr.iconFontName = 'Segoe UI Symbol';
				this.scr.iconFontStyle = 0;
				if (!uiBio.sbar.type) {
					this.scr.arrow = uiBio.sbar.but_w < Math.round(14 * $Bio.scale) ? '\uE018' : '\uE0A0';
					this.scr.pad = uiBio.sbar.but_w < Math.round(15 * $Bio.scale) ? -0.3 : -0.22;
				} else {
					this.scr.arrow = uiBio.sbar.but_w < Math.round(14 * $Bio.scale) ? '\uE018' : '\uE0A0';
					this.scr.pad = uiBio.sbar.but_w < Math.round(14 * $Bio.scale) ? -0.26 : -0.22;
				}
				break;
			case 1:
				this.scr.arrow = 0;
				break;
			case 2:
				this.scr.iconFontName = pptBio.butCustIconFont;
				this.scr.iconFontStyle = 0;
				this.scr.arrow = pptBio.arrowSymbol.charAt().trim();
				if (!this.scr.arrow.length) this.scr.arrow = 0;
				this.scr.pad = $Bio.clamp(pptBio.sbarButPad / 100, -0.5, 0.3);
				break;
		}
	}

	setScrollBtnsHide(set, autoHide) {
		if (autoHide) {
			const arr = autoHide == 'both' ? this.scr.btns : autoHide == 'alb' ? this.scr.albBtns : this.scr.artBtns;
			arr.forEach(v => {
				if (this.btns[v]) this.btns[v].hide = set;
			});
			txt.paint();
		} else {
			if (!pptBio.sbarShow && !set) return;
			this.scr.btns.forEach((v, i) => {
				if (this.btns[v]) this.btns[v].hide = i < 2 ? !this.scrollAlb() : !this.scrollArt();
			});
		}
	}

	setSrcFontSize(step) {
		this.src.fontSize += step;
		const fs = uiBio.stars != 1 ? (this.src.icon ? (this.src.bahnInstalled ? 12 : 11) : 10) * $Bio.scale : (is_4k ? 26 : 14);
		const hs = uiBio.font.heading.Size;
		this.src.fontSize = $Bio.clamp(this.src.fontSize, Math.min(fs, hs), Math.max(fs, hs));
		pptBio.zoomHeadBtn = (this.src.fontSize - Math.round(uiBio.font.heading.Size * 0.47)) * 10 + 100;
	}

	setTooltipFont() {
		tooltipBio.SetFont(uiBio.font.main.Name, uiBio.font.main.Size, uiBio.font.main.Style);
	}

	srcTiptext() {
		const suffix = pref.showTooltipBiography ? this.isNextSourceAvailable() ? 'text' : 'N/A' : '';
		const type = pref.showTooltipBiography ? panelBio.m.x > panelBio.heading.x + panelBio.heading.w / 2 ? 'Next ' : 'Previous ' : '';
		return this.src.visible && this.trace_src(panelBio.m.x, panelBio.m.y) || !butBio.tooltipBio.name ? `${type}${suffix}` : butBio.tooltipBio.name.replace(/&/g, '&&');
	}

	trace(btn, x, y) {
		const o = this.btns[btn];
		return o && o.trace(x, y);
	}

	trace_src(x, y) {
		if (!pptBio.hdBtnShow || pptBio.hdPos == 2) return false;
		return x > this.src.x && x < this.src.x + this.src.w && y > panelBio.text.t - uiBio.heading.h && y < panelBio.text.t - uiBio.heading.h + uiBio.font.heading_h;
	}

	tt(n, force) {
		if (tooltipBio.Text !== n || force) {
			tooltipBio.Text = n;
			tooltipBio.SetMaxWidth(scaleForDisplay(pref.layout !== 'default' ? 600 : 800));
			tooltipBio.Activate();
		}
	}

	wheel(step) {
		if (!this.trace('lookUp', panelBio.m.x, panelBio.m.y)) return;
		this.lookUp.zoomSize += step;
		this.lookUp.zoomSize = $Bio.clamp(this.lookUp.zoomSize, 7, 100);
		const o = this.btns.lookUp;
		window.RepaintRect(0, o.y, panelBio.w, o.h);
		this.lookUp.scale = Math.round(this.lookUp.zoomSize / this.lookUp.baseSize * 100);
		this.lookUp.font = gdi.Font('FontAwesome', scaleForDisplay(18) * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font('FontAwesome', scaleForDisplay(17) * this.lookUp.scale / 100, 0);
		this.createImages('lookUp');
		this.refresh(true);
		pptBio.zoomLookUpBtn = this.lookUp.scale;
	}
}

class BtnBio {
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
		this.tt = new TooltipBio();
		this.tiptext = tiptext;
		this.hand = hand;
		this.name = name;
		this.transition_factor = 0;
		this.state = 'normal';
	}

	// Methods

	cs(state) {
		this.state = state;
		if (state === 'down' || state === 'normal') this.tt.clear();
		this.repaint();
	}

	draw(gr) {
		switch (this.type) {
			case 5:
				uiBio.theme.SetPartAndStateID(1, this.item[this.state]);
				uiBio.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
				break;
			case 6:
				this.drawHeading(gr);
				break;
			case 7:
				this.drawLookUp(gr);
				break;
			default:
				this.drawScrollBtn(gr);
				break;
		}
	}

	drawHeading(gr) {
		const n = pptBio.artistView ? 'bio' : 'rev';
		const flag = txt[n].flag;
		let dh;
		let dx1;
		let dx2;
		const dw = this.w + (butBio.lookUp.pos == 2 ? butBio.lookUp.sz + (pptBio.hdLine != 2 ? butBio.lookUp.gap : 10) * $Bio.scale : 0);
		let spacer = 0;
		if (pptBio.hdPos != 2) {
			if (!pptBio.hdBtnShow || pptBio.hdPos == 1) {
				dh = pptBio.hdPos == 1 ? (butBio.rating.show || butBio.src.text ? (pptBio.hdPos != 1 && uiBio.show.btnBg ? '' : (pptBio.hdLine != 2 ? '  ' : ' ')) : '') + txt.na + txt.heading : txt.na + txt.heading;
				dx1 = this.x + butBio.src.w;
				dx2 = butBio.src.x = this.x;
			} else {
				dh = txt.na + txt.heading;
				dx1 = this.x;
				dx2 = butBio.src.x = this.x + this.w - butBio.src.w;
			}
		} else dh = txt.na + txt.heading;
		dh = dh.trim();

		switch (true) {
			case pptBio.hdLine == 1:
				gr.DrawLine(this.x, this.y + uiBio.heading.line_y, this.x + dw - 1, this.y + uiBio.heading.line_y, uiBio.style.l_w, uiBio.col.bottomLine);
				break;
			case pptBio.hdLine == 2:
				if (pptBio.hdPos != 2) {
					const src_w = butBio.src.w + (butBio.lookUp.pos == 2 ? butBio.lookUp.sz + (pptBio.hdBtnShow || pptBio.hdPos == 1 ? 10 * $Bio.scale : 0) : 0);
					const dh_w = gr.CalcTextWidth(dh, uiBio.font.heading) + butBio.src.item_w.space * (pptBio.hdPos != 1 || dh ? 2 : 0) + (pptBio.hdPos == 1 && butBio.lookUp.pos == 2 ? butBio.lookUp.sz + 10 * $Bio.scale : 0);
					if (!pptBio.hdPos && dh_w < dw - src_w - butBio.src.item_w.space * (pptBio.hdPos != 2 || !butBio.src.visible ? 3 : 1)) {
						gr.DrawLine(this.x + dh_w + (flag ? butBio.flag.sp : 0), Math.round(this.y + this.h / 2), this.x + dw - src_w - butBio.src.item_w.space * 3, Math.round(this.y + this.h / 2), uiBio.style.l_w, uiBio.col.centerLine);
					}
					else if ((!pptBio.hdBtnShow || pptBio.hdPos != 0) && src_w + butBio.src.item_w.space * 2 + dh_w < dw) {
						gr.DrawLine(dx1 + (butBio.src.visible ? butBio.src.item_w.space * (!uiBio.show.btnBg ? 2 : 3) : pptBio.hdPos == 1 ? 0 : dh_w), Math.ceil(this.y + this.h / 2), this.x + dw - (pptBio.hdBtnShow ? dh_w : pptBio.hdPos == 1 ? dh_w : 0), Math.ceil(this.y + this.h / 2), uiBio.style.l_w, uiBio.col.centerLine);
					} else if (butBio.src.visible) {
						spacer = butBio.src.item_w.space * (!uiBio.show.btnBg ? 2 : 3);
						dx1 += spacer;
					}
				} else {
					const dh_w = gr.CalcTextWidth(dh, uiBio.font.heading) + butBio.src.item_w.space * 4;
					const ln_l = (dw - dh_w) / 2;
					if (ln_l > 1) {
						gr.DrawLine(this.x, Math.ceil(this.y + this.h / 2), this.x + ln_l, Math.ceil(this.y + this.h / 2), uiBio.style.l_w, uiBio.col.centerLine);
						gr.DrawLine(this.x + ln_l + dh_w, Math.ceil(this.y + this.h / 2), this.x + dw, Math.ceil(this.y + this.h / 2), uiBio.style.l_w, uiBio.col.centerLine);
					}
				}
				break;
		}
		if (flag) {
			gr.SetInterpolationMode(7);
			if (!pptBio.hdPos) {
				const w = uiBio.style.l_w;
				const o = Math.floor(w / 2);
				gr.DrawImage(flag, butBio.flag.x, butBio.flag.y, butBio.flag.w, butBio.flag.h, 0, 0, flag.Width, flag.Height, '', 212);
				// gr.DrawRect(butBio.flag.x + o, butBio.flag.y + o, butBio.flag.w - w, butBio.flag.h - w + 1, w, uiBio.col.imgBor);
			}
			gr.SetInterpolationMode(2);
			const h_x = (pptBio.hdPos != 2 ? dx1 : this.x) + butBio.flag.sp;
			const h_w = (pptBio.hdPos != 2 ? this.w - spacer - butBio.src.w - (!pptBio.hdPos ? 10 : 0) : this.w - spacer) - butBio.flag.sp;
			gr.GdiDrawText(dh, uiBio.font.heading, uiBio.col.headingText, h_x, this.y, h_w, this.h, pptBio.hdPos != 2 ? txt.c[pptBio.hdPos] : txt.cc);
			butBio.tooltipBio.name = gr.CalcTextWidth(dh, uiBio.font.heading) > h_w ? dh : '';
			butBio.tooltipBio.x = h_x;
			butBio.tooltipBio.w = h_w;
		} else {
			const h_x = (pptBio.hdPos != 2 ? dx1 : this.x);
			const h_w = pptBio.hdPos != 2 ? this.w - spacer - butBio.src.w - (!pptBio.hdPos ? 10 : 0) : this.w - spacer;
			gr.GdiDrawText(dh, uiBio.font.heading, uiBio.col.headingText, (pptBio.hdPos != 2 ? dx1 : this.x), this.y, pptBio.hdPos != 2 ? this.w - spacer - butBio.src.w - (!pptBio.hdPos ? 10 : 0) : this.w - spacer, this.h, pptBio.hdPos != 2 ? txt.c[pptBio.hdPos] : txt.cc);
			butBio.tooltipBio.name = gr.CalcTextWidth(dh, uiBio.font.heading) > h_w ? dh : '';
			butBio.tooltipBio.x = h_x;
			butBio.tooltipBio.w = h_w;
		}
		if (!butBio.src.visible) return;
		let col;
		if (uiBio.show.btnBg) {
			gr.SetSmoothingMode(2);
			if (txt[n].loaded.ix != 1 || !uiBio.show.btnRedLastfm) {
				if (this.state !== 'down') gr.FillRoundRect(dx2, this.p1 - (butBio.src.pxShift ? 1 : 0), butBio.src.w, butBio.src.h + (butBio.src.pxShift ? 2 : 0), 2, 2, RGBA(uiBio.col.blend4[0], uiBio.col.blend4[1], uiBio.col.blend4[2], uiBio.col.blend4[3] * (1 - this.transition_factor)));
				col = this.state !== 'down' ? uiBio.getBlend(uiBio.col.blend2, uiBio.col.blend1, this.transition_factor) : uiBio.col.blend2;
				gr.FillRoundRect(dx2, this.p1 - (butBio.src.pxShift ? 1 : 0), butBio.src.w, butBio.src.h + (butBio.src.pxShift ? 2 : 0), 2, 2, col);
				gr.DrawRoundRect(dx2, this.p1 - (butBio.src.pxShift ? 1 : 0), butBio.src.w, butBio.src.h + (butBio.src.pxShift ? 2 : 0), 2, 2, uiBio.style.l_w, uiBio.col.blend3);
			} else {
				gr.FillRoundRect(dx2, this.p1 - (butBio.src.pxShift ? 1 : 0), butBio.src.w, butBio.src.h + (butBio.src.pxShift ? 2 : 0), 2, 2, RGBA(210, 19, 9, 114));
				col = this.state !== 'down' ? uiBio.getBlend(RGBA(244, 31, 19, 255), RGBA(210, 19, 9, 228), this.transition_factor) : RGBA(244, 31, 19, 255);
				gr.FillRoundRect(dx2, this.p1 - (butBio.src.pxShift ? 1 : 0), butBio.src.w, butBio.src.h + (butBio.src.pxShift ? 2 : 0), 2, 2, col);
			}
		}
		col = this.state !== 'down' ? uiBio.getBlend(butBio.src.col.hover, butBio.src.col.normal, this.transition_factor) : butBio.src.col.hover;
		switch (butBio.src.icon) {
			case 0:
				gr.GdiDrawText(butBio.src.name, butBio.src.font, uiBio.col.headingText, dx2, this.p1, butBio.src.w, butBio.src.h, !butBio.rating.show ? txt.cc : txt.c[0]);
				break;
			case 1: {
				let iconFont = false;
				iconFont = !pptBio.lockBio || pptBio.sourceAll ? txt[n].loaded.ix == 1 || txt[n].loaded.ix == 2 : pptBio[`source${n}`] == 1 || pptBio[`source${n}`] == 2;
				gr.GdiDrawText(butBio.src.name, !iconFont ? butBio.src.font : butBio.src.iconFont, col, dx2, this.p1 + (!iconFont ? 0 : butBio.src.y), butBio.src.w, butBio.src.h, !butBio.rating.show ? txt.cc : txt.c[0]);
				break;
			}
		}
		if (butBio.rating.show) {
			const rating = txt.rev.loaded.am ? txt.rating.am : txt.rating.lfm;
			const ratingImg = !uiBio.show.btnRedLastfm || txt.rev.loaded.am ? butBio.rating.images[rating] : butBio.rating.imagesLfm[rating];
			if (ratingImg) gr.DrawImage(ratingImg, !pptBio.hdPos ? this.x + this.w - spacer - butBio.rating.w2 - (uiBio.show.btnBg ? butBio.src.item_w.space : 0) + scaleForDisplay(4) : dx2 + butBio.src.name_w, this.p1 + (Math.round(butBio.src.h - butBio.rating.h2) / 2), butBio.rating.w2, butBio.rating.h2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
		}
	}

	drawLookUp(gr) {
		// const col = this.state !== 'down' ? uiBio.getBlend(this.item.hover, this.item.normal, this.transition_factor) : this.item.hover;
		const col = uiBio.col.headingText;
		gr.SetTextRenderingHint(3); // AntiAliasGridFit
		if (!panelBio.lock) {
			gr.DrawString(!panelBio.style.moreTags || !pptBio.artistView ? '\uF107' : '\uF107', butBio.lookUp.font, col, this.x - (is_4k ? 1 : 0), this.y + scaleForDisplay(1), this.p1, this.p2, StringFormat(2, 0));
			gr.DrawString(!panelBio.style.moreTags || !pptBio.artistView ? '\uF107' : '\uF107', butBio.lookUp.font, col, this.x - (is_4k ? 1 : 0), this.y + scaleForDisplay(1), this.p1, this.p2, StringFormat(2, 0));
			if (this.state == 'hover') gr.DrawString(!panelBio.style.moreTags || !pptBio.artistView ? '\uF107' : '\uF107', butBio.lookUp.font, col, this.x, this.y + scaleForDisplay(1), this.p1, this.p2, StringFormat(2, 0));
		} else {
			gr.DrawString('\uF023', butBio.lookUp.fontLock, col, this.x, this.y + 2 * $Bio.scale, this.p1, this.p2, StringFormat(2, 0));
		}
	}

	drawScrollBtn(gr) {
		const a = this.state !== 'down' ? Math.min(butBio.alpha[0] + (butBio.alpha[1] - butBio.alpha[0]) * this.transition_factor, butBio.alpha[1]) : butBio.alpha[2];
		// if (this.state !== 'normal' && uiBio.sbar.type == 1) gr.FillSolidRect(panelBio.sbar.x, this.y, uiBio.sbar.w, this.h, butBio.scr.hover);
		if (butBio.scr.img) gr.DrawImage(butBio.scr.img, this.x + this.p1, this.p2, this.p3, this.p3, 0, 0, butBio.scr.img.Width, butBio.scr.img.Height, this.type == 1 || this.type == 3 ? 0 : 180, a);
	}

	lbtn_dn(x, y) {
		if (!butBio.Dn) return;
		this.l_dn && this.l_dn(x, y);
	}

	lbtn_up(x, y) {
		if (panelBio.isTouchEvent(x, y)) return;
		if (this.l_up) this.l_up();
	}

	repaint() {
		const expXY = 2;
		const expWH = 4;
		window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
	}

	trace(x, y) {
		butBio.traceBtn = !this.hide && x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
		if (this.name == 'summary' && (pptBio.artistView && art_scrollbar.delta > txt.line.h.bio * txt.bio.summaryEnd || !pptBio.artistView && alb_scrollbar.delta > txt.line.h.rev * txt.rev.summaryEnd)) butBio.traceBtn = false;
		return butBio.traceBtn;
	}
}

class TooltipBio {
	constructor() {
		this.id = Math.ceil(Math.random().toFixed(8) * 1000);
		this.tt_timer = new TooltipTimerBio();
	}

	// Methods

	clear() {
		styledTooltipReady = false;
		this.tt_timer.stop(this.id);
	}

	show(text) {
		if (Date.now() - butBio.tooltipBio.start > 2000) this.showDelayed(text);
		else this.showImmediate(text);
		butBio.tooltipBio.start = Date.now();
	}

	showDelayed(text) {
		styledTooltipText = text;
		styledTooltipReady = true;
		if (!pref.showStyledTooltips) {
			this.tt_timer.start(this.id, text);
		}
	}

	showImmediate(text) {
		styledTooltipText = text;
		styledTooltipReady = true;
		if (!pref.showStyledTooltips) {
			this.tt_timer.set_id(this.id);
			this.tt_timer.stop(this.id);
			butBio.tt(text);
		}
	}

	stop() {
		styledTooltipReady = false;
		this.tt_timer.forceStop();
	}
}

class TooltipTimerBio {
	constructor() {
		this.delay_timer;
		this.tt_caller = undefined;
	}

	// Methods

	forceStop() {
		butBio.tt('');
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
		if (!this.delay_timer && tooltipBio.Text) butBio.tt(text, old_caller !== this.tt_caller);
		else {
			this.forceStop();
			if (!this.delay_timer) {
				this.delay_timer = setTimeout(() => {
					butBio.tt(text);
					this.delay_timer = null;
				}, 500);
			}
		}
	}

	stop(id) {
		if (this.tt_caller === id) this.forceStop();
	}
}

class TransitionBio {
	constructor(items, hover) {
		this.hover = hover;
		this.items = items;
		this.transition_timer = null;
	}

	// Methods

	start() {
		const hover_in_step = 0.2;
		const hover_out_step = 0.06;
		if (!this.transition_timer) {
			this.transition_timer = setInterval(() => {
				Object.values(this.items).forEach(v => {
					const saved = v.transition_factor;
					v.transition_factor = this.hover(v) ? Math.min(1, v.transition_factor += hover_in_step) : Math.max(0, v.transition_factor -= hover_out_step);
					if (saved !== v.transition_factor) v.repaint();
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
