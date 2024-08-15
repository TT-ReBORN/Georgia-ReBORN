'use strict';

window.DlgCode = 0x004;

class LibUserInterface {
	constructor() {
		this.cur_handle = null;
		this.dui = window.InstanceType;
		this.h = 0;
		this.w = 0;
		libSet.sbarCol = $Lib.clamp(libSet.sbarCol, 0, 1);
		if (!libSet.albumArtOptionsShow) libSet.albumArtShow = false;

		this.col = {
			bg1: 0x04ffffff,
			bg2: 0x04000000,
			bg3: 0x10ffffff,
			bg4: 0x1fffffff,
			bg5: 0xffffffff,
			bg6: 0x04000000,
			txt: '',
			txt_h: ''
		};

		this.font = {
			groupEllipsisSpace: 0,
			lotEllipsisSpace: 0,
			mainEllipsisSpace: 0,
			zoomSize: 16
		}

		this.icon = {
			char: libSet.iconCustom,
			col_c: '',
			col_e: '',
			col_h: '',
			collapse: '',
			expand: '',
			font: gdi.Font('Segoe UI Symbol', 11, 0),
			fontStyle: 0,
			fontName: 'FontAwesome',
			offset: 0,
			w: 17
		};

		this.id = {
			dragDrop: -1,
			local: typeof conf !== 'undefined',
			touch_dn: -1,
			tree: ''
		};

		this.last_pressed_coord = {
			x: -1,
			y: -1
		}

		this.img = {
			blendAlpha: $Lib.clamp($Lib.clamp(libSet.blurAlpha, 0, 100) * 105 / 30, 0, 255),
			blurAlpha: $Lib.clamp(libSet.blurAlpha, 0, 100) / 30,
			blurLevel: 100,
			covAlpha: $Lib.clamp(libSet.covAlpha * 2.55, 0, 255),
			cur: null,
			cur_pth: '',
			isBlur: false,
			stub: []
		};

		this.l = {
			s1: 4,
			s2: 6,
			s3: 7,
			w: Math.round(1 * $Lib.scale),
			wc: 0,
			wf: 0
		};

		this.row = {
			h: 20
		};

		this.sbar = {
			arrowPad: libSet.sbarPad,
			but_h: 11,
			but_w: 11,
			col: libSet.sbarCol,
			narrowWidth: 2,
			sp: 12,
			type: 0,
			w: 11
		};

		if (!libSet.butCustIconFont.length) libSet.butCustIconFont = 'Segoe UI Symbol';
		if (libSet.narrowSbarWidth != 0) libSet.narrowSbarWidth = $Lib.clamp(libSet.narrowSbarWidth, 2, 10);

		this.style = {
			bg: false,
			fill: 0,
			pen: 1,
			pen_c: 0x55888888,
			squareNode: true,
			symb: window.CreateThemeManager('TREEVIEW'),
			topBarShow: libSet.filterShow || libSet.searchShow || libSet.settingsShow
		};

		this.sz = {
			margin: libSet.margin,
			marginRight: libSet.margin,
			marginSearch: 0,
			node: Math.round(11 * $Lib.scale),
			node_base: Math.round(11 * $Lib.scale),
			pad: 1,
			sel: 3,
			sideMarker: 4,
			sp: 6,
			sp1: 6,
			sp2: 6,
			y_start: 0
		};

		this.themeColour = {}

		this.focus_changed = $Lib.debounce(() => {
			if (!libSet.recItemImage || libSet.libSource != 2) this.on_playback_new_track();
		}, 250);

		this.setNodes();
		this.getColours();
		this.getFont(true);
		this.createImages();
		this.setSbar();

		libSet.zoomImg = Math.round($Lib.clamp(libSet.zoomImg, 10, 500));
	}

	// * METHODS * //

	assignColours() {
		const prop = ['text', 'text_h', 'textSel', 'nowp', 'search', 'txt_box', 'bg', 'bg_h', 'bgSel', 'frame', 'bgSelframe', 'counts', 'icon_c', 'icon_e', 'icon_h', 'line', 's_line', 'sideMarker', 'bgTrans'];
		this.col.txt = '';
		this.col.txt_h = '';
		this.icon.col_c = '';
		this.icon.col_e = '';
		this.icon.col_h = '';
		this.style.bg = false;
		const set = (c, t) => {
			c = c.replace(/[^0-9.,-]/g, '').split(/[,-]/);
			let cc = '';
			if (c.length != 3 && c.length != 4) return '';
			for (let i = 0; i < c.length; i++) {
				c[i] = parseFloat(c[i]);
				if (i < 3) c[i] = $Lib.clamp(Math.round(c[i]), 0, 255);
				else if (i == 3) {
					c[i] = c[i] <= 1 ? Math.round(255 * c[i]) : $Lib.clamp(Math.round(c[i]), 0, 255);
				}
			}
			switch (t) {
				case 0:
					cc = RGB(c[0], c[1], c[2]);
					break;
				case 1:
					switch (c.length) {
						case 3:
							cc = RGB(c[0], c[1], c[2]);
							break;
						case 4:
							cc = RGBA(c[0], c[1], c[2], c[3]);
							break;
					}
					break;
			}
			return cc;
		};
		prop.forEach((v, i) => {
			this.col[v] = set(libSet[`${v}Use`] ? libSet[v] : '', i < 6 ? 0 : 1);
		});
	}

	block() {
		return this.w <= 10 || this.h <= 10 || !window.IsVisible;
	}

	blurReset(clear) {
		this.img.cur = null;
		this.img.cur_pth = '';
		if (clear) lib.call.on_colours_changed();
		this.on_playback_new_track();
	}

	calcText(refreshImg) {
		const libraryFontSize = SCALE(RES._4K ? grSet.libraryFontSize_layout - 0 : grSet.libraryFontSize_layout || 14);
		$Lib.gr(1, 1, false, g => {
			if (!this.id.local) this.row.h = Math.max(Math.round(g.CalcTextHeight('String', this.font.main)) + SCALE(libSet.verticalPad), 2);
			if (this.style.squareNode) {
				this.sz.node = Math.round(SCALE(11) * $Lib.scale); // Prevent node size growing in traditional tree // Math.round($Lib.clamp(this.sz.node, 7, this.row.h - 2));
				libSet.zoomNode = Math.round(this.sz.node / this.sz.node_base * 100);
			} else {
				this.sz.node = libSet.nodeStyle === 5 ? Math.round(SCALE(7) * $Lib.scale) : Math.round($Lib.clamp(this.sz.node, 7, this.row.h * 1.15));
				const mod = libSet.nodeStyle < 3 && this.sz.node > 15 ? (this.sz.node % 2) - 1 : 0;
				this.icon.font = gdi.Font(this.icon.fontName, this.sz.node + mod, libSet.nodeStyle != 6 ? 0 : this.icon.fontStyle);
				libSet.zoomNode = Math.round(this.sz.node / libraryFontSize * 100);
			}
			lib.pop.createImages();
			this.font.mainEllipsisSpace = g.CalcTextWidth(' ...', this.font.main);
			this.font.groupEllipsisSpace = g.CalcTextWidth(' ...', this.font.group);
			this.font.lotEllipsisSpace = g.CalcTextWidth(' ...', this.font.lot);
			this.sz.sp = Math.max(Math.round(g.CalcTextWidth(' ', this.font.main)), 4);
			this.sz.sp1 = Math.max(Math.round(this.sz.sp * 1.5), 6);
			if (libSet.nodeStyle && libSet.nodeStyle < 7) {
				const sp_e = g.MeasureString(this.icon.expand, this.icon.font, 0, 0, 500, 500).Width;
				const sp_c = g.MeasureString(this.icon.collapse, this.icon.font, 0, 0, 500, 500).Width;
				this.icon.offset = Math.max((sp_c - sp_e) / 2, 0);
				this.sz.sp2 = Math.round(Math.max(sp_e, sp_c) + this.sz.sp / 3);
			}
		});
		this.l.s1 = Math.max(this.sz.sp1 / 2, 4);
		this.l.wc = Math.ceil(this.l.w / 2);
		this.l.wf = Math.floor(this.l.w / 2);
		this.l.s2 = Math.floor(this.sz.node / 2) + this.l.wc;
		this.l.s3 = Math.max(7, this.sz.node / 2) - this.l.wf;

		this.icon.w = libSet.facetView ? 0 : this.style.squareNode ? this.sz.node + this.sz.sp1 : this.sz.sp + this.sz.sp2;

		this.sz.sel = (this.style.squareNode ? this.sz.sp1 : this.sz.sp + Math.round(this.sz.sp / 3)) / 2;
		this.sz.margin = this.style.topBarShow && lib.pop.inlineRoot ? libSet.margin /*+ Math.floor(Math.max(this.font.main.Size * 10 / 27, 5))*/ : libSet.margin;
		this.sz.marginRight = libSet.countsRight || libSet.itemShowStatistics ? libSet.margin + Math.floor(Math.max(this.font.main.Size * 10 / 27, 5)) : libSet.margin;
		if (libSet.facetView) this.sz.margin = this.sz.marginRight = (libSet.sbarShow ? Math.max(libSet.margin, this.sbar.sp + 7 * $Lib.scale) : libSet.margin);
		this.sz.marginSearch = this.sz.margin;

		if (this.style.topBarShow && (libSet.countsRight || libSet.itemShowStatistics || libSet.rowStripes || libSet.fullLineSelection || lib.pop.inlineRoot || libSet.nodeStyle == 3 || libSet.nodeStyle == 4)) this.sz.marginSearch -= 1;
		if (this.style.topBarShow && !lib.pop.inlineRoot && (libSet.nodeStyle == 3 || libSet.nodeStyle == 4)) this.sz.marginSearch -= 1;
		this.id.tree = this.font.main.Name + this.font.main.Size + this.font.main.Style + this.icon.w + this.sz.margin + this.sz.marginSearch;
		if (refreshImg) libImg.sizeDebounce();
	}

