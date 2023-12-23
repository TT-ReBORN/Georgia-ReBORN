﻿/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Biography                            * //
// * Author:         TT                                                  * //
// * Org. Author:    WilB                                                * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        1.4.2                                               * //
// * Dev. started:   2016-10-18                                          * //
// * Last change:    2023-12-13 (Mod change 2023-12-22)                  * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////////////////////
// ! ALL FILES LOADED IN GR-ASYNC-LOADER.JS ! //
////////////////////////////////////////////////
let biographyInitialized = false;
let isRadioStreamParser = false;

if (typeof my_utilsBio === 'undefined') include(`${basePath}scripts\\biography\\scripts\\utils.js`);
// include(fb.ProfilePath + 'elements\\colourSelector.js'); // sort handling n/a standalone

// const loadAsync = false; // window.GetProperty('Load Biography Asynchronously', true); // changed to false: issue on loading fth with many panels

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(my_utilsBio.getScriptPath + file);
// 		}
// 	}
// }

// const files = [
// 	'helpers.js',
// 	'properties.js',
// 	'settings.js',
// 	'interface.js',
//     'language.js',
// 	'panel.js',
// 	'server.js',
// 	'allmusic.js',
// 	'lastfm.js',
// 	'wikipedia.js',
// 	'names.js',
// 	'scrollbar.js',
// 	'buttons.js',
// 	'menu.js',
// 	'text.js',
// 	'lyrics.js',
// 	'tagger.js',
// 	'resize.js',
// 	'library.js',
// 	'images.js',
// 	'filmstrip.js',
// 	'timers.js',
// 	'popupbox.js',
// 	'initialise.js',
// 	'callbacks.js'
// ];

// if (loadAsync) {
// 	readFiles(files).then(() => {
// 		if (!window.ID) return; // fix pss issue
// 		on_size();
// 		window.Repaint();
// 	});
// } else {
// 	files.forEach(v => include(my_utilsBio.getScriptPath + v));
// }
