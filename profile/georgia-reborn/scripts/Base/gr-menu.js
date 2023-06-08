/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Menu                                 * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-03                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////
// * RATING MENU * //
/////////////////////
function onRatingMenu(x, y) {
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


//////////////////////////
// * TOP MENU OPTIONS * //
//////////////////////////
function onOptionsMenu(x, y, context_menu, playlist, details, library, biography, lyrics) {
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
function themeOptions(menu) {
	const themeMenu = new Menu('Theme');
	themeMenu.addRadioItems(['White', 'Black', 'Reborn', 'Random'], pref.theme, ['white', 'black', 'reborn', 'random'], (theme) => {
		pref.theme = theme;
		resetTheme();
		initTheme();
		initThemePresetState();
	});
	themeMenu.addSeparator();
	themeMenu.addRadioItems(['Blue', 'Dark blue', 'Red', 'Cream'], pref.theme, ['blue', 'darkblue', 'red', 'cream'], (theme) => {
		pref.theme = theme;
		resetTheme();
		initTheme();
		initThemePresetState();
	});
	themeMenu.addSeparator();
	themeMenu.addRadioItems(['Neon blue', 'Neon green', 'Neon red', 'Neon gold'], pref.theme, ['nblue', 'ngreen', 'nred', 'ngold'], (theme) => {
		pref.theme = theme;
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
		customTheme10.name === '' ? 'Theme 10' : customTheme10.name];

	customThemeMenu.addRadioItems(customThemes, pref.theme, ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'], (theme) => {
		pref.theme = theme;
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
function styleOptions(menu) {
	const styleMenu = new Menu('Style');
	// * STYLES * //
	styleMenu.addToggleItem('Default', pref, 'styleDefault', () => {
		pref.preset = false;
		resetStyle('all');
		resetTheme();
		initTheme();
	});
	styleMenu.addSeparator();
	styleMenu.addToggleItem('Bevel', pref, 'styleBevel', () => {
		updateStyle();
	});
	styleMenu.addSeparator();

	// * STYLES - GROUP ONE * //
	styleMenu.addToggleItem('Blend', pref, 'styleBlend', () => {
		setStyle('blend', pref.styleBlend);
		updateStyle();
	});
	styleMenu.addToggleItem('Blend 2', pref, 'styleBlend2', () => {
		setStyle('blend2', pref.styleBlend2);
		updateStyle();
	});
	if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
		styleMenu.addToggleItem('Gradient', pref, 'styleGradient', () => {
			setStyle('gradient', pref.styleGradient);
			updateStyle();
		}, pref.styleRebornWhite);
	}
	if (['reborn', 'random', 'blue', 'darkblue', 'red', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
		styleMenu.addToggleItem('Gradient 2', pref, 'styleGradient2', () => {
			setStyle('gradient2', pref.styleGradient);
			updateStyle();
		}, pref.styleRebornWhite);
	}
	styleMenu.addSeparator();

	// * STYLES - GROUP TWO * //
	styleMenu.addToggleItem('Alternative', pref, 'styleAlternative', () => {
		setStyle('alternative', pref.styleAlternative);
		updateStyle();
	});
	styleMenu.addToggleItem('Alternative 2', pref, 'styleAlternative2', () => {
		setStyle('alternative2', pref.styleAlternative2);
		updateStyle();
	});
	if (pref.theme === 'white') {
		styleMenu.addToggleItem('Black and white', pref, 'styleBlackAndWhite', () => {
			setStyle('blackAndWhite', pref.styleBlackAndWhite);
			updateStyle();
		}, pref.styleBlackAndWhiteReborn);
		styleMenu.addToggleItem('Black and white 2', pref, 'styleBlackAndWhite2', () => {
			setStyle('blackAndWhite2', pref.styleBlackAndWhite2);
			updateStyle();
		}, pref.styleBlackAndWhiteReborn);
		styleMenu.addToggleItem('Black and white reborn', pref, 'styleBlackAndWhiteReborn', () => {
			setStyle('blackAndWhiteReborn', pref.styleBlackAndWhiteReborn);
			updateStyle();
		});
	}
	if (pref.theme === 'black') {
		styleMenu.addToggleItem('Black reborn', pref, 'styleBlackReborn', () => {
			setStyle('blackReborn', pref.styleBlackReborn);
			updateStyle();
		});
	}
	if (pref.theme === 'reborn') {
		styleMenu.addToggleItem('Reborn white', pref, 'styleRebornWhite', () => {
			setStyle('rebornWhite', pref.styleRebornWhite);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn black', pref, 'styleRebornBlack', () => {
			setStyle('rebornBlack', pref.styleRebornBlack);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn fusion', pref, 'styleRebornFusion', () => {
			setStyle('rebornFusion', pref.styleRebornFusion);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn fusion 2', pref, 'styleRebornFusion2', () => {
			setStyle('rebornFusion2', pref.styleRebornFusion2);
			updateStyle();
		});
		styleMenu.addToggleItem('Reborn fusion accent', pref, 'styleRebornFusionAccent', () => {
			setStyle('rebornFusionAccent', pref.styleRebornFusionAccent);
			updateStyle();
		});
	}
	if (pref.theme === 'random') {
		styleMenu.addToggleItem('Random pastel', pref, 'styleRandomPastel', () => {
			setStyle('randomPastel', pref.styleRandomPastel);
			updateStyle();
		});
		styleMenu.addToggleItem('Random dark', pref, 'styleRandomDark', () => {
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
			pref.styleRandomAutoColor = timer;
			randomThemeAutoColor();
		});
		styleAutoColorMenu.appendTo(styleMenu);
		styleMenu.addSeparator();
	}

	// * STYLES - BUTTONS * //
	const styleButtonsMenu = new Menu('Buttons');
	const styleTopButtonsMenu = new Menu('Top menu');
	styleTopButtonsMenu.addRadioItems(['Default', 'Filled', 'Bevel', 'Inner', 'Emboss', 'Minimal'], pref.styleTopMenuButtons, ['default', 'filled', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
		pref.styleTopMenuButtons = style;
		updateStyle();
	});
	styleTopButtonsMenu.appendTo(styleButtonsMenu);
	const styleTransportButtonsMenu = new Menu('Transport');
	styleTransportButtonsMenu.addRadioItems(['Default', 'Bevel', 'Inner', 'Emboss', 'Minimal'], pref.styleTransportButtons, ['default', 'bevel', 'inner', 'emboss', 'minimal'], (style) => {
		pref.styleTransportButtons = style;
		updateStyle();
	});
	styleTransportButtonsMenu.appendTo(styleButtonsMenu);
	styleButtonsMenu.appendTo(styleMenu);

	// * STYLES - PROGRESS BAR * //
	const styleProgressBarMenu = new Menu('Progress bar');
	styleProgressBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded', 'Lines', 'Blocks', 'Dots', 'Thin'], pref.styleProgressBarDesign, ['default', 'rounded', 'lines', 'blocks', 'dots', 'thin'], (design) => {
		pref.styleProgressBarDesign = design;
		updateStyle();
	});
	styleProgressBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], pref.styleProgressBar, ['default', 'bevel', 'inner'], (style) => {
		pref.styleProgressBar = style;
		updateStyle();
	});
	styleProgressBarMenu.createRadioSubMenu('Progress fill', ['Default', 'Bevel', 'Inner', 'Blend'], pref.styleProgressBarFill, ['default', 'bevel', 'inner', 'blend'], (style) => {
		pref.styleProgressBarFill = style;
		updateStyle();
	});
	styleProgressBarMenu.appendTo(styleMenu);

	// * STYLES - VOLUME BAR * //
	const styleVolumeBarMenu = new Menu('Volume bar');
	styleVolumeBarMenu.createRadioSubMenu('Design', ['Default', 'Rounded'], pref.styleVolumeBarDesign, ['default', 'rounded'], (design) => {
		pref.styleVolumeBarDesign = design;
		updateStyle();
	});
	styleVolumeBarMenu.createRadioSubMenu('Background', ['Default', 'Bevel', 'Inner'], pref.styleVolumeBar, ['default', 'bevel', 'inner'], (style) => {
		pref.styleVolumeBar = style;
		updateStyle();
	});
	styleVolumeBarMenu.createRadioSubMenu('Volume fill', ['Default', 'Bevel', 'Inner'], pref.styleVolumeBarFill, ['default', 'bevel', 'inner'], (style) => {
		pref.styleVolumeBarFill = style;
		updateStyle();
	});
	styleVolumeBarMenu.appendTo(styleMenu);

	styleMenu.appendTo(menu, pref.presetSelectMode === 'harmonic');
}


////////////////////////
// * PRESET OPTIONS * //
////////////////////////
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
					themePresetRandomPicker();
				}
				if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
					themePresetRandomPicker();
				}
				if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
					themePresetRandomPicker();
				}
				if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		switch (preset) {
			case 'whiteP01': resetStyle('all'); whiteP01(); updateStyle(); break; // * Beveled
			case 'whiteP02': resetStyle('all'); whiteP02(); updateStyle(); break; // * Black and white
			case 'whiteP03': resetStyle('all'); whiteP03(); updateStyle(); break; // * Black and white blended
			case 'whiteP04': resetStyle('all'); whiteP04(); updateStyle(); break; // * Black and white 2
			case 'whiteP05': resetStyle('all'); whiteP05(); updateStyle(); break; // * Black and white 2 blended
			case 'whiteP06': resetStyle('all'); whiteP06(); updateStyle(); break; // * Black and white reborn
			case 'whiteP07': resetStyle('all'); whiteP07(); updateStyle(); break; // * Black and white reborn blended
			case 'whiteP08': resetStyle('all'); whiteP08(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsWhiteMenu.appendTo(themePresetsMenu);

	// * BLACK THEME PRESETS * //
	const themePresetsBlackMenu = new Menu('Black');
	themePresetsBlackMenu.addRadioItems(['Beveled', 'Blended', 'Blended alternative', 'Blended alternative 2', 'Black reborn', 'Black reborn blended', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['blackP01', 'blackP02', 'blackP03', 'blackP04', 'blackP05', 'blackP06', 'blackP07', 'blackP08', 'blackP09', 'blackP10'], (preset) => {
		switch (preset) {
			case 'blackP01': resetStyle('all'); blackP01(); updateStyle(); break; // * Beveled
			case 'blackP02': resetStyle('all'); blackP02(); updateStyle(); break; // * Blended
			case 'blackP03': resetStyle('all'); blackP03(); updateStyle(); break; // * Blended alternative
			case 'blackP04': resetStyle('all'); blackP04(); updateStyle(); break; // * Blended alternative 2
			case 'blackP05': resetStyle('all'); blackP05(); updateStyle(); break; // * Black reborn
			case 'blackP06': resetStyle('all'); blackP06(); updateStyle(); break; // * Black reborn blended
			case 'blackP07': resetStyle('all'); blackP07(); updateStyle(); break; // * Dark gray
			case 'blackP08': resetStyle('all'); blackP08(); updateStyle(); break; // * Dark gray blended
			case 'blackP09': resetStyle('all'); blackP09(); updateStyle(); break; // * Dark gray 2 blended
			case 'blackP10': resetStyle('all'); blackP10(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsBlackMenu.appendTo(themePresetsMenu);

	// * REBORN THEME PRESETS * //
	const themePresetsRebornMenu = new Menu('Reborn');
	themePresetsRebornMenu.addRadioItems(['Beveled', 'Blended', 'Blended 2', 'Gradiented', 'Gradiented 2', 'Minimalized', 'Minimalized blended'], pref.preset,
		['rebornP01', 'rebornP02', 'rebornP03', 'rebornP04', 'rebornP05', 'rebornP06', 'rebornP07'], (preset) => {
		switch (preset) {
			case 'rebornP01': resetStyle('all'); rebornP01(); updateStyle(); break; // * Beveled
			case 'rebornP02': resetStyle('all'); rebornP02(); updateStyle(); break; // * Blended
			case 'rebornP03': resetStyle('all'); rebornP03(); updateStyle(); break; // * Blended 2
			case 'rebornP04': resetStyle('all'); rebornP04(); updateStyle(); break; // * Gradiented
			case 'rebornP05': resetStyle('all'); rebornP05(); updateStyle(); break; // * Gradiented 2
			case 'rebornP06': resetStyle('all'); rebornP06(); updateStyle(); break; // * Minimalized
			case 'rebornP07': resetStyle('all'); rebornP07(); updateStyle(); break; // * Minimalized blended
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn white beveled', 'Reborn white blended', 'Reborn white blended 2'], pref.preset,
		['rebornP08', 'rebornP09', 'rebornP10'], (preset) => {
		switch (preset) {
			case 'rebornP08': resetStyle('all'); rebornP08(); updateStyle(); break; // * Reborn white beveled
			case 'rebornP09': resetStyle('all'); rebornP09(); updateStyle(); break; // * Reborn white blended
			case 'rebornP10': resetStyle('all'); rebornP10(); updateStyle(); break; // * Reborn white blended 2
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn black beveled', 'Reborn black blended', 'Reborn black blended 2', 'Reborn black gradiented', 'Reborn black gradiented 2'], pref.preset,
		['rebornP11', 'rebornP12', 'rebornP13', 'rebornP14', 'rebornP15'], (preset) => {
		switch (preset) {
			case 'rebornP11': resetStyle('all'); rebornP11(); updateStyle(); break; // * Reborn black beveled
			case 'rebornP12': resetStyle('all'); rebornP12(); updateStyle(); break; // * Reborn black blended
			case 'rebornP13': resetStyle('all'); rebornP13(); updateStyle(); break; // * Reborn black blended 2
			case 'rebornP14': resetStyle('all'); rebornP14(); updateStyle(); break; // * Reborn black gradiented
			case 'rebornP15': resetStyle('all'); rebornP15(); updateStyle(); break; // * Reborn black gradiented 2
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn fusion beveled', 'Reborn fusion blended', 'Reborn fusion blended 2', 'Reborn fusion gradiented', 'Reborn fusion gradiented 2'], pref.preset,
		['rebornP16', 'rebornP17', 'rebornP18', 'rebornP19', 'rebornP20'], (preset) => {
		switch (preset) {
			case 'rebornP16': resetStyle('all'); rebornP16(); updateStyle(); break; // * Reborn fusion beveled
			case 'rebornP17': resetStyle('all'); rebornP17(); updateStyle(); break; // * Reborn fusion blended
			case 'rebornP18': resetStyle('all'); rebornP18(); updateStyle(); break; // * Reborn fusion blended 2
			case 'rebornP19': resetStyle('all'); rebornP19(); updateStyle(); break; // * Reborn fusion gradiented
			case 'rebornP20': resetStyle('all'); rebornP20(); updateStyle(); break; // * Reborn fusion gradiented 2
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn fusion 2 beveled', 'Reborn fusion 2 blended', 'Reborn fusion 2 blended 2', 'Reborn fusion 2 gradiented', 'Reborn fusion 2 gradiented 2'], pref.preset,
		['rebornP21', 'rebornP22', 'rebornP23', 'rebornP24', 'rebornP25'], (preset) => {
		switch (preset) {
			case 'rebornP21': resetStyle('all'); rebornP21(); updateStyle(); break; // * Reborn fusion 2 beveled
			case 'rebornP22': resetStyle('all'); rebornP22(); updateStyle(); break; // * Reborn fusion 2 blended
			case 'rebornP23': resetStyle('all'); rebornP23(); updateStyle(); break; // * Reborn fusion 2 blended 2
			case 'rebornP24': resetStyle('all'); rebornP24(); updateStyle(); break; // * Reborn fusion 2 gradiented
			case 'rebornP25': resetStyle('all'); rebornP25(); updateStyle(); break; // * Reborn fusion 2 gradiented 2
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRebornMenu.addSeparator();
	themePresetsRebornMenu.addRadioItems(['Reborn fusion accent beveled', 'Reborn fusion accent blended', 'Reborn fusion accent blended 2', 'Reborn fusion accent gradiented', 'Reborn fusion accent gradiented 2'], pref.preset,
		['rebornP26', 'rebornP27', 'rebornP28', 'rebornP29', 'rebornP30'], (preset) => {
		switch (preset) {
			case 'rebornP26': resetStyle('all'); rebornP26(); updateStyle(); break; // * Reborn fusion accent beveled
			case 'rebornP27': resetStyle('all'); rebornP27(); updateStyle(); break; // * Reborn fusion accent blended
			case 'rebornP28': resetStyle('all'); rebornP28(); updateStyle(); break; // * Reborn fusion accent blended 2
			case 'rebornP29': resetStyle('all'); rebornP29(); updateStyle(); break; // * Reborn fusion accent gradiented
			case 'rebornP30': resetStyle('all'); rebornP30(); updateStyle(); break; // * Reborn fusion accent gradiented 2
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRebornMenu.appendTo(themePresetsMenu);

	// * RANDOM THEME PRESETS * //
	const themePresetsRandomMenu = new Menu('Random');
	themePresetsRandomMenu.addRadioItems(['Beveled blended alternative', 'Beveled blended pastel', 'Beveled blended dark', 'Beveled blended auto dark', 'Beveled auto dark', 'Beveled dark', 'Gradiented', 'Gradiented 2', 'Minimalized', 'Minimalized blended'], pref.preset,
		['randomP01', 'randomP02', 'randomP03', 'randomP04', 'randomP05', 'randomP06', 'randomP07', 'randomP08', 'randomP09', 'randomP10'], (preset) => {
		switch (preset) {
			case 'randomP01': resetStyle('all'); randomP01(); updateStyle(); break; // * Beveled blended alternative
			case 'randomP02': resetStyle('all'); randomP02(); updateStyle(); break; // * Beveled blended pastel
			case 'randomP03': resetStyle('all'); randomP03(); updateStyle(); break; // * Beveled blended dark
			case 'randomP04': resetStyle('all'); randomP04(); updateStyle(); break; // * Beveled blended auto dark
			case 'randomP05': resetStyle('all'); randomP05(); updateStyle(); break; // * Beveled auto dark
			case 'randomP06': resetStyle('all'); randomP06(); updateStyle(); break; // * Beveled dark
			case 'randomP07': resetStyle('all'); randomP07(); updateStyle(); break; // * Gradiented
			case 'randomP08': resetStyle('all'); randomP08(); updateStyle(); break; // * Gradiented 2
			case 'randomP09': resetStyle('all'); randomP09(); updateStyle(); break; // * Minimalized
			case 'randomP10': resetStyle('all'); randomP10(); updateStyle(); break; // * Minimalized blended
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRandomMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * BLUE THEME PRESETS * //
	const themePresetsBlueMenu = new Menu('Blue');
	themePresetsBlueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], pref.preset,
		['blueP01', 'blueP02', 'blueP03', 'blueP04', 'blueP05'], (preset) => {
		switch (preset) {
			case 'blueP01': resetStyle('all'); blueP01(); updateStyle(); break; // * Beveled
			case 'blueP02': resetStyle('all'); blueP02(); updateStyle(); break; // * Beveled 2
			case 'blueP03': resetStyle('all'); blueP03(); updateStyle(); break; // * Gradiented
			case 'blueP04': resetStyle('all'); blueP04(); updateStyle(); break; // * Gradiented 2
			case 'blueP05': resetStyle('all'); blueP05(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsBlueMenu.appendTo(themePresetsMenu);

	// * DARK BLUE THEME PRESETS * //
	const themePresetsDarkblueMenu = new Menu('Dark blue');
	themePresetsDarkblueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], pref.preset,
		['darkblueP01', 'darkblueP02', 'darkblueP03', 'darkblueP04', 'darkblueP05'], (preset) => {
		switch (preset) {
			case 'darkblueP01': resetStyle('all'); darkblueP01(); updateStyle(); break; // * Beveled
			case 'darkblueP02': resetStyle('all'); darkblueP02(); updateStyle(); break; // * Beveled 2
			case 'darkblueP03': resetStyle('all'); darkblueP03(); updateStyle(); break; // * Gradiented
			case 'darkblueP04': resetStyle('all'); darkblueP04(); updateStyle(); break; // * Gradiented 2
			case 'darkblueP05': resetStyle('all'); darkblueP05(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsDarkblueMenu.appendTo(themePresetsMenu);

	// * RED THEME PRESETS * //
	const themePresetsRedMenu = new Menu('Red');
	themePresetsRedMenu.addRadioItems(['Beveled', 'Beveled 2', 'Gradiented', 'Gradiented 2', 'Minimalized'], pref.preset,
		['redP01', 'redP02', 'redP03', 'redP04', 'redP05'], (preset) => {
		switch (preset) {
			case 'redP01': resetStyle('all'); redP01(); updateStyle(); break; // * Beveled
			case 'redP02': resetStyle('all'); redP02(); updateStyle(); break; // * Beveled 2
			case 'redP03': resetStyle('all'); redP03(); updateStyle(); break; // * Gradiented
			case 'redP04': resetStyle('all'); redP04(); updateStyle(); break; // * Gradiented 2
			case 'redP05': resetStyle('all'); redP05(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsRedMenu.appendTo(themePresetsMenu);

	// * CREAM THEME PRESETS * //
	const themePresetsCreamMenu = new Menu('Cream');
	themePresetsCreamMenu.addRadioItems(['Beveled', 'Beveled 2', 'Alternative', 'Alternative 2', 'Minimalized'], pref.preset,
		['creamP01', 'creamP02', 'creamP03', 'creamP04', 'creamP05'], (preset) => {
		switch (preset) {
			case 'creamP01': resetStyle('all'); creamP01(); updateStyle(); break; // * Beveled
			case 'creamP02': resetStyle('all'); creamP02(); updateStyle(); break; // * Beveled 2
			case 'creamP03': resetStyle('all'); creamP03(); updateStyle(); break; // * Alternative
			case 'creamP04': resetStyle('all'); creamP04(); updateStyle(); break; // * Alternative 2
			case 'creamP05': resetStyle('all'); creamP05(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsCreamMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * NEON BLUE THEME PRESETS * //
	const themePresetsNblueMenu = new Menu('Neon blue');
	themePresetsNblueMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['nblueP01', 'nblueP02', 'nblueP03', 'nblueP04', 'nblueP05', 'nblueP06', 'nblueP07', 'nblueP08', 'nblueP09', 'nblueP10'], (preset) => {
		switch (preset) {
			case 'nblueP01': resetStyle('all'); nblueP01(); updateStyle(); break; // * Beveled
			case 'nblueP02': resetStyle('all'); nblueP02(); updateStyle(); break; // * Beveled 2
			case 'nblueP03': resetStyle('all'); nblueP03(); updateStyle(); break; // * Blended
			case 'nblueP04': resetStyle('all'); nblueP04(); updateStyle(); break; // * Blended 2
			case 'nblueP05': resetStyle('all'); nblueP05(); updateStyle(); break; // * Alternative
			case 'nblueP06': resetStyle('all'); nblueP06(); updateStyle(); break; // * Alternative 2
			case 'nblueP07': resetStyle('all'); nblueP07(); updateStyle(); break; // * Dark gray
			case 'nblueP08': resetStyle('all'); nblueP08(); updateStyle(); break; // * Dark gray blended
			case 'nblueP09': resetStyle('all'); nblueP09(); updateStyle(); break; // * Dark gray 2 blended
			case 'nblueP10': resetStyle('all'); nblueP10(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsNblueMenu.appendTo(themePresetsMenu);

	// * NEON GREEN THEME PRESETS * //
	const themePresetsNgreenMenu = new Menu('Neon green');
	themePresetsNgreenMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['ngreenP01', 'ngreenP02', 'ngreenP03', 'ngreenP04', 'ngreenP05', 'ngreenP06', 'ngreenP07', 'ngreenP08', 'ngreenP09', 'ngreenP10'], (preset) => {
		switch (preset) {
			case 'ngreenP01': resetStyle('all'); ngreenP01(); updateStyle(); break; // * Beveled
			case 'ngreenP02': resetStyle('all'); ngreenP02(); updateStyle(); break; // * Beveled 2
			case 'ngreenP03': resetStyle('all'); ngreenP03(); updateStyle(); break; // * Blended
			case 'ngreenP04': resetStyle('all'); ngreenP04(); updateStyle(); break; // * Blended 2
			case 'ngreenP05': resetStyle('all'); ngreenP05(); updateStyle(); break; // * Alternative
			case 'ngreenP06': resetStyle('all'); ngreenP06(); updateStyle(); break; // * Alternative 2
			case 'ngreenP07': resetStyle('all'); ngreenP07(); updateStyle(); break; // * Dark gray
			case 'ngreenP08': resetStyle('all'); ngreenP08(); updateStyle(); break; // * Dark gray blended
			case 'ngreenP09': resetStyle('all'); ngreenP09(); updateStyle(); break; // * Dark gray 2 blended
			case 'ngreenP10': resetStyle('all'); ngreenP10(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsNgreenMenu.appendTo(themePresetsMenu);

	// * NEON RED THEME PRESETS * //
	const themePresetsNredMenu = new Menu('Neon red');
	themePresetsNredMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['nredP01', 'nredP02', 'nredP03', 'nredP04', 'nredP05', 'nredP06', 'nredP07', 'nredP08', 'nredP09', 'nredP10'], (preset) => {
		switch (preset) {
			case 'nredP01': resetStyle('all'); nredP01(); updateStyle(); break; // * Beveled
			case 'nredP02': resetStyle('all'); nredP02(); updateStyle(); break; // * Beveled 2
			case 'nredP03': resetStyle('all'); nredP03(); updateStyle(); break; // * Blended
			case 'nredP04': resetStyle('all'); nredP04(); updateStyle(); break; // * Blended 2
			case 'nredP05': resetStyle('all'); nredP05(); updateStyle(); break; // * Alternative
			case 'nredP06': resetStyle('all'); nredP06(); updateStyle(); break; // * Alternative 2
			case 'nredP07': resetStyle('all'); nredP07(); updateStyle(); break; // * Dark gray
			case 'nredP08': resetStyle('all'); nredP08(); updateStyle(); break; // * Dark gray blended
			case 'nredP09': resetStyle('all'); nredP09(); updateStyle(); break; // * Dark gray 2 blended
			case 'nredP10': resetStyle('all'); nredP10(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsNredMenu.appendTo(themePresetsMenu);

	// * NEON GOLD THEME PRESETS * //
	const themePresetsNgoldMenu = new Menu('Neon gold');
	themePresetsNgoldMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Alternative', 'Alternative 2', 'Dark gray', 'Dark gray blended', 'Dark gray 2 blended', 'Minimalized'], pref.preset,
		['ngoldP01', 'ngoldP02', 'ngoldP03', 'ngoldP04', 'ngoldP05', 'ngoldP06', 'ngoldP07', 'ngoldP08', 'ngoldP09', 'ngoldP10'], (preset) => {
		switch (preset) {
			case 'ngoldP01': resetStyle('all'); ngoldP01(); updateStyle(); break; // * Beveled
			case 'ngoldP02': resetStyle('all'); ngoldP02(); updateStyle(); break; // * Beveled 2
			case 'ngoldP03': resetStyle('all'); ngoldP03(); updateStyle(); break; // * Blended
			case 'ngoldP04': resetStyle('all'); ngoldP04(); updateStyle(); break; // * Blended 2
			case 'ngoldP05': resetStyle('all'); ngoldP05(); updateStyle(); break; // * Alternative
			case 'ngoldP06': resetStyle('all'); ngoldP06(); updateStyle(); break; // * Alternative 2
			case 'ngoldP07': resetStyle('all'); ngoldP07(); updateStyle(); break; // * Dark gray
			case 'ngoldP08': resetStyle('all'); ngoldP08(); updateStyle(); break; // * Dark gray blended
			case 'ngoldP09': resetStyle('all'); ngoldP09(); updateStyle(); break; // * Dark gray 2 blended
			case 'ngoldP10': resetStyle('all'); ngoldP10(); updateStyle(); break; // * Minimalized
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsNgoldMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * CUSTOM THEME PRESETS * //
	const themePresetsCustomMenu = new Menu('Custom');
	themePresetsCustomMenu.addRadioItems(['Beveled', 'Beveled 2', 'Blended', 'Blended 2', 'Gradiented', 'Gradiented 2', 'Alternative', 'Alternative 2', 'Minimalized', 'Minimalized blended'], pref.preset,
		['customP01', 'customP02', 'customP03', 'customP04', 'customP05', 'customP06', 'customP07', 'customP08', 'customP09', 'customP10'], (preset) => {
		switch (preset) {
			case 'customP01': resetStyle('all'); customP01(); updateStyle(); break; // * Beveled
			case 'customP02': resetStyle('all'); customP02(); updateStyle(); break; // * Beveled 2
			case 'customP03': resetStyle('all'); customP03(); updateStyle(); break; // * Blended
			case 'customP04': resetStyle('all'); customP04(); updateStyle(); break; // * Blended 2
			case 'customP05': resetStyle('all'); customP05(); updateStyle(); break; // * Gradiented
			case 'customP06': resetStyle('all'); customP06(); updateStyle(); break; // * Gradiented 2
			case 'customP07': resetStyle('all'); customP07(); updateStyle(); break; // * Alternative
			case 'customP08': resetStyle('all'); customP08(); updateStyle(); break; // * Alternative 2
			case 'customP09': resetStyle('all'); customP09(); updateStyle(); break; // * Minimalized
			case 'customP10': resetStyle('all'); customP10(); updateStyle(); break; // * Minimalized blended
		}
		pref.preset = preset;
		themePresetMatchMode = false;
	});
	themePresetsCustomMenu.appendTo(themePresetsMenu);
	themePresetsMenu.addSeparator();

	// * CUSTOM USER THEME PRESET * //
	const themePresetUserMenu = new Menu('User preset');
	themePresetUserMenu.addRadioItems(['User settings'], pref.preset, ['user'], (preset) => {
		pref.preset = preset;
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
			themePresetRandomPicker();
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
function playerSizeOptions(menu) {
	menu.createRadioSubMenu('Player size', ['Small', 'Normal', 'Large'], pref.playerSize, ['small', 'normal', 'large'], (size) => {
		pref.playerSize = size;
		resetPlayerSize();
		if (size === 'small') {
			if (!is_4k && !is_QHD) {
				pref.playerSize_HD_small = true;
				windowHandler.playerSize_HD_small();
			} else if (is_QHD) {
				pref.playerSize_QHD_small = true;
				windowHandler.playerSize_QHD_small();
			} else if (is_4k) {
				pref.playerSize_4k_small = true;
				windowHandler.playerSize_4k_small();
			}
		}
		if (size === 'normal') {
			if (!is_4k && !is_QHD) {
				pref.playerSize_HD_normal = true;
				windowHandler.playerSize_HD_normal();
			} else if (is_QHD) {
				pref.playerSize_QHD_normal = true;
				windowHandler.playerSize_QHD_normal();
			} else if (is_4k) {
				pref.playerSize_4k_normal = true;
				windowHandler.playerSize_4k_normal();
			}
		}
		if (size === 'large') {
			if (!is_4k && !is_QHD) {
				pref.playerSize_HD_large = true;
				windowHandler.playerSize_HD_large();
			} else if (is_QHD) {
				pref.playerSize_QHD_large = true;
				windowHandler.playerSize_QHD_large();
			} else if (is_4k) {
				pref.playerSize_4k_large = true;
				windowHandler.playerSize_4k_large();
			}
		}
		repaintWindow();
	}, pref.lockPlayerSize);
}


////////////////////////
// * LAYOUT OPTIONS * //
////////////////////////
function layoutOptions(menu) {
	menu.createRadioSubMenu('Layout', ['Default', 'Artwork', 'Compact'], pref.layout, ['default', 'artwork', 'compact'], (layout) => {
		pref.layout = layout;
		if (pref.layout === 'default') {
			displayPlaylist = pref.showPanelOnStartup === 'playlist'; // Switch back to Playlist from Artwork layout to Default layout
			displayPlaylistArtworkLayout = false;
			displayBiography = false;
			pref.displayLyrics = false;
			windowHandler.layoutDefault();
		}
		if (pref.layout === 'artwork') {
			displayPlaylist = false;
			displayLibrary = false;
			displayBiography = false;
			windowHandler.layoutArtwork();
		}
		if (pref.layout === 'compact') {
			displayPlaylist = true;
			displayLibrary = false;
			displayBiography = false;
			pref.displayLyrics = false;
			windowHandler.layoutCompact();
		}
		initPanels();
	}, pref.lockPlayerSize);
}


/////////////////////////
// * DISPLAY OPTIONS * //
/////////////////////////
function displayOptions(menu) {
	const displayResMenu = new Menu('Display');

	displayResMenu.addItem('Auto-detect', false, () => { autoDetectRes(); });
	displayResMenu.addSeparator();
	displayResMenu.addRadioItems(['4K', 'QHD', 'HD'], pref.displayRes, ['4k', 'QHD', 'HD'], (res) => {
		pref.displayRes = res;
		if (pref.layout === 'default') {
			windowHandler.layoutDefault();
		}
		else if (pref.layout === 'artwork') {
			windowHandler.layoutArtwork();
		}
		else if (pref.layout === 'compact') {
			windowHandler.layoutCompact();
		}
		if (pref.displayRes === '4k' || pref.displayRes === 'HD') {
			setSizesFor4KorHD();
		} else if (pref.displayRes === 'QHD') {
			setSizesForQHD();
		}
		initPanels();
	});

	displayResMenu.appendTo(menu);
}


////////////////////////////
// * BRIGHTNESS OPTIONS * //
////////////////////////////
function brightnessOptions(menu) {
	menu.createRadioSubMenu('Brightness', ['-25%', '-20%', '-15%', '-10%', '-5%', 'Default', '+5%', '+10%', '+15%', '+20%', '+25%'], pref.themeBrightness, [-25, -20, -15, -10, -5, 'default', 5, 10, 15, 20, 25], (percent) => {
		pref.themeBrightness = percent;
		initThemeFull = true;
		initTheme();
	});
}


///////////////////////////
// * FONT SIZE OPTIONS * //
///////////////////////////
function fontSizeOptions(menu) {
	const menuFontSize           = pref.layout === 'compact' ? pref.menuFontSize_compact           : pref.layout === 'artwork' ? pref.menuFontSize_artwork         : pref.menuFontSize_default;
	const lowerBarFontSize       = pref.layout === 'compact' ? pref.lowerBarFontSize_compact       : pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork     : pref.lowerBarFontSize_default;
	const notificationFontSize   = pref.layout === 'compact' ? pref.notificationFontSize_compact   : pref.layout === 'artwork' ? pref.notificationFontSize_artwork : pref.notificationFontSize_default;
	const popupFontSize          = pref.layout === 'compact' ? pref.popupFontSize_compact          : pref.layout === 'artwork' ? pref.popupFontSize_artwork        : pref.popupFontSize_default;
	const tooltipFontSize        = pref.layout === 'compact' ? pref.tooltipFontSize_compact        : pref.layout === 'artwork' ? pref.tooltipFontSize_artwork      : pref.tooltipFontSize_default;

	const gridArtistFontSize     = pref.layout === 'artwork' ? pref.gridArtistFontSize_artwork     : pref.gridArtistFontSize_default;
	const gridTrackNumFontSize   = pref.layout === 'artwork' ? pref.gridTrackNumFontSize_artwork   : pref.gridTrackNumFontSize_default;
	const gridTitleFontSize      = pref.layout === 'artwork' ? pref.gridTitleFontSize_artwork      : pref.gridTitleFontSize_default;
	const gridAlbumFontSize      = pref.layout === 'artwork' ? pref.gridAlbumFontSize_artwork      : pref.gridAlbumFontSize_default;
	const gridKeyFontSize        = pref.layout === 'artwork' ? pref.gridKeyFontSize_artwork        : pref.gridKeyFontSize_default;
	const gridValueFontSize      = pref.layout === 'artwork' ? pref.gridValueFontSize_artwork      : pref.gridValueFontSize_default;

	const playlistHeaderFontSize = pref.layout === 'compact' ? pref.playlistHeaderFontSize_compact : pref.layout === 'artwork' ? pref.playlistHeaderFontSize_artwork : pref.playlistHeaderFontSize_default;
	const libraryFontSize        = pref.layout === 'artwork' ? ppt.baseFontSize_artwork            : ppt.baseFontSize_default;
	const biographyFontSize      = pref.layout === 'artwork' ? pptBio.baseFontSizeBio_artwork      : pptBio.baseFontSizeBio_default;
	const lyricsFontSize         = pref.layout === 'artwork' ? pref.lyricsFontSize_artwork         : pref.lyricsFontSize_default;

	const changeFontSizeMenu = new Menu('Font size');
	const mainFontSizeMenu = new Menu('Main');

	// * MAIN - TOP MENU * //
	mainFontSizeMenu.createRadioSubMenu('Top menu', ['  8px', '10px', '11px', is_QHD ? '12px' : '12px (default)', '13px', is_QHD ? '14px (default)' : '14px', '16px'], menuFontSize, [8, 10, 11, 12, 13, 14, 16], (size) => {
		if (pref.layout === 'default') {
			pref.menuFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.menuFontSize_artwork = size;
		}
		else if (pref.layout === 'compact') {
			pref.menuFontSize_compact = size;
		}
		ft.top_menu         = gdi.Font(fontTopMenu, scaleForDisplay(size), 0);
		ft.top_menu_caption = gdi.Font(fontTopMenuCaption, scaleForDisplay(size + 1), 0);
		ft.top_menu_compact = gdi.Font(fontAwesome, scaleForDisplay(size), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		window.Repaint();
	});

	// * MAIN - LOWER BAR * //
	mainFontSizeMenu.createRadioSubMenu('Lower bar', pref.layout !== 'default' ? ['10px', '12px', '14px', is_QHD ? '16px' : '16px (default)', is_QHD ? '18px (default)' : '18px', '20px', '22px', '24px', '26px'] :
		['10px', '12px', '14px', '16px', is_QHD ? '18px' : '18px (default)', is_QHD ? '20px (default)' : '20px', '22px', '24px', '26px'], lowerBarFontSize, [10, 12, 14, 16, 18, 20, 22, 24, 26], (size) => {
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
		window.Repaint();
	});
	mainFontSizeMenu.appendTo(changeFontSizeMenu);

	// * MAIN - NOTIFICATION * //
	mainFontSizeMenu.createRadioSubMenu('Notification', ['12px', '14px', '16px', is_QHD ? '18px' : '18px (default)', is_QHD ? '20px (default)' : '20px', '22px', '24px'], notificationFontSize,
		[12, 14, 16, 18, 20, 22, 24], (size) => {
		if      (pref.layout === 'default') { pref.notificationFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.notificationFontSize_artwork = size; }
		else if (pref.layout === 'compact') { pref.notificationFontSize_compact = size; }

		createFonts();
		window.Repaint();
	});

	// * MAIN - POPUP * //
	mainFontSizeMenu.createRadioSubMenu('Popup', ['12px', '14px', is_QHD ? '16px' : '16px (default)', is_QHD ? '18px (default)' : '18px', '20px', '22px', '24px'], popupFontSize,
		[12, 14, 16, 18, 20, 22, 24], (size) => {
		if      (pref.layout === 'default') { pref.popupFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.popupFontSize_artwork = size; }
		else if (pref.layout === 'compact') { pref.popupFontSize_compact = size; }

		createFonts();
		if      (displayCustomThemeMenu)  initCustomThemeMenu('pl_bg');
		else if (displayMetadataGridMenu) initMetadataGridMenu();
		window.Repaint();
	});

	// * MAIN - TOOLTIP * //
	mainFontSizeMenu.createRadioSubMenu('Tooltip', ['12px', '14px', is_QHD ? '16px' : '16px (default)', is_QHD ? '18px (default)' : '18px', '20px', '22px', '24px'], tooltipFontSize,
		[12, 14, 16, 18, 20, 22, 24], (size) => {
		if      (pref.layout === 'default') { pref.tooltipFontSize_default = size; }
		else if (pref.layout === 'artwork') { pref.tooltipFontSize_artwork = size; }
		else if (pref.layout === 'compact') { pref.tooltipFontSize_compact = size; }

		createFonts();
		window.Repaint();
	});

	// * DETAILS - ARTIST * //
	const detailsFontSizeMenu = new Menu('Details');
	detailsFontSizeMenu.createRadioSubMenu('Artist', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', is_QHD ? '18px' : '18px (default)', '19px', is_QHD ? '20px (default)' : '20px', '22px', '24px'], gridArtistFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridArtistFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridArtistFontSize_artwork = size;
		}
		ft.grd_artist = gdi.Font(fontGridArtist, scaleForDisplay(size), 0);
		createFonts();
		window.Repaint();
	});

	// * DETAILS - TITLE * //
	detailsFontSizeMenu.createRadioSubMenu('Title', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', is_QHD ? '18px' : '18px (default)', '19px', is_QHD ? '20px (default)' : '20px', '22px', '24px'], gridTrackNumFontSize && gridTitleFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridTrackNumFontSize_default = size;
			pref.gridTitleFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridTrackNumFontSize_artwork = size;
			pref.gridTitleFontSize_artwork = size;
		}
		const artistTitle = pref.showGridArtist_default && pref.showGridTitle_default || pref.showGridArtist_artwork && pref.showGridTitle_artwork;
		ft.grd_tracknum   = gdi.Font(artistTitle ? fontGridTitle : fontGridTitleBold, scaleForDisplay(size), 0);
		ft.grd_title      = gdi.Font(artistTitle ? fontGridTitle : fontGridTitleBold, scaleForDisplay(size), 0);
		createFonts();
		window.Repaint();
	});

	// * DETAILS - ALBUM * //
	detailsFontSizeMenu.createRadioSubMenu('Album', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', is_QHD ? '18px' : '18px (default)', '19px', is_QHD ? '20px (default)' : '20px', '22px', '24px'], gridAlbumFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridAlbumFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridAlbumFontSize_artwork = size;
		}
		ft.grd_album = gdi.Font(fontGridAlbum, scaleForDisplay(size), 0);
		createFonts();
		window.Repaint();
	});

	// * DETAILS - TAG NAME * //
	detailsFontSizeMenu.createRadioSubMenu('Tag name', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', is_QHD ? '17px' : '17px (default)', '18px', is_QHD ? '19px (default)' : '19px', '20px', '22px', '24px'], gridKeyFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridKeyFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridKeyFontSize_artwork = size;
		}
		ft.grd_key = gdi.Font(fontGridKey, scaleForDisplay(size), 0);
		createFonts();
		window.Repaint();
	});

	// * DETAILS - TAG VALUE * //
	detailsFontSizeMenu.createRadioSubMenu('Tag value', ['10px', '11px', '12px', '13px', '14px', '15px', '16px', is_QHD ? '17px' : '17px (default)', '18px', is_QHD ? '19px (default)' : '19px', '20px', '22px', '24px'], gridValueFontSize,
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24], (size) => {
		if (pref.layout === 'default') {
			pref.gridValueFontSize_default = size;
		}
		else if (pref.layout === 'artwork') {
			pref.gridValueFontSize_artwork = size;
		}
		ft.grd_val = gdi.Font(fontGridValue, scaleForDisplay(size), 0);
		createFonts();
		window.Repaint();
	});
	detailsFontSizeMenu.appendTo(changeFontSizeMenu);

	// * PLAYLIST * //
	changeFontSizeMenu.createRadioSubMenu('Playlist', pref.layout === 'default' ?
		is_QHD ? ['-1', '10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px', '20px', '22px', '+1'] : ['-1', '10px', '12px', '13px', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'] :
		is_QHD ? ['10px', '12px', '13px', '14px', '15px', '16px', '17px (default)', '18px'] : ['10px', '12px', '13px', '14px', '15px (default)', '16px', '18px'], playlistHeaderFontSize, pref.layout === 'default' ?
		is_QHD ? [-1, 10, 12, 13, 14, 15, 16, 17, 18, 20, 22, 999] : [-1, 10, 12, 13, 14, 15, 16, 18, 20, 22, 999] :
		is_QHD ? [10, 12, 13, 14, 15, 16, 17, 18] : [10, 12, 13, 14, 15, 16, 18], (size) => {
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
			if (pref.libraryLayout === 'full') {
				libraryLayoutFullPreset();
			} else if (pref.libraryLayout === 'split') {
				libraryLayoutSplitPreset();
			}
		}
		window.Repaint();
	});

	// * LIBRARY * //
	changeFontSizeMenu.createRadioSubMenu('Library', ['-1', '  8px', '10px', '11px', is_QHD ? '12px' : '12px (default)', '13px', is_QHD ? '14px (default)' : '14px', '16px', '18px', '+1'], libraryFontSize,
		[-1, is_4k ? 8 * 1.5 : 8, is_4k ? 10 * 1.5 : 10, is_4k ? 11 * 1.5 : 11, is_4k ? 12 * 1.5 : 12, is_4k ? 13 * 1.5 : 13, is_4k ? 14 * 1.5 : 14, is_4k ? 16 * 1.5 : 16, is_4k ? 18 * 1.5 : 18, 999], (size) => {
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

		setLibrarySize();
		panel.zoomReset();
		pop.createImages();
		window.Repaint();
	});

	// * BIOGRAPHY * //
	changeFontSizeMenu.createRadioSubMenu('Biography', ['-1', '  8px', '10px', '11px', is_QHD ? '12px' : '12px (default)', '13px', is_QHD ? '14px (default)' : '14px', '16px', '18px', '+1'], biographyFontSize,
		[-1, is_4k ? 8 * 1.5 : 8, is_4k ? 10 * 2 : 10, is_4k ? 11 * 2 : 11, is_4k ? 12 * 2 : 12, is_4k ? 13 * 2 : 13, is_4k ? 14 * 2 : 14, is_4k ? 16 * 2 : 16, is_4k ? 18 * 2 : 18, 999], (size) => {
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

		setBiographySize();
		butBio.resetZoom();
		butBio.createImages();
		window.Repaint();
	});

	// * LYRICS * //
	changeFontSizeMenu.createRadioSubMenu('Lyrics', ['-1', '10px', '12px', '14px', '16px', '18px', is_QHD ? '20px' : '20px (default)', is_QHD ? '22px (default)' : '22px', '24px', '26px', '28px', '30px', '+1'], lyricsFontSize,
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
function playerControlsOptions(menu, m) {
	const playerControlsMenu = new Menu('Player controls');

	const playlistCallback = () => {
		playlist.on_size(ww, wh);
		window.Repaint();
	};

	// * TOP MENU * //
	const playerControlsTopMenu = new Menu('Top menu');
	const playerControlsTopMenuDefault = new Menu('Default');
	playerControlsTopMenuDefault.addToggleItem('Details', pref, 'showPanelDetails_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuDefault.addToggleItem('Library', pref, 'showPanelLibrary_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuDefault.addToggleItem('Biography', pref, 'showPanelBiography_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuDefault.addToggleItem('Lyrics', pref, 'showPanelLyrics_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuDefault.addToggleItem('Rating', pref, 'showPanelRating_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuDefault.appendTo(playerControlsTopMenu);

	const playerControlsTopMenuArtwork = new Menu('Artwork');
	playerControlsTopMenuArtwork.addToggleItem('Details', pref, 'showPanelDetails_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuArtwork.addToggleItem('Library', pref, 'showPanelLibrary_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuArtwork.addToggleItem('Biography', pref, 'showPanelBiography_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuArtwork.addToggleItem('Lyrics', pref, 'showPanelLyrics_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuArtwork.addToggleItem('Rating', pref, 'showPanelRating_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenuArtwork.appendTo(playerControlsTopMenu);
	playerControlsTopMenu.addSeparator();
	playerControlsTopMenu.addRadioItems(['Align left', 'Align center'], pref.topMenuAlignment, ['left', 'center'], (align) => {
		pref.topMenuAlignment = align;
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenu.addSeparator();
	playerControlsTopMenu.addToggleItem('Compact top menu', pref, 'topMenuCompact', () => {
		pref.showTopMenuCompact = pref.topMenuCompact;
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playerControlsTopMenu.appendTo(playerControlsMenu);

	// * ALBUM ART * //
	if (pref.layout !== 'compact') {
		const playerControlsAlbumArtMenu = new Menu('Album art');
		const playerControlsAlbumArtNotProportionalMenu = new Menu('When player size is not proportional');
		if (pref.layout === 'default') {
			playerControlsAlbumArtNotProportionalMenu.addRadioItems(['Align album art left', 'Align album art left (margin)', 'Align album art center', 'Align album art right'], pref.albumArtAlign, ['left', 'leftMargin', 'center', 'right'], (pos) => {
				pref.albumArtAlign = pos;
				resizeArtwork(true);
				repaintWindow();
			});
			playerControlsAlbumArtNotProportionalMenu.addSeparator();
		}
		playerControlsAlbumArtNotProportionalMenu.addToggleItem('Show colored gap', pref, 'albumArtColoredGap', () => { repaintWindow(); });
		playerControlsAlbumArtNotProportionalMenu.appendTo(playerControlsAlbumArtMenu);
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
		// ! Due to using utils.GetAlbumArtV2 instead of gdi.LoadImageAsyncV2 we don't need this option now, remove this option once it has been tested enough.
		// ! playerControlsAlbumArtMenu.addToggleItem('Load embedded album art first', pref, 'loadEmbeddedAlbumArtFirst');
		// ! playerControlsAlbumArtMenu.addSeparator();

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
		ft.guifx                  = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_default /   2)),  0);
		ft.playback_order_default = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_default / 1.6)),  0);
		ft.playback_order_replay  = gdi.Font(fontAwesome, Math.floor(scaleForDisplay(pref.transportButtonSize_default /   2)),  0);
		ft.playback_order_shuffle = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_default / 1.65)), 0);
		ft.guifx_volume           = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_default / 1.33)), 0);
		ft.guifx_reload           = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_default / 1.5)),  0);
		createFonts();
		createButtonImages();
		createButtonObjects(ww, wh);
		resizeArtwork(true);
		repaintWindow();
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
		ft.guifx                  = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_artwork /   2)),  0);
		ft.playback_order_default = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_artwork / 1.6)),  0);
		ft.playback_order_replay  = gdi.Font(fontAwesome, Math.floor(scaleForDisplay(pref.transportButtonSize_artwork /   2)),  0);
		ft.playback_order_shuffle = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_artwork / 1.65)), 0);
		ft.guifx_volume           = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_artwork / 1.33)), 0);
		ft.guifx_reload           = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_artwork / 1.5)),  0);
		createFonts();
		createButtonImages();
		createButtonObjects(ww, wh);
		resizeArtwork(true);
		repaintWindow();
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
		ft.guifx                  = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_compact /   2)),  0);
		ft.playback_order_default = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_compact / 1.6)),  0);
		ft.playback_order_replay  = gdi.Font(fontAwesome, Math.floor(scaleForDisplay(pref.transportButtonSize_compact /   2)),  0);
		ft.playback_order_shuffle = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_compact / 1.65)), 0);
		ft.guifx_volume           = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_compact / 1.33)), 0);
		ft.guifx_reload           = gdi.Font(fontGuiFx,   Math.floor(scaleForDisplay(pref.transportButtonSize_compact / 1.5)),  0);
		createFonts();
		createButtonImages();
		createButtonObjects(ww, wh);
		resizeArtwork(true);
		repaintWindow();
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
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
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
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
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
		createButtonImages();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	transportSpacingMenuCompact.appendTo(transportSpacingMenu);
	transportSpacingMenu.appendTo(playerControlsLowerBarMenu);
	playerControlsLowerBarMenu.addSeparator();

	// * SHOW TRANSPORT CONTROLS * //
	const transportControlsMenu = new Menu('Show transport controls');
	transportControlsMenu.addToggleItem('Default', pref, 'showTransportControls_default', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		resizeArtwork(true);
		repaintWindow();
	});
	transportControlsMenu.addToggleItem('Artwork', pref, 'showTransportControls_artwork', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		resizeArtwork(true);
		repaintWindow();
	});
	transportControlsMenu.addToggleItem('Compact', pref, 'showTransportControls_compact', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		resizeArtwork(true);
		repaintWindow();
	});
	transportControlsMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW PLAYBACK ORDER BUTTON * //
	const playbackOrderBtnMenu = new Menu('Show playback order button');
	playbackOrderBtnMenu.addToggleItem('Default', pref, 'showPlaybackOrderBtn_default', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_default);
	playbackOrderBtnMenu.addToggleItem('Artwork', pref, 'showPlaybackOrderBtn_artwork', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_artwork);
	playbackOrderBtnMenu.addToggleItem('Compact', pref, 'showPlaybackOrderBtn_compact', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_compact);
	playbackOrderBtnMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW RELOAD BUTTON * //
	const reloadBtnMenu = new Menu('Show reload button');
	reloadBtnMenu.addToggleItem('Default', pref, 'showReloadBtn_default', () => {
		volumeBtn = new VolumeBtn(); // create new volume btn for new width size
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_default);
	reloadBtnMenu.addToggleItem('Artwork', pref, 'showReloadBtn_artwork', () => {
		volumeBtn = new VolumeBtn(); // create new volume btn for new width size
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_artwork);
	reloadBtnMenu.addToggleItem('Compact', pref, 'showReloadBtn_compact', () => {
		volumeBtn = new VolumeBtn(); // create new volume btn for new width size
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_compact);
	reloadBtnMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW VOLUME BUTTON * //
	const volumeBtnMenu = new Menu('Show volume button');
	volumeBtnMenu.addToggleItem('Default', pref, 'showVolumeBtn_default', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_default);
	volumeBtnMenu.addToggleItem('Artwork', pref, 'showVolumeBtn_artwork', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_artwork);
	volumeBtnMenu.addToggleItem('Compact', pref, 'showVolumeBtn_compact', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	}, !pref.showTransportControls_compact);
	volumeBtnMenu.addSeparator();
	volumeBtnMenu.addToggleItem('Auto-hide bar', pref, 'autoHideVolumeBar', () => {
		volumeBtn.toggleVolumeBar();
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	volumeBtnMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW PROGRESS BAR * //
	const progressBarMenu = new Menu('Show progress bar');
	progressBarMenu.addToggleItem('Default', pref, 'showProgressBar_default', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	progressBarMenu.addToggleItem('Artwork', pref, 'showProgressBar_artwork', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	progressBarMenu.addToggleItem('Compact', pref, 'showProgressBar_compact', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	progressBarMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW PEAKMETER BAR * //
	const peakmeterBarMenu = new Menu('Show peakmeter bar');
	peakmeterBarMenu.addToggleItem('Default', pref, 'showPeakmeterBar_default', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	peakmeterBarMenu.addToggleItem('Artwork', pref, 'showPeakmeterBar_artwork', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	peakmeterBarMenu.addToggleItem('Compact', pref, 'showPeakmeterBar_compact', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	peakmeterBarMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW WAVEFORM BAR * //
	const waveformBarMenu = new Menu('Show waveform bar');
	waveformBarMenu.addToggleItem('Default', pref, 'showWaveformBar_default', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	waveformBarMenu.addToggleItem('Artwork', pref, 'showWaveformBar_artwork', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	waveformBarMenu.addToggleItem('Compact', pref, 'showWaveformBar_compact', () => {
		setGeometry();
		resizeArtwork(true);
		repaintWindow();
	});
	waveformBarMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW PLAYBACK TIME IN LOWER BAR * //
	const playbackTimeMenu = new Menu('Show playback time in lower bar');
	playbackTimeMenu.addToggleItem('Default', pref, 'showPlaybackTime_default', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playbackTimeMenu.addToggleItem('Artwork', pref, 'showPlaybackTime_artwork', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playbackTimeMenu.addToggleItem('Compact', pref, 'showPlaybackTime_compact', () => {
		createButtonObjects(ww, wh);
		repaintWindow();
	});
	playbackTimeMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW ARTIST IN LOWER BAR * //
	const showArtistMenu = new Menu('Show artist in lower bar');
	showArtistMenu.addToggleItem('Default', pref, 'showLowerBarArtist_default', () => { repaintWindow(); });
	showArtistMenu.addToggleItem('Artwork', pref, 'showLowerBarArtist_artwork', () => { repaintWindow(); });
	showArtistMenu.addToggleItem('Compact', pref, 'showLowerBarArtist_compact', () => { repaintWindow(); });
	showArtistMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW TRACK NUMBER IN LOWER BAR * //
	const showTrackNumberMenu = new Menu('Show track number in lower bar');
	showTrackNumberMenu.addToggleItem('Default', pref, 'showLowerBarTrackNum_default', () => { on_metadb_changed(); repaintWindow(); });
	showTrackNumberMenu.addToggleItem('Artwork', pref, 'showLowerBarTrackNum_artwork', () => { on_metadb_changed(); repaintWindow(); });
	showTrackNumberMenu.addToggleItem('Compact', pref, 'showLowerBarTrackNum_compact', () => { on_metadb_changed(); repaintWindow(); });
	showTrackNumberMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW SONG TITLE IN LOWER BAR * //
	const showTitleMenu = new Menu('Show song title in lower bar');
	showTitleMenu.addToggleItem('Default', pref, 'showLowerBarTitle_default', () => { repaintWindow(); });
	showTitleMenu.addToggleItem('Artwork', pref, 'showLowerBarTitle_artwork', () => { repaintWindow(); });
	showTitleMenu.addToggleItem('Compact', pref, 'showLowerBarTitle_compact', () => { repaintWindow(); });
	showTitleMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW COMPOSER IN LOWER BAR * //
	const showComposerMenu = new Menu('Show composer in lower bar');
	showComposerMenu.addToggleItem('Default', pref, 'showLowerBarComposer_default', () => { repaintWindow(); });
	showComposerMenu.addToggleItem('Artwork', pref, 'showLowerBarComposer_artwork', () => { repaintWindow(); });
	showComposerMenu.addToggleItem('Compact', pref, 'showLowerBarComposer_compact', () => { repaintWindow(); });
	showComposerMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW ARTIST COUNTRY FLAGS IN LOWER BAR * //
	const showArtistFlagsMenu = new Menu('Show artist country flags in lower bar');
	showArtistFlagsMenu.addToggleItem('Default', pref, 'showLowerBarArtistFlags_default', () => { loadCountryFlags(); repaintWindow(); });
	showArtistFlagsMenu.addToggleItem('Artwork', pref, 'showLowerBarArtistFlags_artwork', () => { loadCountryFlags(); repaintWindow(); });
	showArtistFlagsMenu.addToggleItem('Compact', pref, 'showLowerBarArtistFlags_compact', () => { loadCountryFlags(); repaintWindow(); });
	showArtistFlagsMenu.appendTo(playerControlsLowerBarMenu);

	// * SHOW SOFTWARE VERSION IN LOWER BAR * //
	const showSoftwareVersionMenu = new Menu('Show software version in lower bar');
	showSoftwareVersionMenu.addToggleItem('Default', pref, 'showLowerBarVersion_default', () => { initMain(); });
	showSoftwareVersionMenu.addToggleItem('Artwork', pref, 'showLowerBarVersion_artwork', () => { initMain(); });
	showSoftwareVersionMenu.addToggleItem('Compact', pref, 'showLowerBarVersion_compact', () => { initMain(); });
	showSoftwareVersionMenu.appendTo(playerControlsLowerBarMenu);

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
function playlistOptions(menu, context_menu) {
	const playlistMenu = context_menu ? menu : new Menu('Playlist');

	const playlistCallback = () => {
		playlist.on_size(ww, wh);
		window.Repaint();
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
			window.Repaint();
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
	playlistManagerMenu.addToggleItem('Auto-hide', pref, 'autoHidePlman',  () => {
		initPlaylistColors();
		repaintWindow();
	});
	playlistManagerMenu.appendTo(playlistMenu);

	// * ALBUM HEADER * //
	const playlistAlbumMenu = new Menu('Album header');
	const playlistAlbumArtMenu = new Menu('Album art');
	playlistAlbumArtMenu.addToggleItem('Show', g_properties, 'show_album_art', () => { updatePlaylist(); });
	playlistAlbumArtMenu.addToggleItem('Auto-hide when no cover', g_properties, 'auto_album_art', () => { updatePlaylist(); });
	playlistAlbumArtMenu.appendTo(playlistAlbumMenu);
	playlistAlbumMenu.addSeparator();

	playlistAlbumMenu.addToggleItem('Album header', g_properties, 'show_header', () => { updatePlaylist(); });
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
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, !pref.displayDiscArt);
		displayDiscArtMenu.addSeparator();
		displayDiscArtMenu.addRadioItems(['CD - White', 'CD - Black', 'CD - Blank', 'CD - Transparent'],
			pref.discArtStub, ['cdWhite', 'cdBlack', 'cdBlank', 'cdTrans', 'cdCustom'], (discArt) => {
			pref.discArtStub = discArt;
			pref.noDiscArtStub = false;
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, !pref.displayDiscArt);
		displayDiscArtMenu.addSeparator();
		displayDiscArtMenu.addRadioItems(['Vinyl - White', 'Vinyl - Void', 'Vinyl - Cold fusion', 'Vinyl - Ring of fire', 'Vinyl - Maple', 'Vinyl - Black', 'Vinyl - Black hole', 'Vinyl - Ebony', 'Vinyl - Transparent', 'Vinyl - Custom'],
			pref.discArtStub, ['vinylWhite', 'vinylVoid', 'vinylColdFusion', 'vinylRingOfFire', 'vinylMaple', 'vinylBlack', 'vinylBlackHole', 'vinylEbony', 'vinylTrans', 'vinylCustom'], (discArt) => {
			pref.discArtStub = discArt;
			pref.noDiscArtStub = false;
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
				setupRotationTimer();
			} else {
				clearInterval(discArtRotationTimer);
				discArtArray = [];
			}
		});
		discArtMenu.createRadioSubMenu('# Rotation images (memory usage/rotational speed)', ['  36 (10 degrees)', '  45 (8 degrees)', '  60 (6 degrees)', '  72 (5 degrees) (default)', '  90 (4 degrees)', '120 (3 degrees)', '180 (2 degrees)'], pref.spinDiscArtImageCount, [36, 45, 60, 72, 90, 120, 180], (count) => {
			pref.spinDiscArtImageCount = count;
			rotatedDiscArtIndex = 0;
			discArtArray = [];
			repaintWindow();
		}, !pref.spinDiscArt);
		discArtMenu.createRadioSubMenu('Spinning disc art redraw speed', ['250ms (very slow CPU)', '200ms', '150ms', '125ms', '100ms', '  75ms (default)', '  50ms', '  40ms', '  30ms', '  20ms', '  10ms (very fast CPU)'], pref.spinDiscArtRedrawInterval, [250, 200, 150, 125, 100, 75, 50, 40, 30, 20, 10], interval => {
			pref.spinDiscArtRedrawInterval = interval;
			setupRotationTimer();
		}, !pref.spinDiscArt);
		discArtMenu.addSeparator();
		discArtMenu.addToggleItem('Rotate disc art as tracks change', pref, 'rotateDiscArt', () => { repaintWindow(); }, !pref.displayDiscArt || pref.spinDiscArt);
		discArtMenu.createRadioSubMenu('Disc art rotation amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(pref.rotationAmt), [2, 3, 4, 5], (rot) => {
			pref.rotationAmt = rot;
			createRotatedDiscArtImage();
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
			if (pref.libraryLayout === 'normal') {
				panel.imgView = ppt.albumArtShow = false;
				lib.logTree();
				pop.clearTree();
				men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
				setLibrarySize();
			} else if (pref.libraryLayout === 'full') {
				libraryLayoutFullPreset();
			} else if (pref.libraryLayout === 'split') {
				libraryLayoutSplitPreset();
			}
			initButtonState();
			window.Repaint();
		});
		libraryLayoutMenu.addSeparator();
		libraryLayoutMenu.addToggleItem('Use full preset', pref, 'libraryLayoutFullPreset', () => { pref.libraryLayoutRememberAlbumArtView = false; repaintWindow(); });
		libraryLayoutMenu.addSeparator();
		libraryLayoutMenu.addToggleItem('Use split preset (collapse)', pref, 'libraryLayoutSplitPreset', () => {
			pref.libraryLayoutSplitPreset2 = false;
			pref.libraryLayoutSplitPreset3 = false;
			pref.libraryLayoutSplitPreset4 = false;
			libraryLayoutSplitPreset();
		});
		libraryLayoutMenu.addToggleItem('Use split preset (text)', pref, 'libraryLayoutSplitPreset2', () => {
			pref.libraryLayoutSplitPreset = false;
			pref.libraryLayoutSplitPreset3 = false;
			pref.libraryLayoutSplitPreset4 = false;
			libraryLayoutSplitPreset();
		});
		libraryLayoutMenu.addToggleItem('Use split preset (art grid)', pref, 'libraryLayoutSplitPreset3', () => {
			pref.libraryLayoutSplitPreset = false;
			pref.libraryLayoutSplitPreset2 = false;
			pref.libraryLayoutSplitPreset4 = false;
			libraryLayoutSplitPreset();
		});
		libraryLayoutMenu.addToggleItem('Use split preset (art header)', pref, 'libraryLayoutSplitPreset4', () => {
			pref.libraryLayoutSplitPreset = false;
			pref.libraryLayoutSplitPreset2 = false;
			pref.libraryLayoutSplitPreset3 = false;
			libraryLayoutSplitPreset();
		});
		libraryLayoutMenu.addSeparator();
		libraryLayoutMenu.addToggleItem('Remember album art view', pref, 'libraryLayoutRememberAlbumArtView', () => { repaintWindow(); }, pref.libraryLayoutFullPreset);
		libraryLayoutMenu.appendTo(libraryMenu);
	}

	// * DESIGN * //
	libraryMenu.createRadioSubMenu('Design', ['Georgia-ReBORN', 'Traditional', 'Modern', 'Ultra-modern', 'Clean', 'List view', 'Covers (labels right)', 'Covers (labels bottom)', 'Covers (labels blend)', 'Flow mode'], pref.libraryDesign,
		['reborn', 'traditional', 'modern', 'ultraModern', 'clean', 'facet', 'coversLabelsRight', 'coversLabelsBottom', 'coversLabelsBlend', 'flowMode'], (design) => {
		pref.libraryDesign = design;
		switch (pref.libraryDesign) {
			case 'traditional':        panel.set('quickSetup',  0); break;
			case 'modern':             panel.set('quickSetup',  1); break;
			case 'ultraModern':        panel.set('quickSetup',  2); break;
			case 'clean':              panel.set('quickSetup',  3); break;
			case 'facet':              panel.set('quickSetup',  4); break;
			case 'coversLabelsRight':  panel.set('quickSetup',  5); break;
			case 'coversLabelsBottom': panel.set('quickSetup',  6); break;
			case 'coversLabelsBlend':  panel.set('quickSetup',  7); break;
			case 'artistLabelsRight':  panel.set('quickSetup',  8); break;
			case 'flowMode':           panel.set('quickSetup', 11); pref.libraryLayout = 'full'; break;
			case 'reborn':             panel.set('quickSetup', 12); break;
		}
	});

	// * THEME * //
	libraryMenu.createRadioSubMenu('Theme', ['Georgia-ReBORN', 'Dark', 'Blend', 'Light', 'Random', 'Cover'], pref.libraryTheme, [0, 1, 2, 3, 4, 5], (theme) => {
		pref.libraryTheme = theme;
		if      (pref.libraryTheme === 0) ppt.theme = 0;
		else if (pref.libraryTheme === 1) ppt.theme = 1;
		else if (pref.libraryTheme === 2) ppt.theme = 2;
		else if (pref.libraryTheme === 3) ppt.theme = 3;
		else if (pref.libraryTheme === 4) ppt.theme = 4;
		else if (pref.libraryTheme === 5) ppt.theme = 5;
		initTheme();
		library.on_colours_changed();
		panel.updateProp(1);
		themeColorAdjustments();
	});

	// * ALBUM ART * //
	const libraryAlbumArtMenu = new Menu('Album art');
	const libraryThumbnailSizeMenu = new Menu('Thumbnail size');
	libraryThumbnailSizeMenu.addRadioItems(['Auto (default)', 'Playlist', 'Mini', 'Small', 'Regular', 'Medium', 'Large', 'XL', 'XXL', 'MAX'], pref.libraryThumbnailSize, ['auto', 'playlist', 0, 1, 2, 3, 4, 5, 6, 7], (thumbnailSize) => {
		pref.libraryThumbnailSize = thumbnailSize;
		switch (pref.libraryThumbnailSize) {
			case 0: ppt.thumbNailSize = 0; break;
			case 1: ppt.thumbNailSize = 1; break;
			case 2: ppt.thumbNailSize = 2; break;
			case 3: ppt.thumbNailSize = 3; break;
			case 4: ppt.thumbNailSize = 4; break;
			case 5: ppt.thumbNailSize = 5; break;
			case 6: ppt.thumbNailSize = 6; break;
			case 7: ppt.thumbNailSize = 7; break;
		}
		setLibrarySize();
		window.Repaint();
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
		ppt.albumArtLabelType = style;
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
				g_properties.show_header = true;
				g_properties.auto_collapse = false;
				displayPlaylist = true;
				displayLibrary = true;
			}
			updatePlaylist();
			window.Repaint();
			if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			window.Repaint();
			if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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

	if (!context_menu) libraryMenu.appendTo(menu);
}


///////////////////////////
// * BIOGRAPHY OPTIONS * //
///////////////////////////
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
			biographyLayoutFullPreset();
			setBiographySize();
			initButtonState();
			window.Repaint();
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
		switch (pref.biographyTheme) {
			case 0: pptBio.theme = 0; break; // * User interface ( Default )
			case 1: pptBio.theme = 1; break; // * Dark
			case 2: pptBio.theme = 2; break; // * Blend
			case 3: pptBio.theme = 3; break; // * Light
		}
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
		switch (pref.biographyDisplay) {
			case 'Image+text':
				pptBio.style = 0;
				pptBio.img_only = false;
				pptBio.text_only = false;
				break;
			case 'Image':
				pptBio.img_only = true;
				pptBio.text_only = false;
				break;
			case 'Text':
				pptBio.img_only = false;
				pptBio.text_only = true;
				break;
		}
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
			window.Repaint();
		});
	}
	const lyricsDisplayMenu = new Menu('Display');
	lyricsDisplayMenu.addToggleItem('Show album art on lyrics', pref, 'lyricsAlbumArt', () => {
		initMainColors();
		repaintWindow();
	});
	lyricsDisplayMenu.addToggleItem('Larger current sync', pref, 'lyricsLargerCurrentSync', () => {
		pptBio.largerSyncLyricLine = pref.lyricsLargerCurrentSync;
		initLyrics();
		uiBio.updateProp(1);
		repaintWindow();
	});
	lyricsDisplayMenu.addToggleItem('Remember active lyrics state', pref, 'lyricsRememberActiveState', () => {
		if (pref.lyricsRememberActiveState) pref.displayLyrics = false;
	});
	lyricsDisplayMenu.addToggleItem('Remember lyrics panel state', pref, 'lyricsRememberPanelState');
	lyricsDisplayMenu.appendTo(lyricsMenu);
	lyricsMenu.addSeparator();
	lyricsMenu.addItem('Lyric information', false, () => { fb.RunMainMenuCommand('View/ESLyric/Panels/Lyric information'); });
	lyricsMenu.addItem('Lyric search', false, () => { fb.RunMainMenuCommand('View/ESLyric/Search...'); });
	lyricsMenu.addSeparator();
	lyricsMenu.addItem('Next lyric', false, () => {
		fb.RunMainMenuCommand('View/ESLyric/Panels/Delete lyric');
		const nextLyricSource = ((() => {
			let src = 0;
			const nextSrc = () => fb.RunMainMenuCommand('View/ESLyric/Panels/Select lyric/Next lyric');
			return () => {
				src++;
				repeatFunc(() => { nextSrc(); }, src);
				if (src > 9) src = 0;
				return src;
			};
		})());
		nextLyricSource();
		setTimeout(() => { fb.RunMainMenuCommand('View/ESLyric/Panels/Save lyric'); }, 1000);
		setTimeout(() => { initLyrics(); on_playback_seek(); }, 1000);
	});
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
function settingsOptions(menu) {
	const settingsMenu = new Menu('Settings');

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
					themePresetRandomPicker();
				}
			}
		};
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			if (DetectWine() || !DetectIE()) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			if (DetectWine() || !DetectIE()) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			if (DetectWine() || !DetectIE()) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			if (DetectWine() || !DetectIE()) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			if (DetectWine() || !DetectIE()) {  // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			try {
				let libaryDir;
				let playlistDir;
				const libv14 = `${fb.ProfilePath}library-v1.4`;
				const libv15 = `${fb.ProfilePath}library-v1.5`;
				const libv16 = `${fb.ProfilePath}library-v1.6`;
				const libv20 = `${fb.ProfilePath}library-v2.0`;
				const plistv14 = `${fb.ProfilePath}playlists-v1.4`;
				const plistv15 = `${fb.ProfilePath}playlists-v1.5`;
				const plistv16 = `${fb.ProfilePath}playlists-v1.6`;
				const plistv20 = `${fb.ProfilePath}playlists-v2.0`;
				let oldVersion = false;

				const checkFolders = async () => {
					if      (IsFolder(libv14)) { libaryDir = libv14; oldVersion = true; }
					else if (IsFolder(libv15)) { libaryDir = libv15; oldVersion = true; }
					else if (IsFolder(libv16)) { libaryDir = libv16; oldVersion = true; }
					else if (IsFolder(libv20)) { libaryDir = libv20; oldVersion = false; }
					if      (IsFolder(plistv14)) { playlistDir = plistv14; oldVersion = true; }
					else if (IsFolder(plistv15)) { playlistDir = plistv15; oldVersion = true; }
					else if (IsFolder(plistv16)) { playlistDir = plistv16; oldVersion = true; }
					else if (IsFolder(plistv20)) { playlistDir = plistv20; oldVersion = false; }
				};
				const createFolders = async () => {
					const profilePath = `${fb.ProfilePath}backup\\profile\\`;
					const themePath = `${fb.ProfilePath}backup\\profile\\georgia-reborn\\`;
					const indexDataPath = `${fb.ProfilePath}backup\\profile\\index-data\\`;
					CreateFolder(profilePath, true);
					CreateFolder(themePath, true);
					if (oldVersion) CreateFolder(indexDataPath, true);
				};
				const copyFolders = async () => {
					const myObject = new ActiveXObject('Scripting.FileSystemObject');
					const myLibrary = myObject.GetFolder(libaryDir);
					const myPlaylists = myObject.GetFolder(playlistDir);
					const myConfigs = myObject.GetFolder(`${fb.ProfilePath}georgia-reborn\\configs\\`);
					myLibrary.Copy(`${fb.ProfilePath}backup\\profile\\`, true);
					myPlaylists.Copy(`${fb.ProfilePath}backup\\profile\\`, true);
					myConfigs.Copy(`${fb.ProfilePath}backup\\profile\\georgia-reborn\\`, true);
					if (oldVersion) {
						const myIndexData = myObject.GetFolder(`${fb.ProfilePath}index-data`);
						myIndexData.Copy(`${fb.ProfilePath}backup\\profile\\`, true);
					} else {
						const myMetadb = myObject.GetFile(`${fb.ProfilePath}metadb.sqlite`);
						myMetadb.Copy(`${fb.ProfilePath}backup\\profile\\`, true);
					}
				};
				const start = async () => {
					await setThemeSettings(true);
					await checkFolders();
					await createFolders();
					await copyFolders();
				};
				start();
				console.log(`\n>>> Georgia-ReBORN theme backup has been successfully saved in ${fb.ProfilePath}backup\\ <<<\n\n`);
			} catch (e) {
				console.log('\n>>> Georgia-ReBORN theme backup was not successfull <<<\n\n');
			}
		};
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
			try {
				let libaryDir;
				let playlistDir;
				const libv14 = `${fb.ProfilePath}backup\\profile\\library-v1.4`;
				const libv15 = `${fb.ProfilePath}backup\\profile\\library-v1.5`;
				const libv16 = `${fb.ProfilePath}backup\\profile\\library-v1.6`;
				const libv20 = `${fb.ProfilePath}backup\\profile\\library-v2.0`;
				const plistv14 = `${fb.ProfilePath}backup\\profile\\playlists-v1.4`;
				const plistv15 = `${fb.ProfilePath}backup\\profile\\playlists-v1.5`;
				const plistv16 = `${fb.ProfilePath}backup\\profile\\playlists-v1.6`;
				const plistv20 = `${fb.ProfilePath}backup\\profile\\playlists-v2.0`;
				let oldVersion = false;

				const checkFolders = async () => {
					if      (IsFolder(libv14)) { libaryDir = libv14; oldVersion = true; }
					else if (IsFolder(libv15)) { libaryDir = libv15; oldVersion = true; }
					else if (IsFolder(libv16)) { libaryDir = libv16; oldVersion = true; }
					else if (IsFolder(libv20)) { libaryDir = libv20; oldVersion = false; }
					if      (IsFolder(plistv14)) { playlistDir = plistv14; oldVersion = true; }
					else if (IsFolder(plistv15)) { playlistDir = plistv15; oldVersion = true; }
					else if (IsFolder(plistv16)) { playlistDir = plistv16; oldVersion = true; }
					else if (IsFolder(plistv20)) { playlistDir = plistv20; oldVersion = false; }
				};

				const copyFolders = async () => {
					const myObject = new ActiveXObject('Scripting.FileSystemObject');
					const myLibrary = myObject.GetFolder(libaryDir);
					const myPlaylists = myObject.GetFolder(playlistDir);
					const myConfigs = myObject.GetFolder(`${fb.ProfilePath}backup\\profile\\georgia-reborn\\configs\\`);
					myLibrary.Copy(`${fb.ProfilePath}`, true);
					myPlaylists.Copy(`${fb.ProfilePath}`, true);
					myConfigs.Copy(`${fb.ProfilePath}georgia-reborn\\configs`, true);
					if (oldVersion) {
						const myIndexData = myObject.GetFolder(`${fb.ProfilePath}backup\\profile\\index-data`);
						myIndexData.Copy(`${fb.ProfilePath}`, true);
					} else {
						const myMetadb = myObject.GetFile(`${fb.ProfilePath}backup\\profile\\metadb.sqlite`);
						myMetadb.Copy(`${fb.ProfilePath}`, true);
					}
				};
				const start = async () => {
					await checkFolders();
					await copyFolders();
					await setThemeSettings();
					await setTimeout(() => { fb.RunMainMenuCommand('File/Restart'); }, 1000);
				};
				start();
				console.log('\n>>> Georgia-ReBORN theme backup has been successfully restored <<<\n\n');
			} catch (e) {
				console.log('\n>>> Georgia-ReBORN theme backup was not successfully restored <<<\n\n');
			}
		};
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
				await window.Reload();
			};
			start();
			console.log('\n>>> Default Georgia-ReBORN theme settings have been successfully loaded <<<\n\n');
		};
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.addSeparator();
	themeConfigMenu.addItem('Edit configuration file', false, () => {
		// runCmd(config.getPath()); // Not working in Wine/Linux
		OpenExplorer(`explorer /select, "${config.getPath()}"`, false);
	});
	themeConfigMenu.addItem('Reset configuration file', false, () => {
		const msg = 'Do you want to reset the config file to default?\n\nThis will set all settings to default.\nYou should probably make a backup first.\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			try { // Needed to prevent crash when there is no config file
				pref.customThemeSettings = false;
				config.resetConfiguration();
				setThemeSettings();
				windowHandler.layoutDefault();
				console.log(`\n>>> Georgia-ReBORN's ${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc file has been successfully reset to default. <<<\n\n`);
			} catch (e) { window.Reload(); }
		};
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, 'Yes');
		} else {
			popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
		}
	});
	themeConfigMenu.appendTo(settingsMenu);

	// * THEME PERFORMANCE * //
	settingsMenu.createRadioSubMenu('Theme performance', ['Lowest quality (fastest speed - very slow CPU)', 'Low quality', 'Balanced (Default)', 'High quality', 'Highest quality (slowest speed - very fast CPU)'], pref.themePerformance,
		['lowestQuality', 'lowQuality', 'balanced', 'highQuality', 'highestQuality'], (perf) => {
		function setThemePerformance(preset) {
			switch (preset) {
				case 'balanced': // Default
					pref.playerSize = 'small';
					autoDetectRes();
					pref.styleDefault = true;
					pref.playlistAutoScrollNowPlaying = false;
					pref.playlistSmoothScrolling = true;
					pref.libraryAutoScrollNowPlaying = false;
					ppt.smooth = true;
					pptBio.smooth = true;
					pref.showStyledTooltips = true;
					pref.showLogoOnStartup = true;
					pref.showHiResAudioBadge = false;
					pref.showPause = true;
					pref.seekbar = 'progressbar';
					pref.progressBarRefreshRate = 'variable';
					pref.peakmeterBarRefreshRate = 80;
					pref.waveformBarPaint = 'partial';
					pref.waveformBarPrepaint = true;
					pref.waveformBarPrepaintFront = Infinity;
					pref.waveformBarAnimate = true;
					pref.waveformBarBPM = true;
					pref.waveformBarRefreshRate = 200;
					pref.playlistLayout = 'normal';
					g_properties.show_album_art = true;
					pref.playlistTimeRemaining = false;
					pref.playlistRowHover = true;
					pref.showDiscArtStub = false;
					pref.noDiscArtStub = true;
					pref.displayDiscArt = true;
					pref.spinDiscArt = false;
					pref.spinDiscArtImageCount = 72;
					pref.spinDiscArtRedrawInterval = 75;
					clearInterval(discArtRotationTimer);
					discArtArray = [];
					pref.detailsAlbumArtOpacity = 255;
					pref.detailsAlbumArtDiscAreaOpacity = 255;
					pref.showGridTimeline_default = true;
					pref.showGridTimeline_artwork = true;
					pref.libraryLayout = 'normal';
					pref.libraryDesign = 'reborn';
					pref.libraryTheme = 0;
					ppt.albumArtShow = false;
					pref.libraryRowHover = true;
					pref.biographyLayout = 'normal';
					pref.biographyTheme = 0;
					pptBio.showFilmStrip = false;
					cfg.photoNum = 10;
					pref.lyricsAlbumArt = true;
					pref.lyricsRememberActiveState = false;
					ppt.albumArtDiskCache = true;
					ppt.albumArtPreLoad = false;
					pref.libraryAutoDelete = false;
					pref.biographyAutoDelete = false;
					pref.lyricsAutoDelete = false;
					pptBio.focusLoadRate = 1000;
					pptBio.focusLoadImmediate = false;
					break;
				case 'lowestQuality':
					pref.playerSize = 'small';
					pref.playerSize_HD_small = true;
					windowHandler.playerSize_HD_small();
					pref.styleDefault = true;
					pref.displayRes = 'HD';
					pref.playlistAutoScrollNowPlaying = false;
					pref.playlistSmoothScrolling = false;
					pref.libraryAutoScrollNowPlaying = false;
					ppt.smooth = false;
					pptBio.smooth = false;
					pref.showStyledTooltips = false;
					pref.showLogoOnStartup = false;
					pref.showHiResAudioBadge = false;
					pref.showPause = false;
					pref.seekbar = 'progressbar';
					pref.progressBarRefreshRate = 1000;
					pref.peakmeterBarRefreshRate = 200;
					pref.waveformBarPaint = 'full';
					pref.waveformBarPrepaint = false;
					pref.waveformBarPrepaintFront = 2;
					pref.waveformBarAnimate = false;
					pref.waveformBarBPM = false;
					pref.waveformBarRefreshRate = 1000;
					pref.playlistLayout = 'normal';
					g_properties.show_album_art = false;
					pref.playlistTimeRemaining = false;
					pref.playlistRowHover = false;
					pref.showDiscArtStub = false;
					pref.noDiscArtStub = false;
					pref.displayDiscArt = false;
					pref.spinDiscArt = false;
					pref.spinDiscArtImageCount = 36;
					pref.spinDiscArtRedrawInterval = 250;
					pref.showGridTimeline_default = false;
					pref.showGridTimeline_artwork = false;
					pref.libraryLayout = 'normal';
					pref.libraryDesign = 'reborn';
					pref.libraryTheme = 0;
					ppt.albumArtShow = false;
					pref.libraryRowHover = false;
					pref.biographyLayout = 'normal';
					pref.biographyTheme = 0;
					pptBio.showFilmStrip = false;
					cfg.photoNum = 1;
					pref.lyricsAlbumArt = false;
					pref.lyricsRememberActiveState = false;
					ppt.albumArtDiskCache = true;
					ppt.albumArtPreLoad = false;
					pptBio.focusLoadRate = 3000;
					break;
				case 'lowQuality':
					pref.playerSize = 'small';
					pref.styleDefault = true;
					pref.displayRes = 'HD';
					pref.showStyledTooltips = false;
					pref.seekbar = 'progressbar';
					pref.progressBarRefreshRate = 500;
					pref.peakmeterBarRefreshRate = 120;
					pref.waveformBarPaint = 'full';
					pref.waveformBarPrepaint = false;
					pref.waveformBarPrepaintFront = 2;
					pref.waveformBarAnimate = false;
					pref.waveformBarBPM = false;
					pref.waveformBarRefreshRate = 500;
					pref.playlistTimeRemaining = false;
					pref.showDiscArtStub = false;
					pref.noDiscArtStub = false;
					pref.displayDiscArt = false;
					pref.spinDiscArt = false;
					pref.spinDiscArtImageCount = 45;
					pref.spinDiscArtRedrawInterval = 125;
					pref.libraryTheme = 0;
					ppt.albumArtShow = false;
					pref.biographyTheme = 0;
					pptBio.showFilmStrip = false;
					cfg.photoNum = 5;
					ppt.albumArtDiskCache = true;
					ppt.albumArtPreLoad = false;
					pptBio.focusLoadRate = 2000;
					break;
				case 'highQuality':
					pref.playerSize = 'normal';
					pref.progressBarRefreshRate = 100;
					pref.peakmeterBarRefreshRate = 60;
					pref.waveformBarPaint = 'partial';
					pref.waveformBarPrepaint = true;
					pref.waveformBarPrepaintFront = Infinity;
					pref.waveformBarRefreshRate = 100;
					pref.waveformBarRefreshRateVar = false;
					pref.showDiscArtStub = true;
					pref.discArtStub = 'vinylBlack';
					pref.spinDiscArt = true;
					pref.spinDiscArtImageCount = 120;
					pref.spinDiscArtRedrawInterval = 40;
					setupRotationTimer();
					pref.libraryLayout = 'full';
					ppt.albumArtShow = true;
					pref.biographyLayout = 'full';
					cfg.photoNum = 15;
					ppt.albumArtDiskCache = true;
					ppt.albumArtPreLoad = true;
					pptBio.focusLoadRate = 750;
					break;
				case 'highestQuality':
					pref.playerSize = 'large';
					pref.progressBarRefreshRate = 30;
					pref.peakmeterBarRefreshRate = 30;
					pref.waveformBarPaint = 'partial';
					pref.waveformBarPrepaint = true;
					pref.waveformBarPrepaintFront = Infinity;
					pref.waveformBarRefreshRate = 30;
					pref.waveformBarRefreshRateVar = false;
					pref.showDiscArtStub = true;
					pref.discArtStub = 'vinylTrans';
					pref.spinDiscArt = true;
					pref.spinDiscArtImageCount = 180;
					pref.spinDiscArtRedrawInterval = 10;
					setupRotationTimer();
					pref.detailsAlbumArtDiscAreaOpacity = 178;
					pref.libraryLayout = 'full';
					ppt.albumArtShow = true;
					pref.biographyLayout = 'full';
					cfg.photoNum = 20;
					ppt.albumArtDiskCache = true;
					ppt.albumArtPreLoad = true;
					pptBio.focusLoadRate = 500;
					break;
			}
		}

		const msg = 'Do you want to change the theme performance?\n\nThese presets will change various theme settings!\nIt is recommended to save current theme settings\nto the config file. You should also make a backup\nof your playlists to be on the safe side!\n\n!!!WARNING!!!\n"High quality" and especially "Highest Quality"\ncan freeze foobar, depending how fast your CPU performs.\nIt does not matter if you are using a multi-core CPU,\nonly single-core CPU performance counts!\nIf your foobar is unresponsive, restart\nand change to a lighter preset.\n\nContinue?';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			pref.themePerformance = perf;
			setThemePerformance('balanced'); // First reset
			setThemePerformance(pref.themePerformance); // Then set
			window.Reload();
		}
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
	debugMenu.addToggleItem('Show playlist calls', timings, 'showPlaylistTraceCall', () => {
		if (timings.showPlaylistTraceCall) {
			trace_call = true;
		} else {
			trace_call = false;
			if (timings.showPlaylistTraceOnMove) {
				trace_on_move = false;
				timings.showPlaylistTraceOnMove = false;
			}
		}
	});
	debugMenu.addToggleItem('Show playlist moves', timings, 'showPlaylistTraceOnMove', () => {
		if (timings.showPlaylistTraceOnMove) {
			trace_on_move = true;
			trace_call = true;
			timings.showPlaylistTraceCall = true;
			return;
		}
		trace_on_move = false;
		trace_call = false;
		timings.showPlaylistTraceCall = false;
	});
	debugMenu.addToggleItem('Show playlist performance', timings, 'showPlaylistTraceListPerf', () => {
		trace_initialize_list_performance = !trace_initialize_list_performance;
	});
	debugMenu.addSeparator();
	debugMenu.addItem('Set system first launch to true', false, () => { // Used when creating new config files
		const msg = 'Do you really want to set system to first launch?\n\nContinue?\n\n\n';
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) return;
			window.SetProperty('Georgia-ReBORN - 16. System: First launch', true);
			g_properties.show_scrollbar = false;
			pref.showTopMenuCompact = true;
			pref.devTools = false;
			pref.disableRightClick = true;
			console.log('\n>>> Georgia-ReBORN has been set to system first launch <<<\n\n');
		}
		if (DetectWine() || !DetectIE()) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
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
