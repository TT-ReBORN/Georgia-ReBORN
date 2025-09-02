/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Main                            * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////////////////////
// ! ALL FILES LOADED IN GR-ASYNC-LOADER.JS ! //
////////////////////////////////////////////////
// /** @global @type {boolean} */
// const loadAsync = window.GetProperty('Panel Playlist - System: Load.playlist.asynchronously', true);
// /** @global @type {string} */
// const playlistPath = `${grPath.base}scripts\\playlist\\scripts\\`;

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(`${playlistPath}${file}`);
// 		}
// 	}
// }

// /** @global @type {string[]} */
// const files = [
// 	'pl-setup.js',
// 	'pl-helpers.js',
// 	'pl-properties.js',
// 	'pl-components.js',
// 	'pl-controls.js',
// 	'pl-list.js',
// 	'pl-list-content.js',
// 	'pl-list-header.js',
// 	'pl-list-row.js',
// 	'pl-panel.js',
// 	'pl-playlist.js'
// ];

// if (loadAsync) {
// 	readFiles(files).then(() => {
// 		if (!window.ID) return; // fix pss issue
// 		grm.ui.setPlaylistSize();
// 		window.Repaint();
// 	});
// } else {
// 	for (const file of files) include(`${playlistPath}${file}`);
// }


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
// * If not, look for "plSet.scrollbar_pos" in Control_List.js and here and "this.scroll" in Control_Scrollbar.js.

// TODO: Grouping presets manager: other EsPlaylist grouping features - sorting, playlist association
// TODO: Think about on_visibility_change callback
// TODO: Registration for on_key handlers
// TODO: Research the source of hangs with big art image loading (JScript? fb2k?)
// TODO: Measure draw vs backend performance
