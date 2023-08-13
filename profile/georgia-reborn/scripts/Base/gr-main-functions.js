/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Main Functions                       * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-08-13                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////////////
// * MAIN - INITIALIZATION * //
///////////////////////////////
/**
 * Clears all now playing related UI strings.
 */
function clearUIVariables() {
	const showLowerBarVersion = pref[`showLowerBarVersion_${pref.layout}`];
	return {
		artist: '',
		tracknum: $(showLowerBarVersion ? pref.layout !== 'default' ? settings.stoppedString1acr : settings.stoppedString1 : ' ', undefined, true),
		title_lower: showLowerBarVersion ? ` ${$(settings.stoppedString2, undefined, true)}` : ' ',
		year: '',
		grid: [],
		time: showLowerBarVersion || updateAvailable ? lowerBarStoppedTime : ' '
	};
}


/**
 * Initializes the theme on startup or reload.
 */
function initMain() {
	console.log('initMain()');
	loadingTheme = true;
	str = clearUIVariables();
	ww = window.Width;
	wh = window.Height;

	artCache = new ArtCache(15);
	g_tooltip_timer = new TooltipTimer();
	tt = new TooltipHandler();
	playlistHistory = new PlaylistHistory(10);
	topMenu = new ButtonEventHandler();
	customMenu = new BaseControl();
	pauseBtn = new PauseButton();
	jumpSearch = new JumpSearch(ww, wh);
	progressBar = new ProgressBar(ww, wh);
	waveformBar = new WaveformBar(ww, wh);
	peakmeterBar = new PeakmeterBar(ww, wh);

	// * Layout safety check
	if (!['default', 'artwork', 'compact'].includes(pref.layout)) {
		window.SetProperty('Georgia-ReBORN - 05. Layout', 'default');
		pref.layout = 'default';
		display.layoutDefault();
	}

	// * Do auto-delete cache if enabled
	if (pref.libraryAutoDelete) deleteLibraryCache();
	if (pref.biographyAutoDelete) deleteBiographyCache();
	if (pref.lyricsAutoDelete) deleteLyrics();
	if (pref.waveformBarAutoDelete) deleteWaveformBarCache();

	lastAlbumFolder = '';
	lastPlaybackOrder = fb.PlaybackOrder;
	displayPanelOnStartup();
	setThemeColors();
	themeColorSet = true;

	if (pref.loadAsync) {
		on_size();	// Needed when loading async, otherwise just needed in fb.IsPlaying conditional
	}

	setGeometry();

	if (fb.IsPlaying && fb.GetNowPlaying()) {
		on_playback_new_track(fb.GetNowPlaying());
	}

	window.Repaint();	// Needed when loading async, otherwise superfluous

	// * Workaround so we can use the Edit menu or run fb.RunMainMenuCommand("Edit/Something...")
	// * when the panel has focus and a dedicated playlist viewer doesn't.
	plman.SetActivePlaylistContext(); // Once on startup

	if (pref.panelWidthAuto) {
		resizeArtwork(true);
		playlist.on_size(ww, wh);
	}
	if (!libraryInitialized) {
		initLibraryPanel();
		setLibrarySize();
	}
	if (!biographyInitialized) {
		initBiographyPanel();
		setBiographySize();
	}
	if (libraryInitialized && biographyInitialized) {
		setTimeout(() => {
			lib.initialise();
			panel.updateProp(1);
			uiBio.updateProp(1);
			initLibraryLayout();
			loadingThemeComplete = true;
		}, 100);
	}

	if (!pref.lyricsRememberPanelState) {
		pref.displayLyrics = false;
	}
	else if (pref.displayLyrics && pref.lyricsLayout === 'full') {
		displayPlaylist = !displayPlaylist;
		resizeArtwork(true);
	}
	if (pref.displayLyrics) {
		displayLyrics();
	}

	if (pref.theme === 'random' && pref.randomThemeAutoColor !== 'off') {
		getRandomThemeAutoColor();
	}
	if (pref.themeDayNightMode) {
		themeDayNightMode(new Date());
		console.log(`Theme day/night mode is active, current time is: ${themeDayNightMode(new Date())}. The schedule has been set to ${pref.themeDayNightMode}am (day) - ${pref.themeDayNightMode}pm (night).`);
	}

	initThemeFull = true;
	initCustomTheme();
	initTheme();
	DebugLog('\n>>> initTheme -> initMain <<<\n');
	loadingTheme = false;

	// * Restore backup workaround to successfully restore playlist files after foobar installation
	if (pref.restoreBackupPlaylist) {
		setTimeout(() => {
			restoreBackupPlaylist();
		}, !loadingTheme);
	}
}


/**
 * Initializes size and position when noAlbumArtStub is being displayed.
 */
function initNoAlbumArtSize() {
	const noAlbumArtSize = wh - geo.topMenuHeight - geo.lowerBarHeight;

	albumArtSize.x =
		pref.layout === 'default' &&  displayCustomThemeMenu && !displayPlaylist && !displayLibrary && !displayBiography ? ww * 0.3 :
		pref.layout === 'default' && !displayCustomThemeMenu && !displayPlaylist && !displayLibrary && !displayBiography ||
		pref.layout === 'artwork' &&  displayPlaylist ? ww :
		pref.panelWidthAuto ?
			pref.albumArtAlign === 'left' ? 0 :
			pref.albumArtAlign === 'leftMargin' ? ww / wh > 1.8 ? SCALE(40) : 0 :
			pref.albumArtAlign === 'center' ? Math.floor(ww * 0.25 - noAlbumArtSize * 0.5) :
			Math.floor(ww * 0.5 - noAlbumArtSize) :
		0;

	albumArtSize.y = geo.topMenuHeight;

	albumArtSize.w =
		pref.panelWidthAuto && noAlbumArtStub ? !fb.IsPlaying ? 0 : noAlbumArtSize :
		ww * 0.5;

	albumArtSize.h = noAlbumArtSize;
}


/**
 * Initializes everything necessary in all panels without the need of a reload.
 */
function initPanels() {
	// * Update Main
	createFonts();
	setGeometry();
	str.timeline = new Timeline(geo.timelineHeight);
	str.metadata_grid_tt = new MetadataGridTooltip(geo.metadataGridTooltipHeight);
	str.lowerBar_tt = new LowerBarTooltip();
	jumpSearch = new JumpSearch(ww, wh);
	volumeBtn = new VolumeBtn();
	progressBar = new ProgressBar(ww, wh);
	peakmeterBar = new PeakmeterBar(ww, wh);
	peakmeterBar.on_size(ww, wh);
	waveformBar = new WaveformBar(ww, wh);
	waveformBar.updateBar();
	createButtonImages();
	createButtonObjects(ww, wh);
	resizeArtwork(true);
	initButtonState();

	// * Update Playlist
	createPlaylistFonts();
	rescalePlaylist(true);
	initPlaylist();
	playlist.on_size(ww, wh);

	setTimeout(() => {
		// * Update Library
		setLibrarySize();
		panel.tree.y = panel.search.h;
		pop.createImages();
		panel.zoomReset();
		initLibraryLayout();

		// * Update Biography
		setBiographySize();
		uiBio.setSbar();
		butBio.createImages();
		butBio.resetZoom();
		initBiographyColors();
		initBiographyLayout();
	}, loadingThemeComplete);
}


/**
 * Initializes size and position of the current panel when using pref.panelWidthAuto.
 */
function initPanelWidthAuto() {
	resizeArtwork(true);
	if (displayPlaylist) playlist.on_size(ww, wh);
	if (displayLibrary) setLibrarySize();
	if (displayBiography) setBiographySize();
}


/**
 * Initializes the theme when updating colors.
 */
function initTheme() {
	const themeProfiler = timings.showDebugTiming ? fb.CreateProfiler('initTheme') : null;

	const fullInit =
		initThemeFull ||
		ppt.theme !== 0 || pptBio.theme !== 0 ||
		pref.theme === 'reborn' || pref.theme === 'random' ||
		pref.styleBlackAndWhiteReborn || pref.styleBlackReborn;

	// * SETUP COLORS * //
	setImageBrightness();
	if (pref.styleBlackAndWhiteReborn) initBlackAndWhiteReborn();
	if (pref.theme === 'random' && !isStreaming && !isPlayingCD) getRandomThemeColor();
	if (noAlbumArtStub || isStreaming || isPlayingCD) setNoAlbumArtColors();
	if ((pref.styleBlend || pref.styleBlend2 || pref.styleProgressBarFill === 'blend') && albumArt) setStyleBlend();
	setBackgroundColorDefinition();

	// * INIT COLORS * //
	initPlaylistColors();
	if (fullInit && pref.playlistRowHover) playlist.title_color_change();
	initLibraryColors();
	if (fullInit && img.labels.overlayDark) ui.getItemColours(); // Library
	if (fullInit) uiBio.getColours(); // Biography
	initBiographyColors();
	if (fullInit) txt.getText(true); // Biography
	initMainColors();
	initStyleColors();
	initChronflowColors();

	// * POST-INIT COLOR ADJUSTMENTS * //
	themeColorAdjustments();
	if (pref.themeBrightness !== 'default') adjustThemeBrightness(pref.themeBrightness);

	// * UPDATE BUTTONS * //
	if (!fullInit) return;
	playlist.initScrollbar();
	sbar.setCol(); // Library
	pop.createImages(); // Library
	but.createImages(); // Library
	but.refresh(true); // Library
	alb_scrollbar.setCol(); // Biography
	art_scrollbar.setCol(); // Biography
	butBio.createImages('all'); // Biography
	imgBio.createImages(); // Biography
	createButtonImages(); // Main
	createButtonObjects(ww, wh); // Main
	initButtonState(); // Main

	// * REFRESH * //
	window.Repaint();

	if (timings.showDebugTiming) themeProfiler.Print();
}


/**
 * Initializes %GR_THEME%, %GR_STYLE%, %GR_PRESET% tags in music files and sets them, used in on_playback_new_track.
 */
function initThemeTags() {
	const customTheme  = $('[%GR_THEME%]');
	const customStyle  = $('[%GR_STYLE%]');
	const customPreset = $('[%GR_PRESET%]');

	themePresetIndicator = false;

	// * Restore last theme state
	if (pref.presetSelectMode === 'default' && themeRestoreState) {
		DebugLog('\n>>> initThemeTags restore <<<\n');
		resetStyle('all');
		resetTheme();
		restoreThemeStylePreset(); // * Retore saved pref settings
		if (pref.savedPreset !== false) setThemePreset(pref.savedPreset);
		initStyleState();
		themeRestoreState = false;
	}

	// * Skip also restore on next call
	if (pref.theme === pref.savedTheme && !customTheme && !customStyle && !customPreset) {
		DebugLog('\n>>> initThemeTags skipped <<<\n');
		restoreThemeStylePreset(true); // * Reset saved pref settings
		themeRestoreState = false;
		return;
	}

	// * 1. Set preset
	if (customPreset.length) {
		DebugLog('\n>>> initThemeTags -> %GR_PRESET% loaded <<<');
		pref.preset = customPreset;
		setThemePreset(customPreset);
		themeRestoreState = true;
	}
	// * 2. Set theme
	else if (customTheme.length) {
		DebugLog('\n>>> initThemeTags -> %GR_THEME% loaded <<<');
		pref.theme = customTheme;
		resetTheme();
		themeRestoreState = true;
	}
	// * 3. Set styles
	if (customStyle.length && !customPreset.length) {
		DebugLog('\n>>> initThemeTags -> %GR_STYLE% loaded <<<');
		resetStyle('all');
		for (const style of customStyle.split(/(?:,|;| )+/)) {
			switch (style) {
				case 'bevel': pref.styleBevel = true; break;
				case 'blend': pref.styleBlend = true; break;
				case 'blend2': pref.styleBlend2 = true; break;
				case 'gradient': pref.styleGradient = true; break;
				case 'gradient2': pref.styleGradient2 = true; break;
				case 'alternative': pref.styleAlternative = true; break;
				case 'alternative2': pref.styleAlternative2 = true; break;
				case 'blackAndWhite': pref.styleBlackAndWhite = true; break;
				case 'blackAndWhite2': pref.styleBlackAndWhite2 = true; break;
				case 'blackReborn': pref.styleBlackReborn = true; break;
				case 'rebornWhite': pref.styleRebornWhite = true; break;
				case 'rebornBlack': pref.styleRebornBlack = true; break;
				case 'rebornFusion': pref.styleRebornFusion = true; break;
				case 'rebornFusion2': pref.styleRebornFusion2 = true; break;
				case 'randomPastel': pref.styleRandomPastel = true; break;
				case 'randomDark': pref.styleRandomDark = true; break;
				case 'rebornFusionAccent': pref.styleRebornFusionAccent = true; break;
				case 'topMenuButtons=filled': pref.styleTopMenuButtons = 'filled'; break;
				case 'topMenuButtons=bevel': pref.styleTopMenuButtons = 'bevel'; break;
				case 'topMenuButtons=inner': pref.styleTopMenuButtons = 'inner'; break;
				case 'topMenuButtons=emboss': pref.styleTopMenuButtons = 'emboss'; break;
				case 'topMenuButtons=minimal': pref.styleTopMenuButtons = 'minimal'; break;
				case 'transportButtons=bevel': pref.styleTransportButtons = 'bevel'; break;
				case 'transportButtons=inner': pref.styleTransportButtons = 'inner'; break;
				case 'transportButtons=emboss': pref.styleTransportButtons = 'emboss'; break;
				case 'transportButtons=minimal': pref.styleTransportButtons = 'minimal'; break;
				case 'progressBarDesign=rounded': pref.styleProgressBarDesign = 'rounded'; break;
				case 'progressBarDesign=lines': pref.styleProgressBarDesign = 'lines'; break;
				case 'progressBarDesign=blocks': pref.styleProgressBarDesign = 'blocks'; break;
				case 'progressBarDesign=dots': pref.styleProgressBarDesign = 'dots'; break;
				case 'progressBarDesign=thin': pref.styleProgressBarDesign = 'thin'; break;
				case 'progressBarBg=bevel': pref.styleProgressBar = 'bevel'; break;
				case 'progressBarBg=inner': pref.styleProgressBar = 'inner'; break;
				case 'progressBarFill=bevel': pref.styleProgressBarFill = 'bevel'; break;
				case 'progressBarFill=inner': pref.styleProgressBarFill = 'inner'; break;
				case 'progressBarFill=blend': pref.styleProgressBarFill = 'blend'; break;
				case 'volumeBarDesign=rounded': pref.styleVolumeBarDesign = 'rounded'; break;
				case 'volumeBarBg=bevel': pref.styleVolumeBar = 'bevel'; break;
				case 'volumeBarBg=inner': pref.styleVolumeBar = 'inner'; break;
				case 'volumeBarFill=bevel': pref.styleVolumeBarFill = 'bevel'; break;
				case 'volumeBarFill=inner': pref.styleVolumeBarFill = 'bevel'; break;
			}
		}
		themeRestoreState = true;
	}

	// * 4. Update theme
	if (!customPreset.length) { // Prevent double initialization for theme presets to save performance, updateStyle() already handled in setThemePreset()
		updateStyle();
	}
}


/**
 * Initializes the custom themes to check if any are currently active.
 */
function initCustomTheme() {
	const customThemes = {
		custom01: customTheme01,
		custom02: customTheme02,
		custom03: customTheme03,
		custom04: customTheme04,
		custom05: customTheme05,
		custom06: customTheme06,
		custom07: customTheme07,
		custom08: customTheme08,
		custom09: customTheme09,
		custom10: customTheme10
	};

	if (pref.theme in customThemes) {
		customColor = customThemes[pref.theme];
	}
}


/**
 * Initializes styles to check if any are currently active, used in top menu Options > Style.
 */
function initStyleState() {
	const styles = [
		pref.styleBevel,
		pref.styleBlend,
		pref.styleBlend2,
		pref.styleGradient,
		pref.styleGradient2,
		pref.styleAlternative,
		pref.styleAlternative2,
		pref.styleBlackAndWhite,
		pref.styleBlackAndWhite2,
		pref.styleBlackAndWhiteReborn,
		pref.styleBlackReborn,
		pref.styleRebornWhite,
		pref.styleRebornBlack,
		pref.styleRebornFusion,
		pref.styleRebornFusion2,
		pref.styleRebornFusionAccent,
		pref.styleRandomPastel,
		pref.styleRandomDark,
		pref.styleTopMenuButtons !== 'default',
		pref.styleTransportButtons !== 'default',
		pref.styleProgressBarDesign !== 'default',
		pref.styleProgressBar !== 'default',
		pref.styleProgressBarFill !== 'default',
		pref.styleVolumeBarDesign !== 'default',
		pref.styleVolumeBar !== 'default',
		pref.styleVolumeBarFill !== 'default'
	];

	pref.styleDefault = !styles.some(style => style);
}


