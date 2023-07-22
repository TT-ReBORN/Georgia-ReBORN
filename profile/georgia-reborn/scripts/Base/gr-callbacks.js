/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Callbacks                            * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-07-22                                          * //
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
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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

			const showGridArtistFlags     = pref.layout === 'artwork' ? pref.showGridArtistFlags_artwork     : pref.showGridArtistFlags_default;
			const showGridReleaseFlags    = pref.layout === 'artwork' ? pref.showGridReleaseFlags_artwork    : pref.showGridReleaseFlags_default;
			const showLowerBarArtistFlags = pref.layout === 'compact' ? pref.showLowerBarArtistFlags_compact : pref.layout === 'artwork' ? pref.showLowerBarArtistFlags_artwork : pref.showLowerBarArtistFlags_default;

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
		if (displayPlaylist || displayPlaylistArtworkLayout || !displayPlaylist) {
			trace_call && console.log('Playlist => on_metadb_changed');
			playlist.on_metadb_changed(handle_list, fromhook);
		}
		if (displayLibrary) {
			trace_call && console.log('Library => on_metadb_changed');
			library.on_metadb_changed(handle_list, fromhook);
		}
		if (displayBiography) {
			trace_call && console.log('Biography => on_metadb_changed');
			biography.on_metadb_changed(handle_list, fromhook);
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
			DebugLog('initTheme -> fetchNewArtwork -> on_playback_new_track -> themeDayNightModeTimer');
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
		// * Pick a new random theme preset
		if (pref.presetSelectMode === 'theme') setThemePresetSelection(false, true);
		if ((!['off', 'track'].includes(pref.presetAutoRandomMode) && pref.presetSelectMode === 'harmonic' ||
			pref.presetAutoRandomMode === 'dblclick' && pref.presetSelectMode === 'theme') && !doubleClicked) {
			themePresetRandomPicker();
		}
		// * Init and set theme tags
		initThemeTags();
	}
	else if (pref.cycleArt && albumArtList.length > 1) {
		// Need to do this here since we're no longer always fetching when albumArtList.length > 1
		albumArtTimeout = setTimeout(() => {
			displayNextImage();
		}, settings.artworkDisplayTime * 1000);
	}

	// * Pick a new random theme preset on new track
	if (pref.presetAutoRandomMode === 'track' && !doubleClicked) themePresetRandomPicker();

	// * Generate a new color in Random theme on new track
	if (pref.styleRandomAutoColor === 'track' && !doubleClicked) getRandomThemeAutoColor();

	if (discArt) {
		setDiscArtRotationTimer();
	}
	if (pref.rotateDiscArt && !pref.spinDiscArt) {
		createRotatedDiscArtImage(); // We need to always setup the rotated image because it rotates on every track
	}

	// * Code to retrieve record label logos
	let labelStrings = [];
	recordLabels = [];	// Will free memory from earlier loaded record label images
	recordLabelsInverted = [];
	for (let i = 0; i < tf.labels.length; i++) {
		labelStrings.push(...getMetaValues(tf.labels[i], metadb));
	}
	labelStrings = [...new Set(labelStrings)];
	for (let i = 0; i < labelStrings.length; i++) {
		const addLabel = loadLabelImage(labelStrings[i]);
		if (addLabel != null) {
			recordLabels.push(addLabel);
			try {
				recordLabelsInverted.push(addLabel.InvertColours());
			} catch (e) {}
		}
	}

	function testArtistLogo(artistStr) {
		// See if artist logo exists at various paths
		const testBandLogoPath = (imgDir, name) => {
			if (name) {
				const logoPath = `${imgDir + name}.png`;
				if (IsFile(logoPath)) {
					console.log(`Found band logo: ${logoPath}`);
					return logoPath;
				}
			}
			return false;
		};

		return testBandLogoPath(paths.artistlogos, artistStr) || // Try 800x310 white
			testBandLogoPath(paths.artistlogosColor, artistStr); // Try 800x310 color
	}

	// * Code to retrieve band logo
	let tryArtistList = [
		...getMetaValues('%album artist%').map(artist => ReplaceFileChars(artist)),
		...getMetaValues('%album artist%').map(artist => ReplaceFileChars(artist).replace(/^[Tt]he /, '')),
		ReplaceFileChars($('[%track artist%]')),
		...getMetaValues('%artist%').map(artist => ReplaceFileChars(artist)),
		...getMetaValues('%artist%').map(artist => ReplaceFileChars(artist).replace(/^[Tt]he /, ''))
	];
	tryArtistList = [...new Set(tryArtistList)];

	bandLogo = null;
	invertedBandLogo = null;
	let path;
	tryArtistList.some(artistString => {
		path = testArtistLogo(artistString);
		return path;
	});
	if (path) {
		bandLogo = artCache.getImage(path);
		if (!bandLogo) {
			const logo = gdi.Image(path);
			if (logo) {
				bandLogo = artCache.encache(logo, path);
				invertedBandLogo = artCache.encache(logo.InvertColours(), `${path}-inv`);
			}
		}
		invertedBandLogo = artCache.getImage(`${path}-inv`);
		if (!invertedBandLogo && bandLogo) {
			invertedBandLogo = artCache.encache(bandLogo.InvertColours(), `${path}-inv`);
		}
	}

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
	waveformBar.on_playback_new_track_queue(metadb);
	peakmeterBar.on_playback_new_track(metadb);

	if (displayPlaylist || displayPlaylistArtworkLayout || !displayPlaylist) {
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

	checkForRes(ww, wh);
	checkForPlayerSize();

	if (!sizeInitialized) {
		createFonts();
		setGeometry();
		if (fb.IsPlaying) {
			loadCountryFlags(); // Wrong size flag gets loaded on 4k systems
		}
		rescalePlaylist(true);
		initPlaylist();
		volumeBtn = new VolumeBtn();
		artCache.clear();
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

	if ((pref.styleBlend || pref.styleBlend2 || pref.styleProgressBarFill === 'blend') && albumArt) setStyleBlend(); // Reposition all drawn blendedImg

	initButtonState();

	// * UIHacks double click on caption in fullscreen
	if (!componentUIHacks) return;

	try { // Needed when double clicking on caption and UIHacks.FullScreen === true; also disabling maximize in Artwork layout
		if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState === WindowState.Normal || pref.layout === 'artwork' && UIHacks.MainWindowState === WindowState.Maximized) {
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
 * @param {number} code
 */
function on_char(code) {
	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_char(code);
	}
	else if (displayPlaylist && !displayLibrary || !displayPlaylist && !displayLibrary || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_char');
		jumpSearch.on_char(code);

		// Switch back to Playlist
		if (pref.layout === 'default' && !displayPlaylist && !displayLibrary) {
			btns.details.onClick();
		}
		else if (pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary) {
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
 * @param {DropTargetAction} action
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} mask The mouse mask.
 */
function on_drag_enter(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
 * @param {DropTargetAction} action
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} mask The mouse mask.
 */
function on_drag_over(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
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
 * @param {DropTargetAction} action
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} mask The mouse mask.
 */
function on_drag_drop(action, x, y, mask) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_drag_drop');
		playlist.on_drag_drop(action, x, y, mask);
	}
}


/**
 * Called when the panel gets or loses focus.
 * @param {boolean} is_focused
 */
function on_focus(is_focused) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
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
 * Called when focused item in playlist has been changed.
 * @param {number} playlistIndex
 * @param {number} from
 * @param {number} to
 */
function on_item_focus_change(playlistIndex, from, to) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
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
 * @param {number} vkey
 */
function on_key_down(vkey) {
	const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_key_down(vkey);
	}
	else {
		if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
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
		case 0x6B: // VK_ADD ??
		case 0x6D: // VK_SUBTRACT ??
		if (CtrlKeyPressed && ShiftKeyPressed) {
			const action = vkey === 0x6B ? '+' : '-';
			const metadb = fb.GetNowPlaying();
			if (fb.IsPlaying) {
				fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadb);
			}
			else if (!metadb && (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true))) {
				const metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
				if (metadbList.Count === 1) {
					fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadbList[0]);
				} else {
					console.log('Won\'t change rating with more than one selected item');
				}
			}
		}
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
 * @param {number} vkey
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
 * @param {FbMetadbHandleList} handle_list
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
 * @param {FbMetadbHandleList} handle_list
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
 * @param {FbMetadbHandleList} handle_list
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
}


