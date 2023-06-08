/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Playlist                             * //
// * Author:         TT                                                  * //
// * Org. Author:    extremeHunter, TheQwertiest                         * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-07                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {PlaylistPanel} */
let playlist;
let playlistDropIndex;
let playlistScrollReady = true;
let playlistFontsCreated = false;
let playlistThumbSize = scaleForDisplay(64); // Default
let g_pl_fonts = {};
const playlist_geo = {};
const g_pl_colors = {};
const mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
const key_down_suppress = new qwr_utils.KeyModifiersSuppress();

/** @enum{number} */
const g_drop_effect = {
	none:   0,
	copy:   1,
	move:   2,
	link:   4,
	scroll: 0x80000000
};

/**
 * @enum {number}
 */
const visibility_state = {
	none:           0,
	partial_top:    1,
	partial_bottom: 2,
	full:           3
};


////////////////////
// * PROPERTIES * //
////////////////////
g_properties.add_properties(
	{
		rows_in_header:              ['Panel Playlist - User: Header.normal.row_count', 4],
		rows_in_compact_header:      ['Panel Playlist - User: Header.compact.row_count', 3],

		show_playlist_info:          ['Panel Playlist - User: Playlist_info.show', true],

		show_header:                 ['Panel Playlist - User: Header.show', true],
		use_compact_header:          ['Panel Playlist - User: Header.use_compact', false],
		show_album_art:              ['Panel Playlist - User: Header.this.art.show', true],
		auto_album_art:              ['Panel Playlist - User: Header.this.art.auto', false],
		show_group_info:             ['Panel Playlist - User: Header.info.show', true],
		show_disc_header:            ['Panel Playlist - User: Header.disc_header.show', true],

		show_row_stripes:            ['Panel Playlist - User: Row.stripes.show', false],
		show_playcount:              ['Panel Playlist - User: Row.play_count.show', true],
		show_rating:                 ['Panel Playlist - User: Row.rating.show', true],
		use_rating_from_tags:        ['Panel Playlist - User: Row.rating.from_tags', false],
		show_queue_position:         ['Panel Playlist - User: Row.queue_position.show', true],

		auto_collapse:               ['Panel Playlist - User: Header.collapse.auto', false],
		collapse_on_playlist_switch: ['Panel Playlist - User: Header.collapse.on_playlist_switch', false],
		collapse_on_start:           ['Panel Playlist - User: Header.collapse.on_start', false],

		// Default values for grouping data are set in it's class ctor
		playlist_group_data:         ['Panel Playlist - System: Playlist.grouping.data_list', ''],
		playlist_custom_group_data:  ['Panel Playlist - System: Playlist.grouping.custom_data_list', ''],
		default_group_name:          ['Panel Playlist - System: Playlist.grouping.default_preset_name', ''],
		group_presets:               ['Panel Playlist - System: Playlist.grouping.presets', '']
	}
);

// * Fixup properties
// Grouping data is validated in it's class ctor
g_properties.rows_in_header = Math.max(0, g_properties.rows_in_header);
g_properties.rows_in_compact_header = Math.max(0, g_properties.rows_in_compact_header);
// * Fix playlist panel state at startup
if (pref.libraryLayoutSplitPreset || pref.libraryLayoutSplitPreset3 || pref.libraryLayoutSplitPreset4) {
	g_properties.auto_collapse = pref.showPanelOnStartup === 'library';
} else if (pref.libraryLayoutSplitPreset2) {
	g_properties.show_header = pref.showPanelOnStartup === 'playlist';
}


///////////////
// * FONTS * //
///////////////
const headerFontSize = pref.layout === 'compact' ? pref.playlistHeaderFontSize_compact : pref.layout === 'artwork' ? pref.playlistHeaderFontSize_artwork : pref.playlistHeaderFontSize_default;
const rowFontSize    = pref.layout === 'compact' ? pref.playlistFontSize_compact       : pref.layout === 'artwork' ? pref.playlistFontSize_artwork       : pref.playlistFontSize_default;

const titleNormalFont   = pref.customThemeFonts ? customFont.playlistTitleNormal   : 'Segoe UI';
const titleSelectedFont = pref.customThemeFonts ? customFont.playlistTitleSelected : 'Segoe UI';
const titlePlayingFont  = pref.customThemeFonts ? customFont.playlistTitlePlaying  : 'Segoe UI';

const artistNormalFont         = pref.customThemeFonts ? customFont.playlistArtistNormal         : 'Segoe UI Semibold';
const artistPlayingFont        = pref.customThemeFonts ? customFont.playlistArtistPlaying        : 'Segoe UI Semibold';
const artistNormalCompactFont  = pref.customThemeFonts ? customFont.playlistArtistNormalCompact  : 'Segoe UI Semibold';
const artistPlayingCompactFont = pref.customThemeFonts ? customFont.playlistArtistPlayingCompact : 'Segoe UI Semibold';

const albumFont       = pref.customThemeFonts ? customFont.playlistAlbum       : 'Segoe UI Semibold';
const dateFont        = pref.customThemeFonts ? customFont.playlistDate        : 'Segoe UI Semibold';
const dateCompactFont = pref.customThemeFonts ? customFont.playlistDateCompact : 'Segoe UI Semibold';
const infoFont        = pref.customThemeFonts ? customFont.playlistInfo        : 'Segoe UI';
const coverFont       = pref.customThemeFonts ? customFont.playlistCover       : 'Segoe UI Semibold';

const playcountFont = pref.customThemeFonts ? customFont.playlistPlaycount : 'Segoe UI';


function createPlaylistFonts() {
	const headerFontSize = pref.layout === 'compact' ? pref.playlistHeaderFontSize_compact : pref.layout === 'artwork' ? pref.playlistHeaderFontSize_artwork : pref.playlistHeaderFontSize_default;
	const rowFontSize    = pref.layout === 'compact' ? pref.playlistFontSize_compact       : pref.layout === 'artwork' ? pref.playlistFontSize_artwork       : pref.playlistFontSize_default;

	function font(name, size, style) {
		return gdi.Font(name, is_4k ? size * 2 : size, style);
	}
	g_pl_fonts = {
		title_normal:   font(titleNormalFont, rowFontSize),
		title_selected: font(titleSelectedFont, rowFontSize),
		title_playing:  font(titlePlayingFont, rowFontSize),

		artist_normal:          font(artistNormalFont, headerFontSize + 3, pref.customThemeFonts ? g_font_style.bold : 0),
		artist_playing:         font(artistPlayingFont, headerFontSize + 3, pref.customThemeFonts ? g_font_style.bold : 0),
		artist_normal_compact:  font(artistNormalCompactFont, headerFontSize),
		artist_playing_compact: font(artistPlayingCompactFont, headerFontSize, g_font_style.underline),

		album:          font(albumFont, headerFontSize),
		date:           font(dateFont, headerFontSize + 3),
		date_compact:   font(dateCompactFont, headerFontSize),
		info:           font(infoFont, rowFontSize - 1),
		cover:          font(coverFont, rowFontSize - 1),

		playcount:      font(playcountFont, rowFontSize - 3),
		rating_not_set: font('Segoe UI Symbol', rowFontSize + 2),
		rating_set:     font('Segoe UI Symbol', rowFontSize + 4),
		scrollbar:      font('Segoe UI Symbol', headerFontSize),

		font_awesome:   font('FontAwesome', rowFontSize + 2),

		dummy_text:     font(fontDefault, rowFontSize + 1)
	};
	playlistFontsCreated = true;
}


//////////////////
// * GEOMETRY * //
//////////////////
/**
 * @param {boolean=} forceRescale
 * @returns
 */
function rescalePlaylist(forceRescale) {
	if (playlistFontsCreated && !forceRescale) {
		return; // Don't redo fonts
	}
	createPlaylistFonts();
	g_properties.row_h = Math.round(pref.layout === 'compact' ? pref.playlistFontSize_compact * 1.667 : pref.layout === 'artwork' ? pref.playlistFontSize_artwork * 1.667 : pref.playlistFontSize_default * 1.667);
	playlist_geo.row_h = scaleForDisplay(g_properties.row_h);
	playlist_geo.scrollbar_w = g_properties.scrollbar_w;    // Don't scaleForDisplay
	playlist_geo.scrollbar_right_pad = scaleForDisplay(g_properties.scrollbar_right_pad);
	playlist_geo.scrollbar_top_pad = scaleForDisplay(g_properties.scrollbar_top_pad);
	playlist_geo.scrollbar_bottom_pad = scaleForDisplay(g_properties.scrollbar_bottom_pad);
	playlist_geo.list_bottom_pad = scaleForDisplay(g_properties.list_bottom_pad);
}


///////////////////////////////
// * DRAG N DROP CALLBACKS * //
///////////////////////////////
function on_drag_enter(action, x, y, mask) {
	trace_call && console.log('Playlist => on_drag_enter');
	playlist.on_drag_enter(action, x, y, mask);
}


function on_drag_over(action, x, y, mask) {
	trace_call && console.log('Playlist => on_drag_over');
	playlist.on_drag_over(action, x, y, mask);
}


function on_drag_leave() {
	trace_call && console.log('Playlist => on_drag_leave');
	playlist.on_drag_leave();
}


function on_drag_drop(action, x, y, mask) {
	trace_call && console.log('Playlist => on_drag_drop');
	playlist.on_drag_drop(action, x, y, mask);
}


////////////////////
// * MAIN PANEL * //
////////////////////
/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function PlaylistPanel(x, y) {
	this.x = x;
	this.y = y;
	this.w = 0;
	this.h = 0;

	const that = this;

	/**
	 * @const
	 * @type {number}
	 */
	let playlist_info_h = scaleForDisplay(g_properties.row_h);

	/**
	 * @const
	 * @type {number}
	 */
	const playlist_info_and_gap_h = playlist_info_h + scaleForDisplay(4);

	let is_activated = window.IsVisible;

	const key_handler = new KeyActionHandler();

	// Panel parts
	const playlist_info = new PlaylistManager(that.x, that.y, 0, playlist_info_h);
	const playlist = new Playlist(that.x, that.y + (g_properties.show_playlist_info ? playlist_info_and_gap_h : 0));

	/**
	 * @param {boolean} show_playlist_info
	 */
	function toggle_playlist_info(show_playlist_info) {
		playlist.y = that.y + (show_playlist_info ? (playlist_info_and_gap_h) : 0);
		const new_playlist_h = show_playlist_info ? (playlist.h - playlist_info_and_gap_h) : (playlist.h + playlist_info_and_gap_h);
		playlist.on_size(playlist.w, new_playlist_h, playlist.x, playlist.y);
		// Easier to repaint everything
		window.Repaint();
	}

	// #region Callback Implementation
	this.on_paint = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.bg); // Main bg
		if (!is_activated) {
			is_activated = true;

			if (g_properties.show_playlist_info) {
				playlist_info.reinitialize();
			}
			playlist.reinitialize();
		}

		if (pref.styleBlend && albumArt && blendedImg && (displayPlaylist || displayPlaylistArtworkLayout)) {
			gr.DrawImage(blendedImg, displayPlaylistLibrary() ? ww * 0.5 : 0, 0, ww, wh, displayPlaylistLibrary() ? ww * 0.5 : 0, 0, blendedImg.Width, blendedImg.Height);
		}

		playlist.on_paint(gr);

		// * Hide rows that shouldn't be visible
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(this.x, 0, this.w, geo.topMenuHeight, col.bg); // Hide alpha overlapping at the top
		gr.FillSolidRect(this.x, geo.topMenuHeight, this.w, playlist_info_h, g_pl_colors.bg); // Hide alpha overlapping at the top
		gr.FillSolidRect(this.x, this.y + this.h - playlist_geo.row_h, this.w, playlist_geo.row_h + geo.lowerBarHeight, g_pl_colors.bg); // Hide alpha overlapping at the bottom
		gr.FillSolidRect(this.x, this.y + this.h, this.w, geo.lowerBarHeight, col.bg); // Hide alpha overlapping at the bottom

		if (UIHacks.Aero.Effect === 2) gr.DrawLine(this.x, 0, ww, 0, 1, col.bg); // UIHacks aero glass shadow frame fix - needed for style Blend

		if (pref.styleBlend && albumArt && blendedImg) {
			gr.DrawImage(blendedImg, this.x, this.y - this.h - geo.topMenuHeight - geo.lowerBarHeight + playlist_info_h, ww, wh, this.x, this.y - this.h - geo.topMenuHeight - geo.lowerBarHeight + playlist_info_h, blendedImg.Width, blendedImg.Height);
			gr.DrawImage(blendedImg, this.x, this.y + this.h - playlist_geo.row_h, ww, wh, this.x, this.y + this.h - playlist_geo.row_h, blendedImg.Width, blendedImg.Height);
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_paint(gr);
		}
	};

	// * PlaylistPanel.on_size
	this.on_size = function (w, h) {
		rescalePlaylist();
		const x = pref.layout === 'default' && (pref.playlistLayout === 'normal' || pref.playlistLayoutNormal && (displayBiography || pref.displayLyrics)) ? ww * 0.5 : 0;
		const y = geo.topMenuHeight;
		const playlist_w = w - x;
		const playlist_h = Math.max(0, h - geo.lowerBarHeight - y);
		const showPlaylistManager = pref.layout === 'compact' ? pref.showPlaylistManager_compact : pref.layout === 'artwork' ? pref.showPlaylistManager_artwork : pref.showPlaylistManager_default;

		this.h = playlist_h;
		this.w = playlist_w;
		this.x = x;
		this.y = y;

		playlist_info_h = scaleForDisplay(g_properties.row_h);
		playlist.on_size(playlist_w, playlist_h - (playlist_info_h * 2), x, y + playlist_info_h + scaleForDisplay(4));
		playlist_info.set_xywh(x, y, showPlaylistManager ? this.w : 0); // Hide Playlist manager

		is_activated = window.IsVisible;
	};

	this.on_mouse_move = (x, y, m) => {
		playlist.on_mouse_move(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_move(x, y, m);
		}
	};

	this.on_mouse_lbtn_down = (x, y, m) => {
		playlist.on_mouse_lbtn_down(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_lbtn_down(x, y, m);
		}
	};

	this.on_mouse_lbtn_dblclk = (x, y, m) => {
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	};

	this.on_mouse_lbtn_up = (x, y, m) => {
		playlist.on_mouse_lbtn_up(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_lbtn_up(x, y, m);
		}
	};

	this.on_mouse_rbtn_down = (x, y, m) => {
		playlist.on_mouse_rbtn_down(x, y, m);

		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_rbtn_down(x, y, m);
		}
	};

	this.on_mouse_rbtn_up = (x, y, m) => {
		const was_playlist_info_displayed = g_properties.show_playlist_info;

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

	this.on_mouse_wheel = (delta) => {
		playlist.on_mouse_wheel(delta);
	};

	this.on_mouse_leave = () => {
		playlist.on_mouse_leave();
		if (g_properties.show_playlist_info) {
			playlist_info.on_mouse_leave();
		}
	};

	this.on_drag_enter = (action, x, y, mask) => {
		playlist.on_drag_enter(action, x, y, mask);
	};

	this.on_drag_leave = () => {
		playlist.on_drag_leave();
	};

	this.on_drag_over = (action, x, y, mask) => {
		playlist.on_drag_over(action, x, y, mask);
	};

	this.on_drag_drop = (action, x, y, m) => {
		playlist.on_drag_drop(action, x, y, m);
	};

	this.on_key_down = (vkey) => {
		playlist.on_key_down(vkey);

		const modifiers = {
			ctrl:  utils.IsKeyPressed(VK_CONTROL),
			alt:   utils.IsKeyPressed(VK_MENU),
			shift: utils.IsKeyPressed(VK_SHIFT)
		};
		key_handler.invoke_key_action(vkey, modifiers);
	};

	this.on_key_up = (vkey) => {
		playlist.on_key_up(vkey);
	};

	this.on_item_focus_change = (playlist_idx, from_idx, to_idx) => {
		if (!is_activated) {
			return;
		}

		playlist.on_item_focus_change(playlist_idx, from_idx, to_idx);
	};

	this.scroll_to_focused = () => {
		playlist.scroll_to_focused();
	};

	this.on_playlists_changed = () => {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlists_changed();
	};

	this.on_playlist_switch = () => {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_switch();
	};

	this.on_playlist_item_ensure_visible = (playlistIndex, playlistItemIndex) => {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	};

	this.on_playlist_items_added = (playlist_idx) => {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_items_added(playlist_idx);
	};

	this.on_playlist_items_reordered = (playlist_idx) => {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_reordered(playlist_idx);
	};

	this.on_playlist_items_removed = (playlist_idx) => {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_playlist_items_removed(playlist_idx);
	};

	this.on_playlist_items_selection_change = () => {
		if (!is_activated) {
			return;
		}

		playlist.on_playlist_items_selection_change();
		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
	};

	this.on_playback_dynamic_info_track = () => {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_dynamic_info_track();
	};

	this.on_playback_new_track = (metadb) => {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_new_track(metadb);
	};

	this.on_playback_pause = (state) => {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_pause(state);
	};

	this.on_playback_queue_changed = (origin) => {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_queue_changed(origin);
	};

	this.on_playback_stop = (reason) => {
		if (!is_activated) {
			return;
		}

		playlist.on_playback_stop(reason);
	};

	this.on_focus = (is_focused) => {
		if (!is_activated) {
			return;
		}

		playlist.on_focus(is_focused);
	};

	this.on_metadb_changed = (handles, fromhook) => {
		if (!is_activated) {
			return;
		}

		if (g_properties.show_playlist_info) {
			playlist_info.on_playlist_modified();
		}
		playlist.on_metadb_changed(handles, fromhook);
	};

	this.on_get_album_art_done = (metadb, art_id, image, image_path) => {
		if (!is_activated) {
			return;
		}

		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	};

	this.on_notify_data = (name, info) => {
		playlist.on_notify_data(name, info);
	};
	// #endregion

	this.on_title_color_change = () => {
		playlist.on_title_color_change();
	}

	this.auto_collapse_header = () => {
		playlist.auto_collapse_header();
	}

	this.collapse_header = () => {
		playlist.collapse_header();
	}

	this.expand_header = () => {
		playlist.expand_header();
	}

	this.initialize = () => {
		playlist.register_key_actions(key_handler);
		playlist_info.register_key_actions(key_handler);

		playlist.initialize_list();
	};

	this.initScrollbar = () => {
		playlist.initScrollbar();
	};

	this.set_now_playing_hyperlink = () => {
		playlist.set_now_playing_hyperlink();
	};

	this.show_now_playing = () => {
		playlist.show_now_playing();
	};

	this.stop_drag_scroll = () => {
		playlist.stop_drag_scroll();
	}

	// TODO: Mordred - Do this elsewhere?
	this.mouse_in_this = function (x, y) {
		return (x >= this.x && x < this.x + this.w &&
				y >= (pref.layout !== 'default' ? this.y - playlist_info_h : this.y) && y < this.y + this.h);
	};
}


