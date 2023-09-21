/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Menu                                 * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-09-21                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////
// * RATING MENU * //
/////////////////////
/**
 * Top menu > Rating.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 */
function topMenuRating(x, y) {
	const handle = new FbMetadbHandleList();
	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem(); if (!metadb) return;
	const noStream = !metadb.RawPath.startsWith('http');
	const fileInfo = metadb.GetFileInfo();
	const ratingMetaIdx = fileInfo.MetaFind('RATING');
	const ratingMeta = ratingMetaIdx === -1 ? 0 : fileInfo.MetaValue(ratingMetaIdx, 0);
	const ratingTags = g_properties.use_rating_from_tags;
	const rating = ratingTags ? ratingMeta : fb.TitleFormat('$if2(%rating%,0)').Eval();
	const menu = new Menu();
	activeMenu = true;

	menu.addRadioItems(['No rating', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'], parseInt(rating), [0, 1, 2, 3, 4, 5], (rating) => {
		if (rating === 0) {
			if (ratingTags && noStream) {
				handle.Add(metadb);
				handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: '' }));
			} else {
				fb.RunContextCommand('Playback Statistics/Rating/<not set>');
			}
		}
		else if (ratingTags && noStream) {
			handle.Add(metadb);
			handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: rating }));
		}
		else {
			fb.RunContextCommand(`Playback Statistics/Rating/${rating}`);
		}
	});

	const idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);
	activeMenu = false;
}


//////////////////
// * TOP MENU * //
//////////////////
/**
 * All top menus, also used to append menus in panel context menus.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {boolean} context_menu Appends panel related menus to the context menu.
 * @param {boolean} playlist Appends main Playlist menu to the Playlist context menu.
 * @param {boolean} details Appends main Details menu to the Details context menu.
 * @param {boolean} library Appends main Library menu to the Library context menu.
 * @param {boolean} biography Appends main Biography menu to the Biography context menu.
 * @param {boolean} lyrics Appends main Lyrics menu to the Lyrics context menu.
 */
function topMenuOptions(x, y, context_menu, playlist, details, library, biography, lyrics) {
	activeMenu = true;
	state.mouse_x = x;
	state.mouse_y = y;
	const menu = new Menu();

	if (!context_menu) {
		themeOptions(menu);
		styleOptions(menu);
		presetOptions(menu);
		playerSizeOptions(menu);
		layoutOptions(menu);
		displayOptions(menu);
		brightnessOptions(menu);
		fontSizeOptions(menu);

		menu.addSeparator();
		playerControlsOptions(menu);
		menu.addSeparator();

		playlistOptions(menu);
		detailsOptions(menu);
		libraryOptions(menu);
		biographyOptions(menu);
		lyricsOptions(menu);

		menu.addSeparator();
		settingsOptions(menu);
		if (pref.devTools) menu.addSeparator();
		developerToolsOptions(menu);
	}
	else if (playlist) {
		playlistOptions(menu, context_menu);
	}
	else if (details) {
		detailsOptions(menu, context_menu);
	}
	else if (library) {
		libraryOptions(menu, context_menu);
	}
	else if (biography) {
		biographyOptions(menu, context_menu);
	}
	else if (lyrics) {
		lyricsOptions(menu, context_menu);
	}

	const idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);
	activeMenu = false;
}


///////////////////////
// * THEME OPTIONS * //
///////////////////////
/**
 * Top menu > Options > Theme.
 * @param {Menu} menu Creates the Theme menu via a new Menu instance.
 */
function themeOptions(menu) {
	const themeMenu = new Menu('Theme');
	themeMenu.addRadioItems(['White', 'Black', 'Reborn', 'Random'], pref.theme, ['white', 'black', 'reborn', 'random'], (theme) => {
		if (!pref.themeSandbox) pref.savedTheme = pref.theme = theme; else pref.theme = theme;
		resetTheme();
		initTheme();
		initThemePresetState();
	});
	themeMenu.addSeparator();
	themeMenu.addRadioItems(['Blue', 'Dark blue', 'Red', 'Cream'], pref.theme, ['blue', 'darkblue', 'red', 'cream'], (theme) => {
		if (!pref.themeSandbox) pref.savedTheme = pref.theme = theme; else pref.theme = theme;
		resetTheme();
		initTheme();
		initThemePresetState();
	});
	themeMenu.addSeparator();
	themeMenu.addRadioItems(['Neon blue', 'Neon green', 'Neon red', 'Neon gold'], pref.theme, ['nblue', 'ngreen', 'nred', 'ngold'], (theme) => {
		if (!pref.themeSandbox) pref.savedTheme = pref.theme = theme; else pref.theme = theme;
		resetTheme();
		initTheme();
		initThemePresetState();
	});
	themeMenu.addSeparator();

	// * CUSTOM THEME * //
	const customThemeMenu = new Menu('Custom');
	const customThemes = [
		customTheme01.name === '' ? 'Theme 01' : customTheme01.name,
		customTheme02.name === '' ? 'Theme 02' : customTheme02.name,
		customTheme03.name === '' ? 'Theme 03' : customTheme03.name,
		customTheme04.name === '' ? 'Theme 04' : customTheme04.name,
		customTheme05.name === '' ? 'Theme 05' : customTheme05.name,
		customTheme06.name === '' ? 'Theme 06' : customTheme06.name,
		customTheme07.name === '' ? 'Theme 07' : customTheme07.name,
		customTheme08.name === '' ? 'Theme 08' : customTheme08.name,
		customTheme09.name === '' ? 'Theme 09' : customTheme09.name,
		customTheme10.name === '' ? 'Theme 10' : customTheme10.name
	];

	customThemeMenu.addRadioItems(customThemes, pref.theme, ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'], (theme) => {
		if (!pref.themeSandbox) pref.savedTheme = pref.theme = theme; else pref.theme = theme;
		resetTheme();
		initCustomTheme();
		initTheme();
		initCustomThemeMenu('pl_bg');
		initThemePresetState();
	});
	customThemeMenu.addSeparator();

	customThemeMenu.addItem('Edit custom theme', false, () => {
		if (pref.layout === 'default') {
			displayCustomThemeMenu = !displayCustomThemeMenu;
			initCustomTheme();
			if (displayDetails || displayLibrary || displayBiography || pref.displayLyrics) {
				displayPlaylist = true;
				displayDetails = false;
				displayLibrary = false;
				displayBiography = false;
				pref.displayLyrics = false;
				resizeArtwork(true);
				initButtonState();
			}
			initCustomThemeMenu('pl_bg');
			repaintWindow();
		} else {
			const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
			fb.ShowPopupMessage(`Custom theme can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${configPathCustom}\n`, 'Custom theme live editing');
		}
	});

	customThemeMenu.addItem('Rename custom theme', false, () => { inputBox('renameCustomTheme'); });

	customThemeMenu.createRadioSubMenu('Save current colors', customThemes, '', ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'], (theme) => {
		const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
		const msg = `Do you want to save current used colors to the selected\ncustom theme slot?\n\nThis will overwrite all colors in the selected custom theme slot.\nIt is recommended to make a backup of your ${configPathCustom}\nconfig file.\n\nContinue?`;
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				setCurrentColorsToCustomTheme(theme);
			}
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	customThemeMenu.appendTo(themeMenu);
	themeMenu.appendTo(menu, pref.presetSelectMode === 'harmonic');
}


///////////////////////
// * STYLE OPTIONS * //
///////////////////////
/**
 * Top menu > Options > Style.
 * @param {Menu} menu Creates the Style menu via a new Menu instance.
 */
function styleOptions(menu) {
	const styleMenu = new Menu('Style');
	themePresetIndicator = true;
	themePresetMatchMode = true;

	// * STYLES * //
	styleMenu.addToggleItem('Default', pref, 'styleDefault', () => {
		pref.preset = false;
		resetStyle('all');
		restoreThemeStylePreset(true);
		resetTheme();
		initTheme();
	});
	styleMenu.addSeparator();
	styleMenu.addToggleItem('Bevel', pref, 'styleBevel', () => {
		if (!pref.themeSandbox) pref.savedStyleBevel = pref.styleBevel;
		updateStyle();
	});
	styleMenu.addSeparator();

	// * STYLES - GROUP ONE * //
	styleMenu.addToggleItem('Blend', pref, 'styleBlend', () => {
		if (!pref.themeSandbox) pref.savedStyleBlend = pref.styleBlend;
		setStyle('blend', pref.styleBlend);
		updateStyle();
	});
	styleMenu.addToggleItem('Blend 2', pref, 'styleBlend2', () => {
		if (!pref.themeSandbox) pref.savedStyleBlend2 = pref.styleBlend2;
		setStyle('blend2', pref.styleBlend2);
		updateStyle();
	});
	if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
		styleMenu.addToggleItem('Gradient', pref, 'styleGradient', () => {
			if (!pref.themeSandbox) pref.savedStyleGradient = pref.styleGradient;
			setStyle('gradient', pref.styleGradient);
			updateStyle();
		}, pref.styleRebornWhite);
	}
	if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
		styleMenu.addToggleItem('Gradient 2', pref, 'styleGradient2', () => {
			if (!pref.themeSandbox) pref.savedStyleGradient2 = pref.styleGradient2;
			setStyle('gradient2', pref.styleGradient2);
			updateStyle();
		}, pref.styleRebornWhite);
	}
	styleMenu.addSeparator();

	// * STYLES - GROUP TWO * //
	styleMenu.addToggleItem('Alternative', pref, 'styleAlternative', () => {
		if (!pref.themeSandbox) pref.savedStyleAlternative = pref.styleAlternative;
		setStyle('alternative', pref.styleAlternative);
		updateStyle();
	});
	styleMenu.addToggleItem('Alternative 2', pref, 'styleAlternative2', () => {
		if (!pref.themeSandbox) pref.savedStyleAlternative2 = pref.styleAlternative2;
		setStyle('alternative2', pref.styleAlternative2);
		updateStyle();
	});
	if (pref.theme === 'white') {
		styleMenu.addToggleItem('Black and white', pref, 'styleBlackAndWhite', () => {
			if (!pref.themeSandbox) pref.savedStyleBlackAndWhite = pref.styleBlackAndWhite;
			setStyle('blackAndWhite', pref.styleBlackAndWhite);
			updateStyle();
		}, pref.styleBlackAndWhiteReborn);
		styleMenu.addToggleItem('Black and white 2', pref, 'styleBlackAndWhite2', () => {
			if (!pref.themeSandbox) pref.savedStyleBlackAndWhite2 = pref.styleBlackAndWhite2;
			setStyle('blackAndWhite2', pref.styleBlackAndWhite2);
			updateStyle();
		}, pref.styleBlackAndWhiteReborn);
		styleMenu.addToggleItem('Black and white reborn', pref, 'styleBlackAndWhiteReborn', () => {
			if (!pref.themeSandbox) pref.savedStyleBlackAndWhiteReborn = pref.styleBlackAndWhiteReborn;
			setStyle('blackAndWhiteReborn', pref.styleBlackAndWhiteReborn);
			updateStyle();
		});
	}
	if (pref.theme === 'black') {
		styleMenu.addToggleItem('Black reborn', pref, 'styleBlackReborn', () => {
			if (!pref.themeSandbox) pref.savedStyleBlackReborn = pref.styleBlackReborn;
			setStyle('blackReborn', pref.styleBlackReborn);
			updateStyle();
		});
	}
	if (pref.theme === 'reborn') {
		styleMenu.addToggleItem('Reborn white', pref, 'styleRebornWhite', () => {
			if (!pref.themeSandbox) pref.savedStyleRebornWhite = pref.styleRebornWhite;
			setStyle('rebornWhite', pref.styleRebornWhite);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn black', pref, 'styleRebornBlack', () => {
			if (!pref.themeSandbox) pref.savedStyleRebornBlack = pref.styleRebornBlack;
			setStyle('rebornBlack', pref.styleRebornBlack);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn fusion', pref, 'styleRebornFusion', () => {
			if (!pref.themeSandbox) pref.savedStyleRebornFusion = pref.styleRebornFusion;
			setStyle('rebornFusion', pref.styleRebornFusion);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn fusion 2', pref, 'styleRebornFusion2', () => {
			if (!pref.themeSandbox) pref.savedStyleRebornFusion2 = pref.styleRebornFusion2;
			setStyle('rebornFusion2', pref.styleRebornFusion2);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn fusion accent', pref, 'styleRebornFusionAccent', () => {
			if (!pref.themeSandbox) pref.savedStyleRebornFusionAccent = pref.styleRebornFusionAccent;
			setStyle('rebornFusionAccent', pref.styleRebornFusionAccent);
			updateStyle();
		});
	}
	if (pref.theme === 'random') {
		styleMenu.addToggleItem('Random pastel', pref, 'styleRandomPastel', () => {
			if (!pref.themeSandbox) pref.savedStyleRandomPastel = pref.styleRandomPastel;
			setStyle('randomPastel', pref.styleRandomPastel);
			updateStyle();
		});
		styleMenu.addToggleItem('Random dark', pref, 'styleRandomDark', () => {
			if (!pref.themeSandbox) pref.savedStyleRandomDark = pref.styleRandomDark;
			setStyle('randomDark', pref.styleRandomDark);
			updateStyle();
		});
	}
	styleMenu.addSeparator();

	// * STYLES - RANDOM AUTO COLOR * //
	if (pref.theme === 'random') {
		const styleAutoColorMenu = new Menu('Auto color');
		styleAutoColorMenu.addRadioItems(['Off', '5 sec', '10 sec', '15 sec', '30 sec', '45 sec', '1 min', '2 min', '3 min', '4 min', '5 min', 'New track'], pref.styleRandomAutoColor,
			['off', 5000, 10000, 15000, 30000, 45000, 60000, 120000, 180000, 240000, 300000, 'track'], (timer) => {
			if (!pref.themeSandbox) pref.savedStyleRandomAutoColor = pref.styleRandomAutoColor = timer; else pref.styleRandomAutoColor = timer;
			getRandomThemeAutoColor();
		});
		styleAutoColorMenu.appendTo(styleMenu);
		styleMenu.addSeparator();
	}

	// * STYLES - BUTTONS * //
	const styleButtonsMenu = new Menu('Buttons');
	const styleTopButtonsMenu = new Menu('Top menu');
	styleTopButtonsMenu.addRadioItems(['Default', 'Filled', 'Bevel', 'Inner', 'Emboss', 'Minimal'], pref.styleTopMenuButtons, ['default', 'filled', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
		if (!pref.themeSandbox) pref.savedStyleTopMenuButtons = pref.styleTopMenuButtons = style; else pref.styleTopMenuButtons = style;
		updateStyle();
	});
	styleTopButtonsMenu.appendTo(styleButtonsMenu);
	const styleTransportButtonsMenu = new Menu('Transport');
	styleTransportButtonsMenu.addRadioItems(['Default', 'Bevel', 'Inner', 'Emboss', 'Minimal'], pref.styleTransportButtons, ['default', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
		if (!pref.themeSandbox) pref.savedStyleTransportButtons = pref.styleTransportButtons = style; else pref.styleTransportButtons = style;
		updateStyle();
	});
	styleTransportButtonsMenu.appendTo(styleButtonsMenu);
	styleButtonsMenu.appendTo(styleMenu);

	// * STYLES - PROGRESS BAR * //
	const styleProgressBarMenu = new Menu('Progress bar');
	styleProgressBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], pref.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (design) => {
		if (!pref.themeSandbox) pref.savedStyleProgressBarDesign = pref.styleProgressBarDesign = design; else pref.styleProgressBarDesign = design;
		updateStyle();
	});
	styleProgressBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], pref.styleProgressBar, ['default', 'bevel', 'inner'], (style) => {
		if (!pref.themeSandbox) pref.savedStyleProgressBar = pref.styleProgressBar = style; else pref.styleProgressBar = style;
		updateStyle();
	});
	styleProgressBarMenu.createRadioSubMenu('Progress fill', ['Default', 'Bevel', 'Inner', 'Blend'], pref.styleProgressBarFill, ['default', 'bevel', 'inner', 'blend'], (style) => {
		if (!pref.themeSandbox) pref.savedStyleProgressBarFill = pref.styleProgressBarFill = style; else pref.styleProgressBarFill = style;
		updateStyle();
	});
	styleProgressBarMenu.appendTo(styleMenu);

	// * STYLES - VOLUME BAR * //
	const styleVolumeBarMenu = new Menu('Volume bar');
	styleVolumeBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded'], pref.styleVolumeBarDesign, ['default', 'rounded'], (design) => {
		if (!pref.themeSandbox) pref.savedStyleVolumeBarDesign = pref.styleVolumeBarDesign = design; else pref.styleVolumeBarDesign = design;
		updateStyle();
	});
	styleVolumeBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], pref.styleVolumeBar, ['default', 'bevel', 'inner'], (style) => {
		if (!pref.themeSandbox) pref.savedStyleVolumeBar = pref.styleVolumeBar = style; else pref.styleVolumeBar = style;
		updateStyle();
	});
	styleVolumeBarMenu.createRadioSubMenu('Volume fill', ['Default', 'Bevel', 'Inner'], pref.styleVolumeBarFill, ['default', 'bevel', 'inner'], (style) => {
		if (!pref.themeSandbox) pref.savedStyleVolumeBarFill = pref.styleVolumeBarFill = style; else pref.styleVolumeBarFill = style;
		updateStyle();
	});
	styleVolumeBarMenu.appendTo(styleMenu);

	styleMenu.appendTo(menu, pref.presetSelectMode === 'harmonic');
}


////////////////////////
// * PRESET OPTIONS * //
////////////////////////
/**
 * Top menu > Options > Preset.
 * @param {Menu} menu Creates the Preset menu via a new Menu instance.
 */
