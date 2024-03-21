/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Button Control                           * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    21-03-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////
// * BUTTON CONTROLS * //
/////////////////////////
/**
 * A class that controls clickable UI button elements with customizable visuals and behavior.
 * The button can display an image, show a tooltip on hover, and maintain an enabled/disabled state.
 */
class Button {
	/**
	 * Creates the `Button` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} id - The id.
	 * @param {GdiBitmap[]} img - The image that will be displayed for the button.
	 * @param {string} tip - The tooltip text for the button.
	 * @param {boolean} isEnabled - A callback function that determines whether the button is enabled or disabled.
	 */
	constructor(x, y, w, h, id, img, tip = undefined, isEnabled = undefined) {
		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = w;
		/** @public @type {number} */
		this.h = h;
		/** @public @type {number} */
		this.id = id;
		/** @public @type {number} */
		this.img = img;
		/** @public @type {number} */
		this.tooltip = typeof tip !== 'undefined' ? tip : '';
		/** @public @type {number} */
		this.state = 0;
		/** @public @type {number} */
		this.hoverAlpha = 0;
		/** @public @type {number} */
		this.downAlpha = 0;
		/** @public @type {boolean} */
		this.isEnabled = isEnabled;
		/** @public @type {boolean} */
		this.enabled = false;

		/** @private @type {Button} */
		this.button = null;
		/** @private @type {Button} */
		this.oldButton = null;
		/** @public @type {Button} */
		this.downButton = null;
		/** @private @type {Button} */
		this.lastOverButton = null;
		/** @private @type {Button[]} */
		this.activatedBtns = [];
		/** @private @type {number} */
		this.buttonTimer = null;
		/** @public @type {boolean} */
		this.mainMenuOpen = false;
		/** @public @type {boolean} */
		this.mouseInControl = false;
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Gets the enabled state of a button.
	 * @returns {boolean} True or false.
	 */
	get enable() {
		return this.enabled;
	}

	/**
	 * Sets the enabled state of a button and changes its state accordingly.
	 * @param {boolean} val - Whether the button should be enabled or disabled.
	 */
	set enable(val) {
		this.enabled = val;
		if (!val) {
			this.changeState(ButtonState.Default);
		} else {
			this.changeState(ButtonState.Enabled);
		}
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Handles button action events based on menu, panel and button type.
	 * @param {Button} btn - The instance of the button.
	 * @private
	 */
	_actionHandler(btn) {
		const buttons = {
			// * TOP MENU COMPACT * //
			Menu: () => this.topMenu(),

			// * TOP MENU MAIN - DEFAULT FOOBAR2000 * //
			File: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Edit: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			View: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Playback: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Library: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Help: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Playlists: () => grm.topMenu.topMenuPlaylists(btn.x, btn.y + btn.h),

			// * TOP MENU THEME BUTTONS * //
			Options: () => grm.topMenu.topMenuOptions(btn.x, btn.y + btn.h),
			Details: () => this.topDetails(),
			PlaylistArtworkLayout: () => this.topPlaylistArtwork(),
			library: () => this.topLibrary(),
			Biography: () => this.topBiography(),
			Lyrics: () => this.topLyrics(),
			Rating: () => this.topRating(btn.x, btn.y + btn.h),

			// * TOP MENU 🗕 🗖 ✖ CAPTION BUTTONS * //
			Minimize: () => fb.RunMainMenuCommand('View/Hide'),
			Maximize: () => this.topMaximize(),
			Close: () => fb.Exit(),

			// * LOWER BAR TRANSPORT BUTTONS * //
			Stop: () => { fb.Stop(); grm.ui.displayPanelControl(); },
			Previous: () => fb.Prev(),
			PlayPause: () => { fb.PlayOrPause(); grm.ui.displayPanelControl(); },
			Next: () => fb.Next(),
			PlaybackOrder: () => this.lowerPlaybackOrder(),
			Reload: () => window.Reload(),
			AddTracks: () => this.lowerAddTracks(),
			Volume: () => this.lowerVolume(),
			Mute: () => fb.VolumeMute(),
			PlaybackTime: () => this.lowerPlaybackTime(),

			// * PLAYLIST HISTORY BUTTONS * //
			Back: () => pl.history.buttons(btn),
			Forward: () => pl.history.buttons(btn)
		};

		const btnAction = buttons[btn.id];
		if (btnAction) btnAction();
	}

	/**
	 * Controls the alpha values of buttons during different states (hover, down) and repaints them accordingly.
	 * @private
	 */
	_alphaTimer() {
		const trace = false;
		const buttonHoverInStep = 40;
		const buttonHoverOutStep = 15;
		const buttonDownInStep = 100;
		const buttonDownOutStep = 50;
		const buttonTimerDelay = 25;

		if (!this.buttonTimer) {
			this.buttonTimer = setInterval(() => {
				for (const i in this.activatedBtns) {
					switch (this.activatedBtns[i].state) {
						case 0:
							this.activatedBtns[i].hoverAlpha = Math.max(0, this.activatedBtns[i].hoverAlpha -= buttonHoverOutStep);
							this.activatedBtns[i].downAlpha = Math.max(0, this.activatedBtns[i].downAlpha -= Math.max(0, buttonDownOutStep));
							this.activatedBtns[i].repaint();
							break;
						case 1:
							this.activatedBtns[i].hoverAlpha = Math.min(255, this.activatedBtns[i].hoverAlpha += buttonHoverInStep);
							this.activatedBtns[i].downAlpha = Math.max(0, this.activatedBtns[i].downAlpha -= buttonDownOutStep);
							this.activatedBtns[i].repaint();
							break;
						case 2:
							this.activatedBtns[i].downAlpha = Math.min(255, this.activatedBtns[i].downAlpha += buttonDownInStep);
							this.activatedBtns[i].hoverAlpha = Math.max(0, this.activatedBtns[i].hoverAlpha -= buttonDownInStep);
							this.activatedBtns[i].repaint();
							break;
					}
				}

				// Test button alpha values and turn button timer off when it's not required;
				for (let i = this.activatedBtns.length - 1; i >= 0; i--) {
					if ((!this.activatedBtns[i].hoverAlpha && !this.activatedBtns[i].downAlpha) ||
						this.activatedBtns[i].hoverAlpha === 255 || this.activatedBtns[i].downAlpha === 255) {
						this.activatedBtns.splice(i, 1);
					}
				}

				if (!this.activatedBtns.length) {
					clearInterval(this.buttonTimer);
					this.buttonTimer = null;
					trace && console.log('buttonTimerStarted = false');
				}
			}, buttonTimerDelay);

			trace && console.log('buttonTimerStarted = true');
		}
	}
	// #endregion

	// * PUBLIC METHODS - TOP MENU BUTTONS * //
	// #region PUBLIC METHODS - TOP MENU BUTTONS
	/**
	 * Collapses the top menu to compact mode or expands it to normal.
	 * @param {boolean} collapse - Wether the top menu should be collapsed or not.
	 */
	topMenu(collapse) {
		grSet.showTopMenuCompact = !grSet.showTopMenuCompact;
		if (collapse) {
			grSet.showTopMenuCompact = true;
		}
		grm.ui.createButtonImages();
		grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
		this.initButtonState();
		RepaintWindow();
	}

	/**
	 * Handles the Details panel button action in the top menu.
	 */
	topDetails() {
		grm.ui.displayPlaylist = !grm.ui.displayPlaylist;
		grm.ui.displayDetails = grSet.layout === 'artwork' ? grm.ui.displayPlaylist : !grm.ui.displayPlaylist;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = grSet.lyricsLayout === 'full' && grm.ui.displayLyrics || grSet.lyricsPanelState;

		if (grm.ui.displayPlaylist) {
			if (grSet.layout === 'artwork') {
				if (grSet.lyricsPanelState) grm.ui.displayLyrics = false;
				grm.ui.displayPlaylistArtwork = false;
				pl.playlist.x = grm.ui.ww; // Move hidden Playlist offscreen to disable Playlist mouse functions in Details
				grm.ui.resizeArtwork(true);
			} else {
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
			}
		}

		if (grm.ui.displayLibrary) {
			grm.ui.displayLibrary = false;
			if (grSet.layout === 'default') {
				grm.ui.displayPlaylist = grSet.libraryLayout === 'split' ? false : !grm.ui.displayPlaylist; // * Library Playlist split layout
				grm.ui.displayDetails = grSet.layout === 'artwork' ? grm.ui.displayPlaylist : !grm.ui.displayPlaylist;
			}
		}

		if (grSet.lyricsLayout === 'full' && grm.ui.displayLyrics) {
			if (grSet.lyricsPanelState) grSet.lyricsLayout = 'normal';
			if (!grSet.lyricsPanelState) grm.ui.displayLyrics = false;
			if (grSet.layout === 'default' && grm.ui.displayPlaylist) grm.ui.displayPlaylist = !grm.ui.displayPlaylist;
			if (!grm.ui.displayPlaylist) grm.ui.displayDetails = true;
		} else {
			grm.ui.restoreLyricsLayout();
		}

		grm.ui.resizeArtwork(false);
		if (grSet.panelWidthAuto) {
			grm.ui.initPanelWidthAuto();
		}
		if (grm.ui.displayCustomThemeMenu) {
			grm.ui.displayPanel(grm.ui.displayPlaylist ? 'playlist' : 'details');
			grm.cthMenu.reinitCustomThemeMenu();
		}
		grm.ui.setDiscArtRotationTimer();
		this.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the Playlist panel button action for artwork layout in the top menu.
	 */
	topPlaylistArtwork() {
		grm.ui.displayPlaylistArtwork = !grm.ui.displayPlaylistArtwork;
		grm.ui.displayPlaylist = false;
		grm.ui.displayDetails = false;
		grm.ui.displayLibrary = false;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = grSet.lyricsPanelState && !grm.ui.displayPlaylistArtwork;

		pl.call.on_size(grm.ui.ww, grm.ui.wh);
		grm.ui.resizeArtwork(false);
		this.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the Library panel button action in the top menu.
	 */
	topLibrary() {
		grm.ui.displayLibrary = !grm.ui.displayLibrary;
		grm.ui.displayDetails = false;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = grSet.lyricsPanelState;

		if (grm.ui.displayCustomThemeMenu) grm.cthMenu.reinitCustomThemeMenu();

		if (grm.ui.displayLibrary) {
			if (grSet.layout === 'default') {
				grm.ui.displayPlaylist = true;
				grm.ui.displayLyrics = grSet.libraryLayout === 'full' ? false : grSet.lyricsPanelState;
			}
			else if (grSet.layout === 'artwork') {
				grm.ui.displayPlaylistArtwork = false;
				grm.ui.displayLyrics = false;
				grm.ui.resizeArtwork(true);
			}
			if (grSet.panelWidthAuto) {
				grm.ui.initPanelWidthAuto();
				window.Repaint();
			}
		}

		if (grm.ui.displayPlaylist) {
			grm.ui.displayPlaylist = false;
		} else if (grSet.layout === 'default') {
			grm.ui.displayPlaylist = true;
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			grm.ui.restoreLyricsLayout();
		}

		// * Library Playlist split layout
		if (grm.ui.displayLibrarySplit()) {
			grm.ui.displayPlaylist = true;
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			grm.ui.setLibrarySize();
		} else if (grSet.layout === 'default' && grSet.libraryLayout === 'split') {
			grm.ui.displayPlaylist = true;
			grm.ui.initLibraryLayout();
		}

		if (grSet.layout === 'default' && grSet.libraryLayout !== 'split' &&
			grSet.libraryLayoutSplitPreset  || grSet.libraryLayoutSplitPreset2 ||
			grSet.libraryLayoutSplitPreset3 || grSet.libraryLayoutSplitPreset4) {
			plSet.auto_collapse = false;
			pl.playlist.header_expand();
		}

		// The Library's on_playback_new_track in gr-callbacks.js is only called when Library panel is active to improve performance.
		// Therefore, we need to call it now and update the Library's nowPlaying state when a new song is played from the active Playlist panel.
		lib.call.on_playback_new_track();
		grm.ui.resizeArtwork(false);
		this.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the Biography panel button action in the top menu.
	 */
	topBiography() {
		grm.ui.displayPlaylist = grSet.layout === 'default';
		grm.ui.displayDetails = false;
		grm.ui.displayLibrary = false;
		grm.ui.displayBiography = !grm.ui.displayBiography;
		grm.ui.displayLyrics = false;

		if (grm.ui.displayCustomThemeMenu) grm.cthMenu.reinitCustomThemeMenu();

		// Switch playlist to normal width to prevent panel overlaying
		grSet.playlistLayoutNormal = grSet.playlistLayout === 'full' && grm.ui.displayBiography;

		if (!grm.ui.displayBiography && grSet.lyricsPanelState) {
			grm.ui.displayLyrics = true;
			grm.ui.restoreLyricsLayout();
			// Switch playlist to normal width to prevent panel overlaying
			grSet.playlistLayoutNormal = grSet.playlistLayout === 'full' && grm.ui.displayLyrics;
		}

		if (grm.ui.displayBiography && (grSet.biographyLayout === 'full' || grSet.layout === 'artwork')) {
			grSet.layout === 'artwork' ? grm.ui.displayPlaylistArtwork = false : grm.ui.displayPlaylist = false;
		} else {
			if (grSet.panelWidthAuto) {
				grm.ui.initPanelWidthAuto();
			}
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
		}

		// The Biography's on_playback_new_track in gr-callbacks.js is only called when Biography panel is active to improve performance.
		// Therefore, we need to call it now and update the Biography's nowPlaying state when a new song is played from the active Playlist panel.
		bio.call.on_playback_new_track();
		grm.ui.resizeArtwork(false);
		this.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the Lyrics panel button action in the top menu.
	 */
	topLyrics() {
		grm.ui.displayPlaylist = grSet.layout === 'default';
		grm.ui.displayPlaylistArtwork = false;
		grm.ui.displayDetails = false;
		grm.ui.displayLibrary = false;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = !grm.ui.displayLyrics;

		if (grm.ui.displayCustomThemeMenu) grm.cthMenu.reinitCustomThemeMenu();

		// Switch playlist to normal width to prevent panel overlaying
		grSet.playlistLayoutNormal = grSet.playlistLayout === 'full' && grm.ui.displayLyrics;
		// Save lyric active state
		grSet.lyricsPanelState = grm.ui.displayLyrics && grSet.lyricsRememberPanelState;

		if (grSet.lyricsLayout === 'full' && grm.ui.displayLyrics) {
			grm.ui.displayPlaylist = false;
			grm.ui.resizeArtwork(true);
		} else {
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
		}

		if (grSet.panelWidthAuto) {
			grm.ui.initPanelWidthAuto();
		}

		grm.lyrics.initLyrics();
		grm.ui.resizeArtwork(grSet.layout === 'artwork');
		this.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the Rating button action in the top menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	topRating(x, y) {
		const handle = new FbMetadbHandleList();
		const metadb = fb.GetFocusItem();
		if (!metadb) {
			fb.ShowPopupMessage('No track selected, it seems like the playlist is empty.', 'Empty playlist');
			return;
		}
		const fileInfo = metadb.GetFileInfo();
		const ratingMetaIdx = fileInfo.MetaFind('RATING');
		const ratingMeta = ratingMetaIdx === -1 ? 0 : fileInfo.MetaValue(ratingMetaIdx, 0);
		const ratingTags = plSet.use_rating_from_tags;
		const rating = ratingTags ? ratingMeta : $('$if2(%rating%,0)', metadb);
		const selectedItems = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		const menu = new Menu();
		grm.ui.activeMenu = true;

		menu.addRadioItems(['No rating', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'], parseInt(rating), [0, 1, 2, 3, 4, 5], (rating) => {
			pl.album_ratings.clear();

			for (let i = 0; i < selectedItems.Count; i++) {
				const metadb = selectedItems[i];
				const noStream = !metadb.RawPath.startsWith('http');

				if (rating === 0) {
					if (ratingTags && noStream) {
						handle.Add(metadb);
						handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: '' }));
					} else {
						fb.RunContextCommandWithMetadb('Playback Statistics/Rating/<not set>', metadb);
					}
				}
				else if (ratingTags && noStream) {
					handle.Add(metadb);
					handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: rating }));
				}
				else {
					fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${rating}`, metadb);
				}

				const trackId = $('%rating%', metadb);
				pl.track_ratings.set(trackId, rating);
			}
		});

		const idx = menu.trackPopupMenu(x, y);
		menu.doCallback(idx);
		grm.ui.activeMenu = false;
	}

	/**
	 * Handles the maximize button action in the top menu, player goes into fullscreen and resumes player size.
	 */
	topMaximize() {
		if (grSet.fullscreenMaximize) { // F11 shortcut ( on_key_down() ) for going into/out fullscreen mode, disabled/not supported in Artwork layout, ESC also exits fullscreen mode
			UIHacks.FullScreen = !UIHacks.FullScreen;
		} else {
			UIHacks.MainWindowState = UIHacks.MainWindowState === WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
		}
	}
	// #endregion

	// * PUBLIC METHODS - LOWER BAR BUTTONS * //
	// #region PUBLIC METHODS - LOWER BAR BUTTONS
	/**
	 * Handles the play button action in the lower bar, toggles between playback play or pause state.
	 */
	lowerPlayPause() {
		const showTransportControls = grSet[`showTransportControls_${grSet.layout}`];
		if (!showTransportControls) return;
		grm.ui.btn.play.img = !fb.IsPlaying || fb.IsPaused ? grm.ui.btnImg.Play : grm.ui.btnImg.Pause;
		grm.ui.btn.play.repaint();
	}

	/**
	 * Handles the playback order button action in the lower bar, toggles the current playback order.
	 */
	lowerPlaybackOrder() {
		const showTransportControls = grSet[`showTransportControls_${grSet.layout}`];
		if (!showTransportControls) return;

		switch (plman.PlaybackOrder) {
			case PlaybackOrder.Default:
				this.setPlaybackOrder(grm.ui.btnImg.PlaybackRepeatPlaylist, 'repeatPlaylist', PlaybackOrder.RepeatPlaylist, 'Repeat (playlist)');
				break;

			case PlaybackOrder.RepeatPlaylist:
				this.setPlaybackOrder(grm.ui.btnImg.PlaybackRepeatTrack, 'repeatTrack', PlaybackOrder.RepeatTrack, 'Repeat (track)');
				break;
			case PlaybackOrder.RepeatTrack:
				this.setPlaybackOrder(grm.ui.btnImg.PlaybackShuffle, 'shuffle', PlaybackOrder.ShuffleTracks, 'Shuffle (tracks)');
				break;

			case PlaybackOrder.Random:
			case PlaybackOrder.ShuffleTracks:
			case PlaybackOrder.ShuffleAlbums:
			case PlaybackOrder.ShuffleFolders:
				this.setPlaybackOrder(grm.ui.btnImg.PlaybackDefault, 'default', PlaybackOrder.Default, 'Default');
				break;
		}

		grm.ui.btn.playbackOrder.repaint();
	}

	/**
	 * Handles the AddTracks button action in the lower bar.
	 */
	lowerAddTracks() {
		const addTracks = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		const addTrackPl = plman.FindOrCreatePlaylist(`${grCfg.themeControls.addTracksPlaylist}`, true);

		if (grm.ui.displayPlaylist) {
			plman.SetPlaylistSelection(pl.playlist.cur_playlist_idx, pl.playlist.selection_handler.selected_indexes, true);
			plman.InsertPlaylistItems(addTrackPl, plman.PlaylistItemCount(addTrackPl) || 0, addTracks);
		}
		else if (grm.ui.displayLibrary) {
			plman.ActivePlaylist = addTrackPl;
			lib.pop.load(lib.pop.sel_items, true, true, false, false, false);
			lib.lib.treeState(false, libSet.rememberTree);
			if (grSet.addTracksPlaylistSwitch) {
				grm.ui.btn.library.enabled = false;
				grm.ui.btn.library.changeState(ButtonState.Default);
				grm.ui.displayLibrary = false;
				grm.ui.displayPlaylist = true;
				if (!grSet.playlistAutoScrollNowPlaying) pl.call.on_size(grm.ui.ww, grm.ui.wh);
			}
		}

		if (grSet.addTracksPlaylistSwitch) {
			plman.ActivePlaylist = addTrackPl;
			setTimeout(() => {
				if (pl.playlist.is_scrollbar_available) {
					pl.playlist.scrollbar.scroll_to_end();
				}
			}, 500);
		}
		window.Repaint();
	}

	/**
	 * Handles the volume button action in the lower bar, toggles the volume bar.
	 */
	lowerVolume() {
		if (grSet.autoHideVolumeBar) {
			grm.volBtn.toggleVolumeBar();
		} else {
			fb.VolumeMute();
		}
	}

	/**
	 * Handles the playback time button action in the lower bar, toggles the playback time to remaining or normal.
	 */
	lowerPlaybackTime() {
		grSet.switchPlaybackTime = !grSet.switchPlaybackTime;
		on_playback_time();
	}

	/**
	 * Handles the lower bar playback transport button tooltips.
	 * @param {string} btn - The playback transport button.
	 * @returns {string} The tooltip text for the given button.
	 */
	lowerTransportTooltip(btn) {
		const pbModeTooltipText =
			(fb.StopAfterCurrent ? 'Stop after current\n' : '') +
			(fb.PlaybackFollowCursor ? 'Playback follows cursor\n' : '') +
			(fb.CursorFollowPlayback ? 'Cursor follows playback\n' : '');

		const pboTooltipText =
			plman.PlaybackOrder === PlaybackOrder.Default ? 'Default' :
			plman.PlaybackOrder === PlaybackOrder.RepeatPlaylist ? 'Repeat (playlist)' :
			plman.PlaybackOrder === PlaybackOrder.RepeatTrack ? 'Repeat (track)' :
			plman.PlaybackOrder === PlaybackOrder.ShuffleTracks ? 'Shuffle (tracks)' : '';

		const volumeTooltipText = `${fb.Volume.toFixed(2)} dB`;

		switch (btn) {
			case 'stop':      return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nStop` : 'Stop';
			case 'prev':      return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nPrevious` : 'Previous';
			case 'play':      return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nPlay` : 'Play';
			case 'next':      return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nNext` : 'Next';
			case 'pbo':       return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nPlayback order: ${pboTooltipText}` : `Playback order: ${pboTooltipText}`;
			case 'reload':    return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nReload` : 'Reload';
			case 'addTracks': return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\nAdd tracks to playlist` : 'Add tracks to playlist';
			case 'volume':    return pbModeTooltipText.length > 0 ? `Active playback modes:\n${pbModeTooltipText}\n${volumeTooltipText}` : volumeTooltipText;
		}
	}
	// #endregion

	// * PUBLIC METHODS - GENERAL * //
	// #region PUBLIC METHODS - GENERAL
	/**
	 * Initializes the top menu button state.
	 */
	initButtonState() {
		const buttons = [grm.ui.btn.details, grm.ui.btn.library, grm.ui.btn.biography, grm.ui.btn.lyrics, grm.ui.btn.playlistArtworkLayout];
		for (const button of buttons) this.setButtonState(false, button);

		if (grSet.layout === 'default' && !grm.ui.displayPlaylist && !grm.ui.displayLibrary && !grm.ui.displayBiography && (!grm.ui.displayLyrics || grm.ui.displayLyrics && grSet.lyricsLayout === 'normal')) {
			this.setButtonState(grm.ui.btn.details);
		}
		else if (grSet.layout === 'artwork' && (grm.ui.displayPlaylist || grm.ui.displayPlaylistArtwork) && !grm.ui.displayLibrary && !grm.ui.displayBiography && !grm.ui.displayLyrics) {
			if (grm.ui.displayPlaylist) {
				this.setButtonState(grm.ui.btn.details);
			} else if (grm.ui.displayPlaylistArtwork) {
				grm.ui.displayPlaylist = false;
				this.setButtonState(grm.ui.btn.playlistArtworkLayout);
			}
		}
		else if (grm.ui.displayLibrary && (!grm.ui.displayPlaylist || grm.ui.displayLibrarySplit())) {
			this.setButtonState(grm.ui.btn.library);
		}
		else if (grm.ui.displayBiography) {
			this.setButtonState(grm.ui.btn.biography);
		}
		if (grm.ui.displayLyrics) {
			this.setButtonState(grm.ui.btn.lyrics);
		}
	}

	/**
	 * Updates the state of the button.
	 * @param {number} state - The new state to set for the button.
	 * @private
	 */
	changeState(state) {
		this.state = state;
		this.activatedBtns.push(this);
		this._alphaTimer();
	}

	/**
	 * Sets the button state based on passed args.
	 * @param {Button} activeButton - The button to activate.
	 * @param {Button} deactivateButton - The button to deactivate.
	 */
	setButtonState(activeButton, deactivateButton) {
		if (activeButton) {
			activeButton.enabled = true;
			activeButton.changeState(ButtonState.Down);
		}
		if (deactivateButton) {
			deactivateButton.enabled = false;
			deactivateButton.changeState(ButtonState.Default);
		}
	}

	/**
	 * Sets the button image, playback order preference, and foobar2000 playback order.
	 * @param {GdiBitmap} imgValue - The value of grMain.ui.btnImg.PlaybackDefault, grMain.ui.btnImg.PlaybackRepeatTrack, or grMain.ui.btnImg.PlaybackShuffle.
	 * @param {string} prefValue - The value of 'default', 'repeatPlaylist', 'repeatTrack', or 'shuffle'.
	 * @param {string} fbValue - The value of PlaybackOrder.Default, PlaybackOrder.RepeatPlaylist, PlaybackOrder.RepeatTrack, or PlaybackOrder.ShuffleTracks.
	 * @param {string} cmd - The value of top menu Playback > Order.
	 */
	setPlaybackOrder(imgValue, prefValue, fbValue, cmd) {
		grm.ui.btn.playbackOrder.img = imgValue;
		grSet.playbackOrder = prefValue;
		fb.PlaybackOrder = fbValue;
		fb.RunMainMenuCommand(`Playback/Order/${cmd}`);
	}

	/**
	 * Passes in the current button as an argument via the btnActionHandler.
	 */
	onClick() {
		this._actionHandler(this);
	}

	/**
	 * Currently does not have any functionality.
	 */
	onDblClick() {
		// We don't do anything with dblClick currently
	}

	/**
	 * Repaints the button to update its state.
	 */
	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Checks if the mouse is within the boundaries of a button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}

	/**
	 * Handles mouse double click events on a button and changes its state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_dblclk(x, y, m) {
		if (!this.button) return;
		this.button.changeState(ButtonState.Down);
		this.downButton = this.button;
		this.downButton.onDblClick();
	}

	/**
	 * Handles left mouse click down events on a button and changes its state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_down(x, y, m) {
		if (!this.button) return;
		this.button.changeState(ButtonState.Down);
		this.downButton = this.button;
	}

	/**
	 * Handles left mouse click up events on a button and changes its state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (!this.downButton) return;

		this.downButton.onClick();

		if (this.mainMenuOpen) {
			this.button = undefined;
			this.mainMenuOpen = false;
		}

		if (this.button) {
			this.button.changeState(ButtonState.Hovered);
		}
		else if (this.downButton && this.downButton === this.button) {
			this.downButton.changeState(ButtonState.Default);
		}

		this.button = this.downButton;
	}

	/**
	 * Handles mouse leave events on a button and changes its state to default.
	 */
	on_mouse_leave() {
		this.oldButton = undefined;

		if (this.downButton) return;

		for (const i in grm.ui.btn) {
			if (grm.ui.btn[i].state !== 0) {
				grm.ui.btn[i].changeState(ButtonState.Default);
			}
		}
	}

	/**
	 * Handles mouse move tracking events on a button and changes its state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		this.oldButton = this.button;

		for (const i in grm.ui.btn) {
			if (typeof grm.ui.btn[i] === 'object' && grm.ui.btn[i].mouseInThis(x, y)) {
				this.mouseInControl = true;
				this.button = grm.ui.btn[i];
				break;
			} else {
				this.mouseInControl = false;
				this.button = null;
			}
		}

		if (this.oldButton && this.oldButton !== this.button) {
			this.oldButton.changeState(this.oldButton.enabled ? ButtonState.Enabled : ButtonState.Default);
		}
		if (this.button && this.button !== this.oldButton) {
			this.button.changeState(ButtonState.Hovered);
		}
		this.downButton = this.button;

		if (this.lastOverButton !== this.button) {
			grm.ttip.stop();
		}
		this.lastOverButton = this.button;

		if (grSet.showTooltipMain && this.lastOverButton) {
			if (this.lastOverButton.tooltip) {
				grm.ttip.showDelayed(this.lastOverButton.tooltip);
			}
			else if (this.lastOverButton.id === 'Volume' && !grm.volBtn.show_volume_bar) {
				grm.ttip.showDelayed(this.lowerTransportTooltip('volume'));
			}
			else if (this.lastOverButton.id === 'PlaybackOrder') {
				grm.ttip.showDelayed(this.lowerTransportTooltip('pbo'));
			}
		}
	}
	// #endregion
}
