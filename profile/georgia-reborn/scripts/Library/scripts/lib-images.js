'use strict';

class LibImages {
	constructor() {
		this.accessed = 0;
		this.asyncBypass = 0;
		this.blockWidth = 150;
		this.cachePath = grSet.customLibraryDir ? `${grCfg.customLibraryDir}library-tree-cache\\` : `${fb.ProfilePath}cache\\library\\library-tree-cache\\`;
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
			rootComposite: libSet.rootNode && libSet.curRootImg == 3,
			vertical: !libSet.albumArtFlowMode ? true : lib.ui.h - lib.panel.search.h > lib.ui.w - lib.ui.sbar.w,
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

		this.labels = { statistics: libSet.itemShowStatistics ? 1 : 0 }

		this.letter = {
			albumArtYearAuto: libSet.albumArtYearAuto,
			no: 1,
			show: libSet.albumArtLetter,
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
			lib.panel.treePaint();
		}, 500);

		this.loadThrottle = $Lib.throttle(() => {
			if (!lib.panel.imgView) return;
			this.getImages();
		}, 40);

		this.rootDebounce = $Lib.debounce(() => {
			this.checkRootImg();
		}, 250, {
			leading: true,
			trailing: true
		});

		this.sizeDebounce = $Lib.debounce(() => {
			if (!lib.panel.imgView) return;
			this.clearCache();
			this.metrics();
			if (lib.sbar.scroll > lib.sbar.max_scroll) lib.sbar.checkScroll(lib.sbar.max_scroll);
		}, 100);

