'use strict';

class BioText {
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
		this.countryCodes = `${bioCfg.storageFolder}country_codes.json`;
		this.cur = [];
		this.cur_artist = '';
		this.calc = true;
		this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.font = { main: '' };
		this.get = 1;
		this.heading = '';
		this.local = $Bio.file('C:\\check_local\\1450343922.txt');
		this.l = DT_NOPREFIX;
		this.lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.lp = DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.c = [this.lc, DT_RIGHT | this.lc];
		this.ncc = DT_CENTER | DT_VCENTER | DT_NOCLIP | DT_WORDBREAK | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.tc = DT_CENTER | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.na = '';
		this.newText = false;
		this.repaint = true;
		this.textUpdate = 0;
		this.track = '';
		this.trackartist = '';

		this.topTags = ['Tags', 'Tags', 'Tags', 'Tags', 'Tag', '\u30bf\u30b0', 'Tagi', 'Tags', '\u0422\u0435\u0433\u0438', 'Taggar', 'Etiketler', '\u6807\u7b7e'];

		bioSet.sourceHeading = $Bio.clamp(bioSet.sourceHeading, 0, 2);
		bioSet.trackHeading = $Bio.clamp(bioSet.trackHeading, 0, 2);

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
			fallbackText: bioSet.bioFallbackText.split('|'),
			flag: null,
			flagCode: '',
			flagCountry: '',
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
				am: bioSet.sourcebio == 0,
				lfm: bioSet.sourcebio == 1,
				wiki: bioSet.sourcebio == 2,
				txt: bioSet.sourcebio == 3
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
			am: [bioCfg.amDisplayName, `${bioCfg.amDisplayName} ${this.bio.lang[bioCfg.lang.ix]}`],
			lfm: [bioCfg.lfmDisplayName, `${bioCfg.lfmDisplayName} ${this.bio.lang[bioCfg.lang.ix]}`],
			wiki: [bioCfg.wikiDisplayName, `${bioCfg.wikiDisplayName} ${this.bio.lang[bioCfg.lang.ix]}`],
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

