/** @type {Button} */
let oldButton;
/** @type {Button} */
let downButton;
var buttonTimer = null;
var mainMenuOpen = false;

/** @type {Button} */
let lastOverButton = null;

/** @type {Button[]} */
let activatedBtns = [];

const ButtonState = {
	Default: 0,
	Hovered: 1,
	Down: 2,	// happens on click
	Enabled: 3
}

var mouseInControl = false;

function buttonEventHandler(x, y, m) {

	// var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	// var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	var c = qwr_utils.caller();

	/** @type {Button} */
	let thisButton = null;

	mouseInControl = false;

	for (var i in btns) {
		if (typeof btns[i] === 'object' && btns[i].mouseInThis(x, y)) {
			mouseInControl = true;
			thisButton = btns[i];
			break;
		}
	}
	if (lastOverButton != thisButton) {
		tt.stop();
	}
	lastOverButton = thisButton;

	switch (c) {

		case 'on_mouse_move':
			if (downButton) return;

			if (oldButton && oldButton != thisButton) {
				oldButton.changeState(oldButton.enabled ? ButtonState.Enabled : ButtonState.Default);
			}
			if (thisButton && thisButton != oldButton) {
				thisButton.changeState(ButtonState.Hovered);
			}

			if (pref.show_tt) {
				if (lastOverButton) {
					if (lastOverButton.tooltip) {
						tt.showDelayed(lastOverButton.tooltip);
					} else if (lastOverButton.id === 'Volume' && !volume_btn.show_volume_bar) {
						tt.showDelayed(fb.Volume.toFixed(2) + ' dB');
					} else if (lastOverButton.id === 'PlaybackOrder') {
						tt.showDelayed(playbackOrder_tt());
					}
				}
			}

			oldButton = thisButton;
			break;

		case 'on_mouse_lbtn_dblclk':
			if (thisButton) {
				thisButton.changeState(ButtonState.Down);
				downButton = thisButton;
				downButton.onDblClick();
			}
			break;

		case 'on_mouse_lbtn_down':
			if (thisButton) {
				thisButton.changeState(ButtonState.Down);
				downButton = thisButton;
			}
			break;

		case 'on_mouse_lbtn_up':
			if (downButton) {
				downButton.onClick();

				if (mainMenuOpen) {
					thisButton = undefined;
					mainMenuOpen = false;
				}
				if (thisButton) {
					thisButton.changeState(thisButton.enabled ? ButtonState.Enabled : ButtonState.Hovered);
				} else {
					downButton.changeState(downButton.enabled ? ButtonState.Enabled : ButtonState.Default);
				}
				// thisButton ? thisButton.changeState(ButtonState.Hovered) : downButton.changeState(ButtonState.Default);

				downButton = undefined;
			}
			break;

		case 'on_mouse_leave':
			oldButton = undefined;
			if (downButton) return; // for menu buttons

			for (var i in btns) {
				if (btns[i].state != 0) {
					btns[i].changeState(ButtonState.Default);
				}
			}
			break;
	}
	return thisButton !== null;
}

// =================================================== //
const WindowState = {
	Normal: 0,
	Minimized: 1,
	Maximized: 2
}

class Button {
	constructor(x, y, w, h, id, img, tip = undefined) {
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
		this.enabled = false;
	}

	mouseInThis(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}

	set enable(val) {
		this.enabled = val;
		if (!val) {
			this.changeState(ButtonState.Default);
		} else {
			this.changeState(ButtonState.Enabled);
		}
	}

	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	changeState(state) {
		this.state = state;
		activatedBtns.push(this);
		buttonAlphaTimer();
	}

	onClick() {
		btnActionHandler(this); // really just need id and x, y, w
	}

	onDblClick() {
		// we don't do anything with dblClick currently
	}
}

/**
 * @param {Button} btn
 */
