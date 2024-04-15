/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Callbacks                                * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    15-04-2024                                              * //
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
		grm.ui.traceCall && console.log('Playlist => on_get_album_art_done');
		pl.call.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_get_album_art_done');
		lib.call.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_get_album_art_done');
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
	grm.ui.traceCall && console.log('Biography => on_load_image_done');
	bio.call.on_load_image_done(cookie, imagenullable, image_path);
}


/**
 * Called when metadb contents change, i.e tag or database updates.
 * @global
 * @param {FbMetadbHandleList} [handle_list] - Can be undefined when called manually from on_playback_new_track.
 * @param {boolean} [fromhook] - True if notification is not from tag update, but a component that provides tag-like data from a database.
 */
function on_metadb_changed(handle_list, fromhook) {
	console.log(`on_metadb_changed(): ${handle_list ? handle_list.Count : '0'} handles, fromhook: ${fromhook}`);
	if (fb.IsPlaying) {
		let nowPlayingUpdated = !handle_list; // If we don't have a handle_list we called this manually from on_playback_new_track
		const metadb = fb.GetNowPlaying();

		if (metadb && handle_list) {
			for (let i = 0; i < handle_list.Count; i++) {
				if (metadb.RawPath === handle_list[i].RawPath) {
					nowPlayingUpdated = true;
					break;
				}
			}
		}

		if (nowPlayingUpdated) {
			// * The handle_list contains the currently playing song so update
			const title = $(grTF.title);
			const artist = $(grTF.artist);
			const composer = $(grTF.composer);
			const originalArtist = $(grTF.original_artist);
			const tracknum = grSet.showVinylNums ? $(grTF.vinyl_track) : $(grTF.tracknum);

			grStr.tracknum = tracknum.trim();
			grStr.title = title + originalArtist;
			grStr.titleLower = title;
			grStr.original_artist = originalArtist;
			grStr.artist = artist;
			grStr.composer = composer;
			grStr.year = $(grTF.year);
			if (grStr.year === '0000') {
				grStr.year = '';
			}
			grStr.album = $(`[%album%][ '['${grTF.album_translation}']']`);
			grStr.album_subtitle = $(`[ '['${grTF.album_subtitle}']']`);
			let codec = $('$lower($if2(%codec%,$ext(%path%)))');
			if (codec === 'dca (dts coherent acoustics)') {
				codec = 'dts';
			}
			if (codec === 'cue') {
				codec = $('$ext($info(referenced_file))');
			}
			else if (codec === 'mpc') {
				codec = `${codec}-${$('$info(codec_profile)').replace('quality ', 'q')}`;
			}
			else if (['dts', 'ac3', 'atsc a/52'].includes(codec)) {
				codec += `${$("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%")} kbps`;
				codec = codec.replace('atsc a/52', 'Dolby Digital');
			}
			else if ($('$info(encoding)') === 'lossy') {
				codec = $('$info(codec_profile)') === 'CBR' ? `${codec}-${$('%bitrate%')} kbps` : `${codec}-${$('$info(codec_profile)')}`;
			}
			grStr.trackInfo = $(codec + grCfg.settings.extraTrackInfo);
			grStr.disc = fb.TitleFormat(grTF.disc).Eval();

			const h = Math.floor(fb.PlaybackLength / 3600);
			const m = Math.floor(fb.PlaybackLength % 3600 / 60);
			const s = Math.floor(fb.PlaybackLength % 60);
			grStr.length = `${h > 0 ? `${h}:${m < 10 ? '0' : ''}${m}` : m}:${s < 10 ? '0' : ''}${s}`;

			const lastfmCount = $('%lastfm_play_count%');
			grm.ui.playCountVerifiedByLastFm = lastfmCount !== '0' && lastfmCount !== '?';

			const lastPlayed = $(grTF.last_played);
			if (grm.timeline) { // TODO: figure out why this is null for foo_input_spotify
				grm.timeline.setColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);
				// No need to call calcDateRatios if grMain.timeline is undefined
				grm.ui.calcDateRatios($Date(grm.ui.currentLastPlayed) !== $Date(lastPlayed), grm.ui.currentLastPlayed); // lastPlayed has probably changed and we want to update the date bar
			}
			if (lastPlayed.length) {
				const today = DateToYMD(new Date());
				if (!grm.ui.currentLastPlayed.length || $Date(lastPlayed) !== today) {
					grm.ui.currentLastPlayed = lastPlayed;
				}
			}

			grm.ui.updateMetadataGrid(grm.ui.currentLastPlayed, grm.ui.playingPlaylist);

			const showGridArtistFlags     = grSet[`showGridArtistFlags_${grSet.layout}`];
			const showGridReleaseFlags    = grSet[`showGridReleaseFlags_${grSet.layout}`];
			const showLowerBarArtistFlags = grSet[`showLowerBarArtistFlags_${grSet.layout}`];

			if (showGridArtistFlags || showLowerBarArtistFlags) {
				grm.ui.loadCountryFlags();
			}
			if (showGridReleaseFlags) {
				grm.ui.loadReleaseCountryFlag();
			}
		}
	}
	// * Not called manually from on_playback_new_track
	if (handle_list) {
		if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork || !grm.ui.displayPlaylist) {
			grm.ui.traceCall && console.log('Playlist => on_metadb_changed');
			pl.call && pl.call.on_metadb_changed(handle_list, fromhook);
		}
		if (grm.ui.displayLibrary) {
			grm.ui.traceCall && console.log('Library => on_metadb_changed');
			lib.call && lib.call.on_metadb_changed(handle_list, fromhook);
		}
		if (grm.ui.displayBiography) {
			grm.ui.traceCall && console.log('Biography => on_metadb_changed');
			bio.call && bio.call.on_metadb_changed(handle_list, fromhook);
		}
	}
	RepaintWindow();
}


/**
 * Called when playing a new track.
 * @global
 * @param {FbMetadbHandle} metadb - The metadb of the track.
 */
