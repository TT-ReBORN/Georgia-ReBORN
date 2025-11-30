'use strict';

class BioImages {
	constructor() {
		this.artist = '';
		this.blur = null;
		this.counter = 0;
		this.cur = null;
		this.cur_artist = '';
		this.cur_handle = null;
		this.get = true;
		this.init = true;
		this.nh = 10;
		this.nw = 10;
		this.removed = 0;
		this.themed = null;
		this.x = 0;
		this.y = 0;
		this.exclArr = [6467, 6473, 6500, 24104, 24121, 34738, 29520, 35875, 37235, 47700, 52526, 68626, 86884, 92172];
		this.ext = ['.jpg', '.png', 'webp', '.gif', '.bmp', '.jpeg'];

		this.art = {
			allFilesLength: 0,
			checkArr: [],
			checkNo: 0,
			displayedOtherPanel: null,
			done: false,
			folder: '',
			folderSup: '',
			images: [],
			ix: 0,
			list: [],
			cusPhotoLocation: false,
			validate: []
		};

		this.blackList = {
			file: `${bioCfg.storageFolder}blacklist_image.json`,
			artist: '',
			cur: '',
			item: [],
			undo: []
		};

		this.bor = {
			w1: 0,
			w2: 0
		};

		this.cov = {
			counter: 0,
			cycle: bioSet.loadCovAllFb || bioSet.loadCovFolder,
			cycle_ix: 0,
			done: '',
			folder: '',
			folderSameAsArt: bioCfg.albCovFolder.toUpperCase() == bioCfg.pth.foImgArt.toUpperCase(),
			ix: 0,
			images: [],
			list: [],
			newBlur: false,
			blur: null,
			selection: $Bio.jsonParse(bioSet.loadCovSelFb, [0, 1, 2, 3, 4])
		};

		this.filter = {
			maxSz: 12582912,
			minSz: 51200,
			minPx: 500,
			minNo: 3,
			size: false
		};

		this.id = {
			albCounter: '',
			curAlbCounter: '',
			albCyc: '',
			curAlbCyc: '',
			album: '',
			curAlbum: '',
			artCounter: '',
			curArtCounter: '',
			blur: '',
			curBlur: '',
			img: '',
			curImg: '',
			w1: 0,
			w2: 0
		};

		this.im = {
			t: 0,
			r: 0,
			b: 0,
			l: 0,
			w: 100,
			h: 100
		};

		this.mask = {
			circular: null,
			fade: null,
			reflection: null,
			reset: false
		};

		bioSet.reflStrength = $Bio.clamp(bioSet.reflStrength, 0, 100);
		bioSet.reflGradient = $Bio.clamp(bioSet.reflGradient, 0, 100);
		bioSet.reflSize = $Bio.clamp(bioSet.reflSize, 0, 100);

		this.refl = {
			adjust: false,
			gradient: bioSet.reflGradient / 10 - 1,
			size: $Bio.clamp(bioSet.reflSize / 100, 0.1, 1),
			strength: $Bio.clamp(255 * bioSet.reflStrength / 100, 0, 255)
		};

		this.stub = {
			0: {
				panel: false,
				path: '',
				user: null
			},
			1: {
				panel: false,
				path: '',
				user: null
			},
			2: {
				path: '',
				user: null
			},
			3: {
				panel: false,
				path: '',
				user: null
			},
			4: {
				panel: false,
				path: '',
				user: null
			},
			art: {
				file: `${bioCfg.storageFolder}artist_stub_user.png`,
				folder: `${bioCfg.storageFolder}artist_stub_user`,
				path: '',
				user: null
			},
			cov: {
				file: `${bioCfg.storageFolder}front_cover_stub_user.png`,
				folder: `${bioCfg.storageFolder}front_cover_stub_user`,
				path: '',
				user: null
			},
			default: []
		};

		this.style = {
			alpha: 255,
			blur: null,
			circular: false,
			crop: false,
			border: 0,
			delay: Math.min(bioSet.cycTimePic, 7) * 1000,
			fade: false,
			horizontal: true,
			overlay: false,
			reflection: false,
			vertical: false
		};

		this.timeStamp = {
			cov: Date.now(),
			photo: Date.now()
		};

		this.touch = {
			dn: false,
			end: 0,
			start: 0
		};

		this.transition = {
			level: $Bio.clamp(100 - bioSet.transLevel, 0.1, 100)
		};

		this.transition.incr = Math.pow(284.2171 / this.transition.level, 0.0625);
		if (this.transition.level == 100) this.transition.level = 255;
		this.cycImages = this.cov.folderSameAsArt ? this.artImages : v => {
			if (!$Bio.file(v)) return false;
			return Regex.ArtImageExtensions.test(bioFSO.GetExtensionName(v));
		};

		['Front', 'Back', 'Disc', 'Icon', 'Art'].forEach((v, i) => {
			const f = bioCfg.expandPath(bioSet[`panel${v}Stub`]);
			if ($Bio.file(f)) {
				this.stub[i].panel = true;
				this.stub[i].path = f;
				this.stub[i].user = gdi.Image(this.stub[i].path);
			}
		});

		for (let i = 0; i < 5; i++) {
			if (!this.stub[i].user) {
				const pth = i != 4 ? 'cov' : 'art';
				this.ext.some(v => {
					this.stub[i].path = this.stub[pth].folder + v;
					if ($Bio.file(this.stub[i].path)) {
						this.stub[i].user = gdi.Image(this.stub[i].path);
						return true;
					}
				});
			}
		}

		this.setCov = $Bio.debounce(() => {
			bio.filmStrip.logScrollPos();
			if (this.cov.ix < 0) this.cov.ix = this.cov.images.length - 1;
			else if (this.cov.ix >= this.cov.images.length) this.cov.ix = 0;
			this.cov.cycle_ix = this.cov.ix;
			const key = this.cov.images[this.cov.ix];
			this.loadImg(bioCov, key, true, this.cov.ix, this.isEmbedded('stnd', this.cov.ix));
			this.timeStamp.cov = Date.now();
		}, 100);

		this.setPhoto = $Bio.debounce(() => {
			bio.filmStrip.logScrollPos();
			if (this.art.ix < 0) this.art.ix = this.art.images.length - 1;
			else if (this.art.ix >= this.art.images.length) this.art.ix = 0;
			this.loadArtImage();
			this.timeStamp.photo = Date.now();
		}, 100);

		this.createImages();
		if (bioSet.img_only) this.setCrop(true);
		this.processSizeFilter();

		this.cov.selFiltered = this.cov.selection.filter(v => v != -1);
	}

	// * METHODS * //

	artImages(v) {
		if (!$Bio.file(v)) return false;
		const fileSize = utils.GetFileSize(v);
		return (bio.name.isLfmImg(bioFSO.GetFileName(v)) || !bioSet.imgFilterLfm && Regex.ArtImageExtensions.test(bioFSO.GetExtensionName(v)) && !Regex.TextDashPadded.test(bioFSO.GetBaseName(v))) && !this.exclArr.includes(fileSize) && !this.blackListed(v);
	}

	artistReset(force) {
		if (bio.panel.lock) return;
		this.blurCheck();
		this.cur_artist = this.artist;
		this.artist = bio.name.artist(bio.panel.id.focus);
		const new_artist = this.artist && this.artist != this.cur_artist || !this.artist || bioSet.covBlur && bio.ui.style.isBlur && this.id.blur != this.id.curBlur || force;
		if (new_artist) {
			this.art.folderSup = '';
			let files = [];
			if (bioSet.cycPhotoLocation == 1) {
				this.art.folder = !bio.panel.isRadio(bio.panel.id.focus) ? bio.panel.cleanPth(bioCfg.artCusImgFolder, bio.panel.id.focus) : bio.panel.cleanPth(bioCfg.remap.foCycPhoto, bio.panel.id.focus, 'remap', this.artist, '', 1);
				files = utils.Glob(`${this.art.folder}*`);
			}
			if (files.length && files.some(v => Regex.ArtImageExtensions.test(bioFSO.GetExtensionName(v)))) {
				this.art.cusPhotoLocation = true;
			} else {
				this.art.folder = !bio.panel.isRadio(bio.panel.id.focus) ? bio.panel.cleanPth(bioCfg.pth.foImgArt, bio.panel.id.focus) : bio.panel.cleanPth(bioCfg.remap.foImgArt, bio.panel.id.focus, 'remap', this.artist, '', 1);
				this.art.cusPhotoLocation = false;
			}
			this.clearArtCache(true);
			if (bioSet.cycPhoto) this.art.done = false;
			if (!this.art.images.length) {
				this.art.allFilesLength = 0;
				this.art.ix = 0;
			}
		}
	}

	async load_image_async(image_path) {
		const image = await gdi.LoadImageAsyncV2(0, image_path);
		const caller = this.getCallerId(image_path);
		if (caller.art_id === this.art.ix) {
			if (!image) {
				this.art.images.splice(this.art.ix, 1);
				if (this.art.images.length > 1) this.changePhoto(1);
				bio.filmStrip.check('imgUpd');
				return;
			}
			this.processArtImg(image, image_path);
		}
	}

	blacklist(clean_artist) {
		const black_list = [];
		if (!$Bio.file(this.blackList.file)) return black_list;
		const list = $Bio.jsonParse(this.blackList.file, false, 'file');
		return list.blacklist[clean_artist] || black_list;
	}

	blackListed(v) {
		bio.img.blackList.cur = this.blackList.artist;
		this.blackList.artist = this.artist || bio.name.artist(bio.panel.id.focus);
		if (this.blackList.artist && this.blackList.artist != bio.img.blackList.cur) {
			bio.img.blackList.item = this.blacklist($Bio.clean(this.blackList.artist).toLowerCase());
		}
		return bio.img.blackList.item.includes(v.slice(v.lastIndexOf('_') + 1));
	}

	blurCheck() {
		if (!(bioSet.covBlur && bio.ui.style.isBlur) && !bioSet.imgSmoothTrans || bioSet.themed) return;
		this.id.curBlur = this.id.blur;
		this.id.blur = bio.name.albID(bio.panel.id.focus, 'stnd');
		this.id.blur += bioSet.covType;
		if (this.id.blur != this.id.curBlur) {
			this.cov.newBlur = true;
			bio.txt.rev.lookUp = false;
		}
	}

