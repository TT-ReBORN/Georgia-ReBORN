'use strict';

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;
var trace_initialize_list_performance = false;

// Niceties:
// TODO: grouping presets manager: other EsPlaylist grouping features - sorting, playlist association
// Low priority:
// TODO: think about on_visibility_change callback
// TODO: research the source of hangs with big art image loading (JScript? fb2k?)
// TODO: measure draw vs backend performance
g_properties.add_properties(
	{
		rows_in_header:         ['user.header.normal.row_count', 4],
		rows_in_compact_header: ['user.header.compact.row_count', 2],

		show_playlist_info: ['user.playlist_info.show', true],

		show_header:        ['user.header.show', true],
		use_compact_header: ['user.header.use_compact', false],
		show_album_art:     ['user.header.this.art.show', true],
		auto_album_art:     ['user.header.this.art.auto', false],
		show_group_info:    ['user.header.info.show', true],
		show_original_date: ['user.header.original_date.show', false],
		show_disc_header:   ['user.header.disc_header.show', true],

		alternate_row_color:  ['user.row.alternate_color', true],
		show_playcount:       ['user.row.play_count.show', _cc('foo_playcount')],
		show_rating:          ['user.row.rating.show', _cc('foo_playcount')],
		use_rating_from_tags: ['user.row.rating.from_tags', false],
		show_focused_row:     ['user.row.focused.show', true],
		show_queue_position:  ['user.row.queue_position.show', true],

		auto_colapse:                ['user.header.collapse.auto', false],
		collapse_on_playlist_switch: ['user.header.collapse.on_playlist_switch', false],
		collapse_on_start:           ['user.header.collapse.on_start', false],

		// Default values for grouping data are set in it's class ctor
		playlist_group_data:        ['system.playlist.grouping.data_list', ''],
		playlist_custom_group_data: ['system.playlist.grouping.custom_data_list', ''],
		default_group_name:         ['system.playlist.grouping.default_preset_name', ''],
		group_presets:              ['system.playlist.grouping.presets', '']
	}
);

var g_component_playcount = _cc('foo_playcount');

// Fixup properties
(function () {
	g_properties.rows_in_header = Math.max(0, g_properties.rows_in_header);
	g_properties.rows_in_compact_header = Math.max(0, g_properties.rows_in_compact_header);
	g_properties.show_rating = g_properties.show_rating && g_component_playcount;
	g_properties.show_playcount = g_properties.show_playcount && g_component_playcount;

	// Grouping data is validated in it's class ctor
})();

/** @enum{number} */
var g_drop_effect = {
	none:   0,
	copy:   1,
	move:   2,
	link:   4,
	scroll: 0x80000000
};

/** @type {Object<string, IGdiFont>} */
var g_pl_fonts = {
	title_normal:   gdi.Font('Segoe Ui', 12),
	title_selected: gdi.Font('Segoe Ui Semibold', 12),
	title_playing:  gdi.Font('Segoe Ui Semibold', 12),

	artist_normal:          gdi.Font('Segoe Ui Semibold', 18),
	artist_playing:         gdi.Font('Segoe Ui Semibold', 18, g_font_style.underline),
	artist_normal_compact:  gdi.Font('Segoe Ui Semibold', 15),
	artist_playing_compact: gdi.Font('Segoe Ui Semibold', 15, g_font_style.underline),

	playcount:      gdi.Font('Segoe Ui', 9),
	album:          gdi.Font('Segoe Ui Semibold', 15),
	date:           gdi.Font('Segoe UI Semibold', 16, g_font_style.bold),
	date_compact:   gdi.Font('Segoe UI Semibold', 15),
	info:           gdi.Font('Segoe Ui', 11),
	cover:          gdi.Font('Segoe Ui Semibold', 11),
	rating_not_set: gdi.Font('Segoe Ui Symbol', 14),
	rating_set:     gdi.Font('Segoe Ui Symbol', 16),

	dummy_text: gdi.Font('Segoe Ui', 16)
};

/** @type {Object<string, number>} */
var g_pl_colors = {};
//---> Common
g_pl_colors.background = g_theme.colors.panel_back;
//---> Playlist Manager
g_pl_colors.playlist_mgr_text_normal = _RGB(150, 152, 154);
g_pl_colors.playlist_mgr_text_hovered = _RGB(200, 202, 204);
g_pl_colors.playlist_mgr_text_pressed = _RGB(120, 122, 124);
//---> Header
g_pl_colors.group_title = _RGB(180, 182, 184);
g_pl_colors.group_title_selected = g_pl_colors.group_title;
g_pl_colors.artist_normal = g_pl_colors.group_title;
g_pl_colors.artist_playing = g_pl_colors.artist_normal;
g_pl_colors.album_normal = _RGB(130, 132, 134);
g_pl_colors.album_playing = g_pl_colors.album_normal;
g_pl_colors.info_normal = _RGB(130, 132, 134);
g_pl_colors.info_playing = g_pl_colors.info_normal;
g_pl_colors.date_normal = _RGB(130, 132, 134);
g_pl_colors.date_playing = g_pl_colors.date_normal;
g_pl_colors.line_normal = g_theme.colors.panel_line;
g_pl_colors.line_playing = g_pl_colors.line_normal;
g_pl_colors.line_selected = g_theme.colors.panel_line_selected;
//---> Row
g_pl_colors.title_selected = _RGB(160, 162, 164);
g_pl_colors.title_playing = _RGB(255, 165, 0);
g_pl_colors.title_normal = g_theme.colors.panel_text_normal;
g_pl_colors.count_normal = _RGB(120, 122, 124);
g_pl_colors.count_selected = g_pl_colors.title_selected;
g_pl_colors.count_playing = g_pl_colors.title_playing;
g_pl_colors.row_selected = _RGB(35, 35, 35);
g_pl_colors.row_alternate = _RGB(35, 35, 35);
g_pl_colors.row_focus_selected = g_theme.colors.panel_line_selected;
g_pl_colors.row_focus_normal = _RGB(80, 80, 80);
g_pl_colors.row_queued = _RGBA(150, 150, 150, 0);
g_pl_colors.row_drop_position = _RGB(140, 142, 144);
g_pl_colors.row_drop_position_boundary = _RGB(255, 165, 0);
//---> Misc
g_pl_colors.dummy_text = _RGB(80, 80, 80);

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var key_down_suppress = new qwr_utils.KeyModifiersSuppress();


// #region Callbacks
function on_paint(gr) {
	trace_call && trace_on_paint && console.log(qwr_utils.function_name());
	playlist.on_paint(gr);
}

function on_size() {
	trace_call && console.log(qwr_utils.function_name());

	var ww = window.Width;
	var wh = window.Height;

	if (ww <= 0 || wh <= 0) {
		// on_paint won't be called with such dimensions anyway
		return;
	}

	playlist.on_size(ww, wh);
}

function on_mouse_move(x, y, m) {
	trace_call && trace_on_move && console.log(qwr_utils.function_name());

	if (mouse_move_suppress.is_supressed(x, y, m)) {
		return;
	}

	playlist.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_dblclk(x, y, m) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_mouse_lbtn_dblclk(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
	trace_call && console.log(qwr_utils.function_name());

	playlist.on_mouse_lbtn_up(x, y, m);
}

function on_mouse_rbtn_down(x, y, m) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_mouse_rbtn_down(x, y, m);
}

function on_mouse_rbtn_up(x, y, m) {
	trace_call && console.log(qwr_utils.function_name());
	return playlist.on_mouse_rbtn_up(x, y, m);
}

function on_mouse_wheel(delta) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_mouse_wheel(delta);
}

function on_mouse_leave() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_mouse_leave();
}

function on_key_down(vkey) {
	trace_call && console.log(qwr_utils.function_name());

	if (key_down_suppress.is_supressed(vkey)) {
		return;
	}

	playlist.on_key_down(vkey);
}

function on_key_up(vkey) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_key_up(vkey);
}

function on_drag_enter(action, x, y, mask) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_drag_enter(action, x, y, mask);
}

function on_drag_leave() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_drag_leave();
}

function on_drag_drop(action, x, y, mask) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_drag_drop(action, x, y, mask);
}

function on_drag_over(action, x, y, mask) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_drag_over(action, x, y, mask);
}

function on_item_focus_change(playlist_arg, from, to) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_item_focus_change(playlist_arg, from, to);
}

function on_playlists_changed() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlists_changed();
}

function on_playlist_switch() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlist_switch();
}

function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
}

function on_playlist_items_added(playlistIndex) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlist_items_added(playlistIndex);
}

function on_playlist_items_reordered(playlistIndex) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlist_items_reordered(playlistIndex);
}

function on_playlist_items_removed(playlistIndex) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlist_items_removed(playlistIndex);
}

function on_playlist_items_selection_change() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playlist_items_selection_change();
}

function on_playback_dynamic_info_track() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playback_dynamic_info_track();
}

function on_playback_new_track(metadb) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playback_new_track(metadb);
}

function on_playback_queue_changed(origin) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playback_queue_changed(origin);
}

function on_playback_stop(reason) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playback_stop(reason);
}

function on_focus(is_focused) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_focus(is_focused);
}

function on_metadb_changed(handles, fromhook) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_metadb_changed(handles, fromhook);
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_get_album_art_done(metadb, art_id, image, image_path);
}

function on_notify_data(name, info) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_notify_data(name, info);
}

// #endregion

/**
 * Playlist + PlaylistManager
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function PlaylistPanel(x, y) {

	// #region Callback Implementation

	this.on_paint = function (gr) {
		if (!is_activated) {
			is_activated = true;

			if (g_properties.show_playlist_info) {
				playlist_info.reinitialize();
			}
			playlist.reinitialize();
		}

		playlist.on_paint(gr);
		if (g_properties.show_playlist_info) {
			gr.FillSolidRect(this.x, playlist_info.y + playlist_info.h, this.w, 2, g_theme.colors.pss_back);
			playlist_info.on_paint(gr);
		}
	};

	this.on_size = function (w, h) {
		this.w = w;
		this.h = h;

		playlist.on_size(w, h - (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0));
		playlist_info.set_w(w);

		is_activated = window.IsVisible;
	};

	this.on_mouse_move = function (x, y, m) {
		playlist.on_mouse_move(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_move(x, y, m);
		}
	};

	this.on_mouse_lbtn_down = function (x, y, m) {
		playlist.on_mouse_lbtn_down(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_lbtn_down(x, y, m);
		}
	};

	this.on_mouse_lbtn_dblclk = function (x, y, m) {
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	};

	this.on_mouse_lbtn_up = function (x, y, m) {
		playlist.on_mouse_lbtn_up(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_lbtn_up(x, y, m);
		}
	};

	this.on_mouse_rbtn_down = function (x, y, m) {
		playlist.on_mouse_rbtn_down(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_rbtn_down(x, y, m);
		}
	};

	this.on_mouse_rbtn_up = function (x, y, m) {
		var was_playlist_info_displayed = g_properties.show_playlist_info;

		if (playlist.trace(x, y)) {
			playlist.on_mouse_rbtn_up(x, y, m);
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_rbtn_up(x, y, m);
		}

		if (was_playlist_info_displayed !== g_properties.show_playlist_info) {
			toggle_playlist_info(g_properties.show_playlist_info);
		}

		return true;
	};

	this.on_mouse_wheel = function (delta) {
		playlist.on_mouse_wheel(delta);
	};

	this.on_mouse_leave = function () {
		playlist.on_mouse_leave();
		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_leave();
		}
	};

	this.on_drag_enter = function (action, x, y, mask) {
		playlist.on_drag_enter(action, x, y, mask);
	};

	this.on_drag_leave = function () {
		playlist.on_drag_leave();
	};

	this.on_drag_over = function (action, x, y, mask) {
		playlist.on_drag_over(action, x, y, mask);
	};

	this.on_drag_drop = function (action, x, y, m) {
		playlist.on_drag_drop(action, x, y, m);
	};

	this.on_key_down = function (vkey) {
		playlist.on_key_down(vkey);

		var modifiers = {
			ctrl:  utils.IsKeyPressed(VK_CONTROL),
			alt:   utils.IsKeyPressed(VK_MENU),
			shift: utils.IsKeyPressed(VK_SHIFT)
		};
		key_handler.invoke_key_action(vkey, modifiers);
	};

	this.on_key_up = function (vkey) {
		playlist.on_key_up(vkey);
	};

	this.on_item_focus_change = function (playlist_idx, from_idx, to_idx) {
		if (!is_activated) {
			return;
		}

		playlist.on_item_focus_change(playlist_idx, from_idx, to_idx);
	};

	this.on_playlists_changed = function () {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlists_changed();
	};

	this.on_playlist_switch = function () {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_switch();
	};

	this.on_playlist_item_ensure_visible = function (playlistIndex, playlistItemIndex) {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	};

	this.on_playlist_items_added = function (playlist_idx) {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_items_added(playlist_idx);
	};

	this.on_playlist_items_reordered = function (playlist_idx) {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_reordered(playlist_idx);
	};

	this.on_playlist_items_removed = function (playlist_idx) {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_items_removed(playlist_idx);
	};

	this.on_playlist_items_selection_change = function () {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_selection_change();
		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
	};

	this.on_playback_dynamic_info_track = function () {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_dynamic_info_track();
	};

	this.on_playback_new_track = function (metadb) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_new_track(metadb);
	};

	this.on_playback_queue_changed = function (origin) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_queue_changed(origin);
	};

	this.on_playback_stop = function (reason) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_stop(reason);
	};

	this.on_focus = function (is_focused) {
		if (!is_activated) {
			return;
		}

		playlist.on_focus(is_focused);
	};

	this.on_metadb_changed = function (handles, fromhook) {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_metadb_changed(handles, fromhook);
	};

	this.on_get_album_art_done = function (metadb, art_id, image, image_path) {
		if (!is_activated) {
			return;
		}

		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	};

	this.on_notify_data = function (name, info) {
		playlist.on_notify_data(name, info);
	};

	// #endregion

	this.initialize = function () {
		playlist.register_key_actions(key_handler);
		playlist_info.register_key_actions(key_handler);

		playlist.initialize_list();
	};

	/**
	 * @param {boolean} show_playlist_info
	 */
	function toggle_playlist_info(show_playlist_info) {
		playlist.y = that.y + (show_playlist_info ? (playlist_info_and_gap_h) : 0);
		var new_playlist_h = show_playlist_info ? (playlist.h - playlist_info_and_gap_h) : (playlist.h + playlist_info_and_gap_h);
		playlist.on_size(playlist.w, new_playlist_h);
		// Easier to repaint everything
		window.Repaint();
	}

	this.x = x;
	this.y = y;
	this.w = 0;
	this.h = 0;

	var that = this;

	/**
	 * @const
	 * @type {number}
	 */
	var playlist_info_h = 24;
	/**
	 * @const
	 * @type {number}
	 */
	var playlist_info_and_gap_h = playlist_info_h + 2;

	var is_activated = window.IsVisible;

	var key_handler = new KeyActionHandler();

	// Panel parts
	var playlist_info = new PlaylistManager(that.x, that.y, 0, playlist_info_h);
	var playlist = new Playlist(that.x, that.y + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0));
}

/**
 * @param {number} x
 * @param {number} y
 * @constructor
 * @extends {List}
 */