/**
 * Resets the current player size, used in top menu Options > Player size.
 */
function resetPlayerSize() {
	pref.playerSize_HD_small   = false;
	pref.playerSize_HD_normal  = false;
	pref.playerSize_HD_large   = false;
	pref.playerSize_QHD_small  = false;
	pref.playerSize_QHD_normal = false;
	pref.playerSize_QHD_large  = false;
	pref.playerSize_4K_small   = false;
	pref.playerSize_4K_normal  = false;
	pref.playerSize_4K_large   = false;
}


/**
 * Resets the theme when changing to a different one, used in top menu Options > Theme.
 */
function resetTheme() {
	initThemeFull = true;
	// * Themes that don't have these styles will be reset to default
	if (pref.theme !== 'white' && (pref.styleBlackAndWhite || pref.styleBlackAndWhite2 || pref.styleBlackAndWhiteReborn) ||
		pref.theme !== 'black' && pref.styleBlackReborn ||
		pref.theme !== 'reborn' && (pref.styleRebornWhite || pref.styleRebornBlack || pref.styleRebornFusion || pref.styleRebornFusion2 || pref.styleRebornFusionAccent) ||
		pref.theme !== 'reborn' && pref.theme !== 'random' && pref.theme !== 'blue' && pref.theme !== 'darkblue' && pref.theme !== 'red' && (pref.styleGradient || pref.styleGradient2)) {
		resetStyle('all');
	}
	getThemeColors(albumArt);
	// * Update default theme colors when nothing is playing and changing themes
	if (!fb.IsPlaying) setThemeColors();
}


/**
 * Resets all styles or grouped styles when changing styles. Used in top menu Options > Style.
 * @param {string} group Specifies which group of styles to reset:
 * - 'all'
 * - 'group_one'
 * - 'group_two'
 */
function resetStyle(group) {
	if (group === 'all') {
		initThemeFull                 = true;
		pref.styleDefault             = true;
		pref.styleBevel               = false;
		pref.styleBlend               = false;
		pref.styleBlend2              = false;
		pref.styleGradient            = false;
		pref.styleGradient2           = false;
		pref.styleAlternative         = false;
		pref.styleAlternative2        = false;
		pref.styleBlackAndWhite       = false;
		pref.styleBlackAndWhite2      = false;
		pref.styleBlackAndWhiteReborn = false;
		pref.styleBlackReborn         = false;
		pref.styleRebornWhite         = false;
		pref.styleRebornBlack         = false;
		pref.styleRebornFusion        = false;
		pref.styleRebornFusion2       = false;
		pref.styleRebornFusionAccent  = false;
		pref.styleRandomPastel        = false;
		pref.styleRandomDark          = false;
		pref.styleRandomAutoColor     = 'off';
		pref.styleTopMenuButtons      = 'default';
		pref.styleTransportButtons    = 'default';
		pref.styleProgressBarDesign   = 'default';
		pref.styleProgressBar         = 'default';
		pref.styleProgressBarFill     = 'default';
		pref.styleVolumeBarDesign     = 'default';
		pref.styleVolumeBar           = 'default';
		pref.styleVolumeBarFill       = 'default';
		pref.themeBrightness          = 'default';
	}
	else if (group === 'group_one') {
		pref.styleBlend     = false;
		pref.styleBlend2    = false;
		pref.styleGradient  = false;
		pref.styleGradient2 = false;
	}
	else if (group === 'group_two') {
		pref.styleAlternative         = false;
		pref.styleAlternative2        = false;
		pref.styleBlackAndWhite       = false;
		pref.styleBlackAndWhite2      = false;
		pref.styleBlackAndWhiteReborn = false;
		pref.styleBlackReborn         = false;
		pref.styleRebornWhite         = false;
		pref.styleRebornBlack         = false;
		pref.styleRebornFusion        = false;
		pref.styleRebornFusion2       = false;
		pref.styleRebornFusionAccent  = false;
		pref.styleRandomPastel        = false;
		pref.styleRandomDark          = false;
	}
}


/**
 * Restores theme, style, preset after custom %GR_THEME%, %GR_STYLE%, %GR_PRESET% usage or in theme sandbox.
 * Used in initThemeTags() and theme sandbox options.
 * @param {boolean} reset Determines whether to reset the theme style preset or restore it.
 */
function restoreThemeStylePreset(reset) {
	if (reset) {
		pref.savedTheme = pref.theme;
		pref.savedStyleBevel = pref.styleBevel;
		pref.savedStyleBlend = pref.styleBlend;
		pref.savedStyleBlend2 = pref.styleBlend2;
		pref.savedStyleGradient = pref.styleGradient;
		pref.savedStyleGradient2 = pref.styleGradient2;
		pref.savedStyleAlternative = pref.styleAlternative;
		pref.savedStyleAlternative2 = pref.styleAlternative2;
		pref.savedStyleBlackAndWhite = pref.styleBlackAndWhite;
		pref.savedStyleBlackAndWhite2 = pref.styleBlackAndWhite2;
		pref.savedStyleBlackAndWhiteReborn = pref.styleBlackAndWhiteReborn;
		pref.savedStyleBlackReborn = pref.styleBlackReborn;
		pref.savedStyleRebornWhite = pref.styleRebornWhite;
		pref.savedStyleRebornBlack = pref.styleRebornBlack;
		pref.savedStyleRebornFusion = pref.styleRebornFusion;
		pref.savedStyleRebornFusion2 = pref.styleRebornFusion2;
		pref.savedStyleRebornFusionAccent = pref.styleRebornFusionAccent;
		pref.savedStyleRandomPastel = pref.styleRandomPastel;
		pref.savedStyleRandomDark = pref.styleRandomDark;
		pref.savedStyleRandomAutoColor = pref.styleRandomAutoColor;
		pref.savedStyleTopMenuButtons = pref.styleTopMenuButtons;
		pref.savedStyleTransportButtons = pref.styleTransportButtons;
		pref.savedStyleProgressBarDesign = pref.styleProgressBarDesign;
		pref.savedStyleProgressBar = pref.styleProgressBar;
		pref.savedStyleProgressBarFill = pref.styleProgressBarFill;
		pref.savedStyleVolumeBarDesign = pref.styleVolumeBarDesign;
		pref.savedStyleVolumeBar = pref.styleVolumeBar;
		pref.savedStyleVolumeBarFill = pref.styleVolumeBarFill;
		pref.savedThemeBrightness = pref.themeBrightness;
		pref.savedPreset = false;
	} else {
		pref.theme = pref.savedTheme;
		pref.styleBevel = pref.savedStyleBevel;
		pref.styleBlend = pref.savedStyleBlend;
		pref.styleBlend2 = pref.savedStyleBlend2;
		pref.styleGradient = pref.savedStyleGradient;
		pref.styleGradient2 = pref.savedStyleGradient2;
		pref.styleAlternative = pref.savedStyleAlternative;
		pref.styleAlternative2 = pref.savedStyleAlternative2;
		pref.styleBlackAndWhite = pref.savedStyleBlackAndWhite;
		pref.styleBlackAndWhite2 = pref.savedStyleBlackAndWhite2;
		pref.styleBlackAndWhiteReborn = pref.savedStyleBlackAndWhiteReborn;
		pref.styleBlackReborn = pref.savedStyleBlackReborn;
		pref.styleRebornWhite = pref.savedStyleRebornWhite;
		pref.styleRebornBlack = pref.savedStyleRebornBlack;
		pref.styleRebornFusion = pref.savedStyleRebornFusion;
		pref.styleRebornFusion2 = pref.savedStyleRebornFusion2;
		pref.styleRebornFusionAccent = pref.savedStyleRebornFusionAccent;
		pref.styleRandomPastel = pref.savedStyleRandomPastel;
		pref.styleRandomDark = pref.savedStyleRandomDark;
		pref.styleRandomAutoColor = pref.savedStyleRandomAutoColor;
		pref.styleTopMenuButtons = pref.savedStyleTopMenuButtons;
		pref.styleTransportButtons = pref.savedStyleTransportButtons;
		pref.styleProgressBarDesign = pref.savedStyleProgressBarDesign;
		pref.styleProgressBar = pref.savedStyleProgressBar;
		pref.styleProgressBarFill = pref.savedStyleProgressBarFill;
		pref.styleVolumeBarDesign = pref.savedStyleVolumeBarDesign;
		pref.styleVolumeBar = pref.savedStyleVolumeBar;
		pref.styleVolumeBarFill = pref.savedStyleVolumeBarFill;
		pref.themeBrightness = pref.savedThemeBrightness;
		pref.preset = pref.savedPreset;
	}
}


/**
 * Sets the chosen style based by its current state. Used when changing styles in top menu Options > Style.
 * @param {string} style The selected style.
 * @param {boolean} state The state of the selected style will be either activated or deactivated.
 */
function setStyle(style, state) {
	switch (style) {
		case 'blend': resetStyle('group_one'); pref.styleBlend = state; break;
		case 'blend2':  resetStyle('group_one'); pref.styleBlend2 = state; break;
		case 'gradient': resetStyle('group_one'); pref.styleGradient = state; break;
		case 'gradient2': resetStyle('group_one'); pref.styleGradient2 = state; break;
		case 'alternative': resetStyle('group_two'); pref.styleAlternative = state; break;
		case 'alternative2': resetStyle('group_two'); pref.styleAlternative2 = state; break;
		case 'blackAndWhite': resetStyle('group_two'); pref.styleBlackAndWhite = state; break;
		case 'blackAndWhite2': resetStyle('group_two'); pref.styleBlackAndWhite2 = state; break;
		case 'blackAndWhiteReborn': resetStyle('group_two'); pref.styleBlackAndWhiteReborn = state; break;
		case 'blackReborn': resetStyle('group_two'); pref.styleBlackReborn = state; break;
		case 'rebornWhite': resetStyle('group_two'); pref.styleRebornWhite = state; pref.themeBrightness = 'default'; break;
		case 'rebornBlack': resetStyle('group_two'); pref.styleRebornBlack = state; pref.themeBrightness = 'default'; break;
		case 'rebornFusion': resetStyle('group_two'); pref.styleRebornFusion = state; break;
		case 'rebornFusion2': resetStyle('group_two'); pref.styleRebornFusion2 = state; break;
		case 'rebornFusionAccent': resetStyle('group_two'); pref.styleRebornFusionAccent = state; break;
		case 'randomPastel': resetStyle('group_two'); pref.styleRandomPastel = state; break;
		case 'randomDark': resetStyle('group_two'); pref.styleRandomDark = state; break;
	}
}


/**
 * Sets a new random theme preset.
 */
function setRandomThemePreset() {
	if (pref.presetSelectMode === 'theme') {
		setThemePresetSelection(false, true);
	}
	if ((!['off', 'track'].includes(pref.presetAutoRandomMode) && pref.presetSelectMode === 'harmonic' ||
		pref.presetAutoRandomMode === 'dblclick' && pref.presetSelectMode === 'theme') && !doubleClicked) {
		getRandomThemePreset();
	}
}


/**
 * Activates or deactivates all theme presets selection, used in top menu Options > Preset > Select presets.
 * @param {boolean} state The state of theme presets selection will be set to true or false.
 * @param {boolean} presetSelectModeTheme The selection of theme specified presets.
 */
function setThemePresetSelection(state, presetSelectModeTheme) {
	pref.presetSelectWhite     = state;
	pref.presetSelectBlack     = state;
	pref.presetSelectReborn    = state;
	pref.presetSelectRandom    = state;
	pref.presetSelectBlue      = state;
	pref.presetSelectDarkblue  = state;
	pref.presetSelectRed       = state;
	pref.presetSelectCream     = state;
	pref.presetSelectNblue     = state;
	pref.presetSelectNgreen    = state;
	pref.presetSelectNred      = state;
	pref.presetSelectNgold     = state;
	pref.presetSelectCustom    = state;

	if (presetSelectModeTheme) {
		switch (pref.savedTheme) {
			case 'white': pref.presetSelectWhite = true; break;
			case 'black': pref.presetSelectBlack = true; break;
			case 'reborn': pref.presetSelectReborn = true; break;
			case 'random': pref.presetSelectRandom = true; break;
			case 'blue': pref.presetSelectBlue = true; break;
			case 'darkblue': pref.presetSelectDarkblue = true; break;
			case 'red': pref.presetSelectRed = true; break;
			case 'cream': pref.presetSelectCream = true; break;
			case 'nblue': pref.presetSelectNblue = true; break;
			case 'ngreen': pref.presetSelectNgreen = true; break;
			case 'nred':  pref.presetSelectNred = true; break;
			case 'ngold': pref.presetSelectNgold = true; break;
			case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
			case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
				pref.presetSelectCustom = true; break;
		}
	}
}


/**
 * Sets the theme to a factory reset state, used on the very first foobar start after installation or when resetting the theme.
 */
async function systemFirstLaunch() {
	if (!pref.systemFirstLaunch) return;

	await initMain();
	await setThemeSettings();
	await initMain();
	await display.autoDetectRes();

	pref.systemFirstLaunch = false;
}


/**
 * Updates the theme when changing styles, used in top menu Options > Style.
 */
function updateStyle() {
	initThemeFull = true;

	if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
		// * Update col.primary for dynamic themes
		if (fb.IsPlaying) {
			getThemeColors(albumArt);
		} else {
			setThemeColors();
		}
	}

	initTheme();
	DebugLog('\n>>> initTheme -> updateStyle <<<\n');
	if (pref.theme === 'random' && pref.randomThemeAutoColor !== 'off') getRandomThemeAutoColor();
	initStyleState();
	initThemePresetState();
	initButtonState();
}


/////////////////////////
// * MAIN - CONTROLS * //
/////////////////////////
/**
 * Displays the panel, mostly used for the custom menu.
 * @param {string} panel The panel to display:
 * - 'playlist'
 * - 'details'
 * - 'library'
 * - 'biography'
 * - 'lyrics'
 */
function displayPanel(panel) {
	switch (panel) {
		case 'playlist':  displayPlaylist =  true; displayDetails = false; displayLibrary = false; displayBiography = false; pref.displayLyrics = false; break;
		case 'details':   displayPlaylist = false; displayDetails =  true; displayLibrary = false; displayBiography = false; pref.displayLyrics = false; break;
		case 'library':   displayPlaylist = false; displayDetails = false; displayLibrary =  true; displayBiography = false; pref.displayLyrics = false; break;
		case 'biography': displayPlaylist = false; displayDetails = false; displayLibrary = false; displayBiography =  true; pref.displayLyrics = false; break;
		case 'lyrics':    displayPlaylist =  true; displayDetails = false; displayLibrary = false; displayBiography =  true; pref.displayLyrics = true;  break;
	}
	resizeArtwork(true);
	initButtonState();
}


/**
 * Displays the set panel ( Options > Player controls > Panel > Show panel on startup ) when starting foobar, used in initMain().
 */
function displayPanelOnStartup() {
	// * Added additional conditions to show Playlist and not Details in Compact layout if Playlist is not displayed on startup
	// * while starting in Compact layout, this also fixes ugly switch from Default to Compact layout
	if (pref.showPanelOnStartup === 'cover' && pref.layout === 'artwork') {
		displayPlaylist = false;
	}
	else if (pref.showPanelOnStartup === 'playlist' || pref.layout === 'compact') {
		if (pref.layout === 'artwork') displayPlaylistArtwork = true;
		else displayPlaylist = true;
	}
	else if (pref.showPanelOnStartup === 'details' && pref.layout !== 'compact') {
		displayPlaylist = pref.layout === 'artwork';
	}
	else if (pref.showPanelOnStartup === 'library' && pref.layout !== 'compact') {
		displayLibrary = true;
		if (pref.libraryLayout === 'split') displayPlaylist = true;
	}
	else if (pref.showPanelOnStartup === 'biography' && pref.layout !== 'compact') {
		displayPlaylist = true;
		displayBiography = true;
	}
	else if (pref.showPanelOnStartup === 'lyrics' && pref.layout !== 'compact') {
		displayLyrics();
	}
}


///////////////////////
// * MAIN - TIMERS * //
///////////////////////
/**
 * Repaints rectangles on the seekbar for real time update.
 */
