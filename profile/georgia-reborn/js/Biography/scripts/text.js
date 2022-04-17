class Text {
	constructor() {
		const DT_CENTER = 0x00000001;
		const DT_RIGHT = 0x00000002;
		const DT_VCENTER = 0x00000004;
		const DT_WORDBREAK = 0x00000010;
		const DT_SINGLELINE = 0x00000020;
		const DT_CALCRECT = 0x00000400;
		const DT_NOCLIP = 0x00000100;
		const DT_NOPREFIX = 0x00000800;
		const DT_WORD_ELLIPSIS = 0x00040000;

		this.album = '';
		this.albumartist = '';
		this.artist = '';
		this.cur_artist = '';
		this.calc = true;
		this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.get = 1;
		this.head = pptBio.heading;
		this.heading = '';
		this.init = true;
		this.initialise = true;
		this.l = DT_NOPREFIX;
		this.lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.c = [this.lc, DT_RIGHT | this.lc];
		this.ncc = DT_CENTER | DT_VCENTER | DT_NOCLIP | DT_WORDBREAK | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.na = '';
		this.newText = false;
		this.repaint = true;
		this.text = '';
		this.textUpdate = 0;
		this.track = '';
		this.trackartist = '';

		this.topTags = ['Tags', 'Tags', 'Tags', 'Tags', 'Tag', '\u30bf\u30b0', 'Tagi', 'Tags', '\u0422\u0435\u0433\u0438', 'Taggar', 'Etiketler', '\u6807\u7b7e'];

		pptBio.sourceHeading = $Bio.clamp(pptBio.sourceHeading, 0, 2);
		pptBio.trackHeading = $Bio.clamp(pptBio.trackHeading, 0, 2);

		this.bio = {
			allmusic: false,
			am: '',
			amSubHead: pptBio.amBioSubHead.split('|'),
			arr: [],
			both: 0,
			cur: '',
			fallbackText: pptBio.bioFallbackText.split('|'),
			lfm: '',
			lfmSubHead: pptBio.lfmBioSubHead.split('|'),
			lookUp: false,
			scrollPos: {},
			subHead: 0,
			text: ''
		}

		this.d = {
			ax1: 0,
			ax2: 0,
			aB1: false,
			aB2: false,
			aR1: false,
			aR2: false,
			bothB_ix: -1,
			bothR_ix: -1,
			lB1: false,
			lB2: false,
			lR1: false,
			lR2: false,
			lx1: 0,
			lx2: 0,
			w: []
		}

		this.done = {
			amBio: false,
			amRev: false,
			lfmBio: false,
			lfmRev: false
		}

		this.id = {
			alb: '',
			curAlb: '',
			album: '',
			curAlbum: '',
			tr: '',
			curTr: ''
		}

		this.mod = {
			amBio: '',
			curAmBio: '',
			amRev: '',
			curAmRev: '',
			lfmBio: '',
			curLfmBio: '',
			lfmRev: '',
			curLfmRev: ''
		}

		this.rev = {
			allmusic: true,
			am: '',
			amSubHead: pptBio.amRevSubHead.split('|'),
			arr: [],
			both: 0,
			checkedTrackSubHead: true,
			cur: '',
			fallbackText: pptBio.revFallbackText.split('|'),
			lfm: '',
			lfmAlb: '',
			lfmSubHead: pptBio.lfmRevSubHead.split('|'),
			lookUp: false,
			scrollPos: {},
			subHead: 0,
			trackHeading: true,
			text: '',
			y: Math.round(Math.max(1, uiBio.font.main_h * 0.05))
		}

		this.rating = {
			am: -1,
			avg: -1,
			lfm: -1
		}

		this.currentTrackTags = $Bio.debounce(() => {
			const handle = $Bio.handle(pptBio.focus);
			if (handle) tagBio.write(new FbMetadbHandleList([handle]), true);
		}, 2000, {
			'leading': true,
			'trailing': true
		});
	}

	// Methods

	albCalc() {
		if (!this.rev.text || pptBio.img_only) return;
		this.rev.arr = [];
		this.d.bothR_ix = -1;
		let l = [];
		$Bio.gr(1, 1, false, g => {
			if (panelBio.style.inclTrackRev) {
				let ti = this.rev.text.match(/#!!#.+?$/m);
				if (ti) {
					ti = ti.toString();
					if (g.CalcTextWidth(ti, uiBio.font.main) > panelBio.text.w) {
						const new_ti = g.EstimateLineWrap(ti, uiBio.font.subHeadTrack, panelBio.text.w - g.CalcTextWidth('... ', uiBio.font.subHeadTrack))[0] + '...';
						this.rev.text = this.rev.text.replace(RegExp($Bio.regexEscape(ti)), new_ti);
					}
				}
			}
			l = g.EstimateLineWrap(this.rev.text, uiBio.font.main, panelBio.text.w);
		});
		for (let i = 0; i < l.length; i += 2) this.rev.arr.push(l[i].trim())
		if (pptBio.summaryFirst) {
			const hdMarkers = [];
			this.rev.arr.forEach((v, i) => {
				if (v == '¦|¦') hdMarkers.push(i);
			});
			if (hdMarkers.length > 1)
				for (let i = hdMarkers[0]; i < hdMarkers[1] + 1; i++) this.rev.arr[i] = this.rev.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			if (hdMarkers.length == 4)
				for (let i = hdMarkers[2]; i < hdMarkers[3] + 1; i++) this.rev.arr[i] = this.rev.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			let i = this.rev.arr.length;
			while (i--) {
				if (this.rev.arr[i] == '¦|¦') this.rev.arr.splice(i, 1);
			}
		}
		if (this.rev.subHead) this.rev.arr.some((v, i, arr) => {
			if (v.includes('#!#')) {
				this.d.bothR_ix = i;
				arr[i] = arr[i].replace('#!#', '');
				return true;
			}
		});
		butBio.refresh(true);
		alb_scrollbar.reset();
		alb_scrollbar.metrics(panelBio.sbar.x, panelBio.sbar.y, uiBio.sbar.w, panelBio.sbar.h, panelBio.lines_drawn, uiBio.font.main_h, false);
		alb_scrollbar.setRows(this.rev.arr.length);
		this.d.r = !pptBio.summaryFirst && (uiBio.stars == 2 || uiBio.stars == 1 && !pptBio.hdBtnShow) && (pptBio.ratingTextPos == 2 || this.rev.subHead && !pptBio.ratingTextPos) && !pptBio.artistView && this.rev.arr.length > 1 && (!this.rev.subHead ? (this.rev.allmusic && this.rating.am != -1 || !this.rev.allmusic && this.rating.lfm != -1) : true);
		this.d.aw1 = this.d.w[pptBio.heading ? 3 : 7];
		this.d.aw2 = this.d.w[pptBio.heading ? 3 : 7];
		this.d.lw1 = this.d.w[pptBio.heading ? 4 : 8];
		this.d.lw2 = this.d.w[pptBio.heading ? 4 : 8];
		if (this.d.r) {
			if (this.rating.am >= 0) {
				if (this.d.aR1) this.d.aw1 += this.d.w[0] + butBio.rating.w2;
				if (this.d.aR2) this.d.aw2 += this.d.w[0] + butBio.rating.w2;
				if (this.d.aR1 || this.d.aR2) this.d.ax = panelBio.text.l + this.d.w[pptBio.heading ? 3 : 7];
			}
			if (this.rating.lfm >= 0) {
				if (this.d.lR1) this.d.lw1 += this.d.w[0] + butBio.rating.w2;
				if (this.d.lR2) this.d.lw2 += this.d.w[0] + butBio.rating.w2;
				if (this.d.lR1 || this.d.lR2) this.d.lx = panelBio.text.l + this.d.w[pptBio.heading ? 4 : 8];
			}
			this.d.ry = Math.round((uiBio.font.main_h - butBio.rating.h1 / 2) / 1.8);
		}
		if (!pptBio.heading && this.rev.subHead) {
			this.d.xa1 = panelBio.text.l + this.d.aw1;
			this.d.xl1 = panelBio.text.l + this.d.lw1;
			this.d.x1a = panelBio.text.l + this.d.aw2;
			this.d.x1l = panelBio.text.l + this.d.lw2;
			const lw = panelBio.text.l + panelBio.text.w;
			this.d.xa2 = Math.max(this.d.xa1, lw);
			this.d.xl2 = Math.max(this.d.xl1, lw);
			this.d.x2a = Math.max(this.d.x1a, lw);
			this.d.x2l = Math.max(this.d.x1l, lw);
		}
		if (panelBio.style.inclTrackRev == 1) this.getScrollPos();
	}

	albumFlush() {
		this.text = false;
		this.mod.amRev = this.rev.am = this.rev.lfm = this.mod.lfmRev = '';
		this.mod.curAmRev = this.mod.curLfmRev = '1';
		this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = false;
		this.rev.text = '';
		this.head = false;
		butBio.setScrollBtnsHide();
		butBio.setSrcBtnHide();
	}

	amBio(a) {
		const aBio = panelBio.getPth('bio', pptBio.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foAmBio', true).pth;
		if (!$Bio.file(aBio)) return;
		this.mod.amBio = $Bio.lastModified(aBio);
		if (this.mod.amBio == this.mod.curAmBio) return;
		this.bio.am = $Bio.open(aBio).trim();
		if (pptBio.expandLists) this.bio.am = this.expandLists('amBio', this.bio.am);
		if (pptBio.summaryFirst) this.bio.am = this.summaryFirstText('Genre: ', 'Active: ', this.bio.am).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		this.newText = true;
		this.mod.curAmBio = this.mod.amBio;
	}

	amBioPth() {
		if (pptBio.img_only) return ['', '', false, false];
		return panelBio.getPth('bio', pptBio.focus, this.artist, '', '', cfg.supCache, $Bio.clean(this.artist), '', '', 'foAmBio', false);
	}

	amRev(a, aa, l) {
		const aRev = panelBio.getPth('rev', pptBio.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foAmRev', true).pth;
		let rat = '';
		if (!$Bio.file(aRev)) {
			this.rating.am = -1;
			butBio.check();
			return;
		}
		this.mod.amRev = $Bio.lastModified(aRev);
		if (this.mod.amRev == this.mod.curAmRev) return;
		this.rev.am = $Bio.open(aRev).trim();
		this.newText = true;
		this.mod.curAmRev = this.mod.amRev;
		this.rating.am = -1;
		let b = this.rev.am.indexOf('>> Album rating: ') + 17;
		const f = this.rev.am.indexOf(' <<');
		const subHeadOn = pptBio.bothRev && pptBio.sourceHeading || pptBio.sourceHeading == 2;
		if (pptBio.amRating) {
			if (b != -1 && f != -1 && f > b) this.rating.am = this.rev.am.substring(b, f);
			if (!isNaN(this.rating.am) && this.rating.am != 0 && this.rating.am != -1) this.rating.am *= 2;
			else this.rating.am = -1;
		}
		if ((uiBio.stars == 1 && pptBio.hdBtnShow || !pptBio.amRating) && f != -1) this.rev.am = this.rev.am.substring(f + 5);
		else if (!pptBio.summaryFirst && (uiBio.stars == 2 || uiBio.stars == 1 && !pptBio.hdBtnShow) && (pptBio.ratingTextPos == 2 || subHeadOn && !pptBio.ratingTextPos) && this.rating.am != -1) {
			this.rev.am = (!subHeadOn ? pptBio.allmusic_name + ':\r\n\r\n' : '') + this.rev.am.substring(f + 5);
		} else {
			if (!uiBio.stars || this.rating.am == -1 || pptBio.summaryFirst) {
				b = this.rev.am.indexOf(' <<');
				if (b != -1) this.rev.am = this.rev.am.slice(b + 3);
				if (pptBio.summaryFirst) rat = this.rating.am != -1 ? pptBio.allmusic_name + ': ' + this.rating.am / 2 : '';
			} else if (pptBio.allmusic_name != 'Album rating') this.rev.am = this.rev.am.replace('Album rating', pptBio.allmusic_name);
		}
		if (pptBio.expandLists) this.rev.am = this.expandLists('amRev', this.rev.am);
		if (pptBio.summaryFirst) this.rev.am = this.summaryFirstText('Genre: ', 'Release Date: ', this.rev.am, '', rat).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (!this.rev.am) butBio.check();
	}

	amRevPth() {
		if (pptBio.img_only) return ['', '', false, false];
		return panelBio.getPth('rev', pptBio.focus, this.artist, this.album, '', cfg.supCache, $Bio.clean(this.artist), $Bio.clean(this.albumartist), $Bio.clean(this.album), 'foAmRev', false);
	}

	artCalc() {
		if (!this.bio.text || pptBio.img_only) return;
		this.bio.arr = [];
		this.d.bothB_ix = -1;
		let l = [];
		$Bio.gr(1, 1, false, g => l = g.EstimateLineWrap(this.bio.text, uiBio.font.main, panelBio.text.w));
		for (let i = 0; i < l.length; i += 2) this.bio.arr.push(l[i].trim());
		if (pptBio.summaryFirst) {
			const hdMarkers = [];
			this.bio.arr.forEach((v, i) => {
				if (v == '¦|¦') hdMarkers.push(i);
			});
			if (hdMarkers.length > 1)
				for (let i = hdMarkers[0]; i < hdMarkers[1] + 1; i++) this.bio.arr[i] = this.bio.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			if (hdMarkers.length == 4)
				for (let i = hdMarkers[2]; i < hdMarkers[3] + 1; i++) this.bio.arr[i] = this.bio.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			let i = this.bio.arr.length;
			while (i--) {
				if (this.bio.arr[i] == '¦|¦') this.bio.arr.splice(i, 1);
			}
		}
		if (this.bio.subHead) this.bio.arr.some((v, i, arr) => {
			if (v.includes('#!#')) {
				this.d.bothB_ix = i;
				arr[i] = arr[i].replace('#!#', '');
				return true;
			}
		});
		butBio.refresh(true);
		art_scrollbar.reset();
		art_scrollbar.metrics(panelBio.sbar.x, panelBio.sbar.y, uiBio.sbar.w, panelBio.sbar.h, panelBio.lines_drawn, uiBio.font.main_h, false);
		art_scrollbar.setRows(this.bio.arr.length);
		if (!pptBio.heading && this.bio.subHead) {
			this.d.ax1 = panelBio.text.l + this.d.w[5];
			this.d.ax2 = Math.max(this.d.ax1, panelBio.text.l + panelBio.text.w);
			this.d.lx1 = panelBio.text.l + this.d.w[6];
			this.d.lx2 = Math.max(this.d.lx1, panelBio.text.l + panelBio.text.w);
		}
	}

	artistFlush() {
		this.text = false;
		this.done.amBio = this.done.lfmBio = false;
		this.mod.amBio = this.bio.am = this.mod.lfmBio = this.bio.lfm = '';
		this.mod.curAmBio = this.mod.curLfmBio = '1';
		this.bio.text = '';
		this.head = false;
		butBio.setScrollBtnsHide();
		butBio.setSrcBtnHide();
	}

	albumReset(upd) {
		if (panelBio.lock) return;
		this.id.curAlbum = this.id.album;
		this.id.album = name.albID(pptBio.focus, 'simple');
		const new_album = this.id.album != this.id.curAlbum;
		if (new_album) this.id.alb = '';
		if (new_album || upd) {
			this.album = name.album(pptBio.focus);
			this.albumartist = name.albumArtist(pptBio.focus);
			this.albumFlush();
			this.rev.lookUp = false;
		}
		if (panelBio.style.inclTrackRev) {
			this.id.curTr = this.id.tr;
			this.id.tr = name.trackID(pptBio.focus);
			const new_track = this.id.tr != this.id.curTr;
			if (new_track) {
				this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = false;
				if (panelBio.style.inclTrackRev == 1) this.logScrollPos('rev');
			}
		}
	}

	artistReset(upd) {
		if (panelBio.artistsSame() || panelBio.lock) return;
		this.cur_artist = this.artist;
		this.artist = name.artist(pptBio.focus);
		const new_artist = this.artist != this.cur_artist;
		if (new_artist || upd) {
			this.bio.lookUp = false;
			this.artistFlush();
		}
	}

	draw(gr) {
		if (!pptBio.img_only || pptBio.text_only) {
			this.getTxtFallback();
			if (pptBio.typeOverlay && pptBio.style > 3 && this.text && !pptBio.text_only) {
				gr.SetSmoothingMode(2);
				let o = 0;
				switch (pptBio.typeOverlay) {
					case 1:
						gr.FillSolidRect(panelBio.tbox.l, panelBio.tbox.t, panelBio.tbox.w, panelBio.tbox.h, uiBio.col.rectOv);
						break;
					case 2:
						o = Math.round(uiBio.overlay.borderWidth / 2);
						gr.FillSolidRect(panelBio.tbox.l + o, panelBio.tbox.t + o, panelBio.tbox.w - o * 2, panelBio.tbox.h - o * 2, uiBio.col.rectOv);
						gr.DrawRect(panelBio.tbox.l + o, panelBio.tbox.t + o, panelBio.tbox.w - uiBio.overlay.borderWidth - 1, panelBio.tbox.h - uiBio.overlay.borderWidth - 1, uiBio.overlay.borderWidth, uiBio.col.rectOvBor);
						break;
					case 3:
						gr.FillRoundRect(panelBio.tbox.l, panelBio.tbox.t, panelBio.tbox.w, panelBio.tbox.h, panelBio.arc, panelBio.arc, uiBio.col.rectOv);
						break;
					case 4:
						o = Math.round(uiBio.overlay.borderWidth / 2);
						gr.FillRoundRect(panelBio.tbox.l + o, panelBio.tbox.t + o, panelBio.tbox.w - o * 2, panelBio.tbox.h - o * 2, panelBio.arc, panelBio.arc, uiBio.col.rectOv);
						gr.DrawRoundRect(panelBio.tbox.l + o, panelBio.tbox.t + o, panelBio.tbox.w - uiBio.overlay.borderWidth - 1, panelBio.tbox.h - uiBio.overlay.borderWidth - 1, panelBio.arc, panelBio.arc, uiBio.overlay.borderWidth, uiBio.col.rectOvBor);
						break;
				}
			}
			if (pptBio.artistView && this.bio.text) {
				const b = Math.max(Math.round(art_scrollbar.delta / uiBio.font.main_h + 0.4), 0);
				const f = Math.min(b + panelBio.lines_drawn, this.bio.arr.length);
				for (let i = b; i < f; i++) {
					const item_y = uiBio.font.main_h * i + panelBio.text.t - art_scrollbar.delta + scaleForDisplay(5);
					if (item_y < panelBio.style.max_y) {
						if (!pptBio.heading && this.bio.subHead) {
							const iy = Math.round(item_y + uiBio.font.main_h / 2);
							if (!i && this.d.aB1) gr.DrawLine(this.d.ax1, iy, this.d.ax2, iy, uiBio.style.l_w, uiBio.col.centerLine);
							if (!i && this.d.lB1) gr.DrawLine(this.d.lx1, iy, this.d.lx2, iy, uiBio.style.l_w, uiBio.col.centerLine);
							if (i == this.d.bothB_ix && this.d.aB2) gr.DrawLine(this.d.ax1, iy, this.d.ax2, iy, uiBio.style.l_w, uiBio.col.centerLine);
							if (i == this.d.bothB_ix && this.d.lB2) gr.DrawLine(this.d.lx1, iy, this.d.lx2, iy, uiBio.style.l_w, uiBio.col.centerLine);
						}
						if (this.bio.subHead && (!i || i == this.d.bothB_ix)) gr.GdiDrawText(this.bio.arr[i], uiBio.font.subHeadSource, uiBio.col.source, panelBio.text.l, item_y, panelBio.text.w, uiBio.font.main_h, this.l);
						else gr.GdiDrawText(this.bio.arr[i], uiBio.font.main, uiBio.col.text, panelBio.text.l, item_y, panelBio.text.w, uiBio.font.main_h, this.l);
					}
				}
				if (pptBio.sbarShow) art_scrollbar.draw(gr);
			}
			if (!pptBio.artistView && this.rev.text) {
				const b = Math.max(Math.round(alb_scrollbar.delta / uiBio.font.main_h + 0.4), 0);
				const f = Math.min(b + panelBio.lines_drawn, this.rev.arr.length);
				const r = !pptBio.summaryFirst && (uiBio.stars == 2 || uiBio.stars == 1 && !pptBio.hdBtnShow) && (pptBio.ratingTextPos == 2 || this.rev.subHead && !pptBio.ratingTextPos) && !pptBio.artistView && this.rev.arr.length > 1 && (!this.rev.subHead ? (this.rev.allmusic && this.rating.am != -1 || !this.rev.allmusic && this.rating.lfm != -1) : true);
				let song = -1;
				for (let i = b; i < f; i++) {
					let item_y = uiBio.font.main_h * i + panelBio.text.t - alb_scrollbar.delta + scaleForDisplay(5);
					if (item_y < panelBio.style.max_y) {
						if (this.rev.arr[i].startsWith('#!!#')) song = i;
						if (i > song && song != -1 && !this.rev.subHead) item_y += this.rev.y;
						if (r) switch (this.rev.subHead) {
							case 0: {
								const rating = this.rev.allmusic ? this.rating.am : this.rating.lfm;
								if (i == 0 && rating >= 0)
									gr.DrawImage(butBio.rating.images[rating], panelBio.text.l + gr.CalcTextWidth((this.rev.allmusic ? pptBio.allmusic_name : pptBio.lastfm_name) + ':  ', uiBio.font.main), item_y + this.d.ry, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
								break;
							}
							case 1:
								if (!i) {
									if (this.d.aR1 && this.rating.am >= 0) {
										gr.DrawImage(butBio.rating.images[this.rating.am], this.d.ax, item_y + this.d.ry, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
									}
									if (this.d.lR1 && this.rating.lfm >= 0) {
										gr.DrawImage(butBio.rating.images[this.rating.lfm], this.d.lx, item_y + this.d.ry, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
									}
								}
								if (i == this.d.bothR_ix) {
									if (this.d.aR2 && this.rating.am >= 0) {
										gr.DrawImage(butBio.rating.images[this.rating.am], this.d.ax, item_y + this.d.ry, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
									}
									if (this.d.lR2 && this.rating.lfm >= 0) {
										gr.DrawImage(butBio.rating.images[this.rating.lfm], this.d.lx, item_y + this.d.ry, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
									}
								}
								break;
						}
						if (!pptBio.heading && this.rev.subHead) {
							const iy = Math.round(item_y + uiBio.font.main_h / 2);
							if (!i) {
								if (this.d.aR1) gr.DrawLine(this.d.xa1, iy, this.d.xa2, iy, uiBio.style.l_w, uiBio.col.centerLine);
								if (this.d.lR1) gr.DrawLine(this.d.xl1, iy, this.d.xl2, iy, uiBio.style.l_w, uiBio.col.centerLine);
							}
							if (i == this.d.bothR_ix) {
								if (this.d.aR2) gr.DrawLine(this.d.x1a, iy, this.d.x2a, iy, uiBio.style.l_w, uiBio.col.centerLine);
								if (this.d.lR2) gr.DrawLine(this.d.x1l, iy, this.d.x2l, iy, uiBio.style.l_w, uiBio.col.centerLine);
							}
						}
						if (this.rev.subHead && (!i || i == this.d.bothR_ix)) gr.GdiDrawText(this.rev.arr[i], uiBio.font.subHeadSource, uiBio.col.source, panelBio.text.l, item_y, panelBio.text.w, uiBio.font.main_h, this.l);
						else if (song == i) {
							const trlabel = this.rev.arr[i].replace('#!!#', '');
							if (!pptBio.heading && !i) {
								const iy = Math.round(item_y + uiBio.font.main_h / 2);
								const x1 = panelBio.text.l + gr.CalcTextWidth(trlabel + ' ', uiBio.font.subHeadTrack);
								gr.DrawLine(x1, iy, Math.max(x1, panelBio.text.l + panelBio.text.w), iy, uiBio.style.l_w, uiBio.col.centerLine);
							}
							gr.GdiDrawText(trlabel, uiBio.font.subHeadTrack, uiBio.col.track, panelBio.text.l, item_y, panelBio.text.w, uiBio.font.main_h, this.l);
						} else gr.GdiDrawText(this.rev.arr[i], uiBio.font.main, uiBio.col.text, panelBio.text.l, item_y, panelBio.text.w, uiBio.font.main_h, this.l);
					}
				}
				if (pptBio.sbarShow) alb_scrollbar.draw(gr);
			}
		}
	}

	drawMessage(gr) {
		if (pptBio.heading || !this.na) return;
		const j_x = Math.round(panelBio.text.w / 2) + panelBio.text.l;
		const j_h = Math.round(uiBio.font.main_h * 1.5);
		const j_y = panelBio.text.t + (panelBio.lines_drawn * uiBio.font.main_h - j_h) / 3;
		const rs1 = Math.min(5, j_h / 2);
		const rs2 = Math.min(4, (j_h - 2) / 2);
		gr.SetSmoothingMode(4);
		const j_w = gr.CalcTextWidth(this.na, uiBio.font.message) + 25;
		gr.FillRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 0xDB000000);
		gr.DrawRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 1, 0x64000000);
		gr.DrawRoundRect(j_x - j_w / 2 + 1, j_y + 1, j_w - 2, j_h - 2, rs2, rs2, 1, 0x28ffffff);
		gr.GdiDrawText(this.na, uiBio.font.message, RGB(0, 0, 0), j_x - j_w / 2 + 1, j_y + 1, j_w, j_h, this.cc);
		gr.GdiDrawText(this.na, uiBio.font.message, 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, this.cc);
	}

	expandLists(type, n) {
		let items = [];
		switch (type) {
			case 'amBio':
				if (!pptBio.summaryFirst) items = ['Genre: '];
				break;
			case 'lfmBio': {
				const members = 'Members: |Mitglieder: |Miembros: |Membres: |Componenti: |\\u30e1\\u30f3\\u30d0\\u30fc: |Cz\\u0142onkowie: |Membros: |\\u0423\\u0447\\u0430\\u0441\\u0442\\u043d\\u0438\\u043a\\u0438: |Medlemmar: |\\u00dcyeler: |\\u6210\\u5458: ';
				const topTags = 'Top Tags: ';
				const topTracks = 'Top Tracks: |Top-Titel: |Temas m\\u00e1s escuchados: |Top titres: |Brani pi\\u00f9 ascoltati: |\\u4eba\\u6c17\\u30c8\\u30e9\\u30c3\\u30af: |Najpopularniejsze utwory: |Faixas principais: |\\u041b\\u0443\\u0447\\u0448\\u0438\\u0435 \\u043a\\u043e\\u043c\\u043f\\u043e\\u0437\\u0438\\u0446\\u0438\\u0438: |Toppl\\u00e5tar: |Pop\\u00fcler Par\\u00e7alar: |\\u6700\\u4f73\\u5355\\u66f2: ';
				items = [members, panelBio.similarArtistsKey, panelBio.topAlbumsKey, topTracks];
				if (!pptBio.summaryFirst) items.unshift(topTags);
				break;
			}
			case 'amRev':
				items = ['Album Moods: ', 'Album Themes: '];
				if (!pptBio.summaryFirst) items.unshift('Genre: ');
				break;
			case 'lfmRev':
				if (!pptBio.summaryFirst) items = ['Top Tags: '];
				break;
		}

		items.forEach(v => {
			let w = tagBio.getTag(n, v);
			let li = w.tag;
			if (li) {
				let list = w.matchedItem + '\r\n';
				li.forEach((v, i, arr) => {
					let nm = (i + 1) + '. ' + v;
					$Bio.gr(1, 1, false, g => {
						if (g.CalcTextWidth(nm, uiBio.font.main) > panelBio.text.w) {
							nm = g.EstimateLineWrap(nm, uiBio.font.main, panelBio.text.w - g.CalcTextWidth('... ', uiBio.font.main))[0] + '...';
						}
					});
					list += nm;
					if (i < arr.length - 1) list += '\r\n'
				});
				let toBeReplaced = n.substring(w.ix);
				toBeReplaced = toBeReplaced.split('\n')[0];
				n = n.replace(RegExp($Bio.regexEscape(toBeReplaced)), list);
			}
		});
		return n;
	}

	getItem(p_calc, art_ix, alb_ix, force) {
		if (pptBio.img_only) return;
		switch (true) {
			case pptBio.artistView: {
				this.cur_artist = this.artist;
				this.artist = art_ix < panelBio.art.list.length ? panelBio.art.list[art_ix].name : name.artist(pptBio.focus);
				const new_artist = this.artist != this.cur_artist;
				if (new_artist) {
					this.artistFlush();
					this.bio.lookUp = true;
				}
				this.getText(p_calc);
				this.get = 0;
				break;
			}
			case !pptBio.artistView: {
				this.id.curAlb = this.id.alb;
				this.artist = alb_ix < panelBio.alb.list.length ? panelBio.alb.list[alb_ix].artist : name.albumArtist(pptBio.focus);
				const alb = alb_ix < panelBio.alb.list.length ? panelBio.alb.list[alb_ix].album : name.album(pptBio.focus);
				this.id.alb = this.artist + alb;
				const new_album = this.id.alb != this.id.curAlb;
				if (new_album || force) {
					this.album = alb;
					this.albumartist = this.artist;
					this.albumFlush();
					this.rev.lookUp = true;
				}
				this.getText(p_calc);
				this.get = 0;
				break;
			}
		}
	}

	getTxtFallback() {
		if (this.scrollbar_type().draw_timer) return;
		if (!panelBio.updateNeeded()) return;
		if (!this.get && !this.textUpdate) return;
		this.na = '';
		if (this.textUpdate) this.updText();
		if (this.get) {
			this.albumReset();
			this.artistReset();
			if (this.calc) this.calc = pptBio.artistView ? 1 : 2;
			this.getText(this.calc);
			if (this.get == 2) panelBio.focusServer();
			this.calc = false;
			this.get = 0;
		}
	}

	getScrollPos() {
		let v;
		switch (pptBio.artistView) {
			case true:
				v = this.artist + '-' + this.bio.allmusic + '-' + pptBio.lockBio + '-' + pptBio.bothBio;
				if (!this.bio.scrollPos[v]) return art_scrollbar.setScroll(0);
				if (this.bio.scrollPos[v].text === this.bio.arr.length + '-' + this.bio.text) art_scrollbar.setScroll(this.bio.scrollPos[v].scroll || 0);
				else if (pptBio.showFilmStrip && pptBio.autoFilm) break;
				else {
					this.bio.scrollPos[v].scroll = 0;
					this.bio.scrollPos[v].text = '';
				}
				break;
			case false: {
				v = (this.rev.allmusic || panelBio.style.inclTrackRev != 2 || pptBio.bothRev ? this.albumartist + this.album + '-' : '') + this.rev.allmusic + '-' + pptBio.lockRev + '-' + pptBio.bothRev + '-' + pptBio.inclTrackRev;
				if (!this.rev.scrollPos[v]) return alb_scrollbar.setScroll(0);
				let match = false;
				if (panelBio.style.inclTrackRev != 1) {
					if (this.rev.scrollPos[v].text === uiBio.font.main.Size + '-' + panelBio.text.w + '-' + this.rev.text) match = true;
				} else {
					const tx1 = (uiBio.font.main.Size + '-' + panelBio.text.w).toString();
					const tx2 = $Bio.strip(this.rev.lfmAlb || this.rev.lfm);
					const tx3 = $Bio.strip(this.rev.am);
					if (this.rev.scrollPos[v].text.startsWith(tx1) && (tx2 && this.rev.scrollPos[v].text.includes(tx2) || tx3 && this.rev.scrollPos[v].text.includes(tx3))) match = true;
				}
				if (match) {
					const set_scroll = panelBio.style.inclTrackRev != 1 ? this.rev.scrollPos[v].scroll : Math.min(this.rev.scrollPos[v].scroll, alb_scrollbar.max_scroll);
					alb_scrollbar.setScroll(set_scroll || 0);
				} else if (pptBio.showFilmStrip && pptBio.autoFilm) break;
				else {
					this.rev.scrollPos[v].scroll = 0;
					this.rev.scrollPos[v].text = '';
				}
				break;
			}
		}
	}

	getText(p_calc, update) {
		if (pptBio.img_only) return;
		const a = $Bio.clean(this.artist);
		this.newText = false;
		if (!panelBio.lock) {
			this.trackartist = name.artist(pptBio.focus);
			this.track = name.title(pptBio.focus);
		}
		switch (true) {
			case pptBio.artistView:
				if (!a) break;
				if (pptBio.bothBio) {
					if (!this.done.amBio || update) {
						this.done.amBio = true;
						this.amBio(a);
						if (!this.done.lfmBio || update) {
							this.done.lfmBio = true;
							this.lfmBio(a);
						}
					}
					break;
				}
				if (!pptBio.allmusic_bio && (!this.done.lfmBio || update)) {
					this.done.lfmBio = true;
					this.lfmBio(a);
					if (!this.bio.lfm && !pptBio.lockBio && (!this.done.amBio || update)) {
						this.done.amBio = true;
						this.amBio(a);
					}
				}
				if (pptBio.allmusic_bio && (!this.done.amBio || update)) {
					this.done.amBio = true;
					this.amBio(a);
					if (!this.bio.am && !pptBio.lockBio && (!this.done.lfmBio || update)) {
						this.done.lfmBio = true;
						this.lfmBio(a);
					}
				}
				break;
			case !pptBio.artistView: {
				const aa = $Bio.clean(this.albumartist);
				const l = $Bio.clean(this.album);
				if (!aa || !l && !panelBio.style.inclTrackRev) {
					this.rating.am = -1;
					this.rating.lfm = -1;
					this.rating.avg = -1;
					butBio.check();
					break;
				}
				if (panelBio.isRadio(pptBio.focus) && !panelBio.style.inclTrackRev && !panelBio.alb.ix) break;
				if (pptBio.bothRev) {
					if (!this.done.amRev || update) {
						this.done.amRev = true;
						this.amRev(a, aa, l);
						if (!this.done.lfmRev || update) {
							this.done.lfmRev = true;
							this.lfmRev(a, aa, l);
						}
					}
					break;
				}
				if (pptBio.allmusic_alb && (!this.done.amRev || update)) {
					this.done.amRev = true;
					this.amRev(a, aa, l);
					if (!this.rev.am && !pptBio.lockRev && (!this.done.lfmRev || update)) {
						this.done.lfmRev = true;
						this.lfmRev(a, aa, l);
					}
				}
				if (!pptBio.allmusic_alb && (!this.done.lfmRev || update)) {
					this.done.lfmRev = true;
					this.lfmRev(a, aa, l);
					if (!this.rev.lfm && !pptBio.lockRev && (!this.done.amRev || update)) {
						this.done.amRev = true;
						this.amRev(a, aa, l);
					}
				}
				break;
			}
		}
		if (!update || this.newText) {
			this.rev.text = '';
			this.d.aB1 = false;
			this.d.aB2 = false;
			this.d.aR1 = false;
			this.d.aR2 = false;
			this.bio.text = '';
			this.head = pptBio.heading;
			butBio.setSrcBtnHide();
			this.d.lB1 = false;
			this.d.lB2 = false;
			this.d.lR1 = false;
			this.d.lR2 = false;
			switch (true) {
				case !pptBio.bothBio:
					if (pptBio.allmusic_bio) {
						if (pptBio.sourceHeading == 2 && !this.rev.am && this.rev.lfm) this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
						this.bio.text = !pptBio.lockBio ? this.bio.am ? (pptBio.sourceHeading == 2 ? this.bio.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.am : (pptBio.sourceHeading == 2 && this.bio.lfm ? this.bio.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm : (pptBio.sourceHeading == 2 && (this.bio.am || panelBio.id.imgText || pptBio.text_only) ? this.bio.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' + (this.bio.am ? '' : 'Nothing Found') : '') + this.bio.am;
						if (this.bio.am || pptBio.lockBio) this.d.aB1 = true;
						else if (this.bio.lfm) this.d.lB1 = true;
						if (this.bio.am || pptBio.lockBio) this.bio.allmusic = true;
						else if (this.bio.lfm) this.bio.allmusic = false;
						else this.bio.allmusic = true;
					} else {
						if (pptBio.sourceHeading == 2 && this.bio.lfm) this.bio.lfm = this.bio.lfm.replace(/Last.fm: /g, '');
						this.bio.text = !pptBio.lockBio ? this.bio.lfm ? (pptBio.sourceHeading == 2 ? this.bio.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm : (pptBio.sourceHeading == 2 && this.bio.am ? this.bio.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.am : (pptBio.sourceHeading == 2 && (this.bio.lfm || panelBio.id.imgText || pptBio.text_only) ? this.bio.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' + (this.bio.lfm ? '' : 'Nothing Found') : '') + this.bio.lfm;
						if (this.bio.lfm || pptBio.lockBio) this.d.lB1 = true;
						else if (this.bio.am) this.d.aB1 = true;
						if (this.bio.lfm || pptBio.lockBio) this.bio.allmusic = false;
						else if (this.bio.am) this.bio.allmusic = true;
						else this.bio.allmusic = false;
					}
					this.bio.both = false;
					break;
				case pptBio.bothBio:
					if (pptBio.allmusic_bio) {
						if (this.bio.am) {
							this.bio.text = (pptBio.sourceHeading ? this.bio.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.am;
							this.d.aB1 = true;
						}
						if (this.bio.lfm) {
							this.bio.lfm = this.bio.lfm.replace(/Last.fm: /g, '');
							this.bio.text = this.bio.text + (this.bio.am ? '\r\n\r\n' : '') + (pptBio.sourceHeading ? '#!#' + this.bio.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm;
							this.d.lB2 = true;
						}
						if (this.bio.am) this.bio.allmusic = true;
						else if (this.bio.lfm) this.bio.allmusic = false;
						else this.bio.allmusic = true;
					} else {
						if (this.bio.lfm) {
							this.bio.lfm = this.bio.lfm.replace(/Last.fm: /g, '');
							this.bio.text = (pptBio.sourceHeading ? this.bio.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm;
							this.d.lB1 = true;
						}
						if (this.bio.am) {
							this.bio.text = this.bio.text + (this.bio.lfm ? '\r\n\r\n' : '') + (pptBio.sourceHeading ? '#!#' + this.bio.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.bio.am;
							this.d.aB2 = true;
						}
						if (this.bio.lfm) this.bio.allmusic = false;
						else if (this.bio.am) this.bio.allmusic = true;
						else this.bio.allmusic = false;
					}
					this.bio.both = this.bio.am && this.bio.lfm || !this.bio.am && !this.bio.lfm ? true : false;
					break;
			}
			switch (true) {
				case !pptBio.bothRev:
					if (pptBio.allmusic_alb) {
						if (pptBio.sourceHeading == 2 && !this.rev.am && this.rev.lfm) this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
						this.rev.text = !pptBio.lockRev ? this.rev.am ? (pptBio.sourceHeading == 2 ? this.rev.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.am : (pptBio.sourceHeading == 2 && this.rev.lfm ? this.rev.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm : (pptBio.sourceHeading == 2 && (this.rev.am || panelBio.id.imgText || pptBio.text_only) ? this.rev.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' + (this.rev.am ? '' : 'Nothing Found') : '') + this.rev.am;
						if (this.rev.am || pptBio.lockRev) this.d.aR1 = true;
						else if (this.rev.lfm) this.d.lR1 = true;
						if (this.rev.am || pptBio.lockRev) this.rev.allmusic = true;
						else if (this.rev.lfm) this.rev.allmusic = false;
						else this.rev.allmusic = true;
					} else {
						if (pptBio.sourceHeading == 2 && this.rev.lfm) this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
						this.rev.text = !pptBio.lockRev ? this.rev.lfm ? (pptBio.sourceHeading == 2 ? this.rev.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm : (pptBio.sourceHeading == 2 && this.rev.am ? this.rev.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.am : (pptBio.sourceHeading == 2 && (this.rev.lfm || panelBio.id.imgText || pptBio.text_only) ? this.rev.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' + (this.rev.lfm ? '' : 'Nothing Found') : '') + this.rev.lfm;
						if (this.rev.lfm || pptBio.lockRev) this.d.lR1 = true;
						else if (this.rev.am) this.d.aR1 = true;
						if (this.rev.lfm || pptBio.lockRev) this.rev.allmusic = false;
						else if (this.rev.am) this.rev.allmusic = true;
						else this.rev.allmusic = false;
					}
					this.rev.both = false;
					break;
				case pptBio.bothRev:
					if (pptBio.allmusic_alb) {
						if (this.rev.am) {
							this.rev.text = (pptBio.sourceHeading ? this.rev.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.am;
							this.d.aR1 = true;
						}
						if (this.rev.lfm) {
							this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
							this.rev.text = this.rev.text + (this.rev.am ? '\r\n\r\n' : '') + (pptBio.sourceHeading ? '#!#' + this.rev.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm;
							this.d.lR2 = true;
						}
						if (this.rev.am) this.rev.allmusic = true;
						else if (this.rev.lfm) this.rev.allmusic = false;
						else this.rev.allmusic = true;
					} else {
						if (this.rev.lfm) {
							this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
							this.rev.text = (pptBio.sourceHeading ? this.rev.lfmSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm;
							this.d.lR1 = true;
						}
						if (this.rev.am) {
							this.rev.text = this.rev.text + (this.rev.lfm ? '\r\n\r\n' : '') + (pptBio.sourceHeading ? '#!#' + this.rev.amSubHead[pptBio.heading ? 0 : 1] + '\r\n' : '') + this.rev.am;
							this.d.aR2 = true;
						}
						if (this.rev.lfm) this.rev.allmusic = false;
						else if (this.rev.am) this.rev.allmusic = true;
						else this.rev.allmusic = false;
					}
					this.rev.both = this.rev.am && this.rev.lfm || !this.rev.am && !this.rev.lfm ? true : false;
					break;
			}
			this.bio.subHead = !pptBio.sourceHeading || !this.bio.text || !pptBio.bothBio && pptBio.sourceHeading != 2 ? 0 : 1;
			this.rev.subHead = !pptBio.sourceHeading || !this.rev.text || !pptBio.bothRev && pptBio.sourceHeading != 2 ? 0 : 1;
			if (uiBio.stars == 1 && pptBio.hdBtnShow && this.rev.both) {
				let c = 0;
				this.rating.avg = -1;
				if (this.rating.am != -1 || this.rating.lfm != -1) {
					this.rating.avg = 0;
					if (this.rating.am != -1) {
						this.rating.avg += this.rating.am;
						c++;
					}
					if (this.rating.lfm != -1) {
						this.rating.avg += this.rating.lfm;
						c++;
					}
					this.rating.avg /= c;
					this.rating.avg = Math.round(this.rating.avg);
				}
			}
			if (!panelBio.id.imgText) this.text = pptBio.artistView ? this.bio.text ? true : false : this.rev.text ? true : false;
			else this.text = true;
			imgBio.setCrop(true);
			if (!this.bio.text && (pptBio.text_only || panelBio.id.imgText)) this.bio.text = !pptBio.heading ? this.bio.fallbackText[1] : this.bio.fallbackText[0];
			if (!this.rev.text && (pptBio.text_only || panelBio.id.imgText)) this.rev.text = !pptBio.heading ? this.rev.fallbackText[1] : this.rev.fallbackText[0];
			if ((pptBio.artistView && !this.bio.text || !pptBio.artistView && !this.rev.text) && !pptBio.text_only) {
				this.head = false;
				butBio.setSrcBtnHide();
			}
			if (this.bio.text != this.bio.cur || p_calc && p_calc !== 2) {
				this.bio.cur = this.bio.text;
				this.artCalc();
			}
			if (this.rev.text != this.rev.cur || p_calc && p_calc !== 1) {
				this.rev.cur = this.rev.text;
				this.albCalc();
			}
			if (pptBio.text_only && !uiBio.style.isBlur || panelBio.alb.ix && panelBio.style.inclTrackRev) this.paint();
		}
		if (!pptBio.heading) {
			this.newText = false;
			return;
		}
		if (this.updTrackSubHead()) return this.getText(false);
		if (panelBio.lock && !this.newText) {
			if (this.curHeadingID == this.headingID()) {
				this.newText = false;
				return;
			} else this.curHeadingID = this.headingID();
		}
		this.newText = false;
		if (pptBio.artistView) this.heading = uiBio.show.headingText ? this.tf(this.bio.allmusic ? pptBio.amBioHeading : pptBio.lfmBioHeading, pptBio.artistView) : '';
		else this.heading = uiBio.show.headingText ? (panelBio.style.inclTrackRev && !this.rev.allmusic && this.rev.trackHeading ? this.tf(pptBio.lfmTrackHeading, pptBio.artistView, true) : this.tf(this.rev.allmusic ? pptBio.amRevHeading : pptBio.lfmRevHeading, pptBio.artistView)) : '';
		if (panelBio.lock) this.curHeadingID = this.headingID();
	}

	getWidths() {
		$Bio.gr(1, 1, false, g => this.d.w = [' ', this.bio.amSubHead[0] + ' ', this.bio.lfmSubHead[0] + ' ', this.rev.amSubHead[0] + ' ', this.rev.lfmSubHead[0] + ' ', this.bio.amSubHead[1] + ' ', this.bio.lfmSubHead[1] + ' ', this.rev.amSubHead[1] + ' ', this.rev.lfmSubHead[1] + ' '].map(v => Math.max(g.CalcTextWidth(v, uiBio.font.subHeadSource), 1)));
	}

	grab() {
		this.textUpdate = 1;
		this.notifyTags();
		if (panelBio.block()) return;
		this.updText();
	}

	headingID() {
		return pptBio.artistView + '-' + panelBio.art.ix + '-' + panelBio.alb.ix + '-' + pptBio.allmusic_bio + '-' + pptBio.allmusic_alb + '-' + panelBio.style.inclTrackRev;
	}

	lfmBio(a) {
		const lBio = panelBio.getPth('bio', pptBio.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foLfmBio', true).pth;
		if (!$Bio.file(lBio)) return;
		this.mod.lfmBio = $Bio.lastModified(lBio);
		if (this.mod.lfmBio == this.mod.curLfmBio) return;
		this.bio.lfm = $Bio.open(lBio).trim();
		if (!pptBio.stats) {
			const f = this.bio.lfm.indexOf('Last.fm: ');
			if (f != -1) this.bio.lfm = this.bio.lfm.slice(0, f).trim();
		}
		this.bio.lfm = this.bio.lfm.replace(/\s\u200b\|[\d.,\s]*?;/g, ';').replace(/\u200b\|[\d.,\s]*?$/gm, '');
		if (pptBio.expandLists) this.bio.lfm = this.expandLists('lfmBio', this.bio.lfm);
		if (pptBio.summaryFirst) {
			const popNow = 'Popular Now: |Beliebt Jetzt: |Popular Ahora: |Populaire Maintenant: |Popolare Ora: |\\u4eca\\u4eba\\u6c17: |Popularne Teraz: |Popular Agora: |\\u041f\\u043e\\u043f\\u0443\\u043b\\u044f\\u0440\\u043d\\u044b\\u0435 \\u0441\\u0435\\u0439\\u0447\\u0430\\u0441: |Popul\\u00e4r Nu: |\\u015eImdi Pop\\u00fcler: |\\u70ed\\u95e8 \\u73b0\\u5728';
			const yrsActive = "Years Active: |Jahre aktiv: |A\\u00f1os de actividad: |Ann\\u00e9es d'activit\\u00e9: |Anni di attivit\\u00e0: |\\u6d3b\\u52d5\\u671f\\u9593: |Lata aktywno\\u015bci: |Anos de atividade: |\\u0410\\u043a\\u0442\\u0438\\u0432\\u043d\\u043e\\u0441\\u0442\\u044c \\(\\u043b\\u0435\\u0442\\): |\\u00c5r aktiv: |Aktif y\\u0131llar: |\\u6d3b\\u8dc3\\u5e74\\u4efd: |Born: |Geburtstag: |Fecha de nacimiento: |N\\u00e9\\(e\\) le: |Data di nascita: |\\u751f\\u5e74\\u6708\\u65e5: |Urodzony: |Data de nascimento: |\\u0413\\u043e\\u0434 \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum tarihi: |\\u51fa\\u751f";
			this.bio.lfm = this.summaryFirstText('Top Tags: ', yrsActive, this.bio.lfm, popNow).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		} else if (cfg.lang.ix > 3) this.bio.lfm = this.bio.lfm.replace('Top Tags: ', this.topTags[cfg.lang.ix] + ': ');
		this.newText = true;
		this.mod.curLfmBio = this.mod.lfmBio;
	}

	lfmBioPth() {
		if (pptBio.img_only) return ['', '', false, false];
		return panelBio.getPth('bio', pptBio.focus, this.artist, '', '', cfg.supCache, $Bio.clean(this.artist), '', '', 'foLfmBio', false);
	}

	lfmRev(a, aa, l) {
		let lfm_tr_mod = '';
		let rat = '';
		let trackRev = '';
		let trk = '';
		const lRev = panelBio.getPth('rev', pptBio.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foLfmRev', true).pth;
		if (!$Bio.file(lRev)) {
			this.rating.lfm = -1;
			butBio.check();
			if (!panelBio.style.inclTrackRev) {
				this.rev.lfmAlb = '';
				return;
			}
		}
		if (panelBio.style.inclTrackRev) {
			trk = this.track.toLowerCase();
			trackRev = $Bio.jsonParse(panelBio.getPth('track', pptBio.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foLfmRev', true).pth, false, 'file');
			if (trackRev[trk] && trackRev[trk].update) lfm_tr_mod = trackRev[trk].update;
		}
		this.mod.lfmRev = $Bio.file(lRev) && panelBio.style.inclTrackRev != 2 ? $Bio.lastModified(lRev) + lfm_tr_mod : lfm_tr_mod;
		if (this.mod.lfmRev == this.mod.curLfmRev) return;
		this.rev.lfmAlb = '';
		if (panelBio.style.inclTrackRev != 2) this.rev.lfmAlb = $Bio.open(lRev).trim();
		this.rev.lfmAlb = this.rev.lfmAlb.replace(/\s\u200b\|[\d.,\s]*?;/g, ';').replace(/\u200b\|[\d.,\s]*?$/gm, '');
		this.newText = true;
		this.mod.curLfmRev = this.mod.lfmRev;
		this.rating.lfm = -1;
		if (panelBio.style.inclTrackRev != 2) {
			if (pptBio.lfmRating) {
				const b = this.rev.lfmAlb.indexOf('Rating: ');
				if (b != -1) {
					this.rating.lfm = this.rev.lfmAlb.substring(b).replace(/\D/g, '');
					this.rating.lfm = Math.min(((Math.floor(0.1111 * this.rating.lfm + 0.3333) / 2)), 5);
					if (uiBio.stars == 1 && pptBio.hdBtnShow) this.rating.lfm *= 2;
					if ((uiBio.stars == 2 || uiBio.stars == 1 && !pptBio.hdBtnShow) && this.rating.lfm != -1) {
						const subHeadOn = pptBio.bothRev && pptBio.sourceHeading || pptBio.sourceHeading == 2;
						if (pptBio.ratingTextPos == 2 || subHeadOn && !pptBio.ratingTextPos) {
							this.rating.lfm *= 2;
							if (!pptBio.summaryFirst) this.rev.lfmAlb = (!subHeadOn ? pptBio.lastfm_name + ':\r\n\r\n' : '') + this.rev.lfmAlb;
							else rat = pptBio.lastfm_name + ': ' + this.rating.lfm;
						} else {
							if (!pptBio.summaryFirst) this.rev.lfmAlb = '>> ' + pptBio.lastfm_name + ': ' + this.rating.lfm + ' <<  ' + (/^Top Tags: /.test(this.rev.lfmAlb) ? '\r\n\r\n' : '') + this.rev.lfmAlb;
							else rat = pptBio.lastfm_name + ': ' + this.rating.lfm;
						}
					}
				}
			}
			this.rev.lfmAlb = pptBio.score ? this.rev.lfmAlb.replace('Rating: ', '') : this.rev.lfmAlb.replace(/^Rating: .*$/m, '').trim();
			if (pptBio.summaryFirst) {
				const releaseDate = 'Release Date: |Veröffentlichungsdatum: |Fecha De Lanzamiento: |Date De Sortie: |Data Di Pubblicazione: |リリース日: |Data Wydania: |Data De Lançamento: |Дата релиза: |Utgivningsdatum: |Yayınlanma Tarihi: |发布日期: ';
				this.rev.lfmAlb = this.summaryFirstText('Top Tags: ', releaseDate, this.rev.lfmAlb, '', rat);
			} else if (cfg.lang.ix > 3) this.rev.lfmAlb = this.rev.lfmAlb.replace('Top Tags: ', this.topTags[cfg.lang.ix] + ': ');
		}
		if (!pptBio.stats) {
			this.rev.lfmAlb = this.rev.lfmAlb.replace(/^Last.fm: .*$(\n)?/gm, '').trim();
		}
		this.rev.lfm = this.rev.lfmAlb;
		if (panelBio.style.inclTrackRev) {
			if (trackRev && trackRev[trk]) {
				let wiki = '';
				if (trackRev[trk].releases) wiki = trackRev[trk].releases;
				if (trackRev[trk].wiki) wiki += wiki ? '\r\n\r\n' + trackRev[trk].wiki : trackRev[trk].wiki;
				if (trackRev[trk].stats) wiki += wiki ? '\r\n\r\n' + trackRev[trk].stats : trackRev[trk].stats;
				if (wiki) {
					if (pptBio.trackHeading == 1 && (this.rev.lfmAlb || !pptBio.heading || pptBio.bothRev && panelBio.style.inclTrackRev == 2 && (this.rev.lfmAlb || this.rev.am)) || pptBio.trackHeading == 2) {
						this.rev.trackHeading = false;
						trackRev = '#!!#' + this.tf(pptBio.lfmTrackSubHeading, pptBio.artistView, true) + '\r\n' + wiki;
					} else {
						this.rev.trackHeading = true;
						trackRev = wiki;
					}
					this.rev.lfm = this.rev.lfmAlb + (this.rev.lfmAlb ? '\r\n\r\n' : '') + trackRev;
				} else this.rev.trackHeading = false;
				if ((this.rev.lfmAlb || this.rev.am) && pptBio.heading && !pptBio.trackHeading) this.rev.trackHeading = false;
			} else this.rev.trackHeading = false;
		}
		if (!pptBio.stats) {
			this.rev.lfm = this.rev.lfm.replace(/^Last.fm: .*$(\n)?/gm, '').trim();
		}
		if (pptBio.expandLists) this.rev.lfm = this.expandLists('lfmRev', this.rev.lfm);
		if (pptBio.summaryFirst || !pptBio.stats) this.rev.lfm = this.rev.lfm.replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (!this.rev.lfm) butBio.check();
	}

	lfmRevPth() {
		if (pptBio.img_only) return ['', '', false, false];
		return panelBio.getPth('rev', pptBio.focus, this.artist, this.album, '', cfg.supCache, $Bio.clean(this.artist), $Bio.clean(this.albumartist), $Bio.clean(this.album), 'foLfmRev', false);
	}

	lfmTrackPth() {
		if (pptBio.img_only || pptBio.artistView) return ['', '', false, false];
		return panelBio.getPth('track', pptBio.focus, this.artist, 'Track Reviews', '', '', $Bio.clean(this.artist), '', 'Track Reviews', 'foLfmRev', false);
	}

	logScrollPos(n) {
		let keys = [];
		let v;
		n = n == 'rev' ? false : pptBio.artistView;
		switch (n) {
			case true:
				keys = Object.keys(this.bio.scrollPos);
				if (keys.length > 70) delete this.bio.scrollPos[keys[0]];
				v = this.artist + '-' + this.bio.allmusic + '-' + pptBio.lockBio + '-' + pptBio.bothBio;
				this.bio.scrollPos[v] = {};
				this.bio.scrollPos[v].scroll = art_scrollbar.scroll;
				this.bio.scrollPos[v].text = this.bio.arr.length + '-' + this.bio.text;
				break;
			case false:
				keys = Object.keys(this.rev.scrollPos);
				if (keys.length > 70) delete this.rev.scrollPos[keys[0]];
				v = (this.rev.allmusic || panelBio.style.inclTrackRev != 2 || pptBio.bothRev ? this.albumartist + this.album + '-' : '') + this.rev.allmusic + '-' + pptBio.lockRev + '-' + pptBio.bothRev + '-' + pptBio.inclTrackRev;
				this.rev.scrollPos[v] = {};
				this.rev.scrollPos[v].scroll = alb_scrollbar.scroll;
				this.rev.scrollPos[v].text = uiBio.font.main.Size + '-' + panelBio.text.w + '-' + (panelBio.style.inclTrackRev != 1 ? this.rev.text : $Bio.strip((this.rev.lfmAlb || this.rev.lfm) + this.rev.am));
				break;
		}
	}

	notifyTags() {
		if (!cfg.notifyTags) return;
		this.currentTrackTags();
	}

	on_playback_new_track(force) {
		if (panelBio.lock) panelBio.getList();
		this.notifyTags();
		if (!panelBio.updateNeeded() && !force) return;
		if (panelBio.block()) {
			this.get = 1;
			if (!panelBio.lock) panelBio.getList(true);
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
		} else {
			if (!panelBio.lock) panelBio.getList(true);
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
			this.na = '';
			this.getText(false);
			this.get = 0;
		}
	}

	on_size() {
		if (this.initialise) {
			this.albumReset();
			this.artistReset();
			this.initialise = false;
		}
		this.bio.scrollPos = {};
		this.rev.scrollPos = {};
		this.getText(false);
		panelBio.getList(true);
		butBio.refresh();
		this.notifyTags();
	}

	paint() {
		if (!this.repaint) return;
		if (!panelBio.style.showFilmStrip) window.Repaint();
		else window.RepaintRect(panelBio.filmStripSize.l, panelBio.filmStripSize.t, panelBio.w - panelBio.filmStripSize.l - panelBio.filmStripSize.r, panelBio.h - panelBio.filmStripSize.t - panelBio.filmStripSize.b);
	}

	scrollbar_type() {
		return pptBio.artistView ? art_scrollbar : alb_scrollbar;
	}

	summaryFirstText(s1, s2, text, s3, rating) {
		if (!text) return text;
		let ix = -1;
		let m = text.match(RegExp(s2, 'gi'));
		let sub1 = '';
		let sub2 = '';
		ix = text.lastIndexOf(s1);
		if (ix != -1) {
			sub1 = text.substring(ix);
			sub1 = sub1.split('\n')[0].trim();
			text = text.replace(RegExp(sub1), '');
			sub1 = sub1.replace(RegExp(s1), '').replace(/, /g, ' \u2219 ');
			let sub1_w = 0;
			$Bio.gr(1, 1, false, g => sub1_w = g.CalcTextWidth(sub1, uiBio.font.main));
			if (sub1) sub1 += sub1_w < panelBio.text.w || this.init ? '\r\n' : '  |  ';
		}
		this.init = false;
		if (m) {
			ix = -1;
			m = m[m.length - 1].toString();
			ix = text.lastIndexOf(m);
		}
		if (ix != -1) {
			sub2 = text.substring(ix);
			sub2 = sub2.split('\n')[0].trim();
			text = text.replace(RegExp($Bio.regexEscape(sub2)), '');
			sub2 = sub2.replace(' | ', '  |  ');
			if (sub2 && rating && !s3) sub2 += ('  |  ' + rating);
			if (sub2 && !s3) sub2 += '\r\n';
		}
		if (!s3) {
			text = sub1 + $Bio.titlecase(sub2) + (sub1 || sub2 ? '\r\n' : '') + text;
			return '¦|¦\r\n' + text.trim() + '\r\n¦|¦';
		}
		let sub3 = '';
		let sub4 = '';
		ix = -1;
		m = text.match(RegExp(s3, 'i'));
		if (m) {
			m = m.toString();
			ix = text.lastIndexOf(m);
			if (ix != -1) {
				sub3 = text.substring(ix).replace('\r\n\r\n', ';');
				sub3 = sub3.split(';')[0].trim();
				text = text.replace(RegExp($Bio.regexEscape(sub3) + '; '), '');
				text = text.replace(RegExp($Bio.regexEscape(sub3) + '\r\n\r\n'), '');
			}
		}
		if (sub2 && sub3) sub4 += sub2 + '  |  ' + sub3;
		else sub4 += sub2 + sub3;
		if (sub4) sub4 += '\r\n';
		text = sub1 + $Bio.titlecase(sub4) + (sub1 || sub4 ? '\r\n' : '') + text;
		return '¦|¦\r\n' + text.trim() + '\r\n¦|¦';
	}

	refresh(n) {
		switch (n) {
			case 0:
				filmStrip.logScrollPos();
				panelBio.setStyle();
				imgBio.clearCache();
				this.albumFlush();
				this.artistFlush();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				imgBio.getImages();
				if (pptBio.showFilmStrip && pptBio.autoFilm) this.getScrollPos();
				butBio.setLookUpPos();
				break;
			case 1:
				if (panelBio.style.inclTrackRev == 1) this.logScrollPos();
				uiBio.getFont();
				uiBio.calcText();
				panelBio.setStyle();
				uiBio.getColours();
				butBio.createStars();
				this.albumFlush();
				this.artistFlush();
				if (!pptBio.img_only) imgBio.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				butBio.refresh(true);
				imgBio.getImages();
				break;
			case 2:
				if (panelBio.style.inclTrackRev == 1) this.logScrollPos();
				uiBio.calcText();
				panelBio.setStyle();
				if (!pptBio.img_only) imgBio.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.albCalc();
				this.artCalc();
				imgBio.getImages();
				if (pptBio.text_only && !uiBio.style.isBlur) this.paint();
				break;
			case 3:
				if (panelBio.style.inclTrackRev == 1) uiBio.getColours();
				uiBio.getFont();
				panelBio.setStyle();
				if (!pptBio.img_only) imgBio.clearCache();
				this.albumFlush();
				this.getText(false);
				imgBio.getImages();
				break;
			case 4:
				if (panelBio.style.inclTrackRev == 1) this.logScrollPos();
				uiBio.getColours();
				uiBio.getFont();
				panelBio.setStyle();
				if (!pptBio.img_only) imgBio.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.albCalc();
				this.artCalc();
				imgBio.getImages();
				if (pptBio.text_only && !uiBio.style.isBlur) this.paint();
				break;
			case 5:
				filmStrip.logScrollPos();
				panelBio.setStyle();
				this.albumFlush();
				this.artistFlush();
				imgBio.clearCache();
				if (panelBio.stndItem()) {
					this.getText(false);
					imgBio.getImages();
				} else {
					this.getItem(false, panelBio.art.ix, panelBio.alb.ix);
					imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
				}
				if (pptBio.artistView) {
					this.rev.cur = '';
					this.artCalc();
				} else {
					this.bio.cur = '';
					this.albCalc();
				}
				break;
		}
		initBiographyColors();
	}

	toggle(n) {
		const text_state = this.text;
		switch (n) {
			case 0:
				this.logScrollPos();
				pptBio.toggle('allmusic_bio');
				if (pptBio.allmusic_bio) this.done.amBio = false;
				else this.done.lfmBio = false;
				this.getText(false);
				if (pptBio.allmusic_bio != this.bio.allmusic) {
					if (pptBio.heading) this.na = pptBio.allmusic_bio ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = pptBio.allmusic_bio ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timerBio.clear(timerBio.source);
					timerBio.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timerBio.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!pptBio.img_only && !pptBio.text_only && this.text != text_state) imgBio.clearCache();
				imgBio.getImages();
				break;
			case 1:
				this.logScrollPos();
				pptBio.toggle('allmusic_alb');
				if (pptBio.allmusic_alb) this.done.amRev = false;
				else this.done.lfmRev = false;
				this.getText(false);
				if (pptBio.allmusic_alb != this.rev.allmusic) {
					if (pptBio.heading) this.na = pptBio.allmusic_alb ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = pptBio.allmusic_alb ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timerBio.clear(timerBio.source);
					timerBio.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timerBio.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!pptBio.img_only && !pptBio.text_only && this.text != text_state) imgBio.clearCache();
				imgBio.getImages();
				break;
			case 2:
				pptBio.toggle('lockBio');
				if (pptBio.allmusic_bio) this.done.amBio = false;
				else this.done.lfmBio = false;
				this.getText(false);
				imgBio.clearCache();
				imgBio.getImages();
				butBio.check();
				break;
			case 3:
				pptBio.toggle('lockRev');
				if (pptBio.allmusic_alb) this.done.amRev = false;
				else this.done.lfmRev = false;
				this.getText(false);
				imgBio.clearCache();
				imgBio.getImages();
				butBio.check();
				break;
			case 4:
				pptBio.toggle('bothBio');
				this.done.amBio = false;
				this.done.lfmBio = false;
				this.getText(true);
				imgBio.clearCache();
				imgBio.getImages();
				butBio.check();
				break;
			case 5:
				pptBio.toggle('bothRev');
				this.albumFlush();
				this.getText(true);
				imgBio.clearCache();
				imgBio.getImages();
				butBio.check();
				break;
			case 6:
				this.logScrollPos();
				pptBio.toggle('allmusic_bio');
				this.done.amBio = false;
				this.done.lfmBio = false;
				this.getText(1);
				if (pptBio.allmusic_bio != this.bio.allmusic) {
					if (pptBio.heading) this.na = pptBio.allmusic_bio ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = pptBio.allmusic_bio ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timerBio.clear(timerBio.source);
					timerBio.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timerBio.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!pptBio.img_only && !pptBio.text_only && this.text != text_state) imgBio.clearCache();
				imgBio.getImages();
				break;
			case 7:
				this.logScrollPos();
				pptBio.toggle('allmusic_alb');
				this.done.amRev = false;
				this.done.lfmRev = false;
				this.getText(2);
				if (pptBio.allmusic_alb != this.rev.allmusic) {
					if (pptBio.heading) this.na = pptBio.allmusic_alb ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = pptBio.allmusic_alb ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timerBio.clear(timerBio.source);
					timerBio.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timerBio.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!pptBio.img_only && !pptBio.text_only && this.text != text_state) imgBio.clearCache();
				imgBio.getImages();
				break;
		}
	}

	tf(n, artistView, trackreview) {
		if (!n) return '';
		if (panelBio.lock) n = n.replace(/%artist%|\$meta\(artist,0\)/g, '#¦#¦#%artist%#¦#¦#').replace(/%title%|\$meta\(title,0\)/g, '#!#!#%title%#!#!#');
		let a = $Bio.tfEscape(artistView ? this.artist : (!trackreview ? (panelBio.alb.ix ? this.albumartist : this.artist) : this.trackartist));
		let aa = $Bio.tfEscape(artistView ? (panelBio.art.ix ? this.artist : this.albumartist) : (!trackreview ? this.albumartist : this.trackartist));
		let l = $Bio.tfEscape(this.album.replace('Album Unknown', ''));
		let tr = $Bio.tfEscape(this.track);
		n = n.replace(/%lookup_item%/gi, panelBio.simTagTopLookUp() ? '$&#@!%path%#@!' : '$&');
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? '$&#@!%path%#@!' : '$&').replace(/%bio_artist%/gi, a).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? '$&#@!%path%#@!' : '$&').replace(/%bio_albumartist%/gi, aa).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? '$&#@!%path%#@!' : '$&').replace(/%bio_album%/gi, l).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? '$&#@!%path%#@!' : '$&').replace(/%bio_title%/gi, tr);
		n = $Bio.eval(n, pptBio.focus);
		if (panelBio.lock) n = n.replace(/#¦#¦#.*?#¦#¦#/g, this.trackartist).replace(/#!#!#.*?#!#!#/g, this.track);
		n = n.replace(/#@!.*?#@!/g, '') || 'No Selection';
		return n;
	}

	updText() {
		this.getText(false, true);
		imgBio.getArtImg();
		imgBio.getFbImg();
		this.textUpdate = 0;
		this.done.amBio = this.done.lfmBio = this.done.amRev = this.done.lfmRev = false;
	}
	updTrackSubHead() {
		if (pptBio.artistView || panelBio.style.inclTrackRev != 2 || this.rev.checkedTrackSubHead || !this.rev.trackHeading || !pptBio.bothRev || !this.rev.am) return false;
		this.mod.amRev = this.rev.am = this.rev.lfm = this.mod.lfmRev = '';
		this.mod.curAmRev = this.mod.curLfmRev = '1';
		this.done.amRev = this.done.lfmRev = false;
		this.rev.checkedTrackSubHead = true;
		return true;
	}
}