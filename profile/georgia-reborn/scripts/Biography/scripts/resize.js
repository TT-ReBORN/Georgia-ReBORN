'use strict';

class ResizeHandler {
	constructor() {
		this.down = false;
		this.editorFont = gdi.Font(fontDefault, 15 * $Bio.scale, 1);
		this.focus = true;
		this.lc = StringFormat(0, 1);
		this.init_x = 0;
		this.init_y = 0;
		this.updFilm = false;
		this.x_init = 0;
		this.y_init = 0;
		this.x_start = 0;
		this.y_start = 0;
		this.sf = '';
		this.si = '';
		this.st = '';

		this.cursorId = {
			all: 32646,
			left: 32644,
			right: 32644,
			ne: 32643,
			sw: 32643,
			nw: 32642,
			se: 32642,
			top: 32645,
			bottom: 32645
		};
	}

	// Methods

	drawEd(gr) {
		if (vkBio.k('ctrl') && this.focus && panelBio.m.y != -1 || panelBio.style.new) {
			const ed = gr.MeasureString(this.editText(), this.editorFont, 15, 15, panelBio.w - 15, panelBio.h - 15, this.lc);
			gr.FillSolidRect(10, 10, ed.Width + 10, ed.Height + 10, uiBio.col.edBg);
			if (!pptBio.text_only && !pptBio.img_only) {
				if (pptBio.style > 4) {
					if (!vkBio.k('shift')) gr.DrawRect(panelBio.ibox.l + 2, panelBio.ibox.t + 2, panelBio.ibox.w - 4, panelBio.ibox.h - 4, 5, RGB(0, 255, 0));
					if (!vkBio.k('alt')) gr.DrawRect(panelBio.tbox.l + 2, panelBio.tbox.t + 2, panelBio.tbox.w - 4, panelBio.tbox.h - 4, 5, RGB(255, 0, 0));
				} else if (pptBio.style < 4) {
					switch (pptBio.style) {
						case 0:
							gr.FillSolidRect(0, panelBio.img.t + panelBio.style.imgSize, panelBio.w, 5, RGB(255, 128, 0));
							break;
						case 1:
							gr.FillSolidRect(panelBio.img.l - 5, 0, 5, panelBio.h, RGB(255, 128, 0));
							break;
						case 2:
							gr.FillSolidRect(0, panelBio.img.t - 5, panelBio.w, 5, RGB(255, 128, 0));
							break;
						case 3:
							gr.FillSolidRect(panelBio.img.l + panelBio.style.imgSize, 0, 5, panelBio.h, RGB(255, 128, 0));
							break;
					}
				}
			}
			if (panelBio.style.showFilmStrip) {
				switch (pptBio.filmStripPos) {
					case 0:
						gr.FillSolidRect(0, filmStrip.y + filmStrip.h, panelBio.w, 5, RGB(0, 255, 255));
						break;
					case 1:
						gr.FillSolidRect(filmStrip.x - 5, 0, 5, panelBio.h, RGB(0, 255, 255));
						break;
					case 2:
						gr.FillSolidRect(0, filmStrip.y - 5, panelBio.w, 5, RGB(0, 255, 255));
						break;
					case 3:
						gr.FillSolidRect(filmStrip.x + filmStrip.w, 0, 5, panelBio.h, RGB(0, 255, 255));
						break;
				}
			}
			gr.SetTextRenderingHint(5);
			gr.DrawString(this.editText(), this.editorFont, uiBio.col.shadow, 16, 16, ed.Width, ed.Height, this.lc);
			gr.DrawString(this.editText(), this.editorFont, uiBio.col.text_h, 15, 15, ed.Width, ed.Height, this.lc);
		}
	}