function refreshSeekbar() {
	// * Time
	window.RepaintRect(lowerBarTimeX, lowerBarTimeY, lowerBarTimeW, lowerBarTimeH, pref.spinDiscArt && !pref.displayLyrics);

	if (pref.seekbar === 'waveformbar') return;

	// * Progress bar
	const x = pref.layout !== 'default' ? SCALE(18) : SCALE(38);
	const y = (pref.seekbar === 'peakmeterbar' ? peakmeterBarY - SCALE(4) : progressBarY) - SCALE(2);
	const w = pref.layout !== 'default' ? ww - SCALE(36) : ww - SCALE(76);
	const h = (pref.seekbar === 'peakmeterbar' ? geo.peakmeterBarHeight + SCALE(8) : geo.progBarHeight) + SCALE(4);
	window.RepaintRect(x, y, w, h, pref.spinDiscArt && !pref.displayLyrics);
}


/**
 * Sets a given timer interval to update the progress bar.
 */
function setProgressBarRefresh() {
	DebugLog('setProgressBarRefresh()');
	if (fb.PlaybackLength > 0) {
		const refreshRate = {
			// We want to update the progress bar for every pixel so divide total time by number of pixels in progress bar
			variable: Math.abs(Math.ceil(1000 / ((ww - SCALE(80)) / fb.PlaybackLength))),
			1000: 1000,
			500: 500,
			333: 333,
			250: 250,
			200: 200,
			150: 150,
			120: 120,
			100: 100,
			80: 80,
			60: 60,
			30: 30
		};

		progressBarTimerInterval = refreshRate[pref.seekbar === 'peakmeterbar' ? pref.peakmeterBarRefreshRate : pref.progressBarRefreshRate];

		if (pref.progressBarRefreshRate === 'variable') {
			while (progressBarTimerInterval > 500) { // We want even multiples of the base progressBarTimerInterval, so that the progress bar always updates as smoothly as possible
				progressBarTimerInterval = Math.floor(progressBarTimerInterval / 2);
			}
			while (progressBarTimerInterval < 32) { // Roughly 30fps
				progressBarTimerInterval *= 2;
			}
		}
	}
	else { // * Radio streaming
		progressBarTimerInterval = 1000;
	}

	if (timings.showDebugTiming) console.log(`Progress bar will update every ${progressBarTimerInterval}ms or ${1000 / progressBarTimerInterval} times per second.`);

	if (progressBarTimer) clearInterval(progressBarTimer);
	progressBarTimer = null;

	if (!fb.IsPaused) {
		progressBarTimer = setInterval(() => {
			refreshSeekbar();
		}, progressBarTimerInterval || 1000);
	}
}


/**
 * Checks and changes the theme to white ( day ) or black ( night ), controlled by OS clock and pref.themeDayNightMode value.
 * @param {Date} date The `Date` object that represents the current date and time.
 * @returns {string} The current time in the format "hours:minutes am/pm".
 */
function themeDayNightMode(date) {
	if (!pref.themeDayNightMode || ((pref.theme === 'reborn' && (pref.styleRebornWhite || pref.styleRebornBlack) || pref.theme === 'random')) ||
		pref.styleBlackAndWhite || pref.styleBlackAndWhite2 || pref.styleBlackAndWhiteReborn) {
		return;
	}

	let hours = date.getHours();
	let minutes = date.getMinutes();
		hours %= 12;
		hours = hours || 12;
		minutes = minutes < 10 ? `0${minutes}` : minutes;

	const time = hours >= 12 ? 'pm' : 'am';

	const day =
		hours >= pref.themeDayNightMode && time === 'am' && (hours !== 12 && time === 'am') ||
		hours === 12 && time === 'pm' || hours < pref.themeDayNightMode && time === 'pm';

	pref.theme = day ? 'white' : 'black';

	return `${hours}:${minutes} ${time}`;
}


////////////////////////
// * MAIN - HELPERS * //
////////////////////////
/**
 * Deletes the Biography cache on auto or manual usage.
 */
function deleteBiographyCache() {
	try { fso.DeleteFolder(pref.customBiographyDir ? `${globals.customBiographyDir}\\*.*` : `${fb.ProfilePath}cache\\biography\\biography-cache`); }
	catch (e) {}
}


/**
 * Deletes the Library cache on auto or manual usage.
 */
function deleteLibraryCache() {
	try { fso.DeleteFolder(pref.customLibraryDir ? `${globals.customLibraryDir}\\*.*` : `${fb.ProfilePath}cache\\library\\library-tree-cache`); }
	catch (e) {}
}


/**
 * Deletes the Lyrics cache on auto or manual usage.
 */
function deleteLyrics() {
	try { fso.DeleteFile(pref.customLyricsDir ? `${globals.customLyricsDir}\\*.*` : `${fb.ProfilePath}cache\\lyrics\\*.*`); }
	catch (e) {}
}


/**
 * Deletes the Waveform bar cache on auto or manual usage.
 */
function deleteWaveformBarCache() {
	try { fso.DeleteFolder(pref.customWaveformBarDir ? `${globals.customWaveformBarDir}\\*.*` : `${fb.ProfilePath}cache\\waveform\\*.*`); }
	catch (e) {}
}


/**
 * Makes or restores a theme backup.
 * @param {boolean} make Should a theme backup be made.
 * @param {boolean} restore Should a theme backup be restored.
 */
function manageBackup(make, restore) {
	const backupPath = `${fb.ProfilePath}backup\\profile\\`;
	const cfgPathFb  = `${fb.ProfilePath}configuration`;
	const dspPathFb  = `${fb.ProfilePath}dsp-presets`;
	const dspPathBp  = `${backupPath}dsp-presets`;
	const indexPath  = `${backupPath}index-data`;
	const themePath  = `${backupPath}georgia-reborn`;

	const libOld   = make ? `${fb.ProfilePath}library`        : `${backupPath}library`;
	const libNew   = make ? `${fb.ProfilePath}library-v2.0`   : `${backupPath}library-v2.0`;
	const plistOld = make ? `${fb.ProfilePath}playlists-v1.4` : `${backupPath}playlists-v1.4`;
	const plistNew = make ? `${fb.ProfilePath}playlists-v2.0` : `${backupPath}playlists-v2.0`;

	let libaryDir;
	let playlistDir;
	let oldVersion = false;

	const checkVersion = async () => {
		if      (IsFolder(libOld)) { libaryDir = libOld; oldVersion = true; }
		else if (IsFolder(libNew)) { libaryDir = libNew; oldVersion = false; }
		if      (IsFolder(plistOld)) { playlistDir = plistOld; oldVersion = true; }
		else if (IsFolder(plistNew)) { playlistDir = plistNew; oldVersion = false; }
	};

	const createFolders = async () => {
		CreateFolder(themePath, true);
		CreateFolder(cfgPathFb, true);
		CreateFolder(dspPathFb, true);
		CreateFolder(dspPathBp, true);
		if (oldVersion) CreateFolder(indexPath, true);
	};

	const checkFolders = () => {
		// * Safeguard to prevent crash when directories do not exist
		const foldersExist =
			((IsFolder(libOld) && IsFolder(plistOld)) || IsFolder(libNew) && IsFolder(plistNew))
			&&
			(IsFolder(themePath) && IsFolder(dspPathFb) && IsFolder(dspPathBp) && IsFolder(cfgPathFb));

		if (foldersExist) {
			return true;
		}
		else {
			if (make) {
				fb.ShowPopupMessage(`>>> Georgia-ReBORN theme backup was aborted <<<\n\n"configuration" or "dsp-presets" or "georgia-reborn" or "library" or "playlist" directory\ndoes not exist in:\n${fb.ProfilePath}`, 'Theme backup');
			} else {
				fb.ShowPopupMessage(`>>> Georgia-ReBORN restore backup was aborted <<<\n\n"backup" directory does not exist in:\n${fb.ProfilePath}\n\nor\n\n"configuration" or "dsp-presets" or "georgia-reborn" or "library" or "playlist" directory\ndoes not exist in:\n${fb.ProfilePath}backup`, 'Theme backup');
			}
			return false;
		}
	};

	const copyFolders = async () => {
		const backup    = new ActiveXObject('Scripting.FileSystemObject');
		const library   = backup.GetFolder(libaryDir);
		const playlists = backup.GetFolder(playlistDir);
		const configs   = backup.GetFolder(make ? `${fb.ProfilePath}georgia-reborn\\configs` : `${backupPath}georgia-reborn\\configs`);
		const cfg       = backup.GetFolder(make ? cfgPathFb : `${backupPath}configuration`);

		// * If old or new version, copy the library, playlist and config files
		library.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		playlists.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		configs.Copy(make ? `${backupPath}georgia-reborn\\configs` : `${fb.ProfilePath}georgia-reborn\\configs`, true);
		cfg.Copy(make ? `${backupPath}configuration` : cfgPathFb, true);

		// * Delete user's foo_ui_columns.dll.cfg, we use the clean cfg file from the zip
		try { backup.DeleteFile(`${backupPath}configuration\\foo_ui_columns.dll.cfg`, true); } catch (e) {}

		// * If old version, copy the old library data files
		if (oldVersion) {
			const indexData = backup.GetFolder(make ? `${fb.ProfilePath}index-data` : indexPath);
			indexData.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
			return;
		}

		// * If new version, copy the new fb2k v2 files
		const dspPresets = backup.GetFolder(make ? dspPathFb : dspPathBp);
		const dspConfig = backup.GetFile(make ? `${fb.ProfilePath}config.fb2k-dsp` : `${backupPath}config.fb2k-dsp`);
		const fbConfig = backup.GetFile(make ? `${fb.ProfilePath}config.sqlite` : `${backupPath}config.sqlite`);
		const metadb = backup.GetFile(make ? `${fb.ProfilePath}metadb.sqlite` : `${backupPath}metadb.sqlite`);
		dspPresets.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		dspConfig.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		fbConfig.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		metadb.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
	};

	const makeBackup = async () => {
		await checkVersion();
		await createFolders();

		if (!checkFolders()) return;

		await setThemeSettings(true);
		await copyFolders();

		if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			await fb.ShowPopupMessage(`>>> Theme backup has been successfully saved <<<\n\n${fb.ProfilePath}backup`, 'Theme backup');
		} else {
			const msg = `Theme backup has been successfully saved:\n\n${fb.ProfilePath}backup\n\n\n`;
			await popUpBox.confirm('Georgia-ReBORN', msg, 'OK', false, false, 'center', false);
		}
	};

	const restoreBackup = async () => {
		if (!checkFolders()) return;

		pref.customThemeSettings = true;
		pref.restoreBackupPlaylist = true;

		await checkVersion();
		await copyFolders();
		await setThemeSettings();
		await setTimeout(() => { fb.RunMainMenuCommand('File/Restart'); }, 1000);
	};

	if (make) {
		makeBackup();
	} else {
		restoreBackup();
	}
}


/**
 * Restores the backup playlist directory with its playlists.
 * This is a foobar workaround fix when user has installed and launched foobar for the very first time after installation.
 * If theme backup has been successfully restored, foobar automatically deletes all restored playlist files in the playlist directory.
 * On the next foobar restart and initialization, foobar adds crap playlist files in the playlist directory making them useless.
 * To fix this issue, all playlist files from the backup directory will be copied and restored again.
 */
function restoreBackupPlaylist() {
	const plistOld = `${fb.ProfilePath}backup\\profile\\playlists-v1.4`;
	const plistNew = `${fb.ProfilePath}backup\\profile\\playlists-v2.0`;

	let playlistDir;
	let oldVersion = false;

	const checkVersion = async () => {
		if      (IsFolder(plistOld)) { playlistDir = plistOld; oldVersion = true; }
		else if (IsFolder(plistNew)) { playlistDir = plistNew; oldVersion = false; }
	};

	const checkFolders = () => {
		// * Safeguard to prevent crash when directories do not exist
		const foldersExist = IsFolder(plistOld) || IsFolder(plistNew);

		if (foldersExist) {
			return true;
		}
		else {
			fb.ShowPopupMessage(`>>> Georgia-ReBORN restore backup was aborted <<<\n\n"playlist" directory does not exist in:\n${fb.ProfilePath}backup`, 'Theme backup');
			return false;
		}
	};

	const copyFolders = async () => {
		const backup = new ActiveXObject('Scripting.FileSystemObject');
		const playlists = backup.GetFolder(playlistDir);
		playlists.Copy(`${fb.ProfilePath}`, true);
	};

	const restoreBackup = async () => {
		if (!checkFolders()) return;

		pref.restoreBackupPlaylist = false;

		await checkVersion();
		await copyFolders();
		await console.log('\n>>> Georgia-ReBORN theme backup has been successfully restored <<<\n\n');
		await setTimeout(() => { fb.RunMainMenuCommand('File/Restart'); }, 1000);
	};

	restoreBackup();
}


/**
 * Displays red rectangles to show all repaint areas when activating "Draw areas" in dev tools, used for debugging.
 */
function repaintRectAreas() {
	window.RepaintRect = (x, y, w, h, force = undefined) => {
		if (timings.drawRepaintRects) {
			repaintRects.push({ x, y, w, h });
			window.Repaint();
		} else {
			repaintRectCount++;
			window.oldRepaintRect(x, y, w, h, force);
		}
	};
}


/**
 * Prints logs for window.Repaint() in the console, used for debugging.
 */
function repaintWindow() {
	DebugLog('Repainting from repaintWindow()');
	window.Repaint();
}


/**
 * Continuously repaints rectangles for a short period of time ( 1 sec ), used when changing the layout width.
 */
function repaintWindowRectAreas() {
	DebugLog('Repainting from repaintWindowRectAreas()');

	window.RepaintRect = () => {
		window.Repaint();
	};

	setTimeout(() => { // Restore window.RepaintRect afterwards
		window.RepaintRect = (x, y, w, h, force = undefined) => {
			window.oldRepaintRect(x, y, w, h, force);
		};
	}, 1000);
}


/**
 * Writes %GR_THEMECOLOR%, %GR_THEME%, %GR_STYLE%, %GR_PRESET% tags to music files via the Playlist or Library context menu.
 */
function writeThemeTags() {
	const grTags = [];
	const plItems = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
	const libItems = new FbMetadbHandleList(pop.getHandleList('newItems'));
	const items = displayLibrary && !displayPlaylist || displayPlaylistLibrary() && state.mouse_x < ww * 0.5 ? libItems : plItems;

	if (!items) return;

	for (let i = 0; i < items.Count; ++i) {
		grTags.push({
			GR_THEMECOLOR: pref.theme === 'random' ? ColToRgb(col.primary) : '',

			GR_THEME: pref.preset === false ? pref.theme : '',

			GR_STYLE: pref.preset === false ? [
				pref.styleBevel ? 'bevel' : '',
				pref.styleBlend ? 'blend' : '',
				pref.styleBlend2 ? 'blend2' : '',
				pref.styleGradient ? 'gradient' : '',
				pref.styleGradient2 ? 'gradient2' : '',
				pref.styleAlternative ? 'alternative' : '',
				pref.styleAlternative2 ? 'alternative2' : '',
				pref.styleBlackAndWhite ? 'blackAndWhite' : '',
				pref.styleBlackAndWhite2 ? 'blackAndWhite2' : '',
				pref.styleBlackReborn ? 'blackReborn' : '',
				pref.styleRebornWhite ? 'rebornWhite' : '',
				pref.styleRebornBlack ? 'rebornBlack' : '',
				pref.styleRebornFusion ? 'rebornFusion' : '',
				pref.styleRebornFusion2 ? 'rebornFusion2' : '',
				pref.styleRandomPastel ? 'randomPastel' : '',
				pref.styleRandomDark ? 'randomDark' : '',
				pref.styleRebornFusionAccent ? 'rebornFusionAccent' : '',
				pref.styleTopMenuButtons === 'filled' ? 'topMenuButtons=filled' : '',
				pref.styleTopMenuButtons === 'bevel' ? 'topMenuButtons=bevel' : '',
				pref.styleTopMenuButtons === 'inner' ? 'topMenuButtons=inner' : '',
				pref.styleTopMenuButtons === 'emboss' ? 'topMenuButtons=emboss' : '',
				pref.styleTopMenuButtons === 'minimal' ? 'topMenuButtons=minimal' : '',
				pref.styleTransportButtons === 'bevel' ? 'transportButtons=bevel' : '',
				pref.styleTransportButtons === 'inner' ? 'transportButtons=inner' : '',
				pref.styleTransportButtons === 'emboss' ? 'transportButtons=emboss' : '',
				pref.styleTransportButtons === 'minimal' ? 'transportButtons=minimal' : '',
				pref.styleProgressBarDesign === 'rounded' ? 'progressBarDesign=rounded' : '',
				pref.styleProgressBarDesign === 'lines' ? 'progressBarDesign=lines' : '',
				pref.styleProgressBarDesign === 'blocks' ? 'progressBarDesign=blocks' : '',
				pref.styleProgressBarDesign === 'dots' ? 'progressBarDesign=dots' : '',
				pref.styleProgressBarDesign === 'thin' ? 'progressBarDesign=thin' : '',
				pref.styleProgressBar === 'bevel' ? 'progressBarBg=bevel' : '',
				pref.styleProgressBar === 'inner' ? 'progressBarBg=inner' : '',
				pref.styleProgressBarFill === 'bevel' ? 'progressBarFill=bevel' : '',
				pref.styleProgressBarFill === 'inner' ? 'progressBarFill=inner' : '',
				pref.styleProgressBarFill === 'blend' ? 'progressBarFill=blend' : '',
				pref.styleVolumeBarDesign === 'rounded' ? 'volumeBarDesign=rounded' : '',
				pref.styleVolumeBar === 'bevel' ? 'volumeBarBg=bevel' : '',
				pref.styleVolumeBar === 'inner' ? 'volumeBarBg=inner' : '',
				pref.styleVolumeBarFill === 'bevel' ? 'volumeBarFill=bevel' : '',
				pref.styleVolumeBarFill === 'bevel' ? 'volumeBarFill=inner' : ''
			] : '',

			GR_PRESET: pref.preset !== false ? pref.preset : ''
		});
	}

	if (items.Count) items.UpdateFileInfoFromJSON(JSON.stringify(grTags));
}