/**
 * Called when double clicking the left mouse button.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_lbtn_dblclk(x, y, m) {
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && mousePlaylist(x, y)) {
		trace_call && console.log('Playlist => on_mouse_lbtn_dblclk');
		if (displayCustomThemeMenu && pref.displayLyrics) return;
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayLibrary && mouseLibrary(x, y)) {
		trace_call && console.log('Library => on_mouse_lbtn_dblclk');
		library.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayBiography && mouseBiography(x, y)) {
		trace_call && console.log('Biography => on_mouse_lbtn_dblclk');
		biography.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (!displayCustomThemeMenu && !displayMetadataGridMenu || displayCustomThemeMenu && y < geo.topMenuHeight && y > wh - geo.topMenuHeight - geo.lowerBarHeight) {
		if (presetIndicatorTimer) {
			clearTimeout(presetIndicatorTimer);
			presetIndicatorTimer = null;
		}
		doubleClicked = true;
		if (fb.IsPlaying && !mouseInControl && (state.mouse_x > 0 && state.mouse_x && state.mouse_y > wh - SCALE(120) && state.mouse_y)) {
			// * Pick a new random theme preset
			if (pref.presetAutoRandomMode === 'dblclick') {
				themePresetIndicator = true;
				themePresetRandomPicker();
			}
			// * Generate a new color in Random theme
			else if (pref.theme === 'random') {
				initTheme();
				DebugLog('initTheme -> on_mouse_lbtn_dblclk -> random theme');
			}
			// * Refresh theme
			else if (settings.doubleClickRefresh) {
				albumArt = null;
				artCache.clear();
				discArtArray = [];
				discArt = null;
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
	const showProgressBar = pref.layout === 'compact' ? pref.showProgressBar_compact : pref.layout === 'artwork' ? pref.showProgressBar_artwork : pref.showProgressBar_default;
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

		// * Clicking on progress bar
		if (showProgressBar && y >= wh - 0.5 * geo.lowerBarHeight && y <= wh - 0.5 * geo.lowerBarHeight + geo.progBarHeight - SCALE(20) && x >= 0.025 * ww && x < 0.975 * ww) {
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

		if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && mousePlaylist(x, y)) {
			trace_call && console.log('Playlist => on_mouse_lbtn_down');
			if (displayCustomThemeMenu && displayBiography) return;
			playlist.on_mouse_lbtn_down(x, y, m);
		}
		else if (displayLibrary && mouseLibrary(x, y)) {
			trace_call && console.log('Library => on_mouse_lbtn_down');
			library.on_mouse_lbtn_down(x, y, m);
		}
		if (displayBiography && mouseBiography(x, y)) {
			trace_call && console.log('Biography => on_mouse_lbtn_down');
			biography.on_mouse_lbtn_down(x, y, m);
		}

		// * Clicking on album art
		else if (pref.layout === 'default' && albumArt && (displayPlaylist && !displayLibrary && !displayBiography && pref.playlistLayout !== 'full' ||
			!displayPlaylist && !displayLibrary && !displayBiography || displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode') ||
			pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) {

			// Do not pause when playlist/library layout is in full width or library's flow mode
			if ((!displayCustomThemeMenu && !displayMetadataGridMenu) && (albumArtSize.x <= x && albumArtSize.y <= y && albumArtSize.x + albumArtSize.w >= x && albumArtSize.y + albumArtSize.h >= y) ||
				(discArt && !albumArt && discArtSize.x <= x && discArtSize.y <= y && discArtSize.x + discArtSize.w >= x && discArtSize.y + discArtSize.h >= y)) {
				fb.PlayOrPause();
			}
		}
		// * When noAlbumArtStub, isStreaming, isPlayingCD
		else if (pref.layout === 'default' && !albumArt && (displayPlaylist && !displayLibrary && !displayBiography && pref.playlistLayout !== 'full' ||
			!displayPlaylist && !displayLibrary && !displayBiography || displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode') ||
			pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) {

			// Do not pause when playlist/library layout is in full width or library's flow mode
			if ((!displayCustomThemeMenu && !displayMetadataGridMenu) && state.mouse_x > 0 && state.mouse_x <= (displayPlaylist || displayLibrary ? ww * 0.5 : !displayPlaylist || !displayLibrary ? ww :  ww * 0.5) &&
				state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.h + geo.topMenuHeight) {
				fb.PlayOrPause();
			}
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

	if (!volumeBtn.on_mouse_lbtn_up(x, y, m)) {
		// Not handled by volumeBtn
		if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary() && mousePlaylist(x, y)) {
			trace_call && console.log('Playlist => on_mouse_lbtn_up');
			if (displayCustomThemeMenu && displayBiography) return;
			playlist.on_mouse_lbtn_up(x, y, m);

			if (!pref.lockPlayerSize) qwr_utils.EnableSizing(m);
		}
		else if (displayLibrary && mouseLibrary(x, y)) {
			trace_call && console.log('Library => on_mouse_lbtn_up');
			library.on_mouse_lbtn_up(x, y, m);
		}
		if (displayBiography && mouseBiography(x, y)) {
			trace_call && console.log('Biography => on_mouse_lbtn_up');
			biography.on_mouse_lbtn_up(x, y, m);
		}

		if (doubleClicked) {
			doubleClicked = false; // You just did a double-click, so do nothing
		}

		on_mouse_move(x, y);
	}
}


/**
 * Called when mouse leaves the window.
 */
