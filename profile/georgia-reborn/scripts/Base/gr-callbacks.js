/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Callbacks                                * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    17-08-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////
// * MAIN CALLBACKS * //
////////////////////////
/**
 * Called when thread created by utils.GetAlbumArtAsync is done.
 * @global
 * @param {FbMetadbHandle} metadb - The metadb of the track.
 * @param {number} art_id - See Flags.js > AlbumArtId.
 * @param {GdiBitmap} image - Null on failure.
 * @param {string} image_path - The path to image file (or music file if image is embedded).
 */
function on_get_album_art_done(metadb, art_id, image, image_path) {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_get_album_art_done');
		pl.call.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_get_album_art_done');
		lib.call.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_get_album_art_done');
		bio.call.on_get_album_art_done(metadb, art_id, image, image_path);
	}
}


/**
 * Called when thread created by gdi.LoadImageAsync is done.
 * @global
 * @param {number} cookie - The return value from the gdi.LoadImageAsync call.
 * @param {GdiBitmap} imagenullable - Null on failure (invalid path/not an image).
 * @param {string} image_path - The path that was originally supplied to gdi.LoadImageAsync.
 */
function on_load_image_done(cookie, imagenullable, image_path) {
	CallLog('Biography => on_load_image_done');
	bio.call.on_load_image_done(cookie, imagenullable, image_path);
}


/**
 * Called when metadb contents change, i.e tag or database updates.
 * @global
 * @param {FbMetadbHandleList} [handle_list] - Can be undefined when called manually from on_playback_new_track.
 * @param {boolean} [fromhook] - True if notification is not from tag update, but a component that provides tag-like data from a database.
 */
function on_metadb_changed(handle_list, fromhook) {
	DebugLog(`Playback => on_metadb_changed(): ${handle_list ? handle_list.Count : '0'} handles, fromhook: ${fromhook}`);

	grm.ui.handlePlaybackMetadb(handle_list);

	// * Not called manually from on_playback_new_track
	if (handle_list) {
		if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork || !grm.ui.displayPlaylist) {
			CallLog('Playlist => on_metadb_changed');
			pl.call && pl.call.on_metadb_changed(handle_list, fromhook);
		}
		if (grm.ui.displayLibrary) {
			CallLog('Library => on_metadb_changed');
			lib.call && lib.call.on_metadb_changed(handle_list, fromhook);
		}
		if (grm.ui.displayBiography) {
			CallLog('Biography => on_metadb_changed');
			bio.call && bio.call.on_metadb_changed(handle_list, fromhook);
		}
	}

	window.Repaint();
}


/**
 * Called when playing a new track.
 * @global
 * @param {FbMetadbHandle} metadb - The metadb of the track.
 */
function on_playback_new_track(metadb) {
	if (!metadb) return; // Solve weird corner case
	const newTrackProfiler = (grm.ui.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay) && fb.CreateProfiler('on_playback_new_track');
	DebugLog('Playback => on_playback_new_track()');

	grm.ui.handlePlaybackNewTrack(metadb);

	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork || !grm.ui.displayPlaylist) {
		pl.call.on_playback_new_track(metadb);
	}
	if (grm.ui.displayLibrary) {
		lib.call.on_playback_new_track(metadb);
	}
	if (grm.ui.displayBiography) {
		bio.call.on_playback_new_track();
	}

	if (newTrackProfiler) newTrackProfiler.Print();
	if (grCfg.settings.showDebugPerformanceOverlay) grm.ui.debugTimingsArray.push(`on_playback_new_track: ${newTrackProfiler.Time} ms`);
}


/**
 * Called when window is being resized.
 *
 * !IMPORTANT: Do NOT call window.Repaint from this callback!
 * @global
 */
function on_size() {
	grm.ui.ww = window.Width;
	grm.ui.wh = window.Height;

	DebugLog(`in on_size() => width: ${grm.ui.ww}, height: ${grm.ui.wh}`);

	if (grm.ui.ww <= 0 || grm.ui.wh <= 0) return;

	grm.ui.clearCache('metrics');
	grm.details.clearCache('metrics');
	grm.display.checkRes();
	grm.display.handleWindowControl('doubleClick');

	if (!grm.display.sizeInitialized) {
		grm.ui.initPanels();
		grm.display.sizeInitialized = true;
	} else {
		grm.ui.setMainMetrics();
		grm.ui.setMainComponents('all');
		grm.ui.resizeArtwork(true);
		grm.button.createButtons(grm.ui.ww, grm.ui.wh, false);
		grm.ui.displayPlaylist && grm.ui.setPlaylistSize();
		grm.ui.displayLibrary && grm.ui.setLibrarySize();
		grm.ui.displayBiography && grm.ui.setBiographySize();
	}

	grm.ui.displayLyrics && grm.lyrics.initLyrics();
	grm.style.setStyleBlend();
	grm.button.initButtonState();
}


/////////////////////////////////
// * USER ACTIVITY CALLBACKS * //
/////////////////////////////////
/**
 * Called when using letter keystrokes from keyboard.
 *
 * Note: in order to use this callback, use window.DlgCode(DLGC_WANTCHARS).
 * See Flags.js > DLGC_WANTCHARS.
 * @global
 * @param {number} code - The character code.
 */
function on_char(code) {
	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		CallLog('Custom menu => on_char');
		grm.cusMenu.on_char(code);
	}
	else if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || !grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayLibrarySplit(true)) {
		CallLog('Playlist => on_char');
		grm.jSearch.on_char(code);

		// Switch back to Playlist
		if (grSet.layout === 'default' && grm.ui.displayDetails) {
			grm.button.btn.details.onClick();
		}
		else if (grSet.layout === 'artwork' && !grm.ui.displayPlaylistArtwork && !grm.ui.displayLibrary) {
			grm.button.btn.playlist.onClick();
		}
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_char');
		lib.call.on_char(code);
	}
}


