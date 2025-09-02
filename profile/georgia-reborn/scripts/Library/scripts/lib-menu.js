'use strict';

/** @global @type {number} */
const LIB_MF_GRAYED = 0x00000001;
/** @global @type {number} */
const LIB_MF_STRING = 0x00000000;

class LibMenuManager {
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
			const menu = this.menu[a.menuName];
			menu.AppendMenuItem(a.flags, this.idx, a.str);
			if (a.checkItem) menu.CheckMenuItem(this.idx, a.checkItem);
			if (a.checkRadio) menu.CheckMenuRadioItem(this.idx, this.idx, this.idx);
			if (a.separator) menu.AppendMenuSeparator();
			this.func[this.idx] = v.func;
		}
	}

addSeparator({ menuName = this.baseMenu, separator = true }) { this.menuItems.push({ menuName: menuName || this.baseMenu, separator }); }

	appendMenu(v) {
		const a = this.clearArr ? v : this;
		if (!this.clearArr) this.executeFunctions(v, ['hide', 'menuName']);
		if (a.menuName == this.baseMenu || a.hide) return;
		if (!this.clearArr) this.executeFunctions(v, ['appendTo', 'flags', 'separator', 'str']);
		const menu = this.menu[a.appendTo || this.baseMenu];
		this.menu[a.menuName].AppendTo(menu, a.flags, a.str || a.menuName)
		if (a.separator) menu.AppendMenuSeparator();
	}

	clear() {
		this.menu = {};
		this.func = {};
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
		if (!this.menuItems.length) lib.men[this.name]();
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

		let Context;
		if (lib.men.show_context) {
			Context = fb.CreateContextMenuManager();
			Context.InitContext(lib.men.items);
			this.menu[this.baseMenu].AppendMenuSeparator();
			Context.BuildMenu(this.menu[this.baseMenu], 5000);
		}

		const idx = this.menu[this.baseMenu].TrackPopupMenu(x, y);
		this.run(idx);

		if (lib.men.show_context) {
			if (idx >= 5000 && idx <= 5800) Context.ExecuteByID(idx - 5000);
			lib.men.show_context = false;
		}

		this.clear();
	}

	newItem({ str = null, func = null, menuName = this.baseMenu, flags = LIB_MF_STRING, checkItem = false, checkRadio = false, separator = false, hide = false }) { this.menuItems.push({ str, func, menuName, flags, checkItem, checkRadio, separator, hide }); }

	newMenu({ menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = LIB_MF_STRING, separator = false, hide = false }) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) this.menuItems.push({ menuName, appendMenu: true, str, appendTo, flags, separator, hide });
	}

	run(idx) {
		const v = this.func[idx];
		if (v instanceof Function) v();
	}
}

/** @global @type {boolean} */
const libClearArr = true;

/**
 * The instance of `LibMenuManager` class for library main menu operations.
 * @typedef {LibMenuManager}
 * @global
 */
const libMenu = new LibMenuManager('mainMenu', libClearArr);

/**
 * The instance of `LibMenuManager` class for library filter menu operations.
 * @typedef {LibMenuManager}
 * @global
 */
const libFMenu = new LibMenuManager('filterMenu', libClearArr);

/**
 * The instance of `LibMenuManager` class for library search histry menu operations.
 * @typedef {LibMenuManager}
 * @global
 */
const libSMenu = new LibMenuManager('searchHistoryMenu', libClearArr);

/**
 * The instance of `LibMenuManager` class for library search menu operations.
 * @typedef {LibMenuManager}
 * @global
 */
const libSearchMenu = new LibMenuManager('searchMenu');

class LibMenuItems {
	constructor() {
		this.expandable = false;
		this.ix = -1;
		this.items = new FbMetadbHandleList();
		this.nm = '';
		this.pl = [];
		this.r_up = false;
		this.show_context = false;
		this.treeExpandLimit = $Lib.file('C:\\check_local\\1450343922.txt') ? 6000 : $Lib.clamp(libSet.treeExpandLimit, 10, 6000);
		this.playlists_changed(true);
		this.settingsBtnDn = false;
		this.validItem = false;
	}

	// * METHODS * //

