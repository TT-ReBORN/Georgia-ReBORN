'use strict';

window.DlgCode = 0x004;

class BioUserInterface {
	constructor() {
		this.dui = window.InstanceType;

		if (bioSet.typeOverlay > 4 || bioSet.typeOverlay < 0) bioSet.typeOverlay = 0;
		bioSet.sbarCol = $Bio.clamp(bioSet.sbarCol, 0, 1);

		this.blur = {
			level: 100
		};

		this.col = {
			headingBtn: '',
			headingText: '',
			line: '',
			stars: '',
			summary: '',
			txt: '',
			txt_h: ''
		};

		this.font = {
			boldAdjust: 1,
			heading: gdi.Font(grFont.fontDefault, 16, 0),
			heading_h: 21,
			headingBaseSize: 16,
			headingCustom: false,
			headingStyle: 1,
			items: [['lyricsFontStyle', 'lyrics'], ['sourceStyle', 'subHeadSource'], ['summaryStyle', 'summary'], ['trackStyle', 'subHeadTrack'], ['wikiStyle', 'subHeadWiki']],
			lyrics: gdi.Font(grFont.fontDefault, 16, 3),
			main_h: 21,
			small_h: 8,
			zoomSize: 16
		};

		this.heading = {
			h: 30,
			line_y: 0,
			linePad: bioSet.hdLinePad,
			pad: bioSet.hdPad
		};

		this.id = {
			local: typeof conf !== 'undefined',
			touch_dn: -1
		};

		bioSet.overlayStrength = $Bio.clamp(bioSet.overlayStrength, 0, 100);
		bioSet.overlayGradient = $Bio.clamp(bioSet.overlayGradient, 0, 100);
		bioSet.overlayBorderWidth = $Bio.clamp(bioSet.overlayBorderWidth, 1, 20);

		this.overlay = {
			gradient: bioSet.overlayGradient / 10 - 1,
			borderWidth: bioSet.typeOverlay != 2 && bioSet.typeOverlay != 4 ? 0 : bioSet.overlayBorderWidth,
			strength: $Bio.clamp(255 * (100 - bioSet.overlayStrength) / 100, 0, 255)
		};

		this.pss = {
			checkOnSize: false,
			installed: !this.dui && utils.CheckComponent('foo_uie_panel_splitter')
		};

		this.sbar = {
			arrowPad: bioSet.sbarPad,
			but_h: 11,
			but_w: 11,
			col: bioSet.sbarCol,
			narrowWidth: 2,
			sp: 12,
			type: 0,
			w: 11
		};

		if (!bioSet.butCustIconFont.length) bioSet.butCustIconFont = 'Segoe UI Symbol';

		this.show = {
			btnBg: bioSet.hdShowBtnBg,
			btnLabel: bioSet.hdShowBtnLabel,
			btnRedLastfm: bioSet.hdShowRedLfm,
			headingText: bioSet.hdShowTitle
		};

		if (this.show.btnRedLastfm) this.show.btnBg = 1;

		this.style = {
			bg: false,
			isBlur: false,
			l_w: Math.round(1 * $Bio.scale),
			trans: false
		};

		this.themeColour = {}

		if (bioSet.narrowSbarWidth != 0) bioSet.narrowSbarWidth = $Bio.clamp(bioSet.narrowSbarWidth, 2, 10);
		bioSet.hdLine = $Bio.value(bioSet.hdLine, 1, 2);
		if (bioSet.headFontStyle < 0 || bioSet.headFontStyle > 5) bioSet.headFontStyle = 2;
		this.id.c_c = this.id.local && typeof opt_c_c !== 'undefined';

		this.getColours();
		this.getFont(true);

		this.refresh = $Bio.debounce(() => {
			bio.txt.refresh(3);
		}, 100);

		this.setSbar();
	}

	// * METHODS * //

	assignColours() {
		const prop = ['text', 'text_h', 'headingBtn', 'headingText', 'stars', 'summary', 'rectOv', 'rectOvBor', 'line', 'bg', 'frame', 'bgTrans'];
		this.col.txt = '';
		this.col.txt_h = '';
		this.col.headingBtn = '';
		this.col.headingText = '';
		this.col.line = '';
		this.col.stars = '';
		this.col.summary = '';
		this.style.bg = false;
		this.style.trans = false;
		const set = (c, t) => {
			c = c.replace(/[^0-9.,-]/g, '').split(/[,-]/);
			if (c.length != 3 && c.length != 4) return '';
			for (let i = 0; i < c.length; i++) {
				c[i] = parseFloat(c[i]);
				if (i < 3) c[i] = $Bio.clamp(Math.round(c[i]), 0, 255);
				else if (i == 3) {
					c[i] = c[i] <= 1 ? Math.round(255 * c[i]) : $Bio.clamp(Math.round(c[i]), 0, 255);
				}
			}
			switch (t) {
				case 0:
					return RGB(c[0], c[1], c[2]);
				case 1:
					switch (c.length) {
						case 3:
							return RGB(c[0], c[1], c[2]);
						case 4:
							return RGBA(c[0], c[1], c[2], c[3]);
					}
					break;
			}
			return '';
		};

		prop.forEach((v, i) => {
			this.col[v] = set(bioSet[`${v}Use`] ? bioSet[v] : '', i < 8 ? 0 : 1);
		});
	}