/**
 * Called when mouse with content enters another window and determines if that window is a valid drop target.
 *
 * 1. Called first.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt.
 * @global
 * @param {DropTargetAction} action - The type of drag action being performed.
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} mask - The mouse mask.
 */
function on_drag_enter(action, x, y, mask) {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_drag_enter');
		pl.call.on_drag_enter(action, x, y, mask);
	}
}


/**
 * Called when content with mouse moves but stays within the same window.
 *
 * 2. Called after on_drag_enter.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt.
 * @global
 * @param {DropTargetAction} action - The type of drag action being performed.
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} mask - The mouse mask.
 */
function on_drag_over(action, x, y, mask) {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_drag_over');
		pl.call.on_drag_over(action, x, y, mask);
	}
}


/**
 * Called when mouse with content is being dragged outside of window.
 *
 * 3. Called after on_drag_over.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt.
 * @global
 */
function on_drag_leave() {
	if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
		CallLog('Playlist => on_drag_leave');
		pl.call.on_drag_leave();
	}
}


/**
 * Called when mouse with content is being dropped.
 *
 * 4. Called after on_drag_over.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt.
 * @global
 * @param {DropTargetAction} action - The type of drag action being performed.
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} mask - The mouse mask.
 */
function on_drag_drop(action, x, y, mask) {
	if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
		CallLog('Playlist => on_drag_drop');
		pl.call.on_drag_drop(action, x, y, mask);
	}
}


/**
 * Called when the panel gets or loses focus.
 * @global
 * @param {boolean} is_focused - Whether the panel is focused.
 */
function on_focus(is_focused) {
	if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
		CallLog('Playlist => on_focus');
		pl.call.on_focus(is_focused);
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_focus');
		lib.call.on_focus(is_focused);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_focus');
		bio.call.on_focus(is_focused);
	}
	if (is_focused) {
		plman.SetActivePlaylistContext(); // When the panel gets focus but not on every click.
	} else {
		grm.ui.clearTimer('hideCursor'); // Not sure this is required, but I think the mouse was occasionally disappearing
	}
}


/**
 * Called when focused item in panel has been changed.
 * @global
 * @param {number} playlistIndex - The index of the playlist.
 * @param {number} from - The index of the previously focused item.
 * @param {number} to - The index of the item that is gaining focus.
 */
function on_item_focus_change(playlistIndex, from, to) {
	if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
		CallLog('Playlist => on_item_focus_change');
		pl.call.on_item_focus_change(playlistIndex, from, to);
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_item_focus_change');
		lib.call.on_item_focus_change();
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_item_focus_change');
		bio.call.on_item_focus_change();
	}
}


/**
 * Called when pressing down keyboard keys.
 *
 * Requires "Grab focus" enabled in the Configuration window.
 *
 * In order to use arrow keys, use window.DlgCode(DLGC_WANTARROWS) (see Flags.js > DLGC_WANTARROWS).
 *
 * Note: keyboard shortcuts defined in the main preferences are always executed first and are not passed to the callback.
 * @global
 * @param {number} vkey - The virtual key code.
 */
function on_key_down(vkey) {
	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		CallLog('Custom menu => on_key_down');
		grm.cusMenu.on_key_down(vkey);
	}
	else {
		if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
			CallLog('Playlist => on_key_down');
			if (grm.utils.suppressKey(vkey)) return;
			pl.call.on_key_down(vkey);
		}
		else if (grm.ui.displayLibrary) {
			CallLog('Library => on_key_down');
			lib.call.on_key_down(vkey);
		}
		if (grm.ui.displayBiography) {
			CallLog('Biography => on_key_down');
			bio.call.on_key_down(vkey);
		}
	}

	grm.ui.handleKeyAction(vkey);
	grm.display.handleWindowControl('key');
}


/**
 * Called when releasing keyboard keys from pressed state.
 *
 * Requires "Grab focus" enabled in the Configuration window.
 *
 * In order to use arrow keys, use window.DlgCode(DLGC_WANTARROWS) (see Flags.js > DLGC_WANTARROWS).
 * @global
 * @param {number} vkey - The virtual key code.
 */
function on_key_up(vkey) {
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_key_up');
		lib.call.on_key_up(vkey);
	}
	else if (grm.ui.displayBiography) {
		CallLog('Biography => on_key_up');
		bio.call.on_key_up(vkey);
	}
}


/**
 * Called when adding new songs to the media library index.
 * @global
 * @param {FbMetadbHandleList} handle_list - The handle list of the library items.
 */
function on_library_items_added(handle_list) {
	CallLog('Library => on_library_items_added');
	lib.call.on_library_items_added(handle_list);

	CallLog('Biography => on_library_items_added');
	bio.call.on_library_items_added(handle_list);
}


/**
 * Called when media library is being changed, i.e updated by removing/adding tracks.
 * @global
 * @param {FbMetadbHandleList} handle_list - The handle list of the library items.
 */
function on_library_items_changed(handle_list) {
	CallLog('Library => on_library_items_changed');
	lib.call.on_library_items_changed(handle_list);

	CallLog('Biography => on_library_items_changed');
	bio.call.on_library_items_changed(handle_list);
}


/**
 * Called when removing songs from the media library index.
 * @global
 * @param {FbMetadbHandleList} handle_list - The handle list of the library items.
 */
function on_library_items_removed(handle_list) {
	CallLog('Library => on_library_items_removed');
	lib.call.on_library_items_removed(handle_list);

	CallLog('Biography => on_library_items_removed');
	bio.call.on_library_items_removed(handle_list);
}


