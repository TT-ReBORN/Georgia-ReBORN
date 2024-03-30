/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Menu                                     * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    30-03-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////
// * TOP MENU * //
//////////////////
/**
 * A class that creates and handles all top menus in the top navigation bar.
 */
class TopMenu {
	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Opens the main menu and handles different menu options based on the provided name.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} name - The name of the menu.
	 */
	topMenuMain(x, y, name) {
		grm.button.mainMenuOpen = true;
		grm.ui.activeMenu = true;

		if (name) {
			const menu = new Menu(name);

			if (name === 'Help') {
				const themeMenu = new Menu('Theme');

				const statusMenu = new Menu('Status');
				statusMenu.addItem('All fonts installed', grm.ui.initFonts(), undefined, true);
				statusMenu.addItem('Artist logos found', IsFile(`${grPath.artistlogos}Metallica.png`), undefined, true);
				statusMenu.addItem('Record label logos found', IsFile(`${grPath.labelsBase}Republic.png`), undefined, true);
				statusMenu.addItem('Flag images found', IsFile(`${grPath.flagsBase + (RES._4K ? '64\\' : '32\\')}United-States.png`), undefined, true);
				statusMenu.addItem('foo_enhanced_playcount installed', Component.EnhancedPlaycount, () => { RunCmd('https://www.foobar2000.org/components/view/foo_enhanced_playcount'); });
				statusMenu.appendTo(themeMenu);

				const updatesMenu = new Menu('Updates');
				updatesMenu.addToggleItem('Auto-check for theme updates', grSet, 'checkForUpdates', () => { grCfg.scheduleUpdateCheck(1000); });
				updatesMenu.addItem('Check for latest theme update', false, () => { grCfg.checkForUpdates(true); });
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

		grm.ui.activeMenu = false;
	}

	/**
	 * Creates a context menu for playlists allowing users to perform various actions such as
	 * creating new playlists, saving and loading playlists, locking and unlocking playlists,
	 * and creating auto playlists based on different criteria.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	topMenuPlaylists(x, y) {
		grm.button.mainMenuOpen = true;
		grm.ui.activeMenu = true;

		const playlistId = 21;
		const playlistCount = plman.PlaylistCount;
		const cpm = window.CreatePopupMenu();
		const plTools = window.CreatePopupMenu();
		const autoPl = window.CreatePopupMenu();
		const isAutoPl = !playlistCount ? '' : plman.IsAutoPlaylist(plman.ActivePlaylist);
		const isLocked = !playlistCount ? '' : plman.IsPlaylistLocked(plman.ActivePlaylist);

		plTools.AppendTo(cpm, MF_STRING, 'Playlist tools');
		plTools.AppendMenuItem(MF_STRING, 1, 'Playlist manager \tCtrl+M');
		plTools.AppendMenuItem(MF_STRING, 2, 'Playlist search \tCtrl+F');
		plTools.AppendMenuSeparator();
		plTools.AppendMenuItem(MF_STRING, 3, 'Create new playlist \tCtrl+N');
		autoPl.AppendTo(plTools, MF_STRING, 'Create new auto playlist');
		autoPl.AppendMenuItem(MF_STRING, 4, 'Custom auto playlist');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MF_STRING, 5, 'Tracks from the library');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MF_STRING, 6, 'Tracks most played');
		autoPl.AppendMenuItem(MF_STRING, 7, 'Tracks never played');
		autoPl.AppendMenuItem(MF_STRING, 8, 'Tracks played in the last week');
		autoPl.AppendMenuItem(MF_STRING, 9, 'Tracks played in the last month');
		autoPl.AppendMenuItem(MF_STRING, 10, 'Tracks played in the last year');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MF_STRING, 11, 'Tracks unrated');
		autoPl.AppendMenuItem(MF_STRING, 12, 'Tracks rated 1 star');
		autoPl.AppendMenuItem(MF_STRING, 13, 'Tracks rated 2 stars');
		autoPl.AppendMenuItem(MF_STRING, 14, 'Tracks rated 3 stars');
		autoPl.AppendMenuItem(MF_STRING, 15, 'Tracks rated 4 stars');
		autoPl.AppendMenuItem(MF_STRING, 16, 'Tracks rated 5 stars');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MF_STRING, 17, 'Loved tracks');
		plTools.AppendMenuSeparator();
		plTools.AppendMenuItem(MF_STRING, 18, 'Save playlist \tCtrl+S');
		plTools.AppendMenuItem(MF_STRING, 19, 'Load playlist');
		plTools.AppendMenuItem(isAutoPl ? MF_DISABLED : MF_STRING, 20, isLocked ? isAutoPl ? 'Unlock playlist (N/A for auto playlists)' : 'Unlock playlist' : 'Lock playlist');
		cpm.AppendMenuSeparator();
		for (let i = 0; i < playlistCount; i++) {
			cpm.AppendMenuItem(MF_STRING, playlistId + i, `${plman.GetPlaylistName(i).replace(/&/g, '&&')} [${plman.PlaylistItemCount(i)}]${plman.IsAutoPlaylist(i) ? ' (Auto)' : ''}${i === plman.PlayingPlaylist ? ' (Now Playing)' : ''}`);
		}

		const id = cpm.TrackPopupMenu(x, y);
		const playlistIdx = id - playlistId;

		switch (id) {
			case 1:
				fb.RunMainMenuCommand('View/Playlist Manager');
				break;
			case 2:
				fb.RunMainMenuCommand('View/Playlist search');
				break;
			case 3:
				plman.CreatePlaylist(playlistCount, '');
				plman.ActivePlaylist = playlistCount;
				break;
			case 4:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) New custom auto playlist', '', '', 0);
				plman.ActivePlaylist = playlistCount;
				plman.ShowAutoPlaylistUI(playlistCount);
				break;
			case 5:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks from the library', 'ALL', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 6:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks most played', '%play_count% GREATER 9', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 7:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks never played', '%play_count% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 8:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks played in the last week', '%last_played% DURING LAST 1 WEEK', '%last_played%', 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 9:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks played in the last month', '%last_played% DURING LAST 4 WEEKS', '%last_played%', 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 10:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks played in the last year', '%last_played% DURING LAST 52 WEEKS', '%last_played%', 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 11:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks unrated', '%rating% MISSING', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 12:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 1', '%rating% IS 1', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 13:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 2', '%rating% IS 2', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 14:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 3', '%rating% IS 3', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 15:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 4', '%rating% IS 4', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 16:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Tracks rated 5', '%rating% IS 5', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
				break;
			case 17:
				plman.CreateAutoPlaylist(playlistCount, '(Auto) Loved tracks', '%mood% GREATER 0', "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
				plman.ActivePlaylist = playlistCount;
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

		if (playlistIdx < playlistCount && playlistIdx >= 0) {
			plman.ActivePlaylist = playlistIdx;
		}

		for (let i = 0; i < playlistCount; i++) {
			if (id === (playlistId + i)) plman.ActivePlaylist = i; // Playlist switch
		}

		grm.ui.activeMenu = false;
		return true;
	}

	/**
	 * All top menus, also used to append menus in panel context menus.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {boolean} context_menu - Appends panel related menus to the context menu.
	 * @param {boolean} playlist - Appends main Playlist menu to the Playlist context menu.
	 * @param {boolean} details - Appends main Details menu to the Details context menu.
	 * @param {boolean} library - Appends main Library menu to the Library context menu.
	 * @param {boolean} biography - Appends main Biography menu to the Biography context menu.
	 * @param {boolean} lyrics - Appends main Lyrics menu to the Lyrics context menu.
	 */
	topMenuOptions(x, y, context_menu, playlist, details, library, biography, lyrics) {
		grm.ui.activeMenu = true;
		grm.ui.state.mouse_x = x;
		grm.ui.state.mouse_y = y;
		const menu = new Menu();
		const themeDayNightSetup = grSet.themeSetupDay || grSet.themeSetupNight;

		if (!context_menu) {
			grm.options.themeOptions(menu);
			grm.options.styleOptions(menu);
			grm.options.presetOptions(menu);

			if (!themeDayNightSetup) {
				grm.options.playerSizeOptions(menu);
				grm.options.layoutOptions(menu);
				grm.options.displayOptions(menu);
			}

			grm.options.brightnessOptions(menu);

			if (!themeDayNightSetup) {
				grm.options.fontSizeOptions(menu);
				menu.addSeparator();
				grm.options.playerControlsOptions(menu);
				menu.addSeparator();
				grm.options.playlistOptions(menu);

				if (grSet.layout !== 'compact') {
					grm.options.detailsOptions(menu);
					grm.options.libraryOptions(menu);
					grm.options.biographyOptions(menu);
					grm.options.lyricsOptions(menu);
				}
			}

			menu.addSeparator();
			grm.options.settingsOptions(menu);

			if (grSet.devTools) {
				menu.addSeparator();
				grm.options.developerToolsOptions(menu);
			}
		}
		else if (playlist) grm.options.playlistOptions(menu, context_menu);
		else if (details) grm.options.detailsOptions(menu, context_menu);
		else if (library) grm.options.libraryOptions(menu, context_menu);
		else if (biography) grm.options.biographyOptions(menu, context_menu);
		else if (lyrics) grm.options.lyricsOptions(menu, context_menu);

		const idx = menu.trackPopupMenu(x, y);
		menu.doCallback(idx);
		grm.ui.activeMenu = false;
	}
	// #endregion
}


////////////////////////////
// * TOP MENU - OPTIONS * //
////////////////////////////
/**
 * A class that provides the full collection of all menus in the `Options` top navigation menu.
 */
class TopMenuOptions {
	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Top menu > Options > Theme.
	 * @param {Menu} menu - Creates the Theme menu via a new Menu instance.
	 * @protected
	 */
	themeOptions(menu) {
		const themeMenu = new Menu('Theme');
		themeMenu.addRadioItems(['White', 'Black', 'Reborn', 'Random', 'Blue', 'Dark blue', 'Red', 'Cream', 'Neon blue', 'Neon green', 'Neon red', 'Neon gold'], grSet.theme,
			['white', 'black', 'reborn', 'random', 'blue', 'darkblue', 'red', 'cream', 'nblue', 'ngreen', 'nred', 'ngold'], theme => {
			if (!grSet.themeSandbox) grSet.savedTheme = grSet.theme = theme; else grSet.theme = theme;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.resetTheme();
			grm.ui.initTheme();
			grm.ui.createDiscArtShadow();
			grm.preset.initThemePresetState();
		}, false, false, [3, 7]);
		themeMenu.addSeparator();

		// * CUSTOM THEME * //
		const customThemeMenu = new Menu('Custom');
		const customThemeName = [
			grCfg.customTheme01.name || 'Theme 01',
			grCfg.customTheme02.name || 'Theme 02',
			grCfg.customTheme03.name || 'Theme 03',
			grCfg.customTheme04.name || 'Theme 04',
			grCfg.customTheme05.name || 'Theme 05',
			grCfg.customTheme06.name || 'Theme 06',
			grCfg.customTheme07.name || 'Theme 07',
			grCfg.customTheme08.name || 'Theme 08',
			grCfg.customTheme09.name || 'Theme 09',
			grCfg.customTheme10.name || 'Theme 10'
		];

		customThemeMenu.addRadioItems(customThemeName, grSet.theme, ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'], (theme) => {
			if (!grSet.themeSandbox) grSet.savedTheme = grSet.theme = theme; else grSet.theme = theme;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.resetTheme();
			grm.ui.initCustomTheme();
			grm.ui.initTheme();
			grm.ui.createDiscArtShadow();
			grm.cthMenu.initCustomThemeMenu('pl_bg');
			grm.preset.initThemePresetState();
		});
		customThemeMenu.addSeparator();

		customThemeMenu.addItem('Edit custom theme', false, () => {
			if (grSet.layout === 'default') {
				grm.ui.displayCustomThemeMenu = !grm.ui.displayCustomThemeMenu;
				grm.ui.initCustomTheme();
				if (grm.ui.displayDetails || grm.ui.displayLibrary || grm.ui.displayBiography || grm.ui.displayLyrics) {
					grm.ui.displayPlaylist = true;
					grm.ui.displayDetails = false;
					grm.ui.displayLibrary = false;
					grm.ui.displayBiography = false;
					grm.ui.displayLyrics = false;
					grm.ui.resizeArtwork(true);
					grm.button.initButtonState();
				}
				grm.cthMenu.initCustomThemeMenu('pl_bg');
				RepaintWindow();
			} else {
				fb.ShowPopupMessage(`Custom theme can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${grCfg.configPathCustom}\n`, 'Custom theme live editing');
			}
		});

		customThemeMenu.addItem('Rename custom theme', false, () => { grm.inputBox.renameCustomTheme(); });

		customThemeMenu.createRadioSubMenu('Save current colors', customThemeName, '', ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'], (theme) => {
			const msg = `Do you want to save current used colors\nto the selected custom theme slot?\n\nThis will overwrite all colors in the selected\ncustom theme slot.\n\nIt is recommended to make a backup\nof your custom config file:\n${grCfg.configPathCustom}\n\nSaved color changes will take effect on next reload.\n\nContinue?\n\n\n`;
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) grm.color.setCurrentColorsToCustomTheme(theme);
			});
		});
		customThemeMenu.appendTo(themeMenu);
		themeMenu.appendTo(menu, grSet.presetSelectMode === 'harmonic');
	}

	/**
	 * Top menu > Options > Style.
	 * @param {Menu} menu - Creates the Style menu via a new Menu instance.
	 * @protected
	 */
	styleOptions(menu) {
		const styleMenu = new Menu('Style');
		grm.ui.themePresetIndicator = true;
		grm.ui.themePresetMatchMode = true;

		// * STYLES * //
		styleMenu.addToggleItem('Default', grSet, 'styleDefault', () => {
			if (grSet.themeSandbox) {
				const msg = 'Theme style reset was canceled:\n\nActive theme sandbox needs to be deactivated first\nin order to reset theme styles.\n\n\n';
				ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
				grSet.styleDefault = false;
				return;
			}
			grSet.preset = false;
			grm.ui.resetStyle('all');
			grm.ui.resetStyle('all_theme_day_night');
			grm.ui.restoreThemeStylePreset(true);
			grm.ui.resetTheme();
			grm.ui.initTheme();
		});
		styleMenu.addSeparator();
		if (grSet.theme === 'reborn' || grSet.theme === 'random' || grSet.theme.startsWith('custom')) {
			styleMenu.addToggleItem('Night', grSet, 'styleNighttime', () => {
				if (!grSet.themeSandbox) grSet.savedStyleNighttime = grSet.styleNighttime;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				if (grSet.styleRebornWhite) grSet.styleRebornWhite = false;
				if (grSet.styleRebornBlack) grSet.styleRebornBlack = false;
				grm.ui.updateStyle();
			});
			styleMenu.addSeparator();
		}
		styleMenu.addToggleItem('Bevel', grSet, 'styleBevel', () => {
			if (!grSet.themeSandbox) grSet.savedStyleBevel = grSet.styleBevel;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleMenu.addSeparator();

		// * STYLES - GROUP ONE * //
		styleMenu.addToggleItem('Blend', grSet, 'styleBlend', () => {
			if (!grSet.themeSandbox) grSet.savedStyleBlend = grSet.styleBlend;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.setStyle('blend', grSet.styleBlend);
			grm.ui.updateStyle();
		});
		styleMenu.addToggleItem('Blend 2', grSet, 'styleBlend2', () => {
			if (!grSet.themeSandbox) grSet.savedStyleBlend2 = grSet.styleBlend2;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.setStyle('blend2', grSet.styleBlend2);
			grm.ui.updateStyle();
		});
		if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(grSet.theme)) {
			styleMenu.addToggleItem('Gradient', grSet, 'styleGradient', () => {
				if (!grSet.themeSandbox) grSet.savedStyleGradient = grSet.styleGradient;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('gradient', grSet.styleGradient);
				grm.ui.updateStyle();
			}, grSet.styleRebornWhite);
		}
		if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(grSet.theme)) {
			styleMenu.addToggleItem('Gradient 2', grSet, 'styleGradient2', () => {
				if (!grSet.themeSandbox) grSet.savedStyleGradient2 = grSet.styleGradient2;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('gradient2', grSet.styleGradient2);
				grm.ui.updateStyle();
			}, grSet.styleRebornWhite);
		}
		styleMenu.addSeparator();

		// * STYLES - GROUP TWO * //
		styleMenu.addToggleItem('Alternative', grSet, 'styleAlternative', () => {
			if (!grSet.themeSandbox) grSet.savedStyleAlternative = grSet.styleAlternative;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.setStyle('alternative', grSet.styleAlternative);
			grm.ui.updateStyle();
		});
		styleMenu.addToggleItem('Alternative 2', grSet, 'styleAlternative2', () => {
			if (!grSet.themeSandbox) grSet.savedStyleAlternative2 = grSet.styleAlternative2;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.setStyle('alternative2', grSet.styleAlternative2);
			grm.ui.updateStyle();
		});
		if (grSet.theme === 'white') {
			styleMenu.addToggleItem('Black and white', grSet, 'styleBlackAndWhite', () => {
				if (!grSet.themeSandbox) grSet.savedStyleBlackAndWhite = grSet.styleBlackAndWhite;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('blackAndWhite', grSet.styleBlackAndWhite);
				grm.ui.updateStyle();
			}, grSet.styleBlackAndWhiteReborn);
			styleMenu.addToggleItem('Black and white 2', grSet, 'styleBlackAndWhite2', () => {
				if (!grSet.themeSandbox) grSet.savedStyleBlackAndWhite2 = grSet.styleBlackAndWhite2;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('blackAndWhite2', grSet.styleBlackAndWhite2);
				grm.ui.updateStyle();
			}, grSet.styleBlackAndWhiteReborn);
			styleMenu.addToggleItem('Black and white reborn', grSet, 'styleBlackAndWhiteReborn', () => {
				if (!grSet.themeSandbox) grSet.savedStyleBlackAndWhiteReborn = grSet.styleBlackAndWhiteReborn;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('blackAndWhiteReborn', grSet.styleBlackAndWhiteReborn);
				grm.ui.updateStyle();
			});
		}
		if (grSet.theme === 'black') {
			styleMenu.addToggleItem('Black reborn', grSet, 'styleBlackReborn', () => {
				if (!grSet.themeSandbox) grSet.savedStyleBlackReborn = grSet.styleBlackReborn;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('blackReborn', grSet.styleBlackReborn);
				grm.ui.updateStyle();
			});
		}
		if (grSet.theme === 'reborn') {
			styleMenu.addToggleItem('Reborn white', grSet, 'styleRebornWhite', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRebornWhite = grSet.styleRebornWhite;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				if (grSet.styleNighttime) grSet.styleNighttime = false;
				grm.ui.setStyle('rebornWhite', grSet.styleRebornWhite);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn black', grSet, 'styleRebornBlack', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRebornBlack = grSet.styleRebornBlack;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				if (grSet.styleNighttime) grSet.styleNighttime = false;
				grm.ui.setStyle('rebornBlack', grSet.styleRebornBlack);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn fusion', grSet, 'styleRebornFusion', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRebornFusion = grSet.styleRebornFusion;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('rebornFusion', grSet.styleRebornFusion);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn fusion 2', grSet, 'styleRebornFusion2', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRebornFusion2 = grSet.styleRebornFusion2;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('rebornFusion2', grSet.styleRebornFusion2);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn fusion accent', grSet, 'styleRebornFusionAccent', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRebornFusionAccent = grSet.styleRebornFusionAccent;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('rebornFusionAccent', grSet.styleRebornFusionAccent);
				grm.ui.updateStyle();
			});
		}
		if (grSet.theme === 'random') {
			styleMenu.addToggleItem('Random pastel', grSet, 'styleRandomPastel', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRandomPastel = grSet.styleRandomPastel;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('randomPastel', grSet.styleRandomPastel);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Random dark', grSet, 'styleRandomDark', () => {
				if (!grSet.themeSandbox) grSet.savedStyleRandomDark = grSet.styleRandomDark;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.ui.setStyle('randomDark', grSet.styleRandomDark);
				grm.ui.updateStyle();
			});
		}
		styleMenu.addSeparator();

		// * STYLES - RANDOM AUTO COLOR * //
		if (grSet.theme === 'random') {
			const styleAutoColorMenu = new Menu('Auto color');
			styleAutoColorMenu.addRadioItems(['Off', '5 sec', '10 sec', '15 sec', '30 sec', '45 sec', '1 min', '2 min', '3 min', '4 min', '5 min', 'New track'], grSet.styleRandomAutoColor,
				['off', 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, 'track'], (timer) => {
				if (!grSet.themeSandbox) grSet.savedStyleRandomAutoColor = grSet.styleRandomAutoColor = timer; else grSet.styleRandomAutoColor = timer;
				if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
				if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
				grm.color.getRandomThemeAutoColor();
			});
			styleAutoColorMenu.appendTo(styleMenu);
			styleMenu.addSeparator();
		}

		// * STYLES - BUTTONS * //
		const styleButtonsMenu = new Menu('Buttons');
		const styleTopButtonsMenu = new Menu('Top menu');
		styleTopButtonsMenu.addRadioItems(['Default', 'Filled', 'Bevel', 'Inner', 'Emboss', 'Minimal'], grSet.styleTopMenuButtons, ['default', 'filled', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
			if (!grSet.themeSandbox) grSet.savedStyleTopMenuButtons = grSet.styleTopMenuButtons = style; else grSet.styleTopMenuButtons = style;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleTopButtonsMenu.appendTo(styleButtonsMenu);
		const styleTransportButtonsMenu = new Menu('Transport');
		styleTransportButtonsMenu.addRadioItems(['Default', 'Bevel', 'Inner', 'Emboss', 'Minimal'], grSet.styleTransportButtons, ['default', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
			if (!grSet.themeSandbox) grSet.savedStyleTransportButtons = grSet.styleTransportButtons = style; else grSet.styleTransportButtons = style;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleTransportButtonsMenu.appendTo(styleButtonsMenu);
		styleButtonsMenu.appendTo(styleMenu);

		// * STYLES - PROGRESS BAR * //
		const styleProgressBarMenu = new Menu('Progress bar');
		styleProgressBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], grSet.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (design) => {
			if (!grSet.themeSandbox) grSet.savedStyleProgressBarDesign = grSet.styleProgressBarDesign = design; else grSet.styleProgressBarDesign = design;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleProgressBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], grSet.styleProgressBar, ['default', 'bevel', 'inner'], (style) => {
			if (!grSet.themeSandbox) grSet.savedStyleProgressBar = grSet.styleProgressBar = style; else grSet.styleProgressBar = style;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleProgressBarMenu.createRadioSubMenu('Progress fill', ['Default', 'Bevel', 'Inner', 'Blend'], grSet.styleProgressBarFill, ['default', 'bevel', 'inner', 'blend'], (style) => {
			if (!grSet.themeSandbox) grSet.savedStyleProgressBarFill = grSet.styleProgressBarFill = style; else grSet.styleProgressBarFill = style;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleProgressBarMenu.appendTo(styleMenu);

		// * STYLES - VOLUME BAR * //
		const styleVolumeBarMenu = new Menu('Volume bar');
		styleVolumeBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded'], grSet.styleVolumeBarDesign, ['default', 'rounded'], (design) => {
			if (!grSet.themeSandbox) grSet.savedStyleVolumeBarDesign = grSet.styleVolumeBarDesign = design; else grSet.styleVolumeBarDesign = design;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleVolumeBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], grSet.styleVolumeBar, ['default', 'bevel', 'inner'], (style) => {
			if (!grSet.themeSandbox) grSet.savedStyleVolumeBar = grSet.styleVolumeBar = style; else grSet.styleVolumeBar = style;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleVolumeBarMenu.createRadioSubMenu('Volume fill', ['Default', 'Bevel', 'Inner'], grSet.styleVolumeBarFill, ['default', 'bevel', 'inner'], (style) => {
			if (!grSet.themeSandbox) grSet.savedStyleVolumeBarFill = grSet.styleVolumeBarFill = style; else grSet.styleVolumeBarFill = style;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.updateStyle();
		});
		styleVolumeBarMenu.appendTo(styleMenu);

		styleMenu.appendTo(menu, grSet.presetSelectMode === 'harmonic');
	}

	/**
	 * Top menu > Options > Preset.
	 * @param {Menu} menu - Creates the Preset menu via a new Menu instance.
	 * @protected
	 */
	presetOptions(menu) {
		const themePresetsMenu = new Menu('Preset');
		const themePresetSelectModeMenu = new Menu('Select mode');

		const presetSelectMode = () => {
			themePresetSelectModeMenu.addRadioItems(['Default', 'Harmonic', 'Theme'], grSet.presetSelectMode, ['default', 'harmonic', 'theme'], (mode) => {
				grSet.presetSelectMode = mode;
				if (mode === 'default') {
					const msg = 'Do you want to activate the -Default- preset select mode?\n\nThe default select mode will automatically choose\na random pick of 88 theme presets.\n\nDouble-click on the lower bar to choose\nanother random theme preset.\n\nWhen random mode is activated,\nall themes and style options will be available.\n\nContinue?\n\n\n';
					const msgFb = 'Default preset select mode activated:\n\nThe default preset select mode will automatically choose a random pick of 88 theme presets.\n\nDouble-click on the lower bar to choose another random theme preset.\n\nWhen random mode is activated,\nall themes and style options will be available.';
					ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
						if (!confirmed) {
							grSet.presetSelectMode = 'default';
							return;
						}
						grSet.presetAutoRandomMode = 'dblclick';
						grm.ui.setThemePresetSelection(true); // * Reactivate all
						grm.ui.resetStyle('all');
						grm.ui.resetTheme();
						grm.ui.restoreThemeStylePreset();
						if (grSet.savedPreset !== false) grm.preset.setThemePreset(grSet.savedPreset);
						grm.ui.updateStyle();
					});
				}
				else if (mode === 'harmonic') {
					const msg = 'Do you want to activate the -Harmonic- preset select mode?\n\nThe harmonic preset select mode will automatically\nchoose the best visual experience of themes and styles\nbased on album art.\n\nYou can also double-click on the lower bar\nto choose another random harmonic preset.\n\nWhen harmonic preset select mode is activated,\nall themes and almost all style options will be disabled.\n\nContinue?\n\n\n';
					const msgFb = 'Harmonic preset select mode activated:\n\nThe harmonic preset select mode will automatically choose the best visual experience of themes and styles based on album art.\n\nYou can also double-click on the lower bar to choose another random harmonic preset.\n\nWhen harmonic preset select mode is activated,\nall themes and almost all style options will be disabled.';
					ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
						if (!confirmed) {
							grSet.presetSelectMode = 'default';
							return;
						}
						grSet.presetAutoRandomMode = 'dblclick';
						grm.ui.setThemePresetSelection(true); // * Reactivate all
						grm.preset.getRandomThemePreset();
					});
				}
				else if (mode === 'theme') {
					const msg = 'Do you want to activate the -Theme- preset select mode?\n\nThe theme preset select mode will automatically choose\na random theme preset based on current active theme.\n\nYou can also double-click on the lower bar\nto choose another random theme preset.\n\nWhen theme preset select mode is activated,\nall themes and style options will be available.\n\nContinue?\n\n\n';
					const msgFb = 'Theme preset select mode activated:\n\nThe theme preset select mode will automatically choose a random theme preset based on current active theme.\n\nYou can also double-click on the lower bar to choose another random theme preset.\n\nWhen theme preset select mode is activated,\nall themes and style options will be available';
					ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
						if (!confirmed) {
							grSet.presetSelectMode = 'default';
							return;
						}
						grSet.presetAutoRandomMode = 'dblclick';
						grm.ui.setThemePresetSelection(false, true);
						grm.preset.getRandomThemePreset();
					});
				}
			});
		};

		// * HARMONIC MODE EXCLUSIVE MENU * // only show these options when harmonic mode is active
		if (grSet.presetSelectMode === 'harmonic') {
			presetSelectMode();
			themePresetSelectModeMenu.appendTo(themePresetsMenu);
			const themePresetSelectMenu = new Menu('Select presets');
			themePresetSelectMenu.addToggleItem('Neon blue', grSet, 'presetSelectNblue');
			themePresetSelectMenu.addToggleItem('Neon green', grSet, 'presetSelectNgreen');
			themePresetSelectMenu.addToggleItem('Neon red', grSet, 'presetSelectNred');
			themePresetSelectMenu.addToggleItem('Neon gold', grSet, 'presetSelectNgold');
			themePresetSelectMenu.appendTo(themePresetsMenu);
			themePresetsMenu.addToggleItem('Indicator', grSet, 'presetIndicator');
			themePresetsMenu.appendTo(menu);
			return;
		}

		// * THEME PRESETS MENUS * //
		const applyThemePreset = (preset) => {
			if (!grSet.themeSandbox) grSet.savedPreset = grSet.preset = preset; else grSet.preset = preset;
			grm.preset.setThemePreset(preset); // After applying the preset, synchronize the daytime/nighttime theme preset if necessary
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.createDiscArtShadow();
		};

		// * WHITE THEME PRESETS * //
		const themePresetsWhiteMenu = new Menu('White');
		themePresetsWhiteMenu.addRadioItems(['Beveled', 'Black and white', 'Black and white blended', 'Black and white 2', 'Black and white 2 blended', 'Black and white reborn', 'Black and white reborn blended', 'Minimalized'], grSet.preset,
			['whiteP01', 'whiteP02', 'whiteP03', 'whiteP04', 'whiteP05', 'whiteP06', 'whiteP07', 'whiteP08'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsWhiteMenu.appendTo(themePresetsMenu);

		// * BLACK THEME PRESETS * //
		const themePresetsBlackMenu = new Menu('Black');
		themePresetsBlackMenu.addRadioItems(['Beveled', 'Blended', 'Blended alternative', 'Blended alternative 2', 'Black reborn', 'Black reborn blended', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], grSet.preset,
			['blackP01', 'blackP02', 'blackP03', 'blackP04', 'blackP05', 'blackP06', 'blackP07', 'blackP08', 'blackP09', 'blackP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsBlackMenu.appendTo(themePresetsMenu);

		// * REBORN THEME PRESETS * //
		const themePresetsRebornMenu = new Menu('Reborn');
		themePresetsRebornMenu.addRadioItems(['Beveled', 'Blended', 'Blended 2', 'Gradiented', 'Gradiented 2', 'Minimalized', 'Minimalized blended'], grSet.preset,
			['rebornP01', 'rebornP02', 'rebornP03', 'rebornP04', 'rebornP05', 'rebornP06', 'rebornP07'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRebornMenu.addSeparator();
		themePresetsRebornMenu.addRadioItems(['Reborn white beveled', 'Reborn white blended', 'Reborn white blended 2'], grSet.preset,
			['rebornP08', 'rebornP09', 'rebornP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRebornMenu.addSeparator();
		themePresetsRebornMenu.addRadioItems(['Reborn black beveled', 'Reborn black blended', 'Reborn black blended 2', 'Reborn black gradiented', 'Reborn black gradiented 2'], grSet.preset,
			['rebornP11', 'rebornP12', 'rebornP13', 'rebornP14', 'rebornP15'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRebornMenu.addSeparator();
		themePresetsRebornMenu.addRadioItems(['Reborn fusion beveled', 'Reborn fusion blended', 'Reborn fusion blended 2', 'Reborn fusion gradiented', 'Reborn fusion gradiented 2'], grSet.preset,
			['rebornP16', 'rebornP17', 'rebornP18', 'rebornP19', 'rebornP20'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRebornMenu.addSeparator();
		themePresetsRebornMenu.addRadioItems(['Reborn fusion 2 beveled', 'Reborn fusion 2 blended', 'Reborn fusion 2 blended 2', 'Reborn fusion 2 gradiented', 'Reborn fusion 2 gradiented 2'], grSet.preset,
			['rebornP21', 'rebornP22', 'rebornP23', 'rebornP24', 'rebornP25'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRebornMenu.addSeparator();
		themePresetsRebornMenu.addRadioItems(['Reborn fusion accent beveled', 'Reborn fusion accent blended', 'Reborn fusion accent blended 2', 'Reborn fusion accent gradiented', 'Reborn fusion accent gradiented 2'], grSet.preset,
			['rebornP26', 'rebornP27', 'rebornP28', 'rebornP29', 'rebornP30'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRebornMenu.appendTo(themePresetsMenu);

		// * RANDOM THEME PRESETS * //
		const themePresetsRandomMenu = new Menu('Random');
		themePresetsRandomMenu.addRadioItems(['Beveled blended alternative', 'Beveled blended pastel', 'Beveled blended dark', 'Beveled blended auto dark', 'Beveled auto dark', 'Beveled dark', 'Gradiented', 'Gradiented 2', 'Minimalized', 'Minimalized blended'], grSet.preset,
			['randomP01', 'randomP02', 'randomP03', 'randomP04', 'randomP05', 'randomP06', 'randomP07', 'randomP08', 'randomP09', 'randomP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRandomMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();

		// * BLUE THEME PRESETS * //
		const themePresetsBlueMenu = new Menu('Blue');
		themePresetsBlueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], grSet.preset,
			['blueP01', 'blueP02', 'blueP03', 'blueP04', 'blueP05'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsBlueMenu.appendTo(themePresetsMenu);

		// * DARK BLUE THEME PRESETS * //
		const themePresetsDarkblueMenu = new Menu('Dark blue');
		themePresetsDarkblueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], grSet.preset,
			['darkblueP01', 'darkblueP02', 'darkblueP03', 'darkblueP04', 'darkblueP05'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsDarkblueMenu.appendTo(themePresetsMenu);

		// * RED THEME PRESETS * //
		const themePresetsRedMenu = new Menu('Red');
		themePresetsRedMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], grSet.preset,
			['redP01', 'redP02', 'redP03', 'redP04', 'redP05'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsRedMenu.appendTo(themePresetsMenu);

		// * CREAM THEME PRESETS * //
		const themePresetsCreamMenu = new Menu('Cream');
		themePresetsCreamMenu.addRadioItems(['Beveled', 'Beveled 2', 'Alternative', 'Alternative 2', 'Minimalized'], grSet.preset,
			['creamP01', 'creamP02', 'creamP03', 'creamP04', 'creamP05'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsCreamMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();

		// * NEON BLUE THEME PRESETS * //
		const themePresetsNblueMenu = new Menu('Neon blue');
		themePresetsNblueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], grSet.preset,
			['nblueP01', 'nblueP02', 'nblueP03', 'nblueP04', 'nblueP05', 'nblueP06', 'nblueP07', 'nblueP08', 'nblueP09', 'nblueP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsNblueMenu.appendTo(themePresetsMenu);

		// * NEON GREEN THEME PRESETS * //
		const themePresetsNgreenMenu = new Menu('Neon green');
		themePresetsNgreenMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], grSet.preset,
			['ngreenP01', 'ngreenP02', 'ngreenP03', 'ngreenP04', 'ngreenP05', 'ngreenP06', 'ngreenP07', 'ngreenP08', 'ngreenP09', 'ngreenP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsNgreenMenu.appendTo(themePresetsMenu);

		// * NEON RED THEME PRESETS * //
		const themePresetsNredMenu = new Menu('Neon red');
		themePresetsNredMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], grSet.preset,
			['nredP01', 'nredP02', 'nredP03', 'nredP04', 'nredP05', 'nredP06', 'nredP07', 'nredP08', 'nredP09', 'nredP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsNredMenu.appendTo(themePresetsMenu);

		// * NEON GOLD THEME PRESETS * //
		const themePresetsNgoldMenu = new Menu('Neon gold');
		themePresetsNgoldMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], grSet.preset,
			['ngoldP01', 'ngoldP02', 'ngoldP03', 'ngoldP04', 'ngoldP05', 'ngoldP06', 'ngoldP07', 'ngoldP08', 'ngoldP09', 'ngoldP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsNgoldMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();

		// * CUSTOM THEME PRESETS * //
		const themePresetsCustomMenu = new Menu('Custom');
		themePresetsCustomMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Gradiented', 'Gradiented 2', 'Alternative', 'Alternative 2', 'Minimalized', 'Minimalized blended'], grSet.preset,
			['customP01', 'customP02', 'customP03', 'customP04', 'customP05', 'customP06', 'customP07', 'customP08', 'customP09', 'customP10'], (preset) => {
			applyThemePreset(preset);
		});
		themePresetsCustomMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();

		// * CUSTOM USER THEME PRESET * //
		const themePresetUserMenu = new Menu('User preset');
		themePresetUserMenu.addRadioItems(['User settings'], grSet.preset, ['user'], (preset) => {
			if (!grSet.themeSandbox) grSet.savedPreset = grSet.preset = preset; else grSet.preset = preset;
			grm.ui.resetStyle('all');
			grm.ui.resetTheme();
			grSet.theme = grCfg.customStylePreset.theme;
			grSet.styleNighttime = grCfg.customStylePreset.styleNighttime;
			grSet.styleBevel = grCfg.customStylePreset.styleBevel;
			grSet.styleBlend = grCfg.customStylePreset.styleBlend;
			grSet.styleBlend2 = grCfg.customStylePreset.styleBlend2;
			grSet.styleGradient = grCfg.customStylePreset.styleGradient;
			grSet.styleGradient2 = grCfg.customStylePreset.styleGradient2;
			grSet.styleAlternative = grCfg.customStylePreset.styleAlternative;
			grSet.styleAlternative2 = grCfg.customStylePreset.styleAlternative2;
			grSet.styleBlackAndWhite = grCfg.customStylePreset.styleBlackAndWhite;
			grSet.styleBlackAndWhite2 = grCfg.customStylePreset.styleBlackAndWhite2;
			grSet.styleBlackAndWhiteReborn = grCfg.customStylePreset.styleBlackAndWhiteReborn;
			grSet.styleBlackReborn = grCfg.customStylePreset.styleBlackReborn;
			grSet.styleRebornWhite = grCfg.customStylePreset.styleRebornWhite;
			grSet.styleRebornBlack = grCfg.customStylePreset.styleRebornBlack;
			grSet.styleRebornFusion = grCfg.customStylePreset.styleRebornFusion;
			grSet.styleRebornFusion2 = grCfg.customStylePreset.styleRebornFusion2;
			grSet.styleRebornFusionAccent = grCfg.customStylePreset.styleRebornFusionAccent;
			grSet.styleRandomPastel = grCfg.customStylePreset.styleRandomPastel;
			grSet.styleRandomDark = grCfg.customStylePreset.styleRandomDark;
			grSet.styleRandomAutoColor = grCfg.customStylePreset.styleRandomAutoColor;
			grSet.styleTopMenuButtons = grCfg.customStylePreset.styleTopMenuButtons;
			grSet.styleTransportButtons = grCfg.customStylePreset.styleTransportButtons;
			grSet.styleProgressBarDesign = grCfg.customStylePreset.styleProgressBarDesign;
			grSet.styleProgressBar = grCfg.customStylePreset.styleProgressBar;
			grSet.styleProgressBarFill = grCfg.customStylePreset.styleProgressBarFill;
			grSet.styleVolumeBarDesign = grCfg.customStylePreset.styleVolumeBarDesign;
			grSet.styleVolumeBar = grCfg.customStylePreset.styleVolumeBar;
			grSet.styleVolumeBarFill = grCfg.customStylePreset.styleVolumeBarFill;
			grSet.themeBrightness = grCfg.customStylePreset.themeBrightness;
			grm.ui.updateStyle();
			// After applying the preset, synchronize the daytime/nighttime theme preset if necessary
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
		});
		themePresetUserMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();

		// * THEME PRESET SELECT MODE * //
		presetSelectMode();
		themePresetSelectModeMenu.appendTo(themePresetsMenu);

		// * THEME PRESET SELECTION * //
		const themePresetSelectMenu = new Menu('Select presets');
		themePresetSelectMenu.addItem('Activate all', false, () => {
			grm.ui.setThemePresetSelection(true);
		});
		themePresetSelectMenu.addSeparator();
		themePresetSelectMenu.addItem('Deactivate all', false, () => {
			grm.ui.setThemePresetSelection(false);
		});
		themePresetSelectMenu.addSeparator();
		themePresetSelectMenu.addToggleItem('White',  grSet, 'presetSelectWhite');
		themePresetSelectMenu.addToggleItem('Black',  grSet, 'presetSelectBlack');
		themePresetSelectMenu.addToggleItem('Reborn', grSet, 'presetSelectReborn');
		themePresetSelectMenu.addToggleItem('Random', grSet, 'presetSelectRandom');
		themePresetSelectMenu.addSeparator();
		themePresetSelectMenu.addToggleItem('Blue', grSet, 'presetSelectBlue');
		themePresetSelectMenu.addToggleItem('Dark blue', grSet, 'presetSelectDarkblue');
		themePresetSelectMenu.addToggleItem('Red', grSet, 'presetSelectRed');
		themePresetSelectMenu.addToggleItem('Cream', grSet, 'presetSelectCream');
		themePresetSelectMenu.addSeparator();
		themePresetSelectMenu.addToggleItem('Neon blue', grSet, 'presetSelectNblue');
		themePresetSelectMenu.addToggleItem('Neon green', grSet, 'presetSelectNgreen');
		themePresetSelectMenu.addToggleItem('Neon red', grSet, 'presetSelectNred');
		themePresetSelectMenu.addToggleItem('Neon gold', grSet, 'presetSelectNgold');
		themePresetSelectMenu.addSeparator();
		themePresetSelectMenu.addToggleItem('Custom', grSet, 'presetSelectCustom');
		themePresetSelectMenu.appendTo(themePresetsMenu, grSet.presetSelectMode === 'theme');

		const themePresetAutoRandomModeMenu = new Menu('Auto random');
		themePresetAutoRandomModeMenu.addRadioItems(['Off', '5 sec', '10 sec', '15 sec', '30 sec', '1 min', '5 min', '10 min', '15 min', '30 min', '60 min', 'New track', 'New album', 'Double-click'],
			grSet.presetAutoRandomMode, ['off', 5000, 10000, 15000, 30000, 60000, 300000, 600000, 900000, 1800000, 3600000, 'track', 'album', 'dblclick'], (timer) => {
			grSet.presetAutoRandomMode = timer;
			if (!['off', 'track', 'album', 'dblclick'].includes(timer)) {
				grm.preset.getRandomThemePreset();
			} else {
				clearInterval(grm.ui.presetAutoRandomModeTimer);
				grm.ui.presetAutoRandomModeTimer = null;
			}
		}, grSet.presetSelectMode === 'harmonic');
		themePresetAutoRandomModeMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();
		themePresetsMenu.addToggleItem('Indicator', grSet, 'presetIndicator');

		themePresetsMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Player size.
	 * @param {Menu} menu - Creates the Player size menu via a new Menu instance.
	 * @protected
	 */
	playerSizeOptions(menu) {
		menu.createRadioSubMenu('Player size', ['Small', 'Normal', 'Large'], grSet.playerSize, ['small', 'normal', 'large'], (size) => {
			grSet.playerSize = size;
			grm.ui.resetPlayerSize();
			if (size === 'small') {
				if (!RES._4K && !RES._QHD) {
					grSet.playerSize_HD_small = true;
					grm.display.playerSize_HD_small();
				} else if (RES._QHD) {
					grSet.playerSize_QHD_small = true;
					grm.display.playerSize_QHD_small();
				} else if (RES._4K) {
					grSet.playerSize_4K_small = true;
					grm.display.playerSize_4K_small();
				}
			}
			if (size === 'normal') {
				if (!RES._4K && !RES._QHD) {
					grSet.playerSize_HD_normal = true;
					grm.display.playerSize_HD_normal();
				} else if (RES._QHD) {
					grSet.playerSize_QHD_normal = true;
					grm.display.playerSize_QHD_normal();
				} else if (RES._4K) {
					grSet.playerSize_4K_normal = true;
					grm.display.playerSize_4K_normal();
				}
			}
			if (size === 'large') {
				if (!RES._4K && !RES._QHD) {
					grSet.playerSize_HD_large = true;
					grm.display.playerSize_HD_large();
				} else if (RES._QHD) {
					grSet.playerSize_QHD_large = true;
					grm.display.playerSize_QHD_large();
				} else if (RES._4K) {
					grSet.playerSize_4K_large = true;
					grm.display.playerSize_4K_large();
				}
			}
			RepaintWindow();
		}, grSet.lockPlayerSize);
	}

	/**
	 * Top menu > Options > Layout.
	 * @param {Menu} menu - Creates the Layout menu via a new Menu instance.
	 * @protected
	 */
	layoutOptions(menu) {
		menu.createRadioSubMenu('Layout', ['Default', 'Artwork', 'Compact'], grSet.layout, ['default', 'artwork', 'compact'], (layout) => {
			grSet.layout = layout;
			if (grSet.layout === 'default') {
				grm.ui.displayPlaylist = grSet.showPanelOnStartup === 'playlist'; // Switch back to Playlist from Artwork layout to Default layout
				grm.ui.displayPanelControl(true);
				grm.display.layoutDefault();
			}
			if (grSet.layout === 'artwork') {
				grSet.showPanelOnStartup = 'cover';
				grm.ui.displayPlaylist = false;
				grm.ui.displayPlaylistArtwork = false;
				grm.ui.displayDetails = false;
				grm.ui.displayLibrary = false;
				grm.ui.displayBiography = false;
				grm.display.layoutArtwork();
			}
			if (grSet.layout === 'compact') {
				grm.ui.displayPlaylist = true;
				grm.ui.displayDetails = false;
				grm.ui.displayLibrary = false;
				grm.ui.displayBiography = false;
				grm.ui.displayLyrics = false;
				grm.display.layoutCompact();
			}
			grm.ui.initPanels();
		}, grSet.lockPlayerSize);
	}

	/**
	 * Top menu > Options > Display.
	 * @param {Menu} menu - Creates the Display menu via a new Menu instance.
	 * @protected
	 */
	displayOptions(menu) {
		const displayResMenu = new Menu('Display');

		displayResMenu.addItem('Auto-detect', false, () => { grm.display.autoDetectRes(); });
		displayResMenu.addSeparator();
		displayResMenu.addRadioItems(['4K', 'QHD', 'HD'], grSet.displayRes, ['4K', 'QHD', 'HD'], (res) => {
			grSet.displayRes = res;
			if (grSet.layout === 'default') {
				grm.display.layoutDefault();
			}
			else if (grSet.layout === 'artwork') {
				grm.display.layoutArtwork();
			}
			else if (grSet.layout === 'compact') {
				grm.display.layoutCompact();
			}
			if (grSet.displayRes === '4K' || grSet.displayRes === 'HD') {
				grm.display.setSizesFor4KorHD();
			} else if (grSet.displayRes === 'QHD') {
				grm.display.setSizesForQHD();
			}
			grm.ui.initPanels();
		});

		displayResMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Brightness.
	 * @param {Menu} menu - Creates the Brightness menu via a new Menu instance.
	 * @protected
	 */
	brightnessOptions(menu) {
		menu.createRadioSubMenu('Brightness', ['   -50%', '   -40%', '   -30%', '   -25%', '   -20%', '   -15%', '   -10%', '     -5%', 'Default', '     +5%', '   +10%', '   +15%', '   +20%', '   +25%', '   +30%', '   +40%', '   +50%'],
			grSet.themeBrightness, [-50, -40, -30, -25, -20, -15, -10, -5, 'default', 5, 10, 15, 20, 25, 30, 40, 50], (percent) => {
			if (!grSet.themeSandbox) grSet.savedThemeBrightness = grSet.themeBrightness = percent; else grSet.themeBrightness = percent;
			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
			if (grSet.themeDayNightMode) ShowThemeDayNightModePopup();
			grm.ui.initThemeFull = true;
			grm.ui.initTheme();
		}, grSet.presetSelectMode === 'harmonic');
	}

	/**
	 * Top menu > Options > Font size.
	 * @param {Menu} menu - Creates the Font size menu via a new Menu instance.
	 * @protected
	 */
	fontSizeOptions(menu) {
		const menuFontSize           = grSet[`menuFontSize_${grSet.layout}`];
		const lowerBarFontSize       = grSet[`lowerBarFontSize_${grSet.layout}`];
		const notificationFontSize   = grSet[`notificationFontSize_${grSet.layout}`];
		const popupFontSize          = grSet[`popupFontSize_${grSet.layout}`];
		const tooltipFontSize        = grSet[`tooltipFontSize_${grSet.layout}`];

		const gridArtistFontSize     = grSet[`gridArtistFontSize_${grSet.layout}`];
		const gridTrackNumFontSize   = grSet[`gridTrackNumFontSize_${grSet.layout}`];
		const gridTitleFontSize      = grSet[`gridTitleFontSize_${grSet.layout}`];
		const gridAlbumFontSize      = grSet[`gridAlbumFontSize_${grSet.layout}`];
		const gridKeyFontSize        = grSet[`gridKeyFontSize_${grSet.layout}`];
		const gridValueFontSize      = grSet[`gridValueFontSize_${grSet.layout}`];

		const playlistHeaderFontSize = grSet[`playlistHeaderFontSize_${grSet.layout}`];
		const libraryFontSize        = libSet[`baseFontSize_${grSet.layout}`];
		const biographyFontSize      = bioSet[`baseFontSizeBio_${grSet.layout}`];
		const lyricsFontSize         = grSet[`lyricsFontSize_${grSet.layout}`];

		const changeFontSizeMenu = new Menu('Font size');
		const mainFontSizeMenu = new Menu('Main');

		// * MAIN - TOP MENU * //
		mainFontSizeMenu.createRadioSubMenu('Top menu', ['  8px', '10px', '11px', RES._QHD ? '12px' : '12px (default)', '13px', RES._QHD ? '14px (default)' : '14px', '16px'], menuFontSize, [8, 10, 11, 12, 13, 14, 16], (size) => {
			if (grSet.layout === 'default') {
				grSet.menuFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.menuFontSize_artwork = size;
			}
			else if (grSet.layout === 'compact') {
				grSet.menuFontSize_compact = size;
			}
			grm.ui.createFonts();
			grm.ui.createButtonImages();
			grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		});

		// * MAIN - LOWER BAR * //
		mainFontSizeMenu.createRadioSubMenu('Lower bar', grSet.layout !== 'default' ? ['10px', '12px', '14px', RES._QHD ? '16px' : '16px (default)', RES._QHD ? '18px (default)' : '18px', '20px', '22px', '24px', '26px'] :
			['10px', '12px', '14px', '16px', RES._QHD ? '18px' : '18px (default)', RES._QHD ? '20px (default)' : '20px', '22px', '24px', '26px'], lowerBarFontSize, [10, 12, 14, 16, 18, 20, 22, 24, 26], (size) => {
			if (grSet.layout === 'default') {
				grSet.lowerBarFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.lowerBarFontSize_artwork = size;
			}
			else if (grSet.layout === 'compact') {
				grSet.lowerBarFontSize_compact = size;
			}
			grm.ui.createFonts();
			grm.ui.createButtonImages();
			grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		});
		mainFontSizeMenu.appendTo(changeFontSizeMenu);

		// * MAIN - NOTIFICATION * //
		mainFontSizeMenu.createRadioSubMenu('Notification', ['12px', '14px', '16px', RES._QHD ? '18px' : '18px (default)', RES._QHD ? '20px (default)' : '20px', '22px', '24px'], notificationFontSize,
			[12, 14, 16, 18, 20, 22, 24], (size) => {
			if      (grSet.layout === 'default') { grSet.notificationFontSize_default = size; }
			else if (grSet.layout === 'artwork') { grSet.notificationFontSize_artwork = size; }
			else if (grSet.layout === 'compact') { grSet.notificationFontSize_compact = size; }

			grm.ui.createFonts();
			RepaintWindow();
		});

		// * MAIN - POPUP * //
		mainFontSizeMenu.createRadioSubMenu('Popup', ['12px', '14px', RES._QHD ? '16px' : '16px (default)', RES._QHD ? '18px (default)' : '18px', '20px', '22px', '24px'], popupFontSize,
			[12, 14, 16, 18, 20, 22, 24], (size) => {
			if      (grSet.layout === 'default') { grSet.popupFontSize_default = size; }
			else if (grSet.layout === 'artwork') { grSet.popupFontSize_artwork = size; }
			else if (grSet.layout === 'compact') { grSet.popupFontSize_compact = size; }

			grm.ui.createFonts();
			if      (grm.ui.displayCustomThemeMenu)  grm.cthMenu.initCustomThemeMenu('pl_bg');
			else if (grm.ui.displayMetadataGridMenu) grm.gridMenu.initMetadataGridMenu();
			RepaintWindow();
		});

		// * MAIN - TOOLTIP * //
		mainFontSizeMenu.createRadioSubMenu('Tooltip', ['12px', '14px', RES._QHD ? '16px' : '16px (default)', RES._QHD ? '18px (default)' : '18px', '20px', '22px', '24px'], tooltipFontSize,
			[12, 14, 16, 18, 20, 22, 24], (size) => {
			if      (grSet.layout === 'default') { grSet.tooltipFontSize_default = size; }
			else if (grSet.layout === 'artwork') { grSet.tooltipFontSize_artwork = size; }
			else if (grSet.layout === 'compact') { grSet.tooltipFontSize_compact = size; }

			grm.ui.createFonts();
			RepaintWindow();
		});

		// * DETAILS - ARTIST * //
		const detailsFontSizeMenu = new Menu('Details');
		detailsFontSizeMenu.createRadioSubMenu('Artist', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', RES._QHD ? '18px' : '18px (default)', '19px', RES._QHD ? '20px (default)' : '20px', '22px', '24px'], gridArtistFontSize,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			if (grSet.layout === 'default') {
				grSet.gridArtistFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.gridArtistFontSize_artwork = size;
			}
			grm.ui.createFonts();
			RepaintWindow();
		});

		// * DETAILS - TITLE * //
		detailsFontSizeMenu.createRadioSubMenu('Title', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', RES._QHD ? '18px' : '18px (default)', '19px', RES._QHD ? '20px (default)' : '20px', '22px', '24px'], gridTrackNumFontSize && gridTitleFontSize,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			if (grSet.layout === 'default') {
				grSet.gridTrackNumFontSize_default = size;
				grSet.gridTitleFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.gridTrackNumFontSize_artwork = size;
				grSet.gridTitleFontSize_artwork = size;
			}
			grm.ui.createFonts();
			RepaintWindow();
		});

		// * DETAILS - ALBUM * //
		detailsFontSizeMenu.createRadioSubMenu('Album', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', RES._QHD ? '18px' : '18px (default)', '19px', RES._QHD ? '20px (default)' : '20px', '22px', '24px'], gridAlbumFontSize,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			if (grSet.layout === 'default') {
				grSet.gridAlbumFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.gridAlbumFontSize_artwork = size;
			}
			grm.ui.createFonts();
			RepaintWindow();
		});

		// * DETAILS - TAG NAME * //
		detailsFontSizeMenu.createRadioSubMenu('Tag name', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', RES._QHD ? '17px' : '17px (default)', '18px', RES._QHD ? '19px (default)' : '19px', '20px', '22px', '24px'], gridKeyFontSize,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			if (grSet.layout === 'default') {
				grSet.gridKeyFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.gridKeyFontSize_artwork = size;
			}
			grm.ui.createFonts();
			RepaintWindow();
		});

		// * DETAILS - TAG VALUE * //
		detailsFontSizeMenu.createRadioSubMenu('Tag value', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', RES._QHD ? '17px' : '17px (default)', '18px', RES._QHD ? '19px (default)' : '19px', '20px', '22px', '24px'], gridValueFontSize,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			if (grSet.layout === 'default') {
				grSet.gridValueFontSize_default = size;
			}
			else if (grSet.layout === 'artwork') {
				grSet.gridValueFontSize_artwork = size;
			}
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsFontSizeMenu.appendTo(changeFontSizeMenu);

		// * PLAYLIST * //
		changeFontSizeMenu.createRadioSubMenu('Playlist', grSet.layout === 'default' ?
			RES._QHD ? ['-1', '10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px', '20px', '22px', '+1'] : ['-1', '10px', '12px', '13px', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'] :
			RES._QHD ? ['10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px'] : ['10px', '12px', '13px', '14px', '15px (default)', '16px', '18px'], playlistHeaderFontSize, grSet.layout === 'default' ?
			RES._QHD ? [-1, 10, 12, 13, 14, 15, 16, 17, 18, 20, 22, 999] : [-1, 10, 12, 13, 14, 15, 16, 18, 20, 22, 999] :
			RES._QHD ? [10, 12, 13, 14, 15, 16, 17, 18] : [10, 12, 13, 14, 15, 16, 18], (size) => {
			if (size === -1) {
				if      (grSet.layout === 'default') { grSet.playlistHeaderFontSize_default--; grSet.playlistFontSize_default--; }
				else if (grSet.layout === 'artwork') { grSet.playlistHeaderFontSize_artwork--; grSet.playlistFontSize_artwork--; }
				else if (grSet.layout === 'compact') { grSet.playlistHeaderFontSize_compact--; grSet.playlistFontSize_compact--; }
			}
			else if (size === 999) {
				if      (grSet.layout === 'default') { grSet.playlistHeaderFontSize_default++; grSet.playlistFontSize_default++; }
				else if (grSet.layout === 'artwork') { grSet.playlistHeaderFontSize_artwork++; grSet.playlistFontSize_artwork++; }
				else if (grSet.layout === 'compact') { grSet.playlistHeaderFontSize_compact++; grSet.playlistFontSize_compact++; }
			}
			else if (grSet.layout === 'default') { grSet.playlistHeaderFontSize_default = size; grSet.playlistFontSize_default = size - (size === 15 || size === 17 ? 3 : 2); }
			else if (grSet.layout === 'artwork') { grSet.playlistHeaderFontSize_artwork = size; grSet.playlistFontSize_artwork = size - (size === 15 || size === 17 ? 3 : 2); }
			else if (grSet.layout === 'compact') { grSet.playlistHeaderFontSize_compact = size; grSet.playlistFontSize_compact = size - (size === 15 || size === 17 ? 3 : 2); }

			// * Update Playlist history buttons
			grm.ui.createFonts();
			grm.ui.initMetrics();
			grm.ui.createButtonImages();
			grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
			// * Update Playlist
			PlaylistRescale(true);
			PlaylistHeader.img_cache.clear();
			grm.ui.initPlaylist();
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			if (grSet.libraryLayout === 'split') {
				// * Update Library
				lib.pop.createImages();
				lib.panel.zoomReset();
				grm.ui.initLibraryLayout();
			}
			RepaintWindow();
		});

		// * LIBRARY * //
		changeFontSizeMenu.createRadioSubMenu('Library', ['-1', '  8px', '10px', '11px', RES._QHD ? '12px' : '12px (default)', '13px', RES._QHD ? '14px (default)' : '14px', '16px', '18px', '+1'], libraryFontSize,
			[-1, RES._4K ? 8 * 1.5 : 8, RES._4K ? 10 * 1.5 : 10, RES._4K ? 11 * 1.5 : 11, RES._4K ? 12 * 1.5 : 12, RES._4K ? 13 * 1.5 : 13, RES._4K ? 14 * 1.5 : 14, RES._4K ? 16 * 1.5 : 16, RES._4K ? 18 * 1.5 : 18, 999], (size) => {
			if (size === -1) {
				if      (grSet.layout === 'default') { libSet.baseFontSize_default--; }
				else if (grSet.layout === 'artwork') { libSet.baseFontSize_artwork--; }
			}
			else if (size === 999) {
				if      (grSet.layout === 'default') { libSet.baseFontSize_default++; }
				else if (grSet.layout === 'artwork') { libSet.baseFontSize_artwork++; }
			}
			else if (grSet.layout === 'default') { libSet.baseFontSize_default = size; }
			else if (grSet.layout === 'artwork') { libSet.baseFontSize_artwork = size; }

			grSet.libraryFontSize_default = libSet.baseFontSize_default;
			grSet.libraryFontSize_artwork = libSet.baseFontSize_artwork;

			grm.ui.setLibrarySize();
			lib.panel.zoomReset();
			lib.pop.createImages();
			RepaintWindow();
		});

		// * BIOGRAPHY * //
		changeFontSizeMenu.createRadioSubMenu('Biography', ['-1', '  8px', '10px', '11px', RES._QHD ? '12px' : '12px (default)', '13px', RES._QHD ? '14px (default)' : '14px', '16px', '18px', '+1'], biographyFontSize,
			[-1, RES._4K ? 8 * 1.5 : 8, RES._4K ? 10 * 2 : 10, RES._4K ? 11 * 2 : 11, RES._4K ? 12 * 2 : 12, RES._4K ? 13 * 2 : 13, RES._4K ? 14 * 2 : 14, RES._4K ? 16 * 2 : 16, RES._4K ? 18 * 2 : 18, 999], (size) => {
			if (size === -1) {
				if      (grSet.layout === 'default') { bioSet.baseFontSizeBio_default--; }
				else if (grSet.layout === 'artwork') { bioSet.baseFontSizeBio_artwork--; }
			}
			else if (size === 999) {
				if      (grSet.layout === 'default') { bioSet.baseFontSizeBio_default++; }
				else if (grSet.layout === 'artwork') { bioSet.baseFontSizeBio_artwork++; }
			}
			else if (grSet.layout === 'default') { bioSet.baseFontSizeBio_default = size; }
			else if (grSet.layout === 'artwork') { bioSet.baseFontSizeBio_artwork = size; }

			grSet.biographyFontSize_default = bioSet.baseFontSizeBio_default;
			grSet.biographyFontSize_artwork = bioSet.baseFontSizeBio_artwork;

			grm.ui.setBiographySize();
			bio.but.resetZoom();
			bio.but.createImages();
			RepaintWindow();
		});

		// * LYRICS * //
		changeFontSizeMenu.createRadioSubMenu('Lyrics', ['-1', '10px', '12px', '14px', '16px', '18px', RES._QHD ? '20px' : '20px (default)', RES._QHD ? '22px (default)' : '22px', '24px', '26px', '28px', '30px', '+1'], lyricsFontSize,
			[-1, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 999], (size) => {
			if (size === -1) {
				if      (grSet.layout === 'default') { grSet.lyricsFontSize_default--; }
				else if (grSet.layout === 'artwork') { grSet.lyricsFontSize_artwork--; }
			}
			else if (size === 999) {
				if      (grSet.layout === 'default') { grSet.lyricsFontSize_default++; }
				else if (grSet.layout === 'artwork') { grSet.lyricsFontSize_artwork++; }
			}
			else if (grSet.layout === 'default') { grSet.lyricsFontSize_default = size; }
			else if (grSet.layout === 'artwork') { grSet.lyricsFontSize_artwork = size; }

			if      (grSet.layout === 'default') { grSet.lyricsFontSize_default = Math.max(6, grSet.lyricsFontSize_default); }
			else if (grSet.layout === 'artwork') { grSet.lyricsFontSize_artwork = Math.max(6, grSet.lyricsFontSize_artwork); }

			grm.ui.createFonts();
			if (grm.ui.displayLyrics) grm.lyrics.initLyrics();
		});

		changeFontSizeMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Player controls.
	 * @param {Menu} menu - Creates the Player controls menu via a new Menu instance.
	 * @protected
	 */
	playerControlsOptions(menu) {
		const playerControlsMenu = new Menu('Player controls');

		const playlistCallback = () => {
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		const updateButtons = () => {
			grm.ui.createButtonImages();
			grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		const updateSeekbar = () => {
			grm.ui.initMetrics();
			RepaintWindow();
		};

		// * TOP MENU * //
		const playerControlsTopMenu = new Menu('Top menu');
		const playerControlsTopMenuDefault = new Menu('Default');
		playerControlsTopMenuDefault.addToggleItem('Details', grSet, 'showPanelDetails_default', () => { updateButtons(); });
		playerControlsTopMenuDefault.addToggleItem('Library', grSet, 'showPanelLibrary_default', () => { updateButtons(); });
		playerControlsTopMenuDefault.addToggleItem('Biography', grSet, 'showPanelBiography_default', () => { updateButtons(); });
		playerControlsTopMenuDefault.addToggleItem('Lyrics', grSet, 'showPanelLyrics_default', () => { updateButtons(); });
		playerControlsTopMenuDefault.addToggleItem('Rating', grSet, 'showPanelRating_default', () => { updateButtons(); });
		playerControlsTopMenuDefault.appendTo(playerControlsTopMenu);

		const playerControlsTopMenuArtwork = new Menu('Artwork');
		playerControlsTopMenuArtwork.addToggleItem('Details', grSet, 'showPanelDetails_artwork', () => { updateButtons(); });
		playerControlsTopMenuArtwork.addToggleItem('Library', grSet, 'showPanelLibrary_artwork', () => { updateButtons(); });
		playerControlsTopMenuArtwork.addToggleItem('Biography', grSet, 'showPanelBiography_artwork', () => { updateButtons(); });
		playerControlsTopMenuArtwork.addToggleItem('Lyrics', grSet, 'showPanelLyrics_artwork', () => { updateButtons(); });
		playerControlsTopMenuArtwork.addToggleItem('Rating', grSet, 'showPanelRating_artwork', () => { updateButtons(); });
		playerControlsTopMenuArtwork.appendTo(playerControlsTopMenu);
		playerControlsTopMenu.addSeparator();

		playerControlsTopMenu.addRadioItems(['Align left', 'Align center'], grSet.topMenuAlignment, ['left', 'center'], (align) => {
			grSet.topMenuAlignment = align;
			updateButtons();
		});
		playerControlsTopMenu.addSeparator();
		playerControlsTopMenu.addToggleItem('Compact top menu', grSet, 'topMenuCompact', () => {
			grSet.showTopMenuCompact = grSet.topMenuCompact;
			updateButtons();
		});
		playerControlsTopMenu.appendTo(playerControlsMenu);

		// * ALBUM ART * //
		if (grSet.layout !== 'compact') {
			const playerControlsAlbumArtMenu = new Menu('Album art');
			const playerControlsAlbumArtNotPropMenu = new Menu('When player size is not proportional');
			if (grSet.layout === 'default') {
				playerControlsAlbumArtNotPropMenu.addRadioItems(['Align album art left', 'Align album art left (margin)', 'Align album art center', 'Align album art right'], grSet.albumArtAlign, ['left', 'leftMargin', 'center', 'right'], (pos) => {
					grSet.albumArtAlign = pos;
					grm.ui.loadImageFromAlbumArtList(grm.ui.albumArtIndex);
					grm.ui.resizeArtwork(true);
					pl.call.on_size(grm.ui.ww, grm.ui.wh);
					grm.ui.setLibrarySize();
					grm.ui.setBiographySize();
					RepaintWindow();
				});
				playerControlsAlbumArtNotPropMenu.addSeparator();
			}
			playerControlsAlbumArtNotPropMenu.addRadioItems(['Left album art bg', 'Full album art bg', 'No album art bg'], grSet.albumArtBg, ['left', 'full', 'none'], (type) => {
				grSet.albumArtBg = type;
				RepaintWindow();
			});
			playerControlsAlbumArtNotPropMenu.appendTo(playerControlsAlbumArtMenu);
			const playerControlsAlbumArtScaleMenu = new Menu('When player size is maximized/fullscreen');
			if (grSet.layout === 'default') {
				playerControlsAlbumArtScaleMenu.addRadioItems(['Scale album art cropped', 'Scale album art stretched', 'Scale album art proportional'], grSet.albumArtScale, ['cropped', 'stretched', 'proportional'], (scale) => {
					grSet.albumArtScale = scale;
					grm.ui.loadImageFromAlbumArtList(grm.ui.albumArtIndex);
					grm.ui.resizeArtwork(true);
					RepaintWindow();
				});
				playerControlsAlbumArtScaleMenu.addSeparator();
				playerControlsAlbumArtScaleMenu.addRadioItems([
					'Crop and stretch - always',
					'Crop and stretch - limit aspect ratio 1.25x',
					'Crop and stretch - limit aspect ratio 1.50x',
					'Crop and stretch - limit aspect ratio 1.75x',
					'Crop and stretch - limit aspect ratio 2.00x'
				], grSet.albumArtAspectRatioLimit, [false, 1.25, 1.5, 1.75, 2], (factor) => {
					grSet.albumArtAspectRatioLimit = factor;
					grm.ui.loadImageFromAlbumArtList(grm.ui.albumArtIndex);
					grm.ui.resizeArtwork(true);
					RepaintWindow();
				});
				playerControlsAlbumArtScaleMenu.appendTo(playerControlsAlbumArtMenu);
			}
			playerControlsAlbumArtMenu.addSeparator();
			playerControlsAlbumArtMenu.addToggleItem(`Cycle album artwork (${grCfg.settings.artworkDisplayTime}s delay)`, grSet, 'cycleArt', () => {
				if (!grSet.cycleArt) {
					clearTimeout(grm.ui.albumArtTimeout);
					grm.ui.albumArtTimeout = 0;
				} else {
					grm.ui.displayNextImage();
				}
			});
			playerControlsAlbumArtMenu.addToggleItem('Cycle album artwork with mouse wheel', grSet, 'cycleArtMWheel');
			playerControlsAlbumArtMenu.addSeparator();
			playerControlsAlbumArtMenu.addToggleItem('Load embedded album art first', grSet, 'loadEmbeddedAlbumArtFirst', () => {
				const msg = 'Do you want to load embedded album art first?\n\nYou also need to set it in foobar\'s preferences.\nFile > Preferences > Advanced > Display > Album art\n\nContinue?\n\n\n';
				const msgFb = 'Embedded album art enabled:\n\nYou also need to set it in foobar\'s preferences.\nFile > Preferences > Advanced > Display > Album art.';
				ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) grSet.loadEmbeddedAlbumArtFirst = false;
				});
			});
			playerControlsAlbumArtMenu.addSeparator();

			const showHiResAudioLogoMenu = new Menu('Show hi-res audio badge on album cover');
			showHiResAudioLogoMenu.addToggleItem('Enabled', grSet, 'showHiResAudioBadge', () => { RepaintWindow(); });
			showHiResAudioLogoMenu.addSeparator();
			showHiResAudioLogoMenu.addToggleItem('Round', grSet, 'hiResAudioBadgeRound', () => { RepaintWindow(); }, !grSet.showHiResAudioBadge);
			showHiResAudioLogoMenu.addSeparator();
			showHiResAudioLogoMenu.addRadioItems(['Small', 'Normal', 'Large'], grSet.hiResAudioBadgeSize, ['small', 'normal', 'large'], (size) => {
				grSet.hiResAudioBadgeSize = size;
				RepaintWindow();
			}, !grSet.showHiResAudioBadge);
			showHiResAudioLogoMenu.addSeparator();
			showHiResAudioLogoMenu.addRadioItems(['Top left', 'Top right', 'Bottom left', 'Bottom right'], grSet.hiResAudioBadgePos, ['topleft', 'topright', 'bottomleft', 'bottomright'], (pos) => {
				grSet.hiResAudioBadgePos = pos;
				RepaintWindow();
			}, !grSet.showHiResAudioBadge);
			showHiResAudioLogoMenu.appendTo(playerControlsAlbumArtMenu);
			playerControlsAlbumArtMenu.addToggleItem('Show pause on album cover', grSet, 'showPause', () => { RepaintWindow(); });
			playerControlsAlbumArtMenu.appendTo(playerControlsMenu);
		}

		// * JUMP SEARCH * //
		const playerControlsJumpSearchMenu = new Menu('Jump search');
		playerControlsJumpSearchMenu.addToggleItem('Include library in playlist search query', grSet, 'jumpSearchIncludeLibrary');
		playerControlsJumpSearchMenu.addToggleItem('Include playlist in library search query', grSet, 'jumpSearchIncludePlaylist');
		playerControlsJumpSearchMenu.addSeparator();
		playerControlsJumpSearchMenu.addToggleItem('Composer only in jump search query', grSet, 'jumpSearchComposerOnly');
		playerControlsJumpSearchMenu.addSeparator();
		playerControlsJumpSearchMenu.addToggleItem('Disable jump search', grSet, 'jumpSearchDisabled');
		playerControlsJumpSearchMenu.appendTo(playerControlsMenu);

		// * SCROLLBAR * //
		const playerControlsScrollbarMenu = new Menu('Scrollbar');
		const playerControlsScrollbarPlaylistMenu = new Menu('Playlist');
		const playerControlsScrollbarPlaylistStepsMenu = new Menu('Mouse wheel scroll steps');
		playerControlsScrollbarPlaylistStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], grSet.playlistWheelScrollSteps, [0.5, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
			grSet.playlistWheelScrollSteps = steps;
			playlistCallback();
		});
		playerControlsScrollbarPlaylistStepsMenu.appendTo(playerControlsScrollbarPlaylistMenu);
		const playerControlsScrollbarPlaylistDurationMenu = new Menu('Mouse wheel scroll smooth duration');
		playerControlsScrollbarPlaylistDurationMenu.addRadioItems(['100ms', '200ms', '300ms (default)', '400ms', '500ms', '600ms', '700ms', '800ms', '900ms', '1000ms'], grSet.playlistWheelScrollDuration, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], (duration) => {
			grSet.playlistWheelScrollDuration = duration;
			playlistCallback();
		});
		playerControlsScrollbarPlaylistDurationMenu.appendTo(playerControlsScrollbarPlaylistMenu);
		playerControlsScrollbarPlaylistMenu.addSeparator();
		playerControlsScrollbarPlaylistMenu.addToggleItem('Auto-scroll to current playing song', grSet, 'playlistAutoScrollNowPlaying');
		playerControlsScrollbarPlaylistMenu.addToggleItem('Auto-hide', grSet, 'playlistAutoHideScrollbar',  () => {
			plSet.show_scrollbar = !grSet.playlistAutoHideScrollbar;
			grm.ui.updatePlaylist();
		});
		playerControlsScrollbarPlaylistMenu.addToggleItem('Smooth scroll', grSet, 'playlistSmoothScrolling');
		playerControlsScrollbarPlaylistMenu.appendTo(playerControlsScrollbarMenu);

		const playerControlsScrollbarLibraryMenu = new Menu('Library');
		const playerControlsScrollbarLibraryStepsMenu = new Menu('Mouse wheel scroll steps');
		playerControlsScrollbarLibraryStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], libSet.scrollStep, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
			libSet.scrollStep = steps;
			lib.panel.updateProp(1);
		});
		playerControlsScrollbarLibraryStepsMenu.appendTo(playerControlsScrollbarLibraryMenu);
		const playerControlsScrollbarLibraryDurationMenu = new Menu('Mouse wheel scroll smooth duration');
		playerControlsScrollbarLibraryDurationMenu.addRadioItems(['100ms', '200ms', '300ms', '400ms', '500ms (default)', '600ms', '700ms', '800ms', '900ms', '1000ms'], libSet.durationScroll, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], (duration) => {
			libSet.durationScroll = duration;
			lib.panel.updateProp(1);
		});
		playerControlsScrollbarLibraryDurationMenu.appendTo(playerControlsScrollbarLibraryMenu);
		playerControlsScrollbarLibraryMenu.addSeparator();
		playerControlsScrollbarLibraryMenu.addToggleItem('Auto-scroll to current playing song', grSet, 'libraryAutoScrollNowPlaying');
		playerControlsScrollbarLibraryMenu.addToggleItem('Auto-hide', grSet, 'libraryAutoHideScrollbar', () => {
			libSet.sbarShow = grSet.libraryAutoHideScrollbar ? 1 : 2;
			grm.ui.setLibrarySize();
		});
		playerControlsScrollbarLibraryMenu.addToggleItem('Smooth scroll', libSet, 'smooth');
		playerControlsScrollbarLibraryMenu.appendTo(playerControlsScrollbarMenu);

		const playerControlsBiographyMenu = new Menu('Biography');
		const playerControlsScrollbarBiographyStepsMenu = new Menu('Mouse wheel scroll steps');
		playerControlsScrollbarBiographyStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], bioSet.scrollStep, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
			bioSet.scrollStep = steps;
			bio.ui.updateProp(1);
		});
		playerControlsScrollbarBiographyStepsMenu.appendTo(playerControlsBiographyMenu);
		const playerControlsScrollbarBiographyDurationMenu = new Menu('Mouse wheel scroll smooth duration');
		playerControlsScrollbarBiographyDurationMenu.addRadioItems(['100ms', '200ms', '300ms', '400ms', '500ms (default)', '600ms', '700ms', '800ms', '900ms', '1000ms'], bioSet.durationScroll, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], (duration) => {
			bioSet.durationScroll = duration;
			bio.ui.updateProp(1);
		});
		playerControlsScrollbarBiographyDurationMenu.appendTo(playerControlsBiographyMenu);
		playerControlsBiographyMenu.addSeparator();
		playerControlsBiographyMenu.addToggleItem('Auto-hide', grSet, 'biographyAutoHideScrollbar', () => {
			if (grSet.biographyAutoHideScrollbar) {
				bioSet.sbarShow = 1;
				bio.but.setScrollBtnsHide();
			} else {
				bioSet.sbarShow = 2;
				bio.but.setScrollBtnsHide(false, 'both');
			}
			bio.ui.updateProp(1);
		});
		playerControlsBiographyMenu.addToggleItem('Smooth scroll', bioSet, 'smooth');
		playerControlsBiographyMenu.appendTo(playerControlsScrollbarMenu);

		playerControlsScrollbarMenu.appendTo(playerControlsMenu);

		// * TOOLTIP * //
		const playerControlsToolTipMenu = new Menu('Tooltip');
		playerControlsToolTipMenu.addToggleItem('Show tooltips only on truncated text', grSet, 'showTooltipTruncated');
		playerControlsToolTipMenu.addSeparator();
		playerControlsToolTipMenu.addToggleItem('Show timeline tooltips', grSet, 'showTooltipTimeline');
		playerControlsToolTipMenu.addSeparator();
		const playerControlsVolumeToolTipMenu = new Menu('Show volume tooltips');
		playerControlsVolumeToolTipMenu.addToggleItem('Enabled', grSet, 'showTooltipVolume');
		playerControlsVolumeToolTipMenu.addSeparator();
		playerControlsVolumeToolTipMenu.addToggleItem('Show volume in percent', grSet, 'showTooltipVolumeInPercent');
		playerControlsVolumeToolTipMenu.appendTo(playerControlsToolTipMenu);
		playerControlsToolTipMenu.addSeparator();
		playerControlsToolTipMenu.addToggleItem('Show main tooltips', grSet, 'showTooltipMain');
		playerControlsToolTipMenu.addToggleItem('Show library tooltips', grSet, 'showTooltipLibrary', () => {
			lib.but.tooltipLib.show = grSet.showTooltipLibrary || grSet.showTooltipTruncated;
			grm.ui.setLibrarySize();
		});
		playerControlsToolTipMenu.addToggleItem('Show biography tooltips', grSet, 'showTooltipBiography', () => {
			bio.but.tooltipBio.show = grSet.showTooltipBiography || grSet.showTooltipTruncated;
			grm.ui.setBiographySize();
		});
		playerControlsToolTipMenu.addSeparator();
		playerControlsToolTipMenu.addToggleItem('Show styled tooltips', grSet, 'showStyledTooltips');
		playerControlsToolTipMenu.appendTo(playerControlsMenu);

		// * PANEL MENU * //
		const playerControlsPanelMenu = new Menu('Panel');
		const playerControlsPanelNotPropMenu = new Menu('Width');
		playerControlsPanelNotPropMenu.addToggleItem('Use auto panel width', grSet, 'panelWidthAuto', () => {
			grSet.albumArtAlign = grSet.panelWidthAuto ? 'left' : 'right';
			grm.ui.resizeArtwork(true);
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			grm.ui.setLibrarySize();
			grm.ui.setBiographySize();
			RepaintWindow();
		});
		playerControlsPanelNotPropMenu.appendTo(playerControlsPanelMenu);
		playerControlsPanelMenu.addSeparator();
		if (grSet.layout !== 'compact') {
			const showPanelOnStartupMenu = new Menu('Show panel on startup');
			showPanelOnStartupMenu.addRadioItems(grSet.layout === 'artwork' ? ['Cover', 'Playlist', 'Details', 'Library', 'Biography', 'Lyrics'] : ['Playlist', 'Details', 'Library', 'Biography', 'Lyrics'],
			grSet.showPanelOnStartup, grSet.layout === 'artwork' ? ['cover', 'playlist', 'details', 'library', 'biography', 'lyrics'] : ['playlist', 'details', 'library', 'biography', 'lyrics'], (panel) => {
				grSet.showPanelOnStartup = panel;
				window.Reload();
			});
			showPanelOnStartupMenu.appendTo(playerControlsPanelMenu);
		}
		playerControlsPanelMenu.addToggleItem('Show logo on preloader', grSet, 'showPreloaderLogo', () => { RepaintWindow(); });
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Return to home on playback stop', grSet, 'returnToHomeOnPlaybackStop');
		playerControlsPanelMenu.addToggleItem('Switch to playlist when adding songs', grSet, 'addTracksPlaylistSwitch');
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Hide middle panel shadow', grSet, 'hideMiddlePanelShadow', () => { RepaintWindow(); });
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Disable fullscreen ESC', grSet, 'fullscreenESCDisabled');
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Lock player size', grSet, 'lockPlayerSize', () => { UIHacks.DisableSizing = true; });
		playerControlsPanelMenu.appendTo(playerControlsMenu);

		// * LOWER BAR MENU * //
		const playerControlsLowerBarMenu = new Menu('Lower bar');
		// * TRANSPORT BUTTON SIZE * //
		const transportSizeMenu = new Menu('Transport button size');
		const transportSizeMenuDefault = new Menu('Default');
		transportSizeMenuDefault.addRadioItems(['28px', '30px', '32px (default)', '34px', '36px', '38px', '40px', '42px'], grSet.transportButtonSize_default, [28, 30, 32, 34, 36, 38, 40, 42], (size) => {
			if (size === -1) {
				grSet.transportButtonSize_default -= 2;
			} else if (size === 999) {
				grSet.transportButtonSize_default += 2;
			} else {
				grSet.transportButtonSize_default = size;
			}
			grm.ui.createFonts();
			updateButtons();
		});
		transportSizeMenuDefault.appendTo(transportSizeMenu);

		const transportSizeMenuArtwork = new Menu('Artwork');
		transportSizeMenuArtwork.addRadioItems(['28px', '30px', '32px (default)', '34px', '36px'], grSet.transportButtonSize_artwork, [28, 30, 32, 34, 36], (size) => {
			if (size === -1) {
				grSet.transportButtonSize_artwork -= 2;
			} else if (size === 999) {
				grSet.transportButtonSize_artwork += 2;
			} else {
				grSet.transportButtonSize_artwork = size;
			}
			grm.ui.createFonts();
			updateButtons();
		});
		transportSizeMenuArtwork.appendTo(transportSizeMenu);

		const transportSizeMenuCompact = new Menu('Compact');
		transportSizeMenuCompact.addRadioItems(['28px', '30px', '32px (default)', '34px', '36px'], grSet.transportButtonSize_compact, [28, 30, 32, 34, 36], (size) => {
			if (size === -1) {
				grSet.transportButtonSize_compact -= 2;
			} else if (size === 999) {
				grSet.transportButtonSize_compact += 2;
			} else {
				grSet.transportButtonSize_compact = size;
			}
			grm.ui.createFonts();
			updateButtons();
		});
		transportSizeMenuCompact.appendTo(transportSizeMenu);
		transportSizeMenu.appendTo(playerControlsLowerBarMenu);

		// * TRANSPORT BUTTON SPACING * //
		const transportSpacingMenu = new Menu('Transport button spacing');
		const transportSpacingMenuDefault = new Menu('Default');
		transportSpacingMenuDefault.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], grSet.transportButtonSpacing_default, [-1, 3, 5, 7, 10, 15, 999], (size) => {
			if (size === -1) {
				grSet.transportButtonSpacing_default -= 2;
			} else if (size === 999) {
				grSet.transportButtonSpacing_default += 2;
			} else {
				grSet.transportButtonSpacing_default = size;
			}
			updateButtons();
		});
		transportSpacingMenuDefault.appendTo(transportSpacingMenu);

		const transportSpacingMenuArtwork = new Menu('Artwork');
		transportSpacingMenuArtwork.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], grSet.transportButtonSpacing_artwork, [-1, 3, 5, 7, 10, 15, 999], (size) => {
			if (size === -1) {
				grSet.transportButtonSpacing_artwork -= 2;
			} else if (size === 999) {
				grSet.transportButtonSpacing_artwork += 2;
			} else {
				grSet.transportButtonSpacing_artwork = size;
			}
			updateButtons();
		});
		transportSpacingMenuArtwork.appendTo(transportSpacingMenu);

		const transportSpacingMenuCompact = new Menu('Compact');
		transportSpacingMenuCompact.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], grSet.transportButtonSpacing_compact, [-1, 3, 5, 7, 10, 15, 999], (size) => {
			if (size === -1) {
				grSet.transportButtonSpacing_compact -= 2;
			} else if (size === 999) {
				grSet.transportButtonSpacing_compact += 2;
			} else {
				grSet.transportButtonSpacing_compact = size;
			}
			updateButtons();
		});
		transportSpacingMenuCompact.appendTo(transportSpacingMenu);
		transportSpacingMenu.appendTo(playerControlsLowerBarMenu);
		playerControlsLowerBarMenu.addSeparator();

		// * SHOW TRANSPORT CONTROLS * //
		const transportControlsMenu = new Menu('Show transport controls');
		transportControlsMenu.addToggleItem('Default', grSet, 'showTransportControls_default', () => {
			updateButtons();
		});
		transportControlsMenu.addToggleItem('Artwork', grSet, 'showTransportControls_artwork', () => {
			updateButtons();
		});
		transportControlsMenu.addToggleItem('Compact', grSet, 'showTransportControls_compact', () => {
			updateButtons();
		});
		transportControlsMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW PLAYBACK ORDER BUTTON * //
		const playbackOrderBtnMenu = new Menu('Show playback order button');
		playbackOrderBtnMenu.addToggleItem('Default', grSet, 'showPlaybackOrderBtn_default', () => {
			updateButtons();
		}, !grSet.showTransportControls_default);
		playbackOrderBtnMenu.addToggleItem('Artwork', grSet, 'showPlaybackOrderBtn_artwork', () => {
			updateButtons();
		}, !grSet.showTransportControls_artwork);
		playbackOrderBtnMenu.addToggleItem('Compact', grSet, 'showPlaybackOrderBtn_compact', () => {
			updateButtons();
		}, !grSet.showTransportControls_compact);
		playbackOrderBtnMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW RELOAD BUTTON * //
		const reloadBtnMenu = new Menu('Show reload button');
		reloadBtnMenu.addToggleItem('Default', grSet, 'showReloadBtn_default', () => {
			updateButtons();
		}, !grSet.showTransportControls_default);
		reloadBtnMenu.addToggleItem('Artwork', grSet, 'showReloadBtn_artwork', () => {
			updateButtons();
		}, !grSet.showTransportControls_artwork);
		reloadBtnMenu.addToggleItem('Compact', grSet, 'showReloadBtn_compact', () => {
			updateButtons();
		}, !grSet.showTransportControls_compact);
		reloadBtnMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW ADD TRACKS BUTTON * //
		const addTrackBtnMenu = new Menu('Show add tracks button');
		addTrackBtnMenu.addToggleItem('Default', grSet, 'showAddTracksBtn_default', () => {
			updateButtons();
		}, !grSet.showTransportControls_default);
		addTrackBtnMenu.addToggleItem('Artwork', grSet, 'showAddTracksBtn_artwork', () => {
			updateButtons();
		}, !grSet.showTransportControls_artwork);
		addTrackBtnMenu.addToggleItem('Compact', grSet, 'showAddTracksBtn_compact', () => {
			updateButtons();
		}, !grSet.showTransportControls_compact);
		addTrackBtnMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW VOLUME BUTTON * //
		const volumeBtnMenu = new Menu('Show volume button');
		volumeBtnMenu.addToggleItem('Default', grSet, 'showVolumeBtn_default', () => {
			updateButtons();
		}, !grSet.showTransportControls_default);
		volumeBtnMenu.addToggleItem('Artwork', grSet, 'showVolumeBtn_artwork', () => {
			updateButtons();
		}, !grSet.showTransportControls_artwork);
		volumeBtnMenu.addToggleItem('Compact', grSet, 'showVolumeBtn_compact', () => {
			updateButtons();
		}, !grSet.showTransportControls_compact);
		volumeBtnMenu.addSeparator();
		volumeBtnMenu.addToggleItem('Auto-hide bar', grSet, 'autoHideVolumeBar', () => {
			grm.volBtn.toggleVolumeBar();
			updateButtons();
		});
		volumeBtnMenu.appendTo(playerControlsLowerBarMenu);
		playerControlsLowerBarMenu.addSeparator();

		// * SHOW PLAYBACK TIME IN LOWER BAR * //
		const playbackTimeMenu = new Menu('Show playback time');
		playbackTimeMenu.addToggleItem('Default', grSet, 'showPlaybackTime_default', () => {
			updateButtons();
		});
		playbackTimeMenu.addToggleItem('Artwork', grSet, 'showPlaybackTime_artwork', () => {
			updateButtons();
		});
		playbackTimeMenu.addToggleItem('Compact', grSet, 'showPlaybackTime_compact', () => {
			updateButtons();
		});
		playbackTimeMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW ARTIST IN LOWER BAR * //
		const showArtistMenu = new Menu('Show artist');
		showArtistMenu.addToggleItem('Default', grSet, 'showLowerBarArtist_default', () => { RepaintWindow(); });
		showArtistMenu.addToggleItem('Artwork', grSet, 'showLowerBarArtist_artwork', () => { RepaintWindow(); });
		showArtistMenu.addToggleItem('Compact', grSet, 'showLowerBarArtist_compact', () => { RepaintWindow(); });
		showArtistMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW TRACK NUMBER IN LOWER BAR * //
		const showTrackNumberMenu = new Menu('Show track number');
		showTrackNumberMenu.addToggleItem('Default', grSet, 'showLowerBarTrackNum_default', () => { on_metadb_changed(); RepaintWindow(); });
		showTrackNumberMenu.addToggleItem('Artwork', grSet, 'showLowerBarTrackNum_artwork', () => { on_metadb_changed(); RepaintWindow(); });
		showTrackNumberMenu.addToggleItem('Compact', grSet, 'showLowerBarTrackNum_compact', () => { on_metadb_changed(); RepaintWindow(); });
		showTrackNumberMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW SONG TITLE IN LOWER BAR * //
		const showTitleMenu = new Menu('Show song title');
		showTitleMenu.addToggleItem('Default', grSet, 'showLowerBarTitle_default', () => { RepaintWindow(); });
		showTitleMenu.addToggleItem('Artwork', grSet, 'showLowerBarTitle_artwork', () => { RepaintWindow(); });
		showTitleMenu.addToggleItem('Compact', grSet, 'showLowerBarTitle_compact', () => { RepaintWindow(); });
		showTitleMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW COMPOSER IN LOWER BAR * //
		const showComposerMenu = new Menu('Show composer');
		showComposerMenu.addToggleItem('Default', grSet, 'showLowerBarComposer_default', () => { RepaintWindow(); });
		showComposerMenu.addToggleItem('Artwork', grSet, 'showLowerBarComposer_artwork', () => { RepaintWindow(); });
		showComposerMenu.addToggleItem('Compact', grSet, 'showLowerBarComposer_compact', () => { RepaintWindow(); });
		showComposerMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW ARTIST COUNTRY FLAGS IN LOWER BAR * //
		const showArtistFlagsMenu = new Menu('Show artist country flags');
		showArtistFlagsMenu.addToggleItem('Default', grSet, 'showLowerBarArtistFlags_default', () => { grm.ui.loadCountryFlags(); RepaintWindow(); });
		showArtistFlagsMenu.addToggleItem('Artwork', grSet, 'showLowerBarArtistFlags_artwork', () => { grm.ui.loadCountryFlags(); RepaintWindow(); });
		showArtistFlagsMenu.addToggleItem('Compact', grSet, 'showLowerBarArtistFlags_compact', () => { grm.ui.loadCountryFlags(); RepaintWindow(); });
		showArtistFlagsMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW SOFTWARE VERSION IN LOWER BAR * //
		const showSoftwareVersionMenu = new Menu('Show software version');
		showSoftwareVersionMenu.addToggleItem('Default', grSet, 'showLowerBarVersion_default', () => { grm.ui.initMain(); });
		showSoftwareVersionMenu.addToggleItem('Artwork', grSet, 'showLowerBarVersion_artwork', () => { grm.ui.initMain(); });
		showSoftwareVersionMenu.addToggleItem('Compact', grSet, 'showLowerBarVersion_compact', () => { grm.ui.initMain(); });
		showSoftwareVersionMenu.appendTo(playerControlsLowerBarMenu);
		playerControlsLowerBarMenu.addSeparator();

		// * SHOW PROGRESS BAR * //
		const progressBarMenu = new Menu('Show progress bar');
		progressBarMenu.addToggleItem('Default', grSet, 'showProgressBar_default', () => { updateSeekbar(); });
		progressBarMenu.addToggleItem('Artwork', grSet, 'showProgressBar_artwork', () => { updateSeekbar(); });
		progressBarMenu.addToggleItem('Compact', grSet, 'showProgressBar_compact', () => { updateSeekbar(); });
		progressBarMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW PEAKMETER BAR * //
		const peakmeterBarMenu = new Menu('Show peakmeter bar');
		peakmeterBarMenu.addToggleItem('Default', grSet, 'showPeakmeterBar_default', () => { updateSeekbar(); });
		peakmeterBarMenu.addToggleItem('Artwork', grSet, 'showPeakmeterBar_artwork', () => { updateSeekbar(); });
		peakmeterBarMenu.addToggleItem('Compact', grSet, 'showPeakmeterBar_compact', () => { updateSeekbar(); });
		peakmeterBarMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW WAVEFORM BAR * //
		const waveformBarMenu = new Menu('Show waveform bar');
		waveformBarMenu.addToggleItem('Default', grSet, 'showWaveformBar_default', () => { updateSeekbar(); });
		waveformBarMenu.addToggleItem('Artwork', grSet, 'showWaveformBar_artwork', () => { updateSeekbar(); });
		waveformBarMenu.addToggleItem('Compact', grSet, 'showWaveformBar_compact', () => { updateSeekbar(); });
		waveformBarMenu.appendTo(playerControlsLowerBarMenu);
		playerControlsLowerBarMenu.addSeparator();

		// * ADD TRACKS BUTTON CONTROLS * //
		const addTracksBtnControlsMenu = new Menu('Add tracks button');
		addTracksBtnControlsMenu.addItem('Add tracks playlist', false, () => { grm.inputBox.addTracksPlaylist(); });
		addTracksBtnControlsMenu.appendTo(playerControlsLowerBarMenu);

		playerControlsLowerBarMenu.appendTo(playerControlsMenu);

		// * SEEKBAR - PROGRESS BAR * //
		const playerControlsSeekBarMenu = new Menu('Seekbar');
		playerControlsSeekBarMenu.createRadioSubMenu('Type', ['Progress bar', 'Peakmeter bar', 'Waveform bar'], grSet.seekbar, ['progressbar', 'peakmeterbar', 'waveformbar'], (type) => {
			grSet.seekbar = type;
			if (grSet.seekbar === 'waveformbar') {
				grm.waveBar.updateBar();
			}
			grm.ui.setProgressBarRefresh();
			RepaintWindow();
		});
		const playerControlsProgressBarMenu = new Menu('Progress bar');
		playerControlsProgressBarMenu.createRadioSubMenu('Style', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], grSet.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (style) => {
			grSet.styleProgressBarDesign = style;
			grm.ui.initMetrics();
			RepaintWindow();
		});
		playerControlsProgressBarMenu.createRadioSubMenu('Mouse wheel seek speed', ['  1 sec', '  2 sec', '  3 sec', '  4 sec', '  5 sec (default)', '  6 sec', '  7 sec', '  8 sec', '  9 sec', '10 sec'], grSet.progressBarWheelSeekSpeed, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (speed) => {
			grSet.progressBarWheelSeekSpeed = speed;
		});
		playerControlsProgressBarMenu.createRadioSubMenu('Refresh rate', ['1000 ms (very slow CPU)', '  500 ms', '  333 ms', '  Variable (default)', '  100 ms', '    60 ms', '    30 ms (very fast CPU)'], grSet.progressBarRefreshRate, [1000, 500, 333, 'variable', 100, 60, 30], (rate) => {
			grSet.progressBarRefreshRate = rate;
			grm.ui.setProgressBarRefresh();
		}, !grSet.showProgressBar_default || !grSet.showProgressBar_artwork || !grSet.showProgressBar_compact);
		playerControlsProgressBarMenu.appendTo(playerControlsSeekBarMenu);

		// * SEEKBAR - PEAKMETER BAR * //
		const playerControlspeakmeterBarMenu = new Menu('Peakmeter bar');
		playerControlspeakmeterBarMenu.createRadioSubMenu('Style', ['Horizontal', 'Horizontal center', 'Vertical'], grSet.peakmeterBarDesign, ['horizontal', 'horizontal_center', 'vertical'], (design) => {
			grSet.peakmeterBarDesign = design;
			RepaintWindow();
		});
		if (grSet.peakmeterBarDesign === 'vertical') {
			playerControlspeakmeterBarMenu.createRadioSubMenu('Size', ['  0 px', '  2 px', '  4 px', '  6 px', '  8 px', '10 px', grSet.layout !== 'default' ? '12 px (default)' : '12 px', '14 px', '16 px', '18 px', grSet.layout !== 'default' ? '20 px' : '20 px (default)', '25 px', '30 px', '35 px', '40 px', 'Minimum'], grSet.peakmeterBarVertSize, [0, 2, 4, 6, 8, 10, 20, 25, 30, 35, 40, 'min'], (size) => {
				grSet.peakmeterBarVertSize = size;
				RepaintWindow();
			});
			playerControlspeakmeterBarMenu.createRadioSubMenu('Decibel range', ['2 to -20 db (default)', '2 to -15 db', '2 to -10 db', '3 to -20 db', '3 to -15 db', '3 to -10 db', '5 to -20 db', '5 to -15 db', '5 to -10 db'], grSet.peakmeterBarVertDbRange, [220, 215, 210, 320, 315, 310, 520, 515, 510], (range) => {
				grSet.peakmeterBarVertDbRange = range;
				RepaintWindow();
			});
		}
		const playerControlspeakmeterBarDisplayMenu = new Menu('Display');
		if (grSet.peakmeterBarDesign === 'horizontal' || grSet.peakmeterBarDesign === 'horizontal_center') {
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show over bars', grSet, 'peakmeterBarOverBars', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addSeparator();
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show outer bars', grSet, 'peakmeterBarOuterBars', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show outer peaks', grSet, 'peakmeterBarOuterPeaks', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addSeparator();
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show main bars', grSet, 'peakmeterBarMainBars', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show main peaks', grSet, 'peakmeterBarMainPeaks', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addSeparator();
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show middle bars', grSet, 'peakmeterBarMiddleBars', () => { RepaintWindow(); });
		}
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show progress bar', grSet, 'peakmeterBarProgBar', () => { RepaintWindow(); });
		if (grSet.peakmeterBarDesign === 'horizontal' || grSet.peakmeterBarDesign === 'horizontal_center') {
			playerControlspeakmeterBarDisplayMenu.addSeparator();
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show gaps', grSet, 'peakmeterBarGaps', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show grid', grSet, 'peakmeterBarGrid', () => { grm.peakBar.on_size(grm.ui.ww, grm.ui.wh); RepaintWindow(); });
		}
		if (grSet.peakmeterBarDesign === 'vertical') {
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show peaks', grSet, 'peakmeterBarVertPeaks', () => { RepaintWindow(); });
			playerControlspeakmeterBarDisplayMenu.addToggleItem('Show baseline', grSet, 'peakmeterBarVertBaseline', () => { RepaintWindow(); });
		}
		playerControlspeakmeterBarDisplayMenu.addToggleItem(grSet.layout !== 'default' ? 'Show info (only available in Default layout)' : 'Show info', grSet, 'peakmeterBarInfo', () => { RepaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.appendTo(playerControlspeakmeterBarMenu);
		playerControlspeakmeterBarMenu.createRadioSubMenu('Refresh rate', ['  200 ms (very slow CPU)', '  150 ms', '  120 ms', '  100 ms', '    80 ms (default)', '    60 ms', '    30 ms (very fast CPU)'], grSet.peakmeterBarRefreshRate, [200, 150, 120, 100, 80, 60, 30], (rate) => {
			grSet.peakmeterBarRefreshRate = rate;
			grm.ui.setProgressBarRefresh();
		}, !grSet.showPeakmeterBar_default || !grSet.showPeakmeterBar_artwork || !grSet.showPeakmeterBar_compact);
		playerControlspeakmeterBarMenu.appendTo(playerControlsSeekBarMenu);

		// * SEEKBAR - WAVEFORM BAR * //
		const playerControlsWaveformBarMenu = new Menu('Waveform bar');
		playerControlsWaveformBarMenu.createRadioSubMenu(`Analysis${grSet.waveformBarMode === 'ffprobe' ? '' : '\t (ffprobe only)'}`,
			['RMS level', 'Peak level', 'RMS peak'], grSet.waveformBarAnalysis, ['rms_level', 'peak_level', 'rms_peak'], (type) => {
			grSet.waveformBarAnalysis = type;
			grm.waveBar.updateConfig({ preset: { analysisMode: type } });
			grm.waveBar.updateBar();
			RepaintWindow();
		}, grSet.waveformBarMode !== 'ffprobe');

		playerControlsWaveformBarMenu.createRadioSubMenu('Mode', ['FFprobe', 'Audiowaveform', 'Visualizer'], grSet.waveformBarMode, ['ffprobe', 'audiowaveform', 'visualizer'], (mode) => {
			grSet.waveformBarMode = mode;
			grm.waveBar.updateConfig({ analysis: { binaryMode: mode } });
			grm.waveBar.updateBar();
			RepaintWindow();
		});

		playerControlsWaveformBarMenu.createRadioSubMenu('Style', ['Waveform', 'Bars', 'Dots', 'Halfbars'], grSet.waveformBarDesign, ['waveform', 'bars', 'dots', 'halfbars'], (design) => {
			grSet.waveformBarDesign = design;
			grm.waveBar.updateConfig({ preset: { barDesign: design } });
		});

		const playerControlsWaveformBarSizeMenu = new Menu('Size');
		playerControlsWaveformBarSizeMenu.createRadioSubMenu('Waveform', ['1', '2', '3', '4', '5'], grSet.waveformBarSizeWave, [1, 2, 3, 4, 5], (size) => {
			grSet.waveformBarSizeWave = size;
			grm.waveBar.updateConfig({ ui: { sizeWave: size } });
		});
		playerControlsWaveformBarSizeMenu.createRadioSubMenu('Bars', ['1', '2', '3', '4', '5'], grSet.waveformBarSizeBars, [1, 2, 3, 4, 5], (size) => {
			grSet.waveformBarSizeBars = size;
			grm.waveBar.updateConfig({ ui: { sizeBars: size } });
		});
		playerControlsWaveformBarSizeMenu.createRadioSubMenu('Dots', ['1', '2', '3', '4', '5'], grSet.waveformBarSizeDots, [1, 2, 3, 4, 5], (size) => {
			grSet.waveformBarSizeDots = size;
			grm.waveBar.updateConfig({ ui: { sizeDots: size } });
		});
		playerControlsWaveformBarSizeMenu.createRadioSubMenu('Halfbars', ['1', '2', '3', '4', '5'], grSet.waveformBarSizeHalf, [1, 2, 3, 4, 5], (size) => {
			grSet.waveformBarSizeHalf = size;
			grm.waveBar.updateConfig({ ui: { sizeHalf: size } });
		});
		playerControlsWaveformBarSizeMenu.addSeparator();
		playerControlsWaveformBarSizeMenu.addToggleItem('Normalize width', grSet, 'waveformBarSizeNormalize', () => {
			grm.waveBar.updateConfig({ ui: { sizeNormalizeWidth: grSet.waveformBarSizeNormalize } });
		});
		playerControlsWaveformBarSizeMenu.appendTo(playerControlsWaveformBarMenu);

		const playerControlsWaveformBarDisplayMenu = new Menu(`Display${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`);
		playerControlsWaveformBarDisplayMenu.addRadioItems(['Full', 'Partial'], grSet.waveformBarPaint, ['full', 'partial'], (paint) => {
			grSet.waveformBarPaint = paint;
			grm.waveBar.updateConfig({ preset: { paintMode: paint } });
		});
		playerControlsWaveformBarDisplayMenu.addSeparator();

		playerControlsWaveformBarDisplayMenu.addToggleItem(`Prepaint${grSet.waveformBarPaint === 'full' ? '\t(partial only)' : ''}`, grSet, 'waveformBarPrepaint', () => {
			grm.waveBar.updateConfig({ preset: { prepaint: grSet.waveformBarPrepaint } });
		}, grSet.waveformBarPaint === 'full');

		const waveformBarPrepaintMenuDisabled = grSet.waveformBarPaint === 'full' || grSet.waveformBarMode === 'visualizer' || !grSet.waveformBarPrepaint;
		playerControlsWaveformBarDisplayMenu.createRadioSubMenu('Prepaint front', ['  2 secs', '  5 secs', '10 secs', '     Full'], grSet.waveformBarPrepaintFront, [2, 5, 10, Infinity], (time) => {
			grSet.waveformBarPrepaintFront = time;
			grm.waveBar.updateConfig({ preset: { prepaintFront: time } });
		}, waveformBarPrepaintMenuDisabled);
		playerControlsWaveformBarDisplayMenu.appendTo(playerControlsWaveformBarMenu);
		playerControlsWaveformBarDisplayMenu.addSeparator();

		playerControlsWaveformBarDisplayMenu.addToggleItem('Animate', grSet, 'waveformBarAnimate', () => {
			grm.waveBar.updateConfig({ preset: { animate: grSet.waveformBarAnimate } });
		});

		playerControlsWaveformBarDisplayMenu.addToggleItem(`Use BPM${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, grSet, 'waveformBarBPM', () => {
			if (grSet.waveformBarBPM) grSet.waveformBarRefreshRateVar = true;
			grm.waveBar.updateConfig({
				preset: { useBPM: grSet.waveformBarBPM },
				ui: { refreshRateVar: grSet.waveformBarRefreshRateVar }
			});
		}, !(grSet.waveformBarPaint === 'partial' && grSet.waveformBarPrepaint || grSet.waveformBarMode === 'visualizer'));

		playerControlsWaveformBarDisplayMenu.addToggleItem('Invert halfbars', grSet, 'waveformBarInvertHalfbars', () => {
			grm.waveBar.updateConfig({ preset: { invertHalfbars: grSet.waveformBarInvertHalfbars } });
		});
		playerControlsWaveformBarDisplayMenu.addSeparator();

		playerControlsWaveformBarDisplayMenu.addToggleItem('Show indicator', grSet, 'waveformBarIndicator', () => {
			grm.waveBar.updateConfig({ preset: { indicator: grSet.waveformBarIndicator } });
		});

		const playerControlsWaveformBarRefreshMenu = new Menu(`Refresh rate${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`);
		const waveformBarRefreshMenuDisabled = grSet.waveformBarPaint === 'full' || grSet.waveformBarMode === 'visualizer' || !grSet.waveformBarPrepaint;
		playerControlsWaveformBarRefreshMenu.addRadioItems(['1000 ms (very slow CPU)', '  500 ms', '  200 ms', '  100 ms (default)', '    80 ms', '    60 ms', '    30 ms (very fast CPU)'], grSet.waveformBarRefreshRate, [1000, 500, 200, 100, 80, 60, 30], (rate) => {
			grSet.waveformBarRefreshRate = rate;
			grm.waveBar.updateConfig({ ui: { refreshRate: rate } });
		}, waveformBarRefreshMenuDisabled);
		playerControlsWaveformBarRefreshMenu.addSeparator();
		playerControlsWaveformBarRefreshMenu.addToggleItem('    Variable refresh rate', grSet, 'waveformBarRefreshRateVar', () => {
			grm.waveBar.updateConfig({ ui: { refreshRateVar: grSet.waveformBarRefreshRateVar } });
		});
		playerControlsWaveformBarRefreshMenu.appendTo(playerControlsWaveformBarMenu);
		playerControlsWaveformBarMenu.appendTo(playerControlsSeekBarMenu);
		playerControlsSeekBarMenu.appendTo(playerControlsMenu);

		playerControlsMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Playlist.
	 * @param {Menu} menu - Creates the Playlist panel menu via a new Menu instance.
	 * @param {boolean} context_menu - Appends Playlist panel options to context menu.
	 * @protected
	 */
	playlistOptions(menu, context_menu) {
		const playlistMenu = context_menu ? menu : new Menu('Playlist');

		const playlistCallback = () => {
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		// * LAYOUT * //
		if (grSet.layout === 'default') {
			playlistMenu.createRadioSubMenu('Layout', ['Normal', 'Full'], grSet.playlistLayout, ['normal', 'full'], (width) => {
				grSet.playlistLayout = width;
				if (!grm.ui.displayPlaylist) { grm.ui.displayPlaylist = true; grm.ui.displayLibrary = false; grm.ui.displayBiography = false; }
				if (grm.ui.displayLyrics) grm.ui.displayLyrics = false;
				grm.ui.resizeArtwork(true);
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
				grm.jSearch.on_size();
				grm.button.initButtonState();
				RepaintWindow();
			});
		}

		// * PLAYLIST MANAGER * //
		const playlistManagerMenu = new Menu('Playlist manager');
		const playlistManagerShowMenu = new Menu('Show playlist manager');
		playlistManagerShowMenu.addToggleItem('Default', grSet, 'showPlaylistManager_default', playlistCallback);
		playlistManagerShowMenu.addToggleItem('Artwork', grSet, 'showPlaylistManager_artwork', playlistCallback);
		playlistManagerShowMenu.addToggleItem('Compact', grSet, 'showPlaylistManager_compact', playlistCallback);
		playlistManagerShowMenu.appendTo(playlistManagerMenu);
		playlistManagerMenu.addToggleItem('Show playlist history', grSet, 'showPlaylistHistory',  () => { RepaintWindow(); });
		playlistManagerMenu.addToggleItem('Auto-hide', grSet, 'autoHidePlman',  () => { grm.ui.initTheme(); });
		playlistManagerMenu.appendTo(playlistMenu);

		// * ALBUM HEADER * //
		const playlistAlbumMenu = new Menu('Album header');
		const playlistAlbumArtMenu = new Menu('Album art');
		playlistAlbumArtMenu.addToggleItem('Show', plSet, 'show_album_art', () => { grm.ui.updatePlaylist(); });
		playlistAlbumArtMenu.addToggleItem('Auto-hide when no cover', plSet, 'auto_album_art', () => { grm.ui.updatePlaylist(); });
		playlistAlbumArtMenu.appendTo(playlistAlbumMenu);
		playlistAlbumMenu.addSeparator();

		playlistAlbumMenu.addToggleItem('Album header', plSet, 'show_header', () => {
			grm.ui.updatePlaylist();
		});
		playlistAlbumMenu.addToggleItem('Compact header', plSet, 'use_compact_header', () => {
			PlaylistRescale(true);
			grm.ui.initPlaylist();
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		}, !plSet.show_header);
		playlistAlbumMenu.addToggleItem('Auto collapse and expand', plSet, 'auto_collapse', () => {
			grm.ui.initPlaylist();
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
		});
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Ctrl+click to follow hyperlinks', grSet, 'hyperlinksCtrlClick');
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Flip header rows', grSet, 'headerFlipRows', () => {
			grm.ui.initPlaylist();
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
		});
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Show disc sub-header', plSet, 'show_disc_header', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show group info', plSet, 'show_group_info', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show bit depth and sample rate always', grCfg.settings, 'playlistShowBitSampleAlways', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show weblinks in context menu', grSet, 'showWeblinks');
		playlistAlbumMenu.addToggleItem('Show long release date (YYYY-MM-DD)', grSet, 'showPlaylistFullDate', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Show rating', plSet, 'show_rating_header', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show PLR value', plSet, 'show_PLR_header', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addItem('Customize header info', false, () => { grm.inputBox.playlistCustomHeaderInfo(); grm.ui.updatePlaylist(); });
		playlistAlbumMenu.appendTo(playlistMenu);

		// * TRACK ROW * //
		const rowsMenu = new Menu('Track row');
		rowsMenu.addToggleItem('Show row stripes', plSet, 'show_row_stripes', playlistCallback);
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show play count', plSet, 'show_playcount', playlistCallback);
		rowsMenu.addToggleItem('Show queue position', plSet, 'show_queue_position', playlistCallback);
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show rating', plSet, 'show_rating', playlistCallback);
		rowsMenu.addToggleItem('Show rating from tags', plSet, 'use_rating_from_tags', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show rating grid', grSet, 'showPlaylistRatingGrid', playlistCallback);
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show PLR value', plSet, 'show_PLR', playlistCallback);
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show track numbers', grSet, 'showPlaylistTrackNumbers', () => { grSet.showPlaylistIndexNumbers = false; grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show index numbers', grSet, 'showPlaylistIndexNumbers', () => { grSet.showPlaylistTrackNumbers = false; grm.ui.updatePlaylist(); });
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show artist name on difference', grSet, 'showDifferentArtist', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show artist name in all rows', grSet, 'showArtistPlaylistRows', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show album title in all rows', grSet, 'showAlbumPlaylistRows', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show time remaining on playing track', grSet, 'playlistTimeRemaining', () => { RepaintWindow(); });
		rowsMenu.addToggleItem('Show vinyl style numbering if available', grSet, 'showVinylNums', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show last.fm scrobbles on no local plays', grSet, 'lastFmScrobblesFallback', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Row mouse hover', grSet, 'playlistRowHover', () => { RepaintWindow(); });
		rowsMenu.addSeparator();
		rowsMenu.addItem('Customize track row', false, () => { grm.inputBox.playlistCustomTrackRow(); grm.ui.updatePlaylist(); });
		rowsMenu.appendTo(playlistMenu);

		// * SORT ORDER * //
		const playlistSortOrderMenu = new Menu('Sort order');
		playlistSortOrderMenu.addToggleItem('Always auto-sort', grSet, 'playlistSortOrderAuto');
		playlistSortOrderMenu.addSeparator();
		playlistSortOrderMenu.addItem('Sort by...', false, () => { fb.RunMainMenuCommand('Edit/Sort/Sort by...'); grm.ui.updatePlaylist(); });
		playlistSortOrderMenu.addSeparator();

		const setSorting = () => {
			grm.ui.setPlaylistSortOrder();
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		const sortOrderWithDirection = ['artistDate', 'albumRating', 'albumPlaycount', 'trackRating', 'trackPlaycount', 'year', 'genre', 'label', 'country'];

		/** @type {string} Holds the current sort order preference without any direction suffix ('_asc' or '_dsc'). */
		let savedOrder = grSet.playlistSortOrder;
		/** @type {boolean} Indicaties if the current sort order (`savedOrder`) requires a direction. */
		let savedOrderWithDirection = sortOrderWithDirection.includes(savedOrder.slice(0, -4));
		// Remove direction from saved order for radio item checking
		if (savedOrderWithDirection) savedOrder = savedOrder.slice(0, -4);

		playlistSortOrderMenu.addRadioItems(['Order by ascending', 'Order by descending'], grSet.playlistSortOrderDirection, ['_asc', '_dsc'], (direction) => {
			grSet.playlistSortOrder = `${savedOrder}${savedOrderWithDirection ? direction : ''}`;
			setSorting();
		}, !savedOrderWithDirection);

		playlistSortOrderMenu.addSeparator();

		playlistSortOrderMenu.addRadioItems(['Default', 'Artist | date', 'Album', 'Album rating', 'Album playcount', 'Track', 'Track number', 'Track rating', 'Track playcount', 'Year', 'Genre', 'Label', 'Country', 'File path', 'Custom'], savedOrder,
			['default', 'artistDate', 'albumTitle', 'albumRating', 'albumPlaycount', 'trackTitle', 'trackNumber', 'trackRating', 'trackPlaycount', 'year', 'genre', 'label', 'country', 'filePath', 'custom'], (order) => {
			savedOrderWithDirection = sortOrderWithDirection.includes(order);
			savedOrder = order;
			grSet.playlistSortOrder = `${order}${savedOrderWithDirection ? grSet.playlistSortOrderDirection : ''}`;
			if (order === 'custom') grm.inputBox.playlistSortCustom();
			setSorting();
		}, false, !grSet.playlistSortOrderAuto);
		playlistSortOrderMenu.addSeparator();

		playlistSortOrderMenu.addItem('Randomize', false, () => { fb.RunMainMenuCommand('Edit/Sort/Randomize'); grm.ui.updatePlaylist(); });
		playlistSortOrderMenu.addItem('Reverse', false, () => { fb.RunMainMenuCommand('Edit/Sort/Reverse'); grm.ui.updatePlaylist(); });
		playlistSortOrderMenu.addSeparator();
		playlistSortOrderMenu.addItem('Save', false, () => { fb.RunMainMenuCommand('File/Save playlist...'); grm.ui.updatePlaylist(); });
		playlistSortOrderMenu.addItem('Load', false, () => { fb.RunMainMenuCommand('File/Load playlist...'); grm.ui.updatePlaylist(); });
		playlistSortOrderMenu.addItem('Undo', false, () => { fb.RunMainMenuCommand('Edit/Undo'); grm.ui.updatePlaylist(); });

		playlistSortOrderMenu.appendTo(playlistMenu);

		if (!context_menu) playlistMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Details.
	 * @param {Menu} menu - Creates the Details panel menu via a new Menu instance.
	 * @param {boolean} context_menu - Appends Details panel options to context menu.
	 * @protected
	 */
	detailsOptions(menu, context_menu) {
		const detailsMenu = context_menu ? menu : new Menu('Details');

		if (grSet.layout === 'default') {
			const discArtMenu = new Menu('Disc art');
			const displayDiscArtMenu = new Menu('Disc art placeholder');

			const setDiscArtStub = (discArt) => {
				grSet.discArtStub = discArt;
				grSet.noDiscArtStub = false;
				grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
				grm.ui.discArtArrayCover = [];
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
			};

			// * DISC ART PLACEHOLDER * //
			displayDiscArtMenu.addToggleItem('Show placeholder if no disc art found', grSet, 'showDiscArtStub', () => {
				grSet.noDiscArtStub = false;
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
			}, !grSet.displayDiscArt);
			displayDiscArtMenu.addSeparator();
			displayDiscArtMenu.addToggleItem('No placeholder', grSet, 'noDiscArtStub', () => {
				grSet.showDiscArtStub = false;
				grm.ui.discArt = grm.ui.disposeDiscArt(grm.ui.discArt);
				grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
				grm.ui.discArtArray = [];
				grm.ui.discArtArrayCover = [];
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
			}, !grSet.displayDiscArt);
			displayDiscArtMenu.addSeparator();

			const discArtCommonMenu = new Menu('Common');
			discArtCommonMenu.addRadioItems(['Common - CD - Album cover', 'Common - CD - White', 'Common - CD - Black', 'Common - CD - Blank', 'Common - CD - Transparent'],
				grSet.discArtStub, ['cdAlbumCover', 'cdWhite', 'cdBlack', 'cdBlank', 'cdTrans'], (discArt) => {
				setDiscArtStub(discArt);
			}, !grSet.displayDiscArt);
			discArtCommonMenu.addRadioItems(['Common - Vinyl - Album cover', 'Common - Vinyl - White', 'Common - Vinyl - Void', 'Common - Vinyl - Cold fusion', 'Common - Vinyl - Ring of fire', 'Common - Vinyl - Maple', 'Common - Vinyl - Black', 'Common - Vinyl - Black hole', 'Common - Vinyl - Ebony', 'Common - Vinyl - Transparent'],
				grSet.discArtStub, ['vinylAlbumCover', 'vinylWhite', 'vinylVoid', 'vinylColdFusion', 'vinylRingOfFire', 'vinylMaple', 'vinylBlack', 'vinylBlackHole', 'vinylEbony', 'vinylTrans'], (discArt) => {
				setDiscArtStub(discArt);
			}, !grSet.displayDiscArt);
			discArtCommonMenu.appendTo(displayDiscArtMenu);

			const discArtThemeMenu = new Menu('Theme');
			discArtThemeMenu.addRadioItems(['Theme - CD - Blue', 'Theme - CD - Dark blue', 'Theme - CD - Red', 'Theme - CD - Cream', 'Theme - CD - Neon blue', 'Theme - CD - Neon green', 'Theme - CD - Neon red', 'Theme - CD - Neon gold'],
				grSet.discArtStub, ['themeCdBlue', 'themeCdDarkBlue', 'themeCdRed', 'themeCdCream', 'themeCdNblue', 'themeCdNgreen', 'themeCdNred', 'themeCdNgold'], (discArt) => {
				setDiscArtStub(discArt);
			}, !grSet.displayDiscArt);
			discArtThemeMenu.addRadioItems(['Theme - Vinyl - Blue', 'Theme - Vinyl - Dark blue', 'Theme - Vinyl - Red', 'Theme - Vinyl - Cream', 'Theme - Vinyl - Neon blue', 'Theme - Vinyl - Neon green', 'Theme - Vinyl - Neon red', 'Theme - Vinyl - Neon gold'],
				grSet.discArtStub, ['themeVinylBlue', 'themeVinylDarkBlue', 'themeVinylRed', 'themeVinylCream', 'themeVinylNblue', 'themeVinylNgreen', 'themeVinylNred', 'themeVinylNgold'], (discArt) => {
				setDiscArtStub(discArt);
			}, !grSet.displayDiscArt);
			discArtThemeMenu.appendTo(displayDiscArtMenu);

			// * DISC ART CUSTOM PLACEHOLDERS * //
			const discArtCustomMenu = new Menu('Custom');
			const customDiscArtLabels = [];
			const customDiscArtValues = [];
			for (const key in grCfg.customDiscArtStub) {
				if (Object.prototype.hasOwnProperty.call(grCfg.customDiscArtStub, key) && key.includes('Name')) {
					const num = key.match(/\d+$/)[0]; // Extract the number from the key (e.g., "01" from "cdName01")
					const cdStubKey = `cdStub${num}`;
					const vinylStubKey = `vinylStub${num}`;
					if (key.startsWith('cdName') && grCfg.customDiscArtStub[cdStubKey]) {
						customDiscArtLabels.push(grCfg.customDiscArtStub[key]);
						customDiscArtValues.push(grCfg.customDiscArtStub[cdStubKey].replace('.png', ''));
					}
					else if (key.startsWith('vinylName') && grCfg.customDiscArtStub[vinylStubKey]) {
						customDiscArtLabels.push(grCfg.customDiscArtStub[key]);
						customDiscArtValues.push(grCfg.customDiscArtStub[vinylStubKey].replace('.png', ''));
					}
				}
			}
			discArtCustomMenu.addRadioItems(customDiscArtLabels, grSet.discArtStub, customDiscArtValues, (discArt) => {
				grSet.discArtStub = discArt;
				grSet.noDiscArtStub = false;
				grPath.discArtCustomStub = `${fb.ProfilePath}georgia-reborn\\images\\custom\\discart\\${grSet.discArtStub}.png`;
				grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
				grm.ui.discArtArrayCover = [];
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
				if (!IsFile(grPath.discArtCustomStub)) {
					const msg = `The custom disc art placeholder was not found in:\n${grPath.discArtCustomStub}\n\nBe sure that image exist and has the correct filename\nin the "customDiscArtStub" section of the\ncustom config file:\n${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc\n\n\n`;
					ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
				}
			}, !grSet.displayDiscArt);
			discArtCustomMenu.appendTo(displayDiscArtMenu);
			displayDiscArtMenu.appendTo(discArtMenu);

			// * DISC ART OPTIONS * //
			discArtMenu.addToggleItem(`Display disc art if found (${grCfg.settings.discArtBasename}.png, ${grCfg.settings.discArtBasename}2.png, vinylA.png, etc.)`, grSet, 'displayDiscArt', () => {
				if (fb.IsPlaying) grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				grm.ui.lastLeftEdge = 0; // resize labels
				grm.ui.resizeArtwork(true);
				RepaintWindow();
			});

			discArtMenu.addToggleItem('Display disc art above cover', grSet, 'discArtOnTop', () => {
				grSet.detailsAlbumArtDiscAreaOpacity = 255;
				RepaintWindow();
			}, !grSet.displayDiscArt);
			discArtMenu.addToggleItem('Filter cd/disc/vinyl .jpgs from artwork', grSet, 'filterDiscJpgsFromAlbumArt');
			discArtMenu.addSeparator();
			discArtMenu.addToggleItem('Spin disc art while songs play (increases memory and CPU)', grSet, 'spinDiscArt', () => {
				if (grSet.spinDiscArt) {
					grm.ui.setDiscArtRotationTimer();
				} else {
					clearInterval(grm.ui.discArtRotationTimer);
					grm.ui.discArtArray = [];
					grm.ui.discArtArrayCover = [];
				}
			});
			discArtMenu.createRadioSubMenu('# Rotation images (memory usage/rotational speed)', ['  36 (10 degrees)', '  45 (8 degrees)', '  60 (6 degrees)', '  72 (5 degrees) (default)', '  90 (4 degrees)', '120 (3 degrees)', '180 (2 degrees)'], grSet.spinDiscArtImageCount, [36, 45, 60, 72, 90, 120, 180], (count) => {
				grSet.spinDiscArtImageCount = count;
				grm.ui.discArtRotationIndex = 0;
				grm.ui.discArtRotationIndexCover = 0;
				grm.ui.discArtArray = [];
				grm.ui.discArtArrayCover = [];
				RepaintWindow();
			}, !grSet.spinDiscArt);
			discArtMenu.createRadioSubMenu('Spinning disc art redraw speed', ['250ms (very slow CPU)', '200ms', '150ms', '125ms', '100ms', '  75ms (default)', '  50ms', '  40ms', '  30ms', '  20ms', '  10ms (very fast CPU)'], grSet.spinDiscArtRedrawInterval, [250, 200, 150, 125, 100, 75, 50, 40, 30, 20, 10], interval => {
				grSet.spinDiscArtRedrawInterval = interval;
				grm.ui.setDiscArtRotationTimer();
			}, !grSet.spinDiscArt);
			discArtMenu.addSeparator();
			discArtMenu.addToggleItem('Rotate disc art as tracks change', grSet, 'rotateDiscArt', () => { RepaintWindow(); }, !grSet.displayDiscArt || grSet.spinDiscArt);
			discArtMenu.createRadioSubMenu('Disc art rotation amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(grSet.rotationAmt), [2, 3, 4, 5], (rot) => {
				grSet.rotationAmt = rot;
				grm.ui.createDiscArtRotation();
				RepaintWindow();
			}, !grSet.rotateDiscArt || grSet.spinDiscArt);
			discArtMenu.appendTo(detailsMenu);

			discArtMenu.createRadioSubMenu('Disc art display amount', ['Auto (Needs enough width)', '50%  (Needs enough width, default)', '45%', '40%', '35%', '30%', '25%', '20%', '15%', '10%'], grSet.discArtDisplayAmount, [1, 0.5, 0.455, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1], amount => {
				grSet.discArtDisplayAmount = amount;
				grm.ui.resizeArtwork(true);
				RepaintWindow();
			});

			// * DISC ART ALBUM ART * //
			const albumArtOpacityMenu = new Menu('Album art');
			albumArtOpacityMenu.createRadioSubMenu('Full artwork opacity (fast CPU needed when disc art spinning)', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.detailsAlbumArtOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
				grSet.detailsAlbumArtOpacity = value;
				grSet.detailsAlbumArtDiscAreaOpacity = 255;
				grSet.discArtOnTop = false;
				RepaintWindow();
			});
			albumArtOpacityMenu.createRadioSubMenu('Disc area opacity (very fast CPU needed when disc art spinning)', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.detailsAlbumArtDiscAreaOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
				grSet.detailsAlbumArtDiscAreaOpacity = value;
				grSet.detailsAlbumArtOpacity = 255;
				grSet.discArtOnTop = false;
				RepaintWindow();
			});
			albumArtOpacityMenu.appendTo(detailsMenu);
		}

		// * METADATA GRID MENU * //
		const detailsMetadataGridMenu = new Menu('Metadata grid');
		const detailsShowArtistMenu = new Menu('Show artist');
		detailsShowArtistMenu.addToggleItem('Default', grSet, 'showGridArtist_default', () => {
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowArtistMenu.addToggleItem('Artwork', grSet, 'showGridArtist_artwork', () => {
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowArtistMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW TRACK NUMBER IN DETAILS * //
		const detailsShowTrackNumberMenu = new Menu('Show track number');
		detailsShowTrackNumberMenu.addToggleItem('Default', grSet, 'showGridTrackNum_default', () => {
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowTrackNumberMenu.addToggleItem('Artwork', grSet, 'showGridTrackNum_artwork', () => {
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowTrackNumberMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW SONG TITLE IN DETAILS * //
		const detailsShowTitleMenu = new Menu('Show song title');
		detailsShowTitleMenu.addToggleItem('Default', grSet, 'showGridTitle_default', () => {
			grSet.showGridTrackNum_default = true;
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowTitleMenu.addToggleItem('Artwork', grSet, 'showGridTitle_artwork', () => {
			grSet.showGridTrackNum_artwork = true;
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowTitleMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW PLAYING PLAYLIST IN DETAILS * //
		const detailsShowPlaylingPlaylistMenu = new Menu('Show playing playlist');
		detailsShowPlaylingPlaylistMenu.addToggleItem('Enable', grSet, 'showGridPlayingPlaylist', () => {
			on_playback_new_track(fb.GetNowPlaying());
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowPlaylingPlaylistMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW TIMELINE IN DETAILS * //
		const detailsShowTimelineMenu = new Menu('Show timeline');
		detailsShowTimelineMenu.addToggleItem('Default', grSet, 'showGridTimeline_default', () => {
			RepaintWindow();
		});
		detailsShowTimelineMenu.addToggleItem('Artwork', grSet, 'showGridTimeline_artwork', () => {
			RepaintWindow();
		});
		detailsShowTimelineMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW ARTIST COUNTRY FLAG IN DETAILS * //
		const detailsShowArtistFlagsMenu = new Menu('Show artist country flags');
		detailsShowArtistFlagsMenu.addToggleItem('Default', grSet, 'showGridArtistFlags_default', () => {
			grm.ui.loadCountryFlags();
			RepaintWindow();
		});
		detailsShowArtistFlagsMenu.addToggleItem('Artwork', grSet, 'showGridArtistFlags_artwork', () => {
			grm.ui.loadCountryFlags();
			RepaintWindow();
		});
		detailsShowArtistFlagsMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW RELEASE COUNTRY FLAG IN DETAILS * //
		const detailsShowReleaseFlagsMenu = new Menu('Show release country flags');
		detailsShowReleaseFlagsMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridReleaseFlags_default, [false, 'logo', 'textlogo'], type => {
			grSet.showGridReleaseFlags_default = type;
			grm.ui.loadReleaseCountryFlag();
			RepaintWindow();
		});
		detailsShowReleaseFlagsMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridReleaseFlags_artwork, [false, 'logo', 'textlogo'], type => {
			grSet.showGridReleaseFlags_artwork = type;
			grm.ui.loadReleaseCountryFlag();
			RepaintWindow();
		});
		detailsShowReleaseFlagsMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW CODEC LOGO IN DETAILS * //
		const detailsShowCodecLogoMenu = new Menu('Show codec logo');
		detailsShowCodecLogoMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridCodecLogo_default, [false, 'logo', 'textlogo'], type => {
			grSet.showGridCodecLogo_default = type;
			RepaintWindow();
		});
		detailsShowCodecLogoMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridCodecLogo_artwork, [false, 'logo', 'textlogo'], type => {
			grSet.showGridCodecLogo_artwork = type;
			RepaintWindow();
		});
		detailsShowCodecLogoMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW CHANNEL LOGO IN DETAILS * //
		const detailsShowChannelLogoMenu = new Menu('Show channel logo');
		detailsShowChannelLogoMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridChannelLogo_default, [false, 'logo', 'textlogo'], type => {
			grSet.showGridChannelLogo_default = type;
			RepaintWindow();
		});
		detailsShowChannelLogoMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridChannelLogo_artwork, [false, 'logo', 'textlogo'], type => {
			grSet.showGridChannelLogo_artwork = type;
			RepaintWindow();
		});
		detailsShowChannelLogoMenu.appendTo(detailsMetadataGridMenu);

		detailsMetadataGridMenu.addSeparator();
		detailsMetadataGridMenu.addToggleItem('Auto-hide full metadata on small player', grSet, 'autoHideGridMetadata', () => RepaintWindow());

		// * EDIT METADATA GRID IN DETAILS * //
		if (fb.IsPlaying) {
			detailsMetadataGridMenu.addSeparator();
			detailsMetadataGridMenu.addItem('Edit metadata grid', false, () => {
				if (grSet.layout === 'default') {
					grm.ui.displayMetadataGridMenu = !grm.ui.displayMetadataGridMenu;
					if (!grm.ui.displayDetails) {
						grm.ui.displayDetails = true;
						grm.ui.displayPlaylist = false;
						grm.ui.displayLibrary = false;
						grm.ui.displayBiography = false;
						grm.ui.displayLyrics = false;
						grm.ui.resizeArtwork(true);
						grm.button.initButtonState();
					}
					grm.gridMenu.initMetadataGridMenu(1);
					RepaintWindow();
				} else {
					fb.ShowPopupMessage(`Metadata grid can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${grCfg.configPath}\n`, 'Metadata grid live editing');
				}
			});
		}
		detailsMetadataGridMenu.appendTo(detailsMenu);

		if (grSet.layout === 'default') {
			const detailsBackgroundMenu = new Menu('Background');
			// * SHOW FULL BACKGROUND WHEN NO DISC ART IN DETAILS * //
			detailsBackgroundMenu.addToggleItem('Show full background when no disc art', grSet, 'noDiscArtBg', () => {
				if (grSet.labelArtOnBg) {
					grSet.labelArtOnBg = false;
				}
				RepaintWindow();
			});
			// * SHOW LABEL ART ON BACKGROUND IN DETAILS * //
			detailsBackgroundMenu.addToggleItem('Show label art on background', grSet, 'labelArtOnBg', () => RepaintWindow(), grSet.noDiscArtBg);
			detailsBackgroundMenu.appendTo(detailsMenu);
		}

		if (!context_menu) detailsMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Library.
	 * @param {Menu} menu - Creates the Library panel menu via a new Menu instance.
	 * @param {boolean} context_menu - Appends Library options to context menu.
	 * @protected
	 */
	libraryOptions(menu, context_menu) {
		const libraryMenu = context_menu ? menu : new Menu('Library');

		// * LAYOUT * //
		if (grSet.layout === 'default') {
			const libraryLayoutMenu = new Menu('Layout');
			libraryLayoutMenu.addRadioItems(['Normal', 'Full', 'Split'], grSet.libraryLayout, ['normal', 'full', 'split'], (width) => {
				grSet.libraryLayout = width;
				if (!grm.ui.displayLibrary) { grm.ui.displayLibrary = true; grm.ui.displayPlaylist = false; grm.ui.displayBiography = false; }
				if (grm.ui.displayLyrics) grm.ui.displayLyrics = false;
				grm.ui.displayPlaylist = grSet.libraryLayout === 'split';
				grm.ui.resizeArtwork(true);
				grm.ui.initLibraryLayout();
				grm.button.initButtonState();
				RepaintWindow();
			});
			libraryLayoutMenu.addSeparator();
			libraryLayoutMenu.addToggleItem('Use full preset', grSet, 'libraryLayoutFullPreset', () => { RepaintWindow(); });
			libraryLayoutMenu.addSeparator();
			libraryLayoutMenu.addToggleItem('Use split preset (collapse)', grSet, 'libraryLayoutSplitPreset', () => {
				grSet.libraryLayoutSplitPreset2 = false;
				grSet.libraryLayoutSplitPreset3 = false;
				grSet.libraryLayoutSplitPreset4 = false;
				grm.ui.initLibraryLayout();
				grm.ui.initPlaylist();
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
			});
			libraryLayoutMenu.addToggleItem('Use split preset (text)', grSet, 'libraryLayoutSplitPreset2', () => {
				grSet.libraryLayoutSplitPreset = false;
				grSet.libraryLayoutSplitPreset3 = false;
				grSet.libraryLayoutSplitPreset4 = false;
				grm.ui.initLibraryLayout();
				grm.ui.initPlaylist();
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
			});
			libraryLayoutMenu.addToggleItem('Use split preset (art grid)', grSet, 'libraryLayoutSplitPreset3', () => {
				grSet.libraryLayoutSplitPreset = false;
				grSet.libraryLayoutSplitPreset2 = false;
				grSet.libraryLayoutSplitPreset4 = false;
				grm.ui.initLibraryLayout();
				grm.ui.initPlaylist();
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
			});
			libraryLayoutMenu.addToggleItem('Use split preset (art header)', grSet, 'libraryLayoutSplitPreset4', () => {
				grSet.libraryLayoutSplitPreset = false;
				grSet.libraryLayoutSplitPreset2 = false;
				grSet.libraryLayoutSplitPreset3 = false;
				grm.ui.initLibraryLayout();
				grm.ui.initPlaylist();
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
			});
			libraryLayoutMenu.appendTo(libraryMenu);
		}

		// * DESIGN * //
		libraryMenu.createRadioSubMenu('Design', ['Georgia-ReBORN', 'Traditional', 'Modern', 'Ultra-modern', 'Clean', 'List view', 'Covers (labels right)', 'Covers (labels bottom)', 'Covers (labels blend)', 'Flow mode'], grSet.libraryDesign,
			['reborn', 'traditional', 'modern', 'ultraModern', 'clean', 'facet', 'coversLabelsRight', 'coversLabelsBottom', 'coversLabelsBlend', 'flowMode'], (design) => {
			grSet.libraryDesign = design;
			grm.ui.setLibraryDesign();
		});

		// * THEME * //
		libraryMenu.createRadioSubMenu('Theme', ['Georgia-ReBORN', 'Dark', 'Blend', 'Light', 'Random', 'Cover'], grSet.libraryTheme, [0, 1, 2, 3, 4, 5], (theme) => {
			libSet.theme = grSet.libraryTheme = theme;
			grm.ui.initTheme();
			lib.call.on_colours_changed();
			lib.panel.updateProp(1);
			grm.theme.themeColorAdjustments();
		});

		// * ALBUM ART * //
		const libraryAlbumArtMenu = new Menu('Album art');
		const libraryThumbnailSizeMenu = new Menu('Thumbnail size');
		libraryThumbnailSizeMenu.addRadioItems(['Auto (default)', 'Playlist', 'Mini', 'Small', 'Regular', 'Medium', 'Large', 'XL', 'XXL', 'MAX'], grSet.libraryThumbnailSize, ['auto', 'playlist', 0, 1, 2, 3, 4, 5, 6, 7], (thumbnailSize) => {
			grSet.libraryThumbnailSizeSaved = libSet.thumbNailSize = grSet.libraryThumbnailSize = thumbnailSize;
			grm.ui.setLibrarySize();
			RepaintWindow();
		});
		libraryThumbnailSizeMenu.appendTo(libraryAlbumArtMenu);

		const libraryThumbnailBorderMenu = new Menu('Thumbnail border');
		libraryThumbnailBorderMenu.addRadioItems(['None', 'Border', 'Shadow'], grSet.libraryThumbnailBorder, ['none', 'border', 'shadow'], (type) => {
			grSet.libraryThumbnailBorder = type;
			libSet.albumArtDropShadow = grSet.libraryThumbnailBorder === 'shadow';
			lib.panel.updateProp(1);
		});
		libraryThumbnailBorderMenu.appendTo(libraryAlbumArtMenu);

		if (!libSet.albumArtShow) {
			libraryAlbumArtMenu.addToggleItem('Activate option or change design to album art', libSet, 'albumArtShow', () => {
				if (grSet.libraryDesign === 'flowMode') grSet.libraryLayout = 'full';
				lib.lib.logTree();
				lib.pop.clearTree();
				libSet.toggle('albumArtShow');
				lib.panel.imgView = libSet.albumArtShow = true;
				lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
				grm.ui.setLibrarySize();
				grm.ui.displayPlaylist = false;
				grm.ui.displayLibrary = true;
				grm.ui.btn.library.enabled = true;
				grm.ui.btn.library.changeState(ButtonState.Down);
				lib.panel.updateProp(1);
			}, libSet.albumArtShow);
			libraryAlbumArtMenu.addSeparator();
		}

		const libraryAlbumArtOverlay = new Menu('Overlay');
		libraryAlbumArtOverlay.addRadioItems(['None', 'Track count', 'Year'], libSet.itemOverlayType, [0, 1, 2], (type) => {
			libSet.itemOverlayType = type;
			lib.panel.updateProp(1);
		});
		libraryAlbumArtOverlay.appendTo(libraryAlbumArtMenu);

		const libraryAlbumArtIndex = new Menu('Index');
		libraryAlbumArtIndex.addToggleItem('Show on scrollbar drag', libSet, 'albumArtLetter', () => { lib.panel.updateProp(1); });
		libraryAlbumArtIndex.addSeparator();
		libraryAlbumArtIndex.addRadioItems(['Artist', 'Alphabet'], libSet.albumArtLetterNo, [0, 1], (type) => {
			libSet.albumArtLetterNo = type;
			lib.panel.updateProp(1);
		});
		libraryAlbumArtIndex.appendTo(libraryAlbumArtMenu);
		libraryAlbumArtMenu.appendTo(libraryMenu);

		const libraryViewMenu = new Menu('View');
		libraryViewMenu.addRadioItems(['Front (default)', 'Back', 'Disc', 'Icon', 'Artist'], libSet.artId, [0, 1, 2, 3, 4], (view) => {
			libSet.artId = view;
			lib.men.setAlbumart(view);
			lib.panel.updateProp(1);
		});
		libraryViewMenu.addSeparator();
		libraryViewMenu.addRadioItems(['Group: auto', 'Group: top level', 'Group: two levels'], libSet.albumArtGrpLevel, [0, 1, 2], (view) => {
			libSet.albumArtGrpLevel = view;
			lib.men.setAlbumart(view - 5);
			lib.panel.updateProp(1);
		});
		libraryViewMenu.appendTo(libraryAlbumArtMenu);

		const libraryImageMenu = new Menu('Image');
		libraryImageMenu.createRadioSubMenu('Front', ['Regular', 'Auto-fill (default)', 'Circular'], libSet.imgStyleFront, [0, 1, 2], (style) => {
			libSet.imgStyleFront = style;
			lib.panel.updateProp(1);
		});
		libraryImageMenu.createRadioSubMenu('Back', ['Regular', 'Auto-fill (default)', 'Circular'], libSet.imgStyleBack, [0, 1, 2], (style) => {
			libSet.imgStyleBack = style;
			lib.panel.updateProp(1);
		});
		libraryImageMenu.createRadioSubMenu('Disc', ['Regular', 'Auto-fill (default)', 'Circular'], libSet.imgStyleDisc, [0, 1, 2], (style) => {
			libSet.imgStyleDisc = style;
			lib.panel.updateProp(1);
		});
		libraryImageMenu.createRadioSubMenu('Icon', ['Regular', 'Auto-fill (default)', 'Circular'], libSet.imgStyleIcon, [0, 1, 2], (style) => {
			libSet.imgStyleIcon = style;
			lib.panel.updateProp(1);
		});
		libraryImageMenu.createRadioSubMenu('Artist', ['Regular', 'Auto-fill (default)', 'Circular'], libSet.imgStyleArtist, [0, 1, 2], (style) => {
			libSet.imgStyleArtist = style;
			lib.panel.updateProp(1);
		});
		libraryImageMenu.appendTo(libraryAlbumArtMenu);

		const libraryLabelsMenu = new Menu('Labels');
		libraryLabelsMenu.addRadioItems(['Bottom (default)', 'Right', 'Blend', 'Dark', 'None'], libSet.albumArtLabelType, [1, 2, 3, 4, 0], (style) => {
			grSet.savedAlbumArtLabelType = libSet.albumArtLabelType = style;
			lib.panel.updateProp(1);
		});
		libraryLabelsMenu.addSeparator();
		libraryLabelsMenu.addToggleItem('Flip', libSet, 'albumArtFlipLabels', () => {  lib.panel.updateProp(1); });
		libraryLabelsMenu.appendTo(libraryAlbumArtMenu);

		// * CONTROLS * //
		const libraryControlsMenu = new Menu('Controls');
		libraryControlsMenu.createRadioSubMenu('Action mode', ['Default', 'Browser', 'Player'], libSet.actionMode, [0, 1, 2], (mode) => {
			libSet.actionMode = mode;
			if (mode === 1) {
				const msg = 'Do you want to enable library browser mode?\n\nThis will act like a file browser to quickly see the content of the album. It is not recommended for new users\nwho don\'t know how the library works.\n\nContinue?\n\n\n';
				const msgFb = 'Library browser mode enabled:\n\nThis will act like a file browser to quickly see the content of the album.\nIt is not recommended for new users who don\'t know how the library works.';
				ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						libSet.actionMode = 0;
						return;
					}
					grSet.libraryLayoutSplitPreset  = false;
					grSet.libraryLayoutSplitPreset2 = false;
					grSet.libraryLayoutSplitPreset3 = false;
					grSet.libraryLayoutSplitPreset4 = false;
					grSet.libraryLayout = 'split';
					lib.panel.imgView = libSet.albumArtShow = true;
					lib.lib.logTree();
					lib.pop.clearTree();
					lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
					grm.ui.setLibrarySize();
					grm.theme.initLibraryColors();
					grm.theme.themeColorAdjustments();
					plSet.show_header = true;
					plSet.auto_collapse = false;
					grm.ui.displayPlaylist = true;
					grm.ui.displayLibrary = true;
				});
				grm.ui.updatePlaylist();
				RepaintWindow();
			}
			else if (mode === 2) {
				const msg = 'Do you want to enable library player mode?\n\nThis will act like a playlist and will not automatically add content to the playlist. It is recommended for new users\nwho don\'t know how the library works.\n\nContinue?\n\n\n';
				const msgFb = 'Library player mode enabled:\n\nThis will act like a like a playlist and will not automatically add content to the playlist.\nIt is recommended for new users who don\'t know how the library works.';
				ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						libSet.actionMode = 0;
					}
				});
				RepaintWindow();
			}
		});
		libraryControlsMenu.addSeparator();
		libraryControlsMenu.createRadioSubMenu('Single-click action', ['Select', 'Send to playlist', 'Send to playlist and play', 'Send to playlist and play (add if playing)'], libSet.clickAction, [0, 1, 2, 3], (action) => {
			libSet.clickAction = action;
			lib.panel.updateProp(1);
		});
		libraryControlsMenu.createRadioSubMenu('Double-click action', ['Send to playlist', 'Send to playlist and play', 'Expand/Collapse tree', 'Play only'], libSet.dblClickAction, [0, 1, 2, 3], (action) => {
			libSet.dblClickAction = action;
			lib.panel.updateProp(1);
		});
		libraryControlsMenu.createRadioSubMenu('Middle-click action', ['Add to default playlist', 'Add to current playlist', 'Add to playback queue (alt + double-click removes)'], libSet.mbtnClickAction, [0, 1, 2], (action) => {
			libSet.mbtnClickAction = action;
			lib.panel.updateProp(1);
		});
		libraryControlsMenu.createRadioSubMenu('Alt + mouse click action', ['Add to default playlist', 'Add to current playlist', 'Add to playback queue (alt + double-click removes)'], libSet.altClickAction, [0, 1, 2], (action) => {
			libSet.altClickAction = action;
			lib.panel.updateProp(1);
		});
		const libraryKeystrokeMenu = new Menu('Keystroke action');
		libraryKeystrokeMenu.addToggleItem('Play on Enter or send from menu', libSet, 'autoPlay', () => { lib.panel.updateProp(1); });
		libraryKeystrokeMenu.addSeparator();
		libraryKeystrokeMenu.addRadioItems(['Select', 'Send to Playlist'], libSet.keyAction, [0, 1], (action) => {
			libSet.keyAction = action;
			lib.panel.updateProp(1);
		});
		libraryKeystrokeMenu.appendTo(libraryControlsMenu);
		libraryControlsMenu.addSeparator();
		libraryControlsMenu.addToggleItem('Always remember library state', libSet, 'rememberTree', () => { lib.panel.updateProp(1); });
		libraryControlsMenu.addToggleItem('Always load View by same as tree', libSet, 'artTreeSameView', () => { lib.panel.updateProp(1); });
		libraryControlsMenu.addToggleItem('Always load preset with current view pattern', libSet, 'presetLoadCurView', () => { lib.panel.updateProp(1); });
		libraryControlsMenu.addSeparator();
		libraryControlsMenu.addItem('Reset library zoom', false, () => { lib.panel.zoomReset();	});
		libraryControlsMenu.appendTo(libraryMenu);

		// * TRACK ROW * //
		const libraryTrackRowMenu = new Menu('Track row');
		libraryTrackRowMenu.createRadioSubMenu('Node root type', ['Hide', 'All Music', 'View name', 'Summary item'], libSet.rootNode, [0, 1, 2, 3], (nodeIndex) => {
			libSet.rootNode = nodeIndex;
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.createRadioSubMenu('Node item counts', ['Hidden', '# Tracks', '# Sub-Items'], libSet.nodeCounts, [0, 1, 2], (nodeIndex) => {
			libSet.nodeCounts = nodeIndex;
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.createRadioSubMenu('Node item counts position', ['Right', 'Left'], libSet.countsRight, [true, false], (nodeCounts) => {
			libSet.countsRight = nodeCounts;
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.createRadioSubMenu('Node auto collapse', ['On', 'Off'], libSet.autoCollapse, [true, false], (nodeCollapse) => {
			libSet.autoCollapse = nodeCollapse;
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.addSeparator();
		libraryTrackRowMenu.createRadioSubMenu('Statistics', ['Tracks', 'Bitrate', 'Duration', 'Total size', 'Rating', 'Popularity', 'Date', 'Playback queue', 'Playcount', 'First played', 'Last played', 'Added'], libSet.itemShowStatistics, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], (stats) => {
			libSet.itemShowStatistics = stats;
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.addSeparator();
		libraryTrackRowMenu.addToggleItem('Show now playing', libSet, 'highLightNowplaying', () => { lib.panel.updateProp(1); });
		libraryTrackRowMenu.addToggleItem('Show tracks when expanding nodes', libSet, 'showTracks', () => { lib.pop.collapseAll(); lib.panel.updateProp(1); });
		libraryTrackRowMenu.addToggleItem('Show row stripes', libSet, 'rowStripes', () => { lib.panel.updateProp(1); });
		libraryTrackRowMenu.addSeparator();
		libraryTrackRowMenu.addToggleItem('Row fully clickable', libSet, 'fullLineSelection', () => { lib.panel.updateProp(1); });
		libraryTrackRowMenu.addToggleItem('Row mouse hover', grSet, 'libraryRowHover', () => { RepaintWindow(); });
		libraryTrackRowMenu.appendTo(libraryMenu);

		// * FILTER ORDER * //
		const libraryFilterOrderMenu = new Menu('Filter order');
		libraryFilterOrderMenu.addRadioItems(['No filter', 'Lossless', 'Lossy', 'Missing replaygain', 'Never played', 'Played often', 'Recently added', 'Recently played', 'Top rated', 'Nowplaying artist'], libSet.filterBy, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (order) => {
			libSet.filterBy = order;
			lib.panel.set('Filter', order);
		});
		libraryFilterOrderMenu.appendTo(libraryMenu);

		// * SORT ORDER * //
		const librarySortOrderMenu = new Menu('Sort order');
		librarySortOrderMenu.addRadioItems(['Default', 'Ascending (hide year)', 'Ascending (show year)', 'Descending (hide year)', 'Descending (show year)'], libSet.sortOrder, [0, 1, 2, 3, 4], (order) => {
			libSet.sortOrder = order;
			const d = {};
			lib.men.getSortData(d);
			lib.men.sortByDate(libSet.sortOrder, d);
		});
		librarySortOrderMenu.addSeparator();
		librarySortOrderMenu.addRadioItems(['Action: year after album', 'Action: year before album'], libSet.yearBeforeAlbum, [false, true], (year) => {
			libSet.yearBeforeAlbum = year;
		});
		librarySortOrderMenu.appendTo(libraryMenu);

		// * VIEW ORDER * //
		const libraryViewOrderMenu = new Menu('View order');
		libraryViewOrderMenu.addRadioItems(['Artist', 'Album artist', 'Album artist | album', 'Album', 'Composer', 'Country', 'Country | Genre', 'Genre', 'Label', 'Year', 'Folder structure'], lib.panel.imgView ? libSet.albumArtViewBy : libSet.treeViewBy, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (order) => {
			if (libSet.albumArtShow) {
				libSet.albumArtViewBy = order;
			} else {
				libSet.viewBy = order;
				libSet.treeViewBy = order;
			}
			lib.lib.logTree();
			lib.pop.clearTree();
			lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
		});
		libraryViewOrderMenu.appendTo(libraryMenu);

		// * SOURCE * //
		const librarySourceMenu = new Menu('Source');
		librarySourceMenu.addRadioItems(['Library'], libSet.fixedPlaylist ? '' : libSet.libSource, [1], (src) => {
			lib.men.setSource(0);
		});
		const libraryPlaylistSourceMenu = new Menu('Playlist');
		libraryPlaylistSourceMenu.addRadioItems(['Active playlist'], libSet.fixedPlaylist ? '' : libSet.libSource, [0], (src) => {
			lib.men.setSource(2);
			lib.men.setActivePlaylist();
		});
		libraryPlaylistSourceMenu.addSeparator();
		const pl_no = Math.ceil(lib.men.pl.length / 30);
		const pl_ix = libSet.fixedPlaylist ? plman.FindPlaylist(libSet.fixedPlaylistName) : -1;
		for (let j = 0; j < pl_no; j++) {
			const n = `# ${j * 30 + 1} - ${Math.min(lib.men.pl.length, 30 + j * 30)}${30 + j * 30 > pl_ix && ((j * 30) - 1) < pl_ix ? '  >>>' : ''}`;
			const libraryPlaylistSourceItems = new Menu(n);

				for (let i = j * 30; i < Math.min(lib.men.pl.length, 30 + j * 30); i++) {
					libraryPlaylistSourceItems.addRadioItems([lib.men.pl[i].menuName], libSet.fixedPlaylist ? lib.men.pl[pl_ix].menuName : '', [lib.men.pl[i].menuName], () => {
						lib.men.setSource(2);
						lib.men.setFixedPlaylist(i);
					});
				}
				libraryPlaylistSourceItems.appendTo(libraryPlaylistSourceMenu);
		}
		libraryPlaylistSourceMenu.appendTo(librarySourceMenu);
		librarySourceMenu.appendTo(libraryMenu);

		if (!context_menu) libraryMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Biography.
	 * @param {Menu} menu - Creates the Biography panel menu via a new Menu instance.
	 * @param {boolean} context_menu - Appends Biography panel options to context menu.
	 * @protected
	 */
	biographyOptions(menu, context_menu) {
		const biographyMenu = context_menu ? menu : new Menu('Biography');
		const biographyLayoutMenu = new Menu('Layout');

		// * LAYOUT * //
		if (grSet.layout === 'default') {
			biographyLayoutMenu.addRadioItems(['Normal', 'Full'], grSet.biographyLayout, ['normal', 'full'], (width) => {
				grSet.biographyLayout = width;
				if (!grm.ui.displayBiography) { grm.ui.displayBiography = true; grm.ui.displayPlaylist = false; grm.ui.displayLibrary = false; }
				if (grm.ui.displayLyrics) grm.ui.displayLyrics = false;
				grm.ui.displayPlaylist = !grm.ui.displayPlaylist;
				grm.ui.initBiographyLayout();
				grm.button.initButtonState();
			});
			biographyLayoutMenu.addSeparator();
			biographyLayoutMenu.addToggleItem('Use full preset', grSet, 'biographyLayoutFullPreset', () => { RepaintWindow(); });
			biographyLayoutMenu.addSeparator();
		}
		biographyLayoutMenu.addRadioItems(['Top (default)', 'Right', 'Bottom', 'Left', 'Full overlay', 'Part overlay'], bioSet.style, [0, 1, 2, 3, 4, 5], (layout) => {
			bioSet.style = layout;
			bio.ui.updateProp(1);
		});
		biographyLayoutMenu.addSeparator();
		const biographyFilmstripMenu = new Menu('Filmstrip');
		biographyFilmstripMenu.addRadioItems(['Top', 'Right', 'Bottom', 'Left (default)'], bioSet.filmStripPos, [0, 1, 2, 3], (pos) => {
			bioSet.filmStripPos = pos;
			bio.ui.updateProp(1);
		});
		biographyFilmstripMenu.addSeparator();
		biographyFilmstripMenu.addToggleItem('Overlay image area', bioSet, 'filmStripOverlay', () => { bio.ui.updateProp(1); });
		biographyFilmstripMenu.appendTo(biographyLayoutMenu);
		biographyLayoutMenu.appendTo(biographyMenu);

		// * THEME * //
		const biographyThemeMenu = new Menu('Theme');
		biographyThemeMenu.addRadioItems(['Georgia-ReBORN', 'Dark', 'Blend', 'Light'], grSet.biographyTheme, [0, 1, 2, 3], (theme) => {
			grSet.biographyTheme = theme;
			bioSet.theme = grSet.biographyTheme;
			grm.ui.initTheme();
			bio.call.on_colours_changed();
			bio.ui.updateProp(1);
			grm.theme.themeColorAdjustments();
		});
		biographyThemeMenu.appendTo(biographyMenu);

		// * DISPLAY * //
		const biographyDisplayMenu = new Menu('Display');
		biographyDisplayMenu.addRadioItems(['Image + text', 'Image', 'Text'], grSet.biographyDisplay, ['Image+text', 'Image', 'Text'], (display) => {
			grSet.biographyDisplay = display;
			grm.ui.setBiographyDisplay();
			bio.ui.updateProp(1);
		});
		biographyDisplayMenu.addSeparator();
		biographyDisplayMenu.addToggleItem('Filmstrip', bioSet, 'showFilmStrip', () => { bio.ui.updateProp(1); });
		biographyDisplayMenu.addToggleItem('Seeker', bioSet, 'imgSeekerShow', () => { bio.ui.updateProp(1); });
		biographyDisplayMenu.addToggleItem('Heading', bioSet, 'heading', () => { bio.ui.updateProp(1); });
		biographyDisplayMenu.addToggleItem('Summary', bioSet, 'summaryShow', () => { bio.ui.updateProp(1); });
		biographyDisplayMenu.addSeparator();
		biographyDisplayMenu.addToggleItem(bioSet.summaryCompact ? 'Summary expand' : 'Summary compact', bioSet, 'summaryCompact', () => { bio.ui.updateProp(1); });
		biographyDisplayMenu.addSeparator();
		biographyDisplayMenu.addRadioItems(['Artist view', 'Album view'], bioSet.artistView, [true, false], (view) => {
			bioSet.artistView = view;
			bio.ui.updateProp(1);
		});
		biographyDisplayMenu.addSeparator();
		biographyDisplayMenu.addRadioItems(['Prefer now playing', 'Follow selected track (playlist)'], bioSet.focus, [false, true], (view) => {
			bioSet.focus = view;
			bio.ui.updateProp(1);
		});
		biographyDisplayMenu.appendTo(biographyMenu);

		// * SOURCES * //
		const biographySourcesMenu = new Menu('Sources');
		const biographySourcesTextMenu = new Menu('Text');
		if (!bioSet.sourceAll) {
			biographySourcesTextMenu.addRadioItems(['Auto-fallback', 'Static'], bioSet.lockBio, [false, true], (source) => {
				bioSet.lockBio = source;
				if (bioSet.sourceAll) {
					bioSet.lockBio = false;
				} else {
					bioSet.lockRev = bioSet.lockBio;
				}
				bio.ui.updateProp(1);
			}, !bioSet.sourceAll);
			biographySourcesTextMenu.addSeparator();
		}
		biographySourcesTextMenu.addToggleItem('Amalgamate', bioSet, 'sourceAll', () => {
			bioSet.lockBio = false;
			bioSet.lockRev = false;
			bio.ui.updateProp(1);
		});
		biographySourcesTextMenu.addSeparator();
		biographySourcesTextMenu.addToggleItem('Prefer composition (allmusic && wikipedia review)', bioSet, 'classicalMusicMode', () => {
			bioCfg.classicalModeEnable = !bioCfg.classicalModeEnable;
			bioSet.classicalAlbFallback = bioSet.classicalMusicMode;
			bio.ui.updateProp(1);
		});
		biographySourcesTextMenu.appendTo(biographySourcesMenu);

		biographySourcesMenu.createRadioSubMenu('Photo', ['Cycle from download folder', 'Cycle from custom folder [fallback to above]', 'Artist (single image [fb2k: display])'], bioSet.cycPhotoLocation, [0, 1, 2], (location) => {
			bioSet.cycPhotoLocation = location;
			if (location === 0) {
				bioSet.cycPhoto = true;
			}
			else if (location === 1 && !bioSet.get('Panel Biography - System: Photo Folder Checked', false)) {
				fb.ShowPopupMessage('Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.', 'Biography: custom folder for photo cycling');
				bioSet.set('Panel Biography - System: Photo Folder Checked', true);
				bioSet.cycPhoto = true;
				bio.img.artistReset();
			}
			else if (location === 2) {
				bioSet.cycPhoto = false;
			}
			bio.img.updImages();
		});

		const biographySourcesCoverMenu = new Menu('Cover');
		if (!bioSet.loadCovAllFb && !bioSet.loadCovFolder) {
			biographySourcesCoverMenu.addRadioItems(['Front', 'Back', 'Disc', 'Icon', 'Artist'], bioSet.covType, [0, 1, 2, 3, 4], (type) => {
				bioSet.covType = type;
				bio.img.cov.selection = [0, -1, -1, -1, -1];
				bio.img.cov.selFiltered = [0];
				bio.img.getImages();
			}, bioSet.loadCovFolder);
		} else {
			biographySourcesCoverMenu.addToggleItems(['Front', 'Back', 'Disc', 'Icon', 'Artist'], bio.img.cov.selection, [0, 1, 2, 3, 4], (type) => {
				!bioSet.loadCovAllFb ? bioSet.covType = type : bio.img.cov.selection[type] = bio.img.cov.selection[type] === -1 ? type : -1;
				bio.img.cov.selFiltered = bio.img.cov.selection.filter(v => v !== -1);
				if (!bio.img.cov.selFiltered.length) {
					bio.img.cov.selection = [0, -1, -1, -1, -1];
					bio.img.cov.selFiltered = [0];
				}
				bioSet.loadCovSelFb = JSON.stringify(bio.img.cov.selection);
				!bioSet.loadCovAllFb ? bio.img.getImages() : bio.img.check();
			}, !bioSet.loadCovAllFb && bioSet.loadCovFolder);
		}
		biographySourcesCoverMenu.addSeparator();
		biographySourcesCoverMenu.addToggleItem('Cycle above', bioSet, 'loadCovAllFb', () => {
			bioSet.loadCovAllFb = !bioSet.loadCovAllFb;
			bio.img.toggle('loadCovAllFb');
		});
		biographySourcesCoverMenu.addToggleItem('Cycle from download folder', bioSet, 'loadCovFolder', () => {
			bioSet.loadCovFolder = !bioSet.loadCovFolder;
			bio.img.toggle('loadCovFolder');
			if (bioSet.loadCovFolder) {
				fb.ShowPopupMessage("Enter folder in options: \"Server Settings\"\\Cover\\Covers: cycle folder.\n\nDefault: artist photo folder.\n\nImages are updated when the album changes. Any images arriving after choosing the current album aren't included.", 'Biography: load folder for cover cycling');
			}
		});
		biographySourcesCoverMenu.appendTo(biographySourcesMenu);

		const biographySourcesOpenFileLocationMenu = new Menu('Open file location');
		biographySourcesOpenFileLocationMenu.addItem('Image', false, () => {
			const imgInfo = bio.img.pth();
			bio.men.path.img = imgInfo.imgPth;
			OpenExplorer(`explorer /select, "${bio.men.path.img}"`, false);
		});
		biographySourcesOpenFileLocationMenu.addSeparator();
		if (bio.txt.bio.am.length || bio.txt.rev.am.length) {
			biographySourcesOpenFileLocationMenu.addItem(bioSet.artistView ? 'Biography [allmusic]' : 'Review [allmusic]', false, () => {
				bio.men.path.am = bioSet.artistView ? bio.txt.bioPth('Am') : bio.txt.revPth('Am');
				OpenExplorer(`explorer /select, "${bio.men.path.am[1]}"`, false);
			});
		}
		if (bio.txt.bio.lfm.length || bio.txt.rev.lfm.length) {
			biographySourcesOpenFileLocationMenu.addItem(bioSet.artistView ? 'Biography [last.fm]' : 'Review [last.fm]', false, () => {
				bio.men.path.lfm = bioSet.artistView ? bio.txt.bioPth('Lfm') : bio.txt.revPth('Lfm');
				OpenExplorer(`explorer /select, "${bio.men.path.lfm[1]}"`, false);
			});
		}
		if (bio.txt.bio.wiki.length || bio.txt.rev.wiki.length) {
			biographySourcesOpenFileLocationMenu.addItem(bioSet.artistView ? 'Biography [wikipedia]' : 'Review [wikipedia]', false, () => {
				bio.men.path.wiki = bioSet.artistView ? bio.txt.bioPth('Wiki') : bio.txt.revPth('Wiki');
				OpenExplorer(`explorer /select, "${bio.men.path.wiki[1]}"`, false);
			});
		}
		if (bio.lyrics.lyrics.length) {
			biographySourcesOpenFileLocationMenu.addItem('Lyrics', false, () => {
				bio.men.path.txt = bioSet.artistView ? bio.txt.txtReaderPth() : bio.txt.txtRevPth();
				OpenExplorer(`explorer /select, "${bio.men.path.txt[1]}"`, false);
			});
		}
		biographySourcesMenu.addSeparator();
		biographySourcesOpenFileLocationMenu.appendTo(biographySourcesMenu);

		biographySourcesMenu.addItem('Force update', false, () => {
			bio.panel.callServer(1, bio.panel.id.focus, 'bio_forceUpdate', 0);
			bio.ui.updateProp(1);
		});
		biographySourcesMenu.appendTo(biographyMenu);

		// * IMAGES * //
		const biographyImageMenu = new Menu('Image');
		const biographyImageDefaultMenu = new Menu('Image + text');
		biographyImageDefaultMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], bioSet.artStyleDual, [0, 1, 2], (style) => {
			bioSet.artStyleDual = style;
			bio.ui.updateProp(1);
		});
		biographyImageDefaultMenu.addToggleItem('Reflection', bioSet, 'artReflDual', () => { bioSet.artShadowDual = false; bio.ui.updateProp(1); });
		biographyImageDefaultMenu.addToggleItem('Shadow', bioSet, 'artShadowDual', () => { bioSet.artReflDual = false; bio.ui.updateProp(1); });
		biographyImageDefaultMenu.addSeparator();
		biographyImageDefaultMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], bioSet.covStyleDual, [0, 1, 2], (style) => {
			bioSet.covStyleDual = style;
			bio.ui.updateProp(1);
		});
		biographyImageDefaultMenu.addToggleItem('Reflection', bioSet, 'covReflDual', () => { bioSet.covShadowDual = false; bio.ui.updateProp(1); });
		biographyImageDefaultMenu.addToggleItem('Shadow', bioSet, 'covShadowDual', () => { bioSet.covReflDual = false; bio.ui.updateProp(1); });

		biographyImageDefaultMenu.appendTo(biographyImageMenu);
		const biographyImageOnlyMenu = new Menu('Image only');
		biographyImageOnlyMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], bioSet.artStyleImgOnly, [0, 1, 2], (style) => {
			bioSet.artStyleImgOnly = style;
			bio.ui.updateProp(1);
		});
		biographyImageOnlyMenu.addToggleItem('Reflection', bioSet, 'artReflImgOnly', () => { bioSet.artShadowImgOnly = false; bio.ui.updateProp(1); });
		biographyImageOnlyMenu.addToggleItem('Shadow', bioSet, 'artShadowImgOnly', () => { bioSet.artReflImgOnly = false; bio.ui.updateProp(1); });
		biographyImageOnlyMenu.addSeparator();
		biographyImageOnlyMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], bioSet.covStyleImgOnly, [0, 1, 2], (style) => {
			bioSet.covStyleImgOnly = style;
			bio.ui.updateProp(1);
		});
		biographyImageOnlyMenu.addToggleItem('Reflection', bioSet, 'covReflImgOnly', () => { bioSet.covShadowImgOnly = false; bio.ui.updateProp(1); });
		biographyImageOnlyMenu.addToggleItem('Shadow', bioSet, 'covShadowImgOnly', () => { bioSet.covReflImgOnly = false; bio.ui.updateProp(1); });
		biographyImageOnlyMenu.appendTo(biographyImageMenu);

		const biographyImageFilmstripMenu = new Menu('Filmstrip');
		biographyImageFilmstripMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], bioSet.filmPhotoStyle, [0, 1, 2], (style) => {
			bioSet.filmPhotoStyle = style;
			bio.ui.updateProp(1);
		});
		biographyImageFilmstripMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], bioSet.filmCoverStyle, [0, 1, 2], (style) => {
			bioSet.filmCoverStyle = style;
			bio.ui.updateProp(1);
		});
		biographyImageFilmstripMenu.appendTo(biographyImageMenu);
		biographyImageMenu.addSeparator();

		const biographyImageDownloadMenu = new Menu('Downloads');
		biographyImageDownloadMenu.addRadioItems(['  5 Images', '10 Images (default)', '15 Images', '20 Images'], bioCfg.photoNum, [5, 10, 15, 20], (num) => {
			bioCfg.photoNum = num;
			bio.ui.updateProp(1);
		});
		biographyImageDownloadMenu.appendTo(biographyImageMenu);
		biographyImageMenu.addSeparator();

		const biographyImageAutoCycleMenu = new Menu('Auto cycle');
		biographyImageAutoCycleMenu.addToggleItem('Auto cycle', bioSet, 'cycPic', () => { bio.ui.updateProp(1); });
		biographyImageAutoCycleMenu.addSeparator();
		biographyImageAutoCycleMenu.addToggleItem('Smooth transition', bioSet, 'imgSmoothTrans', () => { bio.ui.updateProp(1); });
		biographyImageAutoCycleMenu.addSeparator();
		biographyImageAutoCycleMenu.addRadioItems(['  5 sec', '10 sec', '15 sec (default)', '30 sec', '60 sec'], bioSet.cycTimePic, [5, 10, 15, 30, 60], (dur) => {
			bioSet.cycTimePic = dur;
			bio.ui.updateProp(1);
		});
		biographyImageAutoCycleMenu.appendTo(biographyImageMenu);

		biographyImageMenu.appendTo(biographyMenu);

		if (!context_menu) biographyMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Lyrics.
	 * @param {Menu} menu - Creates the Lyrics panel menu via a new Menu instance.
	 * @param {boolean} context_menu - Appends Lyrics panel options to context menu.
	 * @protected
	 */
	lyricsOptions(menu, context_menu) {
		const lyricsMenu = context_menu ? menu : new Menu('Lyrics');

		if (grSet.layout === 'default') {
			lyricsMenu.createRadioSubMenu('Layout', ['Normal', 'Full'], grSet.lyricsLayout, ['normal', 'full'], (width) => {
				grSet.lyricsLayout = width;
				if (!grm.ui.displayLyrics && grSet.lyricsLayout === 'full' || grm.ui.noAlbumArtStub) {
					grm.ui.displayPlaylist = true;
					grm.ui.displayLyrics = true;
					grm.ui.displayLibrary = false;
					grm.ui.displayBiography = false;
					grm.ui.lyricsLayoutFullWidth = grSet.lyricsLayout === 'full';
				}
				if (grm.ui.displayLyrics && grSet.lyricsLayout === 'full') {
					grm.ui.displayPlaylist = false;
					grm.ui.displayLyrics = true;
					grm.ui.lyricsLayoutFullWidth = grSet.lyricsLayout === 'full';
				}
				pl.call.on_size(grm.ui.ww, grm.ui.wh);
				grm.lyrics.initLyrics();
				on_playback_seek();
				grm.ui.resizeArtwork(true);
				grm.button.initButtonState();
				RepaintWindow();
			});
		}

		const lyricsDisplayMenu = new Menu('Display');
		lyricsDisplayMenu.createRadioSubMenu('Show drop shadow', ['None', 'Small', 'Normal', 'Large'], grSet.lyricsDropShadowLevel, [0, 1, 2, 3], (size) => {
			grSet.lyricsDropShadowLevel = size;
			grm.lyrics.initLyrics();
			RepaintWindow();
		});
		lyricsDisplayMenu.addToggleItem('Show fade scroll', grSet, 'lyricsFadeScroll', () => {
			grm.lyrics.initLyrics();
			RepaintWindow();
		});
		lyricsDisplayMenu.addToggleItem('Show larger current sync', grSet, 'lyricsLargerCurrentSync', () => {
			bioSet.largerSyncLyricLine = grSet.lyricsLargerCurrentSync;
			grm.lyrics.initLyrics();
			bio.ui.updateProp(1);
			RepaintWindow();
		});
		lyricsDisplayMenu.addToggleItem('Show lyrics on album art', grSet, 'lyricsAlbumArt', () => {
			grm.theme.initMainColors();
			RepaintWindow();
		});
		lyricsDisplayMenu.appendTo(lyricsMenu);

		const lyricsControlsMenu = new Menu('Controls');
		lyricsControlsMenu.addToggleItem('Remember lyrics panel state', grSet, 'lyricsRememberPanelState');
		lyricsControlsMenu.appendTo(lyricsMenu);

		const lyricsScrollSpeedMenu = new Menu('Scroll speed');
		lyricsScrollSpeedMenu.addRadioItems(['Fastest (very slow CPU)', 'Fast', 'Normal', 'Slow', 'Slowest (very fast CPU)'], grSet.lyricsScrollSpeed, ['fastest', 'fast', 'normal', 'slow', 'slowest'], (speed) => {
			grSet.lyricsScrollSpeed = speed;
			switch (speed) {
				case 'fastest':
					grSet.lyricsScrollRateAvg = 300;
					grSet.lyricsScrollRateMax = 150;
					break;
				case 'fast':
					grSet.lyricsScrollRateAvg = 500;
					grSet.lyricsScrollRateMax = 250;
					break;
				case 'normal':
					grSet.lyricsScrollRateAvg = 750;
					grSet.lyricsScrollRateMax = 375;
					break;
				case 'slow':
					grSet.lyricsScrollRateAvg = 1000;
					grSet.lyricsScrollRateMax = 500;
					break;
				case 'slowest':
					grSet.lyricsScrollRateAvg = 1500;
					grSet.lyricsScrollRateMax = 725;
					break;
			}
			grm.lyrics.clear();
			grm.lyrics.initLyrics();
			RepaintWindow();
		});
		lyricsScrollSpeedMenu.appendTo(lyricsMenu);
		lyricsMenu.addSeparator();

		lyricsMenu.addItem('Lyrics information', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Lyric information'); });
		lyricsMenu.addItem('Lyrics search', false, () => { fb.RunMainMenuCommand('View/ESLyric/Search...'); });
		lyricsMenu.addSeparator();
		lyricsMenu.addItem('Next lyrics', false, () => { grm.lyrics.nextLyrics(); });
		lyricsMenu.addItem('Edit lyrics', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Edit lyric'); });
		lyricsMenu.addItem('Delete lyrics', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Delete lyric'); });
		lyricsMenu.addSeparator();
		lyricsMenu.addItem('Save lyrics to tags', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Save Lyric To/Tags'); });
		lyricsMenu.addSeparator();
		lyricsMenu.addItem('Open containing folder', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Open containing folder'); });

		if (!context_menu) lyricsMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Settings.
	 * @param {Menu} menu - Creates the Settings menu via a new Menu instance.
	 * @protected
	 */
	settingsOptions(menu) {
		const settingsMenu = new Menu('Settings');

		// * THEME DAY/NIGHT MODE * //
		const themeDayNightModeMenu = new Menu('Theme day/night mode');

		const dayNightTimeRangeDefaults = ['6-18', '7-19', '8-20', '9-21', '10-22'];
		const dayNightTimeRangeLabels = dayNightTimeRangeDefaults.map(FormatThemeDayNightModeString);
		dayNightTimeRangeLabels.unshift('Deactivated (default)');

		const dayNightTimeRangeCustom = grSet.themeDayNightMode && !dayNightTimeRangeDefaults.includes(grSet.themeDayNightMode);
		const dayNightTimeRangeCustomLabel = `Custom: ${FormatThemeDayNightModeString(grSet.themeDayNightMode)}`;
		const dayNightTimeRangeVal = dayNightTimeRangeCustom ? grSet.themeDayNightMode : (grSet.themeDayNightMode || false);
		const dayNightTimeRangeValues = [false, ...dayNightTimeRangeDefaults];

		if (dayNightTimeRangeCustom) {
			dayNightTimeRangeLabels.push(dayNightTimeRangeCustomLabel);
			dayNightTimeRangeValues.push(grSet.themeDayNightMode);
		}

		themeDayNightModeMenu.addItem('Set custom time range', false, () => {
			grm.inputBox.themeDayNightModeCustom();
		});
		themeDayNightModeMenu.addSeparator();
		themeDayNightModeMenu.addRadioItems(dayNightTimeRangeLabels, dayNightTimeRangeVal, dayNightTimeRangeValues, (time) => {
			grSet.themeDayNightMode = time;
			if (!grSet.themeDayNightMode) {
				grSet.themeDayNightMode = false;
				clearInterval(grm.ui.themeDayNightModeTimer);
				grm.ui.themeDayNightModeTimer = null;
				return;
			}
			const msg = 'Do you want to activate the theme day/night mode?\n\nThe default daytime theme is White\nand the nighttime theme is Black.\n\nYou can set up and configure\na new theme and styles for both modes\nin the theme day/night mode setup.\n\nContinue?\n\n\n';
			const msgFb = 'Theme day/night mode is active:\n\nThe default daytime theme is White\nand the nighttime theme is Black.\n\nYou can set up and configure\na new theme and styles for both modes\nin the theme day/night mode setup.';
			ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) {
					grm.ui.resetTheme();
					initThemeDayNightMode(new Date());
					grm.ui.initThemeFull = true;
					if (grSet.theme.startsWith('custom')) grm.ui.initCustomTheme();
					if (!fb.IsPlaying) grm.color.setThemeColors();
					grm.ui.initTheme();
					grm.ui.initStyleState();
					grm.preset.initThemePresetState();
				} else {
					grSet.themeDayNightMode = false;
					if (grSet.presetAutoRandomMode !== 'off') {
						grSet.presetAutoRandomMode = 'dblclick';
						grm.preset.getRandomThemePreset();
					}
				}
			});
		});
		themeDayNightModeMenu.addSeparator();
		themeDayNightModeMenu.appendTo(settingsMenu);
		themeDayNightModeMenu.addItem(!grSet.themeSetupDay ? 'Theme setup for daytime' : 'Save and exit daytime theme setup', false, () => {
			grSet.themeSetupDay = !grSet.themeSetupDay;
			grSet.themeSetupNight = false;
			RepaintWindow();
			if (!grSet.themeSetupDay) {
				grm.ui.themeNotification = '';
				return;
			}
			const msg = '>>> Theme setup for daytime is active <<<\n\nPlease select your theme and styles for daytime usage.\nAfter configuring the theme settings, revisit this menu to save them.\n\n\n';
			ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			grm.ui.resetTheme();
			setThemeDayNightTheme(true);
			grm.ui.initThemeFull = true;
			if (grSet.theme.startsWith('custom')) grm.ui.initCustomTheme();
			if (!fb.IsPlaying) grm.color.setThemeColors();
			grm.ui.initTheme();
			grm.ui.initStyleState();
			grm.preset.initThemePresetState();
		});
		themeDayNightModeMenu.addItem(!grSet.themeSetupNight ? 'Theme setup for nighttime' : 'Save and exit nighttime theme setup', false, () => {
			grSet.themeSetupDay = false;
			grSet.themeSetupNight = !grSet.themeSetupNight;
			RepaintWindow();
			if (!grSet.themeSetupNight) {
				grm.ui.themeNotification = '';
				return;
			}
			const msg = '>>> Theme setup for nighttime is active <<<\n\nPlease select your theme and styles for nighttime usage.\nAfter configuring the theme settings, revisit this menu to save them.\n\n\n';
			ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			grm.ui.resetTheme();
			setThemeDayNightTheme(false);
			grm.ui.initThemeFull = true;
			if (grSet.theme.startsWith('custom')) grm.ui.initCustomTheme();
			if (!fb.IsPlaying) grm.color.setThemeColors();
			grm.ui.initTheme();
			grm.ui.initStyleState();
			grm.preset.initThemePresetState();
		});

		// * HIDE OTHER MENUS WHEN THEME DAY/NIGHT SETUP IS ACTIVE
		if (grSet.themeSetupDay || grSet.themeSetupNight) {
			settingsMenu.appendTo(menu);
			return;
		}

		// * THEME SANDBOX * //
		const themeSandboxMenu = new Menu('Theme sandbox');
		const restoreThemeStylePresetSettings = (reset) => {
			grSet.presetAutoRandomMode = 'dblclick';
			grm.ui.setThemePresetSelection(true); // * Reactivate all
			grm.ui.resetTheme();
			if (reset) grm.ui.restoreThemeStylePreset(true); else grm.ui.restoreThemeStylePreset();
			if (grSet.savedPreset !== false) grm.preset.setThemePreset(grSet.savedPreset);
			grm.ui.updateStyle();
		}
		themeSandboxMenu.addToggleItem('Enabled', grSet, 'themeSandbox', () => {
			if (!grSet.themeSandbox) {
				const msg = 'Do you want to restore\nor keep current theme settings?\n\nThis will restore previously used\ntheme, styles, preset\nor use the current active.\n\nContinue?\n\n\n';
				const msgFb = 'Theme settings restored:\n\nTheme, styles or preset have been restored.';
				ShowPopup(true, msgFb, msg, 'Restore', 'Keep', (confirmed) => {
					if (confirmed) {
						restoreThemeStylePresetSettings();
					} else {
						restoreThemeStylePresetSettings(true);
					}
				});
				return;
			}
			const msg = 'Do you want to activate the theme sandbox?\n\nThis mode is useful when trying out\nthemes, styles, presets or writing theme tags.\n\nAfter disabling the theme sandbox mode,\npreviously used theme settings can be restored.\n\nContinue?\n\n\n';
			const msgFb = 'Theme sandbox mode activated:\n\nThis mode is useful when trying out\nthemes, styles, presets or writing theme tags.\n\nAfter disabling the theme sandbox mode,\npreviously used theme settings will be restored.';
			ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) grSet.themeSandbox = false;
			});
		});
		themeSandboxMenu.addSeparator();
		themeSandboxMenu.addItem('Restore theme settings', false, () => {
			const msg = 'Do you want to restore theme settings?\n\nThis will restore previously used\ntheme, styles, preset.\n\nContinue?\n\n\n';
			const msgFb = 'Theme settings restored:\n\nTheme, styles or preset have been restored.';
			ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) restoreThemeStylePresetSettings();
			});
		}, grSet.themeSandbox);
		themeSandboxMenu.appendTo(settingsMenu);

		// * THEME FONTS * //
		const themeFontMenu = new Menu('Theme fonts');
		themeFontMenu.addToggleItem('Use custom theme fonts', grSet, 'customThemeFonts', () => {
			const msg = 'Do you want to use custom theme fonts?\n\nYou need to set your custom fonts in your config file located in\nfoobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				grSet.customThemeFonts = confirmed;
			});
			window.Reload();
		});
		themeFontMenu.appendTo(settingsMenu);

		// * THEME IMAGES * //
		const themeImagesMenu = new Menu('Theme images');
		themeImagesMenu.addToggleItem('Use custom preloader logo', grSet, 'customPreloaderLogo', () => {
			if (!grSet.customPreloaderLogo) return window.Reload();
			const customLogoPath = `${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\_4K-custom-logo.png and _custom-logo.png`;
			const msg = `The custom logo placeholder can be replaced\nwith a new logo:\n\n${customLogoPath}\n\nRecommended logo dimensions are:\n500x500 pixels for 4K\n250x250 pixels for HD\n\n\n`;
			ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			window.Reload();
		});
		themeImagesMenu.addToggleItem('Use custom theme images', grSet, 'customThemeImages', () => {
			if (!grSet.customThemeImages) return window.Reload();
			const customImagesPath = `${fb.ProfilePath}georgia-reborn\\images\\custom\\`;
			const msg = `All theme images can be safely replaced\nwith new custom ones:\n\n${customImagesPath}\n\nPlease ensure all images have the same names\nas the original ones, which are located in the\nparent directory.\n\n\n`;
			ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			window.Reload();
		});
		themeImagesMenu.appendTo(settingsMenu);

		// * THEME CACHE * //
		const themeCacheMenu = new Menu('Theme cache');
		const themeCacheLibraryMenu = new Menu('Library');
		themeCacheLibraryMenu.addToggleItem('Image disk cache enabled', libSet, 'albumArtDiskCache');
		themeCacheLibraryMenu.addToggleItem('Preload images in disk cache', libSet, 'albumArtPreLoad');
		themeCacheLibraryMenu.addToggleItem('Use custom library directory', grSet, 'customLibraryDir', () => {
			if (grSet.customLibraryDir) grm.inputBox.customCacheDir('library');
			window.Reload();
		});
		themeCacheLibraryMenu.addSeparator();
		themeCacheLibraryMenu.addItem('Open library cache directory', false, () => {
			const cacheDir = grSet.customLibraryDir ? grCfg.customLibraryDir : `${fb.ProfilePath}cache\\library\\library-tree-cache`;
			try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheLibraryMenu.addItem('Delete library cache', false, () => {
			const msg = 'Do you want to delete the library cache?\n\nThis will permanently delete cached library album art thumbnails.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteLibraryCache();
			});
		});
		themeCacheLibraryMenu.addSeparator();
		themeCacheLibraryMenu.addToggleItem('Auto-delete library cache on startup', grSet, 'libraryAutoDelete', () => {
			const msg = 'Do you want to set auto-delete for library cache?\n\nThis will always auto-delete cached library album art thumbnails on startup.\n\nContinue?\n\n\n';
			if (grSet.libraryAutoDelete) {
				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					grSet.libraryAutoDelete = confirmed;
				});
			}
		});
		themeCacheLibraryMenu.appendTo(themeCacheMenu);

		const themeCacheBiographyMenu = new Menu('Biography');
		themeCacheBiographyMenu.addToggleItem('Use custom biography directory', grSet, 'customBiographyDir', () => {
			if (grSet.customBiographyDir) {
				grm.inputBox.customCacheDir('biography');
				const bioCfg = new BioSettings();
				bioCfg.resetCfg();
			}
			window.Reload();
		});
		themeCacheBiographyMenu.addSeparator();
		themeCacheBiographyMenu.addItem('Open biography cache directory', false, () => {
			const cacheDir = grSet.customBiographyDir ? grCfg.customBiographyDir : `${fb.ProfilePath}cache\\biography\\biography-cache`;
			try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheBiographyMenu.addItem('Delete biography cache', false, () => {
			const msg = 'Do you want to delete the biography cache?\n\nThis will permanently delete downloaded biography images and text files\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteBiographyCache();
			});
		});
		themeCacheBiographyMenu.addSeparator();
		themeCacheBiographyMenu.addToggleItem('Auto-delete biography cache on startup', grSet, 'biographyAutoDelete', () => {
			const msg = 'Do you want to set auto-delete for biography cache?\n\nThis will always auto-delete downloaded biography images\nand text on startup\n\nContinue?\n\n\n';
			if (grSet.biographyAutoDelete) {
				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					grSet.biographyAutoDelete = confirmed;
				});
			}
		});
		themeCacheBiographyMenu.appendTo(themeCacheMenu);

		const themeCacheLyricsMenu = new Menu('Lyrics');
		themeCacheLyricsMenu.addToggleItem('Use custom lyrics directory', grSet, 'customLyricsDir', () => {
			if (grSet.customLyricsDir) grm.inputBox.customCacheDir('lyrics');
			window.Reload();
		});
		themeCacheLyricsMenu.addSeparator();
		themeCacheLyricsMenu.addItem('Open lyrics directory', false, () => {
			const cacheDir = grSet.customLyricsDir ? grCfg.customLyricsDir : `${fb.ProfilePath}cache\\lyrics`;
			try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheLyricsMenu.addItem('Delete lyrics', false, () => {
			const msg = 'Do you want to delete all lyrics?\n\nThis will permanently delete downloaded lyrics.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteLyrics();
			});
		});
		themeCacheLyricsMenu.addSeparator();
		themeCacheLyricsMenu.addToggleItem('Auto-delete lyrics on startup', grSet, 'lyricsAutoDelete', () => {
			const msg = 'Do you want to set auto-delete for lyrics?\n\nThis will always auto-delete downloaded lyrics on startup.\n\nContinue?\n\n\n';
			if (grSet.lyricsAutoDelete) {
				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					grSet.lyricsAutoDelete = confirmed;
				});
			}
		});
		themeCacheLyricsMenu.appendTo(themeCacheMenu);

		const themeCacheWaveformBarMenu = new Menu('Waveform bar');
		themeCacheWaveformBarMenu.addToggleItem('Use custom waveform bar directory', grSet, 'customWaveformBarDir', () => {
			if (grSet.customWaveformBarDir) grm.inputBox.customCacheDir('waveformBar');
			window.Reload();
		});
		themeCacheWaveformBarMenu.addSeparator();
		themeCacheWaveformBarMenu.addItem('Open waveform bar cache directory', false, () => {
			const cacheDir = grSet.customWaveformBarDir ? grCfg.customWaveformBarDir : `${fb.ProfilePath}cache\\waveform`;
			try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheWaveformBarMenu.addItem('Delete waveform bar cache', false, () => {
			const msg = 'Do you want to delete all waveform bar cache?\n\nThis will permanently delete analyzed files.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteWaveformBarCache();
			});
		});

		themeCacheWaveformBarMenu.addToggleItem('Auto-delete waveform bar cache on startup', grSet, 'waveformBarAutoDelete', () => {
			const msg = 'Do you want to set auto-delete for waveform bar?\n\nThis will always auto-delete waveform bar cache on startup.\n\nContinue?\n\n\n';
			if (grSet.waveformBarAutoDelete) {
				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					grSet.waveformBarAutoDelete = confirmed;
				});
			}
		});
		themeCacheWaveformBarMenu.appendTo(themeCacheMenu);
		themeCacheMenu.appendTo(settingsMenu);

		// * THEME BACKUP * //
		const themeBackupMenu = new Menu('Theme backup');
		themeBackupMenu.addItem('Make backup', false, () => {
			const msg = `Do you want to make a backup of the theme?\n\nThis will create a backup in ${fb.ProfilePath}backup\n\nOn new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\nIf a backup already exist, you can use\nOptions > Settings > Theme backup > Restore backup\n\nContinue?\n\n\n`;
			const msgFb = `You can find the Georgia-ReBORN theme backup in ${fb.ProfilePath}backup\n\nOn new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\nIf a backup already exist, you can use\nOptions > Settings > Theme backup > Restore backup`;
			ShowPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) ManageBackup(true);
			});
		});

		themeBackupMenu.addItem('Restore backup', false, () => {
			const msg = `Do you want to restore your backup of the theme?\n\n>>> WARNING <<<\n\nThis will restore your backup from ${fb.ProfilePath}\n\nChanges and modifications since your last backup\n(new theme settings, new playlists and play statistics)\nwill be lost!\n\nIt is recommended to make a new backup\nbefore you restore.\n\nContinue?\n\n\n`;
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) ManageBackup(false, true);
			});
		});
		themeBackupMenu.appendTo(settingsMenu);

		// * THEME CONFIGURATION * //
		const themeConfigMenu = new Menu('Theme configuration');
		themeConfigMenu.addItem('Save settings to config file', false, () => {
			const msg = 'Do you want to save all current theme settings?\n\nThis will overwrite all settings from the top menu "Options"\nin the georgia-reborn-config.jsonc file.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				const start = async () => {
					await grm.settings.setThemeSettings(true);
					await window.Reload();
				};
				start();
				console.log(`\n>>> Georgia-ReBORN theme settings have been successfully saved in ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc <<<\n\n`);
			});
		});
		themeConfigMenu.addItem('Load settings from config file', false, () => {
			const msg = 'Do you want to load all theme settings\nfrom the georgia-reborn-config.jsonc file?\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				const start = async () => {
					await grm.settings.setThemeSettings(false, true);
					await window.Reload();
				};
				start();
				console.log(`\n>>> Georgia-ReBORN theme settings have been successfully loaded from ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc <<<\n\n`);
			});
		});
		themeConfigMenu.addSeparator();
		themeConfigMenu.addItem('Load default settings', false, () => {
			const msg = 'Do you want to load default theme settings?\n\nThis will not overwrite the georgia-reborn-config.jsonc file,\nbut you should probably first save your settings.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				const start = async () => {
					await grm.settings.setThemeSettings(false, false, true);
					await grm.display.autoDetectRes();
					await window.Reload();
				};
				start();
				console.log('\n>>> Default Georgia-ReBORN theme settings have been successfully loaded <<<\n\n');
			});
		});
		themeConfigMenu.addSeparator();
		themeConfigMenu.addItem('Edit main configuration file', false, () => {
			try {
				OpenFile(`${grCfg.config.getPath()}`);
			} catch (e) {
				OpenExplorer(`explorer /select, "${grCfg.config.getPath()}"`, false);
			}
		});
		themeConfigMenu.addItem('Edit custom configuration file', false, () => {
			try {
				OpenFile(`${grCfg.configCustom.getPath()}`);
			} catch (e) {
				OpenExplorer(`explorer /select, "${grCfg.configCustom.getPath()}"`, false);
			}
		});
		themeConfigMenu.addSeparator();
		themeConfigMenu.addItem('Reset main configuration file', false, () => {
			const msg = 'Do you want to reset the config file to default?\n\n!!! WARNING !!!\n\nThis will set all settings to default.\nYou should probably make a backup first.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				try { // Needed to prevent crash when there is no config file
					grCfg.config.resetConfiguration();
					grm.settings.setThemeSettings(false, false, true);
					grm.display.layoutDefault();
					console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc file has been successfully reset to default. <<<\n\n`);
				} catch (e) { window.Reload(); }
			});
		});
		themeConfigMenu.addItem('Reset custom configuration file', false, () => {
			const msg = 'Do you want to reset the custom config file to default?\n\n!!! WARNING !!!\n\nThis will delete and replace all custom themes\nto the default custom theme template.\nYou should definitely make a backup first.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				try { // Needed to prevent crash when there is no config file
					grCfg.configCustom.resetConfiguration();
					console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc file has been successfully reset to default. <<<\n\n`);
				} catch (e) { window.Reload(); }
			});
		});
		themeConfigMenu.addSeparator();
		themeConfigMenu.addItem('Reset all', false, () => {
			const msg = 'Do you want to reset all theme settings to default?\n\nThis will also clear all library custom views plus filters\nand Georgia-ReBORN config.\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				grSet.systemFirstLaunch = true; // Reset Georgia-ReBORN theme settings
				try { // Needed to prevent crash when there is no config file
					fso.DeleteFile(`${fb.ProfilePath}configuration\\foo_ui_columns.dll.cfg`);
					grCfg.config.resetConfiguration(); // Reset Georgia-ReBORN config file
					lib.panel.updateProp(libSet, 'default_value'); // Reset Library settings
					bio.ui.updateProp(bioSet, 'default_value'); // Reset Biography settings
					const server = new BioSettings();
					server.resetCfg(); // Reset Biography server settings
					console.log('\n>>> Georgia-ReBORN has been successfully reset <<<\n\n');
				} catch (e) {
					fb.ShowPopupMessage('Something went wrong and Georgia-ReBORN has NOT been successfully reset, try again!', 'Resetting Georgia-ReBORN');
				}
			});
		});
		themeConfigMenu.appendTo(settingsMenu);

		// * THEME PERFORMANCE * //
		settingsMenu.createRadioSubMenu('Theme performance', ['Lowest quality (fastest speed - very slow CPU)', 'Low quality', 'Balanced (Default)', 'High quality', 'Highest quality (slowest speed - very fast CPU)'], grSet.themePerformance,
			['lowestQuality', 'lowQuality', 'balanced', 'highQuality', 'highestQuality'], (perf) => {
			const msg = 'Do you want to change the theme performance?\n\nThese presets will change various theme settings!\nIt is recommended to save current theme settings\nto the config file. You should also make a backup\nof your playlists to be on the safe side!\n\n!!! WARNING !!!\n"High quality" and especially "Highest Quality"\ncan freeze foobar, depending how fast your CPU performs.\nIt does not matter if you are using a multi-core CPU,\nonly single-core CPU performance counts!\nIf your foobar is unresponsive, restart\nand change to a lighter preset.\n\nContinue?';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				grSet.themePerformance = perf;
				grm.settings.setThemePerformance('balanced'); // First reset
				grm.settings.setThemePerformance(grSet.themePerformance); // Then set
				window.Reload();
			});
		});
		settingsMenu.addSeparator();

		// * OTHER SETTINGS * //
		settingsMenu.addItem('Output device', false, () => {
			const outputDeviceMenu = (x, y) => {
				const menu = window.CreatePopupMenu();
				const output = fb.GetOutputDevices();
				const deviceList = JSON.parse(output);
				const last = deviceList.length + 1
				let active = -1;
				for (const [i, array] of deviceList.entries()) {
					menu.AppendMenuItem(MF_STRING, i + 1, array.name);
					if (array.active) active = i;
				}
				menu.AppendMenuSeparator();
				menu.AppendMenuItem(MF_STRING, last, 'Preferences...');

				if (active > -1) menu.CheckMenuRadioItem(1, last, active + 1);
				const idx = menu.TrackPopupMenu(x, y);
				if (idx > 0 && idx < last) fb.RunMainMenuCommand(`Playback/Device/${deviceList[idx - 1].name}`);
				else if (idx === last) fb.RunMainMenuCommand('Playback/Device/Preferences...');
			};
			outputDeviceMenu(grm.ui.state.mouse_x, grm.ui.state.mouse_y);
		});

		settingsMenu.addSeparator();
		settingsMenu.addToggleItem('Developer tools', grSet, 'devTools', () => { grSet.disableRightClick = !grSet.devTools; });
		settingsMenu.addSeparator();
		settingsMenu.addToggleItem('Disable right-click', grSet, 'disableRightClick');

		settingsMenu.appendTo(menu);
	}

	/**
	 * Top menu > Options > Developer tools.
	 * @param {Menu} menu - Creates Developer tools menu via a new Menu instance.
	 * @protected
	 */
	developerToolsOptions(menu) {
		if (!grSet.devTools) return;
		const debugMenu = new Menu('Developer tools');

		const clearAutoDownloadBio = () => {
			grm.ui.autoDownloadBio = false;
			grm.button.setPlaybackOrder(grm.ui.btnImg.PlaybackDefault, 'default', PlaybackOrder.Default, 'Default');
			grm.ui.displayBiography = false;
			clearInterval(grm.ui.autoDownloadBioTimer);
		};

		const clearAutoDownloadLyrics = () => {
			grm.ui.autoDownloadLyrics = false;
			grm.button.setPlaybackOrder(grm.ui.btnImg.PlaybackDefault, 'default', PlaybackOrder.Default, 'Default');
			grm.ui.displayLyrics = false;
			clearInterval(grm.ui.autoDownloadLyricsTimer);
		};

		debugMenu.addItem('Console', false, () => { fb.RunMainMenuCommand('View/Console'); }); // Top menu 'View' does not exist in Artwork/Compact layout
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Enable auto-download biography', grm.ui, 'autoDownloadBio', () => {
			if (!grm.ui.autoDownloadBio) {
				clearAutoDownloadBio();
			} else {
				const msg = 'Do you want to enable\nthe auto-download biography mode?\n\nThis will set the playback order to shuffle\nand activate a 6-second timer to automatically\ndownload the biography.\n\nThis is recommended when you leave your PC\nunattended for a longer period of time.\n\nContinue?\n\n\n';
				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						grm.ui.autoDownloadBio = false;
						return;
					}
					clearAutoDownloadLyrics();
					fb.Play();
					grm.button.setPlaybackOrder(grm.ui.btnImg.PlaybackShuffle, 'shuffle', PlaybackOrder.ShuffleTracks, 'Shuffle (tracks)');
					grm.ui.displayBiography = true;
					grm.ui.autoDownloadBioTimer = setInterval(() => { fb.Next(); }, 6000);
				});
			}
			grm.ui.btn.playbackOrder.repaint();
			grm.button.initButtonState();
			window.Repaint();
		});
		debugMenu.addToggleItem('Enable auto-download lyrics', grm.ui, 'autoDownloadLyrics', () => {
			if (!grm.ui.autoDownloadLyrics) {
				clearAutoDownloadLyrics();
			} else {
				const msg = 'Do you want to enable\nthe auto-download lyrics mode?\n\nThis will set the playback order to playlist\nand activate a 15-second timer to automatically\ndownload the lyrics.\n\nThis is recommended when you leave your PC\nunattended for a longer period of time.\n\nContinue?\n\n\n';
				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						grm.ui.autoDownloadLyrics = false;
						return;
					}
					clearAutoDownloadBio();
					fb.Play();
					grm.button.setPlaybackOrder(grm.ui.btnImg.PlaybackRepeatPlaylist, 'repeatPlaylist', PlaybackOrder.RepeatPlaylist, 'Repeat (playlist)');
					grm.ui.displayLyrics = true;
					grm.lyrics.initLyrics();
					grm.ui.autoDownloadLyricsTimer = setInterval(() => { fb.Next(); }, 15000);
				});
			}
			grm.ui.btn.playbackOrder.repaint();
			grm.button.initButtonState();
			window.Repaint();
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Enable double click refresh', grCfg.settings, 'doubleClickRefresh');
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Enable debug output', grCfg.settings, 'showDebugLog');
		debugMenu.addItem('Enable debug theme output', grCfg.settings.showDebugThemeLog, () => {
			grCfg.settings.showDebugThemeLog = !grCfg.settings.showDebugThemeLog;
			if (grCfg.settings.showDebugThemeLog) {
				grm.ui.albumArt = null;
				on_playback_new_track(fb.GetNowPlaying());
			}
		});
		debugMenu.addItem('Enable debug theme overlay', grCfg.settings.showDebugThemeOverlay, () => {
			grCfg.settings.showDebugThemeOverlay = !grCfg.settings.showDebugThemeOverlay;
			if (grCfg.settings.showDebugThemeOverlay) {
				grm.ui.albumArt = null;
				on_playback_new_track(fb.GetNowPlaying());
			} else {
				RepaintWindow();
			}
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show draw timing', grm.ui, 'showDrawTiming');
		debugMenu.addToggleItem('Show extra draw timing', grm.ui, 'showExtraDrawTiming');
		debugMenu.addToggleItem('Show debug timing', grm.ui, 'showDebugTiming');
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show ram usage', grm.ui, 'showRamUsage');
		debugMenu.addToggleItem('Show draw areas', grm.ui, 'drawRepaintRects', () => {
			if (grm.ui.drawRepaintRects) {
				RepaintRectAreas();
			} else {
				RepaintWindow();
			}
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show panel calls', grm.ui, 'showPanelTraceCall', () => {
			if (grm.ui.showPanelTraceCall) {
				grm.ui.traceCall = true;
			} else {
				grm.ui.traceCall = false;
				if (grm.ui.showPanelTraceOnMove) {
					grm.ui.traceOnMove = false;
					grm.ui.showPanelTraceOnMove = false;
				}
			}
		});
		debugMenu.addToggleItem('Show panel moves', grm.ui, 'showPanelTraceOnMove', () => {
			if (grm.ui.showPanelTraceOnMove) {
				grm.ui.traceOnMove = true;
				grm.ui.traceCall = true;
				grm.ui.showPanelTraceCall = true;
				return;
			}
			grm.ui.traceOnMove = false;
			grm.ui.traceCall = false;
			grm.ui.showPanelTraceCall = false;
		});
		debugMenu.addToggleItem('Show playlist performance', grm.ui, 'showPlaylistTraceListPerf', () => {
			grm.ui.traceListPerformance = !grm.ui.traceListPerformance;
		});
		debugMenu.addSeparator();
		debugMenu.addItem('Set system first launch to true', false, () => { // Used when creating new config files
			const msg = 'Do you really want to set system to first launch?\n\nContinue?\n\n\n';
			ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				window.SetProperty('Georgia-ReBORN - 16. System: System first launch', true);
				plSet.show_scrollbar = false;
				grSet.showTopMenuCompact = true;
				grSet.devTools = false;
				grSet.disableRightClick = true;
				console.log('\n>>> Georgia-ReBORN has been set to system first launch <<<\n\n');
			});
		});

		debugMenu.appendTo(menu);
	}
	// #endregion
}
