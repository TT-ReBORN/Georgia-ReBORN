/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Menu                                     * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    28-09-2025                                              * //
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
				statusMenu.addItem('Flag images found', IsFile(`${grPath.flagsBase + HD_4K('32\\', '64\\')}United-States.png`), undefined, true);
				statusMenu.addItem('foo_enhanced_playcount installed', Component.EnhancedPlaycount, () => { RunCmd('https://www.foobar2000.org/components/view/foo_enhanced_playcount'); });
				statusMenu.appendTo(themeMenu);

				const updatesMenu = new Menu('Updates');
				updatesMenu.addToggleItem('Auto-check for theme updates', grSet, 'checkForUpdates', () => { grCfg.scheduleUpdateCheck(1000); });
				updatesMenu.addItem('Check for latest theme update', false, () => { grCfg.checkForUpdates(true, true); });
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

		plTools.AppendTo(cpm, MenuFlag.String, 'Playlist tools');
		plTools.AppendMenuItem(MenuFlag.String, 1, 'Playlist manager \tCtrl+M');
		plTools.AppendMenuItem(MenuFlag.String, 2, 'Playlist search \tCtrl+F');
		plTools.AppendMenuSeparator();
		plTools.AppendMenuItem(MenuFlag.String, 3, 'Create new playlist \tCtrl+N');
		autoPl.AppendTo(plTools, MenuFlag.String, 'Create new auto playlist');
		autoPl.AppendMenuItem(MenuFlag.String, 4, 'Custom auto playlist');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MenuFlag.String, 5, 'Tracks from the library');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MenuFlag.String, 6, 'Tracks most played');
		autoPl.AppendMenuItem(MenuFlag.String, 7, 'Tracks never played');
		autoPl.AppendMenuItem(MenuFlag.String, 8, 'Tracks played in the last week');
		autoPl.AppendMenuItem(MenuFlag.String, 9, 'Tracks played in the last month');
		autoPl.AppendMenuItem(MenuFlag.String, 10, 'Tracks played in the last year');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MenuFlag.String, 11, 'Tracks unrated');
		autoPl.AppendMenuItem(MenuFlag.String, 12, 'Tracks rated 1 star');
		autoPl.AppendMenuItem(MenuFlag.String, 13, 'Tracks rated 2 stars');
		autoPl.AppendMenuItem(MenuFlag.String, 14, 'Tracks rated 3 stars');
		autoPl.AppendMenuItem(MenuFlag.String, 15, 'Tracks rated 4 stars');
		autoPl.AppendMenuItem(MenuFlag.String, 16, 'Tracks rated 5 stars');
		autoPl.AppendMenuSeparator();
		autoPl.AppendMenuItem(MenuFlag.String, 17, 'Loved tracks');
		plTools.AppendMenuSeparator();
		plTools.AppendMenuItem(MenuFlag.String, 18, 'Save playlist \tCtrl+S');
		plTools.AppendMenuItem(MenuFlag.String, 19, 'Load playlist');
		plTools.AppendMenuItem(isAutoPl ? MenuFlag.Disabled : MenuFlag.String, 20, isLocked ? isAutoPl ? 'Unlock playlist (N/A for auto playlists)' : 'Unlock playlist' : 'Lock playlist');
		cpm.AppendMenuSeparator();
		for (let i = 0; i < playlistCount; i++) {
			cpm.AppendMenuItem(MenuFlag.String, playlistId + i, `${plman.GetPlaylistName(i).replace(/&/g, '&&')} [${plman.PlaylistItemCount(i)}]${plman.IsAutoPlaylist(i) ? ' (Auto)' : ''}${i === plman.PlayingPlaylist ? ' (Now Playing)' : ''}`);
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
	 * Handles all top menus, also used to append panel-related menus to the context menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {boolean} contextMenu - If true, appends panel-related menus to the context menu.
	 * @param {string} panel - The name of the panel to be appended. Can be 'playlist', 'details', 'library', 'biography', or 'lyrics'.
	 */
	topMenuOptions(x, y, contextMenu, panel) {
		grm.ui.activeMenu = true;
		grm.ui.state.mouse_x = x;
		grm.ui.state.mouse_y = y;

		const menu = new Menu();

		const panelOptionsMenu = {
			playlist: grm.options.playlistOptions,
			details: grm.options.detailsOptions,
			library: grm.options.libraryOptions,
			biography: grm.options.biographyOptions,
			lyrics: grm.options.lyricsOptions
		};

		const themeDayNightSandbox = grSet.themeSetupDay || grSet.themeSetupNight || grSet.themeSandbox;

		if (!contextMenu) {
			grm.options.themeOptions(menu);
			grm.options.styleOptions(menu);
			grm.options.presetOptions(menu);

			if (!themeDayNightSandbox) {
				grm.options.playerSizeOptions(menu);
				grm.options.layoutOptions(menu);
				grm.options.displayOptions(menu);
			}

			grm.options.brightnessOptions(menu);

			if (!themeDayNightSandbox) {
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
		else if (panelOptionsMenu[panel]) {
			panelOptionsMenu[panel](menu, contextMenu);
		}

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
	/**
	 * Creates the `TopMenuOptions` instance.
	 */
	constructor() {
		/**
		 * Applies a given theme setting with or without theme sandbox mode.
		 * If theme sandbox mode is off, the setting is saved and then applied.
		 * If theme sandbox mode is on, the setting is applied without saving.
		 * Triggers additional actions like showing a popup if theme day/night mode is active and sets the theme day/night style.
		 * @param {string} setting - The name of the setting to be applied.
		 * @param {boolean} value - The value to be set for the setting.
		 * @private
		 */
		this.applyThemeSetting = (setting, value) => {
			if (grSet.themeDayNightMode) {
				initThemeDayNightMode(new Date());
				const msg = grm.msg.getMessage('main', 'themeDayNightModeNotice');
				const msgFb = grm.msg.getMessage('main', 'themeDayNightModeNotice', true);
				grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (confirmed) grSet.themeDayNightMode = false;
				});
				if (grSet.themeDayNightMode) return;
			}

			if (setting) {
				const savedSettingName = `saved${setting.charAt(0).toUpperCase()}${setting.slice(1)}`;
				if (grSet.themeSandbox) {
					grSet[setting] = value;
				} else {
					grm.ui.restoreThemeStylePreset(true, true);
					grSet[savedSettingName] = grSet[setting] = value;
				}
			}

			if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
		}

		/** @public @type {ActiveXObject} The Audio Wizard ActiveX object. */
		this.audioWizard = Component.AudioWizard ? new ActiveXObject('AudioWizard') : null;
	}

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
			this.applyThemeSetting('theme', theme);
			grm.ui.resetTheme();
			grm.ui.initTheme();
			grm.details.setDiscArtShadow();
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
			this.applyThemeSetting('theme', theme);
			grm.ui.resetTheme();
			grm.ui.initCustomTheme();
			grm.ui.initTheme();
			grm.details.setDiscArtShadow();
			grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg');
			grm.preset.initThemePresetState();
		});
		customThemeMenu.addSeparator();

		customThemeMenu.addItem(!grm.ui.displayCustomThemeMenu ? 'Edit custom theme' : 'Close custom theme menu', false, () => {
			grm.ui.initCustomThemeMenuState();
		});

		customThemeMenu.addItem('Rename custom theme', false, () => {
			if (!grSet.theme.startsWith('custom')) {
				grm.msg.showPopupNotice('menu', 'renameCustomTheme');
				return;
			}
			grm.inputBox.renameCustomTheme();
		});

		customThemeMenu.createRadioSubMenu('Save current colors', customThemeName, '', ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'], (theme) => {
			const msg = grm.msg.getMessage('menu', 'saveCurrentColors');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
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
				grm.msg.showPopupNotice('menu', 'styleDefault');
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
		if (['reborn', 'random'].includes(grSet.theme) || grSet.theme.startsWith('custom')) {
			styleMenu.addToggleItem('Night', grSet, 'styleNighttime', () => {
				grm.ui.setStyle('styleNighttime', grSet.styleNighttime);
				grm.ui.updateStyle();
			});
			styleMenu.addSeparator();
		}
		styleMenu.addToggleItem('Bevel', grSet, 'styleBevel', () => {
			grm.ui.setStyle('styleBevel', grSet.styleBevel);
			grm.ui.updateStyle();
		});
		styleMenu.addSeparator();

		// * STYLES - GROUP ONE * //
		styleMenu.addToggleItem('Blend', grSet, 'styleBlend', () => {
			grm.ui.setStyle('styleBlend', grSet.styleBlend);
			grm.ui.updateStyle();
		});
		styleMenu.addToggleItem('Blend 2', grSet, 'styleBlend2', () => {
			grm.ui.setStyle('styleBlend2', grSet.styleBlend2);
			grm.ui.updateStyle();
		});
		if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(grSet.theme)) {
			styleMenu.addToggleItem('Gradient', grSet, 'styleGradient', () => {
				grm.ui.setStyle('styleGradient', grSet.styleGradient);
				grm.ui.updateStyle();
			}, grSet.styleRebornWhite);
		}
		if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(grSet.theme)) {
			styleMenu.addToggleItem('Gradient 2', grSet, 'styleGradient2', () => {
				grm.ui.setStyle('styleGradient2', grSet.styleGradient2);
				grm.ui.updateStyle();
			}, grSet.styleRebornWhite);
		}
		styleMenu.addSeparator();

		// * STYLES - GROUP TWO * //
		styleMenu.addToggleItem('Alternative', grSet, 'styleAlternative', () => {
			grm.ui.setStyle('styleAlternative', grSet.styleAlternative);
			grm.ui.updateStyle();
		});
		styleMenu.addToggleItem('Alternative 2', grSet, 'styleAlternative2', () => {
			grm.ui.setStyle('styleAlternative2', grSet.styleAlternative2);
			grm.ui.updateStyle();
		});
		if (grSet.theme === 'white') {
			styleMenu.addToggleItem('Black and white', grSet, 'styleBlackAndWhite', () => {
				grm.ui.setStyle('styleBlackAndWhite', grSet.styleBlackAndWhite);
				grm.ui.updateStyle();
			}, grSet.styleBlackAndWhiteReborn);
			styleMenu.addToggleItem('Black and white 2', grSet, 'styleBlackAndWhite2', () => {
				grm.ui.setStyle('styleBlackAndWhite2', grSet.styleBlackAndWhite2);
				grm.ui.updateStyle();
			}, grSet.styleBlackAndWhiteReborn);
			styleMenu.addToggleItem('Black and white reborn', grSet, 'styleBlackAndWhiteReborn', () => {
				grm.ui.setStyle('styleBlackAndWhiteReborn', grSet.styleBlackAndWhiteReborn);
				grm.ui.updateStyle();
			});
		}
		if (grSet.theme === 'black') {
			styleMenu.addToggleItem('Black reborn', grSet, 'styleBlackReborn', () => {
				grm.ui.setStyle('styleBlackReborn', grSet.styleBlackReborn);
				grm.ui.updateStyle();
			});
		}
		if (grSet.theme === 'reborn') {
			styleMenu.addToggleItem('Reborn white', grSet, 'styleRebornWhite', () => {
				grm.ui.setStyle('styleRebornWhite', grSet.styleRebornWhite);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn black', grSet, 'styleRebornBlack', () => {
				grm.ui.setStyle('styleRebornBlack', grSet.styleRebornBlack);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn fusion', grSet, 'styleRebornFusion', () => {
				grm.ui.setStyle('styleRebornFusion', grSet.styleRebornFusion);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn fusion 2', grSet, 'styleRebornFusion2', () => {
				grm.ui.setStyle('styleRebornFusion2', grSet.styleRebornFusion2);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Reborn fusion accent', grSet, 'styleRebornFusionAccent', () => {
				grm.ui.setStyle('styleRebornFusionAccent', grSet.styleRebornFusionAccent);
				grm.ui.updateStyle();
			});
		}
		if (grSet.theme === 'random') {
			styleMenu.addToggleItem('Random pastel', grSet, 'styleRandomPastel', () => {
				grm.ui.setStyle('styleRandomPastel', grSet.styleRandomPastel);
				grm.ui.updateStyle();
			});
			styleMenu.addToggleItem('Random dark', grSet, 'styleRandomDark', () => {
				grm.ui.setStyle('styleRandomDark', grSet.styleRandomDark);
				grm.ui.updateStyle();
			});
		}
		styleMenu.addSeparator();

		// * STYLES - RANDOM AUTO COLOR * //
		if (grSet.theme === 'random') {
			const styleAutoColorMenu = new Menu('Auto color');
			styleAutoColorMenu.addRadioItems(['Off', '5 sec', '10 sec', '15 sec', '30 sec', '45 sec', '1 min', '2 min', '3 min', '4 min', '5 min', 'New track'], grSet.styleRandomAutoColor,
				['off', 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, 'track'], (timer) => {
				grm.ui.setStyle('styleRandomAutoColor', timer);
				grm.color.getRandomThemeAutoColor();
			});
			styleAutoColorMenu.appendTo(styleMenu);
			styleMenu.addSeparator();
		}

		// * STYLES - BUTTONS * //
		const styleButtonsMenu = new Menu('Buttons');
		const styleTopButtonsMenu = new Menu('Top menu');
		styleTopButtonsMenu.addRadioItems(['Default', 'Filled', 'Bevel', 'Inner', 'Emboss', 'Minimal'], grSet.styleTopMenuButtons, ['default', 'filled', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
			grm.ui.setStyle('styleTopMenuButtons', style);
			grm.ui.updateStyle();
		});
		styleTopButtonsMenu.appendTo(styleButtonsMenu);
		const styleTransportButtonsMenu = new Menu('Transport');
		styleTransportButtonsMenu.addRadioItems(['Default', 'Bevel', 'Inner', 'Emboss', 'Minimal'], grSet.styleTransportButtons, ['default', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
			grm.ui.setStyle('styleTransportButtons', style);
			grm.ui.updateStyle();
		});
		styleTransportButtonsMenu.appendTo(styleButtonsMenu);
		styleButtonsMenu.appendTo(styleMenu);

		// * STYLES - PROGRESS BAR * //
		const styleProgressBarMenu = new Menu('Progress bar');
		styleProgressBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], grSet.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (design) => {
			grm.ui.setStyle('styleProgressBarDesign', design);
			grm.ui.updateStyle();
		});
		styleProgressBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], grSet.styleProgressBar, ['default', 'bevel', 'inner'], (style) => {
			grm.ui.setStyle('styleProgressBar', style);
			grm.ui.updateStyle();
		});
		styleProgressBarMenu.createRadioSubMenu('Progress fill', ['Default', 'Bevel', 'Inner', 'Blend'], grSet.styleProgressBarFill, ['default', 'bevel', 'inner', 'blend'], (style) => {
			grm.ui.setStyle('styleProgressBarFill', style);
			grm.ui.updateStyle();
		});
		styleProgressBarMenu.appendTo(styleMenu);

		// * STYLES - VOLUME BAR * //
		const styleVolumeBarMenu = new Menu('Volume bar');
		styleVolumeBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded'], grSet.styleVolumeBarDesign, ['default', 'rounded'], (design) => {
			grm.ui.setStyle('styleVolumeBarDesign', design);
			grm.ui.updateStyle();
		});
		styleVolumeBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], grSet.styleVolumeBar, ['default', 'bevel', 'inner'], (style) => {
			grm.ui.setStyle('styleVolumeBar', style);
			grm.ui.updateStyle();
		});
		styleVolumeBarMenu.createRadioSubMenu('Volume fill', ['Default', 'Bevel', 'Inner'], grSet.styleVolumeBarFill, ['default', 'bevel', 'inner'], (style) => {
			grm.ui.setStyle('styleVolumeBarFill', style);
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
					const msg = grm.msg.getMessage('menu', 'presetSelectModeDefault');
					const msgFb = grm.msg.getMessage('menu', 'presetSelectModeDefault', true);
					grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
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
					const msg = grm.msg.getMessage('menu', 'presetSelectModeHarmonic');
					const msgFb = grm.msg.getMessage('menu', 'presetSelectModeHarmonic', true);
					grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
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
					const msg = grm.msg.getMessage('menu', 'presetSelectModeTheme');
					const msgFb = grm.msg.getMessage('menu', 'presetSelectModeTheme', true);
					grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
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
			this.applyThemeSetting('preset', preset);
			grm.preset.setThemePreset(preset);
			this.applyThemeSetting(); // After applying the preset, synchronize the daytime/nighttime theme preset if necessary
			grm.details.setDiscArtShadow();
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
			applyThemePreset(preset);
			grm.ui.validateStyle(true);
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
				grm.ui.clearTimer('presetAutoRandomMode');
			}
		}, grSet.presetSelectMode === 'harmonic');
		themePresetAutoRandomModeMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addSeparator();
		themePresetsMenu.addToggleItem('Indicator', grSet, 'presetIndicator');
		themePresetsMenu.addItem('Info', false, () => { grm.preset.initThemePresetState(true); });

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
			grSet.displayScale = 100;
			grm.display.updatePlayerSize(grSet.playerSize);
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
			if (grSet.layout === 'artwork') {
				grSet.showPanelOnStartup = 'cover';
			}
			if (!fb.IsPlaying) { // Update lower bar version string
				grm.ui.clearPlaybackState(true);
			}
			grm.ui.displayPanel(false, true);
			grm.display.updatePlayerSize('small');
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
			grm.display.updatePlayerSize('small', true);
		});
		displayResMenu.addSeparator();
		displayResMenu.createRadioSubMenu('Scaling', ['  50%', '  60%', '  70%', '  80%', '  90%', '100%', '110%', '120%', '130%', '140%', '150%'],
			grSet.displayScale, [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150], (scale) => {
			grSet.displayScale = scale;
			const size = grm.display.checkPlayerSize(grm.ui.ww, grm.ui.wh, grSet.layout, grSet.displayRes);
			grm.display.updatePlayerSize(size, true);
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
			this.applyThemeSetting('themeBrightness', percent);
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
		const changeFontSizeMenu = new Menu('Font size');
		const mainFontSizeMenu = new Menu('Main');

		// * MAIN - TOP MENU * //
		mainFontSizeMenu.createRadioSubMenu('Top menu', ['  8px', '10px', '11px', HD_QHD_4K('12px (default)', '12px'), '13px', HD_QHD_4K('14px', '14px (default)'), '16px'], grSet.menuFontSize_layout, [8, 10, 11, 12, 13, 14, 16], (size) => {
			grm.display.setMenuFontSize(size);
		});

		// * MAIN - LOWER BAR * //
		mainFontSizeMenu.createRadioSubMenu('Lower bar', grSet.layout !== 'default' ? ['10px', '12px', '14px', HD_QHD_4K('16px (default)', '16px'), HD_QHD_4K('18px', '18px (default)'), '20px', '22px', '24px', '26px'] :
			['10px', '12px', '14px', '16px', HD_QHD_4K('18px (default)', '18px'), HD_QHD_4K('20px', '20px (default)'), '22px', '24px', '26px'], grSet.lowerBarFontSize_layout, [10, 12, 14, 16, 18, 20, 22, 24, 26], (size) => {
			grm.display.setLowerBarFontSize(size);
		});
		mainFontSizeMenu.appendTo(changeFontSizeMenu);

		// * MAIN - NOTIFICATION * //
		mainFontSizeMenu.createRadioSubMenu('Notification', ['12px', '14px', '16px', HD_QHD_4K('18px (default)', '18px'), HD_QHD_4K('20px', '20px (default)'), '22px', '24px'], grSet.notificationFontSize_layout,
			[12, 14, 16, 18, 20, 22, 24], (size) => {
			grm.display.setNotificationFontSize(size);
		});

		// * MAIN - POPUP * //
		mainFontSizeMenu.createRadioSubMenu('Popup', ['12px', '14px', HD_QHD_4K('16px (default)', '16px'), HD_QHD_4K('18px', '18px (default)'), '20px', '22px', '24px'], grSet.popupFontSize_layout,
			[12, 14, 16, 18, 20, 22, 24], (size) => {
			grm.display.setPopupFontSize(size);
		});

		// * MAIN - TOOLTIP * //
		mainFontSizeMenu.createRadioSubMenu('Tooltip', ['12px', '14px', HD_QHD_4K('16px (default)', '16px'), HD_QHD_4K('18px', '18px (default)'), '20px', '22px', '24px'], grSet.tooltipFontSize_layout,
			[12, 14, 16, 18, 20, 22, 24], (size) => {
			grm.display.setTooltipFontSize(size);
		});

		// * DETAILS - ARTIST * //
		const detailsFontSizeMenu = new Menu('Details');
		detailsFontSizeMenu.createRadioSubMenu('Artist', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', HD_QHD_4K('18px (default)', '18px'), '19px', HD_QHD_4K('20px', '20px (default)'), '22px', '24px'], grSet.gridArtistFontSize_layout,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			grm.display.setGridArtistFontSize(size);
		});

		// * DETAILS - TITLE * //
		detailsFontSizeMenu.createRadioSubMenu('Title', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', HD_QHD_4K('18px (default)', '18px'), '19px', HD_QHD_4K('20px', '20px (default)'), '22px', '24px'], grSet.gridTrackNumFontSize_layout && grSet.gridTitleFontSize_layout,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			grm.display.setGridTitleFontSize(size);
		});

		// * DETAILS - ALBUM * //
		detailsFontSizeMenu.createRadioSubMenu('Album', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', HD_QHD_4K('18px (default)', '18px'), '19px', HD_QHD_4K('20px', '20px (default)'), '22px', '24px'], grSet.gridAlbumFontSize_layout,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			grm.display.setGridAlbumFontSize(size);
		});

		// * DETAILS - TAG NAME * //
		detailsFontSizeMenu.createRadioSubMenu('Tag key', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', HD_QHD_4K('17px (default)', '17px'), '18px', HD_QHD_4K('19px', '19px (default)'), '20px', '22px', '24px'], grSet.gridKeyFontSize_layout,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			grm.display.setGridTagKeyFontSize(size);
		});

		// * DETAILS - TAG VALUE * //
		detailsFontSizeMenu.createRadioSubMenu('Tag value', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', HD_QHD_4K('17px (default)', '17px'), '18px', HD_QHD_4K('19px', '19px (default)'), '20px', '22px', '24px'], grSet.gridValueFontSize_layout,
			[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
			grm.display.setGridTagValueFontSize(size);
		});
		detailsFontSizeMenu.appendTo(changeFontSizeMenu);

		// * PLAYLIST * //
		changeFontSizeMenu.createRadioSubMenu('Playlist', grSet.layout === 'default' ?
			HD_QHD_4K(['-1', '10px', '12px', '13px', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'], ['-1', '10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px', '20px', '22px', '+1']) :
			HD_QHD_4K(['10px', '12px', '13px', '14px', '15px (default)', '16px', '18px'], ['10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px']),
			grSet.playlistHeaderFontSize_layout, grSet.layout === 'default' ?
			HD_QHD_4K([-1, 10, 12, 13, 14, 15, 16, 18, 20, 22, 1], [-1, 10, 12, 13, 14, 15, 16, 17, 18, 20, 22, 1]) :
			HD_QHD_4K([10, 12, 13, 14, 15, 16, 18], [10, 12, 13, 14, 15, 16, 17, 18]), (size) => {
			grm.display.setPlaylistFontSize(size);
		});

		// * LIBRARY * //
		changeFontSizeMenu.createRadioSubMenu('Library', ['-1', '  8px', '10px', '11px', HD_QHD_4K('12px (default)', '12px'), '13px', HD_QHD_4K('14px', '14px (default)'), '16px', '18px', '+1'], grSet.libraryFontSize_layout,
			[-1, 8, 10, 11, 12, 13, 14, 16, 18, 1], (size) => {
			grm.display.setLibraryFontSize(size);
		});

		// * BIOGRAPHY * //
		changeFontSizeMenu.createRadioSubMenu('Biography', ['-1', '  8px', '10px', '11px', HD_QHD_4K('12px (default)', '12px'), '13px', HD_QHD_4K('14px', '14px (default)'), '16px', '18px', '+1'], grSet.biographyFontSize_layout,
			[-1, 8, 10, 11, 12, 13, 14, 16, 18, 1], (size) => {
			grm.display.setBiographyFontSize(size);
		});

		// * LYRICS * //
		changeFontSizeMenu.createRadioSubMenu('Lyrics', ['-1', '10px', '12px', '14px', '16px', '18px', HD_QHD_4K('20px (default)', '20px'), HD_QHD_4K('22px', '22px (default)'), '24px', '26px', '28px', '30px', '+1'], grSet.lyricsFontSize_layout,
			[-1, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 1], (size) => {
			grm.display.setLyricsFontSize(size);
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
			grm.ui.setPlaylistSize();
			RepaintWindow();
		};

		const updateButtons = () => {
			grm.ui.clearCache('metrics');
			grm.details.clearCache('metrics');
			grm.button.createButtons(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		const updateSeekbar = () => {
			grm.ui.setMainMetrics();
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
		playerControlsTopMenuArtwork.addToggleItem('Playlist', grSet, 'showPanelPlaylist_artwork', () => { updateButtons(); });
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
		playerControlsTopMenu.addToggleItem('Compact top menu (symbol only)', grSet, 'topMenuCompactSymbolOnly', () => {
			updateButtons();
		}, !grSet.topMenuCompact);
		playerControlsTopMenu.appendTo(playerControlsMenu);

		// * ALBUM ART * //
		if (grSet.layout !== 'compact') {
			const playerControlsAlbumArtMenu = new Menu('Album art');
			const playerControlsAlbumArtNotPropMenu = new Menu('When player size is not proportional');
			if (grSet.layout === 'default') {
				playerControlsAlbumArtNotPropMenu.addRadioItems(['Align album art left', 'Align album art left (margin)', 'Align album art center', 'Align album art right'], grSet.albumArtAlign, ['left', 'leftMargin', 'center', 'right'], (pos) => {
					grSet.albumArtAlign = pos;
					grm.ui.loadAlbumArtFromList(grm.ui.albumArtIndex);
					grm.ui.resizeArtwork(true);
					grm.ui.setPlaylistSize();
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
					grm.ui.fetchNewArtwork(grm.ui.initMetadb());
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
					grm.ui.fetchNewArtwork(grm.ui.initMetadb());
					RepaintWindow();
				});
				playerControlsAlbumArtScaleMenu.appendTo(playerControlsAlbumArtMenu);
			}
			playerControlsAlbumArtMenu.addSeparator();
			const cycleAlbumArtMenu = new Menu('Cycle album art');
			cycleAlbumArtMenu.addToggleItem('Enabled', grSet, 'albumArtCycle', () => {
				if (!grSet.albumArtCycle) {
					grm.ui.clearTimer('albumArt');
				} else {
					grm.ui.displayAlbumArtImage('next', true);
				}
			});
			cycleAlbumArtMenu.addToggleItem('Cycle with mouse wheel', grSet, 'albumArtCycleMouseWheel');
			cycleAlbumArtMenu.addSeparator();
			cycleAlbumArtMenu.createRadioSubMenu('Cycle time', ['  5 sec', '10 sec', '15 sec (default)', '30 sec', '60 sec'], grSet.albumArtCycleTime, [5, 10, 15, 30, 60], (time) => {
				grSet.albumArtCycleTime = time;
				RepaintWindow();
			});
			cycleAlbumArtMenu.appendTo(playerControlsAlbumArtMenu);
			playerControlsAlbumArtMenu.addSeparator();
			playerControlsAlbumArtMenu.addToggleItem('Filter album art images', grSet, 'filterAlbumArt', () => {
				window.Reload();
			});
			playerControlsAlbumArtMenu.addToggleItem('Load embedded album art first', grSet, 'loadEmbeddedAlbumArtFirst', () => {
				const msg = grm.msg.getMessage('menu', 'loadEmbeddedAlbumArtFirst');
				const msgFb = grm.msg.getMessage('menu', 'loadEmbeddedAlbumArtFirst', true);
				grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) grSet.loadEmbeddedAlbumArtFirst = false;
				});
				window.Reload();
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
		playerControlsScrollbarPlaylistStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], grSet.playlistWheelScrollSteps, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
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
		const playerControlsPanelModeMenu = new Menu('Mode');
		playerControlsPanelModeMenu.addToggleItem('Auto panel width', grSet, 'panelWidthAuto', () => {
			grSet.albumArtAlign = grSet.panelWidthAuto ? 'left' : 'right';
			grm.ui.resizeArtwork(true);
			grm.ui.setPlaylistSize();
			grm.ui.setLibrarySize();
			grm.ui.setBiographySize();
			if (grm.ui.displayCustomThemeMenu) grm.cthMenu.reinitCustomThemeMenu();
			RepaintWindow();
		});
		playerControlsPanelModeMenu.addToggleItem('Browse mode', grSet, 'panelBrowseMode', () => {
			const msg = grm.msg.getMessage('menu', 'panelBrowseMode');
			const msgFb = grm.msg.getMessage('menu', 'panelBrowseMode', true);
			grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) grSet.panelBrowseMode = false;
			});
			grm.ui.initBrowserModeState();
		});
		playerControlsPanelModeMenu.appendTo(playerControlsPanelMenu);
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
		playerControlsPanelMenu.addToggleItem('Show weblinks in context menu', grSet, 'showWeblinks');
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Return to home on playback stop', grSet, 'returnToHomeOnPlaybackStop');
		playerControlsPanelMenu.addToggleItem('Switch to playlist when adding songs', grSet, 'addTracksPlaylistSwitch');
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Hide middle panel shadow', grSet, 'hideMiddlePanelShadow', () => { RepaintWindow(); });
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Disable fullscreen ESC', grSet, 'fullscreenESCDisabled');
		playerControlsPanelMenu.addSeparator();
		playerControlsPanelMenu.addToggleItem('Lock player size', grSet, 'lockPlayerSize', () => { UIWizard.DisableWindowSizing = true; });
		playerControlsPanelMenu.appendTo(playerControlsMenu);

		// * LOWER BAR MENU * //
		const playerControlsLowerBarMenu = new Menu('Lower bar');
		// * TRANSPORT BUTTON SIZE * //
		const transportSizeMenu = new Menu('Transport button size');
		const transportSizeMenuDefault = new Menu('Default');
		transportSizeMenuDefault.addRadioItems(['28px', '30px', HD_QHD_4K('32px (default)', '32px'), HD_QHD_4K('34px', '34px (default)'), '36px', '38px', '40px', '42px'], grSet.transportButtonSize_default, [28, 30, 32, 34, 36, 38, 40, 42], (size) => {
			grm.display.setTransportBtnSize(size);
		});
		transportSizeMenuDefault.appendTo(transportSizeMenu);

		const transportSizeMenuArtwork = new Menu('Artwork');
		transportSizeMenuArtwork.addRadioItems(['28px', '30px', HD_QHD_4K('32px (default)', '32px'), HD_QHD_4K('34px', '34px (default)'), '36px'], grSet.transportButtonSize_artwork, [28, 30, 32, 34, 36], (size) => {
			grm.display.setTransportBtnSize(size);
		});
		transportSizeMenuArtwork.appendTo(transportSizeMenu);

		const transportSizeMenuCompact = new Menu('Compact');
		transportSizeMenuCompact.addRadioItems(['28px', '30px', HD_QHD_4K('32px (default)', '32px'), HD_QHD_4K('34px', '34px (default)'), '36px'], grSet.transportButtonSize_compact, [28, 30, 32, 34, 36], (size) => {
			grm.display.setTransportBtnSize(size);
		});
		transportSizeMenuCompact.appendTo(transportSizeMenu);
		transportSizeMenu.appendTo(playerControlsLowerBarMenu);

		// * TRANSPORT BUTTON SPACING * //
		const transportSpacingMenu = new Menu('Transport button spacing');
		const transportSpacingMenuDefault = new Menu('Default');
		transportSpacingMenuDefault.addRadioItems(['-1', '3px', '5px (default)', '7px', '10px', '15px', '+1'], grSet.transportButtonSpacing_default, [-1, 3, 5, 7, 10, 15, 1], (size) => {
			grm.display.setTransportBtnSpacing(size);
		});
		transportSpacingMenuDefault.appendTo(transportSpacingMenu);

		const transportSpacingMenuArtwork = new Menu('Artwork');
		transportSpacingMenuArtwork.addRadioItems(['-1', '3px', '5px (default)', '7px', '10px', '15px', '+1'], grSet.transportButtonSpacing_artwork, [-1, 3, 5, 7, 10, 15, 1], (size) => {
			grm.display.setTransportBtnSpacing(size);
		});
		transportSpacingMenuArtwork.appendTo(transportSpacingMenu);

		const transportSpacingMenuCompact = new Menu('Compact');
		transportSpacingMenuCompact.addRadioItems(['-1', '3px', '5px (default)', '7px', '10px', '15px', '+1'], grSet.transportButtonSpacing_compact, [-1, 3, 5, 7, 10, 15, 1], (size) => {
			grm.display.setTransportBtnSpacing(size);
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
		showArtistMenu.addToggleItem('Default', grSet, 'showLowerBarArtist_default', () => { on_metadb_changed(); });
		showArtistMenu.addToggleItem('Artwork', grSet, 'showLowerBarArtist_artwork', () => { on_metadb_changed(); });
		showArtistMenu.addToggleItem('Compact', grSet, 'showLowerBarArtist_compact', () => { on_metadb_changed(); });
		showArtistMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW TRACK NUMBER IN LOWER BAR * //
		const showTrackNumberMenu = new Menu('Show track number');
		showTrackNumberMenu.addToggleItem('Default', grSet, 'showLowerBarTrackNum_default', () => { on_metadb_changed(); });
		showTrackNumberMenu.addToggleItem('Artwork', grSet, 'showLowerBarTrackNum_artwork', () => { on_metadb_changed(); });
		showTrackNumberMenu.addToggleItem('Compact', grSet, 'showLowerBarTrackNum_compact', () => { on_metadb_changed(); });
		showTrackNumberMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW TRACK TITLE IN LOWER BAR * //
		const showTitleMenu = new Menu('Show track title');
		showTitleMenu.addToggleItem('Default', grSet, 'showLowerBarTitle_default', () => { on_metadb_changed(); });
		showTitleMenu.addToggleItem('Artwork', grSet, 'showLowerBarTitle_artwork', () => { on_metadb_changed(); });
		showTitleMenu.addToggleItem('Compact', grSet, 'showLowerBarTitle_compact', () => { on_metadb_changed(); });
		showTitleMenu.appendTo(playerControlsLowerBarMenu);

		// * SHOW COMPOSER IN LOWER BAR * //
		const showComposerMenu = new Menu('Show composer');
		showComposerMenu.addToggleItem('Default', grSet, 'showLowerBarComposer_default', () => { on_metadb_changed(); });
		showComposerMenu.addToggleItem('Artwork', grSet, 'showLowerBarComposer_artwork', () => { on_metadb_changed(); });
		showComposerMenu.addToggleItem('Compact', grSet, 'showLowerBarComposer_compact', () => { on_metadb_changed(); });
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

		// * ARTIST BUTTON CONTROLS * //
		const lowerBarArtistBtnControlsMenu = new Menu('Artist button action');
		lowerBarArtistBtnControlsMenu.addRadioItems(['Artist playlist', 'Open website'], grSet.lowerBarArtistBtnAction, ['playlist', 'website'], (type) => {
			grSet.lowerBarArtistBtnAction = type;
		});
		lowerBarArtistBtnControlsMenu.addSeparator();

		const { websiteLabels, websiteValues } = grm.utils.generateWebsiteLinks(grCfg.customWebsiteLinks); // Get labels and values for predefined and custom website links
		lowerBarArtistBtnControlsMenu.addRadioItems(websiteLabels, grSet.lowerBarArtistBtnWebsite, websiteValues, (website) => {
			grSet.lowerBarArtistBtnWebsite = website;
		});
		lowerBarArtistBtnControlsMenu.appendTo(playerControlsLowerBarMenu);

		// * ADD TRACKS BUTTON CONTROLS * //
		const addTracksBtnControlsMenu = new Menu('Add tracks button');
		addTracksBtnControlsMenu.addItem('Add tracks playlist', false, () => { grm.inputBox.addTracksPlaylist(); });
		addTracksBtnControlsMenu.addSeparator();
		addTracksBtnControlsMenu.addRadioItems(['Selection', 'Nowplaying'], grSet.addTracksButtonAction, ['selection', 'nowplaying'], (action) => {
			grSet.addTracksButtonAction = action;
		});
		addTracksBtnControlsMenu.appendTo(playerControlsLowerBarMenu);

		// * TIME BUTTON CONTROLS * //
		playerControlsLowerBarMenu.createRadioSubMenu('Playback time display', ['Default', 'Remaining', 'Percent'],
			grSet.playbackTimeDisplay, ['default', 'remaining', 'percent'], (type) => {
			grSet.playbackTimeDisplay = type;
			RepaintWindow();
		});
		playerControlsLowerBarMenu.appendTo(playerControlsMenu);

		// * SEEKBAR - PROGRESS BAR * //
		const playerControlsSeekBarMenu = new Menu('Seekbar');
		playerControlsSeekBarMenu.createRadioSubMenu('Type', ['Progress bar', 'Peakmeter bar', 'Waveform bar'], grSet.seekbar, ['progressbar', 'peakmeterbar', 'waveformbar'], (type) => {
			grSet.seekbar = type;
			grm.ui.clearCache('metrics');
			grm.ui.setMainMetrics();
			grm.ui.setMainComponents('seekbar');
			grm.ui.setSeekbarRefresh();
			grm.button.createButtons(grm.ui.ww, grm.ui.wh);

			if (grSet.seekbar === 'peakmeterbar' && fb.IsPlaying) {
				grm.peakBar.startPeakmeter();
			} else {
				grm.peakBar.stopPeakmeter();
			}
			if (grSet.seekbar === 'waveformbar') grm.waveBar.updateBar();

			RepaintWindow();
		});
		const playerControlsProgressBarMenu = new Menu('Progress bar');
		playerControlsProgressBarMenu.createRadioSubMenu('Style', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], grSet.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (style) => {
			grSet.styleProgressBarDesign = style;
			grm.ui.setMainMetrics();
			RepaintWindow();
		});
		playerControlsProgressBarMenu.createRadioSubMenu('Mouse wheel seek speed', ['  1 sec', '  2 sec', '  3 sec', '  4 sec', '  5 sec (default)', '  6 sec', '  7 sec', '  8 sec', '  9 sec', '10 sec'], grSet.progressBarWheelSeekSpeed, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (speed) => {
			grSet.progressBarWheelSeekSpeed = speed;
		});
		const playerControlsProgressBarRefreshMenu = new Menu('Refresh rate');
		playerControlsProgressBarRefreshMenu.addRadioItems(['  1 fps ~ 1000 ms (very slow CPU)', '  2 fps ~ 500 ms', '  3 fps ~ 333 ms', '  4 fps ~ 250 ms', '  5 fps ~ 200 ms', '  6 fps ~ 166 ms', '  7 fps ~ 142 ms', '  8 fps ~ 125 ms', '  9 fps ~ 111 ms', '10 fps ~ 100 ms', '12 fps ~ 83 ms', '15 fps ~ 67 ms', '20 fps ~ 50 ms', '25 fps ~ 40 ms', '30 fps ~ 33 ms', '45 fps ~ 22 ms', '60 fps ~ 17 ms (very fast CPU)'], grSet.progressBarRefreshRate, [FPS._1, FPS._2, FPS._3, FPS._4, FPS._5, FPS._6, FPS._7, FPS._8, FPS._9, FPS._10, FPS._12, FPS._15, FPS._20, FPS._25, FPS._30, FPS._45, FPS._60], (rate) => {
			grSet.progressBarRefreshRate = rate;
			grm.ui.setSeekbarRefresh();
			if (rate < FPS._20) {
				grm.msg.showPopupNotice('menu', 'seekbarRefreshRateVeryFast', 'Confirm');
			} else if (rate < FPS._10) {
				grm.msg.showPopupNotice('menu', 'seekbarRefreshRateFast', 'Confirm');
			}
		}, !grSet.showProgressBar_default || !grSet.showProgressBar_artwork || !grSet.showProgressBar_compact);
		playerControlsProgressBarRefreshMenu.addSeparator();
		playerControlsProgressBarRefreshMenu.addRadioItems(['Variable refresh rate (default)'], grSet.progressBarRefreshRate, ['variable'], (rate) => {
			grSet.progressBarRefreshRate = rate;
			grm.ui.setSeekbarRefresh();
		}, !grSet.showProgressBar_default || !grSet.showProgressBar_artwork || !grSet.showProgressBar_compact);
		playerControlsProgressBarRefreshMenu.appendTo(playerControlsProgressBarMenu);
		playerControlsProgressBarMenu.appendTo(playerControlsSeekBarMenu);

		// * SEEKBAR - PEAKMETER BAR * //
		const playerControlsPeakmeterBarMenu = new Menu('Peakmeter bar');
		playerControlsPeakmeterBarMenu.createRadioSubMenu('Style', ['Horizontal', 'Horizontal center', 'Vertical'], grSet.peakmeterBarDesign, ['horizontal', 'horizontal_center', 'vertical'], (design) => {
			grSet.peakmeterBarDesign = design;
			RepaintWindow();
		});
		if (grSet.peakmeterBarDesign === 'vertical') {
			playerControlsPeakmeterBarMenu.createRadioSubMenu('Size', ['  0 px', '  2 px', '  4 px', '  6 px', '  8 px', '10 px', grSet.layout !== 'default' ? '12 px (default)' : '12 px', '14 px', '16 px', '18 px', grSet.layout !== 'default' ? '20 px' : '20 px (default)', '25 px', '30 px', '35 px', '40 px', 'Minimum'], grSet.peakmeterBarVertSize, [0, 2, 4, 6, 8, 10, 20, 25, 30, 35, 40, 'min'], (size) => {
				grSet.peakmeterBarVertSize = size;
				RepaintWindow();
			});
			playerControlsPeakmeterBarMenu.createRadioSubMenu('Decibel range', ['2 to -20 db (default)', '2 to -15 db', '2 to -10 db', '3 to -20 db', '3 to -15 db', '3 to -10 db', '5 to -20 db', '5 to -15 db', '5 to -10 db'], grSet.peakmeterBarVertDbRange, [220, 215, 210, 320, 315, 310, 520, 515, 510], (range) => {
				grSet.peakmeterBarVertDbRange = range;
				RepaintWindow();
			});
		}
		const playerControlsPeakmeterBarDisplayMenu = new Menu('Display');
		if (grSet.peakmeterBarDesign === 'horizontal' || grSet.peakmeterBarDesign === 'horizontal_center') {
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show over bars', grSet, 'peakmeterBarOverBars', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addSeparator();
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show outer bars', grSet, 'peakmeterBarOuterBars', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show outer peaks', grSet, 'peakmeterBarOuterPeaks', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addSeparator();
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show main bars', grSet, 'peakmeterBarMainBars', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show main peaks', grSet, 'peakmeterBarMainPeaks', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addSeparator();
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show middle bars', grSet, 'peakmeterBarMiddleBars', () => { RepaintWindow(); });
		}
		playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show progress bar', grSet, 'peakmeterBarProgBar', () => { RepaintWindow(); });
		if (grSet.peakmeterBarDesign === 'horizontal' || grSet.peakmeterBarDesign === 'horizontal_center') {
			playerControlsPeakmeterBarDisplayMenu.addSeparator();
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show gaps', grSet, 'peakmeterBarGaps', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show grid', grSet, 'peakmeterBarGrid', () => { grm.peakBar.on_size(grm.ui.ww, grm.ui.wh); RepaintWindow(); });
		}
		if (grSet.peakmeterBarDesign === 'vertical') {
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show peaks', grSet, 'peakmeterBarVertPeaks', () => { RepaintWindow(); });
			playerControlsPeakmeterBarDisplayMenu.addToggleItem('Show baseline', grSet, 'peakmeterBarVertBaseline', () => { RepaintWindow(); });
		}
		playerControlsPeakmeterBarDisplayMenu.addToggleItem(grSet.layout !== 'default' ? 'Show info (only available in Default layout)' : 'Show info', grSet, 'peakmeterBarInfo', () => { RepaintWindow(); });
		playerControlsPeakmeterBarDisplayMenu.appendTo(playerControlsPeakmeterBarMenu);
		playerControlsPeakmeterBarMenu.createRadioSubMenu('Mouse wheel seek speed', ['  1 sec', '  2 sec', '  3 sec', '  4 sec', '  5 sec (default)', '  6 sec', '  7 sec', '  8 sec', '  9 sec', '10 sec'], grSet.peakmeterBarWheelSeekSpeed, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (speed) => {
			grSet.peakmeterBarWheelSeekSpeed = speed;
		});
		const playerControlsPeakmeterBarRefreshMenu = new Menu('Refresh rate');
		playerControlsPeakmeterBarRefreshMenu.addRadioItems(['  1 fps ~ 1000 ms (very slow CPU)', '  2 fps ~ 500 ms', '  3 fps ~ 333 ms', '  4 fps ~ 250 ms', '  5 fps ~ 200 ms', '  6 fps ~ 166 ms', '  7 fps ~ 142 ms', '  8 fps ~ 125 ms', '  9 fps ~ 111 ms', '10 fps ~ 100 ms', '12 fps ~ 83 ms', '15 fps ~ 67 ms', '20 fps ~ 50 ms', '25 fps ~ 40 ms', '30 fps ~ 33 ms', '45 fps ~ 22 ms', '60 fps ~ 17 ms (very fast CPU)'], grSet.peakmeterBarRefreshRate, [FPS._1, FPS._2, FPS._3, FPS._4, FPS._5, FPS._6, FPS._7, FPS._8, FPS._9, FPS._10, FPS._12, FPS._15, FPS._20, FPS._25, FPS._30, FPS._45, FPS._60], (rate) => {
			grSet.peakmeterBarRefreshRate = rate;
			grm.ui.setSeekbarRefresh();
			this.audioWizard.SetMonitoringRefreshRate(rate);
			if (rate < FPS._20) {
				grm.msg.showPopupNotice('menu', 'seekbarRefreshRateVeryFast', 'Confirm');
			} else if (rate < FPS._10) {
				grm.msg.showPopupNotice('menu', 'seekbarRefreshRateFast', 'Confirm');
			}
		}, !grSet.showPeakmeterBar_default || !grSet.showPeakmeterBar_artwork || !grSet.showPeakmeterBar_compact);
		playerControlsPeakmeterBarRefreshMenu.addSeparator();
		playerControlsPeakmeterBarRefreshMenu.addRadioItems(['Variable refresh rate (default)'], grSet.peakmeterBarRefreshRate, ['variable'], (rate) => {
			grSet.peakmeterBarRefreshRate = rate;
			grm.ui.setSeekbarRefresh();
		}, !grSet.showPeakmeterBar_default || !grSet.showPeakmeterBar_artwork || !grSet.showPeakmeterBar_compact);
		playerControlsPeakmeterBarRefreshMenu.appendTo(playerControlsPeakmeterBarMenu);
		playerControlsPeakmeterBarMenu.appendTo(playerControlsSeekBarMenu);

		// * SEEKBAR - WAVEFORM BAR * //
		const playerControlsWaveformBarMenu = new Menu('Waveform bar');
		const playerControlsWaveformBarAnalysisMenu = new Menu('Analysis');
		playerControlsWaveformBarAnalysisMenu.addRadioItems(
			grSet.waveformBarMode === 'audioWizard' ? ['RMS level', 'Peak level', 'RMS peak', 'Waveform peak'] : ['RMS level  (Audio Wizard only)', 'Peak level  (Audio Wizard only)', 'RMS peak (Audio Wizard only)', 'Waveform (Audio Wizard only)'],
			grSet.waveformBarAnalysis, ['rms_level', 'peak_level', 'rms_peak', 'waveform_peak'], (type) => {
			grSet.waveformBarAnalysis = type;
			grm.waveBar.updateConfig({ preset: { analysisMode: type } });
			grm.waveBar.updateBar();
			RepaintWindow();
		}, grSet.waveformBarMode !== 'audioWizard');
		playerControlsWaveformBarAnalysisMenu.addSeparator();
		playerControlsWaveformBarAnalysisMenu.addRadioItems(
			['Save mode - always', 'Save mode - library', 'Save mode - never'], grSet.waveformBarSaveMode, ['always', 'library', 'never'], (mode) => {
			grSet.waveformBarSaveMode = mode;
			grm.waveBar.updateConfig({ analysis: { saveMode: mode } });
			grm.waveBar.updateBar();
			if (mode === 'always') return;
			const key = mode === 'library' ? 'waveformBarSaveModeLibrary' : 'waveformBarSaveModeNever';
			grm.msg.showPopupNotice('menu', key);
		}, grSet.waveformBarMode === 'visualizer');
		playerControlsWaveformBarAnalysisMenu.addSeparator();
		playerControlsWaveformBarAnalysisMenu.addItem('Show compatible extensions', false, () => {
			fb.ShowPopupMessage(grm.waveBar.checkCompatibleFileExtensionReport().join(', '), `Mode: ${grm.waveBar.analysis.binaryMode}`);
		}, grSet.waveformBarMode === 'visualizer');
		playerControlsWaveformBarAnalysisMenu.addSeparator();
		playerControlsWaveformBarAnalysisMenu.addToggleItem('Visualizer during analysis', grSet, 'waveformBarFallbackAnalysis', () => {
			grm.waveBar.updateConfig({ analysis: { visualizerFallbackAnalysis: grSet.waveformBarFallbackAnalysis } });
		});
		playerControlsWaveformBarAnalysisMenu.addToggleItem('Visualizer for incompatible files', grSet, 'waveformBarFallback', () => {
			grm.waveBar.updateConfig({ analysis: { visualizerFallback: grSet.waveformBarFallback } });
		});
		playerControlsWaveformBarAnalysisMenu.appendTo(playerControlsWaveformBarMenu);

		playerControlsWaveformBarMenu.createRadioSubMenu('Mode', ['Audio Wizard', 'Visualizer'], grSet.waveformBarMode, ['audioWizard', 'visualizer'], (mode) => {
			grSet.waveformBarMode = mode;
			grm.waveBar.updateConfig({ analysis: { binaryMode: mode } });
			grm.waveBar.updateBar();
			RepaintWindow();
		});

		playerControlsWaveformBarMenu.createRadioSubMenu('Resolution', ['Minimum', 'Very low', 'Low', 'Balanced', 'Standard (default)', 'High', 'Very high'], grSet.waveformBarResolution, [1, 5, 10, 15, 20, 50, 100], (res) => {
			grSet.waveformBarResolution = res;
			grm.waveBar.updateConfig({ analysis: { resolution: res } });

			const handle = fb.GetNowPlaying();
			if (handle) {
				grm.waveBar.deleteWaveformFile(handle);
				grm.waveBar.on_playback_new_track(handle);
			}

			grm.waveBar.updateBar();
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
		playerControlsWaveformBarDisplayMenu.addSeparator();

		playerControlsWaveformBarDisplayMenu.addToggleItem('Animate', grSet, 'waveformBarAnimate', () => {
			grm.waveBar.updateConfig({ preset: { animate: grSet.waveformBarAnimate } });
		});

		playerControlsWaveformBarDisplayMenu.addToggleItem(`Use BPM${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, grSet, 'waveformBarBPM', () => {
			grm.waveBar.updateConfig({ preset: { useBPM: grSet.waveformBarBPM } });
		}, !(grSet.waveformBarPaint === 'partial' && grSet.waveformBarPrepaint || grSet.waveformBarMode === 'visualizer'));

		playerControlsWaveformBarDisplayMenu.addToggleItem('Invert halfbars', grSet, 'waveformBarInvertHalfbars', () => {
			grm.waveBar.updateConfig({ preset: { invertHalfbars: grSet.waveformBarInvertHalfbars } });
		});
		playerControlsWaveformBarDisplayMenu.addSeparator();

		playerControlsWaveformBarDisplayMenu.addToggleItem('Show indicator', grSet, 'waveformBarIndicator', () => {
			grm.waveBar.updateConfig({ preset: { indicator: grSet.waveformBarIndicator } });
		});
		playerControlsWaveformBarDisplayMenu.appendTo(playerControlsWaveformBarMenu);

		const playerControlsWaveformBarWheelMenu = new Menu('Mouse wheel');
		playerControlsWaveformBarWheelMenu.createRadioSubMenu('Seek speed', grSet.waveformBarWheelSeekType === 'percentage' ?
			['  1%', '  2%', '  3%', '  4%', '  5% (default)', '  6%', '  7%', '  8%', '  9%', '10%'] :
			['  1 sec', '  2 sec', '  3 sec', '  4 sec', '  5 sec (default)', '  6 sec', '  7 sec', '  8 sec', '  9 sec', '10 sec'],
			grSet.waveformBarWheelSeekSpeed, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (speed) => {
			grSet.waveformBarWheelSeekSpeed = speed;
			grm.waveBar.updateConfig({ wheel: { seekSpeed: speed } });
		});
		playerControlsWaveformBarWheelMenu.createRadioSubMenu('Seek type', ['Seconds', 'Percentage'], grSet.waveformBarWheelSeekType, ['seconds', 'percentage'], (type) => {
			grSet.waveformBarWheelSeekType = type;
			grm.waveBar.updateConfig({ wheel: { seekType: type } });
		});
		playerControlsWaveformBarWheelMenu.appendTo(playerControlsWaveformBarMenu);

		const playerControlsWaveformBarRefreshMenu = new Menu(`Refresh rate${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`);
		const waveformBarRefreshMenuDisabled = grSet.waveformBarPaint === 'full' || grSet.waveformBarMode === 'visualizer' || !grSet.waveformBarPrepaint;
		playerControlsWaveformBarRefreshMenu.addRadioItems(['  1 fps ~ 1000 ms (very slow CPU)', '  2 fps ~ 500 ms', '  3 fps ~ 333 ms', '  4 fps ~ 250 ms', '  5 fps ~ 200 ms', '  6 fps ~ 166 ms', '  7 fps ~ 142 ms', '  8 fps ~ 125 ms', '  9 fps ~ 111 ms', '10 fps ~ 100 ms', '12 fps ~ 83 ms', '15 fps ~ 67 ms', '20 fps ~ 50 ms', '25 fps ~ 40 ms', '30 fps ~ 33 ms', '45 fps ~ 22 ms', '60 fps ~ 17 ms (very fast CPU)'], grSet.waveformBarRefreshRate, [FPS._1, FPS._2, FPS._3, FPS._4, FPS._5, FPS._6, FPS._7, FPS._8, FPS._9, FPS._10, FPS._12, FPS._15, FPS._20, FPS._25, FPS._30, FPS._45, FPS._60], (rate) => {
			grSet.waveformBarRefreshRate = rate;
			grm.waveBar.updateConfig({ ui: { refreshRate: rate } });
			if (rate < FPS._20) {
				grm.msg.showPopupNotice('menu', 'seekbarRefreshRateVeryFast', 'Confirm');
			} else if (rate < FPS._10) {
				grm.msg.showPopupNotice('menu', 'seekbarRefreshRateFast', 'Confirm');
			}
		}, waveformBarRefreshMenuDisabled);
		playerControlsWaveformBarRefreshMenu.addSeparator();
		playerControlsWaveformBarRefreshMenu.addRadioItems(['Variable refresh rate (default)'], grSet.waveformBarRefreshRate, ['variable'], (rate) => {
			grSet.waveformBarRefreshRate = rate;
			grm.waveBar.updateConfig({ ui: { refreshRate: FPS._5 } });
		}, waveformBarRefreshMenuDisabled);
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
			grm.ui.setPlaylistSize();
			RepaintWindow();
		};

		// * LAYOUT * //
		if (grSet.layout === 'default') {
			playlistMenu.createRadioSubMenu('Layout', ['Normal', 'Full'], grSet.playlistLayout, ['normal', 'full'], (width) => {
				grSet.playlistLayout = width;
				grm.ui.initPlaylistLayoutState();
			});
		}

		// * BACKGROUND * //
		const playlistBackgroundMenu = new Menu('Background');
		playlistBackgroundMenu.addToggleItem('Show image on background', grSet, 'playlistBgImg', () => {
			if (grSet.playlistBgImg) {
				grm.bgImg.initBgImage();
			} else {
				grm.bgImg.clearBgImageCache();
			}
			grm.ui.updatePlaylist();
			RepaintWindow();
		});
		playlistBackgroundMenu.addToggleItem('Show now playing rows only', grSet, 'playlistBgRowNowPlaying', () => {
			if (grSet.playlistBgRowNowPlaying) {
				plSet.show_row_stripes = false;
			}
			grm.ui.updatePlaylist();
			RepaintWindow();
		});
		playlistBackgroundMenu.addSeparator();
		playlistBackgroundMenu.addToggleItem('Cycle images', grSet, 'playlistBgImgCycle', () => {
			grm.bgImg.initBgImageCycle(grSet.playlistBgImgCycle ? false : 'playlist');
			RepaintWindow();
		});
		playlistBackgroundMenu.createRadioSubMenu('Cycle time', ['  5 sec', '10 sec', '15 sec (default)', '30 sec', '60 sec'], grSet.playlistBgImgCycleTime, [5, 10, 15, 30, 60], (time) => {
			grSet.playlistBgImgCycleTime = time;
			grm.bgImg.initBgImageCycle(grSet.playlistBgImgCycle ? false : 'playlist');
			RepaintWindow();
		});
		playlistBackgroundMenu.addSeparator();
		const playlistBackgroundImageSourceMenu = new Menu('Image source');
		playlistBackgroundImageSourceMenu.addRadioItems(['Artist', 'Album', 'Custom'], grSet.playlistBgImgSource, ['artist', 'album', 'custom'], (source) => {
			grSet.playlistBgImgSource = source;
			grm.bgImg.initBgImage(false, true);
			RepaintWindow();
		});
		playlistBackgroundImageSourceMenu.addSeparator();
		playlistBackgroundImageSourceMenu.addToggleItem('Filter album art images', grSet, 'playlistBgImgAlbumArtFilter', () => {
			window.Reload();
		});
		playlistBackgroundImageSourceMenu.appendTo(playlistBackgroundMenu);
		playlistBackgroundMenu.createRadioSubMenu('Image scaling', ['Proportional', 'Filled', 'Stretched'], grSet.playlistBgImgScale, ['default', 'filled', 'stretched'], (scale) => {
			grSet.playlistBgImgScale = scale;
			grm.bgImg.initBgImage(false, true);
			RepaintWindow();
		});
		playlistBackgroundMenu.createRadioSubMenu('Image opacity', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.playlistBgImgOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			grSet.playlistBgImgOpacity = value;
			RepaintWindow();
		});
		playlistBackgroundMenu.addSeparator();
		playlistBackgroundMenu.createRadioSubMenu('Row opacity', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.playlistBgRowOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			grSet.playlistBgRowOpacity = value;
			grm.ui.updatePlaylist();
		});
		playlistBackgroundMenu.appendTo(playlistMenu);

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
			grm.ui.setPlaylistSize();
			RepaintWindow();
		}, !plSet.show_header);
		playlistAlbumMenu.addToggleItem('Auto collapse and expand', plSet, 'auto_collapse', () => {
			grm.ui.initPlaylist();
			grm.ui.setPlaylistSize();
		});
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Ctrl+click to follow hyperlinks', grSet, 'hyperlinksCtrlClick');
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Flip header rows', grSet, 'headerFlipRows', () => {
			grm.ui.initPlaylist();
			grm.ui.setPlaylistSize();
		});
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Show disc sub-header', plSet, 'show_disc_header', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show group info', plSet, 'show_group_info', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show bit depth and sample rate always', grCfg.settings, 'playlistShowBitSampleAlways', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show long release date (YYYY-MM-DD)', grSet, 'showPlaylistFullDate', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addToggleItem('Show rating', plSet, 'show_rating_header', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addToggleItem('Show PLR value', plSet, 'show_PLR_header', () => { grm.ui.updatePlaylist(); });
		playlistAlbumMenu.addSeparator();
		playlistAlbumMenu.addItem('Customize header info', false, () => { grm.inputBox.playlistCustomHeaderInfo(); grm.ui.updatePlaylist(); });
		playlistAlbumMenu.appendTo(playlistMenu);

		// * TRACK ROW * //
		const rowsMenu = new Menu('Track row');
		rowsMenu.addToggleItem('Show row stripes', plSet, 'show_row_stripes', () => {
			if (plSet.show_row_stripes) {
				grSet.playlistBgRowNowPlaying = false;
			}
			playlistCallback();
		});
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show play count', plSet, 'show_playcount', playlistCallback);
		rowsMenu.addToggleItem('Show queue position', plSet, 'show_queue_position', playlistCallback);
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Show rating', plSet, 'show_rating', playlistCallback);
		rowsMenu.addToggleItem('Show rating from tags', plSet, 'use_rating_from_tags', () => {
			pl.artist_ratings.clear();
			pl.album_ratings.clear();
			pl.track_ratings.clear();
			grm.ui.clearCache('ratings');
			grm.ui.updatePlaylist();
		});
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
		rowsMenu.addToggleItem('Show vinyl style numbering if available', grSet, 'showVinylNums', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addToggleItem('Show last.fm scrobbles on no local plays', grSet, 'lastFmScrobblesFallback', () => { grm.ui.updatePlaylist(); });
		rowsMenu.addSeparator();
		rowsMenu.addToggleItem('Row mouse hover', grSet, 'playlistRowHover', () => { RepaintWindow(); });
		rowsMenu.addSeparator();
		rowsMenu.createRadioSubMenu('Playback time display', ['Default', 'Remaining', 'Percent'],
			grSet.playlistPlaybackTimeDisplay, ['default', 'remaining', 'percent'], (type) => {
			grSet.playlistPlaybackTimeDisplay = type;
			RepaintWindow();
		});
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
			grm.ui.setPlaylistSize();
			RepaintWindow();
		};

		const sortOrderWithDirection = ['artistDate', 'artistRating', 'artistPlaycount', 'albumRating', 'albumPlaycount', 'trackRating', 'trackPlaycount', 'year', 'genre', 'label', 'country'];

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

		playlistSortOrderMenu.addRadioItems(['Default', 'Artist | date', 'Artist rating', 'Artist playcount', 'Album', 'Album rating', 'Album playcount', 'Track', 'Track number', 'Track rating', 'Track playcount', 'Year', 'Genre', 'Label', 'Country', 'File path', 'Custom'], savedOrder,
			['default', 'artistDate', 'artistRating', 'artistPlaycount', 'albumTitle', 'albumRating', 'albumPlaycount', 'trackTitle', 'trackNumber', 'trackRating', 'trackPlaycount', 'year', 'genre', 'label', 'country', 'filePath', 'custom'], (order) => {
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
				grm.ui.newTrackFetchingArtwork = true;
				grm.details.discArtCover = grm.details.disposeDiscArt(grm.details.discArtCover);
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
				grm.details.discArt = grm.details.disposeDiscArt(grm.details.discArt);
				grm.details.discArtCover = grm.details.disposeDiscArt(grm.details.discArtCover);
				grm.details.discArtArray = [];
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
				grm.details.discArtCover = grm.details.disposeDiscArt(grm.details.discArtCover);
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
				if (!IsFile(grPath.discArtCustomStub)) {
					grm.msg.showPopupNotice('menu', 'discArtStub');
				}
			}, !grSet.displayDiscArt);
			discArtCustomMenu.appendTo(displayDiscArtMenu);
			displayDiscArtMenu.appendTo(discArtMenu);

			// * DISC ART OPTIONS * //
			discArtMenu.addToggleItem('Display disc art', grSet, 'displayDiscArt', () => {
				grm.details.clearCache('discArt');
				grm.details.clearCache('metrics', 'cachedLabelLastLeftEdge'); // resize labels
				grm.details.clearTimer();
				if (fb.IsPlaying) grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				grm.ui.resizeArtwork(true);
				RepaintWindow();
			});

			discArtMenu.addToggleItem('Display disc art above cover', grSet, 'discArtOnTop', () => {
				grSet.detailsAlbumArtDiscAreaOpacity = 255;
				RepaintWindow();
			}, !grSet.displayDiscArt);
			discArtMenu.addSeparator();
			discArtMenu.addToggleItem('Spin disc art while songs play (increases memory and CPU)', grSet, 'spinDiscArt', () => {
				if (grSet.spinDiscArt) {
					grm.details.setDiscArtRotationTimer();
				} else {
					grm.details.clearTimer('discArt');
					grm.details.discArtArray = [];
				}
			});
			discArtMenu.createRadioSubMenu('# Rotation images (memory usage/rotational speed)', ['  36 (10 degrees)', '  45 (8 degrees)', '  60 (6 degrees)', '  72 (5 degrees) (default)', '  90 (4 degrees)', '120 (3 degrees)', '180 (2 degrees)'], grSet.spinDiscArtImageCount, [36, 45, 60, 72, 90, 120, 180], (count) => {
				grSet.spinDiscArtImageCount = count;
				grm.details.discArtRotationIndex = 0;
				grm.details.discArtArray = [];
				grm.artCache.discArtImgMaxRes = grm.artCache.setDiscArtMaxResolution(grSet.spinDiscArtImageCount);
				RepaintWindow();
			}, !grSet.spinDiscArt);
			discArtMenu.createRadioSubMenu('Spinning disc art redraw speed', ['250ms (very slow CPU)', '200ms', '150ms', '125ms', '100ms', '  75ms (default)', '  50ms', '  40ms', '  30ms', '  20ms', '  10ms (very fast CPU)'], grSet.spinDiscArtRedrawInterval, [250, 200, 150, 125, 100, 75, 50, 40, 30, 20, 10], interval => {
				grSet.spinDiscArtRedrawInterval = interval;
				grm.details.setDiscArtRotationTimer();
			}, !grSet.spinDiscArt);
			discArtMenu.addSeparator();
			discArtMenu.addToggleItem('Rotate disc art as tracks change', grSet, 'rotateDiscArt', () => { RepaintWindow(); }, !grSet.displayDiscArt || grSet.spinDiscArt);
			discArtMenu.createRadioSubMenu('Disc art rotation amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(grSet.rotationAmt), [2, 3, 4, 5], (rot) => {
				grSet.rotationAmt = rot;
				grm.details.setDiscArtRotation();
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
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			grm.details.updateGridPos();
			RepaintWindow();
		});
		detailsShowArtistMenu.addToggleItem('Artwork', grSet, 'showGridArtist_artwork', () => {
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			grm.details.updateGridPos();
			RepaintWindow();
		});
		detailsShowArtistMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW TRACK NUMBER IN DETAILS * //
		const detailsShowTrackNumberMenu = new Menu('Show track number');
		detailsShowTrackNumberMenu.addToggleItem('Default', grSet, 'showGridTrackNum_default', () => {
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			grm.details.updateGridPos();
			RepaintWindow();
		});
		detailsShowTrackNumberMenu.addToggleItem('Artwork', grSet, 'showGridTrackNum_artwork', () => {
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			grm.details.updateGridPos();
			RepaintWindow();
		});
		detailsShowTrackNumberMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW TRACK TITLE IN DETAILS * //
		const detailsShowTitleMenu = new Menu('Show track title');
		detailsShowTitleMenu.addToggleItem('Default', grSet, 'showGridTitle_default', () => {
			grSet.showGridTrackNum_default = true;
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			grm.details.updateGridPos();
			RepaintWindow();
		});
		detailsShowTitleMenu.addToggleItem('Artwork', grSet, 'showGridTitle_artwork', () => {
			grSet.showGridTrackNum_artwork = true;
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			grm.details.updateGridPos();
			RepaintWindow();
		});
		detailsShowTitleMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW PLAYING PLAYLIST IN DETAILS * //
		const detailsShowPlaylingPlaylistMenu = new Menu('Show playing playlist');
		detailsShowPlaylingPlaylistMenu.addToggleItem('Enable', grSet, 'showGridPlayingPlaylist', () => {
			on_playback_new_track(fb.GetNowPlaying());
			grm.details.clearCache('metrics');
			grm.ui.createFonts();
			RepaintWindow();
		});
		detailsShowPlaylingPlaylistMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW TIMELINE IN DETAILS * //
		const detailsShowTimelineMenu = new Menu('Show timeline');
		detailsShowTimelineMenu.addToggleItem('Default', grSet, 'showGridTimeline_default', () => {
			grm.details.clearCache('metrics');
			RepaintWindow();
		});
		detailsShowTimelineMenu.addToggleItem('Artwork', grSet, 'showGridTimeline_artwork', () => {
			grm.details.clearCache('metrics');
			RepaintWindow();
		});
		detailsShowTimelineMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW ARTIST COUNTRY FLAG IN DETAILS * //
		const detailsShowArtistFlagsMenu = new Menu('Show artist country flags');
		detailsShowArtistFlagsMenu.addToggleItem('Default', grSet, 'showGridArtistFlags_default', () => {
			grm.details.clearCache('metrics');
			grm.ui.loadCountryFlags();
			RepaintWindow();
		});
		detailsShowArtistFlagsMenu.addToggleItem('Artwork', grSet, 'showGridArtistFlags_artwork', () => {
			grm.details.clearCache('metrics');
			grm.ui.loadCountryFlags();
			RepaintWindow();
		});
		detailsShowArtistFlagsMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW RELEASE COUNTRY FLAG IN DETAILS * //
		const detailsShowReleaseFlagsMenu = new Menu('Show release country flags');
		detailsShowReleaseFlagsMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridReleaseFlags_default, [false, 'logo', 'textlogo'], type => {
			grSet.showGridReleaseFlags_default = type;
			grm.details.clearCache('metrics');
			grm.details.loadGridReleaseCountryFlag();
			RepaintWindow();
		});
		detailsShowReleaseFlagsMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridReleaseFlags_artwork, [false, 'logo', 'textlogo'], type => {
			grSet.showGridReleaseFlags_artwork = type;
			grm.details.clearCache('metrics');
			grm.details.loadGridReleaseCountryFlag();
			RepaintWindow();
		});
		detailsShowReleaseFlagsMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW CODEC LOGO IN DETAILS * //
		const detailsShowCodecLogoMenu = new Menu('Show codec logo');
		detailsShowCodecLogoMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridCodecLogo_default, [false, 'logo', 'textlogo'], type => {
			grSet.showGridCodecLogo_default = type;
			grm.details.clearCache('metrics');
			grm.details.clearCache('codecLogo');
			RepaintWindow();
		});
		detailsShowCodecLogoMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridCodecLogo_artwork, [false, 'logo', 'textlogo'], type => {
			grSet.showGridCodecLogo_artwork = type;
			grm.details.clearCache('metrics');
			grm.details.clearCache('codecLogo');
			RepaintWindow();
		});
		detailsShowCodecLogoMenu.appendTo(detailsMetadataGridMenu);

		// * SHOW CHANNEL LOGO IN DETAILS * //
		const detailsShowChannelLogoMenu = new Menu('Show channel logo');
		detailsShowChannelLogoMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridChannelLogo_default, [false, 'logo', 'textlogo'], type => {
			grSet.showGridChannelLogo_default = type;
			grm.details.clearCache('metrics');
			grm.details.clearCache('channelLogo');
			RepaintWindow();
		});
		detailsShowChannelLogoMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], grSet.showGridChannelLogo_artwork, [false, 'logo', 'textlogo'], type => {
			grSet.showGridChannelLogo_artwork = type;
			grm.details.clearCache('metrics');
			grm.details.clearCache('channelLogo');
			RepaintWindow();
		});
		detailsShowChannelLogoMenu.appendTo(detailsMetadataGridMenu);

		detailsMetadataGridMenu.addSeparator();
		detailsMetadataGridMenu.addToggleItem('Auto-hide full metadata on small player', grSet, 'autoHideGridMetadata', () => RepaintWindow());

		// * EDIT METADATA GRID IN DETAILS * //
		if (fb.IsPlaying) {
			detailsMetadataGridMenu.addSeparator();
			detailsMetadataGridMenu.addItem(!grm.ui.displayMetadataGridMenu ? 'Edit metadata grid' : 'Close metadata grid menu', false, () => {
				grm.details.initGridMenuState();
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
				grm.ui.initLibraryLayoutState();
			});
			libraryLayoutMenu.addSeparator();
			libraryLayoutMenu.addToggleItem('Use full preset', grSet, 'libraryLayoutFullPreset', () => { RepaintWindow(); });
			libraryLayoutMenu.addSeparator();
			libraryLayoutMenu.addToggleItem('Use split preset (collapse)', grSet, 'libraryLayoutSplitPreset', () => {
				grm.ui.setLibrarySplitPreset(grSet.libraryLayoutSplitPreset ? 'libraryLayoutSplitPreset' : false);
			});
			libraryLayoutMenu.addToggleItem('Use split preset (text)', grSet, 'libraryLayoutSplitPreset2', () => {
				grm.ui.setLibrarySplitPreset(grSet.libraryLayoutSplitPreset2 ? 'libraryLayoutSplitPreset2' : false);
			});
			libraryLayoutMenu.addToggleItem('Use split preset (art grid)', grSet, 'libraryLayoutSplitPreset3', () => {
				grm.ui.setLibrarySplitPreset(grSet.libraryLayoutSplitPreset3 ? 'libraryLayoutSplitPreset3' : false);
			});
			libraryLayoutMenu.addToggleItem('Use split preset (art header)', grSet, 'libraryLayoutSplitPreset4', () => {
				grm.ui.setLibrarySplitPreset(grSet.libraryLayoutSplitPreset4 ? 'libraryLayoutSplitPreset4' : false);
			});
			libraryLayoutMenu.appendTo(libraryMenu);
		}

		// * MODE * //
		const libraryModeMenu = new Menu('Mode');
		grSet.libraryMode = lib.panel.imgView && libSet.artId === 4 ? 'artistGrid' : lib.panel.imgView && libSet.artId === 0 ? 'albumGrid' : 'tree';
		libraryModeMenu.addRadioItems(['Tree', 'Album grid', 'Artist grid'], grSet.libraryMode, ['tree', 'albumGrid', 'artistGrid'], (mode) => {
			if (grSet.libraryDesign === 'flowMode') grSet.libraryLayout = 'full';
			if (lib.panel.imgView) libSet.toggle('albumArtShow');
			if (mode === 'tree') libSet.toggle('albumArtShow');
			libSet.artId = mode === 'artistGrid' ? 4 : 0;
			lib.men.setPlaylist(3);
		});
		libraryModeMenu.appendTo(libraryMenu);

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
			grSet.savedLibraryThumbnailSize = libSet.thumbNailSize = grSet.libraryThumbnailSize = thumbnailSize;
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
			grSet.savedLibraryAlbumArtLabelType = libSet.albumArtLabelType = style;
			lib.panel.updateProp(1);
		});
		libraryLabelsMenu.addSeparator();
		libraryLabelsMenu.addToggleItem('Flip', libSet, 'albumArtFlipLabels', () => {  lib.panel.updateProp(1); });
		libraryLabelsMenu.appendTo(libraryAlbumArtMenu);

		// * BACKGROUND * //
		const libraryBackgroundMenu = new Menu('Background');
		libraryBackgroundMenu.addToggleItem('Show image on background', grSet, 'libraryBgImg', () => {
			if (grSet.libraryBgImg) {
				grm.bgImg.initBgImage();
			} else {
				grm.bgImg.clearBgImageCache();
			}
			RepaintWindow();
		});
		libraryBackgroundMenu.addSeparator();
		libraryBackgroundMenu.addToggleItem('Cycle images', grSet, 'libraryBgImgCycle', () => {
			grm.bgImg.initBgImageCycle(grSet.libraryBgImgCycle ? false : 'library');
			RepaintWindow();
		});
		libraryBackgroundMenu.createRadioSubMenu('Cycle time', ['  5 sec', '10 sec', '15 sec (default)', '30 sec', '60 sec'], grSet.libraryBgImgCycleTime, [5, 10, 15, 30, 60], (time) => {
			grSet.libraryBgImgCycleTime = time;
			grm.bgImg.initBgImageCycle(grSet.libraryBgImgCycle ? false : 'library');
			RepaintWindow();
		});
		libraryBackgroundMenu.addSeparator();
		const libraryBackgroundImageSourceMenu = new Menu('Image source');
		libraryBackgroundImageSourceMenu.addRadioItems(['Artist', 'Album', 'Custom'], grSet.libraryBgImgSource, ['artist', 'album', 'custom'], (source) => {
			grSet.libraryBgImgSource = source;
			grm.bgImg.initBgImage(false, true);
			RepaintWindow();
		});
		libraryBackgroundImageSourceMenu.addSeparator();
		libraryBackgroundImageSourceMenu.addToggleItem('Filter album art images', grSet, 'libraryBgImgAlbumArtFilter', () => {
			window.Reload();
		});
		libraryBackgroundImageSourceMenu.appendTo(libraryBackgroundMenu);
		libraryBackgroundMenu.createRadioSubMenu('Image scaling', ['Proportional', 'Filled', 'Stretched'], grSet.libraryBgImgScale, ['default', 'filled', 'stretched'], (scale) => {
			grSet.libraryBgImgScale = scale;
			grm.bgImg.initBgImage(false, true);
			RepaintWindow();
		});
		libraryBackgroundMenu.createRadioSubMenu('Image opacity', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.libraryBgImgOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			grSet.libraryBgImgOpacity = value;
			RepaintWindow();
		});
		libraryBackgroundMenu.addSeparator();
		libraryBackgroundMenu.createRadioSubMenu('Row opacity', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.libraryBgRowOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			grSet.libraryBgRowOpacity = value;
			RepaintWindow();
		});
		libraryBackgroundMenu.appendTo(libraryMenu);

		// * CONTROLS * //
		const libraryControlsMenu = new Menu('Controls');
		libraryControlsMenu.createRadioSubMenu('Action mode', ['Default', 'Browser', 'Player'], libSet.actionMode, [0, 1, 2], (mode) => {
			libSet.actionMode = mode;

			const setModeSettings = (mode) => {
				grSet.libraryLayoutSplitPreset  = mode !== 1;
				grSet.libraryLayoutSplitPreset2 = false;
				grSet.libraryLayoutSplitPreset3 = false;
				grSet.libraryLayoutSplitPreset4 = false;
				grSet.libraryLayout = mode === 0 ? 'normal' : 'split';
				plSet.show_header = true;
				libSet.itemShowStatistics = mode === 2 ? 7 : 0;
				lib.panel.imgView = libSet.albumArtShow = mode === 1;
				lib.lib.logTree();
				lib.pop.clearTree();
				lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
				grm.ui.setLibrarySize();
				grm.ui.initTheme();
				grm.ui.displayPlaylist = mode !== 0;
				grm.ui.displayLibrary = true;
				grm.ui.updatePlaylist();
			};

			if (mode === 0) {
				const msg = grm.msg.getMessage('menu', 'actionModeDefault');
				const msgFb = grm.msg.getMessage('menu', 'actionModeDefault', true);
				grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					setModeSettings(0);
				});
			}
			else if (mode === 1) {
				const msg = grm.msg.getMessage('menu', 'actionModeBrowser');
				const msgFb = grm.msg.getMessage('menu', 'actionModeBrowser', true);
				grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						libSet.actionMode = 0;
						return;
					}
					setModeSettings(1);
				});
			}
			else if (mode === 2) {
				const msg = grm.msg.getMessage('menu', 'actionModePlayer');
				const msgFb = grm.msg.getMessage('menu', 'actionModePlayer', true);
				grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						libSet.actionMode = 0;
						return;
					}
					setModeSettings(2);
				});
			}

			RepaintWindow();
			lib.panel.updateProp(1);
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
			if (libSet.autoCollapse) {
				libSet.treeAutoExpand = false;
				lib.pop.collapseAll();
			}
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.createRadioSubMenu('Node auto expand', ['On', 'Off'], libSet.treeAutoExpand, [true, false], (nodeAutoExpand) => {
			libSet.treeAutoExpand = nodeAutoExpand;
			if (libSet.treeAutoExpand) {
				libSet.autoCollapse = false;
			} else {
				lib.pop.collapseAll();
			}
			lib.panel.updateProp(1);
		});
		libraryTrackRowMenu.createRadioSubMenu('Node auto expand single items', ['On', 'Off'], libSet.treeAutoExpandSingle, [true, false], (nodeAutoExpandSingle) => {
			libSet.treeAutoExpandSingle = nodeAutoExpandSingle;
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
		if (!Detect.Wine && Detect.IE) {
			libraryFilterOrderMenu.addSeparator();
			libraryFilterOrderMenu.addItem('Configure filters', false, () => { lib.panel.open('filters'); });
		}
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
		if (!Detect.Wine && Detect.IE) {
			libraryViewOrderMenu.addSeparator();
			libraryViewOrderMenu.addItem('Configure views', false, () => { lib.panel.open('views'); });
		}
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
				grm.ui.initBiographyLayoutState();
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
				const msg = grm.msg.getMessage('menu', 'cycPhotoLocation');
				fb.ShowPopupMessage(msg, 'Biography: custom folder for photo cycling');
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
				const msg = grm.msg.getMessage('menu', 'loadCovFolder');
				fb.ShowPopupMessage(msg, 'Biography: load folder for cover cycling');
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
			const lyricsLayoutMenu = new Menu('Layout');
			lyricsLayoutMenu.addRadioItems(['Normal', 'Full', 'Left', 'Right'], grSet.lyricsLayout, ['normal', 'full', 'left', 'right'], (layout) => {
				grSet.savedLyricsLayout = grSet.lyricsLayout = layout;
				grm.ui.displayLyrics = true;
				grm.ui.initLyricsLayoutState();
			});
			lyricsLayoutMenu.appendTo(lyricsMenu);
		}

		const lyricsBackgroundMenu = new Menu('Background');
		lyricsBackgroundMenu.addToggleItem('Show image on background', grSet, 'lyricsBgImg', () => {
			if (grSet.lyricsBgImg) {
				grm.bgImg.initBgImage();
				grm.ui.updatePlaylist();
			} else {
				grm.bgImg.clearBgImageCache();
			}
			RepaintWindow();
		});
		lyricsBackgroundMenu.addSeparator();
		lyricsBackgroundMenu.addToggleItem('Cycle images', grSet, 'lyricsBgImgCycle', () => {
			grm.bgImg.initBgImageCycle(grSet.lyricsBgImgCycle ? false : 'lyrics');
			RepaintWindow();
		});
		lyricsBackgroundMenu.createRadioSubMenu('Cycle time', ['  5 sec', '10 sec', '15 sec (default)', '30 sec', '60 sec'], grSet.lyricsBgImgCycleTime, [5, 10, 15, 30, 60], (time) => {
			grSet.lyricsBgImgCycleTime = time;
			grm.bgImg.initBgImageCycle(grSet.lyricsBgImgCycle ? false : 'lyrics');
			RepaintWindow();
		});
		lyricsBackgroundMenu.addSeparator();
		const lyricsBackgroundImageSourceMenu = new Menu('Image source');
		lyricsBackgroundImageSourceMenu.addRadioItems(['Artist', 'Album', 'Custom'], grSet.lyricsBgImgSource, ['artist', 'album', 'custom'], (source) => {
			grSet.lyricsBgImgSource = source;
			grm.bgImg.initBgImage(false, true);
			RepaintWindow();
		});
		lyricsBackgroundImageSourceMenu.addSeparator();
		lyricsBackgroundImageSourceMenu.addToggleItem('Filter album art images', grSet, 'lyricsBgImgAlbumArtFilter', () => {
			window.Reload();
		});
		lyricsBackgroundImageSourceMenu.appendTo(lyricsBackgroundMenu);
		lyricsBackgroundMenu.createRadioSubMenu('Image scaling', ['Proportional', 'Filled', 'Stretched'], grSet.lyricsBgImgScale, ['default', 'filled', 'stretched'], (scale) => {
			grSet.lyricsBgImgScale = scale;
			grm.bgImg.initBgImage(false, true);
			RepaintWindow();
		});
		lyricsBackgroundMenu.createRadioSubMenu('Image opacity', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], grSet.lyricsBgImgOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			grSet.lyricsBgImgOpacity = value;
			RepaintWindow();
		});
		lyricsBackgroundMenu.appendTo(lyricsMenu);

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
		lyricsDisplayMenu.appendTo(lyricsMenu);

		const lyricsControlsMenu = new Menu('Controls');
		lyricsControlsMenu.addToggleItem('Remember lyrics panel state', grSet, 'lyricsRememberPanelState', () => {
			grm.ui.displayLyrics = grSet.lyricsRememberPanelState;
			grSet.savedLyricsDisplayed = grm.ui.displayLyrics && grSet.lyricsRememberPanelState;
			if (grSet.displayLyrics) grm.lyrics.initLyrics();
			grm.button.initButtonState();
			RepaintWindow();
		});
		lyricsControlsMenu.addToggleItem('Auto-scroll unsynced lyrics', grSet, 'lyricsAutoScrollUnsynced', () => {
			if (grSet.displayLyrics) grm.lyrics.initLyrics();
			grm.button.initButtonState();
			RepaintWindow();
		});
		lyricsControlsMenu.appendTo(lyricsMenu);

		const lyricsSpacingMenu = new Menu('Spacing');
		lyricsSpacingMenu.createRadioSubMenu('Line', ['20px', '24px', '28px', '32px', '36px', '40px (default)', '44px', '48px', '52px', '56px', '60px'], grSet.lyricsLineSpacing,
			[20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60], (size) => {
			grSet.lyricsLineSpacing = size;
			grm.display.setLyricsLineSpacingSize(size);
		});
		lyricsSpacingMenu.createRadioSubMenu('Sentence', ['10px', '14px', '18px', '22px', '26px', '30px (default)', '34px', '38px', '42px', '46px', '50px'], grSet.lyricsSentenceSpacing,
			[10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50], (size) => {
			grSet.lyricsSentenceSpacing = size;
			grm.display.setLyricsSentenceSpacingSize(size);
		});
		lyricsSpacingMenu.appendTo(lyricsMenu);

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
			grm.lyrics.initLyrics();
			RepaintWindow();
		});
		lyricsScrollSpeedMenu.appendTo(lyricsMenu);

		const lyricsTranslationMenu = new Menu('Translation');
		lyricsTranslationMenu.addToggleItem('Show translation', grSet, 'lyricsTranslation', () => {
			grm.lyrics.initLyrics();
			RepaintWindow();
		});
		lyricsTranslationMenu.addSeparator();
		lyricsTranslationMenu.addRadioItems(['First line', 'Second Line'], grSet.lyricsTranslationLine, [1, 2], (line) => {
			grSet.lyricsTranslationLine = line;
			grm.lyrics.initLyrics();
			RepaintWindow();
		});
		lyricsTranslationMenu.appendTo(lyricsMenu);
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

		if (!grSet.themeSandbox) {
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
					grm.ui.clearTimer('themeDayNightMode');
					return;
				}
				const msg = grm.msg.getMessage('menu', 'themeDayNightMode');
				const msgFb = grm.msg.getMessage('menu', 'themeDayNightMode', true);
				grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
					if (confirmed) {
						grm.ui.resetTheme();
						initThemeDayNightMode(new Date());
						grm.ui.initThemeFull = true;
						grm.ui.initCustomTheme();
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
				grSet.themeDayNightMode = false;
				RepaintWindow();
				if (!grSet.themeSetupDay) {
					grm.ui.themeNotification = '';
					return;
				}
				grm.msg.showPopupNotice('menu', 'themeSetupDay');
				grm.ui.resetTheme();
				setThemeDayNightTheme(true);
				grm.ui.initThemeFull = true;
				grm.ui.initCustomTheme();
				grm.ui.initTheme();
				grm.ui.initStyleState();
				grm.preset.initThemePresetState();
			});
			themeDayNightModeMenu.addItem(!grSet.themeSetupNight ? 'Theme setup for nighttime' : 'Save and exit nighttime theme setup', false, () => {
				grSet.themeSetupDay = false;
				grSet.themeSetupNight = !grSet.themeSetupNight;
				grSet.themeDayNightMode = false;
				RepaintWindow();
				if (!grSet.themeSetupNight) {
					grm.ui.themeNotification = '';
					return;
				}
				grm.msg.showPopupNotice('menu', 'themeSetupNight');
				grm.ui.resetTheme();
				setThemeDayNightTheme(false);
				grm.ui.initThemeFull = true;
				grm.ui.initCustomTheme();
				grm.ui.initTheme();
				grm.ui.initStyleState();
				grm.preset.initThemePresetState();
			});
		}

		// * HIDE OTHER MENUS WHEN THEME DAY/NIGHT SETUP IS ACTIVE
		if (grSet.themeSetupDay || grSet.themeSetupNight) {
			settingsMenu.appendTo(menu);
			return;
		}

		// * THEME SANDBOX * //
		const themeSandboxMenu = new Menu('Theme sandbox');
		const restoreThemeStylePresetSettings = (restoreStyles) => {
			grSet.presetAutoRandomMode = 'dblclick';
			grm.ui.setThemePresetSelection(true); // * Reactivate all
			grm.ui.resetTheme();
			if (restoreStyles) {
				grm.ui.restoreThemeStylePreset();
			} else { // Restore theme preset
				grm.preset.setThemePreset(grSet.savedPreset);
			}
			grm.ui.updateStyle();
		};
		themeSandboxMenu.addToggleItem('Enabled', grSet, 'themeSandbox', () => {
			if (!grSet.themeSandbox) {
				const msg = grm.msg.getMessage('menu', 'themeSandboxRestore');
				grm.msg.showPopup(false, false, msg, 'Restore', 'Keep', (restore) => {
					if (!restore) return;
					const msg = grm.msg.getMessage('menu', 'themeSandboxRestore2');
					const msgFb = grm.msg.getMessage('menu', 'themeSandboxRestore2', true);
					if (grSet.savedPreset) { // If grSet.savedPreset is available, choose between theme styles or theme preset
						setTimeout(() => {
							grm.msg.showPopup(true, msgFb, msg, 'Styles', 'Preset', (restoreStyles) => {
								restoreThemeStylePresetSettings(restoreStyles); // Restore theme styles or theme preset
							});
						}, 0);
						return;
					}
					restoreThemeStylePresetSettings(true); // Restore theme styles
				});
				return;
			}
			const msg = grm.msg.getMessage('menu', 'themeSandbox');
			const msgFb = grm.msg.getMessage('menu', 'themeSandbox', true);
			grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) grSet.themeSandbox = false;
			});
		});
		themeSandboxMenu.appendTo(settingsMenu);

		// * HIDE OTHER MENUS WHEN THEME SANDBOX IS ACTIVE
		if (grSet.themeSandbox) {
			settingsMenu.appendTo(menu);
			return;
		}

		// * THEME FONTS * //
		const themeFontMenu = new Menu('Theme fonts');
		themeFontMenu.addToggleItem('Use custom theme fonts', grSet, 'customThemeFonts', () => {
			const msg = grm.msg.getMessage('menu', 'customThemeFonts');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				grSet.customThemeFonts = confirmed;
			});
			window.Reload();
		});
		themeFontMenu.appendTo(settingsMenu);

		// * THEME IMAGES * //
		const themeImagesMenu = new Menu('Theme images');
		themeImagesMenu.addToggleItem('Use custom preloader logo', grSet, 'customPreloaderLogo', () => {
			if (!grSet.customPreloaderLogo) return window.Reload();
			grm.msg.showPopupNotice('menu', 'customPreloaderLogo');
			window.Reload();
		});
		themeImagesMenu.addToggleItem('Use custom theme images', grSet, 'customThemeImages', () => {
			if (!grSet.customThemeImages) return window.Reload();
			grm.msg.showPopupNotice('menu', 'customThemeImages');
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
			const cacheDir = grSet.customLibraryDir ? fb.TitleFormat(grCfg.customLibraryDir[0]).Eval(true) : `${fb.ProfilePath}cache\\library\\library-tree-cache`;
			if (!IsFolder(cacheDir)) CreateFolder(cacheDir);
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheLibraryMenu.addItem('Delete library cache', false, () => {
			const msg = grm.msg.getMessage('menu', 'deleteLibraryCache');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteLibraryCache();
			});
		});
		themeCacheLibraryMenu.addSeparator();
		themeCacheLibraryMenu.addToggleItem('Auto-delete library cache on startup', grSet, 'libraryAutoDelete', () => {
			const msg = grm.msg.getMessage('menu', 'libraryAutoDelete');
			if (grSet.libraryAutoDelete) {
				grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
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
			const cacheDir = grSet.customBiographyDir ? fb.TitleFormat(grCfg.customBiographyDir[0]).Eval(true)  : `${fb.ProfilePath}cache\\biography\\biography-cache`;
			if (!IsFolder(cacheDir)) CreateFolder(cacheDir);
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheBiographyMenu.addItem('Delete biography cache', false, () => {
			const msg = grm.msg.getMessage('menu', 'deleteBiographyCache');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteBiographyCache();
			});
		});
		themeCacheBiographyMenu.addSeparator();
		themeCacheBiographyMenu.addToggleItem('Auto-delete biography cache on startup', grSet, 'biographyAutoDelete', () => {
			const msg = grm.msg.getMessage('menu', 'biographyAutoDelete');
			if (grSet.biographyAutoDelete) {
				grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
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
			const cacheDir = grSet.customLyricsDir ? fb.TitleFormat(grCfg.customLyricsDir[0]).Eval(true) : `${fb.ProfilePath}cache\\lyrics`;
			if (!IsFolder(cacheDir)) CreateFolder(cacheDir);
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheLyricsMenu.addItem('Delete lyrics', false, () => {
			const msg = grm.msg.getMessage('menu', 'deleteLyricsCache');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteLyrics();
			});
		});
		themeCacheLyricsMenu.addSeparator();
		themeCacheLyricsMenu.addToggleItem('Auto-delete lyrics on startup', grSet, 'lyricsAutoDelete', () => {
			const msg = grm.msg.getMessage('menu', 'lyricsAutoDelete');
			if (grSet.lyricsAutoDelete) {
				grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
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
			const cacheDir = grSet.customWaveformBarDir ? fb.TitleFormat(grCfg.customWaveformBarDir[0]).Eval(true) : `${fb.ProfilePath}cache\\waveform`;
			if (!IsFolder(cacheDir)) CreateFolder(cacheDir);
			OpenExplorer(`explorer /open, "${cacheDir}"`, false);
		});
		themeCacheWaveformBarMenu.addItem('Delete waveform bar cache', false, () => {
			const msg = grm.msg.getMessage('menu', 'deleteWaveformBarCache');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) DeleteWaveformBarCache();
			});
		});

		themeCacheWaveformBarMenu.addToggleItem('Auto-delete waveform bar cache on startup', grSet, 'waveformBarAutoDelete', () => {
			const msg = grm.msg.getMessage('menu', 'waveformBarAutoDelete');
			if (grSet.waveformBarAutoDelete) {
				grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					grSet.waveformBarAutoDelete = confirmed;
				});
			}
		});
		themeCacheWaveformBarMenu.appendTo(themeCacheMenu);
		themeCacheMenu.appendTo(settingsMenu);

		// * THEME BACKUP * //
		const themeBackupMenu = new Menu('Theme backup');
		themeBackupMenu.addItem('Make backup', false, () => {
			const msg = grm.msg.getMessage('menu', 'makeBackup');
			const msgFb = grm.msg.getMessage('menu', 'makeBackup', true);
			grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) ManageBackup(true);
			});
		});

		themeBackupMenu.addItem('Restore backup', false, () => {
			const msg = grm.msg.getMessage('menu', 'restoreBackup');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) ManageBackup(false, true);
			});
		});
		themeBackupMenu.appendTo(settingsMenu);

		// * THEME CONFIGURATION * //
		const themeConfigMenu = new Menu('Theme configuration');
		themeConfigMenu.addItem('Save settings to config file', false, () => {
			const msg = grm.msg.getMessage('menu', 'saveSettingsConfig');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				const start = async () => {
					await grm.settings.setThemeSettings(true);
					window.Reload();
				};
				start();
				console.log(`\n>>> Georgia-ReBORN theme settings have been successfully saved in ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc <<<\n\n`);
			});
		});
		themeConfigMenu.addItem('Load settings from config file', false, () => {
			const msg = grm.msg.getMessage('menu', 'loadSettingsConfig');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				const start = async () => {
					await grm.settings.setThemeSettings(false, true);
					window.Reload();
				};
				start();
				console.log(`\n>>> Georgia-ReBORN theme settings have been successfully loaded from ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc <<<\n\n`);
			});
		});
		themeConfigMenu.addSeparator();
		themeConfigMenu.addItem('Load default settings', false, () => {
			const msg = grm.msg.getMessage('menu', 'loadDefaultSettingsConfig');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				const start = async () => {
					await grm.settings.setThemeSettings(false, false, true);
					await grm.display.autoDetectRes();
					window.Reload();
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
			const msg = grm.msg.getMessage('menu', 'resetSettingsMainConfig');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				try { // Needed to prevent crash when there is no config file
					grCfg.config.resetConfiguration();
					grm.settings.setThemeSettings(false, false, true);
					grm.display.setPlayerSize('small');
					console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc file has been successfully reset to default. <<<\n\n`);
				} catch (e) { window.Reload(); }
			});
		});
		themeConfigMenu.addItem('Reset custom configuration file', false, () => {
			const msg = grm.msg.getMessage('menu', 'resetSettingsCustomConfig');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				try { // Needed to prevent crash when there is no config file
					grCfg.configCustom.resetConfiguration();
					console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc file has been successfully reset to default. <<<\n\n`);
				} catch (e) { window.Reload(); }
			});
		});
		themeConfigMenu.addSeparator();
		themeConfigMenu.addItem('Reset all', false, () => {
			const msg = grm.msg.getMessage('menu', 'resetSettingsAll');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				grSet.systemFirstLaunch = true; // Reset Georgia-ReBORN theme settings
				try { // Needed to prevent crash when there is no config file
					DeleteFile(`${fb.ProfilePath}configuration\\foo_ui_columns.dll.cfg`);
					grCfg.config.resetConfiguration(); // Reset Georgia-ReBORN config file
					lib.panel.updateProp(libSet, 'default_value'); // Reset Library settings
					bio.ui.updateProp(bioSet, 'default_value'); // Reset Biography settings
					const server = new BioSettings();
					server.resetCfg(); // Reset Biography server settings
					console.log('\n>>> Georgia-ReBORN has been successfully reset <<<\n\n');
				} catch (e) {
					const msg = grm.msg.getMessage('menu', 'resetSettingsAllError');
					fb.ShowPopupMessage(msg, 'Resetting Georgia-ReBORN');
				}
			});
		});
		themeConfigMenu.appendTo(settingsMenu);

		// * THEME PERFORMANCE * //
		settingsMenu.createRadioSubMenu('Theme performance', ['Lowest quality (fastest speed - very slow CPU)', 'Low quality', 'Balanced (Default)', 'High quality', 'Highest quality (slowest speed - very fast CPU)'], grSet.themePerformance,
			['lowestQuality', 'lowQuality', 'balanced', 'highQuality', 'highestQuality'], (perf) => {
			const msg = grm.msg.getMessage('menu', 'themePerformance');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
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
					menu.AppendMenuItem(MenuFlag.String, i + 1, array.name);
					if (array.active) active = i;
				}
				menu.AppendMenuSeparator();
				menu.AppendMenuItem(MenuFlag.String, last, 'Preferences...');

				if (active > -1) menu.CheckMenuRadioItem(1, last, active + 1);
				const idx = menu.TrackPopupMenu(x, y);
				if (idx > 0 && idx < last) fb.RunMainMenuCommand(`Playback/Device/${deviceList[idx - 1].name}`);
				else if (idx === last) fb.RunMainMenuCommand('Playback/Device/Preferences...');
			};
			outputDeviceMenu(grm.ui.state.mouse_x, grm.ui.state.mouse_y);
		});

		settingsMenu.addSeparator();
		settingsMenu.addToggleItem('Developer tools', grSet, 'devTools');
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
			grm.button.setPlaybackOrder(grm.button.btnImg.PlaybackDefault, 'default', PlaybackOrder.Default, 'Default');
			grm.ui.displayBiography = false;
			grm.ui.clearTimer('autoDownloadBio');
		};

		const clearAutoDownloadLyrics = () => {
			grm.ui.autoDownloadLyrics = false;
			grm.button.setPlaybackOrder(grm.button.btnImg.PlaybackDefault, 'default', PlaybackOrder.Default, 'Default');
			grm.ui.displayLyrics = false;
			grm.ui.clearTimer('autoDownloadLyrics');
		};

		debugMenu.addItem('Console', false, () => { fb.RunMainMenuCommand('View/Console'); }); // Top menu 'View' does not exist in Artwork/Compact layout
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Enable auto-download biography', grm.ui, 'autoDownloadBio', () => {
			if (!grm.ui.autoDownloadBio) {
				clearAutoDownloadBio();
			} else {
				const msg = grm.msg.getMessage('menu', 'autoDownloadBio');
				grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						grm.ui.autoDownloadBio = false;
						return;
					}
					clearAutoDownloadLyrics();
					fb.Play();
					grm.button.setPlaybackOrder(grm.button.btnImg.PlaybackShuffle, 'shuffle', PlaybackOrder.ShuffleTracks, 'Shuffle (tracks)');
					grm.ui.displayBiography = true;
					grm.ui.autoDownloadBioTimer = setInterval(() => { fb.Next(); }, 6000);
				});
			}
			grm.button.btn.playbackOrder.repaint();
			grm.button.initButtonState();
			window.Repaint();
		});
		debugMenu.addToggleItem('Enable auto-download lyrics', grm.ui, 'autoDownloadLyrics', () => {
			if (!grm.ui.autoDownloadLyrics) {
				clearAutoDownloadLyrics();
			} else {
				const msg = grm.msg.getMessage('menu', 'autoDownloadLyrics');
				grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					if (!confirmed) {
						grm.ui.autoDownloadLyrics = false;
						return;
					}
					clearAutoDownloadBio();
					fb.Play();
					grm.button.setPlaybackOrder(grm.button.btnImg.PlaybackRepeatPlaylist, 'repeatPlaylist', PlaybackOrder.RepeatPlaylist, 'Repeat (playlist)');
					grm.ui.displayLyrics = true;
					grm.lyrics.initLyrics();
					grm.ui.autoDownloadLyricsTimer = setInterval(() => { fb.Next(); }, 15000);
				});
			}
			grm.button.btn.playbackOrder.repaint();
			grm.button.initButtonState();
			window.Repaint();
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Enable double click refresh', grCfg.settings, 'doubleClickRefresh');
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Enable debug log', grCfg.settings, 'showDebugLog', () => {
			if (grCfg.settings.showDebugLog) fb.RunMainMenuCommand('View/Console');
		});
		debugMenu.addItem('Enable debug theme log', grCfg.settings.showDebugThemeLog, () => {
			grCfg.settings.showDebugThemeLog = !grCfg.settings.showDebugThemeLog;
			if (!grCfg.settings.showDebugThemeLog) return;
			if (grCfg.settings.showDebugThemeLog) fb.RunMainMenuCommand('View/Console');
			grm.ui.albumArt = null;
			on_playback_new_track(fb.GetNowPlaying());
		});
		debugMenu.addItem('Enable debug theme overlay', grCfg.settings.showDebugThemeOverlay, () => {
			grCfg.settings.showDebugThemeOverlay = !grCfg.settings.showDebugThemeOverlay;
			if (grCfg.settings.showDebugThemeOverlay) {
				grCfg.settings.showDebugPerformanceOverlay = false;
				grm.ui.albumArt = null;
				on_playback_new_track(fb.GetNowPlaying());
				return;
			}
			RepaintWindow();
		});
		debugMenu.addItem('Enable debug performance overlay', grCfg.settings.showDebugPerformanceOverlay, () => {
			grCfg.settings.showDebugPerformanceOverlay = !grCfg.settings.showDebugPerformanceOverlay;
			grm.ui.clearCache('debug');
			if (grCfg.settings.showDebugPerformanceOverlay) {
				grCfg.settings.showDebugThemeOverlay = false;
				grm.cpuTrack.start();
				grm.ui.albumArt = null;
				on_playback_new_track(fb.GetNowPlaying());
				return;
			}
			grm.cpuTrack.stop();
			RepaintWindow();
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show draw areas', grm.ui, 'drawRepaintRects', () => {
			if (grm.ui.drawRepaintRects) {
				RepaintRectAreas();
			} else {
				RepaintWindow();
			}
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show draw timing', grm.ui, 'showDrawTiming', () => {
			if (grm.ui.showDrawTiming) fb.RunMainMenuCommand('View/Console');
			grm.ui.clearCache('debug');
		});
		debugMenu.addToggleItem('Show draw extended timing', grm.ui, 'showDrawExtendedTiming', () => {
			if (grm.ui.showDrawExtendedTiming) fb.RunMainMenuCommand('View/Console');
			grm.ui.clearCache('debug');
		});
		debugMenu.addToggleItem('Show debug timing', grm.ui, 'showDebugTiming', () => {
			if (grm.ui.showDebugTiming) fb.RunMainMenuCommand('View/Console');
			grm.ui.clearCache('debug');
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show panel calls', grm.ui, 'showPanelTraceCall', () => {
			if (grm.ui.showPanelTraceCall) {
				fb.RunMainMenuCommand('View/Console');
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
				fb.RunMainMenuCommand('View/Console');
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
			if (grm.ui.showPlaylistTraceListPerf) fb.RunMainMenuCommand('View/Console');
		});
		debugMenu.addSeparator();
		debugMenu.addToggleItem('Show panel context menu', grCfg.settings, 'showPanelContextMenu');
		debugMenu.addItem('Show panel properties', false, () => { window.ShowProperties(); });
		debugMenu.addSeparator();
		debugMenu.addItem('Set system first launch to true', false, () => { // Used when creating new config files
			const msg = grm.msg.getMessage('menu', 'systemFirstLaunch');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				window.SetProperty('Georgia-ReBORN - 16. System: System first launch', true);
				plSet.show_scrollbar = false;
				grSet.showTopMenuCompact = true;
				grSet.devTools = false;
				console.log('\n>>> Georgia-ReBORN has been set to system first launch <<<\n\n');
			});
		});
		debugMenu.addItem(`Set script preloader to ${grSet.asyncThemePreloader ? 'synchronous' : 'asynchronous'}`, false, () => {
			const msg = grm.msg.getMessage('menu', 'asyncThemePreloader');
			grm.msg.showPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
				if (!confirmed) return;
				grSet.asyncThemePreloader = !grSet.asyncThemePreloader;
				window.Reload();
			});
		});

		debugMenu.appendTo(menu);
	}
	// #endregion
}