	blurImage(image, o) {
		if (!image || !bio.panel.w || !bio.panel.h) return;
		if (this.covBlur() && this.cov.newBlur) {
			let handle = null;
			this.cov.blur = null;
			if (bioCfg.cusCov && !bioSet.covType) {
				this.chkPths(bioCfg.cusCovPaths, '', 1, true);
			}
			if (!this.cov.blur) {
				handle = $Bio.handle(bio.panel.id.focus);
				if (handle) this.cov.blur = utils.GetAlbumArtV2(handle, bioSet.covType, !!bioSet.covType);
			}
			if (!this.cov.blur && !bioSet.covType) {
				const pth_cov = bio.panel.getPth('cov', bio.panel.id.focus).pth;
				this.ext.some(v => {
					if ($Bio.file(pth_cov + v)) {
						this.cov.blur = gdi.Image(pth_cov + v);
						return true;
					}
				});
			}
			if (!this.cov.blur && !bioSet.covType) {
				const a = bio.name.albumArtist(bio.panel.id.focus);
				const l = bio.name.album(bio.panel.id.focus);
				const pth_cov = [bio.panel.getPth('cov', bio.panel.id.focus).pth, bio.panel.getPth('img', bio.panel.id.focus, a, l).pth];
				this.chkPths(pth_cov, '', 1);
			}
			if (!this.cov.blur && !bioSet.covType && handle) this.cov.blur = utils.GetAlbumArtV2(handle, 0);
			if (!this.cov.blur) this.cov.blur = this.stub.default[0].Clone(0, 0, this.stub.default[0].Width, this.stub.default[0].Height);
			this.cov.newBlur = false;
			if (this.cov.blur && !bioSet.blurAutofill) this.cov.blur = this.cov.blur.Resize(bio.panel.w, bio.panel.h);
		}
		if (this.covBlur() && this.cov.blur) image = this.cov.blur.Clone(0, 0, this.cov.blur.Width, this.cov.blur.Height); // clone to stop blurring same img more than once
		image = bioSet.blurAutofill ? this.format(image, 1, 'crop', bio.panel.w, bio.panel.h, 'blurAutofill', o) : this.format(image, 1, 'stretch', bio.panel.w, bio.panel.h, 'blurStretch', o);
		const i = $Bio.gr(bio.panel.w, bio.panel.h, true, (g, gi) => {
			g.SetInterpolationMode(0);
			if (bio.ui.blur.blend) {
				if (bioSet.blurTemp) {
					const iSmall = image.Resize(Math.max(bio.panel.w * bio.ui.blur.level / 100, 1), Math.max(bio.panel.h * bio.ui.blur.level / 100, 2, 1), 2);
					const iFull = iSmall.Resize(bio.panel.w, bio.panel.h, 2);
					const offset = 90 - bio.ui.blur.level;
					g.DrawImage(iFull, bio.ui.x - offset, bio.ui.y - SCALE(40), bio.panel.w + offset * 2, bio.panel.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, bio.ui.blur.blendAlpha);
				} else g.DrawImage(image, bio.ui.x, bio.ui.y - SCALE(40), bio.panel.w, bio.panel.h, 0, 0, image.Width, image.Height, 0, bio.ui.blur.blendAlpha); // no blur
			} else {
				if (bioSet.theme == 1 || bioSet.theme == 3) {
					g.DrawImage(image, bio.ui.x, bio.ui.y - SCALE(40), bio.panel.w, bio.panel.h, 0, 0, image.Width, image.Height);
					if (bio.ui.blur.level > 1) gi.StackBlur(bio.ui.blur.level);
					g.FillSolidRect(bio.ui.x, bio.ui.y - SCALE(40), bio.panel.w, bio.panel.h, this.isImageLight(gi) ? bio.ui.col.bg_light : bio.ui.col.bg_dark);
				}
				if (bioSet.theme == 4) {
					g.FillSolidRect(bio.ui.x, bio.ui.y - SCALE(40), bio.panel.w, bio.panel.h, this.getRandomCol());
					g.DrawImage(image, bio.ui.x, bio.ui.y - SCALE(40), bio.panel.w, bio.panel.h, 0, 0, image.Width, image.Height, 0, this.getImgAlpha(image));
					if (bio.ui.blur.level > 1) gi.StackBlur(bio.ui.blur.level);
				}
			}
		});
		return i;
	}

	cache() {
		return bioSet.artistView ? bioArt : bioCov;
	}

	changeCov(incr) {
		bio.filmStrip.logScrollPos();
		this.cov.cycle_ix += incr;
		if (this.cov.cycle_ix < 0) this.cov.cycle_ix = this.cov.images.length - 1;
		else if (this.cov.cycle_ix >= this.cov.images.length) this.cov.cycle_ix = 0;
		this.cov.ix = this.cov.cycle_ix;
		const key = this.cov.images[this.cov.ix];
		this.loadImg(bioCov, key, true, this.cov.ix, this.isEmbedded('stnd', this.cov.ix));
	}

	changePhoto(incr) {
		bio.filmStrip.logScrollPos();
		this.art.ix += incr;
		if (this.art.ix < 0) this.art.ix = this.art.images.length - 1;
		else if (this.art.ix >= this.art.images.length) this.art.ix = 0;
		let i = 0;
		while (this.art.displayedOtherPanel == this.art.images[this.art.ix] && i < this.art.images.length) {
			this.art.ix += incr;
			if (this.art.ix < 0) this.art.ix = this.art.images.length - 1;
			else if (this.art.ix >= this.art.images.length) this.art.ix = 0;
			i++;
		}
		this.setCheckArr(this.art.images[this.art.ix]);
		this.loadArtImage();
	}

	check() {
		bio.filmStrip.logScrollPos();
		this.id.albCyc = '';
		this.id.curAlbCyc = '';
		this.clearArtCache(true);
		if (bio.panel.stndItem()) {
			this.art.done = false;
			if (!this.art.images.length) {
				this.art.allFilesLength = 0;
				this.art.ix = 0;
			}
			if (bioSet.artistView && bioSet.cycPhoto) this.getArtImg();
			else this.getFbImg();
		} else this.getItem(bio.panel.art.ix, bio.panel.alb.ix, true);
	}

	checkArr(info) {
		if (bio.panel.block()) return;
		if (this.art.images.length < 2 || !bioSet.artistView || bioSet.text_only || !bioSet.cycPhoto) return;
		if (!this.art.validate.includes(info[0])) this.art.validate.push(info[0]);
		this.art.displayedOtherPanel = info[1];
		if (!this.id.w1) this.id.w1 = info[0];
		this.id.w2 = (this.id.w1 == info[0]) ? 0 : info[0];
		if (this.art.images[this.art.ix] != info[2] && !this.id.w2 && this.art.checkNo < 10) {
			this.art.checkNo++;
			this.art.checkArr = [window.ID, this.art.images[this.art.ix], this.art.displayedOtherPanel];
			window.NotifyOthers('bio_checkImgArr', this.art.checkArr);
		}
		if (window.ID > info[0]) return;
		if (this.art.images[this.art.ix] == this.art.displayedOtherPanel && this.art.validate.length < 2) this.changePhoto(1);
	}

	checkUserStub(type, handle) {
		switch (type) {
			case 'art': {
				if (this.stub[4].user) break;
				const stubArtUser = utils.GetAlbumArtV2(handle, 4);
				if (stubArtUser) stubArtUser.SaveAs(this.stub.art.file);
				if ($Bio.file(this.stub.art.file)) {
					this.stub[4].user = gdi.Image(this.stub.art.file);
					this.stub[4].path = this.stub.art.file;
				}
				break;
			}
			case 'cov': {
				if (this.stub[0].user) break;
				const stubCovUser = utils.GetAlbumArtV2(handle, 0);
				if (stubCovUser) stubCovUser.SaveAs(this.stub.cov.file);
				if ($Bio.file(this.stub.cov.file)) {
					this.stub[0].user = gdi.Image(this.stub.cov.file);
					this.stub[0].path = this.stub.cov.file;
				}
				break;
			}
		}
	}

	chkPths(pths, fn, type, cusCovPaths) {
		let h = false;
		pths.some(v => {
			if (h) return true;
			const ph = !cusCovPaths ? v + fn : $Bio.eval(v + fn, bio.panel.id.focus);
			this.ext.some(w => {
				const ep = ph + w;
				if ($Bio.file(ep)) {
					h = true;
					switch (type) {
						case 0:
							this.loadImg(bioCov, ep, true, this.cov.ix);
							return true;
						case 1:
							this.cov.blur = gdi.Image(ep);
							return true;
						case 2:
							return true;
						case 3:
							h = ep;
							return true;
					}
				}
			});
		});
		return h;
	}

	circularMask(image, tw, th) {
		image.ApplyMask(this.mask.circular.Resize(tw, th));
	}

	clearArtCache(fullClear) {
		if (fullClear) {
			this.art.images = [];
			this.art.validate = [];
			this.art.checkNo = 0;
		}
		bioArt.cache = {};
	}

	clearCovCache() {
		bioCov.cache = {};
	}

	clearCache() {
		this.clearCovCache();
		this.clearArtCache();
	}

	covBlur() {
		return bioSet.covBlur && bio.ui.style.isBlur && (bioSet.artistView || this.cov.cycle || bioSet.text_only || bio.panel.alb.ix);
	}

	createImages() {
		const bg = this.isType('AnyBorShadow') || !bio.ui.blur.dark && !bio.ui.blur.light;
		const cc = StringFormat(1, 1);
		const font1 = gdi.Font(grFont.fontDefault, 184, 1);
		const font2 = gdi.Font(grFont.fontDefault, 80, 1);
		const font3 = gdi.Font(grFont.fontDefault, 200, 1);
		const font4 = gdi.Font(grFont.fontDefault, 90, 1);
		const tcol = !bg ? bio.ui.col.text : bio.ui.col.noPhotoStubText;
		const sz = 600;
		for (let i = 0; i < 3; i++) {
			this.stub.default[i] = $Bio.gr(sz, sz, true, g => {
				g.SetSmoothingMode(2);
				if (bg) {
					g.FillSolidRect(0, 0, sz, sz, tcol);
					g.FillSolidRect(-1, 0, sz + 5, sz, bio.ui.col.noPhotoStubBg);
				}
				g.SetTextRenderingHint(3);
				g.DrawString('NO', i == 2 ? font3 : font1, tcol, 0, 0, sz, sz * 275 / 500, cc);
				g.DrawString(['COVER', 'PHOTO', 'SELECTION'][i], i == 2 ? font4 : font2, tcol, 0, sz * 108 / 500, sz, sz * 275 / 500, cc);
				g.FillSolidRect((sz - 380) / 2, sz * 400 / 500, 380, 20, tcol & 0x15ffffff);
			});
			this.mask.circular = $Bio.gr(500, 500, true, g => {
				g.FillSolidRect(0, 0, 500, 500, RGB(255, 255, 255));
				g.SetSmoothingMode(2);
				g.FillEllipse(1, 1, 498, 498, RGBA(0, 0, 0, 255));
			});
		}
		this.get = true;
	}

	cur_pth() {
		return this.cache().pth;
	}

	draw(gr) {
		if (bioSync.get && bioSync.img) {
			bioSync.image(bioSync.img.image, bioSync.img.id);
			bioSync.get = false;
		}
		if (bioSet.text_only && !bio.ui.style.isBlur) {
			if (bioSet.showFilmStrip && this.get) this.getImgFallback();
			return;
		}
		if (bio.ui.style.isBlur) {
			const bImg = !this.themed ? this.blur : this.themed;
			if (bImg) gr.DrawImage(bImg, bio.ui.x, bio.ui.y, bio.panel.w, bio.panel.h, 0, 0, bImg.Width, bImg.Height);
		}
		if (this.get) return this.getImgFallback();
		if (!bioSet.text_only && this.cur) {
			gr.DrawImage(this.cur, this.x - (bioSet.img_only ? SCALE(2) : 0), bioSet.img_only ? grm.ui.topMenuHeight + bio.ui.h * 0.5 - this.cur.Height * 0.5 : grm.ui.topMenuHeight + this.y, this.cur.Width + (bioSet.img_only ? SCALE(4) : 0), this.cur.Height, 0, 0, this.cur.Width, this.cur.Height, 0, this.style.alpha);
		}
	}

	fadeMask(image, x, y, w, h) {
		const xl = Math.max(0, bio.panel.tbox.l - x);
		let f = Math.min(w, bio.panel.tbox.l - x + bio.panel.tbox.w);
		this.refl.adjust = false;
		if (xl >= f) return image;
		// const wl = f - xl;
		const yl = Math.max(0, bio.panel.tbox.t - y);
		f = Math.min(h, bio.panel.tbox.t - y + bio.ui.y + bio.panel.tbox.h);
		if (yl >= f) return image;
		const hl = f - yl;
		if (!this.mask.fade || this.mask.reset) {
			const km = bio.ui.overlay.gradient != -1 && bio.panel.img.t <= bio.panel.text.t - bio.ui.heading.h ? bio.ui.overlay.strength / 500 + bio.ui.overlay.gradient / 10 : 0;
			this.mask.fade = $Bio.gr(500, 500, true, g => {
				for (let k = 0; k < 500; k++) {
					const c = 255 - $Bio.clamp(bio.ui.overlay.strength - k * km, 0, 255);
					g.FillSolidRect(0, k, 500, 1, RGB(c, c, c));
				}
			});
			this.mask.reset = false;
			if (bioSet.style == 4 && bio.panel.style.showFilmStrip) {
				const rotate = [2, 3, 0, 1][bioSet.filmStripPos];
				this.mask.fade.RotateFlip(rotate);
			}
		}
		const mask = $Bio.gr(w, h, true, g => g.DrawImage(this.mask.fade, bio.ui.x, yl, bio.ui.w, hl, 0, 0, this.mask.fade.Width, this.mask.fade.Height));
		image.ApplyMask(mask);
	}

