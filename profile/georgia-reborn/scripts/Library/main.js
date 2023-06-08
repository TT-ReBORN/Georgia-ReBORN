/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Library                              * //
// * Author:         TT                                                  * //
// * Org. Author:    WilB                                                * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        2.4.0                                               * //
// * Dev. started:   2016-10-18                                          * //
// * Last change:    2023-05-13 (Mod change 2023-05-30)                  * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////////////////////////////
// ! ALL FILES LOADED IN GEORGIA-REBORN-THEME.JS ! //
/////////////////////////////////////////////////////
let libraryInitialized = false;

if (typeof my_utilsLib === 'undefined') include(`${basePath}scripts\\library\\scripts\\utils.js`);

// const loadAsync = window.GetProperty('Load Library Tree Asynchronously', true);

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(my_utils.getScriptPath + file);
// 		}
// 	}
// }

// const files = [
// 	'helpers.js',
// 	'properties.js',
// 	'interface.js',
// 	'panel.js',
// 	'scrollbar.js',
// 	'library.js',
// 	'populate.js',
// 	'search.js',
// 	'buttons.js',
// 	'popupbox.js',
// 	'timers.js',
// 	'menu.js',
// 	'initialise.js',
// 	'images.js',
// 	'callbacks.js'
// ];

// if (loadAsync) {
// readFiles(files).then(() => {
// 	if (!window.ID) return; // fix pss issue
// 	on_size();
// 	window.Repaint();
// });
// } else {
// 	files.forEach(v => include(my_utils.getScriptPath + v));
// }