function Playlist(x, y) {
	List.call(this, x, y, 0, 0, new PlaylistContent());

	// public:

	// #region Callback Implementation
	this.on_paint = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.items_to_draw.length) {
			_.forEachRight(this.items_to_draw, function (item) {
				item.draw(gr);
			});

			// Hide rows that shouldn't be visible
			gr.FillSolidRect(this.x, this.y, this.w, this.list_y - this.y, g_pl_colors.background);
			gr.FillSolidRect(this.x, this.list_y + this.list_h, this.w, (this.y + this.h) - (this.list_y + this.list_h), g_pl_colors.background);
		}
		else {
			var text;
			if (!plman.PlaylistCount) {
				text = 'Drag some tracks here';
			}
			else {
				text = 'Playlist: ' + plman.GetPlaylistName(cur_playlist_idx) + '\n<--- Empty --->';
			}

			gr.DrawString(text, g_pl_fonts.dummy_text, g_pl_colors.dummy_text, this.x, this.y, this.w, this.h, g_string_format_center.value());
		}

		if (this.is_scrollbar_available) {
			if (!this.scrollbar.is_scrolled_up) {
				gr.FillGradRect(this.list_x, this.list_y - 1, this.list_w, 7 + 1, 270, _RGBtoRGBA(g_theme.colors.panel_back, 0), _RGBtoRGBA(g_theme.colors.panel_back, 200));
			}
			if (!this.scrollbar.is_scrolled_down) {
				gr.FillGradRect(this.list_x, this.list_y + this.list_h - 8, this.list_w, 7 + 1, 90, _RGBtoRGBA(g_theme.colors.panel_back, 0), _RGBtoRGBA(g_theme.colors.panel_back, 200));
			}
		}

		if (this.is_scrollbar_visible) {
			this.scrollbar.paint(gr);
		}
	};

	this.on_size = function (w, h) {
		List.prototype.on_size.apply(this, [w, h]);
		was_on_size_called = true;
	};

	this.on_mouse_move = function (x, y, m) {
		if (List.prototype.on_mouse_move.apply(this, [x, y, m])) {
			return true;
		}

		if (!this.mouse_down) {
			return true;
		}

		if (!selection_handler.is_dragging() && last_hover_item) {
			var drag_diff = Math.sqrt((Math.pow(last_pressed_coord.x - x, 2) + Math.pow(last_pressed_coord.y - y, 2)));
			if (drag_diff >= 7) {
				last_pressed_coord = {
					x: undefined,
					y: undefined
				};
				last_hover_item =
					/** @type {?BaseHeader|?Row} */ this.get_item_under_mouse(x, y);

				selection_handler.perform_internal_drag_n_drop();
			}
		}

		return true;
	};

	this.on_mouse_lbtn_down = function (x, y, m) {
		if (List.prototype.on_mouse_lbtn_down.apply(this, [x, y, m])) {
			return true;
		}

		var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
		var shift_pressed = utils.IsKeyPressed(VK_SHIFT);

		var item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
		last_hover_item = item;
		last_pressed_coord.x = x;
		last_pressed_coord.y = y;

		if (item) {
			if (ctrl_pressed && shift_pressed && _isInstanceOf(item, BaseHeader)) {
				collapse_handler.toggle_collapse(item);
				this.mouse_down = false;
			}
			else if (shift_pressed
				|| (_isInstanceOf(item, Row) && !item.is_selected()
					|| _isInstanceOf(item, BaseHeader) && !item.is_completely_selected())) {
				selection_handler.update_selection(item, ctrl_pressed, shift_pressed);
			}
			else {
				// indicates the need to update selection on on_mouse_lbtn_up
				mouse_on_item = true;
			}
		}
		else {
			selection_handler.clear_selection();
		}

		this.repaint();

		return true;
	};

	this.on_mouse_lbtn_dblclk = function (x, y, m) {
		if (List.prototype.on_mouse_lbtn_dblclk.apply(this, [x, y, m])) {
			return true;
		}

		var item = this.get_item_under_mouse(x, y);
		if (!item) {
			return true;
		}

		if (_isInstanceOf(item, BaseHeader)) {
			plman.ExecutePlaylistDefaultAction(cur_playlist_idx, item.get_first_row().idx);
		}
		else {
			if (g_properties.show_rating && item.rating_trace(x, y)) {
				item.rating_click(x, y);
				item.repaint();
			}
			else {
				plman.ExecutePlaylistDefaultAction(cur_playlist_idx, item.idx);
			}
		}

		return true;
	};

	this.on_mouse_lbtn_up = function (x, y, m) {
		var was_double_clicked = this.mouse_double_clicked;

		if (List.prototype.on_mouse_lbtn_up.apply(this, [x, y, m])) {
			return true;
		}

		last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		if (was_double_clicked) {
			return true;
		}

		last_hover_item = undefined;

		// drag is handled in on_drag_drop
		if (!selection_handler.is_dragging() && mouse_on_item) {
			var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
			var shift_pressed = utils.IsKeyPressed(VK_SHIFT);
			var item = this.get_item_under_mouse(x, y);
			if (item) {
				selection_handler.update_selection(/** @type {Row|BaseHeader} */ item, ctrl_pressed, shift_pressed);
			}
		}

		mouse_on_item = false;
		this.repaint();

		return true;
	};

	this.on_mouse_rbtn_down = function (x, y, m) {
		if (!this.cnt.rows.length) {
			return;
		}

		if (this.is_scrollbar_visible && this.scrollbar.trace(x, y)) {
			return;
		}

		var item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
		if (!item) {
			selection_handler.clear_selection();

		}
		else if (_isInstanceOf(item, Row) && !item.is_selected()
			|| _isInstanceOf(item, BaseHeader) && !item.is_completely_selected()) {
			selection_handler.update_selection(item);
		}

		this.repaint();
	};

	this.on_mouse_rbtn_up = function (x, y, m) {
		if (List.prototype.on_mouse_rbtn_up.apply(this, [x, y, m])) {
			return true;
		}

		var metadb = utils.IsKeyPressed(VK_CONTROL) ? (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()) : fb.GetFocusItem();
		var has_selected_item = selection_handler.has_selected_items();
		var is_cur_playlist_empty = !this.cnt.rows.length;

		var cmm = new Context.MainMenu();

		if (fb.IsPlaying) {
			cmm.append_item(
				'Show now playing',
				function () {
					show_now_playing();
				});
		}

		if (!is_cur_playlist_empty) {
			cmm.append_item(
				'Refresh playlist \tF5',
				_.bind(function () {
					Header.art_cache.clear();
					this.initialize_list();
					scroll_to_focused();
				}, this));

			if (queue_handler && queue_handler.has_items()) {
				cmm.append_item(
					'Flush playback queue \tCtrl+Shift+Q',
					function () {
						queue_handler.flush();
					});
			}
		}

		append_edit_menu_to(cmm);

		if (!is_cur_playlist_empty) {
			if (!cmm.is_empty()) {
				cmm.append_separator();
			}

			if (collapse_handler) {
				append_collapse_menu_to(cmm);
			}

			append_appearance_menu_to(cmm);

			if (g_properties.show_header) {
				Header.grouping_handler.append_menu_to(cmm, _.bind(function () {
					this.initialize_list();
					scroll_to_focused_or_now_playing();
					this.repaint();
				}, this));
			}

			append_sort_menu_to(cmm);

			append_weblinks_menu_to(cmm, metadb);

			if (has_selected_item) {
				append_send_items_menu_to(cmm);
			}
		}
		else {
			// Empty playlist

			if (!cmm.is_empty()) {
				cmm.append_separator();
			}

			var appear = new Context.Menu('Appearance');
			cmm.append(appear);

			appear.append_item(
				'Show playlist info',
				function () {
					g_properties.show_playlist_info = !g_properties.show_playlist_info;
				},
				{is_checked: g_properties.show_playlist_info}
			);

			this.append_scrollbar_visibility_context_menu_to(appear);
		}

		// -------------------------------------------------------------- //
		//---> Context Menu Manager

		if (has_selected_item) {
			if (!cmm.is_empty()) {
				cmm.append_separator();
			}

			var ccmm = new Context.FoobarMenu(plman.GetPlaylistSelectedItems(cur_playlist_idx));
			cmm.append(ccmm);
		}

		// -------------------------------------------------------------- //
		//---> System

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		cmm.execute(x, y);

		this.repaint();
		return true;
	};

	this.on_mouse_leave = function() {
		if (selection_handler.is_internal_drag_n_drop_active()
			&& selection_handler.is_dragging()
			&& !drag_event_invoked) {
			// Workaround for the following issues:
			// #1 if you move too fast out of the panel, then drag_enter is not invoked (thus we need to clear mouse state here).
			// #2 on_mouse_leave sometimes generated during internal drag_over (so we need to ignore it).
			selection_handler.disable_drag();
			drag_event_invoked = false
			this.mouse_in = false;
			this.mouse_down = false;
			this.repaint();
		}
		List.prototype.on_mouse_leave.apply(this);
	}

	this.on_drag_enter = function (action, x, y, mask) {
		this.mouse_in = true;
		this.mouse_down = true;
		drag_event_invoked = true;

		if (!selection_handler.is_dragging()) {
			if (action.IsInternal) {
				selection_handler.enable_drag();
			}
			else {
				selection_handler.enable_external_drag();
			}
		}

		if (!this.trace_list(x, y) || !selection_handler.can_drop()) {
			action.Effect = g_drop_effect.none;
		}
		else {
			// noinspection JSBitwiseOperatorUsage
			action.Effect = (action.Effect & g_drop_effect.move)
				|| (action.Effect & g_drop_effect.copy)
				|| (action.Effect & g_drop_effect.link);
		}
	};

	this.on_drag_leave = function () {
		if (selection_handler.is_dragging()) {
			stop_drag_scroll();
			selection_handler.disable_drag();
		}

		drag_event_invoked = false;
		this.mouse_in = false;
		this.mouse_down = false;

		this.repaint();
	};

	this.on_drag_over = function (action, x, y, mask) {
		if (!selection_handler.can_drop()) {
			action.Effect = g_drop_effect.none;
			return;
		}

		var drop_info = get_drop_row_info(x, y);
		var row = drop_info.row;

		if (drag_scroll_in_progress) {
			if (!row || (y >= (this.list_y + this.row_h * 2) && y <= (this.list_y + this.list_h - this.row_h * 2))) {
				stop_drag_scroll();
			}
		}
		else if (row) {
			if (collapse_handler) {
				collapse_handler.expand(row.parent);
				if (collapse_handler.changed) {
					this.repaint();
				}
			}

			selection_handler.drag(row, drop_info.is_above);

			if (this.is_scrollbar_available) {
				if (y < (this.list_y + this.row_h * 2) && !this.scrollbar.is_scrolled_up) {
					selection_handler.drag(null, false); // To clear last hover row
					start_drag_scroll(-1);
				}
				if (y > (this.list_y + this.list_h - this.row_h * 2) && !this.scrollbar.is_scrolled_down) {
					selection_handler.drag(null, false); // To clear last hover row
					start_drag_scroll(1);
				}
			}
		}

		last_hover_item =
			/** @type {?BaseHeader|?Row} */ this.get_item_under_mouse(x, y);

		if (!this.trace_list(x, y)) {
			action.Effect = g_drop_effect.none;
		}
		else {
			action.Effect = filter_effect_by_modifiers(action.Effect);
		}
	};

	this.on_drag_drop = function (action, x, y, m) {
		this.mouse_down = false; ///< because on_drag_drop suppresses on_mouse_lbtn_up call
		stop_drag_scroll();

		if (!selection_handler.is_dragging() || !this.trace_list(x, y) || !selection_handler.can_drop()) {
			selection_handler.disable_drag();
			action.Effect = g_drop_effect.none;
			return;
		}

		var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);

		if (action.IsInternal) {
			// noinspection JSBitwiseOperatorUsage
			var copy_drop = ctrl_pressed && ((action.Effect & 1) || (action.Effect & 4));
			selection_handler.drop(copy_drop);

			// Suppress native drop, since we've handled it ourselves
			action.Effect = g_drop_effect.none;
		}
		else {
			action.Effect = filter_effect_by_modifiers(action.Effect);
			if (g_drop_effect.none !== action.Effect) {
				selection_handler.external_drop(action);
			}
			else {
				selection_handler.disable_drag();
			}
		}
	};

	this.on_key_down = function (vkey) {
		key_down = true;
	};

	this.on_key_up = function (vkey) {
		key_down = false;
	};

	this.on_item_focus_change = function (playlist_idx, from_idx, to_idx) {
		if (playlist_idx !== cur_playlist_idx || focused_item && focused_item.idx === to_idx) {
			return;
		}

		if (focused_item) {
			focused_item.is_focused = false;
		}

		if (to_idx === -1) {
			focused_item = undefined;
		}
		else if (this.cnt.rows.length) {
			to_idx = Math.min(to_idx, this.cnt.rows.length - 1);
			focused_item = this.cnt.rows[to_idx];
			focused_item.is_focused = true;
		}

		if (focused_item) {
			var from_row = from_idx === -1 ? null : this.cnt.rows[from_idx];
			scroll_to_row(from_row, focused_item);
		}

		this.repaint();
	};

	this.on_playlists_changed = function () {
		if (plman.ActivePlaylist > plman.PlaylistCount
			|| plman.ActivePlaylist === -1) {
			plman.ActivePlaylist = plman.PlaylistCount - 1;
		}

		Header.grouping_handler.on_playlists_changed();
		Header.grouping_handler.set_active_playlist(plman.GetPlaylistName(plman.ActivePlaylist));

		if (plman.ActivePlaylist !== cur_playlist_idx) {
			this.initialize_and_repaint_list();
		}
	};

	this.on_playlist_switch = function () {
		if (cur_playlist_idx !== plman.ActivePlaylist) {
			g_properties.scroll_pos = _.isNil(scroll_pos_list[plman.ActivePlaylist]) ? 0 : scroll_pos_list[plman.ActivePlaylist];
		}

		this.initialize_and_repaint_list();
	};

	this.on_playlist_item_ensure_visible = function (playlist_idx, playlistItemIndex) {
		if (playlist_idx !== cur_playlist_idx) {
			return;
		}

		var row = this.cnt.rows[playlistItemIndex];
		if (!row) {
			return;
		}

		scroll_to_row(null, row);
	};

	this.on_playlist_items_added = function (playlist_idx) {
		if (playlist_idx !== cur_playlist_idx) {
			return;
		}

		this.initialize_and_repaint_list();
	};

	this.on_playlist_items_reordered = function (playlist_idx) {
		if (playlist_idx !== cur_playlist_idx) {
			return;
		}

		this.initialize_and_repaint_list(true);
	};

	this.on_playlist_items_removed = function (playlist_idx) {
		if (playlist_idx !== cur_playlist_idx) {
			return;
		}

		this.initialize_and_repaint_list();
	};

	this.on_playlist_items_selection_change = function () {
		if (!this.mouse_in && !key_down) {
			selection_handler.initialize_selection();
		}
	};

	this.on_playback_dynamic_info_track = function (handles, fromhook) {
		_.forEach(this.cnt.rows, function (item) {
			item.reset_queried_data();
		});

		this.repaint();
	};

	this.on_playback_new_track = function (metadb) {
		if (playing_item) {
			playing_item.is_playing = false;
			playing_item = undefined;
		}

		var playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === cur_playlist_idx) {
			playing_item = this.cnt.rows[playing_item_location.PlaylistItemIndex];
			playing_item.is_playing = true;

			if (fb.CursorFollowPlayback) {
				selection_handler.clear_selection();

				if (collapse_handler && g_properties.auto_colapse) {
					collapse_handler.collapse_all_but_now_playing();
				}
				scroll_to_now_playing();
			}
		}

		this.repaint();
	};

	this.on_playback_queue_changed = function (origin) {
		if (!queue_handler) {
			return;
		}

		queue_handler.initialize_queue();
		this.repaint();
	};

	this.on_playback_stop = function (reason) {
		if (playing_item) {
			playing_item.is_playing = false;
			playing_item.repaint();
		}
	};

	this.on_focus = function (is_focused) {
		if (is_focused) {
			plman.SetActivePlaylistContext();
			this.selection_holder.SetPlaylistSelectionTracking();
		}

		if (focused_item) {
			focused_item.is_focused = is_focused;
			focused_item.repaint();
		}
		is_in_focus = is_focused;
	};

	this.on_metadb_changed = function (handles, fromhook) {
		this.on_playback_dynamic_info_track();
	};

	this.on_get_album_art_done = function (metadb, art_id, image, image_path) {
		if (!image) {
			image = null;
		}

		/** @type {Array<Row|BaseHeader>} */
		var items = this.items_to_draw;
		items.forEach(function (item) {
			if (_isInstanceOf(item, Header)) {
				var header =
					/** @type {Header} */ item;
				if (!header.is_art_loaded() && header.get_first_row().metadb.Compare(metadb)) {
					header.assign_art(image);
					header.repaint();
				}
			}
		});
	};

	this.on_notify_data = function (name, info) {
		if (name === 'sync_group_query_state') {
			if (!window.IsVisible) {
				// Need to reinitialize grouping_handler manually, since most of the callbacks are ignored when panel is hidden
				Header.grouping_handler.on_playlists_changed();
				Header.grouping_handler.set_active_playlist(plman.GetPlaylistName(plman.ActivePlaylist));
				Header.grouping_handler.sync_state(info);
			}
			else {
				Header.grouping_handler.sync_state(info);

				this.initialize_list();
				scroll_to_focused_or_now_playing();
			}
		}
	};
	// #endregion

	/**
	 * @param {KeyActionHandler} key_handler
	 */
	this.register_key_actions = function (key_handler) {
		key_handler.register_key_action(VK_UP,
			_.bind(function (modifiers) {
				if (!this.cnt.rows.length) {
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					if (!selection_handler.has_selected_items()) {
						return;
					}

					selection_handler.move_selection_up();
					return;
				}

				if (!focused_item) {
					var top_item = _.head(this.items_to_draw);
					focused_item = _isInstanceOf(top_item, Row) ? top_item : top_item.get_first_row();
				}

				var visible_item = cnt_helper.is_item_visible(focused_item) ? focused_item : cnt_helper.get_visible_parent(focused_item);
				var new_item = cnt_helper.get_navigateable_neighbour(visible_item, -1);
				if (!new_item) {
					new_item = visible_item;
				}

				selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_DOWN,
			_.bind(function (modifiers) {
				if (!this.cnt.rows.length) {
					// skip repaint
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					if (!selection_handler.has_selected_items()) {
						return;
					}

					selection_handler.move_selection_down();
					return;
				}

				if (!focused_item) {
					var top_item = _.head(this.items_to_draw);
					focused_item = _isInstanceOf(top_item, Row) ? top_item : top_item.get_first_row();
				}

				var visible_item = cnt_helper.is_item_visible(focused_item) ? focused_item : cnt_helper.get_visible_parent(focused_item);
				var new_item = cnt_helper.get_navigateable_neighbour(visible_item, 1);
				if (!new_item) {
					new_item = visible_item;
				}

				selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_LEFT,
			_.bind(function (modifiers) {
				if (!collapse_handler || !this.cnt.rows.length) {
					return;
				}

				if (!focused_item) {
					var top_item = _.head(this.items_to_draw);
					focused_item = _isInstanceOf(top_item, Row) ? top_item : top_item.get_first_row();
				}
				var new_focus = focused_item;

				// Get top uncollapsed header
				var visible_header = cnt_helper.get_visible_parent(focused_item);
				if (visible_header) {
					while (_isInstanceOf(visible_header.parent, BaseHeader) && visible_header.is_collapsed) {
						visible_header = visible_header.parent;
					}

					collapse_handler.collapse(visible_header);
					new_focus = visible_header;
				}

				selection_handler.update_selection(new_focus);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_RIGHT,
			_.bind(function (modifiers) {
				if (!collapse_handler || !this.cnt.rows.length) {
					return;
				}

				if (!focused_item) {
					var top_item = _.head(this.items_to_draw);
					focused_item = _isInstanceOf(top_item, Row) ? top_item : top_item.get_first_row();
				}
				var new_focus = focused_item;

				var visible_header = cnt_helper.get_visible_parent(focused_item);
				var new_focus_item = visible_header.get_first_row();

				collapse_handler.expand(visible_header);
				if (collapse_handler.changed) {
					scroll_to_row(focused_item, new_focus_item);
					new_focus = new_focus_item;
				}

				selection_handler.update_selection(new_focus);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_PRIOR,
			_.bind(function (modifiers) {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!focused_item) {
					var top_item = _.head(this.items_to_draw);
					focused_item = _isInstanceOf(top_item, Row) ? top_item : top_item.get_first_row();
				}

				var new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = _.head(this.items_to_draw);
					if (!cnt_helper.is_item_navigateable(new_focus_item)) {
						new_focus_item = cnt_helper.get_navigateable_neighbour(new_focus_item, 1);
					}
					if (new_focus_item.y < this.list_y && new_focus_item.y + new_focus_item.h > this.list_y) {
						new_focus_item = cnt_helper.get_navigateable_neighbour(new_focus_item, 1);
					}
					if (new_focus_item === focused_item) {
						this.scrollbar.shift_page(-1);

						new_focus_item = _.head(this.items_to_draw);
						if (!cnt_helper.is_item_navigateable(new_focus_item)) {
							new_focus_item = cnt_helper.get_navigateable_neighbour(new_focus_item, 1);
						}
					}
				}
				else {
					new_focus_item = _.head(this.items_to_draw);
				}

				selection_handler.update_selection(new_focus_item, undefined, modifiers.shift);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_NEXT,
			_.bind(function (modifiers) {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!focused_item) {
					focused_item = _.head(this.items_to_draw);
					if (!cnt_helper.is_item_navigateable(focused_item)) {
						focused_item = cnt_helper.get_navigateable_neighbour(focused_item, 1);
					}
				}

				var new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = _.last(this.items_to_draw);
					if (!cnt_helper.is_item_navigateable(new_focus_item)) {
						new_focus_item = cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
					}
					if (new_focus_item.y < this.list_y + this.list_h && new_focus_item.y + new_focus_item.h > this.list_y + this.list_h) {
						new_focus_item = cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
					}
					if (new_focus_item === focused_item) {
						this.scrollbar.shift_page(1);
						new_focus_item = _.last(this.items_to_draw);
						if (!cnt_helper.is_item_navigateable(new_focus_item)) {
							new_focus_item = cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
						}
					}
				}
				else {
					new_focus_item = _.last(this.items_to_draw);
				}

				selection_handler.update_selection(new_focus_item, undefined, modifiers.shift);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_HOME,
			_.bind(function (modifiers) {
				selection_handler.update_selection(_.head(this.cnt.rows), undefined, modifiers.shift);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_END,
			_.bind(function (modifiers) {
				selection_handler.update_selection(_.last(this.cnt.rows), undefined, modifiers.shift);
				this.repaint();
			}, this));

		key_handler.register_key_action(VK_DELETE,
			_.bind(function (modifiers) {
				if (!selection_handler.has_selected_items() && focused_item) {
					selection_handler.update_selection(focused_item);
				}
				plman.UndoBackup(cur_playlist_idx);
				plman.RemovePlaylistSelection(cur_playlist_idx);
			}, this));

		key_handler.register_key_action(VK_KEY_A,
			_.bind(function (modifiers) {
				if (modifiers.ctrl) {
					selection_handler.select_all();
					this.repaint();
				}
			}, this));

		key_handler.register_key_action(VK_KEY_F,
			_.bind(function (modifiers) {
				if (modifiers.ctrl) {
					fb.RunMainMenuCommand('Edit/Search');
				}
				else if (modifiers.shift) {
					fb.RunMainMenuCommand('Library/Search');
				}
			}, this));

		key_handler.register_key_action(VK_RETURN,
			_.bind(function (modifiers) {
				plman.ExecutePlaylistDefaultAction(cur_playlist_idx, focused_item.idx);
			}, this));

		key_handler.register_key_action(VK_KEY_O,
			_.bind(function (modifiers) {
				if (modifiers.shift) {
					fb.RunContextCommandWithMetadb('Open Containing Folder', focused_item.metadb);
				}
			}, this));

		key_handler.register_key_action(VK_KEY_Q,
			_.bind(function (modifiers) {
				if (!queue_handler) {
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					queue_handler.flush();
				}
				else if (selection_handler.selected_items_count() === 1) {
					if (modifiers.ctrl) {
						queue_handler.add_row(focused_item);
					}
					else if (modifiers.shift) {
						queue_handler.remove_row(focused_item);
					}
				}
			}, this));

		key_handler.register_key_action(VK_F5,
			_.bind(function (modifiers) {
				Header.art_cache.clear();
				this.initialize_and_repaint_list(true);
			}, this));

		key_handler.register_key_action(VK_KEY_C,
			_.bind(function (modifiers) {
				if (modifiers.ctrl) {
					selection_handler.copy();
				}
			}, this));

		key_handler.register_key_action(VK_KEY_X,
			_.bind(function (modifiers) {
				if (modifiers.ctrl) {
					selection_handler.cut();
				}
			}, this));

		key_handler.register_key_action(VK_KEY_V,
			_.bind(function (modifiers) {
				if (modifiers.ctrl && !plman.IsPlaylistLocked(cur_playlist_idx)) {
					selection_handler.paste();
				}
			}, this));
	};

	this.initialize_and_repaint_list = function (refocus) {
		this.initialize_list();
		if (refocus) {
			// Needed after drag-drop, because it might cause dropped (i.e. focused) item to be outside of drawn list
			scroll_to_focused();
		}
		this.repaint();
	};

	/**
	 * This method does not contain any redraw calls - it's purely back-end
	 */
	this.initialize_list = function () {
		trace_call && console.log('initialize_list');
		if (trace_initialize_list_performance) {
			var profiler = fb.CreateProfiler();
			var profiler_part = fb.CreateProfiler();
		}

		cur_playlist_idx = plman.ActivePlaylist;

		// Clear contents

		this.cnt.rows = [];
		this.cnt.sub_items = [];

		// Initialize rows

		trace_initialize_list_performance && profiler_part.Reset();

		var rows_metadb = plman.GetPlaylistItems(cur_playlist_idx);
		this.cnt.rows = initialize_rows(rows_metadb);

		trace_initialize_list_performance && console.log('Rows initialized in ' + profiler_part.Time + 'ms');

		playing_item = undefined;
		var playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === cur_playlist_idx) {
			playing_item = this.cnt.rows[playing_item_location.PlaylistItemIndex];
			playing_item.is_playing = true;
		}

		focused_item = undefined;
		var focus_item_idx = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);
		if (focus_item_idx !== -1) {
			focused_item = this.cnt.rows[focus_item_idx];
			focused_item.is_focused = true;
		}

		// Initialize headers

		trace_initialize_list_performance && profiler_part.Reset();

		Header.grouping_handler.set_active_playlist(plman.GetPlaylistName(cur_playlist_idx));
		this.cnt.sub_items = create_headers(this.cnt.rows, rows_metadb);

		trace_initialize_list_performance && console.log('Headers initialized in ' + profiler_part.Time + 'ms');

		if (!was_on_size_called) {
			// First time init

			if (g_properties.show_header) {
				collapse_handler = new CollapseHandler(/** @type {PlaylistContent} */ this.cnt);
				if (g_properties.collapse_on_start) {
					collapse_handler.collapse_all();
				}

				collapse_handler.set_callback(_.bind(function () {
					this.on_list_items_change();
				}, this));
			}
		}
		else {
			// Update list control

			if (collapse_handler) {
				collapse_handler.on_content_change();
			}

			this.on_list_items_change();
		}

		// Initialize other objects

		if (g_properties.show_queue_position) {
			queue_handler = new QueueHandler(this.cnt.rows, cur_playlist_idx);
		}
		selection_handler = new SelectionHandler(/** @type {PlaylistContent} */ this.cnt, cur_playlist_idx);

		trace_initialize_list_performance && console.log('Playlist initialized in ' + profiler.Time + 'ms');
	};

	this.reinitialize = function () {
		if (cur_playlist_idx !== plman.ActivePlaylist) {
			g_properties.scroll_pos = _.isNil(scroll_pos_list[plman.ActivePlaylist]) ? 0 : scroll_pos_list[plman.ActivePlaylist];
		}
		this.initialize_list();
		scroll_to_focused();
	};

	/**
	 * @protected
	 * @override
	 */
	this.on_content_to_draw_change = function () {
		set_rows_boundary_status();
		List.prototype.on_content_to_draw_change.apply(this);
		if (g_properties.show_album_art && !g_properties.use_compact_header) {
			get_album_art(this.items_to_draw);
		}
	};

	/**
	 * @protected
	 * @override
	 */
	this.scrollbar_redraw_callback = function () {
		scroll_pos_list[cur_playlist_idx] = Math.round(this.scrollbar.scroll * 1e2) / 1e2;
		List.prototype.scrollbar_redraw_callback.apply(this);
	};

	//private:

	/**
	 * @param {FbMetadbHandleList} playlist_items
	 * @return {Array<Row>}
	 */
	function initialize_rows(playlist_items) {
		var playlist_items_array = playlist_items.Convert();


		var rows = [];
		_.forEach(playlist_items_array, function (item, i) {
			rows[i] = new Row(that.list_x, 0, that.list_w, that.row_h, item, i, cur_playlist_idx);
			if (!g_properties.show_header) {
				// noinspection JSBitwiseOperatorUsage
				rows[i].is_odd = !(i & 1);
			}
		});

		return rows;
	}

	/**
	 * @param {Array<Row>} rows
	 * @param {FbMetadbHandleList} rows_metadb
	 * @return {Array<Header>}
	 */
	function create_headers(rows, rows_metadb) {
		var prepared_rows = Header.prepare_initialization_data(rows, rows_metadb);
		return Header.create_headers(/** @type {PlaylistContent} */ that.cnt, that.list_x, 0, that.list_w, that.row_h * header_h_in_rows, prepared_rows);
	}

	/**
	 * @type {function(Array<Header>)}
	 */
	var debounced_get_album_art = _.debounce(function (items) {
		_.forEach(items, function (item) {
			if (!_isInstanceOf(item, Header) || item.is_art_loaded()) {
				return;
			}

			var metadb = item.get_first_row().metadb;
			var cached_art = Header.art_cache.get_image_for_meta(metadb);
			if (cached_art) {
				item.assign_art(cached_art);
			}
			else {
				//get_album_art_async_impl(metadb, g_album_art_id.front);
				utils.GetAlbumArtAsync(window.ID, metadb, g_album_art_id.front);
			}
		});
	}, 500, {
		leading:  true,
		trailing: true
	});

	const get_album_art_async_impl = async (metadb, art_id) =>
	{
		let result = await utils.GetAlbumArtAsyncV2(window.ID, metadb, art_id);
		on_get_album_art_done(metadb, art_id, result.image, result.path);
	};

	/**
	 * @param {Array<Header>} items
	 */
	function get_album_art(items) {
		if (!g_properties.show_album_art || g_properties.use_compact_header) {
			return;
		}

		debounced_get_album_art(items);
	}

	function set_rows_boundary_status() {
		var last_row = _.last(that.cnt.rows);
		if (last_row) {
			last_row.is_cropped = that.is_scrollbar_available ? that.scrollbar.is_scrolled_down : false;
		}
	}

	// #region Context Menu

	/**
	 * @param {Context.Menu} parent_menu
	 */
	function append_edit_menu_to(parent_menu) {
		var has_selected_item = selection_handler.has_selected_items();
		var is_playlist_locked = plman.IsPlaylistLocked(cur_playlist_idx);
		// Check only for data presence, since parsing it's contents might take a while
		var has_data_in_clipboard = fb.CheckClipboardContents(window.ID);

		if (has_selected_item || has_data_in_clipboard) {
			if (!parent_menu.is_empty()) {
				parent_menu.append_separator();
			}

			if (has_selected_item) {
				parent_menu.append_item(
					'Cut',
					function () {
						selection_handler.cut();
					},
					{is_grayed_out: !has_selected_item}
				);

				parent_menu.append_item(
					'Copy',
					function () {
						selection_handler.copy();
					},
					{is_grayed_out: !has_selected_item}
				);
			}

			if (has_data_in_clipboard) {
				parent_menu.append_item(
					'Paste',
					function () {
						selection_handler.paste();
					},
					{is_grayed_out: !has_data_in_clipboard || is_playlist_locked}
				);
			}
		}

		if (has_selected_item) {
			if (!parent_menu.is_empty()) {
				parent_menu.append_separator();
			}

			parent_menu.append_item(
				'Remove',
				function () {
					plman.RemovePlaylistSelection(cur_playlist_idx);
				},
				{is_grayed_out: is_playlist_locked}
			);
		}
	}

	/**
	 * @param {Context.Menu} parent_menu
	 */
	function append_collapse_menu_to(parent_menu) {
		var ce = new Context.Menu('Collapse/Expand');
		parent_menu.append(ce);

		ce.append_item(
			'Collapse all',
			function () {
				collapse_handler.collapse_all();
				if (collapse_handler.changed) {
					scroll_to_focused_or_now_playing();
				}
			}
		);

		if (plman.ActivePlaylist === plman.PlayingPlaylist) {
			ce.append_item(
				'Collapse all but now playing',
				function () {
					collapse_handler.collapse_all_but_now_playing();
					if (collapse_handler.changed) {
						scroll_to_now_playing_or_focused();
					}
				}
			);
		}

		ce.append_item(
			'Expand all',
			function () {
				collapse_handler.expand_all();
				if (collapse_handler.changed) {
					scroll_to_focused_or_now_playing();
				}
			});

		ce.append_separator();

		ce.append_item(
			'Auto',
			function () {
				g_properties.auto_colapse = !g_properties.auto_colapse;
				if (g_properties.auto_colapse) {
					collapse_handler.collapse_all_but_now_playing();
					if (collapse_handler.changed) {
						scroll_to_now_playing_or_focused();
					}
				}
			},
			{is_checked: g_properties.auto_colapse}
		);

		ce.append_item(
			'Collapse on start',
			function () {
				g_properties.collapse_on_start = !g_properties.collapse_on_start;
			},
			{is_checked: g_properties.collapse_on_start}
		);

		ce.append_item(
			'Collapse on playlist switch',
			function () {
				g_properties.collapse_on_playlist_switch = !g_properties.collapse_on_playlist_switch;
			},
			{is_checked: g_properties.collapse_on_playlist_switch}
		);
	}

	/**
	 * @param {Context.Menu} parent_menu
	 */
	function append_appearance_menu_to(parent_menu) {
		var appear = new Context.Menu('Appearance');
		parent_menu.append(appear);

		PlaylistManager.append_playlist_info_visibility_context_menu_to(appear);

		that.append_scrollbar_visibility_context_menu_to(appear);

		appear.append_item(
			'Show group header',
			_.bind(function () {
				g_properties.show_header = !g_properties.show_header;
				if (g_properties.show_header) {
					collapse_handler = new CollapseHandler(/** @type {PlaylistContent} */ this.cnt);
					collapse_handler.expand_all();
					collapse_handler.set_callback(_.bind(function () {
						this.on_list_items_change();
					}, that));
				}
				else {
					collapse_handler.expand_all();
					collapse_handler = null;
				}

				this.initialize_list();
				scroll_to_focused_or_now_playing();
			}, that),
			{is_checked: g_properties.show_header}
		);

		if (g_properties.show_header) {
			var appear_header = new Context.Menu('Headers');
			appear.append(appear_header);

			appear_header.append_item(
				'Use compact group header',
				_.bind(function () {
					g_properties.use_compact_header = !g_properties.use_compact_header;
					header_h_in_rows = g_properties.use_compact_header ? g_properties.rows_in_compact_header : g_properties.rows_in_header;
					this.initialize_list();
					scroll_to_focused_or_now_playing();
				}, that),
				{is_checked: g_properties.use_compact_header}
			);

			appear_header.append_item(
				'Show disc sub-header',
				_.bind(function () {
					g_properties.show_disc_header = !g_properties.show_disc_header;
					this.initialize_list();
					scroll_to_focused_or_now_playing();
				}, that),
				{is_checked: g_properties.show_disc_header}
			);

			appear_header.append_item(
				'Show original release date',
				function () {
					g_properties.show_original_date = !g_properties.show_original_date;
				},
				{is_checked: g_properties.show_original_date}
			);

			if (!g_properties.use_compact_header) {
				appear_header.append_item(
					'Show group info',
					function () {
						g_properties.show_group_info = !g_properties.show_group_info;
					},
					{is_checked: g_properties.show_group_info}
				);

				var art = new Context.Menu('Album art');
				appear_header.append(art);

				art.append_item(
					'Show',
					_.bind(function () {
						g_properties.show_album_art = !g_properties.show_album_art;
						if (g_properties.show_album_art) {
							get_album_art(this.items_to_draw);
						}
					}, that),
					{is_checked: g_properties.show_album_art}
				);

				art.append_item(
					'Auto',
					_.bind(function () {
						g_properties.auto_album_art = !g_properties.auto_album_art;
						if (g_properties.show_album_art) {
							get_album_art(this.items_to_draw);
						}
					}, that),
					{
						is_checked:    g_properties.auto_album_art,
						is_grayed_out: !g_properties.show_album_art
					}
				);
			}
		}

		var appear_row = new Context.Menu('Rows');
		appear.append(appear_row);

		appear_row.append_item(
			'Alternate row color',
			function () {
				g_properties.alternate_row_color = !g_properties.alternate_row_color;
			},
			{is_checked: g_properties.alternate_row_color}
		);

		appear_row.append_item(
			'Show focus item',
			function () {
				g_properties.show_focused_row = !g_properties.show_focused_row;
			},
			{is_checked: g_properties.show_focused_row}
		);

		appear_row.append_item(
			'Show play count',
			function () {
				g_properties.show_playcount = !g_properties.show_playcount;
			},
			{
				is_checked:    g_properties.show_playcount,
				is_grayed_out: !g_component_playcount
			}
		);

		appear_row.append_item(
			'Show queue position',
			_.bind(function () {
				g_properties.show_queue_position = !g_properties.show_queue_position;
				queue_handler = g_properties.show_queue_position ? new QueueHandler(this.cnt.rows, cur_playlist_idx) : undefined;
			}, that),
			{is_checked: g_properties.show_queue_position}
		);

		appear_row.append_item(
			'Show rating',
			function () {
				g_properties.show_rating = !g_properties.show_rating;
			},
			{
				is_checked:    g_properties.show_rating,
				is_grayed_out: !g_component_playcount
			}
		);
	}

	/**
	 * @param {Context.Menu} parent_menu
	 */
	function append_sort_menu_to(parent_menu) {
		var has_multiple_selected_items = selection_handler.selected_items_count() > 1;
		var is_auto_playlist = plman.IsAutoPlaylist(cur_playlist_idx);

		var sort = new Context.Menu(
			has_multiple_selected_items ? 'Sort selection' : 'Sort',
			{is_grayed_out: is_auto_playlist}
		);
		parent_menu.append(sort);

		sort.append_item(
			'by...',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by...');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Sort by...');
				}
			}
		);

		sort.append_item(
			'by album',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by album');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Sort by album');
				}
			}
		);

		sort.append_item(
			'by artist',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by artist');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Sort by artist');
				}
			}
		);

		sort.append_item(
			'by file path',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by file path');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Sort by file path');
				}
			}
		);

		sort.append_item(
			'by title',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by title');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Sort by title');
				}
			}
		);

		sort.append_item(
			'by track number',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by track number');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Sort by track number');
				}
			}
		);

		sort.append_item(
			'by date',
			function () {
				plman.UndoBackup(cur_playlist_idx);
				plman.SortByFormat(cur_playlist_idx, '%date%', has_multiple_selected_items);
			}
		);

		sort.append_separator();

		sort.append_item(
			'Randomize',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Randomize');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Randomize')
				}
			}
		);

		sort.append_item(
			'Reverse',
			function () {
				if (has_multiple_selected_items) {
					fb.RunMainMenuCommand('Edit/Selection/Sort/Reverse');
				}
				else {
					fb.RunMainMenuCommand('Edit/Sort/Reverse')
				}
			}
		);
	}

	/**
	 * @param {Context.Menu} parent_menu
	 * @param {FbMetadbHandle} metadb
	 */
	function append_weblinks_menu_to(parent_menu, metadb) {
		var web = new Context.Menu('Weblinks');
		parent_menu.append(web);

		var web_links = [
			['Google', 'google'],
			['Google Images', 'googleImages'],
			['Wikipedia', 'wikipedia'],
			['YouTube', 'youTube'],
			['Last FM', 'lastFM'],
			['Discogs', 'discogs']
		];

		web_links.forEach(function (item) {
			web.append_item(
				item[0],
				function (url) {
					qwr_utils.link(url, metadb);
				}.bind(null, item[1])
			);
		});
	}

	/**
	 * @param {Context.Menu} parent_menu
	 */
	function append_send_items_menu_to(parent_menu) {
		var playlist_count = plman.PlaylistCount;

		var send = new Context.Menu('Send selection');
		parent_menu.append(send);

		send.append_item(
			'To top',
			function () {
				plman.UndoBackup(cur_playlist_idx);
				plman.MovePlaylistSelection(cur_playlist_idx, -plman.GetPlaylistFocusItemIndex(cur_playlist_idx));
			}
		);

		send.append_item(
			'To bottom',
			function () {
				plman.UndoBackup(cur_playlist_idx);
				plman.MovePlaylistSelection(cur_playlist_idx, plman.PlaylistItemCount(cur_playlist_idx) - plman.GetPlaylistSelectedItems(cur_playlist_idx).Count);
			}
		);

		send.append_separator();

		send.append_item(
			'Create New Playlist \tCtrl+N',
			function () {
				plman.CreatePlaylist(playlist_count, '');
				plman.InsertPlaylistItems(playlist_count, 0, plman.GetPlaylistSelectedItems(cur_playlist_idx), true);
			}
		);

		send.append_separator();

		for (var i = 0; i < playlist_count; ++i) {
			var playlist_text = plman.GetPlaylistName(i) + ' [' + plman.PlaylistItemCount(i) + ']';

			var is_item_autoplaylist = plman.IsAutoPlaylist(i);
			if (is_item_autoplaylist) {
				playlist_text += ' (Auto)';
			}

			if (i === plman.PlayingPlaylist) {
				playlist_text += ' (Now Playing)';
			}

			send.append_item(
				playlist_text,
				function (playlist_idx) {
					selection_handler.send_to_playlist(playlist_idx);
				}.bind(null, i),
				{is_grayed_out: is_item_autoplaylist || i === cur_playlist_idx}
			);
		}
	}

	// #endregion

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {{row: ?Row, is_above: ?boolean}}
	 */
	function get_drop_row_info(x, y) {
		var drop_info = {
			row:      undefined,
			is_above: undefined
		};

		var item = that.get_item_under_mouse(x, y);
		if (!item) {
			if (!that.trace_list(x, y) || !that.cnt.rows.length) {
				return drop_info;
			}

			item = _.last(that.cnt.rows);
		}

		var is_above = y < (item.y + item.h / 2);

		if (_isInstanceOf(item, BaseHeader)) {
			var first_row_in_header = item.get_first_row();

			if (is_above) {
				if (first_row_in_header === _.head(that.cnt.rows)) {
					drop_info.row = first_row_in_header;
					drop_info.is_above = true;
				}
				else {
					drop_info.row = that.cnt.rows[first_row_in_header.idx - 1];
					drop_info.is_above = false;
				}
			}
			else {
				drop_info.row = first_row_in_header;
				drop_info.is_above = true;
			}
		}
		else {
			if (is_above) {
				drop_info.row = item;
				drop_info.is_above = true;
			}
			else {
				if (g_properties.show_header && item.idx === _.last(item.parent.sub_items).idx
					|| item === _.last(that.cnt.rows)) {
					drop_info.row = item;
					drop_info.is_above = false;
				}
				else {
					drop_info.row = that.cnt.rows[item.idx + 1];
					drop_info.is_above = true;
				}
			}
		}

		return drop_info;
	}

	// #region 'Scroll to' Methods
	function show_now_playing() {
		var playing_item_location = plman.GetPlayingItemLocation();
		if (!playing_item_location.IsValid) {
			return;
		}

		if (playing_item_location.PlaylistIndex !== cur_playlist_idx) {
			plman.ActivePlaylist = playing_item_location.PlaylistIndex;
			that.initialize_list();
		}
		else if (collapse_handler) {
			collapse_handler.expand(playing_item.parent);
		}

		selection_handler.update_selection(that.cnt.rows[playing_item_location.PlaylistItemIndex]);

		scroll_to_now_playing();
	}

	function scroll_to_now_playing_or_focused() {
		if (playing_item) {
			scroll_to_row(null, playing_item);
		}
		else if (focused_item) {
			scroll_to_row(null, focused_item);
		}
	}

	function scroll_to_focused_or_now_playing() {
		if (focused_item) {
			scroll_to_row(null, focused_item);
		}
		else if (fb.CursorFollowPlayback && playing_item) {
			scroll_to_row(null, playing_item);
		}
	}

	function scroll_to_focused() {
		if (focused_item) {
			scroll_to_row(null, focused_item);
		}
	}

	function scroll_to_now_playing() {
		if (playing_item) {
			scroll_to_row(null, playing_item);
		}
	}

	/**
	 * @param {?Row} from_row
	 * @param {Row} to_row
	 */
	function scroll_to_row(from_row, to_row) {
		if (!that.is_scrollbar_available) {
			return;
		}

		var has_headers = g_properties.show_header;

		var visible_to_item = cnt_helper.is_item_visible(to_row) ? to_row : cnt_helper.get_visible_parent(to_row);
		var to_item_state = get_item_visibility_state(visible_to_item);

		var shifted_successfully = false;
		switch (to_item_state.visibility) {
			case visibility_state.none: {
				if (!from_row) {
					break;
				}

				var visible_from_item = cnt_helper.is_item_visible(from_row) ? from_row : cnt_helper.get_visible_parent(from_row);

				var from_item_state = get_item_visibility_state(visible_from_item);
				if (from_item_state.visibility === visibility_state.none) {
					break;
				}

				var direction = (to_row.idx - from_row.idx) > 0 ? 1 : -1;
				var scroll_shift = 0;
				var neighbour_item = visible_from_item;
				do {
					var neighbour_item_state = get_item_visibility_state(neighbour_item);
					scroll_shift += neighbour_item_state.invisible_part;
					neighbour_item = direction > 0 ? cnt_helper.get_next_visible_item(neighbour_item) : cnt_helper.get_prev_visible_item(neighbour_item);
				} while (neighbour_item && !cnt_helper.is_item_navigateable(neighbour_item));

				assert(!_.isNil(neighbour_item),
					LogicError, 'Failed to get navigateable neighbour');

				if (visible_to_item !== neighbour_item) {
					// I.e. to_item and from_item are not neighbours
					break;
				}

				scroll_shift += visible_to_item.h / that.row_h;

				that.scrollbar.scroll_to(g_properties.scroll_pos + direction * scroll_shift);
				shifted_successfully = true;

				break;
			}
			case visibility_state.partial_top: {
				if (to_item_state.invisible_part % 1 > 0) {
					that.scrollbar.shift_line(-1);
				}
				that.scrollbar.scroll_to(g_properties.scroll_pos - Math.floor(to_item_state.invisible_part));
				shifted_successfully = true;
				break;
			}
			case visibility_state.partial_bottom: {
				if (to_item_state.invisible_part % 1 > 0) {
					that.scrollbar.shift_line(1);
				}
				that.scrollbar.scroll_to(g_properties.scroll_pos + Math.floor(to_item_state.invisible_part));
				shifted_successfully = true;
				break;
			}
			case visibility_state.full: {
				shifted_successfully = true;
				break;
			}
			default: {
				throw ArgumentError('visibility_state', to_item_state.visibility);
			}
		}

		if (shifted_successfully) {
			if (has_headers) {
				var scroll_shift = 0;
				var top_item = visible_to_item;
				while (top_item.parent && _isInstanceOf(top_item.parent, BaseHeader) && top_item === _.head(top_item.parent.sub_items)) {
					top_item = top_item.parent;
					var header_state = get_item_visibility_state(top_item);
					scroll_shift += header_state.invisible_part;
				}
				that.scrollbar.scroll_to(g_properties.scroll_pos - scroll_shift);
			}
		}
		else {
			var item_draw_idx = get_item_draw_row_idx(visible_to_item);
			var new_scroll_pos = Math.max(0, item_draw_idx - Math.floor(that.rows_to_draw_precise / 2));
			that.scrollbar.scroll_to(new_scroll_pos);
		}
	}

	/**
	 * @enum {number}
	 */
	var visibility_state = {
		none:           0,
		partial_top:    1,
		partial_bottom: 2,
		full:           3
	};

	/**
	 * @param {Row|BaseHeader} item_to_check
	 * @return {{visibility: visibility_state, invisible_part: number}}
	 */
	function get_item_visibility_state(item_to_check) {
		var item_state = {
			visibility:     visibility_state.none,
			invisible_part: item_to_check.h / that.row_h
		};

		_.forEach(that.items_to_draw, function (item) {
			if (item === item_to_check) {
				if (item.y < that.list_y && item.y + item.h > that.list_y) {
					item_state.visibility = visibility_state.partial_top;
					item_state.invisible_part = (that.list_y - item.y) / that.row_h;
				}
				else if (item.y < that.list_y + that.list_h && item.y + item.h > that.list_y + that.list_h) {
					item_state.visibility = visibility_state.partial_bottom;
					item_state.invisible_part = ((item.y + item.h) - (that.list_y + that.list_h)) / that.row_h;
				}
				else {
					item_state.visibility = visibility_state.full;
					item_state.invisible_part = 0;
				}
				return false;
			}
		});

		return item_state;
	}

	/**
	 * Note: at worst has O(playlist_size) complexity
	 *
	 * @param {Row|BaseHeader} target_item
	 * @return {number}
	 */
	function get_item_draw_row_idx(target_item) {
		var cur_row = 0;
		var is_target_row = _isInstanceOf(target_item, Row);

		function iterate_level(sub_items, target_item) {
			if (_isInstanceOf(_.head(sub_items), BaseHeader)) {
				var header_h_in_rows = Math.round(_.head(sub_items).h / that.row_h);

				for (var i = 0; i < sub_items.length; ++i) {
					var header = sub_items[i];
					if (header === target_item) {
						return true;
					}

					cur_row += header_h_in_rows;

					if (header.is_collapsed) {
						continue;
					}

					if (iterate_level(header.sub_items, target_item)) {
						return true;
					}
				}
			}
			else { // Row
				if (is_target_row) {
					for (var j = 0; j < sub_items.length; ++j) {
						if (target_item === sub_items[j]) {
							return true;
						}

						++cur_row;
					}
				}
				else {
					cur_row += sub_items.length;
				}
			}

			return false;
		}

		if (!iterate_level(g_properties.show_header ? that.cnt.sub_items : that.cnt.rows, target_item)) {
			throw LogicError('Could not find item in drawn item list');
		}

		return cur_row;
	}

	// #endregion

	/**
	 * @param {number} direction -1 for upward direction, 1 - for downward
	 */
	function start_drag_scroll(direction) {
		if (drag_scroll_timeout_timer) {
			return;
		}

		drag_scroll_timeout_timer = setTimeout(function () {
			if (drag_scroll_repeat_timer) {
				return;
			}

			drag_scroll_repeat_timer = setInterval(function () {
				if (!that.scrollbar.in_sbar && !selection_handler.is_dragging() || !drag_scroll_timeout_timer) {
					return;
				}

				drag_scroll_in_progress = true;

				var cur_marked_item;
				if (direction < 0) {
					that.scrollbar.shift_line(-1);

					cur_marked_item = _.head(that.items_to_draw);
					if (_isInstanceOf(cur_marked_item, BaseHeader)) {
						collapse_handler.expand(cur_marked_item);
						if (collapse_handler.changed) {
							that.scrollbar.scroll_to(g_properties.scroll_pos + cur_marked_item.get_sub_items_total_h_in_rows());
						}

						cur_marked_item = cur_marked_item.get_first_row();
					}

					selection_handler.drag(cur_marked_item, true);
					cur_marked_item.is_drop_boundary_reached = true;
				}
				else if (direction > 0) {
					that.scrollbar.shift_line(1);

					cur_marked_item = _.last(that.items_to_draw);
					if (_isInstanceOf(cur_marked_item, BaseHeader)) {
						collapse_handler.expand(cur_marked_item);
						if (collapse_handler.changed) {
							that.repaint();
						}

						cur_marked_item = that.cnt.rows[cur_marked_item.get_first_row().idx - 1];
					}

					selection_handler.drag(cur_marked_item, false);
					cur_marked_item.is_drop_boundary_reached = true;
				}
				else {
					throw ArgumentError('drag_scroll direction', direction);
				}

				if (that.scrollbar.is_scrolled_down || that.scrollbar.is_scrolled_up) {
					stop_drag_scroll();
				}
			}, 50);
		}, 350);
	}

	function stop_drag_scroll() {
		if (drag_scroll_repeat_timer) {
			clearInterval(drag_scroll_repeat_timer);
		}
		if (drag_scroll_timeout_timer) {
			clearTimeout(drag_scroll_timeout_timer);
		}

		drag_scroll_timeout_timer = undefined;
		drag_scroll_repeat_timer = undefined;

		drag_scroll_in_progress = false;
	}

	/**
	 * @param {number} effect
	 * @return {number}
	 */
	function filter_effect_by_modifiers(effect) {
		var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
		var shift_pressed = utils.IsKeyPressed(VK_SHIFT);
		var alt_pressed = utils.IsKeyPressed(VK_MENU);

		if (ctrl_pressed && shift_pressed && !alt_pressed
			|| alt_pressed && !ctrl_pressed && !shift_pressed) {
			// Link only
			return (effect & g_drop_effect.link);
		}

		if (ctrl_pressed && !shift_pressed && !alt_pressed) {
			// Copy (also via link)
			// noinspection JSBitwiseOperatorUsage
			return (effect & g_drop_effect.copy) || (effect & g_drop_effect.link);
		}

		if (shift_pressed) {
			// Move only
			return (effect & g_drop_effect.move);
		}

		// Move > Copy > Link
		// noinspection JSBitwiseOperatorUsage
		return (effect & g_drop_effect.move) || (effect & g_drop_effect.copy) || (effect & g_drop_effect.link);
	}

	// private:
	var that = this;

	// Constants
	/** @type {number} */
	var header_h_in_rows = g_properties.use_compact_header ? g_properties.rows_in_compact_header : g_properties.rows_in_header;

	// Window state
	var was_on_size_called = false;

	var is_in_focus = false;

	// Playback state
	/** @type {number} */
	var cur_playlist_idx = -1;
	/** @type {?Row} */
	var playing_item = undefined;
	/** @type {?Row} */
	var focused_item = undefined;

	// Mouse and key state
	var mouse_on_item = false;
	var key_down = false;
	var drag_event_invoked = false;

	// Item events
	/** @type {?Row|?BaseHeader} */
	var last_hover_item = undefined;
	/** @type  {{x: ?number, y: ?number}} */
	var last_pressed_coord = {
		x: undefined,
		y: undefined
	};

	// Timers
	var drag_scroll_in_progress = false;
	var drag_scroll_timeout_timer;
	var drag_scroll_repeat_timer;

	// Scrollbar props
	/** @type {Array<number>} float */
	var scroll_pos_list = [];

	// Objects
	/** @type {?SelectionHandler} */
	var selection_handler = undefined;
	/** @type {?QueueHandler} */
	var queue_handler = undefined;
	/** @type {?CollapseHandler} */
	var collapse_handler = undefined;
	/**
	 * @const
	 * @type {ContentNavigationHelper}
	 */
	var cnt_helper = this.cnt.helper;

	// Workaround for bug: PlayingPlaylist is equal to -1 on startup
	if (plman.PlayingPlaylist === -1) {
		plman.PlayingPlaylist = plman.ActivePlaylist;
	}

	plman.SetActivePlaylistContext();
	this.selection_holder = fb.AcquireUiSelectionHolder();
	this.selection_holder.SetPlaylistSelectionTracking();
}

