'use strict';

class LibCallbacks {
	constructor() {
		/** @type {string} */
		this.windowMetricsPath = grSet.customLibraryDir
			? `${grCfg.customLibraryDir}cache\\library\\themed\\windowMetrics.json`
			: `${fb.ProfilePath}cache\\library\\themed\\windowMetrics.json`;

		this.on_queue_changed = $Lib.debounce(() => {
			if (libSet.itemShowStatistics != 7) return;
			lib.pop.tree.forEach(v => {
				v.id = '';
				v.count = '';
				delete v.statistics;
				delete v._statistics;
			});
			lib.pop.cache = {
				standard: {},
				search: {},
				filter: {}
			}
			lib.panel.treePaint();
			}, 250, {
			leading:  true,
			trailing: true
		});
	}

	on_colours_changed(keepCache) {
		lib.ui.getColours();

		if (lib.panel.colMarker) {
			lib.panel.getFields(libSet.viewBy, libSet.filterBy);
			if (lib.lib) {
				lib.lib.getLibrary();
				lib.lib.rootNodes(true, true);
			}
		}
		lib.sbar.setCol();
		lib.pop.createImages();
		lib.but.createImages();
		if (!keepCache) libImg.clearCache();
		libImg.createImages();
		lib.but.refresh(true);
		lib.sbar.resetAuto();
		lib.ui.createImages();
		if (!libSet.themed) lib.ui.blurReset();
		window.Repaint();
	}

	on_font_changed() {
		lib.sbar.logScroll();
		lib.pop.deactivateTooltip();
		lib.ui.getFont();
		lib.panel.on_size(true);
		if (lib.ui.style.topBarShow || libSet.sbarShow) lib.but.refresh(true);
		lib.sbar.resetAuto();
		window.Repaint();
		lib.sbar.setScroll();
	}

	on_char(code) {
		lib.pop.on_char(code);
		lib.find.on_char(code);
		if (!libSet.searchShow) return;
		lib.search.on_char(code);
	}

	on_focus(is_focused) {
		if (!is_focused) {
			lib.timer.clear(lib.timer.cursor);
			lib.panel.search.cursor = false;
			lib.panel.searchPaint();
		}
		lib.pop.on_focus(is_focused);
	}

	on_get_album_art_done(handle, art_id, image, image_path) {
		lib.ui.on_get_album_art_done(handle, image, image_path);
	}

	on_item_focus_change(playlistIndex) {
		lib.lib.checkFilter();
		if (!lib.pop.setFocus) {
			if (libSet.followPlaylistFocus && playlistIndex == $Lib.pl_active && !libSet.libSource) {
				this.setSelection(fb.GetFocusItem());
			}
		} else lib.pop.setFocus = false;
		lib.ui.focus_changed();
	}

	on_key_down(vkey) {
		lib.pop.on_key_down(vkey);
		libImg.on_key_down(vkey);
		if (!libSet.searchShow) return;
		lib.search.on_key_down(vkey);
	}

	on_key_up(vkey) {
		libImg.on_key_up(vkey);
		if (!libSet.searchShow) return;
		lib.search.on_key_up(vkey);
	}

	on_library_items_added(handleList) {
		if (libSet.libSource == 2) return;
		if (lib.lib.v2_init) {
			lib.lib.v2_init = false;
			if (lib.ui.w < 1 || !window.IsVisible) return;
			lib.lib.initialise(handleList);
			return;
		}
		if (!lib.initialized || !libSet.libAutoSync || libSet.fixedPlaylist || !libSet.libSource) return;
		lib.lib.treeState(false, 2, handleList, 0);
	}

	on_library_items_removed(handleList) {
		if (!lib.initialized || !libSet.libAutoSync || libSet.fixedPlaylist || !libSet.libSource) return;
		if (libSet.libSource == 2) {
			const libList = lib.lib.list.Clone();
			libList.Sort();
			handleList.Sort();
			handleList.MakeIntersection(libList);
		}
		lib.lib.treeState(false, 2, handleList, 2);
	}

	on_library_items_changed(handleList) {
		if (!lib.initialized || !libSet.libAutoSync || libSet.fixedPlaylist || !libSet.libSource) return;
		if (libSet.libSource == 2) {
			const libList = lib.lib.list.Clone();
			libList.Sort();
			handleList.Sort();
			handleList.MakeIntersection(libList);
		}
		lib.lib.treeState(false, 2, handleList, 1);
	}

	on_main_menu(index) {
		lib.pop.on_main_menu(index);
	}

