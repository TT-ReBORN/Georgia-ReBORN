/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist                                 * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    08-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////
// * PLAYLIST * //
//////////////////
/**
 * A class that draws the playlist rows and manages them.
 * @augments {BaseList}
 */
class Playlist extends BaseList {
	/**
	 * Creates the `Playlist` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	constructor(x, y) {
		super(x, y, 0, 0, new PlaylistContent());

		// * Constants
		/** @private @type {number} */
		this.header_h_in_rows = this._calcHeaderRows();

		// * Window state
		/** @public @type {boolean} */
		this.was_on_size_called = false;
		/** @public @type {boolean} */
		this.is_in_focus = false;

		// * Playback state
		/** @public @type {number} */
		this.cur_playlist_idx = undefined;
		/** @public @type {?PlaylistRow} */
		this.playing_item = undefined;
		/** @public @type {?PlaylistRow} */
		this.focused_item = undefined;

		// * Mouse and key state
		/** @public @type {boolean} */
		this.mouse_on_item = false;
		/** @public @type {boolean} */
		this.key_down = false;
		/** @public @type {boolean} */
		this.drag_event_invoked = false;

		// * Item events
		/** @public @type {?PlaylistRow|?PlaylistBaseHeader|?BaseListItem} */
		this.last_hover_item = undefined;
		/** @public @type {{x: ?number, y: ?number}} */
		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		// * Timers
		/** @public @type {boolean} */
		this.drag_scroll_in_progress = false;
		/** @private @type {number} */
		this.drag_scroll_timeout_timer = 0;
		/** @private @type {number} */
		this.drag_scroll_repeat_timer = 0;

		// * Scrollbar props
		/** @public @type {Array<number>} float */
		this.scroll_pos_list = [];

		// * Objects
		/** @public @type {FbMetadbHandleList} */
		this.playlist_items_array = [];
		/** @public @type {PlaylistBatchProcessor} */
		this.batch_processor = new PlaylistBatchProcessor();
		/** @public @type {?PlaylistImage} */
		this.header_artwork = new PlaylistImage();
		/** @public @type {?PlaylistMetaProvider} */
		this.meta_provider = new PlaylistMetaProvider();
		/** @public @type {?PlaylistMetaManager} */
		this.meta_manager = new PlaylistMetaManager();
		/** @public @type {?PlaylistKeyActionHandler} */
		this.key_handler = new PlaylistKeyActionHandler();
		/** @public @type {?PlaylistSelectionHandler} */
		this.selection_handler = undefined;
		/** @public @type {?PlaylistQueueHandler} */
		this.queue_handler = undefined;
		/** @public @type {?PlaylistCollapseHandler} */
		this.collapse_handler = undefined;
		/**@private @type {PlaylistContentNavigation} */
		this.cnt_helper = this.cnt.helper;

		/**
		 * Initializes and repaints the list with debouncing to prevent excessive calls.
		 * It is debounced to handle rapid invocation such as when swapping out playlist content
		 * which triggers the underlying method multiple times due to add/remove/changed callbacks.
		 * @param {Function} Debounce - The debouncing function to control invocation rate.
		 * @param {function(boolean): void} initialize_and_repaint_list - The function to initialize and repaint the list.
		 * @param {number} delay - The number of milliseconds to delay; here it's 10ms.
		 * @param {object} options - Configuration options for debouncing.
		 * @param {boolean} options.leading - If `true`, the function will be called on the leading edge of the timeout.
		 * @param {boolean} options.trailing - If `true`, the function will be called on the trailing edge of the timeout.
		 * @property {Function} debounced_initialize_and_repaint_list - The debounced version of initialize_and_repaint_list.
		 * @public
		 */
		this.debounced_initialize_and_repaint_list = Debounce((refocus) => {
			this.initialize_and_repaint_list(refocus);
		}, 10, {
			leading:  false,
			trailing: true
		});
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Initializes an array of rows based on the given playlist, where each row represents a playlist item.
	 * @param {FbMetadbHandleList} playlist_items - An object or array that can be converted to an array using the `Convert()` method.
	 * @returns {Array<PlaylistRow>} An array of row objects.
	 * @private
	 */
	_initialize_rows(playlist_items) { // Rewritten
		const rows = new Array(playlist_items.length);
		const showHeader = plSet.show_header;
		const isOddOffset = showHeader ? 0 : 1;

		for (let i = 0; i < playlist_items.length; ++i) {
			const row = new PlaylistRow(this.list_x, 0, this.list_w, this.row_h, playlist_items[i], i, this.cur_playlist_idx);
			row.is_odd = !(i & 1) ^ isOddOffset;
			rows[i] = row;
		}

		return rows;
	}

	/**
	 * Creates headers for the playlist based on the provided rows and metadata.
	 * @param {Array<PlaylistRow>} rows - The rows of the playlist.
	 * @param {FbMetadbHandleList} rows_metadb - The metadb of the rows.
	 * @returns {Array<PlaylistHeader>} The result of calling the `PlaylistHeader.create_headers` function with the provided arguments.
	 * @private
	 */
	_create_headers(rows, rows_metadb) {
		const prepared_rows = PlaylistHeader.prepare_header_data(rows, rows_metadb);
		return PlaylistHeader.create_headers(/** @type {PlaylistContent} */ this.cnt, this.list_x, 0, this.list_w, this.row_h * this.header_h_in_rows, prepared_rows);
	}

	/**
	 * Calculates the number of header rows based on the layout and font size setting.
	 * @returns {number} The number of rows to be displayed in the header section of the playlist.
	 * @private
	 */
	_calcHeaderRows() {
		let numRows = plSet.use_compact_header ? plSet.rows_in_compact_header : plSet.rows_in_header;
		const headerFontSize = grSet.playlistHeaderFontSize_layout;
		const rowFontSize    = grSet.playlistFontSize_layout;
		const normalHeader   = !plSet.use_compact_header;
		const headerExceedsHeight = (headerFontSize * 2 + 3 + rowFontSize) > (numRows * plSet.row_h * 0.6);

		if (normalHeader && headerExceedsHeight) numRows++;

		return numRows;
	}

	/**
	 * Determines the row and position (above or below) where an item should be dropped based on the mouse coordinates.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {{row: ?PlaylistRow, is_above: ?boolean}} An object with two properties: 'row', which is the playlist row (or null)
	 * where the item should be dropped, and 'is_above', which is a boolean indicating whether the item should be dropped above (true)
	 * or below (false) the row, or null if it cannot be determined.
	 * @private
	 */
	_get_drop_row_info(x, y) {
		const drop_info = {
			row:      undefined,
			is_above: undefined
		};

		let item = this.get_item_under_mouse(x, y);
		if (!item) {
			if (!this.trace_list(x, y) || !this.cnt.rows.length) {
				return drop_info;
			}

			item = Last(this.cnt.rows);
		}

		const is_above = y < (item.y + item.h / 2);

		if (item instanceof PlaylistBaseHeader) {
			const first_row_in_header = item.get_first_row();

			if (is_above) {
				if (first_row_in_header === this.cnt.rows[0]) {
					drop_info.row = first_row_in_header;
					drop_info.is_above = true;
				}
				else {
					drop_info.row = this.cnt.rows[first_row_in_header.idx - 1];
					drop_info.is_above = false;
				}
			}
			else {
				drop_info.row = first_row_in_header;
				drop_info.is_above = true;
			}
		}
		else if (item instanceof PlaylistRow) {
			if (is_above) {
				drop_info.row = item;
				drop_info.is_above = true;
			}
			else if (plSet.show_header && item.idx === Last(item.parent.sub_items).idx
				|| item === Last(this.cnt.rows)) {
				drop_info.row = item;
				drop_info.is_above = false;
			}
			else {
				drop_info.row = this.cnt.rows[item.idx + 1];
				drop_info.is_above = true;
			}
		}

		return drop_info;
	}

