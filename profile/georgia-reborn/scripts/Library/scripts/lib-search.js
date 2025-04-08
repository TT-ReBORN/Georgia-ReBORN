'use strict';

class LibSearch {
	constructor() {
		this.cx = 0;
		this.end = 0;
		this.lbtnDn = false;
		this.lg = [];
		this.log = [];
		this.menu = $Lib.jsonParse(libSet.searchHistory, []);
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
				return v.search == lib.panel.search.txt;
			});
			if (itemPresent) {
				this.menu[item].accessed = Date.now();
				return;
			}
			if (!lib.panel.search.txt) return;
			this.menu.push({ search: lib.panel.search.txt, accessed: Date.now() });
			if (this.menu.length > 25) {
				this.menu.sort((a, b) => b.accessed - a.accessed);
				this.menu.length = 25;
			}
			this.menu.sort((a, b) => lib.pop.collator.compare(a.search, b.search));
			libSet.searchHistory = JSON.stringify(this.menu);
		}, 3000);
	}

	// * METHODS * //

	calcText() {
		$Lib.gr(1, 1, false, g => this.txt_w = g.CalcTextWidth(lib.panel.search.txt.substr(this.offset), lib.ui.font.main, true));
	}

	clear() {
		if (!lib.panel.search.txt) return;
		lib.lib.time.Reset();
		lib.pop.cache.search = {};
		this.offset = this.start = this.end = this.cx = 0;
		lib.panel.search.txt = '';
		lib.but.setSearchBtnsHide();
		lib.panel.searchPaint();
		lib.lib.setNodes(); // comment out to always stop child panels clearing [if memory on & item selected that's used & so won't clear]
		lib.pop.checkAutoHeight();
		lib.pop.notifySelection();
	}

	draw(gr) {
		if (!libSet.searchShow) return;
		this.start = $Lib.clamp(this.start, 0, lib.panel.search.txt.length);
		this.end = $Lib.clamp(this.end, 0, lib.panel.search.txt.length);
		this.cx = $Lib.clamp(this.cx, 0, lib.panel.search.txt.length);
		if (lib.ui.style.fill) gr.FillSolidRect(0, 1, lib.ui.w, lib.ui.row.h - 4, 0x60000000);
		if (lib.ui.style.pen == 2) gr.DrawRoundRect(0, 2, lib.ui.w - 1, lib.ui.row.h - 4, 4, 4, 1, lib.ui.style.pen_c);
		if (lib.panel.search.txt) {
			this.drawSel(gr);
			this.getOffset(gr);
			gr.GdiDrawText(lib.panel.search.txt.substr(this.offset), lib.ui.font.main, lib.ui.col.search, lib.ui.x + lib.panel.search.x, lib.ui.y, lib.panel.search.w, lib.panel.search.sp, lib.panel.l);
		}
		else if (!lib.ui.img.blurDark) {
			gr.GdiDrawText('Search', lib.ui.font.search, lib.ui.col.txt_box, lib.ui.x + lib.panel.search.x, lib.ui.y, lib.panel.search.w, lib.panel.search.sp, lib.panel.l);
		}
		else {
			gr.SetTextRenderingHint(5);
			gr.DrawString('Search', lib.ui.font.search, lib.ui.col.txt_box, lib.ui.x + lib.panel.search.x, lib.ui.y - -1, lib.panel.search.w, lib.panel.search.sp, lib.panel.s_lc);
		}
		this.drawCursor(gr);
	}

	drawCursor(gr) {
		if (lib.panel.search.active && lib.panel.search.cursor && this.start == this.end && this.cx >= this.offset) {
			const lx = lib.panel.search.x + this.get_cursor_x(this.cx);
			gr.DrawLine(lib.ui.x + lx, lib.ui.y + lib.panel.search.sp * 0.3, lib.ui.x + lx, lib.ui.y + lib.panel.search.sp * 0.6, lib.ui.l.w, lib.ui.col.text);
		}
	}

	drawSel(gr) {
		if (this.start == this.end) return;
		const clamp = lib.panel.search.x + lib.panel.search.w;
		gr.DrawLine(Math.min(lib.panel.search.x + this.get_cursor_x(this.start), clamp), lib.ui.y + (lib.panel.search.sp / 2), Math.min(lib.panel.search.x + this.get_cursor_x(this.end), clamp), lib.ui.y + (lib.panel.search.sp / 2), lib.ui.row.h - 3, lib.ui.col.searchSel);
	}

	get_cursor_x(pos) {
		let x = 0;
		$Lib.gr(1, 1, false, g => {
			if (pos >= this.offset) x = g.CalcTextWidth(lib.panel.search.txt.substr(this.offset, pos - this.offset), lib.ui.font.main, true);
		});
		return x;
	}

	getCursorChrPos(x) {
		let i = 0;
		$Lib.gr(1, 1, false, g => {
			const nx = x - lib.panel.search.x;
			let pos = 0;
			for (i = this.offset; i < lib.panel.search.txt.length; i++) {
				pos += g.CalcTextWidth(lib.panel.search.txt.substr(i, 1), lib.ui.font.main, true);
				if (pos >= nx + 3) break;
			}
		});
		return i;
	}

	getOffset(gr) {
		let j = 0;
		let tx = gr.CalcTextWidth(lib.panel.search.txt.substr(this.offset, this.cx - this.offset), lib.ui.font.main, true);
		while (tx >= lib.panel.search.w && lib.panel.search.w > 0 && j < 500) {
			j++;
			this.offset++;
			tx = gr.CalcTextWidth(lib.panel.search.txt.substr(this.offset, this.cx - this.offset), lib.ui.font.main, true);
		}
	}

	lbtn_dblclk(x, y) {
		if (y < lib.ui.y + lib.panel.search.h && x > lib.but.q.h + lib.but.margin && x < lib.panel.search.x + lib.panel.search.w && lib.panel.search.txt.length) {
			lib.panel.search.cursor = false;
			this.start = 0;
			this.end = lib.panel.search.txt.length;
			lib.panel.searchPaint();
		}
	}

	lbtn_dn(x, y) {
		lib.panel.searchPaint();
		this.lbtnDn = lib.panel.search.active = (y < lib.ui.y + lib.panel.search.h && x > lib.but.q.x - lib.but.margin / 2 + lib.but.q.h + lib.but.margin && x < lib.panel.search.x + lib.panel.search.w);
		if (!this.lbtnDn) {
			this.offset = this.start = this.end = this.cx = 0;
			lib.timer.clear(lib.timer.cursor);
			return;
		} else {
			if (this.shift) {
				this.start = this.cx;
				this.end = this.cx = this.getCursorChrPos(x);
			} else {
				this.cx = this.getCursorChrPos(x);
				this.start = this.end = this.cx;
			}
			lib.timer.searchCursor(true);
		}
		lib.panel.searchPaint();
	}

	lbtn_up() {
		if (this.start != this.end) lib.timer.clear(lib.timer.cursor);
		this.lbtnDn = false;
	}

	move(x, y) {
		if (y > lib.panel.search.h || !this.lbtnDn) return;
		const cursorChrPos = this.getCursorChrPos(x);
		const c_x = this.get_cursor_x(cursorChrPos);
		let l;
		this.calcText();
		if (cursorChrPos < this.start) {
			if (cursorChrPos < this.end) {
				if (c_x < lib.panel.search.x && this.offset > 0) this.offset--;
			}
			else if (cursorChrPos > this.end && c_x + lib.panel.search.x > lib.panel.search.x + lib.panel.search.w) {
				l = (this.txt_w > lib.panel.search.w) ? this.txt_w - lib.panel.search.w : 0;
				if (l > 0) this.offset++;
			}
			this.end = cursorChrPos;
		} else if (cursorChrPos > this.start) {
			if (c_x + lib.panel.search.x > lib.panel.search.x + lib.panel.search.w) {
				l = (this.txt_w > lib.panel.search.w) ? this.txt_w - lib.panel.search.w : 0;
				if (l > 0) this.offset++;
			}
			this.end = cursorChrPos;
		}
		this.cx = cursorChrPos;
		lib.panel.searchPaint();
	}

	on_char(code, force) {
		let searchDone = false;
		let text = String.fromCharCode(code) || '';
		if (force) lib.panel.search.active = true;
		if (!lib.panel.search.active || code == 5 || code == 9 || code == 12) return;
		lib.panel.search.cursor = false;
		lib.panel.pos = -1;
		switch (code) {
			case lib.vk.enter:
				if (libSet.searchEnter || libSet.searchSend == 1) {
					lib.lib.upd_search = true;
					lib.lib.time.Reset();
					lib.pop.cache.search = {};
					lib.lib.setNodes();
					lib.panel.setHeight(true);
					if (lib.panel.search.txt.length > 2) window.NotifyOthers(window.Name, !lib.lib.list.Count ? lib.lib.list : lib.panel.list);
					else if (!lib.panel.search.txt.length) lib.pop.notifySelection();
					lib.lib.search.cancel();
					this.logHistory();
					searchDone = true;
				}
				if (libSet.searchSend == 1 || libSet.searchEnter && libSet.searchSend == 2) lib.pop.load(lib.panel.list, false, false, lib.pop.autoPlay.send, !libSet.sendToCur, false);
				break;
			case lib.vk.escape:
				this.clear();
				return;
			case lib.vk.redo:
				this.lg.push(lib.panel.search.txt);
				if (this.lg.length > 30) this.lg.shift();
				if (this.log.length > 0) {
					lib.panel.search.txt = `${this.log.pop()}`;
					this.cx++;
				}
				break;
			case lib.vk.undo:
				this.log.push(lib.panel.search.txt);
				if (this.log.length > 30) this.lg.shift();
				if (this.lg.length > 0) lib.panel.search.txt = `${this.lg.pop()}`;
				break;
			case lib.vk.selAll:
				this.start = 0;
				this.end = lib.panel.search.txt.length;
				break;
			case lib.vk.copy:
				if (this.start != this.end) $Lib.setClipboardData(lib.panel.search.txt.substring(this.start, this.end));
				break;
			case lib.vk.cut:
				if (this.start != this.end) $Lib.setClipboardData(lib.panel.search.txt.substring(this.start, this.end)); // fall through
			case lib.vk.back:
				this.record();
				if (this.start == this.end) {
					if (this.cx > 0) {
						lib.panel.search.txt = lib.panel.search.txt.substr(0, this.cx - 1) + lib.panel.search.txt.substr(this.cx, lib.panel.search.txt.length - this.cx);
						if (this.offset > 0) this.offset--;
						this.cx--;
					}
				}
				else if (this.end - this.start == lib.panel.search.txt.length) {
					lib.panel.search.txt = '';
					this.cx = 0;
				}
				else if (this.start > 0) {
					const st = this.start;
					const en = this.end;
					this.start = Math.min(st, en);
					this.end = Math.max(st, en);
					lib.panel.search.txt = lib.panel.search.txt.substring(0, this.start) + lib.panel.search.txt.substring(this.end, lib.panel.search.txt.length);
					this.cx = this.start;
				}
				else {
					lib.panel.search.txt = lib.panel.search.txt.substring(this.end, lib.panel.search.txt.length);
					this.cx = this.start;
				}
				this.calcText();
				this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
				this.start = this.cx;
				this.end = this.start;
				break;
			case lib.vk.ctrlBackspace:
				this.record();
				if (this.start != this.end) this.cx = this.end = this.start;
				if (this.cx > 0) {
					const initial = lib.panel.search.txt.length;
					const leftSide = lib.panel.search.txt.slice(0, this.cx).trimEnd();
					let boundary = 0;
					for (let k = 0; k < leftSide.length; k++) {
						if (lib.panel.search.txt[k] == ' ' && lib.panel.search.txt[k + 1] != ' ') boundary = k + 1;
					}
					lib.panel.search.txt = leftSide.slice(0, boundary) + lib.panel.search.txt.slice(this.cx).trimStart();
					this.cx = boundary;

					if (this.offset > 0) {
						this.offset -= initial - lib.panel.search.txt.length;
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
					if (this.cx < lib.panel.search.txt.length) {
						lib.panel.search.txt = lib.panel.search.txt.substr(0, this.cx) + lib.panel.search.txt.substr(this.cx + 1, lib.panel.search.txt.length - this.cx - 1);
					}
				}
				else if (this.end - this.start == lib.panel.search.txt.length) {
					lib.panel.search.txt = '';
					this.cx = 0;
				}
				else if (this.start > 0) {
					const st = this.start;
					const en = this.end;
					this.start = Math.min(st, en);
					this.end = Math.max(st, en);
					lib.panel.search.txt = lib.panel.search.txt.substring(0, this.start) + lib.panel.search.txt.substring(this.end, lib.panel.search.txt.length);
					this.cx = this.start;
				}
				else {
					lib.panel.search.txt = lib.panel.search.txt.substring(this.end, lib.panel.search.txt.length);
					this.cx = this.start;
				}
				this.calcText();
				this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
				this.start = this.cx;
				this.end = this.start;
				break;
			case lib.vk.paste:
				text = $Lib.getClipboardData() || '';
				text = text.replace(/(\r\n|\n|\r)/gm, ' '); // fall through
			default:
				this.record();
				if (this.start == this.end) {
					lib.panel.search.txt = lib.panel.search.txt.substring(0, this.cx) + text + lib.panel.search.txt.substring(this.cx);
					this.cx += text.length;
					this.end = this.start = this.cx;
				}
				else if (this.end > this.start) {
					lib.panel.search.txt = lib.panel.search.txt.substring(0, this.start) + text + lib.panel.search.txt.substring(this.end);
					this.calcText();
					this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
					this.cx = this.start + text.length;
					this.end = this.start = this.cx;
				}
				else {
					lib.panel.search.txt = lib.panel.search.txt.substring(0, this.end) + text + lib.panel.search.txt.substring(this.start);
					this.calcText();
					this.offset = this.offset < this.end - this.start ? this.offset - this.end + this.start : 0;
					this.cx = this.end + text.length;
					this.end = this.start = this.cx;
				}
				break;
		}
		if (code == lib.vk.copy || code == lib.vk.selAll) return;
		if (!lib.timer.cursor.id) lib.timer.searchCursor();
		lib.but.setSearchBtnsHide();
		lib.panel.searchPaint();
		if (libSet.searchEnter || searchDone) return;
		if ((libSet.searchSend == 2 || lib.lib.list.Count > 200000) && lib.panel.search.txt && lib.panel.search.txt.length < 4) {
			lib.lib.upd_search = true;
			lib.lib.search500();
			this.logHistory();
		} else {
			lib.lib.search500.cancel();
			lib.lib.upd_search = true;
			lib.lib.search();
			this.logHistory();
		}
	}

	on_key_down(vkey) {
		if (!lib.panel.search.active) return;
		switch (vkey) {
			case lib.vk.ctrl:
				this.ctrl = true;
				break;
			case lib.vk.left:
			case lib.vk.right:
				if (vkey == lib.vk.left) {
					if (!this.ctrl) {
						if (this.offset > 0) {
							if (this.cx <= this.offset) {
								this.offset--;
								this.cx--;
							} else this.cx--;
						} else if (this.cx > 0) this.cx--;
					} else {
						let boundary = 0;
						for (let k = this.cx - 1; k > 0; k--) {
							if (lib.panel.search.txt[k] != ' ' && lib.panel.search.txt[k - 1] == ' ') {
								boundary = k;
								break;
							}
						}
						if (this.offset > 0) {
							this.offset -= (this.cx - boundary);
						}
						this.cx = boundary;
						this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
					}
				}
				if (vkey == lib.vk.right && this.cx < lib.panel.search.txt.length) {
					if (!this.ctrl) this.cx++;
					else {
						let boundary = lib.panel.search.txt.length;
						for (let k = this.cx; k < lib.panel.search.txt.length; k++) {
							if (lib.panel.search.txt[k] == ' ' && lib.panel.search.txt[k + 1] != ' ') {
								boundary = k + 1;
								break;
							}
						}
						this.cx = boundary;
					}
				}
				this.start = this.end = this.cx;
				if (this.shift) {
					this.start = Math.min(this.cx, this.shift_x);
					this.end = Math.max(this.cx, this.shift_x);
				}
				lib.panel.search.cursor = true;
				lib.timer.searchCursor(true);
				break;
			case lib.vk.home:
			case lib.vk.end:
				if (vkey == lib.vk.home) this.offset = this.start = this.end = this.cx = 0;
				else this.start = this.end = this.cx = lib.panel.search.txt.length;
				if (this.shift) {
					this.start = Math.min(this.cx, this.shift_x);
					this.end = Math.max(this.cx, this.shift_x);
				}
				lib.panel.search.cursor = true;
				lib.timer.searchCursor(true);
				break;
			case lib.vk.shift:
				this.shift = true;
				this.shift_x = this.cx;
				break;
			case lib.vk.del:
				if (this.ctrl && !this.shift && this.start == this.end) { // ctrl + delete: delete next word
					this.record();
					const initial = lib.panel.search.txt.length;
					const leftSide = lib.panel.search.txt.slice(0, this.cx);
					const rightSide = lib.panel.search.txt.slice(this.cx, lib.panel.search.txt.length).trimStart();
					const idx = rightSide.search(/ \b/);
					const boundary = idx == -1 ? rightSide.length : idx + 1;
					let newRightSide = rightSide.slice(boundary);
					if (newRightSide.length && !/\s$/.test(leftSide) && !/^\s/.test(newRightSide)) newRightSide = ` ${newRightSide}`;
					lib.panel.search.txt = leftSide + newRightSide;
					this.cx = !/\s$/.test(leftSide) ? leftSide.length + 1 : leftSide.length;
					if (this.offset > 0) {
						this.offset -= initial - lib.panel.search.txt.length;
					}
					this.calcText();
					this.offset = this.offset >= this.end - this.start ? this.offset - this.end + this.start : 0;
					this.start = this.end = this.cx;
				} else this.on_char('delete');
				break;
		}
		lib.panel.searchPaint();
	}

	on_key_up(vkey) {
		if (!lib.panel.search.active) return;
		if (vkey == lib.vk.ctrl) {
			this.ctrl = false;
		}
		if (vkey == lib.vk.shift) {
			this.shift = false;
			this.shift_x = this.cx;
		}
	}

	rbtn_up(x, y) {
		this.paste = !!$Lib.getClipboardData();
		libSearchMenu.load(x, y);
	}

	record() {
		this.lg.push(lib.panel.search.txt);
		this.log = [];
		if (this.lg.length > 30) this.lg.shift();
	}

	focus() {
		lib.panel.searchPaint();
		lib.panel.search.active = true;
		this.shift = false;
		this.start = this.end = this.cx = lib.panel.search.x;
		lib.panel.search.cursor = true;
		lib.timer.searchCursor(true);
		lib.panel.searchPaint();
	}
}

