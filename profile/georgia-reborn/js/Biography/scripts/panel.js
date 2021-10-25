class PanelBio {
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
		}

		this.serverBio = true;
		window.NotifyOthers('bio_notServer', 0);
		this.tf = {};
		this.w = 0;

		this.alb = {
			cur: '',
			init: [],
			ix: 0,
			list: [],
			history: $Bio.jsonParse(pptBio.albumHistory, []),
			uniq: []
		}

		this.art = {
			cur: '',
			fields: cfg.artFields.map(v => '%' + v + '%'),
			history: $Bio.jsonParse(pptBio.artistHistory, []),
			init: [],
			ix: 0,
			list: [],
			similar: [],
			topAlbums: [],
			uniq: []
		}

		this.bor = {
			t: pptBio.borL,
			r: pptBio.borR,
			b: pptBio.borB,
			l: pptBio.borL
		}

		this.filmStripSize = {
			t: 0,
			r: 0,
			b: 0,
			l: 0
		}

		this.heading = {
			x: 0,
			w: 200
		}

		this.ibox = {
			l: 0,
			t: 0,
			w: 100,
			h: 100
		}

		this.id = {
			alb: '',
			curAlb: '',
			artist: '',
			curArtist: '',
			last_pressed_coord: {
				x: -1,
				y: -1
			},
			lockAlb: '',
			lockArt: '',
			imgText: pptBio.imgText || pptBio.lookUp == 2,
			init: true,
			loadTimestamp: Date.now(),
			tr: '',
			curTr: ''
		}

		this.im = {
			t: 0,
			r: 100,
			b: 100,
			l: 0
		}

		this.img = {
			t: 0,
			r: 20,
			b: 0,
			l: 20
		}

		this.logo = {
			img: null
		}

		this.repaint = {
			x: 0,
			y: 0,
			w: 100,
			h: 100
		}

		this.sbar = {
			offset: 0,
			x: 0,
			y: 0,
			h: 100,
			style: !pptBio.sbarFullHeight ? 2 : 0,
			top_corr: 0
		}

		this.style = {
			cycTimeItem: Math.max(pptBio.cycTimeItem, 30),
			enlarged_img: false,
			free: $Bio.jsonParse(pptBio.styleFree, false),
			fullWidthHeading: pptBio.heading && pptBio.fullWidthHeading,
			gap: pptBio.gap,
			imgSize: 0,
			inclTrackRev: pptBio.inclTrackRev,
			max_y: 0,
			minH: 50,
			moreTags: false,
			name: [],
			new: false,
			overlay: $Bio.jsonParse(pptBio.styleOverlay, false),
			showFilmStrip: false
		}

		this.tbox = {
			l: 0,
			t: 0,
			w: 100,
			h: 100
		}

		this.text = {
			l: 20,
			t: 20,
			r: 20,
			w: 100,
			h: 100
		}

		this.trace = {
			film: false,
			image: false,
			text: false
		}

		this.tx = {
			t: 0,
			r: 100,
			b: 100,
			l: 0
		}

		this.similarArtistsKey = 'Similar Artists: |\\u00c4hnliche K\\u00fcnstler: |Artistas Similares: |Artistes Similaires: |Artisti Simili: |\\u4f3c\\u3066\\u3044\\u308b\\u30a2\\u30fc\\u30c6\\u30a3\\u30b9\\u30c8: |Podobni Wykonawcy: |Artistas Parecidos: |\\u041f\\u043e\\u0445\\u043e\\u0436\\u0438\\u0435 \\u0438\\u0441\\u043f\\u043e\\u043b\\u043d\\u0438\\u0442\\u0435\\u043b\\u0438: |Liknande Artister: |Benzer Sanat\\u00e7\\u0131lar: |\\u76f8\\u4f3c\\u827a\\u672f\\u5bb6: '; this.d = parseFloat(this.q('0000029142')); this.lfm = this.q($Bio.s);
		this.topAlbumsKey = 'Top Albums: |Top-Alben: |\\u00c1lbumes M\\u00e1s Escuchados: |Top Albums: |Album Pi\\u00f9 Ascoltati: |\\u4eba\\u6c17\\u30a2\\u30eb\\u30d0\\u30e0: |Najpopularniejsze Albumy: |\\u00c1lbuns Principais: |\\u041f\\u043e\\u043f\\u0443\\u043b\\u044f\\u0440\\u043d\\u044b\\u0435 \\u0430\\u043b\\u044c\\u0431\\u043e\\u043c\\u044b: |Toppalbum: |En Sevilen Alb\\u00fcmler: |\\u6700\\u4f73\\u4e13\\u8f91: ';

		this.focusLoad = $Bio.debounce(() => {
			if (!pptBio.img_only) txt.on_playback_new_track();
			if (!pptBio.text_only || uiBio.style.isBlur || pptBio.showFilmStrip) imgBio.on_playback_new_track();
		}, 250, {
			'leading': true,
			'trailing': true
		});

		this.focusServer = $Bio.debounce(() => {
			this.changed();
		}, 5000, {
			'leading': true,
			'trailing': true
		});

		this.lookUpServer = $Bio.debounce(() => {
			this.callServer(false, pptBio.focus, 'bio_lookUpItem', 0);
		}, 1500);

		if (!this.style.free || !$Bio.isArray(this.style.free)) {
			pptBio.set('SYSTEM.Freestyle Custom BackUp', pptBio.styleFree);
			this.style.free = [];
			pptBio.styleFree = JSON.stringify(this.style.free);
			fb.ShowPopupMessage('Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to "SYSTEM.Freestyle Custom BackUp" in panelBio properties.', 'Biography');
		} else {
			let valid = true;
			this.style.free.forEach(v => {
				if (!$Bio.objHasOwnProperty(v, 'name') || isNaN(v.imL) || isNaN(v.imR) || isNaN(v.imT) || isNaN(v.imB) || isNaN(v.txL) || isNaN(v.txR) || isNaN(v.txT) || isNaN(v.txB)) valid = false;
			});
			if (!valid) {
				pptBio.set('SYSTEM.Freestyle Custom BackUp', pptBio.styleFree);
				this.style.free = [];
				pptBio.styleFree = JSON.stringify(this.style.free);
				fb.ShowPopupMessage('Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to "SYSTEM.Freestyle Custom BackUp" in panelBio properties.', 'Biography');
			}
		}
		if (!this.style.overlay || !$Bio.objHasOwnProperty(this.style.overlay, 'name') || isNaN(this.style.overlay.imL) || isNaN(this.style.overlay.imR) || isNaN(this.style.overlay.imT) || isNaN(this.style.overlay.imB) || isNaN(this.style.overlay.txL) || isNaN(this.style.overlay.txR) || isNaN(this.style.overlay.txT) || isNaN(this.style.overlay.txB)) {
			pptBio.set('SYSTEM.Overlay BackUp', pptBio.styleOverlay);

			this.style.overlay = {
				'name': 'Overlay',
				'imL': 0,
				'imR': 0,
				'imT': 0,
				'imB': 0,
				'txL': 0,
				'txR': 0,
				'txT': 0.632,
				'txB': 0
			};

			pptBio.styleOverlay = JSON.stringify(this.style.overlay);
			fb.ShowPopupMessage('Unable to load "SYSTEM.Overlay".\n\nThe save location was corrupt. The overlay style has been reset to default.\n\nThe original should be backed up to "SYSTEM.Overlay BackUp" in panelBio properties.', 'Biography');
		}

		this.getStyleNames();
	}

	// Methods

	albumsSame() {
		if (pptBio.lookUp && this.alb.ix && this.alb.list.length && JSON.stringify(this.alb.init) === JSON.stringify(this.alb.list)) return true;
		return false;
	}

	artistsSame() {
		if (pptBio.lookUp && this.art.ix && this.art.list.length && JSON.stringify(this.art.init) === JSON.stringify(this.art.list)) return true;
		return false;
	}

	block() {
		return this.w <= 10 || this.h <= 10 || !window.IsVisible;
	}

	callServer(force, focus, notify, type) {
		switch (type) {
			case 0:
				if (this.serverBio) serverBio.download(force, {
					ix: this.art.ix,
					focus: focus,
					arr: this.art.list.slice(0)
				}, {
					ix: this.alb.ix,
					focus: focus,
					arr: this.alb.list.slice(0)
				});
				else window.NotifyOthers(notify, [{
					ix: this.art.ix,
					focus: focus,
					arr: this.art.list.slice(0)
				}, {
					ix: this.alb.ix,
					focus: focus,
					arr: this.alb.list.slice(0)
				}]);
				break;
			case 1:
				serverBio.download(force, {
					ix: this.art.ix,
					focus: focus,
					arr: this.art.list.slice(0)
				}, {
					ix: this.alb.ix,
					focus: focus,
					arr: this.alb.list.slice(0)
				});
				break;
		}
	}

	changed() {
		if (pptBio.focus || !fb.IsPlaying) this.callServer(false, pptBio.focus, 'bio_lookUpItem', 0);
		else if (this.serverBio) this.callServer(false, pptBio.focus, '', 1);
	}

	cleanPth(pth, item, type, artist, album, bio) {
		pth = pth.trim().replace(/\//g, '\\');
		if (pth.toLowerCase().includes('%profile%')) {
			let fbPth = fb.ProfilePath.replace(/'/g, "''").replace(/(\(|\)|\[|\]|%|,)/g, "'$1'");
			if (fbPth.includes('$')) {
				const fbPthSplit = fbPth.split('$');
				fbPth = fbPthSplit.join("'$$'");
			}
			pth = pth.replace(/%profile%(\\|)/gi, fbPth);
		}
		switch (type) {
			case 'remap':
				pth = bio ? this.tfBio(pth, artist, item) : this.tfRev(pth, artist, album, item);
				break;
			case 'serverBio':
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

		let UNC = pth.startsWith('\\\\');
		if (UNC) pth = pth.replace('\\\\', '');
		if (!pth.endsWith('\\')) pth += '\\';

		const c_pos = pth.indexOf(':');
		pth = pth.replace(/[/|:]/g, '-').replace(/\*/g, 'x').replace(/"/g, "''").replace(/[<>]/g, '_').replace(/\?/g, '').replace(/\\\./g, '\\_').replace(/\.+\\/, '\\').replace(/\s*\\\s*/g, '\\');
		if (c_pos < 3 && c_pos != -1) pth = $Bio.replaceAt(pth, c_pos, ':');

		while (pth.includes('\\\\')) pth = pth.replace(/\\\\/g, '\\_\\');
		if (UNC) pth = `\\\\${pth}`;
		return pth.trim();
	}

	changeView(x, y, menu) {
		if (!menu && (this.zoom() || x < 0 || y < 0 || x > this.w || y > this.h || butBio.Dn)) return false;
		if (!menu && !pptBio.dblClickToggle && this.isTouchEvent(x, y)) return false;
		if (!menu && txt.text && (!pptBio.img_only || pptBio.text_only) && txt.scrollbar_type().onSbar || butBio.trace('heading', x, y) || butBio.trace('lookUp', x, y)) return false;
		return true;

	}

	checkAutofilm() {
		if (!pptBio.showFilmStrip || !pptBio.autoFilm) return;
		const item = this.getItem();
		if (Date.now() - this.id.loadTimestamp > 1500) { // delay needed for correct sizing on init; ignored by click (sets loadTimestamp = 0);
			switch (item) {
				case 'stndArtist':
					!pptBio.lookUp ? txt.getText(true) : txt.getItem(true, this.art.ix, this.alb.ix);
					break;
				case 'stndAlbum':
					this.style.inclTrackRev != 1 || !pptBio.lookUp ? txt.getText(true) : txt.getItem(true, this.art.ix, this.alb.ix);
					break;
				case 'lookUp':
					txt.getItem(true, this.art.ix, this.alb.ix);
					break;
			}
			butBio.refresh(true);
			txt.getScrollPos();
			txt.paint();
		}
	}

	click(x, y, menu) {
		this.clicked = this.changeView(x, y, menu);
		if (!this.clicked) return;
		this.id.loadTimestamp = 0;
		txt.logScrollPos();
		filmStrip.logScrollPos();
		pptBio.toggle('artistView');
		imgBio.resetTimestamps();
		if (!this.sameStyle()) this.setStyle();
		txt.na = '';
		timerBio.clear(timerBio.source);
		if (this.calc) this.calc = pptBio.artistView ? 1 : 2;
		if (!this.lock && this.updateNeeded()) {
			this.getList(true);
			if (!pptBio.artistView) txt.albumReset();
		}
		const item = this.getItem();
		switch (item) {
			case 'stndArtist':
				!pptBio.lookUp ? txt.getText(this.calc) : txt.getItem(this.calc, this.art.ix, this.alb.ix);
				imgBio.getImages();
				break;
			case 'stndAlbum':
				this.style.inclTrackRev != 1 || !pptBio.lookUp ? txt.getText(this.calc) : txt.getItem(this.calc, this.art.ix, this.alb.ix);
				imgBio.getImages();
				break;
			case 'lookUp':
				txt.getItem(this.calc, this.art.ix, this.alb.ix);
				imgBio.getItem(this.art.ix, this.alb.ix);
				break;
		}
		if (pptBio.img_only) imgBio.setCrop(true);
		this.sameStyle() && !uiBio.show.btnRedLastfm ? butBio.check() : butBio.refresh(true);
		if (!pptBio.artistView) imgBio.setCheckArr(null);
		this.move(x, y, true);
		txt.getScrollPos();
		this.calc = false;
	}

	createStyle() {
		let ns;
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				ns = input;
			}
		}
		popUpBox.input('Create New Freestyle Layout', 'Enter new style name\n\nFreestyle layouts offer drag style positioning of image & text boxes + text overlay\n\nContinue?', ok_callback, '', 'My Style');
		if (!ns) return false;
		let lines_drawn, imgs, te_t;
		switch (pptBio.style) {
			case 0: {
				let txt_h = Math.round((this.h - this.bor.t - pptBio.textB) * (1 - pptBio.rel_imgs));
				lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h) / uiBio.font.main_h), 0);
				txt_h = lines_drawn * uiBio.font.main_h + this.style.gap;
				imgs = Math.max(this.h - txt_h - this.bor.t - pptBio.textB - uiBio.heading.h, 10);
				this.im.b = (this.h - this.bor.t - imgs - this.bor.b) / this.h;
				this.tx.t = (this.bor.t + imgs - pptBio.textT + this.style.gap) / this.h;
				this.im.l = 0;
				this.im.r = 0;
				this.im.t = 0;
				this.tx.l = 0;
				this.tx.r = 0;
				this.tx.b = 0;
				break;
			}
			case 1: {
				const txt_sp = Math.round((this.w - pptBio.textL - this.bor.r) * (1 - pptBio.rel_imgs));
				lines_drawn = Math.max(Math.floor((this.h - pptBio.textT - pptBio.textB - uiBio.heading.h) / uiBio.font.main_h), 0);
				te_t = !pptBio.topAlign ? pptBio.textT + (this.h - pptBio.textT - pptBio.textB - lines_drawn * uiBio.font.main_h + uiBio.heading.h) / 2 : pptBio.textT + uiBio.heading.h;
				this.im.l = (txt_sp + this.style.gap + (pptBio.sbarShow ? uiBio.sbar.sp + 10 : 0)) / this.w;
				this.tx.r = (this.w - (txt_sp + pptBio.textR)) / this.w;
				this.tx.t = (te_t - uiBio.heading.h - pptBio.textT) / this.h;
				this.im.r = 0;
				this.im.t = 0;
				this.im.b = 0;
				this.tx.l = 0;
				this.tx.b = 0;
				break;
			}
			case 2: {
				let txt_h = Math.round((this.h - pptBio.textT - this.bor.b) * (1 - pptBio.rel_imgs));
				lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h) / uiBio.font.main_h), 0);
				txt_h = lines_drawn * uiBio.font.main_h + this.style.gap;
				imgs = Math.max(this.h - txt_h - this.bor.b - pptBio.textT - uiBio.heading.h, 10);
				const img_t = this.h - this.bor.b - imgs;
				this.im.t = img_t / this.h;
				this.tx.b = (this.h - img_t - pptBio.textB + this.style.gap) / this.h;
				this.im.l = 0;
				this.im.r = 0;
				this.im.b = 0;
				this.tx.l = 0;
				this.tx.r = 0;
				this.tx.t = 0;
				break;
			}
			case 3: {
				const te_r = pptBio.sbarShow ? Math.max(pptBio.textR, uiBio.sbar.sp + 10) : pptBio.textR;
				const txt_sp = Math.round((this.w - this.bor.l - te_r) * (1 - pptBio.rel_imgs));
				imgs = Math.max(this.w - txt_sp - this.bor.l - te_r - this.style.gap, 10);
				lines_drawn = Math.max(Math.floor((this.h - pptBio.textT - pptBio.textB - uiBio.heading.h) / uiBio.font.main_h), 0);
				te_t = !pptBio.topAlign ? pptBio.textT + (this.h - pptBio.textT - pptBio.textB - lines_drawn * uiBio.font.main_h + uiBio.heading.h) / 2 : pptBio.textT + uiBio.heading.h;
				this.im.r = (this.w - this.bor.l - imgs - this.bor.r) / this.w;
				this.tx.l = (this.bor.l + imgs - pptBio.textL + this.style.gap) / this.w;
				this.tx.t = (te_t - uiBio.heading.h - pptBio.textT) / this.h;
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
		if (pptBio.style > 3 && (pptBio.img_only || pptBio.text_only)) {
			if (pptBio.style - 5 >= this.style.free.length) this.getStyleFallback();
			const obj = pptBio.style == 4 ? this.style.overlay : this.style.free[pptBio.style - 5];
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
			'name': ns,
			'imL': this.im.l,
			'imR': this.im.r,
			'imT': this.im.t,
			'imB': this.im.b,
			'txL': this.tx.l,
			'txR': this.tx.r,
			'txT': this.tx.t,
			'txB': this.tx.b
		})
		this.sort(this.style.free, 'name');
		pptBio.styleFree = JSON.stringify(this.style.free);
		this.style.free.some((v, i) => {
			if (v.name == ns) {
				if (pptBio.sameStyle) pptBio.style = i + 5;
				else if (pptBio.artistView) pptBio.bioStyle = i + 5;
				else pptBio.revStyle = i + 5;
				return true;
			}
		})
		this.getStyleNames();
		txt.refresh(0);
		timerBio.clear(timerBio.source);
		timerBio.source.id = setTimeout(() => {
			this.style.new = false;
			window.Repaint();
			timerBio.source.id = null;
		}, 10000);
		if (timerBio.source.id !== 0) {
			this.style.new = true;
			window.Repaint();
		}
	}

	deleteStyle(n) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				this.style.free.splice(n - 5, 1);
				pptBio.styleFree = JSON.stringify(this.style.free);
				pptBio.style = 0;
				if (!pptBio.sameStyle) {
					if (pptBio.artistView) pptBio.bioStyle = 0;
					else pptBio.revStyle = 0;
				}
				this.getStyleNames();
				txt.refresh(0);
			}
		}
		popUpBox.confirm('Delete Current Style', 'Delete: ' + this.style.name[n] + '\n\nStyle will be set to top', 'OK', 'Cancel', continue_confirmation);
	}

	draw(gr) {
		let font = uiBio.font.main;
		let str = 'POWERED by allmusic and last.fm.\r\n\r\nShift+middle click to activate / inactivate.';
		let textHeight2;

		const textHeight1 = Math.round(gr.MeasureString(str, font, 10, 0, this.w - 20, 1000, StringFormat(1, 1)).Height);
		const version = `  ${window.ScriptInfo.Name}: v${window.ScriptInfo.Version}`;
		const versionHeight = gr.CalcTextHeight(version, uiBio.font.small)
		const txtSp = this.h * 0.37;

		if (textHeight1 > txtSp) {
			str = str.replace('\r\n\r\n', ' ');
			textHeight2 = Math.round(gr.MeasureString(str, font, 10, 0, this.w - 20, 1000, StringFormat(1, 1)).Height);
			if (textHeight2 > txtSp) font = uiBio.font.small;
		}

		const textHeight3 = Math.round(gr.MeasureString(str, font, 10, 0, this.w - 20, 1000, StringFormat(1, 1)).Height);
		if (textHeight3 > txtSp) str = 'Shift+middle click to activate.';

		let textCol = uiBio.col.text;
		let textCol_h = uiBio.col.text_h;
		if (pptBio.theme > 0) {
			textCol = uiBio.dui ? window.GetColourDUI(0) : window.GetColourCUI(0);
			textCol_h = uiBio.dui ? window.GetColourDUI(2) : window.GetColourCUI(2);
		}

		gr.SetInterpolationMode(7);
		if (this.logo.img) gr.DrawImage(this.logo.img, this.logo.x, Math.max(this.logo.y, versionHeight), this.logo.w, this.logo.h, 0, 0, this.logo.img.Width, this.logo.img.Height);
		gr.SetInterpolationMode(0);
		gr.GdiDrawText(version, uiBio.font.small, textCol_h, 0, 0, this.w, this.h, 0x00000800);
		gr.GdiDrawText(str, font, textCol, 10, this.h - txtSp, this.w - 20, txtSp, txt.ncc);
	}

	exportStyle(n) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				window.NotifyOthers('bio_customStyle', JSON.stringify(this.style.free[n - 5]));
			}
		}
		popUpBox.confirm('Export Current Style To Other Biography Panels', 'Export: ' + this.style.name[n], 'OK', 'Cancel', continue_confirmation);

	}

	getItem() {
		if (!this.art.ix && pptBio.artistView) return 'stndArtist';
		if (!this.alb.ix && !pptBio.artistView) return 'stndAlbum';
		else return 'lookUp';
	}

	getList(p_clear) {
		if (!pptBio.lookUp) return;
		let artist = name.artist(pptBio.focus, true) || 'Artist Unknown';
		let albumArtist = name.albumArtist(pptBio.focus, true) || 'Artist Unknown';
		let album = name.album(pptBio.focus, true) || 'Album Unknown';
		if (this.lock) {
			this.logArtistHistory(artist);
			this.logAlbumHistory(albumArtist, album);
			return;
		}

		let k = 0;
		const lfmBio = this.cleanPth(cfg.pth.foLfmBio, pptBio.focus) + $Bio.clean(artist) + cfg.suffix.foLfmBio + '.txt';
		const lBio = $Bio.open(lfmBio);
		const lfmSim = this.cleanPth(cfg.pth.foLfmSim, pptBio.focus) + $Bio.clean(artist) + ' And Similar Artists.json';
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
		if (pptBio.showSimilarArtists) {
			if ($Bio.file(lfmSim)) {
				const lSim = $Bio.jsonParse(lfmSim, false, 'file');
				let newStyle = false;
				if (lSim) {
					if ($Bio.objHasOwnProperty(lSim[0], 'name')) newStyle = true;
					lSim.shift();
					$Bio.take(lSim, cfg.menuSimilarNum);
					if (lSim.length) {
						this.art.list.push({
							name: 'Similar Artists:',
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
			} else {
				if ($Bio.file(lfmBio)) {
					let found = false;
					sa = tagBio.getTag(lBio, this.similarArtistsKey).tag;
					if (sa.length < 7 && sa) {
						$Bio.take(sa, cfg.menuSimilarNum);
						found = true;
					}
					if (!found) {
						this.art.similar.some(v => {
							if (v.name == artist) {
								sa = $Bio.take(v.similar, cfg.menuSimilarNum);
								return found = true;
							}
						});
						if (!found) {
							const getSimilar = new LfmSimilarArtists(() => getSimilar.onStateChange(), this.getSimilar_search_done.bind(this));
							getSimilar.search(artist, '', '', 6);
						}
					}
					if (found && $Bio.isArray(sa) && sa.length) {
						this.art.list.push({
							name: 'Similar Artists:',
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
		}

		if (pptBio.showMoreTags) {
			this.style.moreTags = false;
			this.art.fields.forEach(v => {
				nm = v.replace(/%/g, '');
				for (let h = 0; h < $Bio.eval('$meta_num(' + nm + ')', pptBio.focus); h++) {
					mn = '$trim($meta(' + nm + ',' + h + '))';
					const name = $Bio.eval(mn, pptBio.focus);
					if (this.art.list.every(v => v.name !== name) && name.toLowerCase() != cfg.va.toLowerCase()) mult_arr.push({
						name: name,
						field: ' ~ ' + $Bio.titlecase(nm),
						type: 'tag'
					});
				}
			});
			if (mult_arr.length > 1) {
				this.sort(mult_arr, 'name');
				k = mult_arr.length;
				while (k--)
					if (k != 0 && mult_arr[k].name.toLowerCase() == mult_arr[k - 1].name.toLowerCase()) {
						if (!mult_arr[k - 1].field.toLowerCase().includes(mult_arr[k].field.toLowerCase())) mult_arr[k - 1].field += mult_arr[k].field;
						mult_arr.splice(k, 1);
					}
			}
			if (mult_arr.length) {
				this.style.moreTags = false;
				this.art.list.push({
					name: 'More Tags:',
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
			this.logAlbumHistory(albumArtist, album);
			this.style.inclTrackRev = pptBio.inclTrackRev;
			this.alb.cur = albumArtist + album;
		}

		if (this.art.history.length && pptBio.showArtistHistory) {
			this.art.list.push({
				name: 'Artist History:',
				field: '',
				type: 'label'
			});
			for (let h = 0; h < this.art.history.length; h++)
				if (h || this.art.history[0].name != artist) this.art.list.push(this.art.history[h]);
			this.art.list[this.art.list.length - 1].type = 'historyend';
		}

		this.art.list.forEach((v, i) => v.ix = i);
		this.art.uniq = this.art.list.filter(v => v.type != 'label');

		if (pptBio.showTopAlbums && $Bio.file(lfmBio)) {
			let found = false;
			ta = tagBio.getTag(lBio, this.topAlbumsKey).tag;
			if (ta.length < 7 && ta) found = true;
			if (!found) {
				this.art.topAlbums.some(v => {
					if (v.name == artist) {
						ta = $Bio.take(v.album, 6);
						return found = true;
					}
				});
				if (!found) {
					const getTopAlb = new LfmTopAlbums(() => getTopAlb.onStateChange(), this.getTopAlb_search_done.bind(this));
					getTopAlb.search(artist);
				}
			}
			this.alb.list = [];
			this.alb.list.push({
				artist: albumArtist,
				album: album,
				type: 'Current Album'
			});
			if (found && $Bio.isArray(ta) && ta.length) {
				this.alb.list.push({
					artist: 'Last.fm Top Albums: ' + artist + ':',
					album: 'Last.fm Top Albums: ' + artist + ':',
					type: 'label'
				});
				ta.forEach((v, i) => this.alb.list.push({
					artist: artist,
					album: v,
					type: i != ta.length - 1 ? 'album' : 'albumend'
				}));
			}
		} else {
			this.alb.list = [];
			this.alb.list.push({
				artist: albumArtist,
				album: album,
				type: 'Current Album'
			});
		}

		if (this.alb.history.length && pptBio.showAlbumHistory) {
			this.alb.list.push({
				artist: 'Album History:',
				album: 'Album History:',
				type: 'label'
			});
			for (let h = 0; h < this.alb.history.length; h++) {
				if (h || this.alb.history[0].artist != albumArtist || this.alb.history[0].album != album)
					this.alb.list.push(this.alb.history[h]);
			}
			this.alb.list[this.alb.list.length - 1].type = 'historyend';
		}

		this.alb.list.forEach((v, i) => v.ix = i);
		this.alb.uniq = this.uniqAlbum(this.alb.list);
		if (!this.artistsSame() && p_clear) this.art.ix = 0;
		if (!this.albumsSame() && p_clear) this.alb.ix = 0;
	}

	getLogo() {
		this.logo.img = my_utilsBio.getImageAsset('Logo.png');
		if (!this.logo.img) return;
		let scale = this.getScale(this.logo.img, this.w * Math.min(this.h * 0.8 / this.w, 0.9), this.h * 0.34);
		this.logo.w = scale[0];
		this.logo.h = scale[1];
		this.logo.x = (this.w - this.logo.w) / 2;
		this.logo.y = this.h * 0.05 + (this.h * 0.66 - this.logo.h) / 2;
	}

	getPth(sw, focus, artist, album, stnd, supCache, cleanArtist, cleanAlbumArtist, cleanAlbum, folder, basic, serverBio) {
		let fo, pth;
		switch (sw) {
			case 'bio':
				if (stnd === '') stnd = this.stnd(this.art.ix, this.art.list);
				if (serverBio) fo = stnd ? this.cleanPth(cfg.pth[folder], focus, 'serverBio') : this.cleanPth(cfg.remap[folder], focus, 'remap', artist, '', 1);
				else fo = stnd && !this.lock ? this.cleanPth(cfg.pth[folder], focus) : this.cleanPth(cfg.remap[folder], focus, 'remap', artist, '', 1);
				pth = fo + cleanArtist + cfg.suffix[folder] + '.txt';
				if (!stnd && supCache && !$Bio.file(pth)) fo = this.cleanPth(cfg.sup[folder], focus, 'remap', artist, '', 1);
				pth = fo + cleanArtist + cfg.suffix[folder] + '.txt';
				if (basic) return {
					fo: fo,
					pth: pth
				};
				else return [fo, pth, cleanArtist ? true : false, $Bio.file(pth)];
			case 'rev':
				if (stnd === '') stnd = this.stnd(this.alb.ix, this.alb.list);
				if (!stnd) cleanAlbumArtist = cleanArtist;
				if (serverBio) fo = stnd ? this.cleanPth(cfg.pth[folder], focus, 'serverBio') : this.cleanPth(cfg.remap[folder], focus, 'remap', artist, album, 0);
				else fo = stnd && !this.lock ? this.cleanPth(cfg.pth[folder], focus) : this.cleanPth(cfg.remap[folder], focus, 'remap', artist, album, 0);
				pth = fo + cleanAlbumArtist + ' - ' + cleanAlbum + cfg.suffix[folder] + '.txt';
				if (!stnd && supCache && !$Bio.file(pth)) fo = this.cleanPth(cfg.sup[folder], focus, 'remap', artist, album, 0);
				pth = fo + cleanAlbumArtist + ' - ' + cleanAlbum + cfg.suffix[folder] + '.txt';
				if (basic) return {
					fo: fo,
					pth: pth
				};
				else return [fo, pth, cleanAlbumArtist && cleanAlbum ? true : false, $Bio.file(pth)];
			case 'track':
				fo = this.cleanPth(cfg.remap[folder], focus, 'remap', artist, album, 0);
				pth = fo + cleanArtist + ' - ' + cleanAlbum + '.json';
				if (basic) return {
					fo: fo,
					pth: pth
				};
				else return [fo, pth, cleanArtist ? true : false, $Bio.file(pth)];
			case 'cov':
				fo = this.cleanPth(cfg.pth.foImgCov, focus, 'serverBio');
				pth = fo + $Bio.clean($Bio.eval(cfg.pth.fnImgCov, focus, true));
				return {
					fo: fo, pth: pth
				};
			case 'img': {
				fo = this.cleanPth(cfg.remap.foImgRev, focus, 'remap', artist, album, 0);
				const fn = $Bio.clean(artist + ' - ' + album);
				pth = fo + fn;
				if (supCache === undefined) return {
					fo: fo,
					fn: fn,
					pth: pth
				};
				const pe = [fo];
				if (supCache) pe.push(this.cleanPth(cfg.sup.foImgRev, focus, 'remap', artist, album, 0));
				return {
					pe: pe,
					fe: fn
				}
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
		pptBio.style = 4;
		if (!pptBio.sameStyle) {
			if (pptBio.artistView) pptBio.bioStyle = 4;
			else pptBio.revStyle = 4;
		}
		fb.ShowPopupMessage('Unable to locate style. Using overlay layout instead.', 'Biography');
	}

	getTopAlb_search_done(artist, list) {
		this.art.topAlbums.push({
			name: artist,
			album: list
		});
		this.getList(true);
	}

	getStyleNames() {
		this.style.name = ['Top', 'Right', 'Bottom', 'Left', 'Overlay'];
		this.style.free.forEach(v => this.style.name.push(v.name));
	}

	isRadioFocused() {
		if (this.lock) return true;
		const fid = plman.ActivePlaylist.toString() + plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist).toString();
		const np = plman.GetPlayingItemLocation();
		let pid = -2;
		if (np.IsValid) pid = plman.PlayingPlaylist.toString() + np.PlaylistItemIndex.toString();
		return fid == pid;
	}

	imgBoxTrace(x, y) {
		if (this.trace.film) return false;
		if (pptBio.style < 4) {
			switch (pptBio.style) {
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
		pptBio.toggle('panelActive');
		window.NotifyOthers('bio_status', pptBio.panelActive);
		window.Reload();
	}

	isRadio(focus) {
		return fb.IsPlaying && fb.PlaybackLength <= 0 && (!focus || this.isRadioFocused());
	}

	isTouchEvent(x, y) {
		return pptBio.touchControl && Math.sqrt((Math.pow(this.id.last_pressed_coord.x - x, 2) + Math.pow(this.id.last_pressed_coord.y - y, 2))) > 3 * $Bio.scale;
	}

	leave() {
		if (!pptBio.autoEnlarge || menBio.right_up) return;
		if (pptBio.img_only) {
			this.mode(0);
			this.style.enlarged_img = false;
		}
	}

	logAlbumHistory(albumArtist, album) {
		if (albumArtist != 'Artist Unknown' && album != 'Album Unknown') this.alb.history.unshift({
			artist: albumArtist,
			album: album,
			type: 'history'
		});
		this.alb.history = this.uniqAlbum(this.alb.history);
		if (this.alb.history.length > 20) this.alb.history.length = 20;
		pptBio.albumHistory = JSON.stringify(this.alb.history);
	}

	logArtistHistory(artist) {
		if (artist != 'Artist Unknown') this.art.history.unshift({
			name: artist,
			field: '',
			type: 'history'
		});
		this.art.history = this.uniqArtist(this.art.history);
		if (this.art.history.length > 20) this.art.history.length = 20;
		pptBio.artistHistory = JSON.stringify(this.art.history);
	}

	mbtn_up(x, y, menuLock) {
		if (x < 0 || y < 0 || x > this.w || y > this.h) return;
		if (pptBio.lookUp && (butBio.btns['lookUp'].trace(x, y) || menuLock)) {
			let mArtist = pptBio.artistView && this.art.ix;
			if (!this.lock && !mArtist) imgBio.artistReset();
			if (!this.lock) {
				this.id.lockArt = $Bio.eval(this.art.fields, pptBio.focus);
				this.id.lockAlb = name.albID(pptBio.focus, 'full') + (this.style.inclTrackRev ? name.trackID(pptBio.focus) : '');
				this.lockHandle = $Bio.handle(pptBio.focus);
				imgBio.setAlbID();
				 imgBio.cov.folder = panelBio.cleanPth(cfg.albCovFolder, pptBio.focus);
			}
			this.lock = this.lock == 0 || menuLock ? 1 : 0;
			txt.curHeadingID = this.lock ? txt.headingID() : '';
			if (!this.lock && (pptBio.artistView && this.id.lockArt != $Bio.eval(this.art.fields, pptBio.focus) || !pptBio.artistView && this.id.lockAlb != name.albID(pptBio.focus, 'full') + (this.style.inclTrackRev ? name.trackID(pptBio.focus) : ''))) {
				txt.on_playback_new_track(true);
				imgBio.on_playback_new_track(true);
			}
			butBio.check();
			window.Repaint();
			return;
		}
		switch (true) {
			case ((pptBio.img_only || pptBio.text_only) && !this.trace.film):
				this.mode(0);
				break;
			case this.trace.image:
				this.mode(txt.text ? 1 : 2);
				break;
			case this.trace.text:
				this.mode(2);
				break;
		}
		this.move(x, y, true);
	}

	mode(n) {
		if (!pptBio.sameStyle) pptBio.artistView ? pptBio.bioMode = n : pptBio.revMode = n;
		let calcText = true;
		filmStrip.logScrollPos();
		switch (n) {
			case 0: {
				calcText = this.calcText || pptBio.text_only;
				pptBio.img_only = false;
				pptBio.text_only = false;
				this.setStyle();
				imgBio.clearCache();
				if (calcText && !pptBio.sameStyle && (pptBio.bioMode != pptBio.revMode || pptBio.bioStyle != pptBio.revStyle)) calcText = pptBio.artistView ? 1 : 2;
				if (!this.art.ix && pptBio.artistView && !txt.bio.lookUp || !this.alb.ix && !pptBio.artistView && !txt.rev.lookUp) {
					txt.albumReset();
					txt.artistReset();
					txt.getText(calcText);
					imgBio.getImages();
				} else {
					txt.getItem(calcText, this.art.ix, this.alb.ix);
					imgBio.getItem(this.art.ix, this.alb.ix);
				}
				break;
			}
			case 1:
				pptBio.img_only = true;
				pptBio.text_only = false;
				imgBio.setCrop();
				this.setStyle();
				imgBio.clearCache();
				imgBio.getImages();
				break;
			case 2:
				pptBio.img_only = false;
				pptBio.text_only = true;
				this.setStyle();
				if (uiBio.style.isBlur) imgBio.clearCache();
				if (!pptBio.sameStyle && (pptBio.bioMode != pptBio.revMode || pptBio.bioStyle != pptBio.revStyle)) calcText = pptBio.artistView ? 1 : 2;
				if (!this.art.ix && pptBio.artistView && !txt.bio.lookUp || !this.alb.ix && !pptBio.artistView && !txt.rev.lookUp) {
					txt.albumReset();
					txt.artistReset();
					txt.getText(calcText);
					if (uiBio.style.isBlur) imgBio.getImages();
				} else {
					txt.getItem(calcText, this.art.ix, this.alb.ix);
					if (uiBio.style.isBlur) imgBio.getItem(this.art.ix, this.alb.ix);
					imgBio.setCheckArr(null);
				}
				break;
		}
		this.calcText = false;
		if (pptBio.text_only) seeker.upd(true);
		butBio.refresh(true);
	}

	move(x, y, click) {
		this.trace.film = false;
		this.trace.text = false;
		this.trace.image = false;
		if (filmStrip.trace(x, y)) this.trace.film = true;
		else if (pptBio.text_only) this.trace.text = true;
		else if (pptBio.img_only || !txt.text) this.trace.text = false;
		else if (pptBio.style < 4) {
			switch (pptBio.style) {
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
		if (!this.trace.text && !this.trace.film) this.trace.image = imgBio.trace(x, y);
		if (!pptBio.autoEnlarge || click || this.zoom()) return;
		const enlarged_img_o = this.style.enlarged_img;
		this.style.enlarged_img = !this.trace.text && this.trace.image;
		if (this.style.enlarged_img && !pptBio.text_only && !pptBio.img_only && !enlarged_img_o) this.mode(1);
	}

	on_notify(info) {
		const rec = $Bio.jsonParse(info, false);
		this.style.free.forEach(v => {
			if (v.name == rec.name) rec.name = rec.name + ' New';
		});
		this.style.free.push(rec);
		this.sort(this.style.free, 'name');
		pptBio.styleFree = JSON.stringify(this.style.free);
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
					if (v.name == input) input = input + ' New';
				});
				this.style.free[n - 5].name = input;
				this.sort(this.style.free, 'name');
				pptBio.styleFree = JSON.stringify(this.style.free);
				this.style.free.some((v, i) => {
					if (v.name == input) {
						pptBio.style = i + 5;
						return true;
					}
				});
				this.getStyleNames();
				window.Repaint();
			}
		}
		popUpBox.input('Rename Current Style', 'Rename style: ' + this.style.name[n] + '\n\nEnter new name\n\nContinue?', ok_callback, '', this.style.name[n]);
	}

	resetAlbumHistory() {
		this.alb.ix = 0;
		this.lock = 0;
		this.alb.history = [];
		pptBio.albumHistory = JSON.stringify([]);
		this.alb.cur = '';
		this.getList(true);
	}

	resetArtistHistory() {
		this.art.ix = 0;
		this.lock = 0;
		this.art.history = [];
		pptBio.artistHistory = JSON.stringify([]);
		this.art.cur = '';
		this.getList(true);
	}

	resetStyle(n) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				if (pptBio.style < 4) pptBio.rel_imgs = 0.7;
				else {
					const obj = pptBio.style == 4 ? this.style.overlay : this.style.free[pptBio.style - 5];
					obj.name = this.style.name[n];
					obj.imL = 0;
					obj.imR = 0;
					obj.imT = 0;
					obj.imB = 0;
					obj.txL = 0;
					obj.txR = 0;
					obj.txT = 0.632;
					obj.txB = 0;
					pptBio.style == 4 ? pptBio.styleOverlay = JSON.stringify(this.style.overlay) : pptBio.styleFree = JSON.stringify(this.style.free);
				}
				txt.refresh(5);
			}
		}
		popUpBox.confirm('Reset Current Style', 'Reset to Default ' + (pptBio.style < 4 ? this.style.name[n] : 'Overlay') + ' Style.\n\nContinue?', 'OK', 'Cancel', continue_confirmation);
	}

	sameStyle() {
		return pptBio.sameStyle || (pptBio.bioMode == pptBio.revMode && pptBio.bioStyle == pptBio.revStyle);
	}

	setBorder(imgFull, bor, refl) {
		if (imgFull) {
			const value = bor > 1 && !refl ? 10 * $Bio.scale : 0;
			$Bio.key.forEach(v => this.bor[v] = value);
		} else {
			$Bio.key.forEach(v => this.bor[v] = bor < 2 || refl ? pptBio[`bor${v.toUpperCase()}`] : Math.max(pptBio[`bor${v.toUpperCase()}`], 10 * $Bio.scale));
			this.style.gap = bor < 2 || refl ? pptBio.gap : Math.max(pptBio.gap, 10 * $Bio.scale);
		}
	}

	setCycItem() {
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				if (!input || input == this.style.cycTimeItem) return false;
				this.style.cycTimeItem = Math.round(input);
				if (!this.style.cycTimeItem || isNaN(this.style.cycTimeItem)) this.style.cycTimeItem = 30;
				this.style.cycTimeItem = Math.max(this.style.cycTimeItem, 30);
				pptBio.cycTimeItem = this.style.cycTimeItem;
			}
		}
		popUpBox.input('Item: Cycle Time', 'Enter time in seconds\n\nMinimum = 30 seconds', ok_callback, '', this.style.cycTimeItem);
	}

	setCycPic() {
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				if (!input || input == pptBio.cycTimePic) return false;
				pptBio.cycTimePic = Math.round(input);
				if (!pptBio.cycTimePic || isNaN(pptBio.cycTimePic)) pptBio.cycTimePic = 15;
				img.style.delay = Math.min(pptBio.cycTimePic, 7) * 1000;
			}
		}
		popUpBox.input('Photo: Cycle Time', 'Enter time in seconds', ok_callback, '', pptBio.cycTimePic);
	}

	setStyle(bypass) {
		this.sbar.offset = [2 + uiBio.sbar.arrowPad, Math.max(Math.floor(uiBio.sbar.but_w * 0.2), 2) + uiBio.sbar.arrowPad * 2, 0][uiBio.sbar.type];
		this.sbar.top_corr = [this.sbar.offset - (uiBio.sbar.but_h - uiBio.sbar.but_w) / 2, this.sbar.offset, 0][uiBio.sbar.type];
		const bot_corr = [(uiBio.sbar.but_h - uiBio.sbar.but_w) / 2 - this.sbar.offset, -this.sbar.offset, 0][uiBio.sbar.type];
		this.clip = false;
		if (!pptBio.sameStyle) {
			switch (true) {
				case pptBio.artistView:
					if (pptBio.bioMode == 1) {
						pptBio.img_only = true;
						pptBio.text_only = false;
					} else if (pptBio.bioMode == 2) {
						pptBio.img_only = false;
						pptBio.text_only = true;
					} else {
						pptBio.img_only = false;
						pptBio.text_only = false;
						pptBio.style = pptBio.bioStyle;
					}
					break;
				case !pptBio.artistView:
					if (pptBio.revMode == 1) {
						pptBio.img_only = true;
						pptBio.text_only = false;
					} else if (pptBio.revMode == 2) {
						pptBio.img_only = false;
						pptBio.text_only = true;
					} else {
						pptBio.img_only = false;
						pptBio.text_only = false;
						pptBio.style = pptBio.revStyle;
					}
					break;
			}
			if (pptBio.text_only) seeker.upd(true);
		}

		const sp1 = 10 * $Bio.scale;
		const sp2 = sp1 + (this.filmStripSize.r ? 9 * $Bio.scale : 0);

		switch (true) {
			case pptBio.img_only: { // img_only
				$Bio.key.forEach(v => this.img[v] = this.bor[v]);
				const autoFill = pptBio.artistView && pptBio.artStyleImgOnly == 1 || !pptBio.artistView && pptBio.covStyleImgOnly == 1;
				if (!autoFill) {
					const v = $Bio.key[pptBio.filmStripPos];
					this.img[v] += this.filmStripSize[v];
					this.style.imgSize = $Bio.clamp(this.h - this.img.t - this.img.b, 10, this.w - this.img.l - this.img.r);
				} else this.style.imgSize = $Bio.clamp(this.h - this.bor.t - this.bor.b, 10, this.w - this.bor.l - this.bor.r);
				break;
			}

			case pptBio.text_only: // text_only
				this.lines_drawn = Math.max(Math.floor((this.h - pptBio.textT - pptBio.textB - uiBio.heading.h - this.filmStripSize.t - this.filmStripSize.b) / uiBio.font.main_h), 0);
				this.text.l = pptBio.textL + this.filmStripSize.l;
				this.text.r = (pptBio.sbarShow ? Math.max(pptBio.textR, uiBio.sbar.sp + sp2) : pptBio.textR) + this.filmStripSize.r;
				this.text.t = !pptBio.topAlign ? pptBio.textT + (this.h - pptBio.textT + this.filmStripSize.t - pptBio.textB - this.filmStripSize.b - this.lines_drawn * uiBio.font.main_h + uiBio.heading.h - scaleForDisplay(10)) / 2 : pptBio.textT + uiBio.heading.h + this.filmStripSize.t;
				this.text.w = this.w - this.text.l - this.text.r - pptBio.textR;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : pptBio.textL;
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - pptBio.textR;
				if (pptBio.sbarShow) {
					if (pptBio.filmStripPos != 1) this.sbar.x = this.w - this.filmStripSize.r - uiBio.sbar.sp - pptBio.borR + scaleForDisplay(1);
					else this.sbar.x = this.text.l + this.text.w + sp1;
					this.sbar.y = (uiBio.sbar.type < this.sbar.style || pptBio.filmStripPos == 0 || pptBio.filmStripPos == 2 ? this.text.t : 0) + this.sbar.top_corr + scaleForDisplay(5);
					this.sbar.h = (uiBio.sbar.type < this.sbar.style || pptBio.filmStripPos == 0 || pptBio.filmStripPos == 2 ? uiBio.font.main_h * this.lines_drawn + bot_corr : this.h - this.sbar.y) + bot_corr;
				}
				this.repaint.x = this.text.l;
				this.repaint.y = 0;
				this.repaint.w = this.w - this.repaint.x - this.filmStripSize.r, this.repaint.h = this.h - this.filmStripSize.b;
				break;

			case pptBio.style == 0: { // top
				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 'b' ? 0 : 0));
				let txt_h = Math.round((this.h - this.img.t - pptBio.textB - this.filmStripSize.b) * (1 - pptBio.rel_imgs));
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h + scaleForDisplay(50)) / uiBio.font.main_h), 0);
				txt_h = this.lines_drawn * uiBio.font.main_h + this.style.gap + scaleForDisplay(17);
				this.style.imgSize = Math.max(this.h - txt_h - this.img.t - this.filmStripSize.b * 2 - pptBio.textB - uiBio.heading.h + scaleForDisplay(60), 10);
				this.text.l = pptBio.textL + (!this.style.fullWidthHeading ? this.filmStripSize.l : 0);
				this.text.l = pptBio.textL + (this.filmStripSize.l ? 0 : this.filmStripSize.l);
				this.text.r = (pptBio.sbarShow ? Math.max(pptBio.textR, uiBio.sbar.sp + sp2) : pptBio.textR) - scaleForDisplay(18);
				this.text.t = this.img.t + this.style.imgSize + this.style.gap + uiBio.heading.h;
				this.text.w = this.w - this.text.l - this.text.r - (pref.layout_mode === 'artwork_mode' ? pptBio.textR + pptBio.textR / 2 : pptBio.textR);
				this.heading.x = (!this.style.fullWidthHeading ? this.text.l : pptBio.textL);
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : panelBio.w - pptBio.textL - pptBio.textR;
				if (pptBio.sbarShow) {
					if (pptBio.filmStripPos != 1) this.sbar.x = this.w + this.filmStripSize.r - uiBio.sbar.sp - pptBio.borR + scaleForDisplay(1);
					else this.sbar.x = this.text.l + this.text.w + sp1;
					this.sbar.y = (uiBio.sbar.type < this.sbar.style || pptBio.heading || pptBio.filmStripPos == 2 ? this.text.t : this.img.t + this.style.imgSize) + this.sbar.top_corr + scaleForDisplay(5);
					this.sbar.h = (uiBio.sbar.type < this.sbar.style || pptBio.filmStripPos == 2 ? uiBio.font.main_h * this.lines_drawn + bot_corr : this.h - this.sbar.y) + bot_corr;
				}
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				this.repaint.w = this.w - this.repaint.x, this.repaint.h = this.h - this.repaint.y - this.filmStripSize.b + scaleForDisplay(60);
				break;
			}
			case pptBio.style == 1: { // right
				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 'l' ? this.filmStripSize[v] : 0));
				let txt_sp = Math.round((this.w - pptBio.textL - this.filmStripSize.l - this.img.r) * (1 - pptBio.rel_imgs));
				let txt_h = this.h - pptBio.textT - pptBio.textB - this.filmStripSize.t - this.filmStripSize.b;
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h) / uiBio.font.main_h), 0);
				this.style.imgSize = Math.max(this.w - txt_sp - this.img.r - pptBio.textL - this.filmStripSize.l - this.style.gap, 10);
				if (pptBio.sbarShow) txt_sp -= (uiBio.sbar.sp + sp1);
				this.text.l = pptBio.textL + this.filmStripSize.l;
				this.text.r = pptBio.sbarShow ? Math.max(pptBio.textR + this.filmStripSize.r, uiBio.sbar.sp + sp1) : pptBio.textR + this.filmStripSize.r;
				this.text.t = !pptBio.topAlign ? pptBio.textT + (this.h - pptBio.textT - pptBio.textB + this.filmStripSize.t - this.filmStripSize.b - this.lines_drawn * uiBio.font.main_h + uiBio.heading.h - scaleForDisplay(10)) / 2 : pptBio.textT + uiBio.heading.h + this.filmStripSize.t - 50;
				this.text.w = txt_sp;
				this.text.h = this.lines_drawn * uiBio.font.main_h;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : pptBio.textL;
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - this.bor.r;
				if (this.style.fullWidthHeading) this.img.t = this.text.t + scaleForDisplay(7);
				this.img.l = pptBio.textL + txt_sp + this.filmStripSize.l + this.style.gap + (pptBio.sbarShow ? uiBio.sbar.sp + sp1 : 0);
				if (pptBio.sbarShow) {
					this.sbar.x = this.text.l + this.text.w + sp1 - scaleForDisplay(3);
					this.sbar.y = (uiBio.sbar.type < this.sbar.style || pptBio.heading || pptBio.filmStripPos == 0 || pptBio.filmStripPos == 2 ? this.text.t : 0) + this.sbar.top_corr + scaleForDisplay(4);
					this.sbar.h = uiBio.sbar.type < this.sbar.style || pptBio.filmStripPos == 0 || pptBio.filmStripPos == 2 ? uiBio.font.main_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar.y + bot_corr;
				}
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				this.repaint.w = this.img.l - this.repaint.x - this.style.gap, this.repaint.h = this.h - this.repaint.y - this.filmStripSize.b;
				break;
			}

			case pptBio.style == 2: { // bottom
				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 't' && v != 'b' ? this.filmStripSize[v] : 0));
				let txt_h = Math.round((this.h - pptBio.textT - this.img.b - this.filmStripSize.t - this.filmStripSize.b) * (1 - pptBio.rel_imgs));
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h) / uiBio.font.main_h), 0);
				txt_h = this.lines_drawn * uiBio.font.main_h + this.style.gap;
				this.style.imgSize = Math.max(this.h - txt_h - pptBio.textT - this.img.b - this.filmStripSize.t - this.filmStripSize.b - uiBio.heading.h, 10);
				this.img.t = this.h - this.bor.b - this.style.imgSize - this.filmStripSize.b;
				this.text.l = pptBio.textL + this.filmStripSize.l;
				this.text.r = (pptBio.sbarShow ? Math.max(pptBio.textR, uiBio.sbar.sp + sp2) : pptBio.textR) + this.filmStripSize.r;
				this.text.t = this.img.t - txt_h + (is_4k ? 4 : 1);
				this.text.w = this.w - this.text.l - this.text.r - pptBio.textR;
				this.heading.x = (!this.style.fullWidthHeading ? this.text.l : pptBio.textL);
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : panelBio.w - pptBio.textL - pptBio.textR;
				if (pptBio.sbarShow) {
					if (pptBio.filmStripPos != 1) this.sbar.x = this.w - this.filmStripSize.r - uiBio.sbar.sp - pptBio.borR + scaleForDisplay(1);
					else this.sbar.x = this.text.l + this.text.w + sp1;
					this.sbar.y = (uiBio.sbar.type < this.sbar.style || pptBio.heading ? this.text.t : 0) + this.sbar.top_corr + scaleForDisplay(5);
					this.sbar.h = uiBio.sbar.type < this.sbar.style ? uiBio.font.main_h * this.lines_drawn + bot_corr * 2 : this.img.t - this.sbar.y + bot_corr;
				}
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				this.repaint.w = this.w - this.repaint.x - this.filmStripSize.r, this.repaint.h = this.img.t - this.repaint.y;
				break;
			}

			case pptBio.style == 3: { // left
				$Bio.key.forEach(v => this.img[v] = this.bor[v] + (v != 'r' ? this.filmStripSize[v] : 0));
				this.text.r = (pptBio.sbarShow ? Math.max(pptBio.textR, uiBio.sbar.sp + sp2) : pptBio.textR) + this.filmStripSize.r;
				const txt_sp = Math.round((this.w - this.img.l - this.text.r) * (1 - pptBio.rel_imgs));
				let txt_h = this.h - pptBio.textT - pptBio.textB - this.filmStripSize.t - this.filmStripSize.b;
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h) / uiBio.font.main_h), 0);
				this.style.imgSize = Math.max(this.w - txt_sp - this.img.l - this.text.r - this.style.gap, 10);
				this.text.l = this.img.l + this.style.imgSize + this.style.gap + scaleForDisplay(4);
				this.text.t = !pptBio.topAlign ? pptBio.textT + (this.h - pptBio.textT - pptBio.textB + this.filmStripSize.t - this.filmStripSize.b - this.lines_drawn * uiBio.font.main_h + uiBio.heading.h - scaleForDisplay(10)) / 2 : pptBio.textT + uiBio.heading.h + this.filmStripSize.t;
				this.text.w = txt_sp - pptBio.textR;
				this.text.h = this.lines_drawn * uiBio.font.main_h;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : this.bor.l;
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - pptBio.textR;
				if (this.style.fullWidthHeading) this.img.t = this.text.t + scaleForDisplay(7);
				if (pptBio.sbarShow) {
					if (pptBio.filmStripPos != 1) this.sbar.x = this.w - this.filmStripSize.r - uiBio.sbar.sp - pptBio.borR + scaleForDisplay(2);
					else this.sbar.x = this.text.l + this.text.w + sp1;
					this.sbar.y = (uiBio.sbar.type < this.sbar.style || pptBio.heading || pptBio.filmStripPos == 0 || pptBio.filmStripPos == 2 ? this.text.t : 0) + this.sbar.top_corr + scaleForDisplay(4);
					this.sbar.h = uiBio.sbar.type < this.sbar.style || pptBio.filmStripPos == 0 || pptBio.filmStripPos == 2 ? uiBio.font.main_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar.y + bot_corr;
				}
				this.repaint.x = this.text.l;
				this.repaint.y = this.text.t;
				this.repaint.w = this.w - this.repaint.x - this.filmStripSize.r, this.repaint.h = this.h - this.repaint.y - this.filmStripSize.b;
				break;
			}

			case pptBio.style > 3: {
				if (pptBio.style - 5 >= this.style.free.length) this.getStyleFallback();
				const obj = pptBio.style == 4 ? this.style.overlay : this.style.free[pptBio.style - 5];
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
				const imL = Math.round(this.im.l * this.w) + this.filmStripSize.l;
				const imR = Math.round(this.im.r * this.w) + this.filmStripSize.r;
				const imT = Math.round(this.im.t * this.h) + this.filmStripSize.t;
				const imB = Math.round(this.im.b * this.h) + this.filmStripSize.b;
				const txL = Math.round(this.tx.l * this.w) + this.filmStripSize.l;
				const txR = Math.round(this.tx.r * this.w) + this.filmStripSize.r;
				const txT = Math.round(this.tx.t * this.h) + this.filmStripSize.t;
				const txB = Math.round(this.tx.b * this.h) + this.filmStripSize.b;
				this.ibox.l = Math.max(imL, 0);
				this.ibox.t = Math.max(imT, 0);
				this.ibox.w = this.w - imL - imR;
				this.ibox.h = this.h - imT - imB;
				this.img.l = imL + this.bor.l;
				this.img.r = imR + this.bor.r;
				this.img.t = imT + this.bor.t;
				this.img.b = imB + this.bor.b;

				const t_l = pptBio.textL + uiBio.overlay.borderWidth;
				const t_t = pptBio.textT + uiBio.overlay.borderWidth;
				let t_r = pptBio.textR + uiBio.overlay.borderWidth;
				let t_b = pptBio.textB + uiBio.overlay.borderWidth;
				if (pptBio.typeOverlay == 2 || pptBio.typeOverlay == 4) {
					t_r += 1;
					t_b += 1;
				}

				let txt_h = Math.round((this.h - txT - txB - t_t - t_b));
				this.lines_drawn = Math.max(Math.floor((txt_h - uiBio.heading.h + (pptBio.filmStripPos == 2 ? scaleForDisplay(40) : scaleForDisplay(80))) / uiBio.font.main_h), 0);
				this.text.l = txL + t_l;
				this.text.r = txR + (pptBio.sbarShow ? Math.max(t_r, uiBio.sbar.sp + sp1) : t_r);
				this.text.t = txT + uiBio.heading.h + t_t - scaleForDisplay(36);
				this.text.w = this.w - this.text.l - this.text.r - pptBio.textR;
				this.heading.x = !this.style.fullWidthHeading ? this.text.l : Math.min(this.img.l, this.text.l, this.filmStripSize.l ? filmStrip.x : this.w);
				this.heading.w = !this.style.fullWidthHeading ? this.text.w : this.w - this.heading.x - Math.min(this.img.r, this.text.r, this.filmStripSize.r ? this.w - filmStrip.x - filmStrip.w : this.w);
				this.tbox.l = Math.max(txL, 0);
				this.tbox.t = Math.max(txT, 0) + scaleForDisplay(23);
				this.tbox.w = this.w - Math.max(txL, 0) - Math.max(txR, 0);
				this.tbox.h = this.h - Math.max(txT, 0) - Math.max(txB, 0);
				this.style.minH = uiBio.font.main_h + uiBio.heading.h + t_t + t_b;
				if (pptBio.typeOverlay == 2) uiBio.overlay.borderWidth = Math.max(Math.min(uiBio.overlay.borderWidth, this.tbox.w / 3, this.tbox.h / 3), 1);
				if (pptBio.typeOverlay) this.arc = Math.max(Math.min(uiBio.font.main_h / 1.5, this.tbox.w / 3, this.tbox.h / 3), 1);
				this.clip = this.ibox.t + 100 < this.tbox.t && this.tbox.t < this.ibox.t + this.ibox.h && (this.tbox.l < this.ibox.l + this.ibox.w || this.tbox.l + this.tbox.w < this.ibox.l + this.ibox.w);
				this.style.imgSize = this.clip ? this.tbox.t - this.ibox.t : Math.min(this.h - imT - imB - this.bor.t - this.bor.b, this.w - imL - imR - this.bor.l - this.bor.r + scaleForDisplay(60));
				if (pptBio.sbarShow) {
					this.sbar.x = this.tbox.l + this.tbox.w - uiBio.sbar.sp - uiBio.overlay.borderWidth - pptBio.borR + scaleForDisplay(2);
					this.sbar.y = this.text.t + this.sbar.top_corr + scaleForDisplay(5);
					this.sbar.h = uiBio.font.main_h * this.lines_drawn + bot_corr * 2;
				}
				this.repaint.x = this.tbox.l;
				this.repaint.y = this.tbox.t;
				this.repaint.w = this.tbox.w, this.repaint.h = this.tbox.h + scaleForDisplay(50);
				break;
			}
		}
		if (uiBio.sbar.type == 2) {
			this.sbar.y += 1;
			this.sbar.h -= 2;
		}
		this.text.w = Math.max(this.text.w, 10);
		this.style.max_y = this.lines_drawn * uiBio.font.main_h + this.text.t - uiBio.font.main_h * 0.9;
		if (!this.id.init) filmStrip.check();
		this.id.init = false;
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
		const li = pptBio.artistView ? this.art : this.alb;
		return li.ix && li.list[li.ix] && li.list[li.ix].type != 'history';
	}

	stndItem() {
		return !this.art.ix && pptBio.artistView || !this.alb.ix && !pptBio.artistView;
	}

	tfBio(n, artist, focus) {
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, '$&#@!%path%#@!').replace(/%bio_artist%/gi, $Bio.tfEscape(artist)).replace(/%bio_album%/gi, this.tf.album).replace(/%bio_title%/gi, this.tf.title);
		n = $Bio.eval(n, focus);
		n = n.replace(/#@!.*?#@!/g, '');
		return n;
	}

	tfRev(n, albumArtist, album, focus) {
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*(%bio_albumartist%|%bio_album%)/gi, '$&#@!%path%#@!').replace(/%bio_albumartist%/gi, $Bio.tfEscape(albumArtist)).replace(/%bio_album%/gi, $Bio.tfEscape(album)).replace(/%bio_title%/gi, this.tf.title);
		n = $Bio.eval(n, focus);
		n = n.replace(/#@!.*?#@!/g, '');
		return n;
	}

	text_paint() {
		window.RepaintRect(this.repaint.x, this.repaint.y, this.repaint.w, this.repaint.h);
	}

	uniqAlbum(artist) {
		const flags = [];
		let result = [];
		artist.forEach(v => {
			const name = v.artist.toLowerCase() + ' - ' + v.album.toLowerCase();
			if (flags[name]) return;
			result.push(v);
			flags[name] = true;
		});
		return result = result.filter(v => v.type != 'label');
	}

	uniqArtist(artist) {
		const flags = [];
		let result = [];
		artist.forEach(v => {
			if (flags[v.name]) return;
			result.push(v);
			flags[v.name] = true;
		});
		return result;
	}

	updateNeeded() {
		switch (true) {
			case pptBio.artistView:
				this.id.curArtist = this.id.artist;
				this.id.artist = $Bio.eval(this.art.fields, pptBio.focus);
				if (!pptBio.lookUp) return true;
				else return this.id.artist != this.id.curArtist || !this.art.list.length || !this.art.ix;
			case !pptBio.artistView:
				this.id.curAlb = this.id.alb;
				this.id.alb = name.albID(pptBio.focus, 'simple');
				if (this.style.inclTrackRev) {
					this.id.curTr = this.id.tr;
					this.id.tr = name.trackID(pptBio.focus);
				} else this.id.curTr = this.id.tr = '';
				if (!pptBio.lookUp) return true;
				else return this.id.alb != this.id.curAlb || this.id.tr != this.id.curTr || !this.alb.list.length || !this.alb.ix;
		}
	}

	zoom() {
		return vkBio.k('shift') || vkBio.k('ctrl');
	}
}