/**
 * Called when double clicking the left mouse button.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_lbtn_dblclk(x, y, m) {
	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) return;

	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		CallLog('Playlist => on_mouse_lbtn_dblclk');
		pl.call.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		CallLog('Library => on_mouse_lbtn_dblclk');
		lib.call.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		CallLog('Biography => on_mouse_lbtn_dblclk');
		bio.call.on_mouse_lbtn_dblclk(x, y, m);
	}
	else {
		grm.ui.clearTimer('presetIndicator');
		grm.ui.doubleClicked = true;
		if (fb.IsPlaying && !grm.button.mouseInControl && mouseInLowerBar(x, y)) {
			CallLog('Lower bar => on_mouse_lbtn_dblclk');
			// * Refresh theme
			if (grCfg.settings.doubleClickRefresh) {
				grm.ui.refreshTheme();
			}
			// * Pick a new random theme preset
			else if (grSet.presetAutoRandomMode === 'dblclick') {
				grm.ui.themePresetIndicator = true;
				grm.preset.getRandomThemePreset();
			}
			// * Generate a new color in Random theme
			else if (grSet.theme === 'random') {
				grm.ui.initTheme();
				DebugLog('\n>>> initTheme => on_mouse_lbtn_dblclk => random theme <<<\n');
			}
		}
	}
}


/**
 * Called when left mouse button is pressed.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_lbtn_down(x, y, m) {
	SetCursor('Arrow');

	if (grm.button) {
		grm.button.on_mouse_lbtn_down(x, y, m);
	}

	if (grSet.seekbar === 'progressbar' && grm.progBar.mouseInThis(x, y)) {
		CallLog('Progress bar => on_mouse_lbtn_down');
		grm.progBar.on_mouse_lbtn_down(x, y);
	}
	else if (grSet.seekbar === 'peakmeterbar' && grm.peakBar.mouseInThis(x, y)) {
		CallLog('Peakmeter bar => on_mouse_lbtn_down');
		grm.peakBar.on_mouse_lbtn_down(x, y);
	}
	else if (!grm.volBtn.on_mouse_lbtn_down(x, y, m)) { // Not handled by volumeBtn
		if (grSet.showProgressBar_layout && mouseInSeekbar(x, y)) {
			grm.ui.handleSeekbarPlayback(x);
		}

		if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
			CallLog('Custom menu => on_mouse_lbtn_down');
			grm.cusMenu.on_mouse_lbtn_down(x, y, m);
		}

		if (grCfg.updateHyperlink && !fb.IsPlaying && grCfg.updateHyperlink.trace(x, y)) {
			CallLog('Hyperlink => on_mouse_lbtn_down');
			grCfg.updateHyperlink.click();
		}

		if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
			if (grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) return;
			CallLog('Playlist => on_mouse_lbtn_down');
			pl.call.on_mouse_lbtn_down(x, y, m);
		}
		else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
			CallLog('Library => on_mouse_lbtn_down');
			lib.call.on_mouse_lbtn_down(x, y, m);
		}
		if (grm.ui.displayBiography && mouseInBiography(x, y)) {
			CallLog('Biography => on_mouse_lbtn_down');
			bio.call.on_mouse_lbtn_down(x, y, m);
		}
		if (grm.ui.displayLyrics && mouseInAlbumArt(x, y)) {
			MoveLog('Lyrics => on_mouse_lbtn_down');
			grm.lyrics.on_mouse_lbtn_down(x, y, m);
		}

		// * Clicking on album art or noAlbumArtStub to pause playback
		if (mouseInPause(x, y)) {
			setTimeout(() => { // Differentiate between a lyrics drag scroll and a normal click
				if (!grm.lyrics.scrollDrag) fb.PlayOrPause();
			}, grm.ui.displayLyrics ? 200 : 0);
		}
	}
}


/**
 * Called when left mouse button is released from pressed state.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_lbtn_up(x, y, m) {
	if (grm.button) {
		grm.button.on_mouse_lbtn_up(x, y, m);
	}

	if (grSet.seekbar === 'progressbar') {
		CallLog('Progress bar => on_mouse_lbtn_up');
		grm.progBar.on_mouse_lbtn_up(x, y);
	} else if (grSet.seekbar === 'peakmeterbar') {
		CallLog('Peakmeter bar => on_mouse_lbtn_up');
		grm.peakBar.on_mouse_lbtn_up(x, y);
	} else if (grSet.seekbar === 'waveformbar') {
		CallLog('Waveform bar => on_mouse_lbtn_up');
		grm.waveBar.on_mouse_lbtn_up(x, y, m);
	}

	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		CallLog('Custom menu => on_mouse_lbtn_up');
		grm.cusMenu.on_mouse_lbtn_up(x, y, m);
	}

	if (grm.volBtn.on_mouse_lbtn_up(x, y, m)) return;

	// Not handled by volumeBtn
	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit()) && mouseInPlaylist(x, y)) {
		if (grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) return;
		CallLog('Playlist => on_mouse_lbtn_up');
		pl.call.on_mouse_lbtn_up(x, y, m);

		if (!grSet.lockPlayerSize) grm.utils.enableSizing(m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		if (grm.ui.displayCustomThemeMenu && grSet.libraryLayout === 'split') return;
		CallLog('Library => on_mouse_lbtn_up');
		lib.call.on_mouse_lbtn_up(x, y, m);
	}
	if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		CallLog('Biography => on_mouse_lbtn_up');
		bio.call.on_mouse_lbtn_up(x, y, m);
	}
	if (grm.ui.displayLyrics && mouseInAlbumArt(x, y)) {
		MoveLog('Lyrics => on_mouse_lbtn_up');
		grm.lyrics.on_mouse_lbtn_up(x, y, m);
	}

	if (grm.ui.doubleClicked) {
		grm.ui.doubleClicked = false; // You just did a double-click, so do nothing
	}

	on_mouse_move(x, y);
}


/**
 * Called when mouse leaves the window.
 * @global
 */