	filmOK(newArr) {
		return newArr && this.art.list.length && bioSet.showFilmStrip && bio.filmStrip.scroll.pos.art[this.artist] && bio.filmStrip.scroll.pos.art[this.artist].arr && bio.filmStrip.scroll.pos.art[this.artist].arr.length;
	}

	forceStnd() {
		const n = bioSet.artistView ? 'bio' : 'rev';
		return !bioSet.sourceAll && bio.txt[n].loaded.txt && (bio.txt.reader[n].props || bio.txt.reader[n].lyrics) && (bioSet.artistView && bio.panel.art.ix || !bioSet.artistView && bio.panel.alb.ix);
	}

	format(image, n, type, w, h, caller, o, blur, border, fade, reflection) {
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
				if (caller == 'blurAutofill') return image;
				if (type == 'circular') this.circularMask(image, image.Width, image.Height);
				if (!border) image = image.Resize(w, h, 2);
				if (caller == 'filmStrip') return image;
				break;
			}
			case 'stretch':
				image = image.Resize(w, h, 2);
				if (caller == 'blurStretch') return image;
				break;
			default: {
				const sc = Math.min(h / ih, w / iw);
				this.im.w = Math.round(iw * sc);
				this.im.h = Math.round(ih * sc);
				if (!border) image = image.Resize(this.im.w, this.im.h, 2);
				if (caller != 'img') return image;
				break;
			}
		}

		this.setAlignment();

		if (border) image = this.getBorder(image, this.im.w, this.im.h, this.bor.w1, this.bor.w2);
		if (fade) this.fadeMask(image, this.im.l, this.im.t, image.Width, image.Height);
		o.x = o.counter_x = bio.seeker.counter.x = this.x = this.im.l;
		o.y = o.counter_y = bio.seeker.counter.y = this.y = this.im.t;
		o.w = this.im.w;
		o.h = this.im.h;
		if (reflection) image = this.reflImage(image, this.im.l, this.im.t, image.Width, image.Height, o);
		if (blur) {
			o.blur = this.blurImage(blur, o);
			this.blur = o.blur;
		}
		return image;
	}

	fresh() {
		this.counter++;
		if (this.counter < bioSet.cycTimePic || bio.panel.id.lyricsSource && bio.lyrics.display() && bio.lyrics.scroll) return;
		this.counter = 0;
		if (bio.panel.block() || !bioSet.cycPic || bioSet.text_only || bio.seeker.dn || bio.panel.zoom()) return;
		if (bioSet.artistView) {
			if (this.art.images.length < 2 || Date.now() - this.timeStamp.photo < this.style.delay || !bioSet.cycPhoto) return;
			this.changePhoto(1);
		} else if (this.cov.cycle) {
			if (this.cov.images.length < 2 || Date.now() - this.timeStamp.cov < this.style.delay || bio.panel.alb.ix) return;
			this.changeCov(1);
		}
	}

	getImgAlpha(image) {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15));
		let rTot = 0;
		let gTot = 0;
		let bTot = 0;
		let freqTot = 0;
		colorSchemeArray.forEach(v => {
			const col = $Bio.toRGB(v.col);
			rTot += col[0] ** 2 * v.freq;
			gTot += col[1] ** 2 * v.freq;
			bTot += col[2] ** 2 * v.freq;
			freqTot += v.freq;
		});
		const avgCol = ($Bio.clamp(Math.round(Math.sqrt(rTot / freqTot)), 0, 255) + $Bio.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0, 255) + $Bio.clamp(Math.round(Math.sqrt(bTot / freqTot)), 0, 255)) / 3;
		return $Bio.clamp(avgCol * -0.32 +  128, 64, 128);
	}

	getArtImages() {
		let allFiles = this.art.folder ? utils.Glob(`${this.art.folder}*`) : [];
		if (!allFiles.length && this.art.folderSup) allFiles = utils.Glob(`${this.art.folderSup}*`);
		if (allFiles.length == this.art.allFilesLength) return;
		let newArr = false;
		if (!this.art.images.length) {
			newArr = true;
			bioArt.cache = {};
		}
		this.art.allFilesLength = allFiles.length;
		this.removed = 0;
		this.art.list = allFiles.filter(this.images.bind(this));
		if (this.filmOK(newArr)) {
			if ($Bio.equal(this.art.list, bio.filmStrip.scroll.pos.art[this.artist].images)) {
				this.art.images = bio.filmStrip.scroll.pos.art[this.artist].arr;
				this.art.ix = bio.filmStrip.scroll.pos.art[this.artist].ix || 0;
				return;
			}
		} else bio.filmStrip.logScrollPos(this.art.list);
		let arr = this.art.list.slice();
		if (this.filter.size) arr = arr.filter(this.sizeFilter.bind(this));
		this.art.images = this.art.images.concat(arr);
		if (this.art.images.length > 1) {
			this.art.images = this.uniq(this.art.images);
			if (newArr) this.art.images = $Bio.shuffle(this.art.images);
		}
		if (!newArr) bio.seeker.upd();
		bio.filmStrip.check(newArr);
	}

	getArtImg(update, bypass) {
		if (!bioSet.artistView || bioSet.text_only && !bio.ui.style.isBlur && !bioSet.showFilmStrip) return;
		if (!bypass && (bio.panel.id.lyricsSource || bio.panel.id.nowplayingSource || bio.panel.id.propsSource)) {
			this.getItem(bio.panel.art.ix, bio.panel.alb.ix);
			this.init = false;
		}
		if (!this.art.done || update) {
			this.art.done = true;
			if (this.artist) this.getArtImages();
		}
		this.setCheckArr(bioSet.cycPhoto ? this.art.images[this.art.ix] : null);
		this.loadArtImage();
	}

	getBorder(image, w, h, bor_w1, bor_w2) {
		const imgo = 7;
		const dpiCorr = ($Bio.scale - 1) * imgo;
		const imb = imgo - dpiCorr;
		let imgb = 0;
		let sh_img = null;
		if (this.style.border > 1 && !this.style.reflection) {
			imgb = 15 + dpiCorr;
			sh_img = $Bio.gr(Math.floor(w + bor_w2 + imb), Math.floor(h + bor_w2 + imb), true, g => !this.style.circular ? g.FillSolidRect(imgo, imgo, w + bor_w2 - imgb, h + bor_w2 - imgb, RGBA(0, 0, 0, 185)) : g.FillEllipse(imgo, imgo, w + bor_w2 - imgb, h + bor_w2 - imgb, RGBA(0, 0, 0, 185)));
			sh_img.StackBlur(12);
		}
		const bor_img = $Bio.gr(Math.floor(w + bor_w2 + imgb), Math.floor(h + bor_w2 + imgb), true, g => {
			if (this.style.border > 1 && !this.style.reflection) g.DrawImage(sh_img, 0, 0, Math.floor(w + bor_w2 + imgb), Math.floor(h + bor_w2 + imgb), 0, 0, sh_img.Width, sh_img.Height);
			if (this.style.border == 1 || this.style.border == 3) {
				if (!this.style.circular) g.FillSolidRect(0, 0, w + bor_w2, h + bor_w2, !bioSet.highlightImgBor ? RGB(255, 255, 255) : bio.ui.col.text_h);
				else {
					g.SetSmoothingMode(2);
					g.FillEllipse(0, 0, w + bor_w2, h + bor_w2, !bioSet.highlightImgBor ? RGB(255, 255, 255) : bio.ui.col.text_h);
				}
			}
			g.DrawImage(image, bor_w1, bor_w1, w, h, 0, 0, image.Width, image.Height);
		});
		sh_img = null;
		return bor_img;
	}

	getCallerId(key) {
		const a = bioArt.cache[key];
		const c = bioCov.cache[key];
		return {
			art_id: a && a.id,
			cov_id: c && c.id
		};
	}

	getCovImages() {
		if (bioSet.artistView || !this.cov.cycle || bio.panel.alb.ix) return false;
		if (!bio.panel.lock) this.setAlbID();
		const new_album = this.id.albCyc != this.id.curAlbCyc || !this.id.albCyc;
		if (bioSet.loadCovFolder && !bio.panel.lock) this.cov.folder = bio.panel.cleanPth(bioCfg.albCovFolder, bio.panel.id.focus);
		if (new_album) {
			this.clearCovCache();
			this.cov.counter = 0;
			this.cov.list = [];
			this.cov.images = [];
			bio.cov_scroller.reset();
			bio.filmStrip.scroll.pos.cov = {};
			this.cov.ix = this.cov.cycle_ix = 0;
			if (bioSet.loadCovFolder) {
				this.cov.images = this.cov.folder ? utils.Glob(`${this.cov.folder}*`) : [];
				this.removed = 0;
				this.cov.images = this.cov.images.filter(this.cycImages.bind(this));
				if (this.cov.folderSameAsArt) {
					if (this.filter.size) this.cov.images = this.cov.images.filter(this.sizeFilter.bind(this));
					this.cov.images = $Bio.shuffle(this.cov.images);
				}
				for (let i = 0; i < this.cov.images.length; i++) {
					this.cov.list[i + 10] = {};
					this.cov.list[i + 10].id = i + 10;
					this.cov.list[i + 10].pth = this.cov.images[i];
				}
				this.cov.list = this.cov.list.filter(Boolean);
				this.cov.images = this.cov.list.map(v => v.pth);
				bio.filmStrip.check();
			}
			if (bioSet.loadCovAllFb) {
				const handle = $Bio.handle(bio.panel.id.focus);
				if (handle) this.cov.selFiltered.forEach(v => this.getImg(handle, v, false));
				else if (!bioSet.loadCovFolder || !this.cov.images.length) return false;
			}
		}
		if (!new_album || !bioSet.loadCovAllFb) {
			const key = this.cov.images[this.cov.ix];
			if (!key) return false;
			this.loadImg(bioCov, key, true, this.cov.ix, this.isEmbedded('stnd', this.cov.ix));
		}
		return true;
	}

	getFbImg() {
		if (bioSet.artistView && this.art.images.length && bioSet.cycPhoto) return;
		const forceStnd = this.forceStnd();
		this.cov.ix = this.cov.cycle && !bio.panel.alb.ix ? this.cov.cycle_ix : bio.panel.alb.ix + 1000000;
		this.blurCheck();
		if (this.getCovImages()) return;
		if (!forceStnd && (bio.panel.alb.ix && bio.panel.alb.ix < bio.panel.alb.list.length && !bioSet.artistView)) { // !stndAlb
			const a = bio.panel.alb.list[bio.panel.alb.ix].artist;
			const l = bio.panel.alb.list[bio.panel.alb.ix].album;
			const l_handle = bio.lib.inLibrary(2, a, l);
			if (l_handle) { // check local
				this.getImg(l_handle, 0, false);
				return;
			}
			else {
				const pth = bio.panel.getPth('img', bio.panel.id.focus, a, l, '', bioCfg.supCache);
				if (this.chkPths(pth.pe, pth.fe, 0)) return;
				if (pth.fe != this.cov.done && bioCfg.dlRevImg) {
					const pth_cov = pth.pe[!bioCfg.supCache ? 0 : 1];
					const fn_cov = pth_cov + pth.fe;
					if ($Bio.server) bio.server.getRevImg(a, l, pth_cov, fn_cov, false);
					else window.NotifyOthers('bio_getRevImg', [a, l, pth_cov, fn_cov]);
					this.cov.done = pth.fe;
				}
				this.setStub(bioCov, this.stub[0].path, false, 0, this.stub[0].user);
				return;
			}
		}
		if ((forceStnd || !bio.panel.alb.ix) && bioCfg.cusCov && !bioSet.artistView && !bioSet.covType) {
			if (this.chkPths(bioCfg.cusCovPaths, '', 0, true)) return;
		}
		if (!forceStnd && (bio.panel.art.ix && bio.panel.art.ix < bio.panel.art.list.length && bioSet.artistView)) { // !stndBio
			const a_handle = bio.lib.inLibrary(3, this.artist);
			if (a_handle) {
				this.getImg(a_handle, 4, false);
				return;
			}
			this.setStub(bioArt, this.stub[4].path, false, 1, this.stub[4].user);
			return;
		}
		// stndAlb
		const handle = $Bio.handle(bio.panel.id.focus);
		if (handle) {
			let id = bioSet.artistView ? 4 : bioSet.covType;
			if (!bioSet.loadCovAllFb || forceStnd || bioSet.artistView) this.getImg(handle, id, this.stub[id].panel ? false : !(!bioSet.covType || bioSet.artistView));
			else {
				id = this.cov.selFiltered[0];
				let image = null;
				if (bioCov.cacheHit(this.stub[id].path)) return;
				if (this.stub[id].user) {
					image = this.stub[id].user;
					if (image) this.cache().cacheIt(image, this.stub[id].path);
				}
				if (!image) this.setStub(this.cache(), 'cover', true, 0);
			}
			return;
		}
		if (fb.IsPlaying && handle) return;
		this.setStub(this.cache(), 'noitem', true, 2);
	}

	getImages(force) {
		if (bioSet.text_only && !bio.ui.style.isBlur && !bioSet.showFilmStrip) return;
		if (bioSet.artistView && bioSet.cycPhoto) {
			if (!bio.panel.art.ix) this.artistReset(force);
			this.getArtImg();
		} else this.getFbImg();
	}

	getImg(handle, id, needStub) {
		this.cur_handle = handle;
		utils.GetAlbumArtAsync(0, handle, id, needStub);
	}

	getImgFallback() {
		if (bio.txt.scrollbar_type().draw_timer) return;
		if (!bio.panel.updateNeeded()) {
			this.paint();
			this.get = false;
			return;
		}
		this.getImages();
		this.get = false;
	}

	getItem(art_ix, alb_ix, force) {
		if (this.forceStnd()) {
			art_ix = 0;
			alb_ix = 0;
		}
		switch (true) {
			case bioSet.artistView: {
				if (bioSet.text_only && !bio.ui.style.isBlur && !bioSet.showFilmStrip) return;
				this.cur_artist = this.artist;
				const stndBio = bio.panel.stnd(art_ix, bio.panel.art.list);
				this.artist = !stndBio ? bio.panel.art.list[art_ix].name : !bio.panel.lock ? bio.name.artist(bio.panel.id.focus) : bio.panel.art.list.length ? bio.panel.art.list[0].name : this.artist;
				const new_artist = this.artist && this.artist != this.cur_artist || !this.artist || force;
				if (new_artist) {
					bio.men.counter.bio = 0;
					bio.art_scroller.reset();
				}
				if (bioSet.cycPhoto) {
					if (new_artist) {
						this.counter = 0;
						this.art.folder = bio.panel.lock || bio.panel.isRadio(bio.panel.id.focus) ? bio.panel.cleanPth(bioCfg.remap.foImgArt, bio.panel.id.focus, 'remap', this.artist, '', 1) : stndBio ? bio.panel.cleanPth(bioCfg.pth.foImgArt, bio.panel.id.focus) : bio.panel.cleanPth(bioCfg.remap.foImgArt, bio.panel.id.focus, 'remap', this.artist, '', 1);
						this.art.folderSup = '';
						if (!stndBio && bioCfg.supCache && !$Bio.folder(this.art.folder)) this.art.folderSup = bio.panel.cleanPth(bioCfg.sup.foImgArt, bio.panel.id.focus, 'remap', this.artist, '', 1);
						this.clearArtCache(true);
						this.art.done = false;
						if (!this.art.images.length) this.art.allFilesLength = 0;
						this.art.ix = 0;
					}
					this.getArtImg(false, true);
				} else this.getFbImg();
				this.get = false;
				break;
			}
			case !bioSet.artistView: {
				const stndAlb = !alb_ix || alb_ix + 1 > bio.panel.alb.list.length;
				if (stndAlb) this.resetCounters();
				else if (!bio.panel.lock) {
					this.id.curAlbum = this.id.album;
					this.id.album = (!bio.panel.art.ix ? this.artist : bio.panel.art.list[0].name) + bio.panel.alb.list[alb_ix].name;
					if (this.id.album != this.id.curAlbum || force) {
						this.counter = 0;
						bio.men.counter.rev = 0;
					}
				}
				bio.txt.rev.lookUp = true;
				this.getFbImg();
				this.get = false;
				break;
			}
		}
	}

	getOrientation() {
		this.style.horizontal = (bioSet.style == 0 || bioSet.style == 2 || bioSet.style > 3) && !bioSet.img_only;
		this.style.vertical = (bioSet.style == 1 || bioSet.style == 3 || bioSet.style > 3 && !bioSet.alignAuto) && !bioSet.img_only;
		this.style.circular = this.isType('Circ');
		this.style.reflection = this.isType('Refl');
	}

	getOverlayMetrics(image) {
		const s1 = image.Width / image.Height;
		const s2 = this.nw / this.nh;
		if (s1 > s2) {
			const sc = Math.min(this.nh / image.Height, this.nw / image.Width);
			this.im.h = Math.round(image.Height * sc);
			this.im.t = Math.round((this.nh - this.im.h) / 2 + this.im.t);
		} else {
			this.im.t = bio.panel.img.t;
			this.nh = Math.max(bio.panel.h - bio.panel.img.t - bio.panel.img.b - this.bor.w2, 10);
		}
	}

	getRandomCol() {
		const rc = () => Math.floor(Math.random() * 256);
		let c = [rc(), rc(), rc()];
		while (!this.isColOk(c)) c = [rc(), rc(), rc()];
		return $Bio.RGBAtoRGB(RGBA(c[0], c[1], c[2], Math.min(80 / bio.ui.blur.alpha, 255)), RGB(0, 0, 0));
	}

	grab(force) {
		if (bio.panel.block()) return this.get = true;
		this.getArtImg(true);
		if (force) this.getFbImg();
	}

	images(v) {
		if (!$Bio.file(v)) return false;
		if (this.art.cusPhotoLocation) return Regex.ArtImageExtensions.test(bioFSO.GetExtensionName(v));
		const fileSize = utils.GetFileSize(v);
		return (bio.name.isLfmImg(bioFSO.GetFileName(v), this.artist) || !bioSet.imgFilterLfm && Regex.ArtImageExtensions.test(bioFSO.GetExtensionName(v)) && !Regex.TextDashPadded.test(bioFSO.GetBaseName(v))) && !this.exclArr.includes(fileSize) && !this.blackListed(v);
	}

	isColOk(c) {
		const brightness = Math.sqrt(
			0.299 * (c[0] * c[0]) +
			0.587 * (c[1] * c[1]) +
			0.114 * (c[2] * c[2])
		);
		return brightness > 55;
	}

	isEmbedded(type, ix) { // also identifies yt etc
		switch (type) {
			case 'stnd':
				return bioSet.artistView || !this.cov.list[ix] ? null : this.cov.list[ix].embedded;
			case 'thumb':
				if (this.cache().embedded) return this.cache().embedded;
				else if (bioSet.artistView || !this.cov.list[ix]) return null;
				else return this.cov.list[ix].embedded;
		}
	}

	isImageLight(image) {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15));
		let rTot = 0;
		let gTot = 0;
		let bTot = 0;
		let freqTot = 0;
		colorSchemeArray.forEach(v => {
			const col = $Bio.toRGB(v.col);
			rTot += col[0] ** 2 * v.freq;
			gTot += col[1] ** 2 * v.freq;
			bTot += col[2] ** 2 * v.freq;
			freqTot += v.freq;
		});
		const avgCol = [$Bio.clamp(Math.round(Math.sqrt(rTot / freqTot)), 0, 255), $Bio.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0, 255), $Bio.clamp(Math.round(Math.sqrt(bTot / freqTot)), 0, 255)];
		return !!bio.ui.isLightCol(avgCol, true);
	}

	isType(n, image) {
		switch (n) { // init before createImages & this.setCrop
			case 'AnyBorShadow':
				return ['artBorderImgOnly', 'artShadowImgOnly', 'artBorderDual', 'artShadowDual', 'covBorderImgOnly', 'covShadowImgOnly', 'covBorderDual', 'covShadowDual'].some(v => bioSet[v]);
			case 'Blur':
				return bio.ui.style.isBlur && !(bioSet.img_only && this.style.crop && this.style.border < 2) ? image.Clone(0, 0, image.Width, image.Height) : null;
			case 'AnyBor':
				return ['artBorderImgOnly', 'artBorderDual', 'covBorderImgOnly', 'covBorderDual'].some(v => bioSet[v]);
			case 'Fade':
				return (!bioSet.typeOverlay || bioSet.style == 4 && !bioSet.typeOverlay) && bioSet.style > 3 && !bioSet.img_only;
			case 'Overlay':
				return bioSet.style > 3 && bioSet.alignAuto && !bioSet.img_only;
			case 'Circ':
				if (bioSet.style == 4) return false;
				switch (bioSet.artistView) {
					case true:
						return !bioSet.img_only ? bioSet.artStyleDual == 2 : bioSet.artStyleImgOnly == 2;
					case false:
						return !bioSet.img_only ? bioSet.covStyleDual == 2 : bioSet.covStyleImgOnly == 2;
				}
				break;
			case 'Border':
				switch (bioSet.artistView) {
					case true:
						return !bioSet.img_only && bioSet.artBorderDual && bioSet.artShadowDual || bioSet.img_only && bioSet.artBorderImgOnly && bioSet.artShadowImgOnly ? 3 : !bioSet.img_only && bioSet.artShadowDual || bioSet.img_only && bioSet.artShadowImgOnly ? 2 : !bioSet.img_only && bioSet.artBorderDual || bioSet.img_only && bioSet.artBorderImgOnly ? 1 : 0;
					case false:
						return !bioSet.img_only && bioSet.covBorderDual && bioSet.covShadowDual || bioSet.img_only && bioSet.covBorderImgOnly && bioSet.covShadowImgOnly ? 3 : !bioSet.img_only && bioSet.covShadowDual || bioSet.img_only && bioSet.covShadowImgOnly ? 2 : !bioSet.img_only && bioSet.covBorderDual || bioSet.img_only && bioSet.covBorderImgOnly ? 1 : 0;
				}
				break;
			default:
				switch (bioSet.artistView) {
					case true:
						return !bioSet.img_only ? bioSet[`art${n}Dual`] : bioSet[`art${n}ImgOnly`];
					case false:
						return !bioSet.img_only ? bioSet[`cov${n}Dual`] : bioSet[`cov${n}ImgOnly`];
				}
		}
	}

	lbtn_dn(p_x) {
		if (!bioSet.touchControl || bio.panel.trace.text || this.dn) return;
		this.touch.dn = true;
		this.touch.start = p_x;
	}

	lbtn_up() {
		if (this.touch.dn) this.touch.dn = false;
	}

	leave() {
		if (this.touch.dn) {
			this.touch.dn = false;
			this.touch.start = 0;
		}
	}

	loadAltCov(handle, n) {
		let a, l;
		switch (n) {
			case 0: // stndAlb !fbImg: chkCov save pths: if !found chk/save stubCovUser
				a = bio.name.albumArtist(bio.panel.id.focus);
				l = bio.name.album(bio.panel.id.focus);
				if (this.chkPths([bio.panel.getPth('cov', bio.panel.id.focus).pth, bio.panel.getPth('img', bio.panel.id.focus, a, l).pth], '', 0)) return true;
				if (bioCov.cacheHit(this.stub.cov.path)) return true;
				this.checkUserStub('cov', handle);
				return false;
			case 1: { // !stndAlb inLib !fbImg: chkCov save pths: if !found getRevImg else load stub || metadb
				a = bio.panel.alb.list[bio.panel.alb.ix].artist;
				l = bio.panel.alb.list[bio.panel.alb.ix].album;
				const pth = bio.panel.getPth('img', bio.panel.id.focus, a, l, '', bioCfg.supCache);
				if (this.chkPths(pth.pe, pth.fe, 0)) return;
				if (pth.fe != this.cov.done && bioCfg.dlRevImg) {
					const pth_cov = pth.pe[!bioCfg.supCache ? 0 : 1];
					const fn_cov = pth_cov + pth.fe;
					if ($Bio.server) bio.server.getRevImg(a, l, pth_cov, fn_cov, false);
					else window.NotifyOthers('bio_getRevImg', [a, l, pth_cov, fn_cov]);
					this.cov.done = pth.fe;
				}
				this.setStub(bioCov, this.stub[0].path, false, 0, this.stub[0].user);
			}
		}
	}

	loadArtImage() {
		if (this.art.images.length && bioSet.cycPhoto) this.loadImg(bioArt, this.art.images[this.art.ix], true, this.art.ix);
		else if (!this.init) this.getFbImg();
	}

	loadCycCov(handle, art_id, image, image_path) { // stndAlb
		if (!this.cov.cycle) return false;
		if (this.blackListed(image_path)) image_path = '';
		if ($Bio.file(image_path)) {
			const fileSize = utils.GetFileSize(image_path);
			if (this.exclArr.includes(fileSize)) image_path = '';
		}
		if (bioSet.loadCovAllFb) {
			if (this.cov.list.every(v => v.id !== art_id)) {
				this.cov.counter++;
				if (!art_id) {
					let path = bioCfg.cusCov ? this.chkPths(bioCfg.cusCovPaths, '', 3, true) : '';
					if (image_path && !bioCfg.cusCov || !path) path = image_path;
					if (!path) path = this.chkPths([bio.panel.getPth('cov', bio.panel.id.focus).pth, bio.panel.getPth('img', bio.panel.id.focus, bio.name.albumArtist(bio.panel.id.focus), bio.name.album(bio.panel.id.focus)).pth], '', 3);
					if (path) {
						const ln = this.cov.list.length;
						this.cov.list[ln] = {};
						this.cov.list[ln].id = art_id;
						const embedded = handle.Path == path;
						this.cov.list[ln].embedded = embedded ? image : null;
						if (embedded) path += art_id;
						this.cov.list[ln].pth = path;
					}
				} else if (image_path) {
					const ln = this.cov.list.length;
					this.cov.list[ln] = {};
					this.cov.list[ln].id = art_id;
					const embedded = handle.Path == image_path;
					this.cov.list[ln].embedded = embedded ? image : null;
					if (embedded) image_path += art_id;
					this.cov.list[ln].pth = image_path;
				}
				this.cov.list = this.cov.list.filter(Boolean);
				$Bio.sort(this.cov.list, 'id', 'num');
				this.cov.list = this.uniqPth(this.cov.list);
				this.cov.images = this.cov.list.map(v => v.pth);
				bio.filmStrip.check();
			}
		}

		if (!bioSet.artistView && !bio.panel.alb.ix) {
			const key = this.cov.images[this.cov.ix];
			if (this.cov.counter > (bioSet.loadCovAllFb ? bio.img.cov.selFiltered.length : 0) - 1) {
				if (key) this.loadImg(bioCov, key, false, this.cov.ix, this.isEmbedded('stnd', this.cov.ix));
				bio.seeker.metrics(this.style.circular, this.style.crop, this.style.horizontal, this.style.reflection, this.style.vertical);
				if (!this.cov.list.length) return false; // load stub
			}
			return true;
		}
	}

	loadImg(ca, key, chkCache, id, embeddedImg) {
		if (chkCache && ca.cacheHit(key)) return;
		if (!embeddedImg) {
			ca.cache[key] = {
				id
			};
			gdi.LoadImageAsync(0, key);
		} else bioCov.cacheIt(embeddedImg, key);
	}

	loadStndCov(handle, art_id, image, image_path, embedded) { // stndAlb load fbImg else stub
		if (this.blackListed(image_path)) {
			image = null;
			image_path = '';
		}
		if (!image) {
			if (bioSet.artistView) {
				if (bioArt.cacheHit(this.stub[art_id].path)) return;
				this.checkUserStub('art', handle);
				if (this.stub[art_id].user) {
					image = this.stub[art_id].user;
					image_path = this.stub[art_id].path;
				}
			} else {
				if (bioSet.loadCovAllFb) art_id = this.cov.selFiltered[0];
				if (bioCov.cacheHit(this.stub[art_id].path)) return;
				this.checkUserStub('cov', handle);
				if (this.stub[art_id].user) {
					image = this.stub[art_id].user;
					image_path = this.stub[art_id].path;
				}
			}
		}
		if (!image) {
			this.setStub(this.cache(), `stub${art_id}`, true, bioSet.artistView || art_id == 4 ? 1 : 0);
			return;
		}
		if (!bio.txt.rev.lookUp) this.clearCovCache();
		this.cache().cacheIt(image, image_path + (!embedded ? '' : art_id), embedded);
	}

	memoryLimit() {
		if (!window.JsMemoryStats) return;
		return window.JsMemoryStats.MemoryUsage / window.JsMemoryStats.TotalMemoryLimit > 0.4 || window.JsMemoryStats.TotalMemoryUsage / window.JsMemoryStats.TotalMemoryLimit > 0.8;
	}

	metrics() {
		this.setAutoDisplayVariables();
		this.getOrientation();
		bio.seeker.metrics(this.style.circular, this.style.crop, this.style.horizontal, this.style.reflection, this.style.vertical);
	}

	move(p_x, p_y) {
		if (this.touch.dn) {
			if (!bio.panel.imgBoxTrace(p_x, p_y)) return;
			this.touch.end = p_x;
			const x_delta = this.touch.end - this.touch.start;
			if (x_delta > bio.panel.style.imgSize / 5) {
				this.wheel(1);
				this.touch.start = this.touch.end;
			}
			if (x_delta < -bio.panel.style.imgSize / 5) {
				this.wheel(-1);
				this.touch.start = this.touch.end;
			}
		}
	}

	needTrim(n, ratio) {
		return n || Math.abs(ratio - 1) >= 0.05;
	}

	on_get_album_art_done(handle, art_id, image, image_path) {
		const embedded = handle.Path == image_path;
		const forceStnd = this.forceStnd();
		if (!this.cur_handle || !this.cur_handle.Compare(handle) || image && this.cache().cacheHit(image_path + (!embedded ? '' : art_id))) return;
		if (!forceStnd && this.loadCycCov(handle, art_id, image, image_path)) return;
		if (!forceStnd && bio.panel.alb.ix && bio.panel.alb.ix < bio.panel.alb.list.length && !image && !bioSet.artistView) return this.loadAltCov(handle, 1);
		if (!image && !bioSet.artistView && (!art_id || bioSet.loadCovAllFb) && (!bio.panel.alb.ix || forceStnd)) {
			if (this.loadAltCov(handle, 0)) return;
			if (bioSet.loadCovAllFb) art_id = this.cov.selFiltered[0];
			if (this.stub[art_id].user) {
				image = this.stub[art_id].user;
				image_path = this.stub[art_id].path;
			}
		}
		this.loadStndCov(handle, art_id, image, image_path, embedded);
	}

	on_load_image_done(image, image_path) {
		const caller = this.getCallerId(image_path);
		if (caller.art_id === this.art.ix) {
			if (!image) {
				setTimeout(() => {
					this.load_image_async(image_path); // try again in case dnlded fails to load: folder temp locked?
				}, 1000);
				return;
			}
			this.processArtImg(image, image_path);
		}
		if (caller.cov_id === this.cov.ix) {
			if (!bio.txt.rev.lookUp && !this.cov.cycle) this.clearCovCache();
			if (!image) return;
			if (this.filter.size && this.cov.folderSameAsArt && this.cov.images.includes(image_path) && (!bioSet.imgFilterBothPx ? image.Width < this.filter.minPx && image.Height < this.filter.minPx : image.Width < this.filter.minPx || image.Height < this.filter.minPx) && this.cov.images.length > this.filter.minNo) {
				this.cov.list.splice(this.cov.ix, 1);
				this.cov.images.splice(this.cov.ix, 1);
				bio.seeker.upd(false, false, true);
				if (bioSet.showFilmStrip) bio.filmStrip.trimCache(image_path);
				this.changeCov(1);
				bio.filmStrip.check('imgUpd');
				return;
			}
			bioCov.cacheIt(image, image_path);
		}
	}

	processArtImg(image, image_path) {
		const caller = this.getCallerId(image_path);
		if (caller.art_id === this.art.ix) {
			if (this.filter.size && (!bioSet.imgFilterBothPx ? image.Width < this.filter.minPx && image.Height < this.filter.minPx : image.Width < this.filter.minPx || image.Height < this.filter.minPx) && this.art.images.length > this.filter.minNo) {
				this.art.images.splice(this.art.ix, 1);
				bio.seeker.upd(false, false, true);
				if (bioSet.showFilmStrip) bio.filmStrip.trimCache(image_path);
				this.changePhoto(1);
				bio.filmStrip.check('imgUpd');
				return;
			}
			bioArt.cacheIt(image, image_path);
		}
	}

	on_playback_new_track(force) {
		this.resetCounters();
		if (!bio.panel.updateNeeded() && !force) return;
		if (bio.panel.block()) {
			this.get = true;
			bio.filmStrip.logScrollPos();
			this.artistReset();
		} else {
			if (bioSet.artistView && bioSet.cycPhoto) {
				bio.filmStrip.logScrollPos();
				this.artistReset();
				this.getArtImg();
			} else this.getFbImg();
			this.get = false;
		}
	}

	on_size() {
		if (bioSet.text_only) {
			this.clearCovCache();
			this.getFbImg();
		}
		if (bioSet.text_only && !bio.ui.style.isBlur && !bioSet.showFilmStrip) return this.init = false;
		bio.filmStrip.logScrollPos();
		this.clearCache();
		if (bioSet.artistView) {
			if (this.init) this.artistReset();
			this.getArtImg();
		} else {
			this.getFbImg();
			if (this.init) {
				this.id.albCyc = '';
				this.id.curAlbCyc = '';
			}
		}
		this.init = false;
		if (bioSet.img_only) bio.panel.getList(true, true);
		bio.but.refresh(true);
	}

	paint() {
		if (!bioSet.imgSmoothTrans) {
			this.style.alpha = 255;
			bio.txt.paint();
			return;
		}
		this.id.curImg = this.id.img;
		this.id.img = this.cur_pth();
		this.style.alpha = this.id.curImg != this.id.img ? this.transition.level : 255;
		bio.timer.clear(bio.timer.transition);
		bio.timer.transition.id = setInterval(() => {
			this.style.alpha = Math.min(this.style.alpha *= this.transition.incr, 255);
			bio.txt.paint();
			if (this.style.alpha == 255) bio.timer.clear(bio.timer.transition);
		}, 12);
	}

	pth() {
		const cur_pth = this.cur_pth();
		return {
			imgPth: (bioSet.text_only && !bio.panel.style.showFilmStrip) || !$Bio.file(cur_pth) ? '' : cur_pth,
			artist: this.artist || bio.name.artist(bio.panel.id.focus),
			blk: bio.name.isLfmImg(bioFSO.GetFileName(cur_pth))
		};
	}

	process(image, n, o) {
		this.metrics();
		this.style.blur = this.isType('Blur', image);
		this.style.fade = this.isType('Fade');
		this.style.overlay = this.isType('Overlay');
		const type = this.style.circular ? 'circular' : !this.style.crop ? 'default' : 'crop';
		switch (type) {
			case 'circular':
				if (this.style.overlay) this.nh = Math.max(bio.panel.h - bio.panel.img.t - bio.panel.img.b - this.bor.w2, 10);
				this.im.w = this.im.h = Math.min(this.nw, this.nh);
				break;
			case 'default':
				if (this.style.overlay) this.getOverlayMetrics(image);
				this.im.w = this.nw;
				this.im.h = this.nh;
				break;
			case 'crop':
				if (bioSet.style > 3 && !bioSet.img_only) this.nh = Math.max(bio.panel.h - bio.panel.img.t - bio.panel.img.b - this.bor.w2, 10);
				this.im.w = this.nw;
				this.im.h = this.nh;
				break;
		}
		return this.format(image, n, type, this.im.w, this.im.h, 'img', o, !bioSet.themed ? this.style.blur : false, this.style.border, this.style.fade, this.style.reflection);
	}

	processSizeFilter() {
		bioSet.imgFilterMinNo = Math.round(Math.max($Bio.value(bioSet.imgFilterMinNo, 3, 0), 1));
		bioSet.imgFilterMaxSz = Math.round(Math.max($Bio.value(bioSet.imgFilterMaxSz, 12000, 0), 50));
		bioSet.imgFilterMinSz = Math.round(Math.max($Bio.value(bioSet.imgFilterMinSz, 50, 0), 0));
		bioSet.imgFilterMinPx = Math.round(Math.max($Bio.value(bioSet.imgFilterMinPx, 500, 0), 0));
		this.filter.size = bioSet.imgFilterMaxSzEnabled || bioSet.imgFilterMinSzEnabled || bioSet.imgFilterMinPxEnabled;
		if (this.filter.size) {
			this.filter.minNo = bioSet.imgFilterMinNo;
			this.filter.maxSz = bioSet.imgFilterMaxSzEnabled ? bioSet.imgFilterMaxSz * 1024 : Infinity;
			this.filter.minSz = bioSet.imgFilterMinSzEnabled ? bioSet.imgFilterMinSz * 1024 : 0;
			this.filter.minPx = bioSet.imgFilterMinPxEnabled ? bioSet.imgFilterMinPx : 0;
		}
	}

	reflImage(image, x, y, w, h, o) {
		if (!this.mask.reflection) {
			const km = this.refl.gradient != -1 ? this.refl.strength / 500 + this.refl.gradient / 10 : 0;
			this.mask.reflection = $Bio.gr(500, 500, true, g => {
				for (let k = 0; k < 500; k++) {
					const c = 255 - $Bio.clamp(this.refl.strength - k * km, 0, 255);
					g.FillSolidRect(0, k, 500, 1, RGB(c, c, c));
				}
			});
		}
		let r_mask; let refl; let reflImg; let ref_sz; let sw = 0;
		if (!bioSet.imgReflType) { // auto
			switch (bioSet.style) {
				case 0:
				case 2:
					sw = bioSet.alignH == 1 ? bioSet.style : bioSet.alignH == 0 ? 3 : 1;
					break;
				case 1:
				case 3:
					sw = bioSet.alignV == 1 ? bioSet.style : bioSet.alignV == 0 ? 0 : 2;
					break;
				default:
					sw = bioSet.alignH == 1 ? 0 : 3 - bioSet.alignH;
					break;
			}
		} else sw = [2, 3, 0, 1][bioSet.imgReflType - 1];
		this.refl.adjust = false;
		switch (sw) {
			case 0: // bottom
				ref_sz = Math.round(Math.min(bio.panel.h - y - h, image.Height * this.refl.size));
				if (ref_sz <= 0) return image;
				refl = image.Clone(0, image.Height - ref_sz, image.Width, ref_sz);
				r_mask = this.mask.reflection.Clone(0, 0, this.mask.reflection.Width, this.mask.reflection.Height);
				if (refl) {
					r_mask = r_mask.Resize(refl.Width, refl.Height);
					refl.RotateFlip(6);
					refl.ApplyMask(r_mask);
				}
				reflImg = $Bio.gr(w, h + ref_sz, true, g => {
					g.DrawImage(image, 0, 0, w, h, 0, 0, w, h);
					g.DrawImage(refl, 0, h, w, h, 0, 0, w, h);
				});
				o.h = h + ref_sz;
				break;
			case 1: // left
				ref_sz = Math.round(Math.min(x, image.Width * this.refl.size));
				if (ref_sz <= 0) return image;
				refl = image.Clone(0, 0, ref_sz, image.Height);
				r_mask = this.mask.reflection.Clone(0, 0, this.mask.reflection.Width, this.mask.reflection.Height);
				r_mask.RotateFlip(1);
				if (refl) {
					r_mask = r_mask.Resize(refl.Width, refl.Height);
					refl.RotateFlip(4);
					refl.ApplyMask(r_mask);
				}
				reflImg = $Bio.gr(ref_sz + w, h, true, g => {
					g.DrawImage(image, ref_sz, 0, w, h, 0, 0, w, h);
					g.DrawImage(refl, 0, 0, ref_sz, h, 0, 0, ref_sz, h);
				});
				o.x = this.x = x - ref_sz;
				o.w = w + ref_sz;
				break;
			case 2: // top
				ref_sz = Math.round(Math.min(y, image.Height * this.refl.size));
				if (ref_sz <= 0) return image;
				refl = image.Clone(0, 0, image.Width, ref_sz);
				r_mask = this.mask.reflection.Clone(0, 0, this.mask.reflection.Width, this.mask.reflection.Height);
				r_mask.RotateFlip(2);
				if (refl) {
					r_mask = r_mask.Resize(refl.Width, refl.Height);
					refl.RotateFlip(6);
					refl.ApplyMask(r_mask);
				}
				reflImg = $Bio.gr(w, ref_sz + h, true, g => {
					g.DrawImage(image, 0, ref_sz, w, h, 0, 0, w, h);
					g.DrawImage(refl, 0, 0, w, ref_sz, 0, 0, w, ref_sz);
				});
				o.y = this.y = y - ref_sz;
				o.h = ref_sz + h;
				break;
			case 3: // right
				ref_sz = Math.round(Math.min(bio.panel.w - x - w, image.Width * this.refl.size));
				if (ref_sz <= 0) return image;
				refl = image.Clone(image.Width - ref_sz, 0, ref_sz, image.Height);
				r_mask = this.mask.reflection.Clone(0, 0, this.mask.reflection.Width, this.mask.reflection.Height);
				r_mask.RotateFlip(3);
				if (refl) {
					r_mask = r_mask.Resize(refl.Width, refl.Height);
					refl.RotateFlip(4);
					refl.ApplyMask(r_mask);
				}
				reflImg = $Bio.gr(w + ref_sz, h, true, g => {
					g.DrawImage(image, 0, 0, w, h, 0, 0, w, h);
					g.DrawImage(refl, w, 0, ref_sz, h, 0, 0, ref_sz, h);
				});
				o.w = w + ref_sz;
				break;
		}
		return reflImg;
	}

	resetCounters() {
		if (bio.panel.lock) return;
		this.id.curAlbCounter = this.id.albCounter;
		this.id.albCounter = bio.name.albID(bio.panel.id.focus, 'full');
		if (this.id.albCounter != this.id.curAlbCounter || !this.id.albCounter) {
			this.counter = 0;
			bio.men.counter.rev = 0;
		}
		this.id.curArtCounter = this.id.artCounter;
		this.id.artCounter = bio.name.artist(bio.panel.id.focus);
		if (this.id.artCounter && this.id.artCounter != this.id.curArtCounter || !this.id.artCounter) {
			this.counter = 0;
			bio.men.counter.bio = 0;
		}
	}

	resetTimestamps() {
		if (!bioSet.cycPic) return;
		bioSet.artistView ? this.timeStamp.photo = Date.now() : this.timeStamp.cov = Date.now();
	}

	setAlbID() {
		this.id.curAlbCyc = this.id.albCyc;
		this.id.albCyc = bio.name.albID(bio.panel.id.focus, 'full');
	}

	setAlignment() {
		if (this.style.horizontal && bioSet.alignH != 1) {
			if (bioSet.alignH == 2) this.im.l = Math.round(bio.panel.w - bio.panel.img.r - this.im.w - this.bor.w2);
		} else this.im.l = Math.round((this.nw - this.im.w) / 2 + this.im.l);
		if (this.style.vertical && bioSet.alignV != 1) {
			if (bioSet.alignV == 2) this.im.t = Math.round(bio.panel.h - bio.panel.img.b - this.im.h - this.bor.w2);
		} else if (bioSet.style < 4 || !bioSet.alignAuto || bioSet.img_only) this.im.t = Math.round((this.nh - this.im.h) / 2 + this.im.t);
	}

	setAutoDisplayVariables() {
		if (!bioSet.img_only && bioSet.textAlign && bioSet.style < 4) {
			if (bioSet.style == 0) {
				bio.panel.img.l = bio.panel.heading.x;
				bio.panel.img.r = bio.panel.w - bio.panel.heading.x - bio.panel.heading.w;
			}
			if (bioSet.style == 2) {
				bio.panel.img.l = !bio.panel.style.fullWidthHeading ? bio.panel.heading.x : bio.panel.heading.x + (!bioSet.filmStripOverlay ? bio.panel.filmStripSize.l : 0);
				bio.panel.img.r = !bio.panel.style.fullWidthHeading ? bio.panel.w - bio.panel.heading.x - bio.panel.heading.w : bio.panel.w - bio.panel.img.l - bio.panel.heading.w + (!bioSet.filmStripOverlay ? bio.panel.filmStripSize.r : 0);
			}
			if ((bioSet.style == 1 || bioSet.style == 3)) {
				bio.panel.img.t = !bio.panel.style.fullWidthHeading ? bioSet.textT + (!bioSet.filmStripOverlay ? bio.panel.filmStripSize.t : 0) : bio.panel.text.t;
				bio.panel.img.b = !bio.panel.style.fullWidthHeading ? bioSet.textB + (!bioSet.filmStripOverlay ? bio.panel.filmStripSize.b : 0) : bio.panel.h - bio.panel.text.t - bio.panel.text.h;
			}
		}
		if (!bioSet.img_only && bioSet.style == 0 && bio.panel.style.fullWidthHeading) {
			if (bio.panel.filmStripSize.l && !bioSet.filmStripOverlay) bio.panel.img.l = bio.panel.bor.l;
			if (bio.panel.filmStripSize.r && !bioSet.filmStripOverlay) bio.panel.img.r = bio.panel.bor.r;
		}

		$Bio.key.forEach(v => {
			this.im[v] = bioSet.img_only ? bio.panel.bor[v] + (!this.style.crop ? (!bioSet.filmStripOverlay ? bio.panel.filmStripSize[v] : 0) : 0) : bio.panel.img[v];
		});

		this.nw = !bioSet.img_only && (!bioSet.style || bioSet.style == 2 || bioSet.style > 3) ? bio.panel.w - bio.panel.img.l - bio.panel.img.r : !bioSet.img_only ? bio.panel.style.imgSize : bio.panel.w - this.im.l - this.im.r;
		this.nh = !bioSet.img_only && (bioSet.style == 1 || bioSet.style == 3 || bioSet.style > 3 && !bioSet.alignAuto) ? bio.panel.h - bio.panel.img.t - bio.panel.img.b : !bioSet.img_only ? bio.panel.style.imgSize : bio.panel.h - this.im.t - this.im.b;

		this.style.border = this.isType('Border');
		if (this.style.border == 1 || this.style.border == 3) {
			const i_sz = $Bio.clamp(this.nh, 0, this.nw) / $Bio.scale;
			this.bor.w1 = !i_sz || i_sz > 500 ? 5 * $Bio.scale : Math.max(Math.ceil(5 * $Bio.scale * i_sz / 500), 3);
		} else this.bor.w1 = 0;
		this.bor.w2 = this.bor.w1 * 2;
		this.nw = Math.max(this.nw - this.bor.w2, 10);
		this.nh = Math.max(this.nh - this.bor.w2, 10);
	}

	setCheckArr(arr_ix) {
		this.art.checkArr = [window.ID, arr_ix, this.art.displayedOtherPanel];
		window.NotifyOthers('bio_checkImgArr', this.art.checkArr);
	}

	setCrop(sz) {
		const imgRefresh = bioSet.img_only;
		this.style.crop = this.isType('Circ') ? false :
			bioSet.artistView && (bioSet.artStyleImgOnly == 1 && imgRefresh || (bioSet.artStyleDual == 1 || bioSet.style == 4) && !bioSet.img_only) || !bioSet.artistView && (bioSet.covStyleImgOnly == 1 && imgRefresh || (bioSet.covStyleDual == 1 || bioSet.style == 4) && !bioSet.img_only);
		bio.panel.setBorder(imgRefresh && this.style.crop, this.isType('Border'), this.isType('Refl'));
		if (sz) {
			bio.panel.setStyle();
			if (bioSet.heading && !bioSet.img_only) bio.but.check();
		}
	}

	setReflStrength(n) {
		this.refl.strength += n;
		this.refl.strength = $Bio.clamp(this.refl.strength, 0, 255);
		bioSet.reflStrength = Math.round(this.refl.strength / 2.55);
		this.mask.reflection = false;
		this.refl.adjust = true;
		if (bioSet.artistView && bioSet.cycPhoto) this.clearArtCache();
		if (bio.panel.stndItem()) this.getImages();
		else this.getItem(bio.panel.art.ix, bio.panel.alb.ix);
	}

	setStub(ca, key, def, n, userStub) {
		if (ca.cacheHit(key)) return;
		switch (def) {
			case false:
				if (userStub) ca.cacheIt(userStub, key);
				else this.setStub(ca, 'stub', true, n);
				break;
			case true:
				ca.cacheIt(this.stub.default[n].Clone(0, 0, this.stub.default[n].Width, this.stub.default[n].Height), key);
				break;
		}
	}

	sizeFilter(v, i, arr) {
		const fileSize = utils.GetFileSize(v);
		if (arr.length - this.removed <= this.filter.minNo || fileSize <= this.filter.maxSz && fileSize > this.filter.minSz) return true;
		this.removed++;
	}

	sortCache(o, prop) {
		const sorted = {};
		Object.keys(o).sort((a, b) => o[a][prop] - o[b][prop]).forEach(key => sorted[key] = o[key]);
		return sorted;
	}

	toggle(n) {
		bioSet.toggle(n);
		this.cov.cycle = bioSet.loadCovAllFb || bioSet.loadCovFolder;
		this.cov.cycle_ix = 0;
		if (n == 'loadCovFolder' && bioSet.loadCovFolder && !bioSet.get('Panel Biography - System: Cover Folder Checked', false)) {
			fb.ShowPopupMessage("Enter folder in options: \"Server Settings\"\\Cover\\Covers: cycle folder.\n\nDefault: artist photo folder.\n\nImages are updated when the album changes. Any images arriving after choosing the current album aren't included.", 'Biography: load folder for cover cycling');
			bioSet.set('Panel Biography - System: Cover Folder Checked', true);
		}
		this.id.albCyc = '';
		this.id.curAlbCyc = '';
		if (bioSet.artistView) {
			bio.seeker.upd(false, !this.cov.cycle);
			return;
		}
		if (this.cov.cycle) this.getCovImages();
		else this.getImages();
		bio.seeker.upd(false, !this.cov.cycle);
	}

	trace(x, y) {
		if (!bioSet.autoEnlarge) return true;
		const o = this.cache().cache[this.cur_pth()];
		if (!o) return false;
		return x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h;
	}

	uniq(a) {
		return [...new Set(a)];
	}

	uniqPth(a) {
		const flags = [];
		const result = [];
		a.forEach(v => {
			const vpth = v.pth.toLowerCase();
			if (flags[vpth]) return;
			result.push(v);
			flags[vpth] = true;
		});
		return result;
	}

	updImages() {
		this.id.albCyc = '';
		this.id.curAlbCyc = '';
		this.clearArtCache(true);
		this.clearCovCache();
		bio.filmStrip.scroll.pos.art = {};
		if (bio.panel.stndItem()) this.getImages(true);
		else this.getItem(bio.panel.art.ix, bio.panel.alb.ix, true);
	}

	wheel(step) {
		switch (bio.vk.k('shift')) {
			case false:
				if (this.art.images.length > 1 && bioSet.artistView && !bioSet.text_only && bioSet.cycPhoto) {
					this.changePhoto(-step);
					if (bioSet.cycPic) this.timeStamp.photo = Date.now();
				}
				if (this.cov.cycle && this.cov.images.length > 1 && !bioSet.artistView && !bioSet.text_only && !bio.panel.alb.ix) {
					this.changeCov(-step);
					if (this.cov.cycle) this.timeStamp.cov = Date.now();
				}
				bio.seeker.debounce();
				break;
			case true:
				if (!bio.panel || bio.but.trace('lookUp', bio.panel.m.x, bio.panel.m.y) || bio.panel.trace.text || bio.panel.trace.film || !this.isType('Refl')) break;
				this.setReflStrength(-step * 5);
				break;
		}
	}
}