	editText() {
		return `${(pptBio.text_only ? `Type: Text Only${panelBio.style.showFilmStrip ? '\n - Layout Adjust: Drag Line' : ''}` : (pptBio.img_only ? `Type: Image Only${panelBio.style.showFilmStrip ? '\n - Layout Adjust: Drag Line' : ''}` : `Name: ${panelBio.style.name[pptBio.style]}${pptBio.style < 4 ? `\n\nType: Auto\n - Layout Adjust: Drag Line${panelBio.style.showFilmStrip && !pptBio.img_only && pptBio.style != 4 ? 's' : ''}\n - Image Strength: Shift + Wheel Over Text` : pptBio.style == 4 ? `\n\nType: Auto${panelBio.style.showFilmStrip && !pptBio.img_only ? '\n - Layout Adjust: Drag Line' : ''}\n - Image Strength: Shift + Wheel Over Text` : '\n\nType: Freestyle\n - Layout Adjust: Drag Lines or Boxes: Ctrl (Any), Ctrl + Alt (Image), Ctrl + Shift (Text) or Ctrl + Alt + Shift (Filmstrip)\n - Overlay Strength: Shift + Wheel Over Text'}`)) + (imgBio.isType('Refl') && !pptBio.text_only && pptBio.style != 4 ? '\n - Reflection Strength: Shift + Wheel Over Main Image' : '') + (!pptBio.img_only ? '\n - Text Size: Ctrl + Wheel Over Text' : '')}\n - ${pptBio.style != 4 ? '' : 'Text '}Padding: Display Tab`;
	}

	filmMove(x, y) {
		if (!this.focus || !panelBio.style.showFilmStrip || !vkBio.k('ctrl')) return;
		if (!this.down) {
			switch (pptBio.filmStripPos) {
				case 0:
					this.sf = y > filmStrip.y + filmStrip.h && y < filmStrip.y + filmStrip.h + 5;
					if (this.sf) window.SetCursor(32645);
					break;
				case 1:
					this.sf = x > filmStrip.x - 5 && x < filmStrip.x;
					if (this.sf) window.SetCursor(32644);
					break;
				case 2:
					this.sf = y > filmStrip.y - 5 && y < filmStrip.y;
					if (this.sf) window.SetCursor(32645);
					break;
				case 3:
					this.sf = x > filmStrip.x + filmStrip.w && x < filmStrip.x + filmStrip.w + 5;
					if (this.sf) window.SetCursor(32644);
					break;
			}
		}
		if (!this.down || !this.sf) return;
		switch (pptBio.filmStripPos) {
			case 0:
				pptBio.filmStripSize = (pptBio.filmStripSize * panelBio.h + y - this.y_start) / panelBio.h;
				pptBio.filmStripSize = $Bio.clamp(parseFloat(pptBio.filmStripSize.toFixed(15)), 0.02, filmStrip.max_sz / panelBio.h);
				break;
			case 1:
				pptBio.filmStripSize = (pptBio.filmStripSize * panelBio.w + this.x_start - x) / panelBio.w;
				pptBio.filmStripSize = $Bio.clamp(parseFloat(pptBio.filmStripSize.toFixed(15)), 0.02, filmStrip.max_sz / panelBio.w);
				break;
			case 2:
				pptBio.filmStripSize = (pptBio.filmStripSize * panelBio.h + this.y_start - y) / panelBio.h;
				pptBio.filmStripSize = $Bio.clamp(parseFloat(pptBio.filmStripSize.toFixed(15)), 0.02, filmStrip.max_sz / panelBio.h);
				break;
			case 3:
				pptBio.filmStripSize = (pptBio.filmStripSize * panelBio.w + x - this.x_start) / panelBio.w;
				pptBio.filmStripSize = $Bio.clamp(parseFloat(pptBio.filmStripSize.toFixed(15)), 0.02, filmStrip.max_sz / panelBio.w);
				break;
		}
		filmStrip.logScrollPos();
		filmStrip.setSize();
		window.Repaint();
		this.updFilm = true;
		this.x_start = x;
		this.y_start = y;
	}

	lbtn_dn(x, y) {
		panelBio.style.new = false;
		if (!vkBio.k('ctrl')) return;
		this.down = true;
		this.updFilm = false;
		this.init_x = x;
		this.init_y = y;
		this.x_init = x;
		this.y_init = y;
		this.x_start = x;
		this.y_start = y;
	}