function on_mouse_leave() {
	if (grSet.showVolumeBtn_layout && grm.volBtn) {
		CallLog('Volume button => on_mouse_leave');
		grm.volBtn.on_mouse_leave();
	}
	if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
		CallLog('Playlist => on_mouse_leave');
		pl.call.on_mouse_leave();
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_mouse_leave');
		lib.call.on_mouse_leave();
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_mouse_leave');
		bio.call.on_mouse_leave();
	}
	if (grm.ui.displayLyrics) {
		MoveLog('Lyrics => on_mouse_leave');
		grm.lyrics.on_mouse_leave();
	}
}


/**
 * Called when middle mouse (wheel) button is double clicked.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_mbtn_dblclk(x, y, m) {
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_mouse_mbtn_dblclk');
		lib.call.on_mouse_mbtn_dblclk(x, y, m);
	}
}


/**
 * Called when middle mouse (wheel) button is pressed.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_mbtn_down(x, y, m) {
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_mouse_mbtn_down');
		lib.call.on_mouse_mbtn_down(x, y, m);
	}
}


/**
 * Called when middle mouse (wheel) button is released from pressed state.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_mbtn_up(x, y, m) {
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_mouse_mbtn_up');
		lib.call.on_mouse_mbtn_up(x, y, m);
	}
	else if (grm.ui.displayBiography) {
		CallLog('Biography => on_mouse_mbtn_up');
		bio.call.on_mouse_mbtn_up(x, y, m);
	}
}


/**
 * Called when mouse moves in the panel.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_move(x, y, m) {
	if (x === grm.ui.state.mouse_x && y === grm.ui.state.mouse_y) return;

	grm.ui.state.mouse_x = x;
	grm.ui.state.mouse_y = y;
	grm.display.setWindowDrag(x, y);
	grm.utils.setMouseCursor(x, y);

	if (!lib.but.cur && !bio.but.cur) { // Needed for Library and Biography button hover
		grm.ui.styledTooltipText = '';
	}

	if (grm.button) grm.button.on_mouse_move(x, y, m);
	if (grCfg.updateHyperlink) grCfg.updateHyperlink.on_mouse_move(grCfg.updateHyperlink, x, y);

	if (grSet.seekbar === 'progressbar') {
		grm.progBar.on_mouse_move(x, y);
	} else if (grSet.seekbar === 'peakmeterbar') {
		grm.peakBar.on_mouse_move(x, y, m);
	} else if (grSet.seekbar === 'waveformbar') {
		grm.waveBar.on_mouse_move(x, y, m);
	}

	// * Top menu compact - collapse top menu to compact when mouse is out of top menu area
	if (grSet.topMenuCompact && !grSet.showTopMenuCompact && grm.ui.state.mouse_y > grm.ui.topMenuHeight * 2) { // Start collapse
		grSet.showTopMenuCompact = true;
		setTimeout(() => {
			grm.button.topMenu(true);
		}, 3000);
		return;
	}

	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		CallLog('Custom menu => on_mouse_move');
		grm.cusMenu.on_mouse_move(x, y, m);
		return;
	}

	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		MoveLog('Playlist => on_mouse_move');
		if (grm.utils.suppressMouseMove(x, y, m)) return;
		grm.utils.disableSizing(m);
		pl.call.on_mouse_move(x, y, m);
		return;
	}
	if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		MoveLog('Library => on_mouse_move');
		lib.call.on_mouse_move(x, y, m);
		return;
	}
	if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		MoveLog('Biography => on_mouse_move');
		bio.call.on_mouse_move(x, y, m);
		return;
	}
	if (grm.ui.displayLyrics && mouseInAlbumArt(x, y)) {
		MoveLog('Lyrics => on_mouse_move');
		grm.lyrics.on_mouse_move(x, y, m);
		return;
	}
	if (grm.ui.displayDetails && !mouseInLowerBar(x, y)) {
		CallLog('Details => on_mouse_move');
		grm.details.on_mouse_move(x, y, m);
		return;
	}

	if (mouseInLowerBar(x, y, true)) {
		CallLog('Lower bar tooltip => on_mouse_move');
		grm.ui.handleLowerBarTooltip(x, y)
		return;
	}

	if (grSet.showTransportControls_layout && grSet.showVolumeBtn_layout) {
		grm.volBtn.on_mouse_move(x, y, m);
	}
}


/**
 * Called when right mouse button is pressed.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 */
function on_mouse_rbtn_down(x, y, m) {
	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y) &&
		!(grm.ui.displayCustomThemeMenu && grm.ui.displayBiography)) {
		CallLog('Playlist => on_mouse_rbtn_down');
		pl.call.on_mouse_rbtn_down(x, y, m);
	}
}


/**
 * Called when right mouse button is released from pressed state.
 *
 * You must return true, if you want to suppress the default context menu.
 *
 * Note: left shift + left windows key will bypass this callback and will open default context menu.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} m - The mouse mask.
 * @returns {boolean} True to suppress the default context menu, otherwise depends on internal conditions.
 */