	mainMenu() {
		libMenu.newMenu({ hide: !this.settingsBtnDn && libSet.settingsShow && this.validItem });

		// * Top menu options Library submenu
		libMenu.newItem({
			str: 'Library options menu',
			func: () => {
				grm.topMenu.topMenuOptions(grm.ui.state.mouse_x, grm.ui.state.mouse_y, true, 'library');
			},
			separator: () => true
		});

		if (grSet.layout === 'default' && grSet.theme.startsWith('custom')) {
			libMenu.newItem({
				str: !grm.ui.displayCustomThemeMenu ? 'Edit custom theme' : 'Close custom theme menu',
				func: () => {
					grm.ui.initCustomThemeMenuState();
				},
				separator: () => true
			});
		}

		// * Library layout switcher
		libMenu.newItem({
			str: grSet.libraryLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal',
			func: () => {
				grSet.libraryLayout = grSet.libraryLayout === 'normal' ? 'full' : 'normal';
				grm.ui.initLibraryLayoutState();
			},
			hide: () => grSet.layout === 'default' && grSet.libraryDesign === 'flowMode' || grSet.layout !== 'default'
		});
		libMenu.newItem({
			str: grSet.libraryLayout === 'split' ? 'Change layout to full' : 'Change layout to split',
			func: () => {
				grSet.libraryLayout = grSet.libraryLayout === 'split' ? 'full' : 'split';
				grm.ui.initLibraryLayoutState();
			},
			separator: () => true,
			hide: () => grSet.layout === 'default' && grSet.libraryDesign === 'flowMode' || grSet.layout !== 'default'
		});

		// * Browse mode
		libMenu.newItem({
			str: 'Browse mode',
			func: () => {
				grSet.panelBrowseMode = !grSet.panelBrowseMode;
				grm.ui.initBrowserModeState();
			},
			checkItem: grSet.panelBrowseMode,
			separator: () => true
		});

		if (this.validItem) {
			['Add to current playlist\tShift+enter', 'Send to new playlist\tCtrl+enter', 'Show now playing'].forEach((v, i) => libMenu.newItem({
				str: v,
				func: () => this.setPlaylist(i),
				flags: this.getPaylistFlag(i),
				separator: i == 1
			}));
		}

		if (this.validItem && libSet.albumArtOptionsShow) {
			const gridStr = !lib.panel.imgView ? 'Show album grid' : (!libSet.facetView ? 'Show tree' : 'Show text');
			libMenu.newItem({
				str: gridStr,
				func: () => {
					libSet.artId = 0;
					this.setPlaylist(3)
				},
				flags: !lib.panel.pn_h_auto || libSet.pn_h != libSet.pn_h_min ? LIB_MF_STRING : LIB_MF_GRAYED
			});

			const gridStr2 = libSet.artId === 4 && gridStr !== 'Show album grid' ? 'Show album grid' : 'Show artist grid';
			libMenu.newItem({
				str: gridStr2,
				func: () => {
					libSet.artId = libSet.artId === 0 || gridStr2 === 'Show artist grid' ? 4 : 0;
					if (lib.panel.imgView) libSet.toggle('albumArtShow');
					this.setPlaylist(3);
				},
				separator: !lib.panel.imgView
			});
		}

		for (let i = 0; i < 2; i++) {
			libMenu.newItem({
				str: [this.items.Count ? 'Refresh selected images...' : 'Refresh images: none selected', 'Refresh all images...'][i],
				func: () => this.setMode(i),
				flags: () => lib.panel.imgView && !i && this.items.Count || !lib.panel.imgView || i ? LIB_MF_STRING : LIB_MF_GRAYED,
				hide: () => !this.validItem || !libSet.albumArtShow
			});
		}

		if (this.validItem && !lib.panel.imgView) {
			['Collapse all\tNum -', 'Expand\tNum *'].forEach((v, i) => libMenu.newItem({
				str: v,
				func: () => this.setTreeState(i),
				flags: !i || i == 1 && this.expandable ? LIB_MF_STRING : LIB_MF_GRAYED,
				separator: i == 1 && this.show_context && (!libSet.settingsShow && !libSet.searchShow && !libSet.filterShow || this.shift)
			}));
		}

		libMenu.newMenu({ menuName: 'Settings', hide: !this.show_context || lib.ui.style.topBarShow && !this.shift });

		const mainMenu = () => this.show_context ? 'Settings' : 'baseMenu';

		libMenu.newMenu({ menuName: 'Views', separator: false });
		lib.panel.menu.forEach((v, i) => libMenu.newItem({
			menuName: 'Views',
			str: v,
			func: () => this.setView(i),
			checkRadio: i == libSet.viewBy,
			separator: i > lib.panel.menu.length - 3
		}));

		// * View by Folder Structure Hide menu
		if (libSet.viewBy === 10) {
			libMenu.newMenu({ menuName: 'Hide', separator: false });
			['Hide album year', 'Hide track number', 'Hide file extension'].forEach((v, i) => {
				libMenu.newItem({
					menuName: 'Hide',
					str: v,
					func: () => {
						const key = i.toString();
						if (libSet.viewByFolderHide.includes(key)) {
							libSet.viewByFolderHide = libSet.viewByFolderHide.replace(key, '');
						} else {
							libSet.viewByFolderHide += key;
						}
						lib.pop.buildTree(lib.lib.root, 0);
						lib.panel.imgView = grSet.libraryLayout === 'normal' && grSet.libraryLayoutFullPreset ? libSet.albumArtShow = false : libSet.albumArtShow;
						lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
					},
					checkItem: libSet.viewByFolderHide.includes(i.toString()),
					separator: i > lib.panel.menu.length - 3
				});
			});
		}

		const d = {};
		this.getSortData(d);
		libMenu.newMenu({ menuName: d.menuName, flags: d.sortType ? LIB_MF_STRING : LIB_MF_GRAYED, separator: this.show_context });
		if (d.sortType) {
			libMenu.newItem({
				menuName: d.menuName,
				str: ['', 'By year', 'Albums by year'][d.sortType],
				flags: LIB_MF_GRAYED,
				separator: true
			});
			const menuSort = [[], ['Default', 'Ascending', 'Descending'], ['Default', 'Ascending (hide year)', 'Ascending (show year)', 'Descending (hide year)', 'Descending (show year)', 'Action: year after album', 'Action: year before album']][d.sortType];
			menuSort.forEach((v, i) => libMenu.newItem({
				menuName: d.menuName,
				str: v,
				func: () => this.sortByDate(i, d),
				flags: i > 4 && (d.sortIX == 1 || d.sortIX == 3) ? LIB_MF_GRAYED : LIB_MF_STRING,
				checkRadio: d.sortIX == -1 && !i || i == d.sortIX || d.sortType == 2 && i == 5 && !libSet.yearBeforeAlbum || i == 6 && libSet.yearBeforeAlbum,
				separator: i == 0 || d.sortType == 2 && (i == 2 || i == 4)
			}));
		}

		libMenu.newItem({
			str: 'Write theme to tags',
			func: () => WriteThemeTags()
		});

		const meta_manager = new PlaylistMetaManager();
		libMenu.newItem({
			str: 'Write album statistics to tags',
			func: () => meta_manager.write_album_stats_to_tags()
		});

		libMenu.newItem({
			menuName: 'Views',
			str: 'Configure views...',
			func: () => lib.panel.open('views')
		});

		libMenu.newMenu({ menuName: 'Statistics', appendTo: mainMenu(), separator: true });
		[lib.pop.countsRight && !lib.panel.imgView ? ['None', '# Tracks', '# Items'][lib.pop.nodeCounts] : 'None', 'Bitrate', 'Duration', 'Total size', 'Rating', 'Popularity', 'Date', 'Playback queue', 'Playcount', 'First played', 'Last played', 'Added', 'Configure statistics...'].forEach((v, i) => libMenu.newItem({
			menuName: 'Statistics',
			str: v,
			func: () => this.setStatistics(i),
			checkRadio: i == libSet.itemShowStatistics,
			separator: !i || i == 7 || i == 11
		}));

		libMenu.newMenu({ menuName: 'Album art', appendTo: mainMenu(), hide: !lib.panel.imgView });
		['Front', 'Back', 'Disc', 'Icon', 'Artist', 'Group: auto', 'Group: top level', 'Group: two levels', 'Change group name...', 'Configure album art...'].forEach((v, i) => libMenu.newItem({
			menuName: 'Album art',
			str: v,
			func: () => this.setAlbumart(i),
			flags: i == 8 && (lib.panel.folderView || libSet.rootNode != 3) ? LIB_MF_GRAYED : LIB_MF_STRING,
			checkRadio: i == libSet.artId || i - 5 == libSet.albumArtGrpLevel,
			separator: i == 4 || i == 7 || i == 8
		}));

		libMenu.newMenu({ menuName: 'Quick setup', appendTo: mainMenu() });

		['Georgia-Reborn'].forEach((v, i) => libMenu.newItem({
			menuName: 'Quick setup',
			str: v,
			func: () => lib.panel.set('quickSetup', 12),
			flags: () => i != 10 || this.items.Count ? LIB_MF_STRING : LIB_MF_GRAYED,
			separator: i == 0
		}));

		['Traditional', 'Modern', 'Ultra-Modern', 'Clean', 'Facet'].forEach((v, i) => libMenu.newItem({
			menuName: 'Quick setup',
			str: v,
			func: () => lib.panel.set('quickSetup', i),
			separator: i == 3 || i == 4
		}));

		if (libSet.albumArtOptionsShow) {
			['Covers [labels right]', 'Covers [labels bottom]', 'Covers [labels blend]', 'Artist photos [labels right]', grSet.libraryThumbnailSize === 'auto' ? 'Album art size + (disable thumbnail auto-size)' : 'Album art size +', grSet.libraryThumbnailSize === 'auto' ? 'Album art size - (disable thumbnail auto-size)' : 'Album art size -', 'Flow mode', 'Always load preset with current \'view\' pattern'].forEach((v, i) => libMenu.newItem({
				menuName: 'Quick setup',
				str: v,
				func: () => lib.panel.set('quickSetup', i + 5),
				flags: i == 4 && (libSet.thumbNailSize == 7 || !lib.panel.imgView || libSet.albumArtFlowMode || grSet.libraryThumbnailSize === 'auto') || i == 5 && (libSet.thumbNailSize == 0 || !lib.panel.imgView || libSet.albumArtFlowMode || grSet.libraryThumbnailSize === 'auto') ? LIB_MF_GRAYED : LIB_MF_STRING,
				checkItem: i == 7 && libSet.presetLoadCurView,
				separator: i == 2 || i == 3 || i == 5 || i == 6
			}));
		}

		// ! Source panel and playlist feature is not supported in a single panel/one library i.e in Georgia/Georgia-ReBORN
		libMenu.newMenu({ menuName: 'Source', appendTo: mainMenu(), separator: true });
		['Library'/*, 'Panel', 'Playlist' */].forEach((v, i) => libMenu.newItem({
			menuName: 'Source',
			str: v,
			func: () => this.setSource(i),
			checkRadio: i == (libSet.libSource - 1 < 0 || libSet.fixedPlaylist ? 2 : libSet.libSource - 1),
			separator: i == 2
		}));

		// menu.newItem({
		// 	menuName: 'Source',
		// 	str: 'Select source panel',
		// 	func: () => this.setSourcePanel(),
		// 	flags: libSet.libSource != 2 ? MF_GRAYED_LIB : MF_STRING_LIB,
		// 	separator: true
		// });

		libMenu.newMenu({ menuName: 'Playlist', appendTo: 'Source' });
		libMenu.newItem({
			menuName: 'Playlist',
			str: 'Active playlist',
			func: () => { this.setActivePlaylist(); this.setSource(2) },
			checkRadio: libSet.libSource == 0,
			separator: true
		});

		const pl_no = Math.ceil(this.pl.length / 30);
		const pl_ix = libSet.fixedPlaylist ? plman.FindPlaylist(libSet.fixedPlaylistName) : -1;
		for (let j = 0; j < pl_no; j++) {
			const n = `# ${j * 30 + 1} - ${Math.min(this.pl.length, 30 + j * 30)}${30 + j * 30 > pl_ix && ((j * 30) - 1) < pl_ix ? '  >>>' : ''}`;
			libMenu.newMenu({ menuName: n, appendTo: 'Playlist' });
			for (let i = j * 30; i < Math.min(this.pl.length, 30 + j * 30); i++) {
				libMenu.newItem({
					menuName: n,
					str: this.pl[i].menuName,
					func: () => { this.setFixedPlaylist(i); this.setSource(2) },
					checkRadio: i == pl_ix && libSet.libSource != 0
				});
			}
		}

		libMenu.newMenu({ menuName: 'Refresh', appendTo: mainMenu(), separator: true });
		for (let i = 0; i < 5; i++) { libMenu.newItem({
			menuName: 'Refresh',
			str: ['Refresh selected images...', 'Refresh all images...', 'Reset zoom...', 'Refresh library...', 'Reload...'][i],
			func: () => this.setMode(i),
			flags: lib.panel.imgView && !i && this.items.Count || !lib.panel.imgView || i ? LIB_MF_STRING : LIB_MF_GRAYED,
			separator: i == 1 && lib.panel.imgView,
			hide: i < 2 && !lib.panel.imgView || i == 3 && libSet.libAutoSync
		}); }

		for (let i = 0; i < 2; i++) { libMenu.newItem({
			menuName: mainMenu(),
			str: [lib.popUpBox.ok ? 'Options...' : 'Options: see console', 'Configure...'][i],
			func: () => !i ? lib.panel.open() : window.EditScript(),
			separator: !i && this.shift,
			hide: !this.settingsBtnDn && libSet.settingsShow && this.validItem && !this.shift || i && !this.shift
		}); }
	}