Playlist.prototype = Object.create(List.prototype);
Playlist.prototype.constructor = Playlist;


/**
 * @final
 * @constructor
 * @extends {List.RowContent}
 */
let PlaylistContent = function () {
	List.RowContent.call(this);

	/** @override */
	this.generate_items_to_draw = function (wy, wh, row_shift, pixel_shift, row_h) {
		if (!this.rows.length) {
			return [];
		}

		if (!g_properties.show_header) {
			return List.RowContent.prototype.generate_items_to_draw.apply(this, [wy, wh, row_shift, pixel_shift, row_h]);
		}

		var first_item = generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h);
		return generate_all_items_to_draw(wy, wh, first_item);
	};

	/** @override */
	this.update_items_w_size = function (w) {
		if (!g_properties.show_header) {
			List.RowContent.prototype.update_items_w_size.apply(this, [w]);
			return;
		}

		_.forEach(this.sub_items, function (item) {
			item.set_w(w);
		});
	};

	/** @override */
	this.calculate_total_h_in_rows = function () {
		if (!g_properties.show_header) {
			return List.RowContent.prototype.calculate_total_h_in_rows.apply(this);
		}

		if (!this.sub_items.length) {
			return 0;
		}

		var total_height_in_rows = Math.round(_.head(this.sub_items).h / g_properties.row_h) * this.sub_items.length;
		_.forEach(this.sub_items, function (item) {
			if (!item.is_collapsed) {
				total_height_in_rows += item.get_sub_items_total_h_in_rows();
			}
		});

		return total_height_in_rows;
	};

	/**
	 * @param {number} wy
	 * @param {number} wh
	 * @param {number} row_shift
	 * @param {number} pixel_shift
	 * @param {number} row_h
	 * @return {Row|BaseHeader}
	 */
	function generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		var start_y = wy + pixel_shift;
		var cur_row = 0;

		/**
		 * Searches sub_items for first visible item {@link ContentNavigationHelper.is_item_visible}
		 *
		 * @param {Array<BaseHeader>|Array<Row>} sub_items
		 * @return {?BaseHeader|?Row}
		 */
		function iterate_level(sub_items) {
			if (_isInstanceOf(_.head(sub_items), BaseHeader)) {
				var header_h_in_rows = Math.round(_.head(sub_items).h / row_h);

				for (var i = 0; i < sub_items.length; ++i) {
					var header = sub_items[i];
					if (cur_row + header_h_in_rows - 1 >= row_shift) {
						header.set_y(start_y + (cur_row - row_shift) * row_h);
						return header;
					}

					cur_row += header_h_in_rows;

					if (header.is_collapsed) {
						continue;
					}

					var result = iterate_level(header.sub_items);
					if (result) {
						return result;
					}
				}
			}
			else { // Row
				if (cur_row + sub_items.length - 1 >= row_shift) {
					var row_start_idx = (cur_row > row_shift) ? 0 : row_shift - cur_row;
					cur_row += row_start_idx;

					var row = sub_items[row_start_idx];
					row.set_y(start_y + (cur_row - row_shift) * row_h);

					return row;
				}

				cur_row += sub_items.length;
			}

			return null;
		}

		var first_item = iterate_level(that.sub_items);
		assert(!_.isNil(first_item),
			LogicError, 'first_item_to_draw can\'t be null!');

		return first_item;
	}

	/**
	 * @param {number} wy
	 * @param {number} wh
	 * @param {Row|BaseHeader} first_item
	 * @return {Array<Row|BaseHeader>}
	 */
	function generate_all_items_to_draw(wy, wh, first_item) {
		var items_to_draw = [first_item];
		var cur_y = first_item.y + first_item.h;

		/**
		 *
		 * @param {Array<BaseHeader>|Array<Row>} sub_items
		 * @param {Row|BaseHeader} start_item
		 * @return {boolean} true, if start_item was used
		 */
		function iterate_level(sub_items, start_item) {
			var is_cur_level_header = _isInstanceOf(_.head(sub_items), BaseHeader);
			var start_item_used = !start_item;

			var leveled_start_item = start_item;
			while (leveled_start_item && leveled_start_item.parent !== _.head(sub_items).parent) {
				leveled_start_item = leveled_start_item.parent;
			}

			var start_idx = 0;
			if (leveled_start_item) {
				start_idx = _isInstanceOf(leveled_start_item, Row) ? leveled_start_item.idx_in_header : leveled_start_item.idx;
			}

			for (var i = start_idx; i < sub_items.length; ++i) {
				var item = sub_items[i];
				if (start_item_used) {
					item.set_y(cur_y);

					items_to_draw.push(item);
					cur_y += item.h;
				}
				if (!start_item_used && item === start_item) {
					start_item_used = true;
				}

				if (cur_y >= wy + wh) {
					break;
				}

				if (is_cur_level_header) {
					if (item.is_collapsed) {
						continue;
					}

					if (iterate_level(item.sub_items, start_item_used ? null : start_item)) {
						start_item_used = true;
					}

					if (cur_y >= wy + wh) {
						break;
					}
				}
			}

			return start_item_used;
		}

		iterate_level(that.sub_items, first_item);

		return items_to_draw;
	}

	/**
	 * It is assumed that every sub_items array contains only items of the same single type
	 *
	 * @type {Array<Header>}
	 */
	this.sub_items = [];

	this.helper = new ContentNavigationHelper(this);

	var that = this;
};
PlaylistContent.prototype = Object.create(List.RowContent.prototype);
PlaylistContent.prototype.constructor = PlaylistContent;

