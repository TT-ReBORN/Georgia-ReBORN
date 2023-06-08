'use strict';

class LibraryCallbacks {
	mouse_in_this(x, y) {
		return (x >= ui.x && x < ui.x + ui.w && y >= ui.y && y < ui.y + ui.h);
	}

	on_colours_changed(keepCache) {
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
		if (!keepCache) img.clearCache();
		img.createImages();
		but.refresh(true);
		sbar.resetAuto();
		ui.createImages();
		if (!ppt.themed) ui.blurReset();
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

	on_item_focus_change(playlistIndex) {
		lib.checkFilter();
		if (!pop.setFocus) {
			if (ppt.followPlaylistFocus && playlistIndex == $Lib.pl_active && !ppt.libSource) {
				setSelection(fb.GetFocusItem());
			}
		} else pop.setFocus = false;
		ui.focus_changed();
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
		search.on_key_up(vkey);
	}

	on_library_items_added(handleList) {
		if (ppt.libSource == 2) return;
		if (lib.v2_init) {
			lib.v2_init = false;
			if (ui.w < 1 || !window.IsVisible) return;
			lib.initialise(handleList);
			return;
		}
		if (!libraryInitialized || !ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
		lib.treeState(false, 2, handleList, 0);
	}

	on_library_items_removed(handleList) {
		if (!libraryInitialized || !ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
		if (ppt.libSource == 2) {
			const libList = lib.list.Clone();
			libList.Sort();
			handleList.Sort();
			handleList.MakeIntersection(libList);
		}
		lib.treeState(false, 2, handleList, 2);
	}

	on_library_items_changed(handleList) {
		if (!libraryInitialized || !ppt.libAutoSync || ppt.fixedPlaylist || !ppt.libSource) return;
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

	on_metadb_changed(handleList, isDatabase) {
		if (isDatabase && !panel.statistics || lib.list.Count != lib.libNode.length) return;
		if (ppt.fixedPlaylist || !ppt.libSource) {
			handleList.Convert().some(h => {
				const i = lib.full_list.Find(h);
				if (i != -1) {
					const isMainChanged = lib.isMainChanged(handleList);
					if (isMainChanged) lib.treeState(false, 2);
					ui.focus_changed();
					return true;
				}
			});
		}
	}

	on_mouse_lbtn_dblclk(x, y) {
		but.lbtn_dn(x, y);
		if (ppt.searchShow) search.lbtn_dblclk(x, y);
		pop.lbtn_dblclk(x, y);
		sbar.lbtn_dblclk(x, y);
	}

	on_mouse_lbtn_down(x, y) {
		if (ppt.touchControl) {
			panel.last_pressed_coord = {
				x,
				y
			};
		}
		if (ui.style.topBarShow || ppt.sbarShow) but.lbtn_dn(x, y);
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
		if (ui.style.topBarShow || ppt.sbarShow) but.leave();
		sbar.leave();
		pop.leave();
	}

	on_mouse_mbtn_dblclk(x, y, mask) {
		pop.mbtnDblClickOrAltDblClick(x, y, mask, 'mbtn');
	}

	on_mouse_mbtn_down(x, y) {
		pop.mbtn_dn(x, y);
	}

	on_mouse_mbtn_up(x, y, mask) {
		// UIHacks at default settings blocks on_mouse_mbtn_up, at least in windows; workaround configure hacks: main window > move with > caption only & ensure pseudo-caption doesn't overlap buttons
		pop.mbtnUpOrAltClickUp(x, y, mask, 'mbtn');
	}

	on_mouse_move(x, y) {
		if (panel.m.x == x && panel.m.y == y) return;
		pop.hand = false;
		if (ui.style.topBarShow || ppt.sbarShow) but.move(x, y);
		if (ppt.searchShow) search.move(x, y);
		if (pref.libraryRowHover) pop.move(x, y);
		pop.dragDrop(x, y);
		sbar.move(x, y);
		ui.zoomDrag(x, y);
		panel.m.x = x;
		panel.m.y = y;
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
		if (ppt.libSource == 2 && name != 'bio_imgChange') {
			const panelSelectionPlaylists = ppt.panelSelectionPlaylist.split(/\s*\|\s*/);
			panelSelectionPlaylists.some(v => {
				if (name == v) {
					lib.list = new FbMetadbHandleList(info);
					if ($Lib.equalHandles(lib.list.Convert(), lib.full_list.Convert())) return;
					lib.full_list = lib.list.Clone();
					ppt.lastPanelSelectionPlaylist = `${v} Cache`;
					const pln = plman.FindOrCreatePlaylist(`${v} Cache`, false);
					plman.ClearPlaylist(pln);
					plman.InsertPlaylistItems(pln, 0, lib.list);
					lib.searchCache = {};
					pop.clearTree();
					pop.cache = {
						standard: {},
						search: {},
						filter: {}
					}
					lib.treeState(false, 2, null, 3);
					ui.expandHandle = lib.list.Count ? lib.list[0] : null;
					ui.on_playback_new_track();
					lib.treeState(false, ppt.rememberTree);
				}
			});
		}

		switch (name) {
			case '!!.tags update':
				lib.treeState(false, 2);
				break;
			case 'newThemeColours':
				if (!ppt.themed) break;
				ppt.theme = info.theme;
				ppt.themeBgImage = info.themeBgImage;
				ppt.themeColour = info.themeColour;
				on_colours_changed(true);
				break;
			case 'Sync col': {
				if (!ppt.themed) break;
				const themeLight = ppt.themeLight;
				if (themeLight != info.themeLight) {
					ppt.themeLight = info.themeLight;
					on_colours_changed(true);
				}
				break;
			}
			case 'Sync image':
				if (!ppt.themed) break;
				sync.image(new GdiBitmap(info.image), info.id);
				break;
		}
		if (ui.id.local && name.startsWith('opt_')) {
			const clone = typeof info === 'string' ? String(info) : info;
			on_notify(name, clone);
		}
	}

	// on_paint(gr) {
	// if (!lib.initialised) {
	// 	lib.initialise();
	// }
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

	on_playback_new_track(handle) {
		lib.checkFilter();
		pop.getNowplaying(handle);
		if (pref.libraryAutoScrollNowPlaying) pop.nowPlayingShow();
		if (!ppt.recItemImage || ppt.libSource != 2) ui.on_playback_new_track(handle);
	}

	on_playback_stop(reason) {
		if (reason == 2) return;
		pop.getNowplaying('', true);
		on_item_focus_change();
	}

	on_playback_queue_changed() {
		on_queue_changed();
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
				return;
			}
		}
		if (!ppt.libSource && playlistIndex == $Lib.pl_active) {
			lib.playlist_update(playlistIndex);
		}

		if (pref.playlistSortOrderAuto) setPlaylistSortOrder();
		initPlaylist(); // Update Playlist when adding items from Library
		playlist.on_size(ww, wh);
	}

	on_playlist_items_removed(playlistIndex) {
		if (ppt.fixedPlaylist) {
			const fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
			if (playlistIndex == fixedPlaylistIndex) {
				lib.playlist_update(playlistIndex);
				return;
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

	on_selection_changed() {
		if (!panel.setSelection()) return;
		setSelection(fb.GetSelection());
	}

	// on_size() {
	// 	ui.w = window.Width;
	// 	ui.h = window.Height;
	// 	if (!ui.w || !ui.h) return;

	// 	pop.deactivateTooltip();
	// 	tooltipLib.SetMaxWidth(Math.max(ui.w, scaleForDisplay(pref.layout !== 'default' ? 600 : 800)));
	// 	ui.blurReset();
	// 	ui.calcText(true)

	// 	if (ppt.themed && ppt.theme) {
	// 		const themed_image = `${fb.ProfilePath}settings\\themed\\themed_image.bmp`;
	// 		if ($Lib.file(themed_image)) sync.image(gdi.Image(themed_image));
	// 	}

	// 	panel.on_size();
	// 	if (ui.style.topBarShow || ppt.sbarShow) but.refresh(true);
	// 	sbar.resetAuto();
	// 	find.on_size();
	// 	but.createImages();
	// 	pop.createImages();

	// 	if (!ppt.themed) return;
	// 	const windowMetrics = $Lib.jsonParse(windowMetricsPath, {}, 'file');
	// 	windowMetrics[window.Name] = {
	// 		w: ui.w,
	// 		h: ui.h
	// 	}
	// 	$Lib.save(windowMetricsPath, JSON.stringify(windowMetrics, null, 3), true);
	// }

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
}


class LibraryPanel {
	constructor() {
		this.x = -1; // not set
		this.y = -1; // not set
		this.w = -1; // not set
		this.h = -1; // not set
	}

	on_paint(gr) {
		if (!lib.initialised) {
			lib.initialise();
		}
		ui.draw(gr);
		lib.checkTree();
		img.draw(gr);
		ui.drawLine(gr);
		search.draw(gr);
		pop.draw(gr);
		sbar.draw(gr);
		but.draw(gr);
		find.draw(gr);

		if (ppt.albumArtFlowMode && panel.imgView) {
			gr.FillSolidRect(this.x, this.y, scaleForDisplay(20), this.h, ui.col.bg); // Margin left and masking for horizontal flow mode
			gr.FillSolidRect(this.x + this.w - scaleForDisplay(20), this.y, scaleForDisplay(20), this.h, ui.col.bg); // Margin right and masking for horizontal flow mode
			if (pref.styleBlend && albumArt && blendedImg) {
				gr.DrawImage(blendedImg, this.x - this.w + scaleForDisplay(20), this.y, ww, wh, this.x - this.w + scaleForDisplay(20), this.y, blendedImg.Width, blendedImg.Height);
				gr.DrawImage(blendedImg, this.x + this.w - scaleForDisplay(20), this.y, ww, wh, this.x + this.w - scaleForDisplay(20), this.y, blendedImg.Width, blendedImg.Height);
			}
		}

		gr.FillSolidRect(this.x, 0, this.w, geo.topMenuHeight, col.bg); // Hides top row that shouldn't be visible in album art mode
		gr.FillSolidRect(this.x, this.y + this.h, this.w, this.h, col.bg); // Hides bottom row that shouldn't be visible in album art mode
		if (UIHacks.Aero.Effect === 2) gr.DrawLine(this.x, 0, ww, 0, 1, col.bg); // UIHacks aero glass shadow frame fix - needed for style Blend

		if (pref.styleBlend && albumArt && blendedImg) {
			gr.DrawImage(blendedImg, this.x, this.y - this.h - geo.topMenuHeight - geo.lowerBarHeight, ww, wh, this.x, this.y - this.h - geo.topMenuHeight - geo.lowerBarHeight, blendedImg.Width, blendedImg.Height);
			gr.DrawImage(blendedImg, this.x, this.y + this.h, ww, wh, this.x, this.y + this.h, blendedImg.Width, blendedImg.Height);
		}
	}

	on_size(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		ui.x = x;
		ui.y = y;
		ui.w = width;
		ui.h = height;
		ppt.margin = scaleForDisplay(20);
		ppt.verticalPad = 5; // Setup default line padding value needed, otherwise 0 on reset
		if (!ui.w || !ui.h) return;

		pop.deactivateTooltip();
		tooltipLib.SetMaxWidth(Math.max(ui.w, scaleForDisplay(pref.layout !== 'default' ? 600 : 800)));
		ui.blurReset();
		ui.calcText(true);

		if (ppt.themed && ppt.theme) {
			const themed_image = pref.customLibraryDir ? `${globals.customLibraryDir}cache\\library\\themed\\themed_image.bmp` : `${fb.ProfilePath}cache\\library\\themed\\themed_image.bmp`;
			if ($Lib.file(themed_image)) sync.image(gdi.Image(themed_image));
		}

		panel.on_size();
		if (ui.style.topBarShow || ppt.sbarShow) but.refresh(true);
		sbar.resetAuto();
		find.on_size();
		but.createImages();
		pop.createImages();

		if (!ppt.themed) return;
		const windowMetrics = $Lib.jsonParse(windowMetricsPath, {}, 'file');
		windowMetrics[window.Name] = {
			w: ui.w,
			h: ui.h
		}
		$Lib.save(windowMetricsPath, JSON.stringify(windowMetrics, null, 3), true);
	}
}


////////////////////////
// * INIT CALLBACKS * //
////////////////////////
/** @type {LibraryCallbacks} */
let library = new LibraryCallbacks();
/** @type {LibraryPanel} */
let libraryPanel = new LibraryPanel();

this.on_colours_changed = () => library.on_colours_changed();
this.on_font_changed = () => library.on_font_changed();
this.on_char = (code) => library.on_char(code);
this.on_focus = (is_focused) => library.on_focus(is_focused);
this.on_get_album_art_done = (handle, art_id, image, image_path) => library.on_get_album_art_done(handle, art_id, image, image_path);
this.on_metadb_changed = (handleList, isDatabase) => library.on_metadb_changed(handleList, isDatabase);
this.on_item_focus_change = (playlistIndex) => library.on_item_focus_change(playlistIndex);
this.on_selection_changed = () => library.on_selection_changed();
this.on_key_down = (vkey) => library.on_key_down(vkey);
this.on_key_up = (vkey) => library.on_key_up(vkey);
this.on_library_items_added = (handleList) => library.on_library_items_added(handleList);
this.on_library_items_removed = (handleList) => library.on_library_items_removed(handleList);
this.on_library_items_changed = (handleList) => library.on_library_items_changed(handleList);
this.on_main_menu = (index) => library.on_main_menu(index);
this.on_mouse_lbtn_dblclk = (x, y) => library.on_mouse_lbtn_dblclk(x, y);
this.on_mouse_lbtn_down = (x, y) => library.on_mouse_lbtn_down(x, y);
this.on_mouse_lbtn_up = (x, y) => library.on_mouse_lbtn_up(x, y);
this.on_mouse_leave = () => library.on_mouse_leave();
this.on_mouse_mbtn_dblclk = (x, y, mask) => library.on_mouse_mbtn_dblclk(x, y, mask);
this.on_mouse_mbtn_down = (x, y) => library.on_mouse_mbtn_down(x, y);
this.on_mouse_mbtn_up = (x, y, mask) => library.on_mouse_mbtn_up(x, y, mask);
this.on_mouse_move = (x, y) => library.on_mouse_move(x, y);
this.on_mouse_rbtn_up = (x, y) => library.on_mouse_rbtn_up(x, y);
this.on_mouse_wheel = (step) => library.on_mouse_wheel(step);
this.on_notify_data = (name, info) => library.on_notify_data(name, info);
this.on_playback_new_track = (handle) => library.on_playback_new_track(handle);
this.on_playback_stop = (reason) => library.on_playback_stop(reason);
this.on_playback_queue_changed = () => library.on_playback_queue_changed();
this.on_playlists_changed = () => library.on_playlists_changed();
this.on_playlist_items_added = (playlistIndex) => library.on_playlist_items_added(playlistIndex);
this.on_playlist_items_removed = (playlistIndex) => library.on_playlist_items_removed(playlistIndex);
this.on_playlist_items_reordered = (playlistIndex) => library.on_playlist_items_reordered(playlistIndex);
this.on_playlist_switch = () => library.on_playlist_switch();
this.on_script_unload = () => library.on_script_unload();
this.on_selection_changed = () => library.on_selection_changed();
this.setSelection = (handle) => library.setSelection(handle);


function initLibraryPanel() {
	if (libraryInitialized) return;
	ui = new UserInterface();
	panel = new Panel();
	sbar = new Scrollbar();
	vk = new Vkeys();
	lib = new Library();
	pop = new Populate();
	search = new Search();
	find = new Find();
	but = new Buttons();
	popUpBox = new PopUpBox();
	men = new MenuItems();
	timer = new Timers();
	libraryPanel = new LibraryPanel();
	library = new LibraryCallbacks();
	libraryInitialized = true;
}


//////////////////////////
// * CUSTOM CALLBACKS * //
//////////////////////////
/** Dynamic library album cover thumbnail resizing */
function autoThumbnailSize() {
	if (pref.libraryThumbnailSize !== 'auto') return;
	const noStd = ['coversLabelsRight', 'artistLabelsRight'].includes(pref.libraryDesign) || ppt.albumArtLabelType === 2;
	const fullW = pref.libraryLayout === 'full' && pref.layout === 'default';

	if (!is_4k && !is_QHD) {
		if (pref.layout === 'default' && ww < 1600 && wh < 960 || pref.layout === 'artwork' && ww < 700 && wh < 860) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
			pref.layout === 'artwork' ? 1 : 2; // Thumbnail size 'Small' or 'Regular'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 1600 && wh >= 960 || pref.layout === 'artwork' && ww >= 700 && wh >= 860) {
			ppt.thumbNailSize = noStd && fullW ? 2 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
			fullW ? 3 : 3; // Thumbnail size 'Medium'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 1802 && wh >= 1061 || pref.layout === 'artwork' && ww >= 901 && wh >= 1062) {
			ppt.thumbNailSize = noStd && !fullW ? 2 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
			fullW ? ww === 1802 && wh === 1061 ? 5 : 4 : 3; // Thumbnail size 'XL' or 'Large' or 'Medium'
			ppt.verticalAlbumArtPad = 2;
		}
	}
	else if (is_QHD) {
		if (pref.layout === 'default' && ww < 1802 && wh < 1061 || pref.layout === 'artwork' && ww < 901 && wh < 1061) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
			pref.layout === 'artwork' ? 1 : 2; // Thumbnail size 'Small' or 'Regular'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 1802 && wh >= 1061 || pref.layout === 'artwork' && ww >= 901 && wh >= 1061) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
			fullW ? 4 : 2; // Thumbnail size 'Medium' or 'Regular'
			ppt.verticalAlbumArtPad = 3;
		}
		if (pref.layout === 'default' && ww >= 2280 && wh >= 1300 || pref.layout === 'artwork' && ww >= 1140 && wh >= 1300) {
			ppt.thumbNailSize = noStd && !fullW ? 2 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
			fullW ? 5 : 3; // Thumbnail size 'Large' or 'Medium'
			ppt.verticalAlbumArtPad = fullW ? 2 : 3;
		}
	}
	else if (is_4k) {
		if (pref.layout === 'default' && ww < 2800 && wh < 1720 || pref.layout === 'artwork' && ww < 1400 && wh < 1720) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
			fullW ? 2 : 1;  // Thumbnail size 'Small'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 2800 && wh >= 1720 || pref.layout === 'artwork' && ww >= 1400 && wh >= 1720) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
			fullW ? 3 : 1; // Thumbnail size 'Regular' or 'Small'
			ppt.verticalAlbumArtPad = 3;
		}
		if (pref.layout === 'default' && ww >= 3400 && wh >= 2020 || pref.layout === 'artwork' && ww >= 1400 && wh >= 1720) {
			ppt.thumbNailSize = noStd && !fullW ? 1 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
			fullW ? ww === 3400 && wh === 2020 ? 4 : 4 : 2; // Thumbnail size 'Medium' or 'Regular'
			ppt.verticalAlbumArtPad = 2;
		}
	}
	img.sizeDebounce();
}


function libraryLayoutFullPreset() {
	pref.libraryDesign = 'reborn';
	panel.imgView = ppt.albumArtShow = true;
	pref.libraryThumbnailSize = 'auto';
	ppt.thumbNailSize = pref.playerSize_HD_small && ppt.thumbNailSize === 'auto' ? 1 : 'auto';
	ppt.albumArtLabelType = 1;
	lib.logTree();
	pop.clearTree();
	repaintWindowRectAreas();
	ppt.toggle('albumArtShow');
	panel.imgView = pref.libraryLayoutFullPreset && pref.layout === 'default' && pref.libraryLayout === 'full' ? ppt.albumArtShow = true : ppt.albumArtShow = !!pref.libraryLayoutRememberAlbumArtView;
	men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
	autoThumbnailSize();
	setLibrarySize();
	initLibraryColors();
	window.Repaint();
}


function libraryLayoutSplitPreset() {
	if (pref.layout !== 'default') return;

	if (pref.playlistLayout === 'full') {
		pref.playlistLayout = 'normal';
	}

	if (pref.libraryLayoutSplitPreset) {
		pref.libraryDesign = 'reborn';
		pref.libraryThumbnailSize = 'playlist';
		panel.imgView = ppt.albumArtShow = false;
		g_properties.show_header = true;
		if (displayPlaylist && displayLibrary) {
			g_properties.auto_collapse = true;
			playlist.auto_collapse_header();
		}
		else {
			g_properties.auto_collapse = false;
			playlist.expand_header();
		}
	}
	else if (pref.libraryLayoutSplitPreset2) {
		pref.libraryDesign = 'reborn';
		pref.libraryThumbnailSize = 'playlist';
		panel.imgView = ppt.albumArtShow = false;
		g_properties.auto_collapse = false;
		g_properties.show_header = displayPlaylist && !displayLibrary && pref.libraryLayout === 'split';
		updatePlaylist();
	}
	else if (pref.libraryLayoutSplitPreset3) {
		pref.libraryDesign = 'reborn';
		pref.libraryThumbnailSize = 'playlist';
		panel.imgView = ppt.albumArtShow = true;
		// ppt.thumbNailSize = 1;
		ppt.albumArtLabelType = 1;
		g_properties.show_header = true;
		if (displayPlaylist && displayLibrary) {
			g_properties.auto_collapse = true;
			playlist.auto_collapse_header();
		}
		else {
			g_properties.auto_collapse = false;
			playlist.expand_header();
		}
	}
	else if (pref.libraryLayoutSplitPreset4) {
		pref.libraryDesign = 'artistLabelsRight';
		pref.libraryThumbnailSize = 'playlist';
		panel.imgView = ppt.albumArtShow = true;
		// ppt.thumbNailSize = 1;
		ppt.albumArtLabelType = 2;
		g_properties.show_header = true;
		if (displayPlaylist && displayLibrary) {
			g_properties.auto_collapse = true;
			playlist.auto_collapse_header();
		}
		else {
			g_properties.auto_collapse = false;
			playlist.expand_header();
		}
	}

	if (!libraryInitialized) return;
	lib.logTree();
	pop.clearTree();
	men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
	setLibrarySize();
	initLibraryColors();
	playlist.on_size(ww, wh);
	window.Repaint();
}


const on_queue_changed = $Lib.debounce(() => {
	if (ppt.itemShowStatistics != 7) return;
	pop.tree.forEach(v => {
		v.id = '';
		v.count = '';
		delete v.statistics;
		delete v._statistics;
	});
	pop.cache = {
		standard: {},
		search: {},
		filter: {}
	}
	panel.treePaint();
	}, 250, {
	leading:  true,
	trailing: true
});

const windowMetricsPath = pref.customLibraryDir ? `${globals.customLibraryDir}cache\\library\\themed\\windowMetrics.json` : `${fb.ProfilePath}cache\\library\\themed\\windowMetrics.json`;
