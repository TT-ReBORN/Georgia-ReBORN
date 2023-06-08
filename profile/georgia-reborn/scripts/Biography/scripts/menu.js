'use strict';

const MF_GRAYED_BIO = 0x00000001;
const MF_STRING_BIO = 0x00000000;

class MenuManagerBio {
	constructor(name, clearArr, baseMenu) {
		this.baseMenu = baseMenu || 'baseMenu';
		this.clearArr = clearArr;
		this.func = {};
		this.idx = 0;
		this.menu = {};
		this.menuItems = [];
		this.menuNames = [];
		this.name = name;
	}

	// Methods

	addItem(v) {
		if (v.separator && !v.str) {
			const separator = this.get(v.separator);
			if (separator) this.menu[v.menuName].AppendMenuSeparator();
		} else {
			const hide = this.get(v.hide);
			if (hide || !v.str) return;
			this.idx++;
			if (!this.clearArr) this.executeFunctions(v, ['checkItem', 'checkRadio', 'flags', 'menuName', 'separator', 'str']); // if clearArr, functions redundant & not supported
			const a = this.clearArr ? v : this;
			const menuBio = this.menu[a.menuName];
			menuBio.AppendMenuItem(a.flags, this.idx, a.str);
			if (a.checkItem) menuBio.CheckMenuItem(this.idx, a.checkItem);
			if (a.checkRadio) menuBio.CheckMenuRadioItem(this.idx, this.idx, this.idx);
			if (a.separator) menuBio.AppendMenuSeparator();
			this.func[this.idx] = v.func;
		}
	}

	addSeparator({ menuName = this.baseMenu, separator = true }) { this.menuItems.push({ menuName: menuName || this.baseMenu, separator }); }

	appendMenu(v) {
		const a = this.clearArr ? v : this;
		if (!this.clearArr) this.executeFunctions(v, ['hide', 'menuName']);
		if (a.menuName == this.baseMenu || a.hide) return;
		if (!this.clearArr) this.executeFunctions(v, ['appendTo', 'flags', 'separator', 'str']);
		const menuBio = this.menu[a.appendTo || this.baseMenu];
		this.menu[a.menuName].AppendTo(menuBio, a.flags, a.str || a.menuName)
		if (a.separator) menuBio.AppendMenuSeparator();
	}

	clear() {
		this.menu = {}
		this.func = {}
		this.idx = 0;
		if (this.clearArr) {
			this.menuItems = [];
			this.menuNames = [];
		}
	}

	createMenu(menuName = this.baseMenu) {
		menuName = this.get(menuName);
		this.menu[menuName] = window.CreatePopupMenu();
	}

	executeFunctions(v, items) {
		let i = 0;
		const ln = items.length;
		while (i < ln) {
			const w = items[i];
			this[w] = this.get(v[w])
			i++;
		}
	}

	get(v) {
		if (v instanceof Function) return v();
		return v;
	}

	load(x, y) {
		if (!this.menuItems.length) menBio[this.name]();
		let i = 0;
		let ln = this.menuNames.length;
		while (i < ln) {
			this.createMenu(this.menuNames[i])
			i++;
		}

		i = 0;
		ln = this.menuItems.length;
		while (i < ln) {
			const v = this.menuItems[i];
			!v.appendMenu ? this.addItem(v) : this.appendMenu(v)
			i++;
		}
		const idx = this.menu[this.baseMenu].TrackPopupMenu(x, y);
		this.run(idx);

		this.clear();
	}

	newItem({ str = null, func = null, menuName = this.baseMenu, flags = MF_STRING_BIO, checkItem = false, checkRadio = false, separator = false, hide = false }) { this.menuItems.push({ str, func, menuName, flags, checkItem, checkRadio, separator, hide }); }

	newMenu({ menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = MF_STRING_BIO, separator = false, hide = false }) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) this.menuItems.push({ menuName, appendMenu: true, str, appendTo, flags, separator, hide });
	}

	run(idx) {
		const v = this.func[idx];
		if (v instanceof Function) v();
	}
}

const clearArrBio = true;
const menuBio = new MenuManagerBio('mainMenu', clearArrBio);
const bMenu = new MenuManagerBio('buttonMenu', clearArrBio);

class MenuItemsBio {
	constructor() {
		this.docTxt = '';
		this.handles = new FbMetadbHandleList();
		this.openName = [];
		this.popUpTitle = 'Missing Data:';
		this.right_up = false;
		this.shift = false;
		this.sources = [];
		this.tags = false;
		this.types = [];
		this.counter = {
			bio: 0,
			rev: 0
		};
		this.display = {
			check: [],
			str: []
		};
		this.img = {
			artist: '',
			artistClean: '',
			blacklist: [],
			blacklistStr: [],
			covType: [lg.Front, lg.Back, lg.Disc, lg.Icon, lg.Artist, lg['Cycle above'], lg['Cycle from folder']],
			isLfm: true,
			list: [],
			name: ''
		};
		this.playlist = {
			menu: [],
			origIndex: 0
		};
		this.path = {
			am: [],
			blackList: '',
			img: false,
			lfm: [],
			open: [],
			tracksAm: [],
			tracksLfm: [],
			tracksWiki: [],
			txt: [],
			wiki: []
		};
		this.undo = {
			folder: '',
			path: '',
			text: '#!#'
		}

		this.playlists_changed();
	}

	// Methods

	buttonMenu() {
		bMenu.newMenu({});
		const artist = panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(panelBio.id.focus);
		switch (pptBio.artistView) {
			case true:
				panelBio.art.list.forEach((v, i) => bMenu.newItem({
					str: v.name.replace(/&/g, '&&') + v.field.replace(/&/g, '&&'),
					func: () => this.lookUpArtist(i),
					flags: v.type != 'label' ? MF_STRING_BIO : MF_GRAYED_BIO,
					checkRadio: i == panelBio.art.ix,
					separator: !i || v.type == 'similarend' || v.type == 'label' || v.type == 'tagend' || v.type == 'historyend'
				}));
				for (let i = 0; i < 4; i++) { bMenu.newItem({
					str: this.getlookUpStr(i, 0),
					func: () => this.lookUpArtist(panelBio.art.list.length + i),
					flags: !i ? MF_GRAYED_BIO : MF_STRING_BIO,
					checkItem: i == 1 && pptBio.cycItem,
					separator: true
				}); }

				bMenu.newMenu({
					menuName: lg['More...']
				});
				for (let i = 0; i < 8; i++) { bMenu.newItem({
					menuName: lg['More...'],
					str: this.getlookUpStr(i, 1, artist),
					func: () => this.lookUpArtistItems(i),
					checkItem: i < 4 && [pptBio.showSimilarArtists, pptBio.showMoreTags, pptBio.showArtistHistory, pptBio.autoLock][i],
					separator: i == 2 || i == 3 || i == 4 || i == 5
				}); }
				break;
			case false:
				panelBio.alb.list.forEach((v, i) => bMenu.newItem({
					str: ((!i || v.type.includes('history') ? `${v.artist.replace(/&/g, '&&')} - ${v.album.replace(/&/g, '&&')}` : v.album.replace(/&/g, '&&')) + (!v.composition ? '' : ' [composition]')).replace(/^\s-\s/, ''),
					func: () => this.lookUpAlbum(i),
					flags: v.type != 'label' && v.album != lg['Album History:'] ? MF_STRING_BIO : MF_GRAYED_BIO,
					checkRadio: i == panelBio.alb.ix,
					separator: !i || v.type == 'albumend' || v.type == 'label' || v.type == 'historyend'
				}));
				for (let i = 0; i < 4; i++) { bMenu.newItem({
					str: this.getlookUpStr(i, 0),
					func: () => this.lookUpAlbum(panelBio.alb.list.length + i),
					flags: !i ? MF_GRAYED_BIO : MF_STRING_BIO,
					checkItem: i == 1 && pptBio.cycItem,
					separator: true
				}); }

				bMenu.newMenu({
					menuName: lg['More...']
				});
				for (let i = 0; i < 8; i++) { bMenu.newItem({
					menuName: lg['More...'],
					str: this.getlookUpStr(i, 2, artist),
					func: () => this.lookUpAlbumItems(i),
					checkItem: i < 3 && [pptBio.showTopAlbums, pptBio.showAlbumHistory, pptBio.autoLock][i],
					separator: i == 1 || i == 2 || i == 3 || i == 4
				}); }
				break;
		}
	}