	createImages() {
		const cc = StringFormat(1, 1);
		const font1 = gdi.Font(grFont.fontDefault, 270, 1);
		const font2 = gdi.Font(grFont.fontDefault, 120, 1);
		const font3 = gdi.Font(grFont.fontDefault, 200, 1);
		const font4 = gdi.Font(grFont.fontDefault, 90, 1);
		const tcol = this.col.text;
		for (let i = 0; i < 2; i++) {
			this.img.stub[i] = $Lib.gr(500, 500, true, g => {
				g.SetSmoothingMode(2);
				if (!this.img.blurDark && !this.img.blurLight) {
					g.FillSolidRect(0, 0, 500, 500, tcol);
					g.FillGradRect(-1, 0, 505, 500, 90, this.col.bg & 0xbbffffff, this.col.bg, 1.0);
				}
				g.SetTextRenderingHint(3);
				g.DrawString('NO', i ? font3 : font1, tcol & 0x25ffffff, 0, 0, 500, 275, cc);
				g.DrawString(['COVER', 'SELECTION'][i], i ? font4 : font2, tcol & 0x20ffffff, 2.5, 175, 500, 275, cc);
				g.FillSolidRect(60, 388, 380, 50, tcol & 0x15ffffff);
				g.SetSmoothingMode(0);
			});
		}
		this.get = true;
	}

