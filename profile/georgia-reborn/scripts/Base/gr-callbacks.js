/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Callbacks                            * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-10-16                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////
// * MAIN CALLBACKS * //
////////////////////////
/**
 * Called when thread created by utils.GetAlbumArtAsync is done.
 * @param {FbMetadbHandle} metadb The metadb of the track.
 * @param {number} art_id See Flags.js > AlbumArtId.
 * @param {GdiBitmap} image Null on failure.
 * @param {string} image_path The path to image file (or music file if image is embedded).
 */
function on_get_album_art_done(metadb, art_id, image, image_path) {
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_get_album_art_done');
		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_get_album_art_done');
		library.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_get_album_art_done');
		biography.on_get_album_art_done(metadb, art_id, image, image_path);
	}
}


/**
 * Called when thread created by gdi.LoadImageAsync is done.
 * @param {number} cookie The return value from the gdi.LoadImageAsync call.
 * @param {GdiBitmap} imagenullable Null on failure (invalid path/not an image).
 * @param {string} image_path The path that was originally supplied to gdi.LoadImageAsync.
 */
function on_load_image_done(cookie, imagenullable, image_path) {
	trace_call && console.log('Biography => on_load_image_done');
	biography.on_load_image_done(cookie, imagenullable, image_path);
}


/**
 * Called when metadb contents change, i.e tag or database updates.
 * @param {FbMetadbHandleList=} handle_list Can be undefined when called manually from on_playback_new_track.
 * @param {boolean=} fromhook True if notification is not from tag update, but a component that provides tag-like data from a database.
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
			const title = $(tf.title);
			const artist = $(tf.artist);
			const composer = $(tf.composer);
			const originalArtist = $(tf.original_artist);
			let tracknum = '';
			tracknum = pref.showVinylNums ? $(tf.vinyl_track) : $(tf.tracknum);

			str.tracknum = tracknum.trim();
			str.title = title + originalArtist;
			str.title_lower = title;
			str.original_artist = originalArtist;
			str.artist = artist;
			str.composer = composer;
			str.year = $(tf.year);
			if (str.year === '0000') {
				str.year = '';
			}
			str.album = $(`[%album%][ '['${tf.album_translation}']']`);
			str.album_subtitle = $(`[ '['${tf.album_subtitle}']']`);
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
			str.trackInfo = $(codec + settings.extraTrackInfo);
			// TODO: Add LUFS option?
			// str.trackInfo += $('$if(%replaygain_track_gain%, | LUFS $puts(l,$sub(-1800,$replace(%replaygain_track_gain%,.,)))$div($get(l),100).$right($get(l),2) dB,)');

			str.disc = fb.TitleFormat(tf.disc).Eval();

			const h = Math.floor(fb.PlaybackLength / 3600);
			const m = Math.floor(fb.PlaybackLength % 3600 / 60);
			const s = Math.floor(fb.PlaybackLength % 60);
			str.length = `${h > 0 ? `${h}:${m < 10 ? '0' : ''}${m}` : m}:${s < 10 ? '0' : ''}${s}`;

			const lastfmCount = $('%lastfm_play_count%');
			playCountVerifiedByLastFm = lastfmCount !== '0' && lastfmCount !== '?';

			const lastPlayed = $(tf.last_played);
			if (str.timeline) { // TODO: figure out why this is null for foo_input_spotify
				str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);
				// No need to call calcDateRatios if str.timeline is undefined
				calcDateRatios($Date(currentLastPlayed) !== $Date(lastPlayed), currentLastPlayed); // lastPlayed has probably changed and we want to update the date bar
			}
			if (lastPlayed.length) {
				const today = DateToYMD(new Date());
				if (!currentLastPlayed.length || $Date(lastPlayed) !== today) {
					currentLastPlayed = lastPlayed;
				}
			}

			updateMetadataGrid(currentLastPlayed, playingPlaylist);

			const showGridArtistFlags     = pref[`showGridArtistFlags_${pref.layout}`];
			const showGridReleaseFlags    = pref[`showGridReleaseFlags_${pref.layout}`];
			const showLowerBarArtistFlags = pref[`showLowerBarArtistFlags__${pref.layout}`];

			if (showGridArtistFlags || showLowerBarArtistFlags) {
				loadCountryFlags();
			}
			if (showGridReleaseFlags) {
				loadReleaseCountryFlag();
			}
		}
	}
	// * Not called manually from on_playback_new_track
	if (handle_list) {
		if (displayPlaylist || displayPlaylistArtwork || !displayPlaylist) {
			trace_call && console.log('Playlist => on_metadb_changed');
			playlist && playlist.on_metadb_changed(handle_list, fromhook);
		}
		if (displayLibrary) {
			trace_call && console.log('Library => on_metadb_changed');
			library && library.on_metadb_changed(handle_list, fromhook);
		}
		if (displayBiography) {
			trace_call && console.log('Biography => on_metadb_changed');
			biography && biography.on_metadb_changed(handle_list, fromhook);
		}
	}
	repaintWindow();
}


/**
 * Called when playing a new track.
 * @param {FbMetadbHandle} metadb The metadb of the track.
 */