/////////////////////////
// * MAIN - GRAPHICS * //
/////////////////////////
/**
 * Creates the top menu and lower bar button images for button state 'Enabled', 'Hovered', 'Down'.
 */
function createButtonImages() {
	const createButtonProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('createButtonImages') : null;
	const transportCircleSize = Math.round(pref[`transportButtonSize_${pref.layout}`] * 0.93333);
	let btns = {};

	try {
		btns = {
			Stop: {
				ico: g_guifx.stop,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Previous: {
				ico: g_guifx.previous,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Play: {
				ico: g_guifx.play,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Pause: {
				ico: g_guifx.pause,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Next: {
				ico: g_guifx.next,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackDefault: {
				ico: g_guifx.right,
				font: ft.playback_order_default,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackReplay: {
				ico: '\uf021',
				font: ft.playback_order_replay,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackShuffle: {
				ico: g_guifx.shuffle,
				font: ft.playback_order_shuffle,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			ShowVolume: {
				ico: g_guifx.volume_down,
				font: ft.guifx_volume,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Reload: {
				ico: g_guifx.power,
				font: ft.guifx_reload,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Minimize: {
				ico: '0',
				font: ft.top_menu_caption,
				type: 'window',
				w: 22,
				h: 22
			},
			Maximize: {
				ico: '2',
				font: ft.top_menu_caption,
				type: 'window',
				w: 22,
				h: 22
			},
			Close: {
				ico: 'r',
				font: ft.top_menu_caption,
				type: 'window',
				w: 22,
				h: 22
			},
			Hamburger: {
				ico: '\uf0c9',
				font: ft.top_menu_compact,
				type: 'compact'
			},
			TopMenu: {
				ico: 'Menu',
				font: ft.top_menu,
				type: 'compact'
			},
			File: {
				ico: 'File',
				font: ft.top_menu,
				type: 'menu'
			},
			Edit: {
				ico: 'Edit',
				font: ft.top_menu,
				type: 'menu'
			},
			View: {
				ico: 'View',
				font: ft.top_menu,
				type: 'menu'
			},
			Playback: {
				ico: 'Playback',
				font: ft.top_menu,
				type: 'menu'
			},
			MediaLibrary: {
				ico: 'Media',
				font: ft.top_menu,
				type: 'menu'
			},
			Help: {
				ico: 'Help',
				font: ft.top_menu,
				type: 'menu'
			},
			Playlists: {
				ico: 'Playlists',
				font: ft.top_menu,
				type: 'menu'
			},
			Options: {
				ico: 'Options',
				font: ft.top_menu,
				type: 'menu'
			},
			Details: {
				ico: 'Details',
				font: ft.top_menu,
				type: 'menu'
			},
			PlaylistArtworkLayout: {
				ico: 'Playlist',
				font: ft.top_menu,
				type: 'menu'
			},
			Library: {
				ico: 'Library',
				font: ft.top_menu,
				type: 'menu'
			},
			Lyrics: {
				ico: 'Lyrics',
				font: ft.top_menu,
				type: 'menu'
			},
			Biography: {
				ico: 'Biography',
				font: ft.top_menu,
				type: 'menu'
			},
			Rating: {
				ico: 'Rating',
				font: ft.top_menu,
				type: 'menu'
			},
			Properties: {
				ico: 'Properties',
				font: ft.top_menu,
				type: 'menu'
			},
			Settings: {
				ico: 'Settings',
				font: ft.top_menu,
				type: 'menu'
			},
			Back: {
				ico: '\uE00E',
				type: 'backforward',
				font: ft.symbol,
				w: 22,
				h: 22
			},
			Forward: {
				ico: '\uE00F',
				type: 'backforward',
				font: ft.symbol,
				w: 22,
				h: 22
			}
		};
	} catch (e) {
		console.log('**********************************');
		console.log('ATTENTION: Buttons could not be created');
		console.log(`Make sure you installed the theme correctly to ${fb.ProfilePath}.`);
		console.log('**********************************');
	}


	btnImg = [];

	for (const i in btns) {
		if (btns[i].type === 'menu') {
			const img = gdi.CreateImage(100, 100);
			const g = img.GetGraphics();
			const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);

			btns[i].w = Math.ceil(measurements.Width + 20);
			img.ReleaseGraphics(g);
			btns[i].h = Math.ceil(measurements.Height + 5);
		}

		if (btns[i].type === 'compact') {
			const img = gdi.CreateImage(100, 100);
			const g = img.GetGraphics();
			const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);

			btns[i].w = Math.ceil(measurements.Width + (RES_4K ? 32 : 41));
			img.ReleaseGraphics(g);
			btns[i].h = Math.ceil(measurements.Height + (RES_4K ? -2 : 5));
		}

		// const { x, y } = btns[i];
		let { w, h } = btns[i];
		const lineW = SCALE(2);

		if (RES_4K && btns[i].type === 'transport') {
			w *= 2;
			h *= 2;
		} else if (RES_4K && btns[i].type !== 'menu') {
			w = Math.round(btns[i].w * 1.5);
			h = Math.round(btns[i].h * 1.6);
		} else if (RES_4K) {
			w += 20;
			h += 10;
		}

		const stateImages = []; // 0=ButtonState.Default, 1=hover, 2=down, 3=Enabled;
		for (let state = 0; state < Object.keys(ButtonState).length; state++) {
			const btn = btns[i];
			if (state === 3 && btn.type !== 'image') break;
			const img = gdi.CreateImage(w, h);
			const g = img.GetGraphics();
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			// * Positions playback icons weirdly on AntiAliasGridFit
			if (btns[i].type !== 'transport' && !pref.customThemeFonts) {
				g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
			}
			// * Positions some top menu buttons weirdly when using custom theme fonts on AntiAliasGridFit and vertical/horizontal centered font alignment, i.e StringFormat(1, 1);
			else if ((btns[i].type === 'menu' || btn.type === 'compact') && pref.customThemeFonts || btns[i].type === 'transport') {
				g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
			}

			let menuTextColor = col.menuTextNormal;
			let menuRectColor = col.menuRectNormal;
			let menuBgColor = col.menuBgColor;
			let transportIconColor = col.transportIconNormal;
			let transportEllipseColor = col.transportEllipseNormal;
			let iconAlpha = 255;

			switch (state) {
				case ButtonState.Hovered:
					menuTextColor = col.menuTextHovered;
					menuRectColor = col.menuRectHovered;
					menuBgColor = col.menuBgColor;
					transportIconColor = col.transportIconHovered;
					transportEllipseColor = col.transportEllipseHovered;
					iconAlpha = 215;
					break;
				case ButtonState.Down:
					menuTextColor = col.menuTextDown;
					menuRectColor = col.menuRectDown;
					menuBgColor = col.menuBgColor;
					transportIconColor = col.transportIconDown;
					transportEllipseColor = col.transportEllipseDown;
					iconAlpha = 215;
					break;
				case ButtonState.Enabled:
					iconAlpha = 255;
					break;
			}

			switch (btn.type) {
				case 'menu': case 'window': case 'compact':
					if (pref.styleTopMenuButtons === 'default' || pref.styleTopMenuButtons === 'filled') {
						if (pref.styleTopMenuButtons === 'filled') state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 3, 3, menuBgColor);
						state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 3, 3, 1, menuRectColor);
					}
					else if (pref.styleTopMenuButtons === 'bevel') {
						state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
						state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, col.menuStyleBg, 1);
						state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, 1, menuRectColor);
					}
					else if (pref.styleTopMenuButtons === 'inner') {
						state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
						state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, col.menuStyleBg, 0);
						state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, 1, menuRectColor);
					}
					else if (pref.styleTopMenuButtons === 'emboss') {
						state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
						state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, col.menuStyleBg, 0.33);
						state && g.DrawRoundRect(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 1, 4, 4, 1, col.menuRectStyleEmbossTop);
						state && g.DrawRoundRect(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2), w - lineW - 2, h - lineW - 1, 4, 4, 1, col.menuRectStyleEmbossBottom);
					}
					if (btn.type === 'compact') {
						g.DrawString('\uf0c9', ft.top_menu_compact, menuTextColor, RES_4K ? -39 : -19, 0, w, h, StringFormat(1, 1));
						g.DrawString(btn.ico, btn.font, menuTextColor, RES_4K ? 20 : 10, RES_4K ? -1 : 0, w, h, StringFormat(1, 1));
					} else {
						g.DrawString(btn.ico, btn.font, menuTextColor, 0, 0, w, btn.type === 'window' ? h : h - 1, StringFormat(1, 1));
					}
					break;

				case 'transport':
					if (pref.styleTransportButtons === 'default') {
						g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, lineW, transportEllipseColor);
						g.FillEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, col.transportEllipseBg);
					}
					else if (pref.styleTransportButtons === 'bevel') {
						g.FillEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW - 1, h - lineW - 1, col.transportStyleTop);
						g.DrawEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW - 1, h - lineW, 1, col.transportStyleBottom);
						FillGradEllipse(g, Math.floor(lineW / 2) - 0.5, Math.floor(lineW / 2), w + 0.5, h + 0.5, 90, 0, col.transportStyleBg, 1);
					}
					else if (pref.styleTransportButtons === 'inner') {
						g.FillEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW - 1, col.transportStyleTop);
						g.DrawEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2) - 1, w - lineW, h - lineW + 1, 1, col.transportStyleBottom);
						FillGradEllipse(g, Math.floor(lineW / 2) - 0.5, Math.floor(lineW / 2), w + 1.5, h + 0.5, 90, 0, col.transportStyleBg, 0);
					}
					else if (pref.styleTransportButtons === 'emboss') {
						g.FillEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, col.transportEllipseBg);
						FillGradEllipse(g, Math.floor(lineW / 2) + 2, Math.floor(lineW / 2) + 2, w - lineW - 2, h - lineW - 2, 90, 0, col.transportStyleBg, 0.33);
						g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 2, w - lineW - 2, h - lineW - 3, lineW, col.transportStyleTop);
						g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2), w - lineW - 2, h - lineW - 2, lineW, col.transportStyleBottom);
					}
					g.DrawString(btn.ico, btn.font, transportIconColor, 1, (i === 'Stop' || i === 'Reload') ? 0 : 1, w, h, StringFormat(1, 1));
					break;

				case 'backforward':
					g.DrawString(btn.ico, btn.font, g_pl_colors.plman_text_hovered, i === 'Back' ? -1 : 0, 0, w, h, StringFormat(1, 1));
					break;
			}

			img.ReleaseGraphics(g);
			stateImages[state] = img;
		}

		btnImg[i] = stateImages;
	}
	if (timings.showExtraDrawTiming) createButtonProfiler.Print();
}


/**
 * Creates the top menu and lower bar transport buttons.
 * @param {number} ww window.Width.
 * @param {number} wh window.Height.
 */
function createButtonObjects(ww, wh) {
	btns = [];
	const menuFontSize = pref[`menuFontSize_${pref.layout}`];
	const showingMinMaxButtons = !!((UIHacks && UIHacks.FrameStyle));
	const showTransportControls = pref[`showTransportControls_${pref.layout}`];

	if (ww <= 0 || wh <= 0) {
		return;
	} else if (typeof btnImg === 'undefined') {
		createButtonImages();
	}

	// * TOP MENU BUTTONS * //
	/** @type {GdiBitmap[]} */
	let img = btnImg.File;
	const w = img[0].Width;
	const h = img[0].Height;
	let   x = RES_4K ? 18 : 8;
	const y = Math.round(geo.topMenuHeight * 0.5 - h * 0.5 - SCALE(1));

	// Top menu font size X-correction for Artwork and Compact layout
	const xOffset = ww > SCALE(pref.layout === 'compact' ? 570 : 620) ? 0 :
	menuFontSize === 13 && !RES_QHD ? SCALE(3) :
	menuFontSize === 14 && !RES_QHD ? SCALE(5) :
	menuFontSize === 16  ?  RES_QHD ? 4 : SCALE(12) : 0;

	const widthCorrection =
		RES_4K ? (pref.customThemeFonts && menuFontSize > 12 && ww < 1080) ? 12 : (pref.customThemeFonts && menuFontSize > 10 && ww < 1080) ? 6 : 3 :
				 (pref.customThemeFonts && menuFontSize > 12 && ww <  600) ?  6 : (pref.customThemeFonts && menuFontSize > 10 && ww <  600) ? 4 : 0;
	const correction = widthCorrection + (pref.layout !== 'default' ? xOffset : 0);

	// * Top menu compact
	if (pref.showTopMenuCompact) {
		img = btnImg.TopMenu;
		btns[19] = new Button(x, y, w + SCALE(41), h, 'Menu', img, 'Open menu');
	}

	// * Default foobar2000 buttons
	if (!pref.showTopMenuCompact) {
		img = btnImg.File;
		btns[20] = new Button(x, y, w, h, 'File', img);
	}

	// These buttons are not available in Artwork layout
	if (pref.layout !== 'artwork') {
		x += img[0].Width - correction;
		img = btnImg.Edit;
		if (!pref.showTopMenuCompact) btns[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

		x += img[0].Width - correction;
		img = btnImg.View;
		if (!pref.showTopMenuCompact) btns[22] = new Button(x, y, img[0].Width, h, 'View', img);

		x += img[0].Width - correction;
		img = btnImg.Playback;
		if (!pref.showTopMenuCompact) btns[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

		x += img[0].Width - correction;
		img = btnImg.MediaLibrary;
		if (!pref.showTopMenuCompact) btns[24] = new Button(x, y, img[0].Width, h, 'Library', img);

		x += img[0].Width - correction;
		img = btnImg.Help;
		if (!pref.showTopMenuCompact) btns[25] = new Button(x, y, img[0].Width, h, 'Help', img);

		x += img[0].Width - correction;
		img = btnImg.Playlists;
		if (!pref.showTopMenuCompact) btns[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);
	}

	// * Theme buttons
	const showPanelDetails   = pref[`showPanelDetails_${pref.layout}`];
	const showPanelLibrary   = pref[`showPanelLibrary_${pref.layout}`];
	const showPanelBiography = pref[`showPanelBiography_${pref.layout}`];
	const showPanelLyrics    = pref[`showPanelLyrics_${pref.layout}`];
	const showPanelRating    = pref[`showPanelRating_${pref.layout}`];

	const buttonCount = (showPanelDetails ? 1 : 0) + (showPanelLibrary ? 1 : 0) + (showPanelBiography ? 1 : 0) + (showPanelLyrics ? 1 : 0) + (showPanelRating ? 1 : 0);
	const buttonXCorr = 0.33 + (buttonCount === 5 ? 0 : buttonCount === 4 ? 0.3 : buttonCount === 3 ? 0.6 : buttonCount === 2 ? 1.5 : buttonCount === 1 ? 4 : 0);

	x += img[0].Width - widthCorrection;
	if (pref.layout === 'artwork') x -= xOffset;
	// Options button is available in all layouts
	img = btnImg.Options;
	if (!pref.showTopMenuCompact) btns[27] = new Button(x, y, img[0].Width, h, 'Options', img, 'Theme options');

	// These buttons are not available in Compact layout
	if (pref.layout !== 'compact') {
		if (pref.topMenuAlignment === 'center' && ww > SCALE(pref.layout === 'artwork' ? 600 : 1380) || pref.showTopMenuCompact) {
			const centerMenu = Math.ceil(w * (buttonCount + (pref.layout === 'artwork' && pref.topMenuCompact ? 0.5 : 0)) + (menuFontSize * buttonCount * buttonXCorr));
			x = Math.round(ww * 0.5 - centerMenu);
		}

		if (showPanelDetails) {
			x += img[0].Width - correction;
			img = btnImg.Details;
			btns.details = new Button(x, y, img[0].Width, h, 'Details', img, 'Display Details');

			// Playlist button only available in Artwork layout
			if (pref.layout === 'artwork') {
				x += img[0].Width - correction;
				img = btnImg.PlaylistArtworkLayout;
				btns.playlistArtworkLayout = new Button(x, y, img[0].Width, h, 'PlaylistArtworkLayout', img, 'Display Playlist');
			}
		}
		if (showPanelLibrary) {
			x += img[0].Width - correction;
			img = btnImg.Library;
			btns.library = new Button(x, y, img[0].Width, h, 'library', img, 'Display Library');
		}
		if (showPanelBiography) {
			x += img[0].Width - correction;
			img = btnImg.Biography;
			btns.biography = new Button(x, y, img[0].Width, h, 'Biography', img, 'Display Biography');
		}
		if (showPanelLyrics) {
			x += img[0].Width - correction;
			img = btnImg.Lyrics;
			btns.lyrics = new Button(x, y, img[0].Width, h, 'Lyrics', img, 'Display Lyrics');
		}
		if (showPanelRating) {
			x += img[0].Width - correction;
			img = btnImg.Rating;
			btns.rating = new Button(x, y, img[0].Width, h, 'Rating', img, 'Rate Song');
		}
	}

	// * Top menu 🗕 🗖 ✖ caption buttons
	if (showingMinMaxButtons) {
		const hideClose = UIHacks.FrameStyle === FrameStyle.SmallCaption && UIHacks.FullScreen !== true;

		const w = SCALE(22);
		const h = w;
		const p = 3;
		const x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - (RES_4K ? 21 : 14);
		const y = Math.round(geo.topMenuHeight * 0.5 - h * 0.5 - SCALE(1));

		if (pref.layout === 'default') {
			btns.Minimize = new Button(x, y, w, h, 'Minimize', btnImg.Minimize);
			btns.Maximize = new Button(x + w + p, y, w, h, 'Maximize', btnImg.Maximize);
			if (!hideClose) {
				btns.Close = new Button(x + (w + p) * 2, menuFontSize < 10 ? y + 1 : y, menuFontSize < 10 ? w - 1 : w, menuFontSize < 10 ? h - 1 : h, 'Close', btnImg.Close);
			}
		}
		else {
			btns.Minimize = new Button(x + w + p, y, w, h, 'Minimize', btnImg.Minimize);
			if (!hideClose) {
				btns[12] = new Button(x + (w + p) * 2, y, w, h, 'Close', btnImg.Close);
			}
		}
	}

	// * LOWER BAR TRANSPORT BUTTONS * //
	if (showTransportControls) {
		const lowerBarFontSize     = pref[`lowerBarFontSize_${pref.layout}`];
		const showPlaybackOrderBtn = pref[`showPlaybackOrderBtn_${pref.layout}`];
		const showReloadBtn        = pref[`showReloadBtn_${pref.layout}`];
		const showVolumeBtn        = pref[`showVolumeBtn_${pref.layout}`];
		const transportBtnSize     = pref[`transportButtonSize_${pref.layout}`];
		const transportBtnSpacing  = pref[`transportButtonSpacing_${pref.layout}`];

		let count = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

		const buttonSize = SCALE(transportBtnSize);
		const y = wh - buttonSize - SCALE(pref.layout !== 'default' ? 36 : 78) + SCALE(lowerBarFontSize);
		const w = buttonSize;
		const h = w;
		const p = SCALE(transportBtnSpacing); // Space between buttons
		const x = (ww - w * count - p * (count - 1)) / 2;

		const calcX = (index) => x + (w + p) * index;

		count = 0;
		btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
		btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
		btns.play = new Button(calcX(++count), y, w, h, 'PlayPause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
		btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');

		if (showPlaybackOrderBtn) {
			if (plman.PlaybackOrder === 0) {
				btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackDefault);
			}
			else if (plman.PlaybackOrder === 1 || plman.PlaybackOrder === 2) {
				btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackReplay);
			}
			else if (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4 || plman.PlaybackOrder === 5 || plman.PlaybackOrder === 6) {
				btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackShuffle);
			}
		}
		if (showReloadBtn) {
			btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
		}
		if (showVolumeBtn) {
			btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
			volumeBtn.setPosition(btns.volume.x, y, w);
		}
	}
}


