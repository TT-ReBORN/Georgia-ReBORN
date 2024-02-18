'use strict';

class BioFilmStrip {
	constructor() {
		this.accessed = 0;
		this.blockSize = 80;
		this.cache = {};
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

		bioSet.thumbNailGap = Math.max(bioSet.thumbNailGap, 0);
		bioSet.filmStripSize = $Bio.clamp(parseFloat(bioSet.filmStripSize.toFixed(15)), 0.02, 0.98);

		this.blocks = {
			drawn: 6,
			end: 1,
			length: 0,
			start: 0,
			style: [{ bor: [null, null, null] }, { bor: [null, null, null] }, { bor: [null, null, null] }]
		};

		this.cachesize = {
			max: 200,
			min: 20
		};

		this.cur = {
			id: false,
			borId: 0
		};

		this.noimg = {
			xy: 0,
			wh: 80
		};

		this.repaint = {
			x: 0,
			y: 0,
			w: bio.panel.w,
			h: bio.panel.h
		};

		this.scroll = {
			pos: {
				art: {},
				cov: {}
			}
		};

		this.style = {
			auto: false,
			fit: true,
			gap: 0,
			horizontal: false,
			image: [bioSet.filmCoverStyle, bioSet.filmPhotoStyle]
		};

		this.imageDebounce = $Bio.debounce(() => {
			this.rate = // ! To always load filmStrip images successfully, debounce refresh rate must be lower than seekbar's refresh rate
				grSet.seekbar === 'progressbar'  ? grSet.progressBarRefreshRate :
				grSet.seekbar === 'peakmeterbar' ? grSet.peakmeterBarRefreshRate :
				grSet.seekbar === 'waveformbar'  ? grSet.waveformBarRefreshRate : '';
			this.getImages();
		}, Math.round(this.rate * 0.5), {
			leading: true,
			trailing: true
		});

		this.sizeDebounce = $Bio.debounce(() => {
			if (!bioSet.showFilmStrip) return;
			this.logScrollPos();
			this.clearCache();
			this.setSize();
			this.check();
			bio.txt.refresh(0);
		}, 100);
	}

	// * METHODS * //

	async load_image_async(image_path) {
		const image = await gdi.LoadImageAsyncV2(0, image_path);
		if (!bio.panel.style.showFilmStrip) return;
		const key = this.getLoadKey(image_path);
		const o = this.cache[key];
		if (o && o.img == 'called') this.cacheIt(image, key, o.style);
    }

	cacheIt(image, key, style) {
		try {
			if (image) {
				if (bio.img.filter.size && bioSet.artistView && (!bioSet.imgFilterBothPx ? image.Width < bio.img.filter.minPx && image.Height < bio.img.filter.minPx : image.Width < bio.img.filter.minPx || image.Height < bio.img.filter.minPx) && bio.img.art.images.length > bio.img.filter.minNo) {
					const image_path = key.replace(/^\d+/, '');
					const rem_ix = bio.img.art.images.findIndex(v => v == image_path);
					if (rem_ix != -1) bio.img.art.images.splice(rem_ix, 1);
					this.trimCache(image_path);
					bio.seeker.upd();
					this.logScrollPos();
					this.check('imgUpd');
					!bioSet.imgSeeker ? this.paint() : bio.txt.paint();
					return;
				}
				if (bio.img.filter.size && !bioSet.artistView && bio.img.artFolder && (!bioSet.imgFilterBothPx ? image.Width < bio.img.filter.minPx && image.Height < bio.img.filter.minPx : image.Width < bio.img.filter.minPx || image.Height < bio.img.filter.minPx) && bio.img.cov.images.length > bio.img.filter.minNo + 1) {
					const image_path = key.replace(/^\d+/, '');
					const rem_ix = bio.img.cov.images.findIndex(v => v == image_path);
					if (rem_ix != -1) {
						bio.img.cov.list.splice(rem_ix, 1);
						bio.img.cov.images.splice(rem_ix, 1);
					}
					this.trimCache(image_path);
					bio.seeker.upd();
					this.logScrollPos();
					this.check('imgUpd');
					!bioSet.imgSeeker ? this.paint() : bio.txt.paint();
					return;
				}
			} else if (!image) image = bio.img.stub.default[!key.includes('noitem') ? bioSet.artistView ? 1 : 0 : 2];
			if (image) {
				image = bio.img.format(image, 1, ['default', 'crop', 'circular'][style], this.im_w, this.im_w, 'filmStrip');
				this.checkCache();
				this.cache[key] = {
					img: image,
					style,
					accessed: ++this.accessed
				};
			}
		} catch (e) {
			const image_path = key.replace(/^\d+/, '');
			if (bioSet.artistView) {
				const rem_ix = bio.img.art.images.findIndex(v => v == image_path);
				if (rem_ix != -1) bio.img.art.images.splice(rem_ix, 1);
				this.trimCache(image_path);
			} else {
				const rem_ix = bio.img.cov.images.findIndex(v => v == image_path);
				if (rem_ix != -1) {
					bio.img.cov.list.splice(rem_ix, 1);
					bio.img.cov.images.splice(rem_ix, 1);
				}
				this.trimCache(image_path);
			}
			bio.seeker.upd();
			this.check();
			if (bioSet.imgSeeker) bio.txt.paint();
			$Bio.trace(`unable to load thumbnail image: ${key}`);
		}
		this.paint();
	}