function on_playback_new_track(metadb) {
	if (!metadb) return;	// Solve weird corner case
	const newTrackProfiler = timings.showDebugTiming ? fb.CreateProfiler('on_playback_new_track') : null;
	DebugLog('in on_playback_new_track()');

	lastLeftEdge = 0;
	newTrackFetchingArtwork = true;
	newTrackFetchingDone = false;
	themeColorSet = true;
	initThemeFull = false;
	UpdateTimezoneOffset();
	isPlayingCD = metadb ? metadb.RawPath.startsWith('cdda://') : false;
	isStreaming = metadb ? metadb.RawPath.startsWith('http://') : false;
	currentAlbumFolder = !isStreaming ? metadb.Path.substring(0, metadb.Path.lastIndexOf('\\')) : '';

	setProgressBarRefresh();

	if (pref.themeDayNightMode && (pref.theme === 'white' || pref.theme === 'black')) {
		themeDayNightModeTimer = setInterval(() => {
			themeDayNightMode(new Date());
			initTheme();
			DebugLog('\n>>> initTheme -> fetchNewArtwork -> on_playback_new_track -> themeDayNightModeTimer <<<\n');
		}, 600000);
	}

	if (albumArtTimeout) {
		clearTimeout(albumArtTimeout);
		albumArtTimeout = 0;
	}

	str.timeline = new Timeline(geo.timelineHeight);
	str.metadata_grid_tt = new MetadataGridTooltip(geo.metadataGridTooltipHeight);
	str.lowerBar_tt = new LowerBarTooltip();

	// * Fetch new albumArt
	if ((pref.cycleArt && albumArtIndex !== 0) || isStreaming || embeddedArt || currentAlbumFolder !== lastAlbumFolder || albumArt == null ||
		$('%album%') !== lastAlbumFolderTag || $('$if2(%discnumber%,0)') !== lastAlbumDiscNumber || $(`$if2(${tf.vinyl_side},ZZ)`) !== lastAlbumVinylSide) {
		clearPlaylistNowPlayingBg();
		fetchNewArtwork(metadb);
	}
	else if (pref.cycleArt && albumArtList.length > 1) {
		// Need to do this here since we're no longer always fetching when albumArtList.length > 1
		albumArtTimeout = setTimeout(() => {
			displayNextImage();
		}, settings.artworkDisplayTime * 1000);
	}

	// * Pick a new random theme preset on new track
	if (pref.presetAutoRandomMode === 'track' && !doubleClicked) getRandomThemePreset();

	// * Generate a new color in Random theme on new track
	if (pref.styleRandomAutoColor === 'track' && !doubleClicked) getRandomThemeAutoColor();

	if (discArt) {
		setDiscArtRotationTimer();
	}
	if (pref.rotateDiscArt && !pref.spinDiscArt) {
		createDiscArtRotation(); // We need to always setup the rotated image because it rotates on every track
	}

	getBandLogo();
	getLabelLogo(metadb);

	lastAlbumFolder = currentAlbumFolder;
	lastAlbumFolderTag = $('%album%');
	lastAlbumDiscNumber = $('$if2(%discnumber%,0)');
	lastAlbumVinylSide = $(`$if2(${tf.vinyl_side},ZZ)`);
	currentLastPlayed = $(tf.last_played);
	playingPlaylist = pref.showGridPlayingPlaylist ? $(tf.playing_playlist = plman.GetPlaylistName(plman.PlayingPlaylist)) : '';

	if (fb.GetNowPlaying()) {
		on_metadb_changed(); // Refresh panel
	}

	on_playback_time();
	progressBar.progressLength = 0;
	peakmeterBar.progressLength = 0;
	if (pref.seekbar === 'peakmeterbar') {
		peakmeterBar.on_playback_new_track(metadb);
	} else if (pref.seekbar === 'waveformbar') {
		waveformBar.on_playback_new_track_queue(metadb);
	}

	if (displayPlaylist || displayPlaylistArtwork || !displayPlaylist) {
		playlist.on_playback_new_track(metadb);
	}
	if (displayLibrary) {
		library.on_playback_new_track(metadb);
	}
	if (displayBiography) {
		biography.on_playback_new_track();
	}

	if (pref.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		initLyrics();
	}

	// * Load finished, Playlist auto-scroll is ready
	newTrackFetchingDone = true;

	if (timings.showDebugTiming) newTrackProfiler.Print();

	if (timings.showRamUsage) {
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
 */
function on_size() {
	ww = window.Width;
	wh = window.Height;

	console.log(`in on_size() => width: ${ww}, height: ${wh}`);

	if (ww <= 0 || wh <= 0) return;

	display.checkRes();

	if (!sizeInitialized) {
		createFonts();
		setGeometry();
		if (fb.IsPlaying) {
			loadCountryFlags(); // Wrong size flag gets loaded on 4K systems
		}
		rescalePlaylist(true);
		initPlaylist();
		volumeBtn = new VolumeBtn();
		artCache && artCache.clear();
		artCache = new ArtCache(15);
		sizeInitialized = true;
		if (str.timeline) {
			str.timeline.setHeight(geo.timelineHeight);
		}
		if (str.metadata_grid_tt) {
			str.metadata_grid_tt.setHeight(geo.metadataGridTooltipHeight);
		}
	}

	customMenu && customMenu.on_size(ww, wh);
	jumpSearch && jumpSearch.on_size(ww, wh);
	progressBar && progressBar.on_size(ww, wh);
	waveformBar && waveformBar.on_size(ww, wh);
	peakmeterBar && peakmeterBar.on_size(ww, wh);

	lastLeftEdge = 0;

	resizeArtwork(true);
	createButtonObjects(ww, wh);
	playlist.on_size(ww, wh);
	setLibrarySize();
	setBiographySize();

	if (albumArt && (pref.styleBlend || pref.styleBlend2 || pref.styleProgressBarFill === 'blend')) setStyleBlend(); // Reposition all drawn blendedImg

	initButtonState();

	// * UIHacks double click on caption in fullscreen
	if (!componentUIHacks) return;
	try { // Needed when double clicking on caption and UIHacks.FullScreen === true; also disabling maximize in Artwork layout
		if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState === WindowState.Normal ||
			pref.layout === 'artwork' && UIHacks.MainWindowState === WindowState.Maximized) {
			UIHacks.MainWindowState = WindowState.Normal;
		}
	} catch (e) {}

	if (pref.displayLyrics) {
		initLyrics();
	}
}


/////////////////////////////////
// * USER ACTIVITY CALLBACKS * //
/////////////////////////////////
/**
 * Called when using letter keystrokes from keyboard.
 *
 * Note: in order to use this callback, use window.DlgCode(DLGC_WANTCHARS).
 * See Flags.js > DLGC_WANTCHARS.
 * @param {number} code The character code.
 */
function on_char(code) {
	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_char(code);
	}
	else if (displayPlaylist && !displayLibrary || !displayPlaylist && !displayLibrary || displayLibrarySplit(true)) {
		trace_call && console.log('Playlist => on_char');
		jumpSearch.on_char(code);

		// Switch back to Playlist
		if (pref.layout === 'default' && !displayPlaylist && !displayLibrary) {
			btns.details.onClick();
		}
		else if (pref.layout === 'artwork' && !displayPlaylistArtwork && !displayLibrary) {
			btns.playlistArtworkLayout.onClick();
		}
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_char');
		library.on_char(code);
	}
}


/**
 * Called when mouse with content enters another window and determines if that window is a valid drop target.
 *
 * 1. Called first.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt
 * @param {DropTargetAction} action The type of drag action being performed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} mask The mouse mask.
 */
function on_drag_enter(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_drag_enter');
		playlist.on_drag_enter(action, x, y, mask);
	}
}


