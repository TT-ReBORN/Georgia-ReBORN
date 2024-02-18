'use strict';

class LibLibrary {
	constructor() {
		this.allmusic = [];
		this.checkSelection = true;
		this.exp = {};
		this.expand = [];
		this.filterQuery = '';
		this.filterQueryID = 'N/A';
		this.full_list = new FbMetadbHandleList();
		this.full_list_need_sort = false;
		this.initialised = false;
		this.libNode = [];
		this.list = new FbMetadbHandleList();
		this.noListUpd = false;
		this.none = '';
		this.node = [];
		this.prefix = libSet.prefix.split('|');
		this.root = [];
		this.scr = [];
		this.searchCache = {};
		this.searchNode = [];
		this.sel = [];
		this.time = FbProfiler();
		this.upd = 0;
		this.upd_search = false;
		this.v2_init = fb.Version.startsWith('2') && fb.IsLibraryEnabled();
		this.validSearch = true;

		libSet.autoExpandLimit = $Lib.clamp(libSet.autoExpandLimit, 10, 1000);

		this.lib_update = $Lib.debounce(() => {
			this.time.Reset();
			lib.pop.cache = {
				standard: {},
				search: {},
				filter: {}
			};
			this.searchCache = {};
			this.upd_search = !!lib.panel.search.txt;
			this.rootNodes(2, libSet.process);
			lib.pop.getTreeSel();
		}, 500);

		this.playlist_update = $Lib.debounce((playlistIndex) => {
			this.searchCache = {};
			this.treeState(false, 2);
			if (playlistIndex) lib.call.on_item_focus_change(playlistIndex);
		}, 100);

		this.search = $Lib.debounce(() => {
			this.upd_search = true;
			this.time.Reset();
			lib.pop.cache.search = {};
			this.setNodes();
			lib.panel.setHeight(true);
			if (lib.panel.search.txt.length > 2) window.NotifyOthers(window.Name, !lib.lib.list.Count ? lib.lib.list : lib.panel.list);
			else if (!lib.panel.search.txt.length) lib.pop.notifySelection();
			if (libSet.searchSend != 2) return;
			if (lib.panel.search.txt) lib.pop.load(lib.panel.list, false, false, false, true, false);
			else plman.ClearPlaylist(plman.FindOrCreatePlaylist(libSet.libPlaylist.replace(/%view_name%/i, lib.panel.viewName), false));
		}, 333);

		this.search500 = $Lib.debounce(() => {
			this.upd_search = true;
			this.time.Reset();
			lib.pop.cache.search = {};
			this.setNodes();
			lib.panel.setHeight(true);
			if (lib.panel.search.txt.length > 2) window.NotifyOthers(window.Name, !lib.lib.list.Count ? lib.lib.list : lib.panel.list);
			else if (!lib.panel.search.txt.length) lib.pop.notifySelection();
			if (libSet.searchSend != 2) return;
			lib.pop.load(lib.panel.list, false, false, false, true, false);
		}, 500);

		this.checkView();
		this.readTreeState(true);
	}

	// * METHODS * //

