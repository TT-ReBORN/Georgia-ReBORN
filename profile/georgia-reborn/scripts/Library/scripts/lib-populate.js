'use strict';

class LibPopulate {
	constructor() {
		this.alt_dbl_clicked = false;
		this.childCount = 0;
		this.clicked_on = 'none';
		this.cur = [];
		this.cur_ix = 0;
		this.customSort = FbTitleFormat(libSet.customSort);
		this.dbl_clicked = false;
		this.expandedTracks = 0;
		this.expandLmt = 500;
		this.hotKeys = $Lib.split(libSet.hotKeys, 0);
		this.hand = false;
		this.id = '';
		this.inlineRoot = libSet.rootNode && (libSet.inlineRoot || libSet.facetView);
		this.is_focused = false;
		this.last_sel = -1;
		this.lbtnDn = false;
		this.libItems = false;
		this.mbtn_dbl_clicked = false;
		this.nd = [];
		this.nowp = -1;
		this.rows = 0;
		this.sel_items = [];
		this.selection_holder = fb.AcquireUiSelectionHolder();
		this.selList = null;
		this.setFocus = false;
		this.specialChar = '[\\u0027\\u002D\\u00AD\\u058A\\u2010\\u2011\\u2012\\u2013\\u2014\\uFE58]';
		this.sy_sz = 8;
		this.tree = [];

		this.cache = {
			standard: {},
			filter: {},
			search: {}
		}

		this.highlight = {};

		this.getMainMenuIndex = {
			add: parseFloat(this.hotKeys[3]),
			collapseAll: parseFloat(this.hotKeys[1]),
			insert: parseFloat(this.hotKeys[5]),
			new: parseFloat(this.hotKeys[7]),
			searchClear: parseFloat(this.hotKeys[11]),
			searchFocus: parseFloat(this.hotKeys[9])
		};

		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		this.m = {
			br: -1,
			cur_br: 0,
			i: -1
		};

		this.row = {
			cur: 0,
			i: -1,
			lineMax: [],
			note_w: 0
		};

		this.tf = {
			added: FbTitleFormat(libSet.tfAdded),
			bitrate: FbTitleFormat('%bitrate%'),
			bytes: FbTitleFormat('%path%|%filesize%'),
			date: FbTitleFormat(libSet.tfDate),
			firstPlayed: FbTitleFormat(libSet.tfFirstPlayed),
			lastPlayed: FbTitleFormat(libSet.tfLastPlayed),
			pc: FbTitleFormat(libSet.tfPc),
			popularity: FbTitleFormat(libSet.tfPopularity),
			rating: FbTitleFormat(libSet.tfRating)
		};

		this.triangle = {
			expand: null,
			highlight: null,
			select: null
		};

		this.collator = new Intl.Collator(undefined, {
			sensitivity: 'accent',
			numeric: true
		});

		this.setActions();
		this.setValues();
	}

	// * METHODS * //

	activateTooltip(value) {
		if (!grSet.showTooltipLibrary && !grSet.showTooltipTruncated || libTooltip.Text == value) return;
		this.checkTooltipFont('tree');
		if (grSet.showStyledTooltips) {
			grm.ui.styledTooltipText = value;
		} else {
			libTooltip.Text = value;
			libTooltip.Activate();
		}
	}

	add(x, y, pl) {
		if (y < lib.panel.search.h) return;
		const ix = this.get_ix(x, y, true, false);
		lib.panel.pos = ix;
		if (ix < this.tree.length && ix >= 0) {
				if (this.check_ix(this.tree[ix], x, y, true)) {
				this.clearSelected();
				this.tree[ix].sel = true;
				this.getTreeSel();
				this.load(this.sel_items, true, true, false, pl, false);
				lib.lib.treeState(false, libSet.rememberTree);
			}
		}
	}

	addItems(arr, item) {
		item.forEach(v => {
			for (let i = v.start; i <= v.end; i++) arr.push(i);
		});
	}

	arrayToRange(array) {
		return array.slice().sort((a, b) => a - b).reduce((ranges, value) => {
			const lastIndex = ranges.length - 1;
			if (lastIndex === -1 || ranges[lastIndex].max !== value - 1) {
			ranges.push({ min: value, max: value });
			} else {
				ranges[lastIndex].max = value;
			}
			return ranges;
		}, []).map((range) => range.min !== range.max ? `${range.min}-${range.max}` : range.min.toString());
	}

	branch(br, base, node, block) {
		if (!br || br.track || !lib.lib.initialised || lib.lib.list.Count != lib.lib.libNode.length) return;
		const ix = this.showTracks ? 2 : 3;
		const l = base ? 0 : this.rootNode ? br.level : br.level + 1;
		if (base) node = false;
		let i = 0;
		let n = '';
		let n_o = '#get_branch#';
		let nU = '';
		this.range(br.item).forEach(v => {
			n = lib.lib.node[v][l];
			nU = n.toUpperCase();
			if (n_o != nU) {
				n_o = nU;
				if (lib.panel.multiPrefix) n = lib.lib.prefixes(n);
				br.child[i] = {
					nm: n,
					sel: false,
					child: [],
					track: l > lib.lib.node[v].length - ix,
					item: [v],
					srt: lib.lib.sort(n)
				};
				i++;
			} else br.child[i - 1].item.push(v);
		});
		this.condense(br.child);
		this.buildTree(lib.lib.root, 0, node, true, block);
	}

	branchChange(br) {
		const arr = br.level == 0 ? lib.lib.root : this.tree[br.par].child;
		this.childCount = 0;
		this.getChildCount(arr, br.ix);
		arr.forEach(v => v.child = []);
		return this.childCount;
	}