/**
 * Called when content with mouse moves but stays within the same window.
 *
 * 2. Called after on_drag_enter.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt
 * @param {DropTargetAction} action The type of drag action being performed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} mask The mouse mask.
 */
function on_drag_over(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_drag_over');
		playlist.on_drag_over(action, x, y, mask);
	}
}


/**
 * Called when mouse with content is being dragged outside of window.
 *
 * 3. Called after on_drag_over.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt
 */
function on_drag_leave() {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) {
		trace_call && console.log('Playlist => on_drag_leave');
		playlist.on_drag_leave();
	}
}


/**
 * Called when mouse with content is being dropped.
 *
 * 4. Called after on_drag_over.
 *
 * See fb.DoDragDrop documentation and samples/basic/DragnDrop.txt
 * @param {DropTargetAction} action The type of drag action being performed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} mask The mouse mask.
 */
function on_drag_drop(action, x, y, mask) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) {
		trace_call && console.log('Playlist => on_drag_drop');
		playlist.on_drag_drop(action, x, y, mask);
	}
}


/**
 * Called when the panel gets or loses focus.
 * @param {boolean} is_focused Whether the panel is focused.
 */
function on_focus(is_focused) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) {
		trace_call && console.log('Playlist => on_focus');
		playlist.on_focus(is_focused);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_focus');
		library.on_focus(is_focused);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_focus');
		biography.on_focus(is_focused);
	}
	if (is_focused) {
		plman.SetActivePlaylistContext(); // When the panel gets focus but not on every click.
	} else {
		clearTimeout(hideCursorTimeout); // Not sure this is required, but I think the mouse was occasionally disappearing
	}
}


/**
 * Called when focused item in panel has been changed.
 * @param {number} playlistIndex The index of the playlist.
 * @param {number} from The index of the previously focused item.
 * @param {number} to The index of the item that is gaining focus.
 */
function on_item_focus_change(playlistIndex, from, to) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) {
		trace_call && console.log('Playlist => on_item_focus_change');
		playlist.on_item_focus_change(playlistIndex, from, to);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_item_focus_change');
		library.on_item_focus_change();
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_item_focus_change');
		biography.on_item_focus_change();
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
 * @param {number} vkey The virtual key code.
 */
function on_key_down(vkey) {
	const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_key_down(vkey);
	}
	else {
		if (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) {
			trace_call && console.log('Playlist => on_key_down');

			if (key_down_suppress.is_supressed(vkey)) {
				return;
			}

			playlist.on_key_down(vkey);
		}
		else if (displayLibrary) {
			trace_call && console.log('Library => on_key_down');
			library.on_key_down(vkey);
		}
		if (displayBiography) {
			trace_call && console.log('Biography => on_key_down');
			biography.on_key_down(vkey);
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
				else if (!metadb && (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true))) {
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
	else if (utils.IsKeyPressed(VK_ESCAPE) && UIHacks.FullScreen) {
		UIHacks.MainWindowState = WindowState.Normal;
	}
}


/**
 * Called when releasing keyboard keys from pressed state.
 *
 * Requires "Grab focus" enabled in the Configuration window.
 *
 * In order to use arrow keys, use window.DlgCode(DLGC_WANTARROWS) (see Flags.js > DLGC_WANTARROWS).
 * @param {number} vkey The virtual key code.
 */
function on_key_up(vkey) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_key_up');
		library.on_key_up(vkey);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_key_up');
		biography.on_key_up(vkey);
	}
}


/**
 * Called when adding new songs to the media library index.
 * @param {FbMetadbHandleList} handle_list The handle list of the library items.
 */
function on_library_items_added(handle_list) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_library_items_added');
		library.on_library_items_added(handle_list);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_library_items_added');
		biography.on_library_items_added(handle_list);
	}
}


/**
 * Called when media library is being changed, i.e updated by removing/adding tracks.
 * @param {FbMetadbHandleList} handle_list The handle list of the library items.
 */
function on_library_items_changed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_library_items_changed');
		library.on_library_items_changed(handle_list);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_library_items_changed');
		biography.on_library_items_changed(handle_list);
	}
}


/**
 * Called when removing songs from the media library index.
 * @param {FbMetadbHandleList} handle_list The handle list of the library items.
 */
function on_library_items_removed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_library_items_removed');
		library.on_library_items_removed(handle_list);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_library_items_removed');
		biography.on_library_items_removed(handle_list);
	}
}


/**
 * Refresh playback time plus playback time remaining every second.
 */
function on_playback_time() {
	str.time = pref.switchPlaybackTime ? $('-%playback_time_remaining%') : $('%playback_time%');
	waveformBar.on_playback_time(fb.PlaybackTime);
	biography.on_playback_time(fb.PlaybackTime);
}


