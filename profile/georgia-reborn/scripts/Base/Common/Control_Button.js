/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Button Control                       * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-07-29                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {Button} */
let thisButton = null;
/** @type {Button} */
let oldButton;
/** @type {Button} */
let downButton;
/** @type {Button} */
let lastOverButton = null;
/** @type {Button[]} */
const activatedBtns = [];
/** @type {number} */
let buttonTimer = null;
/** @type {boolean} */
let mainMenuOpen = false;
/** @type {boolean} */
let mouseInControl = false;

/** @enum {number} */
const ButtonState = {
	Default: 0,
	Hovered: 1,
	Down:    2, // Happens on click
	Enabled: 3
};

/** @enum {number} */
const WindowState = {
	Normal:    0,
	Minimized: 1,
	Maximized: 2
};


///////////////////////
// * BUTTON OBJECT * //
///////////////////////
/**
 * The Button class represents a clickable element with an image, tooltip and state.
 */
class Button {
	/**
	 * Constructor for a clickable element with an image, tooltip, and state.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} w The width.
	 * @param {number} h The height.
	 * @param {string} id The id.
	 * @param {GdiBitmap[]} img The image that will be displayed for the button.
	 * @param {string} tip The tooltip text for the button.
	 * @param {boolean} isEnabled A callback function that determines whether the button is enabled or disabled.
	 * @class
	 */
	constructor(x, y, w, h, id, img, tip = undefined, isEnabled = undefined) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.id = id;
		this.img = img;
		this.tooltip = typeof tip !== 'undefined' ? tip : '';
		this.state = 0;
		this.hoverAlpha = 0;
		this.downAlpha = 0;
		this.isEnabled = isEnabled;
		this.enabled = false;
	}

	/**
	 * Checks if the mouse is within the boundaries of a button.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}

	/**
	 * Sets the enabled state of a button and changes its state accordingly.
	 * @param {boolean} val Whether the button should be enabled or disabled.
	 */
	set enable(val) {
		this.enabled = val;
		if (!val) {
			this.changeState(ButtonState.Default);
		} else {
			this.changeState(ButtonState.Enabled);
		}
	}

	/**
	 * Gets the enabled state of a button.
	 * @returns {boolean} True or false.
	 */
	get enable() {
		return this.enabled;
	}

	/**
	 * Repaints the button to update its state.
	 */
	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	/**
	 * Updates the state of the button.
	 * @param {number} state The new state to set for the button.
	 */
	changeState(state) {
		this.state = state;
		activatedBtns.push(this);
		buttonAlphaTimer();
	}

	/**
	 * Passes in the current button as an argument via the btnActionHandler.
	 */
	onClick() {
		btnActionHandler(this);
	}

	/**
	 * Currently does not have any functionality.
	 */
	onDblClick() {
		// We don't do anything with dblClick currently
	}
}


///////////////////////
// * EVENT HANDLER * //
///////////////////////
/**
 * Handles various mouse button events.
 * @class
 */
class ButtonEventHandler {
	/**
	 * Handles mouse double click events on a button and changes its state.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} m The mouse mask.
	 */
	on_mouse_lbtn_dblclk(x, y, m) {
		if (!thisButton) return;
		thisButton.changeState(ButtonState.Down);
		downButton = thisButton;
		downButton.onDblClick();
	}

	/**
	 * Handles left mouse click down events on a button and changes its state.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} m The mouse mask.
	 */
	on_mouse_lbtn_down(x, y, m) {
		if (!thisButton) return;
		thisButton.changeState(ButtonState.Down);
		downButton = thisButton;
	}

	/**
	 * Handles left mouse click up events on a button and changes its state.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} m The mouse mask.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (!downButton) return;

		downButton.onClick();

		if (mainMenuOpen) {
			thisButton = undefined;
			mainMenuOpen = false;
		}

		if (thisButton) {
			thisButton.changeState(ButtonState.Hovered);
		}
		else if (downButton && downButton === thisButton) {
			downButton.changeState(ButtonState.Default);
		}

		thisButton = downButton;
	}

	/**
	 * Handles mouse leave events on a button and changes its state to default.
	 */
	on_mouse_leave() {
		oldButton = undefined;

		if (downButton) return;

		for (const i in btns) {
			if (btns[i].state !== 0) {
				btns[i].changeState(ButtonState.Default);
			}
		}
	}

