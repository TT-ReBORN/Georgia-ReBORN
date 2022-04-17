const MF_GRAYED_BIO = 0x00000001;
const MF_SEPARATOR_BIO = 0x00000800;
const MF_STRING_BIO = 0x00000000;

class MenuManagerBio {
	constructor(baseMenu) {
		this.baseMenu = baseMenu || 'baseMenu';
		this.func = {};
		this.idx = 0;
		this.menu = {};
		this.menuItems = [];
		this.menuNames = [];
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
			this.getItems(v, ['checkItem', 'checkRadio', 'flags', 'menuName', 'separator', 'str']);
			const menu = this.menu[this.menuName];
			menu.AppendMenuItem(this.flags, this.idx, this.str);
			menu.CheckMenuItem(this.idx, this.checkItem);
			if (this.checkRadio) menu.CheckMenuRadioItem(this.idx, this.idx, this.idx);
			if (this.separator) menu.AppendMenuSeparator();
			this.func[this.idx] = v.func;
		}
	}

	appendMenu(v) {
		this.getItems(v, ['hide', 'menuName']);
		if (this.menuName == this.baseMenu || this.hide) return;
		this.getItems(v, ['appendTo', 'flags', 'separator', 'str']);
		const menu = this.menu[this.appendTo || this.baseMenu];
		this.menu[this.menuName].AppendTo(menu, this.flags, this.str || this.menuName)
		if (this.separator) menu.AppendMenuSeparator();
	}

	clear() {
		this.menu = {}
		this.func = {}
		this.idx = 0;
	}

	createMenu(menuName = this.baseMenu) {
		menuName = this.get(menuName);
		this.menu[menuName] = window.CreatePopupMenu();
	}

	get(v) {
		if (typeof v == 'function') return v();
		return v;
	}

	getItems(v, items) {
		items.forEach(w => this[w] = this.get(v[w]))
	}

	load(x, y) {
		this.menuNames.forEach(v => this.createMenu(v));
		this.menuItems.forEach(v => !v.appendMenu ? this.addItem(v) : this.appendMenu(v));

		const idx = this.menu[this.baseMenu].TrackPopupMenu(x, y);
		this.run(idx);

		this.clear();
	}

	newItem({str = null, func = null, menuName = this.baseMenu, flags = MF_STRING, checkItem = false, checkRadio = false, separator = false, hide = false}) {
		this.menuItems.push({
			str: str,
			func: func,
			menuName: menuName,
			flags: flags,
			appendMenu: false,
			checkItem: checkItem,
			checkRadio: checkRadio,
			separator: separator,
			hide: hide
		});
	}

	newMenu({menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = MF_STRING, separator = false, hide = false}) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) {
			this.menuItems.push({
				menuName: menuName,
				appendMenu: true,
				str: str,
				appendTo: appendTo,
				flags: flags,
				separator: separator,
				hide: hide
			});
		}
	}

	run(idx) {
		const v = this.func[idx];
		if (typeof v != 'function') return;
		v();
	}
}
let menuBio = new MenuManagerBio;
let bMenu = new MenuManagerBio;

class MenuItemsBio {
	constructor() {
		this.docTxt = '';
		this.handles = new FbMetadbHandleList();
		this.openName = [];
		this.popUpTitle = 'Missing Data:';
		this.right_up = false;
		this.shift = false;
		this.tags = false;
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
			covType: ['Front', 'Back', 'Disc', 'Icon', 'Artist', 'Cycle Above', 'Cycle From Folder'],
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
			tracks: []
		};
		this.undo = {
			folder: '',
			path: '',
			text: '#!#'
		}

