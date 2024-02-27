/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Library                                  * //
// * Author:         TT                                                      * //
// * Org. Author:    WilB                                                    * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        2.4.0                                                   * //
// * Dev. started:   18-10-2016                                              * //
// * Last change:    13-05-2023 (Mod change 27-02-2024)                      * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////////////////////////////////////////
// ! IMPORTANT NOTICE AND DOCUMENTATION FOR OTHER DEVS ! //
///////////////////////////////////////////////////////////
// The original library script is designed for use in isolated panel containers to prevent interference with global variables and classes.
// The Georgia-ReBORN theme uses only one Spider Monkey Panel, which shares its global namespace with all scripts.
// To avoid conflicts, several global variables and classes were renamed with a 'lib' prefix to indicate they are library-specific.
// All library class instances were also added to the `lib` main object.

// * GLOBAL VARS * //
// const requiredVersionStr -> libRequiredVersionStr
// const doc                -> libDoc
// const fso                -> libFSO
// const tooltip            -> libTooltip
// const WshShell           -> libWshShell
// const $                  -> $Lib
// const ease               -> libEase
// const md5                -> libMD5

// const img -> libImg

// const lib -> the added lib main object

// let colourSelector -> libColourSelector
// let sync           -> libSync
// const syncer       -> libSyncer

// const MF_GRAYED  -> LIB_MF_GRAYED
// const MF_STRING  -> LIB_MF_STRING
// const clearArr   -> libClearArr
// const menu       -> libMenu
// const fMenu      -> libFMenu
// const sMenu      -> libSMenu
// const searchMenu -> libSearchMenu

// let properties -> libProperties
// const ppt      -> libSet

// const my_utils -> lib_my_utils

// * FUNCTIONS * //
// function is_compatible -> lib_is_compatible
// function Bezier        -> LibBezier
// function MD5           -> LibMD5

// * CLASSES * //
// class Buttons         -> LibButtons
// class Btn             -> LibBtn
// class Tooltip         -> LibTooltip
// class TooltipTimer    -> LibTooltipTimer
// class Transition      -> LibTransition
// class Helpers         -> LibHelpers
// class Images          -> LibImages
// class UserInterface   -> LibUserInterface
// class Vkeys           -> LibVkeys
// class Library         -> LibLibrary
// class MenuManager     -> LibMenuManager
// class MenuItems       -> LibMenuItems
// class Panel           -> LibPanel
// class Populate        -> LibPopulate
// class PopUpBox        -> LibPopUpBox
// class PanelProperty   -> LibPanelProperty
// class PanelProperties -> LibPanelProperties
// class Scrollbar       -> LibScrollbar
// class Search          -> LibSearch
// class Find            -> LibFind
// class Timers          -> LibTimers


////////////////////////////////////////////////
// ! ALL FILES LOADED IN GR-ASYNC-LOADER.JS ! //
////////////////////////////////////////////////
if (typeof lib_my_utils === 'undefined') include(`${grPath.base}scripts\\library\\scripts\\lib-utils.js`);

// const loadAsync = window.GetProperty('Panel Library - Load Library Tree Asynchronously', true);

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(lib_my_utils.getScriptPath + file);
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
// 	files.forEach(v => include(lib_my_utils.getScriptPath + v));
// }