function on_mouse_leave() {
	const showVolumeBtn = pref.layout === 'compact' ? pref.showVolumeBtn_compact : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork : pref.showVolumeBtn_default;

	if (showVolumeBtn && volumeBtn) {
		volumeBtn.on_mouse_leave();
	}
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
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
	const showGridTimeline      = pref.layout === 'artwork' ? pref.showGridTimeline_artwork      : pref.showGridTimeline_default;
	const showTransportControls = pref.layout === 'compact' ? pref.showTransportControls_compact : pref.layout === 'artwork' ? pref.showTransportControls_artwork : pref.showTransportControls_default;
	const showVolumeBtn         = pref.layout === 'compact' ? pref.showVolumeBtn_compact         : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork         : pref.showVolumeBtn_default;
	const librarySearchBox      = !but.Dn && y > ui.y && y < ui.y + panel.search.h && ppt.searchShow && x > ui.x + but.q.h + but.margin && x < panel.search.x + panel.search.w;

	if (x !== state.mouse_x || y !== state.mouse_y) {
		if (!librarySearchBox) window.SetCursor(32512); // Arrow

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
				onTopMenuCompact(true);
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

		if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && mousePlaylist(x, y)) {
			trace_call && trace_on_move && console.log('Playlist => on_mouse_move');

			if (mouse_move_suppress.is_supressed(x, y, m)) {
				return;
			}

			qwr_utils.DisableSizing(m);
			playlist.on_mouse_move(x, y, m);
		}
		else if (displayLibrary && mouseLibrary(x, y)) {
			trace_call && trace_on_move && console.log('Library => on_mouse_move');
			library.on_mouse_move(x, y, m);
		}
		else if (displayBiography && mouseBiography(x, y)) {
			trace_call && trace_on_move && console.log('Biography => on_mouse_move');
			biography.on_mouse_move(x, y, m);
		}
		else if (showGridTimeline && str.timeline && str.timeline.mouseInThis(x, y) && (pref.layout === 'default' && !displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics ||
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

		UIHacksDragWindow(x, y);
	}
}


/**
 * Called when right mouse button is pressed.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} m The mouse mask.
 */
function on_mouse_rbtn_down(x, y, m) {
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && mousePlaylist(x, y)) {
		trace_call && console.log('Playlist => on_mouse_rbtn_down');
		if (displayCustomThemeMenu && displayBiography) return;
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
	if ((fb.IsPlaying && !displayBiography && (pref.layout === 'default' || !displayPlaylistArtworkLayout && !displayLibrary && pref.layout === 'artwork')) &&
		state.mouse_x > 0 && state.mouse_x <= ((isStreaming || !albumArt && noArtwork || albumArt) && (displayPlaylist || displayLibrary) && pref.layout === 'default' ? ww * 0.5 : !displayPlaylist && !displayLibrary ? ww : albumArtSize.w) &&
		state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h) {

		// * Do not show album cover context menu when Playlist/Library layout is in full width or when using Library's flow mode
		if (!displayPlaylist && !displayLibrary && !displayBiography || pref.displayLyrics || displayPlaylist && !displayLibrary && pref.playlistLayout !== 'full' || displayPlaylist && pref.layout === 'artwork' || displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode') {
			trace_call && console.log('Details => on_mouse_rbtn_up');
			const cmac = new ContextMainMenu();
			qwr_utils.append_album_cover_context_menu_to(cmac);

			activeMenu = true;
			cmac.execute(x, y);
			activeMenu = false;

			return true;
		}
	}
	if (fb.IsPlaying && state.mouse_x > 0 && state.mouse_x && state.mouse_y > wh - SCALE(120) && state.mouse_y) {
		trace_call && console.log('Lower bar => on_mouse_rbtn_up');
		const cmac = new ContextMainMenu();
		qwr_utils.append_lower_bar_context_menu_to(cmac);

		activeMenu = true;
		cmac.execute(x, y);
		activeMenu = false;

		return true;
	}
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && mousePlaylist(x, y)) {
		trace_call && console.log('Playlist => on_mouse_rbtn_up');
		if (displayCustomThemeMenu && displayBiography) return;
		return playlist.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayLibrary && mouseLibrary(x, y)) {
		trace_call && console.log('Library => on_mouse_rbtn_up');
		return library.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayBiography && mouseBiography(x, y)) {
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
	const showVolumeBtn = pref.layout === 'compact' ? pref.showVolumeBtn_compact : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork : pref.showVolumeBtn_default;
	const pBar = pref.seekbar === 'progressbar';

	if (showVolumeBtn && volumeBtn.on_mouse_wheel(step)) return;

	if (state.mouse_y >  wh - (pref.layout !== 'default' ? 0.6 : 0.5) * geo.lowerBarHeight - 0.5 * geo.progBarHeight &&
		state.mouse_y <= wh - (pref.layout !== 'default' ? SCALE(pBar ? 60 : 55) : SCALE(pBar ? 35 : 20))) {
		fb.PlaybackTime = fb.PlaybackTime - step * pref.progressBarWheelSeekSpeed;
		refreshSeekbar();
		if (pref.seekbar === 'peakmeterbar') peakmeterBar.on_mouse_wheel(step);
		return;
	}

	if (pref.cycleArtMWheel && albumArtList.length > 1 && pref.layout !== 'compact' && !pref.displayLyrics && !displayBiography && !displayLibrary && !displayPlaylistArtworkLayout &&
		state.mouse_x > albumArtSize.x && state.mouse_x <= albumArtSize.x + albumArtSize.w && state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h) {
		on_mouse_wheel_albumart = true;
		if (step > 0) { // Prev album art image
			if (albumArtIndex !== 0) albumArtIndex = (albumArtIndex - 1) % albumArtList.length;
		} else {		 // Next album art image
			if (albumArtIndex !== albumArtList.length - 1) albumArtIndex = (albumArtIndex + 1) % albumArtList.length;
		}
		loadImageFromAlbumArtList(albumArtIndex);
		if (pref.theme === 'reborn' || pref.theme === 'random' || pref.styleBlackAndWhiteReborn || pref.styleBlackReborn) {
			newTrackFetchingArtwork = true;
			getThemeColors(albumArt);
			initTheme();
			DebugLog('initTheme -> on_mouse_wheel');
		}
		resizeArtwork(true); // Needed to readjust discArt shadow size if artwork size changes
		lastLeftEdge = 0;
		repaintWindow();
		return;
	}
	on_mouse_wheel_albumart = false;

	if (pref.displayLyrics && state.mouse_x > albumArtSize.x && state.mouse_x <= albumArtSize.x + albumArtSize.w && state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h) {
		lyrics.on_mouse_wheel(step);
	}
	else if (displayBiography && state.mouse_x > uiBio.x && state.mouse_x <= uiBio.x + uiBio.w && state.mouse_y > uiBio.y && state.mouse_y <= uiBio.y + uiBio.h) {
		trace_call && console.log('Biography => on_mouse_wheel');
		biography.on_mouse_wheel(step);
	}
	else if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && state.mouse_y > playlist.y && state.mouse_y <= playlist.y + playlist.h) {
		trace_call && console.log('Playlist => on_mouse_wheel');
		playlist.on_mouse_wheel(step);
	}
	else if (displayLibrary && state.mouse_y > ui.y && state.mouse_y <= ui.y + ui.h) {
		trace_call && console.log('Library => on_mouse_wheel');
		library.on_mouse_wheel(step);
	}
}


