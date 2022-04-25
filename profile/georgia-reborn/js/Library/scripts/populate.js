class Populate {
	constructor() {
		this.childCount = 0;
		this.clicked_on = 'none';
		this.cur = [];
		this.cur_ix = 0;
		this.customSort = FbTitleFormat(ppt.customSort);
		this.dbl_clicked = false;
		this.expandedTracks = 0;
		this.expandLmt = 500;
		this.hotKeys = $Lib.split(ppt.hotKeys, 0);
		this.hand = false;
		this.id = '';
		this.inlineRoot = ppt.rootNode && ppt.inlineRoot;
		this.is_focused = false;
		this.last_sel = -1;
		this.lbtnDn = false;
		this.libItems = false;
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

		this.highlight = {}

		this.getMainMenuIndex = {
			add: parseFloat(this.hotKeys[3]),
			collapseAll: parseFloat(this.hotKeys[1]),
			insert: parseFloat(this.hotKeys[5]),
			new: parseFloat(this.hotKeys[7]),
			searchClear: parseFloat(this.hotKeys[11]),
			searchFocus: parseFloat(this.hotKeys[9])
		}

		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		}

		this.m = {
			br: -1,
			cur_br: 0,
			i: -1
		}

		this.row = {
			cur: 0,
			i: -1
		}

		this.subCounts = {
			'standard': {},
			'filter': {},
			'search': {}
		}

		this.triangle = {
			expand: null,
			highlight: null,
			select: null
		}

		this.collator = new Intl.Collator(undefined, {
			sensitivity: 'accent',
			numeric: true
		});

		this.setActions();
		this.setValues();
	}

	// Methods

	activateTooltip(value) {
		if (!ppt.tooltips) return; // Option Show tooltips on/off
		if (tooltipLib.Text == value) return;
		this.checkTooltipFont('tree');
		tooltipLib.Text = value;
		tooltipLib.Activate();
	}

	add(x, y, pl) {
		if (y < panel.search.h) return;
		const ix = this.get_ix(x, y, true, false);
		panel.pos = ix;
		if (ix < this.tree.length && ix >= 0)
			if (this.check_ix(this.tree[ix], x, y, true)) {
				this.clearSelected();
				this.tree[ix].sel = true;
				this.getTreeSel();
				this.load(this.sel_items, true, true, false, pl, false);
				lib.treeState(false, ppt.rememberTree);
			}
	}

	addItems(arr, item) {
		item.forEach(v => {
			for (let i = v.start; i <= v.end; i++) arr.push(i);
		});
	}

	branch(br, base, node, block) {
		if (!br || br.track) return;
		const ix = this.showTracks ? 2 : 3;
		const l = base ? 0 : this.rootNode ? br.tr : br.tr + 1;
		if (base) node = false;
		let i = 0;
		let n = '';
		let n_o = '#get_branch#';
		let nU = '';
		this.range(br.item).forEach(v => {
			n = lib.node[v][l];
			nU = n.toUpperCase();
			if (n_o != nU) {
				n_o = nU;
				if (panel.multiPrefix) n = lib.prefixes(n);
				br.child[i] = {
					nm: n,
					sel: false,
					child: [],
					track: l > lib.node[v].length - ix,
					item: [v],
					srt: lib.sort(n)
				};
				i++;
			} else br.child[i - 1].item.push(v);
		});
		this.condense(br.child);
		this.buildTree(lib.root, 0, node, true, block);
	}

	branchChange(br) {
		const arr = br.tr == 0 ? lib.root : this.tree[br.par].child;
		this.childCount = 0;
		this.getChildCount(arr, br.ix);
		arr.forEach(v => v.child = []);
		return this.childCount;
	}

	branchCount(br, base, node, block, key, type) {
		if (!br || !lib.node.length) return;
		if (this.subCounts[type][key]) return this.subCounts[type][key];
		const l = base ? 0 : this.rootNode ? br.tr : br.tr + 1;
		const b = [];
		let n = '';
		let n_o = '#get_branch#';
		let nU = '';
		if (base) node = false;
		const full = !br.root ? false : true;
		this.range(br.item).forEach(v => {
			if (l < lib.node[v].length) {
				n = lib.node[v][l];
				nU = n.toUpperCase();
				if (n_o != nU) {
					n_o = nU;
					if (panel.multiPrefix) n = lib.prefixes(n);
					b.push({
						nm: n,
						srt: lib.sort(n)
					});
				}
			}
		});
		if (!panel.multiProcess && (!node || node && !full)) this.merge(b, true);
		if (panel.multiProcess) {
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
							srt: lib.sort(w.join(''))
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
					j++
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
		this.subCounts[type][key] = b.length;
		return b.length;
	}

	buildTree(br, tr, node, full, block) {
		const l = !this.rootNode ? tr : tr - 1;
		let i = 0;
		let j = 0;
		if (!br[0].sorted) {
			switch (panel.multiProcess) {
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
						if (v.nm.includes('@@') || v.nm.includes(panel.softSplitter)) {
							multi = this.getAllCombinations(v.nm);
							multi_rem.push(i);
							multi.forEach(w => {
								multi_obj.push({
									nm: w.join(''),
									item: this.copy(v.item),
									track: v.track,
									srt: lib.sort(w.join(''))
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
		const imgItemCounts = ppt.albumArtLabelType == 2 && panel.lines == 1 && (this.nodeCounts == 1 || this.nodeCounts == 2);
		const par = this.tree.length - 1;
		if (tr == 0) this.clearTree();
		let type;
		if (this.nodeCounts == 2) type = panel.search.txt ? 'search' : ppt.filterBy ? 'filter' : 'standard';
		br.forEach((v, i) => {
			j = this.tree.length;
			const item = this.tree[j] = v;
			item.top = !i ? true : false;
			item.bot = i == br_l - 1 ? true : false;
			item.ix = j;
			item.tr = tr;
			item.par = par;
			let pr;
			if (this.nodeCounts == 2 && tr > 1) pr = this.tree[par].par;
			switch (true) {
				case ppt.treeListView:
					if (!item.root) item.track = true;
					break;
				case l != -1 && !this.showTracks:
					this.range(item.item).some(v => {
						if (lib.node[v] && (lib.node[v].length == l + 1 || lib.node[v].length == l + 2)) return item.track = true;
					});
					break;
				case l == 0 && lib.node[item.item[0].start] && lib.node[item.item[0].start].length == 1:
					item.track = true;
					break;
			}
			if (ui.col.counts && (!item.track || !this.showTracks)) {
				const str = '@!#' + ui.col.counts + ',' + (this.highlight.text ? ui.col.text_h : ui.col.counts) + ',' + ui.col.textSel + '@!#';
				if (!item.nm.endsWith(str)) item.nm += str;
			}
			item.name = !panel.noDisplay ? item.nm : item.nm.replace(/#@#.*?#@#/g, '');
			if (!panel.imgView) {
				this.getItemCount(item, par, pr, tr, type);
				if (this.countsRight) item.count = item.count.replace(/[()]/g, '');
			} else if (ppt.itemOverlayType == 1) {
				item.count = this.trackCount(item.item);
				item.count += item.count > 1 ? ' tracks' : ' track';
			} else if (imgItemCounts) this.getItemCount(item, par, pr, tr, type);
			if (v.child.length > 0) this.buildTree(v.child, tr + 1, node, !item.root ? false : true);
		});
		if (this.rootNode == 3) this.tree[0].name = this.tree[0].child.length > 1 ? panel.rootName.replace('#^^^^#', this.tree[0].child.length) : panel.rootName1;
		if (!block) {
			sbar.setRows(this.tree.length);
			panel.treePaint();
		}
	}

	butTooltipFont() {
		return ['Segoe UI', 15 * $Lib.scale * ppt.zoomTooltipBut / 100, 0];
	}

	checkAutoHeight() {
		if (panel.pn_h_auto && !panel.imgView && ppt.pn_h == ppt.pn_h_min && this.tree[0]) this.clearChild(this.tree[0]);
	}

	check_ix(br, x, y, type) {
		if (panel.imgView) return true;
		if (!br) return false;
		x -= ui.x;
		const tr = !this.inlineRoot ? br.tr : Math.max(br.tr - 1, 0);
		const icon_w = this.inlineRoot && br.ix == 0 ? 0 : ui.icon.w + (!this.fullLineSelection ? ui.l.wf : 0);
		return type ? (x >= Math.round(this.treeIndent * tr + ui.sz.margin) && x < Math.round(this.treeIndent * tr + ui.sz.margin) + br.w + icon_w) :
			(x >= Math.round(this.treeIndent * tr + ui.sz.margin) + icon_w) && x < Math.min(Math.round(this.treeIndent * tr + ui.sz.margin) + icon_w + br.w, panel.tree.w);
	}

	checkNode(gr) {
		if (sbar.draw_timer || this.nodeStyle != 5) return;
		try {
			ui.style.symb.SetPartAndStateID(2, 1);
			ui.style.symb.SetPartAndStateID(2, 2);
			ui.style.symb.DrawThemeBackground(gr, -ui.sz.node, -ui.sz.node, ui.sz.node, ui.sz.node);
		} catch (e) {
			ppt.nodeStyle = 0;
			this.nodeStyle = 0;
		}
	}

	checkRow(x, y) {
		this.m.br = -1;
		const im = this.get_ix(x, y, true, false);
		if (im >= this.tree.length || im < 0) return -1;
		if (panel.imgView) return im;
		const item = this.tree[im];
		const tr = !this.inlineRoot ? item.tr : Math.max(item.tr - 1, 0);
		if (x < Math.round(this.treeIndent * tr) + ui.icon.w + ui.sz.margin + ui.x + ui.w && (!item.track || item.root)) this.m.br = im;
		return im;
	}

	check_tooltip(ix, x, y) {
		if (this.lbtnDn || sbar.draw_timer) return;
		const item = this.tree[ix];
		let text = '';
		if (!item) return;
		switch (true) {
			case !panel.imgView: {
				text = (!panel.colMarker ? item.name : item.name.replace(/@!#.*?@!#/g, '')) + (!this.countsRight ? item.count : '');
				if (text != tooltipLib.Text) this.deactivateTooltip();
				const trace = item.tt && item.tt.needed && x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y && y <= item.tt.y + ui.row.h;
				if (!trace) {
					this.deactivateTooltip();
					return;
				}
				break;
			}
			case panel.imgView: {
				let trace1 = false;
				let trace2 = false;
				tooltipLib.SetMaxWidth(800);
				if (!img.labels.hide) {
					if (!item.tt) {
						this.deactivateTooltip();
						return;
					}
					trace1 = x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y1 && y <= item.tt.y1 + img.text.h;
					trace2 = item.tt.y2 == -1 ? false : x >= item.tt.x && x <= item.tt.x + item.tt.w && y >= item.tt.y2 && y <= item.tt.y2 + img.text.h;
					text = trace1 || trace2 ? item.tt.text : '';
					if (text != tooltipLib.Text) this.deactivateTooltip();
					if (!trace1 && !trace2 || !item.tt[1] && !item.tt[2]) {
						this.deactivateTooltip();
						return;
					}
				} else {
					text = panel.lines == 2 ? !ppt.albumArtFlipLabels ? item.grp + '\n' + item.lot : item.lot + '\n' + item.grp : item.grp;
					if (panel.colMarker) text = text.replace(/@!#.*?@!#/g, '');
					if (text != tooltipLib.Text) this.deactivateTooltip();
				}
				break;
			}
		}
		this.activateTooltip(text);
		timer.tooltipLib();
	}

	checkTooltip(item, x, y, txt_w, w) {
		item.tt = {
			needed: txt_w > w,
			x: x,
			y: y,
			w: w
		}
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
		tooltipLib.SetFont(this.cur[0], this.cur[1], this.cur[2]);
	}

	clearSelected() {
		this.tree.forEach(v => v.sel = false);
	}

	clearTree() {
		if (panel.imgView && this.tree.length) img.trimCache(this.tree[0].key);
		this.tree = [];
	}

	clearChild(br) {
		br.child = [];
		this.buildTree(lib.root, 0, true, true);
	}

	clickedOn(x, y, item) {
		if (panel.imgView) return 'text';
		if (this.inlineRoot && item.ix == 0) return this.check_ix(item, x, y, false) ? 'text' : 'none';
		const tr = !this.inlineRoot ? item.tr : Math.max(item.tr - 1, 0);
		return x < ui.x + Math.round(this.treeIndent * tr) + ui.icon.w + ui.sz.margin ? 'node' : this.check_ix(item, x, y, false) ? 'text' : 'none';
	}

	collapseAll() {
		let ic = this.get_ix(ui.x, ui.y + panel.tree.y + ui.row.h / 2, true, false);
		if (ic >= this.tree.length || ic < 0) return;
		let j = this.tree[ic].tr;
		if (this.rootNode) j -= 1;
		if (this.tree[ic].tr != 0) {
			const par = this.tree[ic].par;
			const pr_pr = [];
			for (let m = 1; m < j + 1; m++) {
				if (m == 1) pr_pr[m] = par;
				else pr_pr[m] = this.tree[pr_pr[m - 1]].par;
				ic = pr_pr[m];
			}
		}
		const nm = this.tree[ic].srt[0].toUpperCase();
		this.tree.forEach(v => {
			if (!v.root) v.child = [];
		});
		this.buildTree(lib.root, 0);
		let scr_pos = false;
		this.tree.some((v, i) => {
			if (v.srt[0].toUpperCase() == nm) {
				sbar.checkScroll(i * ui.row.h);
				return scr_pos = true;
			}
		});
		if (!scr_pos) {
			sbar.reset();
			panel.treePaint();
		}
		lib.treeState(false, ppt.rememberTree);
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
		if (!ui.w || !ui.h) return;
		if (!this.nodeStyle) {
			const sz = ui.sz.node;
			const ln_w = Math.max(Math.floor(sz / 9), 1);
			let plus = true;
			let hot = false;
			let sy_w = ln_w;
			let x = 0;
			let y = 0;
			if (((sz - ln_w * 3) / 2) % 1 != 0) sy_w = ln_w > 1 ? ln_w - 1 : ln_w + 1;
			for (let j = 0; j < 4; j++) {
				this.nd[j] = $Lib.gr(sz, sz, true, g => {
					hot = j > 1 ? true : false;
					plus = !j || j == 2 ? true : false;
					if (pref.libraryDesign !== 'reborn') {
						g.FillSolidRect(x, y, sz, sz, RGB(145, 145, 145));
						if (!hot) g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, plus ? ui.col.icon_e[0] : ui.col.icon_c[0], plus ? ui.col.icon_e[1] : ui.col.icon_c[1], 1.0);
						else g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, ui.col.icon_h[0], ui.col.icon_h[1], 1.0);
						let x_o = [x, x + sz - ln_w, x, x + sz - ln_w];
						let y_o = [y, y, y + sz - ln_w, y + sz - ln_w];
						for (let i = 0; i < 4; i++) // g.FillSolidRect(x_o[i], y_o[i], ln_w, ln_w, RGB(186, 187, 188));
						if (pref.libraryDesign === 'traditional') g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
					}
					if (plus) g.FillSolidRect(Math.floor(x + (sz - sy_w) / 2), y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.col.iconPlus : ui.col.iconPlus_h);
					g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), Math.floor(y + (sz - sy_w) / 2), sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? (plus ? ui.col.iconMinus_e : ui.col.iconMinus_c) : ui.col.iconMinus_h);
				});
			}
		} else {
			let lightCol = ui.getSelCol(ui.col.icon_h, true) == 50;
			$Lib.gr(1, 1, false, g => {
				const h = this.nodeStyle != 5 ? g.CalcTextHeight('String', ui.icon.font) / 15 : g.CalcTextHeight('String', ui.font.main) / 20;
				this.sy_sz = Math.floor(Math.max(8 * ppt.zoomNode / 100 * h, 5));
			});

			const sz = Math.max(Math.round(this.sy_sz * 1.666667), 1)
			this.triangle.highlight = $Lib.gr(sz, sz, true, g => {
				g.SetSmoothingMode(4);
				g.FillPolygon(ui.col.icon_h, 1, [sz, 0, sz, sz, 0, sz]);
				g.SetSmoothingMode(0);
			});
			lightCol = ui.getSelCol(ui.col.icon_e, true) == 50;
			this.triangle.expand = $Lib.gr(sz, sz, true, g => {
				g.SetSmoothingMode(4);
				g.FillPolygon(ui.col.icon_e & (lightCol ? 0xC0ffffff : 0xBAffffff), 1, [sz, 0, sz, sz, 0, sz]);
				g.SetSmoothingMode(0);
			});
			this.triangle.select = $Lib.gr(sz, sz, true, g => {
				g.SetSmoothingMode(4);
				g.FillPolygon(ui.col.textSel & (lightCol ? 0xC0ffffff : 0xBAffffff), 1, [sz, 0, sz, sz, 0, sz]);
				g.SetSmoothingMode(0);
			});
		}
	}

	createRanges(arr) {
		const ret = [];
		let start, end;
		for (let i = 0; i < arr.length; i++) {
			start = end = arr[i];
			while (arr[i + 1] == end + 1) {
				end++;
				i++;
			}
			ret.push(start == end ? {
				start: start,
				end: start,
				count: 1
			} : {
				start: start,
				end: end,
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
		if (item[cus] && item[cus].id == this.id) {
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
					const next_text = text[i + 2] ? true : false;
					let ellipsis_corr = 0;
					let roomForEllipsis = true;
					if (next_text && cur_w < w && w - cur_w < ellipsisSpace) roomForEllipsis = false;
					if (!roomForEllipsis) {
						text[i + 2] = '';
						ellipsis_corr = ellipsisSpace;
					}
					col[i] = i > 0 ? (text[i - 1]).split('`') : (!panel.imgView || !img.labels.overlayDark ? ui.col.txtArr : [RGB(240, 240, 240), ui.col.text_h, ui.col.text]);
					col_x[i] = x;
					col_w[i] = w - x - ellipsis_corr > ellipsis_corr ? w - x - ellipsis_corr : w - x;
					x += w_arr[i];
				}
			});
			item[cus] = {
				id: this.id,
				txt: text,
				col: col,
				col_x: col_x,
				col_w: col_w,
				txt_w: w_arr
			}
		}
		text.forEach((v, i) => {
			if (i % 2 == 0 && text[i]) {
				gr.GdiDrawText(text[i], font, !np ? col[i][type] : ui.col.nowp, item_x + col_x[i], item_y, col_w[i], h, panel.lc);
			}
		});
	}

	deactivateTooltip() {
		if (!tooltipLib.Text || but.trace) return;
		tooltipLib.Text = '';
		but.tooltipLib.delay = false;
		tooltipLib.Deactivate();
	}

	dragDrop(x, y) {
		x -= ui.x; y -= ui.y;
		if (!this.lbtnDn) return;
		const drag_diff = !ppt.touchControl ? Math.sqrt((Math.pow(this.last_pressed_coord.x - x, 2) + Math.pow(this.last_pressed_coord.y - y, 2))) : Math.abs(x - this.last_pressed_coord.x);
		if (drag_diff > 7) {
			if (ppt.touchControl) {
				const ix = this.get_ix(x, y, true, false);
				const item = this.tree[ix];
				if (ui.id.dragDrop != ix || ix >= this.tree.length || ix < 0) return;
				if (!item.sel && !vk.k('ctrl')) this.setTreeSel(ix, item.sel);
			}
			this.last_pressed_coord = {
				x: undefined,
				y: undefined
			}
			const handleList = this.getHandleList('newItems');
			this.sortIfNeeded(handleList);
			fb.DoDragDrop(window.ID, handleList, handleList.Count ? 1 | 4 : 0);
			this.lbtnDn = false;
		}
	}

	draw(gr) {
		if (lib.empty) return gr.GdiDrawText(lib.empty, ui.font.main, ui.col.text, ui.x + ui.sz.margin, ui.y + panel.search.h, panel.tree.w, ui.row.h * 3, 0x00000004 | 0x00000400);
		if (!this.tree.length || !panel.draw) return gr.GdiDrawText(pop.libItems && !panel.search.txt && !ppt.filterBy && ppt.libSource ? 'Loading...' : lib.none, ui.font.main, ui.col.text, ui.x + ui.sz.margin, ui.y + panel.search.h, panel.tree.w, ui.row.h, 0x00000004 | 0x00000400);
		if (panel.imgView) return;
		const b = $Lib.clamp(Math.round(sbar.delta / ui.row.h + 0.4), 0, this.tree.length - 1);
		const f = Math.min(b + panel.rows, this.tree.length);
		const nowp_c = [];
		const row = [];
		const y1 = Math.round(panel.search.h - sbar.delta + panel.node_y) + Math.floor(ui.sz.node / 2);
		let i = 0;
		let item_x = 0;
		let item_y = 0;
		let nm = [];
		let sel_x = 0;
		let sel_w = 0;
		let tr = 0;
		this.checkNode(gr);
		if (!ui.style.squareNode) gr.SetTextRenderingHint(5);
		this.rows = 0;
		if (ui.style.squareNode && ui.col.line) {
			tr = !this.inlineRoot ? this.tree[b].tr : Math.max(this.tree[b].tr - 1, 0);
			for (let j = 0; j <= tr; j++) row[j] = b;
			if (tr > 0) {
				let top = this.tree[b].par;
				for (i = 1; i < tr; i++) top = this.tree[top].par;
				if (this.tree[top].bot) row[0] = undefined;
			}
		}
		for (i = b; i < f; i++) {
			const item = this.tree[i];
			nm[i] = item.name + (i || this.rootNode != 3 || this.nodeCounts == 1 && this.countsRight ? (!this.countsRight ? item.count : '') : '');
			if (item.id != this.id) {
				item.name_w = gr.CalcTextWidth(!panel.colMarker ? nm[i] : nm[i].replace(/@!#.*?@!#/g, ''), ui.font.main);
				item.count_w = this.countsRight ? gr.CalcTextWidth(item.count, ui.font.main) + (item.count ? ui.row.h * 0.2 : 0) : 0;
				if (!this.fullLineSelection) {
					item.w = item.name_w;
					item.id = this.id;
				}
			}
			tr = !this.inlineRoot ? item.tr : Math.max(item.tr - 1, 0);
			if (this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item)) nowp_c.push(i);
			item_y = Math.round(ui.y + ui.row.h * i + panel.search.h - sbar.delta);
			if (item_y < panel.filter.y) {
				// Draw line block needs to be here to fix line depth issue in traditional tree design
				if (ui.style.squareNode && ui.col.line) {
					if (item.top) row[tr] = i;
					const ff = sbar.rows_drawn == this.rows || i < sbar.rows_drawn ? f : f - 1;
					if (item.bot || i === ff - 1) {
						for (let level = (i === ff - 1 ? 0 : tr); level <= tr; level++) {
							if (row[level] !== undefined && (this.inlineRoot || !item.root)) {
								let start = row[level];
								let end = i + (item.bot && level === tr ? .5 : 1);
								if (item_y >= panel.filter.y) end -= 1;
								const l_x = Math.round(ui.x + this.treeIndent * level + ui.sz.margin) + Math.floor(ui.sz.node / 2) - ui.l.wf;
								let l_y = Math.round(ui.y + ui.row.h * start + panel.search.h - sbar.delta);
								let l_h = Math.ceil(ui.row.h * (end - start)) + ui.l.wc;
								if (!start) {
									l_y += ui.row.h / 2;
									l_h -= ui.row.h / 2;
								}
								if (!this.inlineRoot || item.tr) if (pref.libraryDesign === 'traditional') gr.FillSolidRect(l_x, l_y, ui.l.w, l_h, ui.col.line);
							}
						}
						if (item.bot) row[tr] = undefined;
					}
				}
				this.rows++;
				let bgColor = ui.col.bgSel;
				if ((item.sel || this.highlight.nowPlaying) && (ui.col.bgSel != 0 || col.primary != 0)) {
					const icon_w = !this.inlineRoot || i ? ui.icon.w : 0;
					item_x = Math.round(ui.x + this.treeIndent * tr + ui.sz.margin) + icon_w;
					sel_x = Math.round(item_x - ui.sz.sel);
					if (this.inlineRoot && !i) sel_x = Math.max(sel_x - ui.sz.sel, 0);
					sel_w = Math.min(item.name_w + ui.sz.sel * 2, ui.x + panel.tree.w - sel_x - item.count_w - 1);
					if (this.fullLineSelection) {
						sel_x = ui.x;
						sel_w = ui.x + panel.tree.sel.w /*- ui.l.w'*/ + scaleForDisplay(2);
					}
					if (!nowp_c.includes(i)) {
						if (this.fullLineSelection && this.sbarShow == 1 && ui.sbar.type == 2) {
							gr.FillSolidRect(sel_x, item_y, sel_w + ui.l.w, ui.row.h, bgColor);
							gr.FillSolidRect(sel_x, item_y, sel_w + ui.l.w, ui.l.w, ui.col.bgSelframe);
							gr.FillSolidRect(sel_x, item_y + ui.row.h, sel_w + ui.l.w, ui.l.w, ui.col.bgSelframe);
						}
						// else {
						// 	gr.FillSolidRect(sel_x, item_y, sel_w, ui.row.h, ui.col.bgSel);
						// 	gr.DrawRect(sel_x + Math.floor(ui.l.w / 2), item_y, sel_w, ui.row.h, ui.l.w, ui.col.bgSelframe);
						// }
					}
					// Now playing bg selection
					else if (this.highlight.nowPlaying) {
						bgColor = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : pref.rebornTheme || pref.randomTheme ? g_pl_colors.background != RGB(255, 255, 255) ? pref.themeStyleBlend && (pref.rebornTheme || pref.randomTheme) ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.darkMiddleAccent : col.primary : ui.col.nowPlayingBg;
						gr.FillSolidRect(pref.libraryDesign === 'traditional' ? item_x - scaleForDisplay(2) : ui.x, item_y, pref.libraryDesign === 'traditional' && this.fullLineSelection ? sel_w - item_x - ui.sz.margin - ui.sz.node + ui.l.w : pref.libraryDesign === 'traditional' && !this.fullLineSelection ? sel_w + sel_x - item_x + scaleForDisplay(2) : sel_w + ui.sz.margin + sel_x - ui.x - ui.sz.sideMarker, ui.row.h, bgColor);

						if (pref.libraryDesign !== 'traditional') {
							bgColor = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : pref.rebornTheme || pref.randomTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary : ui.col.sideMarker;
							gr.FillSolidRect(ui.x, item_y, ui.sz.sideMarker, ui.row.h, bgColor);
						}
					}
					// Marker selection with now playing active
					if (item.sel && this.highlight.nowPlaying) {
						if (pref.libraryDesign !== 'traditional') {
							gr.DrawRect(this.fullLineSelection ? sel_x : ui.x, item_y, this.fullLineSelection ? sel_w : sel_w + ui.sz.margin + sel_x - ui.x - ui.sz.sideMarker, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? ui.row.h - 1 : ui.row.h, 1, ui.col.selectionFrame);
							let sideMarker = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : ui.col.sideMarker;
							gr.FillSolidRect(ui.x, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? item_y + 1 : item_y, ui.sz.sideMarker, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? ui.row.h - 1 : ui.row.h + 1, sideMarker);

							// Hide DrawRect gaps when all songs are completely selected and mask lines when selecting now playing
							if (this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item)) {
								let frameColor = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : pref.rebornTheme || pref.randomTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : col.primary : ui.col.nowPlayingBg;
								gr.DrawRect(this.fullLineSelection ? sel_x : ui.x, item_y, this.fullLineSelection ? sel_w : sel_w + ui.sz.margin + sel_x - ui.x - ui.sz.sideMarker, ui.row.h - 1, 1, frameColor);
								let sideMarker = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : ui.col.sideMarker;
								gr.FillSolidRect(ui.x, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? item_y : item_y, ui.sz.sideMarker, this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? ui.row.h : ui.row.h + 1, sideMarker);
							}
						} else if (pref.libraryDesign === 'traditional') {
							let selColor = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : pref.rebornTheme || pref.randomTheme ? g_pl_colors.background != RGB(255, 255, 255) ? pref.themeStyleBlend && (pref.rebornTheme || pref.randomTheme) ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.lightAccent : col.primary : ui.col.nowPlayingBg;
							gr.FillSolidRect(item_x - scaleForDisplay(2), item_y, pref.libraryDesign === 'traditional' && this.fullLineSelection ? sel_w - item_x - ui.sz.margin - ui.sz.node + ui.l.w : sel_w, ui.row.h, selColor);
						}
					}
					// Marker selection with now playing deactivated
					if (item.sel && !this.highlight.nowPlaying) {
						bgColor = pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary : pref.rebornTheme || pref.randomTheme ? g_pl_colors.background != RGB(255, 255, 255) ? pref.themeStyleBlend && (pref.rebornTheme || pref.randomTheme) ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.lightAccent : col.primary : ui.col.nowPlayingBg;
						gr.FillSolidRect(pref.libraryDesign === 'traditional' && this.fullLineSelection ? item_x - scaleForDisplay(2) : sel_x, item_y, pref.libraryDesign === 'traditional' && this.fullLineSelection ? sel_w - item_x - ui.sz.margin - ui.sz.node + ui.l.w : sel_w, ui.row.h, bgColor);

						if (pref.libraryDesign !== 'traditional') {
							gr.FillSolidRect(ui.x, item_y, ui.sz.sideMarker, ui.row.h, ui.col.sideMarker);
						}
					}
				}
				if (this.rowStripes) {
					if (i % 2 == 0) gr.FillSolidRect(ui.x, item_y + 1, panel.tree.stripe.w, ui.row.h - 2, ui.col.bg1);
					else gr.FillSolidRect(ui.x, item_y, panel.tree.stripe.w, ui.row.h, ui.col.bg2);
				}
			}
		}
		for (i = b; i < f; i++) {
			const item = this.tree[i];
			const tr = !this.inlineRoot ? item.tr : Math.max(item.tr - 1, 0);
			let bgColor = item.sel || this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? col.primary : undefined;
			item_y = Math.round(ui.y + ui.row.h * i + panel.search.h - sbar.delta);
			if (item_y < panel.filter.y) {
				item_x = Math.round(ui.x + this.treeIndent * tr + ui.sz.margin);
				if (this.inlineRoot && !item.tr) item_x = ui.x + ui.sz.marginSearch;
				if ((this.fullLineSelection && this.row.i == i || this.m.i == i)) {
					sel_x = Math.round(item_x - ui.sz.sel);
					if (!this.inlineRoot || item.tr) sel_x += ui.icon.w;
					sel_w = Math.min(item.name_w + ui.sz.sel * 2, ui.x + panel.tree.w - sel_x - item.count_w - 1);
					if (this.fullLineSelection) {
						sel_x = ui.x;
						sel_w = ui.x + panel.tree.sel.w - ui.l.w;
					}
					if (this.highlight.row == 3) {
						// gr.FillSolidRect(sel_x, item_y, sel_w, ui.row.h, ui.col.bg_h);
						if (this.fullLineSelection && this.sbarShow == 1 && ui.sbar.type == 2) {
							gr.DrawLine(sel_x, item_y, sel_w, item_y, ui.l.w, ui.col.frame);
							gr.DrawLine(sel_x, item_y + ui.row.h, sel_w, item_y + ui.row.h, ui.l.w, ui.col.frame);
						} // else
						  // gr.DrawRect(sel_x + Math.floor(ui.l.w / 2), item_y, sel_w, ui.row.h, ui.l.w, ui.col.frame);
					}
					// if (this.highlight.row == 2) gr.FillSolidRect(sel_x + (!item.sel || (this.sbarShow == 1 && ui.sbar.type == 2) ? 0 : ui.l.w), item_y + ui.l.wc, sel_w + (!item.sel || (this.sbarShow == 1 && ui.sbar.type == 2) ? ui.l.w : -ui.l.w), ui.row.h - ui.l.w, !item.sel ? ui.col.bg_h : ui.col.bgSel_h);
				}
				// if (this.highlight.row == 1 && this.row.i == i && !sbar.draw_timer) gr.FillSolidRect(ui.l.w, item_y, ui.sz.sideMarker, ui.row.h, ui.col.sideMarker);

				if (ui.style.squareNode) {
					if (!item.track && (!this.inlineRoot || item.tr)) {
						const y2 = ui.y + ui.row.h * i + y1 - ui.l.wf;
						if (ui.col.line) if (pref.libraryDesign !== 'reborn') gr.FillSolidRect(item_x + ui.sz.node, y2, ui.l.s1, ui.l.w, ui.col.line);
						this.drawNode(gr, item.child.length < 1 ? this.m.br != i ? 0 : 2 : this.m.br != i ? 1 : 3, item_x, item_y + panel.node_y);
					} else if (ui.col.line && (!this.inlineRoot || item.tr)) if (pref.libraryDesign !== 'reborn') {
						const y2 = Math.round(ui.y + panel.search.h - sbar.delta) + Math.ceil(ui.row.h * (i + 0.5)) - ui.l.wf;
						gr.FillSolidRect(item_x + ui.l.s2, y2, ui.l.s3, ui.l.w, ui.col.line);
					}
				} else if (!item.track && (!this.inlineRoot || item.tr)) this.drawNode(gr, item, item_x, item_y, item.child.length < 1, this.m.br == i, item.sel);
				if (!this.inlineRoot || item.tr) item_x += ui.icon.w + (!this.fullLineSelection ? ui.l.wf : 0);
				const w = ui.x + panel.tree.w - item_x - ui.sz.sel - item.count_w;
				this.checkTooltip(item, item_x, item_y, item.name_w, w);
				if (this.fullLineSelection && item.id != this.id) {
					item.w = ui.x + panel.tree.w - item_x - (is_4k ? 45 : 25);
					item.id = this.id;
				}
				let np = this.m.i == i && this.highlight.row == 2 ? false : nowp_c.includes(i);
				// const txt_co = np ? ui.col.nowp : item.sel && this.fullLineSelection ? ui.col.textSel : this.m.i == i && this.highlight.text ? ui.col.text_h : ui.col.counts || ui.col.count;
				const type = item.sel ? 2 : this.m.i == i && this.highlight.text ? 1 : 0;
				// const txt_c = np ? ui.col.nowp : ui.col.txtArr[type];
				const colBrightness = new Color(col.primary).brightness;

				let txt_c =
					this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? ui.col.nowpBgSel :
					item.sel ? this.highlight.nowPlaying ? ui.col.textSel : ui.col.textSel :
					this.m.i == i ? this.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					this.highlight.nowPlaying ? ui.col.text : ui.col.text;

				if (pref.whiteTheme && (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130))) {
					txt_c =
					this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? RGB(0, 0, 0) :
					item.sel ? this.highlight.nowPlaying ? pref.libraryDesign === 'traditional' ? RGB(0, 0, 0) : RGB(0, 0, 0) : RGB(0, 0, 0) :
					this.m.i == i ? this.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					this.highlight.nowPlaying ? ui.col.text : ui.col.text;
				}
				else if (pref.whiteTheme && (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131))) {
					txt_c =
					this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? RGB(255, 255, 255) :
					item.sel ? this.highlight.nowPlaying ? pref.libraryDesign === 'traditional' ? RGB(255, 255, 255) : RGB(0, 0, 0) : RGB(255, 255, 255) :
					this.m.i == i ? this.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					this.highlight.nowPlaying ? ui.col.text : ui.col.text;
				}
				if ((pref.blackTheme || pref.themeStyleBlackAndWhite) && (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130))) {
					txt_c =
					this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? RGB(0, 0, 0) :
					item.sel ? this.highlight.nowPlaying ? pref.libraryDesign === 'traditional' ? RGB(0, 0, 0) : RGB(255, 255, 255) : RGB(0, 0, 0) :
					this.m.i == i ? this.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					this.highlight.nowPlaying ? ui.col.text : ui.col.text;
				}
				else if ((pref.blackTheme || pref.themeStyleBlackAndWhite) && (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131))) {
					txt_c =
					this.highlight.nowPlaying && !item.root && this.inRange(this.nowp, item.item) ? RGB(255, 255, 255) :
					item.sel ? this.highlight.nowPlaying ? pref.libraryDesign === 'traditional' ? RGB(255, 255, 255) : RGB(255, 255, 255) : RGB(255, 255, 255) :
					this.m.i == i ? this.highlight.nowPlaying ? ui.col.text_h : ui.col.text_h :
					this.highlight.nowPlaying ? ui.col.text : ui.col.text;
				}

				!panel.colMarker ? gr.GdiDrawText(nm[i], ui.font.main, txt_c, item_x, item_y, w, ui.row.h, panel.lc) : this.cusCol(gr, nm[i], item, item_x, item_y, w, ui.row.h, type, np, ui.font.main, ui.font.mainEllipsisSpace, 'text');
				if (pref.layout_mode === 'default_mode') {
					if (this.countsRight) gr.GdiDrawText(item.count, ui.font.small, txt_c /*txt_co*/, item_x, item_y, ui.x + panel.tree.w -
						(sbar.scrollable_lines <= 0 ? item_x - (is_4k ? 1 : 0) : sbar.scrollable_lines > 0 && ui.sbar.but_w === 0 && !sbar.bar.isDragging && pref.libraryAutoHideScrollbar ? item_x - (is_4k ? 1 : 0) : !pref.libraryAutoHideScrollbar ? item_x - (is_4k ? -33 : -12) : item_x - (is_4k ? -45 : -25)),
						ui.row.h, panel.rc);
				}
				else if (pref.layout_mode === 'artwork_mode') {
					if (this.countsRight) gr.GdiDrawText(item.count, ui.font.small, txt_c /*txt_co*/, item_x, item_y, ui.x + panel.tree.w -
						(sbar.scrollable_lines <= 0 ? item_x - (is_4k ? 1 : 0) : sbar.scrollable_lines > 0 && ui.sbar.but_w === 0 && !sbar.bar.isDragging && pref.libraryAutoHideScrollbar ? item_x - (is_4k ? 74 : 40) : !pref.libraryAutoHideScrollbar ? item_x - (is_4k ? -33 : -12) : item_x - (is_4k ? 28 : 15)),
						ui.row.h, panel.rc);
				}
			}
		}
	}

	drawNode(gr, item, x, y, parent, hover, sel) {
		const selFullLine = sel && this.fullLineSelection;
		const y2 = Math.round(y);
		const ix = this.get_ix(x, y, true, false);
		if (ix >= this.tree.length || ix < 0) return;
		const itemtr = this.tree[ix];
		ui.col.textSel = ui.col.iconPlusSel; ui.col.icon_h = ui.col.iconPlus_h;	ui.col.icon_c = ui.col.iconPlus; ui.col.icon_e = ui.col.iconPlus;
		let bgColor = selFullLine || this.highlight.nowPlaying && !itemtr.root && this.inRange(this.nowp, itemtr.item) ? col.primary : undefined;
		let nowpBgSel = this.highlight.nowPlaying && !itemtr.root && this.inRange(this.nowp, itemtr.item);
		let icon_c = nowpBgSel ? ui.col.nowpBgSel : selFullLine ? ui.col.iconPlusSel : !selFullLine ? ui.col.iconPlus : this.highlight.node ? ui.col.iconPlus_h : ui.col.iconPlus;
		const colBrightness = new Color(col.primary).brightness;

		if ((pref.whiteTheme) && (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130))) {
			icon_c = nowpBgSel ? rgb(0, 0, 0) : selFullLine ? this.highlight.nowPlaying ? rgb(0, 0, 0) : rgb(0, 0, 0) : !selFullLine ? ui.col.iconPlus : this.highlight.node ? ui.col.iconPlus_h : ui.col.iconPlus;
			ui.col.icon_h = rgb(0, 0, 0);
			ui.col.icon_e = rgb(0, 0, 0);
			ui.col.textSel = rgb(0, 0, 0);
		}
		else if ((pref.whiteTheme) && (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131))) {
			icon_c = nowpBgSel ? rgb(255, 255, 255) : selFullLine ? this.highlight.nowPlaying ? rgb(0, 0, 0) : rgb(255, 255, 255) : !selFullLine ? ui.col.iconPlus : this.highlight.node ? ui.col.iconPlus_h : ui.col.iconPlus;
			ui.col.icon_h = rgb(255, 255, 255);
			ui.col.icon_e = rgb(255, 255, 255);
			ui.col.textSel = rgb(255, 255, 255);
		}
		if ((pref.blackTheme || pref.themeStyleBlackAndWhite) && (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130))) {
			icon_c = nowpBgSel ? rgb(0, 0, 0) : selFullLine ? this.highlight.nowPlaying ? rgb(255, 255, 255) : rgb(0, 0, 0) : !selFullLine ? ui.col.iconPlus : this.highlight.node ? ui.col.iconPlus_h : ui.col.iconPlus;
		}
		else if ((pref.blackTheme || pref.themeStyleBlackAndWhite) && (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131))) {
			icon_c = nowpBgSel ? rgb(255, 255, 255) : selFullLine ? this.highlight.nowPlaying ? rgb(255, 255, 255) : rgb(255, 255, 255) : !selFullLine ? ui.col.iconPlus : this.highlight.node ? ui.col.iconPlus_h : ui.col.iconPlus;
		}

		switch (this.nodeStyle) {
			case 0: // Squares - Traditional design
				if (!this.highlight.node && item > 1) item -= 2;
				x = Math.round(x);
				y = Math.round(y);
				if (this.nd[item]) gr.DrawImage(this.nd[item], x, y, this.nd[item].Width, this.nd[item].Height, 0, 0, this.nd[item].Width, this.nd[item].Height);
				break;
			case 1:
			case 2: // Angles/Arrows - Modern design
				if (parent) {
					if (hover) {
						gr.DrawString(ui.icon.expand, ui.icon.font, /*selFullLine ? ui.col.textSel : this.highlight.node ? ui.col.icon_h : ui.col.icon_e*/ icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						if (this.nodeStyle == 2) gr.DrawString(ui.icon.expand, ui.icon.font, /*selFullLine ? ui.col.textSel : this.highlight.node ? ui.col.icon_h : ui.col.icon_e*/ icon_c, x + 1, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					} else gr.DrawString(ui.icon.expand, ui.icon.font, /*!selFullLine ? ui.col.icon_c : ui.col.textSel*/ icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
				} else {
					if (hover) {
						gr.DrawString(ui.icon.collapse, ui.icon.font, /*selFullLine ? ui.col.textSel : this.highlight.node ? ui.col.icon_h : ui.col.icon_c*/ icon_c, x - ui.icon.offset, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						if (this.nodeStyle == 2) gr.DrawString(ui.icon.collapse, ui.icon.font, /*selFullLine ? ui.col.textSel : this.highlight.node ? ui.col.icon_h : ui.col.icon_c*/ icon_c, x - ui.icon.offset, y2 + 1, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					} else {
						gr.DrawString(ui.icon.collapse, ui.icon.font, /*!selFullLine ? ui.col.icon_e : ui.col.textSel*/ icon_c, x - ui.icon.offset, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						if (this.nodeStyle == 2) gr.DrawString(ui.icon.collapse, ui.icon.font, /*!selFullLine ? ui.col.icon_e : ui.col.textSel*/ icon_c, x - ui.icon.offset, y2 + 1, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					}
				}
				break;
			case 3: { // Triangle - Ultra-modern design
				const y3 = Math.round(y + (ui.row.h - this.sy_sz) / 2 - 2);
				gr.SetSmoothingMode(4);
				if (parent) {
					if (hover) {
						if (this.highlight.node) gr.DrawString(ui.icon.expand2, ui.icon.font, /*!selFullLine ? ui.col.icon_h : ui.col.textSel*/ icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						else gr.DrawString(ui.icon.expand2, ui.icon.font, /*!selFullLine ? ui.col.icon_e & 0xCFffffff : ui.col.textSel*/ icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					} else gr.DrawString(ui.icon.expand, ui.icon.font, /*!selFullLine ? ui.col.icon_c : ui.col.textSel*/ icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
				} else if (hover && this.highlight.node) gr.DrawString(ui.icon.expand2, ui.icon.font, icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc); // gr.DrawImage(!selFullLine ? this.triangle.highlight : this.triangle.select, x - ui.icon.offset, y3, this.sy_sz, this.sy_sz, 0, 0, this.triangle.highlight.Width, this.triangle.highlight.Height);
				else gr.DrawString(ui.icon.expand2, ui.icon.font, icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc); // gr.DrawImage(!selFullLine ? this.triangle.expand : this.triangle.select, x - ui.icon.offset, y3, this.sy_sz, this.sy_sz, 0, 0, this.triangle.expand.Width, this.triangle.expand.Height);
				gr.SetSmoothingMode(0);
				break;
			}
			case 4: // Custom node - Georgia-ReBORN design
				if (parent) { // Plus
					if (hover) {
						gr.DrawString(ui.icon.expand, ui.icon.font, icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						if (this.nodeStyle == 4) gr.DrawString(ui.icon.expand, ui.icon.font, icon_c, x, y2, ui.x + panel.tree.w - x + 2, ui.row.h + 2, panel.s_lc);
					} else gr.DrawString(ui.icon.expand, ui.icon.font, icon_c, x, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
				} else {
					if (hover) { // Minus
						gr.DrawString(ui.icon.collapse, ui.icon.font, icon_c, x - ui.icon.offset, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						if (this.nodeStyle == 4) gr.DrawString(ui.icon.collapse, ui.icon.font, icon_c, x - ui.icon.offset, y2 + 1, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					} else {
						gr.DrawString(ui.icon.collapse, ui.icon.font, icon_c, x - ui.icon.offset, y2, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
						if (this.nodeStyle == 4) gr.DrawString(ui.icon.collapse, ui.icon.font, icon_c, x - ui.icon.offset, y2 + 1, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					}
				}
				break;
			case 5:
				if (item > 1) item -= 2;
				ui.style.symb.SetPartAndStateID(2, !item ? 1 : 2);
				ui.style.symb.DrawThemeBackground(gr, x, y, ui.sz.node, ui.sz.node);
				break;
			default:
				if (parent) {
					if (hover) {
						gr.DrawString(ui.icon.expand, ui.icon.font, selFullLine ? ui.col.textSel : this.highlight.node ? ui.col.icon_h : ui.col.icon_e, x, y + this.iconVerticalPad, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					} else gr.DrawString(ui.icon.expand, ui.icon.font, !selFullLine ? ui.col.icon_c : ui.col.textSel, x, y + this.iconVerticalPad, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
				} else {
					if (hover) {
						gr.DrawString(ui.icon.collapse, ui.icon.font, selFullLine ? ui.col.textSel : this.highlight.node ? ui.col.icon_h : ui.col.icon_c, x - ui.icon.offset, y + this.iconVerticalPad, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
					} else gr.DrawString(ui.icon.collapse, ui.icon.font, !selFullLine ? ui.col.icon_e : ui.col.textSel, x - ui.icon.offset, y + this.iconVerticalPad, ui.x + panel.tree.w - x, ui.row.h, panel.s_lc);
				}
				break;
		}
	}

	expand(ie, nm) {
		let h = 0;
		let m = 0;
		if (ie) this.tree[ie].sel = true;
		if (!this.tree.some(v => v.sel)) return;
		if (ppt.autoCollapse) {
			const parent = [];
			const pr_pr = [];
			let par = 0;
			this.tree.forEach((v, j, arr) => {
				if (v.sel) {
					j = v.tr;
					if (this.rootNode) j -= 1;
					if (v.tr != 0) {
						par = v.par;
						for (m = 1; m < j + 1; m++) {
							if (m == 1) pr_pr[m] = par;
							else pr_pr[m] = arr[pr_pr[m - 1]].par;
							parent.push(pr_pr[m]);
						}
					}
				}
			});
			this.tree.forEach((v, i) => {
				if (!parent.includes(i) && !v.sel && !v.root) v.child = [];
			});
			this.buildTree(lib.root, 0);
		}
		const start_l = this.tree.length;
		let nm_n = '';
		let nodes = -1;
		m = this.tree.length;
		this.expandedTracks = 0;
		this.expandLmt = men.treeExpandLimit;
		while (m--)
			if (this.tree[m].sel) {
				this.expandNodes(this.tree[m], !this.rootNode || m ? false : true);
				nodes++;
			}
		sbar.setRows(this.tree.length);
		panel.treePaint();
		if (nm) {
			this.tree.some((v, i, arr) => {
				nm_n = (v.tr ? arr[v.par].srt[0] : '') + v.srt[0];
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
		const b = Math.round(sbar.scroll / ui.row.h + 0.4);
		const n = Math.max(h - b, this.rootNode ? 1 : 0);
		let scrollChk = false;
		if (n + 1 + new_items > this.rows) {
			scrollChk = true;
			if (new_items > this.rows - 2) sbar.checkScroll(h * ui.row.h);
			else sbar.checkScroll(Math.min(h * ui.row.h, (h + 1 - sbar.rows_drawn + new_items) * ui.row.h));
		}
		if (sbar.scroll > h * ui.row.h) {
			scrollChk = true;
			sbar.checkScroll(h * ui.row.h);
		}
		if (!scrollChk) sbar.scrollRound();
		lib.treeState(false, ppt.rememberTree);
	}

	expandCollapse(x, y, item, ix) {
		const expanded = item.child.length > 0 ? 1 : 0;
		switch (expanded) {
			case 0: {
				let n = 0;
				if (ppt.autoCollapse) {
					n = this.branchChange(item, false, true);
					sbar.checkScroll(sbar.scroll - n * ui.row.h, 'step');
				}
				let row = this.getRowNumber(y);
				this.branch(item, !item.root ? false : true, true);
				if (!ix) panel.setHeight(true);
				n = 2;
				if (item.child.length == 1 && ppt.treeAutoExpandSingle) {
					this.branch(item.child[0], false, true);
					n += item.child[0].child.length;
				}
				if (ppt.autoCollapse) ix = item.ix;
				if (row + n + item.child.length > this.rows) {
					if (item.child.length > (this.rows - n)) sbar.checkScroll(ix * ui.row.h);
					else sbar.checkScroll(Math.min(ix * ui.row.h, (ix + n - sbar.rows_drawn + item.child.length) * ui.row.h));
				}
				break;
			}
			case 1: {
				this.clearChild(item);
				if (!ix && this.tree.length == 1) panel.setHeight(false);
				const b = $Lib.clamp(Math.round(sbar.delta / ui.row.h + 0.4), 0, this.tree.length - 1);
				const f = Math.min(b + panel.rows, this.tree.length);
				if (f - b < panel.rows) sbar.checkScroll((this.tree.length - panel.rows) * ui.row.h);
				break;
			}
		}
		if (sbar.scroll > ix * ui.row.h) sbar.checkScroll(ix * ui.row.h);
	}

	expandNodes(obj, am) {
		this.branch(obj, !am ? false : true, true, true);
		if (obj.child) obj.child.some(v => {
			if (v.track) this.expandedTracks++;
			if (this.expandedTracks >= this.expandLmt) return true;
			if (!v.track) this.expandNodes(v);
		});
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
		panel.treePaint();
		this.showItem(i);
	}

	getAllCombinations(n) {
		n = this.fixMarkers(n);
		if (n.includes('^@^') && n.includes(panel.softSplitter)) return this.imgView(n);
		else return this.getCombos(n);
	}

	getCombos(n) {
		const combinations = [];
		const divisors = [];
		const arraysToCombine = [];
		n = n.replace(RegExp(`(#!#|)${panel.softSplitter}(#!#|)`, 'g'), '@@').split('#!#');
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
		}
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

	getItemCount(item, par, pr, tr, type) {
		item.count = !item.track || !this.showTracks ? (item.name ? ' ' : '') + (this.nodeCounts == 1 ? '(' + this.trackCount(item.item) + ')' : this.nodeCounts == 2 ? '(' + this.branchCount(item, !item.root ? false : true, true, false, tr + (tr > 2 ? this.tree[this.tree[pr].par].nm : '') + (tr > 1 ? this.tree[pr].nm : '') + (tr > 0 ? this.tree[par].nm : '') + item.nm, type) + ')' : '') : '';
		if (!this.showTracks && item.count == (item.name ? ' ' : '') + '(0)') item.count = '';
	}

	getHandleList(n) {
		if (n == 'newItems') this.getTreeSel();
		let handleList = new FbMetadbHandleList();
		this.sel_items.some(v => {
			if (v >= panel.list.Count) return true;
			handleList.Add(panel.list[v]);
		});
		return handleList;
	}

	get_ix(x, y, simple, type) {
		let ix;
		y -= ui.y - 1; // - 1 = workaround to adjust and fix background color selection ( nowpBgSel in drawNode() ) to draw correct colored nodes in tree when option "Nowplaying in highlight" is active
		x -= ui.x;
		if (panel.imgView) {
			if (y > img.panel.y && y < img.panel.y + img.panel.h && x > img.panel.x && x < img.panel.x + img.panel.w) {
				const row_ix = img.style.vertical ? Math.ceil((y + sbar.delta - img.panel.y) / img.row.h) - 1 : 0;
				const column_ix = img.style.vertical ? (!img.labels.right && !ppt.albumArtFlowMode ? Math.ceil((x - img.panel.x) / img.columnWidth) - 1 : 0) : Math.ceil((x + sbar.delta - img.panel.x) / img.columnWidth) - 1;
				ix = (row_ix * img.columns) + column_ix;
				ix = ix > pop.tree.length - 1 ? -1 : ix;
				return ix;
			}
			return -1;
		}
		if (y > panel.tree.y && y < panel.tree.y + this.rows * ui.row.h) ix = Math.round((y + sbar.delta - panel.search.h - ui.row.h * 0.5) / ui.row.h);
		else ix = -1;
		if (simple) return ix;
		if (this.tree.length > ix && ix >= 0 && x < panel.tree.w && y > panel.tree.y && y < panel.tree.y + this.rows * ui.row.h && this.check_ix(this.tree[ix], x + ui.x, y + ui.y, type)) return ix;
		else return -1;
	}

	getNowplaying(handle, stop) {
		if (stop) return this.nowp = -1;
		if (!handle && fb.IsPlaying) handle = fb.GetNowPlaying();
		if (!handle) return this.nowp = -1;
		this.nowp = panel.list.Find(handle);
		panel.treePaint();
	}

	getRowNumber(y) {
		return Math.round((y - panel.tree.y - ui.row.h * 0.5) / ui.row.h);
	}

	getTreeSel() {
		panel.treePaint();
		this.sel_items = [];
		this.tree.forEach(v => {
			if (v.sel) this.addItems(this.sel_items, v.item);
		});
		this.uniq(this.sel_items);
	}

	imgView(n) {
		let a, b, c = [];
		n = n.split('^@^');
		if (n[0]) a = this.getCombos(n[0]);
		if (n[1]) b = this.getCombos(n[1]);
		a.forEach(v => b.forEach(w => c.push([v.join('') + '^@^' + w.join('')])));
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
		if (this.autoPlay.click > 2 && ppt.libSource) return;
		this.dbl_clicked = true;
		if (y < panel.search.h) return;
		let ix = this.get_ix(x, y, true, false);
		if (ix >= this.tree.length || ix < 0) return;
		const item = this.tree[ix];
		switch (this.clicked_on) {
			case 'node':
				this.expandCollapse(x, y, item, ix);
				break;
			case 'text':
				if (!this.check_ix(item, x, y, false)) return;
				if (!ppt.libSource) {
					plman.ExecutePlaylistDefaultAction($Lib.pl_active, this.range(item.item)[0]);
					return;
				}
				if (!ppt.dblClickAction && !this.autoFill.mouse && !this.autoPlay.click) return this.send(item, x, y);
				if (ppt.dblClickAction == 2 && !item.track && !panel.imgView) {
					this.expandCollapse(x, y, item, ix);
					lib.treeState(false, ppt.rememberTree);
				}
				if (!ppt.dblClickAction || this.autoPlay.click == 2) return;
				if (ppt.dblClickAction != 2 || ppt.dblClickAction == 2 && item.track || ppt.dblClickAction == 2 && panel.imgView) {
					if (!this.autoFill.mouse) this.send(item, x, y);
					let pln = plman.FindOrCreatePlaylist(ppt.libPlaylist.replace(/%view_name%/i, panel.viewName), false);
					if (ppt.sendToCur) pln = plman.ActivePlaylist;
					else plman.ActivePlaylist = pln;
					plman.ActivePlaylist = pln;
					const c = (plman.PlaybackOrder == 3 || plman.PlaybackOrder == 4) ? Math.ceil(plman.PlaylistItemCount(pln) * Math.random() - 1) : 0;
					plman.ExecutePlaylistDefaultAction(pln, c);
				}
				break;
		}
	}

	lbtn_dn(x, y) {
		this.lbtnDn = false;
		this.dbl_clicked = false;
		if (y < panel.search.h) return;
		let ix = this.get_ix(x, y, true, false);
		panel.pos = ix;
		if (ix >= this.tree.length || ix < 0) return;
		this.deactivateTooltip();
		if (ppt.touchControl) {
			ui.id.dragDrop = ui.id.touch_dn = ix;
		}
		const item = this.tree[ix];
		this.clicked_on = this.clickedOn(x, y, item);
		switch (this.clicked_on) {
			case 'node':
				this.expandCollapse(x, y, item, ix);
				this.checkRow(x, y);
				break;
			case 'text':
				this.last_pressed_coord.x = x - ui.x;
				this.last_pressed_coord.y = y - ui.y;
				this.lbtnDn = true;
				if (ppt.touchControl) break;
				if (vk.k('alt') && this.autoFill.mouse) return;
				if (!item.sel && !vk.k('ctrl')) this.setTreeSel(ix, item.sel);
				break;
		}
		lib.treeState(false, ppt.rememberTree);
	}

	lbtn_up(x, y) {
		if (lib.empty && ppt.libSource == 1 && !ppt.fixedPlaylist) fb.RunMainMenuCommand('Library/Configure');
		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};
		this.lbtnDn = false;
		if (y < panel.search.h || x < ui.x || this.dbl_clicked || but.Dn) return;
		const ix = this.get_ix(x, y, true, false);
		panel.pos = ix;
		if (ix >= this.tree.length || ix < 0) return;
		if (ppt.touchControl && (this.autoFill.mouse || this.autoPlay.click) && ui.id.touch_dn != ix) return;
		const item = this.tree[ix];
		if (this.clicked_on != 'text') return;

		if (!ppt.libSource) return this.setPlaylistSelection(ix, item);
		if (vk.k('alt')) {
			if (pref.libraryPlaylistSwitch) {
				btns.library.enabled = false;
				btns.library.changeState(ButtonState.Default);
				displayLibrary = false;
				displayPlaylist = true;
				if (!pref.always_showPlayingPl) playlist.on_size(ww, wh);
				window.Repaint();
			}
			return this.add(x, y, !ppt.altAddToCur);
		}
		if (!vk.k('ctrl')) {
			this.clearSelected();
			if (!item.sel) this.setTreeSel(ix, item.sel);
		} else this.setTreeSel(ix, item.sel);
		if (this.autoFill.mouse || this.autoPlay.click) {
			window.Repaint(true);
			this.send(item, x, y);
		} else {
			panel.treePaint();
		}
		this.track(this.autoFill.mouse || this.autoPlay.click);
		lib.treeState(false, ppt.rememberTree);
	}

	leave() {
		this.deactivateTooltip();
		panel.m.x = -1;
		panel.m.y = -1;
		if (men.r_up) return;
		this.m.br = -1;
		this.m.cur_br = 0;
		this.m.i = -1;
		this.cur_ix = 0;
		this.row.i = -1;
		this.row.cur = 0;
		panel.treePaint();
	}

	load(list, isArray, add, autoPlay, def_pl, insert) {
		let np_item = -1;
		let pid = -1;
		let pln = plman.FindOrCreatePlaylist(ppt.libPlaylist.replace(/%view_name%/i, panel.viewName), false);
		if (!def_pl) pln = plman.ActivePlaylist;
		else if (ppt.activateOnChange) plman.ActivePlaylist = pln;
		if (autoPlay == 4 && plman.PlaylistItemCount(pln) || autoPlay == 3 && fb.IsPlaying) {
			autoPlay = false;
			add = true;
		}
		const items = isArray ? this.getHandleList() : list.Clone();

		this.sortIfNeeded(items);

		this.selList = items.Clone();
		this.selection_holder.SetSelection(this.selList);
		if (!add && plman.GetPlaylistLockedActions(pln).includes('RemoveItems') || plman.GetPlaylistLockedActions(pln).includes('AddItems')) return;
		if (fb.IsPlaying && !add && fb.GetNowPlaying()) {
			np_item = items.Find(fb.GetNowPlaying());
			let pl_chk = true;
			let np;
			if (np_item != -1) {
				np = plman.GetPlayingItemLocation();
				if (np.IsValid) {
					if (np.PlaylistIndex != pln) pl_chk = false;
					else pid = np.PlaylistItemIndex;
				}
				if (pl_chk && pid == -1 && items.Count < 5000) {
					if (ui.dui) plman.SetActivePlaylistContext();
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
				plman.ClearPlaylistSelection(pln);
				plman.SetPlaylistSelectionSingle(pln, pid, true);
				plman.RemovePlaylistSelection(pln, true);
				const it = items.Clone();
				items.RemoveRange(np_item, items.Count);
				it.RemoveRange(0, np_item + 1);
				if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln);
				plman.InsertPlaylistItems(pln, 0, items);
				plman.InsertPlaylistItems(pln, plman.PlaylistItemCount(pln), it);
			} else {
				if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln);
				plman.ClearPlaylist(pln);
				plman.InsertPlaylistItems(pln, 0, items);
			}
		} else if (!add) {
			if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln);
			plman.ClearPlaylist(pln);
			plman.InsertPlaylistItems(pln, 0, items);
		} else {
			if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln);
			plman.InsertPlaylistItems(pln, !insert ? plman.PlaylistItemCount(pln) : plman.GetPlaylistFocusItemIndex(pln), items, true);
			const f_ix = !insert || plman.GetPlaylistFocusItemIndex(pln) == -1 ? plman.PlaylistItemCount(pln) - items.Count : plman.GetPlaylistFocusItemIndex(pln) - items.Count;
			plman.SetPlaylistFocusItem(pln, f_ix);
			plman.EnsurePlaylistItemVisible(pln, f_ix);
		}
		if (autoPlay) {
			const c = (plman.PlaybackOrder == 3 || plman.PlaybackOrder == 4) ? Math.ceil(plman.PlaylistItemCount(pln) * Math.random() - 1) : 0;
			plman.ExecutePlaylistDefaultAction(pln, c);
		}
	}

	mbtn_up(x, y) {
		if (!ppt.libSource) return;
		this.add(x, y, !ppt.mbtnAddToCur);
	}

	merge(m, mergeBrCount) {
		if (!ppt.libSource && !panel.multiProcess) return;
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
		if (but.Dn) return;
		const ix = this.get_ix(x, y, false, false);
		this.row.i = this.checkRow(x, y);
		if (this.on_key_down) this.row.i = -1; // Needed to prevent selection mouse jump while using vkey up/down while moving the mouse
		this.m.i = -1;
		if (ix != -1) {
			this.m.i = ix;
			this.check_tooltip(ix, x, y);
		} else this.deactivateTooltip();
		// Deactivate hand cursor
		// if (this.highlight.node || panel.imgView) {
		// 	if (ix != -1 || this.inlineRoot && !this.m.br) this.hand = true;
		// } else if (this.m.br != -1 && !(this.inlineRoot && !this.m.br)) this.hand = true;
		// window.SetCursor(this.hand ? 32649 : !but.Dn && y < panel.search.h && ppt.searchShow && x > but.q.h + but.margin && x < panel.search.x + panel.search.w ? 32513 : 32512);
		const same = this.m.i == this.cur_ix && this.m.br == this.m.cur_br && this.row.i == this.row.cur;
		if (same && !sbar.touch.dn) return;
		if (!sbar.draw_timer && !same) panel.treePaint();
		this.cur_ix = this.m.i;
		this.m.cur_br = this.m.br;
		this.row.cur = this.row.i;
	}

	nowPlayingShow() {
		if (this.nowp != -1) {
			let np_i = -1;
			for (let i = 0; i < this.tree.length; i++) {
				const v = this.tree[i];
				if (this.inRange(this.nowp, v.item)) {
					np_i = i;
					if (!v.root) {
						if (panel.imgView) i = this.tree.length;
						else if (!v.track) this.branch(this.tree[np_i]);
					}
				}
			}
			if (!panel.imgView && !this.tree[np_i].root) {
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
		if (panel.search.active) return;
		switch (code) {
			case vk.copy: {
				const handleList = this.getHandleList('newItems');
				fb.CopyHandleListToClipboard(handleList);
				break;
			}
			case vk.selAll:
				this.tree.forEach(v => {
					if (!v.root) v.sel = true;
				});
				this.getTreeSel();
				if (!this.sel_items.length) return;
				this.setPlaylist();
				break;
			case vk.eFocusSearch:
			case vk.lFocusSearch:
				if (ppt.searchShow) search.focus();
				break;
			case vk.insert:
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
		if (this.autoFill.key) {
			if (ppt.libSource) {
				this.load(this.sel_items, true, false, false, !ppt.sendToCur, false);
				this.track(true);
			} else this.setPlaylistSelection(ix, item);
		}
	}

	on_key_down(vkey) {
		if (vkey == vk.collapseAll && !panel.imgView) this.collapseAll();
		if (vkey == vk.expand && !panel.imgView) {
			const isSel = this.tree.some(v => v.sel);
			this.expand();
			if (isSel) {
				panel.setHeight(true);
				this.checkAutoHeight();
			}
		}
		if (panel.search.active) return;
		if (vk.k('enter')) {
			if (!this.sel_items.length) return;
			if (!ppt.libSource) {
				if (this.autoPlay.send) plman.ExecutePlaylistDefaultAction($Lib.pl_active, this.sel_items[0]);
				return;
			}
			switch (true) {
				case vk.k('shift'):
					return this.load(this.sel_items, true, true, false, false, false);
				case vk.k('ctrl'):
					return this.sendToNewPlaylist();
				default:
					return this.load(this.sel_items, true, false, this.autoPlay.send, false, false);
			}
		}
		let item = -1;
		let row = -1;
		switch (vkey) {
			case vk.left:
				if (!(panel.pos >= 0) && this.row.i != -1) panel.pos = this.row.i;
				else panel.pos = panel.pos + this.tree.length % this.tree.length;
				if (panel.imgView) panel.pos -= 1;
				panel.pos = $Lib.clamp(panel.pos, 0, this.tree.length - 1);
				this.row.i = -1;
				this.m.i = -1;
				if (panel.imgView) {
					item = this.tree[panel.pos];
					this.m.i = panel.pos;
					this.showItem(item.ix, 'left');
					this.setPlaylist(panel.pos, item);
					break;
				}
				// !imgView
				if ((this.tree[panel.pos].tr == (this.rootNode ? 1 : 0)) && this.tree[panel.pos].child.length < 1) break;
				if (this.tree[panel.pos].child.length > 0) {
					item = this.tree[panel.pos];
					this.clearChild(item);
					this.setTreeSel(item.ix);
					this.m.i = panel.pos = item.ix;
				} else {
					item = this.tree[this.tree[panel.pos].par];
					if (item) this.clearChild(item);
					this.setTreeSel(item.ix);
					this.m.i = panel.pos = item.ix;
				}
				panel.treePaint();
				this.setPlaylist(panel.pos, item);
				sbar.setRows(this.tree.length);
				if (sbar.scroll > panel.pos * ui.row.h) sbar.checkScroll(panel.pos * ui.row.h);
				else sbar.scrollRound();
				lib.treeState(false, ppt.rememberTree);
				break;
			case vk.right: {
				if (!(panel.pos >= 0) && this.row.i != -1) panel.pos = this.row.i;
				else panel.pos = panel.pos + this.tree.length % this.tree.length;
				if (panel.imgView) panel.pos += 1;
				panel.pos = $Lib.clamp(panel.pos, 0, this.tree.length - 1);
				this.row.i = -1;
				this.m.i = -1;
				item = this.tree[panel.pos];
				if (panel.imgView) {
					this.m.i = panel.pos;
					this.showItem(item.ix, 'right');
					this.setPlaylist(panel.pos, item);
					break;
				}
				// !imgView
				if (ppt.autoCollapse) this.branchChange(item, false, true);
				this.branch(item, !item.root ? false : true, true);
				let n = 2;
				if (item.child.length == 1 && ppt.treeAutoExpandSingle) {
					this.branch(item.child[0], false, true);
					n += item.child[0].child.length;
				}
				this.setTreeSel(item.ix);
				panel.treePaint();
				this.m.i = panel.pos = item.ix;
				this.setPlaylist(panel.pos, item);
				sbar.setRows(this.tree.length);
				row = (panel.pos * ui.row.h - sbar.scroll) / ui.row.h;
				if (row + n + item.child.length > sbar.rows_drawn) {
					if (item.child.length > (sbar.rows_drawn - n)) sbar.checkScroll(panel.pos * ui.row.h);
					else sbar.checkScroll(Math.min(panel.pos * ui.row.h, (panel.pos + n - sbar.rows_drawn + item.child.length) * ui.row.h));
				} else sbar.scrollRound();
				lib.treeState(false, ppt.rememberTree);
				break;
			}
			case vk.pgUp:
				if (this.tree.length == 0) break;
				if (panel.imgView) {
					if (!(panel.pos >= 0) && this.row.i != -1) panel.pos = this.row.i;
					else panel.pos = panel.pos + this.tree.length % this.tree.length;
					panel.pos = panel.pos - img.columns * (panel.rows - 1);
					panel.pos = $Lib.clamp(panel.pos, 0, this.tree.length - 1);
				} else panel.pos = Math.max(Math.round(sbar.scroll / ui.row.h + 0.4) - Math.floor(panel.rows) + 1, !this.rootNode ? 0 : 1);
				sbar.pageThrottle(1);
				this.setTreeSel(this.tree[panel.pos].ix);
				panel.treePaint();
				this.setPlaylist(panel.pos, this.tree[panel.pos]);
				lib.treeState(false, ppt.rememberTree);
				break;

			case vk.pgDn:
				if (this.tree.length == 0) break;
				if (panel.imgView) {
					if (!(panel.pos >= 0) && this.row.i != -1) panel.pos = this.row.i;
					else panel.pos = panel.pos + this.tree.length % this.tree.length;
					panel.pos = panel.pos + img.columns * (panel.rows - 1);
					panel.pos = $Lib.clamp(panel.pos, 0, this.tree.length - 1);
				} else panel.pos = Math.min(Math.round(sbar.scroll / ui.row.h + 0.4) + Math.floor(panel.rows) * 2 - 2, this.tree.length - 1);
				sbar.pageThrottle(-1);
				this.setTreeSel(this.tree[panel.pos].ix);
				panel.treePaint();
				this.setPlaylist(panel.pos, this.tree[panel.pos]);
				lib.treeState(false, ppt.rememberTree);
				break;
			case vk.home:
				if (this.tree.length == 0) break;
				panel.pos = !this.rootNode ? 0 : 1;
				sbar.checkScroll(0, 'full');
				this.setTreeSel(this.tree[panel.pos].ix);
				panel.treePaint();
				this.setPlaylist(panel.pos, this.tree[panel.pos]);
				lib.treeState(false, ppt.rememberTree);
				break;
			case vk.end:
				if (this.tree.length == 0) break;
				panel.pos = this.tree.length - 1;
				sbar.scrollToEnd();
				this.setTreeSel(this.tree[panel.pos].ix);
				panel.treePaint();
				this.setPlaylist(panel.pos, this.tree[panel.pos]);
				lib.treeState(false, ppt.rememberTree);
				break;
			case vk.dn:
			case vk.up:
				if (this.tree.length == 0) break;
				if ((panel.pos == 0 && this.row.i == -1 && vkey == vk.up) || (panel.pos == this.tree.length - 1 && vkey == vk.dn)) {
					this.setTreeSel(-1);
					break;
				}
				if (this.row.i != -1) panel.pos = this.row.i;
				else panel.pos = panel.pos + this.tree.length % this.tree.length;
				this.row.i = -1;
				this.m.i = -1;
				if (!panel.imgView) {
					if (vkey == vk.dn) panel.pos++;
					if (vkey == vk.up) panel.pos--;
				} else {
					if (vkey == vk.dn) panel.pos += img.columns;
					if (vkey == vk.up) panel.pos -= img.columns;
				}
				panel.pos = $Lib.clamp(panel.pos, !this.rootNode ? 0 : 1, this.tree.length - 1);
				if (panel.imgView) {
					item = this.tree[panel.pos];
					this.m.i = panel.pos;
					this.showItem(item.ix, vkey == vk.up ? 'up' : 'down');
					this.setPlaylist(panel.pos, item);
					return;
				}
				row = (panel.pos * ui.row.h - sbar.scroll) / ui.row.h;
				if (sbar.rows_drawn - row < 3) sbar.checkScroll((panel.pos + 3) * ui.row.h - sbar.rows_drawn * ui.row.h);
				else if (row < 2 && vkey == vk.up) sbar.checkScroll((panel.pos - 1) * ui.row.h);
				this.m.i = panel.pos;
				this.setTreeSel(panel.pos);
				panel.treePaint();
				this.setPlaylist(panel.pos, this.tree[panel.pos]);
				lib.treeState(false, ppt.rememberTree);
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
		if (index == this.getMainMenuIndex.searchClear && ppt.searchShow) search.clear();
		if (index == this.getMainMenuIndex.searchFocus && this.is_focused && ppt.searchShow) search.focus();
	}

	range(item) {
		let items = [];
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
		if (vk.k('ctrl') || vk.k('shift')) this.load(this.sel_items, true, false, false, !ppt.sendToCur, false);
		else this.load(this.sel_items, true, false, this.autoPlay.click, !ppt.sendToCur, false);
	}

	sendToNewPlaylist() {
		const names = this.tree.filter(v => v.sel).map(v => v.name);
		plman.ActivePlaylist = plman.CreatePlaylist(plman.PlaylistCount, [...new Set(names)].join('; '));
		this.load(this.sel_items, true, false, this.autoPlay.send, false, false);
	}

	setActions() {
		this.autoPlay = {
			click: ppt.clickAction < 2 ? false : ppt.clickAction,
			send: ppt.autoPlay
		}
		this.autoFill = {
			mouse: ppt.clickAction == 1 ? true : false,
			key: ppt.keyAction
		}
	}

	setPlaylistSelection(ix, item) {
		this.clearSelected();
		if (!item.sel) this.setTreeSel(ix, item.sel);
		panel.treePaint();
		plman.ClearPlaylistSelection($Lib.pl_active);
		let items = [];
		if (panel.search.txt || ppt.filterBy || panel.multiProcess) {
			const hl = this.getHandleList();
			hl.Convert().forEach(h => {
				const i = lib.full_list.Find(h);
				if (i != -1) items.push(i);
		});
		} else {
			items = this.range(item.item);
		}
		plman.SetPlaylistSelection($Lib.pl_active, items, true);
		this.setFocus = true;
		plman.SetPlaylistFocusItem($Lib.pl_active, items[0]);
		this.track(false);
		lib.treeState(false, ppt.rememberTree);
	}

	setPos(pos) {
		this.m.i = this.row.i = panel.pos = pos;
	}

	setTreeSel(idx, state) {
		const sel_type = idx == -1 ? 0 : vk.k('shift') && this.last_sel > -1 && ppt.libSource ? 1 : vk.k('ctrl') ? 2 : !state ? 3 : 0;
		switch (sel_type) {
			case 0:
				this.clearSelected();
				this.sel_items = [];
				break;
			case 1: {
				const direction = (idx > this.last_sel) ? 1 : -1;
				if (!vk.k('ctrl')) this.clearSelected();
				for (let i = this.last_sel;; i += direction) {
					this.tree[i].sel = true;
					if (i == idx) break;
				}
				this.getTreeSel();
				panel.treePaint();
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
		this.countsRight = ppt.countsRight;
		this.fullLineSelection = ppt.fullLineSelection;
		this.highlight = {
			node: ppt.highLightNode,
			nowPlaying: ppt.highLightNowplaying,
			row: ppt.highLightRow,
			text: ppt.highLightText
		};
		this.iconVerticalPad = ppt.iconVerticalPad;
		this.nodeCounts = ppt.nodeCounts;
		this.nodeStyle = ppt.nodeStyle;
		this.rootNode = ppt.rootNode;
		this.rowStripes = ppt.rowStripes;
		this.sbarShow = ppt.sbarShow;
		this.showTracks = !ppt.treeListView ? ppt.showTracks : false;
		this.treeIndent = ppt.treeIndent;
	}

	showItem(i, type) {
		if (!panel.imgView) {
			sbar.checkScroll(i * ui.row.h - Math.round(sbar.rows_drawn / 2 - 1) * ui.row.h, 'full');
			return;
		}
		this.m.i = -1;
		const b = $Lib.clamp(Math.round(sbar.delta / sbar.row.h), 0, panel.rows - 1);
		const f = Math.min(b + Math.floor(img.panel.h / sbar.row.h), panel.rows);
		this.setTreeSel(i);
		panel.treePaint();
		const row1 = Math.floor(i / (img.style.vertical ? img.columns : 1));
		if (row1 <= b || row1 >= f) {
			switch (type) {
				case 'np':
				case 'focus': {
					const delta = (img.style.vertical ? img.panel.h : img.panel.w) / 2 > sbar.row.h ?
						Math.floor((img.style.vertical ? img.panel.h : img.panel.w) / 2) : 0,
						deltaRows = Math.floor(delta / sbar.row.h) * sbar.row.h;
					sbar.checkScroll((img.style.vertical ? row1 : i) * sbar.row.h - deltaRows, 'full');
					break;
				}
				case 'up':
				case 'down':
				case 'left':
				case 'right': {
					const row2 = (row1 * sbar.row.h - sbar.scroll) / sbar.row.h;
					if (sbar.rows_drawn - row2 < 1) sbar.checkScroll((row1 + 1) * sbar.row.h - sbar.rows_drawn * sbar.row.h);
					else if (row2 < 1 & (type == 'up' || type == 'left')) sbar.checkScroll(row1 * sbar.row.h);
				}
			}
		}
		lib.treeState(false, ppt.rememberTree);
	}


	sort(data) {
		if (!ppt.libSource && !panel.multiProcess) return;
		this.specialCharSort(data);
		data.sort((a, b) => this.collator.compare(a.srt[2], b.srt[2]) || (a.srt[3] && !b.srt[3] ? 1 : 0));
	}

	sortIfNeeded(items) {
		if (panel.multiProcess && !ppt.customSort.length) items.OrderByFormat(panel.multiValueTagSort, 1);
		else if (ppt.customSort.length) items.OrderByFormat(this.customSort, 1);
	}

	specialCharHas(name) {
		return RegExp(this.specialChar).test(name);
	}

	specialCharIsLeading(name) {
		return RegExp('^' + this.specialChar).test(name);
	}

	specialCharPad(name) {
		return name.replace(RegExp(this.specialChar + '+', 'g'), v => (v + '    ').slice(0, 5));
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
		if (this.isDate(str1)) return `${str1} ${str2.replace(RegExp(this.specialChar, 'g'),'')}`;
		return name.replace(RegExp(this.specialChar, 'g'), '');
	}

	track(plLoaded) {
		const list = this.getHandleList();
		if (ppt.libSource != 2) window.NotifyOthers('lt_panelHandleList', list); // if receiving can't send back same
		if (!plLoaded) this.selection_holder.SetSelection(list);
	}

	trackCount(item) {
		return item.reduce((a, b) => a + b.count, 0);
	}

	treeTooltipFont() {
		return !panel.imgView ? [ui.font.main.Name, ui.font.main.Size, ui.font.main.Style] : [ui.font.group.Name, ui.font.group.Size, ui.font.group.Style];
	}

	uniq(arr) {
		this.sel_items = [...new Set(arr)].sort(this.numSort);
	}
}