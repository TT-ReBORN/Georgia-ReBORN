window.DlgCode = 0x004;

class UserInterfaceBio {
	constructor() {
		this.dui = window.InstanceType;

		if (pptBio.typeOverlay > 4 || pptBio.typeOverlay < 0) pptBio.typeOverlay = 0;
		pptBio.sbarCol = $Bio.clamp(pptBio.sbarCol, 0, 1);

		this.blur = {
			level: 100
		}

		this.col = {
			txt: '',
			txt_h: ''
		}

		this.font = {
			boldAdjust: 1,
			heading: gdi.Font('Segoe UI', 16, 0),
			heading_h: 21,
			headingBaseSize: 16,
			headingCustom: false,
			headingStyle: 1,
			main: gdi.Font('Segoe UI', 16, 0),
			main_h: 21,
			message: gdi.Font('Segoe UI', 16, 0),
			small: gdi.Font('Segoe UI', 10, 0),
			subHeadSource: gdi.Font('Segoe UI', 16, 0),
			subHeadTrack: gdi.Font('Segoe UI', 16, 0),
			zoomSize: 16
		}

		this.heading = {
			h: 30,
			line_y: 0,
			linePad: pptBio.hdLinePad,
			pad: pptBio.hdPad
		}

		this.id = {
			local: typeof conf === 'undefined' ? false : true,
			touch_dn: -1
		}

		pptBio.overlayStrength = $Bio.clamp(pptBio.overlayStrength, 0, 100);
		pptBio.overlayGradient = $Bio.clamp(pptBio.overlayGradient, 0, 100);
		pptBio.overlayBorderWidth = $Bio.clamp(pptBio.overlayBorderWidth, 1, 20);

		this.overlay = {
			gradient: pptBio.overlayGradient / 10 - 1,
			borderWidth: pptBio.typeOverlay != 2 && pptBio.typeOverlay != 4 ? 0 : pptBio.overlayBorderWidth,
			strength: $Bio.clamp(255 * (100 - pptBio.overlayStrength) / 100, 0, 255)
		}

		this.sbar = {
			arrowPad: pptBio.sbarPad,
			but_h: 11,
			but_w: 11,
			col: pptBio.sbarCol,
			narrowWidth: 2,
			sp: 12,
			type: 0,
			w: 11
		}

		if (!pptBio.butCustIconFont.length) pptBio.butCustIconFont = 'Segoe UI Symbol';

		this.show = {
			btnBg: pptBio.hdShowBtnBg,
			btnLabel: pptBio.hdShowBtnLabel,
			btnRedLastfm: pptBio.hdShowRedLfm,
			headingText: pptBio.hdShowTitle
		}

		if (this.show.btnRedLastfm) this.show.btnBg = 1;

		this.style = {
			bg: false,
			isBlur: false,
			l_w: Math.round(1 * $Bio.scale),
			trans: false
		}

		if (pptBio.narrowSbarWidth != 0) pptBio.narrowSbarWidth = $Bio.clamp(pptBio.narrowSbarWidth, 2, 10);
		pptBio.hdLine = $Bio.value(pptBio.hdLine, 1, 2);
		if (pptBio.headFontStyle < 0 || pptBio.headFontStyle > 5) pptBio.headFontStyle = 2;
		this.id.c_c = this.id.local && typeof opt_c_c !== 'undefined';

		this.getColours();
		this.setSbar();
	}

	// Methods

