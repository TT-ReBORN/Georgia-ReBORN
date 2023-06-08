'use strict';

window.DlgCode = 0x004;

class UserInterfaceBio {
	constructor() {
		this.dui = window.InstanceType;

		if (pptBio.typeOverlay > 4 || pptBio.typeOverlay < 0) pptBio.typeOverlay = 0;
		pptBio.sbarCol = $Bio.clamp(pptBio.sbarCol, 0, 1);

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
			heading: gdi.Font(fontDefault, 16, 0),
			heading_h: 21,
			headingBaseSize: 16,
			headingCustom: false,
			headingStyle: 1,
			items: [['lyricsFontStyle', 'lyrics'], ['sourceStyle', 'subHeadSource'], ['summaryStyle', 'summary'], ['trackStyle', 'subHeadTrack'], ['wikiStyle', 'subHeadWiki']],
			lyrics: gdi.Font(fontDefault, 16, 3),
			main_h: 21,
			small_h: 8,
			zoomSize: 16
		};

		this.heading = {
			h: 30,
			line_y: 0,
			linePad: pptBio.hdLinePad,
			pad: pptBio.hdPad
		};

		this.id = {
			local: typeof conf !== 'undefined',
			touch_dn: -1
		};

		pptBio.overlayStrength = $Bio.clamp(pptBio.overlayStrength, 0, 100);
		pptBio.overlayGradient = $Bio.clamp(pptBio.overlayGradient, 0, 100);
		pptBio.overlayBorderWidth = $Bio.clamp(pptBio.overlayBorderWidth, 1, 20);

		this.overlay = {
			gradient: pptBio.overlayGradient / 10 - 1,
			borderWidth: pptBio.typeOverlay != 2 && pptBio.typeOverlay != 4 ? 0 : pptBio.overlayBorderWidth,
			strength: $Bio.clamp(255 * (100 - pptBio.overlayStrength) / 100, 0, 255)
		};

		this.pss = {
			checkOnSize: false,
			installed: !this.dui && utils.CheckComponent('foo_uie_panel_splitter')
		};

		this.sbar = {
			arrowPad: pptBio.sbarPad,
			but_h: 11,
			but_w: 11,
			col: pptBio.sbarCol,
			narrowWidth: 2,
			sp: 12,
			type: 0,
			w: 11
		};

		if (!pptBio.butCustIconFont.length) pptBio.butCustIconFont = 'Segoe UI Symbol';

		this.show = {
			btnBg: pptBio.hdShowBtnBg,
			btnLabel: pptBio.hdShowBtnLabel,
			btnRedLastfm: pptBio.hdShowRedLfm,
			headingText: pptBio.hdShowTitle
		};

		if (this.show.btnRedLastfm) this.show.btnBg = 1;

		this.style = {
			bg: false,
			isBlur: false,
			l_w: Math.round(1 * $Bio.scale),
			trans: false
		};

		this.themeColour = {}

		if (pptBio.narrowSbarWidth != 0) pptBio.narrowSbarWidth = $Bio.clamp(pptBio.narrowSbarWidth, 2, 10);
		pptBio.hdLine = $Bio.value(pptBio.hdLine, 1, 2);
		if (pptBio.headFontStyle < 0 || pptBio.headFontStyle > 5) pptBio.headFontStyle = 2;
		this.id.c_c = this.id.local && typeof opt_c_c !== 'undefined';

		this.getColours();
		this.getFont(true);

		this.refresh = $Bio.debounce(() => {
			txt.refresh(3);
		}, 100);