function on_mouse_rbtn_up(x, y, m) {
	const cmm = new ContextMainMenu();

	const handleContextMenu = (x, y) => {
		grm.ui.activeMenu = true;
		cmm.execute(x, y);
		grm.ui.activeMenu = false;
	};

	if (mouseInTopMenu(x, y)) {
		CallLog('Top menu => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuTopBar(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInAlbumArt(x, y) || grm.details.mouseInMetadataGrid(x, y, 'grid')) {
		CallLog('Album art => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuAlbumCover(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInLowerBar(x, y) && !mouseInSeekbar(x, y)) {
		CallLog('Lower bar => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuLowerBar(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInSeekbar(x, y)) {
		CallLog('Seekbar => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuSeekbar(cmm);
		handleContextMenu(x, y);
		return true;
	}

	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		CallLog('Playlist => on_mouse_rbtn_up');
		return pl.call.on_mouse_rbtn_up(x, y, m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		CallLog('Library => on_mouse_rbtn_up');
		return lib.call.on_mouse_rbtn_up(x, y, m);
	}
	else if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		CallLog('Biography => on_mouse_rbtn_up');
		return bio.call.on_mouse_rbtn_up(x, y, m);
	}
	else {
		return !grCfg.settings.showPanelContextMenu;
	}
}


/**
 * Called when using the mouse wheel, also used to cycle through album artworks and control the seekbar.
 * @global
 * @param {number} step - The scroll direction: -1 or 1.
 */
function on_mouse_wheel(step) {
	if (mouseInTopMenu(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		KeyPressAction({
			ctrlNoShift: () => grm.display.setMenuFontSize(step),
			altNoShift: () => grm.display.setMenuFontSize(0)
		});
		return;
	}

	if (mouseInAlbumArt() && grSet.cycleArtMWheel && grm.ui.albumArtList.length > 1 && !grm.ui.displayLyrics) {
		grm.ui.cycleAlbumArtImage(step);
		return;
	}

	if (mouseInTransport(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		KeyPressAction({
			ctrlNoShift: () => grm.display.setTransportBtnSize(step),
			altNoShift: () => grm.display.setTransportBtnSize(0),
			altShift: () => grm.display.setTransportBtnSpacing(0),
			shiftNoAlt: () => grm.display.setTransportBtnSpacing(step)
		});
		grSet.showVolumeBtn_layout && grm.volBtn.on_mouse_wheel(step);
		return;
	}

	if (mouseInSeekbar(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		grm.ui.handleSeekbarPlayback(0, step);
		return;
	}

	if (mouseInLowerBar(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		KeyPressAction({
			ctrlNoShift: () => grm.display.setLowerBarFontSize(step),
			altNoShift: () => grm.display.setLowerBarFontSize(0)
		});
		return;
	}

	if (grm.ui.displayDetails) {
		if (grm.details.mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, 'artist')) {
			KeyPressAction({
				ctrlNoShift: () => grm.display.setGridArtistFontSize(step),
				altNoShift: () => grm.display.setGridArtistFontSize(0)
			});
			return;
		}
		if (grm.details.mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, 'title')) {
			KeyPressAction({
				ctrlNoShift: () => grm.display.setGridTitleFontSize(step),
				altNoShift: () => grm.display.setGridTitleFontSize(0)
			});
			return;
		}
		if (grm.details.mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, 'album')) {
			KeyPressAction({
				ctrlNoShift: () => grm.display.setGridAlbumFontSize(step),
				altNoShift: () => grm.display.setGridAlbumFontSize(0)
			});
			return;
		}
		if (grm.details.mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, 'tagKey')) {
			KeyPressAction({
				ctrlNoShift: () => grm.display.setGridTagKeyFontSize(step),
				altNoShift: () => grm.display.setGridTagKeyFontSize(0)
			});
			return;
		}
		if (grm.details.mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, 'tagValue')) {
			KeyPressAction({
				ctrlNoShift: () => grm.display.setGridTagValueFontSize(step),
				altNoShift: () => grm.display.setGridTagValueFontSize(0)
			});
			return;
		}
		return;
	}
	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		CallLog('Playlist => on_mouse_wheel');
		KeyPressAction({
			ctrlNoShift: () => grm.display.setPlaylistFontSize(step),
			altNoShift: () => grm.display.setPlaylistFontSize(0),
			default: () => pl.call.on_mouse_wheel(step)
		});
	} else if (grm.ui.displayLibrary && mouseInLibrary(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		CallLog('Library => on_mouse_wheel');
		KeyPressAction({
			ctrlNoShift: () => grm.display.setLibraryFontSize(step),
			altNoShift: () => grm.display.setLibraryFontSize(0),
			default: () => lib.call.on_mouse_wheel(step)
		});
	} else if (grm.ui.displayBiography && mouseInBiography(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		CallLog('Biography => on_mouse_wheel');
		KeyPressAction({
			ctrlNoShift: () => grm.display.setBiographyFontSize(step),
			altNoShift: () => grm.display.setBiographyFontSize(0),
			default: () => bio.call.on_mouse_wheel(step)
		});
	} else if (grm.ui.displayLyrics && mouseInAlbumArt()) {
		KeyPressAction({
			ctrlNoShift: () => grm.display.setLyricsFontSize(step),
			altNoShift: () => grm.display.setLyricsFontSize(0),
			default: () => grm.lyrics.on_mouse_wheel(step)
		});
	}
}


/**
 * Called in other panels after window.NotifyOthers is executed.
 * @global
 * @param {string} name - The name of the data that was updated.
 * @param {*} info - The data that was updated:
 *
 * - 1. Data from `info` argument is only accessible inside `on_notify_data` callback:
 * if stored and accessed outside of the callback it will throw JS error.
 * This also applies to the data produced from that `info`: e.g. storing `info.Path` directly (if `info` is FbMetadbHandle).
 *
 * - 2. If you want to store the data from `info` you have to perform a deep copy:
 * `String(info)` for strings.
 * `JSON.parse(JSON.stringify(info))` for serializable objects.
 * `new ObjectType(info)` for objects that have an appropriate constructor available, e.g. `new GdiBitmap(info)` or `new FbMetadbHandleList(info)`.
 *
 * - 3. `info` argument is shared between panels, so it should NOT be modified in any way.
 */
function on_notify_data(name, info) {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_notify_data');
		pl.call.on_notify_data(name, info);
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_notify_data');
		lib.call.on_notify_data(name, info);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_notify_data');
		bio.call.on_notify_data(name, info);
	}
}


/**
 * Called when Per-track dynamic info (stream track titles etc) changes.
 *
 * Happens less often than on_playback_dynamic_info.
 * @global
 */
function on_playback_dynamic_info_track() {
	// How frequently does this get called?
	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : null;
	on_playback_new_track(metadb);

	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playback_dynamic_info_track');
		pl.call.on_playback_dynamic_info_track();
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playback_dynamic_info_track');
		bio.call.on_playback_dynamic_info_track();
	}
	if (grm.ui.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		grm.lyrics.initLyrics();
	}
}


/**
 * Called when playback order is changed via the transport playback order button or foobar's playback menu.
 * @global
 * @param {number} pbo - The playback order has following settings:
 * - 0 - Default.
 * - 1 - Repeat (Playlist).
 * - 2 - Repeat (Track).
 * - 3 - Random, 4 Shuffle (tracks).
 * - 5 - Shuffle (albums).
 * - 6 - Shuffle (folders).
 */
function on_playback_order_changed(pbo) {
	CallLog('Main => on_playback_order_changed');
	grm.ui.handlePlaybackOrder(pbo);
}


/**
 * Called when pausing current playing track.
 * @global
 * @param {boolean} state - Whether the playback is paused or not.
 */
function on_playback_pause(state) {
	grm.ui.handlePlaybackPause(state);

	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playback_pause');
		pl.call.on_playback_pause(state);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playback_pause');
		bio.call.on_playback_pause(state);
	}
	if ((grm.ui.albumArt || grm.ui.noAlbumArtStub) && grm.ui.displayLyrics) { // If we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		CallLog('Lyrics => on_playback_pause');
		grm.lyrics.on_playback_pause(state);
	}
}


