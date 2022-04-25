function on_colours_changed() {
	ui.getColours();

	if (panel.colMarker) {
		panel.getFields(ppt.viewBy, ppt.filterBy);
		if (lib) {
			lib.getLibrary();
			lib.rootNodes(true, true);
		}
	}

	sbar.setCol();
	pop.createImages();
	but.createImages();
	img.clearCache();
	img.createImages();
	but.refresh(true);
	sbar.resetAuto();
	ui.createImages();
	ui.blurReset();
	window.Repaint();
}

function on_font_changed() {
	sbar.logScroll();
	pop.deactivateTooltip();
	ui.getFont();
	panel.on_size(true);
	if (ui.style.topBarShow || ppt.sbarShow) but.refresh(true);
	sbar.resetAuto();
	window.Repaint();
	sbar.setScroll();
}

function on_char(code) {
	pop.on_char(code);
	find.on_char(code);
	if (!ppt.searchShow) return;
	search.on_char(code);
}

function on_focus(is_focused) {
	if (!is_focused) {
		timer.clear(timer.cursor);
		panel.search.cursor = false;
		panel.searchPaint();
	}
	pop.on_focus(is_focused);
}

function on_get_album_art_done(handle, art_id, image, image_path) {
	ui.on_get_album_art_done(handle, image, image_path);
}

function on_metadb_changed(handleList, isDatabase) {
	if (isDatabase && !panel.statistics) return;
	if (ppt.fixedPlaylist || !ppt.libSource) {
		handleList.Convert().some(h => {
			const i = lib.full_list.Find(h);
			if (i != -1) {
				lib.treeState(false, 2);
				ui.focus_changed();
				return true;
			}
		});
	}
}

function setSelection(handle) {
	if (!handle || !panel.list.Count) return;
	const item = panel.list.Find(handle);
	let idx = -1;
	pop.tree.forEach((v, i) => {
		if (!v.root && pop.inRange(item, v.item)) idx = i;
	});
	if (idx != -1) {
		if (!panel.imgView) pop.focusShow(idx);
		else pop.showItem(idx, 'focus');
	}
}

function on_item_focus_change(playlistIndex) {
	if (!pop.setFocus) {
		if (ppt.followPlaylistFocus && playlistIndex == $Lib.pl_active && !ppt.libSource) {
			setSelection(fb.GetFocusItem());
		}
	} else pop.setFocus = false;
	ui.focus_changed();
}

function on_selection_changed() {
	if (!img.setSelection()) return;
	setSelection(fb.GetSelection());
}

function on_key_down(vkey) {
	pop.on_key_down(vkey);
	img.on_key_down(vkey);
	if (!ppt.searchShow) return;
	search.on_key_down(vkey);
}

function on_key_up(vkey) {
	img.on_key_up(vkey);
	if (!ppt.searchShow) return;
	search.on_key_up(vkey)
}