		this.setRoot();
		this.setNoArtist();
		this.setNoCover();
	}

	// * METHODS * //

	async get_album_art_async(handle, art_id, key, ix) {
		const result = await utils.GetAlbumArtAsyncV2(0, handle, art_id, false);
		const o = this.cache[key];
		const saveName = `${libMD5.hashStr(result.path)}.jpg`;
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
				this.format(image, libSet.artId, ['default', 'crop', 'circular'][this.style.image], this.im.w, this.im.w, libSet.albumArtLabelType == 3, 'display', ix, key);
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
				this.format(image, libSet.artId, ['default', 'crop', 'circular'][this.style.image], this.im.w, this.im.w, libSet.albumArtLabelType == 3, 'displayPreload', ix, key);
			}
			if (this.style.rootComposite && ix < this.rootNo) this.rootDebounce();
		} catch (e) {
			$Lib.trace(`unable to load thumbnail image: ${key}`);
		}
		lib.panel.treePaint();
	}

	checkCache() {
		if (!this.memoryLimit()) return;
		const ln = this.columns * lib.panel.rows * 3;
		if (this.toSave.length > ln) this.toSave.length = ln;
		this.preLoadItems = [];
		clearInterval(this.timer.preLoad);
		this.timer.preLoad = null;
		this.items = [];
		clearInterval(this.timer.load);
		this.timer.load = null;
		let keys = Object.keys(this.cache);
		const cacheLength = keys.length;
		if (lib.pop.tree.length) {
			const o = this.cache[lib.pop.tree[0].key];
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
		if (!libSet.highLightNowplaying) return false;
		return !item.root && lib.pop.inRange(lib.pop.nowp, item.item);
	}

	checkRootImg() {
		const key = lib.pop.tree.length ? lib.pop.tree[0].key : null;
		if (!key) return;
		let o = this.cache[key];
		const imgsAvailable = Math.min(Math.round((this.panel.h + this.row.h) / this.row.h) * this.columns, lib.pop.tree.length) - 1;
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
		if (o.img) {
			if (this.style.image == 2) this.circularMask(o.img, o.img.Width, o.img.Height);
			o.img = o.img.Resize(this.im.w, this.im.w, 7);
			if (libSet.albumArtLabelType == 3) this.fadeMask(o.img, o.img.Width, o.img.Height);
		}
		lib.panel.treePaint();
	}

	checkTooltip(gr, item, x, y1, y2, y3, w, tt1, tt2, tt3, font1, font2, font3) {
		if (lib.panel.colMarker) {
			if (tt1) tt1 = tt1.replace(/@!#.*?@!#/g, '');
			if (tt2) tt2 = tt2.replace(/@!#.*?@!#/g, '');
		}
		let text = tt1 || '';
		if (tt2 && (lib.panel.lines == 2 || lib.panel.lines == 1 && this.labels.statistics)) text += `\n${tt2}`;
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
					let img = lib.pop.tree.length && lib.pop.tree[idx] ? this.getRootImg(lib.pop.tree[idx].key) : null;
					if (!img) img = this.stub.noImg;
					if (img) {
						let cx = 0;
						let cy = 0;
						let cw = img.Width;
						let ch = img.Height;
						if (libSet.albumArtLabelType == 3) {
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
						img = this.format(img, libSet.artId, 'crop', this.cellWidth, this.cellWidth, false, 'root');
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
			if (this.style.image != 2) g.DrawLine(x, 0, x, cellWidth * columns, lib.ui.l.w, lib.ui.col.rootBlend);
		}
		x = 0;
		y = 0;
		for (let row = 0; row < rows; row++) {
			y += cellHeight;
			if (this.style.image != 2) g.DrawLine(x, y, cellWidth * columns, y, lib.ui.l.w, lib.ui.col.rootBlend);
		}
		if (this.style.image != 2) g.DrawRect(0, 0, cellWidth * columns - 1, cellWidth * columns - 1, 1, lib.ui.col.rootBlend);
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
		if (!lib.panel.imgView) return;
		let box_x;
		let box_y;
		let iw;
		let ih;
		this.getItemsToDraw();
		this.column = 0;
		for (let i = this.start; i < this.end; i++) {
			const row = this.style.vertical ? Math.floor(i / this.columns) : 0;
			box_x = this.style.vertical ? Math.floor(lib.ui.x + this.panel.x + this.column * this.columnWidth + this.bor.side) : Math.floor(lib.ui.x + this.panel.x + i * this.columnWidth + this.bor.side - lib.sbar.delta + (libSet.albumArtFlowMode ? SCALE(18) : 0));
			box_y = this.style.vertical ? Math.floor(lib.ui.y + this.panel.y + row * this.row.h - lib.sbar.delta) : lib.ui.y + this.style.y;
			if (box_y >= 0 - this.row.h && box_y < this.panel.y + this.panel.h) {
				const item = lib.pop.tree[i];
				lib.pop.getItemCount(item);
				const grp = item.grp;
				const lot = item.lot;
				const statistics = this.labels.statistics ? (!item.root && this.labels.counts ? item.count + (item.count && item._statistics ? ' | ' : '') : '') + item._statistics : '';
				const cur_img = !this.zooming ? this.getImg(item.key) : null;
				const nowp = this.checkNowPlaying(item);
				// const grpCol = this.getGrpCol(item, nowp, lib.pop.highlight.text && i == lib.pop.m.i);
				// const lotCol = this.getLotCol(item, nowp, lib.pop.highlight.text && i == lib.pop.m.i);
				const coversRightBottom = ['coversLabelsRight', 'coversLabelsBottom'].includes(grSet.libraryDesign) || libSet.albumArtLabelType === 2;
				const updatedNowpBg = pl.col.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing

				this.drawSelBg(gr, cur_img, box_x, box_y, i, nowp);

				// * Now playing bg for labels overlay mode ( album art )
				if (this.labels.overlay && !item.root && lib.pop.inRange(lib.pop.nowp, item.item) && updatedNowpBg) {
					gr.FillSolidRect(box_x, box_y, this.box.w, this.box.h, lib.ui.col.nowPlayingBg);
				}
				// * Now playing bg selection with now playing deactivated ( album art )
				if (item.sel && libSet.albumArtShow && !coversRightBottom && updatedNowpBg) {
					gr.FillSolidRect(box_x, box_y, this.box.w, this.box.h, lib.ui.col.nowPlayingBg);
				}
				// * Now playing bg selection with now playing deactivated
				if (!lib.pop.highlight.nowPlaying && item.sel && coversRightBottom && updatedNowpBg) {
					gr.FillSolidRect(lib.ui.x, box_y, lib.sbar.w ? lib.ui.w - SCALE(42) : lib.ui.w, this.box.h, lib.ui.col.nowPlayingBg);
					gr.FillSolidRect(lib.ui.x, box_y, lib.ui.sz.sideMarker, this.box.h, lib.ui.col.sideMarker);
				}
				// * Marker selection with now playing active
				if (lib.pop.highlight.nowPlaying && item.sel && grSet.libraryDesign !== 'flowMode') {
					gr.DrawRect(lib.ui.x, box_y, lib.sbar.w ? lib.ui.w - SCALE(42) - 1 : lib.ui.w, this.box.h, 1, lib.ui.col.selectionFrame);
					gr.FillSolidRect(lib.ui.x, box_y, lib.ui.sz.sideMarker, this.box.h + 1, lib.ui.col.sideMarker);
				}
				// * Hide DrawRect gaps when all songs are completely selected and mask lines when selecting now playing
				if ((['white', 'black', 'cream'].includes(grSet.theme) && !grSet.styleBlackAndWhite2) && (lib.pop.highlight.nowPlaying && item.sel && !item.root && lib.pop.inRange(lib.pop.nowp, item.item) && coversRightBottom) && updatedNowpBg) {
					gr.DrawRect(lib.ui.x, box_y, lib.pop.fullLineSelection ? lib.sbar.w ? lib.ui.w - SCALE(42) : lib.ui.w : lib.ui.w + lib.ui.sz.margin + box_x - lib.ui.x - lib.ui.sz.sideMarker, this.box.h, 1, lib.ui.col.nowPlayingBg);
				}

				this.im.y = this.labels.overlay ? this.im.offset + box_y + libSet.thumbNailGapCompact / 2 : this.im.offset + box_y;
				if (lib.pop.rowStripes && this.labels.right) {
					if (i % 2 == 0) gr.FillSolidRect(0, box_y + 1, lib.panel.tree.stripe.w, this.row.h, lib.ui.col.rowStripes /*ui.col.bg1*/);
					else gr.FillSolidRect(0, box_y, lib.panel.tree.stripe.w, this.row.h, lib.ui.col.bg2);
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

					gr.DrawImage(cur_img, x1, y1, w, h, grSet.libraryThumbnailBorder === 'border' ? 0 : 1, grSet.libraryThumbnailBorder === 'border' ? 0 : 1, iw, ih);

					if (this.labels.overlayDark) {
						if (item.sel || nowp) gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, RGBA(150, 150, 150, 150));
						gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, this.getSelBgCol(item, nowp));
					}
					if (grSet.libraryThumbnailBorder !== 'none' && (!item.sel || !this.labels.overlay || this.style.image != 2)) {
						if (this.style.image != 2) gr.DrawRect(x1, y1, iw - 1, ih - 1, 1, lib.ui.col.imgBor);
						else {
							gr.SetSmoothingMode(2);
							gr.DrawEllipse(x1, y1, iw - 1, ih - 1, 1, lib.ui.col.imgBor);
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
						gr.FillGradRect(x1, y2 - 1, iw / 2, lib.ui.l.w, 1, RGBA(0, 0, 0, 0), lib.ui.col.imgBor);
						gr.FillGradRect(x1 + iw / 2, y2 - 1, iw / 2, lib.ui.l.w, 1, lib.ui.col.imgBor, RGBA(0, 0, 0, 0));
					}
					if (this.labels.overlayDark) {
						if (item.sel || nowp) gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, RGBA(150, 150, 150, 150));
						gr.FillSolidRect(x2, y2, this.im.w, this.overlayHeight, this.getSelBgCol(item, nowp));
					}
				}
				this.drawItemOverlay(gr, item, x1, y1, iw, ih);
				if (i == lib.pop.m.i) {
					if (lib.pop.highlight.row == 3 || lib.pop.highlight.row == 2 && (((this.labels.overlay || this.labels.hide) && this.style.image != 2))) {
						if (!libSet.frameImage) this.drawFrame(gr, box_x, box_y, /*ui.col.frameImgSel*/ lib.ui.col.selectionFrame2, !this.labels.overlay && !this.labels.hide ? 'stnd' : 'thick');
						else this.drawImageFrame(gr, x1, y1, iw, ih, /*ui.col.frameImgSel*/ lib.ui.col.selectionFrame2);
					} // else if (lib.pop.highlight.row == 1 && !lib.sbar.draw_timer) gr.FillSolidRect(lib.ui.l.w, y1, lib.ui.sz.sideMarker, this.im.w, lib.ui.col.sideMarker);
				}
				if (item.sel) {
					// if (this.labels.overlay && this.style.image != 2) this.drawFrame(gr, box_x, box_y, /* lib.ui.col.frameImgSel */ lib.ui.col.selectionFrame2, 'thick');
					// else if (this.labels.hide && lib.pop.highlight.row == 3 && libSet.frameImage) this.drawImageFrame(gr, x1, y1, iw, ih, /* lib.ui.col.frameImgSel */  lib.ui.col.selectionFrame2);
					if (this.labels.hide && lib.pop.highlight.row == 3 && libSet.frameImage) this.drawImageFrame(gr, x1, y1, iw, ih, /* lib.ui.col.frameImgSel */  lib.ui.col.selectionFrame2);
				}
				if (!this.labels.hide) {
					const x = box_x + this.text.x;
					let type = 0;

					const txt_c =
						lib.pop.highlight.nowPlaying && !item.root && lib.pop.inRange(lib.pop.nowp, item.item) && updatedNowpBg ? lib.ui.col.text_nowp :
						item.sel ? lib.ui.col.textSel :
						lib.pop.m.i === i ? lib.ui.col.text_h : lib.ui.col.text;

					if (lib.panel.colMarker) type = item.sel ? 2 : lib.pop.highlight.text && i == lib.pop.m.i ? 1 : 0;
					if (!this.labels.overlay) {
						y1 = this.im.y + this.text.y1;
						y2 = this.im.y + this.text.y2;
						const y3 = this.im.y + this.text.y3;
						if (lib.panel.lines == 2) {
							this.checkTooltip(gr, item, x, y1, y2, y3, this.text.w, grp, lot, statistics, lib.ui.font.group, /*ui.font.lot,*/ lib.ui.font.group, lib.ui.font.statistics);
							!lib.panel.colMarker ? gr.GdiDrawText(grp, lib.ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[1] ? lib.panel.cc : lib.panel.lc) : lib.pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, lib.ui.font.group, lib.ui.font.groupEllipsisSpace, 'group');
							!lib.panel.colMarker ? gr.GdiDrawText(lot, lib.ui.font.lot, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? lib.panel.cc : lib.panel.lc) : lib.pop.cusCol(gr, lot, item, x, y2, this.text.w, this.text.h, type, nowp, lib.ui.font.lot, lib.ui.font.lotEllipsisSpace, 'lott');
							if (statistics) gr.GdiDrawText(statistics, lib.ui.font.statistics, txt_c /*lotCol*/, x, y3, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? lib.panel.cc : lib.panel.lc);
						} else {
							this.checkTooltip(gr, item, x, y1, statistics ? y2 : -1, -1, this.text.w, grp, statistics, false, lib.ui.font.group, lib.ui.font.statistics);
							!lib.panel.colMarker ? gr.GdiDrawText(grp, lib.ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[1] ? lib.panel.cc : lib.panel.lc) : lib.pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, lib.ui.font.group, lib.ui.font.mainEllipsisSpace, 'group');
							if (statistics) gr.GdiDrawText(statistics, lib.ui.font.statistics, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !this.labels.right && !item.tt[2] ? lib.panel.cc : lib.panel.lc);
						}
					} else {
						y1 = this.im.y + this.text.y1;
						y2 = y1 + this.text.h * (this.labels.statistics ? 0.93 : 0.9);
						const y3 = y2 + this.text.h * 0.95;
						if (lib.panel.lines == 2) {
							this.checkTooltip(gr, item, x, y1, y2, y3, this.text.w, grp, lot, statistics, lib.ui.font.group, /*ui.font.lot,*/ lib.ui.font.group, lib.ui.font.statistics);
							!lib.panel.colMarker ? gr.GdiDrawText(grp, lib.ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !item.tt[1] ? lib.panel.cc : lib.panel.lc) : lib.pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, lib.ui.font.group, lib.ui.font.groupEllipsisSpace, 'lott');
							!lib.panel.colMarker ? gr.GdiDrawText(lot, lib.ui.font.lot, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !item.tt[2] ? lib.panel.cc : lib.panel.lc) : lib.pop.cusCol(gr, lot, item, x, y2, this.text.w, this.text.h, type, nowp, lib.ui.font.lot, lib.ui.font.lotEllipsisSpace, 'group');
							if (statistics) gr.GdiDrawText(statistics, lib.ui.font.statistics, txt_c /*lotCol*/, x, y3, this.text.w, this.text.h, this.style.image != 1 && !item.tt[3] ? lib.panel.cc : lib.panel.lc);
						} else {
							this.checkTooltip(gr, item, x, y1, statistics ? y2 : -1, -1, this.text.w, grp, statistics, false, lib.ui.font.group, /*ui.font.lot,*/ lib.ui.font.group, lib.ui.font.statistics);
							!lib.panel.colMarker ? gr.GdiDrawText(grp, lib.ui.font.group, txt_c /*grpCol*/, x, y1, this.text.w, this.text.h, this.style.image != 1 && !item.tt[1] ? lib.panel.cc : lib.panel.lc) : lib.pop.cusCol(gr, grp, item, x, y1, this.text.w, this.text.h, type, nowp, lib.ui.font.group, lib.ui.font.groupEllipsisSpace, 'group');
							if (statistics) gr.GdiDrawText(statistics, lib.ui.font.statistics, txt_c /*lotCol*/, x, y2, this.text.w, this.text.h, this.style.image != 1 && !item.tt[2] ? lib.panel.cc : lib.panel.lc);
						}
					}
				}
			}
			if (this.column == this.columns - 1) this.column = 0;
			else this.column++;
		}
		lib.ui.drawTopBarUnderlay(gr);
	}

	drawFrame(gr, box_x, box_y, col, weight) {
		let x;
		let y;
		let w;
		let h;
		let l_w;
		switch (weight) {
			case 'stnd':
				x = !this.labels.right ? box_x + 1 : lib.ui.sz.pad + 1;
				y = box_y + (!this.labels.right ? 1 : 1);
				w = !this.labels.right ? this.box.w - 2 : lib.panel.tree.sel.w;
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
		switch (libSet.itemOverlayType) {
			case 1: {
				if (!item.count) break;
				let count_w = Math.max(gr.CalcTextWidth(`${item.count} `, lib.ui.font.tracks), 8);
				const count_h = Math.max(gr.CalcTextHeight(item.count, lib.ui.font.tracks), 8);
				let count_x = x + (this.style.image != 2 ? w - count_w - 3 : (w - count_w - 2) / 2);
				const count_y = y + (this.style.image != 2 ? 0 : count_h / 1.67);
				let count = item.count;
				let count_h2 = count_h;
				if (count_w > this.im.w) {
					count = item.count.split(' ');
					count_h2 = count_h * 2;
					count_w = Math.max(gr.CalcTextWidth(count[0], lib.ui.font.tracks), gr.CalcTextWidth(count[1], lib.ui.font.tracks));
					count_x = x + (this.style.image != 2 ? w - count_w - 3 : (w - count_w - 2) / 2);
					gr.SetSmoothingMode(2);
					gr.FillSolidRect(count_x, count_y, count_w + 2, count_h2, RGBA(0, 0, 0, 115));
					gr.GdiDrawText(count[0], lib.ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y, count_w, count_h, this.style.image != 2 ? lib.panel.rc : lib.panel.cc);
					gr.GdiDrawText(count[1], lib.ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y + count_h, count_w, count_h, this.style.image != 2 ? lib.panel.rc : lib.panel.cc);
					gr.SetSmoothingMode(0);
				} else {
					gr.SetSmoothingMode(2);
					gr.FillSolidRect(count_x, count_y, count_w + 2, count_h2, RGBA(0, 0, 0, 115));
					gr.GdiDrawText(count, lib.ui.font.tracks, RGB(255, 255, 255), count_x + 1, count_y, count_w, count_h, lib.panel.cc);
					gr.SetSmoothingMode(0);
				}
				break;
			}
			case 2: {
				if (!item.year) break;
				const year_w = Math.max(gr.CalcTextWidth(`${item.year} `, lib.ui.font.tracks), 8);
				const year_h = Math.max(gr.CalcTextHeight(item.year, lib.ui.font.tracks), 8);
				const year_x = x + (this.style.image != 2 ? 0 : (w - year_w - 2) / 2);
				const year_y = y + (this.style.image != 2 ? 0 : year_h / 1.67);
				gr.SetSmoothingMode(2);
				gr.FillSolidRect(year_x, year_y, year_w + 2, year_h, RGBA(0, 0, 0, 115));
				gr.GdiDrawText(item.year, lib.ui.font.tracks, RGB(255, 255, 255), year_x + 1, year_y, year_w, year_h, lib.panel.cc);
				gr.SetSmoothingMode(0);
				break;
			}
		}
	}

	drawSelBg(gr, cur_img, box_x, box_y, i, nowpOrSel) {
		if (this.labels.hide && (this.style.image != 2 || lib.pop.highlight.row == 3 && libSet.frameImage)) return;
		let x;
		let y;
		let w;
		let h;
		switch (true) {
			case nowpOrSel:
				// col = lib.ui.col.imgBgSel;
				switch (this.labels.overlay || this.labels.hide) {
					case true:
						x = box_x + Math.round((this.box.w - (cur_img ? cur_img.Width + 1 : this.im.w + 2)) / 2);
						y = box_y + (cur_img ? libSet.thumbNailGapCompact / 2 + this.im.w - cur_img.Height + 1 : libSet.thumbNailGapCompact / 2 + 2);
						w = cur_img ? cur_img.Width : this.im.w;
						h = cur_img ? cur_img.Height : this.im.w;
						break;
					case false:
						x = !this.labels.right ? box_x : lib.ui.x;
						y = box_y + (!this.labels.right ? 1 : 1);
						w = !this.labels.right ? this.box.w : lib.panel.tree.sel.w;
						h = this.box.h - 1;
						break;
				}
				break;
			case lib.pop.highlight.row == 2 && i == lib.pop.m.i:
				// col = lib.ui.col.bg_h;
				if ((this.labels.overlay || this.labels.hide) && this.style.image == 2) {
					x = box_x + Math.round((this.box.w - (cur_img ? cur_img.Width : this.im.w)) / 2);
					y = box_y + (cur_img ? this.im.w - cur_img.Height : 0);
					w = cur_img ? cur_img.Width : this.im.w;
					h = cur_img ? cur_img.Height : this.im.w;
				} else {
					x = !this.labels.right ? box_x : lib.ui.sz.pad;
					y = box_y + ((this.labels.overlay || this.labels.hide) ? 0 : (!this.labels.right ? 2 : 1));
					w = !this.labels.right ? this.box.w : lib.panel.tree.sel.w;
					h = this.box.h + ((this.labels.overlay || this.labels.hide) ? 2 : 0);
				}
				break;
		}

		x = this.labels.overlay ? box_x + Math.round((this.box.w - (cur_img ? cur_img.Width + 1 : this.im.w + 2)) / 2) : !this.labels.right ? box_x : lib.ui.x;
		y = this.labels.overlay ? box_y + (cur_img ? libSet.thumbNailGapCompact / 2 + this.im.w - cur_img.Height + 1 : libSet.thumbNailGapCompact / 2 + 2) : box_y + (!this.labels.right ? 1 : 1);
		const coversRight = grSet.libraryDesign === 'coversLabelsRight' || libSet.albumArtLabelType === 2;

		gr.FillSolidRect(x, coversRight ? y - 1 : y, w - (lib.sbar.w && coversRight ? SCALE(42) : 0), coversRight ? h + 2 : h, lib.ui.col.nowPlayingBg);

		if ((grSet.theme !== 'white' && grSet.theme !== 'black') && (!libSet.albumArtShow || libSet.albumArtShow && coversRight) ||
			(grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2) && libSet.albumArtShow && coversRight) {
			gr.FillSolidRect(x, y - 1, lib.ui.sz.sideMarker, h + 2, lib.ui.col.sideMarker);
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
		this.albumArtDiskCache = libSet.albumArtDiskCache;
		if (!this.albumArtDiskCache) return;
		const cacheFolder = this.cacheFolder;
		$Lib.buildPth(this.cachePath);
		this.saveSize = this.im.w > 500 ? 750 : this.im.w > 250 ? 500 : 250;
		this.interval = {
			cache: this.saveSize == 250 ? 1 : this.saveSize == 500 ? 4 : 9,
			preLoad: this.saveSize == 250 ? (libSet.albumArtLabelType != 3 ? 7 : 15) : this.saveSize == 500 ? 20 : 45
		}
		this.cacheFolder = `${this.cachePath + ['front', 'back', 'disc', 'icon', 'artist'][libSet.artId] + (this.saveSize == 250 ? '' : this.saveSize)}\\`;
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
		return nowp ? lib.ui.col.nowp : hover ? (lib.panel.textDiffHighlight ? lib.ui.col.nowp : lib.ui.col.text_h) : item.sel ? !this.labels.overlayDark ? lib.ui.col.textSel : lib.ui.col.text : !this.labels.overlayDark ? lib.ui.col.text : RGB(240, 240, 240);
	}

	getImages() {
		const extraRows = this.albumArtDiskCache ? lib.panel.rows * 2 : lib.panel.rows; // will load any extra including those after any preLoad

		if (!lib.panel.imgView) return;
		this.items = [];
		let begin = this.start == 0 ? libSet.rootNode ? 1 : 0 : this.start;
		const end = this.end != 0 ? Math.min(this.end + this.columns * extraRows, lib.pop.tree.length) : this.end;
		for (let i = begin; i < end; i++) {
			if (!lib.pop.tree[i]) continue;
			const key = lib.pop.tree[i].key;
			if (key && !this.cache[key]) {
				this.items.push({
					ix: i,
					handle: lib.pop.tree[i].handle,
					key
				});
			}
		}

		begin = Math.max(libSet.rootNode ? 1 : 0, begin - this.columns * extraRows);

		let i = end;
		while (i--) {
			if (i < begin) break;
			if (!lib.pop.tree[i]) continue;
			const key = lib.pop.tree[i].key;
			if (key && !this.cache[key]) {
				this.items.push({
					ix: i,
					handle: lib.pop.tree[i].handle,
					key
				});
			}
		}
		if (!this.items.length) return;

		let interval = !lib.sbar.bar.isDragging && !lib.sbar.touch.dn ? 5 : 50;
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
						if (v.handle) this.get_album_art_async(v.handle, libSet.artId, key, v.ix);
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
		if (!lib.pop.tree[i]) {
			return null;
		}
		const key = lib.pop.tree[i].key;
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
				if (lib.pop.tree.length <= lib.panel.rows * this.columns) {
					this.start = 0;
					this.end = lib.pop.tree.length;
				} else {
					this.start = Math.round(lib.sbar.delta / this.row.h) * this.columns;
					this.start = $Lib.clamp(this.start, 0, this.start - this.columns);
					this.end = Math.ceil((lib.sbar.delta + this.panel.h) / this.row.h) * this.columns;
					this.end = Math.min(this.end, lib.pop.tree.length);
				}
				break;
			case !this.style.vertical:
				if (lib.pop.tree.length <= lib.panel.rows) {
					this.start = 0;
					this.end = lib.pop.tree.length;
				} else {
					this.start = Math.round(lib.sbar.delta / this.blockWidth);
					this.end = Math.min(this.start + lib.panel.rows + 2, lib.pop.tree.length);
					this.start = $Lib.clamp(this.start, 0, this.start - 1);
				}
				break;
		}
		this.albumArtDiskCache ? (preLoad ? this.preLoad() : this.getImages()) : this.loadThrottle();
	}

	getLotCol(item, nowp, hover) {
		return nowp ? lib.ui.col.nowp : hover ? (lib.panel.textDiffHighlight ? lib.ui.col.nowp : lib.ui.col.text_h) : item.sel ? !this.labels.overlayDark ? lib.ui.col.selBlend : lib.ui.col.lotBlend : !this.labels.overlayDark ? lib.ui.col.lotBlend : RGB(220, 220, 220);
	}

	getMostFrequentField(arr) {
		const counts = arr.reduce((a, c) => {
			a[c] = (a[c] || 0) + 1;
			return a;
		}, {});
		const maxCount = Math.max(...Object.values(counts));
		const mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
		return lib.panel.grp[libSet.viewBy].type.includes(mostFrequent[0]) ? mostFrequent[0] : '';
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
		if (libSet.artId == 4) {
			if (libSet.curNoArtistImg == 0 || libSet.curNoArtistImg == 2 || this.style.image == 2) {
				this.shadowStub = $Lib.gr(sz, sz, true, g => g.FillEllipse(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
				this.shadowStub.StackBlur(4);
			} else if (libSet.curNoArtistImg != 4) {
				this.shadowStub = $Lib.gr(sz, sz, true, g => g.FillSolidRect(xy, xy, wh, wh, RGBA(0, 0, 0, 128)));
				this.shadowStub.StackBlur(5);
			} else {
				this.shadowStub = null;
			}
		} else if (libSet.curNoCoverImg > 2) {
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
		return nowp || item.sel ? this.albumArtShowLabels ? lib.ui.col.imgBgSel : lib.ui.col.imgOverlaySel : RGBA(0, 0, 0, 175);
	}

	getStyle() {
		switch (libSet.artId) {
			case 0:
				return libSet.imgStyleFront;
			case 1:
				return libSet.imgStyleBack;
			case 2:
				return libSet.imgStyleDisc;
			case 3:
				return libSet.imgStyleIcon;
			case 4:
				return libSet.imgStyleArtist;
		}
	}

	load() {
		const albumArtGrpNames = $Lib.jsonParse(libSet.albumArtGrpNames, {});
		const fields = [];
		const mod = lib.pop.tree.length < 1000 ? 1 : lib.pop.tree.length < 3500 ? Math.round(lib.pop.tree.length / 1000) : 3;
		const tf_d = FbTitleFormat('[$year(%date%)]');
		this.groupField = albumArtGrpNames[`${lib.panel.grp[libSet.viewBy].type.trim()}${lib.panel.lines}`];

		lib.pop.tree.forEach((v, i) => {
			const item = v.item[0].start;
			if (item >= lib.panel.list.Count) return;
			const handle = lib.panel.list[item];
			v.handle = handle;
			const arr = lib.pop.tree[i].name.split('^@^');
			v.grp = lib.panel.lines == 1 || !libSet.albumArtFlipLabels ? arr[0] : arr[1];
			v.lot = lib.panel.lines == 2 ? !libSet.albumArtFlipLabels ? arr[1] : arr[0] : '';
			v.key = libMD5.hashStr(handle.Path + handle.SubSong + (lib.panel.lines == 1 ? (arr[0] || 'Unknown') : (`${arr[0] || 'Unknown'} - ${arr[1] || 'Unknown'}`)) + libSet.artId);
			if (libSet.itemOverlayType == 2) v.year = tf_d.EvalWithMetadb(handle).replace('0000', '');
			if (!this.groupField && !lib.panel.folderView && i % mod === 0) this.getField(handle, lib.panel.lines == 1 || libSet.albumArtFlipLabels ? v.grp : v.lot, fields);
		});
		if (!this.groupField && !lib.panel.folderView) {
			this.groupField = this.getMostFrequentField(fields) || 'Item';
			this.groupField = $Lib.titlecase(this.groupField);
		}

		if (libSet.rootNode) {
			if (!lib.pop.tree[0]) return;
			if (!this.groupField) this.groupField = 'Item';
			const plurals = this.groupField.split(' ').map(v => pluralize(v));
			const pluralField = plurals.join(' ').replace(/(album|artist|top|track)s\s/gi, '$1 ').replace(/(similar artist)\s/gi, '$1s ').replace(/years - albums/gi, 'Year - Albums');
			lib.pop.tree[0].key = lib.pop.tree[0].name;
			const ln1 = lib.pop.tree.length - 1;
			const ln2 = lib.panel.list.Count;
			const nm = `${!libSet.showSource ? 'All' : lib.panel.sourceName} (${ln1}${ln1 > 1 ? ` ${pluralField}` : ` ${this.groupField}`})`;
			if (libSet.rootNode == 3) lib.pop.tree[0].grp = nm;
			else if (lib.panel.lines == 1) lib.pop.tree[0].grp = lib.panel.rootName + (libSet.nodeCounts ? ` (${libSet.nodeCounts == 2 && libSet.rootNode != 3 ? ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${this.groupField}`) : ln2 + (ln2 > 1 ? ' tracks' : ' track')})` : '');
			if (lib.panel.lines == 2) {
				if (libSet.rootNode != 3) lib.pop.tree[0].grp = lib.panel.rootName;
				lib.pop.tree[0].lot = libSet.nodeCounts == 2 && libSet.rootNode != 3 ? ln1 + (ln1 > 1 ? ` ${pluralField}` : ` ${this.groupField}`) : ln2 + (ln2 > 1 ? ' tracks' : ' track');
			}
		}
		this.metrics();
		lib.panel.treePaint();
	}

	memoryLimit() {
		if (!window.JsMemoryStats) return;
		const limit = !libSet.memoryLimit ? window.JsMemoryStats.TotalMemoryLimit * 0.5 : Math.min(libSet.memoryLimit * 1048576, window.JsMemoryStats.TotalMemoryLimit * 0.8);
		return window.JsMemoryStats.TotalMemoryUsage > limit;
	}

	metrics() {
		if (!lib.ui.w || !lib.ui.h) return;
		$Lib.gr(1, 1, false, g => {
			const lineSpacing = this.labels.hide || this.labels.overlay ? Math.max(libSet.verticalAlbumArtPad - 2, 0) : libSet.verticalAlbumArtPad;
			this.letter.w = Math.round(g.CalcTextWidth('W', lib.ui.font.main));
			this.text.h = Math.max(Math.round(g.CalcTextHeight('String', lib.ui.font.group)) + lineSpacing, Math.round(g.CalcTextHeight('String', lib.ui.font.lot)) + lineSpacing, 10);
		});
		this.style = {
			dropShadow: libSet.albumArtDropShadow && libSet.albumArtLabelType != 3,
			dropShadowStub: libSet.albumArtDropShadow && libSet.albumArtLabelType != 3 && (libSet.artId == 4 || libSet.curNoCoverImg > 2),
			image: this.getStyle(),
			rootComposite: libSet.rootNode && libSet.curRootImg == 3,
			vertical: !libSet.albumArtFlowMode ? true : lib.ui.h - lib.panel.search.h > lib.ui.w - lib.ui.sbar.w
		}

		this.style.dropGrad = libSet.albumArtDropShadow && !this.style.dropShadow;
		this.style.dropGradStub = libSet.albumArtDropShadow && !this.style.dropShadowStub;

		this.letter.show = libSet.albumArtLetter;
		this.letter.no = libSet.albumArtLetterNo;
		this.letter.albumArtYearAuto = libSet.albumArtYearAuto;

		switch (this.style.vertical) {
			case true: {
				this.labels = {
					hide: !libSet.albumArtLabelType,
					bottom: libSet.albumArtLabelType == 1 || libSet.albumArtFlowMode && libSet.albumArtLabelType == 2,
					right: !libSet.albumArtFlowMode ? libSet.albumArtLabelType == 2 : false,
					overlay: libSet.albumArtLabelType == 3 || libSet.albumArtLabelType == 4,
					overlayDark: libSet.albumArtLabelType == 4,
					flip: libSet.albumArtFlipLabels,
					statistics: libSet.itemShowStatistics ? 1 : 0
				};
				this.bor.pad = !this.labels.hide && !this.labels.overlay ? (libSet.thumbNailGapStnd == 0 ? Math.round(this.text.h * (!this.labels.right && grSet.libraryThumbnailSize !== 'playlist' ? 1.05 : 0.75)) : libSet.thumbNailGapStnd - Math.round(2 * $Lib.scale)) : libSet.thumbNailGapCompact;
				this.im.offset = Math.round(!this.labels.hide && !this.labels.overlay ? this.bor.pad / 2 : -2);

				if (this.labels.hide || this.labels.overlay) {
					this.panel.y = lib.panel.search.h + Math.round(this.bor.pad / 2);
					this.bor.bot = 0;
					this.bor.side = 0;
					this.bor.cov = libSet.thumbNailGapCompact;
				} else {
					this.panel.y = lib.panel.search.h;
					this.bor.cov = Math.round(this.bor.pad / 2);
					this.bor.side = Math.round(2 * $Lib.scale);
					this.bor.bot = this.bor.side * 2;
				}

				const margin = libSet.margin;
				this.panel.x = (libSet.sbarShow != 2 ? Math.max(margin, lib.ui.sbar.w) : margin) + lib.ui.l.w - SCALE(3);
				this.panel.w = lib.ui.w - lib.ui.l.w * 2 - (lib.ui.sbar.type == 0 || libSet.sbarShow != 2 ? Math.max(margin, lib.ui.sbar.w) * 2 + SCALE(20) : (margin * 2 + lib.ui.sbar.w) + SCALE(20));
				this.panel.h = lib.ui.h - this.panel.y;

				this.blockWidth = grSet.libraryThumbnailSize === 'playlist' ? pl.thumbnail_size + (this.bor.side * 2 + this.bor.cov * 2) :
					Math.round(lib.ui.row.h * 4 * $Lib.scale * libSet.zoomImg / 100 *
					[// Thumbnail size
						0.66,  // Mini
						1,     // Small
						1.5,   // Regular
						1.75,  // Medium
						2.5,   // Large
						3,     // XL
						3.5,   // XXL
						5      // MAX
					][libSet.thumbNailSize]);

				this.columns = libSet.albumArtFlowMode || this.labels.right ? 1 : Math.max(Math.floor(this.panel.w / this.blockWidth), 1);
				let gap = this.panel.w - this.columns * this.blockWidth;
				gap = Math.floor(gap / this.columns);
				this.columnWidth = !this.labels.right ? $Lib.clamp(this.blockWidth + (grSet.libraryThumbnailSize === 'playlist' ? 0 : gap), 10, Math.min(this.panel.w, this.panel.h)) : $Lib.clamp(this.blockWidth, 10, Math.min(this.panel.w, this.panel.h));
				this.overlayHeight = !this.labels.overlay ? 0 : (lib.panel.lines != 2 ? this.text.h * (1.2 + this.labels.statistics) : Math.round(this.text.h * (2.1 + this.labels.statistics)));
				this.im.w = Math.round(Math.max(this.columnWidth - this.bor.side * 2 - this.bor.cov * 2 - (this.labels.hide || this.labels.overlay ? 1 : 0), 10));

				if (this.labels.hide || this.labels.overlay) {
					this.im.w = Math.round(Math.max(this.columnWidth - this.bor.cov, 10));
					this.row.h = this.im.w + this.bor.cov;
				} else {
					this.im.w = Math.round(Math.max(this.columnWidth - this.bor.cov * 2 - this.bor.side * 2, 10));
					this.row.h = !this.labels.right ? this.im.w + this.text.h * (lib.panel.lines + this.labels.statistics) + this.bor.cov * 2 + this.bor.side * 2 : this.im.w + this.bor.pad + 2;
				}
				if (this.row.h > this.panel.h) {
					this.im.w -= this.row.h - this.panel.h;
					this.im.w = Math.max(this.im.w, 10);
					this.row.h = this.panel.h;
				}
				this.box.w = this.columnWidth - this.bor.side * 2;
				this.box.h = this.row.h - (!this.labels.right ? this.bor.side * 2 : 0);
				lib.panel.rows = Math.max(Math.floor(this.panel.h / this.row.h));
				lib.sbar.metrics(lib.sbar.x, lib.sbar.y, lib.sbar.w, lib.sbar.h, lib.panel.rows, this.row.h, this.style.vertical);
				lib.sbar.setRows(Math.ceil(lib.pop.tree.length / this.columns));
				break;
			}
			case false: { // only H-Flow
				this.labels = {
					hide: !libSet.albumArtLabelType,
					bottom: libSet.albumArtLabelType == 1 || libSet.albumArtLabelType == 2,
					right: false,
					overlay: libSet.albumArtLabelType == 3 || libSet.albumArtLabelType == 4,
					overlayDark: libSet.albumArtLabelType == 4,
					flip: libSet.albumArtFlipLabels,
					statistics: libSet.itemShowStatistics ? 1 : 0
				};
				this.bor.pad = !this.labels.hide && !this.labels.overlay ? (libSet.thumbNailGapStnd == 0 ? Math.round(this.text.h * 1.05) : libSet.thumbNailGapStnd - Math.round(2 * $Lib.scale)) : libSet.thumbNailGapCompact;
				this.im.offset = Math.round(!this.labels.hide && !this.labels.overlay ? this.bor.pad / 2 : -2);
				if (this.labels.hide || this.labels.overlay) {
					this.bor.bot = 0;
					this.bor.side = 0;
					this.bor.cov = libSet.thumbNailGapCompact;
				} else {
					this.bor.cov = Math.round(this.bor.pad / 2);
					this.bor.side = Math.round(2 * $Lib.scale);
					this.bor.bot = this.bor.side * 2;
				}
				this.panel.x = 0;
				const spacer = this.letter.show ? (this.labels.bottom ? this.text.h * 0.5 - this.bor.pad / 4 : this.text.h * 0.75) : (this.labels.bottom ? 0 : Math.round(this.bor.pad / 2));
				this.panel.y = lib.panel.search.h + spacer - SCALE(3);
				this.panel.h = lib.ui.h - this.panel.y - lib.ui.l.w * 3 - spacer - lib.ui.sbar.w - SCALE(34);

				this.panel.w = lib.ui.w;
				if (!this.labels.hide && !this.labels.overlay) {
					this.row.h = this.panel.h;
					const extra = this.text.h * (lib.panel.lines + this.labels.statistics) + this.bor.cov * 2 + this.bor.side * 2;
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
				this.overlayHeight = !this.labels.overlay ? 0 : (lib.panel.lines != 2 ? this.text.h * (1.2 + this.labels.statistics) : Math.round(this.text.h * (2.1 + this.labels.statistics)));
				this.box.w = this.blockWidth - this.bor.side * 2;
				this.box.h = this.row.h - this.bor.bot;
				lib.panel.rows = Math.max(Math.floor(this.panel.w / this.blockWidth));
				this.columnWidth = this.blockWidth;

				lib.sbar.metrics(lib.sbar.x, lib.sbar.y, lib.ui.w, lib.ui.sbar.w, lib.panel.rows, this.blockWidth, this.style.vertical);
				lib.sbar.setRows(Math.ceil(lib.pop.tree.length));
				break;
			}
		}

		this.cellWidth = Math.max(200, this.im.w / 2);
		this.labels.counts = libSet.itemOverlayType != 1 && libSet.nodeCounts;
		this.style.y = this.style.vertical ? Math.floor(this.panel.y + (!this.labels.hide && !this.labels.overlay ? libSet.thumbNailGapStnd / 2 : libSet.thumbNailGapCompact / 2)) : this.panel.y;
		if (this.style.dropShadow) this.getShadow();

		if (!this.labels.hide) {
			if (!this.labels.overlay) {
				this.text.x = !this.labels.right ? Math.round((this.box.w - this.im.w) / 2) : Math.max(Math.round((this.box.w - this.im.w) / 2), 5 * $Lib.scale) * 2 + this.im.w;
				this.text.y1 = !this.labels.right ? this.im.w + Math.round(this.bor.cov * 0.5) : Math.round((this.im.w - this.text.h * lib.panel.lines) / 2) - (this.labels.statistics ? this.text.h / 2 : 0);
				this.text.y2 = !this.labels.right ? Math.round(this.text.y1 + this.text.h * 0.95) : this.text.y1 + this.text.h;
				this.text.y3 = !this.labels.right ? Math.round(this.text.y2 + this.text.h * 0.95) : this.text.y2 + this.text.h;
				this.text.w = !this.labels.right ? this.im.w : this.panel.w - this.text.x - 12;
			} else {
				this.text.x = Math.round(10 + (libSet.thumbNailGapCompact - 3) / 2);
				this.text.y1 = Math.round(this.im.w - this.overlayHeight + 2 + (this.overlayHeight - this.text.h * (lib.panel.lines + this.labels.statistics)) / 2);
				this.text.w = this.box.w - 20 - libSet.thumbNailGapCompact - 6;
				libSet.thumbNailGapCompact = 22;
			}
		}

		this.cachesize.min = lib.panel.rows * this.columns * 3 + (this.albumArtDiskCache ? lib.panel.rows * 2 : lib.panel.rows) * this.columns * 2;
		this.createImages();
		this.getCurrentDatabase();
		if (libSet.albumArtPreLoad && !this.zooming && this.albumArtDiskCache) this.getItemsToDraw(true);
		this.setNoArtist();
		this.setNoCover();
		this.setRoot();
		if (this.style.rootComposite) this.checkRootImg();
		const stub = libSet.artId != 4 ? this.no_cover_img : this.no_artist_img;
		if (stub) this.stub.noImg = this.format(stub, libSet.artId, ['default', 'default', 'circular'][this.style.image], this.im.w, this.im.w, libSet.albumArtLabelType == 3, 'noImg');
		if (this.root_img) this.stub.root = this.format(this.root_img, libSet.artId, 'default', this.im.w, this.im.w, libSet.albumArtLabelType == 3, 'root');
		lib.panel.treePaint();
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
		this.zooming = lib.vk.k('zoom');
		if (this.zooming) {
			clearInterval(this.timer.preLoad);
			this.timer.preLoad = null;
		}
	}

	on_key_up() {
		if (this.zooming && this.zooming != lib.vk.k('zoom')) {
			this.zooming = false;
			if (libSet.albumArtPreLoad && this.albumArtDiskCache && lib.panel.imgView) this.metrics();
			lib.panel.treePaint();
		}
	}

	preLoad() {
		if (!lib.panel.imgView) return;
		this.preLoadItems = [];
		const begin = this.start == 0 ? libSet.rootNode ? 1 : 0 : this.start;
		const end = this.end != 0 ? Math.min(this.end + this.columns, lib.pop.tree.length) : this.end;
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

		const upBegin = this.start == 0 ? libSet.rootNode ? 1 : 0 : this.start - 1;
		const upEnd = libSet.rootNode ? 1 : 0;
		const downBegin = this.end != 0 ? Math.min(this.end + 1 + this.columns, lib.pop.tree.length) : this.end;
		const downEnd = lib.pop.tree.length;

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
			if (!libSet.albumArtDiskCache) return;
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
			const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', false, 'center', continue_confirmation) : true;
			if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
			return;
		}

		const allSelected = lib.pop.sel_items.length == fb.GetLibraryItems().Count;
		const base = this.cachePath + ['front', 'back', 'disc', 'icon', 'artist'][libSet.artId];
		const databases = [`${base}\\database.dat`, `${base}500\\database.dat`, `${base}750\\database.dat`];
		if (allSelected) {
			this.clearCache(); // full clear of working cache
			if (!libSet.albumArtDiskCache) return;
			this.database = this.newDatabase(); // full clear of databases for current image type
			databases.forEach(v => {
				if ($Lib.file(v)) $Lib.save(v, JSON.stringify(this.newDatabase(), null, 3), true);
			});
			return;
		}

		// refresh selected images
		items.Convert().forEach(v => {
			const item = lib.panel.list.Find(v);
			let ind = -1;
			lib.pop.tree.forEach((v, j) => {
				if (!v.root && lib.pop.inRange(item, v.item)) ind = j;
			});
			if (ind != -1) itemsToRemove.push(lib.pop.tree[ind].key);
		});
		itemsToRemove = [...new Set(itemsToRemove)];
		itemsToRemove.forEach(v => this.trimCache(v)); // clear working cache of selected keys: won't check if same images are used with other keys
		if (!libSet.albumArtDiskCache) return;
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
		this.artist_images = lib_my_utils.getImageAssets('noArtist').sort();
		libSet.curNoArtistImg = $Lib.clamp($Lib.value(libSet.curNoArtistImg, 0, 0), 0, this.artist_images.length - 1);
		const artistImages = this.artist_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: `file://${v.replace('noArtist', 'noArtist/small')}`
		}));
		this.no_artist_img = gdi.Image(this.artist_images[libSet.curNoArtistImg]);
		libSet.noArtistImages = JSON.stringify(artistImages);
	}

	setNoCover() {
		this.cover_images = lib_my_utils.getImageAssets('noCover').sort();
		libSet.curNoCoverImg = $Lib.clamp($Lib.value(libSet.curNoCoverImg, 0, 0), 0, this.cover_images.length - 1);
		const coverImages = this.cover_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: `file://${v.replace('noCover', 'noCover/small')}`
		}));
		this.no_cover_img = gdi.Image(this.cover_images[libSet.curNoCoverImg]);
		libSet.noCoverImages = JSON.stringify(coverImages);
	}

	setRoot() {
		this.root_images = lib_my_utils.getImageAssets('root').sort();
		libSet.curRootImg = $Lib.clamp($Lib.value(libSet.curRootImg, 0, 0), 0, this.root_images.length - 1);
		const rootImages = this.root_images.map(v => ({
			name: utils.SplitFilePath(v)[1],
			path: `file://${v.replace('root', 'root/small')}`
		}));
		if (libSet.rootNode && libSet.curRootImg == 3) {
			this.style.rootComposite = true;
			this.root_img = null;
		} else {
			this.style.rootComposite = false;
			this.root_img = gdi.Image(this.root_images[libSet.curRootImg]);
		}
		libSet.rootImages = JSON.stringify(rootImages);
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

/**
 * The instance of `LibImages` class for library image operations.
 * @typedef {LibImages}
 * @global
 */
const libImg = new LibImages();
