'use strict';

class BioButtons {
	constructor() {
		this.alpha = 255;
		this.btns = {};
		this.cur = null;
		this.Dn = false;
		this.fbv1 = fb.Version.startsWith('1');
		this.traceBtn = false;
		this.transition;

		this.flag = {
			x: bio.panel.heading.x,
			h: Math.round(bio.ui.font.heading_h * 0.56)
		};
		this.flag.y = bio.panel.text.t - bio.ui.heading.h + Math.round((bio.ui.font.heading_h - this.flag.h) / 2);

		this.lookUp = {
			baseSize: 15 * $Bio.scale,
			col: $Bio.toRGB(bio.ui.col.text),
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
			pad: $Bio.clamp(bioSet.sbarButPad / 100, -0.5, 0.3)
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
			show: grSet.showTooltipBiography || grSet.showTooltipTruncated,
			start: Date.now() - 2000,
			x: 0,
			w: 100
		};

		this.lookUp.zoomSize = Math.max(Math.round(this.lookUp.baseSize * bioSet.zoomLookUpBtn / 100), 7);
		this.lookUp.scale = Math.round(this.lookUp.zoomSize / this.lookUp.baseSize * 100);
		this.lookUp.font = gdi.Font(grFont.fontRebornSymbols, SCALE(18) * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font(grFont.fontRebornSymbols, SCALE(17) * this.lookUp.scale / 100, 0);

		this.scr.btns = this.scr.albBtns.concat(this.scr.artBtns);
		this.src.iconFont = this.src.font;
		if (bio.ui.stars == 1 && bio.ui.show.btnRedLastfm) this.rating.imagesLfm = [];

		bioSet.zoomLookUpBtn = this.lookUp.scale;

		this.setSbarIcon();
		this.createImages('all');
	}

	// * METHODS * //

	check(refresh) {
		if (!refresh) {
			(bioSet.sbarShow != 1 || !this.scr.init) && !bio.txt.lyricsDisplayed() ? this.setScrollBtnsHide() : this.setScrollBtnsHide(true, 'both');
		}
		this.rating.show = bio.ui.stars == 1 && !bioSet.artistView && (bio.txt.rev.loaded.am && bio.txt.rating.am != -1 || bio.txt.rev.loaded.lfm && bio.txt.rating.lfm != -1);
		this.src.name = bio.ui.show.btnBg ? ' ' : '';
		switch (true) {
			case !bioSet.artistView: {
				const ix = bio.txt.rev.loaded.ix == -1 ? bioSet.sourcerev : bio.txt.rev.loaded.ix;
				this.src.name += [this.src.amRev, this.src.lfmRev, this.src.wikiRev, this.src.txtRev][ix];
				break;
			}
			case bioSet.artistView: {
				const ix = bio.txt.bio.loaded.ix == -1 ? bioSet.sourcebio : bio.txt.bio.loaded.ix;
				this.src.name += [this.src.amBio, this.src.lfmBio, this.src.wikiBio, this.src.txtBio][ix];
				break;
			}
		}
		this.src.name += bio.ui.show.btnBg || this.rating.show ? ' ' : '';
		this.src.text = bioSet.heading && this.btns.heading && bioSet.hdBtnShow && (!!(this.src.icon || this.src.name.trim().length));
		if (!this.btns.heading || !bioSet.heading) return;
		this.src.visible = bioSet.hdBtnShow && (this.rating.show || this.src.text) && bioSet.hdPos != 2;
		if (!this.src.visible) this.src.w = 0;
		else {
			this.src.name_w = 0;
			if (this.rating.show) this.src.name_w = bio.txt.rev.loaded.am ? this.src.item_w.amRev : this.src.item_w.lfmRev;
			this.src.name_w = this.src.name_w + this.src.item_w.space * (bio.ui.show.btnBg ? (this.src.name_w ? 2 : 1) : 0);
			this.src.w = 0;
			switch (true) {
				case this.rating.show:
					this.src.w = this.src.name_w + this.rating.w2 + (this.src.text || bio.ui.show.btnBg ? this.src.item_w.space : 0);
					break;
				case this.src.text:
					switch (true) {
						case !bioSet.artistView: {
							const ix = bio.txt.rev.loaded.ix == -1 ? bioSet.sourcerev : bio.txt.rev.loaded.ix;
							this.src.w = [this.src.item_w.amRev, this.src.item_w.lfmRev, this.src.item_w.wikiRev, this.src.item_w.txtRev][ix];
							break;
						}
						case bioSet.artistView: {
							const ix = bio.txt.bio.loaded.ix == -1 ? bioSet.sourcebio : bio.txt.bio.loaded.ix;
							this.src.w = [this.src.item_w.amBio, this.src.item_w.lfmBio, this.src.item_w.wikiBio, this.src.item_w.txtBio][ix];
							break;
						}
					}
					this.src.w += this.src.item_w.space * (bio.ui.show.btnBg ? 2 : 0);
					break;
			}
			if (!bio.ui.show.btnBg) this.src.name_w += this.src.item_w.space * (this.src.text ? 2 : 0);
		}
	}

	checkScrollBtns(x, y, hover_btn) {
		const arr = bio.alb_scrollbar.timer_but ? this.scr.albBtns : bio.art_scrollbar.timer_but ? this.scr.artBtns : false;
		if (arr) {
			if ((this.btns[arr[0]].down || this.btns[arr[1]].down) && !this.btns[arr[0]].trace(x, y) && !this.btns[arr[1]].trace(x, y)) {
				this.btns[arr[0]].cs('normal');
				this.btns[arr[1]].cs('normal');
				if (bio.alb_scrollbar.timer_but) {
					clearTimeout(bio.alb_scrollbar.timer_but);
					bio.alb_scrollbar.timer_but = null;
					bio.alb_scrollbar.count = -1;
				}
				if (bio.art_scrollbar.timer_but) {
					clearTimeout(bio.art_scrollbar.timer_but);
					bio.art_scrollbar.timer_but = null;
					bio.art_scrollbar.count = -1;
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
		if (!bioTooltip.Text || !this.btns.lookUp.tt) return;
		this.btns.lookUp.tt.stop();
	}

	createImages(n) {
		if (n == 'all') {
			const sz = this.scr.arrow == 0 ? Math.max(Math.round(bio.ui.sbar.but_h * 1.666667), 1) : 100;
			const sc = sz / 100;
			const iconFont = gdi.Font(this.scr.iconFontName, sz, this.scr.iconFontStyle);
			this.alpha = !bio.ui.sbar.col ? [180, 220, 255] : [180, 220, 255];
			const hovAlpha = (!bio.ui.sbar.col ? 75 : (!bio.ui.sbar.type ? 68 : 51)) * 0.4;
			this.scr.hover = bioSet.sbarType == 3 ? RGBA(55, 55, 55, 255) : !bio.ui.sbar.col ? RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, hovAlpha) : bio.ui.col.text & RGBA(255, 255, 255, hovAlpha);
			this.scr.img = $Bio.gr(sz, sz, true, g => {
				g.SetTextRenderingHint(3);
				g.SetSmoothingMode(2);
				if (bioSet.sbarType == 3) {
					g.DrawString(this.scr.arrow, iconFont, RGBA(103, 103, 103, 255), 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				} else if (bioSet.sbarCol) {
					this.scr.arrow == 0 ? g.FillPolygon(bio.ui.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(this.scr.arrow, iconFont, bio.ui.col.text, 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				} else {
					this.scr.arrow == 0 ? g.FillPolygon(RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(this.scr.arrow, iconFont, RGBA(bio.ui.col.t, bio.ui.col.t, bio.ui.col.t, 255), 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				}
				g.SetSmoothingMode(0);
			});
		}
		if (n == 'all' || n == 'lookUp') {
			this.lookUp.col = $Bio.toRGB(bio.ui.col.text);
			$Bio.gr(1, 1, false, g => {
				this.lookUp.sz = Math.max(g.CalcTextWidth(RebornSymbols.AngleDown, this.lookUp.font), g.CalcTextWidth(RebornSymbols.Lock, this.lookUp.fontLock), g.CalcTextHeight(RebornSymbols.AngleDown, this.lookUp.font), g.CalcTextHeight(RebornSymbols.Lock, this.lookUp.fontLock));
			});
		}
	}

	createStars(force) {
		this.src.icon = bio.ui.show.btnLabel == 2 ? 1 : 0;
		const hs = bio.ui.font.heading.Size;
		const fs = bio.ui.stars != 1 ? (this.src.icon ? (this.src.bahnInstalled ? 12 : 11) : 10) * $Bio.scale : HD_4K(14, 26);
		const srcFontSize = this.src.fontSize;
		const biographyFontSize = SCALE((RES._4K ? grSet.biographyFontSize_layout - 0 : grSet.biographyFontSize_layout) || 14);
		this.src.fontSize = $Bio.clamp(Math.round(hs * 1.0) + (bioSet.zoomHeadBtn - 100) / 10, Math.min(fs, hs), Math.max(fs, hs));
		if (this.src.fontSize != srcFontSize || force) this.src.font = gdi.Font('Segoe UI', this.src.fontSize, 1);
		$Bio.gr(1, 1, false, g => {
			this.src.h = g.CalcTextHeight('allmusic', this.src.font);
			switch (this.src.icon) {
				case 0:
					this.src.amBio = bioCfg.amDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.amRev = bioCfg.amDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.lfmBio = bioCfg.lfmDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.lfmRev = bioCfg.lfmDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.wikiBio = bioCfg.wikiDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.wikiRev = bioCfg.wikiDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.txtBio = (bio.txt.bio.subhead.txt[0] || '').toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.txtRev = (bio.txt.rev.subhead.txt[0] || '').toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					if (!bio.ui.show.btnLabel) {
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
					this.src.amBio = this.src.amRev = bioCfg.amDisplayName.toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.lfmBio = this.src.lfmRev = `${RebornSymbols.Lastfm}${!bioSet.sourceAll ? '' : '... '}`;
					this.src.wikiBio = this.src.wikiRev = `${RebornSymbols.Wikipedia}${!bioSet.sourceAll ? '' : '... '}`;
					this.src.txtBio = (bio.txt.bio.subhead.txt[0] || '').toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					this.src.txtRev = (bio.txt.rev.subhead.txt[0] || '').toLowerCase() + (!bioSet.sourceAll ? '' : '... ');
					if (this.src.fontSize != srcFontSize || force) {
						this.src.font = gdi.Font(bio.ui.font.heading.Name, Math.max(Math.round(bio.ui.font.headingBaseSize * bio.ui.font.zoomSize / (biographyFontSize) * (100 + ((bioSet.zoomHead - 100) / bio.ui.font.boldAdjust)) / 100), 6), bio.ui.font.headingStyle); // gdi.Font(this.src.bahnInstalled ? this.src.bahn : 'Segoe UI Semibold', this.src.fontSize, 0);
						this.src.iconFont = gdi.Font(grFont.fontRebornSymbols, Math.round(this.src.fontSize * (this.src.bahnInstalled ? 1.09 : 1.16)), 0);
					}
					const alt_w = [];
					alt_w[9] = ' ';
					const fonts = [this.src.font, this.src.font, this.src.iconFont, this.src.iconFont, this.src.font, this.src.font, this.src.iconFont, this.src.iconFont, this.src.font, this.src.iconFont];
					['space', 'amRev', 'lfmRev', 'wikiRev', 'txtRev', 'amBio', 'lfmBio', 'wikiBio', 'txtBio', 'spaceIconFont'].forEach((v, i) => {
						this.src.item_w[v] = g.CalcTextWidth(i < 9 ? this.src[v] : alt_w[i], fonts[i], true);
					});
					this.src.item_w.space = Math.max(this.src.item_w.space, this.src.item_w.spaceIconFont);
					const n = bioSet.artistView ? 'bio' : 'rev';
					this.src.y = this.src.fontSize < 12 || bio.txt[n].loaded.ix == 2 ? 1 : 0;
					break;
				}
			}
		});
		if (bio.ui.stars == 1) this.setRatingImages(Math.round(this.src.h / 1.3) * 5, Math.round(this.src.h / 1.3), bio.ui.col.starOn, bio.ui.col.starOff, bio.ui.col.starBor, false);
		else if (bio.ui.stars == 2) {
			this.setRatingImages(Math.round(bio.ui.font.main_h / 1.75) * 5, Math.round(bio.ui.font.main_h / 1.75), bio.ui.col.starOn, bio.ui.col.starOff, bio.ui.col.starBor, false);
		}
		if (bio.ui.stars == 1 && bio.ui.show.btnRedLastfm) this.setRatingImages(Math.round(this.src.h / 1.5) * 5, Math.round(this.src.h / 1.5), RGBA(225, 225, 245, 255), RGBA(225, 225, 245, 60), bio.ui.col.starBor, true);

		this.src.pxShift = Regex.UtilFontDescenders.test(this.src.amRev + this.src.lfmRev + this.src.wikiRev + this.src.txtRev + this.src.amBio + this.src.lfmBio + this.src.wikiBio + this.src.txtBio);
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
		let n = bioSet.artistView ? 'Bio' : 'Rev';
		if (bioSet.lockBio && !bioSet.sourceAll) return true;
		n = bioSet.artistView ? 'bio' : 'rev';
		const types = bio.txt[n].reader && bio.panel.stndItem() ? $Bio.source.amLfmWikiTxt : $Bio.source.amLfmWiki;
		let found = 0;
		return types.some(type => {
			if (bio.txt[n][type]) found++;
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
		if (hover_btn) {
			grm.ui.styledTooltipText = grSet.showTooltipBiography && typeof hover_btn.tiptext === 'function' ? hover_btn.tiptext() : '';
			hand = hover_btn.hand;
		}
		if (!bio.resize.down) SetCursor(!hand && !bio.seeker.hand && !bio.filmStrip.hand ? 'Arrow' : 'Hand');
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
			this.scr.x1 = bio.panel.sbar.x;
			this.scr.yUp1 = Math.round(bio.panel.sbar.y);
			this.scr.yDn1 = Math.round(bio.panel.sbar.y + bio.panel.sbar.h - bio.ui.sbar.but_h);

			if (bio.ui.sbar.type != 2) {
				this.scr.x1 -= 1;
				this.scr.x2 = (bio.ui.sbar.but_h - bio.ui.sbar.but_w) / 2;
				this.scr.yUp2 = -bio.ui.sbar.arrowPad + this.scr.yUp1 + (bio.ui.sbar.but_h - 1 - bio.ui.sbar.but_w) / 2;
				this.scr.yDn2 = bio.ui.sbar.arrowPad + this.scr.yDn1 + (bio.ui.sbar.but_h - 1 - bio.ui.sbar.but_w) / 2;
			}
			this.setLookUpPos();
		}
		const n = bioSet.artistView ? 'bio' : 'rev';
		this.check();
		if (bioSet.heading) {
			this.btns.heading = new BioBtn(bio.panel.heading.x, bio.panel.text.t - bio.ui.heading.h, bio.panel.heading.w - (this.lookUp.pos == 2 ? this.lookUp.sz + (bioSet.hdPos != 2 ? this.lookUp.gap : 10) * $Bio.scale : 0), bio.ui.font.heading_h, 6, $Bio.clamp(Math.round(bio.panel.text.t - bio.ui.heading.h + (bio.ui.font.heading_h - this.src.h) / 2 + bioSet.hdBtnPad), bio.panel.text.t - bio.ui.heading.h, bio.panel.text.t - bio.ui.heading.h + bio.ui.font.heading_h - this.src.h), '', '', '', !bioSet.heading || bioSet.img_only, '', () => {
				if (this.isNextSourceAvailable()) {
					bio.txt.na = '';
					bio.men.toggle('', bioSet.artistView ? 'Bio' : 'Rev', '', bio.panel.m.x > bio.panel.heading.x + bio.panel.heading.w / 2 ? 1 : -1);
				} else {
					bio.txt.na = bio.panel.m.x > bio.panel.heading.x + bio.panel.heading.w / 2 ? 'Next N/A: ' : 'Previous N/A: ';
					bio.txt.paint();
					bio.timer.clear(bio.timer.source);
					bio.timer.source.id = setTimeout(() => {
						bio.txt.na = '';
						bio.txt.paint();
						bio.timer.source.id = null;
					}, 5000);
				}
				this.check(true);
				if (bio.ui.style.isBlur) window.Repaint();
			}, () => this.srcTiptext(), true, 'heading');
			this.src.col = {
				normal: bio.txt[n].loaded.ix != 1 || !bio.ui.show.btnRedLastfm ? bio.ui.style.bg || !bio.ui.style.bg && !bio.ui.style.trans || bio.ui.blur.dark || bio.ui.blur.light || bio.ui.col.headingBtn !== '' ? bio.ui.col.headBtn : RGB(255, 255, 255) : RGB(225, 225, 245),
				hover: bio.txt[n].loaded.ix != 1 || !bio.ui.show.btnRedLastfm ? bio.ui.style.bg || !bio.ui.style.bg && !bio.ui.style.trans || bio.ui.blur.dark || bio.ui.blur.light || bio.ui.col.headingBtn !== '' ? bio.ui.col.text_h : RGB(255, 255, 255) : RGB(225, 225, 245)
			};
			if (!bioSet.hdPos) {
				this.flag = {
					x: bio.panel.heading.x,
					h: Math.round(bio.ui.font.heading_h * 0.56)
				};
				this.flag.y = bio.panel.text.t - bio.ui.heading.h + Math.round((bio.ui.font.heading_h - this.flag.h) / 2);
				if (bio.ui.font.heading_h >= 28 && bio.ui.font.heading_h % 2 == 0) this.flag.y++;
			} else this.flag.sp = 0;
		} else delete this.btns.heading;
		if (bio.panel.id.lookUp) {
			this.btns.lookUp = new BioBtn(this.lookUp.x, this.lookUp.y, this.lookUp.w, this.lookUp.h, 7, this.lookUp.p1, this.lookUp.p2, '', {
				normal: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 100 : 50),
				hover: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 200 : this.alpha[1])
			}, !bio.panel.id.lookUp, '', () => bioBMenu.load(this.lookUp.x + this.lookUp.p1, this.lookUp.y + this.lookUp.h), () => grSet.showTooltipBiography ? `Click: look up...\r\n${!bio.panel.id.lyricsSource && !bio.panel.id.nowplayingSource ? `Middle click: ${!bio.panel.lock ? 'lock: stop track change updates' : 'Unlock'}...` : 'Lock N/A with enabled lyrics or nowplaying sources'}` : '', true, 'lookUp');
		} else delete this.btns.lookUp;
		if (bioSet.summaryShow) {
			const hide = bio.txt[n].loaded.txt && (bio.txt.reader[n].lyrics || bio.txt.reader[n].props || bio.txt.reader[n].nowplaying) || bioSet.img_only;
			this.btns.summary = new BioBtn(bio.panel.text.l, bio.panel.text.t, bio.panel.text.w,
			bioSet.artistView ? (bio.txt.line.h.bio * bio.txt.bio.summaryEnd) : (bio.txt.line.h.rev * bio.txt.rev.summaryEnd), 8, this.lookUp.p1, this.lookUp.p2, '', {
				normal: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 100 : 50),
				hover: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 200 : this.alpha[1])
			}, hide, '', () => { bioSet.toggle('summaryCompact'); bio.txt.refresh(1); }, '', false, 'summary');
		} else delete this.btns.summary;
		if (bioSet.sbarShow) {
			switch (bioSet.sbarType) {
				case 2:
					this.btns.alb_scrollUp = new BioBtn(this.scr.x1, this.scr.yUp1, bio.ui.sbar.but_h, bio.ui.sbar.but_h, 5, '', '', '', {
						normal: 1,
						hover: 2,
						down: 3
					}, bioSet.sbarShow == 1 && bio.alb_scrollbar.narrow.show || !this.scrollAlb(), () => bio.alb_scrollbar.but(1), '', '', false, 'alb_scrollUp');
					this.btns.alb_scrollDn = new BioBtn(this.scr.x1, this.scr.yDn1, bio.ui.sbar.but_h, bio.ui.sbar.but_h, 5, '', '', '', {
						normal: 5,
						hover: 6,
						down: 7
					}, bioSet.sbarShow == 1 && bio.alb_scrollbar.narrow.show || !this.scrollAlb(), () => bio.alb_scrollbar.but(-1), '', '', false, 'alb_scrollDn');
					this.btns.art_scrollUp = new BioBtn(this.scr.x1, this.scr.yUp1, bio.ui.sbar.but_h, bio.ui.sbar.but_h, 5, '', '', '', {
						normal: 1,
						hover: 2,
						down: 3
					}, bioSet.sbarShow == 1 && bio.art_scrollbar.narrow.show || !this.scrollArt(), () => bio.art_scrollbar.but(1), '', '', false, 'art_scrollUp');
					this.btns.art_scrollDn = new BioBtn(this.scr.x1, this.scr.yDn1, bio.ui.sbar.but_h, bio.ui.sbar.but_h, 5, '', '', '', {
						normal: 5,
						hover: 6,
						down: 7
					}, bioSet.sbarShow == 1 && bio.art_scrollbar.narrow.show || !this.scrollArt(), () => bio.art_scrollbar.but(-1), '', '', false, 'art_scrollDn');
					break;
				default:
					this.btns.alb_scrollUp = new BioBtn(this.scr.x1, this.scr.yUp1 - bio.panel.sbar.top_corr, bio.ui.sbar.but_h, bio.ui.sbar.but_h + bio.panel.sbar.top_corr, 1, this.scr.x2, this.scr.yUp2, bio.ui.sbar.but_w, '', bioSet.sbarShow == 1 && bio.alb_scrollbar.narrow.show || !this.scrollAlb(), () => bio.alb_scrollbar.but(1), '', '', false, 'alb_scrollUp');
					this.btns.alb_scrollDn = new BioBtn(this.scr.x1, this.scr.yDn1, bio.ui.sbar.but_h, bio.ui.sbar.but_h + bio.panel.sbar.top_corr, 2, this.scr.x2, this.scr.yDn2, bio.ui.sbar.but_w, '', bioSet.sbarShow == 1 && bio.alb_scrollbar.narrow.show || !this.scrollAlb(), () => bio.alb_scrollbar.but(-1), '', '', false, 'alb_scrollDn');
					this.btns.art_scrollUp = new BioBtn(this.scr.x1, this.scr.yUp1 - bio.panel.sbar.top_corr, bio.ui.sbar.but_h, bio.ui.sbar.but_h + bio.panel.sbar.top_corr, 3, this.scr.x2, this.scr.yUp2, bio.ui.sbar.but_w, '', bioSet.sbarShow == 1 && bio.art_scrollbar.narrow.show || !this.scrollArt(), () => bio.art_scrollbar.but(1), '', '', false, 'art_scrollUp');
					this.btns.art_scrollDn = new BioBtn(this.scr.x1, this.scr.yDn1, bio.ui.sbar.but_h, bio.ui.sbar.but_h + bio.panel.sbar.top_corr, 4, this.scr.x2, this.scr.yDn2, bio.ui.sbar.but_w, '', bioSet.sbarShow == 1 && bio.art_scrollbar.narrow.show || !this.scrollArt(), () => bio.art_scrollbar.but(-1), '', '', false, 'art_scrollDn');
					break;
			}
		}
		this.transition = new BioTransition(this.btns, v => v.state !== 'normal');
	}

	reset() {
		this.transition.stop();
	}

	resetZoom() {
		bio.txt.bio.scrollPos = {};
		bio.txt.rev.scrollPos = {};
		bioSet.zoomFont = 100;
		bioSet.zoomHead = 115;
		this.lookUp.zoomSize = this.lookUp.baseSize;
		this.lookUp.scale = bioSet.zoomLookUpBtn = 100;
		this.lookUp.font = gdi.Font(grFont.fontRebornSymbols, SCALE(18) * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font(grFont.fontRebornSymbols, SCALE(17) * this.lookUp.scale / 100, 0);
		bioSet.zoomHeadBtn = 100;
		bioSet.zoomTooltip = 100;
		bio.ui.getFont();
		this.createStars();
		this.createImages('lookUp');
		this.setTooltipFont();
		this.refresh(true);
		bio.txt.refresh(2);
		const n = bioSet.artistView ? 'bio' : 'rev';
		if (bio.txt[n].loaded.txt && bio.txt.reader[n].lyrics) bio.txt.getText();
		grm.ui.initTheme();
		DebugLog('\n>>> initTheme => Biography => resetZoom <<<\n');
	}

	scrollAlb() {
		return bioSet.sbarShow && !bioSet.artistView && !bioSet.img_only && bio.txt.rev.text.length && bio.alb_scrollbar.scrollable_lines > 0 && bio.alb_scrollbar.active && !bio.alb_scrollbar.narrow.show && !bio.txt.lyricsDisplayed();
	}

	scrollArt() {
		return bioSet.sbarShow && bioSet.artistView && !bioSet.img_only && bio.txt.bio.text.length && bio.art_scrollbar.scrollable_lines > 0 && bio.art_scrollbar.active && !bio.art_scrollbar.narrow.show && !bio.txt.lyricsDisplayed();
	}

	setLookUpPos() {
		this.lookUp.pos = bioSet.hdLine == 2 && bioSet.hdPos == 2 ? 0 : bioSet.heading ? bio.panel.id.lookUp : 0;
		this.lookUp.x = [0, 1 * $Bio.scale, (!bioSet.heading || bioSet.img_only ? bio.panel.w - 1 * $Bio.scale - this.lookUp.sz - 1 : bio.panel.heading.x + bio.panel.heading.w - this.lookUp.sz) - 9 * $Bio.scale][this.lookUp.pos];
		this.lookUp.y = [0, 0, !bioSet.heading || bioSet.img_only ? /*0*/ 9999 : bio.panel.text.t - bio.ui.heading.h + (bio.ui.font.heading_h - this.lookUp.sz) / 2][this.lookUp.pos];
		this.lookUp.w = [12, this.lookUp.sz * 1.5, bio.panel.w - this.lookUp.x][this.lookUp.pos];
		this.lookUp.h = [12, this.lookUp.sz * 1.5, Math.max(bio.ui.font.heading_h, this.lookUp.sz)][this.lookUp.pos];
		this.lookUp.p1 = [12, this.lookUp.sz + SCALE(1), this.lookUp.sz + SCALE(1) + 9 * $Bio.scale][this.lookUp.pos];
		this.lookUp.p2 = this.lookUp.sz + SCALE(1);
	}

	setRatingImages(w, h, onCol, offCol, borCol, lfm) {
		const hash = `${w}-${h}-${onCol}-${offCol}-${borCol}-${lfm}`;
		if (hash == this.rating.hash) return;
		else this.rating.hash = hash;
		if (lfm) this.rating.imagesLfm = [];
		if (this.src.icon && bio.ui.stars == 1) onCol = onCol & 0xe0ffffff;
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
		if (bioSet.sbarType == 3) {
			this.scr.arrow = bio.ui.sbar.but_w < Math.round(14 * $Bio.scale) ? RebornSymbols.ArrowUp3 : RebornSymbols.ArrowUp4;
			this.scr.pad = bio.ui.sbar.but_w < Math.round(14 * $Bio.scale) ? -0.26 : -0.22;
		} else {
			switch (bioSet.sbarButType) {
				case 0:
					this.scr.iconFontName = 'Segoe UI Symbol';
					this.scr.iconFontStyle = 0;
					if (!bio.ui.sbar.type) {
						this.scr.arrow = bio.ui.sbar.but_w < Math.round(14 * $Bio.scale) ? RebornSymbols.ArrowUp3 : RebornSymbols.ArrowUp4;
						this.scr.pad = bio.ui.sbar.but_w < Math.round(15 * $Bio.scale) ? -0.3 : -0.22;
					} else {
						this.scr.arrow = bio.ui.sbar.but_w < Math.round(14 * $Bio.scale) ? RebornSymbols.ArrowUp3 : RebornSymbols.ArrowUp4;
						this.scr.pad = bio.ui.sbar.but_w < Math.round(14 * $Bio.scale) ? -0.26 : -0.22;
					}
					break;
				case 1:
					this.scr.arrow = 0;
					break;
				case 2:
					this.scr.iconFontName = bioSet.butCustIconFont;
					this.scr.iconFontStyle = 0;
					this.scr.arrow = bioSet.arrowSymbol.charAt().trim();
					if (!this.scr.arrow.length) this.scr.arrow = 0;
					this.scr.pad = $Bio.clamp(bioSet.sbarButPad / 100, -0.5, 0.3);
					break;
			}
		}
	}

	setScrollBtnsHide(set, autoHide) {
		if (autoHide) {
			const arr = autoHide == 'both' ? this.scr.btns : autoHide == 'alb' ? this.scr.albBtns : this.scr.artBtns;
			arr.forEach(v => {
				if (this.btns[v]) this.btns[v].hide = set;
			});
			bio.txt.paint();
		} else {
			if (!bioSet.sbarShow && !set) return;
			this.scr.btns.forEach((v, i) => {
				if (this.btns[v]) this.btns[v].hide = i < 2 ? !this.scrollAlb() : !this.scrollArt();
			});
		}
	}

	setSrcFontSize(step) {
		this.src.fontSize += step;
		const fs = bio.ui.stars != 1 ? (this.src.icon ? (this.src.bahnInstalled ? 12 : 11) : 10) * $Bio.scale : HD_4K(14, 26);
		const hs = bio.ui.font.heading.Size;
		this.src.fontSize = $Bio.clamp(this.src.fontSize, Math.min(fs, hs), Math.max(fs, hs));
		bioSet.zoomHeadBtn = (this.src.fontSize - Math.round(bio.ui.font.heading.Size * 0.47)) * 10 + 100;
	}

	setTooltipFont() {
		bioTooltip.SetFont(bio.ui.font.main.Name, bio.ui.font.main.Size, bio.ui.font.main.Style);
	}

	srcTiptext() {
		const n = bioSet.artistView ? 'bio' : 'rev';
		const biographyFontSize = SCALE((RES._4K ? grSet.biographyFontSize_layout - 0 : grSet.biographyFontSize_layout) || 14);
		const grFlag = grm.ui.flagImgs.length;
		const flagWidth = grFlag ? grm.ui.flagImgs.reduce((sum, img) => sum + img.Width + biographyFontSize - HD_4K(18, 60), 0) : bio.but.flag.w;
		const flagTooltip = grFlag ? `[${GetMetaValues(grTF.artist_country).join(` ${Unicode.MiddleDot} `)}] ${bio.txt.artist}` : bio.txt[n].flagCountry;
		const suffix = grSet.showTooltipBiography ? this.isNextSourceAvailable() ? 'text' : 'N/A' : '';
		const type = grSet.showTooltipBiography ? bio.panel.m.x > bio.panel.heading.x + bio.panel.heading.w / 2 ? `Next ${suffix}` : bio.panel.m.x > bio.panel.heading.x ? (bio.txt[n].flag && bio.txt[n].flagCountry && bio.panel.m.x < bio.panel.heading.x + flagWidth ? flagTooltip : `Previous ${suffix}`) : '' : '';
		return this.src.visible && this.trace_src(bio.panel.m.x, bio.panel.m.y) || !bio.but.tooltipBio.name ? type : !this.fbv1 ? bio.but.tooltipBio.name : bio.but.tooltipBio.name.replace(/&/g, '&&');
	}

	trace(btn, x, y) {
		const o = this.btns[btn];
		return o && o.trace(x, y);
	}

	trace_src(x, y) {
		if (!bioSet.hdBtnShow || bioSet.hdPos == 2) return false;
		return x > this.src.x && x < this.src.x + this.src.w && y > bio.panel.text.t - bio.ui.heading.h && y < bio.panel.text.t - bio.ui.heading.h + bio.ui.font.heading_h;
	}

	tt(n, force) {
		if (bioTooltip.Text !== n || force) {
			bioTooltip.Text = n;
			bioTooltip.SetMaxWidth(SCALE(grSet.layout !== 'default' ? 600 : 800));
			bioTooltip.Activate();
		}
	}

	wheel(step) {
		if (!this.trace('lookUp', bio.panel.m.x, bio.panel.m.y)) return;
		this.lookUp.zoomSize += step;
		this.lookUp.zoomSize = $Bio.clamp(this.lookUp.zoomSize, 7, 100);
		const o = this.btns.lookUp;
		window.RepaintRect(0, o.y, bio.panel.w, o.h);
		this.lookUp.scale = Math.round(this.lookUp.zoomSize / this.lookUp.baseSize * 100);
		this.lookUp.font = gdi.Font(grFont.fontRebornSymbols, SCALE(18) * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font(grFont.fontRebornSymbols, SCALE(17) * this.lookUp.scale / 100, 0);
		this.createImages('lookUp');
		this.refresh(true);
		bioSet.zoomLookUpBtn = this.lookUp.scale;
	}
}

class BioBtn {
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
		this.tt = new BioTooltip();
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
			case 5:
				bio.ui.theme.SetPartAndStateID(1, this.item[this.state]);
				bio.ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
				break;
			case 6:
				this.drawHeading(gr);
				break;
			case 7:
				this.drawLookUp(gr);
				break;
			case 8: // summary doesn't draw
				break;
			default:
				this.drawScrollBtn(gr);
				break;
		}
	}

	drawHeading(gr) {
		const n = bioSet.artistView ? 'bio' : 'rev';
		const flag = bio.txt[n].flag;
		let dh;
		let dx1;
		let dx2;
		const dw = this.w + (bio.but.lookUp.pos == 2 ? bio.but.lookUp.sz + (bioSet.hdLine != 2 ? bio.but.lookUp.gap : 10) * $Bio.scale : 0);
		let spacer = 0;
		if (bioSet.hdPos != 2) {
			if (!bioSet.hdBtnShow || bioSet.hdPos == 1) {
				dh = bioSet.hdPos == 1 ? (bio.but.rating.show || bio.but.src.text ? (bioSet.hdPos != 1 && bio.ui.show.btnBg ? '' : (bioSet.hdLine != 2 ? '  ' : ' ')) : '') + bio.txt.na + bio.txt.heading : bio.txt.na + bio.txt.heading;
				dx1 = this.x + bio.but.src.w;
				dx2 = bio.but.src.x = this.x;
			} else {
				dh = bio.txt.na + bio.txt.heading;
				dx1 = this.x;
				dx2 = bio.but.src.x = this.x + this.w - bio.but.src.w;
			}
		} else dh = bio.txt.na + bio.txt.heading;
		dh = dh.trim();

		switch (true) {
			case bioSet.hdLine == 1:
				gr.DrawLine(this.x, this.y + bio.ui.heading.line_y, this.x + dw - 1, this.y + bio.ui.heading.line_y, bio.ui.style.l_w, bio.ui.col.bottomLine);
				break;
			case bioSet.hdLine == 2:
				if (bioSet.hdPos != 2) {
					const src_w = bio.but.src.w + (bio.but.lookUp.pos == 2 ? bio.but.lookUp.sz + (bioSet.hdBtnShow || bioSet.hdPos == 1 ? 10 * $Bio.scale : 0) : 0);
					const dh_w = gr.CalcTextWidth(dh, bio.ui.font.heading) + bio.but.src.item_w.space * (bioSet.hdPos != 1 || dh ? 2 : 0) + (bioSet.hdPos == 1 && bio.but.lookUp.pos == 2 ? bio.but.lookUp.sz + 10 * $Bio.scale : 0);
					if (!bioSet.hdPos && dh_w < dw - src_w - bio.but.src.item_w.space * (bioSet.hdPos != 2 || !bio.but.src.visible ? 3 : 1)) {
						gr.DrawLine(this.x + dh_w + (flag ? bio.but.flag.sp : 0), Math.round(this.y + this.h / 2), this.x + dw - src_w - bio.but.src.item_w.space * 3, Math.round(this.y + this.h / 2), bio.ui.style.l_w, bio.ui.col.centerLine);
					}
					else if ((!bioSet.hdBtnShow || bioSet.hdPos != 0) && src_w + bio.but.src.item_w.space * 2 + dh_w < dw) {
						gr.DrawLine(dx1 + (bio.but.src.visible ? bio.but.src.item_w.space * (!bio.ui.show.btnBg ? 2 : 3) : bioSet.hdPos == 1 ? 0 : dh_w), Math.ceil(this.y + this.h / 2), this.x + dw - (bioSet.hdBtnShow ? dh_w : bioSet.hdPos == 1 ? dh_w : 0), Math.ceil(this.y + this.h / 2), bio.ui.style.l_w, bio.ui.col.centerLine);
					} else if (bio.but.src.visible) {
						spacer = bio.but.src.item_w.space * (!bio.ui.show.btnBg ? 2 : 3);
						dx1 += spacer;
					}
				} else {
					const dh_w = gr.CalcTextWidth(dh, bio.ui.font.heading) + bio.but.src.item_w.space * 4;
					const ln_l = (dw - dh_w) / 2;
					if (ln_l > 1) {
						gr.DrawLine(this.x, Math.ceil(this.y + this.h / 2), this.x + ln_l, Math.ceil(this.y + this.h / 2), bio.ui.style.l_w, bio.ui.col.centerLine);
						gr.DrawLine(this.x + ln_l + dh_w, Math.ceil(this.y + this.h / 2), this.x + dw, Math.ceil(this.y + this.h / 2), bio.ui.style.l_w, bio.ui.col.centerLine);
					}
				}
				break;
		}
		if (flag) {
			gr.SetInterpolationMode(7);
			if (!bioSet.hdPos) {
				const grFlag = grm.ui.flagImgs.length;
				const maxFlags = Math.min(grFlag, 6);
				bio.but.flag.x = this.x;
				bio.but.flag.w = Math.round(bio.but.flag.h * flag.Width / flag.Height);
				bio.but.flag.sp = Math.round(bio.but.flag.h * 0.75 + bio.but.flag.w);
				if (grFlag) {
					const grFlagSize = bio.but.flag.h * 1.66;
					const grFlagSpacing = bio.but.flag.w + bio.but.flag.h * 0.33;
					for (let i = 0; i < maxFlags; i++) {
						gr.DrawImage(grm.ui.flagImgs[i], bio.but.flag.x, bio.but.flag.y - bio.but.flag.h * 0.33, grFlagSize, grFlagSize, 0, 0, grm.ui.flagImgs[i].Width, grm.ui.flagImgs[i].Height);
						bio.but.flag.x  += grFlagSpacing;
					}
					bio.but.flag.sp += (maxFlags - 1) * grFlagSpacing - bio.but.flag.h * 0.33; // Adjust the spacing only once at the end
				} else {
					gr.DrawImage(flag, bio.but.flag.x, bio.but.flag.y, bio.but.flag.w, bio.but.flag.h, 0, 0, flag.Width, flag.Height, '', 212);
					// const w = bio.ui.style.l_w;
					// const o = Math.floor(w / 2);
					// gr.DrawRect(bio.but.flag.x + o, bio.but.flag.y + o, bio.but.flag.w - w, bio.but.flag.h - w + 1, w, bio.ui.col.imgBor);
				}
			}
			gr.SetInterpolationMode(0); // Causes ugly border artifact glitches around transport buttons in the lower bar with ClearTypeGridFit, Needed to switch from HighQuality (2) to Default (0)
			const h_x = (bioSet.hdPos != 2 ? dx1 : this.x) + bio.but.flag.sp;
			const h_w = (bioSet.hdPos != 2 ? this.w - spacer - bio.but.src.w - (!bioSet.hdPos ? 10 : 0) : this.w - spacer) - bio.but.flag.sp;
			gr.GdiDrawText(dh, bio.ui.font.heading, bio.ui.col.headingText, h_x, this.y, h_w, this.h, bioSet.hdPos != 2 ? bio.txt.c[bioSet.hdPos] : bio.txt.cc);
			bio.but.tooltipBio.name = gr.CalcTextWidth(dh, bio.ui.font.heading) > h_w ? (!bio.txt[n].flagCountry ? dh : grSet.showTooltipBiography ? `${bio.txt[n].flagCountry} | ${dh}` : '') : '';
			bio.but.tooltipBio.x = h_x;
			bio.but.tooltipBio.w = h_w;
		} else {
			const h_x = (bioSet.hdPos != 2 ? dx1 : this.x);
			const h_w = bioSet.hdPos != 2 ? this.w - spacer - bio.but.src.w - (!bioSet.hdPos ? 10 : 0) : this.w - spacer;
			gr.GdiDrawText(dh, bio.ui.font.heading, bio.ui.col.headingText, (bioSet.hdPos != 2 ? dx1 : this.x), this.y, bioSet.hdPos != 2 ? this.w - spacer - bio.but.src.w - (!bioSet.hdPos ? 10 : 0) : this.w - spacer, this.h, bioSet.hdPos != 2 ? bio.txt.c[bioSet.hdPos] : bio.txt.cc);
			bio.but.tooltipBio.name = gr.CalcTextWidth(dh, bio.ui.font.heading) > h_w ? dh : '';
			bio.but.tooltipBio.x = h_x;
			bio.but.tooltipBio.w = h_w;
		}
		if (!bio.but.src.visible) return;
		let col;
		if (bio.ui.show.btnBg) {
			gr.SetSmoothingMode(2);
			if (bio.txt[n].loaded.ix != 1 || !bio.ui.show.btnRedLastfm) {
				if (this.state !== 'down') gr.FillRoundRect(dx2, this.p1 - (bio.but.src.pxShift ? 1 : 0), bio.but.src.w, bio.but.src.h + (bio.but.src.pxShift ? 2 : 0), 2, 2, RGBA(bio.ui.col.blend4[0], bio.ui.col.blend4[1], bio.ui.col.blend4[2], bio.ui.col.blend4[3] * (1 - this.transition_factor)));
				col = this.state !== 'down' ? bio.ui.getBlend(bio.ui.col.blend2, bio.ui.col.blend1, this.transition_factor) : bio.ui.col.blend2;
				gr.FillRoundRect(dx2, this.p1 - (bio.but.src.pxShift ? 1 : 0), bio.but.src.w, bio.but.src.h + (bio.but.src.pxShift ? 2 : 0), 2, 2, col);
				gr.DrawRoundRect(dx2, this.p1 - (bio.but.src.pxShift ? 1 : 0), bio.but.src.w, bio.but.src.h + (bio.but.src.pxShift ? 2 : 0), 2, 2, bio.ui.style.l_w, bio.ui.col.blend3);
			} else {
				gr.FillRoundRect(dx2, this.p1 - (bio.but.src.pxShift ? 1 : 0), bio.but.src.w, bio.but.src.h + (bio.but.src.pxShift ? 2 : 0), 2, 2, RGBA(210, 19, 9, 114));
				col = this.state !== 'down' ? bio.ui.getBlend(RGBA(244, 31, 19, 255), RGBA(210, 19, 9, 228), this.transition_factor) : RGBA(244, 31, 19, 255);
				gr.FillRoundRect(dx2, this.p1 - (bio.but.src.pxShift ? 1 : 0), bio.but.src.w, bio.but.src.h + (bio.but.src.pxShift ? 2 : 0), 2, 2, col);
			}
		}
		col = this.state !== 'down' ? bio.ui.getBlend(bio.but.src.col.hover, bio.but.src.col.normal, this.transition_factor) : bio.but.src.col.hover;
		switch (bio.but.src.icon) {
			case 0:
				gr.GdiDrawText(bio.but.src.name, bio.but.src.font, bio.ui.col.headingText, dx2, this.p1, bio.but.src.w, bio.but.src.h, !bio.but.rating.show ? bio.txt.cc : bio.txt.c[0]);
				break;
			case 1: {
				let iconFont = false;
				iconFont = !bioSet.lockBio || bioSet.sourceAll ? bio.txt[n].loaded.ix == 1 || bio.txt[n].loaded.ix == 2 : bioSet[`source${n}`] == 1 || bioSet[`source${n}`] == 2;
				gr.GdiDrawText(bio.but.src.name, !iconFont ? bio.but.src.font : bio.but.src.iconFont, col, dx2, this.p1 + (!iconFont ? 0 : bio.but.src.y), bio.but.src.w, bio.but.src.h, !bio.but.rating.show ? bio.txt.cc : bio.txt.c[0]);
				break;
			}
		}
		if (bio.but.rating.show) {
			const rating = bio.txt.rev.loaded.am ? bio.txt.rating.am : bio.txt.rating.lfm;
			const ratingImg = !bio.ui.show.btnRedLastfm || bio.txt.rev.loaded.am ? bio.but.rating.images[rating] : bio.but.rating.imagesLfm[rating];
			if (ratingImg) gr.DrawImage(ratingImg, !bioSet.hdPos ? this.x + this.w - spacer - bio.but.rating.w2 - (bio.ui.show.btnBg ? bio.but.src.item_w.space : 0) + SCALE(4) : dx2 + bio.but.src.name_w, this.p1 + (Math.round(bio.but.src.h - bio.but.rating.h2) / 2), bio.but.rating.w2, bio.but.rating.h2, 0, 0, bio.but.rating.w1, bio.but.rating.h1, 0, 255);
		}
	}

	drawLookUp(gr) {
		// const col = this.state !== 'down' ? bio.ui.getBlend(this.item.hover, this.item.normal, this.transition_factor) : this.item.hover;
		const col = bio.ui.col.headingText;
		gr.SetTextRenderingHint(3); // AntiAliasGridFit
		if (!bio.panel.lock) {
			gr.DrawString(RebornSymbols.AngleDown, bio.but.lookUp.font, col, this.x - HD_4K(0, 1), this.y + SCALE(1), this.p1, this.p2, StringFormat(2, 0));
			gr.DrawString(RebornSymbols.AngleDown, bio.but.lookUp.font, col, this.x - HD_4K(0, 1), this.y + SCALE(1), this.p1, this.p2, StringFormat(2, 0));
			if (this.state == 'hover') gr.DrawString(RebornSymbols.AngleDown, bio.but.lookUp.font, col, this.x, this.y + SCALE(1), this.p1, this.p2, StringFormat(2, 0));
		} else {
			gr.DrawString(RebornSymbols.Lock, bio.but.lookUp.fontLock, col, this.x, this.y + 2 * $Bio.scale, this.p1, this.p2, StringFormat(2, 0));
		}
	}

	drawScrollBtn(gr) {
		gr.SetSmoothingMode(3);
		const type3 = bioSet.sbarType == 3;
		const a = type3 ? 255 : this.state !== 'down' ? Math.min(bio.but.alpha[0] + (bio.but.alpha[1] - bio.but.alpha[0]) * this.transition_factor, bio.but.alpha[1]) : bio.but.alpha[2];
		// if (this.state !== 'normal' && (bio.ui.sbar.type == 1 || type3)) gr.FillSolidRect(bio.panel.sbar.x + (!type3 ?  0 : bio.ui.style.l_w), this.y, bio.ui.sbar.w - (!type3 ? 0 : bio.ui.style.l_w * 2), this.h, bio.but.scr.hover);
		if (bio.but.scr.img) gr.DrawImage(bio.but.scr.img, this.x + this.p1, this.p2, this.p3, this.p3, 0, 0, bio.but.scr.img.Width, bio.but.scr.img.Height, this.type == 1 || this.type == 3 ? 0 : 180, a);
		gr.SetSmoothingMode(0);
	}

	lbtn_dn(x, y) {
		if (!bio.but.Dn) return;
		this.l_dn && this.l_dn(x, y);
	}

	lbtn_up(x, y) {
		if (bio.panel.isTouchEvent(x, y)) return;
		if (this.l_up) this.l_up();
	}

	repaint() {
		const expXY = 2;
		const expWH = 4;
		window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
	}

	trace(x, y) {
		bio.but.traceBtn = !this.hide && x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
		if (this.name == 'summary' && (bioSet.artistView && bio.art_scrollbar.delta > bio.txt.line.h.bio * bio.txt.bio.summaryEnd || !bioSet.artistView && bio.alb_scrollbar.delta > bio.txt.line.h.rev * bio.txt.rev.summaryEnd)) bio.but.traceBtn = false;
		return bio.but.traceBtn;
	}
}

class BioTooltip {
	constructor() {
		this.id = Math.ceil(Math.random().toFixed(8) * 1000);
		this.tt_timer = new BioTooltipTimer();
	}

	// * METHODS * //

	clear() {
		this.tt_timer.stop(this.id);
	}

	show(text) {
		if (Date.now() - bio.but.tooltipBio.start > 2000) this.showDelayed(text);
		else this.showImmediate(text);
		bio.but.tooltipBio.start = Date.now();
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
			bio.but.tt(text);
		}
	}

	stop() {
		this.tt_timer.forceStop();
	}
}

class BioTooltipTimer {
	constructor() {
		this.delay_timer;
		this.tt_caller = undefined;
	}

	// * METHODS * //

	forceStop() {
		bio.but.tt('');
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
		if (!this.delay_timer && bioTooltip.Text) bio.but.tt(text, old_caller !== this.tt_caller);
		else {
			this.forceStop();
			if (!this.delay_timer) {
				this.delay_timer = setTimeout(() => {
					bio.but.tt(text);
					this.delay_timer = null;
				}, 500);
			}
		}
	}

	stop(id) {
		if (this.tt_caller === id) this.forceStop();
	}
}

class BioTransition {
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
