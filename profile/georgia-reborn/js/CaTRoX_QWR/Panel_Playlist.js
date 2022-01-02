// ==PREPROCESSOR==
// @name 'Playlist Panel'
// @author 'design: eXtremeHunter'
// @author 'everything else: TheQwertiest'
// ==/PREPROCESSOR==

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;
var trace_initialize_list_performance = false;

g_script_list.push('Panel_Playlist.js');

// Should be used only for default panel properties initialization
var g_is_mini_panel = window.Name.toLowerCase().includes('mini');

// Niceties:
// TODO: grouping presets manager: other EsPlaylist grouping features - sorting, playlist association
// Low priority:
// TODO: bug marc2003 about on_visibility_change callback
// TODO: registration for on_key handlers
// TODO: research the source of hangs with big art image loading (JScript? fb2k?)
// TODO: measure draw vs backend performance
g_properties.add_properties(
	{
		rows_in_header:         ['user.header.normal.row_count', 4],
		rows_in_compact_header: ['user.header.compact.row_count', 3],

		show_playlist_info: ['user.playlist_info.show', true],

		show_header:        ['user.header.show', true],
		use_compact_header: ['user.header.use_compact', g_is_mini_panel],
		show_album_art:     ['user.header.this.art.show', true],
		auto_album_art:     ['user.header.this.art.auto', false],
		show_group_info:    ['user.header.info.show', true],
		show_disc_header:   ['user.header.disc_header.show', true],

		alternate_row_color:  ['user.row.alternate_color', false],
		show_playcount:       ['user.row.play_count.show', g_component_playcount],
		show_rating:          ['user.row.rating.show', g_component_playcount && !g_is_mini_panel],
		use_rating_from_tags: ['user.row.rating.from_tags', false],
		show_queue_position:  ['user.row.queue_position.show', true],

		auto_collapse:               ['user.header.collapse.auto', g_is_mini_panel],
		collapse_on_playlist_switch: ['user.header.collapse.on_playlist_switch', false],
		collapse_on_start:           ['user.header.collapse.on_start', false],

		// Default values for grouping data are set in it's class ctor
		playlist_group_data:        ['system.playlist.grouping.data_list', ''],
		playlist_custom_group_data: ['system.playlist.grouping.custom_data_list', ''],
		default_group_name:         ['system.playlist.grouping.default_preset_name', ''],
		group_presets:              ['system.playlist.grouping.presets', '']
	}
);

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

var playlistFontsCreated = false;
var playlist_geo = {};
let g_pl_fonts = {};

function createPlaylistFonts() {
	var playlistSize = pref.font_size_playlist;
	var headerSize = pref.font_size_playlist_header;

	function font(name, size, style) {
		return gdi.Font(name, is_4k ? size * 2 : size, style);
	}
	g_pl_fonts = {
		title_normal:   font('Segoe Ui', playlistSize),
		title_selected: font('Segoe Ui', playlistSize),
		title_playing:  font('Segoe Ui', playlistSize),

		artist_normal:          font('Segoe Ui Semibold', headerSize + 3),
		artist_playing:         font('Segoe Ui Semibold', headerSize + 3, g_font_style.underline),
		artist_normal_compact:  font('Segoe Ui Semibold', headerSize),
		artist_playing_compact: font('Segoe Ui Semibold', headerSize, g_font_style.underline),
		album:          font('Segoe Ui Semibold', headerSize),
		date:           font('Segoe UI Semibold', headerSize + 5, g_font_style.italic),
		date_compact:   font('Segoe UI Semibold', headerSize),
		info:           font('Segoe Ui', playlistSize - 1),
		cover:          font('Segoe Ui Semibold', playlistSize - 1),

		playcount:      font('Segoe Ui', playlistSize - 3),
		rating_not_set: font('Segoe Ui Symbol', playlistSize + 2),
		rating_set:     font('Segoe Ui Symbol', playlistSize + 4),
		scrollbar:      font('Segoe Ui Symbol', headerSize),

		font_awesome:	font('FontAwesome', playlistSize + 2),

		dummy_text: font('Segoe Ui', playlistSize + 1)
	};
	playlistFontsCreated = true;
}

/**
 * @param {boolean=} forceRescale
 * @returns
 */
 function rescalePlaylist(forceRescale) {
	if (playlistFontsCreated && !forceRescale) {
		return; // don't redo fonts
	}
	createPlaylistFonts();
	playlist_geo.row_h = scaleForDisplay(g_properties.row_h);
	playlist_geo.scrollbar_w = g_properties.scrollbar_w;    // don't scaleForDisplay
	playlist_geo.scrollbar_right_pad = scaleForDisplay(g_properties.scrollbar_right_pad);
	playlist_geo.scrollbar_top_pad = scaleForDisplay(g_properties.scrollbar_top_pad);
	playlist_geo.scrollbar_bottom_pad = scaleForDisplay(g_properties.scrollbar_bottom_pad);
	playlist_geo.list_bottom_pad = scaleForDisplay(g_properties.list_bottom_pad);
}

var g_pl_colors = {};
var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var key_down_suppress = new qwr_utils.KeyModifiersSuppress();


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

/**
 * Playlist + PlaylistManager
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function PlaylistPanel(x, y) {

	//<editor-fold desc="Callback Implementation">
	this.on_paint = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back); //TODO: can I not need this

		if (!is_activated) {
			is_activated = true;

			if (g_properties.show_playlist_info) {
				playlist_info.reinitialize();
			}
			playlist.reinitialize();
		}

		playlist.on_paint(gr);
		// Hide rows that shouldn't be visible
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(this.x, 0, this.w, geo.top_art_spacing, col.bg); // Hides top row that shouldn't be visible
		gr.FillSolidRect(this.x, this.y, this.w, pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? playlist_geo.row_h + scaleForDisplay(4) : scaleForDisplay(2), g_pl_colors.background); // Hides also Playlist's top shadow
		gr.FillSolidRect(this.x, this.y + this.h, this.w, playlist_geo.row_h * 4, col.bg); // Hides also Playlist's bottom shadow
		gr.FillSolidRect(this.x, this.y + this.h - playlist_geo.row_h, this.w, playlist_geo.row_h, g_pl_colors.background); // Hide Playlist bottom row and margin

		if (g_properties.show_playlist_info) {
			//gr.FillSolidRect(playlist_info.x, playlist_info.y + playlist_info.h, playlist_info.w, 2, g_theme.colors.pss_back);
			playlist_info.on_paint(gr);
		}

		if (pref.layout_mode === 'default_mode') {
			// Playlist's top shadow
			gr.FillGradRect(this.x, is_4k ? this.y - 10 : this.y - 6, this.w, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
			);
			// Playlist's left shadow
			gr.FillGradRect(this.x - 4, this.y, 4, this.h, 0, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 38) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 60) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 64) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 28) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
			);
			// Playlist's bottom shadow
			gr.FillGradRect(this.x, is_4k ? this.y + (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? this.h : this.h + 1) : this.y + this.h - 1, this.w, scaleForDisplay(5), 90,
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 30) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 74) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 74) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 86) : '',
				RGBtoRGBA(col.shadow, 0)
			);

		} else if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
			// Playlist's top shadow
			gr.FillGradRect(this.x, is_4k ? this.y - 10 : this.y - 6, this.w, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0),
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 24) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 255) : ''
			);
			// Playlist's bottom shadow
			gr.FillGradRect(this.x, this.y + this.h - (is_4k ? -1 : 1), this.w, scaleForDisplay(5), 90,
				pref.whiteTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.blackTheme ? RGBtoRGBA(col.shadow, 105) :
				pref.rebornTheme ? RGBtoRGBA(col.shadow, 30) :
				pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
				pref.darkblueTheme ? RGBtoRGBA(col.shadow, 74) :
				pref.redTheme ? RGBtoRGBA(col.shadow, 60) :
				pref.creamTheme ? RGBtoRGBA(col.shadow, 18) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 200) : '',
				RGBtoRGBA(col.shadow, 0)
			);
		}
	};

	// PlaylistPanel.on_size
	this.on_size = function (w, h) {

		if (pref.layout_mode === 'default_mode') {
			rescalePlaylist();
			var x = Math.round(ww *.5);
			var y = geo.top_art_spacing;
			var lowerSpace = calcLowerSpace();
			var playlist_w = w - x;
			var playlist_h = Math.max(0, h - lowerSpace - y);

			this.h = playlist_h;
			this.w = playlist_w;
			this.x = x;
			this.y = y;

			playlist_info_h = scaleForDisplay(g_properties.row_h);
			playlist.on_size(playlist_w, playlist_h - (playlist_info_h * 2), x, y + playlist_info_h + scaleForDisplay(4));

			if (pref.showPLM_default) {
				playlist_info.set_xywh(x, y, this.w);
			} else {
				playlist_info.set_xywh(x, y, 0); // Hide Playlist manager
			}

			is_activated = window.IsVisible;

		} else if (pref.layout_mode === 'artwork_mode') {

			rescalePlaylist();
			var x = 0;
			var y = geo.top_art_spacing;
			var lowerSpace = calcLowerSpace();
			var playlist_w = w - x;
			var playlist_h = Math.max(0, h - lowerSpace - y);

			this.h = playlist_h;
			this.w = playlist_w;
			this.x = x;
			this.y = y;

			playlist_info_h = scaleForDisplay(g_properties.row_h);
			playlist.on_size(playlist_w, playlist_h - (playlist_info_h * 2), x, y + playlist_info_h + scaleForDisplay(4));

			if (pref.showPLM_artwork) {
				playlist_info.set_xywh(x, y, this.w);
			} else {
				playlist_info.set_xywh(x, y, 0); // Hide Playlist manager
			}

			is_activated = window.IsVisible;

		} else if (pref.layout_mode === 'compact_mode') {

			rescalePlaylist();
			var x = 0;
			var y = geo.top_art_spacing;
			var lowerSpace = calcLowerSpace();
			var playlist_w = w - x;
			var playlist_h = Math.max(0, h - lowerSpace - y);

			this.h = playlist_h;
			this.w = playlist_w;
			this.x = x;
			this.y = y;

			playlist_info_h = scaleForDisplay(g_properties.row_h);
			playlist.on_size(playlist_w, playlist_h - (playlist_info_h * 2), x, y + playlist_info_h + scaleForDisplay(4));

			if (pref.showPLM_compact) {
				playlist_info.set_xywh(x, y, this.w);
			} else {
				playlist_info.set_xywh(x, y, 0); // Hide Playlist manager
			}

			is_activated = window.IsVisible;
		}
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

		if (pref.playlistRowHover) repaintPlaylistRows();
	};

	this.on_playlist_switch = function () {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_switch();

		if (pref.playlistRowHover) repaintPlaylistRows();
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

	this.on_playback_pause = function (state) {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_pause(state);
	}

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
	//</editor-fold>

	this.initialize = function () {
		playlist.register_key_actions(key_handler);
		playlist_info.register_key_actions(key_handler);

		playlist.initialize_list();
	};

	// TODO: Mordred - Do this elsewhere?
	this.mouse_in_this = function (x, y) {
		return (x >= this.x && x < this.x + this.w &&
				y >= (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? this.y - playlist_info_h : this.y) && y < this.y + this.h);
	}

	/**
	 * @param {boolean} show_playlist_info
	 */
	function toggle_playlist_info(show_playlist_info) {
		playlist.y = that.y + (show_playlist_info ? (playlist_info_and_gap_h) : 0);
		var new_playlist_h = show_playlist_info ? (playlist.h - playlist_info_and_gap_h) : (playlist.h + playlist_info_and_gap_h);
		playlist.on_size(playlist.w, new_playlist_h, playlist.x, playlist.y);
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
	var playlist_info_h = scaleForDisplay(g_properties.row_h);

	/**
	 * @const
	 * @type {number}
	 */
	var playlist_info_and_gap_h = playlist_info_h + scaleForDisplay(4);

	var is_activated = window.IsVisible;

	var key_handler = new KeyActionHandler();

	// Panel parts
	var playlist_info = new PlaylistManager(that.x, that.y, 0, playlist_info_h);
	var playlist = new Playlist(that.x, that.y + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0));
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