/**
 * Loads country flags when defined in tags, displayed in the lower bar and Details.
 */
function loadCountryFlags() {
	flagImgs = [];
	getMetaValues(tf.artist_country).forEach(country => {
		const flagImage = loadFlagImage(country);
		flagImage && flagImgs.push(flagImage);
	});
}


/**
 * Loads flag images from the image directory based on the country name or ISO country code provided.
 * @param {string} country The country for which we want to load the flag image.
 * @returns {GdiBitmap} The flag image object.
 */
function loadFlagImage(country) {
	const countryName = ConvertIsoCountryCodeToFull(country) || country; // In case we have a 2-digit country code
	const path = `${$(paths.flagsBase) + (RES_4K ? '64\\' : '32\\') + countryName.trim().replace(/ /g, '-')}.png`;
	return gdi.Image(path);
}


//////////////////////////
// * MAIN - ALBUM ART * //
//////////////////////////
/**
 * Displays the next artwork image when cycling through album artworks with a default 30 sec interval or when using album art context menu.
 */
function displayNextImage() {
	DebugLog(`Repainting in displayNextImage: ${albumArtIndex}`);
	albumArtIndex = (albumArtIndex + 1) % albumArtList.length;
	loadImageFromAlbumArtList(albumArtIndex);
	if (pref.theme === 'reborn' || pref.theme === 'random' || pref.styleBlackAndWhiteReborn || pref.styleBlackReborn) {
		newTrackFetchingArtwork = true;
		getThemeColors(albumArt);
		initTheme();
		DebugLog('\n>>> initTheme -> displayNextImage <<<\n');
	}
	lastLeftEdge = 0;
	resizeArtwork(true); // Needed to readjust discArt shadow size if artwork size changes
	repaintWindow();
	albumArtTimeout = setTimeout(() => {
		displayNextImage();
	}, settings.artworkDisplayTime * 1000);
	initButtonState();
}


/**
 * Fetches new album art when a new album is being played or when cycling through album artworks.
 * @param {FbMetadbHandle} metadb The metadb of the track.
 */
function fetchAlbumArt(metadb) {
	albumArtList = [];

	const fetchAlbumArtProfiler = timings.showDebugTiming ? fb.CreateProfiler('fetchAlbumArt') : null;

	const autoRandomPreset =
		(!['off', 'track'].includes(pref.presetAutoRandomMode) && pref.presetSelectMode === 'harmonic' ||
		pref.presetAutoRandomMode === 'dblclick' && pref.presetSelectMode === 'theme') && !doubleClicked;

	if (isStreaming || isPlayingCD) {
		discArt = disposeDiscArtImage(discArt);
		albumArt = utils.GetAlbumArtV2(metadb);
		pref.showGridTitle_default = true;
		pref.showGridTitle_artwork = true;
		if (albumArt) {
			getThemeColors(albumArt);
			resizeArtwork(true);
		} else {
			noArtwork = true;
			shadowImg = null;
		}
		initTheme();
		DebugLog('\n>>> initTheme -> fetchNewArtwork -> isStreaming || isPlayingCD <<<\n');
	}
	else {
		if (!pref.showGridTitle_default && pref.layout === 'default') pref.showGridTitle_default = false;
		if (!pref.showGridTitle_artwork && pref.layout === 'artwork') pref.showGridTitle_artwork = false;

		albumArtList = globals.imgPaths.map(path => utils.Glob($(path), FileAttributes.Directory | FileAttributes.Hidden)).flat();
		const filteredFileTypes = pref.filterDiscJpgsFromAlbumArt ? '(png|jpg)' : 'png';
		const pattern = new RegExp(`(cd|disc|vinyl|${settings.discArtBasename})([0-9]*|[a-h]).${filteredFileTypes}`, 'i');
		const imageType = /(jpg|png)$/i;	// TODO: Add gifs?
		// * Remove duplicates and cd/vinyl art and make sure all files are jpg or pngs
		albumArtList = [...new Set(albumArtList)].filter(path => !pattern.test(path) && imageType.test(path));

		// * Try loading album art from artwork image paths
		if (albumArtList.length && !pref.loadEmbeddedAlbumArtFirst) {
			noArtwork = false;
			noAlbumArtStub = false;
			embeddedArt = false;
			if (albumArtList.length > 1 && pref.cycleArt) {
				albumArtTimeout = setTimeout(() => {
					displayNextImage();
				}, settings.artworkDisplayTime * 1000);
			}
			albumArtIndex = 0;
			loadImageFromAlbumArtList(albumArtIndex); // Display first image
		}
		// * If not found, try embedded artwork from music file
		else if (metadb && (albumArt = utils.GetAlbumArtV2(metadb))) {
			noArtwork = false;
			noAlbumArtStub = false;
			if (autoRandomPreset) { // Prevent double initialization for theme presets to save performance, getThemeColors() and initTheme() already handled in getRandomThemePreset()
				setRandomThemePreset();
			} else {
				initThemeTags();
				getThemeColors(albumArt);
				if (!loadingTheme) {
					initTheme(); // * Prevent incorrect theme brightness at startup/reload when using embedded art
					DebugLog('\n>>> initTheme -> fetchNewArtwork -> embeddedArt <<<\n');
				}
			}
			resizeArtwork(true);
			embeddedArt = true;
		}
		// * No album art found, using noAlbumArtStub
		else {
			noArtwork = true;
			noAlbumArtStub = true;
			albumArt = null;
			initTheme();
			DebugLog('\n>>> initTheme -> fetchNewArtwork -> noAlbumArtStub <<<\n');
			resizeArtwork(true);
			DebugLog('Repainting on_playback_new_track due to no cover image');
			repaintWindow();
		}
	}

	if (timings.showDebugTiming) fetchAlbumArtProfiler.Print();
}


/**
 * Fetches new album art/disc art when a new album is being played, disc art has changed or when cycling through album artworks.
 * @param {FbMetadbHandle} metadb The metadb of the track.
 */
function fetchNewArtwork(metadb) {
	if (pref.presetAutoRandomMode === 'album' || pref.presetSelectMode === 'harmonic') initThemeSkip = true;
	fetchAlbumArt(metadb);
	fetchDiscArt();
}


/**
 * Loads an image from the albumArtList array.
 * @param {number} index The index of albumArtList signifying which image to load.
 */
function loadImageFromAlbumArtList(index) {
	const metadb = fb.GetNowPlaying();
	const tempAlbumArt = artCache && artCache.getImage(albumArtList[index]);

	const autoRandomPreset =
		(!['off', 'track'].includes(pref.presetAutoRandomMode) && pref.presetSelectMode === 'harmonic' ||
		pref.presetAutoRandomMode === 'dblclick' && pref.presetSelectMode === 'theme') && !doubleClicked;

	const hasThemeTags = $('[%GR_THEME%]') || $('[%GR_STYLE%]') || $('[%GR_PRESET%]');

	if (tempAlbumArt) {
		albumArt = tempAlbumArt;
		if (index !== 0 && !newTrackFetchingArtwork) return;
		newTrackFetchingArtwork = false;

		if (autoRandomPreset) { // Prevent double initialization for theme presets to save performance, getThemeColors() and initTheme() already handled in getRandomThemePreset()
			setRandomThemePreset();
		} else {
			initThemeTags();
			getThemeColors(albumArt);
			if (!initThemeSkip && !hasThemeTags) {
				initTheme();
				DebugLog('\n>>> initTheme -> loadImageFromAlbumArtList -> tempAlbumArt <<<\n');
			}
		}
	}
	else {
		gdi.LoadImageAsyncV2(window.ID, albumArtList[index]).then(coverImage => {
			albumArt = artCache.encache(coverImage, albumArtList[index]);
			if (newTrackFetchingArtwork) {
				if (!albumArt && fb.IsPlaying) {
					// * If no album art on disk can be found, try embedded artwork from music file
					if (metadb && (albumArt = utils.GetAlbumArtV2(metadb))) {
						noArtwork = false;
						noAlbumArtStub = false;
						embeddedArt = true;
					}
					// * Use noAlbumArtStub if album art could not be properly parsed
					else {
						noArtwork = true;
						noAlbumArtStub = true;
						embeddedArt = false;
						console.log('\n<Error GetAlbumArtV2: Album art could not be properly parsed! Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded>\n');
					}
				}

				if (autoRandomPreset) { // Prevent double initialization for theme presets to save performance, getThemeColors() and initTheme() already handled in getRandomThemePreset()
					setRandomThemePreset();
				} else {
					initThemeTags();
					getThemeColors(albumArt);
					if (!hasThemeTags) {
						initTheme();
						DebugLog('\n>>> initTheme -> loadImageFromAlbumArtList -> LoadImageAsyncV2 <<<\n');
					}
				}

				newTrackFetchingArtwork = false;
			}

			// * Init panel width only when playlist is in full width ( i.e on startup or on_playback_stop ) to save performance
			if (pref.panelWidthAuto && playlist.x === 0) {
				initPanelWidthAuto();
			} else {
				resizeArtwork(true);
			}

			if (discArt) createRotatedDiscArtImage();
			lastLeftEdge = 0; // Recalc label location
			repaintWindow();
		});
	}

	resizeArtwork(false); // Recalculate image positions
	if (discArt) createRotatedDiscArtImage();
}


/**
 * Resizes loaded artwork to have better drawing performance and resets its position.
 * Also resets the size and position of the pause button and lyrics.
 * @param {boolean} resetDiscArtPosition Whether the position of the disc art should be reset.
 */
function resizeArtwork(resetDiscArtPosition) {
	DebugLog('Resizing artwork');
	hasArtwork = false;
	resizeAlbumArt();
	resizeDiscArt(resetDiscArtPosition);
	resetPausePosition();
	resetLyricsPosition();
}


/**
 * Resizes and resets the size and position of the album art.
 */
function resizeAlbumArt() {
	if (albumArt && albumArt.Width && albumArt.Height) {
		// * Size for big albumArt
		let xCenter = 0;
		const albumScale =
			pref.layout === 'artwork' ? Math.min(ww / albumArt.Width, (wh - geo.topMenuHeight - geo.lowerBarHeight) / albumArt.Height) :
			Math.min(((displayPlaylist || displayLibrary) ?
				UIHacks.FullScreen ? pref.albumArtScale === 'filled' ? 0.545 * ww : 0.5 * ww :
				UIHacks.MainWindowState === WindowState.Maximized ? pref.albumArtScale === 'filled' ? 0.55 * ww : 0.5 * ww :
				0.5 * ww :
			0.75 * ww) / albumArt.Width, (wh - geo.topMenuHeight - geo.lowerBarHeight) / albumArt.Height);

		if (displayPlaylist || displayLibrary) {
			xCenter =
				pref.layout === 'artwork' ? 0 :
				UIHacks.FullScreen && !pref.panelWidthAuto ? RES_4K ? 0.261 * ww : 0.23 * ww :
				UIHacks.MainWindowState === WindowState.Maximized && !pref.panelWidthAuto ? RES_4K ? 0.267 * ww : 0.24 * ww :
				xCenter = 0.25 * ww;
		}
		else if (ww / wh < 1.40) { // When using a roughly 4:3 display the album art crowds, so move it slightly off center
			xCenter = 0.56 * ww; // TODO: check if this is still needed?
		}
		else {
			xCenter = 0.5 * ww;
			artOffCenter = false;
			if (albumScale === 0.75 * ww / albumArt.Width) {
				xCenter += 0.1 * ww;
				artOffCenter = true; // TODO: We should probably suppress labels in this case
			}
		}

		albumArtSize.w = Math.floor(albumArt.Width * albumScale); // Width
		albumArtSize.h = Math.floor(albumArt.Height * albumScale); // Height
		albumArtSize.x = // * When player size is not proportional, album art is aligned via setting 'pref.albumArtAlign' in Default layout and is centered in Artwork layout */
			pref.layout === 'default' ?
				displayPlaylist || displayLibrary ?
					pref.albumArtAlign === 'left' ? 0 :
					pref.albumArtAlign === 'leftMargin' ? ww / wh > 1.8 ? SCALE(40) : 0 :
					pref.albumArtAlign === 'center' ? Math.floor(xCenter - 0.5 * albumArtSize.w) :
					ww * 0.5 - albumArtSize.w :
				Math.floor(xCenter - 0.5 * albumArtSize.w) :
			pref.layout === 'artwork' ?
				!displayPlaylist || pref.displayLyrics ? ww * 0.5 - albumArtSize.w * 0.5 : ww : 0;

		if (albumScale !== (wh - geo.topMenuHeight - geo.lowerBarHeight) / albumArt.Height) {
			// Restricted by width
			const y = Math.floor(((wh - geo.lowerBarHeight + geo.topMenuHeight) / 2) - albumArtSize.h / 2);
			albumArtSize.y = Math.min(y, SCALE(150) + 10);	// 150 or 300 + 10? Not sure where 160 comes from
		} else {
			albumArtSize.y = geo.topMenuHeight;
		}

		if (albumArtScaled) {
			albumArtScaled = null;
		}
		try { // * Prevent crash if album art is corrupt, file format is not supported or has an unusual ICC profile embedded
			// * Avoid weird anti-aliased scaling along border of images, see: https://stackoverflow.com/questions/4772273/interpolationmode-highqualitybicubic-introducing-artefacts-on-edge-of-resized-im
			albumArtScaled = albumArt.Resize(albumArtSize.w, albumArtSize.h, InterpolationMode.Bicubic); // Old method -> albumArtScaled = albumArt.Resize(albumArtSize.w, albumArtSize.h);
			const sg = albumArtScaled.GetGraphics();
			const HQscaled = albumArt.Resize(albumArtSize.w, albumArtSize.h, InterpolationMode.HighQualityBicubic);
			sg.DrawImage(HQscaled, 2, 2, albumArtScaled.Width - 4, albumArtScaled.Height - 4, 2, 2, albumArtScaled.Width - 4, albumArtScaled.Height - 4);
			albumArtScaled.ReleaseGraphics(sg);
		} catch (e) {
			noArtwork = true;
			albumArt = null;
			noAlbumArtStub = true;
			albumArtSize = new ImageSize(0, geo.topMenuHeight, 0, 0);
			console.log('\n<Error: Album art could not be scaled! Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded>\n');
		}
		hasArtwork = true;
	}
	else {
		albumArtSize = new ImageSize(0, geo.topMenuHeight, 0, 0);
	}
}


