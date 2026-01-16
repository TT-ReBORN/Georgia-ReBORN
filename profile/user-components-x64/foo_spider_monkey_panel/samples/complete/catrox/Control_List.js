'use strict';

g_properties.add_properties(
	{
		list_left_pad:   ['user.list.pad.left', 0],
		list_top_pad:    ['user.list.pad.top', 0],
		list_right_pad:  ['user.list.pad.right', 0],
		list_bottom_pad: ['user.list.pad.bottom', 0],

		show_scrollbar:       ['user.scrollbar.show', true],
		scrollbar_right_pad:  ['user.scrollbar.pad.right', 0],
		scrollbar_top_pad:    ['user.scrollbar.pad.top', 0],
		scrollbar_bottom_pad: ['user.scrollbar.pad.bottom', 3],
		scrollbar_w:          ['user.scrollbar.width', utils.GetSystemMetrics(2)],

		row_h: ['user.row.height', 20],

		scroll_pos: ['system.scrollbar.position', 0]
	}
);

// Fixup properties
(function() {
	g_properties.row_h = Math.max(10, g_properties.row_h);
	if (!_.isFinite(g_properties.scroll_pos) || g_properties.scroll_pos < 0) {
		g_properties.scroll_pos = 0;
	}
})();

/**
 * Basic list with a scrollbar.
 * By default each item is a row of a fixed size.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {List.Content} content Content container
 * @constructor
 */
let List = function (x, y, w, h, content) {

	// public:

	/** @type {number} */
	this.x = x;
	/** @type {number} */
	this.y = y;
	/** @type {number} */
	this.w = w;
	/** @type {number} */
	this.h = h;

	/**
	 * @const
	 * @type {number}
	 */
	this.row_h = g_properties.row_h;

	/** @type {number} */
	this.background_color = g_theme.colors.pss_back;
	/** @type {number} */
	this.panel_back_color = g_theme.colors.panel_back;

	// protected:

	/**
	 * @private
	 * @function
	 */
	this.throttled_repaint = _.throttle(_.bind(function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}, this), 1000 / 60);

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

	/** @protected {Array<List.Item>} */
	this.items_to_draw = [];

	// Mouse and key state

	/** @protected {boolean} */
	this.mouse_in = false;
	/** @protected {boolean} */
	this.mouse_down = false;
	/** @protected {boolean} */
	this.mouse_double_clicked = false;

	// Scrollbar props

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

	// Objects

	/** @protected {?ScrollBar} */
	this.scrollbar = undefined;
	/** @protected {List.Content} */
	this.cnt = content;
};

// public:

/// callbacks
List.prototype.on_paint = function (gr) {
	gr.FillSolidRect(this.x, this.y, this.w, this.h, this.background_color);
	gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

	if (this.items_to_draw.length) {
		_.forEachRight(this.items_to_draw, _.bind(function (item) {
			item.draw(gr);
		}, this));

		// Hide items that shouldn't be visible
		gr.FillSolidRect(this.x, this.y, this.w, this.list_y - this.y, this.background_color);
		gr.FillSolidRect(this.x, this.list_y + this.list_h, this.w, (this.y + this.h) - (this.list_y + this.list_h), this.background_color);
	}
	else {
		var text_format = StringFormat();
		text_format.alignment = StringAlignment.center;
		text_format.line_alignment = StringAlignment.center;
		text_format.trimming = StringTrimming.ellipsis_char;
		text_format.format_flags = StringFormatFlags.no_wrap;

		gr.DrawString('No rows to display', gdi.Font('Segoe Ui Semibold', 24), _RGB(70, 70, 70), this.x, this.y, this.w, this.h, text_format.value());
	}

	if (this.is_scrollbar_available) {
		if (!this.scrollbar.is_scrolled_up) {
			gr.FillGradRect(this.list_x, this.list_y - 1, this.list_w, 7 + 1, 270, _RGBtoRGBA(g_theme.colors.panel_back, 0), _RGBtoRGBA(this.panel_back_color, 200));
		}
		if (!this.scrollbar.is_scrolled_down) {
			gr.FillGradRect(this.list_x, this.list_y + this.list_h - 8, this.list_w, 7 + 1, 90, _RGBtoRGBA(g_theme.colors.panel_back, 0), _RGBtoRGBA(this.panel_back_color, 200));
		}
	}

	if (this.is_scrollbar_visible) {
		this.scrollbar.paint(gr);
	}
};

List.prototype.on_size = function (w, h) {
	var w_changed = this.w !== w;
	var h_changed = this.h !== h;

	if (h_changed) {
		this.on_h_size(h);
	}

	if (w_changed) {
		this.on_w_size(w)
	}
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} m
 * @return {boolean} true, if handled
 */
List.prototype.on_mouse_move = function (x, y, m) {
	if (this.is_scrollbar_visible) {
		this.scrollbar.move(x, y, m);

		if (this.scrollbar.b_is_dragging || this.scrollbar.trace(x, y)) {
			return true;
		}
	}

	this.mouse_in = this.trace(x, y);

	return false;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} m
 * @return {boolean} true, if handled
 */