	/**
	 * Determines the row index of a target item in a drawn item list.
	 * Note: at worst has O (playlist_size) complexity.
	 * @param {PlaylistRow|PlaylistBaseHeader} target_item - The item that you want to find the row index for. It can be either a `PlaylistRow` object or a `PlaylistBaseHeader` object.
	 * @returns {number} The row index of the target item in the drawn item list.
	 * @private
	 */
	_get_item_draw_row_idx(target_item) { // Rewritten
		let cur_row = 0;

		const iterate_level = (sub_items, target_item) => {
			if (sub_items.length === 0) return false;

			const isHeader = sub_items[0] instanceof PlaylistBaseHeader;
			const header_h_in_rows = isHeader ? Math.round(sub_items[0].h / this.row_h) : 0;

			for (let i = 0; i < sub_items.length; ++i) {
				const item = sub_items[i];

				if (item === target_item) {
					return true;
				}

				cur_row += isHeader ? header_h_in_rows : 1;
				if (isHeader && !item.is_collapsed && iterate_level(item.sub_items, target_item)) {
					return true;
				}
			}
			return false;
		};

		const topLevelItems = plSet.show_header ? this.cnt.sub_items : this.cnt.rows;
		if (!iterate_level(topLevelItems, target_item)) {
			return 0;
		}

		return cur_row;
	}

	/**
	 * Determines the visibility state and the amount of invisibility of a given item in the playlist.
	 * @param {PlaylistRow|PlaylistBaseHeader} item_to_check - The item whose visibility is being determined.
	 * @returns {{visibility: PlaylistVisibilityState, invisible_part: number}} An object containing 'visibility',
	 * which is the visibility state of the item (none, partial_top, partial_bottom, or full), and 'invisible_part',
	 * which is the fraction of the item's height that is invisible due to scrolling (0 for fully visible,
	 * between 0 and 1 for partially visible, and 1 if completely invisible).
	 * @private
	 */
	_get_item_visibility_state(item_to_check) {
		const item_state = {
			visibility:     PlaylistVisibilityState.none,
			invisible_part: item_to_check.h / this.row_h
		};

		for (const item of this.items_to_draw) {
			if (item === item_to_check) {
				if (item.y < this.list_y && item.y + item.h > this.list_y) {
					item_state.visibility = PlaylistVisibilityState.partial_top;
					item_state.invisible_part = (this.list_y - item.y) / this.row_h;
				} else if (item.y < this.list_y + this.list_h && item.y + item.h > this.list_y + this.list_h) {
					item_state.visibility = PlaylistVisibilityState.partial_bottom;
					item_state.invisible_part = ((item.y + item.h) - (this.list_y + this.list_h)) / this.row_h;
				} else {
					item_state.visibility = PlaylistVisibilityState.full;
					item_state.invisible_part = 0;
				}
				break;
			}
		}

		return item_state;
	}

	/**
	 * Sets the status of the last row based on whether the scrollbar is available and scrolled down.
	 * @private
	 */
	_set_rows_boundary_status() {
		const last_row = Last(this.cnt.rows);
		if (last_row) {
			last_row.is_cropped = this.is_scrollbar_available ? this.scrollbar.is_scrolled_down : false;
		}
	}
	// #endregion

	// * PUBLIC METHODS - GENERAL * //
	// #region PUBLIC METHODS - GENERAL
	/**
	 * Clear cached playlist elements, e.g group info, ratings etc.
	 */
	clear_cache() {
		pl.header_group_info.clear();
		pl.artist_ratings.clear();
		pl.album_ratings.clear();
		pl.track_ratings.clear();
		grm.ui.clearCache('ratings');
	}

	/**
	 * Filters a drop effect based on the modifiers (Ctrl, Shift, Alt) pressed during the event.
	 * @param {number} effect - A bitmask that represents the available drop effects for a drag-and-drop action.
	 * @returns {number} Returns the filtered effect that can be one of the following:
	 * - Only link effect if Ctrl and Shift are pressed together or Alt is pressed alone.
	 * - Copy effect if Ctrl is pressed alone.
	 * - Move effect if Shift is pressed alone.
	 * - Move effect, then Copy effect, then Link effect if no modifiers are pressed.
	 */
	filter_effect_by_modifiers(effect) {
		const ctrl_pressed = utils.IsKeyPressed(VKey.CONTROL);
		const shift_pressed = utils.IsKeyPressed(VKey.SHIFT);
		const alt_pressed = utils.IsKeyPressed(VKey.MENU);

		if (ctrl_pressed && shift_pressed && !alt_pressed
			|| alt_pressed && !ctrl_pressed && !shift_pressed) {
			// Link only
			return (effect & PlaylistDropEffect.link);
		}

		if (ctrl_pressed && !shift_pressed && !alt_pressed) {
			// Copy (also via link)
			return (effect & PlaylistDropEffect.copy) || (effect & PlaylistDropEffect.link);
		}

		if (shift_pressed) {
			// Move only
			return (effect & PlaylistDropEffect.move);
		}

		// Move > Copy > Link
		return (effect & PlaylistDropEffect.move) || (effect & PlaylistDropEffect.copy) || (effect & PlaylistDropEffect.link);
	}

	/**
	 * Collapses or expands the playlist header.
	 */
	header_auto_collapse() {
		if (plSet.show_header && plSet.auto_collapse) {
			this.collapse_handler.collapse_all_but_now_playing();
			if (this.collapse_handler.changed && grSet.playlistAutoScrollNowPlaying) {
				this.scroll_to_now_playing_or_focused();
			}
		} else {
			this.collapse_handler.expand_all();
		}
	}

	/**
	 * Collapses the playlist header.
	 */
	header_collapse() {
		this.header_auto_collapse();
	}

	/**
	 * Expands the playlist header.
	 */
	header_expand() {
		this.collapse_handler.expand_all();
	}

	/**
	 * Sets a hyperlink for the currently playing item if the current playlist index is "Search".
	 */
	hyperlink_set_now_playing() {
		if (!fb.GetNowPlaying() || plman.GetPlaylistName(this.cur_playlist_idx) !== 'Search') {
			return;
		}

		const plIndex = plman.FindOrCreatePlaylist('Search', true);
		const handles = plman.GetPlaylistItems(plIndex);
		const index = handles.Find(fb.GetNowPlaying());

		setTimeout(() => {
			this.playing_item = this.cnt.rows[index];
			if (this.playing_item) {
				this.playing_item.is_playing = true;
				this.playing_item.clear_title_text();
			}
			window.RepaintRect(this.x, this.y, this.w, this.h);
		}, 1);
	}

	/**
	 * Callback for playlist init events.
	 */
	initialize() {
		pl.plman.register_key_actions(this.key_handler);
		this.register_key_actions(this.key_handler);
		this.initialize_list();
	}

	/**
	 * Updates the playlist with the option to refocus on a specific playlist item.
	 * @param {boolean} refocus - Whether the playlist should be scrolled to the focused item after init.
	 */
	initialize_and_repaint_list(refocus) {
		this.initialize_list();
		if (refocus) {
			this.scroll_to_focused(); // Needed after drag-drop, because it might cause dropped (i.e. focused) item to be outside of drawn list
		}
		this.repaint();
	}

	/**
	 * Initializes and updates the playlist.
	 * Clearing its contents, initializing rows and headers and setting up various objects and handlers.
	 * This method does not contain any redraw calls, it's purely back-end.
	 */
	initialize_list() {
		CallLog('initialize_list');
		const profiler = fb.CreateProfiler();
		const profiler_part = grm.ui.traceListPerformance && fb.CreateProfiler();

		this.cur_playlist_idx = plman.ActivePlaylist;
		this.playlist_items_array = plman.GetPlaylistItems(this.cur_playlist_idx).Convert();

		// * Clear contents
		this.cnt.rows = [];
		this.cnt.sub_items = [];
		this.batch_processor.batchAlbumDirCache = null;

		// * Initialize rows
		grm.ui.traceListPerformance && profiler_part.Reset();
		this.cnt.rows = this._initialize_rows(this.playlist_items_array);
		grm.ui.traceListPerformance && console.log(`Rows initialized in ${profiler_part.Time}ms`);

		this.playing_item = undefined;
		const playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === this.cur_playlist_idx) {
			this.playing_item = this.cnt.rows[playing_item_location.PlaylistItemIndex];
			this.playing_item.is_playing = true;
		}

