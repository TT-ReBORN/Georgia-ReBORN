'use strict';

/** @global @type {number} */
const BIO_MF_GRAYED = 0x00000001;
/** @global @type {number} */
const BIO_MF_STRING = 0x00000000;

class BioMenuManager {
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

	// * METHODS * //

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
		if (!this.menuItems.length) bio.men[this.name]();
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

	newItem({ str = null, func = null, menuName = this.baseMenu, flags = BIO_MF_STRING, checkItem = false, checkRadio = false, separator = false, hide = false }) { this.menuItems.push({ str, func, menuName, flags, checkItem, checkRadio, separator, hide }); }

	newMenu({ menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = BIO_MF_STRING, separator = false, hide = false }) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) this.menuItems.push({ menuName, appendMenu: true, str, appendTo, flags, separator, hide });
	}

	run(idx) {
		const v = this.func[idx];
		if (v instanceof Function) v();
	}
}

/** @global @type {boolean} */
const bioClearArr = true;

/**
 * The instance of `BioMenuManager` class for biography main menu operations.
 * @typedef {BioMenuManager}
 * @global
 */
const bioMenu = new BioMenuManager('mainMenu', bioClearArr);

/**
 * The instance of `BioMenuManager` class for biography buttion menu operations.
 * @typedef {BioMenuManager}
 * @global
 */
const bioBMenu = new BioMenuManager('buttonMenu', bioClearArr);

class BioMenuItems {
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
			covType: [bioLg.Front, bioLg.Back, bioLg.Disc, bioLg.Icon, bioLg.Artist, bioLg['Cycle above'], bioLg['Cycle from folder']],
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

	// * METHODS * //

	buttonMenu() {
		bioBMenu.newMenu({});
		const artist = bio.panel.art.list.length ? bio.panel.art.list[0].name : bio.name.artist(bio.panel.id.focus);
		switch (bioSet.artistView) {
			case true:
				bio.panel.art.list.forEach((v, i) => bioBMenu.newItem({
					str: v.name.replace(/&/g, '&&') + v.field.replace(/&/g, '&&'),
					func: () => this.lookUpArtist(i),
					flags: v.type != 'label' ? BIO_MF_STRING : BIO_MF_GRAYED,
					checkRadio: i == bio.panel.art.ix,
					separator: !i || v.type == 'similarend' || v.type == 'label' || v.type == 'tagend' || v.type == 'historyend'
				}));
				for (let i = 0; i < 4; i++) { bioBMenu.newItem({
					str: this.getlookUpStr(i, 0),
					func: () => this.lookUpArtist(bio.panel.art.list.length + i),
					flags: !i ? BIO_MF_GRAYED : BIO_MF_STRING,
					checkItem: i == 1 && bioSet.cycItem,
					separator: true
				}); }

				bioBMenu.newMenu({
					menuName: bioLg['More...']
				});
				for (let i = 0; i < 8; i++) { bioBMenu.newItem({
					menuName: bioLg['More...'],
					str: this.getlookUpStr(i, 1, artist),
					func: () => this.lookUpArtistItems(i),
					checkItem: i < 4 && [bioSet.showSimilarArtists, bioSet.showMoreTags, bioSet.showArtistHistory, bioSet.autoLock][i],
					separator: i == 2 || i == 3 || i == 4 || i == 5
				}); }
				break;
			case false:
				bio.panel.alb.list.forEach((v, i) => bioBMenu.newItem({
					str: ((!i || v.type.includes('history') ? `${v.artist.replace(/&/g, '&&')} - ${v.album.replace(/&/g, '&&')}` : v.album.replace(/&/g, '&&')) + (!v.composition ? '' : ' [composition]')).replace(Regex.TextDashLeading, ''),
					func: () => this.lookUpAlbum(i),
					flags: v.type != 'label' && v.album != bioLg['Album History:'] ? BIO_MF_STRING : BIO_MF_GRAYED,
					checkRadio: i == bio.panel.alb.ix,
					separator: !i || v.type == 'albumend' || v.type == 'label' || v.type == 'historyend'
				}));
				for (let i = 0; i < 4; i++) { bioBMenu.newItem({
					str: this.getlookUpStr(i, 0),
					func: () => this.lookUpAlbum(bio.panel.alb.list.length + i),
					flags: !i ? BIO_MF_GRAYED : BIO_MF_STRING,
					checkItem: i == 1 && bioSet.cycItem,
					separator: true
				}); }

				bioBMenu.newMenu({
					menuName: bioLg['More...']
				});
				for (let i = 0; i < 8; i++) { bioBMenu.newItem({
					menuName: bioLg['More...'],
					str: this.getlookUpStr(i, 2, artist),
					func: () => this.lookUpAlbumItems(i),
					checkItem: i < 3 && [bioSet.showTopAlbums, bioSet.showAlbumHistory, bioSet.autoLock][i],
					separator: i == 1 || i == 2 || i == 3 || i == 4
				}); }
				break;
		}
	}