	check(n) {
		const y_text = !bio.panel.style.fullWidthHeading || bioSet.img_only ? 0 : bio.panel.text.t;
		if (this.text_y != y_text) this.setSize();
		bio.panel.style.showFilmStrip = false;
		if (bioSet.showFilmStrip) {
			this.images = [];
			this.items = [];
			switch (true) {
				case bioSet.style == 4 && bioSet.filmStripOverlay:
					break;
				case !this.style.auto:
					bio.panel.style.showFilmStrip = true;
					switch (true) {
						case bioSet.artistView:
							if (!bioSet.cycPhoto || !bio.img.art.images.length) break;
							this.images = bio.img.art.images;
							break;
						case !bioSet.artistView:
							if (!bio.panel.stnd(bio.panel.alb.ix, bio.panel.alb.list) || !bio.img.cov.cycle || !bio.img.cov.images.length) break;
							this.images = bio.img.cov.images;
							break;
					}
					break;
				case this.style.auto:
					switch (true) {
						case bioSet.artistView:
							if (!bioSet.cycPhoto || bio.img.art.images.length < 2) break;
							this.images = bio.img.art.images;
							bio.panel.style.showFilmStrip = true;
							break;
						case !bioSet.artistView:
							if (!bio.panel.stnd(bio.panel.alb.ix, bio.panel.alb.list) || !bio.img.cov.cycle || bio.img.cov.images.length < 2) break;
							this.images = bio.img.cov.images;
							bio.panel.style.showFilmStrip = true;
							break;
					}
					break;
			}
			if (!this.images.length && !this.style.auto) this.images[0] = bio.img.cur_pth();
			this.blocks.length = this.images.length;
			this.updScroll(n);
			if (n == 'imgUpd') this.scrollerType().checkScroll(this.scrollerType().scroll, 'step');
		}
		const id = this.id();
		if (id.id != this.cur.id) {
			this.cur.id = id.id;
			if (n != 'clear') {
				bio.txt.logScrollPos();
				this.setSize(); // check required for initially hidden panels
				bio.txt.albumFlush(); // handle track change no filmStrip to needed
				bio.txt.artistFlush();
				bio.txt.rev.cur = '';
				bio.txt.bio.cur = '';
				this.setFilmStripSize(); // check required for initially hidden panels
				bio.panel.setStyle(bio.resize.down); // if clear: called by refresh(0)
				bio.panel.checkFilm(); // if clear: refresh(0) does text
			}
		} else if (id.borId != this.cur.borId) {
			this.cur.borId = id.borId;
			this.setSize();
			this.setFilmStripSize();
		} else {
			this.setFilmStripSize();
		}
		this.paint();
	}