function presetOptions(menu) {
	const themePresetsMenu = new Menu('Preset');
	const themePresetSelectModeMenu = new Menu('Select mode');

	const presetSelectMode = () => {
		themePresetSelectModeMenu.addRadioItems(['Default', 'Harmonic', 'Theme'], pref.presetSelectMode, ['default', 'harmonic', 'theme'], (mode) => {
			pref.presetSelectMode = mode;
			if (mode === 'default') {
				const msg = 'Do you want to activate the -Default- preset select mode?\n\nThe default select mode will automatically choose\na random pick of 88 theme presets.\n\nDouble-click on the lower bar to choose\nanother random theme preset.\n\nWhen random mode is activated,\nall themes and style options will be available.\n\nContinue?\n\n\n';
				const continue_confirmation = (status, confirmed) => {
					if (!confirmed) {
						pref.presetSelectMode = 'default';
						return;
					}
					pref.presetAutoRandomMode = 'dblclick';
					setThemePresetSelection(true); // * Reactivate all
					resetStyle('all');
					resetTheme();
					restoreThemeStylePreset();
					if (pref.savedPreset !== false) setThemePreset(pref.savedPreset);
					updateStyle();
				}
				if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
					continue_confirmation(false, 'Yes');
					fb.ShowPopupMessage('Default preset select mode activated:\n\nThe default preset select mode will automatically choose a random pick of 88 theme presets.\n\nDouble-click on the lower bar to choose another random theme preset.\n\nWhen random mode is activated,\nall themes and style options will be available.', 'Default preset select mode');
				} else {
					popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
				}
			}
			else if (mode === 'harmonic') {
				const msg = 'Do you want to activate the -Harmonic- preset select mode?\n\nThe harmonic preset select mode will automatically\nchoose the best visual experience of themes and styles\nbased on album art.\n\nYou can also double-click on the lower bar\nto choose another random harmonic preset.\n\nWhen harmonic preset select mode is activated,\nall themes and almost all style options will be disabled.\n\nContinue?\n\n\n';
				const continue_confirmation = (status, confirmed) => {
					if (!confirmed) {
						pref.presetSelectMode = 'default';
						return;
					}
					pref.presetAutoRandomMode = 'dblclick';
					setThemePresetSelection(true); // * Reactivate all
					getRandomThemePreset();
				}
				if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
					continue_confirmation(false, 'Yes');
					fb.ShowPopupMessage('Harmonic preset select mode activated:\n\nThe harmonic preset select mode will automatically choose the best visual experience of themes and styles based on album art.\n\nYou can also double-click on the lower bar to choose another random harmonic preset.\n\nWhen harmonic preset select mode is activated,\nall themes and almost all style options will be disabled.', 'Harmonic preset select mode');
				} else {
					popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
				}
			}
			else if (mode === 'theme') {
				const msg = 'Do you want to activate the -Theme- preset select mode?\n\nThe theme preset select mode will automatically choose\na random theme preset based on current active theme.\n\nYou can also double-click on the lower bar\nto choose another random theme preset.\n\nWhen theme preset select mode is activated,\nall themes and style options will be available.\n\nContinue?\n\n\n';
				const continue_confirmation = (status, confirmed) => {
					if (!confirmed) {
						pref.presetSelectMode = 'default';
						return;
					}
					pref.presetAutoRandomMode = 'dblclick';
					setThemePresetSelection(false, true);
					getRandomThemePreset();
				}
				if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
					continue_confirmation(false, 'Yes');
					fb.ShowPopupMessage('Theme preset select mode activated:\n\nThe theme preset select mode will automatically choose a random theme preset based on current active theme.\n\nYou can also double-click on the lower bar to choose another random theme preset.\n\nWhen theme preset select mode is activated,\nall themes and style options will be available', 'Theme preset select mode');
				} else {
					popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
				}
			}
		});
	}

	// * HARMONIC MODE EXCLUSIVE MENU * // only show these options when harmonic mode is active
	if (pref.presetSelectMode === 'harmonic') {
		presetSelectMode();
		themePresetSelectModeMenu.appendTo(themePresetsMenu);
		const themePresetSelectMenu = new Menu('Select presets');
		themePresetSelectMenu.addToggleItem('Neon blue', pref, 'presetSelectNblue');
		themePresetSelectMenu.addToggleItem('Neon green', pref, 'presetSelectNgreen');
		themePresetSelectMenu.addToggleItem('Neon red', pref, 'presetSelectNred');
		themePresetSelectMenu.addToggleItem('Neon gold', pref, 'presetSelectNgold');
		themePresetSelectMenu.appendTo(themePresetsMenu);
		themePresetsMenu.addToggleItem('Indicator', pref, 'presetIndicator');
		themePresetsMenu.appendTo(menu);
		return;
	}

	// * WHITE THEME PRESETS * //
	const themePresetsWhiteMenu = new Menu('White');
	themePresetsWhiteMenu.addRadioItems(['Beveled', 'Black and white', 'Black and white blended', 'Black and white 2', 'Black and white 2 blended', 'Black and white reborn', 'Black and white reborn blended', 'Minimalized'], pref.preset,
		['whiteP01', 'whiteP02', 'whiteP03', 'whiteP04', 'whiteP05', 'whiteP06', 'whiteP07', 'whiteP08'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsWhiteMenu.appendTo(themePresetsMenu);

	// * BLACK THEME PRESETS * //
	const themePresetsBlackMenu = new Menu('Black');
	themePresetsBlackMenu.addRadioItems(['Beveled', 'Blended', 'Blended alternative', 'Blended alternative 2', 'Black reborn', 'Black reborn blended', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['blackP01', 'blackP02', 'blackP03', 'blackP04', 'blackP05', 'blackP06', 'blackP07', 'blackP08', 'blackP09', 'blackP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsBlackMenu.appendTo(themePresetsMenu);

	// * REBORN THEME PRESETS * //
	const themePresetsRebornMenu = new Menu('Reborn');
	themePresetsRebornMenu.addRadioItems(['Beveled', 'Blended', 'Blended 2', 'Gradiented', 'Gradiented 2', 'Minimalized', 'Minimalized blended'], pref.preset,
		['rebornP01', 'rebornP02', 'rebornP03', 'rebornP04', 'rebornP05', 'rebornP06', 'rebornP07'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn white beveled', 'Reborn white blended', 'Reborn white blended 2'], pref.preset,
		['rebornP08', 'rebornP09', 'rebornP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn black beveled', 'Reborn black blended', 'Reborn black blended 2', 'Reborn black gradiented', 'Reborn black gradiented 2'], pref.preset,
		['rebornP11', 'rebornP12', 'rebornP13', 'rebornP14', 'rebornP15'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn fusion beveled', 'Reborn fusion blended', 'Reborn fusion blended 2', 'Reborn fusion gradiented', 'Reborn fusion gradiented 2'], pref.preset,
		['rebornP16', 'rebornP17', 'rebornP18', 'rebornP19', 'rebornP20'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn fusion 2 beveled', 'Reborn fusion 2 blended', 'Reborn fusion 2 blended 2', 'Reborn fusion 2 gradiented', 'Reborn fusion 2 gradiented 2'], pref.preset,
		['rebornP21', 'rebornP22', 'rebornP23', 'rebornP24', 'rebornP25'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn fusion accent beveled', 'Reborn fusion accent blended', 'Reborn fusion accent blended 2', 'Reborn fusion accent gradiented', 'Reborn fusion accent gradiented 2'], pref.preset,
		['rebornP26', 'rebornP27', 'rebornP28', 'rebornP29', 'rebornP30'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRebornMenu.appendTo(themePresetsMenu);

	// * RANDOM THEME PRESETS * //
	const themePresetsRandomMenu = new Menu('Random');
	themePresetsRandomMenu.addRadioItems(['Beveled blended alternative', 'Beveled blended pastel', 'Beveled blended dark', 'Beveled blended auto dark', 'Beveled auto dark', 'Beveled dark', 'Gradiented', 'Gradiented 2', 'Minimalized', 'Minimalized blended'], pref.preset,
		['randomP01', 'randomP02', 'randomP03', 'randomP04', 'randomP05', 'randomP06', 'randomP07', 'randomP08', 'randomP09', 'randomP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRandomMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * BLUE THEME PRESETS * //
	const themePresetsBlueMenu = new Menu('Blue');
	themePresetsBlueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], pref.preset,
		['blueP01', 'blueP02', 'blueP03', 'blueP04', 'blueP05'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsBlueMenu.appendTo(themePresetsMenu);

	// * DARK BLUE THEME PRESETS * //
	const themePresetsDarkblueMenu = new Menu('Dark blue');
	themePresetsDarkblueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], pref.preset,
		['darkblueP01', 'darkblueP02', 'darkblueP03', 'darkblueP04', 'darkblueP05'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsDarkblueMenu.appendTo(themePresetsMenu);

	// * RED THEME PRESETS * //
	const themePresetsRedMenu = new Menu('Red');
	themePresetsRedMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], pref.preset,
		['redP01', 'redP02', 'redP03', 'redP04', 'redP05'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsRedMenu.appendTo(themePresetsMenu);

	// * CREAM THEME PRESETS * //
	const themePresetsCreamMenu = new Menu('Cream');
	themePresetsCreamMenu.addRadioItems(['Beveled', 'Beveled 2', 'Alternative', 'Alternative 2', 'Minimalized'], pref.preset,
		['creamP01', 'creamP02', 'creamP03', 'creamP04', 'creamP05'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsCreamMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * NEON BLUE THEME PRESETS * //
	const themePresetsNblueMenu = new Menu('Neon blue');
	themePresetsNblueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['nblueP01', 'nblueP02', 'nblueP03', 'nblueP04', 'nblueP05', 'nblueP06', 'nblueP07', 'nblueP08', 'nblueP09', 'nblueP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsNblueMenu.appendTo(themePresetsMenu);

	// * NEON GREEN THEME PRESETS * //
	const themePresetsNgreenMenu = new Menu('Neon green');
	themePresetsNgreenMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['ngreenP01', 'ngreenP02', 'ngreenP03', 'ngreenP04', 'ngreenP05', 'ngreenP06', 'ngreenP07', 'ngreenP08', 'ngreenP09', 'ngreenP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsNgreenMenu.appendTo(themePresetsMenu);

	// * NEON RED THEME PRESETS * //
	const themePresetsNredMenu = new Menu('Neon red');
	themePresetsNredMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['nredP01', 'nredP02', 'nredP03', 'nredP04', 'nredP05', 'nredP06', 'nredP07', 'nredP08', 'nredP09', 'nredP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsNredMenu.appendTo(themePresetsMenu);

	// * NEON GOLD THEME PRESETS * //
	const themePresetsNgoldMenu = new Menu('Neon gold');
	themePresetsNgoldMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['ngoldP01', 'ngoldP02', 'ngoldP03', 'ngoldP04', 'ngoldP05', 'ngoldP06', 'ngoldP07', 'ngoldP08', 'ngoldP09', 'ngoldP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsNgoldMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * CUSTOM THEME PRESETS * //
	const themePresetsCustomMenu = new Menu('Custom');
	themePresetsCustomMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Gradiented', 'Gradiented 2', 'Alternative', 'Alternative 2', 'Minimalized', 'Minimalized blended'], pref.preset,
		['customP01', 'customP02', 'customP03', 'customP04', 'customP05', 'customP06', 'customP07', 'customP08', 'customP09', 'customP10'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		setThemePreset(preset);
	});
	themePresetsCustomMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * CUSTOM USER THEME PRESET * //
	const themePresetUserMenu = new Menu('User preset');
	themePresetUserMenu.addRadioItems(['User settings'], pref.preset, ['user'], (preset) => {
		if (!pref.themeSandbox) pref.savedPreset = pref.preset = preset; else pref.preset = preset;
		resetStyle('all');
		resetTheme();
		pref.theme = customStylePreset.theme;
		pref.styleBevel = customStylePreset.styleBevel;
		pref.styleBlend = customStylePreset.styleBlend;
		pref.styleBlend2 = customStylePreset.styleBlend2;
		pref.styleGradient = customStylePreset.styleGradient;
		pref.styleGradient2 = customStylePreset.styleGradient2;
		pref.styleAlternative = customStylePreset.styleAlternative;
		pref.styleAlternative2 = customStylePreset.styleAlternative2;
		pref.styleBlackAndWhite = customStylePreset.styleBlackAndWhite;
		pref.styleBlackAndWhite2 = customStylePreset.styleBlackAndWhite2;
		pref.styleBlackAndWhiteReborn = customStylePreset.styleBlackAndWhiteReborn;
		pref.styleBlackReborn = customStylePreset.styleBlackReborn;
		pref.styleRebornWhite = customStylePreset.styleRebornWhite;
		pref.styleRebornBlack = customStylePreset.styleRebornBlack;
		pref.styleRebornFusion = customStylePreset.styleRebornFusion;
		pref.styleRebornFusion2 = customStylePreset.styleRebornFusion2;
		pref.styleRebornFusionAccent = customStylePreset.styleRebornFusionAccent;
		pref.styleRandomPastel = customStylePreset.styleRandomPastel;
		pref.styleRandomDark = customStylePreset.styleRandomDark;
		pref.styleRandomAutoColor = customStylePreset.styleRandomAutoColor;
		pref.styleTopMenuButtons = customStylePreset.styleTopMenuButtons;
		pref.styleTransportButtons = customStylePreset.styleTransportButtons;
		pref.styleProgressBarDesign = customStylePreset.styleProgressBarDesign;
		pref.styleProgressBar = customStylePreset.styleProgressBar;
		pref.styleProgressBarFill = customStylePreset.styleProgressBarFill;
		pref.styleVolumeBarDesign = customStylePreset.styleVolumeBarDesign;
		pref.styleVolumeBar = customStylePreset.styleVolumeBar;
		pref.styleVolumeBarFill = customStylePreset.styleVolumeBarFill;
		pref.themeBrightness = customStylePreset.themeBrightness;
		updateStyle();
	});
	themePresetUserMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * THEME PRESET SELECT MODE * //
	presetSelectMode();
	themePresetSelectModeMenu.appendTo(themePresetsMenu);

	// * THEME PRESET SELECTION * //
	const themePresetSelectMenu = new Menu('Select presets');
	themePresetSelectMenu.addItem('Activate all', false, () => {
		setThemePresetSelection(true);
	});
	themePresetSelectMenu.addSeparator();
	themePresetSelectMenu.addItem('Deactivate all', false, () => {
		setThemePresetSelection(false);
	});
	themePresetSelectMenu.addSeparator();
	themePresetSelectMenu.addToggleItem('White',  pref, 'presetSelectWhite');
	themePresetSelectMenu.addToggleItem('Black',  pref, 'presetSelectBlack');
	themePresetSelectMenu.addToggleItem('Reborn', pref, 'presetSelectReborn');
	themePresetSelectMenu.addToggleItem('Random', pref, 'presetSelectRandom');
	themePresetSelectMenu.addSeparator();
	themePresetSelectMenu.addToggleItem('Blue', pref, 'presetSelectBlue');
	themePresetSelectMenu.addToggleItem('Dark blue', pref, 'presetSelectDarkblue');
	themePresetSelectMenu.addToggleItem('Red', pref, 'presetSelectRed');
	themePresetSelectMenu.addToggleItem('Cream', pref, 'presetSelectCream');
	themePresetSelectMenu.addSeparator();
	themePresetSelectMenu.addToggleItem('Neon blue', pref, 'presetSelectNblue');
	themePresetSelectMenu.addToggleItem('Neon green', pref, 'presetSelectNgreen');
	themePresetSelectMenu.addToggleItem('Neon red', pref, 'presetSelectNred');
	themePresetSelectMenu.addToggleItem('Neon gold', pref, 'presetSelectNgold');
	themePresetSelectMenu.addSeparator();
	themePresetSelectMenu.addToggleItem('Custom', pref, 'presetSelectCustom');
	themePresetSelectMenu.appendTo(themePresetsMenu, pref.presetSelectMode === 'theme');

	const themePresetAutoRandomModeMenu = new Menu('Auto random');
	themePresetAutoRandomModeMenu.addRadioItems(['Off', '5 sec', '10 sec', '15 sec', '30 sec', '1 min', '5 min', '10 min', '15 min', '30 min', '60 min', 'New track', 'New album', 'Double-click'],
		pref.presetAutoRandomMode, ['off', 5000, 10000, 15000, 30000, 60000, 300000, 600000, 900000, 1800000, 3600000, 'track', 'album', 'dblclick'], (timer) => {
		pref.presetAutoRandomMode = timer;
		if (!['off', 'track', 'album', 'dblclick'].includes(timer)) {
			getRandomThemePreset();
		} else {
			clearInterval(presetAutoRandomModeTimer);
			presetAutoRandomModeTimer = null;
		}
	}, pref.presetSelectMode === 'harmonic');
	themePresetAutoRandomModeMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();
	themePresetsMenu.addToggleItem('Indicator', pref, 'presetIndicator');

	themePresetsMenu.appendTo(menu);
}


/////////////////////////////
// * PLAYER SIZE OPTIONS * //
/////////////////////////////
/**
 * Top menu > Options > Player size.
 * @param {Menu} menu Creates the Player size menu via a new Menu instance.
 */
function playerSizeOptions(menu) {
	menu.createRadioSubMenu('Player size', ['Small', 'Normal', 'Large'], pref.playerSize, ['small', 'normal', 'large'], (size) => {
		pref.playerSize = size;
		resetPlayerSize();
		if (size === 'small') {
			if (!RES_4K && !RES_QHD) {
				pref.playerSize_HD_small = true;
				display.playerSize_HD_small();
			} else if (RES_QHD) {
				pref.playerSize_QHD_small = true;
				display.playerSize_QHD_small();
			} else if (RES_4K) {
				pref.playerSize_4K_small = true;
				display.playerSize_4K_small();
			}
		}
		if (size === 'normal') {
			if (!RES_4K && !RES_QHD) {
				pref.playerSize_HD_normal = true;
				display.playerSize_HD_normal();
			} else if (RES_QHD) {
				pref.playerSize_QHD_normal = true;
				display.playerSize_QHD_normal();
			} else if (RES_4K) {
				pref.playerSize_4K_normal = true;
				display.playerSize_4K_normal();
			}
		}
		if (size === 'large') {
			if (!RES_4K && !RES_QHD) {
				pref.playerSize_HD_large = true;
				display.playerSize_HD_large();
			} else if (RES_QHD) {
				pref.playerSize_QHD_large = true;
				display.playerSize_QHD_large();
			} else if (RES_4K) {
				pref.playerSize_4K_large = true;
				display.playerSize_4K_large();
			}
		}
		repaintWindow();
	}, pref.lockPlayerSize);
}


////////////////////////
// * LAYOUT OPTIONS * //
////////////////////////
/**
 * Top menu > Options > Layout.
 * @param {Menu} menu Creates the Layout menu via a new Menu instance.
 */
function layoutOptions(menu) {
	menu.createRadioSubMenu('Layout', ['Default', 'Artwork', 'Compact'], pref.layout, ['default', 'artwork', 'compact'], (layout) => {
		pref.layout = layout;
		if (pref.layout === 'default') {
			displayPlaylist = pref.showPanelOnStartup === 'playlist'; // Switch back to Playlist from Artwork layout to Default layout
			displayPlaylistArtwork = false;
			displayBiography = false;
			pref.displayLyrics = false;
			display.layoutDefault();
		}
		if (pref.layout === 'artwork') {
			displayPlaylist = false;
			displayLibrary = false;
			displayBiography = false;
			display.layoutArtwork();
		}
		if (pref.layout === 'compact') {
			displayPlaylist = true;
			displayLibrary = false;
			displayBiography = false;
			pref.displayLyrics = false;
			display.layoutCompact();
		}
		initPanels();
	}, pref.lockPlayerSize);
}


/////////////////////////
// * DISPLAY OPTIONS * //
/////////////////////////
/**
 * Top menu > Options > Display.
 * @param {Menu} menu Creates the Display menu via a new Menu instance.
 */
function displayOptions(menu) {
	const displayResMenu = new Menu('Display');

	displayResMenu.addItem('Auto-detect', false, () => { display.autoDetectRes(); });
	displayResMenu.addSeparator();
	displayResMenu.addRadioItems(['4K', 'QHD', 'HD'], pref.displayRes, ['4K', 'QHD', 'HD'], (res) => {
		pref.displayRes = res;
		if (pref.layout === 'default') {
			display.layoutDefault();
		}
		else if (pref.layout === 'artwork') {
			display.layoutArtwork();
		}
		else if (pref.layout === 'compact') {
			display.layoutCompact();
		}
		if (pref.displayRes === '4K' || pref.displayRes === 'HD') {
			display.setSizesFor4KorHD();
		} else if (pref.displayRes === 'QHD') {
			display.setSizesForQHD();
		}
		initPanels();
	});

	displayResMenu.appendTo(menu);
}


////////////////////////////
// * BRIGHTNESS OPTIONS * //
////////////////////////////
/**
 * Top menu > Options > Brightness.
 * @param {Menu} menu Creates the Brightness menu via a new Menu instance.
 */
function brightnessOptions(menu) {
	menu.createRadioSubMenu('Brightness', ['-25%', '-20%', '-15%', '-10%', '-5%', 'Default', '+5%', '+10%', '+15%', '+20%', '+25%'], pref.themeBrightness, [-25, -20, -15, -10, -5, 'default', 5, 10, 15, 20, 25], (percent) => {
		if (!pref.themeSandbox) pref.savedThemeBrightness = pref.themeBrightness = percent; else pref.themeBrightness = percent;
		initThemeFull = true;
		initTheme();
	}, pref.presetSelectMode === 'harmonic');
}


///////////////////////////
// * FONT SIZE OPTIONS * //
///////////////////////////
/**
 * Top menu > Options > Font size.
 * @param {Menu} menu Creates the Font size menu via a new Menu instance.
 */
function fontSizeOptions(menu) {
	const menuFontSize           = pref[`menuFontSize_${pref.layout}`];
	const lowerBarFontSize       = pref[`lowerBarFontSize_${pref.layout}`];
	const notificationFontSize   = pref[`notificationFontSize_${pref.layout}`];
	const popupFontSize          = pref[`popupFontSize_${pref.layout}`];
	const tooltipFontSize        = pref[`tooltipFontSize_${pref.layout}`];

	const gridArtistFontSize     = pref[`gridArtistFontSize_${pref.layout}`];
	const gridTrackNumFontSize   = pref[`gridTrackNumFontSize_${pref.layout}`];
	const gridTitleFontSize      = pref[`gridTitleFontSize_${pref.layout}`];
	const gridAlbumFontSize      = pref[`gridAlbumFontSize_${pref.layout}`];
	const gridKeyFontSize        = pref[`gridKeyFontSize_${pref.layout}`];
	const gridValueFontSize      = pref[`gridValueFontSize_${pref.layout}`];

	const playlistHeaderFontSize = pref[`playlistHeaderFontSize_${pref.layout}`];
	const libraryFontSize        = ppt[`baseFontSize_${pref.layout}`];
	const biographyFontSize      = pptBio[`baseFontSizeBio_${pref.layout}`];
	const lyricsFontSize         = pref[`lyricsFontSize_${pref.layout}`];

	const changeFontSizeMenu = new Menu('Font size');
	const mainFontSizeMenu = new Menu('Main');

	// * MAIN - TOP MENU * //
	mainFontSizeMenu.createRadioSubMenu('Top menu', ['  8px', '10px', '11px', RES_QHD ? '12px' : '12px (default)', '13px', RES_QHD ? '14px (default)' : '14px', '16px'], menuFontSize, [8, 10, 11, 12, 13, 14, 16], (size) => {
		if (pref.layout === 'default') {
			pref.menuFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.menuFontSize_artwork = size;
		}
		else if (pref.layout === 'compact') {
			pref.menuFontSize_compact = size;
		}
		createFonts();
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});

	// * MAIN - LOWER BAR * //
	mainFontSizeMenu.createRadioSubMenu('Lower bar', pref.layout !== 'default' ? ['10px', '12px', '14px', RES_QHD ? '16px' : '16px (default)', RES_QHD ? '18px (default)' : '18px', '20px', '22px', '24px', '26px'] :
		['10px', '12px', '14px', '16px', RES_QHD ? '18px' : '18px (default)', RES_QHD ? '20px (default)' : '20px', '22px', '24px', '26px'], lowerBarFontSize, [10, 12, 14, 16, 18, 20, 22, 24, 26], (size) => {
		if (pref.layout === 'default') {
			pref.lowerBarFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.lowerBarFontSize_artwork = size;
		}
		else if (pref.layout === 'compact') {
			pref.lowerBarFontSize_compact = size;
		}
		createFonts();
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	mainFontSizeMenu.appendTo(changeFontSizeMenu);

	// * MAIN - NOTIFICATION * //
	mainFontSizeMenu.createRadioSubMenu('Notification', ['12px', '14px', '16px', RES_QHD ? '18px' : '18px (default)', RES_QHD ? '20px (default)' : '20px', '22px', '24px'], notificationFontSize,
		[12, 14, 16, 18, 20, 22, 24], (size) => {
		if      (pref.layout === 'default') { pref.notificationFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.notificationFontSize_artwork = size; }
		else if (pref.layout === 'compact') { pref.notificationFontSize_compact = size; }

		createFonts();
		repaintWindow();
	});

	// * MAIN - POPUP * //
	mainFontSizeMenu.createRadioSubMenu('Popup', ['12px', '14px', RES_QHD ? '16px' : '16px (default)', RES_QHD ? '18px (default)' : '18px', '20px', '22px', '24px'], popupFontSize,
		[12, 14, 16, 18, 20, 22, 24], (size) => {
		if      (pref.layout === 'default') { pref.popupFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.popupFontSize_artwork = size; }
		else if (pref.layout === 'compact') { pref.popupFontSize_compact = size; }

		createFonts();
		if      (displayCustomThemeMenu)  initCustomThemeMenu('pl_bg');
		else if (displayMetadataGridMenu) initMetadataGridMenu();
		repaintWindow();
	});

	// * MAIN - TOOLTIP * //
	mainFontSizeMenu.createRadioSubMenu('Tooltip', ['12px', '14px', RES_QHD ? '16px' : '16px (default)', RES_QHD ? '18px (default)' : '18px', '20px', '22px', '24px'], tooltipFontSize,
		[12, 14, 16, 18, 20, 22, 24], (size) => {
		if      (pref.layout === 'default') { pref.tooltipFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.tooltipFontSize_artwork = size; }
		else if (pref.layout === 'compact') { pref.tooltipFontSize_compact = size; }

		createFonts();
		repaintWindow();
	});

	// * DETAILS - ARTIST * //
	const detailsFontSizeMenu = new Menu('Details');
	detailsFontSizeMenu.createRadioSubMenu('Artist', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', RES_QHD ? '18px' : '18px (default)', '19px', RES_QHD ? '20px (default)' : '20px', '22px', '24px'], gridArtistFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridArtistFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridArtistFontSize_artwork = size;
		}
		createFonts();
		repaintWindow();
	});

	// * DETAILS - TITLE * //
	detailsFontSizeMenu.createRadioSubMenu('Title', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', RES_QHD ? '18px' : '18px (default)', '19px', RES_QHD ? '20px (default)' : '20px', '22px', '24px'], gridTrackNumFontSize && gridTitleFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridTrackNumFontSize_default = size;
			pref.gridTitleFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridTrackNumFontSize_artwork = size;
			pref.gridTitleFontSize_artwork = size;
		}
		createFonts();
		repaintWindow();
	});

	// * DETAILS - ALBUM * //
	detailsFontSizeMenu.createRadioSubMenu('Album', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', RES_QHD ? '18px' : '18px (default)', '19px', RES_QHD ? '20px (default)' : '20px', '22px', '24px'], gridAlbumFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridAlbumFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridAlbumFontSize_artwork = size;
		}
		createFonts();
		repaintWindow();
	});

	// * DETAILS - TAG NAME * //
	detailsFontSizeMenu.createRadioSubMenu('Tag name', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', RES_QHD ? '17px' : '17px (default)', '18px', RES_QHD ? '19px (default)' : '19px', '20px', '22px', '24px'], gridKeyFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridKeyFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridKeyFontSize_artwork = size;
		}
		createFonts();
		repaintWindow();
	});

	// * DETAILS - TAG VALUE * //
	detailsFontSizeMenu.createRadioSubMenu('Tag value', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', RES_QHD ? '17px' : '17px (default)', '18px', RES_QHD ? '19px (default)' : '19px', '20px', '22px', '24px'], gridValueFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridValueFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridValueFontSize_artwork = size;
		}
		createFonts();
		repaintWindow();
	});
	detailsFontSizeMenu.appendTo(changeFontSizeMenu);

	// * PLAYLIST * //
	changeFontSizeMenu.createRadioSubMenu('Playlist', pref.layout === 'default' ?
		RES_QHD ? ['-1', '10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px', '20px', '22px', '+1'] : ['-1', '10px', '12px', '13px', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'] :
		RES_QHD ? ['10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px'] : ['10px', '12px', '13px', '14px', '15px (default)', '16px', '18px'], playlistHeaderFontSize, pref.layout === 'default' ?
		RES_QHD ? [-1, 10, 12, 13, 14, 15, 16, 17, 18, 20, 22, 999] : [-1, 10, 12, 13, 14, 15, 16, 18, 20, 22, 999] :
		RES_QHD ? [10, 12, 13, 14, 15, 16, 17, 18] : [10, 12, 13, 14, 15, 16, 18], (size) => {
		if (size === -1) {
			if      (pref.layout === 'default') { pref.playlistHeaderFontSize_default--; pref.playlistFontSize_default--; }
			else if (pref.layout === 'artwork') { pref.playlistHeaderFontSize_artwork--; pref.playlistFontSize_artwork--; }
			else if (pref.layout === 'compact') { pref.playlistHeaderFontSize_compact--; pref.playlistFontSize_compact--; }
		}
		else if (size === 999) {
			if      (pref.layout === 'default') { pref.playlistHeaderFontSize_default++; pref.playlistFontSize_default++; }
			else if (pref.layout === 'artwork') { pref.playlistHeaderFontSize_artwork++; pref.playlistFontSize_artwork++; }
			else if (pref.layout === 'compact') { pref.playlistHeaderFontSize_compact++; pref.playlistFontSize_compact++; }
		}
		else if (pref.layout === 'default') { pref.playlistHeaderFontSize_default = size; pref.playlistFontSize_default = size - (size === 15 || size === 17 ? 3 : 2); }
		else if (pref.layout === 'artwork') { pref.playlistHeaderFontSize_artwork = size; pref.playlistFontSize_artwork = size - (size === 15 || size === 17 ? 3 : 2); }
		else if (pref.layout === 'compact') { pref.playlistHeaderFontSize_compact = size; pref.playlistFontSize_compact = size - (size === 15 || size === 17 ? 3 : 2); }

		// * Update Playlist history buttons
		createFonts();
		setGeometry();
		createButtonImages();
		createButtonObjects(ww, wh);
		// * Update Playlist
		rescalePlaylist(true);
		Header.art_cache.clear();
		initPlaylist();
		playlist.on_size(ww, wh);
		if (pref.libraryLayout === 'split') {
			// * Update Library
			pop.createImages();
			panel.zoomReset();
			initLibraryLayout();
		}
		repaintWindow();
	});

	// * LIBRARY * //
	changeFontSizeMenu.createRadioSubMenu('Library', ['-1', '  8px', '10px', '11px', RES_QHD ? '12px' : '12px (default)', '13px', RES_QHD ? '14px (default)' : '14px', '16px', '18px', '+1'], libraryFontSize,
		[-1, RES_4K ? 8 * 1.5 : 8, RES_4K ? 10 * 1.5 : 10, RES_4K ? 11 * 1.5 : 11, RES_4K ? 12 * 1.5 : 12, RES_4K ? 13 * 1.5 : 13, RES_4K ? 14 * 1.5 : 14, RES_4K ? 16 * 1.5 : 16, RES_4K ? 18 * 1.5 : 18, 999], (size) => {
		if (size === -1) {
			if      (pref.layout === 'default') { ppt.baseFontSize_default--; }
			else if (pref.layout === 'artwork') { ppt.baseFontSize_artwork--; }
		}
		else if (size === 999) {
			if      (pref.layout === 'default') { ppt.baseFontSize_default++; }
			else if (pref.layout === 'artwork') { ppt.baseFontSize_artwork++; }
		}
		else if (pref.layout === 'default') { ppt.baseFontSize_default = size; }
		else if (pref.layout === 'artwork') { ppt.baseFontSize_artwork = size; }

		pref.libraryFontSize_default = ppt.baseFontSize_default;
		pref.libraryFontSize_artwork = ppt.baseFontSize_artwork;

		setLibrarySize();
		panel.zoomReset();
		pop.createImages();
		repaintWindow();
	});

	// * BIOGRAPHY * //
	changeFontSizeMenu.createRadioSubMenu('Biography', ['-1', '  8px', '10px', '11px', RES_QHD ? '12px' : '12px (default)', '13px', RES_QHD ? '14px (default)' : '14px', '16px', '18px', '+1'], biographyFontSize,
		[-1, RES_4K ? 8 * 1.5 : 8, RES_4K ? 10 * 2 : 10, RES_4K ? 11 * 2 : 11, RES_4K ? 12 * 2 : 12, RES_4K ? 13 * 2 : 13, RES_4K ? 14 * 2 : 14, RES_4K ? 16 * 2 : 16, RES_4K ? 18 * 2 : 18, 999], (size) => {
		if (size === -1) {
			if      (pref.layout === 'default') { pptBio.baseFontSizeBio_default--; }
			else if (pref.layout === 'artwork') { pptBio.baseFontSizeBio_artwork--; }
		}
		else if (size === 999) {
			if      (pref.layout === 'default') { pptBio.baseFontSizeBio_default++; }
			else if (pref.layout === 'artwork') { pptBio.baseFontSizeBio_artwork++; }
		}
		else if (pref.layout === 'default') { pptBio.baseFontSizeBio_default = size; }
		else if (pref.layout === 'artwork') { pptBio.baseFontSizeBio_artwork = size; }

		pref.biographyFontSize_default = pptBio.baseFontSizeBio_default;
		pref.biographyFontSize_artwork = pptBio.baseFontSizeBio_artwork;

		setBiographySize();
		butBio.resetZoom();
		butBio.createImages();
		repaintWindow();
	});

	// * LYRICS * //
	changeFontSizeMenu.createRadioSubMenu('Lyrics', ['-1', '10px', '12px', '14px', '16px', '18px', RES_QHD ? '20px' : '20px (default)', RES_QHD ? '22px (default)' : '22px', '24px', '26px', '28px', '30px', '+1'], lyricsFontSize,
		[-1, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 999], (size) => {
		if (size === -1) {
			if      (pref.layout === 'default') { pref.lyricsFontSize_default--; }
			else if (pref.layout === 'artwork') { pref.lyricsFontSize_artwork--; }
		}
		else if (size === 999) {
			if      (pref.layout === 'default') { pref.lyricsFontSize_default++; }
			else if (pref.layout === 'artwork') { pref.lyricsFontSize_artwork++; }
		}
		else if (pref.layout === 'default') { pref.lyricsFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.lyricsFontSize_artwork = size; }

		if      (pref.layout === 'default') { pref.lyricsFontSize_default = Math.max(6, pref.lyricsFontSize_default); }
		else if (pref.layout === 'artwork') { pref.lyricsFontSize_artwork = Math.max(6, pref.lyricsFontSize_artwork); }

		createFonts();
		if (pref.displayLyrics) initLyrics();
	});

	changeFontSizeMenu.appendTo(menu);
}


/////////////////////////////////
// * PLAYER CONTROLS OPTIONS * //
/////////////////////////////////
/**
 * Top menu > Options > Player controls.
 * @param {Menu} menu Creates the Player controls menu via a new Menu instance.
 */
function playerControlsOptions(menu) {
	const playerControlsMenu = new Menu('Player controls');

	const playlistCallback = () => {
		playlist.on_size(ww, wh);
		repaintWindow();
	};

	const updateButtons = () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	};

	const updateSeekbar = () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	};

	// * TOP MENU * //
	const playerControlsTopMenu = new Menu('Top menu');
	const playerControlsTopMenuDefault = new Menu('Default');
	playerControlsTopMenuDefault.addToggleItem('Details', pref, 'showPanelDetails_default', () => { updateButtons(); });
	playerControlsTopMenuDefault.addToggleItem('Library', pref, 'showPanelLibrary_default', () => { updateButtons(); });
	playerControlsTopMenuDefault.addToggleItem('Biography', pref, 'showPanelBiography_default', () => { updateButtons(); });
	playerControlsTopMenuDefault.addToggleItem('Lyrics', pref, 'showPanelLyrics_default', () => { updateButtons(); });
	playerControlsTopMenuDefault.addToggleItem('Rating', pref, 'showPanelRating_default', () => { updateButtons(); });
	playerControlsTopMenuDefault.appendTo(playerControlsTopMenu);

	const playerControlsTopMenuArtwork = new Menu('Artwork');
	playerControlsTopMenuArtwork.addToggleItem('Details', pref, 'showPanelDetails_artwork', () => { updateButtons(); });
	playerControlsTopMenuArtwork.addToggleItem('Library', pref, 'showPanelLibrary_artwork', () => { updateButtons(); });
	playerControlsTopMenuArtwork.addToggleItem('Biography', pref, 'showPanelBiography_artwork', () => { updateButtons(); });
	playerControlsTopMenuArtwork.addToggleItem('Lyrics', pref, 'showPanelLyrics_artwork', () => { updateButtons(); });
	playerControlsTopMenuArtwork.addToggleItem('Rating', pref, 'showPanelRating_artwork', () => { updateButtons(); });
	playerControlsTopMenuArtwork.appendTo(playerControlsTopMenu);
	playerControlsTopMenu.addSeparator();

	playerControlsTopMenu.addRadioItems(['Align left', 'Align center'], pref.topMenuAlignment, ['left', 'center'], (align) => {
		pref.topMenuAlignment = align;
		updateButtons();
	});
	playerControlsTopMenu.addSeparator();
	playerControlsTopMenu.addToggleItem('Compact top menu', pref, 'topMenuCompact', () => {
		pref.showTopMenuCompact = pref.topMenuCompact;
		updateButtons();
	});
	playerControlsTopMenu.appendTo(playerControlsMenu);

	// * ALBUM ART * //
	if (pref.layout !== 'compact') {
		const playerControlsAlbumArtMenu = new Menu('Album art');
		const playerControlsAlbumArtNotPropMenu = new Menu('When player size is not proportional');
		if (pref.layout === 'default') {
			playerControlsAlbumArtNotPropMenu.addRadioItems(['Align album art left', 'Align album art left (margin)', 'Align album art center', 'Align album art right'], pref.albumArtAlign, ['left', 'leftMargin', 'center', 'right'], (pos) => {
				pref.albumArtAlign = pos;
				resizeArtwork(true);
				playlist.on_size(ww, wh);
				setLibrarySize();
				setBiographySize();
				repaintWindow();
			});
			playerControlsAlbumArtNotPropMenu.addSeparator();
		}
		playerControlsAlbumArtNotPropMenu.addRadioItems(['Left album art bg', 'Full album art bg', 'No album art bg'], pref.albumArtBg, ['left', 'full', 'none'], (type) => {
			pref.albumArtBg = type;
			repaintWindow();
		});
		playerControlsAlbumArtNotPropMenu.appendTo(playerControlsAlbumArtMenu);
		const playerControlsAlbumArtScaleMenu = new Menu('When player size is maximized/fullscreen');
		if (pref.layout === 'default') {
			playerControlsAlbumArtScaleMenu.addRadioItems(['Scale album art filled', 'Scale album art proportional'], pref.albumArtScale, ['filled', 'proportional'], (scale) => {
				pref.albumArtScale = scale;
				resizeArtwork(true);
				repaintWindow();
			});
			playerControlsAlbumArtScaleMenu.appendTo(playerControlsAlbumArtMenu);
		}
		playerControlsAlbumArtMenu.addSeparator();
		playerControlsAlbumArtMenu.addToggleItem(`Cycle album artwork (${settings.artworkDisplayTime}s delay)`, pref, 'cycleArt', () => {
			if (!pref.cycleArt) {
				clearTimeout(albumArtTimeout);
				albumArtTimeout = 0;
			} else {
				displayNextImage();
			}
		});
		playerControlsAlbumArtMenu.addToggleItem('Cycle album artwork with mouse wheel', pref, 'cycleArtMWheel');
		playerControlsAlbumArtMenu.addSeparator();
		playerControlsAlbumArtMenu.addToggleItem('Load embedded album art first', pref, 'loadEmbeddedAlbumArtFirst', () => {
			const msg = 'Do you want to load embedded album art first?\n\nYou also need to set it in foobar\'s preferences.\nFile > Preferences > Advanced > Display > Album art\n\nContinue?\n\n\n';
			const continue_confirmation = (status, confirmed) => {
				if (!confirmed) pref.loadEmbeddedAlbumArtFirst = false;
			}
			if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
				fb.ShowPopupMessage('Embedded album art enabled:\n\nYou also need to set it in foobar\'s preferences.\nFile > Preferences > Advanced > Display > Album art.', 'Embedded album art');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		});
		playerControlsAlbumArtMenu.addSeparator();

		const showHiResAudioLogoMenu = new Menu('Show hi-res audio badge on album cover');
		showHiResAudioLogoMenu.addToggleItem('Enabled', pref, 'showHiResAudioBadge', () => { repaintWindow(); });
		showHiResAudioLogoMenu.addSeparator();
		showHiResAudioLogoMenu.addToggleItem('Round', pref, 'hiResAudioBadgeRound', () => { repaintWindow(); }, !pref.showHiResAudioBadge);
		showHiResAudioLogoMenu.addSeparator();
		showHiResAudioLogoMenu.addRadioItems(['Small', 'Normal', 'Large'], pref.hiResAudioBadgeSize, ['small', 'normal', 'large'], (size) => {
			pref.hiResAudioBadgeSize = size;
			repaintWindow();
		}, !pref.showHiResAudioBadge);
		showHiResAudioLogoMenu.addSeparator();
		showHiResAudioLogoMenu.addRadioItems(['Top left', 'Top right', 'Bottom left', 'Bottom right'], pref.hiResAudioBadgePos, ['topleft', 'topright', 'bottomleft', 'bottomright'], (pos) => {
			pref.hiResAudioBadgePos = pos;
			repaintWindow();
		}, !pref.showHiResAudioBadge);
		showHiResAudioLogoMenu.appendTo(playerControlsAlbumArtMenu);
		playerControlsAlbumArtMenu.addToggleItem('Show pause on album cover', pref, 'showPause', () => { repaintWindow(); });
		playerControlsAlbumArtMenu.appendTo(playerControlsMenu);
	}

	// * JUMP SEARCH * //
	const playerControlsJumpSearchMenu = new Menu('Jump search');
	playerControlsJumpSearchMenu.addToggleItem('Include library in playlist search query', pref, 'jumpSearchIncludeLibrary');
	playerControlsJumpSearchMenu.addToggleItem('Include playlist in library search query', pref, 'jumpSearchIncludePlaylist');
	playerControlsJumpSearchMenu.addSeparator();
	playerControlsJumpSearchMenu.addToggleItem('Composer only in jump search query', pref, 'jumpSearchComposerOnly');
	playerControlsJumpSearchMenu.appendTo(playerControlsMenu);

	// * SCROLLBAR * //
	const playerControlsScrollbarMenu = new Menu('Scrollbar');
	const playerControlsScrollbarPlaylistMenu = new Menu('Playlist');
	const playerControlsScrollbarPlaylistStepsMenu = new Menu('Mouse wheel scroll steps');
	playerControlsScrollbarPlaylistStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], pref.playlistWheelScrollSteps, [0.5, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
		pref.playlistWheelScrollSteps = steps;
		playlistCallback();
	});
	playerControlsScrollbarPlaylistStepsMenu.appendTo(playerControlsScrollbarPlaylistMenu);
	const playerControlsScrollbarPlaylistDurationMenu = new Menu('Mouse wheel scroll smooth duration');
	playerControlsScrollbarPlaylistDurationMenu.addRadioItems(['100ms', '200ms', '300ms (default)', '400ms', '500ms', '600ms', '700ms', '800ms', '900ms', '1000ms'], pref.playlistWheelScrollDuration, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], (duration) => {
		pref.playlistWheelScrollDuration = duration;
		playlistCallback();
	});
	playerControlsScrollbarPlaylistDurationMenu.appendTo(playerControlsScrollbarPlaylistMenu);
	playerControlsScrollbarPlaylistMenu.addSeparator();
	playerControlsScrollbarPlaylistMenu.addToggleItem('Auto-scroll to current playing song', pref, 'playlistAutoScrollNowPlaying');
	playerControlsScrollbarPlaylistMenu.addToggleItem('Auto-hide', pref, 'playlistAutoHideScrollbar',  () => {
		g_properties.show_scrollbar = !pref.playlistAutoHideScrollbar;
		updatePlaylist();
	});
	playerControlsScrollbarPlaylistMenu.addToggleItem('Smooth scroll', pref, 'playlistSmoothScrolling');
	playerControlsScrollbarPlaylistMenu.appendTo(playerControlsScrollbarMenu);

	const playerControlsScrollbarLibraryMenu = new Menu('Library');
	const playerControlsScrollbarLibraryStepsMenu = new Menu('Mouse wheel scroll steps');
	playerControlsScrollbarLibraryStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], ppt.scrollStep, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
		ppt.scrollStep = steps;
		panel.updateProp(1);
	});
	playerControlsScrollbarLibraryStepsMenu.appendTo(playerControlsScrollbarLibraryMenu);
	const playerControlsScrollbarLibraryDurationMenu = new Menu('Mouse wheel scroll smooth duration');
	playerControlsScrollbarLibraryDurationMenu.addRadioItems(['100ms', '200ms', '300ms', '400ms', '500ms (default)', '600ms', '700ms', '800ms', '900ms', '1000ms'], ppt.durationScroll, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], (duration) => {
		ppt.durationScroll = duration;
		panel.updateProp(1);
	});
	playerControlsScrollbarLibraryDurationMenu.appendTo(playerControlsScrollbarLibraryMenu);
	playerControlsScrollbarLibraryMenu.addSeparator();
	playerControlsScrollbarLibraryMenu.addToggleItem('Auto-scroll to current playing song', pref, 'libraryAutoScrollNowPlaying');
	playerControlsScrollbarLibraryMenu.addToggleItem('Auto-hide', pref, 'libraryAutoHideScrollbar', () => {
		ppt.sbarShow = pref.libraryAutoHideScrollbar ? 1 : 2;
		setLibrarySize();
	});
	playerControlsScrollbarLibraryMenu.addToggleItem('Smooth scroll', ppt, 'smooth');
	playerControlsScrollbarLibraryMenu.appendTo(playerControlsScrollbarMenu);

	const playerControlsBiographyMenu = new Menu('Biography');
	const playerControlsScrollbarBiographyStepsMenu = new Menu('Mouse wheel scroll steps');
	playerControlsScrollbarBiographyStepsMenu.addRadioItems(['1 Step', '2 Steps', '3 Steps (default)', '4 Steps', '5 Steps', '6 Steps', '7 Steps', '8 Steps', '9 Steps', '10 Steps'], pptBio.scrollStep, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (steps) => {
		pptBio.scrollStep = steps;
		uiBio.updateProp(1);
	});
	playerControlsScrollbarBiographyStepsMenu.appendTo(playerControlsBiographyMenu);
	const playerControlsScrollbarBiographyDurationMenu = new Menu('Mouse wheel scroll smooth duration');
	playerControlsScrollbarBiographyDurationMenu.addRadioItems(['100ms', '200ms', '300ms', '400ms', '500ms (default)', '600ms', '700ms', '800ms', '900ms', '1000ms'], pptBio.durationScroll, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], (duration) => {
		pptBio.durationScroll = duration;
		uiBio.updateProp(1);
	});
	playerControlsScrollbarBiographyDurationMenu.appendTo(playerControlsBiographyMenu);
	playerControlsBiographyMenu.addSeparator();
	playerControlsBiographyMenu.addToggleItem('Auto-hide', pref, 'biographyAutoHideScrollbar', () => {
		if (pref.biographyAutoHideScrollbar) {
			pptBio.sbarShow = 1;
			butBio.setScrollBtnsHide();
		} else {
			pptBio.sbarShow = 2;
			butBio.setScrollBtnsHide(false, 'both');
		}
		uiBio.updateProp(1);
	});
	playerControlsBiographyMenu.addToggleItem('Smooth scroll', pptBio, 'smooth');
	playerControlsBiographyMenu.appendTo(playerControlsScrollbarMenu);

	playerControlsScrollbarMenu.appendTo(playerControlsMenu);

	// * TOOLTIP * //
	const playerControlsToolTipMenu = new Menu('Tooltip');
	playerControlsToolTipMenu.addToggleItem('Show tooltips only on truncated text', pref, 'showTooltipTruncated');
	playerControlsToolTipMenu.addSeparator();
	playerControlsToolTipMenu.addToggleItem('Show timeline tooltips', pref, 'showTooltipTimeline');
	playerControlsToolTipMenu.addSeparator();
	const playerControlsVolumeToolTipMenu = new Menu('Show volume tooltips');
	playerControlsVolumeToolTipMenu.addToggleItem('Enabled', pref, 'showTooltipVolume');
	playerControlsVolumeToolTipMenu.addSeparator();
	playerControlsVolumeToolTipMenu.addToggleItem('Show volume in percent', pref, 'showTooltipVolumeInPercent');
	playerControlsVolumeToolTipMenu.appendTo(playerControlsToolTipMenu);
	playerControlsToolTipMenu.addSeparator();
	playerControlsToolTipMenu.addToggleItem('Show main tooltips', pref, 'showTooltipMain');
	playerControlsToolTipMenu.addToggleItem('Show library tooltips', pref, 'showTooltipLibrary', () => {
		but.tooltipLib.show = pref.showTooltipLibrary || pref.showTooltipTruncated;
		setLibrarySize();
	});
	playerControlsToolTipMenu.addToggleItem('Show biography tooltips', pref, 'showTooltipBiography', () => {
		butBio.tooltipBio.show = pref.showTooltipBiography || pref.showTooltipTruncated;
		setBiographySize();
	});
	playerControlsToolTipMenu.addSeparator();
	playerControlsToolTipMenu.addToggleItem('Show styled tooltips', pref, 'showStyledTooltips');
	playerControlsToolTipMenu.appendTo(playerControlsMenu);

	// * PANEL MENU * //
	const playerControlsPanelMenu = new Menu('Panel');
	const playerControlsPanelNotPropMenu = new Menu('Width');
	playerControlsPanelNotPropMenu.addToggleItem('Use auto panel width', pref, 'panelWidthAuto', () => {
		pref.albumArtAlign = pref.panelWidthAuto ? 'left' : 'right';
		resizeArtwork(true);
		playlist.on_size(ww, wh);
		setLibrarySize();
		setBiographySize();
		repaintWindow();
	});
	playerControlsPanelNotPropMenu.appendTo(playerControlsPanelMenu);
	playerControlsPanelMenu.addSeparator();
	if (pref.layout !== 'compact') {
		const showPanelOnStartupMenu = new Menu('Show panel on startup');
		showPanelOnStartupMenu.addRadioItems(pref.layout === 'artwork' ? ['Cover', 'Playlist', 'Details', 'Library', 'Biography', 'Lyrics'] : ['Playlist', 'Details', 'Library', 'Biography', 'Lyrics'],
		pref.showPanelOnStartup, pref.layout === 'artwork' ? ['cover', 'playlist', 'details', 'library', 'biography', 'lyrics'] : ['playlist', 'details', 'library', 'biography', 'lyrics'], (panel) => {
			pref.showPanelOnStartup = panel;
			window.Reload();
		});
		showPanelOnStartupMenu.appendTo(playerControlsPanelMenu);
	}
	playerControlsPanelMenu.addToggleItem('Show logo on startup', pref, 'showLogoOnStartup', () => { repaintWindow(); });
	playerControlsPanelMenu.addSeparator();
	playerControlsPanelMenu.addToggleItem('Return to home on playback stop', pref, 'returnToHomeOnPlaybackStop');
	playerControlsPanelMenu.addSeparator();
	playerControlsPanelMenu.addToggleItem('Hide middle panel shadow', pref, 'hideMiddlePanelShadow', () => { repaintWindow(); });
	playerControlsPanelMenu.addSeparator();
	playerControlsPanelMenu.addToggleItem('Lock player size', pref, 'lockPlayerSize', () => { UIHacks.DisableSizing = true; });
	playerControlsPanelMenu.appendTo(playerControlsMenu);

	// * LOWER BAR MENU * //
	const playerControlsLowerBarMenu = new Menu('Lower bar');
	// * TRANSPORT BUTTON SIZE * //
	const transportSizeMenu = new Menu('Transport button size');
	const transportSizeMenuDefault = new Menu('Default');
	transportSizeMenuDefault.addRadioItems(['28px', '30px', '32px (default)', '34px', '36px', '38px', '40px', '42px'], pref.transportButtonSize_default, [28, 30, 32, 34, 36, 38, 40, 42], (size) => {
		if (size === -1) {
			pref.transportButtonSize_default -= 2;
		} else if (size === 999) {
			pref.transportButtonSize_default += 2;
		} else {
			pref.transportButtonSize_default = size;
		}
		createFonts();
		resizeArtwork(true);
		updateButtons();
	});
	transportSizeMenuDefault.appendTo(transportSizeMenu);

	const transportSizeMenuArtwork = new Menu('Artwork');
	transportSizeMenuArtwork.addRadioItems(['28px', '30px', '32px (default)', '34px', '36px'], pref.transportButtonSize_artwork, [28, 30, 32, 34, 36], (size) => {
		if (size === -1) {
			pref.transportButtonSize_artwork -= 2;
		} else if (size === 999) {
			pref.transportButtonSize_artwork += 2;
		} else {
			pref.transportButtonSize_artwork = size;
		}
		createFonts();
		resizeArtwork(true);
		updateButtons();
	});
	transportSizeMenuArtwork.appendTo(transportSizeMenu);

	const transportSizeMenuCompact = new Menu('Compact');
	transportSizeMenuCompact.addRadioItems(['28px', '30px', '32px (default)', '34px', '36px'], pref.transportButtonSize_compact, [28, 30, 32, 34, 36], (size) => {
		if (size === -1) {
			pref.transportButtonSize_compact -= 2;
		} else if (size === 999) {
			pref.transportButtonSize_compact += 2;
		} else {
			pref.transportButtonSize_compact = size;
		}
		createFonts();
		resizeArtwork(true);
		updateButtons();
	});
	transportSizeMenuCompact.appendTo(transportSizeMenu);
	transportSizeMenu.appendTo(playerControlsLowerBarMenu);

	// * TRANSPORT BUTTON SPACING * //
	const transportSpacingMenu = new Menu('Transport button spacing');
	const transportSpacingMenuDefault = new Menu('Default');
	transportSpacingMenuDefault.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transportButtonSpacing_default, [-1, 3, 5, 7, 10, 15, 999], (size) => {
		if (size === -1) {
			pref.transportButtonSpacing_default -= 2;
		} else if (size === 999) {
			pref.transportButtonSpacing_default += 2;
		} else {
			pref.transportButtonSpacing_default = size;
		}
		updateButtons();
	});
	transportSpacingMenuDefault.appendTo(transportSpacingMenu);

	const transportSpacingMenuArtwork = new Menu('Artwork');
	transportSpacingMenuArtwork.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transportButtonSpacing_artwork, [-1, 3, 5, 7, 10, 15, 999], (size) => {
		if (size === -1) {
			pref.transportButtonSpacing_artwork -= 2;
		} else if (size === 999) {
			pref.transportButtonSpacing_artwork += 2;
		} else {
			pref.transportButtonSpacing_artwork = size;
		}
		updateButtons();
	});
	transportSpacingMenuArtwork.appendTo(transportSpacingMenu);

	const transportSpacingMenuCompact = new Menu('Compact');
	transportSpacingMenuCompact.addRadioItems(['-2', '3px', '5px (default)', '7px', '10px', '15px', '+2'], pref.transportButtonSpacing_compact, [-1, 3, 5, 7, 10, 15, 999], (size) => {
		if (size === -1) {
			pref.transportButtonSpacing_compact -= 2;
		} else if (size === 999) {
			pref.transportButtonSpacing_compact += 2;
		} else {
			pref.transportButtonSpacing_compact = size;
		}
		updateButtons();
	});
	transportSpacingMenuCompact.appendTo(transportSpacingMenu);
	transportSpacingMenu.appendTo(playerControlsLowerBarMenu);
	playerControlsLowerBarMenu.addSeparator();

	// * SHOW TRANSPORT CONTROLS * //
	const transportControlsMenu = new Menu('Show transport controls');
	transportControlsMenu.addToggleItem('Default', pref, 'showTransportControls_default', () => {
		resizeArtwork(true);
		updateButtons();
	});
	transportControlsMenu.addToggleItem('Artwork', pref, 'showTransportControls_artwork', () => {
		resizeArtwork(true);
		updateButtons();
	});
	transportControlsMenu.addToggleItem('Compact', pref, 'showTransportControls_compact', () => {
		resizeArtwork(true);
		updateButtons();
	});
	transportControlsMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW PLAYBACK ORDER BUTTON * //
	const playbackOrderBtnMenu = new Menu('Show playback order button');
	playbackOrderBtnMenu.addToggleItem('Default', pref, 'showPlaybackOrderBtn_default', () => {
		updateButtons();
	}, !pref.showTransportControls_default);
	playbackOrderBtnMenu.addToggleItem('Artwork', pref, 'showPlaybackOrderBtn_artwork', () => {
		updateButtons();
	}, !pref.showTransportControls_artwork);
	playbackOrderBtnMenu.addToggleItem('Compact', pref, 'showPlaybackOrderBtn_compact', () => {
		updateButtons();
	}, !pref.showTransportControls_compact);
	playbackOrderBtnMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW RELOAD BUTTON * //
	const reloadBtnMenu = new Menu('Show reload button');
	reloadBtnMenu.addToggleItem('Default', pref, 'showReloadBtn_default', () => {
		volumeBtn = new VolumeBtn(); // create new volume btn for new width size
		updateButtons();
	}, !pref.showTransportControls_default);
	reloadBtnMenu.addToggleItem('Artwork', pref, 'showReloadBtn_artwork', () => {
		volumeBtn = new VolumeBtn(); // create new volume btn for new width size
		updateButtons();
	}, !pref.showTransportControls_artwork);
	reloadBtnMenu.addToggleItem('Compact', pref, 'showReloadBtn_compact', () => {
		volumeBtn = new VolumeBtn(); // create new volume btn for new width size
		updateButtons();
	}, !pref.showTransportControls_compact);
	reloadBtnMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW VOLUME BUTTON * //
	const volumeBtnMenu = new Menu('Show volume button');
	volumeBtnMenu.addToggleItem('Default', pref, 'showVolumeBtn_default', () => {
		updateButtons();
	}, !pref.showTransportControls_default);
	volumeBtnMenu.addToggleItem('Artwork', pref, 'showVolumeBtn_artwork', () => {
		updateButtons();
	}, !pref.showTransportControls_artwork);
	volumeBtnMenu.addToggleItem('Compact', pref, 'showVolumeBtn_compact', () => {
		updateButtons();
	}, !pref.showTransportControls_compact);
	volumeBtnMenu.addSeparator();
	volumeBtnMenu.addToggleItem('Auto-hide bar', pref, 'autoHideVolumeBar', () => {
		volumeBtn.toggleVolumeBar();
		updateButtons();
	});
	volumeBtnMenu.appendTo(playerControlsLowerBarMenu);
	playerControlsLowerBarMenu.addSeparator();

	// * SHOW PLAYBACK TIME IN LOWER BAR * //
	const playbackTimeMenu = new Menu('Show playback time');
	playbackTimeMenu.addToggleItem('Default', pref, 'showPlaybackTime_default', () => {
		updateButtons();
	});
	playbackTimeMenu.addToggleItem('Artwork', pref, 'showPlaybackTime_artwork', () => {
		updateButtons();
	});
	playbackTimeMenu.addToggleItem('Compact', pref, 'showPlaybackTime_compact', () => {
		updateButtons();
	});
	playbackTimeMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW ARTIST IN LOWER BAR * //
	const showArtistMenu = new Menu('Show artist');
	showArtistMenu.addToggleItem('Default', pref, 'showLowerBarArtist_default', () => { repaintWindow(); });
	showArtistMenu.addToggleItem('Artwork', pref, 'showLowerBarArtist_artwork', () => { repaintWindow(); });
	showArtistMenu.addToggleItem('Compact', pref, 'showLowerBarArtist_compact', () => { repaintWindow(); });
	showArtistMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW TRACK NUMBER IN LOWER BAR * //
	const showTrackNumberMenu = new Menu('Show track number');
	showTrackNumberMenu.addToggleItem('Default', pref, 'showLowerBarTrackNum_default', () => { on_metadb_changed(); repaintWindow(); });
	showTrackNumberMenu.addToggleItem('Artwork', pref, 'showLowerBarTrackNum_artwork', () => { on_metadb_changed(); repaintWindow(); });
	showTrackNumberMenu.addToggleItem('Compact', pref, 'showLowerBarTrackNum_compact', () => { on_metadb_changed(); repaintWindow(); });
	showTrackNumberMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW SONG TITLE IN LOWER BAR * //
	const showTitleMenu = new Menu('Show song title');
	showTitleMenu.addToggleItem('Default', pref, 'showLowerBarTitle_default', () => { repaintWindow(); });
	showTitleMenu.addToggleItem('Artwork', pref, 'showLowerBarTitle_artwork', () => { repaintWindow(); });
	showTitleMenu.addToggleItem('Compact', pref, 'showLowerBarTitle_compact', () => { repaintWindow(); });
	showTitleMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW COMPOSER IN LOWER BAR * //
	const showComposerMenu = new Menu('Show composer');
	showComposerMenu.addToggleItem('Default', pref, 'showLowerBarComposer_default', () => { repaintWindow(); });
	showComposerMenu.addToggleItem('Artwork', pref, 'showLowerBarComposer_artwork', () => { repaintWindow(); });
	showComposerMenu.addToggleItem('Compact', pref, 'showLowerBarComposer_compact', () => { repaintWindow(); });
	showComposerMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW ARTIST COUNTRY FLAGS IN LOWER BAR * //
	const showArtistFlagsMenu = new Menu('Show artist country flags');
	showArtistFlagsMenu.addToggleItem('Default', pref, 'showLowerBarArtistFlags_default', () => { loadCountryFlags(); repaintWindow(); });
	showArtistFlagsMenu.addToggleItem('Artwork', pref, 'showLowerBarArtistFlags_artwork', () => { loadCountryFlags(); repaintWindow(); });
	showArtistFlagsMenu.addToggleItem('Compact', pref, 'showLowerBarArtistFlags_compact', () => { loadCountryFlags(); repaintWindow(); });
	showArtistFlagsMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW SOFTWARE VERSION IN LOWER BAR * //
	const showSoftwareVersionMenu = new Menu('Show software version');
	showSoftwareVersionMenu.addToggleItem('Default', pref, 'showLowerBarVersion_default', () => { initMain(); });
	showSoftwareVersionMenu.addToggleItem('Artwork', pref, 'showLowerBarVersion_artwork', () => { initMain(); });
	showSoftwareVersionMenu.addToggleItem('Compact', pref, 'showLowerBarVersion_compact', () => { initMain(); });
	showSoftwareVersionMenu.appendTo(playerControlsLowerBarMenu);
	playerControlsLowerBarMenu.addSeparator();

	// * SHOW PROGRESS BAR * //
	const progressBarMenu = new Menu('Show progress bar');
	progressBarMenu.addToggleItem('Default', pref, 'showProgressBar_default', () => { updateSeekbar(); });
	progressBarMenu.addToggleItem('Artwork', pref, 'showProgressBar_artwork', () => { updateSeekbar(); });
	progressBarMenu.addToggleItem('Compact', pref, 'showProgressBar_compact', () => { updateSeekbar(); });
	progressBarMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW PEAKMETER BAR * //
	const peakmeterBarMenu = new Menu('Show peakmeter bar');
	peakmeterBarMenu.addToggleItem('Default', pref, 'showPeakmeterBar_default', () => { updateSeekbar(); });
	peakmeterBarMenu.addToggleItem('Artwork', pref, 'showPeakmeterBar_artwork', () => { updateSeekbar(); });
	peakmeterBarMenu.addToggleItem('Compact', pref, 'showPeakmeterBar_compact', () => { updateSeekbar(); });
	peakmeterBarMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW WAVEFORM BAR * //
	const waveformBarMenu = new Menu('Show waveform bar');
	waveformBarMenu.addToggleItem('Default', pref, 'showWaveformBar_default', () => { updateSeekbar(); });
	waveformBarMenu.addToggleItem('Artwork', pref, 'showWaveformBar_artwork', () => { updateSeekbar(); });
	waveformBarMenu.addToggleItem('Compact', pref, 'showWaveformBar_compact', () => { updateSeekbar(); });
	waveformBarMenu.appendTo(playerControlsLowerBarMenu);

	playerControlsLowerBarMenu.appendTo(playerControlsMenu);

	// * SEEKBAR - PROGRESS BAR * //
	const playerControlsSeekBarMenu = new Menu('Seekbar');
	playerControlsSeekBarMenu.createRadioSubMenu('Type', ['Progress bar', 'Peakmeter bar', 'Waveform bar'], pref.seekbar, ['progressbar', 'peakmeterbar', 'waveformbar'], (type) => {
		pref.seekbar = type;
		if (pref.seekbar === 'waveformbar') {
			waveformBar.updateBar();
		}
		setProgressBarRefresh();
		repaintWindow();
	});
	const playerControlsProgressBarMenu = new Menu('Progress bar');
	playerControlsProgressBarMenu.createRadioSubMenu('Style', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], pref.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (style) => {
		pref.styleProgressBarDesign = style;
		setGeometry();
		repaintWindow();
	});
	playerControlsProgressBarMenu.createRadioSubMenu('Mouse wheel seek speed', ['  1 sec', '  2 sec', '  3 sec', '  4 sec', '  5 sec (default)', '  6 sec', '  7 sec', '  8 sec', '  9 sec', '10 sec'], pref.progressBarWheelSeekSpeed, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (speed) => {
		pref.progressBarWheelSeekSpeed = speed;
	});
	playerControlsProgressBarMenu.createRadioSubMenu('Refresh rate', ['1000 ms (very slow CPU)', '  500 ms', '  333 ms', '  Variable (default)', '  100 ms', '    60 ms', '    30 ms (very fast CPU)'], pref.progressBarRefreshRate, [1000, 500, 333, 'variable', 100, 60, 30], (rate) => {
		pref.progressBarRefreshRate = rate;
		setProgressBarRefresh();
	}, !pref.showProgressBar_default || !pref.showProgressBar_artwork || !pref.showProgressBar_compact);
	playerControlsProgressBarMenu.appendTo(playerControlsSeekBarMenu);

	// * SEEKBAR - PEAKMETER BAR * //
	const playerControlspeakmeterBarMenu = new Menu('Peakmeter bar');
	playerControlspeakmeterBarMenu.createRadioSubMenu('Style', ['Horizontal', 'Horizontal center', 'Vertical'], pref.peakmeterBarDesign, ['horizontal', 'horizontal_center', 'vertical'], (design) => {
		pref.peakmeterBarDesign = design;
		repaintWindow();
	});
	if (pref.peakmeterBarDesign === 'vertical') {
		playerControlspeakmeterBarMenu.createRadioSubMenu('Size', ['  0 px', '  2 px', '  4 px', '  6 px', '  8 px', '10 px', pref.layout !== 'default' ? '12 px (default)' : '12 px', '14 px', '16 px', '18 px', pref.layout !== 'default' ? '20 px' : '20 px (default)', '25 px', '30 px', '35 px', '40 px', 'Minimum'], pref.peakmeterBarVertSize, [0, 2, 4, 6, 8, 10, 20, 25, 30, 35, 40, 'min'], (size) => {
			pref.peakmeterBarVertSize = size;
			repaintWindow();
		});
		playerControlspeakmeterBarMenu.createRadioSubMenu('Decibel range', ['2 to -20 db (default)', '2 to -15 db', '2 to -10 db', '3 to -20 db', '3 to -15 db', '3 to -10 db', '5 to -20 db', '5 to -15 db', '5 to -10 db'], pref.peakmeterBarVertDbRange, [220, 215, 210, 320, 315, 310, 520, 515, 510], (range) => {
			pref.peakmeterBarVertDbRange = range;
			repaintWindow();
		});
	}
	const playerControlspeakmeterBarDisplayMenu = new Menu('Display');
	if (pref.peakmeterBarDesign === 'horizontal' || pref.peakmeterBarDesign === 'horizontal_center') {
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show over bars', pref, 'peakmeterBarOverBars', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addSeparator();
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show outer bars', pref, 'peakmeterBarOuterBars', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show outer peaks', pref, 'peakmeterBarOuterPeaks', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addSeparator();
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show main bars', pref, 'peakmeterBarMainBars', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show main peaks', pref, 'peakmeterBarMainPeaks', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addSeparator();
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show middle bars', pref, 'peakmeterBarMiddleBars', () => { repaintWindow(); });
	}
	playerControlspeakmeterBarDisplayMenu.addToggleItem('Show progress bar', pref, 'peakmeterBarProgBar', () => { repaintWindow(); });
	if (pref.peakmeterBarDesign === 'horizontal' || pref.peakmeterBarDesign === 'horizontal_center') {
		playerControlspeakmeterBarDisplayMenu.addSeparator();
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show gaps', pref, 'peakmeterBarGaps', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show grid', pref, 'peakmeterBarGrid', () => { peakmeterBar.on_size(ww, wh); repaintWindow(); });
	}
	if (pref.peakmeterBarDesign === 'vertical') {
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show peaks', pref, 'peakmeterBarVertPeaks', () => { repaintWindow(); });
		playerControlspeakmeterBarDisplayMenu.addToggleItem('Show baseline', pref, 'peakmeterBarVertBaseline', () => { repaintWindow(); });
	}
	playerControlspeakmeterBarDisplayMenu.addToggleItem(pref.layout !== 'default' ? 'Show info (only available in Default layout)' : 'Show info', pref, 'peakmeterBarInfo', () => { repaintWindow(); });
	playerControlspeakmeterBarDisplayMenu.appendTo(playerControlspeakmeterBarMenu);
	playerControlspeakmeterBarMenu.createRadioSubMenu('Refresh rate', ['  200 ms (very slow CPU)', '  150 ms', '  120 ms', '  100 ms', '    80 ms (default)', '    60 ms', '    30 ms (very fast CPU)'], pref.peakmeterBarRefreshRate, [200, 150, 120, 100, 80, 60, 30], (rate) => {
		pref.peakmeterBarRefreshRate = rate;
		setProgressBarRefresh();
	}, !pref.showPeakmeterBar_default || !pref.showPeakmeterBar_artwork || !pref.showPeakmeterBar_compact);
	playerControlspeakmeterBarMenu.appendTo(playerControlsSeekBarMenu);

	// * SEEKBAR - WAVEFORM BAR * //
	const playerControlsWaveformBarMenu = new Menu('Waveform bar');
	playerControlsWaveformBarMenu.createRadioSubMenu(`Analysis${pref.waveformBarMode === 'ffprobe' ? '' : '\t (ffprobe only)'}`,
		['RMS level', 'Peak level', 'RMS peak'], pref.waveformBarAnalysis, ['rms_level', 'peak_level', 'rms_peak'], (type) => {
		pref.waveformBarAnalysis = type;
		waveformBar.updateConfig({ preset: { analysisMode: type } });
		waveformBar.updateBar();
		repaintWindow();
	}, pref.waveformBarMode !== 'ffprobe');

	playerControlsWaveformBarMenu.createRadioSubMenu('Mode', ['FFprobe', 'Audiowaveform', 'Visualizer'], pref.waveformBarMode, ['ffprobe', 'audiowaveform', 'visualizer'], (mode) => {
		pref.waveformBarMode = mode;
		waveformBar.updateConfig({ analysis: { binaryMode: mode } });
		waveformBar.updateBar();
		repaintWindow();
	});

	playerControlsWaveformBarMenu.createRadioSubMenu('Style', ['Waveform', 'Bars', 'Dots', 'Halfbars'], pref.waveformBarDesign, ['waveform', 'bars', 'dots', 'halfbars'], (design) => {
		pref.waveformBarDesign = design;
		waveformBar.updateConfig({ preset: { barDesign: design } });
	});

	const playerControlsWaveformBarSizeMenu = new Menu('Size');
	playerControlsWaveformBarSizeMenu.createRadioSubMenu('Waveform', ['1', '2', '3', '4', '5'], pref.waveformBarSizeWave, [1, 2, 3, 4, 5], (size) => {
		pref.waveformBarSizeWave = size;
		waveformBar.updateConfig({ ui: { sizeWave: size } });
	});
	playerControlsWaveformBarSizeMenu.createRadioSubMenu('Bars', ['1', '2', '3', '4', '5'], pref.waveformBarSizeBars, [1, 2, 3, 4, 5], (size) => {
		pref.waveformBarSizeBars = size;
		waveformBar.updateConfig({ ui: { sizeBars: size } });
	});
	playerControlsWaveformBarSizeMenu.createRadioSubMenu('Dots', ['1', '2', '3', '4', '5'], pref.waveformBarSizeDots, [1, 2, 3, 4, 5], (size) => {
		pref.waveformBarSizeDots = size;
		waveformBar.updateConfig({ ui: { sizeDots: size } });
	});
	playerControlsWaveformBarSizeMenu.createRadioSubMenu('Halfbars', ['1', '2', '3', '4', '5'], pref.waveformBarSizeHalf, [1, 2, 3, 4, 5], (size) => {
		pref.waveformBarSizeHalf = size;
		waveformBar.updateConfig({ ui: { sizeHalf: size } });
	});
	playerControlsWaveformBarSizeMenu.addSeparator();
	playerControlsWaveformBarSizeMenu.addToggleItem('Normalize width', pref, 'waveformBarSizeNormalize', () => {
		waveformBar.updateConfig({ ui: { sizeNormalizeWidth: pref.waveformBarSizeNormalize } });
	});
	playerControlsWaveformBarSizeMenu.appendTo(playerControlsWaveformBarMenu);

	const playerControlsWaveformBarDisplayMenu = new Menu(`Display${pref.waveformBarPaint === 'full' && pref.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`);
	playerControlsWaveformBarDisplayMenu.addRadioItems(['Full', 'Partial'], pref.waveformBarPaint, ['full', 'partial'], (paint) => {
		pref.waveformBarPaint = paint;
		waveformBar.updateConfig({ preset: { paintMode: paint } });
	});
	playerControlsWaveformBarDisplayMenu.addSeparator();

	playerControlsWaveformBarDisplayMenu.addToggleItem(`Prepaint${pref.waveformBarPaint === 'full' ? '\t(partial only)' : ''}`, pref, 'waveformBarPrepaint', () => {
		waveformBar.updateConfig({ preset: { prepaint: pref.waveformBarPrepaint } });
	}, pref.waveformBarPaint === 'full');

	const waveformBarPrepaintMenuDisabled = pref.waveformBarPaint === 'full' || pref.waveformBarMode === 'visualizer' || !pref.waveformBarPrepaint;
	playerControlsWaveformBarDisplayMenu.createRadioSubMenu('Prepaint front', ['  2 secs', '  5 secs', '10 secs', '     Full'], pref.waveformBarPrepaintFront, [2, 5, 10, Infinity], (time) => {
		pref.waveformBarPrepaintFront = time;
		waveformBar.updateConfig({ preset: { prepaintFront: time } });
	}, waveformBarPrepaintMenuDisabled);
	playerControlsWaveformBarDisplayMenu.appendTo(playerControlsWaveformBarMenu);
	playerControlsWaveformBarDisplayMenu.addSeparator();

	playerControlsWaveformBarDisplayMenu.addToggleItem('Animate', pref, 'waveformBarAnimate', () => {
		waveformBar.updateConfig({ preset: { animate: pref.waveformBarAnimate } });
	});

	playerControlsWaveformBarDisplayMenu.addToggleItem(`Use BPM${pref.waveformBarPaint === 'full' && pref.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, pref, 'waveformBarBPM', () => {
		if (pref.waveformBarBPM) pref.waveformBarRefreshRateVar = true;
		waveformBar.updateConfig({
			preset: { useBPM: pref.waveformBarBPM },
			ui: { refreshRateVar: pref.waveformBarRefreshRateVar }
		});
	}, !(pref.waveformBarPaint === 'partial' && pref.waveformBarPrepaint || pref.waveformBarMode === 'visualizer'));

	playerControlsWaveformBarDisplayMenu.addToggleItem('Invert halfbars', pref, 'waveformBarInvertHalfbars', () => {
		waveformBar.updateConfig({ preset: { invertHalfbars: pref.waveformBarInvertHalfbars } });
	});
	playerControlsWaveformBarDisplayMenu.addSeparator();

	playerControlsWaveformBarDisplayMenu.addToggleItem('Show indicator', pref, 'waveformBarIndicator', () => {
		waveformBar.updateConfig({ preset: { indicator: pref.waveformBarIndicator } });
	});

	const playerControlsWaveformBarRefreshMenu = new Menu(`Refresh rate${pref.waveformBarPaint === 'full' && pref.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`);
	const waveformBarRefreshMenuDisabled = pref.waveformBarPaint === 'full' || pref.waveformBarMode === 'visualizer' || !pref.waveformBarPrepaint;
	playerControlsWaveformBarRefreshMenu.addRadioItems(['1000 ms (very slow CPU)', '  500 ms', '  200 ms', '  100 ms (default)', '    80 ms', '    60 ms', '    30 ms (very fast CPU)'], pref.waveformBarRefreshRate, [1000, 500, 200, 100, 80, 60, 30], (rate) => {
		pref.waveformBarRefreshRate = rate;
		waveformBar.updateConfig({ ui: { refreshRate: rate } });
	}, waveformBarRefreshMenuDisabled);
	playerControlsWaveformBarRefreshMenu.addSeparator();
	playerControlsWaveformBarRefreshMenu.addToggleItem('    Variable refresh rate', pref, 'waveformBarRefreshRateVar', () => {
		waveformBar.updateConfig({ ui: { refreshRateVar: pref.waveformBarRefreshRateVar } });
	});
	playerControlsWaveformBarRefreshMenu.appendTo(playerControlsWaveformBarMenu);
	playerControlsWaveformBarMenu.appendTo(playerControlsSeekBarMenu);
	playerControlsSeekBarMenu.appendTo(playerControlsMenu);

	playerControlsMenu.appendTo(menu);
}


//////////////////////////
// * PLAYLIST OPTIONS * //
//////////////////////////
/**
 * Top menu > Options > Playlist.
 * @param {Menu} menu Creates the Playlist panel menu via a new Menu instance.
 * @param {boolean} context_menu Appends Playlist panel options to context menu.
 */
function playlistOptions(menu, context_menu) {
	const playlistMenu = context_menu ? menu : new Menu('Playlist');

	const playlistCallback = () => {
		playlist.on_size(ww, wh);
		repaintWindow();
	};

	// * LAYOUT * //
	if (pref.layout === 'default') {
		playlistMenu.createRadioSubMenu('Layout', ['Normal', 'Full'], pref.playlistLayout, ['normal', 'full'], (width) => {
			pref.playlistLayout = width;
			if (!displayPlaylist) displayPlaylist = true; displayLibrary = false; displayBiography = false;
			if (pref.displayLyrics) pref.displayLyrics = false;
			resizeArtwork(true);
			playlist.on_size(ww, wh);
			jumpSearch.on_size();
			initButtonState();
			repaintWindow();
		});
	}

	// * PLAYLIST MANAGER * //
	const playlistManagerMenu = new Menu('Playlist manager');
	const playlistManagerShowMenu = new Menu('Show playlist manager');
	playlistManagerShowMenu.addToggleItem('Default', pref, 'showPlaylistManager_default', playlistCallback);
	playlistManagerShowMenu.addToggleItem('Artwork', pref, 'showPlaylistManager_artwork', playlistCallback);
	playlistManagerShowMenu.addToggleItem('Compact', pref, 'showPlaylistManager_compact', playlistCallback);
	playlistManagerShowMenu.appendTo(playlistManagerMenu);
	playlistManagerMenu.addToggleItem('Show playlist history', pref, 'showPlaylistHistory',  () => { repaintWindow(); });
	playlistManagerMenu.addToggleItem('Auto-hide', pref, 'autoHidePlman',  () => { initTheme(); });
	playlistManagerMenu.appendTo(playlistMenu);

	// * ALBUM HEADER * //
	const playlistAlbumMenu = new Menu('Album header');
	const playlistAlbumArtMenu = new Menu('Album art');
	playlistAlbumArtMenu.addToggleItem('Show', g_properties, 'show_album_art', () => { updatePlaylist(); });
	playlistAlbumArtMenu.addToggleItem('Auto-hide when no cover', g_properties, 'auto_album_art', () => { updatePlaylist(); });
	playlistAlbumArtMenu.appendTo(playlistAlbumMenu);
	playlistAlbumMenu.addSeparator();

	playlistAlbumMenu.addToggleItem('Album header', g_properties, 'show_header', () => {
		updatePlaylist();
	});
	playlistAlbumMenu.addToggleItem('Compact header', g_properties, 'use_compact_header', () => {
		createPlaylistFonts();
		rescalePlaylist(true);
		initPlaylist();
		playlist.on_size(ww, wh);
		repaintWindow();
	}, !g_properties.show_header);
	playlistAlbumMenu.addToggleItem('Auto collapse and expand', g_properties, 'auto_collapse', () => {
		initPlaylist();
		playlist.on_size(ww, wh);
	});
	playlistAlbumMenu.addSeparator();
	playlistAlbumMenu.addToggleItem('Ctrl+click to follow hyperlinks', pref, 'hyperlinksCtrlClick');
	playlistAlbumMenu.addSeparator();
	playlistAlbumMenu.addToggleItem('Show disc sub-header', g_properties, 'show_disc_header', () => { updatePlaylist(); });
	playlistAlbumMenu.addToggleItem('Show group info', g_properties, 'show_group_info', () => { updatePlaylist(); });
	playlistAlbumMenu.addToggleItem('Show bit depth and sample rate always', settings, 'playlistShowBitSampleAlways', () => { updatePlaylist(); });
	playlistAlbumMenu.addToggleItem('Show weblinks in context menu', pref, 'showWeblinks');
	playlistAlbumMenu.addToggleItem('Show long release date (YYYY-MM-DD)', pref, 'showPlaylistFullDate', () => { updatePlaylist(); });
	playlistAlbumMenu.addSeparator();
	playlistAlbumMenu.addToggleItem('Show PLR value', g_properties, 'show_PLR_header', () => { updatePlaylist(); });
	playlistAlbumMenu.addSeparator();
	playlistAlbumMenu.addItem('Customize header info', false, () => { inputBox('playlistCustomHeaderInfo'); updatePlaylist(); });
	playlistAlbumMenu.appendTo(playlistMenu);

	// * TRACK ROW * //
	const rowsMenu = new Menu('Track row');
	rowsMenu.addToggleItem('Show row stripes', g_properties, 'show_row_stripes', playlistCallback);
	rowsMenu.addSeparator();
	rowsMenu.addToggleItem('Show play count', g_properties, 'show_playcount', playlistCallback);
	rowsMenu.addToggleItem('Show queue position', g_properties, 'show_queue_position', playlistCallback);
	rowsMenu.addSeparator();
	rowsMenu.addToggleItem('Show rating', g_properties, 'show_rating', playlistCallback);
	rowsMenu.addToggleItem('Show rating from tags', g_properties, 'use_rating_from_tags', () => { updatePlaylist(); });
	rowsMenu.addToggleItem('Show rating grid', pref, 'showPlaylistRatingGrid', playlistCallback);
	rowsMenu.addSeparator();
	rowsMenu.addToggleItem('Show PLR value', g_properties, 'show_PLR', playlistCallback);
	rowsMenu.addSeparator();
	rowsMenu.addToggleItem('Show track numbers', pref, 'showPlaylistTrackNumbers', () => { pref.showPlaylistIndexNumbers = false; updatePlaylist(); });
	rowsMenu.addToggleItem('Show index numbers', pref, 'showPlaylistIndexNumbers', () => { pref.showPlaylistTrackNumbers = false; updatePlaylist(); });
	rowsMenu.addSeparator();
	rowsMenu.addToggleItem('Show artist name on difference', pref, 'showDifferentArtist', () => { updatePlaylist(); });
	rowsMenu.addToggleItem('Show artist name in all rows', pref, 'showArtistPlaylistRows', () => { updatePlaylist(); });
	rowsMenu.addToggleItem('Show album title in all rows', pref, 'showAlbumPlaylistRows', () => { updatePlaylist(); });
	rowsMenu.addToggleItem('Show time remaining on playing track', pref, 'playlistTimeRemaining', () => { repaintWindow(); });
	rowsMenu.addToggleItem('Show vinyl style numbering if available', pref, 'showVinylNums', () => { updatePlaylist(); });
	rowsMenu.addToggleItem('Show last.fm scrobbles on no local plays', pref, 'lastFmScrobblesFallback', () => { updatePlaylist(); });
	rowsMenu.addSeparator();
	rowsMenu.addToggleItem('Row mouse hover', pref, 'playlistRowHover', () => { repaintWindow(); });
	rowsMenu.addSeparator();
	rowsMenu.addItem('Customize track row', false, () => { inputBox('playlistCustomTrackRow'); updatePlaylist(); });
	rowsMenu.appendTo(playlistMenu);

	// * SORT ORDER * //
	const playlistSortOrderMenu = new Menu('Sort order');
	playlistSortOrderMenu.addToggleItem('Always auto-sort', pref, 'playlistSortOrderAuto', () => {
		if (!pref.playlistSortOrderAuto) pref.playlistSortOrder = ''; // Hide checked radio item
	});
	playlistSortOrderMenu.addSeparator();
	playlistSortOrderMenu.addRadioItems(['Default', 'Artist | date ascending', 'Artist | date descending', 'Album', 'Title', 'Track number', 'Year ascending', 'Year descending', 'File path', 'Custom'], pref.playlistSortOrder,
		['default', 'artistDateAsc', 'artistDateDesc', 'album', 'title', 'tracknum', 'yearAsc', 'yearDesc', 'filePath', 'custom'], (order) => {
		pref.playlistSortOrder = order;
		if (pref.playlistSortOrder === 'custom') inputBox('playlistSortCustom');
		setPlaylistSortOrder();
		playlist.on_size(ww, wh);
		if (!pref.playlistSortOrderAuto) pref.playlistSortOrder = ''; // Hide checked radio item
		repaintWindow();
	});
	playlistSortOrderMenu.appendTo(playlistMenu);

	if (!context_menu) playlistMenu.appendTo(menu);
}


/////////////////////////
// * DETAILS OPTIONS * //
/////////////////////////
/**
 * Top menu > Options > Details.
 * @param {Menu} menu Creates the Details panel menu via a new Menu instance.
 * @param {boolean} context_menu Appends Details panel options to context menu.
 */
function detailsOptions(menu, context_menu) {
	if (pref.layout === 'compact') return;
	const detailsMenu = context_menu ? menu : new Menu('Details');

	if (pref.layout === 'default') {
		const discArtMenu = new Menu('Disc art');
		const displayDiscArtMenu = new Menu('Disc art placeholder');

		// * DISC ART PLACEHOLDER * //
		displayDiscArtMenu.addToggleItem('Show placeholder if no disc art found', pref, 'showDiscArtStub', () => {
			pref.noDiscArtStub = false;
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, !pref.displayDiscArt);
		displayDiscArtMenu.addSeparator();
		displayDiscArtMenu.addToggleItem('No placeholder', pref, 'noDiscArtStub', () => {
			pref.showDiscArtStub = false;
			discArt = disposeDiscArt(discArt);
			discArtCover = disposeDiscArt(discArtCover);
			discArtArray = [];
			discArtArrayCover = [];
			if (!pref.noDiscArtStub) fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, !pref.displayDiscArt);
		displayDiscArtMenu.addSeparator();
		displayDiscArtMenu.addRadioItems(['CD - Album cover', 'CD - White', 'CD - Black', 'CD - Blank', 'CD - Transparent', 'CD - Custom'],
			pref.discArtStub, ['cdAlbumCover', 'cdWhite', 'cdBlack', 'cdBlank', 'cdTrans', 'cdCustom'], (discArt) => {
			pref.discArtStub = discArt;
			pref.noDiscArtStub = false;
			discArtCover = disposeDiscArt(discArtCover);
			discArtArrayCover = [];
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, !pref.displayDiscArt);
		displayDiscArtMenu.addSeparator();
		displayDiscArtMenu.addRadioItems(['Vinyl - Album cover', 'Vinyl - White', 'Vinyl - Void', 'Vinyl - Cold fusion', 'Vinyl - Ring of fire', 'Vinyl - Maple', 'Vinyl - Black', 'Vinyl - Black hole', 'Vinyl - Ebony', 'Vinyl - Transparent', 'Vinyl - Custom'],
			pref.discArtStub, ['vinylAlbumCover', 'vinylWhite', 'vinylVoid', 'vinylColdFusion', 'vinylRingOfFire', 'vinylMaple', 'vinylBlack', 'vinylBlackHole', 'vinylEbony', 'vinylTrans', 'vinylCustom'], (discArt) => {
			pref.discArtStub = discArt;
			pref.noDiscArtStub = false;
			discArtCover = disposeDiscArt(discArtCover);
			discArtArrayCover = [];
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, !pref.displayDiscArt);
		displayDiscArtMenu.appendTo(discArtMenu);

		// * DISC ART OPTIONS * //
		discArtMenu.addToggleItem(`Display disc art if found (${settings.discArtBasename}.png, ${settings.discArtBasename}2.png, vinylA.png, etc.)`, pref, 'displayDiscArt', () => {
			if (fb.IsPlaying) fetchNewArtwork(fb.GetNowPlaying());
			lastLeftEdge = 0; // resize labels
			resizeArtwork(true);
			repaintWindow();
		});

		discArtMenu.addToggleItem('Display disc art above cover', pref, 'discArtOnTop', () => {
			pref.detailsAlbumArtDiscAreaOpacity = 255;
			repaintWindow();
		}, !pref.displayDiscArt);
		discArtMenu.addToggleItem('Filter cd/disc/vinyl .jpgs from artwork', pref, 'filterDiscJpgsFromAlbumArt');
		discArtMenu.addSeparator();
		discArtMenu.addToggleItem('Spin disc art while songs play (increases memory and CPU)', pref, 'spinDiscArt', () => {
			if (pref.spinDiscArt) {
				setDiscArtRotationTimer();
			} else {
				clearInterval(discArtRotationTimer);
				discArtArray = [];
				discArtArrayCover = [];
			}
		});
		discArtMenu.createRadioSubMenu('# Rotation images (memory usage/rotational speed)', ['  36 (10 degrees)', '  45 (8 degrees)', '  60 (6 degrees)', '  72 (5 degrees) (default)', '  90 (4 degrees)', '120 (3 degrees)', '180 (2 degrees)'], pref.spinDiscArtImageCount, [36, 45, 60, 72, 90, 120, 180], (count) => {
			pref.spinDiscArtImageCount = count;
			discArtRotationIndex = 0;
			discArtRotationIndexCover = 0;
			discArtArray = [];
			discArtArrayCover = [];
			repaintWindow();
		}, !pref.spinDiscArt);
		discArtMenu.createRadioSubMenu('Spinning disc art redraw speed', ['250ms (very slow CPU)', '200ms', '150ms', '125ms', '100ms', '  75ms (default)', '  50ms', '  40ms', '  30ms', '  20ms', '  10ms (very fast CPU)'], pref.spinDiscArtRedrawInterval, [250, 200, 150, 125, 100, 75, 50, 40, 30, 20, 10], interval => {
			pref.spinDiscArtRedrawInterval = interval;
			setDiscArtRotationTimer();
		}, !pref.spinDiscArt);
		discArtMenu.addSeparator();
		discArtMenu.addToggleItem('Rotate disc art as tracks change', pref, 'rotateDiscArt', () => { repaintWindow(); }, !pref.displayDiscArt || pref.spinDiscArt);
		discArtMenu.createRadioSubMenu('Disc art rotation amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(pref.rotationAmt), [2, 3, 4, 5], (rot) => {
			pref.rotationAmt = rot;
			createDiscArtRotation();
			repaintWindow();
		}, !pref.rotateDiscArt || pref.spinDiscArt);
		discArtMenu.appendTo(detailsMenu);

		discArtMenu.createRadioSubMenu('Disc art display amount', ['Auto (Needs enough width)', '50%  (Needs enough width, default)', '45%', '40%', '35%', '30%', '25%', '20%', '15%', '10%'], pref.discArtDisplayAmount, [1, 0.5, 0.455, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1], amount => {
			pref.discArtDisplayAmount = amount;
			resizeArtwork(true);
			repaintWindow();
		});

		// * DISC ART ALBUM ART * //
		const albumArtOpacityMenu = new Menu('Album art');
		albumArtOpacityMenu.createRadioSubMenu('Full artwork opacity (fast CPU needed when disc art spinning)', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], pref.detailsAlbumArtOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			pref.detailsAlbumArtOpacity = value;
			pref.detailsAlbumArtDiscAreaOpacity = 255;
			pref.discArtOnTop = false;
			repaintWindow();
		});
		albumArtOpacityMenu.createRadioSubMenu('Disc area opacity (very fast CPU needed when disc art spinning)', ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%'], pref.detailsAlbumArtDiscAreaOpacity, [255, 230, 204, 178, 153, 128, 102, 76, 51, 25], value => {
			pref.detailsAlbumArtDiscAreaOpacity = value;
			pref.detailsAlbumArtOpacity = 255;
			pref.discArtOnTop = false;
			repaintWindow();
		});
		albumArtOpacityMenu.appendTo(detailsMenu);
	}

	// * METADATA GRID MENU * //
	const detailsMetadataGridMenu = new Menu('Metadata grid');
	const detailsShowArtistMenu = new Menu('Show artist');
	detailsShowArtistMenu.addToggleItem('Default', pref, 'showGridArtist_default', () => {
		createFonts();
		repaintWindow();
	});
	detailsShowArtistMenu.addToggleItem('Artwork', pref, 'showGridArtist_artwork', () => {
		createFonts();
		repaintWindow();
	});
	detailsShowArtistMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW TRACK NUMBER IN DETAILS * //
	const detailsShowTrackNumberMenu = new Menu('Show track number');
	detailsShowTrackNumberMenu.addToggleItem('Default', pref, 'showGridTrackNum_default', () => {
		createFonts();
		repaintWindow();
	});
	detailsShowTrackNumberMenu.addToggleItem('Artwork', pref, 'showGridTrackNum_artwork', () => {
		createFonts();
		repaintWindow();
	});
	detailsShowTrackNumberMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW SONG TITLE IN DETAILS * //
	const detailsShowTitleMenu = new Menu('Show song title');
	detailsShowTitleMenu.addToggleItem('Default', pref, 'showGridTitle_default', () => {
		pref.showGridTrackNum_default = true;
		createFonts();
		repaintWindow();
	});
	detailsShowTitleMenu.addToggleItem('Artwork', pref, 'showGridTitle_artwork', () => {
		pref.showGridTrackNum_artwork = true;
		createFonts();
		repaintWindow();
	});
	detailsShowTitleMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW PLAYING PLAYLIST IN DETAILS * //
	const detailsShowPlaylingPlaylistMenu = new Menu('Show playing playlist');
	detailsShowPlaylingPlaylistMenu.addToggleItem('Enable', pref, 'showGridPlayingPlaylist', () => {
		on_playback_new_track(fb.GetNowPlaying());
		createFonts();
		repaintWindow();
	});
	detailsShowPlaylingPlaylistMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW TIMELINE IN DETAILS * //
	const detailsShowTimelineMenu = new Menu('Show timeline');
	detailsShowTimelineMenu.addToggleItem('Default', pref, 'showGridTimeline_default', () => {
		repaintWindow();
	});
	detailsShowTimelineMenu.addToggleItem('Artwork', pref, 'showGridTimeline_artwork', () => {
		repaintWindow();
	});
	detailsShowTimelineMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW ARTIST COUNTRY FLAG IN DETAILS * //
	const detailsShowArtistFlagsMenu = new Menu('Show artist country flags');
	detailsShowArtistFlagsMenu.addToggleItem('Default', pref, 'showGridArtistFlags_default', () => {
		loadCountryFlags();
		repaintWindow();
	});
	detailsShowArtistFlagsMenu.addToggleItem('Artwork', pref, 'showGridArtistFlags_artwork', () => {
		loadCountryFlags();
		repaintWindow();
	});
	detailsShowArtistFlagsMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW RELEASE COUNTRY FLAG IN DETAILS * //
	const detailsShowReleaseFlagsMenu = new Menu('Show release country flags');
	detailsShowReleaseFlagsMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], pref.showGridReleaseFlags_default, [false, 'logo', 'textlogo'], type => {
		pref.showGridReleaseFlags_default = type;
		loadReleaseCountryFlag();
		repaintWindow();
	});
	detailsShowReleaseFlagsMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], pref.showGridReleaseFlags_artwork, [false, 'logo', 'textlogo'], type => {
		pref.showGridReleaseFlags_artwork = type;
		loadReleaseCountryFlag();
		repaintWindow();
	});
	detailsShowReleaseFlagsMenu.appendTo(detailsMetadataGridMenu);

	// * SHOW CODEC LOGO IN DETAILS * //
	const detailsShowCodecLogoMenu = new Menu('Show codec logo');
	detailsShowCodecLogoMenu.createRadioSubMenu('Default', ['Disabled', 'Logo', 'Text + Logo'], pref.showGridCodecLogo_default, [false, 'logo', 'textlogo'], type => {
		pref.showGridCodecLogo_default = type;
		repaintWindow();
	});
	detailsShowCodecLogoMenu.createRadioSubMenu('Artwork', ['Disabled', 'Logo', 'Text + Logo'], pref.showGridCodecLogo_artwork, [false, 'logo', 'textlogo'], type => {
		pref.showGridCodecLogo_artwork = type;
		repaintWindow();
	});
	detailsShowCodecLogoMenu.appendTo(detailsMetadataGridMenu);

	// * EDIT METADATA GRID IN DETAILS * //
	if (fb.IsPlaying) {
		detailsMetadataGridMenu.addSeparator();
		detailsMetadataGridMenu.addItem('Edit metadata grid', false, () => {
			if (pref.layout === 'default') {
				displayMetadataGridMenu = !displayMetadataGridMenu;
				if (!displayDetails) {
					displayDetails = true;
					displayPlaylist = false;
					displayLibrary = false;
					displayBiography = false;
					pref.displayLyrics = false;
					resizeArtwork(true);
					initButtonState();
				}
				initMetadataGridMenu(1);
				repaintWindow();
			} else {
				const configPath = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc`;
				fb.ShowPopupMessage(`Metadata grid can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${configPath}\n`, 'Metadata grid live editing');
			}
		});
	}
	detailsMetadataGridMenu.appendTo(detailsMenu);

	if (pref.layout === 'default') {
		const detailsBackgroundMenu = new Menu('Background');
		// * SHOW FULL BACKGROUND WHEN NO DISC ART IN DETAILS * //
		detailsBackgroundMenu.addToggleItem('Show full background when no disc art', pref, 'noDiscArtBg', () => {
			if (pref.labelArtOnBg) {
				pref.labelArtOnBg = false;
			}
			repaintWindow();
		});
		// * SHOW LABEL ART ON BACKGROUND IN DETAILS * //
		detailsBackgroundMenu.addToggleItem('Show label art on background', pref, 'labelArtOnBg', () => repaintWindow(), pref.noDiscArtBg);
		detailsBackgroundMenu.appendTo(detailsMenu);
	}

	if (!context_menu) detailsMenu.appendTo(menu);
}