	draw(gr) {
		gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing for sharp edges on top and bottom bg
		if (this.style.bg) gr.FillSolidRect(this.x, this.y, this.w + (grSet.libraryLayout === 'split' ? 0 : HD_4K(17, 35)), this.h, this.col.bg);
		if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) gr.DrawImage(grCol.imgBlended, 0, 0, grm.ui.ww, grm.ui.wh, 0, 0, grCol.imgBlended.Width, grCol.imgBlended.Height);
		if (this.img.isBlur || this.img.bg) {
			this.getImgFallback();
			if (this.img.cur) gr.DrawImage(this.img.cur, this.x, this.y, this.w, this.h, 0, 0, this.img.cur.Width, this.img.cur.Height);
		}
	}

	drawLine(gr) {
		if (!this.style.topBarShow) return;
		if (this.style.pen == 1) gr.DrawLine(this.x + (libSet.nodeStyle === 0 ? lib.ui.sz.margin : lib.panel.ln.x + lib.ui.sz.margin), lib.ui.y - SCALE(10) + lib.panel.search.sp, this.x + (libSet.nodeStyle === 0 ? lib.panel.ln.w : lib.panel.ln.w - lib.ui.sz.margin), lib.ui.y - SCALE(10) + lib.panel.search.sp, this.l.w, this.col.s_line);
		// if (!libSet.searchShow || !libSet.filterShow) return;
		// const l_x = lib.panel.filter.x - this.l.wc;
		// const l_h = lib.ui.row.h / 2;
		// gr.FillGradRect(l_x, lib.ui.y, this.l.w, l_h, 91, RGBA(0, 0, 0, 0), this.col.s_line);
		// gr.FillGradRect(l_x, lib.ui.y + l_h, this.l.w, l_h, 91, this.col.s_line, RGBA(0, 0, 0, 0));
	}

	drawTopBarUnderlay(gr) {
		if ((this.img.isBlur || this.img.bg) && this.img.cur) {
			gr.FillSolidRect(this.x, this.y, this.w, libImg.panel.y, /* this.col.topBarUnderlay */ pl.col.bg);
			gr.DrawImage(this.img.cur, this.x, this.y, this.w, libImg.panel.y, 0, 0, this.img.cur.Width, lib.panel.search.h);
		} else gr.FillSolidRect(this.x, this.y, this.w, libImg.panel.y, /* this.col.topBarUnderlay */ pl.col.bg);
		if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) gr.DrawImage(grCol.imgBlended, this.x, this.y - this.h - grm.ui.lowerBarHeight + libImg.panel.y - grm.ui.topMenuHeight, grm.ui.ww, grm.ui.wh, this.x, this.y - this.h - grm.ui.lowerBarHeight + libImg.panel.y - grm.ui.topMenuHeight, grCol.imgBlended.Width, grCol.imgBlended.Height);
	}

	formatImg(image) {
		if (!this.w || !this.h) return;
		let imgw;
		let imgh;
		let imgx;
		let imgy;
		if (!this.img.isBlur && libSet.autoFill || this.img.isBlur && libSet.blurAutofill) {
			const s1 = image.Width / this.w;
			const s2 = image.Height / this.h;
			if (!this.img.isBlur && libSet.autoFill && Math.abs(s1 / s2 - 1) < 0.05) {
				imgx = 0;
				imgy = 0;
				imgw = image.Width;
				imgh = image.Height;
			} else {
				if (s1 > s2) {
					imgw = Math.round(this.w * s2);
					imgh = image.Height;
					imgx = Math.round((image.Width - imgw) / 2);
					imgy = 0;
				} else {
					imgw = image.Width;
					imgh = Math.round(this.h * s1);
					imgx = 0;
					imgy = Math.round((image.Height - imgh) / 8);
				}
			}
		}
		this.img.cur = $Lib.gr(this.w, this.h, true, (g, gi) => {
			switch (true) {
				case this.img.isBlur:
					g.SetInterpolationMode(0);
					if (libSet.blurAutofill) image = image.Clone(imgx, imgy, imgw, imgh);
					if (this.img.blurBlend) {
							if (libSet.blurTemp) {
							const iSmall = image.Resize(this.w * this.img.blurLevel / 100, this.h * this.img.blurLevel / 100, 2);
							const iFull = iSmall.Resize(this.w, this.h, 2);
							const offset = 90 - this.img.blurLevel;
							g.DrawImage(iFull, 0 - offset, 0 - offset, this.w + offset * 2, this.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, this.img.blendAlpha);
						} else g.DrawImage(image, 0, 0, this.w, this.h, 0, 0, image.Width, image.Height, 0, this.img.blendAlpha); // no blur
					} else {
						if (libSet.theme == 1 || libSet.theme == 3) {
							g.DrawImage(image, 0, 0, this.w, this.h, 0, 0, image.Width, image.Height);
							if (this.img.blurLevel > 1) gi.StackBlur(this.img.blurLevel);
							g.FillSolidRect(0, 0, this.w, this.h, this.isImageLight(gi) ? this.col.bg_light : this.col.bg_dark);
						}
						if (libSet.theme == 4) {
							g.FillSolidRect(0, 0, this.w, this.h, this.getRandomCol());
							g.DrawImage(image, 0, 0, this.w, this.h, 0, 0, image.Width, image.Height, 0, this.getImgAlpha(image));
							if (this.img.blurLevel > 1) gi.StackBlur(this.img.blurLevel);
						}
					}
					break;
				case !this.img.isBlur:
					if (libSet.autoFill) g.DrawImage(image, 0, 0, this.w, this.h, imgx, imgy, imgw, imgh, 0, this.img.covAlpha);
					else {
						const sc = Math.min(this.h / image.Height, this.w / image.Width);
						const tw = Math.round(image.Width * sc);
						const th = Math.round(image.Height * sc);
						g.DrawImage(image, (this.w - tw) / 2, (this.h - th) / 2, tw, th, 0, 0, image.Width, image.Height, 0, this.img.covAlpha);
					}
					break;
			}
		});
		window.Repaint();
	}

	getAlpha(c) {
		return c >> 24 & 0xff;
	}

	getBlend(c1, c2, f, alpha) {
		const nf = 1 - f;
		let r;
		let g;
		let b;
		let a;
		switch (true) {
			case !alpha:
				c1 = $Lib.toRGB(c1);
				c2 = $Lib.toRGB(c2);
				r = c1[0] * f + c2[0] * nf;
				g = c1[1] * f + c2[1] * nf;
				b = c1[2] * f + c2[2] * nf;
				return RGB(Math.round(r), Math.round(g), Math.round(b));
			case alpha:
				c1 = $Lib.toRGBA(c1);
				c2 = $Lib.toRGBA(c2);
				r = c1[0] * f + c2[0] * nf;
				g = c1[1] * f + c2[1] * nf;
				b = c1[2] * f + c2[2] * nf;
				a = c1[3] * f + c2[3] * nf;
				return RGBA(Math.round(r), Math.round(g), Math.round(b), Math.round(a));
		}
	}

	getBlurColours() {
		switch (true) {
			case !libSet.themed:
				if (libSet.theme > 5) libSet.theme = 0; // reset if coming from themed & out of bounds
				this.img.isBlur = libSet.theme && libSet.theme < 5;
				this.img.bg = libSet.theme == 5;
				this.img.blendAlpha = $Lib.clamp($Lib.clamp(libSet.blurAlpha, 0, 100) * 105 / 30, 0, 255);
				this.img.blurAlpha = $Lib.clamp(libSet.blurAlpha, 0, 100) / 30;
				this.img.blurBlend = libSet.theme == 2;
				this.img.blurDark = libSet.theme == 1 || libSet.theme == 4;
				this.img.blurLevel = libSet.theme == 2 ? 91.05 - $Lib.clamp(libSet.blurTemp, 1.05, 90) : $Lib.clamp(libSet.blurTemp * 2, 0, 254);
				this.img.blurLight = libSet.theme == 3;
				this.img.covAlpha = $Lib.clamp(libSet.covAlpha * 2.55, 0, 255);
				if (this.img.blurDark) {
					this.col.bg_light = RGBA(0, 0, 0, Math.min(160 / this.img.blurAlpha, 255));
					this.col.bg_dark = RGBA(0, 0, 0, Math.min(80 / this.img.blurAlpha, 255));
				}
				if (this.img.blurLight) {
					this.col.bg_light = RGBA(255, 255, 255, Math.min(160 / this.img.blurAlpha, 255));
					this.col.bg_dark = RGBA(255, 255, 255, Math.min(205 / this.img.blurAlpha, 255));
				}
				break;
			case libSet.themed:
				this.img.isBlur = libSet.theme || libSet.themeBgImage;
				this.img.blurBlend = libSet.theme == 6 || libSet.theme == 7;
				this.img.blurDark = libSet.theme == 1 && !libSet.themeLight || libSet.theme == 2 && !libSet.themeLight || libSet.theme == 3 || libSet.theme == 4 || libSet.theme == 5 || libSet.theme == 9;
				this.img.blurLight = libSet.theme == 1 && libSet.themeLight || libSet.theme == 2 && libSet.themeLight || libSet.theme == 8;
				break;
		}
	}

	getButCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35 ? 50 : 200;
	}

	getColours() {
		this.assignColours();
		this.getBlurColours();
		this.getUIColours();
		this.getItemColours();

		if (libSet.themed) {
			if ((libSet.theme == 0 || libSet.theme == 6 || libSet.theme == 7) && this.themeColour && libSet.themeColour) {
				// nothing to do
			} else {
				this.themeColour = {
					name: 'User interface',
					text: this.col.text,
					background: this.col.bg,
					selection: this.col.bgSel,
					highlight: this.col.text_h,
					bar: RGBA(0, 0, 0, 63)
				}
			}
		}
	}

	getColSat(c) {
		c = $Lib.toRGB(c);
		return c[0] + c[1] + c[2];
	}

	getContrast(c1, c2) {
		c1 = this.getLuminance(c1);
		c2 = this.getLuminance(c2);
		return Math.max(c1 / c2, c2 / c1);
	}

	getFbImg(handle) {
		if (!handle) handle = (!libSet.recItemImage || libSet.libSource != 2) ? (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()) : this.expandHandle;
		if (handle) {
			this.cur_handle = handle;
			utils.GetAlbumArtAsync(0, handle, 0);
			return;
		}
		if (fb.IsPlaying) return;
		const image = this.setStub(1);
		if (!image) {
			this.img.cur = null;
			return;
		}
		this.formatImg(image);
	}

	getFont(init) {
		const libraryFontSize = SCALE(RES._4K ? grSet.libraryFontSize_layout - 0 : grSet.libraryFontSize_layout || 14);

		if (grSet.customThemeFonts) this.font.main = grFont.library;
		else if (libSet.custFontUse && libSet.custFont.length) {
			const custFont = $Lib.split(libSet.custFont, 1);
			this.font.main = gdi.Font(custFont[0], Math.max(Math.round($Lib.value(custFont[1], 16, 0)), 1), Math.round($Lib.value(custFont[2], 0, 0)));
		}
		else if (this.dui) this.font.main = window.GetFontDUI(2);
		else this.font.main = window.GetFontCUI(0);

		if (this.id.local) this.font.main = c_font;

		if (!this.font.main || !grSet.customThemeFonts && DetectWine() && /tahoma/i.test(this.font.main.Name)) { // Windows: check still needed (test MS Serif or Modern, neither can be used); Wine: tahoma is default system font, but bold and some unicode characters don't work: if Wine + tahoma detected changed to Segoe UI (if that's not installed, tahoma is still used)
			this.font.main = gdi.Font(grFont.fontDefault, libraryFontSize, 0);
			$Lib.trace('Spider Monkey Panel is unable to use your default font. Using Segoe UI at default size & style instead', false);
		}
		if (this.font.main.Size != libraryFontSize) libSet.zoomFont = 100;
		// grSet.libraryFontSize_layout = this.font.main.Size;

		this.font.zoomSize = Math.max(Math.round(libraryFontSize * libSet.zoomFont / 100), 1);

		// this.sz.node = this.style.squareNode ? Math.round(this.sz.node_base * libSet.zoomNode / 50) : Math.round(libraryFontSize * libSet.zoomNode / 100);
		this.sz.node = Math.round(libraryFontSize * libSet.zoomNode / 100);

		this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
		libSet.zoomFont = Math.round(this.font.zoomSize / libraryFontSize * 100);

		this.font.search = gdi.Font(this.font.main.Name, this.font.main.Size, 0);
		this.font.find = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);

		if (this.id.local) {
			this.font.search = c_s_font;
			this.font.find = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
			this.sz.margin = c_margin;
			libSet.treeIndent = c_pad;
			this.row.h = c_row_h;
			if (libSet.sbarShow) {
				this.sbar.type = 0;
				this.sbar.w = c_scr_w;
				this.sbar.but_w = this.sbar.w + 1;
				this.sbar.but_h = this.sbar.w + 1;
				this.sbar.sp = this.sbar.w + 1;
			}
		}

		this.font.label = gdi.Font(this.font.main.Name, !libSet.treeAutoExpand || libSet.libSource != 2 ? Math.round(this.font.main.Size * 11 / 14) : this.font.main.Size, this.font.main.Style);
		this.font.small = gdi.Font(this.font.main.Name, !libSet.treeAutoExpand || libSet.libSource != 2 ? Math.round(this.font.main.Size * 12 / 14) : this.font.main.Size, this.font.main.Style);
		this.font.tracks = gdi.Font('Arial', Math.round(this.font.main.Size * 12 / 14), 2);
		this.sz.sideMarker = SCALE(8); // libSet.sideMarkerWidth ? Math.max(libSet.sideMarkerWidth, 1) : 4 * this.l.w;
		this.sbar.narrowWidth = libSet.narrowSbarWidth == 0 ? $Lib.clamp(Math.floor(this.font.zoomSize / 7), 2, 10) : libSet.narrowSbarWidth;

		// * Only used for grSet.libraryLayoutSplitPreset4, synchronizes artist & album font sizes with Playlist
		const headerFontSize = grSet.playlistHeaderFontSize_layout;
		const libraryLayoutSplitPreset4 = libSet.albumArtLabelType === 2 && (grSet.layout === 'default' && grSet.libraryLayout === 'split' && grm.ui && grm.ui.displayLibrary && grm.ui.displayPlaylist); // displayLibrarySplit

		if (libSet.custAlbumArtGrpFontUse && libSet.custAlbumArtGrpFont.length) {
			const custFont = $Lib.split(libSet.custAlbumArtGrpFont, 1);
			this.font.group = gdi.Font(custFont[0], this.font.main.Size, Math.round($Lib.value(custFont[1], 1, 0)));
		} else this.font.group = gdi.Font('Segoe UI Semibold', /* this.font.main.Name, */ libraryLayoutSplitPreset4 ? headerFontSize + 3 : this.font.main.Size, 1);

		if (libSet.custAlbumArtLotFontUse && libSet.custAlbumArtLotFont.length) {
			const custFont = $Lib.split(libSet.custAlbumArtLotFont, 1);
			this.font.lot = gdi.Font(custFont[0], this.font.main.Size, Math.round($Lib.value(custFont[1], 2, 0)));
		} else this.font.lot = gdi.Font('Segoe UI Semibold', libraryLayoutSplitPreset4 ? headerFontSize : this.font.main.Size, 0);

		if (libSet.custAlbumArtDurFontUse && libSet.custAlbumArtDurFont.length) {
			const custFont = $Lib.split(libSet.custAlbumArtDurFont, 1);
			this.font.statistics = gdi.Font(custFont[0], this.font.main.Size, Math.round($Lib.value(custFont[1], 2, 0)));
		} else this.font.statistics = gdi.Font('Segoe UI Semibold', this.font.main.Size, 0);

		if (init) return;
		this.calcText(true);
	}

	getGradient(c, f1, f2) {
		c = $Lib.toRGB(c);
		return [RGB(Math.min(c[0] + f1, 255), Math.min(c[1] + f1, 255), Math.min(c[2] + f1, 255)), RGB(Math.max(c[0] + f2, 0), Math.max(c[1] + f2, 0), Math.max(c[2] + f2, 0))];
	}

	getImgAlpha(image) {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15));
		let rTot = 0;
		let gTot = 0;
		let bTot = 0;
		let freqTot = 0;
		colorSchemeArray.forEach(v => {
			const col = $Lib.toRGB(v.col);
			rTot += col[0] ** 2 * v.freq;
			gTot += col[1] ** 2 * v.freq;
			bTot += col[2] ** 2 * v.freq;
			freqTot += v.freq;
		});
		const avgCol = ($Lib.clamp(Math.round(Math.sqrt(rTot / freqTot)), 0, 255) + $Lib.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0, 255) + $Lib.clamp(Math.round(Math.sqrt(bTot / freqTot)), 0, 255)) / 3;
		return $Lib.clamp(avgCol * -0.32 +  128, 64, 128);
	}

	getImgFallback() {
		if (lib.sbar.draw_timer || !this.get || libSet.themed) return;
		this.getFbImg();
		this.get = false;
	}

	getItemColours() {
		const lightBg = this.isLightBackground();

		if (this.img.blurDark) {
			this.col.txt = RGB(255, 255, 255);
			this.col.txt_h = RGB(255, 255, 255);
		}
		if (this.img.blurLight) {
			this.col.txt = RGB(50, 50, 50);
			this.col.txt_h = libSet.themed && (libSet.theme == 1 || libSet.theme == 2) ? RGB(25, 25, 25) : RGB(71, 129, 183);
		}

		if (this.col.text === '') this.col.text = this.img.blurBlend ? this.setBrightness(this.col.txt, lightBg ? -10 : 10) : this.col.txt;
		if (this.col.text_h === '') this.col.text_h = libSet.themed && libSet.theme == 9 ? RGB(104, 225, 255) : this.img.blurBlend ? this.setBrightness(this.col.txt_h, lightBg ? -10 : 10) : this.col.txt_h;

		this.col.bg3 = lightBg ? 0x10000000 : 0x10ffffff;
		this.col.bg4 = lightBg ? 0x1f000000 : 0x1fffffff;
		this.col.bg5 = lightBg ? 0x00000000 : 0x00ffffff;
		this.col.bg6 = this.img.blurDark ? RGB(64, 64, 64) : this.img.blurLight ? RGB(245, 245, 245) : this.col.bg == 0 ? 0xff000000 : this.col.bg

		if (libSet.swapCol && (!libSet.albumArtShow || libSet.albumArtLabelType != 4)) {
			const colH = this.col.text_h;
			this.col.text_h = this.col.text;
			this.col.text = colH;
		}
		if (this.col.nowp === '') this.col.nowp = !this.img.blurDark ? this.col.text_h : libSet.themed && libSet.theme == 9 ? RGB(104, 225, 255) : RGB(128, 228, 27);

		if (this.col.bg_h === '') {
			this.col.bg_h = libSet.highLightRow > 2 ? (this.img.blurDark ? 0x24000000 : 0x1E30AFED) : this.img.blurDark ? 0x19ffffff : this.img.blurLight || lightBg ? 0x19000000 : 0x19ffffff;
			this.col.bgSel_h = this.col.bg_h;
			if (this.getColSat(this.col.bg) < 150 && !this.img.blurDark && !this.img.blurLight && libSet.highLightRow != 3) {
				this.col.bg_h = this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.bgSel, 0.55);
				this.col.bgSel_h = this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.bgSel, 0.25);
			}
		} else this.col.bgSel_h = this.col.bg_h;

		if (this.col.bgSelframe === '') {
			const bgSelOpaque = $Lib.RGBAtoRGB(this.col.bgSel, this.img.blurDark ? RGB(50, 50, 50) : this.img.blurLight ? RGB(232, 232, 232) : this.col.bg);
			this.col.bgSelframe = this.setBrightness(bgSelOpaque, this.isLightCol(bgSelOpaque == 0 ? 0xff000000 : bgSelOpaque) ? -7 : 7);
			this.col.frameImgSel = this.col.bgSel & 0xb0ffffff;
		} else {
			this.col.frameImgSel = this.col.bgSelframe;
		}

		if (this.col.frame === '') {
			this.col.frame = this.img.blurDark ? 0xff808080 : 0xA330AFED;
			const frameCol = this.img.blurDark ? 0xff808080 : this.img.blurLight ? 0xA330AFED : this.col.bgSel;
			this.col.frameImg = frameCol & 0xd0ffffff;
		} else {
			this.col.frameImg = this.col.frame;
		}

		this.col.imgBgSel = this.col.bgSel & 0xb0ffffff;
		this.col.imgOverlaySel = $Lib.RGBtoRGBA(this.col.bg, 175);
		if (this.col.sideMarker === '') this.col.sideMarker = libSet.highLightNode ? this.col.text_h : this.col.text;
		this.col.count = this.setBrightness(this.col.text, this.isLightCol(this.col.text) ? -30 : 30);

		if (this.col.line === '') this.col.line = libSet.nodeLines && !libSet.facetView ? RGBA(136, 136, 136, 85) : 0;
		if (this.col.search === '') this.col.search = this.col.text;
		if (!this.dui && this.col.textSel === '') {
			const colours = Object.keys(libColourSelector);
			this.themeColour = colours.length ? libColourSelector[colours[libSet.themeColour]] : null;
			this.col.textSel = !this.img.blurDark && !this.img.blurLight ? (this.themeColour ? this.getSelTextCol(this.col.bgSel) : window.GetColourCUI(1)) : this.col.text;
		}
		if (this.col.textSel === '') this.col.textSel = !this.img.blurDark && !this.img.blurLight ? this.getSelTextCol(this.col.bgSel) : this.col.text;

		this.col.imgBor = this.col.text & 0x25ffffff;
		this.col.lotBlend = !this.img.blurDark && !this.img.blurLight ? this.getBlend(this.col.text, this.col.bg == 0 ? 0xff000000 : this.col.bg, 0.75) : this.col.text;
		this.col.rootBlend = !this.img.blurDark && !this.img.blurLight ? this.getBlend(this.col.text, this.col.bg == 0 ? 0xff000000 : this.col.bg, 0.2) : RGBA(128, 128, 128, 128);
		this.col.selBlend = this.getBlend(this.col.textSel, this.col.bgSel == 0 ? 0xff000000 : this.col.bgSel, 0.85);


		if (this.col.txt_box === '') {
			this.col.txt_box = !this.img.blurDark ? this.getTxtBoxCol(this.col.bg, false) : $Lib.RGBtoRGBA(this.col.text, 192);
			this.col.txt_box_h = this.getTxtBoxCol(this.col.bg, true);
		} else {
			this.col.txt_box_h = this.setBrightness(this.col.txt_box, 33);
		}
		if (this.col.s_line === '') {
			if (!libSet.colLineDark) this.col.s_line = !this.img.blurDark ? RGBA(136, 136, 136, 85) : $Lib.RGBtoRGBA(this.col.text, 36);
			else {
				const lightBg = this.isLightBackground();
				const nearBlack = ((libSet.theme == 1 || libSet.theme == 2) && !this.col.themeLight || (libSet.theme == 0 || libSet.theme == 6 || libSet.theme == 7) && !lightBg) && this.getColSat(this.col.bg) < 45;
				const alpha = !lightBg ? nearBlack ? 0x20ffffff : 0x50000000 : 0x30000000;
				this.col.s_line = this.col.text & alpha;
			}
		}
		if (window.IsTransparent && this.col.bgTrans) {
			this.style.bg = true;
			this.col.bg = this.col.bgTrans;
		}
		if (!window.IsTransparent || this.dui) {
			this.style.bg = true;
			if (this.getColSat(this.col.bg) > 759) this.col.bg2 = 0x06000000;
		}
		this.col.t = this.style.bg ? this.getButCol(this.col.bg) : 200;
		this.col.topBarUnderlay = this.col.bg;

		if (this.id.local) {
			this.col.topBarUnderlay = this.getAlpha(c_b1) != 255 ? RGB(25, 28, 30) : c_b1;
			this.col.text = this.col.lotBlend = this.img.blurBlend ? this.setBrightness(c_textcol, this.isLightCol(this.col.bg == 0 ? 0xff000000 : this.col.bg) ? -10 : 10) : this.img.blurDark ? RGB(255, 255, 255) : this.img.blurLight ? RGB(50, 50, 50) : c_textcol;
			this.col.text_h = this.img.blurBlend ? this.setBrightness(c_textcol_h, this.isLightCol(this.col.bg == 0 ? 0xff000000 : this.col.bg) ? -10 : 10) : this.img.blurDark ? RGB(255, 255, 255) : this.img.blurLight ? RGB(50, 50, 50) : c_textcol_h;
			this.col.textSel = this.col.selBlend = c_textselcol;
			this.col.bgSel = c_backcolsel;
			libSet.rowStripes = c_alternate;
			this.style.fill = c_fill;
			this.style.pen = c_pen;
			this.style.pen_c = c_pen_c;
			this.col.search = this.col.txt_box = c_txt_box;
			this.col.bg_h = libSet.highLightRow > 2 ? (this.img.blurDark ? 0x24000000 : 0x1E30AFED) : this.img.blurDark ? 0x19ffffff : this.img.blurLight || lightBg ? 0x19000000 : 0x19ffffff;
			this.col.bgSel_h = this.col.bg_h;
			if (this.getColSat(this.col.bg) < 150 && !this.img.blurDark && !this.img.blurLight && !libSet.highLightRow != 3) {
				this.col.bg_h = this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.bgSel, 0.55);
				this.col.bgSel_h = this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.bgSel, 0.25);
			}
			this.col.sideMarker = this.col.text_h;
			this.col.count = this.setBrightness(this.col.text, this.isLightCol(this.col.text) ? -30 : 30);
			this.col.bg1 = c_b1;
			this.col.bg2 = c_b2;
		}

		this.icon.col_c = this.col.icon_c;
		this.icon.col_e = this.col.icon_e;
		this.icon.col_h = this.col.icon_h;
		this.setIconCol();
		this.col.searchSel = window.IsTransparent || !this.col.bgSel ? 0xff0099ff : this.getContrast(this.col.search, this.col.bgSel) > 3 ? this.col.bgSel : this.getBlend(this.col.search, this.col.bg == 0 || this.img.blurDark ? 0xff000000 : this.col.bg, 0.25);
		this.sbar.col = this.img.blurDark || this.img.blurLight ? 1 : libSet.sbarCol;
		this.col.txtArr = [this.col.text, this.col.text_h, this.col.textSel];
	}

	getLuminance(c, bypass) {
		if (!bypass) c = $Lib.toRGB(c);
		const cc = c.map(v => {
			v /= 255;
			return v <= 0.04045 ? v /= 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4);
		});
		return 0.2126 * cc[0] + 0.7152 * cc[1] + 0.0722 * cc[2];
	}

	getOpaque() {
		return !(libSet.fullLineSelection && (libSet.highLightRow > 2 || libSet.sbarShow == 1) || !this.style.bg || this.img.isBlur || this.img.bg);
	}

	getRandomCol() {
		const rc = () => Math.floor(Math.random() * 256);
		let c = [rc(), rc(), rc()];
		while (!this.isColOk(c)) c = [rc(), rc(), rc()];
		return $Lib.RGBAtoRGB(RGBA(c[0], c[1], c[2], Math.min(80 / this.img.blurAlpha, 255)), RGB(0, 0, 0));
	}

	getSelTextCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35 ? RGB(0, 0, 0) : RGB(255, 255, 255);
	}

	getTxtBoxCol(c, highLight) {
		if (this.img.blurDark) c = 0xff0F0F0F;
		if (this.img.blurLight) c = 0xffF0F0F0;
		return this.getBlend(this.col.text, c == 0 ? 0xff000000 : c, !highLight ? 0.65 : 0.83);
	}

	getUIColours() {
		const colours = Object.keys(libColourSelector);
		this.themeColour = libSet.themeColour && colours.length ? libColourSelector[colours[libSet.themeColour]] : null;
		if (libSet.themed && (libSet.theme == 0 || libSet.theme == 6 || libSet.theme == 7) && this.themeColour && libSet.themeColour) {
			this.col.txt = this.themeColour.text;
			if (this.col.bg === '') this.col.bg = this.themeColour.background;
			if (this.col.bgSel === '') this.col.bgSel = this.img.blurDark ? RGBA(255, 255, 255, 36) : this.img.blurLight ? RGBA(50, 50, 50, 36) : this.themeColour.selection;
			this.col.txt_h = this.themeColour.highlight;
		} else {
			switch (this.dui) {
				case 0:
					if (this.col.bg === '') this.col.bg = pl.col.bg; // Needed to prevent bg flashing when switching from tree to album art // this.img.blurLight ? RGB(245, 247, 255) : window.GetColourCUI(3);
					if (this.col.bgSel === '') this.col.bgSel = this.img.blurDark ? RGBA(255, 255, 255, 36) : this.img.blurLight ? RGBA(50, 50, 50, 36) : window.GetColourCUI(4);
					this.col.txt = window.GetColourCUI(0);
					this.col.txt_h = window.GetColourCUI(2);
					break;
				case 1:
					if (this.col.bg === '') this.col.bg = pl.col.bg; // Needed to prevent bg flashing when switching from tree to album art // this.img.blurLight ? RGB(245, 247, 255) : window.GetColourDUI(1);
					if (this.col.bgSel === '') this.col.bgSel = this.img.blurDark ? RGBA(255, 255, 255, 36) : this.img.blurLight ? RGBA(50, 50, 50, 36) : window.GetColourDUI(3);
					this.col.txt = window.GetColourDUI(0);
					this.col.txt_h = window.GetColourDUI(2);
					break;
			}
		}
	}

	imageZoom(step) {
		if (!lib.panel.imgView) return;
		libSet.zoomImg += step * 5;
		libSet.zoomImg = Math.round($Lib.clamp(libSet.zoomImg, 10, 500));
		libImg.blockWidth = Math.round(this.row.h / 20 * 100) * libSet.zoomImg / 100;
		clearInterval(libImg.timer.preLoad);
		libImg.timer.preLoad = null;
		libImg.sizeDebounce();
	}

	isColOk(c) {
		const hsp = Math.sqrt(
			0.299 * (c[0] * c[0]) +
			0.587 * (c[1] * c[1]) +
			0.114 * (c[2] * c[2])
		);
		return hsp > 55; // exclude too dark
	}

	isImageLight(image) {
		const colorSchemeArray = $Lib.jsonParse(image.GetColourSchemeJSON(15), []);
		let rTot = 0;
		let gTot = 0;
		let bTot = 0;
		let freqTot = 0;
		colorSchemeArray.forEach(v => {
			const col = $Lib.toRGB(v.col);
			rTot += col[0] ** 2 * v.freq;
			gTot += col[1] ** 2 * v.freq;
			bTot += col[2] ** 2 * v.freq;
			freqTot += v.freq;
		});
		const avgCol = [$Lib.clamp(Math.round(Math.sqrt(rTot / freqTot)), 0, 255), $Lib.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0, 255), $Lib.clamp(Math.round(Math.sqrt(bTot / freqTot)), 0, 255)];
		return this.isLightCol(avgCol, true);
	}

	isLightBackground() {
		if (libSet.themed && (libSet.theme == 0 || libSet.theme == 6 || libSet.theme == 7) && this.themeColour && libSet.themeColour) {
			// do nothing
		}
		else if (this.img.blurLight) return true;
		else if (this.img.blurDark) return false;
		return this.isLightCol(this.col.bg == 0 ? 0xff000000 : this.col.bg);
	}

	isLightCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35;
	}

	on_get_album_art_done(handle, image, image_path) {
		if (!this.cur_handle || !this.cur_handle.Compare(handle)) return;
		if (this.img.cur_pth == image_path && this.img.cur && image) return window.Repaint();
		this.img.cur_pth = image_path;
		if (!image) image = this.setStub(0);
		if (!image) {
			this.img.cur = null;
			return;
		}
		this.formatImg(image);
	}

	on_playback_new_track(handle) {
		if (!this.img.isBlur && !this.img.bg || libSet.themed) return;
		if (this.block()) this.get = true;
		else {
			this.getFbImg(handle);
			this.get = false;
		}
	}

	setBrightness(c, percent) {
		c = $Lib.toRGB(c);
		return RGB($Lib.clamp(c[0] + (256 - c[0]) * percent / 100, 0, 255), $Lib.clamp(c[1] + (256 - c[1]) * percent / 100, 0, 255), $Lib.clamp(c[2] + (256 - c[2]) * percent / 100, 0, 255));
	}

	setIconCol() {
		const colBg = this.img.blurDark ? RGB(0, 0, 0) : this.img.blurLight ? RGB(255, 255, 255) : this.col.bg == 0 ? 0xff000000 : this.col.bg
		if (this.icon.col_c === '') {
			this.col.icon_c = this.style.squareNode ? [RGB(252, 252, 252), RGB(223, 223, 223)] : (libSet.nodeStyle == 1 || libSet.nodeStyle == 3 ? (this.img.blurDark || this.img.blurBlend || this.img.blurLight ? $Lib.RGBtoRGBA(this.col.text, 72) : this.getBlend(colBg, this.col.text, 0.5)) : this.col.text);
		} else if (this.style.squareNode) {
			this.col.icon_c = this.getAlpha(this.icon.col_c) != 255 ? $Lib.RGBAtoRGB(this.icon.col_c, this.col.bg) : this.icon.col_c;
			this.col.icon_c = this.getGradient(this.col.icon_c, 15, -14);
		}
		if (this.icon.col_e === '') {
			this.col.icon_e = this.style.squareNode ? [RGB(252, 252, 252), RGB(223, 223, 223)] : (libSet.nodeStyle == 1 || libSet.nodeStyle == 3 ? (this.img.blurDark || this.img.blurBlend ? this.col.text : this.getBlend(colBg, this.col.text, 0.1)) : this.col.text);
		} else if (this.style.squareNode) {
			this.col.icon_e = this.getAlpha(this.icon.col_e) != 255 ? $Lib.RGBAtoRGB(this.icon.col_e, this.col.bg) : this.icon.col_e;
			this.col.icon_e = this.getGradient(this.col.icon_e, 15, -14);
		}
		this.col.iconPlus = this.isLightCol(this.col.icon_e[0]) ? RGB(41, 66, 114) : RGB(225, 225, 245);
		this.col.iconMinus_c = this.isLightCol(this.col.icon_c[0]) ? RGB(75, 99, 167) : RGB(225, 225, 245);
		this.col.iconMinus_e = this.isLightCol(this.col.icon_e[0]) ? RGB(75, 99, 167) : RGB(225, 225, 245);
		if (!libSet.highLightNode) return;
		if (this.icon.col_h === '') {
			const nodeDiffHighlight = this.img.blurDark && !libSet.highLightRow && libSet.highLightNode;
			this.col.icon_h = this.style.squareNode ? !this.img.blurDark && !this.img.blurLight ? !this.id.local ? (this.getColSat(this.col.text_h) < 650 ? this.col.text_h : this.col.text) : (this.getColSat(c_iconcol_h) < 650 ? c_iconcol_h : c_textcol) : RGB(50, 50, 50) : (nodeDiffHighlight ? this.col.nowp : this.col.text_h);
			this.icon.col_h = this.col.icon_h;
		}
		if (this.style.squareNode) {
			if (this.getAlpha(this.icon.col_h) != 255) {
				this.col.icon_h = $Lib.RGBAtoRGB(this.icon.col_h, this.col.bg);
			} else if (this.icon.col_h !== '') this.col.icon_h = this.icon.col_h;
			this.col.icon_h = this.getGradient(this.col.icon_h, 15, -14);
		}
		this.col.iconPlus_h = this.isLightCol(this.col.icon_h[0]) ? RGB(41, 66, 114) : RGB(225, 225, 245);
		this.col.iconMinus_h = this.isLightCol(this.col.icon_h[0]) ? RGB(75, 99, 167) : RGB(225, 225, 245);
	}

	setMarkerCol(c) {
		if (!c) return '';
		switch (true) {
			case c == '+++':
				return this.col.text_h;
			case c == '++':
				return this.getBlend(this.col.text_h, this.col.text, 2 / 3, false);
			case c == '+':
				return this.getBlend(this.col.text_h, this.col.text, 1 / 3, false);
			case c == '---':
				return this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.text, 0.67, false);
			case c == '--':
				return this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.text, 1 / 2.225, false);
			case c == '-':
				return this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.text, 0.222, false);
			default: {
				c = c.split('-');
				if (c.length != 3 && c.length != 4) return '';
				return RGB(c[0], c[1], c[2]);
			}
		}
	}

	setNodes() {
		if (!libSet.nodeStyle && libSet.winNode) libSet.nodeStyle = 7;
		if (libSet.nodeStyle == 7 && !libSet.winNode) libSet.nodeStyle = 0;
		libSet.nodeStyle = $Lib.clamp(libSet.nodeStyle, 0, 7);
		if (libSet.nodeStyle == 6) {
			this.icon.char = libSet.iconCustom;
			if (!this.icon.char.charAt().length) libSet.nodeStyle = 0;
			else {
				this.icon.char = this.icon.char.split('//');
				if (this.icon.char[0].includes('|')) {
					this.icon.char = this.icon.char[0].split('|');
					this.icon.expand = this.icon.char[0].trim();
					this.icon.collapse = this.icon.char[1].trim();
				} else libSet.nodeStyle = 0;
			}
		}
		if (libSet.nodeStyle == 7) {
			$Lib.gr(this.sz.node, this.sz.node, false, g => {
				try {
					this.style.symb.SetPartAndStateID(2, 1);
					this.style.symb.SetPartAndStateID(2, 2);
					this.style.symb.DrawThemeBackground(g, 0, 0, this.sz.node, this.sz.node);
				} catch (e) {
					libSet.nodeStyle = 0;
				}
			});
		}
		if (libSet.nodeStyle) {
			if (libSet.nodeStyle < 5) {
				this.icon.expand = '\uF105';
				this.icon.expand2 = '\uF0DA';
				this.icon.collapse = '\uF107';
			} else if (libSet.nodeStyle === 5) {
				this.icon.expand = '\uE109'; // Segoe UI Symbol +
				this.icon.collapse = '\uE108'; // Segoe UI Symbol -
			}
		}
		if (libSet.nodeStyle !== 7 && (!this.icon.expand.length || !this.icon.collapse.length)) libSet.nodeStyle = 0;
		this.style.squareNode = !libSet.nodeStyle || libSet.nodeStyle === 7;
		if (!libSet.custIconFont.length || libSet.nodeStyle !== 6) this.icon.fontName = libSet.nodeStyle !== 5 ? 'FontAwesome' : libSet.nodeStyle === 5 ? 'Segoe UI Symbol' : 'Consolas';
		else {
			this.icon.fontName = libSet.custIconFont;
			this.icon.fontStyle = 0;
		}
	}

	setSbar() {
		libSet.durationTouchFlick = $Lib.clamp($Lib.value(libSet.durationTouchFlick, 3000, 0), 0, 5000);
		libSet.durationScroll = $Lib.clamp($Lib.value(libSet.durationScroll, 500, 0), 0, 5000);
		libSet.flickDistance = $Lib.clamp(libSet.flickDistance, 0, 10);
		libSet.touchStep = $Lib.clamp(libSet.touchStep, 1, 10);
		libSet.sbarType = $Lib.value(libSet.sbarType, 0, 2);
		this.sbar.type = libSet.sbarType;
		if (this.sbar.type == 2) {
			this.theme = window.CreateThemeManager('scrollbar');
			$Lib.gr(21, 21, false, g => {
				try {
					this.theme.SetPartAndStateID(6, 1);
					this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
					for (let i = 0; i < 3; i++) {
						this.theme.SetPartAndStateID(3, i + 1);
						this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
					}
					for (let i = 0; i < 3; i++) {
						this.theme.SetPartAndStateID(1, i + 1);
						this.theme.DrawThemeBackground(g, 0, 0, 21, 21);
					}
				} catch (e) {
					this.sbar.type = 1;
					libSet.sbarType = 1;
				}
			});
		}
		this.sbar.arrowPad = libSet.sbarPad;
		libSet.sbarWidth = $Lib.clamp(libSet.sbarWidth, 0, 400);
		libSet.sbarBase_w = $Lib.clamp(libSet.sbarBase_w, 0, 400);
		if (libSet.sbarWidth != libSet.sbarBase_w) {
			libSet.sbarArrowWidth = Math.min(libSet.sbarArrowWidth, libSet.sbarWidth, 400);
		} else {
			libSet.sbarArrowWidth = $Lib.clamp(libSet.sbarArrowWidth, 0, 400);
			libSet.sbarWidth = $Lib.clamp(libSet.sbarWidth, libSet.sbarArrowWidth, 400);
		}
		libSet.sbarBase_w = libSet.sbarWidth;
		this.sbar.w = libSet.sbarBase_w;
		this.sbar.but_w = libSet.sbarArrowWidth;
		let themed_w = 21;
		try {
			themed_w = utils.GetSystemMetrics(2);
		} catch (e) {}
		if (libSet.sbarWinMetrics) {
			this.sbar.w = themed_w;
			this.sbar.but_w = this.sbar.w;
		}
		if (!libSet.sbarWinMetrics && this.sbar.type == 2) this.sbar.w = Math.max(this.sbar.w, 12);
		if (!libSet.sbarShow) this.sbar.w = 0;
		this.sbar.but_h = this.sbar.w + (this.sbar.type != 2 ? 1 : 0);
		if (this.sbar.type != 2) {
			if (libSet.sbarButType || !this.sbar.type && this.sbar.but_w < Math.round(15 * $Lib.scale)) this.sbar.but_w += 1;
			else if (this.sbar.type == 1 && this.sbar.but_w < Math.round(14 * $Lib.scale)) this.sbar.arrowPad += 1;
		}
		this.sz.pad = this.sbar.w - this.sbar.but_w < 5 || this.sbar.type == 2 ? this.l.w : 0;
		this.sbar.sp = this.sbar.w ? this.sbar.w + this.sz.pad : 0;
		this.sbar.arrowPad = $Lib.clamp(-this.sbar.but_h / 5, this.sbar.arrowPad, this.sbar.but_h / 5);
	}

	setStub(n) {
		this.img.cur_pth = n ? 'noitem' : 'stub';
		return this.img.stub[n].Clone(0, 0, this.img.stub[n].Width, this.img.stub[n].Height);
	}

	wheel(step, all) {
		if (!lib.vk.k('shift')) {
			const textZoom = lib.panel.m.x >= lib.ui.x + Math.round(this.icon.w + this.sz.margin + (libSet.rootNode && !lib.pop.inlineRoot ? libSet.treeIndent : 0));
			if (lib.panel.m.y > lib.panel.search.h + lib.ui.y && textZoom || all) this.zoomText(step);
			if (lib.panel.m.y > lib.panel.search.h + lib.ui.y && !textZoom || all) this.zoomNode(step);
			if (lib.panel.m.y <= lib.panel.search.h + lib.ui.y || all) this.zoomFilter(step);
			libImg.sizeDebounce();
		}
		if (lib.vk.k('shift') && (lib.panel.m.y > lib.panel.search.h + lib.ui.y || all)) this.imageZoom(step);
		window.Repaint();
	}

	zoomDrag(x, y) {
		if (lib.sbar.touch.dn && lib.vk.k('zoom')) {
			lib.sbar.logScroll();
			lib.pop.deactivateTooltip();
			const y_delta = (y - this.sz.y_start);
			if (Math.abs(y_delta) > this.h / 50) {
				this.wheel(y - this.sz.y_start >= 0 ? -1 : 1, true);
				this.sz.y_start = y;
			}
			lib.sbar.setScroll();
		}
	}

	zoomFilter(step) {
		if (lib.panel.zoomFilter < 0.7) return;
		lib.panel.zoomFilter += step * 0.1;
		lib.panel.zoomFilter = Math.max(lib.panel.zoomFilter, 0.7);
		lib.panel.setTopBar();
		lib.panel.calcText();
		lib.but.refresh(true);
		libSet.zoomFilter = Math.round(lib.panel.zoomFilter * 100);
	}

	zoomNode(step) {
		this.sz.node += step;
		this.calcText();
		lib.panel.on_size();
	}

	zoomText(step) {
		lib.sbar.logScroll();
		lib.pop.deactivateTooltip();
		this.font.zoomSize += step;
		this.font.zoomSize = Math.max(this.font.zoomSize, 1);

		const fnm = this.font.main.Name;
		const fst = this.font.main.Style;
		const libraryFontSize = SCALE(RES._4K ? grSet.libraryFontSize_layout - 0 : grSet.libraryFontSize_layout || 14);
		this.font.main = gdi.Font(fnm, this.font.zoomSize, fst);
		this.font.search = gdi.Font(fnm, this.font.zoomSize, 0);
		this.font.find = gdi.Font(fnm, this.font.zoomSize * 1.5, 1);
		this.font.label = gdi.Font(fnm, !libSet.treeAutoExpand || libSet.libSource != 2 ? Math.round(this.font.zoomSize * 11 / 14) : this.font.zoomSize, fst);
		this.font.small = gdi.Font(fnm, !libSet.treeAutoExpand || libSet.libSource != 2 ? Math.round(this.font.zoomSize * 12 / 14) : this.font.zoomSize, fst);
		this.font.tracks = gdi.Font('Arial', Math.round(this.font.zoomSize * 12 / 14), 2);
		this.sbar.narrowWidth = libSet.narrowSbarWidth == 0 ? $Lib.clamp(Math.floor(this.font.zoomSize / 7), 2, 10) : libSet.narrowSbarWidth;
		this.font.group = gdi.Font(this.font.group.Name, this.font.zoomSize, this.font.group.Style);
		this.font.lot = gdi.Font(this.font.lot.Name, this.font.zoomSize, this.font.lot.Style);
		this.font.statistics = gdi.Font(this.font.statistics.Name, this.font.zoomSize, this.font.statistics.Style);

		this.calcText(true);
		lib.panel.on_size();
		lib.find.on_size();

		if (this.style.topBarShow || libSet.sbarShow) lib.but.refresh(true);
		lib.sbar.reset();
		libSet.zoomFont = Math.round(this.font.zoomSize / libraryFontSize * 100);
		lib.sbar.setScroll();
	}
}