	checkCache() {
		let keys = Object.keys(this.cache);
		const cacheLength = keys.length;
		if (cacheLength < this.cachesize.max && !bio.img.memoryLimit()) return;
		this.cache = bio.img.sortCache(this.cache, 'accessed');
		keys = Object.keys(this.cache);
		const numToRemove = Math.round((Math.min(this.cachesize.max, cacheLength) - this.cachesize.min) / 5);
		if (numToRemove > 0) {
			for (let i = 0; i < numToRemove; i++) this.trimCache(false, keys[i]);
		}
	}

	clearCache() {
		this.cache = {};
		this.accessed = 0;
	}

	createBorder() {
		if (!bioSet.showFilmStrip || this.blockSize < 2 || isNaN(this.blockSize)) return;
		const sp = Math.round((this.blockSize - this.im_w) / 2);
		for (let j = 0; j < 3; j++) {
			for (let i = 0; i < 3; i++) {
				const col = i < 2 ? bio.ui.col.imgBor : bio.ui.col.frame;
				const w = i < 2 ? bio.ui.style.l_w : bio.ui.style.l_w * 3;
				const floor = Math.floor(w / 2);
				const w1 = !this.style.horizontal || i == 2 ? w : i == 1 ? -100 : w;
				const w2 = this.style.horizontal || i == 2 ? w : i == 1 ? -100 : w;
				this.blocks.style[j].bor[i] = $Bio.gr(this.blockSize, this.blockSize, true, g => { // 0 circ|rect; 1 circ|rect_no_trailing; 2 sel circ|rect
					if (j == 2) {
						g.SetSmoothingMode(2);
						g.DrawEllipse(sp + floor, sp + floor, this.im_w - w, this.im_w - w, w, col);
						g.SetSmoothingMode(0);
					} else {
						g.DrawRect(sp + floor, sp + floor, this.im_w - w1, this.im_w - w2, w, col);
					}
				});
			}
		}
	}