	filterMenu() {
		libFMenu.newMenu({});
		for (let i = 0; i < lib.panel.filter.menu.length + 1; i++) { libFMenu.newItem({
			str: i != lib.panel.filter.menu.length ? (!i ? 'No filter' : lib.panel.filter.menu[i]) : '' /* 'Auto-manage scroll' */,
			func: () => lib.panel.set('Filter', i),
			checkItem: i == lib.panel.filter.menu.length && !libSet.reset,
			checkRadio: i == libSet.filterBy && i < lib.panel.filter.menu.length,
			separator: !i || i == lib.panel.filter.menu.length - 1 || i == lib.panel.filter.menu.length
		}); }
		libFMenu.newItem({
			str: 'Configure filters...',
			func: () => lib.panel.open('filters')
		});
	}

	searchHistoryMenu() {
		libSMenu.newMenu({});
		for (let i = 0; i < lib.search.menu.length + 2; i++) {
			libSMenu.newItem({
				str: !i ? 'Query syntax help' : i < lib.search.menu.length + 1 ? lib.search.menu[i - 1].search : 'Clear history',
				func: () => this.setSearchHistory(i),
				flags: i != 1 || lib.search.menu.length ? LIB_MF_STRING : LIB_MF_GRAYED,
				separator: !i || lib.search.menu.length && i == lib.search.menu.length
			});
		}
	}