	on_metadb_changed(handleList, isDatabase) {
		if (isDatabase && !lib.panel.statistics || lib.lib.list.Count != lib.lib.libNode.length) return;
		if (libSet.fixedPlaylist || !libSet.libSource) {
			handleList.Convert().some(h => {
				const i = lib.lib.full_list.Find(h);
				if (i != -1) {
					const isMainChanged = lib.lib.isMainChanged(handleList);
					if (isMainChanged) lib.lib.treeState(false, 2);
					lib.ui.focus_changed();
					return true;
				}
			});
		}
	}

	on_mouse_lbtn_dblclk(x, y) {
		lib.but.lbtn_dn(x, y);
		if (libSet.searchShow) lib.search.lbtn_dblclk(x, y);
		lib.pop.lbtn_dblclk(x, y);
		lib.sbar.lbtn_dblclk(x, y);
	}

	on_mouse_lbtn_down(x, y) {
		if (libSet.touchControl) {
			lib.panel.last_pressed_coord = {
				x,
				y
			};
		}
		if (lib.ui.style.topBarShow || libSet.sbarShow) lib.but.lbtn_dn(x, y);
		if (libSet.searchShow) lib.search.lbtn_dn(x, y);
		lib.pop.lbtn_dn(x, y);
		lib.sbar.lbtn_dn(x, y);
		lib.ui.sz.y_start = y;
	}

	on_mouse_lbtn_up(x, y) {
		lib.pop.lbtn_up(x, y);
		if (libSet.searchShow) lib.search.lbtn_up();
		lib.but.lbtn_up(x, y);
		lib.sbar.lbtn_up();
	}

	on_mouse_leave() {
		if (lib.ui.style.topBarShow || libSet.sbarShow) lib.but.leave();
		lib.sbar.leave();
		lib.pop.leave();
	}

	on_mouse_mbtn_dblclk(x, y, mask) {
		lib.pop.mbtnDblClickOrAltDblClick(x, y, mask, 'mbtn');
	}

	on_mouse_mbtn_down(x, y) {
		lib.pop.mbtn_dn(x, y);
	}

	on_mouse_mbtn_up(x, y, mask) {
		// UIHacks at default settings blocks on_mouse_mbtn_up, at least in windows; workaround configure hacks: main window > move with > caption only & ensure pseudo-caption doesn't overlap buttons
		lib.pop.mbtnUpOrAltClickUp(x, y, mask, 'mbtn');
	}

	on_mouse_move(x, y) {
		if (lib.panel.m.x == x && lib.panel.m.y == y) return;
		lib.pop.hand = false;
		if (lib.ui.style.topBarShow || libSet.sbarShow) lib.but.move(x, y);
		if (libSet.searchShow) lib.search.move(x, y);
		if (grSet.libraryRowHover) lib.pop.move(x, y);
		lib.pop.dragDrop(x, y);
		lib.sbar.move(x, y);
		lib.ui.zoomDrag(x, y);
		lib.panel.m.x = x;
		lib.panel.m.y = y;
	}

	on_mouse_rbtn_up(x, y) {
		if (y < lib.ui.y + lib.panel.search.h && x > lib.panel.search.x && x < lib.panel.search.x + lib.panel.search.w) {
			if (libSet.searchShow) lib.search.rbtn_up(x, y);
		} else lib.men.rbtn_up(x, y);
		return true;
	}

	on_mouse_wheel(step) {
		lib.pop.deactivateTooltip();
		if (!lib.vk.k('zoom')) lib.sbar.wheel(step);
		else lib.ui.wheel(step);
	}