class Playlist extends List {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, 0, 0, new PlaylistContent());

		// Constants
		/** @type {number} */
		this.header_h_in_rows = this.calcHeaderRows();

		// Window state
		this.was_on_size_called = false;

		this.is_in_focus = false;

		// Playback state
		/** @type {number} */
		this.cur_playlist_idx = undefined;
		/** @type {?Row} */
		this.playing_item = undefined;
		/** @type {?Row} */
		this.focused_item = undefined;

		// Mouse and key state
		this.mouse_on_item = false;
		this.key_down = false;
		this.drag_event_invoked = false;

		// Item events
		/** @type {?Row|?BaseHeader|?ListItem} */
		this.last_hover_item = undefined;
		/** @type  {{x: ?number, y: ?number}} */
		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		// Timers
		this.drag_scroll_in_progress = false;
		this.drag_scroll_timeout_timer = 0;
		this.drag_scroll_repeat_timer = 0;

		// Scrollbar props
		/** @type {Array<number>} float */
		this.scroll_pos_list = [];

		// Objects
		/** @type {?SelectionHandler} */
		this.selection_handler = undefined;
		/** @type {?QueueHandler} */
		this.queue_handler = undefined;
		/** @type {?CollapseHandler} */
		this.collapse_handler = undefined;
		/**
		 * @const
		 * @type {ContentNavigationHelper}
		 */
		this.cnt_helper = this.cnt.helper;

		this.debounced_initialize_and_repaint_list = _.debounce((refocus) => {
			// debouncing this because when swapping out playlist content, initialize_and_repaint_list will be called
			// three times, once for each add/remove/changed callback
			this.initialize_and_repaint_list(refocus);
		}, 10, {
			leading:  false,
			trailing: true
		});
	}
	//<editor-fold desc="Callback Implementation">
	on_paint(gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.items_to_draw.length) {
			// Mordred - Passing top, bottom for clipping purposes
			for(let i = this.items_to_draw.length - 1; i >= 0; --i) {
				this.items_to_draw[i].draw(gr, this.y, this.y + this.h);
			}
		}
		else {
			var text;
			if (!plman.PlaylistCount) {
				text = 'Drag some tracks here';
			}
			else {
				text = 'Playlist: ' + plman.GetPlaylistName(this.cur_playlist_idx) + '\n<--- Empty --->';
			}

			gr.DrawString(text, g_pl_fonts.title_normal, g_pl_colors.title_normal, this.x, this.y, this.w, this.h, g_string_format.align_center);
		}

		/*
		if (this.is_scrollbar_available) {
			var gradiantHeight = Math.ceil(playlist_geo.row_h * 2 / 3);
			if (!this.scrollbar.is_scrolled_up) {
				gr.FillGradRect(this.x, this.list_y - 1, this.list_w, gradiantHeight, 270, RGBtoRGBA(g_theme.colors.panel_back, 0), RGBtoRGBA(g_theme.colors.panel_back, 200));
			}
			if (!this.scrollbar.is_scrolled_down) {
				gr.FillGradRect(this.x, this.y + this.h - gradiantHeight, this.w, gradiantHeight, 270, RGBtoRGBA(g_theme.colors.panel_back, 255), RGBtoRGBA(g_theme.colors.panel_back, 0));
			}
		}
		*/

		if (this.is_scrollbar_visible) {
			this.scrollbar.paint(gr);
		}
	};

	// Playlist.on_size
	on_size(w, h, x, y) {
		List.prototype.on_size.apply(this, [w, h, x, y]);

		this.x = x;
		this.y = y;
		this.h = h;
		this.w = w;
		this.was_on_size_called = true;

		if (g_properties.auto_collapse || g_properties.collapse_on_start) {
			this.collapse_handler.collapse_all_but_now_playing();
		}

		if (needs_reinit) {
			this.reinitialize();
			needs_reinit = false;
		}

		if (pref.always_showPlayingPl || pref.rebornTheme && fb.CursorFollowPlayback) {
			this.on_playback_new_track();
		}
	}

	on_mouse_move(x, y, m) {
		if (List.prototype.on_mouse_move.apply(this, [x, y, m])) {
			return true;
		}

		var item = this.get_item_under_mouse(x, y);
		if (item instanceof Header) {
			if (item.on_mouse_move(x, y, m)) {
				return true;
			}
		}

		if (item instanceof Row) {
			if (pref.show_tt || pref.show_truncatedText_tt) {
				item.title_truncatedText_tt(x, y);
			}
			if (pref.playlistRowHover) {
				try { // Prevent crash when playlist rows are not fully initialized while mouse moving in panel, e.g on foobar startup or while changing playlist idx
					item.on_mouse_move(x, y, m);
				} catch (e) {};
			}
		}

		if (!this.mouse_down) {
			return true;
		}

		if (!this.selection_handler.is_dragging() && this.last_hover_item) {
			var drag_diff = Math.sqrt((Math.pow(this.last_pressed_coord.x - x, 2) + Math.pow(this.last_pressed_coord.y - y, 2)));
			if (drag_diff >= 7) {
				this.last_pressed_coord = {
					x: undefined,
					y: undefined
				};
				this.last_hover_item = this.get_item_under_mouse(x, y);

				this.selection_handler.perform_internal_drag_n_drop();
			}
		}

		return true;
	};

	on_mouse_lbtn_down(x, y, m) {
		if (List.prototype.on_mouse_lbtn_down.apply(this, [x, y, m])) {
			return true;
		}

		var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
		var shift_pressed = utils.IsKeyPressed(VK_SHIFT);

		/** @type {BaseHeader|Row} */
		// @ts-ignore
		const item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
		this.last_hover_item = item;
		this.last_pressed_coord.x = x;
		this.last_pressed_coord.y = y;

		if (item) {
			if ((!pref.hyperlinks_ctrl || ctrl_pressed) && item instanceof Header) {
				if (item.on_mouse_lbtn_down(x, y, m)) {
					return true;    // was handled by hyperlinks
				}
			}
			if (ctrl_pressed && shift_pressed && item instanceof BaseHeader) {
				this.collapse_handler.toggle_collapse(item);
				this.mouse_down = false;
			}
			else if (shift_pressed
				|| (item instanceof Row && !item.is_selected()
					|| item instanceof BaseHeader && !item.is_completely_selected())) {
				this.selection_handler.update_selection(item, ctrl_pressed, shift_pressed);
			}
			else {
				// indicates the need to update selection on on_mouse_lbtn_up
				this.mouse_on_item = true;
			}
		}
		else {
			this.selection_handler.clear_selection();
		}

		this.repaint();

		return true;
	}

	on_mouse_lbtn_dblclk(x, y, m) {
		if (List.prototype.on_mouse_lbtn_dblclk.apply(this, [x, y, m])) {
			return true;
		}

		var item = this.get_item_under_mouse(x, y);
		if (!item) {
			return true;
		}

		if (item instanceof BaseHeader) {
			if (item instanceof DiscHeader) {
				item.on_mouse_lbtn_dblclk(this.collapse_handler);
			} else {
				item.on_mouse_lbtn_dblclk(x, y, m);
			}
			this.repaint();
		} else if (item instanceof Row) {
			if (g_properties.show_rating && item.rating_trace(x, y)) {
				item.rating_click(x, y);
				item.repaint();
			}
			else {
				plman.ExecutePlaylistDefaultAction(this.cur_playlist_idx, item.idx);
			}
		}

		return true;
	}

	on_mouse_lbtn_up(x, y, m) {
		var was_double_clicked = this.mouse_double_clicked;

		if (List.prototype.on_mouse_lbtn_up.apply(this, [x, y, m])) {
			return true;
		}

		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		if (was_double_clicked) {
			return true;
		}

		this.last_hover_item = undefined;

		// drag is handled in on_drag_drop
		if (!this.selection_handler.is_dragging() && this.mouse_on_item) {
			var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
			var shift_pressed = utils.IsKeyPressed(VK_SHIFT);
			/** @type {Row|BaseHeader} */
			// @ts-ignore
			const item = this.get_item_under_mouse(x, y);
			if (item) {
				this.selection_handler.update_selection(item, ctrl_pressed, shift_pressed);
			}
		}

		this.mouse_on_item = false;
		this.repaint();

		return true;
	}

	on_mouse_rbtn_down(x, y, m) {
		if (!this.cnt.rows.length) {
			return;
		}

		if (this.is_scrollbar_visible && this.scrollbar.trace(x, y)) {
			return;
		}

		var item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
		if (!item) {
			this.selection_handler.clear_selection();

		}
		else if (item instanceof Row && !item.is_selected()
			|| item instanceof BaseHeader && !item.is_completely_selected()) {
			this.selection_handler.update_selection(item);
		}

		this.repaint();
	}

	on_mouse_rbtn_up(x, y, m) {
		if (List.prototype.on_mouse_rbtn_up.apply(this, [x, y, m])) {
			return true;
		}

		var metadb = utils.IsKeyPressed(VK_CONTROL) ? (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()) : fb.GetFocusItem();

		var has_selected_item = this.selection_handler.has_selected_items();
		var is_cur_playlist_empty = !this.cnt.rows.length;
		var playlist_count = plman.PlaylistCount;

		var cmm = new ContextMainMenu();

		if (fb.IsPlaying) {
			cmm.append_item(
				'Show now playing',
				() => {
					this.show_now_playing();
				});
			cmm.append_separator();
		}

			cmm.append_item(
				'Playlist manager \tCtrl+M',
				() => {
					fb.RunMainMenuCommand("View/Playlist Manager");
				});

			cmm.append_item(
				'Playlist search \tCtrl+F',
				() => {
					fb.RunMainMenuCommand("View/Playlist search");
				});

			cmm.append_item(
				'Create new playlist \tCtrl+N',
				() => {
					plman.CreatePlaylist(playlist_count, '');
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				});

		var autopl = new ContextMenu('Create new auto playlist');
		cmm.append(autopl);

			autopl.append_item(
				"Custom auto playlist",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) New auto playlist", "", "", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
					plman.ShowAutoPlaylistUI(this.cur_playlist_idx);
				});

			autopl.append_separator();

			autopl.append_item(
				"Tracks from the library",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks from the library", "ALL", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_separator();

			autopl.append_item(
				"Tracks most played",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks most played", "%play_count% GREATER 9", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks never played",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks never played", "%play_count% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks played in the last week",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last week", "%last_played% DURING LAST 1 WEEK", "%last_played%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks played in the last month",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last month", "%last_played% DURING LAST 4 WEEKS", "%last_played%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks played in the last year",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last year", "%last_played% DURING LAST 52 WEEKS", "%last_played%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_separator();

			autopl.append_item(
				"Tracks unrated",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks unrated", "%rating% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks rated 1",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 1", "%rating% IS 1", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks rated 2",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 2", "%rating% IS 2", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks rated 3",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 3", "%rating% IS 3", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks rated 4",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 4", "%rating% IS 4", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_item(
				"Tracks rated 5",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 5", "%rating% IS 5", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

			autopl.append_separator();

			autopl.append_item(
				"Loved tracks",
				() => {
					plman.CreateAutoPlaylist(playlist_count, "(Auto) Loved tracks", "%mood% GREATER 0", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
					plman.MovePlaylist(playlist_count, this.cur_playlist_idx);
					plman.ActivePlaylist = this.cur_playlist_idx;
				});

		if (!is_cur_playlist_empty) {
			cmm.append_separator();
			cmm.append_item(
				'Refresh playlist \tF5',
				() => {
					Header.art_cache.clear();
					this.initialize_list();
					this.scroll_to_focused();
				});

			if (this.queue_handler && this.queue_handler.has_items()) {
				cmm.append_item(
					'Flush playback queue \tCtrl+Shift+Q',
					() => {
						this.queue_handler.flush();
					});
			}
		}

		this.append_edit_menu_to(cmm);

		if (!is_cur_playlist_empty) {
			if (!cmm.is_empty()) {
				cmm.append_separator();
			}

			if (this.collapse_handler) {
				this.append_collapse_menu_to(cmm);
			}

			this.append_appearance_menu_to(cmm);

			if (g_properties.show_header) {
				Header.grouping_handler.append_menu_to(cmm, () => {
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
					this.repaint();
				});
			}

			this.append_sort_menu_to(cmm);

			if (pref.show_weblinks) {
				this.append_weblinks_menu_to(cmm, metadb);
			}

			if (has_selected_item) {
				this.append_send_items_menu_to(cmm);
			}
		}
		else {
			// Empty playlist

			if (!cmm.is_empty()) {
				cmm.append_separator();
			}

			var appear = new ContextMenu('Appearance');
			cmm.append(appear);

			appear.append_item(
				'Show playlist info',
				() => {
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

			var ccmm = new ContextFoobarMenu(plman.GetPlaylistSelectedItems(this.cur_playlist_idx));
			cmm.append(ccmm);
		}

		// -------------------------------------------------------------- //
		//---> System

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		menu_down = true;
		cmm.execute(x, y);
		menu_down = false;

		this.repaint();
		return true;
	}

	on_mouse_leave() {
		if (this.selection_handler.is_internal_drag_n_drop_active()
			&& this.selection_handler.is_dragging()
			&& !this.drag_event_invoked) {
			// Workaround for the following issues:
			// #1 if you move too fast out of the panel, then drag_enter is not invoked (thus we need to clear mouse state here).
			// #2 on_mouse_leave sometimes generated during internal drag_over (so we need to ignore it).
			this.selection_handler.disable_drag();
			this.drag_event_invoked = false
			this.mouse_in = false;
			this.mouse_down = false;
			this.repaint();
		}
		List.prototype.on_mouse_leave.apply(this);
	}

	on_drag_enter(action, x, y, mask) {
		this.mouse_in = true;
		this.mouse_down = true;
		this.drag_event_invoked = true;

		if (!this.selection_handler.is_dragging()) {
			if (this.selection_handler.is_internal_drag_n_drop_active()) {
				this.selection_handler.enable_drag();
			}
			else {
				this.selection_handler.enable_external_drag();
			}
		}

		if (!this.trace_list(x, y) || !this.selection_handler.can_drop()) {
			action.Effect = g_drop_effect.none;
		}
		else {
			action.Effect = (action.Effect & g_drop_effect.move)
				|| (action.Effect & g_drop_effect.copy)
				|| (action.Effect & g_drop_effect.link);
		}
	}

	on_drag_leave() {
		if (this.selection_handler.is_dragging()) {
			this.stop_drag_scroll();
			this.selection_handler.disable_drag();
		}

		this.drag_event_invoked = false;
		this.mouse_in = false;
		this.mouse_down = false;

		this.repaint();
	}

	on_drag_over(action, x, y, mask) {
		if (!this.selection_handler.can_drop()) {
			action.Effect = g_drop_effect.none;
			return;
		}

		var drop_info = this.get_drop_row_info(x, y);
		var row = drop_info.row;

		if (this.drag_scroll_in_progress) {
			if (!row || (y >= (this.list_y + this.row_h * 2) && y <= (this.list_y + this.list_h - this.row_h * 2))) {
				this.stop_drag_scroll();
			}
		}
		else if (row) {
			if (this.collapse_handler) {
				this.collapse_handler.expand(row.parent);
				if (this.collapse_handler.changed) {
					this.repaint();
				}
			}

			this.selection_handler.drag(row, drop_info.is_above);

			if (this.is_scrollbar_available) {
				if (y < (this.list_y + this.row_h * 2) && !this.scrollbar.is_scrolled_up) {
					this.selection_handler.drag(null, false); // To clear last hover row
					this.start_drag_scroll('up');
				}
				if (y > (this.list_y + this.list_h - this.row_h * 2) && !this.scrollbar.is_scrolled_down) {
					this.selection_handler.drag(null, false); // To clear last hover row
					this.start_drag_scroll('down');
				}
			}
		}

		this.last_hover_item =
			/** @type {?BaseHeader|?Row} */ this.get_item_under_mouse(x, y);

		if (!this.trace_list(x, y)) {
			action.Effect = g_drop_effect.none;
		}
		else {
			action.Effect = this.filter_effect_by_modifiers(action.Effect);
		}
	}

	on_drag_drop(action, x, y, m) {
		this.mouse_down = false; ///< because on_drag_drop suppresses on_mouse_lbtn_up call
		this.stop_drag_scroll();

		if (!this.selection_handler.is_dragging() || !this.trace_list(x, y) || !this.selection_handler.can_drop()) {
			this.selection_handler.disable_drag();
			action.Effect = g_drop_effect.none;
			return;
		}

		var ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);

		if (this.selection_handler.is_internal_drag_n_drop_active()) {
			var copy_drop = ctrl_pressed && ((action.Effect & 1) || (action.Effect & 4));
			this.selection_handler.drop(!!copy_drop);

			// Suppress native drop, since we've handled it ourselves
			action.Effect = g_drop_effect.none;
		}
		else {
			action.Effect = this.filter_effect_by_modifiers(action.Effect);
			if (g_drop_effect.none !== action.Effect) {
				this.selection_handler.external_drop(action);
			}
			else {
				this.selection_handler.disable_drag();
			}
		}
	}

	on_key_down(vkey) {
		this.key_down = true;
	}

	on_key_up(vkey) {
		this.key_down = false;
	}

	on_item_focus_change(playlist_idx, from_idx, to_idx) {
		if (playlist_idx !== this.cur_playlist_idx || this.focused_item && this.focused_item.idx === to_idx) {
			return;
		}

		if (this.focused_item) {
			this.focused_item.is_focused = false;
		}

		if (to_idx === -1) {
			this.focused_item = undefined;
		}
		else if (this.cnt.rows.length) {
			to_idx = Math.min(to_idx, this.cnt.rows.length - 1);
			this.focused_item = this.cnt.rows[to_idx];
			this.focused_item.is_focused = true;
		}

		if (this.focused_item) {
			var from_row = from_idx === -1 ? null : this.cnt.rows[from_idx];
			this.scroll_to_row(from_row, this.focused_item);
		}

		this.repaint();
	}

	on_playlists_changed() {
		if ((plman.ActivePlaylist > plman.PlaylistCount || plman.ActivePlaylist === -1) && plman.PlaylistCount > 0) {
			plman.ActivePlaylist = plman.PlaylistCount - 1;
		}

		Header.grouping_handler.on_playlists_changed();
		Header.grouping_handler.set_active_playlist(plman.GetPlaylistName(plman.ActivePlaylist));

		if (plman.ActivePlaylist !== this.cur_playlist_idx) {
			this.initialize_and_repaint_list();
		}

		if (this.collapse_handler && (g_properties.auto_collapse || g_properties.collapse_on_start)) {
			this.collapse_handler.collapse_all_but_now_playing();
		}
	}

	on_playlist_switch() {
		if (this.cur_playlist_idx !== plman.ActivePlaylist) {
			g_properties.scroll_pos = this.scroll_pos_list[plman.ActivePlaylist] == null ? 0 : this.scroll_pos_list[plman.ActivePlaylist];
		}

		this.initialize_and_repaint_list();

		if (this.collapse_handler && (g_properties.auto_collapse || g_properties.collapse_on_start)) {
			this.collapse_handler.collapse_all_but_now_playing();
		}
	}

	on_playlist_item_ensure_visible(playlist_idx, playlistItemIndex) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}

		var row = this.cnt.rows[playlistItemIndex];
		if (!row) {
			return;
		}

		this.scroll_to_row(null, row);
	}

	on_playlist_items_added(playlist_idx) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}

		this.debounced_initialize_and_repaint_list();
	}

	on_playlist_items_reordered(playlist_idx) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}

		this.debounced_initialize_and_repaint_list(true);
	}

	on_playlist_items_removed(playlist_idx) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}

		this.debounced_initialize_and_repaint_list();
	}

	on_playlist_items_selection_change() {
		if (!this.mouse_in && !this.key_down) {
			this.selection_handler.initialize_selection();
		}
	}

	on_playback_dynamic_info_track() {
		this.cnt.rows.forEach(function (item) {
			item.reset_queried_data();
		});

		this.cnt.sub_items.forEach(function(header) {
			header.reset_hyperlinks();
		});

		this.repaint();
	}

	on_playback_new_track(metadb) {
		if (this.playing_item) {
			this.playing_item.is_playing = false;
			this.playing_item.clear_title_text();
			this.playing_item = undefined;
		}

		var playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === this.cur_playlist_idx) {
			this.playing_item = this.cnt.rows[playing_item_location.PlaylistItemIndex];
			this.playing_item.is_playing = true;
			this.playing_item.clear_title_text();

			if (this.collapse_handler && (g_properties.auto_collapse || g_properties.collapse_on_start)) {
				this.selection_handler.clear_selection();
				this.collapse_handler.collapse_all_but_now_playing();
				this.scroll_to_now_playing();
			}
		}

		if (pref.always_showPlayingPl) {
			this.show_now_playing();
		}

		this.repaint();
	}

	on_playback_pause(state) {
		if (this.playing_item) {
			this.playing_item.repaint();
		}
	}

	on_playback_queue_changed(origin) {
		if (!this.queue_handler) {
			return;
		}

		this.queue_handler.initialize_queue();
		this.repaint();
	}

	on_playback_stop(reason) {
		if (this.playing_item) {
			this.playing_item.clear_title_text(); // Mordred: need to regen tracknumber
			this.playing_item.is_playing = false;
			this.playing_item.repaint();
		}
	}

	on_focus(is_focused) {
		if (this.focused_item) {
			this.focused_item.is_focused = is_focused;
			this.focused_item.repaint();
		}
		this.is_in_focus = is_focused;
	}

	/**
	 * @param {FbMetadbHandleList} handles
	 * @param {boolean} fromhook
	 */
	on_metadb_changed(handles, fromhook) {
		handles.Sort();
		const len = this.cnt.sub_items.length;
		for (let i = 0; i < len; i++) {
			const item = this.cnt.sub_items[i];
			// only need to update the header data if it's already been drawn/cached
			if (item instanceof Header && (item.header_image || item.hyperlinks_initialized)) {
				const metadb = item.get_first_row().metadb;
				if (handles.BSearch(metadb) !== -1)  {
					item.header_image = null;
					item.reset_hyperlinks();
				}
			}
		}

		// is there a more efficient way to do this?
		this.cnt.rows.forEach(function (item) {
			item.reset_queried_data();
		});
	}

	on_get_album_art_done(metadb, art_id, image, image_path) {
		if (!image) {
			image = null;
		}

		/** @type {Array<Row|BaseHeader>} */
		var items = this.items_to_draw;
		items.forEach(function (item) {
			if (item instanceof Header) {
				var header = item;
				if (!header.is_art_loaded() && header.get_first_row().metadb.Compare(metadb)) {
					header.assign_art(image);
					header.repaint();
				}
			}
		});
	}

	on_notify_data(name, info) {
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
				this.scroll_to_focused_or_now_playing();
			}
		}
	}
	//</editor-fold>

	/**
	 * @param {KeyActionHandler} key_handler
	 */
	register_key_actions(key_handler) {
		key_handler.register_key_action(VK_UP,
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
					var top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}

				var visible_item = this.cnt_helper.is_item_visible(this.focused_item) ? this.focused_item : this.cnt_helper.get_visible_parent(this.focused_item);
				var new_item = this.cnt_helper.get_navigateable_neighbour(visible_item, -1);
				if (!new_item) {
					new_item = visible_item;
				}

				this.selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			});

		key_handler.register_key_action(VK_DOWN,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					// skip repaint
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
					var top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}

				var visible_item = this.cnt_helper.is_item_visible(this.focused_item) ? this.focused_item : this.cnt_helper.get_visible_parent(this.focused_item);
				var new_item = this.cnt_helper.get_navigateable_neighbour(visible_item, 1);
				if (!new_item) {
					new_item = visible_item;
				}

				this.selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			});

		key_handler.register_key_action(VK_LEFT,
			(modifiers) => {
				if (!this.collapse_handler || !this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					var top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}
				/** @type {BaseHeader|Row} */
				let new_focus = this.focused_item;

				// Get top uncollapsed header
				var visible_header = this.cnt_helper.get_visible_parent(this.focused_item);
				if (visible_header) {
					while (visible_header.parent instanceof BaseHeader && visible_header.is_collapsed) {
						visible_header = visible_header.parent;
					}

					this.collapse_handler.collapse(visible_header);
					new_focus = visible_header;
				}

				this.selection_handler.update_selection(new_focus);
				this.repaint();
			});

		key_handler.register_key_action(VK_RIGHT,
			(modifiers) => {
				if (!this.collapse_handler || !this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					var top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}
				/** @type {BaseHeader|Row} */
				let new_focus = this.focused_item;

				var visible_header = this.cnt_helper.get_visible_parent(this.focused_item);
				var new_focus_item = visible_header.get_first_row();

				this.collapse_handler.expand(visible_header);
				if (this.collapse_handler.changed) {
					this.scroll_to_row(this.focused_item, new_focus_item);
					new_focus = new_focus_item;
				}

				this.selection_handler.update_selection(new_focus);
				this.repaint();
			});

		key_handler.register_key_action(VK_PRIOR,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					var top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}

				var new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = this.items_to_draw[0];
					if (!this.cnt_helper.is_item_navigateable(new_focus_item)) {
						new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, 1);
					}
					if (new_focus_item.y < this.list_y && new_focus_item.y + new_focus_item.h > this.list_y) {
						new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, 1);
					}
					if (new_focus_item === this.focused_item) {
						this.scrollbar.shift_page(-1);

						new_focus_item = this.items_to_draw[0];
						if (!this.cnt_helper.is_item_navigateable(new_focus_item)) {
							new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, 1);
						}
					}
				}
				else {
					new_focus_item = this.items_to_draw[0];
				}

				this.selection_handler.update_selection(new_focus_item, undefined, modifiers.shift);
				this.repaint();
			});

		key_handler.register_key_action(VK_NEXT,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					this.focused_item = this.items_to_draw[0];
					if (!this.cnt_helper.is_item_navigateable(this.focused_item)) {
						// @ts-ignore
						this.focused_item = this.cnt_helper.get_navigateable_neighbour(this.focused_item, 1);
					}
				}

				var new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = _.last(this.items_to_draw);
					if (!this.cnt_helper.is_item_navigateable(new_focus_item)) {
						new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
					}
					if (new_focus_item.y < this.list_y + this.list_h && new_focus_item.y + new_focus_item.h > this.list_y + this.list_h) {
						new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
					}
					if (new_focus_item === this.focused_item) {
						this.scrollbar.shift_page(1);
						new_focus_item = _.last(this.items_to_draw);
						if (!this.cnt_helper.is_item_navigateable(new_focus_item)) {
							new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
						}
					}
				}
				else {
					new_focus_item = _.last(this.items_to_draw);
				}

				this.selection_handler.update_selection(new_focus_item, undefined, modifiers.shift);
				this.repaint();
			});

		key_handler.register_key_action(VK_HOME,
			(modifiers) => {
				this.selection_handler.update_selection(this.cnt.rows[0], undefined, modifiers.shift);
				this.scrollbar.scroll_to_start();
			});

		key_handler.register_key_action(VK_END,
			(modifiers) => {
				this.selection_handler.update_selection(_.last(this.cnt.rows), undefined, modifiers.shift);
				this.scrollbar.scroll_to_end();
			});

		key_handler.register_key_action(VK_DELETE,
			(modifiers) => {
				if (!this.selection_handler.has_selected_items() && this.focused_item) {
					this.selection_handler.update_selection(this.focused_item);
				}
				plman.UndoBackup(this.cur_playlist_idx);
				plman.RemovePlaylistSelection(this.cur_playlist_idx);
			});

		key_handler.register_key_action(VK_KEY_A,
			(modifiers) => {
				if (modifiers.ctrl) {
					this.selection_handler.select_all();
					this.repaint();
				}
			});

		key_handler.register_key_action(VK_KEY_F,
			(modifiers) => {
				if (modifiers.ctrl) {
					fb.RunMainMenuCommand('Edit/Search');
				}
				else if (modifiers.shift) {
					fb.RunMainMenuCommand('Library/Search');
				}
			});

		key_handler.register_key_action(VK_RETURN,
			(modifiers) => {
				plman.ExecutePlaylistDefaultAction(this.cur_playlist_idx, this.focused_item.idx);
			});

		key_handler.register_key_action(VK_KEY_O,
			(modifiers) => {
				if (modifiers.shift) {
					fb.RunContextCommandWithMetadb('Open Containing Folder', this.focused_item.metadb);
				}
			});

		key_handler.register_key_action(VK_KEY_Q,
			(modifiers) => {
				if (!this.queue_handler) {
					return;
				}

				if (modifiers.ctrl && modifiers.shift) {
					this.queue_handler.flush();
				}
				else if (this.selection_handler.selected_items_count() >= 1) {
					var rows = this.cnt.rows;
					if (modifiers.ctrl) {
						const indexes = this.selection_handler.get_selected_items();
						indexes.forEach(function (idx) {
							this.queue_handler.add_row(rows[idx]);
						});
					}
					else if (modifiers.shift) {
						const indexes = this.selection_handler.get_selected_items();
						indexes.forEach(function (idx) {
							this.queue_handler.remove_row(rows[idx]);
						});
					}
				}
			});

		key_handler.register_key_action(VK_F5,
			(modifiers) => {
				Header.art_cache.clear();
				this.initialize_and_repaint_list(true);
			});

		key_handler.register_key_action(VK_KEY_C,
			(modifiers) => {
				if (modifiers.ctrl) {
					this.selection_handler.copy();
				}
			});

		key_handler.register_key_action(VK_KEY_X,
			(modifiers) => {
				if (modifiers.ctrl) {
					this.selection_handler.cut();
				}
			});

		key_handler.register_key_action(VK_KEY_V,
			(modifiers) => {
				if (modifiers.ctrl && !plman.IsPlaylistLocked(this.cur_playlist_idx)) {
					this.selection_handler.paste();
				}
			});
	};

	initialize_and_repaint_list(refocus) {
		this.initialize_list();
		if (refocus) {
			// Needed after drag-drop, because it might cause dropped (i.e. focused) item to be outside of drawn list
			this.scroll_to_focused();
		}
		this.repaint();
	}

	/**
	 * This method does not contain any redraw calls - it's purely back-end
	 */
	initialize_list() {
		trace_call && console.log('initialize_list');
		var profiler = fb.CreateProfiler();
		if (trace_initialize_list_performance) {
			var profiler_part = fb.CreateProfiler();
		}

		this.cur_playlist_idx = plman.ActivePlaylist;

		// Clear contents

		this.cnt.rows = [];
		this.cnt.sub_items = [];

		// Initialize rows

		trace_initialize_list_performance && profiler_part.Reset();

		var rows_metadb = plman.GetPlaylistItems(this.cur_playlist_idx);
		this.cnt.rows = this.initialize_rows(plman.GetPlaylistItems(this.cur_playlist_idx));

		trace_initialize_list_performance && console.log('Rows initialized in ' + profiler_part.Time + 'ms');

		this.playing_item = undefined;
		var playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === this.cur_playlist_idx) {
			this.playing_item = this.cnt.rows[playing_item_location.PlaylistItemIndex];
			this.playing_item.is_playing = true;
		}

		this.focused_item = undefined;
		var focus_item_idx = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);
		if (focus_item_idx !== -1) {
			this.focused_item = this.cnt.rows[focus_item_idx];
			this.focused_item.is_focused = true;
		}

		// Initialize headers

		trace_initialize_list_performance && profiler_part.Reset();

		Header.grouping_handler.set_active_playlist(plman.GetPlaylistName(this.cur_playlist_idx));
		this.cnt.sub_items = this.create_headers(this.cnt.rows, rows_metadb);
		getHeaderArtwork(this.cnt.sub_items.slice(0, 10));	// preload first 10 artworks

		trace_initialize_list_performance && console.log('Headers initialized in ' + profiler_part.Time + 'ms');

		if (!this.was_on_size_called) {
			// First time init

			if (g_properties.show_header) {
				this.collapse_handler = new CollapseHandler(/** @type {PlaylistContent} */ this.cnt);
				if (g_properties.collapse_on_start) {
					this.collapse_handler.collapse_all();
				}

				this.collapse_handler.set_callback(() => {
					this.on_list_items_change();
				});
			}
		}
		else {
			// Update list control

			if (this.collapse_handler) {
				this.collapse_handler.on_content_change();
			}

			this.scrollbar.stopScrolling();
			this.on_list_items_change();
		}

		// Initialize other objects

		if (g_properties.show_queue_position) {
			this.queue_handler = new QueueHandler(this.cnt.rows, this.cur_playlist_idx);
		}
		this.selection_handler = new SelectionHandler(/** @type {PlaylistContent} */ this.cnt, this.cur_playlist_idx);

		(true || trace_initialize_list_performance) && console.log('Playlist initialized in ' + profiler.Time + 'ms');
	}

	reinitialize() {
		if (this.cur_playlist_idx !== plman.ActivePlaylist) {
			g_properties.scroll_pos = this.scroll_pos_list[plman.ActivePlaylist] == null ? 0 : this.scroll_pos_list[plman.ActivePlaylist];
		}
		this.row_h = scaleForDisplay(g_properties.row_h);
		this.header_h_in_rows = this.calcHeaderRows();
		this.initialize_list();
		this.scroll_to_focused();
	};

	/**
	 * @protected
	 * @override
	 */
	on_content_to_draw_change() {
		this.set_rows_boundary_status();
		// @ts-ignore
		List.prototype.on_content_to_draw_change.apply(this);
		if (g_properties.show_album_art && !g_properties.use_compact_header) {
			get_album_art(this.items_to_draw);
		}
	}

	/**
	 * @protected
	 * @override
	 */
	scrollbar_redraw_callback() {
		this.scroll_pos_list[this.cur_playlist_idx] = Math.round(this.scrollbar.scroll * 1e2) / 1e2;
		// @ts-ignore
		List.prototype.scrollbar_redraw_callback.apply(this);
	}


	//private:

	/**
	 * @param {FbMetadbHandleList} playlist_items
	 * @return {Array<Row>}
	 */
	initialize_rows(playlist_items) {
		var playlist_items_array = playlist_items.Convert();

		var rows = [];
		for (var i = 0, playlist_size = playlist_items_array.length; i < playlist_size; ++i) {
			rows[i] = new Row(this.list_x, 0, this.list_w, this.row_h, playlist_items_array[i], i, this.cur_playlist_idx);
			if (!g_properties.show_header) {
				rows[i].is_odd = !(i & 1);
			}
		}

		return rows;
	}

	/**
	 * @param {Array<Row>} rows
	 * @param {FbMetadbHandleList} rows_metadb
	 * @return {Array<Header>}
	 */
	create_headers(rows, rows_metadb) {
		var prepared_rows = Header.prepare_initialization_data(rows, rows_metadb);
		return Header.create_headers(/** @type {PlaylistContent} */ this.cnt, this.list_x, 0, this.list_w, this.row_h * this.header_h_in_rows, prepared_rows);
	}

	set_rows_boundary_status() {
		var last_row = _.last(this.cnt.rows);
		if (last_row) {
			last_row.is_cropped = this.is_scrollbar_available ? this.scrollbar.is_scrolled_down : false;
		}
	}

	//<editor-fold desc="Context Menu">

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_edit_menu_to(parent_menu) {
		var has_selected_item = this.selection_handler.has_selected_items();
		var is_playlist_locked = plman.IsPlaylistLocked(this.cur_playlist_idx);
		// Check only for data presence, since parsing it's contents might take a while
		var has_data_in_clipboard = fb.CheckClipboardContents();

		if (has_selected_item || has_data_in_clipboard) {
			if (!parent_menu.is_empty()) {
				parent_menu.append_separator();
			}

			if (has_selected_item) {
				parent_menu.append_item(
					'Cut',
					() => {
						this.selection_handler.cut();
					},
					{is_grayed_out: !has_selected_item}
				);

				parent_menu.append_item(
					'Copy',
					() => {
						this.selection_handler.copy();
					},
					{is_grayed_out: !has_selected_item}
				);
			}

			if (has_data_in_clipboard) {
				parent_menu.append_item(
					'Paste',
					() => {
						this.selection_handler.paste();
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
				() => {
					plman.RemovePlaylistSelection(this.cur_playlist_idx);
				},
				{is_grayed_out: is_playlist_locked}
			);
		}
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_collapse_menu_to(parent_menu) {
		var ce = new ContextMenu('Collapse/Expand');
		parent_menu.append(ce);

		ce.append_item(
			'Collapse all',
			() => {
				this.collapse_handler.collapse_all();
				if (this.collapse_handler.changed) {
					this.scroll_to_focused_or_now_playing();
				}
			}
		);

		if (plman.ActivePlaylist === plman.PlayingPlaylist) {
			ce.append_item(
				'Collapse all but now playing',
				() => {
					this.collapse_handler.collapse_all_but_now_playing();
					if (this.collapse_handler.changed) {
						this.scroll_to_now_playing_or_focused();
					}
				}
			);
		}

		ce.append_item(
			'Expand all',
			() => {
				this.collapse_handler.expand_all();
				if (this.collapse_handler.changed) {
					this.scroll_to_focused_or_now_playing();
				}
			});

		ce.append_separator();

		ce.append_item(
			'Auto',
			() => {
				g_properties.auto_collapse = !g_properties.auto_collapse;
				if (g_properties.auto_collapse) {
					this.collapse_handler.collapse_all_but_now_playing();
					if (this.collapse_handler.changed) {
						this.scroll_to_now_playing_or_focused();
					}
				} else {
					this.collapse_handler.expand_all();
				}
			},
			{is_checked: g_properties.auto_collapse}
		);

		ce.append_item(
			'Collapse on start',
			() => {
				g_properties.collapse_on_start = !g_properties.collapse_on_start;
			},
			{is_checked: g_properties.collapse_on_start}
		);

		ce.append_item(
			'Collapse on playlist switch',
			() => {
				g_properties.collapse_on_playlist_switch = !g_properties.collapse_on_playlist_switch;
			},
			{is_checked: g_properties.collapse_on_playlist_switch}
		);
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_appearance_menu_to(parent_menu) {
		var appear = new ContextMenu('Appearance');
		parent_menu.append(appear);

		PlaylistManager.append_playlist_info_visibility_context_menu_to(appear);

		this.append_scrollbar_visibility_context_menu_to(appear);

		appear.append_item(
			'Show artist name in row',
			() => {
				pref.show_artist_playlistRow = !pref.show_artist_playlistRow;

				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			},
			{is_checked: pref.show_artist_playlistRow}
		);

		appear.append_item(
			'Show album title in row',
			() => {
				pref.show_album_playlistRow = !pref.show_album_playlistRow;

				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			},
			{is_checked: pref.show_album_playlistRow}
		);

		appear.append_item(
			'Show group header',
			() => {
				g_properties.show_header = !g_properties.show_header;
				if (g_properties.show_header) {
					this.collapse_handler = new CollapseHandler(/** @type {PlaylistContent} */ this.cnt);
					this.collapse_handler.expand_all();
					this.collapse_handler.set_callback(() => {
						this.on_list_items_change();
					});
				}
				else {
					this.collapse_handler.expand_all();
					this.collapse_handler = null;
				}

				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			},
			{is_checked: g_properties.show_header}
		);

		if (g_properties.show_header) {
			var appear_header = new ContextMenu('Headers');
			appear.append(appear_header);

			appear_header.append_item(
				'Use compact group header',
				() => {
					g_properties.use_compact_header = !g_properties.use_compact_header;
					this.header_h_in_rows = this.calcHeaderRows();
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				},
				{is_checked: g_properties.use_compact_header}
			);

			appear_header.append_item(
				'Show disc sub-header',
				() => {
					g_properties.show_disc_header = !g_properties.show_disc_header;
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				},
				{is_checked: g_properties.show_disc_header}
			);

			if (!g_properties.use_compact_header) {
				appear_header.append_item(
					'Show group info',
					() => {
						g_properties.show_group_info = !g_properties.show_group_info;
					},
					{is_checked: g_properties.show_group_info}
				);

				var art = new ContextMenu('Album art');
				appear_header.append(art);

				art.append_item(
					'Show',
					() => {
						g_properties.show_album_art = !g_properties.show_album_art;
						if (g_properties.show_album_art) {
							get_album_art(this.items_to_draw);
						}
					},
					{is_checked: g_properties.show_album_art}
				);

				art.append_item(
					'Auto',
					() => {
						g_properties.auto_album_art = !g_properties.auto_album_art;
						if (g_properties.show_album_art) {
							get_album_art(this.items_to_draw);
						}
					},
					{
						is_checked:    g_properties.auto_album_art,
						is_grayed_out: !g_properties.show_album_art
					}
				);
			}
		}

		var appear_row = new ContextMenu('Rows');
		appear.append(appear_row);

		appear_row.append_item(
			'Alternate row color',
			() => {
				g_properties.alternate_row_color = !g_properties.alternate_row_color;
			},
			{is_checked: g_properties.alternate_row_color}
		);

		appear_row.append_item(
			'Show play count',
			() => {
				g_properties.show_playcount = !g_properties.show_playcount;
			},
			{
				is_checked:    g_properties.show_playcount,
				is_grayed_out: !g_component_playcount
			}
		);

		appear_row.append_item(
			'Show queue position',
			() => {
				g_properties.show_queue_position = !g_properties.show_queue_position;
				this.queue_handler = g_properties.show_queue_position ? new QueueHandler(this.cnt.rows, this.cur_playlist_idx) : undefined;
			},
			{is_checked: g_properties.show_queue_position}
		);

		appear_row.append_item(
			'Show rating',
			() => {
				g_properties.show_rating = !g_properties.show_rating;
			},
			{
				is_checked:    g_properties.show_rating,
				is_grayed_out: !g_component_playcount
			}
		);
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_sort_menu_to(parent_menu) {
		var has_multiple_selected_items = this.selection_handler.selected_items_count() > 1;
		var is_auto_playlist = plman.IsAutoPlaylist(this.cur_playlist_idx);

		var sort = new ContextMenu(
			has_multiple_selected_items ? 'Sort selection' : 'Sort',
			{is_grayed_out: is_auto_playlist}
		);
		parent_menu.append(sort);

		sort.append_item(
			'by...',
			() => {
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
			() => {
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
			() => {
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
			() => {
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
			() => {
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
			() => {
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
			() => {
				plman.UndoBackup(this.cur_playlist_idx);
				plman.SortByFormat(this.cur_playlist_idx, '$if3(%original release date%, %originaldate%, %date%) %album% %edition% %codec% %discnumber% %tracknumber%', has_multiple_selected_items);
			}
		);

		sort.append_separator();

		sort.append_item(
			'Randomize',
			() => {
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
			() => {
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
	 * @param {ContextMenu} parent_menu
	 * @param {FbMetadbHandle} metadb
	 */
	append_weblinks_menu_to(parent_menu, metadb) {
		var web = new ContextMenu('Weblinks');
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
	 * @param {ContextMenu} parent_menu
	 */
	append_send_items_menu_to(parent_menu) {
		var playlist_count = plman.PlaylistCount;

		var send = new ContextMenu('Send selection');
		parent_menu.append(send);

		send.append_item(
			'To top',
			() => {
				plman.UndoBackup(this.cur_playlist_idx);
				plman.MovePlaylistSelection(this.cur_playlist_idx, -plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx));
			}
		);

		send.append_item(
			'To bottom',
			() => {
				plman.UndoBackup(this.cur_playlist_idx);
				plman.MovePlaylistSelection(this.cur_playlist_idx, plman.PlaylistItemCount(this.cur_playlist_idx) - plman.GetPlaylistSelectedItems(this.cur_playlist_idx).Count);
			}
		);

		send.append_separator();

		send.append_item(
			'Create New Playlist \tCtrl+N',
			() => {
				plman.CreatePlaylist(playlist_count, '');
				plman.InsertPlaylistItems(playlist_count, 0, plman.GetPlaylistSelectedItems(this.cur_playlist_idx), true);
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
				((playlist_idx) => {
					this.selection_handler.send_to_playlist(playlist_idx);
				}).bind(undefined, i),
				{is_grayed_out: is_item_autoplaylist || i === this.cur_playlist_idx}
			);
		}
	}

	//</editor-fold>

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {{row: ?Row, is_above: ?boolean}}
	 */
	get_drop_row_info(x, y) {
		var drop_info = {
			row:      undefined,
			is_above: undefined
		};

		var item = this.get_item_under_mouse(x, y);
		if (!item) {
			if (!this.trace_list(x, y) || !this.cnt.rows.length) {
				return drop_info;
			}

			item = _.last(this.cnt.rows);
		}

		var is_above = y < (item.y + item.h / 2);

		if (item instanceof BaseHeader) {
			var first_row_in_header = item.get_first_row();

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
		else if (item instanceof Row) {
			if (is_above) {
				drop_info.row = item;
				drop_info.is_above = true;
			}
			else {
				if (g_properties.show_header && item.idx === _.last(item.parent.sub_items).idx
					|| item === _.last(this.cnt.rows)) {
					drop_info.row = item;
					drop_info.is_above = false;
				}
				else {
					drop_info.row = this.cnt.rows[item.idx + 1];
					drop_info.is_above = true;
				}
			}
		}

		return drop_info;
	}

	//<editor-fold desc="'Scroll to' Methods">
	show_now_playing() {
		var playing_item_location = plman.GetPlayingItemLocation();
		if (!playing_item_location.IsValid) {
			return;
		}

		if (playing_item_location.PlaylistIndex !== this.cur_playlist_idx) {
			plman.ActivePlaylist = playing_item_location.PlaylistIndex;
			this.initialize_list();
		}
		else if (this.collapse_handler) {
			this.collapse_handler.expand(this.playing_item.parent);
		}

		this.selection_handler.update_selection(this.cnt.rows[playing_item_location.PlaylistItemIndex]);

		this.scroll_to_now_playing();
	}

	scroll_to_now_playing_or_focused() {
		if (this.playing_item) {
			this.scroll_to_row(null, this.playing_item);
		}
		else if (this.focused_item) {
			this.scroll_to_row(null, this.focused_item);
		}
	}

	scroll_to_focused_or_now_playing() {
		if (this.focused_item) {
			this.scroll_to_row(null, this.focused_item);
		}
		else if (fb.CursorFollowPlayback && this.playing_item) {
			this.scroll_to_row(null, this.playing_item);
		}
	}

	scroll_to_focused() {
		if (this.focused_item) {
			this.scroll_to_row(null, this.focused_item);
		}
	}

	scroll_to_now_playing() {
		if (this.playing_item) {
			this.scroll_to_row(null, this.playing_item);
		}
	}

	/**
	 * @param {?Row} from_row
	 * @param {Row} to_row
	 */
	scroll_to_row(from_row, to_row) {
		if (!this.is_scrollbar_available) {
			return;
		}

		var has_headers = g_properties.show_header;

		var visible_to_item = this.cnt_helper.is_item_visible(to_row) ? to_row : this.cnt_helper.get_visible_parent(to_row);
		var to_item_state = this.get_item_visibility_state(visible_to_item);

		var shifted_successfully = false;
		switch (to_item_state.visibility) {
			case visibility_state.none: {
				if (!from_row) {
					break;
				}

				var visible_from_item = this.cnt_helper.is_item_visible(from_row) ? from_row : this.cnt_helper.get_visible_parent(from_row);

				var from_item_state = this.get_item_visibility_state(visible_from_item);
				if (from_item_state.visibility === visibility_state.none) {
					break;
				}

				var direction = (to_row.idx - from_row.idx) > 0 ? 1 : -1;
				var scroll_shift = 0;
				var neighbour_item = visible_from_item;
				do {
					var neighbour_item_state = this.get_item_visibility_state(neighbour_item);
					scroll_shift += neighbour_item_state.invisible_part;
					neighbour_item = direction > 0 ? this.cnt_helper.get_next_visible_item(neighbour_item) : this.cnt_helper.get_prev_visible_item(neighbour_item);
				} while (neighbour_item && !this.cnt_helper.is_item_navigateable(neighbour_item));

				assert(neighbour_item != null,
					LogicError, 'Failed to get navigateable neighbour');

				if (visible_to_item !== neighbour_item) {
					// I.e. to_item and from_item are not neighbours
					break;
				}

				scroll_shift += visible_to_item.h / this.row_h;

				this.scrollbar.smooth_scroll_to(g_properties.scroll_pos + direction * scroll_shift);
				shifted_successfully = true;

				break;
			}
			case visibility_state.partial_top: {
				if (to_item_state.invisible_part % 1 > 0) {
					this.scrollbar.shift_line(-1);
				}
				this.scrollbar.smooth_scroll_to(g_properties.scroll_pos - Math.floor(to_item_state.invisible_part));
				shifted_successfully = true;
				break;
			}
			case visibility_state.partial_bottom: {
				if (to_item_state.invisible_part % 1 > 0) {
					this.scrollbar.shift_line(1);
				}
				this.scrollbar.smooth_scroll_to(g_properties.scroll_pos + Math.floor(to_item_state.invisible_part));
				shifted_successfully = true;
				break;
			}
			case visibility_state.full: {
				shifted_successfully = true;
				break;
			}
			default: {
				throw new ArgumentError('visibility_state', to_item_state.visibility);
			}
		}

		if (shifted_successfully) {
			if (has_headers) {
				var scroll_shift = 0;
				var top_item = visible_to_item;
				while (top_item.parent && top_item.parent instanceof BaseHeader && top_item === top_item.parent.sub_items[0]) {
					top_item = top_item.parent;
					var header_state = this.get_item_visibility_state(top_item);
					scroll_shift += header_state.invisible_part;
				}
				this.scrollbar.smooth_scroll_to(g_properties.scroll_pos - scroll_shift);
			}
		}
		else {
			var item_draw_idx = this.get_item_draw_row_idx(visible_to_item);
			var new_scroll_pos = Math.max(0, item_draw_idx - Math.floor(this.rows_to_draw_precise / 2));
			this.scrollbar.smooth_scroll_to(new_scroll_pos);
		}
	}

	/**
	 * @param {Row|BaseHeader} item_to_check
	 * @return {{visibility: visibility_state, invisible_part: number}}
	 */
	get_item_visibility_state(item_to_check) {
		var item_state = {
			visibility:     visibility_state.none,
			invisible_part: item_to_check.h / this.row_h
		};

		this.items_to_draw.every((item) => {
			if (item === item_to_check) {
				if (item.y < this.list_y && item.y + item.h > this.list_y) {
					item_state.visibility = visibility_state.partial_top;
					item_state.invisible_part = (this.list_y - item.y) / this.row_h;
				}
				else if (item.y < this.list_y + this.list_h && item.y + item.h > this.list_y + this.list_h) {
					item_state.visibility = visibility_state.partial_bottom;
					item_state.invisible_part = ((item.y + item.h) - (this.list_y + this.list_h)) / this.row_h;
				}
				else {
					item_state.visibility = visibility_state.full;
					item_state.invisible_part = 0;
				}
				return false; // aborts every
			}
			return true;
		});

		return item_state;
	}

	/**
	 * Note: at worst has O(playlist_size) complexity
	 *
	 * @param {Row|BaseHeader} target_item
	 * @return {number}
	 */
	get_item_draw_row_idx(target_item) {
		var cur_row = 0;
		var is_target_row = target_item instanceof Row;

		const iterate_level = (sub_items, target_item) => {
			if (sub_items[0] instanceof BaseHeader) {
				var header_h_in_rows = Math.round(sub_items[0].h / this.row_h);

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

		if (!iterate_level(g_properties.show_header ? this.cnt.sub_items : this.cnt.rows, target_item)) {
			throw new LogicError('Could not find item in drawn item list');
		}

		return cur_row;
	}

	//</editor-fold>

	/**
	 * @param {string} key 'up' or 'down'
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

				var cur_marked_item;
				if (key === 'up') {
					this.scrollbar.shift_line(-1);

					cur_marked_item = this.items_to_draw[0];
					if (cur_marked_item instanceof BaseHeader) {
						this.collapse_handler.expand(cur_marked_item);
						if (this.collapse_handler.changed) {
							this.scrollbar.scroll_to(g_properties.scroll_pos + cur_marked_item.get_sub_items_total_h_in_rows());
						}

						cur_marked_item = cur_marked_item.get_first_row();
					}

					this.selection_handler.drag(cur_marked_item, true);
					cur_marked_item.is_drop_boundary_reached = true;
				}
				else if (key === 'down') {
					this.scrollbar.shift_line(1);

					cur_marked_item = _.last(this.items_to_draw);
					if (cur_marked_item instanceof BaseHeader) {
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
	}

	/**
	 * @param {number} effect
	 * @return {number}
	 */
	filter_effect_by_modifiers(effect) {
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
			return (effect & g_drop_effect.copy) || (effect & g_drop_effect.link);
		}

		if (shift_pressed) {
			// Move only
			return (effect & g_drop_effect.move);
		}

		// Move > Copy > Link
		return (effect & g_drop_effect.move) || (effect & g_drop_effect.copy) || (effect & g_drop_effect.link);
	}

	calcHeaderRows() {
		var numRows;
		if (g_properties.use_compact_header) {
			numRows = g_properties.rows_in_compact_header;
		} else {
			numRows = g_properties.rows_in_header;
			if ((pref.font_size_playlist_header * 2 + 3 + pref.font_size_playlist) > (g_properties.rows_in_header * g_properties.row_h * 0.6)) {
				numRows++;
			}
		}
		return numRows;
	}
}

/**
 * @type {function}
 */
var debounced_get_album_art = _.debounce(function (items) {
	getHeaderArtwork(items);
}, 500, {
	leading:  false,
	trailing: true
});

/** @type {FbMetadbHandle[]} */
let loadingArtList = [];	// list of handles that we are loading artwork for.

/**
 * Loads artwork given a list of headers items. Typically called in a debounce.
 * @param {Header[]|Row[]} items
 */
function getHeaderArtwork(items) {
	items.forEach(item => {
		if (!(item instanceof Header) || item.is_art_loaded()) {
			return;
		}

		const metadb = item.get_first_row().metadb;
		var cached_art = Header.art_cache.get_image_for_meta(metadb);
		if (cached_art) {
			item.assign_art(cached_art);
		} else {
			// TODO Once this has been better tested, remove on_get_album_art_done callback from this file, and probably georgia-main.js as well
			// utils.GetAlbumArtAsync(window.ID, metadb, g_album_art_id.front);
			if (!loadingArtList.find(handle => handle === metadb)) {
				loadingArtList.push(metadb);
				utils.GetAlbumArtAsyncV2(window.ID, metadb, g_album_art_id.front).then((artResult) => {
					loadingArtList = loadingArtList.filter(handle => handle !== metadb);
					if (!item.is_art_loaded()) {
						item.assign_art(artResult.image);
						item.repaint();
					}
				});
			}
		}
	});
}

/**
 * @param {Array<Header>} items
 */
function get_album_art(items) {
	if (!g_properties.show_album_art || g_properties.use_compact_header) {
		return;
	}

	debounced_get_album_art(items);
}


class PlaylistContent extends ListRowContent {
	/**
	 * @final
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * It is assumed that every sub_items array contains only items of the same single type
		 *
		 * @type {Array<Header>}
		 */
		this.sub_items = [];

		this.helper = new ContentNavigationHelper(this);

	}

	/** @override */
	generate_items_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		if (!this.rows.length) {
			return [];
		}

		if (!g_properties.show_header) {
			return ListRowContent.prototype.generate_items_to_draw.apply(this, [wy, wh, row_shift, pixel_shift, row_h]);
		}

		var first_item = this.generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h);
		return this.generate_all_items_to_draw(wy, wh, first_item);
	};

	/** @override */
	update_items_w_size(w) {
		if (!g_properties.show_header) {
			ListRowContent.prototype.update_items_w_size.apply(this, [w]);
			return;
		}

		this.sub_items.forEach(function (item) {
			item.set_w(w);
		});
	}

	/** @override */
	calculate_total_h_in_rows() {
		if (!g_properties.show_header) {
			return ListRowContent.prototype.calculate_total_h_in_rows.apply(this);
		}

		if (!this.sub_items.length) {
			return 0;
		}

		var row_h = playlist_geo.row_h;
		var total_height_in_rows = Math.round(this.sub_items[0].h / row_h) * this.sub_items.length;
		this.sub_items.forEach(item => {
			if (!item.is_collapsed) {
				total_height_in_rows += item.get_sub_items_total_h_in_rows();
			}
		});

		return total_height_in_rows;
	}

	/**
	 * @param {number} wy
	 * @param {number} wh
	 * @param {number} row_shift
	 * @param {number} pixel_shift
	 * @param {number} row_h
	 * @return {Row|BaseHeader}
	 */
	generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h) {
		var start_y = wy + pixel_shift;
		var cur_row = 0;

		/**
		 * Searches sub_items for first visible item {@link ContentNavigationHelper.is_item_visible}
		 *
		 * @param {Array<BaseHeader>|Array<Row>} sub_items
		 * @return {?BaseHeader|?Row}
		 */
		function iterate_level(sub_items) {
			if (sub_items[0] instanceof BaseHeader) {
				var header_h_in_rows = Math.round(sub_items[0].h / row_h);

				for (var i = 0; i < sub_items.length; ++i) {
					/** @type {BaseHeader} */
					// @ts-ignore
					const header = sub_items[i];
					if (cur_row + header_h_in_rows - 1 >= row_shift /*&& !header.dont_draw*/) {
						header.set_y(start_y + (cur_row - row_shift) * row_h);
						return header;
					}

					// if (!header.dont_draw) {
						cur_row += header_h_in_rows;
					// }

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

		var first_item = iterate_level(this.sub_items);
		assert(first_item != null,
			LogicError, 'first_item_to_draw can\'t be null!');

		return first_item;
	}

	/**
	 * @param {number} wy
	 * @param {number} wh
	 * @param {Row|BaseHeader} first_item
	 * @return {Array<Row|BaseHeader>}
	 */
	generate_all_items_to_draw(wy, wh, first_item) {
		var items_to_draw = [first_item];
		var cur_y = first_item.y + first_item.h;

		/**
		 *
		 * @param {Array<BaseHeader>|Array<Row>} sub_items
		 * @param {Row|BaseHeader} start_item
		 * @return {boolean} true, if start_item was used
		 */
		function iterate_level(sub_items, start_item) {
			var is_cur_level_header = sub_items[0] instanceof BaseHeader;
			var start_item_used = !start_item;

			var leveled_start_item = start_item;
			while (leveled_start_item && leveled_start_item.parent !== sub_items[0].parent) {
				leveled_start_item = leveled_start_item.parent;
			}

			var start_idx = 0;
			if (leveled_start_item) {
				start_idx = leveled_start_item instanceof Row ? leveled_start_item.idx_in_header : leveled_start_item.idx;
			}

			for (var i = start_idx; i < sub_items.length; ++i) {
				var item = sub_items[i];
				if (start_item_used /* && !item.dont_draw*/) {
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
					if (item instanceof BaseHeader && item.is_collapsed) {
						continue;
					}

					// @ts-ignore
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

		iterate_level(this.sub_items, first_item);

		return items_to_draw;
	}
}

function getItemType(item) {
	if (!item) {
		return 'Item is undefined or null'
	}
	else if (item instanceof Header) {
		return 'Header';
	}
	else if (item instanceof DiscHeader) {
		return 'DiscHeader';
	}
	else if (item instanceof Row) {
		return 'Row';
	}
	return 'Unknown Item Type'
}

function ContentNavigationHelper(cnt_arg) {
	/**
	 * @param {Row|BaseHeader} item
	 * @return {?BaseHeader}
	 */
	this.get_visible_parent = function (item) {
		if (!item.parent || !(item.parent instanceof BaseHeader)) {
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
		if (item.parent && item.parent instanceof BaseHeader) {
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
		return item instanceof Row ? true : item.is_collapsed;
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
			while (!(last_item instanceof Row) && !last_item.is_collapsed) {
				last_item = _.last(last_item.sub_items);
			}

			return last_item;
		}

		/**
		 * @param {BaseHeader} header
		 * @return {Row|BaseHeader|null}
		 */
		function get_prev_item_before_header(header) {
			if (header === header.parent.sub_items[0]) {
				return header.parent instanceof BaseHeader ? header.parent : null;
			}

			// @ts-ignore
			return get_last_visible_item(header.parent.sub_items[header.idx - 1]);
		}

		/**
		 * @param {Row} row
		 * @return {Row|BaseHeader|null}
		 */
		function get_prev_item_before_row(row) {
			if (row === row.parent.sub_items[0]) {
				return row.parent;
			}

			return row.parent.sub_items[row.idx_in_header - 1];
		}

		if (!g_properties.show_header) {
			if (item === cnt.rows[0]) {
				return null;
			}

			// @ts-ignore
			return cnt.rows[item.idx - 1];
		}

		if (item instanceof BaseHeader) {
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
					var next_item_idx = next_item instanceof Row ? next_item.idx_in_header : next_item.idx;
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

			// @ts-ignore
			return cnt.rows[item.idx + 1];
		}

		if (item instanceof BaseHeader && !item.is_collapsed) {
			return item.sub_items[0];
		}

		return get_next_item(item);
	};

	/**
	 * @const
	 * @type {PlaylistContent}
	 */
	var cnt = cnt_arg;
}

//<editor-fold desc="BaseHeader">
class BaseHeader extends ListItem {
	/**
	 * @param {ListContent|BaseHeader} parent
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @param {number} idx
	 *
	 * @abstract
	 * @constructor
	 */
	constructor(parent, x, y, w, h, idx) {
		super(x, y, w, h);

		/**
		 * @const
		 * @type {BaseHeader}
		 */
		// @ts-ignore
		this.parent = parent;

		/**
		 * @const
		 * @type {number}
		 */
		this.idx = idx;

		/** @type {boolean} */ this.is_collapsed = false;
		/** @type {boolean} currently only updated at draw time */ this.hasSelection = false;

		/**
		 * @type {number}
		 * @private
		 */
		this.row_count = 0;

		/** @type{Array<Row>|Array<BaseHeader>} */
		this.sub_items = [];
	}

	/**
	 * @param {Array<Row>|Array<BaseHeader>} items
	 * @return {number} Number of processed items
	 * @abstract
	 */
	initialize_items(items) {
		throw new LogicError("initialize_contents not implemented");
	}

	/**
	 * @override
	 * @abstract
	 */
	draw(gr) {
		// Need this useless method to suppress warning =(
		throw new LogicError("draw not implemented");
	}

	/** @override */
	set_w(w) {
		ListItem.prototype.set_w.apply(this, [w]);

		this.sub_items.forEach(function (item) {
			item.set_w(w);
		});
	}

	/**
	 * @returns {Row}
	 */
	get_first_row() {
		if (!this.sub_items.length) {
			return null;
		}

		var item = this.sub_items[0];
		while (item && !(item instanceof Row)) {
			item = item.sub_items[0];
		}

		// @ts-ignore
		return item;
	}

	get_row_indexes() {
		var row_indexes = [];

		if (this.sub_items[0] instanceof Row) {
			this.sub_items.forEach(function (item) {
				row_indexes.push(item.idx);
			});
		}
		else {
			this.sub_items.forEach(function (item) {
				row_indexes = row_indexes.concat(item.get_row_indexes());
			});
		}

		return row_indexes;
	}

	/**
	 * @return {number}
	 */
	get_sub_items_total_h_in_rows() {
		if (!this.sub_items.length) {
			return 0;
		}

		if (this.sub_items[0] instanceof Row) {
			return this.sub_items.length;
		}

		var row_h = playlist_geo.row_h;
		var h_in_rows = Math.round(this.sub_items[0].h / row_h) * this.sub_items.length;
		this.sub_items.forEach((item) => {
			if (!item.is_collapsed) {
				h_in_rows += item.get_sub_items_total_h_in_rows();
			}
		});

		return h_in_rows;
	}

	has_selected_items() {
		// var is_function = typeof this.sub_items[0].has_selected_items === "function";
		const isHeader = this.sub_items[0] instanceof BaseHeader;
		return this.sub_items.some(item => {
			return isHeader ? item.has_selected_items() : item.is_selected();
		});
	}

	is_completely_selected() {
		const isHeader = this.sub_items[0] instanceof BaseHeader;
		// @ts-ignore
		return this.sub_items.every(item => {
			return isHeader ? item.is_completely_selected() : item.is_selected();
		});
	}

	is_playing() {
		var is_function = typeof this.sub_items[0].is_playing === "function";
		return this.sub_items.some(item => {
			return is_function ? item.is_playing() : item.is_playing;
		});
	}

	is_focused() {
		var is_function = typeof this.sub_items[0].is_focused === "function";
		return this.sub_items.some(item => {
			return is_function ? item.is_focused() : item.is_focused;
		});
	}

	on_mouse_lbtn_dblclk(x, y, m) {
		plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.get_first_row().idx);
	}

	/**
	 * @return {number} float number
	 */
	get_duration() {
		var duration_in_seconds = 0;

		if (this.sub_items[0] instanceof Row) {
			this.sub_items.forEach((item) => {
				duration_in_seconds += item.metadb.Length;
			});
		}
		else {
			this.sub_items.forEach((item) => {
				duration_in_seconds += item.get_duration();
			});
		}

		return duration_in_seconds;
	}
}

// BaseHeader.prototype = Object.create(ListItem.prototype);
// BaseHeader.prototype.constructor = BaseHeader;

//</editor-fold>

class DiscHeader extends BaseHeader {
	constructor(parent, x, y, w, h, idx) {
		super(parent, x, y, w, h, idx);

		this.idx = idx;

		this.num_in_header = 0;
		// this.dont_draw = false;
		this.is_odd = false;    // TODO: does this ever get set?

		this.disc_title = '';
	}

	/** @override */
	initialize_items(rows_with_data) {
		/** @type {Row[]} */
		this.sub_items = [];
		if (!rows_with_data.length) {
			return 0;
		}

		var first_data = rows_with_data[0][1];
		rows_with_data.every((item, i) => {
			if (first_data !== item[1]) {
				return false;	// aborts the every
			}

			var row = item[0];

			row.idx_in_header = i;
			// noinspection JSBitwiseOperatorUsage
			row.is_odd = !(i & 1);
			row.parent = this;

			this.sub_items.push(row);
			return true;
		});

		this.disc_title = first_data;

		return this.sub_items.length;
	}

	//public:
	draw(gr, top, bottom) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);

		if (this.is_collapsed || (this.is_odd && g_properties.alternate_row_color)) {
			gr.FillSolidRect(this.x, this.y + 1, this.w, this.h - 1, g_pl_colors.row_alternate);
		}

		var cur_x = this.x + scaleForDisplay(20);
		var right_pad = scaleForDisplay(20);

		var title_font = g_pl_fonts.title_normal;
		var title_color = g_pl_colors.title_normal;

		if (this.is_selected()) {
			title_color = g_pl_colors.title_selected;
			title_font = g_pl_fonts.title_selected;
			if (pref.whiteTheme || pref.blackTheme) {
				gr.FillSolidRect(this.x, this.y, scaleForDisplay(8), this.h - 1, col.primary);
			}
		}

		var disc_header_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
		var disc_text = this.disc_title; //$('[Disc %discnumber% $if('+ tf.disc_subtitle+', \u2014 ,) ]['+ tf.disc_subtitle +']', that.sub_items[0].metadb);
		gr.DrawString(disc_text, title_font, title_color, cur_x, this.y, this.w, this.h, disc_header_text_format);
		var disc_w = Math.ceil(gr.MeasureString(disc_text, title_font, 0, 0, 0, 0).Width + 14);

		var tracks_text = this.sub_items.length + ' Track' + (this.sub_items.length > 1 ? 's' : '') + ' - ' + utils.FormatDuration(this.get_duration());

		var tracks_w = Math.ceil(gr.MeasureString(tracks_text, title_font, 0, 0, 0, 0).Width + 20);
		var tracks_x = this.x + this.w - tracks_w - right_pad;

		gr.DrawString(tracks_text, title_font, title_color, tracks_x, this.y, tracks_w, this.h, g_string_format.v_align_center | g_string_format.h_align_far);

		if (this.is_collapsed) {
			var line_y = Math.round(this.y + this.h / 2) + scaleForDisplay(4);
			gr.DrawLine(is_4k ? cur_x + disc_w + 5 : cur_x + disc_w - 5, line_y, is_4k ? this.x + this.w - tracks_w - 40 : this.x + this.w - tracks_w - 10, line_y, 1, RGBA(100, 100, 100, 100));
			//line_y += 4;
			//gr.DrawLine(is_4k ? cur_x + disc_w + 5 : cur_x + disc_w - 5, line_y, is_4k ? this.x + this.w - tracks_w - 40 : this.x + this.w - tracks_w - 10, line_y, 1, RGBA(100, 100, 100, 100));
		} else {
			var line_y = Math.round(this.y + this.h / 2) + scaleForDisplay(4);
			gr.DrawLine(is_4k ? cur_x + disc_w + 5 : cur_x + disc_w - 5, line_y, is_4k ? this.x + this.w - tracks_w - 40 : this.x + this.w - tracks_w - 10, line_y, 1,
				pref.whiteTheme ? RGB(200, 200, 200) :
				pref.blackTheme ? RGB(45, 45, 45) :
				pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.accent : RGB(200, 200, 200) :
				pref.blueTheme ? RGB(17, 100, 182) :
				pref.darkblueTheme ? RGB(12, 21, 31) :
				pref.redTheme ? RGB(75, 18, 18) :
				pref.creamTheme ? RGB(200, 200, 200) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : ''
			);
		}
	}

	is_selected() {
		return this.sub_items.every(row => {
			return row.is_selected();
		});
	};

	toggle_collapse() {
		this.is_collapsed = !this.is_collapsed;

		// this.header.collapse();
		// this.header.expand();
	}

	on_mouse_lbtn_dblclk(collapse_handler) {
		collapse_handler.toggle_collapse(this);
	}

	/** @override
	 * @return {number} float
	*/
	get_duration() {
		var duration_in_seconds = 0;

		this.sub_items.forEach(item => {
			duration_in_seconds += item.metadb.Length;
		});

		if (!duration_in_seconds) {
			return 0;
		}

		return duration_in_seconds;
	}

	// var that = this;
}

// DiscHeader.prototype = Object.create(BaseHeader.prototype);
// DiscHeader.prototype.constructor = Header;

/**
 * @param {Array<Row>} rows_to_process
 * @param {FbMetadbHandleList} rows_metadb
 * @return {Array<Array>} Has the following format Array<[row,row_data]>
 */
DiscHeader.prepare_initialization_data = function (rows_to_process, rows_metadb) {
	var tfo = fb.TitleFormat('$ifgreater(%totaldiscs%,1,[Disc %discnumber% $if('+ tf.disc_subtitle+', \u2014 ,) ],)['+ tf.disc_subtitle +']');
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
		trimArray(prepared_rows, rows_to_process_count, true);
		return [];
	}

	var prepared_rows_copy = _.clone(prepared_rows);
	prepared_rows_copy.length = rows_to_process_count;

	var header_idx = 0;
	var headers = [];
	var start_length = prepared_rows_copy.length;
	while (prepared_rows_copy.length) {
		var header = new DiscHeader(parent, x, y, w, h, header_idx);
		var processed_items = header.initialize_items(prepared_rows_copy);

		trimArray(prepared_rows_copy, processed_items, true);

		headers.push(header);
		++header_idx;
	}

	trimArray(prepared_rows, rows_to_process_count, true);

	return headers;
};

/**
 * @param {ListContent|BaseHeader} parent
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
class Header extends BaseHeader {
	constructor(parent, x, y, w, h, idx) {
		super(parent, x, y, w, h, idx);

		/**
		 * @const
		 * @type {number}
		 */
		this.art_max_size = this.h - scaleForDisplay(16);

		/** @type {FbMetadbHandle} */
		this.metadb;
		/**
		 * @type {?GdiBitmap}
		 */
		this.art = undefined; // undefined > Not Loaded; null > Loaded & Not Found; !_.isNil > Loaded & Found
		this.grouping_handler = Header.grouping_handler;

		this.hyperlinks = {};
		this.hyperlinks_initialized = false;
		this.was_playing = undefined; // last value of this.is_playing() updated each draw cycle

		this.header_image = undefined;
	}

	/** @override */
	initialize_items(rows_with_data) {
		this.sub_items = [];

		var rows_with_header_data = rows_with_data[0];
		if (!rows_with_header_data.length) {
			return 0;
		}

		var first_data = rows_with_header_data[0][1];

		var owned_rows = [];
		for (let i = 0; i < rows_with_header_data.length; i++) {
			if (first_data !== rows_with_header_data[i][1]) {
				break;
			}
			owned_rows.push(rows_with_header_data[i][0]);
		}

		this.metadb = owned_rows[0].metadb;

		var sub_headers = [];
		if (g_properties.show_disc_header && this.grouping_handler.show_cd()) {
			var rows_with_discheader_data = rows_with_data[1];
			sub_headers = this.create_cd_headers(rows_with_discheader_data, owned_rows.length);
			if (sub_headers.length) {
				this.sub_items = sub_headers;
			}
		}

		if (sub_headers.length) {
			this.sub_items = sub_headers;
		}
		else {
			this.sub_items = owned_rows;

			owned_rows.forEach((item, i) => {
				item.idx_in_header = i;
				if (g_properties.show_header) {
					// noinspection JSBitwiseOperatorUsage
					item.is_odd = !(i & 1);
				}
				item.parent = this;
			});
		}

		return owned_rows.length;
	};

	/**
	 * @param {Array} prepared_rows
	 * @param {number} rows_to_proccess_count
	 * @return {Array<DiscHeader>}
	 */
	create_cd_headers(prepared_rows, rows_to_proccess_count) {
		return DiscHeader.create_headers(this, this.x, 0, this.w, playlist_geo.row_h, prepared_rows, rows_to_proccess_count);
	}

	getGroupInfoString(is_radio, hasGenreTags) {
		var bitspersample = Number($('$info(bitspersample)', this.metadb));
		var samplerate = Number($('$info(samplerate)', this.metadb));
		var sample = ((bitspersample > 16 || samplerate > 44100 || settings.playlistAlwaysShowBitrate) ? $(' [$info(bitspersample)bit/]', this.metadb) + samplerate / 1000 + 'khz' : '');
		var codec = $('$lower($if2(%codec%,$ext(%path%)))', this.metadb);

		if (codec === "dca (dts coherent acoustics)") {
			codec = "dts";
		}
		if (codec === 'cue') {
			codec = $('$ext($info(referenced_file))', this.metadb);
		}
		else if (codec === 'mpc') {
			codec += $('[-$info(codec_profile)]', this.metadb).replace('quality ', 'q');
		}
		else if (codec === 'dts' || codec === 'ac3' || codec === 'atsc a/52') {
			codec += $("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%", this.metadb) + ' kbps';
			codec = codec.replace('atsc a/52', 'Dolby Digital');
		}
		else if ($('$info(encoding)', this.metadb) === 'lossy') {
			if ($('$info(codec_profile)', this.metadb) === 'CBR') {
				codec += $('[-%bitrate% kbps]', this.metadb);
			}
			else {
				codec += $('[-$info(codec_profile)]', this.metadb);
			}
		}
		if (codec) {
			codec = codec + sample;
		}
		else {
			codec = (_.startsWith(this.metadb.RawPath, '3dydfy:') || _.startsWith(this.metadb.RawPath, 'fy+')) ? 'yt' : this.metadb.Path;
		}

		var track_count = this.sub_items.length;
		var has_discs = false;
		if (this.sub_items[0] instanceof DiscHeader) {
			track_count = 0;
			has_discs = true;
			this.sub_items.forEach(discHeader => {
				track_count += discHeader.sub_items.length
			});
		}

		var disc_number = (!this.grouping_handler.show_cd() && $('[%totaldiscs%]', this.metadb) !== '1') ? $('[ | Disc: %discnumber%[/%totaldiscs%]]', this.metadb) : '';
		var track_text = is_radio ? '' : ' | ' +
				(this.grouping_handler.show_cd() && has_discs ? this.sub_items.length + ' Discs - ' : '') +
				track_count + (track_count === 1 ? ' Track' : ' Tracks');
		var info_text = $(codec + disc_number + '[ | %replaygain_album_gain%]', this.metadb) + track_text;
		if (hasGenreTags) {
			info_text = ' | ' + info_text;
		}
		if (this.get_duration()) {
			info_text += ' | Time: ' + utils.FormatDuration(this.get_duration());
		}
		return info_text;
	}

	/** @override */
	draw(gr, top, bottom) {
		// drawProfiler = fb.CreateProfiler('Header.draw items:' + this.sub_items.length);
		if (g_properties.use_compact_header) {
			this.draw_compact_header(gr)
		}
		else {
			this.draw_normal_header(gr, top, bottom);
		}
		// drawProfiler.Print();
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw_normal_header(gr, top, bottom) {
		if (!this.hyperlinks_initialized) {
			this.initialize_hyperlinks(gr);
		}
		var cache_header = true;  // caching is a lot faster, but need to handle artwork loading
		if (this.was_playing !== this.is_playing()) {
			this.was_playing = this.is_playing();
			cache_header = false;
			this.clearCachedHeaderImg();
		}
		const hasSelection = this.has_selected_items();
		if (this.hasSelection !== hasSelection) {
			this.hasSelection = hasSelection;
			cache_header = false;
			this.clearCachedHeaderImg();
		}
		if (!cache_header || !this.header_image || initTheme) {
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

				const bg_color = this.is_playing() + col.primary;
				const brightBackground = (new Color(bg_color).brightness) > 151;
				if (brightBackground && pref.blackTheme) {
					artist_color = rgb(0, 0, 0);
					album_color = rgb(20, 20, 20);
					info_color = rgb(20, 20, 20);
					date_color = rgb(20, 20, 20);
				} else if (brightBackground && pref.whiteTheme && (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode')) {
					artist_color  = rgb(60, 60, 60);
					album_color = rgb(60, 60, 60);
					info_color = rgb(60, 60, 60);
					date_color = rgb(60, 60, 60);
					line_color = rgb(100, 100, 100);
				}
			}
			/*
			if (this.hasSelection) {
				line_color = g_pl_colors.line_selected;
				artist_color = album_color = date_color = info_color = g_pl_colors.group_title_selected;
			}
			*/
			var clipImg = gdi.CreateImage(this.w, this.h);
			var grClip = clipImg.GetGraphics();

			grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.background); // Solid background for ClearTypeGridFit text rendering

			if (this.hasSelection) {
				if (pref.whiteTheme || pref.blackTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.row_selected);
				}
			}

			if (this.is_playing()) {
				var p = scaleForDisplay(6);  // from art below

				if (this.hasSelection && pref.whiteTheme) {
					if (pref.layout_mode === 'default_mode') {
						grClip.FillSolidRect(0, p, scaleForDisplay(8), this.h - p * 2, col.primary);
					} else if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
						grClip.FillSolidRect(0, 0, this.w, this.h * 2, col.primary);
					}
				} else if (!this.hasSelection && pref.whiteTheme) {
					if (pref.layout_mode === 'default_mode') {
						grClip.FillSolidRect(0, p, scaleForDisplay(8), this.h - p * 2, col.primary);
					} else if (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') {
						grClip.FillSolidRect(0, 0, this.w, this.h * 2, col.primary);
					}
				}

				if (this.hasSelection && pref.blackTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h * 2, col.primary);
				} else if (!this.hasSelection && pref.blackTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h * 2, col.primary);
				}

				if (this.hasSelection && pref.rebornTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h * 2, g_pl_colors.background != RGB(255, 255, 255) ? col.darkMiddleAccent : !albumart ? RGB(255, 255, 255) : col.primary);
				} else if (!this.hasSelection && pref.rebornTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h * 2, g_pl_colors.background != RGB(255, 255, 255) ? col.darkMiddleAccent : !albumart ? RGB(255, 255, 255) : col.primary);
				}

				if (this.hasSelection && pref.creamTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h * 2, RGB(120, 170, 130));
				} else if (!this.hasSelection && pref.creamTheme) {
					grClip.FillSolidRect(0, 0, this.w, this.h * 2, RGB(120, 170, 130));
				}

				if (this.hasSelection && (pref.rebornTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme)) {
					grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h,
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
						pref.blueTheme ? RGB(242, 230, 170) :
						pref.darkblueTheme ? RGB(255, 202, 128) :
						pref.redTheme ? RGB(245, 212, 165) :
						pref.nblueTheme ? RGB(0, 200, 255) :
						pref.ngreenTheme ? RGB(0, 200, 0) :
						pref.nredTheme ? RGB(229, 7, 44) :
						pref.ngoldTheme ? RGB(254, 204, 3) : ''
					);
					grClip.FillSolidRect(scaleForDisplay(8), 0, this.w, this.h,
						pref.blueTheme ? RGB(10, 130, 220) :
						pref.darkblueTheme ? RGB(24, 50, 82) :
						pref.redTheme ? RGB(130, 25, 25) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(25, 25, 25) : ''
					);
				} else if (!this.hasSelection && (pref.rebornTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme)) {
					grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h,
						pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
						pref.blueTheme ? RGB(242, 230, 170) :
						pref.darkblueTheme ? RGB(255, 202, 128) :
						pref.redTheme ? RGB(245, 212, 165) :
						pref.nblueTheme ? RGB(0, 200, 255) :
						pref.ngreenTheme ? RGB(0, 200, 0) :
						pref.nredTheme ? RGB(229, 7, 44) :
						pref.ngoldTheme ? RGB(254, 204, 3) : ''
					);
					grClip.FillSolidRect(scaleForDisplay(8), 0, this.w, this.h,
						pref.blueTheme ? RGB(10, 130, 220) :
						pref.darkblueTheme ? RGB(24, 50, 82) :
						pref.redTheme ? RGB(130, 25, 25) :
						pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(25, 25, 25) : ''
					);
				}
			}

			grClip.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

			if (this.is_collapsed && this.is_focused()) {
				grClip.DrawRect(-1, 0, this.w + 1, this.h - 1, 1, line_color);
			}

			//************************************************************//

			var left_pad = scaleForDisplay(10);

			//---> Artbox
			if (g_properties.show_album_art) {
				if (!this.is_art_loaded()) {
					var cached_art = Header.art_cache.get_image_for_meta(this.metadb);
					if (cached_art) {
						this.assign_art(cached_art);
					}
				}

				if (this.art !== null || !g_properties.auto_album_art) {
					var p = scaleForDisplay(6);
					var spacing = scaleForDisplay(2);

					var art_box_size = this.art_max_size + spacing * 2;
					var art_box_x = p * 3;
					var art_box_y = p;
					var art_box_w = art_box_size;
					var art_box_h = art_box_size;

					if (this.art) {
						var art_x = art_box_x + spacing;
						var art_y = art_box_y + spacing;
						var art_h = this.art.Height;
						var art_w = this.art.Width;
						if (art_h > art_w) {
							art_box_w = art_w + spacing * 2;
						}
						else {
							art_box_h = art_h + spacing * 2;
							art_y += Math.round((this.art_max_size - art_h) / 2);
							art_box_y = art_y - spacing;
						}
						grClip.DrawImage(this.art, art_x, art_y, art_w, art_h, 0, 0, art_w, art_h, 0, 220);
					}
					else if (!this.is_art_loaded()) {
						grClip.DrawString('LOADING', g_pl_fonts.cover, g_pl_colors.title_normal, art_box_x, art_box_y, art_box_size, art_box_size, g_string_format.align_center);
						cache_header = false;   // don't cache until artwork is loaded
					}
					else {// null
						var is_radio = _.startsWith(this.metadb.RawPath, 'http') || _.startsWith(this.metadb.Path, 'spotify');
						grClip.DrawString(isStreaming && is_radio ? 'LIVE\n ON AIR' : 'NO COVER', g_pl_fonts.cover,
						(pref.whiteTheme || pref.creamTheme) && (pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode') && this.is_playing() ? RGB(255, 255, 255) :
						g_pl_colors.title_normal, art_box_x, art_box_y, art_box_size, art_box_size, g_string_format.align_center);
					}

					grClip.DrawRect(art_box_x, art_box_y, art_box_w - 1, art_box_h - 1, 1, line_color);

					left_pad += art_box_x + art_box_w;
					this.hyperlinks.artist && this.hyperlinks.artist.set_xOffset(left_pad);
					this.hyperlinks.album && this.hyperlinks.album.set_xOffset(left_pad);
					var i = 0;
					var offset = 0;
					while (this.hyperlinks['genre' + i]) {
						if (i === 0) {
							offset = this.hyperlinks.genre0.x - left_pad;
							if (!offset) break;
						}
						this.hyperlinks['genre' + i].x -= offset;
						i++;
					}
				}
			}

			//************************************************************//
			var is_radio = _.startsWith(this.metadb.RawPath, 'http') || _.startsWith(this.metadb.Path, 'spotify');

			// part1: artist
			// part2: album + line + Date OR line
			// part3: info OR album
			var part1_cur_x = left_pad;
			var part2_cur_x = left_pad;
			var part3_cur_x = left_pad;

			var part_h = (!g_properties.show_group_info) ? this.h / 2 : this.h / 3;
			var part2_right_pad = 0;

			//---> DATE
			if (this.grouping_handler.show_date()) {
				const date_query = pref.showPlaylistFulldate ? tf.date : tf.year;
				const date_text = $(date_query, this.metadb);
				if (date_text && date_text !== '0000') {
					var date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
					var date_x = this.w - date_w;

					if (!this.hyperlinks.date && date_x > left_pad) {
						var date_y = 0;
						var date_h = this.h - 4;
						grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, g_string_format.v_align_center);
					} else {
						this.hyperlinks.date.draw(grClip, date_color);
					}

					part2_right_pad += this.w - date_x;
				}
			}

			//---> TITLE
			if (this.grouping_handler.get_title_query()) {
				var artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
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

					var artist_text_format = g_string_format.v_align_far | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
					if (is_radio || !this.hyperlinks.artist)  {
						grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format);
					} else {
						this.hyperlinks.artist.draw(grClip, artist_color);
					}
					//part1_cur_x += artist_w;
				}
			}

			//---> SUB TITLE
			if (this.grouping_handler.get_sub_title_query()) {
				var album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
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

					var album_text_format = g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
					if (g_properties.show_group_info) {
						album_text_format |= g_string_format.v_align_center;
					}

					if (!this.hyperlinks.album) {
						grClip.DrawString(album_text, g_pl_fonts.album, album_color, album_x, album_y, album_w, album_h, album_text_format);
					} else {
						this.hyperlinks.album.draw(grClip, album_color);
					}

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
				var info_y = 2 * part_h - (is_4k ? 5 : 0);
				var info_h = part_h;//row_h;
				var info_w = this.w - info_x;

				var genre_text_w = 0;
				var extraGenreSpacing = 0; //is_4k ? 6 : 8;  // don't use scaleForDisplay due to font differences
				var genreX = info_x;
				if (!is_radio && this.grouping_handler.get_query_name() !== 'artist') {
					if (!this.hyperlinks.genre0) {
						var genre_text = $('[%genre%]', this.metadb).replace(/, /g,' \u2022 ');
						genre_text_w = Math.ceil(gr.MeasureString(genre_text, g_pl_fonts.info, 0, 0, 0, 0).Width + extraGenreSpacing);
						grClip.DrawString(genre_text, g_pl_fonts.info, info_color, genreX, info_y, info_w, info_h, info_text_format);
					} else {
						var i = 0;
						let genre_hyperlink = undefined;
						while (this.hyperlinks['genre' + i]) {
							if (i > 0) {
								grClip.DrawString(' \u2022 ', g_pl_fonts.info, info_color, genre_hyperlink.x + genre_hyperlink.getWidth(), info_y, scaleForDisplay(20), info_h);
							}
							genre_hyperlink = this.hyperlinks['genre' + i];
							genre_hyperlink.draw(grClip, info_color);
							genreX = genre_hyperlink.x;
							genre_text_w = genre_hyperlink.getWidth();
							i++;
						}
					}
				}

				var info_text = this.getGroupInfoString(is_radio, genre_text_w > 0)
				var info_text_format = g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
				grClip.DrawString(info_text, g_pl_fonts.info, info_color, genreX + genre_text_w, info_y + 1, info_w - (genreX - info_x) - genre_text_w - scaleForDisplay(20), info_h, info_text_format);
				var info_text_w = Math.ceil(gr.MeasureString(info_text, g_pl_fonts.info, 0, 0, 0, 0).Width);    // TODO: Mordred - should only call MeasureString once

				//---> Record labels
				if (!this.hyperlinks.label0) {
					var label_string = $('$if2(%label%,[%publisher%])', this.metadb).replace(/, /g,' \u2022 ');
					var label_w = Math.ceil(gr.MeasureString(label_string, g_pl_fonts.info, 0, 0, 0, 0).Width + 10);
					if (info_w > label_w + info_text_w) {
						grClip.DrawString(label_string, g_pl_fonts.info, info_color, this.w - label_w - 10, info_y, label_w, info_h, g_string_format.h_align_far);
					}
				} else {
					var i = 0;
					var drawCount = 0;
					var lastLabel;
					while (this.hyperlinks['label' + i]) {
						var label_hyperlink = this.hyperlinks['label' + i];
						if (label_hyperlink.x > genreX + genre_text_w + info_text_w) {
							if (drawCount > 0) {
								grClip.DrawString(' \u2022', g_pl_fonts.info, info_color, lastLabel.x + lastLabel.getWidth(), info_y, scaleForDisplay(20), info_h);
							}
							label_hyperlink.draw(grClip, info_color);
							drawCount++;
						}
						lastLabel = label_hyperlink;    // we want to draw bullet AFTER the previous label
						i++;
					}
				}

				//---> Info line
				var info_text_h = Math.ceil(gr.MeasureString(info_text, g_pl_fonts.info, 0, 0, 0, 0).Height + 5);
				var line_x1 = left_pad;
				var line_x2 = this.w - scaleForDisplay(20);
				var line_y = info_y + info_text_h;
				if (line_x2 - line_x1 > 0) {
					grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
				}
			}

			//---> Part 2 line
			{
				var line_x1 = part2_cur_x;
				if (line_x1 !== left_pad) {
					line_x1 += is_4k ? 20 : 9;
				}
				const date_query = pref.showPlaylistFulldate ? tf.date : tf.year;
				const date_text = $(date_query, this.metadb);
				var line_x2 = this.w - part2_right_pad - (date_text ? (is_4k ? 58 : 25) : scaleForDisplay(20));
				var line_y = Math.round(this.h / 2) + (is_4k ? 10 : 6);

				if (line_x2 - line_x1 > 0) {
					grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
				}
			}

			clipImg.ReleaseGraphics(grClip);
			if (cache_header) {
				this.header_image = clipImg;
			}
		}

		var y = this.y;
		var h = this.h;
		var srcY = 0;
		if (this.y < top) {
			y = top;
			h = this.h - (top - this.y);
			srcY = this.h - h;
		} else if (this.y + this.h > bottom) {
			h = bottom - this.y;
		}
		gr.DrawImage(cache_header ? this.header_image : clipImg, this.x, y, this.w, h, 0, srcY, this.w, h);
		if (this.is_completely_selected()) {
			if (pref.whiteTheme || pref.blackTheme) {
				gr.SetSmoothingMode(SmoothingMode.None);
				gr.FillSolidRect(this.x, y + scaleForDisplay(6), 0, h, col.primary);
				gr.SetSmoothingMode(SmoothingMode.HighQuality);
			}
		}
		clipImg = null;
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw_compact_header(gr) {
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

			const bg_color = col.primary;
			const brightBackground = (new Color(bg_color).brightness) > 151;
			const darkBackground = (new Color(bg_color).brightness) < 151;
			if (brightBackground && (pref.whiteTheme || pref.blackTheme)) {
				artist_color = rgb(0, 0, 0);
				album_color = rgb(20, 20, 20);
				date_color = rgb(20, 20, 20);
			}
			else if (darkBackground && (pref.whiteTheme || pref.blackTheme)) {
				artist_color = rgb(240, 240, 240);
				album_color = rgb(220, 220, 220);
				date_color = rgb(220, 220, 220);
			}
		}
		/*
		if (this.has_selected_items()) {
			line_color = g_pl_colors.line_selected;
			artist_color = album_color = date_color = g_pl_colors.group_title_selected;
		}
		*/
		var clipImg = gdi.CreateImage(this.w, this.h);
		var grClip = clipImg.GetGraphics();

		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);

		//--->
		grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.background); // Solid background for ClearTypeGridFit text rendering
		if (this.has_selected_items()) {
			grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.row_selected);
		}

		if (this.is_playing()) {
			grClip.FillSolidRect(0, 0, this.w, this.h,
				pref.whiteTheme ? col.primary :
				pref.blackTheme ? col.primary :
				pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
				pref.blueTheme ? RGB(10, 130, 220) :
				pref.darkblueTheme ? RGB(24, 50, 82) :
				pref.redTheme ? RGB(130, 25, 25) :
				pref.creamTheme ? RGB(120, 170, 130) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(25, 25, 25) : ''
			);
		}

		if (this.is_playing() && pref.whiteTheme) {
			grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, col.primary);
		} else if (this.is_playing() && pref.blackTheme) {
			grClip.FillSolidRect(0, 0, this.w, this.h, col.primary);
		} else if (this.is_playing() && pref.rebornTheme) {
			grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary);
		} else if (this.is_playing() && pref.blueTheme) {
			grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, rgb(242, 230, 170));
		} else if (this.is_playing() && pref.darkblueTheme) {
			grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, rgb(255, 202, 128));
		} else if (this.is_playing() && pref.redTheme) {
			grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, rgb(245, 212, 165));
		} else if (this.is_playing() && pref.creamTheme) {
			grClip.FillSolidRect(0, 0, this.w, this.h, rgb(120, 170, 130));
		} else if (this.is_playing() && (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme)) {
			grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, g_pl_colors.artist_playing);
		}

		grClip.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.is_collapsed && this.is_focused()) {
			grClip.DrawRect(-1, 0, this.w + 1, this.h - 1, 1, line_color);
		}

		//************************************************************//

		var is_radio = _.startsWith(this.metadb.RawPath, 'http');

		var left_pad = scaleForDisplay(20);
		var right_pad = 0;
		var cur_x = left_pad;

		//---> DATE
		if (this.grouping_handler.show_date()) {
			const date_query = pref.showPlaylistFulldate ? tf.date : tf.year;
			var date_text = $(date_query, this.metadb);
			if (date_text) {
				var date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
				var date_x = this.w - date_w - scaleForDisplay(12);
				var date_y = 0;
				var date_h = this.h;

				if (date_x > left_pad) {
					grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, g_string_format.v_align_center);
				}

				right_pad += this.w - date_x;
			}
		}

		//---> TITLE
		if (this.grouping_handler.get_title_query()) {
			var artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			if (!artist_text) {
				artist_text = is_radio ? 'Radio Stream' : '?';
			}

			if (artist_text) {
				var artist_x = cur_x;
				var artist_w = this.w - artist_x - (right_pad + 5);
				var artist_h = this.h;

				var artist_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
				grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format);

				cur_x += Math.ceil(
					/** @type {!number} */
					gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width
				);
			}
		}

		//---> SUB TITLE
		if (this.grouping_handler.get_sub_title_query()) {

			var album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
			if (album_text) {
				album_text = ' - ' + album_text;

				var album_h = this.h;
				var album_x = cur_x;
				var album_w = this.w - album_x - (right_pad + scaleForDisplay(40));

				var album_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
				grClip.DrawString(album_text, g_pl_fonts.album, album_color, album_x, 0, album_w, album_h, album_text_format);

				//cur_x += gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width;
			}
		}

		// Callback for tooltip
		this.artist_w_compact = this.w - artist_x - (right_pad + 5);
		this.album_w_compact = this.w - album_x - (right_pad + scaleForDisplay(40));
		this.artist_text_w_compact = gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width;
		this.album_text_w_compact = gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width;

		clipImg.ReleaseGraphics(grClip);
		gr.DrawImage(clipImg, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
	}

	/**
	 * @param {GdiBitmap} image
	 */
	assign_art(image) {
		if (!image || !g_properties.show_album_art) {
			this.art = null;
			return;
		}

		if ((image.Height === this.art_max_size && image.Width <= this.art_max_size)
			|| (image.Height <= this.art_max_size && image.Width === this.art_max_size)) {
				this.art = image;
		}
		else {
			var ratio = image.Height / image.Width;
			var art_h = this.art_max_size;
			var art_w = this.art_max_size;
			if (image.Height > image.Width) {
				art_w = Math.round(art_h / ratio);
			}
			else {
				art_h = Math.round(art_w * ratio);
			}

			this.art = image.Resize(art_w, art_h);
		}

		Header.art_cache.add_image_for_meta(this.art, this.metadb);
	}

	/**
	 * @return {boolean}
	 */
	is_art_loaded() {
		return this.art !== undefined;
	}

	initialize_hyperlinks(gr) {
		var right_edge = scaleForDisplay(20);
		this.hyperlinks_initialized = true;
		var date_font = g_pl_fonts.date;
		var artist_font = g_pl_fonts.artist_normal;

		const date_query = pref.showPlaylistFulldate ? tf.date : tf.year;
		const date_text = $(date_query, this.metadb);
		if (date_text) {
			var date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
			var date_x = -date_w - right_edge + (is_4k ? 5 : 7);
			var date_y = Math.floor((this.h / 2) - scaleForDisplay(16));

			this.hyperlinks.date = new Hyperlink(date_text, date_font, 'date', date_x, date_y, this.w, true);
		}

		var left_pad = scaleForDisplay(10);
		var art_box_x = 3 * scaleForDisplay(6);
		var spacing = scaleForDisplay(2);
		var art_box_size = this.art_max_size + spacing * 2;
		var part_h = (!g_properties.show_group_info) ? this.h / 2 : this.h / 3;
		left_pad += art_box_x + art_box_size;

		if (!_.startsWith(this.metadb.RawPath, 'http')) {
			// don't create for radio
			var artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			if (artist_text) {
				var artist_x = left_pad;

				this.hyperlinks.artist = new Hyperlink(artist_text, artist_font, 'artist', artist_x, scaleForDisplay(5), this.w * 0.70, true);
			}
		}

		var album_y = part_h + (is_4k ? 5 : 4);
		var album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
		if (album_text) {
			this.hyperlinks.album = new Hyperlink(album_text, g_pl_fonts.album, 'album', left_pad, album_y, this.w * 0.60, true);
		}

		// Callback for tooltip
		this.artist_text_w = gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width;
		this.album_text_w = gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width;

		var separatorWidth = gr.MeasureString(' \u2020', g_pl_fonts.info, 0, 0, 0, 0).Width;
		var bulletWidth = Math.ceil(gr.MeasureString('\u2020', g_pl_fonts.info, 0, 0, 0, 0).Width);
		var spaceWidth = Math.ceil(separatorWidth - bulletWidth) + scaleForDisplay(1);

		let labels = []
		for (let i = 0; i < tf.labels.length; i++) {
			labels.push(...getMetaValues(tf.labels[i], this.metadb));
		}
		labels = [... new Set(labels)];	// remove duplicates
		var label_left = -right_edge * 2 + (is_4k ? 42 : 20);
		let label_y = Math.round(2 * this.h / 3) - (is_4k ? 4 : -1);
		for (var i = labels.length - 1; i >= 0; --i) {
			if (i != labels.length - 1) {
				label_left -= (bulletWidth + spaceWidth * 2);   // spacing between labels
			}
			var label_w = gr.MeasureString(labels[i], g_pl_fonts.info, 0, 0, 0, 0).Width;
			label_left -= label_w;
			this.hyperlinks['label' + i] = new Hyperlink(labels[i], g_pl_fonts.info, 'label', label_left, label_y, this.w, true);
		}

		const genres = getMetaValues('%genre%', this.metadb);
		var genre_left = left_pad;
		var genre_y = label_y;
		for (var i = 0; i < genres.length; i++) {
			if (i > 0) {
				genre_left += bulletWidth + spaceWidth * 2;   // spacing between genres
			}
			var genre_w = gr.MeasureString(genres[i], g_pl_fonts.info, 0, 0, 0, 0).Width;
			this.hyperlinks['genre' + i] = new Hyperlink(genres[i], g_pl_fonts.info, 'genre', genre_left, genre_y, this.w, true);
			genre_left += genre_w;
		}

		for (let h in this.hyperlinks) {
			this.hyperlinks[h].set_y(this.y);
		}
	}

	on_mouse_move(x, y, m) {
		var handled = false;
		var needs_redraw = false;

		for (let h in this.hyperlinks) {
			if (this.hyperlinks[h].trace(x - this.x, y)) {
				if (this.hyperlinks[h].state !== HyperlinkStates.Hovered) {
					this.hyperlinks[h].state = HyperlinkStates.Hovered;
					needs_redraw = true;
				}
				handled = true;
			} else {
				if (this.hyperlinks[h].state !== HyperlinkStates.Normal) {
					this.hyperlinks[h].state = HyperlinkStates.Normal;
					needs_redraw = true;
				}
			}
		}

		if (pref.show_tt || pref.show_truncatedText_tt) {
			this.header_truncatedText_tt(x, y);
		}

		if (needs_redraw) {
			this.clearCachedHeaderImg();
			this.repaint();
		}

		return handled;
	}

	on_mouse_lbtn_down(x, y, m) {
		var handled = false;

		for (let h in this.hyperlinks) {
			if (this.hyperlinks[h].trace(x - this.x, y)) {
				this.hyperlinks[h].click();
				handled = true;
				break;
			}
		};

		return handled;
	}

	set_y(y) {
		ListItem.prototype.set_y.apply(this, [y]);

		for (let h in this.hyperlinks) {
			this.hyperlinks[h].set_y(y);
		}
	}

	set_w(w) {
		ListItem.prototype.set_w.apply(this, [w]);

		this.sub_items.forEach(function (item) {
			item.set_w(w);
		});

		for (let h in this.hyperlinks) {
			this.hyperlinks[h].setContainerWidth(w);
		}
	}

	reset_hyperlinks() {
		this.hyperlinks_initialized = false;
		this.hyperlinks = {};
	}

	clearCachedHeaderImg() {
		this.header_image = null;
	}

	// Playlist group header truncated text tooltip
	header_truncatedText_tt() {
		if (pref.show_truncatedText_tt) {
			const artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);

			if (this.artist_text_w > this.w * 0.70) {
				tt.showDelayed(artist_text + "\n" + album_text);
			}
			else if (this.album_text_w > this.w * 0.60) {
				tt.showDelayed(artist_text + "\n" + album_text);
			}

			if (g_properties.use_compact_header) {
				if (this.artist_text_w_compact > this.artist_w_compact) {
					tt.showDelayed(artist_text + "\n" + album_text);
				}
				else if (this.album_text_w_compact > this.album_w_compact) {
					tt.showDelayed(artist_text + "\n" + album_text);
				}
			}
		}
	}
}