/**
 * Called when adding new playlist tracks in queue.
 * @global
 * @param {number} origin - The parameter has following settings:
 * - 0 - User added.
 * - 1 - User removed.
 * - 2 - Playback advance.
 */
function on_playback_queue_changed(origin) {
	CallLog('Playlist => on_playback_queue_changed');
	pl.call.on_playback_queue_changed(origin);
	lib.call.on_playback_queue_changed();
}


/**
 * Called when playback time is being seeked, float value in seconds.
 * @global
 */
function on_playback_seek() {
	on_playback_time();

	grm.ui.handlePlaybackSeek();

	if (grm.ui.displayBiography) {
		bio.call.on_playback_seek();
	}
}


/**
 * Called when playback process is being initialized, on_playback_new_track should be called soon after this when first file is successfully opened for decoding.
 * @global
 * @param {number} cmd - The command has following settings:
 * - 0 - Default.
 * - 1 - Play.
 * - 2 - Plays the next track from the current playlist according to the current playback order.
 * - 3 - Plays the previous track from the current playlist according to the current playback order.
 * - 4 - settrack (internal fb2k value).
 * - 5 - Plays a random track from the current playlist.
 * - 6 - resume (internal fb2k value).
 * @param {boolean} is_paused - Whether the playback is paused.
 */
function on_playback_starting(cmd, is_paused) {
	grm.ui.handlePlaybackStart();
}


/**
 * Called when playback is stopped.
 * @global
 * @param {number} reason - The playback stop has following settings:
 * - 0 - Invoked by user.
 * - 1 - End of file.
 * - 2 - Starting another track.
 * - 3 - Fb2k is shutting down.
 */
function on_playback_stop(reason) {
	DebugLog('Playback => Repainting on_playback_stop:', reason);

	grm.ui.handlePlaybackStop(reason);
	grm.waveBar.on_playback_stop(reason);

	// The playing playlist state always needs to be cleared when the Playlist is not displayed,
	// i.e., when the startup panel is not set to `Playlist` and when clicking on the stop button.
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork || grSet.showPanelOnStartup !== 'playlist') {
		CallLog('Playlist => on_playback_stop');
		pl.call.on_playback_stop(reason);
	}
	else if (grm.ui.displayLibrary) {
		CallLog('Library => on_playback_stop');
		lib.call.on_playback_stop(reason);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playback_stop');
		bio.call.on_playback_stop(reason);
	}
	if (grm.ui.displayLyrics) {
		grm.ui.initLyricsDisplayState('stopTrack');
		grm.lyrics.on_playback_stop(reason);
	}
}


/**
 * Refresh playback time plus playback time remaining every second.
 * @global
 */
function on_playback_time() {
	grm.ui.handlePlaybackTime();
	grm.waveBar.on_playback_time(fb.PlaybackTime);
	grm.ui.displayBiography && bio.call.on_playback_time();
}


/**
 * Called when clicking on playlist items that are visible in the playlist panel.
 * @global
 * @param {number} playlistIndex - The index of the playlist.
 * @param {number} playlistItemIndex - The index of the playlist item.
 */
function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlist_item_ensure_visible');
		pl.call.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}


/**
 * Called when adding tracks to the playlist.
 * @global
 * @param {number} playlistIndex - The index of the playlist.
 */
function on_playlist_items_added(playlistIndex) {
	if (pl.history) {
		pl.history.playlistAltered(PlaylistMutation.Added);
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlist_items_added');
		pl.call.on_playlist_items_added(playlistIndex);
	}
	if (grm.ui.displayLibrary || grm.ui.displayLibrarySplit()) {
		CallLog('Library => on_playlist_items_added');
		lib.call.on_playlist_items_added(playlistIndex);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playlist_items_added');
		bio.call.on_playlist_items_added(playlistIndex);
	}
}


/**
 * Called when removing tracks from the playlist.
 * @global
 * @param {number} playlistIndex - The index of the playlist.
 */
function on_playlist_items_removed(playlistIndex) {
	if (pl.history) {
		pl.history.playlistAltered(PlaylistMutation.Removed);
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlist_items_removed');
		pl.call.on_playlist_items_removed(playlistIndex);
	}
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_playlist_items_removed');
		lib.call.on_playlist_items_removed(playlistIndex);
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playlist_items_removed');
		bio.call.on_playlist_items_removed(playlistIndex);
	}
}