class BioImageCache {
	constructor(type) {
		this.cache = {};
		this.pth = '';
		this.type = type;
	}

	// * METHODS * //

	checkCache() {
		let keys = Object.keys(this.cache);
		const cacheLength = keys.length;
		const minCacheSize = 5;
		if (cacheLength > minCacheSize) {
			this.cache = bio.img.sortCache(this.cache, 'time');
			keys = Object.keys(this.cache);
			const numToRemove = Math.round((cacheLength - minCacheSize) / 5);
			if (numToRemove > 0) {
				for (let i = 0; i < numToRemove; i++) this.trimCache(keys[i]);
			}
		}
	}

	cacheIt(image, key, embedded) {
		try {
			if (!image || this.type != bioSet.artistView) return bio.img.paint();
			if (bio.img.memoryLimit()) this.checkCache();
			if (!bioSet.text_only || bio.ui.style.isBlur) {
				const start = Date.now();
				const o = this.cache[key] = {};
				o.img = bio.img.cur = bio.img.process(image, this.type, o);
				o.filmID = bio.filmStrip.id();
				o.time = Date.now() - start;
			}
			this.pth = key;
			this.embedded = embedded && bioSet.showFilmStrip && !bio.filmStrip.style.auto ? image : null;
			bio.filmStrip.check();
			bio.img.paint();
		} catch (e) {
			this.pth = '';
			bio.img.paint();
			$Bio.trace(`unable to load image: ${key}`);
		}
	}