/////////////////////////
// * LIBRARY OPTIONS * //
/////////////////////////
/**
 * Top menu > Options > Library.
 * @param {Menu} menu Creates the Library panel menu via a new Menu instance.
 * @param {boolean} context_menu Appends Library options to context menu.
 */
function libraryOptions(menu, context_menu) {
	if (pref.layout === 'compact') return;
	const libraryMenu = context_menu ? menu : new Menu('Library');

	// * LAYOUT * //
	if (pref.layout === 'default') {
		const libraryLayoutMenu = new Menu('Layout');
		libraryLayoutMenu.addRadioItems(['Normal', 'Full', 'Split'], pref.libraryLayout, ['normal', 'full', 'split'], (width) => {
			pref.libraryLayout = width;
			if (!displayLibrary) displayLibrary = true; displayPlaylist = false; displayBiography = false;
			if (pref.displayLyrics) pref.displayLyrics = false;
			displayPlaylist = pref.libraryLayout === 'split';
			resizeArtwork(true);
			initLibraryLayout();
			initButtonState();
			repaintWindow();
		});
		libraryLayoutMenu.addSeparator();
		libraryLayoutMenu.addToggleItem('Use full preset', pref, 'libraryLayoutFullPreset', () => { repaintWindow(); });
		libraryLayoutMenu.addSeparator();
		libraryLayoutMenu.addToggleItem('Use split preset (collapse)', pref, 'libraryLayoutSplitPreset', () => {
			pref.libraryLayoutSplitPreset2 = false;
			pref.libraryLayoutSplitPreset3 = false;
			pref.libraryLayoutSplitPreset4 = false;
			initLibraryLayout();
			initPlaylist();
			playlist.on_size(ww, wh);
		});
		libraryLayoutMenu.addToggleItem('Use split preset (text)', pref, 'libraryLayoutSplitPreset2', () => {
			pref.libraryLayoutSplitPreset = false;
			pref.libraryLayoutSplitPreset3 = false;
			pref.libraryLayoutSplitPreset4 = false;
			initLibraryLayout();
			initPlaylist();
			playlist.on_size(ww, wh);
		});
		libraryLayoutMenu.addToggleItem('Use split preset (art grid)', pref, 'libraryLayoutSplitPreset3', () => {
			pref.libraryLayoutSplitPreset = false;
			pref.libraryLayoutSplitPreset2 = false;
			pref.libraryLayoutSplitPreset4 = false;
			initLibraryLayout();
			initPlaylist();
			playlist.on_size(ww, wh);
		});
		libraryLayoutMenu.addToggleItem('Use split preset (art header)', pref, 'libraryLayoutSplitPreset4', () => {
			pref.libraryLayoutSplitPreset = false;
			pref.libraryLayoutSplitPreset2 = false;
			pref.libraryLayoutSplitPreset3 = false;
			initLibraryLayout();
			initPlaylist();
			playlist.on_size(ww, wh);
		});
		libraryLayoutMenu.appendTo(libraryMenu);
	}

	// * DESIGN * //
	libraryMenu.createRadioSubMenu('Design', ['Georgia-ReBORN', 'Traditional', 'Modern', 'Ultra-modern', 'Clean', 'List view', 'Covers (labels right)', 'Covers (labels bottom)', 'Covers (labels blend)', 'Flow mode'], pref.libraryDesign,
		['reborn', 'traditional', 'modern', 'ultraModern', 'clean', 'facet', 'coversLabelsRight', 'coversLabelsBottom', 'coversLabelsBlend', 'flowMode'], (design) => {
		pref.libraryDesign = design;
		setLibraryDesign();
	});

	// * THEME * //
	libraryMenu.createRadioSubMenu('Theme', ['Georgia-ReBORN', 'Dark', 'Blend', 'Light', 'Random', 'Cover'], pref.libraryTheme, [0, 1, 2, 3, 4, 5], (theme) => {
		ppt.theme = pref.libraryTheme = theme;
		initTheme();
		library.on_colours_changed();
		panel.updateProp(1);
		themeColorAdjustments();
	});

	// * ALBUM ART * //
	const libraryAlbumArtMenu = new Menu('Album art');
	const libraryThumbnailSizeMenu = new Menu('Thumbnail size');
	libraryThumbnailSizeMenu.addRadioItems(['Auto (default)', 'Playlist', 'Mini', 'Small', 'Regular', 'Medium', 'Large', 'XL', 'XXL', 'MAX'], pref.libraryThumbnailSize, ['auto', 'playlist', 0, 1, 2, 3, 4, 5, 6, 7], (thumbnailSize) => {
		pref.libraryThumbnailSizeSaved = ppt.thumbNailSize = pref.libraryThumbnailSize = thumbnailSize;
		setLibrarySize();
		repaintWindow();
	});
	libraryThumbnailSizeMenu.appendTo(libraryAlbumArtMenu);

	const libraryThumbnailBorderMenu = new Menu('Thumbnail border');
	libraryThumbnailBorderMenu.addRadioItems(['None', 'Border', 'Shadow'], pref.libraryThumbnailBorder, ['none', 'border', 'shadow'], (type) => {
		pref.libraryThumbnailBorder = type;
		ppt.albumArtDropShadow = pref.libraryThumbnailBorder === 'shadow';
		panel.updateProp(1);
	});
	libraryThumbnailBorderMenu.appendTo(libraryAlbumArtMenu);

	if (!ppt.albumArtShow) {
		libraryAlbumArtMenu.addToggleItem('Activate option or change design to album art', ppt, 'albumArtShow', () => {
			if (pref.libraryDesign === 'flowMode') pref.libraryLayout = 'full';
			lib.logTree();
			pop.clearTree();
			ppt.toggle('albumArtShow');
			panel.imgView = ppt.albumArtShow = true;
			men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
			setLibrarySize();
			displayPlaylist = false;
			displayLibrary = true;
			btns.library.enabled = true;
			btns.library.changeState(ButtonState.Down);
			panel.updateProp(1);
		}, ppt.albumArtShow);
		libraryAlbumArtMenu.addSeparator();
	}

	const libraryAlbumArtOverlay = new Menu('Overlay');
	libraryAlbumArtOverlay.addRadioItems(['None', 'Track count', 'Year'], ppt.itemOverlayType, [0, 1, 2], (type) => {
		ppt.itemOverlayType = type;
		panel.updateProp(1);
	});
	libraryAlbumArtOverlay.appendTo(libraryAlbumArtMenu);

	const libraryAlbumArtIndex = new Menu('Index');
	libraryAlbumArtIndex.addToggleItem('Show on scrollbar drag', ppt, 'albumArtLetter', () => { panel.updateProp(1); });
	libraryAlbumArtIndex.addSeparator();
	libraryAlbumArtIndex.addRadioItems(['Artist', 'Alphabet'], ppt.albumArtLetterNo, [0, 1], (type) => {
		ppt.albumArtLetterNo = type;
		panel.updateProp(1);
	});
	libraryAlbumArtIndex.appendTo(libraryAlbumArtMenu);
	libraryAlbumArtMenu.appendTo(libraryMenu);

	const libraryViewMenu = new Menu('View');
	libraryViewMenu.addRadioItems(['Front (default)', 'Back', 'Disc', 'Icon', 'Artist'], ppt.artId, [0, 1, 2, 3, 4], (view) => {
		ppt.artId = view;
		men.setAlbumart(view);
		panel.updateProp(1);
	});
	libraryViewMenu.addSeparator();
	libraryViewMenu.addRadioItems(['Group: auto', 'Group: top level', 'Group: two levels'], ppt.albumArtGrpLevel, [0, 1, 2], (view) => {
		ppt.albumArtGrpLevel = view;
		men.setAlbumart(view - 5);
		panel.updateProp(1);
	});
	libraryViewMenu.appendTo(libraryAlbumArtMenu);

	const libraryImageMenu = new Menu('Image');
	libraryImageMenu.createRadioSubMenu('Front', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleFront, [0, 1, 2], (style) => {
		ppt.imgStyleFront = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Back', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleBack, [0, 1, 2], (style) => {
		ppt.imgStyleBack = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Disc', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleDisc, [0, 1, 2], (style) => {
		ppt.imgStyleDisc = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Icon', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleIcon, [0, 1, 2], (style) => {
		ppt.imgStyleIcon = style;
		panel.updateProp(1);
	});
	libraryImageMenu.createRadioSubMenu('Artist', ['Regular', 'Auto-fill (default)', 'Circular'], ppt.imgStyleArtist, [0, 1, 2], (style) => {
		ppt.imgStyleArtist = style;
		panel.updateProp(1);
	});
	libraryImageMenu.appendTo(libraryAlbumArtMenu);

	const libraryLabelsMenu = new Menu('Labels');
	libraryLabelsMenu.addRadioItems(['Bottom (default)', 'Right', 'Blend', 'Dark', 'None'], ppt.albumArtLabelType, [1, 2, 3, 4, 0], (style) => {
		pref.savedAlbumArtLabelType = ppt.albumArtLabelType = style;
		panel.updateProp(1);
	});
	libraryLabelsMenu.addSeparator();
	libraryLabelsMenu.addToggleItem('Flip', ppt, 'albumArtFlipLabels', () => {  panel.updateProp(1); });
	libraryLabelsMenu.appendTo(libraryAlbumArtMenu);

	// * CONTROLS * //
	const libraryControlsMenu = new Menu('Controls');
	libraryControlsMenu.createRadioSubMenu('Action mode', ['Default', 'Browser', 'Player'], ppt.actionMode, [0, 1, 2], (mode) => {
		ppt.actionMode = mode;
		if (mode === 1) {
			const msg = 'Do you want to enable library browser mode?\n\nThis will act like a file browser to quickly see the content of the album. It is not recommended for new users\nwho don\'t know how the library works.\n\nContinue?\n\n\n';
			const continue_confirmation = (status, confirmed) => {
				if (!confirmed) {
					ppt.actionMode = 0;
					return;
				}
				pref.libraryLayoutSplitPreset  = false;
				pref.libraryLayoutSplitPreset2 = false;
				pref.libraryLayoutSplitPreset3 = false;
				pref.libraryLayoutSplitPreset4 = false;
				pref.libraryLayout = 'split';
				panel.imgView = ppt.albumArtShow = true;
				lib.logTree();
				pop.clearTree();
				men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
				setLibrarySize();
				initLibraryColors();
				themeColorAdjustments();
				g_properties.show_header = true;
				g_properties.auto_collapse = false;
				displayPlaylist = true;
				displayLibrary = true;
			}
			updatePlaylist();
			repaintWindow();
			if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
				fb.ShowPopupMessage('Library browser mode enabled:\n\nThis will act like a file browser to quickly see the content of the album.\nIt is not recommended for new users who don\'t know how the library works.', 'Library browser mode');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		}
		else if (mode === 2) {
			const msg = 'Do you want to enable library player mode?\n\nThis will act like a playlist and will not automatically add content to the playlist. It is recommended for new users\nwho don\'t know how the library works.\n\nContinue?\n\n\n';
			const continue_confirmation = (status, confirmed) => {
				if (!confirmed) {
					ppt.actionMode = 0;
				}
			}
			repaintWindow();
			if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
				fb.ShowPopupMessage('Library player mode enabled:\n\nThis will act like a like a playlist and will not automatically add content to the playlist.\nIt is recommended for new users who don\'t know how the library works.', 'Library player mode');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		};
	});
	libraryControlsMenu.addSeparator();
	libraryControlsMenu.createRadioSubMenu('Single-click action', ['Select', 'Send to playlist', 'Send to playlist and play', 'Send to playlist and play (add if playing)'], ppt.clickAction, [0, 1, 2, 3], (action) => {
		ppt.clickAction = action;
		panel.updateProp(1);
	});
	libraryControlsMenu.createRadioSubMenu('Double-click action', ['Send to playlist', 'Send to playlist and play', 'Expand/Collapse tree', 'Play only'], ppt.dblClickAction, [0, 1, 2, 3], (action) => {
		ppt.dblClickAction = action;
		panel.updateProp(1);
	});
	libraryControlsMenu.createRadioSubMenu('Middle-click action', ['Add to default playlist', 'Add to current playlist', 'Add to playback queue (alt + double-click removes)'], ppt.mbtnClickAction, [0, 1, 2], (action) => {
		ppt.mbtnClickAction = action;
		panel.updateProp(1);
	});
	libraryControlsMenu.createRadioSubMenu('Alt + mouse click action', ['Add to default playlist', 'Add to current playlist', 'Add to playback queue (alt + double-click removes)'], ppt.altClickAction, [0, 1, 2], (action) => {
		ppt.altClickAction = action;
		panel.updateProp(1);
	});
	const libraryKeystrokeMenu = new Menu('Keystroke action');
	libraryKeystrokeMenu.addToggleItem('Play on Enter or send from menu', ppt, 'autoPlay', () => { panel.updateProp(1); });
	libraryKeystrokeMenu.addSeparator();
	libraryKeystrokeMenu.addRadioItems(['Select', 'Send to Playlist'], ppt.keyAction, [0, 1], (action) => {
		ppt.keyAction = action;
		panel.updateProp(1);
	});
	libraryKeystrokeMenu.appendTo(libraryControlsMenu);
	libraryControlsMenu.addSeparator();
	libraryControlsMenu.addToggleItem('Always remember library state', ppt, 'rememberTree', () => { panel.updateProp(1); });
	libraryControlsMenu.addToggleItem('Always load View by same as tree', ppt, 'artTreeSameView', () => { panel.updateProp(1); });
	libraryControlsMenu.addToggleItem('Always load preset with current view pattern', ppt, 'presetLoadCurView', () => { panel.updateProp(1); });
	libraryControlsMenu.addSeparator();
	libraryControlsMenu.addToggleItem('Switch to playlist when adding songs', pref, 'libraryPlaylistSwitch');
	libraryControlsMenu.addSeparator();
	libraryControlsMenu.addItem('Reset library zoom', false, () => { panel.zoomReset();	});
	libraryControlsMenu.appendTo(libraryMenu);

	// * TRACK ROW * //
	const libraryTrackRowMenu = new Menu('Track row');
	libraryTrackRowMenu.createRadioSubMenu('Node root type', ['Hide', 'All Music', 'View name', 'Summary item'], ppt.rootNode, [0, 1, 2, 3], (nodeIndex) => {
		ppt.rootNode = nodeIndex;
		panel.updateProp(1);
	});
	libraryTrackRowMenu.createRadioSubMenu('Node item counts', ['Hidden', '# Tracks', '# Sub-Items'], ppt.nodeCounts, [0, 1, 2], (nodeIndex) => {
		ppt.nodeCounts = nodeIndex;
		panel.updateProp(1);
	});
	libraryTrackRowMenu.createRadioSubMenu('Node item counts position', ['Right', 'Left'], ppt.countsRight, [true, false], (nodeCounts) => {
		ppt.countsRight = nodeCounts;
		panel.updateProp(1);
	});
	libraryTrackRowMenu.createRadioSubMenu('Node auto collapse', ['On', 'Off'], ppt.autoCollapse, [true, false], (nodeCollapse) => {
		ppt.autoCollapse = nodeCollapse;
		panel.updateProp(1);
	});
	libraryTrackRowMenu.addSeparator();
	libraryTrackRowMenu.createRadioSubMenu('Statistics', ['Tracks', 'Bitrate', 'Duration', 'Total size', 'Rating', 'Popularity', 'Date', 'Playback queue', 'Playcount', 'First played', 'Last played', 'Added'], ppt.itemShowStatistics, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], (stats) => {
		ppt.itemShowStatistics = stats;
		panel.updateProp(1);
	});
	libraryTrackRowMenu.addSeparator();
	libraryTrackRowMenu.addToggleItem('Show now playing', ppt, 'highLightNowplaying', () => { panel.updateProp(1); });
	libraryTrackRowMenu.addToggleItem('Show tracks when expanding nodes', ppt, 'showTracks', () => { pop.collapseAll(); panel.updateProp(1); });
	libraryTrackRowMenu.addToggleItem('Show row stripes', ppt, 'rowStripes', () => { panel.updateProp(1); });
	libraryTrackRowMenu.addSeparator();
	libraryTrackRowMenu.addToggleItem('Row fully clickable', ppt, 'fullLineSelection', () => { panel.updateProp(1); });
	libraryTrackRowMenu.addToggleItem('Row mouse hover', pref, 'libraryRowHover', () => { repaintWindow(); });
	libraryTrackRowMenu.appendTo(libraryMenu);

	// * FILTER ORDER * //
	const libraryFilterOrderMenu = new Menu('Filter order');
	libraryFilterOrderMenu.addRadioItems(['No filter', 'Lossless', 'Lossy', 'Missing replaygain', 'Never played', 'Played often', 'Recently added', 'Recently played', 'Top rated', 'Nowplaying artist'], ppt.filterBy, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (order) => {
		ppt.filterBy = order;
		panel.set('Filter', order);
	});
	libraryFilterOrderMenu.appendTo(libraryMenu);

	// * SORT ORDER * //
	const librarySortOrderMenu = new Menu('Sort order');
	librarySortOrderMenu.addRadioItems(['Default', 'Ascending (hide year)', 'Ascending (show year)', 'Descending (hide year)', 'Descending (show year)'], ppt.sortOrder, [0, 1, 2, 3, 4], (order) => {
		ppt.sortOrder = order;
		const d = {};
		men.getSortData(d);
		men.sortByDate(ppt.sortOrder, d);
	});
	librarySortOrderMenu.addSeparator();
	librarySortOrderMenu.addRadioItems(['Action: year after album', 'Action: year before album'], ppt.yearBeforeAlbum, [false, true], (year) => {
		ppt.yearBeforeAlbum = year;
	});
	librarySortOrderMenu.appendTo(libraryMenu);

	// * VIEW ORDER * //
	const libraryViewOrderMenu = new Menu('View order');
	libraryViewOrderMenu.addRadioItems(['Artist', 'Album artist', 'Album artist | album', 'Album', 'Composer', 'Country', 'Country | Genre', 'Genre', 'Label', 'Year', 'Folder structure'], panel.imgView ? ppt.albumArtViewBy : ppt.treeViewBy, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (order) => {
		if (ppt.albumArtShow) {
			ppt.albumArtViewBy = order;
		} else {
			ppt.viewBy = order;
			ppt.treeViewBy = order;
		}
		lib.logTree();
		pop.clearTree();
		men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
	});
	libraryViewOrderMenu.appendTo(libraryMenu);

	if (!context_menu) libraryMenu.appendTo(menu);
}