/**
 * Resets the size and position of the pause button.
 */
function resetPausePosition() {
	const noAlbumArtSize = wh - geo.topMenuHeight - geo.lowerBarHeight;

	const pauseBtnX =
		!pref.panelWidthAuto && pref.layout !== 'artwork' && !noAlbumArtStub && (displayLibrary || displayPlaylist) ||
			pref.layout === 'artwork' || displayDetails || pref.lyricsLayout === 'full' && pref.displayLyrics ? ww * 0.5 :
		pref.panelWidthAuto ?
			pref.albumArtAlign === 'left' ? noAlbumArtSize * 0.5 :
			pref.albumArtAlign === 'leftMargin' ? ww / wh > 1.8 ? noAlbumArtSize * 0.5 + SCALE(40) : 0 :
			pref.albumArtAlign === 'center' ? Math.floor(ww * 0.5 - noAlbumArtSize * 0.5 - (ww * 0.25 - noAlbumArtSize * 0.5)) :
			ww * 0.5 - noAlbumArtSize * 0.5 :
		ww * 0.25;

	const pauseBtnY = wh * 0.5 - geo.topMenuHeight;

	if (albumArt) pauseBtn.setCoords(albumArtSize.x + albumArtSize.w / 2, albumArtSize.y + albumArtSize.h / 2);
	else if (discArt) pauseBtn.setCoords(discArtSize.x + discArtSize.w / 2, discArtSize.y + discArtSize.h / 2);
	else if (noAlbumArtStub) pauseBtn.setCoords(pauseBtnX, pauseBtnY);
}


////////////////////////////
// * DETAILS - DISC ART * //
////////////////////////////
/**
 * Creates the drop shadow for disc art.
 */
function createDiscArtShadow() {
	const shadowProfiler = timings.showDebugTiming ? fb.CreateProfiler('createDiscArtShadow') : null;
	if ((albumArt && albumArtSize.w > 0) || (discArt && pref.displayDiscArt && discArtSize.w > 0)) {
		const discArtMargin = SCALE(2);
		shadowImg = discArt && !displayPlaylist && !displayLibrary && pref.displayDiscArt ?
			gdi.CreateImage(discArtSize.x + discArtSize.w + 2 * geo.discArtShadow, discArtSize.h + discArtMargin + 2 * geo.discArtShadow) :
			gdi.CreateImage(albumArtSize.x + albumArtSize.w + 2 * geo.discArtShadow, albumArtSize.h + 2 * geo.discArtShadow);
		if (pref.layout === 'default' && shadowImg) {
			const shimg = shadowImg.GetGraphics();
			// if (albumArt && !displayBiography) {
			// 	shimg.FillRoundRect(geo.discArtShadow, geo.discArtShadow, albumArtSize.x + albumArtSize.w, albumArtSize.h,
			// 		0.5 * geo.discArtShadow, 0.5 * geo.discArtShadow, col.shadow);
			// }

			if (discArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary) {
				const offset = discArtSize.w * 0.40; // Don't change this value
				const xVal = discArtSize.x;
				const shadowOffset = geo.discArtShadow * 2;

				shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + discArtMargin, discArtSize.w - shadowOffset, discArtSize.w - shadowOffset, geo.discArtShadow * 2, col.discArtShadow); // outer shadow
				shimg.DrawEllipse(xVal + geo.discArtShadow + offset, offset + geo.discArtShadow + discArtMargin, discArtSize.w - offset * 2, discArtSize.h - offset * 2, 60, col.discArtShadow); // inner shadow
			}
			shadowImg.ReleaseGraphics(shimg);
			shadowImg.StackBlur(geo.discArtShadow);
		}
	}

	if (timings.showDebugTiming) shadowProfiler.Print();
}


/**
 * Creates the disc art rotation animation with RotateImg().
 */
function createRotatedDiscArtImage() {
	// Drawing discArt rotated is slow, so first draw it rotated into the rotatedDiscArt image, and then draw rotatedDiscArt image unrotated in on_paint.
	if (pref.displayDiscArt && (discArt && discArtSize.w > 0)) {
		let tracknum = parseInt(fb.TitleFormat(`$num($if(${tf.vinyl_tracknum},$sub($mul(${tf.vinyl_tracknum},2),1),$if2(%tracknumber%,1)),1)`).Eval()) - 1;
		if (!pref.rotateDiscArt || Number.isNaN(tracknum)) tracknum = 0; // Avoid NaN issues when changing tracks rapidly
		rotatedDiscArt = RotateImg(discArt, discArtSize.w, discArtSize.h, tracknum * pref.rotationAmt);
	}

	// TODO: Once spinning art is done, scrap this and the rotation amount crap and just use indexes into the discArtArray when needed.
	// ? IDEA: Smooth rotation to new position?
	return rotatedDiscArt;
}


/**
 * Disposes the disc art image when changing or deactivating disc art.
 * @param {GdiBitmap} discArtImg The loaded disc art image.
 */
function disposeDiscArtImage(discArtImg) {
	discArtSize = new ImageSize(0, 0, 0, 0);
	discArtImg = null;
	return null;
}


/**
 * Fetches new disc art when a new album is being played.
 */
function fetchDiscArt() {
	const fetchDiscArtProfiler = timings.showDebugTiming ? fb.CreateProfiler('fetchDiscArt') : null;
	let discArtExists = true;
	let discArtPath;

	const discArtAllPaths = [
		$(pref.cdartdisc_path),              // Root -> cd%discnumber%.png
		$(pref.cdartdisc_path_artwork_root), // Root Artwork -> cd%discnumber%.png
		$(pref.cdartdisc_path_images_root),  // Root Images -> cd%discnumber%.png
		$(pref.cdartdisc_path_scans_root),   // Root Scans -> cd%discnumber%.png
		$(pref.cdartdisc_path_artwork),      // Subfolder Artwork -> cd%discnumber%.png
		$(pref.cdartdisc_path_images),       // Subfolder Images -> cd%discnumber%.png
		$(pref.cdartdisc_path_scans),        // Subfolder Scans -> cd%discnumber%.png
		$(pref.cdart_path),                  // Root -> cd.png
		$(pref.cdart_path_artwork_root),     // Root Artwork -> cd.png
		$(pref.cdart_path_images_root),      // Root Images -> cd.png
		$(pref.cdart_path_scans_root),       // Root Scans -> cd.png
		$(pref.cdart_path_artwork),          // Subfolder Artwork -> cd.png
		$(pref.cdart_path_images),           // Subfolder Images -> cd.png
		$(pref.cdart_path_scans),            // Subfolder Scans -> cd.png
		$(pref.vinylside_path),              // Root -> vinyl side
		$(pref.vinylside_path_artwork_root), // Root Artwork -> vinyl%vinyl disc%.png
		$(pref.vinylside_path_images_root),  // Root Images -> vinyl%vinyl disc%.png
		$(pref.vinylside_path_scans_root),   // Root Scans -> vinyl%vinyl disc%.png
		$(pref.vinylside_path_artwork),      // Subfolder Artwork -> vinyl%vinyl disc%.png
		$(pref.vinylside_path_images),       // Subfolder Images -> vinyl%vinyl disc%.png
		$(pref.vinylside_path_scans),        // Subfolder Scans -> vinyl%vinyl disc%.png
		$(pref.vinyl_path),                  // Root -> vinyl.png
		$(pref.vinyl_path_artwork_root),     // Root Artwork -> vinyl.png
		$(pref.vinyl_path_images_root),      // Root Images -> vinyl.png
		$(pref.vinyl_path_scans_root),       // Root Scans -> vinyl.png
		$(pref.vinyl_path_artwork),          // Subfolder Artwork -> vinyl.png
		$(pref.vinyl_path_images),           // Subfolder Images -> vinyl.png
		$(pref.vinyl_path_scans)             // Subfolder Scans -> vinyl.png
	];

	const discArtStubPaths = {
		cdWhite:         paths.cdArtWhiteStub,
		cdBlack:         paths.cdArtBlackStub,
		cdBlank:         paths.cdArtBlankStub,
		cdTrans:         paths.cdArtTransStub,
		cdCustom:        paths.cdArtCustomStub,
		vinylWhite:      paths.vinylArtWhiteStub,
		vinylVoid:       paths.vinylArtVoidStub,
		vinylColdFusion: paths.vinylArtColdFusionStub,
		vinylRingOfFire: paths.vinylArtRingOfFireStub,
		vinylMaple:      paths.vinylArtMapleStub,
		vinylBlack:      paths.vinylArtBlackStub,
		vinylBlackHole:  paths.vinylArtBlackHoleStub,
		vinylEbony:      paths.vinylArtEbonyStub,
		vinylTrans:      paths.vinylArtTransStub,
		vinylCustom:     paths.vinylArtCustomStub
	};

	if (pref.displayDiscArt && !isStreaming) { // We must attempt to load CD/vinyl art first so that the shadow is drawn correctly
		if (pref.noDiscArtStub || pref.showDiscArtStub) {
			// * Search for disc art
			for (let i = 0; i < discArtAllPaths.length; i++) {
				const found = IsFile(discArtAllPaths[i]);
				if (found) {
					discArtPath = discArtAllPaths[i];
					discArtExists = true;
				}
				// Didn't find anything
				else if (!noAlbumArtStub && pref.noDiscArtStub) discArtExists = false;
			}
		}

		// * Disc art found
		if (IsFile(discArtPath)) {
			discArtExists = true;
		}
		// * No disc art found, display custom disc art stubs
		else if (!pref.noDiscArtStub || pref.showDiscArtStub) {
			discArtExists = true;
			discArtPath = discArtStubPaths[pref.discArtStub];
		}

		// * Load disc art
		if (discArtExists) {
			let tempDiscArt;
			if (loadFromCache) {
				tempDiscArt = artCache.getImage(discArtPath);
			}
			if (tempDiscArt) {
				disposeDiscArtImage(discArt);
				discArt = tempDiscArt;
				resizeArtwork(true);
				createRotatedDiscArtImage();
				if (pref.spinDiscArt) {
					discArtArray = [];	// Clear last image
					setDiscArtRotationTimer();
				}
			} else {
				gdi.LoadImageAsyncV2(window.ID, discArtPath).then(discArtImg => {
					disposeDiscArtImage(discArt); // Delay disposal so we don't get flashing
					discArt = artCache.encache(discArtImg, discArtPath);
					resizeArtwork(true);
					createRotatedDiscArtImage();
					if (pref.spinDiscArt) {
						discArtArray = [];	// Clear last image
						setDiscArtRotationTimer();
					}
					lastLeftEdge = 0; // Recalc label location
					repaintWindow();
				});
			}
		}
		else {
			discArt = disposeDiscArtImage(discArt);
		}
	}

	if (timings.showDebugTiming) fetchDiscArtProfiler.Print();
}


/**
 * Resizes and resets the size and position of the disc art.
 * @param {boolean} resetDiscArtPosition Whether the position of the disc art should be reset.
 */
function resizeDiscArt(resetDiscArtPosition) {
	if (discArt) {
		const discArtSizeCorr = SCALE(4);
		const discArtMargin = SCALE(2);
		const discArtMarginRight = SCALE(36);

		if (hasArtwork) {
			if (resetDiscArtPosition) {
				discArtSize.x =
					ww - (albumArtSize.x + albumArtSize.w) < albumArtSize.h * pref.discArtDisplayAmount ? Math.floor(ww - albumArtSize.h - discArtMarginRight) :
					pref.discArtDisplayAmount === 1 ? Math.floor(ww - albumArtSize.h - discArtMarginRight) :
					pref.discArtDisplayAmount === 0.5 ? Math.floor(Math.min(ww - albumArtSize.h - discArtMarginRight,
						albumArtSize.x + albumArtSize.w - (albumArtSize.h - 4) * (1 - pref.discArtDisplayAmount) - (pref.discArtDisplayAmount === 1 || pref.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight))) :
					Math.floor(albumArtSize.x + albumArtSize.w - (albumArtSize.h - discArtSizeCorr) * (1 - pref.discArtDisplayAmount) - discArtMarginRight);

				discArtSize.y = albumArtSize.y + discArtMargin;
				discArtSize.w = albumArtSize.h - discArtSizeCorr; // Disc art must be square so use the height of album art for width of discArt
				discArtSize.h = discArtSize.w;
			} else { // When disc art moves because folder images are different sizes we want to push it outwards, but not move it back in so it jumps around less
				discArtSize.x = Math.max(discArtSize.x, Math.floor(Math.min(ww - albumArtSize.h - discArtMarginRight,
					albumArtSize.x + albumArtSize.w - (albumArtSize.h - 4) * (1 - pref.discArtDisplayAmount) - (pref.discArtDisplayAmount === 1 || pref.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight))));

				discArtSize.y = discArtSize.y > 0 ? Math.min(discArtSize.y, albumArtSize.y + discArtMargin) : albumArtSize.y + discArtMargin;
				discArtSize.w = Math.max(discArtSize.w, albumArtSize.h - discArtSizeCorr);
				discArtSize.h = discArtSize.w;
				if (discArtSize.x + discArtSize.w > ww) {
					discArtSize.x = ww - discArtSize.w - discArtMarginRight;
				}
			}
		}
		else { // * No album art so we need to calc size of disc
			const discScale = Math.min(((displayPlaylist || displayLibrary) ? 0.5 * ww : 0.75 * ww) / discArt.Width, (wh - geo.topMenuHeight - geo.lowerBarHeight - SCALE(16)) / discArt.Height);
			let xCenter = 0;

			if (displayPlaylist || displayLibrary) {
				xCenter = 0.25 * ww;
			} else if (ww / wh < 1.40) { // When using a roughly 4:3 display the album art crowds, so move it slightly off center
				xCenter = 0.56 * ww; // TODO: check if this is still needed?
			} else {
				xCenter = 0.5 * ww;
				artOffCenter = false;
				if (discScale === 0.75 * ww / discArt.Width) {
					xCenter += 0.1 * ww;
					artOffCenter = true; // TODO: We should probably suppress labels in this case
				}
			}

			// Need to -4 from height and add 2 to y to avoid skipping discArt drawing - not sure this is needed
			discArtSize.w = Math.floor(discArt.Width * discScale) - discArtSizeCorr; // Width
			discArtSize.h = discArtSize.w; // height
			discArtSize.x = Math.floor(xCenter - 0.5 * discArtSize.w); // Left

			if (discScale !== (wh - geo.topMenuHeight - geo.lowerBarHeight - SCALE(16)) / discArt.Height) {
				// Restricted by width
				const y = geo.topMenuHeight + Math.floor(((wh - geo.topMenuHeight - geo.lowerBarHeight - SCALE(16)) / 2) - discArtSize.h / 2);
				discArtSize.y = Math.min(y, 160);
			} else {
				discArtSize.y = geo.topMenuHeight + discArtMargin; // Top
			}
			hasArtwork = true;
		}
	}
	else {
		discArtSize = new ImageSize(0, 0, 0, 0);
	}

	if ((hasArtwork || noAlbumArtStub) && (discArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary && pref.layout !== 'compact')) {
		createDiscArtShadow();
	}
}