	searchMenu() {
		libSearchMenu.newMenu({});
		['Copy', 'Cut', 'Paste'].forEach((v, i) => libSearchMenu.newItem({
			str: v,
			func: () => this.setEdit(i),
			flags: () => lib.search.start == lib.search.end && i < 2 || i == 2 && !lib.search.paste ? LIB_MF_GRAYED : LIB_MF_STRING,
			separator: i == 1
		}));
	}

	getPaylistFlag(i) {
		const pln = plman.ActivePlaylist;
		const plnIsValid = pln != -1 && pln < plman.PlaylistCount;
		const plLockAdd = plnIsValid ? plman.GetPlaylistLockedActions(pln).includes('AddItems') : false;
		const plLockRemoveOrAdd = plnIsValid ? plman.GetPlaylistLockedActions(pln).includes('RemoveItems') || plman.GetPlaylistLockedActions(pln).includes('ReplaceItems') || plLockAdd : false;
		return !i && !plLockRemoveOrAdd || i == 1 && !plLockAdd || i == 2 || i == 3 && lib.pop.nowp != -1 ? LIB_MF_STRING : LIB_MF_GRAYED
	}

	getSortData(d) {
		d.name = lib.panel.propNames[libSet.viewBy];
		d.sortAlbumsByYearAfter = ['', `[$nodisplay{$sub(${grTF.date},0#)}]%album%`, `[$nodisplay{$sub(${grTF.date},0)}]%album%[ '['$sub(${grTF.date},0)']']`, `[$nodisplay{$sub(4001,${grTF.date})}]%album%`, `[$nodisplay{$sub(4002,${grTF.date})}]%album%[ '['$sub(${grTF.date},0)']']`];
		d.sortAlbumsByYearBefore = ['', `[$nodisplay{$sub(${grTF.date},0)}]%album%`, `$sub(${grTF.date},0) - %album%`, `[$nodisplay{$sub(4003,${grTF.date})}]%album%`, `[$nodisplay{$sub(4004,${grTF.date})}]$sub(${grTF.date},0) - %album%`];
		d.sortAlbumByYear = libSet.yearBeforeAlbum ? d.sortAlbumsByYearBefore : d.sortAlbumsByYearAfter;
		d.sortIX = -1;
		d.sortType = 0;
		d.sortYear = ['', '$if2($nodisplay{$sub(%date%,0)},$nodisplay{-4000})', '$nodisplay{$sub(4000,%date%)}'];
		d.value = libSet.get(d.name) || '';
		d.valueLength = d.value.length;
		let l = d.sortYear.length;
		while (l-- && l) {
			d.value = d.value.replace(RegExp($Lib.regexEscape(d.sortYear[l]), 'g'), '');
			if (d.valueLength != d.value.length) {
				d.sortIX = l;
				d.valueLength = d.value.length;
			}
		}
		if (d.sortIX == -1) {
			l = d.sortAlbumsByYearAfter.length;
			while (l-- && l) {
				d.value = d.value.replace(RegExp($Lib.regexEscape(d.sortAlbumsByYearAfter[l]), 'g'), '%album%');
				if (d.valueLength != d.value.length) {
					d.sortIX = l;
					d.valueLength = d.value.length;
				}
			}
		}
		if (d.sortIX == -1) {
			l = d.sortAlbumsByYearBefore.length;
			while (l-- && l) {
				d.value = d.value.replace(RegExp($Lib.regexEscape(d.sortAlbumsByYearBefore[l]), 'g'), '%album%');
				if (d.valueLength != d.value.length) {
					d.sortIX = l;
					d.valueLength = d.value.length;
				}
			}
		}
		if (d.value.includes('//') && /%year%|%date%/.test(d.value)) d.sortType = 1;
		else if (d.value.includes('%album%')) d.sortType = 2;

		d.menuName = d.sortType ? 'Sort' : 'Sort N/A for selected view pattern';
	}

