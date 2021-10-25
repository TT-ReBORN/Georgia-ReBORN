class Images {
	constructor() {
		this.accessed = 0;
		this.asyncBypass = 0;
		this.blockWidth = 150;
		this.cachePath = `${my_utilsLib.packagePath}\\library-tree-cache\\`;
		this.cellWidth = 200;
		this.column = 0;
		this.columnWidth = 150;
		this.database = this.newDatabase();
		this.end = 1;
		this.items = [];
		this.overlayHeight = 0;
		this.panel = {};
		this.preLoadItems = [];
		this.rootNo = 4;
		this.saveSize = 250;
		this.start = 0;
		this.toSave = [];
		this.zooming = false;

		this.bor = {
			bot: 6,
			cov: 16,
			pad: 10,
			side: 2
		}

		this.box = {
			h: 100,
			w: 100
		}

		this.cache = {}

		this.cachesize = {
			min: 20
		}

		this.stub = {
			noImg: null,
			root: null
		}

		this.style = {
			image: 0,
			rootComposite: ppt.rootNode && ppt.curRootImg == 3,
			vertical: !ppt.albumArtFlowMode ? true : ui.h - panel.search.h > ui.w - ui.sbar.w,
			y: 25
		}

		this.im = {
			offset: 0,
			y: 0,
			w: 120
		}

		this.interval = {
			cache: 1,
			preLoad: 5
		}

		this.labels = {}

		this.letter = {
			show: ppt.albumArtLetter,
			w: 0
		}

		this.mask = {
			fade: null,
			circular: null
		}

		this.row = {
			h: 80
		}

		this.text = {
			x: 0,
			y1: 0,
			y2: 0,
			h: 20,
			w: 20
		}

		this.timer = {
			load: null,
			preLoad: null,
			save: null
		}

		this.drawDebounce = $Lib.debounce(() => {
			panel.treePaint();
		}, 500);

		this.loadThrottle = $Lib.throttle(() => {
			if (!panel.imgView) return;
			this.getImages();
		}, 40);

		this.rootDebounce = $Lib.debounce(() => {
			this.checkRootImg();
		}, 250, {
			'leading': true,
			'trailing': true
		});

		this.sizeDebounce = $Lib.debounce(() => {
			if (!panel.imgView) return;
			this.clearCache();
			this.metrics();
			if (sbar.scroll > sbar.max_scroll) sbar.checkScroll(sbar.max_scroll);
		}, 100);

		this.setRoot();
		this.setNoArtist();
		this.setNoCover();
	}

	* range(start, end, step) {
		while (start < end) {
			yield start;
			start += step;
		}
	}

	// Methods

	async get_album_art_async(handle, art_id, key, ix) {
		let result = await utils.GetAlbumArtAsyncV2(window.ID, handle, art_id, false);
		const o = this.cache[key];
		const saveName = md5.hashStr(result.path) + '.jpg';
		if (o && o.img == 'called') this.cacheIt(result.image, key, ix, saveName);
	}

	async load_image_async(key, image_path, ix, rawCache) {
		const image = Date.now() - this.asyncBypass > 5000 ? await gdi.LoadImageAsyncV2(window.ID, image_path) : gdi.Image(image_path);
		const o = this.cache[key];
		if (o && o.img == 'called') !rawCache ? this.cacheIt(image, key, ix) : this.cacheItPreLoad(image, key, ix);
	}

	cacheIt(image, key, ix, saveName) {
		try {
			if (!image) {
				if (this.style.rootComposite && ix < this.rootNo) this.rootDebounce();
				if (this.albumArtDiskCache && !this.database[key]) {
					this.toSave.unshift({
						key: key,
						image: null,
						folder: this.cacheFolder,
						saveName: 'noAlbumArt',
						setKeyOnly: true
					});
				}
			}
			if (image) {
				if (this.albumArtDiskCache && saveName) {
					if (!this.database[key] && $Lib.file(this.cacheFolder + saveName)) {
						this.toSave.unshift({
							key: key,
							image: null,
							folder: this.cacheFolder,
							saveName: saveName,
							setKeyOnly: true
						});
					}
					if (!this.database[key] || !$Lib.file(this.cacheFolder + saveName)) {
						image = this.format(image, 1, 'default', this.saveSize, this.saveSize, false, 'save');
						this.toSave.unshift({
							key: key,
							image: image.Clone(0, 0, image.Width, image.Height),
							folder: this.cacheFolder,
							saveName: saveName,
							setKeyOnly: false
						});
					}
				}

				this.checkCache();
				this.format(image, ppt.artId, ['default', 'crop', 'circular'][this.style.image], this.im.w, this.im.w, ppt.albumArtLabelType == 3, 'display', ix, key);
				if (this.style.rootComposite && ix < this.rootNo) this.rootDebounce();
			}

			if (!this.timer.save && this.toSave.length) this.timer.save = setInterval(() => {
				const ln = this.toSave.length;
				if (ln) {
					if (this.toSave[ln - 1].setKeyOnly) {
						this.database[this.toSave[ln - 1].key] = this.toSave[ln - 1].saveName;
						$Lib.save(this.toSave[ln - 1].folder + 'database.dat', JSON.stringify(this.database, null, 3), true);
					} else {
						const saved = this.toSave[ln - 1].image.SaveAs(this.toSave[ln - 1].folder + this.toSave[ln - 1].saveName, 'image/jpeg');
						if (saved) {
							this.database[this.toSave[ln - 1].key] = this.toSave[ln - 1].saveName;
							$Lib.save(this.toSave[ln - 1].folder + 'database.dat', JSON.stringify(this.database, null, 3), true);
						}
					}
					this.toSave.pop();
				}
				if (!this.toSave.length) {
					clearInterval(this.timer.save);
					this.timer.save = null;
				}
			}, 1000);

		} catch (e) {
			$Lib.trace('unable to load thumbnail image: ' + key);
		}
		this.drawDebounce();
	}

	cacheItPreLoad(image, key, ix) {
		try {
			if (image) {
				this.checkCache();
				this.format(image, ppt.artId, ['default', 'crop', 'circular'][this.style.image], this.im.w, this.im.w, ppt.albumArtLabelType == 3, 'displayPreload', ix, key);
			}
			if (this.style.rootComposite && ix < this.rootNo) this.rootDebounce();
		} catch (e) {
			$Lib.trace('unable to load thumbnail image: ' + key);
		}
		panel.treePaint();
	}

	checkCache() {
		if (!this.memoryLimit()) return;
		const ln = this.columns * panel.rows * 3;
		if (this.toSave.length > ln) this.toSave.length = ln;
		this.preLoadItems = [];
		clearInterval(this.timer.preLoad);
		this.timer.preLoad = null;
		this.items = [];
		clearInterval(this.timer.load);
		this.timer.load = null;
		let keys = Object.keys(this.cache);
		const cacheLength = keys.length;
		if (pop.tree.length) {
			const o = this.cache[pop.tree[0].key];
			if (o) o.accessed = Infinity;
		}
		this.cache = this.sortCache(this.cache, 'accessed');
		keys = Object.keys(this.cache);
		const numToRemove = Math.round((cacheLength - this.cachesize.min) / 2);
		if (numToRemove > 0)
			for (let i = 0; i < numToRemove; i++) this.trimCache(keys[i]);
	}

	checkNowPlaying(item) {
		if (!ppt.highLightNowplaying) return false;
		return !item.root && pop.inRange(pop.nowp, item.item);
	}

	checkRootImg() {
		const key = pop.tree.length ? pop.tree[0].key : null;
		if (!key) return;
		let o = this.cache[key];
		const imgsAvailable = Math.min(Math.round((this.panel.h + this.row.h) / this.row.h) * this.columns, pop.tree.length) - 1;
		let n = Math.max(Math.min(Math.floor(Math.sqrt(imgsAvailable)), Infinity), 2); // auto set collage size: limited by no imgs available (per screen): reduce by changing infinity
		const cells = Math.pow(n, 2);
		this.rootNo = n * n + 1;
		if (!o) this.cache[key] = {
			img: 'called',
			accessed: ++this.accessed
		}
		o = this.cache[key];
		o.img = $Lib.gr(this.cellWidth * n, this.cellWidth * n, true, g => this.createCollage(g, this.cellWidth, this.cellWidth, n, n, cells));
		if (this.style.image == 2) this.circularMask(o.img, o.img.Width, o.img.Height);
		o.img = o.img.Resize(this.im.w, this.im.w, 7);
		if (ppt.albumArtLabelType == 3) this.fadeMask(o.img, o.img.Width, o.img.Height);
		panel.treePaint();
	}

	checkTooltip(gr, item, x, y1, y2, w, tt1, tt2, font1, font2) {
		if (panel.colMarker) {
			if (tt1) tt1 = tt1.replace(/@!#.*?@!#/g, '');
			if (tt2) tt2 = tt2.replace(/@!#.*?@!#/g, '');
		}
		let text = tt1 ? tt1 : '';
		if (tt2 && panel.lines == 2) text += '\n' + tt2;
		item.tt = {
			text: text,
			x: x,
			y1: y1,
			y2: y2,
			w: w,
			1: tt1 ? gr.CalcTextWidth(tt1, font1) > w ? tt1 : false : false,
			2: tt2 ? gr.CalcTextWidth(tt2, font2) > w ? tt2 : false : false
		}
	}

	circularMask(image, w, h) {
		image.ApplyMask(this.mask.circular.Resize(w, h));
	}

	clearCache() {
		this.accessed = 0;
		this.cache = {};
		this.cachesize = {
			min: 20
		};
		this.items = [];
	}

	createCacheFolder() {
		this.albumArtDiskCache = ppt.albumArtDiskCache;
		if (!this.albumArtDiskCache) return;
		const cacheFolder = this.cacheFolder;
		$Lib.buildPth(this.cachePath);
		this.saveSize = this.im.w > 500 ? 750 : this.im.w > 250 ? 500 : 250;
		this.interval = {
			cache: this.saveSize == 250 ? 1 : this.saveSize == 500 ? 4 : 9,
			preLoad: this.saveSize == 250 ? 5 : this.saveSize == 500 ? 20 : 45
		}
		this.cacheFolder = this.cachePath + ['front', 'back', 'disc', 'icon', 'artist'][ppt.artId] + (this.saveSize == 250 ? '' : this.saveSize) + '\\';
		$Lib.create(this.cacheFolder);
		this.database = $Lib.jsonParse(this.cacheFolder + 'database.dat', this.newDatabase(), 'file');
		if (this.cacheFolder != cacheFolder) {
			this.preLoadItems = [];
			clearInterval(this.timer.preLoad);
			this.timer.preLoad = null;
			this.items = [];
			clearInterval(this.timer.load);
			this.timer.load = null;
			this.toSave = [];
			clearInterval(this.timer.save);
			this.timer.save = null;
		}
	}

	createCollage(g, cellWidth, cellHeight, rows, columns, cells) {
		let x = 0;
		let y = 0;
		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < columns; column++) {
				const idx = column + row * columns + 1;
				if (idx <= cells) {
					let img = pop.tree.length && pop.tree[idx] ? this.getRootImg(pop.tree[idx].key) : null;
					if (!img) img = this.stub.noImg;
					if (img) {
						let cx = 0;
						let cy = 0;
						let cw = img.Width;
						let ch = img.Height;
						if (ppt.albumArtLabelType == 3) {
							if (this.style.image != 2) {
								ch -= this.overlayHeight;
							} else {
								cx = cw * 0.1;
								cy = ch * 0.1;
								cw *= 0.8;
								ch = (ch - this.overlayHeight) * 0.8;
							}
						} else if (this.style.image == 2) {
							cx = cw * 0.1;
							cy = ch * 0.1;
							cw *= 0.8;
							ch *= 0.8;
						}
						img = img.Clone(cx, cy, cw, ch);
						img = this.format(img, ppt.artId, 'crop', this.cellWidth, this.cellWidth, false, 'root');
						g.DrawImage(img, x, y, img.Width, img.Height, 0, 0, img.Width, img.Height);
					}
					x += cellWidth;
				}
			}
			x = 0;
			y += cellHeight;
		}
		x = 0;
		y = 0;
		for (let column = 0; column < columns; column++) {
			x += cellWidth;
			if (this.style.image != 2) g.DrawLine(x, 0, x, cellWidth * columns, ui.l.w, ui.col.rootBlend);
		}
		x = 0;
		y = 0;
		for (let row = 0; row < rows; row++) {
			y += cellHeight;
			if (this.style.image != 2) g.DrawLine(x, y, cellWidth * columns, y, ui.l.w, ui.col.rootBlend);

		}
		if (this.style.image != 2) g.DrawRect(0, 0, cellWidth * columns - 1, cellWidth * columns - 1, 1, ui.col.rootBlend);
	}

	createImages() {
		this.mask.circular = $Lib.gr(500, 500, true, g => {
			g.FillSolidRect(0, 0, 500, 500, RGB(255, 255, 255));
			g.SetSmoothingMode(2);
			g.FillEllipse(1, 1, 498, 498, RGBA(0, 0, 0, 255));
			g.SetSmoothingMode(0);
		});
		this.mask.fade = $Lib.gr(500, 500, true, g => {
			g.FillSolidRect(0, 0, 500, 500, RGB(220, 220, 220));
		});
	}

	draw(gr) {
		if (!panel.imgView) return;
		let box_x, box_y, iw, ih;
		this.getItemsToDraw();
		this.column = 0;
		for (let i = this.start; i < this.end; i++) {
			const row = this.style.vertical ? Math.floor(i / this.columns) : 0;
			box_x = this.style.vertical ? Math.floor(ui.x + this.panel.x + this.column * this.columnWidth + this.bor.side) : Math.floor(ui.x + this.panel.x + i * this.columnWidth + this.bor.side - sbar.delta + (ppt.albumArtFlowMode ? scaleForDisplay(18) : 0));
			box_y = this.style.vertical ? Math.floor(ui.y + this.panel.y + row * this.row.h - sbar.delta) : ui.y + this.style.y;
			if (box_y >= 0 - this.row.h && box_y < this.panel.y + this.panel.h) {
				const item = pop.tree[i];
				const grp = item.grp;
				const lot = item.lot;
				const cur_img = !this.zooming ? this.getImg(item.key) : null;
				const nowp = this.checkNowPlaying(item);
				const grpCol = this.getGrpCol(item, nowp, pop.highlight.text && i == pop.m.i);
				const lotCol = this.getLotCol(item, nowp, pop.highlight.text && i == pop.m.i);

				if (!this.labels.hide) this.drawSelBg(gr, cur_img, box_x, box_y, i, nowp);

				// Now playing bg selection with now playing deactivated ( album art )
				if (item.sel && ppt.albumArtShow && (!(pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2))) {
					gr.FillSolidRect(box_x, box_y, this.box.w, this.box.h,
						pref.whiteTheme || pref.blackTheme ? col.primary :
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : col.primary :
						pref.blueTheme ? RGB(10, 130, 220) :
						pref.darkblueTheme ? RGB(24, 50, 82) :
						pref.redTheme ? RGB(140, 25, 25) :
						pref.creamTheme ? RGB(120, 170, 130) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : ''
					);
				}
				// Now playing bg selection with now playing deactivated
				if (!pop.highlight.nowPlaying && item.sel && (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2)) {
					gr.FillSolidRect(ui.x, box_y, ui.w, this.box.h,
						pref.whiteTheme || pref.blackTheme ? col.primary :
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : col.primary :
						pref.blueTheme ? RGB(10, 130, 220) :
						pref.darkblueTheme ? RGB(24, 50, 82) :
						pref.redTheme ? RGB(140, 25, 25) :
						pref.creamTheme ? RGB(120, 170, 130) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : ''
					);
				}
				// Marker selection with now playing active
				if (pop.highlight.nowPlaying && item.sel && pref.libraryDesign !== 'flowMode') {
					gr.DrawRect(ui.x, box_y, ui.w, this.box.h, 1,
						pref.whiteTheme ? RGB(200, 200, 200) :
						pref.blackTheme ? RGB(45, 45, 45) :
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(200, 200, 200) :
						pref.blueTheme ? RGB(10, 135, 230) :
						pref.darkblueTheme ? RGB(27, 55, 90) :
						pref.redTheme ? RGB(145, 25, 25) :
						pref.creamTheme ? RGB(200, 200, 200) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(40, 40, 40) : ''
					);
					gr.FillSolidRect(ui.x, box_y, ui.sz.sideMarker, this.box.h + 1,
						pref.whiteTheme || pref.blackTheme ? col.primary :
						pref.blueTheme ? RGB(242, 230, 170) :
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
						pref.darkblueTheme ? RGB(255, 202, 128) :
						pref.redTheme ? RGB(245, 212, 165) :
						pref.creamTheme ? RGB(120, 170, 130) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : ''
					);
				}
				// Hide DrawRect gaps when all songs are completely selected and mask lines when selecting now playing
				if (pop.highlight.nowPlaying && item.sel && !item.root && pop.inRange(pop.nowp, item.item) && (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2)) {
					gr.DrawRect(pop.fullLineSelection ? ui.x : ui.x, box_y, pop.fullLineSelection ? ui.w : ui.w + ui.sz.margin + box_x - ui.x - ui.sz.sideMarker, this.box.h, 1,
						pref.whiteTheme || pref.blackTheme ? col.primary :
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : col.primary :
						pref.blueTheme ? RGB(10, 130, 220) :
						pref.darkblueTheme ? RGB(24, 50, 82) :
						pref.redTheme ? RGB(140, 25, 25) :
						pref.creamTheme ? RGB(120, 170, 130) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : ''
					);
				}

				this.im.y = this.labels.overlay ? this.im.offset + box_y + ppt.thumbNailGapCompact / 2 : this.im.offset + box_y;
				if (pop.rowStripes && this.labels.right) {
					if (i % 2 == 0) gr.FillSolidRect(0, box_y + 1, panel.tree.stripe.w, this.row.h, ui.col.bg1);
					else gr.FillSolidRect(0, box_y, panel.tree.stripe.w, this.row.h, ui.col.bg2);
				}
				let x1 = 0;
				let x2 = Math.round(box_x + (this.bor.cov) / 2);
				let y1 = 0;
				let y2 = this.im.y + 2 + this.im.w - this.overlayHeight;
				if (cur_img) {
					iw = cur_img.Width;
					ih = cur_img.Height;
					x1 = box_x + Math.round((this.box.w - iw) / 2);
					y1 = this.im.y + 1 + this.im.w - ih;
					let w = iw;
					let h = ih;
					if (item.sel && this.labels.overlay && this.style.image == 2) {
						x1 += 2;
						y1 += 2;
						w -= 4;
						h -= 4;
					}
					gr.DrawImage(cur_img, x1, y1, w, h, 0, 0, iw, ih);
					if (!item.sel || !this.labels.overlay || this.style.image != 2) {
						if (this.style.image != 2) gr.DrawRect(x1, y1, iw - 1, ih - 1, 1, ui.col.imgBor);
						else gr.DrawEllipse(x1, y1, iw - 1, ih - 1, 1, ui.col.imgBor);
					}
					if (this.labels.overlayDark) {
						if (item.sel || nowp) gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, RGBA(150, 150, 150, 150));
						gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, this.getSelBgCol(item, nowp));
					}
				} else {
					iw = this.im.w;
					ih = this.im.w;
					x1 = box_x + Math.round((this.box.w - iw) / 2);
					y1 = this.im.y + 2 + iw - ih;
					if (item.sel && this.labels.overlay && this.style.image == 2) {
						x1 += 2;
						y1 += 2;
						iw -= 4;
						ih -= 4;
					}
					if (!item.root) this.stub.noImg && gr.DrawImage(this.stub.noImg, x1, y1, iw, ih, 0, 0, iw, ih);
					else if (!this.style.rootComposite && this.stub.root) gr.DrawImage(this.stub.root, x1, y1, iw, ih, 0, 0, iw, ih);

					if (this.labels.overlay) {
						gr.FillGradRect(x1, y2 - 1, iw / 2, ui.l.w, 1, RGBA(0, 0, 0, 0), ui.col.imgBor);
						gr.FillGradRect(x1 + iw / 2, y2 - 1, iw / 2, ui.l.w, 1, ui.col.imgBor, RGBA(0, 0, 0, 0));
					}
					if (this.labels.overlayDark) {
						if (item.sel || nowp) gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, RGBA(150, 150, 150, 150));
						gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, this.getSelBgCol(item, nowp));
					}
				}
				this.drawItemOverlay(gr, item, x1, y1, iw, ih);
				if (i == pop.m.i) {
					if (pop.highlight.row == 3 || pop.highlight.row == 2 && (this.labels.overlay || this.labels.hide)) {
						this.drawFrame(gr, box_x, box_y,
							pref.whiteTheme || pref.blackTheme ? col.primary :
							pref.blueTheme ? RGB(242, 230, 170) :
							pref.darkblueTheme ? RGB(255, 202, 128) :
							pref.redTheme ? RGB(245, 212, 165) :
							pref.creamTheme ? RGB(120, 170, 130) :
							pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '',
							!this.labels.overlay && !this.labels.hide ? 'stnd' : 'thick'
						);
					} // else if (pop.highlight.row == 1 && !sbar.draw_timer) gr.FillSolidRect(ui.l.w, y1, ui.sz.sideMarker, this.im.w, ui.col.sideMarker);
				}
				if ((this.labels.overlay || this.labels.hide) && item.sel)
				this.drawFrame(gr, box_x, box_y, /*ui.col.imgBgSel*/
					pref.whiteTheme || pref.blackTheme ? col.primary :
					pref.blueTheme ? RGB(242, 230, 170) :
					pref.darkblueTheme ? RGB(255, 202, 128) :
					pref.redTheme ? RGB(245, 212, 165) :
					pref.creamTheme ? RGB(120, 170, 130) :
					pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '', 'thick'
				);
				if (!this.labels.hide) {
					const x = box_x + this.text.x;
					let type = 0;
					let bgColor = item.sel || pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? col.primary : undefined;

					var txt_c =
					pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? ui.col.nowpBgSel :
					item.sel ? pop.highlight.nowPlaying ? ui.col.textSel : ui.col.textSel :
					pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					pop.highlight.nowPlaying ? ui.col.text : ui.col.text;

					var txt_c_nobw =
					pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ?
						pref.blueTheme ? RGB(242, 230, 170) :
						pref.darkblueTheme ? RGB(255, 202, 128) :
						pref.redTheme ? RGB(245, 212, 165) :
						pref.creamTheme ? RGB(0, 0, 0) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '' :
					item.sel ? pop.highlight.nowPlaying ? ui.col.textSel : ui.col.textSel :
					pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					pop.highlight.nowPlaying ? ui.col.text : ui.col.text;

					if (pref.whiteTheme && (new Color(bgColor).brightness > 130)) {
						txt_c =
						pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? RGB(0, 0, 0) :
						item.sel ? pop.highlight.nowPlaying ? RGB(0, 0, 0) : RGB(0, 0, 0) :
						pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
						pop.highlight.nowPlaying ? ui.col.text : ui.col.text;
					}
					else if (pref.whiteTheme && (new Color(bgColor).brightness < 131)) {
						txt_c =
						pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? RGB(255, 255, 255) :
						item.sel ? pop.highlight.nowPlaying ? pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2 ? RGB(0, 0, 0) : RGB(255, 255, 255) : RGB(255, 255, 255) :
						pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
						pop.highlight.nowPlaying ? ui.col.text : ui.col.text;
					}
					if (pref.blackTheme && (new Color(bgColor).brightness < 131)) {
						txt_c =
						pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? RGB(255, 255, 255) :
						item.sel ? pop.highlight.nowPlaying ? RGB(255, 255, 255) : RGB(255, 255, 255) :
						pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
						pop.highlight.nowPlaying ? ui.col.text : ui.col.text;
					}
					else if (pref.blackTheme && (new Color(bgColor).brightness > 130)) {
						txt_c =
						pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? RGB(0, 0, 0) :
						item.sel ? pop.highlight.nowPlaying ? pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2 ? RGB(255, 255, 255 ) : RGB(0, 0, 0) : RGB(0, 0, 0) :
						pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
						pop.highlight.nowPlaying ? ui.col.text : ui.col.text;
					}
					if (g_pl_colors.background != RGB(255, 255, 255)) {
						if (pref.rebornTheme && (new Color(bgColor).brightness < 131)) {
							txt_c =
							pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? RGB(255, 255, 255) :
							item.sel ? pop.highlight.nowPlaying ? RGB(255, 255, 255) : RGB(255, 255, 255) :
							pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
							pop.highlight.nowPlaying ? ui.col.text : ui.col.text;
						}
						else if (pref.rebornTheme && (new Color(bgColor).brightness > 130)) {
							txt_c =
							pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) ? RGB(0, 0, 0) :
							item.sel ? pop.highlight.nowPlaying ? pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2 ? RGB(255, 255, 255 ) : RGB(0, 0, 0) : RGB(0, 0, 0) :
							pop.m.i == i ? pop.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
							pop.highlight.nowPlaying ? ui.col.text : ui.col.text;
						}
					}

					if (panel.colMarker) type = item.sel ? 2 : pop.highlight.text && i == pop.m.i ? 1 : 0;
					if (!this.labels.overlay) {
						y1 = this.im.y + this.text.y1;
						y2 = this.im.y + this.text.y2
						if (panel.lines == 2) {
							this.checkTooltip(gr, item, x, y1, y2, this.text.w, grp, lot, ui.font.group, ui.font.group /*ui.font.lot*/);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, pref.whiteTheme || pref.blackTheme || pref.rebornTheme ? txt_c : txt_c_nobw /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.groupEllipsisSpace, 'group');
							!panel.colMarker ? gr.GdiDrawText(lot, ui.font.group /*ui.font.lot*/, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? panel.cc : panel.lc) : pop.cusCol(gr, lot, item, x, y2, this.text.w, this.text.h, type, nowp, ui.font.group /*ui.font.lot*/, ui.font.lotEllipsisSpace, 'lott');
						} else {
							this.checkTooltip(gr, item, x, y1, -1, this.text.w, grp, false, ui.font.main, ui.font.main);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.main, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.main, ui.font.mainEllipsisSpace, 'group');
							this.checkTooltip(gr, item, x, y1, -1, this.text.w, grp, false, ui.font.main, ui.font.main);
						}
					} else {
						y1 = this.im.y + this.text.y1;
						y2 = y1 + this.text.h * 0.9;
						if (panel.lines == 2) {
							this.checkTooltip(gr, item, x, y1, y2, this.text.w, grp, lot, ui.font.group, ui.font.group /*ui.font.lot*/);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, pref.whiteTheme || pref.blackTheme || pref.rebornTheme ? txt_c : txt_c_nobw /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.groupEllipsisSpace, 'lott');
							!panel.colMarker ? gr.GdiDrawText(lot, ui.font.group /*ui.font.lot*/, pref.whiteTheme || pref.blackTheme || pref.rebornTheme ? txt_c : txt_c_nobw /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !item.tt[2] ? panel.cc : panel.lc) : pop.cusCol(gr, lot, item, x, y2, this.text.w, this.text.h, type, nowp, ui.font.group /*ui.font.lot*/, ui.font.lotEllipsisSpace, 'group');
						} else {
							this.checkTooltip(gr, item, x, y1 + (this.overlayHeight - this.text.h) / 2, -1, this.text.w, grp, false, ui.font.group, ui.font.group /*ui.font.lot*/);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, pref.whiteTheme || pref.blackTheme || pref.rebornTheme ? txt_c : txt_c_nobw /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.groupEllipsisSpace, 'group');
						}
					}
				}
			}
			if (this.column == this.columns - 1) this.column = 0;
			else this.column++;
		}
		ui.drawTopBarUnderlay(gr);
	}

	drawFrame(gr, box_x, box_y, col, weight) {
		let x, y, w, h, l_w;
		switch (weight) {
			case 'stnd':
				x = !this.labels.right ? box_x + 1 : ui.sz.pad + 1;
				y = box_y + (!this.labels.right ? 1 : 1);
				w = !this.labels.right ? this.box.w - 2 : panel.tree.sel.w;
				h = this.box.h - (!this.labels.right ? 2 : 0);
				l_w = 2;
				break;
			case 'thick':
				x = box_x + Math.round((this.box.w - this.im.w) / 2) + 1;
				y = this.im.y + 2;
				w = this.im.w;
				h = this.im.w - 2;
				l_w = 4;
				break;
		}
		gr.DrawRect(x, y, w, h, l_w, col);
	}

	drawItemOverlay(gr, item, x, y, w) {
		if (item.root) return;
		switch (ppt.itemOverlayType) {
			case 1: {
				if (!item.count) break;
				let count_w = Math.max(gr.CalcTextWidth(item.count + ' ', ui.font.tracks), 8);
				let count_h = Math.max(gr.CalcTextHeight(item.count, ui.font.tracks), 8);
				let count_x = x + (this.style.image != 2 ? w - count_w - 3 : (w - count_w - 2) / 2);
				const count_y = y + (this.style.image != 2 ? 0 : count_h / 1.67);
				let count = item.count;
				let count_h2 = count_h;
				if (count_w > this.im.w) {
					count = item.count.split(' ');
					count_h2 = count_h * 2;
					count_w = Math.max(gr.CalcTextWidth(count[0], ui.font.tracks), gr.CalcTextWidth(count[1], ui.font.tracks));
					count_x = x + (this.style.image != 2 ? w - count_w - 3 : (w - count_w - 2) / 2);
					gr.SetSmoothingMode(2);
					gr.FillSolidRect(count_x, count_y, count_w + 2, count_h2, RGBA(0, 0, 0, 115));
					gr.GdiDrawText(count[0], ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y, count_w, count_h, this.style.image != 2 ? panel.rc : panel.cc);
					gr.GdiDrawText(count[1], ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y + count_h, count_w, count_h, this.style.image != 2 ? panel.rc : panel.cc);
					gr.SetSmoothingMode(0);
				} else {
					if (pref.showTrackCount) {
						gr.SetSmoothingMode(2);
						gr.FillSolidRect(count_x, count_y, count_w + 2, count_h2, RGBA(0, 0, 0, 115));
						gr.GdiDrawText(count, ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y, count_w, count_h, panel.cc);
						gr.SetSmoothingMode(0);
					}
				}
				break;
			}
			case 2: {
				if (!item.year) break;
				let year_w = Math.max(gr.CalcTextWidth(item.year + ' ', ui.font.tracks), 8);
				let year_h = Math.max(gr.CalcTextHeight(item.year, ui.font.tracks), 8);
				let year_x = x + (this.style.image != 2 ? 0 : (w - year_w - 2) / 2);
				const year_y = y + (this.style.image != 2 ? 0 : year_h / 1.67);
				gr.SetSmoothingMode(2);
				gr.FillSolidRect(year_x, year_y, year_w + 2, year_h, RGBA(0, 0, 0, 115));
				gr.GdiDrawText(item.year, ui.font.tracks, RGB(255, 255, 255), year_x + 1, year_y, year_w, year_h, panel.cc);
				gr.SetSmoothingMode(0);
				break;
			}
		}
	}

	drawSelBg(gr, cur_img, box_x, box_y, i, nowpOrSel) {
		let x, y, w, h;
		switch (true) {
			case nowpOrSel:
				// col = ui.col.imgBgSel;
				switch (this.labels.overlay) {
					case true:
						x = box_x + Math.round((this.box.w - (cur_img ? cur_img.Width + 1 : this.im.w + 2)) / 2);
						y = box_y + (cur_img ? ppt.thumbNailGapCompact / 2 + this.im.w - cur_img.Height + 1 : ppt.thumbNailGapCompact / 2 + 2)
						w = cur_img ? cur_img.Width - 2 : this.im.w;
						h = cur_img ? cur_img.Height : this.im.w;
						break;
					case false:
						x = !this.labels.right ? box_x : ui.x;
						y = box_y + (!this.labels.right ? 1 : 1);
						w = !this.labels.right ? this.box.w - 2 : panel.tree.sel.w;
						h = this.box.h - 1;
						break
				}
				break;
			case pop.highlight.row == 2 && i == pop.m.i && !this.labels.overlay:
				// col = ui.col.bg_h;
				x = !this.labels.right ? box_x : ui.x;
				y = box_y + (this.labels.bottom ? (!this.labels.right ? 1 : 2) : 2);
				w = !this.labels.right ? this.box.w - 2 : panel.tree.sel.w;
				h = this.box.h + (this.labels.bottom ? (!this.labels.right ? 0 : -3) : -3);
				break;
		}
		x = this.labels.overlay ? box_x + Math.round((this.box.w - (cur_img ? cur_img.Width + 1 : this.im.w + 2)) / 2) : !this.labels.right ? box_x : ui.x;
		y = this.labels.overlay ? box_y + (cur_img ? ppt.thumbNailGapCompact / 2 + this.im.w - cur_img.Height + 1 : ppt.thumbNailGapCompact / 2 + 2) : box_y + (!this.labels.right ? 1 : 1);

		gr.FillSolidRect(x, pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2 ? y - 1 : y, w + 2, pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2 ? h + 2 : h,
			pref.whiteTheme || pref.blackTheme ? pop.highlight.row == 2 && i == pop.m.i ? RGB(160, 160, 160) : col.primary :
			pref.rebornTheme ? pop.highlight.row == 2 && i == pop.m.i ? RGB(160, 160, 160) : g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : col.primary :
			pref.blueTheme ? RGB(10, 130, 220) :
			pref.darkblueTheme ? RGB(24, 50, 82) :
			pref.redTheme ? RGB(140, 25, 25) :
			pref.creamTheme ? RGB(120, 170, 130) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : ''
		);
		if ((!pref.whiteTheme || !pref.blackTheme) && !ppt.albumArtShow || (!pref.whiteTheme || !pref.blackTheme) && ppt.albumArtShow && (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos' || ppt.albumArtLabelType == 2)) {
			gr.FillSolidRect(x, y, ui.sz.sideMarker, h,
				pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
				pref.blueTheme ? RGB(242, 230, 170) :
				pref.darkblueTheme ? RGB(255, 202, 128) :
				pref.redTheme ? RGB(245, 212, 165) :
				pref.creamTheme ? RGB(120, 170, 130) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : ''
			);
		}
	}

	fadeMask(image, w, h) {
		const mask = $Lib.gr(w, h, true, g => g.DrawImage(this.mask.fade, 0, h - this.overlayHeight, w, this.overlayHeight, 0, 0, this.mask.fade.Width, this.mask.fade.Height));
		image.ApplyMask(mask);
	}

	format(image, n, type, w, h, fade, caller, i, key) {
		let ix = 0;
		let iy = 0;
		let iw = image.Width;
		let ih = image.Height;
		switch (type) {
			case 'crop':
			case 'circular': {
				const s1 = iw / w;
				const s2 = ih / h;
				const r = s1 / s2;
				if (this.needTrim(n, r)) {
					if (s1 > s2) {
						iw = Math.round(w * s2);
						ix = Math.round((image.Width - iw) / 2);
					} else {
						ih = Math.round(h * s1);
						iy = Math.round((image.Height - ih) / 8);
					}
					image = image.Clone(ix, iy, iw, ih);
				}
				image = image.Resize(w, h, 7);
				if (type == 'circular') this.circularMask(image, image.Width, image.Height);
				break;
			}

			default: {
				const sc = caller != 'save' ? Math.min(h / ih, w / iw) : Math.max(h / ih, w / iw);
				const im_w = Math.round(iw * sc);
				const im_h = Math.round(ih * sc);
				image = image.Resize(im_w, im_h, 7);
				break;
			}
		}
		if (fade) this.fadeMask(image, image.Width, image.Height);
		if (caller.startsWith('display')) this.cache[key] = {
			img: image,
			accessed: caller == 'display' ? ++this.accessed : 0
		}
		else return image;
	}

	getDefaultGroupField(n) {
		switch (n) {
			case 0:
				return panel.lines == 2 ? 'Album' : 'Artist';
			case 1:
				return panel.lines == 2 ? 'Album' : 'Album Artist';
			case 2:
				return panel.lines == 2 ? 'Track' : 'Album';
			case 3:
				return panel.lines == 2 ? 'Track' : 'Album';
			case 4:
				return panel.lines == 2 ? 'Album' : 'Genre';
			case 5:
				return panel.lines == 2 ? 'Album' : 'Year';
			case 6:
				return 'Item';
		}
	}

	getField(handle, name, arr) {
		let f = handle.GetFileInfo();
		if (f) {
			for (let i = 0; i < f.MetaCount; ++i) {
				let fullName = '';
				for (let j = 0; j < f.MetaValueCount(i); ++j) {
					fullName += f.MetaValue(i, j) + (j < f.MetaValueCount(i) - 1 ? ', ' : '');
					if (f.MetaValue(i, j) == name || fullName == name) arr.push(f.MetaName(i).toLowerCase());
				}
			}
		}
	}

	getGrpCol(item, nowp, hover) {
		return nowp ? ui.col.nowp : hover ? ui.col.text_h : item.sel ? !this.labels.overlayDark ? ui.col.textSel : ui.col.text : !this.labels.overlayDark ? ui.col.text : RGB(240, 240, 240);
	}

	getImages() {
		const extraRows = this.albumArtDiskCache ? panel.rows * 2 : panel.rows; // will load any extra including those after any preLoad

		if (!panel.imgView) return;
		this.items = [];
		let begin = this.start == 0 ? ppt.rootNode ? 1 : 0 : this.start;
		let end = this.end != 0 ? Math.min(this.end + this.columns * extraRows, pop.tree.length) : this.end;
		for (let i = begin; i < end; i++) {
			if (!pop.tree[i]) continue;
			let key = pop.tree[i].key;
			if (key && !this.cache[key]) this.items.push({
				ix: i,
				handle: pop.tree[i].handle,
				key: key
			});
		}

		begin = Math.max(ppt.rootNode ? 1 : 0, begin - this.columns * extraRows);

		let i = end;
		while (i--) {
			if (i < begin) break;
			if (!pop.tree[i]) continue;
			let key = pop.tree[i].key;
			if (key && !this.cache[key]) this.items.push({
				ix: i,
				handle: pop.tree[i].handle,
				key: key
			});
		}
		if (!this.items.length) return;

		let interval = !sbar.bar.isDragging && !sbar.touch.dn ? 5 : 50;
		let allCached = false;
		if (this.albumArtDiskCache) allCached = this.items.every(v => v.key && this.database[v.key]);
		if (allCached) interval = this.interval.cache;

		clearInterval(this.timer.load);
		this.timer.load = null;
		let j = 0;
		this.timer.load = setInterval(() => {
			if (j < this.items.length) {
				const v = this.items[j];
				const key = v.key;
				if (!this.cache[key]) {
					if (this.albumArtDiskCache && $Lib.file(this.cacheFolder + this.database[key])) {
						this.cache[key] = {
							img: 'called',
							accessed: ++this.accessed
						}
						this.load_image_async(key, this.cacheFolder + this.database[key], v.ix)
					} else {
						this.cache[key] = {
							img: 'called',
							accessed: ++this.accessed
						}
						if (v.handle) this.get_album_art_async(v.handle, ppt.artId, key, v.ix);
					}
				}
				j++;
			} else {
				clearInterval(this.timer.load);
				this.timer.load = null;
			}
		}, interval);
	}

	getImg(key) {
		const o = this.cache[key];
		if (!o || o.img == 'called') return undefined;
		o.accessed = ++this.accessed;
		return o.img;
	}

	getItemsToDraw(preLoad) {
		switch (true) {
			case this.style.vertical:
				if (pop.tree.length <= panel.rows * this.columns) {
					this.start = 0;
					this.end = pop.tree.length;
				} else {
					this.start = Math.round(sbar.delta / this.row.h) * this.columns;
					this.start = $Lib.clamp(this.start, 0, this.start - this.columns);
					this.end = Math.ceil((sbar.delta + this.panel.h) / this.row.h) * this.columns;
					this.end = Math.min(this.end, pop.tree.length);
				}
				break;
			case !this.style.vertical:
				if (pop.tree.length <= panel.rows) {
					this.start = 0;
					this.end = pop.tree.length;
				} else {
					this.start = Math.round(sbar.delta / this.blockWidth);
					this.end = Math.min(this.start + panel.rows + 2, pop.tree.length);
					this.start = $Lib.clamp(this.start, 0, this.start - 1)
				}
				break;
		}
		this.albumArtDiskCache ? (preLoad ? this.preLoad() : this.getImages()) : this.loadThrottle();
	}

	getLotCol(item, nowp, hover) {
		return nowp ? ui.col.nowp : hover ? ui.col.text_h : item.sel ? !this.labels.overlayDark ? ui.col.selBlend : ui.col.lotBlend : !this.labels.overlayDark ? ui.col.lotBlend : RGB(220, 220, 220);
	}

	getMostFrequentField(arr) {
		const counts = arr.reduce((a, c) => {
			a[c] = (a[c] || 0) + 1;
			return a;
		}, {});
		const maxCount = Math.max(...Object.values(counts));
		const mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
		return mostFrequent[0];
	}

	getRootImg(key) {
		const o = this.cache[key];
		if (!o || o.img == 'called') return undefined;
		o.accessed = ++this.accessed;
		return o.img;
	}

	getSelBgCol(item, nowp) {
		return nowp || item.sel ? this.albumArtShowLabels ? ui.col.imgBgSel : ui.col.imgOverlaySel : RGBA(0, 0, 0, 175);
	}

	getStyle() {
		switch (ppt.artId) {
			case 0:
				return ppt.imgStyleFront;
			case 1:
				return ppt.imgStyleBack;
			case 2:
				return ppt.imgStyleDisc;
			case 3:
				return ppt.imgStyleIcon;
			case 4:
				return ppt.imgStyleArtist;
		}
	}

	load() {
		const defaultView = !panel.folderView ? panel.defaultViews.indexOf(panel.grp[ppt.viewBy].type.trim()) : 6;
		const fields = [];
		const mod = pop.tree.length < 1000 ? 1 : pop.tree.length < 3500 ? Math.round(pop.tree.length / 1000) : 3;
		const tf_d = FbTitleFormat('[$year(%date%)]');
		const getItemCount = ppt.itemOverlayType != 1 && (ppt.albumArtLabelType == 2 && panel.lines == 1) && (pop.nodeCounts == 1 || pop.nodeCounts == 2);
		let groupField = defaultView != -1 ? this.getDefaultGroupField(defaultView) : '';
		pop.tree.forEach((v, i) => {
			const handle = panel.list[v.item[0].start];
			v.handle = handle;
			const arr = pop.tree[i].name.split('^@^');
			v.grp = panel.lines == 1 || !ppt.albumArtFlipLabels ? arr[0] : arr[1];
			v.lot = panel.lines == 2 ? !ppt.albumArtFlipLabels ? arr[1] : arr[0] : '';
			v.key = md5.hashStr(handle.Path + handle.SubSong + (panel.lines == 1 ? (arr[0] || 'Unknown') : ((arr[0] || 'Unknown') + ' - ' + (arr[1] || 'Unknown'))) + ppt.artId);
			if (ppt.itemOverlayType == 2) v.year = tf_d.EvalWithMetadb(handle).replace('0000', '');
			if (defaultView == -1 && i % mod === 0) this.getField(handle, panel.lines == 1 || ppt.albumArtFlipLabels ? v.grp : v.lot, fields);
			if (getItemCount) v.grp += v.count;
		});
		if (defaultView == -1) {
			groupField = this.getMostFrequentField(fields) || 'Item';
		}
		groupField = $Lib.titlecase(groupField);

		if (ppt.rootNode) {
			if (!groupField) groupField = 'Item';
			const pluralField = pluralize(groupField).replace(/(album|artist|top)s\s/gi, '$1 ').replace(/(similar artist)\s/gi, '$1s ');
			pop.tree[0].key = pop.tree[0].name;
			const ln1 = pop.tree.length - 1;
			const ln2 = panel.list.Count;
			const nm = 'All (' + ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${groupField}`) + ')';
			if (ppt.rootNode == 3) pop.tree[0].grp = nm;
			else if (panel.lines == 1) pop.tree[0].grp = panel.rootName + (ppt.nodeCounts ? ' (' + (ppt.nodeCounts == 2 && ppt.rootNode != 3 ? ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${groupField}`) : ln2 + (ln2 > 1 ? ' Tracks' : ' Track')) + ')' : '');
			if (panel.lines == 2) {
				if (ppt.rootNode != 3) pop.tree[0].grp = panel.rootName;
				pop.tree[0].lot = ppt.nodeCounts == 2 && ppt.rootNode != 3 ? ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${groupField}`) : ln2 + (ln2 > 1 ? ' Tracks' : ' Track');
			}
		}
		this.metrics();
		panel.treePaint();
	}

	memoryLimit() {
		if (!window.JsMemoryStats) return;
		const limit = !ppt.memoryLimit ? window.JsMemoryStats.TotalMemoryLimit * 0.5 : Math.min(ppt.memoryLimit * 1048576, window.JsMemoryStats.TotalMemoryLimit * 0.8);
		return window.JsMemoryStats.TotalMemoryUsage > limit;
	}

	metrics() {
		if (!ui.w || !ui.h) return;
		$Lib.gr(1, 1, false, g => {
			const lineSpacing = this.labels.hide || this.labels.overlay ? Math.max(ppt.verticalAlbumArtPad - 2, 0) : ppt.verticalAlbumArtPad;
			this.letter.w = Math.round(g.CalcTextWidth('W', ui.font.main))
			this.text.h = Math.max(Math.round(g.CalcTextHeight('String', ui.font.group)) + lineSpacing, Math.round(g.CalcTextHeight('String', ui.font.lot)) + lineSpacing, 10);
		});
		this.style = {
			image: this.getStyle(),
			rootComposite: ppt.rootNode && ppt.curRootImg == 3,
			vertical: !ppt.albumArtFlowMode ? true : ui.h - panel.search.h > ui.w - ui.sbar.w
		}
		this.letter.show = ppt.albumArtLetter;

		switch (this.style.vertical) {
			case true: {
				this.labels = {
					hide: !ppt.albumArtLabelType,
					bottom: ppt.albumArtLabelType == 1 || ppt.albumArtFlowMode && ppt.albumArtLabelType == 2,
					right: !ppt.albumArtFlowMode ? ppt.albumArtLabelType == 2 : false,
					overlay: ppt.albumArtLabelType == 3 || ppt.albumArtLabelType == 4,
					overlayDark: ppt.albumArtLabelType == 4,
					flip: ppt.albumArtFlipLabels
				}
				this.bor.pad = ppt.thumbNailGapStnd == 0 ? Math.round(this.text.h * (!this.labels.right ? 1.05 : 0.75)) : ppt.thumbNailGapStnd - Math.round(2 * $Lib.scale);
				this.im.offset = Math.round(!this.labels.hide && !this.labels.overlay ? this.bor.pad / 2 : 0);

				if (this.labels.hide || this.labels.overlay) {
					this.panel.y = panel.search.h + Math.round(this.bor.pad / 2);
					this.bor.bot = 0;
					this.bor.side = 0;
					this.bor.cov = ppt.thumbNailGapCompact;
				} else {
					this.panel.y = panel.search.h;
					this.bor.cov = Math.round(this.bor.pad / 2);
					this.bor.side = Math.round(2 * $Lib.scale);
					this.bor.bot = this.bor.side * 2;
				}

				const margin = this.letter.show && ppt.sbarShow ? Math.max(ppt.margin, this.letter.w + ui.l.w * 2) : ppt.margin;
				this.panel.x = (ppt.sbarShow != 2 ? Math.max(margin, ui.sbar.w) : margin) + ui.l.w - scaleForDisplay(3);
				this.panel.w = ui.w - ui.l.w * 2 - (ui.sbar.type == 0 || ppt.sbarShow != 2 ? Math.max(margin, ui.sbar.w) * 2 + scaleForDisplay(20) : (margin * 2 + ui.sbar.w) + scaleForDisplay(20));
				this.panel.h = ui.h - this.panel.y;

				this.blockWidth = Math.round(ui.row.h * 4 * $Lib.scale * ppt.zoomImg / 100 * [0.66, 1, 1.75, 2.5][ppt.thumbNailSize]);
				this.columns = ppt.albumArtFlowMode || this.labels.right ? 1 : Math.max(Math.floor(this.panel.w / this.blockWidth), 1);
				let gap = this.panel.w - this.columns * this.blockWidth;
				gap = Math.floor(gap / this.columns);
				this.columnWidth = !this.labels.right ? $Lib.clamp(this.blockWidth + gap, 10, Math.min(this.panel.w, this.panel.h)) : $Lib.clamp(this.blockWidth, 10, Math.min(this.panel.w, this.panel.h));
				this.overlayHeight = !this.labels.overlay ? 0 : (panel.lines != 2 ? this.text.h * 1.2 : Math.round(this.text.h * 2.1));
				this.im.w = Math.round(Math.max(this.columnWidth - this.bor.side * 2 - this.bor.cov * 2 - (this.labels.hide || this.labels.overlay ? 1 : 0), 10));

				if (this.labels.hide || this.labels.overlay) {
					this.im.w = Math.round(Math.max(this.columnWidth - this.bor.cov, 10));
					this.row.h = this.im.w + this.bor.cov;
				} else {
					this.im.w = Math.round(Math.max(this.columnWidth - this.bor.cov * 2 - this.bor.side * 2, 10))
					this.row.h = !this.labels.right ? this.im.w + this.text.h * panel.lines + this.bor.cov * 2 + this.bor.side * 2 : this.im.w + this.bor.pad + 2;
				}
				if (this.row.h > this.panel.h) {
					this.im.w -= this.row.h - this.panel.h;
					this.im.w = Math.max(this.im.w, 10);
					this.row.h = this.panel.h;
				}
				this.box.w = this.columnWidth - this.bor.side * 2;
				this.box.h = this.row.h - (!this.labels.right ? this.bor.side * 2 : 0)
				panel.rows = Math.max(Math.floor(this.panel.h / this.row.h));
				sbar.metrics(sbar.x, sbar.y, sbar.w, sbar.h, panel.rows, this.row.h, this.style.vertical);
				sbar.setRows(Math.ceil(pop.tree.length / this.columns));
				break;
			}
			case false: // only H-Flow
				this.labels = {
					hide: !ppt.albumArtLabelType,
					bottom: ppt.albumArtLabelType == 1 || ppt.albumArtLabelType == 2,
					right: false,
					overlay: ppt.albumArtLabelType == 3 || ppt.albumArtLabelType == 4,
					overlayDark: ppt.albumArtLabelType == 4,
					flip: ppt.albumArtFlipLabels
				}
				this.bor.pad = ppt.thumbNailGapStnd == 0 ? Math.round(this.text.h * 1.05) : ppt.thumbNailGapStnd - Math.round(2 * $Lib.scale);
				this.im.offset = Math.round(!this.labels.hide && !this.labels.overlay ? this.bor.pad / 2 : 0);
				if (this.labels.hide || this.labels.overlay) {
					this.bor.bot = 0;
					this.bor.side = 0;
					this.bor.cov = ppt.thumbNailGapCompact;
				} else {
					this.bor.cov = Math.round(this.bor.pad / 2);
					this.bor.side = Math.round(2 * $Lib.scale);
					this.bor.bot = this.bor.side * 2;
				}
				this.panel.x = 0;
				this.panel.y = panel.search.h + Math.round(this.bor.pad / 2) - scaleForDisplay(11);
				this.panel.h = ui.h - this.panel.y - ui.l.w * 3 - (this.letter.show ? this.text.h : 0) - ui.sbar.w - scaleForDisplay(21);
				this.panel.w = ui.w;
				if (!this.labels.hide && !this.labels.overlay) {
					this.row.h = this.panel.h * $Lib.scale * ppt.zoomImg / 100 * [0.66, 1, 1.75, 2.5][ppt.thumbNailSize];
					const extra = this.text.h * panel.lines + this.bor.cov * 2 + this.bor.side * 2;
					this.im.w = Math.min(this.panel.h * $Lib.scale * ppt.zoomImg / 100 * [0.66, 1, 1.75, 2.5][ppt.thumbNailSize] - extra, this.panel.h - extra);
					this.im.w = $Lib.clamp(this.im.w, 10, Math.round(this.panel.w - (this.bor.cov * 2 + this.bor.side * 2)));
					this.blockWidth = this.im.w + this.bor.cov * 2 + this.bor.side * 2;
					this.row.h = this.im.w + extra;
				} else {
					const extra = this.bor.cov;
					this.im.w = Math.min(this.panel.h * $Lib.scale * ppt.zoomImg / 100 * [0.66, 1, 1.75, 2.5][ppt.thumbNailSize] - extra, this.panel.h - extra);
					this.im.w = $Lib.clamp(this.im.w, 10, Math.round(this.panel.w - this.bor.cov));
					this.blockWidth = this.im.w + this.bor.cov;
					this.row.h = this.im.w + extra;
				}
				this.columns = Math.max(Math.floor(this.panel.w / this.blockWidth), 1);
				this.overlayHeight = !this.labels.overlay ? 0 : (panel.lines != 2 ? this.text.h * 1.2 : Math.round(this.text.h * 2.1));
				this.box.w = this.blockWidth - this.bor.side * 2;
				this.box.h = this.row.h - this.bor.bot;
				panel.rows = Math.max(Math.floor(this.panel.w / this.blockWidth));
				this.columnWidth = this.blockWidth;

				sbar.metrics(sbar.x, sbar.y, ui.w, ui.sbar.w, panel.rows, this.blockWidth, this.style.vertical);
				sbar.setRows(Math.ceil(pop.tree.length));
				break;
		}

		this.cellWidth = Math.max(200, this.im.w / 2);
		this.style.y = Math.floor(this.panel.y + (!this.labels.hide && !this.labels.overlay ? ppt.thumbNailGapStnd / 2 : ppt.thumbNailGapCompact / 2));

		if (!this.labels.hide) {
			if (!this.labels.overlay) {
				this.text.x = !this.labels.right ? Math.round((this.box.w - this.im.w) / 2) : Math.max(Math.round((this.box.w - this.im.w) / 2), 5 * $Lib.scale) * 2 + this.im.w;
				this.text.y1 = !this.labels.right ? this.im.w + Math.round(this.bor.cov * 0.5) : Math.round((this.im.w - this.text.h * panel.lines) / 2);
				this.text.y2 = !this.labels.right ? Math.round(this.text.y1 + this.text.h * 0.95) : this.text.y1 + this.text.h;
				this.text.w = !this.labels.right ? this.im.w : this.panel.w - this.text.x - 12;
			} else {
				this.text.x = Math.round(10 + (ppt.thumbNailGapCompact - 3) / 2);
				this.text.y1 = Math.round(this.im.w - this.overlayHeight + 2 + (this.overlayHeight - this.text.h * panel.lines) / 2);
				this.text.w = this.box.w - 20 - ppt.thumbNailGapCompact - 6;
				ppt.thumbNailGapCompact = 22;
			}
		}

		this.cachesize.min = panel.rows * this.columns * 3 + (this.albumArtDiskCache ? panel.rows * 2 : panel.rows) * this.columns * 2;
		this.createImages();
		this.createCacheFolder();
		if (ppt.albumArtPreLoad && !this.zooming && this.albumArtDiskCache) this.getItemsToDraw(true);
		this.setNoArtist();
		this.setNoCover();
		this.setRoot();
		if (this.style.rootComposite) this.checkRootImg();
		const stub = ppt.artId != 4 ? this.no_cover_img : this.no_artist_img;
		if (stub) this.stub.noImg = this.format(stub, ppt.artId, ['default', 'default', 'circular'][this.style.image], this.im.w, this.im.w, ppt.albumArtLabelType == 3, 'noImg');
		if (this.root_img) this.stub.root = this.format(this.root_img, ppt.artId, 'default', this.im.w, this.im.w, ppt.albumArtLabelType == 3, 'root');
		panel.treePaint();
	}

	needTrim(n, ratio) {
		return n || Math.abs(ratio - 1) >= 0.05;
	}

	newDatabase() {
		return {
			'-----------group key------------': '-----------image key------------.jpg'
		}
	}

	on_key_down() {
		this.zooming = vk.k('zoom');
		if (this.zooming) {
			clearInterval(this.timer.preLoad);
			this.timer.preLoad = null;
		}
	}

	on_key_up() {
		if (this.zooming && this.zooming != vk.k('zoom')) {
			this.zooming = false;
			if (ppt.albumArtPreLoad && this.albumArtDiskCache && panel.imgView) this.metrics();
			panel.treePaint();
		}
	}

	preLoad() {
		if (!panel.imgView) return;
		this.preLoadItems = [];
		let begin = this.start == 0 ? ppt.rootNode ? 1 : 0 : this.start;
		let end = this.end != 0 ? Math.min(this.end + this.columns, pop.tree.length) : this.end;
		for (let i = begin; i < end; i++) {
			if (!pop.tree[i]) continue;
			const key = pop.tree[i].key;
			if (key && !this.cache[key]) {
				if (this.database[key] != 'noAlbumArt') {
					if ($Lib.file(this.cacheFolder + this.database[key])) this.preLoadItems.push({
						ix: i,
						key: key
					});
				}
			}
		}

		for (let i = 0; i < this.preLoadItems.length; i++) { // for loop covers this.preLoadItems reset
			const v = this.preLoadItems[i];
			const key = v.key;
			if (!this.cache[key]) {
				this.cache[key] = {
					img: 'called',
					accessed: ++this.accessed
				}
				this.load_image_async(key, this.cacheFolder + this.database[key], v.ix, true);
			}
		}

		this.preLoadItems = [];
		const items1 = Array.from(this.range(end, pop.tree.length, 1));
		const items2 = Array.from(this.range(ppt.rootNode ? 1 : 0, begin, 1));
		items2.reverse();

		const addItem = i => {
			if (!pop.tree[i]) return;
			const key = pop.tree[i].key;
			if (!this.cache[key] && key && this.database[key]) {
				if (this.database[key] != 'noAlbumArt') {
					if ($Lib.file(this.cacheFolder + this.database[key])) this.preLoadItems.push({
						ix: i,
						key: key
					});
				}
			}
		}

		const runInterleave = () => {
			let j = 0;
			for (let i = 0; i < items1.length || j < items2.length;) {
				if (i < items1.length) addItem(items1[i++]);
				if (j < items2.length) addItem(items2[j++]);
			}
		}

		const doPreload = () => {
			clearInterval(this.timer.preLoad);
			this.timer.preLoad = null;

			let j = 0;
			if (this.preLoadItems.length) this.timer.preLoad = setInterval(() => {
					if (j < this.preLoadItems.length) {
						const v = this.preLoadItems[j];
						const key = v.key;
						if (!this.cache[key]) {
							this.cache[key] = {
								img: 'called',
								accessed: 0
							}
							this.load_image_async(key, this.cacheFolder + this.database[key], v.ix, true)
						}
						j++;
					} else {
						clearInterval(this.timer.preLoad);
						this.timer.preLoad = null;
					}
				}, this.interval.preLoad);
		}

		const interleave = async () => {
			await runInterleave();
		}

		interleave().then(() => doPreload());
	}

	refresh(items) {
		let itemsToRemove = [];
		if (items === 'all') {
			this.clearCache();
			if (!ppt.albumArtDiskCache) return;
			const continue_confirmation = (status, confirmed) => {
				if (confirmed) {
					const app = new ActiveXObject('Shell.Application');
					app.NameSpace(10).MoveHere(this.cachePath); // remove all saved images & databases if albumArtDiskCache
				}
			}
			popUpBox.confirm('Reset All Images',
				`This action resets the library tree thumbnail disk cache

Continue?`, 'Yes', 'No', continue_confirmation);
			return;
		}

		const allSelected = pop.sel_items.length == fb.GetLibraryItems().Count;
		const base = this.cachePath + ['front', 'back', 'disc', 'icon', 'artist'][ppt.artId];
		const databases = [base + '\\database.dat', base + '500\\database.dat', base + '750\\database.dat'];
		if (allSelected) {
			this.clearCache(); // full clear of working cache
			if (!ppt.albumArtDiskCache) return;
			this.database = this.newDatabase(); // full clear of databases for current image type
			databases.forEach(v => {
				if ($Lib.file(v)) $Lib.save(v, JSON.stringify(this.newDatabase(), null, 3), true);
			});
			return;
		}

		// refresh selected images
		items.Convert().forEach(v => {
			const item = panel.list.Find(v);
			let ind = -1;
			pop.tree.forEach((v, j) => {
				if (!v.root && pop.inRange(item, v.item)) ind = j;
			});
			if (ind != -1) itemsToRemove.push(pop.tree[ind].key);
		});
		itemsToRemove = [...new Set(itemsToRemove)];
		itemsToRemove.forEach(v => this.trimCache(v)); // clear working cache of selected keys: won't check if same images are used with other keys
		if (!ppt.albumArtDiskCache) return;
		let imgsToRemove = itemsToRemove.map(v => this.database[v]);
		imgsToRemove = [...new Set(imgsToRemove)];
		databases.forEach(v => {
			if ($Lib.file(v)) {
				const cur_db = v == this.cacheFolder + 'database.dat';
				const imgDatabase = $Lib.jsonParse(v, this.newDatabase(), 'file');
				Object.entries(imgDatabase).forEach(w => { // clear working cache & database of all keys that reference a particular image: this should always work even if images in use
					if (imgsToRemove.includes(w[1]) || !$Lib.file(this.cacheFolder + w[1])) { // images are refreshed as loaded, overwriting existing
						if (cur_db) this.trimCache(w[0]);
						delete imgDatabase[w[0]];
					}
				});
				Object.entries(imgDatabase).forEach(w => {
					if (!$Lib.file(this.cacheFolder + w[1])) delete imgDatabase[w[0]];
				}); // remove any user deleted images from database
				$Lib.save(v, JSON.stringify(imgDatabase, null, 3), true);
			}
		});
	}

	setNoArtist() {
		this.artist_images = my_utilsLib.getImageAssets('noArtist').sort();
		ppt.curNoArtistImg = $Lib.clamp($Lib.value(ppt.curNoArtistImg, 0, 0), 0, this.artist_images.length - 1);
		const artistImages = this.artist_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: 'file://' + v.replace('noArtist', 'noArtist/small')
		}))
		this.no_artist_img = gdi.Image(this.artist_images[ppt.curNoArtistImg]);
		ppt.noArtistImages = JSON.stringify(artistImages);
	}

	setNoCover() {
		this.cover_images = my_utilsLib.getImageAssets('noCover').sort();
		ppt.curNoCoverImg = $Lib.clamp($Lib.value(ppt.curNoCoverImg, 0, 0), 0, this.cover_images.length - 1);
		const coverImages = this.cover_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: 'file://' + v.replace('noCover', 'noCover/small')
		}));
		this.no_cover_img = gdi.Image(this.cover_images[ppt.curNoCoverImg]);
		ppt.noCoverImages = JSON.stringify(coverImages);
	}

	setRoot() {
		this.root_images = my_utilsLib.getImageAssets('root').sort();
		ppt.curRootImg = $Lib.clamp($Lib.value(ppt.curRootImg, 0, 0), 0, this.root_images.length - 1);
		const rootImages = this.root_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: 'file://' + v.replace('root', 'root/small')
		}));
		if (ppt.rootNode && ppt.curRootImg == 3) {
			this.style.rootComposite = true;
			this.root_img = null;
		} else {
			this.style.rootComposite = false;
			this.root_img = gdi.Image(this.root_images[ppt.curRootImg]);
		}
		ppt.rootImages = JSON.stringify(rootImages);
	}

	setSelection() {
		return panel.imgView && (ppt.albumArtFlowMode && ppt.flowModeFollowSelection || !ppt.albumArtFlowMode && ppt.stndModeFollowSelection) && (!ppt.followPlaylistFocus || ppt.libSource) && panel.m.x == -1;
	}

	sort(data, prop) {
		data.sort((a, b) => a[prop] - b[prop]);
		return data;
	}

	sortCache(o, prop) {
		const sorted = {};
		Object.keys(o).sort((a, b) => o[a][prop] - o[b][prop]).forEach(key => sorted[key] = o[key]);
		return sorted;
	}

	trimCache(key) {
		delete this.cache[key];
	}
}
const img = new Images;

const MD5 = function(){const b=function(l,n){let m=l[0],j=l[1],p=l[2],o=l[3];m+=(j&p|~j&o)+n[0]-680876936|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[1]-389564586|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[2]+606105819|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[3]-1044525330|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[4]-176418897|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[5]+1200080426|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[6]-1473231341|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[7]-45705983|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[8]+1770035416|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[9]-1958414417|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[10]-42063|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[11]-1990404162|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[12]+1804603682|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[13]-40341101|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[14]-1502002290|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[15]+1236535329|0;j=(j<<22|j>>>10)+p|0;m+=(j&o|p&~o)+n[1]-165796510|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[6]-1069501632|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[11]+643717713|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[0]-373897302|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[5]-701558691|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[10]+38016083|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[15]-660478335|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[4]-405537848|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[9]+568446438|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[14]-1019803690|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[3]-187363961|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[8]+1163531501|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[13]-1444681467|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[2]-51403784|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[7]+1735328473|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[12]-1926607734|0;j=(j<<20|j>>>12)+p|0;m+=(j^p^o)+n[5]-378558|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[8]-2022574463|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[11]+1839030562|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[14]-35309556|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[1]-1530992060|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[4]+1272893353|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[7]-155497632|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[10]-1094730640|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[13]+681279174|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[0]-358537222|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[3]-722521979|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[6]+76029189|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[9]-640364487|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[12]-421815835|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[15]+530742520|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[2]-995338651|0;j=(j<<23|j>>>9)+p|0;m+=(p^(j|~o))+n[0]-198630844|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[7]+1126891415|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[14]-1416354905|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[5]-57434055|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[12]+1700485571|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[3]-1894986606|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[10]-1051523|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[1]-2054922799|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[8]+1873313359|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[15]-30611744|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[6]-1560198380|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[13]+1309151649|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[4]-145523070|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[11]-1120210379|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[2]+718787259|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[9]-343485551|0;j=(j<<21|j>>>11)+p|0;l[0]=m+l[0]|0;l[1]=j+l[1]|0;l[2]=p+l[2]|0;l[3]=o+l[3]|0};const e='0123456789abcdef';const d=[];const c=function(k){const q=e;const o=d;let r,p,l;for(let m=0;m<4;m++){p=m*8;r=k[m];for(l=0;l<8;l+=2){o[p+1+l]=q.charAt(r&15);r>>>=4;o[p+0+l]=q.charAt(r&15);r>>>=4}}return o.join('')};const i=function(){this._dataLength=0;this._state=new Int32Array(4);this._buffer=new ArrayBuffer(68);this._bufferLength=0;this._buffer8=new Uint8Array(this._buffer,0,68);this._buffer32=new Uint32Array(this._buffer,0,17);this.start()};const a=new Int32Array([1732584193,-271733879,-1732584194,271733878]);const h=new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);i.prototype.appendStr=function(n){const k=this._buffer8;const j=this._buffer32;let o=this._bufferLength;for(let l=0;l<n.length;l++){let m=n.charCodeAt(l);if(m<128){k[o++]=m}else{if(m<2048){k[o++]=(m>>>6)+192;k[o++]=m&63|128}else{if(m<55296||m>56319){k[o++]=(m>>>12)+224;k[o++]=(m>>>6&63)|128;k[o++]=(m&63)|128}else{m=((m-55296)*1024)+(n.charCodeAt(++l)-56320)+65536;if(m>1114111){throw'Unicode standard supports code points up to U+10FFFF'}k[o++]=(m>>>18)+240;k[o++]=(m>>>12&63)|128;k[o++]=(m>>>6&63)|128;k[o++]=(m&63)|128}}}if(o>=64){this._dataLength+=64;b(this._state,j);o-=64;j[0]=j[16]}}this._bufferLength=o;return this};i.prototype.appendAsciiStr=function(o){const l=this._buffer8;const k=this._buffer32;let p=this._bufferLength;let n=0,m=0;for(;;){n=Math.min(o.length-m,64-p);while(n--){l[p++]=o.charCodeAt(m++)}if(p<64){break}this._dataLength+=64;b(this._state,k);p=0}this._bufferLength=p;return this};i.prototype.start=function(){this._dataLength=0;this._bufferLength=0;this._state.set(a);return this};i.prototype.end=function(){const q=this._bufferLength;this._dataLength+=q;const r=this._buffer8;r[q]=128;r[q+1]=r[q+2]=r[q+3]=0;const k=this._buffer32;const m=(q>>2)+1;k.set(h.subarray(m),m);if(q>55){b(this._state,k);k.set(h)}const j=this._dataLength*8;if(j<=4294967295){k[14]=j}else{const n=j.toString(16).match(/(.*?)(.{0,8})$/);const o=parseInt(n[2],16);const l=parseInt(n[1],16)||0;k[14]=o;k[15]=l}b(this._state,k);return c(this._state)};const f=new i();i.hashStr=function(k){return f.start().appendStr(k).end()};return i} // https://github.com/gorhill/yamd5.js

const md5 = new MD5;