		this.setSbar();
	}

	// Methods

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
			this.col[v] = set(pptBio[`${v}Use`] ? pptBio[v] : '', i < 8 ? 0 : 1);
		});
	}

	calcText() {
		pptBio.textPad = Math.max(pptBio.textPad, -Math.round(this.font.main.Size / 2));
		$Bio.gr(1, 1, false, g => {
			this.font.main_h = Math.round(g.CalcTextHeight('String', this.font.main) + pptBio.textPad);
			this.font.lyrics_h = Math.round(g.CalcTextHeight('STRING', this.font.lyrics) + pptBio.textPad);
			this.font.heading_h = g.CalcTextHeight('String', this.font.heading);
			this.font.small_h = Math.max(g.CalcTextHeight('0', this.font.small), 8);
		});
		const min_line_y = this.font.heading_h;
		const max_line_y = Math.round(this.font.heading_h * (pptBio.hdLine == 1 ? 1.25 : 1.1) + (pptBio.hdLine == 1 ? this.heading.linePad : 0));
		this.heading.line_y = pptBio.heading ? Math.max(min_line_y, max_line_y) : 0;
		const min_h = pptBio.hdLine == 1 ? this.heading.line_y : this.font.heading_h + (pptBio.hdLine == 1 ? this.heading.linePad : 0);
		this.heading.h = pptBio.heading ? Math.max(Math.round(this.heading.line_y + (pptBio.gap * (pptBio.hdLine == 1 ? 0.75 : 0.25)) + this.heading.pad), min_h) : 0;
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
		if (this.style.bg) gr.FillSolidRect(this.x - pptBio.borL, this.y, panelBio.w + pptBio.borR, panelBio.h, this.col.bg);
		if (pref.styleBlend && albumArt && blendedImg) {
			gr.FillSolidRect(0, 0, pref.layout === 'artwork' || pref.biographyLayout === 'full' ? ww : ww * 0.5, geo.topMenuHeight, col.bg); // Hide alpha overlapping at the top
			if (pref.layout === 'artwork') gr.FillSolidRect(0, this.y + this.h, ww, geo.lowerBarHeight, col.bg); // Hide alpha overlapping at the bottom
			if (UIHacks.Aero.Effect === 2) gr.DrawLine(0, 0, pref.layout === 'artwork' || pref.biographyLayout === 'full' ? ww : ww * 0.5 - 1, 0, 1, col.bg); // UIHacks aero glass shadow frame fix - needed for style Blend
			if (pref.layout === 'default' && pref.biographyLayout === 'full') {
				gr.DrawImage(blendedImg, 0, this.h - panelBio.h - geo.lowerBarHeight, ww, wh, 0, this.h - panelBio.h - geo.lowerBarHeight, blendedImg.Width, blendedImg.Height);
			} else {
				gr.DrawImage(blendedImg, pref.layout === 'artwork' ? 0 : this.x - this.w, pref.layout === 'artwork' ? this.h - panelBio.h : this.h - panelBio.h - geo.lowerBarHeight,
				ww, wh, pref.layout === 'artwork' ? 0 : this.x - this.w, pref.layout === 'artwork' ? this.h - panelBio.h : this.h - panelBio.h - geo.lowerBarHeight, blendedImg.Width, blendedImg.Height);
			}
		}
	}

	getAccentColour() {
		let valid = false;
		if (this.blur.dark && pptBio.text_hUse) {
			const c = pptBio.text_h.replace(/[^0-9.,-]/g, '').split(/[,-]/);
			if (c.length == 3 || c.length == 4) valid = true;
		}
		this.col.accent = !this.blur.dark || pptBio.text_hUse && valid ? this.col.text_h : pptBio.themed && pptBio.theme == 9 ? RGB(104, 225, 255) : RGB(128, 228, 27);
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
			case !pptBio.themed: // has to be able to create image: uses original themes
				if (pptBio.theme > 4) pptBio.theme = 0; // reset if coming from themed & out of bounds
				this.style.isBlur = pptBio.theme > 0;
				this.blur = {
					alpha: $Bio.clamp(pptBio.blurAlpha, 0, 100) / 30,
					blend: pptBio.theme == 2,
					blendAlpha: $Bio.clamp($Bio.clamp(pptBio.blurAlpha, 0, 100) * 105 / 30, 0, 255),
					dark: pptBio.theme == 1 || pptBio.theme == 4,
					level: pptBio.theme == 2 ? 91.05 - $Bio.clamp(pptBio.blurTemp, 1.05, 90) : $Bio.clamp(pptBio.blurTemp * 2, 0, 254),
					light: pptBio.theme == 3
				}
				if (this.blur.dark) {
					this.col.bg_light = RGBA(0, 0, 0, Math.min(160 / this.blur.alpha, 255));
					this.col.bg_dark = RGBA(0, 0, 0, Math.min(80 / this.blur.alpha, 255));
					if (pptBio.typeOverlay && !pptBio.rectOvUse) this.col.rectOv = RGBA(0, 0, 0, 255 - this.overlay.strength);
				}
				if (this.blur.light) {
					this.col.bg_light = RGBA(255, 255, 255, Math.min(160 / this.blur.alpha, 255));
					this.col.bg_dark = RGBA(255, 255, 255, Math.min(205 / this.blur.alpha, 255));
					if (pptBio.typeOverlay && !pptBio.rectOvUse) this.col.rectOv = RGBA(255, 255, 255, 255 - this.overlay.strength);
				}
				break;
			case pptBio.themed: // sent image
				this.style.isBlur = pptBio.theme || pptBio.themeBgImage;
				this.blur.blend = pptBio.theme == 6 || pptBio.theme == 7;
				this.blur.dark = pptBio.theme == 1 && !pptBio.themeLight || pptBio.theme == 2 && !pptBio.themeLight || pptBio.theme == 3 || pptBio.theme == 4 || pptBio.theme == 5 || pptBio.theme == 9;
				this.blur.light = pptBio.theme == 1 && pptBio.themeLight || pptBio.theme == 2 && pptBio.themeLight || pptBio.theme == 8;
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
		if (pptBio.themed) {
			if ((pptBio.theme == 0 || pptBio.theme == 6 || pptBio.theme == 7) && this.themeColour && pptBio.themeColour) {
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
		const biographyFontSize = pref.layout === 'artwork' ? pptBio.baseFontSizeBio_artwork : pptBio.baseFontSizeBio_default;

		if (pref.customThemeFonts) this.font.main = ft.biography;
		else if (pptBio.custFontUse && pptBio.custFont.length) {
			const custFont = $Bio.split(pptBio.custFont, 1);
			this.font.main = gdi.Font(custFont[0], Math.max(Math.round($Bio.value(custFont[1], 16, 0)), 1), Math.round($Bio.value(custFont[2], 0, 0)));
		}
		else if (this.dui) this.font.main = window.GetFontDUI(3);
		else this.font.main = window.GetFontCUI(0);

		if (!this.font.main || !pref.customThemeFonts && DetectWine() && /tahoma/i.test(this.font.main.Name)) { // Windows: check still needed (test MS Serif or Modern, neither can be used); Wine: tahoma is default system font, but bold and some unicode characters don't work: if Wine + tahoma detected changed to Segoe UI (if that's not installed, tahoma is still used)
			this.font.main = gdi.Font(fontDefault, 16, 0);
			$Bio.trace('Spider Monkey Panel is unable to use your default font. Using Segoe UI at default size & style instead');
		}
		if (this.font.main.Size != biographyFontSize) pptBio.zoomFont = 100;
		// pref.layout === 'artwork' ? pptBio.baseFontSizeBio_artwork : pptBio.baseFontSizeBio_default = this.font.headingBaseSize = this.font.main.Size;
		this.font.headingBaseSize = biographyFontSize;

		this.font.zoomSize = Math.max(Math.round(biographyFontSize * pptBio.zoomFont / 100), 1);

		if (pptBio.custHeadFontUse && pptBio.custHeadFont.length) {
			const custHeadFont = $Bio.split(pptBio.custHeadFont, 1);
			this.font.headingBaseSize = Math.max(Math.round($Bio.value(custHeadFont[1], 16, 0)), 1);
			this.font.heading = gdi.Font(custHeadFont[0], this.font.headingBaseSize, this.font.headingStyle);
			this.font.headingStyle = Math.round($Bio.value(custHeadFont[2], 3, 0));
			this.font.headingCustom = true;
		} else {
			this.font.headingStyle = pptBio.headFontStyle < 4 ? pptBio.headFontStyle : (pptBio.headFontStyle - 4) * 2;
			this.font.heading = gdi.Font(pptBio.headFontStyle < 4 ? this.font.main.Name : 'Segoe UI Semibold', this.font.main.Size, this.font.headingStyle);
		}
		this.font.boldAdjust = this.font.headingStyle != 1 && this.font.headingStyle != 4 && this.font.headingStyle != 5 ? 1 : 1.5;
		this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
		this.font.lyrics = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.lyrics.Style);
		this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * pptBio.zoomFont / 100 * (100 + ((pptBio.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
		this.heading.pad = $Bio.clamp(this.heading.pad, -pptBio.gap * 2, this.font.main.Size * 5);
		this.heading.linePad = $Bio.clamp(this.heading.linePad, -pptBio.gap, this.font.main.Size * 5);

		pptBio.zoomFont = Math.round(this.font.zoomSize / biographyFontSize * 100);

		this.font.items.forEach(v => {
			const style = pptBio[v[0]] < 4 ? pptBio[v[0]] : (pptBio[v[0]] - 4) * 2;
			this.font[v[1]] = gdi.Font(pptBio[v[0]] < 4 ? this.font.main.Name : 'Segoe UI Semibold', this.font.main.Size, style);
		});

		this.font.message = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
		this.font.small = gdi.Font(this.font.main.Name, Math.round(this.font.main.Size * 12 / 14), this.font.main.Style);

		this.narrowSbarWidth = pptBio.narrowSbarWidth == 0 ? $Bio.clamp(Math.floor(this.font.main.Size / 7), 2, 10) : pptBio.narrowSbarWidth;
		if (this.id.local) {
			this.font.main = c_font;
			this.font.items.forEach(v => this.font[v[1]] = gdi.Font(this.font.main.Name, this.font.main.Size, pptBio[v[0]]));
			this.font.message = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
			if (pptBio.sbarShow) {
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
		if (this.col.text_h === '') this.col.txt_h = pptBio.themed && pptBio.theme == 9 ? RGB(104, 225, 255) : this.blur.blend ? this.setBrightness(this.col.txt_h, lightBg ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? (pptBio.themed && (pptBio.theme == 1 || pptBio.themed == 2) ? RGB(25, 25, 25) : RGB(71, 129, 183)) : this.col.txt_h;
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

		if (pptBio.swapCol) {
			const colH = this.col.txt_h;
			this.col.txt_h = this.col.txt;
			this.col.txt = colH;
		}

		if (!customColText || pptBio.swapCol) this.col.text = !pptBio.highlightText ? this.col.txt : this.col.txt_h;
		if (!customColText_h || pptBio.swapCol) this.col.text_h = !pptBio.highlightText ? this.col.txt_h : this.col.txt;
		this.col.shadow = this.getSelTextCol(this.col.text_h);
		if (this.col.summary === '') this.col.summary = !pptBio.highlightSummary ? this.col.txt : this.col.txt_h;
		this.col.t = this.style.bg ? this.getButCol(this.col.bg) : 200;

		if (this.stars) {
			this.col.stars = RGB(255, 190, 0);
			['starOn', 'starOff', 'starBor'].forEach((v, i) => {
				this.col[v] = i < 2 ? (this.stars == 2 ? $Bio.RGBtoRGBA(this.col.stars === '' ? pptBio.highlightStars ? this.col.txt : this.col.txt_h : this.col.stars, !i ? 232 : 60) :
					this.style.bg || !this.style.bg && !this.style.trans || this.blur.dark || this.blur.light ? $Bio.RGBtoRGBA(this.col.stars === '' ? pptBio.highlightStars ? this.col.txt_h : this.col.txt : this.col.stars, !i ? 232 : 60) : (this.col.stars === '' ? RGBA(255, 255, 255, !i ? 232 : 60) : $Bio.RGBtoRGBA(this.col.stars, !i ? 232 : 60))) : RGBA(0, 0, 0, 0);
			});
		}

		this.col.bottomLine = this.getLineCol('bottom');
		this.col.centerLine = this.getLineCol('center');
		this.col.sectionLine = this.col.line === '' && !pptBio.colLineDark ? (pptBio.highlightHdLine ? this.col.text_h : this.col.text) & 0x40ffffff : $Bio.RGBAtoRGB(this.col.bottomLine, this.col.bg == 0 ? 0xff000000 : this.col.bg) & 0x56ffffff;
		this.col.edBg = (this.blur.dark ? RGB(0, 0, 0) : this.blur.light ? RGB(255, 255, 255) : this.col.bg) & 0x99ffffff;
		this.col.imgBor = this.col.text & 0x25ffffff;
		const col_txt = this.col.txt == -1 ? RGB(240, 240, 240) : this.col.txt;
		const col_txt_h = this.col.txt_h == -1 ? RGB(240, 240, 240) : this.col.txt_h;
		this.col.dropShadow = RGB(18, 26, 46);
		this.col.source = this.blur.dark ? (pptBio.highlightSubHd ? col_txt_h : col_txt) : !this.blur.light && (pptBio.sourceStyle == 1 || pptBio.sourceStyle == 3) && (pptBio.headFontStyle != 1 && pptBio.headFontStyle != 3) ? this.dim(pptBio.highlightSubHd ? this.col.txt_h : this.col.txt, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : pptBio.highlightSubHd ? this.col.txt_h : this.col.txt;
		this.col.track = this.blur.dark ? (pptBio.highlightSubHd ? col_txt_h : col_txt) : !this.blur.light && (pptBio.trackStyle == 1 || pptBio.trackStyle == 3) && (pptBio.headFontStyle != 1 && pptBio.headFontStyle != 3) ? this.dim(pptBio.highlightSubHd ? this.col.txt_h : this.col.txt, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : pptBio.highlightSubHd ? this.col.txt_h : this.col.txt;

		this.sbar.col = this.blur.dark || this.blur.light ? 1 : pptBio.sbarCol;

		if (this.col.frame === '') this.col.frame = (this.blur.dark ? 0xff808080 : this.blur.light ? 0xA330AFED : this.col.bgSel) & 0xd0ffffff;
		if (this.col.rectOv === '') this.col.rectOv = this.col.bg;
		this.col.rectOv = $Bio.RGBtoRGBA(this.col.rectOv, 255 - this.overlay.strength);
		if (this.col.rectOvBor === '') {
			this.col.rectOvBor = pptBio.highlightOvBor ? this.col.txt_h : this.col.txt;
			this.col.rectOvBor = $Bio.RGBtoRGBA(this.col.rectOvBor, 228);
		}

		if (!pptBio.heading) return;
		this.col.headBtn = this.col.headingBtn === '' ? !pptBio.highlightHdBtn ? this.col.txt : this.col.txt_h : this.col.headingBtn;
		if (this.col.headingText === '') this.col.headingText = !pptBio.highlightHdText ? this.col.txt : this.col.txt_h;
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
		if (!pptBio.colLineDark) return this.col.line === '' ? this.getBlend(this.blur.dark ? RGB(0, 0, 0) : this.blur.light ? RGB(255, 255, 255) : this.col.bg == 0 ? 0xff000000 : this.col.bg, pptBio.highlightHdLine ? this.col.txt_h : this.col.txt, type == 'bottom' || this.style.isBlur ? 0.25 : 0.5) : this.col.line;
		const lightBg = this.isLightBackground();
		const isLightBg = !this.blur.dark && lightBg;
		const nearBlack = ((pptBio.theme == 1 || pptBio.theme == 2) && !this.col.themeLight || (pptBio.theme == 0 || pptBio.theme == 6 || pptBio.theme == 7) && !lightBg) && this.getColSat(this.col.bg) < 45;
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
		panelBio.setStyle();
		butBio.createStars();
		butBio.setTooltipFont();
		txt.getSubHeadWidths();
		txt.artCalc();
		txt.albCalc();
	}

	getSelTextCol(c, bypass) {
		return this.getLuminance(c, bypass) > 0.35 ? RGB(0, 0, 0) : RGB(255, 255, 255);
	}

	getUIColours() {
		const colours = Object.keys(colourSelectorBio);
		this.themeColour = pptBio.themeColour && colours.length ? colourSelectorBio[colours[pptBio.themeColour]] : null;
		if (pptBio.themed && (pptBio.theme == 0 || pptBio.theme == 6 || pptBio.theme == 7) && this.themeColour && pptBio.themeColour) {
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
		if (pptBio.themed && (pptBio.theme == 0 || pptBio.theme == 6 || pptBio.theme == 7) && this.themeColour && pptBio.themeColour) {
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
		if (pptBio.artistView && !pptBio.img_only || !pptBio.artistView && !pptBio.img_only) {
			gr.DrawRect(0, 0, panelBio.w - 1, panelBio.h - 1, 1, RGB(155, 155, 155));
			gr.DrawRect(1, 1, panelBio.w - 3, panelBio.h - 3, 1, RGB(0, 0, 0));
		}
	}

	refreshProp() {
		if (panelBio.style.inclTrackRev == 1) txt.logScrollPos();

		this.heading.pad = pptBio.hdPad;
		this.heading.linePad = pptBio.hdLinePad;
		panelBio.style.fullWidthHeading = pptBio.heading && pptBio.fullWidthHeading;
		panelBio.id.focus = pptBio.focus;
		panelBio.id.lyricsSource = false;
		panelBio.id.nowplayingSource = false;
		panelBio.id.propsSource = false;
		for (let i = 0; i < 8; i++) {
			if (pptBio.txtReaderEnable && pptBio[`useTxtReader${i}`] && pptBio[`pthTxtReader${i}`] && pptBio[`lyricsTxtReader${i}`] && !/item_properties/i.test(utils.SplitFilePath(pptBio[`pthTxtReader${i}`])[1]) && !/nowplaying/i.test(utils.SplitFilePath(pptBio[`pthTxtReader${i}`])[1])) {
				panelBio.id.lyricsSource = true;
				panelBio.id.focus = false;
				break;
			}
		}
		for (let i = 0; i < 8; i++) {
			if (pptBio.txtReaderEnable && pptBio[`useTxtReader${i}`] && /nowplaying/i.test(utils.SplitFilePath(pptBio[`pthTxtReader${i}`])[1])) {
				panelBio.id.nowplayingSource = true;
				panelBio.id.focus = false;
				break;
			}
		}
		for (let i = 0; i < 8; i++) {
			if (pptBio.txtReaderEnable && pptBio[`useTxtReader${i}`] && /item_properties/i.test(utils.SplitFilePath(pptBio[`pthTxtReader${i}`])[1])) {
				panelBio.id.propsSource = true;
				break;
			}
		}
		if (!lyricsBio && panelBio.id.lyricsSource) lyricsBio = new LyricsBio();
		panelBio.id.lookUp = pptBio.lookUp;

		this.show = {
			btnBg: pptBio.hdShowBtnBg,
			btnLabel: pptBio.hdShowBtnLabel,
			btnRedLastfm: pptBio.hdShowRedLfm,
			headingText: pptBio.hdShowTitle
		};
		if (this.show.btnRedLastfm) this.show.btnBg = 1;

		panelBio.checkRefreshRates();
		panelBio.setSummary();
		if (pptBio.typeOverlay > 4 || pptBio.typeOverlay < 0) pptBio.typeOverlay = 0;

		pptBio.overlayStrength = $Bio.clamp(pptBio.overlayStrength, 0, 100);
		pptBio.overlayGradient = $Bio.clamp(pptBio.overlayGradient, 0, 100);
		pptBio.overlayBorderWidth = $Bio.clamp(pptBio.overlayBorderWidth, 1, 20);
		this.overlay = {
			gradient: pptBio.overlayGradient / 10 - 1,
			borderWidth: pptBio.typeOverlay != 2 && pptBio.typeOverlay != 4 ? 0 : pptBio.overlayBorderWidth,
			strength: $Bio.clamp(255 * (100 - pptBio.overlayStrength) / 100, 0, 255)
		};
		pptBio.reflStrength = $Bio.clamp(pptBio.reflStrength, 0, 100);
		pptBio.reflGradient = $Bio.clamp(pptBio.reflGradient, 0, 100);
		pptBio.reflSize = $Bio.clamp(pptBio.reflSize, 0, 100);
		imgBio.refl = {
			adjust: false,
			gradient: pptBio.reflGradient / 10 - 1,
			size: $Bio.clamp(pptBio.reflSize / 100, 0.1, 1),
			strength: $Bio.clamp(255 * pptBio.reflStrength / 100, 0, 255)
		};

		imgBio.mask.reflection = false;
		if (!pptBio.butCustIconFont.length) pptBio.butCustIconFont = 'Segoe UI Symbol';
		this.getColours();
		this.blur.level = pptBio.theme == 2 ? 91.05 - $Bio.clamp(pptBio.blurTemp, 1.05, 90) : $Bio.clamp(pptBio.blurTemp * 2, 0, 254);

		setBiographySize();
		initBiographyColors();
		txt.artCalc(); txt.albCalc(); // Refresh text color

		imgBio.mask.reset = true;
		this.setSbar();
		butBio.setSbarIcon();
		alb_scrollbar.active = true;
		art_scrollbar.active = true;
		[alb_scrollbar, art_scrollbar].forEach(v => {
			v.duration = {
				drag: 200,
				inertia: pptBio.durationTouchFlick,
				full: pptBio.durationScroll
			};
			v.duration.scroll = Math.round(v.duration.full * 0.8);
			v.duration.step = Math.round(v.duration.full * 2 / 3);
			v.duration.bar = v.duration.full;
			v.duration.barFast = v.duration.step;
			v.setCol();
			v.resetAuto();
		});
		butBio.createImages('all');
		this.getFont();
		this.calcText();
		pptBio.thumbNailGap = Math.max(pptBio.thumbNailGap, 0);
		imgBio.createImages();
		filmStrip.set('clear');
		filmStrip.style.image = [pptBio.filmCoverStyle, pptBio.filmPhotoStyle];
		filmStrip.createBorder();
		imgBio.setCrop(true);
		panelBio.alb.ix = 0;
		panelBio.art.ix = 0;
		imgBio.id.albCyc = imgBio.id.curAlbCyc = txt.id.curAlb = txt.id.alb = '';

		butBio.createStars(true);

		txt.artistReset(true);
		txt.albumReset(true);
		txt.albumFlush();
		txt.artistFlush();
		txt.rev.cur = '';
		txt.bio.cur = '';

		txt.bio.loaded = {
			am: false,
			lfm: false,
			wiki: false,
			txt: false,
			ix: -1
		};
		txt.rev.loaded = {
			am: false,
			lfm: false,
			wiki: false,
			txt: false,
			ix: -1
		};

		txt.bio.fallback = pptBio.bioFallbackText.split('|');
		txt.rev.fallback = pptBio.revFallbackText.split('|');
		txt.loadReader();
		txt.getText(true);
		butBio.refresh(true);
		imgBio.processSizeFilter();
		imgBio.art.done = false;
		imgBio.art.allFilesLength = 0;
		imgBio.updImages();
		seeker.upd();

		const origLock = panelBio.lock;
		if (txt.bio.reader || txt.rev.reader) {
			panelBio.lock = 0;
			if (origLock != panelBio.lock) panelBio.mbtn_up(0, 0, false, true);
		}

		if (!panelBio.lock) panelBio.getList(true, true);

		menBio.playlists_changed();
		panelBio.checkNumServers();

		if (pptBio.showFilmStrip && pptBio.autoFilm) txt.getScrollPos();
		if (pptBio.filmStripOverlay) filmStrip.set(pptBio.filmStripPos);
		if (pptBio.text_only && !this.style.isBlur) txt.paint();
	}

	setBrightness(c, percent) {
		c = $Bio.toRGB(c);
		return RGB($Bio.clamp(c[0] + (256 - c[0]) * percent / 100, 0, 255), $Bio.clamp(c[1] + (256 - c[1]) * percent / 100, 0, 255), $Bio.clamp(c[2] + (256 - c[2]) * percent / 100, 0, 255));
	}

	setSbar() {
		pptBio.durationTouchFlick = $Bio.clamp($Bio.value(pptBio.durationTouchFlick, 3000, 0), 0, 5000);
		pptBio.durationScroll = $Bio.clamp($Bio.value(pptBio.durationScroll, 500, 0), 0, 5000);
		pptBio.flickDistance = $Bio.clamp(pptBio.flickDistance, 0, 10);
		pptBio.touchStep = $Bio.clamp(pptBio.touchStep, 1, 10);
		pptBio.sbarType = $Bio.value(pptBio.sbarType, 0, 2);
		this.sbar.type = pptBio.sbarType;
		if (this.sbar.type == 2) {
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
					pptBio.sbarType = 1;
				}
			});
		}
		this.sbar.arrowPad = pptBio.sbarPad;
		pptBio.sbarWidth = $Bio.clamp(pptBio.sbarWidth, 0, 400);
		pptBio.sbarBase_w = $Bio.clamp(pptBio.sbarBase_w, 0, 400);

		if (pptBio.sbarWidth != pptBio.sbarBase_w) {
			pptBio.sbarArrowWidth = Math.min(pptBio.sbarArrowWidth, pptBio.sbarWidth, 400);
		} else {
			pptBio.sbarArrowWidth = $Bio.clamp(pptBio.sbarArrowWidth, 0, 400);
			pptBio.sbarWidth = $Bio.clamp(pptBio.sbarWidth, pptBio.sbarArrowWidth, 400);
		}
		pptBio.sbarBase_w = pptBio.sbarWidth;
		this.sbar.w = pptBio.sbarBase_w;
		this.sbar.but_w = pptBio.sbarArrowWidth;
		let themed_w = 21;
		try {
			themed_w = utils.GetSystemMetrics(2);
		} catch (e) {}
		if (pptBio.sbarWinMetrics) {
			this.sbar.w = themed_w;
			this.sbar.but_w = this.sbar.w;
		}
		else if (pptBio.sbarWidth) {
			this.sbar.w = is_4k ? 26 : 12;
			this.sbar.but_w = is_4k ? 26 : 12;
		}
		if (!pptBio.sbarWinMetrics && this.sbar.type == 2) this.sbar.w = Math.max(this.sbar.w, 12);
		if (!pptBio.sbarShow) this.sbar.w = 0;
		this.sbar.but_h = this.sbar.w + (this.sbar.type != 2 ? 1 : 0);
		if (this.sbar.type != 2) {
			if (pptBio.sbarButType || !this.sbar.type && this.sbar.but_w < Math.round(15 * $Bio.scale)) this.sbar.but_w += 1;
			else if (this.sbar.type == 1 && this.sbar.but_w < Math.round(14 * $Bio.scale)) this.sbar.arrowPad += 1;
		}
		const sp = this.sbar.w - this.sbar.but_w < 5 || this.sbar.type == 2 ? Math.round(1 * $Bio.scale) : 0;
		this.sbar.sp = this.sbar.w ? this.sbar.w + sp : 0;
		this.sbar.arrowPad = $Bio.clamp(-this.sbar.but_h / 5, this.sbar.arrowPad, this.sbar.but_h / 5);
	}

	setStarType() {
		this.stars = $Bio.value(pptBio.star, 1, 1) + 1;
		if ((!pptBio.heading || !pptBio.hdBtnShow || pptBio.hdPos == 2) && this.stars == 1) this.stars = 2;
		if (!pptBio.amRating && !pptBio.lfmRating) this.stars = 0;
	}

	updateProp(prop, value) {
		const serverName = pptBio.serverName;
		Object.entries(prop).forEach(v => {
			pptBio[v[0].replace('_internal', '')] = v[1][value];
		});
		this.refreshProp();
		if (serverName != pptBio.serverName) {
			window.Reload();
			window.NotifyOthers('bio_refresh', 'bio_refresh');
		}
	}

	wheel(step) {
		const biographyFontSize = pref.layout === 'artwork' ? pptBio.baseFontSizeBio_artwork : pptBio.baseFontSizeBio_default;
		if (!panelBio || butBio.trace('lookUp', panelBio.m.x, panelBio.m.y)) return;
		if (vkBio.k('ctrl')) {
			if (butBio.trace('heading', panelBio.m.x, panelBio.m.y)) {
				if (!butBio.trace_src(panelBio.m.x, panelBio.m.y)) {
					pptBio.zoomHead = $Bio.clamp(pptBio.zoomHead += step * 5, 25, 400);
					this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * this.font.zoomSize / (biographyFontSize) * (100 + ((pptBio.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
				} else butBio.setSrcFontSize(step);
			} else if (panelBio.trace.text) {
				this.font.zoomSize += step;
				this.font.zoomSize = Math.max(this.font.zoomSize, 1);
				this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
				this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * this.font.zoomSize / (biographyFontSize) * (100 + ((pptBio.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);

				['lyrics', 'subHeadSource', 'summary', 'subHeadTrack', 'subHeadWiki'].forEach(v => {
					this.font[v] = gdi.Font(this.font[v].Name, this.font.zoomSize, this.font[v].Style);
				});

				this.font.message = gdi.Font(this.font.main.Name, this.font.zoomSize * 1.5, 1);
				this.font.small = gdi.Font(this.font.main.Name, Math.round(this.font.zoomSize * 12 / 14), this.font.main.Style);
				this.narrowSbarWidth = pptBio.narrowSbarWidth == 0 ? $Bio.clamp(Math.floor(this.font.zoomSize / 7), 2, 10) : pptBio.narrowSbarWidth;
			}
			this.calcText();
			butBio.createStars();
			txt.getSubHeadWidths();
			window.Repaint();
			pptBio.zoomFont = Math.round(this.font.zoomSize / (biographyFontSize) * 100);
			this.refresh();
		}
		if (vkBio.k('shift') && pptBio.style > 3 && panelBio.trace.text) {
			this.overlay.strength += (-step * 5);
			this.overlay.strength = $Bio.clamp(this.overlay.strength, 0, 255);
			pptBio.overlayStrength = Math.round((255 - this.overlay.strength) / 2.55);
			this.getColours();
			imgBio.mask.reset = true;
			if (!pptBio.typeOverlay) {
				imgBio.refl.adjust = true;
				if (pptBio.artistView && pptBio.cycPhoto) imgBio.clearArtCache();
				if (panelBio.stndItem()) imgBio.getImages();
				else imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
			} else txt.paint();
		}
	}
}

class VkeysBio {
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

let colourSelectorBio = {}
let syncBio = { image: () => {} }
const syncerBio = pref.customBiographyDir ? `${globals.customBiographyDir}cache\\biography\\themed\\bioSyncTheme.js` : `${fb.ProfilePath}cache\\biography\\themed\\bioSyncTheme.js`;
if (pptBio.themed && $Bio.file(syncerBio)) include(syncerBio);
