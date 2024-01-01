/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Biography                            * //
// * Author:         TT                                                  * //
// * Org. Author:    WilB                                                * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        1.4.2                                               * //
// * Dev. started:   2016-10-18                                          * //
// * Last change:    2023-12-13 (Mod change 2023-12-24)                  * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////////////////////
// ! ALL FILES LOADED IN GR-ASYNC-LOADER.JS ! //
////////////////////////////////////////////////
let biographyInitialized = false;
let isRadioStreamParser = false;

if (typeof my_utilsBio === 'undefined') include(`${basePath}scripts\\biography\\scripts\\bio-utils.js`);
// include(fb.ProfilePath + 'elements\\colourSelector.js'); // sort handling n/a standalone

// const loadAsync = false; // window.GetProperty('Panel Biography - Load Biography Asynchronously', true); // changed to false: issue on loading fth with many panels

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(my_utilsBio.getScriptPath + file);
// 		}
// 	}
// }

// const files = [
// 	'bio-helpers.js',
// 	'bio-properties.js',
// 	'bio-settings.js',
// 	'bio-interface.js',
//     'bio-language.js',
// 	'bio-panel.js',
// 	'bio-server.js',
// 	'bio-allmusic.js',
// 	'bio-lastfm.js',
// 	'bio-wikipedia.js',
// 	'bio-names.js',
// 	'bio-scrollbar.js',
// 	'bio-buttons.js',
// 	'bio-menu.js',
// 	'bio-text.js',
// 	'bio-lyrics.js',
// 	'bio-tagger.js',
// 	'bio-resize.js',
// 	'bio-library.js',
// 	'bio-images.js',
// 	'bio-filmstrip.js',
// 	'bio-timers.js',
// 	'bio-popupbox.js',
// 	'bio-initialise.js',
// 	'bio-callbacks.js'
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