/**
 * Called in other panels after window.NotifyOthers is executed.
 * @param {string} name
 * @param {*} info
 */
function on_notify_data(name, info) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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

	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
	const showTransportControls = pref.layout === 'compact' ? pref.showTransportControls_compact : pref.layout === 'artwork' ? pref.showTransportControls_artwork : pref.showTransportControls_default;
	const showPlaybackOrderBtn  = pref.layout === 'compact' ? pref.showPlaybackOrderBtn_compact  : pref.layout === 'artwork' ? pref.showPlaybackOrderBtn_artwork  : pref.showPlaybackOrderBtn_default;
	const showBtns = showTransportControls && showPlaybackOrderBtn;

	if (pbo === PlaybackOrder.Default) {
		pref.playbackOrder = 'Default';
		if (showBtns) btns.playbackOrder.img = btnImg.PlaybackDefault;
	}
	else if (pbo === PlaybackOrder.RepeatTrack || pbo === PlaybackOrder.RepeatPlaylist) {
		pref.playbackOrder = 'Repeat';
		if (showBtns) btns.playbackOrder.img = btnImg.PlaybackReplay;
	}
	else if (pbo === PlaybackOrder.ShuffleTracks || pbo === PlaybackOrder.ShuffleAlbums || pbo === PlaybackOrder.ShuffleFolders || pbo === PlaybackOrder.Random) {
		pref.playbackOrder = 'Shuffle';
		if (showBtns) btns.playbackOrder.img = btnImg.PlaybackShuffle;
	}
}