		this.playlists_changed();
		this.mainMenu();
	}

	// Methods

	buttonMenu(x, y) {
		bMenu = new MenuManagerBio;
		bMenu.newMenu({});
		const artist = panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(pptBio.focus);
		switch (pptBio.artistView) {
			case true:
				panelBio.art.list.forEach((v, i) => bMenu.newItem({
					str: v.name.replace(/&/g, '&&') + v.field.replace(/&/g, '&&'),
					func: () => this.lookUpArtist(i),
					flags: v.type != 'label' ? MF_STRING : MF_GRAYED,
					checkRadio: i == panelBio.art.ix,
					separator: !i || v.type == 'similarend' || v.type == 'label' || v.type == 'tagend' || v.type == 'historyend'
				}));

				['Manual cycle: wheel over button', 'Auto cycle items', 'Cycle time...', 'Options...', 'Reload'].forEach((v, i) => bMenu.newItem({
					str: v,
					func: () => this.lookUpArtist(panelBio.art.list.length + i),
					flags: !i ? MF_GRAYED : MF_STRING,
					checkItem: i == 1 && pptBio.cycItem,
					separator: i != 1
				}));

				bMenu.newMenu({
					menuName: 'More...'
				});
				for (let i = 0; i < 8; i++) bMenu.newItem({
					menuName: 'More...',
					str: ['Show similar artists', 'Show more tags' + ' (circle button if present)', 'Show artist history', 'Auto lock', 'Reset artist history...', 'Last.fm: ' + artist + '...', 'Last.fm: ' + artist + ': similar artists...', 'Last.fm: ' + artist + ': top albums...', 'AllMusic: ' + artist + '...'][i],
					func: () => this.lookUpArtistItems(i),
					checkItem: i < 4 && [pptBio.showSimilarArtists, pptBio.showMoreTags, pptBio.showArtistHistory, pptBio.autoLock][i],
					separator: i == 2 || i == 3 || i == 4 || i == 5
				});
				break;
			case false:
				panelBio.alb.list.forEach((v, i) => bMenu.newItem({
					str: !i || v.type.includes('history') ? v.artist.replace(/&/g, '&&') + ' - ' + v.album.replace(/&/g, '&&') : v.album.replace(/&/g, '&&'),
					func: () => this.lookUpAlbum(i),
					flags: v.type != 'label' ? MF_STRING : MF_GRAYED,
					checkRadio: i == panelBio.alb.ix,
					separator: !i || v.type == 'albumend' || v.type == 'label' || v.type == 'historyend'
				}));

				['Manual cycle: wheel over button', 'Auto cycle items', 'Cycle time...', 'Options...', 'Reload'].forEach((v, i) => bMenu.newItem({
					str: v,
					func: () => this.lookUpAlbum(panelBio.alb.list.length + i),
					flags: !i ? MF_GRAYED : MF_STRING,
					checkItem: i == 1 && pptBio.cycItem,
					separator: i != 1
				}));

				bMenu.newMenu({
					menuName: 'More...'
				});
				for (let i = 0; i < 8; i++) bMenu.newItem({
					menuName: 'More...',
					str: ['Show top albums', 'Show album history', 'Auto lock', 'Reset album history...', 'Last.fm: ' + artist + '...', 'Last.fm: ' + artist + ': similar artists...', 'Last.fm: ' + artist + ': top albums...', 'AllMusic: ' + artist + '...'][i],
					func: () => this.lookUpAlbumItems(i),
					checkItem: i < 3 && [pptBio.showTopAlbums, pptBio.showAlbumHistory, pptBio.autoLock][i],
					separator: i == 1 || i == 2 || i == 3 || i == 4
				});
				break;
		}
		bMenu.load(x, y);
	}

	mainMenu() {
		menuBio.newMenu({});
		menuBio.newItem({
			str: 'Biography serverBio',
			flags: MF_GRAYED,
			separator: true,
			hide: !panelBio.serverBio || !this.shift || !vkBio.k('ctrl')
		});

		menuBio.newItem({
			str: pptBio.artistView ? 'Biography: switch to ' + (!pptBio.allmusic_bio ? (!pptBio.lockBio || pptBio.bothBio ? 'prefer ' : '') + 'allmusic' + (pptBio.bothBio ? ' first' : '') : (!pptBio.lockBio || pptBio.bothBio ? 'prefer ' : '') + 'last.fm' + (pptBio.bothBio ? ' first' : '')) : 'Review: switch to ' + (!pptBio.allmusic_alb ? (!pptBio.lockRev || pptBio.bothRev ? 'prefer ' : '') + 'allmusic' + (pptBio.bothRev ? ' first' : '') : (!pptBio.lockRev || pptBio.bothRev ? 'prefer ' : '') + 'last.fm' + (pptBio.bothRev ? ' first' : '')),
			func: () => txt.toggle(pptBio.artistView ? (!pptBio.bothBio ? 0 : 6) : (!pptBio.bothRev ? 1 : 7)),
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Display'
		});

		for (let i = 0; i < 10; i++) menuBio.newItem({
			menuName: 'Display',
			str: () => this.display.str[i],
			func: () => this.setDisplay(i),
			flags: i == 1 && pptBio.autoEnlarge || i == 9 && pptBio.lookUp == 2 ? MF_GRAYED : MF_STRING,
			checkItem: (i == 3 || i == 4) && this.display.check[i],
			checkRadio: (i < 3 || i > 4 && i < 7 || i > 6 && i < 9) && this.display.check[i],
			separator: i == 2 || i == 3 || i == 4 || i == 6 || i == 8
		});

		menuBio.newItem({
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Sources'
		});

		menuBio.newMenu({
			menuName: 'Biography',
			str: 'Biography: ' + (pptBio.allmusic_bio ? !pptBio.bothBio ? (!pptBio.lockBio ? 'prefer ' : '') + 'allmusic' : 'prefer both' : !pptBio.bothBio ? (!pptBio.lockBio ? 'prefer ' : '') + 'last.fm' : 'prefer both'),
			appendTo: 'Sources'
		});

		for (let i = 0; i < 4; i++) menuBio.newItem({
			menuName: 'Biography',
			str: [(!pptBio.lockBio ? 'Prefer allmusic' : 'Allmusic'), (!pptBio.lockBio ? 'Prefer last.fm' : 'Last.fm'), 'Prefer both', 'Lock to single source'][i],
			func: () => txt.toggle([0, 0, 4, 2][i]),
			flags: (i < 2 || i == 3) && pptBio.bothBio ? MF_GRAYED : MF_STRING,
			checkItem: i > 1 && [pptBio.bothBio, pptBio.lockBio][i - 2],
			checkRadio: i < 2 && [pptBio.allmusic_bio && !pptBio.bothBio, !pptBio.allmusic_bio && !pptBio.bothBio][i],
			separator: i == 1 || i == 2
		});

		menuBio.newMenu({
			menuName: 'Review',
			str: 'Review: ' + (pptBio.allmusic_alb ? !pptBio.bothRev ? (!pptBio.lockRev ? 'prefer ' : '') + 'allmusic' : 'prefer both' : !pptBio.bothRev ? (!pptBio.lockRev ? 'prefer ' : '') + 'last.fm' : 'prefer both'),
			appendTo: 'Sources'
		});

		for (let i = 0; i < 4; i++) menuBio.newItem({
			menuName: 'Review',
			str: [(!pptBio.lockRev ? 'Prefer allmusic' : 'Allmusic'), (!pptBio.lockRev ? 'Prefer last.fm' : 'Last.fm'), 'Prefer both', 'Lock to single source'][i],
			func: () => txt.toggle([1, 1, 5, 3][i]),
			flags: (i < 2 || i == 3) && pptBio.bothRev ? MF_GRAYED : MF_STRING,
			checkItem: i > 1 && [pptBio.bothRev, pptBio.lockRev][i - 2],
			checkRadio: i < 2 && [pptBio.allmusic_alb && !pptBio.bothRev, !pptBio.allmusic_alb && !pptBio.bothRev][i],
			separator: i
		});

		menuBio.newMenu({
			menuName: 'Last.fm type',
			appendTo: 'Review'
		});

		['Album', 'Album + track', 'Track'].forEach((v, i) => menuBio.newItem({
			menuName: 'Last.fm type',
			str: v,
			func: () => {
				pptBio.inclTrackRev = i;
				panelBio.style.inclTrackRev = pptBio.inclTrackRev;
				if (pptBio.inclTrackRev) serverBio.checkTrack({
					force: true,
					artist: panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(pptBio.focus),
					title: name.title(pptBio.focus)
				});
				txt.refresh(1);
			},
			checkRadio: i == pptBio.inclTrackRev
		}));

		menuBio.newItem({
			menuName: 'Sources',
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Photo',
			appendTo: 'Sources',
			str: 'Photo: ' + (pptBio.cycPhoto ? 'cycle' : 'artist')
		});

		['Cycle from folder', 'Artist (single image [fb2k: display])'].forEach((v, i) => menuBio.newItem({
			menuName: 'Photo',
			str: v,
			func: () => {
				pptBio.toggle(['cycPhoto', 'cycPhoto'][i]);
				imgBio.updImages();
			},
			checkRadio: [pptBio.cycPhoto, !pptBio.cycPhoto][i]
		}));

		menuBio.newMenu({
			menuName: 'Cover',
			str: 'Cover: ' + (!panelBio.alb.ix || pptBio.artistView ? pptBio.loadCovAllFb || pptBio.loadCovFolder ? 'cycle' : this.img.covType[pptBio.covType] : 'front'),
			appendTo: 'Sources',
			flags: !panelBio.alb.ix || pptBio.artistView ? MF_STRING : MF_GRAYED
		});

		this.img.covType.forEach((v, i) => menuBio.newItem({
			menuName: 'Cover',
			str: v,
			func: () => this.setCover(i),
			flags: !pptBio.loadCovAllFb && i < 5 ? MF_GRAYED : MF_STRING,
			checkItem: (pptBio.loadCovAllFb || i > 4) && [imgBio.cov.selection[0] != -1, imgBio.cov.selection[1] != -1, imgBio.cov.selection[2] != -1, imgBio.cov.selection[3] != -1, imgBio.cov.selection[4] != -1, pptBio.loadCovAllFb, pptBio.loadCovFolder][i],
			checkRadio: !pptBio.loadCovAllFb && i == pptBio.covType,
			separator: i == 4
		}));

		menuBio.newItem({
			menuName: 'Sources',
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Open containing folder',
			appendTo: 'Sources'
		});

		for (let i = 0; i < 4; i++) menuBio.newItem({
			menuName: 'Open containing folder',
			str:  this.openName[i],
			func: () => $Bio.browser('explorer /select,' + this.path.open[i], false),
			flags: this.path.img || this.path.am[3] || this.path.lfm[3] || this.path.tracks[3] ? MF_STRING : MF_GRAYED,
			separator: !i && this.openName.length > 1 && this.path.img,
			hide: !this.openName[i]
		});

		menuBio.newItem({
			menuName: 'Sources',
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Paste text from clipboard',
			appendTo: 'Sources',
			separator: pptBio.menuShowPaste == 2 || pptBio.menuShowPaste && this.shift,
			hide: !pptBio.menuShowPaste || pptBio.menuShowPaste == 1 && !this.shift
		});

		for (let i = 0; i < 4; i++) menuBio.newItem({
			menuName: 'Paste text from clipboard',
			str: [pptBio.artistView ? 'Biography [allmusic location]' : 'Review [allmusic location]', pptBio.artistView ? 'Biography [last.fm location]' : 'Review [last.fm location]', 'Open last edited', 'Undo'][i],
			func: () => this.setPaste(i),
			flags: !i && !this.path.am[2] || i == 1 && !this.path.lfm[2] || i == 2 && !this.undo.path || i == 3 && this.undo.text == '#!#' ? MF_GRAYED : MF_STRING,
			separator: i == 1 || i == 2
		});

		menuBio.newItem({
			menuName: 'Sources',
			str: 'Force update',
			func: () => panelBio.callServer(1, pptBio.focus, 'bio_forceUpdate', 0)
		});

		const style_arr = panelBio.style.name.slice();
		menuBio.newMenu({
			menuName: 'Layout'
		});

		style_arr.forEach((v, i) => menuBio.newItem({
			menuName: 'Layout',
			str: v,
			func: () => {
				const prop = pptBio.sameStyle ? 'style' : pptBio.artistView ? 'bioStyle' : 'revStyle';
				pptBio[prop] = i;
				txt.refresh(0);
			},
			checkItem: (pptBio.loadCovAllFb || i > 4) && [imgBio.cov.selection[0] != -1, imgBio.cov.selection[1] != -1, imgBio.cov.selection[2] != -1, imgBio.cov.selection[3] != -1, imgBio.cov.selection[4] != -1, pptBio.loadCovAllFb, pptBio.loadCovFolder][i],
			checkRadio: () => {
				const CheckIndex = pptBio.sameStyle ? pptBio.style : pptBio.artistView ? pptBio.bioStyle : pptBio.revStyle;
				return CheckIndex <= style_arr.length - 1 && i == CheckIndex;
			},
			separator: i == 4 || style_arr.length > 5 && i == style_arr.length - 1
		}));

		menuBio.newMenu({
			menuName: 'Create && manage styles',
			appendTo: 'Layout'
		});

		['Create new style...', 'Rename custom style...', 'Delete custom style...', 'Export custom style...', 'Reset style...'].forEach((v, i) => menuBio.newItem({
			menuName: 'Create && manage styles',
			str: v,
			func: () => this.setStyles(i),
			flags: !i || pptBio.style > 4 || i == 4 ? MF_STRING : MF_GRAYED,
			separator: !i
		}));

		menuBio.newItem({
			menuName: 'Layout',
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Filmstrip',
			appendTo: 'Layout'
		});

		['Top', 'Right', 'Bottom', 'Left', 'Reset to default size...'].forEach((v, i) => menuBio.newItem({
			menuName: 'Filmstrip',
			str: v,
			func: () => filmStrip.set(i),
			checkRadio: i < 4 && i == pptBio.filmStripPos,
			separator: i == 3
		}));

		menuBio.newItem({
			menuName: 'Layout',
			separator: true
		});

		['Reset zoom', 'Reload'].forEach((v, i) => menuBio.newItem({
			menuName: 'Layout',
			str: v,
			func: () => !i ? butBio.resetZoom() : window.Reload(),
		}));

		menuBio.newMenu({
			menuName: 'Image'
		});

		menuBio.newItem({
			menuName: 'Image',
			str: 'Auto cycle',
			func: () => pptBio.toggle('cycPic'),
			checkItem: pptBio.cycPic,
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Alignment',
			appendTo: 'Image',
			hide: pptBio.style > 3
		});

		for (let i = 0; i < 4; i++) menuBio.newItem({
			menuName: 'Alignment',
			str: pptBio.style == 0 || pptBio.style == 2 ? ['Left', 'Centre', 'Right', 'Align with text'][i] : ['Top', 'Centre', 'Bottom', 'Align with text'][i],
			func: () => {
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
			},
			checkItem: i == 3 && pptBio.textAlign,
			checkRadio: i == (pptBio.style == 0 || pptBio.style == 2 ? pptBio.alignH : pptBio.alignV),
			separator: i == 2
		});

		menuBio.newMenu({
			menuName: 'Alignment horizontal',
			appendTo: 'Image',
			hide: pptBio.style < 4
		});

		['Left', 'Centre', 'Right'].forEach((v, i) => menuBio.newItem({
			menuName: 'Alignment horizontal',
			str: v,
			func: () => {
				pptBio.alignH = i;
				imgBio.clearCache();
				imgBio.getImages()
			},
			checkRadio:  i == pptBio.alignH
		}));

		menuBio.newMenu({
			menuName: 'Alignment vertical',
			appendTo: 'Image',
			hide: pptBio.style < 4
		});

		['Top', 'Centre', 'Bottom', 'Auto'].forEach((v, i) => menuBio.newItem({
			menuName: 'Alignment vertical',
			str: v,
			func: () => {
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
			},
			checkRadio: [!pptBio.alignV && !pptBio.alignAuto, pptBio.alignV == 1 && !pptBio.alignAuto, pptBio.alignV == 2 && !pptBio.alignAuto, pptBio.alignAuto][i],
			separator: i == 2
		}));

		menuBio.newItem({
			menuName: 'Image',
			separator: true
		});

		menuBio.newMenu({
			menuName: 'Black list',
			appendTo: 'Image'
		});

		for (let i = 0; i < 3; i++) menuBio.newItem({
			menuName: 'Black list',
			str: this.img.blacklistStr[i],
			func: () => this.setImageBlacklist(i),
			flags: !i && this.img.isLfm || i == 2 ? MF_STRING : MF_GRAYED,
			hide: i == 2 && imgBio.blackList.undo[0] != this.img.artistClean
		});

		this.img.blacklist.forEach((v, i) => menuBio.newItem({
			menuName: 'Black list',
			str: (this.img.artist + '_' + v).replace(/&/g, '&&'),
			func: () => this.setImageBlacklist(i + (imgBio.blackList.undo[0] == this.img.artistClean ? 3 : 2)),
		}));

		menuBio.newItem({
			separator: true
		});

		const pl_no = Math.ceil(this.playlist.menu.length / 30);
		menuBio.newMenu({
			menuName: 'Playlists',
			separator: pptBio.menuShowPlaylists == 2 || pptBio.menuShowPlaylists && this.shift,
			hide: !pptBio.menuShowPlaylists || pptBio.menuShowPlaylists == 1 && !this.shift
		});

		for (let j = 0; j < pl_no; j++) {
			const n = '# ' + (j * 30 + 1 + ' - ' + Math.min(this.playlist.menu.length, 30 + j * 30) + (30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? '  >>>' : ''));
			menuBio.newMenu({
				menuName: n,
				appendTo: 'Playlists'
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

		menuBio.newMenu({
			menuName: 'Tagger',
			str: 'Tagger' + (this.handles.Count ? '' : ': N/A no playlist tracks selected'),
			separator: pptBio.menuShowTagger == 2 || pptBio.menuShowTagger && this.shift,
			hide: !pptBio.menuShowTagger || pptBio.menuShowTagger == 1 && !this.shift
		});

		for (let i = 0; i < 11 + 4; i++) menuBio.newItem({
			menuName: 'Tagger',
			str: !i ? 'Write existing file info to tags: ' : i == 11 + 1 ? 'All tagger settings...' : i == 11 + 2 ? 'Tag files...' + (this.tags ? '' : ' N/A no tags enabled') : i == 11 + 3 ? 'Cancel' : i == 11 ? cfg[`tagName${i - 1}`] + (cfg[`tagEnabled${i - 1}`] ? ' (' + cfg[`tagEnabled${i}`] + ')' : '') : cfg[`tagName${i - 1}`],
			func: () => cfg.setTag(i, this.handles),
			flags: !i || i == 11 + 1 && !this.tags ? MF_GRAYED : MF_STRING,
			checkItem: i && i < 11 + 1 && cfg[`tagEnabled${i - 1}`],
			separator: !i || i == 5 || i == 11 || i == 12
		});

		menuBio.newMenu({
			menuName: 'Missing data',
			separator: pptBio.menuShowMissingData == 2 || pptBio.menuShowMissingData && this.shift,
			hide: !pptBio.menuShowMissingData || pptBio.menuShowMissingData == 1 && !this.shift
		});

		['Album review [allmusic]', 'Album review [last.fm]', 'Biography [allmusic]', 'Biography [last.fm]', 'Photos [last.fm]'].forEach((v, i) => menuBio.newItem({
			menuName: 'Missing data',
			str: v,
			func: () => this.checkMissingData(i),
			separator: i == 1 || i == 3
		}));

		menuBio.newItem({
			str: pptBio.panelActive ? 'Inactivate' : 'Activate biography',
			func: () => panelBio.inactivate(),
			separator: true,
			hide: !pptBio.menuShowInactivate || pptBio.menuShowInactivate == 1 && !this.shift
		});

		if (!IsFolder("Z:\\lib")) { // Disable right click context menu Options... on Linux, otherwise it will crash and is not yet supported
			menuBio.newItem({
				str: 'Options...',
				func: () => cfg.open('PanelCfg'),
			});
		}
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
				this.missingBio('foAmBio', 'AllMusic', 'Biography');
				break;
			case 3:
				this.missingBio('foLfmBio', 'Last.fm', 'Biography');
				break;
			case 4:
				this.missingArtImg('foImgArt', 'Last.fm', 'Photo');
				break;
		}
	}

	fresh() {
		if (panelBio.block() || !pptBio.cycItem || panelBio.zoom()) return;
		if (pptBio.artistView) {
			this.counter.bio++;
			if (this.counter.bio < pptBio.cycTimeItem) return;
			this.counter.bio = 0;
			if (panelBio.art.list.length < 2) return;
			this.wheel(1, true, false);
		} else {
			this.counter.rev++;
			if (this.counter.rev < pptBio.cycTimeItem) return;
			this.counter.rev = 0;
			if (panelBio.alb.list.length < 2) return;
			this.wheel(1, true, false);
		}
	}

	getBlacklistImageItems() {
		const imgInfo = imgBio.pth();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1); // needed for init
		this.img.blacklist = [];
		this.path.blackList = `${fb.ProfilePath}yttm\\blacklist_image.json`;

		if (!$Bio.file(this.path.blackList)) $Bio.save(this.path.blackList, JSON.stringify({
			'blacklist': {}
		}), true);

		if ($Bio.file(this.path.blackList)) {
			this.img.artistClean = $Bio.clean(this.img.artist).toLowerCase();
			this.img.list = $Bio.jsonParse(this.path.blackList, false, 'file');
			this.img.blacklist = this.img.list.blacklist[this.img.artistClean] || [];
		}

		this.img.blacklistStr = [this.img.isLfm ? '+ Add' + (!panelBio.style.showFilmStrip ? '' : ' main image') + ' to black list: ' + this.img.artist + '_' + this.img.name : '+ Add to black list: ' + (this.img.name ? 'N/A - requires last.fm photo. Selected image : ' + this.img.name : 'N/A - no' + (!panelBio.style.showFilmStrip ? '' : '') + ' image file'), this.img.blacklist.length ? ' - Remove from black list (click name): ' : 'No black listed images for current artist', 'Undo'];
	}

	getDisplayStr() {
		const m = pptBio.artistView ? pptBio.bioMode : pptBio.revMode;
		this.display.check = [pptBio.sameStyle ? !pptBio.img_only && !pptBio.text_only : m == 0, pptBio.sameStyle ? pptBio.img_only : m == 1, pptBio.sameStyle ? pptBio.text_only : m == 2, pptBio.showFilmStrip, pptBio.heading, pptBio.artistView, !pptBio.artistView, !pptBio.focus, pptBio.focus];
		const n = [!panelBio.id.imgText ? 'Auto' : 'Image+text', 'Image', 'Text', 'Filmstrip', 'Heading', 'Artist view', 'Album view', 'Prefer nowplaying', 'Follow selected track (playlist)', !panelBio.id.imgText ? 'Toggle: auto vs image+text' : 'Toggle: image+text vs auto'];
		const click = [!this.display.check[0] ? '\tMiddle click' : '', !this.display.check[1] && !pptBio.text_only && txt.text ? '\tMiddle click' : '', !this.display.check[2] && !pptBio.img_only ? '\tMiddle click' : '', '\tALT+Middle click', '', !pptBio.artistView ? (!pptBio.dblClickToggle ? '\tClick' : '\tDouble click') : '', pptBio.artistView ? (!pptBio.dblClickToggle ? '\tClick' : '\tDouble click') : '', '', '', '', ''];
		this.display.str = n.map((v, i) => v + click[i])
	}

	getOpenName() {
		const fo = [this.path.img, this.path.am[3], this.path.lfm[3], this.path.tracks[3]];
		this.openName = ['Image', pptBio.artistView ? 'Biography [allmusic]' : 'Review [allmusic]', pptBio.artistView ? 'Biography [last.fm]' : 'Review [last.fm]', pptBio.artistView ? '' : 'Tracks [last.fm]'];
		let i = this.openName.length;
		while (i--)
			if (!fo[i]) {
				this.openName.splice(i, 1);
				fo.splice(i, 1);
				this.path.open.splice(i, 1);
			}
	}

	images(v) {
		return name.isLfmImg(fsoBio.GetFileName(v));
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
				panelBio.style.inclTrackRev = pptBio.inclTrackRev;
				if (pptBio.showAlbumHistory && pptBio.inclTrackRev) {
					if (panelBio.alb.list[panelBio.alb.ix].type.includes('history')) panelBio.style.inclTrackRev = 0;
					txt.albumFlush();
					force = true;
				}
				txt.getItem(false, panelBio.art.ix, panelBio.alb.ix, force);
				txt.getScrollPos();
				imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
				panelBio.callServer(false, pptBio.focus, 'bio_lookUpItem', 0);
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
				panelBio.setCycItem();
				break;
			case i == panelBio.alb.list.length + 3:
				cfg.open('PanelCfg');
				break;
			case i == panelBio.alb.list.length + 4:
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
				panelBio.getList(!pptBio.showTopAlbums ? true : false);
				break;
			case 1:
				panelBio.alb.ix = 0;
				pptBio.toggle('showAlbumHistory');
				panelBio.getList(!pptBio.showAlbumHistory ? true : false);
				break;
			case 2:
				pptBio.toggle('autoLock');
				break;
			case 3:
				panelBio.resetAlbumHistory();
				break;
			default: {
				const artist = panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(pptBio.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 7) $Bio.browser('https://www.last.fm/' + (cfg.langLfm == 'EN' ? '' : cfg.langLfm.toLowerCase() + '/') + 'music/' + encodeURIComponent(artist) + brArr[i - 4], true);
				else $Bio.browser('https://www.allmusic.com/search/artists/' + encodeURIComponent(artist), true);
				break;
			}
		}
		if (i < 4) {
			txt.logScrollPos();
			filmStrip.logScrollPos();
			imgBio.get = false;
			txt.get = 0;
			panelBio.style.inclTrackRev = pptBio.inclTrackRev;
			if (pptBio.inclTrackRev) {
				if (panelBio.alb.list[panelBio.alb.ix].type.includes('history')) panelBio.style.inclTrackRev = 0;
				txt.albumFlush();
			}
			txt.getItem(false, panelBio.art.ix, panelBio.alb.ix, true);
			txt.getScrollPos();
			imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
			panelBio.callServer(false, pptBio.focus, 'bio_lookUpItem', 0);
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
				txt.getItem(false, panelBio.art.ix, panelBio.alb.ix);
				txt.getScrollPos();
				imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
				panelBio.callServer(false, pptBio.focus, 'bio_lookUpItem', 0);
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
				panelBio.setCycItem();
				break;
			case i == panelBio.art.list.length + 3:
				cfg.open('PanelCfg');
				break;
			case i == panelBio.art.list.length + 4:
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
				panelBio.getList(!pptBio.showSimilarArtists ? true : false);
				break;
			case 1:
				panelBio.art.ix = 0;
				pptBio.toggle('showMoreTags');
				panelBio.getList(!pptBio.showMoreTags ? true : false);
				break;
			case 2:
				panelBio.art.ix = 0;
				pptBio.toggle('showArtistHistory');
				panelBio.getList(!pptBio.showArtistHistory ? true : false);
				break;
			case 3:
				pptBio.toggle('autoLock');
				break;
			case 4:
				panelBio.resetArtistHistory();
				break;
			default: {
				const artist = panelBio.art.list.length ? panelBio.art.list[0].name : name.artist(pptBio.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 8) $Bio.browser('https://www.last.fm/' + (cfg.langLfm == 'EN' ? '' : cfg.langLfm.toLowerCase() + '/') + 'music/' + encodeURIComponent(artist) + brArr[i - 5], true);
				else $Bio.browser('https://www.allmusic.com/search/artists/' + encodeURIComponent(artist), true);
				break;
			}
		}
		if (i < 5) {
			txt.logScrollPos();
			filmStrip.logScrollPos();
			imgBio.get = false;
			txt.get = 0;
			txt.getItem(false, panelBio.art.ix, panelBio.alb.ix);
			txt.getScrollPos();
			imgBio.getItem(panelBio.art.ix, panelBio.alb.ix);
			panelBio.callServer(false, pptBio.focus, 'bio_lookUpItem', 0);
			filmStrip.check();
		}
	}

	missingArtImg(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(cfg.tf.artist);
				const sort = FbTitleFormat(cfg.tf.artist + ' | ' + cfg.tf.album + ' | [[%discnumber%.]%tracknumber%. ][%track artist% - ]' + cfg.tf.title);
				let a = '';
				let cur_a = '####';
				let found = false;
				let m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const artists = tf_a.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					a = artists[i].toLowerCase();
					if (a != cur_a) {
						cur_a = a;
						const pth = panelBio.cleanPth(cfg.pth[n1], h, 'tag');
						let files = utils.Glob(pth + '*');
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
		popUpBoxBio.confirm(this.popUpTitle, this.popUpText(n2, n3), 'OK', 'Cancel', continue_confirmation);
	}

	missingBio(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(cfg.tf.artist);
				const sort = FbTitleFormat(cfg.tf.artist + ' | ' + cfg.tf.album + ' | [[%discnumber%.]%tracknumber%. ][%track artist% - ]' + cfg.tf.title);
				let a = '';
				let cur_a = '####';
				let found = false;
				let m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const artists = tf_a.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					a = artists[i].toLowerCase();
					if (a != cur_a) {
						cur_a = a;
						const pth = panelBio.cleanPth(cfg.pth[n1], h, 'tag') + $Bio.clean(a) + cfg.suffix[n1] + '.txt';
						if (a && !$Bio.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		popUpBoxBio.confirm(this.popUpTitle, this.popUpText(n2, n3), 'OK', 'Cancel', continue_confirmation);
	}

	missingRev(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_albumArtist = FbTitleFormat(cfg.tf.albumArtist);
				const tf_album = FbTitleFormat(cfg.tf.album);
				const sort = FbTitleFormat(cfg.tf.albumArtist + ' | ' + cfg.tf.album + ' | [[%discnumber%.]%tracknumber%. ][%track artist% - ]' + cfg.tf.title);
				let albumArtist = '';
				let cur_albumArtist = '####';
				let cur_album = '####';
				let album = '';
				let found = false;
				let m = new FbMetadbHandleList();
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
						const pth = panelBio.cleanPth(cfg.pth[n1], h, 'tag') + $Bio.clean(albumArtist) + ' - ' + $Bio.clean(album) + cfg.suffix[n1] + '.txt';
						if (albumArtist && album && !$Bio.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		popUpBoxBio.confirm(this.popUpTitle, this.popUpText(n2, n3), 'OK', 'Cancel', continue_confirmation);
	}

	playlists_changed() {
		if (!pptBio.menuShowPlaylists) return;
		this.playlist.menu = [];
		for (let i = 0; i < plman.PlaylistCount; i++) this.playlist.menu.push({
			name: plman.GetPlaylistName(i).replace(/&/g, '&&'),
			ix: i
		});
	}

	popUpText(n2, n3) {
		return `Check media library and create playlist: ${n2} ${n3} Missing\n\nServer settings will be used.\n\nWARNING: This operation analyses a lot of data. It may trigger an "Unresponsive script" pop-up. If that happens choose "Continue" or "Don't ask me again". Choosing "Stop script" will trigger an error.\n\nContinue?`;
	}

	rbtn_up(x, y) {
		this.right_up = true;
		this.shift = vkBio.k('shift');
		const imgInfo = imgBio.pth();

		this.docTxt = utils.GetClipboardText();
		this.getDisplayStr();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1);
		this.path.am = pptBio.artistView ? txt.amBioPth() : txt.amRevPth();
		this.path.lfm = pptBio.artistView ? txt.lfmBioPth() : txt.lfmRevPth();
		this.path.tracks = txt.lfmTrackPth();
		this.path.open = [this.path.img, this.path.am[1], this.path.lfm[1], this.path.tracks[1]];
		this.getOpenName();
		this.getBlacklistImageItems();
		if (pptBio.menuShowTagger == 2 || pptBio.menuShowTagger && this.shift) this.handles = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		this.tagsEnabled();

		this.refreshMainMenu();
		menuBio.load(x, y);
		this.right_up = false;
	}

	refreshMainMenu() {
		menuBio = new MenuManagerBio;
		this.mainMenu();
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
				pptBio.heading = !pptBio.heading ? 2 : 0;
				panelBio.style.fullWidthHeading = pptBio.heading && pptBio.fullWidthHeading;
				txt.refresh(1);
				break;
			case 5:
			case 6:
				panelBio.click('', '', true);
				break;
			case 7:
			case 8:
				pptBio.toggle('focus');
				panelBio.changed();
				txt.on_playback_new_track();
				imgBio.on_playback_new_track();
				break;
			case 9:
				pptBio.toggle('imgText');
				txt.refresh(0);
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
		let bl = this.img.list.blacklist[this.img.artistClean];
		if (bl) this.img.list.blacklist[this.img.artistClean] = this.sort([...new Set(bl)]);
		imgBio.blackList.artist = '';
		$Bio.save(this.path.blackList, JSON.stringify({
			'blacklist': $Bio.sortKeys(this.img.list.blacklist)
		}, null, 3), true);
		imgBio.check();
		window.NotifyOthers('bio_blacklist', 'bio_blacklist');
	}

	setPaste(i) {
		switch (i) {
			case 0: {
				this.undo.folder = this.path.am[0];
				this.undo.path = this.path.am[1];
				this.undo.text = $Bio.open(this.undo.path);
				$Bio.buildPth(this.undo.folder);
				$Bio.save(this.undo.path, this.docTxt + '\r\n\r\nCustom ' + (pptBio.artistView ? 'Biography' : 'Review'), true);
				const amPth_n = pptBio.artistView ? txt.amBioPth() : txt.amRevPth();
				if (this.path.am[1] == amPth_n[1]) {
					pptBio.artistView ? pptBio.allmusic_bio = true : pptBio.allmusic_alb = true;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (pptBio.text_only) txt.paint();
				break;
			}
			case 1: {
				this.undo.folder = this.path.lfm[0];
				this.undo.path = this.path.lfm[1];
				this.undo.text = $Bio.open(this.undo.path);
				$Bio.buildPth(this.undo.folder);
				$Bio.save(this.undo.path, this.docTxt + '\r\n\r\nCustom ' + (pptBio.artistView ? 'Biography' : 'Review'), true);
				const lfmPth_n = pptBio.artistView ? txt.lfmBioPth() : txt.lfmRevPth();
				if (this.path.lfm[1] == lfmPth_n[1]) {
					pptBio.artistView ? pptBio.allmusic_bio = false : pptBio.allmusic_alb = false;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (pptBio.text_only) txt.paint();
				break;
			}
			case 2: {
				const open = (c, w) => {
					if (!$Bio.run(c, w)) fb.ShowPopupMessage('Unable to launch your default text editor.', 'Biography');
				};
				open('"' + this.undo.path, 1);
				break;
			}
			case 3:
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

	setPlaylist(i) {
		plman.ActivePlaylist = this.playlist.menu[i].ix;
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

	sort(data) {
		return data.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	}

	tagsEnabled() {
		this.tags = false;
		for (let i = 0; i < 11; i++)
			if (cfg[`tagEnabled${i}`]) {
				this.tags = true;
				break;
			}
	}

	wheel(step, resetCounters) {
		let i = 0;
		butBio.clearTooltip();
		let force = false;
		switch (true) {
			case pptBio.artistView:
				if (!panelBio.art.uniq.length) break;
				for (i = 0; i < panelBio.art.uniq.length; i++)
					if (!panelBio.art.ix && name.artist(pptBio.focus) == panelBio.art.uniq[i].name || panelBio.art.ix == panelBio.art.uniq[i].ix) break;
				i += step;
				if (i < 0) i = panelBio.art.uniq.length - 1;
				else if (i >= panelBio.art.uniq.length) i = 0;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panelBio.art.ix = panelBio.art.uniq[i].ix;
				if (panelBio.art.list[panelBio.art.ix].type.includes('history')) break;
				panelBio.logArtistHistory(panelBio.art.list[panelBio.art.ix].name);
				panelBio.getList();
				break;
			case !pptBio.artistView:
				if (!panelBio.alb.uniq.length) break;
				for (i = 0; i < panelBio.alb.uniq.length; i++)
					if (!panelBio.alb.ix && name.albumArtist(pptBio.focus) + ' - ' + name.album(pptBio.focus) == panelBio.alb.uniq[i].artist + ' - ' + panelBio.alb.uniq[i].album || panelBio.alb.ix == panelBio.alb.uniq[i].ix) break;
				i += step;
				if (i < 0) i = panelBio.alb.uniq.length - 1;
				else if (i >= panelBio.alb.uniq.length) i = 0;
				txt.logScrollPos();
				filmStrip.logScrollPos();
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