	mainMenu() {
		menuBio.newMenu({});
		menuBio.newItem({
			str: `${$Bio.titlecase(cfg.cfgBaseName)} server`,
			flags: MF_GRAYED_BIO,
			separator: true,
			hide: !$Bio.server || !this.shift || !vkBio.k('ctrl')
		});

		const b = pptBio.artistView ? 'Bio' : 'Rev';
		const loadName = lg.Load + (!pptBio.sourceAll ? '' : lg[' first']);
		const n = b.toLowerCase();
		const separator = !pptBio.artistView && (pptBio.showTrackRevOptions || txt.isCompositionLoaded()) || !panelBio.stndItem();

		if (pref.layout === 'default' && ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
			menuBio.newItem({
				str: 'Edit custom theme',
				func: () => {
					displayCustomThemeMenu = true;
					initCustomThemeMenu(false, false, false, 'bio_bg');
					window.Repaint();
				},
				separator: true
			});
		}

		menuBio.newItem({ // * Biography layout switcher
			str: pref.biographyLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal',
			func: () => {
				if (pref.biographyLayout === 'normal') {
					pref.biographyLayout = 'full';
					playlist.x = ww; // Move hidden Playlist off screen to disable Playlist mouse functions
				} else {
					pref.biographyLayout = 'normal';
					playlist.on_size(ww, wh);
					displayPlaylist = true;
				}
				biographyLayoutFullPreset();
				setBiographySize();
				window.Repaint();
			},
			separator: true,
			hide: pref.layout !== 'default'
		});

		menuBio.newMenu({
			menuName: loadName,
			hide: pptBio.img_only
		});

		this.sources.forEach((v, i) => menuBio.newItem({
			menuName: loadName,
			str: v,
			func: () => this.toggle(i, b, true),
			flags: txt[n][this.types[i]] ? MF_STRING_BIO : MF_GRAYED_BIO,
			checkRadio: i == txt[n].loaded.ix,
			separator: txt[n].reader ? i == 3 && separator : i == 2 && separator
		}));

		if (pptBio.showTrackRevOptions && !pptBio.artistView && panelBio.stndItem() && !txt.isCompositionLoaded()) {
			menuBio.newItem({
				menuName: loadName,
				str: lg['Type:'],
				flags: MF_GRAYED_BIO,
				separator: true
			});
			[lg.Album, lg.Track, lg['Prefer both']].forEach((v, i) => menuBio.newItem({
				menuName: loadName,
				str: v,
				func: () => this.setReviewType(i),
				flags: !txt[n][this.types[0]] && !txt[n][this.types[1]] && !txt[n][this.types[2]] ? MF_STRING_BIO : !txt[n].loaded.txt && [this.albAvail, this.trkAvail, this.albAvail || this.trkAvail][i] ? MF_STRING_BIO : MF_GRAYED_BIO,
				checkRadio: !i && !pptBio.inclTrackRev || i == 1 && pptBio.inclTrackRev == 2 || i == 2 && pptBio.inclTrackRev == 1
			}));
		}

		if (!panelBio.stndItem() || txt.isCompositionLoaded()) {
			menuBio.newItem({
				menuName: loadName,
				str: lg['Mode: '] + (pptBio.artistView ? lg['artist look-up'] : (txt.isCompositionLoaded() ? lg['composition loaded'] : lg['album look-up'])),
				flags: MF_GRAYED_BIO
			});
		}

		menuBio.addSeparator({ separator: !pptBio.img_only });

		menuBio.newMenu({
			menuName: lg.Display
		});

		for (let i = 0; i < 11; i++) { menuBio.newItem({
			menuName: lg.Display,
			str: this.display.str[i],
			func: () => this.setDisplay(i),
			flags: i == 1 && pptBio.autoEnlarge || i == 6 && !pptBio.summaryShow || i == 10 && (panelBio.id.lyricsSource || panelBio.id.nowplayingSource) ? MF_GRAYED_BIO : MF_STRING_BIO,
			checkItem: (i > 2 && i < 6) && this.display.check[i],
			checkRadio: (i < 3 || i > 6 && i < 9 || i > 8) && this.display.check[i],
			separator: i == 2 || i == 5 || i == 6 || i == 8
		}); }

		menuBio.addSeparator({});

		menuBio.newMenu({
			menuName: lg.Sources
		});

		menuBio.newMenu({
			menuName: lg.Text,
			appendTo: lg.Sources
		});

		for (let i = 0; i < 5; i++) { menuBio.newItem({
			menuName: lg.Text,
			str: [lg['Auto-fallback'], lg.Static, lg.Amalgamate, lg['Show track review options on load menu'], lg['Prefer composition reviews (allmusic && wikipedia)']][i],
			func: () => this.setTextType(i, b),
			flags: !i && pptBio.sourceAll || i == 1 && pptBio.sourceAll ? MF_GRAYED_BIO : MF_STRING_BIO,
			checkItem: i == 2 && pptBio.sourceAll || i == 3 && pptBio.showTrackRevOptions || i == 4 && pptBio.classicalMusicMode,
			checkRadio: !i && (!pptBio.lockBio || pptBio.sourceAll) || i == 1 && pptBio.lockBio && !pptBio.sourceAll,
			separator: i == 1 || i == 2 || i == 3 && cfg.classicalModeEnable,
			hide: i == 4 && !cfg.classicalModeEnable
		}); }

		menuBio.addSeparator({ menuName: lg.Sources });

		menuBio.newMenu({
			menuName: lg.Photo,
			appendTo: lg.Sources
		});

		[lg['Cycle from download folder'], lg['Cycle from custom folder [fallback to above]'], lg['Artist (single image [fb2k: display])']].forEach((v, i) => menuBio.newItem({
			menuName: lg.Photo,
			str: v,
			func: () => this.setPhotoType(i),
			checkRadio: pptBio.cycPhotoLocation == i,
			separator: i == 1
		}));

		menuBio.newMenu({
			menuName: lg.Cover,
			str: lg.Cover,
			appendTo: lg.Sources,
			flags: !panelBio.alb.ix || pptBio.artistView ? MF_STRING_BIO : MF_GRAYED_BIO
		});

		this.img.covType.forEach((v, i) => menuBio.newItem({
			menuName: lg.Cover,
			str: v,
			func: () => this.setCover(i),
			flags: pptBio.loadCovFolder && !pptBio.loadCovAllFb && i < 5 ? MF_GRAYED_BIO : MF_STRING_BIO,
			checkItem: (pptBio.loadCovAllFb || i > 4) && [imgBio.cov.selection[0] != -1, imgBio.cov.selection[1] != -1, imgBio.cov.selection[2] != -1, imgBio.cov.selection[3] != -1, imgBio.cov.selection[4] != -1, pptBio.loadCovAllFb, pptBio.loadCovFolder][i],
			checkRadio: !pptBio.loadCovAllFb && i == pptBio.covType,
			separator: i == 4
		}));

		menuBio.addSeparator({ menuName: lg.Sources });

		menuBio.newMenu({
			menuName: lg['Open file location'],
			appendTo: lg.Sources,
			flags: this.getOpenFlag()
		});

		for (let i = 0; i < 8; i++) { menuBio.newItem({
			menuName: lg['Open file location'],
			str:  this.openName[i],
			func: () => $Bio.browser(`explorer /select,"${this.path.open[i]}"`, false),
			flags: this.getOpenFlag(),
			separator: !i && this.openName.length > 1 && this.path.img || this.path.txt[3] && i == this.openName.length - 2 && this.openName.length > 2,
			hide: !this.openName[i]
		}); }

		menuBio.addSeparator({ menuName: lg.Sources });

		if (pptBio.menuShowPaste == 2 || pptBio.menuShowPaste && this.shift) {
			menuBio.newMenu({
				menuName: lg['Paste text from clipboard'],
				appendTo: lg.Sources,
				separator: pptBio.menuShowPaste == 2 || pptBio.menuShowPaste && this.shift
			});
			for (let i = 0; i < 5; i++) { menuBio.newItem({
				menuName: lg['Paste text from clipboard'],
				str: [pptBio.artistView ? lg['Biography [allmusic location]'] : lg['Review [allmusic location]'], pptBio.artistView ? lg['Biography [last.fm location]'] : lg['Review [last.fm location]'], pptBio.artistView ? lg['Biography [wikipedia location]'] : lg['Review [wikipedia location]'], lg['Open last edited'], lg.Undo][i],
				func: () => this.setPaste(i),
				flags: !i && !this.path.am[2] || i == 1 && !this.path.lfm[2]  || i == 2 && !this.path.wiki[2] || i == 3 && !this.undo.path || i == 4 && this.undo.text == '#!#' ? MF_GRAYED_BIO : MF_STRING_BIO,
				separator: i == 2 || i == 3
			}); }
		}

		menuBio.newItem({
			menuName: lg.Sources,
			str: lg['Force update'],
			func: () => panelBio.callServer(1, panelBio.id.focus, 'bio_forceUpdate', 0)
		});

		const style_arr = panelBio.style.name.slice();
		menuBio.newMenu({
			menuName: lg.Layout
		});

		const style = pptBio.sameStyle ? pptBio.style : pptBio.artistView ? pptBio.bioStyle : pptBio.revStyle
		style_arr.forEach((v, i) => menuBio.newItem({
			menuName: lg.Layout,
			str: v,
			func: () => this.setStyle(i),
			checkRadio: style <= style_arr.length - 1 && i == style,
			separator: i == 3 || style_arr.length > 5 && i == style_arr.length - 1
		}));

		menuBio.newMenu({
			menuName: lg['Create && manage styles'],
			appendTo: lg.Layout
		});

		[lg['Create new style...'], lg['Rename custom style...'], lg['Delete custom style...'], lg['Export custom style...'], lg['Reset style...']].forEach((v, i) => menuBio.newItem({
			menuName: lg['Create && manage styles'],
			str: v,
			func: () => this.setStyles(i),
			flags: !i || pptBio.style > 4 || i == 4 ? MF_STRING_BIO : MF_GRAYED_BIO,
			separator: !i
		}));

		menuBio.addSeparator({ menuName: lg.Layout });

		menuBio.newMenu({
			menuName: lg.Filmstrip,
			appendTo: lg.Layout
		});

		[lg.Top, lg.Right, lg.Bottom, lg.Left, lg['Overlay image area'], lg['Reset to default size...']].forEach((v, i) => menuBio.newItem({
			menuName: lg.Filmstrip,
			str: v,
			func: () => {
				if (i == 4) pptBio.toggle('filmStripOverlay');
				filmStrip.set(i == 4 ? pptBio.filmStripPos : i)
			},
			flags: i != 4 || pptBio.style != 4 ? MF_STRING_BIO : MF_GRAYED_BIO,
			checkItem: i == 4 && (pptBio.filmStripOverlay || (pptBio.style == 4 && !pptBio.text_only && !pptBio.img_only)),
			checkRadio: i < 4 && i == pptBio.filmStripPos,
			separator: i == 3 || i == 4
		}));

		menuBio.addSeparator({ menuName: lg.Layout });

		[lg['Reset zoom'], lg.Reload].forEach((v, i) => menuBio.newItem({
			menuName: lg.Layout,
			str: v,
			func: () => !i ? butBio.resetZoom() : window.Reload()
		}));

		menuBio.newMenu({
			menuName: lg.Image
		});

		menuBio.newItem({
			menuName: lg.Image,
			str: lg['Auto cycle'],
			func: () => pptBio.toggle('cycPic'),
			checkItem: pptBio.cycPic,
			separator: true
		});

		if (pptBio.style < 4) {
			menuBio.newMenu({
				menuName: lg.Alignment,
				appendTo: lg.Image
			});
			for (let i = 0; i < 4; i++) { menuBio.newItem({
				menuName: lg.Alignment,
				str: pptBio.style == 0 || pptBio.style == 2 ? [lg.Left, lg.Centre, lg.Right, lg['Align with text']][i] : [lg.Top, lg.Centre, lg.Bottom, lg['Align with text']][i],
				func: () => this.setImageAlignnment(i, 'standard'),
				checkItem: i == 3 && pptBio.textAlign,
				checkRadio: i == (pptBio.style == 0 || pptBio.style == 2 ? pptBio.alignH : pptBio.alignV),
				separator: i == 2
			}); }
		}

		if (pptBio.style > 3) {
			menuBio.newMenu({
				menuName: lg['Alignment horizontal'],
				appendTo: lg.Image
			});
			[lg.Left, lg.Centre, lg.Right].forEach((v, i) => menuBio.newItem({
				menuName: lg['Alignment horizontal'],
				str: v,
				func: () => this.setImageAlignnment(i, 'horizontal'),
				checkRadio:  i == pptBio.alignH
			}));
			menuBio.newMenu({
				menuName: lg['Alignment vertical'],
				appendTo: lg.Image
			});
			[lg.Top, lg.Centre, lg.Bottom, lg.Auto].forEach((v, i) => menuBio.newItem({
				menuName: lg['Alignment vertical'],
				str: v,
				func: () => this.setImageAlignnment(i, 'vertical'),
				checkRadio: [!pptBio.alignV && !pptBio.alignAuto, pptBio.alignV == 1 && !pptBio.alignAuto, pptBio.alignV == 2 && !pptBio.alignAuto, pptBio.alignAuto][i],
				separator: i == 2
			}));
		}

		menuBio.addSeparator({ menuName: lg.Image });

		menuBio.newMenu({
			menuName: lg['Black list'],
			appendTo: lg.Image
		});

		for (let i = 0; i < 3; i++) { menuBio.newItem({
			menuName: lg['Black list'],
			str: this.img.blacklistStr[i],
			func: () => this.setImageBlacklist(i),
			flags: !i && this.img.isLfm || i == 2 ? MF_STRING_BIO : MF_GRAYED_BIO,
			hide: i == 2 && imgBio.blackList.undo[0] != this.img.artistClean
		}); }

		this.img.blacklist.forEach((v, i) => menuBio.newItem({
			menuName: lg['Black list'],
			str: (`${this.img.artist}_${v}`).replace(/&/g, '&&'),
			func: () => this.setImageBlacklist(i + (imgBio.blackList.undo[0] == this.img.artistClean ? 3 : 2))
		}));

		menuBio.addSeparator({});

		if (pptBio.menuShowPlaylists == 2 || pptBio.menuShowPlaylists && this.shift) {
			const pl_no = Math.ceil(this.playlist.menu.length / 30);
			menuBio.newMenu({
				menuName: lg.Playlists,
				separator: pptBio.menuShowPlaylists == 2 || pptBio.menuShowPlaylists && this.shift
			});
			for (let j = 0; j < pl_no; j++) {
				const n = `# ${j * 30 + 1} - ${Math.min(this.playlist.menu.length, 30 + j * 30)}${30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? '  >>>' : ''}`;
				menuBio.newMenu({
					menuName: n,
					appendTo: lg.Playlists
				});
				for (let i = j * 30; i < Math.min(this.playlist.menu.length, 30 + j * 30); i++) {
					menuBio.newItem({
						menuName: n,
						str: this.playlist.menu[i].name,
						func: () => this.setPlaylist(i),
						checkRadio: i == plman.ActivePlaylist
					});
				}
			}
		}

		if (pptBio.menuShowTagger == 2 || pptBio.menuShowTagger && this.shift) {
			menuBio.newMenu({
				menuName: lg.Tagger,
				str: lg.Tagger + (this.handles.Count ? '' : lg[': N/A no playlist tracks selected']),
				flags: this.handles.Count ? MF_STRING_BIO : MF_GRAYED_BIO,
				separator: pptBio.menuShowTagger == 2 || pptBio.menuShowTagger && this.shift
			});
			for (let i = 0; i < 13 + 4; i++) { menuBio.newItem({
				menuName: lg.Tagger,
				str: this.getTaggerStr(i),
				func: () => cfg.setTag(i, this.handles),
				flags: !i || i == 13 + 1 && !this.tags ? MF_GRAYED_BIO : MF_STRING_BIO,
				checkItem: i && i < 13 + 1 && cfg[`tagEnabled${i - 1}`],
				separator: !i || i == 5 || i == 11 || i == 13
			}); }
		}

		if (pptBio.menuShowMissingData == 2 || pptBio.menuShowMissingData && this.shift) {
			menuBio.newMenu({
				menuName: lg['Missing data'],
				separator: pptBio.menuShowMissingData == 2 || pptBio.menuShowMissingData && this.shift
			});
			[lg['Album review [allmusic]'], lg['Album review [last.fm]'], lg['Album review [wikipedia]'], lg['Biography [allmusic]'], lg['Biography [last.fm]'], lg['Biography [wikipedia]'], lg['Photos [last.fm]']].forEach((v, i) => menuBio.newItem({
				menuName: lg['Missing data'],
				str: v,
				func: () => this.checkMissingData(i),
				separator: i == 2 || i == 5
			}));
		}

		if (pptBio.menuShowInactivate == 2 || pptBio.menuShowInactivate && this.shift) {
			menuBio.newItem({
				str: pptBio.panelActive ? lg.Inactivate : lg['Activate biography'],
				func: () => panelBio.inactivate(),
				separator: true
			});
		}

		for (let i = 0; i < 2; i++) { menuBio.newItem({
			str: [popUpBoxBio.ok ? lg['Options...'] : lg['Options: see console'], lg['Configure...']][i],
			func: () => !i ? cfg.open('PanelCfg') : window.EditScript(),
			separator: !i && this.shift,
			hide: i && !this.shift
		}); }
	}

