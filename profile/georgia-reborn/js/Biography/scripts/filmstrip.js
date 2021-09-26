class FilmStrip {
	constructor() {
		this.accessed = 0;
		this.blockSize = 80;
		this.cache = {};
		this.cur_id = false;
		this.h = 0;
		this.hand = false;
		this.im_w = 80;
		this.images = [];
		this.init = true;
		this.items = [];
		this.loadTimer = null;
		this.m_i = -1;
		this.text_y = 0;
		this.x = 0;
		this.y = 0;
		this.w = 0;

		pptBio.thumbNailGap = Math.max(pptBio.thumbNailGap, 0);
		pptBio.filmStripSize = $Bio.clamp(pptBio.filmStripSize, 0.02, 0.98);

		this.blocks = {
			bor: [null, null, null],
			drawn: 6,
			end: 1,
			length: 0,
			start: 0
		}

		this.cachesize = {
			max: 200,
			min: 20
		}

		this.noimg = {
			xy: 0,
			wh: 80
		}

		this.repaint = {
			x: 0,
			y: 0,
			w: panelBio.w,
			h: panelBio.h
		}

		this.scroll = {
			pos: {
				art: {},
				cov: {}
			}
		}

		this.style = {
			auto: false,
			fit: true,
			gap: 0,
			horizontal: false,
			image: 2
		}

		this.imageDebounce = $Bio.debounce(() => {
			this.getImages();
		}, 100, {
			'leading': true,
			'trailing': true
		});

		this.sizeDebounce = $Bio.debounce(() => {
			if (!pptBio.showFilmStrip) return;
			this.logScrollPos();
			this.clearCache();
			this.setSize();
			this.check();
			txt.refresh(0)
		}, 100);
	}

	// Methods

	cacheIt(image, key) {
		try {
			if (image) {
				if (imgBio.filter.size && pptBio.artistView && (!pptBio.imgFilterBothPx ? image.Width < imgBio.filter.minPx && image.Height < imgBio.filter.minPx : image.Width < imgBio.filter.minPx || image.Height < imgBio.filter.minPx) && imgBio.art.images.length > imgBio.filter.minNo) {
					const image_path = key.replace(/^\d+/, '');
					const rem_ix = imgBio.art.images.findIndex(v => v == image_path);
					if (rem_ix != -1) imgBio.art.images.splice(rem_ix, 1);
					this.trimCache(image_path);
					seeker.upd();
					this.logScrollPos();
					this.check('imgUpd');
					!pptBio.imgSeeker ? this.paint() : txt.paint();
					return;
				}
				if (imgBio.filter.size && !pptBio.artistView && imgBio.artFolder && (!pptBio.imgFilterBothPx ? image.Width < imgBio.filter.minPx && image.Height < imgBio.filter.minPx : image.Width < imgBio.filter.minPx || image.Height < imgBio.filter.minPx) && imgBio.cov.images.length > imgBio.filter.minNo + 1) {
					const image_path = key.replace(/^\d+/, '');
					const rem_ix = imgBio.cov.images.findIndex(v => v == image_path);
					if (rem_ix != -1) {
						 imgBio.cov.list.splice(rem_ix, 1);
						 imgBio.cov.images.splice(rem_ix, 1);
					}
					this.trimCache(image_path);
					seeker.upd();
					this.logScrollPos();
					this.check('imgUpd');
					!pptBio.imgSeeker ? this.paint() : txt.paint();
					return;
				}
			} else if (!image) image = imgBio.stub.default[!key.includes('noitem') ? pptBio.artistView ? 1 : 0 : 2];
			if (image) {
				image = imgBio.format(image, 1, ['default', 'crop', 'circular'][this.style.image], this.im_w, this.im_w, 'filmStrip');
				this.checkCache();
				this.cache[key] = {
					img: image,
					accessed: ++this.accessed
				}
			}
		} catch (e) {
			const image_path = key.replace(/^\d+/, '');
			if (pptBio.artistView) {
				const rem_ix = imgBio.art.images.findIndex(v => v == image_path);
				if (rem_ix != -1) imgBio.art.images.splice(rem_ix, 1);
				this.trimCache(image_path);
			} else {
				const rem_ix = imgBio.cov.images.findIndex(v => v == image_path);
				if (rem_ix != -1) {
					 imgBio.cov.list.splice(rem_ix, 1);
					 imgBio.cov.images.splice(rem_ix, 1);
				}
				this.trimCache(image_path);
			}
			seeker.upd();
			this.check();
			if (pptBio.imgSeeker) txt.paint();
			$Bio.trace('unable to load thumbnail image: ' + key);
		}
		this.paint();
	}

	check(n) {
		const cur_style = this.style.image;
		this.style.image = pptBio.artistView ? pptBio.filmPhotoStyle : pptBio.filmCoverStyle;
		if (this.style.image != cur_style) this.createBorder();
		const y_text = !panelBio.style.fullWidthHeading || pptBio.img_only || (!txt.text && !pptBio.text_only) ? 0 : panelBio.text.t;
		if (this.text_y != y_text) this.setSize();
		panelBio.style.showFilmStrip = false;
		if (pptBio.showFilmStrip) {
			this.images = [];
			switch (true) {
				case !this.style.auto:
					panelBio.style.showFilmStrip = true;
					switch (true) {
						case pptBio.artistView:
							if (!pptBio.cycPhoto || !imgBio.art.images.length) break;
							this.images = imgBio.art.images;
							break;
						case !pptBio.artistView:
							if (!panelBio.stnd(panelBio.alb.ix, panelBio.alb.list) || ! imgBio.cov.cycle || ! imgBio.cov.images.length) break;
							this.images = imgBio.cov.images;
							break;
					}
					break;
				case this.style.auto:
					switch (true) {
						case pptBio.artistView:
							if (!pptBio.cycPhoto || imgBio.art.images.length < 2) break;
							this.images = imgBio.art.images;
							panelBio.style.showFilmStrip = true;
							break;
						case !pptBio.artistView:
							if (!panelBio.stnd(panelBio.alb.ix, panelBio.alb.list) || ! imgBio.cov.cycle || imgBio.cov.images.length < 2) break;
							this.images = imgBio.cov.images;
							panelBio.style.showFilmStrip = true;
							break;
					}
					break;
			}
			if (!this.images.length && !this.style.auto) this.images[0] = imgBio.cur_pth();
			this.blocks.length = this.images.length;
			this.updScroll(n);
			if (n == 'imgUpd') this.scrollerType().checkScroll(this.scrollerType().scroll, 'step');
		}
		if (this.id() != this.cur_id) {
			this.cur_id = this.id();
			if (n != 'clear') {
				this.setSize(); // check required for initially hidden panels
				this.setFilmStripSize(); // check required for initially hidden panels
				panelBio.setStyle(resize.down); // if clear: called by refresh(0)
				panelBio.checkAutofilm(); // if clear: refresh(0) does text
			}
		} else {
			this.setFilmStripSize();
		}
		this.paint();
	}

	checkCache() {
		let keys = Object.keys(this.cache);
		const cacheLength = keys.length;
		if (cacheLength < this.cachesize.max && !imgBio.memoryLimit()) return;
		this.cache = imgBio.sortCache(this.cache, 'accessed');
		keys = Object.keys(this.cache);
		const numToRemove = Math.round((Math.min(this.cachesize.max, cacheLength) - this.cachesize.min) / 5);
		if (numToRemove > 0)
			for (let i = 0; i < numToRemove; i++) this.trimCache(false, keys[i]);
	}

	clearCache() {
		this.cache = {};
		this.accessed = 0;
	}

	createBorder() {
		if (!pptBio.showFilmStrip) return;
		const sp = Math.round((this.blockSize - this.im_w) / 2);
		for (let i = 0; i < 3; i++) {
			const col = i < 2 ? uiBio.col.imgBor : uiBio.col.frame;
			const w = i < 2 ? uiBio.style.l_w : uiBio.style.l_w * 3;
			const floor = Math.floor(w / 2);
			const w1 = !this.style.horizontal || i == 2 ? w : i == 1 ? -100 : w;
			const w2 = this.style.horizontal || i == 2 ? w : i == 1 ? -100 : w;
			this.blocks.bor[i] = $Bio.gr(this.blockSize, this.blockSize, true, g => { // 0 circ|rect; 1 circ|rect_no_trailing; 2 sel circ|rect
				switch (this.style.image) {
					case 2:
						g.SetSmoothingMode(2);
						g.DrawEllipse(sp + floor, sp + floor, this.im_w - w, this.im_w - w, w, col);
						g.SetSmoothingMode(0);
						break;
					default:
						g.DrawRect(sp + floor, sp + floor, this.im_w - w1, this.im_w - w2, w, col);
						break;
				}
			});
		}
	}

	draw(gr) {
		if (!panelBio.style.showFilmStrip || panelBio.block()) return;
		let box_x, box_y, iw, ih;
		this.getItemsToDraw();
		for (let i = this.blocks.start; i < this.blocks.end; i++) {
			box_x = this.style.horizontal ? Math.floor(this.x + i * this.blockSize - this.scrollerType().delta) : this.x;
			box_y = !this.style.horizontal ? Math.floor(this.y + i * this.blockSize - this.scrollerType().delta) : this.y;
			const im = this.getImg(i);
			if (im) {
				iw = im.Width;
				ih = im.Height;
				const sel = (!pptBio.text_only || uiBio.style.isBlur) && this.blocks.length > 1 && this.images[i] == imgBio.cur_pth();
				const x = box_x + Math.round((this.blockSize - iw) / 2);
				const y = box_y + Math.round((this.blockSize - ih) / 2);
				let bor = !sel ? this.blocks.bor[1] : this.blocks.bor[2];
				if (this.style.image != 2 && !sel && (this.style.gap || this.style.fit && i == this.blocks.end - 2 && i != this.blocks.length - 2 || i == this.blocks.length - 1)) bor = this.blocks.bor[0];
				!this.style.horizontal ? this.drawVerticalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw) : this.drawhorizontalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw);
			} else this.noIm(gr, box_x, box_y);
		}
	}

	drawhorizontalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw) {
		const c = this.style.image == 2 ? 1 : 0;
		let x_offset = 0;
		if (x - this.x < 0) { // first
			x_offset = Math.abs(x - this.x);
			if (im) gr.DrawImage(im, this.x, y, iw - x_offset, ih, x_offset, 0, iw - x_offset, ih);
			x_offset = Math.abs(box_x - this.x);
			if (bor) gr.DrawImage(bor, this.x, box_y, this.blockSize - x_offset, this.blockSize + c, x_offset, 0, this.blockSize - x_offset, this.blockSize);
		} else if (x + this.blockSize > this.x + this.w) { // last
			x_offset = this.x + this.w - x;
			if (im) gr.DrawImage(im, x, y, x_offset, ih, 0, 0, x_offset, ih);
			x_offset = this.x + this.w - box_x;
			if (bor) gr.DrawImage(bor, box_x, box_y, x_offset, this.blockSize + c, 0, 0, x_offset, this.blockSize);
		} else { // others
			if (im) gr.DrawImage(im, x, y, iw, ih, 0, 0, iw, ih);
			if (bor) gr.DrawImage(bor, box_x, box_y, this.blockSize, this.blockSize + c, 0, 0, this.blockSize, this.blockSize);
		}
	}

	drawVerticalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw) {
		const c = this.style.image == 2 ? 1 : 0;
		let y_offset = 0;
		if (y - this.y < 0) { // first
			y_offset = Math.abs(y - this.y);
			if (im) gr.DrawImage(im, x, this.y, iw, ih - y_offset, 0, y_offset, iw, ih - y_offset);
			y_offset = Math.abs(box_y - this.y);
			if (bor) gr.DrawImage(bor, box_x, this.y, this.blockSize, this.blockSize - y_offset + c, 0, y_offset, this.blockSize, this.blockSize - y_offset);
		} else if (y + this.blockSize > this.y + this.h) { // last
			y_offset = this.y + this.h - y;
			if (im) gr.DrawImage(im, x, y, iw, y_offset, 0, 0, iw, y_offset);
			y_offset = this.y + this.h - box_y;
			if (bor) gr.DrawImage(bor, box_x, box_y, this.blockSize, y_offset + c, 0, 0, this.blockSize, y_offset);
		} else { // others
			if (im) gr.DrawImage(im, x, y, iw, ih, 0, 0, iw, ih);
			if (bor) gr.DrawImage(bor, box_x, box_y, this.blockSize, this.blockSize + c, 0, 0, this.blockSize, this.blockSize);
		}
	}

	get_ix(x, y) {
		if (!pptBio.showFilmStrip) return -1;
		if (!this.images.length || butBio.trace('lookUp', panelBio.m.x, panelBio.m.y)) return -1;
		if (panelBio.trace.film && y > this.y && y < this.y + this.h && x > this.x && x < this.x + this.w) {
			let idx = this.style.horizontal ? Math.ceil((x + this.scrollerType().delta - this.x) / this.blockSize) - 1 : Math.ceil((y + this.scrollerType().delta - this.y) / this.blockSize) - 1;
			idx = idx > this.images.length - 1 ? -1 : idx;
			return idx;
		}
		return -1;
	}

	getImg(i) {
		const o = this.cache[this.getKey(this.images[i])];
		if (!o || o.img == 'called') return undefined;
		o.accessed = ++this.accessed;
		return o.img;
	}

	getImages() {
		const finish = Math.min(this.blocks.end + this.blocks.drawn, this.blocks.length);
		for (let i = this.blocks.start; i < finish; i++) {
			const key = this.images[i];
			if (!this.cache[this.getKey(key)]) this.items.push({
				ix: i,
				key: key
			});
		}
		if (!this.items.length) return;
		if (!this.loadTimer) this.loadTimer = setInterval(() => {
			if (this.items.length) {
				const v = this.items[0];
				if (!v.key) this.items.shift();
				else if (window.ID) { // added window.ID check
					const key = this.getKey(v.key);
					if (!this.cache[key]) {
						const embeddedImg = imgBio.isEmbedded('thumb', v.ix);
						if (!embeddedImg) {
							this.cache[key] = {
								img: 'called',
								accessed: ++this.accessed
							}
							gdi.LoadImageAsync(window.ID, v.key);
						} else this.cacheIt(embeddedImg, key);
					}
					this.items.shift();
				}
			} else {
				clearInterval(this.loadTimer);
				this.loadTimer = null;
			}
		}, 16);
	}

	getItemsToDraw() {
		if (this.blocks.length <= this.blocks.drawn) {
			this.blocks.start = 0;
			this.blocks.end = this.blocks.length;
		} else {
			this.blocks.start = Math.round(this.scrollerType().delta / this.blockSize);
			this.blocks.end = Math.min(this.blocks.start + this.blocks.drawn + (this.style.fit ? 1 : 2), this.blocks.length);
			this.blocks.start = $Bio.clamp(this.blocks.start, 0, this.blocks.start - 1)
		}
		this.imageDebounce();
	}

	getScrollPos() {
		let v;
		switch (pptBio.artistView) {
			case true:
				v = imgBio.artist;
				if (!this.scroll.pos.art[v]) return art_scroller.setScroll(0);
				else if (this.scroll.pos.art[v].blockSize == this.blockSize) {
					if (imgBio.art.list.length && $Bio.equal(this.scroll.pos.art[v].images, imgBio.art.list)) art_scroller.setScroll(this.scroll.pos.art[v].scroll || 0);
					else art_scroller.setScroll(0);
				} else {
					if (imgBio.art.list.length && $Bio.equal(this.scroll.pos.art[v].images, imgBio.art.list)) art_scroller.setScroll(Math.round(this.scroll.pos.art[v].scroll / this.scroll.pos.art[v].blockSize) * this.blockSize || 0);
					else art_scroller.setScroll(0);
					this.logScrollPos();
				}
				break;
			case false: {
				if (!panelBio.stnd(panelBio.alb.ix, panelBio.alb.list)) return cov_scroller.setScroll(0);
				v = imgBio.id.albCyc;
				if (!this.scroll.pos.cov[v]) return cov_scroller.setScroll(0);
				else if (this.scroll.pos.cov[v].blockSize == this.blockSize) cov_scroller.setScroll(this.scroll.pos.cov[v].scroll || 0);
				else cov_scroller.setScroll(Math.round(this.scroll.pos.cov[v].scroll / this.scroll.pos.cov[v].blockSize) * this.blockSize || 0);
				break;
			}
		}
	}

	id() {
		return panelBio.style.showFilmStrip + panelBio.filmStripSize.t + panelBio.filmStripSize.r + panelBio.filmStripSize.b + panelBio.filmStripSize.l + pptBio.filmStripPos;
	}

	lbtn_dblclk(p_x, p_y) {
		let new_ix = this.get_ix(p_x, p_y);
		if (pptBio.artistView) {
			if (new_ix != -1 && new_ix != imgBio.art.ix) {
				imgBio.art.ix = new_ix;
				imgBio.setPhoto();
			}
		} else {
			if (new_ix != -1 && new_ix != imgBio.cov.ix) {
				 imgBio.cov.ix = new_ix;
				imgBio.setCov();
			}
		}
	}

	lbtn_up(p_x, p_y) {
		if (!pptBio.dblClickToggle) {
			let new_ix = this.get_ix(p_x, p_y);
			if (pptBio.artistView) {
				if (new_ix != -1 && new_ix != imgBio.art.ix && (!pptBio.touchControl || uiBio.id.touch_dn == new_ix)) {
					imgBio.art.ix = new_ix;
					imgBio.setPhoto();
				}
			} else {
				if (new_ix != -1 && new_ix != imgBio.cov.ix && (!pptBio.touchControl || uiBio.id.touch_dn == new_ix)) {
					 imgBio.cov.ix = new_ix;
					imgBio.setCov();
				}
			}
		}
	}

	leave() {
		if (menBio.right_up) return;
		this.m_i = -1;
		this.paint();
	}

	logScrollPos(images) {
		if (!pptBio.showFilmStrip) return;
		let keys = [];
		let v;
		switch (pptBio.artistView) {
			case true: {
				keys = Object.keys(this.scroll.pos.art);
				if (keys.length > 25) delete this.scroll.pos.art[keys[0]];
				v = imgBio.artist;
				if (!this.scroll.pos.art[v]) this.scroll.pos.art[v] = {
					images: []
				}
				const o = this.scroll.pos.art[v];
				if (images) o.images = images;
				else {
					o.arr = $Bio.isArray(imgBio.art.images) ? imgBio.art.images.slice() : [];
					o.blockSize = this.blockSize;
					o.ix = imgBio.art.ix;
					o.scroll = art_scroller.scroll;
				}
				break;
			}
			case false:
				if (!panelBio.stnd(panelBio.alb.ix, panelBio.alb.list)) break;
				v = imgBio.id.albCyc;
				this.scroll.pos.cov[v] = {
					blockSize: this.blockSize,
					scroll: cov_scroller.scroll
				}
				break;
		}
	}

	mbtn_up(n) {
		switch (n) {
			case 'onOff':
				pptBio.toggle('showFilmStrip');
				this.set('clear');
				this.paint();
				break;
			case 'showCurrent':
				if (this.blocks.length > this.blocks.drawn && (!pptBio.text_only || uiBio.style.isBlur)) {
					this.showImage(pptBio.artistView ? imgBio.art.ix : imgBio.cov.ix);
				}
				break;
		}
	}

	move(x, y) {
		if (!pptBio.showFilmStrip || pptBio.text_only && !uiBio.style.isBlur) return this.hand = false;
		this.m_i = this.get_ix(x, y);
		this.hand = this.m_i == -1 ? false : true;
	}

	noIm(gr, box_x, box_y) {
		if ((!this.style.horizontal && box_y >= this.y && box_y <= this.y + this.h - this.blockSize) || (this.style.horizontal && box_x >= this.x && box_x <= this.x + this.w - this.blockSize)) {
			if (this.style.image != 2) gr.FillSolidRect(box_x + this.noimg.xy, box_y + this.noimg.xy, this.noimg.wh, this.noimg.wh, uiBio.col.bg1);
			else gr.FillEllipse(box_x + this.noimg.xy, box_y + this.noimg.xy, this.noimg.wh, this.noimg.wh, uiBio.col.bg1);
		}
	}
	getKey(pth) {
		return this.im_w + this.style.image + pth;
	}

	on_load_image_done(image, image_path) {
		const key = this.getKey(image_path);
		const o = this.cache[key];
		if (o && o.img == 'called') this.cacheIt(image, key);
	}

	on_size() {
		if (this.init) this.setSize();
		else this.sizeDebounce();
		this.init = false;
	}

	paint() {
		if (!panelBio.style.showFilmStrip) return;
		window.RepaintRect(this.repaint.x, this.repaint.y, window.Width, window.Height);
	}

	scrollerType() {
		return pptBio.artistView ? art_scroller : cov_scroller;
	}

	setFilmStripSize() {
		panelBio.filmStripSize = !panelBio.style.showFilmStrip ? {
			t: 0,
			r: 0,
			b: 0,
			l: 0
		} : {
			t: pptBio.filmStripPos == 0 ? this.y + this.h : 0,
			r: pptBio.filmStripPos == 1 ? panelBio.w - this.x : 0,
			b: pptBio.filmStripPos == 2 ? panelBio.h - this.y : 0,
			l: pptBio.filmStripPos == 3 ? this.x + this.w : 0
		}
	}

	set(i) {
		switch (i) {
			case 0:
			case 1:
			case 2:
			case 3:
				pptBio.filmStripPos = i;
				break;
			case 4: {
				const continue_confirmation = (status, confirmed) => {
					if (confirmed) pptBio.filmStripSize = 0.15;
				}
				popUpBox.confirm('Reset Filmstrip To Default Size', 'Continue?', 'Yes', 'No', continue_confirmation);
				break;
			}
		}
		filmStrip.logScrollPos();
		this.clearCache();
		this.setSize();
		this.check(i);
		txt.refresh(0);
		this.paint();
	}

	setSize() {
		if (!pptBio.showFilmStrip) return;
		this.style.auto = pptBio.autoFilm;
		this.style.fit = pptBio.filmStripAutofit;
		this.style.gap = pptBio.thumbNailGap;
		this.style.image = pptBio.artistView ? pptBio.filmPhotoStyle : pptBio.filmCoverStyle;
		const spacer = Math.round((!this.style.gap ? 2 : this.style.gap < 3 ? 1 : 0) * $Bio.scale);
		let max_h = panelBio.h;
		let max_w = panelBio.w;
		this.max_sz = panelBio.w;
		this.text_y = !panelBio.style.fullWidthHeading || pptBio.img_only || (!txt.text && !pptBio.text_only) ? 0 : panelBio.text.t;
		switch (pptBio.filmStripPos) {
			case 0: // top
				this.y = pptBio.filmStripMargin == 2 ? pptBio.borT : pptBio.filmStripMargin == 4 ? pptBio.textT : spacer;
				max_h = panelBio.h - this.y;
				this.x = pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borL : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textL : spacer;
				this.w = panelBio.w - this.x - (pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borR : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textR : spacer);
				this.max_sz = Math.min(max_h - 5, this.w);
				this.blockSize = Math.round(pptBio.filmStripSize * panelBio.h);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.w / Math.max(Math.round(this.w / this.blockSize), 1));
					this.h = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = Math.floor(this.w / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = this.blockSize;
				}
				this.style.horizontal = true;
				this.repaint = {
					x: 0,
					y: 0,
					w: panelBio.w,
					h: this.y + this.h + 2
				}
				break;

			case 1: { // right
				const pad_r = pptBio.filmStripMargin == 2 ? pptBio.borR : pptBio.filmStripMargin == 4 ? pptBio.textR : spacer;
				max_w = panelBio.w - pad_r;
				// this.y = this.text_y || (pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borT : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textT : spacer);
				this.y = pptBio.filmStripMargin == 2 ? pptBio.style == 1 || pptBio.style == 2 || pptBio.style == 3 ? pptBio.borT + scaleForDisplay(48) : pptBio.text_only ? pptBio.borT + scaleForDisplay(46) : pptBio.borT : pptBio.filmStripMargin == 4 ? pptBio.textT : spacer;
				this.h = panelBio.h - this.y - (pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borB : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textB : spacer);
				this.max_sz = Math.min(max_w - 5, this.h);
				this.blockSize = Math.round(pptBio.filmStripSize * panelBio.w);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.h / Math.max(Math.round(this.h / this.blockSize)), 1);
					this.w = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = Math.floor(this.h / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = this.blockSize;
				}
				this.x = panelBio.w - this.w - pad_r;
				this.style.horizontal = false;
				this.repaint = {
					x: this.x - 2,
					y: 0,
					w: panelBio.w - this.x + 2,
					h: panelBio.h
				}
				break;
			}

			case 2: { // bottom
				const pad_b = pptBio.filmStripMargin == 2 ? pptBio.borB : pptBio.filmStripMargin == 4 ? pptBio.textB : spacer
				max_h = panelBio.h - pad_b;
				this.x = pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borL : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textL : spacer;
				this.w = panelBio.w - this.x - (pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borR : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textR : spacer);
				this.max_sz = Math.min(max_h - 5, this.w);
				this.blockSize = Math.round(pptBio.filmStripSize * panelBio.h);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.w / Math.max(Math.round(this.w / this.blockSize), 1));
					this.h = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = Math.floor(this.w / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = this.blockSize;
				}
				this.y = panelBio.h - this.h - pad_b;
				this.style.horizontal = true;
				this.repaint = {
					x: 0,
					y: this.y - 2,
					w: panelBio.w,
					h: panelBio.h - this.y + 2
				}
				break;
			}

			case 3: // left
				this.x = pptBio.filmStripMargin == 2 ? pptBio.borL : pptBio.filmStripMargin == 4 ? pptBio.textL : spacer;
				max_w = panelBio.w - this.x;
				//this.y = this.text_y || (pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borT : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textT : spacer);
				this.y = pptBio.filmStripMargin == 2 ? pptBio.style == 1 || pptBio.style == 2 || pptBio.style == 3 ? pptBio.borT + scaleForDisplay(48) : pptBio.text_only ? pptBio.borT + scaleForDisplay(46) : pptBio.borT : pptBio.filmStripMargin == 4 ? pptBio.textT : spacer;
				this.h = panelBio.h - this.y - (pptBio.filmStripMargin == 1 || pptBio.filmStripMargin == 2 ? pptBio.borB : pptBio.filmStripMargin == 3 || pptBio.filmStripMargin == 4 ? pptBio.textB : spacer);
				this.max_sz = Math.min(max_w - 5, this.h);
				this.blockSize = Math.round(pptBio.filmStripSize * panelBio.w);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.h / Math.max(Math.round(this.h / this.blockSize)), 1);
					this.w = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = Math.floor(this.h / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = this.blockSize;
				}
				this.style.horizontal = false;
				this.repaint = {
					x: 0,
					y: 0,
					w: this.x + this.w + 2,
					h: panelBio.h
				}
				break;
		}
		this.blocks.drawn = Math.floor((this.style.horizontal ? this.w : this.h) / this.blockSize);
		this.im_w = Math.round(Math.max(this.blockSize - Math.round(this.style.gap), 10));

		this.cachesize.max = Math.max(this.blocks.drawn * 6, 200);
		this.cachesize.min = this.blocks.drawn * 3;

		this.noimg.xy = Math.round((this.blockSize - this.im_w) / 2) + 3;
		this.noimg.wh = this.im_w - 6;

		if (this.scrollerType().scroll > this.scrollerType().max_scroll) this.scrollerType().checkScroll(this.scrollerType().max_scroll);
		this.createBorder();

	}

	showImage(i) {
		this.m_i = -1;
		const b = $Bio.clamp(Math.round(this.scrollerType().delta / this.scrollerType().row.h), 0, this.blocks.drawn - 1);
		const f = Math.min(b + Math.floor((this.style.horizontal ? this.w : this.h) / this.scrollerType().row.h), this.blocks.drawn);
		if (i <= b || i >= f) {
			const delta = (this.style.horizontal ? this.w : this.h) / 2 > this.scrollerType().row.h ? Math.floor((this.style.horizontal ? this.w : this.h) / 2) : 0;
			const deltaRows = Math.floor(delta / this.scrollerType().row.h) * this.scrollerType().row.h;
			this.scrollerType().checkScroll(i * this.scrollerType().row.h - deltaRows, 'full');
		}
	}

	trace(x, y) {
		if (!panelBio.style.showFilmStrip) return false;
		return [y < this.y + this.h, x > this.x, y > this.y, x < this.x + this.w][pptBio.filmStripPos];
	}

	trimCache(image_path, key) {
		if (image_path) key = this.getKey(image_path);
		delete this.cache[key];
	}

	updScroll(n) {
		this.scrollerType().metrics(this.x, this.y, this.w, this.h, this.blocks.drawn, this.blockSize, this.style.horizontal);
		this.scrollerType().setRows(this.blocks.length);
		if (n !== false && !this.scrollerType().draw_timer) this.getScrollPos();
	}
}