	assignColours() {
		const prop = ['text', 'text_h', 'rectOv', 'rectOvBor', 'bg', 'frame', 'bgTrans'];
		this.col.txt = '';
		this.col.txt_h = '';
		this.style.bg = false;
		this.style.trans = false;
		const set = (c, t) => {
			c = c.replace(/[^0-9.,-]/g, '').split(/[,-]/);
			let cc = '';
			if (c.length != 3 && c.length != 4) return '';
			for (let i = 0; i < c.length; i++) {
				c[i] = parseFloat(c[i]);
				if (i < 3) c[i] = $Bio.clamp(Math.round(c[i]), 0, 255);
				else if (i == 3) {
					if (c[i] <= 1) c[i] = Math.round(255 * c[i]);
					else c[i] = $Bio.clamp(Math.round(c[i]), 0, 255);
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
		}

		prop.forEach((v, i) => {
			this.col[v] = set(pptBio[v + 'Use'] ? pptBio[v] : '', i < 4 ? 0 : 1);
		});
	}

	calcText() {
		$Bio.gr(1, 1, false, g => {
			this.font.main_h = Math.round(g.CalcTextHeight('String', this.font.main) + pptBio.textPad);
			this.font.heading_h = g.CalcTextHeight('String', this.font.heading);
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
		if (this.style.bg) gr.FillSolidRect(this.x - pptBio.borL, this.y - scaleForDisplay(30), panelBio.w, panelBio.h + scaleForDisplay(30), this.col.bg)

		if (albumart && pref.layout_mode !== 'compact_mode' || pref.layout_mode === 'artwork_mode' && !albumart) {
			// Biography's top shadow
			gr.FillGradRect(this.x - pptBio.borL, is_4k ? this.y - 70 : this.y - 36, this.w, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
			);
			// Biography's bottom shadow
			gr.FillGradRect(this.x - pptBio.borL, is_4k ? this.y + (pref.blackTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? this. h : this.h + 1) : this.y + this.h - 1, this.w, scaleForDisplay(5), 90,
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 30) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 74) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 74) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 86) : '',
				RGBtoRGBA(col.shadow, 0)
			);
		}
		// Biography's left shadow
		if (pref.layout_mode !== 'artwork_mode') {
			gr.FillGradRect(ww / 2 - 4, this.y - scaleForDisplay(30), 4, this.h + scaleForDisplay(30), 0, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 38) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 60) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 64) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 28) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
			);
		}
	}

	getBlend(c1, c2, f) {
		const nf = 1 - f;
		let r, g, b, a;
		c1 = this.toRGBA(c1);
		c2 = this.toRGBA(c2);
		r = c1[0] * f + c2[0] * nf;
		g = c1[1] * f + c2[1] * nf;
		b = c1[2] * f + c2[2] * nf;
		a = c1[3] * f + c2[3] * nf;
		return RGBA(Math.round(r), Math.round(g), Math.round(b), Math.round(a));
	}

	getBlurColours() {
		this.style.isBlur = pptBio.theme > 0;
		this.blur = {
			alpha: $Bio.clamp(pptBio.blurAlpha, 0, 100) / 30,
			blend: pptBio.theme == 2,
			blendAlpha: $Bio.clamp($Bio.clamp(pptBio.blurAlpha, 0, 100) * 105 / 30, 0, 255),
			dark: pptBio.theme == 1,
			level: pptBio.theme == 2 ? 91.05 - $Bio.clamp(pptBio.blurTemp, 1.05, 90) : $Bio.clamp(pptBio.blurTemp * 2, 0, 254),
			light: pptBio.theme == 3
		}
		if (this.blur.dark) {
			this.col.bg_light = RGBA(0, 0, 0, Math.min(160 / this.blur.alpha, 255));
			this.col.bg_dark = RGBA(0, 0, 0, Math.min(80 / this.blur.alpha, 255));
			if (pptBio.typeOverlay) {
				if (!pptBio.rectOvUse) this.col.rectOv = RGBA(0, 0, 0, 255 - this.overlay.strength);
			}
		}
		if (this.blur.light) {
			this.col.bg_light = RGBA(255, 255, 255, Math.min(160 / this.blur.alpha, 255));
			this.col.bg_dark = RGBA(255, 255, 255, Math.min(205 / this.blur.alpha, 255));
			if (pptBio.typeOverlay) {
				if (!pptBio.rectOvUse) this.col.rectOv = RGBA(255, 255, 255, 255 - this.overlay.strength);
			}
		}
	}

	getColours() {
		this.assignColours();
		this.getBlurColours();
		this.setStarType();
		this.getUIColours();
		this.getItemColours();
	}

	getFont() {
		if (pptBio.custFontUse && pptBio.custFont.length) {
			const custFont = $Bio.split(pptBio.custFont, 1);
			this.font.main = gdi.Font(custFont[0], Math.max(Math.round($Bio.value(custFont[1], 16, 0)), 1), Math.round($Bio.value(custFont[2], 0, 0)));
		} else if (this.dui) this.font.main = window.GetFontDUI(3);
		else this.font.main = window.GetFontCUI(0);

		if (!this.font.main) {
			this.font.main = gdi.Font('Segoe UI', 16, 0);
			$Bio.trace('Spider Monkey Panel is unable to use your default font. Using Segoe UI at default size & style instead');
		}
		if (this.font.main.Size != pptBio.baseFontSizeBio) pptBio.zoomFont = 100;
		//pptBio.baseFontSizeBio = this.font.headingBaseSize = this.font.main.Size;
		pptBio.baseFontSizeBio = pptBio.baseFontSizeBio; this.font.headingBaseSize = pptBio.baseFontSizeBio;

		this.font.zoomSize = Math.max(Math.round(pptBio.baseFontSizeBio * pptBio.zoomFont / 100), 1);

		if (pptBio.custHeadFontUse && pptBio.custHeadFont.length) {
			const custHeadFont = $Bio.split(pptBio.custHeadFont, 1);
			this.font.headingBaseSize = Math.max(Math.round($Bio.value(custHeadFont[1], 16, 0)), 1);
			this.font.heading = gdi.Font(custHeadFont[0], this.font.headingBaseSize, this.font.headingStyle);
			this.font.headingStyle = Math.round($Bio.value(custHeadFont[2], 3, 0));
			this.font.headingCustom = true;
		} else {
			this.font.headingStyle = pptBio.headFontStyle < 4 ? pptBio.headFontStyle : (pptBio.headFontStyle - 4) * 2;
			this.font.heading = gdi.Font(pptBio.headFontStyle < 4 ? this.font.main.Name : 'Segoe UI Semibold',
				this.font.main.Size, this.font.headingStyle);
		}
		this.font.boldAdjust = this.font.headingStyle != 1 && this.font.headingStyle != 4 && this.font.headingStyle != 5 ? 1 : 1.5;
		this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
		this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * pptBio.zoomFont / 100 * (100 + ((pptBio.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
		this.heading.pad = $Bio.clamp(this.heading.pad, -pptBio.gap * 2, this.font.main.Size * 5);
		this.heading.linePad = $Bio.clamp(this.heading.linePad, -pptBio.gap, this.font.main.Size * 5);

		pptBio.zoomFont = Math.round(this.font.zoomSize / pptBio.baseFontSizeBio * 100);
		const sourceStyle = pptBio.sourceStyle < 4 ? pptBio.sourceStyle : (pptBio.sourceStyle - 4) * 2;
		const trackStyle = pptBio.trackStyle < 4 ? pptBio.trackStyle : (pptBio.trackStyle - 4) * 2;

		this.font.subHeadSource = gdi.Font(pptBio.sourceStyle < 4 ? this.font.main.Name : 'Segoe UI Semibold', this.font.main.Size, sourceStyle);
		this.font.subHeadTrack = gdi.Font(pptBio.trackStyle < 4 ? this.font.main.Name : 'Segoe UI Semibold', this.font.main.Size, trackStyle);
		this.font.message = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
		this.font.small = gdi.Font(this.font.main.Name, Math.round(this.font.main.Size * 12 / 14), this.font.main.Style);

		this.narrowSbarWidth = pptBio.narrowSbarWidth == 0 ? $Bio.clamp(Math.floor(this.font.main.Size / 7), 2, 10) : pptBio.narrowSbarWidth;
		if (this.id.local) {
			this.font.main = c_font;
			this.font.subHeadSource = gdi.Font(this.font.main.Name, this.font.main.Size, pptBio.sourceStyle);
			this.font.subHeadTrack = gdi.Font(this.font.main.Name, this.font.main.Size, pptBio.trackStyle);
			this.font.message = gdi.Font(this.font.main.Name, this.font.main.Size * 1.5, 1);
			if (pptBio.sbarShow) {
				this.sbar.type = 0;
				this.sbar.w = c_scr_w;
				this.sbar.but_w = this.sbar.w + 1;
				this.sbar.but_h = this.sbar.w + 1;
				this.sbar.sp = this.sbar.w + 1;
			}
		}

		this.calcText();
		panelBio.setStyle();
		butBio.createStars();
		txt.getWidths();
		txt.artCalc();
		txt.albCalc();
	}

	getItemColours() {
		const lightBg = this.getSelCol(this.col.bg == 0 ? 0xff000000 : this.col.bg, true) == 50;

		if (this.col.text === '') this.col.txt = this.blur.blend ? this.setBrightness(this.col.txt, lightBg ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? RGB(0, 0, 0) : this.col.txt;
		else this.col.txt = this.col.text;
		if (this.col.text_h === '') this.col.txt_h = this.blur.blend ? this.setBrightness(this.col.txt_h, lightBg ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? RGB(71, 129, 183) : this.col.txt_h;
		else this.col.txt_h = this.col.text_h;
		if (window.IsTransparent && this.col.bgTrans) {
			this.style.bg = true;
			this.col.bg = this.col.bgTrans
		}
		if (!window.IsTransparent || this.dui) this.style.bg = true;

		if (this.id.local) {
			this.style.trans = c_trans;
			this.col.bg = c_backcol;
			this.col.txt = this.blur.blend ? this.setBrightness(c_textcol, this.getSelCol(c_backcol == 0 ? 0xff000000 : c_backcol, true) == 50 ? -10 : 10) : this.blur.dark ? RGB(255, 255, 255) : this.blur.light ? RGB(0, 0, 0) : c_textcol;
			this.col.txt_h = this.blur.blend ? this.setBrightness(c_textcol_h, this.getSelCol(c_backcol == 0 ? 0xff000000 : c_backcol, true) == 50 ? -10 : 10) : this.blur.dark || !this.style.bg && this.style.trans && !this.blur.light ? RGB(255, 255, 255) : this.blur.light ? RGB(71, 129, 183) : c_textcol_h;
		}

		this.col.bg1 = lightBg ? 0x08000000 : 0x08ffffff;
		if (pptBio.swapCol) {
			const colH = this.col.txt_h;
			this.col.txt_h = this.col.txt;
			this.col.txt = colH;
		}

		this.col.text = !pptBio.highlightText ? this.col.txt : this.col.txt_h;
		this.col.text_h = !pptBio.highlightText ? this.col.txt_h : this.col.txt;
		this.col.btn = pptBio.highlightHdBtn ? this.col.txt_h : this.col.txt;
		this.col.shadow = this.getSelCol(this.col.text_h, false);
		this.col.t = this.style.bg ? this.getSelCol(this.col.bg, true) : 200;

		if (this.stars) {
			['starOn', 'starOff', 'starBor'].forEach((v, i) => {
				this.col[v] = i < 2 ? (this.stars == 2 ? this.RGBtoRGBA(pptBio.highlightStars ? this.col.txt : rgb(255, 190, 0), !i ? 232 : 60) :
					this.style.bg || !this.style.bg && !this.style.trans || this.blur.dark || this.blur.light ? this.RGBtoRGBA(pptBio.highlightStars ? rgb(255, 190, 0) : this.col.txt, !i ? 232 : 60) : RGBA(255, 255, 255, !i ? 232 : 60)) : RGBA(0, 0, 0, 0);
			});
		}

		this.col.bottomLine = this.getLineCol('bottom');
		this.col.centerLine = this.getLineCol('center');
		this.col.edBg = (this.blur.dark ? RGB(0, 0, 0) : this.blur.light ? RGB(255, 255, 255) : this.col.bg) & 0x99ffffff;
		this.col.imgBor = this.col.text & 0x25ffffff;
		this.col.source = this.blur.dark ? RGB(240, 240, 240) : !this.blur.light && (pptBio.sourceStyle == 1 || pptBio.sourceStyle == 3) && (pptBio.headFontStyle != 1 && pptBio.headFontStyle != 3) ? this.dim(pptBio.highlightSubHd ? this.col.txt_h : this.col.txt, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : pptBio.highlightSubHd ? this.col.txt_h : this.col.txt;
		this.col.track = this.blur.dark ? RGB(240, 240, 240) : !this.blur.light && (pptBio.trackStyle == 1 || pptBio.trackStyle == 3) && (pptBio.headFontStyle != 1 && pptBio.headFontStyle != 3) ? this.dim(pptBio.highlightSubHd ? this.col.txt_h : this.col.txt, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : pptBio.highlightSubHd ? this.col.txt_h : this.col.txt;

		this.sbar.col = this.blur.dark || this.blur.light ? 1 : pptBio.sbarCol;

		if (this.col.frame === '') this.col.frame = (this.blur.dark ? 0xff808080 : this.blur.light ? 0xA330AFED : this.col.bgSel) & 0xd0ffffff;
		if (this.col.rectOv === '') this.col.rectOv = this.col.bg;
		this.col.rectOv = this.RGBtoRGBA(this.col.rectOv, 255 - this.overlay.strength);
		if (this.col.rectOvBor === '') {
			this.col.rectOvBor = pptBio.highlightOvBor ? this.col.txt_h : this.col.txt;
			this.col.rectOvBor = this.RGBtoRGBA(this.col.rectOvBor, 228);
		}

		if (!pptBio.heading) return;
		this.col.head = pptBio.highlightHdText ? this.col.txt_h : this.col.txt;
		['blend1', 'blend2', 'blend3'].forEach((v, i) => {
			this.col[v] = this.blur.blend ? this.col.btn & RGBA(255, 255, 255, i == 2 ? 40 : 12) : this.blur.dark || !this.style.bg && this.style.trans && !this.blur.light ? (i == 2 ? RGBA(255, 255, 255, 50) : RGBA(0, 0, 0, 40)) : this.blur.light ? RGBA(0, 0, 0, i == 2 ? 40 : 15) : this.getBlend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.btn, !i ? 0.9 : i == 2 ? 0.87 : (this.style.isBlur ? 0.75 : 0.82));
		});
		this.col.blend4 = this.toRGBA(this.col.blend1);
	}

	getLineCol(type) {
		return this.getBlend(this.blur.dark ? RGB(0, 0, 0) : this.blur.light ? RGB(255, 255, 255) : this.col.bg == 0 ? 0xff000000 : this.col.bg, pptBio.highlightHdLine ? this.col.txt_h : this.col.txt, type == 'bottom' || this.style.isBlur ? 0.25 : 0.5);
	}

	getSelCol(c, n, bypass) {
		if (!bypass) c = $Bio.toRGB(c);
		const cc = c.map(v => {
			v /= 255;
			return v <= 0.03928 ? v /= 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4);
		});
		const L = 0.2126 * cc[0] + 0.7152 * cc[1] + 0.0722 * cc[2];
		if (L > 0.31) return n ? 50 : RGB(0, 0, 0);
		else return n ? 200 : RGB(255, 255, 255);
	}

	getUIColours() {
		switch (this.dui) {
			case 0:
				if (this.col.bg === '') this.col.bg = window.GetColourCUI(3);
				this.col.bgSel = this.blur.dark ? RGBA(255, 255, 255, 36) : this.blur.light ? RGBA(0, 0, 0, 36) : window.GetColourCUI(4);
				this.col.txt = window.GetColourCUI(0);
				this.col.txt_h = window.GetColourCUI(2);
				break;
			case 1:
				if (this.col.bg === '') this.col.bg = window.GetColourDUI(1);
				this.col.bgSel = this.blur.dark ? RGBA(255, 255, 255, 36) : this.blur.light ? RGBA(0, 0, 0, 36) : window.GetColourDUI(3);
				this.col.txt = window.GetColourDUI(0);
				this.col.txt_h = window.GetColourDUI(2);
				break;
		}
	}

	lines(gr) {
		if (!this.id.c_c) return;
		if (pptBio.artistView && !pptBio.img_only || !pptBio.artistView && !pptBio.img_only && txt.text) {
			gr.DrawRect(0, 0, panelBio.w - 1, panelBio.h - 1, 1, RGB(155, 155, 155));
			gr.DrawRect(1, 1, panelBio.w - 3, panelBio.h - 3, 1, RGB(0, 0, 0));
		}
	}

	RGBtoRGBA(rgb, a) {
		return a << 24 | rgb & 0x00FFFFFF;
	}

	set(n, i) {
		switch (n) {
			case 'headFontStyle':
			case 'sourceStyle':
			case 'trackStyle':
				pptBio[n] = pptBio[n] == i ? 0 : i;
				txt.refresh(4);
				break;
			case 'lineSpacing': {
				const ok_callback = (status, input) => {
					if (status != 'cancel') {
						if (input === pptBio.textPad) return false;
						pptBio.textPad = Math.round(input);
						if (isNaN(pptBio.textPad)) pptBio.textPad = 0;
						pptBio.textPad = $Bio.clamp(pptBio.textPad, 0, 100);
						this.updSbar();
					}
				}
				popUpBox.inputApply('Line Spacing', 'Enter number to pad line height\n\n0 or higher', ok_callback, '', pptBio.textPad);
				break;
			}
			case 'sbarButType':
				pptBio.sbarButType = i;
				this.updSbar();
				break;
			case 'sbarType':
				this.sbar.type = i;
				pptBio.sbarType = i;
				this.updSbar();
				break;
			case 'sbarWinMetrics':
				pptBio.toggle(n);
				this.updSbar();
				break;
			case 'scrollbar':
				pptBio.sbarShow = i;
				this.updSbar();
				break;
		}
	}

	updateProp(prop, value) {
		Object.entries(prop).forEach(v => {
			pptBio[v[0].replace('_internal', '')] = v[1][value]
		});
		if (panelBio.style.inclTrackRev == 1) txt.logScrollPos();

		this.heading.pad = pptBio.hdPad;
		this.heading.linePad = pptBio.hdLinePad;
		panelBio.style.fullWidthHeading = pptBio.heading && pptBio.fullWidthHeading;
		panelBio.id.imgText = pptBio.imgText || pptBio.lookUp == 2;
		this.show = {
			btnBg: pptBio.hdShowBtnBg,
			btnLabel: pptBio.hdShowBtnLabel,
			btnRedLastfm: pptBio.hdShowRedLfm,
			headingText: pptBio.hdShowTitle
		};
		if (this.show.btnRedLastfm) this.show.btnBg = 1;

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
		this.blur.level = pptBio.blurBlend ? 91.05 - $Bio.clamp(pptBio.blurTemp, 1.05, 90) : $Bio.clamp(pptBio.blurTemp * 2, 0, 254);
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
		filmStrip.createBorder();
		imgBio.setCrop(true);
		imgBio.id.albCyc = '';
		imgBio.id.curAlbCyc = '';

		imgBio.clearCache();
		butBio.createStars();
		txt.albumFlush();
		txt.artistFlush();
		txt.rev.cur = '';
		txt.bio.cur = '';
		txt.bio.fallback = pptBio.bioFallbackText.split('|');
		txt.bio.amSubHead = pptBio.amBioSubHead.split('|');
		txt.bio.lfmSubHead = pptBio.lfmBioSubHead.split('|');
		txt.rev.fallback = pptBio.revFallbackText.split('|');
		txt.rev.amSubHead = pptBio.amRevSubHead.split('|')
		txt.rev.lfmSubHead = pptBio.lfmRevSubHead.split('|')

		txt.getText(true);
		butBio.refresh(true);
		imgBio.processSizeFilter();
		imgBio.getImages();
		seeker.upd();

		menBio.playlists_changed();

		if (pptBio.showFilmStrip && pptBio.autoFilm) txt.getScrollPos();
		if (pptBio.text_only && !uiBio.style.isBlur) txt.paint();

		initBiographyColors();
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

	toRGBA(c) {
		return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];
	}

	wheel(step) {
		if (!panelBio || butBio.trace('lookUp', panelBio.m.x, panelBio.m.y)) return;
		if (vkBio.k('ctrl')) {
			if (butBio.trace('heading', panelBio.m.x, panelBio.m.y)) {
				if (!butBio.trace_src(panelBio.m.x, panelBio.m.y)) {
					pptBio.zoomHead = $Bio.clamp(pptBio.zoomHead += step * 5, 25, 400);
					this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * this.font.zoomSize / pptBio.baseFontSizeBio * (100 + ((pptBio.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
				} else butBio.setSrcFontSize(step);
			} else if (panelBio.trace.text) {
				this.font.zoomSize += step;
				this.font.zoomSize = Math.max(this.font.zoomSize, 1);
				this.font.main = gdi.Font(this.font.main.Name, this.font.zoomSize, this.font.main.Style);
				this.font.heading = gdi.Font(this.font.heading.Name, Math.max(Math.round(this.font.headingBaseSize * this.font.zoomSize / pptBio.baseFontSizeBio * (100 + ((pptBio.zoomHead - 100) / this.font.boldAdjust)) / 100), 6), this.font.headingStyle);
				this.font.subHeadSource = gdi.Font(this.font.subHeadSource.Name, this.font.zoomSize, this.font.subHeadSource.Style);
				this.font.subHeadTrack = gdi.Font(this.font.subHeadTrack.Name, this.font.zoomSize, this.font.subHeadTrack.Style);
				this.font.message = gdi.Font(this.font.main.Name, this.font.zoomSize * 1.5, 1);
				this.font.small = gdi.Font(this.font.main.Name, Math.round(this.font.zoomSize * 12 / 14), this.font.main.Style);
				this.narrowSbarWidth = pptBio.narrowSbarWidth == 0 ? $Bio.clamp(Math.floor(this.font.zoomSize / 7), 2, 10) : pptBio.narrowSbarWidth;
			}
			this.calcText();
			butBio.createStars();
			txt.getWidths();
			window.Repaint();
			pptBio.zoomFont = Math.round(this.font.zoomSize / pptBio.baseFontSizeBio * 100);
			txt.refresh(5);
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