/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Controls                        * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////////
// * KEYBOARD HANDLER * //
//////////////////////////
/**
 * A class that handles key action events to determine whether a key is pressed.
 */
class PlaylistKeyActionHandler {
	/**
	 * Creates the `PlaylistKeyActionHandler` instance.
	 * The actions registry is an object that maps keys to their respective action callbacks.
	 */
	constructor() {
		/** @private @type {{[key: string]: Function}} */
		this.actions = {};
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Registers a key action.
	 * @param {string|number} key - The key to register.
	 * @param {Function} action_callback - The callback to run when the key is pressed.
	 * @throws {ArgumentError} If the action callback is not a function.
	 * @throws {ArgumentError} If the key is already used.
	 */
	register_key_action(key, action_callback) {
		if (!action_callback) {
			throw new ArgumentError('action_callback', action_callback);
		}

		if (this.actions[key]) {
			throw new ArgumentError('key', key.toString(), 'This key is already used');
		}

		this.actions[key] = action_callback;
	}

	/**
	 * Invokes a key action.
	 * @param {string} key - The key to invoke.
	 * @param {object} [key_modifiers] - The modifiers for the key passed to key action callback.
	 * @param {boolean} [key_modifiers.ctrl] - The option to disable the CTRL key.
	 * @param {boolean} [key_modifiers.alt] - The option to disable the ALT key.
	 * @param {boolean} [key_modifiers.shift] - The option to disable the SHIFT key.
	 * @returns {boolean} True or false.
	 */
	invoke_key_action(key, key_modifiers) {
		const key_action = this.actions[key];
		if (!this.actions[key]) {
			return false;
		}

		key_action(key_modifiers || {});

		return true;
	}
	// #endregion
}


///////////////////////////
// * SELECTION HANDLER * //
///////////////////////////
/**
 * A class that handles selection and manipulation of playlist items.
 */
class PlaylistSelectionHandler {
	/**
	 * Creates the `PlaylistSelectionHandler` instance.
	 * @param {PlaylistContent} cnt_arg - The playlist content.
	 * @param {number} cur_playlist_idx_arg - The current playlist index.
	 */
	constructor(cnt_arg, cur_playlist_idx_arg) {
		/** @private @constant @type {PlaylistContentNavigation} */
		this.cnt_helper = cnt_arg.helper;
		/** @private @constant @type {Array<PlaylistRow>} */
		this.rows = cnt_arg.rows;

		/** @private @constant @type {number} */
		this.cur_playlist_idx = cur_playlist_idx_arg;
		/** @private @type {Array<number>} */
		this.selected_indexes = [];
		/** @private @type {?number} */
		this.last_single_selected_index = undefined;

		/** @public @type {boolean} */
		this.dragging = false;
		/** @public @type {boolean} */
		this.internal_drag_n_drop_active = false;
		/** @public @type {?PlaylistRow} */
		this.last_hover_row = undefined;

		/**
		 * Sorts an array of numbers in ascending order.
		 * @param {number} a - The first number to compare.
		 * @param {number} b - The second number to compare.
		 * @returns {number} The difference between `a` and `b`.
		 */
		this.numeric_ascending_sort = (a, b) => (a - b);

		/**
		 * Checks if two arrays are equal in terms of length and the values at each index.
		 * @param {Array} a - The first array.
		 * @param {Array} b - The second array.
		 * @returns {boolean} True if the arrays are equal, false otherwise.
		 */
		this.arraysEqual = (a, b) => {
			if (a === b) return true;
			if (a == null || b == null || a.length !== b.length) return false;

			for (let i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		};

		this.initialize_selection();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Updates the selection state of the playlist according to the given header.
	 * @param {PlaylistBaseHeader} header - The header to update the selection state for.
	 * @param {boolean} ctrl_pressed - Whether or not the Ctrl key is pressed.
	 * @param {boolean} shift_pressed - Whether or not the Shift key is pressed.
	 * @private
	 */
	_update_selection_with_header(header, ctrl_pressed, shift_pressed) {
		const row_indexes = header.get_row_indexes();

		if (shift_pressed) {
			this.selected_indexes = Union(this._get_shift_selection(row_indexes[0]), row_indexes);
		}
		else {
			if (ctrl_pressed) {
				const is_selected = Difference(row_indexes, this.selected_indexes).length === 0;
				if (is_selected) {
					this.clear_selection();
				}
				else {
					this.selected_indexes = Union(this.selected_indexes, row_indexes);
				}
			}
			else {
				this.selected_indexes = row_indexes;
			}
			this.last_single_selected_index = row_indexes[0];
		}

		plman.ClearPlaylistSelection(this.cur_playlist_idx);
		plman.SetPlaylistSelection(this.cur_playlist_idx, this.selected_indexes, true);
		if (row_indexes.length) {
			plman.SetPlaylistFocusItem(this.cur_playlist_idx, row_indexes[0]);
		}
	}

	/**
	 * Updates the selection state of the playlist according to the given row.
	 * @param {PlaylistRow} row - The row to update the selection state for.
	 * @param {boolean} ctrl_pressed - Whether or not the Ctrl key is pressed.
	 * @param {boolean} shift_pressed - Whether or not the Shift key is pressed.
	 * @private
	 */
	_update_selection_with_row(row, ctrl_pressed, shift_pressed) {
		if (shift_pressed) {
			this.selected_indexes = this._get_shift_selection(row.idx);

			// plman.ClearPlaylistSelection(this.cur_playlist_idx); // * Disabled to enable contiguous Ctrl+shift selection
			plman.SetPlaylistSelection(this.cur_playlist_idx, this.selected_indexes, true);
		}
		else if (ctrl_pressed) {
			const is_selected = this.selected_indexes.find((idx) => row.idx === idx);

			if (is_selected) {
				this.selected_indexes = this.selected_indexes.filter(idx => idx !== row.idx);
			}
			else {
				this.selected_indexes.push(row.idx);
			}

			this.last_single_selected_index = row.idx;

			plman.SetPlaylistSelectionSingle(this.cur_playlist_idx, row.idx, !is_selected);
		}
		else {
			this.selected_indexes.push(row.idx);
			this.last_single_selected_index = row.idx;

			plman.ClearPlaylistSelection(this.cur_playlist_idx);
			plman.SetPlaylistSelectionSingle(this.cur_playlist_idx, row.idx, true);
		}

		plman.SetPlaylistFocusItem(this.cur_playlist_idx, row.idx);
	}

	/**
	 * Gets the indexes of the rows that should be selected when the Shift key is pressed.
	 * @param {number} selected_idx - The index of the row that was selected.
	 * @returns {Range} The range of indexes that should be selected.
	 * @private
	 */
	_get_shift_selection(selected_idx) {
		let a = 0;
		let b = 0;

		if (this.last_single_selected_index == null) {
			this.last_single_selected_index = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);
			if (this.last_single_selected_index === -1) {
				this.last_single_selected_index = 0;
			}
		}

		if (this.cnt_helper.is_item_visible(this.rows[this.last_single_selected_index])) {
			if (this.last_single_selected_index < selected_idx) {
				a = this.last_single_selected_index;
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = this.last_single_selected_index;
			}
		}
		else {
			const last_selected_header = this.cnt_helper.get_visible_parent(this.rows[this.last_single_selected_index]);
			if (this.last_single_selected_index < selected_idx) {
				a = last_selected_header.get_row_indexes()[0];
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = Last(last_selected_header.get_row_indexes());
			}
		}

		return Range(a, b + 1);
	}

	/**
	 * Checks if the selection is contiguous.
	 * @returns {boolean} True or false.
	 * @private
	 */
	_is_selection_contiguous() {
		for (let i = 1; i < this.selected_indexes.length; i++) {
			if (this.selected_indexes[i] - this.selected_indexes[i - 1] !== 1) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Moves the selection to the given index.
	 * @param {number} new_idx - The new index of the selection.
	 * @private
	 */
	_move_selection(new_idx) {
		plman.UndoBackup(this.cur_playlist_idx);
		let move_delta;

		if (this._is_selection_contiguous()) {
			const focus_idx = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);

			move_delta = new_idx < focus_idx ? -(this.selected_indexes[0] - new_idx) : new_idx - (Last(this.selected_indexes) + 1);
		}
		else {
			const item_count_before_drop_idx = this.selected_indexes.filter(idx => idx < new_idx).length;

			move_delta = -(plman.PlaylistItemCount(this.cur_playlist_idx) - this.selected_indexes.length - (new_idx - item_count_before_drop_idx));

			// Move to the end to make it contiguous, then back to drop_idx
			plman.MovePlaylistSelection(this.cur_playlist_idx, plman.PlaylistItemCount(this.cur_playlist_idx));
		}
		plman.MovePlaylistSelection(this.cur_playlist_idx, move_delta);
	}

	/**
	 * Clears the last hover row.
	 * @private
	 */
	_clear_last_hover_row() {
		if (!this.last_hover_row) return;
		this.last_hover_row.is_drop_bottom_selected = false;
		this.last_hover_row.is_drop_top_selected = false;
		this.last_hover_row.is_drop_boundary_reached = false;
		this.last_hover_row.repaint();
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes the selection state.
	 */
	initialize_selection() {
		this.selected_indexes = [];
		let i = 0;
		for (const item of this.rows) {
			if (plman.IsPlaylistItemSelected(this.cur_playlist_idx, item.idx)) {
				this.selected_indexes.push(i);
			}
			i++;
		}
	}

	/**
	 * Updates the selection state.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to update the selection state for.
	 * @param {boolean} [ctrl_pressed] - Whether CTRL key is pressed.
	 * @param {boolean} [shift_pressed] - Whether SHIFT key is pressed.
	 */
	update_selection(item, ctrl_pressed, shift_pressed) {
		if (!item) {
			return;
		}
		Assert(item != null, LogicError, 'update_selection was called with undefined item');

		if (!ctrl_pressed && !shift_pressed) {
			this.selected_indexes = [];
			this.last_single_selected_index = undefined;
		}

		const visible_item = this.cnt_helper.is_item_visible(item) ? item : this.cnt_helper.get_visible_parent(item);
		if (visible_item instanceof PlaylistBaseHeader) {
			this._update_selection_with_header(visible_item, ctrl_pressed, shift_pressed);
		}
		else {
			this._update_selection_with_row(/** @type {PlaylistRow}*/ visible_item, ctrl_pressed, shift_pressed);
		}

		this.selected_indexes.sort(this.numeric_ascending_sort);
	}

	/**
	 * Moves the selection up one row.
	 */
	move_selection_up() {
		if (!this.selected_indexes.length) {
			return;
		}

		this._move_selection(Math.max(0, this.selected_indexes[0] - 1));
	}

	/**
	 * Moves the selection down one row.
	 */
	move_selection_down() {
		if (!this.selected_indexes.length) {
			return;
		}

		this._move_selection(Math.min(this.rows.length, Last(this.selected_indexes) + 2));
	}

	/**
	 * Selects all playlist items.
	 */
	select_all() {
		if (!this.rows.length) {
			return;
		}

		this.selected_indexes = Range(this.rows[0].idx, Last(this.rows).idx + 1);
		this.last_single_selected_index = this.rows[0].idx;

		plman.SetPlaylistSelection(this.cur_playlist_idx, this.selected_indexes, true);
	}

	/**
	 * Clears current selection on the playlist item.
	 */
	clear_selection() {
		if (!this.selected_indexes.length) {
			return;
		}
		this.selected_indexes = [];
		this.last_single_selected_index = undefined;
		plman.ClearPlaylistSelection(this.cur_playlist_idx);
	}

	/**
	 * Gets the indexes of selected playlist items.
	 * @returns {number} The indexes of the selected items.
	 */
	get_selected_items() {
		return this.selected_indexes;
	}

	/**
	 * Whether there are any selected playlist items.
	 * @returns {boolean} True if any items are selected.
	 */
	has_selected_items() {
		return !!this.selected_indexes.length;
	}

	/**
	 * Gets the total number of selected playlist items.
	 * @returns {number} The number of selected items.
	 */
	selected_items_count() {
		return this.selected_indexes.length;
	}

	/**
	 * Performs internal drag and drop of the selected playlist items inside the panel, i.e when reordering.
	 */
	perform_internal_drag_n_drop() {
		this.enable_drag();
		this.internal_drag_n_drop_active = true;

		const cur_playlist_size = plman.PlaylistItemCount(this.cur_playlist_idx);
		const cur_playlist_selection = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
		const cur_selected_indexes = this.selected_indexes;

		const effect = fb.DoDragDrop(window.ID, cur_playlist_selection, PlaylistDropEffect.copy | PlaylistDropEffect.move | PlaylistDropEffect.link);

		this.internal_drag_n_drop_active = false;

		if (this.dragging) {
			// If drag operation was not cancelled, then it means that nor on_drag_drop, nor on_drag_leave event handlers
			// were triggered, which means that the items were most likely dropped inside the panel
			// (and relevant methods were not called because of async event processing)
			return;
		}

		/**
		 * Checks if the playlist is in the same state and if the selected indexes are equal.
		 * This is necessary to ensure that we can handle the 'move drop' properly.
		 * The 'move drop' can be handled properly only when playlist is still in the same state.
		 * @returns {boolean} True or false.
		 */
		const can_handle_move_drop = () =>
			cur_playlist_size === plman.PlaylistItemCount(this.cur_playlist_idx) &&
			this.arraysEqual(cur_selected_indexes, this.selected_indexes);

		if (PlaylistDropEffect.none === effect && can_handle_move_drop()) {
			// DROPEFFECT_NONE needs special handling, because on NT it
			// is returned for some move operations, instead of DROPEFFECT_MOVE.
			// See Q182219 for the details.

			const items_to_remove = [];
			const playlist_items = plman.GetPlaylistItems(this.cur_playlist_idx);
			for (const idx of cur_selected_indexes) {
				const cur_item = playlist_items[idx];
				if (cur_item.RawPath.startsWith('file://') && !fso.FileExists(cur_item.Path)) {
					items_to_remove.push(idx);
				}
			}

			if (items_to_remove.length) {
				plman.ClearPlaylistSelection(this.cur_playlist_idx);
				plman.SetPlaylistSelection(this.cur_playlist_idx, items_to_remove, true);
				plman.RemovePlaylistSelection(this.cur_playlist_idx);
			}
		}
		else if (PlaylistDropEffect.move === effect && can_handle_move_drop()) {
			plman.RemovePlaylistSelection(this.cur_playlist_idx);
		}
	}

	/**
	 * Enables dragging.
	 */
	enable_drag() {
		this._clear_last_hover_row();
		this.dragging = true;
	}

	/**
	 * Disables dragging.
	 */
	disable_drag() {
		this._clear_last_hover_row();
		this.dragging = false;
	}

	/**
	 * Enables external dragging.
	 */
	enable_external_drag() {
		this.enable_drag();
		this.internal_drag_n_drop_active = false;
	}

	/**
	 * Checks whether dragging is active.
	 * @returns {boolean} True or false.
	 */
	is_dragging() {
		return this.dragging;
	}

	/**
	 * Checks whether the internal drag and drop is active.
	 * @returns {boolean} True or false.
	 */
	is_internal_drag_n_drop_active() {
		return this.internal_drag_n_drop_active;
	}

	/**
	 * Updates the hover row's drop state, also calls repaint.
	 * @param {?PlaylistRow} hover_row - The hover row.
	 * @param {boolean} is_above - Whether the hover row is above the dragged item.
	 */
	drag(hover_row, is_above) {
		if (hover_row == null) {
			this._clear_last_hover_row();
			return;
		}

		if (plman.IsPlaylistLocked(this.cur_playlist_idx)) {
			return;
		}

		let is_drop_top_selected = is_above;
		let is_drop_bottom_selected = !is_above;
		const is_drop_boundary_reached = hover_row.idx === 0 || (!is_above && hover_row.idx === this.rows.length - 1);

		if (this.internal_drag_n_drop_active && !utils.IsKeyPressed(VKey.CONTROL)) {
			// Can't move selected item on itself
			const is_item_above_selected = hover_row.idx !== 0 && this.rows[hover_row.idx - 1].is_selected();
			const is_item_below_selected = hover_row.idx !== (this.rows.length - 1) && this.rows[hover_row.idx + 1].is_selected();
			is_drop_top_selected = is_drop_top_selected && !hover_row.is_selected() && !is_item_above_selected;
			is_drop_bottom_selected = is_drop_bottom_selected && !hover_row.is_selected() && !is_item_below_selected;
		}

		let needs_repaint = false;
		if (this.last_hover_row) {
			if (this.last_hover_row.idx === hover_row.idx) {
				needs_repaint = this.last_hover_row.is_drop_top_selected !== is_drop_top_selected
					|| this.last_hover_row.is_drop_bottom_selected !== is_drop_bottom_selected
					|| this.last_hover_row.is_drop_boundary_reached !== is_drop_boundary_reached;
			}
			else {
				this._clear_last_hover_row();
				needs_repaint = true;
			}
		}
		else {
			needs_repaint = true;
		}

		hover_row.is_drop_top_selected = is_drop_top_selected;
		hover_row.is_drop_bottom_selected = is_drop_bottom_selected;
		hover_row.is_drop_boundary_reached = is_drop_boundary_reached;

		if (needs_repaint) {
			hover_row.repaint();
		}

		this.last_hover_row = hover_row;
	}

	/**
	 * Checks whether the playlist is in a state where it can accept a drop.
	 * @returns {boolean} True or false.
	 */
	can_drop() {
		let playlistIndex = false;
		return () => {
			if (plman.PlaylistCount > 0 && this.cur_playlist_idx >= 0 && this.cur_playlist_idx < plman.PlaylistCount && !plman.IsPlaylistLocked(this.cur_playlist_idx)) {
				return true;
			} else {
				if (!playlistIndex) { // If no playlist exists, create a new one.
					const playlist_idx = plman.CreatePlaylist(0, 'Default');
					plman.ActivePlaylist = playlist_idx;
					playlistIndex = true;
				}
				return false;
			}
		};
	}

	/**
	 * Handles a drop event.
	 * @param {boolean} copy_selection - Whether to copy the selection instead of moving it.
	 */
	drop(copy_selection) {
		if (!this.dragging) {
			return;
		}

		this.dragging = false;
		if (!this.selected_indexes.length || !this.last_hover_row) {
			return;
		}

		if (!this.last_hover_row.is_drop_top_selected && !this.last_hover_row.is_drop_bottom_selected) {
			this._clear_last_hover_row();
			return;
		}

		let drop_idx = this.last_hover_row.idx;
		if (this.last_hover_row.is_drop_bottom_selected) {
			++drop_idx;
		}

		this._clear_last_hover_row();

		if (!copy_selection) {
			this._move_selection(drop_idx);
		}
		else {
			plman.UndoBackup(this.cur_playlist_idx);

			const cur_selection = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
			plman.ClearPlaylistSelection(this.cur_playlist_idx);
			plman.InsertPlaylistItems(this.cur_playlist_idx, drop_idx, cur_selection, true);
			plman.SetPlaylistFocusItem(this.cur_playlist_idx, drop_idx);
		}
	}

	/**
	 * Handles external drag and drop.
	 * @param {DropTargetAction} action - The drag and drop action.
	 */
	external_drop(action) {
		plman.ClearPlaylistSelection(this.cur_playlist_idx);

		let playlist_idx;
		if (!plman.PlaylistCount) {
			playlist_idx = plman.CreatePlaylist(0, 'Default');
			plman.ActivePlaylist = playlist_idx;
		}
		else {
			playlist_idx = this.cur_playlist_idx;
			plman.UndoBackup(this.cur_playlist_idx);
		}

		action.Playlist = playlist_idx;
		action.ToSelect = true;

		if (this.last_hover_row) {
			let drop_idx = this.last_hover_row.idx;
			if (this.last_hover_row.is_drop_bottom_selected) {
				++drop_idx;
			}
			action.Base = drop_idx;
		}
		else {
			action.Base = plman.PlaylistCount;
		}

		this.disable_drag();
	}

	/**
	 * Copies the selected playlist items to the clipboard.
	 * @returns {void}
	 */
	copy() {
		if (!this.selected_indexes.length) {
			return fb.CreateHandleList();
		}

		const selected_items = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
		fb.CopyHandleListToClipboard(selected_items);
	}

	/**
	 * Cuts the selected playlist items to the clipboard.
	 * @returns {void}
	 */
	cut() {
		if (!this.selected_indexes.length) {
			return fb.CreateHandleList();
		}

		const selected_items = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);

		if (fb.CopyHandleListToClipboard(selected_items)) {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.RemovePlaylistSelection(this.cur_playlist_idx);
		}
	}

	/**
	 * Pastes the contents of the clipboard to the playlist.
	 */
	paste() {
		if (!fb.CheckClipboardContents()) {
			return;
		}

		const metadb_list = fb.GetClipboardContents(window.ID);
		if (!metadb_list || !metadb_list.Count) {
			return;
		}

		let insert_idx;
		if (this.selected_indexes.length) {
			insert_idx = this._is_selection_contiguous() ? Last(this.selected_indexes) + 1 : plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx) + 1;
		}
		else {
			const focused_idx = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);
			insert_idx = (focused_idx !== -1) ? (focused_idx + 1) : this.rows.length;
		}

		plman.UndoBackup(this.cur_playlist_idx);
		plman.ClearPlaylistSelection(this.cur_playlist_idx);
		plman.InsertPlaylistItems(this.cur_playlist_idx, insert_idx, metadb_list, true);
		plman.SetPlaylistFocusItem(this.cur_playlist_idx, insert_idx);
	}