	loadView(clearCache, view, sel) {
		lib.ui.getColours();
		grm.theme.initLibraryColors();
		grm.theme.themeColorAdjustments();
		lib.sbar.setCol();
		lib.but.createImages();
		if (clearCache) libImg.clearCache();
		if (sel !== undefined) {
			const handle = sel >= lib.panel.list.Count ? null : lib.panel.list[sel];
			lib.panel.set('view', view, true);
			if (handle) {
				const item = lib.panel.list.Find(handle);
				let idx = -1;
				lib.pop.tree.forEach((v, i) => {
					if (lib.pop.inRange(item, v.item)) idx = i;
				});
				if (idx != -1) {
					if (!lib.panel.imgView) lib.pop.focusShow(idx);
					else lib.pop.showItem(idx, 'focus');
				}
			}
		} else lib.panel.set('view', view, true);
		lib.but.refresh(true);
	}

	playlists_changed() {
		this.pl = [];
		for (let i = 0; i < plman.PlaylistCount; i++) { this.pl.push({
			menuName: plman.GetPlaylistName(i).replace(/&/g, '&&'),
			name: plman.GetPlaylistName(i),
			ix: i
		}); }
	}

	rbtn_up(x, y, settingsBtnDn) {
		this.r_up = true;
		this.expandable = false;
		this.items = new FbMetadbHandleList();
		this.ix = lib.pop.get_ix(x, y, true, false);
		this.nm = '';
		this.settingsBtnDn = settingsBtnDn;
		this.shift = lib.vk.k('shift');
		this.show_context = false;

		let item = lib.pop.tree[this.ix];
		let row = -1;
		const level = lib.pop.tree.length > this.ix && this.ix != -1 ? !lib.pop.inlineRoot ? item.level : Math.max(item.level - 1, 0) : -1;

		this.validItem = this.settingsBtnDn ? false : !lib.panel.imgView ? y < lib.panel.tree.y + lib.pop.rows * lib.sbar.row.h + lib.ui.y && lib.pop.tree.length > this.ix && this.ix != -1 && (x < Math.round(libSet.treeIndent * level) + lib.ui.icon.w + libSet.margin + lib.ui.x && (!item.track || item.root) || lib.pop.check_ix(item, x, y, true)) : lib.pop.tree.length > this.ix && this.ix != -1;

		if (!this.validItem && !this.settingsBtnDn && libSet.settingsShow && y > lib.ui.y + lib.panel.search.sp) {
			this.ix = lib.pop.row.i != -1 ? lib.pop.row.i : !lib.panel.imgView ? lib.pop.tree.length - 1 : -1;
			if (this.ix < lib.pop.tree.length && this.ix != -1) {
				item = lib.pop.tree[this.ix];
				this.validItem = true;
			}
		}

		if (this.validItem) {
			if (!item.sel) {
				lib.pop.clearSelected();
				item.sel = true;
			}
			lib.pop.getTreeSel();
			this.expandable = !(lib.pop.trackCount(lib.pop.tree[this.ix].item) > this.treeExpandLimit || lib.pop.tree[this.ix].track || lib.panel.imgView);
			if (this.expandable && lib.pop.tree.length) {
				let count = 0;
				lib.pop.tree.forEach((v, m, arr) => {
					if (m == this.ix || v.sel) {
						if (row == -1 || m < row) {
							row = m;
							this.nm = (v.level ? arr[v.par].srt[0] : '') + v.srt[0];
							this.nm = this.nm.toUpperCase();
						}
						count += lib.pop.trackCount(v.item);
						this.expandable = count <= this.treeExpandLimit;
					}
				});
			}
			this.items = lib.pop.getHandleList();
			this.show_context = true;
		} else this.items = lib.pop.getHandleList('newItems');

		libMenu.load(x, y);
		this.r_up = false;
	}