function on_library_items_added(handleList) {
	if (!ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
	if (ppt.libSource == 2) {
		const libList = lib.list.Clone();
		libList.Sort();
		handleList.Sort();
		handleList.MakeIntersection(libList);
	}
	lib.treeState(false, 2, handleList, 0);
}

function on_library_items_removed(handleList) {
	if (!ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
	if (ppt.libSource == 2) {
		const libList = lib.list.Clone();
		libList.Sort();
		handleList.Sort();
		handleList.MakeIntersection(libList);
	}
	lib.treeState(false, 2, handleList, 2);
}

function on_library_items_changed(handleList) {
	if (!ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
	if (ppt.libSource == 2) {
		const libList = lib.list.Clone();
		libList.Sort();
		handleList.Sort();
		handleList.MakeIntersection(libList);
	}
	lib.treeState(false, 2, handleList, 1);
}

function on_main_menu(index) {
	pop.on_main_menu(index);
}

function on_mouse_lbtn_dblclk(x, y) {
	but.lbtn_dn(x, y);
	if (ppt.searchShow) search.lbtn_dblclk(x, y);
	pop.lbtn_dblclk(x, y);
	sbar.lbtn_dblclk(x, y);
}

function on_mouse_lbtn_down(x, y) {
	if (ppt.touchControl) panel.last_pressed_coord = {
		x: x,
		y: y
	};
	if (ppt.searchShow || ppt.sbarShow) but.lbtn_dn(x, y);
	if (ppt.searchShow) search.lbtn_dn(x, y);
	pop.lbtn_dn(x, y);
	sbar.lbtn_dn(x, y);
	ui.sz.y_start = y;
}

function on_mouse_lbtn_up(x, y) {
	pop.lbtn_up(x, y);
	if (ppt.searchShow) search.lbtn_up();
	but.lbtn_up(x, y);
	sbar.lbtn_up();
}

function on_mouse_leave() {
	if (ppt.searchShow || ppt.sbarShow) but.leave();
	sbar.leave();
	pop.leave();
}

function on_mouse_mbtn_up(x, y) {
	pop.mbtn_up(x, y);
}

function on_mouse_move(x, y) {
	if (panel.m.x == x && panel.m.y == y) return;
	pop.hand = false;
	if (ppt.searchShow || ppt.sbarShow) but.move(x, y);
	if (ppt.searchShow) search.move(x, y);
	if (pref.libraryRowHover) pop.move(x, y);
	pop.dragDrop(x, y);
	sbar.move(x, y);
	ui.zoomDrag(x, y);
	panel.m.x = x;
	panel.m.y = y;

	initScrollbarState(x, y);
}

function on_mouse_rbtn_up(x, y) {
	if (y < ui.y + panel.search.h && x > panel.search.x && x < panel.search.x + panel.search.w) {
		if (ppt.searchShow) search.rbtn_up(x, y);
	} else men.rbtn_up(x, y);
	return true;
}

function on_mouse_wheel(step) {
	pop.deactivateTooltip();
	if (!vk.k('zoom')) sbar.wheel(step);
	else ui.wheel(step);
}

function on_notify_data(name, info) {
	switch (name) {
		case 'lt_panelHandleList':
			if (ppt.libSource == 2) {
				lib.list = new FbMetadbHandleList(info);
				lib.full_list = lib.list.Clone();
				const pln = plman.FindOrCreatePlaylist('Library Tree Panel Selection', false);
				plman.ClearPlaylist(pln);
				plman.InsertPlaylistItems(pln, 0, lib.list);
				lib.searchCache = {};
				pop.clearTree();
				lib.treeState(false, 2, null, 3);
			}
			break;
		case '!!.tags update':
			lib.treeState(false, 2);
			break;
	}
	if (ui.id.local) {
		const clone = typeof info === 'string' ? String(info) : info;
		on_notify(name, clone);
	}
}

// function on_paint(gr) {
// 	ui.draw(gr);
// 	lib.checkTree();
// 	img.draw(gr);
// 	ui.drawLine(gr);
// 	search.draw(gr);
// 	pop.draw(gr);
// 	sbar.draw(gr);
// 	but.draw(gr);
// 	find.draw(gr);
// }

function on_playback_new_track(handle) {
	lib.checkFilter();
	pop.getNowplaying(handle);
	ui.on_playback_new_track(handle);
	if (pref.always_showPlayingLib) {
		pop.nowPlayingShow();
	}
}

function on_playback_stop(reason) {
	if (reason == 2) return;
	pop.getNowplaying('', true);
	on_item_focus_change();
}

function on_playlists_changed() {
	men.playlists_changed();
	if ($Lib.pl_active != plman.ActivePlaylist) $Lib.pl_active = plman.ActivePlaylist;
	let fixedPlaylistIndex = -1;
	if (ppt.fixedPlaylist) {
		fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
		if (fixedPlaylistIndex == -1) {
			ppt.fixedPlaylist = false;
			ppt.libSource = 0;
			if (panel.imgView) img.clearCache();
			lib.playlist_update();
		}
	}
}

function on_playlist_items_added(playlistIndex) {
	if (ppt.fixedPlaylist) {
		const fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
		if (playlistIndex == fixedPlaylistIndex) {
			lib.playlist_update(playlistIndex);

			return
		}
	}
	if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
		lib.playlist_update(playlistIndex);

	}
	initPlaylist(); // Update Playlist when adding items from Library
}

function on_playlist_items_removed(playlistIndex) {
	if (ppt.fixedPlaylist) {
		const fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
		if (playlistIndex == fixedPlaylistIndex) {
			lib.playlist_update(playlistIndex);
			return
		}
	}

	if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
		lib.playlist_update(playlistIndex);
	}
}

function on_playlist_items_reordered(playlistIndex) {
	if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
		lib.playlist_update(playlistIndex);
	}
}

function on_playlist_switch() {
	$Lib.pl_active = plman.ActivePlaylist;
	if (!ppt.libSource) {
		lib.playlist_update();
	}
	ui.focus_changed();
}

function on_script_unload() {
	but.on_script_unload();
	pop.deactivateTooltip();
}

// function on_size() {
// 	ui.w = window.Width;
// 	ui.h = window.Height;
// 	if (!ui.w || !ui.h) return;
// 	pop.deactivateTooltip();
// 	ui.blurReset();
// 	ui.getFont();
// 	panel.on_size();
// 	if (ppt.searchShow || ppt.sbarShow) but.refresh(true);
// 	sbar.resetAuto();
// 	find.on_size();
// }


class LibraryCallbacks {