// Header.prototype = Object.create(BaseHeader.prototype);
// Header.prototype.constructor = Header;

/**
 * @param {Array<Row>} rows_to_process
 * @param {FbMetadbHandleList} rows_metadb
 * @return {Array} Has the following format [Array<[row,row_data]>, disc_header_prepared_data]
 */
Header.prepare_initialization_data = function (rows_to_process, rows_metadb) {
	var query = Header.grouping_handler.get_query();
	if (g_properties.show_disc_header && query && Header.grouping_handler.show_cd()) {
		query = query.replace(/%discnumber%/, '').replace(/%totaldiscs%/, '').replace(/%subtitle%/, '');
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

		trimArray(prepared_header_rows, processed_rows_count, true);

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
 * @extends {ListItem}
 */
class Row extends ListItem {
	constructor(x, y, w, h, metadb, idx, cur_playlist_idx_arg) {
		super(x, y, w, h);

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

		/** @type {?number[]} */
		this.queue_indexes = undefined;
		/** @type {number} */
		this.queue_idx_count = 0;

		//state
		this.is_playing = false;
		this.is_focused = false;
		this.is_drop_boundary_reached = false;
		this.is_drop_bottom_selected = false;
		this.is_drop_top_selected = false;
		this.is_cropped = false;


		/**
		 * @const
		 * @type {number}
		 */
		this.cur_playlist_idx = cur_playlist_idx_arg;

		/**
		 * @type {number}
		 */
		this.rating_left_pad = 0;
		/**
		 * @type {number}
		 */
		this.rating_right_pad = 10;
		/** @type {?Rating} */
		this.rating = undefined;

		/** @type {?string} */
		this.title_text = undefined;
		/** @type {?string} */
		this.title_artist_text = undefined;
		/** @type {?string} */
		this.count_text = undefined;
		/** @type {?string} */
		this.length_text = undefined;

		this.initialize_rating();


		// Playlist row hover
		this.title_color = g_pl_colors.title_normal;

		/** @enum {number} */
		var rowState = {
			normal:  0,
			hovered: 1,
			pressed: 2
		};

		/** @type {number} */
		this.hover_alpha = 0;

		//private:
		var that = this;

		let alpha_timer = new _alpha_timer([this], function () {
			clearInterval(that.rowHoverTimer);
			that.rowHoverTimer = setInterval(() => {
				return that.title_color = g_pl_colors.title_normal;
			}, 1000 );
		});

		/**
		 * @param {rowState} item
		 */
		function change_row_state(item) {
			switch (item) {
				case rowState.normal: {
					that.title_color = g_pl_colors.title_normal;
					break;
				}
				case rowState.hovered: {
					that.title_color = g_pl_colors.title_hovered;
					break;
				}
				case rowState.pressed: {
					that.title_color = g_pl_colors.title_selected;
					break;
				}
			}
			alpha_timer.start();
			window.RepaintRect(playlist.x, playlist.y, playlist.w, playlist.h);
		}

		this.on_mouse_move = function (x, y, m) {
			clearInterval(that.rowHoverTimer);
			change_row_state(this.trace(x, y) ? rowState.hovered : rowState.normal);
		};

		this.trace = function (x, y) {
			return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
		};
	}

	//public:
	draw(gr) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);

		if (this.is_odd && g_properties.alternate_row_color) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.row_alternate);
		}

		if (pref.playlistRowHover) {
			if (needs_rows_repaint) {
				repaintPlaylistRows();
				needs_rows_repaint = false;
			}
		} else {
			this.title_color = g_pl_colors.title_normal;
		}
		var title_font = g_pl_fonts.title_normal;
		var title_artist_font = g_pl_fonts.title_selected;
		var title_artist_color = g_pl_colors.title_selected;

		if (this.is_selected()) {
			this.title_color = g_pl_colors.title_selected;
			title_font = g_pl_fonts.title_selected;
			title_artist_color = g_pl_colors.title_normal;

			if (g_properties.alternate_row_color) {
				// last item is cropped
				var rect_h = this.is_cropped ? this.h - 1 : this.h;
				gr.DrawRect(this.x, this.y, this.w, rect_h, 1,
					pref.whiteTheme || pref.blackTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.row_focus_selected :
					pref.blueTheme ? RGB(10, 135, 230) :
					pref.darkblueTheme ? RGB(27, 55, 90) :
					pref.redTheme ? RGB(145, 25, 25) : ''
				);
			}
			else {
				if (!pref.rebornTheme)	gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.row_selected);
			}
			gr.DrawRect(this.x, this.is_playing ? this.y - 1 : this.y, this.w, this.h, 1,
				pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.creamTheme ? g_pl_colors.row_focus_selected :
				pref.blueTheme ? RGB(10, 135, 230) :
				pref.darkblueTheme ? RGB(27, 55, 90) :
				pref.redTheme ? RGB(145, 25, 25) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(40, 40, 40) : ''
			);
			// Hide DrawRect gaps when all songs are completely selected and mask lines when selecting now playing
			gr.DrawRect(this.x, this.is_playing ? this.y - 1 : this.y, scaleForDisplay(7), this.h, 1,
				pref.whiteTheme || pref.blackTheme ? col.primary :
				pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
				pref.blueTheme ? RGB(242, 230, 170) :
				pref.darkblueTheme ? RGB(255, 202, 128) :
				pref.redTheme ? RGB(245, 212, 165) :
				pref.creamTheme ? RGB(120, 170, 130) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : ''
			);
			gr.FillSolidRect(this.x, this.y, scaleForDisplay(8), this.h,
				pref.whiteTheme || pref.blackTheme ? col.primary :
				pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
				pref.blueTheme ? RGB(242, 230, 170) :
				pref.darkblueTheme ? RGB(255, 202, 128) :
				pref.redTheme ? RGB(245, 212, 165) :
				pref.creamTheme ? RGB(120, 170, 130) :
				pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : ''
			);
		}

		if (this.is_playing) { // Might override 'selected' fonts
			this.title_color = g_pl_colors.title_playing;
			title_font = g_pl_fonts.title_playing;

			const bg_color = pref.rebornTheme ? this.is_selected() + (g_pl_colors.background != RGB(255, 255, 255) ? col.darkMiddleAccent : col.primary) : this.is_selected() + col.primary;
			gr.FillSolidRect(this.x, this.y, this.w, this.h, bg_color);
			if (colorDistance(bg_color, title_artist_color) < 195) {
				title_artist_color = this.title_color;
			}
			const brightBackground = (new Color(bg_color).brightness) > 151;
			const darkBackground = (new Color(bg_color).brightness) < 151;
			if (brightBackground && (pref.whiteTheme || pref.blackTheme)) {
				this.title_color = rgb(20, 20, 20);
				title_artist_color = rgb(0, 0, 0);
			}
			if (darkBackground && pref.whiteTheme && pref.layout_mode === 'default_mode') {
				this.title_color = rgb(240, 240, 240);
				title_artist_color = rgb(220, 220, 220);
			}

			if (pref.whiteTheme || pref.blackTheme) {
				gr.FillSolidRect(this.x, this.y, scaleForDisplay(2), this.h, col.primary);
			}
			else if (pref.rebornTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
				gr.FillSolidRect(this.x, this.y, this.w, this.h,
					pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : col.primary :
					pref.blueTheme ? RGB(242, 230, 170) :
					pref.darkblueTheme ? RGB(255, 202, 128) :
					pref.redTheme ? RGB(245, 212, 165) :
					pref.creamTheme ? RGB(120, 170, 130) :
					pref.nblueTheme ? RGB(0, 200, 255) :
					pref.ngreenTheme ? RGB(0, 200, 0) :
					pref.nredTheme ? RGB(229, 7, 44) :
					pref.ngoldTheme ? RGB(254, 204, 3) : ''
				);
				gr.FillSolidRect(this.x + scaleForDisplay(8), this.y, this.w - scaleForDisplay(8), this.h,
					pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.darkMiddleAccent : col.primary :
					pref.blueTheme ? RGB(10, 130, 220) :
					pref.darkblueTheme ? RGB(24, 50, 82) :
					pref.redTheme ? RGB(130, 25, 25) :
					pref.creamTheme ? RGB(120, 170, 130) :
					pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(25, 25, 25) : ''
				);
			}
		}

		//--->
		if (this.is_drop_top_selected) {
			gr.DrawLine(this.x, this.y + 1, this.x + this.w, this.y + 1, 2, this.is_drop_boundary_reached ? RGB(255, 165, 0) : RGB(140, 142, 144));
		}
		if (this.is_drop_bottom_selected) {
			gr.DrawLine(this.x, this.y + this.h - 1, this.x + this.w, this.y + this.h - 1, 2, this.is_drop_boundary_reached ? RGB(255, 165, 0) : RGB(140, 142, 144));
		}

		////////////////////////////////////////////////////////////

		var is_radio = _.startsWith(this.metadb.RawPath, 'http');

		var right_spacing = scaleForDisplay(20);
		var cur_x = this.x + right_spacing;
		var right_pad = scaleForDisplay(20);
		var testRect = false;
		var rating_color = RGB(255, 190, 0);

		if ($('$ifgreater(%totaldiscs%,1,true,false)', this.metadb) != 'false') {
			cur_x += scaleForDisplay(0);
		}

		//---> LENGTH
		{
			if (this.length_text == null) {
				this.length_text = $('[%length%]', this.metadb);
			}
			if (this.is_playing && pref.playlistTimeRemaining) {
				this.length_text = $('[-%playback_time_remaining%]');
			} else {
				this.length_text = $('[%length%]', this.metadb);
			}

			var length_w = is_4k ? 80 : 50;
			if (this.length_text) {
				var length_x = this.x + this.w - length_w - right_pad;

				gr.DrawString(this.length_text, title_font, this.title_color, length_x, this.y, length_w, this.h, g_string_format.h_align_far | g_string_format.v_align_center);
				testRect && gr.DrawRect(length_x, this.y - 1, length_w, this.h, 1, RGBA(155, 155, 255, 250));
			}
			// We always want that padding
			right_pad += Math.max(length_w, Math.ceil(gr.MeasureString(this.length_text, title_font, 0, 0, 0, 0).Width + 10));
		}

		//---> RATING
		if (g_properties.show_rating) {
			this.rating.x = this.x + this.w - this.rating.w - right_pad;
			this.rating.y = this.y;
			this.rating.draw(gr, rating_color);

			right_pad += this.rating.w + this.rating_right_pad + this.rating_left_pad;
		}

		//---> COUNT
		if (g_properties.show_playcount) {
			if (this.count_text == null) {
				if (is_radio) {
					this.count_text = '';
				}
				else {
					this.count_text = $('%play_count%', this.metadb);
					if (this.count_text != '0') {
						this.count_text = $('[$max(%play_count%, %lastfm_play_count%)]', this.metadb);
						this.count_text = !Number(this.count_text) ? '' : (this.count_text + ' |');
					} else {
						// don't want to show lastfm play count if track hasn't been played locally
						this.count_text = '';
					}
				}
			}

			if (this.count_text) {
				var count_w = Math.ceil(
					/** @type {!number} */
					gr.MeasureString(this.count_text, g_pl_fonts.playcount, 0, 0, 0, 0).Width
				);
				var count_x = this.x + this.w - count_w - right_pad;

				gr.DrawString(this.count_text, g_pl_fonts.playcount, this.title_color, count_x, this.y, count_w, this.h, g_string_format.align_center);
				testRect && gr.DrawRect(count_x, this.y - 1, count_w, this.h, 1, RGBA(155, 155, 255, 250));

				right_pad += count_w;
			}
		}

		//---> QUEUE
		let queueText = '';
		if (g_properties.show_queue_position && this.queue_indexes != null) {
			queueText = '  [' + this.queue_indexes + ']';
		}

		//---> TITLE init
		if (this.title_text == null) {
			var track_num_query = '$if2(%tracknumber%,$pad_right(' + (this.idx_in_header + 1) + ',2,0)).';
			if (pref.use_vinyl_nums) {
				track_num_query = tf.vinyl_track;
			}
			if (this.is_playing) {
				track_num_query = g_properties.show_header ? '      ' : '$if2(%tracknumber%,$pad_right(' + (this.idx_in_header + 1) + ',2,0)). ';
			}
			var title_query = g_properties.show_header ? track_num_query + (pref.show_artist_playlistRow && pref.show_album_playlistRow ? '  %artist% - %album% - ' + ' %title%[ \'(\'%original artist%\' cover)\']' : pref.show_artist_playlistRow ? '  %artist% - ' + ' %title%[ \'(\'%original artist%\' cover)\']' : pref.show_album_playlistRow ? '  %album% - ' + ' %title%[ \'(\'%original artist%\' cover)\']' : '  %title%[ \'(\'%original artist%\' cover)\']') : '     %artist% - %album% - ' + track_num_query + ' %title%[ \'(\'%original artist%\' cover)\']';
			this.title_text = (fb.IsPlaying && this.is_playing && is_radio) ? $(title_query) : $(title_query, this.metadb);
		}

		//---> TITLE ARTIST init
		if (this.title_artist_text == null) {
			var pattern = '^' + $('%album artist%', this.metadb).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ' ';
			var regex = new RegExp(pattern);
			this.title_artist_text = $('[$if($strcmp(' + tf.artist + ',%artist%),$if(%album artist%,$if(%track artist%,%track artist%,),),' + tf.artist + ')]', this.metadb);
			if (this.title_artist_text.length) {
				// if tf.artist evaluates to something different than %album artist% strip %artist% from the start of the string
				// i.e. tf.artist = "Metallica feat. Iron Maiden" then we want this.title_artist_text = "feat. Iron Maiden"
				this.title_artist_text = this.title_artist_text.replace(regex, '');
				this.title_artist_text = '  \u25AA  ' + this.title_artist_text;
			}
		}

		//---> TITLE draw
		{
			const title_w = this.w - right_pad - scaleForDisplay(44);
			const title_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
			gr.DrawString(this.title_text, title_font, this.title_color, cur_x, this.y, title_w, this.h, title_text_format);
			if (this.is_playing) {
				gr.DrawString(fb.IsPaused ? g_guifx.pause : g_guifx.play, ft.guifx, this.title_color, cur_x, this.y, title_w, this.h, title_text_format);
			}

			testRect && gr.DrawRect(this.x, this.y - 1, title_w, this.h, 1, RGBA(155, 155, 255, 250));

			cur_x += Math.ceil(
				/** @type {!number} */
				gr.MeasureString(this.title_text, title_font, 0, 0, title_w, this.h, title_text_format | g_string_format.measure_trailing_spaces).Width
			);
		}

		// Callback for tooltip
		this.title_w = this.w - right_pad - scaleForDisplay(44);
		this.title_text_w = gr.MeasureString(this.title_text, title_font, 0, 0, 0, 0).Width;

		//---> TITLE ARTIST draw
		if (this.title_artist_text) {
			const title_artist_x = cur_x;
			const title_artist_w = this.w - (title_artist_x - this.x) - right_pad;

			const title_artist_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
			//gr.DrawString(this.title_artist_text, title_artist_font, title_artist_color, title_artist_x, this.y, title_artist_w, this.h, title_artist_text_format);
			cur_x += Math.ceil(
				/** @type {!number} */
				gr.MeasureString(this.title_artist_text, title_artist_font, 0, 0, title_artist_w, this.h, title_artist_text_format).Width
			);
		}

		if (queueText) {
			const queueX = cur_x;
			const queueW = this.w - (queueX - this.x) - right_pad;
			const queueTextFormat = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;

			let queueColor = col.primary;
			if (this.is_playing || colorDistance(queueColor, g_pl_colors.row_alternate) < 165) {
				queueColor = title_color;
			}
			gr.DrawString(queueText, title_font, queueColor, queueX, this.y, queueW, this.h, queueTextFormat);
		}
		gr.SetSmoothingMode(SmoothingMode.HighQuality);

		// Refresh playlist time remaining all the time when activated
		if (pref.playlistTimeRemaining && this.is_playing && fb.IsPlaying) {
			let timer_timeRemaining;
			timer_timeRemaining = setTimeout(() => {
				window.RepaintRect(length_x + 5, this.y, length_w + 5, this.h);
			}, 1000);
		} else {
			clearTimeout(this.timer_timeRemaining);
		}

		this.title_color = g_pl_colors.title_normal;
	};

	/** @override */
	set_y(y) {
		ListItem.prototype.set_y.apply(this, [y]);
		this.rating.y = y;
	};

	/** @override */
	set_w(w) {
		ListItem.prototype.set_w.apply(this, [w]);
		this.initialize_rating();
	};

	reset_queried_data() {
		this.title_text = undefined;
		this.title_artist_text = undefined;
		this.count_text = undefined;
		this.length_text = undefined;

		this.rating.reset_queried_data();
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {boolean}
	 */
	rating_trace(x, y) {
		if (!g_properties.show_rating) {
			return false;
		}
		return this.rating.trace(x, y);
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	rating_click(x, y) {
		assert(g_properties.show_rating,
			LogicError, 'Rating_click was called, when there was no rating object.\nShould use trace before calling click');

		this.rating.click(x, y);
	}

	/**
	 * @return {boolean}
	 */
	is_selected() {
		return plman.IsPlaylistItemSelected(this.cur_playlist_idx, this.idx);
	}

	initialize_rating() {
		this.rating = new Rating(0, this.y, this.w - this.rating_right_pad, this.h, this.metadb);
		this.rating.x = this.x + this.w - (this.rating.w + this.rating_right_pad);
	}

	clear_title_text() {
		this.title_text = null;
	}

	// Playlist row truncated text tooltip
	title_truncatedText_tt() {
		if (pref.show_truncatedText_tt) {
			var is_radio = _.startsWith(this.metadb.RawPath, 'http');
			var track_num_query_tt = '$if2(%tracknumber%,$pad_right(' + (this.idx_in_header + 1) + ',2,0)).';
			if (pref.use_vinyl_nums) {
				track_num_query_tt = tf.vinyl_track;
			}
			var title_query_tt = g_properties.show_header ? track_num_query_tt + (pref.show_artist_playlistRow && pref.show_album_playlistRow ? '  %artist% - %album% - ' + ' %title%[ \'(\'%original artist%\' cover)\']' : pref.show_artist_playlistRow ? '  %artist% - ' + ' %title%[ \'(\'%original artist%\' cover)\']' : pref.show_album_playlistRow ? '  %album% - ' + ' %title%[ \'(\'%original artist%\' cover)\']' : '  %title%[ \'(\'%original artist%\' cover)\']') : '     %artist% - %album% - ' + track_num_query_tt + ' %title%[ \'(\'%original artist%\' cover)\']';
			this.title_text_tt = (fb.IsPlaying && this.is_playing && is_radio) ? $(title_query_tt) : $(title_query_tt, this.metadb);

			if (this.title_text_w > this.title_w) {
				tt.showDelayed(this.title_text_tt);
			}
		}
	}
}

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
	 * @param {GdiGraphics} gr
	 * @param {number} color
	 */
	this.draw = function (gr, color) {
		var cur_rating = this.get_rating();
		var cur_rating_x = this.x;
		var y = this.y - (is_4k ? 3 : 1);

		for (var j = 0; j < 5; j++) {
			if (j < cur_rating) {
				gr.DrawString('\u2605', g_pl_fonts.rating_set, rgb(0, 0, 0), cur_rating_x - 1, y - 1, btn_w + 2, this.h + 2, g_string_format.align_center);
				gr.DrawString('\u2605', g_pl_fonts.rating_set, color, cur_rating_x, y, btn_w, this.h, g_string_format.align_center);
			}
			else {
				//gr.DrawString('\u2219', g_pl_fonts.rating_not_set, color, cur_rating_x, y, btn_w, this.h, g_string_format.align_center);
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

		var new_rating = Math.floor((x - this.x) / btn_w) + 1;
		var current_rating = this.get_rating();

		if (g_properties.use_rating_from_tags) {
			if (!_.startsWith(this.metadb.RawPath, 'http')) {
				var handle = new FbMetadbHandleList();
				handle.Add(this.metadb);
				handle.UpdateFileInfoFromJSON(
					JSON.stringify({
						'RATING': (current_rating === new_rating) ? '' : new_rating
					})
				);
			}
		}
		else {
			fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + (current_rating === new_rating ? '<not set>' : new_rating), this.metadb);
		}

		rating = (current_rating === new_rating) ? 0 : new_rating;
	};

	/**
	 * @return {number}
	 */
	this.get_rating = () => {
		if (rating == null) {
			var current_rating;
			if (g_properties.use_rating_from_tags) {
				var file_info = this.metadb.GetFileInfo();
				var rating_meta_idx = file_info.MetaFind('RATING');
				current_rating = rating_meta_idx !== -1 ? file_info.MetaValue(rating_meta_idx, 0) : 0;
			}
			else {
				current_rating = $('%rating%', this.metadb);
			}
			rating = Number(current_rating);
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
	var btn_w = scaleForDisplay(pref.font_size_playlist + 2);

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
		rows.forEach((item, i) => {
			if (plman.IsPlaylistItemSelected(cur_playlist_idx, item.idx)) {
				selected_indexes.push(i);
			}
		});
	};

	/**
	 * @param {Row|BaseHeader} item
	 * @param {boolean=} [ctrl_pressed=false]
	 * @param {boolean=} [shift_pressed=false]
	 */
	this.update_selection = function (item, ctrl_pressed, shift_pressed) {
		assert(item != null,
			LogicError, 'update_selection was called with undefined item');

		if (!ctrl_pressed && !shift_pressed) {
			selected_indexes = [];
			last_single_selected_index = undefined;
		}

		var visible_item = cnt_helper.is_item_visible(item) ? item : cnt_helper.get_visible_parent(item);
		if (visible_item instanceof BaseHeader) {
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

		selected_indexes = _.range(rows[0].idx, _.last(rows).idx + 1);
		last_single_selected_index = rows[0].idx;

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

	this.get_selected_items = function () {
		return selected_indexes;
	}

	this.perform_internal_drag_n_drop = function () {
		this.enable_drag();
		is_internal_drag_n_drop_active = true;

		var cur_playlist_size = plman.PlaylistItemCount(cur_playlist_idx);
		var cur_playlist_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);
		var cur_selected_indexes = selected_indexes;

		var effect = fb.DoDragDrop(window.ID, cur_playlist_selection, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link);

		function arraysEqual(a, b) {
			if (a === b) return true;
			if (a == null || b == null || a.length !== b.length) return false;

			for (let i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		}

		function can_handle_move_drop() {
			// We can handle the 'move drop' properly only when playlist is still in the same state
			return cur_playlist_size === plman.PlaylistItemCount(cur_playlist_idx)
				&& arraysEqual(cur_selected_indexes, selected_indexes);
		}

		if (g_drop_effect.none === effect && can_handle_move_drop()) {
			// This needs special handling, because on NT, DROPEFFECT_NONE
			// is returned for some move operations, instead of DROPEFFECT_MOVE.
			// See Q182219 for the details.

			var items_to_remove = [];
			var playlist_items = plman.GetPlaylistItems(cur_playlist_idx);
			cur_selected_indexes.forEach((idx) => {
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

		is_internal_drag_n_drop_active = false;
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
		if (hover_row == null) {
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
			is_drop_top_selected = is_drop_top_selected && !hover_row.is_selected() && !is_item_above_selected;
			is_drop_bottom_selected = is_drop_bottom_selected && !hover_row.is_selected() && !is_item_below_selected;
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
	 * @param {DropTargetAction} action
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
		if (!fb.CheckClipboardContents()) {
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

		move_selection(Math.max(0, selected_indexes[0] - 1));
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

			// plman.ClearPlaylistSelection(cur_playlist_idx); // Disabled to enable contiguous Ctrl+shift selection
			plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
		}
		else if (ctrl_pressed) {
			const is_selected = selected_indexes.find((idx) => row.idx === idx);

			if (is_selected) {
				selected_indexes = selected_indexes.filter(idx => idx != row.idx);
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
			selected_indexes = _.union(get_shift_selection(row_indexes[0]), row_indexes);
		}
		else if (ctrl_pressed) {
			var is_selected = _.difference(row_indexes, selected_indexes).length === 0;
			if (is_selected) {
				_.pullAll(selected_indexes, row_indexes);
			}
			else {
				selected_indexes = _.union(selected_indexes, row_indexes);
			}
			last_single_selected_index = row_indexes[0];
		}
		else {
			selected_indexes = row_indexes;
			last_single_selected_index = row_indexes[0];
		}

		plman.ClearPlaylistSelection(cur_playlist_idx);
		plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
		if (row_indexes.length) {
			plman.SetPlaylistFocusItem(cur_playlist_idx, row_indexes[0]);
		}
	}

	/**
	 * @param {number} selected_idx
	 */
	function get_shift_selection(selected_idx) {
		var a = 0,
			b = 0;

		if (last_single_selected_index == null) {
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
				a = last_selected_header.get_row_indexes()[0];
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
				move_delta = -(selected_indexes[0] - new_idx);
			}
			else {
				move_delta = new_idx - (_.last(selected_indexes) + 1);
			}

			plman.MovePlaylistSelection(cur_playlist_idx, move_delta);
		}
		else {
			var item_count_before_drop_idx = selected_indexes.filter(idx => idx < new_idx).length;

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
		return selected_indexes.every((item, i) => {
			if (i !== 0 && (selected_indexes[i] - selected_indexes[i - 1]) !== 1) {
				return false;
			}
			return true;
		});
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
	// @ts-ignore
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
	this.on_content_change = () => {
		headers = cnt.sub_items;
		this.changed = false;

		if (g_properties.collapse_on_playlist_switch) {
			if (g_properties.auto_collapse) {
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
		headers.forEach((item) => {
			this.changed = set_collapsed_state_recursive(item, true) || this.changed;
		});

		trigger_callback();
	};

	this.collapse_all_but_now_playing = function () {
		this.changed = false;
		headers.forEach((item) => {
			if (item.is_playing()) {
				this.changed = set_collapsed_state_recursive(item, false) || this.changed;
				return;
			}
			this.changed = set_collapsed_state_recursive(item, true) || this.changed;
		});

		trigger_callback();
	};

	this.expand_all = function () {
		this.changed = false;
		headers.forEach((item) => {
			this.changed = set_collapsed_state_recursive(item, false) || this.changed;
		});

		trigger_callback();
	};

	/**
	 * @param {function} on_collapse_change_callback_arg
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
		if (sub_items[0] instanceof Row) {
			return changed;
		}

		sub_items.forEach(item => {
			changed = set_collapsed_state_recursive(item, is_collapsed) || changed;
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

	/** @type {Array<BaseHeader|Header>} */
	var headers = cnt_arg.sub_items;
	/** @type {?function} */
	var on_collapse_change_callback = undefined;
}

class QueueHandler {
	/**
	 * @param {Array<Row>} rows_arg
	 * @param {number} cur_playlist_idx_arg
	 * @constructor
	 */
	constructor(rows_arg, cur_playlist_idx_arg) {
		/**
		 * @const
		 * @type {number}
		 */
		this.cur_playlist_idx = cur_playlist_idx_arg;
		/**
		 * @const
		 * @type {Array<Row>}
		 */
		this.rows = rows_arg;

		/** @type {Array<Row>} */
		this.queued_rows = [];

		this.initialize_queue();
	}

	initialize_queue() {
		if (this.queued_rows.length) {
			this.reset_queued_status();
		}

		var queue_contents = plman.GetPlaybackQueueContents();
		if (!queue_contents.length) {
			return;
		}

		queue_contents.forEach((queued_item, i) => {
			if (queued_item.PlaylistIndex !== this.cur_playlist_idx || queued_item.PlaylistItemIndex === -1) {
				return;
			}

			var cur_queued_row = this.rows[queued_item.PlaylistItemIndex];
			if (cur_queued_row) {
				// It is possible that cur_queued_row can be undefined for some reason, even though the row is in the playlist. Possibly this.rows.length < queued_item.PlaylistItemIndex?
				var has_row = this.queued_rows.find(queued_row => {
					return queued_row.idx === cur_queued_row.idx;
				});
			} else {
				console.log('>>> Error! - queued_item.PlaylistIndex:', queued_item.PlaylistIndex,
					'queued_item.PlaylistItemIndex:', queued_item.PlaylistItemIndex, 'this.cur_playlist_idx:', this.cur_playlist_idx, 'this.rows.length:', this.rows.length);
				return;
			}

			if (!has_row) {
				cur_queued_row.queue_indexes = [i + 1];
				cur_queued_row.queue_idx_count = 1;
			}
			else {
				cur_queued_row.queue_indexes.push(i + 1);
				cur_queued_row.queue_idx_count++;
			}

			this.queued_rows.push(cur_queued_row);
		});
	};

	/**
	 * @param {Row} row
	 */
	add_row(row) {
		if (!row) {
			return;
		}

		plman.AddPlaylistItemToPlaybackQueue(this.cur_playlist_idx, row.idx);
	};

	/**
	 * @param {Row} row
	 */
	remove_row(row) {
		if (!row) {
			return;
		}

		var idx = plman.FindPlaybackQueueItemIndex(row.metadb, this.cur_playlist_idx, row.idx);
		if (idx !== -1) {
			plman.RemoveItemFromPlaybackQueue(idx);
		}
	};

	flush() {
		plman.FlushPlaybackQueue();
	};


	has_items() {
		return !!plman.GetPlaybackQueueHandles().Count;
	};

	reset_queued_status() {
		if (!this.queued_rows.length) {
			return;
		}

		this.queued_rows.forEach(function (item) {
			item.queue_indexes = undefined;
			item.queue_idx_count = 0;
		});

		this.queued_rows = [];
	}
}

/**
 * @constructor
 */
function PlaylistManager(x, y, w, h) {
	//<editor-fold desc="Callback Implementation">
	this.on_paint = function (gr) {
		if (!info_text || cur_playlist_idx !== plman.ActivePlaylist) {
			cur_playlist_idx = plman.ActivePlaylist;
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
			change_state(state.hovered);
			if (!was_pressed) {
				return;
			}
		}

		var cpm = window.CreatePopupMenu();
		var autopl = window.CreatePopupMenu();

		var playlist_count = plman.PlaylistCount;

		cpm.AppendMenuItem(MF_STRING, 1, 'Playlist manager \tCtrl+M');
		cpm.AppendMenuItem(MF_STRING, 2, 'Playlist search \tCtrl+F');
		cpm.AppendMenuItem(MF_STRING, 3, 'Create new playlist \tCtrl+N');
		autopl.AppendTo(cpm, MF_STRING, "Create new auto playlist");
		autopl.AppendMenuItem(MF_STRING, 4, "Custom auto playlist");
		autopl.AppendMenuSeparator();
		autopl.AppendMenuItem(MF_STRING, 5, "Tracks from the library");
		autopl.AppendMenuSeparator();
		autopl.AppendMenuItem(MF_STRING, 6, "Tracks most played");
		autopl.AppendMenuItem(MF_STRING, 7, "Tracks never played");
		autopl.AppendMenuItem(MF_STRING, 8, "Tracks played in the last week");
		autopl.AppendMenuItem(MF_STRING, 9, "Tracks played in the last month");
		autopl.AppendMenuItem(MF_STRING, 10, "Tracks played in the last year");
		autopl.AppendMenuSeparator();
		autopl.AppendMenuItem(MF_STRING, 11, "Tracks unrated");
		autopl.AppendMenuItem(MF_STRING, 12, "Tracks rated 1 star");
		autopl.AppendMenuItem(MF_STRING, 13, "Tracks rated 2 stars");
		autopl.AppendMenuItem(MF_STRING, 14, "Tracks rated 3 stars");
		autopl.AppendMenuItem(MF_STRING, 15, "Tracks rated 4 stars");
		autopl.AppendMenuItem(MF_STRING, 16, "Tracks rated 5 stars");
		autopl.AppendMenuSeparator();
		autopl.AppendMenuItem(MF_STRING, 17, "Loved tracks");
		if (g_component_utils) {
			cpm.AppendMenuSeparator();
			cpm.AppendMenuItem(MF_STRING, 18, 'Lock current playlist');
			cpm.CheckMenuItem(18, plman.IsPlaylistLocked(plman.ActivePlaylist));
		}
		cpm.AppendMenuSeparator();
		var playlists_start_id = 19;
		for (var i = 0; i < playlist_count; ++i) {
			cpm.AppendMenuItem(MF_STRING, playlists_start_id + i, plman.GetPlaylistName(i).replace(/&/g, '&&') + ' [' + plman.PlaylistItemCount(i) + ']' /*+ (plman.IsAutoPlaylist(i) ? ' (Auto)' : '')*/ + (i === plman.PlayingPlaylist ? ' \t(Now Playing)' : ''));
		}

		var id = cpm.TrackPopupMenu(x, y);
		switch (id) {
			case 1:
				fb.RunMainMenuCommand('View/Playlist Manager');
				break;
			case 2:
				fb.RunMainMenuCommand("View/Playlist search");
				break;
			case 3:
				plman.CreatePlaylist(playlist_count, '');
				plman.ActivePlaylist = plman.PlaylistCount - 1;
				break;
			case 4:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) New custom auto playlist", "", "", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				plman.ShowAutoPlaylistUI(playlist_idx);
				break;
			case 5:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks from the library", "ALL", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 6:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks most played", "%play_count% GREATER 9", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 7:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks never played", "%play_count% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 8:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last week", "%last_played% DURING LAST 1 WEEK", "%last_played%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 9:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last month", "%last_played% DURING LAST 4 WEEKS", "%last_played%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 10:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last year", "%last_played% DURING LAST 52 WEEKS", "%last_played%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 11:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks unrated", "%rating% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 12:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 1", "%rating% IS 1", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 13:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 2", "%rating% IS 2", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 14:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 3", "%rating% IS 3", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 15:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 4", "%rating% IS 4", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 16:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 5", "%rating% IS 5", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 17:
				plman.CreateAutoPlaylist(playlist_count, "(Auto) Loved tracks", "%mood% GREATER 0", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.MovePlaylist(playlist_count, playlist_idx);
				plman.ActivePlaylist = playlist_idx;
				break;
			case 18:
				fb.RunMainMenuCommand('Edit/Read-only');
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
			change_state(state.hovered);
			if (!was_pressed) {
				return true;
			}
		}

		var cmm = new ContextMainMenu();

		// PlaylistManager.append_playlist_info_visibility_context_menu_to(cmm); // Don't need this context menu, have own options to hide PLM

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		menu_down = true;
		cmm.execute(x, y);
		menu_down = false;

		return true;
	};

	this.on_mouse_leave = function () {
		change_state(state.normal);
	};

	//</editor-fold>

	this.reinitialize = function () {
		info_text = undefined;
		this.panel_state = state.normal;
		this.hover_alpha = 0;
	};

	this.set_w = function (w) {
		this.w = w;
	};

	this.set_xywh = function (x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = scaleForDisplay(g_properties.row_h + 4)
	}

	this.trace = function (x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};

	/**
	 * @param {KeyActionHandler} key_handler
	 */
	this.register_key_actions = function (key_handler) {
		key_handler.register_key_action(VK_KEY_N,
			(modifiers) => {
				if (modifiers.ctrl) {
					plman.CreatePlaylist(plman.PlaylistCount, '');
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				}
			});

		key_handler.register_key_action(VK_KEY_M,
			(modifiers) => {
				if (modifiers.ctrl) {
					fb.RunMainMenuCommand('View/Playlist Manager');
				}
			});
	};

	var throttled_repaint = _.throttle(() => {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}, 1000 / 60);
	this.repaint = () => {
		throttled_repaint();
	};

	/**
	 * @param {GdiGraphics} gr
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

		gr.FillSolidRect(x, y, w, h, bg_color); // Playlist Manager Hide Top Rows that shouldn't be visible
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		var p = 10;
		var right_pad = p;

		if (plman.ActivePlaylist !== -1 && plman.IsPlaylistLocked(plman.ActivePlaylist)) {
			// Position above scrollbar for eye candy
			// var sbar_x = x + w - playlist_geo.scrollbar_w - playlist_geo.scrollbar_right_pad;
			var lock_x = ww - scaleForDisplay(29);
			var lock_text = '\uf023';
			var lock_w = Math.ceil(
				/** @type {!number} */
				gr.MeasureString(lock_text, g_pl_fonts.font_awesome, 0, 0, 0, 0).Width
			);
			gr.DrawString(lock_text, g_pl_fonts.font_awesome, text_color, lock_x, y, lock_w, h, g_string_format.align_center);

			//right_pad += lock_w;  // deactivated -> PLM text should be always centered
		}

		var info_x = x + p;
		var info_y = y;
		var info_w = w - (info_x - x) - right_pad;
		var info_h = h;

		var info_text_format = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
		gr.DrawString(info_text, g_pl_fonts.title_selected, text_color, info_x, info_y, info_w, info_h, info_text_format);
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

	var cur_playlist_idx = undefined;
}

/**
 * @param {ContextMenu} parent_menu
 */
PlaylistManager.append_playlist_info_visibility_context_menu_to = function (parent_menu) {
	parent_menu.append_item(
		'Show playlist manager',
		() => {
			g_properties.show_playlist_info = !g_properties.show_playlist_info;
		},
		{is_checked: g_properties.show_playlist_info}
	);
};

/**
 * @constructor
 */
function GroupingHandler() {
	this.on_playlists_changed = () => {
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
			else if (group_by_name.includes(group_name)) {
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

		assert(cur_group != null,
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
	 * @param {ContextMenu} parent_menu
	 * @param {function} on_execute_callback_fn
	 */
	this.append_menu_to = function (parent_menu, on_execute_callback_fn) {
		var group = new ContextMenu('Grouping');
		parent_menu.append(group);

		group.append_item(
			'Manage presets',
			() => {
				manage_groupings(on_execute_callback_fn);
			}
		);

		group.append_separator();

		group.append_item(
			'Reset to default',
			() => {
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
		// group.append_item(
		// 	group_by_text,
		// 	() => {
		// 		request_user_query(on_execute_callback_fn);
		// 	},
		// 	{is_radio_checked: cur_group.name === 'user_defined'}
		// );

		settings.group_presets.forEach(function (group_item) {
			var group_by_text = group_item.description;
			if (group_item.name === settings.default_group_name) {
				group_by_text += ' [default]';
			}

			group.append_item(
				group_by_text,
				() => {
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
	 * @param {function} on_execute_callback_fn
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

		var parsed_query = cur_group.name === 'user_defined'
			? [cur_group.group_query, cur_group.title_query]
			: ['', '[%album artist%]'];

		var htmlCode = qwr_utils.prepare_html_file(`${fb.ProfilePath}${g_theme.script_folder}js\\CaTRoX_QWR\\html\\MsgBox.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: ['Foobar2000: Group by', ['Grouping Query', 'Title Query'], parsed_query, on_ok_fn] });
	}

	/**
	 * @param {function} on_execute_callback_fn
	 */
	function manage_groupings(on_execute_callback_fn) {
		var on_ok_fn = function (ret_val_json) {
			const ret_val = JSON.parse(ret_val_json);

			settings.group_presets = ret_val[0];
			settings.default_group_name = ret_val[2];
			initalize_name_to_preset_map();

			cur_group = settings.group_presets[group_by_name.indexOf(ret_val[1])];
			settings.playlist_group_data[cur_playlist_name] = ret_val[1];

			delete settings.playlist_custom_group_data[cur_playlist_name];

			settings.save();
			settings.send_sync();

			on_execute_callback_fn();
		};

		var htmlCode = qwr_utils.prepare_html_file(`${fb.ProfilePath}${g_theme.script_folder}js\\CaTRoX_QWR\\html\\GroupPresetsMngr.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: [JSON.stringify([settings.group_presets, cur_group.name, settings.default_group_name]), on_ok_fn] });
	}

	function initialize_playlists() {
		playlists = [];
		var playlist_count = plman.PlaylistCount;
		for (var i = 0; i < playlist_count; ++i) {
			playlists.push(plman.GetPlaylistName(i));
		}
	}

	function cleanup_settings() {
		for (let i in settings.playlist_group_data) {
			console.log(i);
			if (!playlists.includes(i)) {
				delete settings.playlist_group_data[i];
			}
		}

		for (let i in settings.playlist_custom_group_data) {
			if (!playlists.includes(i)) {
				delete settings.playlist_custom_group_data[i];
			}
		}

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
				new CtorGroupData('artist_album_disc_edition', 'by artist / album / disc number / edition / codec', '%album artist%%album%%discnumber%%edition%%codec%', undefined, undefined, {
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
			g_properties.default_group_name = 'artist_album_disc_edition';
		}
	}

	/** @typedef {GroupingHandler.Settings.Group} */
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
 * @param {?string=} [sub_title_query="[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']"]
 * @param {object}  [options={}]
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
	this.group_query = group_query ? group_query : '';
	/** @type {string} */
	this.title_query = title_query ? title_query : '[%album artist%]';
	/** @type {string} */
	this.sub_title_query = sub_title_query ? sub_title_query : '[%album%[ \'(\'%albumsubtitle%\')\']][ - \'[\'%edition%\']\']';
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

/** @type {PlaylistPanel} */
let playlist;
function initPlaylist() {
	playlist = new PlaylistPanel(pref.layout_mode === 'default_mode' ? ww / 2 : 0, 0);
	playlist.initialize();
}

// Call reinitialize(); only when needed
var needs_reinit = false;
function reinitPlaylist() {
	needs_reinit = true;
}

// Repaint playlist rows when using playlist row hover
var needs_rows_repaint = true;
function repaintPlaylistRows() {
	window.Repaint();
	needs_rows_repaint = true;
}
