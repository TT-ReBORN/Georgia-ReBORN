/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN PlayList Control                     * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-09-25                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * PLAYLIST PROPERTIES * //
/////////////////////////////
/**
 * Adds additional system playlist panel properties to the SMP properties.
 */
g_properties.add_properties(
	{
		list_left_pad:        ['Panel Playlist - Padding left', 0],
		list_top_pad:         ['Panel Playlist - Padding top', 0],
		list_right_pad:       ['Panel Playlist - Padding right', 0],
		list_bottom_pad:      ['Panel Playlist - Padding bottom', 15],
		show_scrollbar:       ['Panel Playlist - User: Scrollbar.show', true],
		scrollbar_right_pad:  ['Panel Playlist - User: scrollbar.pad.right', 0],
		scrollbar_top_pad:    ['Panel Playlist - User: scrollbar.pad.top', 0],
		scrollbar_bottom_pad: ['Panel Playlist - User: scrollbar.pad.bottom', 3],
		scrollbar_w:          ['Panel Playlist - User: scrollbar.width', ''],
		row_h:                ['Panel Playlist - User: Row.height', 20],
		scroll_pos:           ['Panel Playlist - System: Scrollbar.position', 0]
	}
);

// * Fixup properties
g_properties.row_h = Math.max(10, g_properties.row_h);


////////////////////
// * BASIC LIST * //
////////////////////
/**
 * A basic list with items to display and a scrollbar.
 * Also handles mouse and keyboard events.
 */
class List {
	/**
	 * By default each item is a row of a fixed size.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} w The width.
	 * @param {number} h The height.
	 * @param {ListContent} content The content container.
	 * @class
	 */
	constructor(x, y, w, h, content) {
		// public:

		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
		/** @type {number} */
		this.w = w;
		/** @type {number} */
		this.h = h;

		/** @const {number}*/
		this.row_h = SCALE(g_properties.row_h); // Also see playlist.reinitialize

		/** @protected {number} */
		this.list_x = this.x + g_properties.list_left_pad;
		/** @protected {number} */
		this.list_y = 0;
		/** @protected {number} */
		this.list_w = 0;
		/** @protected {number} */
		this.list_h = 0;

		/** @protected {number} */
		this.rows_to_draw_precise = 0;

		/** @protected {Array<ListItem>} */
		this.items_to_draw = [];

		// * Mouse and key state
		/** @protected {boolean} */
		this.mouse_in = false;
		/** @protected {boolean} */
		this.mouse_down = false;
		/** @protected {boolean} */
		this.mouse_double_clicked = false;

		// * Scrollbar props
		/**
		 * Row shift is always non-negative.
		 * @protected {number}
		 */
		this.row_shift = 0;
		/**
		 * Pixel shift is always non-positive.
		 * @protected {number}
		 */
		this.pixel_shift = 0;
		/** @protected {boolean} */
		this.is_scrollbar_visible = g_properties.show_scrollbar;
		/** @protected {boolean} */
		this.is_scrollbar_available = false;
		/** @protected {boolean} */
		this.needs_scrollbar_update = false;

		// * Objects
		/** @protected {?ScrollBar} */
		this.scrollbar = undefined;
		/** @protected {ListContent} */
		this.cnt = content;

		/**
		 * @private
		 * @function
		 */
		this.throttled_repaint = Throttle(() => {
			window.RepaintRect(this.x - 1, playlist.y, this.w + 1, playlist.h);
		}, 1000 / 60);
	}

	/**
	 * Draws the list items with a scrollbar if necessary.
	 * @param {GdiGraphics} gr
	 */
	on_paint(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.items_to_draw.length) {
			for (let i = this.items_to_draw.length - 1; i >= 0; --i) {
				this.items_to_draw[i].draw(gr);
			}
		}
		else {
			const text_format = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
			gr.DrawString('No rows to display', gdi.Font('Segoe UI Semibold', 24), RGB(70, 70, 70), this.x, this.y, this.w, this.h, text_format);
		}

