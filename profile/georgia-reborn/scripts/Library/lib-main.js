/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Library                              * //
// * Author:         TT                                                  * //
// * Org. Author:    WilB                                                * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        2.4.0                                               * //
// * Dev. started:   2016-10-18                                          * //
// * Last change:    2023-05-13 (Mod change 2023-12-24)                  * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////////////////////
// ! ALL FILES LOADED IN GR-ASYNC-LOADER.JS ! //
////////////////////////////////////////////////
let libraryInitialized = false;

if (typeof my_utilsLib === 'undefined') include(`${basePath}scripts\\library\\scripts\\lib-utils.js`);

// const loadAsync = window.GetProperty('Panel Library - Load Library Tree Asynchronously', true);

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(my_utilsLib.getScriptPath + file);
// 		}
// 	}
// }

// const files = [
// 	'lib-helpers.js',
// 	'lib-properties.js',
// 	'lib-interface.js',
// 	'lib-panel.js',
// 	'lib-scrollbar.js',
// 	'lib-library.js',
// 	'lib-populate.js',
// 	'lib-search.js',
// 	'lib-buttons.js',
// 	'lib-popupbox.js',
// 	'lib-timers.js',
// 	'lib-menu.js',
// 	'lib-initialise.js',
// 	'lib-images.js',
// 	'lib-callbacks.js'
// ];

// if (loadAsync) {
// readFiles(files).then(() => {
// 	if (!window.ID) return; // fix pss issue
// 	on_size();
// 	window.Repaint();
// });
// } else {
// 	files.forEach(v => include(my_utilsLib.getScriptPath + v));
// }
