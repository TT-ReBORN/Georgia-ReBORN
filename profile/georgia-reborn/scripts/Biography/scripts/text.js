'use strict';

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
		this.composition = '';
		this.countryCodes = `${cfg.storageFolder}country_codes.json`;
		this.cur = [];
		this.cur_artist = '';
		this.calc = true;
		this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.font = { main: '' };
		this.get = 1;
		this.heading = '';
		this.l = DT_NOPREFIX;
		this.lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.lp = DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.c = [this.lc, DT_RIGHT | this.lc];
		this.ncc = DT_CENTER | DT_VCENTER | DT_NOCLIP | DT_WORDBREAK | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.na = '';
		this.newText = false;
		this.repaint = true;
		this.textUpdate = 0;
		this.track = '';
		this.trackartist = '';

		this.topTags = ['Tags', 'Tags', 'Tags', 'Tags', 'Tag', '\u30bf\u30b0', 'Tagi', 'Tags', '\u0422\u0435\u0433\u0438', 'Taggar', 'Etiketler', '\u6807\u7b7e'];

		pptBio.sourceHeading = $Bio.clamp(pptBio.sourceHeading, 0, 2);
		pptBio.trackHeading = $Bio.clamp(pptBio.trackHeading, 0, 2);

		this.avail = {
			amalb: -1,
			amtrk: -1,
			lfmalb: -1,
			lfmtrk: -1,
			wikialb: -1,
			wikitrk: -1
		};

		this.bio = {
			allmusic: false,
			am: '',
			am_w: {
				hd: 0,
				nohd: 0
			},
			arr: [],
			born: 'Born: |Geburtstag: |Fecha de nacimiento: |N\\u00e9\\(e\\) le: |Data di nascita: |\\u751f\\u5e74\\u6708\\u65e5: |Urodzony: |Data de nascimento: |\\u0413\\u043e\\u0434 \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum tarihi: |\\u51fa\\u751f: ',
			bornIn: 'Born In: |Geboren in: |Lugar de nacimiento: |N\\u00e9\\(e\\) en: |Luogo di nascita: |\\u51fa\\u8eab\\u5730: |Urodzony w: |Local de nascimento: |\\u041c\\u0435\\u0441\\u0442\\u043e \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum yeri: |\\u751f\\u4e8e: ',
			cur: '',
			cur_ix: -1,
			died: 'Died: |Gestorben: |Fallecido: |D\\u00e9c\\u00e9d\\u00e9(e) le: |Data di morte: |\\u6ca1\\u5e74: |Zmar\\u0142: |Data de falecimento: |\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043c\\u0435\\u0440\\u0442\\u0438: |D\\u00f6d: |\\u00d6l\\u00fcm tarihi: |\\u901d\\u4e16:',
			drawn: 0,
			fallbackText: pptBio.bioFallbackText.split('|'),
			flag: null,
			flagCode: '',
			foundedIn: 'Founded In: |Gegr\\u00fcndet: |Formado en: |Fond\\u00e9 en: |Luogo di fondazione: |\\u51fa\\u8eab\\u5730: |Za\\u0142o\\u017cono w: |Local de funda\\u00e7\\u00e3o: |\\u041c\\u0435\\u0441\\u0442\\u043e \\u043e\\u0441\\u043d\\u043e\\u0432\\u0430\\u043d\\u0438\\u044f: |Grundat \\u00e5r: |Kuruldu\\u011fu tarih: |\\u521b\\u5efa\\u4e8e: ',
			ix: -1,
			lang: ['biography', 'Biografie', 'biograf\u00eda', 'biographie', 'biografia', '\u4f1d\u8a18', 'biografia', 'biografia', '\u0431\u0438\u043e\u0433\u0440\u0430\u0444\u0438\u044f', 'biografi', 'ya\u015fam \u00f6yk\u00fcs\u00fc', '\u4f20\u8bb0'],
			latestRelease: 'Latest Release: |Letzte Ver\\u00f6ffentlichung: |\\u00daltimo Lanzamiento: |Derni\\u00e8re Sortie: |Album Pi\\u00f9 Recente: |\\u6700\\u65b0\\u30ea\\u30ea\\u30fc\\u30b9: |Najnowsze Wydania: |\\u00daltimo Lan\\u00e7amento: |\\u041f\\u043e\\u0441\\u043b\\u0435\\u0434\\u043d\\u0438\\u0435 \\u0440\\u0435\\u043b\\u0438\\u0437\\u044b: |Senaste Skivsl\\u00e4pp: |En Son Yay\\u0131nlanan Alb\\u00fcm: |\\u6700\\u65b0\\u5185\\u5bb9: ',
			lfm: '',
			lfm_w: {
				hd: 0,
				nohd: 0
			},
			loaded: {
				am: false,
				lfm: false,
				wiki: false,
				txt: false,
				ix: -1
			},
			lookUp: false,
			membersTooltip: '',
			popNow: 'Popular Now: |Beliebt Jetzt: |Popular Ahora: |Populaire Maintenant: |Popolare Ora: |\\u4eca\\u4eba\\u6c17: |Popularne Teraz: |Popular Agora: |\\u041f\\u043e\\u043f\\u0443\\u043b\\u044f\\u0440\\u043d\\u044b\\u0435 \\u0441\\u0435\\u0439\\u0447\\u0430\\u0441: |Popul\\u00e4r Nu: |\\u015eImdi Pop\\u00fcler: |\\u70ed\\u95e8 \\u73b0\\u5728',
			reader: false,
			readerItem: '',
			readerHeading: '',
			readerTag: false,
			scrollPos: {},
			source: {
				am: pptBio.sourcebio == 0,
				lfm: pptBio.sourcebio == 1,
				wiki: pptBio.sourcebio == 2,
				txt: pptBio.sourcebio == 3
			},
			sp: 0,
			subHeading: 0,
			summaryEnd: 0,
			text: [],
			txt: '',
			txt_w: {
				hd: 0,
				nohd: 0
			},
			wiki: '',
			wiki_w: {
				hd: 0,
				nohd: 0
			},
			ln: {
				x1: 0,
				x2: 0
			},
			yrsActive: "Years Active: |Jahre aktiv: |A\\u00f1os de actividad: |Ann\\u00e9es d'activit\\u00e9: |Anni di attivit\\u00e0: |\\u6d3b\\u52d5\\u671f\\u9593: |Lata aktywno\\u015bci: |Anos de atividade: |\\u0410\\u043a\\u0442\\u0438\\u0432\\u043d\\u043e\\u0441\\u0442\\u044c \\(\\u043b\\u0435\\u0442\\): |\\u00c5r aktiv: |Aktif y\\u0131llar: |\\u6d3b\\u8dc3\\u5e74\\u4efd: |Born: |Geburtstag: |Fecha de nacimiento: |N\\u00e9\\(e\\) le: |Data di nascita: |\\u751f\\u5e74\\u6708\\u65e5: |Urodzony: |Data de nascimento: |\\u0413\\u043e\\u0434 \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum tarihi: |\\u51fa\\u751f: "
		};

		this.bio.subhead = {
			am: [cfg.amDisplayName, `${cfg.amDisplayName} ${this.bio.lang[cfg.lang.ix]}`],
			lfm: [cfg.lfmDisplayName, `${cfg.lfmDisplayName} ${this.bio.lang[cfg.lang.ix]}`],
			wiki: [cfg.wikiDisplayName, `${cfg.wikiDisplayName} ${this.bio.lang[cfg.lang.ix]}`],
			txt: ['textreader', 'textreader']
		};

		this.done = {
			amBio: false,
			amRev: false,
			lfmBio: false,
			lfmRev: false,
			wikiBio: false,
			wikiRev: false
		};

		this.id = {
			alb: '',
			curAlb: '',
			album: '',
			curAlbum: '',
			composition: '',
			curComp: '',
			tr: '',
			curTr: ''
		};

		this.line = {
			drawn: {
				bio: 3,
				rev: 3
			},
			h: {
				bio: 20,
				rev: 20
			}
		};

		this.lyrics = {
			ESLyricInstalled: utils.CheckComponent('foo_uie_eslyric'),
			lyrics3Installed: utils.CheckComponent('foo_uie_lyrics3')
		};

		this.mod = {
			amBio: 0,
			curAmBio: 0,
			amRev: 0,
			curAmRev: 0,
			lfmBio: 0,
			curLfmBio: 0,
			lfmRev: 0,
			curLfmRev: 0,
			wikiBio: 0,
			curWikiBio: 0,
			wikiRev: 0,
			curWikiRev: 0
		};

		this.rating = {
			am: -1,
			amStr: '',
			lfm: -1,
			lfmStr: '',
			y: 0
		};

		this.ratingPos = {
			heading: false,
			summary: false,
			subHeading: false,
			text: false,
			line: false
		};

		this.reader = {
			items: [],
			bio: {
				lyrics: false,
				nowplaying: false,
				perSec: false,
				props: false,
				txtLyrics: false
			},
			ESLyricSaved: false,
			lyrics3Saved: false,
			rev: {
				lyrics: false,
				nowplaying: false,
				perSec: false,
				props: false,
				txtLyrics: false
			},
			trackStartTime: fb.PlaybackTime,
			tag: false,
			text: false,
			w: {
				nameCol: 10,
				spaceCol: 10,
				valueCol: 10
			}
		};

		this.rev = {
			amFallback: false,
			allmusic: true,
			am: '',
			am_w: {
				hd: 0,
				nohd: 0
			},
			amAlb: '',
			amTrackHeading: true,
			arr: [],
			both: 0,
			checkedTrackSubHead: true,
			composersTooltip: '',
			cur: '',
			cur_ix: -1,
			drawn: 0,
			fallbackText: pptBio.revFallbackText.split('|'),
			flag: null,
			flagCode: '',
			ix: -1,
			lang: ['review', 'Rezension', 'rese\u00f1a', 'examen', 'recensione', '\u6279\u8a55', 'przegl\u0105d', 'revis\u00e3o', '\u043e\u0431\u0437\u043e\u0440', 'granskning', 'ele\u015ftiri', '\u56de\u987e'],
			len: 'Length: |Dauer: |Duraci\\u00f3n: |Dur\\u00e9e: |Durata: |\\u518d\\u751f\\u6642\\u9593: |Czas trwania: |Dura\\u00e7\\u00e3o: |\\u041f\\u0440\\u043e\\u0434\\u043e\\u043b\\u0436\\u0438\\u0442\\u0435\\u043b\\u044c\\u043d\\u043e\\u0441\\u0442\\u044c: |L\\u00e4ngd: |S\\u00fcresi: |\\u65f6\\u957f: ',
			length: ['Length: ', 'Dauer: ', 'Duraci\u00f3n: ', 'Dur\u00e9e: ', 'Durata: ', '\u518d\u751f\u6642\u9593: ', 'Czas trwania: ', 'Dura\u00e7\u00e3o: ', '\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c: ', 'L\u00e4ngd: ', 'S\u00fcresi: ', '\u65f6\u957f: '],
			lfm: '',
			lfm_w: {
				hd: 0,
				nohd: 0
			},
			lfmAlb: '',
			lfmTrackHeading: true,
			loaded: {
				am: false,
				lfm: false,
				wiki: false,
				txt: false,
				ix: -1
			},
			lookUp: false,
			reader: false,
			readerItem: '',
			readerHeading: '',
			readerTag: false,
			releaseDate: 'Release Date: |Ver\\u00f6ffentlichungsdatum: |Fecha De Lanzamiento: |Date De Sortie: |Data Di Pubblicazione: |\\u30ea\\u30ea\\u30fc\\u30b9\\u65e5: |Data Wydania: |Data De Lan\\u00e7amento: |\\u0414\\u0430\\u0442\\u0430 \\u0440\\u0435\\u043b\\u0438\\u0437\\u0430: |Utgivningsdatum: |Yay\\u0131nlanma Tarihi: |\\u53d1\\u884c\\u65e5\\u671f: ',
			scrollPos: {},
			source: {
				am: pptBio.sourcerev == 0,
				lfm: pptBio.sourcerev == 1,
				wiki: pptBio.sourcerev == 2,
				txt: pptBio.sourcerev == 3
			},
			subHeading: 0,
			summaryEnd: 0,
			text: [],
			txt: '',
			txt_w: {
				hd: 0,
				nohd: 0
			},
			wiki: '',
			wiki_w: {
				hd: 0,
				nohd: 0
			},
			wikiAlb: '',
			wikiFallback: false,
			wikiTrackHeading: true,
			ln: {
				x1: 0,
				x2: 0
			},
			y: Math.round(Math.max(1, uiBio.font.main_h * 0.05))
		};

		this.rev.subhead = {
			am: [cfg.amDisplayName, `${cfg.amDisplayName} ${this.rev.lang[cfg.lang.ix]}`],
			lfm: [cfg.lfmDisplayName, `${cfg.lfmDisplayName} ${this.rev.lang[cfg.lang.ix]}`],
			wiki: [cfg.wikiDisplayName, `${cfg.wikiDisplayName} ${this.rev.lang[cfg.lang.ix]}`],
			txt: ['textreader', 'textreader']
		};

		this.currentTrackTags = $Bio.debounce(() => {
			if (!$Bio.server) return;
			const handle1 = $Bio.handle(panelBio.id.focus);
			if (handle1) tagBio.write(new FbMetadbHandleList([handle1]), true, panelBio.id.focus);
			if (tagBio.force) {
				const handle2 = $Bio.handle(!panelBio.id.focus);
				const handlesSame = handle1 && handle2 && handle1.Compare(handle2);
				if (handle2 && !handlesSame) tagBio.write(new FbMetadbHandleList([handle2]), true, !panelBio.id.focus);
			}
		}, 2000, {
			leading: true,
			trailing: true
		});
		this.loadReader();
	}

	// Methods

	add(items, text) {
		items.forEach(v => text = text && v ? `${text}\r\n\r\n${v}` : text || v);
		return text;
	}

	activateTooltip(value, type) {
		if (tooltipBio.Text == value && [this.rev.ix == this.rev.cur_ix, this.bio.ix == this.bio.cur_ix][type]) return;
		tooltipBio.Text = value;
		tooltipBio.Activate();
	}

	albCalc() {
		if (!this.rev.text.length || pptBio.img_only || this.lyricsDisplayed()) return;
		const font = !(this.reader.rev.txtLyrics || this.rev.loaded.txt && this.reader.rev.nowplaying) || pptBio.sourceAll ? uiBio.font.main : uiBio.font.lyrics;
		let j = 0;
		this.line.h.rev = this.rev.loaded.txt && !pptBio.sourceAll && this.reader.rev.props ? uiBio.font.main_h + 1 * $Bio.scale : !this.reader.rev.txtLyrics || pptBio.sourceAll ? uiBio.font.main_h : uiBio.font.lyrics_h + 4 * $Bio.scale;
		this.rev.arr = [];

		$Bio.gr(1, 1, false, g => {
			for (let k = 0; k < this.rev.text.length; k++) {
				let arr = [];
				let l = [];
				this.rev.summaryEnd = 0;
				let v = this.rev.text[k];
				if (panelBio.style.inclTrackRev && !$Bio.isArray(v)) {
					const ti = v.match(/!\u00a6.+?$/gm);
					if (ti) {
						ti.forEach(w => {
							if (g.CalcTextWidth(w, uiBio.font.subHeadTrack) > panelBio.text.w) {
								const new_ti = `${g.EstimateLineWrap(w, uiBio.font.subHeadTrack, panelBio.text.w - g.CalcTextWidth('... ', uiBio.font.subHeadTrack))[0]}...`;
								v = v.replace(RegExp($Bio.regexEscape(w)), new_ti);
							}
						});
					}
				}
				if (!panelBio.summary.show || !v.includes('\u00a6End\u00a6')) {
					if (!$Bio.isArray(v)) {
						if (v) {
							l = g.EstimateLineWrap(v, font, panelBio.text.w);
							for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						}
					} else if (!this.lyricsArr('rev')) {
						arr = arr.concat(JSON.parse(JSON.stringify(v)));
					}
				} else {
					const revText = v.split('\u00a6End\u00a6');
					const revSummary = revText[0].trim();
					const revMain = revText[1].trim();
					if (revSummary) {
						l = g.EstimateLineWrap(revSummary, uiBio.font.summary, panelBio.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						for (let i = 0; i < arr.length; i++) arr[i].text = arr[i].text.replace(/^\u2219\s|^\|\s+/, '').replace(/\s*\|$/, '');
						this.rev.summaryEnd = arr.length;
						if (revMain) arr.push({ text: '' });
					}
					if (revMain) {
						l = g.EstimateLineWrap(revMain, font, panelBio.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
					}
				}

				const y = this.rev.loaded.txt && this.reader.rev.nowplaying && !pptBio.sourceAll && pptBio.vCenter ? Math.max(panelBio.text.t + (panelBio.text.h - arr.length * this.line.h.rev) / 2, panelBio.text.t) : panelBio.text.t;
				arr.forEach((v, i, ary) => {
					if (v.sectionHeading) j = 0;
					v.align = v.property ? (pptBio.rowStripes ? this.lc : this.lp) : !(this.reader.rev.txtLyrics || this.rev.loaded.txt && this.reader.rev.nowplaying && pptBio.hCenter) || pptBio.sourceAll ? this.l : this.cc;
					v.col = v.property && v.sectionHeading ? uiBio.col.accent : this.rev.subHeading && !i ? uiBio.col.source : i < this.rev.summaryEnd ? uiBio.col.summary : uiBio.col.text;
					v.dropShadowLevel = !(this.reader.rev.txtLyrics || this.rev.loaded.txt && this.reader.rev.nowplaying) || pptBio.sourceAll ? false : pptBio.dropShadowLevel;
					v.dropNegativeShadowLevel = v.dropShadowLevel && v.dropShadowLevel > 1 ? Math.floor(v.dropShadowLevel / 2) : 0;
					v.font = !this.rev.subHeading || i ? (i < this.rev.summaryEnd ? uiBio.font.summary : font) : uiBio.font.subHeadSource;
					v.h1 = this.line.h.rev;
					v.h2 = this.line.h.rev + 1;
					$Bio.source.amLfmWikiTxt.forEach((w, i) => {
						v[`${w}Line`] = (!v.property ? v.text : v.name) == this.rev.subhead[w][1] && !(this.ratingPos.line && panelBio.summary.show);
						if (v[`${w}Line`]) {
							const v_w = g.CalcTextWidth(`${v.text} `, this.ratingPos.line ? uiBio.font.main : uiBio.font.subHeadSource);
							v[`${w}LineX1`] = i < 2 ? panelBio.text.l + v_w + (this.rating[w] >= 0 && (this.ratingPos.subHeading || this.ratingPos.line) ? butBio.rating.w2 : 0) + this.bio.sp : panelBio.text.l + this.rev[`${w}_w`].nohd + this.bio.sp; // noHd
							v[`${w}LineX2`] = Math.max(v[`${w}LineX1`], panelBio.text.l + panelBio.text.w);
						}
					});
					v.offset = 0;
					v.composersTooltip = this.rev.composersTooltip;
					v.composers_tt_needed = v.composersTooltip && i < this.rev.summaryEnd && v.text.startsWith('Composers: ');
					this.formatItemProperties(v, j);
					v.subHeading = this.rev.subHeading && !i ? this.rev.subHeading : 0;
					['am', 'lfm'].forEach(w => {
						v[`${w}SubHeadingRating`] = this.ratingPos.subHeading && v.text == this.rev.subhead[w][pptBio.heading ? 0 : 1] && this.rating[w] >= 0;
						if (v[`${w}SubHeadingRating`]) v[`${w}SubHeadingRatingX`] = panelBio.text.l + (pptBio.heading ? this.rev[`${w}_w`].hd : this.rev[`${w}_w`].nohd);

						v[`${w}LineRating`] = this.ratingPos.line && this.rating[w] >= 0 && v.text == this.rev.subhead[w][pptBio.heading ? 0 : 1];
						if (v[`${w}LineRating`]) {
							const v_w = g.CalcTextWidth(`${v.text} `, uiBio.font.main);
							v[`${w}LineRatingX`] = panelBio.text.l + v_w;
						}
					});
					if (v.text.startsWith('!\u00a6')) {
						v.col = uiBio.col.track;
						v.font = uiBio.font.subHeadTrack;
						v.song = true;
						const songLine = !pptBio.heading ? (panelBio.style.inclTrackRev != 2 ? true : !ary[0].subHeading) : false;
						if (songLine) {
							v.songLine = true;
							const v_w = g.CalcTextWidth(`${v.text} `, uiBio.font.subHeadTrack)
							v.songX1 = panelBio.text.l + v_w;
							v.songX2 = Math.max(v.songX1, panelBio.text.l + panelBio.text.w);
						}
						v.text = v.text.replace('!\u00a6', '');
					}
					if ((this.rev.loaded.wiki || pptBio.sourceAll) && (v.text.startsWith('==') || v.text.endsWith('=='))) {
						v.font = uiBio.font.subHeadWiki;
						v.offset = uiBio.font.main_h * 0.125;
						v.sectionHeading = true;
					}
					if (this.rev.subHeading && !i && pptBio.heading) v.offset = uiBio.font.main_h * 0.2;
					v.y = y;
					j++;
				});

				if (this.rev.arr.length && arr.length) this.rev.arr.push({ text: '' });
				this.rev.arr = this.rev.arr.concat(arr);
				this.rev.ix = -1;
			}
		});

		this.tidyWiki('rev');
		butBio.refresh(true);
		alb_scrollbar.reset();
		this.line.drawn.rev = this.reader.rev.txtLyrics && !pptBio.sourceAll || this.rev.loaded.txt && !pptBio.sourceAll && this.reader.rev.props ? Math.floor(panelBio.lines_drawn * uiBio.font.main_h / this.line.h.rev) : panelBio.lines_drawn;
		alb_scrollbar.metrics(panelBio.sbar.x, panelBio.sbar.y, uiBio.sbar.w, panelBio.sbar.h, this.line.drawn.rev, this.line.h.rev, false);
		alb_scrollbar.setRows(this.rev.arr.length);
		if (this.ratingPos.subHeading || this.ratingPos.line) this.rating.y = Math.round((uiBio.font.main_h - butBio.rating.h1 / 2) / 1.8);
		this.getScrollPos();
	}

	albumFlush() {
		this.mod.amRev = this.rev.am = this.rev.lfm = this.mod.lfmRev = this.rev.wiki = this.mod.wikiRev = this.rev.txt = '';
		this.mod.curAmRev = this.mod.curLfmRev = this.mod.curWikiRev = 1;
		this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = this.done.wikiRev = false;
		this.rev.text = [];
		butBio.setScrollBtnsHide();
	}

	albumReset(upd) {
		if (panelBio.lock) return;
		this.id.curAlbum = this.id.album;
		this.id.album = name.albID(panelBio.id.focus, 'simple');
		const new_album = this.id.album != this.id.curAlbum;
		if (new_album) this.id.alb = '';

		let new_composition = false;
		if (pptBio.classicalMusicMode) {
			this.id.curComp = this.id.composition;
			this.id.composition = $Bio.eval(cfg.tf.artist + cfg.tf.albumArtist + cfg.tf.composition, panelBio.id.focus);
			new_composition = this.id.composition != this.id.curComp;
		}

		if (new_album || new_composition || upd) {
			this.album = name.album(panelBio.id.focus);
			this.albumartist = name.albumArtist(panelBio.id.focus);
			this.composition = name.composition(panelBio.id.focus);
			this.albumFlush();
			this.rev.lookUp = false;
		}
		if (panelBio.style.inclTrackRev) {
			this.id.curTr = this.id.tr;
			this.id.tr = name.trackID(panelBio.id.focus);
			const new_track = this.id.tr != this.id.curTr;
			if (new_track) {
				this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = this.done.wikiRev = false;
				if (panelBio.style.inclTrackRev == 1) this.logScrollPos('rev');
			}
		}
	}

	amBio(a) {
		const aBio = panelBio.getPth('bio', panelBio.id.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foAmBio', true).pth;
		if (!$Bio.file(aBio)) return;
		this.mod.amBio = $Bio.lastModified(aBio) || 0;
		if (this.mod.amBio == this.mod.curAmBio) return;
		this.bio.am = $Bio.open(aBio).trim();
		this.bio.am = this.bio.am.replace(/, Jr\./g, ' Jr.');
		this.bio.am = this.formatText('amBio', this.bio.am, panelBio.summary.genre ? { limit: 6, list: true, key: 'Genre: ' } : {}, !panelBio.summary.other ? {} : { list: true, key: 'Group Members: ', prefix: true, suffix: true }, panelBio.summary.date ? { key: 'Formed: |Born: ' } : {}, panelBio.summary.date ? { key: 'Died: ' } : {}, panelBio.summary.date ? { key: 'Active: ' } : {}).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		this.newText = true;
		this.mod.curAmBio = this.mod.amBio;
	}

	amRev(a, aa, l, c) {
		let am_tr_mod = 0;
		let aRev = '';
		let foundComp = false;
		let trackRev = '';
		let trk = '';
		let writer = '';

		if (!pptBio.classicalMusicMode || panelBio.alb.ix) {
			aRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foAmRev', true).pth;
		} else if (!panelBio.alb.ix) {
			aRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.composition, '', cfg.supCache, a, aa, c, 'foAmRev', true).pth;
			if ($Bio.file(aRev)) foundComp = true;
		}
		this.rev.amFallback = !foundComp;
		if (!$Bio.file(aRev) && pptBio.classicalAlbFallback && !panelBio.alb.ix && panelBio.style.inclTrackRev != 2) {
			aRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foAmRev', true).pth;
		}
		this.avail.amalb = $Bio.file(aRev) ? 0 : -1;
		if (this.avail.amalb == -1) {
			this.rating.am = -1;
			butBio.check();
			if (!panelBio.style.inclTrackRev || pptBio.classicalMusicMode && !pptBio.classicalAlbFallback) {
				this.rev.amAlb = '';
				return;
			}
		}

		trk = this.track.toLowerCase();
		trackRev = $Bio.jsonParse(panelBio.getPth('track', panelBio.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foAmRev', true).pth, false, 'file');
		this.avail.amtrk = this.isTrackRevAvail('am', trackRev[trk]);
		if (panelBio.style.inclTrackRev && trackRev[trk] && trackRev[trk].update) am_tr_mod = trackRev[trk].update;

		this.mod.amRev = ($Bio.lastModified(aRev) || 0) + (am_tr_mod || 0);
		if (this.mod.amRev == this.mod.curAmRev) return;
		this.rev.amAlb = '';

		if (panelBio.style.inclTrackRev != 2 || foundComp) this.rev.amAlb = $Bio.open(aRev).trim();
		this.rev.amAlb = this.rev.amAlb.replace('Genre: ', 'Album Genres: ');
		this.newText = true;
		this.mod.curAmRev = this.mod.amRev;
		this.rating.am = -1;
		const b = this.rev.amAlb.indexOf('>> Album rating: ') + 17;
		const f = this.rev.amAlb.indexOf(' <<');
		if (panelBio.style.inclTrackRev != 2 || foundComp) {
			if (pptBio.amRating) {
				if (b != -1 && f != -1 && f > b) this.rating.am = this.rev.amAlb.substring(b, f);
				if (!isNaN(this.rating.am) && this.rating.am != 0 && this.rating.am != -1) this.rating.am *= 2;
				else this.rating.am = -1;
				this.getRatingStyle('am');
			} else {
				this.rating.amStr = '';
				if (f != -1) this.rev.amAlb = this.rev.amAlb.slice(f + 3);
			}
		}
		this.rev.am = this.rev.amAlb;
		let needTrackSubHeading = false;
		if (!pptBio.classicalMusicMode || !foundComp) {
			if (panelBio.style.inclTrackRev) {
				if (trackRev && trackRev[trk]) {
					const o = trackRev[trk];
					let releaseYear = $Bio.getProp(o, 'date', '');
					if (releaseYear) releaseYear = `Release Year: ${releaseYear}`;
					let composer = $Bio.getProp(o, 'composer', []).join('\u200b, ');
					if (composer) {
						writer = o.composer.length > 1 ? 'Composers: ' : 'Composer: ';
						composer = writer + composer;
					}
					let wiki = $Bio.getProp(o, 'wiki', '');
					wiki = this.add([composer], wiki);
					const showGenres = !pptBio.autoOptimiseText || !this.rev.amAlb;
					if (showGenres) {
						const get = (item) => {
							const it2 = $Bio.titlecase(item);
							const it1 = it2.slice(0, -1);
							const items = $Bio.getProp(o, item, []).join('\u200b, ');
							if (items) return (o[item].length > 1 ? `Track ${it2}: ` : `Track ${it1}: `) + items;
							return items;
						};
						wiki = this.add([get('genres'), get('moods'), get('themes')], wiki);
					}
					const author = $Bio.getProp(o, 'author', '');
					wiki = this.add([releaseYear, author], wiki);
					if (wiki) {
						if (pptBio.trackHeading == 1 && (this.rev.amAlb || !pptBio.heading) || pptBio.trackHeading == 2) {
							this.rev.amTrackHeading = false;
							if (this.rev.amAlb) {
								trackRev =  `!\u00a6${this.tf(pptBio.trackSubHeading, pptBio.artistView, true)}\r\n\r\n${wiki}`;
							} else {
								trackRev = wiki;
								needTrackSubHeading = true;
							}
						} else {
							this.rev.amTrackHeading = true;
							trackRev = wiki;
						}
						this.rev.am = this.add([trackRev], this.rev.amAlb);
					} else {
						this.rev.amTrackHeading = panelBio.style.inclTrackRev == 2;
					}
				} else {
					this.rev.amTrackHeading = panelBio.style.inclTrackRev == 2;
				}
			}
		} else this.rev.amTrackHeading = false;
		this.rev.am = this.formatText('amRev', this.rev.am, panelBio.summary.genre ? { limit: 6, list: true, key: this.rev.amAlb ? 'Album Genres: ' : 'Track Genres: ' } : {}, !panelBio.summary.other ? {} : { limit: 6, list: true, key: this.rev.amAlb ? 'Album Moods: ' : 'Track Moods: ', prefix: true }, panelBio.summary.date ? { key: this.rev.amAlb ? 'Release Date: ' : 'Release Year: ' } : {}, { str: this.rating.amStr }).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (needTrackSubHeading) this.rev.am = `!\u00a6${this.tf(pptBio.trackSubHeading, pptBio.artistView, true)}\r\n\r\n${this.rev.am}`;
		if (!this.rev.am) butBio.check();
	}

	artCalc() {
		if (!this.bio.text.length || pptBio.img_only || this.lyricsDisplayed()) return;
		const font = !(this.reader.bio.txtLyrics || this.bio.loaded.txt && this.reader.bio.nowplaying) || pptBio.sourceAll ? uiBio.font.main : uiBio.font.lyrics;
		let j = 0;
		this.line.h.bio = this.bio.loaded.txt && !pptBio.sourceAll && this.reader.bio.props ? uiBio.font.main_h + 1 * $Bio.scale : !this.reader.bio.txtLyrics || pptBio.sourceAll ? uiBio.font.main_h : uiBio.font.lyrics_h + 4 * $Bio.scale;
		this.bio.arr = [];

		this.bio.text.forEach(v => {
			let l = [];
			this.bio.summaryEnd = 0;
			let arr = [];
			$Bio.gr(1, 1, false, g => {
				if (!panelBio.summary.show || !v.includes('\u00a6End\u00a6')) {
					if (!$Bio.isArray(v)) {
						if (v) {
							l = g.EstimateLineWrap(v, font, panelBio.text.w);
							for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						}
					} else if (!this.lyricsArr('bio')) {
						arr = arr.concat(JSON.parse(JSON.stringify(v)));
					}
				} else {
					const bioText = v.split('\u00a6End\u00a6');
					const bioSummary = bioText[0].trim();
					const bioMain = bioText[1].trim();
					if (bioSummary) {
						l = g.EstimateLineWrap(bioSummary, uiBio.font.summary, panelBio.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						for (let i = 0; i < arr.length; i++) arr[i].text = arr[i].text.replace(/^\u2219\s|^\|\s+/, '').replace(/\s*\|$/, '');
						this.bio.summaryEnd = arr.length;
						if (bioMain) arr.push({ text: '' });
					}
					if (bioMain) {
						l = g.EstimateLineWrap(bioMain, font, panelBio.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
					}
				}
			});

			const y = this.bio.loaded.txt && this.reader.bio.nowplaying && !pptBio.sourceAll && pptBio.vCenter ? Math.max(panelBio.text.t + (panelBio.text.h - arr.length * this.line.h.bio) / 2, panelBio.text.t) : panelBio.text.t;
			arr.forEach((v, i) => {
				if (v.sectionHeading) j = 0;
				v.align = v.property ? (pptBio.rowStripes ? this.lc : this.lp) : !(this.reader.bio.txtLyrics || this.bio.loaded.txt && this.reader.bio.nowplaying && pptBio.hCenter) || pptBio.sourceAll ? this.l : this.cc;
				v.col = v.property && v.sectionHeading ? uiBio.col.accent : this.bio.subHeading && !i ? uiBio.col.source : i < this.bio.summaryEnd ? uiBio.col.summary : uiBio.col.text;
				v.dropShadowLevel = !(this.reader.bio.txtLyrics || this.bio.loaded.txt && this.reader.bio.nowplaying) || pptBio.sourceAll ? false : pptBio.dropShadowLevel;
				v.dropNegativeShadowLevel = v.dropShadowLevel && v.dropShadowLevel > 1 ? Math.floor(v.dropShadowLevel / 2) : 0;
				v.font = !this.bio.subHeading || i ? (i < this.bio.summaryEnd ? uiBio.font.summary : font) : uiBio.font.subHeadSource;
				v.h1 = this.line.h.bio;
				v.h2 = this.line.h.bio + 1;
				$Bio.source.amLfmWikiTxt.forEach(w => {
					v[`${w}Line`] = (!v.property ? v.text : v.name) == this.bio.subhead[w][1];
					if (v[`${w}Line`]) {
						v[`${w}LineX1`] = panelBio.text.l + this.bio[`${w}_w`].nohd + this.bio.sp;
						v[`${w}LineX2`] = Math.max(v[`${w}LineX1`], panelBio.text.l + panelBio.text.w);
					}
				});
				v.offset = 0;
				v.membersTooltip = this.bio.membersTooltip;
				v.members_tt_needed = v.membersTooltip && i < this.bio.summaryEnd && v.text.startsWith('Members: ');
				this.formatItemProperties(v, j);
				if ((this.bio.loaded.wiki || pptBio.sourceAll) && (v.text.startsWith('==') || v.text.endsWith('=='))) {
					v.font = uiBio.font.subHeadWiki;
					v.offset = uiBio.font.main_h * 0.125;
					v.sectionHeading = true;
				}
				if (this.bio.subHeading && !i && pptBio.heading) v.offset = uiBio.font.main_h * 0.2;
				v.y = y;
				j++;
			});
			if (this.bio.arr.length && arr.length) this.bio.arr.push({ text: '' });
			this.bio.arr = this.bio.arr.concat(arr);
		});

		this.tidyWiki('bio');
		butBio.refresh(true);
		art_scrollbar.reset();
		this.line.drawn.bio = this.reader.bio.txtLyrics && !pptBio.sourceAll || this.bio.loaded.txt && !pptBio.sourceAll && this.reader.bio.props ? Math.floor(panelBio.lines_drawn * uiBio.font.main_h / this.line.h.bio) : panelBio.lines_drawn;
		art_scrollbar.metrics(panelBio.sbar.x, panelBio.sbar.y, uiBio.sbar.w, panelBio.sbar.h, this.line.drawn.bio, this.line.h.bio, false);
		art_scrollbar.setRows(this.bio.arr.length);
		this.getScrollPos();
	}

	artistFlush() {
		this.done.amBio = this.done.lfmBio = this.done.wikiBio = false;
		this.mod.amBio = this.bio.am = this.mod.lfmBio = this.bio.lfm = this.mod.wikiBio = this.bio.wiki = this.bio.txt = '';
		this.mod.curAmBio = this.mod.curLfmBio = this.mod.curWikiBio = '1';
		this.bio.text = [];
		butBio.setScrollBtnsHide();
	}

	artistReset(upd) {
		if (panelBio.artistsSame() || panelBio.lock) return;
		this.cur_artist = this.artist;
		this.artist = name.artist(panelBio.id.focus);
		const new_artist = this.artist != this.cur_artist;
		if (new_artist || upd) {
			this.bio.lookUp = false;
			this.artistFlush();
		}
	}

	bioPth(n) {
		if (pptBio.img_only) return ['', '', false, false];
		return panelBio.getPth('bio', panelBio.id.focus, this.artist, '', '', cfg.supCache, $Bio.clean(this.artist), '', '', `fo${n}Bio`, false);
	}

	checkAbb(str) {
		return str.replace(', United Kingdom', '').replace(', United States', '').replace(', U.S.', '').replace(', UK', '').replace('Years Active', 'Active').trim();
	}

	checkGenre(n) {
		const ix = n.lastIndexOf('Genre: ');
		if (ix != -1) {
			let sub = n.substring(ix);
			sub = sub.split('\n')[0].trim();
			sub = sub.replace('Genre: ', '');
			const g = sub.match(/,/g) || [];
			return { singleGenre: !g.length, sub };
		}
		return { singleGenre: false, sub: '' };
	}

	checkLyrics(n, lyr) {
		this.reader[n].txtLyrics = this.reader[n].lyrics && (pptBio.sourceAll || (this.isSynced(lyr) ? !pptBio.scrollSynced : !pptBio.scrollUnsynced));
	}

	checkNewLine(sub, n) {
		if (!sub[n]) return '';
		let cur_str = '';
		let w = 0;
		for (let i = 1; i < n; i++) {
			cur_str = cur_str && sub[i] ? `${cur_str}  |  ${sub[i]}` : cur_str || sub[i];
		}
		$Bio.gr(1, 1, false, g => w = g.CalcTextWidth(cur_str, uiBio.font.summary));
		return sub[n] = cur_str && w < panelBio.text.w ? `\r\n${sub[n]}` : sub[n];
	}

	checkStr(sub, n) {
		if (!sub[n]) return '';
		let cur_str = '';
		for (let i = 1; i < n + 1; i++) {
			cur_str = cur_str && sub[i] ? `${cur_str}  |  ${sub[i]}` : cur_str || sub[i];
		}
		cur_str = cur_str.split('\r\n');
		cur_str = cur_str[1] || cur_str[0];
		$Bio.gr(1, 1, false, g => {
			let w = g.CalcTextWidth(cur_str, uiBio.font.summary);
			if (w < panelBio.text.w) return sub[n];

			cur_str = '';
			for (let i = 1; i < n; i++) {
				cur_str = cur_str && sub[i] ? `${cur_str}  |  ${sub[i]}` : cur_str || sub[i];
			}

			w = g.CalcTextWidth(cur_str, uiBio.font.summary);
			const precedingSingleLineStr = w < panelBio.text.w;
			return precedingSingleLineStr ? (w > panelBio.text.w ? sub[n] : `\r\n${sub[n]}`) : sub[n];
		});
	}

	check_tooltip(item, x, y, artistView, line_h) {
		if (!item) return;
		const onLine = item.tt && y >= item.tt.y && y <= item.tt.y + line_h;
		const traceName = onLine && item.tt.needed1 && x >= item.tt.x1 && x <= item.tt.x1 + item.tt.w1;
		const traceValue = onLine && item.tt.needed2 && x >= item.tt.x2 && x <= item.tt.x2 + item.tt.w2;
		const text = traceName ? item.name || item.membersTooltip || item.composersTooltip : traceValue ? item.value : '';
		if (text != tooltipBio.Text) this.deactivateTooltip();
		if (!traceName && !traceValue || !item.tt.needed1 && !item.tt.needed2) {
			this.deactivateTooltip();
			return;
		}
		this.activateTooltip(text, artistView ? 1 : 0);
		timerBio.tooltip();
	}

	checkTooltip(item, x1, needed1, w1, x2, needed2, w2, y) {
		item.tt = {
			needed1,
			x1,
			w1,
			needed2,
			x2,
			w2,
			y
		}
	}

	deactivateTooltip() {
		if (!tooltipBio.Text || butBio.traceBtn) return;
		tooltipBio.Text = '';
		tooltipBio.Deactivate();
	}

	different(a, b) {
		return JSON.stringify(a) != JSON.stringify(b);
	}

	draw(gr) {
		if (!pptBio.img_only) {
			this.getTxtFallback();
			if (pptBio.typeOverlay && pptBio.style > 3 && !pptBio.img_only && !pptBio.text_only) {
				gr.SetSmoothingMode(2);
				let o = 0;
				switch (pptBio.typeOverlay) {
					case 1:
						gr.FillSolidRect(panelBio.tbox.l - 1, panelBio.tbox.t - 1, panelBio.tbox.w + 1, panelBio.tbox.h + 1, uiBio.col.rectOv);
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
			if (pptBio.artistView && this.bio.text.length && !this.lyricsDisplayed()) {
				const b = Math.max(Math.round(art_scrollbar.delta / this.line.h.bio + 0.4), 0);
				const f = Math.min(b + this.line.drawn.bio, this.bio.arr.length);
				this.bio.drawn = 0;
				for (let i = b; i < f; i++) {
					const item = this.bio.arr[i];
					const item_y = item.h1 * i + item.y - art_scrollbar.delta + scaleForDisplay(2);
					if (item_y < panelBio.style.max_y) {
						this.bio.drawn++;
						const iy = Math.round(item_y + uiBio.font.main_h / 2);
						if (!pptBio.heading) {
							$Bio.source.amLfmWikiTxt.forEach(v => {
								if (item[`${v}Line`]) gr.DrawLine(item[`${v}LineX1`], iy, item[`${v}LineX2`], iy, uiBio.style.l_w, uiBio.col.centerLine);
							});
						}
						if (!item.sectionHeading || (!item.property ? i < f - 2 : i < f - 1)) {
							if (!item.property) {
								if (item.dropNegativeShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, uiBio.col.dropShadow, panelBio.text.l - item.dropNegativeShadowLevel, item_y + item.offset, panelBio.text.w, item.h2, item.align);
									gr.GdiDrawText(item.text, item.font, uiBio.col.dropShadow, panelBio.text.l, item_y - item.dropNegativeShadowLevel + item.offset, panelBio.text.w, item.h2, item.align);
								}
								if (item.dropShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, uiBio.col.dropShadow, panelBio.text.l + item.dropShadowLevel, item_y + item.dropShadowLevel + item.offset, panelBio.text.w, item.h2, item.align);
								}
								gr.GdiDrawText(item.text, item.font, item.col, panelBio.text.l, item_y + item.offset, panelBio.text.w, item.h2, item.align);
								if (item.members_tt_needed) this.checkTooltip(item, panelBio.text.l, true, panelBio.text.w, 0, 0, 0, item_y + item.offset);
							}
							else {
								if (item.rowStripe) gr.FillSolidRect(panelBio.text.l, item_y + item.stripeOffset, panelBio.text.w, item.h3, item.rowStripe);
								if (item.sectionLine) gr.DrawLine(item.sectionLineX1, iy, item.sectionLineX2, iy, uiBio.style.l_w, uiBio.col.sectionLine);
								gr.GdiDrawText(item.name, item.font, item.col, panelBio.text.l, item_y + item.offset, this.reader.w.nameCol, item.h2, item.align);
								gr.GdiDrawText(item.value, item.font, item.col, panelBio.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item_y + item.offset, this.reader.w.valueCol, item.h2, item.align);
								if (item.name_tt_needed || item.value_tt_needed) this.checkTooltip(item, panelBio.text.l, item.name_tt_needed, this.reader.w.nameCol, panelBio.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item.value_tt_needed, this.reader.w.valueCol, item_y + item.offset);
							}
						}
					}
				}
				if (pptBio.sbarShow) art_scrollbar.draw(gr);
			}
			if (!pptBio.artistView && this.rev.text.length && !this.lyricsDisplayed()) {
				const b = Math.max(Math.round(alb_scrollbar.delta / this.line.h.rev + 0.4), 0);
				const f = Math.min(b + this.line.drawn.rev, this.rev.arr.length);
				this.rev.drawn = 0;
				for (let i = b; i < f; i++) {
					const item = this.rev.arr[i];
					const item_y = item.h1 * i + item.y - alb_scrollbar.delta + scaleForDisplay(2);
					if (item_y < panelBio.style.max_y) {
						this.rev.drawn++;
						const iy = Math.round(item_y + uiBio.font.main_h / 2);
						switch (true) {
							case this.ratingPos.subHeading:
							['am', 'lfm'].forEach(v => {
								if (item[`${v}SubHeadingRating`]) gr.DrawImage(butBio.rating.images[this.rating[v]], item[`${v}SubHeadingRatingX`], item_y + this.rating.y + item.offset, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
							});
							break;
						case this.ratingPos.line:
							['am', 'lfm'].forEach(v => {
								if (item[`${v}LineRating`]) gr.DrawImage(butBio.rating.images[this.rating[v]], item[`${v}LineRatingX`], item_y + this.rating.y + item.offset, butBio.rating.w1 / 2, butBio.rating.h1 / 2, 0, 0, butBio.rating.w1, butBio.rating.h1, 0, 255);
							});
							break;
						}
						if (!pptBio.heading) {
							$Bio.source.amLfmWikiTxt.forEach(v => {
								if (item[`${v}Line`]) gr.DrawLine(item[`${v}LineX1`], iy, item[`${v}LineX2`], iy, uiBio.style.l_w, uiBio.col.centerLine);
							});
						}
						if (item.songLine) gr.DrawLine(item.songX1, iy, item.songX2, iy, uiBio.style.l_w, uiBio.col.centerLine);
						if (!item.sectionHeading || (!item.property ? i < f - 2 : i < f - 1)) {
							if (!item.property) {
								if (item.dropNegativeShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, uiBio.col.dropShadow, panelBio.text.l - item.dropNegativeShadowLevel, item_y + item.offset, panelBio.text.w, item.h2, item.align);
									gr.GdiDrawText(item.text, item.font, uiBio.col.dropShadow, panelBio.text.l, item_y - item.dropNegativeShadowLevel + item.offset, panelBio.text.w, item.h2, item.align);
								}
								if (item.dropShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, uiBio.col.dropShadow, panelBio.text.l + item.dropShadowLevel, item_y + item.dropShadowLevel + item.offset, panelBio.text.w, item.h2, item.align);
								}
								gr.GdiDrawText(item.text, item.font, item.col, panelBio.text.l, item_y + item.offset, panelBio.text.w, item.h2, item.align);
								if (item.composers_tt_needed) this.checkTooltip(item, panelBio.text.l, true, panelBio.text.w, 0, 0, 0, item_y + item.offset);
							}
							else {
								if (item.rowStripe) gr.FillSolidRect(panelBio.text.l, item_y + item.stripeOffset, panelBio.text.w, item.h3, item.rowStripe);
								if (item.sectionLine) gr.DrawLine(item.sectionLineX1, iy, item.sectionLineX2, iy, uiBio.style.l_w, uiBio.col.sectionLine);
								gr.GdiDrawText(item.name, item.font, item.col, panelBio.text.l, item_y + item.offset, this.reader.w.nameCol, item.h2, item.align);
								gr.GdiDrawText(item.value, item.font, item.col, panelBio.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item_y + item.offset, this.reader.w.valueCol, item.h2, item.align);
								if (item.name_tt_needed || item.value_tt_needed) this.checkTooltip(item, panelBio.text.l, item.name_tt_needed, this.reader.w.nameCol, panelBio.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item.value_tt_needed, this.reader.w.valueCol, item_y + item.offset);
							}
						}
					}
				}
				if (pptBio.sbarShow) alb_scrollbar.draw(gr);
			}
		}
	}

	expandLists(type, n) {
		const en = cfg.language == 'EN' || cfg.languageFallback;
		let items = [];
		switch (type) {
			case 'amBio':
				items = ['Genre: ', 'Group Members: '];
				break;
			case 'lfmBio': {
				const members = 'Members: |Mitglieder: |Miembros: |Membres: |Componenti: |\\u30e1\\u30f3\\u30d0\\u30fc: |Cz\\u0142onkowie: |Membros: |\\u0423\\u0447\\u0430\\u0441\\u0442\\u043d\\u0438\\u043a\\u0438: |Medlemmar: |\\u00dcyeler: |\\u6210\\u5458: ';
				const topTags = 'Top Tags: ';
				const topTracks = 'Top Tracks: |Top-Titel: |Temas m\\u00e1s escuchados: |Top titres: |Brani pi\\u00f9 ascoltati: |\\u4eba\\u6c17\\u30c8\\u30e9\\u30c3\\u30af: |Najpopularniejsze utwory: |Faixas principais: |\\u041b\\u0443\\u0447\\u0448\\u0438\\u0435 \\u043a\\u043e\\u043c\\u043f\\u043e\\u0437\\u0438\\u0446\\u0438\\u0438: |Toppl\\u00e5tar: |Pop\\u00fcler Par\\u00e7alar: |\\u6700\\u4f73\\u5355\\u66f2: ';
				items = [members, panelBio.similarArtistsKey, panelBio.topAlbumsKey, topTracks];
				if (!panelBio.summary.genre) items.unshift(topTags);
				break;
			}
			case 'amRev':
				items = ['Album Genres: ', 'Album Moods: ', 'Album Themes: ', 'Composers: ', 'Track Moods: ', 'Track Themes: '];
				if (this.rev.amAlb || !panelBio.summary.genre) items.unshift('Track Genres: ');
				break;
			case 'lfmRev':
				items = ['Top Tags: '];
				if (this.rev.lfmAlb || !panelBio.summary.genre) items.unshift('Track Tags: ');
				break;
			case 'wikiBio':
				items = ['Genre: '];
				break;
			case 'wikiRev':
				items = ['Album Genres: ', 'Composers: '];
				if (this.rev.wikiAlb || !panelBio.summary.genre) items.unshift('Track Genres: ');
				break;
		}

		$Bio.gr(1, 1, false, g => {
			items.forEach(v => {
				const w = tagBio.getTag(n, v);
				const li = w.tag;
				if (li) {
					let list = `${w.label}\r\n`;
					li.forEach((v, i, arr) => {
						let nm = (en ? `${i + 1}. ` : '\u2022 ') + v;
							if (g.CalcTextWidth(nm, uiBio.font.main) > panelBio.text.w) {
								nm = `${g.EstimateLineWrap(nm, uiBio.font.main, panelBio.text.w - g.CalcTextWidth('... ', uiBio.font.main))[0]}...`;
							}
						list += nm;
						if (i < arr.length - 1) list += '\r\n';
					});
					let toBeReplaced = n.substring(w.ix);
					toBeReplaced = toBeReplaced.split('\n')[0];
					n = n.replace(RegExp($Bio.regexEscape(toBeReplaced)), list);
				}
			});
		});
		return n;
	}

	findFile(v, n) {
		const type = /_\.(lrc|txt)$/.test(v.pth) ? 0 : /\.(lrc|txt)$/.test(v.pth) ? 1 : 2;
		let pth = '';
		switch (type) {
			case 0: pth = v.pth.replace(/_\.(lrc|txt)$/, '.$1'); break;
			case 1: pth = v.pth.replace(/\.(lrc|txt)$/, '_.$1'); break;
		}
		const pths = !v.lyrics ? [v.pth] : [v.pth, pth];
		const a = n == 'bio' ? $Bio.clean(this.artist) : $Bio.clean(this.albumartist);
		const l = $Bio.clean(this.album);
		const stndItem = panelBio.isRadio(panelBio.id.focus) ? false : v.lyrics || panelBio.stndItem()
		return pths.some(w => {
			const wildCard = /[*?]/.test(w);
			if (!wildCard) {
				const wr = n == 'bio' ? w.replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, '%BIO_ARTIST%') : w.replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, '%BIO_ALBUMARTIST%');
				this[n].readerItem = stndItem ? panelBio.cleanPth(cfg.substituteTf(w), !v.lyrics ? panelBio.id.focus : false, !v.lyrics ? '' : 'lyr').slice(0, -1) : panelBio.cleanPth(wr, !v.lyrics ? panelBio.id.focus : false, 'remap', a, l, pptBio.artistView).slice(0, -1);
			} else {
				const wr = n == 'bio' ? w.replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, '%BIO_ARTIST%') : w.replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, '%BIO_ALBUMARTIST%');
				let p = stndItem ? panelBio.cleanPth(cfg.substituteTf(w).replace(/\*/g, '@!@').replace(/\?/g, '!@!'), !v.lyrics ? pptBio.focus : false, !v.lyrics ? '' : 'lyr').slice(0, -1) : panelBio.cleanPth(wr.replace(/\*/g, '@!@').replace(/\?/g, '!@!'), !v.lyrics ? panelBio.id.focus : false, 'remap', a, l, pptBio.artistView).slice(0, -1);
				p = p.replace(/@!@/g, '*').replace(/!@!/g, '?');
				const arr = utils.Glob(p);
				if (!arr.length) return false;
				this[n].readerItem = arr[0];
			}
			return $Bio.file(this[n].readerItem);
		});
	}

	formatItemProperties(v, j, g) {
		if (!v.property) return
		if (pptBio.rowStripes && !v.subHeading && !v.sectionHeading && v.name) {
			v.rowStripe = j % 2 == 0 ? uiBio.col.rowStripes /*uiBio.col.bg3*/ : uiBio.col.bg2;
			const line_h = pptBio.artistView ? this.line.h.bio : this.line.h.rev;
			v.h3 = j % 2 == 0 ? line_h - 2 : line_h;
			v.stripeOffset = j % 2 == 0 ? 1 : 0;
		}
		if (pptBio.lineDividers && v.sectionHeading) {
			v.sectionLine = true;
			if (!g) {
				$Bio.gr(1, 1, false, g => {
					v.sectionLineX1 = panelBio.text.l + g.CalcTextWidth(`${v.name}  `, uiBio.font.main);
				});
			} else v.sectionLineX1 = panelBio.text.l + g.CalcTextWidth(`${v.name}  `, uiBio.font.main);
			v.sectionLineX2 = Math.max(v.sectionLineX1, panelBio.text.l + panelBio.text.w);
		}
	}

	formatList(type, text, s, sub, n, limit, lines, prefix, suffix) {
		if (sub[n]) {
			sub[n] = sub[n].replace(RegExp(s[n].key), '').replace(/, /g, ' \u2219 ');
			if (sub[n]) {
				let composersFound = false;
				let membersFound = false;
				if (prefix) {
					$Bio.gr(1, 1, false, g => {
						sub[n] = s[n].key.replace(/(Album\s|Track\s)Moods: /g, 'Moods: ').replace(/Group Members: /g, 'Members: ') + sub[n];
						if (pptBio.summaryCompact) {
							if (type == 'amBio') {
								let tt_needed = false;
								let members = '';
								if (/^Members:\s/.test(sub[n])) {
									membersFound = true;
									tt_needed = g.CalcTextWidth(sub[n], uiBio.font.summary, true) > panelBio.text.w;
									if (tt_needed) {
										members = g.EstimateLineWrap(sub[n], uiBio.font.summary, panelBio.text.w - g.CalcTextWidth('... ', uiBio.font.summary))[0];
										members = `${members.replace(/\u2219\s?$/, '')}...`;
									}
								}
								this.bio.membersTooltip = tt_needed ? sub[n] : '';
								if (tt_needed) sub[n] = members;
							}
							if (type == 'wikiRev') {
								let tt_needed = false;
								let composers = '';
								if (panelBio.style.inclTrackRev && /^Composers:\s/.test(sub[n])) {
									composersFound = true;
									tt_needed = g.CalcTextWidth(sub[n], uiBio.font.summary, true) > panelBio.text.w;
									if (tt_needed) {
										composers = g.EstimateLineWrap(sub[n], uiBio.font.summary, panelBio.text.w - g.CalcTextWidth('... ', uiBio.font.summary))[0];
										composers = `${composers.replace(/\u2219\s?$/, '')}...`;
									}
								}
								this.rev.composersTooltip = tt_needed ? sub[n] : '';
								if (tt_needed) sub[n] = composers;
							}
						} else {
							this.bio.membersTooltip = '';
							this.rev.composersTooltip = '';
						}
					});
				}
				if (pptBio.summaryCompact) {
					if (!composersFound && !membersFound) {
						const line1 = this.getLine(sub[n], limit, suffix);
						let line2 = '';
						if (lines == 2) {
							line2 = sub[n].replace(line1, '');
							line2 = this.getLine(line2, limit, suffix);
						}
						sub[n] = line1 + (line2 ? `\r\n${line2}` : '');
					}
				}
				if (sub[n]) sub[n] += '\r\n';
			} else if (type == 'amBio') {
				this.bio.membersTooltip = '';
			} else if (type == 'wikiRev') {
				this.rev.composersTooltip = '';
			}
		}
		return { text, sub: sub[n] };
	}

	formatListeners(sub, i) {
		return sub[i].replace(/^Last(\.|-)fm:.*?;/g, '').split('|')[0].trim().replace(/\s/g, ': ');
	}

	formatText(type, text, s0 = {}, s1 = {}, s2 = {}, s3 = {}, s4 = {}, s5 = {}, s6 = {}, singleGenre) {
		if (!text) return text;
		const s = [s0, s1, s2, s3, s4, s5, s6];
		const sub = ['', '', '', '', '', '', '', ''];
		let str = '';
		if (panelBio.summary.show) {
			let m = '';
			for (let i = 0; i < s.length; i++) {
				if (!s[i].key && !s[i].str) continue;
					if (s[i].key) {
						m = tagBio.getTag(text, s[i].key, true);
						if (m.tag) {
							sub[i] = m.label + m.tag;
							text = text.replace(RegExp($Bio.regexEscape(sub[i])), '');
						}
					} else if (s[i].str) {
						sub[i] = s[i].str;
					}
					if (!s[i].list) sub[i] = this.checkAbb(sub[i]);
					else {
						const item = this.formatList(type, text, s, sub, i, s[i].limit, s[i].lines, s[i].prefix, s[i].suffix);
						sub[i] = item.sub;
						text = item.text;
					}
			}
			if (type == 'amBio') {
				if (panelBio.summary.genre && panelBio.summary.date && panelBio.summary.popNow && panelBio.summary.other && !sub[1]) sub[4] = this.checkNewLine(sub, 4);
			}

			if (type == 'lfmBio' && sub[5]) {
				sub[5] = this.formatListeners(sub, 5);
			}

			if (type == 'lfmRev' && sub[3]) {
				sub[3] = this.formatListeners(sub, 3);
				sub[3] = this.checkNewLine(sub, 3);
			}

			if (type == 'wikiRev' && sub[3]) {
				sub[3] = sub[3].replace(/^Duration:\s/g, 'Length: ');
				if (this.rev.wikiAlb) sub[3] = this.checkNewLine(sub, 3);
			}

			if (sub[6]) { // 6 has extra handling: reserved for popular now or latest release
				sub[6] = sub[6].split(';')[0].trim();
				const sub6 = $Bio.regexEscape(sub[6]);
				text = text.replace(RegExp(`${sub6}; |${sub6}`), '');
			}

			sub[6] = panelBio.summary.other || panelBio.summary.date && (panelBio.summary.locale && this.type == 'lfmBio' || panelBio.summary.locale && this.type == 'wikiBio') ? this.checkNewLine(sub, 6) : this.checkStr(sub, 6);

			str = sub[1];
			for (let i = 2; i < 7; i++) {
				str = str && sub[i] ? str + (!sub[i].startsWith('\r\n') ? '  |  ' : '') + sub[i] : str || sub[i];
			}
		}
		if (pptBio.expandLists) text = this.expandLists(type, text);
		text = text.replace(/\u200b/g, '');

		switch (type) {
			case 'amBio': text = text.replace('Genre: ', 'Genres: '); break;
			case 'amRev':  text = text.replace(/(Album|Track)\s(Genre|Mood|Theme)(s|):\s/g, '$2$3: '); break;
			case 'lfmBio': if (cfg.lang.ix > 3) text = text.replace('Top Tags: ', `${this.topTags[cfg.lang.ix]}: `); break;
			case 'lfmRev':
				if (cfg.lang.ix > 3) text = text.replace('Top Tags: ', `${this.topTags[cfg.lang.ix]}: `);
				text = text.replace('Track Tags: ', !cfg.lang.ix ? 'Top Tags: ' : `${this.topTags[cfg.lang.ix]}: `).replace(/Last-fm:/g, 'Last.fm:');
				break;
			case 'wikiBio': if (!singleGenre) text = text.replace('Genre: ', 'Genres: '); break;
			case 'wikiRev': text = text.replace(/Album\sGenres:\s/, singleGenre ? 'Genre: ' : 'Genres: ').replace(/Track\sGenre/, 'Genre').replace(/Track\sGenre/, 'Genre').replace(/Duration:\s/g, 'Length: '); break;
		}

		if (panelBio.summary.show) {
			if (str) {
				str = str.trim();
			}
			const summary = sub[0] + (str) + (sub[0] || str ? '\r\n' : '');
			text = `${summary}\u00a6End\u00a6${text.trim()}`;
		}
		return text;
	}

	formatValue(n) {
		n = n.split('\n')[0];
		return n.length < 1001 ? n : `${n.slice(0, 1000)}...` // limit length to stop tooltip issues
	}

	get_ix(x, y) {
		this.rev.ix = -1;
		this.bio.ix = -1;
		switch (true) {
			case !pptBio.artistView:
				if (y > alb_scrollbar.y && y < alb_scrollbar.y + this.rev.drawn * this.line.h.rev && x >= panelBio.text.l && x < panelBio.text.l + this.reader.w.nameCol + panelBio.text.w - this.reader.w.nameCol) this.rev.ix = Math.round((y + alb_scrollbar.delta - panelBio.text.t - this.line.h.rev  * 0.5) / this.line.h.rev)
				break;
			case pptBio.artistView:
				if (y > art_scrollbar.y && y < art_scrollbar.y + this.bio.drawn * this.line.h.bio && x >= panelBio.text.l && x < panelBio.text.l + this.reader.w.nameCol + panelBio.text.w - this.reader.w.nameCol) this.bio.ix = Math.round((y + art_scrollbar.delta - panelBio.text.t - this.line.h.bio  * 0.5) / this.line.h.bio);
				break;
		}
	}

	getBornStr(source) {
		const bi = tagBio.getTag(source, this.bio.bornIn, true);
		const bin = bi.tag;
		if (!panelBio.summary.date) {
			if (panelBio.summary.locale) {
				let str = '';
				if (bin) {
					const count = bin.split(',').length - 1;
					const bornIn = count > 2 ? bin.replace(/,[^,]+,/, ',') : bin;
					str = bi.label + bornIn;
					source = source.replace(RegExp($Bio.regexEscape(str)), '');
				}
				return { bornStr: str, source };
			}
			return { bornStr: '', source };
		}
		const b = tagBio.getTag(source, this.bio.born, true);
		const bn = b.tag;
		const count = bin.split(',').length - 1;
		const bornIn = count > 2 ? bin.replace(/,[^,]+,/, ',') : bin;
		let bornStr = '';
		let born = '';
		if (bn && bornIn) {
			let age = bn.match(/\s\(.*?\)/);
			age = age ? age[0] : '';
			born = bn.replace(age, '');
			bornStr = b.label + born + (panelBio.summary.locale  ? ` \u2219 ${bornIn}` : '') + (age ? (panelBio.summary.locale  ? ` \u2219${$Bio.titlecase(age.replace(/[()]/g, ''))}` : $Bio.titlecase(age)) : '');
			source = source.replace(RegExp($Bio.regexEscape(b.label + bn)), '');
			source = source.replace(RegExp($Bio.regexEscape(bi.label + bin)), '');
		}
		return { bornStr, source };
	}

	getFlag(artist, n) {
		if (pptBio[`${n}FlagShow`]) {
			const codes = $Bio.jsonParse(this.countryCodes, {}, 'file');
			const code = (codes[artist.toLowerCase()] || '').slice(0, 2);
			const path = `${basePath}scripts\\biography\\assets\\images\\flags/${code}.png`;
			if ($Bio.file(path)) {
				if (code && this[n].flagCode != code) {
					this[n].flag = my_utilsBio.getFlagAsset(`${code}.png`);
					this[n].flagCode = code;
				}
				return;
			}
		}
		this[n].flag = null;
		this[n].flagCode = '';
	}

	getFoundedIn(source) {
		if (!panelBio.summary.locale) return { foundedIn: '', source };
		const f = tagBio.getTag(source, this.bio.foundedIn, true);
		const loc = f.tag;
		const count = loc.split(',').length - 1;
		let foundedIn = count > 2 ? loc.replace(/,[^,]+,/, ',') : loc;
		if (foundedIn) foundedIn = f.label + foundedIn;
		if (f.tag) source = source.replace(RegExp($Bio.regexEscape(f.label + f.tag)), '');
		return { foundedIn, source };
	}

	getItem(p_calc, art_ix, alb_ix, force) {
		if (pptBio.img_only) return;
		switch (true) {
			case pptBio.artistView: {
				this.cur_artist = this.artist;
				const stndBio = !art_ix || art_ix + 1 > panelBio.art.list.length;
				this.artist = stndBio ? name.artist(panelBio.id.focus) : panelBio.art.list[art_ix].name;
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
				const stndAlb = !alb_ix || alb_ix + 1 > panelBio.alb.list.length;
				this.artist = stndAlb ? name.albumArtist(panelBio.id.focus) : panelBio.alb.list[alb_ix].artist;
				const alb = stndAlb ? name.album(panelBio.id.focus) : panelBio.alb.list[alb_ix].album;
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

	getItemProperties(item, n) {
		let data = {}
		try {
			data = JSON.parse(item);
		} catch (e) {
			$Bio.trace('item_properties: invalid JSON');
			return;
		}
		const fields = n => n.replace(/\$Bio.*?\(/gi, '').replace(/(,(|\s+)\d+)/gi, '').replace(/[,()[\]%]/gi, '|').split('|');
		const keys = Object.keys(data);
		const showEmpty = data.showEmpty;
		item = [];
		let names = [];
		const handle = $Bio.handle(panelBio.id.focus);
		let arr = [];
		keys.forEach(v => {
			const properties = data[v].properties;
			arr = [];
			if (v != 'showEmpty' && v != '*****HELP*****' && v != 'uppercase' && data[v].show) {
				switch (true) {
				case !/Metadata\*|General\*|Other\*/i.test(v):
					properties.forEach(w => {
						if (!w.name || !w.titleformat) return;
						w.titleformat = w.titleformat.replace(/%BIO_ALBUMARTIST%/gi, cfg.tfAlbumArtist).replace(/%BIO_ARTIST%/gi, cfg.tfArtist).replace(/%BIO_ALBUM%/gi, cfg.tfAlbum).replace(/%BIO_TITLE%/gi, cfg.tfTitle)
						let value = this.formatValue(showEmpty ? $Bio.eval(`$trim(${w.titleformat})`, panelBio.id.focus) : $Bio.eval(`[$trim(${w.titleformat})]`, panelBio.id.focus));
						names = names.concat(fields(w.titleformat.toUpperCase()).filter(v => v.trim()));
						if (typeof w.titleformat == 'string' && w.titleformat.toLowerCase().includes('%album rating allmusic%')) value /= 2;
						if (value && /like count|dislike count|view count/i.test(w.name)) {
							value = parseInt(value);
							value = !isNaN(value) ? value.toLocaleString() : '';
						}
						if (showEmpty || value) arr.push({ text: '', name: w.name, value, property: true });
					});
					item = this.setSectionHeading(item, v, arr);
					break;
				case /Metadata\*/i.test(v):
					arr = [];
					if (handle) {
						const f = handle.GetFileInfo();
						for (let i = 0; i < f.MetaCount; i++) {
							let name = f.MetaName(i);
							names.push(name.toUpperCase())
							const values = [];
							for (let j = 0; j < f.MetaValueCount(i); j++) {
								values.push(this.formatValue(f.MetaValue(i, j).replace(/\s{2,}/g, ' ')));
							}
							const value = values.join(', ');
							name = this.upperCaseFirst(name);
							if (showEmpty || value) arr.push({ text: '', name, value, property: true });
						}
						item = this.setSectionHeading(item, v.replace('*', ' '), arr);
					}
					break;
				case /General\*/i.test(v):
					arr = [];
					if (handle) {
						const f = handle.GetFileInfo();
						const length = $Bio.eval('[%length%]', panelBio.id.focus);
						const samples = parseInt($Bio.eval('%length_samples%', panelBio.id.focus));
						if (length != 0 && length != -1) {
							arr.push({ text: '', name: 'Duration', value: length + (!isNaN(samples) ? ` (${samples.toLocaleString()} samples)` : ''), property: true });
						}
						for (let i = 0; i < f.InfoCount; i++) {
							names.push(f.InfoName(i).toUpperCase())

							let name = f.InfoName(i).replace(/\s{2,}/g, ' ');
							name = this.upperCaseFirst(name);

							const value = this.formatValue(f.InfoValue(i));
							if (!/foo_youtube/i.test(name)) {
								arr.push({ text: '', name, value, property: true });
							}
						}
						item = this.setSectionHeading(item, v.replace('*', ''), arr);
					}
					break;
				case /Other\*/i.test(v):
					if (handle) {
						const f = handle.GetFileInfo();
						arr = [];
						for (let i = 0; i < f.MetaCount; i++) {
							let name = f.MetaName(i);
							if (!names.includes(name.toUpperCase())) {
								name = this.upperCaseFirst(name);
								const value = this.formatValue($Bio.eval(`[%${name}%]`, panelBio.id.focus));
								if (showEmpty || value) arr.push({ text: '', name, value, property: true });
							}
						}
						item = this.setSectionHeading(item, v.replace('*', ''), arr);
					}
				break;
				}
			}
		});
		item.shift();
		if (pptBio.sourceAll && pptBio.sourceHeading || pptBio.sourceHeading == 2) {
			item.unshift({ text: '', name: this[n].subhead.txt[pptBio.heading ? 0 : 1], value: '', property: true }, { text: '', name: '', value: '', property: true });
		}
		this.reader.w.nameCol = 10;
		this.reader.w.valueCol = 10;
		this.reader.w.spaceCol = 0;
		$Bio.gr(1, 1, false, g => {
			this.reader.w.spaceCol = g.CalcTextWidth(' ', uiBio.font.main) * 5;
			if (pptBio.sourceAll && pptBio.sourceHeading || pptBio.sourceHeading == 2) this.reader.w.nameCol = g.CalcTextWidth(this[n].subhead.txt[0], uiBio.font.subHeadSource) + this.reader.w.spaceCol;
			item.forEach(v => {
				v.name = v.name.replace(/\basin\b|\bbpm\b|\bid\b|\bisrc\b|\bcue_|\bmcn\b|\bmd5\b|\bmp3_|\burl\b/i, (m) => m.toUpperCase());
				v.name = v.name.replace(RegExp(`\\b(${data.uppercase})\\b`, 'i'), (m) => m.toUpperCase());
				v.name_w = g.CalcTextWidth(v.name, uiBio.font.main, true);
				this.reader.w.nameCol = !pptBio.fieldWidth ? Math.max(v.name_w, this.reader.w.nameCol) : panelBio.text.w * pptBio.fieldWidth / 100;
			});
			this.reader.w.nameCol = !pptBio.fieldWidth ? $Bio.clamp(this.reader.w.nameCol, Math.max(10, panelBio.text.w / 6), panelBio.text.w / 2) : $Bio.clamp(this.reader.w.nameCol, Math.max(10, panelBio.text.w / 10), panelBio.text.w * 0.9);
			this.reader.w.valueCol = panelBio.text.w - this.reader.w.nameCol - this.reader.w.spaceCol;
			item.forEach(v => {
				v.name_tt_needed = v.name_w > this.reader.w.nameCol;
				v.value_tt_needed = g.CalcTextWidth(v.value, uiBio.font.main, true) > this.reader.w.valueCol;
			});
		});
		return item;
	}

	getLine(sub, limit, suffix) {
		if (limit) {
			const p = this.getPosition(sub, '\u2219', limit);
			if (p != -1) sub = sub.slice(0, p).trim();
		}
		let end = '';
		let w = 0;
		$Bio.gr(1, 1, false, g => {
			w = g.CalcTextWidth(sub, uiBio.font.summary);
			while (w > panelBio.text.w && sub.includes('\u2219')) {
				const f = sub.lastIndexOf('\u2219'); // limit genres to 1 line
				if (f != -1) sub = sub.slice(0, f).trim();
				w = g.CalcTextWidth(suffix ? `${sub} ...` : sub, uiBio.font.summary);
				end = ' ...';
			}
		});
		return sub + (suffix ? end : '');
	}

	getNowplaying(item, n) {
		item = item.replace(/\r\n|\r|\n/g, '');
		this.reader[n].perSec = /%playback_time|%bitrate%|\$progress/i.test(item);
		item = fb.IsPlaying ? (!this.reader[n].perSec ? $Bio.eval(`[$trim(${item})]`, false) : FbTitleFormat(item).Eval()) : $Bio.eval(`[$trim(${item})]`, panelBio.id.focus);
		return item;
	}

	getPlainTxtLyrics(item) {
		const isSynced = this.isSynced(item, true);
		item = isSynced ? lyricsBio.parseSyncLyrics(item, !item.length) : lyricsBio.parseUnsyncedLyrics(item, !item.length);
		let lyr = item.map(v => v.content);
		const ln = Math.min(5, lyr.length);
		if (pptBio.sourceAll) {
			const lyricArtist = name.artist();
			const lyricTitle = name.title();
			const cleanArtist = $Bio.strip(lyricArtist);
			const cleanTitle = $Bio.strip(lyricTitle);
			let artistFound = false;
			let titleFound = false;
			for (let i = 0; i < ln; i++) {
				const line = $Bio.strip(lyr[i]);
				if (line.includes(cleanArtist)) artistFound = true;
				if (line.includes(cleanTitle)) titleFound = true;
			}
			lyr = lyr.join('\n').trim();
			if (!artistFound || !titleFound) return `${lyricArtist} - ${lyricTitle}\r\n\r\n${lyr}`;
			return lyr;
		}
		return lyr.join('\n').trim();
	}

	getPosition(string, subString, index) {
		return string.split(subString, index).join(subString).length;
	}

	getRatingStyle(site) {
		this.ratingPos = {
			heading: false,
			summary: false,
			subHeading: false,
			text: false,
			line: false
		};

		if (this.rating[site] == -1) {
			const b = this.rev[`${site}Alb`].indexOf(' <<');
			if (b != -1) this.rev[`${site}Alb`] = this.rev[`${site}Alb`].slice(b + 3);
			return;
		}

		const subHeadOn = pptBio.sourceAll && pptBio.sourceHeading || pptBio.sourceHeading == 2;
		if (!pptBio.star) { // pref heading
			if (uiBio.stars == 1) this.ratingPos.heading = true;
			else if (panelBio.summary.show) this.ratingPos.summary = true;
			else if (subHeadOn) this.ratingPos.subHeading = true;
			else this.ratingPos.text = true;
		}
		else {
			switch (pptBio.ratingTextPos) {
				case 0:
					if (panelBio.summary.show) this.ratingPos.summary = true;
					else if (subHeadOn) this.ratingPos.subHeading = true;
					else this.ratingPos.text = true;
					break;
				case 1:
					if (panelBio.summary.show) this.ratingPos.summary = true;
					else this.ratingPos.text = true;
					break;
				case 2:
					if (subHeadOn) this.ratingPos.subHeading = true;
					else this.ratingPos.line = true;
					break;
			}
		}

		if (this.ratingPos.text) return;

		this.rev[`${site}Alb`] = this.rev[`${site}Alb`].replace(/>>\sAlbum\srating:\s(.*?)\s<<\s{2}/, '');
		this.rating[`${site}Str`] = '';
		switch (true) {
			case this.ratingPos.summary:
				this.rating[`${site}Str`] = this.rating[site] != -1 ? `${pptBio[`${site}RatingName`]}: ${this.rating[site] / 2}` : '';
				if (pptBio[`${site}RatingName`] != 'Album rating') this.rev[`${site}Alb`] = this.rev[`${site}Alb`].replace('Album rating', pptBio[`${site}RatingName`]);
				break;
			case this.ratingPos.subHeading:
				break;
			case this.ratingPos.line:
				this.rev[`${site}Alb`] = `${this.rev.subhead[site][pptBio.heading ? 0 : 1]}\r\n\r\n${this.rev[`${site}Alb`]}`;
				if (pptBio[`${site}RatingName`] != 'Album rating') this.rev[`${site}Alb`] = this.rev[`${site}Alb`].replace('Album rating', pptBio[`${site}RatingName`]);
				break;
		}
	}

	getScrollPos() {
		let scrollPos;
		let v;
		switch (pptBio.artistView) {
			case true:
				v = `${this.artist}-${this.bio.loaded.ix}-${!this.bio.loaded.txt ? '' : this.bio.readerItem}`;
				scrollPos = $Bio.jsonParse(pptBio.bioScrollPos, {});
				if (!scrollPos[v]) return art_scrollbar.setScroll(0);
				art_scrollbar.setScroll(scrollPos[v] || 0);
				break;
			case false: {
				v = `${panelBio.style.inclTrackRev != 2 ? `${this.albumartist + this.album + this.composition}-` : ''}-${this.rev.loaded.ix}-${pptBio.inclTrackRev}${!this.rev.loaded.txt ? '' : this.rev.readerItem}`;
				scrollPos = $Bio.jsonParse(pptBio.revScrollPos, {});
				if (!scrollPos[v]) return alb_scrollbar.setScroll(0);
				alb_scrollbar.setScroll(scrollPos[v] || 0);
				break;
			}
		}
	}

	getSubHeadWidths(txtReaderOnly) {
		$Bio.gr(1, 1, false, g => {
			if (!txtReaderOnly) {
				const items = ['am_w', 'lfm_w', 'wiki_w'];

				let subHead = [`${this.rev.subhead.am[0]} `, `${this.rev.subhead.lfm[0]} `, `${this.rev.subhead.wiki[0]} `];
				items.forEach((v, i) => this.rev[v].hd = Math.max(g.CalcTextWidth(subHead[i], uiBio.font.subHeadSource), 1));

				subHead = [`${this.bio.subhead.am[1]} `, `${this.bio.subhead.lfm[1]} `, `${this.bio.subhead.wiki[1]} `];
				items.forEach((v, i) => this.bio[v].nohd = Math.max(g.CalcTextWidth(subHead[i], uiBio.font.subHeadSource), 1));

				subHead = [`${this.rev.subhead.am[1]} `, `${this.rev.subhead.lfm[1]} `, `${this.rev.subhead.wiki[1]} `];
				items.forEach((v, i) => this.rev[v].nohd = Math.max(g.CalcTextWidth(subHead[i], uiBio.font.subHeadSource), 1));

				this.bio.sp = Math.max(g.CalcTextWidth(' ', uiBio.font.subHeadSource), 1);
			}
			this.bio.txt_w.hd = this.bio.txt_w.nohd = Math.max(g.CalcTextWidth(`${this.bio.subhead.txt[1] || ''} `, uiBio.font.subHeadSource), 1);
			this.rev.txt_w.hd = this.rev.txt_w.nohd = Math.max(g.CalcTextWidth(`${this.rev.subhead.txt[1] || ''} `, uiBio.font.subHeadSource), 1);
		});
	}

	getText(p_calc, update) {
		if (pptBio.img_only) return;
		const a = $Bio.clean(this.artist);
		const n = pptBio.artistView ? 'bio' : 'rev';
		this.newText = false;
		if (!panelBio.lock) {
			this.trackartist = name.artist(panelBio.id.focus);
			this.track = name.title(panelBio.id.focus);
		}
		if (this[n].reader) this.txtReader();
		switch (true) {
			case pptBio.artistView:
				if (!a) break;
				if (!this.done.amBio || update) {
					this.done.amBio = true;
					this.amBio(a);
				}
				if (!this.done.lfmBio || update) {
					this.done.lfmBio = true;
					this.lfmBio(a);
				}
				if (!this.done.wikiBio || update) {
					this.done.wikiBio = true;
					this.wikiBio(a);
				}
				break;
			case !pptBio.artistView: {
				const aa = $Bio.clean(this.albumartist);
				const c = pptBio.classicalMusicMode ? $Bio.clean(this.composition) : '';
				const l = $Bio.clean(this.album);
				if (!aa || !l && !panelBio.style.inclTrackRev && !c) {
					this.resetRevAvailable();
					this.rating.am = -1;
					this.rating.lfm = -1;
					butBio.check();
					break;
				}
				if (panelBio.isRadio(panelBio.id.focus) && !panelBio.style.inclTrackRev && !panelBio.alb.ix) {
					this.resetRevAvailable();
					break;
				}
				if (!this.done.amRev || update) {
					this.done.amRev = true;
					this.amRev(a, aa, l, c);
				}
				if (!this.done.lfmRev || update) {
					this.done.lfmRev = true;
					this.lfmRev(a, aa, l);
				}
				if (!this.done.wikiRev || update) {
					this.done.wikiRev = true;
					this.wikiRev(a, aa, l, c);
				}
			}
			break;
		}

		if (!update || this.newText) {
			this[n].text = [];
			const fallbackText = !pptBio.heading ? this[n].fallbackText[1] : this[n].fallbackText[0];
			const types = $Bio.source.amLfmWikiTxt;
			const types_1 = this.moveArrayItem(types, 0, 3); // first to last
			const types_2 = this.moveArrayItem(types_1, 0, 3);
			const types_3 = this.moveArrayItem(types_2, 0, 3);
			const source = pptBio.artistView ? pptBio.sourcebio : pptBio.sourcerev;

			this.deactivateTooltip();

			const type = types[source];
			if (this[n].source[type]) {
				if ((pptBio.sourceAll && pptBio.sourceHeading || pptBio.sourceHeading == 2) && this[n][type] && type == 'lfm') this[n][type] = this[n][type].replace(/Last\.fm: /g, '');

				this[n].loaded = {
					am: false,
					lfm: false,
					wiki: false,
					txt: false,
					ix: -1
				};

				switch (true) {
					case !pptBio.sourceAll:
						if (!pptBio.lockBio) { // get target else fallback source
							const isMainAvail = this.isMainAvail(n);
							[type, types_1[source], types_2[source], types_3[source]].some(v => {
								if (this[n][v] && (v != 'txt' || !isMainAvail)) { // favour amLfmWiki fallback if !prefer textreader/lyrics/props
									this[n].text[0] = this[n][v];
									return this[n].loaded[v] = true;
								}
							});
						} else { // locked
							this[n].text[0] = this[n][type];
							if (this[n][type]) this[n].loaded[type] = true;
						}
						break;
					case pptBio.sourceAll: {
						let setLoaded = false;
						[types, types_1, types_2, types_3][pptBio[`source${n}`]].forEach((v, i) => {
							if ($Bio.isArray(this[n][v]) ? this[n][v].length : this[n][v]) {
								if (pptBio.sourceHeading) {
									this[n].text[i] = !$Bio.isArray(this[n][v]) ? (`${this[n].subhead[v][pptBio.heading ? 0 : 1]}\r\n\r\n${this[n][v]}`) : this[n][v];
								}
								else this[n].text[i] = this[n][v];
								if (!setLoaded) {
									this[n].loaded[v] = true;
									setLoaded = true;
								}
							} else this[n].text[i] = '';
						});
						break;
					}
				}

				Object.values(this[n].loaded).some((v, i) => {
					if (v === true) {
						this[n].loaded.ix = i;
						return true;
					}
				});
				if (this[n].loaded.ix == -1) {
					this[n].loaded.ix = source;
				}

				if (this[n].text.every(v => !v) && !pptBio.img_only) this[n].text[0] = fallbackText;
				if (pptBio.sourceHeading == 2 && !pptBio.sourceAll) {
					if (!$Bio.isArray(this[n].text[0])) this[n].text[0] = `${this[n].subhead[types[this[n].loaded.ix]][pptBio.heading ? 0 : 1]}\r\n\r\n${this[n].text[0]}`;
				}
			}

			if (panelBio.id.lyricsSource) lyricsBio.clear();
			timerBio.clear(timerBio.lyrics);
			if (panelBio.id.lyricsSource) {
				if (this[n].loaded.txt && this.reader[n].lyrics) {
					if (!this.reader[n].txtLyrics) lyricsBio.load(this[n].txt);
					else this.paint();
				} else if (fb.IsPlaying && this.artist && (!this.reader.ESLyricSaved || !this.reader.lyrics3Saved)) {
					if (pptBio.syncTxtReaderLyrics) this.lyricsSave();
				}
			}

			if (!this[n].loaded.txt || !this.reader[n].lyrics) this.reader[n].txtLyrics = false;
			this[n].subHeading = (pptBio.sourceAll && pptBio.sourceHeading || pptBio.sourceHeading == 2) && this[n].text.length && this[n].text[0] != fallbackText ? 1 : 0;

			if (!pptBio.heading && this[n].subHeading && this[n].loaded.ix != -1) {
				const subHeadingWidth = this[n][['am_w', 'lfm_w', 'wiki_w', 'txt_w'][this[n].loaded.ix]].nohd + this.bio.sp;
				this[n].ln.x1 = panelBio.text.l + subHeadingWidth;
				this[n].ln.x2 = Math.max(this[n].ln.x1, panelBio.text.l + panelBio.text.w);
			}

			imgBio.setCrop(true);
			if (pptBio.artistView) {
				const bioText = JSON.stringify(this.bio.text);
				if (bioText != this.bio.cur || p_calc && p_calc !== 2) this.artCalc();
				this.bio.cur = bioText;
			} else {
				const revText = JSON.stringify(this.rev.text);
				if (revText != this.rev.cur || p_calc && p_calc !== 1) this.albCalc();
				this.rev.cur = revText;
			}
			if (pptBio.text_only && !uiBio.style.isBlur || panelBio.alb.ix && panelBio.style.inclTrackRev) this.paint();
		}
		const lyrPropsNowp = this[n].loaded.txt && (this.reader[n].lyrics || this.reader[n].props || this.reader[n].nowplaying);
		const flagArtist = pptBio.artistView ? (!lyrPropsNowp ? this.artist : name.artist(panelBio.id.focus)) : (!lyrPropsNowp ? this.albumartist : name.albumArtist(panelBio.id.focus));
		this.getFlag(flagArtist, n);
		if (!pptBio.heading) {
			this.newText = false;
			return;
		}
		if (panelBio.lock && !this.newText) {
			if (this.curHeadingID == this.headingID()) {
				this.newText = false;
				return;
			} else this.curHeadingID = this.headingID();
		}

		this.newText = false;
		if (pptBio.artistView) this.heading = uiBio.show.headingText ? this.tf(!this.bio.reader || !this.bio.loaded.txt ? pptBio.bioHeading : this.bio.readerHeading, pptBio.artistView): '';
		else {
			if (pptBio.classicalMusicMode) panelBio.getList();
			this.heading = uiBio.show.headingText ?
			(
				panelBio.style.inclTrackRev && (this.rev.loaded.lfm && this.rev.lfmTrackHeading || this.rev.loaded.am && this.rev.amTrackHeading || this.rev.loaded.wiki && this.rev.wikiTrackHeading) ?
				this.tf(pptBio.trkHeading, pptBio.artistView, true) :
				this.tf(!this.rev.reader || !this.rev.loaded.txt ? (panelBio.style.inclTrackRev == 2 && !this.isCompositionLoaded() ? pptBio.trkHeading : pptBio.revHeading) :
				this.rev.readerHeading, pptBio.artistView)
			) : '';
		}
		if (panelBio.lock) this.curHeadingID = this.headingID();
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

	grab() {
		this.textUpdate = 1;
		this.notifyTags();
		if (panelBio.block()) return;
		this.updText();
	}

	headingID() {
		return `${pptBio.artistView}-${panelBio.art.ix}-${panelBio.alb.ix}-${pptBio.sourcebio}-${pptBio.sourcerev}-${panelBio.style.inclTrackRev}`;
	}

	increment(n) {
		const num = parseInt(n.replace(/\D/g, ''));
		n = n.replace(new RegExp(num), num + 1);
		if (num == 1) n += 's';
		return n;
	}

	isCompositionLoaded() {
		return !pptBio.artistView && pptBio.classicalMusicMode && (this.rev.loaded.am && !this.rev.amFallback || this.rev.loaded.wiki && !this.rev.wikiFallback) && !panelBio.alb.ix;
	}

	isMainAvail(n) {
		return $Bio.source.amLfmWiki.some(v => this[n][v] && pptBio[`source${n}`] != 3);
	}

	isSynced(n, lines) {
		return lines ? n.some(line => lyricsBio.leadingTimestamps.test(line)) : n.match(RegExp(lyricsBio.leadingTimestamps, 'm'));
	}

	isTag(n) {
		return n && !/\\/.test(n);
	}

	isTrackRevAvail(source, o) {
		if (!o) return -1;
		switch (source) {
			case 'am': return (['date', 'wiki'].some(v => $Bio.getProp(o, v, false)) || ['composer', 'genres', 'moods', 'themes'].some(v => $Bio.getProp(o, v, []).length)) ? 0 : -1;
			case 'lfm': return (['length', 'releases', 'stats', 'wiki'].some(v => $Bio.getProp(o, v, false)) || $Bio.getProp(o, 'tags', []).length) ? 1 : -1;
			case 'wiki': return (['date', 'length', 'wiki'].some(v => $Bio.getProp(o, v, false)) || ['composer', 'genre'].some(v => $Bio.getProp(o, v, []).length)) ? 2 : -1;
		}
	}

	leave() {
		this.deactivateTooltip();
	}

	lfmBio(a) {
		const lBio = panelBio.getPth('bio', panelBio.id.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foLfmBio', true).pth;
		if (!$Bio.file(lBio)) return;
		this.mod.lfmBio = $Bio.lastModified(lBio) || 0;
		if (this.mod.lfmBio == this.mod.curLfmBio) return;
		let bornStr = '';
		let foundedIn = '';
		this.bio.lfm = $Bio.open(lBio).trim();
		if (!pptBio.stats) {
			const f = this.bio.lfm.indexOf('Last.fm: ');
			if (f != -1) this.bio.lfm = this.bio.lfm.slice(0, f).trim();
		}
		this.bio.lfm = this.bio.lfm.replace(/\s\u200b\|[\d.,\s]*?;/g, ';').replace(/\u200b\|[\d.,\s]*?$/gm, '').replace(/, Jr\./g, ' Jr.');
		const b = this.getBornStr(this.bio.lfm);
		bornStr = b.bornStr;
		this.bio.lfm = b.source;
		const o = this.getFoundedIn(this.bio.lfm);
		foundedIn = o.foundedIn;
		this.bio.lfm = o.source;
		this.bio.lfm = this.formatText('lfmBio', this.bio.lfm, { limit: 6, list: true, key: panelBio.summary.genre ? 'Top Tags: ' : '' }, { str: foundedIn }, { str: bornStr }, panelBio.summary.date ? { key: this.bio.died } : {}, panelBio.summary.date ? { key: this.bio.yrsActive } : {}, !panelBio.summary.other ? {} : { key: 'Last.fm: ' }, panelBio.summary.popNow ? { key: this.bio.popNow } : '').replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		this.newText = true;
		this.mod.curLfmBio = this.mod.lfmBio;
	}

	lfmRev(a, aa, l) {
		let lfm_tr_mod = '';
		let trackLength = '';
		let trackRev = '';
		let trk = '';
		const lRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foLfmRev', true).pth;
		this.avail.lfmalb = $Bio.file(lRev) ? 1 : -1;
		if (this.avail.lfmalb == -1) {
			this.rating.lfm = -1;
			butBio.check();
			if (!panelBio.style.inclTrackRev) {
				this.rev.lfmAlb = '';
				return;
			}
		}

		trk = this.track.toLowerCase();
		trackRev = $Bio.jsonParse(panelBio.getPth('track', panelBio.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foLfmRev', true).pth, false, 'file');
		this.avail.lfmtrk = this.isTrackRevAvail('lfm', trackRev[trk]);
		if (panelBio.style.inclTrackRev && trackRev[trk] && trackRev[trk].update) lfm_tr_mod = trackRev[trk].update;

		this.mod.lfmRev = ($Bio.lastModified(lRev) || 0) + (lfm_tr_mod || 0);
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
					this.rev.lfmAlb = `>> Album rating: ${this.rating.lfm} <<  ${this.rev.lfmAlb}`;
					this.rating.lfm *= 2;
					this.getRatingStyle('lfm');
				}
			} else {
				this.rating.lfmStr = '';
			}
			this.rev.lfmAlb = pptBio.score ? this.rev.lfmAlb.replace('Rating: ', '') : this.rev.lfmAlb.replace(/^Rating: .*$/m, '').trim();
		}

		this.rev.lfm = this.rev.lfmAlb;
		let needTrackSubHeading = false;
		let releases = '';
		if (panelBio.style.inclTrackRev) {
			if (trackRev && trackRev[trk]) {
				const o = trackRev[trk];
				let wiki = '';
				releases = $Bio.getProp(o, 'releases', '');
				if (!panelBio.summary.date) wiki = this.add([releases], wiki);
				releases = releases.replace(/\.$/, '');
				if (releases.includes('\u200b')) {
					const chk = releases.split(/\u200b:\s|\u200b,\s|\s\u200band\s/);
					if (chk.length > 2) {
						const onlyOneNamedAlbum = false;
						const tidy = n => n.replace(/\([^)]+\)/g, '').toLowerCase().trim();
						if (tidy(chk[1]) == tidy(chk[2]) || onlyOneNamedAlbum) {
							if (chk[3]) chk[3] = this.increment(chk[3]);
							releases = `${chk[0]}: ${chk[1]}${chk[3] ? ` and ${chk[3]}` : ''}`;
						}
					}
				}
				wiki = this.add([$Bio.getProp(o, 'wiki', '')], wiki);
				const showGenres = !pptBio.autoOptimiseText || !this.rev.lfmAlb;
				let tags = '';
				if (showGenres) {
					tags = $Bio.getProp(o, 'tags', []).join('\u200b, ');
					if (tags) tags = `Track Tags: ${tags}`;
				}
				const length = $Bio.getProp(o, 'length', '');
				if (length) {
					const ix = cfg.lang.arr.indexOf(o.lang);
					const label = this.rev.length[ix];
					trackLength = label + length;
				}
				const stats = $Bio.getProp(o, 'stats', '');
				wiki = this.add([tags, trackLength, stats], wiki);
				if (wiki) {
					if (pptBio.trackHeading == 1 && (this.rev.lfmAlb || !pptBio.heading) || pptBio.trackHeading == 2) {
						this.rev.lfmTrackHeading = false;
						if (this.rev.lfmAlb) {
							trackRev = `!\u00a6${this.tf(pptBio.trackSubHeading, pptBio.artistView, true)}\r\n\r\n${wiki}`;
						} else {
							trackRev = wiki;
							needTrackSubHeading = true;
						}
					} else {
						this.rev.lfmTrackHeading = true;
						trackRev = wiki;
					}
					if (panelBio.summary.other) trackRev = trackRev.replace(/^Last\.fm:\s/gm, 'Last-fm: ');
					this.rev.lfm = this.add([trackRev], this.rev.lfmAlb);
				} else {
					this.rev.lfmTrackHeading = panelBio.style.inclTrackRev == 2;
				}
			} else {
				this.rev.lfmTrackHeading = panelBio.style.inclTrackRev == 2;
			}
		}
		if (!pptBio.stats) {
			this.rev.lfm = this.rev.lfm.replace(/^Last\.fm: .*$(\n)?/gm, '').trim();
		}

		this.rev.lfm = this.formatText('lfmRev', this.rev.lfm, panelBio.summary.genre ? { limit: 6, list: true, key: this.rev.lfmAlb ? 'Top Tags: ' : 'Track Tags: ' } : {}, panelBio.summary.date ? { key: this.rev.releaseDate } : {}, !panelBio.summary.date || this.rev.lfmAlb ? {} : { str: releases }, !panelBio.summary.other ? {} : { key: this.rev.lfmAlb ? 'Last.fm: ' : 'Last-fm: ' }, { str: this.rating.lfmStr });
		if (panelBio.summary.show || !pptBio.stats) this.rev.lfm = this.rev.lfm.replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (needTrackSubHeading) this.rev.lfm = `!\u00a6${this.tf(pptBio.trackSubHeading, pptBio.artistView, true)}\r\n\r\n${this.rev.lfm}`;
		if (!this.rev.lfm) butBio.check();
	}

	loadLyric() {
		setTimeout(() => { this.getText(); }, 1000);
		timerBio.clear(timerBio.lyrics);
	}

	loadReader() {
		this.bio.reader = false;
		for (let i = 0; i < 4; i++) {
			if (pptBio.txtReaderEnable && pptBio[`useTxtReader${i}`] && pptBio[`pthTxtReader${i}`]) {
				this.bio.reader = true;
				break;
			}
		}
		this.rev.reader = false;
		for (let i = 4; i < 8; i++) {
			if (pptBio.txtReaderEnable && pptBio[`useTxtReader${i}`] && pptBio[`pthTxtReader${i}`]) {
				this.rev.reader = true;
				break;
			}
		}
		pptBio.sourcebio = $Bio.clamp(pptBio.sourcebio, 0, this.bio.reader ? 3 : 2);
		pptBio.sourcerev = $Bio.clamp(pptBio.sourcerev, 0, this.rev.reader ? 3 : 2);
		this.bio.source = {
			am: pptBio.sourcebio == 0,
			lfm: pptBio.sourcebio == 1,
			wiki: pptBio.sourcebio == 2,
			txt: pptBio.sourcebio == 3
		};
		this.rev.source = {
			am: pptBio.sourcerev == 0,
			lfm: pptBio.sourcerev == 1,
			wiki: pptBio.sourcerev == 2,
			txt: pptBio.sourcerev == 3
		};
		this.bio.readerItem = '';
		this.rev.readerItem = '';
		this.reader.items = [];
		for (let i = 0; i < 8; i++) {
			const item = pptBio[`useTxtReader${i}`] ? pptBio[`pthTxtReader${i}`] : '';
			this.reader.items.push({
				view: i < 4 ? 'bio' : 'rev',
				lyrics: pptBio[`lyricsTxtReader${i}`] && !/item_properties/i.test(utils.SplitFilePath(item)[1]),
				name: pptBio[`nmTxtReader${i}`],
				nowplaying: /nowplaying/i.test(utils.SplitFilePath(item)[1]),
				props: /item_properties/i.test(utils.SplitFilePath(item)[1]),
				pth: item,
				tag: this.isTag(item)
			});
		}
		for (let i = 0; i < 8; i++) {
			this.reader.items[i].heading = this.reader.items[i].lyrics ? pptBio.lyricHeading : this.reader.items[i].props ? pptBio.trkHeading : this.reader.items[i].view == 'bio' ? pptBio.bioHeading : pptBio.revHeading;
		}
	}

	logScrollPos(n) {
		let keys = [];
		let scrollPos;
		let v;
		n = n == 'rev' ? false : n == 'bio' ? true : pptBio.artistView;
		switch (n) {
			case true:
				scrollPos = $Bio.jsonParse(pptBio.bioScrollPos, {});
				keys = Object.keys(scrollPos);
				if (keys.length > 70) delete scrollPos[keys[0]];
				v = `${this.artist}-${this.bio.loaded.ix}-${!this.bio.loaded.txt ? '' : this.bio.readerItem}`;
				scrollPos[v] = art_scrollbar.scroll;
				pptBio.bioScrollPos = JSON.stringify(scrollPos);
				break;
			case false:
				scrollPos = $Bio.jsonParse(pptBio.revScrollPos, {});
				keys = Object.keys(scrollPos);
				if (keys.length > 70) delete scrollPos[keys[0]];
				v = `${panelBio.style.inclTrackRev != 2 ? `${this.albumartist + this.album + this.composition}-` : ''}-${this.rev.loaded.ix}-${pptBio.inclTrackRev}${!this.rev.loaded.txt ? '' : this.rev.readerItem}`;
				scrollPos[v] = alb_scrollbar.scroll;
				pptBio.revScrollPos = JSON.stringify(scrollPos);
				break;
		}
	}

	lyricExists() {
		return this.reader.items.some(v => {
			if (v.lyrics) {
				return v.tag ? $Bio.eval(`[$trim(${v.pth})]`, false) : $Bio.file(panelBio.cleanPth(v.pth, false, 'lyr').slice(0, -1));
			}
		});
	}

	lyricsArr(n) {
		return this.reader[n].lyrics && !this.reader[n].txtLyrics;
	}

	lyricsDisplayed() {
		const n = pptBio.artistView ? 'bio' : 'rev';
		return this[n].loaded.txt && this.lyricsArr(n) && !pptBio.img_only;
	}

	lyricsSave() {
		if (!this.lyrics.ESLyricInstalled && !this.lyrics.lyrics3Installed) return;
		let counter = 0;
		timerBio.clear(timerBio.lyrics);
		timerBio.lyrics.id = setInterval(() => {
			if (this.lyrics.lyrics3Installed && !this.reader.lyrics3Saved) {
				if ($Bio.eval('%lyric_exists%', false)) {
					fb.RunMainMenuCommand('View/Lyrics Show 3/Save');
					this.reader.lyrics3Saved = true;
					this.loadLyric();
				}
			}
			if (this.lyrics.ESLyricInstalled && !this.reader.ESLyricSaved) {
				if (!this.lyricExists()) {
					fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
				} else {
					this.reader.ESLyricSaved = true;
					this.loadLyric();
				}
			}
			counter++;
			if (counter == 30) timerBio.clear(timerBio.lyrics);
		}, 1000);
	}

	move(x, y) {
		this.get_ix(x, y);
		if (this.rev.ix != -1) {
			this.check_tooltip(this.rev.arr[this.rev.ix], x, y, false, this.line.h.rev);
		} else if (this.bio.ix != -1) {
			this.check_tooltip(this.bio.arr[this.bio.ix], x, y, true, this.line.h.bio);
		} else this.deactivateTooltip();
		if (this.rev.ix == this.rev.cur_ix && this.bio.ix == this.bio.cur_ix) return;
		this.rev.cur_ix = this.rev.ix;
		this.bio.cur_ix = this.bio.ix;
	}

	moveArrayItem(array, fromIndex, toIndex) {
		const arr = [...array];
		arr.splice(toIndex, 0, ...arr.splice(fromIndex, 1));
		return arr;
	}

	notifyTags() {
		if (!cfg.notifyTags && !tagBio.force) return;
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
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
			this.na = '';
			this.getText(false);
			if (!panelBio.lock) panelBio.getList(true);
			this.get = 0;
		}
	}

	on_size() {
		this.logScrollPos();
		this.albumFlush();
		this.artistFlush();
		this.bio.cur = '';
		this.rev.cur = '';
		this.getText(false);
		panelBio.getList(true);
		butBio.refresh(true);
		this.notifyTags();
	}

	paint() {
		if (!this.repaint) return;
		if (!panelBio.style.showFilmStrip) window.Repaint();
		else window.RepaintRect(0, geo.topMenuHeight, uiBio.w, uiBio.h);
	}

	refresh(n) {
		switch (n) {
			case 0: // general style changes etc
				filmStrip.logScrollPos();
				filmStrip.setFilmStripSize();
				panelBio.setStyle();
				imgBio.clearCache();
				this.albumFlush();
				this.artistFlush();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				butBio.refresh();
				imgBio.getImages();
				if (pptBio.showFilmStrip && pptBio.autoFilm) this.getScrollPos();
				butBio.setLookUpPos();
				break;
			case 1: // onOff heading summary; setReviewType; toggle('sourceAll'); toggle('classicalMusicMode') all except setReviewType set scrollPos = {} to forcescrollReset
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
			case 2: // reset zoom
				if (panelBio.style.inclTrackRev == 1) this.logScrollPos();
				uiBio.getColours();
				uiBio.getFont();
				panelBio.setStyle();
				if (!pptBio.img_only) imgBio.clearCache();
				this.albumFlush();
				this.artistFlush();
				this.rev.cur = '';
				this.bio.cur = '';
				this.reader.w.nameCol = 10;
				this.reader.w.valueCol = 10;
				this.getText(true);
				imgBio.getImages();
				if (pptBio.text_only && !uiBio.style.isBlur) this.paint();
				break;
			case 3: // wheel setZoom & resetStyle
				filmStrip.logScrollPos();
				this.logScrollPos();
				panelBio.setStyle();
				this.albumFlush();
				this.artistFlush();
				imgBio.clearCache();
				butBio.refresh();
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
		this.artCalc(); this.albCalc(); // Refresh text color
	}

	resetRevAvailable() {
		$Bio.source.amLfmWiki.forEach(v => {
			this.avail[`${v}alb`] = -1;
			this.avail[`${v}trk`] = -1;
		});
	}

	revPth(n) {
		if (pptBio.img_only) return ['', '', false, false];
		const field = n != 'Am' && n != 'Wiki' ? this.album : !pptBio.classicalMusicMode || n == 'Am' && this.rev.amFallback || n == 'Wiki' && this.rev.wikiFallback || panelBio.alb.ix ? this.album : this.composition;
		return panelBio.getPth('rev', panelBio.id.focus, this.artist, field, '', cfg.supCache, $Bio.clean(this.artist), $Bio.clean(this.albumartist), $Bio.clean(field), `fo${n}Rev`, false);
	}

	scrollbar_type() {
		return pptBio.artistView ? art_scrollbar : alb_scrollbar;
	}

	setSectionHeading(item, name, arr) {
		if (!arr.length) return item;
		item.push({ text: '', name: '', value: '', property: true });
		item.push({ text: '', name, value: '', property: true, sectionHeading: true });
		return item.concat(arr);
	}

	tf(n, artistView, trackreview) {
		if (!n) return '';
		if (panelBio.lock) n = n.replace(/%artist%|\$meta\(artist,0\)/g, '#\u00a6#\u00a6#%artist%#\u00a6#\u00a6#').replace(/%title%|\$meta\(title,0\)/g, '#!#!#%title%#!#!#');
		const b = artistView ? 'bio' : 'rev';
		const a = this[b].loaded.txt && (this.reader[b].lyrics || this.reader[b].props || this.reader[b].nowplaying) ? $Bio.tfEscape(name.artist(panelBio.id.focus)) : $Bio.tfEscape(artistView ? this.artist : (!trackreview ? (panelBio.alb.ix ? this.albumartist : this.artist) : this.trackartist));
		const aa = this[b].loaded.txt && (this.reader[b].lyrics || this.reader[b].props || this.reader[b].nowplaying) || panelBio.isRadio(panelBio.id.focus) ? $Bio.tfEscape(name.albumArtist(panelBio.id.focus)) : $Bio.tfEscape(artistView ? (panelBio.art.ix ? this.artist : this.albumartist) : (!trackreview ? this.albumartist : this.trackartist));
		const composition = this.isCompositionLoaded();
		const l = composition ? $Bio.tfEscape(this.composition.replace('Album Unknown', '')) : $Bio.tfEscape(this.album.replace('Album Unknown', ''));
		const tr = $Bio.tfEscape(this.track);
		if (composition) n = n.replace(/%bio_album%/gi, cfg.tf.composition);
		n = n.replace(/%lookup_item%/gi, panelBio.simTagTopLookUp() ? '$&#@!%path%#@!' : '$&');
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? '$&#@!%path%#@!' : '$&').replace(/%bio_artist%/gi, a).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? '$&#@!%path%#@!' : '$&').replace(/%bio_albumartist%/gi, aa).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? '$&#@!%path%#@!' : '$&').replace(/%bio_album%/gi, l).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? '$&#@!%path%#@!' : '$&').replace(/%bio_title%/gi, tr);
		n = $Bio.eval(n, panelBio.id.focus);
		if (panelBio.lock) n = n.replace(/#\u00a6#\u00a6#.*?#\u00a6#\u00a6#/g, this.trackartist).replace(/#!#!#.*?#!#!#/g, this.track);
		return n.replace(/#@!.*?#@!/g, '') || 'No Selection';
	}

	tidyLyrics(n) {
		return n.replace(/&amp(;|)/g, '&')
		.replace(/&gt(;|)/g, '>')
		.replace(/&lt(;|)/g, '<')
		.replace(/&nbsp(;|)/g, '')
		.replace(/&quot(;|)/g, '"')
		.replace(/<br>/gi, '')
		.replace(/\uFF1A/g, ':')
		.replace(/\uFF08/g, '(')
		.replace(/\uFF09/g, ')')
		.replace(/\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(;|)|â€˜(;|)|&#39(;|)|&apos(;|)/g, "'")
		.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g, ' ')
		.trim();
	}

	tidyWiki(n) {
		if (!this[n].loaded.wiki && !pptBio.sourceAll || !pptBio.wikiStyle) return;
		const arr = this[n].arr;
		let i = arr.length;
		while (i--) {
			const v = arr[i];
			if (/^=+$/.test(v.text)) arr.splice(i, 1);
			else v.text = v.text.replace(/=/g, '').trim();
		}
	}

	trackPth(n) {
		if (pptBio.img_only || pptBio.artistView) return ['', '', false, false];
		return panelBio.getPth('track', panelBio.id.focus, this.artist, 'Track Reviews', '', '', $Bio.clean(this.artist), '', 'Track Reviews', `fo${n}Rev`, false);
	}

	txtBioPth() {
		if (!pptBio.artistView || !pptBio.txtReaderEnable || pptBio.img_only) return ['', '', false, false];
		let pth = '';
		if (!this.bio.readerTag) pth = this.bio.readerItem;
		else {
			const handle = $Bio.handle(panelBio.id.focus);
			if (handle) pth = handle.Path;
		}
		return ['', pth, true, $Bio.file(pth)];
	}

	txtReader() {
		const readerStart = Date.now();
		const n = pptBio.artistView ? 'bio' : 'rev';
		this[n].readerTag = false;
		let found = -1;
		let nm = $Bio.titlecase('textreader');
		this.bio.subhead.txt = [nm, nm];
		this.rev.subhead.txt = [nm, nm];
		this.reader.items.some((v, i) => {
			if (v.view == n) {
				if (v.tag) {
					this[n].readerItem = $Bio.eval(`[$trim(${v.pth})]`, false);
					if (this[n].readerItem.length) {
						found = i;
						return true;
					}
				} else {
					if (this.findFile(v, n)) {
						found = i;
						return true;
					}
				}
			}
		});
		if (found == -1) {
			this.reader[n].lyrics = false;
			this.reader[n].nowplaying = false;
			this.reader[n].perSec = false;
			this.reader[n].props = false;
			this[n].readerItem = '';
			this[n].txt = '';
			butBio.createStars();
			return;
		}
		this.reader[n].lyrics = this.reader.items[found].lyrics;
		this.reader[n].nowplaying = this.reader.items[found].nowplaying;
		this.reader[n].props = this.reader.items[found].props;
		nm = this.upperCaseFirst(this.reader.items[found].name);
		this[n].subhead.txt = [nm, nm];
		this[n].readerHeading = this.reader.items[found].heading;
		butBio.createStars();
		this.getSubHeadWidths(true);
		if (this.reader.items[found].tag) {
			this[n].readerTag = true;
			this.checkLyrics(n, this[n].readerItem);
			if (!this.reader[n].lyrics) {
				if (this[n].txt != this[n].readerItem) {
						this[n].txt = this[n].readerItem;
						this.newText = true;
					}
			} else {
				let tFSplit = this.tidyLyrics(this[n].readerItem).split('\n');
				if (tFSplit.length === 1) {
					tFSplit = this[n].readerItem.split('\r');
				}
				if (this.reader[n].txtLyrics) tFSplit = this.getPlainTxtLyrics(tFSplit, !tFSplit.length);
				if (!$Bio.equal(this[n].txt, tFSplit)) {
						this[n].txt = tFSplit;
						this.newText = true;
				}
			}
			return;
		} else {
			let item = !this.reader[n].lyrics ? $Bio.open(this[n].readerItem).trim() : utils.ReadTextFile(this[n].readerItem, 65001);
			if (this.reader[n].lyrics && item.includes('\ufffd')) item = $Bio.open(this[n].readerItem);
			if (this.reader[n].lyrics) item = this.tidyLyrics(item);
			this.checkLyrics(n, item);
			if (this.reader[n].lyrics) {
				item = item.split('\n');
				if (this.reader[n].txtLyrics) item = this.getPlainTxtLyrics(item);
			}
			if (this.reader[n].props) item = this.getItemProperties(item, n);
			if (this.reader[n].nowplaying) item = this.getNowplaying(item, n);

			if (!this.reader[n].lyrics) {
				if ($Bio.isArray(this[n].txt)) {
					if (this.different(this[n].txt, item)) {
						this[n].txt = item;
						this.newText = true;
					}
				} else if (this[n].txt != item) {
					this[n].txt = item;
					this.newText = true;
				}
			} else {
				if (!$Bio.equal(this[n].txt, item)) {
					this[n].txt = item;
					this.newText = true;
				}
			}
		}
	}

	txtRevPth() {
		if (pptBio.artistView || !pptBio.txtReaderEnable || pptBio.img_only) return ['', '', false, false];
		let pth = '';
		if (!this.rev.readerTag) pth = this.rev.readerItem;
		else {
			const handle = $Bio.handle(panelBio.id.focus);
			if (handle) pth = handle.Path;
		}
		return ['', pth, true, $Bio.file(pth)];
	}

	updText() {
		this.getText(false, true);
		imgBio.getArtImg();
		imgBio.getFbImg();
		this.textUpdate = 0;
		this.done.amBio = this.done.lfmBio = this.done.amRev = this.done.lfmRev = this.done.wikiRev = false;
	}

	upperCaseFirst(n) {
		return `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()}`;
	}

	wikiBio(a) {
		const wBio = panelBio.getPth('bio', panelBio.id.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foWikiBio', true).pth;
		const lBio = panelBio.getPth('bio', panelBio.id.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foLfmBio', true).pth;
		if (!$Bio.file(wBio) && !$Bio.file(lBio)) return;
		this.mod.wikiBio = ($Bio.lastModified(wBio) || 0) + (panelBio.summary.show ? ($Bio.lastModified(lBio) || 0) : 0);
		if (this.mod.wikiBio == this.mod.curWikiBio) return;
		this.bio.wiki = $Bio.open(wBio).replace(/\u200b/g, '').trim();
		const checkGenre = this.checkGenre(this.bio.wiki);
		const en = this.bio.wiki.includes('Wikipedia language: EN');
		const bioLfm = $Bio.open(lBio);
		let bornStr = '';
		let active = '';
		let foundedIn = '';
		let latest = '';

		if (this.bio.wiki && panelBio.summary.show) {
			if (panelBio.summary.latest) {
				const latestRelease = tagBio.getTag(bioLfm, this.bio.latestRelease, true);
				if (latestRelease.tag) latest = latestRelease.label + latestRelease.tag;
			}
			const b = this.getBornStr(en ? this.bio.wiki : bioLfm);
			bornStr = b.bornStr;
			if (en) this.bio.wiki = b.source;
			else if (!bornStr) {
				const y = tagBio.getTag(bioLfm, this.bio.yrsActive, true);
				if (y.tag) {
					active = y.label + y.tag;
				}
			}
			const o = this.getFoundedIn(en ? this.bio.wiki : bioLfm);
			foundedIn = o.foundedIn;
			if (en) this.bio.wiki = o.source;
		}

		if (pptBio.sourceAll && pptBio.autoOptimiseText) {
			const f = this.bio.wiki.indexOf('==');
			if (f != -1) {
				const ix = this.bio.wiki.lastIndexOf('Genre: ');
				let genre = '';
				if (ix != -1) {
					genre = this.bio.wiki.substring(ix);
					genre = genre.split('\n')[0].trim();
				}
				this.bio.wiki = this.add([genre], this.bio.wiki.slice(0, f).trim());
			}
		}
		this.bio.wiki = this.bio.wiki.replace(/Wikipedia language:\s[A-Z]{2}/, '');
		this.bio.wiki = this.formatText('wikiBio', this.bio.wiki, panelBio.summary.genre ? { limit: 6, list: true, key: 'Genre: ' } : {}, { str: foundedIn }, { str: bornStr }, panelBio.summary.date ? { key: this.bio.died } : {}, panelBio.summary.date ? (en ? { key: this.bio.yrsActive } : { str: active }) : {}, '', panelBio.summary.latest ? { str: latest } : '', checkGenre.singleGenre).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		this.newText = true;
		this.mod.curWikiBio = this.mod.wikiBio;
	}

	wikiRev(a, aa, l, c) {
		let albLength = '';
		let albReleaseDate = '';
		let foundComp = false;
		let length = '';
		let trackRev = '';
		let trk = '';
		let wRev = '';
		let wiki_tr_mod = 0;
		let writer = '';

		if (!pptBio.classicalMusicMode || panelBio.alb.ix) {
			wRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foWikiRev', true).pth;
		} else if (!panelBio.alb.ix) {
			wRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.composition, '', cfg.supCache, a, aa, c, 'foWikiRev', true).pth;
			if ($Bio.file(wRev)) foundComp = true;
		}
		this.rev.wikiFallback = !foundComp;
		if (!$Bio.file(wRev) && pptBio.classicalAlbFallback && !panelBio.alb.ix && panelBio.style.inclTrackRev != 2) {
			wRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foWikiRev', true).pth;
		}
		this.avail.wikialb = $Bio.file(wRev) ? 2 : -1;
		const lRev = panelBio.getPth('rev', panelBio.id.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foLfmRev', true).pth;
		if (this.avail.wikialb == -1 && !$Bio.file(lRev)) {
			butBio.check();
			if (!panelBio.style.inclTrackRev || pptBio.classicalMusicMode && !pptBio.classicalAlbFallback) {
				this.rev.wikiAlb = '';
				return;
			}
		}

		trk = this.track.toLowerCase();
		trackRev = $Bio.jsonParse(panelBio.getPth('track', panelBio.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foWikiRev', true).pth, false, 'file');
		this.avail.wikitrk = this.isTrackRevAvail('wiki', trackRev[trk]);
		if (panelBio.style.inclTrackRev && trackRev[trk] && trackRev[trk].update) wiki_tr_mod = trackRev[trk].update;

		this.mod.wikiRev = ($Bio.lastModified(wRev) || 0) + (panelBio.summary.show ? ($Bio.lastModified(lRev) || 0) : 0) + (wiki_tr_mod || 0);
		if (this.mod.wikiRev == this.mod.curWikiRev) return;
		this.rev.wikiAlb = '';
		let revLfm = '';
		if (panelBio.style.inclTrackRev != 2 || foundComp) {
			this.rev.wikiAlb = $Bio.open(wRev).replace(/\u200b/g, '').trim();
			if (!foundComp) revLfm = $Bio.open(lRev).replace(/\u200b/g, '').trim();
		}

		const checkGenre = this.checkGenre(this.rev.wikiAlb);
		this.newText = true;
		this.mod.curWikiRev = this.mod.wikiRev;
		this.rev.wikiAlb = this.rev.wikiAlb.replace('Genre: ', 'Album Genres: ');
		const eng = this.rev.wikiAlb.includes('Wikipedia language: EN');
		if (panelBio.style.inclTrackRev != 2 || foundComp) {
			if (this.rev.wikiAlb && panelBio.summary.date) {
				const lfmDate = tagBio.getTag(revLfm, this.rev.releaseDate, true);
				if (lfmDate.tag) albReleaseDate = lfmDate.label + lfmDate.tag;
				if (eng) {
					const wRevDate = tagBio.getTag(this.rev.wikiAlb, this.rev.releaseDate, true);
					if (wRevDate.tag) {
						albReleaseDate = wRevDate.label + wRevDate.tag;
						if (lfmDate.tag) {
							const tracks = lfmDate.tag.split(' | ');
							if (tracks.length > 1) {
								albReleaseDate = `${wRevDate.label + wRevDate.tag} | ${tracks[1]}`;
							}
						}
						let sub = this.rev.wikiAlb.substring(wRevDate.ix);
						sub = sub.split('\n')[0].trim();
						this.rev.wikiAlb = this.rev.wikiAlb.replace(RegExp($Bio.regexEscape(sub)), '');
					}
				}
				if (panelBio.summary.other) {
					const length = tagBio.getTag(eng ? this.rev.wikiAlb : revLfm, eng ? 'Length: ' : this.rev.len, true);
					if (length.tag) {
						albLength = length.label + length.tag;
						if (eng) {
							let len = this.rev.wikiAlb.substring(length.ix);
							len = len.split('\n')[0].trim();
							this.rev.wikiAlb = this.rev.wikiAlb.replace(RegExp($Bio.regexEscape(len)), '');
						}
					}
				}
			}
		}

		if ((panelBio.style.inclTrackRev == 1 || pptBio.sourceAll) && pptBio.autoOptimiseText) {
			const f = this.rev.wikiAlb.indexOf('==');
			if (f != -1) {
				const ix = this.rev.wikiAlb.lastIndexOf('Album Genres: ');
				let genre = '';
				if (ix != -1) {
					genre = this.rev.wikiAlb.substring(ix);
					genre = genre.split('\n')[0].trim();
				}
				this.rev.wikiAlb = this.add([genre], this.rev.wikiAlb.slice(0, f).trim());
			}
		}
		this.rev.wiki = this.rev.wikiAlb;
		let genrePrefix = 'Track Genre: ';
		let needTrackSubHeading = false;
		if (!pptBio.classicalMusicMode || !foundComp) {
			if (panelBio.style.inclTrackRev) {
				if (trackRev && trackRev[trk]) {
					const o = trackRev[trk];
					let releaseDate = $Bio.getProp(o, 'date', '');
					if (releaseDate) releaseDate = `Release Date: ${releaseDate}`;
					let composer = $Bio.getProp(o, 'composer', []).join('\u200b, ');
					if (composer) {
						writer = o.composer.length > 1 ? 'Composers: ' : 'Composer: ';
						composer = writer + composer;
					}

					const lang = $Bio.getProp(o, 'lang', '');
					const en = lang == 'EN';
					let label = 'Duration: ';
					if (en) {
						length = $Bio.getProp(o, 'length', '');
					} else if (panelBio.summary.other) { // static read
						const trackLfmRev = $Bio.jsonParse(panelBio.getPth('track', panelBio.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foLfmRev', true).pth, false, 'file');
						if (trackLfmRev && trackLfmRev[trk]) {
							length = $Bio.getProp(trackLfmRev[trk], 'length', '');
							if (length) {
								const ix = cfg.lang.arr.indexOf(lang);
								if (ix != -1) label = this.rev.length[ix];
							}
						}
					}
					if (length) length = (panelBio.summary.other ? label : 'Length: ') + length;
					let wiki = $Bio.getProp(o, 'wiki', '');
					const showGenres = !pptBio.autoOptimiseText || !this.rev.wikiAlb;
					if (showGenres) {
						let genres = $Bio.getProp(o, 'genre', []);
						if (genres.length) {
							if (genres.length > 1) genrePrefix = 'Track Genres: ';
							genres = genrePrefix + genres.join('\u200b, ');
							wiki = this.add([genres], wiki);
						}
					}
					if (pptBio.expandLists) {
						wiki = this.add([wiki], composer);
						wiki = this.add([wiki], releaseDate);
					} else {
						wiki = this.add([wiki], releaseDate);
						wiki = composer && wiki ? composer + (releaseDate ? '\r\n' : '\r\n\r\n') + wiki : composer || wiki;
					}
					if (this.rev.wikiAlb || (!panelBio.summary.show || !panelBio.summary.other) && length) wiki = this.add([length], wiki);
					if (wiki) {
						if (pptBio.trackHeading == 1 && (this.rev.wikiAlb || !pptBio.heading) || pptBio.trackHeading == 2) {
							this.rev.wikiTrackHeading = false;
							if (this.rev.wikiAlb) {
								trackRev = `!\u00a6${this.tf(pptBio.trackSubHeading, pptBio.artistView, true)}\r\n\r\n${wiki}`;
							} else {
								trackRev = wiki;
								needTrackSubHeading = true;
							}
						} else {
							this.rev.wikiTrackHeading = true;
							trackRev = wiki;
						}
						if (pptBio.sourceAll && pptBio.autoOptimiseText) {
							const f = trackRev.indexOf('==');
							if (f != -1) {
								const ix = trackRev.lastIndexOf('Track Genres: ');
								let genre = '';
								if (ix != -1) {
									genre = trackRev.substring(ix);
									genre = genre.split('\n')[0].trim();
								}
								trackRev = this.add([genre], trackRev.slice(0, f).trim());
							}
						}
						this.rev.wiki = this.add([trackRev], this.rev.wikiAlb);
					} else {
						this.rev.wikiTrackHeading = panelBio.style.inclTrackRev == 2;
					}
				} else {
					this.rev.wikiTrackHeading = panelBio.style.inclTrackRev == 2;
				}
			}
		}  else {
			this.rev.wikiTrackHeading = false;
		}

		this.rev.wiki = this.rev.wiki.replace(/Wikipedia language:\s[A-Z]{2}/, '');
		this.rev.wiki = this.formatText('wikiRev', this.rev.wiki, panelBio.summary.genre ? { limit: 6, list: true, key: this.rev.wikiAlb ? 'Album Genres: ' : genrePrefix } : {}, panelBio.summary.other && !this.rev.wikiAlb ? { list: true, key: writer, prefix: true, suffix: true } : {}, panelBio.summary.date ? (this.rev.wikiAlb ? (albReleaseDate ? { str: albReleaseDate } : (eng ? { key: this.rev.releaseDate } : '')) : { key: this.rev.releaseDate }) : {}, panelBio.summary.other && !this.rev.wikiAlb ? (length ? { str: length } : {}) : { str: albLength }, '', '', '', checkGenre.singleGenre).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (needTrackSubHeading) this.rev.wiki = `!\u00a6${this.tf(pptBio.trackSubHeading, pptBio.artistView, true)}\r\n\r\n${this.rev.wiki}`;
		if (!this.rev.wiki) butBio.check();
	}
}
