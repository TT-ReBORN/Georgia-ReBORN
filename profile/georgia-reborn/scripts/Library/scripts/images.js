'use strict';

class Images {
	constructor() {
		this.accessed = 0;
		this.asyncBypass = 0;
		this.blockWidth = 150;
		this.cachePath = pref.customLibraryDir ? `${globals.customLibraryDir}library-tree-cache\\` : `${fb.ProfilePath}cache\\library\\library-tree-cache\\`;
		this.cellWidth = 200;
		this.column = 0;
		this.columnWidth = 150;
		this.database = this.newDatabase();
		this.end = 1;
		this.groupField = '';
		this.items = [];
		this.overlayHeight = 0;
		this.panel = {};
		this.preLoadItems = [];
		this.rootNo = 4;
		this.saveSize = 250;
		this.shadow = null;
		this.shadowStub = null;
		this.start = 0;
		this.toSave = [];
		this.zooming = false;

		this.bor = {
			bot: 6,
			cov: 16,
			pad: 10,
			side: 2
		};

		this.box = {
			h: 100,
			w: 100
		};

		this.cache = {};

		this.cachesize = {
			min: 20
		};

		this.stub = {
			noImg: null,
			root: null
		};

		this.style = {
			image: 0,
			rootComposite: ppt.rootNode && ppt.curRootImg == 3,
			vertical: !ppt.albumArtFlowMode ? true : ui.h - panel.search.h > ui.w - ui.sbar.w,
			y: 25
		};

		this.im = {
			offset: 0,
			y: 0,
			w: 120
		};

		this.interval = {
			cache: 1,
			preLoad: 7
		};

		this.labels = { statistics: ppt.itemShowStatistics ? 1 : 0 }

		this.letter = {
			albumArtYearAuto: ppt.albumArtYearAuto,
			no: 1,
			show: ppt.albumArtLetter,
			w: 0
		};

		this.mask = {
			fade: null,
			circular: null
		};

		this.row = {
			h: 80
		};

		this.text = {
			x: 0,
			y1: 0,
			y2: 0,
			h: 20,
			w: 20
		};

		this.timer = {
			load: null,
			preLoad: null,
			save: null
		};

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
			leading: true,
			trailing: true
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

	// Methods

	async get_album_art_async(handle, art_id, key, ix) {
		const result = await utils.GetAlbumArtAsyncV2(0, handle, art_id, false);
		const o = this.cache[key];
		const saveName = `${md5.hashStr(result.path)}.jpg`;
		if (o && o.img == 'called') this.cacheIt(result.image, key, ix, saveName);
	}

	async load_image_async(key, image_path, ix, rawCache) {
		const image = Date.now() - this.asyncBypass > 5000 ? await gdi.LoadImageAsyncV2(0, image_path) : gdi.Image(image_path);
		const o = this.cache[key];
		if (o && o.img == 'called') !rawCache ? this.cacheIt(image, key, ix) : this.cacheItPreLoad(image, key, ix);
	}

	cacheIt(image, key, ix, saveName) {
		try {
			if (!image) {
				if (this.style.rootComposite && ix < this.rootNo) this.rootDebounce();
				if (this.albumArtDiskCache && !this.database[key]) {
					this.toSave.unshift({
						key,
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
							key,
							image: null,
							folder: this.cacheFolder,
							saveName,
							setKeyOnly: true
						});
					}
					if (!this.database[key] || !$Lib.file(this.cacheFolder + saveName)) {
						image = this.format(image, 1, 'default', this.saveSize, this.saveSize, false, 'save');
						this.toSave.unshift({
							key,
							image: image.Clone(0, 0, image.Width, image.Height),
							folder: this.cacheFolder,
							saveName,
							setKeyOnly: false
						});
					}
				}

				this.checkCache();
				this.format(image, ppt.artId, ['default', 'crop', 'circular'][this.style.image], this.im.w, this.im.w, ppt.albumArtLabelType == 3, 'display', ix, key);
				if (this.style.rootComposite && ix < this.rootNo) this.rootDebounce();
			}

			if (!this.timer.save && this.toSave.length) {
				this.timer.save = setInterval(() => {
					const ln = this.toSave.length;
					if (ln) {
						if (this.toSave[ln - 1].setKeyOnly) {
							this.database[this.toSave[ln - 1].key] = this.toSave[ln - 1].saveName;
							$Lib.save(`${this.toSave[ln - 1].folder}database.dat`, JSON.stringify(this.database, null, 3), true);
						} else {
							const saved = this.toSave[ln - 1].image.SaveAs(this.toSave[ln - 1].folder + this.toSave[ln - 1].saveName, 'image/jpeg');
							if (saved) {
								this.database[this.toSave[ln - 1].key] = this.toSave[ln - 1].saveName;
								$Lib.save(`${this.toSave[ln - 1].folder}database.dat`, JSON.stringify(this.database, null, 3), true);
							}
						}
						this.toSave.pop();
					}
					if (!this.toSave.length) {
						clearInterval(this.timer.save);
						this.timer.save = null;
					}
				}, 1000);
			}
		}
		catch (e) {
			$Lib.trace(`unable to load thumbnail image: ${key}`);
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
			$Lib.trace(`unable to load thumbnail image: ${key}`);
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
		if (numToRemove > 0) {
			for (let i = 0; i < numToRemove; i++) this.trimCache(keys[i]);
		}
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
		const n = Math.max(Math.min(Math.floor(Math.sqrt(imgsAvailable)), Infinity), 2); // auto set collage size: limited by no imgs available (per screen): reduce by changing infinity
		const cells = Math.pow(n, 2);
		this.rootNo = n * n + 1;
		if (!o) {
			this.cache[key] = {
				img: 'called',
				accessed: ++this.accessed
			};
		}
		o = this.cache[key];
		o.img = $Lib.gr(this.cellWidth * n, this.cellWidth * n, true, g => this.createCollage(g, this.cellWidth, this.cellWidth, n, n, cells));
		if (this.style.image == 2) this.circularMask(o.img, o.img.Width, o.img.Height);
		o.img = o.img.Resize(this.im.w, this.im.w, 7);
		if (ppt.albumArtLabelType == 3) this.fadeMask(o.img, o.img.Width, o.img.Height);
		panel.treePaint();
	}

	checkTooltip(gr, item, x, y1, y2, y3, w, tt1, tt2, tt3, font1, font2, font3) {
		if (panel.colMarker) {
			if (tt1) tt1 = tt1.replace(/@!#.*?@!#/g, '');
			if (tt2) tt2 = tt2.replace(/@!#.*?@!#/g, '');
		}
		let text = tt1 || '';
		if (tt2 && (panel.lines == 2 || panel.lines == 1 && this.labels.statistics)) text += `\n${tt2}`;
		if (tt3 && this.labels.statistics) text += `\n${tt3}`;
		item.tt = {
			text,
			x,
			y1,
			y2,
			y3,
			w,
			1: tt1 ? gr.CalcTextWidth(tt1, font1) > w ? tt1 : false : false,
			2: tt2 ? gr.CalcTextWidth(tt2, font2) > w ? tt2 : false : false,
			3: tt3 ? gr.CalcTextWidth(tt3, font3) > w ? tt3 : false : false
		};
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
		let box_x;
		let box_y;
		let iw;
		let ih;
		this.getItemsToDraw();
		this.column = 0;
		for (let i = this.start; i < this.end; i++) {
			const row = this.style.vertical ? Math.floor(i / this.columns) : 0;
			box_x = this.style.vertical ? Math.floor(ui.x + this.panel.x + this.column * this.columnWidth + this.bor.side) : Math.floor(ui.x + this.panel.x + i * this.columnWidth + this.bor.side - sbar.delta + (ppt.albumArtFlowMode ? scaleForDisplay(18) : 0));
			box_y = this.style.vertical ? Math.floor(ui.y + this.panel.y + row * this.row.h - sbar.delta) : ui.y + this.style.y;
			if (box_y >= 0 - this.row.h && box_y < this.panel.y + this.panel.h) {
				const item = pop.tree[i];
				pop.getItemCount(item);
				const grp = item.grp;
				const lot = item.lot;
				const statistics = this.labels.statistics ? (!item.root && this.labels.counts ? item.count + (item.count && item._statistics ? ' | ' : '') : '') + item._statistics : '';
				const cur_img = !this.zooming ? this.getImg(item.key) : null;
				const nowp = this.checkNowPlaying(item);
				const grpCol = this.getGrpCol(item, nowp, pop.highlight.text && i == pop.m.i);
				const lotCol = this.getLotCol(item, nowp, pop.highlight.text && i == pop.m.i);
				const coversRightBottom = ['coversLabelsRight', 'coversLabelsBottom'].includes(pref.libraryDesign) || ppt.albumArtLabelType === 2;
				const updatedNowpBg = g_pl_colors.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing

				this.drawSelBg(gr, cur_img, box_x, box_y, i, nowp);

				// * Now playing bg for labels overlay mode ( album art )
				if (this.labels.overlay && !item.root && pop.inRange(pop.nowp, item.item) && updatedNowpBg) {
					gr.FillSolidRect(box_x, box_y, this.box.w, this.box.h, ui.col.nowPlayingBg);
				}
				// * Now playing bg selection with now playing deactivated ( album art )
				if (item.sel && ppt.albumArtShow && !coversRightBottom && updatedNowpBg) {
					gr.FillSolidRect(box_x, box_y, this.box.w, this.box.h, ui.col.nowPlayingBg);
				}
				// * Now playing bg selection with now playing deactivated
				if (!pop.highlight.nowPlaying && item.sel && coversRightBottom && updatedNowpBg) {
					gr.FillSolidRect(ui.x, box_y, sbar.w ? ui.w - scaleForDisplay(42) : ui.w, this.box.h, ui.col.nowPlayingBg);
					gr.FillSolidRect(ui.x, box_y, ui.sz.sideMarker, this.box.h, ui.col.sideMarker);
				}
				// * Marker selection with now playing active
				if (pop.highlight.nowPlaying && item.sel && pref.libraryDesign !== 'flowMode') {
					gr.DrawRect(ui.x, box_y, sbar.w ? ui.w - scaleForDisplay(42) - 1 : ui.w, this.box.h, 1, ui.col.selectionFrame);
					gr.FillSolidRect(ui.x, box_y, ui.sz.sideMarker, this.box.h + 1, ui.col.sideMarker);
				}
				// * Hide DrawRect gaps when all songs are completely selected and mask lines when selecting now playing
				if ((['white', 'black', 'cream'].includes(pref.theme) && !pref.styleBlackAndWhite2) && (pop.highlight.nowPlaying && item.sel && !item.root && pop.inRange(pop.nowp, item.item) && coversRightBottom) && updatedNowpBg) {
					gr.DrawRect(ui.x, box_y, pop.fullLineSelection ? sbar.w ? ui.w - scaleForDisplay(42) : ui.w : ui.w + ui.sz.margin + box_x - ui.x - ui.sz.sideMarker, this.box.h, 1, ui.col.nowPlayingBg);
				}

				this.im.y = this.labels.overlay ? this.im.offset + box_y + ppt.thumbNailGapCompact / 2 : this.im.offset + box_y;
				if (pop.rowStripes && this.labels.right) {
					if (i % 2 == 0) gr.FillSolidRect(0, box_y + 1, panel.tree.stripe.w, this.row.h, ui.col.rowStripes /*ui.col.bg1*/);
					else gr.FillSolidRect(0, box_y, panel.tree.stripe.w, this.row.h, ui.col.bg2);
				}
				let x1 = 0;
				const x2 = Math.round(box_x + (this.bor.cov) / 2);
				let y1 = 0;
				let y2 = this.im.y + 2 + this.im.w - this.overlayHeight;
				if (cur_img) {
					iw = cur_img.Width;
					ih = cur_img.Height;
					x1 = box_x + Math.round((this.box.w - iw) / 2);
					y1 = this.im.y + 1 + this.im.w - ih;
					const w = iw;
					const h = ih;
					if (this.style.dropShadow && this.shadow) {
						if (this.style.image) {
							gr.DrawImage(this.shadow, x1, y1, this.shadow.Width, this.shadow.Height, 0, 0, this.shadow.Width, this.shadow.Height);
						} else {
							gr.DrawImage(this.shadow, x1, y1, Math.ceil(w * 1.15), Math.ceil(h * 1.15), 0, 0, this.shadow.Width, this.shadow.Height);
						}
					} else if (this.style.dropGrad) {
						if (this.style.image != 2) {
							gr.FillGradRect(x1 + w, y1, 4 * $Lib.scale, h,  0, RGBA(0, 0, 0, 56), 0);
							gr.FillGradRect(x1, y1 + h, w, 4 * $Lib.scale, 90, RGBA(0, 0, 0, 56), 0);
						} else {
							gr.SetSmoothingMode(4);
							gr.DrawEllipse(x1, y1, iw, ih, 4 * $Lib.scale, RGBA(0, 0, 0, 32));
							gr.SetSmoothingMode(0);
						}
					}

					gr.DrawImage(cur_img, x1, y1, w, h, pref.libraryThumbnailBorder === 'border' ? 0 : 1, pref.libraryThumbnailBorder === 'border' ? 0 : 1, iw, ih);

					if (this.labels.overlayDark) {
						if (item.sel || nowp) gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, RGBA(150, 150, 150, 150));
						gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, this.getSelBgCol(item, nowp));
					}
					if (pref.libraryThumbnailBorder !== 'none' && (!item.sel || !this.labels.overlay || this.style.image != 2)) {
						if (this.style.image != 2) gr.DrawRect(x1, y1, iw - 1, ih - 1, 1, ui.col.imgBor);
						else {
							gr.SetSmoothingMode(2);
							gr.DrawEllipse(x1, y1, iw - 1, ih - 1, 1, ui.col.imgBor);
							gr.SetSmoothingMode(0);
						}
					}
					gr.SetSmoothingMode(0);
				}
				else {
					iw = this.im.w;
					ih = this.im.w;
					x1 = box_x + Math.round((this.box.w - iw) / 2);
					y1 = this.im.y + 2 + iw - ih;
					if (!item.root) {
						if (this.style.dropShadowStub && this.shadowStub) {
							gr.DrawImage(this.shadowStub, x1, y1, this.shadowStub.Width, this.shadowStub.Height, 0, 0, this.shadowStub.Width, this.shadowStub.Height);
						} else if (this.style.dropGradStub) {
							if (this.style.image != 2) {
								gr.FillGradRect(x1 + iw - 2 * $Lib.scale, y1, 6 * $Lib.scale, ih,  0, RGBA(0, 0, 0, 56), 0);
								gr.FillGradRect(x1, y1 + ih - 2 * $Lib.scale, iw, 6 * $Lib.scale, 90, RGBA(0, 0, 0, 56), 0);
							} else {
								gr.SetSmoothingMode(2);
								gr.DrawEllipse(x1, y1, iw, ih, 4 * $Lib.scale, RGBA(0, 0, 0, 32));
								gr.SetSmoothingMode(0);
							}
						}
						this.stub.noImg && gr.DrawImage(this.stub.noImg, x1, y1, iw, ih, 0, 0, iw, ih);
					}
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
					if (pop.highlight.row == 3 || pop.highlight.row == 2 && (((this.labels.overlay || this.labels.hide) && this.style.image != 2))) {
						if (!ppt.frameImage) this.drawFrame(gr, box_x, box_y, /*ui.col.frameImgSel*/ ui.col.selectionFrame2, !this.labels.overlay && !this.labels.hide ? 'stnd' : 'thick');
						else this.drawImageFrame(gr, x1, y1, iw, ih, /*ui.col.frameImgSel*/ ui.col.selectionFrame2);
					} // else if (pop.highlight.row == 1 && !sbar.draw_timer) gr.FillSolidRect(ui.l.w, y1, ui.sz.sideMarker, this.im.w, ui.col.sideMarker);
				}
				if (item.sel) {
					// if (this.labels.overlay && this.style.image != 2) this.drawFrame(gr, box_x, box_y, /*ui.col.frameImgSel*/ ui.col.selectionFrame2, 'thick');
					// else if (this.labels.hide && pop.highlight.row == 3 && ppt.frameImage) this.drawImageFrame(gr, x1, y1, iw, ih, /*ui.col.frameImgSel*/  ui.col.selectionFrame2);
					if (this.labels.hide && pop.highlight.row == 3 && ppt.frameImage) this.drawImageFrame(gr, x1, y1, iw, ih, /*ui.col.frameImgSel*/  ui.col.selectionFrame2);
				}
				if (!this.labels.hide) {
					const x = box_x + this.text.x;
					let type = 0;

					const txt_c =
						pop.highlight.nowPlaying && !item.root && pop.inRange(pop.nowp, item.item) && updatedNowpBg ? ui.col.text_nowp :
						item.sel ? ui.col.textSel :
						pop.m.i === i ? ui.col.text_h : ui.col.text;

					if (panel.colMarker) type = item.sel ? 2 : pop.highlight.text && i == pop.m.i ? 1 : 0;
					if (!this.labels.overlay) {
						y1 = this.im.y + this.text.y1;
						y2 = this.im.y + this.text.y2;
						const y3 = this.im.y + this.text.y3;
						if (panel.lines == 2) {
							this.checkTooltip(gr, item, x, y1, y2, y3, this.text.w, grp, lot, statistics, ui.font.group, /*ui.font.lot,*/ ui.font.group, ui.font.statistics);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.groupEllipsisSpace, 'group');
							!panel.colMarker ? gr.GdiDrawText(lot, ui.font.lot, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? panel.cc : panel.lc) : pop.cusCol(gr, lot, item, x, y2, this.text.w, this.text.h, type, nowp, ui.font.lot, ui.font.lotEllipsisSpace, 'lott');
							if (statistics) gr.GdiDrawText(statistics, ui.font.statistics, txt_c /*lotCol*/, x, y3, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? panel.cc : panel.lc);
						} else {
							this.checkTooltip(gr, item, x, y1, statistics ? y2 : -1, -1, this.text.w, grp, statistics, false, ui.font.group, ui.font.statistics);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.mainEllipsisSpace, 'group');
							if (statistics) gr.GdiDrawText(statistics, ui.font.statistics, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? panel.cc : panel.lc);
						}
					} else {
						y1 = this.im.y + this.text.y1;
						y2 = y1 + this.text.h * (this.labels.statistics ? 0.93 : 0.9);
						const y3 = y2 + this.text.h * 0.95;
						if (panel.lines == 2) {
							this.checkTooltip(gr, item, x, y1, y2, y3, this.text.w, grp, lot, statistics, ui.font.group, /*ui.font.lot,*/ ui.font.group, ui.font.statistics);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.groupEllipsisSpace, 'lott');
							!panel.colMarker ? gr.GdiDrawText(lot, ui.font.lot, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !item.tt[2] ? panel.cc : panel.lc) : pop.cusCol(gr, lot, item, x, y2, this.text.w, this.text.h, type, nowp, ui.font.lot, ui.font.lotEllipsisSpace, 'group');
							if (statistics) gr.GdiDrawText(statistics, ui.font.statistics, txt_c /*lotCol*/, x, y3, this.text.w, this.text.h, this.style.image != 1 && !item.tt[3] ? panel.cc : panel.lc);
						} else {
							this.checkTooltip(gr, item, x, y1, statistics ? y2 : -1, -1, this.text.w, grp, statistics, false, ui.font.group, /*ui.font.lot,*/ ui.font.group, ui.font.statistics);
							!panel.colMarker ? gr.GdiDrawText(grp, ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !item.tt[1] ? panel.cc : panel.lc) : pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, ui.font.group, ui.font.groupEllipsisSpace, 'group');
							if (statistics) gr.GdiDrawText(statistics, ui.font.statistics, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !item.tt[2] ? panel.cc : panel.lc);
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
		let x;
		let y;
		let w;
		let h;
		let l_w;
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

	drawImageFrame(gr, x, y, w, h, col) {
		const l_w = 3;
		gr.SetSmoothingMode(2);
		if (this.style.image != 2) gr.DrawRect(x + 1, y + 1, w - l_w / 2 - 1, h - l_w / 2 - 1, l_w, col);
		else gr.DrawEllipse(x, y, w - l_w / 2, h - l_w / 2, l_w, col);
		gr.SetSmoothingMode(0);
	}

	drawItemOverlay(gr, item, x, y, w) {
		if (item.root) return;
		switch (ppt.itemOverlayType) {
			case 1: {
				if (!item.count) break;
				let count_w = Math.max(gr.CalcTextWidth(`${item.count} `, ui.font.tracks), 8);
				const count_h = Math.max(gr.CalcTextHeight(item.count, ui.font.tracks), 8);
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
					gr.SetSmoothingMode(2);
					gr.FillSolidRect(count_x, count_y, count_w + 2, count_h2, RGBA(0, 0, 0, 115));
					gr.GdiDrawText(count, ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y, count_w, count_h, panel.cc);
					gr.SetSmoothingMode(0);
				}
				break;
			}
			case 2: {
				if (!item.year) break;
				const year_w = Math.max(gr.CalcTextWidth(`${item.year} `, ui.font.tracks), 8);
				const year_h = Math.max(gr.CalcTextHeight(item.year, ui.font.tracks), 8);
				const year_x = x + (this.style.image != 2 ? 0 : (w - year_w - 2) / 2);
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
		if (this.labels.hide && (this.style.image != 2 || pop.highlight.row == 3 && ppt.frameImage)) return;
		let x;
		let y;
		let w;
		let h;
		switch (true) {
			case nowpOrSel:
				// col = ui.col.imgBgSel;
				switch (this.labels.overlay || this.labels.hide) {
					case true:
						x = box_x + Math.round((this.box.w - (cur_img ? cur_img.Width + 1 : this.im.w + 2)) / 2);
						y = box_y + (cur_img ? ppt.thumbNailGapCompact / 2 + this.im.w - cur_img.Height + 1 : ppt.thumbNailGapCompact / 2 + 2);
						w = cur_img ? cur_img.Width : this.im.w;
						h = cur_img ? cur_img.Height : this.im.w;
						break;
					case false:
						x = !this.labels.right ? box_x : ui.x;
						y = box_y + (!this.labels.right ? 1 : 1);
						w = !this.labels.right ? this.box.w : panel.tree.sel.w;
						h = this.box.h - 1;
						break;
				}
				break;
			case pop.highlight.row == 2 && i == pop.m.i:
				// col = ui.col.bg_h;
				if ((this.labels.overlay || this.labels.hide) && this.style.image == 2) {
					x = box_x + Math.round((this.box.w - (cur_img ? cur_img.Width : this.im.w)) / 2);
					y = box_y + (cur_img ? this.im.w - cur_img.Height : 0);
					w = cur_img ? cur_img.Width : this.im.w;
					h = cur_img ? cur_img.Height : this.im.w;
				} else {
					x = !this.labels.right ? box_x : ui.sz.pad;
					y = box_y + ((this.labels.overlay || this.labels.hide) ? 0 : (!this.labels.right ? 2 : 1));
					w = !this.labels.right ? this.box.w : panel.tree.sel.w;
					h = this.box.h + ((this.labels.overlay || this.labels.hide) ? 2 : 0);
				}
				break;
		}

		x = this.labels.overlay ? box_x + Math.round((this.box.w - (cur_img ? cur_img.Width + 1 : this.im.w + 2)) / 2) : !this.labels.right ? box_x : ui.x;
		y = this.labels.overlay ? box_y + (cur_img ? ppt.thumbNailGapCompact / 2 + this.im.w - cur_img.Height + 1 : ppt.thumbNailGapCompact / 2 + 2) : box_y + (!this.labels.right ? 1 : 1);
		const coversRight = pref.libraryDesign === 'coversLabelsRight' || ppt.albumArtLabelType === 2;

		gr.FillSolidRect(x, coversRight ? y - 1 : y, w - (sbar.w && coversRight ? scaleForDisplay(42) : 0), coversRight ? h + 2 : h, ui.col.nowPlayingBg);

		if ((pref.theme !== 'white' && pref.theme !== 'black') && (!ppt.albumArtShow || ppt.albumArtShow && coversRight) ||
			(pref.styleBlackAndWhite || pref.styleBlackAndWhite2) && ppt.albumArtShow && coversRight) {
			gr.FillSolidRect(x, y - 1, ui.sz.sideMarker, h + 2, ui.col.sideMarker);
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
		if (caller.startsWith('display')) {
			this.cache[key] = {
				img: image,
				accessed: caller == 'display' ? ++this.accessed : 0
			};
		}
		else return image;
	}

	getCurrentDatabase() {
		this.albumArtDiskCache = ppt.albumArtDiskCache;
		if (!this.albumArtDiskCache) return;
		const cacheFolder = this.cacheFolder;
		$Lib.buildPth(this.cachePath);
		this.saveSize = this.im.w > 500 ? 750 : this.im.w > 250 ? 500 : 250;
		this.interval = {
			cache: this.saveSize == 250 ? 1 : this.saveSize == 500 ? 4 : 9,
			preLoad: this.saveSize == 250 ? (ppt.albumArtLabelType != 3 ? 7 : 15) : this.saveSize == 500 ? 20 : 45
		}
		this.cacheFolder = `${this.cachePath + ['front', 'back', 'disc', 'icon', 'artist'][ppt.artId] + (this.saveSize == 250 ? '' : this.saveSize)}\\`;
		$Lib.create(this.cacheFolder);
		this.database = $Lib.jsonParse(`${this.cacheFolder}database.dat`, this.newDatabase(), 'file');
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

	getField(handle, name, arr) {
		const f = handle.GetFileInfo();
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
		return nowp ? ui.col.nowp : hover ? (panel.textDiffHighlight ? ui.col.nowp : ui.col.text_h) : item.sel ? !this.labels.overlayDark ? ui.col.textSel : ui.col.text : !this.labels.overlayDark ? ui.col.text : RGB(240, 240, 240);
	}

	getImages() {
		const extraRows = this.albumArtDiskCache ? panel.rows * 2 : panel.rows; // will load any extra including those after any preLoad

		if (!panel.imgView) return;
		this.items = [];
		let begin = this.start == 0 ? ppt.rootNode ? 1 : 0 : this.start;
		const end = this.end != 0 ? Math.min(this.end + this.columns * extraRows, pop.tree.length) : this.end;
		for (let i = begin; i < end; i++) {
			if (!pop.tree[i]) continue;
			const key = pop.tree[i].key;
			if (key && !this.cache[key]) {
				this.items.push({
					ix: i,
					handle: pop.tree[i].handle,
					key
				});
			}
		}

		begin = Math.max(ppt.rootNode ? 1 : 0, begin - this.columns * extraRows);

		let i = end;
		while (i--) {
			if (i < begin) break;
			if (!pop.tree[i]) continue;
			const key = pop.tree[i].key;
			if (key && !this.cache[key]) {
				this.items.push({
					ix: i,
					handle: pop.tree[i].handle,
					key
				});
			}
		}
		if (!this.items.length) return;

		let interval = !sbar.bar.isDragging && !sbar.touch.dn ? 5 : 50;
		const allCached = this.albumArtDiskCache ? this.items.every(v => v.key && this.database[v.key]) : false;
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
						};
						this.load_image_async(key, this.cacheFolder + this.database[key], v.ix);
					} else {
						this.cache[key] = {
							img: 'called',
							accessed: ++this.accessed
						};
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

	getItem(i) {
		if (!pop.tree[i]) {
			return null;
		}
		const key = pop.tree[i].key;
		if (!this.cache[key] && this.database[key] && this.database[key] != 'noAlbumArt') {
			if ($Lib.file(this.cacheFolder + this.database[key])) { // cacheItPreload if file exists
				return {
					ix: i,
					key
				}
			}
		}
		return null;
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
					this.start = $Lib.clamp(this.start, 0, this.start - 1);
				}
				break;
		}
		this.albumArtDiskCache ? (preLoad ? this.preLoad() : this.getImages()) : this.loadThrottle();
	}

	getLotCol(item, nowp, hover) {
		return nowp ? ui.col.nowp : hover ? (panel.textDiffHighlight ? ui.col.nowp : ui.col.text_h) : item.sel ? !this.labels.overlayDark ? ui.col.selBlend : ui.col.lotBlend : !this.labels.overlayDark ? ui.col.lotBlend : RGB(220, 220, 220);
	}

	getMostFrequentField(arr) {
		const counts = arr.reduce((a, c) => {
			a[c] = (a[c] || 0) + 1;
			return a;
		}, {});
		const maxCount = Math.max(...Object.values(counts));
		const mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
		return panel.grp[ppt.viewBy].type.includes(mostFrequent[0]) ? mostFrequent[0] : '';
	}

	getShadow() {
		const xy = this.im.w * 0.02;
		let wh = this.style.image ? this.im.w * 0.985 : this.im.w; // draw at actual size if possible as faster; regular have to be resized during draw
		const sz = this.im.w * 1.17;
		if (this.style.image != 2) {
			this.shadow = $Lib.gr(sz, sz, true, g => g.FillSolidRect(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
			this.shadow.StackBlur(5);
		} else {
			this.shadow = $Lib.gr(sz, sz, true, g => g.FillEllipse(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
			this.shadow.StackBlur(4);
		}
		wh = this.im.w * 0.985; // always drawn at actual size
		if (ppt.artId == 4) {
			if (ppt.curNoArtistImg == 0 || ppt.curNoArtistImg == 2 || this.style.image == 2) {
				this.shadowStub = $Lib.gr(sz, sz, true, g => g.FillEllipse(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
				this.shadowStub.StackBlur(4);
			} else if (ppt.curNoArtistImg != 4) {
				this.shadowStub = $Lib.gr(sz, sz, true, g => g.FillSolidRect(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
				this.shadowStub.StackBlur(5);
			} else {
				this.shadowStub = null;
			}
		} else if (ppt.curNoCoverImg > 2) {
			this.shadowStub = $Lib.gr(sz, sz, true, g => g.FillSolidRect(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
			this.shadowStub.StackBlur(5);
		} else {
			this.shadowStub = null;
		}
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
		const albumArtGrpNames = $Lib.jsonParse(ppt.albumArtGrpNames, {});
		const fields = [];
		const mod = pop.tree.length < 1000 ? 1 : pop.tree.length < 3500 ? Math.round(pop.tree.length / 1000) : 3;
		const tf_d = FbTitleFormat('[$year(%date%)]');
		this.groupField = albumArtGrpNames[`${panel.grp[ppt.viewBy].type.trim()}${panel.lines}`];

		pop.tree.forEach((v, i) => {
			const handle = panel.list[v.item[0].start];
			v.handle = handle;
			const arr = pop.tree[i].name.split('^@^');
			v.grp = panel.lines == 1 || !ppt.albumArtFlipLabels ? arr[0] : arr[1];
			v.lot = panel.lines == 2 ? !ppt.albumArtFlipLabels ? arr[1] : arr[0] : '';
			v.key = md5.hashStr(handle.Path + handle.SubSong + (panel.lines == 1 ? (arr[0] || 'Unknown') : (`${arr[0] || 'Unknown'} - ${arr[1] || 'Unknown'}`)) + ppt.artId);
			if (ppt.itemOverlayType == 2) v.year = tf_d.EvalWithMetadb(handle).replace('0000', '');
			if (!this.groupField && !panel.folderView && i % mod === 0) this.getField(handle, panel.lines == 1 || ppt.albumArtFlipLabels ? v.grp : v.lot, fields);
		});
		if (!this.groupField && !panel.folderView) {
			this.groupField = this.getMostFrequentField(fields) || 'Item';
			this.groupField = $Lib.titlecase(this.groupField);
		}

		if (ppt.rootNode) {
			if (!this.groupField) this.groupField = 'Item';
			const plurals = this.groupField.split(' ').map(v => pluralize(v));
			const pluralField = plurals.join(' ').replace(/(album|artist|top|track)s\s/gi, '$1 ').replace(/(similar artist)\s/gi, '$1s ').replace(/years - albums/gi, 'Year - Albums');
			pop.tree[0].key = pop.tree[0].name;
			const ln1 = pop.tree.length - 1;
			const ln2 = panel.list.Count;
			const nm = `${!ppt.showSource ? 'All' : panel.sourceName} (${ln1}${ln1 > 1 ? ` ${pluralField}` : ` ${this.groupField}`})`;
			if (ppt.rootNode == 3) pop.tree[0].grp = nm;
			else if (panel.lines == 1) pop.tree[0].grp = panel.rootName + (ppt.nodeCounts ? ` (${ppt.nodeCounts == 2 && ppt.rootNode != 3 ? ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${this.groupField}`) : ln2 + (ln2 > 1 ? ' tracks' : ' track')})` : '');
			if (panel.lines == 2) {
				if (ppt.rootNode != 3) pop.tree[0].grp = panel.rootName;
				pop.tree[0].lot = ppt.nodeCounts == 2 && ppt.rootNode != 3 ? ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${this.groupField}`) : ln2 + (ln2 > 1 ? ' tracks' : ' track');
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
			this.letter.w = Math.round(g.CalcTextWidth('W', ui.font.main));
			this.text.h = Math.max(Math.round(g.CalcTextHeight('String', ui.font.group)) + lineSpacing, Math.round(g.CalcTextHeight('String', ui.font.lot)) + lineSpacing, 10);
		});
		this.style = {
			dropShadow: ppt.albumArtDropShadow && ppt.albumArtLabelType != 3,
			dropShadowStub: ppt.albumArtDropShadow && ppt.albumArtLabelType != 3 && (ppt.artId == 4 || ppt.curNoCoverImg > 2),
			image: this.getStyle(),
			rootComposite: ppt.rootNode && ppt.curRootImg == 3,
			vertical: !ppt.albumArtFlowMode ? true : ui.h - panel.search.h > ui.w - ui.sbar.w
		}

		this.style.dropGrad = ppt.albumArtDropShadow && !this.style.dropShadow;
		this.style.dropGradStub = ppt.albumArtDropShadow && !this.style.dropShadowStub;

		this.letter.show = ppt.albumArtLetter;
		this.letter.no = ppt.albumArtLetterNo;
		this.letter.albumArtYearAuto = ppt.albumArtYearAuto;

		switch (this.style.vertical) {
			case true: {
				this.labels = {
					hide: !ppt.albumArtLabelType,
					bottom: ppt.albumArtLabelType == 1 || ppt.albumArtFlowMode && ppt.albumArtLabelType == 2,
					right: !ppt.albumArtFlowMode ? ppt.albumArtLabelType == 2 : false,
					overlay: ppt.albumArtLabelType == 3 || ppt.albumArtLabelType == 4,
					overlayDark: ppt.albumArtLabelType == 4,
					flip: ppt.albumArtFlipLabels,
					statistics: ppt.itemShowStatistics ? 1 : 0
				};
				this.bor.pad = !this.labels.hide && !this.labels.overlay ? (ppt.thumbNailGapStnd == 0 ? Math.round(this.text.h * (!this.labels.right && pref.libraryThumbnailSize !== 'playlist' ? 1.05 : 0.75)) : ppt.thumbNailGapStnd - Math.round(2 * $Lib.scale)) : ppt.thumbNailGapCompact;
				this.im.offset = Math.round(!this.labels.hide && !this.labels.overlay ? this.bor.pad / 2 : -2);

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

				const margin = ppt.margin;
				this.panel.x = (ppt.sbarShow != 2 ? Math.max(margin, ui.sbar.w) : margin) + ui.l.w - scaleForDisplay(3);
				this.panel.w = ui.w - ui.l.w * 2 - (ui.sbar.type == 0 || ppt.sbarShow != 2 ? Math.max(margin, ui.sbar.w) * 2 + scaleForDisplay(20) : (margin * 2 + ui.sbar.w) + scaleForDisplay(20));
				this.panel.h = ui.h - this.panel.y;

				this.blockWidth = pref.libraryThumbnailSize === 'playlist' ? playlistThumbSize + (this.bor.side * 2 + this.bor.cov * 2) :
					Math.round(ui.row.h * 4 * $Lib.scale * ppt.zoomImg / 100 *
					[// Thumbnail size
						0.66,  // Mini
						1,     // Small
						1.5,   // Regular
						1.75,  // Medium
						2.5,   // Large
						3,     // XL
						3.5,   // XXL
						5      // MAX
					][ppt.thumbNailSize]);

				this.columns = ppt.albumArtFlowMode || this.labels.right ? 1 : Math.max(Math.floor(this.panel.w / this.blockWidth), 1);
				let gap = this.panel.w - this.columns * this.blockWidth;
				gap = Math.floor(gap / this.columns);
				this.columnWidth = !this.labels.right ? $Lib.clamp(this.blockWidth + (pref.libraryThumbnailSize === 'playlist' ? 0 : gap), 10, Math.min(this.panel.w, this.panel.h)) : $Lib.clamp(this.blockWidth, 10, Math.min(this.panel.w, this.panel.h));
				this.overlayHeight = !this.labels.overlay ? 0 : (panel.lines != 2 ? this.text.h * (1.2 + this.labels.statistics) : Math.round(this.text.h * (2.1 + this.labels.statistics)));
				this.im.w = Math.round(Math.max(this.columnWidth - this.bor.side * 2 - this.bor.cov * 2 - (this.labels.hide || this.labels.overlay ? 1 : 0), 10));

				if (this.labels.hide || this.labels.overlay) {
					this.im.w = Math.round(Math.max(this.columnWidth - this.bor.cov, 10));
					this.row.h = this.im.w + this.bor.cov;
				} else {
					this.im.w = Math.round(Math.max(this.columnWidth - this.bor.cov * 2 - this.bor.side * 2, 10));
					this.row.h = !this.labels.right ? this.im.w + this.text.h * (panel.lines + this.labels.statistics) + this.bor.cov * 2 + this.bor.side * 2 : this.im.w + this.bor.pad + 2;
				}
				if (this.row.h > this.panel.h) {
					this.im.w -= this.row.h - this.panel.h;
					this.im.w = Math.max(this.im.w, 10);
					this.row.h = this.panel.h;
				}
				this.box.w = this.columnWidth - this.bor.side * 2;
				this.box.h = this.row.h - (!this.labels.right ? this.bor.side * 2 : 0);
				panel.rows = Math.max(Math.floor(this.panel.h / this.row.h));
				sbar.metrics(sbar.x, sbar.y, sbar.w, sbar.h, panel.rows, this.row.h, this.style.vertical);
				sbar.setRows(Math.ceil(pop.tree.length / this.columns));
				break;
			}
			case false: { // only H-Flow
				this.labels = {
					hide: !ppt.albumArtLabelType,
					bottom: ppt.albumArtLabelType == 1 || ppt.albumArtLabelType == 2,
					right: false,
					overlay: ppt.albumArtLabelType == 3 || ppt.albumArtLabelType == 4,
					overlayDark: ppt.albumArtLabelType == 4,
					flip: ppt.albumArtFlipLabels,
					statistics: ppt.itemShowStatistics ? 1 : 0
				};
				this.bor.pad = !this.labels.hide && !this.labels.overlay ? (ppt.thumbNailGapStnd == 0 ? Math.round(this.text.h * 1.05) : ppt.thumbNailGapStnd - Math.round(2 * $Lib.scale)) : ppt.thumbNailGapCompact;
				this.im.offset = Math.round(!this.labels.hide && !this.labels.overlay ? this.bor.pad / 2 : -2);
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
				const spacer = this.letter.show ? (this.labels.bottom ? this.text.h * 0.5 - this.bor.pad / 4 : this.text.h * 0.75) : (this.labels.bottom ? 0 : Math.round(this.bor.pad / 2));
				this.panel.y = panel.search.h + spacer - scaleForDisplay(3);
				this.panel.h = ui.h - this.panel.y - ui.l.w * 3 - spacer - ui.sbar.w - scaleForDisplay(34);

				this.panel.w = ui.w;
				if (!this.labels.hide && !this.labels.overlay) {
					this.row.h = this.panel.h;
					const extra = this.text.h * (panel.lines + this.labels.statistics) + this.bor.cov * 2 + this.bor.side * 2;
					this.im.w = Math.min(this.panel.h - extra, this.panel.h - extra);
					this.im.w = $Lib.clamp(this.im.w, 10, Math.round(this.panel.w - (this.bor.cov * 2 + this.bor.side * 2)));
					this.blockWidth = this.im.w + this.bor.cov * 2 + this.bor.side * 2;
					this.row.h = this.im.w + extra;
				} else {
					const extra = this.bor.cov;
					this.im.w = Math.min(this.panel.h - extra, this.panel.h - extra);
					this.im.w = $Lib.clamp(this.im.w, 10, Math.round(this.panel.w - this.bor.cov));
					this.blockWidth = this.im.w + this.bor.cov;
					this.row.h = this.im.w + extra;
				}
				this.columns = Math.max(Math.floor(this.panel.w / this.blockWidth), 1);
				this.overlayHeight = !this.labels.overlay ? 0 : (panel.lines != 2 ? this.text.h * (1.2 + this.labels.statistics) : Math.round(this.text.h * (2.1 + this.labels.statistics)));
				this.box.w = this.blockWidth - this.bor.side * 2;
				this.box.h = this.row.h - this.bor.bot;
				panel.rows = Math.max(Math.floor(this.panel.w / this.blockWidth));
				this.columnWidth = this.blockWidth;

				sbar.metrics(sbar.x, sbar.y, ui.w, ui.sbar.w, panel.rows, this.blockWidth, this.style.vertical);
				sbar.setRows(Math.ceil(pop.tree.length));
				break;
			}
		}

		this.cellWidth = Math.max(200, this.im.w / 2);
		this.labels.counts = ppt.itemOverlayType != 1 && ppt.nodeCounts;
		this.style.y = this.style.vertical ? Math.floor(this.panel.y + (!this.labels.hide && !this.labels.overlay ? ppt.thumbNailGapStnd / 2 : ppt.thumbNailGapCompact / 2)) : this.panel.y;
		if (this.style.dropShadow) this.getShadow();

		if (!this.labels.hide) {
			if (!this.labels.overlay) {
				this.text.x = !this.labels.right ? Math.round((this.box.w - this.im.w) / 2) : Math.max(Math.round((this.box.w - this.im.w) / 2), 5 * $Lib.scale) * 2 + this.im.w;
				this.text.y1 = !this.labels.right ? this.im.w + Math.round(this.bor.cov * 0.5) : Math.round((this.im.w - this.text.h * panel.lines) / 2) - (this.labels.statistics ? this.text.h / 2 : 0);
				this.text.y2 = !this.labels.right ? Math.round(this.text.y1 + this.text.h * 0.95) : this.text.y1 + this.text.h;
				this.text.y3 = !this.labels.right ? Math.round(this.text.y2 + this.text.h * 0.95) : this.text.y2 + this.text.h;
				this.text.w = !this.labels.right ? this.im.w : this.panel.w - this.text.x - 12;
			} else {
				this.text.x = Math.round(10 + (ppt.thumbNailGapCompact - 3) / 2);
				this.text.y1 = Math.round(this.im.w - this.overlayHeight + 2 + (this.overlayHeight - this.text.h * (panel.lines + this.labels.statistics)) / 2);
				this.text.w = this.box.w - 20 - ppt.thumbNailGapCompact - 6;
				ppt.thumbNailGapCompact = 22;
			}
		}

		this.cachesize.min = panel.rows * this.columns * 3 + (this.albumArtDiskCache ? panel.rows * 2 : panel.rows) * this.columns * 2;
		this.createImages();
		this.getCurrentDatabase();
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
		};
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
		const begin = this.start == 0 ? ppt.rootNode ? 1 : 0 : this.start;
		const end = this.end != 0 ? Math.min(this.end + this.columns, pop.tree.length) : this.end;
		for (let i = begin; i < end; i++) {
			const v = this.getItem(i);

			if (v) {
				const key = v.key;
				if (!this.cache[key]) {
					this.cache[key] = {
						img: 'called',
						accessed: ++this.accessed
					};
					this.load_image_async(key, this.cacheFolder + this.database[key], v.ix, true);
				}
			}
		}

		const upBegin = this.start == 0 ? ppt.rootNode ? 1 : 0 : this.start - 1;
		const upEnd = ppt.rootNode ? 1 : 0;
		const downBegin = this.end != 0 ? Math.min(this.end + 1 + this.columns, pop.tree.length) : this.end;
		const downEnd = pop.tree.length;

		const doPreload = () => {
			clearInterval(this.timer.preLoad);
			this.timer.preLoad = null;
			let i = downBegin;
			let j = upBegin;
			if (i < downEnd || j > upEnd) {
				this.timer.preLoad = setInterval(() => {
					let v = null;
					if (i < downEnd || j > upEnd) { // interleave
						if (i < downEnd) v = this.getItem(i++);
						if (v) {
							const key = v.key;
							if (!this.cache[key]) {
								this.cache[key] = {
									img: 'called',
									accessed: 0
								};
								this.load_image_async(key, this.cacheFolder + this.database[key], v.ix, true);
							}
						}

						if (j > upEnd) v = this.getItem(j--);
						if (v) {
							const key = v.key;
							if (!this.cache[key]) {
								this.cache[key] = {
									img: 'called',
									accessed: 0
								};
								this.load_image_async(key, this.cacheFolder + this.database[key], v.ix, true);
							}
						}
					} else {
						clearInterval(this.timer.preLoad);
						this.timer.preLoad = null;
					}
				}, this.interval.preLoad);
			}
		};

		doPreload();
	}

	refresh(items) {
		let itemsToRemove = [];
		if (items === 'all') {
			if (!ppt.albumArtDiskCache) return;
			const continue_confirmation = (status, confirmed) => {
				if (confirmed) {
					try {
						this.clearCache();
						const app = new ActiveXObject('Shell.Application');
						app.NameSpace(10).MoveHere(this.cachePath); // remove all saved images & databases if albumArtDiskCache
					} catch (e) {
						$Lib.trace('unable to empty image cache: can be emptied in windows explorer'); // Wine fix
					}
				}
			};
			const caption = 'Reset All Images';
			const prompt = 'This action resets the library tree thumbnail disk cache\n\nContinue?';
			const wsh = popUpBox.isHtmlDialogSupported() ? popUpBox.confirm(caption, prompt, 'Yes', 'No', false, 'center', continue_confirmation) : true;
			if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
			return;
		}

		const allSelected = pop.sel_items.length == fb.GetLibraryItems().Count;
		const base = this.cachePath + ['front', 'back', 'disc', 'icon', 'artist'][ppt.artId];
		const databases = [`${base}\\database.dat`, `${base}500\\database.dat`, `${base}750\\database.dat`];
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
				const cur_db = v == `${this.cacheFolder}database.dat`;
				const imgDatabase = $Lib.jsonParse(v, this.newDatabase(), 'file');
				Object.entries(imgDatabase).forEach(w => { // clear working cache & database of all keys that reference a particular image: this should always work even if images in use
					if (w[0] != '-----------group key------------') {
						if (imgsToRemove.includes(w[1]) || !$Lib.file(this.cacheFolder + w[1])) { // images are refreshed as loaded, overwriting existing
							if (cur_db) this.trimCache(w[0]);
							delete imgDatabase[w[0]];
						}
					}
				});
				Object.entries(imgDatabase).forEach(w => {
					if (w[0] != '-----------group key------------') {
						if (w[1] != 'noAlbumArt' && !$Lib.file(this.cacheFolder + w[1])) delete imgDatabase[w[0]];
					}
				}); // remove any user deleted images from database
				$Lib.save(v, JSON.stringify(imgDatabase, null, 3), true);
			}
		});
		this.getCurrentDatabase();
	}

	setNoArtist() {
		this.artist_images = my_utilsLib.getImageAssets('noArtist').sort();
		ppt.curNoArtistImg = $Lib.clamp($Lib.value(ppt.curNoArtistImg, 0, 0), 0, this.artist_images.length - 1);
		const artistImages = this.artist_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: `file://${v.replace('noArtist', 'noArtist/small')}`
		}));
		this.no_artist_img = gdi.Image(this.artist_images[ppt.curNoArtistImg]);
		ppt.noArtistImages = JSON.stringify(artistImages);
	}

	setNoCover() {
		this.cover_images = my_utilsLib.getImageAssets('noCover').sort();
		ppt.curNoCoverImg = $Lib.clamp($Lib.value(ppt.curNoCoverImg, 0, 0), 0, this.cover_images.length - 1);
		const coverImages = this.cover_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: `file://${v.replace('noCover', 'noCover/small')}`
		}));
		this.no_cover_img = gdi.Image(this.cover_images[ppt.curNoCoverImg]);
		ppt.noCoverImages = JSON.stringify(coverImages);
	}

	setRoot() {
		this.root_images = my_utilsLib.getImageAssets('root').sort();
		ppt.curRootImg = $Lib.clamp($Lib.value(ppt.curRootImg, 0, 0), 0, this.root_images.length - 1);
		const rootImages = this.root_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: `file://${v.replace('root', 'root/small')}`
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
const img = new Images();