	checkMissingData(i) {
		switch (i) {
			case 0:
				this.missingRev('foAmRev', 'AllMusic', 'Album Review');
				break;
			case 1:
				this.missingRev('foLfmRev', 'Last.fm', 'Album Review');
				break;
			case 2:
				this.missingRev('foWikiRev', 'Wikipedia', 'Album Review');
				break;
			case 3:
				this.missingBio('foAmBio', 'AllMusic', 'Biography');
				break;
			case 4:
				this.missingBio('foLfmBio', 'Last.fm', 'Biography');
				break;
			case 5:
				this.missingBio('foWikiBio', 'Wikipedia', 'Biography');
				break;
			case 6:
				this.missingArtImg('foImgArt', 'Last.fm', 'Photo');
				break;
		}
	}

	fresh() {
		if (panelBio.block() || !pptBio.cycItem || panelBio.zoom() || panelBio.id.lyricsSource && lyricsBio.display() && lyricsBio.scroll) return;
		if (pptBio.artistView) {
			this.counter.bio++;
			if (this.counter.bio < pptBio.cycTimeItem) return;
			this.counter.bio = 0;
			if (panelBio.art.list.length < 2) return;
		} else {
			this.counter.rev++;
			if (this.counter.rev < pptBio.cycTimeItem) return;
			this.counter.rev = 0;
			if (panelBio.alb.list.length < 2) return;
		}
		this.wheel(1, true, false);
	}