	cacheHit(key) {
		if (bioSet.text_only && !bio.ui.style.isBlur) {
			this.pth = key;
			return;
		}
		const o = this.cache[key];
		const id = bio.filmStrip.id();
		if (!o || !o.img || o.filmID.id != id.id || o.filmID.bor != id.bor || bio.img.refl.adjust) return false;
		bio.img.x = o.x;
		bio.seeker.counter.x = o.counter_x;
		bio.img.y = o.y;
		bio.seeker.counter.y = o.counter_y;
		if (bio.ui.style.isBlur && o.blur && !(bioSet.img_only && bio.img.style.crop)) bio.img.blur = o.blur;
		bio.img.cur = o.img;
		this.pth = key;
		if (this.type && !bio.img.art.images.length || !this.type && !bio.img.cov.images.length) bio.filmStrip.check();
		else bio.filmStrip.paint();
		bio.img.paint();
		return true;
	}

	trimCache(key) {
		delete this.cache[key];
	}
}

/**
 * The instance of `BioImageCache` class for biography artist image cache operations.
 * @typedef {BioImageCache}
 * @global
 */
const bioArt = new BioImageCache(true);

/**
 * The instance of `BioImageCache` class for biography cover image cache operations.
 * @typedef {BioImageCache}
 * @global
 */