	/**
	 * Handles mouse move tracking events on a button and changes its state.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} m The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		oldButton = thisButton;

		for (const i in btns) {
			if (typeof btns[i] === 'object' && btns[i].mouseInThis(x, y)) {
				mouseInControl = true;
				thisButton = btns[i];
				break;
			} else {
				mouseInControl = false;
				thisButton = null;
			}
		}

		if (oldButton && oldButton !== thisButton) {
			oldButton.changeState(oldButton.enabled ? ButtonState.Enabled : ButtonState.Default);
		}
		if (thisButton && thisButton !== oldButton) {
			thisButton.changeState(ButtonState.Hovered);
		}
		downButton = thisButton;

		if (lastOverButton !== thisButton) {
			tt.stop();
		}
		lastOverButton = thisButton;

		if (pref.showTooltipMain && lastOverButton) {
			if (lastOverButton.tooltip) {
				tt.showDelayed(lastOverButton.tooltip);
			}
			else if (lastOverButton.id === 'Volume' && !volumeBtn.show_volume_bar) {
				tt.showDelayed(`${fb.Volume.toFixed(2)} dB`);
			}
			else if (lastOverButton.id === 'PlaybackOrder') {
				tt.showDelayed(playbackOrderTooltip());
			}
		}
	}
}


////////////////////////
// * ACTION HANDLER * //
////////////////////////
/**
 * Handles button action events based on menu, panel and button type.
 * @param {Button} btn The instance of the button.
 */
function btnActionHandler(btn) {
	/**
	 * Restores the Lyrics layout to full width.
	 */
	const restoreLyricsLayout = () => {
		if (!pref.displayLyrics || !lyricsLayoutFullWidth) return;
		if (!displayBiography) displayPlaylist = false;
		pref.lyricsLayout = 'full';
	};

	switch (btn.id) {
		// * TOP MENU COMPACT * //
		case 'Menu':
			onTopMenuCompact();
			break;

		// * TOP MENU DEFAULT FOOBAR2000 BUTTONS * //
		case 'File':
		case 'Edit':
		case 'View':
		case 'Playback':
		case 'Library':
		case 'Help':
			onMainMenu(btn.x, btn.y + btn.h, btn.id);
			break;
		case 'Playlists':
			onPlaylistsMenu(btn.x, btn.y + btn.h);
			break;

		// * TOP MENU THEME BUTTONS * //
		case 'Options':
			onOptionsMenu(btn.x, btn.y + btn.h);
			break;

		case 'Details':
			displayPlaylist = !displayPlaylist;
			displayDetails = pref.layout === 'artwork' ? displayPlaylist : !displayPlaylist;
			displayBiography = false;
			if (pref.lyricsLayout !== 'full') pref.displayLyrics = false;
			if (pref.lyricsActiveState) { pref.displayLyrics = true; initLyrics(); }

			if (displayPlaylist) {
				if (pref.layout === 'artwork') {
					if (pref.lyricsActiveState) pref.displayLyrics = false;
					displayPlaylistArtwork = false;
					playlist.x = ww; // Move hidden Playlist offscreen to disable Playlist mouse functions in Details
					resizeArtwork(true);
				} else {
					if (pref.panelWidthAuto) resizeArtwork(true);
					playlist.on_size(ww, wh);
				}
			}
			if (displayLibrary) {
				displayLibrary = false;
				if (pref.layout === 'default') {
					displayPlaylist = pref.libraryLayout === 'split' ? false : !displayPlaylist; // * Library Playlist split layout
					displayDetails = pref.layout === 'artwork' ? displayPlaylist : !displayPlaylist;
				}
			}
			if (pref.lyricsLayout === 'full' && pref.displayLyrics) {
				if (pref.lyricsActiveState) pref.lyricsLayout = 'normal';
				if (!pref.lyricsActiveState) pref.displayLyrics = false;
				if (pref.layout === 'default' && displayPlaylist) displayPlaylist = !displayPlaylist;
			} else {
				restoreLyricsLayout();
			}

			resizeArtwork(false);
			if (displayCustomThemeMenu) {
				if (customThemeMenuCall) displayPanel('details');
				reinitCustomThemeMenu();
				customThemeMenuCall = false;
			}
			setDiscArtRotationTimer();
			initButtonState();
			window.Repaint();
			break;

		case 'PlaylistArtworkLayout':
			displayPlaylistArtwork = !displayPlaylistArtwork;
			displayPlaylist = false;
			displayLibrary = false;
			displayBiography = false;
			pref.displayLyrics = pref.lyricsActiveState && !displayPlaylistArtwork;

			playlist.on_size(ww, wh);
			resizeArtwork(false);
			initButtonState();
			window.Repaint();
			break;

		case 'library':
			displayLibrary = !displayLibrary;
			displayBiography = false;
			pref.displayLyrics = pref.lyricsActiveState;

			if (displayCustomThemeMenu) reinitCustomThemeMenu();

			if (displayLibrary) {
				if (pref.layout === 'default') {
					displayPlaylist = true;
				}
				else if (pref.layout === 'artwork') {
					displayPlaylistArtwork = false;
					pref.displayLyrics = false;
					resizeArtwork(true);
				}
			}
			if (displayPlaylist) {
				displayPlaylist = false;
			}
			else if (pref.layout === 'default') {
				displayPlaylist = true;
				playlist.on_size(ww, wh);
				restoreLyricsLayout();
			}

			// * Library Playlist split layout
			if (displayPlaylistLibrary()) {
				displayPlaylist = true;
				playlist.on_size(ww, wh);
				setLibrarySize();
			} else if (pref.layout === 'default' && pref.libraryLayout === 'split') {
				displayPlaylist = true;
				initLibraryLayout();
			}
			if (pref.layout === 'default' && pref.libraryLayout !== 'split' &&
				pref.libraryLayoutSplitPreset  || pref.libraryLayoutSplitPreset2 ||
				pref.libraryLayoutSplitPreset3 || pref.libraryLayoutSplitPreset4) {
				g_properties.auto_collapse = false;
				playlist.expand_header();
			}

			// Update Library nowPlaying state if song was played from the Playlist
			lib.treeState(false, 2);
			if (pref.libraryAutoScrollNowPlaying) {
				pop.getNowplaying();
				pop.nowPlayingShow();
			}

			resizeArtwork(false);
			setDiscArtRotationTimer();
			initButtonState();
			window.Repaint();
			break;

		case 'Biography':
			displayPlaylist = pref.layout === 'default';
			displayLibrary = false;
			displayBiography = !displayBiography;
			pref.displayLyrics = false;

			if (displayCustomThemeMenu) reinitCustomThemeMenu();

			// Switch playlist to normal width to prevent panel overlaying
			pref.playlistLayoutNormal = pref.playlistLayout === 'full' && displayBiography;

			if (!displayBiography && pref.lyricsActiveState) {
				pref.displayLyrics = true;
				restoreLyricsLayout();
				// Switch playlist to normal width to prevent panel overlaying
				pref.playlistLayoutNormal = pref.playlistLayout === 'full' && pref.displayLyrics;
			}
			if (displayBiography && (pref.biographyLayout === 'full' || pref.layout === 'artwork')) {
				pref.layout === 'artwork' ? displayPlaylistArtwork = false : displayPlaylist = false;
			} else {
				playlist.on_size(ww, wh);
			}

			biography.on_playback_new_track(); // Update Biography state
			resizeArtwork(false);
			setDiscArtRotationTimer();
			initButtonState();
			window.Repaint();
			break;

		case 'Lyrics':
			displayPlaylist = pref.layout === 'default';
			displayPlaylistArtwork = false;
			displayLibrary = false;
			displayBiography = false;
			pref.displayLyrics = !pref.displayLyrics;

			if (displayCustomThemeMenu) reinitCustomThemeMenu();

			// Switch playlist to normal width to prevent panel overlaying
			pref.playlistLayoutNormal = pref.playlistLayout === 'full' && pref.displayLyrics;
			// Save lyric active state
			pref.lyricsActiveState = pref.displayLyrics && pref.lyricsRememberActiveState;

			if (pref.lyricsLayout === 'full' && pref.displayLyrics) {
				displayPlaylist = false;
				if (!pref.panelWidthAuto) resizeArtwork(true);
			} else if (!pref.panelWidthAuto) {
				playlist.on_size(ww, wh);
			}

			initLyrics();
			resizeArtwork(pref.layout === 'artwork');
			initButtonState();
			window.Repaint();
			break;

		case 'Rating':
			onRatingMenu(btn.x, btn.y + btn.h);
			break;

		// * TOP MENU 🗕 🗖 ✖ CAPTION BUTTONS * //
		case 'Minimize':
			fb.RunMainMenuCommand('View/Hide');
			break;
		case 'Maximize': {
			if (pref.maximizeToFullscreen) { // F11 shortcut ( on_key_down() ) for going into/out fullscreen mode, disabled/not supported in Artwork layout, ESC also exits fullscreen mode
				UIHacks.FullScreen = !UIHacks.FullScreen;
			} else {
				UIHacks.MainWindowState = UIHacks.MainWindowState === WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
			}
			break;
		}
		case 'Close':
			fb.Exit();
			break;

		// * LOWER BAR TRANSPORT BUTTONS * //
		case 'Stop':
			fb.Stop();
			if (pref.returnToHomeOnPlaybackStop && pref.layout !== 'compact') {
				switch (pref.showPanelOnStartup) {
					case 'playlist':
						displayPlaylist = true;
						displayLibrary = false;
						displayBiography = false;
						pref.displayLyrics = false;
						playlist.on_size(ww, wh);
						break;
					case 'details':
						displayPlaylist = pref.layout === 'artwork';
						displayPlaylistArtwork = false;
						displayLibrary = false;
						displayBiography = false;
						pref.displayLyrics = false;
						break;
					case 'library':
						displayPlaylist = false;
						displayPlaylistArtwork = false;
						displayLibrary = true;
						displayBiography = false;
						pref.displayLyrics = false;
						break;
					case 'biography':
						displayPlaylist = true;
						displayPlaylistArtwork = false;
						displayLibrary = true;
						displayBiography = true;
						pref.displayLyrics = false;
						playlist.on_size(ww, wh);
						break;
					case 'lyrics':
						displayPlaylist = true;
						displayPlaylistArtwork = false;
						displayLibrary = false;
						displayBiography = false;
						pref.displayLyrics = true;
						playlist.on_size(ww, wh);
						break;
					case 'cover': // Artwork layout
						displayPlaylist = false;
						displayPlaylistArtwork = false;
						displayLibrary = false;
						displayBiography = false;
						pref.displayLyrics = false;
						break;
				}
			}
			window.Repaint();
			initButtonState();
			break;
		case 'Previous':
			fb.Prev();
			break;
		case 'Play/Pause':
			fb.PlayOrPause();
			break;
		case 'Next':
			fb.Next();
			break;
		case 'PlaybackOrder':
			switch (plman.PlaybackOrder) {
				case 0:	 fb.PlaybackOrder = PlaybackOrder.RepeatTrack; break;
				case 2:	 fb.PlaybackOrder = PlaybackOrder.ShuffleTracks; break;
				case 4:	 fb.PlaybackOrder = PlaybackOrder.Default; break;
				default: fb.PlaybackOrder = PlaybackOrder.RepeatTrack; break;
			}
			updatePlaybackOrderButton();
			break;
		case 'Repeat':
			switch (fb.PlaybackOrder) {
				case PlaybackOrder.Default:	fb.PlaybackOrder = PlaybackOrder.RepeatPlaylist; break;
				case PlaybackOrder.RepeatPlaylist: fb.PlaybackOrder = PlaybackOrder.RepeatTrack; break;
				case PlaybackOrder.RepeatTrack:	fb.PlaybackOrder = PlaybackOrder.Default; break;
				default: fb.PlaybackOrder = PlaybackOrder.RepeatPlaylist; break;
			}
			break;
		case 'Shuffle':
			fb.PlaybackOrder = fb.PlaybackOrder !== PlaybackOrder.ShuffleTracks ? PlaybackOrder.ShuffleTracks : PlaybackOrder.Default;
			break;
		case 'Reload':
			window.Reload();
			break;
		case 'Volume':
			if (pref.autoHideVolumeBar) {
				volumeBtn.toggleVolumeBar();
			} else {
				fb.VolumeMute();
			}
			break;
		case 'Mute':
			fb.VolumeMute();
			break;
		case 'PlaybackTime':
			pref.switchPlaybackTime = !pref.switchPlaybackTime;
			on_playback_time();
			break;

		// * MISC * //
		case 'Console':
			fb.RunMainMenuCommand('View/Console');
			break;
		case 'Settings':
			fb.ShowPreferences();
			break;
		case 'Properties':
			fb.RunContextCommand('Properties');
			break;

		// * PLAYLIST HISTORY BUTTONS * //
		case 'Back': case 'Forward':
			if (btn.isEnabled && btn.isEnabled()) {
				if (btn.id === 'Back') {
					playlistHistory.back();
				} else {
					playlistHistory.forward();
				}
			}
			break;
	}
}


//////////////////////////
// * TOP MENU COMPACT * //
//////////////////////////
/**
 * Collapses the top menu to compact mode or expands it to normal.
 * @param {boolean} collapse Wether the top menu should be collapsed or not.
 */
function onTopMenuCompact(collapse) {
	pref.showTopMenuCompact = !pref.showTopMenuCompact;
	if (collapse) {
		if (topMenuCompactExpanded) return;
		pref.showTopMenuCompact = true;
	}
	createButtonImages();
	createButtonObjects(ww, wh);
	initButtonState();
	repaintWindow();
}


////////////////////////////
// * TOP MENU PLAYLISTS * //
////////////////////////////
/**
 * Creates a context menu for playlists allowing users to perform various actions such as
 * creating new playlists, saving and loading playlists, locking and unlocking playlists,
 * and creating auto playlists based on different criteria.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @returns {boolean} True or false.
 */
function onPlaylistsMenu(x, y) {
	mainMenuOpen = true;
	activeMenu = true;

	const playlist_count = plman.PlaylistCount;
	const playlistId = 21;
	const cpm = window.CreatePopupMenu();
	const pltools = window.CreatePopupMenu();
	const autopl = window.CreatePopupMenu();
	const isAutoPl = !plman.PlaylistCount ? '' : plman.IsAutoPlaylist(plman.ActivePlaylist);
	const isLocked = !plman.PlaylistCount ? '' : plman.IsPlaylistLocked(plman.ActivePlaylist);

	pltools.AppendTo(cpm, MF_STRING, 'Playlist tools');
	pltools.AppendMenuItem(MF_STRING, 1, 'Playlist manager \tCtrl+M');
	pltools.AppendMenuItem(MF_STRING, 2, 'Playlist search \tCtrl+F');
	pltools.AppendMenuSeparator();
	pltools.AppendMenuItem(MF_STRING, 3, 'Create new playlist \tCtrl+N');
	autopl.AppendTo(pltools, MF_STRING, 'Create new auto playlist');
	autopl.AppendMenuItem(MF_STRING, 4, 'Custom auto playlist');
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 5, 'Tracks from the library');
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 6, 'Tracks most played');
	autopl.AppendMenuItem(MF_STRING, 7, 'Tracks never played');
	autopl.AppendMenuItem(MF_STRING, 8, 'Tracks played in the last week');
	autopl.AppendMenuItem(MF_STRING, 9, 'Tracks played in the last month');
	autopl.AppendMenuItem(MF_STRING, 10, 'Tracks played in the last year');
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 11, 'Tracks unrated');
	autopl.AppendMenuItem(MF_STRING, 12, 'Tracks rated 1 star');
	autopl.AppendMenuItem(MF_STRING, 13, 'Tracks rated 2 stars');
	autopl.AppendMenuItem(MF_STRING, 14, 'Tracks rated 3 stars');
	autopl.AppendMenuItem(MF_STRING, 15, 'Tracks rated 4 stars');
	autopl.AppendMenuItem(MF_STRING, 16, 'Tracks rated 5 stars');
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 17, 'Loved tracks');
	pltools.AppendMenuSeparator();
	pltools.AppendMenuItem(MF_STRING, 18, 'Save playlist \tCtrl+S');
	pltools.AppendMenuItem(MF_STRING, 19, 'Load playlist');
	pltools.AppendMenuItem(isAutoPl ? MF_DISABLED : MF_STRING, 20, isLocked ? isAutoPl ? 'Unlock playlist (N/A for auto playlists)' : 'Unlock playlist' : 'Lock playlist');
	cpm.AppendMenuSeparator();
	for (let i = 0; i !== playlist_count; i++) {
		cpm.AppendMenuItem(MF_STRING, playlistId + i, `${plman.GetPlaylistName(i).replace(/&/g, '&&')} [${plman.PlaylistItemCount(i)}]${plman.IsAutoPlaylist(i) ? ' (Auto)' : ''}${i === plman.PlayingPlaylist ? ' (Now Playing)' : ''}`);
	}

	const id = cpm.TrackPopupMenu(x, y);
	const playlist_idx = id - playlistId;

	switch (id) {
		case 1:
			fb.RunMainMenuCommand('View/Playlist Manager');
			break;
		case 2:
			fb.RunMainMenuCommand('View/Playlist search');
			break;
		case 3:
			plman.CreatePlaylist(playlist_count, '');
			plman.ActivePlaylist = playlist_count;
			break;
		case 4:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) New custom auto playlist', '', '', 0);
			plman.ActivePlaylist = playlist_count;
			plman.ShowAutoPlaylistUI(playlist_count);
			break;
		case 5:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks from the library', 'ALL', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 6:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks most played', '%play_count% GREATER 9', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 7:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks never played', '%play_count% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 8:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks played in the last week', '%last_played% DURING LAST 1 WEEK', '%last_played%', 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 9:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks played in the last month', '%last_played% DURING LAST 4 WEEKS', '%last_played%', 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 10:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks played in the last year', '%last_played% DURING LAST 52 WEEKS', '%last_played%', 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 11:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks unrated', '%rating% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 12:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 1', '%rating% IS 1', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 13:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 2', '%rating% IS 2', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 14:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 3', '%rating% IS 3', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 15:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 4', '%rating% IS 4', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 16:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Tracks rated 5', '%rating% IS 5', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 17:
			plman.CreateAutoPlaylist(playlist_count, '(Auto) Loved tracks', '%mood% GREATER 0', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.ActivePlaylist = playlist_count;
			break;
		case 18:
			fb.RunMainMenuCommand('File/Save playlist...');
			break;
		case 19:
			fb.RunMainMenuCommand('File/Load playlist...');
			break;
		case 20:
			if (plman.GetPlaylistLockName(plman.ActivePlaylist) && !isAutoPl) {
				plman.SetPlaylistLockedActions(plman.ActivePlaylist, null);
			} else if (!isAutoPl) {
				plman.SetPlaylistLockedActions(plman.ActivePlaylist, ['ExecuteDefaultAction']);
			}
			break;
	}

	if (playlist_idx < playlist_count && playlist_idx >= 0) {
		plman.ActivePlaylist = playlist_idx;
	}

	for (let i = 0; i !== playlist_count; i++) {
		if (id === (playlistId + i)) plman.ActivePlaylist = i; // Playlist switch
	}

	activeMenu = false;
	return true;
}