/**
 * Called when pausing current playing track.
 * @param {boolean} state
 */
function on_playback_pause(state) {
	updatePlayButton();
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
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
 * @param {boolean} is_paused
 */
function on_playback_starting(cmd, is_paused) {
	if (settings.hideCursor) {
		window.SetCursor(-1); // Hide cursor
	}
	updatePlayButton();
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
		updatePlayButton();
		// * Keep Reborn/Random colors when they are not too bright or too dark otherwise reset colors to default
		if (['reborn', 'random'].includes(pref.theme) && ((colBrightness < 20 || imgBrightness < 20) || (colBrightness > 240 || imgBrightness > 240)) ||
			!['reborn', 'random'].includes(pref.theme)) {
			setThemeColors();
			initTheme();
			DebugLog('initTheme -> on_playback_stop');
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
	rotatedDiscArt = null;
	albumArtTimeout = 0;

	if (reason === 0 || reason === 1) { // Stop or end of playlist
		discArt = disposeDiscArtImg(discArt);
		discArtArray = [];	// Clear Images
		window.Repaint();
	}
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
 * @param {number} playlistIndex
 * @param {number} playlistItemIndex
 */
function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_item_ensure_visible');
		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}


/**
 * Called when adding tracks to the playlist.
 * @param {number} playlistIndex
 */
function on_playlist_items_added(playlistIndex) {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Added);
	}
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_items_added');
		playlist.on_playlist_items_added(playlistIndex);
	}
	if (displayLibrary || displayPlaylistLibrary()) {
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
 * @param {number} playlistIndex
 */
function on_playlist_items_removed(playlistIndex) {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Removed);
	}
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
 * @param {number} playlistIndex
 */