const bioCov = new BioImageCache(false);

class BioSeeker {
	constructor() {
		this.dn = false;
		this.hand = false;
		this.l_dn = false;
		this.imgNo = 0;
		bioSet.imgSeekerShow = $Bio.clamp(bioSet.imgSeekerShow, 0, 2);
		this.imgSeeker = (!bioSet.imgSeeker && !bioSet.imgCounter) ? 0 : bioSet.imgSeekerShow;
		this.nh = 10;
		this.nw = 10;
		this.overlap = false;
		this.seekerBelowImg = false;
		this.show = this.imgSeeker == 2;
		this.bar = {
			dot_w: 4,
			grip_h: 10 * $Bio.scale,
			gripOffset: 2,
			h: 6 * $Bio.scale,
			l: 0,
			offset: 18,
			overlapCorr: 0,
			reflCorr: 0,
			x1: 25,
			x2: 26,
			x3: 25,
			y1: 25,
			y2: 200,
			y3: 201,
			y4: 200,
			y5: 200,
			w1: 100,
			w2: 110
		};

		this.counter = {
			h: 8,
			x: 0,
			y: 0
		};

		this.prog = {
			min: 0,
			max: 200
		};

		this.debounce = $Bio.debounce(() => {
			if (bio.panel.imgBoxTrace(bio.panel.m.x, bio.panel.m.y) || this.imgSeeker == 2) return;
			this.show = false;
			bio.img.paint();
			bio.filmStrip.paint();
		}, 3000);
	}