function ContentNavigationHelper(cnt_arg) {
	/**
	 * @param {Row|BaseHeader} item
	 * @return {?BaseHeader}
	 */
	this.get_visible_parent = function (item) {
		if (!item.parent || !_isInstanceOf(item.parent, BaseHeader)) {
			return null;
		}

		var cur_item = item;
		do {
			cur_item = cur_item.parent;
		} while (cur_item.parent && cur_item.parent.is_collapsed);

		return cur_item;
	};

	/**
	 * Returns true if item is not hidden by collapsed parent
	 *
	 * @param {Row|BaseHeader} item
	 * @return {boolean}
	 */
	this.is_item_visible = function (item) {
		if (item.parent && _isInstanceOf(item.parent, BaseHeader)) {
			return !item.parent.is_collapsed;
		}

		return true;
	};

	/**
	 * Returns true if item can be selected by arrow keys
	 *
	 * @param {Row|BaseHeader} item
	 * @return {boolean}
	 */
	this.is_item_navigateable = function (item) {
		return _isInstanceOf(item, Row) ? true : item.is_collapsed;
	};

	/**
	 * {@link ContentNavigationHelper.is_item_navigateable}
	 *
	 * @param {Row|BaseHeader} item
	 * @param {number} direction
	 * @return {Row|BaseHeader|null}
	 */
	this.get_navigateable_neighbour = function (item, direction) {
		var neighbour_item = item;
		do {
			neighbour_item = this.get_visible_neighbour(neighbour_item, direction);
		} while (neighbour_item && !this.is_item_navigateable(neighbour_item));

		return neighbour_item;
	};

	/**
	 * {@link ContentNavigationHelper.is_item_visible}
	 *
	 * @param {Row|BaseHeader} item
	 * @param {number} direction
	 * @return {Row|BaseHeader|null}
	 */
	this.get_visible_neighbour = function (item, direction) {
		return direction > 0 ? this.get_next_visible_item(item) : this.get_prev_visible_item(item);
	};

	/**
	 * @param {Row|BaseHeader} item
	 * @return {Row|BaseHeader|null}
	 */
	this.get_prev_visible_item = function (item) {

		/**
		 * @param {BaseHeader} item
		 * @return {BaseHeader|Row}
		 */
		function get_last_visible_item(item) {
			var last_item = item;
			while (!_isInstanceOf(last_item, Row) && !last_item.is_collapsed) {
				last_item = _.last(last_item.sub_items);
			}

			return last_item;
		}

		/**
		 * @param {BaseHeader} header
		 * @return {Row|BaseHeader|null}
		 */
		function get_prev_item_before_header(header) {
			if (header === _.head(header.parent.sub_items)) {
				return _isInstanceOf(header.parent, BaseHeader) ? header.parent : null;
			}

			return get_last_visible_item(header.parent.sub_items[header.idx - 1]);
		}

		/**
		 * @param {Row} row
		 * @return {Row|BaseHeader|null}
		 */
		function get_prev_item_before_row(row) {
			if (row === _.head(row.parent.sub_items)) {
				return row.parent;
			}

			return row.parent.sub_items[row.idx_in_header - 1];
		}

		if (!g_properties.show_header) {
			if (item === _.head(cnt.rows)) {
				return null;
			}

			return cnt.rows[item.idx - 1];
		}

		if (_isInstanceOf(item, BaseHeader)) {
			return get_prev_item_before_header(item);
		}

		return get_prev_item_before_row(item);
	};

	/**
	 * @param {Row|BaseHeader} item
	 * @return {Row|BaseHeader|null}
	 */
	this.get_next_visible_item = function (item) {

		/**
		 * @param {Row|BaseHeader} item
		 * @return {Row|BaseHeader|null}
		 */
		function get_next_item(item) {
			var next_item = item;
			while (next_item) {
				if (!next_item.parent) {
					return null;
				}

				if (next_item !== _.last(next_item.parent.sub_items)) {
					var next_item_idx = _isInstanceOf(next_item, Row) ? next_item.idx_in_header : next_item.idx;
					return next_item.parent.sub_items[next_item_idx + 1];
				}

				next_item = next_item.parent;
			}

			return next_item;
		}

		if (!g_properties.show_header) {
			if (item === _.last(cnt.rows)) {
				return null;
			}

			return cnt.rows[item.idx + 1];
		}

		if (_isInstanceOf(item, BaseHeader) && !item.is_collapsed) {
			return _.head(item.sub_items);
		}

		return get_next_item(item);
	};

	/**
	 * @const
	 * @type {PlaylistContent}
	 */
	var cnt = cnt_arg;
}

// #region BaseHeader

/**
 * @param {List.Content|BaseHeader} parent
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h See {@link List.Item}
 * @param {number} idx
 *
 * @abstract
 * @constructor
 * @extends {List.Item}
 */
function BaseHeader(parent, x, y, w, h, idx) {
	List.Item.call(this, x, y, w, h);

	/**
	 * @const
	 * @type {BaseHeader|List.Content}
	 */
	this.parent = parent;

	/**
	 * @const
	 * @type {number}
	 */
	this.idx = idx;

	/** @type {boolean} */
	this.is_collapsed = false;

	/**
	 * @type {number}
	 * @private
	 */
	this.row_count = 0;

	/**
	 * Note: {@link PlaylistContent.sub_items}
	 *
	 * @type{Array<Row>|Array<BaseHeader>}
	 */
	this.sub_items = [];
}

BaseHeader.prototype = Object.create(List.Item.prototype);
BaseHeader.prototype.constructor = BaseHeader;

/**
 * @param {Array} prepared_items
 * @return {number} Number of processed items
 * @abstract
 */
BaseHeader.prototype.initialize_items = function (prepared_items) {
	throw LogicError("initialize_items not implemented");
};

/**
 * @override
 * @abstract
 */
BaseHeader.prototype.draw = function (gr) {
	// Need this useless method to suppress warning =(
	throw LogicError("draw not implemented");
};

/** @override */
BaseHeader.prototype.set_w = function (w) {
	List.Item.prototype.set_w.apply(this, [w]);

	_.forEach(this.sub_items, function (item) {
		item.set_w(w);
	});
};

/**
 * @return {?Row}
 */
BaseHeader.prototype.get_first_row = function () {
	if (!this.sub_items.length) {
		return null;
	}

	var item = _.head(this.sub_items);
	while (item && !_isInstanceOf(item, Row)) {
		item = _.head(item.sub_items);
	}

	return item;
};

/**
 * @return {Array<number>}
 */
BaseHeader.prototype.get_row_indexes = function () {
	var row_indexes = [];

	if (_isInstanceOf(_.head(this.sub_items), Row)) {
		_.forEach(this.sub_items, function (item) {
			row_indexes.push(item.idx);
		});
	}
	else {
		_.forEach(this.sub_items, function (item) {
			row_indexes = row_indexes.concat(item.get_row_indexes());
		});
	}

	return row_indexes;
};

/**
 * @return {number}
 */
BaseHeader.prototype.get_row_count = function () {
	if (this.row_count) {
		return this.row_count;
	}

	if (_isInstanceOf(_.head(this.sub_items), Row)) {
		this.row_count += this.sub_items.length;
	}
	else {
		_.forEach(this.sub_items, _.bind(function (item) {
			this.row_count += item.get_row_count();
		}, this));
	}

	return this.row_count;
};

/**
 * @return {number}
 */
BaseHeader.prototype.get_sub_items_total_h_in_rows = function () {
	if (!this.sub_items.length) {
		return 0;
	}

	if (_isInstanceOf(_.head(this.sub_items), Row)) {
		return this.sub_items.length;
	}

	var h_in_rows = Math.round(_.head(this.sub_items).h / g_properties.row_h) * this.sub_items.length;
	_.forEach(this.sub_items, function (item) {
		if (!item.is_collapsed) {
			h_in_rows += item.get_sub_items_total_h_in_rows();
		}
	});

	return h_in_rows;
};

