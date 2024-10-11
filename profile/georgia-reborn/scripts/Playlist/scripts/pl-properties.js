/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Properties                      * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    11-10-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////
// * PROPERTIES * //
////////////////////
/**
 * Adds main playlist panel properties to the SMP properties.
 * Default values for grouping data are set in its class constructor.
 */
plSet.addProperties(
	{
		show_plman:                     ['Panel Playlist - User: Playlist_manager.show', true],

		rows_in_header:                 ['Panel Playlist - User: Header.normal.row_count', 4],
		rows_in_compact_header:         ['Panel Playlist - User: Header.compact.row_count', 3],
		show_header:                    ['Panel Playlist - User: Header.show', true],
		use_compact_header:             ['Panel Playlist - User: Header.use_compact', false],
		show_album_art:                 ['Panel Playlist - User: Header.this.art.show', true],
		auto_album_art:                 ['Panel Playlist - User: Header.this.art.auto', false],
		show_group_info:                ['Panel Playlist - User: Header.info.show', true],
		show_disc_header:               ['Panel Playlist - User: Header.disc_header.show', true],
		show_rating_header:             ['Panel Playlist - User: Header.rating.show', true],
		show_PLR_header:                ['Panel Playlist - User: Header.peak_loudness_ratio.show', false],
		auto_collapse:                  ['Panel Playlist - User: Header.collapse.auto', false],
		collapse_on_playlist_switch:    ['Panel Playlist - User: Header.collapse.on_playlist_switch', false],
		collapse_on_start:              ['Panel Playlist - User: Header.collapse.on_start', false],

		row_h:                          ['Panel Playlist - User: Row.height', 20],
		show_row_stripes:               ['Panel Playlist - User: Row.stripes.show', false],
		show_playcount:                 ['Panel Playlist - User: Row.play_count.show', true],
		show_PLR:                       ['Panel Playlist - User: Row.peak_loudness_ratio.show', false],
		show_rating:                    ['Panel Playlist - User: Row.rating.show', true],
		use_rating_from_tags:           ['Panel Playlist - User: Row.rating.from_tags', false],
		show_queue_position:            ['Panel Playlist - User: Row.queue_position.show', true],

		show_scrollbar:                 ['Panel Playlist - User: Scrollbar.show', true],
		scrollbar_right_pad:            ['Panel Playlist - User: Scrollbar.pad.right', 0],
		scrollbar_top_pad:              ['Panel Playlist - User: Scrollbar.pad.top', 0],
		scrollbar_bottom_pad:           ['Panel Playlist - User: Scrollbar.pad.bottom', 3],
		scrollbar_w:                    ['Panel Playlist - User: Scrollbar.width', ''],
		scrollbar_wheel_scroll_page:    ['Panel Playlist - User: Scrollbar.wheel_whole_page', false],

		playlist_stats_include_artist:  ['Panel Playlist - User: Misc.playlist_stats_include_artist', true],
		playlist_stats_include_album:   ['Panel Playlist - User: Misc.playlist_stats_include_album', true],
		playlist_stats_include_track:   ['Panel Playlist - User: Misc.playlist_stats_include_track', true],
		playlist_stats_include_year:    ['Panel Playlist - User: Misc.playlist_stats_include_year', false],
		playlist_stats_include_genre:   ['Panel Playlist - User: Misc.playlist_stats_include_genre', false],
		playlist_stats_include_label:   ['Panel Playlist - User: Misc.playlist_stats_include_label', false],
		playlist_stats_include_country: ['Panel Playlist - User: Misc.playlist_stats_include_country', false],
		playlist_stats_include_stats:   ['Panel Playlist - User: Misc.playlist_stats_include_stats', true],
		playlist_stats_sort_by:         ['Panel Playlist - User: Misc.playlist_stats_sort_by', ''],
		playlist_stats_sort_direction:  ['Panel Playlist - User: Misc.playlist_stats_sort_direction', '_dsc'],

		load_playlist_async:            ['Panel Playlist - System: Load.playlist.asynchronously', true],
		list_top_pad:                   ['Panel Playlist - System: List.padding.top', 0],
		list_right_pad:                 ['Panel Playlist - System: List.padding.right', 0],
		list_bottom_pad:                ['Panel Playlist - System: List.padding.bottom', 0],
		list_left_pad:                  ['Panel Playlist - System: List.padding.left', 0],
		playlist_group_data:            ['Panel Playlist - System: Playlist.grouping.data_list', ''],
		playlist_custom_group_data:     ['Panel Playlist - System: Playlist.grouping.custom_data_list', ''],
		default_group_name:             ['Panel Playlist - System: Playlist.grouping.default_preset_name', ''],
		group_presets:                  ['Panel Playlist - System: Playlist.grouping.presets', ''],
		scrollbar_pos:                  ['Panel Playlist - System: Scrollbar.position', 0]
	}
);


//////////////////////////
// * FIXUP PROPERTIES * //
//////////////////////////
plSet.list_left_pad = 0;
plSet.list_top_pad = 0;
plSet.list_right_pad = 0;
plSet.list_bottom_pad = 0;
plSet.row_h = Math.max(10, plSet.row_h);
plSet.rows_in_header = Math.max(0, plSet.rows_in_header);
plSet.rows_in_compact_header = Math.max(0, plSet.rows_in_compact_header);

if (!grSet.playlistAutoHideScrollbar && !plSet.show_scrollbar) {
	plSet.show_scrollbar = true;
}