/**
 * Called when double clicking the left mouse button.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_lbtn_dblclk(x, y, m) {
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		trace_call && console.log('Playlist => on_mouse_lbtn_dblclk');
		if (displayCustomThemeMenu && pref.displayLyrics) return;
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayLibrary && mouseInLibrary(x, y)) {
		trace_call && console.log('Library => on_mouse_lbtn_dblclk');
		library.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayBiography && mouseInBiography(x, y)) {
		trace_call && console.log('Biography => on_mouse_lbtn_dblclk');
		biography.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (!displayCustomThemeMenu && !displayMetadataGridMenu || displayCustomThemeMenu && mouseInPanel(x, y)) {
		if (presetIndicatorTimer) {
			clearTimeout(presetIndicatorTimer);
			presetIndicatorTimer = null;
		}
		doubleClicked = true;
		if (fb.IsPlaying && !mouseInControl && mouseInLowerBar(x, y)) {
			// * Pick a new random theme preset
			if (pref.presetAutoRandomMode === 'dblclick') {
				themePresetIndicator = true;
				getRandomThemePreset();
			}
			// * Generate a new color in Random theme
			else if (pref.theme === 'random') {
				initTheme();
				DebugLog('\n>>> initTheme -> on_mouse_lbtn_dblclk -> random theme <<<\n');
			}
			// * Refresh theme
			else if (settings.doubleClickRefresh) {
				albumArt = null;
				artCache.clear();
				discArtArray = [];
				discArtArrayCover = [];
				discArt = null;
				discArtCover = null;
				repaintWindow();
				on_playback_new_track(fb.GetNowPlaying());
			}
		}
	}
}


/**
 * Called when left mouse button is pressed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_lbtn_down(x, y, m) {
	const showProgressBar = pref[`showProgressBar_${pref.layout}`];
	window.SetCursor(32512); // Arrow

	if (topMenu) {
		topMenu.on_mouse_lbtn_down(x, y, m);
	}

	if (pref.seekbar === 'progressbar' && progressBar.mouseInThis(x, y)) {
		progressBar.on_mouse_lbtn_down(x, y);
	}
	else if (pref.seekbar === 'peakmeterbar' && peakmeterBar.mouseInThis(x, y)) {
		peakmeterBar.on_mouse_lbtn_down(x, y);
	}
	else if (!volumeBtn.on_mouse_lbtn_down(x, y, m)) {
		// Not handled by volumeBtn

		// * Clicking on progress bar to seek playback
		if (showProgressBar && mouseInSeekbar(x, y)) {
			let v = (x - 0.025 * ww) / (0.95 * ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime !== v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
			window.RepaintRect(0, wh - geo.lowerBarHeight, ww, geo.lowerBarHeight);
		}

		if (displayCustomThemeMenu || displayMetadataGridMenu) {
			customMenu.on_mouse_lbtn_down(x, y, m);
		}

		if (updateHyperlink && !fb.IsPlaying && updateHyperlink.trace(x, y)) {
			updateHyperlink.click();
		}

		if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
			trace_call && console.log('Playlist => on_mouse_lbtn_down');
			if (displayCustomThemeMenu && displayBiography) return;
			playlist.on_mouse_lbtn_down(x, y, m);
		}
		else if (displayLibrary && mouseInLibrary(x, y)) {
			trace_call && console.log('Library => on_mouse_lbtn_down');
			library.on_mouse_lbtn_down(x, y, m);
		}
		if (displayBiography && mouseInBiography(x, y)) {
			trace_call && console.log('Biography => on_mouse_lbtn_down');
			biography.on_mouse_lbtn_down(x, y, m);
		}

		// * Clicking on album art or noAlbumArtStub to pause playback
		if (mouseInPause(x, y)) {
			fb.PlayOrPause();
		}
	}
}


/**
 * Called when left mouse button is released from pressed state.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_lbtn_up(x, y, m) {
	if (topMenu) {
		topMenu.on_mouse_lbtn_up(x, y, m);
	}

	if (pref.seekbar === 'progressbar') {
		progressBar.on_mouse_lbtn_up(x, y);
	} else if (pref.seekbar === 'peakmeterbar') {
		peakmeterBar.on_mouse_lbtn_up(x, y);
	} else if (pref.seekbar === 'waveformbar') {
		waveformBar.on_mouse_lbtn_up(x, y, m);
	}

	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_mouse_lbtn_up(x, y, m);
	}

	if (volumeBtn.on_mouse_lbtn_up(x, y, m)) return;

	// Not handled by volumeBtn
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit()) && mouseInPlaylist(x, y)) {
		trace_call && console.log('Playlist => on_mouse_lbtn_up');
		if (displayCustomThemeMenu && displayBiography) return;
		playlist.on_mouse_lbtn_up(x, y, m);

		if (!pref.lockPlayerSize) qwr_utils.EnableSizing(m);
	}
	else if (displayLibrary && mouseInLibrary(x, y)) {
		trace_call && console.log('Library => on_mouse_lbtn_up');
		library.on_mouse_lbtn_up(x, y, m);
	}
	if (displayBiography && mouseInBiography(x, y)) {
		trace_call && console.log('Biography => on_mouse_lbtn_up');
		biography.on_mouse_lbtn_up(x, y, m);
	}

	if (doubleClicked) {
		doubleClicked = false; // You just did a double-click, so do nothing
	}

	on_mouse_move(x, y);
}


/**
 * Called when mouse leaves the window.
 */
function on_mouse_leave() {
	const showVolumeBtn = pref[`showVolumeBtn_${pref.layout}`];

	if (showVolumeBtn && volumeBtn) {
		volumeBtn.on_mouse_leave();
	}
	if (displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) {
		playlist.on_mouse_leave();
	}
	else if (displayLibrary) {
		library.on_mouse_leave();
	}
	if (displayBiography) {
		biography.on_mouse_leave();
	}
}


