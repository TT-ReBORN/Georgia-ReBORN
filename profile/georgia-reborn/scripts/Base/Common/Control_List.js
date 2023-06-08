/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN PlayList Control                     * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-05-25                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * PLAYLIST PROPERTIES * //
/////////////////////////////
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
 * Basic list with a scrollbar.
 * By default each item is a row of a fixed size.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {ListContent} content Content container
 * @constructor
 */
class List {
	constructor (x, y, w, h, content) {
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
		this.row_h = scaleForDisplay(g_properties.row_h);   // Also see playlist.reinitialize

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
		 * Row shift is always non-negative
		 * @protected {number}
		 */
		this.row_shift = 0;
		/**
		 * Pixel shift is always non-positive
		 * @protected {number}
		 */
		this.pixel_shift = 0;
		/** @protected {boolean} */
		this.is_scrollbar_visible = g_properties.show_scrollbar;
		/** @protected {boolean} */
		this.is_scrollbar_available = false;

		// * Objects
		/** @protected {?ScrollBar} */
		this.scrollbar = undefined;
		/** @protected {ListContent} */
		this.cnt = content;

		/**
		 * @private
		 * @function
		 */
		this.throttled_repaint = throttle(() => {
			window.RepaintRect(this.x - 1, playlist.y, this.w + 1, playlist.h);
		}, 1000 / 60);
	}

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