/**
 * @return {boolean}
 */
BaseHeader.prototype.has_selected_items = function () {
	var is_function = typeof _.head(this.sub_items).has_selected_items === "function";
	return _.some(this.sub_items, function (item) {
		return is_function ? item.has_selected_items() : item.is_selected();
	});
};

/**
 * @return {boolean}
 */
BaseHeader.prototype.is_completely_selected = function () {
	var is_function = typeof _.head(this.sub_items).is_completely_selected === "function";
	return _.every(this.sub_items, function (item) {
		return is_function ? item.is_completely_selected() : item.is_selected();
	});
};

/**
 * @return {boolean}
 */
BaseHeader.prototype.is_playing = function () {
	var is_function = typeof _.head(this.sub_items).is_playing === "function";
	return _.some(this.sub_items, function (item) {
		return is_function ? item.is_playing() : item.is_playing;
	});
};

/**
 * @return {boolean}
 */
BaseHeader.prototype.is_focused = function () {
	var is_function = typeof _.head(this.sub_items).is_focused === "function";
	return _.some(this.sub_items, function (item) {
		return is_function ? item.is_focused() : item.is_focused;
	});
};

/**
 * @return {number} float number
 */
BaseHeader.prototype.get_duration = function () {
	var duration_in_seconds = 0;

	if (_isInstanceOf(_.head(this.sub_items), Row)) {
		_.forEach(this.sub_items, function (item) {
			duration_in_seconds += item.metadb.Length;
		});
	}
	else {
		_.forEach(this.sub_items, function (item) {
			duration_in_seconds += item.get_duration();
		});
	}

	return duration_in_seconds;
};

// #endregion

/**
 * @param {List.Content|BaseHeader} parent
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} idx
 *
 * @final
 * @constructor
 * @extends {BaseHeader}
 */
function DiscHeader(parent, x, y, w, h, idx) {
	BaseHeader.call(this, parent, x, y, w, h, idx);

	/** @override */
	this.initialize_items = function (rows_with_data) {
		this.sub_items = [];
		if (!rows_with_data.length) {
			return 0;
		}

		var first_data = _.head(rows_with_data)[1];
		_.forEach(rows_with_data, _.bind(function (item, i) {
			if (first_data !== item[1]) {
				return false;
			}

			var row = item[0];

			row.idx_in_header = i;
			// noinspection JSBitwiseOperatorUsage
			row.is_odd = !(i & 1);
			row.parent = this;

			this.sub_items.push(row);
		}, this));

		var split_data = first_data.split(/,(.*)/);
		if (split_data[0]) {
			this.cd_num = _.toNumber(split_data[0]);
		}
		this.cd_title = split_data[1];

		return this.sub_items.length;
	};

	/** @override */
	this.draw = function (gr) {
		var line_color = g_pl_colors.line_normal;
		var title_font = g_pl_fonts.title_normal;
		var title_color = g_pl_colors.title_normal;

		if (this.has_selected_items()) {
			line_color = g_pl_colors.line_selected;
			title_color = g_pl_colors.title_selected;
			title_font = g_pl_fonts.title_selected;
		}

		if (this.is_playing()) {// Might override 'selected' fonts
			title_color = g_pl_colors.title_playing;
			title_font = g_pl_fonts.title_playing;
		}

		var clipImg = gdi.CreateImage(this.w, this.h);
		var grClip = clipImg.GetGraphics();

		grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.background);
		if (this.has_selected_items()) {
			grClip.FillSolidRect(0, 1, this.w, this.h - 1, g_pl_colors.row_selected);
		}

		grClip.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		var left_pad = 10;
		var right_pad = 0;
		var cur_x = left_pad;

		//---> LENGTH
		{
			var length_text = utils.FormatDuration(this.get_duration());
			if (length_text) {
				var length_w = Math.ceil(grClip.MeasureString(length_text, title_font, 0, 0, 0, 0).Width + 5);
				var length_x = this.w - length_w - right_pad - 5;

				var length_text_format = StringFormat();
				length_text_format.line_alignment = StringAlignment.center;

				grClip.DrawString(length_text, title_font, title_color, length_x, 0, length_w, this.h, length_text_format.value());

				right_pad += this.w - length_x;
			}
		}

		//---> Disc text
		if (this.cd_num !== -1 || this.cd_title) {
			var cd_text = '';
			if (this.cd_num !== -1) {
				cd_text += 'Disc #' + this.cd_num;
			}
			if (this.cd_title) {
				if (cd_text) {
					cd_text += ': '
				}
				cd_text += this.cd_title;
			}

			var cd_num_w = this.w - right_pad - 10;

			var cd_num_text_format = StringFormat();
			cd_num_text_format.line_alignment = StringAlignment.center;
			cd_num_text_format.trimming = StringTrimming.ellipsis_char;
			cd_num_text_format.format_flags =
				/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

			grClip.DrawString(cd_text, title_font, title_color, cur_x, 0, cd_num_w, this.h, cd_num_text_format.value());

			cd_num_text_format.format_flags |= StringFormatFlags.measure_trailing_spaces;

			cur_x += Math.ceil(
				/** @type {number} */
				grClip.MeasureString(cd_text, title_font, 0, 0, cd_num_w, this.h, cd_num_text_format.value()).Width
			);
		}

		{
			var line_x1 = cur_x + 10;
			var line_x2 = this.w - (right_pad + 10);
			var line_y = Math.round(this.h / 2) + 1;

			if (line_x2 - line_x1 > 0) {
				grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
			}
		}

		clipImg.ReleaseGraphics(grClip);
		gr.DrawImage(clipImg, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
	};

	this.cd_num = -1;
	this.cd_title = '';
}

DiscHeader.prototype = Object.create(BaseHeader.prototype);
DiscHeader.prototype.constructor = DiscHeader;

/**
 * @param {Array<Row>} rows_to_process
 * @param {FbMetadbHandleList} rows_metadb
 * @return {Array<Array>} Has the following format Array<[row,row_data]>
 */
DiscHeader.prepare_initialization_data = function (rows_to_process, rows_metadb) {
	var tfo = fb.TitleFormat("$if2($ifgreater(%totaldiscs%,1,[%discnumber%],)','[%setsubtitle%],)");
	var disc_data = tfo.EvalWithMetadbs(rows_metadb);

	return _.zip(rows_to_process, disc_data);
};

/**
 * @param {BaseHeader} parent
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {Array<Array>} prepared_rows Has the following format Array<[row,row_data]>
 * @param {number} rows_to_process_count
 * @return {Array<DiscHeader>}
 */
DiscHeader.create_headers = function (parent, x, y, w, h, prepared_rows, rows_to_process_count) {
	function has_valid_data(rows_with_data, rows_to_check_count) {
		for (var i = 0; i < rows_to_check_count; ++i) {
			if (!_.isEmpty(rows_with_data[i][1])) {
				return true;
			}
		}
		return false;
	}

	if (!has_valid_data(prepared_rows, rows_to_process_count)) {
		_trimArray(prepared_rows, rows_to_process_count, true);
		return [];
	}

	var prepared_rows_copy = _.clone(prepared_rows);
	prepared_rows_copy.length = rows_to_process_count;

	var header_idx = 0;
	var headers = [];
	while (prepared_rows_copy.length) {
		var header = new DiscHeader(parent, x, y, w, h, header_idx);
		var processed_items = header.initialize_items(prepared_rows_copy);

		_trimArray(prepared_rows_copy, processed_items, true);

		headers.push(header);
		++header_idx;
	}

	_trimArray(prepared_rows, rows_to_process_count, true);

	return headers;
};

/**
 * @param {PlaylistContent|BaseHeader} parent
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} idx
 *
 * @final
 * @constructor
 * @extends {BaseHeader}
 */
function Header(parent, x, y, w, h, idx) {
	BaseHeader.call(this, parent, x, y, w, h, idx);

	/** @override */
	this.initialize_items = function (rows_with_data) {
		this.sub_items = [];

		var rows_with_header_data = rows_with_data[0];
		if (!rows_with_header_data.length) {
			return 0;
		}

		var first_data = _.head(rows_with_header_data)[1];

		var owned_rows = [];
		_.forEach(rows_with_header_data, _.bind(function (item, i) {
			if (first_data !== item[1]) {
				return false;
			}

			owned_rows.push(item[0]);
		}, this));

		metadb = _.head(owned_rows).metadb;

		var sub_headers = [];
		if (g_properties.show_disc_header && grouping_handler.show_cd()) {
			var rows_with_discheader_data = rows_with_data[1];
			sub_headers = create_cd_headers(rows_with_discheader_data, owned_rows.length);
			if (sub_headers.length) {
				this.sub_items = sub_headers;
			}
		}

		if (sub_headers.length) {
			this.sub_items = sub_headers;
		}
		else {
			this.sub_items = owned_rows;

			_.forEach(owned_rows, _.bind(function (item, i) {
				item.idx_in_header = i;
				if (g_properties.show_header) {
					// noinspection JSBitwiseOperatorUsage
					item.is_odd = !(i & 1);
				}
				item.parent = this;
			}, this));
		}

		return owned_rows.length;
	};

	/**
	 * @param {Array} prepared_rows
	 * @param {number} rows_to_proccess_count
	 * @return {Array<DiscHeader>}
	 */
	function create_cd_headers(prepared_rows, rows_to_proccess_count) {
		return DiscHeader.create_headers(that, that.x, 0, that.w, g_properties.row_h, prepared_rows, rows_to_proccess_count);
	}

	/** @override */
	this.draw = function (gr) {
		if (g_properties.use_compact_header) {
			this.draw_compact_header(gr)
		}
		else {
			this.draw_normal_header(gr);
		}
	};

	/**
	 * @param {IGdiGraphics} gr
	 */
	this.draw_normal_header = function (gr) {
		var artist_color = g_pl_colors.artist_normal;
		var album_color = g_pl_colors.album_normal;
		var info_color = g_pl_colors.info_normal;
		var date_color = g_pl_colors.date_normal;
		var line_color = g_pl_colors.line_normal;
		var date_font = g_pl_fonts.date;
		var artist_font = g_pl_fonts.artist_normal;

		if (this.is_playing()) {
			artist_color = g_pl_colors.artist_playing;
			album_color = g_pl_colors.album_playing;
			info_color = g_pl_colors.info_playing;
			date_color = g_pl_colors.date_playing;
			line_color = g_pl_colors.line_playing;
			artist_font = g_pl_fonts.artist_playing;
		}
		if (this.has_selected_items()) {
			line_color = g_pl_colors.line_selected;
			artist_color = album_color = date_color = info_color = g_pl_colors.group_title_selected;
		}

		var clipImg = gdi.CreateImage(this.w, this.h);
		var grClip = clipImg.GetGraphics();

		grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.background); // Solid background for ClearTypeGridFit text rendering

		if (this.has_selected_items()) {
			grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.row_selected);
		}

		grClip.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.is_collapsed && this.is_focused()) {
			grClip.DrawRect(2, 2, this.w - 4, this.h - 4, 1, line_color);
		}

		//************************************************************//

		var left_pad = 10;

		//---> Artbox
		if (g_properties.show_album_art) {
			if (!this.is_art_loaded()) {
				var cached_art = Header.art_cache.get_image_for_meta(metadb);
				if (cached_art) {
					this.assign_art(cached_art);
				}
			}

			if (art !== null || !g_properties.auto_album_art) {
				var p = 6;

				var art_box_size = this.h - p * 2;
				var art_box_x = p;
				var art_box_y = p;
				var art_box_w = art_box_size;
				var art_box_h = art_box_size;

				if (art) {
					var art_x = art_box_x + 2;
					var art_y = art_box_y + 2;
					var art_h = art.Height;
					var art_w = art.Width;
					if (art_h > art_w) {
						art_box_w = art_w + 4;
					}
					else {
						art_box_h = art_h + 4;
						art_y += Math.round((art_max_size - art_h) / 2);
						art_box_y = art_y - 2;
					}
					grClip.DrawImage(art, art_x, art_y, art_w, art_h, 0, 0, art_w, art_h, 0, 220);
				}
				else if (!this.is_art_loaded()) {
					grClip.DrawString('LOADING', g_pl_fonts.cover, line_color, art_box_x, art_box_y, art_box_size, art_box_size, g_string_format_center.value());
				}
				else {// null
					grClip.DrawString('NO COVER', g_pl_fonts.cover, _RGB(100, 100, 100), art_box_x, art_box_y, art_box_size, art_box_size, g_string_format_center.value());
				}

				grClip.DrawRect(art_box_x, art_box_y, art_box_w - 1, art_box_h - 1, 1, line_color);

				left_pad += art_box_x + art_box_w;
			}
		}

		//************************************************************//
		var is_radio = _.startsWith(metadb.RawPath, 'http');

		// part1: artist
		// part2: album + line + Date OR line
		// part3: info OR album
		var part1_cur_x = left_pad;
		var part2_cur_x = left_pad;
		var part3_cur_x = left_pad;

		var part_h = (!g_properties.show_group_info) ? this.h / 2 : this.h / 3;
		var part2_right_pad = 0;

		//---> DATE
		if (grouping_handler.show_date()) {
			var date_query = '[%date%]';
			if (g_properties.show_original_date) {
				date_query += '[ \'(\'%original release date%\')\']';
			}

			var date_text = _tf(date_query, metadb);
			if (date_text) {
				var date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
				var date_x = this.w - date_w - 5;
				var date_y = 0;
				var date_h = this.h;

				if (date_x > left_pad) {
					var date_format = StringFormat();
					date_format.line_alignment = StringAlignment.center;
					grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, date_format.value());
				}

				part2_right_pad += this.w - date_x;
			}
		}

		//---> TITLE
		if (grouping_handler.get_title_query()) {
			var artist_text = _tf(grouping_handler.get_title_query(), metadb);
			if (!artist_text && is_radio) {
				artist_text = 'Radio Stream';
			}
			if (artist_text) {
				var artist_x = part1_cur_x;
				var artist_w = this.w - artist_x;
				var artist_h = part_h;
				if (!g_properties.show_group_info) {
					artist_w -= part2_right_pad + 5;
					artist_h -= 5;
				}

				var artist_text_format = StringFormat();
				artist_text_format.line_alignment = StringAlignment.far;
				artist_text_format.trimming = StringTrimming.ellipsis_char;
				artist_text_format.format_flags =
					/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;
				grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format.value());

				//part1_cur_x += artist_w;
			}
		}

		//---> SUB TITLE
		if (grouping_handler.get_sub_title_query()) {
			var subtitle_query = grouping_handler.get_sub_title_query();
			if (g_properties.show_disc_header && grouping_handler.show_cd()) {
				subtitle_query = subtitle_query.replace(/%discnumber%/, '').replace(/%totaldiscs%/, '').replace(/%setsubtitle%/, '');
			}

			var album_text = _tf(subtitle_query, metadb);
			if (album_text) {
				var album_h = part_h;
				var album_y = part_h;
				var album_x;
				if (g_properties.show_group_info) {
					album_x = part2_cur_x
				}
				else {
					album_y += 5;
					album_x = part3_cur_x
				}
				var album_w = this.w - album_x - (part2_right_pad + 5);

				var album_text_format = StringFormat();
				album_text_format.trimming = StringTrimming.ellipsis_char;
				album_text_format.format_flags =
					/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;
				if (g_properties.show_group_info) {
					album_text_format.line_alignment = StringAlignment.center;
				}

				grClip.DrawString(album_text, g_pl_fonts.album, album_color, album_x, album_y, album_w, album_h, album_text_format.value());

				var album_text_w = Math.ceil(
					/** @type {!number} */
					gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width
				);
				if (g_properties.show_group_info) {
					part2_cur_x += album_text_w;
				}
				else {
					part3_cur_x += album_text_w;
				}
			}
		}

		//---> INFO
		if (g_properties.show_group_info) {
			var info_x = part3_cur_x;
			var info_y = 2 * part_h;
			var info_h = part_h;//row_h;
			var info_w = this.w - info_x;

			var bitspersample = _tf('$Info(bitspersample)', metadb);
			var samplerate = _tf('$Info(samplerate)', metadb);
			var sample = ((bitspersample > 16 || samplerate > 44100) ? ' ' + bitspersample + 'bit/' + samplerate / 1000 + 'khz' : '');
			var codec = _tf('$ext(%path%)', metadb);

			if (codec === 'cue') {
				codec = _tf('$ext($Info(referenced_file))', metadb);
			}
			else if (codec === 'mpc') {
				codec += _tf('[-$Info(codec_profile)]', metadb).replace('quality ', 'q');
			}
			else if (_tf('$Info(encoding)', metadb) === 'lossy') {
				if (_tf('$Info(codec_profile)', metadb) === 'CBR') {
					codec += _tf('[-%bitrate% kbps]', metadb);
				}
				else {
					codec += _tf('[-$Info(codec_profile)]', metadb);
				}
			}
			if (codec) {
				codec = codec + sample;
			}
			else {
				codec = (_.startsWith(metadb.RawPath, '3dydfy:') || _.startsWith(metadb.RawPath, 'fy+')) ? 'yt' : metadb.Path;
			}

			var track_count = this.get_row_count();
			var genre = is_radio ? '' : '[%genre% | ]';
			var disc_number = '';
			if (grouping_handler.show_cd() && !g_properties.show_disc_header) {
				disc_number = _tf('$ifgreater(%totaldiscs%,1,[ | Disc: %discnumber%/%totaldiscs%]', metadb);
			}
			var info_text = _tf(genre + codec + disc_number + '[ | %replaygain_album_gain%]', metadb) + (is_radio ? '' : ' | ' + track_count + (track_count === 1 ? ' Track' : ' Tracks'));
			if (this.get_duration()) {
				info_text += ' | Time: ' + utils.FormatDuration(this.get_duration());
			}

			var info_text_format = StringFormat();
			info_text_format.trimming = StringTrimming.ellipsis_char;
			info_text_format.format_flags =
				/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

			grClip.DrawString(info_text, g_pl_fonts.info, info_color, info_x, info_y, info_w, info_h, info_text_format.value());

			//---> Info line
			var info_text_h = Math.ceil(gr.MeasureString(info_text, g_pl_fonts.info, 0, 0, 0, 0).Height + 5);
			var line_x1 = left_pad;
			var line_x2 = this.w - this.x - 10;
			var line_y = info_y + info_text_h;
			if (line_x2 - line_x1 > 0) {
				grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
			}
		}

		//---> Part 2 line
		{
			var line_x1 = part2_cur_x;
			if (line_x1 !== left_pad) {
				line_x1 += 10;
			}
			var line_x2 = this.w - part2_right_pad - 10;
			var line_y = Math.round(this.h / 2) + 1;

			if (line_x2 - line_x1 > 0) {
				grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
			}
		}

		clipImg.ReleaseGraphics(grClip);
		gr.DrawImage(clipImg, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
	};

	/**
	 * @param {IGdiGraphics} gr
	 */
	this.draw_compact_header = function (gr) {
		var artist_color = g_pl_colors.artist_normal;
		var album_color = g_pl_colors.album_normal;
		var date_color = g_pl_colors.date_normal;
		var line_color = g_pl_colors.line_normal;
		var date_font = g_pl_fonts.date_compact;
		var artist_font = g_pl_fonts.artist_normal_compact;

		if (this.is_playing()) {
			artist_color = g_pl_colors.artist_playing;
			album_color = g_pl_colors.album_playing;
			date_color = g_pl_colors.date_playing;
			line_color = g_pl_colors.line_playing;

			artist_font = g_pl_fonts.artist_playing_compact;
		}
		if (this.has_selected_items()) {
			line_color = g_pl_colors.line_selected;
			artist_color = album_color = date_color = g_pl_colors.group_title_selected;
		}

		var clipImg = gdi.CreateImage(this.w, this.h);
		var grClip = clipImg.GetGraphics();

		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);

		//--->
		grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.background); // Solid background for ClearTypeGridFit text rendering
		if (this.has_selected_items()) {
			grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.row_selected);
		}

		grClip.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.is_collapsed && this.is_focused()) {
			grClip.DrawRect(2, 2, this.w - 4, this.h - 4, 1, line_color);
		}

		//************************************************************//

		var is_radio = _.startsWith(metadb.RawPath, 'http');

		var left_pad = 10;
		var right_pad = 0;
		var cur_x = left_pad;

		//---> DATE
		if (grouping_handler.show_date()) {
			var date_query = '[%date%]';
			if (g_properties.show_original_date) {
				date_query += '[ \'(\'%original release date%\')\']';
			}

			var date_text = _tf(date_query, metadb);
			if (date_text) {
				var date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
				var date_x = this.w - date_w - 5;
				var date_y = 0;
				var date_h = this.h;

				if (date_x > left_pad) {
					var date_text_format = StringFormat();
					date_text_format.line_alignment = StringAlignment.center;
					grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, date_text_format.value());
				}

				right_pad += this.w - date_x;
			}
		}

		//---> TITLE
		if (grouping_handler.get_title_query()) {
			var artist_text = _tf(grouping_handler.get_title_query(), metadb);
			if (!artist_text) {
				artist_text = is_radio ? 'Radio Stream' : '?';
			}

			if (artist_text) {
				var artist_x = cur_x;
				var artist_w = this.w - artist_x - (right_pad + 5);
				var artist_h = this.h;

				var artist_text_format = StringFormat();
				artist_text_format.line_alignment = StringAlignment.center;
				artist_text_format.trimming = StringTrimming.ellipsis_char;
				artist_text_format.format_flags =
					/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

				grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format.value());

				cur_x += Math.ceil(
					/** @type {!number} */
					gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width
				);
			}
		}

		//---> SUB TITLE
		if (grouping_handler.get_sub_title_query()) {

			var album_text = _tf(grouping_handler.get_sub_title_query(), metadb);
			if (album_text) {
				album_text = ' - ' + album_text;

				var album_h = this.h;
				var album_x = cur_x;
				var album_w = this.w - album_x - (right_pad + 5);

				var album_text_format = StringFormat();
				album_text_format.line_alignment = StringAlignment.center;
				album_text_format.trimming = StringTrimming.ellipsis_char;
				album_text_format.format_flags =
					/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

				grClip.DrawString(album_text, g_pl_fonts.album, album_color, album_x, 0, album_w, album_h, album_text_format.value());

				//cur_x += gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width;
			}
		}

		clipImg.ReleaseGraphics(grClip);
		gr.DrawImage(clipImg, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
	};

	/**
	 * @param {GdiBitmap} image
	 */
	this.assign_art = function (image) {
		if (!image || !g_properties.show_album_art) {
			art = null;
			return;
		}

		if ((image.Height === art_max_size && image.Width <= art_max_size)
			|| (image.Height <= art_max_size && image.Width === art_max_size)) {
			art = image;
		}
		else {
			var ratio = image.Height / image.Width;
			var art_h = art_max_size;
			var art_w = art_max_size;
			if (image.Height > image.Width) {
				art_w = Math.round(art_h / ratio);
			}
			else {
				art_h = Math.round(art_w * ratio);
			}

			art = image.Resize(art_w, art_h);
		}

		Header.art_cache.add_image_for_meta(art, metadb);
	};

	/**
	 * @return {boolean}
	 */
	this.is_art_loaded = function () {
		return art !== undefined;
	};

	//private:
	var that = this;

	/**
	 * @const
	 * @type {number}
	 */
	var art_max_size = that.h - 16;

	/** @type {FbMetadbHandle} */
	var metadb;
	/**
	 * @type {?GdiBitmap}
	 */
	var art = undefined; // undefined > Not Loaded; null > Loaded & Not Found; !_.isNil > Loaded & Found
	var grouping_handler = Header.grouping_handler;
}