/**
 * Called when middle mouse (wheel) button is double clicked.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_mbtn_dblclk(x, y, m) {
	if (displayLibrary) {
		library.on_mouse_mbtn_dblclk(x, y, m);
	}
}


/**
 * Called when middle mouse (wheel) button is pressed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_mbtn_down(x, y, m) {
	if (displayLibrary) {
		library.on_mouse_mbtn_down(x, y, m);
	}
}


/**
 * Called when middle mouse (wheel) button is released from pressed state.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_mbtn_up(x, y, m) {
	if (displayLibrary) {
		library.on_mouse_mbtn_up(x, y, m);
	}
	else if (displayBiography) {
		biography.on_mouse_mbtn_up(x, y, m);
	}
}


/**
 * Called when mouse moves in the panel.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_move(x, y, m) {
	const showGridTimeline      = pref[`showGridTimeline_${pref.layout}`];
	const showTransportControls = pref[`showTransportControls_${pref.layout}`];
	const showVolumeBtn         = pref[`showVolumeBtn_${pref.layout}`];

	if (x === state.mouse_x && y === state.mouse_y) return;

	display.setWindowDrag(x, y);

	if (!mouseInLibrarySearch(x, y)) window.SetCursor(32512); // Arrow

	if (topMenu) {
		topMenu.on_mouse_move(x, y, m);
	}

	if (progressBar && pref.seekbar === 'progressbar') {
		progressBar.on_mouse_move(x, y);
	} else if (peakmeterBar && pref.seekbar === 'peakmeterbar') {
		peakmeterBar.on_mouse_move(x, y, m);
	} else if (waveformBar && pref.seekbar === 'waveformbar') {
		waveformBar.on_mouse_move(x, y, m);
	}

	state.mouse_x = x;
	state.mouse_y = y;

	// * Top menu compact - collapse top menu to compact when mouse is out of top menu area
	if (pref.topMenuCompact && !pref.showTopMenuCompact && state.mouse_y > geo.topMenuHeight * 2) { // Start collapse
		pref.showTopMenuCompact = true;
		setTimeout(() => {
			topMenuCompact(true);
			topMenuCompactExpanded = false;
		}, 2000);
	}
	else if (pref.topMenuCompact && pref.showTopMenuCompact && state.mouse_y < geo.topMenuHeight * 2) { // Cancel collapse
		topMenuCompactExpanded = true;
	}

	if (settings.hideCursor && fb.IsPlaying) {
		clearTimeout(hideCursorTimeout);
		hideCursorTimeout = setTimeout(() => {
			// * If there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
			if (!activeMenu && fb.IsPlaying) {
				window.SetCursor(-1); // Hide cursor
			}
		}, 10000);
	}

	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_mouse_move(x, y, m);
	}

	if (updateHyperlink) hyperlinks_on_mouse_move(updateHyperlink, x, y);

	if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		trace_call && trace_on_move && console.log('Playlist => on_mouse_move');

		if (mouse_move_suppress.is_supressed(x, y, m)) {
			return;
		}

		qwr_utils.DisableSizing(m);
		playlist.on_mouse_move(x, y, m);
	}
	else if (displayLibrary && mouseInLibrary(x, y)) {
		trace_call && trace_on_move && console.log('Library => on_mouse_move');
		library.on_mouse_move(x, y, m);
	}
	else if (displayBiography && mouseInBiography(x, y)) {
		trace_call && trace_on_move && console.log('Biography => on_mouse_move');
		biography.on_mouse_move(x, y, m);
	}
	else if (showGridTimeline && str.timeline && str.timeline.mouseInThis(x, y) &&
		(pref.layout === 'default' && !displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics ||
		pref.layout === 'artwork' && displayPlaylist && !displayLibrary && !displayBiography)) { // Prevent tooltips on album cover when Artwork layout is active
		str.timeline.on_mouse_move(x, y, m);
	}
	else if (str.metadata_grid_tt && str.metadata_grid_tt.mouseInThis(x, y)) {
		str.metadata_grid_tt.on_mouse_move(x, y, m);
	}
	else if (str.lowerBar_tt && str.lowerBar_tt.mouseInThis(x, y)) {
		str.lowerBar_tt.on_mouse_move(x, y, m);
	}
	else if (showTransportControls && showVolumeBtn && volumeBtn) {
		volumeBtn.on_mouse_move(x, y, m);
	}
}


/**
 * Called when right mouse button is pressed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_rbtn_down(x, y, m) {
    if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) && mouseInPlaylist(x, y) &&
        !(displayCustomThemeMenu && displayBiography)) {
        trace_call && console.log('Playlist => on_mouse_rbtn_down');
        playlist.on_mouse_rbtn_down(x, y, m);
    }
}


/**
 * Called when right mouse button is released from pressed state.
 *
 * You must return true, if you want to suppress the default context menu.
 *
 * Note: left shift + left windows key will bypass this callback and will open default context menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_rbtn_up(x, y, m) {
	const cmm = new ContextMainMenu();
	const handleContextMenu = (x, y) => {
		activeMenu = true;
		cmm.execute(x, y);
		activeMenu = false;
	}

	if (mouseInTopMenu(x, y)) {
		trace_call && console.log('Top menu => on_mouse_rbtn_up');
		qwr_utils.append_top_menu_context_menu_to(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInAlbumArt(x, y) && fb.IsPlaying) {
		trace_call && console.log('Album art => on_mouse_rbtn_up');
		qwr_utils.append_album_cover_context_menu_to(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInLowerBar(x, y) && !mouseInSeekbar(x, y)) {
		trace_call && console.log('Lower bar => on_mouse_rbtn_up');
		qwr_utils.append_lower_bar_context_menu_to(cmm);
		handleContextMenu(x, y);
		return true;
	}
	else if (mouseInSeekbar(x, y)) {
		trace_call && console.log('Seekbar => on_mouse_rbtn_up');
		qwr_utils.append_seekbar_context_menu_to(cmm);
		handleContextMenu(x, y);
		return true;
	}

	if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) && mouseInPlaylist(x, y)) {
		trace_call && console.log('Playlist => on_mouse_rbtn_up');
		if (displayCustomThemeMenu && displayBiography) return;
		return playlist.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayLibrary && mouseInLibrary(x, y)) {
		trace_call && console.log('Library => on_mouse_rbtn_up');
		return library.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayBiography && mouseInBiography(x, y)) {
		trace_call && console.log('Biography => on_mouse_rbtn_up');
		return biography.on_mouse_rbtn_up(x, y, m);
	}
	else {
		return pref.disableRightClick;
	}
}


/**
 * Called when using the mouse wheel, also used to cycle through album artworks and control the seekbar.
 * @param {number} step The scroll direction: -1 or 1.
 */
function on_mouse_wheel(step) {
	const showVolumeBtn = pref[`showVolumeBtn_${pref.layout}`];
	const displayAlbumArt = pref.layout !== 'compact' &&
		(!displayPlaylistArtwork && !displayBiography && !pref.displayLyrics || (displayLibrary && pref.libraryLayout === 'normal'));

	if (showVolumeBtn && volumeBtn.on_mouse_wheel(step)) return;

	// * Seeking through playback
	if (mouseInSeekbar()) {
		fb.PlaybackTime = fb.PlaybackTime - step * pref.progressBarWheelSeekSpeed;
		refreshSeekbar();
		if (pref.seekbar === 'peakmeterbar') peakmeterBar.on_mouse_wheel(step);
		return;
	}

	// * Cycling through album artwork
	if (pref.cycleArtMWheel && albumArtList.length > 1 && displayAlbumArt && mouseInAlbumArt()) {
		// Prev album art image
		if (step > 0) {
			if (albumArtIndex !== 0) {
				albumArtIndex = (albumArtIndex - 1) % albumArtList.length;
			}
		}
		// Next album art image
		else if (albumArtIndex !== albumArtList.length - 1) {
			albumArtIndex = (albumArtIndex + 1) % albumArtList.length;
		}
		loadImageFromAlbumArtList(albumArtIndex);
		// Display embedded album art image
		if (pref.loadEmbeddedAlbumArtFirst && albumArtIndex === 0) {
			albumArt = utils.GetAlbumArtV2(fb.GetNowPlaying());
			albumArtList.unshift(albumArt);
			albumArtIndex = 0;
		}

		// Update colors for dynamic themes
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme) || pref.styleBlackAndWhiteReborn || pref.styleBlackReborn) {
			newTrackFetchingArtwork = true;
			getThemeColors(albumArt);
			initTheme();
			DebugLog('\n>>> initTheme -> on_mouse_wheel <<<\n');
		}

		// Update positions
		resizeArtwork(true); // Re-adjust discArt shadow size if artwork size changes
		if (pref.panelWidthAuto && albumArtSize.w !== albumArtSize.h) { // Re-adjust playlist if artwork size changes
			playlist.on_size(ww, wh);
		}
		lastLeftEdge = 0;
		repaintWindow();
		return;
	}

	if (pref.displayLyrics && mouseInAlbumArt()) {
		lyrics.on_mouse_wheel(step);
	}
	else if (displayBiography && mouseInBiography()) {
		trace_call && console.log('Biography => on_mouse_wheel');
		biography.on_mouse_wheel(step);
	}
	else if ((displayPlaylist && !displayLibrary || displayPlaylistArtwork || displayLibrarySplit(true)) && mouseInPlaylist()) {
		trace_call && console.log('Playlist => on_mouse_wheel');
		playlist.on_mouse_wheel(step);
	}
	else if (displayLibrary && mouseInLibrary()) {
		trace_call && console.log('Library => on_mouse_wheel');
		library.on_mouse_wheel(step);
	}
}


