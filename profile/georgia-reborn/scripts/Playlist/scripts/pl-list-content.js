/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Content                         * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    01-05-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////
// * CONTENT * //
/////////////////
/**
 * A class that generates and manages items to draw in a playlist.
 * @augments {BaseListRowContent}
 */
class PlaylistContent extends BaseListRowContent {
	/**
	 * Creates the `PlaylistContent` instance.
	 */
	constructor() {
		super();

		/**
		 * It is assumed that every sub_items array contains only items of the same single type.
		 * @type {Array<PlaylistHeader>}
		 * @protected
		 */
		this.sub_items = [];

		/** @public @type {PlaylistContentNavigation} */
		this.helper = new PlaylistContentNavigation(this);
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Generates items to draw based on the given parameters and returns an array of items.
	 * @override
	 * @param {number} wy - The y-coordinate of the top edge of the visible area.
	 * @param {number} wh - The height of the viewport.
	 * @param {number} row_shift - The number of rows to shift the drawing position vertically.
	 * @param {number} pixel_shift - The number of pixels to shift the items vertically.
	 * @param {number} row_h - The height of each row in the drawing.
	 * @returns {Array} An array of items to draw.
	 */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		if (!this.rows.length) {
			return [];
		}

		if (!plSet.show_header) {
			return BaseListRowContent.prototype.generate_items_to_draw.apply(this, [wy, wh, row_shift, pixel_shift, row_h]);
		}

		const first_item = this.generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h);
		return this.generate_all_items_to_draw(wy, wh, first_item);
	}

	/**
	 * Calculates the position of the first visible item to draw in the playlist.
	 * @param {number} wy - The y-coordinate of the top edge of the visible area.
	 * @param {number} wh - The height of the viewport.
	 * @param {number} row_shift - The number of rows to shift the drawing position vertically.
	 * @param {number} pixel_shift - The number of pixels to shift the items vertically.
	 * @param {number} row_h - The height of each row in the drawing.
	 * @returns {PlaylistRow|PlaylistBaseHeader} The first visible item in the playlist based on the provided parameters.
	 */
	generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h) { // Rewritten
		const set_x = PlaylistSetX();
		const start_y = wy + pixel_shift;
		let cur_row = 0;

		/**
		 * Searches sub_items for the first visible item, considering if items are headers with sub-items.
		 * @param {PlaylistBaseHeader[]|PlaylistRow[]} sub_items - The array of items to search through.
		 * @param {boolean} isHeader - A flag indicating if the items in the array are header items.
		 * @returns {?PlaylistBaseHeader|?PlaylistRow} The first visible item or null if none are visible.
		 */
		const _iterate_level = (sub_items, isHeader) => {
			if (!Array.isArray(sub_items) || sub_items.length === 0) {
				return null;
			}
			for (let i = 0, len = sub_items.length; i < len; ++i) {
				const item = sub_items[i];
				const itemHeightInRows = isHeader ? Math.round(item.h / row_h) : 1;

				if (cur_row + itemHeightInRows > row_shift) {
					item.set_x(set_x);
					item.set_y(start_y + (cur_row - row_shift) * row_h);
					return item;
				}

				cur_row += itemHeightInRows;

				if (isHeader && !item.is_collapsed) {
					const result = _iterate_level(item.sub_items, true);
					if (result) return result;
				}
			}

			return null;
		};

		const isHeader = this.sub_items.length > 0 && this.sub_items[0] instanceof PlaylistBaseHeader;
		const first_item = _iterate_level(this.sub_items, isHeader);

		if (first_item == null) {
			plSet.scrollbar_pos = 0;
		}

		// No idea if this debug warning is still needed when we are using the safeguard
		// Maybe we need to init the playlist or scrollbar if first_item is null due to a race condition
		// Assert(first_item != null, LogicError, 'first_item_to_draw can\'t be null!');

		return first_item;
	}

	/**
	 * Generates an array of items to draw based on the given parameters and starting item.
	 * It iterates through the items starting from `first_item` and collects those that fall within the visible area specified by `wy` and `wh`.
	 * @param {number} wy - The y-coordinate of the top edge of the visible area.
	 * @param {number} wh - The height of the viewport.
	 * @param {PlaylistRow|PlaylistBaseHeader} first_item - The starting item from which the drawing of items will begin.
	 * @returns {Array<PlaylistRow|PlaylistBaseHeader>} The array of items that should be drawn on the visible area.
	 */
	generate_all_items_to_draw(wy, wh, first_item) { // Rewritten
		if (!first_item) return [];

		const items_to_draw = [first_item];
		const cur_x = PlaylistSetX();
		let cur_y = first_item.y + first_item.h;

		/**
		 * Iterates over a list of sub items starting from `start_item` to collect items to draw,
		 * considering the current y-coordinate (`cur_y`) and visibility within the viewport.
		 * If `start_item` is not provided, iteration starts from the beginning of `sub_items`.
		 * @param {Array<PlaylistBaseHeader>|Array<PlaylistRow>} sub_items - The sub-items to iterate over.
		 * @param {PlaylistRow|PlaylistBaseHeader} start_item - An optional item from which to start the iteration.
		 * @param {boolean} is_cur_level_header - Indicates if the current level items are headers.
		 * @returns {boolean} True if `start_item` was used, indicating that items have been added to the drawing queue.
		 */
		const _iterate_level = (sub_items, start_item, is_cur_level_header) => {
			let start_item_used = !start_item;
			let leveled_start_item = start_item;

			while (leveled_start_item && leveled_start_item.parent !== sub_items[0].parent) {
				leveled_start_item = leveled_start_item.parent;
			}

			const start_idx = leveled_start_item ? (leveled_start_item instanceof PlaylistRow ? leveled_start_item.idx_in_header : leveled_start_item.idx) : 0;

			for (let i = start_idx, item; i < sub_items.length; ++i) {
				item = sub_items[i];
				if (start_item_used) {
					item.set_x(cur_x);
					item.set_y(cur_y);
					items_to_draw.push(item);
					cur_y += item.h;
				} else if (item === start_item) {
					start_item_used = true;
				}

				if (cur_y >= wy + wh) break;

				if (is_cur_level_header && !(item instanceof PlaylistBaseHeader && item.is_collapsed) &&
					_iterate_level(item.sub_items, start_item_used ? null : start_item, item.sub_items[0] instanceof PlaylistBaseHeader)) {
					start_item_used = true;
				}
			}

			return start_item_used;
		};

		const is_first_level_header = this.sub_items[0] instanceof PlaylistBaseHeader;
		_iterate_level(this.sub_items, first_item, is_first_level_header);

		return items_to_draw;
	}

	/**
	 * Updates the size of items based on the given width, taking into account whether the header is shown or not.
	 * @override
	 * @param {number} w - The width.
	 */
	update_items_w_size(w) {
		if (!plSet.show_header) {
			BaseListRowContent.prototype.update_items_w_size.apply(this, [w]);
			return;
		}

		for (const item of this.sub_items) {
			item.set_w(w);
		}
	}

	/**
	 * Calculates the total height of rows in a playlist, taking into account sub-items and whether the header is shown.
	 * @override
	 */
	calculate_total_h_in_rows() { // Rewritten
		if (!plSet.show_header) {
			return BaseListRowContent.prototype.calculate_total_h_in_rows.apply(this);
		}

		if (!this.sub_items.length) {
			return 0;
		}

		const single_item_height_in_rows = Math.round(this.sub_items[0].h / pl.geo.row_h);
		let total_height_in_rows = single_item_height_in_rows * this.sub_items.length;

		for (const item of this.sub_items) {
			if (!item.is_collapsed) {
				total_height_in_rows += item.get_sub_items_total_h_in_rows();
			}
		}

		return total_height_in_rows;
	}
	// #endregion
}