Header.prototype = Object.create(BaseHeader.prototype);
Header.prototype.constructor = Header;

/**
 * @param {Array<Row>} rows_to_process
 * @param {FbMetadbHandleList} rows_metadb
 * @return {Array} Has the following format [Array<[row,row_data]>, disc_header_prepared_data]
 */
Header.prepare_initialization_data = function (rows_to_process, rows_metadb) {
	var query = Header.grouping_handler.get_query();
	if (g_properties.show_disc_header && query && Header.grouping_handler.show_cd()) {
		query = query.replace(/%discnumber%/, '').replace(/%totaldiscs%/, '').replace(/%setsubtitle%/, '');
	}

	var tfo = fb.TitleFormat(query ? query : ''); // workaround a bug, because of which '' is sometimes treated as null :\
	var rows_data = tfo.EvalWithMetadbs(rows_metadb);

	var prepared_disc_data = g_properties.show_disc_header ? DiscHeader.prepare_initialization_data(rows_to_process, rows_metadb) : [];

	return [_.zip(rows_to_process, rows_data), prepared_disc_data];
};

/**
 * @param {PlaylistContent} parent
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {Array} prepared_rows Has the following format [Array<[row,row_data]>, disc_header_prepared_data]
 * @return {Array<Header>}
 */
Header.create_headers = function (parent, x, y, w, h, prepared_rows) {
	var prepared_header_rows = prepared_rows[0];

	var header_idx = 0;
	var headers = [];
	while (prepared_header_rows.length) {
		var header = new Header(parent, x, y, w, h, header_idx);
		var processed_rows_count = header.initialize_items(prepared_rows);

		_trimArray(prepared_header_rows, processed_rows_count, true);

		headers.push(header);
		++header_idx;
	}

	return headers;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {FbMetadbHandle} metadb
 * @param {number} idx
 * @param {number} cur_playlist_idx_arg
 * @constructor
 * @extends {List.Item}
 */
function Row(x, y, w, h, metadb, idx, cur_playlist_idx_arg) {
	List.Item.call(this, x, y, w, h);

	//public:
	this.draw = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);

		if (this.is_odd && g_properties.alternate_row_color) {
			gr.FillSolidRect(this.x, this.y + 1, this.w, this.h - 1, g_pl_colors.row_alternate);
		}

		var title_font = g_pl_fonts.title_normal;
		var title_color = g_pl_colors.title_normal;
		var count_color = g_pl_colors.count_normal;
		var row_color_focus = g_pl_colors.row_focus_normal;
		var title_artist_font = g_pl_fonts.title_selected;
		var title_artist_color = g_pl_colors.title_selected;

		if (this.is_selected()) {
			if (g_properties.alternate_row_color) {
				// last item is cropped
				var rect_h = this.is_cropped ? this.h - 1 : this.h;
				gr.DrawRect(this.x, this.y, this.w - 1, rect_h, 1, g_pl_colors.row_focus_selected);
			}
			else {
				gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.row_selected);
			}

			title_color = g_pl_colors.title_selected;
			title_font = g_pl_fonts.title_selected;
			count_color = g_pl_colors.count_selected;

			row_color_focus = g_pl_colors.row_focus_selected;
			title_artist_color = g_pl_colors.title_normal;
		}

		if (this.is_playing) {// Might override 'selected' fonts
			title_color = g_pl_colors.title_playing;
			title_font = g_pl_fonts.title_playing;
			count_color = g_pl_colors.count_playing;
		}

		//--->
		if (g_properties.show_focused_row && this.is_focused) {
			// last item is cropped
			var rect_h = this.is_cropped ? this.h - 3 : this.h - 2;
			gr.DrawRect(this.x + 1, this.y + 1, this.w - 3, rect_h, 1, row_color_focus);
		}

		if (this.is_drop_top_selected) {
			var drop_color = this.is_drop_boundary_reached ? g_pl_colors.row_drop_position_boundary: g_pl_colors.row_drop_position;
			gr.DrawLine(this.x, this.y + 1, this.x + this.w, this.y + 1, 2, drop_color);
		}
		if (this.is_drop_bottom_selected) {
			var drop_color = this.is_drop_boundary_reached ? g_pl_colors.row_drop_position_boundary: g_pl_colors.row_drop_position;
			gr.DrawLine(this.x, this.y + this.h - 1, this.x + this.w, this.y + this.h - 1, 2, drop_color);
		}

		////////////////////////////////////////////////////////////

		var cur_x = this.x + 10;
		if (_isInstanceOf(this.parent, DiscHeader)) {
			cur_x += 20;
		}

		var right_pad = 0;
		var testRect = false;

		var is_radio = _.startsWith(this.metadb.RawPath, 'http');

		//---> LENGTH
		{
			if (_.isNil(length_text)) {
				length_text = _tf('[%length%]', this.metadb);
			}

			var length_w = duration_max_w;
			if (length_text) {
				var length_x = this.x + this.w - length_w - right_pad;

				gr.DrawString(length_text, title_font, title_color, length_x, this.y, length_w, this.h, g_string_format_center.value());
				testRect && gr.DrawRect(length_x, this.y - 1, length_w, this.h, 1, _RGBA(155, 155, 255, 250));
			}
			// We always want that padding
			right_pad += Math.max(length_w, Math.ceil(gr.MeasureString(length_text, title_font, 0, 0, 0, 0).Width + 10));
		}

		//---> RATING
		if (g_properties.show_rating) {
			rating.draw(gr, title_color);

			right_pad = this.w - (rating.x - this.x) + rating_pad;
		}

		//---> COUNT
		if (g_properties.show_playcount) {
			if (_.isNil(count_text)) {
				if (is_radio) {
					count_text = '';
				}
				else {
					count_text = _tf('[$max(%play_count%, %lastfm_play_count%)]', this.metadb);
					count_text = !_.toNumber(count_text) ? '' : (count_text + ' |');
				}
			}

			if (count_text) {
				var count_w = Math.ceil(
					/** @type {!number} */
					gr.MeasureString(count_text, g_pl_fonts.playcount, 0, 0, 0, 0).Width
				);
				var count_x = this.x + this.w - count_w - right_pad;

				gr.DrawString(count_text, g_pl_fonts.playcount, count_color, count_x, this.y, count_w, this.h, g_string_format_center.value());
				testRect && gr.DrawRect(count_x, this.y - 1, count_w, this.h, 1, _RGBA(155, 155, 255, 250));

				right_pad = this.w - (count_x - this.x) + 5;
			}
		}

		//---> QUEUE
		var queue_text = '';
		if (g_properties.show_queue_position && !_.isNil(this.queue_idx)) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.row_queued);

			queue_text = '  [' + this.queue_idx + ']';
			if (this.queue_idx_count > 1) {
				queue_text += '*' + this.queue_idx_count;
			}
		}

		// TODO: try to fix spacing issues between title and title artist

		// We need to draw 'queue' text with title text, it will cause weird spacing if drawn separately

		//---> TITLE init
		if (_.isNil(title_text)) {
			var track_num_query = '$if(%tracknumber%,%tracknumber%,$pad_right(' + (this.idx_in_header + 1) + ',2,0))';
			var title_query = track_num_query + '.  %title%';
			title_text = (fb.IsPlaying && this.is_playing && is_radio) ? _tfe(title_query) : _tf(title_query, metadb);
		}

		//---> TITLE ARTIST init
		if (_.isNil(title_artist_text)) {
			title_artist_text = _tf('[  \u25AA  %track artist%]', metadb);
		}

		//---> TITLE draw
		{
			var title_x = cur_x;
			var title_w = this.w - ((title_x - this.x) + right_pad);

			var full_title_text = title_text + (title_artist_text ? '' : queue_text);

			var title_text_format = StringFormat();
			title_text_format.line_alignment = StringAlignment.center;
			title_text_format.trimming = StringTrimming.ellipsis_char;
			title_text_format.format_flags =
				/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

			gr.DrawString(full_title_text, title_font, title_color, cur_x, this.y, title_w, this.h, title_text_format.value());

			testRect && gr.DrawRect(title_x, this.y - 1, title_w, this.h, 1, _RGBA(155, 155, 255, 250));

			title_text_format.format_flags |= StringFormatFlags.measure_trailing_spaces;

			cur_x += Math.ceil(
				/** @type {number} */
				gr.MeasureString(full_title_text, title_font, 0, 0, title_w, this.h, title_text_format.value()).Width
			);
		}

		//---> TITLE ARTIST draw
		if (title_artist_text) {
			var title_artist_x = cur_x;
			var title_artist_w = this.w - ((title_artist_x - this.x) + right_pad);

			var full_title_artist_text = title_artist_text + queue_text;

			var title_artist_text_format = StringFormat();
			title_artist_text_format.line_alignment = StringAlignment.center;
			title_artist_text_format.trimming = StringTrimming.ellipsis_char;
			title_artist_text_format.format_flags =
				/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

			gr.DrawString(full_title_artist_text, title_artist_font, title_artist_color, title_artist_x, this.y, title_artist_w, this.h, title_artist_text_format.value());

			testRect && gr.DrawRect(title_artist_x, this.y - 1, title_artist_w, this.h, 1, _RGBA(155, 155, 255, 250));
		}
	};

	/** @override */
	this.set_y = function (y) {
		List.Item.prototype.set_y.apply(this, [y]);
		rating.y = y;
	};

	/** @override */
	this.set_w = function (w) {
		List.Item.prototype.set_w.apply(this, [w]);
		initialize_rating();
	};

	this.reset_queried_data = function () {
		title_text = undefined;
		title_artist_text = undefined;
		count_text = undefined;
		length_text = undefined;

		rating.reset_queried_data();
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {boolean}
	 */
	this.rating_trace = function (x, y) {
		if (!g_properties.show_rating) {
			return false;
		}
		return rating.trace(x, y);
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	this.rating_click = function (x, y) {
		assert(g_properties.show_rating,
			LogicError, 'Rating_click was called, when there was no rating object.\nShould use trace before calling click');

		rating.click(x, y);
	};

	/**
	 * @return {boolean}
	 */
	this.is_selected = function () {
		return plman.IsPlaylistItemSelected(cur_playlist_idx, this.idx);
	};

	function initialize_rating() {
		rating = new Rating(0, that.y, that.w - rating_right_pad, that.h, metadb);
		rating.x = that.x + that.w - (rating.w + rating_right_pad);
	}

	/**
	 * @const
	 * @type {number}
	 */
	this.idx = idx;
	/**
	 * @const
	 * @type {FbMetadbHandle}
	 */
	this.metadb = metadb;

	//const after header creation
	/** @type {boolean} */
	this.is_odd = false;
	/** @type {number} */
	this.idx_in_header = undefined;
	/**
	 * @const
	 * @type {BaseHeader}
	 */
	this.parent = undefined;

	/** @type {?number} */
	this.queue_idx = undefined;
	/** @type {number} */
	this.queue_idx_count = 0;

	//state
	this.is_playing = false;
	this.is_focused = false;
	this.is_drop_boundary_reached = false;
	this.is_drop_bottom_selected = false;
	this.is_drop_top_selected = false;
	this.is_cropped = false;

	var that = this;

	/**
	 * @const
	 * @type {number}
	 */
	var cur_playlist_idx = cur_playlist_idx_arg;

	/**
	 * @const
	 * @type {number}
	 */
	var duration_max_w = 50;

	/**
	 * @const
	 * @type {number}
	 */
	var rating_pad = 5;
	/**
	 * @const
	 * @type {number}
	 */
	var rating_right_pad = duration_max_w + rating_pad;

	/** @type {?Rating} */
	var rating = undefined;

	/** @type {?string} */
	var title_text = undefined;
	/** @type {?string} */
	var title_artist_text = undefined;
	/** @type {?string} */
	var count_text = undefined;
	/** @type {?string} */
	var length_text = undefined;

	initialize_rating();
}

Row.prototype = Object.create(List.Item.prototype);
Row.prototype.constructor = Row;

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} max_w
 * @param {number} h
 * @param {FbMetadbHandle} metadb
 * @constructor
 */