function btnActionHandler(btn) {
	switch (btn.id) {
		case 'Stop':
			fb.Stop();
			if ((!displayPlaylist || displayLibrary || displayBiography || pref.displayLyrics) && pref.startPlaylist) {
				playlist.on_size(ww, wh);
				displayPlaylist = true;
				displayLibrary = false;
				displayBiography = false;
				btns.playlist.enable = false;
				btns.library.enable = false;
				btns.biography.enable = false;
				btns.lyrics.enable = false;
				pref.displayLyrics = false;
			}
			break;
		case 'Previous':
			fb.Prev();
			break;
		case 'Play/Pause':
			fb.PlayOrPause();
			if (pref.layout_mode === 'artwork_mode') {
				displayPlaylist = false;
			}
			break;
		case 'Next':
			fb.Next();
			break;
		case 'PlaybackOrder':
			if (plman.PlaybackOrder === 0) {
				fb.PlaybackOrder = PlaybackOrder.RepeatTrack;
			}
			else if (plman.PlaybackOrder === 2) {
				fb.PlaybackOrder = PlaybackOrder.ShuffleTracks;
			}
			else if (plman.PlaybackOrder === 4) {
				fb.PlaybackOrder = PlaybackOrder.Default;
			}
			else {
				fb.PlaybackOrder = PlaybackOrder.RepeatTrack;
			}
			refreshPlaybackOrderButton();
			break;
		case 'Volume':
			if (pref.autoHideVolumeBar) {
				volume_btn.toggleVolumeBar();
			} else {
				fb.VolumeMute();
			}
			break;
		case 'Reload':
			window.Reload();
			break;
		case 'PlaybackTime':
			pref.switchPlaybackTime = !pref.switchPlaybackTime;
			if (pref.switchPlaybackTime) {
				str.time = $('-%playback_time_remaining%');
			} else {
				str.time = $('%playback_time%');
			}
			window.Repaint();
			break;
		case 'Console':
			fb.RunMainMenuCommand("View/Console");
			break;
		case 'Minimize':
			fb.RunMainMenuCommand("View/Hide");
			break;
		case 'Maximize':
			const maximizeToFullScreen = true; // TODO to clear the error. Test this stuff eventually
			if (maximizeToFullScreen ? !utils.IsKeyPressed(VK_CONTROL) : utils.IsKeyPressed(VK_CONTROL)) {
				UIHacks.FullScreen = !UIHacks.FullScreen;
			} else {
				if (UIHacks.MainWindowState == WindowState.Maximized)
					UIHacks.MainWindowState = WindowState.Normal;
				else
					UIHacks.MainWindowState = WindowState.Maximized;
			}
			break;
		case 'Close':
			fb.Exit();
			break;
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
		case 'Options':
			onOptionsMenu(btn.x, btn.y + btn.h);
			break;
		case 'Repeat':
			var pbo = fb.PlaybackOrder;
			if (pbo == PlaybackOrder.Default) {
				fb.PlaybackOrder = PlaybackOrder.RepeatPlaylist;
			}
			else if (pbo == PlaybackOrder.RepeatPlaylist) {
				fb.PlaybackOrder = PlaybackOrder.RepeatTrack;
			}
			else if (pbo == PlaybackOrder.RepeatTrack) {
				fb.PlaybackOrder = PlaybackOrder.Default;
			}
			else {
				fb.PlaybackOrder = PlaybackOrder.RepeatPlaylist;
			}
			break;
		case 'Shuffle':
			var pbo = fb.PlaybackOrder;
			if (pbo != PlaybackOrder.ShuffleTracks) {
				fb.PlaybackOrder = PlaybackOrder.ShuffleTracks;
			} else {
				fb.PlaybackOrder = PlaybackOrder.Default;
			}
			break;
		case 'Mute':
			fb.VolumeMute();
			break;
		case 'Settings':
			fb.ShowPreferences();
			break;
		case 'Properties':
			fb.RunContextCommand("Properties");
			break;
		case 'Rating':
			onRatingMenu(btn.x, btn.y + btn.h);
			break;
		case 'Lyrics':
			pref.displayLyrics = !pref.displayLyrics;
			btn.enable = pref.displayLyrics;
			if (fb.IsPlaying && (albumart_scaled || noAlbumArtStub)) {
				if (pref.displayLyrics) {
					initLyrics();
					playlist.on_size(ww, wh);
					displayBiography = false;
					displayLibrary = false;
					if (pref.always_showPlayingPl) {
						playlist.on_playback_new_track();
					}
					if (pref.startPlaylist) {
						btns.playlist.enable = false;
					}
					if (pref.layout_mode === 'artwork_mode') {
						btns.playlist.enable = false;
						btns.playlistArtworkMode.enable = false;
						displayPlaylistArtworkMode = false;
						ResizeArtwork(true);
					}
				} else {
					if (pref.layout_mode === 'artwork_mode') {
						displayPlaylist = false;
						ResizeArtwork(true);
					}
				}
				if (!displayPlaylist && pref.startPlaylist && pref.layout_mode !== 'artwork_mode') {
					displayPlaylist = true;
					ResizeArtwork(false);
				}
				if (pref.always_showPlaying) {
					playlist.on_size(ww, wh);
				}
				if (displayPlaylist && pref.layout_mode === 'artwork_mode') displayPlaylist = !displayPlaylist;

				window.RepaintRect(albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h);
			}
			btn.repaint();
			if (pref.layout_mode === 'default_mode' || pref.layout_mode === 'artwork_mode') {
				btns.biography.enable = false;
				btns.library.enable = false;
			}
			window.Repaint();
			break;
		case 'ShowLibrary':
			displayLibrary = !displayLibrary;
			if (displayLibrary) {
				pref.displayLyrics = false;
				if (pref.layout_mode !== 'artwork_mode') {
					displayPlaylist = true;
				}
				if (pref.layout_mode === 'artwork_mode') {
					displayPlaylistArtworkMode = false;
					displayBiography = false;
					ResizeArtwork(true);
				}
			} else {
				if (pref.layout_mode === 'artwork_mode') {
					ResizeArtwork(true);
				}
			}
			if (displayPlaylist) {
				displayBiography = false;
				displayPlaylist = false;
				displayLibrary = true;
				ResizeArtwork(false);
			} else {
				if (pref.layout_mode !== 'artwork_mode') {
					playlist.on_size(ww, wh);
					displayPlaylist = true;
					ResizeArtwork(false);
				}
			}
			if (pref.layout_mode === 'default_mode' || pref.layout_mode === 'artwork_mode') {
				setupRotationTimer();	// clear or start cdRotation if required
				btn.enable = displayLibrary;
				btns.biography.enable = false;
				btns.lyrics.enable = false;
				btns.playlist.enable = false;
				if (pref.layout_mode === 'artwork_mode') {
					btns.playlistArtworkMode.enable = false;
				}
			}
			if (pref.always_showPlayingLib) {
				lib.treeState(false, 2); // Update library nowPlaying if song was played from Playlist
				pop.nowPlayingShow();
			}
			window.Repaint();
			break;
		case 'Playlist':
			displayPlaylist = !displayPlaylist;
			if (displayPlaylist) {
				if (pref.playlistRowHover) repaintPlaylistRows();

				if (pref.layout_mode !== 'artwork_mode') {
					playlist.on_size(ww, wh);
				}
				if (pref.layout_mode === 'artwork_mode') {
					displayPlaylistArtworkMode = false;
					playlist.on_size(0, 0); // Disable hidden playlist ( drag and drop function ) from displayPlaylistArtworkMode in Details
					pref.displayLyrics = false;
					ResizeArtwork(true);
				}
			} else {
				pref.displayLyrics = false;
				if (pref.layout_mode === 'artwork_mode') {
					ResizeArtwork(true);
				}
			}
			if (displayLibrary) {
				displayLibrary = false;
				if (pref.layout_mode !== 'artwork_mode') {
					displayPlaylist = !displayPlaylist;
					ResizeArtwork(false);
				}
			} else {
				displayBiography = false;
				ResizeArtwork(false);
			}
			if (pref.layout_mode === 'default_mode') {
				setupRotationTimer();	// clear or start cdRotation if required
				btn.enable = !displayPlaylist;
				btns.biography.enable = false;
				btns.library.enable = false;
				btns.lyrics.enable = false;
			}
			if (pref.layout_mode === 'artwork_mode') {
				setupRotationTimer();	// clear or start cdRotation if required
				btn.enable = displayPlaylist;
				btns.playlistArtworkMode.enable = false;
				btns.biography.enable = false;
				btns.library.enable = false;
				btns.lyrics.enable = false;
			}
			window.Repaint();
			break;
		case 'playlistArtworkMode':
			displayPlaylistArtworkMode = !displayPlaylistArtworkMode;
			if (displayPlaylistArtworkMode) {
				if (pref.playlistRowHover) repaintPlaylistRows();
				playlist.on_size(ww, wh);
				displayPlaylist = false;
				displayLibrary = false;
				pref.displayLyrics = false;
			} else {
				if (pref.layout_mode === 'artwork_mode') {
					displayPlaylistArtworkMode = false;
					ResizeArtwork(true);
				}
			}
			if (displayLibrary) {
				displayLibrary = true;
				displayPlaylistArtworkMode = !displayPlaylistArtworkMode;
				ResizeArtwork(false);
			} else {
				displayBiography = false;
				ResizeArtwork(false);
			}
			if (pref.layout_mode === 'artwork_mode') {
				setupRotationTimer();	// clear or start cdRotation if required
				btn.enable = displayPlaylistArtworkMode;
				btns.playlist.enable = false;
				btns.biography.enable = false;
				btns.library.enable = false;
				btns.lyrics.enable = false;
			}
			window.Repaint();
			break;
		case 'Biography':
			displayBiography = !displayBiography;
			if (fb.IsPlaying) {
				if (displayBiography) {
					if (pref.layout_mode !== 'artwork_mode') {
						playlist.on_size(ww, wh);
					}
					biography.on_playback_new_track();
					displayLibrary = false;
					pref.displayLyrics = false;
					if (pref.layout_mode === 'artwork_mode') {
						displayPlaylistArtworkMode = false;
					} else {
						displayPlaylist = true;
					}
				} else {
					displayBiography = false;
					if (pref.layout_mode === 'artwork_mode') {
						ResizeArtwork(true);
					}
				}
				if (displayLibrary) {
					displayLibrary = false;
				} else {
					if (pref.layout_mode === 'artwork_mode') {
						displayPlaylist = false;
					} else {
						displayPlaylist = true;
						ResizeArtwork(false);
					}
				}
			}
			else if (!fb.IsPlaying) {
				displayBiography = false;
			}
			if (pref.layout_mode === 'default_mode' || pref.layout_mode === 'artwork_mode') {
				btn.enable = displayBiography;
				btns.library.enable = false;
				btns.lyrics.enable = false;
				btns.playlist.enable = false;
				if (pref.layout_mode === 'artwork_mode') {
					btns.playlistArtworkMode.enable = false;
				}
			}
			window.Repaint();
			break;
	}
}