		this.logo = {
			fonts: ['Arial Black', 'Bauhaus 93', 'Blackadder ITC', 'Brush Script MT', 'Castellar', 'Colonna MT', 'Comic Sans MS', 'DomCasual BT', 'Forte', 'Freestyle Script', 'Harrington', 'Imprint MT Shadow', 'Informal Roman', 'Ink Free', 'Jokerman', 'Lucida Calligraphy', 'Lucida Handwriting', 'Magneto', 'Matura MT Script Capitals', 'Mistral', 'Monotype Corsiva', 'MV Boli', 'Old English Text MT', 'Pristina', 'Ravie', 'Script MT Bold', 'Segoe Print', 'Segoe Script', 'Segoe UI Black', 'Showcard Gothic', 'Snap ITC', 'Tango BT', 'Tempus Sans ITC', 'Viner Hand ITC', 'Vivaldi', 'Vladimir Script'],
			id: '',
			img: null,
			show: false,
			x: 20,
			y: 20
		}
		this.logo.fonts = this.logo.fonts.filter(v => utils.CheckFont(v));

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
			fallbackText: bioSet.revFallbackText.split('|'),
			flag: null,
			flagCode: '',
			flagCountry: '',
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
				am: bioSet.sourcerev == 0,
				lfm: bioSet.sourcerev == 1,
				wiki: bioSet.sourcerev == 2,
				txt: bioSet.sourcerev == 3
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
			y: Math.round(Math.max(1, bio.ui.font.main_h * 0.05))
		};

		this.rev.subhead = {
			am: [bioCfg.amDisplayName, `${bioCfg.amDisplayName} ${this.rev.lang[bioCfg.lang.ix]}`],
			lfm: [bioCfg.lfmDisplayName, `${bioCfg.lfmDisplayName} ${this.rev.lang[bioCfg.lang.ix]}`],
			wiki: [bioCfg.wikiDisplayName, `${bioCfg.wikiDisplayName} ${this.rev.lang[bioCfg.lang.ix]}`],
			txt: ['textreader', 'textreader']
		};

		this.currentTrackTags = $Bio.debounce(() => {
			if (!$Bio.server) return;
			const handle1 = $Bio.handle(bio.panel.id.focus);
			if (handle1) bio.tag.write(new FbMetadbHandleList([handle1]), true, bio.panel.id.focus);
			if (bio.tag.force) {
				const handle2 = $Bio.handle(!bio.panel.id.focus);
				const handlesSame = handle1 && handle2 && handle1.Compare(handle2);
				if (handle2 && !handlesSame) bio.tag.write(new FbMetadbHandleList([handle2]), true, !bio.panel.id.focus);
			}
		}, 2000, {
			leading: true,
			trailing: true
		});
		this.loadReader();
	}

	// * METHODS * //

	activateTooltip(value, type) {
		if (bioTooltip.Text == value && [this.rev.ix == this.rev.cur_ix, this.bio.ix == this.bio.cur_ix][type]) return;
		bioTooltip.Text = value;
		bioTooltip.Activate();
	}

	add(items, text) {
		items.forEach(v => text = text && v ? `${text}\r\n\r\n${v}` : text || v);
		return text;
	}

	albCalc() {
		if (!this.rev.text.length || bioSet.img_only || this.lyricsDisplayed()) return;
		const font = !(this.reader.rev.txtLyrics || this.rev.loaded.txt && this.reader.rev.nowplaying) || bioSet.sourceAll ? bio.ui.font.main : bio.ui.font.lyrics;
		let j = 0;
		this.line.h.rev = this.rev.loaded.txt && !bioSet.sourceAll && this.reader.rev.props ? bio.ui.font.main_h + 1 * $Bio.scale : !this.reader.rev.txtLyrics || bioSet.sourceAll ? bio.ui.font.main_h : bio.ui.font.lyrics_h + 4 * $Bio.scale;
		this.rev.arr = [];

		$Bio.gr(1, 1, false, g => {
			for (let k = 0; k < this.rev.text.length; k++) {
				let arr = [];
				let l = [];
				this.rev.summaryEnd = 0;
				let v = this.rev.text[k];
				if (bio.panel.style.inclTrackRev && !$Bio.isArray(v)) {
					const ti = v.match(/!\u00a6.+?$/gm);
					if (ti) {
						ti.forEach(w => {
							if (g.CalcTextWidth(w, bio.ui.font.subHeadTrack) > bio.panel.text.w) {
								const new_ti = `${g.EstimateLineWrap(w, bio.ui.font.subHeadTrack, bio.panel.text.w - g.CalcTextWidth('... ', bio.ui.font.subHeadTrack))[0]}...`;
								v = v.replace(RegExp($Bio.regexEscape(w)), new_ti);
							}
						});
					}
				}
				if (!bio.panel.summary.show || !v.includes('\u00a6End\u00a6')) {
					if (!$Bio.isArray(v)) {
						if (v) {
							l = g.EstimateLineWrap(v, font, bio.panel.text.w);
							for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						}
					} else if (!this.isLyricsArr('rev', v)) {
						arr = arr.concat(JSON.parse(JSON.stringify(v)));
					}
				} else {
					const revText = v.split('\u00a6End\u00a6');
					const revSummary = revText[0].trim();
					const revMain = revText[1].trim();
					if (revSummary) {
						l = g.EstimateLineWrap(revSummary, bio.ui.font.summary, bio.panel.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						for (let i = 0; i < arr.length; i++) arr[i].text = arr[i].text.replace(/^\u2219\s|^\|\s+/, '').replace(/\s*\|$/, '');
						this.rev.summaryEnd = arr.length;
						if (revMain) arr.push({ text: '' });
					}
					if (revMain) {
						l = g.EstimateLineWrap(revMain, font, bio.panel.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
					}
				}

				const y = this.rev.loaded.txt && this.reader.rev.nowplaying && !bioSet.sourceAll && bioSet.vCenter ? Math.max(bio.panel.text.t + (bio.panel.text.h - arr.length * this.line.h.rev) / 2, bio.panel.text.t) : bio.panel.text.t;
				arr.forEach((v, i, ary) => {
					if (v.sectionHeading) j = 0;
					v.align = v.property ? (bioSet.rowStripes ? this.lc : this.lp) : !(this.reader.rev.txtLyrics || this.rev.loaded.txt && this.reader.rev.nowplaying && bioSet.hCenter) || bioSet.sourceAll ? this.l : this.cc;
					v.col = v.property && v.sectionHeading ? bio.ui.col.accent : this.rev.subHeading && !i ? bio.ui.col.source : i < this.rev.summaryEnd ? bio.ui.col.summary : bio.ui.col.text;
					v.dropShadowLevel = !(this.reader.rev.txtLyrics || this.rev.loaded.txt && this.reader.rev.nowplaying) || bioSet.sourceAll ? false : bioSet.dropShadowLevel;
					v.dropNegativeShadowLevel = v.dropShadowLevel && v.dropShadowLevel > 1 ? Math.floor(v.dropShadowLevel / 2) : 0;
					v.font = !this.rev.subHeading || i ? (i < this.rev.summaryEnd ? bio.ui.font.summary : font) : bio.ui.font.subHeadSource;
					v.h1 = this.line.h.rev;
					v.h2 = this.line.h.rev + 1;
					$Bio.source.amLfmWikiTxt.forEach((w, i) => {
						v[`${w}Line`] = (!v.property ? v.text : v.name) == this.rev.subhead[w][1] && !(this.ratingPos.line && bio.panel.summary.show);
						if (v[`${w}Line`]) {
							const v_w = g.CalcTextWidth(`${v.text} `, this.ratingPos.line ? bio.ui.font.main : bio.ui.font.subHeadSource);
							v[`${w}LineX1`] = i < 2 ? bio.panel.text.l + v_w + (this.rating[w] >= 0 && (this.ratingPos.subHeading || this.ratingPos.line) ? bio.but.rating.w2 : 0) + this.bio.sp : bio.panel.text.l + this.rev[`${w}_w`].nohd + this.bio.sp; // noHd
							v[`${w}LineX2`] = Math.max(v[`${w}LineX1`], bio.panel.text.l + bio.panel.text.w);
						}
					});
					v.offset = 0;
					v.composersTooltip = this.rev.composersTooltip;
					v.composers_tt_needed = v.composersTooltip && i < this.rev.summaryEnd && v.text.startsWith('Composers: ');
					this.formatItemProperties(v, j);
					v.subHeading = this.rev.subHeading && !i ? this.rev.subHeading : 0;
					['am', 'lfm'].forEach(w => {
						v[`${w}SubHeadingRating`] = this.ratingPos.subHeading && v.text == this.rev.subhead[w][bioSet.heading ? 0 : 1] && this.rating[w] >= 0;
						if (v[`${w}SubHeadingRating`]) v[`${w}SubHeadingRatingX`] = bio.panel.text.l + (bioSet.heading ? this.rev[`${w}_w`].hd : this.rev[`${w}_w`].nohd);

						v[`${w}LineRating`] = this.ratingPos.line && this.rating[w] >= 0 && v.text == this.rev.subhead[w][bioSet.heading ? 0 : 1];
						if (v[`${w}LineRating`]) {
							const v_w = g.CalcTextWidth(`${v.text} `, bio.ui.font.main);
							v[`${w}LineRatingX`] = bio.panel.text.l + v_w;
						}
					});
					if (v.text.startsWith('!\u00a6')) {
						v.col = bio.ui.col.track;
						v.font = bio.ui.font.subHeadTrack;
						v.song = true;
						const songLine = !bioSet.heading ? (bio.panel.style.inclTrackRev != 2 ? true : !ary[0].subHeading) : false;
						if (songLine) {
							v.songLine = true;
							const v_w = g.CalcTextWidth(`${v.text} `, bio.ui.font.subHeadTrack)
							v.songX1 = bio.panel.text.l + v_w;
							v.songX2 = Math.max(v.songX1, bio.panel.text.l + bio.panel.text.w);
						}
						v.text = v.text.replace('!\u00a6', '');
					}
					if ((this.rev.loaded.wiki || bioSet.sourceAll) && (v.text.startsWith('==') || v.text.endsWith('=='))) {
						v.font = bio.ui.font.subHeadWiki;
						v.offset = bio.ui.font.main_h * 0.125;
						v.sectionHeading = true;
					}
					if (this.rev.subHeading && !i && bioSet.heading) v.offset = bio.ui.font.main_h * 0.2;
					v.y = y;
					j++;
				});

				if (this.rev.arr.length && arr.length) this.rev.arr.push({ text: '' });
				this.rev.arr = this.rev.arr.concat(arr);
				this.rev.ix = -1;
			}
		});

		this.tidyWiki('rev');
		bio.but.refresh(true);
		bio.alb_scrollbar.reset();
		this.line.drawn.rev = this.reader.rev.txtLyrics && !bioSet.sourceAll || this.rev.loaded.txt && !bioSet.sourceAll && this.reader.rev.props ? Math.floor(bio.panel.lines_drawn * bio.ui.font.main_h / this.line.h.rev) : bio.panel.lines_drawn;
		bio.alb_scrollbar.metrics(bio.panel.sbar.x, bio.panel.sbar.y, bio.ui.sbar.w, bio.panel.sbar.h, this.line.drawn.rev, this.line.h.rev, false);
		bio.alb_scrollbar.setRows(this.rev.arr.length);
		if (this.ratingPos.subHeading || this.ratingPos.line) this.rating.y = Math.round((bio.ui.font.main_h - bio.but.rating.h1 / 2) / 1.8);
		this.getScrollPos();
	}

	albumFlush() {
		this.mod.amRev = this.rev.am = this.rev.lfm = this.mod.lfmRev = this.rev.wiki = this.mod.wikiRev = this.rev.txt = '';
		this.mod.curAmRev = this.mod.curLfmRev = this.mod.curWikiRev = 1;
		this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = this.done.wikiRev = false;
		this.rev.text = [];
		bio.but.setScrollBtnsHide();
	}

	albumReset(upd) {
		if (bio.panel.lock) return;
		this.id.curAlbum = this.id.album;
		this.id.album = bio.name.albID(bio.panel.id.focus, 'simple');
		const new_album = this.id.album != this.id.curAlbum;
		if (new_album) this.id.alb = '';

		let new_composition = false;
		if (bioSet.classicalMusicMode) {
			this.id.curComp = this.id.composition;
			this.id.composition = $Bio.eval(bioCfg.tf.artist + bioCfg.tf.albumArtist + bioCfg.tf.composition, bio.panel.id.focus);
			new_composition = this.id.composition != this.id.curComp;
		}

		if (new_album || new_composition || upd) {
			this.album = bio.name.album(bio.panel.id.focus);
			this.albumartist = bio.name.albumArtist(bio.panel.id.focus);
			this.composition = bio.name.composition(bio.panel.id.focus);
			this.albumFlush();
			this.rev.lookUp = false;
		}
		if (bio.panel.style.inclTrackRev) {
			this.id.curTr = this.id.tr;
			this.id.tr = bio.name.trackID(bio.panel.id.focus);
			const new_track = this.id.tr != this.id.curTr;
			if (new_track) {
				this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = this.done.wikiRev = false;
				if (bio.panel.style.inclTrackRev == 1 && !new_album) this.logScrollPos('rev');
			}
		}
	}

	amBio(a) {
		const aBio = bio.panel.getPth('bio', bio.panel.id.focus, this.artist, '', '', bioCfg.supCache, a, '', '', 'foAmBio', true).pth;
		if (!$Bio.file(aBio)) return;
		this.mod.amBio = $Bio.lastModified(aBio) || 0;
		if (this.mod.amBio == this.mod.curAmBio) return;
		this.bio.am = $Bio.open(aBio).trim();
		this.bio.am = this.bio.am.replace(/, Jr\./g, ' Jr.');
		this.bio.am = this.formatText('amBio', this.bio.am, bio.panel.summary.genre ? { limit: 6, list: true, key: 'Genre: ' } : {}, !bio.panel.summary.other ? {} : { list: true, key: 'Group Members: ', prefix: true, suffix: true }, bio.panel.summary.date ? { key: 'Formed: |Born: ' } : {}, bio.panel.summary.date ? { key: 'Died: ' } : {}, bio.panel.summary.date ? { key: 'Active: ' } : {}).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
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

		if (!bioSet.classicalMusicMode || bio.panel.alb.ix) {
			aRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.album, '', bioCfg.supCache, a, aa, l, 'foAmRev', true).pth;
		} else if (!bio.panel.alb.ix) {
			aRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.composition, '', bioCfg.supCache, a, aa, c, 'foAmRev', true).pth;
			if ($Bio.file(aRev)) foundComp = true;
		}
		this.rev.amFallback = !foundComp;
		if (!$Bio.file(aRev) && bioSet.classicalAlbFallback && !bio.panel.alb.ix && bio.panel.style.inclTrackRev != 2) {
			aRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.album, '', bioCfg.supCache, a, aa, l, 'foAmRev', true).pth;
		}
		this.avail.amalb = $Bio.file(aRev) ? 0 : -1;
		if (this.avail.amalb == -1) {
			this.rating.am = -1;
			bio.but.check();
			if (!bio.panel.style.inclTrackRev || bioSet.classicalMusicMode && !bioSet.classicalAlbFallback) {
				this.rev.amAlb = '';
				return;
			}
		}

		trk = this.track.toLowerCase();
		trackRev = $Bio.jsonParse(bio.panel.getPth('track', bio.panel.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foAmRev', true).pth, false, 'file');
		this.avail.amtrk = this.isTrackRevAvail('am', trackRev[trk]);
		if (bio.panel.style.inclTrackRev && trackRev[trk] && trackRev[trk].update) am_tr_mod = trackRev[trk].update;

		this.mod.amRev = ($Bio.lastModified(aRev) || 0) + (am_tr_mod || 0);
		if (this.mod.amRev == this.mod.curAmRev) return;
		this.rev.amAlb = '';

		if (bio.panel.style.inclTrackRev != 2 || foundComp) this.rev.amAlb = $Bio.open(aRev).trim();
		this.rev.amAlb = this.rev.amAlb.replace('Genre: ', 'Album Genres: ');
		this.newText = true;
		this.mod.curAmRev = this.mod.amRev;
		this.rating.am = -1;
		const b = this.rev.amAlb.indexOf('>> Album rating: ') + 17;
		const f = this.rev.amAlb.indexOf(' <<');
		if (bio.panel.style.inclTrackRev != 2 || foundComp) {
			if (bioSet.amRating) {
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
		if (!bioSet.classicalMusicMode || !foundComp) {
			if (bio.panel.style.inclTrackRev) {
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
					const showGenres = !bioSet.autoOptimiseText || !this.rev.amAlb;
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
						if (bioSet.trackHeading == 1 && (this.rev.amAlb || !bioSet.heading) || bioSet.trackHeading == 2) {
							this.rev.amTrackHeading = false;
							if (this.rev.amAlb) {
								trackRev =  `!\u00a6${this.tf(bioSet.trackSubHeading, bioSet.artistView, true)}\r\n\r\n${wiki}`;
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
						this.rev.amTrackHeading = bio.panel.style.inclTrackRev == 2;
					}
				} else {
					this.rev.amTrackHeading = bio.panel.style.inclTrackRev == 2;
				}
			}
		} else this.rev.amTrackHeading = false;
		this.rev.am = this.formatText('amRev', this.rev.am, bio.panel.summary.genre ? { limit: 6, list: true, key: this.rev.amAlb ? 'Album Genres: ' : 'Track Genres: ' } : {}, !bio.panel.summary.other ? {} : { limit: 6, list: true, key: this.rev.amAlb ? 'Album Moods: ' : 'Track Moods: ', prefix: true }, bio.panel.summary.date ? { key: this.rev.amAlb ? 'Release Date: ' : 'Release Year: ' } : {}, { str: this.rating.amStr }).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (needTrackSubHeading) this.rev.am = `!\u00a6${this.tf(bioSet.trackSubHeading, bioSet.artistView, true)}\r\n\r\n${this.rev.am}`;
		if (!this.rev.am) bio.but.check();
	}

	artCalc() {
		if (!this.bio.text.length || bioSet.img_only || this.lyricsDisplayed()) return;
		const font = !(this.reader.bio.txtLyrics || this.bio.loaded.txt && this.reader.bio.nowplaying) || bioSet.sourceAll ? bio.ui.font.main : bio.ui.font.lyrics;
		let j = 0;
		this.line.h.bio = this.bio.loaded.txt && !bioSet.sourceAll && this.reader.bio.props ? bio.ui.font.main_h + 1 * $Bio.scale : !this.reader.bio.txtLyrics || bioSet.sourceAll ? bio.ui.font.main_h : bio.ui.font.lyrics_h + 4 * $Bio.scale;
		this.bio.arr = [];

		this.bio.text.forEach(v => {
			let l = [];
			this.bio.summaryEnd = 0;
			let arr = [];
			$Bio.gr(1, 1, false, g => {
				if (!bio.panel.summary.show || !v.includes('\u00a6End\u00a6')) {
					if (!$Bio.isArray(v)) {
						if (v) {
							l = g.EstimateLineWrap(v, font, bio.panel.text.w);
							for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						}
					} else if (!this.isLyricsArr('bio', v)) {
						arr = arr.concat(JSON.parse(JSON.stringify(v)));
					}
				} else {
					const bioText = v.split('\u00a6End\u00a6');
					const bioSummary = bioText[0].trim();
					const bioMain = bioText[1].trim();
					if (bioSummary) {
						l = g.EstimateLineWrap(bioSummary, bio.ui.font.summary, bio.panel.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
						for (let i = 0; i < arr.length; i++) arr[i].text = arr[i].text.replace(/^\u2219\s|^\|\s+/, '').replace(/\s*\|$/, '');
						this.bio.summaryEnd = arr.length;
						if (bioMain) arr.push({ text: '' });
					}
					if (bioMain) {
						l = g.EstimateLineWrap(bioMain, font, bio.panel.text.w);
						for (let i = 0; i < l.length; i += 2) arr.push({ text: l[i].trim() });
					}
				}
			});

			const y = this.bio.loaded.txt && this.reader.bio.nowplaying && !bioSet.sourceAll && bioSet.vCenter ? Math.max(bio.panel.text.t + (bio.panel.text.h - arr.length * this.line.h.bio) / 2, bio.panel.text.t) : bio.panel.text.t;
			arr.forEach((v, i) => {
				if (v.sectionHeading) j = 0;
				v.align = v.property ? (bioSet.rowStripes ? this.lc : this.lp) : !(this.reader.bio.txtLyrics || this.bio.loaded.txt && this.reader.bio.nowplaying && bioSet.hCenter) || bioSet.sourceAll ? this.l : this.cc;
				v.col = v.property && v.sectionHeading ? bio.ui.col.accent : this.bio.subHeading && !i ? bio.ui.col.source : i < this.bio.summaryEnd ? bio.ui.col.summary : bio.ui.col.text;
				v.dropShadowLevel = !(this.reader.bio.txtLyrics || this.bio.loaded.txt && this.reader.bio.nowplaying) || bioSet.sourceAll ? false : bioSet.dropShadowLevel;
				v.dropNegativeShadowLevel = v.dropShadowLevel && v.dropShadowLevel > 1 ? Math.floor(v.dropShadowLevel / 2) : 0;
				v.font = !this.bio.subHeading || i ? (i < this.bio.summaryEnd ? bio.ui.font.summary : font) : bio.ui.font.subHeadSource;
				v.h1 = this.line.h.bio;
				v.h2 = this.line.h.bio + 1;
				$Bio.source.amLfmWikiTxt.forEach(w => {
					v[`${w}Line`] = (!v.property ? v.text : v.name) == this.bio.subhead[w][1];
					if (v[`${w}Line`]) {
						v[`${w}LineX1`] = bio.panel.text.l + this.bio[`${w}_w`].nohd + this.bio.sp;
						v[`${w}LineX2`] = Math.max(v[`${w}LineX1`], bio.panel.text.l + bio.panel.text.w);
					}
				});
				v.offset = 0;
				v.membersTooltip = this.bio.membersTooltip;
				v.members_tt_needed = v.membersTooltip && i < this.bio.summaryEnd && v.text.startsWith('Members: ');
				this.formatItemProperties(v, j);
				if ((this.bio.loaded.wiki || bioSet.sourceAll) && (v.text.startsWith('==') || v.text.endsWith('=='))) {
					v.font = bio.ui.font.subHeadWiki;
					v.offset = bio.ui.font.main_h * 0.125;
					v.sectionHeading = true;
				}
				if (this.bio.subHeading && !i && bioSet.heading) v.offset = bio.ui.font.main_h * 0.2;
				v.y = y;
				j++;
			});
			if (this.bio.arr.length && arr.length) this.bio.arr.push({ text: '' });
			this.bio.arr = this.bio.arr.concat(arr);
		});

		this.tidyWiki('bio');
		bio.but.refresh(true);
		bio.art_scrollbar.reset();
		this.line.drawn.bio = this.reader.bio.txtLyrics && !bioSet.sourceAll || this.bio.loaded.txt && !bioSet.sourceAll && this.reader.bio.props ? Math.floor(bio.panel.lines_drawn * bio.ui.font.main_h / this.line.h.bio) : bio.panel.lines_drawn;
		bio.art_scrollbar.metrics(bio.panel.sbar.x, bio.panel.sbar.y, bio.ui.sbar.w, bio.panel.sbar.h, this.line.drawn.bio, this.line.h.bio, false);
		bio.art_scrollbar.setRows(this.bio.arr.length);
		this.getScrollPos();
	}

	artistFlush() {
		this.done.amBio = this.done.lfmBio = this.done.wikiBio = false;
		this.mod.amBio = this.bio.am = this.mod.lfmBio = this.bio.lfm = this.mod.wikiBio = this.bio.wiki = this.bio.txt = '';
		this.mod.curAmBio = this.mod.curLfmBio = this.mod.curWikiBio = '1';
		this.bio.text = [];
		bio.but.setScrollBtnsHide();
	}

	artistReset(upd) {
		if (bio.panel.artistsSame() || bio.panel.lock) return;
		this.cur_artist = this.artist;
		this.artist = bio.name.artist(bio.panel.id.focus);
		const new_artist = this.artist != this.cur_artist;
		if (new_artist || upd) {
			this.bio.lookUp = false;
			this.artistFlush();
		}
	}

	bioPth(n) {
		if (bioSet.img_only) return ['', '', false, false];
		return bio.panel.getPth('bio', bio.panel.id.focus, this.artist, '', '', bioCfg.supCache, $Bio.clean(this.artist), '', '', `fo${n}Bio`, false);
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
		this.reader[n].txtLyrics = this.reader[n].lyrics && (bioSet.sourceAll || (this.isSynced(lyr) ? !bioSet.scrollSynced : !bioSet.scrollUnsynced));
	}

	checkNewLine(sub, n) {
		if (!sub[n]) return '';
		let cur_str = '';
		let w = 0;
		for (let i = 1; i < n; i++) {
			cur_str = cur_str && sub[i] ? `${cur_str}  |  ${sub[i]}` : cur_str || sub[i];
		}
		$Bio.gr(1, 1, false, g => w = g.CalcTextWidth(cur_str, bio.ui.font.summary));
		return sub[n] = cur_str && w < bio.panel.text.w ? `\r\n${sub[n]}` : sub[n];
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
			let w = g.CalcTextWidth(cur_str, bio.ui.font.summary);
			if (w < bio.panel.text.w) return sub[n];

			cur_str = '';
			for (let i = 1; i < n; i++) {
				cur_str = cur_str && sub[i] ? `${cur_str}  |  ${sub[i]}` : cur_str || sub[i];
			}

			w = g.CalcTextWidth(cur_str, bio.ui.font.summary);
			const precedingSingleLineStr = w < bio.panel.text.w;
			return precedingSingleLineStr ? (w > bio.panel.text.w ? sub[n] : `\r\n${sub[n]}`) : sub[n];
		});
	}

	check_tooltip(item, x, y, artistView, line_h) {
		if (!item) return;
		const onLine = item.tt && y >= item.tt.y && y <= item.tt.y + line_h;
		const traceName = onLine && item.tt.needed1 && x >= item.tt.x1 && x <= item.tt.x1 + item.tt.w1;
		const traceValue = onLine && item.tt.needed2 && x >= item.tt.x2 && x <= item.tt.x2 + item.tt.w2;
		const text = traceName ? item.name || item.membersTooltip || item.composersTooltip : traceValue ? item.value : '';
		if (text != bioTooltip.Text) this.deactivateTooltip();
		if (!traceName && !traceValue || !item.tt.needed1 && !item.tt.needed2) {
			this.deactivateTooltip();
			return;
		}
		this.activateTooltip(text, artistView ? 1 : 0);
		bio.timer.tooltip();
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
		if (!bioTooltip.Text || bio.but.traceBtn) return;
		bioTooltip.Text = '';
		bioTooltip.Deactivate();
	}

	different(a, b) {
		return JSON.stringify(a) != JSON.stringify(b);
	}

	draw(gr) {
		if (!bioSet.img_only) {
			this.getTxtFallback();
			if (bioSet.typeOverlay && bioSet.style > 3 && !bioSet.img_only && !bioSet.text_only) {
				gr.SetSmoothingMode(2);
				let o = 0;
				switch (bioSet.typeOverlay) {
					case 1:
						gr.FillSolidRect(bio.panel.tbox.l - 1, bio.panel.tbox.t - 1, bio.panel.tbox.w + 1, bio.panel.tbox.h + 1, bio.ui.col.rectOv);
						break;
					case 2:
						o = Math.round(bio.ui.overlay.borderWidth / 2);
						gr.FillSolidRect(bio.panel.tbox.l + o, bio.panel.tbox.t + o, bio.panel.tbox.w - o * 2, bio.panel.tbox.h - o * 2, bio.ui.col.rectOv);
						gr.DrawRect(bio.panel.tbox.l + o, bio.panel.tbox.t + o, bio.panel.tbox.w - bio.ui.overlay.borderWidth - 1, bio.panel.tbox.h - bio.ui.overlay.borderWidth - 1, bio.ui.overlay.borderWidth, bio.ui.col.rectOvBor);
						break;
					case 3:
						gr.FillRoundRect(bio.panel.tbox.l, bio.panel.tbox.t, bio.panel.tbox.w, bio.panel.tbox.h, bio.panel.arc, bio.panel.arc, bio.ui.col.rectOv);
						break;
					case 4:
						o = Math.round(bio.ui.overlay.borderWidth / 2);
						gr.FillRoundRect(bio.panel.tbox.l + o, bio.panel.tbox.t + o, bio.panel.tbox.w - o * 2, bio.panel.tbox.h - o * 2, bio.panel.arc, bio.panel.arc, bio.ui.col.rectOv);
						gr.DrawRoundRect(bio.panel.tbox.l + o, bio.panel.tbox.t + o, bio.panel.tbox.w - bio.ui.overlay.borderWidth - 1, bio.panel.tbox.h - bio.ui.overlay.borderWidth - 1, bio.panel.arc, bio.panel.arc, bio.ui.overlay.borderWidth, bio.ui.col.rectOvBor);
						break;
				}
			}
			if (bioSet.artistView && this.bio.text.length && !this.lyricsDisplayed()) {
				const b = Math.max(Math.round(bio.art_scrollbar.delta / this.line.h.bio + 0.4), 0);
				const f = Math.min(b + this.line.drawn.bio, this.bio.arr.length);
				this.bio.drawn = 0;
				if (this.logo.show && this.logo.img) gr.DrawImage(this.logo.img, this.logo.x, this.logo.y, this.logo.img.Width, this.logo.img.Height, 0, 0, this.logo.img.Width, this.logo.img.Height, 0, 16);
				for (let i = b; i < f; i++) {
					const item = this.bio.arr[i];
					const item_y = item.h1 * i + item.y - bio.art_scrollbar.delta + SCALE(2);
					if (item_y < bio.panel.style.max_y) {
						this.bio.drawn++;
						const iy = Math.round(item_y + bio.ui.font.main_h / 2);
						if (!bioSet.heading) {
							$Bio.source.amLfmWikiTxt.forEach(v => {
								if (item[`${v}Line`]) gr.DrawLine(item[`${v}LineX1`], iy, item[`${v}LineX2`], iy, bio.ui.style.l_w, bio.ui.col.centerLine);
							});
						}
						if (!item.sectionHeading || (!item.property ? i < f - 2 : i < f - 1)) {
							if (!item.property) {
								if (item.dropNegativeShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, bio.ui.col.dropShadow, bio.panel.text.l - item.dropNegativeShadowLevel, item_y + item.offset, bio.panel.text.w, item.h2, item.align);
									gr.GdiDrawText(item.text, item.font, bio.ui.col.dropShadow, bio.panel.text.l, item_y - item.dropNegativeShadowLevel + item.offset, bio.panel.text.w, item.h2, item.align);
								}
								if (item.dropShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, bio.ui.col.dropShadow, bio.panel.text.l + item.dropShadowLevel, item_y + item.dropShadowLevel + item.offset, bio.panel.text.w, item.h2, item.align);
								}
								gr.GdiDrawText(item.text, item.font, item.col, bio.panel.text.l, item_y + item.offset, bio.panel.text.w, item.h2, item.align);
								if (item.members_tt_needed) this.checkTooltip(item, bio.panel.text.l, true, bio.panel.text.w, 0, 0, 0, item_y + item.offset);
							}
							else {
								if (item.rowStripe) gr.FillSolidRect(bio.panel.text.l, item_y + item.stripeOffset, bio.panel.text.w, item.h3, item.rowStripe);
								if (item.sectionLine) gr.DrawLine(item.sectionLineX1, iy, item.sectionLineX2, iy, bio.ui.style.l_w, bio.ui.col.sectionLine);
								gr.GdiDrawText(item.name, item.font, item.col, bio.panel.text.l, item_y + item.offset, this.reader.w.nameCol, item.h2, item.align);
								gr.GdiDrawText(item.value, item.font, item.col, bio.panel.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item_y + item.offset, this.reader.w.valueCol, item.h2, item.align);
								if (item.name_tt_needed || item.value_tt_needed) this.checkTooltip(item, bio.panel.text.l, item.name_tt_needed, this.reader.w.nameCol, bio.panel.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item.value_tt_needed, this.reader.w.valueCol, item_y + item.offset);
							}
						}
					}
				}
				if (bioSet.sbarShow) bio.art_scrollbar.draw(gr);
			}
			if (!bioSet.artistView && this.rev.text.length && !this.lyricsDisplayed()) {
				const b = Math.max(Math.round(bio.alb_scrollbar.delta / this.line.h.rev + 0.4), 0);
				const f = Math.min(b + this.line.drawn.rev, this.rev.arr.length);
				this.rev.drawn = 0;
				if (this.logo.show && this.logo.img) gr.DrawImage(this.logo.img, this.logo.x, this.logo.y, this.logo.img.Width, this.logo.img.Height, 0, 0, this.logo.img.Width, this.logo.img.Height, 0, 16);
				for (let i = b; i < f; i++) {
					const item = this.rev.arr[i];
					const item_y = item.h1 * i + item.y - bio.alb_scrollbar.delta + SCALE(2);
					if (item_y < bio.panel.style.max_y) {
						this.rev.drawn++;
						const iy = Math.round(item_y + bio.ui.font.main_h / 2);
						switch (true) {
							case this.ratingPos.subHeading:
							['am', 'lfm'].forEach(v => {
								if (item[`${v}SubHeadingRating`]) gr.DrawImage(bio.but.rating.images[this.rating[v]], item[`${v}SubHeadingRatingX`], item_y + this.rating.y + item.offset, bio.but.rating.w1 / 2, bio.but.rating.h1 / 2, 0, 0, bio.but.rating.w1, bio.but.rating.h1, 0, 255);
							});
							break;
						case this.ratingPos.line:
							['am', 'lfm'].forEach(v => {
								if (item[`${v}LineRating`]) gr.DrawImage(bio.but.rating.images[this.rating[v]], item[`${v}LineRatingX`], item_y + this.rating.y + item.offset, bio.but.rating.w1 / 2, bio.but.rating.h1 / 2, 0, 0, bio.but.rating.w1, bio.but.rating.h1, 0, 255);
							});
							break;
						}
						if (!bioSet.heading) {
							$Bio.source.amLfmWikiTxt.forEach(v => {
								if (item[`${v}Line`]) gr.DrawLine(item[`${v}LineX1`], iy, item[`${v}LineX2`], iy, bio.ui.style.l_w, bio.ui.col.centerLine);
							});
						}
						if (item.songLine) gr.DrawLine(item.songX1, iy, item.songX2, iy, bio.ui.style.l_w, bio.ui.col.centerLine);
						if (!item.sectionHeading || (!item.property ? i < f - 2 : i < f - 1)) {
							if (!item.property) {
								if (item.dropNegativeShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, bio.ui.col.dropShadow, bio.panel.text.l - item.dropNegativeShadowLevel, item_y + item.offset, bio.panel.text.w, item.h2, item.align);
									gr.GdiDrawText(item.text, item.font, bio.ui.col.dropShadow, bio.panel.text.l, item_y - item.dropNegativeShadowLevel + item.offset, bio.panel.text.w, item.h2, item.align);
								}
								if (item.dropShadowLevel) { // nowplaying & lyrics only
									gr.GdiDrawText(item.text, item.font, bio.ui.col.dropShadow, bio.panel.text.l + item.dropShadowLevel, item_y + item.dropShadowLevel + item.offset, bio.panel.text.w, item.h2, item.align);
								}
								gr.GdiDrawText(item.text, item.font, item.col, bio.panel.text.l, item_y + item.offset, bio.panel.text.w, item.h2, item.align);
								if (item.composers_tt_needed) this.checkTooltip(item, bio.panel.text.l, true, bio.panel.text.w, 0, 0, 0, item_y + item.offset);
							}
							else {
								if (item.rowStripe) gr.FillSolidRect(bio.panel.text.l, item_y + item.stripeOffset, bio.panel.text.w, item.h3, item.rowStripe);
								if (item.sectionLine) gr.DrawLine(item.sectionLineX1, iy, item.sectionLineX2, iy, bio.ui.style.l_w, bio.ui.col.sectionLine);
								gr.GdiDrawText(item.name, item.font, item.col, bio.panel.text.l, item_y + item.offset, this.reader.w.nameCol, item.h2, item.align);
								gr.GdiDrawText(item.value, item.font, item.col, bio.panel.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item_y + item.offset, this.reader.w.valueCol, item.h2, item.align);
								if (item.name_tt_needed || item.value_tt_needed) this.checkTooltip(item, bio.panel.text.l, item.name_tt_needed, this.reader.w.nameCol, bio.panel.text.l + this.reader.w.nameCol + this.reader.w.spaceCol, item.value_tt_needed, this.reader.w.valueCol, item_y + item.offset);
							}
						}
					}
				}
				if (bioSet.sbarShow) bio.alb_scrollbar.draw(gr);
			}
		}
	}

	expandLists(type, n) {
		const en = bioCfg.language == 'EN' || bioCfg.languageFallback;
		let items = [];
		switch (type) {
			case 'amBio':
				items = ['Genre: ', 'Group Members: '];
				break;
			case 'lfmBio': {
				const members = 'Members: |Mitglieder: |Miembros: |Membres: |Componenti: |\\u30e1\\u30f3\\u30d0\\u30fc: |Cz\\u0142onkowie: |Membros: |\\u0423\\u0447\\u0430\\u0441\\u0442\\u043d\\u0438\\u043a\\u0438: |Medlemmar: |\\u00dcyeler: |\\u6210\\u5458: ';
				const topTags = 'Top Tags: ';
				const topTracks = 'Top Tracks: |Top-Titel: |Temas m\\u00e1s escuchados: |Top titres: |Brani pi\\u00f9 ascoltati: |\\u4eba\\u6c17\\u30c8\\u30e9\\u30c3\\u30af: |Najpopularniejsze utwory: |Faixas principais: |\\u041b\\u0443\\u0447\\u0448\\u0438\\u0435 \\u043a\\u043e\\u043c\\u043f\\u043e\\u0437\\u0438\\u0446\\u0438\\u0438: |Toppl\\u00e5tar: |Pop\\u00fcler Par\\u00e7alar: |\\u6700\\u4f73\\u5355\\u66f2: ';
				items = [members, bio.panel.similarArtistsKey, bio.panel.topAlbumsKey, topTracks];
				if (!bio.panel.summary.genre) items.unshift(topTags);
				break;
			}
			case 'amRev':
				items = ['Album Genres: ', 'Album Moods: ', 'Album Themes: ', 'Composers: ', 'Track Moods: ', 'Track Themes: '];
				if (this.rev.amAlb || !bio.panel.summary.genre) items.unshift('Track Genres: ');
				break;
			case 'lfmRev':
				items = ['Top Tags: '];
				if (this.rev.lfmAlb || !bio.panel.summary.genre) items.unshift('Track Tags: ');
				break;
			case 'wikiBio':
				items = ['Genre: '];
				break;
			case 'wikiRev':
				items = ['Album Genres: ', 'Composers: '];
				if (this.rev.wikiAlb || !bio.panel.summary.genre) items.unshift('Track Genres: ');
				break;
		}

		$Bio.gr(1, 1, false, g => {
			items.forEach(v => {
				const w = bio.tag.getTag(n, v);
				const li = w.tag;
				if (li) {
					let list = `${w.label}\r\n`;
					li.forEach((v, i, arr) => {
						let nm = (en ? `${i + 1}. ` : '\u2022 ') + v;
							if (g.CalcTextWidth(nm, bio.ui.font.main) > bio.panel.text.w) {
								nm = `${g.EstimateLineWrap(nm, bio.ui.font.main, bio.panel.text.w - g.CalcTextWidth('... ', bio.ui.font.main))[0]}...`;
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
		let item = n == 'bio' ? v.pth.replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, '%BIO_ARTIST%') : v.pth.replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, '%BIO_ALBUMARTIST%');

		const a = $Bio.tfEscape(bio.name.artist(!v.lyrics ? bio.panel.id.focus : false, !!v.lyrics));
		const aa = $Bio.tfEscape(bio.name.albumArtist(!v.lyrics ? bio.panel.id.focus : false, !!v.lyrics));
		const l = $Bio.tfEscape(bio.name.album(!v.lyrics ? bio.panel.id.focus : false, !!v.lyrics));
		const tr = $Bio.tfEscape(bio.name.title(!v.lyrics ? bio.panel.id.focus : false, !!v.lyrics));
		item = item // substitue bio var + check advanced radio stream parser (tfBio & tfRev do lookUps not parser)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? '$&#@!%path%#@!' : '$&').replace(/%bio_artist%/gi, a)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? '$&#@!%path%#@!' : '$&').replace(/%bio_albumartist%/gi, aa)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? '$&#@!%path%#@!' : '$&').replace(/%bio_album%/gi, l)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? '$&#@!%path%#@!' : '$&').replace(/%bio_title%/gi, tr);

		const cleanFileName = (path) => { // WilB, move this helper to helpers.js for common usage!?
			const stripReservedChars = (filename) => filename.replace(/[<>:"/\\|?*]+/g, '_');
			const lastSlash = path.lastIndexOf('\\');
			const dirPath = path.substring(0, lastSlash + 1);
			const fileName = path.substring(lastSlash + 1);
			const safeFileName = stripReservedChars(fileName);
			return dirPath + safeFileName;
		};
		item = cleanFileName(item);

		switch (type) {
			case 0: pth = item.replace(/_\.(lrc|txt)$/, '.$1'); break;
			case 1: pth = item.replace(/\.(lrc|txt)$/, '_.$1'); break;
		}
		const pths = !v.lyrics ? [item] : [item, pth];
		return pths.some(w => {
			const wildCard = /[*?]/.test(w);
			if (!wildCard) {
				this[n].readerItem = bio.panel.cleanPth(w, !v.lyrics ? bio.panel.id.focus : false, !v.lyrics ? '' : 'lyr').slice(0, -1).replace(/#@!.*?#@!/g, '');
			} else {
				let p = bio.panel.cleanPth(w.replace(/\*/g, '@!@').replace(/\?/g, '!@!'), !v.lyrics ? bioSet.focus : false, !v.lyrics ? '' : 'lyr').slice(0, -1);
				p = p.replace(/@!@/g, '*').replace(/!@!/g, '?').replace(/#@!.*?#@!/g, '');
				const arr = utils.Glob(p);
				if (!arr.length) return false;
				this[n].readerItem = arr[0];
			}
			return $Bio.file(this[n].readerItem);
		});
	}

	formatItemProperties(v, j, g) {
		if (!v.property) return
		if (bioSet.rowStripes && !v.subHeading && !v.sectionHeading && v.name) {
			v.rowStripe = j % 2 == 0 ? bio.ui.col.rowStripes /*bio.ui.col.bg3*/ : bio.ui.col.bg2;
			const line_h = bioSet.artistView ? this.line.h.bio : this.line.h.rev;
			v.h3 = j % 2 == 0 ? line_h - 2 : line_h;
			v.stripeOffset = j % 2 == 0 ? 1 : 0;
		}
		if (bioSet.lineDividers && v.sectionHeading) {
			v.sectionLine = true;
			if (!g) {
				$Bio.gr(1, 1, false, g => {
					v.sectionLineX1 = bio.panel.text.l + g.CalcTextWidth(`${v.name}  `, bio.ui.font.main);
				});
			} else v.sectionLineX1 = bio.panel.text.l + g.CalcTextWidth(`${v.name}  `, bio.ui.font.main);
			v.sectionLineX2 = Math.max(v.sectionLineX1, bio.panel.text.l + bio.panel.text.w);
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
						if (bioSet.summaryCompact) {
							if (type == 'amBio') {
								let tt_needed = false;
								let members = '';
								if (/^Members:\s/.test(sub[n])) {
									membersFound = true;
									tt_needed = g.CalcTextWidth(sub[n], bio.ui.font.summary, true) > bio.panel.text.w;
									if (tt_needed) {
										members = g.EstimateLineWrap(sub[n], bio.ui.font.summary, bio.panel.text.w - g.CalcTextWidth('... ', bio.ui.font.summary))[0];
										members = `${members.replace(/\u2219\s?$/, '')}...`;
									}
								}
								this.bio.membersTooltip = tt_needed ? sub[n] : '';
								if (tt_needed) sub[n] = members;
							}
							if (type == 'wikiRev') {
								let tt_needed = false;
								let composers = '';
								if (bio.panel.style.inclTrackRev && /^Composers:\s/.test(sub[n])) {
									composersFound = true;
									tt_needed = g.CalcTextWidth(sub[n], bio.ui.font.summary, true) > bio.panel.text.w;
									if (tt_needed) {
										composers = g.EstimateLineWrap(sub[n], bio.ui.font.summary, bio.panel.text.w - g.CalcTextWidth('... ', bio.ui.font.summary))[0];
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
				if (bioSet.summaryCompact) {
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
		if (bio.panel.summary.show) {
			let m = '';
			for (let i = 0; i < s.length; i++) {
				if (!s[i].key && !s[i].str) continue;
					if (s[i].key) {
						m = bio.tag.getTag(text, s[i].key, true);
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
				if (bio.panel.summary.genre && bio.panel.summary.date && bio.panel.summary.popNow && bio.panel.summary.other && !sub[1]) sub[4] = this.checkNewLine(sub, 4);
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

			sub[6] = bio.panel.summary.other || bio.panel.summary.date && (bio.panel.summary.locale && this.type == 'lfmBio' || bio.panel.summary.locale && this.type == 'wikiBio') ? this.checkNewLine(sub, 6) : this.checkStr(sub, 6);

			str = sub[1];
			for (let i = 2; i < 7; i++) {
				str = str && sub[i] ? str + (!sub[i].startsWith('\r\n') ? '  |  ' : '') + sub[i] : str || sub[i];
			}
		}
		if (bioSet.expandLists) text = this.expandLists(type, text);
		text = text.replace(/\u200b/g, '');

		switch (type) {
			case 'amBio': text = text.replace('Genre: ', 'Genres: '); break;
			case 'amRev':  text = text.replace(/(Album|Track)\s(Genre|Mood|Theme)(s|):\s/g, '$2$3: '); break;
			case 'lfmBio': if (bioCfg.lang.ix > 3) text = text.replace('Top Tags: ', `${this.topTags[bioCfg.lang.ix]}: `); break;
			case 'lfmRev':
				if (bioCfg.lang.ix > 3) text = text.replace('Top Tags: ', `${this.topTags[bioCfg.lang.ix]}: `);
				text = text.replace('Track Tags: ', !bioCfg.lang.ix ? 'Top Tags: ' : `${this.topTags[bioCfg.lang.ix]}: `).replace(/Last-fm:/g, 'Last.fm:');
				break;
			case 'wikiBio': if (!singleGenre) text = text.replace('Genre: ', 'Genres: '); break;
			case 'wikiRev': text = text.replace(/Album\sGenres:\s/, singleGenre ? 'Genre: ' : 'Genres: ').replace(/Track\sGenre/, 'Genre').replace(/Track\sGenre/, 'Genre').replace(/Duration:\s/g, 'Length: '); break;
		}

		if (bio.panel.summary.show) {
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
			case !bioSet.artistView:
				if (y > bio.alb_scrollbar.y && y < bio.alb_scrollbar.y + this.rev.drawn * this.line.h.rev && x >= bio.panel.text.l && x < bio.panel.text.l + this.reader.w.nameCol + bio.panel.text.w - this.reader.w.nameCol) this.rev.ix = Math.round((y + bio.alb_scrollbar.delta - bio.panel.text.t - this.line.h.rev  * 0.5) / this.line.h.rev)
				break;
			case bioSet.artistView:
				if (y > bio.art_scrollbar.y && y < bio.art_scrollbar.y + this.bio.drawn * this.line.h.bio && x >= bio.panel.text.l && x < bio.panel.text.l + this.reader.w.nameCol + bio.panel.text.w - this.reader.w.nameCol) this.bio.ix = Math.round((y + bio.art_scrollbar.delta - bio.panel.text.t - this.line.h.bio  * 0.5) / this.line.h.bio);
				break;
		}
	}

	getBornStr(source) {
		const bi = bio.tag.getTag(source, this.bio.bornIn, true);
		const bin = bi.tag;
		if (!bio.panel.summary.date) {
			if (bio.panel.summary.locale) {
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
		const b = bio.tag.getTag(source, this.bio.born, true);
		const bn = b.tag;
		const count = bin.split(',').length - 1;
		const bornIn = count > 2 ? bin.replace(/,[^,]+,/, ',') : bin;
		let bornStr = '';
		let born = '';
		if (bn && bornIn) {
			let age = bn.match(/\s\(.*?\)/);
			age = age ? age[0] : '';
			born = bn.replace(age, '');
			bornStr = b.label + born + (bio.panel.summary.locale  ? ` \u2219 ${bornIn}` : '') + (age ? (bio.panel.summary.locale  ? ` \u2219${$Bio.titlecase(age.replace(/[()]/g, ''))}` : $Bio.titlecase(age)) : '');
			source = source.replace(RegExp($Bio.regexEscape(b.label + bn)), '');
			source = source.replace(RegExp($Bio.regexEscape(bi.label + bin)), '');
		}
		return { bornStr, source };
	}

	getFlag(artist, n) {
		if (bioSet[`${n}FlagShow`] && !bioSet.hdPos) {
			const codes = $Bio.jsonParse(this.countryCodes, {}, 'file');
			let handle = null;
			let code = (codes[artist.toLowerCase()] || '').slice(0, 2);
			let country = code ? bioCodeToCountry[code] || '' : '';
			if (!code) handle = $Bio.handle(bio.panel.id.focus);
			if (!code && handle) {
				country = FbTitleFormat('[$meta(artistcountry,0)]').EvalWithMetadb(handle);
				code = bioCountryToCode[$Bio.strip(country)];
			}
			if (!code && handle) {
				country = FbTitleFormat('[$meta(locale last.fm,$sub($meta_num(locale last.fm),1))]').EvalWithMetadb(handle);
				code = bioCountryToCode[$Bio.strip(country)];
			}
			const path = `${grPath.base}scripts\\biography\\assets\\images\\flags\\${code}.png`;
			if ($Bio.file(path)) {
				if (code && this[n].flagCode != code) {
					this[n].flag = bio_my_utils.getFlagAsset(`${code}.png`);
					this[n].flagCode = code;
					this[n].flagCountry = country;
				}
				return;
			}
		}
		this[n].flag = null;
		this[n].flagCode = '';
		this[n].flagCountry = '';
	}

	getFoundedIn(source) {
		if (!bio.panel.summary.locale) return { foundedIn: '', source };
		const f = bio.tag.getTag(source, this.bio.foundedIn, true);
		const loc = f.tag;
		const count = loc.split(',').length - 1;
		let foundedIn = count > 2 ? loc.replace(/,[^,]+,/, ',') : loc;
		if (foundedIn) foundedIn = f.label + foundedIn;
		if (f.tag) source = source.replace(RegExp($Bio.regexEscape(f.label + f.tag)), '');
		return { foundedIn, source };
	}

	getItem(p_calc, art_ix, alb_ix, force) {
		if (bioSet.img_only) return;
		switch (true) {
			case bioSet.artistView: {
				this.cur_artist = this.artist;
				const stndBio = !art_ix || art_ix + 1 > bio.panel.art.list.length;
				this.artist = stndBio ? bio.name.artist(bio.panel.id.focus) : bio.panel.art.list[art_ix].name;
				const new_artist = this.artist != this.cur_artist;
				if (new_artist) {
					this.artistFlush();
					this.bio.lookUp = true;
				}
				this.getText(p_calc);
				this.get = 0;
				break;
			}
			case !bioSet.artistView: {
				this.id.curAlb = this.id.alb;
				const stndAlb = !alb_ix || alb_ix + 1 > bio.panel.alb.list.length;
				this.artist = stndAlb ? bio.name.albumArtist(bio.panel.id.focus) : bio.panel.alb.list[alb_ix].artist;
				const alb = stndAlb ? bio.name.album(bio.panel.id.focus) : bio.panel.alb.list[alb_ix].album;
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
		const handle = $Bio.handle(bio.panel.id.focus);
		let arr = [];
		keys.forEach(v => {
			const properties = data[v].properties;
			arr = [];
			if (v != 'showEmpty' && v != '*****HELP*****' && v != 'uppercase' && data[v].show) {
				switch (true) {
				case !/Metadata\*|General\*|Other\*/i.test(v):
					properties.forEach(w => {
						if (!w.name || !w.titleformat) return;
						w.titleformat = w.titleformat.replace(/%BIO_ALBUMARTIST%/gi, bioCfg.tfAlbumArtist).replace(/%BIO_ARTIST%/gi, bioCfg.tfArtist).replace(/%BIO_ALBUM%/gi, bioCfg.tfAlbum).replace(/%BIO_TITLE%/gi, bioCfg.tfTitle);
						let value = this.formatValue(showEmpty ? $Bio.eval(`$trim(${w.titleformat})`, bio.panel.id.focus) : $Bio.eval(`[$trim(${w.titleformat})]`, bio.panel.id.focus));
						names = names.concat(fields(w.titleformat.toUpperCase()).filter(v => v.trim()));
						if (typeof w.titleformat == 'string' && w.titleformat.toLowerCase().includes('%album rating allmusic%')) value /= 2;
						if (value && /like count|dislike count|view count/i.test(w.name)) {
							value = parseInt(value);
							value = !isNaN(value) ? value.toLocaleString() : '';
						}
						if (w.name == 'Rating' && this.local) {
							w.name = 'Dynamic rating';
							value = this.formatValue($Bio.eval('[%play_count%]|%added%|$if($strstr(%path%,\'://\'),1,0)', bio.panel.id.focus));
							const i = value.split('|');
							if (!i[0] || i[2] == 1) value = 0;
							else {
								const now_d = Math.max(Math.floor((Date.now() - Date.parse(i[1])) / 86400000), 365);
								const sensitivity = 1;
								const kr = 469 * 1 / sensitivity;
								const ka = 171429 * 1 / sensitivity;
								const ppd = Math.floor(i[0] * 100000 / now_d);
								const score1 = Math.floor(i[0] * 10000000 / (ka * 2 + (i[0] * 100000)));
								const score2 = Math.floor((Math.floor(100 * ppd / (kr + ppd)) + Math.floor(i[0] * 10000000 / (ka + (i[0] * 100000)))) / 2);
								value = Math.max(score1, score2);
							}
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
						const length = $Bio.eval('[%length%]', bio.panel.id.focus);
						const samples = parseInt($Bio.eval('%length_samples%', bio.panel.id.focus));
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
								const value = this.formatValue($Bio.eval(`[%${name}%]`, bio.panel.id.focus));
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
		if (bioSet.sourceAll && bioSet.sourceHeading || bioSet.sourceHeading == 2) {
			item.unshift({ text: '', name: this[n].subhead.txt[bioSet.heading ? 0 : 1], value: '', property: true }, { text: '', name: '', value: '', property: true });
		}
		this.reader.w.nameCol = 10;
		this.reader.w.valueCol = 10;
		this.reader.w.spaceCol = 0;
		$Bio.gr(1, 1, false, g => {
			this.reader.w.spaceCol = g.CalcTextWidth(' ', bio.ui.font.main) * 5;
			if (bioSet.sourceAll && bioSet.sourceHeading || bioSet.sourceHeading == 2) this.reader.w.nameCol = g.CalcTextWidth(this[n].subhead.txt[0], bio.ui.font.subHeadSource) + this.reader.w.spaceCol;
			item.forEach(v => {
				v.name = v.name.replace(/\basin\b|\bbpm\b|\bid\b|\bisrc\b|\bcue_|\bmcn\b|\bmd5\b|\bmp3_|\burl\b/i, (m) => m.toUpperCase());
				v.name = v.name.replace(RegExp(`\\b(${data.uppercase})\\b`, 'i'), (m) => m.toUpperCase());
				v.name_w = g.CalcTextWidth(v.name, bio.ui.font.main, true);
				this.reader.w.nameCol = !bioSet.fieldWidth ? Math.max(v.name_w, this.reader.w.nameCol) : bio.panel.text.w * bioSet.fieldWidth / 100;
			});
			this.reader.w.nameCol = !bioSet.fieldWidth ? $Bio.clamp(this.reader.w.nameCol, Math.max(10, bio.panel.text.w / 6), bio.panel.text.w / 2) : $Bio.clamp(this.reader.w.nameCol, Math.max(10, bio.panel.text.w / 10), bio.panel.text.w * 0.9);
			this.reader.w.valueCol = bio.panel.text.w - this.reader.w.nameCol - this.reader.w.spaceCol;
			item.forEach(v => {
				v.name_tt_needed = v.name_w > this.reader.w.nameCol;
				v.value_tt_needed = g.CalcTextWidth(v.value, bio.ui.font.main, true) > this.reader.w.valueCol;
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
			w = g.CalcTextWidth(sub, bio.ui.font.summary);
			while (w > bio.panel.text.w && sub.includes('\u2219')) {
				const f = sub.lastIndexOf('\u2219'); // limit genres to 1 line
				if (f != -1) sub = sub.slice(0, f).trim();
				w = g.CalcTextWidth(suffix ? `${sub} ...` : sub, bio.ui.font.summary);
				end = ' ...';
			}
		});
		return sub + (suffix ? end : '');
	}

	getLogo(artist, n) { // experimental feature: disabled in release version: best in large panel
		if (this[n].loaded.txt && this.reader[n].props && this.local && window.Name == 'Details' && bio.panel.text.w && bio.panel.text.h) {
			const a = $Bio.clean(artist);
			const path = `D:\\artistlogos\\${a}.png`;
			const id = `${a}-${bio.panel.text.t}-${bio.panel.text.l}-${bio.panel.text.h}-${bio.panel.text.w}`;
			if ($Bio.file(path)) {
				if (a && this.logo.id != id) {
					this.logo.img = gdi.Image(path);
					const sc = Math.min(bio.panel.text.h / this.logo.img.Height, bio.panel.text.w / this.logo.img.Width);
					const w = Math.round(this.logo.img.Width * sc);
					const h = Math.round(this.logo.img.Height * sc);
					this.logo.x = bio.panel.text.l + (bio.panel.text.w - w) / 2;
					this.logo.y = bio.panel.text.t + (bio.panel.text.h - h) / 2;
					this.logo.img = this.logo.img.Resize(w, h, 2);
					this.logo.id = id;
				}
				this.logo.show = true;
				return
			} else {
				if (artist && this.logo.id != id) {
					const ix = Math.floor(Math.random() * this.logo.fonts.length);
					const size = Math.max(Math.round(Math.min(bio.panel.text.w, bio.panel.text.h) / 4), 10);
					const font = gdi.Font(this.logo.fonts[ix], size, 1);
					let htFull = 0;
					let htSingle = 0;
					$Bio.gr(1, 1, false, g => {
						htFull = g.MeasureString(artist, font, 0, 0, bio.panel.text.w, 5000, StringFormat(1, 1)).Height;
						htSingle = g.CalcTextHeight('String', font);
					});
					const offset = Math.max(htSingle * 0.01, 1);
					const ht = Math.min(bio.panel.text.h, htFull);
					this.logo.img = $Bio.gr(bio.panel.text.w, ht, true, g => {
						g.GdiDrawText(artist, font, RGB(0, 0, 0), 0, 0, bio.panel.text.w, ht, htFull - htSingle < bio.panel.text.h ? this.ncc : this.tc)
						g.GdiDrawText(artist, font, RGB(0, 0, 0), offset * 2, offset * 2, bio.panel.text.w, ht, htFull - htSingle < bio.panel.text.h ? this.ncc : this.tc)
						g.GdiDrawText(artist, font, RGB(255, 255, 255), offset, offset, bio.panel.text.w, ht, htFull - htSingle < bio.panel.text.h ? this.ncc : this.tc)
					});
					this.logo.x = bio.panel.text.l;
					this.logo.y = bio.panel.text.t + (bio.panel.text.h - ht) / 2;
					this.logo.id = id;
				}
				this.logo.show = true;
				return;
			}
		}
		this.logo.show = false;
	}

	getNowplaying(item, n) {
		if (!item || typeof item !== 'string') return;
		const focus = fb.IsPlaying ? false : bio.panel.id.focus;
		item = item.replace(/\r\n|\r|\n/g, '');
		const a = $Bio.tfEscape(bio.name.artist(focus, true));
		const aa = $Bio.tfEscape(bio.name.albumArtist(focus, true));
		const l = $Bio.tfEscape(bio.name.album(focus, true));
		const tr = $Bio.tfEscape(bio.name.title(focus, true));
		item = item
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? '$&#@!%path%#@!' : '$&').replace(/%bio_artist%/gi, a)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? '$&#@!%path%#@!' : '$&').replace(/%bio_albumartist%/gi, aa)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? '$&#@!%path%#@!' : '$&').replace(/%bio_album%/gi, l)
			.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? '$&#@!%path%#@!' : '$&').replace(/%bio_title%/gi, tr);
		this.reader[n].perSec = /%playback_time|%bitrate%|\$progress/i.test(item);
		item = fb.IsPlaying ? (!this.reader[n].perSec ? $Bio.eval(`[$trim(${item})]`, false) : FbTitleFormat(item).Eval()) : $Bio.eval(`[$trim(${item})]`, bio.panel.id.focus);
		return item.replace(/#@!.*?#@!/g, '');
	}

	getPlainTxtLyrics(item) {
		const isSynced = this.isSynced(item, true);
		item = bio.lyrics ? (isSynced ? bio.lyrics.parseSyncLyrics(item, !item.length) : bio.lyrics.parseUnsyncedLyrics(item, !item.length)) : [];
		let lyr = item.map(v => v.content);
		const ln = Math.min(5, lyr.length);
		if (bioSet.sourceAll) {
			const lyricArtist = bio.name.artist();
			const lyricTitle = bio.name.title();
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

		const subHeadOn = bioSet.sourceAll && bioSet.sourceHeading || bioSet.sourceHeading == 2;
		if (!bioSet.star) { // pref heading
			if (bio.ui.stars == 1) this.ratingPos.heading = true;
			else if (bio.panel.summary.show) this.ratingPos.summary = true;
			else if (subHeadOn) this.ratingPos.subHeading = true;
			else this.ratingPos.text = true;
		}
		else {
			switch (bioSet.ratingTextPos) {
				case 0:
					if (bio.panel.summary.show) this.ratingPos.summary = true;
					else if (subHeadOn) this.ratingPos.subHeading = true;
					else this.ratingPos.text = true;
					break;
				case 1:
					if (bio.panel.summary.show) this.ratingPos.summary = true;
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
				this.rating[`${site}Str`] = this.rating[site] != -1 ? `${bioSet[`${site}RatingName`]}: ${this.rating[site] / 2}` : '';
				if (bioSet[`${site}RatingName`] != 'Album rating') this.rev[`${site}Alb`] = this.rev[`${site}Alb`].replace('Album rating', bioSet[`${site}RatingName`]);
				break;
			case this.ratingPos.subHeading:
				break;
			case this.ratingPos.line:
				this.rev[`${site}Alb`] = `${this.rev.subhead[site][bioSet.heading ? 0 : 1]}\r\n\r\n${this.rev[`${site}Alb`]}`;
				if (bioSet[`${site}RatingName`] != 'Album rating') this.rev[`${site}Alb`] = this.rev[`${site}Alb`].replace('Album rating', bioSet[`${site}RatingName`]);
				break;
		}
	}

	getScrollPos() {
		let scrollPos;
		let v;
		switch (bioSet.artistView) {
			case true:
				v = `${this.artist}-${this.bio.loaded.ix}-${!this.bio.loaded.txt ? '' : this.bio.readerItem}`;
				scrollPos = $Bio.jsonParse(bioSet.bioScrollPos, {});
				if (!scrollPos[v]) return bio.art_scrollbar.setScroll(0);
				bio.art_scrollbar.setScroll(scrollPos[v] || 0);
				break;
			case false: {
				v = `${bio.panel.style.inclTrackRev != 2 ? `${this.albumartist + this.album + this.composition}-` : ''}-${this.rev.loaded.ix}-${bioSet.inclTrackRev}${!this.rev.loaded.txt ? '' : this.rev.readerItem}`;
				scrollPos = $Bio.jsonParse(bioSet.revScrollPos, {});
				if (!scrollPos[v]) return bio.alb_scrollbar.setScroll(0);
				bio.alb_scrollbar.setScroll(scrollPos[v] || 0);
				break;
			}
		}
	}

	getSubHeadWidths(txtReaderOnly) {
		$Bio.gr(1, 1, false, g => {
			if (!txtReaderOnly) {
				const items = ['am_w', 'lfm_w', 'wiki_w'];

				let subHead = [`${this.rev.subhead.am[0]} `, `${this.rev.subhead.lfm[0]} `, `${this.rev.subhead.wiki[0]} `];
				items.forEach((v, i) => this.rev[v].hd = Math.max(g.CalcTextWidth(subHead[i], bio.ui.font.subHeadSource), 1));

				subHead = [`${this.bio.subhead.am[1]} `, `${this.bio.subhead.lfm[1]} `, `${this.bio.subhead.wiki[1]} `];
				items.forEach((v, i) => this.bio[v].nohd = Math.max(g.CalcTextWidth(subHead[i], bio.ui.font.subHeadSource), 1));

				subHead = [`${this.rev.subhead.am[1]} `, `${this.rev.subhead.lfm[1]} `, `${this.rev.subhead.wiki[1]} `];
				items.forEach((v, i) => this.rev[v].nohd = Math.max(g.CalcTextWidth(subHead[i], bio.ui.font.subHeadSource), 1));

				this.bio.sp = Math.max(g.CalcTextWidth(' ', bio.ui.font.subHeadSource), 1);
			}
			this.bio.txt_w.hd = this.bio.txt_w.nohd = Math.max(g.CalcTextWidth(`${this.bio.subhead.txt[1] || ''} `, bio.ui.font.subHeadSource), 1);
			this.rev.txt_w.hd = this.rev.txt_w.nohd = Math.max(g.CalcTextWidth(`${this.rev.subhead.txt[1] || ''} `, bio.ui.font.subHeadSource), 1);
		});
	}

	getText(p_calc, update, caller) {
		if (bioSet.img_only) return;
		const a = $Bio.clean(this.artist);
		const n = bioSet.artistView ? 'bio' : 'rev';
		this.newText = false;
		if (!bio.panel.lock) {
			this.trackartist = bio.name.artist(bio.panel.id.focus);
			this.track = bio.name.title(bio.panel.id.focus);
		}
		if (this[n].reader) this.txtReader();
		switch (true) {
			case bioSet.artistView:
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
			case !bioSet.artistView: {
				const aa = $Bio.clean(this.albumartist);
				const c = bioSet.classicalMusicMode ? $Bio.clean(this.composition) : '';
				const l = $Bio.clean(this.album);
				if (!aa || !l && !bio.panel.style.inclTrackRev && !c) {
					this.resetRevAvailable();
					this.rating.am = -1;
					this.rating.lfm = -1;
					bio.but.check();
					break;
				}
				if (bio.panel.isRadio(bio.panel.id.focus) && !bio.panel.style.inclTrackRev && !bio.panel.alb.ix) {
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
			const fallbackText = !bioSet.heading ? this[n].fallbackText[1] : this[n].fallbackText[0];
			const types = $Bio.source.amLfmWikiTxt;
			const types_1 = this.moveArrayItem(types, 0, 3); // first to last
			const types_2 = this.moveArrayItem(types_1, 0, 3);
			const types_3 = this.moveArrayItem(types_2, 0, 3);
			const source = bioSet.artistView ? bioSet.sourcebio : bioSet.sourcerev;

			this.deactivateTooltip();

			const type = types[source];
			if (this[n].source[type]) {
				if ((bioSet.sourceAll && bioSet.sourceHeading || bioSet.sourceHeading == 2) && this[n][type] && type == 'lfm') this[n][type] = this[n][type].replace(/Last\.fm: /g, '');

				this[n].loaded = {
					am: false,
					lfm: false,
					wiki: false,
					txt: false,
					ix: -1
				};

				switch (true) {
					case !bioSet.sourceAll:
						if (!bioSet.lockBio) { // get target else fallback source
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
					case bioSet.sourceAll: {
						let setLoaded = false;
						[types, types_1, types_2, types_3][bioSet[`source${n}`]].forEach((v, i) => {
							if ($Bio.isArray(this[n][v]) ? this[n][v].length : this[n][v]) {
								if (bioSet.sourceHeading) {
									this[n].text[i] = !$Bio.isArray(this[n][v]) ? (`${this[n].subhead[v][bioSet.heading ? 0 : 1]}\r\n\r\n${this[n][v]}`) : this[n][v];
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

				if (this[n].text.every(v => !v) && !bioSet.img_only) this[n].text[0] = fallbackText;
				if (bioSet.sourceHeading == 2 && !bioSet.sourceAll) {
					if (!$Bio.isArray(this[n].text[0])) this[n].text[0] = `${this[n].subhead[types[this[n].loaded.ix]][bioSet.heading ? 0 : 1]}\r\n\r\n${this[n].text[0]}`;
				}
			}

			if (bio.panel.id.lyricsSource) bio.lyrics.clear();
			bio.timer.clear(bio.timer.lyrics);
			if (bio.panel.id.lyricsSource) {
				if (this[n].loaded.txt && this.reader[n].lyrics) {
					if (!this.reader[n].txtLyrics) bio.lyrics.load(this[n].txt);
					else this.paint();
				} else if (fb.IsPlaying && this.artist && (!this.reader.ESLyricSaved || !this.reader.lyrics3Saved)) {
					if (bioSet.syncTxtReaderLyrics) this.lyricsSave();
				}
			}

			if (!this[n].loaded.txt || !this.reader[n].lyrics) this.reader[n].txtLyrics = false;
			this[n].subHeading = (bioSet.sourceAll && bioSet.sourceHeading || bioSet.sourceHeading == 2) && this[n].text.length && this[n].text[0] != fallbackText ? 1 : 0;

			if (!bioSet.heading && this[n].subHeading && this[n].loaded.ix != -1) {
				const subHeadingWidth = this[n][['am_w', 'lfm_w', 'wiki_w', 'txt_w'][this[n].loaded.ix]].nohd + this.bio.sp;
				this[n].ln.x1 = bio.panel.text.l + subHeadingWidth;
				this[n].ln.x2 = Math.max(this[n].ln.x1, bio.panel.text.l + bio.panel.text.w);
			}
			if (caller != 'playbackTime') bio.img.setCrop(true); // stop nowplaying time trigger
			if (bioSet.artistView) {
				const bioText = JSON.stringify(this.bio.text);
				if (bioText != this.bio.cur || p_calc) this.artCalc();
				this.bio.cur = bioText;
			} else {
				const revText = JSON.stringify(this.rev.text);
				if (revText != this.rev.cur || p_calc) this.albCalc();
				this.rev.cur = revText;
			}
			if (bioSet.text_only && !bio.ui.style.isBlur || bio.panel.alb.ix && bio.panel.style.inclTrackRev) this.paint();
		}
		const lyrPropsNowp = this[n].loaded.txt && (this.reader[n].lyrics || this.reader[n].props || this.reader[n].nowplaying);
		const artist = bioSet.artistView ? (!lyrPropsNowp ? this.artist : bio.name.artist(bio.panel.id.focus)) : (!lyrPropsNowp ? this.albumartist : bio.name.albumArtist(bio.panel.id.focus));
		this.getFlag(artist, n);
		this.getLogo(artist, n);
		if (!bioSet.heading) {
			this.newText = false;
			return;
		}
		if (bio.panel.lock && !this.newText) {
			if (this.curHeadingID == this.headingID()) {
				this.newText = false;
				return;
			} else this.curHeadingID = this.headingID();
		}

		this.newText = false;
		if (bioSet.artistView) this.heading = bio.ui.show.headingText ? this.tf(!this.bio.reader || !this.bio.loaded.txt ? bioSet.bioHeading : this.bio.readerHeading, bioSet.artistView) : '';
		else {
			if (bioSet.classicalMusicMode) bio.panel.getList();
			this.heading = bio.ui.show.headingText ?
			(
				bio.panel.style.inclTrackRev && (this.rev.loaded.lfm && this.rev.lfmTrackHeading || this.rev.loaded.am && this.rev.amTrackHeading || this.rev.loaded.wiki && this.rev.wikiTrackHeading) ?
				this.tf(bioSet.trkHeading, bioSet.artistView, true) :
				this.tf(!this.rev.reader || !this.rev.loaded.txt ? (bio.panel.style.inclTrackRev == 2 && !this.isCompositionLoaded() ? bioSet.trkHeading : bioSet.revHeading) :
				this.rev.readerHeading, bioSet.artistView)
			) : '';
		}
		if (bio.panel.lock) this.curHeadingID = this.headingID();
	}

	getTxtFallback() {
		if (this.scrollbar_type().draw_timer) return;
		if (!bio.panel.updateNeeded()) return;
		if (!this.get && !this.textUpdate) return;
		this.na = '';
		if (this.textUpdate) this.updText();
		if (this.get) {
			this.albumReset();
			this.artistReset();
			this.getText(this.calc);
			if (this.get == 2) bio.panel.focusServer();
			this.calc = false;
			this.get = 0;
		}
	}

	grab() {
		this.textUpdate = 1;
		this.notifyTags();
		if (bio.panel.block()) return;
		this.updText();
	}

	headingID() {
		return `${bioSet.artistView}-${bio.panel.art.ix}-${bio.panel.alb.ix}-${bioSet.sourcebio}-${bioSet.sourcerev}-${bio.panel.style.inclTrackRev}`;
	}

	increment(n) {
		const num = parseInt(n.replace(/\D/g, ''));
		n = n.replace(new RegExp(num), num + 1);
		if (num == 1) n += 's';
		return n;
	}

	isCompositionLoaded() {
		return !bioSet.artistView && bioSet.classicalMusicMode && (this.rev.loaded.am && !this.rev.amFallback || this.rev.loaded.wiki && !this.rev.wikiFallback) && !bio.panel.alb.ix;
	}

	isLyricsArr(n, v) {
		return this.reader[n].lyrics && !this.reader[n].txtLyrics || v.some(w => w.text === undefined);
	}

	isMainAvail(n) {
		return $Bio.source.amLfmWiki.some(v => this[n][v] && bioSet[`source${n}`] != 3);
	}

	isSynced(n, lines) {
		if (!n || !bio.lyrics) return false;
		return lines ? n.some(line => bio.lyrics.leadingTimestamps.test(line)) : n.match(RegExp(bio.lyrics.leadingTimestamps, 'm'));
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
		const lBio = bio.panel.getPth('bio', bio.panel.id.focus, this.artist, '', '', bioCfg.supCache, a, '', '', 'foLfmBio', true).pth;
		if (!$Bio.file(lBio)) return;
		this.mod.lfmBio = $Bio.lastModified(lBio) || 0;
		if (this.mod.lfmBio == this.mod.curLfmBio) return;
		let bornStr = '';
		let foundedIn = '';
		this.bio.lfm = $Bio.open(lBio).trim();
		if (!bioSet.stats) {
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
		this.bio.lfm = this.formatText('lfmBio', this.bio.lfm, { limit: 6, list: true, key: bio.panel.summary.genre ? 'Top Tags: ' : '' }, { str: foundedIn }, { str: bornStr }, bio.panel.summary.date ? { key: this.bio.died } : {}, bio.panel.summary.date ? { key: this.bio.yrsActive } : {}, !bio.panel.summary.other ? {} : { key: 'Last.fm: ' }, bio.panel.summary.popNow ? { key: this.bio.popNow } : '').replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		this.newText = true;
		this.mod.curLfmBio = this.mod.lfmBio;
	}

	lfmRev(a, aa, l) {
		let lfm_tr_mod = '';
		let trackLength = '';
		let trackRev = '';
		let trk = '';
		const lRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.album, '', bioCfg.supCache, a, aa, l, 'foLfmRev', true).pth;
		this.avail.lfmalb = $Bio.file(lRev) ? 1 : -1;
		if (this.avail.lfmalb == -1) {
			this.rating.lfm = -1;
			bio.but.check();
			if (!bio.panel.style.inclTrackRev) {
				this.rev.lfmAlb = '';
				return;
			}
		}

		trk = this.track.toLowerCase();
		trackRev = $Bio.jsonParse(bio.panel.getPth('track', bio.panel.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foLfmRev', true).pth, false, 'file');
		this.avail.lfmtrk = this.isTrackRevAvail('lfm', trackRev[trk]);
		if (bio.panel.style.inclTrackRev && trackRev[trk] && trackRev[trk].update) lfm_tr_mod = trackRev[trk].update;

		this.mod.lfmRev = ($Bio.lastModified(lRev) || 0) + (lfm_tr_mod || 0);
		if (this.mod.lfmRev == this.mod.curLfmRev) return;
		this.rev.lfmAlb = '';
		if (bio.panel.style.inclTrackRev != 2) this.rev.lfmAlb = $Bio.open(lRev).trim();
		this.rev.lfmAlb = this.rev.lfmAlb.replace(/\s\u200b\|[\d.,\s]*?;/g, ';').replace(/\u200b\|[\d.,\s]*?$/gm, '');
		this.newText = true;
		this.mod.curLfmRev = this.mod.lfmRev;
		this.rating.lfm = -1;
		if (bio.panel.style.inclTrackRev != 2) {
			if (bioSet.lfmRating) {
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
			this.rev.lfmAlb = bioSet.score ? this.rev.lfmAlb.replace('Rating: ', '') : this.rev.lfmAlb.replace(/^Rating: .*$/m, '').trim();
		}

		this.rev.lfm = this.rev.lfmAlb;
		let needTrackSubHeading = false;
		let releases = '';
		if (bio.panel.style.inclTrackRev) {
			if (trackRev && trackRev[trk]) {
				const o = trackRev[trk];
				let wiki = '';
				releases = $Bio.getProp(o, 'releases', '');
				if (!bio.panel.summary.date) wiki = this.add([releases], wiki);
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
				const showGenres = !bioSet.autoOptimiseText || !this.rev.lfmAlb;
				let tags = '';
				if (showGenres) {
					tags = $Bio.getProp(o, 'tags', []).join('\u200b, ');
					if (tags) tags = `Track Tags: ${tags}`;
				}
				const length = $Bio.getProp(o, 'length', '');
				if (length) {
					const ix = bioCfg.lang.arr.indexOf(o.lang);
					const label = this.rev.length[ix];
					trackLength = label + length;
				}
				const stats = $Bio.getProp(o, 'stats', '');
				wiki = this.add([tags, trackLength, stats], wiki);
				if (wiki) {
					if (bioSet.trackHeading == 1 && (this.rev.lfmAlb || !bioSet.heading) || bioSet.trackHeading == 2) {
						this.rev.lfmTrackHeading = false;
						if (this.rev.lfmAlb) {
							trackRev = `!\u00a6${this.tf(bioSet.trackSubHeading, bioSet.artistView, true)}\r\n\r\n${wiki}`;
						} else {
							trackRev = wiki;
							needTrackSubHeading = true;
						}
					} else {
						this.rev.lfmTrackHeading = true;
						trackRev = wiki;
					}
					if (bio.panel.summary.other) trackRev = trackRev.replace(/^Last\.fm:\s/gm, 'Last-fm: ');
					this.rev.lfm = this.add([trackRev], this.rev.lfmAlb);
				} else {
					this.rev.lfmTrackHeading = bio.panel.style.inclTrackRev == 2;
				}
			} else {
				this.rev.lfmTrackHeading = bio.panel.style.inclTrackRev == 2;
			}
		}
		if (!bioSet.stats) {
			this.rev.lfm = this.rev.lfm.replace(/^Last\.fm: .*$(\n)?/gm, '').trim();
		}

		this.rev.lfm = this.formatText('lfmRev', this.rev.lfm, bio.panel.summary.genre ? { limit: 6, list: true, key: this.rev.lfmAlb ? 'Top Tags: ' : 'Track Tags: ' } : {}, bio.panel.summary.date ? { key: this.rev.releaseDate } : {}, !bio.panel.summary.date || this.rev.lfmAlb ? {} : { str: releases }, !bio.panel.summary.other ? {} : { key: this.rev.lfmAlb ? 'Last.fm: ' : 'Last-fm: ' }, { str: this.rating.lfmStr });
		if (bio.panel.summary.show || !bioSet.stats) this.rev.lfm = this.rev.lfm.replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (needTrackSubHeading) this.rev.lfm = `!\u00a6${this.tf(bioSet.trackSubHeading, bioSet.artistView, true)}\r\n\r\n${this.rev.lfm}`;
		if (!this.rev.lfm) bio.but.check();
	}

	loadLyric() {
		setTimeout(() => { this.getText(); }, 1000);
		bio.timer.clear(bio.timer.lyrics);
	}

	loadReader() {
		this.bio.reader = false;
		for (let i = 0; i < 4; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && bioSet[`pthTxtReader${i}`]) {
				this.bio.reader = true;
				break;
			}
		}
		this.rev.reader = false;
		for (let i = 4; i < 8; i++) {
			if (bioSet.txtReaderEnable && bioSet[`useTxtReader${i}`] && bioSet[`pthTxtReader${i}`]) {
				this.rev.reader = true;
				break;
			}
		}
		bioSet.sourcebio = $Bio.clamp(bioSet.sourcebio, 0, this.bio.reader ? 3 : 2);
		bioSet.sourcerev = $Bio.clamp(bioSet.sourcerev, 0, this.rev.reader ? 3 : 2);
		this.bio.source = {
			am: bioSet.sourcebio == 0,
			lfm: bioSet.sourcebio == 1,
			wiki: bioSet.sourcebio == 2,
			txt: bioSet.sourcebio == 3
		};
		this.rev.source = {
			am: bioSet.sourcerev == 0,
			lfm: bioSet.sourcerev == 1,
			wiki: bioSet.sourcerev == 2,
			txt: bioSet.sourcerev == 3
		};
		this.bio.readerItem = '';
		this.rev.readerItem = '';
		this.reader.items = [];
		for (let i = 0; i < 8; i++) {
			const item = bioSet[`useTxtReader${i}`] ? bioSet[`pthTxtReader${i}`] : '';
			this.reader.items.push({
				view: i < 4 ? 'bio' : 'rev',
				lyrics: bioSet[`lyricsTxtReader${i}`] && !/item_properties/i.test(utils.SplitFilePath(item)[1]),
				name: bioSet[`nmTxtReader${i}`],
				nowplaying: /nowplaying/i.test(utils.SplitFilePath(item)[1]),
				props: /item_properties/i.test(utils.SplitFilePath(item)[1]),
				pth: item,
				tag: this.isTag(item)
			});
		}
		for (let i = 0; i < 8; i++) {
			this.reader.items[i].heading = this.reader.items[i].lyrics ? bioSet.lyricHeading : this.reader.items[i].props ? bioSet.trkHeading : this.reader.items[i].view == 'bio' ? bioSet.bioHeading : bioSet.revHeading;
		}
	}

	logScrollPos(n) {
		let keys = [];
		let scrollPos;
		let v;
		n = n == 'rev' ? false : n == 'bio' ? true : bioSet.artistView;
		switch (n) {
			case true:
				scrollPos = $Bio.jsonParse(bioSet.bioScrollPos, {});
				keys = Object.keys(scrollPos);
				if (keys.length > 70) delete scrollPos[keys[0]];
				v = `${this.artist}-${this.bio.loaded.ix}-${!this.bio.loaded.txt ? '' : this.bio.readerItem}`;
				scrollPos[v] = bio.art_scrollbar.scroll;
				bioSet.bioScrollPos = JSON.stringify(scrollPos);
				break;
			case false:
				scrollPos = $Bio.jsonParse(bioSet.revScrollPos, {});
				keys = Object.keys(scrollPos);
				if (keys.length > 70) delete scrollPos[keys[0]];
				v = `${bio.panel.style.inclTrackRev != 2 ? `${this.albumartist + this.album + this.composition}-` : ''}-${this.rev.loaded.ix}-${bioSet.inclTrackRev}${!this.rev.loaded.txt ? '' : this.rev.readerItem}`;
				scrollPos[v] = bio.alb_scrollbar.scroll;
				bioSet.revScrollPos = JSON.stringify(scrollPos);
				break;
		}
	}

	lyricExists() {
		return this.reader.items.some(v => {
			if (v.lyrics) {
				return v.tag ? $Bio.eval(`[$trim(${v.pth})]`, false) : this.findFile(v, bioSet.artistView ? 'bio' : 'rev');
			}
		});
	}

	lyricsDisplayed() {
		const n = bioSet.artistView ? 'bio' : 'rev';
		return this[n].loaded.txt && this.reader[n].lyrics && !this.reader[n].txtLyrics && !bioSet.img_only;
	}

	lyricsSave() {
		if (!this.lyrics.ESLyricInstalled && !this.lyrics.lyrics3Installed) return;
		let counter = 0;
		bio.timer.clear(bio.timer.lyrics);
		bio.timer.lyrics.id = setInterval(() => {
			if (this.lyrics.lyrics3Installed && !this.reader.lyrics3Saved) {
				if ($Bio.eval('%lyric_exists%', false)) {
					fb.RunMainMenuCommand('View/Lyrics Show 3/Save');
					this.reader.lyrics3Saved = true;
					this.loadLyric();
				}
			}
			if (this.lyrics.ESLyricInstalled && !this.reader.ESLyricSaved && counter % 3 === 0) {
				if (!this.lyricExists()) {
					fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric');
				} else {
					this.reader.ESLyricSaved = true;
					this.loadLyric();
				}
			}
			counter++;
			if (counter == 30) bio.timer.clear(bio.timer.lyrics);
		}, 1000);
	}

	move(x, y) {
		this.get_ix(x, y);
		if (this.rev.ix != -1) {
			if (!bioSet.img_only && !this.lyricsDisplayed()) this.check_tooltip(this.rev.arr[this.rev.ix], x, y, false, this.line.h.rev);
			else this.deactivateTooltip();
		} else if (this.bio.ix != -1) {
			if (!bioSet.img_only && !this.lyricsDisplayed()) this.check_tooltip(this.bio.arr[this.bio.ix], x, y, true, this.line.h.bio);
			else this.deactivateTooltip();
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
		if (!bioCfg.notifyTags && !bio.tag.force) return;
		this.currentTrackTags();
	}

	on_playback_new_track(force) {
		if (bio.panel.lock) bio.panel.getList();
		this.notifyTags();
		if (!bio.panel.updateNeeded() && !force) return;
		if (bio.panel.block()) {
			this.get = 1;
			if (!bio.panel.lock) bio.panel.getList(true);
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
		} else {
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
			this.na = '';
			this.getText(false);
			if (!bio.panel.lock) bio.panel.getList(true);
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
		bio.panel.getList(true);
		bio.but.refresh(true);
		this.notifyTags();
	}

	paint() {
		if (!this.repaint) return;
		if (!bio.panel.style.showFilmStrip || bioSet.filmStripOverlay) window.Repaint();
		else window.RepaintRect(0, grm.ui.topMenuHeight, bio.ui.w, bio.ui.h);
	}

	refresh(n) {
		switch (n) {
			case 0: // general style changes etc
				bio.filmStrip.logScrollPos();
				bio.filmStrip.setFilmStripSize();
				bio.panel.setStyle();
				bio.img.clearCache();
				this.albumFlush();
				this.artistFlush();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				bio.but.refresh();
				bio.img.getImages();
				if (bioSet.showFilmStrip && bioSet.autoFilm) this.getScrollPos();
				bio.but.setLookUpPos();
				break;
			case 1: // onOff heading summary; setReviewType; toggle('sourceAll'); toggle('classicalMusicMode') all except setReviewType set scrollPos = {} to forcescrollReset
				bio.ui.getFont();
				bio.ui.calcText();
				bio.panel.setStyle();
				bio.ui.getColours();
				bio.but.createStars();
				this.albumFlush();
				this.artistFlush();
				if (!bioSet.img_only) bio.img.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				bio.but.refresh(true);
				bio.img.getImages();
				break;
			case 2: // reset zoom
				if (bio.panel.style.inclTrackRev == 1) this.logScrollPos();
				bio.ui.getColours();
				bio.ui.getFont();
				bio.panel.setStyle();
				if (!bioSet.img_only) bio.img.clearCache();
				this.albumFlush();
				this.artistFlush();
				this.rev.cur = '';
				this.bio.cur = '';
				this.reader.w.nameCol = 10;
				this.reader.w.valueCol = 10;
				this.getText(true);
				bio.img.getImages();
				if (bioSet.text_only && !bio.ui.style.isBlur) this.paint();
				break;
			case 3: // wheel setZoom & resetStyle
				bio.filmStrip.logScrollPos();
				this.logScrollPos();
				bio.panel.setStyle();
				this.albumFlush();
				this.artistFlush();
				bio.img.clearCache();
				bio.but.refresh();
				if (bio.panel.stndItem()) {
					this.getText(false);
					bio.img.getImages();
				} else {
					this.getItem(false, bio.panel.art.ix, bio.panel.alb.ix);
					bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
				}
				if (bioSet.artistView) {
					this.rev.cur = '';
					this.artCalc();
				} else {
					this.bio.cur = '';
					this.albCalc();
				}
				break;
		}
		grm.theme.initBiographyColors();
		this.artCalc(); this.albCalc(); // Refresh text color
	}

	resetRevAvailable() {
		$Bio.source.amLfmWiki.forEach(v => {
			this.avail[`${v}alb`] = -1;
			this.avail[`${v}trk`] = -1;
		});
	}

	revPth(n) {
		if (bioSet.img_only) return ['', '', false, false];
		const field = n != 'Am' && n != 'Wiki' ? this.album : !bioSet.classicalMusicMode || n == 'Am' && this.rev.amFallback || n == 'Wiki' && this.rev.wikiFallback || bio.panel.alb.ix ? this.album : this.composition;
		return bio.panel.getPth('rev', bio.panel.id.focus, this.artist, field, '', bioCfg.supCache, $Bio.clean(this.artist), $Bio.clean(this.albumartist), $Bio.clean(field), `fo${n}Rev`, false);
	}

	scrollbar_type() {
		return bioSet.artistView ? bio.art_scrollbar : bio.alb_scrollbar;
	}

	setSectionHeading(item, name, arr) {
		if (!arr.length) return item;
		item.push({ text: '', name: '', value: '', property: true });
		item.push({ text: '', name, value: '', property: true, sectionHeading: true });
		return item.concat(arr);
	}

	tf(n, artistView, trackreview) {
		if (!n) return '';
		if (bio.panel.lock) n = n.replace(/%artist%|\$meta\(artist,0\)/g, '#\u00a6#\u00a6#%artist%#\u00a6#\u00a6#').replace(/%title%|\$meta\(title,0\)/g, '#!#!#%title%#!#!#');
		const b = artistView ? 'bio' : 'rev';
		const a = this[b].loaded.txt && (this.reader[b].lyrics || this.reader[b].props || this.reader[b].nowplaying) ? $Bio.tfEscape(bio.name.artist(bio.panel.id.focus)) : $Bio.tfEscape(artistView ? this.artist : (!trackreview ? (bio.panel.alb.ix ? this.albumartist : this.artist) : this.trackartist));
		const aa = this[b].loaded.txt && (this.reader[b].lyrics || this.reader[b].props || this.reader[b].nowplaying) || bio.panel.isRadio(bio.panel.id.focus) && !bio.panel.alb.ix ? $Bio.tfEscape(bio.name.albumArtist(bio.panel.id.focus)) : $Bio.tfEscape(artistView ? (bio.panel.art.ix ? this.artist : this.albumartist) : (!trackreview ? this.albumartist : this.trackartist));
		const composition = this.isCompositionLoaded();
		const l = composition ? $Bio.tfEscape(this.composition.replace('Album Unknown', '')) : $Bio.tfEscape(this.album.replace('Album Unknown', ''));
		const tr = $Bio.tfEscape(this.track);
		if (composition) n = n.replace(/%bio_album%/gi, bioCfg.tf.composition);
		n = n.replace(/%lookup_item%/gi, bio.panel.simTagTopLookUp() ? '$&#@!%path%#@!' : '$&');
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? '$&#@!%path%#@!' : '$&').replace(/%bio_artist%/gi, a).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? '$&#@!%path%#@!' : '$&').replace(/%bio_albumartist%/gi, aa).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? '$&#@!%path%#@!' : '$&').replace(/%bio_album%/gi, l).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? '$&#@!%path%#@!' : '$&').replace(/%bio_title%/gi, tr);
		n = $Bio.eval(n, bio.panel.id.focus);
		if (bio.panel.lock) n = n.replace(/#\u00a6#\u00a6#.*?#\u00a6#\u00a6#/g, this.trackartist).replace(/#!#!#.*?#!#!#/g, this.track);
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
		if (!this[n].loaded.wiki && !bioSet.sourceAll || !bioSet.wikiStyle) return;
		const arr = this[n].arr;
		let i = arr.length;
		while (i--) {
			const v = arr[i];
			if (/^=+$/.test(v.text)) arr.splice(i, 1);
			else v.text = v.text.replace(/=/g, '').trim();
		}
	}

	trackPth(n) {
		if (bioSet.img_only || bioSet.artistView) return ['', '', false, false];
		return bio.panel.getPth('track', bio.panel.id.focus, this.artist, 'Track Reviews', '', '', $Bio.clean(this.artist), '', 'Track Reviews', `fo${n}Rev`, false);
	}

	txtBioPth() {
		if (!bioSet.artistView || !bioSet.txtReaderEnable || bioSet.img_only) return ['', '', false, false];
		let pth = '';
		if (!this.bio.readerTag) pth = this.bio.readerItem;
		else {
			const handle = $Bio.handle(bio.panel.id.focus);
			if (handle) pth = handle.Path;
		}
		return ['', pth, true, $Bio.file(pth)];
	}

	txtReader() {
		const n = bioSet.artistView ? 'bio' : 'rev';
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
				} else if (this.findFile(v, n)) {
					found = i;
					return true;
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
			bio.but.createStars();
			return;
		}
		this.reader[n].lyrics = this.reader.items[found].lyrics;
		this.reader[n].nowplaying = this.reader.items[found].nowplaying;
		this.reader[n].props = this.reader.items[found].props;
		nm = this.upperCaseFirst(this.reader.items[found].name);
		this[n].subhead.txt = [nm, nm];
		this[n].readerHeading = this.reader.items[found].heading;
		bio.but.createStars();
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
			} else if (!$Bio.equal(this[n].txt, item)) {
				this[n].txt = item;
				this.newText = true;
			}
		}
	}

	txtRevPth() {
		if (bioSet.artistView || !bioSet.txtReaderEnable || bioSet.img_only) return ['', '', false, false];
		let pth = '';
		if (!this.rev.readerTag) pth = this.rev.readerItem;
		else {
			const handle = $Bio.handle(bio.panel.id.focus);
			if (handle) pth = handle.Path;
		}
		return ['', pth, true, $Bio.file(pth)];
	}

	updText() {
		this.getText(false, true);
		bio.img.getArtImg();
		bio.img.getFbImg();
		this.textUpdate = 0;
		this.done.amBio = this.done.lfmBio = this.done.amRev = this.done.lfmRev = this.done.wikiRev = false;
	}

	upperCaseFirst(n) {
		return `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()}`;
	}

	wikiBio(a) {
		const wBio = bio.panel.getPth('bio', bio.panel.id.focus, this.artist, '', '', bioCfg.supCache, a, '', '', 'foWikiBio', true).pth;
		const lBio = bio.panel.getPth('bio', bio.panel.id.focus, this.artist, '', '', bioCfg.supCache, a, '', '', 'foLfmBio', true).pth;
		if (!$Bio.file(wBio) && !$Bio.file(lBio)) return;
		this.mod.wikiBio = ($Bio.lastModified(wBio) || 0) + (bio.panel.summary.show ? ($Bio.lastModified(lBio) || 0) : 0);
		if (this.mod.wikiBio == this.mod.curWikiBio) return;
		this.bio.wiki = $Bio.open(wBio).replace(/\u200b/g, '').trim();
		const checkGenre = this.checkGenre(this.bio.wiki);
		const en = this.bio.wiki.includes('Wikipedia language: EN');
		const bioLfm = $Bio.open(lBio);
		let bornStr = '';
		let active = '';
		let foundedIn = '';
		let latest = '';

		if (this.bio.wiki && bio.panel.summary.show) {
			if (bio.panel.summary.latest) {
				const latestRelease = bio.tag.getTag(bioLfm, this.bio.latestRelease, true);
				if (latestRelease.tag) latest = latestRelease.label + latestRelease.tag;
			}
			const b = this.getBornStr(en ? this.bio.wiki : bioLfm);
			bornStr = b.bornStr;
			if (en) this.bio.wiki = b.source;
			else if (!bornStr) {
				const y = bio.tag.getTag(bioLfm, this.bio.yrsActive, true);
				if (y.tag) {
					active = y.label + y.tag;
				}
			}
			const o = this.getFoundedIn(en ? this.bio.wiki : bioLfm);
			foundedIn = o.foundedIn;
			if (en) this.bio.wiki = o.source;
		}

		if (bioSet.sourceAll && bioSet.autoOptimiseText) {
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
		this.bio.wiki = this.formatText('wikiBio', this.bio.wiki, bio.panel.summary.genre ? { limit: 6, list: true, key: 'Genre: ' } : {}, { str: foundedIn }, { str: bornStr }, bio.panel.summary.date ? { key: this.bio.died } : {}, bio.panel.summary.date ? (en ? { key: this.bio.yrsActive } : { str: active }) : {}, '', bio.panel.summary.latest ? { str: latest } : '', checkGenre.singleGenre).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
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

		if (!bioSet.classicalMusicMode || bio.panel.alb.ix) {
			wRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.album, '', bioCfg.supCache, a, aa, l, 'foWikiRev', true).pth;
		} else if (!bio.panel.alb.ix) {
			wRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.composition, '', bioCfg.supCache, a, aa, c, 'foWikiRev', true).pth;
			if ($Bio.file(wRev)) foundComp = true;
		}
		this.rev.wikiFallback = !foundComp;
		if (!$Bio.file(wRev) && bioSet.classicalAlbFallback && !bio.panel.alb.ix && bio.panel.style.inclTrackRev != 2) {
			wRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.album, '', bioCfg.supCache, a, aa, l, 'foWikiRev', true).pth;
		}
		this.avail.wikialb = $Bio.file(wRev) ? 2 : -1;
		const lRev = bio.panel.getPth('rev', bio.panel.id.focus, this.artist, this.album, '', bioCfg.supCache, a, aa, l, 'foLfmRev', true).pth;
		if (this.avail.wikialb == -1 && !$Bio.file(lRev)) {
			bio.but.check();
			if (!bio.panel.style.inclTrackRev || bioSet.classicalMusicMode && !bioSet.classicalAlbFallback) {
				this.rev.wikiAlb = '';
				return;
			}
		}

		trk = this.track.toLowerCase();
		trackRev = $Bio.jsonParse(bio.panel.getPth('track', bio.panel.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foWikiRev', true).pth, false, 'file');
		this.avail.wikitrk = this.isTrackRevAvail('wiki', trackRev[trk]);
		if (bio.panel.style.inclTrackRev && trackRev[trk] && trackRev[trk].update) wiki_tr_mod = trackRev[trk].update;

		this.mod.wikiRev = ($Bio.lastModified(wRev) || 0) + (bio.panel.summary.show ? ($Bio.lastModified(lRev) || 0) : 0) + (wiki_tr_mod || 0);
		if (this.mod.wikiRev == this.mod.curWikiRev) return;
		this.rev.wikiAlb = '';
		let revLfm = '';
		if (bio.panel.style.inclTrackRev != 2 || foundComp) {
			this.rev.wikiAlb = $Bio.open(wRev).replace(/\u200b/g, '').trim();
			if (!foundComp) revLfm = $Bio.open(lRev).replace(/\u200b/g, '').trim();
		}

		const checkGenre = this.checkGenre(this.rev.wikiAlb);
		this.newText = true;
		this.mod.curWikiRev = this.mod.wikiRev;
		this.rev.wikiAlb = this.rev.wikiAlb.replace('Genre: ', 'Album Genres: ');
		const eng = this.rev.wikiAlb.includes('Wikipedia language: EN');
		if (bio.panel.style.inclTrackRev != 2 || foundComp) {
			if (this.rev.wikiAlb && bio.panel.summary.date) {
				const lfmDate = bio.tag.getTag(revLfm, this.rev.releaseDate, true);
				if (lfmDate.tag) albReleaseDate = lfmDate.label + lfmDate.tag;
				if (eng) {
					const wRevDate = bio.tag.getTag(this.rev.wikiAlb, this.rev.releaseDate, true);
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
				if (bio.panel.summary.other) {
					const length = bio.tag.getTag(eng ? this.rev.wikiAlb : revLfm, eng ? 'Length: ' : this.rev.len, true);
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

		if ((bio.panel.style.inclTrackRev == 1 || bioSet.sourceAll) && bioSet.autoOptimiseText) {
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
		if (!bioSet.classicalMusicMode || !foundComp) {
			if (bio.panel.style.inclTrackRev) {
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
					} else if (bio.panel.summary.other) { // static read
						const trackLfmRev = $Bio.jsonParse(bio.panel.getPth('track', bio.panel.id.focus, this.trackartist, 'Track Reviews', '', '', $Bio.clean(this.trackartist), '', 'Track Reviews', 'foLfmRev', true).pth, false, 'file');
						if (trackLfmRev && trackLfmRev[trk]) {
							length = $Bio.getProp(trackLfmRev[trk], 'length', '');
							if (length) {
								const ix = bioCfg.lang.arr.indexOf(lang);
								if (ix != -1) label = this.rev.length[ix];
							}
						}
					}
					if (length) length = (bio.panel.summary.other ? label : 'Length: ') + length;
					let wiki = $Bio.getProp(o, 'wiki', '');
					const showGenres = !bioSet.autoOptimiseText || !this.rev.wikiAlb;
					if (showGenres) {
						let genres = $Bio.getProp(o, 'genre', []);
						if (genres.length) {
							if (genres.length > 1) genrePrefix = 'Track Genres: ';
							genres = genrePrefix + genres.join('\u200b, ');
							wiki = this.add([genres], wiki);
						}
					}
					if (bioSet.expandLists) {
						wiki = this.add([wiki], composer);
						wiki = this.add([wiki], releaseDate);
					} else {
						wiki = this.add([wiki], releaseDate);
						wiki = composer && wiki ? composer + (releaseDate ? '\r\n' : '\r\n\r\n') + wiki : composer || wiki;
					}
					if (this.rev.wikiAlb || (!bio.panel.summary.show || !bio.panel.summary.other) && length) wiki = this.add([length], wiki);
					if (wiki) {
						if (bioSet.trackHeading == 1 && (this.rev.wikiAlb || !bioSet.heading) || bioSet.trackHeading == 2) {
							this.rev.wikiTrackHeading = false;
							if (this.rev.wikiAlb) {
								trackRev = `!\u00a6${this.tf(bioSet.trackSubHeading, bioSet.artistView, true)}\r\n\r\n${wiki}`;
							} else {
								trackRev = wiki;
								needTrackSubHeading = true;
							}
						} else {
							this.rev.wikiTrackHeading = true;
							trackRev = wiki;
						}
						if (bioSet.sourceAll && bioSet.autoOptimiseText) {
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
						this.rev.wikiTrackHeading = bio.panel.style.inclTrackRev == 2;
					}
				} else {
					this.rev.wikiTrackHeading = bio.panel.style.inclTrackRev == 2;
				}
			}
		}  else {
			this.rev.wikiTrackHeading = false;
		}

		this.rev.wiki = this.rev.wiki.replace(/Wikipedia language:\s[A-Z]{2}/, '');
		this.rev.wiki = this.formatText('wikiRev', this.rev.wiki, bio.panel.summary.genre ? { limit: 6, list: true, key: this.rev.wikiAlb ? 'Album Genres: ' : genrePrefix } : {}, bio.panel.summary.other && !this.rev.wikiAlb ? { list: true, key: writer, prefix: true, suffix: true } : {}, bio.panel.summary.date ? (this.rev.wikiAlb ? (albReleaseDate ? { str: albReleaseDate } : (eng ? { key: this.rev.releaseDate } : '')) : { key: this.rev.releaseDate }) : {}, bio.panel.summary.other && !this.rev.wikiAlb ? (length ? { str: length } : {}) : { str: albLength }, '', '', '', checkGenre.singleGenre).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (needTrackSubHeading) this.rev.wiki = `!\u00a6${this.tf(bioSet.trackSubHeading, bioSet.artistView, true)}\r\n\r\n${this.rev.wiki}`;
		if (!this.rev.wiki) bio.but.check();
	}
}