/**
 * Called in other panels after window.NotifyOthers is executed.
 * @param {string} name The name of the data that was updated.
 * @param {*} info The data that was updated:
 *
 * - 1. Data from `info` argument is only accessible inside `on_notify_data` callback:
 * if stored and accessed outside of the callback it will throw JS error.
 * This also applies to the data produced from that `info`: e.g. storing `info.Path` directly (if `info` is FbMetadbHandle).
 *
 * - 2. If you want to store the data from `info` you have to perform a deep copy:
 * `String(info)` for strings.
 * `JSON.parse(JSON.stringify(info))` for serializable objects.
 * `new ObjectType(info)` for objects that have an approppriate constructor available, e.g. `new GdiBitmap(info)` or `new FbMetadbHandleList(info)`.
 *
 * - 3. `info` argument is shared between panels, so it should NOT be modified in any way.
 */
function on_notify_data(name, info) {
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_notify_data');
		playlist.on_notify_data(name, info);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_notify_data');
		library.on_notify_data(name, info);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_notify_data');
		biography.on_notify_data(name, info);
	}
}


/**
 * Called when Per-track dynamic info (stream track titles etc) changes.
 *
 * Happens less often than on_playback_dynamic_info.
 */
function on_playback_dynamic_info_track() {
	// How frequently does this get called?
	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : null;
	on_playback_new_track(metadb);

	if (displayPlaylist || displayPlaylistArtwork) {
		playlist.on_playback_dynamic_info_track();
	}
	if (displayBiography) {
		biography.on_playback_dynamic_info_track();
	}
	if (pref.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		initLyrics();
	}
}


/**
 * Called when playback order is changed via the transport playback order button or foobar's playback menu.
 * @param {*} pbo The playback order has following settings:
 * - 0 - Default.
 * - 1 - Repeat (Playlist).
 * - 2 - Repeat (Track).
 * - 3 - Random, 4 Shuffle (tracks).
 * - 5 - Shuffle (albums).
 * - 6 - Shuffle (folders).
 */
function on_playback_order_changed(pbo) {
	// Repaint playback order
	if (pbo !== lastPlaybackOrder) {
		DebugLog('Repainting on_playback_order_changed');
		window.RepaintRect(0.5 * ww, wh - geo.lowerBarHeight, 0.5 * ww, geo.lowerBarHeight);
	}
	lastPlaybackOrder = pbo;

	// Link foobar's playback order menu functions with playback order button
	const showTransportControls = pref[`showTransportControls_${pref.layout}`];
	const showPlaybackOrderBtn  = pref[`showPlaybackOrderBtn_${pref.layout}`];
	const showBtns = showTransportControls && showPlaybackOrderBtn;

	switch (pbo) {
		case PlaybackOrder.Default:
			pref.playbackOrder = 'default';
			if (showBtns) btns.playbackOrder.img = btnImg.PlaybackDefault;
			break;

		case PlaybackOrder.RepeatPlaylist:
			pref.playbackOrder = 'repeatPlaylist';
			if (showBtns) btns.playbackOrder.img = btnImg.PlaybackRepeatPlaylist;
			break;
		case PlaybackOrder.RepeatTrack:
			pref.playbackOrder = 'repeatTrack';
			if (showBtns) btns.playbackOrder.img = btnImg.PlaybackRepeatTrack;
			break;

		case PlaybackOrder.Random:
		case PlaybackOrder.ShuffleTracks:
		case PlaybackOrder.ShuffleAlbums:
		case PlaybackOrder.ShuffleFolders:
			pref.playbackOrder = 'shuffle';
			if (showBtns) btns.playbackOrder.img = btnImg.PlaybackShuffle;
			break;
	}
}


/**
 * Called when pausing current playing track.
 * @param {boolean} state Whether the playback is paused or not.
 */
function on_playback_pause(state) {
	btnPlayPause();
	if (state || fb.PlaybackLength < 0) {
		clearInterval(progressBarTimer);
		clearInterval(discArtRotationTimer);
		window.RepaintRect(0, geo.topMenuHeight, Math.max(albumArtSize.x, SCALE(40)), wh - geo.topMenuHeight - geo.lowerBarHeight);
	}
	else { // Unpausing
		clearInterval(progressBarTimer); // Clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		DebugLog(`on_playback_pause: creating refreshSeekbar() interval with delay = ${progressBarTimerInterval}`);
		progressBarTimer = setInterval(() => {
			refreshSeekbar();
		}, progressBarTimerInterval || 1000);
		if (discArt && pref.spinDiscArt) setDiscArtRotationTimer();
	}

	pauseBtn.repaint();

	if ((albumArt || noAlbumArtStub) && pref.displayLyrics) { // If we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		lyrics.on_playback_pause(state);
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		playlist.on_playback_pause(state);
	}
	if (displayBiography) {
		biography.on_playback_pause(state);
	}
}


/**
 * Called when adding new playlist tracks in queue.
 * @param {number} origin The parameter has following settings:
 * - 0 - User added.
 * - 1 - User removed.
 * - 2 - Playback advance.
 */
function on_playback_queue_changed(origin) {
	trace_call && console.log('Playlist => on_playback_queue_changed');
	playlist.on_playback_queue_changed(origin);
	library.on_playback_queue_changed();
}


/**
 * Called when playback time is being seeked, float value in seconds.
 */
