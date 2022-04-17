class Search {
	constructor() {
		this.cx = 0;
		this.doc = new ActiveXObject('htmlfile');
		this.end = 0;
		this.lbtnDn = false;
		this.lg = [];
		this.log = [];
		this.menu = $Lib.jsonParse(ppt.searchHistory, []);
		this.offset = 0;
		this.paste = false;
		this.start = 0;
		this.shift = false;
		this.shift_x = 0;
		this.txt_w = 0;

		this.logHistory = $Lib.debounce(() => {
			let item = -1;
			const itemPresent = this.menu.some((v, i) => {
				item = i;
				return v.search == panel.search.txt;
			});
			if (itemPresent) {
				this.menu[item].accessed = Date.now();
				return;
			}
			if (!panel.search.txt) return;
			this.menu.push({search: panel.search.txt, accessed: Date.now()});
			if (this.menu.length > 25) {
				this.menu.sort((a, b) => b.accessed - a.accessed);
				this.menu.length = 25;
			}
			this.menu.sort((a, b) => pop.collator.compare(a.search, b.search));
			ppt.searchHistory = JSON.stringify(this.menu);
			men.refreshSearchHistoryMenu();
		}, 3000);

	}

	// Methods

	calcText() {
		$Lib.gr(1, 1, false, g => this.txt_w = g.CalcTextWidth(panel.search.txt.substr(this.offset), ui.font.main, true));
	}

	clear() {
		if (!panel.search.txt) return;
		lib.time.Reset();
		pop.subCounts.search = {};
		this.offset = this.start = this.end = this.cx = 0;
		panel.search.txt = '';
		but.setSearchBtnsHide();
		panel.searchPaint();
		lib.treeState(false, ppt.rememberTree);
		lib.rootNodes();
		pop.checkAutoHeight();
	}

	draw(gr) {
		if (!ppt.searchShow) return;
		this.start = $Lib.clamp(this.start, 0, panel.search.txt.length);
		this.end = $Lib.clamp(this.end, 0, panel.search.txt.length);
		this.cx = $Lib.clamp(this.cx, 0, panel.search.txt.length);
		if (ui.style.fill) gr.FillSolidRect(0, 1, ui.w, ui.row.h - 4, 0x60000000);
		if (ui.style.pen == 2) gr.DrawRoundRect(0, 2, ui.w - 1, ui.row.h - 4, 4, 4, 1, ui.style.pen_c);
		if (panel.search.txt) {
			this.drawSel(gr);
			this.getOffset(gr);
			gr.GdiDrawText(panel.search.txt.substr(this.offset), ui.font.main, ui.col.search, ui.x + panel.search.x, ui.y, panel.search.w, panel.search.sp, panel.l);
		} else gr.GdiDrawText('Search', ui.font.search, ui.col.txt_box, ui.x + panel.search.x, ui.y, panel.search.w, panel.search.sp, panel.l);
		this.drawCursor(gr);
	}

	drawCursor(gr) {
		if (panel.search.active && panel.search.cursor && this.start == this.end && this.cx >= this.offset) {
			const lx = panel.search.x + this.get_cursor_x(this.cx);
			gr.DrawLine(ui.x + lx, ui.y + panel.search.sp * 0.3, ui.x + lx, ui.y + panel.search.sp * 0.6, ui.l.w, ui.col.text);
		}
	}

	drawSel(gr) {
		if (this.start == this.end) return;
		const clamp = panel.search.x + panel.search.w;
		gr.DrawLine(Math.min(panel.search.x + this.get_cursor_x(this.start), clamp), ui.y + (panel.search.sp / 2), Math.min(panel.search.x + this.get_cursor_x(this.end), clamp), ui.y + (panel.search.sp / 2), ui.row.h - 3, ui.col.searchSel);
	}

	get_cursor_x(pos) {
		let x = 0;
		$Lib.gr(1, 1, false, g => {
			if (pos >= this.offset) x = g.CalcTextWidth(panel.search.txt.substr(this.offset, pos - this.offset), ui.font.main, true);
		});
		return x;
	}

	getCursorChrPos(x) {
		let i = 0;
		$Lib.gr(1, 1, false, g => {
			const nx = x - panel.search.x;
			let pos = 0;
			for (i = this.offset; i < panel.search.txt.length; i++) {
				pos += g.CalcTextWidth(panel.search.txt.substr(i, 1), ui.font.main, true);
				if (pos >= nx + 3) break;
			}
		});
		return i;
	}

	getOffset(gr) {
		let j = 0;
		let tx = gr.CalcTextWidth(panel.search.txt.substr(this.offset, this.cx - this.offset), ui.font.main, true);
		while (tx >= panel.search.w && j < 500) {
			j++;
			this.offset++;
			tx = gr.CalcTextWidth(panel.search.txt.substr(this.offset, this.cx - this.offset), ui.font.main, true);
		}
	}

	lbtn_dblclk(x, y) {
		if (y < ui.y + panel.search.h && x > but.q.h + but.margin && x < panel.search.x + panel.search.w && panel.search.txt.length) {
			panel.search.cursor = false;
			this.start = 0;
			this.end = panel.search.txt.length;
			panel.searchPaint();
		}
	}

	lbtn_dn(x, y) {
		panel.searchPaint();
		this.lbtnDn = panel.search.active = (y < ui.y + panel.search.h && x > but.q.x - but.margin / 2/*<added*/ + but.q.h + but.margin && x < panel.search.x + panel.search.w);
		if (!this.lbtnDn) {
			this.offset = this.start = this.end = this.cx = 0;
			timer.clear(timer.cursor);
			return;
		} else {
			if (this.shift) {
				this.start = this.cx;
				this.end = this.cx = this.getCursorChrPos(x);
			} else {
				this.cx = this.getCursorChrPos(x);
				this.start = this.end = this.cx;
			}
			timer.searchCursor(true);
		}
		panel.searchPaint();
	}

	lbtn_up() {
		if (this.start != this.end) timer.clear(timer.cursor);
		this.lbtnDn = false;
	}

	move(x, y) {
		if (y > panel.search.h || !this.lbtnDn) return;
		const cursorChrPos = this.getCursorChrPos(x);
		const c_x = this.get_cursor_x(cursorChrPos);
		let l;
		this.calcText();
		if (cursorChrPos < this.start) {
			if (cursorChrPos < this.end) {
				if (c_x < panel.search.x)
					if (this.offset > 0) this.offset--;
			} else if (cursorChrPos > this.end) {
				if (c_x + panel.search.x > panel.search.x + panel.search.w) {
					l = (this.txt_w > panel.search.w) ? this.txt_w - panel.search.w : 0;
					if (l > 0) this.offset++;
				}
			}
			this.end = cursorChrPos;
		} else if (cursorChrPos > this.start) {
			if (c_x + panel.search.x > panel.search.x + panel.search.w) {
				l = (this.txt_w > panel.search.w) ? this.txt_w - panel.search.w : 0;
				if (l > 0) this.offset++;
			}
			this.end = cursorChrPos;
		}
		this.cx = cursorChrPos;
		panel.searchPaint();
	}

	on_char(code, force) {
		let searchDone = false;
		let text = String.fromCharCode(code) || '';
		if (force) panel.search.active = true;
		if (!panel.search.active || code == 5 || code == 9 || code == 12) return;
		panel.search.cursor = false;
		panel.pos = -1;
		switch (code) {
			case vk.enter:
				if (ppt.searchEnter || ppt.searchSend == 1) {
					lib.upd_search = true;
					lib.time.Reset();
					pop.subCounts.search = {};
					lib.treeState(false, ppt.rememberTree);
					lib.rootNodes();
					panel.setHeight(true);
					lib.search.cancel();
					this.logHistory();
					searchDone = true;
				}
				if (ppt.searchSend == 1 || ppt.searchEnter && ppt.searchSend == 2) pop.load(panel.list, false, false, pop.autoPlay.send, !ppt.sendToCur, false);
				break;
			case vk.escape:
				this.clear();
				return;
			case vk.redo:
				this.lg.push(panel.search.txt);
				if (this.lg.length > 30) this.lg.shift();
				if (this.log.length > 0) {
					panel.search.txt = this.log.pop() + '';
					this.cx++
				}
				break;
			case vk.undo:
				this.log.push(panel.search.txt);
				if (this.log.length > 30) this.lg.shift();
				if (this.lg.length > 0) panel.search.txt = this.lg.pop() + '';
				break;
			case vk.selAll:
				this.start = 0;
				this.end = panel.search.txt.length;
				break;
			case vk.copy:
				if (this.start != this.end) utils.SetClipboardText(panel.search.txt.substring(this.start, this.end));
				break;
			case vk.cut:
				if (this.start != this.end) utils.SetClipboardText(panel.search.txt.substring(this.start, this.end)); // fall through
			case vk.back:
				this.record();
				if (this.start == this.end) {
					if (this.cx > 0) {
						panel.search.txt = panel.search.txt.substr(0, this.cx - 1) + panel.search.txt.substr(this.cx, panel.search.txt.length - this.cx);
						if (this.offset > 0) this.offset--;
						this.cx--;
					}
				} else {
					if (this.end - this.start == panel.search.txt.length) {
						panel.search.txt = '';
						this.cx = 0;
					} else {
						if (this.start > 0) {
							const st = this.start;
							const en = this.end;
							this.start = Math.min(st, en);
							this.end = Math.max(st, en);
							panel.search.txt = panel.search.txt.substring(0, this.start) + panel.search.txt.substring(this.end, panel.search.txt.length);
							this.cx = this.start;
						} else {
							panel.search.txt = panel.search.txt.substring(this.end, panel.search.txt.length);
							this.cx = this.start;
						}
					}
				}
				this.calcText();
				this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
				this.start = this.cx;
				this.end = this.start;
				break;
			case 'delete':
				this.record();
				if (this.start == this.end) {
					if (this.cx < panel.search.txt.length) {
						panel.search.txt = panel.search.txt.substr(0, this.cx) + panel.search.txt.substr(this.cx + 1, panel.search.txt.length - this.cx - 1);
					}
				} else {
					if (this.end - this.start == panel.search.txt.length) {
						panel.search.txt = '';
						this.cx = 0;
					} else {
						if (this.start > 0) {
							const st = this.start;
							const en = this.end;
							this.start = Math.min(st, en);
							this.end = Math.max(st, en);
							panel.search.txt = panel.search.txt.substring(0, this.start) + panel.search.txt.substring(this.end, panel.search.txt.length);
							this.cx = this.start;
						} else {
							panel.search.txt = panel.search.txt.substring(this.end, panel.search.txt.length);
							this.cx = this.start;
						}
					}
				}
				this.calcText();
				this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
				this.start = this.cx;
				this.end = this.start;
				break;
			case vk.paste:
				text = utils.GetClipboardText(); // fall through
				text = text.replace(/(\r\n|\n|\r)/gm, ' ');
			default:
				this.record();
				if (this.start == this.end) {
					panel.search.txt = panel.search.txt.substring(0, this.cx) + text + panel.search.txt.substring(this.cx);
					this.cx += text.length;
					this.end = this.start = this.cx;
				} else if (this.end > this.start) {
					panel.search.txt = panel.search.txt.substring(0, this.start) + text + panel.search.txt.substring(this.end);
					this.calcText();
					this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
					this.cx = this.start + text.length;
					this.start = this.cx;
					this.end = this.start;
				} else {
					panel.search.txt = panel.search.txt.substring(this.start) + text + panel.search.txt.substring(0, this.end);
					this.calcText();
					this.offset = this.offset < this.end - this.start ? this.offset - this.end + this.start : 0;
					this.cx = this.end + text.length;
					this.start = this.cx;
					this.end = this.start;
				}
				break;
		}
		if (code == vk.copy || code == vk.selAll) return;
		if (!timer.cursor.id) timer.searchCursor();
		but.setSearchBtnsHide();
		panel.searchPaint();
		if (ppt.searchEnter || searchDone) return;
		if ((ppt.searchSend == 2 || lib.list.Count > 200000) && panel.search.txt && panel.search.txt.length < 4) {
			lib.upd_search = true;
			lib.search500();
			this.logHistory();
		} else {
			lib.search500.cancel();
			lib.upd_search = true;
			lib.search();
			this.logHistory();
		}
	}

	on_key_down(vkey) {
		if (!panel.search.active) return;
		switch (vkey) {
			case vk.left:
			case vk.right:
				if (vkey == vk.left) {
					if (this.offset > 0) {
						if (this.cx <= this.offset) {
							this.offset--;
							this.cx--;
						} else this.cx--;
					} else if (this.cx > 0) this.cx--;
					this.start = this.end = this.cx;
				}
				if (vkey == vk.right && this.cx < panel.search.txt.length) this.cx++;
				this.start = this.end = this.cx;
				if (this.shift) {
					this.start = Math.min(this.cx, this.shift_x);
					this.end = Math.max(this.cx, this.shift_x);
				}
				panel.search.cursor = true;
				timer.searchCursor(true);
				break;
			case vk.home:
			case vk.end:
				if (vkey == vk.home) this.offset = this.start = this.end = this.cx = 0;
				else this.start = this.end = this.cx = panel.search.txt.length;
				if (this.shift) {
					this.start = Math.min(this.cx, this.shift_x);
					this.end = Math.max(this.cx, this.shift_x);
				}
				panel.search.cursor = true;
				timer.searchCursor(true);
				break;
			case vk.shift:
				this.shift = true;
				this.shift_x = this.cx;
				break;
			case vk.del:
				this.on_char('delete');
				break;
		}
		panel.searchPaint();
	}

	on_key_up(vkey) {
		if (!panel.search.active) return;
		if (vkey == vk.shift) {
			this.shift = false;
			this.shift_x = this.cx;
		}
	}

	rbtn_up(x, y) {
		this.paste = utils.GetClipboardText() ? true : false;
		searchMenu.load(x, y);
	}

	record() {
		this.lg.push(panel.search.txt);
		this.log = [];
		if (this.lg.length > 30) this.lg.shift();
	}

	focus() {
		panel.searchPaint();
		panel.search.active = true;
		this.shift = false;
		this.start = this.end = this.cx = panel.search.x;
		panel.search.cursor = true;
		timer.searchCursor(true);
		panel.searchPaint();
	}
}

