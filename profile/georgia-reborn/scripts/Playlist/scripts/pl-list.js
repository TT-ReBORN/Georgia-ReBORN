/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN PlayList Base List                       * //
// * Author:         TT                                                      * //
// * Org. Author:    TheQwertiest                                            * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    11-10-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * BASE LIST * //
///////////////////
/**
 * A class that represents a basic list with items to display and a scrollbar.
 * Also handles basic controls for mouse and keyboard events.
 */
class BaseList {
	/**
	 * Creates the `BaseList` instance.
	 * By default each item is a row of a fixed size.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {BaseListContent} content - The content container.
	 */
	constructor(x, y, w, h, content) {
		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = w;
		/** @public @type {number} */
		this.h = h;

		/** @protected @type {ListContent} */
		this.cnt = content;
		/** @protected @constant {number}*/
		this.row_h = SCALE(plSet.row_h); // Also see playlist.reinitialize
		/** @protected @type {number} */
		this.list_x = this.x + plSet.list_left_pad;
		/** @protected @type {number} */
		this.list_y = 0;
		/** @protected @type {number} */
		this.list_w = 0;
		/** @protected @type {number} */
		this.list_h = 0;
		/** @protected @type {number} */
		this.rows_to_draw_precise = 0;
		/** @protected @type {Array<ListItem>} */
		this.items_to_draw = [];

		/** @protected @type {boolean} */
		this.mouse_in = false;
		/** @protected @type {boolean} */
		this.mouse_down = false;
		/** @protected @type {boolean} */
		this.mouse_double_clicked = false;

		/** @protected @type {PlaylistScrollbar} */
		this.scrollbar = undefined;
		/** @protected @type {number} Row shift is always non-negative. */
		this.row_shift = 0;
		/** @protected @type {number} Pixel shift is always non-positive. */
		this.pixel_shift = 0;
		/** @protected @type {boolean} */
		this.is_scrollbar_visible = plSet.show_scrollbar;
		/** @protected @type {boolean} */
		this.is_scrollbar_available = false;
		/** @protected @type {boolean} */
		this.needs_scrollbar_update = false;

		/**
		 * Throttles a function to limit how often it can be invoked. This specific throttled function
		 * is used to repaint a rectangular area of a window at most once every frame at a rate of 60fps.
		 * @type {Function}
		 * @private
		 */
		this.throttled_repaint = Throttle(() => {
			window.RepaintRect(this.x - SCALE(1), this.y, this.w + SCALE(2), this.h);
		}, 1000 / 60);
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Updates the width of the list and its scrollbar.
	 * @private
	 */
	_update_list_w_size() {
		this.list_w = this.w - plSet.list_left_pad - plSet.list_right_pad;

		if (this.is_scrollbar_available) {
			if (this.is_scrollbar_visible) {
				this.list_w -= this.scrollbar.w + 2;
			}
			this.scrollbar.set_x(this.w - pl.geo.scrollbar_w - pl.geo.scrollbar_right_pad);
		}

		this.initialize_scrollbar();
		this.update_scrollbar();
		this.on_content_to_draw_change();

		this.cnt.update_items_w_size(this.list_w);
	}

	/**
	 * Updates the size and position of the list and also the scrollbar.
	 * @private
	 */
	_update_list_h_size() {
		this.list_y = this.y + plSet.list_top_pad;
		this.list_h = this.h - (plSet.list_bottom_pad + plSet.list_top_pad);

		this.rows_to_draw_precise = this.list_h / this.row_h;

		this.initialize_scrollbar();
		this.update_scrollbar();
		this.on_content_to_draw_change();
	}

	/**
	 * Calculates the shift parameters for scrolling.
	 * @private
	 */
	_calculate_shift_params() {
		this.row_shift = Math.floor(plSet.scrollbar_pos);
		this.pixel_shift = -Math.round((plSet.scrollbar_pos - this.row_shift) * this.row_h);
	}

	/**
	 * Updates the size of the list when visibility of the scrollbar changes.
	 * @param {boolean} is_visible - The state if the scrollbar is currently visible or not.
	 * @private
	 */
	_on_scrollbar_visibility_change(is_visible) {
		if (this.is_scrollbar_visible !== is_visible) {
			this.is_scrollbar_visible = is_visible;
			this._update_list_w_size();
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Updates the width size of the list.
	 * @param {number} w - The width.
	 * @protected
	 */
	on_w_size(w) {
		this.w = w;
		this._update_list_w_size();
	}

	/**
	 * Updates the height size of the list.
	 * @param {number} h - The height.
	 * @protected
	 */
	on_h_size(h) {
		this.h = h;
		this._update_list_h_size();
	}

	/**
	 * Calculates shift parameters and generates a list of items to draw.
	 * @protected
	 */
	on_content_to_draw_change() {
		this._calculate_shift_params();
		this.items_to_draw = this.cnt.generate_items_to_draw(this.list_y, this.list_h, this.row_shift, this.pixel_shift, this.row_h);
	}

	/**
	 * Called when playlist data in content is changed and updates the scrollbar.
	 * @protected
	 */
	on_list_items_change() {
		this.update_scrollbar();
		this.on_content_to_draw_change();
	}

	/**
	 * Gets the item from an array that intersects with the given mouse coordinates.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {BaseListItem} The item that is found under the mouse coordinates.
	 * @protected
	 */
	get_item_under_mouse(x, y) {
		return this.items_to_draw.find(item => item.trace(x, y));
	}

	/**
	 * Checks if a given point (x, y) is within the boundaries of an list item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if the given x and y coordinates are within the boundaries.
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * Checks if a given point (x, y) is within the boundaries of the list.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if the given x and y coordinates are within the boundaries.
	 */
	trace_list(x, y) {
		return x >= this.list_x && x < this.list_x + this.list_w && y >= this.list_y && y < this.list_y + this.list_h;
	}

	/**
	 * Invokes a throttled repaint.
	 */
	repaint() {
		this.throttled_repaint();
	}

	/**
	 * Appends a context menu item to a parent menu that toggles the visibility of a scrollbar in the playlist.
	 * @param {string} parent_menu - The menu to which the scrollbar visibility context menu item will be appended.
	 */
	append_scrollbar_visibility_context_menu_to(parent_menu) {
		parent_menu.appendItem('Scrollbar auto-hide', () => {
			grSet.playlistAutoHideScrollbar = !grSet.playlistAutoHideScrollbar;
			plSet.show_scrollbar = !grSet.playlistAutoHideScrollbar;
			grm.ui.updatePlaylist();
		}, { is_checked: grSet.playlistAutoHideScrollbar });
	}

	/**
	 * The scrollbar callback to update the scroll position and content.
	 * @protected
	 */
	scrollbar_redraw_callback() {
		const invalidPos = (plSet.scrollbar_pos || this.scrollbar.scroll) > this.scrollbar.scrollable_lines; // Prevent scroll crash
		plSet.scrollbar_pos = invalidPos ? 0 : this.scrollbar.scroll;
		this.on_content_to_draw_change();
		this.repaint();
	}

	/**
	 * Initializes the scrollbar with specific dimensions and a callback for redrawing.
	 * @protected
	 */
	initialize_scrollbar() {
		this.is_scrollbar_available = false;

		const scrollbar_x = this.x - SCALE(32) + this.w - pl.geo.scrollbar_w - pl.geo.scrollbar_right_pad;
		const scrollbar_y = this.y + pl.geo.scrollbar_top_pad - HD_4K(5, 12);
		const scrollbar_w = SCALE(28);
		const scrollbar_h = this.h - (pl.geo.scrollbar_bottom_pad + pl.geo.scrollbar_top_pad) + HD_4K(5, 14);

		if (this.scrollbar) {
			this.scrollbar.reset();
		}

		this.scrollbar = new PlaylistScrollbar(scrollbar_x, scrollbar_y, scrollbar_w, scrollbar_h, this.row_h, this.scrollbar_redraw_callback.bind(this));
	}

	/**
	 * Checks if the scrollbar should be displayed based on the total height of the content and updates the scrollbar accordingly.
	 * @protected
	 */
	update_scrollbar() {
		const total_height_in_rows = this.cnt.calculate_total_h_in_rows();

		if (total_height_in_rows <= this.rows_to_draw_precise) {
			this.is_scrollbar_available = false;
			plSet.scrollbar_pos = 0;
			this._on_scrollbar_visibility_change(false);
		}
		else if (this.scrollbar) {
			this.scrollbar.set_window_param(this.rows_to_draw_precise, total_height_in_rows);
			this.scrollbar.scroll_to(plSet.scrollbar_pos, true);

			const invalidPos = (plSet.scrollbar_pos || this.scrollbar.scroll) > this.scrollbar.scrollable_lines; // Prevent scroll crash
			plSet.scrollbar_pos = invalidPos ? 0 : this.scrollbar.scroll;

			this.is_scrollbar_available = true;
			this._on_scrollbar_visibility_change(plSet.show_scrollbar);
		}

		window.RepaintRect(this.x, this.y, this.w, this.h);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Draws the list items with a scrollbar if necessary.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	on_paint(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.items_to_draw.length) {
			for (let i = this.items_to_draw.length - 1; i >= 0; --i) {
				this.items_to_draw[i].draw(gr);
			}
		}
		else {
			const empty = plman.PlaylistCount <= 1;
			const name = plman.GetPlaylistName(plman.ActivePlaylist);
			const text = empty ? 'Drop some tracks here\nor play from the library' : `Playlist: ${name}\nEmpty`;
			gr.DrawString(text, pl.font.title_normal, pl.col.row_title_normal, this.x, this.y, this.w, this.h, Stringformat.align_center);
		}

		if (this.is_scrollbar_visible) {
			this.scrollbar.paint(gr);
		}
	}

	/**
	 * Adjusts the size and position of an element based on the provided parameters.
	 * Also handles hiding the scrollbar if auto-hide is enabled.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_size(w, h, x, y) {
		const w_changed = this.w !== w || this.x !== x;
		const h_changed = this.h !== h || this.y !== y;

		if (h_changed) {
			this.y = y;
			this.on_h_size(h);
		}

		if (w_changed) {
			this.x = x;
			this.list_x = this.x + plSet.list_left_pad;
			this.on_w_size(w);
		}

		// * Makes sure to always hide scrollbar when auto-hide is enabled
		if (grSet.playlistAutoHideScrollbar && plSet.show_scrollbar) {
			plSet.show_scrollbar = false;
		}
	}

	/**
	 * Handles mouse double click events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_dblclk(x, y, m) {
		this.mouse_down = true;
		this.mouse_double_clicked = true;

		if (this.is_scrollbar_visible && this.scrollbar.trace(x, y)) {
			this.scrollbar.lbtn_dn(x, y);
			return true;
		}

		return false;
	}

	/**
	 * Handles left mouse button down events and performs different actions based on the mouse position and other conditions.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_down(x, y, m) {
		this.mouse_down = true;

		if (this.mouse_double_clicked) {
			return true;
		}

		if (this.is_scrollbar_visible && this.scrollbar.trace(x, y)) {
			this.scrollbar.lbtn_dn(x, y);
			return true;
		}

		return false;
	}

	/**
	 * Handles left mouse button up events and checks if the scrollbar is visible and if it was being dragged.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (!this.mouse_down) {
			return true;
		}

		this.mouse_double_clicked = false;
		this.mouse_down = false;

		if (this.is_scrollbar_visible) {
			const wasDragging = this.scrollbar.b_is_dragging;
			this.scrollbar.lbtn_up(x, y);
			if (wasDragging) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Handles mouse leave events and performs actions related to scrollbar and mouse state.
	 */
	on_mouse_leave() {
		if (this.is_scrollbar_available) {
			this.scrollbar.leave();
		}

		this.mouse_in = false;
	}

	/**
	 * Handles mouse movement events and updates the scrollbar position,
	 * hides the scrollbar automatically, and updates the playlist row hover state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_move(x, y, m) {
		if (this.is_scrollbar_visible) {
			this.scrollbar.move(x, y);

			if (this.scrollbar.b_is_dragging || this.scrollbar.trace(x, y)) {
				return true;
			}
		}

		// * Automatic scrollbar hide
		if (grSet.playlistAutoHideScrollbar) {
			if (this.scrollbar.trace(x, y)) {
				pl.cache_header = false;
				plSet.show_scrollbar = true;
				this.update_scrollbar();
				this.needs_scrollbar_update = true;
			} else if (!this.mouse_in || !this.scrollbar.trace(x, y)) {
				pl.cache_header = true;
				plSet.show_scrollbar = false;
				if (this.needs_scrollbar_update) {
					this.update_scrollbar();
					this.needs_scrollbar_update = false;
				}
			}
		}
		// * Update playlist row hover state or automatic scrollbar hide
		if (grSet.playlistRowHover || grSet.playlistAutoHideScrollbar) {
			this.repaint();
		}

		this.mouse_in = this.trace(x, y);

		return false;
	}

	/**
	 * Handles right mouse button up events and shows the context menu on scrollbar if available.
	 * Also handles the case when mouse is out of the list.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_rbtn_up(x, y, m) {
		if (!this.trace(x, y)) {
			return true;
		}

		if (!this.is_scrollbar_available
			|| !this.is_scrollbar_visible
			|| !this.scrollbar.trace(x, y)) {
			return false;
		}

		const cmm = new ContextMainMenu();

		this.append_scrollbar_visibility_context_menu_to(cmm);

		if (utils.IsKeyPressed(VKey.SHIFT)) {
			grm.ctxMenu.contextMenuDefault(cmm);
		}

		grm.ui.activeMenu = true;
		cmm.execute(x, y);
		grm.ui.activeMenu = false;

		this.repaint();

		return true;
	}

	/**
	 * Handles mouse wheel events and checks if a scrollbar is available.
	 * @param {number} step - The amount of scrolling that occurred on the mouse wheel.
	 */
	on_mouse_wheel(step) {
		if (this.is_scrollbar_available) {
			this.scrollbar.wheel(step);
		}
	}
	// #endregion
}


////////////////////////
// * ITEM CONTAINER * //
////////////////////////
/**
 * A class that represents a rectangular item with position and size properties.
 * Provides a base for subclasses to implement methods for drawing, repainting, and tracing.
 */
class BaseListItem {
	/**
	 * Creates the `BaseListItem` instance.
	 * Initializes the size and position of the item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 */
	constructor(x, y, w, h) {
		/**
		 * Throttles a function to limit how often it can be invoked. This specific throttled function
		 * is used to repaint a rectangular area of a window at most once every frame at a rate of 60fps.
		 * @type {Function}
		 * @private
		 */
		this.throttled_repaint = Throttle(() => {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		}, 1000 / 60);

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Placeholder method for drawing the item. Subclasses should override this method.
	 * @abstract
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @throws Will throw an error if the method is not overridden in a subclass.
	 */
	draw(gr) {
		throw new LogicError('draw not implemented');
	}

	/**
	 * Sets the x-coordinate for the item.
	 * @param {number} x - The new x-coordinate.
	 */
	set_x(x) {
		this.x = x;
	}

	/**
	 * Sets the y-coordinate for the item.
	 * @param {number} y - The new y-coordinate.
	 */
	set_y(y) {
		this.y = y;
	}

	/**
	 * Sets the width for the item.
	 * @param {number} w - The new width.
	 */
	set_w(w) {
		this.w = w;
	}

	/**
	 * Invokes a throttled repaint to update the item's display on the window.
	 */
	repaint() {
		this.throttled_repaint();
	}

	/**
	 * Checks if a given point (x, y) is within the boundaries of the item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if the point is within the item's boundaries, false otherwise.
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}
	// #endregion
}


///////////////////////////
// * CONTENT CONTAINER * //
///////////////////////////
/**
 * A class that represents an abstract content container that defines the interface
 * for generating and updating item lists, as well as calculating the total height of the list in rows.
 * Concrete subclasses must implement the abstract methods provided.
 */
class BaseListContent {
	// * ABSTRACT METHODS * //
	// #region ABSTRACT METHODS
	/**
	 * Generates the item list to be drawn based on the current state of the list.
	 * This abstract method must be overridden by subclasses.
	 * Called in three cases:
	 * - 1. Window vertical size changed.
	 * - 2. Scroll position changed.
	 * - 3. BaseList cnt changed.
	 * @abstract
	 * @param {number} wy - The y-coordinate of the list.
	 * @param {number} wh - The height of the list.
	 * @param {number} row_shift - The shift in rows (shift_in_pixels/row_h) in the list.
	 * @param {number} pixel_shift - The shift in pixels (shift_in_pixels - row_shift) in the list.
	 * @param {number} row_h - The row height in the list.
	 * @returns {Array<BaseListItem>} An array of BaseListItem instances that represent the items to be drawn.
	 */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		throw new LogicError('generate_items_to_draw not implemented');
	}

	/**
	 * Sets a new width for the list items.
	 * This abstract method must be overridden by subclasses.
	 * @abstract
	 * @param {number} w - The new width for the items.
	 */
	update_items_w_size(w) {
		throw new LogicError('update_items_w_size not implemented');
	}

	/**
	 * Calculates the total height of the list in rows.
	 * This abstract method must be overridden by subclasses.
	 * @abstract
	 * @returns {number} Total cnt height in rows, i.e. Total_h/row_h.
	 */
	calculate_total_h_in_rows() {
		throw new LogicError('calculate_total_h_in_rows not implemented');
	}
	// #endregion
}


/**
 * A class that represents a list of rows as a basic content container.
 * This concrete subclass of ListContent provides methods for generating and updating the items to draw,
 * and for calculating the total height in rows. It is designed to contain only items with a uniform height of `row_h`.
 * @augments {BaseListContent}
 */
class BaseListRowContent extends BaseListContent {
	/**
	 * Creates the `BaseListRowContent` instance.
	 * @memberof BaseListRowContent
	 */
	constructor() {
		super();

		/** @protected @type {Array<BaseListItem>} The collection of list items. */
		this.rows = [];
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Generates a list of items to draw based on the specified parameters.
	 * Implements the abstract method from the superclass ListContent.
	 * @param {number} wy - The starting y-coordinate of the drawing area.
	 * @param {number} wh - The height of the list where the items will be drawn.
	 * @param {number} row_shift - The index of the first row to start drawing from.
	 * @param {number} pixel_shift - The number of pixels to shift the starting position of the items vertically.
	 * @param {number} row_h - The height of each row in pixels.
	 * @returns {Array<BaseListItem>} An array of items to be drawn, called `items_to_draw`.
	 */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) { // Rewritten
		if (!this.rows.length) {
			return [];
		}

		const items_to_draw = [];
		const cur_x = PlaylistSetX();
		let cur_y = wy + pixel_shift;

		// Calculate the number of rows that can fit in the drawing area
		const maxRows = Math.min(Math.floor((wh - pixel_shift) / row_h), this.rows.length - row_shift);

		for (let i = row_shift; i < row_shift + maxRows; ++i) {
			this.rows[i].x = cur_x;
			this.rows[i].y = cur_y;
			items_to_draw.push(this.rows[i]);
			cur_y += row_h;
		}

		return items_to_draw;
	}

	/**
	 * Updates the width of each item in the list of rows.
	 * Implements the abstract method from the superclass ListContent.
	 * @param {number} w - The new width for the items.
	 */
	update_items_w_size(w) {
		for (const item of this.rows) {
			item.set_w(w);
		}
	}

	/**
	 * Calculates the total number of rows in the list.
	 * Implements the abstract method from the superclass ListContent.
	 * @returns {number} The number of rows in the list.
	 */
	calculate_total_h_in_rows() {
		return this.rows.length;
	}
	// #endregion
}