	/**
	 * Sends the selected playlist items to the specified playlist.
	 * @param {number} playlist_idx - The current playlist index.
	 */
	send_to_playlist(playlist_idx) {
		plman.UndoBackup(playlist_idx);
		plman.ClearPlaylistSelection(playlist_idx);
		plman.InsertPlaylistItems(playlist_idx, plman.PlaylistItemCount(playlist_idx), plman.GetPlaylistSelectedItems(this.cur_playlist_idx), true);
	}
	// #endregion
}


//////////////////////////
// * COLLAPSE HANDLER * //
//////////////////////////
/**
 * A class that handles the folding of the playlist headers.
 */
class PlaylistCollapseHandler {
	/**
	 * Creates the `PlaylistCollapseHandler` instance.
	 * @param {PlaylistContent} cnt_arg - The playlist content instance.
	 */
	constructor(cnt_arg) {
		/** @private @type {object} */
		this.cnt_arg = cnt_arg;
		/** @private @type {boolean} */
		this.changed = false;
		/** @private @type {Array<PlaylistBaseHeader|PlaylistHeader>} */
		this.headers = cnt_arg.sub_items;
		/** @private @type {?Function} */
		this.on_collapse_change_callback = undefined;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Sets the collapsed state of the header and all its sub-items recursively.
	 * @param {PlaylistBaseHeader} header - The header to set the collapsed state of.
	 * @param {boolean} is_collapsed - Whether the header should be collapsed or not.
	 * @returns {boolean} Whether the collapsed state of any header was changed.
	 * @private
	 */
	_set_collapsed_state_recursive(header, is_collapsed) {
		if (!header) return false;

		const sub_items = header.sub_items;
		let changed = header.is_collapsed !== is_collapsed;
		header.is_collapsed = is_collapsed;

		if (sub_items[0] instanceof PlaylistRow) {
			return changed;
		}

		for (const item of sub_items) {
			changed = this._set_collapsed_state_recursive(item, is_collapsed) || changed;
		}

		return changed;
	}

	/**
	 * Triggers the callback if the collapse state has changed.
	 * @private
	 */
	_trigger_callback() {
		if (this.changed && this.on_collapse_change_callback) {
			this.on_collapse_change_callback();
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBILC METHODS
	/**
	 * Collapses a playlist item.
	 * @param {PlaylistBaseHeader} item - The item to collapse.
	 */
	collapse(item) {
		this.changed = this._set_collapsed_state_recursive(item, true);
		this._trigger_callback();
	}

	/**
	 * Collapses all playlist items.
	 */
	collapse_all() {
		this.changed = false;
		for (const item of this.headers) {
			this.changed = this._set_collapsed_state_recursive(item, true) || this.changed;
		}
		this._trigger_callback();
	}

	/**
	 * Collapses all playlist items except the now playing track.
	 */
	collapse_all_but_now_playing() {
		this.changed = false;
		for (const item of this.headers) {
			if (item.is_playing()) {
				this.changed = this._set_collapsed_state_recursive(item, false) || this.changed;
				continue;
			}
			this.changed = this._set_collapsed_state_recursive(item, true) || this.changed;
		}
		this._trigger_callback();
	}

	/**
	 * Toggles the collapse state of a playlist item.
	 * @param {PlaylistBaseHeader} item - The item to toggle.
	 */
	toggle_collapse(item) {
		this.changed = true;
		this._set_collapsed_state_recursive(item, !item.is_collapsed);
		this._trigger_callback();
	}

	/**
	 * Expands a playlist item.
	 * @param {PlaylistBaseHeader} item - The item to expand.
	 */
	expand(item) {
		this.changed = this._set_collapsed_state_recursive(item, false);
		this._trigger_callback();
	}

	/**
	 * Expands all playlist items.
	 */
	expand_all() {
		this.changed = false;
		for (const item of this.headers) {
			this.changed = this._set_collapsed_state_recursive(item, false) || this.changed;
		}
		this._trigger_callback();
	}

	/**
	 * Callback for when the content changes.
	 */
	on_content_change() {
		this.headers = this.cnt_arg.sub_items;
		this.changed = false;

		if (plSet.show_header && plSet.collapse_on_playlist_switch) {
			if (plSet.auto_collapse) {
				this.collapse_all_but_now_playing();
			}
			else {
				this.collapse_all();
			}
		}
	}

	/**
	 * Sets the callback that will be called when the collapse state of a playlist item changes.
	 * @param {Function} on_collapse_change_callback_arg - The callback.
	 */
	set_callback(on_collapse_change_callback_arg) {
		this.on_collapse_change_callback = on_collapse_change_callback_arg;
	}
	// #endregion
}


///////////////////////
// * QUEUE HANDLER * //
///////////////////////
/**
 * A class that handles the playback queue for a playlist by adding, removing, and checking the status of queued items.
 */
class PlaylistQueueHandler {
	/**
	 * Creates the `PlaylistQueueHandler` instance.
	 * @param {Array<PlaylistRow>} rows_arg - The initial set of playlist rows to be handled.
	 * @param {number} cur_playlist_idx_arg - The current index of the playlist being processed.
	 */
	constructor(rows_arg, cur_playlist_idx_arg) {
		/** @private @constant @type {number} */
		this.cur_playlist_idx = cur_playlist_idx_arg;
		/** @private @constant @type {Array<PlaylistRow>} */
		this.rows = rows_arg;
		/** @private @type {Array<PlaylistRow>} */
		this.queued_rows = [];

		this.initialize_queue();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Resets the queue indexes and count for each item in the `queued_rows` array and clears the array.
	 * @private
	 */
	_reset_queued_status() {
		if (!this.queued_rows.length) {
			return;
		}

		for (const item of this.queued_rows) {
			item.queue_indexes = undefined;
			item.queue_idx_count = 0;
		}

		this.queued_rows = [];
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes the playback queue contents and adding the queued items to the appropriate rows.
	 */
	initialize_queue() {
		if (this.queued_rows.length) {
			this._reset_queued_status();
		}

		const queue_contents = plman.GetPlaybackQueueContents();
		if (!queue_contents.length) {
			return;
		}

		let i = 0;
		for (const queued_item of queue_contents) {
			if (queued_item.PlaylistIndex !== this.cur_playlist_idx || queued_item.PlaylistItemIndex === -1) {
				continue;
			}

			const cur_queued_row = this.rows[queued_item.PlaylistItemIndex];
			if (!cur_queued_row) continue;
			const has_row = this.queued_rows.find(queued_row => queued_row.idx === cur_queued_row.idx);

			if (!has_row) {
				cur_queued_row.queue_indexes = [i + 1];
				cur_queued_row.queue_idx_count = 1;
			}
			else {
				cur_queued_row.queue_indexes.push(i + 1);
				cur_queued_row.queue_idx_count++;
			}

			this.queued_rows.push(cur_queued_row);
			i++;
		}
	}

	/**
	 * Checks if there are any playlist items in the playback queue.
	 * @returns {boolean} True or false.
	 */
	has_items() {
		return !!plman.GetPlaybackQueueHandles().Count;
	}

	/**
	 * Adds a playlist item to the playback queue.
	 * @param {PlaylistRow} row - The playlist row to add to the playback queue.
	 */
	add_row(row) {
		if (!row) return;

		plman.AddPlaylistItemToPlaybackQueue(this.cur_playlist_idx, row.idx);
	}

	/**
	 * Removes a row from the playback queue.
	 * @param {PlaylistRow} row - The playlist row to remove from the playback queue.
	 */
	remove_row(row) {
		if (!row) return;

		const idx = plman.FindPlaybackQueueItemIndex(row.metadb, this.cur_playlist_idx, row.idx);
		if (idx !== -1) {
			plman.RemoveItemFromPlaybackQueue(idx);
		}
	}

	/**
	 * Flushes the playback queue.
	 */
	flush() {
		plman.FlushPlaybackQueue();
	}
	// #endregion
}


//////////////////////////
// * GROUPING HANDLER * //
//////////////////////////
/**
 * A class that handles the grouping settings and behavior for playlists.
 */
class PlaylistGroupingHandler {
	/**
	 * Creates the `PlaylistGroupingHandler` instance.
	 */
	constructor() {
		/** @private @type {PlaylistGroupingSettings} */
		this.settings = new PlaylistGroupingSettings();
		/** @private @type {?Array<string>} */
		this.playlists = [];
		/** @private @type {string} */
		this.cur_playlist_name = '';
		/** @private @type {?PlaylistGroupingSettings} */
		this.cur_group = undefined;
		/** @private @type {?Array<string>} */
		this.group_by_name = undefined;

		this._initialize_name_to_preset_map();
		this._initialize_playlists();
		this._cleanup_settings();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Initializes the list of playlists.
	 * @private
	 */
	_initialize_playlists() {
		this.playlists = [];
		const playlist_count = plman.PlaylistCount;
		for (let i = 0; i < playlist_count; ++i) {
			this.playlists.push(plman.GetPlaylistName(i));
		}
	}

	/**
	 * Initializes the map from group name to group object.
	 * @private
	 */
	_initialize_name_to_preset_map() {
		this.group_by_name = this.settings.group_presets.map((item) => item.name);
	}

	/**
	 * Prepares an HTML file by replacing the CSS file reference with a new CSS file based on the Windows version.
	 * @param {string} path - The file path of the HTML file that needs to be prepared.
	 * @returns {string} The modified HTML content with the updated CSS file reference.
	 * @private
	 */
	_prepareHTML(path) {
		const htmlCode = utils.ReadTextFile(path);
		const newCss = GetWindowsVersion() === '6.1' ? 'styles7.css' : 'styles10.css';
		const cssPath = `${fb.FoobarPath}georgia-reborn\\scripts\\playlist\\assets\\html\\${newCss}`;
		return htmlCode.replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	/**
	 * Opens the group presets manager dialog.
	 * @param {Function} on_execute_callback_fn - The function to call when the dialog is closed.
	 * @private
	 */
	_manage_groupings(on_execute_callback_fn) {
		const on_ok_fn = (ret_val_json) => {
			const ret_val = JSON.parse(ret_val_json);

			this.settings.group_presets = ret_val[0];
			this.settings.default_group_name = ret_val[2];
			this._initialize_name_to_preset_map();

			this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(ret_val[1])];
			this.settings.playlist_group_data[this.cur_playlist_name] = ret_val[1];

			delete this.settings.playlist_custom_group_data[this.cur_playlist_name];

			this.settings.save();
			this.settings.send_sync();

			grCfg.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, this.settings.group_presets);
			grCfg.config.writeConfiguration();

			on_execute_callback_fn();
		};

		const htmlCode = this._prepareHTML(`${fb.ProfilePath}georgia-reborn\\scripts\\playlist\\assets\\html\\GroupPresetsMngr.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: [JSON.stringify([this.settings.group_presets, this.cur_group.name, this.settings.default_group_name]), on_ok_fn] });
	}

	/**
	 * Opens a dialog box that allows the user to enter a custom grouping query.
	 * The function also takes a callback function that is called when the user clicks the OK button.
	 * @param {Function} on_execute_callback_fn - The callback function to call when the user clicks the OK button.
	 * @private
	 */
	_request_user_query(on_execute_callback_fn) {
		const on_ok_fn = (ret_val) => {
			const groupHandlerSettings = new PlaylistGroupingSettings();
			const custom_group = groupHandlerSettings.group('user_defined', '', ret_val[0], ret_val[1]);
			this.cur_group = custom_group;

			this.settings.playlist_group_data[this.cur_playlist_name] = 'user_defined';
			this.settings.playlist_custom_group_data[this.cur_playlist_name] = custom_group;

			this.settings.save();
			this.settings.send_sync();

			on_execute_callback_fn();
		};

		const parsed_query = this.cur_group.name === 'user_defined' ? [this.cur_group.group_query, this.cur_group.title_query]	: ['', '[%album artist%]'];
		const htmlCode = this._prepareHTML(`${fb.ProfilePath}georgia-reborn\\scripts\\playlist\\assets\\html\\MsgBox.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: ['Foobar2000: Group by', ['Grouping Query', 'Title Query'], parsed_query, on_ok_fn] });
	}

	/**
	 * Removes any playlists that are no longer present from the settings.
	 * @private
	 */
	_cleanup_settings() {
		for (const i in this.settings.playlist_group_data) {
			console.log(i);
			if (!this.playlists.includes(i)) {
				delete this.settings.playlist_group_data[i];
			}
		}

		for (const i in this.settings.playlist_custom_group_data) {
			if (!this.playlists.includes(i)) {
				delete this.settings.playlist_custom_group_data[i];
			}
		}

		this.settings.save();
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Sets the active playlist.
	 * @param {string} cur_playlist_name_arg - The name of the playlist to make active.
	 */
	set_active_playlist(cur_playlist_name_arg) {
		this.cur_playlist_name = cur_playlist_name_arg;
		let group_name = this.settings.playlist_group_data[this.cur_playlist_name];

		this.cur_group = null;
		if (group_name) {
			if (group_name === 'user_defined') {
				this.cur_group = this.settings.playlist_custom_group_data[this.cur_playlist_name];
			}
			else if (this.group_by_name.includes(group_name)) {
				this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(group_name)];
			}

			if (!this.cur_group) {
				delete this.settings.playlist_group_data[this.cur_playlist_name];
				group_name = '';
			}
		}

		if (!this.cur_group) {
			group_name = this.settings.default_group_name;
			this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(group_name)];
		}

		Assert(this.cur_group != null, ArgumentError, 'group_name', group_name);
	}

	/**
	 * Gets the query for the active playlist.
	 * @returns {string} The query for the active playlist.
	 */
	get_query() {
		return this.cur_group.group_query;
	}

	/**
	 * Gets the title query for the active playlist.
	 * @returns {string} The title query for the active playlist.
	 */
	get_title_query() {
		return this.cur_group.title_query;
	}

	/**
	 * Gets the sub-title query for the active playlist.
	 * @returns {string} The sub-title query for the active playlist.
	 */
	get_sub_title_query() {
		return this.cur_group.sub_title_query;
	}

	/**
	 * Gets the name of the current query.
	 * @returns {string} The name of the current query.
	 */
	get_query_name() {
		return this.cur_group.name;
	}

	/**
	 * Whether to show the disc for the current query.
	 * @returns {boolean} True or false.
	 */
	show_disc() {
		return this.cur_group.show_disc;
	}

	/**
	 * Whether to show the date for the current query.
	 * @returns {boolean} True or false.
	 */
	show_date() {
		return this.cur_group.show_date;
	}

	/**
	 * Appends the menu to the given parent menu.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 * @param {Function} on_execute_callback_fn - The callback function to call when an item is executed.
	 */
	append_menu_to(parent_menu, on_execute_callback_fn) {
		const group = new ContextMenu('Grouping');
		parent_menu.append(group);

		group.appendItem('Manage presets', () => {
			this._manage_groupings(on_execute_callback_fn);
		});

		group.separator();

		group.appendItem('Reset to default', () => {
			delete this.settings.playlist_custom_group_data[this.cur_playlist_name];
			delete this.settings.playlist_group_data[this.cur_playlist_name];

			this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(this.settings.default_group_name)];

			this.settings.save();
			this.settings.send_sync();
			this.settings.load();

			grCfg.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, grDef.themePlaylistGroupingPresets);
			grCfg.config.writeConfiguration();

			on_execute_callback_fn();
		});

		group.separator();

		let group_by_text = 'by...';
		if (this.cur_group.name === 'user_defined') {
			group_by_text += ` [${this.get_query()}]`;
		}
		group.appendItem(group_by_text, () => {
			this._request_user_query(on_execute_callback_fn);
		}, { is_radio_checked: this.cur_group.name === 'user_defined' });

		for (const group_item of this.settings.group_presets) {
			let group_by_text = group_item.description;
			if (group_item.name === this.settings.default_group_name) {
				group_by_text += ' [default]';
			}

			group.appendItem(group_by_text, () => {
				this.cur_group = group_item;

				delete this.settings.playlist_custom_group_data[this.cur_playlist_name];

				this.settings.playlist_group_data[this.cur_playlist_name] = group_item.name;
				this.settings.save();
				this.settings.send_sync();

				on_execute_callback_fn();
			}, { is_radio_checked: this.cur_group.name === group_item.name });
		}
	}

	/**
	 * Called when the sync state is changed.
	 * Updates the settings object with the new state and reinitializes the name to preset map.
	 * It also sets the active playlist to the current playlist name.
	 * @param {?} value - The new sync state.
	 */
	sync_state(value) {
		this.settings.receive_sync(value);
		this._initialize_name_to_preset_map();
		this.set_active_playlist(this.cur_playlist_name);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Callback for when the playlists have changed.
	 */
	on_playlists_changed() {
		const playlist_count = plman.PlaylistCount;
		const new_playlists = [];
		for (let i = 0; i < playlist_count; ++i) {
			new_playlists.push(plman.GetPlaylistName(i));
		}

		let save_needed = false;

		if (this.playlists.length > playlist_count) {
			// Removed

			const playlists_to_remove = Difference(this.playlists, new_playlists);
			for (const playlist_name of playlists_to_remove) {
				delete this.settings.playlist_group_data[playlist_name];
				delete this.settings.playlist_custom_group_data[playlist_name];
			}

			save_needed = true;
		}
		else if (this.playlists.length === playlist_count) {
			// May be renamed?

			const playlist_difference_new = Difference(new_playlists, this.playlists);
			const playlist_difference_old = Difference(this.playlists, new_playlists);
			if (playlist_difference_old.length === 1) {
				// playlist_difference_new.length > 0 and playlist_difference_old.length === 0 means that
				// playlists contained multiple items of the same name (one of which was changed)
				const old_name = playlist_difference_old[0];
				const new_name = playlist_difference_new[0];

				const group_name = this.settings.playlist_group_data[old_name];
				const custom_group = this.settings.playlist_custom_group_data[old_name];

				this.settings.playlist_group_data[new_name] = group_name;
				if (custom_group) {
					this.settings.playlist_custom_group_data[new_name] = custom_group;
				}

				delete this.settings.playlist_group_data[old_name];
				delete this.settings.playlist_custom_group_data[old_name];

				save_needed = true;
			}
		}

		this.playlists = new_playlists;
		if (save_needed) {
			this.settings.save();
		}
	}
	// #endregion
}


/**
 * A class that handles and manipulates settings related to grouping playlists.
 */
class PlaylistGroupingSettings {
	/**
	 * Creates the `PlaylistGroupingSettings` instance.
	 */
	constructor() {
		/**
		 * Reads the configuration from the `config` object and assigns it to the `prefs` variable.
		 * @public @type {ReturnType<typeof config.readConfiguration>}
		 */
		this.prefs = grCfg.config.readConfiguration();
		/**
		 * An object that maps playlist names to their group names.
		 * @public @type {{ [playlistName: string]: string }}
		 */
		this.playlist_group_data = {};
		/**
		 * An object that maps playlist names to their custom grouping settings.
		 * @public @type {{ [playlistName: string]: PlaylistGroupingSettings }}
		 */
		this.playlist_custom_group_data = {};
		/** @public @type {string} */
		this.default_group_name = '';
		/** @public @type {Array<PlaylistGroupingSettings>} */
		this.group_presets = [];

		this._fixup_pl_set();
		this.load();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Checks and fixes the values of certain properties in the `plSet` object.
	 * @private
	 */
	_fixup_pl_set() {
		if (!plSet.playlist_group_data || !IsObject(JSON.parse(plSet.playlist_group_data))) {
			plSet.playlist_group_data = JSON.stringify({});
		}

		if (!plSet.playlist_custom_group_data || !IsObject(JSON.parse(plSet.playlist_custom_group_data))) {
			plSet.playlist_custom_group_data = JSON.stringify({});
		}

		if (!plSet.group_presets || !Array.isArray(JSON.parse(plSet.group_presets))) {
			plSet.group_presets = JSON.stringify([
				new PlaylistGroupingPreset('artist', 'by artist', '%album artist%', undefined, '', {}),
				new PlaylistGroupingPreset('artist_album', 'by artist / album', '%album artist%%album%', undefined, undefined, { show_date: true }),
				new PlaylistGroupingPreset('artist_album_disc', 'by artist / album / disc number', '%album artist%%album%%discnumber%', undefined, undefined, { show_date: true, show_disc: true }),
				new PlaylistGroupingPreset('artist_album_disc_edition', 'by artist / album / disc number / edition / codec', '%album artist%%album%%discnumber%%edition%%codec%', undefined, undefined, { show_date: true, show_disc: true }),
				new PlaylistGroupingPreset('path', 'by path', '$directory_path(%path%)', undefined, undefined, { show_date: true }),
				new PlaylistGroupingPreset('date', 'by date', '%date%', undefined, undefined, { show_date: true })
			]);
		}

		if (!plSet.default_group_name || !IsString(plSet.default_group_name)) {
			plSet.default_group_name = this.prefs.themePlaylistGroupingPresets[3].name || this.prefs.themePlaylistGroupingPresets[0].name || 'artist_album_disc_edition';
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Loads settings from the properties object.
	 */
	load() {
		this.playlist_group_data = JSON.parse(plSet.playlist_group_data);
		this.playlist_custom_group_data = JSON.parse(plSet.playlist_custom_group_data);
		this.default_group_name = plSet.default_group_name;
		this.group_presets = this.prefs.themePlaylistGroupingPresets || JSON.parse(plSet.group_presets);
	}

	/**
	 * Saves settings to the properties object.
	 */
	save() {
		plSet.playlist_group_data = JSON.stringify(this.playlist_group_data);
		plSet.playlist_custom_group_data = JSON.stringify(this.playlist_custom_group_data);
		plSet.default_group_name = this.default_group_name;
		plSet.group_presets = JSON.stringify(this.group_presets);
	}

	/**
	 * Sends the sync data to the other clients.
	 */
	send_sync() {
		const syncData = {
			g_playlist_group_data:        plSet.playlist_group_data,
			g_playlist_custom_group_data: plSet.playlist_custom_group_data,
			g_default_group_name:         plSet.default_group_name,
			g_group_presets:              plSet.group_presets
		};

		window.NotifyOthers('sync_group_query_state', syncData);
	}

	/**
	 * Receives the sync data from the other clients.
	 * @param {{g_playlist_group_data, g_playlist_custom_group_data, g_default_group_name, g_group_presets}} settings_data - The sync data.
	 */
	receive_sync(settings_data) {
		plSet.playlist_group_data = settings_data.g_playlist_group_data;
		plSet.playlist_custom_group_data = settings_data.g_playlist_custom_group_data;
		plSet.default_group_name = settings_data.g_default_group_name;
		plSet.group_presets = settings_data.g_group_presets;

		this.load();
	}
	// #endregion
}


/**
 * A class that handles a grouping configuration for a playlist within the PlaylistGroupingSettings namespace.
 */
class PlaylistGroupingPreset {
	/**
	 * Creates the `PlaylistGroupingPreset` instance.
	 * @param {string} name - The name of the group.
	 * @param {string} description - A brief description of the group.
	 * @param {?string} [group_query] - The query used to group items within the playlist.
	 * @param {?string} [title_query] - The query used to generate the title for the group.
	 * @param {?string} [sub_title_query] - The query used to generate the subtitle for the group.
	 * @param {object} [options] - Additional options for the group.
	 * @param {boolean} [options.show_date] - A flag indicating whether to show the date within the group.
	 * @param {boolean} [options.show_disc] - A flag indicating whether to show disc information within the group.
	 */
	constructor(name, description, group_query = '', title_query = '[%album artist%]', sub_title_query = "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']", options = {}) {
		/** @public @type {string} */
		this.name = name;
		/** @public @type {string} */
		this.description = description;
		/** @public @type {string} */
		this.group_query = group_query;
		/** @public @type {string} */
		this.title_query = title_query;
		/** @public @type {string} */
		this.sub_title_query = sub_title_query;
		/** @public @type {boolean} */
		this.show_date = options.show_date || false;
		/** @public @type {boolean} */
		this.show_disc = options.show_disc || false;
	}
}