/**
 * Sets the disc art timer with different set interval values for rotating the disc art.
 */
function setDiscArtRotationTimer() {
	clearInterval(discArtRotationTimer);
	if (pref.layout === 'default' && discArt && fb.IsPlaying && !fb.IsPaused && pref.displayDiscArt && pref.spinDiscArt && !displayPlaylist && !displayLibrary && !displayBiography) {
		console.log(`creating ${pref.spinDiscArtImageCount} rotated disc images, shown every ${pref.spinDiscArtRedrawInterval}ms`);
		discArtRotationTimer = setInterval(() => {
			rotatedDiscArtIndex++;
			rotatedDiscArtIndex %= pref.spinDiscArtImageCount;
			if (!discArtArray[rotatedDiscArtIndex] && discArt && discArtSize.w) {
				DebugLog(`creating discArtImg: ${rotatedDiscArtIndex} (${discArtSize.w}x${discArtSize.h}) with rotation: ${360 / pref.spinDiscArtImageCount * rotatedDiscArtIndex} degrees`);
				discArtArray[rotatedDiscArtIndex] = RotateImg(discArt, discArtSize.w, discArtSize.h, 360 / pref.spinDiscArtImageCount * rotatedDiscArtIndex);
			}
			const discArtLeftEdge = pref.detailsAlbumArtOpacity !== 255 || pref.detailsAlbumArtDiscAreaOpacity !== 255 || pref.discArtOnTop ? discArtSize.x : albumArtSize.x + albumArtSize.w - 1; // The first line of discArtImg that will be drawn
			window.RepaintRect(discArtLeftEdge, discArtSize.y, discArtSize.w - (discArtLeftEdge - discArtSize.x), discArtSize.h, !pref.discArtOnTop && !pref.displayLyrics);
		}, pref.spinDiscArtRedrawInterval);
	}
}


/////////////////////////////////////
// * DETAILS - BAND & LABEL LOGO * //
/////////////////////////////////////
/**
 * Checks if a band logo exists at various paths.
 * @param {string} bandStr The name of the band.
 * @returns {string} The path of the band logo if it exists.
 */
function checkBandLogo(bandStr) {
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

	return testBandLogoPath(paths.artistlogos, bandStr) || // Try 800x310 white
		testBandLogoPath(paths.artistlogosColor, bandStr); // Try 800x310 color
}


/**
 * Gets the band logo and its inverted version based on the current playing album artist in Details.
 */
function getBandLogo() {
	bandLogo = null;
	invertedBandLogo = null;
	let path;
	let tryArtistList = [
		...getMetaValues('%album artist%').map(artist => ReplaceFileChars(artist)),
		...getMetaValues('%album artist%').map(artist => ReplaceFileChars(artist).replace(/^[Tt]he /, '')),
		ReplaceFileChars($('[%track artist%]')),
		...getMetaValues('%artist%').map(artist => ReplaceFileChars(artist)),
		...getMetaValues('%artist%').map(artist => ReplaceFileChars(artist).replace(/^[Tt]he /, ''))
	];

	tryArtistList = [...new Set(tryArtistList)];
	tryArtistList.some(artistString => {
		path = checkBandLogo(artistString);
		return path;
	});

	if (!path) return;

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


/**
 * Gets label logos based on current playing album artist in Details.
 * @param {FbMetadbHandle} metadb The metadb of the track.
 */
function getLabelLogo(metadb) {
	let labelStrings = [];
	recordLabels = [];	// Will free memory from earlier loaded record label images
	recordLabelsInverted = [];

	for (let i = 0; i < tf.labels.length; i++) {
		labelStrings.push(...getMetaValues(tf.labels[i], metadb));
	}
	labelStrings = [...new Set(labelStrings)];

	for (let i = 0; i < labelStrings.length; i++) {
		const addLabel = loadLabelLogo(labelStrings[i]);
		if (addLabel != null) {
			recordLabels.push(addLabel);
			try {
				recordLabelsInverted.push(addLabel.InvertColours());
			} catch (e) {}
		}
	}
}


/**
 * Loads the label logo in Details.
 * @param {string} publisherString The name of a record label or publisher.
 * @returns {GdiBitmap} The record label logo as a gdi image object.
 */
function loadLabelLogo(publisherString) {
	const d = new Date();
	const lastSrchYear = d.getFullYear();
	let dir = paths.labelsBase;
	let recordLabel = null;
	let labelStr = ReplaceFileChars(publisherString);

	if (labelStr) {
		// * First check for record label folder
		if (IsFolder(dir + labelStr) ||
			IsFolder(dir + (labelStr =
			labelStr.replace(/ Records$/, '')
					.replace(/ Recordings$/, '')
					.replace(/ Music$/, '')
					.replace(/\.$/, '')
					.replace(/[\u2010\u2013\u2014]/g, '-')))) { // Hyphen, endash, emdash
						let year = parseInt($('$year(%date%)'));
						for (; year <= lastSrchYear; year++) {
							const yearFolder = `${dir + labelStr}\\${year}`;
							if (IsFolder(yearFolder)) {
								console.log(`Found folder for ${labelStr} for year ${year}.`);
								dir += `${labelStr}\\${year}\\`;
								break;
							}
						}
						if (year > lastSrchYear) {
							dir += `${labelStr}\\`; // We didn't find a year folder so use the "default" logo in the root
							console.log(`Found folder for ${labelStr} and using latest logo.`);
						}
					}
		// * Actually load the label from either the directory we found above, or the base record label folder
		labelStr = ReplaceFileChars(publisherString); // We need to start over with the original string when searching for the file, just to be safe
		let label = `${dir + labelStr}.png`;

		if (IsFile(label)) {
			recordLabel = gdi.Image(label);
			console.log('Found Record label:', label, !recordLabel ? '<COULD NOT LOAD>' : '');
		}
		else {
			labelStr =
				labelStr.replace(/ Records$/, '')
						.replace(/ Recordings$/, '')
						.replace(/ Music$/, '')
						.replace(/[\u2010\u2013\u2014]/g, '-'); // Hyphen, endash, emdash

			label = `${dir + labelStr}.png`;
			if (IsFile(label)) return gdi.Image(label);
			label = `${dir + labelStr} Records.png`;
			if (IsFile(label)) return gdi.Image(label);
		}
	}
	return recordLabel;
}


/////////////////////////////////
// * DETAILS - METADATA GRID * //
/////////////////////////////////
/**
 * Calculates date ratios based on various time-related properties of a music track, displayed on the timeline in Details.
 * @param {boolean} dontUpdateLastPlayed Whether the last played date should be updated or not.
 * @param {string} currentLastPlayed The current value of the last played time.
 */
function calcDateRatios(dontUpdateLastPlayed, currentLastPlayed) {
	const newDate = new Date();
	dontUpdateLastPlayed = dontUpdateLastPlayed || false;

	let lfmPlayedTimesJsonLast = '';
	let playedTimesJsonLast = '';
	let playedTimesRatios = [];
	let lfmPlayedTimes = [];
	let playedTimes = [];
	let added = ToTime($('$if2(%added_enhanced%,%added%)'));
	let lastPlayed = ToTime($('$if2(%last_played_enhanced%,%last_played%)'));
	const firstPlayed = ToTime($('$if2(%first_played_enhanced%,%first_played%)'));
	const today = DateToYMD(newDate);

	if (dontUpdateLastPlayed && $Date(lastPlayed) === today) {
		lastPlayed = ToTime(currentLastPlayed);
	}

	if (componentEnhancedPlaycount) {
		const playedTimesJson = $('[%played_times_js%]', fb.GetNowPlaying());
		const lastfmJson = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
		const log = ''; // ! Don't need this crap to flood the console // playedTimesJson === playedTimesJsonLast && lastfmJson === lfmPlayedTimesJsonLast ? false : settings.showDebugLog;
		lfmPlayedTimesJsonLast = lastfmJson;
		playedTimesJsonLast = playedTimesJson;
		lfmPlayedTimes = ParseJson(lastfmJson, 'lastfm: ', log);
		playedTimes = ParseJson(playedTimesJson, 'foobar: ', log);
	}
	else {
		playedTimes.push(firstPlayed);
		playedTimes.push(lastPlayed);
	}

	if (firstPlayed) {
		if (!added) {
			added = firstPlayed;
		}
		const age = CalcAge(added);

		timelineFirstPlayedRatio = CalcAgeRatio(firstPlayed, age);
		timelineLastPlayedRatio = CalcAgeRatio(lastPlayed, age);
		if (timelineLastPlayedRatio < timelineFirstPlayedRatio) {
			// Due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
			timelineLastPlayedRatio = timelineFirstPlayedRatio;
		}

		if (playedTimes.length) {
			for (let i = 0; i < playedTimes.length; i++) {
				const ratio = CalcAgeRatio(playedTimes[i], age);
				playedTimesRatios.push(ratio);
			}
		} else {
			playedTimesRatios = [timelineFirstPlayedRatio, timelineLastPlayedRatio];
			playedTimes = [firstPlayed, lastPlayed];
		}

		let j = 0;
		const tempPlayedTimesRatios = playedTimesRatios.slice();
		tempPlayedTimesRatios.push(1.0001); // Pick up every last.fm time after lastPlayed fb knows about
		for (let i = 0; i < tempPlayedTimesRatios.length; i++) {
			const ratio = CalcAgeRatio(lfmPlayedTimes[j], age);
			while (j < lfmPlayedTimes.length && ratio < tempPlayedTimesRatios[i]) {
				playedTimesRatios.push(ratio);
				playedTimes.push(lfmPlayedTimes[j]);
				j++;
			}
			if (ratio === tempPlayedTimesRatios[i]) { // Skip one instance
				// console.log('skipped -->', ratio);
				j++;
			}
		}
		playedTimesRatios.sort();
		playedTimes.sort();

		timelineFirstPlayedRatio = playedTimesRatios[0];
		timelineLastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
	}
	else {
		timelineFirstPlayedRatio = 0.33;
		timelineLastPlayedRatio = 0.66;
	}
	str.timeline.setPlayTimes(timelineFirstPlayedRatio, timelineLastPlayedRatio, playedTimesRatios, playedTimes);
}


/**
 * Loads the codec logo of the now playing track, displayed in the metadata grid in Details.
 */
function loadCodecLogo() {
	const codec = $('$lower($if2(%codec%,$ext(%path%)))');
	const format = $('$lower($ext(%path%))', fb.GetNowPlaying());
	const lightBg = new Color(col.detailsText).brightness < 140;
	const bw = lightBg ? 'black' : 'white';

	paths.codecLogoAac     = `${imagesPath}codec/aac-${bw}.png`;
	paths.codecLogoAc3Dts  = `${imagesPath}codec/ac3_dts-${bw}.png`;
	paths.codecLogoAlac    = `${imagesPath}codec/alac-${bw}.png`;
	paths.codecLogoApe     = `${imagesPath}codec/ape-${bw}.png`;
	paths.codecLogoDsd     = `${imagesPath}codec/dsd-${bw}.png`;
	paths.codecLogoDsdSacd = `${imagesPath}codec/dsd-sacd-${bw}.png`;
	paths.codecLogoDxd     = `${imagesPath}codec/dxd-${bw}.png`;
	paths.codecLogoFlac    = `${imagesPath}codec/flac-${bw}.png`;
	paths.codecLogoMp3     = `${imagesPath}codec/mp3-${bw}.png`;
	paths.codecLogoMpc     = `${imagesPath}codec/musepack-${bw}.png`;
	paths.codecLogoOgg     = `${imagesPath}codec/ogg-${bw}.png`;
	paths.codecLogoOpus    = `${imagesPath}codec/opus-${bw}.png`;
	paths.codecLogoPcm     = `${imagesPath}codec/pcm-${bw}.png`;
	paths.codecLogoPcmAiff = `${imagesPath}codec/pcm-aiff-${bw}.png`;
	paths.codecLogoPcmWav  = `${imagesPath}codec/pcm-wav-${bw}.png`;
	paths.codecLogoWavpack = `${imagesPath}codec/wavpack-${bw}.png`;

	switch (true) {
		case codec === 'aac'             || format === 'aac':  codecLogo = gdi.Image(paths.codecLogoAac); break;
		case codec === 'alac'            || format === 'alac': codecLogo = gdi.Image(paths.codecLogoAlac); break;
		case codec === 'monkey\'s audio' || format === 'ape':  codecLogo = gdi.Image(paths.codecLogoApe); break;
		case codec === 'flac'            || format === 'flac': codecLogo = gdi.Image(paths.codecLogoFlac); break;
		case codec === 'mp3'             || format === 'mp3':  codecLogo = gdi.Image(paths.codecLogoMp3); break;
		case codec === 'musepack'        || format === 'mpc':  codecLogo = gdi.Image(paths.codecLogoMpc); break;
		case codec === 'vorbis'          || format === 'ogg':  codecLogo = gdi.Image(paths.codecLogoOgg); break;
		case codec === 'opus'            || format === 'opus': codecLogo = gdi.Image(paths.codecLogoOpus); break;
		case codec === 'wavpack'         || format === 'wv':   codecLogo = gdi.Image(paths.codecLogoWavpack); break;

		case ['ac3', 'dts', 'dca (dts coherent acoustics)'].includes(codec) || ['ac3', 'dts'].includes(format):
			codecLogo = gdi.Image(paths.codecLogoAc3Dts); break;
		case ['dsd64', 'dsd128', 'dsd256', 'dsd512', 'dsd1024', 'dsd2048'].includes(codec):
			codecLogo = gdi.Image(paths.codecLogoDsd); break;
		case ['dxd64', 'dxd128', 'dxd256', 'dxd512', 'dxd1024', 'dxd2048'].includes(codec):
			codecLogo = gdi.Image(paths.codecLogoDxd); break;
		case ['dst64', 'dst128', 'dst256', 'dst512', 'dst1024', 'dst2048'].includes(codec) && format === 'iso':
			codecLogo = gdi.Image(paths.codecLogoDsdSacd); break;

		case codec === 'pcm' && !['aiff', 'w64', 'wav'].includes(format):
			codecLogo = gdi.Image(paths.codecLogoPcm); break;
		case codec === 'pcm' && format === 'aiff':
			codecLogo = gdi.Image(paths.codecLogoPcmAiff); break;
		case codec === 'pcm' && ['w64', 'wav'].includes(format):
			codecLogo = gdi.Image(paths.codecLogoPcmWav); break;
	}
}


/**
 * Loads the release country flags, displayed in the metadata grid in Details.
 */
function loadReleaseCountryFlag() {
	releaseFlagImg = loadFlagImage($(tf.releaseCountry));
}


/**
 * Updates the metadata grid in Details, reuses last value for last played unless provided one.
 * @param {string} currentLastPlayed The current value of the "Last Played" metadata field.
 * @param {string} currentPlayingPlaylist The current active playlist that is being played from.
 * @returns {Array} The updated metadata grid, which is an array of objects with properties `label`, `val` and `age`.
 */
function updateMetadataGrid(currentLastPlayed, currentPlayingPlaylist) {
	currentLastPlayed = (str && str.grid ? str.grid.find(value => value.label === 'Last Played') || {} : {}).val;
	str.grid = [];
	for (let k = 0; k < metadataGrid.length; k++) {
		let val = $(metadataGrid[k].val);
		if (val && metadataGrid[k].label) {
			if (metadataGrid[k].age) {
				val = $(`$date(${val})`); // Never show time
				const age = CalcAgeDateString(val);
				if (age) {
					val += ` (${age})`;
				}
			}
			str.grid.push({
				age: metadataGrid[k].age,
				label: metadataGrid[k].label,
				val
			});
		}
	}
	if (typeof currentLastPlayed !== 'undefined') {
		const lp = str.grid.find(value => value.label === 'Last Played');
		if (lp) {
			lp.val = $Date(currentLastPlayed);
			if (CalcAgeDateString(lp.val)) {
				lp.val += ` (${CalcAgeDateString(lp.val)})`;
			}
		}
	}
	if (typeof currentPlayingPlaylist !== 'undefined') {
		const pl = str.grid.find(value => value.label === 'Playing List');
		if (pl) {
			pl.val = currentPlayingPlaylist;
		}
	}
	return str.grid;
}


///////////////////////////////////
// * PLAYLIST - INITIALIZATION * //
///////////////////////////////////
/**
 * Clears current used color of header and row nowplaying bg to prevent flashing from old used primary color.
 */
function clearPlaylistNowPlayingBg() {
	if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
		g_pl_colors.header_nowplaying_bg = '';
		g_pl_colors.row_nowplaying_bg = '';
	}
}