	getBlacklistImageItems() {
		const imgInfo = imgBio.pth();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1); // needed for init
		this.img.blacklist = [];
		this.path.blackList = `${cfg.storageFolder}blacklist_image.json`;

		if (!$Bio.file(this.path.blackList)) { $Bio.save(this.path.blackList, JSON.stringify({
			blacklist: {}
		}), true); }

		if ($Bio.file(this.path.blackList)) {
			this.img.artistClean = $Bio.clean(this.img.artist).toLowerCase();
			this.img.list = $Bio.jsonParse(this.path.blackList, false, 'file');
			this.img.blacklist = this.img.list.blacklist[this.img.artistClean] || [];
		}

		this.img.blacklistStr = [this.img.isLfm ? `${lg['+ Add'] + (!panelBio.style.showFilmStrip ? '' : lg[' main image']) + lg[' to black list: '] + this.img.artist}_${this.img.name}` : lg['+ Add to black list: '] + (this.img.name ? lg['N/A - requires last.fm photo. Selected image: '] + this.img.name : lg['N/A - no'] + (!panelBio.style.showFilmStrip ? '' : '') + lg[' image file']), this.img.blacklist.length ? lg[' - Remove from black list (click name): '] : lg['No black listed images for current artist'], lg.Undo];
	}

	getDisplayStr() {
		const m = pptBio.artistView ? pptBio.bioMode : pptBio.revMode;
		this.display.check = [pptBio.sameStyle ? !pptBio.img_only && !pptBio.text_only : m == 0, pptBio.sameStyle ? pptBio.img_only : m == 1, pptBio.sameStyle ? pptBio.text_only : m == 2, pptBio.showFilmStrip, pptBio.heading, pptBio.summaryShow, false, pptBio.artistView, !pptBio.artistView, !panelBio.id.focus, panelBio.id.focus];
		const n = [lg['Image+text'], lg.Image, lg.Text, lg.Filmstrip, lg.Heading, lg.Summary, pptBio.summaryCompact ? lg['Summary expand'] : lg['Summary compact'], lg['Artist view'], lg['Album view'], lg['Prefer nowplaying'], !panelBio.id.lyricsSource && !panelBio.id.nowplayingSource ? lg['Follow selected track (playlist)'] : lg['Follow selected track: N/A lyrics or nowplaying enabled']];
		const click = [!this.display.check[0] ? `\t${lg['Middle click']}` : '', !this.display.check[1] && !pptBio.text_only && !pptBio.img_only ? `\t${lg['Middle click']}` : '', !this.display.check[2] && !pptBio.img_only ? `\t${lg['Middle click']}` : '', `\t${lg['Alt+Middle click']}`, '', '', `\t${lg.Click}`, !pptBio.artistView ? (!pptBio.dblClickToggle ? `\t${lg.Click}` : `\t${lg['Double click']}`) : '', pptBio.artistView ? (!pptBio.dblClickToggle ? `\t${lg.Click}` : `\t${lg['Double click']}`) : '', '', ''];
		this.display.str = n.map((v, i) => v + click[i])
	}

	getlookUpStr(i, j, artist) {
		return [
			[lg['Manual cycle: wheel over button'], lg['Auto cycle items'], popUpBoxBio.ok ? lg['Options...'] : lg['Options: see console'], lg.Reload][i],
			[lg['Show similar artists'], lg['Show more tags (circle button if present)'], lg['Show artist history'], lg['Auto lock'], lg['Reset artist history...'], lg['Last.fm: '] + artist + lg['...'], lg['Last.fm: '] + artist + lg[': similar artists...'], lg['Last.fm: '] + artist + lg[': top albums...'], lg['Allmusic: '] + artist + lg['...']][i],
			[lg['Show top albums'], lg['Show album history'], lg['Auto lock'], lg['Reset album history...'], lg['Last.fm: '] + artist + lg['...'], lg['Last.fm: '] + artist + lg[': similar artists...'], lg['Last.fm: '] + artist + lg[': top albums...'], lg['Allmusic: '] + artist + lg['...']][i]
		][j];
	}

	getOpenFlag() {
		return this.path.img || this.path.am[3] || this.path.lfm[3] || this.path.wiki[3] || this.path.txt[3] || this.path.tracksAm[3] || this.path.tracksLfm[3] || this.path.tracksWiki[3] ? MF_STRING_BIO : MF_GRAYED_BIO;
	}

	getOpenName() {
		const fo = [this.path.img, this.path.am[3], this.path.lfm[3], this.path.wiki[3], this.path.tracksAm[3], this.path.tracksLfm[3], this.path.tracksWiki[3], this.path.txt[3]];
		this.openName = [`${lg['Image ']}\t${lg['Alt+Click']}`, pptBio.artistView ? lg['Biography [allmusic]'] : lg['Review [allmusic]'], pptBio.artistView ? lg['Biography [last.fm]'] : lg['Review [last.fm]'], pptBio.artistView ? lg['Biography [wikipedia]'] : lg['Review [wikipedia]'], pptBio.artistView ? '' : lg['Tracks [allmusic]'], pptBio.artistView ? '' : lg['Tracks [last.fm]'], pptBio.artistView ? '' : lg['Tracks [wikipedia]'], pptBio.artistView ? txt.bio.subhead.txt[0] : txt.rev.subhead.txt[0]];
		let i = this.openName.length;
		while (i--)
			{ if (!fo[i]) {
				this.openName.splice(i, 1);
				fo.splice(i, 1);
				this.path.open.splice(i, 1);
			} }
	}

	getSourceNames() {
		const b = pptBio.artistView ? 'Bio' : 'Rev';
		const n = b.toLowerCase();
		this.types = !txt[n].reader ? $Bio.source.amLfmWiki : $Bio.source.amLfmWikiTxt;
		this.sources = [lg.Allmusic, lg['Last.fm'], lg.Wikipedia];
		this.sources = this.sources.map(v => v + (pptBio.artistView ? ' biography' : ' review'));
		if (txt[n].reader) this.sources.push(txt[n].subhead.txt[0] || '');
		if (!panelBio.stndItem() && (txt.reader[n].lyrics || txt.reader[n].props)) this.sources[3] += ' // current track';
	}

	getTaggerStr(i) {
		return !i ? lg['Write existing file info to tags: '] : i == 13 + 1 ? lg['All tagger settings...'] : i == 13 + 2 ? (cfg.taggerConfirm ? lg['Tag files...'] : `${lg.Tag} ${this.handles.Count} ${this.handles.Count > 1 ? lg.tracks : lg.track}...`) + (this.tags ? '' : lg[' N/A no tags enabled']) + (cfg.tagEnabled5 || cfg.tagEnabled7 ? tagBio.genres.length > 700 || !cfg.useWhitelist ? '' : lg[' WARNING: last.fm genre whitelist not found or invalid [try force update - needs internet connection]'] : '') : i == 13 + 3 ? lg.Cancel : i == 11 ? cfg[`tagName${i - 1}`] + (cfg[`tagEnabled${i - 1}`] ? ` (${cfg[`tagEnabled${i + 2}`]})` : '') : cfg[`tagName${i - 1}`];
	}

	images(v) {
		return name.isLfmImg(fsoBio.GetFileName(v));
	}

	isRevAvail() {
		const type = ['alb', 'trk'];
		type.forEach(w => {
			this[`${w}Avail`] = $Bio.source.amLfmWiki.some(v => pptBio.lockBio ? txt.rev.loaded.ix == txt.avail[`${v}${w}`] : txt.avail[`${v}${w}`] != -1);
		});
	}

	lookUpAlbum(i) {
		const origArr = JSON.stringify(panelBio.alb.list);
		switch (true) {
			case i < panelBio.alb.list.length: {
				if (origArr != JSON.stringify(panelBio.alb.list) || !i && !panelBio.alb.ix || panelBio.alb.ix == i) break;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panelBio.alb.ix = i;
				imgBio.get = false;
				txt.get = 0;
				let force = false;
				if (pptBio.sourcerev == 3) {
					pptBio.sourcerev = 0;
					this.setSource('Rev');
				}
				panelBio.style.inclTrackRev = pptBio.inclTrackRev;
				if (pptBio.inclTrackRev) {
					if (i) panelBio.style.inclTrackRev = 0;
					txt.albumFlush();
					force = true;
				}
				if (panelBio.alb.list[panelBio.alb.ix].composition && pptBio.sourcerev != 0 && pptBio.sourcerev != 2) {
					pptBio.sourcerev = txt.rev.am ? 0 : txt.rev.wiki ? 2 : txt.rev.am;
					this.setSource('Rev');
				}
				txt.getItem(false, panelBio.art.ix, panelBio.alb.ix, force);
				txt.getScrollPos();
				imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
				panelBio.callServer(false, panelBio.id.focus, 'bio_lookUpItem', 0);
				filmStrip.check();
				if (pptBio.autoLock) panelBio.mbtn_up(1, 1, true);
				if (panelBio.alb.list[panelBio.alb.ix].type.includes('history')) break;
				panelBio.logAlbumHistory(panelBio.alb.list[panelBio.alb.ix].artist, panelBio.alb.list[panelBio.alb.ix].album);
				panelBio.getList();
				break;
			}
			case i == panelBio.alb.list.length + 1:
				pptBio.toggle('cycItem');
				break;
			case i == panelBio.alb.list.length + 2:
				cfg.open('PanelCfg');
				break;
			case i == panelBio.alb.list.length + 3:
				window.Reload();
				break;
		}
		this.counter.rev = 0;
	}

	lookUpAlbumItems(i) {
		switch (i) {
			case 0:
				panelBio.alb.ix = 0;
				pptBio.toggle('showTopAlbums');
				panelBio.getList(!pptBio.showTopAlbums, true);
				break;
			case 1:
				panelBio.alb.ix = 0;
				pptBio.toggle('showAlbumHistory');
				panelBio.getList(!pptBio.showAlbumHistory, true);
				break;
			case 2:
				pptBio.toggle('autoLock');
				break;
			case 3:
				panelBio.resetAlbumHistory();
				break;
			default: {
				const artist = panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(panelBio.id.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 7) $Bio.browser(`https://www.last.fm/${cfg.language == 'EN' ? '' : `${cfg.language.toLowerCase()}/`}music/${encodeURIComponent(artist)}${brArr[i - 4]}`, true);
				else $Bio.browser(`https://www.allmusic.com/search/artists/${encodeURIComponent(artist)}`, true);
				break;
			}
		}
		if (i < 4) {
			txt.logScrollPos();
			filmStrip.logScrollPos();
			imgBio.get = false;
			txt.get = 0;
			if (pptBio.sourcerev == 3) {
				pptBio.sourcerev = 0;
				this.setSource('Rev');
			}
			panelBio.style.inclTrackRev = pptBio.inclTrackRev;
			if (pptBio.inclTrackRev) {
				if (panelBio.alb.list[panelBio.alb.ix].type.includes('history')) panelBio.style.inclTrackRev = 0;
				txt.albumFlush();
			}
			txt.getItem(false, panelBio.art.ix, panelBio.alb.ix, true);
			txt.getScrollPos();
			imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
			panelBio.callServer(false, panelBio.id.focus, 'bio_lookUpItem', 0);
			filmStrip.check();
		}
	}

	lookUpArtist(i) {
		const origArr = JSON.stringify(panelBio.art.list);
		switch (true) {
			case i < panelBio.art.list.length:
				if (origArr != JSON.stringify(panelBio.art.list) || !i && !panelBio.art.ix || panelBio.art.ix == i) break;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panelBio.art.ix = i;
				imgBio.get = false;
				txt.get = 0;
				if (pptBio.sourcebio == 3) {
					pptBio.sourcebio = 1;
					this.setSource('Bio');
				}
				txt.getItem(false, panelBio.art.ix, panelBio.alb.ix);
				txt.getScrollPos();
				imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
				panelBio.callServer(false, panelBio.id.focus, 'bio_lookUpItem', 0);
				filmStrip.check();
				if (pptBio.autoLock) panelBio.mbtn_up(1, 1, true);
				if (panelBio.art.list[panelBio.art.ix].type.includes('history')) break;
				panelBio.logArtistHistory(panelBio.art.list[panelBio.art.ix].name);
				panelBio.getList();
				break;
			case i == panelBio.art.list.length + 1:
				pptBio.toggle('cycItem');
				break;
			case i == panelBio.art.list.length + 2:
				cfg.open('PanelCfg');
				break;
			case i == panelBio.art.list.length + 3:
				window.Reload();
				break;
		}
		this.counter.bio = 0;
	}

	lookUpArtistItems(i) {
		switch (i) {
			case 0:
				panelBio.art.ix = 0;
				pptBio.toggle('showSimilarArtists');
				panelBio.getList(!pptBio.showSimilarArtists);
				break;
			case 1:
				panelBio.art.ix = 0;
				pptBio.toggle('showMoreTags');
				panelBio.getList(!pptBio.showMoreTags);
				break;
			case 2:
				panelBio.art.ix = 0;
				pptBio.toggle('showArtistHistory');
				panelBio.getList(!pptBio.showArtistHistory);
				break;
			case 3:
				pptBio.toggle('autoLock');
				break;
			case 4:
				panelBio.resetArtistHistory();
				break;
			default: {
				const artist = panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(panelBio.id.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 8) $Bio.browser(`https://www.last.fm/${cfg.language == 'EN' ? '' : `${cfg.language.toLowerCase()}/`}music/${encodeURIComponent(artist)}${brArr[i - 5]}`, true);
				else $Bio.browser(`https://www.allmusic.com/search/artists/${encodeURIComponent(artist)}`, true);
				break;
			}
		}
		if (i < 5) {
			txt.logScrollPos();
			filmStrip.logScrollPos();
			if (pptBio.sourcebio == 3) {
				pptBio.sourcebio = 1;
				this.setSource('Bio');
			}
			imgBio.get = false;
			txt.get = 0;
			txt.getItem(false, panelBio.art.ix, panelBio.alb.ix);
			txt.getScrollPos();
			imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
			panelBio.callServer(false, panelBio.id.focus, 'bio_lookUpItem', 0);
			filmStrip.check();
		}
	}

	missingArtImg(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(cfg.tf.artist);
				const sort = FbTitleFormat(`${cfg.tf.artist} | ${cfg.tf.album} | [[%discnumber%.]%tracknumber%. ][%track artist% - ]${cfg.tf.title}`);
				let a = '';
				let cur_a = '####';
				let found = false;
				const m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const artists = tf_a.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					a = artists[i].toLowerCase();
					if (a != cur_a) {
						cur_a = a;
						const pth = panelBio.cleanPth(cfg.pth[n1], h, 'tag');
						let files = utils.Glob(`${pth}*`);
						files = files.some(this.images);
						if (a && !files) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		const caption = this.popUpTitle;
		const prompt = this.popUpText(n2, n3);
		const wsh = popUpBoxBio.isHtmlDialogSupported() ? popUpBoxBio.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	missingBio(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(cfg.tf.artist);
				const sort = FbTitleFormat(`${cfg.tf.artist} | ${cfg.tf.album} | [[%discnumber%.]%tracknumber%. ][%track artist% - ]${cfg.tf.title}`);
				let a = '';
				let cur_a = '####';
				let found = false;
				const m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const artists = tf_a.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					a = artists[i].toLowerCase();
					if (a != cur_a) {
						cur_a = a;
						const pth = `${panelBio.cleanPth(cfg.pth[n1], h, 'tag') + $Bio.clean(a) + cfg.suffix[n1]}.txt`;
						if (a && !$Bio.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		const caption = this.popUpTitle;
		const prompt = this.popUpText(n2, n3);
		const wsh = popUpBoxBio.isHtmlDialogSupported() ? popUpBoxBio.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	missingRev(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_albumArtist = FbTitleFormat(cfg.tf.albumArtist);
				const tf_album = FbTitleFormat(cfg.tf.album);
				const sort = FbTitleFormat(`${cfg.tf.albumArtist} | ${cfg.tf.album} | [[%discnumber%.]%tracknumber%. ][%track artist% - ]${cfg.tf.title}`);
				let albumArtist = '';
				let cur_albumArtist = '####';
				let cur_album = '####';
				let album = '';
				let found = false;
				const m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const albumartists = tf_albumArtist.EvalWithMetadbs(handleList);
				const albums = tf_album.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					albumArtist = albumartists[i].toLowerCase();
					album = albums[i].toLowerCase();
					album = !cfg.albStrip ? name.albumTidy(album) : name.albumClean(album);
					if (albumArtist + album != cur_albumArtist + cur_album) {
						cur_albumArtist = albumArtist;
						cur_album = album;
						let pth = `${panelBio.cleanPth(cfg.pth[n1], h, 'tag') + $Bio.clean(albumArtist)} - ${$Bio.clean(album)}${cfg.suffix[n1]}.txt`;
						if (pth.length > 259) {
							album = $Bio.abbreviate(album);
							pth = `${panelBio.cleanPth(cfg.pth[n1], h, 'tag') + $Bio.clean(albumArtist)} - ${$Bio.clean(album)}${cfg.suffix[n1]}.txt`;
						}
						if (albumArtist && album && !$Bio.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		const caption = this.popUpTitle;
		const prompt = this.popUpText(n2, n3);
		const wsh = popUpBoxBio.isHtmlDialogSupported() ? popUpBoxBio.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	playlists_changed() {
		if (!pptBio.menuShowPlaylists) return;
		this.playlist.menu = [];
		for (let i = 0; i < plman.PlaylistCount; i++) { this.playlist.menu.push({
			name: plman.GetPlaylistName(i).replace(/&/g, '&&'),
			ix: i
		}); }
	}

	popUpText(n2, n3) {
		return `Check media library and create playlist: ${n2} ${n3} Missing\n\nServer settings will be used.\n\nADVISORY: This operation analyses a lot of data. It may trigger an "Unresponsive script" pop-up. If that happens choose "Continue" or "Don't ask me again". Choosing "Stop script" will trigger an error.\n\nContinue?`;
	}

	rbtn_up(x, y) {
		this.right_up = true;
		this.shift = vkBio.k('shift');
		const imgInfo = imgBio.pth();
		this.docTxt = $Bio.getClipboardData() || '';
		if (!tagBio.genres.length) tagBio.setGenres();
		this.getDisplayStr();
		this.getSourceNames();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1);
		this.isRevAvail();
		this.path.am = pptBio.artistView ? txt.bioPth('Am') : txt.revPth('Am');
		this.path.lfm = pptBio.artistView ? txt.bioPth('Lfm') : txt.revPth('Lfm');
		this.path.txt = pptBio.artistView ? txt.txtBioPth() : txt.txtRevPth();
		this.path.wiki = pptBio.artistView ? txt.bioPth('Wiki') : txt.revPth('Wiki');
		this.path.tracksAm = pptBio.artistView ? '' : txt.trackPth('Am');
		this.path.tracksLfm = pptBio.artistView ? '' : txt.trackPth('Lfm');
		this.path.tracksWiki = pptBio.artistView ? '' : txt.trackPth('Wiki');
		this.path.open = [this.path.img, this.path.am[1], this.path.lfm[1], this.path.wiki[1], this.path.tracksAm[1], this.path.tracksLfm[1], this.path.tracksWiki[1], this.path.txt[1]];
		this.getOpenName();
		this.getBlacklistImageItems();
		if (pptBio.menuShowTagger == 2 || pptBio.menuShowTagger && this.shift) this.handles = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		this.tagsEnabled();

		menuBio.load(x, y);
		this.right_up = false;

		// * Link with top menu Options > Biography > Display
		if (!pptBio.img_only && !pptBio.text_only) {
			pref.biographyDisplay = 'Image+text';
		} else if (pptBio.img_only) {
			pref.biographyDisplay = 'Image';
		} else if (pptBio.text_only) {
			pref.biographyDisplay = 'Text';
		}
	}

	sendToPlaylist(m, n2, n3) {
		if (m.Count) {
			const pln = plman.FindOrCreatePlaylist(`${n2} ${n3} Missing`, false);
			plman.ActivePlaylist = pln;
			plman.ClearPlaylist(pln);
			plman.InsertPlaylistItems(pln, 0, m);
		} else fb.ShowPopupMessage(`${n2} ${n3}: None missing`, 'Biography');
	}

	setCover(i) {
		switch (true) {
			case i < 5:
				!pptBio.loadCovAllFb ? pptBio.covType = i : imgBio.cov.selection[i] = imgBio.cov.selection[i] == -1 ? i : -1;
				imgBio.cov.selFiltered = imgBio.cov.selection.filter(v => v != -1);
				if (!imgBio.cov.selFiltered.length) {
					imgBio.cov.selection = [0, -1, -1, -1, -1];
					imgBio.cov.selFiltered = [0];
				}
				pptBio.loadCovSelFb = JSON.stringify(imgBio.cov.selection);
				!pptBio.loadCovAllFb ? imgBio.getImages() : imgBio.check();
				break;
			case i == 5:
				imgBio.toggle('loadCovAllFb');
				break;
			case i == 6:
				imgBio.toggle('loadCovFolder');
				break;
		}
	}

	setDisplay(i) {
		switch (i) {
			case 0:
			case 1:
			case 2:
				if (pptBio.sameStyle) panelBio.mode(i);
				else {
					pptBio.artistView ? pptBio.bioMode = i : pptBio.revMode = i;
					txt.refresh(0);
				}
				break;
			case 3:
				filmStrip.mbtn_up('onOff');
				break;
			case 4:
				txt.bio.scrollPos = {}; txt.rev.scrollPos = {};
				pptBio.heading = !pptBio.heading ? 1 : 0;
				panelBio.style.fullWidthHeading = pptBio.heading && pptBio.fullWidthHeading;
				if (panelBio.style.inclTrackRev == 1) txt.logScrollPos();
				txt.refresh(1);
				break;
			case 5:
			case 6:
				txt.bio.scrollPos = {}; txt.rev.scrollPos = {};
				pptBio.toggle(i == 5 ? 'summaryShow' : 'summaryCompact');
				panelBio.setSummary();
				txt.refresh(1);
				break;
			case 7:
			case 8:
				panelBio.click('', '', true);
				break;
			case 9:
			case 10:
				pptBio.toggle('focus');
				panelBio.id.focus = pptBio.focus;
				panelBio.changed();
				txt.on_playback_new_track();
				imgBio.on_playback_new_track();
				break;
		}
	}

	setImageAlignnment(i, type) {
		switch (type) {
			case 'standard':
				switch (i) {
					case 3:
						pptBio.toggle('textAlign');
						panelBio.setStyle();
						imgBio.clearCache();
						imgBio.getImages();
						break;
					default:
						if (pptBio.style == 0 || pptBio.style == 2) pptBio.alignH = i;
						else pptBio.alignV = i;
						imgBio.clearCache();
						imgBio.getImages();
						break;
				}
				break;
			case 'horizontal':
				pptBio.alignH = i;
				imgBio.clearCache();
				imgBio.getImages();
				break;
			case 'vertical':
				switch (i) {
					case 3:
						pptBio.alignAuto = true;
						panelBio.setStyle();
						imgBio.clearCache();
						imgBio.getImages();
						break;
					default:
						pptBio.alignV = i;
						pptBio.alignAuto = false;
						panelBio.setStyle();
						imgBio.clearCache();
						imgBio.getImages();
						break;
					}
					break;
		}
	}

	setImageBlacklist(i) {
		if (!i) {
			if (!this.img.list.blacklist[this.img.artistClean]) this.img.list.blacklist[this.img.artistClean] = [];
			this.img.list.blacklist[this.img.artistClean].push(this.img.name);
		} else if (imgBio.blackList.undo[0] == this.img.artistClean && i == 2) {
			if (!this.img.list.blacklist[imgBio.blackList.undo[0]]) this.img.list.blacklist[this.img.artistClean] = [];
			if (imgBio.blackList.undo[1].length) this.img.list.blacklist[imgBio.blackList.undo[0]].push(imgBio.blackList.undo[1]);
			imgBio.blackList.undo = [];
		} else {
			const bl_ind = i - (imgBio.blackList.undo[0] == this.img.artistClean ? 3 : 2);
			imgBio.blackList.undo = [this.img.artistClean, this.img.list.blacklist[this.img.artistClean][bl_ind]];
			this.img.list.blacklist[this.img.artistClean].splice(bl_ind, 1);
			$Bio.removeNulls(this.img.list);
		}
		const bl = this.img.list.blacklist[this.img.artistClean];
		if (bl) this.img.list.blacklist[this.img.artistClean] = this.sort([...new Set(bl)]);
		imgBio.blackList.artist = '';
		$Bio.save(this.path.blackList, JSON.stringify({
			blacklist: $Bio.sortKeys(this.img.list.blacklist)
		}, null, 3), true);
		imgBio.check();
		window.NotifyOthers('bio_blacklist', 'bio_blacklist');
	}

	setPaste(i) {
		switch (i) {
			case 0: case 1: case 2: {
				const n = pptBio.artistView ? 'bio' : 'rev';
				const s = $Bio.source.amLfmWiki[i];
				this.undo.folder = this.path[s][0];
				this.undo.path = this.path[s][1];
				this.undo.text = $Bio.open(this.undo.path);
				$Bio.buildPth(this.undo.folder);
				$Bio.save(this.undo.path, `${this.docTxt}\r\n\r\nCustom ${pptBio.artistView ? 'Biography' : 'Review'}`, true);
				const b = pptBio.artistView ? 'Bio' : 'Rev';
				const pth = txt[`${n}Pth`](['Am', 'Lfm', 'Wiki'][i]);
				if (this.path[s][1] == pth[1]) {
					pptBio[`source${b}`] = 0;
					txt[n].source[s] = true;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (pptBio.text_only) txt.paint();
				break;
			}
			case 3: {
				const open = (c, w) => {
					if (!$Bio.run(c, w)) fb.ShowPopupMessage('Unable to launch your default text editor.', 'Biography');
				};
				open(`"${this.undo.path}`, 1);
				break;
			}
			case 4:
				if (!this.undo.text.length && $Bio.file(this.undo.path)) {
					fsoBio.DeleteFile(this.undo.path);
					window.NotifyOthers('bio_reload', 'bio_reload');
					if (panelBio.stndItem()) window.Reload();
					else {
						txt.artistFlush();
						txt.albumFlush();
						txt.grab();
						if (pptBio.text_only) txt.paint();
					}
					break;
				}
				$Bio.buildPth(this.undo.folder);
				$Bio.save(this.undo.path, this.undo.text, true);
				this.undo.text = '#!#';
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (pptBio.text_only) txt.paint();
				break;
		}
	}

	setPhotoType(i) {
		pptBio.cycPhoto = i < 2;
		pptBio.cycPhotoLocation = i;
		if (i == 1 && !pptBio.get('SYSTEM.Photo Folder Checked', false)) {
			fb.ShowPopupMessage('Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.', 'Biography: custom folder for photo cycling');
			pptBio.set('SYSTEM.Photo Folder Checked', true);
		}
		imgBio.updImages();
	}

	setPlaylist(i) {
		plman.ActivePlaylist = this.playlist.menu[i].ix;
	}

	setReviewType(i) {
		txt.logScrollPos();
		panelBio.style.inclTrackRev = pptBio.inclTrackRev = [0, 2, 1][i];
		if (pptBio.inclTrackRev) { serverBio.checkTrack({
			focus: panelBio.id.focus,
			force: false,
			menu: true,
			artist: panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(panelBio.id.focus),
			title: name.title(panelBio.id.focus)
		}); }
		txt.refresh(1);
		txt.getScrollPos();
	}

	setSource(b, n) {
		n = n || b.toLowerCase();
		$Bio.source.amLfmWikiTxt.forEach((v, i) => txt[n].source[v] = pptBio[`source${n}`] == i);
		$Bio.source.amLfmWiki.forEach(v => { if (txt[n].source[v]) txt.done[`${v}${b}`] = false });
		txt[n].source.ix = pptBio[`source${n}`];
	}

	setStyle(i) {
		const prop = pptBio.sameStyle ? 'style' : pptBio.artistView ? 'bioStyle' : 'revStyle';
		pptBio[prop] = i;
		imgBio.mask.reset = true;
		pptBio.img_only = false;
		pptBio.text_only = false;
		txt.refresh(0);
		if (pptBio.filmStripOverlay) filmStrip.set(pptBio.filmStripPos);
	}

	setStyles(i) {
		switch (i) {
			case 0:
				panelBio.createStyle();
				break;
			case 1:
				panelBio.renameStyle(pptBio.style);
				break;
			case 2:
				panelBio.deleteStyle(pptBio.style);
				break;
			case 3:
				panelBio.exportStyle(pptBio.style);
				break;
			case 4:
				panelBio.resetStyle(pptBio.style);
				break;
		}
	}

	setTextType(i, b) {
		switch (i) {
			case 0:
			case 1: this.toggle(4, b); break;
			case 2: txt.bio.scrollPos = {}; txt.rev.scrollPos = {}; pptBio.toggle('sourceAll'); txt.refresh(1); break;
			case 3:
				pptBio.toggle('showTrackRevOptions');
				txt.logScrollPos();
				panelBio.style.inclTrackRev = pptBio.inclTrackRev = 0;
				if (pptBio.showTrackRevOptions) { serverBio.checkTrack({
					focus: panelBio.id.focus,
					force: false,
					menu: true,
					artist: panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(panelBio.id.focus),
					title: name.title(panelBio.id.focus)
				}); }
				txt.refresh(1);
				txt.getScrollPos();
				break;
			case 4: pptBio.toggle('classicalMusicMode'); pptBio.classicalAlbFallback = pptBio.classicalMusicMode; txt.refresh(1); break;
		}
	}

	sort(data) {
		return data.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	}

	tagsEnabled() {
		this.tags = false;
		for (let i = 0; i < 13; i++)
			{ if (cfg[`tagEnabled${i}`]) {
				this.tags = true;
				break;
			} }
	}

	toggle(i, b, fix, direction) {
		txt.logScrollPos();
		const n = b.toLowerCase();
		if (i === pptBio[`source${n}`]) return;
		if (i == 4) {
			pptBio.toggle('lockBio');
		} else {
		if (i === '') i = pptBio[`source${n}`];
			if (fix) {
				pptBio[`source${n}`] = i;
			} else if (pptBio.lockBio && !pptBio.sourceAll) {
				const limit = txt[n].reader ? 3 : 2;
				direction == 1 ? pptBio[`source${n}`] = i == limit ? 0 : ++i : pptBio[`source${n}`] = i == 0 ? limit : --i;
			} else if (txt[n].reader) {
				switch (txt[n].loaded.ix) {
					case 0: pptBio[`source${n}`] = direction == 1 ? (txt[n].lfm ? 1 : txt[n].wiki ? 2 : txt[n].txt ? 3 : 0) : (txt[n].txt ? 3 : txt[n].wiki ? 2 : txt[n].lfm ? 1 : 0); break;
					case 1: pptBio[`source${n}`] = direction == 1 ? (txt[n].wiki ? 2 : txt[n].txt ? 3 : txt[n].am ? 0 : 1) : (txt[n].am ? 0 : txt[n].txt ? 3 : txt[n].wiki ? 2 : 1); break;
					case 2: pptBio[`source${n}`] = direction == 1 ? (txt[n].txt ? 3 : txt[n].am ? 0 : txt[n].lfm ? 1 : 2) : (txt[n].lfm ? 1 : txt[n].am ? 0 : txt[n].txt ? 3 : 2); break;
					case 3: pptBio[`source${n}`] = direction == 1 ? (txt[n].am ? 0 : txt[n].lfm ? 1 : txt[n].wiki ? 2 : 3) : (txt[n].wiki ? 2 : txt[n].lfm ? 1 : txt[n].am ? 0 : 3); break;
					}
			} else {
				switch (txt[n].loaded.ix) {
					case 0: pptBio[`source${n}`] = direction == 1 ? (txt[n].lfm ? 1 : txt[n].wiki ? 2 : 0) : (txt[n].wiki ? 2 : txt[n].lfm ? 1 : 0); break;
					case 1: pptBio[`source${n}`] = direction == 1 ? (txt[n].wiki ? 2 : txt[n].am ? 0 : 1) : (txt[n].am ? 0 : txt[n].wiki ? 2 : 1); break;
					case 2: pptBio[`source${n}`] = direction == 1 ? (txt[n].am ? 0 : txt[n].lfm ? 1 : 2) : (txt[n].lfm ? 1 : txt[n].am ? 0 : 2); break;
				}
			}
		}
		this.setSource(b, n);
		txt.getText(false);
		butBio.src.y = butBio.src.fontSize < 12 || txt[n].loaded.ix == 2 ? 1 : 0;
		txt.getScrollPos();
		imgBio.getImages();
	}

	wheel(step, resetCounters) {
		let i = 0;
		butBio.clearTooltip();
		let force = false;
		switch (true) {
			case pptBio.artistView:
				if (!panelBio.art.uniq.length) break;
				for (i = 0; i < panelBio.art.uniq.length; i++)
					{ if (!panelBio.art.ix && name.artist(panelBio.id.focus) == panelBio.art.uniq[i].name || panelBio.art.ix == panelBio.art.uniq[i].ix) break; }
				i += step;
				if (i < 0) i = panelBio.art.uniq.length - 1;
				else if (i >= panelBio.art.uniq.length) i = 0;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				if (pptBio.sourcebio == 3) {
					pptBio.sourcebio = 1;
					this.setSource('Bio');
				}
				panelBio.art.ix = panelBio.art.uniq[i].ix;
				if (panelBio.art.list[panelBio.art.ix].type.includes('history')) break;
				panelBio.logArtistHistory(panelBio.art.list[panelBio.art.ix].name);
				panelBio.getList();
				break;
			case !pptBio.artistView:
				if (!panelBio.alb.uniq.length) break;
				for (i = 0; i < panelBio.alb.uniq.length; i++)
					{ if (!panelBio.alb.ix && `${name.albumArtist(panelBio.id.focus)} - ${name.album(panelBio.id.focus)}` == `${panelBio.alb.uniq[i].artist} - ${panelBio.alb.uniq[i].album}` || panelBio.alb.ix == panelBio.alb.uniq[i].ix) break; }
				i += step;
				if (i < 0) i = panelBio.alb.uniq.length - 1;
				else if (i >= panelBio.alb.uniq.length) i = 0;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				if (pptBio.sourcerev == 3) {
					pptBio.sourcerev = 0;
					this.setSource('Rev');
				}
				panelBio.alb.ix = panelBio.alb.uniq[i].ix;
				if (panelBio.alb.ix) seeker.show = false;
				if (pptBio.showAlbumHistory && pptBio.inclTrackRev) {
					panelBio.style.inclTrackRev = pptBio.inclTrackRev;
					if (panelBio.alb.list[panelBio.alb.ix].type.includes('history')) panelBio.style.inclTrackRev = 0;
					txt.albumFlush();
					force = true;
				}
				if (panelBio.alb.list[panelBio.alb.ix].type.includes('history')) break;
				panelBio.logAlbumHistory(panelBio.alb.list[panelBio.alb.ix].artist, panelBio.alb.list[panelBio.alb.ix].album);
				panelBio.getList();
				break;
		}
		imgBio.get = false;
		txt.getItem(false, panelBio.art.ix, panelBio.alb.ix, force);
		txt.getScrollPos();
		imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
		panelBio.lookUpServer();
		if (resetCounters) pptBio.artistView ? this.counter.bio = 0 : this.counter.rev = 0;
		filmStrip.check();
	}
}