	calcText() {
		bioSet.textPad = Math.max(bioSet.textPad, -Math.round(this.font.main.Size / 2));
		$Bio.gr(1, 1, false, g => {
			this.font.main_h = Math.round(g.CalcTextHeight('String', this.font.main) + bioSet.textPad);
			this.font.lyrics_h = Math.round(g.CalcTextHeight('STRING', this.font.lyrics) + bioSet.textPad);
			this.font.heading_h = g.CalcTextHeight('String', this.font.heading);
			this.font.small_h = Math.max(g.CalcTextHeight('0', this.font.small), 8);
		});
		const min_line_y = this.font.heading_h;
		const max_line_y = Math.round(this.font.heading_h * (bioSet.hdLine == 1 ? 1.25 : 1.1) + (bioSet.hdLine == 1 ? this.heading.linePad : 0));
		this.heading.line_y = bioSet.heading ? Math.max(min_line_y, max_line_y) : 0;
		const min_h = bioSet.hdLine == 1 ? this.heading.line_y : this.font.heading_h + (bioSet.hdLine == 1 ? this.heading.linePad : 0);
		this.heading.h = bioSet.heading ? Math.max(Math.round(this.heading.line_y + (bioSet.gap * (bioSet.hdLine == 1 ? 0.75 : 0.25)) + this.heading.pad), min_h) : 0;
	}

	dim(c, bg, alpha) {
		c = $Bio.toRGB(c);
		bg = $Bio.toRGB(bg);
		const r = c[0] / 255;
		const g = c[1] / 255;
		const b = c[2] / 255;
		const a = alpha / 255;
		const bgr = bg[0] / 255;
		const bgg = bg[1] / 255;
		const bgb = bg[2] / 255;
		let nR = ((1 - a) * bgr) + (a * r);
		let nG = ((1 - a) * bgg) + (a * g);
		let nB = ((1 - a) * bgb) + (a * b);
		nR = $Bio.clamp(Math.round(nR * 255), 0, 255);
		nG = $Bio.clamp(Math.round(nG * 255), 0, 255);
		nB = $Bio.clamp(Math.round(nB * 255), 0, 255);
		return RGB(nR, nG, nB);
	}