/**
 * Initializes the Playlist.
 */
function initPlaylist() {
	playlist = new PlaylistPanel(setPlaylistX(), 0);
	playlist.initialize();
}


/**
 * Updates the Playlist when content has changed, e.g when adding/removing items or changing the active playlist.
 */
function updatePlaylist() {
	Debounce((playlistIndex) => {
		trace_call && console.log('initPlaylistDebounced');
		playlist.on_playlist_items_added(playlistIndex);
	}, 100, {
		leading: false,
		trailing: true
	})(plman.ActivePlaylist);
}


/////////////////////////////
// * PLAYLIST - CONTROLS * //
/////////////////////////////
/**
 * Sorts the Playlist by sort patterns defined in the config file.
 */
function setPlaylistSortOrder() {
	plman.SortByFormat(plman.ActivePlaylist,
		pref.playlistSortOrder === 'default' ? settings.playlistSortDefault :
		pref.playlistSortOrder === 'artistDateAsc' ? settings.playlistSortArtistDateAsc :
		pref.playlistSortOrder === 'artistDateDesc' ? settings.playlistSortArtistDateDesc :
		pref.playlistSortOrder === 'album' ? settings.playlistSortAlbum :
		pref.playlistSortOrder === 'title' ? settings.playlistSortTitle :
		pref.playlistSortOrder === 'tracknum' ? settings.playlistSortTracknum :
		pref.playlistSortOrder === 'yearAsc' ? settings.playlistSortArtistYearAsc :
		pref.playlistSortOrder === 'yearDesc' ? settings.playlistSortArtistYearDesc :
		pref.playlistSortOrder === 'filePath' ? settings.playlistSortFilePath :
		pref.playlistSortOrder === 'custom' ? settings.playlistSortCustom : '');
}


//////////////////////////////////
// * LIBRARY - INITIALIZATION * //
//////////////////////////////////
/**
 * Initializes the Library.
 */
function initLibraryPanel() {
	if (libraryInitialized) return;
	ui = new UserInterface();
	panel = new Panel();
	sbar = new Scrollbar();
	vk = new Vkeys();
	lib = new Library();
	pop = new Populate();
	search = new Search();
	find = new Find();
	but = new Buttons();
	popUpBox = new PopUpBox();
	men = new MenuItems();
	timer = new Timers();
	libraryPanel = new LibraryPanel();
	library = new LibraryCallbacks();
	libraryInitialized = true;
}


/**
 * Initializes active Library layout presets.
 */
function initLibraryLayout() {
	const libraryLayoutSplitPresets =
		pref.libraryLayoutSplitPreset || pref.libraryLayoutSplitPreset2 || pref.libraryLayoutSplitPreset3 || pref.libraryLayoutSplitPreset4;

	const setLibraryView = () => {
		lib.logTree();
		pop.clearTree();
		ui.getFont(); // * Reset font size when pref.libraryLayoutSplitPreset4 was used
		repaintWindowRectAreas();
		if (pref.libraryLayout !== 'split' && (!pref.libraryLayoutFullPreset || !libraryLayoutSplitPresets)) {
			ppt.albumArtShow = pref.savedAlbumArtShow;
			ppt.albumArtLabelType = pref.savedAlbumArtLabelType;
		}
		panel.imgView = pref.libraryLayout === 'normal' && pref.libraryLayoutFullPreset ? ppt.albumArtShow = false : ppt.albumArtShow;
		men.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
	}

	// * Full layout preset
	if (pref.libraryLayout === 'full' && pref.libraryLayoutFullPreset) {
		pref.libraryDesign = 'reborn';
		pref.libraryThumbnailSize = pref.libraryThumbnailSizeSaved;
		if (pref.playerSize_HD_small && (pref.libraryThumbnailSize === 'auto' || ppt.thumbNailSize === 'auto')) {
			ppt.thumbNailSize = 1;
		}
		ppt.albumArtLabelType = 1;
		panel.imgView = ppt.albumArtShow = true;
	}
	// * Split layout presets
	else if (pref.libraryLayout === 'split' && libraryLayoutSplitPresets) {
		if (pref.layout !== 'default') return;

		if (!g_properties.show_header) updatePlaylist();

		if (pref.playlistLayout === 'full') {
			pref.playlistLayout = 'normal';
		}

		if (pref.libraryLayoutSplitPreset) {
			pref.libraryDesign = 'reborn';
			pref.libraryThumbnailSize = 'playlist';
			panel.imgView = ppt.albumArtShow = false;
			ppt.albumArtLabelType = 1;
			g_properties.show_header = true;
			if (displayPlaylist && displayLibrary) {
				g_properties.auto_collapse = true;
				playlist.auto_collapse_header();
			}
			else {
				g_properties.auto_collapse = false;
				playlist.expand_header();
			}
		}
		else if (pref.libraryLayoutSplitPreset2) {
			pref.libraryDesign = 'reborn';
			pref.libraryThumbnailSize = 'playlist';
			panel.imgView = ppt.albumArtShow = false;
			ppt.albumArtLabelType = 1;
			g_properties.auto_collapse = false;
			g_properties.show_header = displayPlaylist && !displayLibrary && pref.libraryLayout === 'split';
			updatePlaylist();
		}
		else if (pref.libraryLayoutSplitPreset3) {
			pref.libraryDesign = 'reborn';
			pref.libraryThumbnailSize = 'playlist';
			panel.imgView = ppt.albumArtShow = true;
			ppt.albumArtLabelType = 1;
			g_properties.show_header = true;
			if (displayPlaylist && displayLibrary) {
				g_properties.auto_collapse = true;
				playlist.auto_collapse_header();
			}
			else {
				g_properties.auto_collapse = false;
				playlist.expand_header();
			}
		}
		else if (pref.libraryLayoutSplitPreset4) {
			pref.libraryDesign = 'artistLabelsRight';
			pref.libraryThumbnailSize = 'playlist';
			panel.imgView = ppt.albumArtShow = true;
			ppt.albumArtLabelType = 2;
			g_properties.show_header = true;
			if (displayPlaylist && displayLibrary) {
				g_properties.auto_collapse = true;
				playlist.auto_collapse_header();
			}
			else {
				g_properties.auto_collapse = false;
				playlist.expand_header();
			}
		}
		playlist.on_size(ww, wh);
	}

	if (!libraryInitialized) return;
	setLibraryView();
	setLibrarySize();
	initLibraryColors();
	themeColorAdjustments();
	window.Repaint();
}


/**
 * Sets the Library design.
 */
function setLibraryDesign() {
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
}


/**
 * Sets the Library size and position.
 */
function setLibrarySize() {
	if (!libraryInitialized) return;

	const x =
		pref.layout === 'artwork' || pref.libraryLayout !== 'normal' ? 0 :
		pref.panelWidthAuto ? !fb.IsPlaying ? 0 : albumArtSize.x + albumArtSize.w :
		ww * 0.5;

	const y = geo.topMenuHeight;

	const libraryWidth =
		pref.layout === 'artwork' || pref.libraryLayout === 'full' ? ww :
		pref.panelWidthAuto ? !fb.IsPlaying ? ww : displayPlaylistLibrary() ? albumArtSize.x + albumArtSize.w : ww - (albumArtSize.x + albumArtSize.w) :
		ww * 0.5;

	const libraryHeight = Math.max(0, wh - geo.lowerBarHeight - y);

	ppt.zoomNode = 100; // Sets correct node zoom value, i.e when switching to 4K
	panel.setTopBar();	// Resets filter font in case the zoom was reset, also needed when changing font size

	libraryPanel.on_size(x, y, libraryWidth, libraryHeight);
}


////////////////////////////
// * LIBRARY - CONTROLS * //
////////////////////////////
/**
 * Drags and drops items from Library to Playlist in split layout.
 */
function libraryPlaylistDragDrop() {
	const handleList = pop.getHandleList('newItems');
	pop.sortIfNeeded(handleList);
	fb.DoDragDrop(0, handleList, handleList.Count ? 1 | 4 : 0);

	const pl = plman.ActivePlaylist;
	const drop_idx = playlistDropIndex;

	if (plman.IsPlaylistLocked(pl)) return; // Do nothing, it's locked or an auto-playlist

	plman.ClearPlaylistSelection(pl);

	setTimeout(() => {
		plman.RemovePlaylistSelection(pl);
		plman.InsertPlaylistItems(pl, drop_idx, handleList);
		plman.SetPlaylistFocusItem(pl, drop_idx);
	}, 1);
}


/////////////////////////////
// * LIBRARY - ALBUM ART * //
/////////////////////////////
/**
 * Dynamically resizes Library album cover thumbnails based on the player size.
 */
function autoThumbnailSize() {
	if (pref.libraryThumbnailSize !== 'auto') return;

	const noStd = ['coversLabelsRight', 'artistLabelsRight'].includes(pref.libraryDesign) || ppt.albumArtLabelType === 2;
	const fullW = pref.libraryLayout === 'full' && pref.layout === 'default';

	if (!RES_4K && !RES_QHD) {
		if (pref.layout === 'default' && ww < 1600 && wh < 960 || pref.layout === 'artwork' && ww < 700 && wh < 860) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
			pref.layout === 'artwork' ? 1 : 2; // Thumbnail size 'Small' or 'Regular'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 1600 && wh >= 960 || pref.layout === 'artwork' && ww >= 700 && wh >= 860) {
			ppt.thumbNailSize = noStd && fullW ? 2 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
			fullW ? 3 : 3; // Thumbnail size 'Medium'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 1802 && wh >= 1061 || pref.layout === 'artwork' && ww >= 901 && wh >= 1062) {
			ppt.thumbNailSize = noStd && !fullW ? 2 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
			fullW ? ww === 1802 && wh === 1061 ? 5 : 4 : 3; // Thumbnail size 'XL' or 'Large' or 'Medium'
			ppt.verticalAlbumArtPad = 2;
		}
	}
	else if (RES_QHD) {
		if (pref.layout === 'default' && ww < 1802 && wh < 1061 || pref.layout === 'artwork' && ww < 901 && wh < 1061) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
			pref.layout === 'artwork' ? 1 : 2; // Thumbnail size 'Small' or 'Regular'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 1802 && wh >= 1061 || pref.layout === 'artwork' && ww >= 901 && wh >= 1061) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
			fullW ? 4 : 2; // Thumbnail size 'Medium' or 'Regular'
			ppt.verticalAlbumArtPad = 3;
		}
		if (pref.layout === 'default' && ww >= 2280 && wh >= 1300 || pref.layout === 'artwork' && ww >= 1140 && wh >= 1300) {
			ppt.thumbNailSize = noStd && !fullW ? 2 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
			fullW ? 5 : 3; // Thumbnail size 'Large' or 'Medium'
			ppt.verticalAlbumArtPad = fullW ? 2 : 3;
		}
	}
	else if (RES_4K) {
		if (pref.layout === 'default' && ww < 2800 && wh < 1720 || pref.layout === 'artwork' && ww < 1400 && wh < 1720) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
			fullW ? 2 : 1;  // Thumbnail size 'Small'
			ppt.verticalAlbumArtPad = 2;
		}
		if (pref.layout === 'default' && ww >= 2800 && wh >= 1720 || pref.layout === 'artwork' && ww >= 1400 && wh >= 1720) {
			ppt.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
			fullW ? 3 : 1; // Thumbnail size 'Regular' or 'Small'
			ppt.verticalAlbumArtPad = 3;
		}
		if (pref.layout === 'default' && ww >= 3400 && wh >= 2020 || pref.layout === 'artwork' && ww >= 1400 && wh >= 1720) {
			ppt.thumbNailSize = noStd && !fullW ? 1 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
			fullW ? ww === 3400 && wh === 2020 ? 4 : 4 : 2; // Thumbnail size 'Medium' or 'Regular'
			ppt.verticalAlbumArtPad = 2;
		}
	}
	img.sizeDebounce();
}


////////////////////////////////////
// * BIOGRAPHY - INITIALIZATION * //
////////////////////////////////////
/**
 * Initializes the Biography.
 */
function initBiographyPanel() {
	if (biographyInitialized) return;
	uiBio = new UserInterfaceBio();
	vkBio = new VkeysBio();
	panelBio = new PanelBio();
	name = new Names();
	alb_scrollbar = new ScrollbarBio();
	art_scrollbar = new ScrollbarBio();
	art_scroller = new ScrollbarBio();
	cov_scroller = new ScrollbarBio();
	butBio = new ButtonsBio();
	popUpBoxBio = new PopUpBoxBio();
	txt = new Text();
	tagBio = new TaggerBio();
	resize = new ResizeHandler();
	libBio = new LibraryBio();
	imgBio = new ImagesBio();
	seeker = new Seeker();
	filmStrip = new FilmStrip();
	timerBio = new TimersBio();
	menBio = new MenuItemsBio();
	serverBio = new ServerBio();
	infoboxBio = new InfoboxBio();
	lyricsBio = new LyricsBio();
	biographyPanel = new BiographyPanel();
	biography = new BiographyCallbacks();
	biographyInitialized = true;
}


/**
 * Initializes active Biography layout presets.
 */
function initBiographyLayout() {
	if (pref.biographyLayoutFullPreset) {
		pptBio.style = pref.biographyLayoutFullPreset && pref.layout === 'default' && pref.biographyLayout === 'full' ? 3 : 0;
		pptBio.showFilmStrip = false;
		pptBio.filmStripPos = 3;
	}
	repaintWindowRectAreas();
	setBiographySize();
}


/**
 * Sets the Biography display layout.
 */
function setBiographyDisplay() {
	switch (pref.biographyDisplay) {
		case 'Image+text':
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
}


/**
 * Sets the Biography size and position.
 */
function setBiographySize() {
	if (!biographyInitialized) return;

	const x = 0;
	const y = geo.topMenuHeight;

	const biographyWidth =
		pref.layout === 'artwork' || pref.biographyLayout === 'full' ? ww :
		pref.panelWidthAuto ? (!albumArt && !noAlbumArtStub || !fb.IsPlaying) ? ww : albumArtSize.x + albumArtSize.w :
		ww * 0.5;

	const biographyHeight = Math.max(0, wh - geo.lowerBarHeight - y);

	// * Set guard for fixed Biography margin sizes in case user changed them in Biography options
	pptBio.borT  = SCALE(30);
	pptBio.borL  = SCALE(pref.layout === 'artwork' ? 30 : 40);
	pptBio.borR  = SCALE(pref.layout === 'artwork' ? 30 : 40);
	pptBio.borB  = SCALE(30);
	pptBio.textT = SCALE(30);
	pptBio.textL = SCALE(pref.layout === 'artwork' ? 30 : 40);
	pptBio.textR = SCALE(pref.layout === 'artwork' ? 30 : 40);
	pptBio.textB = SCALE(30);
	pptBio.gap   = SCALE(15);

	biographyPanel.on_size(x, y, biographyWidth, biographyHeight);
}


/////////////////////////////////
// * LYRICS - INITIALIZATION * //
/////////////////////////////////
/**
 * Initializes Lyrics of the now playing song.
 */
function initLyrics() {
	lyrics = new Lyrics();
    lyrics.on_size(albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h);
	lyrics.initLyrics();
}


/**
 * Displays Lyrics on startup or when remembering the Lyrics panel state.
 */
function displayLyrics() {
	fb.Play();
	displayPlaylist = pref.layout === 'default';
	setTimeout(() => {
		pref.displayLyrics = true;
		initLyrics();
		initButtonState();
	}, 500);
}


/**
 * Resets the size and position of the lyrics.
 */
function resetLyricsPosition() {
	const fullW = pref.layout === 'default' && pref.lyricsLayout === 'full' && pref.displayLyrics;
	const noAlbumArtSize = wh - geo.topMenuHeight - geo.lowerBarHeight;

	const lyricsX =
		noAlbumArtStub ?
			fullW ? pref.panelWidthAuto && pref.lyricsLayout === 'normal' ? noAlbumArtSize * 0.5 : ww * 0.333 :
			pref.panelWidthAuto ? albumArtSize.x : 0 :
		albumArtSize.x;

	const lyricsY = noAlbumArtStub ? geo.topMenuHeight : albumArtSize.y;

	const lyricsW =
		noAlbumArtStub ?
			pref.layout === 'artwork' ? ww :
			fullW ? ww * 0.333 :
			pref.panelWidthAuto ? noAlbumArtSize :
			ww * 0.5 :
		albumArtSize.w;

	const lyricsH = noAlbumArtStub ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h;

	if (lyrics) {
		lyrics.on_size(lyricsX, lyricsY, lyricsW, lyricsH);
	}
}