List.prototype.on_mouse_lbtn_down = function (x, y, m) {
	this.mouse_down = true;

	if (this.mouse_double_clicked) {
		return true;
	}

	if (this.is_scrollbar_visible) {
		if (this.scrollbar.trace(x, y)) {
			this.scrollbar.lbtn_dn(x, y, m);
			return true;
		}
	}

	return false;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} m
 * @return {boolean} true, if handled
 */
List.prototype.on_mouse_lbtn_dblclk = function (x, y, m) {
	this.mouse_down = true;
	this.mouse_double_clicked = true;

	if (this.is_scrollbar_visible) {
		if (this.scrollbar.trace(x, y)) {
			this.scrollbar.lbtn_dn(x, y, m);
			return true;
		}
	}

	return false;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} m
 * @return {boolean} true, if handled
 */
List.prototype.on_mouse_lbtn_up = function (x, y, m) {
	if (!this.mouse_down) {
		return true;
	}

	this.mouse_double_clicked = false;
	this.mouse_down = false;

	if (this.is_scrollbar_visible) {
		var wasDragging = this.scrollbar.b_is_dragging;
		this.scrollbar.lbtn_up(x, y, m);
		if (wasDragging) {
			return true;
		}
	}

	return false;
};

/**
 * Shows context menu on scrollbar if available.
 * Also handles the case when mouse is out of the list.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} m
 * @return {boolean} true, if handled
 */
List.prototype.on_mouse_rbtn_up = function (x, y, m) {
	if (!this.trace(x,y)) {
		return true;
	}

	if (!this.is_scrollbar_available
		|| !this.is_scrollbar_visible
		|| !this.scrollbar.trace(x,y) ) {
		return false;
	}

	var cmm = new Context.MainMenu();

	this.append_scrollbar_visibility_context_menu_to(cmm);

	if (utils.IsKeyPressed(VK_SHIFT)) {
		qwr_utils.append_default_context_menu_to(cmm);
	}

	cmm.execute(x,y);
	cmm.dispose();

	this.repaint();

	return true;
};

List.prototype.on_mouse_wheel = function (delta) {
	if (this.is_scrollbar_available) {
		this.scrollbar.wheel(delta);
	}
};

List.prototype.on_mouse_leave = function () {
	if (this.is_scrollbar_available) {
		this.scrollbar.leave();
	}

	this.mouse_in = false;
};

/// EOF callbacks

List.prototype.trace = function (x, y) {
	return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
};

List.prototype.trace_list = function (x, y) {
	return x >= this.list_x && x < this.list_x + this.list_w && y >= this.list_y && y < this.list_y + this.list_h;
};

List.prototype.repaint = function () {
	this.throttled_repaint();
};

List.prototype.append_scrollbar_visibility_context_menu_to = function(parent_menu) {
	parent_menu.append_item(
		'Show scrollbar',
		_.bind(function () {
			g_properties.show_scrollbar = !g_properties.show_scrollbar;
			this.on_scrollbar_visibility_change(g_properties.show_scrollbar);
		}, this),
		{is_checked: g_properties.show_scrollbar}
	);
};

// protected:

/**
 * @param {number} h
 * @protected
 */
List.prototype.on_h_size = function (h) {
	this.h = h;
	this.update_list_h_size();
};

/**
 * @param {number} w
 * @protected
 */
List.prototype.on_w_size = function (w) {
	this.w = w;
	this.update_list_w_size();
};

/**
 * Called when data in Content is changed.
 * @protected
 */
List.prototype.on_list_items_change = function () {
	this.update_scrollbar();
	this.on_content_to_draw_change();
};

/**
 * @param {number} x
 * @param {number} y
 * @return {List.Item}
 * @protected
 */
List.prototype.get_item_under_mouse = function (x, y) {
	return _.find(this.items_to_draw, function (item) {
		return item.trace(x, y);
	});
};

/**
 * @protected
 */
List.prototype.on_content_to_draw_change = function () {
	this.calculate_shift_params();
	this.items_to_draw =
		this.cnt.generate_items_to_draw(this.list_y, this.list_h, this.row_shift, this.pixel_shift, this.row_h);
};

/**
 * @protected
 */
List.prototype.scrollbar_redraw_callback = function () {
	g_properties.scroll_pos = this.scrollbar.scroll;
	this.on_content_to_draw_change();
	this.repaint();
};

/**
 * @private
 */
List.prototype.initialize_scrollbar = function () {
	this.is_scrollbar_available = false;

	var scrollbar_x = this.x + this.w - g_properties.scrollbar_w - g_properties.scrollbar_right_pad;
	var scrollbar_y = this.y + g_properties.scrollbar_top_pad;
	var scrollbar_h = this.h - (g_properties.scrollbar_bottom_pad + g_properties.scrollbar_top_pad);

	if (this.scrollbar) {
		this.scrollbar.reset();
	}
	this.scrollbar = new ScrollBar(scrollbar_x, scrollbar_y, g_properties.scrollbar_w, scrollbar_h, this.row_h, _.bind(this.scrollbar_redraw_callback,this));
};

