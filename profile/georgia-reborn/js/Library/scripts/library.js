class Library {
	constructor() {
		let fixedPlaylistIndex = -1;

		if (ppt.fixedPlaylist) {
			fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
			if (fixedPlaylistIndex == -1) {
				ppt.fixedPlaylist = false;
				ppt.libSource = 0;
			}
		}

		this.allmusic = [];
		this.checkSelection = true;
		this.exp = {};
		this.expand = [];
		this.filterQuery = '';
		this.filterQueryID = 'N/A';
		this.full_list_need_sort = false;
		this.init = false;
		this.libNode = [];
		this.list = [plman.GetPlaylistItems($Lib.pl_active), !ppt.fixedPlaylist ? fb.GetLibraryItems() : plman.GetPlaylistItems(fixedPlaylistIndex), plman.GetPlaylistItems(plman.FindPlaylist('Library Tree Panel Selection'))][ppt.libSource];
		this.full_list = this.list.Clone();
		this.noListUpd = false;
		this.none = '';
		this.node = [];
		this.prefix = ppt.prefix.split('|');
		this.root = [];
		this.scr = [];
		this.searchCache = {};
		this.searchNode = [];
		this.sel = [];
		this.time = FbProfiler();
		this.upd = 0;
		this.upd_search = false;
		this.validSearch = true;

		ppt.autoExpandLimit = $Lib.clamp(ppt.autoExpandLimit, 10, 1000);

		this.lib_update = $Lib.debounce(() => {
			this.time.Reset();
			pop.subCounts = {
				'standard': {},
				'search': {},
				'filter': {}
			};
			this.searchCache = {};
			this.upd_search = !panel.search.txt ? false : true;
			this.rootNodes(2, ppt.process);
			pop.getTreeSel();
		}, 500);

		this.playlist_update = $Lib.debounce((playlistIndex) => {
			this.searchCache = {};
			this.treeState(false, 2);
			if (playlistIndex) on_item_focus_change(playlistIndex);
		}, 100);

		this.search = $Lib.debounce(() => {
			this.upd_search = true;
			this.time.Reset();
			pop.subCounts.search = {};
			this.treeState(false, ppt.rememberTree);
			this.rootNodes();
			panel.setHeight(true);
			if (ppt.searchSend != 2) return;
			if (panel.search.txt) pop.load(panel.list, false, false, false, true, false);
			else plman.ClearPlaylist(plman.FindOrCreatePlaylist(ppt.libPlaylist.replace(/%view_name%/i, panel.viewName), false));
		}, 333);

		this.search500 = $Lib.debounce(() => {
			this.upd_search = true;
			this.time.Reset();
			pop.subCounts.search = {};
			this.treeState(false, ppt.rememberTree);
			this.rootNodes();
			panel.setHeight(true);
			if (ppt.searchSend != 2) return;
			pop.load(panel.list, false, false, false, true, false);
		}, 500);

		this.checkView();
		this.readTreeState(true);
	}

	// Methods

	added(handleList) {
		let i, items;
		switch (true) {
			case handleList.Count < 100: {
				let lis = ppt.filterBy && !this.filterQuery.includes('$searchtext') ? $Lib.query(handleList, this.filterQuery) : handleList;
				panel.sort(lis);
				this.binaryInsert(panel.folderView, lis, this.list, this.libNode);
				if (this.list.Count) this.empty = '';
				if (panel.search.txt) {
					let newSearchItems = new FbMetadbHandleList();
					this.validSearch = true;
					try {
						newSearchItems = fb.GetQueryItems(handleList, !this.filterQuery.includes('$searchtext') ? panel.search.txt : this.filterQuery.replace(/\$searchtext/g, panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					this.binaryInsert(panel.folderView, newSearchItems, panel.list, this.searchNode);
					if (!panel.list.Count) {
						pop.clearTree();
						sbar.setRows(0);
						this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
						panel.treePaint();
						this.noListUpd = true;
					}
				} else panel.list = this.list;
				break;
			}
			default:
				this.full_list.InsertRange(this.full_list.Count, handleList);
				this.full_list_need_sort = true;
				if (ppt.filterBy && !this.filterQuery.includes('$searchtext')) {
					const newFilterItems = $Lib.query(handleList, this.filterQuery);
					this.list.InsertRange(this.list.Count, newFilterItems);
					panel.sort(this.list);
				} else {
					if (this.full_list_need_sort) panel.sort(this.full_list);
					this.list = this.full_list.Clone();
					this.full_list_need_sort = false;
				}
				panel.sort(handleList);
				switch (true) {
					case !panel.folderView: {
						const tfo = FbTitleFormat(panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().forEach((h, j) => {
							i = this.list.Find(h);
							if (i != -1) this.format(items[j], panel.splitter, i, this.libNode);
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
				if (panel.search.txt) {
					let newSearchItems = new FbMetadbHandleList();
					this.validSearch = true;
					try {
						newSearchItems = fb.GetQueryItems(handleList, !this.filterQuery.includes('$searchtext') ? panel.search.txt : this.filterQuery.replace(/\$searchtext/g, panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					panel.list.InsertRange(panel.list.Count, newSearchItems);
					panel.sort(panel.list);
					panel.sort(newSearchItems);
					switch (true) {
						case !panel.folderView: {
							const tfo = FbTitleFormat(panel.view);
							items = tfo.EvalWithMetadbs(newSearchItems);
							newSearchItems.Convert().forEach((h, j) => {
								i = panel.list.Find(h);
								if (i != -1) this.format(items[j], panel.splitter, i, this.searchNode);
							});
							break;
						}
						default:
							items = newSearchItems.GetLibraryRelativePaths();
							newSearchItems.Convert().forEach((h, j) => {
								i = panel.list.Find(h);
								if (i != -1) this.format(items[j], '\\', i, this.searchNode);
							});
							break;
					}
					if (!panel.list.Count) {
						pop.clearTree();
						sbar.setRows(0);
						this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
						panel.treePaint();
						this.noListUpd = true;
					}
				} else panel.list = this.list;
				break;
		}
	}

	addedFilter(handleList) {
		let i, items;
		switch (true) {
			case handleList.Count < 100:
				this.binaryInsert(panel.folderView, handleList, this.list, this.libNode);
				break;
			default:
				this.list.InsertRange(this.list.Count, handleList);
				panel.sort(this.list);
				panel.sort(handleList);
				switch (true) {
					case !panel.folderView: {
						const tfo = FbTitleFormat(panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().forEach((h, j) => {
							i = this.list.Find(h);
							if (i != -1) this.format(items[j], panel.splitter, i, this.libNode);
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
		let i, items;
		switch (true) {
			case handleList.Count < 100:
				this.binaryInsert(panel.folderView, handleList, panel.list, this.searchNode);
				break;
			default:
				panel.list.InsertRange(panel.list.Count, handleList);
				panel.sort(panel.list);
				switch (true) {
					case !panel.folderView: {
						const tfo = FbTitleFormat(panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().forEach((h, j) => {
							i = panel.list.Find(h);
							if (i != -1) this.format(items[j], panel.splitter, i, this.searchNode);
						});
						break;
					}
					default:
						items = handleList.GetLibraryRelativePaths();
						handleList.Convert().forEach((h, j) => {
							i = panel.list.Find(h);
							if (i != -1) this.format(items[j], '\\', i, this.searchNode);
						});
						break;
				}
		}
	}

	bInsert(item) {
		let min = 0;
		let max = panel.list.Count;
		let index = Math.floor((min + max) / 2);
		while (max > min) {
			let tmp = new FbMetadbHandleList([item, panel.list[index]]);
			panel.sort(tmp);
			if (item.Compare(tmp[0])) max = index;
			else min = index + 1;
			index = Math.floor((min + max) / 2);
		}
		return index;
	}

	binaryInsert(folder, insert, li, n) {
		let i, items;
		switch (true) {
			case !folder: {
				const tfo = FbTitleFormat(panel.view);
				items = tfo.EvalWithMetadbs(insert);
				insert.Convert().forEach((h, j) => {
					i = this.bInsert(h);
					this.format(items[j], panel.splitter, i, n);
					li.Insert(i, h);
				});
				break;
			}
			case folder:
				items = insert.GetLibraryRelativePaths();
				insert.Convert().forEach((h, j) => {
					i = this.bInsert(h);
					this.format(items[j], '\\', i, n);
					li.Insert(i, h);
				});
				break;
		}
	}

	checkAutoExpand() {
		if (panel.imgView) return;
		if (!ppt.treeAutoExpand || panel.list.Count >= ppt.autoExpandLimit || !pop.tree.length) return false;
		let m = pop.tree.length;
		let rootNode = ppt.rootNode;
		const n = rootNode && pop.tree.length > 1 ? true : false;
		pop.expandedTracks = 0;
		pop.expandLmt = ppt.autoExpandLimit;
		while (m--) {
			pop.expandNodes(pop.tree[m], !rootNode || m ? false : true);
			if (n && m == 1) break;
		}
		sbar.setRows(pop.tree.length);
		panel.treePaint();
		return true;
	}

	checkFilter() {
		pop.subCounts.filter = {};
		pop.subCounts.search = {};
		this.searchCache = {};
		if (panel.filter.mode[ppt.filterBy].type.match(/\$nowplaying{(.+?)}/)) {
			this.getFilterQuery();
			if (this.filterQuery != this.filterQueryID) {
				if (!ppt.rememberTree && !ppt.reset) this.logTree();
				else if (ppt.rememberTree) this.logFilter();
				if (panel.search.txt) lib.upd_search = true;
				this.getLibrary();
				this.rootNodes(!ppt.reset ? 1 : 0, true);
				if (ppt.searchSend == 2 && panel.search.txt.length) pop.load(panel.list, false, false, false, true, false);
				pop.checkAutoHeight();
			}
		}
	}

	checkLines(arr, arrExpanded) {
		if (ppt.albumArtGrpLevel) return; // user set
		const defaultView = !panel.folderView ? panel.defaultViews.indexOf(panel.grp[ppt.viewBy].type.trim()) : 6;
		if (defaultView != -1) {
			panel.lines = [
				[2, 2, 2, 1, 1][ppt.artId],
				[2, 2, 2, 1, 1][ppt.artId], 1, 1, 1, 1, 1
			][defaultView];
			return;
		}
		const lengths = arr.map(v => v.length);
		const avg = $Lib.average(lengths);
		if (avg < (!arrExpanded ? 3 : 2)) panel.lines = 1;
	}

	checkTree() {
		if (!this.upd && !(this.init && ppt.rememberTree)) return;
		this.init = false;
		this.lib_update.cancel();
		this.time.Reset();
		pop.subCounts = {
			'standard': {},
			'search': {},
			'filter': {}
		};
		this.searchCache = {};
		this.upd_search = !panel.search.txt ? false : true;
		this.rootNodes(this.upd == 2 ? 2 : 1, ppt.process);
		if (panel.imgView && this.checkSelection) {
			setSelection(ppt.followPlaylistFocus && !ppt.libSource ? fb.GetFocusItem() : img.setSelection() ? fb.GetSelection() : null);
			this.checkSelection = false;
		}
		this.upd = 0;
	}
	rememberViewProp() {
		return `Tree.View ${$Lib.padNumber(ppt.viewBy, 2) + (!panel.imgView ? '' : ' Image')}`
	}

	checkView() {
		const startIX = ppt.rememberView ? panel.grp.length : 0
		for (let i = startIX; i < 100; i++) ppt.set(`Tree.View ${$Lib.padNumber(i, 2) + (!panel.imgView ? '' : ' Image')}`, null); // clear non-existent
		if (ppt.rememberTree) {
			this.exp = ppt.rememberView ? ppt.get(this.rememberViewProp(), JSON.stringify({})) : ppt.get(!panel.imgView ? 'Tree' : 'Tree Image', JSON.stringify({}))
			this.exp = $Lib.jsonParse(this.exp, {});
		} else ppt.set(!panel.imgView ? 'Tree' : 'Tree Image', null);
	}

	expandArr(arr) {
		arr.forEach((v, i) => {
			arr[i][0] = arr[i][0] + '^@^' + (arr[i][1] || '?');
			arr[i].splice(1, 1);
		});
	}

	eval(n) {
		if (!n || !fb.IsPlaying) return '';
		const tfo = FbTitleFormat(n);
		if (fb.IsPlaying && fb.PlaybackLength <= 0) return tfo.Eval();
		const handle = fb.GetNowPlaying();
		return handle ? tfo.EvalWithMetadb(handle) : '';
	}

	flattenArr(arr) {
		arr.forEach((v, i) => {
			arr[i][0] = arr[i][0].split('^@^');
			arr[i] = arr[i].flat();
		});
	}

	format(item, splitter, i, node) {
		item = item.split(splitter);
		if (panel.imgView && panel.lines == 2) {
			item[0] = item[0] + '^@^' + (item[1] || '?');
			item.splice(1, 1);
		}
		node.splice(i, 0, item);
	}

	getFilterQuery() {
		this.filterQuery = panel.filter.mode[ppt.filterBy].type;
		while (this.filterQuery.includes('$nowplaying{')) {
			const q = this.filterQuery.match(/\$nowplaying{(.+?)}/);
			this.filterQuery = this.filterQuery.replace(q[0], this.eval(q[1]));
		}
	}

	getLibrary(items) {
		this.empty = '';
		this.time.Reset();
		this.none = '';
		let fixedPlaylistIndex = -1;
		if (ppt.fixedPlaylist) {
			fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
			if (fixedPlaylistIndex == -1) {
				ppt.fixedPlaylist = false;
				ppt.libSource = 0;
			}
		}
		if (!items) {
			this.list = [plman.GetPlaylistItems($Lib.pl_active), !ppt.fixedPlaylist ? fb.GetLibraryItems() : plman.GetPlaylistItems(fixedPlaylistIndex), plman.GetPlaylistItems(plman.FindPlaylist('Library Tree Panel Selection'))][ppt.libSource];
			if (ppt.libSource != 2) this.full_list = this.list.Clone();
		}
		if (ppt.libSource && (!this.list.Count || !fb.IsLibraryEnabled())) {
			pop.clearTree();
			sbar.setRows(0);
			this.empty = ppt.libSource == 1 ? (!ppt.fixedPlaylist ? 'Nothing to show\n\nClick here to configure the media library' : 'Nothing found\n\n') : 'Panel Mode\nNo items received\n';
			panel.treePaint();
			return;
		}
		pop.libItems = true;
		panel.forcePaint();
		if (ppt.filterBy) {
			this.getFilterQuery();
			this.filterQueryID = this.filterQuery;
			if (!this.filterQuery.includes('$searchtext')) this.list = $Lib.query(this.list, this.filterQuery);
		} else {
			this.filterQuery = '';
			this.filterQueryID = 'N/A';
		}
		if (!this.list.Count) {
			pop.clearTree();
			sbar.setRows(0);
			this.none = 'Nothing found';
			panel.treePaint();
			return;
		}
		this.rootNames('', 0, ppt.libSource == 2 ? false : items);
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

	logFilter() {
		ppt.process = true;
		const key = !ppt.rememberView ? 'def' : panel.viewName;
		if (!$Lib.objHasOwnProperty(this.exp, key)) this.exp[key] = {};
		this.exp[key].filter = panel.filter.menu[ppt.filterBy];
		ppt.rememberView ? ppt.set(this.rememberViewProp(), JSON.stringify(this.exp)) : ppt.set(!panel.imgView ? 'Tree' : 'Tree Image', JSON.stringify(this.exp));
	}

	logTree() {
		if (!pop.tree.length) return;
		let i = 0;
		let ix = -1;
		let tr = 0;
		this.expand = [];
		ppt.process = true;
		this.sel = [];
		pop.tree.forEach(v => {
			tr = !ppt.rootNode ? v.tr : v.tr - 1;
			if (v.child.length) this.expand.push({
				tr: tr,
				a: tr < 1 ? v.root || v.srt[0] : pop.tree[v.par].root || pop.tree[v.par].srt[0],
				b: tr < 1 ? '' : v.srt[0]
			});
			tr = v.tr;
			if (v.sel == true) this.sel.push({
				tr: tr,
				a: v.root || v.srt[0],
				b: tr != 0 ? pop.tree[v.par].root || pop.tree[v.par].srt[0] : '',
				c: tr > 1 ? pop.tree[pop.tree[v.par].par].root || pop.tree[pop.tree[v.par].par].srt[0] : ''
			});
		});
		ix = pop.get_ix((!panel.imgView ? 0 : img.panel.x + 1) + ui.x, (!panel.imgView || img.style.vertical ? panel.tree.y : panel.tree.x) + sbar.row.h / 2 + ui.y, true, false);
		tr = 0;
		let l = Math.min(Math.floor(ix + panel.rows), pop.tree.length);
		if (ix != -1) {
			this.scr = [];
			for (i = ix; i < l; i++) {
				tr = pop.tree[i].tr;
				this.scr.push({
					tr: tr,
					a: pop.tree[i].root || pop.tree[i].srt[0],
					b: tr != 0 ? pop.tree[pop.tree[i].par].root || pop.tree[pop.tree[i].par].srt[0] : '',
					c: tr > 1 ? pop.tree[pop.tree[pop.tree[i].par].par].root || pop.tree[pop.tree[pop.tree[i].par].par].srt[0] : ''
				})
			}
		}
		this.sortByLevel(this.expand);
		if (ppt.rememberTree) {
			const key = !ppt.rememberView ? 'def' : panel.viewName;
			this.exp[key] = {
				exp: this.expand,
				filter: panel.filter.menu[ppt.filterBy],
				scr: this.scr,
				sel: this.sel,
				s_txt: panel.search.txt
			}
			ppt.rememberView ? ppt.set(this.rememberViewProp(), JSON.stringify(this.exp)) : ppt.set(!panel.imgView ? 'Tree' : 'Tree Image', JSON.stringify(this.exp));
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
		const noPrefix = v => !n.includes(v + ' ');
		if (this.prefix.every(noPrefix)) return n.replace(/~~#!#/g, '#!#').replace(/~#!#/g, '#!#');
		let pr1 = n.split('~~#!#');
		let ret1 = '';
		for (let j = 1; j < pr1.length; j++) {
			const pr2 = pr1[j].split('#!#');
			const pr = pr2[0].split('@@');
			pr.forEach((v, i) => {
				this.prefix.forEach(w => {
					ln = w.length + 1;
					if (v.substr(0, ln) == w + ' ') pr[i] = v.slice(ln);
				});
			});
			pr2.shift();
			ret1 += '#!#' + pr.join('@@') + '#!#' + pr2.join('#!#');
		}
		ret1 = pr1[0] + ret1;
		let pr3 = ret1.split('~#!#');
		let ret2 = '';
		for (let j = 1; j < pr3.length; j++) {
			const pr2 = pr3[j].split('#!#');
			const pr = pr2[0].split('@@');
			pr.forEach((v, i) => {
				this.prefix.forEach(w => {
					ln = w.length + 1;
					if (v.substr(0, ln) == w + ' ') pr[i] = v.substr(ln) + ', ' + w;
				});
			});
			pr2.shift();
			ret2 += '#!#' + pr.join('@@') + '#!#' + pr2.join('#!#');
		}
		return pr3.length > 1 ? pr3[0] + ret2 : ret1;
	}

	readTreeState(bypass, treeArtToggle) {
		if (ppt.rememberTree) {
			const key = !ppt.rememberView ? 'def' : panel.viewName;
			if (this.exp[key]) {
				this.expand = this.exp[key].exp || [];
				if (!treeArtToggle) {
					let tmpFilter = this.exp[key].filter || 'N/A';
					tmpFilter = panel.filter.menu.indexOf(tmpFilter);
					ppt.filterBy = tmpFilter != -1 ? tmpFilter : 0;
				}
				this.scr = this.exp[key].scr || [];
				this.sel = this.exp[key].sel || [];
				if (!treeArtToggle) panel.search.txt = this.exp[key].s_txt || '';
				panel.calcText();
				if (!bypass) but.setSearchBtnsHide();
				window.Repaint();
			} else {
				this.exp = {};
				ppt.rememberView ? ppt.set(this.rememberViewProp(), null) : ppt.set(!panel.imgView ? 'Tree' : 'Tree Image', JSON.stringify(this.exp));
			}
		} else ppt.process = false;
	}

	removed(handleList) {
		let i, j = handleList.Count;
		while (j--) {
			i = this.list.Find(handleList[j]);
			if (i != -1) {
				this.list.RemoveById(i);
				this.libNode.splice(i, 1);
			}
		}
		if (ppt.filterBy) {
			j = handleList.Count;
			if (this.full_list_need_sort) panel.sort(this.full_list);
			this.full_list_need_sort = false;
			while (j--) {
				i = this.full_list.Find(handleList[j]);
				if (i != -1) this.full_list.RemoveById(i);
			}
		} else this.full_list = this.list.Clone();
		if (panel.search.txt) {
			j = handleList.Count;
			while (j--) {
				i = panel.list.Find(handleList[j]);
				if (i != -1) {
					panel.list.RemoveById(i);
					this.searchNode.splice(i, 1);
				}
			}
			if (!panel.list.Count) {
				pop.clearTree();
				sbar.setRows(0);
				this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
				panel.treePaint();
				this.noListUpd = true;
			}
		} else panel.list = this.list;

		if (ppt.libSource && !this.full_list.Count) {
			this.empty = ppt.libSource == 1 ? (!ppt.fixedPlaylist ? 'Nothing to show\n\nClick here to configure the media library' : 'Nothing found\n\n') : 'Panel Mode\nNo items received\n';
			this.root = [];
			pop.clearTree();
			sbar.setRows(0);
			panel.treePaint();
			this.noListUpd = true;
		}
	}

	removedFilter(handleList) {
		let j = handleList.Count;
		while (j--) {
			let i = this.list.Find(handleList[j]);
			if (i != -1) {
				this.list.RemoveById(i);
				this.libNode.splice(i, 1);
			}
		}
	}

	removedSearch(handleList) {
		let j = handleList.Count;
		while (j--) {
			let i = panel.list.Find(handleList[j]);
			if (i != -1) {
				panel.list.RemoveById(i);
				this.searchNode.splice(i, 1);
			}
		}
	}

	rootNames(li, search, treeArtToggle) {
		const tree_type = !panel.folderView ? 0 : 1;
		let arr = [];
		if (!treeArtToggle || !panel.samePattern) switch (search) {
			case 0:
				if (ppt.libSource || panel.multiProcess) panel.sort(this.list);
				li = panel.list = this.list;
				this.libNode = [];
				arr = this.libNode;
				break;
			case 1:
				this.searchNode = [];
				arr = this.searchNode;
				break;
		}

		if (!treeArtToggle || !panel.samePattern) {
			switch (tree_type) {
				case 0: {
					let tfo = FbTitleFormat(panel.view);
					tfo.EvalWithMetadbs(li).forEach((v, i) => arr[i] = v.split(panel.splitter));
					break;
				}
				case 1:
					li.GetLibraryRelativePaths().forEach((v, i) => arr[i] = v.length ? v.split('\\') : ['File(s) Not In Library']);
					break;
			}
			if (panel.imgView && panel.lines == 2) this.checkLines(arr);
			if (panel.imgView && panel.lines == 2) this.expandArr(arr);
		} else {
			arr = !search ? this.libNode : this.searchNode;
			const arrExpanded = arr.length && arr[0][0].includes('^@^');
			if (panel.imgView && panel.lines == 2) this.checkLines(arr, arrExpanded);
			if (panel.imgView) {
				if (panel.lines == 2) {
					if (!arrExpanded) this.expandArr(arr);
				} else if (panel.lines == 1) {
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
		if (panel.search.txt && (this.upd_search || lib_update === true)) {
			this.validSearch = true;
			this.none = '';
			try {
				panel.list = fb.GetQueryItems(this.getSearchList(panel.search.txt) || this.list, !this.filterQuery.includes('$searchtext') ? panel.search.txt : this.filterQuery.replace(/\$searchtext/g, panel.search.txt));
				this.searchCache[panel.search.txt] = panel.list;
			} catch (e) {
				this.list = this.list.Clone();
				panel.list.RemoveAll();
				this.validSearch = false;
			}
			if (!panel.list.Count) {
				pop.clearTree();
				sbar.setRows(0);
				this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
				panel.treePaint();
				return;
			}
			this.rootNames(panel.list, 1);
			this.node = this.searchNode;
			this.upd_search = false;
		} else if (!panel.search.txt) {
			panel.list = this.list;
			this.node = this.libNode;
			this.searchNode = [];
			this.searchCache = {};
		}
		let end = 0;
		let n_o = '#get_node#';
		let nU = '';
		let start = 0;
		let total = panel.list.Count;
		pop.getNowplaying();
		if (ppt.rootNode) this.root[0] = {
			root: 'Root Node',
			nm: panel.rootName,
			sel: false,
			child: [],
			item: this.set(start, total - 1),
			srt: this.sort(panel.rootName)
		};
		else {
			this.node.forEach((v, l) => {
				n = v[0];
				nU = n.toUpperCase();
				if (nU != n_o) {
					n_o = nU;
					if (i > 0) this.root[i - 1].item = this.set(start, end);
					start = l;
					if (panel.multiPrefix) n = this.prefixes(n);
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
		if (!lib_update) sbar.reset();
		/* Draw tree -> */
		if (!ppt.rootNode || panel.search.txt) pop.buildTree(this.root, 0);
		if (ppt.rootNode) pop.branch(this.root[0], true);
		if (panel.pn_h_auto && !panel.imgView && (panel.init || lib_update) && ppt.pn_h == ppt.pn_h_min && pop.tree[0]) pop.clearChild(pop.tree[0]);
		panel.init = false;
		// $Lib.trace('initialised in: ' + this.time.Time / 1000 + ' seconds');

		if (lib_update !== 2) this.checkAutoExpand();
		if (lib_update && process) {
			if (!panel.imgView) {
				this.expand.forEach(v => {
					if (v.tr == 0) {
						pop.tree.some(w => {
							if (this.match(w, v.a)) {
								pop.branch(w);
								return true;
							}
						});
					} else if (v.tr > 0) {
						pop.tree.some(w => {
							if (this.match(w, v.b) && this.match(pop.tree[w.par], v.a)) {
								pop.branch(w);
								return true;
							}
						});
					}
				});
			}
			this.sel.forEach(v => {
				if (v.tr == 0) {
					pop.tree.some(w => {
						if (this.match(w, v.a)) return w.sel = true;
					});
				} else if (v.tr == 1) {
					pop.tree.some(w => {
						if (this.match(w, v.a) && this.match(pop.tree[w.par], v.b)) return w.sel = true;
					});
				} else if (v.tr > 1) {
					pop.tree.some(w => {
						if (this.match(w, v.a) && this.match(pop.tree[w.par], v.b) && this.match(pop.tree[pop.tree[w.par].par], v.c)) return w.sel = true;
					});
				}
			});
			let scr_pos = false;
			this.scr.some((v, h) => {
				if (scr_pos) return true;
				if (v.tr == 0) {
					pop.tree.some((w, j) => {
						if (this.match(w, v.a)) {
							sbar.scrollMemory(h, j);
							return scr_pos = true;
						}
					});
				} else if (v.tr == 1) {
					pop.tree.some((w, j) => {
						if (this.match(w, v.a) && this.match(pop.tree[w.par], v.b)) {
							sbar.scrollMemory(h, j);
							return scr_pos = true;
						}
					});
				} else if (v.tr > 1) {
					pop.tree.some((w, j) => {
						if (this.match(w, v.a) && this.match(pop.tree[w.par], v.b) && this.match(pop.tree[pop.tree[w.par].par], v.c)) {
							sbar.scrollMemory(h, j);
							return scr_pos = true;
						}
					});
				}
			});
			if (!scr_pos) {
				sbar.reset();
				panel.treePaint();
			}
		} else this.treeState(false, ppt.rememberTree);
		if (panel.imgView) img.load();
		if (lib_update && !process) {
			sbar.reset();
			panel.treePaint();
		}
	}

	set(start, end) {
		return [{
			start: start,
			end: end,
			count: end - start + 1
		}];
	}

	setAutoExpandLimit() {
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				if (!input || input == ppt.autoExpandLimit) return false;
				ppt.autoExpandLimit = Math.round(input);
				if (isNaN(ppt.autoExpandLimit)) ppt.autoExpandLimit = 350;
				ppt.autoExpandLimit = $Lib.clamp(ppt.autoExpandLimit, 10, 1000);
				pop.collapseAll();
				this.rootNodes(ppt.rememberTree, ppt.process);
			}
		}
		popUpBox.input('Auto Expand Limit', 'Enter number 10-1000', ok_callback, '', ppt.autoExpandLimit);
	}

	setMemory(i) {
		const o = ['rememberTree', 'rememberView'][i];
		ppt[o] = ppt[o] ? 0 : 1;
		this.checkView();
		this.logTree();
	}

	sort(name) {
		if (panel.multiProcess) name = name.replace(/#!#/g, '');
		if (panel.noDisplay) name = name.replace(/#@#/g, '');
		if (panel.colMarker) name = name.replace(/@!#.*?@!#/g, '');
		if (panel.imgView) name = name.replace(/\^@\^/g, '  ');
		return [name, name, name, false];
	}

	sortByLevel(data) {
		data.sort((a, b) => parseFloat(a.tr) - parseFloat(b.tr));
		return data;
	}

	treeState(reset, state, handleList, handleType) {
		if (!state) return;
		panel.searchPaint();
		panel.treePaint();
		ppt.process = false;
		if (!reset) this.logTree();
		if (ppt.rememberTree && state === true) return;
		if (handleType == 3) {
			this.getLibrary(true);
			this.rootNodes(true, true);
		} else if (!handleList) {
			this.getLibrary();
			this.rootNodes(true, true );
		} else this.updateLibrary(handleList, handleType)
	}

	updateLibrary(handleList, handleType) {
		this.noListUpd = false;
		switch (handleType) {
			case 0:
				this.added(handleList);
				if (this.noListUpd) break;
				if (ui.w < 1 || !window.IsVisible) this.upd = 2;
				else this.lib_update();
				break;
			case 1: {
				let i, items, upd_done = false;
				let tree_type = !panel.folderView ? 0 : 1;
				switch (tree_type) { // check for changes to items; any change updates all
					case 0: {
						let tfo = FbTitleFormat(panel.view);
						items = tfo.EvalWithMetadbs(handleList);
						handleList.Convert().some((h, j) => {
							i = this.list.Find(h);
							if (i != -1) {
								let libItem = '';
								if (!panel.imgView || panel.lines != 2) libItem = this.libNode[i];
								else {
									libItem = this.libNode[i].slice();
									libItem[0] = libItem[0].split('^@^');
									libItem = libItem.flat();
								}
								if (!$Lib.equal(libItem, items[j].split(panel.splitter))) {
									this.removed(handleList);
									this.added(handleList);
									if (ui.w < 1 || !window.IsVisible) this.upd = 2;
									else this.lib_update();
									return upd_done = true;
								}
							}
						});
						break;
					}
					case 1:
						items = handleList.GetLibraryRelativePaths();
						handleList.Convert().some((h, j) => {
							i = this.list.Find(h);
							if (i != -1) {
								let libItem = '';
								if (!panel.imgView || panel.lines != 2) libItem = this.libNode[i];
								else {
									libItem = this.libNode[i].slice();
									libItem[0] = libItem[0].split('^@^');
									libItem = libItem.flat();
								}
								if (!$Lib.equal(libItem, items[j].split('\\'))) {
									this.removed(handleList);
									this.added(handleList);
									if (ui.w < 1 || !window.IsVisible) this.upd = 2;
									else this.lib_update();
									return upd_done = true;
								}
							}
						});
						break;
				}
				if (upd_done) break;
				if (ppt.filterBy && !this.filterQuery.includes('$searchtext')) { // filter: check if not done
					let newFilterItems = $Lib.query(handleList, this.filterQuery);
					let origFilter = this.list.Clone();
					// addns
					origFilter.Sort();
					newFilterItems.Sort();
					newFilterItems.MakeDifference(origFilter);
					if (newFilterItems.Count) this.addedFilter(newFilterItems);
					// removals
					let removeFilterItems = handleList.Clone();
					removeFilterItems.Sort();
					removeFilterItems.MakeIntersection(origFilter); // handles in this.list
					let handlesInFilter = $Lib.query(removeFilterItems, this.filterQuery); // handles in this.list & filter
					handlesInFilter.Sort();
					removeFilterItems.MakeDifference(handlesInFilter); // handles to remove
					if (removeFilterItems.Count) this.removedFilter(removeFilterItems);
					if (newFilterItems.Count || removeFilterItems.Count) {
						if (!panel.search.txt) panel.list = this.list;
						if (ui.w < 1 || !window.IsVisible) this.upd = 2;
						else this.lib_update();
					}
				}
				if (panel.search.txt) { // search: check if not done
					let handlesInSearch = new FbMetadbHandleList();
					let newSearchItems = new FbMetadbHandleList();
					let origSearch = panel.list.Clone();
					// addns
					this.validSearch = true;
					try {
						newSearchItems = fb.GetQueryItems(handleList, !this.filterQuery.includes('$searchtext') ? panel.search.txt : this.filterQuery.replace(/\$searchtext/g, panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					origSearch.Sort();
					newSearchItems.Sort();
					if (ppt.filterBy) {
						let newFilt = this.list.Clone();
						newFilt.Sort();
						newSearchItems.MakeIntersection(newFilt);
					}
					newSearchItems.MakeDifference(origSearch);
					if (newSearchItems.Count) this.addedSearch(newSearchItems);
					// removals
					let removeSearchItems = handleList.Clone();
					removeSearchItems.Sort();
					removeSearchItems.MakeIntersection(origSearch); // handles in origSearch (present in any filter)
					this.validSearch = true;
					try {
						handlesInSearch = fb.GetQueryItems(removeSearchItems, !this.filterQuery.includes('$searchtext') ? panel.search.txt : this.filterQuery.replace(/\$searchtext/g, panel.search.txt));
					} catch (e) {
						this.validSearch = false;
					}
					handlesInSearch.Sort();
					removeSearchItems.MakeDifference(handlesInSearch); // handles to remove
					if (removeSearchItems.Count) this.removedSearch(removeSearchItems);
					if (newSearchItems.Count || removeSearchItems.Count) {
						if (!panel.list.Count) {
							pop.clearTree();
							sbar.setRows(0);
							this.none = this.validSearch ? 'Nothing found' : 'Invalid search expression';
							panel.treePaint();
							break;
						}
						if (ui.w < 1 || !window.IsVisible) this.upd = 2;
						else this.lib_update();
					}
				}
				break;
			}
			case 2:
				this.removed(handleList);
				if (this.noListUpd) break;
				if (ui.w < 1 || !window.IsVisible) this.upd = 2;
				else this.lib_update();
				break;
		}
	}
}