function on_playback_seek() {
	if (pref.seekbar === 'progressbar') {
		progressBar.progressMoved = true;
	} else if (pref.seekbar === 'peakmeterbar') {
		peakmeterBar.progressMoved = true;
	}
	if (pref.displayLyrics) {
		lyrics.seek();
	}
	else if (displayBiography) {
		biography.on_playback_seek();
	}
	on_playback_time();
	refreshSeekbar();
}


/**
 * Called when playback process is being initialized, on_playback_new_track should be called soon after this when first file is successfully opened for decoding.
 * @param {number} cmd The command has following settings:
 * - 0 - Default.
 * - 1 - Play.
 * - 2 - Plays the next track from the current playlist according to the current playback order.
 * - 3 - Plays the previous track from the current playlist according to the current playback order.
 * - 4 - settrack (internal fb2k value).
 * - 5 - Plays a random track from the current playlist.
 * - 6 - resume (internal fb2k value).
 * @param {boolean} is_paused Whether the playback is paused.
 */
function on_playback_starting(cmd, is_paused) {
	if (settings.hideCursor) {
		window.SetCursor(-1); // Hide cursor
	}
	btnPlayPause();
}


/**
 * Called when playback is stopped.
 * @param {number} reason The playback stop has following settings:
 * - 0 - Invoked by user.
 * - 1 - End of file.
 * - 2 - Starting another track.
 * - 3 - Fb2k is shutting down.
 */
function on_playback_stop(reason) {
	if (reason !== 2) {
		// Clear all variables and repaint
		str = clearUIVariables();
		DebugLog('Repainting on_playback_stop:', reason);
		repaintWindow();
		isPlayingCD = false;
		isStreaming = false;
		lastAlbumFolder = '';
		btns.playbackTime = '';
		lastAlbumDiscNumber = '0';
		recordLabels = [];
		recordLabelsInverted = [];
		btnPlayPause();
		// * Keep Reborn/Random colors when they are not too bright or too dark otherwise reset colors to default
		if (['reborn', 'random'].includes(pref.theme) && ((colBrightness < 20 || imgBrightness < 20) || (colBrightness > 240 || imgBrightness > 240)) ||
			!['reborn', 'random'].includes(pref.theme)) {
			setThemeColors();
			initTheme();
			DebugLog('\n>>> initTheme -> on_playback_stop <<<\n');
		}
	}

	waveformBar.on_playback_stop(reason);

	clearInterval(discArtRotationTimer);
	clearInterval(progressBarTimer);
	clearTimeout(albumArtTimeout);

	if (albumArt && ((pref.cycleArt && albumArtIndex !== 0) || lastAlbumFolder === '')) {
		DebugLog('disposing artwork');
		albumArt = null;
		albumArtScaled = null;
	}
	bandLogo = null;
	invertedBandLogo = null;

	if (pref.displayLyrics && lyrics) {
		lyrics.on_playback_stop(reason);
	}

	flagImgs = [];
	discArtRotation = null;
	discArtRotationCover = null;
	albumArtTimeout = 0;

	if (pref.panelWidthAuto) {
		initPanelWidthAuto();
	}

	if (reason === 0 || reason === 1) { // Stop or end of playlist
		discArt = disposeDiscArt(discArt);
		discArtCover = disposeDiscArt(discArtCover);
		discArtArray = []; // Clear Images
		discArtArrayCover = []; // Clear Images
		window.Repaint();
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		playlist.on_playback_stop(reason);
	}
	else if (displayLibrary) {
		library.on_playback_stop(reason);
	}
	if (displayBiography) {
		biography.on_playback_stop(reason);
	}
}


/**
 * Called when clicking on playlist items that are visible in the playlist panel.
 * @param {number} playlistIndex The index of the playlist.
 * @param {number} playlistItemIndex The index of the playlist item.
 */
function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlist_item_ensure_visible');
		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}


/**
 * Called when adding tracks to the playlist.
 * @param {number} playlistIndex The index of the playlist.
 */
function on_playlist_items_added(playlistIndex) {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Added);
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlist_items_added');
		playlist.on_playlist_items_added(playlistIndex);
	}
	if (displayLibrary || displayLibrarySplit()) {
		trace_call && console.log('Library => on_playlist_items_added');
		library.on_playlist_items_added(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlist_items_added');
		biography.on_playlist_items_added(playlistIndex);
	}
}


/**
 * Called when removing tracks from the playlist.
 * @param {number} playlistIndex The index of the playlist.
 */
function on_playlist_items_removed(playlistIndex) {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Removed);
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlist_items_removed');
		playlist.on_playlist_items_removed(playlistIndex);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlist_items_removed');
		library.on_playlist_items_removed(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlist_items_removed');
		biography.on_playlist_items_removed(playlistIndex);
	}
}


/**
 * Called when reordering tracks in the playlist, i.e by dragging them up or down.
 * Changes selection too. Doesn't actually change the set of items that are selected or item having focus, just changes their order.
 * @param {number} playlistIndex The index of the playlist.
 */
function on_playlist_items_reordered(playlistIndex) {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Reordered);
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlist_items_reordered');
		playlist.on_playlist_items_reordered(playlistIndex);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlist_items_reordered');
		library.on_playlist_items_reordered(playlistIndex);
	}
}


/**
 * Called as a workaround for some 3rd party playlist viewers not working with on_selection_changed.
 */
function on_playlist_items_selection_change() {
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlist_items_selection_change');
		playlist.on_playlist_items_selection_change();
	}
}


/**
 * Called when switching the current active playlist to another.
 */
function on_playlist_switch() {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Switch);
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlist_switch');
		playlist.on_playlist_switch();
	}
	if (displayLibrary || ppt.libSource === 0) {
		trace_call && console.log('Library => on_playlist_switch');
		library.on_playlist_switch();
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlist_switch');
		biography.on_playlist_switch();
	}
}


/**
 * Called when playlists are added/removed/reordered/renamed or a playlist's lock status changes.
 */
function on_playlists_changed() {
	if (playlistHistory) {
		playlistHistory.reset(); // When playlists are changed, indexes no longer apply, and so we have to wipe history
	}
	if (displayPlaylist || displayPlaylistArtwork) {
		trace_call && console.log('Playlist => on_playlists_changed');
		playlist.on_playlists_changed();
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlists_changed');
		library.on_playlists_changed();
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlists_changed');
		biography.on_playlists_changed();
	}
}


/**
 * Called when script is reloaded via context menu > Reload or script is changed via panel menu > Configure or fb2k is exiting normally.
 */