function onPlaylistsMenu(x, y) {

	mainMenuOpen = true;
	menu_down = true;
	var playlist_count = plman.PlaylistCount;
	var playlistId = 21;
	var cpm = window.CreatePopupMenu();
	var pltools = window.CreatePopupMenu();
	var autopl = window.CreatePopupMenu();
	pltools.AppendTo(cpm, MF_STRING, "Playlist tools");
	pltools.AppendMenuItem(MF_STRING, 1, 'Playlist manager \tCtrl+M');
	pltools.AppendMenuItem(MF_STRING, 2, 'Playlist search \tCtrl+F');
	pltools.AppendMenuSeparator();
	pltools.AppendMenuItem(MF_STRING, 3, 'Create new playlist \tCtrl+N');
	autopl.AppendTo(pltools, MF_STRING, "Create new auto playlist");
	autopl.AppendMenuItem(MF_STRING, 4, "Custom auto playlist");
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 5, "Tracks from the library");
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 6, "Tracks most played");
	autopl.AppendMenuItem(MF_STRING, 7, "Tracks never played");
	autopl.AppendMenuItem(MF_STRING, 8, "Tracks played in the last week");
	autopl.AppendMenuItem(MF_STRING, 9, "Tracks played in the last month");
	autopl.AppendMenuItem(MF_STRING, 10, "Tracks played in the last year");
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 11, "Tracks unrated");
	autopl.AppendMenuItem(MF_STRING, 12, "Tracks rated 1 star");
	autopl.AppendMenuItem(MF_STRING, 13, "Tracks rated 2 stars");
	autopl.AppendMenuItem(MF_STRING, 14, "Tracks rated 3 stars");
	autopl.AppendMenuItem(MF_STRING, 15, "Tracks rated 4 stars");
	autopl.AppendMenuItem(MF_STRING, 16, "Tracks rated 5 stars");
	autopl.AppendMenuSeparator();
	autopl.AppendMenuItem(MF_STRING, 17, "Loved tracks");
	pltools.AppendMenuSeparator();
	pltools.AppendMenuItem(MF_STRING, 18, 'Save playlist \tCtrl+S');
	pltools.AppendMenuItem(MF_STRING, 19, 'Load playlist');
	if (g_component_utils) {
		pltools.AppendMenuSeparator();
		pltools.AppendMenuItem(MF_STRING, 20, 'Lock current playlist');
		pltools.CheckMenuItem(20, plman.IsPlaylistLocked(plman.ActivePlaylist));
	}
	cpm.AppendMenuSeparator();
	for (var i = 0; i != playlist_count; i++) {
		cpm.AppendMenuItem(MF_STRING, playlistId + i, plman.GetPlaylistName(i).replace(/\&/g, '&&') + ' [' + plman.PlaylistItemCount(i) + ']' + (plman.IsAutoPlaylist(i) ? ' (Auto)' : '') + (i === plman.PlayingPlaylist ? ' (Now Playing)' : ''));
	}

	var id = cpm.TrackPopupMenu(x, y);
	switch (id) {
		case 1:
			fb.RunMainMenuCommand('View/Playlist Manager');
			break;
		case 2:
			fb.RunMainMenuCommand("View/Playlist search");
			break;
		case 3:
			plman.CreatePlaylist(playlist_count, '');
			plman.ActivePlaylist = plman.PlaylistCount - 1;
			break;
		case 4:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) New custom auto playlist", "", "", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			plman.ShowAutoPlaylistUI(playlist_idx);
			break;
		case 5:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks from the library", "ALL", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 6:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks most played", "%play_count% GREATER 9", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 7:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks never played", "%play_count% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 8:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last week", "%last_played% DURING LAST 1 WEEK", "%last_played%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 9:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last month", "%last_played% DURING LAST 4 WEEKS", "%last_played%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 10:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks played in the last year", "%last_played% DURING LAST 52 WEEKS", "%last_played%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 11:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks unrated", "%rating% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 12:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 1", "%rating% IS 1", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 13:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 2", "%rating% IS 2", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 14:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 3", "%rating% IS 3", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 15:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 4", "%rating% IS 4", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 16:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Tracks rated 5", "%rating% IS 5", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 17:
			plman.CreateAutoPlaylist(playlist_count, "(Auto) Loved tracks", "%mood% GREATER 0", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(playlist_count, playlist_idx);
			plman.ActivePlaylist = playlist_idx;
			break;
		case 18:
			fb.RunMainMenuCommand('File/Save playlist...');
			break;
		case 19:
			fb.RunMainMenuCommand('File/Load playlist...');
			break;
		case 20:
			fb.RunMainMenuCommand('Edit/Read-only');
			break;
	}
	var playlist_idx = id - playlistId;
	if (playlist_idx < playlist_count && playlist_idx >= 0) {
		plman.ActivePlaylist = playlist_idx;
	}
	for (var i = 0; i != playlist_count; i++) {
		if (id == (playlistId + i)) plman.ActivePlaylist = i; // playlist switch
	}
	menu_down = false;
	return true;
}
// =================================================== //