		this.focused_item = undefined;
		const focus_item_idx = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);
		if (focus_item_idx !== -1) {
			this.focused_item = this.cnt.rows[focus_item_idx];
			this.focused_item.is_focused = true;
		}

		// * Initialize headers
		grm.ui.traceListPerformance && profiler_part.Reset();
		PlaylistHeader.grouping_handler.set_active_playlist(plman.GetPlaylistName(this.cur_playlist_idx));
		this.cnt.sub_items = this.batch_processor.processHeaderBatches(this.cnt.rows, 0, true);
		this.header_artwork.getHeaderArtwork(this.cnt.sub_items.slice(0, 10)); // Preload first 10 artworks
		grm.ui.traceListPerformance && console.log(`Headers initialized in ${profiler_part.Time}ms`);

		// * Initialize states
		if (!this.was_on_size_called) { // First time init
			this.collapse_handler = new PlaylistCollapseHandler(/** @type {PlaylistContent} */ this.cnt);

			if (plSet.show_header) {
				if (plSet.collapse_on_start) {
					this.collapse_handler.collapse_all();
				}

				this.collapse_handler.set_callback(() => {
					this.on_list_items_change();
				});
			}
		}
		else { // Update list control
			if (this.collapse_handler) {
				this.collapse_handler.on_content_change();
			}

			if (plSet.show_header && plSet.auto_collapse) {
				this.header_collapse();
			}

			this.scrollbar.stopScrolling();
			this.on_list_items_change();
		}

		// * Initialize other objects
		if (plSet.show_queue_position) {
			this.queue_handler = new PlaylistQueueHandler(this.cnt.rows, this.cur_playlist_idx);
		}
		this.selection_handler = new PlaylistSelectionHandler(/** @type {PlaylistContent} */ this.cnt, this.cur_playlist_idx);

		this.hyperlink_set_now_playing();

		grm.ui.traceListPerformance && console.log(`Playlist initialized in ${profiler.Time}ms`);
	}

	/**
	 * Initializes and updates the scrollbar if it is visible.
	 * Used to update scrollbar colors.
	 */
	initScrollbar() {
		if (this.is_scrollbar_visible) {
			this.initialize_scrollbar();
			this.update_scrollbar();
		}
	}

	/**
	 * Reinitializes and updates the content of the playlist.
	 */
	reinitialize() {
		if (this.cur_playlist_idx !== plman.ActivePlaylist) {
			plSet.scrollbar_pos = this.scroll_pos_list[plman.ActivePlaylist] == null ? 0 : this.scroll_pos_list[plman.ActivePlaylist];
		}
		this.row_h = SCALE(plSet.row_h);
		this.header_h_in_rows = this._calcHeaderRows();
		this.initialize_list();
		this.scroll_to_focused();
	}

	/**
	 * Registers key actions and handles key presses.
	 * @param {PlaylistKeyActionHandler} key_handler - The PlaylistKeyActionHandler object.
	 */
	register_key_actions(key_handler) {
		key_handler.register_key_action(VKey.UP,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					if (!this.selection_handler.has_selected_items()) {
						return;
					}

					this.selection_handler.move_selection_up();
					return;
				}

				if (!this.focused_item) {
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof PlaylistRow ? top_item : top_item.get_first_row();
				}

				const visible_item = this.cnt_helper.is_item_visible(this.focused_item) ? this.focused_item : this.cnt_helper.get_visible_parent(this.focused_item);
				let new_item = this.cnt_helper.get_navigable_neighbor(visible_item, -1);
				if (!new_item) {
					new_item = visible_item;
				}

				this.selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			}
		);

		key_handler.register_key_action(VKey.DOWN,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					// Skip repaint
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					if (!this.selection_handler.has_selected_items()) {
						return;
					}

					this.selection_handler.move_selection_down();
					return;
				}

				if (!this.focused_item) {
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof PlaylistRow ? top_item : top_item.get_first_row();
				}

				const visible_item = this.cnt_helper.is_item_visible(this.focused_item) ? this.focused_item : this.cnt_helper.get_visible_parent(this.focused_item);
				let new_item = this.cnt_helper.get_navigable_neighbor(visible_item, 1);
				if (!new_item) {
					new_item = visible_item;
				}

				this.selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			}
		);

		key_handler.register_key_action(VKey.LEFT,
			(modifiers) => {
				if (!this.collapse_handler || !this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof PlaylistRow ? top_item : top_item.get_first_row();
				}
				/** @type {PlaylistBaseHeader|PlaylistRow} */
				let new_focus = this.focused_item;

				// Get top uncollapsed header
				let visible_header = this.cnt_helper.get_visible_parent(this.focused_item);
				if (visible_header) {
					while (visible_header.parent instanceof PlaylistBaseHeader && visible_header.is_collapsed) {
						visible_header = visible_header.parent;
					}

					this.collapse_handler.collapse(visible_header);
					new_focus = visible_header;
				}

				this.selection_handler.update_selection(new_focus);
				this.repaint();
			}
		);

		key_handler.register_key_action(VKey.RIGHT,
			(modifiers) => {
				if (!this.collapse_handler || !this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof PlaylistRow ? top_item : top_item.get_first_row();
				}
				/** @type {PlaylistBaseHeader|PlaylistRow} */
				let new_focus = this.focused_item;

				const visible_header = this.cnt_helper.get_visible_parent(this.focused_item);
				const new_focus_item = visible_header.get_first_row();

				this.collapse_handler.expand(visible_header);
				if (this.collapse_handler.changed) {
					this.scroll_to_row(this.focused_item, new_focus_item);
					new_focus = new_focus_item;
				}

				this.selection_handler.update_selection(new_focus);
				this.repaint();
			}
		);

		key_handler.register_key_action(VKey.PRIOR,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof PlaylistRow ? top_item : top_item.get_first_row();
				}

				let new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = this.items_to_draw[0];
					if (new_focus_item && (!this.cnt_helper.is_item_navigable(new_focus_item))) {
						new_focus_item = this.cnt_helper.get_navigable_neighbor(new_focus_item, 1);
					}
					if (new_focus_item && (new_focus_item.y < this.list_y && new_focus_item.y + new_focus_item.h > this.list_y)) {
						new_focus_item = this.cnt_helper.get_navigable_neighbor(new_focus_item, 1);
					}
					if (new_focus_item && (new_focus_item === this.focused_item)) {
						this.scrollbar.shift_page(-1);

						new_focus_item = this.items_to_draw[0];
						if (!this.cnt_helper.is_item_navigable(new_focus_item)) {
							new_focus_item = this.cnt_helper.get_navigable_neighbor(new_focus_item, 1);
						}
					}
				}
				else {
					new_focus_item = this.items_to_draw[0];
				}

				this.selection_handler.update_selection(new_focus_item, undefined, modifiers.shift);
				this.repaint();
			}
		);

		key_handler.register_key_action(VKey.NEXT,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					this.focused_item = this.items_to_draw[0];
					if (!this.cnt_helper.is_item_navigable(this.focused_item)) {
						this.focused_item = this.cnt_helper.get_navigable_neighbor(this.focused_item, 1);
					}
				}

				let new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = Last(this.items_to_draw);
					if (new_focus_item && (!this.cnt_helper.is_item_navigable(new_focus_item))) {
						new_focus_item = this.cnt_helper.get_navigable_neighbor(new_focus_item, -1);
					}
					if (new_focus_item && (new_focus_item.y < this.list_y + this.list_h && new_focus_item.y + new_focus_item.h > this.list_y + this.list_h)) {
						new_focus_item = this.cnt_helper.get_navigable_neighbor(new_focus_item, -1);
					}
					if (new_focus_item && (new_focus_item === this.focused_item)) {
						this.scrollbar.shift_page(1);
						new_focus_item = Last(this.items_to_draw);
						if (!this.cnt_helper.is_item_navigable(new_focus_item)) {
							new_focus_item = this.cnt_helper.get_navigable_neighbor(new_focus_item, -1);
						}
					}
				}
				else {
					new_focus_item = Last(this.items_to_draw);
				}

				this.selection_handler.update_selection(new_focus_item, undefined, modifiers.shift);
				this.repaint();
			}
		);

		key_handler.register_key_action(VKey.HOME,
			(modifiers) => {
				this.selection_handler.update_selection(this.cnt.rows[0], undefined, modifiers.shift);
				this.scrollbar.scroll_to_start();
			}
		);

		key_handler.register_key_action(VKey.END,
			(modifiers) => {
				this.selection_handler.update_selection(Last(this.cnt.rows), undefined, modifiers.shift);
				this.scrollbar.scroll_to_end();
			}
		);

		key_handler.register_key_action(VKey.DELETE,
			(modifiers) => {
				if (!this.selection_handler.has_selected_items() && this.focused_item) {
					this.selection_handler.update_selection(this.focused_item);
				}
				plman.UndoBackup(this.cur_playlist_idx);
				plman.RemovePlaylistSelection(this.cur_playlist_idx);
			}
		);

		key_handler.register_key_action(VKey.KEY_A,
			(modifiers) => {
				if (modifiers.ctrl) {
					this.selection_handler.select_all();
					this.repaint();
				}
			}
		);

		key_handler.register_key_action(VKey.KEY_F,
			(modifiers) => {
				if (modifiers.ctrl) {
					fb.RunMainMenuCommand('Edit/Search');
				}
				else if (modifiers.shift) {
					fb.RunMainMenuCommand('Library/Search');
				}
			}
		);

		key_handler.register_key_action(VKey.RETURN,
			(modifiers) => {
				if (!this.focused_item) { // Needed to reinit lost focus to prevent crash, e.g from 3rd party components using their own window
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof PlaylistRow ? top_item : top_item.get_first_row();
				}
				plman.ExecutePlaylistDefaultAction(this.cur_playlist_idx, this.focused_item.idx);
			}
		);

		key_handler.register_key_action(VKey.KEY_O,
			(modifiers) => {
				if (modifiers.shift) {
					fb.RunContextCommandWithMetadb('Open Containing Folder', this.focused_item.metadb);
				}
			}
		);

		key_handler.register_key_action(VKey.KEY_Q,
			(modifiers) => {
				if (!this.queue_handler) {
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					this.queue_handler.flush();
				}
				else if (this.selection_handler.selected_items_count() >= 1) {
					const rows = this.cnt.rows;
					if (modifiers.ctrl) {
						const indexes = this.selection_handler.get_selected_items();
						for (const idx of indexes) {
							this.queue_handler.add_row(rows[idx]);
						}
					}
					else if (modifiers.shift) {
						const indexes = this.selection_handler.get_selected_items();
						for (const idx of indexes) {
							this.queue_handler.remove_row(rows[idx]);
						}
					}
				}
			}
		);

		key_handler.register_key_action(VKey.F5,
			(modifiers) => {
				PlaylistHeader.img_cache.clear();
				this.initialize_and_repaint_list(true);
			}
		);

		key_handler.register_key_action(VKey.KEY_C,
			(modifiers) => {
				if (modifiers.ctrl) {
					this.selection_handler.copy();
				}
			}
		);

		key_handler.register_key_action(VKey.KEY_X,
			(modifiers) => {
				if (modifiers.ctrl) {
					this.selection_handler.cut();
				}
			}
		);

		key_handler.register_key_action(VKey.KEY_V,
			(modifiers) => {
				if (modifiers.ctrl && !plman.IsPlaylistLocked(this.cur_playlist_idx)) {
					this.selection_handler.paste();
				}
			}
		);
	}

	/**
	 * Handles when playlist content has changed, i.e playlist items were added, reordered or removed.
	 * Sets the rows boundary status and fetches album art for playlist headers.
	 * @override
	 * @protected
	 */
	on_content_to_draw_change() {
		this._set_rows_boundary_status();
		// @ts-ignore
		BaseList.prototype.on_content_to_draw_change.apply(this);
		if (plSet.show_album_art && !plSet.use_compact_header) {
			this.header_artwork.getAlbumArt(this.items_to_draw);
		}
	}

	/**
	 * Updates the scroll position of a playlist and redraws the scrollbar.
	 * @override
	 * @protected
	 */
	scrollbar_redraw_callback() {
		this.scroll_pos_list[this.cur_playlist_idx] = Math.round(this.scrollbar.scroll * 1e2) / 1e2;
		// @ts-ignore
		BaseList.prototype.scrollbar_redraw_callback.apply(this);
	}

	/**
	 * Iterates through all playlist headers and updates the background color and metadata of each item.
	 * Used when updating playlist header background color in Reborn/Random theme, when switching themes or setting a new rating.
	 */
	update_playlist_headers() {
		pl.cache_header = false;
		for (let i = 0; i < this.cnt.sub_items.length; i++) {
			const item = this.cnt.sub_items[i];
			item.clearCachedHeaderImg();
		}
		pl.cache_header = true;
	}

	/**
	 * Iterates through all playlist rows and updates the title color of each item.
	 * Used when updating title color in Reborn/Random theme.
	 */
	update_playlist_rows() {
		for (let i = 0; i < this.cnt.rows.length; i++) {
			const item = this.cnt.rows[i];
			item.update_title_color();
		}
	}
	// #endregion

	// * PUBLIC METHODS - SCROLLING * //
	// #region PUBLIC METHODS - SCROLLING
	/**
	 * Scrolls the playlist to the current now playing track after some checks.
	 */
	show_now_playing() {
		const playing_item_location = plman.GetPlayingItemLocation();
		if (!playing_item_location.IsValid) {
			return;
		}

		if (playing_item_location.PlaylistIndex !== this.cur_playlist_idx) {
			plman.ActivePlaylist = playing_item_location.PlaylistIndex;
			this.initialize_list();
		}
		else if (this.playing_item && this.collapse_handler) {
			this.collapse_handler.expand(this.playing_item.parent);
		}

		this.selection_handler.update_selection(this.cnt.rows[playing_item_location.PlaylistItemIndex]);

		this.scroll_to_now_playing();
	}

	/**
	 * Scrolls the playlist to the current now playing track or focused item.
	 */
	scroll_to_now_playing_or_focused() {
		if (this.playing_item) {
			this.scroll_to_row(null, this.playing_item);
		}
		else if (this.focused_item) {
			this.scroll_to_row(null, this.focused_item);
		}
	}

	/**
	 * Scrolls the playlist to the focused item or current now playing track.
	 */
	scroll_to_focused_or_now_playing() {
		if (this.focused_item) {
			this.scroll_to_row(null, this.focused_item);
		}
		else if (fb.CursorFollowPlayback && this.playing_item) {
			this.scroll_to_row(null, this.playing_item);
		}
	}

	/**
	 * Scrolls the playlist to the focused item.
	 */
	scroll_to_focused() {
		if (this.focused_item && !grm.ui.displayLibrarySplit()) {
			this.scroll_to_row(null, this.focused_item);
		}
	}

	/**
	 * Scrolls the playlist to the current now playing track.
	 */
	scroll_to_now_playing() {
		if (this.playing_item) {
			this.scroll_to_row(null, this.playing_item);
		}
	}

	/**
	 * Scrolls the playlist to a specific row, taking into account the visibility state of the row.
	 * @param {?PlaylistRow} from_row - The starting row from which to scroll.
	 * @param {PlaylistRow} to_row - The row index to which to scroll.
	 * @throws {ArgumentError} If an invalid visibility state is encountered.
	 */
	scroll_to_row(from_row, to_row) {
		if (!this.is_scrollbar_available) {
			return;
		}

		const has_headers = plSet.show_header;

		const visible_to_item = this.cnt_helper.is_item_visible(to_row) ? to_row : this.cnt_helper.get_visible_parent(to_row);
		const to_item_state = this._get_item_visibility_state(visible_to_item);

		let shifted_successfully = false;
		switch (to_item_state.visibility) {
			case PlaylistVisibilityState.none: {
				if (!from_row) {
					break;
				}

				const visible_from_item = this.cnt_helper.is_item_visible(from_row) ? from_row : this.cnt_helper.get_visible_parent(from_row);

				const from_item_state = this._get_item_visibility_state(visible_from_item);
				if (from_item_state.visibility === PlaylistVisibilityState.none) {
					break;
				}

				const direction = (to_row.idx - from_row.idx) > 0 ? 1 : -1;
				let scroll_shift = 0;
				let neighbor_item = visible_from_item;
				do {
					const neighbor_item_state = this._get_item_visibility_state(neighbor_item);
					scroll_shift += neighbor_item_state.invisible_part;
					neighbor_item = direction > 0 ? this.cnt_helper.get_next_visible_item(neighbor_item) : this.cnt_helper.get_prev_visible_item(neighbor_item);
				} while (neighbor_item && !this.cnt_helper.is_item_navigable(neighbor_item));

				Assert(neighbor_item != null, LogicError, 'Failed to get navigable neighbor');

				if (visible_to_item !== neighbor_item) {
					// I.e. to_item and from_item are not neighbors
					break;
				}

				scroll_shift += visible_to_item.h / this.row_h;

				this.scrollbar.smooth_scroll_to(plSet.scrollbar_pos + direction * scroll_shift);
				shifted_successfully = true;
				break;
			}
			case PlaylistVisibilityState.partial_top: {
				if (to_item_state.invisible_part % 1 > 0) {
					this.scrollbar.shift_line(-1);
				}
				this.scrollbar.smooth_scroll_to(plSet.scrollbar_pos - Math.floor(to_item_state.invisible_part));
				shifted_successfully = true;
				break;
			}
			case PlaylistVisibilityState.partial_bottom: {
				if (to_item_state.invisible_part % 1 > 0) {
					this.scrollbar.shift_line(1);
				}
				this.scrollbar.smooth_scroll_to(plSet.scrollbar_pos + Math.floor(to_item_state.invisible_part));
				shifted_successfully = true;
				break;
			}
			case PlaylistVisibilityState.full: {
				shifted_successfully = true;
				break;
			}
			default: {
				throw new ArgumentError('visibility_state', to_item_state.visibility);
			}
		}

		if (shifted_successfully) {
			if (has_headers) {
				let scroll_shift = 0;
				let top_item = visible_to_item;
				while (top_item.parent && top_item.parent instanceof PlaylistBaseHeader && top_item === top_item.parent.sub_items[0]) {
					top_item = top_item.parent;
					const header_state = this._get_item_visibility_state(top_item);
					scroll_shift += header_state.invisible_part;
				}
				this.scrollbar.smooth_scroll_to(plSet.scrollbar_pos - scroll_shift);
			}
		}
		else {
			const item_draw_idx = this._get_item_draw_row_idx(visible_to_item);
			const new_scroll_pos = Math.max(0, item_draw_idx - Math.floor(this.rows_to_draw_precise / 2));
			if (!pl.history_used) {
				this.scrollbar.smooth_scroll_to(new_scroll_pos);
			}
		}
	}

	/**
	 * Starts the drag scroll action when reordering playlist items.
	 * @param {string} key - The string value of 'up' or 'down'.
	 */
	start_drag_scroll(key) {
		if (this.drag_scroll_timeout_timer) {
			return;
		}

		this.drag_scroll_timeout_timer = setTimeout(() => {
			if (this.drag_scroll_repeat_timer) {
				return;
			}

			this.drag_scroll_repeat_timer = setInterval(() => {
				if (!this.scrollbar.in_sbar && !this.selection_handler.is_dragging() || !this.drag_scroll_timeout_timer) {
					return;
				}

				this.drag_scroll_in_progress = true;

				let cur_marked_item;
				if (key === 'up') {
					this.scrollbar.shift_line(-1);
					this.scrollbar.start_shift_timer(-1);

					cur_marked_item = this.items_to_draw[0];
					if (cur_marked_item instanceof PlaylistBaseHeader) {
						this.collapse_handler.expand(cur_marked_item);
						if (this.collapse_handler.changed) {
							this.scrollbar.scroll_to(plSet.scrollbar_pos + cur_marked_item.get_sub_items_total_h_in_rows());
						}

						cur_marked_item = cur_marked_item.get_first_row();
					}

					this.selection_handler.drag(cur_marked_item, true);
					cur_marked_item.is_drop_boundary_reached = true;
				}
				else if (key === 'down') {
					this.scrollbar.shift_line(1);
					this.scrollbar.start_shift_timer(1);

					cur_marked_item = Last(this.items_to_draw);
					if (cur_marked_item instanceof PlaylistBaseHeader) {
						this.collapse_handler.expand(cur_marked_item);
						if (this.collapse_handler.changed) {
							this.repaint();
						}

						cur_marked_item = this.cnt.rows[cur_marked_item.get_first_row().idx - 1];
					}

					this.selection_handler.drag(cur_marked_item, false);
					cur_marked_item.is_drop_boundary_reached = true;
				}
				else {
					throw new ArgumentError('drag_scroll_command', key);
				}

				if (this.scrollbar.is_scrolled_down || this.scrollbar.is_scrolled_up) {
					this.stop_drag_scroll();
				}
			}, 50);
		}, 350);
	}

	/**
	 * Stops the drag scroll action when dropping reordered playlist items.
	 */
	stop_drag_scroll() {
		if (this.drag_scroll_repeat_timer) {
			clearInterval(this.drag_scroll_repeat_timer);
		}
		if (this.drag_scroll_timeout_timer) {
			clearTimeout(this.drag_scroll_timeout_timer);
		}

		this.drag_scroll_timeout_timer = undefined;
		this.drag_scroll_repeat_timer = undefined;
		this.drag_scroll_in_progress = false;
		this.scrollbar.stop_shift_timer();
	}
	// #endregion

	// * PUBLIC METHODS - CONTEXT MENU * //
	// #region PUBLIC METHODS - CONTEXT MENU
	/**
	 * Appends the playlist tools menu to the parent menu.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_pltools(parent_menu) {
		const pltools = new ContextMenu('Playlist tools');
		const playlistCount = plman.PlaylistCount;
		pltools.appendItem('Playlist manager \tCtrl+M', () => {
			fb.RunMainMenuCommand('View/Playlist Manager');
		});
		pltools.appendItem('Playlist search \tCtrl+F', () => {
			fb.RunMainMenuCommand('View/Playlist search');
		});
		pltools.separator();

		pltools.appendItem('Create new playlist \tCtrl+N', () => {
			plman.CreatePlaylist(playlistCount, '');
			plman.ActivePlaylist = playlistCount;
		});

		const autopl = new ContextMenu('Create new auto playlist');
		pltools.append(autopl);
		autopl.appendItem('Custom auto playlist', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) New auto playlist', '', '', 0);
			plman.ActivePlaylist = playlistCount;
			plman.ShowAutoPlaylistUI(playlistCount);
		});
		autopl.separator();
		autopl.appendItem('Tracks from the library', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks from the library', 'ALL', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.separator();
		autopl.appendItem('Tracks most played', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks most played', '%play_count% GREATER 9', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks never played', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks never played', '%play_count% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks played in the last week', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks played in the last week', '%last_played% DURING LAST 1 WEEK', '%last_played%', 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks played in the last month', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks played in the last month', '%last_played% DURING LAST 4 WEEKS', '%last_played%', 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks played in the last year', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks played in the last year', '%last_played% DURING LAST 52 WEEKS', '%last_played%', 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.separator();
		autopl.appendItem('Tracks unrated', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks unrated', '%rating% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks rated 1', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 1', '%rating% IS 1', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks rated 2', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 2', '%rating% IS 2', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks rated 3', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 3', '%rating% IS 3', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks rated 4', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 4', '%rating% IS 4', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.appendItem('Tracks rated 5', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 5', '%rating% IS 5', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		autopl.separator();
		autopl.appendItem('Loved tracks', () => {
			plman.CreateAutoPlaylist(playlistCount, '(Auto) Loved tracks', '%mood% GREATER 0', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlistCount;
		});
		pltools.separator();

		pltools.appendItem('Save playlist \tCtrl+S', () => {
			fb.RunMainMenuCommand('File/Save playlist...');
		});
		pltools.appendItem('Load playlist', () => {
			fb.RunMainMenuCommand('File/Load playlist...');
		});
		const isAutoPl = !playlistCount ? '' : plman.IsAutoPlaylist(this.cur_playlist_idx);
		const isLocked = !playlistCount ? '' : plman.IsPlaylistLocked(this.cur_playlist_idx);
		pltools.appendItem(isLocked ? isAutoPl ? 'Unlock playlist (N/A for auto playlists)' : 'Unlock playlist' : 'Lock playlist', () => {
			if (isLocked && !isAutoPl) {
				plman.SetPlaylistLockedActions(this.cur_playlist_idx, null);
			} else if (!isAutoPl) {
				plman.SetPlaylistLockedActions(this.cur_playlist_idx, ['ExecuteDefaultAction']);
			}
		}, { is_grayed_out: isAutoPl });
		parent_menu.append(pltools);
	}

	/**
	 * Appends the playlist edit menu to the parent menu based on the presence of selected items and data in the clipboard.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_edit(parent_menu) {
		const has_selected_item = this.selection_handler.has_selected_items();
		const is_playlist_locked = !plman.PlaylistCount ? '' : plman.IsPlaylistLocked(this.cur_playlist_idx);
		// Check only for data presence, since parsing it's contents might take a while
		const has_data_in_clipboard = fb.CheckClipboardContents();
		if (has_selected_item || has_data_in_clipboard) {
			if (!parent_menu.empty()) {
				parent_menu.separator();
			}

			if (has_selected_item) {
				parent_menu.appendItem('Cut', () => {
					this.selection_handler.cut();
				}, { is_grayed_out: !has_selected_item });

				parent_menu.appendItem('Copy',	() => {
					this.selection_handler.copy();
				}, { is_grayed_out: !has_selected_item });
			}

			if (has_data_in_clipboard) {
				parent_menu.appendItem('Paste', () => {
					this.selection_handler.paste();
				}, { is_grayed_out: !has_data_in_clipboard || is_playlist_locked });
			}
		}

		if (has_selected_item) {
			if (!parent_menu.empty()) {
				parent_menu.separator();
			}

			parent_menu.appendItem('Remove', () => {
				plman.RemovePlaylistSelection(this.cur_playlist_idx);
			}, { is_grayed_out: is_playlist_locked });
		}
	}

	/**
	 * Appends the playlist collapse menu to the parent menu.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_collapse(parent_menu) {
		const ce = new ContextMenu('Collapse/Expand');
		parent_menu.append(ce);

		ce.appendItem('Collapse all', () => {
			if (plSet.show_header) {
				this.collapse_handler.collapse_all();
				if (this.collapse_handler.changed) {
					this.scroll_to_focused_or_now_playing();
				}
			}
		});

		if (plman.ActivePlaylist === plman.PlayingPlaylist && plSet.show_header) {
			ce.appendItem('Collapse all but now playing', () => {
				this.collapse_handler.collapse_all_but_now_playing();
				if (this.collapse_handler.changed) {
					this.scroll_to_now_playing_or_focused();
				}
			});
		}

		ce.appendItem('Expand all', () => {
			if (plSet.show_header) {
				this.collapse_handler.expand_all();
				if (this.collapse_handler.changed) {
					this.scroll_to_focused_or_now_playing();
				}
			}
		});

		ce.separator();

		ce.appendItem('Auto', () => {
			plSet.auto_collapse = !plSet.auto_collapse;
			if (plSet.show_header && plSet.auto_collapse) {
				this.collapse_handler.collapse_all_but_now_playing();
				if (this.collapse_handler.changed) {
					this.scroll_to_now_playing_or_focused();
				}
			} else {
				this.collapse_handler.expand_all();
			}
		}, { is_checked: plSet.auto_collapse });

		ce.appendItem('Collapse on start', () => {
			plSet.collapse_on_start = !plSet.collapse_on_start;
		}, { is_checked: plSet.collapse_on_start });

		ce.appendItem('Collapse on playlist switch', () => {
			plSet.collapse_on_playlist_switch = !plSet.collapse_on_playlist_switch;
		}, { is_checked: plSet.collapse_on_playlist_switch });
	}

	/**
	 * Appends the playlist appearance menu to the parent menu allowing to customize the appearance of the playlist.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_appearance(parent_menu) {
		const appear = new ContextMenu('Appearance');
		parent_menu.append(appear);

		PlaylistManager.append_playlist_info_visibility_context_menu_to(appear);

		this.append_scrollbar_visibility_context_menu_to(appear);

		appear.appendItem('Show artist name on difference', () => {
			grSet.showDifferentArtist = !grSet.showDifferentArtist;
			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: grSet.showDifferentArtist });

		appear.appendItem('Show artist name in all rows', () => {
			grSet.showArtistPlaylistRows = !grSet.showArtistPlaylistRows;
			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: grSet.showArtistPlaylistRows });

		appear.appendItem('Show album title in all rows', () => {
			grSet.showAlbumPlaylistRows = !grSet.showAlbumPlaylistRows;
			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: grSet.showAlbumPlaylistRows });

		appear.appendItem('Show group header', () => {
			plSet.show_header = !plSet.show_header;
			if (plSet.show_header) {
				this.collapse_handler = new PlaylistCollapseHandler(/** @type {PlaylistContent} */ this.cnt);
				this.collapse_handler.expand_all();
				this.collapse_handler.set_callback(() => {
					this.on_list_items_change();
				});
			}
			else {
				this.collapse_handler.expand_all();
				// this.collapse_handler = null;
			}

			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: plSet.show_header });

		if (plSet.show_header) {
			const appear_header = new ContextMenu('Headers');
			appear.append(appear_header);

			appear_header.appendItem('Use compact group header', () => {
				plSet.use_compact_header = !plSet.use_compact_header;
				this.header_h_in_rows = this._calcHeaderRows();
				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			}, { is_checked: plSet.use_compact_header });

			appear_header.appendItem('Show disc sub-header', () => {
				plSet.show_disc_header = !plSet.show_disc_header;
				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			}, { is_checked: plSet.show_disc_header });

			appear_header.appendItem('Show rating', () => {
				plSet.show_rating_header = !plSet.show_rating_header;
				this.clear_cache();
				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			}, { is_checked: plSet.show_rating_header });

			appear_header.appendItem('Show PLR value', () => {
				plSet.show_PLR_header = !plSet.show_PLR_header;
				this.clear_cache();
				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			}, { is_checked: plSet.show_PLR_header });

			if (!plSet.use_compact_header) {
				appear_header.appendItem('Show group info', () => {
					plSet.show_group_info = !plSet.show_group_info;
					this.clear_cache();
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				}, { is_checked: plSet.show_group_info });

				appear_header.appendItem('Flip header rows', () => {
					grSet.headerFlipRows = !grSet.headerFlipRows;
					this.clear_cache();
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				}, { is_checked: grSet.headerFlipRows });

				const art = new ContextMenu('Album art');
				appear_header.append(art);

				art.appendItem('Show', () => {
					plSet.show_album_art = !plSet.show_album_art;
					if (plSet.show_album_art) {
						this.header_artwork.getAlbumArt(this.items_to_draw);
					}
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				}, { is_checked: plSet.show_album_art });

				art.appendItem('Auto-hide when no cover', () => {
					plSet.auto_album_art = !plSet.auto_album_art;
					if (plSet.show_album_art) {
						this.header_artwork.getAlbumArt(this.items_to_draw);
					}
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				},
					{
						is_checked:    plSet.auto_album_art,
						is_grayed_out: !plSet.show_album_art
					}
				);
			}
		}

		const appear_row = new ContextMenu('Rows');
		appear.append(appear_row);

		appear_row.appendItem('Alternate row color', () => {
			plSet.show_row_stripes = !plSet.show_row_stripes;
		}, { is_checked: plSet.show_row_stripes });

		appear_row.appendItem('Show play count', () => {
			plSet.show_playcount = !plSet.show_playcount;
		}, { is_checked: plSet.show_playcount });

		appear_row.appendItem('Show queue position', () => {
			plSet.show_queue_position = !plSet.show_queue_position;
			this.queue_handler = plSet.show_queue_position ? new PlaylistQueueHandler(this.cnt.rows, this.cur_playlist_idx) : undefined;
		}, { is_checked: plSet.show_queue_position });

		appear_row.appendItem('Show rating', () => {
			plSet.show_rating = !plSet.show_rating;
		}, { is_checked: plSet.show_rating });

		appear_row.appendItem('Show rating from tags', () => {
			plSet.use_rating_from_tags = !plSet.use_rating_from_tags;
			this.clear_cache();
			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: plSet.use_rating_from_tags });

		appear_row.appendItem('Show rating grid', () => {
			grSet.showPlaylistRatingGrid = !grSet.showPlaylistRatingGrid;
			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: grSet.showPlaylistRatingGrid });

		appear_row.appendItem('Show PLR value', () => {
			plSet.show_PLR = !plSet.show_PLR;
		}, { is_checked: plSet.show_PLR });

		appear_row.separator();

		const playbackDisplayTimeMenu = new ContextMenu('Playback time display');
		for (const playbackTimeDisplay of [['Default', 'default'], ['Remaining', 'remaining'], ['Percent', 'percent']]) {
			playbackDisplayTimeMenu.appendItem(playbackTimeDisplay[0], () => {
				grSet.playlistPlaybackTimeDisplay = playbackTimeDisplay[1];
			}, { is_radio_checked: grSet.playlistPlaybackTimeDisplay === playbackTimeDisplay[1] });
		}
		appear_row.append(playbackDisplayTimeMenu);
	}

	/**
	 * Appends the playlist sort menu to a parent menu allowing to sort items in the playlist.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_sort(parent_menu) {
		const has_multiple_selected_items = this.selection_handler.selected_items_count() > 1;
		const is_auto_playlist = plman.IsAutoPlaylist(this.cur_playlist_idx);

		const sort = new ContextMenu(has_multiple_selected_items ? 'Sort selection' : 'Sort',
			{ is_grayed_out: is_auto_playlist }
		);
		parent_menu.append(sort);

		sort.appendItem('Always auto-sort', () => {
			grSet.playlistSortOrderAuto = !grSet.playlistSortOrderAuto;
		}, { is_checked: grSet.playlistSortOrderAuto });
		sort.separator();

		sort.appendItem('Sort by...', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by...');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by...');
			}
		});

		sort.separator();

		const sortOrder = [
			['Default', 'default'],
			['Artist | date', 'artistDate'],
			['Artist rating', 'artistRating'],
			['Artist playcount', 'artistPlaycount'],
			['Album', 'albumTitle'],
			['Album rating', 'albumRating'],
			['Album playcount', 'albumPlaycount'],
			['Track', 'trackTitle'],
			['Track number', 'trackNumber'],
			['Track rating', 'trackRating'],
			['Track playcount', 'trackPlaycount'],
			['Year', 'year'],
			['Genre', 'genre'],
			['Label', 'label'],
			['Country', 'country'],
			['File path', 'filePath'],
			['Custom', 'custom']
		];

		const sortOrderDirection = [
			['Order by ascending',  '_asc'],
			['Order by descending', '_dsc']
		];

		const setSorting = () => {
			grm.ui.setPlaylistSortOrder();
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		for (const direction of sortOrderDirection) {
			const savedOrder = grSet.playlistSortOrder.slice(0, -4);
			const sortOrderWithDirection = ['artistDate', 'artistRating', 'artistPlaycount', 'albumRating', 'albumPlaycount', 'trackRating', 'trackPlaycount', 'year', 'genre', 'label', 'country'].includes(savedOrder);
			sort.appendItem(direction[0], () => {
				grSet.playlistSortOrderDirection = direction[1];
				grSet.playlistSortOrder = sortOrderWithDirection ? `${savedOrder}${grSet.playlistSortOrderDirection}` : savedOrder;
				setSorting();
			}, {
				is_radio_checked: grSet.playlistSortOrderDirection === direction[1],
				is_grayed_out: !sortOrderWithDirection
			});
		}

		sort.separator();

		for (const item of sortOrder) {
			const sortOrderWithDirection = ['artistDate', 'artistRating', 'artistPlaycount', 'albumRating', 'albumPlaycount', 'trackRating', 'trackPlaycount', 'year', 'genre', 'label', 'country'].includes(item[1]);
			sort.appendItem(item[0], ((order) => {
				const savedDirection = grSet.playlistSortOrderDirection;
				grSet.playlistSortOrder = sortOrderWithDirection ? `${order}${savedDirection}` : order;
				if (grSet.playlistSortOrder === 'custom') grm.inputBox.playlistSortCustom();
				setSorting();
			}).bind(null, item[1]), {
				is_radio_checked: grSet.playlistSortOrderAuto &&
				(sortOrderWithDirection && item[1] === grSet.playlistSortOrder.slice(0, -4) ||
				!sortOrderWithDirection && item[1] === grSet.playlistSortOrder)
			});
		}

		sort.separator();

		sort.appendItem('Randomize', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Randomize');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Randomize');
			}
		});

		sort.appendItem('Reverse', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Reverse');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Reverse');
			}
		});

		sort.separator();

		sort.appendItem('Save', () => {
			fb.RunMainMenuCommand('File/Save playlist...');
		});

		sort.appendItem('Load', () => {
			fb.RunMainMenuCommand('File/Load playlist...');
		});

		sort.appendItem('Undo', () => {
			fb.RunMainMenuCommand('Edit/Undo');
		});
	}

	/**
	 * Appends the playlist weblinks menu to the parent menu, allowing the user to open various websites.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	ctx_menu_weblinks(parent_menu, metadb) {
		const weblinks = new ContextMenu('Weblinks');
		parent_menu.append(weblinks);

		const { websiteLabels, websiteValues } = WebsiteGenerateLinks(grCfg.customWebsiteLinks);
		const websites = websiteLabels.map((label, index) => [label, websiteValues[index]]);

		for (const website of websites) {
			weblinks.appendItem(website[0], ((url) => {
				WebsiteOpen(url, metadb);
			}).bind(null, website[1]));
		}
	}

	/**
	 * Appends the "Send selection" menu to the parent menu, allowing to perform various actions on selected items in a playlist.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_send(parent_menu) {
		const playlistCount = plman.PlaylistCount;
		const send = new ContextMenu('Send selection');
		parent_menu.append(send);

		send.appendItem('To top', () => {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.MovePlaylistSelection(this.cur_playlist_idx, -plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx));
		});

		send.appendItem('To bottom', () => {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.MovePlaylistSelection(this.cur_playlist_idx, plman.PlaylistItemCount(this.cur_playlist_idx) - plman.GetPlaylistSelectedItems(this.cur_playlist_idx).Count);
		});

		send.separator();

		send.appendItem('Create New Playlist \tCtrl+N', () => {
			plman.CreatePlaylist(playlistCount, '');
			plman.InsertPlaylistItems(playlistCount, 0, plman.GetPlaylistSelectedItems(this.cur_playlist_idx), true);
		});

		send.separator();

		for (let i = 0; i < playlistCount; ++i) {
			let playlist_text = `${plman.GetPlaylistName(i)} [${plman.PlaylistItemCount(i)}]`;

			const is_item_autoplaylist = plman.IsAutoPlaylist(i);
			if (is_item_autoplaylist) {
				playlist_text += ' (Auto)';
			}

			if (i === plman.PlayingPlaylist) {
				playlist_text += ' (Now Playing)';
			}

			send.appendItem(playlist_text, ((playlist_idx) => {
				this.selection_handler.send_to_playlist(playlist_idx);
			}).bind(undefined, i), { is_grayed_out: is_item_autoplaylist || i === this.cur_playlist_idx });
		}
	}

	/**
	 * Appends the playlist "write playlist stats list" menu to the parent menu.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_playlist_stats(parent_menu) {
		const playlistStatsMenu = new ContextMenu('Write playlist statistics to list');
		const playlistName = ReplaceIllegalChars(plman.GetPlaylistName(plman.ActivePlaylist));
		const sortBy = plSet.playlist_stats_sort_by;
		const sortDirection = plSet.playlist_stats_sort_direction;

		// * Include menu
		const statsIncludeMenu = [
			['Include artist', 'playlist_stats_include_artist'],
			['Include album', 'playlist_stats_include_album'],
			['Include track', 'playlist_stats_include_track'],
			['Include year', 'playlist_stats_include_year'],
			['Include genre', 'playlist_stats_include_genre'],
			['Include label', 'playlist_stats_include_label'],
			['Include country', 'playlist_stats_include_country'],
			['Include stats', 'playlist_stats_include_stats']
		];
		for (const [label, setting] of statsIncludeMenu) {
			playlistStatsMenu.appendItem(label, () => {
				plSet[setting] = !plSet[setting];
			}, { is_checked: plSet[setting] });
		}

		playlistStatsMenu.separator();

		// * Sort by menu
		const sortByMenu = [
			['Sort by artist', 'artist'],
			['Sort by album', 'albumTitle'],
			['Sort by track', 'trackTitle'],
			['Sort by year', 'year'],
			['Sort by genre', 'genre'],
			['Sort by label', 'label'],
			['Sort by country', 'country'],
			['Sort by stats', '']
		];
		for (const sortBy of sortByMenu) {
			playlistStatsMenu.appendItem(sortBy[0], () => {
				plSet.playlist_stats_sort_by = sortBy[1];
			}, { is_radio_checked: plSet.playlist_stats_sort_by === sortBy[1] });
		}

		playlistStatsMenu.separator();

		// * Order by menu
		const sortDirectionMenu = [
			['Order by ascending',  '_asc'],
			['Order by descending', '_dsc']
		];
		for (const direction of sortDirectionMenu) {
			playlistStatsMenu.appendItem(direction[0], () => {
				plSet.playlist_stats_sort_direction = direction[1];
			}, { is_radio_checked: plSet.playlist_stats_sort_direction === direction[1] });
		}

		playlistStatsMenu.separator();

		// * Reset settings menu item
		playlistStatsMenu.appendItem('Reset settings', () => {
			plSet.playlist_stats_include_artist = true;
			plSet.playlist_stats_include_album = true;
			plSet.playlist_stats_include_track = true;
			plSet.playlist_stats_include_year = false;
			plSet.playlist_stats_include_genre = false;
			plSet.playlist_stats_include_label = false;
			plSet.playlist_stats_include_country = false;
			plSet.playlist_stats_include_stats = true;
			plSet.playlist_stats_sort_direction = '_dsc';
			plSet.playlist_stats_sort_by = '';
		});

		playlistStatsMenu.separator();

		// * Playlist stats list menu
		const statsTypeMenu = [
			['Artist rating', 'artistRating'],
			['Artist playcount', 'artistPlaycount'],
			['Album rating', 'albumRating'],
			['Album playcount', 'albumPlaycount'],
			['Album playcount total', 'albumPlaycountTotal'],
			['Album track rating', 'albumTrackRating'],
			['Album track playcount', 'albumTrackPlaycount'],
			['Track rating', 'trackRating'],
			['Track playcount', 'trackPlaycount'],
			['Top rated', 'topRated'],
			['Top played', 'topPlayed']
		];

		for (const item of statsTypeMenu) {
			const statsTypeAlbums = item[1].startsWith('album');
			const statsTypeTracks = statsTypeAlbums && plSet.playlist_stats_sort_by.startsWith('track');

			playlistStatsMenu.appendItem(item[0], ((statsType) => {
				const metadataType =
					item[1].startsWith('artist') ? 'artist' :
					item[1].startsWith('track') ? 'track' :
					item[1].startsWith('album') ? 'album' :
					item[1].endsWith('topRated') ? 'topRated' :
					item[1].endsWith('topPlayed') ? 'topPlayed' :
					'album';

				const statsName = CapitalizeString(item[0], true);
				const newStatsType = sortBy ? `${sortBy}${sortDirection}_${statsType}` : `${statsType}${sortDirection}`;
				const filePath = `${fb.ProfilePath}cache\\playlist\\${playlistName}_${statsName}${statsType.startsWith('top') ? '_statistics' : `_[${newStatsType}]`}.txt`;

				const ratingType = {
					artistRating: 'artistAverage',
					albumRating: 'albumAverage',
					albumRatingTotal: 'albumTotal',
					albumTrackRating: 'albumTracks'
				};

				const playcountType = {
					artistPlaycount: 'artistPlaycount',
					albumPlaycount: 'albumAverage',
					albumPlaycountTotal: 'albumTotal',
					albumTrackPlaycount: 'albumTracks'
				};

				this.meta_manager.write_stats_to_text_file(metadataType, filePath, statsName, newStatsType, ratingType[item[1]], playcountType[item[1]]);
				fb.ShowPopupMessage(`${statsName} list was saved in:\n\n${filePath}`, `${statsName} list`);
			}).bind(this, item[1]), { is_grayed_out: statsTypeTracks });
		}

		parent_menu.append(playlistStatsMenu);
	}

	/**
	 * Appends the playlist "write playlist diagnostics list" menu to the parent menu.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 */
	ctx_menu_playlist_diagnostics(parent_menu) {
		const playlistDiagnosticsMenu = new ContextMenu('Write playlist diagnostics to list');
		const playlistName = ReplaceIllegalChars(plman.GetPlaylistName(plman.ActivePlaylist));

		// * Include album art menu
		const includeAlbumArtMenu = [
			['Include album art (Check all list)', 'album_art'],
			['Include album art local (Check all list)', 'album_art_local'],
			['Include album art embedded (Check all list)', 'album_art_embedded']
		];
		for (const includeAlbumArt of includeAlbumArtMenu) {
			playlistDiagnosticsMenu.appendItem(includeAlbumArt[0], () => {
				plSet.playlist_diagnostic_album_art = includeAlbumArt[1];
			}, { is_radio_checked: plSet.playlist_diagnostic_album_art === includeAlbumArt[1] });
		}
		playlistDiagnosticsMenu.separator();

		// * Playlist diagnostics files menu
		const diagnosticsFilesMenu = [
			['Missing album art', 'album_art'],
			['Missing album art (local)', 'album_art_local'],
			['Missing album art (embedded)', 'album_art_embedded'],
			['Missing disc art', 'disc_art'],
			['Missing playlist files', 'playlist_files'],
			['Check all missing files', 'checkFiles']
		];
		for (const item of diagnosticsFilesMenu) {
			playlistDiagnosticsMenu.appendItem(item[0], ((type) => {
				const diagnosticsName = CapitalizeString(item[0], true);
				const filePath = `${fb.ProfilePath}cache\\playlist\\${playlistName}_${diagnosticsName}.txt`;
				this.meta_manager.write_diagnostics_to_text_file(type, filePath);
				fb.ShowPopupMessage(`${diagnosticsName} list was saved in:\n\n${filePath}`, `${diagnosticsName} list`);
			}).bind(this, item[1]));
			if (item[1] === 'playlist_files') playlistDiagnosticsMenu.separator();
		}
		playlistDiagnosticsMenu.separator();

		// * Playlist diagnostics tags menu
		const diagnosticsTagsMenu = [
			['Missing artist name', 'artist_name'],
			['Missing album title', 'album_title'],
			['Missing track number', 'track_number'],
			['Missing track title', 'track_title'],
			['Missing year', 'year'],
			['Missing genre', 'genre'],
			['Missing label', 'label'],
			['Missing country', 'country'],
			['Check all missing tagging', 'checkTags']
		];
		for (const item of diagnosticsTagsMenu) {
			playlistDiagnosticsMenu.appendItem(item[0], ((type) => {
				const diagnosticsName = CapitalizeString(item[0], true);
				const filePath = `${fb.ProfilePath}cache\\playlist\\${playlistName}_${diagnosticsName}.txt`;
				this.meta_manager.write_diagnostics_to_text_file(type, filePath);
				fb.ShowPopupMessage(`${diagnosticsName} list was saved in:\n\n${filePath}`, `${diagnosticsName} list`);
			}).bind(this, item[1]));
			if (item[1] === 'country') playlistDiagnosticsMenu.separator();
		}

		parent_menu.append(playlistDiagnosticsMenu);
	}
	// #endregion
}