	draw(gr) {
		if (this.imgNo < 2 || !this.show) return;
		let prog = 0;
		if (this.seekerBelowImg && bio.img.cur) {
			this.bar.y2 = Math.round(Math.min(bio.img.y + bio.img.cur.Height / (1 + this.bar.reflCorr) + this.bar.offset, (bio.panel.h - bio.panel.filmStripSize.b) * 0.9) - this.bar.h / 2);
			this.bar.y3 = this.bar.y2 + Math.ceil(bio.ui.style.l_w / 2);
			this.bar.y5 = (bio.panel.h - bio.panel.filmStripSize.b) * 0.97;
		}
		if (bioSet.imgSeeker && bioSet.imgSeekerDots == 1) { // dots
			gr.SetSmoothingMode(2);
			prog = this.dn ? $Bio.clamp(bio.panel.m.x - this.bar.x2 - this.bar.grip_h / 2, this.prog.min, this.prog.max) : (bioSet.artistView ? bio.img.art.ix + 0.5 : bio.img.cov.ix + 0.5) * this.bar.w1 / this.imgNo - (this.bar.grip_h - this.bar.dot_w) / 2;
			for (let i = 0; i < this.imgNo; i++) {
				gr.FillEllipse(this.bar.x2 + ((i + 0.5) / this.imgNo) * this.bar.w1, this.bar.y2, this.bar.dot_w, this.bar.h, RGB(245, 245, 245));
				gr.DrawEllipse(this.bar.x2 + ((i + 0.5) / this.imgNo) * this.bar.w1, this.bar.y2, this.bar.dot_w, this.bar.h, bio.ui.style.l_w, RGB(128, 128, 128));
			}
			gr.FillEllipse(this.bar.x2 + prog, this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
			gr.DrawEllipse(this.bar.x2 + prog, this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, bio.ui.style.l_w, RGB(128, 128, 128));
			gr.SetSmoothingMode(0);
		}

		if (bioSet.imgSeeker && bioSet.imgSeekerDots == 0) { // bar
			prog = this.dn ? $Bio.clamp(bio.panel.m.x - this.bar.x1, 0, this.bar.w1) : (bioSet.artistView ? bio.img.art.ix + 0.5 : bio.img.cov.ix + 0.5) * this.bar.w1 / this.imgNo;
			gr.DrawRect(this.bar.x1, this.bar.y2, this.bar.w1, this.bar.h, bio.ui.style.l_w, RGB(128, 128, 128));
			gr.FillSolidRect(this.bar.x2, this.bar.y3, this.bar.w1 - bio.ui.style.l_w, this.bar.h - bio.ui.style.l_w, RGBA(0, 0, 0, 75));
			gr.FillSolidRect(this.bar.x2, this.bar.y3, prog - bio.ui.style.l_w, this.bar.h - bio.ui.style.l_w, RGB(245, 245, 245));
			gr.SetSmoothingMode(2);
			gr.FillEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
			gr.DrawEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, bio.ui.style.l_w, RGB(128, 128, 128));
			gr.SetSmoothingMode(0);
		}

		if (bioSet.imgCounter) { // counter
			if (bioSet.imgSeekerDots == 1) prog += Math.round(this.bar.grip_h / 2 - this.bar.dot_w / 2);
			const count = `${bioSet.artistView ? bio.img.art.ix + 1 : bio.img.cov.ix + 1} / ${this.imgNo}`;
			const count_m = `${this.imgNo} / ${this.imgNo} `;
			if (count) {
				const count_w = Math.max(gr.CalcTextWidth(count_m, bio.ui.font.small), 8);
				const count_x = bioSet.imgSeeker ? Math.round($Bio.clamp(this.bar.x1 - count_w / 2 + prog, this.bar.l + 2, this.bar.l + this.nw - count_w - 4)) : this.counter.x + bio.ui.style.l_w * 2 + bio.img.bor.w1;
				const count_y = bioSet.imgSeeker ? Math.round(this.bar.y2 - this.bar.gripOffset - bio.ui.font.small_h * 1.5) : this.counter.y + bio.ui.style.l_w * 2 + bio.img.bor.w1;
				gr.FillRoundRect(count_x, count_y, count_w + 2, bio.ui.font.small_h + 2, 3, 3, RGBA(0, 0, 0, 210));
				gr.DrawRoundRect(count_x + 1, count_y + 1, count_w, bio.ui.font.small_h, 1, 1, 1, RGBA(255, 255, 255, 60));
				gr.DrawRoundRect(count_x, count_y, count_w + 2, bio.ui.font.small_h + 2, 1, 1, 1, RGBA(0, 0, 0, 200));
				gr.GdiDrawText(count, bio.ui.font.small, RGB(250, 250, 250), count_x + 1, count_y, count_w, bio.ui.font.small_h + 2, bio.txt.cc);
			}
		}
	}