//////////////////
// * PLAYLIST * //
//////////////////
class Playlist extends List {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, 0, 0, new PlaylistContent());

		// * Constants
		/** @type {number} */
		this.header_h_in_rows = this.calcHeaderRows();

		// * Window state
		this.was_on_size_called = false;

		this.is_in_focus = false;

		// * Playback state
		/** @type {number} */
		this.cur_playlist_idx = undefined;
		/** @type {?Row} */
		this.playing_item = undefined;
		/** @type {?Row} */
		this.focused_item = undefined;

		// * Mouse and key state
		this.mouse_on_item = false;
		this.key_down = false;
		this.drag_event_invoked = false;

		// * Item events
		/** @type {?Row|?BaseHeader|?ListItem} */
		this.last_hover_item = undefined;
		/** @type  {{x: ?number, y: ?number}} */
		this.last_pressed_coord = {
			x: undefined,
			y: undefined
		};

		// * Timers
		this.drag_scroll_in_progress = false;
		this.drag_scroll_timeout_timer = 0;
		this.drag_scroll_repeat_timer = 0;

		// * Scrollbar props
		/** @type {Array<number>} float */
		this.scroll_pos_list = [];

		// * Objects
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

		this.debounced_initialize_and_repaint_list = debounce((refocus) => {
			// Debouncing this because when swapping out playlist content, initialize_and_repaint_list will be called
			// three times, once for each add/remove/changed callback
			this.initialize_and_repaint_list(refocus);
		}, 10, {
			leading:  false,
			trailing: true
		});
	}

	// #region Callback Implementation
	on_paint(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		if (this.items_to_draw.length) {
			// Mordred - Passing top, bottom for clipping purposes
			for (let i = this.items_to_draw.length - 1; i >= 0; --i) {
				this.items_to_draw[i].draw(gr, this.y, this.y + this.h);
			}
		}
		else {
			const empty = plman.PlaylistCount <= 1;
			const name = plman.GetPlaylistName(this.cur_playlist_idx);
			const text = empty ? 'Drop some tracks here\nor play from the library' : `Playlist: ${name}\nEmpty`;
			gr.DrawString(text, g_pl_fonts.title_normal, g_pl_colors.row_title_normal, this.x, this.y, this.w, this.h, g_string_format.align_center);
		}

		if (this.is_scrollbar_visible) {
			this.scrollbar.paint(gr);
		}
	}

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

		if (fb.IsPlaying && (pref.playlistAutoScrollNowPlaying || fb.PlaybackFollowCursor || fb.CursorFollowPlayback)) {
			this.on_playback_new_track();
		}
	}

	on_mouse_move(x, y, m) {
		if (List.prototype.on_mouse_move.apply(this, [x, y, m])) {
			return true;
		}

		const right_spacing = scaleForDisplay(20);
		const item = this.get_item_under_mouse(x - right_spacing, y);

		if (item instanceof Header) {
			item.headerTooltip(x, y);
			if (item.on_mouse_move(x, y, m)) return true;
		}
		else if (item instanceof Row) {
			item.titleTooltip(x, y);
			if (item.on_mouse_move(x, y, m)) return true;
		}
		else styledTooltipReady = false;

		if (!this.mouse_down) {
			return true;
		}

		if (!this.selection_handler.is_dragging() && this.last_hover_item) {
			const drag_diff = Math.sqrt((Math.pow(this.last_pressed_coord.x - x, 2) + Math.pow(this.last_pressed_coord.y - y, 2)));
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
	}

	on_mouse_lbtn_down(x, y, m) {
		if (List.prototype.on_mouse_lbtn_down.apply(this, [x, y, m])) {
			return true;
		}

		const ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
		const shift_pressed = utils.IsKeyPressed(VK_SHIFT);

		/** @type {BaseHeader|Row} */
		// @ts-ignore
		const item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
		this.last_hover_item = item;
		this.last_pressed_coord.x = x;
		this.last_pressed_coord.y = y;

		if (item) {
			if ((!pref.hyperlinksCtrlClick || ctrl_pressed) && item instanceof Header) {
				if (item.on_mouse_lbtn_down(x, y, m)) {
					return true;    // Was handled by hyperlinks
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
				// Indicates the need to update selection on on_mouse_lbtn_up
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

		const item = this.get_item_under_mouse(x, y);
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
		const was_double_clicked = this.mouse_double_clicked;

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

		// Drag is handled in on_drag_drop
		if (!this.selection_handler.is_dragging() && this.mouse_on_item) {
			const ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
			const shift_pressed = utils.IsKeyPressed(VK_SHIFT);
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

		const item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
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

		const metadb = utils.IsKeyPressed(VK_CONTROL) ? (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()) : fb.GetFocusItem();
		const has_selected_item = this.selection_handler.has_selected_items();
		const is_cur_playlist_empty = !this.cnt.rows.length;
		const cmm = new ContextMainMenu();

		// * Top menu options Playlist submenu
		cmm.append_item('Playlist options menu', () => {
			if (displayPlaylist || displayPlaylistArtworkLayout) {
				onOptionsMenu(state.mouse_x, state.mouse_y, true, true);
			}
		});
		cmm.append_separator();

		if (pref.layout === 'default' && ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
			cmm.append_item('Edit custom theme', () => {
				displayCustomThemeMenu = true;
				displayPanel('playlist');
				initCustomThemeMenu('pl_bg');
				window.Repaint();
			});
			cmm.append_separator();
		}

		if (pref.layout === 'default' && !displayPlaylistLibrary()) {
			if (displayPlaylist && !displayBiography && !pref.displayLyrics) {
				cmm.append_item(displayPlaylist && pref.playlistLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					pref.playlistLayout = pref.playlistLayout === 'normal' ? 'full' : 'normal';
					playlist.on_size(ww, wh);
					jumpSearch.on_size();
					window.Repaint();
				});
				cmm.append_separator();
			}
			else if (displayBiography && displayPlaylist) {
				cmm.append_item(displayPlaylist && displayBiography && pref.biographyLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					if (pref.biographyLayout === 'normal') {
						pref.biographyLayout = 'full';
						playlist.x = ww; // Move hidden Playlist off screen to disable Playlist mouse functions
					} else {
						pref.biographyLayout = 'normal';
						playlist.on_size(ww, wh);
						displayPlaylist = true;
					}
					biographyLayoutFullPreset();
					setBiographySize();
					window.Repaint();
				});
				cmm.append_separator();
			}
			else if (pref.displayLyrics) {
				cmm.append_item(pref.displayLyrics && pref.lyricsLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					pref.lyricsLayout = pref.lyricsLayout === 'normal' ? 'full' : 'normal';
					displayPlaylist = !displayPlaylist;
					resizeArtwork(true);
					window.Repaint();
				});
				cmm.append_separator();
			}
		}

		if (fb.IsPlaying) {
			cmm.append_item('Show now playing', () => {
				this.show_now_playing();
			});
		}

		if (playlistHistory.canBack()) {
			cmm.append_item('Previous playlist state', () => {
				playlistHistory.back();
			});
		}
		if (playlistHistory.canForward()) {
			cmm.append_item('Next playlist state', () => {
				playlistHistory.forward();
			});
		}

		if (!is_cur_playlist_empty) {
			cmm.append_item('Refresh playlist \tF5', () => {
				Header.art_cache.clear();
				this.initialize_list();
				this.scroll_to_focused();
			});

			if (this.queue_handler && this.queue_handler.has_items()) {
				cmm.append_item('Flush playback queue \tCtrl+Shift+Q', () => {
					this.queue_handler.flush();
				});
			}
			cmm.append_separator();
		}

		this.append_pltools_menu_to(cmm);

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

			if (pref.showWeblinks) {
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

			const appear = new ContextMenu('Appearance');
			cmm.append(appear);

			appear.append_item('Show playlist info', () => {
				g_properties.show_playlist_info = !g_properties.show_playlist_info;
			}, { is_checked: g_properties.show_playlist_info });

			this.append_scrollbar_visibility_context_menu_to(appear);
		}

		// -------------------------------------------------------------- //
		// * Context Menu Manager

		if (has_selected_item) {
			if (!cmm.is_empty()) {
				cmm.append_separator();
			}

			const ccmm = new ContextFoobarMenu(plman.GetPlaylistSelectedItems(this.cur_playlist_idx));
			cmm.append(ccmm);
		}

		// -------------------------------------------------------------- //
		// * System

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		activeMenu = true;
		cmm.execute(x, y);
		activeMenu = false;

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
			this.drag_event_invoked = false;
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
			if (action.IsInternal) {
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

		const drop_info = this.get_drop_row_info(x, y);
		const row = drop_info.row;

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
			action.Effect = g_drop_effect.copy; // * Wine/Linux drag n drop fix // action.Effect = this.filter_effect_by_modifiers(action.Effect);
		}
	}

	on_drag_drop(action, x, y, m) {
		this.mouse_down = false; ///< Because on_drag_drop suppresses on_mouse_lbtn_up call
		this.stop_drag_scroll();

		if (!this.selection_handler.is_dragging() || !this.trace_list(x, y) || !this.selection_handler.can_drop()) {
			this.selection_handler.disable_drag();
			action.Effect = g_drop_effect.none;
			return;
		}

		const ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);

		if (action.IsInternal) {
			const copy_drop = ctrl_pressed && ((action.Effect & 1) || (action.Effect & 4));
			this.selection_handler.drop(!!copy_drop);

			// Suppress native drop, since we've handled it ourselves
			action.Effect = g_drop_effect.none;
		}
		else {
			action.Effect = g_drop_effect.copy; // * Wine/Linux drag n drop fix // action.Effect = this.filter_effect_by_modifiers(action.Effect);
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
			const from_row = from_idx === -1 ? null : this.cnt.rows[from_idx];
			const playing_item_location = plman.GetPlayingItemLocation();
			if (!playing_item_location.IsValid) {
				return;
			}
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

		const row = this.cnt.rows[playlistItemIndex];
		if (!row) {
			return;
		}

		this.scroll_to_row(null, row);
	}

	on_playlist_items_added(playlist_idx) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}
		if (pref.playlistSortOrderAuto) setPlaylistSortOrder();

		this.debounced_initialize_and_repaint_list();
	}

	on_playlist_items_reordered(playlist_idx) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}
		playlistScrollReady = false; // * Don't scroll when reordering playlist items to prevent scroll jump
		this.debounced_initialize_and_repaint_list(true);
	}

	on_playlist_items_removed(playlist_idx) {
		if (playlist_idx !== this.cur_playlist_idx) {
			return;
		}
		playlistScrollReady = false; // * Don't scroll when removing playlist items to prevent scroll jump
		this.debounced_initialize_and_repaint_list();
	}

	on_playlist_items_selection_change() {
		if (!this.mouse_in && !this.key_down) {
			this.selection_handler.initialize_selection();
		}
	}

	on_playback_dynamic_info_track() {
		this.cnt.rows.forEach((item) => {
			item.reset_queried_data();
		});

		this.cnt.sub_items.forEach((header) => {
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

		const playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid && playing_item_location.PlaylistIndex === this.cur_playlist_idx) {
			this.playing_item = this.cnt.rows[playing_item_location.PlaylistItemIndex];
			if (this.playing_item) {
				this.playing_item.is_playing = true;
				this.playing_item.clear_title_text();
			}

			if (this.collapse_handler && (g_properties.auto_collapse || g_properties.collapse_on_start)) {
				this.selection_handler.clear_selection();
				this.collapse_handler.collapse_all_but_now_playing();
				this.scroll_to_now_playing();
			}
		}

		if (pref.playlistAutoScrollNowPlaying || fb.PlaybackFollowCursor || fb.CursorFollowPlayback) {
			setTimeout(() => { // * Wait until new album art / disc art loaded and other things finished for smoother auto-scrolling
				this.show_now_playing();
			}, newTrackFetchingDone + 200);
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
			// Only need to update the header data if it's already been drawn/cached
			if (item instanceof Header && (item.header_image || item.hyperlinks_initialized)) {
				const metadb = item.get_first_row().metadb;
				if (handles.BSearch(metadb) !== -1)  {
					item.header_image = null;
					item.reset_hyperlinks();
				}
			}
		}

		// ? Is there a more efficient way to do this?
		this.cnt.rows.forEach((item) => {
			item.reset_queried_data();
		});
	}

	on_get_album_art_done(metadb, art_id, image, image_path) {
		if (!image) {
			image = null;
		}

		/** @type {Array<Row|BaseHeader>} */
		const items = this.items_to_draw;
		items.forEach((item) => {
			if (item instanceof Header && (!item.is_art_loaded() && item.get_first_row().metadb.Compare(metadb))) {
				item.assign_art(image);
				item.repaint();
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

	/**
	 * Used when updating title color in Reborn/Random theme
	 */
	on_title_color_change() {
		const rows = this.cnt.rows.length;
		for (let i = 0; i < rows; i++) {
			const item = this.cnt.rows[i];
			item.update_title_color();
		}
	}

	// #endregion

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
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}

				const visible_item = this.cnt_helper.is_item_visible(this.focused_item) ? this.focused_item : this.cnt_helper.get_visible_parent(this.focused_item);
				let new_item = this.cnt_helper.get_navigateable_neighbour(visible_item, -1);
				if (!new_item) {
					new_item = visible_item;
				}

				this.selection_handler.update_selection(new_item, undefined, modifiers.shift);
				this.repaint();
			});

		key_handler.register_key_action(VK_DOWN,
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
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}

				const visible_item = this.cnt_helper.is_item_visible(this.focused_item) ? this.focused_item : this.cnt_helper.get_visible_parent(this.focused_item);
				let new_item = this.cnt_helper.get_navigateable_neighbour(visible_item, 1);
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
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}
				/** @type {BaseHeader|Row} */
				let new_focus = this.focused_item;

				// Get top uncollapsed header
				let visible_header = this.cnt_helper.get_visible_parent(this.focused_item);
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
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}
				/** @type {BaseHeader|Row} */
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
			});

		key_handler.register_key_action(VK_PRIOR,
			(modifiers) => {
				if (!this.cnt.rows.length) {
					return;
				}

				if (!this.focused_item) {
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}

				let new_focus_item;
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

				let new_focus_item;
				if (this.is_scrollbar_available) {
					new_focus_item = last(this.items_to_draw);
					if (!this.cnt_helper.is_item_navigateable(new_focus_item)) {
						new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
					}
					if (new_focus_item.y < this.list_y + this.list_h && new_focus_item.y + new_focus_item.h > this.list_y + this.list_h) {
						new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
					}
					if (new_focus_item === this.focused_item) {
						this.scrollbar.shift_page(1);
						new_focus_item = last(this.items_to_draw);
						if (!this.cnt_helper.is_item_navigateable(new_focus_item)) {
							new_focus_item = this.cnt_helper.get_navigateable_neighbour(new_focus_item, -1);
						}
					}
				}
				else {
					new_focus_item = last(this.items_to_draw);
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
				this.selection_handler.update_selection(last(this.cnt.rows), undefined, modifiers.shift);
				this.scrollbar.scroll_to_end();
			});

		key_handler.register_key_action(VK_DELETE,
			(modifiers) => {
				playlistScrollReady = false; // * Don't scroll when removing playlist items to prevent scroll jump

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
				if (!this.focused_item) { // Needed to reinit lost focus to prevent crash, e.g from 3rd party components using their own window
					const top_item = this.items_to_draw[0];
					this.focused_item = top_item instanceof Row ? top_item : top_item.get_first_row();
				}
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
					const rows = this.cnt.rows;
					if (modifiers.ctrl) {
						const indexes = this.selection_handler.get_selected_items();
						indexes.forEach((idx) => {
							this.queue_handler.add_row(rows[idx]);
						});
					}
					else if (modifiers.shift) {
						const indexes = this.selection_handler.get_selected_items();
						indexes.forEach((idx) => {
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
	}

	auto_collapse_header() {
		if (g_properties.auto_collapse) {
			this.collapse_handler.collapse_all_but_now_playing();
			if (this.collapse_handler.changed && pref.playlistAutoScrollNowPlaying) {
				this.scroll_to_now_playing_or_focused();
			}
		} else {
			this.collapse_handler.expand_all();
		}
	}

	collapse_header() {
		playlistScrollReady = false; // * Don't scroll when collapsing header to prevent scroll jump
		setTimeout(() => {
			playlist.auto_collapse_header();
			Header.prototype.clearCachedHeaderImg.apply(this);
			Header.prototype.repaint.apply(this);
		}, 600);
	}

	expand_header() {
		setTimeout(() => {
			this.collapse_handler.expand_all();
			Header.prototype.clearCachedHeaderImg.apply(this);
			Header.prototype.repaint.apply(this);
		}, 600);
	}

	initialize_and_repaint_list(refocus) {
		this.initialize_list();
		if (refocus) {
			this.scroll_to_focused(); // Needed after drag-drop, because it might cause dropped (i.e. focused) item to be outside of drawn list
		}
		this.repaint();
	}

	/**
	 * This method does not contain any redraw calls - it's purely back-end
	 */
	initialize_list() {
		trace_call && console.log('initialize_list');
		const profiler = fb.CreateProfiler();
		const profiler_part = trace_initialize_list_performance ? fb.CreateProfiler() : '';

		this.cur_playlist_idx = plman.ActivePlaylist;

		// * Clear contents

		this.cnt.rows = [];
		this.cnt.sub_items = [];

		// * Initialize rows

		trace_initialize_list_performance && profiler_part.Reset();

		const rows_metadb = plman.GetPlaylistItems(this.cur_playlist_idx);
		this.cnt.rows = this.initialize_rows(plman.GetPlaylistItems(this.cur_playlist_idx));

		trace_initialize_list_performance && console.log(`Rows initialized in ${profiler_part.Time}ms`);

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

		trace_initialize_list_performance && profiler_part.Reset();

		Header.grouping_handler.set_active_playlist(plman.GetPlaylistName(this.cur_playlist_idx));
		this.cnt.sub_items = this.create_headers(this.cnt.rows, rows_metadb);
		getHeaderArtwork(this.cnt.sub_items.slice(0, 10));	// Preload first 10 artworks

		trace_initialize_list_performance && console.log(`Headers initialized in ${profiler_part.Time}ms`);

		if (!this.was_on_size_called) {
			// * First time init
			this.collapse_handler = new CollapseHandler(/** @type {PlaylistContent} */ this.cnt);

			if (g_properties.show_header) {
				if (g_properties.collapse_on_start) {
					this.collapse_handler.collapse_all();
				}

				this.collapse_handler.set_callback(() => {
					this.on_list_items_change();
				});
			}
		}
		else {
			// * Update list control
			if (this.collapse_handler) {
				this.collapse_handler.on_content_change();
			}

			if (g_properties.auto_collapse) {
				this.collapse_header();
			}

			this.scrollbar.stopScrolling();

			// ? Can we get away with this workaround? Prevents auto-expanding headers and scroll jump when dragging in split layout
			if (!displayPlaylistLibrary()) {
				this.on_list_items_change();
			}
		}

		// * Initialize other objects
		if (g_properties.show_queue_position) {
			this.queue_handler = new QueueHandler(this.cnt.rows, this.cur_playlist_idx);
		}
		this.selection_handler = new SelectionHandler(/** @type {PlaylistContent} */ this.cnt, this.cur_playlist_idx);

		this.set_now_playing_hyperlink();

		setTimeout(() => { playlistScrollReady = true; }, 200); // * Restore scrolling

		(true || trace_initialize_list_performance) && console.log(`Playlist initialized in ${profiler.Time}ms`);
	}

	/**
	 * Called to update scrollbar colors
	 * {@link initTheme()}
	 */
	initScrollbar() {
		if (this.is_scrollbar_visible) {
			this.initialize_scrollbar();
			this.update_scrollbar();
		}
	}

	reinitialize() {
		if (this.cur_playlist_idx !== plman.ActivePlaylist) {
			g_properties.scroll_pos = this.scroll_pos_list[plman.ActivePlaylist] == null ? 0 : this.scroll_pos_list[plman.ActivePlaylist];
		}
		this.row_h = scaleForDisplay(g_properties.row_h);
		this.header_h_in_rows = this.calcHeaderRows();
		this.initialize_list();
		this.scroll_to_focused();
	}

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


	// private:

	/**
	 * @param {FbMetadbHandleList} playlist_items
	 * @return {Array<Row>}
	 */
	initialize_rows(playlist_items) {
		const playlist_items_array = playlist_items.Convert();

		const rows = [];
		for (let i = 0, playlist_size = playlist_items_array.length; i < playlist_size; ++i) {
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
		const prepared_rows = Header.prepare_initialization_data(rows, rows_metadb);
		return Header.create_headers(/** @type {PlaylistContent} */ this.cnt, this.list_x, 0, this.list_w, this.row_h * this.header_h_in_rows, prepared_rows);
	}

	set_rows_boundary_status() {
		const last_row = last(this.cnt.rows);
		if (last_row) {
			last_row.is_cropped = this.is_scrollbar_available ? this.scrollbar.is_scrolled_down : false;
		}
	}

	// #region Context Menu

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_pltools_menu_to(parent_menu) {
		const pltools = new ContextMenu('Playlist tools');
		const playlist_count = plman.PlaylistCount;
		pltools.append_item('Playlist manager \tCtrl+M', () => {
			fb.RunMainMenuCommand('View/Playlist Manager');
		});
		pltools.append_item('Playlist search \tCtrl+F', () => {
			fb.RunMainMenuCommand('View/Playlist search');
		});
		pltools.append_separator();

		pltools.append_item('Create new playlist \tCtrl+N', () => {
			plman.CreatePlaylist(playlist_count, '');
			plman.ActivePlaylist = playlist_count;
		});

		const autopl = new ContextMenu('Create new auto playlist');
		pltools.append(autopl);
		autopl.append_item('Custom auto playlist', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) New auto playlist', '', '', 0);
			plman.ActivePlaylist = playlist_count;
			plman.ShowAutoPlaylistUI(playlist_count);
		});
		autopl.append_separator();
		autopl.append_item('Tracks from the library', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks from the library', 'ALL', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_separator();
		autopl.append_item('Tracks most played', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks most played', '%play_count% GREATER 9', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks never played', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks never played', '%play_count% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks played in the last week', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks played in the last week', '%last_played% DURING LAST 1 WEEK', '%last_played%', 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks played in the last month', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks played in the last month', '%last_played% DURING LAST 4 WEEKS', '%last_played%', 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks played in the last year', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks played in the last year', '%last_played% DURING LAST 52 WEEKS', '%last_played%', 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_separator();
		autopl.append_item('Tracks unrated', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks unrated', '%rating% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks rated 1', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 1', '%rating% IS 1', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks rated 2', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 2', '%rating% IS 2', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks rated 3', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 3', '%rating% IS 3', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks rated 4', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 4', '%rating% IS 4', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_item('Tracks rated 5', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 5', '%rating% IS 5', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		autopl.append_separator();
		autopl.append_item('Loved tracks', () => {
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Loved tracks', '%mood% GREATER 0', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
		});
		pltools.append_separator();

		pltools.append_item('Save playlist \tCtrl+S', () => {
			fb.RunMainMenuCommand('File/Save playlist...');
		});
		pltools.append_item('Load playlist', () => {
			fb.RunMainMenuCommand('File/Load playlist...');
		});
		const isAutoPl = !plman.PlaylistCount ? '' : plman.IsAutoPlaylist(this.cur_playlist_idx);
		const isLocked = !plman.PlaylistCount ? '' : plman.IsPlaylistLocked(this.cur_playlist_idx);
		pltools.append_item(isLocked ? isAutoPl ? 'Unlock playlist (N/A for auto playlists)' : 'Unlock playlist' : 'Lock playlist', () => {
			if (isLocked && !isAutoPl) {
				plman.SetPlaylistLockedActions(this.cur_playlist_idx, null);
			} else if (!isAutoPl) {
				plman.SetPlaylistLockedActions(this.cur_playlist_idx, ['ExecuteDefaultAction']);
			}
		}, { is_grayed_out: isAutoPl });
		parent_menu.append(pltools);
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_edit_menu_to(parent_menu) {
		const has_selected_item = this.selection_handler.has_selected_items();
		const is_playlist_locked = !plman.PlaylistCount ? '' : plman.IsPlaylistLocked(this.cur_playlist_idx);
		// Check only for data presence, since parsing it's contents might take a while
		const has_data_in_clipboard = fb.CheckClipboardContents();
		if (has_selected_item || has_data_in_clipboard) {
			if (!parent_menu.is_empty()) {
				parent_menu.append_separator();
			}

			if (has_selected_item) {
				parent_menu.append_item('Cut', () => {
					this.selection_handler.cut();
				}, { is_grayed_out: !has_selected_item });

				parent_menu.append_item('Copy',	() => {
					this.selection_handler.copy();
				}, { is_grayed_out: !has_selected_item });
			}

			if (has_data_in_clipboard) {
				parent_menu.append_item('Paste', () => {
					this.selection_handler.paste();
				}, { is_grayed_out: !has_data_in_clipboard || is_playlist_locked });
			}
		}

		if (has_selected_item) {
			if (!parent_menu.is_empty()) {
				parent_menu.append_separator();
			}

			parent_menu.append_item('Remove', () => {
				playlistScrollReady = false; // * Don't scroll when removing playlist items to prevent scroll jump
				plman.RemovePlaylistSelection(this.cur_playlist_idx);
			}, { is_grayed_out: is_playlist_locked });
		}
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_collapse_menu_to(parent_menu) {
		const ce = new ContextMenu('Collapse/Expand');
		parent_menu.append(ce);

		ce.append_item('Collapse all', () => {
			this.collapse_handler.collapse_all();
			if (this.collapse_handler.changed) {
				this.scroll_to_focused_or_now_playing();
			}
		});

		if (plman.ActivePlaylist === plman.PlayingPlaylist) {
			ce.append_item('Collapse all but now playing', () => {
				this.collapse_handler.collapse_all_but_now_playing();
				if (this.collapse_handler.changed) {
					this.scroll_to_now_playing_or_focused();
				}
			});
		}

		ce.append_item('Expand all', () => {
			this.collapse_handler.expand_all();
			if (this.collapse_handler.changed) {
				this.scroll_to_focused_or_now_playing();
			}
		});

		ce.append_separator();

		ce.append_item('Auto', () => {
			g_properties.auto_collapse = !g_properties.auto_collapse;
			if (g_properties.auto_collapse) {
				this.collapse_handler.collapse_all_but_now_playing();
				if (this.collapse_handler.changed) {
					this.scroll_to_now_playing_or_focused();
				}
			} else {
				this.collapse_handler.expand_all();
			}
		}, { is_checked: g_properties.auto_collapse });

		ce.append_item('Collapse on start', () => {
			g_properties.collapse_on_start = !g_properties.collapse_on_start;
		}, { is_checked: g_properties.collapse_on_start });

		ce.append_item('Collapse on playlist switch', () => {
			g_properties.collapse_on_playlist_switch = !g_properties.collapse_on_playlist_switch;
		}, { is_checked: g_properties.collapse_on_playlist_switch });
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_appearance_menu_to(parent_menu) {
		const appear = new ContextMenu('Appearance');
		parent_menu.append(appear);

		PlaylistManager.append_playlist_info_visibility_context_menu_to(appear);

		this.append_scrollbar_visibility_context_menu_to(appear);

		appear.append_item('Show artist name on difference', () => {
			pref.showDifferentArtist = !pref.showDifferentArtist;

			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: pref.showDifferentArtist });

		appear.append_item('Show artist name in all rows', () => {
			pref.showArtistPlaylistRows = !pref.showArtistPlaylistRows;

			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: pref.showArtistPlaylistRows });

		appear.append_item('Show album title in all rows', () => {
			pref.showAlbumPlaylistRows = !pref.showAlbumPlaylistRows;

			this.initialize_list();
			this.scroll_to_focused_or_now_playing();
		}, { is_checked: pref.showAlbumPlaylistRows });

		appear.append_item('Show group header', () => {
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
		}, { is_checked: g_properties.show_header });

		if (g_properties.show_header) {
			const appear_header = new ContextMenu('Headers');
			appear.append(appear_header);

			appear_header.append_item('Use compact group header', () => {
				g_properties.use_compact_header = !g_properties.use_compact_header;
				this.header_h_in_rows = this.calcHeaderRows();
				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			}, { is_checked: g_properties.use_compact_header });

			appear_header.append_item('Show disc sub-header', () => {
				g_properties.show_disc_header = !g_properties.show_disc_header;
				this.initialize_list();
				this.scroll_to_focused_or_now_playing();
			}, { is_checked: g_properties.show_disc_header });

			if (!g_properties.use_compact_header) {
				appear_header.append_item('Show group info', () => {
					g_properties.show_group_info = !g_properties.show_group_info;
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				}, { is_checked: g_properties.show_group_info });

				const art = new ContextMenu('Album art');
				appear_header.append(art);

				art.append_item('Show', () => {
					g_properties.show_album_art = !g_properties.show_album_art;
					if (g_properties.show_album_art) {
						get_album_art(this.items_to_draw);
					}
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				}, { is_checked: g_properties.show_album_art });

				art.append_item('Auto-hide when no cover', () => {
					g_properties.auto_album_art = !g_properties.auto_album_art;
					if (g_properties.show_album_art) {
						get_album_art(this.items_to_draw);
					}
					this.initialize_list();
					this.scroll_to_focused_or_now_playing();
				},
					{
						is_checked:    g_properties.auto_album_art,
						is_grayed_out: !g_properties.show_album_art
					}
				);
			}
		}

		const appear_row = new ContextMenu('Rows');
		appear.append(appear_row);

		appear_row.append_item('Alternate row color', () => {
			g_properties.show_row_stripes = !g_properties.show_row_stripes;
		}, { is_checked: g_properties.show_row_stripes });

		appear_row.append_item('Show play count', () => {
			g_properties.show_playcount = !g_properties.show_playcount;
		}, { is_checked: g_properties.show_playcount });

		appear_row.append_item('Show queue position', () => {
			g_properties.show_queue_position = !g_properties.show_queue_position;
			this.queue_handler = g_properties.show_queue_position ? new QueueHandler(this.cnt.rows, this.cur_playlist_idx) : undefined;
		}, { is_checked: g_properties.show_queue_position });

		appear_row.append_item('Show rating', () => {
			g_properties.show_rating = !g_properties.show_rating;
		}, { is_checked: g_properties.show_rating });
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_sort_menu_to(parent_menu) {
		const has_multiple_selected_items = this.selection_handler.selected_items_count() > 1;
		const is_auto_playlist = plman.IsAutoPlaylist(this.cur_playlist_idx);

		const sort = new ContextMenu(has_multiple_selected_items ? 'Sort selection' : 'Sort',
			{ is_grayed_out: is_auto_playlist }
		);
		parent_menu.append(sort);

		sort.append_item('by...', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by...');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by...');
			}
		});

		sort.append_item('by album', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by album');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by album');
			}
		});

		sort.append_item('by artist', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by artist');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by artist');
			}
		});

		sort.append_item('by file path', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by file path');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by file path');
			}
		});

		sort.append_item('by title', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by title');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by title');
			}
		});

		sort.append_item('by track number', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Sort by track number');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Sort by track number');
			}
		});

		sort.append_item('by date', () => {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.SortByFormat(this.cur_playlist_idx, '$if3(%original release date%, %originaldate%, %date%) %album% %edition% %codec% %discnumber% %tracknumber%', has_multiple_selected_items);
		});

		sort.append_separator();

		sort.append_item('Save', () => {
			fb.RunMainMenuCommand('File/Save playlist...');
		});

		sort.append_item('Load', () => {
			fb.RunMainMenuCommand('File/Load playlist...');
		});

		sort.append_item('Undo', () => {
			fb.RunMainMenuCommand('Edit/Undo');
		});

		sort.append_item('Randomize', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Randomize');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Randomize');
			}
		});

		sort.append_item('Reverse', () => {
			if (has_multiple_selected_items) {
				fb.RunMainMenuCommand('Edit/Selection/Sort/Reverse');
			}
			else {
				fb.RunMainMenuCommand('Edit/Sort/Reverse');
			}
		});
	}

	/**
	 * @param {ContextMenu} parent_menu
	 * @param {FbMetadbHandle} metadb
	 */
	append_weblinks_menu_to(parent_menu, metadb) {
		const web = new ContextMenu('Weblinks');
		parent_menu.append(web);

		const web_links = [
			['Google', 'google'],
			['Google Images', 'googleImages'],
			['Wikipedia', 'wikipedia'],
			['YouTube', 'youTube'],
			['Last FM', 'lastFM'],
			['Discogs', 'discogs']
		];

		web_links.forEach((item) => {
			web.append_item(item[0], function (url) {
				qwr_utils.link(url, metadb);
			}.bind(null, item[1]));
		});
	}

	/**
	 * @param {ContextMenu} parent_menu
	 */
	append_send_items_menu_to(parent_menu) {
		const playlist_count = plman.PlaylistCount;

		const send = new ContextMenu('Send selection');
		parent_menu.append(send);

		send.append_item('To top', () => {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.MovePlaylistSelection(this.cur_playlist_idx, -plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx));
		});

		send.append_item('To bottom', () => {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.MovePlaylistSelection(this.cur_playlist_idx, plman.PlaylistItemCount(this.cur_playlist_idx) - plman.GetPlaylistSelectedItems(this.cur_playlist_idx).Count);
		});

		send.append_separator();

		send.append_item('Create New Playlist \tCtrl+N', () => {
			plman.CreatePlaylist(playlist_count, '');
			plman.InsertPlaylistItems(playlist_count, 0, plman.GetPlaylistSelectedItems(this.cur_playlist_idx), true);
		});

		send.append_separator();

		for (let i = 0; i < playlist_count; ++i) {
			let playlist_text = `${plman.GetPlaylistName(i)} [${plman.PlaylistItemCount(i)}]`;

			const is_item_autoplaylist = plman.IsAutoPlaylist(i);
			if (is_item_autoplaylist) {
				playlist_text += ' (Auto)';
			}

			if (i === plman.PlayingPlaylist) {
				playlist_text += ' (Now Playing)';
			}

			send.append_item(playlist_text, ((playlist_idx) => {
				this.selection_handler.send_to_playlist(playlist_idx);
			}).bind(undefined, i), { is_grayed_out: is_item_autoplaylist || i === this.cur_playlist_idx });
		}
	}

	// #endregion

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {{row: ?Row, is_above: ?boolean}}
	 */
	get_drop_row_info(x, y) {
		const drop_info = {
			row:      undefined,
			is_above: undefined
		};

		let item = this.get_item_under_mouse(x, y);
		if (!item) {
			if (!this.trace_list(x, y) || !this.cnt.rows.length) {
				return drop_info;
			}

			item = last(this.cnt.rows);
		}

		const is_above = y < (item.y + item.h / 2);

		if (item instanceof BaseHeader) {
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
		else if (item instanceof Row) {
			if (is_above) {
				drop_info.row = item;
				drop_info.is_above = true;
			}
			else if (g_properties.show_header && item.idx === last(item.parent.sub_items).idx
				|| item === last(this.cnt.rows)) {
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

	// #region 'Scroll to' Methods
	set_now_playing_hyperlink() {
		if (!fb.IsPlaying || plman.GetPlaylistName(this.cur_playlist_idx) !== 'Search') {
			return;
		}

		const plIndex = plman.FindOrCreatePlaylist('Search', true);

		setTimeout(() => { // Wait for loadingThemeComplete && plIndex
			const handles = plman.GetPlaylistItems(plIndex);
			const index = handles.Find(fb.GetNowPlaying());

			this.playing_item = this.cnt.rows[index];
			if (this.playing_item) {
				this.playing_item.is_playing = true;
				this.playing_item.clear_title_text();
			}

			window.RepaintRect(this.x, this.y, this.w, this.h);
		}, loadingThemeComplete && plIndex);
	}

	show_now_playing() {
		const playing_item_location = plman.GetPlayingItemLocation();
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
		if (!this.is_scrollbar_available || !playlistScrollReady) {
			return;
		}

		const has_headers = g_properties.show_header;

		const visible_to_item = this.cnt_helper.is_item_visible(to_row) ? to_row : this.cnt_helper.get_visible_parent(to_row);
		const to_item_state = this.get_item_visibility_state(visible_to_item);

		let shifted_successfully = false;
		switch (to_item_state.visibility) {
			case visibility_state.none: {
				if (!from_row) {
					break;
				}

				const visible_from_item = this.cnt_helper.is_item_visible(from_row) ? from_row : this.cnt_helper.get_visible_parent(from_row);

				const from_item_state = this.get_item_visibility_state(visible_from_item);
				if (from_item_state.visibility === visibility_state.none) {
					break;
				}

				const direction = (to_row.idx - from_row.idx) > 0 ? 1 : -1;
				let scroll_shift = 0;
				let neighbour_item = visible_from_item;
				do {
					const neighbour_item_state = this.get_item_visibility_state(neighbour_item);
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
				let scroll_shift = 0;
				let top_item = visible_to_item;
				while (top_item.parent && top_item.parent instanceof BaseHeader && top_item === top_item.parent.sub_items[0]) {
					top_item = top_item.parent;
					const header_state = this.get_item_visibility_state(top_item);
					scroll_shift += header_state.invisible_part;
				}
				this.scrollbar.smooth_scroll_to(g_properties.scroll_pos - scroll_shift);
			}
		}
		else {
			const item_draw_idx = this.get_item_draw_row_idx(visible_to_item);
			const new_scroll_pos = Math.max(0, item_draw_idx - Math.floor(this.rows_to_draw_precise / 2));
			if (!playlistHistoryUsed) {
				this.scrollbar.smooth_scroll_to(new_scroll_pos);
			}
		}
	}

	/**
	 * @param {Row|BaseHeader} item_to_check
	 * @return {{visibility: visibility_state, invisible_part: number}}
	 */
	get_item_visibility_state(item_to_check) {
		const item_state = {
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
				return false; // Aborts every
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
		let cur_row = 0;
		const is_target_row = target_item instanceof Row;

		const iterate_level = (sub_items, target_item) => {
			if (sub_items[0] instanceof BaseHeader) {
				const header_h_in_rows = Math.round(sub_items[0].h / this.row_h);

				for (let i = 0; i < sub_items.length; ++i) {
					const header = sub_items[i];
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
			else if (is_target_row) { // Row
				for (let j = 0; j < sub_items.length; ++j) {
					if (target_item === sub_items[j]) {
						return true;
					}

					++cur_row;
				}
			}
			else {
				cur_row += sub_items.length;
			}

			return false;
		};

		if (!iterate_level(g_properties.show_header ? this.cnt.sub_items : this.cnt.rows, target_item)) {
			throw new LogicError('Could not find item in drawn item list');
		}

		return cur_row;
	}

	// #endregion

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

				let cur_marked_item;
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

					cur_marked_item = last(this.items_to_draw);
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
		const ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
		const shift_pressed = utils.IsKeyPressed(VK_SHIFT);
		const alt_pressed = utils.IsKeyPressed(VK_MENU);

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
		const headerFontSize = pref.layout === 'compact' ? pref.playlistHeaderFontSize_compact : pref.layout === 'artwork' ? pref.playlistHeaderFontSize_artwork : pref.playlistHeaderFontSize_default;
		const rowFontSize    = pref.layout === 'compact' ? pref.playlistFontSize_compact       : pref.layout === 'artwork' ? pref.playlistFontSize_artwork       : pref.playlistFontSize_default;
		let numRows;
		if (g_properties.use_compact_header) {
			numRows = g_properties.rows_in_compact_header;
		} else {
			numRows = g_properties.rows_in_header;
			if ((headerFontSize * 2 + 3 + rowFontSize) > (g_properties.rows_in_header * g_properties.row_h * 0.6)) {
				numRows++;
			}
		}
		return numRows;
	}
}


///////////////////////////////
// * HEADER ARTWORK LOADER * //
///////////////////////////////
/**
 * @type {function}
 */
const debounced_get_album_art = debounce((items) => {
	getHeaderArtwork(items);
}, 500, {
	leading:  false,
	trailing: true
});


/** @type {FbMetadbHandle[]} */
let loadingArtList = [];	// List of handles that we are loading artwork for.

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
		const cached_art = Header.art_cache.get_image_for_meta(metadb);

		if (cached_art) {
			item.assign_art(cached_art);
		} else {
			// TODO: Once this has been better tested, remove on_get_album_art_done callback from this file, and probably gr-main.js as well
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


/////////////////
// * CONTENT * //
/////////////////
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

		const first_item = this.generate_first_item_to_draw(wy, wh, row_shift, pixel_shift, row_h);
		return this.generate_all_items_to_draw(wy, wh, first_item);
	}

	/** @override */
	update_items_w_size(w) {
		if (!g_properties.show_header) {
			ListRowContent.prototype.update_items_w_size.apply(this, [w]);
			return;
		}

		this.sub_items.forEach((item) => {
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

		const row_h = playlist_geo.row_h;
		let total_height_in_rows = Math.round(this.sub_items[0].h / row_h) * this.sub_items.length;
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
		const start_y = wy + pixel_shift;
		let cur_row = 0;

		/**
		 * Searches sub_items for first visible item {@link ContentNavigationHelper.is_item_visible}
		 *
		 * @param {Array<BaseHeader>|Array<Row>} sub_items
		 * @return {?BaseHeader|?Row}
		 */
		function iterate_level(sub_items) {
			if (sub_items[0] instanceof BaseHeader) {
				const header_h_in_rows = Math.round(sub_items[0].h / row_h);

				for (let i = 0; i < sub_items.length; ++i) {
					/** @type {BaseHeader} */
					// @ts-ignore
					const header = sub_items[i];
					if (cur_row + header_h_in_rows - 1 >= row_shift /*&& !header.dont_draw*/) {
						header.set_x(pref.layout === 'default' && (pref.playlistLayout === 'normal' || pref.playlistLayoutNormal && (displayBiography || pref.displayLyrics)) ? ww * 0.5 : 0);
						header.set_y(start_y + (cur_row - row_shift) * row_h);
						return header;
					}

					// if (!header.dont_draw) {
						cur_row += header_h_in_rows;
					// }

					if (header.is_collapsed) {
						continue;
					}

					const result = iterate_level(header.sub_items);
					if (result) {
						return result;
					}
				}
			}
			else { // Row
				if (cur_row + sub_items.length - 1 >= row_shift) {
					const row_start_idx = (cur_row > row_shift) ? 0 : row_shift - cur_row;
					cur_row += row_start_idx;

					const row = sub_items[row_start_idx];
					row.set_x(pref.layout === 'default' && (pref.playlistLayout === 'normal' || pref.playlistLayoutNormal && (displayBiography || pref.displayLyrics)) ? ww * 0.5 : 0);
					row.set_y(start_y + (cur_row - row_shift) * row_h);

					return row;
				}

				cur_row += sub_items.length;
			}

			return null;
		}

		const first_item = iterate_level(this.sub_items);
		assert(first_item != null, LogicError, 'first_item_to_draw can\'t be null!');

		return first_item;
	}

	/**
	 * @param {number} wy
	 * @param {number} wh
	 * @param {Row|BaseHeader} first_item
	 * @return {Array<Row|BaseHeader>}
	 */
	generate_all_items_to_draw(wy, wh, first_item) {
		const items_to_draw = [first_item];
		let cur_y = first_item.y + first_item.h;

		/**
		 *
		 * @param {Array<BaseHeader>|Array<Row>} sub_items
		 * @param {Row|BaseHeader} start_item
		 * @return {boolean} true, if start_item was used
		 */
		function iterate_level(sub_items, start_item) {
			const is_cur_level_header = sub_items[0] instanceof BaseHeader;
			let start_item_used = !start_item;

			let leveled_start_item = start_item;
			while (leveled_start_item && leveled_start_item.parent !== sub_items[0].parent) {
				leveled_start_item = leveled_start_item.parent;
			}

			const start_idx = leveled_start_item ? leveled_start_item instanceof Row ? leveled_start_item.idx_in_header : leveled_start_item.idx : 0;

			for (let i = start_idx; i < sub_items.length; ++i) {
				const item = sub_items[i];
				if (start_item_used /* && !item.dont_draw*/) {
					item.set_x(pref.layout === 'default' && (pref.playlistLayout === 'normal' || pref.playlistLayoutNormal && (displayBiography || pref.displayLyrics)) ? ww * 0.5 : 0);
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
		return 'Item is undefined or null';
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
	return 'Unknown Item Type';
}


function ContentNavigationHelper(cnt_arg) {
	/**
	 * @const
	 * @type {PlaylistContent}
	 */
	const cnt = cnt_arg;

	/**
	 * @param {Row|BaseHeader} item
	 * @return {?BaseHeader}
	 */
	this.get_visible_parent = (item) => {
		if (!item.parent || !(item.parent instanceof BaseHeader)) {
			return null;
		}

		let cur_item = item;
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
	this.is_item_visible = (item) => {
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
	this.is_item_navigateable = (item) => item instanceof Row ? true : item.is_collapsed;

	/**
	 * {@link ContentNavigationHelper.is_item_navigateable}
	 *
	 * @param {Row|BaseHeader} item
	 * @param {number} direction
	 * @return {Row|BaseHeader|null}
	 */
	this.get_navigateable_neighbour = function (item, direction) {
		let neighbour_item = item;
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
	this.get_prev_visible_item = (item) => {
		/**
		 * @param {BaseHeader} item
		 * @return {BaseHeader|Row}
		 */
		function get_last_visible_item(item) {
			let last_item = item;
			while (!(last_item instanceof Row) && !last_item.is_collapsed) {
				last_item = last(last_item.sub_items);
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
	this.get_next_visible_item = (item) => {
		/**
		 * @param {Row|BaseHeader} item
		 * @return {Row|BaseHeader|null}
		 */
		function get_next_item(item) {
			let next_item = item;
			while (next_item) {
				if (!next_item.parent) {
					return null;
				}

				if (next_item !== last(next_item.parent.sub_items)) {
					const next_item_idx = next_item instanceof Row ? next_item.idx_in_header : next_item.idx;
					return next_item.parent.sub_items[next_item_idx + 1];
				}

				next_item = next_item.parent;
			}

			return next_item;
		}

		if (!g_properties.show_header) {
			if (item === last(cnt.rows)) {
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
}


/////////////////////
// * BASE HEADER * //
/////////////////////
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
		throw new LogicError('initialize_contents not implemented');
	}

	/**
	 * @override
	 * @abstract
	 */
	draw(gr) {
		// Need this useless method to suppress warning =(
		throw new LogicError('draw not implemented');
	}

	/** @override */
	set_w(w) {
		ListItem.prototype.set_w.apply(this, [w]);

		this.sub_items.forEach((item) => {
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

		let item = this.sub_items[0];
		while (item && !(item instanceof Row)) {
			item = item.sub_items[0];
		}

		// @ts-ignore
		return item;
	}

	get_row_indexes() {
		let row_indexes = [];

		if (this.sub_items[0] instanceof Row) {
			this.sub_items.forEach((item) => {
				row_indexes.push(item.idx);
			});
		}
		else {
			this.sub_items.forEach((item) => {
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

		const row_h = playlist_geo.row_h;
		let h_in_rows = Math.round(this.sub_items[0].h / row_h) * this.sub_items.length;
		this.sub_items.forEach((item) => {
			if (!item.is_collapsed) {
				h_in_rows += item.get_sub_items_total_h_in_rows();
			}
		});

		return h_in_rows;
	}

	has_selected_items() {
		// const is_function = typeof this.sub_items[0].has_selected_items === 'function';
		const isHeader = this.sub_items[0] instanceof BaseHeader;
		return this.sub_items.some(item => isHeader ? item.has_selected_items() : item.is_selected());
	}

	is_completely_selected() {
		const isHeader = this.sub_items[0] instanceof BaseHeader;
		return this.sub_items.every(item => isHeader ? item.is_completely_selected() : item.is_selected());
	}

	is_playing() {
		const is_function = typeof this.sub_items[0].is_playing === 'function';
		return this.sub_items.some(item => is_function ? item.is_playing() : item.is_playing);
	}

	is_focused() {
		const is_function = typeof this.sub_items[0].is_focused === 'function';
		return this.sub_items.some(item => is_function ? item.is_focused() : item.is_focused);
	}

	on_mouse_lbtn_dblclk(x, y, m) {
		plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.get_first_row().idx);
	}

	/**
	 * @return {number} float number
	 */
	get_duration() {
		let duration_in_seconds = 0;

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


/////////////////////
// * DISC HEADER * //
/////////////////////
class DiscHeader extends BaseHeader {
	constructor(parent, x, y, w, h, idx) {
		super(parent, x, y, w, h, idx);

		this.idx = idx;

		this.num_in_header = 0;
		// this.dont_draw = false;
		this.is_odd = false;    // TODO: Does this ever get set?

		this.disc_title = '';
	}

	/** @override */
	initialize_items(rows_with_data) {
		/** @type {Row[]} */
		this.sub_items = [];
		if (!rows_with_data.length) {
			return 0;
		}

		const first_data = rows_with_data[0][1];
		rows_with_data.every((item, i) => {
			if (first_data !== item[1]) {
				return false;	// Aborts the every
			}

			const row = item[0];

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

	// public:
	draw(gr, top, bottom) {
		gr.SetSmoothingMode(SmoothingMode.None);

		if (this.is_odd && g_properties.show_row_stripes) {
			gr.FillSolidRect(this.x, this.y + 1, this.w, this.h - 1, g_pl_colors.row_stripes_bg);
		}

		const cur_x = this.x + scaleForDisplay(20);
		const right_pad = scaleForDisplay(20);

		let title_font = g_pl_fonts.title_normal;
		let title_color = g_pl_colors.row_title_normal;

		if (this.is_selected()) {
			title_color = g_pl_colors.row_title_selected;
			title_font = g_pl_fonts.title_selected;
			gr.FillSolidRect(this.x, this.y, scaleForDisplay(8), this.h - 1, g_pl_colors.row_sideMarker);
		}

		const disc_header_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
		const disc_text = this.disc_title; // $('[Disc %discnumber% $if('+ tf.disc_subtitle+', \u2014 ,) ]['+ tf.disc_subtitle +']', that.sub_items[0].metadb);
		gr.DrawString(disc_text, title_font, title_color, cur_x, this.y, this.w, this.h, disc_header_text_format);
		const disc_w = Math.ceil(gr.MeasureString(disc_text, title_font, 0, 0, 0, 0).Width + 14);

		const tracks_text = `${this.sub_items.length} Track${this.sub_items.length > 1 ? 's' : ''} - ${utils.FormatDuration(this.get_duration())}`;

		const tracks_w = Math.ceil(gr.MeasureString(tracks_text, title_font, 0, 0, 0, 0).Width + 20);
		const tracks_x = this.x + this.w - tracks_w - right_pad;

		gr.DrawString(tracks_text, title_font, title_color, tracks_x, this.y, tracks_w, this.h, g_string_format.v_align_center | g_string_format.h_align_far);

		if (this.is_collapsed || !this.is_collapsed) {
			const line_y = Math.round(this.y + this.h / 2) + scaleForDisplay(4);
			gr.DrawLine(is_4k ? cur_x + disc_w + 5 : cur_x + disc_w - 5, line_y, is_4k ? this.x + this.w - tracks_w - 40 : this.x + this.w - tracks_w - 10, line_y, 1, g_pl_colors.row_disc_subheader_line);
		}
	}

	is_selected() {
		return this.sub_items.every(row => row.is_selected());
	}

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
		let duration_in_seconds = 0;

		this.sub_items.forEach(item => {
			duration_in_seconds += item.metadb.Length;
		});

		if (!duration_in_seconds) {
			return 0;
		}

		return duration_in_seconds;
	}
}


/**
 * @param {Array<Row>} rows_to_process
 * @param {FbMetadbHandleList} rows_metadb
 * @return {Array<Array>} Has the following format Array<[row,row_data]>
 */
DiscHeader.prepare_initialization_data = (rows_to_process, rows_metadb) => {
	const tfo = fb.TitleFormat(`$ifgreater(%totaldiscs%,1,[Disc %discnumber% $if(${tf.disc_subtitle}, \u2014 ,) ],)[${tf.disc_subtitle}]`);
	const disc_data = tfo.EvalWithMetadbs(rows_metadb);

	return zip(rows_to_process, disc_data);
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
DiscHeader.create_headers = (parent, x, y, w, h, prepared_rows, rows_to_process_count) => {
	function has_valid_data(rows_with_data, rows_to_check_count) {
		for (let i = 0; i < rows_to_check_count; ++i) {
			if (!isEmpty(rows_with_data[i][1])) {
				return true;
			}
		}
		return false;
	}

	if (!has_valid_data(prepared_rows, rows_to_process_count)) {
		trimArray(prepared_rows, rows_to_process_count, true);
		return [];
	}

	const prepared_rows_copy = Object.assign(Object.create(prepared_rows));
	prepared_rows_copy.length = rows_to_process_count;

	let header_idx = 0;
	const headers = [];
	const start_length = prepared_rows_copy.length;
	while (prepared_rows_copy.length) {
		const header = new DiscHeader(parent, x, y, w, h, header_idx);
		const processed_items = header.initialize_items(prepared_rows_copy);

		trimArray(prepared_rows_copy, processed_items, true);

		headers.push(header);
		++header_idx;
	}

	trimArray(prepared_rows, rows_to_process_count, true);

	return headers;
};


////////////////
// * HEADER * //
////////////////
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
		this.metadb = undefined;
		/**
		 * @type {?GdiBitmap}
		 * undefined > Not Loaded; null > Loaded & Not Found; !isNil > Loaded & Found
		 */
		this.art = undefined;
		this.grouping_handler = Header.grouping_handler;

		this.hyperlinks = {};
		this.hyperlinks_initialized = false;
		this.was_playing = undefined; // Last value of this.is_playing() updated each draw cycle

		this.header_image = undefined;
	}

	/** @override */
	initialize_items(rows_with_data) {
		this.sub_items = [];

		const rows_with_header_data = rows_with_data[0];
		if (!rows_with_header_data.length) {
			return 0;
		}

		const first_data = rows_with_header_data[0][1];

		const owned_rows = [];
		for (let i = 0; i < rows_with_header_data.length; i++) {
			if (first_data !== rows_with_header_data[i][1]) {
				break;
			}
			owned_rows.push(rows_with_header_data[i][0]);
		}

		this.metadb = owned_rows[0].metadb;

		let sub_headers = [];
		if (g_properties.show_disc_header && this.grouping_handler.show_disc()) {
			const rows_with_discheader_data = rows_with_data[1];
			sub_headers = this.create_disc_headers(rows_with_discheader_data, owned_rows.length);
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
	}

	/**
	 * @param {Array} prepared_rows
	 * @param {number} rows_to_proccess_count
	 * @return {Array<DiscHeader>}
	 */
	create_disc_headers(prepared_rows, rows_to_proccess_count) {
		return DiscHeader.create_headers(this, this.x, 0, this.w, playlist_geo.row_h, prepared_rows, rows_to_proccess_count);
	}

	getGroupInfoString(is_radio, hasGenreTags) {
		const bitspersample = Number($('$info(bitspersample)', this.metadb));
		const samplerate = Number($('$info(samplerate)', this.metadb));
		const sample = ((bitspersample > 16 || samplerate > 44100 || settings.playlistShowBitSampleAlways) ? $(' [$info(bitspersample)bit/]', this.metadb) + samplerate / 1000 + 'khz' : '');
		const formatAiffWav = 'aiff' || 'wav';
		let codec = formatAiffWav ? $('$upper($ext(%path%))', this.metadb) : $('$if2(%codec%,$ext(%path%))', this.metadb);

		if (codec === 'dca (dts coherent acoustics)') {
			codec = 'dts';
		}
		if (codec === 'cue') {
			codec = $('$ext($info(referenced_file))', this.metadb);
		}
		else if (codec === 'mpc') {
			codec += $('[-$info(codec_profile)]', this.metadb).replace('quality ', 'q');
		}
		else if (['dts', 'ac3', 'atsc a/52'].includes(codec)) {
			codec += $("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%", this.metadb) + ' kbps';
			codec = codec.replace('atsc a/52', 'Dolby Digital');
		}
		else if ($('$info(encoding)', this.metadb) === 'lossy') {
			codec += $('$info(codec_profile)', this.metadb) === 'CBR' ? $('[-%bitrate% kbps]', this.metadb) : $('[-$info(codec_profile)]', this.metadb);
		}
		if (codec) {
			codec += sample;
		}
		else {
			codec = (this.metadb.RawPath.startsWith('3dydfy:') || this.metadb.RawPath.startsWith('fy+')) ? 'yt' : this.metadb.Path;
		}

		let track_count = this.sub_items.length;
		let has_discs = false;
		if (this.sub_items[0] instanceof DiscHeader) {
			track_count = 0;
			has_discs = true;
			this.sub_items.forEach(discHeader => {
				track_count += discHeader.sub_items.length;
			});
		}

		const disc_number = (!this.grouping_handler.show_disc() && $('[%totaldiscs%]', this.metadb) !== '1') ? $('[ | Disc: %discnumber%[/%totaldiscs%]]', this.metadb) : '';
		const track_text = is_radio ? '' : ' | ' +
				(this.grouping_handler.show_disc() && has_discs ? this.sub_items.length + ' Discs - ' : '') +
				track_count + (track_count === 1 ? ' Track' : ' Tracks');
		let info_text = $(codec + disc_number + '[ | %replaygain_album_gain%]', this.metadb) + track_text;
		if (hasGenreTags) {
			info_text = ` | ${info_text}`;
		}
		if (this.get_duration()) {
			info_text += ` | Time: ${utils.FormatDuration(this.get_duration())}`;
		}

		// * Use custom playlist header info if pattern was defined in the config file
		const customInfoText = $(settings.playlistCustomHeaderInfo, this.metadb);
		if (customInfoText !== '') {
			return ` | ${customInfoText}`;
		}

		return info_text;
	}

	/** @override */
	draw(gr, top, bottom) {
		if (this.w <= 0 || this.h <= 0) return;
		// drawProfiler = fb.CreateProfiler('Header.draw items:' + this.sub_items.length);
		if (g_properties.use_compact_header) {
			this.draw_compact_header(gr);
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
		let clipImg = gdi.CreateImage(this.w, this.h);
		const grClip = clipImg.GetGraphics();
		const scrollbar = g_properties.show_scrollbar && playlist.is_scrollbar_available;

		if (!this.hyperlinks_initialized) {
			this.initialize_hyperlinks(gr);
		}
		let cache_header = true;  // Caching is a lot faster, but need to handle artwork loading
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
		if (!cache_header || !this.header_image || this.clearCachedHeaderImg) {
			let artist_color = g_pl_colors.header_artist_normal;
			let album_color = g_pl_colors.header_album_normal;
			let info_color = g_pl_colors.header_info_normal;
			let date_color = g_pl_colors.header_date_normal;
			let line_color = g_pl_colors.header_line_normal;
			let artist_font = g_pl_fonts.artist_normal;
			const date_font = g_pl_fonts.date;
			const updatedNowpBg = g_pl_colors.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing

			if (this.is_playing() && updatedNowpBg) {
				artist_color = g_pl_colors.header_artist_playing;
				album_color = g_pl_colors.header_album_playing;
				info_color = g_pl_colors.header_info_playing;
				date_color = g_pl_colors.header_date_playing;
				line_color = g_pl_colors.header_line_playing;
				artist_font = g_pl_fonts.artist_playing;

				if (lightBg && pref.theme === 'black') {
					artist_color = RGB(0, 0, 0);
					album_color = RGB(20, 20, 20);
					info_color = RGB(20, 20, 20);
					date_color = RGB(20, 20, 20);
				} else if (lightBg && pref.theme === 'white' && pref.layout !== 'default') {
					artist_color  = RGB(60, 60, 60);
					album_color = RGB(60, 60, 60);
					info_color = RGB(60, 60, 60);
					date_color = RGB(60, 60, 60);
					line_color = RGB(100, 100, 100);
				}
			}

			if (!pref.styleBlend) grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.bg); // Solid background for ClearTypeGridFit text rendering

			// if (this.hasSelection && ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
			// 	grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.row_selection_bg);
			// }

			if (this.is_playing() && updatedNowpBg) {
				const p = scaleForDisplay(6);  // From art below

				if (pref.theme === 'white' && !pref.styleBlackAndWhite && !pref.styleBlackAndWhite2 && pref.layout === 'default' || (pref.theme === 'reborn' || pref.theme === 'random') && noAlbumArtStub) {
					grClip.FillSolidRect(0, p, scaleForDisplay(8), this.h - p * 2, g_pl_colors.header_nowplaying_bg);
				}
				else {
					grClip.FillSolidRect(0, 0, scrollbar ? this.w - scaleForDisplay(12) : this.w, this.h * 2, g_pl_colors.header_nowplaying_bg);
				}
				if (pref.theme === 'white' && (pref.styleBlackAndWhite || pref.styleBlackAndWhite2) || !['white', 'black', 'cream'].includes(pref.theme)) {
					grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, g_pl_colors.header_sideMarker);
				}
			}

			// * Need to apply text rendering AntiAliasGridFit when using style Blend or when using custom theme fonts with larger font sizes
			grClip.SetTextRenderingHint(pref.styleBlend || pref.customThemeFonts && headerFontSize > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

			if (this.is_collapsed && this.is_focused() || this.is_completely_selected() && g_properties.auto_collapse) {
				grClip.DrawRect(-1, 0, this.w + 1, this.h - 1, 1, line_color);
				grClip.FillSolidRect(0, 0, scaleForDisplay(8), this.h, g_pl_colors.header_sideMarker);
			}

			//************************************************************//

			let left_pad = scaleForDisplay(10) + (this.art === null && g_properties.auto_album_art || !g_properties.show_album_art ? scaleForDisplay(10) : 0);

			// * ARTBOX * //
			if (g_properties.show_album_art) {
				if (!this.is_art_loaded()) {
					const cached_art = Header.art_cache.get_image_for_meta(this.metadb);
					if (cached_art) {
						this.assign_art(cached_art);
					}
				}

				if (this.art !== null || !g_properties.auto_album_art) {
					const p = scaleForDisplay(6);
					const spacing = scaleForDisplay(2);

					const art_box_size = this.art_max_size + spacing * 2;
					const art_box_x = p * 3;
					let art_box_y = p;
					let art_box_w = art_box_size;
					let art_box_h = art_box_size;

					if (this.art) {
						const art_x = art_box_x + spacing;
						let art_y = art_box_y + spacing;
						const art_h = this.art.Height;
						const art_w = this.art.Width;
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
						grClip.DrawString('LOADING', g_pl_fonts.cover, this.is_playing() ? artist_color : g_pl_colors.row_title_normal, art_box_x, art_box_y, art_box_size, art_box_size, g_string_format.align_center);
						cache_header = false;   // Don't cache until artwork is loaded
					}
					else { // null
						const is_radio = this.metadb.RawPath.startsWith('http') || this.metadb.Path.startsWith('spotify');
						grClip.DrawString(isStreaming && is_radio ? 'LIVE\n ON AIR' : 'NO COVER', g_pl_fonts.cover, this.is_playing() ? artist_color : g_pl_colors.row_title_normal, art_box_x, art_box_y, art_box_size, art_box_size, g_string_format.align_center);
					}

					// * Used for Library thumbnail size
					playlistThumbSize = art_box_w - 4;

					grClip.DrawRect(art_box_x, art_box_y, art_box_w - 1, art_box_h - 1, 1, line_color);

					left_pad += art_box_x + art_box_w;
					this.hyperlinks.artist && this.hyperlinks.artist.set_xOffset(left_pad);
					this.hyperlinks.album && this.hyperlinks.album.set_xOffset(left_pad);
					let i = 0;
					let offset = 0;
					while (this.hyperlinks['genre' + i]) {
						if (i === 0) {
							offset = this.hyperlinks.genre0.x - left_pad;
							if (!offset) break;
						}
						this.hyperlinks['genre' + i].x -= offset;
						i++;
					}
				}
				else if (this.art === null && g_properties.auto_album_art) {
					this.hyperlinks.artist && this.hyperlinks.artist.set_xOffset(left_pad);
					this.hyperlinks.album && this.hyperlinks.album.set_xOffset(left_pad);
					this.hyperlinks.genre0 && this.hyperlinks.genre0.set_xOffset(left_pad);
				}
			}

			//************************************************************//

			const is_radio = this.metadb.RawPath.startsWith('http') || this.metadb.Path.startsWith('spotify');

			// * Part1: Artist
			// * Part2: Album + line + Date OR line
			// * Part3: Info OR album
			const part1_cur_x = left_pad;
			let part2_cur_x = left_pad;
			let part3_cur_x = left_pad;

			const part_h = !g_properties.show_group_info ? this.h / 2 : this.h / 3;
			let part2_right_pad = 0;

			// * DATE * //
			if (this.grouping_handler.show_date()) {
				const date_query = pref.showPlaylistFullDate ? tf.date : tf.year;
				const date_text = $(date_query, this.metadb);
				if (date_text && date_text !== '0000') {
					const date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
					const date_x = this.w - date_w;

					if (!this.hyperlinks.date && date_x > left_pad) {
						const date_y = 0;
						const date_h = this.h - 4;
						grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, g_string_format.v_align_center);
					} else {
						this.hyperlinks.date.draw(grClip, date_color);
					}

					part2_right_pad += this.w - date_x;
				}
			}

			// * ARTIST * //
			if (this.grouping_handler.get_title_query()) {
				let artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
				if (!artist_text && is_radio) {
					artist_text = 'Radio Stream';
				}
				if (artist_text) {
					const artist_x = part1_cur_x;
					let artist_w = this.w - artist_x;
					let artist_h = part_h;
					if (!g_properties.show_group_info) {
						artist_w -= part2_right_pad + 5;
						artist_h -= 5;
					}

					const artist_text_format = g_string_format.v_align_far | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
					if (is_radio || !this.hyperlinks.artist)  {
						grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format);
					} else {
						this.hyperlinks.artist.draw(grClip, artist_color);
					}
					// part1_cur_x += artist_w;
				}
			}

			// * ALBUM * //
			if (this.grouping_handler.get_sub_title_query()) {
				const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
				if (album_text) {
					const album_h = part_h;
					let album_y = part_h;
					let album_x;
					if (g_properties.show_group_info) {
						album_x = part2_cur_x;
					}
					else {
						album_y += 5;
						album_x = part3_cur_x;
					}
					const album_w = this.w - album_x - (part2_right_pad + 5);

					let album_text_format = g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
					if (g_properties.show_group_info) {
						album_text_format |= g_string_format.v_align_center;
					}

					if (!this.hyperlinks.album) {
						grClip.DrawString(album_text, g_pl_fonts.album, album_color, album_x, album_y, album_w, album_h, album_text_format);
					} else {
						this.hyperlinks.album.draw(grClip, album_color);
					}

					const album_text_w = Math.ceil(
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

			// * INFO * //
			if (g_properties.show_group_info) {
				const info_x = part3_cur_x;
				const info_y = 2 * part_h - (is_4k ? 5 : 0);
				const info_h = part_h; //row_h;
				const info_w = this.w - info_x;
				const info_text_format = g_string_format.trim_ellipsis_char | g_string_format.no_wrap;

				// * Genres
				let genre_text_w = 0;
				const extraGenreSpacing = 0; // Don't use scaleForDisplay due to font differences
				let genreX = info_x;
				if (!is_radio && this.grouping_handler.get_query_name() !== 'artist') {
					if (!this.hyperlinks.genre0) {
						const genre_text = $('[%genre%]', this.metadb).replace(/, /g, ' \u2022 ');
						genre_text_w = Math.ceil(gr.MeasureString(genre_text, g_pl_fonts.info, 0, 0, 0, 0).Width + extraGenreSpacing);
						grClip.DrawString(genre_text, g_pl_fonts.info, info_color, genreX, info_y, info_w, info_h, info_text_format);
					} else {
						let i = 0;
						let genre_hyperlink;
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

				const info_text = this.getGroupInfoString(is_radio, genre_text_w > 0);
				const info_text_w = Math.ceil(gr.MeasureString(info_text, g_pl_fonts.info, 0, 0, 0, 0).Width); // TODO: Mordred - should only call MeasureString once
				if (genre_text_w) {
					grClip.DrawString(info_text, g_pl_fonts.info, info_color, genreX + genre_text_w, info_y + 1, info_w - (genreX - info_x) - genre_text_w - scaleForDisplay(20), info_h, info_text_format);
				}

				// * Record labels
				if (!this.hyperlinks.label0) {
					const label_string = $('$if2(%label%,[%publisher%])', this.metadb).replace(/, /g, ' \u2022 ');
					const label_w = Math.ceil(gr.MeasureString(label_string, g_pl_fonts.info, 0, 0, 0, 0).Width + 10);
					if (info_w > label_w + info_text_w) {
						grClip.DrawString(label_string, g_pl_fonts.info, info_color, this.w - label_w - 10, info_y, label_w, info_h, g_string_format.h_align_far);
					}
				} else {
					let i = 0;
					let drawCount = 0;
					let lastLabel;
					while (this.hyperlinks['label' + i]) {
						const label_hyperlink = this.hyperlinks['label' + i];
						if (label_hyperlink.x > genreX + genre_text_w + info_text_w) {
							if (drawCount > 0) {
								grClip.DrawString(' \u2022', g_pl_fonts.info, info_color, lastLabel.x + lastLabel.getWidth(), info_y, scaleForDisplay(20), info_h);
							}
							label_hyperlink.draw(grClip, info_color);
							drawCount++;
						}
						lastLabel = label_hyperlink;    // We want to draw bullet AFTER the previous label
						i++;
					}
				}

				// * Info line
				const info_text_h = Math.ceil(gr.MeasureString(info_text, g_pl_fonts.info, 0, 0, 0, 0).Height + 5);
				const line_x1 = left_pad;
				const line_x2 = this.w - scaleForDisplay(20);
				const line_y = info_y + info_text_h;
				if (line_x2 - line_x1 > 0) {
					grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
				}
			}

			// * PART 2 ALBUM LINE
			{
				let line_x1 = part2_cur_x;
				if (line_x1 !== left_pad) {
					line_x1 += is_4k ? 20 : 9;
				}

				const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
				const album_height = gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Height;
				const date_query = pref.showPlaylistFullDate ? tf.date : tf.year;
				const date_text = $(date_query, this.metadb);
				const date_height = gr.MeasureString(date_text, g_pl_fonts.date, 0, 0, 0, 0).Height;
				const line_x2 = this.w - part2_right_pad - (date_text ? (is_4k ? 58 : 25) : scaleForDisplay(20));
				const line_y = !g_properties.show_group_info ? Math.round(this.h / 2) :
					pref.customThemeFonts ? Math.floor(this.h / 2 + (date_height - album_height)) :
					Math.round(this.h / 2) + scaleForDisplay(is_4k ? 7 : 6) +
					// Y-corrections
					(headerFontSize === 22  ? is_4k ? -4 : -1 :
					 headerFontSize === 20  ? is_4k ? -5 :  0 :
					 headerFontSize === 18  ? is_4k ? -5 : -1 :
					 headerFontSize === 17  ? is_4k ? -4 :  1 :
					 headerFontSize === 16  ? is_4k ? -3 : -1 :
					 headerFontSize === 15  ? is_4k ? -4 :  0 :
					 headerFontSize === 14 && is_4k ? -4 :
					 headerFontSize === 13 && is_4k ? -3 :
					 headerFontSize === 12 && is_4k ? -5 :
					 headerFontSize === 10 && is_4k ? -2 :
					 headerFontSize &&  !is_4k < 15 ? -1 :
					0);

				if (line_x2 - line_x1 > 0) {
					grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
				}
			}

			clipImg.ReleaseGraphics(grClip);
			if (cache_header) {
				this.header_image = clipImg;
			}
		}

		let y = this.y;
		let h = this.h;
		let srcY = 0;
		if (this.y < top) {
			y = top;
			h = this.h - (top - this.y);
			srcY = this.h - h;
		} else if (this.y + this.h > bottom) {
			h = bottom - this.y;
		}
		gr.DrawImage(cache_header ? this.header_image : clipImg, this.x, y, this.w, h, 0, srcY, this.w, h);
		if (this.is_completely_selected() && (pref.theme === 'white' || pref.theme === 'black')) {
			gr.SetSmoothingMode(SmoothingMode.None);
			gr.FillSolidRect(this.x, y + scaleForDisplay(6), 0, h, col.primary);
			gr.SetSmoothingMode(SmoothingMode.HighQuality);
		}
		clipImg = null;
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw_compact_header(gr) {
		let artist_color = g_pl_colors.header_artist_normal;
		let album_color = g_pl_colors.header_album_normal;
		let date_color = g_pl_colors.header_date_normal;
		let line_color = g_pl_colors.header_line_normal;
		let artist_font = g_pl_fonts.artist_normal_compact;
		const date_font = g_pl_fonts.date_compact;
		const updatedNowpBg = g_pl_colors.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing
		const scrollbar = g_properties.show_scrollbar && playlist.is_scrollbar_available;

		if (this.is_playing() && updatedNowpBg) {
			artist_color = g_pl_colors.header_artist_playing;
			album_color = g_pl_colors.header_album_playing;
			date_color = g_pl_colors.header_date_playing;
			line_color = g_pl_colors.header_line_playing;
			artist_font = g_pl_fonts.artist_playing_compact;

			if (lightBg && (pref.theme === 'white' || pref.theme === 'black')) {
				artist_color = RGB(0, 0, 0);
				album_color = RGB(20, 20, 20);
				date_color = RGB(20, 20, 20);
			}
			else if (!lightBg && (pref.theme === 'white' || pref.theme === 'black')) {
				artist_color = RGB(240, 240, 240);
				album_color = RGB(220, 220, 220);
				date_color = RGB(220, 220, 220);
			}
		}

		const clipImg = gdi.CreateImage(this.w, this.h);
		const grClip = clipImg.GetGraphics();

		//--->
		if (!pref.styleBlend) grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.bg); // Solid background for ClearTypeGridFit text rendering
		// if (this.has_selected_items() && ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
		// 	grClip.FillSolidRect(0, 0, this.w, this.h, g_pl_colors.row_selection_bg);
		// }

		if (this.is_playing() && updatedNowpBg) {
			grClip.FillSolidRect(0, 0, scrollbar ? this.w - scaleForDisplay(12) : this.w, this.h, g_pl_colors.header_nowplaying_bg);
			grClip.FillSolidRect(0, 0, ['white', 'black', 'cream'].includes(pref.theme) ? 0 : scaleForDisplay(8), this.h, g_pl_colors.header_sideMarker);
		}

		// * Need to apply text rendering AntiAliasGridFit when using style Blend or when using custom theme fonts with larger font sizes
		grClip.SetTextRenderingHint(pref.styleBlend || pref.customThemeFonts && headerFontSize > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

		if (this.is_collapsed && this.is_focused()) {
			grClip.DrawRect(-1, 0, this.w + 1, this.h - 1, 1, line_color);
		}

		//************************************************************//

		const is_radio = this.metadb.RawPath.startsWith('http');

		const left_pad = scaleForDisplay(20);
		let right_pad = 0;
		let cur_x = left_pad;

		// * Date
		if (this.grouping_handler.show_date()) {
			const date_query = pref.showPlaylistFullDate ? tf.date : tf.year;
			const date_text = $(date_query, this.metadb);
			if (date_text) {
				const date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
				const date_x = this.w - date_w - scaleForDisplay(12);
				const date_y = 0;
				const date_h = this.h;

				if (date_x > left_pad) {
					grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, g_string_format.v_align_center);
				}

				right_pad += this.w - date_x;
			}
		}

		// * Artist
		if (this.grouping_handler.get_title_query()) {
			let artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			if (!artist_text) {
				artist_text = is_radio ? 'Radio Stream' : '?';
			}

			if (artist_text) {
				const artist_x = cur_x;
				const artist_w = this.w - artist_x - (right_pad + 5);
				const artist_h = this.h;

				const artist_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
				grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format);

				cur_x += Math.ceil(
					/** @type {!number} */
					gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width
				);
			}
		}

		// * Album
		if (this.grouping_handler.get_sub_title_query()) {
			let album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
			if (album_text) {
				album_text = ` - ${album_text}`;

				const album_h = this.h;
				const album_x = cur_x;
				const album_w = this.w - album_x - (right_pad + scaleForDisplay(40));

				const album_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
				grClip.DrawString(album_text, g_pl_fonts.album, album_color, album_x, 0, album_w, album_h, album_text_format);

				// cur_x += gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width;
			}
		}

		clipImg.ReleaseGraphics(grClip);
		gr.DrawImage(clipImg, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);

		// * Callbacks for headerTooltip
		this.artist_w_compact = this.w - cur_x - (right_pad + 5);
		this.album_w_compact = this.w - cur_x - (right_pad + scaleForDisplay(40));
		this.artist_text_w_compact = gr.MeasureString($(this.grouping_handler.get_title_query(), this.metadb), artist_font, 0, 0, 0, 0).Width;
		this.album_text_w_compact = gr.MeasureString($(this.grouping_handler.get_sub_title_query(), this.metadb), g_pl_fonts.album, 0, 0, 0, 0).Width;
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
			const ratio = image.Height / image.Width;
			let art_h = this.art_max_size;
			let art_w = this.art_max_size;
			if (image.Height > image.Width) {
				art_w = Math.round(art_h / ratio);
			}
			else {
				art_h = Math.round(art_w * ratio);
			}

			try { // Prevent crash if album art is corrupt, file format is not supported or has an unusual ICC profile embedded
				this.art = image.Resize(art_w, art_h);
			} catch (e) {
				console.log('<Error: Album art in Playlist could not be scaled! Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded>');
			}
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
		const date_font = g_pl_fonts.date;
		const artist_font = g_pl_fonts.artist_normal;
		const art_box_x = 3 * scaleForDisplay(6);
		const spacing = scaleForDisplay(2);
		const art_box_size = this.art_max_size + spacing * 2;
		const part_h = this.h / 3;
		const right_edge = scaleForDisplay(20);
		let left_pad = scaleForDisplay(10);
		left_pad += this.art !== null && g_properties.show_album_art && !g_properties.auto_album_art ? art_box_x + art_box_size : left_pad;
		this.hyperlinksMaxWidth = pref.showPlaylistFullDate ? this.w - scaleForDisplay(320) : this.w - scaleForDisplay(240); // Max allowed container width of hyperlinks = width - largest size of date_w

		// * Date
		const date_query = pref.showPlaylistFullDate ? tf.date : tf.year;
		const date_text = $(date_query, this.metadb);
		if (date_text) {
			const date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
			const date_x = -date_w - right_edge + (is_4k ? 5 : 7);
			const date_y = !g_properties.show_group_info ? part_h : part_h - (is_4k ? pref.customThemeFonts ? 1 : 3 : pref.customThemeFonts ? -1 : 0) +
			// Y-corrections
			(is_4k && headerFontSize === 20 || is_4k && headerFontSize === 18 || is_4k && headerFontSize === 13 || is_4k && headerFontSize === 12 ? -1 : is_4k && headerFontSize === 16 ? 1 : 0) +
			(!is_4k && headerFontSize < 15 ? 1 : 0) + (!is_4k && headerFontSize === 20 ? 2 : 0);

			this.hyperlinks.date = new Hyperlink(date_text, date_font, 'date', date_x, date_y, this.w, true);
		}

		// * Artist
		let artist_text;
		if (!this.metadb.RawPath.startsWith('http')) {
			// Don't create for radio
			artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			if (artist_text) {
				const artist_x = left_pad;

				this.hyperlinks.artist = new Hyperlink(artist_text, artist_font, 'artist', artist_x, scaleForDisplay(5 * (!g_properties.show_group_info ? 2 : 1)), this.hyperlinksMaxWidth, true);
			}
		}

		// * Album
		const album_y = part_h * (!g_properties.show_group_info ? 1.5 : 1) + ((is_4k || is_QHD && headerFontSize === 17 ? 5 : 4) * (!g_properties.show_group_info ? 2 : 1));
		const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
		if (album_text) {
			this.hyperlinks.album = new Hyperlink(album_text, g_pl_fonts.album, 'album', left_pad, album_y, this.hyperlinksMaxWidth, true);
		}

		// * Record labels
		const separatorWidth = gr.MeasureString(' \u2020', g_pl_fonts.info, 0, 0, 0, 0).Width;
		const bulletWidth = Math.ceil(gr.MeasureString('\u2020', g_pl_fonts.info, 0, 0, 0, 0).Width);
		const spaceWidth = Math.ceil(separatorWidth - bulletWidth) + scaleForDisplay(1);

		let labels = [];
		for (let i = 0; i < tf.labels.length; i++) {
			labels.push(...getMetaValues(tf.labels[i], this.metadb));
		}
		labels = [...new Set(labels)];	// Remove duplicates
		let label_left = -right_edge * 2 + (is_4k ? 42 : 20);
		const label_y = Math.round(2 * this.h / 3) - (is_4k ? 4 : -1);
		for (let i = labels.length - 1; i >= 0; --i) {
			if (i !== labels.length - 1) {
				label_left -= (bulletWidth + spaceWidth * 2);   // Spacing between labels
			}
			const label_w = gr.MeasureString(labels[i], g_pl_fonts.info, 0, 0, 0, 0).Width;
			label_left -= label_w;
			this.hyperlinks['label' + i] = new Hyperlink(labels[i], g_pl_fonts.info, 'label', label_left, label_y, this.w, true);
		}

		// * Genres
		const genres = getMetaValues('%genre%', this.metadb);
		let genre_left = left_pad;
		const genre_y = label_y;
		for (let i = 0; i < genres.length; i++) {
			if (i > 0) {
				genre_left += bulletWidth + spaceWidth * 2;   // Spacing between genres
			}
			const genre_w = gr.MeasureString(genres[i], g_pl_fonts.info, 0, 0, 0, 0).Width;
			this.hyperlinks['genre' + i] = new Hyperlink(genres[i], g_pl_fonts.info, 'genre', genre_left, genre_y, this.w, true);
			genre_left += genre_w;
		}

		for (const h in this.hyperlinks) {
			this.hyperlinks[h].set_y(this.y);
		}

		// * Callbacks for headerTooltip
		this.artist_text_w = gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width;
		this.album_text_w = gr.MeasureString(album_text, g_pl_fonts.album, 0, 0, 0, 0).Width;

		this.hyperlinks_initialized = true;
	}

	on_mouse_move(x, y, m) {
		let handled = false;
		let needs_redraw = false;

		for (const h in this.hyperlinks) {
			if (this.hyperlinks[h].trace(x - this.x, y)) {
				if (this.hyperlinks[h].state !== HyperlinkStates.Hovered) {
					this.hyperlinks[h].state = HyperlinkStates.Hovered;
					needs_redraw = true;
				}
				handled = true;
			}
			else if (this.hyperlinks[h].state !== HyperlinkStates.Normal) {
				this.hyperlinks[h].state = HyperlinkStates.Normal;
				needs_redraw = true;
			}
		}

		if (needs_redraw) {
			this.clearCachedHeaderImg();
			this.repaint();
		}

		return handled;
	}

	on_mouse_lbtn_down(x, y, m) {
		for (const h in this.hyperlinks) {
			if (this.hyperlinks[h].trace(x - this.x, y)) {
				this.hyperlinks[h].click();
				return true;
			}
		}
		return false;
	}

	set_x(x) {
		ListItem.prototype.set_x.apply(this, [x]);
	}

	set_y(y) {
		ListItem.prototype.set_y.apply(this, [y]);

		for (const h in this.hyperlinks) {
			this.hyperlinks[h].set_y(y);
		}
	}

	set_w(w) {
		ListItem.prototype.set_w.apply(this, [w]);

		this.sub_items.forEach((item) => {
			item.set_w(w);
		});

		for (const h in this.hyperlinks) {
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

	// * Playlist group header truncated text tooltip
	headerTooltip() {
		if (pref.showTooltipMain || pref.showTooltipTruncated) {
			if (displayCustomThemeMenu && displayBiography) return; // Overlayed by custom theme menu

			const artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);

			if (this.artist_text_w > this.hyperlinksMaxWidth || this.album_text_w > this.hyperlinksMaxWidth ||
				g_properties.use_compact_header && (this.artist_text_w_compact > this.artist_w_compact || this.album_text_w_compact > this.album_w_compact)) {
				tt.showDelayed(`${artist_text}\n${album_text}`);
			} else {
				tt.stop();
			}
		}
	}
}


/**
 * @param {Array<Row>} rows_to_process
 * @param {FbMetadbHandleList} rows_metadb
 * @return {Array} Has the following format [Array<[row,row_data]>, disc_header_prepared_data]
 */
Header.prepare_initialization_data = (rows_to_process, rows_metadb) => {
	let query = Header.grouping_handler.get_query();
	if (g_properties.show_disc_header && query && Header.grouping_handler.show_disc()) {
		query = query.replace(/%discnumber%/, '').replace(/%totaldiscs%/, '').replace(/%subtitle%/, '');
	}

	const tfo = fb.TitleFormat(query || ''); // Workaround a bug, because of which '' is sometimes treated as null :\
	const rows_data = tfo.EvalWithMetadbs(rows_metadb);

	const prepared_disc_data = g_properties.show_disc_header ? DiscHeader.prepare_initialization_data(rows_to_process, rows_metadb) : [];

	return [zip(rows_to_process, rows_data), prepared_disc_data];
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
Header.create_headers = (parent, x, y, w, h, prepared_rows) => {
	const prepared_header_rows = prepared_rows[0];

	let header_idx = 0;
	const headers = [];
	while (prepared_header_rows.length) {
		const header = new Header(parent, x, y, w, h, header_idx);
		const processed_rows_count = header.initialize_items(prepared_rows);

		trimArray(prepared_header_rows, processed_rows_count, true);

		headers.push(header);
		++header_idx;
	}

	return headers;
};


/////////////
// * ROW * //
/////////////
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

		// * Const after header creation
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

		// * State
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

		// * Playlist row hover
		this.title_color = g_pl_colors.row_title_normal;

		/** @enum {number} */
		const rowState = {
			normal:  0,
			hovered: 1,
			pressed: 2
		};

		/**
		 * @param {rowState} item
		 */
		this.changeRowState = function (item) {
			switch (item) {
				case rowState.normal: {
					this.title_color = g_pl_colors.row_title_normal;
					break;
				}
				case rowState.hovered: {
					this.title_color = g_pl_colors.row_title_hovered;
					break;
				}
				case rowState.pressed: {
					this.title_color = g_pl_colors.row_title_selected;
					break;
				}
			}
		};

		this.trace = function (x, y) {
			return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
		};

		this.on_mouse_move = function (x, y, m) {
			if (pref.playlistRowHover && loadingThemeComplete) {
				this.changeRowState(this.trace(x, y) ? rowState.hovered : rowState.normal);
			}
		};
	}

	// public:
	draw(gr) {
		gr.SetSmoothingMode(SmoothingMode.None);

		if (this.is_odd && g_properties.show_row_stripes) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.row_stripes_bg);
		}

		let title_font = g_pl_fonts.title_normal;
		const title_artist_font = g_pl_fonts.title_selected;
		let title_artist_color = g_pl_colors.row_title_selected;
		const scrollbar = g_properties.show_scrollbar && playlist.is_scrollbar_available;

		if (!pref.playlistRowHover) this.title_color = g_pl_colors.row_title_normal;

		if (this.is_selected()) {
			this.title_color = g_pl_colors.row_title_selected;
			title_font = g_pl_fonts.title_selected;
			title_artist_color = g_pl_colors.row_title_normal;

			// if (g_properties.show_row_stripes) { // Don't need this!?
			// 	// Last item is cropped
			// 	const rect_h = this.is_cropped ? this.h - 1 : this.h;
			// 	gr.DrawRect(this.x, this.y, this.w, rect_h, 1, g_pl_colors.row_selection_frame_cropped);
			// }

			// if (['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
			// 	gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.row_selection_bg);
			// }
			if (!this.is_playing) { // Do not draw selection on now playing to prevent 1px overlapping
				gr.DrawRect(this.x, this.is_playing ? this.y - 1 : this.y, scrollbar ? this.w - (is_4k ? 25 : 13) : this.w, this.h, 1, g_pl_colors.row_selection_frame);
				// Hide DrawRect 1px gaps when all songs are completely selected
				gr.DrawRect(this.x, this.is_playing ? this.y - 1 : this.y, scaleForDisplay(7), this.h, 1, g_pl_colors.row_sideMarker);
				gr.FillSolidRect(this.x, this.y, scaleForDisplay(8), this.h, g_pl_colors.row_sideMarker);
			}
		}

		if (this.is_playing && g_pl_colors.row_nowplaying_bg !== '') { // * Wait until nowplaying bg has a new color to prevent flashing
			this.title_color = g_pl_colors.row_title_playing;
			title_font = g_pl_fonts.title_playing;

			const bg_color = g_pl_colors.row_nowplaying_bg;
			gr.FillSolidRect(this.x, this.y, scrollbar ? this.w - scaleForDisplay(12) : this.w, this.h, bg_color);
			if (colorDistance(bg_color, title_artist_color) < 195) {
				title_artist_color = this.title_color;
			}

			if (lightBg && (pref.theme === 'white' && !pref.styleBlackAndWhite && !pref.styleBlackAndWhite2 || pref.theme === 'black')) {
				this.title_color = RGB(20, 20, 20);
				title_artist_color = RGB(0, 0, 0);
			}
			if (!lightBg && pref.theme === 'white' && !pref.styleBlackAndWhite && !pref.styleBlackAndWhite2 && !isStreaming && pref.layout === 'default') {
				this.title_color = RGB(240, 240, 240);
				title_artist_color = RGB(220, 220, 220);
			}
			if (pref.theme === 'white' && (pref.styleBlackAndWhite || pref.styleBlackAndWhite2) || !['white', 'black', 'cream'].includes(pref.theme)) {
				gr.FillSolidRect(this.x, this.y, scaleForDisplay(8), this.h, g_pl_colors.row_sideMarker);
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

		const is_radio = this.metadb.RawPath.startsWith('http');

		const right_spacing = scaleForDisplay(20);
		let cur_x = this.x + right_spacing;
		let right_pad = scaleForDisplay(20);
		const testRect = false;

		if ($('$ifgreater(%totaldiscs%,1,true,false)', this.metadb) !== 'false') {
			cur_x += scaleForDisplay(0);
		}

		// * LENGTH
		{
			if (this.length_text == null) {
				this.length_text = $('[%length%]', this.metadb);
			}
			this.length_text = this.is_playing && pref.playlistTimeRemaining ? $('[-%playback_time_remaining%]') : $('[%length%]', this.metadb);

			const length_w = scaleForDisplay(60);
			if (this.length_text) {
				const length_x = this.x + this.w - length_w - right_pad;

				gr.DrawString(this.length_text, title_font, this.title_color, length_x, this.y, length_w, this.h, g_string_format.h_align_far | g_string_format.v_align_center);
				testRect && gr.DrawRect(length_x, this.y - 1, length_w, this.h, 1, RGBA(155, 155, 255, 250));
			}
			// We always want that padding
			right_pad += Math.max(length_w, Math.ceil(gr.MeasureString(this.length_text, title_font, 0, 0, 0, 0).Width + 10));
		}

		// * RATING
		if (g_properties.show_rating) {
			this.rating.x = this.x + this.w - this.rating.w - right_pad;
			this.rating.y = this.y;
			this.rating.draw(gr, g_pl_colors.row_rating_color);

			right_pad += this.rating.w + this.rating_right_pad + this.rating_left_pad;
		}

		// * COUNT
		if (g_properties.show_playcount) {
			if (this.count_text == null) {
				if (is_radio) {
					this.count_text = '';
				}
				else {
					this.count_text = $('%play_count%', this.metadb);
					if (this.count_text !== '0') {
						this.count_text = $('[$max(%play_count%, %lastfm_play_count%)]', this.metadb);
						this.count_text = !Number(this.count_text) ? '' : (`${this.count_text} |`);
					}
					else if (pref.lastFmScrobblesFallback) {
						this.count_text = $('[$max(%lastfm_play_count%, %play_count%)]', this.metadb);
						this.count_text = !Number(this.count_text) ? '' : (`${this.count_text} |`);
					}
					else {
						// Don't want to show lastfm play count if track hasn't been played locally
						this.count_text = '';
					}
				}
			}

			if (this.count_text) {
				const count_w = Math.ceil(
					/** @type {!number} */
					gr.MeasureString(this.count_text, g_pl_fonts.playcount, 0, 0, 0, 0).Width
				);
				const count_x = this.x + this.w - count_w - right_pad;

				gr.DrawString(this.count_text, g_pl_fonts.playcount, this.title_color, count_x, this.y, count_w, this.h, g_string_format.align_center);
				testRect && gr.DrawRect(count_x, this.y - 1, count_w, this.h, 1, RGBA(155, 155, 255, 250));

				right_pad += count_w;
			}
		}

		// * QUEUE
		const queueText = g_properties.show_queue_position && this.queue_indexes != null ? `  [${this.queue_indexes}]` : '';

		// * TITLE init
		if (this.title_text == null) {
			const margin = !pref.showPlaylistTrackNumbers && !pref.showPlaylistIndexNumbers ? this.is_playing ? '      ' : '' : ' ';
			const indexNumbers = this.idx < 9 ? `0${this.idx + 1}. ` : `${this.idx + 1}. `;
			const trackNumbers = pref.showPlaylistIndexNumbers ? indexNumbers : `$if2(%tracknumber%,$pad_right(${this.idx_in_header + 1},2,0)). `;
			const trackNumbersVinyl = `$if2(${tf.vinyl_track},00. )`;
			let track_num_query = trackNumbers;

			if (pref.showVinylNums) {
				track_num_query = pref.showPlaylistIndexNumbers ? indexNumbers : trackNumbersVinyl;
			}
			if (this.is_playing) {
				track_num_query = g_properties.show_header ? pref.showPlaylistIndexNumbers ? '      ' : '      ' : pref.showVinylNums ? trackNumbersVinyl : trackNumbers;
			}

			const showTrackNum = pref.showPlaylistTrackNumbers || pref.showPlaylistIndexNumbers ? track_num_query : '';
			const customTitle = settings.playlistCustomTitle;
			const customTitleNoHeader = settings.playlistCustomTitleNoHeader;

			const title_query =
				g_properties.show_header ? (pref.showPlaylistTrackNumbers || pref.showPlaylistIndexNumbers ? track_num_query : '') +
					(pref.showArtistPlaylistRows && pref.showAlbumPlaylistRows && customTitle === '' ? `${margin}%artist% - %album% -  %title%[ '('%original artist%' cover)']` :
					 pref.showArtistPlaylistRows && customTitle === '' ? `${margin}%artist% -  %title%[ '('%original artist%' cover)']` :
					 pref.showAlbumPlaylistRows  && customTitle === '' ? `${margin}%album% -  %title%[ '('%original artist%' cover)']` :
					customTitle !== '' ? `${margin}${customTitle}` : `${margin}%title%[ '('%original artist%' cover)']`) :
				customTitleNoHeader !== '' ? `${margin}     ${customTitleNoHeader}` : `${margin}     %artist% - %album% - ${showTrackNum} %title%[ '('%original artist%' cover)']`;

			this.title_text = (fb.IsPlaying && this.is_playing && is_radio) ? $(title_query) : $(title_query, this.metadb);
		}

		// * TITLE ARTIST init
		if (this.title_artist_text == null) {
			const pattern = `^${$('%album artist%', this.metadb).replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')} `;
			const regex = new RegExp(pattern);
			this.title_artist_text = $(`[$if($strcmp(${tf.artist},%artist%),$if(%album artist%,$if(%track artist%,%track artist%,),),${tf.artist})]`, this.metadb);
			if (this.title_artist_text.length) {
				// if tf.artist evaluates to something different than %album artist% strip %artist% from the start of the string
				// i.e. tf.artist = "Metallica feat. Iron Maiden" then we want this.title_artist_text = "feat. Iron Maiden"
				this.title_artist_text = this.title_artist_text.replace(regex, '');
				this.title_artist_text = `  \u25AA  ${this.title_artist_text}`;
			}
		}

		// * TITLE draw
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

		// * TITLE ARTIST draw
		if (this.title_artist_text) {
			const title_artist_x = cur_x;
			const title_artist_w = this.w - (title_artist_x - this.x) - right_pad;
			const title_artist_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;

			if (pref.showDifferentArtist) {
				gr.DrawString(this.title_artist_text, title_artist_font, this.title_color, title_artist_x, this.y, title_artist_w, this.h, title_artist_text_format);
			}
			cur_x += Math.ceil(
				/** @type {!number} */
				gr.MeasureString(this.title_artist_text, title_artist_font, 0, 0, title_artist_w, this.h, title_artist_text_format).Width
			);
		}

		if (queueText) {
			const queueX = cur_x;
			const queueW = this.w - (queueX - this.x) - right_pad;
			const queueTextFormat = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
			let queueColor = this.title_color; // col.primary;

			if (this.is_playing || colorDistance(queueColor, g_pl_colors.row_stripes_bg) < 165) {
				queueColor = this.title_color;
			}
			gr.DrawString(queueText, title_font, queueColor, queueX, this.y, queueW, this.h, queueTextFormat);
		}
		gr.SetSmoothingMode(SmoothingMode.HighQuality);

		// * Refresh playlist time remaining all the time when activated
		let timeRemainingTimer = null;
		if (pref.playlistTimeRemaining && this.is_playing && fb.IsPlaying) {
			timeRemainingTimer = setTimeout(() => {
				const length_w = scaleForDisplay(60);
				const length_x = this.x + this.w - length_w;
				window.RepaintRect(length_x + 5, this.y, length_w + 5, this.h);
			}, 1000);
		} else {
			clearTimeout(timeRemainingTimer);
		}

		// * Change and update title_color back to normal from previous mouse row hover state
		this.title_color = g_pl_colors.row_title_normal;

		// * Callbacks for titleTooltip
		this.title_w = this.w - right_pad - scaleForDisplay(44);
		this.title_text_w = gr.MeasureString(this.title_text, title_font, 0, 0, 0, 0).Width;
	}

	/** @override */
	set_x(x) {
		ListItem.prototype.set_x.apply(this, [x]);
		this.rating.x = x;
	}

	/** @override */
	set_y(y) {
		ListItem.prototype.set_y.apply(this, [y]);
		this.rating.y = y;
	}

	/** @override */
	set_w(w) {
		ListItem.prototype.set_w.apply(this, [w]);
		this.initialize_rating();
	}

	reset_queried_data() {
		this.title_text = undefined;
		this.title_artist_text = undefined;
		this.count_text = undefined;
		this.length_text = undefined;

		// this.rating.reset_queried_data();
	}

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
	}

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

	// * Playlist row truncated text tooltip
	titleTooltip() {
		if ((pref.showTooltipMain || pref.showTooltipTruncated)) {
			if (displayCustomThemeMenu && displayBiography) return; // Overlayed by custom theme menu

			const is_radio = this.metadb.RawPath.startsWith('http');
			const margin = !pref.showPlaylistTrackNumbers && !pref.showPlaylistIndexNumbers ? '' : ' ';
			const indexNumbers = this.idx < 9 ? `0${this.idx + 1}. ` : `${this.idx + 1}. `;
			const trackNumbers = pref.showPlaylistIndexNumbers ? indexNumbers : `$if2(%tracknumber%,$pad_right(${this.idx_in_header + 1},2,0)). `;
			let track_num_query = trackNumbers;

			if (pref.showVinylNums) {
				track_num_query = pref.showPlaylistIndexNumbers ? indexNumbers : tf.vinyl_track;
			}

			const title_query = g_properties.show_header ? (pref.showPlaylistTrackNumbers || pref.showPlaylistIndexNumbers ? track_num_query : '') +
				(pref.showArtistPlaylistRows && pref.showAlbumPlaylistRows ? `${margin}%artist% - %album% -  %title%[ '('%original artist%' cover)']` :
				 pref.showArtistPlaylistRows ? `${margin}%artist% -  %title%[ '('%original artist%' cover)']` :
				 pref.showAlbumPlaylistRows  ? `${margin}%album% -  %title%[ '('%original artist%' cover)']` :
			`${margin}%title%[ '('%original artist%' cover)']`) : `%artist%$crlf()%album%$crlf()${track_num_query} %title%[ '('%original artist%' cover)']`;

			const title_text = (fb.IsPlaying && this.is_playing && is_radio) ? $(title_query) : $(title_query, this.metadb);

			if (this.title_text_w > this.title_w) {
				tt.showDelayed(title_text);
			} else {
				tt.stop();
			}
		}
	}

	update_title_color() {
		this.title_color = pref.styleBlackAndWhite ? RGB(200, 200, 200) : pref.styleBlackAndWhite2 ? RGB(80, 80, 80) : g_pl_colors.row_title_normal;
	}
}


////////////////
// * RATING * //
////////////////
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
	 * @const
	 * @type {number}
	 */
	const rowFontSize = pref.layout === 'compact' ? pref.playlistFontSize_compact : pref.layout === 'artwork' ? pref.playlistFontSize_artwork : pref.playlistFontSize_default;

	/**
	 * @const
	 * @type {number}
	 */
	const btn_w = scaleForDisplay(rowFontSize + 2);

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
	let rating; // undefined

	/**
	 * @param {GdiGraphics} gr
	 * @param {number} color
	 */
	this.draw = function (gr, color) {
		const cur_rating = this.get_rating();
		let cur_rating_x = this.x;
		const y = this.y - (is_4k ? 3 : 1);

		for (let j = 0; j < 5; j++) {
			if (j < cur_rating) {
				gr.DrawString('\u2605', g_pl_fonts.rating_set, loadingThemeComplete ? RGBA(0, 0, 0, 100) : color, cur_rating_x, y, btn_w + 1, this.h + 2, g_string_format.align_center);
				gr.DrawString('\u2605', g_pl_fonts.rating_set, color, cur_rating_x, y, btn_w, this.h, g_string_format.align_center);
			}
			else if (pref.showPlaylistRatingGrid) {
				gr.DrawString('\u2219', g_pl_fonts.rating_not_set, g_pl_colors.row_title_normal, cur_rating_x, y, btn_w, this.h, g_string_format.align_center);
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

		const new_rating = Math.floor((x - this.x) / btn_w) + 1;
		const current_rating = this.get_rating();

		if (g_properties.use_rating_from_tags) {
			if (!this.metadb.RawPath.startsWith('http')) {
				const handle = new FbMetadbHandleList();
				handle.Add(this.metadb);
				handle.UpdateFileInfoFromJSON(
					JSON.stringify({
						RATING: (current_rating === new_rating) ? '' : new_rating
					})
				);
			}
		}
		else {
			fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${current_rating === new_rating ? '<not set>' : new_rating}`, this.metadb);
		}

		rating = (current_rating === new_rating) ? 0 : new_rating;
	};

	/**
	 * @return {number}
	 */
	this.get_rating = () => {
		if (rating == null) {
			let current_rating;
			if (g_properties.use_rating_from_tags) {
				const file_info = this.metadb.GetFileInfo();
				const rating_meta_idx = file_info.MetaFind('RATING');
				current_rating = rating_meta_idx !== -1 ? file_info.MetaValue(rating_meta_idx, 0) : 0;
			}
			else {
				current_rating = $('%rating%', this.metadb);
			}
			return Number(current_rating);
		}
		return rating;
	};

	this.reset_queried_data = () => {
		rating = undefined;
	};
}


///////////////////////////
// * SELECTION HANDLER * //
///////////////////////////
/**
 * @param {PlaylistContent} cnt_arg
 * @param {number} cur_playlist_idx_arg
 * @constructor
 */
function SelectionHandler(cnt_arg, cur_playlist_idx_arg) {
	/**
	 * @const
	 * @type {ContentNavigationHelper}
	 */
	const cnt_helper = cnt_arg.helper;

	/**
	 * @const
	 * @type {Array<Row>}
	 */
	// @ts-ignore
	const rows = cnt_arg.rows;

	/**
	 * @const
	 * @type {number}
	 */
	const cur_playlist_idx = cur_playlist_idx_arg;

	/** @type {Array<number>} */
	let selected_indexes = [];
	/** @type {?number} */
	let last_single_selected_index; // undefined

	/** @type {boolean} */
	let is_dragging = false;
	/** @type {boolean} */
	let is_internal_drag_n_drop_active = false;
	/** @type {?Row} */
	let last_hover_row; // undefined

	// private:
	const that = this;

	this.initialize_selection = () => {
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
	this.update_selection = (item, ctrl_pressed, shift_pressed) => {
		assert(item != null,
			LogicError, 'update_selection was called with undefined item');

		if (!ctrl_pressed && !shift_pressed) {
			selected_indexes = [];
			last_single_selected_index = undefined;
		}

		const visible_item = cnt_helper.is_item_visible(item) ? item : cnt_helper.get_visible_parent(item);
		if (visible_item instanceof BaseHeader) {
			update_selection_with_header(visible_item, ctrl_pressed, shift_pressed);
		}
		else {
			update_selection_with_row(/** @type {Row}*/ visible_item, ctrl_pressed, shift_pressed);
		}

		selected_indexes.sort(numeric_ascending_sort);
	};

	this.select_all = () => {
		if (!rows.length) {
			return;
		}

		selected_indexes = range(rows[0].idx, last(rows).idx + 1);
		last_single_selected_index = rows[0].idx;

		plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
	};

	this.clear_selection = () => {
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
	this.has_selected_items = () => !!selected_indexes.length;

	/**
	 * @return {number}
	 */
	this.selected_items_count = () => selected_indexes.length;

	this.get_selected_items = () => selected_indexes;

	this.perform_internal_drag_n_drop = function () {
		this.enable_drag();
		is_internal_drag_n_drop_active = true;

		const cur_playlist_size = plman.PlaylistItemCount(cur_playlist_idx);
		const cur_playlist_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);
		const cur_selected_indexes = selected_indexes;

		const effect = fb.DoDragDrop(window.ID, cur_playlist_selection, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link);

		is_internal_drag_n_drop_active = false;

		if (is_dragging) {
			// If drag operation was not cancelled, then it means that nor on_drag_drop, nor on_drag_leave event handlers
			// were triggered, which means that the items were most likely dropped inside the panel
			// (and relevant methods were not called because of async event processing)
			return;
		}

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
			// DROPEFFECT_NONE needs special handling, because on NT it
			// is returned for some move operations, instead of DROPEFFECT_MOVE.
			// See Q182219 for the details.

			const items_to_remove = [];
			const playlist_items = plman.GetPlaylistItems(cur_playlist_idx);
			cur_selected_indexes.forEach((idx) => {
				const cur_item = playlist_items[idx];
				if (cur_item.RawPath.startsWith('file://') && !fso.FileExists(cur_item.Path)) {
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

	this.enable_drag = () => {
		clear_last_hover_row();
		is_dragging = true;
	};

	this.disable_drag = () => {
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
	this.is_dragging = () => is_dragging;

	/**
	 * @return {boolean}
	 */
	this.is_internal_drag_n_drop_active = () => is_internal_drag_n_drop_active;

	/**
	 * Also calls repaint
	 *
	 * @param {?Row} hover_row
	 * @param {boolean} is_above
	 */
	this.drag = (hover_row, is_above, idx) => {
		if (hover_row == null) {
			clear_last_hover_row();
			return;
		}

		if (plman.IsPlaylistLocked(cur_playlist_idx)) {
			return;
		}

		let is_drop_top_selected = is_above;
		let is_drop_bottom_selected = !is_above;
		const is_drop_boundary_reached = hover_row.idx === 0 || (!is_above && hover_row.idx === rows.length - 1);

		if (is_internal_drag_n_drop_active && !utils.IsKeyPressed(VK_CONTROL)) {
			// Can't move selected item on itself
			const is_item_above_selected = hover_row.idx !== 0 && rows[hover_row.idx - 1].is_selected();
			const is_item_below_selected = hover_row.idx !== (rows.length - 1) && rows[hover_row.idx + 1].is_selected();
			is_drop_top_selected = is_drop_top_selected && !hover_row.is_selected() && !is_item_above_selected;
			is_drop_bottom_selected = is_drop_bottom_selected && !hover_row.is_selected() && !is_item_below_selected;
		}

		let needs_repaint = false;
		if (last_hover_row) {
			if (last_hover_row.idx === hover_row.idx) {
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

		hover_row.is_drop_top_selected = is_drop_top_selected;
		hover_row.is_drop_bottom_selected = is_drop_bottom_selected;
		hover_row.is_drop_boundary_reached = is_drop_boundary_reached;

		if (needs_repaint) {
			hover_row.repaint();
		}

		last_hover_row = hover_row;
		playlistDropIndex = last_hover_row.idx;
	};

	/**
	 * @return {boolean}
	 */
	this.can_drop = () => !plman.IsPlaylistLocked(cur_playlist_idx);

	/**
	 * @param {boolean} copy_selection
	 */
	this.drop = (copy_selection) => {
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

		let drop_idx = last_hover_row.idx;
		if (last_hover_row.is_drop_bottom_selected) {
			++drop_idx;
		}

		clear_last_hover_row();

		if (!copy_selection) {
			move_selection(drop_idx);
		}
		else {
			plman.UndoBackup(cur_playlist_idx);

			const cur_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);
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

		let playlist_idx;
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
			let drop_idx = last_hover_row.idx;
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

	this.copy = () => {
		if (!selected_indexes.length) {
			return fb.CreateHandleList();
		}

		const selected_items = plman.GetPlaylistSelectedItems(cur_playlist_idx);
		fb.CopyHandleListToClipboard(selected_items);
	};

	this.cut = () => {
		if (!selected_indexes.length) {
			return fb.CreateHandleList();
		}

		const selected_items = plman.GetPlaylistSelectedItems(cur_playlist_idx);

		if (fb.CopyHandleListToClipboard(selected_items)) {
			plman.UndoBackup(cur_playlist_idx);
			plman.RemovePlaylistSelection(cur_playlist_idx);
		}
	};

	this.paste = () => {
		if (!fb.CheckClipboardContents()) {
			return;
		}

		const metadb_list = fb.GetClipboardContents(window.ID);
		if (!metadb_list || !metadb_list.Count) {
			return;
		}

		let insert_idx;
		if (selected_indexes.length) {
			insert_idx = is_selection_contiguous() ? last(selected_indexes) + 1 : plman.GetPlaylistFocusItemIndex(cur_playlist_idx) + 1;
		}
		else {
			const focused_idx = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);
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
	this.send_to_playlist = (playlist_idx) => {
		plman.UndoBackup(playlist_idx);
		plman.ClearPlaylistSelection(playlist_idx);
		plman.InsertPlaylistItems(playlist_idx, plman.PlaylistItemCount(playlist_idx), plman.GetPlaylistSelectedItems(cur_playlist_idx), true);
	};

	this.move_selection_up = () => {
		if (!selected_indexes.length) {
			return;
		}

		move_selection(Math.max(0, selected_indexes[0] - 1));
	};

	this.move_selection_down = () => {
		if (!selected_indexes.length) {
			return;
		}

		move_selection(Math.min(rows.length, last(selected_indexes) + 2));
	};

	/**
	 * @param {Row} row
	 * @param {boolean} ctrl_pressed
	 * @param {boolean} shift_pressed
	 */
	function update_selection_with_row(row, ctrl_pressed, shift_pressed) {
		if (shift_pressed) {
			selected_indexes = get_shift_selection(row.idx);

			// plman.ClearPlaylistSelection(cur_playlist_idx); // * Disabled to enable contiguous Ctrl+shift selection
			plman.SetPlaylistSelection(cur_playlist_idx, selected_indexes, true);
		}
		else if (ctrl_pressed) {
			const is_selected = selected_indexes.find((idx) => row.idx === idx);

			if (is_selected) {
				selected_indexes = selected_indexes.filter(idx => idx !== row.idx);
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
		const row_indexes = header.get_row_indexes();

		if (shift_pressed) {
			selected_indexes = union(get_shift_selection(row_indexes[0]), row_indexes);
		}
		else {
			if (ctrl_pressed) {
				const is_selected = difference(row_indexes, selected_indexes).length === 0;
				if (is_selected) {
					that.clear_selection();		// _.pullAll(selected_indexes, row_indexes);
				}
				else {
					selected_indexes = union(selected_indexes, row_indexes);
				}
			}
			else {
				selected_indexes = row_indexes;
			}
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
		let a = 0;
		let b = 0;

		if (last_single_selected_index == null) {
			last_single_selected_index = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);
			if (last_single_selected_index === -1) {
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
			const last_selected_header = cnt_helper.get_visible_parent(rows[last_single_selected_index]);
			if (last_single_selected_index < selected_idx) {
				a = last_selected_header.get_row_indexes()[0];
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = last(last_selected_header.get_row_indexes());
			}
		}

		return range(a, b + 1);
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
		let move_delta;

		if (is_selection_contiguous()) {
			const focus_idx = plman.GetPlaylistFocusItemIndex(cur_playlist_idx);

			move_delta = new_idx < focus_idx ? -(selected_indexes[0] - new_idx) : new_idx - (last(selected_indexes) + 1);
		}
		else {
			const item_count_before_drop_idx = selected_indexes.filter(idx => idx < new_idx).length;

			move_delta = -(plman.PlaylistItemCount(cur_playlist_idx) - selected_indexes.length - (new_idx - item_count_before_drop_idx));

			// Move to the end to make it contiguous, then back to drop_idx
			plman.MovePlaylistSelection(cur_playlist_idx, plman.PlaylistItemCount(cur_playlist_idx));
		}
		plman.MovePlaylistSelection(cur_playlist_idx, move_delta);
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

	this.initialize_selection();
}


//////////////////////////
// * COLLAPSE HANDLER * //
//////////////////////////
/**
 * @param {PlaylistContent} cnt_arg
 * @constructor
 */
function CollapseHandler(cnt_arg) {
	/** @type {boolean} */
	this.changed = false;

	const that = this;

	/** @type {Array<BaseHeader|Header>} */
	let headers = cnt_arg.sub_items;
	/** @type {?function} */
	let on_collapse_change_callback; // undefined

	this.on_content_change = () => {
		headers = cnt_arg.sub_items;
		this.changed = false;

		if (g_properties.collapse_on_playlist_switch) {
			if (g_properties.auto_collapse) {
				this.collapse_all_but_now_playing();
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
	this.set_callback = (on_collapse_change_callback_arg) => {
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
		let changed = header.is_collapsed !== is_collapsed;
		header.is_collapsed = is_collapsed;

		const sub_items = header.sub_items;
		if (sub_items[0] instanceof Row) {
			return changed;
		}

		sub_items.forEach(item => {
			changed = set_collapsed_state_recursive(item, is_collapsed) || changed;
		});

		return changed;
	}
}


///////////////////////
// * QUEUE HANDLER * //
///////////////////////
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

		const queue_contents = plman.GetPlaybackQueueContents();
		if (!queue_contents.length) {
			return;
		}

		queue_contents.forEach((queued_item, i) => {
			if (queued_item.PlaylistIndex !== this.cur_playlist_idx || queued_item.PlaylistItemIndex === -1) {
				return;
			}

			const cur_queued_row = this.rows[queued_item.PlaylistItemIndex];
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
		});
	}

	/**
	 * @param {Row} row
	 */
	add_row(row) {
		if (!row) {
			return;
		}

		plman.AddPlaylistItemToPlaybackQueue(this.cur_playlist_idx, row.idx);
	}

	/**
	 * @param {Row} row
	 */
	remove_row(row) {
		if (!row) {
			return;
		}

		const idx = plman.FindPlaybackQueueItemIndex(row.metadb, this.cur_playlist_idx, row.idx);
		if (idx !== -1) {
			plman.RemoveItemFromPlaybackQueue(idx);
		}
	}

	flush() {
		plman.FlushPlaybackQueue();
	}


	has_items() {
		return !!plman.GetPlaybackQueueHandles().Count;
	}

	reset_queued_status() {
		if (!this.queued_rows.length) {
			return;
		}

		this.queued_rows.forEach((item) => {
			item.queue_indexes = undefined;
			item.queue_idx_count = 0;
		});

		this.queued_rows = [];
	}
}


//////////////////////////
// * PLAYLIST HISTORY * //
//////////////////////////
const PlaylistMutation = {
	Added: 'Playlist added',
	Init: 'Playlist initializing history',
	Removed: 'Playlist removed',
	Reordered: 'Playlist reordered',
	Switch: 'Playlist switch'
}

class PlaylistHistory {
	constructor(maxStates = 10) {
		this.maxStates = maxStates;
		/** @private PlaylistState[] */ this.history = [];
		/** @private */ this.stateIndex = 0;
		/** @private */ this.updatingPlaylist = false;

		this.playlistAltered(PlaylistMutation.Init);
	}

	get length() {
		return this.history.length;
	}

	canBack() {
		return this.stateIndex > 0;
	}

	canForward() {
		return this.stateIndex < this.length - 1;
	}

	/**
	 * Sets whether the history should ignore upcoming mutations and changes to the playlist.
	 *
	 * Playlist updates are synchronous, but notifications are async. If setting to false, we
	 * update that value async as well to hopefully happen after all callbacks have called,
	 * and then manually call playlistAltered in case the playlist state has changed.
	 * @param {boolean} ignore
	 */
	set ignorePlaylistMutations(ignore) {
		if (!ignore) {
			setTimeout(() => {
				this.updatingPlaylist = false;
				this.playlistAltered(PlaylistMutation.Switch);
			}, 1);
		} else {
			this.updatingPlaylist = true;
		}
	}

	back() {
		this.stateIndex--;
		if (this.stateIndex <= 0) {
			this.stateIndex = 0;
		}
		debugLog('playlistHistory back =>', this.stateIndex);
		this.setPlaylistState();
	}

	forward() {
		this.stateIndex++;
		if (this.stateIndex >= this.length) {
			this.stateIndex = this.length - 1;
		}
		debugLog('playlistHistory forward =>', this.stateIndex);
		this.setPlaylistState();
	}

	/**
	 * Call this to clear the history. Should always be called from on_playlists_changed
	 * because all saved playlistIds have been invalidated.
	 */
	reset() {
		this.history = [];
		this.playlistAltered(PlaylistMutation.Init);
	}

	/** @private */
	setPlaylistState() {
		playlistHistoryUsed = true;
		this.updatingPlaylist = true;
		/** @type PlaylistState */ const activeState = this.history[this.stateIndex];
		const pbQueue = plman.GetPlaybackQueueContents();
		const playingItem = plman.GetPlayingItemLocation();
		const plIndex = activeState.playlistId
		plman.UndoBackup(plIndex);
		plman.ActivePlaylist = plIndex;

		if (!activeState.locked) {
			if (!playingItem.IsValid || playingItem.PlaylistIndex !== plIndex) {
				plman.ClearPlaylist(plIndex);
				plman.InsertPlaylistItems(plIndex, 0, activeState.playlistEntries);
			} else {
				const handles = plman.GetPlaylistItems(plIndex);
				const index = handles.Find(fb.GetNowPlaying());
				const stateHandles = activeState.playlistEntries.Clone();
				const stateIndex = stateHandles.Find(fb.GetNowPlaying());
				const stateHandlesClone = stateHandles.Clone();
				console.log('>>> Playlist now playing index:', index);
				// Remove everything in playlist except currently playing song
				plman.ClearPlaylistSelection(plIndex);
				plman.SetPlaylistSelection(plIndex, [playingItem.PlaylistItemIndex], true);
				plman.RemovePlaylistSelection(plIndex, true);
				plman.ClearPlaylistSelection(plIndex);
				try {
					stateHandles.RemoveById(stateIndex);
				} catch (e) {
					plman.InsertPlaylistItems(plIndex, plman.PlaylistItemCount(plIndex), stateHandlesClone);
				}
				if (stateIndex > 0) {
					stateHandles.RemoveRange(stateIndex, stateHandles.Count);
					plman.InsertPlaylistItems(plIndex, 0, stateHandles);
				}
				if (stateIndex < stateHandlesClone.Count) {
					stateHandlesClone.RemoveRange(0, stateIndex);
					plman.InsertPlaylistItems(plIndex, plman.PlaylistItemCount(plIndex), stateHandlesClone);
				}
				// Remove currently playing song duplicate
				plman.SetPlaylistSelection(plIndex, [playingItem.PlaylistItemIndex], true);
				plman.RemovePlaylistSelection(plIndex);
			}
		}

		this.restorePlaybackQueue(pbQueue);

		// * Wait for callbacks to be called
		setTimeout(() => {
			playlistHistoryUsed = false;
			this.updatingPlaylist = false;
		}, 1);

		// * Scroll to now playing when auto-scroll is active and playlist has now playing
		const playing_item_location = plman.GetPlayingItemLocation();
		const playlistNowPlaying = playing_item_location.PlaylistIndex === plman.ActivePlaylist;
		if ((pref.playlistAutoScrollNowPlaying || fb.PlaybackFollowCursor || fb.CursorFollowPlayback) && playlistNowPlaying) {
			setTimeout(() => { // * Wait until new album art / disc art loaded and other things finished for smoother auto-scrolling
				playlist.show_now_playing();
			}, newTrackFetchingDone + 200);
		}
	}

	/**
	 * @private Attempts to re-mark playbackQueue items after setting playlist state
	 * @param {FbPlaybackQueueItem[]} pbQueue
	 */
	restorePlaybackQueue(pbQueue) {
		plman.FlushPlaybackQueue();
		pbQueue.forEach((queueItem) => {
			const itemPlaylist = queueItem.PlaylistIndex;
			const itemIndex = queueItem.PlaylistItemIndex;
			if (itemPlaylist !== -1 && itemIndex !== -1) {
				const plContents = {};
				if (!plContents[itemPlaylist]) {
					plContents[itemPlaylist] = plman.GetPlaylistItems(itemPlaylist);
				}
				/** FbMetadbHandleList */ const playlistHandles = plContents[itemPlaylist];
				if (playlistHandles && playlistHandles[itemIndex] && playlistHandles[itemIndex].Path === queueItem.Handle.Path) {
					plman.AddPlaylistItemToPlaybackQueue(itemPlaylist, itemIndex);
				} else {
					const index = plContents[itemPlaylist].Find(queueItem.Handle);
					if (index >= 0) {
						plman.AddPlaylistItemToPlaybackQueue(itemPlaylist, index);
					} else {
						plman.AddItemToPlaybackQueue(queueItem.Handle);
					}
				}
			} else {
				plman.AddItemToPlaybackQueue(queueItem.Handle);
			}
		});
	}

	/**
	 * Notify the PlaylistHistory that a playlist was altered.
	 * @param {string} mutationType
	 */
	playlistAltered(mutationType) {
		// ignore playlist alterations when changing states
		console.log(mutationType);
		if (!this.updatingPlaylist && plman.ActivePlaylist >= 0) {
			const plItems = plman.GetPlaylistItems(plman.ActivePlaylist);
			if (this.shouldAddState(plman.ActivePlaylist, plItems, mutationType)) {
				if (this.stateIndex < this.length - 1) {
					this.history = this.history.slice(0, this.stateIndex + 1);
				}
				if (this.length >= this.maxStates) {
					this.history.shift();
				}
				this.history.push(new PlaylistState(plman.ActivePlaylist, plItems));
				this.stateIndex = this.length - 1;
				if (btns.back) {
					btns.back.repaint();
					btns.forward.repaint();
				}
				debugLog('stateIndex:', this.stateIndex, ' new items count:', plItems.Count, this.stateIndex);
			}
		}
	}

	/**
	 * @private Determine if a new state should be added to the playlistHistory
	 * @param {number} playlistId
	 * @param {FbMetadbHandleList} newItems List of handles of playlist items
	 * @param {string} mutationType currently unused
	 * @returns {boolean}
	 */
	shouldAddState(playlistId, newItems, mutationType) {
		const start = Date.now();
		const currState = this.history[this.stateIndex];
		if (!currState) {
			// init'ing playlist history
			return true
		}

		// if playlist ID is unchanged, and playlist is locked, don't save
		if (playlistId === currState.playlistId && plman.IsPlaylistLocked(playlistId)) {
			return false;
		}
		if (playlistId !== currState.playlistId ||
			currState.locked || plman.IsPlaylistLocked(playlistId) ||
			newItems.Count !== currState.playlistEntries.Count) {
			return true;
		}
		for (let i = 0; i < newItems.Count; i++) {
			if (newItems[i].RawPath !== currState.playlistEntries[i].RawPath) {
				// console.log(newItems[i].RawPath, currState.playlistEntries[i].RawPath);
				return true;
			}
		}
		debugLog(`Checking for duplicate playlist states took: ${Date.now() - start}ms`);
		return false;
	}
}


/**
 * @class
 * @constructor
 * @public
 */
class PlaylistState {
	/**
	 * @param {number} playlistId
	 * @param {FbMetadbHandleList} plItems
	 */
	constructor(playlistId, plItems) {
		/**
		 * @type {number}
		 * @public
		 */
		this.playlistId = playlistId;
		/**
		 * @type {boolean}
		 * @public
		 */
		this.locked = plman.IsPlaylistLocked(playlistId);
		if (!this.locked) {
			// don't need to save items if playlist is locked, we'll just switch to it
			/** @type {FbMetadbHandleList} */ this.playlistEntries = plItems;
		}
	}
}


//////////////////////////
// * PLAYLIST MANAGER * //
//////////////////////////
/**
 * @constructor
 */
function PlaylistManager(x, y, w, h) {
	// public:
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	/** @enum {number} */
	const state = {
		normal:  0,
		hovered: 1,
		pressed: 2
	};

	/** @type {state} */
	this.panel_state = state.normal;
	/** @type {number} */
	this.hover_alpha = 0;

	// private:
	const that = this;

	/** @type {?string} */
	let info_text; // undefined

	const _alpha_timer = function(items_arg, hover_predicate_arg) {
		let alpha_timer_internal = null;

		this.start = function () {
			const hover_in_step = 50;
			const hover_out_step = 15;

			if (!alpha_timer_internal) {
				alpha_timer_internal = setInterval(() => {
					items_arg.forEach((item) => {
						const saved_alpha = item.hover_alpha;
						item.hover_alpha = hover_predicate_arg(item) ? Math.min(255, item.hover_alpha += hover_in_step) : Math.max(0, item.hover_alpha -= hover_out_step);

						if (saved_alpha !== item.hover_alpha) {
							item.repaint();
						}
					});

					const alpha_in_progress = items_arg.some(item => item.hover_alpha > 0 && item.hover_alpha < 255);

					if (!alpha_in_progress) {
						this.stop();
					}
				}, 25);
			}
		};

		this.stop = () => {
			if (alpha_timer_internal) {
				clearInterval(alpha_timer_internal);
				alpha_timer_internal = null;
			}
		};
	};

	const alpha_timer = new _alpha_timer([this], (item) => item.panel_state === state.hovered);

	/** @type {?GdiBitmap} */
	let image_normal = null;
	/** @type {?GdiBitmap} */
	let image_hovered = null;

	let cur_playlist_idx; // undefined

	// #region Callback Implementation
	this.on_paint = function (gr) {
		if (!info_text || cur_playlist_idx !== plman.ActivePlaylist) {
			cur_playlist_idx = plman.ActivePlaylist;
			let metadb_list = plman.GetPlaylistSelectedItems(cur_playlist_idx);
			let is_selected = true;

			if (!metadb_list.Count) {
				metadb_list = plman.GetPlaylistItems(cur_playlist_idx);
				is_selected = false;
			}

			const track_count = metadb_list.Count;
			let tracks_text = '';
			let duration_text = '';
			if (track_count > 0) {
				tracks_text = track_count.toString() + (track_count > 1 ? ' tracks' : ' track');
				if (is_selected) {
					tracks_text += ' selected';
				}

				const duration = Math.round(metadb_list.CalcTotalDuration());
				if (duration) {
					duration_text = utils.FormatDuration(duration);
				}
			}

			info_text = plman.GetPlaylistName(cur_playlist_idx);
			if (tracks_text) {
				info_text += `: ${tracks_text}`;
			}
			if (duration_text) {
				info_text += `, Length: ${duration_text}`;
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
				const image = gdi.CreateImage(this.w, this.h);
				const image_gr = image.GetGraphics();

				draw_on_image(image_gr, 0, 0, this.w, this.h, state.normal);

				image.ReleaseGraphics(image_gr);
				image_normal = image;
			}

			if (!image_hovered) {
				const image = gdi.CreateImage(this.w, this.h);
				const image_gr = image.GetGraphics();

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
		if (btns.back && btns.back.mouseInThis(x, y) || btns.forward && btns.forward.mouseInThis(x, y)) {
			return; // Handled in back forward buttons
		}
		if (!this.trace(x, y)) {
			return;
		}

		change_state(state.pressed);
	};

	this.on_mouse_lbtn_up = function (x, y, m) {
		const was_pressed = this.panel_state === state.pressed;

		if (btns.back && btns.back.mouseInThis(x, y) || btns.forward && btns.forward.mouseInThis(x, y)) {
			return; // Handled in back forward buttons
		}
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

		onPlaylistsMenu(x, y);

		this.repaint();
	};

	this.on_mouse_rbtn_down = function (x, y, m) {
		if (!this.trace(x, y)) {
			return true;
		}

		change_state(state.pressed);
	};

	this.on_mouse_rbtn_up = function (x, y, m) {
		const was_pressed = this.panel_state === state.pressed;

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

		const cmm = new ContextMainMenu();

		fb.RunMainMenuCommand('View/Playlist Manager'); // PlaylistManager.append_playlist_info_visibility_context_menu_to(cmm);

		if (utils.IsKeyPressed(VK_SHIFT)) {
			qwr_utils.append_default_context_menu_to(cmm);
		}

		activeMenu = true;
		cmm.execute(x, y);
		activeMenu = false;

		return true;
	};

	this.on_mouse_leave = () => {
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

	this.set_xywh = function (x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = scaleForDisplay(g_properties.row_h + 4);
	};

	this.trace = function (x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	};

	/**
	 * @param {KeyActionHandler} key_handler
	 */
	this.register_key_actions = (key_handler) => {
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

	const throttled_repaint = throttle(() => {
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
		let text_color;
		let bg_color;

		switch (panel_state) {
			case state.normal: {
				text_color = pref.styleBlend && pref.autoHidePlman ? '' : g_pl_colors.plman_text_normal;
				bg_color = g_pl_colors.plman_bg;
				break;
			}
			case state.hovered: {
				text_color = g_pl_colors.plman_text_hovered;
				bg_color = g_pl_colors.plman_bg;
				break;
			}
			case state.pressed: {
				text_color = g_pl_colors.plman_text_pressed;
				bg_color = g_pl_colors.plman_bg;
				break;
			}
		}

		if (!pref.styleBlend) gr.FillSolidRect(x, y, w, h, bg_color); // Playlist Manager Hide Top Rows that shouldn't be visible
		// * Need to apply text rendering AntiAliasGridFit when using style Blend or when using custom theme fonts with larger font sizes
		const headerFontSize = pref.layout === 'compact' ? pref.playlistHeaderFontSize_compact : pref.layout === 'artwork' ? pref.playlistHeaderFontSize_artwork : pref.playlistHeaderFontSize_default;
		gr.SetTextRenderingHint(pref.styleBlend || pref.customThemeFonts && headerFontSize > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

		if (plman.ActivePlaylist !== -1 && plman.IsPlaylistLocked(plman.ActivePlaylist)) {
			// Position above scrollbar for eye candy
			// const sbar_x = x + w - playlist_geo.scrollbar_w - playlist_geo.scrollbar_right_pad;
			const lock_x = ww - scaleForDisplay(29);
			const lock_text = '\uf023';
			const lock_w = Math.ceil(
				/** @type {!number} */
				gr.MeasureString(lock_text, g_pl_fonts.font_awesome, 0, 0, 0, 0).Width
			);
			gr.DrawString(lock_text, g_pl_fonts.font_awesome, text_color, lock_x, y, lock_w, h, g_string_format.align_center);

			// right_pad += lock_w;  // Deactivated -> PLM text should be always centered
		}

		const info_text_format = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
		gr.DrawString(info_text, g_pl_fonts.title_selected, text_color, x, y, w, h, info_text_format);

		// * Playlist history buttons
		const yCorr =
			headerFontSize === 22 ? is_4k ? 14 :  7 :
			headerFontSize === 20 ? is_4k ? 12 :  5 :
			headerFontSize === 18 ? is_4k ? 10 :  3 :
			headerFontSize === 17 ? is_4k ?  8 :  2 :
			headerFontSize === 16 ? is_4k ?  7 :  1 :
			headerFontSize === 15 ? is_4k ?  4 :  0 :
			headerFontSize === 14 ? is_4k ?  4 :  0 :
			headerFontSize === 13 ? is_4k ?  2 : -1 :
			headerFontSize === 12 ? is_4k ?  2 : -1 :
			headerFontSize === 10 ? is_4k ? -2 : -3 : '';

		const info_w = gr.CalcTextWidth(info_text, g_pl_fonts.title_selected);
		const btn_x = Math.round((pref.playlistLayout === 'normal' ? ww * 0.5 : 0) + (w - info_w) * 0.5);
		const btn_y = geo.topMenuHeight + yCorr;
		const btns_w = Math.round(h);
		const hasPlaylistHistory = playlistHistory.canBack() || playlistHistory.canForward();
		const showPlaylistManager = pref.layout === 'compact' ? pref.showPlaylistManager_compact : pref.layout === 'artwork' ? pref.showPlaylistManager_artwork : pref.showPlaylistManager_default;
		const showBtns = (pref.autoHidePlman && (panel_state !== state.normal) || !pref.autoHidePlman);

		if (pref.showPlaylistHistory && hasPlaylistHistory && showPlaylistManager) {
			btns.back = new Button(showBtns ? btn_x - btns_w : 9999, btn_y, h, h, 'Back', btnImg.Back, null, playlistHistory.canBack.bind(playlistHistory));
			btns.forward = new Button(showBtns ? btn_x + info_w + btns_w * scaleForDisplay(0.15) : 9999, btn_y, h, h, 'Forward', btnImg.Forward, null, playlistHistory.canForward.bind(playlistHistory));
		}
	}

	/**
	 * @param {state} new_state
	 */
	function change_state(new_state) {
		if (that.panel_state === new_state) {
			return;
		}

		const old_state = that.panel_state;
		that.panel_state = new_state;

		if (old_state === state.pressed) {
			// Mouse click action opens context menu, which triggers on_mouse_leave, thus causing weird hover animation
			that.hover_alpha = 0;
		}
		if (new_state === state.hovered || new_state === state.normal) {
			alpha_timer.start();
		}

		that.repaint();
	}
}


/**
 * @param {ContextMenu} parent_menu
 */
PlaylistManager.append_playlist_info_visibility_context_menu_to = (parent_menu) => {
	const showPlaylistManager = pref.layout === 'compact' ? pref.showPlaylistManager_compact : pref.layout === 'artwork' ? pref.showPlaylistManager_artwork : pref.showPlaylistManager_default;
	parent_menu.append_item('Show playlist manager', () => {
		// g_properties.show_playlist_info = !g_properties.show_playlist_info;
		if (pref.layout === 'compact') {
			pref.showPlaylistManager_compact = !pref.showPlaylistManager_compact;
		} else if (pref.layout === 'artwork') {
			pref.showPlaylistManager_artwork = !pref.showPlaylistManager_artwork;
		} else {
			pref.showPlaylistManager_default = !pref.showPlaylistManager_default;
		}
		playlist.on_size(ww, wh);
	}, { is_checked: showPlaylistManager });
};


//////////////////////////
// * GROUPING HANDLER * //
//////////////////////////
/**
 * @constructor
 */
function GroupingHandler() {
	/**
	 * @const
	 * @type {GroupingHandler.Settings}
	 */
	const settings = new GroupingHandler.Settings();
	/** @type {?Array<string>} */
	let playlists = [];
	/** @type {string} */
	let cur_playlist_name = '';
	/** @type {?GroupingHandler.Settings.Group} */
	let cur_group; // undefined
	/** @type {?Array<string>} */
	let group_by_name;

	this.on_playlists_changed = () => {
		const playlist_count = plman.PlaylistCount;
		const new_playlists = [];
		for (let i = 0; i < playlist_count; ++i) {
			new_playlists.push(plman.GetPlaylistName(i));
		}

		let save_needed = false;

		if (playlists.length > playlist_count) {
			// Removed

			const playlists_to_remove = difference(playlists, new_playlists);
			playlists_to_remove.forEach((playlist_name) => {
				delete settings.playlist_group_data[playlist_name];
				delete settings.playlist_custom_group_data[playlist_name];
			});

			save_needed = true;
		}
		else if (playlists.length === playlist_count) {
			// May be renamed?

			const playlist_difference_new = difference(new_playlists, playlists);
			const playlist_difference_old = difference(playlists, new_playlists);
			if (playlist_difference_old.length === 1) {
				// playlist_difference_new.length > 0 and playlist_difference_old.length === 0 means that
				// playlists contained multiple items of the same name (one of which was changed)
				const old_name = playlist_difference_old[0];
				const new_name = playlist_difference_new[0];

				const group_name = settings.playlist_group_data[old_name];
				const custom_group = settings.playlist_custom_group_data[old_name];

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
	this.set_active_playlist = (cur_playlist_name_arg) => {
		cur_playlist_name = cur_playlist_name_arg;
		let group_name = settings.playlist_group_data[cur_playlist_name];

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
	this.get_query = () => cur_group.group_query;

	/**
	 * @return {string}
	 */
	this.get_title_query = () => cur_group.title_query;

	/**
	 * @return {string}
	 */
	this.get_sub_title_query = () => cur_group.sub_title_query;

	/**
	 * @return {string}
	 */
	this.get_query_name = () => cur_group.name;

	/**
	 * @return {boolean}
	 */
	this.show_disc = () => cur_group.show_disc;

	/**
	 * @return {boolean}
	 */
	this.show_date = () => cur_group.show_date;

	/**
	 * @param {ContextMenu} parent_menu
	 * @param {function} on_execute_callback_fn
	 */
	this.append_menu_to = (parent_menu, on_execute_callback_fn) => {
		const group = new ContextMenu('Grouping');
		parent_menu.append(group);

		group.append_item('Manage presets', () => {
			manage_groupings(on_execute_callback_fn);
		});

		group.append_separator();

		group.append_item('Reset to default', () => {
			delete settings.playlist_custom_group_data[cur_playlist_name];
			delete settings.playlist_group_data[cur_playlist_name];

			cur_group = settings.group_presets[group_by_name.indexOf(settings.default_group_name)];

			settings.save();
			settings.send_sync();

			on_execute_callback_fn();
		});

		group.append_separator();

		// let group_by_text = 'by...';
		// if (cur_group.name === 'user_defined') {
		// 	group_by_text += ' [' + this.get_query() + ']';
		// }
		// group.append_item(group_by_text, () => {
		// 	request_user_query(on_execute_callback_fn);
		// }, { is_radio_checked: cur_group.name === 'user_defined' });

		settings.group_presets.forEach((group_item) => {
			let group_by_text = group_item.description;
			if (group_item.name === settings.default_group_name) {
				group_by_text += ' [default]';
			}

			group.append_item(group_by_text, () => {
				cur_group = group_item;

				delete settings.playlist_custom_group_data[cur_playlist_name];

				settings.playlist_group_data[cur_playlist_name] = group_item.name;
				settings.save();
				settings.send_sync();

				on_execute_callback_fn();
			}, { is_radio_checked: cur_group.name === group_item.name });
		});
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
		const on_ok_fn = (ret_val) => {
			const custom_group = new GroupingHandler.Settings.Group('user_defined', '', ret_val[0], ret_val[1]);
			cur_group = custom_group;

			settings.playlist_group_data[cur_playlist_name] = 'user_defined';
			settings.playlist_custom_group_data[cur_playlist_name] = custom_group;

			settings.save();
			settings.send_sync();

			on_execute_callback_fn();
		};

		const parsed_query = cur_group.name === 'user_defined'
			? [cur_group.group_query, cur_group.title_query]
			: ['', '[%album artist%]'];

		const htmlCode = qwr_utils.prepare_html_file(`${fb.ProfilePath}georgia-reborn\\scripts\\playlist\\assets\\html\\MsgBox.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: ['Foobar2000: Group by', ['Grouping Query', 'Title Query'], parsed_query, on_ok_fn] });
	}

	/**
	 * @param {function} on_execute_callback_fn
	 */
	function manage_groupings(on_execute_callback_fn) {
		const on_ok_fn = (ret_val_json) => {
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

		const htmlCode = qwr_utils.prepare_html_file(`${fb.ProfilePath}georgia-reborn\\scripts\\playlist\\assets\\html\\GroupPresetsMngr.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: [JSON.stringify([settings.group_presets, cur_group.name, settings.default_group_name]), on_ok_fn] });
	}

	function initialize_playlists() {
		playlists = [];
		const playlist_count = plman.PlaylistCount;
		for (let i = 0; i < playlist_count; ++i) {
			playlists.push(plman.GetPlaylistName(i));
		}
	}

	function cleanup_settings() {
		for (const i in settings.playlist_group_data) {
			console.log(i);
			if (!playlists.includes(i)) {
				delete settings.playlist_group_data[i];
			}
		}

		for (const i in settings.playlist_custom_group_data) {
			if (!playlists.includes(i)) {
				delete settings.playlist_custom_group_data[i];
			}
		}

		settings.save();
	}

	function initalize_name_to_preset_map() {
		group_by_name = settings.group_presets.map((item) => item.name);
	}

	initalize_name_to_preset_map();
	initialize_playlists();
	cleanup_settings();
}


/**
 * @constructor
 */
GroupingHandler.Settings = function () {
	/** @typedef {GroupingHandler.Settings.Group} */
	const CtorGroupData = GroupingHandler.Settings.Group;

	/** @type {Object<string, string>} */
	this.playlist_group_data = {};
	/** @type {Object<string, GroupingHandler.Settings.Group>} */
	this.playlist_custom_group_data = {};
	/** @type {string} */
	this.default_group_name = '';
	/** @type {Array<GroupingHandler.Settings.Group>} */
	this.group_presets = [];

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

	this.send_sync = () => {
		const syncData = {
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
		if (!g_properties.playlist_group_data || !isObject(JSON.parse(g_properties.playlist_group_data))) {
			g_properties.playlist_group_data = JSON.stringify({});
		}

		if (!g_properties.playlist_custom_group_data || !isObject(JSON.parse(g_properties.playlist_custom_group_data))) {
			g_properties.playlist_custom_group_data = JSON.stringify({});
		}

		if (!g_properties.group_presets || !Array.isArray(JSON.parse(g_properties.group_presets))) {
			g_properties.group_presets = JSON.stringify([
				new CtorGroupData('artist', 'by artist', '%album artist%', undefined, ''),
				new CtorGroupData('artist_album', 'by artist / album', '%album artist%%album%', undefined, undefined, {
					show_date: true
				}),
				new CtorGroupData('artist_album_disc', 'by artist / album / disc number', '%album artist%%album%%discnumber%', undefined, undefined, {
					show_date: true,
					show_disc:   true
				}),
				new CtorGroupData('artist_album_disc_edition', 'by artist / album / disc number / edition / codec', '%album artist%%album%%discnumber%%edition%%codec%', undefined, undefined, {
					show_date: true,
					show_disc:   true
				}),
				new CtorGroupData('path', 'by path', '$directory_path(%path%)', undefined, undefined, {
					show_date: true
				}),
				new CtorGroupData('date', 'by date', '%date%', undefined, undefined, {
					show_date: true
				})
			]);
		}

		if (!g_properties.default_group_name || !isString(g_properties.default_group_name)) {
			g_properties.default_group_name = 'artist_album_disc_edition';
		}
	}

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
 * @param {boolean=} [options.show_disc=false]
 * @constructor
 * @struct
 */
GroupingHandler.Settings.Group = function (name, description, group_query, title_query, sub_title_query, options) {
	/** @type {string} */
	this.name = name;
	/** @type {string} */
	this.description = description;
	/** @type {string} */
	this.group_query = group_query || '';
	/** @type {string} */
	this.title_query = title_query || '[%album artist%]';
	/** @type {string} */
	this.sub_title_query = sub_title_query || '[%album%[ \'(\'%albumsubtitle%\')\']][ - \'[\'%edition%\']\']';
	/** @type {boolean} */
	this.show_date = !!(options && options.show_date);
	/** @type {boolean} */
	this.show_disc = !!(options && options.show_disc);
};

Header.grouping_handler = new GroupingHandler();


///////////////////////
// * IMAGE CACHING * //
///////////////////////
/**
 * @param{number} max_cache_size_arg
 * @constructor
 */
function ArtImageCache(max_cache_size_arg) {
	/** @type {LinkedList<FbMetadbHandle>} */
	const queue = new LinkedList();
	/** @type {Object<string,CacheItem>} */
	let cache = {};

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
	this.get_image_for_meta = (metadb) => {
		const cache_item = cache[metadb.Path];
		if (!cache_item) {
			return undefined; // undefined means Not Loaded
		}

		const img = cache_item.img;
		move_item_to_top(cache_item);

		return img;
	};

	/**
	 * @param {GdiBitmap} img
	 * @param {FbMetadbHandle} metadb
	 */
	this.add_image_for_meta = (img, metadb) => {
		const cache_item = cache[metadb.Path];
		if (cache_item) {
			cache_item.img = img;
			move_item_to_top(cache_item);
		}
		else {
			queue.push_front(metadb);
			cache[metadb.Path] = new CacheItem(metadb, img, queue.begin());
			if (queue.length() > max_cache_size_arg) {
				delete cache[queue.back().Path];
				queue.pop_back();
			}
		}
	};

	this.clear = () => {
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
}

Header.art_cache = new ArtImageCache(200);


/////////////////////////////////
// * PLAYLIST INITIALIZATION * //
/////////////////////////////////
function initPlaylist() {
	playlist = new PlaylistPanel(pref.layout === 'default' && (pref.playlistLayout === 'normal' || pref.playlistLayoutNormal && (displayBiography || pref.displayLyrics)) ? ww * 0.5 : 0, 0);
	playlist.initialize();
}


/** Used to update the Playlist when content has changed via user activity, e.g adding/removing items or changing playlist */
function updatePlaylist() {
	debounce((playlistIndex) => {
		trace_call && console.log('initPlaylistDebounced');
		playlist.on_playlist_items_added(playlistIndex);
	}, 100, {
		leading: false,
		trailing: true
	})(plman.ActivePlaylist);
}


///////////////
// * NOTES * //
///////////////
// ! There is a Wine/Linux bug in the playlist drag and drop, a workaround fix was applied in the playlist:
// ! Workaround fix for Wine drag and drop bug does not work since SMP 1.6.0, i.e change
// ! action.Effect = this.filter_effect_by_modifiers(action.Effect); to action.Effect = g_drop_effect.copy; in on_drag_over(action, x, y, mask)
// ! and on_drag_drop(action, x, y, m) in the Playlist. More information here:
// ! https://hydrogenaud.io/index.php/topic,121786.msg1015718.html#msg1015718
// ! To be able to use playlist drag and drop on Wine/Linux, you need to downgrade and use Spider Monkey Panel v1.5.2:
// ! https://github.com/TheQwertiest/foo_spider_monkey_panel/releases/tag/v1.5.2

// * If error crash "class constructors must be invoked with 'new' with generate_first_item_to_draw" throws,
// * happens when playlist scroll wants to scroll to a position more than actual scrollable lines (i.e to a non-valid position) that do not exist in the active playlist
// * This bug has been fixed and hopefully will not occour again.
// * If not, look for "g_properties.scroll_pos" in Control_List.js and here and "this.scroll" in Control_Scrollbar.js.

// TODO: Grouping presets manager: other EsPlaylist grouping features - sorting, playlist association
// TODO: Think about on_visibility_change callback
// TODO: Registration for on_key handlers
// TODO: Research the source of hangs with big art image loading (JScript? fb2k?)
// TODO: Measure draw vs backend performance