	lbtn_up() {
		if (!this.down || !this.focus) return;
		window.SetCursor(32512);
		this.down = false;
		imgBio.mask.reset = true;
		if (pptBio.style > 3) {
			const obj = pptBio.style == 4 || pptBio.style == 5 ? panelBio.style.overlay : panelBio.style.free[pptBio.style - 6];
			const imL = Math.round(panelBio.im.l * panelBio.w);
			const imR = Math.round(panelBio.im.r * panelBio.w);
			const imT = Math.round(panelBio.im.t * panelBio.h);
			const imB = Math.round(panelBio.im.b * panelBio.h);
			const txL = Math.round(panelBio.tx.l * panelBio.w);
			const txR = Math.round(panelBio.tx.r * panelBio.w);
			const txT = Math.round(panelBio.tx.t * panelBio.h);
			const txB = Math.round(panelBio.tx.b * panelBio.h);
			let sv = false;
			if (panelBio.h > txB + txT + pptBio.textT + pptBio.textB + 10 && panelBio.w > txR + txL + pptBio.textL + pptBio.textR + 10) {
				obj.txL = panelBio.tx.l;
				obj.txR = panelBio.tx.r;
				obj.txT = panelBio.tx.t;
				obj.txB = panelBio.tx.b;
				sv = true;
			}
			if (panelBio.h > imB + imT + panelBio.bor.t + panelBio.bor.b + 10 && panelBio.w > imR + imL + panelBio.bor.l + panelBio.bor.r + 10) {
				obj.imL = panelBio.im.l;
				obj.imR = panelBio.im.r;
				obj.imT = panelBio.im.t;
				obj.imB = panelBio.im.b;
				sv = true;
			}
			if (sv) {
				pptBio.style == 4 ? pptBio.styleOverlay = JSON.stringify(panelBio.style.overlay) : pptBio.styleFree = JSON.stringify(panelBio.style.free);
			} else {
				panelBio.im.l = $Bio.clamp(obj.imL, 0, 1);
				panelBio.im.r = $Bio.clamp(obj.imR, 0, 1);
				panelBio.im.t = $Bio.clamp(obj.imT, 0, 1);
				panelBio.im.b = $Bio.clamp(obj.imB, 0, 1);
				panelBio.tx.l = $Bio.clamp(obj.txL, 0, 1);
				panelBio.tx.r = $Bio.clamp(obj.txR, 0, 1);
				panelBio.tx.t = $Bio.clamp(obj.txT, 0, 1);
				panelBio.tx.b = $Bio.clamp(obj.txB, 0, 1);
			}
		}
		filmStrip.clearCache();
		if (panelBio.style.showFilmStrip && pptBio.filmStripOverlay) filmStrip.set(pptBio.filmStripPos);
		txt.refresh(this.updFilm ? 0 : 3);
		filmStrip.paint();
	}