function onMainMenu(x, y, name) {

	mainMenuOpen = true;
	menu_down = true;

	if (name) {
		var menu = new Menu(name);

		if (name === 'Help') {
			var statusMenu = new Menu('Georgia-ReBORN theme status');

			statusMenu.addItem('All fonts installed', fontsInstalled, undefined, true);
			statusMenu.addItem('Artist logos found', IsFile(paths.artistlogos + 'Metallica.png'), undefined, true);
			statusMenu.addItem('Record label logos found', IsFile(paths.labelsBase + 'Republic.png'), undefined, true);
			statusMenu.addItem('Flag images found', IsFile(paths.flagsBase + (is_4k ? '64\\' : '32\\') + 'United-States.png'), undefined, true);
			statusMenu.addItem('foo_enhanced_playcount installed', componentEnhancedPlaycount, function() { _.runCmd('https://www.foobar2000.org/components/view/foo_enhanced_playcount') });

			statusMenu.appendTo(menu);

			menu.addItem('Georgia-ReBORN releases', false, function() { _.runCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/releases') });
			menu.addItem('Georgia-ReBORN changelog', false, function() { _.runCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/blob/master/profile/georgia-reborn/changelog.md') });
			var updatesMenu = new Menu('Georgia-ReBORN updates');
			updatesMenu.addToggleItem('Check for theme updates', pref, 'checkForUpdates', () => { scheduleUpdateCheck(1000) });
			updatesMenu.addItem('Check for updated version of Georgia-ReBORN', false, function() { checkForUpdates(true); });
			updatesMenu.appendTo(menu);
			menu.addItem('Georgia-ReBORN bug tracker', false, function() { _.runCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/issues') });
		}
		menu.initFoobarMenu(name);

		var ret = menu.trackPopupMenu(x, y);
		menu.doCallback(ret);
	}

	menu_down = false;

}
// =================================================== //

function refreshPlayButton() {
	if (transport.enableTransportControls_default && pref.layout_mode === 'default_mode' || transport.enableTransportControls_artwork && pref.layout_mode === 'artwork_mode' || transport.enableTransportControls_compact && pref.layout_mode === 'compact_mode') {
		btns.play.img = !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause;
		btns.play.repaint();
	}
}

function refreshPlaybackOrderButton() {
	var pbo = fb.PlaybackOrder;
	if (transport.enableTransportControls_default && pref.layout_mode === 'default_mode' || transport.enableTransportControls_artwork && pref.layout_mode === 'artwork_mode' || transport.enableTransportControls_compact && pref.layout_mode === 'compact_mode') {
		if (pbo === PlaybackOrder.Default) {
			fb.RunMainMenuCommand('Playback/Order/Default');
			pref.playbackOrder = 'Default';
			btns.playbackOrder.img = btnImg.PlaybackDefault;
		}
		if (pbo === PlaybackOrder.RepeatTrack) {
			fb.RunMainMenuCommand('Playback/Order/Repeat (track)');
			pref.playbackOrder = 'Repeat';
			btns.playbackOrder.img = btnImg.PlaybackReplay;
		}
		if (pbo === PlaybackOrder.ShuffleTracks) {
			fb.RunMainMenuCommand('Playback/Order/Shuffle (tracks)');
			pref.playbackOrder = 'Shuffle';
			btns.playbackOrder.img = btnImg.PlaybackShuffle;
		}
		btns.playbackOrder.repaint();
	}
}

function playbackOrder_tt() {
	var pbo = fb.PlaybackOrder;
	if (pbo === PlaybackOrder.Default) {
		tiptext = 'Default';
	} else if (pbo === PlaybackOrder.RepeatTrack || pbo === PlaybackOrder.RepeatPlaylist){
		tiptext = 'Repeat';
	} else if (pbo === PlaybackOrder.ShuffleTracks || pbo === PlaybackOrder.ShuffleAlbums || pbo === PlaybackOrder.ShuffleFolders || pbo === PlaybackOrder.Random) {
		tiptext = 'Shuffle';
	} else {
		tiptext = 'Playback Order';
	}
	return tiptext;
}

// =================================================== //
function buttonAlphaTimer() {

	var trace = false;

	var buttonHoverInStep = 40,
		buttonHoverOutStep = 15,
		buttonDownInStep = 100,
		buttonDownOutStep = 50,
		buttonTimerDelay = 25;

	if (!buttonTimer) {

		buttonTimer = setInterval(() => {

			for (var i in activatedBtns) {
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

			//---> Test button alpha values and turn button timer off when it's not required;
			for (let i = activatedBtns.length - 1; i >= 0; i--) {
				if ((!activatedBtns[i].hoverAlpha && !activatedBtns[i].downAlpha) ||
					activatedBtns[i].hoverAlpha === 255 || activatedBtns[i].downAlpha === 255) {
					activatedBtns.splice(i, 1);
				}
			}

			if (!activatedBtns.length) {
				clearInterval(buttonTimer);
				buttonTimer = null;
				trace && console.log("buttonTimerStarted = false");
			}

		}, buttonTimerDelay);

		trace && console.log("buttonTimerStarted = true");
	}
}