	branchCount(br, base, node, block, key, type) {
		if (!br || !lib.lib.node.length) return;
		if (this.cache[type][key]) return this.cache[type][key].value;
		const l = base ? 0 : this.rootNode ? br.level : br.level + 1;
		const b = [];
		let n = '';
		let n_o = '#get_branch#';
		let nU = '';
		if (base) node = false;
		const full = !!br.root;
		this.range(br.item).forEach(v => {
			if (l < lib.lib.node[v].length) {
				n = lib.lib.node[v][l];
				nU = n.toUpperCase();
				if (n_o != nU) {
					n_o = nU;
					if (lib.panel.multiPrefix) n = lib.lib.prefixes(n);
					b.push({
						nm: n,
						srt: lib.lib.sort(n)
					});
				}
			}
		});
		if (!lib.panel.multiProcess && (!node || node && !full)) this.merge(b, true);
		if (lib.panel.multiProcess) {
			const multi_cond = [];
			const multi_obj = [];
			const multi_rem = [];
			const nm_arr = [];
			let h = -1;
			let j = 0;
			let multi = [];
			n = '';
			n_o = '#condense#';
			nU = '';
			b.forEach((v, i) => {
				if (v.nm.includes('@@')) {
					multi = this.getAllCombinations(v.nm);
					multi_rem.push(i);
					multi.forEach(w => {
						multi_obj.push({
							nm: w.join(''),
							srt: lib.lib.sort(w.join(''))
						});
					});
				}
			});
			let i = multi_rem.length;
			while (i--) b.splice(multi_rem[i], 1);
			this.sort(multi_obj);
			multi_obj.forEach(v => {
				n = v.nm;
				nU = n.toUpperCase();
				if (n_o != nU) {
					n_o = nU;
					multi_cond[j] = {
						nm: n,
						srt: v.srt
					};
					j++;
				}
			});
			b.forEach(v => {
				v.nm = v.nm.replace(/#!#/g, '');
				nm_arr.push(v.nm);
			});
			multi_cond.forEach((v, i) => {
				h = nm_arr.indexOf(v.nm);
				if (h != -1) multi_cond.splice(i, 1);
			});
			multi_cond.forEach((v, i) => b.splice(i + 1, 0, {
				nm: v.nm,
				srt: v.srt
			}));
			this.merge(b, true);
		}
		this.cache[type][key] = {
			value: b.length,
			items: []
		}
		return b.length;
	}

	buildTree(br, level, node, full, block) {
		const l = !this.rootNode ? level : level - 1;
		let i = 0;
		let j = 0;
		if (!br[0].sorted) {
			switch (lib.panel.multiProcess) {
				case false:
					if (!node || node && !full) this.merge(br);
					break;
				case true: {
					const multi_cond = [];
					const multi_obj = [];
					const multi_rem = [];
					const nm_arr = [];
					let h = -1;
					let multi = [];
					let n = '';
					let n_o = '#condense#';
					let nU = '';
					br.forEach((v, i) => {
						if (v.nm.includes('@@') || v.nm.includes(lib.panel.softSplitter)) {
							multi = this.getAllCombinations(v.nm);
							multi_rem.push(i);
							multi.forEach(w => {
								multi_obj.push({
									nm: w.join(''),
									item: this.copy(v.item),
									track: v.track,
									srt: lib.lib.sort(w.join(''))
								});
							});
						}
					});
					i = multi_rem.length;
					while (i--) br.splice(multi_rem[i], 1);
					this.sort(multi_obj);
					multi_obj.forEach(v => {
						n = v.nm;
						nU = n.toUpperCase();
						if (n_o != nU) {
							n_o = nU;
							multi_cond[j] = {
								nm: n,
								item: this.copy(v.item),
								track: v.track,
								srt: v.srt
							};
							j++;
						} else v.item.forEach(v => multi_cond[j - 1].item.push(v));
					});
					br.forEach(v => {
						v.nm = v.nm.replace(/#!#/g, '');
						nm_arr.push(v.nm);
					});
					multi_cond.forEach((v, i) => {
						h = nm_arr.indexOf(v.nm);
						if (h != -1) {
							v.item.forEach(v => br[h].item.push(v));
							multi_cond.splice(i, 1);
						}
					});
					multi_cond.forEach((v, i) => br.splice(i + 1, 0, {
						nm: v.nm,
						sel: false,
						track: v.track,
						child: [],
						item: this.copy(v.item),
						srt: v.srt
					}));
					this.merge(br);
					break;
				}
			}
			this.sort(br);
			br[0].sorted = true;
		}
		const br_l = br.length;
		const par = this.tree.length - 1;
		if (level == 0) this.clearTree();

		// * Apply View By Folder Hide if View by Folder Structure is active
		if (lib.panel.folderView) lib.men.setViewByFolderHide(this.tree, libSet.viewByFolderHide);

		br.forEach((v, i) => {
			j = this.tree.length;
			const item = this.tree[j] = v;
			item.top = !i;
			item.bot = i == br_l - 1;
			item.count = '';
			item.ix = j;
			item.level = level;
			item.par = par;
			switch (true) {
				case libSet.facetView:
					if (!item.root) item.track = true;
					break;
				case l != -1 && !this.showTracks:
					this.range(item.item).some(v => {
						if (lib.lib.node[v] && (lib.lib.node[v].length == l + 1 || lib.lib.node[v].length == l + 2)) return item.track = true;
					});
					break;
				case l == 0 && lib.lib.node[item.item[0].start] && lib.lib.node[item.item[0].start].length == 1:
					item.track = true;
					break;
			}
			if (lib.ui.col.counts && (!item.track || !this.showTracks)) {
				const str = `@!#${lib.ui.col.counts}\`${this.highlight.text ? lib.ui.col.text_h : lib.ui.col.counts}\`${lib.ui.col.textSel}@!#`;
				if (!item.nm.endsWith(str)) item.nm += str;
			}
			item.name = !lib.panel.noDisplay ? item.nm : item.nm.replace(/#@#.*?#@#/g, '');
			if (v.child.length > 0) this.buildTree(v.child, level + 1, node, !!item.root);
		});
		if (lib.ui.style.squareNode && lib.ui.col.line) {
			this.row.lineMax = [];
			this.tree.forEach(v => {
				const depth = !this.inlineRoot ? v.level : Math.max(v.level - 1, 0)
				this.row.lineMax[depth] = v.ix
			});
		}
		if (this.rootNode == 3) this.tree[0].name = this.tree[0].child.length > 1 ? lib.panel.rootName.replace('#^^^^#', this.tree[0].child.length) : lib.panel.rootName1;
		lib.find.initials = null;
		if (!block) {
			lib.sbar.setRows(this.tree.length);
			lib.panel.treePaint();
		}
	}

	butTooltipFont() {
		return [grFont.fontDefault, 15 * $Lib.scale * libSet.zoomTooltipBut / 100, 0];
	}

	calcStatistics(v) {
		const key = `stat${this.getKey(v)}`;
		const type = lib.panel.search.txt ? 'search' : libSet.filterBy ? 'filter' : 'standard';
		if (this.cache[type][key]) return this.cache[type][key].value;
		const handleList = new FbMetadbHandleList();
		let items = [];
		this.addItems(items, v.item);
		items = [...new Set(items)].sort(this.numSort)
		items.some(w => {
			if (w >= lib.panel.list.Count) return true;
			handleList.Add(lib.panel.list[w]);
		});
		let date = '';
		let dates;
		let indices;
		let ln;
		let n;
		let tf;
		let value;
		let values;
		switch (libSet.itemShowStatistics) {
			case 1: // bitrate
				values = this.tf.bitrate.EvalWithMetadbs(handleList);
				if (values.length == 1) {
					value = Number(values[0]) || '';
				} else {
					let lengths = FbTitleFormat('%length_seconds_fp%').EvalWithMetadbs(handleList)
					const total = values.map((v, i) => v * lengths[i]);
					let totals = total.map(v => parseFloat(v) || '');
					totals = totals.filter((v, i) => v && lengths[i] ? v : lengths.splice(i, 1));
					totals = totals.reduce((a, b) => a + b, 0);
					lengths = lengths.map(v => parseFloat(v)).reduce((a, b) => a + b, 0);
					value = Number(Math.round(totals / lengths)) || '';
				}
				if (lib.panel.imgView && value) value = `${value} kbps`;
				this.cache[type][key] = {
					value,
					items
				}
				return value;
			case 2: { // duration
				const duration = utils.FormatDuration(handleList.CalcTotalDuration());
				this.cache[type][key] = {
					value: duration,
					items: []
				}
				return duration;
			}
			case 3: { // total size
				const bytes = this.tf.bytes.EvalWithMetadbs(handleList);
				let size = [...new Set(bytes)];
				size = size.map(v => {
					const a = v.split('|');
					return a[a.length - 1];
				});
				if (!size.length) return '';
				size = size.map(v => parseInt(v)).reduce((a, b) => a + b, 0);
				const formattedBytes = this.formatBytes(size);
				this.cache[type][key] = {
					value: formattedBytes,
					items
				}
				return formattedBytes;
			}
			case 4: // rating
			case 5: // popularity
				tf = libSet.itemShowStatistics == 4 ? this.tf.rating : this.tf.popularity;
				values = tf.EvalWithMetadbs(handleList);
				values = this.getNumbers(values);
				values = values.filter(Boolean)
				ln = values.length;
				if (!ln) return '';
				values = values.map(v => parseFloat(v)).reduce((a, b) => a + b, 0);
				value = Math.ceil(values / ln);
				if (lib.panel.imgView && this.label) value = (libSet.itemShowStatistics == 4 ? 'Rating ' : 'Popularity ') + value;
				this.cache[type][key] = {
					value,
					items
				}
				return value;
			case 6: // date (first release)
			case 9: // firstPlayed
			case 10: // lastPlayed
			case 11: // added
				tf =
					libSet.itemShowStatistics == 6 ? this.tf.date :
					libSet.itemShowStatistics == 9 ? this.tf.firstPlayed :
					libSet.itemShowStatistics == 10 ? this.tf.lastPlayed :
					this.tf.added;
				dates = tf.EvalWithMetadbs(handleList);
				dates = dates.filter(v => v !== '');
				ln = dates.length;
				if (ln) {
					if (ln == 1) date = dates[0];
					else {
						date = libSet.itemShowStatistics == 6 || libSet.itemShowStatistics == 9 || libSet.itemShowStatistics == 11 ?
						dates.reduce((pre, cur) => Date.parse(pre) > Date.parse(cur) ? cur : pre) :
						dates.reduce((pre, cur) => Date.parse(cur) > Date.parse(pre) ? cur : pre)
					}
				}
				if (!date) return '';
				if (lib.panel.imgView && this.label) date = ['', '', '', '', '', '', (v.root ? 'First release ' : ''), '', '', 'First played ', 'Last played ', 'Added '][libSet.itemShowStatistics] + date;
				this.cache[type][key] = {
					value: date,
					items
				}
				return date;
			case 7: { // queue
				let index = '';
				indices = [];
				const queueHandles = plman.GetPlaybackQueueHandles();
				handleList.Convert().forEach(h => {
					const j = queueHandles.Find(h);
					if (j != -1) indices.push(j + 1);
				});
				ln = indices.length;
				if (ln) {
					if (ln == 1) index = indices[0];
					else {
						index = this.arrayToRange(indices);
						index.join();
					}
				}
				if (!index) return '';
				if (lib.panel.imgView && this.label) index = `Queue ${index}`;
				this.cache[type][key] = {
					value: index,
					items
				}
				return index;
			}
			case 8: { // playcount
				let playcount = this.tf.pc.EvalWithMetadbs(handleList);
				const played = [...new Set(playcount)];
				n = played.map(v => {
					const a = v.split('|');
					return a[a.length - 1];
				});
				playcount = this.getNumbers(n);
				if (!playcount.length) return '';
				playcount = n.map(v => parseInt(v)).reduce((a, b) => a + b, 0);
				if (lib.panel.imgView) playcount = `${(this.label ? 'Played ' : '')  + playcount}x`;
				this.cache[type][key] = {
					value: playcount,
					items
				}
				return playcount;
			}
		}
	}

	checkAutoHeight() {
		if (lib.panel.pn_h_auto && !lib.panel.imgView && libSet.pn_h == libSet.pn_h_min && this.tree[0]) this.clearChild(this.tree[0]);
	}

	check_ix(br, x, y, type) {
		if (lib.panel.imgView) return true;
		if (!br) return false;
		x -= lib.ui.x;
		const level = !this.inlineRoot ? br.level : Math.max(br.level - 1, 0);
		const icon_w = this.inlineRoot && br.ix == 0 ? 0 : lib.ui.icon.w + (!this.fullLineSelection ? lib.ui.l.wf : 0);
		return type ? (x >= Math.round(this.treeIndent * level + lib.ui.sz.margin) && x < Math.round(this.treeIndent * level + lib.ui.sz.margin) + br.w + icon_w) :
			(x >= Math.round(this.treeIndent * level + lib.ui.sz.margin) + icon_w) && x < Math.min(Math.round(this.treeIndent * level + lib.ui.sz.margin) + icon_w + br.w, lib.panel.tree.w);
	}

	checkNode(gr) {
		if (lib.sbar.draw_timer || this.nodeStyle != 7) return;
		try {
			lib.ui.style.symb.SetPartAndStateID(2, 1);
			lib.ui.style.symb.SetPartAndStateID(2, 2);
			lib.ui.style.symb.DrawThemeBackground(gr, -lib.ui.sz.node, -lib.ui.sz.node, lib.ui.sz.node, lib.ui.sz.node);
		} catch (e) {
			libSet.nodeStyle = 0;
			this.nodeStyle = 0;
		}
	}

	checkRow(x, y) {
		this.m.br = -1;
		const im = this.get_ix(x, y, true, false);
		if (im >= this.tree.length || im < 0) return -1;
		if (lib.panel.imgView) return im;
		const item = this.tree[im];
		const level = !this.inlineRoot ? item.level : Math.max(item.level - 1, 0);
		if (x < Math.round(this.treeIndent * level) + lib.ui.icon.w + lib.ui.sz.margin + lib.ui.x + lib.ui.w && (!item.track || item.root)) this.m.br = im;
		return im;
	}

	check_tooltip(ix, x, y) {
		if (this.lbtnDn || lib.sbar.draw_timer) return;
		const item = this.tree[ix];
		let text = '';
		if (!item) return;
		switch (true) {
			case !lib.panel.imgView: {
				const trace1 = item.tt && item.tt.needed && x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y && y <= item.tt.y + lib.ui.row.h;
				const trace2 = item.stats_tt && item.stats_tt.needed && x >= item.stats_tt.x + item.stats_tt.w && x <= lib.ui.w - lib.ui.sz.marginRight && y >= item.stats_tt.y && y <= item.stats_tt.y + lib.ui.row.h * 0.9;
				if (trace2) {
					text = this.statisticsShow ?
					(item.statistics !== undefined ? `${this.statistics[this.statisticsShow]}: ${item.statistics}` : '') :
					(item.count ? `${['', 'Tracks', 'Items'][this.nodeCounts]}:${item.count}` : '');
				} else if (trace1) {
					text = (!lib.panel.colMarker ? item.name : item.name.replace(/@!#.*?@!#/g, '')) + (!this.countsRight || this.statisticsShow ? item.count : '');
					text = text.replace(/&/g, '&&');
				}
				if (text != libTooltip.Text) this.deactivateTooltip();
				if (!trace1 && !trace2 || !item.tt && !item.stats_tt) {
					this.deactivateTooltip();
					return;
				}
				break;
			}
			case lib.panel.imgView: {
				let trace1 = false;
				let trace2 = false;
				let trace3 = false;
				if (!libImg.labels.hide) {
					if (!item.tt) {
						this.deactivateTooltip();
						return;
					}
					trace1 = x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y1 && y <= item.tt.y1 + libImg.text.h;
					trace2 = item.tt.y2 == -1 ? false : x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y2 && y <= item.tt.y2 + libImg.text.h;
					trace3 = item.tt.y3 == -1 ? false : x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y3 && y <= item.tt.y3 + libImg.text.h;
					text = trace1 || trace2 || trace3 ? item.tt.text : '';
					if (lib.panel.colMarker) text = text.replace(/@!#.*?@!#/g, '');
					text = text.replace(/&/g, '&&');
					if (text != libTooltip.Text) this.deactivateTooltip();
					if (!trace1 && !trace2 && !trace3 || !item.tt[1] && !item.tt[2] && !item.tt[3]) {
						this.deactivateTooltip();
						return;
					}
				} else {
					text = lib.panel.lines == 2 ? !libSet.albumArtFlipLabels ? `${item.grp}\n${item.lot}` : `${item.lot}\n${item.grp}` : item.grp;
					if (lib.panel.colMarker) text = text.replace(/@!#.*?@!#/g, '');
					text = text.replace(/&/g, '&&');
					if (text != libTooltip.Text) this.deactivateTooltip();
				}
				break;
			}
		}
		this.activateTooltip(text);
		lib.timer.tooltipLib();
	}

	checkTooltip(item, x, y, txt_w, w) {
		item.tt = {
			needed: txt_w > w,
			x,
			y,
			w
		};
		item.stats_tt = {
			needed: !this.tooltipStatistics || !this.statisticsShow || item.root ? false : [false, true, false, true, true, true, true, true, true, true, true, true][this.statisticsShow] && item.statistics !== undefined,
			x,
			y: y + lib.ui.row.h * 0.1,
			w
		};
	}

	checkTooltipFont(type) {
		switch (type) {
			case 'btn': {
				const newTooltipFont = this.butTooltipFont();
				if ($Lib.equal(this.cur, newTooltipFont)) return;
				this.cur = newTooltipFont;
				break;
			}
			case 'tree': {
				const newTooltipFont = this.treeTooltipFont();
				if ($Lib.equal(this.cur, newTooltipFont)) return;
				this.cur = newTooltipFont;
				break;
			}
		}
		libTooltip.SetFont(this.cur[0], this.cur[1], this.cur[2]);
	}

	clearSelected() {
		this.tree.forEach(v => v.sel = false);
	}

	clearTree() {
		if (lib.panel.imgView && this.tree.length) libImg.trimCache(this.tree[0].key);
		this.tree = [];
	}

	clearChild(br) {
		br.child = [];
		this.buildTree(lib.lib.root, 0, true, true);
	}

	clickedOn(x, y, item) {
		if (lib.panel.imgView) return 'text';
		if (this.inlineRoot && item.ix == 0) return this.check_ix(item, x, y, false) ? 'text' : 'none';
		const level = !this.inlineRoot ? item.level : Math.max(item.level - 1, 0);
		return x < lib.ui.x + Math.round(this.treeIndent * level) + lib.ui.icon.w + lib.ui.sz.margin ? 'node' : this.check_ix(item, x, y, false) ? 'text' : 'none';
	}

	collapseAll() {
		let ic = this.get_ix(lib.ui.x, lib.ui.y + lib.panel.tree.y + lib.ui.row.h / 2, true, false);
		if (ic >= this.tree.length || ic < 0) return;
		let j = this.tree[ic].level;
		if (this.rootNode) j -= 1;
		if (this.tree[ic].level != 0) {
			const par = this.tree[ic].par;
			const pr_pr = [];
			for (let m = 1; m < j + 1; m++) {
				pr_pr[m] = m == 1 ? par : this.tree[pr_pr[m - 1]].par;
				ic = pr_pr[m];
			}
		}
		const nm = this.tree[ic].srt[0].toUpperCase();
		this.tree.forEach(v => {
			if (!v.root) v.child = [];
		});
		this.buildTree(lib.lib.root, 0);
		let scr_pos = false;
		this.tree.some((v, i) => {
			if (v.srt[0].toUpperCase() == nm) {
				lib.sbar.checkScroll(i * lib.ui.row.h);
				return scr_pos = true;
			}
		});
		if (!scr_pos) {
			lib.sbar.reset();
			lib.panel.treePaint();
		}
		lib.lib.treeState(false, libSet.rememberTree);
	}

	condense(child) {
		child.forEach(v => {
			if (typeof v.item[0] !== 'number') return;
			v.item = this.createRanges(v.item);
		});
	}

	copy(item) {
		return item.map(v => v);
	}

	createImages() {
		if (!lib.ui.w || !lib.ui.h) return;
		if (!this.nodeStyle) {
			const sz = lib.ui.sz.node;
			const ln_w = Math.max(Math.floor(sz / 9), 1);
			let plus = true;
			let hot = false;
			let sy_w = ln_w;
			const x = 0;
			const y = 0;
			if (((sz - ln_w * 3) / 2) % 1 != 0) sy_w = ln_w > 1 ? ln_w - 1 : ln_w + 1;
			for (let j = 0; j < 4; j++) {
				this.nd[j] = $Lib.gr(sz, sz, true, g => {
					hot = j > 1;
					plus = !j || j == 2;
					if (grSet.libraryDesign !== 'reborn') {
						g.FillSolidRect(x, y, sz, sz, RGB(145, 145, 145));
						if (!hot) FillGradRect(g, x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, plus ? lib.ui.col.icon_e[0] : lib.ui.col.icon_c[0], plus ? lib.ui.col.icon_e[1] : lib.ui.col.icon_c[1], 1.0);
						else FillGradRect(g, x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, lib.ui.col.icon_h[0], lib.ui.col.icon_h[1], 1.0);
						// const x_o = [x, x + sz - ln_w, x, x + sz - ln_w];
						// const y_o = [y, y, y + sz - ln_w, y + sz - ln_w];
						for (let i = 0; i < 4; i++) { // g.FillSolidRect(x_o[i], y_o[i], ln_w, ln_w, RGB(186, 187, 188));
							if (grSet.libraryDesign === 'traditional') g.FillSolidRect(x, y, sz, sz, lib.ui.col.iconPlusBg);
						}
					} else if (libSet.nodeStyle === 0) {
						g.DrawRect(x, y, sz - 1, sz - 1, 1, lib.ui.col.iconPlusBg);
					}
					if (plus) g.FillSolidRect(Math.floor(x + (sz - sy_w) / 2), y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? lib.ui.col.iconPlus : lib.ui.col.iconPlus_h);
					g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), Math.floor(y + (sz - sy_w) / 2), sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? (plus ? lib.ui.col.iconMinus_e : lib.ui.col.iconMinus_c) : lib.ui.col.iconMinus_h);
				});
			}
		} else {
			let lightCol = lib.ui.isLightCol(lib.ui.col.icon_h);
			$Lib.gr(1, 1, false, g => {
				const h = this.nodeStyle != 7 ? g.CalcTextHeight('String', lib.ui.icon.font) / 15 : g.CalcTextHeight('String', lib.ui.font.main) / 20;
				this.sy_sz = Math.floor(Math.max(8 * libSet.zoomNode / 100 * h, 5));
			});

			const sz = Math.max(Math.round(this.sy_sz * 1.666667), 1);
			this.triangle.highlight = $Lib.gr(sz, sz, true, g => {
				g.SetSmoothingMode(4);
				g.FillPolygon(lib.ui.col.icon_h, 1, [sz, 0, sz, sz, 0, sz]);
				g.SetSmoothingMode(0);
			});
			lightCol = lib.ui.isLightCol(lib.ui.col.icon_e);
			this.triangle.expand = $Lib.gr(sz, sz, true, g => {
				g.SetSmoothingMode(4);
				g.FillPolygon(lib.ui.col.icon_e & (lightCol ? 0xC0ffffff : 0xBAffffff), 1, [sz, 0, sz, sz, 0, sz]);
				g.SetSmoothingMode(0);
			});
			this.triangle.select = $Lib.gr(sz, sz, true, g => {
				g.SetSmoothingMode(4);
				g.FillPolygon(lib.ui.col.textSel & (lightCol ? 0xC0ffffff : 0xBAffffff), 1, [sz, 0, sz, sz, 0, sz]);
				g.SetSmoothingMode(0);
			});
		}
	}

	createRanges(arr) {
		const ret = [];
		let start;
		let end;
		for (let i = 0; i < arr.length; i++) {
			start = end = arr[i];
			while (arr[i + 1] == end + 1) {
				end++;
				i++;
			}
			ret.push(start == end ? {
				start,
				end: start,
				count: 1
			} : {
				start,
				end,
				count: end - start + 1
			});
		}
		return ret;
	}

	cusCol(gr, text, item, item_x, item_y, w, h, type, np, font, ellipsisSpace, cus) {
		if (!text) return;
		let col = [];
		let col_x = [];
		let col_w = [];
		let w_arr = [];
		let x = 0;
		if (item[cus] && item[cus].id == this.id && !this.highlight.nowPlayingIndicator) {
			col = item[cus].col;
			col_x = item[cus].col_x;
			col_w = item[cus].col_w;
			text = item[cus].txt;
			w_arr = item[cus].txt_w;
		} else {
			text = text.split('@!#');
			text.forEach((v, i) => {
				if (i % 2 == 0) w_arr[i] = gr.CalcTextWidth(text[i], font);
			});
			text.forEach((v, i) => {
				if (i % 2 == 0) {
					const cur_w = x + w_arr[i];
					const next_text = !!text[i + 2];
					let ellipsis_corr = 0;
					const roomForEllipsis = !(next_text && cur_w < w && w - cur_w < ellipsisSpace);
					if (!roomForEllipsis) {
						text[i + 2] = '';
						ellipsis_corr = ellipsisSpace;
					}
					col[i] = i > 0 ? (text[i - 1]).split('`') : (!lib.panel.imgView || !libImg.labels.overlayDark ? lib.ui.col.txtArr : [RGB(240, 240, 240), lib.ui.col.text_h, lib.ui.col.text]);
					col_x[i] = x;
					col_w[i] = w - x - ellipsis_corr > ellipsis_corr ? w - x - ellipsis_corr : w - x;
					x += w_arr[i];
				}
			});
			item[cus] = {
				id: this.id,
				txt: text,
				col,
				col_x,
				col_w,
				txt_w: w_arr
			};
		}
		text.forEach((v, i) => {
			if (i % 2 == 0 && text[i]) {
				gr.GdiDrawText(text[i], font, !np ? col[i][type] : lib.ui.col.nowp, item_x + col_x[i], item_y, col_w[i], h, lib.panel.lc);
			}
		});
	}

	deactivateTooltip() {
		if (!libTooltip.Text && !grSet.showStyledTooltips || lib.but.trace) return;
		libTooltip.Text = '';
		lib.but.tooltipLib.delay = false;
		libTooltip.Deactivate();
	}

	dragDrop(x, y) {
		x -= lib.ui.x; y -= lib.ui.y;
		if (!this.lbtnDn) return;
		const drag_diff = !libSet.touchControl ? Math.sqrt((Math.pow(this.last_pressed_coord.x - x, 2) + Math.pow(this.last_pressed_coord.y - y, 2))) : Math.abs(x - this.last_pressed_coord.x);
		if (drag_diff > 7) {
			if (libSet.touchControl) {
				const ix = this.get_ix(x, y, true, false);
				const item = this.tree[ix];
				if (lib.ui.id.dragDrop != ix || ix >= this.tree.length || ix < 0) return;
				if (!item.sel && !lib.vk.k('ctrl')) this.setTreeSel(ix, item.sel);
			}
			this.last_pressed_coord = {
				x: undefined,
				y: undefined
			};

			const handleList = this.getHandleList('newItems');
			this.sortIfNeeded(handleList);

			if (grm.ui.displayLibrarySplit()) { // * Drag and drop action from Library to Playlist in split layout
				grm.ui.librarySplitDragDrop();
			} else {
				fb.DoDragDrop(0, handleList, handleList.Count ? 1 | 4 : 0);
			}

			this.lbtnDn = false;
		}
	}

	draw(gr) { // * Heavily modified
		if (lib.lib.empty) return gr.DrawString(lib.lib.empty, lib.ui.font.main, lib.ui.col.text, lib.ui.x, grm.ui.wh * 0.5 - lib.ui.y - lib.panel.search.h * 0.5, lib.panel.tree.w, lib.ui.row.h * 3, Stringformat.align_center);
		if (!this.tree.length || !lib.panel.draw) return gr.GdiDrawText(this.libItems && !lib.panel.search.txt && !libSet.filterBy && libSet.libSource ? 'Loading...\n\n' : lib.lib.none, lib.ui.font.main, lib.ui.col.text, lib.ui.x + lib.ui.sz.margin, lib.ui.y + lib.panel.search.h, lib.panel.tree.w, lib.ui.row.h * 3);
		if (lib.panel.imgView) return;
		const b = $Lib.clamp(Math.round(lib.sbar.delta / lib.ui.row.h + 0.4), 0, this.tree.length - 1);
		// const bar_x = this.nodeStyle && this.nodeStyle < 5 ? 0 : lib.ui.sz.pad;
		const f = Math.min(b + lib.panel.rows, this.tree.length);
		const nm = [];
		const nowp_c = [];
		const updatedNowpBg = pl.col.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing
		const colNowPlaying = grSet.libraryBgImg ? RGBtoRGBA(lib.ui.col.nowPlayingBg, grSet.libraryBgRowOpacity) : lib.ui.col.nowPlayingBg;
		const colRowStripes = grSet.libraryBgImg ? RGBtoRGBA(lib.ui.col.rowStripes, grSet.libraryBgRowOpacity) : lib.ui.col.rowStripes;
		const row = [];
		const y1 = Math.round(lib.panel.search.h - lib.sbar.delta + lib.panel.node_y) + Math.floor(lib.ui.sz.node / 2);
		let i = 0;
		let item_x = 0;
		let item_y = 0;
		let sel_x = 0;
		let sel_w = 0;
		let level = 0;
		this.checkNode(gr);
		if (!lib.ui.style.squareNode) gr.SetTextRenderingHint(5);
		this.rows = 0;
		if (lib.ui.style.squareNode && lib.ui.col.line) {
			level = !this.inlineRoot ? this.tree[b].level : Math.max(this.tree[b].level - 1, 0);
			for (let j = 0; j <= level; j++) row[j] = b;
		}
		for (i = b; i < f; i++) {
			const item = this.tree[i];
			this.getItemCount(item);
			nm[i] = item.name + (i || this.rootNode != 3 || this.nodeCounts == 1 && (this.countsRight || this.statisticsShow) ? (!this.countsRight || this.statisticsShow ? item.count : '') : '');
			const counts = !this.statisticsShow ? item.count : item.statistics;
			if (this.highlight.nowPlayingShow && !item.root && this.inRange(this.nowp, item.item)) nowp_c.push(i);
			item.np = nowp_c.includes(i) || lib.panel.textDiffHighlight && this.m.i == i ? '\u266B  ' : '';
			if (item.np && item.id != this.id) this.row.note_w = gr.CalcTextWidth(item.np, lib.ui.font.main);
			if (item.id != this.id || this.highlight.nowPlayingIndicator) {
				let itemName = !lib.panel.colMarker ? nm[i] : nm[i].replace(/@!#.*?@!#/g, '');
				if (item.np && this.highlight.nowPlayingIndicator && item.track) itemName = item.np + itemName;
				item.name_w = gr.CalcTextWidth(itemName, lib.ui.font.main, true);
				item.count_w = this.nodeCounts && this.countsRight || this.statisticsShow ?
					gr.CalcTextWidth(counts || '000', lib.ui.font.small) + (counts ? lib.ui.row.h * 0.2 : 0) : 0;
				if (!this.fullLineSelection) {
					item.w = item.name_w;
					item.id = this.id;
				}
			}

			level = !this.inlineRoot ? item.level : Math.max(item.level - 1, 0);
			if (this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item)) nowp_c.push(i);
			item_y = Math.round(lib.ui.y + lib.ui.row.h * i + lib.panel.search.h - lib.sbar.delta);
			if (item_y < lib.panel.filter.y) {
				this.rows++;
				if ((item.sel || this.highlight.nowPlaying) && (lib.ui.col.bgSel != 0 || grCol.primary != 0)) {
					const icon_w = !this.inlineRoot || i ? lib.ui.icon.w : 0;
					item_x = Math.round(lib.ui.x + this.treeIndent * level + lib.ui.sz.margin) + icon_w;
					sel_x = Math.round(item_x - lib.ui.sz.sel);
					if (this.inlineRoot && !i) sel_x = Math.max(sel_x - lib.ui.sz.sel, 0);
					sel_w = Math.min(item.name_w + lib.ui.sz.sel * 2, lib.ui.x + lib.panel.tree.w - sel_x - item.count_w - 1);
					if (this.fullLineSelection) {
						sel_x = lib.ui.x;
						sel_w = lib.sbar.w ? lib.ui.w - SCALE(42) : lib.ui.w + 1;
					}
					if (!nowp_c.includes(i)) {
						if (this.fullLineSelection && this.sbarShow === 1 && lib.ui.sbar.type === 2 && (this.highlight.row || !this.fullLineSelection)) {
							gr.FillSolidRect(sel_x, item_y, sel_w + lib.ui.l.w, lib.ui.row.h, lib.ui.col.bgSel);
							gr.FillSolidRect(sel_x, item_y, sel_w + lib.ui.l.w, lib.ui.l.w, lib.ui.col.bgSelframe);
							gr.FillSolidRect(sel_x, item_y + lib.ui.row.h, sel_w + lib.ui.l.w, lib.ui.l.w, lib.ui.col.bgSelframe);
						}
					}
					// * Now playing bg selection
					else if (this.highlight.nowPlaying && updatedNowpBg) {
						gr.FillSolidRect(grSet.libraryDesign === 'traditional' ? item_x - SCALE(2) : lib.ui.x, item_y, grSet.libraryDesign === 'traditional' && this.fullLineSelection ? sel_w - item_x - lib.ui.sz.margin - lib.ui.sz.node + lib.ui.l.w : grSet.libraryDesign === 'traditional' && !this.fullLineSelection ? sel_w + sel_x - item_x + SCALE(2) : !this.fullLineSelection ? sel_w + lib.ui.sz.margin + sel_x - lib.ui.x - lib.ui.sz.sideMarker : sel_w, lib.ui.row.h, colNowPlaying);

						if (grSet.libraryDesign !== 'traditional') {
							gr.FillSolidRect(lib.ui.x, item_y, lib.ui.sz.sideMarker, lib.ui.row.h, lib.ui.col.sideMarker);
						}
					}
					// * Marker selection with now playing active
					if (item.sel && this.highlight.nowPlaying) {
						if (grSet.libraryDesign !== 'traditional') {
							if (!this.inRange(this.nowp, item.item) || item.root) gr.DrawRect(this.fullLineSelection ? sel_x : lib.ui.x, item_y, this.fullLineSelection ? sel_w - 1 : sel_w + lib.ui.sz.margin + sel_x - lib.ui.x - lib.ui.sz.sideMarker, lib.ui.row.h, 1, lib.ui.col.selectionFrame);
							gr.FillSolidRect(lib.ui.x, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? item_y + 1 : item_y, lib.ui.sz.sideMarker, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? lib.ui.row.h - 1 : lib.ui.row.h + 1, lib.ui.col.sideMarker);
						}
						else if (grSet.libraryDesign === 'traditional') {
							gr.FillSolidRect(item_x - SCALE(2), item_y, grSet.libraryDesign === 'traditional' && this.fullLineSelection ? sel_w - item_x - lib.ui.sz.margin - lib.ui.sz.node + lib.ui.l.w : sel_w, lib.ui.row.h, colNowPlaying);
						}
					}
					// * Marker selection with now playing deactivated
					if (item.sel && !this.highlight.nowPlaying && updatedNowpBg) {
						gr.FillSolidRect(grSet.libraryDesign === 'traditional' && this.fullLineSelection ? item_x - SCALE(2) : sel_x, item_y, grSet.libraryDesign === 'traditional' && this.fullLineSelection ? sel_w - item_x - lib.ui.sz.margin - lib.ui.sz.node + lib.ui.l.w : sel_w, lib.ui.row.h, colNowPlaying);

						if (grSet.libraryDesign !== 'traditional') {
							gr.FillSolidRect(lib.ui.x, item_y, lib.ui.w, lib.ui.row.h, colNowPlaying);
							gr.FillSolidRect(lib.ui.x, item_y, lib.ui.sz.sideMarker, lib.ui.row.h, lib.ui.col.sideMarker);
						}
					}
				}
				if (this.rowStripes) {
					if (i % 2 == 0) gr.FillSolidRect(lib.ui.x, item_y + 1, lib.panel.tree.stripe.w, lib.ui.row.h - 2, colRowStripes /*ui.col.bg1*/);
					else gr.FillSolidRect(lib.ui.x, item_y, lib.panel.tree.stripe.w, lib.ui.row.h, lib.ui.col.bg2);
				}
			}
		}
		for (i = b; i < f; i++) {
			const item = this.tree[i];
			const level = !this.inlineRoot ? item.level : Math.max(item.level - 1, 0);
			item_y = Math.round(lib.ui.y + lib.ui.row.h * i + lib.panel.search.h - lib.sbar.delta);
			if (item_y < lib.panel.filter.y) {
				item_x = Math.round(lib.ui.x + this.treeIndent * level + lib.ui.sz.margin);
				if (this.inlineRoot && !item.level) item_x = lib.ui.x + lib.ui.sz.marginSearch;
				if ((this.fullLineSelection && this.row.i == i || this.m.i == i)) {
					sel_x = Math.round(item_x - lib.ui.sz.sel);
					if (!this.inlineRoot || item.level) sel_x += lib.ui.icon.w;
					sel_w = Math.min(item.name_w + lib.ui.sz.sel * 2, lib.ui.x + lib.panel.tree.w - sel_x - item.count_w - 1);
					if (this.fullLineSelection) {
						sel_x = lib.ui.x;
						sel_w = lib.sbar.w ? lib.ui.w - SCALE(42) : lib.ui.w + 1;
					}
					if (this.highlight.row == 3 && (this.fullLineSelection && this.sbarShow == 1 && lib.ui.sbar.type == 2)) {
						gr.DrawLine(sel_x, item_y, sel_w, item_y, lib.ui.l.w, lib.ui.col.frame);
						gr.DrawLine(sel_x, item_y + lib.ui.row.h, sel_w, item_y + lib.ui.row.h, lib.ui.l.w, lib.ui.col.frame);
					}
				}

				if (lib.ui.style.squareNode && lib.ui.col.line) {
					if (item.top) row[level] = i;
					const ff = lib.sbar.rows_drawn == this.rows || i < lib.sbar.rows_drawn ? f : f - 1;
					if (item.bot || i === ff - 1) {
						for (let depth = (i === ff - 1 ? 0 : level); depth <= level; depth++) {
							if (row[depth] !== undefined && (this.inlineRoot || !item.root)) {
								const start = row[depth];
								let end = i + (item.bot && depth === level ? 0.5 : 1);
								if (item_y >= lib.panel.filter.y) end -= 1;
								const l_x = Math.round(lib.ui.x + this.treeIndent * depth + lib.ui.sz.margin) + Math.floor(lib.ui.sz.node / 2) - lib.ui.l.wf;
								let l_y = Math.round(lib.ui.y + lib.ui.row.h * start + lib.panel.search.h - lib.sbar.delta);
								let l_h = Math.ceil(lib.ui.row.h * (end - start)) + lib.ui.l.wc;
								if (!start) {
									l_y += lib.ui.row.h / 2;
									l_h -= lib.ui.row.h / 2;
								}
								if (i <= this.row.lineMax[depth] && (!this.inlineRoot || item.level) && grSet.libraryDesign === 'traditional') gr.FillSolidRect(l_x, l_y, lib.ui.l.w, l_h, lib.ui.col.line);
							}
						}
						if (item.bot) row[level] = undefined;
					}
				}
			}
		}

		for (i = b; i < f; i++) {
			const item = this.tree[i];
			const level = !this.inlineRoot ? item.level : Math.max(item.level - 1, 0);
			item_y = Math.round(lib.ui.y + lib.ui.row.h * i + lib.panel.search.h - lib.sbar.delta);
			if (item_y < lib.panel.filter.y) {
				item_x = Math.round(lib.ui.x + this.treeIndent * level + lib.ui.sz.margin);
				if (this.inlineRoot && !item.level) item_x = lib.ui.x + lib.ui.sz.marginSearch;
				if (lib.ui.style.squareNode) {
					if (!item.track && (!this.inlineRoot || item.level)) {
						const y2 = lib.ui.y + lib.ui.row.h * i + y1 - lib.ui.l.wf;
						if (lib.ui.col.line) if (grSet.libraryDesign !== 'reborn') gr.FillSolidRect(item_x + lib.ui.sz.node, y2, lib.ui.l.s1, lib.ui.l.w, lib.ui.col.line);
						this.drawNode(gr, item.child.length < 1 ? this.m.br != i ? 0 : 2 : this.m.br != i ? 1 : 3, item_x, item_y + lib.panel.node_y);
					} else if (lib.ui.col.line && (!this.inlineRoot || item.level)) {
						if (grSet.libraryDesign !== 'reborn') {
							const y2 = Math.round(lib.ui.y + lib.panel.search.h - lib.sbar.delta) + Math.ceil(lib.ui.row.h * (i + 0.5)) - lib.ui.l.wf;
							gr.FillSolidRect(item_x + lib.ui.l.s2, y2, lib.ui.l.s3, lib.ui.l.w, lib.ui.col.line);
						}
					}
				} else if (!item.track && (!this.inlineRoot || item.level)) this.drawNode(gr, item, item_x, item_y, item.child.length < 1, this.m.br == i, item.sel);
				if (!this.inlineRoot || item.level) item_x += lib.ui.icon.w + (!this.fullLineSelection ? lib.ui.l.wf : 0);
				const w = lib.ui.x + lib.panel.tree.w - item_x - lib.ui.sz.sel - item.count_w;
				this.checkTooltip(item, item_x, item_y, item.name_w, w);
				if (this.fullLineSelection && item.id != this.id) {
					item.w = lib.ui.x + lib.panel.tree.w - item_x - HD_4K(25, 45);
					item.id = this.id;
				}
				if (item.np && this.highlight.nowPlayingSidemarker) {
					gr.FillSolidRect(lib.ui.l.w, item_y, lib.ui.sz.sideMarker, lib.ui.row.h, lib.ui.col.nowp);
				}
				if (item.np && this.highlight.nowPlayingIndicator && item.track) nm[i] = item.np + nm[i];
				const np = item.np && this.highlight.nowPlaying;
				// const txt_co = np && !item.sel ? lib.ui.col.nowp : item.sel && this.fullLineSelection ? (this.highlight.row ? lib.ui.col.textSel : lib.ui.col.text) : this.m.i == i && this.highlight.text ? lib.ui.col.text_h : lib.ui.col.counts || lib.ui.col.count;
				const type = item.sel ? (this.highlight.row || !this.fullLineSelection ? 2 : 0) : this.m.i == i && this.highlight.text ? 1 : 0;
				const txt_c = // np && !item.sel ? lib.ui.col.nowp : lib.ui.col.txtArr[type];
					this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) && updatedNowpBg ? lib.ui.col.text_nowp :
					item.sel ? lib.ui.col.textSel :
					this.m.i === i ? lib.ui.col.text_h : lib.ui.col.text;

				!lib.panel.colMarker ? gr.GdiDrawText(nm[i], lib.ui.font.main, txt_c, item_x, item_y, w, lib.ui.row.h, lib.panel.lc) : this.cusCol(gr, nm[i], item, item_x, item_y, w, lib.ui.row.h, type, np, lib.ui.font.main, lib.ui.font.mainEllipsisSpace, 'text');
				if (this.countsRight || this.statisticsShow) {
					const scrollbar = lib.sbar.w === SCALE(12) && lib.sbar.scrollable_lines > 0;
					const x = lib.panel.tree.w - item_x + (grSet.libraryLayout === 'split' ? 0 : lib.ui.x) - (scrollbar ? SCALE(24) : 0);
					gr.GdiDrawText(!this.statisticsShow ? item.count : item.statistics, !item.root || !this.label ?  lib.ui.font.small : lib.ui.font.label, txt_c, item_x, item_y, x, lib.ui.row.h, lib.panel.rc);
				}
			}
		}
	}

	drawNode(gr, item, x, y, parent, hover, sel) {
		const selCol = sel && this.fullLineSelection && this.highlight.row;
		const y2 = Math.round(y);
		const ix = this.get_ix(x, y, true, false);
		if (ix >= this.tree.length || ix < 0) return;
		const itemtr = this.tree[ix];
		const nowp = this.highlight.nowPlaying && !itemtr.root && this.inRange(this.nowp, itemtr.item);
		const icon_c = nowp ? lib.ui.col.text_nowp : hover ? lib.ui.col.iconPlus_h : selCol ? lib.ui.col.iconPlus_sel : lib.ui.col.iconPlus;

		switch (this.nodeStyle) {
			case 0: // * Squares - Traditional design
				if (!this.highlight.node && item > 1) item -= 2;
				x = Math.round(x);
				y = Math.round(y);
				if (this.nd[item]) gr.DrawImage(this.nd[item], x, y, this.nd[item].Width, this.nd[item].Height, 0, 0, this.nd[item].Width, this.nd[item].Height);
				break;
			case 1:
			case 2: // * Angles/Arrows - Modern design
				if (!this.highlight.row && this.fullLineSelection) x += lib.ui.l.w;
				if (parent) {
					if (hover) {
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x + 1, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					} else {
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
						if (this.nodeStyle === 1) gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x + 1, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					}
				} else {
					gr.DrawString(lib.ui.icon.collapse, lib.ui.icon.font, icon_c, x - lib.ui.icon.offset, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					gr.DrawString(lib.ui.icon.collapse, lib.ui.icon.font, icon_c, x - lib.ui.icon.offset, y2 + 1, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
				}
				break;
			case 3: case 4: { // * Triangle - Ultra-modern design
				if (!this.highlight.row && this.fullLineSelection) x += lib.ui.l.w;
				// const y3 = Math.round(y + (lib.ui.row.h - this.sy_sz) / 2 - 2);
				gr.SetSmoothingMode(4);
				if (parent) {
					if (hover) {
						gr.DrawString(lib.ui.icon.expand2, lib.ui.icon.font, icon_c, x, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					} else {
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
						if (this.nodeStyle === 3) gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x + 1, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					}
				} else {
					gr.DrawString(lib.ui.icon.expand2, lib.ui.icon.font, icon_c, x, y2, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
				}
				gr.SetSmoothingMode(0);
				break;
			}
			case 5: // * Custom node - Georgia-ReBORN design ( Clean +|- )
				if (parent) { // Plus
					if (hover) {
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x, y2 - HD_4K(1, -1), lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x, y2 - HD_4K(1, -1), lib.ui.x + lib.panel.tree.w - x + 2, lib.ui.row.h + 2, lib.panel.s_lc);
					} else gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, icon_c, x, y2 - (DetectWine ? HD_4K(0, -1) : HD_4K(1, -1)), lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
				} else { // Minus
					gr.DrawString(lib.ui.icon.collapse, lib.ui.icon.font, icon_c, x - lib.ui.icon.offset, y2 - (DetectWine ? HD_4K(1, -1) : HD_4K(1, 0)), lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					gr.DrawString(lib.ui.icon.collapse, lib.ui.icon.font, icon_c, x - lib.ui.icon.offset, y2 - HD_4K(1, -1), lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h + 2, lib.panel.s_lc);
				}
				break;
			case 7:
				if (item > 1) item -= 2;
				lib.ui.style.symb.SetPartAndStateID(2, !item ? 1 : 2);
				lib.ui.style.symb.DrawThemeBackground(gr, x, y, lib.ui.sz.node, lib.ui.sz.node);
				break;
			default:
				if (parent) {
					if (hover) {
						gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, selCol ? lib.ui.col.textSel : this.highlight.node ? lib.ui.col.icon_h : lib.ui.col.icon_e, x, y + this.iconVerticalPad, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					} else gr.DrawString(lib.ui.icon.expand, lib.ui.icon.font, !selCol ? lib.ui.col.icon_c : lib.ui.col.textSel, x, y + this.iconVerticalPad, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
				} else {
					if (hover) {
						gr.DrawString(lib.ui.icon.collapse, lib.ui.icon.font, selCol ? lib.ui.col.textSel : this.highlight.node ? lib.ui.col.icon_h : lib.ui.col.icon_c, x - lib.ui.icon.offset, y + this.iconVerticalPad, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
					} else gr.DrawString(lib.ui.icon.collapse, lib.ui.icon.font, !selCol ? lib.ui.col.icon_e : lib.ui.col.textSel, x - lib.ui.icon.offset, y + this.iconVerticalPad, lib.ui.x + lib.panel.tree.w - x, lib.ui.row.h, lib.panel.s_lc);
				}
				break;
		}
	}

	expand(ie, nm) {
		let h = 0;
		let m = 0;
		if (ie) this.tree[ie].sel = true;
		if (!this.tree.some(v => v.sel)) return;
		if (libSet.autoCollapse) {
			const parent = [];
			const pr_pr = [];
			let par = 0;
			this.tree.forEach((v, j, arr) => {
				if (v.sel) {
					j = v.level;
					if (this.rootNode) j -= 1;
					if (v.level != 0) {
						par = v.par;
						for (m = 1; m < j + 1; m++) {
							pr_pr[m] = m == 1 ? par : arr[pr_pr[m - 1]].par;
							parent.push(pr_pr[m]);
						}
					}
				}
			});
			this.tree.forEach((v, i) => {
				if (!parent.includes(i) && !v.sel && !v.root) v.child = [];
			});
			this.buildTree(lib.lib.root, 0);
		}
		const start_l = this.tree.length;
		let nm_n = '';
		let nodes = -1;
		m = this.tree.length;
		this.expandedTracks = 0;
		this.expandLmt = lib.men.treeExpandLimit;
		while (m--) {
			if (this.tree[m].sel) {
				this.expandNodes(this.tree[m], !(!this.rootNode || m));
				nodes++;
			}
		}
		lib.sbar.setRows(this.tree.length);
		lib.panel.treePaint();
		if (nm) {
			this.tree.some((v, i, arr) => {
				nm_n = (v.level ? arr[v.par].srt[0] : '') + v.srt[0];
				nm_n = nm_n.toUpperCase();
				if (nm_n == nm) {
					h = i;
					return true;
				}
			});
		} else {
			this.tree.some((v, i) => {
				if (v.sel) {
					h = i;
					return true;
				}
			});
		}
		const new_items = this.tree.length - start_l + nodes;
		const b = Math.round(lib.sbar.scroll / lib.ui.row.h + 0.4);
		const n = Math.max(h - b, this.rootNode ? 1 : 0);
		let scrollChk = false;
		if (n + 1 + new_items > this.rows) {
			scrollChk = true;
			if (new_items > this.rows - 2) lib.sbar.checkScroll(h * lib.ui.row.h);
			else lib.sbar.checkScroll(Math.min(h * lib.ui.row.h, (h + 1 - lib.sbar.rows_drawn + new_items) * lib.ui.row.h));
		}
		if (lib.sbar.scroll > h * lib.ui.row.h) {
			scrollChk = true;
			lib.sbar.checkScroll(h * lib.ui.row.h);
		}
		if (!scrollChk) lib.sbar.scrollRound();
		lib.lib.treeState(false, libSet.rememberTree);
	}

	expandCollapse(x, y, item, ix) {
		const expanded = item.child.length > 0 ? 1 : 0;
		switch (expanded) {
			case 0: {
				let n = 0;
				if (libSet.autoCollapse) {
					n = this.branchChange(item, false, true);
					lib.sbar.checkScroll(lib.sbar.scroll - n * lib.ui.row.h, 'step');
				}
				const row = this.getRowNumber(y);
				this.branch(item, !!item.root, true);
				if (!ix) lib.panel.setHeight(true);
				n = 2;
				if (item.child.length == 1 && libSet.treeAutoExpandSingle) {
					this.branch(item.child[0], false, true);
					n += item.child[0].child.length;
				}
				if (libSet.autoCollapse) ix = item.ix;
				if (row + n + item.child.length > this.rows) {
					if (item.child.length > (this.rows - n)) lib.sbar.checkScroll(ix * lib.ui.row.h);
					else lib.sbar.checkScroll(Math.min(ix * lib.ui.row.h, (ix + n - lib.sbar.rows_drawn + item.child.length) * lib.ui.row.h));
				}
				break;
			}
			case 1: {
				this.clearChild(item);
				if (!ix && this.tree.length == 1) lib.panel.setHeight(false);
				const b = $Lib.clamp(Math.round(lib.sbar.delta / lib.ui.row.h + 0.4), 0, this.tree.length - 1);
				const f = Math.min(b + lib.panel.rows, this.tree.length);
				if (f - b < lib.panel.rows) lib.sbar.checkScroll((this.tree.length - lib.panel.rows) * lib.ui.row.h);
				break;
			}
		}
		if (lib.sbar.scroll > ix * lib.ui.row.h) lib.sbar.checkScroll(ix * lib.ui.row.h);
	}

	expandNodes(obj, am) {
		this.branch(obj, !!am, true, true);
		if (obj.child) {
			obj.child.some(v => {
				if (v.track) this.expandedTracks++;
				if (this.expandedTracks >= this.expandLmt) return true;
				if (!v.track) this.expandNodes(v);
			});
		}
	}

	fixMarkers(n) {
		while (n.includes('@!##!#')) { // $colour
			n = n.replace('@!##!#', '<!>');
			n = n.replace('@!#', '~#~');
		}
		n = n.replace(/<!>/g, '@!##!#').replace(/~#~/g, '#!#@!#');

		while (n.includes('#@##!#')) { // $nodisplay
			n = n.replace('#@##!#', '<!>');
			n = n.replace('#@#', '~#~');
		}
		n = n.replace(/<!>/g, '#@##!#').replace(/~#~/g, '#!##@#');
		return n;
	}

	focusShow(i) {
		this.setTreeSel(i);
		lib.panel.treePaint();
		this.showItem(i);
	}

	formatBytes(bytes, decimals = 1) {
		if (!+bytes) return '0 Bytes'

		const k = 1024
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

		const i = Math.floor(Math.log(bytes) / Math.log(k))

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
	}

	getAllCombinations(n) {
		n = this.fixMarkers(n);
		return n.includes('^@^') && n.includes(lib.panel.softSplitter) ? this.imgView(n) : this.getCombos(n);
	}

	getCombos(n) {
		const combinations = [];
		const divisors = [];
		const arraysToCombine = [];
		n = n.replace(RegExp(`(#!#|)${lib.panel.softSplitter}(#!#|)`, 'g'), '@@').split('#!#');
		const ln = n.length;
		let i = 0;
		for (i = 0; i < ln; i++) {
			n[i] = n[i].split('@@');
			if (n[i] != '') arraysToCombine.push(n[i]);
		}
		const arraysToCombineLength = arraysToCombine.length;
		for (i = arraysToCombineLength - 1; i >= 0; i--) divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
		const getPermutation = (n, arraysToCombine) => {
			const result = [];
			let cur_array;
			for (let j = 0; j < arraysToCombineLength; j++) {
				cur_array = arraysToCombine[j];
				result.push(cur_array[Math.floor(n / divisors[j]) % cur_array.length]);
			}
			return result;
		};
		let numPerms = arraysToCombine[0].length;
		for (i = 1; i < arraysToCombineLength; i++) numPerms *= arraysToCombine[i].length;
		for (i = 0; i < numPerms; i++) combinations.push(getPermutation(i, arraysToCombine));
		return this.removeDuplicateArr(combinations);
	}

	getChildCount(arr, ix) {
		arr.forEach(v => {
			if (v.child && ix > v.ix) {
				this.childCount += v.child.length;
				if (!v.track) this.getChildCount(v.child, ix);
			}
		});
	}

	getItemCount(v) {
		const prop = !lib.panel.imgView ? 'statistics' : '_statistics';
		if (this.statisticsShow && v[prop] == null) v[prop] = v.root && this.label && !lib.panel.imgView ? this.label : this.calcStatistics(v);
		if (v.count === '' && this.nodeCounts) {
			if (!lib.panel.imgView) {
				if (v.root && this.label) {
					if (!this.statisticsShow) v.count = this.label;
				} else {
					const type = lib.panel.search.txt ? 'search' : libSet.filterBy ? 'filter' : 'standard';
					const key = this.getKey(v);
					v.count = !v.track || !this.showTracks ? (v.name ? ' ' : '') + (this.nodeCounts == 1 ? `(${this.trackCount(v.item)})` : this.nodeCounts == 2 ? `(${this.branchCount(v, !!v.root, true, false, key, type)})` : '') : '';
					if (!this.showTracks && v.count == `${v.name ? ' ' : ''}(0)`) v.count = '';
					if (this.countsRight && !this.statisticsShow) v.count = v.count.replace(/[()]/g, '');
				}
			} else {
				const getTracks = [true, true, true, true, false, false, true, false, false, false, false][libSet.itemShowStatistics];
				if (getTracks) {
					v.count = this.trackCount(v.item);
					v.count += v.count > 1 ? ' tracks' : ' track';
				}
				const getItemCount = !v.root && libSet.itemOverlayType != 1 && libSet.albumArtLabelType == 2 && !libSet.itemShowStatistics && (lib.pop.nodeCounts == 1 || lib.pop.nodeCounts == 2);
				if (getItemCount) {
					const count = v.count.replace(/\D/g, '');
					if (lib.panel.lines == 1 || libSet.albumArtFlipLabels) v.grp += ` (${count})`;
					else v.lot += ` (${count})`;
				}
			}
		}
	}

	getHandleList(n) {
		if (n == 'newItems') this.getTreeSel();
		const handleList = new FbMetadbHandleList();
		this.sel_items.some(v => {
			if (v >= lib.panel.list.Count) return true;
			handleList.Add(lib.panel.list[v]);
		});
		return handleList;
	}

	get_ix(x, y, simple, type) {
		let ix;
		y -= lib.ui.y - 1; // - 1 = workaround to adjust and fix background color selection ( text_nowp in drawNode() ) to draw correct colored nodes in tree when option "Nowplaying in highlight" is active
		x -= lib.ui.x;
		if (lib.panel.imgView) {
			if (y > libImg.panel.y && y < libImg.panel.y + libImg.panel.h && x > libImg.panel.x && x < libImg.panel.x + libImg.panel.w) {
				const row_ix = libImg.style.vertical ? Math.ceil((y + lib.sbar.delta - libImg.panel.y) / libImg.row.h) - 1 : 0;
				const column_ix = libImg.style.vertical ? (!libImg.labels.right && !libSet.albumArtFlowMode ? Math.ceil((x - libImg.panel.x) / libImg.columnWidth) - 1 : 0) : Math.ceil((x + lib.sbar.delta - libImg.panel.x) / libImg.columnWidth) - 1;
				ix = (row_ix * libImg.columns) + column_ix;
				return ix > this.tree.length - 1 ? -1 : ix;
			}
			return -1;
		}
		ix = y > lib.panel.tree.y && y < lib.panel.tree.y + this.rows * lib.ui.row.h ? Math.round((y + lib.sbar.delta - lib.panel.search.h - lib.ui.row.h * 0.5) / lib.ui.row.h) : -1;
		if (simple) return ix;
		return this.tree.length > ix && ix >= 0 && x < lib.panel.tree.w && y > lib.panel.tree.y && y < lib.panel.tree.y + this.rows * lib.ui.row.h && this.check_ix(this.tree[ix], x + lib.ui.x, y + lib.ui.y, type) ? ix : -1;
	}

	getKey(v) {
		const level = v.level;
		const o = {
			a: v.nm || '',
			b: level != 0 ? this.tree[v.par].nm : '',
			c: level > 1 ? this.tree[this.tree[v.par].par].nm : '',
			d: level > 2 ? this.tree[this.tree[this.tree[v.par].par].par].nm : ''
		}
		return level + (level > 2 ? o.d : '') + (level > 1 ? o.c : '') + (level > 0 ? o.b : '') + o.a;
	}

	getNowplaying(handle, stop) {
		if (stop) {
			lib.panel.treePaint();
			return this.nowp = -1;
		}
		if (!handle && fb.IsPlaying) handle = fb.GetNowPlaying();
		if (!handle) return this.nowp = -1;
		this.nowp = lib.panel.list.Find(handle);
		lib.panel.treePaint();
	}

	getNumbers(arr) { // test [0, '0', "0", "0.5", 10, '10', "", '', '-', null, true, false, 'Oh']
		return arr.filter(v => Number(v)); // gives ["0.5", 10, "10", true]
		//return arr.filter(v => parseFloat(v) == v); // gives [0, "0", "0", "0.5", 10, "10"]
		//return arr.filter(v => Number(v) && parseFloat(v) == v); // gives ["0.5", 10, "10"]
	}

	getRowNumber(y) {
		return Math.round((y - lib.panel.tree.y - lib.ui.row.h * 0.5) / lib.ui.row.h);
	}

	getTreeSel() {
		lib.panel.treePaint();
		this.sel_items = [];
		this.tree.forEach(v => {
			if (v.sel) this.addItems(this.sel_items, v.item);
		});
		this.uniq(this.sel_items);
	}

	imgView(n) {
		let a; let b; const c = [];
		n = n.split('^@^');
		if (n[0]) a = this.getCombos(n[0]);
		if (n[1]) b = this.getCombos(n[1]);
		a.forEach(v => b.forEach(w => c.push([`${v.join('')}^@^${w.join('')}`])));
		return this.removeDuplicateArr(c);
	}

	isDate(n) {
		return isNaN(n) && !isNaN(Date.parse(n));
	}

	inRange(num, item) {
		return item.some(v => {
			const end = v.end;
			const start = v.start;
			return num >= Math.min(start, end) && num <= Math.max(start, end);
		});
	}

	lbtn_dblclk(x, y) {
		if (this.autoPlay.click > 2 && libSet.libSource) return;
		if (lib.vk.k('alt')) {
			this.mbtnDblClickOrAltDblClick(x, y, '', 'alt');
			return;
		}
		this.dbl_clicked = true;
		if (y < lib.panel.search.h) return;
		const ix = this.get_ix(x, y, true, false);
		if (ix >= this.tree.length || ix < 0) return;
		const item = this.tree[ix];
		switch (this.clicked_on) {
			case 'node':
				this.expandCollapse(x, y, item, ix);
				break;
			case 'text':
				if (!this.check_ix(item, x, y, false)) return;
				if (this.dblClickAction == 3) {
					const handleList = new FbMetadbHandleList();
					this.range(item.item).forEach(v => {
						if (v < lib.panel.list.Count) handleList.Add(lib.panel.list[v]);
					});
					if (handleList.Count) plman.FlushPlaybackQueue();
					for (let i = 0; i < handleList.Count; i++) {
						plman.AddItemToPlaybackQueue(handleList[i]);
					}
					fb.Play();
					return;
				}
				if (!libSet.libSource) {
					plman.ExecutePlaylistDefaultAction($Lib.pl_active, this.range(item.item)[0]);
					return;
				}
				if (!this.dblClickAction && !this.autoFill.mouse && !this.autoPlay.click) return this.send(item, x, y);
				if (this.dblClickAction === 2 && !item.track && !lib.panel.imgView) {
					this.expandCollapse(x, y, item, ix);
					lib.lib.treeState(false, libSet.rememberTree);
				}
				if (!this.dblClickAction || this.autoPlay.click === 2) return;
				if (this.dblClickAction !== 2 && this.dblClickAction !== 3 || this.dblClickAction === 2 && item.track || this.dblClickAction === 2 && lib.panel.imgView) {
					if (!this.autoFill.mouse) this.send(item, x, y);
					let pl_stnd_idx = plman.FindOrCreatePlaylist(libSet.libPlaylist.replace(/%view_name%/i, lib.panel.viewName), false);
					if (libSet.sendToCur) pl_stnd_idx = plman.ActivePlaylist;
					else plman.ActivePlaylist = pl_stnd_idx;
					plman.ActivePlaylist = pl_stnd_idx;
					const c = (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4) ? Math.ceil(plman.PlaylistItemCount(pl_stnd_idx) * Math.random() - 1) : 0;
					plman.ExecutePlaylistDefaultAction(pl_stnd_idx, c);
				}
				if (libSet.dblClickAction === 3) {
					if (plman.PlaylistItemCount(plman.ActivePlaylist) <= 0) {
						lib.panel.pos = 0;
						this.setTreeSel(this.tree[lib.panel.pos].ix);
						this.setPlaylist(lib.panel.pos, this.tree[lib.panel.pos]);
						this.load(lib.panel.pos, true, true, true, false, false);
					}
					plman.ExecutePlaylistDefaultAction($Lib.pl_active, this.sel_items[0]);
					this.load(this.sel_items, true, false, true, false, false);
					if (!item.root) {
						setTimeout(() => { fb.RunMainMenuCommand('Edit/Undo'); }, 100);
					}
				}
				break;
		}
	}

	lbtn_dn(x, y) {
		this.lbtnDn = false;
		this.dbl_clicked = false;
		if (y < lib.panel.search.h) return;
		const ix = this.get_ix(x, y, true, false);
		if (ix >= this.tree.length || ix < 0) return;
		this.deactivateTooltip();
		if (libSet.touchControl) {
			lib.ui.id.dragDrop = lib.ui.id.touch_dn = ix;
		}
		const item = this.tree[ix];
		this.clicked_on = this.clickedOn(x, y, item);
		switch (this.clicked_on) {
			case 'node':
				lib.panel.pos = ix;
				this.expandCollapse(x, y, item, ix);
				this.checkRow(x, y);
				break;
			case 'text':
				this.last_pressed_coord.x = x - lib.ui.x;
				this.last_pressed_coord.y = y - lib.ui.y;
				this.lbtnDn = true;
				lib.panel.pos = ix;
				if (libSet.touchControl) break;
				if (lib.vk.k('alt')) {
					this.alt_dbl_clicked = false;
					if (libSet.altClickAction == 2) {
						return;
					}
					if (this.autoFill.mouse) return;
				}
				if (!item.sel && !lib.vk.k('ctrl')) this.setTreeSel(ix, item.sel);
				break;
		}
		lib.lib.treeState(false, libSet.rememberTree);
	}

	lbtn_up(x, y) {
		if (lib.lib.empty && libSet.libSource == 1 && !libSet.fixedPlaylist && y > lib.panel.search.h) fb.RunMainMenuCommand('Library/Configure');
		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};
		this.lbtnDn = false;
		if (y < lib.panel.search.h || x < lib.ui.x || this.dbl_clicked || lib.but.Dn) return;
		const ix = this.get_ix(x, y, true, false);
		lib.panel.pos = ix;
		if (ix >= this.tree.length || ix < 0) return;
		if (libSet.touchControl && (this.autoFill.mouse || this.autoPlay.click) && lib.ui.id.touch_dn != ix) return;
		const item = this.tree[ix];
		if (this.clicked_on != 'text') return;
		if (!libSet.libSource) return this.setPlaylistSelection(ix, item);
		if (lib.vk.k('alt')) {
			if (grSet.addTracksPlaylistSwitch) {
				grm.button.btn.library.enabled = false;
				grm.button.btn.library.changeState(ButtonState.Default);
				grm.ui.displayLibrary = false;
				grm.ui.displayPlaylist = true;
				if (!grSet.playlistAutoScrollNowPlaying) grm.ui.setPlaylistSize();
				setTimeout(() => {
					if (pl.playlist.is_scrollbar_available) {
						pl.playlist.scrollbar.scroll_to_end();
					}
				}, 500);
				window.Repaint();
			}
			this.mbtnUpOrAltClickUp(x, y, '', 'alt'); // {
			return;
		}
		if (!lib.vk.k('ctrl')) {
			this.clearSelected();
			if (!item.sel) this.setTreeSel(ix, item.sel);
		} else this.setTreeSel(ix, item.sel);
		if (this.autoFill.mouse || this.autoPlay.click) {
			window.Repaint(true);
			this.send(item, x, y);
		} else {
			lib.panel.treePaint();
		}
		this.track(this.autoFill.mouse || this.autoPlay.click);
		lib.lib.treeState(false, libSet.rememberTree);
	}

	leave() {
		this.deactivateTooltip();
		lib.panel.m.x = -1;
		lib.panel.m.y = -1;
		if (lib.men.r_up) return;
		this.m.br = -1;
		this.m.cur_br = 0;
		this.m.i = -1;
		this.cur_ix = 0;
		this.row.i = -1;
		this.row.cur = 0;
		lib.panel.treePaint();
	}

	leftKeyCheckScroll() {
		const row = (lib.panel.pos * lib.ui.row.h - lib.sbar.scroll) / lib.ui.row.h;
		if (lib.sbar.scroll > lib.panel.pos * lib.ui.row.h) lib.sbar.checkScroll(lib.panel.pos * lib.ui.row.h);
		else if (row - lib.sbar.rows_drawn > 0) {
		lib.sbar.checkScroll((lib.panel.pos + 3 - lib.sbar.rows_drawn) * lib.ui.row.h);
		}
		else lib.sbar.scrollRound();
		lib.lib.treeState(false, libSet.rememberTree);
	}

	load(list, isArray, add, autoPlay, def_pl, insert) {
		let np_item = -1;
		let pid = -1;
		const pl_stnd = libSet.libPlaylist.replace(/%view_name%/i, lib.panel.viewName);
		let pl_stnd_idx = plman.FindOrCreatePlaylist(pl_stnd, true);

		if (!def_pl && plman.ActivePlaylist != -1) pl_stnd_idx = plman.ActivePlaylist;
		else if (libSet.activateOnChange) plman.ActivePlaylist = pl_stnd_idx;

		if (autoPlay == 4 && plman.PlaylistItemCount(pl_stnd_idx) || autoPlay == 3 && fb.IsPlaying) {
			autoPlay = false;
			add = true;
		}
		const items = isArray ? this.getHandleList() : list.Clone();

		this.sortIfNeeded(items);
		this.selList = items.Clone();
		this.selection_holder.SetSelection(this.selList);
		const plnIsValid = pl_stnd_idx != -1 && pl_stnd_idx < plman.PlaylistCount;
		const pllockRemoveOrAdd = plnIsValid ? plman.GetPlaylistLockedActions(pl_stnd_idx).includes('RemoveItems') || plman.GetPlaylistLockedActions(pl_stnd_idx).includes('ReplaceItems') || plman.GetPlaylistLockedActions(pl_stnd_idx).includes('AddItems') : false;
		if (!add && pllockRemoveOrAdd) return;
		if (fb.IsPlaying && !add) {
			if (libSet.actionMode == 1) {
				const pl_playing = `${libSet.libPlaylist} (playing)`;
				const pl_playing_idx = plman.FindOrCreatePlaylist(pl_playing, false);
				if (plman.PlayingPlaylist == pl_stnd_idx) {
					plman.RenamePlaylist(pl_stnd_idx, pl_playing);
					plman.RenamePlaylist(pl_playing_idx, pl_stnd);
					plman.SetPlaylistSelection(pl_playing_idx, $Lib.range(0, plman.PlaylistItemCount(pl_playing_idx) - 1), true);
					plman.RemovePlaylistSelection(pl_playing_idx, false);
					plman.InsertPlaylistItems(pl_playing_idx, 0, items, false);
					plman.MovePlaylist(pl_playing_idx, pl_stnd_idx);
					plman.MovePlaylist(pl_stnd_idx + 1, pl_playing_idx);
				} else {
					plman.SetPlaylistSelection(pl_stnd_idx, $Lib.range(0, plman.PlaylistItemCount(pl_stnd_idx) - 1), true);
					plman.RemovePlaylistSelection(pl_stnd_idx, false);
					plman.InsertPlaylistItems(pl_stnd_idx, 0, items, false);
				}
				plman.ActivePlaylist = pl_stnd_idx;
			} else if (fb.GetNowPlaying()) {
				np_item = items.Find(fb.GetNowPlaying());
				let pl_chk = true;
				let np;
				if (np_item != -1) {
					np = plman.GetPlayingItemLocation();
					if (np.IsValid) {
						if (np.PlaylistIndex != pl_stnd_idx) pl_chk = false;
						else pid = np.PlaylistItemIndex;
					}
					if (pl_chk && pid == -1 && items.Count < 5000) {
						if (lib.ui.dui) plman.SetActivePlaylistContext();
						const start = Date.now();
						for (let i = 0; i < 20; i++) {
							if (Date.now() - start > 300) break;
							fb.RunMainMenuCommand('Edit/Undo');
							np = plman.GetPlayingItemLocation();
							if (np.IsValid) {
								pid = np.PlaylistItemIndex;
								if (pid != -1) break;
							}
						}
					}
				}
				if (pid != -1) {
					plman.ClearPlaylistSelection(pl_stnd_idx);
					plman.SetPlaylistSelectionSingle(pl_stnd_idx, pid, true);
					plman.RemovePlaylistSelection(pl_stnd_idx, true);
					const it = items.Clone();
					items.RemoveRange(np_item, items.Count);
					it.RemoveRange(0, np_item + 1);
					if (plman.PlaylistItemCount(pl_stnd_idx) < 5000) plman.UndoBackup(pl_stnd_idx);
					plman.InsertPlaylistItems(pl_stnd_idx, 0, items);
					plman.InsertPlaylistItems(pl_stnd_idx, plman.PlaylistItemCount(pl_stnd_idx), it);
				} else {
					if (plman.PlaylistItemCount(pl_stnd_idx) < 5000) plman.UndoBackup(pl_stnd_idx);
					plman.ClearPlaylist(pl_stnd_idx);
					plman.InsertPlaylistItems(pl_stnd_idx, 0, items);
				}
			}
		} else if (!add) {
			if (plman.PlaylistItemCount(pl_stnd_idx) < 5000) plman.UndoBackup(pl_stnd_idx);
			plman.ClearPlaylist(pl_stnd_idx);
			plman.InsertPlaylistItems(pl_stnd_idx, 0, items);
			plman.SetPlaylistFocusItem(pl_stnd_idx, 0);
		} else {
			if (plman.PlaylistItemCount(pl_stnd_idx) < 5000) plman.UndoBackup(pl_stnd_idx);
			plman.InsertPlaylistItems(pl_stnd_idx, !insert ? plman.PlaylistItemCount(pl_stnd_idx) : plman.GetPlaylistFocusItemIndex(pl_stnd_idx), items, true);
			const f_ix = !insert || plman.GetPlaylistFocusItemIndex(pl_stnd_idx) == -1 ? plman.PlaylistItemCount(pl_stnd_idx) - items.Count : plman.GetPlaylistFocusItemIndex(pl_stnd_idx) - items.Count;
			plman.SetPlaylistFocusItem(pl_stnd_idx, f_ix);
			plman.EnsurePlaylistItemVisible(pl_stnd_idx, f_ix);
		}
		if (autoPlay) {
			const c = (plman.PlaybackOrder == 3 || plman.PlaybackOrder == 4) ? Math.ceil(plman.PlaylistItemCount(pl_stnd_idx) * Math.random() - 1) : 0;
			plman.ExecutePlaylistDefaultAction(pl_stnd_idx, c);
		}
	}

	mbtn_dn() {
		this.mbtn_dbl_clicked = false;
	}

	mbtnDblClickOrAltDblClick(x, y, mask, type) {
		this[`${type}_dbl_clicked`] = true;
		if (type == 'mbtn' && (libSet.actionMode == 2 || libSet.mbtnClickAction == 2) || type == 'alt' && libSet.altClickAction == 2) {
			const ix = this.get_ix(x, y, true, false);
			if (ix < this.tree.length && ix >= 0) {
				const handleList = new FbMetadbHandleList();
				this.range(this.tree[ix].item).forEach(v => {
					if (v < lib.panel.list.Count) handleList.Add(lib.panel.list[v]);
				});
				const queueHandles = plman.GetPlaybackQueueHandles();
				let remove = [];
				for (let i = 0; i < handleList.Count; i++) {
					for (let k = 0; k < queueHandles.Count; k++) {
						if (handleList[i].Compare(queueHandles[k])) {
							remove.push(k);
						}
					}
				}
				remove = [...new Set(remove)];
				plman.RemoveItemsFromPlaybackQueue(remove);
			}
		}
	}

	mbtnUpOrAltClickUp(x, y, mask, type) {
		if (this[`${type}_dbl_clicked`]) return;
		if (type == 'mbtn' && (libSet.actionMode == 2 || libSet.mbtnClickAction == 2) || type == 'alt' && libSet.altClickAction == 2) {
			setTimeout(() => { // timeout: wait & see if double click, but adds a little lag to single click: timeout can be commented out
				if (this[`${type}_dbl_clicked`]) return;
				const ix = this.get_ix(x, y, true, false);
				if (ix < this.tree.length && ix >= 0) {
					const handleList = new FbMetadbHandleList();
					this.range(this.tree[ix].item).forEach(v => {
						if (v < lib.panel.list.Count) handleList.Add(lib.panel.list[v]);
					});
					const add = new FbMetadbHandleList();
					handleList.Convert().forEach(h => {
						let found = false;
						plman.GetPlaybackQueueHandles().Convert().forEach(q => {
							if (h.Compare(q)) found = true;
						});
						if (!found) add.Add(h);
					});
					const ap = plman.ActivePlaylist;
					const plItems = plman.GetPlaylistItems(ap);
					add.Convert().forEach(v => {
						const ix = plItems.Find(v);
						if (ix != -1) {
							plman.AddPlaylistItemToPlaybackQueue(ap, ix);
						} else plman.AddItemToPlaybackQueue(v);
					});
				}
			}, 180);
		} else {
			if (!libSet.libSource) return;
			this.add(x, y, !libSet[`${type}ClickAction`]);
		}
	}

	merge(m, mergeBrCount) {
		if (!libSet.libSource && !lib.panel.multiProcess) return;
		const seen = {};
		for (let i = 0; i < m.length; i++) {
			const v = m[i].srt[0].toUpperCase();
			if (seen[v] === undefined) seen[v] = i;
			else {
				if (!mergeBrCount) m[i].item.forEach(w => m[seen[v]].item.push(w));
				m.splice(i, 1);
				i--;
			}
		}
	}

	move(x, y) {
		if (lib.but.Dn) return;
		const ix = this.get_ix(x, y, false, false);
		this.row.i = this.checkRow(x, y);
		this.m.i = -1;
		if (ix != -1) {
			this.m.i = ix;
			this.check_tooltip(ix, x, y);
		} else if (this.countsRight || this.statisticsShow) {
			this.check_tooltip(this.row.i, x, y);
		} else this.deactivateTooltip();
		if (!libSet.mousePointerOnly) {
			if (this.highlight.node || lib.panel.imgView) {
				if (ix != -1 || this.inlineRoot && !this.m.br) this.hand = true;
			} else if (this.m.br != -1 && !(this.inlineRoot && !this.m.br)) this.hand = true;
		}
		SetCursor(this.hand ? 'Hand' : !lib.but.Dn && y > lib.ui.y && y < lib.ui.y + lib.panel.search.h && libSet.searchShow && x > lib.ui.x + lib.but.q.h + lib.but.margin && x < lib.panel.search.x + lib.panel.search.w ? 'IBeam' : 'Arrow');
		const same = this.m.i == this.cur_ix && this.m.br == this.m.cur_br && this.row.i == this.row.cur;
		if (same && !lib.sbar.touch.dn) return;
		if (!lib.sbar.draw_timer && !same) lib.panel.treePaint();
		this.cur_ix = this.m.i;
		this.m.cur_br = this.m.br;
		this.row.cur = this.row.i;
	}

	notifySelection(list) {
		if (list === undefined) list = this.getHandleList('newItems');
		window.NotifyOthers(window.Name, list);
		if (list.Count) return true;
	}

	nowPlayingShow() {
		if (this.nowp != -1) {
			let np_i = -1;
			for (let i = 0; i < this.tree.length; i++) {
				const v = this.tree[i];
				if (this.inRange(this.nowp, v.item)) {
					np_i = i;
					if (!v.root) {
						if (lib.panel.imgView) i = this.tree.length;
						else if (!v.track) this.branch(this.tree[np_i]);
					}
				}
			}
			if (!lib.panel.imgView && !this.tree[np_i].root) {
				this.clearSelected();
				if (!this.highlight.nowPlaying) this.tree[np_i].sel = true;
			}
			if (np_i != -1) this.showItem(np_i, 'np');
		}
	}

	numSort(a, b) {
		return a - b;
	}

	on_char(code) {
		if (lib.panel.search.active) return;
		switch (code) {
			case lib.vk.copy: {
				const handleList = this.getHandleList('newItems');
				fb.CopyHandleListToClipboard(handleList);
				break;
			}
			case lib.vk.selAll:
				this.tree.forEach(v => {
					if (!v.root) v.sel = true;
				});
				this.getTreeSel();
				if (!this.sel_items.length) return;
				this.setPlaylist();
				break;
			case lib.vk.eFocusSearch:
			case lib.vk.lFocusSearch:
				if (libSet.searchShow) lib.search.focus();
				break;
			case lib.vk.insert:
				this.getTreeSel();
				if (!this.sel_items.length) return;
				this.load(this.sel_items, true, true, false, false, true);
				break;
		}
	}

	on_focus(p_is_focused) {
		this.is_focused = p_is_focused;
		if (p_is_focused && this.selList && this.selList.Count) this.selection_holder.SetSelection(this.selList);
	}

	setPlaylist(ix, item) {
		if (libSet.libSource) {
			if (this.autoFill.key) this.load(this.sel_items, true, false, false, !libSet.sendToCur, false);
			this.track(true);
		} else if (this.autoFill.key) this.setPlaylistSelection(ix, item);
	}

	on_key_down(vkey) {
		if (vkey == lib.vk.collapseAll && !lib.panel.imgView) this.collapseAll();
		if (vkey == lib.vk.expand && !lib.panel.imgView) {
			const isSel = this.tree.some(v => v.sel);
			this.expand();
			if (isSel) {
				lib.panel.setHeight(true);
				this.checkAutoHeight();
			}
		}
		if (lib.panel.search.active) return;
		if (lib.vk.k('enter')) {
			if (!this.sel_items.length) return;
			if (!libSet.libSource) {
				if (this.autoPlay.send) plman.ExecutePlaylistDefaultAction($Lib.pl_active, this.sel_items[0]);
				return;
			}
			switch (true) {
				case lib.vk.k('shift'):
					return this.load(this.sel_items, true, true, false, false, false);
				case lib.vk.k('ctrl'):
					return this.sendToNewPlaylist();
				default:
					return this.load(this.sel_items, true, false, this.autoPlay.send, false, false);
			}
		}
		let item = -1;
		switch (vkey) {
			case lib.vk.left:
				if (lib.panel.imgView) lib.panel.pos -= 1;
				lib.panel.pos = $Lib.clamp(lib.panel.pos, 0, this.tree.length - 1);
				this.row.i = -1;
				this.m.i = -1;
				if (lib.panel.imgView) {
					item = this.tree[lib.panel.pos];
					this.m.i = lib.panel.pos;
					this.showItem(item.ix, 'left');
					this.setPlaylist(lib.panel.pos, item);
					break;
				}
				// !imgView
				if ((this.tree[lib.panel.pos].level == (this.rootNode ? 1 : 0)) && this.tree[lib.panel.pos].child.length < 1) {
					item = this.tree[lib.panel.pos];
					this.m.i = lib.panel.pos = item.ix;
					this.leftKeyCheckScroll();
					break;
				}
				if (this.tree[lib.panel.pos].child.length > 0) {
					item = this.tree[lib.panel.pos];
					this.clearChild(item);
					this.setTreeSel(item.ix);
					this.m.i = lib.panel.pos = item.ix;
				} else {
					item = this.tree[this.tree[lib.panel.pos].par];
					if (item) this.clearChild(item);
					this.setTreeSel(item.ix);
					this.m.i = lib.panel.pos = item.ix;
				}
				lib.panel.treePaint();
				this.setPlaylist(lib.panel.pos, item);
				lib.sbar.setRows(this.tree.length);
				this.leftKeyCheckScroll();
				break;
			case lib.vk.right: {
				if (lib.panel.imgView) lib.panel.pos += 1;
				lib.panel.pos = $Lib.clamp(lib.panel.pos, 0, this.tree.length - 1);
				this.row.i = -1;
				this.m.i = -1;
				item = this.tree[lib.panel.pos];
				if (lib.panel.imgView) {
					this.m.i = lib.panel.pos;
					this.showItem(item.ix, 'right');
					this.setPlaylist(lib.panel.pos, item);
					break;
				}
				// !imgView
				if (item.child.length) {
					lib.panel.pos++;
					lib.panel.pos = $Lib.clamp(lib.panel.pos, !this.rootNode ? 0 : 1, this.tree.length - 1);
					this.upDnKeyCheckScroll(vkey);
					break;
				}
				if (libSet.autoCollapse) this.branchChange(item, false, true);
				this.branch(item, !!item.root, true);
				let n = 2;
				if (item.child.length == 1 && libSet.treeAutoExpandSingle) {
					this.branch(item.child[0], false, true);
					n += item.child[0].child.length;
				}
				this.setTreeSel(item.ix);
				lib.panel.treePaint();
				this.m.i = lib.panel.pos = item.ix;
				this.setPlaylist(lib.panel.pos, item);
				lib.sbar.setRows(this.tree.length);
				const row = (lib.panel.pos * lib.ui.row.h - lib.sbar.scroll) / lib.ui.row.h;
				if (row + n + item.child.length > lib.sbar.rows_drawn || row < 0) {
					if (item.child.length > (lib.sbar.rows_drawn - n) || row < 0) lib.sbar.checkScroll(lib.panel.pos * lib.ui.row.h);
					else lib.sbar.checkScroll(Math.min(lib.panel.pos * lib.ui.row.h, (lib.panel.pos + n - lib.sbar.rows_drawn + item.child.length) * lib.ui.row.h));
				} else lib.sbar.scrollRound();
				lib.lib.treeState(false, libSet.rememberTree);
				break;
			}
			case lib.vk.pgUp:
				if (this.tree.length == 0) break;
				if (lib.panel.imgView) {
					lib.panel.pos = lib.panel.pos - libImg.columns * (lib.panel.rows - 1);
					lib.panel.pos = $Lib.clamp(lib.panel.pos, 0, this.tree.length - 1);
				} else lib.panel.pos = Math.max(Math.round(lib.sbar.scroll / lib.ui.row.h + 0.4) - Math.floor(lib.panel.rows) + 1, !this.rootNode ? 0 : 1);
				lib.sbar.pageThrottle(1);
				this.setTreeSel(this.tree[lib.panel.pos].ix);
				lib.panel.treePaint();
				this.setPlaylist(lib.panel.pos, this.tree[lib.panel.pos]);
				lib.lib.treeState(false, libSet.rememberTree);
				break;

			case lib.vk.pgDn:
				if (this.tree.length == 0) break;
				if (lib.panel.imgView) {
					lib.panel.pos = lib.panel.pos + libImg.columns * (lib.panel.rows - 1);
					lib.panel.pos = $Lib.clamp(lib.panel.pos, 0, this.tree.length - 1);
				} else lib.panel.pos = Math.min(Math.round(lib.sbar.scroll / lib.ui.row.h + 0.4) + Math.floor(lib.panel.rows) * 2 - 2, this.tree.length - 1);
				lib.sbar.pageThrottle(-1);
				this.setTreeSel(this.tree[lib.panel.pos].ix);
				lib.panel.treePaint();
				this.setPlaylist(lib.panel.pos, this.tree[lib.panel.pos]);
				lib.lib.treeState(false, libSet.rememberTree);
				break;
			case lib.vk.home:
				if (this.tree.length == 0) break;
				lib.panel.pos = !this.rootNode ? 0 : 1;
				lib.sbar.checkScroll(0, 'full');
				this.setTreeSel(this.tree[lib.panel.pos].ix);
				lib.panel.treePaint();
				this.setPlaylist(lib.panel.pos, this.tree[lib.panel.pos]);
				lib.lib.treeState(false, libSet.rememberTree);
				break;
			case lib.vk.end:
				if (this.tree.length == 0) break;
				lib.panel.pos = this.tree.length - 1;
				lib.sbar.scrollToEnd();
				this.setTreeSel(this.tree[lib.panel.pos].ix);
				lib.panel.treePaint();
				this.setPlaylist(lib.panel.pos, this.tree[lib.panel.pos]);
				lib.lib.treeState(false, libSet.rememberTree);
				break;
			case lib.vk.dn:
			case lib.vk.up:
				if (this.tree.length == 0) break;
				if ((lib.panel.pos == 0 && vkey == lib.vk.up) || (lib.panel.pos == this.tree.length - 1 && vkey == lib.vk.dn)) {
					this.setTreeSel(-1);
					break;
				}
				this.row.i = -1;
				this.m.i = -1;
				if (!lib.panel.imgView) {
					if (vkey == lib.vk.dn) lib.panel.pos++;
					if (vkey == lib.vk.up) lib.panel.pos--;
				} else {
					if (vkey == lib.vk.dn) lib.panel.pos += libImg.columns;
					if (vkey == lib.vk.up) lib.panel.pos -= libImg.columns;
				}
				lib.panel.pos = $Lib.clamp(lib.panel.pos, !this.rootNode ? 0 : 1, this.tree.length - 1);
				if (lib.panel.imgView) {
					item = this.tree[lib.panel.pos];
					this.m.i = lib.panel.pos;
					this.showItem(item.ix, vkey == lib.vk.up ? 'up' : 'down');
					this.setPlaylist(lib.panel.pos, item);
					return;
				}
				this.upDnKeyCheckScroll(vkey);
				break;
		}
	}

	on_main_menu(index) {
		if (index == this.getMainMenuIndex.add) {
			this.getTreeSel();
			if (!this.sel_items.length) return;
			this.load(this.sel_items, true, true, false, false, false);
		}
		if (index == this.getMainMenuIndex.collapseAll) this.collapseAll();
		if (index == this.getMainMenuIndex.insert) {
			this.getTreeSel();
			if (!this.sel_items.length) return;
			this.load(this.sel_items, true, true, false, false, true);
		}
		if (index == this.getMainMenuIndex.new) {
			this.getTreeSel();
			if (!this.sel_items.length) return;
			this.sendToNewPlaylist();
		}
		if (index == this.getMainMenuIndex.searchClear && libSet.searchShow) lib.search.clear();
		if (index == this.getMainMenuIndex.searchFocus && this.is_focused && libSet.searchShow) lib.search.focus();
	}

	range(item) {
		const items = [];
		item.forEach(v => {
			for (let i = v.start; i <= v.end; i++) items.push(i);
		});
		return items;
	}

	removeDuplicateArr(arr) {
		const t = {};
		return arr.filter(v => !(t[v] = v in t));
	}

	send(item, x, y) {
		if (!this.check_ix(item, x, y, false)) return;
		if (lib.vk.k('ctrl') || lib.vk.k('shift')) this.load(this.sel_items, true, false, false, !libSet.sendToCur, false);
		else this.load(this.sel_items, true, false, this.autoPlay.click, !libSet.sendToCur, false);
	}

	sendToNewPlaylist() {
		const names = this.tree.filter(v => v.sel).map(v => v.name);
		plman.ActivePlaylist = plman.CreatePlaylist(plman.PlaylistCount, [...new Set(names)].join('; '));
		this.load(this.sel_items, true, false, this.autoPlay.send, false, false);
	}

	setActions() {
		this.autoPlay = {
			click: libSet.clickAction < 2 ? false : libSet.clickAction,
			send: libSet.autoPlay
		};
		this.autoFill = {
			mouse: libSet.actionMode == 2 ? false : libSet.clickAction == 1 || libSet.actionMode == 1,
			key: libSet.keyAction
		};
		this.dblClickAction = libSet.actionMode == 1 ? 1 : libSet.actionMode == 2 ? 3 : libSet.dblClickAction;
	}

	setPlaylistSelection(ix, item) {
		this.clearSelected();
		if (!item.sel) this.setTreeSel(ix, item.sel);
		lib.panel.treePaint();
		plman.ClearPlaylistSelection($Lib.pl_active);
		let items = [];
		if (lib.panel.search.txt || libSet.filterBy || lib.panel.multiProcess) {
			const hl = this.getHandleList();
			hl.Convert().forEach(h => {
				const i = lib.lib.full_list.Find(h);
				if (i != -1) items.push(i);
		});
		} else {
			items = this.range(item.item);
		}
		plman.SetPlaylistSelection($Lib.pl_active, items, true);
		this.setFocus = true;
		plman.SetPlaylistFocusItem($Lib.pl_active, items[0]);
		this.track(false);
		lib.lib.treeState(false, libSet.rememberTree);
	}

	setPos(pos) {
		this.m.i = this.row.i = lib.panel.pos = pos;
	}

	setTreeSel(idx, state) {
		const sel_type = idx == -1 ? 0 : lib.vk.k('shift') && this.last_sel > -1 && libSet.libSource ? 1 : lib.vk.k('ctrl') ? 2 : !state ? 3 : 0;
		switch (sel_type) {
			case 0:
				this.clearSelected();
				this.sel_items = [];
				break;
			case 1: {
				const direction = (idx > this.last_sel) ? 1 : -1;
				if (!lib.vk.k('ctrl')) this.clearSelected();
				for (let i = this.last_sel; ; i += direction) {
					this.tree[i].sel = true;
					if (i == idx) break;
				}
				this.getTreeSel();
				lib.panel.treePaint();
				break;
			}
			case 2:
				this.tree[idx].sel = !this.tree[idx].sel;
				this.getTreeSel();
				this.last_sel = idx;
				break;
			case 3:
				this.sel_items = [];
				this.clearSelected();
				this.tree[idx].sel = true;
				this.addItems(this.sel_items, this.tree[idx].item);
				this.uniq(this.sel_items);
				this.last_sel = idx;
				break;
		}
	}

	setValues() {
		this.countsRight = libSet.countsRight;
		this.fullLineSelection = libSet.fullLineSelection;
		this.highlight = {
			node: libSet.highLightNode,
			nowPlaying: libSet.highLightNowplaying,
			nowPlayingIndicator: libSet.nowPlayingIndicator,
			nowPlayingSidemarker: libSet.nowPlayingSidemarker,
			nowPlayingShow: libSet.highLightNowplaying || libSet.nowPlayingIndicator || libSet.nowPlayingSidemarker,
			row: libSet.highLightRow,
			text: libSet.highLightText
		};
		this.iconVerticalPad = libSet.iconVerticalPad;
		this.nodeCounts = libSet.nodeCounts;
		this.nodeStyle = libSet.nodeStyle;
		this.rootNode = libSet.rootNode;
		this.rowStripes = libSet.rowStripes;
		this.sbarShow = libSet.sbarShow;
		this.showTracks = !libSet.facetView ? libSet.showTracks : false;
		this.statistics = ['', 'Bitrate', 'Duration', 'Total size', 'Rating', 'Popularity', 'Date', 'Queue', 'Playcount', 'First played', 'Last played', 'Added'];
		this.statisticsShow = libSet.itemShowStatistics;
		this.label = !libSet.labelStatistics ? '' : this.statisticsShow ? this.statistics[this.statisticsShow] : '';
		this.tooltipStatistics = libSet.tooltipStatistics;
		this.treeIndent = libSet.treeIndent;
		this.imgGetItemCount = libSet.itemOverlayType != 1 && libSet.albumArtLabelType == 2 && !this.statisticsShow && (this.nodeCounts == 1 || this.nodeCounts == 2);
	}

	showItem(i, type) {
		if (!lib.panel.imgView) {
			lib.sbar.checkScroll(i * lib.ui.row.h - Math.round(lib.sbar.rows_drawn / 2 - 1) * lib.ui.row.h, 'full');
			return;
		}
		this.m.i = -1;
		const b = $Lib.clamp(Math.round(lib.sbar.delta / lib.sbar.row.h), 0, lib.panel.rows - 1);
		const f = Math.min(b + Math.floor(libImg.panel.h / lib.sbar.row.h), lib.panel.rows);
		this.setTreeSel(i);
		lib.panel.treePaint();
		const row1 = Math.floor(i / (libImg.style.vertical ? libImg.columns : 1));
		if (row1 <= b || row1 >= f) {
			switch (type) {
				case 'np':
				case 'focus': {
					const delta = (libImg.style.vertical ? libImg.panel.h : libImg.panel.w) / 2 > lib.sbar.row.h ? Math.floor((libImg.style.vertical ? libImg.panel.h : libImg.panel.w) / 2) : 0;
					const deltaRows = Math.floor(delta / lib.sbar.row.h) * lib.sbar.row.h;
					lib.sbar.checkScroll((libImg.style.vertical ? row1 : i) * lib.sbar.row.h - deltaRows, 'full');
					break;
				}
				case 'up':
				case 'down':
				case 'left':
				case 'right': {
					const row2 = (row1 * lib.sbar.row.h - lib.sbar.scroll) / lib.sbar.row.h;
					if (lib.sbar.rows_drawn - row2 < 1 || row2 < 0) lib.sbar.checkScroll((row1 + 1) * lib.sbar.row.h - lib.sbar.rows_drawn * lib.sbar.row.h);
					else if (row2 < 1 & (type == 'up' || type == 'left')) lib.sbar.checkScroll(row1 * lib.sbar.row.h);
				}
			}
		}
		lib.lib.treeState(false, libSet.rememberTree);
	}


	sort(data) {
		if (!libSet.libSource && !lib.panel.multiProcess) return;
		this.specialCharSort(data);

		if (lib.panel.folderView) { // Handle sorting for View By Folder Structure
			this.sortViewByFolder(data);
		} else { // Default sorting for other views
			data.sort((a, b) => this.collator.compare(a.srt[2], b.srt[2]) || (a.srt[3] && !b.srt[3] ? 1 : 0));
		}
	}

	sortIfNeeded(items) {
		if (lib.panel.multiProcess && !libSet.customSort.length) items.OrderByFormat(lib.panel.playlistSort, 1);
		else if (libSet.customSort.length) items.OrderByFormat(this.customSort, 1);
	}

	sortViewByFolder(data) {
		const getNumber = (name) => { // TODO: WilB - move to Libs helper collection
			const match = name.match(/^(\d+\.\d{1,2}|\d+)(?:[-_\s#.:=+]|\b)(.*)/);
			if (!match) return { number: null, rest: name };
			return { number: parseFloat(match[1]), rest: match[2] };
		};

		data.sort((a, b) => {
			const { number: numA, rest: restA } = getNumber(a.srt[0]);
			const { number: numB, rest: restB } = getNumber(b.srt[0]);

			// Compare numerical prefixes if both exist
			if (numA !== null && numB !== null) {
				const numCompare = numA - numB;
				if (numCompare !== 0) return numCompare;
				return this.collator.compare(restA, restB);
			}

			// If only one has a number, it comes first
			if (numA !== null) return -1;
			if (numB !== null) return 1;

			return this.collator.compare(a.srt[2], b.srt[2]) || (a.srt[3] && !b.srt[3] ? 1 : 0);
		});
	}

	specialCharHas(name) {
		return RegExp(this.specialChar).test(name);
	}

	specialCharIsLeading(name) {
		return RegExp(`^${this.specialChar}`).test(name);
	}

	specialCharPad(name) {
		return name.replace(RegExp(`${this.specialChar}+`, 'g'), v => (`${v}    `).slice(0, 5));
	}

	specialCharSort(data) {
		const removed = [];
		const filtered = data.filter((v, i) => {
			const f = this.specialCharHas(v.srt[0]);
			if (f) {
				v.srt[1] = this.specialCharPad(v.srt[0]);
				v.srt[2] = this.specialCharStrip(v.srt[0]);
				v.srt[3] = this.specialCharIsLeading(v.srt[0]);
				removed.push(i);
			}
			return f;
		});
		removed.reverse();
		removed.forEach(v => data.splice(v, 1));
		const sorted = filtered.sort((a, b) => this.collator.compare(a.srt[1], b.srt[1]));
		sorted.forEach(v => data.push(v));
	}

	specialCharStrip(name) {
		let [str1, ...str2] = name.split(' ');
		str2 = str2.join(' ');
		if (this.isDate(str1)) return `${str1} ${str2.replace(RegExp(this.specialChar, 'g'), '')}`;
		return name.replace(RegExp(this.specialChar, 'g'), '');
	}

	track(plLoaded) {
		const list = this.getHandleList();
		this.notifySelection(list);
		if (!plLoaded) this.selection_holder.SetSelection(list);
	}

	trackCount(item) {
		return item.reduce((a, b) => a + b.count, 0);
	}

	treeTooltipFont() {
		const libraryFontSize = SCALE((RES._4K ? grSet.libraryFontSize_layout - 0 : grSet.libraryFontSize_layout) || 14);
		return !lib.panel.imgView ? [lib.ui.font.main.Name, /* ui.font.main.Size */ libraryFontSize + 3, lib.ui.font.main.Style] : [lib.ui.font.group.Name, /* ui.font.group.Size */ libraryFontSize + 3, lib.ui.font.group.Style];
	}

	uniq(arr) {
		this.sel_items = [...new Set(arr)].sort(this.numSort);
	}

	upDnKeyCheckScroll(vkey) {
		const row = (lib.panel.pos * lib.ui.row.h - lib.sbar.scroll) / lib.ui.row.h;
		if (lib.sbar.rows_drawn - row < 3 || row < 0) lib.sbar.checkScroll((lib.panel.pos + 3) * lib.ui.row.h - lib.sbar.rows_drawn * lib.ui.row.h);
		else if (row < 2 && vkey == lib.vk.up) lib.sbar.checkScroll((lib.panel.pos - 1) * lib.ui.row.h);
		this.m.i = lib.panel.pos;
		this.setTreeSel(lib.panel.pos);
		lib.panel.treePaint();
		this.setPlaylist(lib.panel.pos, this.tree[lib.panel.pos]);
		lib.lib.treeState(false, libSet.rememberTree);
	}
}