	imgMove(x, y) {
		if (!this.focus || pptBio.img_only || pptBio.text_only || pptBio.style == 4) return;
		switch (true) {
			case pptBio.style > 3: {
				if (!vkBio.k('ctrl') || vkBio.k('shift')) break;
				if (!this.down) {
					this.si = y > panelBio.ibox.t - 5 && y < panelBio.ibox.t + 5 && x > panelBio.ibox.l + 10 && x < panelBio.ibox.l + panelBio.ibox.w - 10 ? 'top' :
						y > panelBio.ibox.t - 5 && y < panelBio.ibox.t + 15 && x > panelBio.ibox.l && x < panelBio.ibox.l + 10 ? 'nw' :
						y > panelBio.ibox.t - 5 && y < panelBio.ibox.t + 15 && x > panelBio.ibox.l + panelBio.ibox.w - 10 && x < panelBio.ibox.l + panelBio.ibox.w ? 'ne' :
						y > panelBio.ibox.t + panelBio.ibox.h - 5 && y < panelBio.ibox.t + panelBio.ibox.h + 5 && x > panelBio.ibox.l + 10 && x < panelBio.ibox.l + panelBio.ibox.w - 5 ? 'bottom' :
						y > panelBio.ibox.t + panelBio.ibox.h - 15 && y < panelBio.ibox.t + panelBio.ibox.h + 5 && x > panelBio.ibox.l && x < panelBio.ibox.l + 10 ? 'sw' :
						y > panelBio.ibox.t + panelBio.ibox.h - 15 && y < panelBio.ibox.t + panelBio.ibox.h + 5 && x > panelBio.ibox.l + panelBio.ibox.w - 10 && x < panelBio.ibox.l + panelBio.ibox.w ? 'se' :
						y > panelBio.ibox.t && y < panelBio.ibox.t + panelBio.ibox.h && x > panelBio.ibox.l - 5 && x < panelBio.ibox.l + 5 ? 'left' :
						y > panelBio.ibox.t && y < panelBio.ibox.t + panelBio.ibox.h && x > panelBio.ibox.l + panelBio.ibox.w - 5 && x < panelBio.ibox.l + panelBio.ibox.w + 5 ? 'right' :
						y > panelBio.ibox.t + 20 && y < panelBio.ibox.t + panelBio.ibox.h - 20 && x > panelBio.ibox.l + 20 && x < panelBio.ibox.l + panelBio.ibox.w - 20 ? 'all' : '';
					this.setCursor(this.si);
				}
				if (!this.down || !this.si) return;
				const filmStrip = {
					t: !pptBio.filmStripOverlay ? panelBio.filmStripSize.t : 0,
					b: !pptBio.filmStripOverlay ? panelBio.filmStripSize.b : 0,
					l: !pptBio.filmStripOverlay ? panelBio.filmStripSize.l : 0,
					r: !pptBio.filmStripOverlay ? panelBio.filmStripSize.r : 0
				};
				let imT = Math.round(panelBio.im.t * panelBio.h) + filmStrip.t;
				let imB = Math.round(panelBio.im.b * panelBio.h) + filmStrip.b;
				let imL = Math.round(panelBio.im.l * panelBio.w) + filmStrip.l;
				let imR = Math.round(panelBio.im.r * panelBio.w) + filmStrip.r;
				switch (this.si) {
					case 'top':
						if (y > panelBio.h - imB - 30) break;
						panelBio.im.t = $Bio.clamp((y - filmStrip.t) / panelBio.h, 0, 1);
						break;
					case 'nw':
						if (y < panelBio.h - imB - 30) panelBio.im.t = $Bio.clamp((y - filmStrip.t) / panelBio.h, 0, 1);
						if (x > panelBio.w - imR - 30) break;
						panelBio.im.l = $Bio.clamp((x - filmStrip.l) / panelBio.w, 0, 1);
						break;
					case 'ne':
						if (y < panelBio.h - imB - 30) panelBio.im.t = $Bio.clamp((y - filmStrip.t) / panelBio.h, 0, 1);
						if (x < imL + 30) break;
						panelBio.im.r = $Bio.clamp((panelBio.w - x - filmStrip.r) / panelBio.w, 0, 1);
						break;
					case 'left':
						if (x > panelBio.w - imR - 30) break;
						panelBio.im.l = $Bio.clamp((x - filmStrip.l) / panelBio.w, 0, 1);
						break;
					case 'bottom':
						if (y < imT + 30) break;
						panelBio.im.b = $Bio.clamp((panelBio.h - y - filmStrip.b) / panelBio.h, 0, 1);
						break;
					case 'sw':
						if (x < panelBio.w - imR - 30) panelBio.im.l = $Bio.clamp((x - filmStrip.l) / panelBio.w, 0, 1);
						if (y < imT + 30) break;
						panelBio.im.b = $Bio.clamp((panelBio.h - y - filmStrip.b) / panelBio.h, 0, 1);
						break;
					case 'se':
						if (y > imT + 30) panelBio.im.b = $Bio.clamp((panelBio.h - y - filmStrip.b) / panelBio.h, 0, 1);
						if (x < imL + 30) break;
						panelBio.im.r = $Bio.clamp((panelBio.w - x - filmStrip.r) / panelBio.w, 0, 1);
						break;
					case 'right':
						if (x < imL + 30) break;
						panelBio.im.r = $Bio.clamp((panelBio.w - x - filmStrip.r) / panelBio.w, 0, 1);
						break;
					case 'all':
						if (imT <= filmStrip.t && y - this.init_y < 0 || imB <= filmStrip.b && y - this.init_y > 0 || imL <= filmStrip.l && x - this.init_x < 0 || imR <= filmStrip.r && x - this.init_x > 0) break;
						imT += (y - this.y_init);
						panelBio.im.t = $Bio.clamp((imT - filmStrip.t) / panelBio.h, 0, 1);
						imB = panelBio.h - Math.max(imT, 0) - panelBio.ibox.h;
						panelBio.im.b = $Bio.clamp((imB - filmStrip.b) / panelBio.h, 0, 1);
						imL += (x - this.x_init);
						panelBio.im.l = $Bio.clamp((imL - filmStrip.l) / panelBio.w, 0, 1);
						imR = panelBio.w - Math.max(imL, 0) - panelBio.ibox.w;
						panelBio.im.r = $Bio.clamp((imR - filmStrip.r) / panelBio.w, 0, 1);
						break;
				}
				this.sizes(true);
				break;
			}
			case pptBio.style < 4: {
				if (!vkBio.k('ctrl')) break;
				if (!this.down) {
					switch (pptBio.style) {
						case 0:
							this.si = y > panelBio.img.t + panelBio.style.imgSize && y < panelBio.img.t + panelBio.style.imgSize + 5;
							if (this.si) window.SetCursor(32645);
							break;
						case 1:
							this.si = x > panelBio.img.l - 5 && x < panelBio.img.l;
							if (this.si) window.SetCursor(32644);
							break;
						case 2:
							this.si = y > panelBio.img.t - 5 && y < panelBio.img.t;
							if (this.si) window.SetCursor(32645);
							break;
						case 3:
							this.si = x > panelBio.img.l + panelBio.style.imgSize && x < panelBio.img.l + panelBio.style.imgSize + 5;
							if (this.si) window.SetCursor(32644);
							break;
					}
				}
				if (!this.down || !this.si) return;
				const filmStrip = {
					t: !pptBio.filmStripOverlay ? panelBio.filmStripSize.t : 0,
					b: !pptBio.filmStripOverlay ? panelBio.filmStripSize.b : 0,
					l: !pptBio.filmStripOverlay ? panelBio.filmStripSize.l : 0,
					r: !pptBio.filmStripOverlay ? panelBio.filmStripSize.r : 0
				};
				const ph = panelBio.h - filmStrip.t - filmStrip.b;
				const pw = panelBio.w - filmStrip.l - filmStrip.r;
				switch (pptBio.style) {
					case 0:
						pptBio.rel_imgs = (pptBio.rel_imgs * ph + y - this.y_init) / ph;
						break;
					case 1:
						pptBio.rel_imgs = (pptBio.rel_imgs * pw + this.x_init - x) / pw;
						break;
					case 2:
						pptBio.rel_imgs = (pptBio.rel_imgs * ph + this.y_init - y) / ph;
						break;
					case 3:
						pptBio.rel_imgs = (pptBio.rel_imgs * pw + x - this.x_init) / pw;
						break;
				}
				pptBio.rel_imgs = $Bio.clamp(parseFloat(pptBio.rel_imgs.toFixed(15)), 0.1, 0.9);
				this.sizes();
				break;
			}
		}
		this.x_init = x;
		this.y_init = y;
	}