/**
 * Called when reordering tracks in the playlist, i.e by dragging them up or down.
 * Changes selection too. Doesn't actually change the set of items that are selected or item having focus, just changes their order.
 * @global
 * @param {number} playlistIndex - The index of the playlist.
 */
function on_playlist_items_reordered(playlistIndex) {
	if (pl.history) {
		pl.history.playlistAltered(PlaylistMutation.Reordered);
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlist_items_reordered');
		pl.call.on_playlist_items_reordered(playlistIndex);
	}
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_playlist_items_reordered');
		lib.call.on_playlist_items_reordered(playlistIndex);
	}
}


/**
 * Called as a workaround for some 3rd party playlist viewers not working with on_selection_changed.
 * @global
 */
function on_playlist_items_selection_change() {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlist_items_selection_change');
		pl.call.on_playlist_items_selection_change();
		grm.ui.initBrowseMode();
	}
}


/**
 * Called when switching the current active playlist to another.
 * @global
 */
function on_playlist_switch() {
	if (pl.history) {
		pl.history.playlistAltered(PlaylistMutation.Switch);
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlist_switch');
		pl.call.on_playlist_switch();
	}
	if (grm.ui.displayLibrary || libSet.libSource === 0) {
		CallLog('Library => on_playlist_switch');
		lib.call.on_playlist_switch();
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playlist_switch');
		bio.call.on_playlist_switch();
	}
}


/**
 * Called when playlists are added/removed/reordered/renamed or a playlist's lock status changes.
 * @global
 */
function on_playlists_changed() {
	if (pl.history) {
		pl.history.reset(); // When playlists are changed, indexes no longer apply, and so we have to wipe history
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		CallLog('Playlist => on_playlists_changed');
		pl.call.on_playlists_changed();
	}
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_playlists_changed');
		lib.call.on_playlists_changed();
	}
	if (grm.ui.displayBiography) {
		CallLog('Biography => on_playlists_changed');
		bio.call.on_playlists_changed();
	}
}


/**
 * Called when script is reloaded via context menu > Reload or script is changed via panel menu > Configure or fb2k is exiting normally.
 * @global
 */
function on_script_unload() {
	DebugLog('Unloading Script');
	grm.waveBar.on_script_unload();

	// It appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_script_unload');
		lib.call.on_script_unload();
	}

	CallLog('Biography => on_script_unload');
	bio.call.on_script_unload();
}


/**
 * Called when selection changes based on File > Preferences > Display > Selection viewers.
 * @global
 */
function on_selection_changed() {
	if (grm.ui.displayLibrary) {
		CallLog('Library => on_selection_changed');
		lib.call.on_selection_changed();
		grm.ui.initBrowseMode();
	}
}


/**
 * Called when volume changes, i.e the volume bar in the volume button.
 * @global
 * @param {number} val - The volume level in dB. Minimum is -100. Maximum is 0.
 */
function on_volume_change(val) {
	CallLog('Volume bar => on_volume_change');
	grm.volBtn.on_volume_change(val);
}


//////////////////////////
// * CUSTOM CALLBACKS * //
//////////////////////////
/**
 * Checks if the mouse is within the boundaries of the top menu.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInTopMenu(x, y) {
	if (x < grm.ui.ww - SCALE(100) && y < grm.ui.topMenuHeight) {
		MoveLog('mouseInTopMenu');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the album art.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInAlbumArt(x, y) {
	const displayAlbumArt =
		grSet.layout === 'default' && !grm.ui.displayBiography && (grm.ui.displayPlaylist && !grm.ui.displayLibrary && grSet.playlistLayout !== 'full' // Playlist
		||
		grm.ui.displayLibrary && grSet.libraryLayout === 'normal' && grSet.libraryDesign !== 'flowMode' // Library
		||
		!grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayLyrics) // Details, Lyrics
		||
		grSet.layout === 'artwork' && !grm.ui.displayBiography && (grm.ui.displayPlaylist || !grm.ui.displayPlaylistArtwork && !grm.ui.displayLibrary); // Cover, Details, Lyrics

	const albumArtBounds =
		grm.ui.state.mouse_x > grm.ui.albumArtSize.x && grm.ui.state.mouse_x <= grm.ui.albumArtSize.x + grm.ui.albumArtSize.w
		&&
		grm.ui.state.mouse_y > grm.ui.albumArtSize.y && grm.ui.state.mouse_y <= grm.ui.albumArtSize.y + grm.ui.albumArtSize.h;

	if (fb.IsPlaying && displayAlbumArt && albumArtBounds) {
		MoveLog('mouseInAlbumArt');
		return true;
	}

	if (grm.lyrics.scrollDrag) {
		grm.lyrics.scrollDrag = false;
	}

	return false;
}


/**
 * Checks if the mouse can pause when clicking on the album art or noAlbumArtStub.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInPause(x, y) {
	// * Do not pause when Playlist/Library layout is in full width or when using Library's flow mode
	const panelPlaylist = grm.ui.displayPlaylist && !grm.ui.displayLibrary && !grm.ui.displayBiography && grSet.playlistLayout !== 'full';
	const panelDetails  = grm.ui.displayDetails;
	const panelLibrary  = grm.ui.displayLibrary && grSet.libraryLayout === 'normal' && grSet.libraryDesign !== 'flowMode';
	const panelLyrics   = grm.ui.displayLyrics;
	const artworkLayout = grSet.layout === 'artwork' && !grm.ui.displayDetails && !grm.ui.displayPlaylistArtwork && !grm.ui.displayLibrary && !grm.ui.displayBiography;

	const albumArtBounds   = grm.ui.albumArtSize.x <= x && grm.ui.albumArtSize.y <= y && grm.ui.albumArtSize.x + grm.ui.albumArtSize.w >= x && grm.ui.albumArtSize.y + grm.ui.albumArtSize.h >= y;
	const discArtBounds    = grm.details.discArtSize.x  <= x && grm.details.discArtSize.y  <= y && grm.details.discArtSize.x  + grm.details.discArtSize.w  >= x && grm.details.discArtSize.y  + grm.details.discArtSize.h  >= y;
	const noAlbumArtBounds = grm.ui.state.mouse_x > 0 && grm.ui.state.mouse_x <= (grm.ui.displayPlaylist || grm.ui.displayLibrary ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : !grm.ui.displayPlaylist || !grm.ui.displayLibrary ? grm.ui.ww : grm.ui.ww * 0.5) &&
							 grm.ui.state.mouse_y > grm.ui.albumArtSize.y && grm.ui.state.mouse_y <= grm.ui.albumArtSize.h + grm.ui.topMenuHeight;
	const pauseOnAlbumArt =
		(grSet.layout === 'default' && grm.ui.albumArt && (panelPlaylist || panelDetails || panelLibrary || panelLyrics) || artworkLayout) &&
		!grm.ui.displayCustomThemeMenu && !grm.ui.displayMetadataGridMenu && albumArtBounds || grm.details.discArt && !grm.ui.albumArt && discArtBounds;

	const pauseOnNoAlbumArt =
		(grSet.layout === 'default' && !grm.ui.albumArt && (panelPlaylist || panelDetails || panelLibrary || panelLyrics) || artworkLayout) &&
		!grm.ui.displayCustomThemeMenu && !grm.ui.displayMetadataGridMenu && noAlbumArtBounds;

	if (pauseOnAlbumArt || pauseOnNoAlbumArt) {
		MoveLog('mouseInPause');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the lower bar and within the tooltip area.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {string} tooltip - Wheter to check the artist/title lowerbar tooltip area.
 * @returns {boolean} True or false.
 */
