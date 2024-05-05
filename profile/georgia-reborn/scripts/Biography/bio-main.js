/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Biography                                * //
// * Author:         TT                                                      * //
// * Org. Author:    WilB                                                    * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        1.4.2                                                   * //
// * Dev. started:   18-10-2016                                              * //
// * Last change:    13-12-2023 (Mod change 05-05-2024)                      * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////////////////////////////////////////
// ! IMPORTANT NOTICE AND DOCUMENTATION FOR OTHER DEVS ! //
///////////////////////////////////////////////////////////
// The original biography script is designed for use in isolated panel containers to prevent interference with global variables and classes.
// The Georgia-ReBORN theme uses only one Spider Monkey Panel, which shares its global namespace with all scripts.
// To avoid conflicts, several global variables and classes were renamed with a 'bio' prefix to indicate they are biography-specific.
// All biography class instances were also added to the `bio` main object.

// * GLOBAL VARS * //
// let isRadioStreamParser -> bioIsRadioStreamParser

// const parse -> bioParse

// const requiredVersionStr -> bioRequiredVersionStr
// const doc                -> bioDoc
// const fso                -> bioFSO
// const tooltip            -> bioTooltip
// const WshShell           -> bioWshShell
// const $                  -> $Bio
// const ease               -> bioEase
// const md5                -> bioMD5
// const codeToCountry      -> bioCodeToCountry
// const countryToCode      -> bioCountryToCode

// const art -> bioArt
// const cov -> bioCov

// const bio -> the added bio main object

// let colourSelector -> bioColourSelector
// let sync           -> bioSync
// const syncer       -> bioSyncer

// const English            -> bioEnglish
// const simplifiedChinese  -> bioSimplifiedChinese
// const traditionalChinese -> bioTraditionalChinese
// const lg                 -> bioLg

// const MF_GRAYED -> BIO_MF_GRAYED
// const MF_STRING -> BIO_MF_STRING
// const clearArr  -> bioClearArr
// const menu      -> bioMenu
// const bMenu     -> bioBMenu

// let properties -> bioProperties
// const ppt      -> bioSet

// const cfg                                -> bioCfg
// let settings                             -> bioSettings
// let item_properties                      -> bio_item_properties
// let item_properties_alternative_grouping -> bio_item_properties_alternative_grouping
// let nowplaying                           -> bioNowplaying
// let radioParser                          -> bioRadioParser

// const my_utils -> bio_my_utils

// * FUNCTIONS * //
// function Bezier        -> BioBezier
// function MD5           -> BioMD5
// function onStateChange -> bioOnStateChange
// function send          -> bioSend

// * CLASSES * //
// class DldAllmusic              -> BioDldAllmusic
// class DldAllmusicRev           -> BioDldAllmusicRev
// class Parse                    -> BioParse
// class Buttons                  -> BioButtons
// class Btn                      -> BioBtn
// class Tooltip                  -> BioTooltip
// class TooltipTimer             -> BioTooltipTimer
// class Transition               -> BioTransition
// class FilmStrip                -> BioFilmStrip
// class Helpers                  -> BioHelpers
// class Images                   -> BioImages
// class ImageCache               -> BioImageCache
// class Seeker                   -> BioSeeker
// class UserInterface            -> BioUserInterface
// class Vkeys                    -> BioVkeys
// class DldLastfm                -> BioDldLastfm
// class DldArtImages             -> BioDldArtImages
// class LfmArtImg                -> BioLfmArtImg
// class LfmAlbum                 -> BioLfmAlbum
// class LfmTrack                 -> BioLfmTrack
// class LfmSimilarArtists        -> BioLfmSimilarArtists
// class LfmTopAlbums             -> BioLfmTopAlbums
// class DldLastfmGenresWhitelist -> BioDldLastfmGenresWhitelist
// class Library                  -> BioLibrary
// class Lyrics                   -> BioLyrics
// class MenuManager              -> BioMenuManager
// class MenuItems                -> BioMenuItems
// class Names                    -> BioNames
// class Panel                    -> BioPanel
// class PopUpBox                 -> BioPopUpBox
// class PanelProperty            -> BioPanelProperty
// class PanelProperties          -> BioPanelProperties
// class ResizeHandler            -> BioResizeHandler
// class Scrollbar                -> BioScrollbar
// class Server                   -> BioServer
// class Setting                  -> BioSetting
// class Settings                 -> BioSettings
// class Tagger                   -> BioTagger
// class Text                     -> BioText
// class Timers                   -> BioTimers
// class DldWikipedia             -> BioDldWikipedia
// class Infobox                  -> BioInfobox


////////////////////////////////////////////////
// ! ALL FILES LOADED IN GR-ASYNC-LOADER.JS ! //
////////////////////////////////////////////////
/** @global @type {boolean} */
let bioIsRadioStreamParser = false;

if (typeof bio_my_utils === 'undefined') include(`${grPath.base}scripts\\biography\\scripts\\bio-utils.js`);
// include(fb.ProfilePath + 'elements\\colourSelector.js'); // sort handling n/a standalone

// const loadAsync = false; // window.GetProperty('Panel Biography - Load Biography Asynchronously', true); // changed to false: issue on loading fth with many panels

// async function readFiles(files) {
// 	for (const file of files) {
// 		if (window.ID) { // fix pss issue
// 			await include(bio_my_utils.getScriptPath + file);
// 		}
// 	}
// }

// const files = [
// 	'bio-helpers.js',
// 	'bio-properties.js',
// 	'bio-settings.js',
// 	'bio-interface.js',
// 	'bio-language.js',
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
// 	files.forEach(v => include(bio_my_utils.getScriptPath + v));
// }