	on_colours_changed() {
		ui.getColours();

		if (panel.colMarker) {
			panel.getFields(ppt.viewBy, ppt.filterBy);
			if (lib) {
				lib.getLibrary();
				lib.rootNodes(true, true);
			}
		}

		sbar.setCol();
		pop.createImages();
		but.createImages();
		img.clearCache();
		img.createImages();
		but.refresh(true);
		sbar.resetAuto();
		ui.createImages();
		ui.blurReset();
		window.Repaint();
	}

	on_font_changed() {
		sbar.logScroll();
		pop.deactivateTooltip();
		ui.getFont();
		panel.on_size(true);
		if (ui.style.topBarShow || ppt.sbarShow) but.refresh(true);
		sbar.resetAuto();
		window.Repaint();
		sbar.setScroll();
	}

	on_char(code) {
		pop.on_char(code);
		find.on_char(code);
		if (!ppt.searchShow) return;
		search.on_char(code);
	}

	on_focus(is_focused) {
		if (!is_focused) {
			timer.clear(timer.cursor);
			panel.search.cursor = false;
			panel.searchPaint();
		}
		pop.on_focus(is_focused);
	}

	on_get_album_art_done(handle, art_id, image, image_path) {
		ui.on_get_album_art_done(handle, image, image_path);
	}

	on_metadb_changed(handleList, isDatabase) {
		if (isDatabase && !panel.statistics) return;
		if (ppt.fixedPlaylist || !ppt.libSource) {
			handleList.Convert().some(h => {
				const i = lib.full_list.Find(h);
				if (i != -1) {
					lib.treeState(false, 2);
					ui.focus_changed();
					return true;
				}
			});
		}
	}

	setSelection(handle) {
		if (!handle || !panel.list.Count) return;
		const item = panel.list.Find(handle);
		let idx = -1;
		pop.tree.forEach((v, i) => {
			if (!v.root && pop.inRange(item, v.item)) idx = i;
		});
		if (idx != -1) {
			if (!panel.imgView) pop.focusShow(idx);
			else pop.showItem(idx, 'focus');
		}
	}

	on_item_focus_change(playlistIndex) {
		if (!pop.setFocus) {
			if (ppt.followPlaylistFocus && playlistIndex == $Lib.pl_active && !ppt.libSource) {
				setSelection(fb.GetFocusItem());
			}
		} else pop.setFocus = false;
		ui.focus_changed();
	}

	on_selection_changed() {
		if (!img.setSelection()) return;
		setSelection(fb.GetSelection());
	}

	on_key_down(vkey) {
		pop.on_key_down(vkey);
		img.on_key_down(vkey);
		if (!ppt.searchShow) return;
		search.on_key_down(vkey);
	}

	on_key_up(vkey) {
		img.on_key_up(vkey);
		if (!ppt.searchShow) return;
		search.on_key_up(vkey)
	}