		if (this.is_scrollbar_visible) {
			this.scrollbar.paint(gr);
		}
	}

	/**
	 * Adjusts the size and position of an element based on the provided parameters.
	 * Also handles hiding the scrollbar if auto-hide is enabled.
	 * @param {number} w The width.
	 * @param {number} h The height.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
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
			this.list_x = this.x + g_properties.list_left_pad;
			this.on_w_size(w);
		}

		// * Makes sure to always hide scrollbar when auto-hide is enabled
		if (pref.playlistAutoHideScrollbar && g_properties.show_scrollbar) {
			g_properties.show_scrollbar = false;
		}
	}

	/**
	 * Handles mouse movement events and updates the scrollbar position,
	 * hides the scrollbar automatically, and updates the playlist row hover state.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {string} m The mouse mask.
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
		if (pref.playlistAutoHideScrollbar) {
			if (this.scrollbar.trace(x, y)) {
				g_properties.show_scrollbar = true;
				this.update_scrollbar();
				this.needs_scrollbar_update = true;
			} else if (!this.mouse_in || !this.scrollbar.trace(x, y)) {
				g_properties.show_scrollbar = false;
				if (this.needs_scrollbar_update) {
					this.update_scrollbar();
					this.needs_scrollbar_update = false;
				}
			}
		}
		// * Update playlist row hover state or automatic scrollbar hide
		if (pref.playlistRowHover || pref.playlistAutoHideScrollbar) {
			this.repaint();
		}

		this.mouse_in = this.trace(x, y);

		return false;
	}

	/**
	 * Handles left mouse button down events and performs different actions based on the mouse position and other conditions.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {string} m The mouse mask.
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
	 * Handles mouse double click events.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {string} m The mouse mask.
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
	 * Handles left mouse button up events and checks if the scrollbar is visible and if it was being dragged.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} m The mouse mask.
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
	 * Handles right mouse button up events and shows the context menu on scrollbar if available.
	 * Also handles the case when mouse is out of the list.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} m The mouse mask.
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

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		activeMenu = true;
		cmm.execute(x, y);
		activeMenu = false;

		this.repaint();

		return true;
	}

	/**
	 * Handles mouse wheel events and checks if a scrollbar is available.
	 * @param {number} step The amount of scrolling that occurred on the mouse wheel.
	 */
	on_mouse_wheel(step) {
		if (this.is_scrollbar_available) {
			this.scrollbar.wheel(step);
		}
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
	 * Checks if a given point (x, y) is within the boundaries of an list item.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True if the given x and y coordinates are within the boundaries.
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * Checks if a given point (x, y) is within the boundaries of the list.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
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
	 * @param {string} parent_menu The menu to which the scrollbar visibility context menu item will be appended.
	 */
	append_scrollbar_visibility_context_menu_to(parent_menu) {
		parent_menu.append_item('Scrollbar auto-hide', () => {
			pref.playlistAutoHideScrollbar = !pref.playlistAutoHideScrollbar;
			g_properties.show_scrollbar = !pref.playlistAutoHideScrollbar;
			updatePlaylist();
		}, { is_checked: pref.playlistAutoHideScrollbar });
	}

	/**
	 * Updates the height size of the list.
	 * @param {number} h The height.
	 * @protected
	 */
	on_h_size(h) {
		this.h = h;
		this.update_list_h_size();
	}

	/**
	 * Updates the width size of the list.
	 * @param {number} w The width.
	 * @protected
	 */
	on_w_size(w) {
		this.w = w;
		this.update_list_w_size();
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
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {ListItem} The item that is found under the mouse coordinates.
	 * @protected
	 */
	get_item_under_mouse(x, y) {
		return this.items_to_draw.find(item => item.trace(x, y));
	}

	/**
	 * Calculates shift parameters and generates a list of items to draw.
	 * @protected
	 */
	on_content_to_draw_change() {
		this.calculate_shift_params();
		this.items_to_draw = this.cnt.generate_items_to_draw(this.list_y, this.list_h, this.row_shift, this.pixel_shift, this.row_h);
	}

	/**
	 * The scrollbar callback to update the scroll position and content.
	 * @protected
	 */
	scrollbar_redraw_callback() {
		const invalidPos = (g_properties.scroll_pos || this.scrollbar.scroll) > this.scrollbar.scrollable_lines; // Prevent scroll crash
		g_properties.scroll_pos = invalidPos ? 0 : this.scrollbar.scroll;
		this.on_content_to_draw_change();
		this.repaint();
	}

	/**
	 * Initializes the scrollbar with specific dimensions and a callback for redrawing.
	 * @private
	 */
	initialize_scrollbar() {
		this.is_scrollbar_available = false;

		const scrollbar_x = this.x - SCALE(32) + this.w - playlist_geo.scrollbar_w - playlist_geo.scrollbar_right_pad;
		const scrollbar_y = this.y + playlist_geo.scrollbar_top_pad - (RES_4K ? 12 : 5);
		const scrollbar_w = SCALE(28);
		const scrollbar_h = this.h - (playlist_geo.scrollbar_bottom_pad + playlist_geo.scrollbar_top_pad) + (RES_4K ? 14 : 5);

		if (this.scrollbar) {
			this.scrollbar.reset();
		}

		this.scrollbar = new ScrollBar(scrollbar_x, scrollbar_y, scrollbar_w, scrollbar_h, this.row_h, this.scrollbar_redraw_callback.bind(this));
	}

	/**
	 * Checks if the scrollbar should be displayed based on the total height of the content and updates the scrollbar accordingly.
	 * @private
	 */
	update_scrollbar() {
		const total_height_in_rows = this.cnt.calculate_total_h_in_rows();

		if (total_height_in_rows <= this.rows_to_draw_precise) {
			this.is_scrollbar_available = false;
			g_properties.scroll_pos = 0;
			this.on_scrollbar_visibility_change(false);
		}
		else if (this.scrollbar) {
			this.scrollbar.set_window_param(this.rows_to_draw_precise, total_height_in_rows);
			this.scrollbar.scroll_to(g_properties.scroll_pos, true);

			const invalidPos = (g_properties.scroll_pos || this.scrollbar.scroll) > this.scrollbar.scrollable_lines; // Prevent scroll crash
			g_properties.scroll_pos = invalidPos ? 0 : this.scrollbar.scroll;

			this.is_scrollbar_available = true;
			this.on_scrollbar_visibility_change(g_properties.show_scrollbar);
		}
	}

	/**
	 * Updates the size of the list when visibility of the scrollbar changes.
	 * @param {boolean} is_visible The state if the scrollbar is currently visible or not.
	 * @private
	 */
	on_scrollbar_visibility_change(is_visible) {
		if (this.is_scrollbar_visible !== is_visible) {
			this.is_scrollbar_visible = is_visible;
			this.update_list_w_size();
		}
	}

	/**
	 * Updates the size and position of the list and also the scrollbar.
	 * @private
	 */
	update_list_h_size() {
		this.list_y = this.y + g_properties.list_top_pad;
		this.list_h = this.h - (g_properties.list_bottom_pad + g_properties.list_top_pad);

		this.rows_to_draw_precise = this.list_h / this.row_h;

		this.initialize_scrollbar();
		this.update_scrollbar();
		this.on_content_to_draw_change();
	}

	/**
	 * Updates the width of the list and its scrollbar.
	 * @private
	 */
	update_list_w_size() {
		this.list_w = this.w - g_properties.list_left_pad - g_properties.list_right_pad;

		if (this.is_scrollbar_available) {
			if (this.is_scrollbar_visible) {
				this.list_w -= this.scrollbar.w + 2;
			}
			this.scrollbar.set_x(this.w - playlist_geo.scrollbar_w - playlist_geo.scrollbar_right_pad);
		}

		// TODO: Mordred - override this elsewhere
		this.initialize_scrollbar();
		this.update_scrollbar();
		this.on_content_to_draw_change();

		this.cnt.update_items_w_size(this.list_w);
	}

	/**
	 * Calculates the shift parameters for scrolling.
	 * @private
	 */
	calculate_shift_params() {
		this.row_shift = Math.floor(g_properties.scroll_pos);
		this.pixel_shift = -Math.round((g_properties.scroll_pos - this.row_shift) * this.row_h);
	}
}


////////////////////////
// * ITEM CONTAINER * //
////////////////////////
/**
 * The item container represents a rectangular item with position and size properties,
 * and provides methods for drawing, repainting, and tracing.
 */
class ListItem {
	/**
	 * Initializes the size and position of the object.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} w The width.
	 * @param {number} h The height.
	 * @class
	 */
	constructor(x, y, w, h) {
		/**
		 * @private
		 * @function
		 */
		this.throttled_repaint = Throttle(() => {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		}, 1000 / 60);

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	/**
	 * Nothing to draw here.
	 * @param {GdiGraphics} gr
	 * @abstract
	 */
	draw(gr) {
		throw new LogicError('draw not implemented');
	}

	/**
	 * Invokes a throttled repaint.
	 */
	repaint() {
		this.throttled_repaint();
	}

	/**
	 * Checks if a given point (x, y) is within the boundaries of an list item.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * Sets the x-coordinate for the list item.
	 * @param {number} x The x-coordinate.
	 */
	set_x(x) {
		this.x = x;
	}

	/**
	 * Sets the y-coordinate for the list item.
	 * @param {number} y The y-coordinate.
	 */
	set_y(y) {
		this.y = y;
	}

	/**
	 * Sets the width for the list item.
	 * @param {number} w The width.
	 */
	set_w(w) {
		this.w = w;
	}
}


///////////////////////////
// * CONTENT CONTAINER * //
///////////////////////////
/**
 * A content container that provides methods for generating and updating item lists,
 * as well as calculating the total height of the list in rows.
 * @class
 */
class ListContent {
	/**
	 * Generates the item list to draw.
	 * Called in three cases:
	 * - 1. Window vertical size changed.
	 * - 2. Scroll position changed.
	 * - 3. List cnt changed.
	 * @param {number} wy The y-coordinate of the list.
	 * @param {number} wh The height of the list.
	 * @param {number} row_shift The shift in rows (shift_in_pixels/row_h) in the list.
	 * @param {number} pixel_shift The shift in pixels (shift_in_pixels - row_shift) in the list.
	 * @param {number} row_h The row height in the list.
	 * @returns {Array<ListItem>}
	 * @abstract
	 */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		throw new LogicError('generate_items_to_draw not implemented');
	}

	/**
	 * Sets a new width for the items.
	 * @param {number} w The width.
	 * @abstract
	 */
	update_items_w_size(w) {
		throw new LogicError('update_items_w_size not implemented');
	}

	/**
	 * Calculates the total height in rows.
	 * @returns {number} Total cnt height in rows, i.e. total_h/row_h.
	 * @abstract
	 */
	calculate_total_h_in_rows() {
		throw new LogicError('calculate_total_h_in_rows not implemented');
	}
}


/**
 * A Basic content container and a subclass of ListContent that represents a list of rows and provides methods
 * for generating and updating the items to draw, as well as calculating the total height in rows.
 * May contain only Items with height of row_h.
 */
class ListRowContent extends ListContent {
	/**
	 * @extends {ListContent}
	 * @class
	 */
	constructor() {
		super();

		/** @type {Array<ListItem>} */
		this.rows = [];
	}

	/**
	 * Generates a list of items to draw based on the given parameters.
	 * @param {number} wy The starting y-coordinate of the drawing area.
	 * @param {number} wh The height of the list where the items will be drawn.
	 * @param {number} row_shift The index of the first row to start drawing from.
	 * @param {number} pixel_shift The number of pixels to shift the starting position of the items to draw vertically.
	 * @param {number} row_h The height of each row in pixels.
	 * @returns {Array} An array called `items_to_draw`.
	 */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		if (!this.rows.length) {
			return [];
		}

		const items_to_draw = [];
		let cur_y = wy + pixel_shift;

		for (let i = row_shift; i < this.rows.length; ++i) {
			this.rows[i].x = pref.layout === 'default' && (pref.playlistLayout === 'normal' || pref.playlistLayoutNormal && (displayBiography || pref.displayLyrics)) ? ww * 0.5 : 0;
			this.rows[i].y = cur_y;
			items_to_draw.push(this.rows[i]);
			cur_y += row_h;

			if (cur_y >= wy + wh) {
				break;
			}
		}

		return items_to_draw;
	}

	/**
	 * Updates the width of each item in a list of rows.
	 * @param {number} w The width.
	 */
	update_items_w_size(w) {
		this.rows.forEach(item => {
			item.set_w(w);
		});
	}

	/**
	 * Calculates the total number of rows in the list.
	 * @returns {number} The number of rows in the list.
	 */
	calculate_total_h_in_rows() {
		return this.rows.length;
	}
}