	draw(gr) {
		if (!bio.panel.style.showFilmStrip || bio.panel.block()) return;
		const imgStyle = this.style.image[Number(bioSet.artistView)];
		let box_x;
		let box_y;
		let iw;
		let ih;
		this.getItemsToDraw();
		for (let i = this.blocks.start; i < this.blocks.end; i++) {
			box_x = this.style.horizontal ? Math.floor(this.x + i * this.blockSize - this.scrollerType().delta) : this.x;
			box_y = !this.style.horizontal ? Math.floor(this.y + i * this.blockSize - this.scrollerType().delta) : this.y;
			const im = this.getImg(i);
			if (im) {
				iw = im.Width;
				ih = im.Height;
				const sel = (!bioSet.text_only || bio.ui.style.isBlur) && this.blocks.length > 1 && this.images[i] == bio.img.cur_pth();
				const x = box_x + Math.round((this.blockSize - iw) / 2);
				const y = box_y + Math.round((this.blockSize - ih) / 2);
				let bor = !sel ? this.blocks.style[imgStyle].bor[1] : this.blocks.style[imgStyle].bor[2];
				if (imgStyle != 2 && !sel && (this.style.gap || this.style.fit && i == this.blocks.end - 2 && i != this.blocks.length - 2 || i == this.blocks.length - 1)) bor = this.blocks.style[imgStyle].bor[0];
				!this.style.horizontal ? this.drawVerticalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw, imgStyle) : this.drawhorizontalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw, imgStyle);
			} else this.noIm(gr, box_x, box_y, imgStyle);
		}
	}

	drawhorizontalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw, imgStyle) {
		const c = imgStyle == 2 ? 1 : 0;
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

	drawVerticalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw, imgStyle) {
		const c = imgStyle == 2 ? 1 : 0;
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
		if (!bioSet.showFilmStrip) return -1;
		if (!this.images.length || bio.but.trace('lookUp', bio.panel.m.x, bio.panel.m.y)) return -1;
		if (bio.panel.trace.film && y > this.y && y < this.y + this.h && x > this.x && x < this.x + this.w) {
			const idx = this.style.horizontal ? Math.ceil((x + this.scrollerType().delta - this.x) / this.blockSize) - 1 : Math.ceil((y + this.scrollerType().delta - this.y) / this.blockSize) - 1;
			return idx > this.images.length - 1 ? -1 : idx;
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
			if (!this.cache[this.getKey(key)]) {
				this.items.push({
					ix: i,
					key
				});
			}
		}
		if (!this.items.length) return;
		if (!this.loadTimer) {
			this.loadTimer = setInterval(() => {
				if (this.items.length) {
					const v = this.items[0];
					if (!v.key) this.items.shift();
					else if (window.ID) {
						const key = this.getKey(v.key);
						if (!this.cache[key]) {
							const embeddedImg = bio.img.isEmbedded('thumb', v.ix);
							if (!embeddedImg) {
								this.cache[key] = {
									img: 'called',
									style: this.style.image[Number(bioSet.artistView)],
									accessed: ++this.accessed
								};
								gdi.LoadImageAsync(0, v.key);
							} else {
								this.cacheIt(embeddedImg, key, this.style.image[Number(bioSet.artistView)]);
							}
						}
						this.items.shift();
					}
				} else {
					clearInterval(this.loadTimer);
					this.loadTimer = null;
				}
			}, 16);
		}
	}

	getItemsToDraw() {
		if (this.blocks.length <= this.blocks.drawn) {
			this.blocks.start = 0;
			this.blocks.end = this.blocks.length;
		} else {
			this.blocks.start = Math.round(this.scrollerType().delta / this.blockSize);
			this.blocks.end = Math.min(this.blocks.start + this.blocks.drawn + (this.style.fit ? 1 : 2), this.blocks.length);
			this.blocks.start = $Bio.clamp(this.blocks.start, 0, this.blocks.start - 1);
		}
		this.imageDebounce();
	}

	getKey(pth) {
		return (this.im_w * 100 + this.style.image[Number(bioSet.artistView)] + pth);
	}

	getLoadKey(pth) {
		let key = '';
		this.style.image.some(v => {
			key = this.im_w * 100 + v + pth; // * 100 to fix occasional auto-fit clashes
			const o = this.cache[key];
			return o && o.img == 'called';
		});
		return key;
	}

	getScrollPos() {
		let v;
		switch (bioSet.artistView) {
			case true:
				v = bio.img.artist;
				if (!this.scroll.pos.art[v]) return bio.art_scroller.setScroll(0);
				else if (this.scroll.pos.art[v].blockSize == this.blockSize) {
					if (bio.img.art.list.length && $Bio.equal(this.scroll.pos.art[v].images, bio.img.art.list)) bio.art_scroller.setScroll(this.scroll.pos.art[v].scroll || 0);
					else bio.art_scroller.setScroll(0);
				} else {
					if (bio.img.art.list.length && $Bio.equal(this.scroll.pos.art[v].images, bio.img.art.list)) bio.art_scroller.setScroll(Math.round(this.scroll.pos.art[v].scroll / this.scroll.pos.art[v].blockSize) * this.blockSize || 0);
					else bio.art_scroller.setScroll(0);
					this.logScrollPos();
				}
				break;
			case false: {
				if (!bio.panel.stnd(bio.panel.alb.ix, bio.panel.alb.list)) return bio.cov_scroller.setScroll(0);
				v = bio.img.id.albCyc;
				if (!this.scroll.pos.cov[v]) return bio.cov_scroller.setScroll(0);
				else if (this.scroll.pos.cov[v].blockSize == this.blockSize) bio.cov_scroller.setScroll(this.scroll.pos.cov[v].scroll || 0);
				else bio.cov_scroller.setScroll(Math.round(this.scroll.pos.cov[v].scroll / this.scroll.pos.cov[v].blockSize) * this.blockSize || 0);
				break;
			}
		}
	}

	id() {
		const needExtraId = bioSet.showFilmStrip && bioSet.filmStripOverlay && bio.img.isType('AnyBor');
		const id = bio.panel.style.showFilmStrip + bio.panel.filmStripSize.t + bio.panel.filmStripSize.r + bio.panel.filmStripSize.b + bio.panel.filmStripSize.l + bioSet.filmStripPos;
		return {
			id: isNaN(id) ? Infinity : id, // stop NaN != NaN = true & too much recursion
			borId: needExtraId ? bio.img.style.crop + bio.img.isType('Border') : 0
		};
	}

	lbtn_dblclk(p_x, p_y) {
		const new_ix = this.get_ix(p_x, p_y);
		if (bioSet.artistView) {
			if (new_ix != -1 && new_ix != bio.img.art.ix) {
				bio.img.art.ix = new_ix;
				bio.img.setPhoto();
			}
		} else if (new_ix != -1 && new_ix != bio.img.cov.ix) {
			bio.img.cov.ix = new_ix;
			bio.img.setCov();
		}
	}

	lbtn_up(p_x, p_y) {
		if (!bioSet.dblClickToggle) {
			const new_ix = this.get_ix(p_x, p_y);
			if (bioSet.artistView) {
				if (new_ix != -1 && new_ix != bio.img.art.ix && (!bioSet.touchControl || bio.ui.id.touch_dn == new_ix)) {
					bio.img.art.ix = new_ix;
					bio.img.setPhoto();
				}
			} else if (new_ix != -1 && new_ix != bio.img.cov.ix && (!bioSet.touchControl || bio.ui.id.touch_dn == new_ix)) {
				bio.img.cov.ix = new_ix;
				bio.img.setCov();
			}
		}
	}

	leave() {
		if (bio.men.right_up) return;
		this.m_i = -1;
		this.paint();
	}

	logScrollPos(images) {
		if (!bioSet.showFilmStrip) return;
		let keys = [];
		let v;
		switch (bioSet.artistView) {
			case true: {
				keys = Object.keys(this.scroll.pos.art);
				if (keys.length > 25) delete this.scroll.pos.art[keys[0]];
				v = bio.img.artist;
				if (!this.scroll.pos.art[v]) {
					this.scroll.pos.art[v] = {
						images: []
					};
				}
				const o = this.scroll.pos.art[v];
				if (images) o.images = images;
				else {
					o.arr = $Bio.isArray(bio.img.art.images) ? bio.img.art.images.slice() : [];
					o.blockSize = this.blockSize;
					o.ix = bio.img.art.ix;
					o.scroll = bio.art_scroller.scroll;
				}
				break;
			}
			case false:
				if (!bio.panel.stnd(bio.panel.alb.ix, bio.panel.alb.list)) break;
				v = bio.img.id.albCyc;
				this.scroll.pos.cov[v] = {
					blockSize: this.blockSize,
					scroll: bio.cov_scroller.scroll
				};
				break;
		}
	}

	mbtn_up(n) {
		switch (n) {
			case 'onOff':
				bioSet.toggle('showFilmStrip');
				this.set('clear');
				this.paint();
				break;
			case 'showCurrent':
				if (this.blocks.length > this.blocks.drawn && (!bioSet.text_only || bio.ui.style.isBlur)) {
					this.showImage(bioSet.artistView ? bio.img.art.ix : bio.img.cov.ix);
				}
				break;
		}
	}

	move(x, y) {
		if (!bioSet.showFilmStrip || bioSet.text_only && !bio.ui.style.isBlur) return this.hand = false;
		this.m_i = this.get_ix(x, y);
		this.hand = this.m_i != -1;
	}

	noIm(gr, box_x, box_y, imgStyle) {
		if ((!this.style.horizontal && box_y >= this.y && box_y <= this.y + this.h - this.blockSize) || (this.style.horizontal && box_x >= this.x && box_x <= this.x + this.w - this.blockSize)) {
			if (imgStyle != 2) gr.FillSolidRect(box_x + this.noimg.xy, box_y + this.noimg.xy, this.noimg.wh, this.noimg.wh, bio.ui.col.bg1);
			else gr.FillEllipse(box_x + this.noimg.xy, box_y + this.noimg.xy, this.noimg.wh, this.noimg.wh, bio.ui.col.bg1);
		}
	}

	on_load_image_done(image, image_path) {
		if (!bio.panel.style.showFilmStrip) return;
		const key = this.getLoadKey(image_path);
		const o = this.cache[key];
		if (o && o.img == 'called') {
			if (image) this.cacheIt(image, key, o.style);
			else {
				setTimeout(() => {
					this.load_image_async(image_path); // try again some dnlded can fail to load: folder temp locked?
				}, 1500);
			}
		}
	}

	on_size() {
		if (this.init) this.setSize();
		else this.sizeDebounce();
		this.init = false;
	}

	paint() {
		if (!bio.panel.style.showFilmStrip) return;
		window.RepaintRect(this.repaint.x, this.repaint.y, this.repaint.w, this.repaint.h);
	}

	scrollerType() {
		return bioSet.artistView ? bio.art_scroller : bio.cov_scroller;
	}

	setFilmStripSize() {
		bio.panel.filmStripSize = !bio.panel.style.showFilmStrip ? {
			t: 0,
			r: 0,
			b: 0,
			l: 0
		} : {
			t: bioSet.filmStripPos == 0 ? this.y + this.h - SCALE(55) : 0,
			r: bioSet.filmStripPos == 1 ? bio.panel.w - this.x : 0,
			b: bioSet.filmStripPos == 2 ? bio.panel.h - this.y + SCALE(25) : 0,
			l: bioSet.filmStripPos == 3 ? this.x + this.w : 0
		};
	}

	set(i) {
		switch (i) {
			case 0:
			case 1:
			case 2:
			case 3:
				bioSet.showFilmStrip = true;
				bioSet.filmStripPos = i;
				break;
			case 5: {
				const continue_confirmation = (status, confirmed) => {
					if (confirmed) bioSet.filmStripSize = bioSet.filmStripOverlay && !bioSet.text_only && bioSet.style !== 4 ? 0.09 : 0.05;
				};
				const caption = 'Reset Filmstrip To Default Size';
				const prompt = 'Continue?';
				const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'Yes', 'No', false, 'center', continue_confirmation) : true;
				if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
				break;
			}
		}
		bioSet.filmStripSize = bioSet.filmStripOverlay && !bioSet.text_only && bioSet.style !== 4 ? 0.09 : 0.05;
		bio.filmStrip.logScrollPos();
		bio.img.mask.reset = true;
		this.clearCache();
		this.setSize();
		this.check(i);
		bio.txt.refresh(0);
		this.paint();
	}

	setSize() {
		if (!bioSet.showFilmStrip) return;
		this.style.auto = bioSet.autoFilm;
		this.style.fit = bioSet.filmStripAutofit;
		this.style.gap = bioSet.thumbNailGap;
		const filmStripOverlay = bioSet.filmStripOverlay && !bioSet.text_only;
		const spacer = Math.round((!this.style.gap ? 2 : this.style.gap < 3 ? 1 : 0) * $Bio.scale);
		let bor = 0;
		if (filmStripOverlay && bio.img.isType('AnyBor') && bio.img.style.crop) {
			const isBorder = bio.img.isType('Border');
			if (isBorder == 1 || isBorder == 3) {
				bor = 5 * $Bio.scale;
			}
		}

		const marginT = bio.ui.heading.linePad * (RES._4K ? 1.5 : 0.5);
		const marginTopCorr = grSet.layout === 'artwork' ? RES._4K ? -12 : -4 : RES._4K ? -7 : -1;
		const marginTopCorr2 = grSet.layout === 'artwork' ? RES._4K ? -7 : -4 : RES._4K ? -2 : -1;
		const filmStripLeftRight = bioSet.filmStripPos === 1 || bioSet.filmStripPos === 3;
		const filmStripCorrY =
			bioSet.img_only ? filmStripLeftRight && !filmStripOverlay ? bio.ui.y + bioSet.borT : bioSet.filmStripPos === 2 && !filmStripOverlay ? 0 : bio.ui.y :
			filmStripLeftRight && !bioSet.heading ? bio.ui.y + bioSet.borT :
			bioSet.showFilmStrip && bioSet.filmStripPos === 2 && !filmStripOverlay ? marginTopCorr :
			bioSet.style === 4 && bioSet.filmStripPos === 0 && filmStripOverlay ? bio.ui.y - bioSet.gap - marginTopCorr2 :
			bioSet.filmStripPos !== 0 && !filmStripOverlay ? 0 :
			bio.ui.y;

		let max_h = bio.panel.h;
		let max_w = bio.panel.w;
		this.max_sz = bio.panel.w;
		this.text_y = !bio.panel.style.fullWidthHeading || bioSet.img_only ? 0 : bio.panel.text.t;
		switch (bioSet.filmStripPos) {
			case 0: // top
				/** MOD */ this.y = (!filmStripOverlay ? (bioSet.filmStripMargin == 2 ? bioSet.borT : bioSet.filmStripMargin == 4 ? bioSet.textT : spacer) : bio.panel.img.t + bor) + filmStripCorrY;
				max_h = !filmStripOverlay ? bio.panel.h - this.y : bioSet.style == 0 || bioSet.style == 2 ? bio.panel.style.imgSize : bio.panel.h - bio.panel.img.t - bio.panel.img.b - bor * 2;
				this.x = !filmStripOverlay ? (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borL : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textL : spacer) : bio.panel.img.l + bor;
				this.w = !filmStripOverlay ? (bio.panel.w - this.x - (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borR : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textR : spacer)) : bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3 || bioSet.img_only ? bio.panel.w - bio.panel.img.l - bio.panel.img.r - bor * 2 : bio.panel.style.imgSize - bor * 2;
				this.max_sz = Math.min(max_h - 5, this.w);
				this.blockSize = Math.round(bioSet.filmStripSize * bio.panel.h);
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
					y: bio.ui.y,
					w: bio.panel.w,
					h: this.y + this.h + 2
				};
				break;

			case 1: { // right
				const pad_r = bioSet.filmStripMargin == 2 ? bioSet.borR : bioSet.filmStripMargin == 4 ? bioSet.textR : spacer;
				max_w = !filmStripOverlay ? bio.panel.w - pad_r : bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3 ? bio.panel.w - bio.panel.img.l - bio.panel.img.r - bor * 2 : bio.panel.style.imgSize - bor * 2;
				/** MOD */ this.y = (!filmStripOverlay ? (this.text_y + marginT || (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borT : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textT : spacer)) : bio.panel.img.t + bor) + filmStripCorrY;
				this.h = !filmStripOverlay ? (bio.panel.h - this.y - (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borB : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textB : spacer)) : bioSet.style == 0 || bioSet.style == 2 ? bio.panel.style.imgSize - bor * 2 : bioSet.style > 3 ? (bio.panel.clip ? bio.panel.style.imgSize - bioSet.borT : bio.panel.h - bio.panel.img.t - bio.panel.img.b - bor * 2) : bio.panel.h - bio.panel.img.t - bio.panel.img.b - bor * 2;
				this.max_sz = Math.min(max_w - 5, this.h);
				/** MOD */ this.blockSize = Math.round(bioSet.filmStripSize * bio.panel.h);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.h / Math.max(Math.round(this.h / this.blockSize)), 1);
					this.w = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = Math.floor(this.h / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = this.blockSize;
				}
				this.x = !filmStripOverlay ? bio.panel.w - this.w - pad_r : bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3 || bioSet.img_only ? bio.panel.w - this.w - bio.panel.img.r - bor : bio.panel.img.l + bio.panel.style.imgSize - this.w - bor;
				this.style.horizontal = false;
				this.repaint = {
					x: this.x - 2,
					y: bio.ui.y,
					w: bio.panel.w - this.x + 2,
					h: bio.panel.h
				};
				break;
			}

			case 2: { // bottom
				const pad_b = bioSet.filmStripMargin == 2 ? bioSet.borB : bioSet.filmStripMargin == 4 ? bioSet.textB : spacer;
				max_h = !filmStripOverlay ? bio.panel.h - pad_b : bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3 ? bio.panel.style.imgSize - bor * 2 : bio.panel.h - bio.panel.img.t - bio.panel.img.b - bor * 2;
				this.x = !filmStripOverlay ? (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borL : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textL : spacer) : bio.panel.img.l + bor;
				this.w = !filmStripOverlay ? (bio.panel.w - this.x - (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borR : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textR : spacer)) : bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3 || bioSet.img_only ? bio.panel.w - bio.panel.img.l - bio.panel.img.r - bor * 2 : bio.panel.style.imgSize - bor * 2;
				this.max_sz = Math.min(max_h - 5, this.w);
				this.blockSize = Math.round(bioSet.filmStripSize * bio.panel.h);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.w / Math.max(Math.round(this.w / this.blockSize), 1));
					this.h = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = Math.floor(this.w / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = this.blockSize;
				}
				/** MOD */ this.y = (!filmStripOverlay ? bio.panel.h - this.h - pad_b + SCALE(40) : bioSet.style == 0 || bioSet.style == 2 ? bio.panel.img.t + bio.panel.style.imgSize - this.h - bor : bioSet.style > 3 ? (bio.panel.clip ? bio.panel.ibox.t + bio.panel.style.imgSize - this.h : bio.panel.h - bio.panel.img.b - this.h - bor) : bio.panel.h - bio.panel.img.b - this.h - bor) + filmStripCorrY;
				this.style.horizontal = true;
				this.repaint = {
					x: 0,
					y: this.y - 2,
					w: bio.panel.w,
					h: bio.panel.h - this.y + 2 + bio.ui.y
				};
				break;
			}

			case 3: // left
				this.x = !filmStripOverlay ? (bioSet.filmStripMargin == 2 ? bioSet.borL : bioSet.filmStripMargin == 4 ? bioSet.textL : spacer) : bio.panel.img.l + bor;
				max_w = !filmStripOverlay ? bio.panel.w - this.x : bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3 ? bio.panel.w - bio.panel.img.l - bio.panel.img.r - bor * 2 : bio.panel.style.imgSize - bor * 2;
				/** MOD */ this.y = (!filmStripOverlay ? (this.text_y + marginT || (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borT : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textT : spacer)) : bio.panel.img.t + bor) + filmStripCorrY;
				this.h = !filmStripOverlay ? (bio.panel.h - this.y - (bioSet.filmStripMargin == 1 || bioSet.filmStripMargin == 2 ? bioSet.borB : bioSet.filmStripMargin == 3 || bioSet.filmStripMargin == 4 ? bioSet.textB : spacer)) : bioSet.style == 0 || bioSet.style == 2 ? bio.panel.style.imgSize - bor * 2 : bioSet.style > 3 ? (bio.panel.clip ? bio.panel.style.imgSize - bioSet.borT : bio.panel.h - bio.panel.img.t - bio.panel.img.b - bor * 2) : bio.panel.h - bio.panel.img.t - bio.panel.img.b - bor * 2;
				this.max_sz = Math.min(max_w - 5, this.h);
				/** MOD */ this.blockSize = Math.round(bioSet.filmStripSize * bio.panel.h);
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
					y: bio.ui.y,
					w: this.x + this.w + 2,
					h: bio.panel.h
				};
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
		if (!bio.panel.style.showFilmStrip) return false;
		return y > this.y && y < this.y + this.h && x > this.x && x < this.x + this.w;
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
