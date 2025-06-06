/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Button Control                           * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    06-06-2025                                              * //
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
		/** @public @type {number} The x-coordinate of the button. */
		this.x = x;
		/** @public @type {number} The y-coordinate of the button. */
		this.y = y;
		/** @public @type {number} The width of the button. */
		this.w = w;
		/** * @public @type {number} The height of the button. */
		this.h = h;
		/** * @public @type {number} The ID of the button. */
		this.id = id;
		/** @public @type {GdiBitmap[]} The images for the button. */
		this.img = img;
		/** @public @type {string} The tooltip text for the button. */
		this.tooltip = tip || '';

		/** @public @type {number} The state of the button. */
		this.state = 0;
		/** @public @type {number} The alpha value of the button when hovered. */
		this.hoverAlpha = 0;
		/** @public @type {number} The alpha value of the button when pressed. */
		this.downAlpha = 0;
		/** @public @type {boolean} The check state when the button is enabled. */
		this.isEnabled = isEnabled;
		/** @public @type {boolean} The enabled state of the button. */
		this.enabled = false;

		/** @private @type {Button} The currently active button. */
		this.activeButton = null;
		/** @private @type {Button} The previously active button. */
		this.oldButton = null;
		/** @public @type {Button} The button currently being pressed down. */
		this.downButton = null;
		/** @private @type {Button} The last button that was hovered over. */
		this.lastOverButton = null;
		/** @private @type {Button[]} The buttons that have been activated. */
		this.activatedBtns = [];
		/** @private @type {number} The timer for button state changes. */
		this.buttonTimer = null;
		/** @public @type {boolean} The state whether the main menu is open. */
		this.mainMenuOpen = false;
		/** @public @type {boolean} The state whether the mouse is in control area. */
		this.mouseInControl = false;
		/** @public @type {boolean} The state whether the lower artist button was clicked. */
		this.lowerArtistBtnClicked = false;

		/** @public @type {object} The button map stores the collection of all buttons. */
		this.btnMap = {};
		/** @public @type {object} The button object containing all button information. */
		this.btn = {};
		/** @public @type {GdiGraphics} The button images containing all button states. */
		this.btnImg = {};
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
			Media: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Help: () => grm.topMenu.topMenuMain(btn.x, btn.y + btn.h, btn.id),
			Playlists: () => grm.topMenu.topMenuPlaylists(btn.x, btn.y + btn.h),

			// * TOP MENU THEME BUTTONS * //
			Options: () => grm.topMenu.topMenuOptions(btn.x, btn.y + btn.h),
			Details: () => this.topDetails(),
			Playlist: () => this.topPlaylistArtwork(),
			Library: () => this.topLibrary(),
			Biography: () => this.topBiography(),
			Lyrics: () => this.topLyrics(),
			Rating: () => this.topRating(btn.x, btn.y + btn.h),

			// * TOP MENU 🗕 🗖 ✖ CAPTION BUTTONS * //
			Minimize: () => fb.RunMainMenuCommand('View/Hide'),
			Maximize: () => this.topMaximize(),
			Close: () => fb.Exit(),

			// * LOWER BAR TRANSPORT BUTTONS * //
			Stop: () => fb.Stop(),
			Previous: () => fb.Prev(),
			PlayPause: () => fb.PlayOrPause(),
			Next: () => fb.Next(),
			PlaybackOrder: () => this.lowerPlaybackOrder(),
			Reload: () => window.Reload(),
			AddTracks: () => this.lowerAddTracks(),
			Volume: () => this.lowerVolume(),
			Mute: () => fb.VolumeMute(),
			ArtistBtn: () => this.lowerArtistBtnAction(),
			TitleBtn: () => this.lowerTitleBtnAction(),
			PlaybackTime: () => this.lowerPlaybackTime(),

			// * PLAYLIST HISTORY BUTTONS * //
			Back: () => pl.history.buttons(btn),
			Forward: () => pl.history.buttons(btn),

			// * LYRICS INFO OVERLAY BUTTON * //
			LyricsInfoOverlay:() => this.lyricsFullLayoutBtnAction()
		};

		const btnAction = buttons[btn.id];
		if (btnAction) btnAction();
	}

	/**
	 * Controls the alpha values of buttons during different states (hover, down) and repaints them accordingly.
	 * @private
	 */
	_alphaTimer() {
		const buttonHoverInStep = 40;
		const buttonHoverOutStep = 15;
		const buttonDownInStep = 100;
		const buttonDownOutStep = 50;
		const buttonTimerDelay = 25;

		const actions = {
			0: (btn) => {
				btn.hoverAlpha = Math.max(0, btn.hoverAlpha - buttonHoverOutStep);
				btn.downAlpha  = Math.max(0, btn.downAlpha - buttonDownOutStep);
			},
			1: (btn) => {
				btn.hoverAlpha = Math.min(255, btn.hoverAlpha + buttonHoverInStep);
				btn.downAlpha  = Math.max(0, btn.downAlpha - buttonDownOutStep);
			},
			2: (btn) => {
				btn.downAlpha  = Math.min(255, btn.downAlpha + buttonDownInStep);
				btn.hoverAlpha = Math.max(0, btn.hoverAlpha - buttonDownInStep);
			}
		};

		if (!this.buttonTimer) {
			this.buttonTimer = setInterval(() => {
				for (let i = this.activatedBtns.length - 1; i >= 0; i--) {
					const btn = this.activatedBtns[i];
					if (actions[btn.state]) {
						actions[btn.state](btn);
						btn.repaint();
					}

					// * Test button alpha values and turn off the button timer if not required;
					if ((!btn.hoverAlpha && !btn.downAlpha) || btn.hoverAlpha === 255 || btn.downAlpha === 255) {
						this.activatedBtns.splice(i, 1);
					}
				}

				if (this.activatedBtns.length === 0) {
					clearInterval(this.buttonTimer);
					this.buttonTimer = null;
				}
			}, buttonTimerDelay);
		}
	}

	/**
	 * Updates the panel after button logic has been processed.
	 * @param {boolean} initLyrics - Whether to initialize the lyrics.
	 * @private
	 */
	_updatePanelState(initLyrics) {
		grm.ui.resizeArtwork(false);
		grm.ui.initPanelWidthAuto();
		if (grm.ui.displayCustomThemeMenu) grm.cthMenu.reinitCustomThemeMenu();
		if (grm.ui.displayDetails) grm.details.setDiscArtRotationTimer();
		if (grSet.savedLyricsDisplayed || initLyrics) grm.lyrics.initLyrics();
		this.initButtonState();
		window.Repaint();
	}
	// #endregion

	// * PUBLIC METHODS - TOP MENU BUTTONS * //
	// #region PUBLIC METHODS - TOP MENU BUTTONS
	/**
	 * Collapses the top menu to compact mode or expands it to normal.
	 * @param {boolean} collapse - Whether the top menu should be collapsed or not.
	 */
	topMenu(collapse) {
		grSet.showTopMenuCompact = collapse || !grSet.showTopMenuCompact;
		this.createButtons(grm.ui.ww, grm.ui.wh, false);
		this.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the Details panel button action in the top menu.
	 */
	topDetails() {
		const biographyLayoutFull = grm.ui.displayBiography && grSet.biographyLayout === 'full';
		const lyricsLayoutFull = grm.ui.displayLyrics && grSet.lyricsLayout !== 'normal';
		const playlistNeedsToggle = grSet.layout === 'default' && (grm.ui.displayLibrary || biographyLayoutFull || lyricsLayoutFull);

		grm.ui.displayPlaylist = playlistNeedsToggle ? false : !grm.ui.displayPlaylist;
		grm.ui.displayPlaylistArtwork = false;
		grm.ui.displayDetails = lyricsLayoutFull ? true : grSet.layout === 'artwork' ? grm.ui.displayPlaylist : !grm.ui.displayPlaylist;
		grm.ui.displayLibrary = false;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = grSet.savedLyricsDisplayed || lyricsLayoutFull;
		grm.ui.displayMetadataGridMenu = grm.ui.displayDetails && grm.ui.displayMetadataGridMenu;

		if (grm.ui.displayPlaylist) {
			if (grSet.layout === 'artwork') { // Details panel in Artwork layout
				grm.ui.displayLyrics = false;
				pl.playlist.x = grm.ui.ww; // Move hidden Playlist offscreen to disable Playlist mouse functions in Details
				grm.ui.resizeArtwork(true);
			} else {
				grm.ui.setPlaylistSize();
			}
		}

		grm.ui.handlePanelLayout('lyrics', 'initLayout');
		this._updatePanelState();
	}

	/**
	 * Handles the Playlist panel button action for Artwork layout in the top menu.
	 */
	topPlaylistArtwork() {
		grm.ui.displayPlaylistArtwork = !grm.ui.displayPlaylistArtwork;
		grm.ui.displayPlaylist = false;
		grm.ui.displayDetails = false;
		grm.ui.displayLibrary = false;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = grSet.savedLyricsDisplayed && !grm.ui.displayPlaylistArtwork;
		grm.ui.displayMetadataGridMenu = false;

		if (grm.ui.displayPlaylistArtwork) {
			grm.ui.setPlaylistSize();
		}

		this._updatePanelState();
	}

	/**
	 * Handles the Library panel button action in the top menu.
	 */
	topLibrary() {
		grm.ui.displayLibrary = !grm.ui.displayLibrary;
		grm.ui.displayPlaylist = grSet.layout === 'default' && !grm.ui.displayLibrary;
		grm.ui.displayPlaylistArtwork = false;
		grm.ui.displayDetails = false;
		grm.ui.displayBiography = false;
		grm.ui.displayLyrics = grSet.savedLyricsDisplayed;
		grm.ui.displayMetadataGridMenu = false;

		if (grm.ui.displayLibrary) {
			grm.ui.displayLyrics = grSet.savedLyricsDisplayed && grSet.layout === 'default' && grSet.libraryLayout === 'normal';
		}
		else if (grm.ui.displayPlaylist) {
			grm.ui.setPlaylistSize();
		}

		// The Library's on_playback_new_track in gr-callbacks.js is only called when Library panel is active to improve performance.
		// Therefore, we need to call it now and update the Library's nowPlaying state when a new song is played from the active Playlist panel.
		lib.call.on_playback_new_track();
		grm.ui.handlePanelLayout('all', 'initLayout');
		this._updatePanelState();
	}

	/**
	 * Handles the Biography panel button action in the top menu.
	 */
	topBiography() {
		grm.ui.displayBiography = !grm.ui.displayBiography;

		const biographyFull = grm.ui.displayBiography && bio.ui.x + bio.ui.w === grm.ui.ww && !fb.IsPlaying || grSet.biographyLayout === 'full';
		grm.ui.displayPlaylist = grSet.layout === 'default' && (biographyFull ? !grm.ui.displayBiography : true);

		grm.ui.displayPlaylistArtwork = false
		grm.ui.displayDetails = false;
		grm.ui.displayLibrary = false;
		grm.ui.displayLyrics = grSet.savedLyricsDisplayed && !grm.ui.displayBiography;
		grm.ui.displayMetadataGridMenu = false;

		if (grm.ui.displayPlaylist) {
			grm.ui.setPlaylistSize();
		}

		// The Biography's on_playback_new_track in gr-callbacks.js is only called when Biography panel is active to improve performance.
		// Therefore, we need to call it now and update the Biography's nowPlaying state when a new song is played from the active Playlist panel.
		bio.call.on_playback_new_track();
		grm.ui.handlePanelLayout('all', 'initLayout');
		this._updatePanelState();
	}

	/**
	 * Handles the Lyrics panel button action in the top menu.
	 */
	topLyrics() {
		grm.ui.displayLyrics = !grm.ui.displayLyrics;
		grm.ui.displayPlaylist = grSet.layout === 'default';
		grm.ui.displayPlaylistArtwork = false;
		grm.ui.displayDetails = false;
		grm.ui.displayLibrary = false;
		grm.ui.displayBiography = false;
		grm.ui.displayMetadataGridMenu = false;

		// Save lyrics active state
		grSet.savedLyricsDisplayed = grm.ui.displayLyrics && grSet.lyricsRememberPanelState;

		if (grSet.savedLyricsLayoutFull && grSet.lyricsRememberPanelState) {
			grm.ui.displayLyrics = grSet.savedLyricsDisplayed;
		} else {
			grm.ui.setPlaylistSize();
		}

		grm.ui.handlePanelLayout('all', 'initLayout');
		this._updatePanelState(true);
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
			const msg = grm.msg.getMessage('main', 'playlistEmptyError');
			fb.ShowPopupMessage(msg, 'Empty playlist');
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
			pl.artist_ratings.clear();
			pl.album_ratings.clear();
			pl.track_ratings.clear();
			grm.ui.clearCache('ratings');

			for (let i = 0; i < selectedItems.Count; i++) {
				const metadb = selectedItems[i];
				const noStream = !metadb.RawPath.startsWith('http');
				let ratingUpdated = rating;

				if (rating === 0) {
					if (ratingTags && noStream) {
						handle.Add(metadb);
						handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: '' }));
					} else {
						fb.RunContextCommandWithMetadb('Playback Statistics/Rating/<not set>', metadb);
					}
					ratingUpdated = 0;
				}
				else if (ratingTags && noStream) {
					handle.Add(metadb);
					handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: rating }));
				}
				else {
					fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${rating}`, metadb);
				}

				const trackId = $('%artist% - %album% - %title%', metadb) || metadb.RawPath;
				pl.track_ratings.set(trackId, ratingUpdated);
			}
		});

		const idx = menu.trackPopupMenu(x, y);
		menu.doCallback(idx);
		grm.ui.activeMenu = false;
		pl.playlist.update_playlist_headers();
	}

	/**
	 * Handles the maximize button action in the top menu, player goes into fullscreen and resumes player size.
	 */
	topMaximize() {
		grm.display.handleWindowControl('button');
	}
	// #endregion

	/**
	 * Handles the action of the lyrics full layout button.
	 * If the mouse is in the right edge of the full lyrics layout, it will toggle play or pause.
	 */
	lyricsFullLayoutBtnAction() {
		if (grm.ui.mouseInLyricsFullLayoutEdge) {
			fb.PlayOrPause();
		}
	}

	// * PUBLIC METHODS - LOWER BAR BUTTONS * //
	// #region PUBLIC METHODS - LOWER BAR BUTTONS
	/**
	 * Handles the play button action in the lower bar, toggles between playback play or pause state.
	 */
	lowerPlayPause() {
		if (!this.btn.play || !grSet.showTransportControls_layout) return;
		this.btn.play.img = !fb.IsPlaying || fb.IsPaused ? this.btnImg.Play : this.btnImg.Pause;
		this.btn.play.repaint();
	}

	/**
	 * Handles the playback order button action in the lower bar, toggles the current playback order.
	 */
	lowerPlaybackOrder() {
		if (!grSet.showTransportControls_layout) return;

		switch (plman.PlaybackOrder) {
			case PlaybackOrder.Default:
				this.setPlaybackOrder(this.btnImg.PlaybackRepeatPlaylist, 'repeatPlaylist', PlaybackOrder.RepeatPlaylist, 'Repeat (playlist)');
				break;

			case PlaybackOrder.RepeatPlaylist:
				this.setPlaybackOrder(this.btnImg.PlaybackRepeatTrack, 'repeatTrack', PlaybackOrder.RepeatTrack, 'Repeat (track)');
				break;
			case PlaybackOrder.RepeatTrack:
				this.setPlaybackOrder(this.btnImg.PlaybackShuffle, 'shuffle', PlaybackOrder.ShuffleTracks, 'Shuffle (tracks)');
				break;

			case PlaybackOrder.Random:
			case PlaybackOrder.ShuffleTracks:
			case PlaybackOrder.ShuffleAlbums:
			case PlaybackOrder.ShuffleFolders:
				this.setPlaybackOrder(this.btnImg.PlaybackDefault, 'default', PlaybackOrder.Default, 'Default');
				break;
		}

		this.btn.playbackOrder.repaint();
	}

	/**
	 * Handles the AddTracks button action in the lower bar.
	 */
	lowerAddTracks() {
		const addNowPlaying = () => new FbMetadbHandleList([fb.GetNowPlaying()]);
		const addTracks = grSet.addTracksButtonAction === 'nowplaying' ? addNowPlaying() : plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		const addTrackPl = plman.FindOrCreatePlaylist(`${grCfg.themeControls.addTracksPlaylist}`, true);
		const initialActivePlaylist = plman.ActivePlaylist;

		if (grm.ui.displayPlaylist) {
			plman.SetPlaylistSelection(pl.playlist.cur_playlist_idx, pl.playlist.selection_handler.selected_indexes, true);
			plman.InsertPlaylistItems(addTrackPl, plman.PlaylistItemCount(addTrackPl) || 0, addTracks);
		}
		else if (grm.ui.displayLibrary) {
			plman.ActivePlaylist = addTrackPl;
			const libItems = grSet.addTracksButtonAction === 'nowplaying' ? addNowPlaying() : lib.pop.sel_items;
			lib.pop.load(libItems, grSet.addTracksButtonAction === 'selection', true, false, false, false);
			lib.lib.treeState(false, libSet.rememberTree);
			if (grSet.addTracksPlaylistSwitch) {
				this.btn.library.enabled = false;
				this.btn.library.changeState(ButtonState.Default);
				grm.ui.displayLibrary = false;
				grm.ui.displayPlaylist = true;
				if (!grSet.playlistAutoScrollNowPlaying) grm.ui.setPlaylistSize();
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
		else {
			plman.ActivePlaylist = initialActivePlaylist;
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
	 * Handles the artist button click action in the lower bar.
	 */
	lowerArtistBtnAction() {
		if (!grStr.artist) return;
		this.lowerArtistBtnClicked = true;
		grm.ui.displayPanel('playlist', true);

		if (grSet.lowerBarArtistBtnAction === 'website') {
			grm.utils.openWebsite(grSet.lowerBarArtistBtnWebsite, grm.ui.initMetadb());
			return;
		}

		const artist = $('%artist%', grm.ui.initMetadb());
		const plName = 'Artist Discography';
		let plArtist = plman.FindPlaylist(plName);

		if (plArtist === -1) {
			plArtist = plman.CreatePlaylist(plman.PlaylistCount, plName);
		} else {
			plman.RemovePlaylist(plArtist);
			plArtist = plman.CreatePlaylist(plArtist, plName);
		}

		const query = `Artist HAS "${artist.replace(/"/g, '')}" OR Album Artist HAS "${artist.replace(/"/g, '')}" OR ARTISTFILTER HAS "${artist.replace(/"/g, '')}"`;
		const tracks = fb.GetQueryItems(fb.GetLibraryItems(), query);
		plman.InsertPlaylistItems(plArtist, 0, tracks);

		setTimeout(() => {
			plman.ActivePlaylist = plArtist;
			on_playlist_switch();
			this.lowerArtistBtnClicked = false;
		}, 250);
	}

	/**
	 * Handles the track title button click action in the lower bar.
	 */
	lowerTitleBtnAction() {
		if (!fb.IsPlaying) return;
		if (grm.ui.displayLibrary) {
			lib.pop.nowPlayingShow();
		} else {
			grm.ui.displayPanel('playlist', true);
			pl.playlist.show_now_playing();
		}
	}

	/**
	 * Handles the playback time button action in the lower bar, toggles the playback time to remaining or normal.
	 */
	lowerPlaybackTime() {
		if (!fb.IsPlaying) return;
		grm.ui.clearCache('metrics', 'cachedLowerBarMetrics');

		if (!grSet.playbackTimeDisplay) {
			grSet.playbackTimeDisplay = 'default';
		} else if (grSet.playbackTimeDisplay === 'default') {
			grSet.playbackTimeDisplay = 'remaining';
		} else if (grSet.playbackTimeDisplay === 'remaining') {
			grSet.playbackTimeDisplay = 'percent';
		} else {
			grSet.playbackTimeDisplay = 'default';
		}

		on_playback_time();
	}

	/**
	 * Handles the lower bar playback transport button tooltips.
	 * @param {string} btn - The playback transport button.
	 * @returns {string} The tooltip text for the given button.
	 */
	lowerTransportTooltip(btn) {
		const playbackMode = [
			fb.StopAfterCurrent && 'Stop after current',
			fb.PlaybackFollowCursor && 'Playback follows cursor',
			fb.CursorFollowPlayback && 'Cursor follows playback'
		].filter(Boolean).join('\n');

		const playbackOrderText = {
			[PlaybackOrder.Default]: 'Default',
			[PlaybackOrder.RepeatPlaylist]: 'Repeat (playlist)',
			[PlaybackOrder.RepeatTrack]: 'Repeat (track)',
			[PlaybackOrder.Random]: 'Random',
			[PlaybackOrder.ShuffleTracks]: 'Shuffle (tracks)',
			[PlaybackOrder.ShuffleAlbums]: 'Shuffle (albums)',
			[PlaybackOrder.ShuffleFolders]: 'Shuffle (folders)'
		};

		const tooltip = {
			stop: 'Stop',
			prev: 'Previous',
			play: 'Play',
			next: 'Next',
			pbo: `Playback order: ${playbackOrderText[plman.PlaybackOrder]}`,
			reload: 'Reload',
			addTracks: 'Add tracks to playlist',
			volume: `${fb.Volume.toFixed(2)} dB`
		};

		return playbackMode.length > 0 ? `Active playback modes:\n${playbackMode}\n${tooltip[btn]}` : tooltip[btn];
	}
	// #endregion

	// * PRIVATE METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Creates the button map for all buttons with its configurations for the UI.
	 * @returns {object} A map of button names to their configuration, including icon, font, type, and dimensions.
	 * @private
	 */
	_createButtonMap() {
		// DebugLog('Buttons => createButtons');
		const transportCircleSize = SCALE(Math.round(grSet.transportButtonSize_layout * 0.93333));
		this.btnMap = {};

		try {
			this.btnMap = {
				Stop: {
					ico: Guifx.stop,
					font: grFont.guifx,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				Previous: {
					ico: Guifx.previous,
					font: grFont.guifx,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				Play: {
					ico: Guifx.play,
					font: grFont.guifx,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				Pause: {
					ico: Guifx.pause,
					font: grFont.guifx,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				Next: {
					ico: Guifx.next,
					font: grFont.guifx,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				PlaybackDefault: {
					ico: Guifx.right,
					font: grFont.pboDefault,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				PlaybackRepeatPlaylist: {
					ico: '\uf01e',
					font: grFont.pboRepeatPlaylist,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				PlaybackRepeatTrack: {
					ico: '\uf021',
					font: grFont.pboRepeatTrack,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				PlaybackShuffle: {
					ico: Guifx.shuffle,
					font: grFont.pboShuffle,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				ShowVolume: {
					ico: Guifx.volume_down,
					font: grFont.guifxVolume,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				Reload: {
					ico: Guifx.power,
					font: grFont.guifxReload,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				AddTracks: {
					ico: Guifx.medical,
					font: grFont.guifxAddTrack,
					type: 'transport',
					w: transportCircleSize,
					h: transportCircleSize
				},
				Minimize: {
					ico: '0',
					font: grFont.topMenuCaption,
					type: 'window'
				},
				Maximize: {
					ico: '2',
					font: grFont.topMenuCaption,
					type: 'window'
				},
				Close: {
					ico: 'r',
					font: grFont.topMenuCaption,
					type: 'window'
				},
				Hamburger: {
					ico: '\uf0c9',
					font: grFont.topMenuCompact,
					type: 'compact'
				},
				TopMenu: {
					ico: 'Menu',
					font: grFont.topMenu,
					type: 'compact'
				},
				File: {
					ico: 'File',
					font: grFont.topMenu,
					type: 'menu'
				},
				Edit: {
					ico: 'Edit',
					font: grFont.topMenu,
					type: 'menu'
				},
				View: {
					ico: 'View',
					font: grFont.topMenu,
					type: 'menu'
				},
				Playback: {
					ico: 'Playback',
					font: grFont.topMenu,
					type: 'menu'
				},
				Media: {
					ico: 'Media',
					font: grFont.topMenu,
					type: 'menu'
				},
				Help: {
					ico: 'Help',
					font: grFont.topMenu,
					type: 'menu'
				},
				Playlists: {
					ico: 'Playlists',
					font: grFont.topMenu,
					type: 'menu'
				},
				Options: {
					ico: 'Options',
					font: grFont.topMenu,
					type: 'menu'
				},
				Details: {
					ico: 'Details',
					font: grFont.topMenu,
					type: 'menu'
				},
				Playlist: {
					ico: 'Playlist',
					font: grFont.topMenu,
					type: 'menu'
				},
				Library: {
					ico: 'Library',
					font: grFont.topMenu,
					type: 'menu'
				},
				Lyrics: {
					ico: 'Lyrics',
					font: grFont.topMenu,
					type: 'menu'
				},
				Biography: {
					ico: 'Biography',
					font: grFont.topMenu,
					type: 'menu'
				},
				Rating: {
					ico: 'Rating',
					font: grFont.topMenu,
					type: 'menu'
				},
				Properties: {
					ico: 'Properties',
					font: grFont.topMenu,
					type: 'menu'
				},
				Settings: {
					ico: 'Settings',
					font: grFont.topMenu,
					type: 'menu'
				},
				Back: {
					ico: '\uE00E',
					type: 'backforward',
					font: grFont.symbol,
					w: SCALE(22),
					h: SCALE(22)
				},
				Forward: {
					ico: '\uE00F',
					type: 'backforward',
					font: grFont.symbol,
					w: SCALE(22),
					h: SCALE(22)
				}
			};
		} catch (e) {
			console.log('**********************************');
			console.log('ATTENTION: Buttons could not be created');
			console.log(`Make sure you installed the theme correctly to ${fb.ProfilePath}.`);
			console.log('**********************************');
		}

		return this.btnMap;
	}

	/**
	 * Creates the button images for various states ('Default', 'Hovered', 'Down', 'Enabled') based on the current button configurations.
	 * @param {boolean} [createButtonMap] - Indicates whether to create the button map, true by default.
	 * Set to false to use previously loaded button map for performance optimization.
	 * Useful when the button configurations have not changed, such as when only changing themes or colors.
	 * @private
	 */
	_createButtonImages(createButtonMap = true) {
		// DebugLog('Buttons => createButtonImages');
		grm.utils.profile(grm.ui.showDrawExtendedTiming, 'create', 'createButtonImages');

		if (createButtonMap || IsEmpty(this.btnMap)) {
			this.btnMap = this._createButtonMap();
		}

		const btnCompact = grSet.topMenuCompactSymbolOnly ? '\uf0c9' : '\uf0c9  Menu';
		const arc = SCALE(4);
		const lineW = SCALE(2);
		const halfLineW = Math.floor(lineW / 2);

		const btnStyle = {
			topMenuDefault: grSet.styleTopMenuButtons === 'default',
			topMenuFilled: grSet.styleTopMenuButtons === 'filled',
			topMenuBevel: grSet.styleTopMenuButtons === 'bevel',
			topMenuInner: grSet.styleTopMenuButtons === 'inner',
			topMenuEmboss: grSet.styleTopMenuButtons === 'emboss',
			transportDefault: grSet.styleTransportButtons === 'default',
			transportBevel: grSet.styleTransportButtons === 'bevel',
			transportInner: grSet.styleTransportButtons === 'inner',
			transportEmboss: grSet.styleTransportButtons === 'emboss'
		};

		const stateColor = {
			[ButtonState.Default]: {
				menuTextColor: grCol.menuTextNormal,
				menuRectColor: grCol.menuRectNormal,
				menuBgColor: grCol.menuBgColor,
				transportIconColor: grCol.transportIconNormal,
				transportEllipseColor: grCol.transportEllipseNormal
				// iconAlpha: 255, // Used for images only and not used atm
			},
			[ButtonState.Hovered]: {
				menuTextColor: grCol.menuTextHovered,
				menuRectColor: grCol.menuRectHovered,
				menuBgColor: grCol.menuBgColor,
				transportIconColor: grCol.transportIconHovered,
				transportEllipseColor: grCol.transportEllipseHovered
				// iconAlpha: 215, // Used for images only and not used atm
			},
			[ButtonState.Down]: {
				menuTextColor: grCol.menuTextDown,
				menuRectColor: grCol.menuRectDown,
				menuBgColor: grCol.menuBgColor,
				transportIconColor: grCol.transportIconDown,
				transportEllipseColor: grCol.transportEllipseDown
				// iconAlpha: 215, // Used for images only and not used atm
			},
			[ButtonState.Enabled]: {
				// iconAlpha: 255, // Used for images only and not used atm
			}
		};

		for (const btnKey in this.btnMap) {
			const btn = this.btnMap[btnKey];

			if (['menu', 'compact', 'window'].includes(btn.type)) {
				const img = gdi.CreateImage(100, 100);
				const g = img.GetGraphics();
				const textToMeasure = (btn.type === 'compact') ? btnCompact : btn.ico;
				const measurements = g.MeasureString(textToMeasure, btn.font, 0, 0, 0, 0);
				btn.w = Math.ceil(measurements.Width + SCALE(btn.type === 'window' ? 10 : 20));
				btn.h = Math.ceil(measurements.Height + SCALE(btn.type === 'window' ? 10 : 5));
				img.ReleaseGraphics(g);
			}

			let { w, h } = btn;

			if (RES._4K) {
				if (btn.type === 'window') {
					w = Math.round(btn.w * 1.2);
					h = Math.round(btn.h * 1.2);
				} else if (btn.type !== 'transport') {
					w += 0;
					h += 10;
				}
			}

			const stateImages = {};

			for (const stateKey of ['Default', 'Hovered', 'Down', 'Enabled']) {
				if (stateKey === 'Enabled' && btn.type !== 'image') continue;

				const stateButton = ButtonState[stateKey];
				const { menuTextColor, menuRectColor, menuBgColor, transportIconColor, transportEllipseColor } = stateColor[stateButton];
				const img = gdi.CreateImage(w, h);
				const g = img.GetGraphics();

				g.SetSmoothingMode(SmoothingMode.AntiAlias);
				// * Positions playback icons weirdly on AntiAliasGridFit
				if (btn.type !== 'transport' && btn.type !== 'compact' && !grSet.customThemeFonts) {
					g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				} else {
					g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
				}

				switch (btn.type) {
					case 'menu': case 'window': case 'compact':
						if (stateButton) {
							if (btnStyle.topMenuDefault || btnStyle.topMenuFilled) {
								if (btnStyle.topMenuFilled) g.FillRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, menuBgColor);
								g.DrawRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, 1, menuRectColor);
							}
							else if (btnStyle.topMenuBevel) {
								g.FillRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, menuBgColor);
								FillGradRoundRect(g, halfLineW, halfLineW + 1, w, h - 1, arc, arc, 90, 0, grCol.menuStyleBg, 1);
								g.DrawRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, 1, menuRectColor);
							}
							else if (btnStyle.topMenuInner) {
								g.FillRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, menuBgColor);
								FillGradRoundRect(g, halfLineW, halfLineW + 1, w, h - 1, arc, arc, 90, 0, grCol.menuStyleBg, 0);
								g.DrawRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, 1, menuRectColor);
							}
							else if (btnStyle.topMenuEmboss) {
								g.FillRoundRect(halfLineW, halfLineW, w - lineW, h - lineW, arc, arc, menuBgColor);
								FillGradRoundRect(g, halfLineW, halfLineW + 1, w, h - 1, arc, arc, 90, 0, grCol.menuStyleBg, 0.33);
								g.DrawRoundRect(halfLineW + 1, halfLineW + 1, w - lineW - 2, h - lineW - 1, arc, arc, 1, grCol.menuRectStyleEmbossTop);
								g.DrawRoundRect(halfLineW + 1, halfLineW, w - lineW - 2, h - lineW - 1, arc, arc, 1, grCol.menuRectStyleEmbossBottom);
							}
						}

						if (btn.type === 'compact') {
							const hamburgerW = g.CalcTextWidth('\uf0c9', grFont.topMenuCompact);
							const hamburgerX = Math.round(grSet.topMenuCompactSymbolOnly ? (w - hamburgerW) / 2 : hamburgerW * 0.75);
							g.DrawString('\uf0c9', grFont.topMenuCompact, menuTextColor, hamburgerX, HD_4K(0, 1), hamburgerW, h, StringFormat(1, 1));
							if (!grSet.topMenuCompactSymbolOnly) {
								g.DrawString(btn.ico, btn.font, menuTextColor, hamburgerW * 1.25, 0, w - hamburgerW, h, StringFormat(1, 1));
							}
						} else {
							g.DrawString(btn.ico, btn.font, menuTextColor, 0, 0, w, h, StringFormat(1, 1));
						}
						break;

					case 'transport':
						if (btnStyle.transportDefault) {
							g.DrawEllipse(halfLineW + 1, halfLineW + 1, w - lineW - 2, h - lineW - 2, lineW, transportEllipseColor);
							g.FillEllipse(halfLineW + 1, halfLineW + 1, w - lineW - 2, h - lineW - 2, grCol.transportEllipseBg);
						}
						else if (btnStyle.transportBevel) {
							g.FillEllipse(halfLineW, halfLineW, w - lineW - 1, h - lineW - 1, grCol.transportStyleTop);
							g.DrawEllipse(halfLineW, halfLineW, w - lineW - 1, h - lineW, 1, grCol.transportStyleBottom);
							FillGradEllipse(g, halfLineW - 0.5, halfLineW, w + 0.5, h + 0.5, 90, 0, grCol.transportStyleBg, 1);
						}
						else if (btnStyle.transportInner) {
							g.FillEllipse(halfLineW, halfLineW, w - lineW, h - lineW - 1, grCol.transportStyleTop);
							g.DrawEllipse(halfLineW, halfLineW - 1, w - lineW, h - lineW + 1, 1, grCol.transportStyleBottom);
							FillGradEllipse(g, halfLineW - 0.5, halfLineW, w + 1.5, h + 0.5, 90, 0, grCol.transportStyleBg, 0);
						}
						else if (btnStyle.transportEmboss) {
							g.FillEllipse(halfLineW + 1, halfLineW + 1, w - lineW - 2, h - lineW - 2, grCol.transportEllipseBg);
							FillGradEllipse(g, halfLineW + 2, halfLineW + 2, w - lineW - 2, h - lineW - 2, 90, 0, grCol.transportStyleBg, 0.33);
							g.DrawEllipse(halfLineW + 1, halfLineW + 2, w - lineW - 2, h - lineW - 3, lineW, grCol.transportStyleTop);
							g.DrawEllipse(halfLineW + 1, halfLineW, w - lineW - 2, h - lineW - 2, lineW, grCol.transportStyleBottom);
						}
						g.DrawString(btn.ico, btn.font, transportIconColor, 1, (['Stop', 'Reload', 'AddTracks'].includes(btnKey)) ? 0 : 1, w, h, StringFormat(1, 1));
						break;

					case 'backforward':
						g.DrawString(btn.ico, btn.font, pl.col.plman_text_hovered, btnKey === 'Back' ? -1 : 0, 0, w, h, StringFormat(1, 1));
						break;
				}

				img.ReleaseGraphics(g);
				stateImages[stateKey] = img;
			}

			this.btnImg[btnKey] = stateImages;
		}

		grm.utils.profile(false, 'print', 'createButtonImages');
	}

	/**
	 * Creates the top menu buttons which includes foobar and panel buttons.
	 * @param {number} ww - The window.Width.
	 * @param {number} wh - The window.Height.
	 * @private
	 */
	_createTopMenuButtons(ww, wh) {
		/** @type {GdiBitmap[]} */
		let img = this.btnImg.File;
		let x   = SCALE(10);
		const h = img.Default.Height;
		const y = Math.round(grm.ui.topMenuHeight * 0.5 - h * 0.5 - SCALE(1));
		const minWidth = ww < SCALE(grSet.layout === 'compact' ? 580 : 620);
		const fontSize = grSet.menuFontSize_layout;
		const fontSizeCorr = minWidth && fontSize > 12 ? -fontSize * 0.75 : 0;

		// * ☰ MENU BUTTON * //
		if (grSet.showTopMenuCompact) {
			img = this.btnImg.TopMenu;
			this.btn.Menu = new Button(x, y, img.Default.Width, h, 'Menu', img, 'Open menu');
		// * DEFAULT BUTTONS * //
		} else {
			// Foobar default buttons - Artwork layout only has 'File' button displayed
			const defaultButtons = grSet.layout === 'artwork' ? ['File'] : ['File', 'Edit', 'View', 'Playback', 'Media', 'Help', 'Playlists'];
			for (const btnKey of defaultButtons) {
				img = this.btnImg[btnKey];
				this.btn[btnKey] = new Button(x, y, img.Default.Width, h, btnKey, img, `Open ${btnKey} menu`);
				x += img.Default.Width + fontSizeCorr;
			}

			// * OPTIONS THEME BUTTON * //
			img = this.btnImg.Options;
			this.btn.Options = new Button(x, y, img.Default.Width, h, 'Options', img, 'Open Options menu');
			x += img.Default.Width + fontSizeCorr;
		}

		// * PANEL BUTTONS * //
		let panelBtnTotalW = 0;
		const panelButtons = ['Details', 'Playlist', 'Library', 'Biography', 'Lyrics', 'Rating'];
		for (const btnKey of panelButtons) {
			if (grSet[`showPanel${btnKey}_layout`] || (grSet.showPanelPlaylist_artwork && btnKey === 'Playlist' && grSet.layout === 'artwork')) {
				panelBtnTotalW += this.btnImg[btnKey].Default.Width + fontSizeCorr;
			}
		}

		// Calculate new starting x position for centered panel buttons if default alignment is center
		const centeredX = Math.round((ww - panelBtnTotalW) / 2);
		const alignCenter = !grSet.showTopMenuCompact && grSet.topMenuAlignment === 'center' && centeredX > x;
		let panelBtnX = grSet.showTopMenuCompact || alignCenter ? centeredX : x;

		for (const btnKey of panelButtons) {
			if ((btnKey === 'Playlist' && (!grSet.showPanelPlaylist_artwork || grSet.layout !== 'artwork')) ||
				(btnKey !== 'Playlist' && (!grSet[`showPanel${btnKey}_layout`] || grSet.layout === 'compact'))) {
				continue; // Playlist button is only available and displayed in `Artwork` layout
			}
			img = this.btnImg[btnKey];
			this.btn[btnKey.toLowerCase()] = new Button(panelBtnX, y, img.Default.Width, img.Default.Height, btnKey, img, `Display ${btnKey}`);
			panelBtnX += img.Default.Width + fontSizeCorr;
		}
	}

	/**
	 * Creates the top menu 🗕 🗖 ✖ caption buttons.
	 * @param {number} ww - The window.Width.
	 * @param {number} wh - The window.Height.
	 * @private
	 */
	_createTopMenuCaptionButtons(ww, wh) {
		if (!UIHacks || UIHacks.FrameStyle === FrameStyle.Default ||
			grSet.layout !== 'default' && !grSet.showTopMenuCompact && ww < SCALE(grSet.layout === 'compact' ? 580 : 620)) {
			return;
		}

		const layoutDefault = grSet.layout === 'default';
		const hideClose = UIHacks.FrameStyle === FrameStyle.SmallCaption && !UIHacks.FullScreen;
		const btnSize = this.btnImg.Close.Default.Height;
		const btnCount = hideClose ? (layoutDefault ? 2 : 1) : layoutDefault ? 3 : 2;
		const totalWidth = btnSize * btnCount + (btnCount - 1);

		let x = ww - totalWidth - SCALE(10);
		const y = Math.round(grm.ui.topMenuHeight * 0.5 - btnSize * 0.5 - SCALE(1));

		this.btn.Minimize = new Button(x, y, btnSize, btnSize, 'Minimize', this.btnImg.Minimize, 'Minimize');
		x += btnSize;

		if (layoutDefault && !hideClose) {
			this.btn.Maximize = new Button(x, y, btnSize, btnSize, 'Maximize', this.btnImg.Maximize, 'Maximize');
			x += btnSize;
		}

		if (!hideClose) {
			this.btn.Close = new Button(x, y, btnSize, btnSize, 'Close', this.btnImg.Close, 'Close');
		}
	}

	/**
	 * Creates the lower bar transport buttons based on configuration.
	 * @param {number} ww - The window.Width.
	 * @param {number} wh - The window.Height.
	 * @private
	 */
	_createLowerBarButtons(ww, wh) {
		if (!grSet.showTransportControls_layout) {
			return;
		}

		let buttonCount = this.initButtonCount('lowerBar');

		const btnSize = SCALE(grSet.transportButtonSize_layout);
		const y = grm.ui.getLowerBarButtonsY();
		const p = SCALE(grSet.transportButtonSpacing_layout); // Space between buttons
		const x = (ww - btnSize * buttonCount - p * (buttonCount - 1)) * 0.5;
		const calcX = (index) => x + (btnSize + p) * index;

		buttonCount = 0;

		this.btn.stop = new Button(x, y, btnSize, btnSize, 'Stop', this.btnImg.Stop, this.lowerTransportTooltip('stop'));
		this.btn.prev = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'Previous', this.btnImg.Previous, this.lowerTransportTooltip('prev'));
		this.btn.play = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'PlayPause', !fb.IsPlaying || fb.IsPaused ? this.btnImg.Play : this.btnImg.Pause, this.lowerTransportTooltip('play'));
		this.btn.next = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'Next', this.btnImg.Next, this.lowerTransportTooltip('next'));

		if (grSet.showPlaybackOrderBtn_layout) {
			const playbackOrderImages = [this.btnImg.PlaybackDefault, this.btnImg.PlaybackRepeatPlaylist, this.btnImg.PlaybackRepeatTrack, this.btnImg.PlaybackShuffle];
			const btnImg = playbackOrderImages[Math.min(plman.PlaybackOrder, playbackOrderImages.length - 1)];
			this.btn.playbackOrder = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'PlaybackOrder', btnImg);
		}
		if (grSet.showReloadBtn_layout) {
			this.btn.reload = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'Reload', this.btnImg.Reload, this.lowerTransportTooltip('reload'));
		}
		if (grSet.showAddTracksBtn_layout) {
			this.btn.addTracks = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'AddTracks', this.btnImg.AddTracks, this.lowerTransportTooltip('addTracks'));
		}
		if (grSet.showVolumeBtn_layout) {
			this.btn.volume = new Button(calcX(++buttonCount), y, btnSize, btnSize, 'Volume', this.btnImg.ShowVolume);
			grm.volBtn.setMetrics(this.btn.volume.x, y);
		}
	}
	// #endregion

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Creates the theme buttions such as top menu and lower bar transport buttons.
	 * @param {number} ww - The window.Width.
	 * @param {number} wh - The window.Height.
	 * @param {boolean} [createButtonImages] - Whether to create the button images, true by default.
	 * @param {boolean} [createButtonConfigs] - Whether to create the button configurations, true by default.
	 */
	createButtons(ww, wh, createButtonImages = true, createButtonConfigs = true) {
		// DebugLog('Buttons => createButtons');
		this.btn = {};

		if (ww <= 0 || wh <= 0) {
			return;
		}
		else if (createButtonImages === true || this.btnImg.File === undefined) {
			// DebugLog('Buttons => createButtons => createButtonImages');
			this._createButtonImages(createButtonConfigs);
		}

		this._createTopMenuButtons(ww, wh);
		this._createTopMenuCaptionButtons(ww, wh);
		this._createLowerBarButtons(ww, wh);
	}
	// #endregion

	// * PUBLIC METHODS - STATE * //
	// #region PUBLIC METHODS - STATE
	/**
	 * Initializes and sets the top menu or transport button count based on the specified type.
	 * @param {string} type - Specify whether to count buttons for 'topMenu' or 'lowerBar'.
	 * @returns {number} The number of buttons for the specified type.
	 */
	initButtonCount(type) {
		if (type === 'topMenu') {
			grm.ui.topMenuBtnCount = [
				'showPanelDetails_layout',
				'showPanelLibrary_layout',
				'showPanelBiography_layout',
				'showPanelLyrics_layout',
				'showPanelRating_layout'
			].reduce((count, propName) => count + (grSet[propName] ? 1 : 0), 0);
		}
		else if (type === 'lowerBar') {
			grm.ui.lowerBarBtnCount = 4 + [
				'showPlaybackOrderBtn_layout',
				'showReloadBtn_layout',
				'showAddTracksBtn_layout',
				'showVolumeBtn_layout'
			].reduce((count, propName) => count + (grSet[propName] ? 1 : 0), 0);
		}

		return type === 'topMenu' ? grm.ui.topMenuBtnCount : grm.ui.lowerBarBtnCount;
	}

	/**
	 * Initializes the top menu button state.
	 */
	initButtonState() {
		const buttons = [this.btn.details, this.btn.playlist, this.btn.library, this.btn.biography, this.btn.lyrics];
		for (const button of buttons) this.setButtonState(false, button);

		if (grSet.layout === 'default' && grm.ui.displayDetails || grSet.layout === 'artwork' && grm.ui.displayPlaylist) {
			this.setButtonState(this.btn.details);
		}
		else if (grm.ui.displayPlaylistArtwork) {
			this.setButtonState(this.btn.playlist);
		}
		else if (grm.ui.displayLibrary) {
			this.setButtonState(this.btn.library);
		}
		else if (grm.ui.displayBiography && !grm.ui.displayLyrics) {
			this.setButtonState(this.btn.biography);
		}
		if (grm.ui.displayLyrics) {
			this.setButtonState(this.btn.lyrics);
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
	 * @param {GdiBitmap} imgValue - The value of this.btnImg.PlaybackDefault, this.btnImg.PlaybackRepeatTrack, or this.btnImg.PlaybackShuffle.
	 * @param {string} prefValue - The value of 'default', 'repeatPlaylist', 'repeatTrack', or 'shuffle'.
	 * @param {string} fbValue - The value of PlaybackOrder.Default, PlaybackOrder.RepeatPlaylist, PlaybackOrder.RepeatTrack, or PlaybackOrder.ShuffleTracks.
	 * @param {string} cmd - The value of top menu Playback > Order.
	 */
	setPlaybackOrder(imgValue, prefValue, fbValue, cmd) {
		this.btn.playbackOrder.img = imgValue;
		grSet.playbackOrder = prefValue;
		fb.PlaybackOrder = fbValue;
		fb.RunMainMenuCommand(`Playback/Order/${cmd}`);
	}

	/**
	 * Passes in the current button as an argument via the btnActionHandler.
	 */
	onClick() {
		grm.button._actionHandler(this); // Bind this to `Button` class
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
		window.RepaintRect(this.x - SCALE(1), this.y - SCALE(1), this.w + SCALE(2), this.h + SCALE(2));
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
		if (!this.activeButton) return;
		this.activeButton.changeState(ButtonState.Down);
		this.downButton = this.activeButton;
		this.downButton.onDblClick();
	}

	/**
	 * Handles left mouse click down events on a button and changes its state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_down(x, y, m) {
		if (!this.activeButton) return;
		this.activeButton.changeState(ButtonState.Down);
		this.downButton = this.activeButton;
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
			this.activeButton = undefined;
			this.mainMenuOpen = false;
		}

		if (this.activeButton) {
			this.activeButton.changeState(ButtonState.Hovered);
		}
		else if (this.downButton && this.downButton === this.activeButton) {
			this.downButton.changeState(ButtonState.Default);
		}

		this.activeButton = this.downButton;
	}

	/**
	 * Handles mouse leave events on a button and changes its state to default.
	 */
	on_mouse_leave() {
		this.oldButton = undefined;

		if (this.downButton) return;

		for (const key in this.btn) {
			if (this.btn[key].state !== 0) {
				this.btn[key].changeState(ButtonState.Default);
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
		this.oldButton = this.activeButton;
		this.activeButton = null;
		this.mouseInControl = false;

		for (const key in this.btn) {
			if (typeof this.btn[key] === 'object' && this.btn[key].mouseInThis(x, y)) {
				this.activeButton = this.btn[key];
				this.mouseInControl = true;
				break;
			}
		}

		if (this.oldButton && this.oldButton !== this.activeButton) {
			this.oldButton.changeState(this.oldButton.enabled ? ButtonState.Enabled : ButtonState.Default);
		}
		if (this.activeButton && this.activeButton !== this.oldButton) {
			this.activeButton.changeState(ButtonState.Hovered);
		}
		this.downButton = this.activeButton;

		if (this.lastOverButton !== this.activeButton) {
			grm.ttip.stop();
		}
		this.lastOverButton = this.activeButton;

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