	on_notify_data(name, info) {
		if (libSet.libSource == 2 && name != 'bio_imgChange') {
			const panelSelectionPlaylists = libSet.panelSelectionPlaylist.split(/\s*\|\s*/);
			panelSelectionPlaylists.some(v => {
				if (name == v) {
					lib.lib.list = new FbMetadbHandleList(info);
					if ($Lib.equalHandles(lib.lib.list.Convert(), lib.lib.full_list.Convert())) return;
					lib.lib.full_list = lib.lib.list.Clone();
					libSet.lastPanelSelectionPlaylist = `${v} Cache`;
					const pln = plman.FindOrCreatePlaylist(`${v} Cache`, false);
					plman.ClearPlaylist(pln);
					plman.InsertPlaylistItems(pln, 0, lib.lib.list);
					lib.lib.searchCache = {};
					lib.pop.clearTree();
					lib.pop.cache = {
						standard: {},
						search: {},
						filter: {}
					}
					lib.lib.treeState(false, 2, null, 3);
					lib.ui.expandHandle = lib.lib.list.Count ? lib.lib.list[0] : null;
					lib.ui.on_playback_new_track();
					lib.lib.treeState(false, libSet.rememberTree);
				}
			});
		}

		switch (name) {
			case '!!.tags update':
				lib.lib.treeState(false, 2);
				break;
			case 'newThemeColours':
				if (!libSet.themed) break;
				libSet.theme = info.theme;
				libSet.themeBgImage = info.themeBgImage;
				libSet.themeColour = info.themeColour;
				on_colours_changed(true);
				break;
			case 'Sync col': {
				if (!libSet.themed) break;
				const themeLight = libSet.themeLight;
				if (themeLight != info.themeLight) {
					libSet.themeLight = info.themeLight;
					on_colours_changed(true);
				}
				break;
			}
			case 'Sync image':
				if (!libSet.themed) break;
				libSync.image(new GdiBitmap(info.image), info.id);
				break;
		}
		if (lib.ui.id.local && name.startsWith('opt_')) {
			const clone = typeof info === 'string' ? String(info) : info;
			on_notify(name, clone);
		}
	}

	on_paint(gr) {
		if (!lib.lib.initialised) {
			lib.lib.initialise();
		}
		lib.ui.draw(gr);
		lib.lib.checkTree();
		libImg.draw(gr);
		lib.ui.drawLine(gr);
		lib.search.draw(gr);
		lib.pop.draw(gr);
		lib.sbar.draw(gr);
		lib.but.draw(gr);
		lib.find.draw(gr);

		if (libSet.albumArtFlowMode && lib.panel.imgView) {
			gr.FillSolidRect(this.x, this.y, SCALE(20), this.h, lib.ui.col.bg); // Margin left and masking for horizontal flow mode
			gr.FillSolidRect(this.x + this.w - SCALE(20), this.y, SCALE(20), this.h, lib.ui.col.bg); // Margin right and masking for horizontal flow mode
			if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) {
				gr.DrawImage(grCol.imgBlended, this.x - this.w + SCALE(20), this.y, grm.ui.ww, grm.ui.wh, this.x - this.w + SCALE(20), this.y, grCol.imgBlended.Width, grCol.imgBlended.Height);
				gr.DrawImage(grCol.imgBlended, this.x + this.w - SCALE(20), this.y, grm.ui.ww, grm.ui.wh, this.x + this.w - SCALE(20), this.y, grCol.imgBlended.Width, grCol.imgBlended.Height);
			}
		}

		gr.FillSolidRect(this.x, 0, this.w, grm.ui.topMenuHeight, grCol.bg); // Hides top row that shouldn't be visible in album art mode
		gr.FillSolidRect(this.x, this.y + this.h, this.w, this.h, grCol.bg); // Hides bottom row that shouldn't be visible in album art mode
		if (UIHacks.Aero.Effect === 2) gr.DrawLine(this.x, 0, grm.ui.ww, 0, 1, grCol.bg); // UIHacks aero glass shadow frame fix - needed for style Blend

