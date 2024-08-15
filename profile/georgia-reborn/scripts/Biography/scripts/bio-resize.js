'use strict';

class BioResizeHandler {
	constructor() {
		this.down = false;
		this.editorFont = gdi.Font(grFont.fontDefault, 15 * $Bio.scale, 1);
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

	// * METHODS * //

	drawEd(gr) {
		if (bio.vk.k('ctrl') && this.focus && bio.panel.m.y != -1 || bio.panel.style.new) {
			const ed = gr.MeasureString(this.editText(), this.editorFont, 15, 15, bio.panel.w - 15, bio.panel.h - 15, this.lc);
			gr.FillSolidRect(10, 10, ed.Width + 10, ed.Height + 10, bio.ui.col.edBg);
			if (!bioSet.text_only && !bioSet.img_only) {
				if (bioSet.style > 4) {
					if (!bio.vk.k('shift')) gr.DrawRect(bio.panel.ibox.l + 2, bio.panel.ibox.t + 2, bio.panel.ibox.w - 4, bio.panel.ibox.h - 4, 5, RGB(0, 255, 0));
					if (!bio.vk.k('alt')) gr.DrawRect(bio.panel.tbox.l + 2, bio.panel.tbox.t + 2, bio.panel.tbox.w - 4, bio.panel.tbox.h - 4, 5, RGB(255, 0, 0));
				} else if (bioSet.style < 4) {
					switch (bioSet.style) {
						case 0:
							gr.FillSolidRect(0, bio.panel.img.t + bio.panel.style.imgSize, bio.panel.w, 5, RGB(255, 128, 0));
							break;
						case 1:
							gr.FillSolidRect(bio.panel.img.l - 5, 0, 5, bio.panel.h, RGB(255, 128, 0));
							break;
						case 2:
							gr.FillSolidRect(0, bio.panel.img.t - 5, bio.panel.w, 5, RGB(255, 128, 0));
							break;
						case 3:
							gr.FillSolidRect(bio.panel.img.l + bio.panel.style.imgSize, 0, 5, bio.panel.h, RGB(255, 128, 0));
							break;
					}
				}
			}
			if (bio.panel.style.showFilmStrip) {
				switch (bioSet.filmStripPos) {
					case 0:
						gr.FillSolidRect(0, bio.filmStrip.y + bio.filmStrip.h, bio.panel.w, 5, RGB(0, 255, 255));
						break;
					case 1:
						gr.FillSolidRect(bio.filmStrip.x - 5, 0, 5, bio.panel.h, RGB(0, 255, 255));
						break;
					case 2:
						gr.FillSolidRect(0, bio.filmStrip.y - 5, bio.panel.w, 5, RGB(0, 255, 255));
						break;
					case 3:
						gr.FillSolidRect(bio.filmStrip.x + bio.filmStrip.w, 0, 5, bio.panel.h, RGB(0, 255, 255));
						break;
				}
			}
			gr.SetTextRenderingHint(5);
			gr.DrawString(this.editText(), this.editorFont, bio.ui.col.shadow, 16, 16, ed.Width, ed.Height, this.lc);
			gr.DrawString(this.editText(), this.editorFont, bio.ui.col.text_h, 15, 15, ed.Width, ed.Height, this.lc);
		}
	}

	editText() {
		return `${(bioSet.text_only ? `Type: Text Only${bio.panel.style.showFilmStrip ? '\n - Layout Adjust: Drag Line' : ''}` : (bioSet.img_only ? `Type: Image Only${bio.panel.style.showFilmStrip ? '\n - Layout Adjust: Drag Line' : ''}` : `Name: ${bio.panel.style.name[bioSet.style]}${bioSet.style < 4 ? `\n\nType: Auto\n - Layout Adjust: Drag Line${bio.panel.style.showFilmStrip && !bioSet.img_only && bioSet.style != 4 ? 's' : ''}\n - Image Strength: Shift + Wheel Over Text` : bioSet.style == 4 ? `\n\nType: Auto${bio.panel.style.showFilmStrip && !bioSet.img_only ? '\n - Layout Adjust: Drag Line' : ''}\n - Image Strength: Shift + Wheel Over Text` : '\n\nType: Freestyle\n - Layout Adjust: Drag Lines or Boxes: Ctrl (Any), Ctrl + Alt (Image), Ctrl + Shift (Text) or Ctrl + Alt + Shift (Filmstrip)\n - Overlay Strength: Shift + Wheel Over Text'}`)) + (bio.img.isType('Refl') && !bioSet.text_only && bioSet.style != 4 ? '\n - Reflection Strength: Shift + Wheel Over Main Image' : '') + (!bioSet.img_only ? '\n - Text Size: Ctrl + Wheel Over Text' : '')}\n - ${bioSet.style != 4 ? '' : 'Text '}Padding: Display Tab`;
	}

	filmMove(x, y) {
		if (!this.focus || !bio.panel.style.showFilmStrip || !bio.vk.k('ctrl')) return;
		if (!this.down) {
			switch (bioSet.filmStripPos) {
				case 0:
					this.sf = y > bio.filmStrip.y + bio.filmStrip.h && y < bio.filmStrip.y + bio.filmStrip.h + 5;
					if (this.sf) SetCursor('SizeNS');
					break;
				case 1:
					this.sf = x > bio.filmStrip.x - 5 && x < bio.filmStrip.x;
					if (this.sf) SetCursor('SizeWE');
					break;
				case 2:
					this.sf = y > bio.filmStrip.y - 5 && y < bio.filmStrip.y;
					if (this.sf) SetCursor('SizeNS');
					break;
				case 3:
					this.sf = x > bio.filmStrip.x + bio.filmStrip.w && x < bio.filmStrip.x + bio.filmStrip.w + 5;
					if (this.sf) SetCursor('SizeWE');
					break;
			}
		}
		if (!this.down || !this.sf) return;
		switch (bioSet.filmStripPos) {
			case 0:
				bioSet.filmStripSize = (bioSet.filmStripSize * bio.panel.h + y - this.y_start) / bio.panel.h;
				bioSet.filmStripSize = $Bio.clamp(parseFloat(bioSet.filmStripSize.toFixed(15)), 0.02, bio.filmStrip.max_sz / bio.panel.h);
				break;
			case 1:
				bioSet.filmStripSize = (bioSet.filmStripSize * bio.panel.w + this.x_start - x) / bio.panel.w;
				bioSet.filmStripSize = $Bio.clamp(parseFloat(bioSet.filmStripSize.toFixed(15)), 0.02, bio.filmStrip.max_sz / bio.panel.w);
				break;
			case 2:
				bioSet.filmStripSize = (bioSet.filmStripSize * bio.panel.h + this.y_start - y) / bio.panel.h;
				bioSet.filmStripSize = $Bio.clamp(parseFloat(bioSet.filmStripSize.toFixed(15)), 0.02, bio.filmStrip.max_sz / bio.panel.h);
				break;
			case 3:
				bioSet.filmStripSize = (bioSet.filmStripSize * bio.panel.w + x - this.x_start) / bio.panel.w;
				bioSet.filmStripSize = $Bio.clamp(parseFloat(bioSet.filmStripSize.toFixed(15)), 0.02, bio.filmStrip.max_sz / bio.panel.w);
				break;
		}
		bio.filmStrip.logScrollPos();
		bio.filmStrip.setSize();
		window.Repaint();
		this.updFilm = true;
		this.x_start = x;
		this.y_start = y;
	}

	lbtn_dn(x, y) {
		bio.panel.style.new = false;
		if (!bio.vk.k('ctrl')) return;
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
		SetCursor('Arrow');
		this.down = false;
		bio.img.mask.reset = true;
		if (bioSet.style > 3) {
			const obj = bioSet.style == 4 || bioSet.style == 5 ? bio.panel.style.overlay : bio.panel.style.free[bioSet.style - 6];
			const imL = Math.round(bio.panel.im.l * bio.panel.w);
			const imR = Math.round(bio.panel.im.r * bio.panel.w);
			const imT = Math.round(bio.panel.im.t * bio.panel.h);
			const imB = Math.round(bio.panel.im.b * bio.panel.h);
			const txL = Math.round(bio.panel.tx.l * bio.panel.w);
			const txR = Math.round(bio.panel.tx.r * bio.panel.w);
			const txT = Math.round(bio.panel.tx.t * bio.panel.h);
			const txB = Math.round(bio.panel.tx.b * bio.panel.h);
			let sv = false;
			if (bio.panel.h > txB + txT + bioSet.textT + bioSet.textB + 10 && bio.panel.w > txR + txL + bioSet.textL + bioSet.textR + 10) {
				obj.txL = bio.panel.tx.l;
				obj.txR = bio.panel.tx.r;
				obj.txT = bio.panel.tx.t;
				obj.txB = bio.panel.tx.b;
				sv = true;
			}
			if (bio.panel.h > imB + imT + bio.panel.bor.t + bio.panel.bor.b + 10 && bio.panel.w > imR + imL + bio.panel.bor.l + bio.panel.bor.r + 10) {
				obj.imL = bio.panel.im.l;
				obj.imR = bio.panel.im.r;
				obj.imT = bio.panel.im.t;
				obj.imB = bio.panel.im.b;
				sv = true;
			}
			if (sv) {
				bioSet.style == 4 ? bioSet.styleOverlay = JSON.stringify(bio.panel.style.overlay) : bioSet.styleFree = JSON.stringify(bio.panel.style.free);
			} else {
				bio.panel.im.l = $Bio.clamp(obj.imL, 0, 1);
				bio.panel.im.r = $Bio.clamp(obj.imR, 0, 1);
				bio.panel.im.t = $Bio.clamp(obj.imT, 0, 1);
				bio.panel.im.b = $Bio.clamp(obj.imB, 0, 1);
				bio.panel.tx.l = $Bio.clamp(obj.txL, 0, 1);
				bio.panel.tx.r = $Bio.clamp(obj.txR, 0, 1);
				bio.panel.tx.t = $Bio.clamp(obj.txT, 0, 1);
				bio.panel.tx.b = $Bio.clamp(obj.txB, 0, 1);
			}
		}
		bio.filmStrip.clearCache();
		if (bio.panel.style.showFilmStrip && bioSet.filmStripOverlay) bio.filmStrip.set(bioSet.filmStripPos);
		bio.txt.refresh(this.updFilm ? 0 : 3);
		bio.filmStrip.paint();
	}

	imgMove(x, y) {
		if (!this.focus || bioSet.img_only || bioSet.text_only || bioSet.style == 4) return;
		switch (true) {
			case bioSet.style > 3: {
				if (!bio.vk.k('ctrl') || bio.vk.k('shift')) break;
				if (!this.down) {
					this.si = y > bio.panel.ibox.t - 5 && y < bio.panel.ibox.t + 5 && x > bio.panel.ibox.l + 10 && x < bio.panel.ibox.l + bio.panel.ibox.w - 10 ? 'top' :
						y > bio.panel.ibox.t - 5 && y < bio.panel.ibox.t + 15 && x > bio.panel.ibox.l && x < bio.panel.ibox.l + 10 ? 'nw' :
						y > bio.panel.ibox.t - 5 && y < bio.panel.ibox.t + 15 && x > bio.panel.ibox.l + bio.panel.ibox.w - 10 && x < bio.panel.ibox.l + bio.panel.ibox.w ? 'ne' :
						y > bio.panel.ibox.t + bio.panel.ibox.h - 5 && y < bio.panel.ibox.t + bio.panel.ibox.h + 5 && x > bio.panel.ibox.l + 10 && x < bio.panel.ibox.l + bio.panel.ibox.w - 5 ? 'bottom' :
						y > bio.panel.ibox.t + bio.panel.ibox.h - 15 && y < bio.panel.ibox.t + bio.panel.ibox.h + 5 && x > bio.panel.ibox.l && x < bio.panel.ibox.l + 10 ? 'sw' :
						y > bio.panel.ibox.t + bio.panel.ibox.h - 15 && y < bio.panel.ibox.t + bio.panel.ibox.h + 5 && x > bio.panel.ibox.l + bio.panel.ibox.w - 10 && x < bio.panel.ibox.l + bio.panel.ibox.w ? 'se' :
						y > bio.panel.ibox.t && y < bio.panel.ibox.t + bio.panel.ibox.h && x > bio.panel.ibox.l - 5 && x < bio.panel.ibox.l + 5 ? 'left' :
						y > bio.panel.ibox.t && y < bio.panel.ibox.t + bio.panel.ibox.h && x > bio.panel.ibox.l + bio.panel.ibox.w - 5 && x < bio.panel.ibox.l + bio.panel.ibox.w + 5 ? 'right' :
						y > bio.panel.ibox.t + 20 && y < bio.panel.ibox.t + bio.panel.ibox.h - 20 && x > bio.panel.ibox.l + 20 && x < bio.panel.ibox.l + bio.panel.ibox.w - 20 ? 'all' : '';
					this.setCursor(this.si);
				}
				if (!this.down || !this.si) return;
				const filmStrip = {
					t: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.t : 0,
					b: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.b : 0,
					l: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.l : 0,
					r: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.r : 0
				};
				let imT = Math.round(bio.panel.im.t * bio.panel.h) + filmStrip.t;
				let imB = Math.round(bio.panel.im.b * bio.panel.h) + filmStrip.b;
				let imL = Math.round(bio.panel.im.l * bio.panel.w) + filmStrip.l;
				let imR = Math.round(bio.panel.im.r * bio.panel.w) + filmStrip.r;
				switch (this.si) {
					case 'top':
						if (y > bio.panel.h - imB - 30) break;
						bio.panel.im.t = $Bio.clamp((y - filmStrip.t) / bio.panel.h, 0, 1);
						break;
					case 'nw':
						if (y < bio.panel.h - imB - 30) bio.panel.im.t = $Bio.clamp((y - filmStrip.t) / bio.panel.h, 0, 1);
						if (x > bio.panel.w - imR - 30) break;
						bio.panel.im.l = $Bio.clamp((x - filmStrip.l) / bio.panel.w, 0, 1);
						break;
					case 'ne':
						if (y < bio.panel.h - imB - 30) bio.panel.im.t = $Bio.clamp((y - filmStrip.t) / bio.panel.h, 0, 1);
						if (x < imL + 30) break;
						bio.panel.im.r = $Bio.clamp((bio.panel.w - x - filmStrip.r) / bio.panel.w, 0, 1);
						break;
					case 'left':
						if (x > bio.panel.w - imR - 30) break;
						bio.panel.im.l = $Bio.clamp((x - filmStrip.l) / bio.panel.w, 0, 1);
						break;
					case 'bottom':
						if (y < imT + 30) break;
						bio.panel.im.b = $Bio.clamp((bio.panel.h - y - filmStrip.b) / bio.panel.h, 0, 1);
						break;
					case 'sw':
						if (x < bio.panel.w - imR - 30) bio.panel.im.l = $Bio.clamp((x - filmStrip.l) / bio.panel.w, 0, 1);
						if (y < imT + 30) break;
						bio.panel.im.b = $Bio.clamp((bio.panel.h - y - filmStrip.b) / bio.panel.h, 0, 1);
						break;
					case 'se':
						if (y > imT + 30) bio.panel.im.b = $Bio.clamp((bio.panel.h - y - filmStrip.b) / bio.panel.h, 0, 1);
						if (x < imL + 30) break;
						bio.panel.im.r = $Bio.clamp((bio.panel.w - x - filmStrip.r) / bio.panel.w, 0, 1);
						break;
					case 'right':
						if (x < imL + 30) break;
						bio.panel.im.r = $Bio.clamp((bio.panel.w - x - filmStrip.r) / bio.panel.w, 0, 1);
						break;
					case 'all':
						if (imT <= filmStrip.t && y - this.init_y < 0 || imB <= filmStrip.b && y - this.init_y > 0 || imL <= filmStrip.l && x - this.init_x < 0 || imR <= filmStrip.r && x - this.init_x > 0) break;
						imT += (y - this.y_init);
						bio.panel.im.t = $Bio.clamp((imT - filmStrip.t) / bio.panel.h, 0, 1);
						imB = bio.panel.h - Math.max(imT, 0) - bio.panel.ibox.h;
						bio.panel.im.b = $Bio.clamp((imB - filmStrip.b) / bio.panel.h, 0, 1);
						imL += (x - this.x_init);
						bio.panel.im.l = $Bio.clamp((imL - filmStrip.l) / bio.panel.w, 0, 1);
						imR = bio.panel.w - Math.max(imL, 0) - bio.panel.ibox.w;
						bio.panel.im.r = $Bio.clamp((imR - filmStrip.r) / bio.panel.w, 0, 1);
						break;
				}
				this.sizes(true);
				break;
			}
			case bioSet.style < 4: {
				if (!bio.vk.k('ctrl')) break;
				if (!this.down) {
					switch (bioSet.style) {
						case 0:
							this.si = y > bio.panel.img.t + bio.panel.style.imgSize && y < bio.panel.img.t + bio.panel.style.imgSize + 5;
							if (this.si) SetCursor('SizeNS');
							break;
						case 1:
							this.si = x > bio.panel.img.l - 5 && x < bio.panel.img.l;
							if (this.si) SetCursor('SizeWE');
							break;
						case 2:
							this.si = y > bio.panel.img.t - 5 && y < bio.panel.img.t;
							if (this.si) SetCursor('SizeNS');
							break;
						case 3:
							this.si = x > bio.panel.img.l + bio.panel.style.imgSize && x < bio.panel.img.l + bio.panel.style.imgSize + 5;
							if (this.si) SetCursor('SizeWE');
							break;
					}
				}
				if (!this.down || !this.si) return;
				const filmStrip = {
					t: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.t : 0,
					b: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.b : 0,
					l: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.l : 0,
					r: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.r : 0
				};
				const ph = bio.panel.h - filmStrip.t - filmStrip.b;
				const pw = bio.panel.w - filmStrip.l - filmStrip.r;
				switch (bioSet.style) {
					case 0:
						bioSet.rel_imgs = (bioSet.rel_imgs * ph + y - this.y_init) / ph;
						break;
					case 1:
						bioSet.rel_imgs = (bioSet.rel_imgs * pw + this.x_init - x) / pw;
						break;
					case 2:
						bioSet.rel_imgs = (bioSet.rel_imgs * ph + this.y_init - y) / ph;
						break;
					case 3:
						bioSet.rel_imgs = (bioSet.rel_imgs * pw + x - this.x_init) / pw;
						break;
				}
				bioSet.rel_imgs = $Bio.clamp(parseFloat(bioSet.rel_imgs.toFixed(15)), 0.1, 0.9);
				this.sizes();
				break;
			}
		}
		this.x_init = x;
		this.y_init = y;
	}

	move(x, y) {
		if (bioSet.style < 4 || bioSet.img_only || bioSet.text_only || !bio.vk.k('ctrl') || bio.vk.k('alt') || !this.focus || bioSet.style == 4) return;
		if (!this.down) {
			this.st = y > bio.panel.tbox.t - 5 && y < bio.panel.tbox.t + 5 && x > bio.panel.tbox.l + 10 && x < bio.panel.tbox.l + bio.panel.tbox.w - 10 ? 'top' :
				y > bio.panel.tbox.t - 5 && y < bio.panel.tbox.t + 15 && x > bio.panel.tbox.l && x < bio.panel.tbox.l + 10 ? 'nw' :
				y > bio.panel.tbox.t - 5 && y < bio.panel.tbox.t + 15 && x > bio.panel.tbox.l + bio.panel.tbox.w - 10 && x < bio.panel.tbox.l + bio.panel.tbox.w ? 'ne' :
				y > bio.panel.tbox.t + bio.panel.tbox.h - 5 && y < bio.panel.tbox.t + bio.panel.tbox.h + 5 && x > bio.panel.tbox.l + 10 && x < bio.panel.tbox.l + bio.panel.tbox.w - 10 ? 'bottom' :
				y > bio.panel.tbox.t + bio.panel.tbox.h - 15 && y < bio.panel.tbox.t + bio.panel.tbox.h + 5 && x > bio.panel.tbox.l && x < bio.panel.tbox.l + 10 ? 'sw' :
				y > bio.panel.tbox.t + bio.panel.tbox.h - 15 && y < bio.panel.tbox.t + bio.panel.tbox.h + 5 && x > bio.panel.tbox.l + bio.panel.tbox.w - 10 && x < bio.panel.tbox.l + bio.panel.tbox.w ? 'se' :
				y > bio.panel.tbox.t + 10 && y < bio.panel.tbox.t + bio.panel.tbox.h && x > bio.panel.tbox.l - 5 && x < bio.panel.tbox.l + 5 ? 'left' :
				y > bio.panel.tbox.t + 10 && y < bio.panel.tbox.t + bio.panel.tbox.h && x > bio.panel.tbox.l + bio.panel.tbox.w - 5 && x < bio.panel.tbox.l + bio.panel.tbox.w + 5 ? 'right' :
				y > bio.panel.tbox.t + 20 && y < bio.panel.tbox.t + bio.panel.tbox.h - 20 && x > bio.panel.tbox.l + 20 && x < bio.panel.tbox.l + bio.panel.tbox.w - 20 ? 'all' : '';
			this.setCursor(this.st);
		}
		if (!this.down || !this.st) return;
		const filmStrip = {
			t: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.t : 0,
			b: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.b : 0,
			l: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.l : 0,
			r: !bioSet.filmStripOverlay ? bio.panel.filmStripSize.r : 0
		};
		let txT = Math.round(bio.panel.tx.t * bio.panel.h) + filmStrip.t;
		let txB = Math.round(bio.panel.tx.b * bio.panel.h) + filmStrip.b;
		let txL = Math.round(bio.panel.tx.l * bio.panel.w) + filmStrip.l;
		let txR = Math.round(bio.panel.tx.r * bio.panel.w) + filmStrip.r;
		switch (this.st) {
			case 'top':
				if (y > bio.panel.h - txB - bio.panel.style.minH) break;
				bio.panel.tx.t = $Bio.clamp((y - filmStrip.t) / bio.panel.h, 0, 1);
				break;
			case 'nw':
				if (y < bio.panel.h - txB - bio.panel.style.minH) bio.panel.tx.t = $Bio.clamp((y - filmStrip.t) / bio.panel.h, 0, 1);
				if (x > bio.panel.w - txR - 30) break;
				bio.panel.tx.l = $Bio.clamp((x - filmStrip.l) / bio.panel.w, 0, 1);
				break;
			case 'ne':
				if (y < bio.panel.h - txB - bio.panel.style.minH) bio.panel.tx.t = $Bio.clamp((y - filmStrip.t) / bio.panel.h, 0, 1);
				if (x < txL + 30) break;
				bio.panel.tx.r = $Bio.clamp((bio.panel.w - x - filmStrip.r) / bio.panel.w, 0, 1);
				break;
			case 'left':
				if (x > bio.panel.w - txR - 30) break;
				bio.panel.tx.l = $Bio.clamp((x - filmStrip.l) / bio.panel.w, 0, 1);
				break;
			case 'bottom':
				if (y < txT + bio.panel.style.minH) break;
				bio.panel.tx.b = $Bio.clamp((bio.panel.h - y - filmStrip.b) / bio.panel.h, 0, 1);
				break;
			case 'sw':
				if (x < bio.panel.w - txR - 30) bio.panel.tx.l = $Bio.clamp((x - filmStrip.l) / bio.panel.w, 0, 1);
				if (y < txT + bio.panel.style.minH) break;
				bio.panel.tx.b = $Bio.clamp((bio.panel.h - y - filmStrip.b) / bio.panel.h, 0, 1);
				break;
			case 'se':
				if (y > txT + bio.panel.style.minH) bio.panel.tx.b = $Bio.clamp((bio.panel.h - y - filmStrip.b) / bio.panel.h, 0, 1);
				if (x < txL + 30) break;
				bio.panel.tx.r = $Bio.clamp((bio.panel.w - x - filmStrip.r) / bio.panel.w, 0, 1);
				break;
			case 'right':
				if (x < txL + 30) break;
				bio.panel.tx.r = $Bio.clamp((bio.panel.w - x - filmStrip.r) / bio.panel.w, 0, 1);
				break;
			case 'all':
				if (txT <= filmStrip.t && y - this.init_y < 0 || txB <= filmStrip.b && y - this.init_y > 0 || txL <= filmStrip.l && x - this.init_x < 0 || txR <= filmStrip.r && x - this.init_x > 0) break;
				txT += (y - this.init_y);
				bio.panel.tx.t = $Bio.clamp((txT - filmStrip.t) / bio.panel.h, 0, 1);
				txL += (x - this.init_x);
				bio.panel.tx.l = $Bio.clamp((txL - filmStrip.l) / bio.panel.w, 0, 1);
				txB = bio.panel.h - Math.max(txT, 0) - bio.panel.tbox.h;
				bio.panel.tx.b = $Bio.clamp((txB - filmStrip.b) / bio.panel.h, 0, 1);
				txR = bio.panel.w - Math.max(txL, 0) - bio.panel.tbox.w;
				bio.panel.tx.r = $Bio.clamp((txR - filmStrip.r) / bio.panel.w, 0, 1);
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
		bio.panel.setStyle(bypass);
		bio.but.check();
		bio.txt.paint();
	}
}