class LibVkeys {
	constructor() {
		this.selAll = 1;
		this.copy = 3;
		this.ctrl = 17;
		this.ctrlBackspace = 127;
		this.eFocusSearch = 5;
		this.back = 8;
		this.insert = 9;
		this.lFocusSearch = 12;
		this.enter = 13;
		this.shift = 16;
		this.paste = 22;
		this.cut = 24;
		this.redo = 25;
		this.undo = 26;
		this.escape = 27;
		this.pgUp = 33;
		this.pgDn = 34;
		this.end = 35;
		this.home = 36;
		this.left = 37;
		this.up = 38;
		this.right = 39;
		this.dn = 40;
		this.del = 46;
		this.expand = 106;
		this.collapseAll = 109;
	}

	// * METHODS * //

	k(n) {
		switch (n) {
			case 'enter':
				return utils.IsKeyPressed(0x0D);
			case 'shift':
				return utils.IsKeyPressed(0x10);
			case 'ctrl':
				return utils.IsKeyPressed(0x11);
			case 'alt':
				return utils.IsKeyPressed(0x12);
			case 'zoom':
				return utils.IsKeyPressed(0x11) && utils.IsKeyPressed(0x12);
		}
	}
}

/** @global @type {object} */
let libColourSelector = {}
/** @global @type {{image: Function}} */
let libSync = { image: () => {} }
/** @global @type {string} */
const libSyncer = grSet.customLibraryDir ? `${grCfg.customLibraryDir}cache\\library\\themed\\libraryTreeSyncTheme.js` : `${fb.ProfilePath}cache\\library\\themed\\libraryTreeSyncTheme.js`;
if (libSet.themed && $Lib.file(libSyncer)) include(libSyncer);

