'use strict';

class BioPanel {
	constructor() {
		this.arc = 10;
		this.calc = true;
		this.calcText = false;
		this.clicked = false;
		this.clip = false;
		this.h = 0;
		this.lock = 0;
		this.lockHandle = null;

		this.m = {
			x: -1,
			y: -1
		};

		this.notifyTimestamp = Date.now();
		window.NotifyOthers(`bio_notServer${bioSet.serverName}`, this.notifyTimestamp);
		this.tf = {};
		this.w = 0;

		this.alb = {
			cur: '',
			init: [],
			ix: 0,
			list: [],
			history: $Bio.jsonParse(bioSet.albumHistory, []),
			uniq: []
		};

		this.art = {
			cur: '',
			fields: bioCfg.artFields.map(v => `%${v}%`),
			history: $Bio.jsonParse(bioSet.artistHistory, []),
			init: [],
			ix: 0,
			list: [],
			similar: [],
			topAlbums: [],
			uniq: []
		};

		this.bor = {
			t: bioSet.borL,
			r: bioSet.borR,
			b: bioSet.borB,
			l: bioSet.borL
		};

		this.filmStripSize = {
			t: 0,
			r: 0,
			b: 0,
			l: 0
		};

		this.heading = {
			x: 0,
			w: 200
		};

		this.ibox = {
			l: 0,
			t: 0,
			w: 100,
			h: 100
		};

		this.id = {
			alb: '',
			curAlb: '',
			artist: '',
			curArtist: '',
			focus: bioSet.focus,
			last_pressed_coord: {
				x: -1,
				y: -1
			},
			init: true,
			lockAlb: '',
			lockArt: '',
			loadTimestamp: Date.now(),
			lyricsSource: false,
			nowplayingSource: false,
			numServersChecked: false,
			propsSource: false,
			tr: '',
			curTr: ''
		};

		for (let i = 0; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && bioSet[`pthTxtReader${i}`] && bioSet[`lyricsTxtReader${i}`] && !Regex.BioItemProperties.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1]) && !Regex.BioNowPlaying.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1])) {
				this.id.lyricsSource = true;
				this.id.focus = false;
				break;
			}
		}

		for (let i = 0; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && Regex.BioNowPlaying.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1])) {
				this.id.nowplayingSource = true;
				this.id.focus = false;
				break;
			}
		}

		for (let i = 0; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && Regex.BioItemProperties.test(utils.SplitFilePath(bioSet[`pthTxtReader${i}`])[1])) {
				this.id.propsSource = true;
				break;
			}
		}

		this.id.lookUp = bioSet.lookUp;

		this.im = {
			t: 0,
			r: 100,
			b: 100,
			l: 0
		};

		this.img = {
			t: 0,
			r: 20,
			b: 0,
			l: 20
		};

		this.logo = {
			img: bio_my_utils.getImageAsset('Logo.png')
		};

		this.repaint = {
			x: 0,
			y: 0,
			w: 100,
			h: 100
		};

		this.sbar = {
			offset: 0,
			x: 0,
			y: 0,
			h: 100,
			style: !bioSet.sbarFullHeight ? 2 : 0,
			top_corr: 0
		};

		this.style = {
			cycTimeItem: Math.max(bioSet.cycTimeItem, 30),
			enlarged_img: false,
			free: $Bio.jsonParse(bioSet.styleFree, false),
			fullWidthHeading: bioSet.heading && bioSet.fullWidthHeading,
			gap: bioSet.gap,
			imgSize: 0,
			inclTrackRev: bioSet.inclTrackRev,
			max_y: 0,
			minH: 50,
			moreTags: false,
			name: [],
			new: false,
			overlay: $Bio.jsonParse(bioSet.styleOverlay, false),
			showFilmStrip: false
		};

		this.tbox = {
			l: 0,
			t: 0,
			w: 100,
			h: 100
		};

		this.text = {
			l: 20,
			t: 20,
			r: 20,
			w: 100,
			h: 100
		};

		this.trace = {
			film: false,
			image: false,
			text: false
		};

		this.tx = {
			t: 0,
			r: 100,
			b: 100,
			l: 0
		};

		this.checkRefreshRates();
		this.setSummary();
		this.similarArtistsKey = 'Similar Artists: |\\u00c4hnliche K\\u00fcnstler: |Artistas Similares: |Artistes Similaires: |Artisti Simili: |\\u4f3c\\u3066\\u3044\\u308b\\u30a2\\u30fc\\u30c6\\u30a3\\u30b9\\u30c8: |Podobni Wykonawcy: |Artistas Parecidos: |\\u041f\\u043e\\u0445\\u043e\\u0436\\u0438\\u0435 \\u0438\\u0441\\u043f\\u043e\\u043b\\u043d\\u0438\\u0442\\u0435\\u043b\\u0438: |Liknande Artister: |Benzer Sanat\\u00e7\\u0131lar: |\\u76f8\\u4f3c\\u827a\\u672f\\u5bb6: '; this.d = parseFloat(this.q('0000029142')); this.lfm = this.q($Bio.s);
		this.topAlbumsKey = 'Top Albums: |Top-Alben: |\\u00c1lbumes M\\u00e1s Escuchados: |Top Albums: |Album Pi\\u00f9 Ascoltati: |\\u4eba\\u6c17\\u30a2\\u30eb\\u30d0\\u30e0: |Najpopularniejsze Albumy: |\\u00c1lbuns Principais: |\\u041f\\u043e\\u043f\\u0443\\u043b\\u044f\\u0440\\u043d\\u044b\\u0435 \\u0430\\u043b\\u044c\\u0431\\u043e\\u043c\\u044b: |Toppalbum: |En Sevilen Alb\\u00fcmler: |\\u6700\\u4f73\\u4e13\\u8f91: ';

		if (!this.style.free || !$Bio.isArray(this.style.free)) {
			bioSet.set('Panel Biography - System: Freestyle Custom BackUp', bioSet.styleFree);
			this.style.free = [];
			bioSet.styleFree = JSON.stringify(this.style.free);
			fb.ShowPopupMessage('Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to "SYSTEM.Freestyle Custom BackUp" in panel properties.', 'Biography');
		} else {
			let valid = true;
			this.style.free.forEach(v => {
				if (!$Bio.objHasOwnProperty(v, 'name') || isNaN(v.imL) || isNaN(v.imR) || isNaN(v.imT) || isNaN(v.imB) || isNaN(v.txL) || isNaN(v.txR) || isNaN(v.txT) || isNaN(v.txB)) valid = false;
			});
			if (!valid) {
				bioSet.set('Panel Biography - System: Freestyle Custom BackUp', bioSet.styleFree);
				this.style.free = [];
				bioSet.styleFree = JSON.stringify(this.style.free);
				fb.ShowPopupMessage('Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to "SYSTEM.Freestyle Custom BackUp" in panel properties.', 'Biography');
			}
		}
		if (!this.style.overlay || !$Bio.objHasOwnProperty(this.style.overlay, 'name') || isNaN(this.style.overlay.imL) || isNaN(this.style.overlay.imR) || isNaN(this.style.overlay.imT) || isNaN(this.style.overlay.imB) || isNaN(this.style.overlay.txL) || isNaN(this.style.overlay.txR) || isNaN(this.style.overlay.txT) || isNaN(this.style.overlay.txB)) {
			bioSet.set('Panel Biography - System: Overlay BackUp', bioSet.styleOverlay);

			this.style.overlay = {
				name: 'Overlay',
				imL: 0,
				imR: 0,
				imT: 0,
				imB: 0,
				txL: 0,
				txR: 0,
				txT: 0.632,
				txB: 0
			};

			bioSet.styleOverlay = JSON.stringify(this.style.overlay);
			fb.ShowPopupMessage('Unable to load "Panel Biography - System: Overlay".\n\nThe save location was corrupt. The overlay style has been reset to default.\n\nThe original should be backed up to "Panel Biography - System: Overlay BackUp" in panel properties.', 'Biography');
		}

		this.getStyleNames();
	}

	// * METHODS * //

	albumsSame() {
		if (this.id.lookUp && this.alb.ix && this.alb.list.length && JSON.stringify(this.alb.init) === JSON.stringify(this.alb.list)) return true;
		return false;
	}

	artistsSame() {
		if (this.id.lookUp && this.art.ix && this.art.list.length && JSON.stringify(this.art.init) === JSON.stringify(this.art.list)) return true;
		return false;
	}

	block() {
		return this.w <= 10 || this.h <= 10 || !window.IsVisible;
	}

	callServer(force, focus, notify, type) {
		if (!this.id.numServersChecked) this.checkNumServers();
		switch (type) {
			case 0:
				if ($Bio.server) {
					bio.server.download(force, {
						ix: this.art.ix,
						focus,
						arr: this.art.list.slice(0)
					}, {
						ix: this.alb.ix,
						focus,
						arr: this.alb.list.slice(0)
					}, notify);
				}
				if (!$Bio.server || bioSet.multiServer) {
					window.NotifyOthers(notify, [{
						ix: this.art.ix,
						focus,
						arr: this.art.list.slice(0)
					}, {
						ix: this.alb.ix,
						focus,
						arr: this.alb.list.slice(0)
					}]);
				}
				break;
			case 1:
				bio.server.download(force, {
					ix: this.art.ix,
					focus,
					arr: this.art.list.slice(0)
				}, {
					ix: this.alb.ix,
					focus,
					arr: this.alb.list.slice(0)
				});
				break;
		}
	}

	changed() {
		if (this.id.focus || !fb.IsPlaying) this.callServer(false, this.id.focus, 'bio_lookUpItem', 0);
		else if ($Bio.server) this.callServer(false, this.id.focus, '', 1);
	}

	checkRefreshRates() {
		[
			{ key: 'focusLoadRate', descr: 'Panel Biography - Panel Focus Load Refresh Rate', min: 200, max: 3000, oldDef: 250, newDef: 250 },
			{ key: 'focusServerRate', descr: 'Panel Biography - Panel Focus Server Refresh Rate', min: 1500, max: 15000, oldDef: 5000, newDef: 5000 },
			{ key: 'lookUpServerRate', descr: 'Panel Biography - Panel Lookup Refresh Rate', min: 1500, max: 15000, oldDef: 1500, newDef: 1500 }
		].forEach((rate) => {
			const name = `${rate.descr} ${rate.min}-${rate.max} msec (Max)`;
			const value = bioSet.get(name, null);
			if (value === null) { throw (`property_name: ${name}\nPanel's rate property name does not match range checked`); }
			else {
				if (bioSet[rate.key] === rate.oldDef && bioSet[rate.key] !== rate.newDef) { bioSet[rate.key] = rate.newDef; }
				bioSet[rate.key] = $Bio.clamp(bioSet[rate.key], rate.min, rate.max);
				if (bioSet[rate.key] !== Number(value)) {
					bioSet.set(name, bioSet[rate.key]);
				}
			}
		});

		this.focusLoad = $Bio.debounce(() => {
			if (!bioSet.img_only) bio.txt.on_playback_new_track();
			if (!bioSet.text_only || bio.ui.style.isBlur || bioSet.showFilmStrip) bio.img.on_playback_new_track();
		}, bioSet.focusLoadRate, {
			leading: bioSet.focusLoadImmediate,
			trailing: true
		});

		this.focusServer = $Bio.debounce(() => {
			this.changed();
		}, bioSet.focusServerRate);

		this.lookUpServer = $Bio.debounce(() => {
			this.callServer(false, this.id.focus, 'bio_lookUpItem', 0);
		}, bioSet.lookUpServerRate);
	}

	checkNumServers() {
		bioSet.multiServer = false;
		window.NotifyOthers('bio_checkNumServers', 0);
		this.id.numServersChecked = true;
	}

	changeView(x, y, menu) {
		if (!menu && (this.zoom() || bio.vk.k('alt') || x < 0 || y < 0 || x > this.w || y > this.h || bio.but.Dn)) return false;
		if (!menu && !bioSet.dblClickToggle && this.isTouchEvent(x, y)) return false;
		if (!menu && !bioSet.img_only && (bio.txt.scrollbar_type().onSbar && !bio.txt.lyricsDisplayed())  || bio.but.trace('heading', x, y) || bio.but.trace('lookUp', x, y)) return false;
		return true;
	}

	checkFilm() {
		if (!bioSet.showFilmStrip) return;
		const item = this.getItem();
		if (Date.now() - this.id.loadTimestamp > 1500) { // delay needed for correct sizing on init; ignored by click (sets loadTimestamp = 0);
			switch (item) {
				case 'stndArtist':
					!this.id.lookUp ? bio.txt.getText(true) : bio.txt.getItem(true, this.art.ix, this.alb.ix);
					bio.img.getImages();
					break;
				case 'stndAlbum':
					this.style.inclTrackRev != 1 || !this.id.lookUp ? bio.txt.getText(true) : bio.txt.getItem(true, this.art.ix, this.alb.ix);
					bio.img.getImages();
					break;
				case 'lookUp':
					bio.txt.getItem(true, this.art.ix, this.alb.ix);
					bio.img.getItem(this.art.ix, this.alb.ix);
					break;
			}
			bio.but.refresh(true);
			bio.txt.getScrollPos();
			bio.txt.paint();
		}
	}

	cleanPth(pth, item, type, artist, album, bio) {
		if (!pth) return '';
		pth = pth.trim().replace(Regex.PathForwardSlash, '\\');
		pth = bioCfg.expandPath(pth);
		switch (type) {
			case 'remap':
				pth = bio ? this.tfBio(pth, artist, item) : this.tfRev(pth, artist, album, item);
				break;
			case 'server':
				pth = $Bio.eval(pth, item, true);
				break;
			case 'tag': {
				const tf_p = FbTitleFormat(pth);
				pth = tf_p.EvalWithMetadb(item);
				break;
			}
			default:
				pth = $Bio.eval(pth, item);
				break;
		}
		if (!pth) return '';

		const UNC = pth.startsWith('\\\\');
		if (UNC) pth = pth.replace('\\\\', '');
		if (!pth.endsWith('\\')) pth += '\\';

		const c_pos = pth.indexOf(':');
		pth = type != 'lyr' ?
			pth.replace(Regex.PunctSeparatorsExtra, '-').replace(Regex.PathWildcardAsterisk, 'x').replace(Regex.PunctQuoteDouble, "''").replace(Regex.PunctAngle, '_').replace(Regex.PunctQuestion, '').replace(Regex.PathEscapedDot, '\\_').replace(Regex.PathMultipleDotBackslash, '\\').replace(Regex.PathBackslashPadded, '\\') :
			pth.replace(Regex.PathIllegalFilename, '_');
		if (c_pos < 3 && c_pos != -1) pth = $Bio.replaceAt(pth, c_pos, ':');

		Regex.PathHiddenSystem.lastIndex = 0; // Reset index
		if (Regex.PathHiddenSystem.test(pth)) { // Allow some special folders with dots
			pth = pth.replace(Regex.PathHiddenSystem, (_, p1, p2, p3) => `${p1}.${p2}${p3}`);
		}
		while (pth.includes('\\\\')) pth = pth.replace(Regex.PathDoubleBackslash, '\\_\\');
		if (UNC) pth = `\\\\${pth}`;
		return pth.trim();
	}

	click(x, y, menu) {
		this.clicked = this.changeView(x, y, menu);
		if (!this.clicked) return;
		this.id.loadTimestamp = 0;
		bio.txt.logScrollPos();
		bio.filmStrip.logScrollPos();
		bioSet.toggle('artistView');
		bio.img.resetTimestamps();
		const sameStyle = this.sameStyle();
		if (!sameStyle) this.setStyle();
		bio.txt.na = '';
		bio.timer.clear(bio.timer.source);
		if (!this.lock && this.updateNeeded()) {
			this.getList(true, true);
			if (!bioSet.artistView) bio.txt.albumReset();
		}
		const item = this.getItem();
		switch (item) {
			case 'stndArtist':
				!this.id.lookUp ? bio.txt.getText(this.calc) : bio.txt.getItem(this.calc, this.art.ix, this.alb.ix);
				bio.img.getImages();
				break;
			case 'stndAlbum':
				this.style.inclTrackRev != 1 || !this.id.lookUp ? bio.txt.getText(this.calc) : bio.txt.getItem(this.calc, this.art.ix, this.alb.ix);
				bio.img.getImages();
				break;
			case 'lookUp':
				bio.txt.getItem(this.calc, this.art.ix, this.alb.ix);
				bio.img.getItem(this.art.ix, this.alb.ix);
				break;
		}
		if (bioSet.img_only) bio.img.setCrop(true);
		bio.but.refresh(true);
		if (!sameStyle && bioSet.filmStripOverlay && bioSet.showFilmStrip) bio.filmStrip.set(bioSet.filmStripPos);
		if (!bioSet.artistView) bio.img.setCheckArr(null);
		this.move(x, y, true);
		bio.txt.getScrollPos();
		this.calc = false;
	}

	createStyle() {
		let ns;
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				ns = input;
			}
		};
		const caption = 'Create New Layout';
		const prompt = 'This copies the current layout style & saves it to the entered name\n\nThe copy is in freestyle format that offers fully flexible drag style positioning of image & text boxes + overlay effects\n\nContinue?';
		const fallback = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.input(caption, prompt, ok_callback, '', 'My Style') : true;
		if (fallback) {
			try {
				ns = utils.InputBox(0, prompt, caption, 'My Style', true);
			} catch (e) {
			}
		}
		if (!ns) return false;
		let lines_drawn;
		let imgs;
		let te_t;
		switch (bioSet.style) {
			case 0: {
				let txt_h = Math.round((this.h - this.bor.t - bioSet.textB) * (1 - bioSet.rel_imgs));
				lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				txt_h = lines_drawn * bio.ui.font.main_h + this.style.gap;
				imgs = Math.max(this.h - txt_h - this.bor.t - bioSet.textB - bio.ui.heading.h, 10);
				this.im.b = (this.h - this.bor.t - imgs - this.bor.b) / this.h;
				this.tx.t = (this.bor.t + imgs - bioSet.textT + this.style.gap) / this.h;
				this.im.l = 0;
				this.im.r = 0;
				this.im.t = 0;
				this.tx.l = 0;
				this.tx.r = 0;
				this.tx.b = 0;
				break;
			}
			case 1: {
				const txt_sp = Math.round((this.w - bioSet.textL - this.bor.r) * (1 - bioSet.rel_imgs));
				lines_drawn = Math.max(Math.floor((this.h - bioSet.textT - bioSet.textB - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				te_t = !bioSet.topAlign ? bioSet.textT + (this.h - bioSet.textT - bioSet.textB - lines_drawn * bio.ui.font.main_h + bio.ui.heading.h) / 2 : bioSet.textT + bio.ui.heading.h;
				this.im.l = (txt_sp + this.style.gap + (bioSet.sbarShow ? bio.ui.sbar.sp + 10 : 0)) / this.w;
				this.tx.r = (this.w - (txt_sp + bioSet.textR)) / this.w;
				this.tx.t = (te_t - bio.ui.heading.h - bioSet.textT) / this.h;
				this.im.r = 0;
				this.im.t = 0;
				this.im.b = 0;
				this.tx.l = 0;
				this.tx.b = 0;
				break;
			}
			case 2: {
				let txt_h = Math.round((this.h - bioSet.textT - this.bor.b) * (1 - bioSet.rel_imgs));
				lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				txt_h = lines_drawn * bio.ui.font.main_h + this.style.gap;
				imgs = Math.max(this.h - txt_h - this.bor.b - bioSet.textT - bio.ui.heading.h, 10);
				const img_t = this.h - this.bor.b - imgs;
				this.im.t = img_t / this.h;
				this.tx.b = (this.h - img_t - bioSet.textB + this.style.gap) / this.h;
				this.im.l = 0;
				this.im.r = 0;
				this.im.b = 0;
				this.tx.l = 0;
				this.tx.r = 0;
				this.tx.t = 0;
				break;
			}
			case 3: {
				const te_r = bioSet.sbarShow ? Math.max(bioSet.textR, bio.ui.sbar.sp + 10) : bioSet.textR;
				const txt_sp = Math.round((this.w - this.bor.l - te_r) * (1 - bioSet.rel_imgs));
				imgs = Math.max(this.w - txt_sp - this.bor.l - te_r - this.style.gap, 10);
				lines_drawn = Math.max(Math.floor((this.h - bioSet.textT - bioSet.textB - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				te_t = !bioSet.topAlign ? bioSet.textT + (this.h - bioSet.textT - bioSet.textB - lines_drawn * bio.ui.font.main_h + bio.ui.heading.h) / 2 : bioSet.textT + bio.ui.heading.h;
				this.im.r = (this.w - this.bor.l - imgs - this.bor.r) / this.w;
				this.tx.l = (this.bor.l + imgs - bioSet.textL + this.style.gap) / this.w;
				this.tx.t = (te_t - bio.ui.heading.h - bioSet.textT) / this.h;
				this.im.l = 0;
				this.im.t = 0;
				this.im.b = 0;
				this.tx.r = 0;
				this.tx.b = 0;
				break;
			}
		}
		this.style.free.forEach(v => {
			if (v.name == ns) ns = ns + ' New';
		});
		if (bioSet.style > 3 && (bioSet.img_only || bioSet.text_only)) {
			if (bioSet.style - 6 >= this.style.free.length) this.getStyleFallback();
			const obj = bioSet.style == 4 || bioSet.style == 5 ? this.style.overlay : this.style.free[bioSet.style - 6];
			this.im.l = $Bio.clamp(obj.imL, 0, 1);
			this.im.r = $Bio.clamp(obj.imR, 0, 1);
			this.im.t = $Bio.clamp(obj.imT, 0, 1);
			this.im.b = $Bio.clamp(obj.imB, 0, 1);
			this.tx.l = $Bio.clamp(obj.txL, 0, 1);
			this.tx.r = $Bio.clamp(obj.txR, 0, 1);
			this.tx.t = $Bio.clamp(obj.txT, 0, 1);
			this.tx.b = $Bio.clamp(obj.txB, 0, 1);
		}
		this.style.free.push({
			name: ns,
			imL: this.im.l,
			imR: this.im.r,
			imT: this.im.t,
			imB: this.im.b,
			txL: this.tx.l,
			txR: this.tx.r,
			txT: this.tx.t,
			txB: this.tx.b
		});
		this.sort(this.style.free, 'name');
		bioSet.styleFree = JSON.stringify(this.style.free);
		this.style.free.some((v, i) => {
			if (v.name == ns) {
				if (bioSet.sameStyle) bioSet.style = i + 6;
				else if (bioSet.artistView) bioSet.bioStyle = i + 6;
				else bioSet.revStyle = i + 6;
				return true;
			}
		});
		this.getStyleNames();
		bio.txt.refresh(0);
		bio.timer.clear(bio.timer.source);
		bio.timer.source.id = setTimeout(() => {
			this.style.new = false;
			window.Repaint();
			bio.timer.source.id = null;
		}, 10000);
		if (bio.timer.source.id !== 0) {
			this.style.new = true;
			window.Repaint();
		}
	}

	deleteStyle(n) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				this.style.free.splice(n - 6, 1);
				bioSet.styleFree = JSON.stringify(this.style.free);
				bioSet.style = 0;
				if (!bioSet.sameStyle) {
					if (bioSet.artistView) bioSet.bioStyle = 0;
					else bioSet.revStyle = 0;
				}
				this.getStyleNames();
				if (!bioSet.showFilmStrip) bio.txt.refresh(0);
				else bio.filmStrip.set(bioSet.filmStripPos);
			}
		};
		const caption = 'Delete Current Style';
		const prompt = `Delete: ${this.style.name[n]}\n\nStyle will be set to top`;
		const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	draw(gr) {
		let font = bio.ui.font.main;
		let str = 'POWERED by allmusic, last.fm & Wikipedia.\r\n\r\nShift+middle click to activate / inactivate.';
		let textHeight2;

		const textHeight1 = Math.round(gr.MeasureString(str, font, 10, 0, this.w - 20, 1000, StringFormat(1, 1)).Height);
		const version = `  ${window.ScriptInfo.Name}: v${window.ScriptInfo.Version}`;
		const versionHeight = gr.CalcTextHeight(version, bio.ui.font.small);
		const txtSp = this.h * 0.37;

		if (textHeight1 > txtSp) {
			str = str.replace('\r\n\r\n', ' ');
			textHeight2 = Math.round(gr.MeasureString(str, font, 10, 0, this.w - 20, 1000, StringFormat(1, 1)).Height);
			if (textHeight2 > txtSp) font = bio.ui.font.small;
		}

		const textHeight3 = Math.round(gr.MeasureString(str, font, 10, 0, this.w - 20, 1000, StringFormat(1, 1)).Height);
		if (textHeight3 > txtSp) str = 'Shift+middle click to activate.';

		let textCol = bio.ui.col.text;
		// let textCol_h = bio.ui.col.text_h;
		if (bioSet.theme > 0) {
			textCol = bio.ui.dui ? window.GetColourDUI(0) : window.GetColourCUI(0);
			// textCol_h = bio.ui.dui ? window.GetColourDUI(2) : window.GetColourCUI(2);
		}
		const hAvail = (this.h - txtSp - versionHeight) * 0.9;
		const wAvail = this.w * 0.9;
		const scale = this.getScale(this.logo.img, wAvail, hAvail);
		this.logo.w = scale[0];
		this.logo.h = scale[1];
		this.logo.x = (this.w - this.logo.w) / 2;
		this.logo.y = hAvail - this.logo.h + versionHeight + hAvail * 0.145 + bio.ui.y + bioSet.borT;

		gr.SetInterpolationMode(7);
		if (this.logo.img) gr.DrawImage(this.logo.img, this.logo.x, this.logo.y, this.logo.w, this.logo.h, 0, 0, this.logo.img.Width, this.logo.img.Height);
		gr.SetInterpolationMode(0);
		// gr.GdiDrawText(version, bio.ui.font.small, textCol, 10, bioSet.borT * 0.5 + this.h - txtSp, this.w - 20, txtSp, txt.ncc);
		gr.GdiDrawText(str, font, textCol, 10, bio.ui.y + this.h - txtSp, this.w - 20, txtSp, bio.txt.ncc);
	}

	exportStyle(n) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				window.NotifyOthers('bio_customStyle', JSON.stringify(this.style.free[n - 6]));
			}
		};
		const caption = 'Export Current Style To Other Biography Panels';
		const prompt = `Export: ${this.style.name[n]}`;
		const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	getItem() {
		if (!this.art.ix && bioSet.artistView) return 'stndArtist';
		return !this.alb.ix && !bioSet.artistView ? 'stndAlbum' : 'lookUp';
	}

	getList(p_clear, isAlbum) {
		if (!this.id.lookUp) return;
		const artist = bio.name.artist(this.id.focus, true) || bioLg['Artist Unknown'];
		const albumArtist = (!bio.panel.isRadio(this.id.focus) ? bio.name.albumArtist(this.id.focus, true) : artist) || bioLg['Artist Unknown'];
		const composition = isAlbum ? false : bioSet.classicalMusicMode && (bio.txt.rev.loaded.am && !bio.txt.rev.amFallback || bio.txt.rev.loaded.wiki && !bio.txt.rev.wikiFallback);
		const album = !composition ? bio.name.album(this.id.focus, true) || bioLg['Album Unknown'] : bio.name.composition(this.id.focus, true) || bioLg['Composition Unknown'];
		if (this.lock) {
			this.logArtistHistory(artist);
			this.logAlbumHistory(albumArtist, album, composition);
			return;
		}

		let k = 0;
		const lfmBio = `${(!bio.panel.isRadio(this.id.focus) ? this.cleanPth(bioCfg.pth.foLfmBio, this.id.focus) : this.cleanPth(bioCfg.remap.foLfmBio, this.id.focus, 'remap', artist, '', 1)) + $Bio.clean(artist) + bioCfg.suffix.foLfmBio}.txt`;
		const lBio = $Bio.open(lfmBio);
		const lfmSim = `${(!bio.panel.isRadio(this.id.focus) ? this.cleanPth(bioCfg.pth.foLfmSim, this.id.focus) : this.cleanPth(bioCfg.remap.foLfmSim, this.id.focus, 'remap', artist, '', 1)) + $Bio.clean(artist)} And Similar Artists.json`;
		const mult_arr = [];
		let mn = '';
		let nm = '';
		let sa = '';
		let ta = '';
		this.alb.init = this.alb.list.slice(0);
		this.alb.list = [];
		this.art.init = this.art.list.slice(0);
		this.art.list = [];
		this.art.list.push({
			name: artist,
			field: '',
			type: 'Artist'
		});
		if (bioSet.showSimilarArtists) {
			if ($Bio.file(lfmSim)) {
				const lSim = $Bio.jsonParse(lfmSim, false, 'file');
				let newStyle = false;
				if (lSim) {
					if ($Bio.objHasOwnProperty(lSim[0], 'name')) newStyle = true;
					lSim.shift();
					$Bio.take(lSim, bioCfg.menuSimilarNum);
					if (lSim.length) {
						this.art.list.push({
							name: bioLg['Similar Artists:'],
							field: '',
							type: 'label'
						});
						lSim.forEach((v, i, arr) => this.art.list.push({
							name: newStyle ? v.name : v,
							field: '',
							type: i != arr.length - 1 ? 'similar' : 'similarend'
						}));
					}
				}
			} else if ($Bio.file(lfmBio)) {
				let found = false;
				sa = bio.tag.getTag(lBio, this.similarArtistsKey).tag;
				if (sa.length < 7 && sa) {
					$Bio.take(sa, bioCfg.menuSimilarNum);
					found = true;
				}
				if (!found) {
					this.art.similar.some(v => {
						if (v.name == artist) {
							sa = $Bio.take(v.similar, bioCfg.menuSimilarNum);
							return found = true;
						}
					});
					if (!found) {
						const getSimilar = new BioLfmSimilarArtists(() => getSimilar.onStateChange(), this.getSimilar_search_done.bind(this));
						getSimilar.search(artist, '', '', 6);
					}
				}
				if (found && $Bio.isArray(sa) && sa.length) {
					this.art.list.push({
						name: bioLg['Similar Artists:'],
						field: '',
						type: 'label'
					});
					sa.forEach((v, i) => this.art.list.push({
						name: v,
						field: '',
						type: i != sa.length - 1 ? 'similar' : 'similarend'
					}));
				}
			}
		}

		if (bioSet.showMoreTags) {
			this.style.moreTags = false;
			this.art.fields.forEach(v => {
				nm = v.replace(/%/g, '');
				for (let h = 0; h < $Bio.eval(`$meta_num(${nm})`, this.id.focus); h++) {
					mn = `$trim($meta(${nm},${h}))`;
					const name = $Bio.eval(mn, this.id.focus);
					if (this.art.list.every(v => v.name !== name) && name.toLowerCase() != bioCfg.va.toLowerCase()) {
						mult_arr.push({
							name,
							field: ` ~ ${$Bio.titlecase(nm)}`,
							type: 'tag'
						});
					}
				}
			});
			if (mult_arr.length > 1) {
				this.sort(mult_arr, 'name');
				k = mult_arr.length;
				while (k--) {
					if (k != 0 && mult_arr[k].name.toLowerCase() == mult_arr[k - 1].name.toLowerCase()) {
						if (!mult_arr[k - 1].field.toLowerCase().includes(mult_arr[k].field.toLowerCase())) mult_arr[k - 1].field += mult_arr[k].field;
						mult_arr.splice(k, 1);
					}
				}
			}
			if (mult_arr.length) {
				this.style.moreTags = true;
				this.art.list.push({
					name: bioLg['More Tags:'],
					field: '',
					type: 'label'
				});
				this.art.list = this.art.list.concat(mult_arr);
				this.art.list[this.art.list.length - 1].type = 'tagend';
			}
		}

		if (!artist || !this.art.cur || artist != this.art.cur) {
			this.logArtistHistory(artist);
			this.art.cur = artist;
		}

		if (!(albumArtist + album) || !this.alb.cur || albumArtist + album != this.alb.cur) {
			this.logAlbumHistory(albumArtist, album, composition);
			this.style.inclTrackRev = bioSet.inclTrackRev;
			this.alb.cur = albumArtist + album;
		}

		if (this.art.history.length && bioSet.showArtistHistory) {
			this.art.list.push({
				name: bioLg['Artist History:'],
				field: '',
				type: 'label'
			});
			for (let h = 0; h < this.art.history.length; h++) {
				if (h || this.art.history[0].name != artist) this.art.list.push(this.art.history[h]);
			}
			this.art.list[this.art.list.length - 1].type = 'historyend';
		}

		this.art.list.forEach((v, i) => v.ix = i);
		this.art.uniq = this.art.list.filter(v => v.type != 'label');

		if (bioSet.showTopAlbums && $Bio.file(lfmBio)) {
			let found = false;
			ta = bio.tag.getTag(lBio, this.topAlbumsKey).tag;
			if (ta.length < 7 && ta) found = true;
			if (!found) {
				this.art.topAlbums.some(v => {
					if (v.name == artist) {
						ta = $Bio.take(v.album, 6);
						return found = true;
					}
				});
				if (!found) {
					const getTopAlb = new BioLfmTopAlbums(() => getTopAlb.onStateChange(), this.getTopAlb_search_done.bind(this));
					getTopAlb.search(artist);
				}
			}
			this.alb.list = [];
			this.alb.list.push({
				artist: albumArtist,
				album,
				composition,
				type: 'Current Album'
			});
			if (found && $Bio.isArray(ta) && ta.length) {
				this.alb.list.push({
					artist: `${bioLg['Last.fm Top Albums: '] + artist}:`,
					album: `${bioLg['Last.fm Top Albums: '] + artist}:`,
					type: 'label'
				});
				ta.forEach((v, i) => this.alb.list.push({
					artist,
					album: v,
					type: i != ta.length - 1 ? 'album' : 'albumend'
				}));
			}
		} else {
			this.alb.list = [];
			this.alb.list.push({
				artist: albumArtist,
				album,
				composition,
				type: 'Current Album'
			});
		}

		if (this.alb.history.length && bioSet.showAlbumHistory) {
			this.alb.list.push({
				artist: '',
				album: bioLg['Album History:'],
				type: 'label'
			});
			for (let h = 0; h < this.alb.history.length; h++) {
				if (h || this.alb.history[0].artist != albumArtist || this.alb.history[0].album != album) {
					this.alb.list.push(this.alb.history[h]);
				}
			}
			this.alb.list[this.alb.list.length - 1].type = 'historyend';
		}

		this.alb.list.forEach((v, i) => v.ix = i);
		this.alb.uniq = this.uniqAlbum(this.alb.list);
		if (!this.artistsSame() && p_clear) this.art.ix = 0;
		if (!this.albumsSame() && p_clear) this.alb.ix = 0;
	}

	getPth(sw, focus, artist, album, stnd, supCache, cleanArtist, cleanAlbumArtist, cleanAlbum, folder, basic, server) {
		let fo;
		let pth;
		switch (sw) {
			case 'bio':
				if (bio.panel.isRadio(bioSet.focus)) stnd = false; else if (stnd === '') stnd = this.stnd(this.art.ix, this.art.list);
				if (server) fo = stnd ? this.cleanPth(bioCfg.pth[folder], focus, 'server') : this.cleanPth(bioCfg.remap[folder], focus, 'remap', artist, '', 1);
				else fo = stnd && !this.lock ? this.cleanPth(bioCfg.pth[folder], focus) : this.cleanPth(bioCfg.remap[folder], focus, 'remap', artist, '', 1);
				pth = `${fo + cleanArtist + bioCfg.suffix[folder]}.txt`;
				if (!stnd && supCache && !$Bio.file(pth)) fo = this.cleanPth(bioCfg.sup[folder], focus, 'remap', artist, '', 1);
				pth = `${fo + cleanArtist + bioCfg.suffix[folder]}.txt`;
				return basic ? {
					fo,
					pth
				} : [fo, pth, !!cleanArtist, $Bio.file(pth)];
			case 'rev':
				if (stnd === '') stnd = this.stnd(this.alb.ix, this.alb.list);
				if (!stnd) cleanAlbumArtist = cleanArtist;
				if (server) fo = stnd ? this.cleanPth(bioCfg.pth[folder], focus, 'server') : this.cleanPth(bioCfg.remap[folder], focus, 'remap', artist, album, 0);
				else fo = stnd && !this.lock ? this.cleanPth(bioCfg.pth[folder], focus) : this.cleanPth(bioCfg.remap[folder], focus, 'remap', artist, album, 0);
				pth = `${fo + cleanAlbumArtist} - ${cleanAlbum}${bioCfg.suffix[folder]}.txt`;
				if (!stnd && supCache && !$Bio.file(pth)) fo = this.cleanPth(bioCfg.sup[folder], focus, 'remap', artist, album, 0);
				pth = `${fo + cleanAlbumArtist} - ${cleanAlbum}${bioCfg.suffix[folder]}.txt`;
				if (pth.length > 259) {
					cleanAlbum = $Bio.abbreviate(cleanAlbum);
					pth = `${fo + cleanAlbumArtist} - ${cleanAlbum}${bioCfg.suffix[folder]}.txt`;
				}
				return basic ? {
					fo,
					pth
				} : [fo, pth, !!(cleanAlbumArtist && cleanAlbum), $Bio.file(pth)];
			case 'track':
				fo = this.cleanPth(bioCfg.remap[folder], focus, 'remap', artist, album, 0);
				pth = `${fo + cleanArtist} - ${cleanAlbum}${bioCfg.suffix[folder].replace(' Review', '')}.json`;
				return basic ? {
					fo,
					pth
				} : [fo, pth, !!cleanArtist, $Bio.file(pth)];
			case 'cov':
				fo = this.cleanPth(bioCfg.pth.foImgCov, focus, 'server');
				pth = fo + $Bio.clean($Bio.eval(bioCfg.pth.fnImgCov, focus, true));
				return {
					fo, pth
				};
			case 'img': {
				fo = this.cleanPth(bioCfg.remap.foImgRev, focus, 'remap', artist, album, 0);
				let fn = $Bio.clean(`${artist} - ${album}`);
				pth = fo + fn;
				if (pth.length > 259) {
					album = $Bio.abbreviate(album);
					fn = $Bio.clean(`${artist} - ${album}`);
					pth = fo + fn;
				}
				if (supCache === undefined) {
					return {
						fo,
						fn,
						pth
					};
				}
				const pe = [fo];
				if (supCache) pe.push(this.cleanPth(bioCfg.sup.foImgRev, focus, 'remap', artist, album, 0));
				// fn long file path done above
				return {
					pe,
					fe: fn
				};
			}
		}
	}

	getScale(image, w, h) {
		const sc = Math.min(h / image.Height, w / image.Width);
		return [Math.round(image.Width * sc), Math.round(image.Height * sc)];
	}

	getSimilar_search_done(artist, list) {
		this.art.similar.push({
			name: artist,
			similar: list
		});
		this.getList(true);
	}

	getStyleFallback() {
		bioSet.style = 4;
		if (!bioSet.sameStyle) {
			if (bioSet.artistView) bioSet.bioStyle = 4;
			else bioSet.revStyle = 4;
		}
		fb.ShowPopupMessage('Unable to locate style. Using overlay layout instead.', 'Biography');
	}

	getTopAlb_search_done(artist, list) {
		this.art.topAlbums.push({
			name: artist,
			album: list
		});
		this.getList(true, true);
	}

	getStyleNames() {
		this.style.name = [bioLg.Top, bioLg.Right, bioLg.Bottom, bioLg.Left, bioLg['Full overlay'], bioLg['Part overlay']];
		this.style.free.forEach(v => this.style.name.push(v.name));
	}

	imgBoxTrace(x, y) {
		if (this.trace.film || this.m.y == -1) return false;
		if (bioSet.img_only) return true;
		if (bioSet.style < 4) {
			switch (bioSet.style) {
				case 0:
				case 2:
					return y > this.img.t && y < this.img.t + this.style.imgSize;
				case 1:
				case 3:
					return x > this.img.l && x < this.img.l + this.style.imgSize;
			}
		} else return y > this.ibox.t && y < this.ibox.t + this.ibox.h && x > this.ibox.l && x < this.ibox.l + this.ibox.w;
	}

	inactivate() {
		bioSet.toggle('panelActive');
		window.NotifyOthers('bio_status', bioSet.panelActive);
		window.Reload();
	}

	isRadio(focus) {
		return fb.IsPlaying && fb.PlaybackLength <= 0 && (!focus || this.isRadioFocused());
	}

	isRadioFocused() {
		if (this.lock) return true;
		const fid = plman.ActivePlaylist.toString() + plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist).toString();
		const np = plman.GetPlayingItemLocation();
		const pid = np.IsValid ? plman.PlayingPlaylist.toString() + np.PlaylistItemIndex.toString() : -2;
		return fid == pid;
	}

	isTouchEvent(x, y) {
		return bioSet.touchControl && Math.sqrt((Math.pow(this.id.last_pressed_coord.x - x, 2) + Math.pow(this.id.last_pressed_coord.y - y, 2))) > 3 * $Bio.scale;
	}

	leave() {
		if (!bioSet.autoEnlarge || bio.men.right_up) return;
		if (bioSet.img_only) {
			this.mode(0);
			this.style.enlarged_img = false;
		}
	}

	logAlbumHistory(albumArtist, album, composition) {
		if (albumArtist != bioLg['Artist Unknown'] && album != bioLg['Album Unknown']) {
			this.alb.history.unshift({
				artist: albumArtist,
				album,
				composition,
				type: 'history'
			});
		}
		this.alb.history = this.uniqAlbum(this.alb.history);
		if (this.alb.history.length > 20) this.alb.history.length = 20;
		bioSet.albumHistory = JSON.stringify(this.alb.history);
	}

	logArtistHistory(artist) {
		if (artist != bioLg['Artist Unknown']) {
			this.art.history.unshift({
				name: artist,
				field: '',
				type: 'history'
			});
		}
		this.art.history = this.uniqArtist(this.art.history);
		if (this.art.history.length > 20) this.art.history.length = 20;
		bioSet.artistHistory = JSON.stringify(this.art.history);
	}

	mbtn_up(x, y, menuLock, bypass) {
		if ((x < 0 || y < 0 || x > this.w || y > this.h) && !bypass) return;
		if (this.id.lookUp && (bio.but.btns.lookUp.trace(x, y) || menuLock || bypass)) {
			if (this.id.lyricsSource || this.id.nowplayingSource) {
				this.lock = 0;
				return;
			}
			const mArtist = bioSet.artistView && this.art.ix;
			if (!this.lock && !mArtist) bio.img.artistReset();
			if (!this.lock) {
				this.id.lockArt = $Bio.eval(this.art.fields, this.id.focus);
				this.id.lockAlb = bio.name.albID(this.id.focus, 'full') + (this.style.inclTrackRev ? bio.name.trackID(this.id.focus) : '');
				this.lockHandle = $Bio.handle(this.id.focus);
				bio.img.setAlbID();
				bio.img.cov.folder = this.cleanPth(bioCfg.albCovFolder, this.id.focus);
			}
			if (!bypass) this.lock = this.lock == 0 || menuLock ? 1 : 0;
			bio.txt.curHeadingID = this.lock ? bio.txt.headingID() : '';
			if (!this.lock && (bioSet.artistView && this.id.lockArt != $Bio.eval(this.art.fields, this.id.focus) || !bioSet.artistView && this.id.lockAlb != bio.name.albID(this.id.focus, 'full') + (this.style.inclTrackRev ? bio.name.trackID(this.id.focus) : ''))) {
				bio.txt.on_playback_new_track(true);
				bio.img.on_playback_new_track(true);
			}
			bio.but.check();
			window.Repaint();
			return;
		}
		switch (true) {
			case ((bioSet.img_only || bioSet.text_only) && !this.trace.film):
				this.mode(0);
				break;
			case this.trace.image:
				this.mode(!bioSet.img_only ? 1 : 2);
				break;
			case this.trace.text:
				this.mode(2);
				break;
		}
		this.move(x, y, true);
	}

	mode(n) {
		if (!bioSet.sameStyle) bioSet.artistView ? bioSet.bioMode = n : bioSet.revMode = n;
		let calcText = true;
		this.calc = true;
		bio.filmStrip.logScrollPos();
		switch (n) {
			case 0: {
				calcText = this.calcText || bioSet.text_only;
				bioSet.img_only = false;
				bioSet.text_only = false;
				this.setStyle();
				bio.img.clearCache();
				if (!this.art.ix && bioSet.artistView && !bio.txt.bio.lookUp || !this.alb.ix && !bioSet.artistView && !bio.txt.rev.lookUp) {
					bio.txt.albumReset();
					bio.txt.artistReset();
					bio.txt.getText(calcText);
					bio.img.getImages();
				} else {
					bio.txt.getItem(calcText, this.art.ix, this.alb.ix);
					bio.img.getItem(this.art.ix, this.alb.ix);
				}
				this.calcText = false;
				break;
			}
			case 1:
				bioSet.img_only = true;
				bioSet.text_only = false;
				bio.img.setCrop();
				this.setStyle();
				bio.img.clearCache();
				bio.img.getImages();
				break;
			case 2:
				bioSet.img_only = false;
				bioSet.text_only = true;
				this.setStyle();
				if (bio.ui.style.isBlur) bio.img.clearCache();
				if (!bioSet.sameStyle && (bioSet.bioMode != bioSet.revMode || bioSet.bioStyle != bioSet.revStyle)) calcText = true;
				if (!this.art.ix && bioSet.artistView && !bio.txt.bio.lookUp || !this.alb.ix && !bioSet.artistView && !bio.txt.rev.lookUp) {
					bio.txt.albumReset();
					bio.txt.artistReset();
					bio.txt.getText(calcText);
					if (bio.ui.style.isBlur) bio.img.getImages();
				} else {
					bio.txt.getItem(calcText, this.art.ix, this.alb.ix);
					if (bio.ui.style.isBlur) bio.img.getItem(this.art.ix, this.alb.ix);
					bio.img.setCheckArr(null);
				}
				this.calcText = true;
				break;
		}
		if (bioSet.text_only) bio.seeker.upd(true);
		if (bioSet.filmStripOverlay && bioSet.showFilmStrip) bio.filmStrip.set(bioSet.filmStripPos);
		bio.but.refresh(true);
	}

	move(x, y, click) {
		this.trace.film = false;
		this.trace.text = false;
		this.trace.image = false;
		if (bio.filmStrip.trace(x, y)) this.trace.film = true;
		else if (bioSet.text_only) this.trace.text = true;
		else if (bioSet.img_only) this.trace.text = false;
		else if (bioSet.style < 4) {
			switch (bioSet.style) {
				case 0:
					this.trace.text = y > this.img.t + this.style.imgSize;
					break;
				case 1:
					this.trace.text = x < this.w - this.style.imgSize - this.img.r;
					break;
				case 2:
					this.trace.text = y < this.img.t;
					break;
				case 3:
					this.trace.text = x > this.img.l + this.style.imgSize;
					break;
			}
		} else this.trace.text = y > this.tbox.t && y < this.tbox.t + this.tbox.h && x > this.tbox.l && x < this.tbox.l + this.tbox.w;
		if (!this.trace.text && !this.trace.film) this.trace.image = bio.img.trace(x, y);
		if (!bioSet.autoEnlarge || click || this.zoom() || bio.seeker.dn) return;
		const enlarged_img_o = this.style.enlarged_img;
		this.style.enlarged_img = !this.trace.text && this.trace.image;
		if (this.style.enlarged_img && !bioSet.text_only && !bioSet.img_only && !enlarged_img_o) this.mode(1);
	}

	on_notify(info) {
		const rec = $Bio.jsonParse(info, false);
		this.style.free.forEach(v => {
			if (v.name == rec.name) rec.name = `${rec.name} New`;
		});
		this.style.free.push(rec);
		this.sort(this.style.free, 'name');
		bioSet.styleFree = JSON.stringify(this.style.free);
		this.getStyleNames();
	}

	q(n) {
		return n.split('').reverse().join('');
	}

	renameStyle(n) {
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				if (!input || input == this.style.name[n]) return false;
				this.style.free.forEach(v => {
					if (v.name == input) input = `${input} New`;
				});
				this.style.free[n - 6].name = input;
				this.sort(this.style.free, 'name');
				bioSet.styleFree = JSON.stringify(this.style.free);
				this.style.free.some((v, i) => {
					if (v.name == input) {
						bioSet.style = i + 5;
						return true;
					}
				});
				this.getStyleNames();
				window.Repaint();
			}
		};
		const caption = 'Rename Current Style';
		const prompt = `Rename style: ${this.style.name[n]}\n\nEnter new name\n\nContinue?`;
		const fallback = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.input(caption, prompt, ok_callback, '', this.style.name[n]) : true;
		if (fallback) {
			let ns = '';
			let status = 'ok';
			try {
				ns = utils.InputBox(0, prompt, caption, this.style.name[n], true);
			} catch (e) {
				status = 'cancel';
			}
			ok_callback(status, ns);
		}
	}

	resetAlbumHistory() {
		this.alb.ix = 0;
		this.lock = 0;
		this.alb.history = [];
		bioSet.albumHistory = JSON.stringify([]);
		this.alb.cur = '';
		this.getList(true, true);
	}

	resetArtistHistory() {
		this.art.ix = 0;
		this.lock = 0;
		this.art.history = [];
		bioSet.artistHistory = JSON.stringify([]);
		this.art.cur = '';
		this.getList(true);
	}

	resetStyle(n) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				if (bioSet.style < 4) bioSet.rel_imgs = 0.65;
				else {
					const obj = bioSet.style == 4 || bioSet.style == 5 ? this.style.overlay : this.style.free[bioSet.style - 6];
					obj.name = this.style.name[n];
					obj.imL = 0;
					obj.imR = 0;
					obj.imT = 0;
					obj.imB = 0;
					obj.txL = 0;
					obj.txR = 0;
					obj.txT = 0.632;
					obj.txB = 0;
					bioSet.style == 4 || bioSet.style == 5 ? bioSet.styleOverlay = JSON.stringify(this.style.overlay) : bioSet.styleFree = JSON.stringify(this.style.free);
				}
				bio.txt.refresh(3);
			}
		};
		const caption = 'Reset Current Style';
		const prompt = `Reset to Default ${bioSet.style < 5 ? this.style.name[n] : 'Overlay'} Style.\n\nContinue?`;
		const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	sameStyle() {
		return bioSet.sameStyle || (bioSet.bioMode == bioSet.revMode && bioSet.bioStyle == bioSet.revStyle);
	}

	setBorder(imgFull, bor, refl) {
		if (imgFull) {
			const value = bor > 1 && !refl ? 10 * $Bio.scale : 0;
			$Bio.key.forEach(v => this.bor[v] = value);
		} else {
			$Bio.key.forEach(v => this.bor[v] = bor < 2 || refl ? bioSet[`bor${v.toUpperCase()}`] : Math.max(bioSet[`bor${v.toUpperCase()}`], 10 * $Bio.scale));
			this.style.gap = bor < 2 || refl ? bioSet.gap : Math.max(bioSet.gap, 10 * $Bio.scale);
		}
	}

	setStyle(bypass) {
		this.sbar.offset = [2 + bio.ui.sbar.arrowPad, Math.max(Math.floor(bio.ui.sbar.but_w * 0.2), 2) + bio.ui.sbar.arrowPad * 2, 0][bio.ui.sbar.type];
		this.sbar.top_corr = [this.sbar.offset - (bio.ui.sbar.but_h - bio.ui.sbar.but_w) / 2, this.sbar.offset, 0][bio.ui.sbar.type];
		const bot_corr = [(bio.ui.sbar.but_h - bio.ui.sbar.but_w) / 2 - this.sbar.offset, -this.sbar.offset, 0][bio.ui.sbar.type];
		this.clip = false;
		if (!bioSet.sameStyle) {
			switch (true) {
				case bioSet.artistView:
					if (bioSet.bioMode === 1) {
						bioSet.img_only = true;
						bioSet.text_only = false;
					} else if (bioSet.bioMode === 2) {
						bioSet.img_only = false;
						bioSet.text_only = true;
					} else {
						bioSet.img_only = false;
						bioSet.text_only = false;
						bioSet.style = bioSet.bioStyle;
					}
					break;
				case !bioSet.artistView:
					if (bioSet.revMode === 1) {
						bioSet.img_only = true;
						bioSet.text_only = false;
					} else if (bioSet.revMode === 2) {
						bioSet.img_only = false;
						bioSet.text_only = true;
					} else {
						bioSet.img_only = false;
						bioSet.text_only = false;
						bioSet.style = bioSet.revStyle;
					}
					break;
			}
			if (bioSet.text_only) bio.seeker.upd(true);
		}

		const sp1 = SCALE(10 * $Bio.scale);
		const sp2 = sp1 + (this.filmStripSize.r && !bioSet.filmStripOverlay ? ((SCALE(grSet.layout === 'artwork' ? 12 : 9) * $Bio.scale)) : 0);
		const filmStripRight = bioSet.artistView && bioSet.showFilmStrip && bioSet.filmStripPos === 1;
		const filmStripLeft = bioSet.artistView && bioSet.showFilmStrip && bioSet.filmStripPos === 3;
		const RES_4K_Corr = HD_4K(0, bio.ui.heading.linePad * 0.5);
		const biographyFontSize = SCALE((RES._4K ? grSet.biographyFontSize_layout - 0 : grSet.biographyFontSize_layout) || 14);

		switch (true) {
			case bioSet.img_only: { // img_only
				$Bio.key.forEach(v => this.img[v] = this.bor[v]);
				const autoFill = bioSet.artistView && bioSet.artStyleImgOnly == 1 || !bioSet.artistView && bioSet.covStyleImgOnly == 1;
				if (!autoFill && !bioSet.filmStripOverlay) {
					const v = $Bio.key[bioSet.filmStripPos];
					this.img[v] += this.filmStripSize[v];
					this.style.imgSize = $Bio.clamp(this.h - this.img.t - this.img.b, 10, this.w - this.img.l - this.img.r);
				} else this.style.imgSize = $Bio.clamp(this.h - this.bor.t - this.bor.b, 10, this.w - this.bor.l - this.bor.r);
				break;
			}

			case bioSet.text_only: { // text_only
				const textWidthCorr  = filmStripRight ? bioSet.filmStripOverlay ? this.text.r + this.filmStripSize.r * 0.5 - this.style.gap : this.text.r : this.text.r * 2;
				const textWidthCorr2 = filmStripLeft  ? this.text.r - this.style.gap - RES_4K_Corr : 0;
				const sbarScrollCorr = filmStripRight ? bioSet.filmStripOverlay ? this.text.r - (this.filmStripSize.r + this.style.gap) : 0 : 0;

				this.lines_drawn = Math.max(Math.floor((this.h - bioSet.textT - bioSet.textB - bio.ui.heading.h - this.filmStripSize.t - this.filmStripSize.b) / bio.ui.font.main_h), 0);
				this.text.l = bioSet.textL + this.filmStripSize.l - textWidthCorr2;
				this.text.r = (bioSet.sbarShow ? Math.max(bioSet.textR, bio.ui.sbar.sp + sp2) : bioSet.textR) + this.filmStripSize.r;
				/** MOD */ this.text.t = !bioSet.topAlign ? bio.ui.y + bioSet.textT + (this.h - bioSet.textT + this.filmStripSize.t - bioSet.textB - this.filmStripSize.b - this.lines_drawn * bio.ui.font.main_h + bio.ui.heading.h) / 2 : bioSet.textT + bio.ui.heading.h + this.filmStripSize.t;
				/** MOD */ this.text.w = this.w - this.text.l - textWidthCorr;
				this.text.h = this.lines_drawn * bio.ui.font.main_h;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : bioSet.textL;
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - bioSet.textR;
				if (bioSet.sbarShow) {
					/** MOD */ this.sbar.x = (!this.filmStripSize.r || bioSet.filmStripOverlay ? this.w - bio.ui.sbar.sp - this.text.r : this.text.l + this.text.w + sp1) + sbarScrollCorr;
					this.sbar.y = (bio.ui.sbar.type < this.sbar.style || this.filmStripSize.t || this.filmStripSize.r || this.filmStripSize.b ? this.text.t : 0) + this.sbar.top_corr;
					this.sbar.h = (bio.ui.sbar.type < this.sbar.style || this.filmStripSize.t || this.filmStripSize.r || this.filmStripSize.b ? bio.ui.font.main_h * this.lines_drawn + bot_corr : this.h - this.sbar.y) + bot_corr;
				}
				this.repaint.x = this.text.l;
				this.repaint.y = 0;
				this.repaint.w = this.w - this.repaint.x - this.filmStripSize.r;
				this.repaint.h = this.h - this.filmStripSize.b;
				break;
			}

			case bioSet.style === 0: { // top
				const textWidthCorr  = filmStripRight && !bioSet.filmStripOverlay ? this.text.r + RES_4K_Corr : this.text.r * 2;
				const textWidthCorr2 = filmStripLeft  && !bioSet.filmStripOverlay ? this.filmStripSize.l - this.text.r + this.style.gap + RES_4K_Corr : 0;

				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 'b' ? (!bioSet.filmStripOverlay ? this.filmStripSize[v] : 0) : 0));
				/** MOD */ let txt_h = Math.round((this.h - this.img.t - bioSet.textB - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0)) * (1 - bioSet.rel_imgs) + biographyFontSize);
				this.lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				this.text.h = this.lines_drawn * bio.ui.font.main_h + biographyFontSize;
				txt_h = this.text.h + this.style.gap;
				/** MOD */ this.style.imgSize = Math.max(this.h - txt_h - this.img.t - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) - bioSet.textB - bio.ui.heading.h * 0.75, 10);
				/** MOD */ this.text.l = bioSet.textL + textWidthCorr2;
				this.text.r = (bioSet.sbarShow ? Math.max(bioSet.textR, bio.ui.sbar.sp + sp2) : bioSet.textR) + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0);
				/** MOD */ this.text.t = this.img.t + this.style.imgSize + this.style.gap + bio.ui.heading.h * 2;
				/** MOD */ this.text.w = this.w - this.text.l - textWidthCorr;
				this.heading.x = (!this.style.fullWidthHeading ? this.text.l : bioSet.textL);
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - bioSet.textL - bioSet.textR;
				/** MOD */ this.sbar.x = (!this.filmStripSize.r || bioSet.filmStripOverlay ? this.w - bio.ui.sbar.sp - this.text.r : this.text.l + this.text.w + sp1);
				this.sbar.y = (bio.ui.sbar.type < this.sbar.style || bioSet.heading || this.filmStripSize.b ? this.text.t : this.img.t + this.style.imgSize) + this.sbar.top_corr;
				this.sbar.h = (bio.ui.sbar.type < this.sbar.style || this.filmStripSize.b ? bio.ui.font.main_h * this.lines_drawn + bot_corr : this.h - this.sbar.y) + bot_corr;
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				/** MOD */ this.repaint.w = this.w - this.repaint.x - (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0) - (bioSet.filmStripPos === 1 ? 0 : this.text.r);
				/** MOD */ this.repaint.h = this.h - this.repaint.y - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) + bio.ui.y;
				break;
			}

			case bioSet.style === 1: { // right
				const textWidthCorr1 = filmStripLeft  && !bioSet.filmStripOverlay ? this.style.gap + SCALE(bio.ui.heading.linePad) - SCALE(grSet.layout === 'artwork' ? 10 : 0) : 0;
				const textWidthCorr2 = filmStripRight && !bioSet.filmStripOverlay ? this.style.gap + SCALE(bio.ui.heading.linePad) - SCALE(grSet.layout === 'artwork' ? 10 : 0) : 0;

				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 'l' ? (!bioSet.filmStripOverlay ? this.filmStripSize[v] : 0) : 0));
				let txt_sp = Math.round((this.w - bioSet.textL - (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0) - this.img.r) * (1 - bioSet.rel_imgs));
				const txt_h = this.h - bioSet.textT - bioSet.textB - (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0) - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0);
				this.lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				this.style.imgSize = Math.max(this.w - txt_sp - this.img.r - bioSet.textL - (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0) - this.style.gap, 10);
				if (bioSet.sbarShow) txt_sp -= (bio.ui.sbar.sp + sp1);
				/** MOD */ this.text.l = bioSet.textL + (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0) - textWidthCorr1;
				this.text.r = bioSet.sbarShow ? Math.max(bioSet.textR + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0), bio.ui.sbar.sp + sp1) : bioSet.textR + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0);
				/** MOD */ this.text.t = !bioSet.topAlign ? bio.ui.y + bioSet.textT + (this.h - bioSet.textT - bioSet.textB + (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0) - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) - this.lines_drawn * bio.ui.font.main_h + bio.ui.heading.h) / 2 : bioSet.textT + bio.ui.heading.h + (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0);
				/** MOD */ this.text.w = txt_sp + textWidthCorr1 + textWidthCorr2;
				this.text.h = this.lines_drawn * bio.ui.font.main_h;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : bioSet.textL;
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - this.bor.r;
				/** MOD */ if (this.style.fullWidthHeading) this.img.t = this.text.t - bio.ui.y + HD_4K(bio.ui.heading.linePad * 0.5, bio.ui.heading.linePad * 1.5);
				/** MOD */ this.img.l = bioSet.textL + txt_sp + (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0) + this.style.gap + (bioSet.sbarShow ? bio.ui.sbar.sp + sp1 : 0) + textWidthCorr2;
				/** MOD */ this.sbar.x = this.text.l + this.text.w + sp1 - RES_4K_Corr;
				this.sbar.y = (bio.ui.sbar.type < this.sbar.style || bioSet.heading || this.filmStripSize.t || this.filmStripSize.b ? this.text.t : 0) + this.sbar.top_corr;
				this.sbar.h = bio.ui.sbar.type < this.sbar.style || this.filmStripSize.t || this.filmStripSize.b ? bio.ui.font.main_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar.y + bot_corr;
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				this.repaint.w = this.img.l - this.repaint.x - this.style.gap;
				/** MOD */ this.repaint.h = this.h - this.repaint.y - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) + bio.ui.y;
				break;
			}

			case bioSet.style === 2: { // bottom
				const textWidthCorr  = filmStripRight && !bioSet.filmStripOverlay ? this.text.r + RES_4K_Corr : this.text.r * 2;
				const textWidthCorr2 = filmStripLeft  && !bioSet.filmStripOverlay ? this.filmStripSize.l - this.text.r + this.style.gap + RES_4K_Corr : 0;

				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 't' && v != 'b' ? (!bioSet.filmStripOverlay ? this.filmStripSize[v] : 0) : 0));
				/** MOD */ let txt_h = Math.round((this.h - bioSet.textT - this.img.b - (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0) - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0)) * (1 - bioSet.rel_imgs) + biographyFontSize);
				this.lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				this.text.h = this.lines_drawn * bio.ui.font.main_h;
				txt_h = this.text.h + this.style.gap;
				this.style.imgSize = Math.max(this.h - txt_h - bioSet.textT - this.img.b - (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0) - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) - bio.ui.heading.h, 10);
				this.img.t = this.h - this.bor.b - this.style.imgSize - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0);
				/** MOD */ this.img.l = this.text.l;
				/** MOD */ this.text.l = bioSet.textL + textWidthCorr2;
				this.text.r = (bioSet.sbarShow ? Math.max(bioSet.textR, bio.ui.sbar.sp + sp2) : bioSet.textR) + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0);
				/** MOD */ this.text.t = bio.ui.y + this.img.t - txt_h;
				/** MOD */ this.text.w = this.w - this.text.l - textWidthCorr;
				this.heading.x = (!this.style.fullWidthHeading ? this.text.l : bioSet.textL);
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - bioSet.textL - bioSet.textR;
				/** MOD */ this.sbar.x = (!this.filmStripSize.r || bioSet.filmStripOverlay ? this.w - bio.ui.sbar.sp - this.text.r : this.text.l + this.text.w + sp1);
				this.sbar.y = (bio.ui.sbar.type < this.sbar.style || bioSet.heading ? this.text.t : 0) + this.sbar.top_corr;
				this.sbar.h = bio.ui.sbar.type < this.sbar.style ? bio.ui.font.main_h * this.lines_drawn + bot_corr * 2 : this.img.t - this.sbar.y + bot_corr;
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				/** MOD */ this.repaint.w = this.w - this.repaint.x - (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0) - (bioSet.filmStripPos === 1 ? 0 : this.text.r);
				/** MOD */ this.repaint.h = this.img.t - this.repaint.y + bio.ui.y;
				break;
			}

			case bioSet.style === 3: { // left
				const textWidthCorr1 = filmStripLeft && !bioSet.filmStripOverlay ? this.style.gap - (grSet.layout === 'artwork' ? RES_4K_Corr * 2 : HD_4K(-bio.ui.heading.linePad, -bio.ui.heading.linePad * 1.5)) : -RES_4K_Corr;
				const textWidthCorr2 = filmStripLeft && !bioSet.filmStripOverlay ? this.text.r - this.style.gap - RES_4K_Corr : 0;
				const textWidthCorr3 = bioSet.artistView && bioSet.showFilmStrip && !bioSet.filmStripOverlay ? bioSet.filmStripPos === 1 ? RES_4K_Corr * 2 : bioSet.filmStripPos === 3 ? this.style.gap : this.text.r : this.text.r;

				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 'r' ? (!bioSet.filmStripOverlay ? this.filmStripSize[v] : 0) : 0));
				this.text.r = (bioSet.sbarShow ? Math.max(bioSet.textR, bio.ui.sbar.sp + sp2) : bioSet.textR) + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0);
				const txt_sp = Math.round((this.w - this.img.l - this.text.r) * (1 - bioSet.rel_imgs));
				const txt_h = this.h - bioSet.textT - bioSet.textB - (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0) - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0);
				this.lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				this.style.imgSize = Math.max(this.w - txt_sp - this.img.l - this.text.r - this.style.gap, 10);
				/** MOD */ this.text.l = this.img.l + this.style.imgSize + this.style.gap - textWidthCorr1;
				/** MOD */ this.text.t = !bioSet.topAlign ? bio.ui.y + bioSet.textT + (this.h - bioSet.textT - bioSet.textB + (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0) - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) - this.lines_drawn * bio.ui.font.main_h + bio.ui.heading.h) / 2 : bioSet.textT + bio.ui.heading.h + (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0);
				/** MOD */ this.text.w = txt_sp - textWidthCorr3;
				this.text.h = this.lines_drawn * bio.ui.font.main_h;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : this.bor.l;
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - bioSet.textR;
				/** MOD */ if (this.style.fullWidthHeading) this.img.t = this.text.t - bio.ui.y + HD_4K(bio.ui.heading.linePad * 0.5, bio.ui.heading.linePad * 1.5);
				/** MOD */ this.img.l -= textWidthCorr2;
				/** MOD */ this.sbar.x = (!this.filmStripSize.r || bioSet.filmStripOverlay ? this.w - bio.ui.sbar.sp - this.text.r : this.text.l + this.text.w + sp1);
				this.sbar.y = (bio.ui.sbar.type < this.sbar.style || bioSet.heading || this.filmStripSize.t || this.filmStripSize.b ? this.text.t : 0) + this.sbar.top_corr;
				this.sbar.h = bio.ui.sbar.type < this.sbar.style || this.filmStripSize.t || this.filmStripSize.b ? bio.ui.font.main_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar.y + bot_corr;
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				/** MOD */ this.repaint.w = this.w - this.repaint.x - (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0) - (bioSet.showFilmStrip ? 0 : this.text.r);
				/** MOD */ this.repaint.h = this.h - this.repaint.y - (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0) + bio.ui.y;
				break;
			}

			case bioSet.style > 3: {
				const textWidthCorr  = filmStripRight && !bioSet.filmStripOverlay ? this.text.r + this.style.gap + RES_4K_Corr : this.text.r * 2;
				const textWidthCorr2 = filmStripLeft  ? bioSet.filmStripOverlay && bioSet.style === 4 ? this.filmStripSize.l : bioSet.filmStripOverlay && bioSet.style === 5 ? 0 : this.text.r - this.style.gap - RES_4K_Corr : 0;
				const sbarScrollCorr = filmStripRight ? bioSet.filmStripOverlay ? 0 : bioSet.style === 4 ? this.text.r - this.filmStripSize.r - this.style.gap - RES_4K_Corr : bioSet.style === 5 ? this.text.r - this.style.gap - RES_4K_Corr : 0 : 0;

				if (bioSet.style - 6 >= this.style.free.length) this.getStyleFallback();
				const obj = bioSet.style === 4 || bioSet.style === 5 ? this.style.overlay : this.style.free[bioSet.style - 6];
				if (!bypass) {
					this.im.l = $Bio.clamp(obj.imL, 0, 1);
					this.im.r = $Bio.clamp(obj.imR, 0, 1);
					this.im.t = $Bio.clamp(obj.imT, 0, 1);
					this.im.b = $Bio.clamp(obj.imB, 0, 1);
					this.tx.l = $Bio.clamp(obj.txL, 0, 1);
					this.tx.r = $Bio.clamp(obj.txR, 0, 1);
					this.tx.t = $Bio.clamp(obj.txT, 0, 1);
					this.tx.b = $Bio.clamp(obj.txB, 0, 1);
				}
				const imL = Math.round(this.im.l * this.w) + (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0);
				const imR = Math.round(this.im.r * this.w) + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0);
				const imT = Math.round(this.im.t * this.h) + (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0);
				const imB = Math.round(this.im.b * this.h) + (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0);
				const txL = bioSet.style === 4 ? 0 : Math.round(this.tx.l * this.w) + (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0);
				const txR = bioSet.style === 4 ? 0 : Math.round(this.tx.r * this.w) + (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0);
				/** MOD */ const txT = bioSet.style === 4 ? bio.ui.y : Math.round(this.tx.t * this.h) + (!bioSet.filmStripOverlay ? this.filmStripSize.t : 0);
				const txB = bioSet.style === 4 ? 0 : Math.round(this.tx.b * this.h) + (!bioSet.filmStripOverlay ? this.filmStripSize.b : 0);
				this.ibox.l = Math.max(imL, 0);
				this.ibox.t = Math.max(imT, 0);
				this.ibox.w = this.w - imL - imR;
				this.ibox.h = this.h - imT - imB;
				/** MOD */ this.img.l = bioSet.style === 4 ? 0 : this.bor.l; // this.img.l = bioSet.style === 4 ? 0 : imL + this.bor.l;
				/** MOD */ this.img.r = bioSet.style === 4 ? 0 : this.bor.r; // this.img.r = bioSet.style === 4 ? 0 : imR + this.bor.r;
				this.img.t = bioSet.style === 4 ? 0 : imT + this.bor.t;
				this.img.b = bioSet.style === 4 ? 0 : imB + this.bor.b;
				const t_l = (bioSet.style === 4 ? this.filmStripSize.l : 0) + bioSet.textL + bio.ui.overlay.borderWidth;
				const t_t = (bioSet.style === 4 ? this.filmStripSize.t : 0) + bioSet.textT + bio.ui.overlay.borderWidth;
				let t_r = (bioSet.style === 4 ? this.filmStripSize.r : 0) + bioSet.textR + bio.ui.overlay.borderWidth;
				let t_b = (bioSet.style === 4 ? this.filmStripSize.b : 0) + bioSet.textB + bio.ui.overlay.borderWidth;
				if ((bioSet.typeOverlay === 2 || bioSet.typeOverlay === 4) && bioSet.style !== 4) {
					t_r += 1;
					t_b += 1;
				}

				/** MOD */ const txt_h = Math.round((this.h - txT - txB - t_t - t_b) + bio.ui.heading.h);
				this.lines_drawn = Math.max(Math.floor((txt_h - bio.ui.heading.h) / bio.ui.font.main_h), 0);
				/** MOD */ this.text.l = txL + t_l - textWidthCorr2;
				this.text.r = txR + (bioSet.sbarShow ? Math.max(t_r, bio.ui.sbar.sp + sp1) : t_r);
				/** MOD */ this.text.t = bio.ui.y + txT + t_t;
				/** MOD */ this.text.w = this.w - this.text.l - textWidthCorr;
				this.text.h = this.lines_drawn * bio.ui.font.main_h;
				/** MOD */ this.heading.x = !this.style.fullWidthHeading ? this.text.l : bioSet.style === 4 ? bioSet.textL : Math.min(this.img.l, this.text.l, (!bioSet.filmStripOverlay ? this.filmStripSize.l : 0) ? bio.filmStrip.x : this.w);
				/** MOD */ this.heading.w = !this.style.fullWidthHeading ? this.text.w : bioSet.style === 4 ? this.w - this.heading.x * 2 : this.w - this.heading.x - Math.min(this.img.r, this.text.r, (!bioSet.filmStripOverlay ? this.filmStripSize.r : 0) ? this.w - bio.filmStrip.x - bio.filmStrip.w : this.w);
				this.tbox.l = Math.max(txL, 0);
				/** MOD */ this.tbox.t = bioSet.style === 4 ? 0 : Math.max(txT, 0) - bio.ui.heading.h * 0.5;
				this.tbox.w = this.w - Math.max(txL, 0) - Math.max(txR, 0);
				this.tbox.h = this.h - Math.max(txT, 0) - Math.max(txB, 0);
				this.style.minH = bio.ui.font.main_h + bio.ui.heading.h + t_t + t_b;
				if (bioSet.typeOverlay === 2 && bioSet.style !== 4) bio.ui.overlay.borderWidth = Math.max(Math.min(bio.ui.overlay.borderWidth, this.tbox.w / 3, this.tbox.h / 3), 1);
				if (bioSet.typeOverlay && bioSet.style !== 4) this.arc = Math.max(Math.min(bio.ui.font.main_h / 1.5, this.tbox.w / 3, this.tbox.h / 3), 1);
				this.clip = this.ibox.t + 100 < this.tbox.t && this.tbox.t < this.ibox.t + this.ibox.h && (this.tbox.l < this.ibox.l + this.ibox.w || this.tbox.l + this.tbox.w < this.ibox.l + this.ibox.w);
				this.style.imgSize = this.clip ? this.tbox.t - this.ibox.t : Math.min(this.h - imT - imB - this.bor.t - this.bor.b, this.w - imL - imR - this.bor.l - this.bor.r);
				/** MOD */ this.sbar.x = this.tbox.l + this.tbox.w - bio.ui.sbar.sp - bio.ui.overlay.borderWidth - this.text.r + (bioSet.style === 4 && bioSet.showFilmStrip && bioSet.filmStripOverlay ? this.filmStripSize.r : sbarScrollCorr);
				this.sbar.y = this.text.t + this.sbar.top_corr;
				this.sbar.h = bio.ui.font.main_h * this.lines_drawn + bot_corr * 2;
				this.repaint.x = this.tbox.l;
				/** MOD */ this.repaint.y = this.tbox.t + bio.ui.y;
				this.repaint.w = this.tbox.w;
				this.repaint.h = this.tbox.h;
				break;
			}
		}
		if (bio.ui.sbar.type === 2) {
			this.sbar.y += 1;
			this.sbar.h -= 2;
		}
		this.text.w = Math.max(this.text.w, 10);
		this.style.max_y = this.lines_drawn * bio.ui.font.main_h + this.text.t - bio.ui.font.main_h * 0.9;
		if (!this.id.init) bio.filmStrip.check();
		this.id.init = false;
	}

	setSummary() {
		this.summary = {
			date: bioSet.summaryShow && bioSet.summaryDate,
			genre: bioSet.summaryShow && bioSet.summaryGenre,
			latest: bioSet.summaryShow && bioSet.summaryLatest,
			locale: bioSet.summaryShow && bioSet.summaryLocale,
			other: bioSet.summaryShow && bioSet.summaryOther,
			popNow: bioSet.summaryShow && bioSet.summaryPopNow,
			show: bioSet.summaryShow
		};
	}

	sort(data, prop) {
		data.sort((artist, b) => {
			artist = artist[prop].toLowerCase();
			b = b[prop].toLowerCase();
			return artist.localeCompare(b);
		});
		return data;
	}

	stnd(artist, b) {
		return !artist || artist + 1 > b.length;
	}

	simTagTopLookUp() {
		const li = bioSet.artistView ? this.art : this.alb;
		return li.ix && li.list[li.ix] && li.list[li.ix].type != 'history';
	}

	stndItem() {
		return !this.art.ix && bioSet.artistView || !this.alb.ix && !bioSet.artistView;
	}

	tfBio(n, artist, focus) {
		n = n.replace(Regex.TFBioArtistConditional, '$&#@!%path%#@!').replace(Regex.TFBioArtist, $Bio.tfEscape(artist)).replace(Regex.TFBioAlbum, bioCfg.tf.album).replace(Regex.TFBioTitle, bioCfg.tf.title);
		n = $Bio.eval(n, focus);
		return n.replace(Regex.BioMarkerTFProtected, '');
	}

	tfRev(n, albumArtist, album, focus) {
		n = n.replace(Regex.TFBioAlbumArtistConditional, '$&#@!%path%#@!').replace(Regex.TFBioAlbumArtist, $Bio.tfEscape(albumArtist)).replace(Regex.TFBioAlbum, $Bio.tfEscape(album)).replace(Regex.TFBioTitle, bioCfg.tf.title);
		n = $Bio.eval(n, focus);
		return n.replace(Regex.BioMarkerTFProtected, '');
	}

	text_paint() {
		window.RepaintRect(this.repaint.x, this.repaint.y, this.repaint.w, this.repaint.h);
	}

	uniqAlbum(artist) {
		const flags = [];
		let result = [];
		artist.forEach(v => {
			const name = `${v.artist.toLowerCase()} - ${v.album.toLowerCase()}`;
			if (flags[name]) return;
			result.push(v);
			flags[name] = true;
		});
		return result = result.filter(v => v.type != 'label');
	}

	uniqArtist(artist) {
		const flags = [];
		const result = [];
		artist.forEach(v => {
			if (flags[v.name]) return;
			result.push(v);
			flags[v.name] = true;
		});
		return result;
	}

	updateNeeded() {
		switch (true) {
			case bioSet.artistView:
				this.id.curArtist = this.id.artist;
				this.id.artist = $Bio.eval(this.art.fields, this.id.focus);
				return !this.id.lookUp ? true : this.id.artist != this.id.curArtist || !this.art.list.length || !this.art.ix;
			case !bioSet.artistView:
				this.id.curAlb = this.id.alb;
				this.id.alb = bio.name.albID(this.id.focus, 'simple');
				if (this.style.inclTrackRev) {
					this.id.curTr = this.id.tr;
					this.id.tr = bio.name.trackID(this.id.focus);
				} else this.id.curTr = this.id.tr = '';
				return !this.id.lookUp ? true : this.id.alb != this.id.curAlb || this.id.tr != this.id.curTr || !this.alb.list.length || !this.alb.ix;
		}
	}

	zoom() {
		return bio.vk.k('shift') || bio.vk.k('ctrl');
	}
}