function on_script_unload() {
	console.log('Unloading Script');
	waveformBar.on_script_unload();

	// It appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
	if (displayLibrary) {
		library.on_script_unload();
	}
	else if (displayBiography) {
		biography.on_script_unload();
	}
}


/**
 * Called when volume changes, i.e the volume bar in the volume button.
 * @param {float} val The volume level in dB. Minimum is -100. Maximum is 0.
 */
function on_volume_change(val) {
	trace_call && console.log('Volume bar => on_volume_change');
	volumeBtn.on_volume_change(val);
}


//////////////////////////
// * CUSTOM CALLBACKS * //
//////////////////////////
/**
 * Checks if the mouse is within the boundaries of the top menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInTopMenu(x, y) {
	if (x < ww - SCALE(100) && y < geo.topMenuHeight) {
		trace_call && trace_on_move && console.log('mouseInTopMenu');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the album art.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInAlbumArt(x, y) {
	const displayAlbumArt =
		pref.layout === 'default' && !displayBiography && (displayPlaylist && !displayLibrary && pref.playlistLayout !== 'full' // Playlist
		||
		displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode' // Library
		||
		!displayPlaylist && !displayLibrary || pref.displayLyrics) // Details, Lyrics
		||
		pref.layout === 'artwork' && !displayBiography && (displayPlaylist || !displayPlaylistArtwork && !displayLibrary); // Cover, Details, Lyrics

	const albumArtBounds =
		state.mouse_x > 0 && state.mouse_x <= ((isStreaming || !albumArt && noArtwork || albumArt) && (displayPlaylist || displayLibrary) &&
		pref.layout === 'default' ? pref.panelWidthAuto ? albumArtSize.x + albumArtSize.w : ww * 0.5 : !displayPlaylist && !displayLibrary ? ww : albumArtSize.w) &&
		state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h;

	if (displayAlbumArt && albumArtBounds) {
		trace_call && trace_on_move && console.log('mouseInAlbumArt');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse can pause when clicking on the album art or noAlbumArtStub.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInPause(x, y) {
	// * Do not pause when Playlist/Library layout is in full width or when using Library's flow mode
	const panelPlaylist = displayPlaylist  && !displayLibrary && !displayBiography && pref.playlistLayout !== 'full';
	const panelDetails  = !displayPlaylist && !displayLibrary && !displayBiography;
	const panelLibrary  = displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode';
	const artworkLayout = pref.layout === 'artwork' && !displayPlaylistArtwork && !displayLibrary && !displayBiography;

	const albumArtBounds   = albumArtSize.x <= x && albumArtSize.y <= y && albumArtSize.x + albumArtSize.w >= x && albumArtSize.y + albumArtSize.h >= y;
	const discArtBounds    = discArtSize.x  <= x && discArtSize.y  <= y && discArtSize.x  + discArtSize.w  >= x && discArtSize.y  + discArtSize.h  >= y;
	const noAlbumArtBounds = state.mouse_x > 0 && state.mouse_x <= (displayPlaylist || displayLibrary ? albumArtSize.x + albumArtSize.w : !displayPlaylist || !displayLibrary ? ww : ww * 0.5) &&
							 state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.h + geo.topMenuHeight;
	const pauseOnAlbumArt =
		(pref.layout === 'default' && albumArt && (panelPlaylist || panelDetails || panelLibrary) || artworkLayout) &&
		!displayCustomThemeMenu && !displayMetadataGridMenu && albumArtBounds || discArt && !albumArt && discArtBounds;

	const pauseOnNoAlbumArt =
		(pref.layout === 'default' && !albumArt && (panelPlaylist || panelDetails || panelLibrary) || artworkLayout) &&
		!displayCustomThemeMenu && !displayMetadataGridMenu && noAlbumArtBounds;

	if (pauseOnAlbumArt || pauseOnNoAlbumArt) {
		trace_call && trace_on_move && console.log('mouseInPause');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the lower bar.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInLowerBar(x, y) {
	if (y > wh - SCALE(120)) {
		trace_call && trace_on_move && console.log('mouseInLowerBar');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the seekbar.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInSeekbar(x, y) {
	const seekX = x || state.mouse_x;
	const seekY = y || state.mouse_y;
	const pBar = pref.seekbar === 'progressbar';

	if (seekX >= SCALE(40) && seekX < ww - SCALE(40) &&
		seekY >= wh - (pref.layout !== 'default' ? 0.6 : 0.5) * geo.lowerBarHeight - 0.5 * geo.progBarHeight &&
		seekY <= wh - (pref.layout !== 'default' ? SCALE(pBar ? 60 : 55) : SCALE(pBar ? 35 : 20))) {
		trace_call && trace_on_move && console.log('mouseInSeekbar');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the panel.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInPanel(x, y) {
	if (y < geo.topMenuHeight && y > wh - geo.topMenuHeight - geo.lowerBarHeight) {
		trace_call && trace_on_move && console.log('mouseInPanel');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Playlist.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInPlaylist(x, y) {
	const plistX = x || state.mouse_x;
	const plistY = y || state.mouse_y;

	if (plistX >= playlist.x && plistX < playlist.x + playlist.w &&
		plistY >= (pref.layout !== 'default' ? playlist.y - SCALE(g_properties.row_h) : playlist.y) && plistY < playlist.y + playlist.h) {
		trace_call && trace_on_move && console.log('Playlist => mouseInPlaylist');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Library.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInLibrary(x, y) {
	const libX = x || state.mouse_x;
	const libY = y || state.mouse_y;

	if (libX >= ui.x && libX < ui.x + ui.w && libY >= ui.y && libY < ui.y + ui.h) {
		trace_call && trace_on_move && console.log('Library => mouseInLibrary');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Library search.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInLibrarySearch(x, y) {
	if (!but.Dn && x > ui.x + but.q.h + but.margin && x < panel.search.x + panel.search.w &&
		y > ui.y && y < ui.y + panel.search.h && ppt.searchShow) {
		trace_call && trace_on_move && console.log('Library => mouseInLibrarySearch');
		return true;
	}

	return false;
}


/**
 * Checks if the mouse is within the boundaries of the Biography.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseInBiography(x, y) {
	const bioX = x || state.mouse_x;
	const bioY = y || state.mouse_y;

	if (bioX >= uiBio.x && bioX < uiBio.x + uiBio.w && bioY >= uiBio.y && bioY < uiBio.y + uiBio.h) {
		trace_call && trace_on_move && console.log('Biography => mouseInBiography');
		return true;
	}

	return false;
}