/**
 * @private
 */
List.prototype.update_scrollbar = function () {
	var total_height_in_rows = this.cnt.calculate_total_h_in_rows();

	if (total_height_in_rows <= this.rows_to_draw_precise) {
		this.is_scrollbar_available = false;
		g_properties.scroll_pos = 0;
		this.on_scrollbar_visibility_change(false);
	}
	else {
		this.scrollbar.set_window_param(this.rows_to_draw_precise, total_height_in_rows);
		this.scrollbar.scroll_to(g_properties.scroll_pos, true);

		g_properties.scroll_pos = this.scrollbar.scroll;
		this.is_scrollbar_available = true;
		this.on_scrollbar_visibility_change(g_properties.show_scrollbar);
	}
};

/**
 * @private
 */
List.prototype.on_scrollbar_visibility_change = function (is_visible) {
	if (this.is_scrollbar_visible !== is_visible) {
		this.is_scrollbar_visible = is_visible;
		this.update_list_w_size();
	}
};

/**
 * @private
 */
List.prototype.update_list_h_size = function () {
	this.list_y = this.y + g_properties.list_top_pad;
	this.list_h = this.h - (g_properties.list_bottom_pad + g_properties.list_top_pad);

	this.rows_to_draw_precise = this.list_h / this.row_h;

	this.initialize_scrollbar();
	this.update_scrollbar();
	this.on_content_to_draw_change();
};

/**
 * @private
 */
List.prototype.update_list_w_size = function () {
	this.list_w = this.w - g_properties.list_left_pad - g_properties.list_right_pad;

	if (this.is_scrollbar_available) {
		if (this.is_scrollbar_visible) {
			this.list_w -= this.scrollbar.w + 2;
		}
		this.scrollbar.set_x(this.w - g_properties.scrollbar_w - g_properties.scrollbar_right_pad);
	}

	this.cnt.update_items_w_size(this.list_w);
};

/**
 * @private
 */
List.prototype.calculate_shift_params = function () {
	this.row_shift = Math.floor(g_properties.scroll_pos);
	this.pixel_shift = -Math.round((g_properties.scroll_pos - this.row_shift) * this.row_h);
};


/**
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h Item height. Must be multiple of row height ({@link List.row_h}, {@link g_properties.row_h})
 *
 * @abstract
 * @constructor
 */
List.Item = function (x, y, w, h) {
	/**
	 * @private
	 * @function
	 */
	this.throttled_repaint = _.throttle(_.bind(function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}, this), 1000 / 60);

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};
/**
 * @param {IGdiGraphics} gr
 * @abstract
 */
List.Item.prototype.draw = function (gr) {
	throw LogicError("draw not implemented");
};
List.Item.prototype.repaint = function () {
	this.throttled_repaint();
};
/**
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
List.Item.prototype.trace = function (x, y) {
	return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
};
/**
 * @param {number} y
 */
List.Item.prototype.set_y = function (y) {
	this.y = y;
};
/**
 * @param {number} w
 */
List.Item.prototype.set_w = function (w) {
	this.w = w;
};


/**
 * Content container
 * @abstract
 * @constructor
 */
List.Content = function () {};

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
 * @return {Array<List.Item>}
 * @abstract
 */
List.Content.prototype.generate_items_to_draw = function(wy, wh, row_shift, pixel_shift, row_h) {
	throw LogicError("generate_items_to_draw not implemented");
};

/**
 * Sets new width of the items
 * @param {number} w
 * @abstract
 */
List.Content.prototype.update_items_w_size = function(w) {
	throw LogicError("update_items_w_size not implemented");
};

/**
 * @return {number} Total cnt height in rows, i.e. total_h/row_h
 * @abstract
 */
List.Content.prototype.calculate_total_h_in_rows = function() {
	throw LogicError("calculate_total_h_in_rows not implemented");
};


/**
 * Basic cnt container, which may contain only Items with height of row_h
 * @constructor
 * @extends {List.Content}
 */
List.RowContent = function() {
	List.Content.call(this);

	/** @type {Array<Row>} */
	this.rows = [];
};
List.RowContent.prototype = Object.create(List.Content.prototype);
List.RowContent.prototype.constructor = List.RowContent;

List.RowContent.prototype.generate_items_to_draw = function (wy, wh, row_shift, pixel_shift, row_h) {
	if (!this.rows.length) {
		return [];
	}

	var items_to_draw = [];
	var cur_y = wy + pixel_shift;

	for (var i = row_shift; i < this.rows.length; ++i) {
		this.rows[i].y = cur_y;
		items_to_draw.push(this.rows[i]);
		cur_y += row_h;

		if (cur_y >= wy + wh) {
			break;
		}
	}

	return items_to_draw;
};

List.Content.prototype.update_items_w_size = function(w) {
	this.rows.forEach(_.bind(function (item) {
		item.set_w(w);
	}, this));
};

List.Content.prototype.calculate_total_h_in_rows = function() {
	return this.rows.length;
};