function on_playback_new_track(metadb) {
	if (!metadb) return; // Solve weird corner case
	const newTrackProfiler = grm.ui.showDebugTiming && fb.CreateProfiler('on_playback_new_track');
	DebugLog('in on_playback_new_track()');
	UpdateTimezoneOffset();

	grm.ui.lastLeftEdge = 0;
	grm.ui.newTrackFetchingArtwork = true;
	grm.ui.newTrackFetchingDone = false;
	grm.ui.themeColorSet = true;
	grm.ui.initThemeFull = false;
	grm.ui.isPlayingCD = metadb ? metadb.RawPath.startsWith('cdda://') : false;
	grm.ui.isStreaming = metadb ? metadb.RawPath.startsWith('http://') : false;
	grm.ui.currentAlbumFolder = !grm.ui.isStreaming ? metadb.Path.substring(0, metadb.Path.lastIndexOf('\\')) : '';

	grm.timeline = new Timeline(grm.ui.timelineHeight);
	grm.gridTip = new MetadataGridTooltip(grm.ui.gridTooltipHeight);
	grm.lowerTip = new LowerBarTooltip();

	grm.ui.setProgressBarRefresh();

	if (grm.ui.albumArtTimeout) {
		clearTimeout(grm.ui.albumArtTimeout);
		grm.ui.albumArtTimeout = 0;
	}

	// * Fetch new albumArt
	if ((grSet.cycleArt && grm.ui.albumArtIndex !== 0)
		|| grm.ui.isStreaming
		|| grm.ui.albumArtEmbedded
		|| grm.ui.currentAlbumFolder !== grm.ui.lastAlbumFolder
		|| grm.ui.albumArt == null
		|| $('%album%') !== grm.ui.lastAlbumFolderTag
		|| $('$if2(%discnumber%,0)') !== grm.ui.lastAlbumDiscNumber
		|| $(`$if2(${grTF.vinyl_side},ZZ)`) !== grm.ui.lastAlbumVinylSide) {
		grm.ui.clearPlaylistNowPlayingBg();
		grm.ui.fetchNewArtwork(metadb);
	}
	else if (grSet.cycleArt && grm.ui.albumArtList.length > 1) {
		// Need to do this here since we're no longer always fetching when grMain.ui.albumArtList.length > 1
		grm.ui.albumArtTimeout = setTimeout(() => {
			grm.ui.displayNextImage();
		}, grCfg.settings.artworkDisplayTime * 1000);
	}

	// * Pick a new random theme preset on new track
	if (grSet.presetAutoRandomMode === 'track' && !grm.ui.doubleClicked) {
		grm.preset.getRandomThemePreset();
	}

	// * Generate a new color in Random theme on new track
	if (grSet.styleRandomAutoColor === 'track' && !grm.ui.doubleClicked) {
		grm.color.getRandomThemeAutoColor();
	}

	if (grm.ui.discArt) {
		grm.ui.setDiscArtRotationTimer();
	}
	if (grSet.rotateDiscArt && !grSet.spinDiscArt) {
		grm.ui.createDiscArtRotation(); // We need to always setup the rotated image because it rotates on every track
	}

	grm.ui.getBandLogo();
	grm.ui.getLabelLogo(metadb);

	grm.ui.lastAlbumFolder = grm.ui.currentAlbumFolder;
	grm.ui.lastAlbumFolderTag = $('%album%');
	grm.ui.lastAlbumDiscNumber = $('$if2(%discnumber%,0)');
	grm.ui.lastAlbumVinylSide = $(`$if2(${grTF.vinyl_side},ZZ)`);
	grm.ui.currentLastPlayed = $(grTF.last_played);
	grm.ui.playingPlaylist = grSet.showGridPlayingPlaylist ? $(grTF.playing_playlist = plman.GetPlaylistName(plman.PlayingPlaylist)) : '';

	if (fb.GetNowPlaying()) on_metadb_changed(); // Refresh panel

	on_playback_time();
	grm.progBar.progressLength = 0;
	grm.peakBar.progressLength = 0;
	if (grSet.seekbar === 'peakmeterbar') {
		grm.peakBar.on_playback_new_track(metadb);
	} else if (grSet.seekbar === 'waveformbar') {
		grm.waveBar.on_playback_new_track_queue(metadb);
	}

	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork || !grm.ui.displayPlaylist) {
		pl.call.on_playback_new_track(metadb);
	}
	if (grm.ui.displayLibrary) {
		lib.call.on_playback_new_track(metadb);
	}
	if (grm.ui.displayBiography) {
		bio.call.on_playback_new_track();
	}

	if (grm.ui.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		grm.lyrics.initLyrics();
	}

	// * Load finished, Playlist auto-scroll is ready
	grm.ui.newTrackFetchingDone = true;

	if (newTrackProfiler) newTrackProfiler.Print();

	if (grm.ui.showRamUsage) {
		console.log(
		'\n' +
		'Ram usage for current panel:', `${(window.JsMemoryStats.MemoryUsage / 1024 ** 2).toFixed()} MB\n` +
		'Ram usage for all panels:', `${(window.JsMemoryStats.TotalMemoryUsage / 1024 ** 2).toFixed()} MB\n` +
		'Ram usage limit:', `${(window.JsMemoryStats.TotalMemoryLimit / 1024 ** 2).toFixed()} MB\n` +
		'\n');
	}
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

	console.log(`in on_size() => width: ${grm.ui.ww}, height: ${grm.ui.wh}`);

	if (grm.ui.ww <= 0 || grm.ui.wh <= 0) return;

	grm.display.checkRes();

	if (!grm.display.sizeInitialized) {
		grm.ui.createFonts();
		grm.ui.initMetrics();
		if (fb.IsPlaying) {
			grm.ui.loadCountryFlags(); // Wrong size flag gets loaded on 4K systems
		}
		PlaylistRescale(true);
		grm.ui.initPlaylist();
		grm.artCache && grm.artCache.clear();
		grm.display.sizeInitialized = true;
		if (grm.timeline) {
			grm.timeline.setHeight(grm.ui.timelineHeight);
		}
		if (grm.gridTip) {
			grm.gridTip.setHeight(grm.ui.gridTooltipHeight);
		}
	}

	grm.cusMenu && grm.cusMenu.on_size(grm.ui.ww, grm.ui.wh);
	grm.jSearch && grm.jSearch.on_size(grm.ui.ww, grm.ui.wh);
	grm.progBar && grm.progBar.on_size(grm.ui.ww, grm.ui.wh);
	grm.peakBar && grm.peakBar.on_size(grm.ui.ww, grm.ui.wh);
	grm.waveBar && grm.waveBar.on_size(grm.ui.ww, grm.ui.wh);

	grm.ui.lastLeftEdge = 0;

	grm.ui.resizeArtwork(true);
	grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
	pl.call.on_size(grm.ui.ww, grm.ui.wh);
	grm.ui.setLibrarySize();
	grm.ui.setBiographySize();
	if (grm.ui.displayLyrics) grm.lyrics.initLyrics();

	if (grm.ui.albumArt && (grSet.styleBlend || grSet.styleBlend2 || grSet.styleProgressBarFill === 'blend')) {
		grm.color.setStyleBlend(); // Reposition all drawn imgBlended
	}

	grm.button.initButtonState();

	// * UIHacks double click on caption in fullscreen
	try { // Needed when double clicking on caption and UIHacks.FullScreen === true; also disabling maximize in Artwork layout
		if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState === WindowState.Normal ||
			grSet.layout === 'artwork' && UIHacks.MainWindowState === WindowState.Maximized) {
			UIHacks.MainWindowState = WindowState.Normal;
		}
	} catch (e) {}
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
		grm.ui.traceCall && console.log('Custom menu => on_char');
		grm.cusMenu.on_char(code);
	}
	else if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || !grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayLibrarySplit(true)) {
		grm.ui.traceCall && console.log('Playlist => on_char');
		grm.jSearch.on_char(code);

		// Switch back to Playlist
		if (grSet.layout === 'default' && grm.ui.displayDetails) {
			grm.ui.btn.details.onClick();
		}
		else if (grSet.layout === 'artwork' && !grm.ui.displayPlaylistArtwork && !grm.ui.displayLibrary) {
			grm.ui.btn.playlistArtworkLayout.onClick();
		}
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_char');
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
		grm.ui.traceCall && console.log('Playlist => on_drag_enter');
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
		grm.ui.traceCall && console.log('Playlist => on_drag_over');
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
		grm.ui.traceCall && console.log('Playlist => on_drag_leave');
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
		grm.ui.traceCall && console.log('Playlist => on_drag_drop');
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
		grm.ui.traceCall && console.log('Playlist => on_focus');
		pl.call.on_focus(is_focused);
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_focus');
		lib.call.on_focus(is_focused);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_focus');
		bio.call.on_focus(is_focused);
	}
	if (is_focused) {
		plman.SetActivePlaylistContext(); // When the panel gets focus but not on every click.
	} else {
		clearTimeout(grm.ui.hideCursorTimeout); // Not sure this is required, but I think the mouse was occasionally disappearing
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
		grm.ui.traceCall && console.log('Playlist => on_item_focus_change');
		pl.call.on_item_focus_change(playlistIndex, from, to);
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_item_focus_change');
		lib.call.on_item_focus_change();
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_item_focus_change');
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
	const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		grm.ui.traceCall && console.log('Custom menu => on_key_down');
		grm.cusMenu.on_key_down(vkey);
	}
	else {
		if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
			grm.ui.traceCall && console.log('Playlist => on_key_down');

			if (grm.utils.suppressKey(vkey)) {
				return;
			}

			pl.call.on_key_down(vkey);
		}
		else if (grm.ui.displayLibrary) {
			grm.ui.traceCall && console.log('Library => on_key_down');
			lib.call.on_key_down(vkey);
		}
		if (grm.ui.displayBiography) {
			grm.ui.traceCall && console.log('Biography => on_key_down');
			bio.call.on_key_down(vkey);
		}
	}

	switch (vkey) {
		case VK_ADD:
		case VK_SUBTRACT:
			if (CtrlKeyPressed && ShiftKeyPressed) {
				const action = vkey === VK_ADD ? '+' : '-';
				const metadb = fb.GetNowPlaying();
				if (fb.IsPlaying) {
					fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadb);
				}
				else if (!metadb && (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true))) {
					const metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
					if (metadbList.Count === 1) {
						fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadbList[0]);
					} else {
						console.log('Won\'t change rating with more than one selected item');
					}
				}
			}
			break;
		case CtrlKeyPressed && VK_KEY_Z:
			fb.RunMainMenuCommand('Edit/Undo');
			break;
	}

	// * F11 shortcut for going into/out fullscreen mode, disabled in Artwork layout
	if (utils.IsKeyPressed(VK_F11)) {
		UIHacks.MainWindowState === WindowState.Normal ? UIHacks.FullScreen = true : UIHacks.MainWindowState = WindowState.Normal;
	}
	// * ESC also exits fullscreen mode
	else if (utils.IsKeyPressed(VK_ESCAPE) && UIHacks.FullScreen && !grSet.fullscreenESCDisabled) {
		UIHacks.MainWindowState = WindowState.Normal;
	}
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
		grm.ui.traceCall && console.log('Library => on_key_up');
		lib.call.on_key_up(vkey);
	}
	else if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_key_up');
		bio.call.on_key_up(vkey);
	}
}