function Rating(x, y, max_w, h, metadb) {
	/**
	 * @param {IGdiGraphics} gr
	 * @param {number} color
	 */
	this.draw = function (gr, color) {
		var cur_rating = this.get_rating();
		var cur_rating_x = this.x;

		for (var j = 0; j < 5; j++) {
			if (j < cur_rating) {
				gr.DrawString('\u2605', g_pl_fonts.rating_set, color, cur_rating_x, this.y - 1, btn_w, this.h, g_string_format_center.value());
			}
			else {
				gr.DrawString('\u2219', g_pl_fonts.rating_not_set, color, cur_rating_x, this.y - 1, btn_w, this.h, g_string_format_center.value());
			}
			cur_rating_x += btn_w;
		}
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {boolean}
	 */
	this.trace = function (x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	this.click = function (x, y) {
		if (!this.trace(x, y)) {
			return;
		}

		var new_rating = Math.floor((x - this.x) / 14) + 1;
		var current_rating = this.get_rating();

		if (g_properties.use_rating_from_tags) {
			if (!_.startsWith(this.metadb.RawPath, 'http')) {
				var handle = fb.CreateHandleList();
				handle.Add(this.metadb);
				handle.UpdateFileInfoFromJSON(
					JSON.stringify({
						'RATING': (current_rating === new_rating) ? '' : new_rating
					})
				);
			}
		}
		else {
			fb.RunContextCommandWithMetadb('Rating/' + (current_rating === new_rating ? '<not set>' : new_rating), this.metadb);
		}

		rating = (current_rating === new_rating) ? 0 : new_rating;
	};

	/**
	 * @return {number}
	 */
	this.get_rating = function () {
		if (_.isNil(rating)) {
			var current_rating;
			if (g_properties.use_rating_from_tags) {
				var file_info = this.metadb.GetFileInfo();
				var rating_meta_idx = file_info.MetaFind('RATING');
				current_rating = rating_meta_idx !== -1 ? file_info.MetaValue(rating_meta_idx, 0) : 0;
			}
			else {
				current_rating = _tf('%rating%', this.metadb);
			}
			rating = _.toNumber(current_rating);
		}
		return rating;
	};

	this.reset_queried_data = function () {
		rating = undefined;
	};

	/**
	 * @const
	 * @type {number}
	 */
	var btn_w = 14;

	/**
	 * @const
	 * @type {FbMetadbHandle}
	 */
	this.metadb = metadb;

	/** @type {number} */
	this.x = x;
	/** @type {number} */
	this.y = y;
	/**
	 * @const
	 * @type {number}
	 */
	this.w = Math.min(btn_w * 5, max_w);
	/**
	 * @const
	 * @type {number}
	 */
	this.h = h;

	/** @type {?number} */
	var rating = undefined;
}

/**
 * @param {PlaylistContent} cnt_arg
 * @param {number} cur_playlist_idx_arg
 * @constructor
 */
function SelectionHandler(cnt_arg, cur_playlist_idx_arg) {
	this.initialize_selection = function () {
		selected_indexes = [];
		_.forEach(rows, function (item, i) {
			if (plman.IsPlaylistItemSelected(cur_playlist_idx, item.idx)) {
				selected_indexes.push(i);
			}
		});
	};

	/**
	 * @param {Row|BaseHeader} item
	 * @param {?boolean=} [ctrl_pressed=false]
	 * @param {?boolean=} [shift_pressed=false]
	 */
	this.update_selection = function (item, ctrl_pressed, shift_pressed) {
		assert(!_.isNil(item),
			LogicError, 'update_selection was called with undefined item');

		if (!ctrl_pressed && !shift_pressed) {
			selected_indexes = [];
			last_single_selected_index = undefined;
		}

		var visible_item = cnt_helper.is_item_visible(item) ? item : cnt_helper.get_visible_parent(item);
		if (_isInstanceOf(visible_item, BaseHeader)) {
			update_selection_with_header(visible_item, ctrl_pressed, shift_pressed);
		}
		else {
			update_selection_with_row(/** @type {Row}*/ visible_item, ctrl_pressed, shift_pressed);
		}

		selected_indexes.sort(numeric_ascending_sort);
	};

	this.select_all = function () {
		if (!rows.length) {
			return;
		}

		selected_indexes = _.range(_.head(rows).idx, _.last(rows).idx + 1);
		last_single_selected_index = _.head(rows).idx;

		plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
	};

	this.clear_selection = function () {
		if (!selected_indexes.length) {
			return;
		}
		selected_indexes = [];
		last_single_selected_index = undefined;
		plman.ClearPlaylistSelection(cur_playlist_idx);
	};

	/**
	 * @return {boolean}
	 */
	this.has_selected_items = function () {
		return !!selected_indexes.length;
	};

	/**
	 * @return {number}
	 */
	this.selected_items_count = function () {
		return selected_indexes.length;
	};

	this.perform_internal_drag_n_drop = function () {
		this.enable_drag();
		is_internal_drag_n_drop_active = true;

		var cur_playlist_size = plman.PlaylistItemCount(cur_playlist_idx);
		var cur_playlist_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);
		var cur_selected_indexes = selected_indexes;

		var clipImg = gdi.CreateImage(20, 200);
		var grClip = clipImg.GetGraphics();

		grClip.FillSolidRect(0, 0, 20, 200, 0x5FFF00FF);
		clipImg.ReleaseGraphics(grClip);

		var effect = fb.DoDragDrop(window.ID, cur_playlist_selection, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link);

		is_internal_drag_n_drop_active = false;

		if (is_dragging) {
			// If drag operation was not cancelled, then it means that nor on_drag_drop, nor on_drag_leave event handlers
			// were triggered, which means that the items were most likely dropped inside the panel
			// (and relevant methods were not called because of async event processing)
			return;
		}

		function can_handle_move_drop() {
			// We can handle the 'move drop' properly only when playlist is still in the same state
			return cur_playlist_size === plman.PlaylistItemCount(cur_playlist_idx)
				&& _.isEqual(cur_selected_indexes, selected_indexes);
		}

		if (g_drop_effect.none === effect && can_handle_move_drop()) {
			// DROPEFFECT_NONE needs special handling, because on NT it
			// is returned for some move operations, instead of DROPEFFECT_MOVE.
			// See Q182219 for the details.

			var items_to_remove = [];
			var playlist_items = plman.GetPlaylistItems(cur_playlist_idx);
			_.forEach(cur_selected_indexes, function (idx) {
				var cur_item = playlist_items[idx];
				if (_.startsWith(cur_item.RawPath, 'file://') && !fso.FileExists(cur_item.Path)) {
					items_to_remove.push(idx);
				}
			});

			if (items_to_remove.length) {
				plman.ClearPlaylistSelection(cur_playlist_idx);
				plman.SetPlaylistSelection(cur_playlist_idx, items_to_remove, true);
				plman.RemovePlaylistSelection(cur_playlist_idx);
			}
		}
		else if (g_drop_effect.move === effect && can_handle_move_drop()) {
			plman.RemovePlaylistSelection(cur_playlist_idx);
		}
	};

	this.enable_drag = function () {
		clear_last_hover_row();
		is_dragging = true;
	};

	this.disable_drag = function () {
		clear_last_hover_row();
		is_dragging = false;
	};

	this.enable_external_drag = function () {
		this.enable_drag();
		is_internal_drag_n_drop_active = false;
	};

	/**
	 * @return {boolean}
	 */
	this.is_dragging = function () {
		return is_dragging;
	};

	/**
	 * @return {boolean}
	 */
	this.is_internal_drag_n_drop_active = function () {
		return is_internal_drag_n_drop_active;
	};

	/**
	 * Also calls repaint
	 *
	 * @param {?Row} hover_row
	 * @param {boolean} is_above
	 */
	this.drag = function (hover_row, is_above) {
		if (_.isNil(hover_row)) {
			clear_last_hover_row();
			return;
		}

		if (plman.IsPlaylistLocked(cur_playlist_idx)) {
			return;
		}

		var is_drop_top_selected = is_above;
		var is_drop_bottom_selected = !is_above;
		var is_drop_boundary_reached = hover_row.idx === 0 || (!is_above && hover_row.idx === rows.length - 1);

		if (is_internal_drag_n_drop_active && !utils.IsKeyPressed(VK_CONTROL)) {
			// Can't move selected item on itself
			var is_item_above_selected = hover_row.idx !== 0 && rows[hover_row.idx - 1].is_selected();
			var is_item_below_selected = hover_row.idx !== (rows.length - 1) && rows[hover_row.idx + 1].is_selected();
			is_drop_top_selected &= !hover_row.is_selected() && !is_item_above_selected;
			is_drop_bottom_selected &= !hover_row.is_selected() && !is_item_below_selected;
		}

		var cur_hover_item = hover_row;

		var needs_repaint = false;
		if (last_hover_row) {
			if (last_hover_row.idx === cur_hover_item.idx) {
				needs_repaint = last_hover_row.is_drop_top_selected !== is_drop_top_selected
					|| last_hover_row.is_drop_bottom_selected !== is_drop_bottom_selected
					|| last_hover_row.is_drop_boundary_reached !== is_drop_boundary_reached;
			}
			else {
				clear_last_hover_row();
				needs_repaint = true;
			}
		}
		else {
			needs_repaint = true;
		}

		cur_hover_item.is_drop_top_selected = is_drop_top_selected;
		cur_hover_item.is_drop_bottom_selected = is_drop_bottom_selected;
		cur_hover_item.is_drop_boundary_reached = is_drop_boundary_reached;

		if (needs_repaint) {
			cur_hover_item.repaint();
		}

		last_hover_row = cur_hover_item;
	};

	/**
	 * @return {boolean}
	 */
	this.can_drop = function () {
		return !plman.IsPlaylistLocked(cur_playlist_idx);
	};

	/**
	 * @param {boolean} copy_selection
	 */
	this.drop = function (copy_selection) {
		if (!is_dragging) {
			return;
		}

		is_dragging = false;
		if (!selected_indexes.length || !last_hover_row) {
			return;
		}

		if (!last_hover_row.is_drop_top_selected && !last_hover_row.is_drop_bottom_selected) {
			clear_last_hover_row();
			return;
		}

		var drop_idx = last_hover_row.idx;
		if (last_hover_row.is_drop_bottom_selected) {
			++drop_idx;
		}

		clear_last_hover_row();

		if (!copy_selection) {
			move_selection(drop_idx);
		}
		else {
			plman.UndoBackup(cur_playlist_idx);

			var cur_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);
			plman.ClearPlaylistSelection(cur_playlist_idx);
			plman.InsertPlaylistItems(cur_playlist_idx, drop_idx, cur_selection, true);
			plman.SetPlaylistFocusItem(cur_playlist_idx, drop_idx);
		}
	};

	/**
	 * @param {IDropTargetAction} action
	 */
	this.external_drop = function (action) {
		plman.ClearPlaylistSelection(cur_playlist_idx);

		var playlist_idx;
		if (!plman.PlaylistCount) {
			playlist_idx = plman.CreatePlaylist(0, 'Default');
			plman.ActivePlaylist = playlist_idx;
		}
		else {
			playlist_idx = cur_playlist_idx;
			plman.UndoBackup(cur_playlist_idx);
		}

		action.Playlist = playlist_idx;
		action.ToSelect = true;

		if (last_hover_row) {
			var drop_idx = last_hover_row.idx;
			if (last_hover_row.is_drop_bottom_selected) {
				++drop_idx;
			}
			action.Base = drop_idx;
		}
		else {
			action.Base = plman.PlaylistCount;
		}

		this.disable_drag();
	};

	this.copy = function () {
		if (!selected_indexes.length) {
			return fb.CreateHandleList();
		}

		var selected_items = plman.GetPlaylistSelectedItems(cur_playlist_idx);
		fb.CopyHandleListToClipboard(selected_items);
	};

	this.cut = function () {
		if (!selected_indexes.length) {
			return fb.CreateHandleList();
		}

		var selected_items = plman.GetPlaylistSelectedItems(cur_playlist_idx);

		if (fb.CopyHandleListToClipboard(selected_items)) {
			plman.UndoBackup(cur_playlist_idx);
			plman.RemovePlaylistSelection(cur_playlist_idx);
		}
	};

	this.paste = function () {
		if (!fb.CheckClipboardContents(window.ID)) {
			return;
		}

		var metadb_list = fb.GetClipboardContents(window.ID);
		if (!metadb_list || !metadb_list.Count) {
			return;
		}

		var insert_idx;
		if (selected_indexes.length) {
			if (is_selection_contiguous()) {
				insert_idx = _.last(selected_indexes) + 1;
			}
			else {
				insert_idx = plman.GetPlaylistFocusItemIndex(cur_playlist_idx) + 1;
			}
		}
		else {
			var focused_idx = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);
			insert_idx = (focused_idx !== -1) ? (focused_idx + 1) : rows.length;
		}

		plman.UndoBackup(cur_playlist_idx);
		plman.ClearPlaylistSelection(cur_playlist_idx);
		plman.InsertPlaylistItems(cur_playlist_idx, insert_idx, metadb_list, true);
		plman.SetPlaylistFocusItem(cur_playlist_idx, insert_idx);
	};

	/**
	 * @param {number} playlist_idx
	 */
	this.send_to_playlist = function (playlist_idx) {
		plman.UndoBackup(playlist_idx);
		plman.ClearPlaylistSelection(playlist_idx);
		plman.InsertPlaylistItems(playlist_idx, plman.PlaylistItemCount(playlist_idx), plman.GetPlaylistSelectedItems(cur_playlist_idx), true);
	};

	this.move_selection_up = function () {
		if (!selected_indexes.length) {
			return;
		}

		move_selection(Math.max(0, _.head(selected_indexes) - 1));
	};

	this.move_selection_down = function () {
		if (!selected_indexes.length) {
			return;
		}

		move_selection(Math.min(rows.length, _.last(selected_indexes) + 2));
	};

	/**
	 * @param {Row} row
	 * @param {boolean} ctrl_pressed
	 * @param {boolean} shift_pressed
	 */
	function update_selection_with_row(row, ctrl_pressed, shift_pressed) {
		if (shift_pressed) {
			selected_indexes = get_shift_selection(row.idx);

			plman.ClearPlaylistSelection(cur_playlist_idx);
			plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
		}
		else if (ctrl_pressed) {
			var is_selected = _.find(selected_indexes, function (idx) {
				return row.idx === idx;
			});

			if (is_selected) {
				_.remove(selected_indexes, function (idx) {
					return idx === row.idx;
				});
			}
			else {
				selected_indexes.push(row.idx);
			}

			last_single_selected_index = row.idx;

			plman.SetPlaylistSelectionSingle(cur_playlist_idx, row.idx, !is_selected);
		}
		else {
			selected_indexes.push(row.idx);
			last_single_selected_index = row.idx;

			plman.ClearPlaylistSelection(cur_playlist_idx);
			plman.SetPlaylistSelectionSingle(cur_playlist_idx, row.idx, true);
		}

		plman.SetPlaylistFocusItem(cur_playlist_idx, row.idx);
	}

	/**
	 * @param {BaseHeader} header
	 * @param {boolean} ctrl_pressed
	 * @param {boolean} shift_pressed
	 */
	function update_selection_with_header(header, ctrl_pressed, shift_pressed) {
		var row_indexes = header.get_row_indexes();

		if (shift_pressed) {
			selected_indexes = _.union(get_shift_selection(_.head(row_indexes)), row_indexes);
		}
		else if (ctrl_pressed) {
			var is_selected = _.difference(row_indexes, selected_indexes).length === 0;
			if (is_selected) {
				_.pullAll(selected_indexes, row_indexes);
			}
			else {
				selected_indexes = _.union(selected_indexes, row_indexes);
			}
			last_single_selected_index = _.head(row_indexes);
		}
		else {
			selected_indexes = row_indexes;
			last_single_selected_index = _.head(row_indexes);
		}

		plman.ClearPlaylistSelection(cur_playlist_idx);
		plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
		if (row_indexes.length) {
			plman.SetPlaylistFocusItem(cur_playlist_idx, _.head(row_indexes));
		}
	}

	/**
	 * @param {number} selected_idx
	 */
	function get_shift_selection(selected_idx) {
		var a = 0,
			b = 0;

		if (_.isNil(last_single_selected_index)) {
			last_single_selected_index = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);
			if (-1 === last_single_selected_index) {
				last_single_selected_index = 0;
			}
		}

		if (cnt_helper.is_item_visible(rows[last_single_selected_index])) {
			if (last_single_selected_index < selected_idx) {
				a = last_single_selected_index;
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = last_single_selected_index;
			}
		}
		else {
			var last_selected_header = cnt_helper.get_visible_parent(rows[last_single_selected_index]);
			if (last_single_selected_index < selected_idx) {
				a = _.head(last_selected_header.get_row_indexes());
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = _.last(last_selected_header.get_row_indexes());
			}
		}

		return _.range(a, b + 1);
	}

	function clear_last_hover_row() {
		if (last_hover_row) {
			last_hover_row.is_drop_bottom_selected = false;
			last_hover_row.is_drop_top_selected = false;
			last_hover_row.is_drop_boundary_reached = false;
			last_hover_row.repaint();
		}
	}

	/**
	 * @param {number} new_idx
	 */
	function move_selection(new_idx) {
		plman.UndoBackup(cur_playlist_idx);

		if (is_selection_contiguous()) {
			var focus_idx = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);
			var move_delta;
			if (new_idx < focus_idx) {
				move_delta = -(_.head(selected_indexes) - new_idx);
			}
			else {
				move_delta = new_idx - (_.last(selected_indexes) + 1);
			}

			plman.MovePlaylistSelection(cur_playlist_idx, move_delta);
		}
		else {
			var item_count_before_drop_idx = _count(selected_indexes, function (idx) {
				return idx < new_idx;
			});

			move_delta = -(plman.PlaylistItemCount(cur_playlist_idx) - selected_indexes.length - (new_idx - item_count_before_drop_idx));

			// Move to the end to make it contiguous, then back to drop_idx
			plman.MovePlaylistSelection(cur_playlist_idx, plman.PlaylistItemCount(cur_playlist_idx));
			plman.MovePlaylistSelection(cur_playlist_idx, move_delta);
		}
	}

	/**
	 * @return {boolean}
	 */
	function is_selection_contiguous() {
		var is_contiguous = true;
		_.forEach(selected_indexes, function (item, i) {
			if (i === 0) {
				return true;
			}
			if ((selected_indexes[i] - selected_indexes[i - 1]) !== 1) {
				is_contiguous = false;
				return false;
			}
		});

		return is_contiguous;
	}

	/**
	 * @param {number} a
	 * @param {number} b
	 * @return {number}
	 */
	function numeric_ascending_sort(a, b) {
		return (a - b);
	}

	/**
	 * @const
	 * @type {ContentNavigationHelper}
	 */
	var cnt_helper = cnt_arg.helper;

	/**
	 * @const
	 * @type {Array<Row>}
	 */
	var rows = cnt_arg.rows;
	/**
	 * @const
	 * @type {number}
	 */
	var cur_playlist_idx = cur_playlist_idx_arg;

	/** @type {Array<number>} */
	var selected_indexes = [];
	/** @type {?number} */
	var last_single_selected_index = undefined;

	/** @type {boolean} */
	var is_dragging = false;
	/** @type {boolean} */
	var is_internal_drag_n_drop_active = false;
	/** @type {?Row} */
	var last_hover_row = undefined;

	this.initialize_selection();
}

/**
 * @param {PlaylistContent} cnt_arg
 * @constructor
 */
function CollapseHandler(cnt_arg) {
	this.on_content_change = function () {
		headers = cnt.sub_items;
		this.changed = false;

		if (g_properties.collapse_on_playlist_switch) {
			if (g_properties.auto_colapse) {
				this.collapse_all_but_now_playing()
			}
			else {
				this.collapse_all();
			}
		}
	};

	/**
	 * @param {BaseHeader} item
	 */
	this.toggle_collapse = function (item) {
		this.changed = true;
		set_collapsed_state_recursive(item, !item.is_collapsed);

		trigger_callback();
	};

	/**
	 * @param {BaseHeader} item
	 */
	this.collapse = function (item) {
		this.changed = set_collapsed_state_recursive(item, true);

		trigger_callback();
	};

	/**
	 * @param {BaseHeader} item
	 */
	this.expand = function (item) {
		this.changed = set_collapsed_state_recursive(item, false);

		trigger_callback();
	};

	this.collapse_all = function () {
		this.changed = false;
		_.forEach(headers, _.bind(function (item) {
			this.changed |= set_collapsed_state_recursive(item, true);
		}, this));

		trigger_callback();
	};

	this.collapse_all_but_now_playing = function () {
		this.changed = false;
		_.forEach(headers, _.bind(function (item) {
			if (item.is_playing()) {
				this.changed |= set_collapsed_state_recursive(item, false);
				return;
			}
			this.changed |= set_collapsed_state_recursive(item, true);
		}, this));

		trigger_callback();
	};

	this.expand_all = function () {
		this.changed = false;
		_.forEach(headers, _.bind(function (item) {
			this.changed |= set_collapsed_state_recursive(item, false);
		}, this));

		trigger_callback();
	};

	/**
	 * @param {function()} on_collapse_change_callback_arg
	 */
	this.set_callback = function (on_collapse_change_callback_arg) {
		on_collapse_change_callback = on_collapse_change_callback_arg;
	};

	function trigger_callback() {
		if (that.changed && on_collapse_change_callback) {
			on_collapse_change_callback();
		}
	}

	/**
	 * @param {BaseHeader} header
	 * @param {boolean} is_collapsed
	 * @return {boolean} true if changed, false - otherwise
	 */
	function set_collapsed_state_recursive(header, is_collapsed) {
		var changed = header.is_collapsed !== is_collapsed;
		header.is_collapsed = is_collapsed;

		var sub_items = header.sub_items;
		if (_isInstanceOf(_.head(sub_items), Row)) {
			return changed;
		}

		_.forEach(sub_items, function (item) {
			changed |= set_collapsed_state_recursive(item, is_collapsed);
		});

		return changed;
	}

	/** @type {boolean} */
	this.changed = false;

	var that = this;

	/**
	 * @const
	 * @type {PlaylistContent}
	 */
	var cnt = cnt_arg;

	/** @type {Array<BaseHeader>} */
	var headers = cnt_arg.sub_items;
	/** @type {?function()} */
	var on_collapse_change_callback = undefined;
}

/**
 * @param {Array<Row>} rows_arg
 * @param {number} cur_playlist_idx_arg
 * @constructor
 */
function QueueHandler(rows_arg, cur_playlist_idx_arg) {
	this.initialize_queue = function () {
		if (queued_rows.length) {
			reset_queued_status();
		}

		var queue_contents = plman.GetPlaybackQueueContents();
		if (!queue_contents.length) {
			return;
		}

		queue_contents.forEach(function (queued_item, i) {
			if (queued_item.PlaylistIndex !== cur_playlist_idx || queued_item.PlaylistItemIndex === -1) {
				return;
			}

			var cur_queued_row = rows[queued_item.PlaylistItemIndex];
			var has_row = _.find(queued_rows, function (queued_row) {
				return queued_row.idx === cur_queued_row.idx;
			});

			if (!has_row) {
				cur_queued_row.queue_idx = i + 1;
				cur_queued_row.queue_idx_count = 1;
			}
			else {
				cur_queued_row.queue_idx_count++;
			}

			queued_rows.push(cur_queued_row);
		});
	};

	/**
	 * @param {Row} row
	 */
	this.add_row = function (row) {
		if (!row) {
			return;
		}

		plman.AddPlaylistItemToPlaybackQueue(cur_playlist_idx, row.idx);
	};

	/**
	 * @param {Row} row
	 */
	this.remove_row = function (row) {
		if (!row) {
			return;
		}

		var idx = plman.FindPlaybackQueueItemIndex(row.metadb, cur_playlist_idx, row.idx);
		if (idx !== -1) {
			plman.RemoveItemFromPlaybackQueue(idx);
		}
	};

	this.flush = function () {
		plman.FlushPlaybackQueue();
	};

	this.has_items = function () {
		return !!plman.GetPlaybackQueueHandles().Count;
	};

	function reset_queued_status() {
		if (!queued_rows.length) {
			return
		}

		queued_rows.forEach(function (item) {
			item.queue_idx = undefined;
			item.queue_idx_count = 0;
		});

		queued_rows = [];
	}

	/**
	 * @const
	 * @type {number}
	 */
	var cur_playlist_idx = cur_playlist_idx_arg;
	/**
	 * @const
	 * @type {Array<Row>}
	 */
	var rows = rows_arg;

	/** @type {Array<Row>} */
	var queued_rows = [];

	this.initialize_queue();
}

/**
 * @constructor
 */
