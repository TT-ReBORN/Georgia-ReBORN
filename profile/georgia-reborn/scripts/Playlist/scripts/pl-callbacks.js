/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Callbacks                       * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    10-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////
// * PLAYLIST CALLBACKS * //
////////////////////////////
/**
 * A class that contains all playlist callbacks.
 */
class PlaylistCallbacks {
	/**
	 * Creates the `PlaylistPanel` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	constructor(x, y) {
		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = 0;
		/** @public @type {number} */
		this.h = 0;
		/** @public @type {boolean} */
		this.is_activated = window.IsVisible;

		pl.plman = new PlaylistManager(this.x, this.y, 0, SCALE(plSet.row_h));
		pl.playlist = new Playlist(this.x, this.y + (plSet.show_plman ? SCALE(plSet.row_h) + SCALE(4) : 0));
	}

	// * CALLBACKS * //
	// #region Callbacks
	/**
	 * Draws the items in the playlist and a scrollbar if necessary.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	on_paint(gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, pl.col.bg); // Main bg

		if (!this.is_activated) {
			this.is_activated = true;

			if (plSet.show_plman) {
				pl.plman.reinitialize();
			}
			pl.playlist.reinitialize();
		}

		if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended && (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork)) { // * Display the full image
			gr.DrawImage(grCol.imgBlended, grm.ui.displayLibrarySplit() ? grSet.panelWidthAuto ? this.x : grm.ui.ww * 0.5 : 0, 0, grm.ui.ww, grm.ui.wh, grm.ui.displayLibrarySplit() ? grSet.panelWidthAuto ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : grm.ui.ww * 0.5 : 0, 0, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}

		if (grSet.playlistBgImg && grm.bgImg.playlistBgImg) { // * Display the full image
			grm.bgImg.drawBgImage(gr, grm.bgImg.playlistBgImg, grSet.playlistBgImgScale, this.x, this.y, this.w, this.h, grSet.playlistBgImgOpacity, false, 0, 0);
		}

		pl.playlist.on_paint(gr);

		// * Hide rows that shouldn't be visible
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(this.x, 0, this.w, grm.ui.topMenuHeight, grCol.bg); // Hide alpha overlapping at the top
		gr.FillSolidRect(this.x, this.y, this.w, pl.plman.h, pl.col.bg); // Hide alpha overlapping at the top
		gr.FillSolidRect(this.x, this.y + this.h - pl.geo.row_h, this.w, pl.geo.row_h + grm.ui.lowerBarHeight, pl.col.bg); // Hide alpha overlapping at the bottom
		gr.FillSolidRect(this.x, this.y + this.h, this.w, grm.ui.lowerBarHeight, grCol.bg); // Hide alpha overlapping at the bottom

		if (UIHacks.Aero.Effect === 2) gr.DrawLine(this.x, 0, grm.ui.ww, 0, 1, grCol.bg); // UIHacks aero glass shadow frame fix - needed for style Blend

		if (grSet.styleBlend && grm.ui.albumArt && grCol.imgBlended) { // * Display only top and bottom
			gr.DrawImage(grCol.imgBlended, this.x, this.y - this.h - grm.ui.topMenuHeight - grm.ui.lowerBarHeight + pl.plman.h, grm.ui.ww, grm.ui.wh, this.x, this.y - this.h - grm.ui.topMenuHeight - grm.ui.lowerBarHeight + pl.plman.h, grCol.imgBlended.Width, grCol.imgBlended.Height);
			gr.DrawImage(grCol.imgBlended, this.x, this.y + this.h - pl.geo.row_h, grm.ui.ww, grm.ui.wh, this.x, this.y + this.h - pl.geo.row_h, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}

		if (plSet.show_plman) {
			pl.plman.on_paint(gr);
		}

		if (grSet.playlistBgImg && grm.bgImg.playlistBgImg) { // * Display only top and bottom
			grm.bgImg.drawBgImage(gr, grm.bgImg.playlistBgImg, grSet.playlistBgImgScale, this.x, this.y, this.w, this.h, grSet.playlistBgImgOpacity, true, this.plman_h, this.plman_h * 2 - SCALE(4));
		}
	}

	/**
	 * Handles resizing of the playlist and updating its size and position.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 */
	on_size(w, h) {
		PlaylistRescale();

		const x = PlaylistSetX();
		const y = grm.ui.topMenuHeight;
		const playlist_w = w - x;
		const playlist_h = Math.max(0, h - grm.ui.lowerBarHeight - y);

		this.x = x;
		this.y = y;
		this.h = playlist_h;
		this.w = playlist_w;
		this.plman_h = SCALE(plSet.row_h + 4);

		pl.playlist.was_on_size_called = true;
		pl.playlist.on_size(playlist_w, playlist_h - (this.plman_h * 2) + SCALE(4), x, y + this.plman_h);
		pl.plman.set_xywh(x, y, grSet.showPlaylistManager_layout ? this.w : 0); // Hide Playlist manager

		grm.ui.handleLibrarySplitCollapse();

		if (plSet.show_header && (plSet.auto_collapse || plSet.collapse_on_start)) {
			pl.playlist.collapse_handler.collapse_all_but_now_playing();
		}

		if (fb.IsPlaying && (grSet.playlistAutoScrollNowPlaying || fb.PlaybackFollowCursor || fb.CursorFollowPlayback)) {
			this.on_playback_new_track();
		}
	}

	/**
	 * Handles drag and drop events and checks if dragging is allowed. Also handles internal and external drops.
	 * @param {DropTargetAction} action - The drag action that is being performed.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_drag_drop(action, x, y, m) {
		pl.playlist.mouse_down = false; ///< Because on_drag_drop suppresses on_mouse_lbtn_up call
		pl.playlist.stop_drag_scroll();

		if (!pl.playlist.selection_handler.is_dragging() || !pl.playlist.trace_list(x, y) || !pl.playlist.selection_handler.can_drop()) {
			pl.playlist.selection_handler.disable_drag();
			action.Effect = PlaylistDropEffect.none;
			return;
		}

		const ctrl_pressed = utils.IsKeyPressed(VKey.CONTROL);

		if (action.IsInternal) {
			const copy_drop = ctrl_pressed && ((action.Effect & 1) || (action.Effect & 4));
			pl.playlist.selection_handler.drop(!!copy_drop);

			// Suppress native drop, since we've handled it ourselves
			action.Effect = PlaylistDropEffect.none;
		}
		else {
			action.Effect = PlaylistDropEffect.copy; // * Wine/Linux drag n drop fix // action.Effect = this.filter_effect_by_modifiers(action.Effect);
			if (PlaylistDropEffect.none !== action.Effect) {
				pl.playlist.selection_handler.external_drop(action);
			}
			else {
				pl.playlist.selection_handler.disable_drag();
			}
		}
	}

	/**
	 * Handles drag enter events and checks if the mouse is inside the element, sets the mouse down state,
	 * enables dragging based on the action type, and determines the drop effect based on the trace list and selection handler.
	 * @param {DropTargetAction} action - The drag action that is being performed.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} mask - The mouse mask.
	 */
	on_drag_enter(action, x, y, mask) {
		pl.playlist.mouse_in = true;
		pl.playlist.mouse_down = true;
		pl.playlist.drag_event_invoked = true;

		if (!pl.playlist.selection_handler.is_dragging()) {
			if (action.IsInternal) {
				pl.playlist.selection_handler.enable_drag();
			}
			else {
				pl.playlist.selection_handler.enable_external_drag();
			}
		}

		if (!pl.playlist.trace_list(x, y) || !pl.playlist.selection_handler.can_drop()) {
			action.Effect = PlaylistDropEffect.none;
		}
		else {
			action.Effect = (action.Effect & PlaylistDropEffect.move)
				|| (action.Effect & PlaylistDropEffect.copy)
				|| (action.Effect & PlaylistDropEffect.link);
		}
	}

	/**
	 * Handles drag leave events when the mouse leaves a draggable item.
	 */
	on_drag_leave() {
		if (pl.playlist.selection_handler.is_dragging()) {
			pl.playlist.stop_drag_scroll();
			pl.playlist.selection_handler.disable_drag();
		}

		pl.playlist.drag_event_invoked = false;
		pl.playlist.mouse_in = false;
		pl.playlist.mouse_down = false;

		pl.playlist.repaint();
	}

	/**
	 * Handles drag over events and allows for dragging and dropping of rows.
	 * @param {DropTargetAction} action - The drag action that is being performed.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} mask - The mouse mask.
	 * @returns {number} The value of the `action.Effect` property.
	 */
	on_drag_over(action, x, y, mask) {
		if (!pl.playlist.selection_handler.can_drop()) {
			action.Effect = PlaylistDropEffect.none;
			return action.Effect;
		}

		const drop_info = pl.playlist._get_drop_row_info(x, y);
		const row = drop_info.row;

		if (pl.playlist.drag_scroll_in_progress) {
			if (!row || (y >= (pl.playlist.list_y + pl.playlist.row_h * 2) && y <= (pl.playlist.list_y + pl.playlist.list_h - pl.playlist.row_h * 2))) {
				pl.playlist.stop_drag_scroll();
			}
		}
		else if (row) {
			if (pl.playlist.collapse_handler) {
				pl.playlist.collapse_handler.expand(row.parent);
				if (pl.playlist.collapse_handler.changed) {
					// * Fix to restore drag scroll to last row item at bottom when header is collapsed
					pl.playlist.scrollbar.is_scrolled_down = false;
					pl.playlist.repaint();
				}
			}

			pl.playlist.selection_handler.drag(row, drop_info.is_above);

			if (pl.playlist.is_scrollbar_available) {
				if (y < (pl.playlist.list_y + pl.playlist.row_h * 2) && !pl.playlist.scrollbar.is_scrolled_up) {
					pl.playlist.selection_handler.drag(null, false); // To clear last hover row
					pl.playlist.start_drag_scroll('up');
				}
				if (y > (pl.playlist.list_y + pl.playlist.list_h - pl.playlist.row_h * 2) && !pl.playlist.scrollbar.is_scrolled_down) {
					pl.playlist.selection_handler.drag(null, false); // To clear last hover row
					pl.playlist.start_drag_scroll('down');
				}
			}
		}

		pl.playlist.last_hover_item = /** @type {?PlaylistBaseHeader|?PlaylistRow} */ pl.playlist.get_item_under_mouse(x, y);

		if (!pl.playlist.trace_list(x, y)) {
			action.Effect = PlaylistDropEffect.none;
		}
		else {
			action.Effect = PlaylistDropEffect.copy; // * Wine/Linux drag n drop fix // action.Effect = this.filter_effect_by_modifiers(action.Effect);
		}

		return action.Effect;
	}

	/**
	 * Updates the focus state of an item and triggers a repaint if necessary.
	 * @param {boolean} is_focused - Whether the playlist is focused.
	 */
	on_focus(is_focused) {
		if (!this.is_activated) {
			return;
		}

		if (pl.playlist.focused_item) {
			pl.playlist.focused_item.is_focused = is_focused;
			pl.playlist.focused_item.repaint();
		}
		pl.playlist.is_in_focus = is_focused;
	}

	/**
	 * Assigns album art to a header item and repaints if the art is not already loaded.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 * @param {number} art_id - The id for the album art is used to associate the album art with the specific header.
	 * @param {GdiBitmap} image - The album art image that was retrieved.
	 * @param {string} image_path - The file path where the album art image is stored.
	 */
	on_get_album_art_done(metadb, art_id, image, image_path) {
		if (!this.is_activated) {
			return;
		}

		if (!image) {
			image = null;
		}

		/** @type {Array<PlaylistRow|PlaylistBaseHeader>} */
		const items = pl.playlist.items_to_draw;
		for (const item of items) {
			if (item instanceof PlaylistHeader && (!item.is_art_loaded() && item.get_first_row().metadb.Compare(metadb))) {
				item.assign_art(image);
				item.repaint();
			}
		}
	}

	/**
	 * Handles changes in focus between items in the playlist, updating the focused item and scrolling to it if necessary.
	 * @param {number} playlist_idx - The index of the playlist that the focus change event is occurring in.
	 * @param {number} from_idx - The index of the previously focused item in the playlist.
	 * @param {number} to_idx - The index of the item that is gaining focus in the playlist.
	 */
	on_item_focus_change(playlist_idx, from_idx, to_idx) {
		if (!this.is_activated) {
			return;
		}

		if (playlist_idx !== pl.playlist.cur_playlist_idx || pl.playlist.focused_item && pl.playlist.focused_item.idx === to_idx) {
			return;
		}

		if (pl.playlist.focused_item) {
			pl.playlist.focused_item.is_focused = false;
		}

		if (to_idx === -1) {
			pl.playlist.focused_item = undefined;
		}
		else if (pl.playlist.cnt.rows.length && to_idx >= 0 && to_idx < pl.playlist.cnt.rows.length) {
			to_idx = Math.min(to_idx, pl.playlist.cnt.rows.length - 1);
			pl.playlist.focused_item = pl.playlist.cnt.rows[to_idx];
			pl.playlist.focused_item.is_focused = true;
		}

		if (pl.playlist.focused_item) {
			const from_row = from_idx === -1 ? null : pl.playlist.cnt.rows[from_idx];
			const playing_item_location = plman.GetPlayingItemLocation();
			if (!playing_item_location.IsValid || pl.playlist.on_playlist_items_removed) { // * Prevent scroll jump when removing items
				return;
			}
			pl.playlist.scroll_to_row(from_row, pl.playlist.focused_item);
		}

		pl.playlist.repaint();
	}

	/**
	 * Handles key down events when a key on the keyboard is pressed down.
	 * @param {number} vkey - The virtual key code.
	 */
	on_key_down(vkey) {
		pl.playlist.key_down = true;

		const modifiers = {
			ctrl:  utils.IsKeyPressed(VKey.CONTROL),
			alt:   utils.IsKeyPressed(VKey.MENU),
			shift: utils.IsKeyPressed(VKey.SHIFT)
		};
		pl.playlist.key_handler.invoke_key_action(vkey, modifiers);
	}

	/**
	 * Handles key up events when a key on the keyboard is pressed up.
	 * @param {number} vkey - The virtual key code.
	 */
	on_key_up(vkey) {
		pl.playlist.key_down = false;
	}

	/**
	 * Handles the metadb changed event and updates the header and queried data.
	 * @param {FbMetadbHandleList} handle_list - The metadb of the tracks.
	 * @param {boolean} fromhook - Whether the `on_metadb_changed` event was triggered by a hook or not.
	 */
	on_metadb_changed(handle_list, fromhook) {
		if (!this.is_activated) {
			return;
		}

		if (plSet.show_plman) {
			pl.plman.on_playlist_modified();
		}

		const changedHandlesSet = new Set(handle_list.Convert().map(handle => handle.RawPath));

		for (const item of pl.playlist.cnt.sub_items) { // Playlist headers
			const shouldUpdate = item.header_image || item.hyperlinks_initialized;
			const firstRowMetadbPath = item.get_first_row().metadb.RawPath;
			if (shouldUpdate && changedHandlesSet.has(firstRowMetadbPath)) {
				item.header_image = null;
				item.reset_hyperlinks();
			}
		}

		for (const item of pl.playlist.cnt.rows) { // Playlist rows
			if (changedHandlesSet.has(item.metadb.RawPath)) {
				item.reset_queried_data();
			}
		}
	}

	/**
	 * Handles mouse double click events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_dblclk(x, y, m) {
		if (BaseList.prototype.on_mouse_lbtn_dblclk.apply(pl.playlist, [x, y, m])) {
			return true;
		}

		const item = pl.playlist.get_item_under_mouse(x, y);
		if (!item) {
			return true;
		}

		if (item instanceof PlaylistBaseHeader) {
			if (item instanceof PlaylistDiscHeader) {
				item.on_mouse_lbtn_dblclk(pl.playlist.collapse_handler);
			} else {
				item.on_mouse_lbtn_dblclk(x, y, m);
			}
			pl.playlist.repaint();
		} else if (item instanceof PlaylistRow) {
			if (plSet.show_rating && item.rating_trace(x, y)) {
				item.rating_click(x, y);
				item.repaint();
			}
			else {
				plman.ExecutePlaylistDefaultAction(pl.playlist.cur_playlist_idx, item.idx);
			}
		}

		return true;
	}

	/**
	 * Handles left mouse button down events and performs various actions based on the mouse position and key presses.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_down(x, y, m) {
		if (plSet.show_plman) {
			pl.plman.on_mouse_lbtn_down(x, y, m);
		}

		if (BaseList.prototype.on_mouse_lbtn_down.apply(pl.playlist, [x, y, m])) {
			return true;
		}

		const ctrl_pressed = utils.IsKeyPressed(VKey.CONTROL);
		const shift_pressed = utils.IsKeyPressed(VKey.SHIFT);

		/** @type {PlaylistBaseHeader|PlaylistRow} */
		// @ts-ignore
		const item = pl.playlist.trace_list(x, y) ? pl.playlist.get_item_under_mouse(x, y) : undefined;
		pl.playlist.last_hover_item = item;
		pl.playlist.last_pressed_coord.x = x;
		pl.playlist.last_pressed_coord.y = y;

		if (item) {
			if ((!grSet.hyperlinksCtrlClick || ctrl_pressed) && item instanceof PlaylistHeader) {
				if (item.on_mouse_lbtn_down(x, y, m)) {
					return true;    // Was handled by hyperlinks
				}
			}
			if (ctrl_pressed && shift_pressed && item instanceof PlaylistBaseHeader) {
				pl.playlist.collapse_handler.toggle_collapse(item);
				pl.playlist.mouse_down = false;
			}
			else if (shift_pressed
				|| (item instanceof PlaylistRow && !item.is_selected()
					|| item instanceof PlaylistBaseHeader && !item.is_completely_selected())) {
				pl.playlist.selection_handler.update_selection(item, ctrl_pressed, shift_pressed);
			}
			else {
				// Indicates the need to update selection on on_mouse_lbtn_up
				pl.playlist.mouse_on_item = true;
			}
		}
		else {
			pl.playlist.selection_handler.clear_selection();
		}

		pl.playlist.repaint();

		return true;
	}

	/**
	 * Handles mouse left button up events and updates the selection of an item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (plSet.show_plman) {
			pl.plman.on_mouse_lbtn_up(x, y, m);
		}

		const was_double_clicked = pl.playlist.mouse_double_clicked;

		if (BaseList.prototype.on_mouse_lbtn_up.apply(pl.playlist, [x, y, m])) {
			return true;
		}

		pl.playlist.last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		if (was_double_clicked) {
			return true;
		}

		pl.playlist.last_hover_item = undefined;

		// Drag is handled in on_drag_drop
		if (!pl.playlist.selection_handler.is_dragging() && pl.playlist.mouse_on_item) {
			const ctrl_pressed = utils.IsKeyPressed(VKey.CONTROL);
			const shift_pressed = utils.IsKeyPressed(VKey.SHIFT);
			/** @type {PlaylistRow|PlaylistBaseHeader} */
			// @ts-ignore
			const item = pl.playlist.get_item_under_mouse(x, y);
			if (item) {
				pl.playlist.selection_handler.update_selection(item, ctrl_pressed, shift_pressed);
			}
		}

		pl.playlist.mouse_on_item = false;
		pl.playlist.repaint();

		return true;
	}

	/**
	 * Handles mouse leave events and checks if an internal drag and drop operation is active.
	 * @override
	 */
	on_mouse_leave() {
		if (plSet.show_plman) {
			pl.plman.on_mouse_leave();
		}

		if (PlaylistRow.hovered && PlaylistRow.hovered.is_hovered) {
			PlaylistRow.hovered.is_hovered = false;
			pl.playlist.repaint();
		}

		if (pl.playlist.selection_handler.is_internal_drag_n_drop_active()
			&& pl.playlist.selection_handler.is_dragging()
			&& !pl.playlist.drag_event_invoked) {
			// Workaround for the following issues:
			// #1 if you move too fast out of the panel, then drag_enter is not invoked (thus we need to clear mouse state here).
			// #2 on_mouse_leave sometimes generated during internal drag_over (so we need to ignore it).
			pl.playlist.selection_handler.disable_drag();
			pl.playlist.drag_event_invoked = false;
			pl.playlist.mouse_in = false;
			pl.playlist.mouse_down = false;
			pl.playlist.repaint();
		}

		BaseList.prototype.on_mouse_leave.apply(pl.playlist);

		if (pl.playlist.scrollbar.b_is_dragging) {
			pl.playlist.scrollbar.b_is_dragging = false;
			pl.playlist.scrollbar.desiredScrollPosition = undefined;
		}
	}

	/**
	 * Handles mouse movement events and performs various actions based on the position of the mouse.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_move(x, y, m) {
		if (plSet.show_plman) {
			pl.plman.on_mouse_move(x, y, m);
		}

		if (BaseList.prototype.on_mouse_move.apply(pl.playlist, [x, y, m])) {
			return true;
		}

		const right_spacing = SCALE(20);
		const item = pl.playlist.get_item_under_mouse(x - right_spacing, y);

		if (item instanceof PlaylistHeader) {
			if (item.on_mouse_move(x, y, m)) return true;
		}
		else if (item instanceof PlaylistRow) {
			item.rowTooltip(x, y);
		}

		if (!pl.playlist.mouse_down) {
			return true;
		}

		if (!pl.playlist.selection_handler.is_dragging() && pl.playlist.last_hover_item) {
			const drag_diff = Math.sqrt(((pl.playlist.last_pressed_coord.x - x) ** 2 + (pl.playlist.last_pressed_coord.y - y) ** 2));
			if (drag_diff >= 7) {
				pl.playlist.last_pressed_coord = {
					x: undefined,
					y: undefined
				};
				pl.playlist.last_hover_item = pl.playlist.get_item_under_mouse(x, y);

				pl.playlist.selection_handler.perform_internal_drag_n_drop();
			}
		}

		return true;
	}

	/**
	 * Handles right mouse button down events and updates the selection.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_rbtn_down(x, y, m) {
		if (plSet.show_plman) {
			pl.plman.on_mouse_rbtn_down(x, y, m);
		}

		if (!pl.playlist.cnt.rows.length) {
			return;
		}

		if (pl.playlist.is_scrollbar_visible && pl.playlist.scrollbar.trace(x, y)) {
			return;
		}

		const item = pl.playlist.trace_list(x, y) ? pl.playlist.get_item_under_mouse(x, y) : undefined;
		if (!item) {
			pl.playlist.selection_handler.clear_selection();
		}
		else if (item instanceof PlaylistRow && !item.is_selected()
			|| item instanceof PlaylistBaseHeader && !item.is_completely_selected()) {
			pl.playlist.selection_handler.update_selection(item);
		}

		pl.playlist.repaint();
	}

	/**
	 * Handles right mouse button up events and displays a context menu with various options.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_rbtn_up(x, y, m) {
		const was_plman_displayed = plSet.show_plman;

		if (was_plman_displayed !== plSet.show_plman) {
			/**
			 * Adjusts the size and position of a playlist based on whether or not the playlist manager is being shown.
			 * @param {boolean} show - Whether to show the playlist manager or not.
			 * @private
			 */
			const toggle_plman = (show) => {
				const plman_gap_h = SCALE(plSet.row_h) + SCALE(4);
				const new_playlist_h = show ? (pl.playlist.h - plman_gap_h) : (pl.playlist.h + plman_gap_h);
				pl.playlist.y = this.y + (show ? plman_gap_h : 0);
				pl.playlist.on_size(pl.playlist.w, new_playlist_h, pl.playlist.x, pl.playlist.y);
				window.Repaint(); // Easier to repaint everything
			}
			toggle_plman(plSet.show_plman);
		}

		if (plSet.show_plman) {
			pl.plman.on_mouse_rbtn_up(x, y, m);
		}

		if (pl.playlist.trace(x, y)) {
			if (BaseList.prototype.on_mouse_rbtn_up.apply(pl.playlist, [x, y, m])) {
				return true;
			}

			const metadb = utils.IsKeyPressed(VKey.CONTROL) ? (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()) : fb.GetFocusItem();
			const has_selected_item = pl.playlist.selection_handler.has_selected_items();
			const is_cur_playlist_empty = !pl.playlist.cnt.rows.length;
			const cmm = new ContextMainMenu();

			// * Top menu options Playlist submenu
			cmm.appendItem('Playlist options menu', () => {
				if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
					grm.topMenu.topMenuOptions(grm.ui.state.mouse_x, grm.ui.state.mouse_y, true, 'playlist');
				}
			});
			cmm.separator();

			if (grSet.layout === 'default' && grSet.theme.startsWith('custom')) {
				cmm.appendItem(!grm.ui.displayCustomThemeMenu ? 'Edit custom theme' : 'Close custom theme menu', () => {
					grm.ui.initCustomThemeMenuState();
				});
				cmm.separator();
			}

			if (grSet.layout === 'default' && !grm.ui.displayLibrarySplit()) {
				if (grm.ui.displayPlaylist && !grm.ui.displayBiography && !grm.ui.displayLyrics) {
					cmm.appendItem(grm.ui.displayPlaylist && grSet.playlistLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
						grSet.playlistLayout = grSet.playlistLayout === 'normal' ? 'full' : 'normal';
						grm.ui.initPlaylistLayoutState();
					});
					cmm.separator();
				}
				else if (grm.ui.displayBiography && grm.ui.displayPlaylist) {
					cmm.appendItem(grm.ui.displayPlaylist && grm.ui.displayBiography && grSet.biographyLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
						grSet.biographyLayout = grSet.biographyLayout === 'normal' ? 'full' : 'normal';
						grm.ui.initBiographyLayoutState();
					});
					cmm.separator();
				}
				else if (grm.ui.displayLyrics) {
					cmm.appendItem(grm.ui.displayLyrics && grSet.lyricsLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
						grSet.lyricsLayout = grSet.lyricsLayout === 'normal' ? 'full' : 'normal';
						grm.ui.initLyricsLayoutState();
					});
					cmm.separator();
				}
			}

			cmm.appendItem('Browse mode', () => {
				grSet.panelBrowseMode = !grSet.panelBrowseMode;
				grm.ui.initBrowserModeState();
			}, { is_checked: grSet.panelBrowseMode });
			cmm.separator();

			if (fb.IsPlaying) {
				cmm.appendItem('Show now playing', () => {
					pl.playlist.show_now_playing();
				});
			}

			if (pl.history.canBack()) {
				cmm.appendItem('Previous playlist state', () => {
					pl.history.back();
				});
			}
			if (pl.history.canForward()) {
				cmm.appendItem('Next playlist state', () => {
					pl.history.forward();
				});
			}

			if (!is_cur_playlist_empty) {
				cmm.appendItem('Refresh playlist \tF5', () => {
					PlaylistHeader.img_cache.clear();
					pl.playlist.initialize_list();
					pl.playlist.scroll_to_focused();
				});

				if (pl.playlist.queue_handler && pl.playlist.queue_handler.has_items()) {
					cmm.appendItem('Flush playback queue \tCtrl+Shift+Q', () => {
						pl.playlist.queue_handler.flush();
					});
				}
				cmm.separator();
			}

			pl.playlist.ctx_menu_pltools(cmm);

			pl.playlist.ctx_menu_edit(cmm);

			if (!is_cur_playlist_empty) {
				if (!cmm.empty()) {
					cmm.separator();
				}

				if (pl.playlist.collapse_handler) {
					pl.playlist.ctx_menu_collapse(cmm);
				}

				pl.playlist.ctx_menu_appearance(cmm);

				if (plSet.show_header) {
					PlaylistHeader.grouping_handler.append_menu_to(cmm, () => {
						pl.playlist.initialize_list();
						pl.playlist.scroll_to_focused_or_now_playing();
						pl.playlist.repaint();
					});
				}

				pl.playlist.ctx_menu_sort(cmm);

				if (grSet.showWeblinks) {
					pl.playlist.ctx_menu_weblinks(cmm, metadb);
				}

				if (has_selected_item) {
					pl.playlist.ctx_menu_send(cmm);

					cmm.separator();
					cmm.appendItem('Write theme to tags', () => {
						WriteThemeTags();
					});
					cmm.appendItem('Write album statistics to tags', () => {
						pl.playlist.meta_manager.write_album_stats_to_tags();
					});
					pl.playlist.ctx_menu_playlist_stats(cmm);
					pl.playlist.ctx_menu_playlist_diagnostics(cmm);
				}
			}
			else {
				// Empty playlist

				if (!cmm.empty()) {
					cmm.separator();
				}

				const appear = new ContextMenu('Appearance');
				cmm.append(appear);

				appear.appendItem('Show playlist manager', () => {
					plSet.show_plman = !plSet.show_plman;
				}, { is_checked: plSet.show_plman });

				pl.playlist.append_scrollbar_visibility_context_menu_to(appear);
			}

			// -------------------------------------------------------------- //
			// * Context Menu Manager

			if (has_selected_item) {
				if (!cmm.empty()) {
					cmm.separator();
				}

				const ccmm = new ContextFoobarMenu(plman.GetPlaylistSelectedItems(pl.playlist.cur_playlist_idx));
				cmm.append(ccmm);
			}

			// -------------------------------------------------------------- //
			// * System

			if (utils.IsKeyPressed(VKey.SHIFT)) {
				grm.ctxMenu.contextMenuDefault(cmm);
			}

			grm.ui.activeMenu = true;
			cmm.execute(x, y);
			grm.ui.activeMenu = false;

			pl.playlist.repaint();
			return true;
		}

		return true;
	}

	/**
	 * Handles mouse wheel events.
	 * @param {number} step - The amount of scrolling that occurred on the mouse wheel.
	 */
	on_mouse_wheel(step) {
		pl.playlist.on_mouse_wheel(step);
	}

	/**
	 * Handles notifications and synchronizes the state of a grouping handler.
	 * Called in other panels after window.NotifyOthers is executed.
	 * @param {string} name - The name of the notification event that triggered the function.
	 * @param {*} info - The information about the state of the sync group.
	 */
	on_notify_data(name, info) {
		if (name === 'sync_group_query_state') {
			if (!window.IsVisible) {
				// Need to reinitialize grouping_handler manually, since most of the callbacks are ignored when panel is hidden
				PlaylistHeader.grouping_handler.on_playlists_changed();
				PlaylistHeader.grouping_handler.set_active_playlist(plman.GetPlaylistName(plman.ActivePlaylist));
				PlaylistHeader.grouping_handler.sync_state(info);
			}
			else {
				PlaylistHeader.grouping_handler.sync_state(info);

				pl.playlist.initialize_list();
				pl.playlist.scroll_to_focused_or_now_playing();
			}
		}
	}

	/**
	 * Handles when Per-track dynamic info (stream track titles etc) changes and resets queried data
	 * and hyperlinks for each row and header, and then updates the playlist.
	 */
	on_playback_dynamic_info_track() {
		if (!this.is_activated) {
			return;
		}

		for (const item of pl.playlist.cnt.rows) {
			item.reset_queried_data();
		}

		for (const header of pl.playlist.cnt.sub_items) {
			header.reset_hyperlinks();
		}

		pl.playlist.repaint();
	}

	/**
	 * Updates the currently playing track in the playlist and performs actions such as clearing the title text,
	 * setting the track as playing, collapsing the playlist if necessary, and scrolling to the currently playing track.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	on_playback_new_track(metadb) {
		if (!this.is_activated) {
			return;
		}

		pl.plman.hover_alpha = 0; // * Prevent Playlist manager bg flashing when bg color changes

		if (pl.playlist.playing_item) {
			pl.playlist.playing_item.is_playing = false;
			pl.playlist.playing_item.clear_title_text();
			pl.playlist.playing_item = undefined;
		}

		const playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === pl.playlist.cur_playlist_idx) {
			pl.playlist.playing_item = pl.playlist.cnt.rows[playing_item_location.PlaylistItemIndex];
			if (pl.playlist.playing_item) {
				pl.playlist.playing_item.is_playing = true;
				pl.playlist.playing_item.clear_title_text();
			}

			if (pl.playlist.collapse_handler && plSet.show_header && (plSet.auto_collapse || plSet.collapse_on_start)) {
				pl.playlist.selection_handler.clear_selection();
				pl.playlist.collapse_handler.collapse_all_but_now_playing();
				pl.playlist.scroll_to_now_playing();
			}
		}

		if (grSet.playlistAutoScrollNowPlaying || fb.PlaybackFollowCursor || fb.CursorFollowPlayback) {
			setTimeout(() => { // * Wait until new album art / disc art loaded and other things finished for smoother auto-scrolling
				if (!grm.button.lowerArtistBtnClicked) pl.playlist.show_now_playing();
			}, 200);
		}

		pl.playlist.repaint();
	}

	/**
	 * Handles when playback pauses and repaints the currently playing item.
	 * @param {boolean} state - The new playback state.
	 */
	on_playback_pause(state) {
		if (!this.is_activated) {
			return;
		}

		if (pl.playlist.playing_item) {
			pl.playlist.playing_item.repaint();
		}
	}

	/**
	 * Handles when playback items are send in queue, initializes the queue handler and updates the playlist.
	 * @param {number} origin - The origin of the change.
	 */
	on_playback_queue_changed(origin) {
		if (!this.is_activated) {
			return;
		}

		if (!pl.playlist.queue_handler) return;
		pl.playlist.queue_handler.initialize_queue();
		pl.playlist.repaint();
	}

	/**
	 * Handles playback stop events and clears the title text of the currently playing item and updates its track number.
	 * @param {number} reason - The type of playback stop.
	 */
	on_playback_stop(reason) {
		if (!this.is_activated) {
			return;
		}

		if (!pl.playlist.playing_item) return;
		pl.playlist.playing_item.clear_title_text();
		pl.playlist.playing_item.is_playing = false;
		pl.playlist.playing_item.repaint();
	}

	/**
	 * Handles and ensures that a playlist item is visible in the playlist if it is not already.
	 * @param {number} playlist_idx - The current playlist index.
	 * @param {number} playlistItemIndex - The playlist item index that needs to be ensured visible in the playlist.
	 */
	on_playlist_item_ensure_visible(playlist_idx, playlistItemIndex) {
		if (!this.is_activated) {
			return;
		}

		if (playlist_idx !== pl.playlist.cur_playlist_idx) {
			return;
		}

		const row = pl.playlist.cnt.rows[playlistItemIndex];
		if (!row) {
			return;
		}

		if (!grm.ui.displayLibrarySplit()) pl.playlist.scroll_to_row(null, row); // * Prevent scroll to focused after drag and drop in split layout
	}

	/**
	 * Handles when playlist items are added and sets the playlist sort order and updates the playlist.
	 * @param {number} playlist_idx - The current playlist index.
	 */
	on_playlist_items_added(playlist_idx) {
		if (!this.is_activated) {
			return;
		}

		if (plSet.show_plman) {
			pl.plman.on_playlist_modified();
		}

		if (playlist_idx !== pl.playlist.cur_playlist_idx) {
			return;
		}
		if (grSet.playlistSortOrderAuto) grm.ui.setPlaylistSortOrder();

		pl.playlist.batch_processor.clearBatchCaches();
		pl.playlist.debounced_initialize_and_repaint_list();
	}

	/**
	 * Handles when playlist items are reordered and updates the playlist.
	 * @param {number} playlist_idx - The current playlist index.
	 */
	on_playlist_items_reordered(playlist_idx) {
		if (!this.is_activated) {
			return;
		}

		if (playlist_idx !== pl.playlist.cur_playlist_idx) {
			return;
		}

		pl.playlist.batch_processor.clearBatchCaches();
		pl.playlist.debounced_initialize_and_repaint_list(true);
	}

	/**
	 * Handles when playlist items are removed and updates the playlist.
	 * @param {number} playlist_idx - The current playlist index.
	 */
	on_playlist_items_removed(playlist_idx) {
		if (!this.is_activated) {
			return;
		}

		if (plSet.show_plman) {
			pl.plman.on_playlist_modified();
		}

		if (playlist_idx !== pl.playlist.cur_playlist_idx) {
			return;
		}

		pl.playlist.batch_processor.clearBatchCaches();
		pl.playlist.debounced_initialize_and_repaint_list();
	}

	/**
	 * Handles when playlist item selection has been changed and updates the selection.
	 */
	on_playlist_items_selection_change() {
		if (!this.is_activated) {
			return;
		}

		if (plSet.show_plman) {
			pl.plman.on_playlist_modified();
		}

		if (!pl.playlist.mouse_in && !pl.playlist.key_down) {
			pl.playlist.selection_handler.initialize_selection();
		}
	}

	/**
	 * Handles when active playlist changes to another playlist index.
	 */
	on_playlist_switch() {
		if (!this.is_activated) {
			return;
		}

		if (plSet.show_plman) {
			pl.plman.on_playlist_modified();
		}

		if (pl.playlist.cur_playlist_idx !== plman.ActivePlaylist) {
			plSet.scrollbar_pos = pl.playlist.scroll_pos_list[plman.ActivePlaylist] == null ? 0 : pl.playlist.scroll_pos_list[plman.ActivePlaylist];
		}

		pl.playlist.initialize_and_repaint_list();

		if (pl.playlist.collapse_handler && plSet.show_header && (plSet.auto_collapse || plSet.collapse_on_start)) {
			pl.playlist.collapse_handler.collapse_all_but_now_playing();
		}
	}

	/**
	 * Handles changes in the playlists when content is added/removed/reordered/renamed.
	 */
	on_playlists_changed() {
		if (!this.is_activated) {
			return;
		}

		if (plSet.show_plman) {
			pl.plman.on_playlist_modified();
		}

		if ((plman.ActivePlaylist > plman.PlaylistCount || plman.ActivePlaylist === -1) && plman.PlaylistCount > 0) {
			plman.ActivePlaylist = plman.PlaylistCount - 1;
		}

		PlaylistHeader.grouping_handler.on_playlists_changed();
		PlaylistHeader.grouping_handler.set_active_playlist(plman.GetPlaylistName(plman.ActivePlaylist));

		if (plman.ActivePlaylist !== pl.playlist.cur_playlist_idx) {
			pl.playlist.initialize_and_repaint_list();
		}

		if (pl.playlist.collapse_handler && plSet.show_header && (plSet.auto_collapse || plSet.collapse_on_start)) {
			pl.playlist.collapse_handler.collapse_all_but_now_playing();
		}
	}
	// #endregion
}