function mouseInLowerBar(x, y, tooltip) {
	if (tooltip) {
		const zoneX = grm.ui.edgeMargin;
		const zoneY = grm.ui.wh - grm.ui.lowerBarHeight + SCALE(15);
		const zoneW = grm.ui.lowerBarAvailableW;
		const zoneH = grm.ui.lowerBarHeight * 0.33;

		if (zoneX <= x && zoneY <= y && zoneX + zoneW >= x && zoneY + zoneH >= y) {
			MoveLog('mouseInLowerBar tooltip');
			return true;
		}
	}
	else if (y > grm.ui.wh - SCALE(120)) {
		MoveLog('mouseInLowerBar');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the transport buttons.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInTransport(x, y) {
	const buttonSize = SCALE(grSet.transportButtonSize_layout);
	const startX = (grm.ui.ww - grm.ui.lowerBarTotalBtnW) / 2;
	const endX = startX + grm.ui.lowerBarTotalBtnW + grm.volBtn.volumeBar.w + buttonSize;
	const startY = grm.ui.lowerBarBtnY;
	const endY = startY + buttonSize;

	if (x >= startX && x <= endX && y >= startY && y <= endY) {
		MoveLog('mouseInTransport');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the seekbar.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInSeekbar(x, y) {
	if (x >= grm.ui.edgeMargin && x < grm.ui.ww - grm.ui.edgeMargin &&
		y >= grm.ui.seekbarY && y <= grm.ui.seekbarY + grm.ui.seekbarHeight * 2) {
		MoveLog('mouseInSeekbar');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the panel.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInPanel(x, y) {
	if (y < grm.ui.topMenuHeight && y > grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight) {
		MoveLog('mouseInPanel');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Playlist.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInPlaylist(x, y) {
	if (x >= pl.playlist.x && x < pl.playlist.x + pl.playlist.w &&
		y >= pl.playlist.y - SCALE(plSet.row_h) && y < pl.playlist.y + pl.playlist.h) {
		MoveLog('Playlist => mouseInPlaylist');
		return true;
	}

	if (PlaylistRow.hovered && PlaylistRow.hovered.is_hovered) {
		PlaylistRow.hovered.is_hovered = false;
		pl.playlist.repaint();
	}

	if (pl.playlist.scrollbar.b_is_dragging) {
		pl.playlist.scrollbar.b_is_dragging = false;
		pl.playlist.scrollbar.desiredScrollPosition = undefined;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Library.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInLibrary(x, y) {
	if (x >= lib.ui.x && x < lib.ui.x + lib.ui.w && y >= lib.ui.y && y < lib.ui.y + lib.ui.h) {
		MoveLog('Library => mouseInLibrary');
		return true;
	}

	if (lib.sbar.bar.isDragging) {
		lib.sbar.bar.isDragging = false;
		lib.but.Dn = false;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Library search.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInLibrarySearch(x, y) {
	if (!lib.but.Dn && x > lib.ui.x + lib.but.q.h + lib.but.margin && x < lib.panel.search.x + lib.panel.search.w &&
		y > lib.ui.y && y < lib.ui.y + lib.panel.search.h && libSet.searchShow) {
		MoveLog('Library => mouseInLibrarySearch');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Biography.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInBiography(x, y) {
	if (x >= bio.ui.x && x < bio.ui.x + bio.ui.w && y >= bio.ui.y && y < bio.ui.y + bio.ui.h) {
		MoveLog('Biography => mouseInBiography');
		return true;
	}

	if (bio.alb_scrollbar.bar.isDragging || bio.art_scrollbar.bar.isDragging || bio.art_scroller.bar.isDragging || bio.cov_scroller.bar.isDragging) {
		bio.alb_scrollbar.bar.isDragging = false;
		bio.art_scrollbar.bar.isDragging = false;
		bio.art_scroller.bar.isDragging = false;
		bio.cov_scroller.bar.isDragging = false;
		bio.but.Dn = false;
	}

	if (bio.lyrics.scrollDrag) {
		bio.lyrics.scrollDrag = false;
	}

	return false;
}