function PlaylistManager(x, y, w, h) {
	// #region Callback Implementation
	this.on_paint = function (gr) {
		if (!info_text) {
			var cur_playlist_idx = plman.ActivePlaylist;
			var metadb_list = plman.GetPlaylistSelectedItems(cur_playlist_idx);
			var is_selected = true;

			if (!metadb_list.Count) {
				metadb_list = plman.GetPlaylistItems(cur_playlist_idx);
				is_selected = false;
			}

			var track_count = metadb_list.Count;
			var tracks_text = '';
			var duration_text = '';
			if (track_count > 0) {
				tracks_text = track_count.toString() + (track_count > 1 ? ' tracks' : ' track');
				if (is_selected) {
					tracks_text += ' selected';
				}

				var duration = Math.round(metadb_list.CalcTotalDuration());
				if (duration) {
					duration_text = utils.FormatDuration(duration);
				}
			}

			info_text = plman.GetPlaylistName(cur_playlist_idx);
			if (tracks_text) {
				info_text += ': ' + tracks_text;
			}
			if (duration_text) {
				info_text += ', ' + 'Length: ' + duration_text;
			}
		}

		if (this.panel_state === state.pressed
			|| (this.panel_state === state.normal && !this.hover_alpha)
			|| (this.panel_state === state.hovered && this.hover_alpha === 255)) {
			if (image_normal) {
				image_normal = null;
			}
			if (image_hovered) {
				image_hovered = null;
			}

			draw_on_image(gr, this.x, this.y, this.w, this.h, this.panel_state);
		}
		else {
			if (!image_normal) {
				var image = gdi.CreateImage(this.w, this.h);
				var image_gr = image.GetGraphics();

				draw_on_image(image_gr, 0, 0, this.w, this.h, state.normal);

				image.ReleaseGraphics(image_gr);
				image_normal = image;
			}

			if (!image_hovered) {
				var image = gdi.CreateImage(this.w, this.h);
				var image_gr = image.GetGraphics();

				draw_on_image(image_gr, 0, 0, this.w, this.h, state.hovered);

				image.ReleaseGraphics(image_gr);
				image_hovered = image;
			}

			gr.DrawImage(image_normal, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
			gr.DrawImage(image_hovered, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, this.hover_alpha);
		}
	};

	this.on_playlist_modified = function () {
		info_text = undefined;
		this.repaint();
	};

	this.on_mouse_move = function (x, y, m) {
		if (this.panel_state === state.pressed) {
			return;
		}

		change_state(this.trace(x, y) ? state.hovered : state.normal);
	};

	this.on_mouse_lbtn_down = function (x, y, m) {
		if (!this.trace(x, y)) {
			return;
		}

		change_state(state.pressed);
	};

	this.on_mouse_lbtn_up = function (x, y, m) {
		var was_pressed = this.panel_state === state.pressed;

		if (!this.trace(x, y)) {
			change_state(state.normal);
			return;
		}
		else {
			change_state(state.hover);
			if (!was_pressed) {
				return;
			}
		}

		var cpm = window.CreatePopupMenu();

		var playlist_count = plman.PlaylistCount;

		cpm.AppendMenuItem(MF_STRING, 1, 'Playlist manager... \tCtrl+M');
		cpm.AppendMenuSeparator();
		cpm.AppendMenuItem(MF_STRING, 3, 'Create New Playlist \tCtrl+N');
		cpm.AppendMenuSeparator();
		var playlists_start_id = 4;
		for (var i = 0; i < playlist_count; ++i) {
			cpm.AppendMenuItem(MF_STRING, playlists_start_id + i, plman.GetPlaylistName(i).replace(/&/g, '&&') + ' [' + plman.PlaylistItemCount(i) + ']' + (plman.IsAutoPlaylist(i) ? ' (Auto)' : '') + (i === plman.PlayingPlaylist ? ' \t(Now Playing)' : ''));
		}

		var id = cpm.TrackPopupMenu(x, y);
		switch (id) {
			case 1:
				fb.RunMainMenuCommand('View/Playlist Manager');
				break;
			case 3:
				plman.CreatePlaylist(playlist_count, '');
				plman.ActivePlaylist = plman.PlaylistCount - 1;
				break;
		}

		var playlist_idx = id - playlists_start_id;
		if (playlist_idx < playlist_count && playlist_idx >= 0) {
			plman.ActivePlaylist = playlist_idx;
		}

		this.repaint();
	};

	this.on_mouse_rbtn_down = function (x, y, m) {
		if (!this.trace(x, y)) {
			return true;
		}

		change_state(state.pressed);
	};

	this.on_mouse_rbtn_up = function (x, y, m) {
		var was_pressed = this.panel_state === state.pressed;

		if (!this.trace(x, y)) {
			change_state(state.normal);
			return true;
		}
		else {
			change_state(state.hover);
			if (!was_pressed) {
				return true;
			}
		}

		var cmm = new Context.MainMenu();

		PlaylistManager.append_playlist_info_visibility_context_menu_to(cmm);

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		cmm.execute(x, y);

		return true;
	};

	this.on_mouse_leave = function () {
		change_state(state.normal);
	};

	// #endregion

	this.reinitialize = function () {
		info_text = undefined;
		this.panel_state = state.normal;
		this.hover_alpha = 0;
	};

	this.set_w = function (w) {
		this.w = w;
	};

	this.trace = function (x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};

	/**
	 * @param {KeyActionHandler} key_handler
	 */
	this.register_key_actions = function (key_handler) {
		key_handler.register_key_action(VK_KEY_N,
			_.bind(function (modifiers) {
				if (modifiers.ctrl) {
					plman.CreatePlaylist(plman.PlaylistCount, '');
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				}
			}, this));

		key_handler.register_key_action(VK_KEY_M,
			_.bind(function (modifiers) {
				if (modifiers.ctrl) {
					fb.RunMainMenuCommand('View/Playlist Manager');
				}
			}, this));
	};

	var throttled_repaint = _.throttle(_.bind(function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}, this), 1000 / 60);
	this.repaint = function () {
		throttled_repaint();
	};

	/**
	 * @param {IGdiGraphics} gr
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @param {state} panel_state
	 */
	function draw_on_image(gr, x, y, w, h, panel_state) {

		var text_color;
		var bg_color;

		switch (panel_state) {
			case state.normal: {
				text_color = g_pl_colors.playlist_mgr_text_normal;
				bg_color = g_theme.colors.panel_front;
				break;
			}
			case state.hovered: {
				text_color = g_pl_colors.playlist_mgr_text_hovered;
				bg_color = g_theme.colors.panel_front;
				break
			}
			case state.pressed: {
				text_color = g_pl_colors.playlist_mgr_text_pressed;
				bg_color = g_theme.colors.panel_back;
				break
			}
		}

		gr.FillSolidRect(x, y, w, h, bg_color);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		var p = 10;
		var right_pad = p;

		if (plman.IsPlaylistLocked(plman.ActivePlaylist)) {
			// Position above scrollbar for eye candy
			var sbar_x = w - g_properties.scrollbar_w - g_properties.scrollbar_right_pad;
			var lock_text = '\uF023';
			var lock_w = Math.ceil(
				/** @type {!number} */
				gr.MeasureString(lock_text, gdi.Font('FontAwesome', 12), 0, 0, 0, 0).Width
			);
			gr.DrawString(lock_text, gdi.Font('FontAwesome', 12), text_color, sbar_x + Math.round((g_properties.scrollbar_w - lock_w) / 2), 0, 8, h, g_string_format_center.value());

			right_pad += lock_w;
		}

		var info_x = x + p;
		var info_y = y;
		var info_w = w - (info_x - x) - right_pad;
		var info_h = h - 2;

		var info_text_format = StringFormat();
		info_text_format.alignment = StringAlignment.center;
		info_text_format.line_alignment = StringAlignment.center;
		info_text_format.trimming = StringTrimming.ellipsis_char;
		info_text_format.format_flags =
			/** @type {StringFormatFlags} */ StringFormatFlags.no_wrap | StringFormatFlags.line_limit;

		gr.DrawString(info_text, g_pl_fonts.title_selected, text_color, info_x, info_y, info_w, info_h, info_text_format.value());
	}

	/**
	 * @param {state} new_state
	 */
	function change_state(new_state) {
		if (that.panel_state === new_state) {
			return;
		}

		var old_state = that.panel_state;
		that.panel_state = new_state;

		if (old_state === state.pressed) {
			// Mouse click action opens context menu, which triggers on_mouse_leave, thus causing weird hover animation
			that.hover_alpha = 0;
		}
		if (new_state === state.hovered || new_state === state.normal) {
			alpha_timer.start()
		}

		that.repaint();
	}

	//public:
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	/** @enum {number} */
	var state = {
		normal:  0,
		hovered: 1,
		pressed: 2
	};

	/** @type {state} */
	this.panel_state = state.normal;
	/** @type {number} */
	this.hover_alpha = 0;

	//private:
	var that = this;

	/** @type {?string} */
	var info_text = undefined;

	var alpha_timer = new _alpha_timer([this], function (item) {
		return item.panel_state === state.hovered;
	});

	/** @type {?GdiBitmap} */
	var image_normal = null;
	/** @type {?GdiBitmap} */
	var image_hovered = null;
}

/**
 * @param {Context.Menu} parent_menu
 */
PlaylistManager.append_playlist_info_visibility_context_menu_to = function (parent_menu) {
	parent_menu.append_item(
		'Show playlist manager',
		function () {
			g_properties.show_playlist_info = !g_properties.show_playlist_info;
		},
		{is_checked: g_properties.show_playlist_info}
	);
};

/**
 * @constructor
 */
function GroupingHandler() {
	this.on_playlists_changed = function () {
		var playlist_count = plman.PlaylistCount;
		var new_playlists = [];
		for (var i = 0; i < playlist_count; ++i) {
			new_playlists.push(plman.GetPlaylistName(i));
		}

		var save_needed = false;

		if (playlists.length > playlist_count) {
			// removed

			var playlists_to_remove = _.difference(playlists, new_playlists);
			playlists_to_remove.forEach(function (playlist_name) {
				delete settings.playlist_group_data[playlist_name];
				delete settings.playlist_custom_group_data[playlist_name];
			});

			save_needed = true;
		}
		else if (playlists.length === playlist_count) {
			// may be renamed?

			var playlist_difference_new = _.difference(new_playlists, playlists);
			var playlist_difference_old = _.difference(playlists, new_playlists);
			if (playlist_difference_old.length === 1) {
				// playlist_difference_new.length > 0 and playlist_difference_old.length === 0 means that
				// playlists contained multiple items of the same name (one of which was changed)
				var old_name = playlist_difference_old[0];
				var new_name = playlist_difference_new[0];

				var group_name = settings.playlist_group_data[old_name];
				var custom_group = settings.playlist_custom_group_data[old_name];

				settings.playlist_group_data[new_name] = group_name;
				if (custom_group) {
					settings.playlist_custom_group_data[new_name] = custom_group;
				}

				delete settings.playlist_group_data[old_name];
				delete settings.playlist_custom_group_data[old_name];

				save_needed = true;
			}
		}

		playlists = new_playlists;
		if (save_needed) {
			settings.save();
		}
	};

	/**
	 * @param {string} cur_playlist_name_arg
	 */
	this.set_active_playlist = function (cur_playlist_name_arg) {
		cur_playlist_name = cur_playlist_name_arg;
		var group_name = settings.playlist_group_data[cur_playlist_name];

		cur_group = null;
		if (group_name) {
			if (group_name === 'user_defined') {
				cur_group = settings.playlist_custom_group_data[cur_playlist_name];
			}
			else if (_.includes(group_by_name, group_name)) {
				cur_group = settings.group_presets[group_by_name.indexOf(group_name)];
			}

			if (!cur_group) {
				delete settings.playlist_group_data[cur_playlist_name];
				group_name = '';
			}
		}

		if (!cur_group) {
			group_name = settings.default_group_name;
			cur_group = settings.group_presets[group_by_name.indexOf(group_name)];
		}

		assert(!_.isNil(cur_group),
			ArgumentError, 'group_name', group_name);
	};

	/**
	 * @return {string}
	 */
	this.get_query = function () {
		return cur_group.group_query;
	};

	/**
	 * @return {string}
	 */
	this.get_title_query = function () {
		return cur_group.title_query;
	};

	/**
	 * @return {string}
	 */
	this.get_sub_title_query = function () {
		return cur_group.sub_title_query;
	};

	/**
	 * @return {string}
	 */
	this.get_query_name = function () {
		return cur_group.name;
	};

	/**
	 * @return {boolean}
	 */
	this.show_cd = function () {
		return cur_group.show_cd;
	};

	/**
	 * @return {boolean}
	 */
	this.show_date = function () {
		return cur_group.show_date;
	};

	/**
	 * @param {Context.Menu} parent_menu
	 * @param {function()} on_execute_callback_fn
	 */
	this.append_menu_to = function (parent_menu, on_execute_callback_fn) {
		var group = new Context.Menu('Grouping');
		parent_menu.append(group);

		group.append_item(
			'Manage presets',
			function () {
				manage_groupings(on_execute_callback_fn);
			}
		);

		group.append_separator();

		group.append_item(
			'Reset to default',
			function () {
				delete settings.playlist_custom_group_data[cur_playlist_name];
				delete settings.playlist_group_data[cur_playlist_name];

				cur_group = settings.group_presets[group_by_name.indexOf(settings.default_group_name)];

				settings.save();
				settings.send_sync();

				on_execute_callback_fn();
			}
		);

		group.append_separator();

		var group_by_text = 'by...';
		if (cur_group.name === 'user_defined') {
			group_by_text += ' [' + this.get_query() + ']';
		}
		group.append_item(
			group_by_text,
			function () {
				request_user_query(on_execute_callback_fn);
			},
			{is_radio_checked: cur_group.name === 'user_defined'}
		);

		settings.group_presets.forEach(function (group_item) {
			var group_by_text = group_item.description;
			if (group_item.name === settings.default_group_name) {
				group_by_text += ' [default]';
			}

			group.append_item(
				group_by_text,
				function () {
					cur_group = group_item;

					delete settings.playlist_custom_group_data[cur_playlist_name];

					settings.playlist_group_data[cur_playlist_name] = group_item.name;
					settings.save();
					settings.send_sync();

					on_execute_callback_fn();
				},
				{is_radio_checked: cur_group.name === group_item.name}
			);
		})
	};

	/** @param {?} value */
	this.sync_state = function (value) {
		settings.receive_sync(value);
		initalize_name_to_preset_map();
		this.set_active_playlist(cur_playlist_name);
	};

	/**
	 * @param {function()} on_execute_callback_fn
	 */
	function request_user_query(on_execute_callback_fn) {
		var on_ok_fn = function (ret_val) {
			var custom_group = new GroupingHandler.Settings.Group('user_defined', '', ret_val[0], ret_val[1]);
			cur_group = custom_group;

			settings.playlist_group_data[cur_playlist_name] = 'user_defined';
			settings.playlist_custom_group_data[cur_playlist_name] = custom_group;

			settings.save();
			settings.send_sync();

			on_execute_callback_fn();
		};

		var field_values =
			cur_group.name === 'user_defined'
				? [cur_group.group_query, cur_group.title_query]
				: ['', '[%album artist%]'];

		utils.ShowHtmlDialog(
			0,
			'file://' + g_theme_path + 'html\\MsgBox.html',
			{
				width: 650,
				height: 425,
				data: [
					'Foobar2000: Group by',
					['Grouping Query', 'Title Query'],
					field_values,
					on_ok_fn
				],
				context_menu:  true
			});
	}

	/**
	 * @param {function()} on_execute_callback_fn
	 */
	function manage_groupings(on_execute_callback_fn) {
		var on_ok_fn = function (ret_val_json) {
			ret_val = JSON.parse(ret_val_json);

			settings.group_presets = ret_val.group_presets;
			settings.default_group_name = ret_val.default_group_name;
			initalize_name_to_preset_map();

			cur_group = settings.group_presets[group_by_name.indexOf(ret_val.current_group_name)];
			settings.playlist_group_data[cur_playlist_name] = ret_val.current_group_name;

			delete settings.playlist_custom_group_data[cur_playlist_name];

			settings.save();
			settings.send_sync();

			on_execute_callback_fn();
		};

		utils.ShowHtmlDialog(
			0,
			'file://' + g_theme_path + 'html\\GroupPresetsMngr.html',
			{
				width: 650,
				height: 425,
				data: [
					JSON.stringify({
						group_presets: settings.group_presets,
						current_group_name: cur_group.name === 'user_defined' ? settings.group_presets[0].name : cur_group.name,
						default_group_name: settings.default_group_name
					}),
					on_ok_fn
				]
			});
	}

	function initialize_playlists() {
		playlists = [];
		var playlist_count = plman.PlaylistCount;
		for (var i = 0; i < playlist_count; ++i) {
			playlists.push(plman.GetPlaylistName(i));
		}
	}

	function cleanup_settings() {
		_.forEach(settings.playlist_group_data, function (item, i) {
			if (!_.includes(playlists, i)) {
				delete settings.playlist_group_data[i];
			}
		});

		_.forEach(settings.playlist_custom_group_data, function (item, i) {
			if (!_.includes(playlists, i)) {
				delete settings.playlist_custom_group_data[i];
			}
		});

		settings.save();
	}

	function initalize_name_to_preset_map() {
		group_by_name = settings.group_presets.map(function (item) {
			return item.name;
		});
	}

	/**
	 * @const
	 * @type {GroupingHandler.Settings}
	 */
	var settings = new GroupingHandler.Settings();
	/** @type {?Array<string>} */
	var playlists = [];
	/** @type {string} */
	var cur_playlist_name = '';
	/** @type {?GroupingHandler.Settings.Group} */
	var cur_group = undefined;
	/** @type {?Array<string>} */
	var group_by_name = undefined;

	initalize_name_to_preset_map();
	initialize_playlists();
	cleanup_settings();
}

/**
 * @constructor
 */
GroupingHandler.Settings = function () {
	this.load = function () {
		this.playlist_group_data = JSON.parse(g_properties.playlist_group_data);
		this.playlist_custom_group_data = JSON.parse(g_properties.playlist_custom_group_data);
		this.default_group_name = g_properties.default_group_name;
		this.group_presets = JSON.parse(g_properties.group_presets);
	};

	this.save = function () {
		g_properties.playlist_group_data = JSON.stringify(this.playlist_group_data);
		g_properties.playlist_custom_group_data = JSON.stringify(this.playlist_custom_group_data);
		g_properties.default_group_name = this.default_group_name;
		g_properties.group_presets = JSON.stringify(this.group_presets);
	};

	this.send_sync = function () {
		var syncData = {
			g_playlist_group_data:        g_properties.playlist_group_data,
			g_playlist_custom_group_data: g_properties.playlist_custom_group_data,
			g_default_group_name:         g_properties.default_group_name,
			g_group_presets:              g_properties.group_presets
		};

		window.NotifyOthers('sync_group_query_state', syncData);
	};

	/**
	 * @param {{g_playlist_group_data, g_playlist_custom_group_data, g_default_group_name, g_group_presets}} settings_data
	 */
	this.receive_sync = function (settings_data) {
		g_properties.playlist_group_data = settings_data.g_playlist_group_data;
		g_properties.playlist_custom_group_data = settings_data.g_playlist_custom_group_data;
		g_properties.default_group_name = settings_data.g_default_group_name;
		g_properties.group_presets = settings_data.g_group_presets;

		this.load();
	};

	function fixup_g_properties() {
		if (!g_properties.playlist_group_data || !_.isObject(JSON.parse(g_properties.playlist_group_data))) {
			g_properties.playlist_group_data = JSON.stringify({});
		}

		if (!g_properties.playlist_custom_group_data || !_.isObject(JSON.parse(g_properties.playlist_custom_group_data))) {
			g_properties.playlist_custom_group_data = JSON.stringify({});
		}

		if (!g_properties.group_presets || !_.isArray(JSON.parse(g_properties.group_presets))) {
			g_properties.group_presets = JSON.stringify([
				new CtorGroupData('artist', 'by artist', '%album artist%', undefined, ''),
				new CtorGroupData('artist_album', 'by artist / album', '%album artist%%album%', undefined, undefined, {
					show_date: true
				}),
				new CtorGroupData('artist_album_disc', 'by artist / album / disc number', '%album artist%%album%%discnumber%', undefined, undefined, {
					show_date: true,
					show_cd:   true
				}),
				new CtorGroupData('path', 'by path', '$directory_path(%path%)', undefined, undefined, {
					show_date: true
				}),
				new CtorGroupData('date', 'by date', '%date%', undefined, undefined, {
					show_date: true
				})
			]);
		}

		if (!g_properties.default_group_name || !_.isString(g_properties.default_group_name)) {
			g_properties.default_group_name = 'artist_album_disc';
		}
	}

	var CtorGroupData = GroupingHandler.Settings.Group;

	/** @type {Object<string, string>} */
	this.playlist_group_data = {};
	/** @type {Object<string, GroupingHandler.Settings.Group>} */
	this.playlist_custom_group_data = {};
	/** @type {string} */
	this.default_group_name = '';
	/** @type {Array<GroupingHandler.Settings.Group>} */
	this.group_presets = [];

	fixup_g_properties();
	this.load();
};

/**
 * @param {string} name
 * @param {string} description
 * @param {?string=} [group_query='']
 * @param {?string=} [title_query='[%album artist%]']
 * @param {?string=} [sub_title_query='[%album%[ - %setsubtitle%]]']
 * @param {object=}  [options={}]
 * @param {boolean=} [options.show_date=false]
 * @param {boolean=} [options.show_cd=false]
 * @constructor
 * @struct
 */
GroupingHandler.Settings.Group = function (name, description, group_query, title_query, sub_title_query, options) {
	/** @type {string} */
	this.name = name;
	/** @type {string} */
	this.description = description;
	/** @type {string} */
	this.group_query = !_.isNil(group_query) ? group_query : '';
	/** @type {string} */
	this.title_query = !_.isNil(title_query) ? title_query : '[%album artist%]';
	/** @type {string} */
	this.sub_title_query = !_.isNil(sub_title_query) ? sub_title_query : '[%album%[ - %setsubtitle%]]';
	/** @type {boolean} */
	this.show_date = !!(options && options.show_date);
	/** @type {boolean} */
	this.show_cd = !!(options && options.show_cd);
};

Header.grouping_handler = new GroupingHandler();

/**
 * @param{number} max_cache_size_arg
 * @constructor
 */
function ArtImageCache(max_cache_size_arg) {
	/**
	 * @param {FbMetadbHandle} metadb
	 * @param {GdiBitmap} img
	 * @param {LinkedList.Iterator<FbMetadbHandle>} queue_iterator
	 * @constructor
	 */
	function CacheItem(metadb, img, queue_iterator) {
		this.metadb = metadb;
		this.img = img;
		this.queue_iterator = queue_iterator;
	}

	/**
	 * @param {FbMetadbHandle} metadb
	 * @return {?GdiBitmap}
	 */
	this.get_image_for_meta = function (metadb) {
		var cache_item = cache[metadb.Path];
		if (!cache_item) {
			return undefined; // undefined means Not Loaded
		}

		var img = cache_item.img;
		move_item_to_top(cache_item);

		return img;
	};

	/**
	 * @param {GdiBitmap} img
	 * @param {FbMetadbHandle} metadb
	 */
	this.add_image_for_meta = function (img, metadb) {
		var cache_item = cache[metadb.Path];
		if (cache_item) {
			cache_item.img = img;
			move_item_to_top(cache_item);
		}
		else {
			queue.push_front(metadb);
			cache[metadb.Path] = new CacheItem(metadb, img, queue.begin());
			if (queue.length() > max_cache_size) {
				delete cache[queue.back().Path];
				queue.pop_back();
			}
		}
	};

	this.clear = function () {
		cache = {};
		queue.clear();
	};

	/**
	 * @param {CacheItem} cache_item
	 */
	function move_item_to_top(cache_item) {
		queue.remove(cache_item.queue_iterator);
		queue.push_front(cache_item.metadb);
		cache_item.queue_iterator = queue.begin();
	}

	/**
	 * @const
	 * @type {number}
	 */
	var max_cache_size = max_cache_size_arg;
	/** @type {LinkedList<FbMetadbHandle>} */
	var queue = new LinkedList();
	/** @type {Object<string,CacheItem>} */
	var cache = {};
}

Header.art_cache = new ArtImageCache(200);

var playlist = new PlaylistPanel(0, 0);
playlist.initialize();