	// TODO: Mordred - override this elsewhere
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
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} m
	 * @return {boolean} true, if handled
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
			} else if (!this.mouse_in || !this.scrollbar.trace(x, y)) {
				g_properties.show_scrollbar = false;
			}
			this.update_scrollbar();
		}
		// * Update playlist row hover state or automatic scrollbar hide
		if (pref.playlistRowHover || pref.playlistAutoHideScrollbar) {
			this.repaint();
		}

		this.mouse_in = this.trace(x, y);

		return false;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} m
	 * @return {boolean} true, if handled
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
	 * @param {number} x
	 * @param {number} y
	 * @param {number} m
	 * @return {boolean} true, if handled
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
	 * @param {number} x
	 * @param {number} y
	 * @param {number} m
	 * @return {boolean} true, if handled
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
	 * Shows context menu on scrollbar if available.
	 * Also handles the case when mouse is out of the list.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} m
	 * @return {boolean} true, if handled
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

	on_mouse_wheel(delta) {
		if (this.is_scrollbar_available) {
			this.scrollbar.wheel(delta);
		}
	}

	on_mouse_leave() {
		if (this.is_scrollbar_available) {
			this.scrollbar.leave();
		}

		this.mouse_in = false;
	}

	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	trace_list(x, y) {
		return x >= this.list_x && x < this.list_x + this.list_w && y >= this.list_y && y < this.list_y + this.list_h;
	}

	repaint() {
		this.throttled_repaint();
	}

	append_scrollbar_visibility_context_menu_to(parent_menu) {
		parent_menu.append_item('Scrollbar auto-hide', () => {
			pref.playlistAutoHideScrollbar = !pref.playlistAutoHideScrollbar;
			g_properties.show_scrollbar = !pref.playlistAutoHideScrollbar;
			updatePlaylist();
		}, { is_checked: pref.playlistAutoHideScrollbar });
	}

	/**
	 * @param {number} h
	 * @protected
	 */
	on_h_size(h) {
		this.h = h;
		this.update_list_h_size();
	}

	/**
	 * @param {number} w
	 * @protected
	 */
	on_w_size(w) {
		this.w = w;
		this.update_list_w_size();
	}

	/**
	 * Called when data in Content is changed.
	 * @protected
	 */
	on_list_items_change() {
		this.update_scrollbar();
		this.on_content_to_draw_change();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {ListItem}
	 * @protected
	 */
	get_item_under_mouse(x, y) {
		return this.items_to_draw.find(item => item.trace(x, y));
	}

	/**
	 * @protected
	 */
	on_content_to_draw_change() {
		this.calculate_shift_params();
		this.items_to_draw = this.cnt.generate_items_to_draw(this.list_y, this.list_h, this.row_shift, this.pixel_shift, this.row_h);
	}

	/**
	 * @protected
	 */
	scrollbar_redraw_callback() {
		const invalidPos = this.scrollbar.scroll > this.scrollbar.scrollable_lines; // Prevent crash
		g_properties.scroll_pos = invalidPos ? 0 : this.scrollbar.scroll;
		this.on_content_to_draw_change();
		this.repaint();
	}

	/**
	 * @private
	 */
	initialize_scrollbar() {
		this.is_scrollbar_available = false;

		const scrollbar_x = this.x - scaleForDisplay(32) + this.w - playlist_geo.scrollbar_w - playlist_geo.scrollbar_right_pad;
		const scrollbar_y = this.y + playlist_geo.scrollbar_top_pad - (is_4k ? 12 : 5);
		const scrollbar_w = scaleForDisplay(28);
		const scrollbar_h = this.h - (playlist_geo.scrollbar_bottom_pad + playlist_geo.scrollbar_top_pad) + (is_4k ? 14 : 5);

		if (this.scrollbar) {
			this.scrollbar.reset();
		}

		this.scrollbar = new ScrollBar(scrollbar_x, scrollbar_y, scrollbar_w, scrollbar_h, this.row_h, this.scrollbar_redraw_callback.bind(this));
	}

	/**
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

			const invalidPos = this.scrollbar.scroll > this.scrollbar.scrollable_lines; // Prevent crash
			g_properties.scroll_pos = invalidPos ? 0 : this.scrollbar.scroll;

			this.is_scrollbar_available = true;
			this.on_scrollbar_visibility_change(g_properties.show_scrollbar);
		}
	}

	/**
	 * @private
	 */
	on_scrollbar_visibility_change(is_visible) {
		if (this.is_scrollbar_visible !== is_visible) {
			this.is_scrollbar_visible = is_visible;
			this.update_list_w_size();
		}
	}

	/**
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
class ListItem {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @constructor
	 */
	constructor(x, y, w, h) {
		/**
		 * @private
		 * @function
		 */
		this.throttled_repaint = throttle(() => {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		}, 1000 / 60);

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	/**
	 * @param {GdiGraphics} gr
	 * @abstract
	 */
	draw(gr) {
		throw new LogicError('draw not implemented');
	}

	repaint() {
		this.throttled_repaint();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {boolean}
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * @param {number} x
	 */
	set_x(x) {
		this.x = x;
	}

	/**
	 * @param {number} y
	 */
	set_y(y) {
		this.y = y;
	}

	/**
	 * @param {number} w
	 */
	set_w(w) {
		this.w = w;
	}
}


////////////////////////////
// * CONTENT CONTAINERS * //
////////////////////////////
/**
 * Content container
 * @constructor
 */
class ListContent {
	/**
	 * Generates item list to draw
	 * Called in three cases:
	 * 1. Window vertical size changed
	 * 2. Scroll position changed
	 * 3. List cnt changed
	 * @param {number} wy List Y coordinate
	 * @param {number} wh List height
	 * @param {number} row_shift List shift in rows (shift_in_pixels/row_h)
	 * @param {number} pixel_shift List shift in pixels (shift_in_pixels - row_shift)
	 * @param {number} row_h Row height
	 * @return {Array<ListItem>}
	 * @abstract
	 */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		throw new LogicError('generate_items_to_draw not implemented');
	}

	/**
	 * Sets new width of the items
	 * @param {number} w
	 * @abstract
	 */
	update_items_w_size(w) {
		throw new LogicError('update_items_w_size not implemented');
	}

	/**
	 * @return {number} Total cnt height in rows, i.e. total_h/row_h
	 * @abstract
	 */
	calculate_total_h_in_rows() {
		throw new LogicError('calculate_total_h_in_rows not implemented');
	}
}


/**
 * Basic cnt container, which may contain only Items with height of row_h
 * @constructor
 * @extend {ListContent}
 */
class ListRowContent extends ListContent {
	constructor() {
		super();

		/** @type {Array<ListItem>} */
		this.rows = [];
	}

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

	update_items_w_size(w) {
		this.rows.forEach(item => {
			item.set_w(w);
		});
	}

	calculate_total_h_in_rows() {
		return this.rows.length;
	}
}