	setActivePlaylist() {
		libSet.libSource = 0;
		libSet.fixedPlaylist = false;
		libSet.fixedPlaylistName = 'ActivePlaylist';
		if (lib.panel.imgView) libImg.clearCache();
		lib.lib.searchCache = {};
		if (libSet.showSource) lib.panel.setRootName();
		lib.lib.treeState(false, 2);
	}

	setAlbumart(i) {
		const clearCache = false;
		switch (i) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
				libSet.artId = i;
				break;
			case 5:
			case 6:
			case 7:
				libSet.albumArtGrpLevel = i - 5;
				break;
			case 8: {
				const key = `${lib.panel.grp[libSet.viewBy].type.trim()}${lib.panel.lines}`;
				const ok_callback = (status, input) => {
					if (status != 'cancel') {
						const albumArtGrpNames = $Lib.jsonParse(libSet.albumArtGrpNames, {});
						albumArtGrpNames[key] = input;
						libSet.albumArtGrpNames = JSON.stringify(albumArtGrpNames);
					}
				}
				const caption = 'Change group name';
				const def = libImg.groupField;
				const prompt = 'Enter SINGULAR name, i.e. not plural\n\nName is pinned to VIEW PATTERN and GROUP LEVEL';
				const fallback = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.input(caption, prompt, ok_callback, '', def) : true;
				if (fallback) {
					let ns = '';
					let status = 'ok';
					try {
						ns = utils.InputBox(0, prompt, caption, def, true);
					} catch (e) {
						status = 'cancel';
					}
					ok_callback(status, ns);
				}
				break;
			}
			case 9:
				lib.panel.open('albumArt');
				break;
		}
		this.loadView(clearCache, libSet.albumArtViewBy);
	}

	setEdit(i) {
		switch (i) {
			case 0:
				lib.search.on_char(lib.vk.copy);
				break;
			case 1:
				lib.search.on_char(lib.vk.cut);
				break;
			case 2:
				lib.search.on_char(lib.vk.paste, true);
				break;
		}
	}

	setFixedPlaylist(i) {
		libSet.fixedPlaylistName = this.pl[i].name;
		libSet.fixedPlaylist = true;
		libSet.libSource = 1;
		if (lib.panel.imgView) libImg.clearCache();
		if (libSet.showSource) lib.panel.setRootName();
		lib.lib.searchCache = {};
		lib.lib.treeState(false, 2);
	}

	setMode(i) {
		switch (i) {
			case 0:
				libImg.refresh(this.items);
				break;
			case 1:
				libImg.refresh('all');
				break;
			case 2:
				lib.panel.zoomReset();
				break;
			case 3:
				lib.lib.treeState(false, 2);
				break;
			case 4:
				window.Reload();
				break;
		}
	}

	setPlaylist(i) {
		switch (i) {
			// case 0: // The infamous 'Send to current playlist' func, deleting your entire playlist... >_<
			// 	lib.pop.load(lib.pop.sel_items, true, false, lib.pop.autoPlay.send, false, false);
			// 	lib.panel.treePaint();
			// 	lib.lib.treeState(false, libSet.rememberTree);
			// 	break;
			case 0:
				lib.pop.load(lib.pop.sel_items, true, true, false, false, false);
				lib.lib.treeState(false, libSet.rememberTree);
				if (grSet.addTracksPlaylistSwitch) {
					grm.button.btn.library.enabled = false;
					grm.button.btn.library.changeState(ButtonState.Default);
					grm.ui.displayLibrary = false;
					grm.ui.displayPlaylist = true;
					if (!grSet.playlistAutoScrollNowPlaying) grm.ui.setPlaylistSize();
					setTimeout(() => { pl.playlist.scrollbar.scroll_to_end(); }, 500);
					window.Repaint();
				}
				break;
			case 1:
				lib.pop.sendToNewPlaylist();
				lib.panel.treePaint();
				lib.lib.treeState(false, libSet.rememberTree);
				if (grSet.addTracksPlaylistSwitch) {
					grm.button.btn.library.enabled = false;
					grm.button.btn.library.changeState(ButtonState.Default);
					grm.ui.displayLibrary = false;
					grm.ui.displayPlaylist = true;
					setTimeout(() => { pl.playlist.scrollbar.scroll_to_end(); }, 100);
					window.Repaint();
				}
				break;
			case 2:
				lib.pop.nowPlayingShow();
				break;
			case 3: {
				lib.lib.logTree();
				lib.pop.clearTree();
				libSet.toggle('albumArtShow');
				lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow;
				this.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);

				// Need continuous repaint when using style "Blend" and switching from normal to full width
				if (grSet.styleBlend) {
					RepaintWindowRectAreas();
				}

				grm.ui.setLibrarySize();
				grm.theme.initLibraryColors();
				grm.theme.themeColorAdjustments();
				if (grSet.libraryDesign === 'traditional') lib.pop.createImages();
				window.Repaint();
				break;
			}
			case 4:
				lib.lib.logTree();
				lib.pop.clearTree();
				this.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
				break;
		}
	}

	setSearchHistory(i) {
		switch (true) {
			case !i: {
				let fn = `${fb.FoobarPath}doc\\Query Syntax Help.html`;
				if (!$Lib.file(fn)) fn = `${fb.FoobarPath}Query Syntax Help.html`;
				$Lib.browser(`"${fn}`);
				break;
			}
			case i < lib.search.menu.length + 1:
				lib.panel.search.txt = lib.search.menu[i - 1].search;
				lib.search.menu[i - 1].accessed = Date.now();
				lib.search.focus();
				lib.but.setSearchBtnsHide();
				lib.lib.search();
				break;
			case i == lib.search.menu.length + 1:
				lib.search.menu = [];
				libSet.searchHistory = JSON.stringify([]);
				break;
		}
	}

	setSource(i) {
		switch (i) {
			case 0:
				libSet.libSource = 1;
				libSet.fixedPlaylist = false;
				break;
			case 1:
				libSet.libSource = 2;
				libSet.fixedPlaylist = false;
				// if (libSet.panelSourceMsg && lib.popUpBox.isHtmlDialogSupported()) lib.popUpBox.message(); // Deactivated popup, let's not confuse the user since panel source is deactivated
				break;
			case 2: {
				const fixedPlaylistIndex = plman.FindPlaylist(libSet.fixedPlaylistName);
				if (fixedPlaylistIndex != -1) libSet.fixedPlaylist = true;
				libSet.libSource = libSet.fixedPlaylist ? 1 : 0;
				// if (libSet.panelSourceMsg && lib.popUpBox.isHtmlDialogSupported()) lib.popUpBox.message(); // Deactivated popup, let's not confuse the user since panel source is deactivated
				break;
			}
		}
		if (lib.panel.imgView) libImg.clearCache();
		lib.lib.searchCache = {};
		if (libSet.showSource) lib.panel.setRootName();
		lib.lib.treeState(false, 2);

		grSet.librarySource = libSet.libSource;
		grSet.libraryFixedPlaylist = libSet.fixedPlaylist;
		grSet.libraryFixedPlaylistName = libSet.fixedPlaylistName;
	}

	setSourcePanel() {
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				libSet.panelSelectionPlaylist = input;
			}
		}
		const caption = 'Panel source name';
		const def = libSet.panelSelectionPlaylist;
		const prompt = 'Enter source panel name\n\n• To get the name, go to the library tree panel to be used as source\n• Press shift + windows key and choose configure\n• Paste the panel name or id at the top into here\n• Name is also used for a cache playlist that remembers last open state\n• Edit source panel name if required\n• For more than one source panel, use pipe separator, e.g. Genre|Artist'
		const fallback = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.input(caption, prompt, ok_callback, '', def) : true;
		if (fallback) {
			let ns = '';
			let status = 'ok';
			try {
				ns = utils.InputBox(0, prompt, caption, def, true);
			} catch (e) {
				status = 'cancel';
			}
			ok_callback(status, ns);
		}
	}

	setStatistics(i) {
		if (i < 12) {
			const curStatisticsShown = libSet.itemShowStatistics > 0;
			libSet.itemShowStatistics = i;
			libSet.itemShowStatisticsLast = libSet.itemShowStatistics;
			lib.pop.tree.forEach(v => {
				v.id = '';
				v.count = ''; // has to reset parentheses if stats change off/on
				delete v.statistics;
				delete v._statistics;
			});
			lib.pop.cache = {
				standard: {},
				search: {},
				filter: {}
			}
			lib.pop.statisticsShow = libSet.itemShowStatistics;
			lib.pop.label = !libSet.labelStatistics || !lib.pop.statisticsShow ? '' : lib.pop.statistics[lib.pop.statisticsShow];
			const statisticsShown = libSet.itemShowStatistics > 0;
			if (lib.panel.imgView && curStatisticsShown != statisticsShown) {
				libImg.labels = { statistics: libSet.itemShowStatistics ? 1 : 0 }
				libImg.clearCache();
				lib.panel.set('view', libSet.viewBy);
			}
			lib.panel.treePaint();
		} else lib.panel.open('display');
	}

	setTreeState(i) {
		switch (i) {
			case 0:
				lib.pop.collapseAll();
				break;
			case 1:
				lib.pop.expand(this.ix, this.nm);
				lib.panel.setHeight(true);
				break;
		}
		lib.pop.checkAutoHeight();
	}

	setView(i) {
		if (i < lib.panel.menu.length) {
			if (libSet.artTreeSameView) {
				libSet.treeViewBy = i;
				libSet.albumArtViewBy = i;
			} else {
				if (!lib.panel.imgView) libSet.treeViewBy = i;
				else libSet.albumArtViewBy = i;
				if (libSet.treeViewBy != libSet.albumArtViewBy) {
					libSet.set(lib.panel.imgView ? 'Panel Library - Tree' : 'Panel Library - Tree Image', null);
					libSet.set(lib.panel.imgView ? 'Panel Library - Tree Search' : 'Panel Library - Tree Image Search', null);
				}
			}
			lib.panel.set('view', i);
		}
	}

	setViewByFolderHide(tree, indicesStr) {
		const hideAlbumYear = (name) =>
			name.replace(/^\s*[[({]?\d{4}[\])}]?\s*[-.]\s*/, '');

		const hideTrackNumber = (name) =>
			/^\d{1,2} \S/.test(name) && !/[-._]/.test(name) ? name :
			name.replace(/^\d{1,2}([-.]\d{1,2})?([-. _]+)(?=\S)/, '');

		const hideFileExtension = (name) =>
			name.replace(/\.\w+$/, '');

		const hideFuncs = [
			hideAlbumYear,
			hideTrackNumber,
			hideFileExtension
		];

		const selectedHideFuncs = indicesStr
			.split('')
			.map(index => hideFuncs[parseInt(index, 10)])
			.filter(Boolean);

		if (selectedHideFuncs.length === 0) return;

		const applyHideFuncs = (name) =>
			selectedHideFuncs.reduce((acc, hideFunction) => hideFunction(acc), name);

		const traverseAndHide = (node) => {
			if (node.nm) {
				node.nm = applyHideFuncs(node.nm);
			}
			if (node.child && node.child.length > 0) {
				node.child.forEach(traverseAndHide);
			}
		};

		tree.forEach(traverseAndHide);
	}

	sortByDate(i, d) {
		let sortByIX = -1;
		if (i > 4) {
			libSet.toggle('yearBeforeAlbum');
			d.sortAlbumByYear = libSet.yearBeforeAlbum ? d.sortAlbumsByYearBefore : d.sortAlbumsByYearAfter;
			sortByIX = d.sortIX;
		} else sortByIX = i;
		if (d.sortType == 1) {
			if (i) {
				const str = d.value.split('//');
				if (str[1]) {
					str[1] = str[1].trim().replace(/(\|\s*)(.*?(%year%|%date%))/g,  `$1${d.sortYear[i]}$2`)
					if (!/\|.*?(%year%|%date%)/.test(str[1])) str[1] = d.sortYear[i] + str[1];
					d.value = `${str[0].trim()} // ${str[1]}`;
				} else d.value = str[0];
			}
		} else if (d.sortType == 2 && i && sortByIX != -1) {
			d.value = d.value.replace(/%album%/g, d.sortAlbumByYear[sortByIX]);
		}
		if (d.sortType == 1 || sortByIX != -1) {
			const expanded = [];
			const ix = lib.pop.get_ix(!lib.panel.imgView ? 0 : libImg.panel.x + 1, (!lib.panel.imgView || libImg.style.vertical ? lib.panel.tree.y : lib.panel.tree.x) + lib.sbar.row.h / 2, true, false);
			const curName = ix != -1 ? lib.pop.tree[ix].name : '';
			const scrollPos = lib.sbar.scroll;
			const selected = [];
			lib.pop.tree.forEach((v, i) => {
				const level = !libSet.rootNode ? v.level : v.level - 1; // 1 level memory: more is less reliable
				if (!level) {
					if (v.child.length) expanded.push(i);
					if (v.sel) selected.push(i);
				}
			});
			libSet.set(d.name, d.value);
			lib.pop.clearTree();
			lib.panel.getViews();
			this.setView(libSet.viewBy);
			if (ix < lib.pop.tree.length) {
				const name = ix != -1 ? lib.pop.tree[ix].name : '';
				if (name && name == curName) {
					expanded.forEach(v => {
						if (v < lib.pop.tree.length) {
							const item = lib.pop.tree[v];
							lib.pop.branch(item, !!item.root, true);
						}
					});
					selected.forEach(v => {
						if (v < lib.pop.tree.length) {
							lib.pop.tree[v].sel = true;
						}
					});
				}
			}
			lib.sbar.checkScroll(scrollPos, 'full', true);
		}
	}
}