	mainMenu() {
		bioMenu.newMenu({});
		bioMenu.newItem({
			str: `${$Bio.titlecase(bioCfg.cfgBaseName)} server`,
			flags: BIO_MF_GRAYED,
			separator: true,
			hide: !$Bio.server || !this.shift || !bio.vk.k('ctrl')
		});

		const b = bioSet.artistView ? 'Bio' : 'Rev';
		const loadName = bioLg.Load + (!bioSet.sourceAll ? '' : bioLg[' first']);
		const n = b.toLowerCase();
		const separator = !bioSet.artistView && (bioSet.showTrackRevOptions || bio.txt.isCompositionLoaded()) || !bio.panel.stndItem();

		if (grSet.layout === 'default' && grSet.theme.startsWith('custom')) {
			bioMenu.newItem({
				str: !grm.ui.displayCustomThemeMenu ? 'Edit custom theme' : 'Close custom theme menu',
				func: () => {
					grm.ui.initCustomThemeMenuState();
				},
				separator: true
			});
		}

		// * Biography layout switcher
		bioMenu.newItem({
			str: grSet.biographyLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal',
			func: () => {
				grSet.biographyLayout = grSet.biographyLayout === 'normal' ? 'full' : 'normal';
				grm.ui.initBiographyLayoutState();
			},
			separator: true,
			hide: grSet.layout !== 'default'
		});

		// * Browse mode
		bioMenu.newItem({
			str: 'Browse mode',
			func: () => {
				grSet.panelBrowseMode = !grSet.panelBrowseMode;
				grm.ui.initBrowserModeState();
			},
			checkItem: grSet.panelBrowseMode,
			separator: () => true
		});

		bioMenu.newMenu({
			menuName: loadName,
			hide: bioSet.img_only
		});

		this.sources.forEach((v, i) => bioMenu.newItem({
			menuName: loadName,
			str: v,
			func: () => this.toggle(i, b, true),
			flags: bio.txt[n][this.types[i]] ? BIO_MF_STRING : BIO_MF_GRAYED,
			checkRadio: i == bio.txt[n].loaded.ix,
			separator: bio.txt[n].reader ? i == 3 && separator : i == 2 && separator
		}));

		if (bioSet.showTrackRevOptions && !bioSet.artistView && bio.panel.stndItem() && !bio.txt.isCompositionLoaded()) {
			bioMenu.newItem({
				menuName: loadName,
				str: bioLg['Type:'],
				flags: BIO_MF_GRAYED,
				separator: true
			});
			[bioLg.Album, bioLg.Track, bioLg['Prefer both']].forEach((v, i) => bioMenu.newItem({
				menuName: loadName,
				str: v,
				func: () => this.setReviewType(i),
				flags: !bio.txt[n][this.types[0]] && !bio.txt[n][this.types[1]] && !bio.txt[n][this.types[2]] ? BIO_MF_STRING : !bio.txt[n].loaded.txt && [this.albAvail, this.trkAvail, this.albAvail || this.trkAvail][i] ? BIO_MF_STRING : BIO_MF_GRAYED,
				checkRadio: !i && !bioSet.inclTrackRev || i == 1 && bioSet.inclTrackRev == 2 || i == 2 && bioSet.inclTrackRev == 1
			}));
		}

		if (!bio.panel.stndItem() || bio.txt.isCompositionLoaded()) {
			bioMenu.newItem({
				menuName: loadName,
				str: bioLg['Mode: '] + (bioSet.artistView ? bioLg['artist look-up'] : (bio.txt.isCompositionLoaded() ? bioLg['composition loaded'] : bioLg['album look-up'])),
				flags: BIO_MF_GRAYED
			});
		}

		bioMenu.addSeparator({ separator: !bioSet.img_only });

		bioMenu.newMenu({
			menuName: bioLg.Display
		});

		for (let i = 0; i < 11; i++) { bioMenu.newItem({
			menuName: bioLg.Display,
			str: this.display.str[i],
			func: () => this.setDisplay(i),
			flags: i == 1 && bioSet.autoEnlarge || i == 6 && !bioSet.summaryShow || i == 10 && (bio.panel.id.lyricsSource || bio.panel.id.nowplayingSource) ? BIO_MF_GRAYED : BIO_MF_STRING,
			checkItem: (i > 2 && i < 6) && this.display.check[i],
			checkRadio: (i < 3 || i > 6 && i < 9 || i > 8) && this.display.check[i],
			separator: i == 2 || i == 5 || i == 6 || i == 8
		}); }

		bioMenu.addSeparator({});

		bioMenu.newMenu({
			menuName: bioLg.Sources
		});

		bioMenu.newMenu({
			menuName: bioLg.Text,
			appendTo: bioLg.Sources
		});

		for (let i = 0; i < 5; i++) { bioMenu.newItem({
			menuName: bioLg.Text,
			str: [bioLg['Auto-fallback'], bioLg.Static, bioLg.Amalgamate, bioLg['Show track review options on load menu'], bioLg['Prefer composition reviews (allmusic && wikipedia)']][i],
			func: () => this.setTextType(i, b),
			flags: !i && bioSet.sourceAll || i == 1 && bioSet.sourceAll ? BIO_MF_GRAYED : BIO_MF_STRING,
			checkItem: i == 2 && bioSet.sourceAll || i == 3 && bioSet.showTrackRevOptions || i == 4 && bioSet.classicalMusicMode,
			checkRadio: !i && (!bioSet.lockBio || bioSet.sourceAll) || i == 1 && bioSet.lockBio && !bioSet.sourceAll,
			separator: i == 1 || i == 2 || i == 3 && bioCfg.classicalModeEnable,
			hide: i == 4 && !bioCfg.classicalModeEnable
		}); }

		bioMenu.addSeparator({ menuName: bioLg.Sources });

		bioMenu.newMenu({
			menuName: bioLg.Photo,
			appendTo: bioLg.Sources
		});

		[bioLg['Cycle from download folder'], bioLg['Cycle from custom folder [fallback to above]'], bioLg['Artist (single image [fb2k: display])']].forEach((v, i) => bioMenu.newItem({
			menuName: bioLg.Photo,
			str: v,
			func: () => this.setPhotoType(i),
			checkRadio: bioSet.cycPhotoLocation == i,
			separator: i == 1
		}));

		bioMenu.newMenu({
			menuName: bioLg.Cover,
			str: bioLg.Cover,
			appendTo: bioLg.Sources,
			flags: !bio.panel.alb.ix || bioSet.artistView ? BIO_MF_STRING : BIO_MF_GRAYED
		});

		this.img.covType.forEach((v, i) => bioMenu.newItem({
			menuName: bioLg.Cover,
			str: v,
			func: () => this.setCover(i),
			flags: bioSet.loadCovFolder && !bioSet.loadCovAllFb && i < 5 ? BIO_MF_GRAYED : BIO_MF_STRING,
			checkItem: (bioSet.loadCovAllFb || i > 4) && [bio.img.cov.selection[0] != -1, bio.img.cov.selection[1] != -1, bio.img.cov.selection[2] != -1, bio.img.cov.selection[3] != -1, bio.img.cov.selection[4] != -1, bioSet.loadCovAllFb, bioSet.loadCovFolder][i],
			checkRadio: !bioSet.loadCovAllFb && i == bioSet.covType,
			separator: i == 4
		}));

		bioMenu.addSeparator({ menuName: bioLg.Sources });

		bioMenu.newMenu({
			menuName: bioLg['Open file location'],
			appendTo: bioLg.Sources,
			flags: this.getOpenFlag()
		});

		for (let i = 0; i < 8; i++) { bioMenu.newItem({
			menuName: bioLg['Open file location'],
			str:  this.openName[i],
			func: () => $Bio.browser(`explorer /select,"${this.path.open[i]}"`, false),
			flags: this.getOpenFlag(),
			separator: !i && this.openName.length > 1 && this.path.img || this.path.txt[3] && i == this.openName.length - 2 && this.openName.length > 2,
			hide: !this.openName[i]
		}); }

		bioMenu.addSeparator({ menuName: bioLg.Sources });

		if (bioSet.menuShowPaste == 2 || bioSet.menuShowPaste && this.shift) {
			bioMenu.newMenu({
				menuName: bioLg['Paste text from clipboard'],
				appendTo: bioLg.Sources,
				separator: bioSet.menuShowPaste == 2 || bioSet.menuShowPaste && this.shift
			});
			for (let i = 0; i < 5; i++) { bioMenu.newItem({
				menuName: bioLg['Paste text from clipboard'],
				str: [bioSet.artistView ? bioLg['Biography [allmusic location]'] : bioLg['Review [allmusic location]'], bioSet.artistView ? bioLg['Biography [last.fm location]'] : bioLg['Review [last.fm location]'], bioSet.artistView ? bioLg['Biography [wikipedia location]'] : bioLg['Review [wikipedia location]'], bioLg['Open last edited'], bioLg.Undo][i],
				func: () => this.setPaste(i),
				flags: !i && !this.path.am[2] || i == 1 && !this.path.lfm[2]  || i == 2 && !this.path.wiki[2] || i == 3 && !this.undo.path || i == 4 && this.undo.text == '#!#' ? BIO_MF_GRAYED : BIO_MF_STRING,
				separator: i == 2 || i == 3
			}); }
		}

		bioMenu.newItem({
			menuName: bioLg.Sources,
			str: bioLg['Force update'],
			func: () => bio.panel.callServer(1, bio.panel.id.focus, 'bio_forceUpdate', 0)
		});

		const style_arr = bio.panel.style.name.slice();
		bioMenu.newMenu({
			menuName: bioLg.Layout
		});

		const style = bioSet.sameStyle ? bioSet.style : bioSet.artistView ? bioSet.bioStyle : bioSet.revStyle
		style_arr.forEach((v, i) => bioMenu.newItem({
			menuName: bioLg.Layout,
			str: v,
			func: () => this.setStyle(i),
			checkRadio: style <= style_arr.length - 1 && i == style,
			separator: i == 3 || style_arr.length > 5 && i == style_arr.length - 1
		}));

		bioMenu.newMenu({
			menuName: bioLg['Create && manage styles'],
			appendTo: bioLg.Layout
		});

		[bioLg['Create new style...'], bioLg['Rename custom style...'], bioLg['Delete custom style...'], bioLg['Export custom style...'], bioLg['Reset style...']].forEach((v, i) => bioMenu.newItem({
			menuName: bioLg['Create && manage styles'],
			str: v,
			func: () => this.setStyles(i),
			flags: !i || bioSet.style > 4 || i == 4 ? BIO_MF_STRING : BIO_MF_GRAYED,
			separator: !i
		}));

		bioMenu.addSeparator({ menuName: bioLg.Layout });

		bioMenu.newMenu({
			menuName: bioLg.Filmstrip,
			appendTo: bioLg.Layout
		});

		[bioLg.Top, bioLg.Right, bioLg.Bottom, bioLg.Left, bioLg['Overlay image area'], bioLg['Reset to default size...']].forEach((v, i) => bioMenu.newItem({
			menuName: bioLg.Filmstrip,
			str: v,
			func: () => {
				if (i == 4) bioSet.toggle('filmStripOverlay');
				if (i != 4 || bioSet.showFilmStrip) bio.filmStrip.set(i == 4 ? bioSet.filmStripPos : i);
			},
			flags: i != 4 || bioSet.style != 4 ? BIO_MF_STRING : BIO_MF_GRAYED,
			checkItem: i == 4 && (bioSet.filmStripOverlay || (bioSet.style == 4 && !bioSet.text_only && !bioSet.img_only)),
			checkRadio: i < 4 && i == bioSet.filmStripPos,
			separator: i == 3 || i == 4
		}));

		bioMenu.addSeparator({ menuName: bioLg.Layout });

		[bioLg['Reset zoom'], bioLg.Reload].forEach((v, i) => bioMenu.newItem({
			menuName: bioLg.Layout,
			str: v,
			func: () => !i ? bio.but.resetZoom() : window.Reload()
		}));

		bioMenu.newMenu({
			menuName: bioLg.Image
		});

		bioMenu.newItem({
			menuName: bioLg.Image,
			str: bioLg['Auto cycle'],
			func: () => bioSet.toggle('cycPic'),
			checkItem: bioSet.cycPic,
			separator: true
		});

		if (bioSet.style < 4) {
			bioMenu.newMenu({
				menuName: bioLg.Alignment,
				appendTo: bioLg.Image
			});
			for (let i = 0; i < 4; i++) { bioMenu.newItem({
				menuName: bioLg.Alignment,
				str: bioSet.style == 0 || bioSet.style == 2 ? [bioLg.Left, bioLg.Centre, bioLg.Right, bioLg['Align with text']][i] : [bioLg.Top, bioLg.Centre, bioLg.Bottom, bioLg['Align with text']][i],
				func: () => this.setImageAlignnment(i, 'standard'),
				checkItem: i == 3 && bioSet.textAlign,
				checkRadio: i == (bioSet.style == 0 || bioSet.style == 2 ? bioSet.alignH : bioSet.alignV),
				separator: i == 2
			}); }
		}

		if (bioSet.style > 3) {
			bioMenu.newMenu({
				menuName: bioLg['Alignment horizontal'],
				appendTo: bioLg.Image
			});
			[bioLg.Left, bioLg.Centre, bioLg.Right].forEach((v, i) => bioMenu.newItem({
				menuName: bioLg['Alignment horizontal'],
				str: v,
				func: () => this.setImageAlignnment(i, 'horizontal'),
				checkRadio:  i == bioSet.alignH
			}));
			bioMenu.newMenu({
				menuName: bioLg['Alignment vertical'],
				appendTo: bioLg.Image
			});
			[bioLg.Top, bioLg.Centre, bioLg.Bottom, bioLg.Auto].forEach((v, i) => bioMenu.newItem({
				menuName: bioLg['Alignment vertical'],
				str: v,
				func: () => this.setImageAlignnment(i, 'vertical'),
				checkRadio: [!bioSet.alignV && !bioSet.alignAuto, bioSet.alignV == 1 && !bioSet.alignAuto, bioSet.alignV == 2 && !bioSet.alignAuto, bioSet.alignAuto][i],
				separator: i == 2
			}));
		}

		bioMenu.addSeparator({ menuName: bioLg.Image });

		bioMenu.newMenu({
			menuName: bioLg['Black list'],
			appendTo: bioLg.Image
		});

		for (let i = 0; i < 3; i++) { bioMenu.newItem({
			menuName: bioLg['Black list'],
			str: this.img.blacklistStr[i],
			func: () => this.setImageBlacklist(i),
			flags: !i && this.img.isLfm || i == 2 ? BIO_MF_STRING : BIO_MF_GRAYED,
			hide: i == 2 && bio.img.blackList.undo[0] != this.img.artistClean
		}); }

		this.img.blacklist.forEach((v, i) => bioMenu.newItem({
			menuName: bioLg['Black list'],
			str: (`${this.img.artist}_${v}`).replace(/&/g, '&&'),
			func: () => this.setImageBlacklist(i + (bio.img.blackList.undo[0] == this.img.artistClean ? 3 : 2))
		}));

		bioMenu.addSeparator({});

		if (bioSet.menuShowPlaylists == 2 || bioSet.menuShowPlaylists && this.shift) {
			const pl_no = Math.ceil(this.playlist.menu.length / 30);
			bioMenu.newMenu({
				menuName: bioLg.Playlists,
				separator: bioSet.menuShowPlaylists == 2 || bioSet.menuShowPlaylists && this.shift
			});
			for (let j = 0; j < pl_no; j++) {
				const n = `# ${j * 30 + 1} - ${Math.min(this.playlist.menu.length, 30 + j * 30)}${30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? '  >>>' : ''}`;
				bioMenu.newMenu({
					menuName: n,
					appendTo: bioLg.Playlists
				});
				for (let i = j * 30; i < Math.min(this.playlist.menu.length, 30 + j * 30); i++) {
					bioMenu.newItem({
						menuName: n,
						str: this.playlist.menu[i].name,
						func: () => this.setPlaylist(i),
						checkRadio: i == plman.ActivePlaylist
					});
				}
			}
		}

		if (bioSet.menuShowTagger == 2 || bioSet.menuShowTagger && this.shift) {
			bioMenu.newMenu({
				menuName: bioLg.Tagger,
				str: bioLg.Tagger + (this.handles.Count ? '' : bioLg[': N/A no playlist tracks selected']),
				flags: this.handles.Count ? BIO_MF_STRING : BIO_MF_GRAYED,
				separator: bioSet.menuShowTagger == 2 || bioSet.menuShowTagger && this.shift
			});
			for (let i = 0; i < 13 + 4; i++) { bioMenu.newItem({
				menuName: bioLg.Tagger,
				str: this.getTaggerStr(i),
				func: () => bioCfg.setTag(i, this.handles),
				flags: !i || i == 13 + 1 && !this.tags ? BIO_MF_GRAYED : BIO_MF_STRING,
				checkItem: i && i < 13 + 1 && bioCfg[`tagEnabled${i - 1}`],
				separator: !i || i == 5 || i == 11 || i == 13
			}); }
		}

		if (bioSet.menuShowMissingData == 2 || bioSet.menuShowMissingData && this.shift) {
			bioMenu.newMenu({
				menuName: bioLg['Missing data'],
				separator: bioSet.menuShowMissingData == 2 || bioSet.menuShowMissingData && this.shift
			});
			[bioLg['Album review [allmusic]'], bioLg['Album review [last.fm]'], bioLg['Album review [wikipedia]'], bioLg['Biography [allmusic]'], bioLg['Biography [last.fm]'], bioLg['Biography [wikipedia]'], bioLg['Photos [last.fm]']].forEach((v, i) => bioMenu.newItem({
				menuName: bioLg['Missing data'],
				str: v,
				func: () => this.checkMissingData(i),
				separator: i == 2 || i == 5
			}));
		}

		if (bioSet.menuShowInactivate == 2 || bioSet.menuShowInactivate && this.shift) {
			bioMenu.newItem({
				str: bioSet.panelActive ? bioLg.Inactivate : bioLg['Activate biography'],
				func: () => bio.panel.inactivate(),
				separator: true
			});
		}

		for (let i = 0; i < 2; i++) { bioMenu.newItem({
			str: [bio.popUpBox.ok ? bioLg['Options...'] : bioLg['Options: see console'], bioLg['Configure...']][i],
			func: () => !i ? bioCfg.open('PanelCfg') : window.EditScript(),
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
		if (bio.panel.block() || !bioSet.cycItem || bio.panel.zoom() || bio.panel.id.lyricsSource && bio.lyrics.display() && bio.lyrics.scroll) return;
		if (bioSet.artistView) {
			this.counter.bio++;
			if (this.counter.bio < bioSet.cycTimeItem) return;
			this.counter.bio = 0;
			if (bio.panel.art.list.length < 2) return;
		} else {
			this.counter.rev++;
			if (this.counter.rev < bioSet.cycTimeItem) return;
			this.counter.rev = 0;
			if (bio.panel.alb.list.length < 2) return;
		}
		this.wheel(1, true, false);
	}

	getBlacklistImageItems() {
		const imgInfo = bio.img.pth();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1); // needed for init
		this.img.blacklist = [];
		this.path.blackList = `${bioCfg.storageFolder}blacklist_image.json`;

		if (!$Bio.file(this.path.blackList)) { $Bio.save(this.path.blackList, JSON.stringify({
			blacklist: {}
		}), true); }

		if ($Bio.file(this.path.blackList)) {
			this.img.artistClean = $Bio.clean(this.img.artist).toLowerCase();
			this.img.list = $Bio.jsonParse(this.path.blackList, false, 'file');
			this.img.blacklist = this.img.list.blacklist[this.img.artistClean] || [];
		}

		this.img.blacklistStr = [this.img.isLfm ? `${bioLg['+ Add'] + (!bio.panel.style.showFilmStrip ? '' : bioLg[' main image']) + bioLg[' to black list: '] + this.img.artist}_${this.img.name}` : bioLg['+ Add to black list: '] + (this.img.name ? bioLg['N/A - requires last.fm photo. Selected image: '] + this.img.name : bioLg['N/A - no'] + (!bio.panel.style.showFilmStrip ? '' : '') + bioLg[' image file']), this.img.blacklist.length ? bioLg[' - Remove from black list (click name): '] : bioLg['No black listed images for current artist'], bioLg.Undo];
	}

	getDisplayStr() {
		const m = bioSet.artistView ? bioSet.bioMode : bioSet.revMode;
		this.display.check = [bioSet.sameStyle ? !bioSet.img_only && !bioSet.text_only : m == 0, bioSet.sameStyle ? bioSet.img_only : m == 1, bioSet.sameStyle ? bioSet.text_only : m == 2, bioSet.showFilmStrip, bioSet.heading, bioSet.summaryShow, false, bioSet.artistView, !bioSet.artistView, !bio.panel.id.focus, bio.panel.id.focus];
		const n = [bioLg['Image+text'], bioLg.Image, bioLg.Text, bioLg.Filmstrip, bioLg.Heading, bioLg.Summary, bioSet.summaryCompact ? bioLg['Summary expand'] : bioLg['Summary compact'], bioLg['Artist view'], bioLg['Album view'], bioLg['Prefer nowplaying'], !bio.panel.id.lyricsSource && !bio.panel.id.nowplayingSource ? bioLg['Follow selected track (playlist)'] : bioLg['Follow selected track: N/A lyrics or nowplaying enabled']];
		const click = [!this.display.check[0] ? `\t${bioLg['Middle click']}` : '', !this.display.check[1] && !bioSet.text_only && !bioSet.img_only ? `\t${bioLg['Middle click']}` : '', !this.display.check[2] && !bioSet.img_only ? `\t${bioLg['Middle click']}` : '', `\t${bioLg['Alt+Middle click']}`, '', '', !bioSet.sourceAll ? `\t${bioLg.Click}` : '', !bioSet.artistView ? (!bioSet.dblClickToggle ? `\t${bioLg.Click}` : `\t${bioLg['Double click']}`) : '', bioSet.artistView ? (!bioSet.dblClickToggle ? `\t${bioLg.Click}` : `\t${bioLg['Double click']}`) : '', '', ''];
		this.display.str = n.map((v, i) => v + click[i])
	}

	getlookUpStr(i, j, artist) {
		return [
			[bioLg['Manual cycle: wheel over button'], bioLg['Auto cycle items'], bio.popUpBox.ok ? bioLg['Options...'] : bioLg['Options: see console'], bioLg.Reload][i],
			[bioLg['Show similar artists'], bioLg['Show more tags (circle button if present)'], bioLg['Show artist history'], bioLg['Auto lock'], bioLg['Reset artist history...'], bioLg['Last.fm: '] + artist + bioLg['...'], bioLg['Last.fm: '] + artist + bioLg[': similar artists...'], bioLg['Last.fm: '] + artist + bioLg[': top albums...'], bioLg['Allmusic: '] + artist + bioLg['...']][i],
			[bioLg['Show top albums'], bioLg['Show album history'], bioLg['Auto lock'], bioLg['Reset album history...'], bioLg['Last.fm: '] + artist + bioLg['...'], bioLg['Last.fm: '] + artist + bioLg[': similar artists...'], bioLg['Last.fm: '] + artist + bioLg[': top albums...'], bioLg['Allmusic: '] + artist + bioLg['...']][i]
		][j];
	}

	getOpenFlag() {
		return this.path.img || this.path.am[3] || this.path.lfm[3] || this.path.wiki[3] || this.path.txt[3] || this.path.tracksAm[3] || this.path.tracksLfm[3] || this.path.tracksWiki[3] ? BIO_MF_STRING : BIO_MF_GRAYED;
	}

	getOpenName() {
		const fo = [this.path.img, this.path.am[3], this.path.lfm[3], this.path.wiki[3], this.path.tracksAm[3], this.path.tracksLfm[3], this.path.tracksWiki[3], this.path.txt[3]];
		this.openName = [`${bioLg['Image ']}\t${bioLg['Alt+Click']}`, bioSet.artistView ? bioLg['Biography [allmusic]'] : bioLg['Review [allmusic]'], bioSet.artistView ? bioLg['Biography [last.fm]'] : bioLg['Review [last.fm]'], bioSet.artistView ? bioLg['Biography [wikipedia]'] : bioLg['Review [wikipedia]'], bioSet.artistView ? '' : bioLg['Tracks [allmusic]'], bioSet.artistView ? '' : bioLg['Tracks [last.fm]'], bioSet.artistView ? '' : bioLg['Tracks [wikipedia]'], bioSet.artistView ? bio.txt.bio.subhead.txt[0] : bio.txt.rev.subhead.txt[0]];
		let i = this.openName.length;
		while (i--)
			{ if (!fo[i]) {
				this.openName.splice(i, 1);
				fo.splice(i, 1);
				this.path.open.splice(i, 1);
			} }
	}

	getSourceNames() {
		const b = bioSet.artistView ? 'Bio' : 'Rev';
		const n = b.toLowerCase();
		this.types = !bio.txt[n].reader ? $Bio.source.amLfmWiki : $Bio.source.amLfmWikiTxt;
		this.sources = [bioLg.Allmusic, bioLg['Last.fm'], bioLg.Wikipedia];
		this.sources = this.sources.map(v => v + (bioSet.artistView ? ' biography' : ' review'));
		if (bio.txt[n].reader) this.sources.push(bio.txt[n].subhead.txt[0] || '');
		if (!bio.panel.stndItem() && (bio.txt.reader[n].lyrics || bio.txt.reader[n].props)) this.sources[3] += ' // current track';
	}

	getTaggerStr(i) {
		return !i ? bioLg['Write existing file info to tags: '] : i == 13 + 1 ? bioLg['All tagger settings...'] : i == 13 + 2 ? (bioCfg.taggerConfirm ? bioLg['Tag files...'] : `${bioLg.Tag} ${this.handles.Count} ${this.handles.Count > 1 ? bioLg.tracks : bioLg.track}...`) + (this.tags ? '' : bioLg[' N/A no tags enabled']) + (bioCfg.tagEnabled5 || bioCfg.tagEnabled7 ? bio.tag.genres.length > 700 || !bioCfg.useWhitelist ? '' : bioLg[' WARNING: last.fm genre whitelist not found or invalid [try force update - needs internet connection]'] : '') : i == 13 + 3 ? bioLg.Cancel : i == 11 ? bioCfg[`tagName${i - 1}`] + (bioCfg[`tagEnabled${i - 1}`] ? ` (${bioCfg[`tagEnabled${i + 2}`]})` : '') : bioCfg[`tagName${i - 1}`];
	}

	images(v) {
		return bio.name.isLfmImg(bioFSO.GetFileName(v));
	}

	isRevAvail() {
		const type = ['alb', 'trk'];
		type.forEach(w => {
			this[`${w}Avail`] = $Bio.source.amLfmWiki.some(v => bioSet.lockBio ? bio.txt.rev.loaded.ix == bio.txt.avail[`${v}${w}`] : bio.txt.avail[`${v}${w}`] != -1);
		});
	}

	lookUpAlbum(i) {
		const origArr = JSON.stringify(bio.panel.alb.list);
		switch (true) {
			case i < bio.panel.alb.list.length: {
				if (origArr != JSON.stringify(bio.panel.alb.list) || !i && !bio.panel.alb.ix || bio.panel.alb.ix == i) break;
				bio.txt.logScrollPos();
				bio.filmStrip.logScrollPos();
				bio.panel.alb.ix = i;
				bio.img.get = false;
				bio.txt.get = 0;
				let force = false;
				if (bioSet.sourcerev == 3) {
					bioSet.sourcerev = 0;
					this.setSource('Rev');
				}
				bio.panel.style.inclTrackRev = bioSet.inclTrackRev;
				if (bioSet.inclTrackRev) {
					if (i) bio.panel.style.inclTrackRev = 0;
					bio.txt.albumFlush();
					force = true;
				}
				if (bio.panel.alb.list[bio.panel.alb.ix].composition && bioSet.sourcerev != 0 && bioSet.sourcerev != 2) {
					bioSet.sourcerev = bio.txt.rev.am ? 0 : bio.txt.rev.wiki ? 2 : bio.txt.rev.am;
					this.setSource('Rev');
				}
				bio.txt.getItem(false, bio.panel.art.ix, bio.panel.alb.ix, force);
				bio.txt.getScrollPos();
				bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
				bio.panel.callServer(false, bio.panel.id.focus, 'bio_lookUpItem', 0);
				bio.filmStrip.check();
				if (bioSet.autoLock) bio.panel.mbtn_up(1, 1, true);
				if (bio.panel.alb.list[bio.panel.alb.ix].type.includes('history')) break;
				bio.panel.logAlbumHistory(bio.panel.alb.list[bio.panel.alb.ix].artist, bio.panel.alb.list[bio.panel.alb.ix].album);
				bio.panel.getList();
				break;
			}
			case i == bio.panel.alb.list.length + 1:
				bioSet.toggle('cycItem');
				break;
			case i == bio.panel.alb.list.length + 2:
				bioCfg.open('PanelCfg');
				break;
			case i == bio.panel.alb.list.length + 3:
				window.Reload();
				break;
		}
		this.counter.rev = 0;
	}

	lookUpAlbumItems(i) {
		switch (i) {
			case 0:
				bio.panel.alb.ix = 0;
				bioSet.toggle('showTopAlbums');
				bio.panel.getList(!bioSet.showTopAlbums, true);
				break;
			case 1:
				bio.panel.alb.ix = 0;
				bioSet.toggle('showAlbumHistory');
				bio.panel.getList(!bioSet.showAlbumHistory, true);
				break;
			case 2:
				bioSet.toggle('autoLock');
				break;
			case 3:
				bio.panel.resetAlbumHistory();
				break;
			default: {
				const artist = bio.panel.art.list.length ? bio.panel.art.list[0].name : bio.name.artist(bio.panel.id.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 7) $Bio.browser(`https://www.last.fm/${bioCfg.language == 'EN' ? '' : `${bioCfg.language.toLowerCase()}/`}music/${encodeURIComponent(artist)}${brArr[i - 4]}`, true);
				else $Bio.browser(`https://www.allmusic.com/search/artists/${encodeURIComponent(artist)}`, true);
				break;
			}
		}
		if (i < 4) {
			bio.txt.logScrollPos();
			bio.filmStrip.logScrollPos();
			bio.img.get = false;
			bio.txt.get = 0;
			if (bioSet.sourcerev == 3) {
				bioSet.sourcerev = 0;
				this.setSource('Rev');
			}
			bio.panel.style.inclTrackRev = bioSet.inclTrackRev;
			if (bioSet.inclTrackRev) {
				if (bio.panel.alb.list[bio.panel.alb.ix].type.includes('history')) bio.panel.style.inclTrackRev = 0;
				bio.txt.albumFlush();
			}
			bio.txt.getItem(false, bio.panel.art.ix, bio.panel.alb.ix, true);
			bio.txt.getScrollPos();
			bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
			bio.panel.callServer(false, bio.panel.id.focus, 'bio_lookUpItem', 0);
			bio.filmStrip.check();
		}
	}

	lookUpArtist(i) {
		const origArr = JSON.stringify(bio.panel.art.list);
		switch (true) {
			case i < bio.panel.art.list.length:
				if (origArr != JSON.stringify(bio.panel.art.list) || !i && !bio.panel.art.ix || bio.panel.art.ix == i) break;
				bio.txt.logScrollPos();
				bio.filmStrip.logScrollPos();
				bio.panel.art.ix = i;
				bio.img.get = false;
				bio.txt.get = 0;
				if (bioSet.sourcebio == 3) {
					bioSet.sourcebio = 1;
					this.setSource('Bio');
				}
				bio.txt.getItem(false, bio.panel.art.ix, bio.panel.alb.ix);
				bio.txt.getScrollPos();
				bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
				bio.panel.callServer(false, bio.panel.id.focus, 'bio_lookUpItem', 0);
				bio.filmStrip.check();
				if (bioSet.autoLock) bio.panel.mbtn_up(1, 1, true);
				if (bio.panel.art.list[bio.panel.art.ix].type.includes('history')) break;
				bio.panel.logArtistHistory(bio.panel.art.list[bio.panel.art.ix].name);
				bio.panel.getList();
				break;
			case i == bio.panel.art.list.length + 1:
				bioSet.toggle('cycItem');
				break;
			case i == bio.panel.art.list.length + 2:
				bioCfg.open('PanelCfg');
				break;
			case i == bio.panel.art.list.length + 3:
				window.Reload();
				break;
		}
		this.counter.bio = 0;
	}

	lookUpArtistItems(i) {
		switch (i) {
			case 0:
				bio.panel.art.ix = 0;
				bioSet.toggle('showSimilarArtists');
				bio.panel.getList(!bioSet.showSimilarArtists);
				break;
			case 1:
				bio.panel.art.ix = 0;
				bioSet.toggle('showMoreTags');
				bio.panel.getList(!bioSet.showMoreTags);
				break;
			case 2:
				bio.panel.art.ix = 0;
				bioSet.toggle('showArtistHistory');
				bio.panel.getList(!bioSet.showArtistHistory);
				break;
			case 3:
				bioSet.toggle('autoLock');
				break;
			case 4:
				bio.panel.resetArtistHistory();
				break;
			default: {
				const artist = bio.panel.art.list.length ? bio.panel.art.list[0].name : bio.name.artist(bio.panel.id.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 8) $Bio.browser(`https://www.last.fm/${bioCfg.language == 'EN' ? '' : `${bioCfg.language.toLowerCase()}/`}music/${encodeURIComponent(artist)}${brArr[i - 5]}`, true);
				else $Bio.browser(`https://www.allmusic.com/search/artists/${encodeURIComponent(artist)}`, true);
				break;
			}
		}
		if (i < 5) {
			bio.txt.logScrollPos();
			bio.filmStrip.logScrollPos();
			if (bioSet.sourcebio == 3) {
				bioSet.sourcebio = 1;
				this.setSource('Bio');
			}
			bio.img.get = false;
			bio.txt.get = 0;
			bio.txt.getItem(false, bio.panel.art.ix, bio.panel.alb.ix);
			bio.txt.getScrollPos();
			bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
			bio.panel.callServer(false, bio.panel.id.focus, 'bio_lookUpItem', 0);
			bio.filmStrip.check();
		}
	}

	missingArtImg(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(bioCfg.tf.artist);
				const sort = FbTitleFormat(`${bioCfg.tf.artist} | ${bioCfg.tf.album} | [[%discnumber%.]%tracknumber%. ][%track artist% - ]${bioCfg.tf.title}`);
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
						const pth = bio.panel.cleanPth(bioCfg.pth[n1], h, 'tag');
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
		const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	missingBio(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(bioCfg.tf.artist);
				const sort = FbTitleFormat(`${bioCfg.tf.artist} | ${bioCfg.tf.album} | [[%discnumber%.]%tracknumber%. ][%track artist% - ]${bioCfg.tf.title}`);
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
						const pth = `${bio.panel.cleanPth(bioCfg.pth[n1], h, 'tag') + $Bio.clean(a) + bioCfg.suffix[n1]}.txt`;
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
		const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	missingRev(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_albumArtist = FbTitleFormat(bioCfg.tf.albumArtist);
				const tf_album = FbTitleFormat(bioCfg.tf.album);
				const sort = FbTitleFormat(`${bioCfg.tf.albumArtist} | ${bioCfg.tf.album} | [[%discnumber%.]%tracknumber%. ][%track artist% - ]${bioCfg.tf.title}`);
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
					album = !bioCfg.albStrip ? bio.name.albumTidy(album) : bio.name.albumClean(album);
					if (albumArtist + album != cur_albumArtist + cur_album) {
						cur_albumArtist = albumArtist;
						cur_album = album;
						let pth = `${bio.panel.cleanPth(bioCfg.pth[n1], h, 'tag') + $Bio.clean(albumArtist)} - ${$Bio.clean(album)}${bioCfg.suffix[n1]}.txt`;
						if (pth.length > 259) {
							album = $Bio.abbreviate(album);
							pth = `${bio.panel.cleanPth(bioCfg.pth[n1], h, 'tag') + $Bio.clean(albumArtist)} - ${$Bio.clean(album)}${bioCfg.suffix[n1]}.txt`;
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
		const wsh = bio.popUpBox.isHtmlDialogSupported() ? bio.popUpBox.confirm(caption, prompt, 'OK', 'Cancel', false, 'center', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $Bio.wshPopup(prompt, caption));
	}

	playlists_changed() {
		if (!bioSet.menuShowPlaylists) return;
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
		this.shift = bio.vk.k('shift');
		const imgInfo = bio.img.pth();
		this.docTxt = $Bio.getClipboardData() || '';
		if (!bio.tag.genres.length) bio.tag.setGenres();
		this.getDisplayStr();
		this.getSourceNames();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1);
		this.isRevAvail();
		this.path.am = bioSet.artistView ? bio.txt.bioPth('Am') : bio.txt.revPth('Am');
		this.path.lfm = bioSet.artistView ? bio.txt.bioPth('Lfm') : bio.txt.revPth('Lfm');
		this.path.txt = bioSet.artistView ? bio.txt.txtBioPth() : bio.txt.txtRevPth();
		this.path.wiki = bioSet.artistView ? bio.txt.bioPth('Wiki') : bio.txt.revPth('Wiki');
		this.path.tracksAm = bioSet.artistView ? '' : bio.txt.trackPth('Am');
		this.path.tracksLfm = bioSet.artistView ? '' : bio.txt.trackPth('Lfm');
		this.path.tracksWiki = bioSet.artistView ? '' : bio.txt.trackPth('Wiki');
		this.path.open = [this.path.img, this.path.am[1], this.path.lfm[1], this.path.wiki[1], this.path.tracksAm[1], this.path.tracksLfm[1], this.path.tracksWiki[1], this.path.txt[1]];
		this.getOpenName();
		this.getBlacklistImageItems();
		if (bioSet.menuShowTagger == 2 || bioSet.menuShowTagger && this.shift) this.handles = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		this.tagsEnabled();

		bioMenu.load(x, y);
		this.right_up = false;

		// * Link with top menu Options > Biography > Display
		if (!bioSet.img_only && !bioSet.text_only) {
			grSet.biographyDisplay = 'Image+text';
		} else if (bioSet.img_only) {
			grSet.biographyDisplay = 'Image';
		} else if (bioSet.text_only) {
			grSet.biographyDisplay = 'Text';
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
				!bioSet.loadCovAllFb ? bioSet.covType = i : bio.img.cov.selection[i] = bio.img.cov.selection[i] == -1 ? i : -1;
				bio.img.cov.selFiltered = bio.img.cov.selection.filter(v => v != -1);
				if (!bio.img.cov.selFiltered.length) {
					bio.img.cov.selection = [0, -1, -1, -1, -1];
					bio.img.cov.selFiltered = [0];
				}
				bioSet.loadCovSelFb = JSON.stringify(bio.img.cov.selection);
				!bioSet.loadCovAllFb ? bio.img.getImages() : bio.img.check();
				break;
			case i == 5:
				bio.img.toggle('loadCovAllFb');
				break;
			case i == 6:
				bio.img.toggle('loadCovFolder');
				break;
		}
	}

	setDisplay(i) {
		switch (i) {
			case 0:
			case 1:
			case 2:
				if (bioSet.sameStyle) bio.panel.mode(i);
				else {
					bioSet.artistView ? bioSet.bioMode = i : bioSet.revMode = i;
					bio.txt.refresh(0);
				}
				break;
			case 3:
				bio.filmStrip.mbtn_up('onOff');
				break;
			case 4:
				bio.txt.bio.scrollPos = {}; bio.txt.rev.scrollPos = {};
				bioSet.heading = !bioSet.heading ? 1 : 0;
				bio.panel.style.fullWidthHeading = bioSet.heading && bioSet.fullWidthHeading;
				if (bio.panel.style.inclTrackRev == 1) bio.txt.logScrollPos();
				bio.txt.refresh(1);
				break;
			case 5:
			case 6:
				bio.txt.bio.scrollPos = {}; bio.txt.rev.scrollPos = {};
				bioSet.toggle(i == 5 ? 'summaryShow' : 'summaryCompact');
				bio.panel.setSummary();
				bio.txt.refresh(1);
				break;
			case 7:
			case 8:
				bio.panel.click('', '', true);
				break;
			case 9:
			case 10:
				bioSet.toggle('focus');
				bio.panel.id.focus = bioSet.focus;
				bio.panel.changed();
				bio.txt.on_playback_new_track();
				bio.img.on_playback_new_track();
				break;
		}
	}

	setImageAlignnment(i, type) {
		switch (type) {
			case 'standard':
				switch (i) {
					case 3:
						bioSet.toggle('textAlign');
						bio.panel.setStyle();
						bio.img.clearCache();
						bio.img.getImages();
						break;
					default:
						if (bioSet.style == 0 || bioSet.style == 2) bioSet.alignH = i;
						else bioSet.alignV = i;
						bio.img.clearCache();
						bio.img.getImages();
						break;
				}
				break;
			case 'horizontal':
				bioSet.alignH = i;
				bio.img.clearCache();
				bio.img.getImages();
				break;
			case 'vertical':
				switch (i) {
					case 3:
						bioSet.alignAuto = true;
						bio.panel.setStyle();
						bio.img.clearCache();
						bio.img.getImages();
						break;
					default:
						bioSet.alignV = i;
						bioSet.alignAuto = false;
						bio.panel.setStyle();
						bio.img.clearCache();
						bio.img.getImages();
						break;
					}
					break;
		}
	}

	setImageBlacklist(i) {
		if (!i) {
			if (!this.img.list.blacklist[this.img.artistClean]) this.img.list.blacklist[this.img.artistClean] = [];
			this.img.list.blacklist[this.img.artistClean].push(this.img.name);
		} else if (bio.img.blackList.undo[0] == this.img.artistClean && i == 2) {
			if (!this.img.list.blacklist[bio.img.blackList.undo[0]]) this.img.list.blacklist[this.img.artistClean] = [];
			if (bio.img.blackList.undo[1].length) this.img.list.blacklist[bio.img.blackList.undo[0]].push(bio.img.blackList.undo[1]);
			bio.img.blackList.undo = [];
		} else {
			const bl_ind = i - (bio.img.blackList.undo[0] == this.img.artistClean ? 3 : 2);
			bio.img.blackList.undo = [this.img.artistClean, this.img.list.blacklist[this.img.artistClean][bl_ind]];
			this.img.list.blacklist[this.img.artistClean].splice(bl_ind, 1);
			$Bio.removeNulls(this.img.list);
		}
		const bl = this.img.list.blacklist[this.img.artistClean];
		if (bl) this.img.list.blacklist[this.img.artistClean] = this.sort([...new Set(bl)]);
		bio.img.blackList.artist = '';
		$Bio.save(this.path.blackList, JSON.stringify({
			blacklist: $Bio.sortKeys(this.img.list.blacklist)
		}, null, 3), true);
		bio.img.check();
		window.NotifyOthers('bio_blacklist', 'bio_blacklist');
	}

	setPaste(i) {
		switch (i) {
			case 0: case 1: case 2: {
				const n = bioSet.artistView ? 'bio' : 'rev';
				const s = $Bio.source.amLfmWiki[i];
				this.undo.folder = this.path[s][0];
				this.undo.path = this.path[s][1];
				this.undo.text = $Bio.open(this.undo.path);
				$Bio.buildPth(this.undo.folder);
				$Bio.save(this.undo.path, `${this.docTxt}\r\n\r\nCustom ${bioSet.artistView ? 'Biography' : 'Review'}`, true);
				const b = bioSet.artistView ? 'Bio' : 'Rev';
				const pth = bio.txt[`${n}Pth`](['Am', 'Lfm', 'Wiki'][i]);
				if (this.path[s][1] == pth[1]) {
					bioSet[`source${b}`] = 0;
					bio.txt[n].source[s] = true;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				bio.txt.grab();
				if (bioSet.text_only) bio.txt.paint();
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
					bioFSO.DeleteFile(this.undo.path);
					window.NotifyOthers('bio_reload', 'bio_reload');
					if (bio.panel.stndItem()) window.Reload();
					else {
						bio.txt.artistFlush();
						bio.txt.albumFlush();
						bio.txt.grab();
						if (bioSet.text_only) bio.txt.paint();
					}
					break;
				}
				$Bio.buildPth(this.undo.folder);
				$Bio.save(this.undo.path, this.undo.text, true);
				this.undo.text = '#!#';
				window.NotifyOthers('bio_getText', 'bio_getText');
				bio.txt.grab();
				if (bioSet.text_only) bio.txt.paint();
				break;
		}
	}

	setPhotoType(i) {
		bioSet.cycPhoto = i < 2;
		bioSet.cycPhotoLocation = i;
		if (i == 1 && !bioSet.get('SYSTEM.Photo Folder Checked', false)) {
			fb.ShowPopupMessage('Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.', 'Biography: custom folder for photo cycling');
			bioSet.set('SYSTEM.Photo Folder Checked', true);
		}
		bio.img.updImages();
	}

	setPlaylist(i) {
		plman.ActivePlaylist = this.playlist.menu[i].ix;
	}

	setReviewType(i) {
		bio.txt.logScrollPos();
		bio.panel.style.inclTrackRev = bioSet.inclTrackRev = [0, 2, 1][i];
		if (bioSet.inclTrackRev) { bio.server.checkTrack({
			focus: bio.panel.id.focus,
			force: false,
			menu: true,
			artist: bio.panel.art.list.length ? bio.panel.art.list[0].name : bio.name.artist(bio.panel.id.focus),
			title: bio.name.title(bio.panel.id.focus)
		}); }
		bio.txt.refresh(1);
		bio.txt.getScrollPos();
	}

	setSource(b, n) {
		n = n || b.toLowerCase();
		$Bio.source.amLfmWikiTxt.forEach((v, i) => bio.txt[n].source[v] = bioSet[`source${n}`] == i);
		$Bio.source.amLfmWiki.forEach(v => { if (bio.txt[n].source[v]) bio.txt.done[`${v}${b}`] = false });
		bio.txt[n].source.ix = bioSet[`source${n}`];
	}

	setStyle(i) {
		const prop = bioSet.sameStyle ? 'style' : bioSet.artistView ? 'bioStyle' : 'revStyle';
		bioSet[prop] = i;
		bio.img.mask.reset = true;
		bioSet.img_only = false;
		bioSet.text_only = false;
		bio.txt.refresh(0);
		if (bioSet.filmStripOverlay && bioSet.showFilmStrip) bio.filmStrip.set(bioSet.filmStripPos);
	}

	setStyles(i) {
		switch (i) {
			case 0:
				bio.panel.createStyle();
				break;
			case 1:
				bio.panel.renameStyle(bioSet.style);
				break;
			case 2:
				bio.panel.deleteStyle(bioSet.style);
				break;
			case 3:
				bio.panel.exportStyle(bioSet.style);
				break;
			case 4:
				bio.panel.resetStyle(bioSet.style);
				break;
		}
	}

	setTextType(i, b) {
		switch (i) {
			case 0:
			case 1: this.toggle(4, b); break;
			case 2: bio.txt.bio.scrollPos = {}; bio.txt.rev.scrollPos = {}; bioSet.toggle('sourceAll'); bio.txt.refresh(1); break;
			case 3:
				bioSet.toggle('showTrackRevOptions');
				bio.txt.logScrollPos();
				bio.panel.style.inclTrackRev = bioSet.inclTrackRev = 0;
				if (bioSet.showTrackRevOptions) { bio.server.checkTrack({
					focus: bio.panel.id.focus,
					force: false,
					menu: true,
					artist: bio.panel.art.list.length ? bio.panel.art.list[0].name : bio.name.artist(bio.panel.id.focus),
					title: bio.name.title(bio.panel.id.focus)
				}); }
				bio.txt.refresh(1);
				bio.txt.getScrollPos();
				break;
			case 4: bioSet.toggle('classicalMusicMode'); bioSet.classicalAlbFallback = bioSet.classicalMusicMode; bio.txt.refresh(1); break;
		}
	}

	sort(data) {
		return data.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	}

	tagsEnabled() {
		this.tags = false;
		for (let i = 0; i < 13; i++)
			{ if (bioCfg[`tagEnabled${i}`]) {
				this.tags = true;
				break;
			} }
	}

	toggle(i, b, fix, direction) {
		bio.txt.logScrollPos();
		const n = b.toLowerCase();
		if (i === bioSet[`source${n}`]) return;
		if (i == 4) {
			bioSet.toggle('lockBio');
		} else {
		if (i === '') i = bioSet[`source${n}`];
			if (fix) {
				bioSet[`source${n}`] = i;
			} else if (bioSet.lockBio && !bioSet.sourceAll) {
				const limit = bio.txt[n].reader ? 3 : 2;
				direction == 1 ? bioSet[`source${n}`] = i == limit ? 0 : ++i : bioSet[`source${n}`] = i == 0 ? limit : --i;
			} else if (bio.txt[n].reader) {
				switch (bio.txt[n].loaded.ix) {
					case 0: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].lfm ? 1 : bio.txt[n].wiki ? 2 : bio.txt[n].txt ? 3 : 0) : (bio.txt[n].txt ? 3 : bio.txt[n].wiki ? 2 : bio.txt[n].lfm ? 1 : 0); break;
					case 1: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].wiki ? 2 : bio.txt[n].txt ? 3 : bio.txt[n].am ? 0 : 1) : (bio.txt[n].am ? 0 : bio.txt[n].txt ? 3 : bio.txt[n].wiki ? 2 : 1); break;
					case 2: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].txt ? 3 : bio.txt[n].am ? 0 : bio.txt[n].lfm ? 1 : 2) : (bio.txt[n].lfm ? 1 : bio.txt[n].am ? 0 : bio.txt[n].txt ? 3 : 2); break;
					case 3: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].am ? 0 : bio.txt[n].lfm ? 1 : bio.txt[n].wiki ? 2 : 3) : (bio.txt[n].wiki ? 2 : bio.txt[n].lfm ? 1 : bio.txt[n].am ? 0 : 3); break;
					}
			} else {
				switch (bio.txt[n].loaded.ix) {
					case 0: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].lfm ? 1 : bio.txt[n].wiki ? 2 : 0) : (bio.txt[n].wiki ? 2 : bio.txt[n].lfm ? 1 : 0); break;
					case 1: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].wiki ? 2 : bio.txt[n].am ? 0 : 1) : (bio.txt[n].am ? 0 : bio.txt[n].wiki ? 2 : 1); break;
					case 2: bioSet[`source${n}`] = direction == 1 ? (bio.txt[n].am ? 0 : bio.txt[n].lfm ? 1 : 2) : (bio.txt[n].lfm ? 1 : bio.txt[n].am ? 0 : 2); break;
				}
			}
		}
		this.setSource(b, n);
		bio.txt.getText(false);
		bio.but.src.y = bio.but.src.fontSize < 12 || bio.txt[n].loaded.ix == 2 ? 1 : 0;
		bio.txt.getScrollPos();
		bio.img.getImages();
	}

	wheel(step, resetCounters) {
		let i = 0;
		bio.but.clearTooltip();
		let force = false;
		switch (true) {
			case bioSet.artistView:
				if (!bio.panel.art.uniq.length) break;
				for (i = 0; i < bio.panel.art.uniq.length; i++)
					{ if (!bio.panel.art.ix && bio.name.artist(bio.panel.id.focus) == bio.panel.art.uniq[i].name || bio.panel.art.ix == bio.panel.art.uniq[i].ix) break; }
				i += step;
				if (i < 0) i = bio.panel.art.uniq.length - 1;
				else if (i >= bio.panel.art.uniq.length) i = 0;
				bio.txt.logScrollPos();
				bio.filmStrip.logScrollPos();
				if (bioSet.sourcebio == 3) {
					bioSet.sourcebio = 1;
					this.setSource('Bio');
				}
				bio.panel.art.ix = bio.panel.art.uniq[i].ix;
				if (bio.panel.art.list[bio.panel.art.ix].type.includes('history')) break;
				bio.panel.logArtistHistory(bio.panel.art.list[bio.panel.art.ix].name);
				bio.panel.getList();
				break;
			case !bioSet.artistView:
				if (!bio.panel.alb.uniq.length) break;
				for (i = 0; i < bio.panel.alb.uniq.length; i++)
					{ if (!bio.panel.alb.ix && `${bio.name.albumArtist(bio.panel.id.focus)} - ${bio.name.album(bio.panel.id.focus)}` == `${bio.panel.alb.uniq[i].artist} - ${bio.panel.alb.uniq[i].album}` || bio.panel.alb.ix == bio.panel.alb.uniq[i].ix) break; }
				i += step;
				if (i < 0) i = bio.panel.alb.uniq.length - 1;
				else if (i >= bio.panel.alb.uniq.length) i = 0;
				bio.txt.logScrollPos();
				bio.filmStrip.logScrollPos();
				if (bioSet.sourcerev == 3) {
					bioSet.sourcerev = 0;
					this.setSource('Rev');
				}
				bio.panel.alb.ix = bio.panel.alb.uniq[i].ix;
				if (bio.panel.alb.ix) bio.seeker.show = false;
				if (bioSet.showAlbumHistory && bioSet.inclTrackRev) {
					bio.panel.style.inclTrackRev = bioSet.inclTrackRev;
					if (bio.panel.alb.list[bio.panel.alb.ix].type.includes('history')) bio.panel.style.inclTrackRev = 0;
					bio.txt.albumFlush();
					force = true;
				}
				if (bio.panel.alb.list[bio.panel.alb.ix].type.includes('history')) break;
				bio.panel.logAlbumHistory(bio.panel.alb.list[bio.panel.alb.ix].artist, bio.panel.alb.list[bio.panel.alb.ix].album);
				bio.panel.getList();
				break;
		}
		bio.img.get = false;
		bio.txt.getItem(false, bio.panel.art.ix, bio.panel.alb.ix, force);
		bio.txt.getScrollPos();
		bio.img.getItem(bio.panel.art.ix, bio.panel.alb.ix);
		bio.panel.lookUpServer();
		if (resetCounters) bioSet.artistView ? this.counter.bio = 0 : this.counter.rev = 0;
		bio.filmStrip.check();
	}
}