///////////////////////
// * TOP MENU HELP * //
///////////////////////
/**
 * Opens the main menu and handles different menu options based on the provided name.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {string} name The name of the menu.
 */
function onMainMenu(x, y, name) {
	mainMenuOpen = true;
	activeMenu = true;

	if (name) {
		const menu = new Menu(name);

		if (name === 'Help') {
			const themeMenu = new Menu('Theme');

			const statusMenu = new Menu('Status');
			statusMenu.addItem('All fonts installed', fontsInstalled, undefined, true);
			statusMenu.addItem('Artist logos found', IsFile(`${paths.artistlogos}Metallica.png`), undefined, true);
			statusMenu.addItem('Record label logos found', IsFile(`${paths.labelsBase}Republic.png`), undefined, true);
			statusMenu.addItem('Flag images found', IsFile(`${paths.flagsBase + (RES_4K ? '64\\' : '32\\')}United-States.png`), undefined, true);
			statusMenu.addItem('foo_enhanced_playcount installed', componentEnhancedPlaycount, () => { RunCmd('https://www.foobar2000.org/components/view/foo_enhanced_playcount'); });
			statusMenu.appendTo(themeMenu);

			const updatesMenu = new Menu('Updates');
			updatesMenu.addToggleItem('Auto-check for theme updates', pref, 'checkForUpdates', () => { scheduleUpdateCheck(1000); });
			updatesMenu.addItem('Check for latest theme update', false, () => { checkForUpdates(true); });
			updatesMenu.appendTo(themeMenu);

			themeMenu.addItem('Releases', false, () => { RunCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/releases'); });
			themeMenu.addItem('Changelog', false, () => { RunCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/blob/master/profile/georgia-reborn/docs/CHANGELOG.md'); });
			themeMenu.addItem('Bug tracker', false, () => { RunCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/issues'); });
			themeMenu.appendTo(menu);
		}
		menu.initFoobarMenu(name);

		const ret = menu.trackPopupMenu(x, y);
		menu.doCallback(ret);
	}

	activeMenu = false;
}


//////////////////////
// * BUTTON STATE * //
//////////////////////
/**
 * Displays the Playlist and Library side by side, called when Library layout is in split mode.
 * @param {boolean} control Limits the area to the width and height of the playlist panel.
 * @returns {boolean} True if Playlist and Library are being displayed.
 */
function displayPlaylistLibrary(control) {
	return pref.layout === 'default' && pref.libraryLayout === 'split' && displayLibrary && displayPlaylist &&
	(control ? state.mouse_x > playlist.x && state.mouse_x <= playlist.x + playlist.w &&
			   state.mouse_y > playlist.y && state.mouse_y <= playlist.y + playlist.h : ww);
}


/**
 * Initializes and sets the top menu button state.
 */
function initButtonState() {
	try {
		// These buttons do not exist in Compact layout
		if (pref.layout !== 'compact') {
			btns.details.enabled = false;
			btns.details.changeState(ButtonState.Default);
			btns.library.enabled = false;
			btns.library.changeState(ButtonState.Default);
			btns.biography.enabled = false;
			btns.biography.changeState(ButtonState.Default);
			btns.lyrics.enabled = false;
			btns.lyrics.changeState(ButtonState.Default);
		}
		if (pref.layout === 'artwork') {
			btns.playlistArtworkLayout.enabled = false;
			btns.playlistArtworkLayout.changeState(ButtonState.Default);
		}
		if (!displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics && pref.layout === 'default') {
			btns.details.enabled = true;
			btns.details.changeState(ButtonState.Down);
		}
		else if (displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics && pref.layout === 'artwork') {
			btns.details.enabled = true;
			btns.details.changeState(ButtonState.Down);
			if (displayPlaylistArtwork) {
				displayPlaylist = false;
				btns.details.enabled = false;
				btns.details.changeState(ButtonState.Default);
				btns.playlistArtworkLayout.enabled = true;
				btns.playlistArtworkLayout.changeState(ButtonState.Down);
			}
		}
		else if (displayPlaylistArtwork && !displayLibrary && !displayBiography && !pref.displayLyrics && pref.layout === 'artwork') {
			btns.playlistArtworkLayout.enabled = true;
			btns.playlistArtworkLayout.changeState(ButtonState.Down);
		}
		else if (displayLibrary) {
			if (!displayPlaylist || displayPlaylistLibrary()) { // Fixes active library button state when switching from Artwork layout to Default layout and pref.showPanelOnStartup === 'playlist' is active
				btns.library.enabled = true;
				btns.library.changeState(ButtonState.Down);
			}
		}
		else if (displayBiography) {
			btns.biography.enabled = true;
			btns.biography.changeState(ButtonState.Down);
		}
		if (pref.displayLyrics) {
			btns.lyrics.enabled = true;
			btns.lyrics.changeState(ButtonState.Down);
		}
		// For Control_ContextMenu -> Display/Hide lyrics
		if (pref.displayLyrics && !displayPlaylist && !displayLibrary && !displayBiography && pref.lyricsLayout === 'normal' && pref.layout === 'default') {
			btns.details.enabled = true;
			btns.details.changeState(ButtonState.Down);
		}
	} catch (e) {}
}


/**
 * Updates the play button image based on the current playback state.
 */
function updatePlayButton() {
	const showTransportControls = pref[`showTransportControls_${pref.layout}`];
	if (!showTransportControls) return;
	btns.play.img = !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause;
	btns.play.repaint();
}


/**
 * Updates the playback order button based on the current playback order.
 */
function updatePlaybackOrderButton() {
	const showTransportControls = pref[`showTransportControls_${pref.layout}`];
	if (!showTransportControls) return;

	switch (fb.PlaybackOrder) {
		case PlaybackOrder.Default:
			fb.RunMainMenuCommand('Playback/Order/Default');
			pref.playbackOrder = 'Default';
			btns.playbackOrder.img = btnImg.PlaybackDefault;
			break;
		case PlaybackOrder.RepeatTrack:
			fb.RunMainMenuCommand('Playback/Order/Repeat (track)');
			pref.playbackOrder = 'Repeat';
			btns.playbackOrder.img = btnImg.PlaybackReplay;
			break;
		case PlaybackOrder.ShuffleTracks:
			fb.RunMainMenuCommand('Playback/Order/Shuffle (tracks)');
			pref.playbackOrder = 'Shuffle';
			btns.playbackOrder.img = btnImg.PlaybackShuffle;
			break;
	}
	btns.playbackOrder.repaint();
}


/**
 * Returns a tooltip text based on the current playback order.
 * @returns {string} The playback order name as a tooltip.
 */
function playbackOrderTooltip() {
	switch (fb.PlaybackOrder) {
		case PlaybackOrder.Default:
			return 'Default';
		case PlaybackOrder.RepeatTrack:
		case PlaybackOrder.RepeatPlaylist:
			return 'Repeat';
		case PlaybackOrder.ShuffleTracks:
		case PlaybackOrder.ShuffleAlbums:
		case PlaybackOrder.ShuffleFolders:
		case PlaybackOrder.Random:
			return 'Shuffle';
		default:
			return 'Playback Order';
	}
}


/**
 * Controls the alpha values of buttons during different states (hover, down) and repaints them accordingly.
 */
function buttonAlphaTimer() {
	const trace = false;
	const buttonHoverInStep = 40;
	const buttonHoverOutStep = 15;
	const buttonDownInStep = 100;
	const buttonDownOutStep = 50;
	const buttonTimerDelay = 25;

	if (!buttonTimer) {
		buttonTimer = setInterval(() => {
			for (const i in activatedBtns) {
				switch (activatedBtns[i].state) {
					case 0:
						activatedBtns[i].hoverAlpha = Math.max(0, activatedBtns[i].hoverAlpha -= buttonHoverOutStep);
						activatedBtns[i].downAlpha = Math.max(0, activatedBtns[i].downAlpha -= Math.max(0, buttonDownOutStep));
						activatedBtns[i].repaint();
						break;
					case 1:
						activatedBtns[i].hoverAlpha = Math.min(255, activatedBtns[i].hoverAlpha += buttonHoverInStep);
						activatedBtns[i].downAlpha = Math.max(0, activatedBtns[i].downAlpha -= buttonDownOutStep);
						activatedBtns[i].repaint();
						break;
					case 2:
						activatedBtns[i].downAlpha = Math.min(255, activatedBtns[i].downAlpha += buttonDownInStep);
						activatedBtns[i].hoverAlpha = Math.max(0, activatedBtns[i].hoverAlpha -= buttonDownInStep);
						activatedBtns[i].repaint();
						break;
				}
			}

			// Test button alpha values and turn button timer off when it's not required;
			for (let i = activatedBtns.length - 1; i >= 0; i--) {
				if ((!activatedBtns[i].hoverAlpha && !activatedBtns[i].downAlpha) ||
					activatedBtns[i].hoverAlpha === 255 || activatedBtns[i].downAlpha === 255) {
					activatedBtns.splice(i, 1);
				}
			}

			if (!activatedBtns.length) {
				clearInterval(buttonTimer);
				buttonTimer = null;
				trace && console.log('buttonTimerStarted = false');
			}
		}, buttonTimerDelay);

		trace && console.log('buttonTimerStarted = true');
	}
}