/**
 * Called when adding new songs to the media library index.
 * @global
 * @param {FbMetadbHandleList} handle_list - The handle list of the library items.
 */
function on_library_items_added(handle_list) {
	grm.ui.traceCall && console.log('Library => on_library_items_added');
	lib.call.on_library_items_added(handle_list);

	grm.ui.traceCall && console.log('Biography => on_library_items_added');
	bio.call.on_library_items_added(handle_list);
}


/**
 * Called when media library is being changed, i.e updated by removing/adding tracks.
 * @global
 * @param {FbMetadbHandleList} handle_list - The handle list of the library items.
 */
function on_library_items_changed(handle_list) {
	grm.ui.traceCall && console.log('Library => on_library_items_changed');
	lib.call.on_library_items_changed(handle_list);

	grm.ui.traceCall && console.log('Biography => on_library_items_changed');
	bio.call.on_library_items_changed(handle_list);
}


/**
 * Called when removing songs from the media library index.
 * @global
 * @param {FbMetadbHandleList} handle_list - The handle list of the library items.
 */
function on_library_items_removed(handle_list) {
	grm.ui.traceCall && console.log('Library => on_library_items_removed');
	lib.call.on_library_items_removed(handle_list);

	grm.ui.traceCall && console.log('Biography => on_library_items_removed');
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
	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		grm.ui.traceCall && console.log('Playlist => on_mouse_lbtn_dblclk');
		if (grm.ui.displayCustomThemeMenu && grm.ui.displayLyrics) return;
		pl.call.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		grm.ui.traceCall && console.log('Library => on_mouse_lbtn_dblclk');
		lib.call.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		grm.ui.traceCall && console.log('Biography => on_mouse_lbtn_dblclk');
		bio.call.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (!grm.ui.displayCustomThemeMenu && !grm.ui.displayMetadataGridMenu || grm.ui.displayCustomThemeMenu && mouseInPanel(x, y)) {
		if (grm.ui.presetIndicatorTimer) {
			clearTimeout(grm.ui.presetIndicatorTimer);
			grm.ui.presetIndicatorTimer = null;
		}
		grm.ui.doubleClicked = true;
		if (fb.IsPlaying && !grm.button.mouseInControl && mouseInLowerBar(x, y)) {
			grm.ui.traceCall && console.log('Lower bar => on_mouse_lbtn_dblclk');
			// * Pick a new random theme preset
			if (grSet.presetAutoRandomMode === 'dblclick') {
				grm.ui.themePresetIndicator = true;
				grm.preset.getRandomThemePreset();
			}
			// * Generate a new color in Random theme
			else if (grSet.theme === 'random') {
				grm.ui.initTheme();
				DebugLog('\n>>> initTheme => on_mouse_lbtn_dblclk => random theme <<<\n');
			}
			// * Refresh theme
			else if (grCfg.settings.doubleClickRefresh) {
				grm.ui.albumArt = null;
				grm.artCache && grm.artCache.clear();
				grm.ui.discArtArray = [];
				grm.ui.discArtArrayCover = [];
				grm.ui.discArt = null;
				grm.ui.discArtCover = null;
				RepaintWindow();
				on_playback_new_track(fb.GetNowPlaying());
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
	const showProgressBar = grSet[`showProgressBar_${grSet.layout}`];
	window.SetCursor(32512); // Arrow

	if (grm.button) {
		grm.button.on_mouse_lbtn_down(x, y, m);
	}

	if (grSet.seekbar === 'progressbar' && grm.progBar.mouseInThis(x, y)) {
		grm.ui.traceCall && console.log('Progress bar => on_mouse_lbtn_down');
		grm.progBar.on_mouse_lbtn_down(x, y);
	}
	else if (grSet.seekbar === 'peakmeterbar' && grm.peakBar.mouseInThis(x, y)) {
		grm.ui.traceCall && console.log('Peakmeter bar => on_mouse_lbtn_down');
		grm.peakBar.on_mouse_lbtn_down(x, y);
	}
	else if (!grm.volBtn.on_mouse_lbtn_down(x, y, m)) { // Not handled by volumeBtn
		// * Clicking on progress bar to seek playback
		if (showProgressBar && mouseInSeekbar(x, y)) {
			let v = (x - 0.025 * grm.ui.ww) / (0.95 * grm.ui.ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime !== v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
			window.RepaintRect(0, grm.ui.wh - grm.ui.lowerBarHeight, grm.ui.ww, grm.ui.lowerBarHeight);
		}

		if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
			grm.ui.traceCall && console.log('Custom menu => on_mouse_lbtn_down');
			grm.cusMenu.on_mouse_lbtn_down(x, y, m);
		}

		if (grCfg.updateHyperlink && !fb.IsPlaying && grCfg.updateHyperlink.trace(x, y)) {
			grm.ui.traceCall && console.log('Hyperlink => on_mouse_lbtn_down');
			grCfg.updateHyperlink.click();
		}

		if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
			grm.ui.traceCall && console.log('Playlist => on_mouse_lbtn_down');
			if (grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) return;
			pl.call.on_mouse_lbtn_down(x, y, m);
		}
		else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
			grm.ui.traceCall && console.log('Library => on_mouse_lbtn_down');
			lib.call.on_mouse_lbtn_down(x, y, m);
		}
		if (grm.ui.displayBiography && mouseInBiography(x, y)) {
			grm.ui.traceCall && console.log('Biography => on_mouse_lbtn_down');
			bio.call.on_mouse_lbtn_down(x, y, m);
		}

		// * Clicking on album art or noAlbumArtStub to pause playback
		if (mouseInPause(x, y)) {
			fb.PlayOrPause();
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
		grm.ui.traceCall && console.log('Progress bar => on_mouse_lbtn_up');
		grm.progBar.on_mouse_lbtn_up(x, y);
	} else if (grSet.seekbar === 'peakmeterbar') {
		grm.ui.traceCall && console.log('Peakmeter bar => on_mouse_lbtn_up');
		grm.peakBar.on_mouse_lbtn_up(x, y);
	} else if (grSet.seekbar === 'waveformbar') {
		grm.ui.traceCall && console.log('Waveform bar => on_mouse_lbtn_up');
		grm.waveBar.on_mouse_lbtn_up(x, y, m);
	}

	if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		grm.ui.traceCall && console.log('Custom menu => on_mouse_lbtn_up');
		grm.cusMenu.on_mouse_lbtn_up(x, y, m);
	}

	if (grm.volBtn.on_mouse_lbtn_up(x, y, m)) return;

	// Not handled by volumeBtn
	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit()) && mouseInPlaylist(x, y)) {
		grm.ui.traceCall && console.log('Playlist => on_mouse_lbtn_up');
		if (grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) return;
		pl.call.on_mouse_lbtn_up(x, y, m);

		if (!grSet.lockPlayerSize) grm.utils.enableSizing(m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		grm.ui.traceCall && console.log('Library => on_mouse_lbtn_up');
		lib.call.on_mouse_lbtn_up(x, y, m);
	}
	if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		grm.ui.traceCall && console.log('Biography => on_mouse_lbtn_up');
		bio.call.on_mouse_lbtn_up(x, y, m);
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
	const showVolumeBtn = grSet[`showVolumeBtn_${grSet.layout}`];

	if (showVolumeBtn && grm.volBtn) {
		grm.ui.traceCall && console.log('Volume button => on_mouse_leave');
		grm.volBtn.on_mouse_leave();
	}
	if (grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) {
		grm.ui.traceCall && console.log('Playlist => on_mouse_leave');
		pl.call.on_mouse_leave();
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_mouse_leave');
		lib.call.on_mouse_leave();
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_mouse_leave');
		bio.call.on_mouse_leave();
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
		grm.ui.traceCall && console.log('Library => on_mouse_mbtn_dblclk');
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
		grm.ui.traceCall && console.log('Library => on_mouse_mbtn_down');
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
		grm.ui.traceCall && console.log('Library => on_mouse_mbtn_up');
		lib.call.on_mouse_mbtn_up(x, y, m);
	}
	else if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_mouse_mbtn_up');
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

	const showGridTimeline      = grSet[`showGridTimeline_${grSet.layout}`];
	const showTransportControls = grSet[`showTransportControls_${grSet.layout}`];
	const showVolumeBtn         = grSet[`showVolumeBtn_${grSet.layout}`];

	grm.ui.state.mouse_x = x;
	grm.ui.state.mouse_y = y;
	grm.display.setWindowDrag(x, y);
	grm.utils.setMouseCursor(x, y);

	if (grm.button) grm.button.on_mouse_move(x, y, m);
	if (grCfg.updateHyperlink) grCfg.updateHyperlink.on_mouse_move(grCfg.updateHyperlink, x, y);

	if (grm.progBar && grSet.seekbar === 'progressbar') {
		grm.progBar.on_mouse_move(x, y);
	} else if (grm.peakBar && grSet.seekbar === 'peakmeterbar') {
		grm.peakBar.on_mouse_move(x, y, m);
	} else if (grm.waveBar && grSet.seekbar === 'waveformbar') {
		grm.waveBar.on_mouse_move(x, y, m);
	}

	// * Top menu compact - collapse top menu to compact when mouse is out of top menu area
	if (grSet.topMenuCompact && !grSet.showTopMenuCompact && grm.ui.state.mouse_y > grm.ui.topMenuHeight * 2) { // Start collapse
		grSet.showTopMenuCompact = true;
		setTimeout(() => {
			grm.button.topMenu(true);
		}, 3000);
	}
	else if (grm.ui.displayCustomThemeMenu || grm.ui.displayMetadataGridMenu) {
		grm.ui.traceCall && console.log('Custom menu => on_mouse_move');
		grm.cusMenu.on_mouse_move(x, y, m);
	}
	else if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Playlist => on_mouse_move');
		if (grm.utils.suppressMouseMove(x, y, m)) {
			return;
		}
		grm.utils.disableSizing(m);
		pl.call.on_mouse_move(x, y, m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Library => on_mouse_move');
		lib.call.on_mouse_move(x, y, m);
	}
	else if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Biography => on_mouse_move');
		bio.call.on_mouse_move(x, y, m);
	}
	else if (showGridTimeline && grm.timeline && grm.timeline.mouseInThis(x, y) && grm.ui.displayDetails) {
		grm.ui.traceCall && console.log('Timeline => on_mouse_move');
		grm.timeline.on_mouse_move(x, y, m);
	}
	else if (grm.gridTip && grm.gridTip.mouseInThis(x, y)) {
		grm.ui.traceCall && console.log('Metadata Grid => on_mouse_move');
		grm.gridTip.on_mouse_move(x, y, m);
	}
	else if (grm.lowerTip && grm.lowerTip.mouseInThis(x, y)) {
		grm.ui.traceCall && console.log('Lower bar tooltip => on_mouse_move');
		grm.lowerTip.on_mouse_move(x, y, m);
	}
	else if (showTransportControls && showVolumeBtn && grm.volBtn) {
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
		grm.ui.traceCall && console.log('Playlist => on_mouse_rbtn_down');
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
	}

	if (mouseInTopMenu(x, y)) {
		grm.ui.traceCall && console.log('Top menu => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuTopBar(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInAlbumArt(x, y) && fb.IsPlaying) {
		grm.ui.traceCall && console.log('Album art => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuAlbumCover(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInLowerBar(x, y) && !mouseInSeekbar(x, y)) {
		grm.ui.traceCall && console.log('Lower bar => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuLowerBar(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInSeekbar(x, y)) {
		grm.ui.traceCall && console.log('Seekbar => on_mouse_rbtn_up');
		grm.ctxMenu.contextMenuSeekbar(cmm);
		handleContextMenu(x, y);
		return true;
	}

	if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		grm.ui.traceCall && console.log('Playlist => on_mouse_rbtn_up');
		if (grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) return;
		return pl.call.on_mouse_rbtn_up(x, y, m);
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(x, y)) {
		grm.ui.traceCall && console.log('Library => on_mouse_rbtn_up');
		return lib.call.on_mouse_rbtn_up(x, y, m);
	}
	else if (grm.ui.displayBiography && mouseInBiography(x, y)) {
		grm.ui.traceCall && console.log('Biography => on_mouse_rbtn_up');
		return bio.call.on_mouse_rbtn_up(x, y, m);
	}
	else {
		return grSet.disableRightClick;
	}
}


/**
 * Called when using the mouse wheel, also used to cycle through album artworks and control the seekbar.
 * @global
 * @param {number} step - The scroll direction: -1 or 1.
 */
function on_mouse_wheel(step) {
	const AltKeyPressed = utils.IsKeyPressed(VK_MENU);
	const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
	const showVolumeBtn = grSet[`showVolumeBtn_${grSet.layout}`];
	const displayAlbumArt = grSet.layout !== 'compact' &&
		(!grm.ui.displayPlaylistArtwork && !grm.ui.displayBiography && !grm.ui.displayLyrics || (grm.ui.displayLibrary && grSet.libraryLayout === 'normal'));

	if (showVolumeBtn && grm.volBtn.on_mouse_wheel(step)) return;

	// * Seeking through playback
	if (mouseInSeekbar(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		fb.PlaybackTime = fb.PlaybackTime - step * grSet.progressBarWheelSeekSpeed;
		grm.ui.refreshSeekbar();
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.on_mouse_wheel(step);
		return;
	}

	// * Cycling through album artwork
	if (grSet.cycleArtMWheel && grm.ui.albumArtList.length > 1 && displayAlbumArt && mouseInAlbumArt()) {
		// Prev album art image
		if (step > 0) {
			if (grm.ui.albumArtIndex !== 0) {
				grm.ui.albumArtIndex = (grm.ui.albumArtIndex - 1) % grm.ui.albumArtList.length;
			}
		}
		// Next album art image
		else if (grm.ui.albumArtIndex !== grm.ui.albumArtList.length - 1) {
			grm.ui.albumArtIndex = (grm.ui.albumArtIndex + 1) % grm.ui.albumArtList.length;
		}
		grm.ui.loadImageFromAlbumArtList(grm.ui.albumArtIndex);
		// Display embedded album art image
		if (grSet.loadEmbeddedAlbumArtFirst && grm.ui.albumArtIndex === 0) {
			grm.ui.albumArt = utils.GetAlbumArtV2(fb.GetNowPlaying());
			grm.ui.albumArtList.unshift(grm.ui.albumArt);
			grm.ui.albumArtIndex = 0;
		}

		// Update colors for dynamic themes
		if (['white', 'black', 'reborn', 'random'].includes(grSet.theme)) {
			grm.ui.newTrackFetchingArtwork = true;
			grm.color.getThemeColors(grm.ui.albumArt);
			grm.ui.initTheme();
			DebugLog('\n>>> initTheme => on_mouse_wheel <<<\n');
		}

		// Update positions
		grm.ui.resizeArtwork(true); // Re-adjust discArt shadow size if artwork size changes
		if (grSet.panelWidthAuto && grm.ui.albumArtSize.w !== grm.ui.albumArtSize.h) { // Re-adjust playlist if artwork size changes
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
		}
		grm.ui.lastLeftEdge = 0;
		RepaintWindow();
		return;
	}

	if (mouseInTopMenu(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		if (CtrlKeyPressed) {
			grm.scaling.setMenuFontSize(step);
		} else if (AltKeyPressed) {
			grm.scaling.setMenuFontSize(0);
		}
	}
	else if (mouseInTransport(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		if (CtrlKeyPressed) {
			grm.scaling.setTransportBtnSize(step);
		} else if (AltKeyPressed && !ShiftKeyPressed) {
			grm.scaling.setTransportBtnSize(0);
		} else if (!AltKeyPressed && ShiftKeyPressed) {
			grm.scaling.setTransportBtnSpacing(step);
		} else if (AltKeyPressed && ShiftKeyPressed) {
			grm.scaling.setTransportBtnSpacing(0);
		}
	}
	else if (mouseInLowerBar(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		if (CtrlKeyPressed) {
			grm.scaling.setLowerBarFontSize(step);
		} else if (AltKeyPressed) {
			grm.scaling.setLowerBarFontSize(0);
		}
	}
	else if (grm.ui.displayDetails) {
		if (mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, true)) {
			if (CtrlKeyPressed) {
				grm.scaling.setGridArtistFontSize(step);
			} else if (AltKeyPressed) {
				grm.scaling.setGridArtistFontSize(0);
			}
		} else if (mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, false, true)) {
			if (CtrlKeyPressed) {
				grm.scaling.setGridTitleFontSize(step);
			} else if (AltKeyPressed) {
				grm.scaling.setGridTitleFontSize(0);
			}
		} else if (mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, false, false, true)) {
			if (CtrlKeyPressed) {
				grm.scaling.setGridAlbumFontSize(step);
			} else if (AltKeyPressed) {
				grm.scaling.setGridAlbumFontSize(0);
			}
		} else if (mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, false, false, false, true)) {
			if (CtrlKeyPressed) {
				grm.scaling.setGridTagNameFontSize(step);
			} else if (AltKeyPressed) {
				grm.scaling.setGridTagNameFontSize(0);
			}
		} else if (mouseInMetadataGrid(grm.ui.state.mouse_x, grm.ui.state.mouse_y, false, false, false, false, true)) {
			if (CtrlKeyPressed) {
				grm.scaling.setGridTagValueFontSize(step);
			} else if (AltKeyPressed) {
				grm.scaling.setGridTagValueFontSize(0);
			}
		}
	}
	else if (grm.ui.displayLyrics && mouseInAlbumArt()) {
		if (CtrlKeyPressed) {
			grm.scaling.setLyricsFontSize(step);
		} else if (AltKeyPressed) {
			grm.scaling.setLyricsFontSize(0);
		} else {
			grm.lyrics.on_mouse_wheel(step);
		}
	}
	else if (grm.ui.displayBiography && mouseInBiography(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		grm.ui.traceCall && console.log('Biography => on_mouse_wheel');
		if (CtrlKeyPressed) {
			grm.scaling.setBiographyFontSize(step);
		} else if (AltKeyPressed) {
			grm.scaling.setBiographyFontSize(0);
		} else {
			bio.call.on_mouse_wheel(step);
		}
	}
	else if ((grm.ui.displayPlaylist && !grm.ui.displayLibrary || grm.ui.displayPlaylistArtwork || grm.ui.displayLibrarySplit(true)) && mouseInPlaylist(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		grm.ui.traceCall && console.log('Playlist => on_mouse_wheel');
		if (CtrlKeyPressed) {
			grm.scaling.setPlaylistFontSize(step);
		} else if (AltKeyPressed) {
			grm.scaling.setPlaylistFontSize(0);
		} else {
			pl.call.on_mouse_wheel(step);
		}
	}
	else if (grm.ui.displayLibrary && mouseInLibrary(grm.ui.state.mouse_x, grm.ui.state.mouse_y)) {
		grm.ui.traceCall && console.log('Library => on_mouse_wheel');
		if (CtrlKeyPressed) {
			grm.scaling.setLibraryFontSize(step);
		} else if (AltKeyPressed) {
			grm.scaling.setLibraryFontSize(0);
		} else {
			lib.call.on_mouse_wheel(step);
		}
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
		grm.ui.traceCall && console.log('Playlist => on_notify_data');
		pl.call.on_notify_data(name, info);
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_notify_data');
		lib.call.on_notify_data(name, info);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_notify_data');
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
		grm.ui.traceCall && console.log('Playlist => on_playback_dynamic_info_track');
		pl.call.on_playback_dynamic_info_track();
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playback_dynamic_info_track');
		bio.call.on_playback_dynamic_info_track();
	}
	if (grm.ui.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		grm.lyrics.initLyrics();
	}
}


/**
 * Called when playback order is changed via the transport playback order button or foobar's playback menu.
 * @global
 * @param {*} pbo - The playback order has following settings:
 * - 0 - Default.
 * - 1 - Repeat (Playlist).
 * - 2 - Repeat (Track).
 * - 3 - Random, 4 Shuffle (tracks).
 * - 5 - Shuffle (albums).
 * - 6 - Shuffle (folders).
 */
function on_playback_order_changed(pbo) {
	// Repaint playback order
	if (pbo !== grm.ui.lastPlaybackOrder) {
		DebugLog('Repainting on_playback_order_changed');
		window.RepaintRect(0.5 * grm.ui.ww, grm.ui.wh - grm.ui.lowerBarHeight, 0.5 * grm.ui.ww, grm.ui.lowerBarHeight);
	}
	grm.ui.lastPlaybackOrder = pbo;

	// Link foobar's playback order menu functions with playback order button
	const showTransportControls = grSet[`showTransportControls_${grSet.layout}`];
	const showPlaybackOrderBtn  = grSet[`showPlaybackOrderBtn_${grSet.layout}`];
	const showBtns = showTransportControls && showPlaybackOrderBtn;

	switch (pbo) {
		case PlaybackOrder.Default:
			grSet.playbackOrder = 'default';
			if (showBtns) grm.ui.btn.playbackOrder.img = grm.ui.btnImg.PlaybackDefault;
			break;

		case PlaybackOrder.RepeatPlaylist:
			grSet.playbackOrder = 'repeatPlaylist';
			if (showBtns) grm.ui.btn.playbackOrder.img = grm.ui.btnImg.PlaybackRepeatPlaylist;
			break;
		case PlaybackOrder.RepeatTrack:
			grSet.playbackOrder = 'repeatTrack';
			if (showBtns) grm.ui.btn.playbackOrder.img = grm.ui.btnImg.PlaybackRepeatTrack;
			break;

		case PlaybackOrder.Random:
		case PlaybackOrder.ShuffleTracks:
		case PlaybackOrder.ShuffleAlbums:
		case PlaybackOrder.ShuffleFolders:
			grSet.playbackOrder = 'shuffle';
			if (showBtns) grm.ui.btn.playbackOrder.img = grm.ui.btnImg.PlaybackShuffle;
			break;
	}
	grm.ui.traceCall && console.log('Main => on_playback_order_changed');
}


/**
 * Called when pausing current playing track.
 * @global
 * @param {boolean} state - Whether the playback is paused or not.
 */
function on_playback_pause(state) {
	grm.button.lowerPlayPause();
	if (state || fb.PlaybackLength < 0) {
		clearInterval(grm.ui.progressBarTimer);
		clearInterval(grm.ui.discArtRotationTimer);
		window.RepaintRect(0, grm.ui.topMenuHeight, Math.max(grm.ui.albumArtSize.x, SCALE(40)), grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight);
	}
	else { // Unpausing
		clearInterval(grm.ui.progressBarTimer); // Clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		DebugLog(`on_playback_pause: creating refreshSeekbar() interval with delay = ${grm.ui.progressBarTimerInterval}`);
		grm.ui.progressBarTimer = setInterval(() => {
			grm.ui.refreshSeekbar();
		}, grm.ui.progressBarTimerInterval || 1000);
		if (grm.ui.discArt && grSet.spinDiscArt) grm.ui.setDiscArtRotationTimer();
	}

	grm.pseBtn.repaint();

	if ((grm.ui.albumArt || grm.ui.noAlbumArtStub) && grm.ui.displayLyrics) { // If we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		grm.ui.traceCall && console.log('Lyrics => on_playback_pause');
		grm.lyrics.on_playback_pause(state);
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		grm.ui.traceCall && console.log('Playlist => on_playback_pause');
		pl.call.on_playback_pause(state);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playback_pause');
		bio.call.on_playback_pause(state);
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
	grm.ui.traceCall && console.log('Playlist => on_playback_queue_changed');
	pl.call.on_playback_queue_changed(origin);
	lib.call.on_playback_queue_changed();
}


/**
 * Called when playback time is being seeked, float value in seconds.
 * @global
 */
function on_playback_seek() {
	if (grSet.seekbar === 'progressbar') {
		grm.progBar.progressMoved = true;
	} else if (grSet.seekbar === 'peakmeterbar') {
		grm.peakBar.progressMoved = true;
	}
	if (grm.ui.displayLyrics) {
		grm.lyrics.seek();
	}
	else if (grm.ui.displayBiography) {
		bio.call.on_playback_seek();
	}
	on_playback_time();
	grm.ui.refreshSeekbar();
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
	if (grCfg.settings.hideCursor) {
		window.SetCursor(-1); // Hide cursor
	}
	grm.button.lowerPlayPause();
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
	if (reason !== 2) {
		// Clear all variables and repaint
		grm.ui.clearUIVariables();
		DebugLog('Repainting on_playback_stop:', reason);
		RepaintWindow();
		grm.ui.isPlayingCD = false;
		grm.ui.isStreaming = false;
		grm.ui.lastAlbumFolder = '';
		grm.ui.btn.playbackTime = '';
		grm.ui.lastAlbumDiscNumber = '0';
		grm.ui.recordLabels = [];
		grm.ui.recordLabelsInverted = [];
		grm.button.lowerPlayPause();
		// * Keep Reborn/Random colors when they are not too bright or too dark otherwise reset colors to default
		if (['reborn', 'random'].includes(grSet.theme) && ((grCol.colBrightness < 20 || grCol.imgBrightness < 20) || (grCol.colBrightness > 240 || grCol.imgBrightness > 240)) ||
			!['reborn', 'random'].includes(grSet.theme) || grSet.styleNighttime) {
			grm.color.setThemeColors();
			grm.ui.initTheme();
			DebugLog('\n>>> initTheme => on_playback_stop <<<\n');
		}
	}

	grm.waveBar.on_playback_stop(reason);

	clearInterval(grm.ui.discArtRotationTimer);
	clearInterval(grm.ui.progressBarTimer);
	clearTimeout(grm.ui.albumArtTimeout);

	if (grm.ui.albumArt && ((grSet.cycleArt && grm.ui.albumArtIndex !== 0) || grm.ui.lastAlbumFolder === '')) {
		DebugLog('disposing artwork');
		grm.ui.albumArt = null;
		grm.ui.albumArtScaled = null;
	}
	grm.ui.bandLogo = null;
	grm.ui.bandLogoInverted = null;

	if (grm.ui.displayLyrics && grm.lyrics) {
		grm.lyrics.on_playback_stop(reason);
	}

	grm.ui.flagImgs = [];
	grm.ui.discArtRotation = null;
	grm.ui.discArtRotationCover = null;
	grm.ui.albumArtTimeout = 0;

	if (grSet.panelWidthAuto) {
		grm.ui.initPanelWidthAuto();
	}

	if (reason === 0 || reason === 1) { // Stop or end of playlist
		grm.ui.discArt = grm.ui.disposeDiscArt(grm.ui.discArt);
		grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
		grm.ui.discArtArray = []; // Clear Images
		grm.ui.discArtArrayCover = []; // Clear Images
		window.Repaint();
	}
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		grm.ui.traceCall && console.log('Playlist => on_playback_stop');
		pl.call.on_playback_stop(reason);
	}
	else if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_playback_stop');
		lib.call.on_playback_stop(reason);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playback_stop');
		bio.call.on_playback_stop(reason);
	}
}


/**
 * Refresh playback time plus playback time remaining every second.
 * @global
 */
function on_playback_time() {
	grStr.time = grSet.switchPlaybackTime ? $('-%playback_time_remaining%') : $('%playback_time%');
	grm.waveBar.on_playback_time(fb.PlaybackTime);
	bio.call.on_playback_time();
}


/**
 * Called when clicking on playlist items that are visible in the playlist panel.
 * @global
 * @param {number} playlistIndex - The index of the playlist.
 * @param {number} playlistItemIndex - The index of the playlist item.
 */
function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		grm.ui.traceCall && console.log('Playlist => on_playlist_item_ensure_visible');
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
		grm.ui.traceCall && console.log('Playlist => on_playlist_items_added');
		pl.call.on_playlist_items_added(playlistIndex);
	}
	if (grm.ui.displayLibrary || grm.ui.displayLibrarySplit()) {
		grm.ui.traceCall && console.log('Library => on_playlist_items_added');
		lib.call.on_playlist_items_added(playlistIndex);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playlist_items_added');
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
		grm.ui.traceCall && console.log('Playlist => on_playlist_items_removed');
		pl.call.on_playlist_items_removed(playlistIndex);
	}
	if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_playlist_items_removed');
		lib.call.on_playlist_items_removed(playlistIndex);
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playlist_items_removed');
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
		grm.ui.traceCall && console.log('Playlist => on_playlist_items_reordered');
		pl.call.on_playlist_items_reordered(playlistIndex);
	}
	if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_playlist_items_reordered');
		lib.call.on_playlist_items_reordered(playlistIndex);
	}
}