///////////////////////////
// * BIOGRAPHY OPTIONS * //
///////////////////////////
/**
 * Top menu > Options > Biography.
 * @param {Menu} menu Creates the Biography panel menu via a new Menu instance.
 * @param {boolean} context_menu Appends Biography panel options to context menu.
 */
function biographyOptions(menu, context_menu) {
	if (pref.layout === 'compact') return;
	const biographyMenu = context_menu ? menu : new Menu('Biography');
	const biographyLayoutMenu = new Menu('Layout');

	// * LAYOUT * //
	if (pref.layout === 'default') {
		biographyLayoutMenu.addRadioItems(['Normal', 'Full'], pref.biographyLayout, ['normal', 'full'], (width) => {
			pref.biographyLayout = width;
			if (!displayBiography) displayBiography = true; displayPlaylist = false; displayLibrary = false;
			if (pref.displayLyrics) pref.displayLyrics = false;
			displayPlaylist = !displayPlaylist;
			initBiographyLayout();
			initButtonState();
		});
		biographyLayoutMenu.addSeparator();
		biographyLayoutMenu.addToggleItem('Use full preset', pref, 'biographyLayoutFullPreset', () => { repaintWindow(); });
		biographyLayoutMenu.addSeparator();
	}
	biographyLayoutMenu.addRadioItems(['Top (default)', 'Right', 'Bottom', 'Left', 'Full overlay', 'Part overlay'], pptBio.style, [0, 1, 2, 3, 4, 5], (layout) => {
		pptBio.style = layout;
		uiBio.updateProp(1);
	});
	biographyLayoutMenu.addSeparator();
	const biographyFilmstripMenu = new Menu('Filmstrip');
	biographyFilmstripMenu.addRadioItems(['Top', 'Right', 'Bottom', 'Left (default)'], pptBio.filmStripPos, [0, 1, 2, 3], (pos) => {
		pptBio.filmStripPos = pos;
		uiBio.updateProp(1);
	});
	biographyFilmstripMenu.addSeparator();
	biographyFilmstripMenu.addToggleItem('Overlay image area', pptBio, 'filmStripOverlay', () => { uiBio.updateProp(1); });
	biographyFilmstripMenu.appendTo(biographyLayoutMenu);
	biographyLayoutMenu.appendTo(biographyMenu);

	// * THEME * //
	const biographyThemeMenu = new Menu('Theme');
	biographyThemeMenu.addRadioItems(['Georgia-ReBORN', 'Dark', 'Blend', 'Light'], pref.biographyTheme, [0, 1, 2, 3], (theme) => {
		pref.biographyTheme = theme;
		pptBio.theme = pref.biographyTheme;
		initTheme();
		biography.on_colours_changed();
		uiBio.updateProp(1);
		themeColorAdjustments();
	});
	biographyThemeMenu.appendTo(biographyMenu);

	// * DISPLAY * //
	const biographyDisplayMenu = new Menu('Display');
	biographyDisplayMenu.addRadioItems(['Image + text', 'Image', 'Text'], pref.biographyDisplay, ['Image+text', 'Image', 'Text'], (display) => {
		pref.biographyDisplay = display;
		setBiographyDisplay();
		uiBio.updateProp(1);
	});
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addToggleItem('Filmstrip', pptBio, 'showFilmStrip', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addToggleItem('Seeker', pptBio, 'imgSeekerShow', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addToggleItem('Heading', pptBio, 'heading', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addToggleItem('Summary', pptBio, 'summaryShow', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addToggleItem(pptBio.summaryCompact ? 'Summary expand' : 'Summary compact', pptBio, 'summaryCompact', () => { uiBio.updateProp(1); });
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addRadioItems(['Artist view', 'Album view'], pptBio.artistView, [true, false], (view) => {
		pptBio.artistView = view;
		uiBio.updateProp(1);
	});
	biographyDisplayMenu.addSeparator();
	biographyDisplayMenu.addRadioItems(['Prefer now playing', 'Follow selected track (playlist)'], pptBio.focus, [false, true], (view) => {
		pptBio.focus = view;
		uiBio.updateProp(1);
	});
	biographyDisplayMenu.appendTo(biographyMenu);

	// * SOURCES * //
	const biographySourcesMenu = new Menu('Sources');
	const biographySourcesTextMenu = new Menu('Text');
	if (!pptBio.sourceAll) {
		biographySourcesTextMenu.addRadioItems(['Auto-fallback', 'Static'], pptBio.lockBio, [false, true], (source) => {
			pptBio.lockBio = source;
			if (pptBio.sourceAll) {
				pptBio.lockBio = false;
			} else {
				pptBio.lockRev = pptBio.lockBio;
			}
			uiBio.updateProp(1);
		}, !pptBio.sourceAll);
		biographySourcesTextMenu.addSeparator();
	}
	biographySourcesTextMenu.addToggleItem('Amalgamate', pptBio, 'sourceAll', () => {
		pptBio.lockBio = false;
		pptBio.lockRev = false;
		uiBio.updateProp(1);
	});
	biographySourcesTextMenu.addSeparator();
	biographySourcesTextMenu.addToggleItem('Prefer composition (allmusic && wikipedia review)', pptBio, 'classicalMusicMode', () => {
		cfg.classicalModeEnable = !cfg.classicalModeEnable;
		pptBio.classicalAlbFallback = pptBio.classicalMusicMode;
		uiBio.updateProp(1);
	});
	biographySourcesTextMenu.appendTo(biographySourcesMenu);

	biographySourcesMenu.createRadioSubMenu('Photo', ['Cycle from download folder', 'Cycle from custom folder [fallback to above]', 'Artist (single image [fb2k: display])'], pptBio.cycPhotoLocation, [0, 1, 2], (location) => {
		pptBio.cycPhotoLocation = location;
		if (location === 0) {
			pptBio.cycPhoto = true;
		}
		else if (location === 1 && !pptBio.get('Panel Biography - System: Photo Folder Checked', false)) {
			fb.ShowPopupMessage('Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.', 'Biography: custom folder for photo cycling');
			pptBio.set('Panel Biography - System: Photo Folder Checked', true);
			pptBio.cycPhoto = true;
			imgBio.artistReset();
		}
		else if (location === 2) {
			pptBio.cycPhoto = false;
		}
		imgBio.updImages();
	});

	const biographySourcesCoverMenu = new Menu('Cover');
	biographySourcesCoverMenu.addRadioItems(['Front', 'Back', 'Disc', 'Icon', 'Artist'], pptBio.covType, [0, 1, 2, 3, 4], (cycle) => {
		pptBio.covType = cycle;
		uiBio.updateProp(1);
	}, !pptBio.loadCovAllFb);
	biographySourcesCoverMenu.addSeparator();
	biographySourcesCoverMenu.addToggleItem('Cycle above', pptBio, 'loadCovAllFb', () => {
		uiBio.updateProp(1);
	});
	biographySourcesCoverMenu.addToggleItem('Cycle from download folder', pptBio, 'loadCovFolder', () => {
		pptBio.toggle(['cycPhoto', 'cycPhoto']);
		fb.ShowPopupMessage("Enter folder in options: \"Server Settings\"\\Cover\\Covers: cycle folder.\n\nDefault: artist photo folder.\n\nImages are updated when the album changes. Any images arriving after choosing the current album aren't included.", 'Biography: load folder for cover cycling');
		uiBio.updateProp(1);
	});
	biographySourcesCoverMenu.appendTo(biographySourcesMenu);

	const biographySourcesOpenFileLocationMenu = new Menu('Open file location');
	biographySourcesOpenFileLocationMenu.addItem('Image', false, () => {
		const imgInfo = imgBio.pth();
		menBio.path.img = imgInfo.imgPth;
		OpenExplorer(`explorer /select, "${menBio.path.img}"`, false);
	});
	biographySourcesOpenFileLocationMenu.addSeparator();
	if (txt.bio.am.length || txt.rev.am.length) {
		biographySourcesOpenFileLocationMenu.addItem(pptBio.artistView ? 'Biography [allmusic]' : 'Review [allmusic]', false, () => {
			menBio.path.am = pptBio.artistView ? txt.bioPth('Am') : txt.revPth('Am');
			OpenExplorer(`explorer /select, "${menBio.path.am[1]}"`, false);
		});
	}
	if (txt.bio.lfm.length || txt.rev.lfm.length) {
		biographySourcesOpenFileLocationMenu.addItem(pptBio.artistView ? 'Biography [last.fm]' : 'Review [last.fm]', false, () => {
			menBio.path.lfm = pptBio.artistView ? txt.bioPth('Lfm') : txt.revPth('Lfm');
			OpenExplorer(`explorer /select, "${menBio.path.lfm[1]}"`, false);
		});
	}
	if (txt.bio.wiki.length || txt.rev.wiki.length) {
		biographySourcesOpenFileLocationMenu.addItem(pptBio.artistView ? 'Biography [wikipedia]' : 'Review [wikipedia]', false, () => {
			menBio.path.wiki = pptBio.artistView ? txt.bioPth('Wiki') : txt.revPth('Wiki');
			OpenExplorer(`explorer /select, "${menBio.path.wiki[1]}"`, false);
		});
	}
	if (lyricsBio.lyrics.length) {
		biographySourcesOpenFileLocationMenu.addItem('Lyrics', false, () => {
			menBio.path.txt = pptBio.artistView ? txt.txtReaderPth() : txt.txtRevPth();
			OpenExplorer(`explorer /select, "${menBio.path.txt[1]}"`, false);
		});
	}
	biographySourcesMenu.addSeparator();
	biographySourcesOpenFileLocationMenu.appendTo(biographySourcesMenu);

	biographySourcesMenu.addItem('Force update', false, () => {
		panelBio.callServer(1, panelBio.id.focus, 'bio_forceUpdate', 0);
		uiBio.updateProp(1);
	});
	biographySourcesMenu.appendTo(biographyMenu);

	// * IMAGES * //
	const biographyImageMenu = new Menu('Image');
	const biographyImageDefaultMenu = new Menu('Image + text');
	biographyImageDefaultMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.artStyleDual, [0, 1, 2], (style) => {
		pptBio.artStyleDual = style;
		uiBio.updateProp(1);
	});
	biographyImageDefaultMenu.addToggleItem('Reflection', pptBio, 'artReflDual', () => { pptBio.artShadowDual = false; uiBio.updateProp(1); });
	biographyImageDefaultMenu.addToggleItem('Shadow', pptBio, 'artShadowDual', () => { pptBio.artReflDual = false; uiBio.updateProp(1); });
	biographyImageDefaultMenu.addSeparator();
	biographyImageDefaultMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.covStyleDual, [0, 1, 2], (style) => {
		pptBio.covStyleDual = style;
		uiBio.updateProp(1);
	});
	biographyImageDefaultMenu.addToggleItem('Reflection', pptBio, 'covReflDual', () => { pptBio.covShadowDual = false; uiBio.updateProp(1); });
	biographyImageDefaultMenu.addToggleItem('Shadow', pptBio, 'covShadowDual', () => { pptBio.covReflDual = false; uiBio.updateProp(1); });

	biographyImageDefaultMenu.appendTo(biographyImageMenu);
	const biographyImageOnlyMenu = new Menu('Image only');
	biographyImageOnlyMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.artStyleImgOnly, [0, 1, 2], (style) => {
		pptBio.artStyleImgOnly = style;
		uiBio.updateProp(1);
	});
	biographyImageOnlyMenu.addToggleItem('Reflection', pptBio, 'artReflImgOnly', () => { pptBio.artShadowImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.addToggleItem('Shadow', pptBio, 'artShadowImgOnly', () => { pptBio.artReflImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.addSeparator();
	biographyImageOnlyMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.covStyleImgOnly, [0, 1, 2], (style) => {
		pptBio.covStyleImgOnly = style;
		uiBio.updateProp(1);
	});
	biographyImageOnlyMenu.addToggleItem('Reflection', pptBio, 'covReflImgOnly', () => { pptBio.covShadowImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.addToggleItem('Shadow', pptBio, 'covShadowImgOnly', () => { pptBio.covReflImgOnly = false; uiBio.updateProp(1); });
	biographyImageOnlyMenu.appendTo(biographyImageMenu);

	const biographyImageFilmstripMenu = new Menu('Filmstrip');
	biographyImageFilmstripMenu.createRadioSubMenu('Photo', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.filmPhotoStyle, [0, 1, 2], (style) => {
		pptBio.filmPhotoStyle = style;
		uiBio.updateProp(1);
	});
	biographyImageFilmstripMenu.createRadioSubMenu('Cover', ['Regular', 'Auto-fill (default)', 'Circular'], pptBio.filmCoverStyle, [0, 1, 2], (style) => {
		pptBio.filmCoverStyle = style;
		uiBio.updateProp(1);
	});
	biographyImageFilmstripMenu.appendTo(biographyImageMenu);
	biographyImageMenu.addSeparator();

	const biographyImageDownloadMenu = new Menu('Downloads');
	biographyImageDownloadMenu.addRadioItems(['  5 Images', '10 Images (default)', '15 Images', '20 Images'], cfg.photoNum, [5, 10, 15, 20], (num) => {
		cfg.photoNum = num;
		uiBio.updateProp(1);
	});
	biographyImageDownloadMenu.appendTo(biographyImageMenu);
	biographyImageMenu.addSeparator();

	const biographyImageAutoCycleMenu = new Menu('Auto cycle');
	biographyImageAutoCycleMenu.addToggleItem('Auto cycle', pptBio, 'cycPic', () => { uiBio.updateProp(1); });
	biographyImageAutoCycleMenu.addSeparator();
	biographyImageAutoCycleMenu.addToggleItem('Smooth transition', pptBio, 'imgSmoothTrans', () => { uiBio.updateProp(1); });
	biographyImageAutoCycleMenu.addSeparator();
	biographyImageAutoCycleMenu.addRadioItems(['  5 sec', '10 sec', '15 sec (default)', '30 sec', '60 sec'], pptBio.cycTimePic, [5, 10, 15, 30, 60], (dur) => {
		pptBio.cycTimePic = dur;
		uiBio.updateProp(1);
	});
	biographyImageAutoCycleMenu.appendTo(biographyImageMenu);

	biographyImageMenu.appendTo(biographyMenu);

	if (!context_menu) biographyMenu.appendTo(menu);
}


////////////////////////
// * LYRICS OPTIONS * //
////////////////////////
/**
 * Top menu > Options > Lyrics.
 * @param {Menu} menu Creates the Lyrics panel menu via a new Menu instance.
 * @param {boolean} context_menu Appends Lyrics panel options to context menu.
 */
function lyricsOptions(menu, context_menu) {
	if (pref.layout === 'compact') return;
	const lyricsMenu = context_menu ? menu : new Menu('Lyrics');

	if (pref.layout === 'default') {
		lyricsMenu.createRadioSubMenu('Layout', ['Normal', 'Full'], pref.lyricsLayout, ['normal', 'full'], (width) => {
			pref.lyricsLayout = width;
			if (!pref.displayLyrics && pref.lyricsLayout === 'full' || noAlbumArtStub) {
				displayPlaylist = true;
				pref.displayLyrics = true;
				displayLibrary = false;
				displayBiography = false;
				lyricsLayoutFullWidth = pref.lyricsLayout === 'full';
			}
			if (pref.displayLyrics && pref.lyricsLayout === 'full') {
				displayPlaylist = false;
				pref.displayLyrics = true;
				lyricsLayoutFullWidth = pref.lyricsLayout === 'full';
			}
			playlist.on_size(ww, wh);
			initLyrics();
			on_playback_seek();
			resizeArtwork(true);
			initButtonState();
			repaintWindow();
		});
	}

	const lyricsDisplayMenu = new Menu('Display');
	lyricsDisplayMenu.createRadioSubMenu('Show drop shadow', ['None', 'Small', 'Normal', 'Large'], pref.lyricsDropShadowLevel, [0, 1, 2, 3], (size) => {
		pref.lyricsDropShadowLevel = size;
		initLyrics();
		repaintWindow();
	});
	lyricsDisplayMenu.addToggleItem('Show fade scroll', pref, 'lyricsFadeScroll', () => {
		initLyrics();
		repaintWindow();
	});
	lyricsDisplayMenu.addToggleItem('Show larger current sync', pref, 'lyricsLargerCurrentSync', () => {
		pptBio.largerSyncLyricLine = pref.lyricsLargerCurrentSync;
		initLyrics();
		uiBio.updateProp(1);
		repaintWindow();
	});
	lyricsDisplayMenu.addToggleItem('Show lyrics on album art', pref, 'lyricsAlbumArt', () => {
		initMainColors();
		repaintWindow();
	});
	lyricsDisplayMenu.appendTo(lyricsMenu);

	const lyricsControlsMenu = new Menu('Controls');
	lyricsControlsMenu.addToggleItem('Remember active lyrics state', pref, 'lyricsRememberActiveState', () => {
		if (pref.lyricsRememberActiveState) pref.displayLyrics = false;
	});
	lyricsControlsMenu.addToggleItem('Remember lyrics panel state', pref, 'lyricsRememberPanelState');
	lyricsControlsMenu.appendTo(lyricsMenu);

	const lyricsScrollSpeedMenu = new Menu('Scroll speed');
	lyricsScrollSpeedMenu.addRadioItems(['Fastest (very slow CPU)', 'Fast', 'Normal', 'Slow', 'Slowest (very fast CPU)'], pref.lyricsScrollSpeed, ['fastest', 'fast', 'normal', 'slow', 'slowest'], (speed) => {
		pref.lyricsScrollSpeed = speed;
		switch (speed) {
			case 'fastest':
				pref.lyricsScrollRateAvg = 300;
				pref.lyricsScrollRateMax = 150;
				break;
			case 'fast':
				pref.lyricsScrollRateAvg = 500;
				pref.lyricsScrollRateMax = 250;
				break;
			case 'normal':
				pref.lyricsScrollRateAvg = 750;
				pref.lyricsScrollRateMax = 375;
				break;
			case 'slow':
				pref.lyricsScrollRateAvg = 1000;
				pref.lyricsScrollRateMax = 500;
				break;
			case 'slowest':
				pref.lyricsScrollRateAvg = 1500;
				pref.lyricsScrollRateMax = 725;
				break;
		}
		initLyrics();
		repaintWindow();
	});
	lyricsScrollSpeedMenu.appendTo(lyricsMenu);
	lyricsMenu.addSeparator();

	lyricsMenu.addItem('Lyric information', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Lyric information'); });
	lyricsMenu.addItem('Lyric search', false, () => { fb.RunMainMenuCommand('View/ESLyric/Search...'); });
	lyricsMenu.addSeparator();
	lyricsMenu.addItem('Next lyric', false, () => { lyrics.nextLyrics(); });
	lyricsMenu.addItem('Edit lyric', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Edit lyric'); });
	lyricsMenu.addItem('Delete lyric', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Delete lyric'); });
	lyricsMenu.addSeparator();
	lyricsMenu.addItem('Save lyric to tags', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Save Lyric To/Tags'); });
	lyricsMenu.addSeparator();
	lyricsMenu.addItem('Open containing folder', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Open containing folder'); });

	if (!context_menu) lyricsMenu.appendTo(menu);
}


//////////////////////////
// * SETTINGS OPTIONS * //
//////////////////////////
/**
 * Top menu > Options > Settings.
 * @param {Menu} menu Creates the Settings menu via a new Menu instance.
 */
function settingsOptions(menu) {
	const settingsMenu = new Menu('Settings');

	// * THEME SANDBOX * //
	const themeSandboxMenu = new Menu('Theme sandbox');
	const restoreThemeStylePresetSettings = (reset) => {
		pref.presetAutoRandomMode = 'dblclick';
		setThemePresetSelection(true); // * Reactivate all
		resetTheme();
		if (reset) restoreThemeStylePreset(true); else restoreThemeStylePreset();
		if (pref.savedPreset !== false) setThemePreset(pref.savedPreset);
		updateStyle();
	}
	themeSandboxMenu.addToggleItem('Enabled', pref, 'themeSandbox', () => {
		if (!pref.themeSandbox) {
			const msg = 'Do you want to restore\nor keep current theme settings?\n\nThis will restore previously used\ntheme, styles, preset\nor use the current active.\n\nContinue?\n\n\n';
			const continue_confirmation = (status, confirmed) => {
				if (confirmed) {
					restoreThemeStylePresetSettings();
				} else {
					restoreThemeStylePresetSettings(true);
				}
			}
			if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Restore');
				fb.ShowPopupMessage('Theme settings restored:\n\nTheme, styles or preset have been restored.', 'Theme settings restored');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Restore', 'Keep', false, 'center', continue_confirmation);
			}
			return;
		}
		const msg = 'Do you want to activate the theme sandbox?\n\nThis mode is useful when trying out\nthemes, styles, presets or writing theme tags.\n\nAfter disabling the theme sandbox mode,\npreviously used theme settings can be restored.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) pref.themeSandbox = false;
		}
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
			fb.ShowPopupMessage('Theme sandbox mode activated:\n\nThis mode is useful when trying out\nthemes, styles, presets or writing theme tags.\n\nAfter disabling the theme sandbox mode,\npreviously used theme settings will be restored.', 'Theme sandbox mode');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeSandboxMenu.addSeparator();
	themeSandboxMenu.addItem('Restore theme settings', false, () => {
		const msg = 'Do you want to restore theme settings?\n\nThis will restore previously used\ntheme, styles, preset.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			restoreThemeStylePresetSettings();
		}
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
			fb.ShowPopupMessage('Theme settings restored:\n\nTheme, styles or preset have been restored.', 'Theme settings restored');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	}, pref.themeSandbox);
	themeSandboxMenu.appendTo(settingsMenu);

	// * THEME DAY/NIGHT MODE * //
	settingsMenu.createRadioSubMenu('Theme day/night mode', ['  Deactivated (default)', '  6am (day) -  6pm  (night)', '  7am (day) -  7pm  (night)', '  8am (day) -  8pm  (night)', '  9am (day) -  9pm  (night)', '10am (day) - 10pm (night)'], pref.themeDayNightMode, [false, 6, 7, 8, 9, 10], (time) => {
		pref.themeDayNightMode = time;
		if (!pref.themeDayNightMode) {
			pref.themeDayNightMode = false;
			clearInterval(themeDayNightModeTimer);
			themeDayNightModeTimer = null;
			return;
		}
		const msg = 'Do you want to activate the day/night mode?\n\nThis mode will only work for White, Black, Reborn and Random theme,\nall other themes plus special styles will not be supported.\n\nContinue?';
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				resetStyle('all');
				resetTheme();
				on_playback_new_track(fb.GetNowPlaying());
				themeDayNightMode(new Date());
				initThemePresetState();
				initThemeFull = true;
				initTheme();
			} else {
				pref.themeDayNightMode = false;
				if (pref.presetAutoRandomMode !== 'off') {
					pref.presetAutoRandomMode = 'dblclick';
					getRandomThemePreset();
				}
			}
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});

	// * THEME CACHE * //
	const themeCacheMenu = new Menu('Theme cache');
	const themeCacheLibraryMenu = new Menu('Library');
	themeCacheLibraryMenu.addToggleItem('Image disk cache enabled', ppt, 'albumArtDiskCache');
	themeCacheLibraryMenu.addToggleItem('Preload images in disk cache', ppt, 'albumArtPreLoad');
	themeCacheLibraryMenu.addToggleItem('Use custom library directory', pref, 'customLibraryDir', () => {
		if (pref.customLibraryDir) inputBox('customLibraryDir');
		window.Reload();
	});
	themeCacheLibraryMenu.addSeparator();
	themeCacheLibraryMenu.addItem('Open library cache directory', false, () => {
		const cacheDir = pref.customLibraryDir ? globals.customLibraryDir : `${fb.ProfilePath}cache\\library\\library-tree-cache`;
		try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
		OpenExplorer(`explorer /open, "${cacheDir}"`, false);
	});
	themeCacheLibraryMenu.addItem('Delete library cache', false, () => {
		const msg = 'Do you want to delete the library cache?\n\nThis will permanently delete cached library album art thumbnails.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) deleteLibraryCache();
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeCacheLibraryMenu.addSeparator();
	themeCacheLibraryMenu.addToggleItem('Auto-delete library cache on startup', pref, 'libraryAutoDelete', () => {
		const msg = 'Do you want to set auto-delete for library cache?\n\nThis will always auto-delete cached library album art thumbnails on startup.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			pref.libraryAutoDelete = confirmed;
		};
		if (pref.libraryAutoDelete) {
			if (detectWine || !detectIE) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		}
	});
	themeCacheLibraryMenu.appendTo(themeCacheMenu);

	const themeCacheBiographyMenu = new Menu('Biography');
	themeCacheBiographyMenu.addToggleItem('Use custom biography directory', pref, 'customBiographyDir', () => {
		if (pref.customBiographyDir) {
			inputBox('customBiographyDir');
			const bioCfg = new SettingsBio();
			bioCfg.resetCfg();
		}
		window.Reload();
	});
	themeCacheBiographyMenu.addSeparator();
	themeCacheBiographyMenu.addItem('Open biography cache directory', false, () => {
		const cacheDir = pref.customBiographyDir ? globals.customBiographyDir : `${fb.ProfilePath}cache\\biography\\biography-cache`;
		try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
		OpenExplorer(`explorer /open, "${cacheDir}"`, false);
	});
	themeCacheBiographyMenu.addItem('Delete biography cache', false, () => {
		const msg = 'Do you want to delete the biography cache?\n\nThis will permanently delete downloaded biography images and text files\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) deleteBiographyCache();
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeCacheBiographyMenu.addSeparator();
	themeCacheBiographyMenu.addToggleItem('Auto-delete biography cache on startup', pref, 'biographyAutoDelete', () => {
		const msg = 'Do you want to set auto-delete for biography cache?\n\nThis will always auto-delete downloaded biography images\nand text on startup\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			pref.biographyAutoDelete = confirmed;
		};
		if (pref.biographyAutoDelete) {
			if (detectWine || !detectIE) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		}
	});
	themeCacheBiographyMenu.appendTo(themeCacheMenu);

	const themeCacheLyricsMenu = new Menu('Lyrics');
	themeCacheLyricsMenu.addToggleItem('Use custom lyrics directory', pref, 'customLyricsDir', () => {
		if (pref.customLyricsDir) inputBox('customLyricsDir');
		window.Reload();
	});
	themeCacheLyricsMenu.addSeparator();
	themeCacheLyricsMenu.addItem('Open lyrics directory', false, () => {
		const cacheDir = pref.customLyricsDir ? globals.customLyricsDir : `${fb.ProfilePath}cache\\lyrics`;
		try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
		OpenExplorer(`explorer /open, "${cacheDir}"`, false);
	});
	themeCacheLyricsMenu.addItem('Delete lyrics', false, () => {
		const msg = 'Do you want to delete all lyrics?\n\nThis will permanently delete downloaded lyrics.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) deleteLyrics();
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeCacheLyricsMenu.addSeparator();
	themeCacheLyricsMenu.addToggleItem('Auto-delete lyrics on startup', pref, 'lyricsAutoDelete', () => {
		const msg = 'Do you want to set auto-delete for lyrics?\n\nThis will always auto-delete downloaded lyrics on startup.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			pref.lyricsAutoDelete = confirmed;
		};
		if (pref.lyricsAutoDelete) {
			if (detectWine || !detectIE) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		}
	});
	themeCacheLyricsMenu.appendTo(themeCacheMenu);

	const themeCacheWaveformBarMenu = new Menu('Waveform bar');
	themeCacheWaveformBarMenu.addToggleItem('Use custom waveform bar directory', pref, 'customWaveformBarDir', () => {
		if (pref.customWaveformBarDir) inputBox('customWaveformBarDir');
		window.Reload();
	});
	themeCacheWaveformBarMenu.addSeparator();
	themeCacheWaveformBarMenu.addItem('Open waveform bar cache directory', false, () => {
		const cacheDir = pref.customWaveformBarDir ? globals.customWaveformBarDir : `${fb.ProfilePath}cache\\waveform`;
		try { if (!IsFolder(cacheDir)) CreateFolder(cacheDir); } catch (e) {}
		OpenExplorer(`explorer /open, "${cacheDir}"`, false);
	});
	themeCacheWaveformBarMenu.addItem('Delete waveform bar cache', false, () => {
		const msg = 'Do you want to delete all waveform bar cache?\n\nThis will permanently delete analyzed files.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) deleteWaveformBarCache();
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});

	themeCacheWaveformBarMenu.addToggleItem('Auto-delete waveform bar cache on startup', pref, 'waveformBarAutoDelete', () => {
		const msg = 'Do you want to set auto-delete for waveform bar?\n\nThis will always auto-delete waveform bar cache on startup.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			pref.waveformBarAutoDelete = confirmed;
		};
		if (pref.waveformBarAutoDelete) {
			if (detectWine || !detectIE) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		}
	});
	themeCacheWaveformBarMenu.appendTo(themeCacheMenu);
	themeCacheMenu.appendTo(settingsMenu);

	// * THEME FONTS * //
	const themeFontMenu = new Menu('Theme fonts');
	themeFontMenu.addToggleItem('Use custom theme fonts', pref, 'customThemeFonts', () => {
		const msg = 'Do you want to use custom theme fonts?\n\nYou need to set your custom fonts in your config file located in\nfoobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			pref.customThemeFonts = confirmed;
		};
		if (pref.customThemeFonts) {
			if (detectWine || !detectIE) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
				continue_confirmation(false, 'Yes');
			} else {
				popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
			}
		}
		window.Reload();
	});
	themeFontMenu.appendTo(settingsMenu);

	// * THEME BACKUP * //
	const themeBackupMenu = new Menu('Theme backup');
	themeBackupMenu.addItem('Make backup', false, () => {
		const msg = `Do you want to make a backup of the theme?\n\nThis will create a backup in ${fb.ProfilePath}backup\n\nOn new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\nIf a backup already exist, you can use\nOptions > Settings > Theme backup > Restore backup\n\nContinue?\n\n\n`;
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			manageBackup(true);
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
			fb.ShowPopupMessage(`You can find the Georgia-ReBORN theme backup in ${fb.ProfilePath}backup\n\nOn new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\nIf a backup already exist, you can use\nOptions > Settings > Theme backup > Restore backup`, 'Theme backup');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});

	themeBackupMenu.addItem('Restore backup', false, () => {
		const msg = `Do you want to restore your backup of the theme?\n\n>>> WARNING <<<\n\nThis will restore your backup from ${fb.ProfilePath}\n\nChanges and modifications since your last backup\n(new theme settings, new playlists and play statistics)\nwill be lost!\n\nIt is recommended to make a new backup\nbefore you restore.\n\nContinue?\n\n\n`;
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			manageBackup(false, true);
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeBackupMenu.appendTo(settingsMenu);

	// * THEME CONFIGURATION * //
	const themeConfigMenu = new Menu('Theme configuration');
	themeConfigMenu.addItem('Save settings to config file', false, () => {
		const msg = 'Do you want to save all current theme settings?\n\nThis will overwrite all settings from the top menu "Options"\nin the georgia-reborn-config.jsonc file.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			const start = async () => {
				await setThemeSettings(true);
				await window.Reload();
			};
			start();
			console.log(`\n>>> Georgia-ReBORN theme settings have been successfully saved in ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc <<<\n\n`);
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.addItem('Load settings from config file', false, () => {
		const msg = 'Do you want to load all theme settings\nfrom the georgia-reborn-config.jsonc file?\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			const start = async () => {
				pref.customThemeSettings = true;
				await setThemeSettings();
				await window.Reload();
			};
			start();
			console.log(`\n>>> Georgia-ReBORN theme settings have been successfully loaded from ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc <<<\n\n`);
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.addSeparator();
	themeConfigMenu.addItem('Load default settings', false, () => {
		const msg = 'Do you want to load default theme settings?\n\nThis will not overwrite the georgia-reborn-config.jsonc file,\nbut you should probably first save your settings.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			const start = async () => {
				pref.customThemeSettings = false;
				await setThemeSettings();
				await display.autoDetectRes();
				await window.Reload();
			};
			start();
			console.log('\n>>> Default Georgia-ReBORN theme settings have been successfully loaded <<<\n\n');
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.addSeparator();
	themeConfigMenu.addItem('Edit main configuration file', false, () => {
		try {
			OpenFile(`${config.getPath()}`);
		} catch (e) {
			OpenExplorer(`explorer /select, "${config.getPath()}"`, false);
		}
	});
	themeConfigMenu.addItem('Edit custom configuration file', false, () => {
		try {
			OpenFile(`${configCustom.getPath()}`);
		} catch (e) {
			OpenExplorer(`explorer /select, "${configCustom.getPath()}"`, false);
		}
	});
	themeConfigMenu.addSeparator();
	themeConfigMenu.addItem('Reset main configuration file', false, () => {
		const msg = 'Do you want to reset the config file to default?\n\n!!! WARNING !!!\n\nThis will set all settings to default.\nYou should probably make a backup first.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			try { // Needed to prevent crash when there is no config file
				pref.customThemeSettings = false;
				config.resetConfiguration();
				setThemeSettings();
				display.layoutDefault();
				console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc file has been successfully reset to default. <<<\n\n`);
			} catch (e) { window.Reload(); }
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.addItem('Reset custom configuration file', false, () => {
		const msg = 'Do you want to reset the custom config file to default?\n\n!!! WARNING !!!\n\nThis will delete and replace all custom themes\nto the default custom theme template.\nYou should definitely make a backup first.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			try { // Needed to prevent crash when there is no config file
				pref.customThemeSettings = false;
				configCustom.resetConfiguration();
				console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc file has been successfully reset to default. <<<\n\n`);
			} catch (e) { window.Reload(); }
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.addSeparator();
	themeConfigMenu.addItem('Reset all', false, () => {
		const msg = 'Do you want to reset all theme settings to default?\n\nThis will also clear all library custom views plus filters\nand Georgia-ReBORN config.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			pref.customThemeSettings = false;
			pref.systemFirstLaunch = true; // Reset Georgia-ReBORN theme settings
			try { // Needed to prevent crash when there is no config file
				fso.DeleteFile(`${fb.ProfilePath}configuration\\foo_ui_columns.dll.cfg`);
				config.resetConfiguration(); // Reset Georgia-ReBORN config file
				panel.updateProp(ppt, 'default_value'); // Reset Library settings
				uiBio.updateProp(pptBio, 'default_value'); // Reset Biography settings
				const serverBio = new SettingsBio();
				serverBio.resetCfg(); // Reset Biography server settings
				console.log('\n>>> Georgia-ReBORN has been successfully reset <<<\n\n');
			} catch (e) {
				fb.ShowPopupMessage('Something went wrong and Georgia-ReBORN has NOT been successfully reset, try again!', 'Resetting Georgia-ReBORN');
			}
		};
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.appendTo(settingsMenu);

	// * THEME PERFORMANCE * //
	settingsMenu.createRadioSubMenu('Theme performance', ['Lowest quality (fastest speed - very slow CPU)', 'Low quality', 'Balanced (Default)', 'High quality', 'Highest quality (slowest speed - very fast CPU)'], pref.themePerformance,
		['lowestQuality', 'lowQuality', 'balanced', 'highQuality', 'highestQuality'], (perf) => {
		const msg = 'Do you want to change the theme performance?\n\nThese presets will change various theme settings!\nIt is recommended to save current theme settings\nto the config file. You should also make a backup\nof your playlists to be on the safe side!\n\n!!! WARNING !!!\n"High quality" and especially "Highest Quality"\ncan freeze foobar, depending how fast your CPU performs.\nIt does not matter if you are using a multi-core CPU,\nonly single-core CPU performance counts!\nIf your foobar is unresponsive, restart\nand change to a lighter preset.\n\nContinue?';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			pref.themePerformance = perf;
			setThemePerformance('balanced'); // First reset
			setThemePerformance(pref.themePerformance); // Then set
			window.Reload();
		}
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
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

			deviceList.forEach((array, i) => {
				menu.AppendMenuItem(MF_STRING, i + 1, array.name);
				if (array.active) active = i;
			});
			menu.AppendMenuSeparator();
			menu.AppendMenuItem(MF_STRING, last, 'Preferences...');

			if (active > -1) menu.CheckMenuRadioItem(1, last, active + 1);
			const idx = menu.TrackPopupMenu(x, y);
			if (idx > 0 && idx < last) fb.RunMainMenuCommand(`Playback/Device/${deviceList[idx - 1].name}`);
			else if (idx === last) fb.RunMainMenuCommand('Playback/Device/Preferences...');
		};
		outputDeviceMenu(state.mouse_x, state.mouse_y);
	});

	settingsMenu.addSeparator();
	settingsMenu.addToggleItem('Developer tools', pref, 'devTools', () => { pref.disableRightClick = !pref.devTools; });
	settingsMenu.addSeparator();
	settingsMenu.addToggleItem('Disable right-click', pref, 'disableRightClick');

	settingsMenu.appendTo(menu);
}


/////////////////////////////////
// * DEVELOPER TOOLS OPTIONS * //
/////////////////////////////////
/**
 * Top menu > Options > Developer tools.
 * @param {Menu} menu Creates Developer tools menu via a new Menu instance.
 */
function developerToolsOptions(menu) {
	if (!pref.devTools) return;
	const debugMenu = new Menu('Developer tools');

	debugMenu.addItem('Console', false, () => { fb.RunMainMenuCommand('View/Console'); }); // Top menu 'View' does not exist in Artwork/Compact layout
	debugMenu.addSeparator();
	debugMenu.addToggleItem('Enable double click refresh', settings, 'doubleClickRefresh');
	debugMenu.addToggleItem('Enable debug output', settings, 'showDebugLog');
	debugMenu.addItem('Enable theme debug output', settings.showThemeLog, () => {
		settings.showThemeLog = !settings.showThemeLog;
		if (settings.showThemeLog) {
			albumArt = null;
			on_playback_new_track(fb.GetNowPlaying());
		}
	});
	debugMenu.addItem('Enable theme debug overlay', settings.showThemeLogOverlay, () => {
		settings.showThemeLogOverlay = !settings.showThemeLogOverlay;
		if (settings.showThemeLogOverlay) {
			albumArt = null;
			on_playback_new_track(fb.GetNowPlaying());
		} else {
			repaintWindow();
		}
	});
	debugMenu.addSeparator();
	debugMenu.addToggleItem('Show draw timing', timings, 'showDrawTiming');
	debugMenu.addToggleItem('Show extra draw timing', timings, 'showExtraDrawTiming');
	debugMenu.addToggleItem('Show debug timing', timings, 'showDebugTiming');
	debugMenu.addSeparator();
	debugMenu.addToggleItem('Show ram usage', timings, 'showRamUsage');
	debugMenu.addToggleItem('Show draw areas', timings, 'drawRepaintRects', () => {
		if (timings.drawRepaintRects) {
			repaintRectAreas();
		} else {
			repaintWindow();
		}
	});
	debugMenu.addSeparator();
	debugMenu.addToggleItem('Show panel calls', timings, 'showPanelTraceCall', () => {
		if (timings.showPanelTraceCall) {
			trace_call = true;
		} else {
			trace_call = false;
			if (timings.showPanelTraceOnMove) {
				trace_on_move = false;
				timings.showPanelTraceOnMove = false;
			}
		}
	});
	debugMenu.addToggleItem('Show panel moves', timings, 'showPanelTraceOnMove', () => {
		if (timings.showPanelTraceOnMove) {
			trace_on_move = true;
			trace_call = true;
			timings.showPanelTraceCall = true;
			return;
		}
		trace_on_move = false;
		trace_call = false;
		timings.showPanelTraceCall = false;
	});
	debugMenu.addToggleItem('Show playlist performance', timings, 'showPlaylistTraceListPerf', () => {
		trace_initialize_list_performance = !trace_initialize_list_performance;
	});
	debugMenu.addSeparator();
	debugMenu.addItem('Set system first launch to true', false, () => { // Used when creating new config files
		const msg = 'Do you really want to set system to first launch?\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			window.SetProperty('Georgia-ReBORN - 16. System: System first launch', true);
			g_properties.show_scrollbar = false;
			pref.showTopMenuCompact = true;
			pref.devTools = false;
			pref.disableRightClick = true;
			console.log('\n>>> Georgia-ReBORN has been set to system first launch <<<\n\n');
		}
		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});

	debugMenu.appendTo(menu);
}


///////////////////
// * INPUT BOX * //
///////////////////
/**
 * An input box that is used for various custom user settings.
 * @param {string} option The parameter has following options:
 * - 'renameCustomTheme' - renames the name of the custom theme.
 * - 'playlistCustomHeaderInfo' - sets custom playlist header info via pattern.
 * - 'playlistCustomTrackRow' - sets custom playlist track row via pattern.
 * - 'playlistSortCustom' - sets custom playlist sort order via pattern.
 * - 'customLibraryDir' - sets the custom Library cache directory.
 * - 'customBiographyDir' - sets the custom Biography cache directory.
 * - 'customLyricsDir' - sets the custom Lyrics cache directory.
 * - 'customWaveformBarDir' - sets the custom Waveform bar cache directory.
 * @return {*} The input box.
 */
function inputBox(option) {
	const customTheme =
		pref.theme === 'custom01' ? 'customTheme01' :
		pref.theme === 'custom02' ? 'customTheme02' :
		pref.theme === 'custom03' ? 'customTheme03' :
		pref.theme === 'custom04' ? 'customTheme04' :
		pref.theme === 'custom05' ? 'customTheme05' :
		pref.theme === 'custom06' ? 'customTheme06' :
		pref.theme === 'custom07' ? 'customTheme07' :
		pref.theme === 'custom08' ? 'customTheme08' :
		pref.theme === 'custom09' ? 'customTheme09' :
		pref.theme === 'custom10' ? 'customTheme10' : '';

	const customThemeName =
		pref.theme === 'custom01' ? customTheme01 :
		pref.theme === 'custom02' ? customTheme02 :
		pref.theme === 'custom03' ? customTheme03 :
		pref.theme === 'custom04' ? customTheme04 :
		pref.theme === 'custom05' ? customTheme05 :
		pref.theme === 'custom06' ? customTheme06 :
		pref.theme === 'custom07' ? customTheme07 :
		pref.theme === 'custom08' ? customTheme08 :
		pref.theme === 'custom09' ? customTheme09 :
		pref.theme === 'custom10' ? customTheme10 : '';

	const customLibraryDir     = option === 'customLibraryDir';
	const customBiographyDir   = option === 'customBiographyDir';
	const customLyricsDir      = option === 'customLyricsDir';
	const customWaveformBarDir = option === 'customWaveformBarDir';
	const customDirPath        = customLibraryDir ? globals.customLibraryDir : customBiographyDir ? globals.customBiographyDir : customLyricsDir ? globals.customLyricsDir : customWaveformBarDir ? globals.customWaveformBarDir : '';
	const customDirString      = customLibraryDir ? 'library' : customBiographyDir ? 'biography' : customLyricsDir ? 'lyrics' : customWaveformBarDir ? 'waveform' : '';
	const customDirSchema      = customLibraryDir ? customLibraryDirSchema : customBiographyDir ? customBiographyDirSchema : customLyricsDir ? customLyricsDirSchema : customWaveformBarDir ? customWaveformBarDirSchema : '';

	switch (option) {
		case 'renameCustomTheme':
		{
			let newVal;
			let input;
			try {
				input = utils.InputBox(window.ID, 'Enter your desired name for your current active custom theme', 'Georgia-ReBORN', customThemeName.name, true);
				newVal = !input || typeof input !== 'string' && !input.length ? '' : JSON.parse(`"${input}"`);
				if (typeof newVal !== 'string') throw new Error('Invalid type');
			}
			catch (e) {
				if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
					fb.ShowPopupMessage(`Name is not valid:\n${input}\n\nSomething went wrong...`, 'Custom theme name');
				}
				return;
			}
			customThemeName.name = newVal;
			configCustom.updateConfigObjValues(customTheme, true);
		}
		break;

		case 'playlistCustomHeaderInfo':
		{
			const oldValStr = JSON.stringify(settings.playlistCustomHeaderInfo).replace(/"/g, '');
			let newVal;
			let input;
			try {
				input = utils.InputBox(window.ID, 'Enter your custom playlist header info pattern:', 'Georgia-ReBORN', oldValStr, true);
				newVal = !input || typeof input !== 'string' && !input.length ? '' : JSON.parse(`"${input}"`);
				if (typeof newVal !== 'string') throw new Error('Invalid type');
			}
			catch (e) {
				if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
					fb.ShowPopupMessage(`Pattern is not valid:\n${input}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExamples of correct patterns:\n\n%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%`, 'Custom playlist header info');
				}
				return;
			}
			settings.playlistCustomHeaderInfo = newVal;
			config.updateConfigObjValues('settings', true);
		}
		break;

		case 'playlistCustomTrackRow':
		{
			const oldValStr1 = JSON.stringify(settings.playlistCustomTitle).replace(/"/g, '');
			const oldValStr2 = JSON.stringify(settings.playlistCustomTitleNoHeader).replace(/"/g, '');
			let newVal1;
			let newVal2;
			let input1;
			let input2;
			try {
				input1 = utils.InputBox(window.ID, 'Enter your custom playlist track row pattern:', 'Georgia-ReBORN', oldValStr1, true);
				input2 = utils.InputBox(window.ID, 'Enter your custom playlist track row pattern when no header displayed:', 'Georgia-ReBORN', oldValStr2, true);
				newVal1 = !input1 || typeof input1 !== 'string' && !input1.length ? '' : JSON.parse(`"${input1}"`);
				newVal2 = !input2 || typeof input2 !== 'string' && !input2.length ? '' : JSON.parse(`"${input2}"`);
				if (typeof newVal1 !== 'string') throw new Error('Invalid type');
				if (typeof newVal2 !== 'string') throw new Error('Invalid type');
			}
			catch (e) {
				if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
					fb.ShowPopupMessage(`Pattern is not valid:\n${input1 || input2}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExamples of correct patterns:\n\n%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%`, 'Custom playlist track row');
				}
				return;
			}
			settings.playlistCustomTitle = newVal1;
			settings.playlistCustomTitleNoHeader = newVal2;
			config.updateConfigObjValues('settings', true);
		}
		break;

		case 'playlistSortCustom':
		{
			const oldValStr = JSON.stringify(settings.playlistSortCustom).replace(/"/g, '');
			let newVal;
			let input;
			try {
				input = utils.InputBox(window.ID, 'Enter your custom playlist order pattern:', 'Georgia-ReBORN', oldValStr, true);
				newVal = !input || typeof input !== 'string' && !input.length ? '' : JSON.parse(`"${input}"`);
				if (typeof newVal !== 'string') throw new Error('Invalid type');
			}
			catch (e) {
				if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
					fb.ShowPopupMessage(`Pattern is not valid:\n${input}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExamples of correct patterns:\n\n%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%`, 'Custom playlist order');
				}
				return;
			}
			settings.playlistSortCustom = newVal;
			config.updateConfigObjValues('settings', true);
		}
		break;

		case 'customLibraryDir': case 'customBiographyDir': case 'customLyricsDir': case 'customWaveformBarDir':
			{
				const oldValStr = JSON.stringify(customDirPath).replace(/["[\]]/g, '').replace(/\\\\/g, '\\');
				let newVal;
				let input;
				try {
					input = utils.InputBox(window.ID, `Enter your custom ${customDirString} directory:`, 'Georgia-ReBORN', oldValStr, true);
					newVal = !input || typeof input !== 'string' && !input.length ? '' : JSON.parse(`"${input.replace(/[\\/]/g, '\\\\')}"`);
					if (typeof newVal !== 'string') throw new Error('Invalid type');
				}
				catch (e) {
					if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
						fb.ShowPopupMessage(`Path is not valid:\n${input}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExample of a correct path:\n\nD:\\Stuff\\Directory\\`, `Custom ${customDirString} directory`);
					}
					return;
				}
				configCustom.addConfigurationObject(customDirSchema, [newVal]);
				configCustom.writeConfiguration();
			}
			break;
	}
}