	added(handleList) {
		let i;
		let items;
		this.full_list.InsertRange(this.full_list.Count, handleList);
		this.full_list_need_sort = true;
		switch (true) {
			case handleList.Count < 100: {
				const lis = libSet.filterBy && !this.filterQuery.includes('$searchtext') ? $Lib.query(handleList, this.filterQuery) : handleList;
				lib.panel.sort(lis);
				this.binaryInsert(lib.panel.folderView, lis, this.list, this.libNode);
				if (this.list.Count) this.empty = '';
				if (lib.panel.search.txt) {
					let newSearchItems = new FbMetadbHandleList();
					this.validSearch = true;
					try {
						newSearchItems = fb.GetQueryItems(handleList, !this.filterQuery.includes('$searchtext') ? lib.panel.search.txt : this.filterQuery.replace(/\$searchtext/g, lib.panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					this.binaryInsert(lib.panel.folderView, newSearchItems, lib.panel.list, this.searchNode);
					if (!lib.panel.list.Count) {
						lib.pop.clearTree();
						lib.sbar.setRows(0);
						this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
						lib.panel.treePaint();
						this.noListUpd = true;
					}
				} else lib.panel.list = this.list;
				break;
			}
			default:
				if (libSet.filterBy && !this.filterQuery.includes('$searchtext')) {
					const newFilterItems = $Lib.query(handleList, this.filterQuery);
					this.list.InsertRange(this.list.Count, newFilterItems);
					lib.panel.sort(this.list);
				} else {
					if (this.full_list_need_sort) lib.panel.sort(this.full_list);
					this.list = this.full_list.Clone();
					this.full_list_need_sort = false;
				}
				lib.panel.sort(handleList);
				switch (true) {
					case !lib.panel.folderView: {
						const tfo = FbTitleFormat(lib.panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().forEach((h, j) => {
							i = this.list.Find(h);
							if (i != -1) this.format(items[j], lib.panel.splitter, i, this.libNode);
						});
						break;
					}
					default:
						items = handleList.GetLibraryRelativePaths();
						handleList.Convert().forEach((h, j) => {
							i = this.list.Find(h);
							if (i != -1) this.format(items[j], '\\', i, this.libNode);
						});
						break;
				}
				if (this.list.Count) this.empty = '';
				if (lib.panel.search.txt) {
					let newSearchItems = new FbMetadbHandleList();
					this.validSearch = true;
					try {
						newSearchItems = fb.GetQueryItems(handleList, !this.filterQuery.includes('$searchtext') ? lib.panel.search.txt : this.filterQuery.replace(/\$searchtext/g, lib.panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					lib.panel.list.InsertRange(lib.panel.list.Count, newSearchItems);
					lib.panel.sort(lib.panel.list);
					lib.panel.sort(newSearchItems);
					switch (true) {
						case !lib.panel.folderView: {
							const tfo = FbTitleFormat(lib.panel.view);
							items = tfo.EvalWithMetadbs(newSearchItems);
							newSearchItems.Convert().forEach((h, j) => {
								i = lib.panel.list.Find(h);
								if (i != -1) this.format(items[j], lib.panel.splitter, i, this.searchNode);
							});
							break;
						}
						default:
							items = newSearchItems.GetLibraryRelativePaths();
							newSearchItems.Convert().forEach((h, j) => {
								i = lib.panel.list.Find(h);
								if (i != -1) this.format(items[j], '\\', i, this.searchNode);
							});
							break;
					}
					if (!lib.panel.list.Count) {
						lib.pop.clearTree();
						lib.sbar.setRows(0);
						this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
						lib.panel.treePaint();
						this.noListUpd = true;
					}
				} else lib.panel.list = this.list;
				break;
		}
	}

	addedFilter(handleList) {
		let i;
		let items;
		switch (true) {
			case handleList.Count < 100:
				this.binaryInsert(lib.panel.folderView, handleList, this.list, this.libNode);
				break;
			default:
				this.list.InsertRange(this.list.Count, handleList);
				lib.panel.sort(this.list);
				lib.panel.sort(handleList);
				switch (true) {
					case !lib.panel.folderView: {
						const tfo = FbTitleFormat(lib.panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().forEach((h, j) => {
							i = this.list.Find(h);
							if (i != -1) this.format(items[j], lib.panel.splitter, i, this.libNode);
						});
						if (!this.list.Count) this.none = 'Nothing found';
						break;
					}
					default:
						items = handleList.GetLibraryRelativePaths();
						handleList.Convert().forEach((h, j) => {
							i = this.list.Find(h);
							if (i != -1) this.format(items[j], '\\', i, this.libNode);
						});
						if (!this.list.Count) this.none = 'Nothing found';
						break;
				}
		}
	}

	addedSearch(handleList) {
		let i;
		let items;
		switch (true) {
			case handleList.Count < 100:
				this.binaryInsert(lib.panel.folderView, handleList, lib.panel.list, this.searchNode);
				break;
			default:
				lib.panel.list.InsertRange(lib.panel.list.Count, handleList);
				lib.panel.sort(lib.panel.list);
				switch (true) {
					case !lib.panel.folderView: {
						const tfo = FbTitleFormat(lib.panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().forEach((h, j) => {
							i = lib.panel.list.Find(h);
							if (i != -1) this.format(items[j], lib.panel.splitter, i, this.searchNode);
						});
						break;
					}
					default:
						items = handleList.GetLibraryRelativePaths();
						handleList.Convert().forEach((h, j) => {
							i = lib.panel.list.Find(h);
							if (i != -1) this.format(items[j], '\\', i, this.searchNode);
						});
						break;
				}
		}
	}

	bInsert(item, li) {
		let min = 0;
		let max = li.Count;
		let index = Math.floor((min + max) / 2);
		while (max > min) {
			const tmp = new FbMetadbHandleList([item, li[index]]);
			lib.panel.sort(tmp);
			if (item.Compare(tmp[0])) max = index;
			else min = index + 1;
			index = Math.floor((min + max) / 2);
		}
		return index;
	}

	binaryInsert(folder, insert, li, n) {
		let i;
		let items;
		switch (true) {
			case !folder: {
				const tfo = FbTitleFormat(lib.panel.view);
				items = tfo.EvalWithMetadbs(insert);
				insert.Convert().forEach((h, j) => {
					i = this.bInsert(h, li);
					this.format(items[j], lib.panel.splitter, i, n);
					li.Insert(i, h);
				});
				break;
			}
			case folder:
				items = insert.GetLibraryRelativePaths();
				insert.Convert().forEach((h, j) => {
					i = this.bInsert(h, li);
					this.format(items[j], '\\', i, n);
					li.Insert(i, h);
				});
				break;
		}
	}

	checkAutoExpand() {
		if (lib.panel.imgView) return;
		if (!libSet.treeAutoExpand || lib.panel.list.Count >= libSet.autoExpandLimit || !lib.pop.tree.length) return false;
		let m = lib.pop.tree.length;
		const rootNode = libSet.rootNode;
		const n = !!(rootNode && lib.pop.tree.length > 1);
		lib.pop.expandedTracks = 0;
		lib.pop.expandLmt = libSet.autoExpandLimit;
		while (m--) {
			lib.pop.expandNodes(lib.pop.tree[m], !(!rootNode || m));
			if (n && m == 1) break;
		}
		lib.sbar.setRows(lib.pop.tree.length);
		lib.panel.treePaint();
		return true;
	}

	checkFilter() {
		lib.pop.cache.filter = {};
		lib.pop.cache.search = {};
		this.searchCache = {};
		if (lib.panel.filter.mode[libSet.filterBy].type.match(/\$nowplaying{(.+?)}/)) {
			this.getFilterQuery();
			if (this.filterQuery != this.filterQueryID) {
				if (!libSet.rememberTree && !libSet.reset) this.logTree();
				else if (libSet.rememberTree) this.logFilter();
				if (lib.panel.search.txt) lib.lib.upd_search = true;
				this.getLibrary();
				this.rootNodes(!libSet.reset ? 1 : 0, true);
				if (!lib.pop.notifySelection())  {
					const list = !lib.panel.search.txt.length || !lib.lib.list.Count ? lib.lib.list : lib.panel.list;
					window.NotifyOthers(window.Name, libSet.filterBy ? list : new FbMetadbHandleList());
				}
				if (libSet.searchSend == 2 && lib.panel.search.txt.length) lib.pop.load(lib.panel.list, false, false, false, true, false);
				lib.pop.checkAutoHeight();
			}
		}
		if (lib.panel.filter.mode[libSet.filterBy].type.match(/\$selected{(.+?)}/)) {
			this.getFilterQuery();
			if (this.filterQuery != this.filterQueryID) {
				if (!libSet.rememberTree && !libSet.reset) this.logTree();
				else if (libSet.rememberTree) this.logFilter();
				if (lib.panel.search.txt) lib.lib.upd_search = true;
				this.getLibrary();
				this.rootNodes(!libSet.reset ? 1 : 0, true);
				if (!lib.pop.notifySelection())  {
					const list = !lib.panel.search.txt.length || !lib.lib.list.Count ? lib.lib.list : lib.panel.list;
					window.NotifyOthers(window.Name, libSet.filterBy ? list : new FbMetadbHandleList());
				}
				if (libSet.searchSend == 2 && lib.panel.search.txt.length) lib.pop.load(lib.panel.list, false, false, false, true, false);
				lib.pop.checkAutoHeight();
			}
		}
	}

	checkLines(arr, arrExpanded) {
		if (libSet.albumArtGrpLevel) return; // user set
		const defaultView = !lib.panel.folderView ? lib.panel.defaultViews.indexOf(lib.panel.grp[libSet.viewBy].type.trim()) : 6;
		if (defaultView != -1) {
			lib.panel.lines = [
				[2, 2, 2, 2, 2, 2, 2, 2][libSet.artId],
				[2, 2, 2, 2, 2, 2, 2, 2][libSet.artId], 1, 1, 1, 2, 2, 2, 2, 2
			][defaultView];
			return;
		}
		const lengths = arr.map(v => v.length);
		const avg = $Lib.average(lengths);
		if (avg < (!arrExpanded ? 3 : 2)) lib.panel.lines = 1;
	}

	checkStatistics(handleList) {
		lib.pop.tree.forEach(v => {
			delete v.statistics;
			delete v._statistics;
		});
		lib.panel.sort(this.full_list);
		handleList.Convert().forEach(h => {
			const i = this.full_list.Find(h);
			if (i != -1) {
				['standard', 'search', 'filter'].forEach(w => {
					const keys = Object.keys(lib.pop.cache[w]);
					let j = keys.length
					while (j--) if (lib.pop.cache[w][keys[j]] && lib.pop.cache[w][keys[j]].items.includes(i)) delete lib.pop.cache[w][keys[j]];
				});
			}
		});
		lib.panel.treePaint();
	}

	checkTree() {
		if (!this.upd) return;
		this.lib_update.cancel();
		this.time.Reset();
		lib.pop.cache = {
			standard: {},
			search: {},
			filter: {}
		};
		this.searchCache = {};
		this.upd_search = !!lib.panel.search.txt;
		this.rootNodes(this.upd == 2 ? 2 : 1, libSet.process);
		if (this.checkSelection) {
			lib.call.setSelection(libSet.followPlaylistFocus && !libSet.libSource ? fb.GetFocusItem() : lib.panel.setSelection() ? fb.GetSelection() : null);
			this.checkSelection = false;
		}
		this.upd = 0;
	}

	checkView() {
		const startIX = libSet.rememberView ? lib.panel.grp.length : 0;
		for (let i = startIX; i < 100; i++) {
			libSet.set(`Panel Library - Tree.View ${$Lib.padNumber(i, 2) + (!lib.panel.imgView ? '' : ' Image')}`, null); // clear non-existent
			libSet.set(`Panel Library - Tree.View ${$Lib.padNumber(i, 2) + (!lib.panel.imgView ? ' Search' : ' Image Search')}`, null); // clear non-existent
		}
		if (libSet.rememberTree) {
			this.exp = libSet.get(this.rememberViewProp(), JSON.stringify({}));
			this.exp = $Lib.jsonParse(this.exp, {});
		} else libSet.set(!lib.panel.imgView ? `Panel Library - Tree${lib.panel.search.txt ? ' Search' : ''}` : `Panel Library - Tree Image${lib.panel.search.txt ? ' Search' : ''}`, null);
	}

	expandArr(arr) {
		arr.forEach((v, i) => {
			arr[i][0] = `${arr[i][0]}^@^${arr[i][1] || '?'}`;
			arr[i].splice(1, 1);
		});
	}

	eval(n, type) {
		let handle;
		let tfo;
		switch (type) {
			case 'nowplaying':
				if (!n || !fb.IsPlaying) return '';
				tfo = FbTitleFormat(n);
				if (fb.IsPlaying && fb.PlaybackLength <= 0) return tfo.Eval();
				handle = fb.GetNowPlaying();
				return handle ? tfo.EvalWithMetadb(handle) : '';
			case 'selected':
				if (!n) return '';
				tfo = FbTitleFormat(n);
				if (fb.IsPlaying && fb.PlaybackLength <= 0) return tfo.Eval();
				handle = fb.GetFocusItem();
				return handle ? tfo.EvalWithMetadb(handle) : '';
		}
	}

	flattenArr(arr) {
		arr.forEach((v, i) => {
			arr[i][0] = arr[i][0].split('^@^');
			arr[i] = arr[i].flat();
		});
	}

	format(item, splitter, i, node) {
		item = item.split(splitter);
		if (lib.panel.imgView && lib.panel.lines == 2) {
			item[0] = `${item[0]}^@^${item[1] || '?'}`;
			item.splice(1, 1);
		}
		node.splice(i, 0, item);
	}

	getFilterQuery() {
		this.filterQuery = lib.panel.filter.mode[libSet.filterBy].type;
		while (this.filterQuery.includes('$nowplaying{')) {
			const q = this.filterQuery.match(/\$nowplaying{(.+?)}/);
			this.filterQuery = this.filterQuery.replace(q[0], this.eval(q[1], 'nowplaying') || '~#No Value For Item#~');
		}
		while (this.filterQuery.includes('$selected{')) {
			const q = this.filterQuery.match(/\$selected{(.+?)}/);
			this.filterQuery = this.filterQuery.replace(q[0], this.eval(q[1], 'selected') || '~#No Value For Item#~');
		}
	}

	getLibrary(items) {
		this.empty = '';
		this.time.Reset();
		this.none = '';
		let fixedPlaylistIndex = -1;
		if (libSet.fixedPlaylist) {
			fixedPlaylistIndex = plman.FindPlaylist(libSet.fixedPlaylistName);
			if (fixedPlaylistIndex == -1) {
				libSet.fixedPlaylist = false;
				libSet.libSource = 0;
			}
		}
		if (!items) {
			this.list = [plman.GetPlaylistItems($Lib.pl_active), !libSet.fixedPlaylist ? fb.GetLibraryItems() : plman.GetPlaylistItems(fixedPlaylistIndex), plman.GetPlaylistItems(plman.FindPlaylist(libSet.lastPanelSelectionPlaylist))][libSet.libSource];
			if (libSet.recItemImage && libSet.libSource == 2) lib.ui.expandHandle = this.list.Count ? this.list[0] : null;
			if (libSet.libSource != 2) this.full_list = this.list.Clone();
		}
		if (libSet.libSource && (!this.list.Count || !fb.IsLibraryEnabled() && libSet.libSource == 1)) {
			lib.pop.clearTree();
			lib.sbar.setRows(0);
			this.empty = libSet.libSource == 1 ? (!libSet.fixedPlaylist ? (!this.list.Count && this.v2_init ? 'Loading...\n\n' : 'Nothing to show\nClick here to configure the media library') : 'Nothing found\n\n') : 'Nothing received';
			lib.panel.treePaint();
			return;
		}

		lib.pop.libItems = true;
		lib.panel.forcePaint();
		if (libSet.filterBy) {
			this.getFilterQuery();
			this.filterQueryID = this.filterQuery;
			if (!this.filterQuery.includes('$searchtext')) this.list = $Lib.query(this.list, this.filterQuery);
		} else {
			this.filterQuery = '';
			this.filterQueryID = 'N/A';
		}
		if (!this.list.Count) {
			lib.pop.clearTree();
			lib.sbar.setRows(0);
			this.none = 'Nothing found';
			lib.panel.treePaint();
			return;
		}
		this.rootNames('', 0, libSet.libSource == 2 ? false : items);
	}

	getSearchList(n) {
		if (this.filterQuery.includes('$searchtext')) return false;
		const queryArr = [' AFTER ', 'ALL', ' AND ', ' BEFORE ', ' DURING ', ' EQUAL ', ' GREATER ', ' HAS ', ' IS ', ' LESS ', ' MISSING', ' NOT ', ' OR ', ' PRESENT', ' SINCE '];
		if (queryArr.some(v => n.includes(v))) return false;
		const ln = n.length;
		for (let i = 0; i < ln; i++) {
			if (!n) return false;
			if (this.searchCache[n]) return this.searchCache[n];
			else n = n.slice(0, -1);
		}
		return false;
	}

	initialise(handleList) {
		lib.lib.initialised = true;
		this.load(handleList);
		this.getLibrary(true);
		this.rootNodes(libSet.rememberTree, libSet.process);
	}

	isMainChanged(handleList) {
		let i;
		let items;
		const tree_type = !lib.panel.folderView ? 0 : 1;
			switch (tree_type) { // check for changes to items; any change updates all
				case 0: {
					const tfo = FbTitleFormat(lib.panel.view);
					items = tfo.EvalWithMetadbs(handleList);
					const ret = handleList.Convert().some((h, j) => {
						i = this.list.Find(h);
						if (i != -1) {
							let libItem = [];
							if (!lib.panel.imgView || lib.panel.lines != 2) libItem = this.libNode[i];
							else {
								libItem = this.libNode[i].slice();
								libItem[0] = libItem[0].split('^@^');
								libItem = libItem.flat();
							}
							return !$Lib.equal(libItem, items[j].split(lib.panel.splitter));
						}
					});
					if (ret) return true;
					if (libSet.itemShowStatistics < 2) return false;
					this.checkStatistics(handleList);
					break;
				}

			case 1: {
				items = handleList.GetLibraryRelativePaths();
				const ret = handleList.Convert().some((h, j) => {
					i = this.list.Find(h);
					if (i != -1) {
						let libItem = [];
						if (!lib.panel.imgView || lib.panel.lines != 2) libItem = this.libNode[i];
						else {
							libItem = this.libNode[i].slice();
							libItem[0] = libItem[0].split('^@^');
							libItem = libItem.flat();
						}
						return !$Lib.equal(libItem, items[j].split('\\'));
					}
				});
				if (ret) return true;
				if (libSet.itemShowStatistics < 2) return false;
				this.checkStatistics(handleList);
				break;
			}
		}
	}

	load(handleList) {
		let fixedPlaylistIndex = -1;
		if (libSet.fixedPlaylist) {
			fixedPlaylistIndex = plman.FindPlaylist(libSet.fixedPlaylistName);
			if (fixedPlaylistIndex == -1) {
				libSet.fixedPlaylist = false;
				libSet.libSource = 0;
			}
		}
		this.list = [plman.GetPlaylistItems($Lib.pl_active), !libSet.fixedPlaylist ? (handleList || fb.GetLibraryItems()) : plman.GetPlaylistItems(fixedPlaylistIndex), plman.GetPlaylistItems(plman.FindPlaylist(libSet.lastPanelSelectionPlaylist))][libSet.libSource];
		if (libSet.recItemImage && libSet.libSource == 2) lib.ui.expandHandle = this.list.Count ? this.list[0] : null;
		this.full_list = this.list.Clone();
		if (this.list.Count) this.v2_init = false;

		if (libSet.libSource && (!this.list.Count || !fb.IsLibraryEnabled() && libSet.libSource == 1)) {
			this.empty = libSet.libSource == 1 ? (!libSet.fixedPlaylist ? (!this.list.Count && this.v2_init ? 'Loading...\n\n' : 'Nothing to show\nClick here to configure the media library') : 'Nothing found\n\n') : 'Nothing received';
			lib.panel.treePaint();
		}
	}

	logFilter() {
		libSet.process = true;
		const key = !libSet.rememberView ? 'def' : lib.panel.viewName;
		if (!$Lib.objHasOwnProperty(this.exp, key)) this.exp[key] = {};
		this.exp[key].filter = lib.panel.filter.menu[libSet.filterBy];
		libSet.set(this.rememberViewProp(), JSON.stringify(this.exp));
	}

	logTree() {
		if (!lib.pop.tree.length) return;
		let i = 0;
		let ix = -1;
		let level = 0;
		this.expand = [];
		libSet.process = true;
		this.sel = [];
		lib.pop.tree.forEach(v => {
			level = !libSet.rootNode ? v.level : v.level - 1;
			if (v.child.length) {
				this.expand.push({
					level,
					a: level < 1 ? v.root || v.srt[0] : lib.pop.tree[v.par].root || lib.pop.tree[v.par].srt[0],
					b: level < 1 ? '' : v.srt[0]
				});
			}
			level = v.level;
			if (v.sel == true) {
				this.sel.push({
					level,
					a: v.root || v.srt[0],
					b: level != 0 ? lib.pop.tree[v.par].root || lib.pop.tree[v.par].srt[0] : '',
					c: level > 1 ? lib.pop.tree[lib.pop.tree[v.par].par].root || lib.pop.tree[lib.pop.tree[v.par].par].srt[0] : ''
				});
			}
		});
		ix = lib.pop.get_ix((!lib.panel.imgView ? 0 : libImg.panel.x + 1) + lib.ui.x, (!lib.panel.imgView || libImg.style.vertical ? lib.panel.tree.y : lib.panel.tree.x) + lib.sbar.row.h / 2 + lib.ui.y, true, false);
		level = 0;
		const l = Math.min(Math.floor(ix + lib.panel.rows), lib.pop.tree.length);
		if (ix != -1) {
			this.scr = [];
			for (i = ix; i < l; i++) {
				level = lib.pop.tree[i].level;
				this.scr.push({
					level,
					a: lib.pop.tree[i].root || lib.pop.tree[i].srt[0],
					b: level != 0 ? lib.pop.tree[lib.pop.tree[i].par].root || lib.pop.tree[lib.pop.tree[i].par].srt[0] : '',
					c: level > 1 ? lib.pop.tree[lib.pop.tree[lib.pop.tree[i].par].par].root || lib.pop.tree[lib.pop.tree[lib.pop.tree[i].par].par].srt[0] : ''
				});
			}
		}
		this.sortByLevel(this.expand);
		if (libSet.rememberTree) {
			const key = !libSet.rememberView ? 'def' : lib.panel.viewName;
			const cur_sel = this.exp[key] ? this.exp[key].sel : [];
			this.exp[key] = {
				exp: this.expand,
				filter: lib.panel.filter.menu[libSet.filterBy],
				scr: this.scr,
				sel: this.sel.length ? this.sel : cur_sel,
				s_txt: lib.panel.search.txt
			};
			libSet.set(this.rememberViewProp(), JSON.stringify(this.exp));
		}
	}

	match(a, b) {
		if (!a) return false;
		const c = a.root || a.srt[0];
		return c.toUpperCase() == b.toUpperCase();
	}

	prefixes(n) {
		if (!n.includes('~#!#')) return n;
		let ln = 0;
		const noPrefix = v => !n.includes(`${v} `);
		if (this.prefix.every(noPrefix)) return n.replace(/~~#!#/g, '#!#').replace(/~#!#/g, '#!#');
		const pr1 = n.split('~~#!#');
		let ret1 = '';
		for (let j = 1; j < pr1.length; j++) {
			const pr2 = pr1[j].split('#!#');
			const pr = pr2[0].split('@@');
			pr.forEach((v, i) => {
				this.prefix.forEach(w => {
					ln = w.length + 1;
					if (v.substr(0, ln) == `${w} `) pr[i] = v.slice(ln);
				});
			});
			pr2.shift();
			ret1 += `#!#${pr.join('@@')}#!#${pr2.join('#!#')}`;
		}
		ret1 = pr1[0] + ret1;
		const pr3 = ret1.split('~#!#');
		let ret2 = '';
		for (let j = 1; j < pr3.length; j++) {
			const pr2 = pr3[j].split('#!#');
			const pr = pr2[0].split('@@');
			pr.forEach((v, i) => {
				this.prefix.forEach(w => {
					ln = w.length + 1;
					if (v.substr(0, ln) == `${w} `) pr[i] = `${v.substr(ln)}, ${w}`;
				});
			});
			pr2.shift();
			ret2 += `#!#${pr.join('@@')}#!#${pr2.join('#!#')}`;
		}
		return pr3.length > 1 ? pr3[0] + ret2 : ret1;
	}

	readTreeState(bypass, treeArtToggle) {
		if (libSet.rememberTree) {
			const key = !libSet.rememberView ? 'def' : lib.panel.viewName;
			if (this.exp[key]) {
				this.expand = this.exp[key].exp || [];
				if (!treeArtToggle) {
					let tmpFilter = this.exp[key].filter || 'N/A';
					tmpFilter = lib.panel.filter.menu.indexOf(tmpFilter);
					libSet.filterBy = tmpFilter != -1 ? tmpFilter : 0;
				}
				this.scr = this.exp[key].scr || [];
				this.sel = this.exp[key].sel || [];
				if (!treeArtToggle) lib.panel.search.txt = this.exp[key].s_txt || '';
				lib.panel.calcText();
				if (!bypass) lib.but.setSearchBtnsHide();
				window.Repaint();
			} else {
				this.exp = {};
				libSet.rememberView ? libSet.set(this.rememberViewProp(), null) : libSet.set(!lib.panel.imgView ? `Panel Library - Tree${lib.panel.search.txt ? ' Search' : ''}` : `Panel Library - Tree Image${lib.panel.search.txt ? ' Search' : ''}`, JSON.stringify(this.exp));
			}
		} else libSet.process = false;
	}

	rememberViewProp() {
		let isValidProp;
		let prop;
		let property;
		switch (libSet.rememberView) {
			case true:
				property = `Panel Library - Tree.View ${$Lib.padNumber(libSet.viewBy, 2) + (!lib.panel.imgView ? '' : ' Image')} Search`;
				if (lib.panel.search.txt) return property;
				prop = libSet.get(property);
				isValidProp = prop && prop.includes('exp');
				if (isValidProp) return property;
				return `Panel Library - Tree.View ${$Lib.padNumber(libSet.viewBy, 2) + (!lib.panel.imgView ? '' : ' Image')}`;
			case false:
				property = !lib.panel.imgView ? 'Panel Library - Tree Search' : 'Panel Library - Tree Image Search';
				if (lib.panel.search.txt) return property;
				prop = libSet.get(property);
				isValidProp = prop && prop.includes('exp');
				if (isValidProp) return property;
				return !lib.panel.imgView ? 'Panel Library - Tree' : 'Panel Library - Tree Image';
		}
	}

	removed(handleList) {
		let i; let j = handleList.Count;
		while (j--) {
			i = this.list.Find(handleList[j]);
			if (i != -1) {
				this.list.RemoveById(i);
				this.libNode.splice(i, 1);
			}
		}
		if (libSet.filterBy) {
			j = handleList.Count;
			if (this.full_list_need_sort) lib.panel.sort(this.full_list);
			this.full_list_need_sort = false;
			while (j--) {
				i = this.full_list.Find(handleList[j]);
				if (i != -1) this.full_list.RemoveById(i);
			}
		} else this.full_list = this.list.Clone();
		if (lib.panel.search.txt) {
			j = handleList.Count;
			while (j--) {
				i = lib.panel.list.Find(handleList[j]);
				if (i != -1) {
					lib.panel.list.RemoveById(i);
					this.searchNode.splice(i, 1);
				}
			}
			if (!lib.panel.list.Count) {
				lib.pop.clearTree();
				lib.sbar.setRows(0);
				this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
				lib.panel.treePaint();
				this.noListUpd = true;
			}
		} else lib.panel.list = this.list;

		if (libSet.libSource && !this.full_list.Count) {
			this.empty = libSet.libSource == 1 ? (!libSet.fixedPlaylist ? 'Nothing to show\nClick here to configure the media library' : 'Nothing found\n\n') : 'Nothing received';
		}
	}

	removedFilter(handleList) {
		let j = handleList.Count;
		while (j--) {
			const i = this.list.Find(handleList[j]);
			if (i != -1) {
				this.list.RemoveById(i);
				this.libNode.splice(i, 1);
			}
		}
	}

	removedSearch(handleList) {
		let j = handleList.Count;
		while (j--) {
			const i = lib.panel.list.Find(handleList[j]);
			if (i != -1) {
				lib.panel.list.RemoveById(i);
				this.searchNode.splice(i, 1);
			}
		}
	}

	rootNames(li, search, treeArtToggle) {
		const tree_type = !lib.panel.folderView ? 0 : 1;
		let arr = [];
		if (!treeArtToggle || !lib.panel.samePattern) {
			switch (search) {
				case 0:
					if (libSet.libSource || lib.panel.multiProcess) lib.panel.sort(this.list);
					li = lib.panel.list = this.list;
					this.libNode = [];
					arr = this.libNode;
					break;
				case 1:
					this.searchNode = [];
					arr = this.searchNode;
					break;
			}
		}

		if (!treeArtToggle || !lib.panel.samePattern) {
			switch (tree_type) {
				case 0: {
					const tfo = FbTitleFormat(lib.panel.view);
					tfo.EvalWithMetadbs(li).forEach((v, i) => arr[i] = v.split(lib.panel.splitter));
					break;
				}
				case 1:
					li.GetLibraryRelativePaths().forEach((v, i) => arr[i] = v.length ? v.split('\\') : ['File(s) Not In Library']);
					break;
			}
			if (lib.panel.imgView && lib.panel.lines == 2) this.checkLines(arr);
			if (lib.panel.imgView && lib.panel.lines == 2) this.expandArr(arr);
		} else {
			arr = !search ? this.libNode : this.searchNode;
			const arrExpanded = arr.length && arr[0][0].includes('^@^');
			if (lib.panel.imgView && lib.panel.lines == 2) this.checkLines(arr, arrExpanded);
			if (lib.panel.imgView) {
				if (lib.panel.lines == 2) {
					if (!arrExpanded) this.expandArr(arr);
				} else if (lib.panel.lines == 1) {
					if (arrExpanded) this.flattenArr(arr);
				}
			} else if (arrExpanded) this.flattenArr(arr);
		}
	}

	rootNodes(lib_update, process) {
		if (!this.list.Count) return;
		this.root = [];
		let i = 0;
		let n = '';
		if (lib.panel.search.txt && (this.upd_search || lib_update === true)) {
			this.validSearch = true;
			this.none = '';
			try {
				lib.panel.list = fb.GetQueryItems(this.getSearchList(lib.panel.search.txt) || this.list, !this.filterQuery.includes('$searchtext') ? lib.panel.search.txt : this.filterQuery.replace(/\$searchtext/g, lib.panel.search.txt));
				this.searchCache[lib.panel.search.txt] = lib.panel.list;
			} catch (e) {
				this.list = this.list.Clone();
				lib.panel.list.RemoveAll();
				this.validSearch = false;
			}
			if (!lib.panel.list.Count) {
				lib.pop.clearTree();
				lib.sbar.setRows(0);
				this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
				lib.panel.treePaint();
				return;
			}
			this.rootNames(lib.panel.list, 1);
			this.node = this.searchNode;
			this.upd_search = false;
		} else if (!lib.panel.search.txt) {
			lib.panel.list = this.list;
			this.node = this.libNode;
			this.searchNode = [];
			this.searchCache = {};
		}
		let end = 0;
		let n_o = '#get_node#';
		let nU = '';
		let start = 0;
		const total = lib.panel.list.Count;
		lib.pop.getNowplaying();
		if (libSet.rootNode) {
			this.root[0] = {
				root: 'Root Node',
				nm: lib.panel.rootName,
				sel: false,
				child: [],
				item: this.set(start, total - 1),
				srt: this.sort(lib.panel.rootName)
			};
		}
		else {
			this.node.forEach((v, l) => {
				n = v[0];
				nU = n.toUpperCase();
				if (nU != n_o) {
					n_o = nU;
					if (i > 0) this.root[i - 1].item = this.set(start, end);
					start = l;
					if (lib.panel.multiPrefix) n = this.prefixes(n);
					this.root[i] = {
						nm: n,
						sel: false,
						child: [],
						srt: this.sort(n)
					};
					end = start;
					i++;
				} else end = l;
			});
			if (i > 0) this.root[i - 1].item = this.set(start, end);
		}
		if (!lib_update) lib.sbar.reset();
		/* Draw tree -> */
		if (!libSet.rootNode || lib.panel.search.txt) lib.pop.buildTree(this.root, 0);
		if (libSet.rootNode) lib.pop.branch(this.root[0], true);
		if (lib.panel.pn_h_auto && !lib.panel.imgView && (lib.panel.init || lib_update) && libSet.pn_h == libSet.pn_h_min && lib.pop.tree[0]) lib.pop.clearChild(lib.pop.tree[0]);
		lib.panel.init = false; // $Lib.trace('initialised in: ' + this.time.Time / 1000 + ' seconds');

		if (lib_update !== 2) this.checkAutoExpand();
		if (lib_update && process) {
			if (!lib.panel.imgView) {
				this.expand.forEach(v => {
					if (v.level == 0) {
						lib.pop.tree.some(w => {
							if (this.match(w, v.a)) {
								lib.pop.branch(w);
								return true;
							}
						});
					} else if (v.level > 0) {
						lib.pop.tree.some(w => {
							if (this.match(w, v.b) && this.match(lib.pop.tree[w.par], v.a)) {
								lib.pop.branch(w);
								return true;
							}
						});
					}
				});
			}
			this.sel.forEach(v => {
				if (v.level == 0) {
					lib.pop.tree.some(w => {
						if (this.match(w, v.a)) return w.sel = true;
					});
				} else if (v.level == 1) {
					lib.pop.tree.some(w => {
						if (this.match(w, v.a) && this.match(lib.pop.tree[w.par], v.b)) return w.sel = true;
					});
				} else if (v.level > 1) {
					lib.pop.tree.some(w => {
						if (this.match(w, v.a) && this.match(lib.pop.tree[w.par], v.b) && this.match(lib.pop.tree[lib.pop.tree[w.par].par], v.c)) return w.sel = true;
					});
				}
			});
			let scr_pos = false;
			this.scr.some((v, h) => {
				if (scr_pos) return true;
				if (v.level == 0) {
					lib.pop.tree.some((w, j) => {
						if (this.match(w, v.a)) {
							lib.sbar.scrollMemory(h, j);
							return scr_pos = true;
						}
					});
				} else if (v.level == 1) {
					lib.pop.tree.some((w, j) => {
						if (this.match(w, v.a) && this.match(lib.pop.tree[w.par], v.b)) {
							lib.sbar.scrollMemory(h, j);
							return scr_pos = true;
						}
					});
				} else if (v.level > 1) {
					lib.pop.tree.some((w, j) => {
						if (this.match(w, v.a) && this.match(lib.pop.tree[w.par], v.b) && this.match(lib.pop.tree[lib.pop.tree[w.par].par], v.c)) {
							lib.sbar.scrollMemory(h, j);
							return scr_pos = true;
						}
					});
				}
			});
			if (!scr_pos) {
				lib.sbar.reset();
				lib.panel.treePaint();
			}
		} else this.treeState(false, libSet.rememberTree);
		if (lib.panel.imgView && total) libImg.load();
		if (lib_update && !process) {
			lib.sbar.reset();
			lib.panel.treePaint();
		}
	}

	set(start, end) {
		return [{
			start,
			end,
			count: end - start + 1
		}];
	}

	setMemory(i) {
		const o = ['rememberTree', 'rememberView'][i];
		libSet[o] = libSet[o] ? 0 : 1;
		this.checkView();
		this.logTree();
	}

	setNodes() {
		if (lib.panel.search.txt == '' && libSet.rememberPreSearch) {
			libSet.set(this.rememberViewProp(), JSON.stringify({}));
			this.checkView();
			this.logFilter();
			this.readTreeState(true);
			this.rootNodes(libSet.rememberTree, libSet.process);
			this.treeState(false, libSet.rememberTree);
		} else {
			this.treeState(false, libSet.rememberTree);
			this.rootNodes();
		}
	}

	sort(name) {
		if (lib.panel.multiProcess) name = name.replace(/#!#/g, '');
		if (lib.panel.noDisplay) name = name.replace(/#@#/g, '');
		if (lib.panel.colMarker) name = name.replace(/@!#.*?@!#/g, '');
		if (lib.panel.imgView) name = name.replace(/\^@\^/g, '  ');
		return [name, name, name, false];
	}

	sortByLevel(data) {
		data.sort((a, b) => parseFloat(a.level) - parseFloat(b.level));
		return data;
	}

	treeState(reset, state, handleList, handleType) {
		if (!state) return;
		lib.panel.searchPaint();
		lib.panel.treePaint();
		libSet.process = false;
		if (!reset) this.logTree();
		if (libSet.rememberTree && state === true) return;
		if (handleType == 3) {
			this.getLibrary(true);
			this.rootNodes(true, true);
		} else if (!handleList) {
			this.getLibrary();
			this.rootNodes(true, true);
		} else this.updateLibrary(handleList, handleType);
	}

	updateLibrary(handleList, handleType) {
		if (!this.initialised || this.list.Count != this.libNode.length) return;
		this.noListUpd = false;
		switch (handleType) {
			case 0: {
				const origList = this.list.Clone();
				origList.Sort();
				handleList.Sort();
				handleList.MakeDifference(origList);
				if (handleList.Count) this.added(handleList);
				if (this.noListUpd) break;
				if (lib.ui.w < 1 || !window.IsVisible) this.upd = 2;
				else this.lib_update();
				break;
			}
			case 1: {
				// check for changes to items; any change updates all
				const isMainChanged = this.isMainChanged(handleList);
				if (isMainChanged) {
					this.removed(handleList);
					this.added(handleList);
					if (lib.ui.w < 1 || !window.IsVisible) this.upd = 2;
					else this.lib_update(isMainChanged);
					break;
				}
				if (libSet.filterBy && !this.filterQuery.includes('$searchtext')) { // filter: check if not done
					const newFilterItems = $Lib.query(handleList, this.filterQuery);
					const origFilter = this.list.Clone();
					// addns
					origFilter.Sort();
					newFilterItems.Sort();
					newFilterItems.MakeDifference(origFilter);
					if (newFilterItems.Count) this.addedFilter(newFilterItems);
					// removals
					const removeFilterItems = handleList.Clone();
					removeFilterItems.Sort();
					removeFilterItems.MakeIntersection(origFilter); // handles in this.list
					const handlesInFilter = $Lib.query(removeFilterItems, this.filterQuery); // handles in this.list & filter
					handlesInFilter.Sort();
					removeFilterItems.MakeDifference(handlesInFilter); // handles to remove
					if (removeFilterItems.Count) this.removedFilter(removeFilterItems);
					if (newFilterItems.Count || removeFilterItems.Count) {
						if (!lib.panel.search.txt) lib.panel.list = this.list;
						if (lib.ui.w < 1 || !window.IsVisible) this.upd = 2;
						else this.lib_update();
					}
				}
				if (lib.panel.search.txt) { // search: check if not done
					let handlesInSearch = new FbMetadbHandleList();
					let newSearchItems = new FbMetadbHandleList();
					const origSearch = lib.panel.list.Clone();
					// addns
					this.validSearch = true;
					try {
						newSearchItems = fb.GetQueryItems(handleList, !this.filterQuery.includes('$searchtext') ? lib.panel.search.txt : this.filterQuery.replace(/\$searchtext/g, lib.panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					origSearch.Sort();
					newSearchItems.Sort();
					if (libSet.filterBy) {
						const newFilt = this.list.Clone();
						newFilt.Sort();
						newSearchItems.MakeIntersection(newFilt);
					}
					newSearchItems.MakeDifference(origSearch);
					if (newSearchItems.Count) this.addedSearch(newSearchItems);
					// removals
					const removeSearchItems = handleList.Clone();
					removeSearchItems.Sort();
					removeSearchItems.MakeIntersection(origSearch); // handles in origSearch (present in any filter)
					this.validSearch = true;
					try {
						handlesInSearch = fb.GetQueryItems(removeSearchItems, !this.filterQuery.includes('$searchtext') ? lib.panel.search.txt : this.filterQuery.replace(/\$searchtext/g, lib.panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					handlesInSearch.Sort();
					removeSearchItems.MakeDifference(handlesInSearch); // handles to remove
					if (removeSearchItems.Count) this.removedSearch(removeSearchItems);
					if (newSearchItems.Count || removeSearchItems.Count) {
						if (!lib.panel.list.Count) {
							lib.pop.clearTree();
							lib.sbar.setRows(0);
							this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
							lib.panel.treePaint();
							break;
						}
						if (lib.ui.w < 1 || !window.IsVisible) this.upd = 2;
						else this.lib_update();
					}
				}
				break;
			}
			case 2:
				this.removed(handleList);
				if (this.noListUpd) break;
				if (lib.ui.w < 1 || !window.IsVisible) this.upd = 2;
				else this.lib_update();
				break;
		}
	}
}