	move(x, y) {
		if (pptBio.style < 4 || pptBio.img_only || pptBio.text_only || !vkBio.k('ctrl') || vkBio.k('alt') || !this.focus || pptBio.style == 4) return;
		if (!this.down) {
			this.st = y > panelBio.tbox.t - 5 && y < panelBio.tbox.t + 5 && x > panelBio.tbox.l + 10 && x < panelBio.tbox.l + panelBio.tbox.w - 10 ? 'top' :
				y > panelBio.tbox.t - 5 && y < panelBio.tbox.t + 15 && x > panelBio.tbox.l && x < panelBio.tbox.l + 10 ? 'nw' :
				y > panelBio.tbox.t - 5 && y < panelBio.tbox.t + 15 && x > panelBio.tbox.l + panelBio.tbox.w - 10 && x < panelBio.tbox.l + panelBio.tbox.w ? 'ne' :
				y > panelBio.tbox.t + panelBio.tbox.h - 5 && y < panelBio.tbox.t + panelBio.tbox.h + 5 && x > panelBio.tbox.l + 10 && x < panelBio.tbox.l + panelBio.tbox.w - 10 ? 'bottom' :
				y > panelBio.tbox.t + panelBio.tbox.h - 15 && y < panelBio.tbox.t + panelBio.tbox.h + 5 && x > panelBio.tbox.l && x < panelBio.tbox.l + 10 ? 'sw' :
				y > panelBio.tbox.t + panelBio.tbox.h - 15 && y < panelBio.tbox.t + panelBio.tbox.h + 5 && x > panelBio.tbox.l + panelBio.tbox.w - 10 && x < panelBio.tbox.l + panelBio.tbox.w ? 'se' :
				y > panelBio.tbox.t + 10 && y < panelBio.tbox.t + panelBio.tbox.h && x > panelBio.tbox.l - 5 && x < panelBio.tbox.l + 5 ? 'left' :
				y > panelBio.tbox.t + 10 && y < panelBio.tbox.t + panelBio.tbox.h && x > panelBio.tbox.l + panelBio.tbox.w - 5 && x < panelBio.tbox.l + panelBio.tbox.w + 5 ? 'right' :
				y > panelBio.tbox.t + 20 && y < panelBio.tbox.t + panelBio.tbox.h - 20 && x > panelBio.tbox.l + 20 && x < panelBio.tbox.l + panelBio.tbox.w - 20 ? 'all' : '';
			this.setCursor(this.st);
		}
		if (!this.down || !this.st) return;
		const filmStrip = {
			t: !pptBio.filmStripOverlay ? panelBio.filmStripSize.t : 0,
			b: !pptBio.filmStripOverlay ? panelBio.filmStripSize.b : 0,
			l: !pptBio.filmStripOverlay ? panelBio.filmStripSize.l : 0,
			r: !pptBio.filmStripOverlay ? panelBio.filmStripSize.r : 0
		};
		let txT = Math.round(panelBio.tx.t * panelBio.h) + filmStrip.t;
		let txB = Math.round(panelBio.tx.b * panelBio.h) + filmStrip.b;
		let txL = Math.round(panelBio.tx.l * panelBio.w) + filmStrip.l;
		let txR = Math.round(panelBio.tx.r * panelBio.w) + filmStrip.r;
		switch (this.st) {
			case 'top':
				if (y > panelBio.h - txB - panelBio.style.minH) break;
				panelBio.tx.t = $Bio.clamp((y - filmStrip.t) / panelBio.h, 0, 1);
				break;
			case 'nw':
				if (y < panelBio.h - txB - panelBio.style.minH) panelBio.tx.t = $Bio.clamp((y - filmStrip.t) / panelBio.h, 0, 1);
				if (x > panelBio.w - txR - 30) break;
				panelBio.tx.l = $Bio.clamp((x - filmStrip.l) / panelBio.w, 0, 1);
				break;
			case 'ne':
				if (y < panelBio.h - txB - panelBio.style.minH) panelBio.tx.t = $Bio.clamp((y - filmStrip.t) / panelBio.h, 0, 1);
				if (x < txL + 30) break;
				panelBio.tx.r = $Bio.clamp((panelBio.w - x - filmStrip.r) / panelBio.w, 0, 1);
				break;
			case 'left':
				if (x > panelBio.w - txR - 30) break;
				panelBio.tx.l = $Bio.clamp((x - filmStrip.l) / panelBio.w, 0, 1);
				break;
			case 'bottom':
				if (y < txT + panelBio.style.minH) break;
				panelBio.tx.b = $Bio.clamp((panelBio.h - y - filmStrip.b) / panelBio.h, 0, 1);
				break;
			case 'sw':
				if (x < panelBio.w - txR - 30) panelBio.tx.l = $Bio.clamp((x - filmStrip.l) / panelBio.w, 0, 1);
				if (y < txT + panelBio.style.minH) break;
				panelBio.tx.b = $Bio.clamp((panelBio.h - y - filmStrip.b) / panelBio.h, 0, 1);
				break;
			case 'se':
				if (y > txT + panelBio.style.minH) panelBio.tx.b = $Bio.clamp((panelBio.h - y - filmStrip.b) / panelBio.h, 0, 1);
				if (x < txL + 30) break;
				panelBio.tx.r = $Bio.clamp((panelBio.w - x - filmStrip.r) / panelBio.w, 0, 1);
				break;
			case 'right':
				if (x < txL + 30) break;
				panelBio.tx.r = $Bio.clamp((panelBio.w - x - filmStrip.r) / panelBio.w, 0, 1);
				break;
			case 'all':
				if (txT <= filmStrip.t && y - this.init_y < 0 || txB <= filmStrip.b && y - this.init_y > 0 || txL <= filmStrip.l && x - this.init_x < 0 || txR <= filmStrip.r && x - this.init_x > 0) break;
				txT += (y - this.init_y);
				panelBio.tx.t = $Bio.clamp((txT - filmStrip.t) / panelBio.h, 0, 1);
				txL += (x - this.init_x);
				panelBio.tx.l = $Bio.clamp((txL - filmStrip.l) / panelBio.w, 0, 1);
				txB = panelBio.h - Math.max(txT, 0) - panelBio.tbox.h;
				panelBio.tx.b = $Bio.clamp((txB - filmStrip.b) / panelBio.h, 0, 1);
				txR = panelBio.w - Math.max(txL, 0) - panelBio.tbox.w;
				panelBio.tx.r = $Bio.clamp((txR - filmStrip.r) / panelBio.w, 0, 1);
				break;
		}
		this.sizes(true);
		this.init_x = x;
		this.init_y = y;
	}

	setCursor(n) {
		const c = this.cursorId[n] || 0;
		if (c) window.SetCursor(c);
	}

	sizes(bypass) {
		panelBio.setStyle(bypass);
		butBio.check();
		txt.paint();
	}
}
