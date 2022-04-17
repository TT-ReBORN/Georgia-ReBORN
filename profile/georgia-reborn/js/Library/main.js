'use strict';

if (typeof my_utilsLib === 'undefined') include(`${basePath}js\\library\\scripts\\utils.js`);

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