	intersectRect() {
		return !(bio.panel.tbox.l > bio.panel.ibox.l + bio.panel.ibox.w || bio.panel.tbox.l + bio.panel.tbox.w < bio.panel.ibox.l || bio.panel.tbox.t > bio.panel.ibox.t + bio.panel.ibox.h || bio.panel.tbox.t + bio.panel.tbox.h < bio.panel.ibox.t);
	}

	lbtn_dn(p_x, p_y) {
		this.dn = false;
		this.l_dn = true;
		if (bioSet.touchControl) {
			bio.ui.id.touch_dn = bio.filmStrip.get_ix(p_x, p_y);
		}
		if (this.imgSeeker) {
			if (this.imgNo > 1) this.dn = this.hand;
			if (this.dn) {
				const prog = $Bio.clamp(p_x - this.bar.x1, 0, this.bar.w1);
				if (bioSet.artistView) {
					const new_ix = Math.min(Math.floor(prog / this.bar.w1 * bio.img.art.images.length), bio.img.art.images.length - 1);
					if (new_ix != bio.img.art.ix) {
						bio.img.art.ix = new_ix;
						bio.img.setPhoto();
					}
				} else {
					const new_i_x = Math.min(Math.floor(prog / this.bar.w1 * bio.img.cov.images.length), bio.img.cov.images.length - 1);
					if (new_i_x != bio.img.cov.ix) {
						bio.img.cov.ix = new_i_x;
						bio.img.setCov();
					}
				}
				bio.img.paint();
				bio.filmStrip.paint();
			}
		}
	}

	lbtn_up() {
		this.upd();
		this.dn = false;
		this.l_dn = false;
		if (this.imgSeeker) bio.img.paint();
		bio.filmStrip.paint();
	}

	metrics(circular, crop, horizontal, reflection, vertical) {
		bioSet.imgSeekerDisabled = bioSet.style > 3 && !bioSet.img_only && !bio.panel.clip && this.intersectRect() || (bioSet.filmStripOverlay && !bioSet.text_only);
		this.imgSeeker = !bioSet.imgSeekerDisabled ? ((!bioSet.imgSeeker && !bioSet.imgCounter) ? 0 : bioSet.imgSeekerShow) : 0;
		if (!this.imgSeeker) {
			this.show = false;
			bio.img.paint();
			bio.filmStrip.paint();
			return;
		} else if (this.imgSeeker == 2) this.show = true;

		this.imgNo = bioSet.text_only ? 0 : bioSet.cycPhoto && bioSet.artistView ? bio.img.art.images.length : bio.img.cov.cycle && !bioSet.artistView && !bio.panel.alb.ix ? bio.img.cov.images.length : 0;
		if (this.imgNo < 2) return;

		this.overlap = bioSet.style > 3 && !bioSet.img_only && bio.panel.clip;
		this.bar.overlapCorr = this.overlap ? bio.panel.bor.t : 0;

		const alignBottom = vertical && !crop && bioSet.alignV == 2 && !this.overlap;
		const alignCenter = vertical && !crop && bioSet.alignV == 1 && !this.overlap;
		const alignLeft = horizontal && !crop && bioSet.alignH == 0;
		const alignRight = horizontal && !crop && bioSet.alignH == 2;

		this.nw = bioSet.img_only && crop ? bio.img.nw - bio.panel.filmStripSize.l - bio.panel.filmStripSize.r : bio.img.nw;
		this.nh = bioSet.img_only ? bio.img.nh - (!crop ? 0 : bio.panel.filmStripSize.b) : bioSet.style < 4 ? Math.min(!crop ? this.nw : bio.img.nh, bio.img.nh) : this.overlap ? bio.panel.style.imgSize : Math.min(!crop ? (bio.panel.ibox.w - bio.panel.bor.l - bio.panel.bor.r) : bio.panel.ibox.h - bio.panel.bor.t - bio.panel.bor.b, bio.panel.ibox.h - bio.panel.bor.t - bio.panel.bor.b);
		const seeker_img_t = !alignBottom || this.nw >= bio.img.nh ? bio.ui.y : bio.img.nh - this.nw;

		this.bar.h = (bioSet.imgSeekerDots == 1 ? 6 : 5) * $Bio.scale;
		this.bar.grip_h = (bioSet.imgSeekerDots == 1 ? 10 : 9) * $Bio.scale;
		this.bar.gripOffset = Math.round((this.bar.grip_h - this.bar.h) / 2) + Math.ceil(bio.ui.style.l_w / 2);
		const circ_sz = bioSet.style < 4 ? Math.min(this.nw, this.nh) : Math.min(bio.panel.ibox.w - bio.panel.bor.l - bio.panel.bor.r, bio.panel.ibox.h - bio.panel.bor.t - bio.panel.bor.b);
		this.bar.w1 = circular && (alignLeft || alignRight) ? Math.min(this.imgNo * 30 * $Bio.scale, circ_sz) : Math.min(this.imgNo * 30 * $Bio.scale, (!bio.img.style.crop ? Math.min(this.nw, this.nh) : this.nw) - 30 * $Bio.scale);
		this.bar.w2 = this.bar.w1 + Math.round(this.bar.grip_h);
		this.bar.l = bioSet.img_only ? bio.panel.bor.l + bio.panel.filmStripSize.l : bio.panel.img.l;
		this.bar.x1 = circular ? (alignLeft ? this.bar.l + (circ_sz - this.bar.w1) / 2 : alignRight ? this.bar.l + this.nw - circ_sz + (circ_sz - this.bar.w1) / 2 : Math.round(this.bar.l + (this.nw - this.bar.w1) / 2)) : (alignLeft ? Math.round(this.bar.l + 15 * $Bio.scale) : alignRight ? Math.round(bio.panel.w - (bioSet.img_only ? bio.panel.bor.r : bio.panel.img.r) - 15 * $Bio.scale - this.bar.w1) : Math.round(this.bar.l + (this.nw - this.bar.w1) / 2));
		this.bar.x3 = this.bar.x1 - Math.round(this.bar.grip_h / 2);
		this.bar.y1 = bioSet.img_only ? bio.panel.bor.t + seeker_img_t + bio.panel.filmStripSize.t : bio.panel.img.t + seeker_img_t;
		this.bar.y2 = Math.round(this.bar.y1 + this.nh * 0.9 - this.bar.h / 2) - this.bar.overlapCorr;
		this.bar.y3 = this.bar.y2 + Math.ceil(bio.ui.style.l_w / 2);
		this.bar.y4 = this.nh * 0.8 - this.bar.overlapCorr;
		this.bar.y5 = this.nh - this.bar.overlapCorr;

		this.seekerBelowImg = bioSet.imgSeeker && this.nh < 0.8 * bio.panel.h - bio.panel.filmStripSize.b && (vertical && !crop && bioSet.alignV == 0 && !this.overlap || alignCenter);
		this.bar.reflCorr = this.seekerBelowImg && reflection ? bioSet.reflSize / 100 : 0;
		this.bar.offset = bioSet.imgCounter ? bio.ui.font.small_h * 2 + this.bar.gripOffset + 2 : bio.ui.font.small_h * 1.5 + this.bar.gripOffset;

		if (bioSet.imgSeekerDots == 1) {
			this.bar.dot_w = Math.floor($Bio.clamp(this.bar.w1 / this.imgNo, 2, this.bar.h));
			this.bar.x2 = this.bar.x1 - Math.round(this.bar.dot_w / 2);
			this.prog.min = 0.5 / this.imgNo * this.bar.w1 - (this.bar.grip_h - this.bar.dot_w) / 2;
			this.prog.max = ((this.imgNo - 0.5) / this.imgNo) * this.bar.w1 - (this.bar.grip_h - this.bar.dot_w) / 2;
		} else {
			this.bar.x2 = this.bar.x1 + Math.ceil(bio.ui.style.l_w / 2);
		}
	}

	move(p_x, p_y) {
		this.hand = false;
		if (this.imgSeeker) {
			const trace = bio.panel.imgBoxTrace(p_x, p_y);
			const show = !bioSet.text_only && (bioSet.artistView || !bio.panel.alb.ix) && (this.imgSeeker == 2 || trace);
			if (this.imgNo > 1 && (!this.l_dn || this.dn)) {
				this.hand = !this.seekerBelowImg ?
					p_x > this.bar.x3 && p_x < this.bar.x3 + this.bar.w2 && p_y > this.bar.y1 + this.bar.y4 && p_y < this.bar.y1 + this.bar.y5 :
					p_x > this.bar.x3 && p_x < this.bar.x3 + this.bar.w2 && p_y > this.bar.y2 - bio.ui.font.small_h && p_y < this.bar.y5;
			}
			if (show != this.show && !bioSet.text_only && trace) {
				bio.img.paint();
				bio.filmStrip.paint();
			}
			if (show) this.show = true;
			this.debounce();
		}

		if (this.dn) {
			const prog = $Bio.clamp(p_x - this.bar.x1, 0, this.bar.w1);
			if (bioSet.artistView) {
				const new_ix = Math.min(Math.floor(prog / this.bar.w1 * bio.img.art.images.length), bio.img.art.images.length - 1);
				if (new_ix != bio.img.art.ix) {
					bio.img.art.ix = new_ix;
					bio.img.setPhoto();
				}
			} else {
				const new_i_x = Math.min(Math.floor(prog / this.bar.w1 * bio.img.cov.images.length), bio.img.cov.images.length - 1);
				if (new_i_x != bio.img.cov.ix) {
					bio.img.cov.ix = new_i_x;
					bio.img.setCov();
				}
			}
			bio.img.paint();
			bio.filmStrip.paint();
		}
	}

	upd(force, clearCov, repaint) {
		if ((bioSet.imgSeeker || bioSet.imgCounter) && bioSet.imgSeekerShow && (!this.dn && (!bioSet.text_only || bio.ui.style.isBlur || force))) {
			if (clearCov) bio.img.cov.images = [];
			bio.img.metrics();
			if (repaint) bio.txt.paint();
		}
	}
}