		if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) {
			gr.DrawImage(grCol.imgBlended, this.x, this.y - this.h - grm.ui.topMenuHeight - grm.ui.lowerBarHeight, grm.ui.ww, grm.ui.wh, this.x, this.y - this.h - grm.ui.topMenuHeight - grm.ui.lowerBarHeight, grCol.imgBlended.Width, grCol.imgBlended.Height);
			gr.DrawImage(grCol.imgBlended, this.x, this.y + this.h, grm.ui.ww, grm.ui.wh, this.x, this.y + this.h, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}
	}

	on_playback_new_track(handle) {
		lib.lib.checkFilter();
		lib.pop.getNowplaying(handle);
		if (grSet.libraryAutoScrollNowPlaying) lib.pop.nowPlayingShow();
		if (!libSet.recItemImage || libSet.libSource != 2) lib.ui.on_playback_new_track(handle);
	}

	on_playback_stop(reason) {
		if (reason == 2) return;
		lib.pop.getNowplaying('', true);
		on_item_focus_change();
	}

	on_playback_queue_changed() {
		this.on_queue_changed();
	}

	on_playlists_changed() {
		lib.men.playlists_changed();
		if ($Lib.pl_active != plman.ActivePlaylist) $Lib.pl_active = plman.ActivePlaylist;
		let fixedPlaylistIndex = -1;
		if (libSet.fixedPlaylist) {
			fixedPlaylistIndex = plman.FindPlaylist(libSet.fixedPlaylistName);
			if (fixedPlaylistIndex == -1) {
				libSet.fixedPlaylist = false;
				libSet.libSource = 0;
				if (lib.panel.imgView) libImg.clearCache();
				lib.lib.playlist_update();
			}
		}
	}

	on_playlist_items_added(playlistIndex) {
		if (libSet.fixedPlaylist) {
			const fixedPlaylistIndex = plman.FindPlaylist(libSet.fixedPlaylistName);
			if (playlistIndex == fixedPlaylistIndex) {
				lib.lib.playlist_update(playlistIndex);
				return;
			}
		}
		if (!libSet.libSource && playlistIndex == $Lib.pl_active) {
			lib.lib.playlist_update(playlistIndex);
		}

		if (!pl.playlist) return; // Abort if Playlist was not initialized
		if (grSet.playlistSortOrderAuto) grm.ui.setPlaylistSortOrder();
		grm.ui.initPlaylist(); // Update Playlist when adding items from Library
		pl.call.on_size(grm.ui.ww, grm.ui.wh);
	}

	on_playlist_items_removed(playlistIndex) {
		if (libSet.fixedPlaylist) {
			const fixedPlaylistIndex = plman.FindPlaylist(libSet.fixedPlaylistName);
			if (playlistIndex == fixedPlaylistIndex) {
				lib.lib.playlist_update(playlistIndex);
				return;
			}
		}

		if (!libSet.libSource && playlistIndex == $Lib.pl_active) {
			lib.lib.playlist_update(playlistIndex);
		}
	}

	on_playlist_items_reordered(playlistIndex) {
		if (!libSet.libSource && playlistIndex == $Lib.pl_active) {
			lib.lib.playlist_update(playlistIndex);
		}
	}

	on_playlist_switch() {
		$Lib.pl_active = plman.ActivePlaylist;
		if (!libSet.libSource) {
			lib.lib.playlist_update();
		}
		lib.ui.focus_changed();
	}

	on_script_unload() {
		lib.but.on_script_unload();
		lib.pop.deactivateTooltip();
	}

	on_selection_changed() {
		if (!lib.panel.setSelection()) return;
		this.setSelection(fb.GetSelection());
	}

	on_size(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		lib.ui.x = x;
		lib.ui.y = y;
		lib.ui.w = width;
		lib.ui.h = height;

		if (!lib.ui.w || !lib.ui.h) return;
		if (lib.panel.imgView) grm.ui.autoThumbnailSize();

		// * Set guard for fixed Library margin sizes in case user changed them in Library options
		libSet.margin = SCALE(20);
		libSet.verticalPad = 5; // Setup default line padding value needed, otherwise 0 on reset
		libSet.zoomNode = 100; // Sets correct node zoom value, i.e when switching to 4K
		lib.panel.setTopBar();	// Resets filter font in case the zoom was reset, also needed when changing font size

		lib.pop.deactivateTooltip();
		libTooltip.SetMaxWidth(Math.max(lib.ui.w, SCALE(grSet.layout !== 'default' ? 600 : 800)));
		lib.ui.blurReset();
		lib.ui.calcText(true);

		if (libSet.themed && libSet.theme) {
			const themed_image = grSet.customLibraryDir ? `${grCfg.customLibraryDir}cache\\library\\themed\\themed_image.bmp` : `${fb.ProfilePath}cache\\library\\themed\\themed_image.bmp`;
			if ($Lib.file(themed_image)) libSync.image(gdi.Image(themed_image));
		}

		lib.panel.on_size();
		if (lib.ui.style.topBarShow || libSet.sbarShow) lib.but.refresh(true);
		lib.sbar.resetAuto();
		lib.find.on_size();
		lib.but.createImages();
		lib.pop.createImages();

		if (!libSet.themed) return;
		const windowMetrics = $Lib.jsonParse(this.windowMetricsPath, {}, 'file');
		windowMetrics[window.Name] = {
			w: lib.ui.w,
			h: lib.ui.h
		}
		$Lib.save(this.windowMetricsPath, JSON.stringify(windowMetrics, null, 3), true);
	}

	setSelection(handle) {
		if (!handle || !lib.panel.list.Count) return;
		const item = lib.panel.list.Find(handle);
		let idx = -1;
		lib.pop.tree.forEach((v, i) => {
			if (!v.root && lib.pop.inRange(item, v.item)) idx = i;
		});
		if (idx != -1) {
			if (!lib.panel.imgView) lib.pop.focusShow(idx);
			else lib.pop.showItem(idx, 'focus');
		}
	}
}

lib.call = new LibCallbacks();