/**
 * Called as a workaround for some 3rd party playlist viewers not working with on_selection_changed.
 * @global
 */
function on_playlist_items_selection_change() {
	if (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) {
		grm.ui.traceCall && console.log('Playlist => on_playlist_items_selection_change');
		pl.call.on_playlist_items_selection_change();
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
		grm.ui.traceCall && console.log('Playlist => on_playlist_switch');
		pl.call.on_playlist_switch();
	}
	if (grm.ui.displayLibrary || libSet.libSource === 0) {
		grm.ui.traceCall && console.log('Library => on_playlist_switch');
		lib.call.on_playlist_switch();
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playlist_switch');
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
		grm.ui.traceCall && console.log('Playlist => on_playlists_changed');
		pl.call.on_playlists_changed();
	}
	if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_playlists_changed');
		lib.call.on_playlists_changed();
	}
	if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_playlists_changed');
		bio.call.on_playlists_changed();
	}
}


/**
 * Called when script is reloaded via context menu > Reload or script is changed via panel menu > Configure or fb2k is exiting normally.
 * @global
 */
function on_script_unload() {
	console.log('Unloading Script');
	grm.waveBar.on_script_unload();

	// It appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
	if (grm.ui.displayLibrary) {
		grm.ui.traceCall && console.log('Library => on_script_unload');
		lib.call.on_script_unload();
	}
	else if (grm.ui.displayBiography) {
		grm.ui.traceCall && console.log('Biography => on_script_unload');
		bio.call.on_script_unload();
	}
}