	on_library_items_added(handleList) {
		if (!ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
		if (ppt.libSource == 2) {
			const libList = lib.list.Clone();
			libList.Sort();
			handleList.Sort();
			handleList.MakeIntersection(libList);
		}
		lib.treeState(false, 2, handleList, 0);
	}

	on_library_items_removed(handleList) {
		if (!ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
		if (ppt.libSource == 2) {
			const libList = lib.list.Clone();
			libList.Sort();
			handleList.Sort();
			handleList.MakeIntersection(libList);
		}
		lib.treeState(false, 2, handleList, 2);
	}

	on_library_items_changed(handleList) {
		if (!ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
		if (ppt.libSource == 2) {
			const libList = lib.list.Clone();
			libList.Sort();
			handleList.Sort();
			handleList.MakeIntersection(libList);
		}
		lib.treeState(false, 2, handleList, 1);
	}

	on_main_menu(index) {
		pop.on_main_menu(index);
	}

	on_mouse_lbtn_dblclk(x, y) {
		but.lbtn_dn(x, y);
		if (ppt.searchShow) search.lbtn_dblclk(x, y);
		pop.lbtn_dblclk(x, y);
		sbar.lbtn_dblclk(x, y);
	}

	on_mouse_lbtn_down(x, y) {
		if (ppt.touchControl) panel.last_pressed_coord = {
			x: x,
			y: y
		};
		if (ppt.searchShow || ppt.sbarShow) but.lbtn_dn(x, y);
		if (ppt.searchShow) search.lbtn_dn(x, y);
		pop.lbtn_dn(x, y);
		sbar.lbtn_dn(x, y);
		ui.sz.y_start = y;
	}

	on_mouse_lbtn_up(x, y) {
		pop.lbtn_up(x, y);
		if (ppt.searchShow) search.lbtn_up();
		but.lbtn_up(x, y);
		sbar.lbtn_up();
	}

	on_mouse_leave() {
		if (ppt.searchShow || ppt.sbarShow) but.leave();
		sbar.leave();
		pop.leave();
	}

	on_mouse_mbtn_up(x, y) {
		pop.mbtn_up(x, y);
	}

	on_mouse_move(x, y) {
		if (panel.m.x == x && panel.m.y == y) return;
		pop.hand = false;
		if (ppt.searchShow || ppt.sbarShow) but.move(x, y);
		if (ppt.searchShow) search.move(x, y);
		if (pref.libraryRowHover) pop.move(x, y);
		pop.dragDrop(x, y);
		sbar.move(x, y);
		ui.zoomDrag(x, y);
		panel.m.x = x;
		panel.m.y = y;

		initScrollbarState(x, y);
	}

	on_mouse_rbtn_up(x, y) {
		if (y < ui.y + panel.search.h && x > panel.search.x && x < panel.search.x + panel.search.w) {
			if (ppt.searchShow) search.rbtn_up(x, y);
		} else men.rbtn_up(x, y);
		return true;
	}

	on_mouse_wheel(step) {
		pop.deactivateTooltip();
		if (!vk.k('zoom')) sbar.wheel(step);
		else ui.wheel(step);
	}

	on_notify_data(name, info) {
		switch (name) {
			case 'lt_panelHandleList':
				if (ppt.libSource == 2) {
					lib.list = new FbMetadbHandleList(info);
					lib.full_list = lib.list.Clone();
					const pln = plman.FindOrCreatePlaylist('Library Tree Panel Selection', false);
					plman.ClearPlaylist(pln);
					plman.InsertPlaylistItems(pln, 0, lib.list);
					lib.searchCache = {};
					pop.clearTree();
					lib.treeState(false, 2, null, 3);
				}
				break;
			case '!!.tags update':
				lib.treeState(false, 2);
				break;
		}
		if (ui.id.local) {
			const clone = typeof info === 'string' ? String(info) : info;
			on_notify(name, clone);
		}
	}

	on_paint(gr) {
		ui.draw(gr);
		lib.checkTree();
		img.draw(gr);
		ui.drawLine(gr);
		search.draw(gr);
		pop.draw(gr);
		sbar.draw(gr);
		but.draw(gr);
		find.draw(gr);
	}

	on_playback_new_track(handle) {
		lib.checkFilter();
		pop.getNowplaying(handle);
		ui.on_playback_new_track(handle);
		if (pref.always_showPlayingLib) {
			pop.nowPlayingShow();
		}
	}

	on_playback_stop(reason) {
		if (reason == 2) return;
		pop.getNowplaying('', true);
		on_item_focus_change();
	}

	on_playlists_changed() {
		men.playlists_changed();
		if ($Lib.pl_active != plman.ActivePlaylist) $Lib.pl_active = plman.ActivePlaylist;
		let fixedPlaylistIndex = -1;
		if (ppt.fixedPlaylist) {
			fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
			if (fixedPlaylistIndex == -1) {
				ppt.fixedPlaylist = false;
				ppt.libSource = 0;
				if (panel.imgView) img.clearCache();
				lib.playlist_update();
			}
		}
	}

	on_playlist_items_added(playlistIndex) {
		if (ppt.fixedPlaylist) {
			const fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
			if (playlistIndex == fixedPlaylistIndex) {
				lib.playlist_update(playlistIndex);

				return
			}
		}
		if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
			lib.playlist_update(playlistIndex);

		}
		initPlaylist(); // Update Playlist when adding items from Library
	}

	on_playlist_items_removed(playlistIndex) {
		if (ppt.fixedPlaylist) {
			const fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
			if (playlistIndex == fixedPlaylistIndex) {
				lib.playlist_update(playlistIndex);
				return
			}
		}

		if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
			lib.playlist_update(playlistIndex);
		}
	}

	on_playlist_items_reordered(playlistIndex) {
		if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
			lib.playlist_update(playlistIndex);
		}
	}

	on_playlist_switch() {
		$Lib.pl_active = plman.ActivePlaylist;
		if (!ppt.libSource) {
			lib.playlist_update();
		}
		ui.focus_changed();
	}

	on_script_unload() {
		but.on_script_unload();
		pop.deactivateTooltip();
	}

	on_size() {
		ui.w = window.Width;
		ui.h = window.Height;
		if (!ui.w || !ui.h) return;
		pop.deactivateTooltip();
		ui.blurReset();
		ui.getFont();
		panel.on_size();
		if (ppt.searchShow || ppt.sbarShow) but.refresh(true);
		sbar.resetAuto();
		find.on_size();
		but.createImages();
		pop.createImages();
	}

	mouse_in_this(x, y) {
		return (x >= ui.x && x < ui.x + ui.w && y >= ui.y && y < ui.y + ui.h);
	}
}