	draw(gr) {
		if (this.style.bg) gr.FillSolidRect(this.x - bioSet.borL, this.y, bio.panel.w + bioSet.borR, bio.panel.h, this.col.bg);
		if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) {
			gr.FillSolidRect(0, 0, grSet.layout === 'artwork' || grSet.biographyLayout === 'full' ? grm.ui.ww : grSet.panelWidthAuto ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : grm.ui.ww * 0.5, grm.ui.topMenuHeight, grCol.bg); // Hide alpha overlapping at the top
			if (grSet.layout === 'artwork') gr.FillSolidRect(0, this.y + this.h, grm.ui.ww, grm.ui.lowerBarHeight, grCol.bg); // Hide alpha overlapping at the bottom

			if (grSet.layout === 'default' && grSet.biographyLayout === 'full') {
				gr.DrawImage(grCol.imgBlended, 0, 0, grm.ui.ww, grm.ui.wh, 0, 0, grCol.imgBlended.Width, grCol.imgBlended.Height);
			} else {
				gr.DrawImage(grCol.imgBlended, grSet.panelWidthAuto || grSet.layout === 'artwork' ? 0 : this.x - this.w, grSet.layout === 'artwork' ? this.h - bio.panel.h : this.h - bio.panel.h - grm.ui.lowerBarHeight, grSet.panelWidthAuto ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : grm.ui.ww, grm.ui.wh,
					grSet.panelWidthAuto || grSet.layout === 'artwork' ? 0 : this.x - this.w, grSet.layout === 'artwork' ? this.h - bio.panel.h : this.h - bio.panel.h - grm.ui.lowerBarHeight, grSet.panelWidthAuto ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : grCol.imgBlended.Width, grCol.imgBlended.Height);
			}
		}
	}

	getAccentColour() {
		let valid = false;
		if (this.blur.dark && bioSet.text_hUse) {
			const c = bioSet.text_h.replace(/[^0-9.,-]/g, '').split(/[,-]/);
			if (c.length == 3 || c.length == 4) valid = true;
		}
		this.col.accent = !this.blur.dark || bioSet.text_hUse && valid ? this.col.text_h : bioSet.themed && bioSet.theme == 9 ? RGB(104, 225, 255) : RGB(128, 228, 27);
	}

	getBlend(c1, c2, f) {
		const nf = 1 - f;
		c1 = $Bio.toRGBA(c1);
		c2 = $Bio.toRGBA(c2);
		const r = c1[0] * f + c2[0] * nf;
		const g = c1[1] * f + c2[1] * nf;
		const b = c1[2] * f + c2[2] * nf;
		const a = c1[3] * f + c2[3] * nf;
		return RGBA(Math.round(r), Math.round(g), Math.round(b), Math.round(a));
	}

	getBlurColours() {
		switch (true) {
			case !bioSet.themed: // has to be able to create image: uses original themes
				if (bioSet.theme > 4) bioSet.theme = 0; // reset if coming from themed & out of bounds
				this.style.isBlur = bioSet.theme > 0;
				this.blur = {
					alpha: $Bio.clamp(bioSet.blurAlpha, 0, 100) / 30,
					blend: bioSet.theme == 2,
					blendAlpha: $Bio.clamp($Bio.clamp(bioSet.blurAlpha, 0, 100) * 105 / 30, 0, 255),
					dark: bioSet.theme == 1 || bioSet.theme == 4,
					level: bioSet.theme == 2 ? 91.05 - $Bio.clamp(bioSet.blurTemp, 1.05, 90) : $Bio.clamp(bioSet.blurTemp * 2, 0, 254),
					light: bioSet.theme == 3
				}
				if (this.blur.dark) {
					this.col.bg_light = RGBA(0, 0, 0, Math.min(160 / this.blur.alpha, 255));
					this.col.bg_dark = RGBA(0, 0, 0, Math.min(80 / this.blur.alpha, 255));
					if (bioSet.typeOverlay && !bioSet.rectOvUse) this.col.rectOv = RGBA(0, 0, 0, 255 - this.overlay.strength);
				}
				if (this.blur.light) {
					this.col.bg_light = RGBA(255, 255, 255, Math.min(160 / this.blur.alpha, 255));
					this.col.bg_dark = RGBA(255, 255, 255, Math.min(205 / this.blur.alpha, 255));
					if (bioSet.typeOverlay && !bioSet.rectOvUse) this.col.rectOv = RGBA(255, 255, 255, 255 - this.overlay.strength);
				}
				break;
			case bioSet.themed: // sent image
				this.style.isBlur = bioSet.theme || bioSet.themeBgImage;
				this.blur.blend = bioSet.theme == 6 || bioSet.theme == 7;
				this.blur.dark = bioSet.theme == 1 && !bioSet.themeLight || bioSet.theme == 2 && !bioSet.themeLight || bioSet.theme == 3 || bioSet.theme == 4 || bioSet.theme == 5 || bioSet.theme == 9;
				this.blur.light = bioSet.theme == 1 && bioSet.themeLight || bioSet.theme == 2 && bioSet.themeLight || bioSet.theme == 8;
				break;
		}
	}

	getButCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35 ? 50 : 200;
	}

	getColours() {
		this.assignColours();
		this.getBlurColours();
		this.setStarType();
		this.getUIColours();
		this.getItemColours();
		if (bioSet.themed) {
			if ((bioSet.theme == 0 || bioSet.theme == 6 || bioSet.theme == 7) && this.themeColour && bioSet.themeColour) {
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
		this.getAccentColour();
	}

	getColSat(c) {
		c = $Bio.toRGB(c);
		return c[0] + c[1] + c[2];
	}

	getFont(init) {
		const DetectWine = () => { /*Detects if user is running Wine on Linux or MacOs, default Wine mount point is Z:\*/
			const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
			const paths = ['bin\\bash', 'bin\\ls', 'bin\\sh', 'etc\\fstab'];
			return diskLetters.some(d => {
				try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
					return utils.IsDirectory(d) ? paths.some(p => utils.IsFile(d + p)) : false;
				} catch (e) { return false; }
			});
		}
		const biographyFontSize = SCALE((RES._4K ? grSet.biographyFontSize_layout - 0 : grSet.biographyFontSize_layout) || 14);

		if (grSet.customThemeFonts) this.font.main = grFont.biography;
		else if (bioSet.custFontUse && bioSet.custFont.length) {
			const custFont = $Bio.split(bioSet.custFont, 1);
			this.font.main = gdi.Font(custFont[0], Math.max(Math.round($Bio.value(custFont[1], 16, 0)), 1), Math.round($Bio.value(custFont[2], 0, 0)));
		}
		else if (this.dui) this.font.main = window.GetFontDUI(3);
		else this.font.main = window.GetFontCUI(0);

		if (!this.font.main || !grSet.customThemeFonts && DetectWine() && /tahoma/i.test(this.font.main.Name)) { // Windows: check still needed (test MS Serif or Modern, neither can be used); Wine: tahoma is default system font, but bold and some unicode characters don't work: if Wine + tahoma detected changed to Segoe UI (if that's not installed, tahoma is still used)
			this.font.main = gdi.Font(grFont.fontDefault, 16, 0);
			$Bio.trace('Spider Monkey Panel is unable to use your default font. Using Segoe UI at default size & style instead');
		}
		if (this.font.main.Size != biographyFontSize) bioSet.zoomFont = 100;
		// grSet.biographyFontSize_layout = this.font.headingBaseSize = this.font.main.Size;
		this.font.headingBaseSize = biographyFontSize;

		this.font.zoomSize = Math.max(Math.round(biographyFontSize * bioSet.zoomFont / 100), 1);

		if (bioSet.custHeadFontUse && bioSet.custHeadFont.length) {
			const custHeadFont = $Bio.split(bioSet.custHeadFont, 1);
			this.font.headingBaseSize = Math.max(Math.round($Bio.value(custHeadFont[1], 16, 0)), 1);
			this.font.heading = gdi.Font(custHeadFont[0], this.font.headingBaseSize, this.font.headingStyle);
			this.font.headingStyle = Math.round($Bio.value(custHeadFont[2], 3, 0));
			this.font.headingCustom = true;
		} else {
			this.font.headingStyle = bioSet.headFontStyle < 4 ? bioSet.headFontStyle : (bioSet.headFontStyle - 4) * 2;
			this.font.heading = gdi.Font(bioSet.headFontStyle < 4 ? this.font.main.Name : 'Segoe UI Semibold', this.font.main.Size, this.font.headingStyle);
		}
		this.font.boldAdjust = this.font.headingStyle != 1 && this.font.headingStyle != 4 && this.font.headingStyle != 5 ? 1 : 1.5;
		this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
		this.font.lyrics = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.lyrics.Style);
		this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * bioSet.zoomFont / 100 * (100 + ((bioSet.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
		this.heading.pad = $Bio.clamp(this.heading.pad, -bioSet.gap * 2, this.font.main.Size * 5);
		this.heading.linePad = $Bio.clamp(this.heading.linePad, -bioSet.gap, this.font.main.Size * 5);

		bioSet.zoomFont = Math.round(this.font.zoomSize / biographyFontSize * 100);

		this.font.items.forEach(v => {
			const style = bioSet[v[0]] < 4 ? bioSet[v[0]] : (bioSet[v[0]] - 4) * 2;
			this.font[v[1]] = gdi.Font(bioSet[v[0]] < 4 ? this.font.main.Name : 'Segoe UI Semibold', this.font.main.Size, style);
		});

		this.font.message = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
		this.font.small = gdi.Font(this.font.main.Name, Math.round(this.font.main.Size * 12 / 14), this.font.main.Style);

		this.narrowSbarWidth = bioSet.narrowSbarWidth == 0 ? $Bio.clamp(Math.floor(this.font.main.Size / 7), 2, 10) : bioSet.narrowSbarWidth;
		if (this.id.local) {
			this.font.main = c_font;
			this.font.items.forEach(v => this.font[v[1]] = gdi.Font(this.font.main.Name, this.font.main.Size, bioSet[v[0]]));
			this.font.message = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
			if (bioSet.sbarShow) {
				this.sbar.type = 0;
				this.sbar.w = c_scr_w;
				this.sbar.but_w = this.sbar.w + 1;
				this.sbar.but_h = this.sbar.w + 1;
				this.sbar.sp = this.sbar.w + 1;
			}
		}

		if (init) return;
		this.getParams();
	}

	getItemColours() {
		const lightBg = this.isLightBackground();
		let customColText = false;
		let customColText_h = false;

		if (this.col.text === '') this.col.txt = this.blur.blend ? this.setBrightness(this.col.txt, lightBg ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? RGB(50, 50, 50) : this.col.txt;
		else {
			this.col.txt = this.col.text;
			customColText = true;
		}
		if (this.col.text_h === '') this.col.txt_h = bioSet.themed && bioSet.theme == 9 ? RGB(104, 225, 255) : this.blur.blend ? this.setBrightness(this.col.txt_h, lightBg ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? (bioSet.themed && (bioSet.theme == 1 || bioSet.themed == 2) ? RGB(25, 25, 25) : RGB(71, 129, 183)) : this.col.txt_h;
		else {
			this.col.txt_h = this.col.text_h;
			customColText_h = true;
		}
		if (window.IsTransparent && this.col.bgTrans) {
			this.style.bg = true;
			this.col.bg = this.col.bgTrans;
		}
		if (!window.IsTransparent || this.dui) this.style.bg = true;

		if (this.id.local) {
			this.style.trans = c_trans;
			this.col.bg = c_backcol;
			this.col.txt = this.blur.blend ? this.setBrightness(c_textcol, this.isLightCol(c_backcol == 0 ? 0xff000000 : c_backcol) ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? RGB(50, 50, 50) : c_textcol;
			this.col.txt_h = this.blur.blend ? this.setBrightness(c_textcol_h, this.isLightCol(c_backcol == 0 ? 0xff000000 : c_backcol) ? -10 : 10) : this.blur.dark || !this.style.bg && this.style.trans && !this.blur.light ? RGB(255, 255, 255) : this.blur.light ? RGB(71, 129, 183) : c_textcol_h;
		}

		this.col.bg1 = lightBg ? 0x08000000 : 0x08ffffff;
		this.col.bg2 = lightBg ? 0x04000000 : 0x04ffffff;
		this.col.bg3 = lightBg ? 0x04ffffff : 0x04000000;

		if (bioSet.swapCol) {
			const colH = this.col.txt_h;
			this.col.txt_h = this.col.txt;
			this.col.txt = colH;
		}

		if (!customColText || bioSet.swapCol) this.col.text = !bioSet.highlightText ? this.col.txt : this.col.txt_h;
		if (!customColText_h || bioSet.swapCol) this.col.text_h = !bioSet.highlightText ? this.col.txt_h : this.col.txt;
		this.col.shadow = this.getSelTextCol(this.col.text_h);
		if (this.col.summary === '') this.col.summary = !bioSet.highlightSummary ? this.col.txt : this.col.txt_h;
		this.col.t = this.style.bg ? this.getButCol(this.col.bg) : 200;

		if (this.stars) {
			this.col.stars = RGB(255, 190, 0);
			['starOn', 'starOff', 'starBor'].forEach((v, i) => {
				this.col[v] = i < 2 ? (this.stars == 2 ? $Bio.RGBtoRGBA(this.col.stars === '' ? bioSet.highlightStars ? this.col.txt : this.col.txt_h : this.col.stars, !i ? 232 : 60) :
					this.style.bg || !this.style.bg && !this.style.trans || this.blur.dark || this.blur.light ? $Bio.RGBtoRGBA(this.col.stars === '' ? bioSet.highlightStars ? this.col.txt_h : this.col.txt : this.col.stars, !i ? 232 : 60) : (this.col.stars === '' ? RGBA(255, 255, 255, !i ? 232 : 60) : $Bio.RGBtoRGBA(this.col.stars, !i ? 232 : 60))) : RGBA(0, 0, 0, 0);
			});
		}

		this.col.bottomLine = this.getLineCol('bottom');
		this.col.centerLine = this.getLineCol('center');
		this.col.sectionLine = this.col.line === '' && !bioSet.colLineDark ? (bioSet.highlightHdLine ? this.col.text_h : this.col.text) & 0x40ffffff : $Bio.RGBAtoRGB(this.col.bottomLine, this.col.bg == 0 ? 0xff000000 : this.col.bg) & 0x56ffffff;
		this.col.edBg = (this.blur.dark ? RGB(0, 0, 0) : this.blur.light ? RGB(255, 255, 255) : this.col.bg) & 0x99ffffff;
		this.col.imgBor = this.col.text & 0x25ffffff;
		const col_txt = this.col.txt == -1 ? RGB(240, 240, 240) : this.col.txt;
		const col_txt_h = this.col.txt_h == -1 ? RGB(240, 240, 240) : this.col.txt_h;
		this.col.dropShadow = RGB(18, 26, 46);
		this.col.source = this.blur.dark ? (bioSet.highlightSubHd ? col_txt_h : col_txt) : !this.blur.light && (bioSet.sourceStyle == 1 || bioSet.sourceStyle == 3) && (bioSet.headFontStyle != 1 && bioSet.headFontStyle != 3) ? this.dim(bioSet.highlightSubHd ? this.col.txt_h : this.col.txt, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : bioSet.highlightSubHd ? this.col.txt_h : this.col.txt;
		this.col.track = this.blur.dark ? (bioSet.highlightSubHd ? col_txt_h : col_txt) : !this.blur.light && (bioSet.trackStyle == 1 || bioSet.trackStyle == 3) && (bioSet.headFontStyle != 1 && bioSet.headFontStyle != 3) ? this.dim(bioSet.highlightSubHd ? this.col.txt_h : this.col.txt, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : bioSet.highlightSubHd ? this.col.txt_h : this.col.txt;

		this.sbar.col = this.blur.dark || this.blur.light ? 1 : bioSet.sbarCol;

		if (this.col.frame === '') this.col.frame = (this.blur.dark ? 0xff808080 : this.blur.light ? 0xA330AFED : this.col.bgSel) & 0xd0ffffff;
		if (this.col.rectOv === '') this.col.rectOv = this.col.bg;
		this.col.rectOv = $Bio.RGBtoRGBA(this.col.rectOv, 255 - this.overlay.strength);
		if (this.col.rectOvBor === '') {
			this.col.rectOvBor = bioSet.highlightOvBor ? this.col.txt_h : this.col.txt;
			this.col.rectOvBor = $Bio.RGBtoRGBA(this.col.rectOvBor, 228);
		}

		if (!bioSet.heading) return;
		this.col.headBtn = this.col.headingBtn === '' ? !bioSet.highlightHdBtn ? this.col.txt : this.col.txt_h : this.col.headingBtn;
		if (this.col.headingText === '') this.col.headingText = !bioSet.highlightHdText ? this.col.txt : this.col.txt_h;
		['blend1', 'blend2', 'blend3'].forEach((v, i) => {
			this.col[v] =
			this.blur.blend ? this.col.headBtn & RGBA(255, 255, 255, i == 2 ? 40 : 12) :
			this.blur.dark || !this.style.bg && this.style.trans && !this.blur.light ? (i == 2 ? RGBA(255, 255, 255, 50) : RGBA(0, 0, 0, 40)) :
			this.blur.light ? RGBA(50, 50, 50, i == 2 ? 40 : 15) :
			this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.headBtn, !i ? 0.9 : i == 2 ? 0.87 : (this.style.isBlur ? 0.75 : 0.82));
		});
		this.col.blend4 = $Bio.toRGBA(this.col.blend1);
	}

	getLineCol(type) {
		if (!bioSet.colLineDark) return this.col.line === '' ? this.getBlend(this.blur.dark ? RGB(0, 0, 0) : this.blur.light ? RGB(255, 255, 255) : this.col.bg == 0 ? 0xff000000 : this.col.bg, bioSet.highlightHdLine ? this.col.txt_h : this.col.txt, type == 'bottom' || this.style.isBlur ? 0.25 : 0.5) : this.col.line;
		const lightBg = this.isLightBackground();
		const nearBlack = ((bioSet.theme == 1 || bioSet.theme == 2) && !this.col.themeLight || (bioSet.theme == 0 || bioSet.theme == 6 || bioSet.theme == 7) && !lightBg) && this.getColSat(this.col.bg) < 45;
		const alpha = !lightBg ? nearBlack ? 0x20ffffff : 0x50000000 : 0x30000000;
		return this.col.text & alpha;
	}

	getLuminance(c, bypass) {
		if (!bypass) c = $Bio.toRGB(c);
		const cc = c.map(v => {
			v /= 255;
			return v <= 0.04045 ? v /= 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4);
		});
		return 0.2126 * cc[0] + 0.7152 * cc[1] + 0.0722 * cc[2];
	}

	getParams() {
		this.calcText();
		bio.panel.setStyle();
		bio.but.createStars();
		bio.but.setTooltipFont();
		bio.txt.getSubHeadWidths();
		bio.txt.artCalc();
		bio.txt.albCalc();
	}

	getSelTextCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35 ? RGB(0, 0, 0) : RGB(255, 255, 255);
	}

	getUIColours() {
		const colours = Object.keys(bioColourSelector);
		this.themeColour = bioSet.themeColour && colours.length ? bioColourSelector[colours[bioSet.themeColour]] : null;
		if (bioSet.themed && (bioSet.theme == 0 || bioSet.theme == 6 || bioSet.theme == 7) && this.themeColour && bioSet.themeColour) {
			this.col.txt = this.themeColour.text;
			if (this.col.bg === '') this.col.bg = this.themeColour.background;
			if (this.col.bgSel === '') this.col.bgSel = this.img.blurDark ? RGBA(255, 255, 255, 36) : this.img.blurLight ? RGBA(50, 50, 50, 36) : this.themeColour.selection;
			this.col.txt_h = this.themeColour.highlight;
		} else {
			switch (this.dui) {
				case 0:
					if (this.col.bg === '') this.col.bg = this.blur.light ? RGB(245, 247, 255) : window.GetColourCUI(3);
					this.col.bgSel = this.blur.dark ? RGBA(255, 255, 255, 36) : this.blur.light ? RGBA(50, 50, 50, 36) : window.GetColourCUI(4);
					this.col.txt = window.GetColourCUI(0);
					this.col.txt_h = window.GetColourCUI(2);
					break;
				case 1:
					if (this.col.bg === '') this.col.bg = this.blur.light ? RGB(245, 247, 255) : window.GetColourDUI(1);
					this.col.bgSel = this.blur.dark ? RGBA(255, 255, 255, 36) : this.blur.light ? RGBA(50, 50, 50, 36) : window.GetColourDUI(3);
					this.col.txt = window.GetColourDUI(0);
					this.col.txt_h = window.GetColourDUI(2);
					break;
			}
		}
	}

	isLightBackground() {
		if (bioSet.themed && (bioSet.theme == 0 || bioSet.theme == 6 || bioSet.theme == 7) && this.themeColour && bioSet.themeColour) {
			// do nothing
		} else if (this.blur.light) return true;
		else if (this.blur.dark) return false;
		return this.isLightCol(this.col.bg == 0 ? 0xff000000 : this.col.bg);
	}

	isLightCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35;
	}

	lines(gr) {
		if (!this.id.c_c) return;
		if (bioSet.artistView && !bioSet.img_only || !bioSet.artistView && !bioSet.img_only) {
			gr.DrawRect(0, 0, bio.panel.w - 1, bio.panel.h - 1, 1, RGB(155, 155, 155));
			gr.DrawRect(1, 1, bio.panel.w - 3, bio.panel.h - 3, 1, RGB(0, 0, 0));
		}
	}

	refreshProp() {
		if (bio.panel.style.inclTrackRev == 1) bio.txt.logScrollPos();

		this.heading.pad = bioSet.hdPad;
		this.heading.linePad = bioSet.hdLinePad;
		bio.panel.style.fullWidthHeading = bioSet.heading && bioSet.fullWidthHeading;
		bio.panel.id.focus = bioSet.focus;
		bio.panel.id.lyricsSource = false;
		bio.panel.id.nowplayingSource = false;
		bio.panel.id.propsSource = false;
		for (let i = 0; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && bioSet[`pthTxtReader${i}`] && bioSet[`lyricsTxtReader${i}`] && !/item_properties/i.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1]) && !/nowplaying/i.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1])) {
				bio.panel.id.lyricsSource = true;
				bio.panel.id.focus = false;
				break;
			}
		}
		for (let i = 0; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && /nowplaying/i.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1])) {
				bio.panel.id.nowplayingSource = true;
				bio.panel.id.focus = false;
				break;
			}
		}
		for (let i = 0; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && /item_properties/i.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1])) {
				bio.panel.id.propsSource = true;
				break;
			}
		}
		if (!bio.lyrics && bio.panel.id.lyricsSource) bio.lyrics = new BioLyrics();
		bio.panel.id.lookUp = bioSet.lookUp;

		this.show = {
			btnBg: bioSet.hdShowBtnBg,
			btnLabel: bioSet.hdShowBtnLabel,
			btnRedLastfm: bioSet.hdShowRedLfm,
			headingText: bioSet.hdShowTitle
		};
		if (this.show.btnRedLastfm) this.show.btnBg = 1;

		bio.panel.checkRefreshRates();
		bio.panel.setSummary();
		if (bioSet.typeOverlay > 4 || bioSet.typeOverlay < 0) bioSet.typeOverlay = 0;

		bioSet.overlayStrength = $Bio.clamp(bioSet.overlayStrength, 0, 100);
		bioSet.overlayGradient = $Bio.clamp(bioSet.overlayGradient, 0, 100);
		bioSet.overlayBorderWidth = $Bio.clamp(bioSet.overlayBorderWidth, 1, 20);
		this.overlay = {
			gradient: bioSet.overlayGradient / 10 - 1,
			borderWidth: bioSet.typeOverlay != 2 && bioSet.typeOverlay != 4 ? 0 : bioSet.overlayBorderWidth,
			strength: $Bio.clamp(255 * (100 - bioSet.overlayStrength) / 100, 0, 255)
		};
		bioSet.reflStrength = $Bio.clamp(bioSet.reflStrength, 0, 100);
		bioSet.reflGradient = $Bio.clamp(bioSet.reflGradient, 0, 100);
		bioSet.reflSize = $Bio.clamp(bioSet.reflSize, 0, 100);
		bio.img.refl = {
			adjust: false,
			gradient: bioSet.reflGradient / 10 - 1,
			size: $Bio.clamp(bioSet.reflSize / 100, 0.1, 1),
			strength: $Bio.clamp(255 * bioSet.reflStrength / 100, 0, 255)
		};

		bio.img.mask.reflection = false;
		if (!bioSet.butCustIconFont.length) bioSet.butCustIconFont = 'Segoe UI Symbol';
		this.getColours();
		this.blur.level = bioSet.theme == 2 ? 91.05 - $Bio.clamp(bioSet.blurTemp, 1.05, 90) : $Bio.clamp(bioSet.blurTemp * 2, 0, 254);

		grm.ui.setBiographySize();
		grm.theme.initBiographyColors();
		bio.txt.artCalc(); bio.txt.albCalc(); // Refresh text color

		bio.img.mask.reset = true;
		this.setSbar();
		bio.but.setSbarIcon();
		bio.alb_scrollbar.active = true;
		bio.art_scrollbar.active = true;
		[bio.alb_scrollbar, bio.art_scrollbar].forEach(v => {
			v.duration = {
				drag: 200,
				inertia: bioSet.durationTouchFlick,
				full: bioSet.durationScroll
			};
			v.duration.scroll = Math.round(v.duration.full * 0.8);
			v.duration.step = Math.round(v.duration.full * 2 / 3);
			v.duration.bar = v.duration.full;
			v.duration.barFast = v.duration.step;
			v.setCol();
			v.resetAuto();
		});
		bio.but.createImages('all');
		this.getFont();
		this.calcText();
		bioSet.thumbNailGap = Math.max(bioSet.thumbNailGap, 0);
		bio.img.createImages();
		bio.filmStrip.set('clear');
		bio.filmStrip.style.image = [bioSet.filmCoverStyle, bioSet.filmPhotoStyle];
		bio.filmStrip.createBorder();
		bio.img.setCrop(true);
		bio.panel.alb.ix = 0;
		bio.panel.art.ix = 0;
		bio.img.id.albCyc = bio.img.id.curAlbCyc = bio.txt.id.curAlb = bio.txt.id.alb = '';

		bio.but.createStars(true);

		bio.txt.artistReset(true);
		bio.txt.albumReset(true);
		bio.txt.albumFlush();
		bio.txt.artistFlush();
		bio.txt.rev.cur = '';
		bio.txt.bio.cur = '';

		bio.txt.bio.loaded = {
			am: false,
			lfm: false,
			wiki: false,
			txt: false,
			ix: -1
		};
		bio.txt.rev.loaded = {
			am: false,
			lfm: false,
			wiki: false,
			txt: false,
			ix: -1
		};

		bio.txt.bio.fallback = bioSet.bioFallbackText.split('|');
		bio.txt.rev.fallback = bioSet.revFallbackText.split('|');
		bio.txt.loadReader();
		bio.txt.getText(true);
		bio.but.refresh(true);
		bio.img.processSizeFilter();
		bio.img.art.done = false;
		bio.img.art.allFilesLength = 0;
		bio.img.updImages();
		bio.seeker.upd();

		const origLock = bio.panel.lock;
		if (bio.txt.bio.reader || bio.txt.rev.reader) {
			bio.panel.lock = 0;
			if (origLock != bio.panel.lock) bio.panel.mbtn_up(0, 0, false, true);
		}

		if (!bio.panel.lock) bio.panel.getList(true, true);

		bio.men.playlists_changed();
		bio.panel.checkNumServers();

		if (bioSet.showFilmStrip && bioSet.autoFilm) bio.txt.getScrollPos();
		if (bioSet.filmStripOverlay && bioSet.showFilmStrip) bio.filmStrip.set(bioSet.filmStripPos);
		if (bioSet.text_only && !this.style.isBlur) bio.txt.paint();
	}

	setBrightness(c, percent) {
		c = $Bio.toRGB(c);
		return RGB($Bio.clamp(c[0] + (256 - c[0]) * percent / 100, 0, 255), $Bio.clamp(c[1] + (256 - c[1]) * percent / 100, 0, 255), $Bio.clamp(c[2] + (256 - c[2]) * percent / 100, 0, 255));
	}

	setSbar() {
		bioSet.durationTouchFlick = $Bio.clamp($Bio.value(bioSet.durationTouchFlick, 3000, 0), 0, 5000);
		bioSet.durationScroll = $Bio.clamp($Bio.value(bioSet.durationScroll, 500, 0), 0, 5000);
		bioSet.flickDistance = $Bio.clamp(bioSet.flickDistance, 0, 10);
		bioSet.touchStep = $Bio.clamp(bioSet.touchStep, 1, 10);
		bioSet.sbarType = $Bio.value(bioSet.sbarType, 0, 0);
		this.sbar.type = Math.min(bioSet.sbarType, 2);
		if (bioSet.sbarType == 2) { // light mode only
			this.theme = window.CreateThemeManager('scrollbar');
			$Bio.gr(21, 21, false, g => {
				try {
					this.theme.SetPartAndStateID(6, 1);
					this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
					for (let k = 0; k < 3; k++) {
						this.theme.SetPartAndStateID(3, k + 1);
						this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
					}
					for (let k = 0; k < 3; k++) {
						this.theme.SetPartAndStateID(1, k + 1);
						this.theme.DrawThemeBackground(g, 0, 0, 21, 21);
					}
				} catch (e) {
					this.sbar.type = 1;
					bioSet.sbarType = 1;
				}
			});
		}
		this.sbar.arrowPad = bioSet.sbarPad;
		bioSet.sbarWidth = $Bio.clamp(bioSet.sbarWidth, 0, 400);
		bioSet.sbarBase_w = $Bio.clamp(bioSet.sbarBase_w, 0, 400);

		if (bioSet.sbarWidth != bioSet.sbarBase_w) {
			bioSet.sbarArrowWidth = Math.min(bioSet.sbarArrowWidth, bioSet.sbarWidth, 400);
		} else {
			bioSet.sbarArrowWidth = $Bio.clamp(bioSet.sbarArrowWidth, 0, 400);
			bioSet.sbarWidth = $Bio.clamp(bioSet.sbarWidth, bioSet.sbarArrowWidth, 400);
		}
		bioSet.sbarBase_w = bioSet.sbarWidth;
		this.sbar.w = bioSet.sbarBase_w;
		this.sbar.but_w = bioSet.sbarArrowWidth;
		let themed_w = 21;
		try {
			themed_w = utils.GetSystemMetrics(2);
		} catch (e) {}
		if (bioSet.sbarWinMetrics) {
			this.sbar.w = themed_w;
			this.sbar.but_w = bioSet.sbarType != 3 ? this.sbar.w : this.sbar.w * 10 / 18;
		}
		else if (bioSet.sbarWidth) {
			this.sbar.w = SCALE(RES._4K ? 13 : 12);
			this.sbar.but_w = SCALE(RES._4K ? 13 : 12);
		}
		if (!bioSet.sbarWinMetrics && this.sbar.type == 2) this.sbar.w = Math.max(this.sbar.w, 12);
		if (!bioSet.sbarShow) this.sbar.w = 0;
		this.sbar.but_h = this.sbar.w + (bioSet.sbarType != 2 ? 1 : 0);
		if (bioSet.sbarType != 2) {
			if (bioSet.sbarButType || !this.sbar.type && this.sbar.but_w < Math.round(15 * $Bio.scale)) this.sbar.but_w += 1;
			else if (this.sbar.type == 1 && this.sbar.but_w < Math.round(14 * $Bio.scale)) this.sbar.arrowPad += 1;
		}
		const sp = this.sbar.type == 2 || this.sbar.w - this.sbar.but_w > 4 ? 0 : Math.round(1 * $Bio.scale);
		this.sbar.sp = this.sbar.w ? this.sbar.w + sp : 0;
		this.sbar.arrowPad = $Bio.clamp(-this.sbar.but_h / 5, this.sbar.arrowPad, this.sbar.but_h / 5);
	}

	setStarType() {
		this.stars = $Bio.value(bioSet.star, 1, 1) + 1;
		if ((!bioSet.heading || !bioSet.hdBtnShow || bioSet.hdPos == 2) && this.stars == 1) this.stars = 2;
		if (!bioSet.amRating && !bioSet.lfmRating) this.stars = 0;
	}

	updateProp(prop, value) {
		const serverName = bioSet.serverName;
		Object.entries(prop).forEach(v => {
			bioSet[v[0].replace('_internal', '')] = v[1][value];
		});
		this.refreshProp();
		if (serverName != bioSet.serverName) {
			window.Reload();
			window.NotifyOthers('bio_refresh', 'bio_refresh');
		}
	}

	wheel(step) {
		const biographyFontSize = SCALE((RES._4K ? grSet.biographyFontSize_layout - 0 : grSet.biographyFontSize_layout) || 14);
		if (!bio.panel || bio.but.trace('lookUp', bio.panel.m.x, bio.panel.m.y)) return;
		if (bio.vk.k('ctrl')) {
			if (bio.but.trace('heading', bio.panel.m.x, bio.panel.m.y)) {
				if (!bio.but.trace_src(bio.panel.m.x, bio.panel.m.y)) {
					bioSet.zoomHead = $Bio.clamp(bioSet.zoomHead += step * 5, 25, 400);
					this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * this.font.zoomSize / (biographyFontSize) * (100 + ((bioSet.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
				} else bio.but.setSrcFontSize(step);
			} else if (bio.panel.trace.text) {
				this.font.zoomSize += step;
				this.font.zoomSize = Math.max(this.font.zoomSize, 1);
				this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
				this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * this.font.zoomSize / (biographyFontSize) * (100 + ((bioSet.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);

				['lyrics', 'subHeadSource', 'summary', 'subHeadTrack', 'subHeadWiki'].forEach(v => {
					this.font[v] = gdi.Font(this.font[v].Name, this.font.zoomSize, this.font[v].Style);
				});

				this.font.message = gdi.Font(this.font.main.Name, this.font.zoomSize * 1.5, 1);
				this.font.small = gdi.Font(this.font.main.Name, Math.round(this.font.zoomSize * 12 / 14), this.font.main.Style);
				this.narrowSbarWidth = bioSet.narrowSbarWidth == 0 ? $Bio.clamp(Math.floor(this.font.zoomSize / 7), 2, 10) : bioSet.narrowSbarWidth;
			}
			this.calcText();
			bio.but.createStars();
			bio.txt.getSubHeadWidths();
			window.Repaint();
			bioSet.zoomFont = Math.round(this.font.zoomSize / (biographyFontSize) * 100);
			this.refresh();
		}
		if (bio.vk.k('shift') && bioSet.style > 3 && bio.panel.trace.text) {
			this.overlay.strength += (-step * 5);
			this.overlay.strength = $Bio.clamp(this.overlay.strength, 0, 255);
			bioSet.overlayStrength = Math.round((255 - this.overlay.strength) / 2.55);
			this.getColours();
			bio.img.mask.reset = true;
			if (!bioSet.typeOverlay) {
				bio.img.refl.adjust = true;
				if (bioSet.artistView && bioSet.cycPhoto) bio.img.clearArtCache();
				if (bio.panel.stndItem()) bio.img.getImages();
				else bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
			} else bio.txt.paint();
		}
	}
}

class BioVkeys {
	k(n) {
		switch (n) {
			case 'shift':
				return utils.IsKeyPressed(0x10);
			case 'ctrl':
				return utils.IsKeyPressed(0x11);
			case 'alt':
				return utils.IsKeyPressed(0x12);
		}
	}
}

/** @global @type {object} */
let bioColourSelector = {}
/** @global @type {{image: Function}} */
let bioSync = { image: () => {} }
/** @global @type {string} */
const bioSyncer = grSet.customBiographyDir ? `${grCfg.customBiographyDir}cache\\biography\\themed\\bioSyncTheme.js` : `${fb.ProfilePath}cache\\biography\\themed\\bioSyncTheme.js`;
if (bioSet.themed && $Bio.file(bioSyncer)) include(bioSyncer);