/* eslint-disable */
(function(root,pluralize){root.pluralize=pluralize()})(this,function(){var pluralRules=[];var singularRules=[];var uncountables={};var irregularPlurals={};var irregularSingles={};function sanitizeRule(rule){if(typeof rule==='string'){return new RegExp('^'+rule+'$','i')}return rule}function restoreCase(word,token){if(word===token)return token;if(word===word.toLowerCase())return token.toLowerCase();if(word===word.toUpperCase())return token.toUpperCase();if(word[0]===word[0].toUpperCase()){return token.charAt(0).toUpperCase()+token.substr(1).toLowerCase()}return token.toLowerCase()}function interpolate(str,args){return str.replace(/\$(\d{1,2})/g,function(match,index){return args[index]||''})}function replace(word,rule){return word.replace(rule[0],function(match,index){var result=interpolate(rule[1],arguments);if(match===''){return restoreCase(word[index-1],result)}return restoreCase(match,result)})}function sanitizeWord(token,word,rules){if(!token.length||$Lib.objHasOwnProperty(uncountables, token)){return word}var len=rules.length;while(len--){var rule=rules[len];if(rule[0].test(word))return replace(word,rule)}return word}function replaceWord(replaceMap,keepMap,rules){return function(word){var token=word.toLowerCase();if($Lib.objHasOwnProperty(keepMap, token)){return restoreCase(word,token)}if($Lib.objHasOwnProperty(replaceMap, token)){return restoreCase(word,replaceMap[token])}return sanitizeWord(token,word,rules)}}function checkWord(replaceMap,keepMap,rules){return function(word){var token=word.toLowerCase();if($Lib.objHasOwnProperty(keepMap, token))return true;if($Lib.objHasOwnProperty(replaceMap, token))return false;return sanitizeWord(token,token,rules)===token}}function pluralize(word,count,inclusive){if (word.length < 2) return word;var pluralized=count===1?pluralize.singular(word):pluralize.plural(word);return(inclusive?count+' ':'')+pluralized}pluralize.plural=replaceWord(irregularSingles,irregularPlurals,pluralRules);pluralize.isPlural=checkWord(irregularSingles,irregularPlurals,pluralRules);pluralize.singular=replaceWord(irregularPlurals,irregularSingles,singularRules);pluralize.isSingular=checkWord(irregularPlurals,irregularSingles,singularRules);pluralize.addPluralRule=function(rule,replacement){pluralRules.push([sanitizeRule(rule),replacement])};pluralize.addSingularRule=function(rule,replacement){singularRules.push([sanitizeRule(rule),replacement])};pluralize.addUncountableRule=function(word){if(typeof word==='string'){uncountables[word.toLowerCase()]=true;return}pluralize.addPluralRule(word,'$0');pluralize.addSingularRule(word,'$0')};pluralize.addIrregularRule=function(single,plural){plural=plural.toLowerCase();single=single.toLowerCase();irregularSingles[single]=plural;irregularPlurals[plural]=single};[['I','we'],['me','us'],['he','they'],['she','they'],['them','them'],['myself','ourselves'],['yourself','yourselves'],['itself','themselves'],['herself','themselves'],['himself','themselves'],['themself','themselves'],['is','are'],['was','were'],['has','have'],['this','these'],['that','those'],['echo','echoes'],['dingo','dingoes'],['volcano','volcanoes'],['tornado','tornadoes'],['torpedo','torpedoes'],['genus','genera'],['viscus','viscera'],['stigma','stigmata'],['stoma','stomata'],['dogma','dogmata'],['lemma','lemmata'],['schema','schemata'],['anathema','anathemata'],['ox','oxen'],['axe','axes'],['die','dice'],['yes','yeses'],['foot','feet'],['eave','eaves'],['goose','geese'],['tooth','teeth'],['quiz','quizzes'],['human','humans'],['proof','proofs'],['carve','carves'],['valve','valves'],['looey','looies'],['thief','thieves'],['groove','grooves'],['pickaxe','pickaxes'],['passerby','passersby']].forEach(function(rule){return pluralize.addIrregularRule(rule[0],rule[1])});[[/s?$/i,'s'],[/[^\u0000-\u007F]$/i,'$0'],[/([^aeiou]ese)$/i,'$1'],[/(ax|test)is$/i,'$1es'],[/(alias|[^aou]us|t[lm]as|gas|ris)$/i,'$1es'],[/(e[mn]u)s?$/i,'$1s'],[/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i,'$1'],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,'$1i'],[/(alumn|alg|vertebr)(?:a|ae)$/i,'$1ae'],[/(seraph|cherub)(?:im)?$/i,'$1im'],[/(her|at|gr)o$/i,'$1oes'],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,'$1a'],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,'$1a'],[/sis$/i,'ses'],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,'$1$2ves'],[/([^aeiouy]|qu)y$/i,'$1ies'],[/([^ch][ieo][ln])ey$/i,'$1ies'],[/(x|ch|ss|sh|zz)$/i,'$1es'],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,'$1ices'],[/\b((?:tit)?m|l)(?:ice|ouse)$/i,'$1ice'],[/(pe)(?:rson|ople)$/i,'$1ople'],[/(child)(?:ren)?$/i,'$1ren'],[/eaux$/i,'$0'],[/m[ae]n$/i,'men'],['thou','you']].forEach(function(rule){return pluralize.addPluralRule(rule[0],rule[1])});[[/s$/i,''],[/(ss)$/i,'$1'],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,'$1fe'],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,'$1f'],[/ies$/i,'y'],[/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,'$1ie'],[/\b(mon|smil)ies$/i,'$1ey'],[/\b((?:tit)?m|l)ice$/i,'$1ouse'],[/(seraph|cherub)im$/i,'$1'],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,'$1'],[/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,'$1sis'],[/(movie|twelve|abuse|e[mn]u)s$/i,'$1'],[/(test)(?:is|es)$/i,'$1is'],[/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,'$1us'],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,'$1um'],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,'$1on'],[/(alumn|alg|vertebr)ae$/i,'$1a'],[/(cod|mur|sil|vert|ind)ices$/i,'$1ex'],[/(matr|append)ices$/i,'$1ix'],[/(pe)(rson|ople)$/i,'$1rson'],[/(child)ren$/i,'$1'],[/(eau)x?$/i,'$1'],[/men$/i,'man']].forEach(function(rule){return pluralize.addSingularRule(rule[0],rule[1])});['a','an','and','as','at','but','by','en','for','if','in','nor','of','on','or','per','the','to','vs','via','adulthood','advice','agenda','aid','aircraft','alcohol','allmusic','ammo','analytics','anime','athletics','audio','bison','blood','bream','buffalo','butter','carp','cash','chassis','chess','clothing','cod','commerce','cooperation','corps','debris','diabetes','digestion','elk','energy','equipment','excretion','expertise','firmware','flounder','folder','fun','gallows','garbage','graffiti','hardware','headquarters','health','herpes','highjinks','homework','housework','information','jeans','justice','kudos','labour','lastfm','last.fm','listener','literature','machinery','mackerel','mail','media','mews','moose','music','mud','manga','news','only','personnel','pike','plankton','playcount','pliers','police','pollution','premises','rain','research','rice','salmon','scissors','series','sewage','shambles','shrimp','similar','software','species','staff','swine','tennis','traffic','transportation','trout','tuna','wealth','welfare','whiting','wildebeest','wildlife','wikipedia','you',/pok[eé]mon$/i,/[^aeiou]ese$/i,/deer$/i,/fish$/i,/measles$/i,/o[iu]s$/i,/pox$/i,/sheep$/i].forEach(pluralize.addUncountableRule);return pluralize});