/**
 * A class that provides methods for navigating and determining the visibility of items in a playlist content.
 */
class PlaylistContentNavigation {
	/**
	 * Creates the `PlaylistContentNavigation` instance.
	 * @param {PlaylistContent} cnt_arg - The content of a playlist.
	 */
	constructor(cnt_arg) {
		/** @private @constant @type {PlaylistContent} */
		this.cnt = cnt_arg;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Gets the previous item before the header.
	 * @param {PlaylistBaseHeader} header - The header to search for the previous item before.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The previous item before the given header.
	 * @private
	 */
	_get_prev_item_before_header(header) {
		if (header === header.parent.sub_items[0]) {
			return header.parent instanceof PlaylistBaseHeader ? header.parent : null;
		}

		// @ts-ignore
		return this._get_last_visible_item(header.parent.sub_items[header.idx - 1]);
	}

	/**
	 * Gets the previous item before the given row.
	 * @param {PlaylistRow} row - The row to search for the previous item before.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The previous item before the given row.
	 * @private
	 */
	_get_prev_item_before_row(row) {
		if (row === row.parent.sub_items[0]) {
			return row.parent;
		}

		return row.parent.sub_items[row.idx_in_header - 1];
	}

	/**
	 * Gets the next item in the list, or null if there is no next item.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to start searching from.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The next item, or null if there is no next item.
	 * @private
	 */
	_get_next_item(item) {
		let next_item = item;
		while (next_item) {
			if (!next_item.parent) {
				return null;
			}

			if (next_item !== Last(next_item.parent.sub_items)) {
				const next_item_idx = next_item instanceof PlaylistRow ? next_item.idx_in_header : next_item.idx;
				return next_item.parent.sub_items[next_item_idx + 1];
			}

			next_item = next_item.parent;
		}

		return next_item;
	}

	/**
	 * Get the last visible item in the list.
	 * @param {PlaylistBaseHeader} item - The item to search for the last visible item in.
	 * @returns {PlaylistBaseHeader|PlaylistRow} The last visible item in the given item.
	 * @private
	 */
	_get_last_visible_item(item) {
		let last_item = item;

		while (last_item && !(last_item instanceof PlaylistRow) && !last_item.is_collapsed) {
			if (!last_item.sub_items || last_item.sub_items.length === 0) {
				break;
			}
			last_item = Last(last_item.sub_items);
		}

		return last_item;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets the visible parent of the given item.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to get the parent of.
	 * @returns {?PlaylistBaseHeader} The visible parent item, or null if the item is not visible.
	 */
	get_visible_parent(item) {
		if (!item.parent || !(item.parent instanceof PlaylistBaseHeader)) {
			return null;
		}

		let cur_item = item;
		do {
			cur_item = cur_item.parent;
		} while (cur_item.parent && cur_item.parent.is_collapsed);

		return cur_item;
	}

	/**
	 * Gets the navigable neighbor of the given item in the given direction.
	 * See {@link PlaylistContentNavigation.is_item_navigable}.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to start from.
	 * @param {number} direction - The direction to search in.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The first navigable neighbor, or null if no neighbor is found.
	 */
	get_navigable_neighbor(item, direction) {
		let neighbor_item = item;
		do {
			neighbor_item = this.get_visible_neighbor(neighbor_item, direction);
		} while (neighbor_item && !this.is_item_navigable(neighbor_item));

		return neighbor_item;
	}

	/**
	 * Gets the visible neighbor of the given item in the given direction.
	 * See {@link PlaylistContentNavigation.is_item_visible}.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to get the neighbor of.
	 * @param {number} direction - The direction to get the neighbor in.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The visible neighbor of the given item in the given direction.
	 */
	get_visible_neighbor(item, direction) {
		return direction > 0 ? this.get_next_visible_item(item) : this.get_prev_visible_item(item);
	}

	/**
	 * Gets the previous visible item of the given item.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to get the previous visible item of.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The previous visible item in the list.
	 */
	get_prev_visible_item(item) {
		if (!plSet.show_header) {
			if (item === this.cnt.rows[0]) {
				return null;
			}

			return this.cnt.rows[item.idx - 1];
		}

		if (item instanceof PlaylistBaseHeader) {
			return this._get_prev_item_before_header(item);
		}

		return this._get_prev_item_before_row(item);
	}

	/**
	 * Gets the next visible item in the list.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The current item.
	 * @returns {PlaylistRow|PlaylistBaseHeader|null} The next visible item, or null if there is none.
	 */
	get_next_visible_item(item) {
		if (!plSet.show_header) {
			if (item === Last(this.cnt.rows)) {
				return null;
			}

			return this.cnt.rows[item.idx + 1];
		}

		if (item instanceof PlaylistBaseHeader && !item.is_collapsed) {
			return item.sub_items[0];
		}

		return this._get_next_item(item);
	}

	/**
	 * Checks if the given item is visible.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to check.
	 * @returns {boolean} True if item is not hidden by collapsed parent.
	 */
	is_item_visible(item) {
		if (item.parent && item.parent instanceof PlaylistBaseHeader) {
			return !item.parent.is_collapsed;
		}

		return true;
	}

	/**
	 * Checks if the given item is navigable.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to check.
	 * @returns {boolean} True if item can be selected by arrow keys.
	 */
	is_item_navigable(item) {
		return item instanceof PlaylistRow ? true : item.is_collapsed;
	}
	// #endregion
}