/**
 * Called when volume changes, i.e the volume bar in the volume button.
 * @global
 * @param {number} val - The volume level in dB. Minimum is -100. Maximum is 0.
 */
function on_volume_change(val) {
	grm.ui.traceCall && console.log('Volume bar => on_volume_change');
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
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInTopMenu');
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
		grm.ui.state.mouse_x > 0 && grm.ui.state.mouse_x <= ((grm.ui.isStreaming || !grm.ui.albumArt && grm.ui.noArtwork || grm.ui.albumArt) && (grm.ui.displayPlaylist || grm.ui.displayLibrary) &&
		grSet.layout === 'default' ? grSet.panelWidthAuto ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : grm.ui.ww * 0.5 : !grm.ui.displayPlaylist && !grm.ui.displayLibrary ? grm.ui.ww : grm.ui.albumArtSize.w) &&
		grm.ui.state.mouse_y > grm.ui.albumArtSize.y && grm.ui.state.mouse_y <= grm.ui.albumArtSize.y + grm.ui.albumArtSize.h;

	if (displayAlbumArt && albumArtBounds) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInAlbumArt');
		return true;
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
	const artworkLayout = grSet.layout === 'artwork' && !grm.ui.displayPlaylistArtwork && !grm.ui.displayLibrary && !grm.ui.displayBiography;

	const albumArtBounds   = grm.ui.albumArtSize.x <= x && grm.ui.albumArtSize.y <= y && grm.ui.albumArtSize.x + grm.ui.albumArtSize.w >= x && grm.ui.albumArtSize.y + grm.ui.albumArtSize.h >= y;
	const discArtBounds    = grm.ui.discArtSize.x  <= x && grm.ui.discArtSize.y  <= y && grm.ui.discArtSize.x  + grm.ui.discArtSize.w  >= x && grm.ui.discArtSize.y  + grm.ui.discArtSize.h  >= y;
	const noAlbumArtBounds = grm.ui.state.mouse_x > 0 && grm.ui.state.mouse_x <= (grm.ui.displayPlaylist || grm.ui.displayLibrary ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : !grm.ui.displayPlaylist || !grm.ui.displayLibrary ? grm.ui.ww : grm.ui.ww * 0.5) &&
							 grm.ui.state.mouse_y > grm.ui.albumArtSize.y && grm.ui.state.mouse_y <= grm.ui.albumArtSize.h + grm.ui.topMenuHeight;
	const pauseOnAlbumArt =
		(grSet.layout === 'default' && grm.ui.albumArt && (panelPlaylist || panelDetails || panelLibrary) || artworkLayout) &&
		!grm.ui.displayCustomThemeMenu && !grm.ui.displayMetadataGridMenu && albumArtBounds || grm.ui.discArt && !grm.ui.albumArt && discArtBounds;

	const pauseOnNoAlbumArt =
		(grSet.layout === 'default' && !grm.ui.albumArt && (panelPlaylist || panelDetails || panelLibrary) || artworkLayout) &&
		!grm.ui.displayCustomThemeMenu && !grm.ui.displayMetadataGridMenu && noAlbumArtBounds;

	if (pauseOnAlbumArt || pauseOnNoAlbumArt) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInPause');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the lower bar.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInLowerBar(x, y) {
	if (y > grm.ui.wh - SCALE(120)) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInLowerBar');
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
	const lowerBarFontSize     = grSet[`lowerBarFontSize_${grSet.layout}`];
	const showPlaybackOrderBtn = grSet[`showPlaybackOrderBtn_${grSet.layout}`];
	const showReloadBtn        = grSet[`showReloadBtn_${grSet.layout}`];
	const showAddTrackskBtn    = grSet[`showAddTracksBtn_${grSet.layout}`];
	const showVolumeBtn        = grSet[`showVolumeBtn_${grSet.layout}`];
	const transportBtnSize     = grSet[`transportButtonSize_${grSet.layout}`];
	const transportBtnSpacing  = grSet[`transportButtonSpacing_${grSet.layout}`];
	const count = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showAddTrackskBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

	const buttonSize = SCALE(transportBtnSize);
	const buttonSpacing = SCALE(transportBtnSpacing);
	const totalWidth = count * buttonSize + (count - 1) * buttonSpacing;
	const startX = (grm.ui.ww - totalWidth) / 2;
	const endX = startX + totalWidth;
	const startY = grm.ui.wh - buttonSize - SCALE(grSet.layout !== 'default' ? 36 : 78) + SCALE(lowerBarFontSize)
	const endY = startY + buttonSize;

	if (x >= startX && x <= endX && y >= startY && y <= endY) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInTransport');
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
	const pBar = grSet.seekbar === 'progressbar';

	if (x >= SCALE(40) && x < grm.ui.ww - SCALE(40) &&
		y >= grm.ui.wh - (grSet.layout !== 'default' ? 0.6 : 0.5) * grm.ui.lowerBarHeight - 0.5 * grm.ui.progressBarH &&
		y <= grm.ui.wh - (grSet.layout !== 'default' ? SCALE(pBar ? 60 : 55) : SCALE(pBar ? 35 : 20))) {
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInSeekbar');
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
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('mouseInPanel');
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
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Playlist => mouseInPlaylist');
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
 * Checks if the mouse is within the boundaries of the metadata grid in Details.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {boolean} artist - The artist boundary.
 * @param {boolean} title - The title boundary.
 * @param {boolean} album - The album boundary.
 * @param {boolean} tagName - The tag name boundary.
 * @param {boolean} tagValue - The tag value boundary.
 * @returns {boolean} True or false.
 */
function mouseInMetadataGrid(x, y, artist, title, album, tagName, tagValue) {
	if (artist && x >= grm.ui.gridMarginLeft && x <= (grm.ui.gridMarginLeft + grm.ui.gridTextWidth) && y >= grm.ui.gridArtistTop && y <= grm.ui.gridArtistBottom) {
		return true;
	}

	if (title && x >= grm.ui.gridMarginLeft && x <= (grm.ui.gridMarginLeft + grm.ui.gridTextWidth) && y >= grm.ui.gridTitleTop && y <= grm.ui.gridTitleBottom) {
		return true;
	}

	if (album && x >= grm.ui.gridMarginLeft && x <= (grm.ui.gridMarginLeft + grm.ui.gridTextWidth) && y >= grm.ui.gridAlbumTop && y <= grm.ui.gridAlbumBottom) {
		return true;
	}

	if (tagName && x >= grm.ui.gridMarginLeft && x <= (grm.ui.gridMarginLeft + grm.ui.gridCol1Width) && y >= grm.ui.gridAlbumBottom && y <= grm.ui.gridTagNameBottom) {
		return true;
	}

	if (tagValue && x >= grm.ui.gridMarginLeft && x <= (grm.ui.gridMarginLeft + grm.ui.gridCol1Width + grm.ui.gridCol2Width) && y >= grm.ui.gridAlbumBottom && y <= grm.ui.gridTagValueBottom) {
		return true;
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
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Library => mouseInLibrary');
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
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Library => mouseInLibrarySearch');
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
		grm.ui.traceCall && grm.ui.traceOnMove && console.log('Biography => mouseInBiography');
		return true;
	}

	if (bio.alb_scrollbar.bar.isDragging || bio.art_scrollbar.bar.isDragging || bio.art_scroller.bar.isDragging || bio.cov_scroller.bar.isDragging) {
		bio.alb_scrollbar.bar.isDragging = false;
		bio.art_scrollbar.bar.isDragging = false;
		bio.art_scroller.bar.isDragging = false;
		bio.cov_scroller.bar.isDragging = false;
		bio.but.Dn = false;
	}

	return false;
}
