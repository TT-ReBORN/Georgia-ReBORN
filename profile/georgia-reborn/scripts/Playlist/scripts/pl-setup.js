/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Globals                         * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    04-10-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////
// * ENUMS * //
///////////////
/**
 * A set of drag and drop action settings.
 * @global
 * @enum {number}
 */
const PlaylistDropEffect = {
	none:   0,
	copy:   1,
	move:   2,
	link:   4,
	scroll: 0x80000000
};

/**
 * A set of playlist history state settings.
 * @global
 * @enum {string}
 */
const PlaylistMutation = {
	Added:     'Playlist => added',
	Init:      'Playlist => initializing history',
	Removed:   'Playlist => removed',
	Reordered: 'Playlist => reordered',
	Switch:    'Playlist => switch'
}

/**
 * A set of playlist item visibility state settings.
 * @global
 * @enum {number}
 */
const PlaylistVisibilityState = {
	none:           0,
	partial_top:    1,
	partial_bottom: 2,
	full:           3
};


///////////////////
// * VARIABLES * //
///////////////////
/**
 * The instance of `PanelProperties` class for playlist panel property settings.
 * @typedef {PanelProperties}
 * @global
 */
const plSet = new PanelProperties();

/**
 * A collection of various playlist objects and variables.
 * @typedef  {object} pl - The playlist main object.
 * @property {object} col - The playlist colors object.
 * @property {object} font - The playlist fonts object.
 * @property {object} geo - The playlist geometry object.
 * @property {boolean} cache_header - The playlist header cache state, must be deactivated on bg color and playlist size changes.
 * @property {PlaylistHistory} history - The playlist history object.
 * @property {boolean} history_used - The playlist history state, used for playlist scroll.
 * @property {Map} header_group_info - The playlist header group info text cached.
 * @property {Map} artist_ratings - The playlist artist ratings cached.
 * @property {Map} album_ratings - The playlist album ratings cached.
 * @property {Map} track_ratings - The playlist track ratings cached.
 * @property {FbMetadbHandle[]} thumbnail_list - The list of handles that we are loading artwork for.
 * @property {number} thumbnail_size - The playlist thumbnail size defaults are 64 pixels in HD 128 in 4K.
 * @property {PlaylistCallbacks} call - The instance of `PlaylistCallbacks` class for callback operations.
 * @property {PlaylistManager} plman - The instance of `PlaylistManager` class for playlist manager operations.
 * @property {Playlist} playlist - The instance of `Playlist` class for main playlist operations.
 */
/** @global @type {pl} */
const pl = {
	col: {},
	font: {},
	geo: {},
	cache_header: true,
	history: undefined,
	history_used: false,
	header_group_info: new Map(),
	artist_ratings: new Map(),
	album_ratings: new Map(),
	track_ratings: new Map(),
	thumbnail_list: new Set(),
	thumbnail_size: SCALE(64),
	call: undefined,
	plman: undefined,
	playlist: undefined
};