function on_playlist_items_reordered(playlistIndex) {
	if (playlistHistory) {
		playlistHistory.playlistAltered(PlaylistMutation.Reordered);
	}
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_switch');
		playlist.on_playlist_switch();
	}
	else if (displayLibrary) {
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
	if (displayPlaylist || displayPlaylistArtworkLayout) {
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
 * Checks if the mouse is within the boundaries of the Playlist.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mousePlaylist(x, y) {
	if (x >= playlist.x && x < playlist.x + playlist.w &&
		y >= (pref.layout !== 'default' ? playlist.y - SCALE(g_properties.row_h) : playlist.y) && y < playlist.y + playlist.h) {
		trace_call && trace_on_move && console.log('Playlist => mousePlaylist');
		return true;
	}
}


/**
 * Checks if the mouse is within the boundaries of the Library.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseLibrary(x, y) {
	if (x >= ui.x && x < ui.x + ui.w && y >= ui.y && y < ui.y + ui.h) {
		trace_call && trace_on_move && console.log('Library => mouseLibrary');
		return true;
	}
}


/**
 * Checks if the mouse is within the boundaries of the Biography.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function mouseBiography(x, y) {
	if (x >= uiBio.x && x < uiBio.x + uiBio.w && y >= uiBio.y && y < uiBio.y + uiBio.h) {
		trace_call && trace_on_move && console.log('Biography => mouseBiography');
		return true;
	}
}