class Find {
	constructor() {
		this.arc1 = 5;
		this.arc2 = 4;
		this.j = {
			x: 5,
			y: 5,
			w: 50,
			h: 30
		};
		this.jSearch = '';
		this.jump_search = true;
	}

	// Methods

	draw(gr) {
		if (this.jSearch) {
			gr.SetSmoothingMode(4);
			this.j.w = gr.CalcTextWidth(this.jSearch, ui.font.find) + 25;
			gr.FillRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, 0x96000000);
			gr.DrawRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, 1, 0x64000000);
			gr.DrawRoundRect(this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w - 2, this.j.h - 2, this.arc2, this.arc2, 1, 0x28ffffff);
			gr.GdiDrawText(this.jSearch, ui.font.find, RGB(0, 0, 0), this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w, this.j.h, panel.cc);
			gr.GdiDrawText(this.jSearch, ui.font.find, this.jump_search ? 0xfffafafa : 0xffff4646, this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, panel.cc);
			gr.SetSmoothingMode(0);
		}
	}

	on_char(code) {
		if (utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B) || utils.IsKeyPressed(0x6A) || utils.IsKeyPressed(0x6D)) return;
		const text = String.fromCharCode(code);
		if (!panel.search.active) {
			let found = false;
			let pos = -1;
			switch (code) {
				case vk.back:
					this.jSearch = this.jSearch.substr(0, this.jSearch.length - 1);
					break;
				case vk.enter:
					this.jSearch = '';
					return;
				default:
					this.jSearch += text;
					break;
			}
			pop.clearSelected();
			if (!this.jSearch) return;
			pop.sel_items = [];
			this.jump_search = true;
			window.RepaintRect(ui.x, this.j.y, ui.w, this.j.h + 1);
			timer.clear(timer.jsearch1);
			timer.jsearch1.id = setTimeout(() => {
				pop.tree.some((v, i) => {
					const name = v.name.replace(/@!#.*?@!#/g, '');
					if (name != panel.rootName && name.substring(0, this.jSearch.length).toLowerCase() == this.jSearch.toLowerCase()) {
						found = true;
						pos = i;
						v.sel = true;
						pop.setPos(pos);
						if (pop.autoFill.key) pop.getTreeSel();
						lib.treeState(false, ppt.rememberTree);
						return true;
					}
				});
				if (!found) this.jump_search = false;
				panel.treePaint();
				if (found) pop.showItem(pos, 'focus');
				timer.jsearch1.id = null;
			}, 500);

			timer.clear(timer.jsearch2);
			timer.jsearch2.id = setTimeout(() => {
				if (found) {
					if (ppt.libSource) {
						if (pop.autoFill.key) pop.load(pop.sel_items, true, false, false, !ppt.sendToCur, false);
						pop.track(pop.autoFill.key);
					} else if (pos >= 0 && pos < pop.tree.length) pop.setPlaylistSelection(pos, pop.tree[pos]);
				}
				this.jSearch = '';
				window.RepaintRect(ui.x, this.j.y, ui.w, this.j.h + 1);
				timer.jsearch2.id = null;
			}, 1200);
		}
	}

	on_size() {
		this.j.x = Math.round(ui.x + ui.w / 2);
		this.j.h = Math.round(ui.row.h * 1.5);
		this.j.y = Math.round(ui.y + (ui.h - this.j.h) / 2);
		this.arc1 = Math.min(5, this.j.h / 2);
		this.arc2 = Math.min(4, (this.j.h - 2) / 2);
	}
}