class LibFind {
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
		this.initials = null;
	}

	// * METHODS * //

	draw(gr) {
		if (this.jSearch) {
			gr.SetSmoothingMode(4);
			this.j.w = gr.CalcTextWidth(this.jSearch, /*ui.font.find*/ grFont.notification) + 25;
			gr.FillRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, grCol.popupBg);
			gr.DrawRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, 1, 0x64000000);
			gr.DrawRoundRect(this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w - 2, this.j.h - 2, this.arc2, this.arc2, 1, 0x28ffffff);
			// gr.GdiDrawText(this.jSearch, lib.ui.font.find, RGB(0, 0, 0), this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w, this.j.h, lib.panel.cc); // Drop shadow not needed
			gr.GdiDrawText(this.jSearch, /* lib.ui.font.find */ grFont.notification, this.jump_search ? grCol.popupText : 0xffff4646, this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, lib.panel.cc);
			gr.SetSmoothingMode(0);
		}
	}

	allEqual(str) {
		return str.split('').every(char => char === str[0]);
	}

	on_char(code) {
		const text = String.fromCharCode(code);

		if (grSet.jumpSearchDisabled || lib.panel.search.active ||
			utils.IsKeyPressed(VKey.CONTROL) || utils.IsKeyPressed(VKey.ESCAPE) ||
			this.jSearch === '' && text === ' ') {
			return;
		}

		const text = String.fromCharCode(code);
		switch (code) {
			case lib.vk.back:
				this.jSearch = this.jSearch.substr(0, this.jSearch.length - 1);
				break;
			case lib.vk.enter:
				this.jSearch = '';
				return;
			default:
				this.jSearch += text;
				break;
		}
		const playlistItems = plman.GetPlaylistItems(plman.ActivePlaylist);
		const search = fb.TitleFormat(grSet.jumpSearchComposerOnly ? '%composer%' : '$if2(%album artist%, %artist%)').EvalWithMetadbs(playlistItems);
		let focusIndex = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
		let advance = false;
		let foundInPlaylist = false;
		let foundInLibrary = false;

		// * Library advance
		if (lib.panel.pos >= 0 && lib.panel.pos < lib.pop.tree.length) {
			const char = lib.pop.tree[lib.panel.pos].name.replace(/@!#.*?@!#/g, '').charAt(0).toLowerCase();
			if (lib.pop.tree[lib.panel.pos].sel && char == text && this.allEqual(this.jSearch)) {
				this.jSearch = this.jSearch.slice(0, 1);
				advance = true;
			}
		}
		// * Playlist advance
		else if (focusIndex >= 0 && focusIndex < search.length && (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true))) {
			const char = search[focusIndex].replace(/@!#.*?@!#/g, '').charAt(0).toLowerCase();
			if (char === text && this.allEqual(this.jSearch)) {
				this.jSearch = this.jSearch.slice(0, 1);
				advance = true;
			}
		}

		switch (true) {
			case advance: {
				if (utils.IsKeyPressed(0x0A) || utils.IsKeyPressed(0x08) ||  utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B) || utils.IsKeyPressed(0x6A) || utils.IsKeyPressed(0x6D)) return;
				let init = '';
				let cur = 'currentArr';
				if (!this.initials) { // reset in buildTree
					this.initials = {}
					// * Library advance
					if (!grm.ui.displayPlaylist || !grm.ui.displayLibrarySplit(true)) {
						lib.pop.tree.forEach((v, i) => {
							if (!v.root) {
								const nm = v.name.replace(/@!#.*?@!#/g, '');
								init = nm.charAt().toLowerCase();
								if (cur != init && !this.initials[init]) {
									this.initials[init] = [i];
									cur = init;
								} else {
									this.initials[init].push(i);
								}
							}
						});
					}
					// * Playlist advance
					else {
						playlistItems.Convert().forEach((v, i) => {
							const name = search[i].replace(/@!#.*?@!#/g, '');
							init = name.charAt().toLowerCase();
							if (cur !== init && !this.initials[init]) {
								this.initials[init] = [i];
								cur = init;
							} else {
								this.initials[init].push(i);
							}
							return true;
						});
					}
				}

				this.jump_search = false;

				// * Library advance
				if (lib.panel.pos >= 0 && lib.panel.pos < lib.pop.tree.length) {
					this.matches = this.initials[text];
					this.ix = this.matches.indexOf(lib.panel.pos);
					this.ix++;
					if (this.ix >= this.matches.length) this.ix = 0;
					lib.panel.pos = this.matches[this.ix];
					this.jump_search = true;
				}
				// * Playlist advance
				else if (focusIndex >= 0 && focusIndex < search.length && (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true))) {
					this.matches = this.initials[text];
					console.log('Playlist advance results', this.matches); // Debug
					this.ix = this.matches.indexOf(focusIndex);
					this.ix++;
					if (this.ix >= this.matches.length) this.ix = 0;
					focusIndex = this.matches[this.ix];
					this.jump_search = true;
				}

				// * Library advance
				if (this.jump_search && !grm.ui.displayLibrarySplit(true)) {
					lib.pop.clearSelected();
					lib.pop.sel_items = [];
					lib.pop.tree[lib.panel.pos].sel = true;
					lib.pop.setPos(lib.panel.pos);
					lib.pop.getTreeSel();
					lib.lib.treeState(false, libSet.rememberTree);
					lib.panel.treePaint();
					if (lib.panel.imgView) lib.pop.showItem(lib.panel.pos, 'focus');
					else {
						const row = (lib.panel.pos * lib.ui.row.h - lib.sbar.scroll) / lib.ui.row.h;
						if (lib.sbar.rows_drawn - row < 3 || row < 0) lib.sbar.checkScroll((lib.panel.pos + 3) * lib.ui.row.h - lib.sbar.rows_drawn * lib.ui.row.h);
					}
					if (libSet.libSource) {
						if (lib.pop.autoFill.key) lib.pop.load(lib.pop.sel_items, true, false, false, !libSet.sendToCur, false);
						lib.pop.track(lib.pop.autoFill.key);
					} else if (lib.panel.pos >= 0 && lib.panel.pos < lib.pop.tree.length) lib.pop.setPlaylistSelection(lib.panel.pos, lib.pop.tree[lib.panel.pos]);
				}
				// * Playlist advance
				else if (this.jump_search && (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true))) {
					plman.ClearPlaylistSelection(plman.ActivePlaylist);
					plman.SetPlaylistFocusItem(plman.ActivePlaylist, focusIndex);
					plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, focusIndex, true);
					window.Repaint();
				}
				else {
					lib.panel.treePaint();
				}
				lib.timer.clear(lib.timer.jsearch2);
				lib.timer.jsearch2.id = setTimeout(() => {
					this.jSearch = '';
					lib.panel.treePaint();
					lib.timer.jsearch2.id = null;
				}, 2200);
			}
			break;

		case !advance:
			if (utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B) || utils.IsKeyPressed(0x6A) || utils.IsKeyPressed(0x6D)) return;
			if (!lib.panel.search.active) {
				let pos = -1;
				lib.pop.clearSelected();
				if (!this.jSearch) return;
				lib.pop.sel_items = [];
				this.jump_search = true;
				lib.panel.treePaint();
				lib.timer.clear(lib.timer.jsearch1);

				lib.timer.jsearch1.id = setTimeout(() => {
					// * First search in the Library
					lib.pop.tree.some((v, i) => {
						const name = v.name.replace(/@!#.*?@!#/g, '');
						if (name !== lib.panel.rootName && name.substring(0, this.jSearch.length).toLowerCase() === this.jSearch.toLowerCase()) {
							foundInLibrary = true;
							pos = i;
							v.sel = true;
							lib.pop.setPos(pos);
							if (lib.pop.autoFill.key) lib.pop.getTreeSel();
							lib.lib.treeState(false, libSet.rememberTree);
							console.log(`Jumpsearch: "${name}" found in Library`); // Debug, can remove this soon
							return true;
						}
						return false;
					});
					// * If no Library results found, try search query in the Playlist
					if (!foundInLibrary && grSet.jumpSearchIncludePlaylist) {
						playlistItems.Convert().some((v, i) => {
							const name = search[i].replace(/@!#.*?@!#/g, '');
							if (name !== lib.panel.rootName && name.substring(0, this.jSearch.length).toLowerCase() === this.jSearch.toLowerCase()) {
								foundInPlaylist = true;
								foundInLibrary = false;
								pos = i;
								plman.ClearPlaylistSelection(plman.ActivePlaylist);
								plman.SetPlaylistFocusItem(plman.ActivePlaylist, pos);
								plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, pos, true);
								console.log(`Jumpsearch: "${name}" found in Playlist`); // Debug, can remove this soon
								return true;
							}
							return false;
						});
					}

					if (!foundInPlaylist && !foundInLibrary) {
						this.jump_search = false;
						console.log('Jumpsearch: No results were found'); // Debug, can remove this soon
					}

					lib.panel.treePaint();

					if (foundInLibrary) {
						grm.ui.displayPlaylist = grSet.libraryLayout === 'split' && grm.ui.displayPlaylist;
						grm.ui.displayLibrary = true;
						grm.ui.displayBiography = false;
						grm.ui.displayLyrics = false;
						lib.pop.showItem(pos, 'focus');
						grm.button.initButtonState();
					}
					else if (foundInPlaylist && grSet.jumpSearchIncludePlaylist) {
						grm.ui.displayPlaylist = true;
						grm.ui.displayLibrary = grSet.libraryLayout === 'split' && grm.ui.displayPlaylist;
						grm.ui.displayBiography = false;
						grm.ui.displayLyrics = false;
						this.jSearch = ''; // Reset to avoid conflict with other query
						grm.button.initButtonState();
					}

					lib.timer.jsearch1.id = null;
				}, 500);

				lib.timer.clear(lib.timer.jsearch2);

				lib.timer.jsearch2.id = setTimeout(() => {
					if (foundInLibrary) {
						if (libSet.libSource) {
							if (lib.pop.autoFill.key) lib.pop.load(lib.pop.sel_items, true, false, false, !libSet.sendToCur, false);
							lib.pop.track(lib.pop.autoFill.key);
						} else if (pos >= 0 && pos < lib.pop.tree.length) lib.pop.setPlaylistSelection(pos, lib.pop.tree[pos]);
					}
					this.jSearch = '';
					lib.panel.treePaint();
					lib.timer.jsearch2.id = null;
				}, 1200);
			}
		}
	}

	on_size() {
		this.j.x = Math.round(lib.ui.x + lib.ui.w / 2);
		this.j.h = Math.round(lib.ui.row.h * 1.5);
		this.j.y = Math.round(lib.ui.y + (lib.ui.h - this.j.h) / 2);
		this.arc1 = Math.min(5, this.j.h / 2);
		this.arc2 = Math.min(4, (this.j.h - 2) / 2);
	}
}
