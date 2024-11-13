/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Main                                     * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    13-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * MAIN USER INTERFACE * //
/////////////////////////////
/**
 * A class that is responsible for drawing all main user interface parts.
 */
class MainUI {
	/**
	 * Creates the `MainUI` instance.
	 */
	constructor() {
		// * GEOMETRY * //
		// #region GEOMETRY
		/** @public @type {number} The global window.Width. */
		this.ww = window.Width;
		/** @public @type {number} The global window.Height. */
		this.wh = window.Height;
		/** @public @type {number} The margin width from the edge of the player to the seekbar. */
		this.edgeMargin = SCALE(grSet.layout !== 'default' ? 20 : 40);
		/** @public @type {number} The both margin widths from the edge of the player to the seekbar. */
		this.edgeMarginBoth = this.edgeMargin * 2;
		/** @public @type {number} The width and height of the pause button. */
		this.pauseSize = SCALE(100);
		/** @public @type {number} The x-position of the styled tooltip string. */
		this.styledToolTipX = 0;
		/** @public @type {number} The y-position of the styled tooltip string. */
		this.styledToolTipY = 0;
		/** @public @type {number} The width of the styled tooltip string. */
		this.styledToolTipW = 0;
		/** @public @type {number} The height of the styled tooltip string. */
		this.styledToolTipH = 0;
		/** @public @type {number} The height of the top menu. */
		this.topMenuHeight = SCALE(40);
		/** @public @type {number} The top menu button count of the panel buttons. */
		this.topMenuBtnCount = 5;
		/** @public @type {number} The transport button count in the lower bar. */
		this.lowerBarBtnCount = 6;
		/** @public @type {number} The y-position of the transport buttons in the lower bar. */
		this.lowerBarBtnY = 0;
		/** @public @type {number} The margin between artist/track title and seekbar in the lower bar. */
		this.lowerBarTextMargin = SCALE(15);
		/** @public @type {number} The starting y-position of the text strings in the lower bar. */
		this.lowerBarTextStartY = 0;
		/** @public @type {number} The top position where strings will begin to drawn in the lower bar. */
		this.lowerBarTop = 0;
		/** @public @type {number} The total transport button width in the lower bar. */
		this.lowerBarTotalBtnW = 0;
		/** @public @type {number} The time area width in the lower bar. */
		this.lowerBarTimeAreaW = 0;
		/** @public @type {number} The available width to display artist/track title strings in the lower bar. */
		this.lowerBarAvailableW = 0;
		/** @public @type {number} The total height of lower bar. */
		this.lowerBarHeight = SCALE(120);
		/** @public @type {number} The width of the artist country flags in the lower bar. */
		this.lowerBarFlagW = 0;
		/** @public @type {number} The x-position of the artist in the lower bar. */
		this.lowerBarArtistX = 0;
		/** @public @type {number} The y-position of the artist in the lower bar. */
		this.lowerBarArtistY = 0;
		/** @public @type {number} The width of the artist string in the lower bar. */
		this.lowerBarArtistW = 0;
		/** @public @type {number} The height of the artist string in the lower bar. */
		this.lowerBarArtistH = 0;
		/** @public @type {number} The x-position of the track number string in the lower bar. */
		this.lowerBarTrackNumX = 0;
		/** @public @type {number} The y-position of the track number string in the lower bar. */
		this.lowerBarTrackNumY = 0;
		/** @public @type {number} The width of the track number string in the lower bar. */
		this.lowerBarTrackNumW = 0;
		/** @public @type {number} The x-position of the track title string in the lower bar. */
		this.lowerBarTitleX = 0;
		/** @public @type {number} The y-position of the track title string in the lower bar. */
		this.lowerBarTitleY = 0;
		/** @public @type {number} The width of the track title string in the lower bar. */
		this.lowerBarTitleW = 0;
		/** @public @type {number} The height of the track title string in the lower bar. */
		this.lowerBarTitleH = 0;
		/** @public @type {number} The width of the combined artist and title strings in the lower bar. */
		this.lowerBarArtistTitleW = 0;
		/** @public @type {boolean} The lower bar's one-line artist/track title display. */
		this.lowerBarOneLine = true;
		/** @public @type {boolean} The lower bar's two-lines artist/track title display. */
		this.lowerBarTwoLines = false;
		/** @public @type {number} The x-position of the software version string in the lower bar. */
		this.lowerBarVersionX = 0;
		/** @public @type {number} The y-position of the software version string in the lower bar. */
		this.lowerBarVersionY = 0;
		/** @public @type {number} The width of the software version string in the lower bar. */
		this.lowerBarVersionW = 0;
		/** @public @type {number} The height of the software version string in the lower bar. */
		this.lowerBarVersionH = 0;
		/** @public @type {number} The x-position of the track length string in the lower bar. */
		this.lowerBarLengthX = 0;
		/** @public @type {number} The y-position of the track length string in the lower bar. */
		this.lowerBarLengthY = 0;
		/** @public @type {number} The width of the track length string in the lower bar. */
		this.lowerBarLengthW = 0;
		/** @public @type {number} The height of the track length string in the lower bar. */
		this.lowerBarLengthH = 0;
		/** @public @type {number} The x-position of the track time string in the lower bar. */
		this.lowerBarTimeX = 0;
		/** @public @type {number} The y-position of the track time string in the lower bar. */
		this.lowerBarTimeY = 0;
		/** @public @type {number} The width of track time string in the lower bar. */
		this.lowerBarTimeW = 0;
		/** @public @type {number} The height of track time string in the lower bar. */
		this.lowerBarTimeH = 0;
		/** @public @type {number} The x-position of the disc string in the lower bar. */
		this.lowerBarDiscX = 0;
		/** @public @type {number} The y-position of the disc string in the lower bar. */
		this.lowerBarDiscY = 0;
		/** @public @type {number} The width of the disc string in the lower bar. */
		this.lowerBarDiscW = 0;
		/** @public @type {number} The height of the disc string in the lower bar. */
		this.lowerBarDiscH = 0;
		/** @public @type {number} The x-position of the seekbar in the lower bar. */
		this.seekbarX = 0;
		/** @public @type {number} The y-position of the seekbar in the lower bar. */
		this.seekbarY = 0;
		/** @public @type {number} The height of the seekbar (progress bar, peakmeter bar, waveform bar ) in the lower bar. */
		this.seekbarHeight = 0;
		// #endregion

		// * CACHE * //
		// #region CACHE
		/** @public @type {boolean} The state when to update the ratings for the artist, album, and track of the currently playing track. */
		this.cachedCurrentRatings = false;
		/** @public @type {boolean} The calculated lower bar metrics saved so we don't have to recalculate every on every on_paint unless size or metadata changed. */
		this.cachedLowerBarMetrics = false;
		// #endregion

		// * CONTROLS *//
		// #region CONTROLS
		/** @public @type {boolean} The top menu and contextual menu state, is it open ( active ) or not. */
		this.activeMenu = false;
		/** @public @type {boolean} The display state of the Playlist panel. */
		this.displayPlaylist = false;
		/** @public @type {boolean} The display state of the Playlist panel in Artwork layout. */
		this.displayPlaylistArtwork = false;
		/** @public @type {boolean} The display state of the Details panel. */
		this.displayDetails = false;
		/** @public @type {boolean} The display state of the Library panel. */
		this.displayLibrary = false;
		/** @public @type {boolean} The display state of the Biography panel. */
		this.displayBiography = false;
		/** @public @type {boolean} The display state of the Lyrics panel. */
		this.displayLyrics = false;
		/** @public @type {boolean} The display state of custom theme menu when using Options > Theme > Edit custom theme. */
		this.displayCustomThemeMenu = false;
		/** @public @type {boolean} The display state of the metadata grid menu. */
		this.displayMetadataGridMenu = false;
		/** @public @type {boolean} The double click mouse state. */
		this.doubleClicked = false;
		/** @public @type {object} The mouse move position state. */
		this.state = {};
		/** @private @type {string} The text content of the lower bar tooltip. */
		this.lowerBarTooltipText = '';
		/** @public @type {string} The tooltip text handler for styled tooltip. */
		this.styledTooltipText = '';
		/** @public @type {FbTooltip} The tooltip object. */
		this.ttip = null;
		// #endregion

		// * IMAGES * //
		// #region IMAGES
		/** @public @type {GdiBitmap} The big album art image displayed on the left side. */
		this.albumArt = null;
		/** @private @type {GdiBitmap} The copy of the original album art image, used for cropping. */
		this.albumArtCopy = null;
		/** @public @type {boolean} The state when album art is corrupt and can not be loaded. */
		this.albumArtCorrupt = false;
		/** @public @type {boolean} The state when artwork displayed is embedded and not loaded from a file. */
		this.albumArtEmbedded = false;
		/** @private @type {boolean} The state to always load art from cache unless this is set. */
		this.albumArtFromCache = true;
		/** @public @type {number} The index of currently displayed album art if more than 1. */
		this.albumArtIndex = 0;
		/** @public @type {GdiBitmap[]} The album art list array containing album and disc art images. */
		this.albumArtList = [];
		/** @public @type {boolean} The state when album art is loaded. */
		this.albumArtLoaded = false;
		/** @private @type {boolean} The off-center position of the album art, if true, it will shift 40 pixels to the right. */
		this.albumArtOffCenter = false;
		/** @public @type {number} The scale factor of the album art. */
		this.albumArtScaleFactor = 0;
		/** @public @type {GdiBitmap} The pre-scaled album art to speed up drawing considerably. */
		this.albumArtScaled = null;
		/** @public @type {object} The album art position (big image). */
		this.albumArtSize = new ImageSize(0, 0, 0, 0);
		/** @public @type {boolean} The state when the disc art image from the album art list is displayed. */
		this.discArtImageDisplayed = false;
		/** @public @type {boolean} The state when the disc art image is in PNG format. */
		this.discArtImagePNG = false;
		/** @private @type {boolean} The state when album art or disc art has artwork loaded. */
		this.hasArtwork = false;
		/** @public @type {boolean} The no album art stub when no album cover was found. */
		this.noAlbumArtStub = false;
		/** @public @type {GdiBitmap[]} The array of flag images shown in Details and in the lower bar. */
		this.flagImgs = [];
		/** @private @type {GdiBitmap} The Hi-Res Audio badge logo image shown on album art when enabled. */
		this.hiResAudioLogo = null;
		// #endregion

		// * STATE * //
		// #region STATE
		/** @public @type {string} The path of the current playing album directory, used for art caching purposes on_playback_new_track. */
		this.currentAlbumFolder = '';
		/** @public @type {string} The path of the last played album directory, used for art caching purposes on_playback_new_track. */
		this.lastAlbumFolder = '';
		/** @public @type {string} %album% tag of the current playing album, used for art caching purposes on_playback_new_track. */
		this.lastAlbumFolderTag = '';
		/** @public @type {string} The disc number of the last played album directory, used for art caching purposes on_playback_new_track. */
		this.lastAlbumDiscNumber = '';
		/** @public @type {string} The vinyl side of the last played album, used for art caching purposes on_playback_new_track. */
		this.lastAlbumVinylSide = '';
		/** @public @type {string} The date and time of the current last played album, used for art caching purposes on_playback_new_track. */
		this.currentLastPlayed = '';
		/** @public @type {object} The current ratings for the artist, album, and track of the currently playing track. */
		this.currentRatings = {};
		/** @public @type {string} Displays the active playlist of the current playing track in the metadata grid in Details. */
		this.playingPlaylist = '';
		/** @public @type {number} Saves last playback order. */
		this.lastPlaybackOrder = fb.PlaybackOrder;
		/** @public @type {boolean} Is the song from a streaming source? */
		this.isStreaming = false;
		/** @public @type {boolean} Is the song playing from a CD? */
		this.isPlayingCD = false;
		/** @private @type {boolean} Used to restore theme state after custom [%GR_THEME%] or [%GR_STYLE%] or [%GR_PRESET%] usage. */
		this.themeRestoreState = false;
		/** @public @type {boolean} When active styles match any theme presets, used for the notification popup in the showThemePresetIndicator. */
		this.themePresetMatchMode = false;
		/** @public @type {boolean} Used to hide theme preset indicator under certain conditions. */
		this.themePresetIndicator = true;
		/** @public @type {string} The name of the current theme preset. */
		this.themePresetName = '';
		/** @public @type {string} The text of the theme notification. */
		this.themeNotification = '';
		/** @public @type {boolean} The state to override condition in getRandomThemeColor() when using "Generate new color" from context menu. */
		this.getRandomThemeColorContextMenu = false;
		/** @public @type {boolean} Only use default theme when noArtwork was found. */
		this.noArtwork = false;
		/** @public @type {boolean} The state when noAlbumArtSize was set or not. */
		this.noAlbumArtSizeSet = false;
		/** @public @type {boolean} Only load theme colors when newTrackFetchingArtwork = true. */
		this.newTrackFetchingArtwork = false;
		/** @public @type {boolean} The state when the mouse is within the boundaries of the lyrics album art. */
		this.mouseInLyricsAlbumArt = false;
		/** @public @type {boolean} The state when the mouse is within the boundaries of the lyrics full layout edge bounds. */
		this.mouseInLyricsFullLayoutEdge = false;
		/** @public @type {boolean} The state when Library should not call window.Reload() from panel.set() -> panel.load(), i.e when saving theme settings or restoring theme backup. */
		this.libraryCanReload = true;
		/** @public @type {boolean} The state if this.initTheme() needs to be fully executed to save performance. */
		this.initThemeFull = false;
		/** @public @type {boolean} The state when the theme has completely loaded, used for pseudo delay background logo mask on startup or reload. */
		this.loadingThemeComplete = false;
		// #endregion

		// * TIMERS * //
		// #region TIMERS
		/** @public @type {number} The timer interval for the biography auto-download. */
		this.autoDownloadBioTimer = null;
		/** @public @type {number} The timer interval for the lyrics auto-download. */
		this.autoDownloadLyricsTimer = null;
		/** @public @type {number} The setTimeout ID for cycling album art. */
		this.albumArtTimeout = null;
		/** @public @type {number} The setTimeout ID for hiding cursor. */
		this.hideCursorTimeout = null;
		/** @public @type {number} The timer of seekbar. */
		this.seekbarTimer = null;
		/** @public @type {number} The timer interval between seekbar updates. */
		this.seekbarTimerInterval = null;
		/** @public @type {number} The timer for style auto random preset. */
		this.presetAutoRandomModeTimer = null;
		/** @public @type {number} The timer for theme preset indicator. */
		this.presetIndicatorTimer = null;
		/** @public @type {number} The timer for style auto color in Random theme. */
		this.randomThemeAutoColorTimer = null;
		/** @public @type {number} The 10 minute timer for theme day/night mode. */
		this.themeDayNightModeTimer = null;
		// #endregion

		// * DEBUG * //
		// #region DEBUG
		/** @public @type {number} Shows the image alpha in showThemeDebugOverlay. */
		this.blendedImgAlpha = 0;
		/** @public @type {number} Shows the image blur in showThemeDebugOverlay. */
		this.blendedImgBlur = 0;
		/** @public @type {string} Shows the col.primary in showThemeDebugOverlay. */
		this.selectedPrimaryColor = '';
		/** @public @type {string} Shows the col.primary_alt in showThemeDebugOverlay. */
		this.selectedPrimaryColor2 = '';
		/** @public @type {Array} Used in drawDebugRectAreas(). */
		this.repaintRects = [];
		/** @public @type {number} Used in RepaintRectAreas(). */
		this.repaintRectCount = 0;
		/** @public @type {boolean} The auto-download bio state, auto-downloading of artist biographies during shuffle playback with a 5-seconds timer. */
		this.autoDownloadBio = false;
		/** @public @type {boolean} The auto-download lyrics state, auto-downloading of lyrics during repeat playlist playback with a 15-seconds timer. */
		this.autoDownloadLyrics = false;
		/** @public @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
		this.traceCall = false;
		/** @public @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
		this.traceOnMove = false;
		/** @public @type {boolean} DO NOT CHANGE, can be activated via Options > Developer tools. */
		this.traceListPerformance = false;
		/** @public @type {boolean} Spams the console with draw times. */
		this.showDrawTiming = false;
		/** @public @type {boolean} Spams the console with every section of the draw code to determine bottlenecks. */
		this.showDrawExtendedTiming = false;
		/** @public @type {boolean} Spams the console with debug timing. */
		this.showDebugTiming = false;
		/** @public @type {boolean} Draws all window.RepaintRect as red outlines in the theme. */
		this.drawRepaintRects = false;
		/** @public @type {boolean} Spams the console with panel trace call. */
		this.showPanelTraceCall = false;
		/** @public @type {boolean} Spams the console with panel trace on move. */
		this.showPanelTraceOnMove = false;
		/** @public @type {boolean} Spams the console with playlist list performance. */
		this.showPlaylistTraceListPerf = false;
		/** @public @type {Array} Stores the debug timing logs. */
		this.debugTimingsArray = [];
		// #endregion

		// * REPAINT RECTS * //
		// #region REPAINT RECTS
		/** @public @type {Function} Throttles and limits the repaint requests for styled tooltips to 50 ms. */
		this.repaintStyledTooltips = Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), 50);
		/** @public @type {Function} Throttles and limits repaint requests for the debug system overlay to 1 sec. */
		this.repaintDebugSystemOverlay = Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), 1000);
		// #endregion
	}

	// * MAIN - PUBLIC METHODS - DRAW * //
	// #region MAIN - PUBLIC METHODS - DRAW
	/**
	 * Draws all main user interface parts in the correct order.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawMain(gr) {
		const drawTimingStart = (this.showDrawTiming || this.showDrawExtendedTiming) && new Date();

		this.drawBackgrounds(gr);
		this.drawUIHacksGlassFrameFix(gr, 'top');

		this.drawDetails(gr);
		this.drawPanels(gr);
		this.drawAlbumArt(gr);
		this.drawNoAlbumArt(gr);
		this.drawHiResAudioLogo(gr);
		this.drawPauseBtn(gr);
		this.drawJumpSearch(gr);
		this.drawLyrics(gr);
		this.drawStyles(gr);
		this.drawThemeNotification(gr);
		this.drawShadows(gr);
		this.drawTopMenuBar(gr);
		this.drawLowerBar(gr);
		this.drawCustomMenu(gr);
		this.drawStyledTooltips(gr);
		this.drawStartupBackground(gr);

		this.drawUIHacksGlassFrameFix(gr, 'main');

		this.drawDebugThemeOverlay(gr);
		this.drawDebugPerformanceOverlay(gr);
		this.drawDebugTiming(drawTimingStart);
		this.drawDebugRectAreas(gr);
	}

	/**
	 * Draws the Main background.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBackgrounds(gr) {
		gr.SetSmoothingMode(SmoothingMode.None);

		// * MAIN BACKGROUND * //
		gr.FillSolidRect(0, 0, this.ww, this.wh, grCol.bg);

		// * ALBUM ART BACKGROUND * //
		if (!this.displayDetails && (fb.IsPlaying || grSet.panelBrowseMode) && grSet.albumArtBg !== 'none' &&
			!(this.displayLyrics && grSet.lyricsLayout !== 'normal')) {
			const width = (
				grSet.albumArtBg === 'full' || grSet.layout === 'artwork' ||
				this.displayLyrics && grSet.lyricsLayout !== 'normal'
			) ? this.ww : this.albumArtSize.x;

			gr.FillSolidRect(0, this.albumArtSize.y, width, this.albumArtSize.h, grCol.detailsBg);
		}

		// * LYRICS BACKGROUND IMAGE * //
		if (this.displayLyrics && grSet.lyricsLayout !== 'normal' && grSet.lyricsBgImg && grm.bgImg.lyricsBgImg) {
			grm.bgImg.drawBgImage(gr, grm.bgImg.lyricsBgImg, grSet.lyricsBgImgScale, 0, this.topMenuHeight, this.ww, this.wh - this.topMenuHeight - this.lowerBarHeight, grSet.lyricsBgImgOpacity, false, 0, 0);
			if (this.mouseInLyricsFullLayoutEdge) gr.FillSolidRect(0, this.topMenuHeight,  this.ww, this.wh - this.topMenuHeight - this.lowerBarHeight, RGBA(0, 0, 0, 170));
		}

		// * BLENDED BACKGROUND FOR HOME PANEL IN ARTWORK LAYOUT & WHEN LYRICS LAYOUT IS FULL * //
		if (grSet.styleBlend && this.albumArt && grCol.imgBlended &&
			(this.displayArtworkLayoutCover() || this.displayLyrics && grSet.lyricsLayout !== 'normal')) {
			gr.DrawImage(grCol.imgBlended, 0, 0, this.ww, this.wh, 0, 0, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}

		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}

	/**
	 * Draws the Playlist, Library and Biography panels.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPanels(gr) {
		const displayPlaylist =
			grSet.layout !== 'artwork' && this.displayPlaylist ||
			grSet.layout === 'artwork' && this.displayPlaylistArtwork ||
			this.displayLibrarySplit();

		const drawPanel = (panel, label) => {
			const profiler = this.showDrawExtendedTiming && fb.CreateProfiler(`on_paint -> ${label}`);
			panel.call.on_paint(gr);
			if (profiler) profiler.Print();
		};

		// * Default && Artwork layout
		if (grSet.layout !== 'compact') {
			if (this.displayLibrary) {
				drawPanel(lib, 'library');
			}
			if (displayPlaylist) {
				drawPanel(pl, 'playlist');
			}
			if (this.displayBiography) {
				drawPanel(bio, 'biography');
			}
			return;
		}
		// * Compact layout
		if (displayPlaylist) {
			drawPanel(pl, 'playlist');
		}
	}

	/**
	 * Draws the big album art on the left side.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} [alpha] - The alpha to apply to the album art image.
	 */
	drawAlbumArt(gr, alpha) {
		if (!fb.IsPlaying && !grSet.panelBrowseMode || !this.albumArt && !this.albumArtScaled ||
			!this.albumArtDisplayed() || this.displayLibrarySplit()) {
			return;
		}

		const drawAlbumArtProfiler = this.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> album art');
		const padding = !grSet.filterDiscArtFromArtwork && this.discArtImageDisplayed && this.discArtImagePNG && this.albumArtLoaded ? Math.round(this.edgeMargin * 0.75) : 0;
		const imgAlpha = this.displayDetails && grm.details.discArt ? alpha : 255;

		gr.DrawImage(this.albumArtScaled, this.albumArtSize.x + padding, this.albumArtSize.y + padding,
					 this.albumArtSize.w - padding * 2, this.albumArtSize.h - padding * 2,
					 0, 0, this.albumArtScaled.Width, this.albumArtScaled.Height, 0, imgAlpha);

		if (drawAlbumArtProfiler) drawAlbumArtProfiler.Print();
	}

	/**
	 * Draws the no album art stub when no album cover exists.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawNoAlbumArt(gr) {
		if (this.albumArt || !this.noArtwork || !fb.IsPlaying && !grSet.panelBrowseMode) {
			this.noAlbumArtStub = false;
			this.noAlbumArtSizeSet = false;
			return;
		}

		if (!this.noAlbumArtSizeSet || !this.albumArtSize.w) {
			this.noAlbumArtStub = true;
			this.albumArt = null;
			this.setNoAlbumArtSize();
			this.noAlbumArtSizeSet = true;
		}

		if (this.albumArtDisplayed(true)) {
			const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

			const bgWidth =
				grSet.lyricsLayout !== 'normal' && this.displayLyrics || grSet.layout === 'artwork' ? this.ww :
				grSet.panelWidthAuto ? noAlbumArtSize :
				this.ww * 0.5;

			const bgHeight = noAlbumArtSize;

			const symbolWidth =
				grSet.layout === 'artwork' ? this.ww :
				grSet.panelWidthAuto ? noAlbumArtSize :
				this.ww * 0.5;

			const symbolHeight = noAlbumArtSize + grFont.noAlbumArtStub.Height * 0.5 - SCALE(14);

			// * Stub background
			gr.FillSolidRect(0, this.topMenuHeight, this.albumArtSize.x, bgHeight, !grSet.albumArtBg ? pl.col.bg : grCol.bg);
			gr.FillSolidRect(this.albumArtSize.x, this.topMenuHeight, bgWidth, bgHeight, pl.col.bg);

			// * Stub symbol
			if (!this.displayLyrics) {
				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				if (this.isStreaming) {
					gr.DrawString('\uf130\nLIVE', grFont.noAlbumArtStub2, grCol.noAlbumArtStub, this.albumArtSize.x, 0, symbolWidth, symbolHeight, StringFormat(1, 1));
				} else {
					gr.DrawString('\uf001', grFont.noAlbumArtStub, grCol.noAlbumArtStub, this.albumArtSize.x, 0, symbolWidth, symbolHeight, StringFormat(1, 1));
				}
			}
		}
	}

	/**
	 * Draws the artist country flags for specified type - either 'metadataGrid' or 'lowerBar'.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {string} type - The type specifying where to draw the flags ('metadataGrid' or 'lowerBar').
	 */
	drawArtistCountryFlag(gr, type) {
		if (!this.flagImgs.length) return;

		const fontSize = type === 'metadataGrid' ? grSet.gridArtistFontSize_layout : grSet.lowerBarFontSize_layout;
		const maxFlags = Math.min(this.flagImgs.length, 6);
		const flagWidth = HD_4K(this.flagImgs[0].Height, this.flagImgs[0].Height * 0.5) * (SCALE(fontSize) / fontSize);

		let flagsLeft;
		let fontSizeAdjustment;
		let widthAdjustment;
		let heightAdjustment;
		let yOffset;

		if (type === 'metadataGrid') {
			const gridArtistHeight = gr.CalcTextHeight(grStr.artist, grFont.gridArtist);
			flagsLeft = grm.details.gridMarginLeft;
			fontSizeAdjustment = SCALE(grSet.gridArtistFontSize_layout) - SCALE(18);
			widthAdjustment = SCALE(grSet.gridArtistFontSize_layout) - SCALE(26);
			heightAdjustment = gridArtistHeight + SCALE(2);
			yOffset = Math.round(grm.details.gridTop - (this.flagImgs[0].Height / heightAdjustment) - HD_4K(0, 1));
		}
		else if (type === 'lowerBar') {
			flagsLeft = this.edgeMargin - HD_4K(0, 1);
			fontSizeAdjustment = SCALE(grSet.lowerBarFontSize_layout) - SCALE(18);
			widthAdjustment = SCALE(grSet.lowerBarFontSize_layout) - SCALE(26);
			heightAdjustment = this.lowerBarArtistH + SCALE(2);
			yOffset = Math.round(this.lowerBarArtistY - (flagWidth / heightAdjustment) - HD_4K(0, 1));
		}

		gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

		for (let i = 0; i < maxFlags; i++) {
			const flagImg = this.flagImgs[i];
			gr.DrawImage(flagImg, flagsLeft, yOffset, flagWidth + widthAdjustment, heightAdjustment, 0, 0, flagImg.Width, flagImg.Height);
			flagsLeft += flagWidth + fontSizeAdjustment;
		}
	}

	/**
	 * Draws the Hi-Res Audio logo on album art.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawHiResAudioLogo(gr) {
		if (!grSet.showHiResAudioBadge || this.displayLyrics && grSet.lyricsLayout === 'full') return;

		const trackIsHiRes =
			(Number($('$info(bitspersample)', this.initMetadb())) > 16
			||
			Number($('$info(bitrate)', this.initMetadb())) > 1411);

		if (!trackIsHiRes || !this.albumArtDisplayed()) return;

		this.hiResAudioLogo = gdi.Image(grPath.hiResAudioLogoPath());

		const scaleFactor = RES._4K ? 0.5 : 1;
		const w = SCALE(this.hiResAudioLogo.Width * scaleFactor);
		const h = SCALE(this.hiResAudioLogo.Height * scaleFactor);

		const x =
			grSet.hiResAudioBadgePos === 'topleft' ? this.albumArtSize.x + SCALE(20) :
			grSet.hiResAudioBadgePos === 'topright' ? this.albumArtSize.x + this.albumArtSize.w - w - SCALE(20) :
			grSet.hiResAudioBadgePos === 'bottomleft' ? this.albumArtSize.x + SCALE(40) :
			grSet.hiResAudioBadgePos === 'bottomright' ? this.albumArtSize.x + this.albumArtSize.w - w - SCALE(40) : '';

		const y =
			grSet.hiResAudioBadgePos === 'topleft' || grSet.hiResAudioBadgePos === 'topright' ? this.albumArtSize.y + SCALE(20) :
			this.albumArtSize.y + this.albumArtSize.h - h - SCALE(40);

		gr.DrawImage(this.hiResAudioLogo, x, y, w, h, 0, 0, this.hiResAudioLogo.Width, this.hiResAudioLogo.Height);
	}

	/**
	 * Draws the pause button centered on album art.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPauseBtn(gr) {
		if (!fb.IsPaused) return;

		const buttonCanDisplay =
			grSet.showPause && this.themeNotification === '' && this.themePresetName === '' && !this.doubleClicked &&
			this.albumArtSize.w !== 0 && this.albumArtDisplayed();

		if (buttonCanDisplay) {
			grm.pseBtn.draw(gr);
		}
	}

	/**
	 * Draws the jump search on the right centered side.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawJumpSearch(gr) {
		grm.jSearch.setY(Math.round(this.wh * 0.5 - this.topMenuHeight - this.lowerBarHeight));
		grm.jSearch.draw(gr);
	}

	/**
	 * Draws the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetails(gr) {
		if (!this.displayDetails || !fb.IsPlaying && !grSet.panelBrowseMode) return;
		grm.details.drawDetails(gr);
	}

	/**
	 * Draws the lyrics on the album art in the Lyrics panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyrics(gr) {
		if (!this.displayLyrics || !fb.IsPlaying || !grm.lyrics) return;

		if (grSet.lyricsLayout === 'normal') {
			gr.SetSmoothingMode(SmoothingMode.None);
			if (grSet.layout === 'artwork') {
				gr.FillSolidRect(0, this.topMenuHeight, this.ww, this.wh - this.topMenuHeight - this.lowerBarHeight, grSet.lyricsBgImg ? RGBA(0, 0, 0, 170) : pl.col.bg);
			} else {
				gr.FillSolidRect(this.albumArtSize.x, this.albumArtSize.y, this.albumArtSize.w, this.albumArtSize.h, grSet.lyricsBgImg ? RGBA(0, 0, 0, 170) : pl.col.bg);
			}
		}

		this.drawLyricsInfoOverlay(gr);
		if (!this.mouseInLyricsFullLayoutEdge) grm.lyrics.drawLyrics(gr);
	}

	/**
	 * Draws the lyrics info overlay on the album art when lyrics layout is 'full', 'left' or 'right'.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyricsInfoOverlay(gr) {
		if (grSet.lyricsLayout === 'normal') return;

		// * Button handles repaint refresh and full layout right edge pause functionality
		grm.button.btn.lyricsInfoOverlay =
			new Button(0, this.topMenuHeight, this.ww, this.wh - this.topMenuHeight - this.lowerBarHeight, 'LyricsInfoOverlay', '', '');

		if (!this.mouseInLyricsAlbumArt && ['left', 'right'].includes(grSet.lyricsLayout) ||
			!this.mouseInLyricsFullLayoutEdge && grSet.lyricsLayout === 'full') {
			return;
		}

		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		// * Calculations
		const textMaxWidth = grSet.lyricsLayout === 'full' ? this.ww * 0.5 - this.edgeMarginBoth : this.albumArtSize.w - this.edgeMarginBoth;
		const textPadding = SCALE(Math.round(grSet.lyricsInfoFontSize_default * 0.333));
		const starSize = SCALE(grSet.lyricsInfoFontSize_default + 10);
		const starsTotalW = 5 * (starSize + textPadding) - textPadding;

		const { artistRating, albumRating, trackRating } = this.getCurrentRatings();
		const textElements = [
			{ str: grStr.artist, font: grFont.lyricsInfoHeadline, rating: artistRating },
			{ str: `${grStr.year} - ${grStr.album}`, font: grFont.lyricsInfoRegular, rating: albumRating },
			{ str: `${grStr.tracknum} ${grStr.titleLower}`, font: grFont.lyricsInfoRegular, rating: trackRating }
		];

		const textTotalHeight = CalcTextTotalHeight(gr, textElements, textMaxWidth, starSize, textPadding, 2, 2);
		let textX = Math.round(this.albumArtSize.x + this.edgeMargin);
		let textY = Math.round(this.albumArtSize.y + (this.albumArtSize.h - textTotalHeight) * 0.5);

		// * Adjustments
		if (grSet.lyricsLayout === 'full') {
			textX = Math.round(this.albumArtSize.x + this.albumArtSize.w + (this.ww - textMaxWidth - this.albumArtSize.w) * 0.5);
		} else {
			gr.FillSolidRect(this.albumArtSize.x - SCALE(1), this.albumArtSize.y - SCALE(1), this.albumArtSize.w + SCALE(1), this.albumArtSize.h + SCALE(1), RGBA(0, 0, 0, 170));
		}

		// * Drawing
		const ratingX = Math.round(textX + (textMaxWidth - starsTotalW) * 0.5);
		for (const { str, font, rating } of textElements) {
			textY = DrawMultilineString(gr, str, font, grCol.lyricsNormal, textX, textY, textMaxWidth, textPadding, StringFormat(1, 1));
			this.drawRatingStars(gr, rating, grFont.lyricsInfoHeadline, ratingX, textY + textPadding, starSize, textPadding);
			textY += starSize * 2 + textPadding * 2;
		}
	}

	/**
	 * Draws a 5-star rating system with fractional star support.
	 * @param {GdiGraphics} gr - The GDI graphics object used for drawing.
	 * @param {number} rating - The current rating (0 to 5), which can be fractional.
	 * @param {GdiFont} font - The font object used for drawing the stars.
	 * @param {number} x - The x-coordinate where the rating starts.
	 * @param {number} y - The y-coordinate where the rating starts.
	 * @param {number} starSize - The size of each star.
	 * @param {number} textPadding - The padding between stars.
	 */
	drawRatingStars(gr, rating, font, x, y, starSize, textPadding) {
		const starPadding = starSize + textPadding;
		const starFull = Math.floor(rating);
		const starFractional = rating % 1;

		const getStarType = (index) => {
			if (index < starFull) return Stars.full;
			if (index < rating) {
				if (starFractional >= 0.75) return Stars.threeQ;
				if (starFractional >= 0.50) return Stars.half;
				if (starFractional >= 0.25) return Stars.quarter;
			}
			return Stars.empty;
		};

		for (let i = 0; i < 5; i++) {
			const star = getStarType(i);
			const color = (i < rating) ? grCol.detailsRating : grCol.lyricsNormal;
			const calcX = x + i * starPadding;
			gr.DrawString(star, font, RGB(0, 0, 0), calcX, y, starSize, starSize, StringFormat(1, 1));
			gr.DrawString(star, font, color, calcX, y, starSize, starSize, StringFormat(1, 1));
		}
	}

	/**
	 * Draws the activated styles from Options > Styles.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawStyles(gr) {
		const drawStylesProfiler = this.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> theme styles');

		if (grSet.styleBevel) {
			gr.SetSmoothingMode(SmoothingMode.None);
			if ((grSet.layout === 'default' && (this.displayPlaylist || this.displayLibrary) && !this.displayBiography ||
				grSet.layout === 'artwork' && (!this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography)) && fb.IsPlaying) {
				// Fill gap when album art or player size is not proportional
				gr.FillSolidRect(-1, this.topMenuHeight, grSet.layout === 'default' ? this.albumArtSize.w + this.albumArtSize.x + 1 : this.ww + 1, (this.displayLibrary && grSet.libraryLayout === 'full' ? 0 : this.albumArtSize.y) - this.topMenuHeight - 1, RGBtoRGBA(grCol.styleBevel, 40));
			}
			if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) && !grSet.styleNighttime && !grSet.styleBlackAndWhite2 && !grSet.styleRebornBlack || (grSet.styleNighttime && fb.IsPlaying)) {
				const customTheme = grSet.theme.startsWith('custom');
				gr.FillGradRect(-1, 0, this.ww + 1, this.topMenuHeight, 90, 0, RGBtoRGBA(grCol.styleBevel, customTheme ? 255 : 40)); // Top
				gr.FillGradRect(-1, this.wh - this.lowerBarHeight - 1, this.ww + 1, this.lowerBarHeight + 1, -88, RGBtoRGBA(grCol.styleBevel, customTheme ? 255 : 80), 0); // Bottom
			} else {
				gr.FillGradRect(-1, 0, this.ww + 1, this.topMenuHeight, 90, grSet.styleBlackReborn ? 0 : RGBtoRGBA(grCol.styleBevel, 200), grSet.styleBlackReborn ? RGBtoRGBA(grCol.styleBevel, 200) : 0);
				gr.FillGradRect(-1, this.wh - this.lowerBarHeight - 1, this.ww + 1, this.lowerBarHeight + 1, -90, RGBtoRGBA(grCol.styleBevel, 255), 0);
			}
		}
		if (grSet.styleBlend2 && this.albumArt && grCol.imgBlended) {
			gr.DrawImage(grCol.imgBlended, -1, 0, this.ww + 1, this.wh, 0, -this.wh + this.topMenuHeight - 1, grCol.imgBlended.Width, grCol.imgBlended.Height, 180);
			gr.DrawImage(grCol.imgBlended, 0, this.wh - this.lowerBarHeight, this.ww, this.wh, 0, this.wh * 0.5, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}
		if (grSet.styleGradient || grSet.styleGradient2) {
			gr.FillGradRect(-0.5, 0, this.ww, this.topMenuHeight, grSet.styleGradient2 ? -200 : (grSet.styleNighttime || grSet.styleRebornBlack) ? -180 : 0, grSet.styleGradient2 || grSet.styleNighttime || grSet.styleRebornBlack ? 0 : grCol.styleGradient, grSet.styleGradient2 || grSet.styleNighttime || grSet.styleRebornBlack ? grCol.styleGradient2 : 0, 0.5);
			gr.FillGradRect(-0.5, this.wh - this.lowerBarHeight, this.ww, this.lowerBarHeight, grSet.styleGradient2 ? -200 : grSet.styleRebornBlack || grSet.styleNighttime ? -180 : 0, grSet.styleGradient2 || grSet.styleNighttime || grSet.styleRebornBlack ? 0 : grCol.styleGradient, grSet.styleGradient2 || grSet.styleNighttime || grSet.styleRebornBlack ? grCol.styleGradient2 : 0, 0.5);
		}
		if ((grSet.styleAlternative || grSet.styleAlternative2) && (['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme))) {
			gr.FillGradRect(0, 0, this.ww, this.topMenuHeight, -87, grCol.styleAlternative, 0);
			gr.FillGradRect(0, this.wh - this.lowerBarHeight, this.ww, this.lowerBarHeight, grSet.styleAlternative2 ? 87 : -87, 0, grCol.styleAlternative);
		}

		if (drawStylesProfiler) drawStylesProfiler.Print();
	}

	/**
	 * Draws a theme notification as a popup.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawThemeNotification(gr) {
		if (grSet.themeSetupDay || grSet.themeSetupNight) {
			const msg = grm.msg.getMessage('main', 'themeDayNightSetup');
			this.themeNotification = msg;
		}

		if (this.themeNotification === '' && this.themePresetName === '' ||
			!this.themePresetIndicator || !grSet.presetIndicator || !['off', 'dblclick'].includes(grSet.presetAutoRandomMode)) {
			return;
		}

		const themePresetText = this.themePresetMatchMode ? `Active styles matching:\n\n${this.themePresetName}` : this.themePresetName;
		const text = this.themeNotification === '' ? themePresetText : this.themeNotification;

		const arc = SCALE(6);
		const padding = SCALE(20);
		const lines = text.split('\n');
		const lineH = gr.CalcTextHeight('Ag', grFont.notification);
		const maxWidth = Math.max(...lines.map(line => gr.CalcTextWidth(line, grFont.notification)));
		const boxW = maxWidth + padding * 3;
		const boxH = lineH * lines.length + padding * 2;

		const fullW =
			grSet.layout === 'default'
			&&
			(this.displayPlaylist && grSet.playlistLayout === 'full'
			||
			this.displayLibrary && grSet.libraryLayout  === 'full'
			||
			this.displayBiography && grSet.biographyLayout === 'full'
			||
			this.displayLyrics && grSet.lyricsLayout !== 'normal');

		const cover = fb.IsPlaying && this.albumArt && grSet.layout !== 'compact' && !fullW;
		const noCoverDefault = grSet.layout === 'default' && !fullW && !grSet.panelWidthAuto;

		const x = Math.round((cover ? this.albumArtSize.x + this.albumArtSize.w * 0.5 : noCoverDefault ? this.ww * 0.25 : this.ww * 0.5) - boxW * 0.5);
		const y = Math.round((cover ? this.topMenuHeight + this.albumArtSize.h * 0.5 : ((this.wh - this.topMenuHeight - this.lowerBarHeight) * 0.5) + this.topMenuHeight) - boxH * 0.5);

		gr.SetSmoothingMode(SmoothingMode.AntiAlias);
		gr.FillRoundRect(x, y, boxW, boxH, arc, arc, grCol.popupBg);
		gr.DrawRoundRect(x, y, boxW, boxH, arc, arc, SCALE(2), 0x64000000);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		gr.DrawString(text, grFont.notification, grCol.popupText, x, y, boxW, boxH, StringFormat(1, 1, 4));
	}

	/**
	 * Draws all the shadows for album art and panels.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawShadows(gr) {
		const drawPanelShadowsProfiler = this.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> draw shadows');

		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		this.drawAlbumArtShadows(gr);
		this.drawPanelShadows(gr);

		if (drawPanelShadowsProfiler) drawPanelShadowsProfiler.Print();
	}

	/**
	 * Draws shadows for the album art.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawAlbumArtShadows(gr) {
		if (this.displayDetails || !this.albumArt || !this.albumArtDisplayed() ||
			this.displayLyrics && grSet.lyricsLayout === 'full' || this.displayArtworkLayoutCover()) {
			return;
		}

		if (this.displayLyrics && grSet.lyricsLayout !== 'normal') {
			gr.DrawRect(grSet.lyricsLayout === 'full' ? this.ww + 4 : this.albumArtSize.x - 1,
			this.albumArtSize.y - 1, this.albumArtSize.w + 1, this.albumArtSize.h + 1, 1, RGBA(0, 0, 0, 25));
			return;
		}

		const middleX =
			grSet.hideMiddlePanelShadow || this.albumArtSize.w === this.ww * 0.5 ? this.ww + 4 :
			this.albumArtSize.x + this.albumArtSize.w - 2;

		// Top shadow
		gr.FillGradRect(0, this.albumArtSize.y - HD_4K(6, 10), this.albumArtSize.x + this.albumArtSize.w, HD_4K(6, 10), 90, 0, grCol.shadow);
		// Middle shadow
		gr.FillGradRect(middleX, this.albumArtSize.y, 4, this.albumArtSize.h, 0.5, grm.color.getMiddleShadowColor(), 0);
		// Bottom shadow
		gr.FillGradRect(0, this.albumArtSize.y + this.albumArtSize.h + HD_4K(-1, 0), this.albumArtSize.x + this.albumArtSize.w, SCALE(5), 90, grCol.shadow, 0);
	}

	/**
	 * Draws shadows for all panels.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPanelShadows(gr) {
		if (!fb.IsPlaying && !grSet.panelBrowseMode && (this.displayDetails || this.displayArtworkLayoutCover())) {
			return;
		}

		const albumArtW =
			this.albumArtDisplayed() && !this.displayDetails && !this.displayArtworkLayoutCover() &&
			(grSet.lyricsLayout === 'normal' || !this.displayLyrics);

		const albumArtLyricsLayoutNotNormal = this.displayLyrics && grSet.lyricsLayout !== 'normal';

		const panelX =
			this.displayPlaylist ? pl.playlist.x :
			this.displayLibrary ? lib.ui.x :
			this.displayBiography ? bio.ui.x :
			grSet.layout !== 'default' || !this.albumArtSize.w || albumArtLyricsLayoutNotNormal ? 0 :
			this.albumArtSize.x + this.albumArtSize.w;

		const discArtInAlbumArtArea = this.displayDetails && this.discArtImageDisplayed;

		const middleX = grSet.hideMiddlePanelShadow || discArtInAlbumArtArea || this.displayLyrics && grSet.lyricsLayout !== 'normal' ? this.ww + 4 : panelX - 4;
		const x = albumArtW ? panelX : 0;
		const w = (albumArtW && !grSet.panelWidthAuto || this.discArtDisplayed()) && !discArtInAlbumArtArea ? panelX : this.ww;

		// Top shadow
		gr.FillGradRect(x, this.topMenuHeight - HD_4K(6, 10), w, HD_4K(6, 10), 90, 0, grCol.shadow);
		// Middle shadow
		gr.FillGradRect(middleX, this.topMenuHeight, 4, this.wh - this.topMenuHeight - this.lowerBarHeight, 0.5, 0, grm.color.getMiddleShadowColor());
		// Bottom shadow
		gr.FillGradRect(x, this.wh - this.lowerBarHeight + HD_4K(-1, 0), w, SCALE(5), 90, grCol.shadow, 0);
	}

	/**
	 * Draws the top menu bar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawTopMenuBar(gr) {
		const drawTopMenuBarProfiler = this.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> top menu bar');

		const noPlaylistHistoryBtns = !this.displayPlaylist && !this.displayPlaylistArtwork;
		const buttons = Object.values(grm.button.btn);

		for (const btn of buttons) {
			const { x, y, w, h, img, isEnabled, hoverAlpha, downAlpha, id } = btn;

			if (noPlaylistHistoryBtns && (id === 'Back' || id === 'Forward')) {
				continue;
			}

			if (img) {
				const disabled = isEnabled && !isEnabled();
				const alpha = disabled ? 150 : 255;
				gr.DrawImage(img.Default, x, y, w, h, 0, 0, w, h, 0, alpha);
				if (!disabled) {
					hoverAlpha && gr.DrawImage(img.Hovered, x, y, w, h, 0, 0, w, h, 0, hoverAlpha);
					downAlpha && gr.DrawImage(img.Down, x, y, w, h, 0, 0, w, h, 0, downAlpha);
					// btn.enabled && img.Enabled && gr.DrawImage(img.Enabled, x, y, w, h, 0, 0, w, h, 0, 255);
				}
			}
		}

		if (drawTopMenuBarProfiler) drawTopMenuBarProfiler.Print();
	}

	/**
	 * Draws the lower bar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLowerBar(gr) {
		const drawLowerBarProfiler = this.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> lower bar');

		this.setLowerBarMetrics(gr);

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && (grSet.lowerBarFontSize_layout < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

		// * Artist, tracknum, title
		if (this.lowerBarOneLine || this.lowerBarTwoLines && grSet.layout === 'default') {
			DrawString(gr, grStr.artistLower, grFont.lowerBarArtist, grCol.lowerBarArtist, this.lowerBarArtistX, this.lowerBarArtistY, this.lowerBarAvailableW - this.lowerBarFlagW, this.lowerBarArtistH, Stringformat.trim_ellipsis_char);
		}
		gr.DrawString(this.getFormattedString('lowerBarTrackNum'), grFont.lowerBarTitle, grCol.lowerBarTitle, this.lowerBarTrackNumX, this.lowerBarTrackNumY, this.lowerBarTrackNumW - this.lowerBarTimeAreaW, this.lowerBarTitleH, StringFormat(0, 0, 4, 0x00001000));
		DrawString(gr, grStr.titleLower, grFont.lowerBarTitle, grCol.lowerBarTitle, this.lowerBarTitleX, this.lowerBarTitleY, this.lowerBarAvailableW - this.lowerBarTrackNumW, this.lowerBarTitleH, Stringformat.trim_ellipsis_char);

		// * Artist country flags
		if (grSet.showLowerBarArtist_layout && grSet.showLowerBarArtistFlags_layout && (grSet.layout === 'default' || grSet.layout !== 'default' && !this.lowerBarTwoLines)) {
			this.drawArtistCountryFlag(gr, 'lowerBar');
		}

		// * Playback time, length, disc number
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		if (grSet.showPlaybackTime_layout && (fb.PlaybackLength > 0 || grSet.panelBrowseMode && grStr.time !== grCfg.lowerBarStoppedTime)) { // * Playing track
			gr.DrawString(grStr.disc, grFont.lowerBarDisc, grCol.lowerBarTitle, this.lowerBarDiscX, this.lowerBarDiscY, this.lowerBarDiscW, this.lowerBarDiscH, StringFormat(2, 0));
			gr.DrawString(grStr.time, grFont.lowerBarTime, grCol.lowerBarTime, this.lowerBarTimeX, this.lowerBarTimeY, this.lowerBarTimeW, this.lowerBarTimeH, StringFormat(2, 0));
			gr.DrawString(grStr.length, grFont.lowerBarLength, grCol.lowerBarLength, this.lowerBarLengthX, this.lowerBarLengthY, this.lowerBarLengthW, this.lowerBarLengthH, StringFormat(2, 0));
		}
		else if (grSet.showPlaybackTime_layout && fb.IsPlaying && this.isStreaming) { // * Streaming, but still want to show time
			gr.DrawString(grStr.time, grFont.lowerBarTime, grCol.lowerBarTime, this.lowerBarTimeX, this.lowerBarTimeY, this.lowerBarTimeW, this.lowerBarTimeH, StringFormat(2, 0));
		}
		else { // * Not playing anything, will show theme version or update link if available
			let offset = 0;
			if (grCfg.updateAvailable && grCfg.updateHyperlink) {
				offset = grCfg.updateHyperlink.getWidth();
				grCfg.updateHyperlink.setContainerWidth(this.ww);
				grCfg.updateHyperlink.setY(this.lowerBarTextStartY + 1);
				grCfg.updateHyperlink.setXOffset(this.ww - offset - this.edgeMargin);
				grCfg.updateHyperlink.draw(gr, grCol.lowerBarTitle);
			}
			else if (grSet.showPlaybackTime_layout) {
				gr.DrawString(grStr.time, grFont.lowerBarLength, grCol.lowerBarTitle, this.lowerBarVersionX - offset, this.lowerBarVersionY, this.lowerBarVersionW, this.lowerBarVersionH, StringFormat(2, 0));
			}
		}

		// * ARTIST PLAYLIST BTN * //
		if (grSet.showLowerBarArtist_layout) {
			grm.button.btn.artistPlaylist = new Button(this.lowerBarArtistX, this.lowerBarArtistY,
			this.lowerBarArtistW, this.lowerBarArtistH, 'ArtistBtn', '', 'Display artist playlist');
		}
		// * TITLE NOW PLAYING BTN * //
		if (grSet.showLowerBarTitle_layout) {
			grm.button.btn.titleNowPlaying = new Button(this.lowerBarTitleX, this.lowerBarTitleY,
			this.lowerBarTitleW - this.lowerBarTrackNumW, this.lowerBarTitleH, 'TitleBtn', '', 'Show now playing');
		}
		// * PLAYBACK TIME REMAINING BTN * //
		if (grSet.showPlaybackTime_layout) {
			grm.button.btn.playbackTime = new Button(this.ww - this.lowerBarTimeAreaW - this.edgeMargin, this.lowerBarTimeY,
			this.lowerBarTimeAreaW, this.lowerBarTimeH, 'PlaybackTime', '', 'Switch playback time');
		}
		// * VOLUME BTN * //
		if (grSet.showVolumeBtn_layout) {
			grm.volBtn.draw(gr);
		}
		// * PROGRESS BAR * //
		if (grSet.showProgressBar_layout && (grSet.seekbar === 'progressbar')) {
			grm.progBar.setY(this.seekbarY);
			grm.progBar.draw(gr);
		}
		// * PEAKMETER BAR * //
		else if (grSet.showPeakmeterBar_layout && grSet.seekbar === 'peakmeterbar') {
			grm.peakBar.setY(this.seekbarY);
			grm.peakBar.draw(gr);
		}
		// * WAVEFORM BAR * //
		else if (grSet.showWaveformBar_layout && grSet.seekbar === 'waveformbar') {
			grm.waveBar.setY(this.seekbarY);
			grm.waveBar.draw(gr);
		}

		if (drawLowerBarProfiler) drawLowerBarProfiler.Print();
	}

	/**
	 * Draws the custom menu, either custom theme menu or metadata grid menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawCustomMenu(gr) {
		this.drawCustomThemeMenu(gr);
		grm.details.drawGridMenu(gr);
	}

	/**
	 * Draws the custom theme menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawCustomThemeMenu(gr) {
		if (!this.displayCustomThemeMenu || grSet.layout !== 'default') return;

		const menuOnRightSide = this.displayBiography || this.displayLyrics && !this.displayDetails && !this.displayLibrary;

		const x = menuOnRightSide ? grSet.panelWidthAuto ? this.albumArtSize.x + this.albumArtSize.w : pl.playlist.x : this.displayDetails ? this.albumArtSize.x : 0;
		const y = this.topMenuHeight;
		const width = grSet.panelWidthAuto ? menuOnRightSide ? this.ww - this.albumArtSize.w : this.albumArtSize.w - 2 : this.displayDetails ? this.albumArtSize.w : this.ww * 0.5;
		const height = this.wh - this.topMenuHeight - this.lowerBarHeight;

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(x, y, width, height, pl.col.bg);
		for (const c of CustomMenu.controlList) c.draw(gr);

		if (CustomMenu.activeControl && CustomMenu.activeControl instanceof CustomMenuDropDown && CustomMenu.activeControl.isSelectUp) {
			CustomMenu.activeControl.draw(gr);
		}
	}

	/**
	 * Draws styled tooltips that will make standard tooltips look fancy.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawStyledTooltips(gr) {
		if (!grSet.showStyledTooltips) return;

		const drawStyledTooltipsProfiler = this.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> styled tooltips');
		const offset = SCALE(30);
		const padding = SCALE(15);
		const edgeSpace = padding * 0.5;
		const arc = SCALE(6);

		this.styledToolTipW = Math.min(gr.MeasureString(this.styledTooltipText, grFont.tooltip, 0, 0, 0, 0).Width + padding + 1, this.ww - (this.state.mouse_x > this.ww * 0.85 ? this.state.mouse_x - this.ww * 0.15 : this.state.mouse_x) - edgeSpace);
		this.styledToolTipH = Math.min(gr.MeasureString(this.styledTooltipText, grFont.tooltip, 0, 0, this.styledToolTipW, this.wh).Height + padding, this.wh - (this.state.mouse_y > this.wh * 0.85 ? this.state.mouse_y - this.wh * 0.15 : this.state.mouse_y) - edgeSpace - offset);
		this.styledToolTipX = this.state.mouse_x > this.ww * 0.85 ? this.state.mouse_x - this.styledToolTipW : this.state.mouse_x; // * When tooltip is too close to the right edge, it will be drawn on the left side of the mouse cursor
		this.styledToolTipY = this.state.mouse_y > this.wh * 0.85 ? this.state.mouse_y - this.styledToolTipH : this.state.mouse_y + offset; // * When tooltip is too close to the bottom edge, it will be drawn on the top side of the mouse cursor

		if (this.styledTooltipText === '') return;

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && (grSet.tooltipFontSize_layout < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
		gr.FillRoundRect(this.styledToolTipX, this.styledToolTipY, this.styledToolTipW, this.styledToolTipH, arc, arc, RGBtoRGBA(grCol.popupBg, 220));
		gr.DrawRoundRect(this.styledToolTipX, this.styledToolTipY, this.styledToolTipW, this.styledToolTipH, arc, arc, SCALE(2), 0x64000000);
		gr.DrawString(this.styledTooltipText, grFont.tooltip, grCol.popupText, this.styledToolTipX + padding * 0.5, this.styledToolTipY + padding * 0.5, this.styledToolTipW - padding, this.styledToolTipH - padding, StringFormat(0, 0, 4));

		this.repaintStyledTooltips(this.styledToolTipX - offset * 2, this.styledToolTipY - offset, this.styledToolTipW + offset * 4, this.styledToolTipH + offset * 2);

		if (drawStyledTooltipsProfiler) drawStyledTooltipsProfiler.Print();
	}

	/**
	 * Draws the startup background until everything in the theme is loaded.
	 * Pseudo delay background logo mask when loading the theme, otherwise it will show ugly repaints when initializing since smp v1.6.1.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawStartupBackground(gr) {
		if (this.loadingThemeComplete) return;
		gr.FillSolidRect(0, 0, this.ww, this.wh, grCol.loadingThemeBg);
		if (grSet.showPreloaderLogo) grPreloader.drawLogo(gr);
	}

	/**
	 * Draws the UIHacks aero glass shadow frame fix.
	 * This workaround crap is needed to hide the black 1px line at the top and bottom
	 * when UIHacks Glass Frame is active in foobar's Preferences > Display > Main Window > Aero effecs > Glass frame.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {string} type - The type of fix to apply ('top' or 'main').
	 */
	drawUIHacksGlassFrameFix(gr, type) {
		if (UIHacks.Aero.Effect !== 2) return;

		if (type === 'top') {
			gr.DrawLine(0, 0, this.ww, 0, 1, grCol.bg);
		}
		else if (type === 'main' && (!this.loadingThemeComplete && (grSet.styleBlend || grSet.styleBlend2) || !grSet.styleBlend && !grSet.styleBlend2)) {
			gr.DrawLine(0, 0, this.ww, 0, 1, !this.loadingThemeComplete ? grCol.loadingThemeBg : grCol.uiHacksFrame);
			if (grSet.styleDefault) {
				gr.DrawLine(this.ww, this.wh - 1, 0, this.wh - 1, 1, !this.loadingThemeComplete ? grCol.loadingThemeBg : grCol.uiHacksFrame);
			}
			else if (grSet.styleGradient || grSet.styleGradient2) {
				gr.DrawLine(0, 0, this.ww, 0, 1, grCol.bg);
				gr.FillGradRect(-0.5, 0, this.ww, 1, grSet.styleGradient2 ? -200 : 0, grSet.styleGradient2 ? 0 : grCol.styleGradient, grSet.styleGradient2 ? grCol.styleGradient2 : 0, 0.5);
			}
		}
	}

	/**
	 * Draws the debug theme overlay in the album art area when `Enable debug theme overlay` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugThemeOverlay(gr) {
		if (!grCfg.settings.showDebugThemeOverlay || !this.loadingThemeComplete) return;

		const fullW = grSet.layout === 'default' && grSet.lyricsLayout !== 'normal' && this.displayLyrics && this.noAlbumArtStub || grSet.layout === 'artwork';
		const titleWidth = this.albumArtSize.w - SCALE(80);
		const titleHeight = gr.CalcTextHeight(' ', grFont.popup);
		const lineSpacing = titleHeight * 1.5;
		const logColor = RGB(255, 255, 255);
		const x = this.albumArtSize.x + this.edgeMargin;
		let y = this.albumArtSize.y;

		const createBlock = (obj) => Object.keys(obj).find(key => obj[key]) || '';

		const tsBlock0 = createBlock({
			'Nighttime,': grSet.styleNighttime
		});

		const tsBlock1 = createBlock({
			'Bevel,': grSet.styleBevel
		});

		const tsBlock2 = createBlock({
			'Blend,': grSet.styleBlend,
			'Blend 2,': grSet.styleBlend2,
			'Gradient,': grSet.styleGradient,
			'Gradient 2,': grSet.styleGradient2
		});

		const tsBlock3 = createBlock({
			'Alternative ': grSet.styleAlternative,
			'Alternative 2': grSet.styleAlternative2,
			'Black and white': grSet.styleBlackAndWhite,
			'Black and white 2': grSet.styleBlackAndWhite2,
			'Black and white reborn': grSet.styleBlackAndWhiteReborn,
			'Black reborn': grSet.styleBlackReborn,
			'Reborn white': grSet.styleRebornWhite,
			'Reborn black': grSet.styleRebornBlack,
			'Reborn fusion': grSet.styleRebornFusion,
			'Reborn fusion 2': grSet.styleRebornFusion2,
			'Reborn fusion accent': grSet.styleRebornFusionAccent,
			'Random pastel': grSet.styleRandomPastel,
			'Random dark': grSet.styleRandomDark
		});

		const tsTopMenuButtons = grSet.styleTopMenuButtons !== 'default' ? CapitalizeString(`${grSet.styleTopMenuButtons}`) : '';
		const tsTransportButtons = grSet.styleTransportButtons !== 'default' ? CapitalizeString(`${grSet.styleTransportButtons}`) : '';
		const tsProgressBar1 = grSet.styleProgressBarDesign === 'rounded' ? 'Rounded,' : '';
		const tsProgressBar2 = grSet.styleProgressBar !== 'default' ? `Bg: ${CapitalizeString(`${grSet.styleProgressBar},`)}` : '';
		const tsProgressBar3 = grSet.styleProgressBarFill !== 'default' ? `Fill: ${CapitalizeString(`${grSet.styleProgressBarFill}`)}` : '';
		const tsVolumeBar1 = grSet.styleVolumeBarDesign === 'rounded' ? 'Rounded,' : '';
		const tsVolumeBar2 = grSet.styleVolumeBar !== 'default' ? `Bg: ${CapitalizeString(`${grSet.styleVolumeBar},`)}` : '';
		const tsVolumeBar3 = grSet.styleVolumeBarFill !== 'default' ? `Fill: ${CapitalizeString(`${grSet.styleVolumeBarFill}`)}` : '';

		const propertiesLog = [
			{ prop: this.selectedPrimaryColor, log: `Primary color: ${this.selectedPrimaryColor}` },
			{ prop: this.selectedPrimaryColor2, log: `Primary 2 color: ${this.selectedPrimaryColor2}` },
			{ prop: grCol.colBrightness, log: `Primary color brightness: ${grCol.colBrightness}` },
			{ prop: grCol.colBrightness2, log: `Primary 2 color brightness: ${grCol.colBrightness2}` },
			{ prop: grCol.imgBrightness, log: `Image brightness: ${grCol.imgBrightness}` },
			{ prop: grSet.styleBlend || grSet.styleBlend2, log: `Image blur: ${this.blendedImgBlur}` },
			{ prop: grSet.styleBlend || grSet.styleBlend2, log: `Image alpha: ${this.blendedImgAlpha}` },
			{ prop: grSet.preset, log: `Theme preset: ${grSet.preset}` },
			{ prop: grSet.themeBrightness !== 'default', log: `Theme brightness: ${grSet.themeBrightness}%` },
			{ prop: tsBlock0 || tsBlock1 || tsBlock2 || tsBlock3, log: `Styles: ${tsBlock0} ${tsBlock1} ${tsBlock2} ${tsBlock3}` },
			{ prop: tsTopMenuButtons, log: `Top menu button style: ${tsTopMenuButtons}` },
			{ prop: tsTransportButtons, log: `Transport button style: ${tsTransportButtons}` },
			{ prop: tsProgressBar1 || tsProgressBar2 || tsProgressBar3, log: tsProgressBar1 || tsProgressBar2 || tsProgressBar3 ? `Progressbar styles: ${tsProgressBar1} ${tsProgressBar2} ${tsProgressBar3}` : '' },
			{ prop: tsVolumeBar1 || tsVolumeBar2 || tsVolumeBar3, log: `Volumebar styles: ${tsVolumeBar1} ${tsVolumeBar2} ${tsVolumeBar3}` }
		];

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(fullW ? 0 : this.albumArtSize.x, fullW ? this.topMenuHeight : this.albumArtSize.y, fullW ? this.ww : this.albumArtSize.w, fullW ? this.wh - this.topMenuHeight - this.lowerBarHeight : this.albumArtSize.h, RGBA(0, 0, 0, 180));
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const drawString = (str) => {
			y += lineSpacing;
			gr.DrawString(str, grFont.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
		};

		for (const { prop, log } of propertiesLog) {
			if (prop) drawString(log);
			if (prop === grCol.imgBrightness) y += lineSpacing;
		}
	}

	/**
	 * Draws the debug performance overlay in the album art area when `Enable debug performance overlay` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugPerformanceOverlay(gr) {
		if (!grCfg.settings.showDebugPerformanceOverlay || !this.loadingThemeComplete) return;

		if (grm.cpuTrack.cpuTrackerTimer === null) {
			grm.cpuTrack.start();
		}

		const debugTimingsSorted = [...this.debugTimingsArray].sort((a, b) => a.localeCompare(b));
		const fullW = grSet.layout === 'default' && grSet.lyricsLayout !== 'normal' && this.displayLyrics && this.noAlbumArtStub || grSet.layout === 'artwork';
		const titleWidth = this.albumArtSize.w - SCALE(80);
		const titleHeight = gr.CalcTextHeight(' ', grFont.popup);
		const titleMaxWidthRepaint = gr.CalcTextWidth('Ram usage for current panel:  6291456 MB', grFont.popup);
		const lineSpacing = titleHeight * 1.5;
		const logColor = RGB(255, 255, 255);
		const x = this.albumArtSize.x + this.edgeMargin;
		let y = this.albumArtSize.y + lineSpacing;

		const systemLog = [
			{ title: 'System: ', log: '' },
			{ title: 'CPU usage: ', log: `${grm.cpuTrack.getCpuUsage()}%` },
			{ title: 'GUI usage: ', log: `${grm.cpuTrack.getGuiCpuUsage()}%` },
			{ title: 'Ram usage for current panel: ', log: FormatSize(window.JsMemoryStats.MemoryUsage) },
			{ title: 'Ram usage for all panels: ', log: FormatSize(window.JsMemoryStats.TotalMemoryUsage) },
			{ title: 'Ram usage limit: ', log: FormatSize(window.JsMemoryStats.TotalMemoryLimit) },
			{ title: 'Separator', log: '' },
			{ title: 'Timings: ', log: '' },
			{ title: '', log: debugTimingsSorted.join('\n') }
		];

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(fullW ? 0 : this.albumArtSize.x, fullW ? this.topMenuHeight : this.albumArtSize.y, fullW ? this.ww : this.albumArtSize.w, fullW ? this.wh - this.topMenuHeight - this.lowerBarHeight : this.albumArtSize.h, RGBA(0, 0, 0, 180));
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const drawString = (title, log) => {
			const lines = log.split('\n');
			lines.forEach((line, index) => {
				const fullString = title.length > 0 ? `${title} ${line}` : line;
				gr.DrawString(fullString, grFont.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
				y += lineSpacing;
			});
		};

		for (const { title, log } of systemLog) {
			if (title !== 'Separator') {
				drawString(title, log);
			} else {
				y += lineSpacing;
			}
		}

		this.repaintDebugSystemOverlay(x, this.albumArtSize.y + lineSpacing * 2, titleMaxWidthRepaint, lineSpacing * 4);
	}

	/**
	 * Draws the draw timing in the console when `Show extra draw timing` in Developer tools is active.
	 * @param {Date} drawTimingStart - The start time of the operation.
	 */
	drawDebugTiming(drawTimingStart) {
		if (!drawTimingStart) return;

		const drawTimingEnd = new Date();
		const duration = drawTimingEnd - drawTimingStart;
		const hours = String(drawTimingStart.getHours()).padStart(2, '0');
		const minutes = String(drawTimingStart.getMinutes()).padStart(2, '0');
		const seconds = String(drawTimingStart.getSeconds()).padStart(2, '0');
		const milliseconds = String(drawTimingStart.getMilliseconds()).padStart(3, '0');
		const time = `${hours}:${minutes}:${seconds}.${milliseconds}`;
		const repaintRectCalls = this.repaintRectCount > 1 ? ` - ${this.repaintRectCount} repaintRect calls` : '';

		console.log(`${time}: on_paint total: ${duration}ms${repaintRectCalls}`);
	}

	/**
	 * Draws red rectangles for debugging to show all painted areas in all panels when `Show draw areas` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugRectAreas(gr) {
		if (!this.repaintRects.length) return;
		this.repaintRectCount = 0;

		try {
			for (const rect of this.repaintRects) {
				gr.DrawRect(rect.x, rect.y, rect.w, rect.h, SCALE(2), RGBA(255, 0, 0, 200));
			}
			this.repaintRects = [];
		} catch (e) {}
	}
	// #endregion

	// * MAIN - PLUBLIC METHODS - METRICS * //
	// #region MAIN - PUBLIC METHODS - METRICS
	/**
	 * Gets the flag size width based on the type (metadataGrid or lowerBar).
	 * Calculates the scale value based on the number of flag images and the font size.
	 * The scale value is adjusted specifically for each possible number of flag images.
	 * @param {string} type - Indicates if it should get the flag size for the 'metadataGrid' or the 'lowerBar'.
	 * @returns {number} The calculated scale value or 0 if no flags are present or the conditions are not met.
	 */
	getFlagSizeWidth(type) {
		if (!this.flagImgs.length ||
			(type === 'metadataGrid' && !grSet.showGridArtistFlags_layout) ||
			(type === 'lowerBar' && !grSet.showLowerBarArtistFlags_layout)) {
			return 0;
		}

		const fontSize = type === 'metadataGrid' ? grSet.gridArtistFontSize_layout : grSet.lowerBarFontSize_layout;
		const { length } = this.flagImgs;

		return length === 0 ? 0 : SCALE(14 * length + fontSize * length);
	}

	/**
	 * Gets the appropriate amount of white space to be used between flags in the UI.
	 * This is determined based on the artist's font size and the number of flags to be displayed.
	 * @param {string} type - Indicates if it should get the flag size for the 'metadataGrid' or the 'lowerBar'.
	 * @returns {string} A string consisting of spaces, representing the calculated white space.
	 */
	getFlagSizeWhiteSpace(type) {
		if (!this.flagImgs.length) return 0;

		const fontSize = type === 'metadataGrid' ? grSet.gridArtistFontSize_layout : grSet.lowerBarFontSize_layout;

		const flagSizeWhiteSpaceTable = {
			24: [35, 29, 24, 18, 12, 6],
			23: [36, 30, 25, 19, 12, 6],
			22: [36, 30, 25, 19, 12, 6],
			21: [37, 31, 26, 20, 12, 6],
			20: [37, 31, 26, 20, 12, 6],
			19: [38, 32, 26, 20, 12, 6],
			18: [39, 32, 26, 20, 13, 6],
			17: [40, 33, 27, 20, 13, 6],
			16: [41, 34, 28, 21, 13, 6],
			15: [42, 35, 29, 22, 14, 6],
			14: [44, 36, 29, 22, 14, 6],
			13: [45, 37, 30, 23, 15, 6],
			12: [47, 39, 31, 24, 15, 7],
			11: [49, 41, 32, 25, 16, 7],
			10: [51, 43, 34, 26, 17, 7]
		};

		return ' '.repeat(
			flagSizeWhiteSpaceTable[fontSize][
				this.flagImgs.length >=  6 ? 0 :
				this.flagImgs.length === 5 ? 1 :
				this.flagImgs.length === 4 ? 2 :
				this.flagImgs.length === 3 ? 3 :
				this.flagImgs.length === 2 ? 4 :
				5
			]
		);
	}

	/**
	 * Gets the formatted string based on the provided key.
	 * This includes formatting for the grid artist, grid title, and lower bar track number.
	 * @param {string} key - The key for the formatted string to retrieve, can be 'gridArtist', 'gridTitle', and 'lowerBarTrackNum'.
	 * @returns {string} The formatted string corresponding to the provided key.
	 */
	getFormattedString(key) {
		const formattedString = {
			gridArtist:
				grSet.showGridArtistFlags_layout && this.flagImgs.length ? grm.details.gridFlagSizeWhiteSpace + grStr.artist :
				grStr.artist,

			gridTitle:
				this.isStreaming ? (grSet.showGridTrackNum_layout ? grStr.tracknum + grStr.title : grStr.title) :
				(grSet.showGridTrackNum_layout && grStr.tracknum !== '' ? `${grStr.tracknum}\xa0${grStr.title}` : grStr.title),

			lowerBarTrackNum:
				this.lowerBarTwoLines && !grSet.showLowerBarTrackNum_layout ? '' :
				fb.IsPlaying && this.lowerBarOneLine && (!grSet.showLowerBarTrackNum_layout || fb.PlaybackLength <= 0 && grStr.tracknum === '') ? '\u2013' :
				grStr.tracknum
		};

		return formattedString[key];
	}

	/**
	 * Gets the height of the seekbar based on the current configuration.
	 * The height is determined by the type of seekbar set in the configuration: 'progressbar', 'peakmeterbar', or 'waveformbar'.
	 * @returns {number} The height of the configured seekbar. If none of the conditions are met, undefined is returned.
	 */
	getSeekbarHeight() {
		const layoutNotDefault = grSet.layout !== 'default';
		const progressBarDefaultOrRounded = grSet.styleProgressBarDesign === 'default' || grSet.styleProgressBarDesign === 'rounded';

		const seekbarHeight = {
			progressbar:  SCALE(layoutNotDefault && progressBarDefaultOrRounded ? 10 : 12),
			peakmeterbar: SCALE(layoutNotDefault ? 16 : 26),
			waveformbar:  SCALE(layoutNotDefault ? 16 : 26)
		};

		return seekbarHeight[grSet.seekbar] || SCALE(12);
	}

	/**
	 * Gets the y-position of the seekbar.
	 * @returns {number} The calculated y-position of the seekbar.
	 */
	getSeekbarY() {
		return grSet.layout === 'default' ? Math.round(this.wh - this.edgeMargin) :
											Math.round(this.lowerBarTitleY + this.lowerBarTitleH +
											(!fb.IsPlaying ? SCALE(grSet.layout !== 'default' ? 10 : 12) :
											this.seekbarHeight * (grSet.seekbar === 'waveformbar' ? 0.33 : grSet.seekbar === 'peakmeterbar' ? 0.5 : 1)));
	}

	/**
	 * Gets the y-position for lower bar transport buttons based on the current layout.
	 * @returns {number} The calculated y-position for lower bar transport buttons.
	 */
	getLowerBarButtonsY() {
		const buttonSize = SCALE(grSet.transportButtonSize_layout);
		const baseButtonSize = SCALE(32);
		const baseTextHeight = SCALE(18);
		const textHeightDiff = SCALE(grSet.lowerBarFontSize_layout) - baseTextHeight;

		return grSet.layout === 'default' ? Math.round(this.wh - this.lowerBarHeight + ((this.lowerBarHeight - buttonSize) * 0.5) - this.lowerBarTextMargin * 0.5) :
											Math.round(this.wh - buttonSize - (this.edgeMargin * 0.85) + (buttonSize - baseButtonSize + textHeightDiff * SCALE(HD_4K(1, 0.66))));
	}

	/**
	 * Gets the y-position for the lower bar strings.
	 * @returns {number} The calculated y-position.
	 */
	getLowerBarTextY() {
		const lowerBarContentHeight = this.lowerBarTitleH + this.lowerBarTextMargin;

		return grSet.layout === 'default' ? Math.round(this.lowerBarTop + (this.lowerBarHeight - lowerBarContentHeight) / 2) :
											Math.round(this.lowerBarTop + this.edgeMargin);
	}

	/**
	 * Gets the x-position for the lower bar track number.
	 * @returns {number} The calculated x-position.
	 */
	getLowerBarTrackNumX() {
		if (this.lowerBarOneLine) {
			return Math.floor(this.seekbarX + (grSet.showLowerBarArtist_layout ? this.lowerBarArtistW : 0));
		}

		// * Two lines
		return this.seekbarX;
	}

	/**
	 * Gets the x-position for the lower bar track title.
	 * @returns {number} The calculated x-position.
	 */
	getLowerBarTrackTitleX() {
		const noTrackNumber =
			(fb.PlaybackLength > 0 || this.isStreaming) && (!grSet.showLowerBarTrackNum_layout || grStr.tracknum === '');

		if (this.lowerBarOneLine) {
			if (grSet.showLowerBarArtist_layout) {
				return Math.round(this.seekbarX + this.lowerBarArtistW + this.lowerBarTrackNumW);
			}
			return noTrackNumber ? this.seekbarX : Math.round(this.seekbarX + this.lowerBarTrackNumW);
		}

		// * Two lines
		const twoLinesX =
			grSet.showLowerBarArtistFlags_layout && this.flagImgs.length && grStr.tracknum < 100 ?
			SCALE(14 + grSet.lowerBarFontSize_layout) : this.lowerBarTrackNumW;

		return noTrackNumber ? this.seekbarX : Math.round(this.seekbarX + twoLinesX);
	}

	/**
	 * Sets the sizes and positions for various main UI elements.
	 */
	setMainMetrics() {
		this.edgeMargin     = SCALE(grSet.layout !== 'default' ? 20 : 40);
		this.edgeMarginBoth = this.edgeMargin * 2;
		this.pauseSize      = SCALE(100);
		this.topMenuHeight  = SCALE(40);
		this.lowerBarHeight = SCALE(120);
		this.seekbarHeight  = this.getSeekbarHeight();
		this.seekbarX       = this.edgeMargin;
	}

	/**
	 * Sets the lower bar metrics and caches all calculated values.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	setLowerBarMetrics(gr) {
		if (this.cachedLowerBarMetrics) return;

		const metricsPromises = [
			new Promise((resolve) => this.setLowerBarMainMetrics(gr, resolve)),
			new Promise((resolve) => this.setLowerBarTextMetrics(gr, resolve))
		];

		Promise.all(metricsPromises).then(() => {
			this.cachedLowerBarMetrics = this.loadingThemeComplete && !grm.display.hasPlayerSizeChanged();
		});
	}

	/**
	 * Sets the lower bar main sizes and position.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {Function} metricsCalculated - The callback function to be executed after calculations are finished.
	 */
	setLowerBarMainMetrics(gr, metricsCalculated) {
		this.lowerBarTop = this.wh - this.lowerBarHeight;

		this.lowerBarTotalBtnW =
			this.lowerBarBtnCount * SCALE(grSet.transportButtonSize_layout) +
			(this.lowerBarBtnCount - 1) * SCALE(grSet.transportButtonSpacing_layout);

		this.lowerBarTimeAreaW =
			this.ww > 400 ?
				grStr.disc !== '' && grSet.layout === 'default' ?
					gr.CalcTextWidth(`${grStr.disc}   ${grStr.time}   ${grStr.length}`, grFont.lowerBarTitle) :
				gr.CalcTextWidth(` ${grStr.time}   ${grStr.length}`, grFont.lowerBarTitle) :
			0;

		this.lowerBarAvailableW =
			Math.round((grSet.layout === 'default' && grSet.showTransportControls_default ? this.ww * 0.5 : this.ww) -
			(grSet.layout === 'default' && grSet.showTransportControls_default ? this.lowerBarTotalBtnW * 0.5 :
			grSet.showPlaybackTime_layout ? this.lowerBarTimeAreaW + this.edgeMargin : 0) - this.edgeMarginBoth);

		metricsCalculated();
	}

	/**
	 * Sets the lower bar text sizes.
	 * This includes flag sizes, artist, track title, album, time, length and other text elements based on the configuration.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {Function} metricsCalculated - The callback function to be executed after calculations are finished.
	 */
	setLowerBarTextMetrics(gr, metricsCalculated) {
		// * Left bottom corner
		this.lowerBarFlagW        = this.getFlagSizeWidth('lowerBar');
		this.lowerBarArtistW      = this.lowerBarFlagW + gr.MeasureString(!grSet.showLowerBarTrackNum_layout || this.isStreaming ? `  ${grStr.artistLower}` : `   ${grStr.artistLower}`, grFont.lowerBarArtist, 0, 0, 0, 0).Width;
		this.lowerBarArtistH      = gr.CalcTextHeight(grStr.artistLower, grFont.lowerBarArtist);
		this.lowerBarTrackNumW    = gr.CalcTextWidth(fb.IsPlaying && (!grSet.showLowerBarTrackNum_layout || fb.PlaybackLength <= 0 && grStr.tracknum === '') ? ' \u2013 ' : ` ${grStr.tracknum}`, grFont.lowerBarTitle);
		this.lowerBarTitleW       = this.lowerBarTrackNumW + gr.MeasureString(grStr.titleLower || 'Ag', grFont.lowerBarTitle, 0, 0, 0, 0).Width;
		this.lowerBarTitleH       = gr.CalcTextHeight(grStr.titleLower || 'Ag', grFont.lowerBarTitle);
		this.lowerBarArtistTitleW = this.lowerBarArtistW + this.lowerBarTitleW;

		// * One and two lines
		this.lowerBarOneLine  = this.lowerBarArtistTitleW < this.lowerBarAvailableW || !grSet.showLowerBarTitle_layout;
		this.lowerBarTwoLines = this.lowerBarArtistTitleW > this.lowerBarAvailableW && grSet.showLowerBarTitle_layout;

		// * Assigned after one and two lines display has been calculated
		this.lowerBarTextStartY = this.getLowerBarTextY();
		this.lowerBarArtistX    = this.seekbarX + this.lowerBarFlagW;
		this.lowerBarArtistY    = this.lowerBarTextStartY - (this.lowerBarTwoLines ? this.lowerBarArtistH + this.seekbarHeight * 0.25 : 0);
		this.lowerBarTrackNumX  = this.getLowerBarTrackNumX();
		this.lowerBarTrackNumY  = this.lowerBarTextStartY;
		this.lowerBarTitleX     = this.getLowerBarTrackTitleX();
		this.lowerBarTitleY     = this.lowerBarTrackNumY;
		this.lowerBarBtnY       = this.getLowerBarButtonsY();
		this.seekbarY           = this.getSeekbarY();

		// * Right bottom corner
		this.lowerBarLengthW  = gr.CalcTextWidth(`  ${grStr.length}`, grFont.lowerBarLength);
		this.lowerBarLengthH  = this.lowerBarTitleH;
		this.lowerBarLengthX  = this.ww - this.edgeMargin - this.lowerBarLengthW;
		this.lowerBarLengthY  = this.lowerBarTextStartY;

		this.lowerBarTimeW    = gr.CalcTextWidth(`  ${grStr.time}`, grFont.lowerBarTime);
		this.lowerBarTimeH    = this.lowerBarTitleH;
		this.lowerBarTimeX    = this.ww - this.edgeMargin - (fb.IsPlaying && fb.PlaybackLength <= 0 ? this.lowerBarTimeW : this.lowerBarTimeW + this.lowerBarLengthW);
		this.lowerBarTimeY    = this.lowerBarTextStartY;

		this.lowerBarDiscW    = gr.CalcTextWidth(`  ${grStr.disc}`, grFont.lowerBarDisc);
		this.lowerBarDiscH    = this.lowerBarTitleH;
		this.lowerBarDiscY    = this.lowerBarTextStartY;
		this.lowerBarDiscX    = this.lowerBarTimeX - this.lowerBarDiscW;

		this.lowerBarVersionW = this.lowerBarTimeW;
		this.lowerBarVersionH = this.lowerBarTimeH;
		this.lowerBarVersionX = this.ww - this.edgeMargin - this.lowerBarVersionW;
		this.lowerBarVersionY = this.lowerBarTextStartY;

		metricsCalculated();
	}

	/**
	 * Sets the size and position of the pause button.
	 */
	setPausePosition() {
		const windowFullscreenOrMaximized = UIHacks.FullScreen || UIHacks.MainWindowState === WindowState.Maximized;

		const albumArtPauseBtnX = windowFullscreenOrMaximized ? this.ww * 0.25 : this.albumArtSize.x + this.albumArtSize.w * 0.5;
		const albumArtPauseBtnY = this.albumArtSize.y + this.albumArtSize.h * 0.5;
		const discArtPauseBtnX = grm.details.discArtSize.x + grm.details.discArtSize.w * 0.5;
		const discArtPauseBtnY = grm.details.discArtSize.y + grm.details.discArtSize.h * 0.5;

		const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

		const noAlbumArtPauseBtnX =
			!grSet.panelWidthAuto && grSet.layout !== 'artwork' && !this.noAlbumArtStub && (this.displayPlaylist || this.displayLibrary) ||
				grSet.layout === 'artwork' || this.displayDetails || grSet.lyricsLayout !== 'normal' && this.displayLyrics ? this.ww * 0.5 :
			grSet.panelWidthAuto ?
				grSet.albumArtAlign === 'left' ? noAlbumArtSize * 0.5 :
				grSet.albumArtAlign === 'leftMargin' ? this.ww / this.wh > 1.8 ? noAlbumArtSize * 0.5 + this.edgeMargin : 0 :
				grSet.albumArtAlign === 'center' ? Math.floor(this.ww * 0.5 - noAlbumArtSize * 0.5 - (this.ww * 0.25 - noAlbumArtSize * 0.5)) :
				this.ww * 0.5 - noAlbumArtSize * 0.5 :
			this.ww * 0.25;

		const noAlbumArtPauseBtnY = this.wh * 0.5 - this.topMenuHeight;

		if (this.albumArt) {
			grm.pseBtn.setCoords(albumArtPauseBtnX, albumArtPauseBtnY);
		}
		else if (grm.details.discArt && !this.noAlbumArtStub) {
			grm.pseBtn.setCoords(discArtPauseBtnX, discArtPauseBtnY);
		}
		else if (this.noAlbumArtStub) {
			grm.pseBtn.setCoords(noAlbumArtPauseBtnX, noAlbumArtPauseBtnY);
		}
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes by recursively checking the loading state of album art or stub with a default or specified timeout.
	 * Resolves the promise once the album art or stub is loaded, or handles an artwork error if the timeout is reached.
	 * @param {number} timeout - The maximum time in milliseconds to wait for the album art or stub to load. Default is 5 seconds.
	 * @returns {Promise<void>} A promise that resolves when the album art or stub is loaded or the timeout is reached.
	 */
	async initAlbumArtLoading(timeout = 5000) {
		const startTime = Date.now();

		const checkAlbumArtLoadState = (resolve) => {
			if (this.albumArt || this.noAlbumArtStub) {
				resolve();
			} else if (Date.now() - startTime >= timeout) {
				this.handleArtworkError('albumArt');
				resolve();
			} else {
				setTimeout(() => checkAlbumArtLoadState(resolve), 50);
			}
		};

		return new Promise(checkAlbumArtLoadState);
	}

	/**
	 * Initializes the browse mode on current track selection.
	 */
	initBrowseMode() {
		if (!grSet.panelBrowseMode) return;

		const handle = this.initMetadb();

		if (!fb.IsPlaying) grStr.time = '00:00';
		this.newTrackFetchingArtwork = true;

		this.clearCache(undefined, undefined, true, true);
		this.initMetadata(handle);
		this.fetchNewArtwork(handle);
		this.loadCountryFlags(handle);

		grm.details.clearCache(undefined, undefined, true, true);
		grm.details.updateGridTimeline(true, handle);
		grm.details.updateGrid(this.currentLastPlayed, this.playingPlaylist, handle);
		grm.details.loadGridReleaseCountryFlag(handle);
		grm.details.loadGridCodecLogo(handle);
		grm.details.loadGridChannelLogo(handle);
		grm.details.getBandLogo(handle);
		grm.details.getLabelLogo(handle);

		bio.panel.id.focus = handle;
		bio.panel.changed();
		bio.txt.on_playback_new_track();
		bio.img.on_playback_new_track();

		window.Repaint();
	}

	/**
	 * Initializes the browse mode state and resumes now playing track when disabled.
	 */
	initBrowserModeState() {
		const initialActionMode = libSet.actionMode;

		if (!grSet.panelBrowseMode) {
			if (fb.IsPlaying) {
				this.handlePlaybackNewTrack(fb.GetNowPlaying());
				if (this.displayLibrary) {
					lib.pop.nowPlayingShow();
				} else {
					this.displayPanel('playlist', true);
					pl.playlist.show_now_playing();
				}
			} else {
				this.handlePlaybackStop(0);
			}
			libSet.actionMode = 0;
		} else {
			libSet.actionMode = 2;
		}

		if (libSet.actionMode !== initialActionMode) {
			setTimeout(() => { lib.panel.updateProp(1); }, 1000);
		}

		this.initBrowseMode();
	}

	/**
	 * Initializes auto deletion of theme cache on startup.
	 */
	initCacheDeletion() {
		if (grSet.libraryAutoDelete) DeleteLibraryCache();
		if (grSet.biographyAutoDelete) DeleteBiographyCache();
		if (grSet.lyricsAutoDelete) DeleteLyrics();
		if (grSet.waveformBarAutoDelete) DeleteWaveformBarCache();
	}

	/**
	 * Initializes all needed fonts for the theme and displays error messages if fonts are missing.
	 * @returns {boolean} True if all fonts are installed, otherwise false.
	 */
	initFonts() {
		/** @type {string[]} */
		const fontList = [
			grFont.fontDefault, grFont.fontSegoeUISymbol, grFont.fontTopMenu, grFont.fontTopMenuCaption,
			grFont.fontGuiFx, grFont.fontAwesome, grFont.fontLowerBarArtist, grFont.fontLowerBarTitle, grFont.fontLowerBarDisc, grFont.fontLowerBarTime, grFont.fontLowerBarLength, grFont.fontLowerBarWave,
			grFont.fontNotification, grFont.fontPopup, grFont.fontTooltip,
			grFont.fontGridArtist, grFont.fontGridTitle, grFont.fontGridTitleBold, grFont.fontGridAlbum, grFont.fontGridKey, grFont.fontGridValue,
			grFont.fontLibrary, grFont.fontBiography, grFont.fontLyrics
		];

		/** @type {boolean} The state of installed fonts on system, will return false if one is missing. */
		const fontsInstalled = fontList.every((fontName) => TestFont(fontName));

		if (!fontsInstalled) {
			const msg = grm.msg.getMessage('main', 'fontsNotInstalled');
			fb.ShowPopupMessage(msg, 'FONT ERROR WARNING');
		}

		if (grSet.customThemeFonts) {
			const msg = grm.msg.getMessage('main', 'customFontsUsed');
			console.log(msg);
		}

		return fontsInstalled;
	}

	/**
	 * Initializes the metadb of the track.
	 * When browse mode is enabled, it returns the currently selected track; otherwise, it returns the current playing track.
	 * @returns {FbMetadbHandle} The metadb of the track.
	 */
	initMetadb() {
		if (!grSet.panelBrowseMode) {
			return fb.GetNowPlaying();
		} else {
			return !this.displayLibrary ? fb.GetFocusItem() : fb.GetSelection();
		}
	}

	/**
	 * Initializes the metadata strings based on the current playback information.
	 * This includes setting up artist, album, track title, and more.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	initMetadata(metadb = undefined) {
		grStr.artist = $(grTF.artist, metadb);
		grStr.artistLower = !grSet.showLowerBarArtist_layout ? '' : grStr.artist;
		grStr.original_artist = $(grTF.original_artist, metadb);
		grStr.composer = $(grTF.composer, metadb);
		grStr.tracknum = grSet.showVinylNums ? $(grTF.vinyl_track, metadb) : $(grTF.tracknum, metadb).trim();
		grStr.title = `${$(grTF.title, metadb)} ${$(grTF.original_artist, metadb)}`;
		grStr.titleLower = !grSet.showLowerBarTitle_layout ? '' : grSet.showLowerBarComposer_layout  ? `${grStr.title} ${grStr.composer}` : `${grStr.title}`;
		grStr.album = $(`[%album%][ '['${grTF.album_translation}']']`, metadb);
		grStr.album_subtitle = $(`[ '['${grTF.album_subtitle}']']`, metadb);
		grStr.year = $(grTF.year, metadb) === '0000' ? '' : $(grTF.year, metadb);
		grStr.disc = grSet.layout !== 'default' ? '' :  $(grTF.disc, metadb);

		const playbackLength = Math.round(metadb ? metadb.Length : fb.PlaybackLength);
		const h = Math.floor(playbackLength / 3600);
		const m = Math.floor(playbackLength % 3600 / 60);
		const s = Math.floor(playbackLength % 60);
		grStr.length = `${h > 0 ? `${h}:${m < 10 ? '0' : ''}${m}` : m}:${s < 10 ? '0' : ''}${s}`;

		const lastfmPlayCount = $('%lastfm_play_count%', metadb);
		grm.details.playCountVerifiedByLastFm = lastfmPlayCount !== '0' && lastfmPlayCount !== '?';

		this.currentAlbumFolder = !this.isStreaming ? metadb && metadb.Path.substring(0, metadb.Path.lastIndexOf('\\')) : '';
		this.lastAlbumFolder = this.currentAlbumFolder;
		this.lastAlbumFolderTag = $('%album%', metadb);
		this.lastAlbumDiscNumber = $('$if2(%discnumber%,0)', metadb);
		this.lastAlbumVinylSide = $(`$if2(${grTF.vinyl_side},ZZ)`, metadb);

		this.currentLastPlayed = $(grTF.last_played, metadb);
		this.playingPlaylist = grSet.showGridPlayingPlaylist ? $(grTF.playing_playlist = plman.GetPlaylistName(plman.PlayingPlaylist)) : '';
	}

	/**
	 * Initializes the playback state if it is streaming or playing from CD.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	initStreamingOrCD(metadb) {
		this.isPlayingCD = metadb && metadb.RawPath.startsWith('cdda://');
		this.isStreaming = metadb && /^(http:\/\/|https:\/\/)/.test(metadb.RawPath);
	}

	/**
	 * Initializes everything necessary in all panels without the need of a reload.
	 */
	initPanels() {
		// * Update Main
		this.createFonts();
		this.setMainMetrics();
		this.setMainComponents('all');
		this.resizeArtwork(true);
		grm.button.createButtons(this.ww, this.wh);
		grm.button.initButtonState();
		if (fb.GetNowPlaying()) on_metadb_changed();

		// * Update Playlist
		PlaylistRescale(true);
		this.initPlaylist();
		this.setPlaylistSize();

		// * Update Library
		this.setLibrarySize();
		lib.pop.createImages();
		lib.panel.zoomReset();
		this.initLibraryLayout();

		// * Update Biography
		this.setBiographySize();
		bio.ui.setSbar();
		bio.but.createImages();
		bio.but.resetZoom();
		grm.theme.initBiographyColors();
		this.initBiographyLayout();
	}

	/**
	 * Initializes the size and position of the current panel when using `grSet.panelWidthAuto`.
	 * @param {boolean} resizeArtwork - Indicates whether to resize the artwork.
	 * Note: The `resizeArtwork` parameter is only needed when there is no `resizeArtwork()` method in the called code block.
	 * Otherwise, place this method under the `resizeArtwork()` method.
	 */
	initPanelWidthAuto(resizeArtwork) {
		if (!grSet.panelWidthAuto || this.displayLibrarySplit() || this.displayLibrary && grSet.libraryLayout === 'full') return;

		if (resizeArtwork) this.resizeArtwork(true);

		if (this.displayPlaylist && (this.noAlbumArtStub || pl.playlist.x !== this.albumArtSize.x + this.albumArtSize.w)) {
			DebugLog('Init => initPanelWidthAuto -> Playlist');
			this.setPlaylistSize();
		}
		if (this.displayLibrary && (this.noAlbumArtStub || lib.ui.x !== this.albumArtSize.x + this.albumArtSize.w)) {
			DebugLog('Init => initPanelWidthAuto -> Library');
			this.setLibrarySize();
		}
		if (this.displayBiography && (this.noAlbumArtStub || bio.ui.x + bio.ui.w !== this.albumArtSize.x + this.albumArtSize.w) || bio.ui.x + bio.ui.w > pl.playlist.x) {
			DebugLog('Init => initPanelWidthAuto -> Biography');
			this.setBiographySize();
		}
	}

	/**
	 * Initializes the theme on startup or reload.
	 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
	 */
	async initMain() {
		DebugLog('Init => initMain');

		// * Init colors
		this.initCustomTheme();
		grm.color.setThemeColors();
		grm.theme.initMainColors(); // Init preloader background color
		if (grSet.theme === 'random' && grSet.randomThemeAutoColor !== 'off') {
			grm.color.getRandomThemeAutoColor();
		}

		// * Init main
		this.initCacheDeletion();
		this.clearPlaybackState(true);
		this.createFonts();
		this.setMainMetrics();
		this.setMainComponents('all');

		// * Init panels
		await MakeAsync(() => PlaylistRescale(true));
		await MakeAsync(() => this.initPlaylist());
		await MakeAsync(() => this.initLibraryPanel());
		await MakeAsync(() => lib.lib.initialise());
		await MakeAsync(() => this.initBiographyPanel());

		// * Init state
		if (fb.IsPlaying && fb.GetNowPlaying()) {
			// Wait for on_playback_new_track to be loaded in gr-callbacks.js
			await MakeAsync(() => {}, () => typeof on_playback_new_track !== 'undefined');
			on_playback_new_track(fb.GetNowPlaying());
		}
		plman.SetActivePlaylistContext();
		this.displayPanel(false, true);
		this.initLyricsDisplayState('startup');

		// * Restore backup workaround to successfully restore playlist files after foobar installation
		if (grSet.restoreBackupPlaylist) {
			await RestoreBackupPlaylist();
		}

		// * Wait for album art to load if player is playing, then hide loading screen
		if (fb.IsPlaying) {
			await this.initAlbumArtLoading();
		}

		// * Hide loading screen
		DebugLog('\n>>> initTheme => initMain <<<\n');
		this.initThemeFull = true;
		this.initTheme();
		this.loadingThemeComplete = true;
		window.Repaint();
	}

	/**
	 * Initializes the theme when updating colors.
	 */
	initTheme() {
		const themeProfiler = (this.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay) && fb.CreateProfiler('initTheme');

		const fullInit =
			this.initThemeFull || grSet.themeBrightness !== 'default'
			||
			libSet.theme !== 0 || bioSet.theme !== 0
			||
			grSet.theme === 'reborn' || grSet.theme === 'random'
			||
			grSet.styleBlackAndWhiteReborn || grSet.styleBlackReborn;

		// * SETUP COLORS * //
		this.initCustomTheme();
		this.initThemeDayNightState();
		grm.color.initThemeStyleProperties();
		grm.color.setImageBrightness();
		grm.color.setNoAlbumArtColors();
		grm.color.getRandomThemeColor();
		grm.style.setStyleBlend();
		grm.style.initBlackAndWhiteReborn();
		grm.color.setBackgroundColorDefinition();

		// * INIT COLORS * //
		grm.theme.initPlaylistColors();
		grm.theme.initLibraryColors();
		grm.theme.initBiographyColors();
		grm.theme.initMainColors();
		grm.theme.initChronflowColors();
		grm.style.initStyleColors();

		// * POST-INIT COLOR ADJUSTMENTS * //
		grm.theme.themeColorAdjustments();
		grm.details.updateGridLogos();
		if (!fullInit) return;
		grSet.themeBrightness !== 'default' && grm.color.adjustThemeBrightness(grSet.themeBrightness);
		pl.playlist.update_playlist_headers();
		grSet.playlistRowHover && pl.playlist.update_playlist_rows();
		libImg.labels.overlayDark && lib.ui.getItemColours();
		bio.txt.artCalc();
		bio.txt.albCalc();

		// * UPDATE BUTTONS * //
		pl.playlist.initScrollbar();
		lib.sbar.setCol();
		lib.pop.createImages();
		lib.but.createImages();
		lib.but.refresh(true);
		bio.alb_scrollbar.setCol();
		bio.art_scrollbar.setCol();
		bio.but.createImages('all');
		bio.img.createImages();
		grm.button.createButtons(this.ww, this.wh, true, false);
		grm.button.initButtonState();

		// * REFRESH * //
		window.Repaint();

		if (themeProfiler) themeProfiler.Print();
		if (grCfg.settings.showDebugPerformanceOverlay) this.debugTimingsArray.push(`initTheme: ${themeProfiler.Time} ms`);
	}

	/**
	 * Initializes the theme based on the artwork and various settings.
	 * @param {GdiBitmap} artwork - The artwork image.
	 */
	initThemeState(artwork) {
		if (this.hasAutoRandomPresetMode()) {
			this.setRandomThemePreset();
			return;
		}

		if (this.hasThemeTags()) {
			this.initThemeTags();
		} else {
			this.restoreThemeState();
			grm.color.getThemeColors(artwork);
		}

		if (grSet.presetAutoRandomMode !== 'album' && grSet.presetSelectMode !== 'harmonic' && !this.hasThemeTags()) {
			this.initTheme();
			DebugLog('\n>>> initTheme => loadImageFromAlbumArtList >>>\n');
		}
	}

	/**
	 * Initializes the theme day and night state.
	 * - Aborts if `grSet.themeDayNightMode` is falsy or if any custom GR theme tags are detected.
	 * - Restores the day or night theme based on `grSet.themeDayNightTime` if the current theme does not match the expected day or night theme.
	 * - Sets an interval to check and update the theme every 10 minutes based on the time of day.
	 */
	initThemeDayNightState() {
		const customTheme  = $('[%GR_THEME%]');
		const customStyle  = $('[%GR_STYLE%]');
		const customPreset = $('[%GR_PRESET%]');

		if (!grSet.themeDayNightMode || grSet.themeSetupDay || grSet.themeSetupNight ||
			customTheme || customStyle || customPreset) {
			return;
		}

		// * Restore day or night theme after custom GR theme tags usage
		if (grSet.theme !== grSet.theme_day && grSet.themeDayNightTime === 'day' ||
			grSet.theme !== grSet.theme_night && grSet.themeDayNightTime === 'night') {
			this.resetTheme();
			initThemeDayNightMode(new Date());
			this.initThemeFull = true;
			return;
		}

		// * Check every 10 minutes if it is day or night for the entire play session
		if (!this.themeDayNightModeTimer) {
			this.themeDayNightModeTimer = setInterval(() => {
				initThemeDayNightMode(new Date());
				this.initThemeFull = true;
				this.initTheme();
				DebugLog('\n>>> initTheme => initThemeDayNightState => themeDayNightModeTimer <<<\n');
			}, 600000);
		}
	}

	/**
	 * Initializes %GR_THEME%, %GR_STYLE%, %GR_PRESET% tags in music files and sets them, used in on_playback_new_track.
	 */
	initThemeTags() {
		this.themePresetIndicator = false;
		const customTheme  = $('[%GR_THEME%]');
		const customStyle  = $('[%GR_STYLE%]');
		const customPreset = $('[%GR_PRESET%]');

		const themeStyles = {
			'nighttime' : () => { grSet.styleNighttime = true; },
			'bevel' : () => { grSet.styleBevel = true; },
			'blend' : () => { grSet.styleBlend = true; },
			'blend2' : () => { grSet.styleBlend2 = true; },
			'gradient' : () => { grSet.styleGradient = true; },
			'gradient2' : () => { grSet.styleGradient2 = true; },
			'alternative' : () => { grSet.styleAlternative = true; },
			'alternative2' : () => { grSet.styleAlternative2 = true; },
			'blackAndWhite' : () => { grSet.styleBlackAndWhite = true; },
			'blackAndWhite2' : () => { grSet.styleBlackAndWhite2 = true; },
			'blackReborn' : () => { grSet.styleBlackReborn = true; },
			'rebornWhite' : () => { grSet.styleRebornWhite = true; },
			'rebornBlack' : () => { grSet.styleRebornBlack = true; },
			'rebornFusion' : () => { grSet.styleRebornFusion = true; },
			'rebornFusion2' : () => { grSet.styleRebornFusion2 = true; },
			'randomPastel' : () => { grSet.styleRandomPastel = true; },
			'randomDark' : () => { grSet.styleRandomDark = true; },
			'rebornFusionAccent' : () => { grSet.styleRebornFusionAccent = true; },
			'topMenuButtons=filled' : () => { grSet.styleTopMenuButtons = 'filled'; },
			'topMenuButtons=bevel' : () => { grSet.styleTopMenuButtons = 'bevel'; },
			'topMenuButtons=inner' : () => { grSet.styleTopMenuButtons = 'inner'; },
			'topMenuButtons=emboss' : () => { grSet.styleTopMenuButtons = 'emboss'; },
			'topMenuButtons=minimal' : () => { grSet.styleTopMenuButtons = 'minimal'; },
			'transportButtons=bevel' : () => { grSet.styleTransportButtons = 'bevel'; },
			'transportButtons=inner' : () => { grSet.styleTransportButtons = 'inner'; },
			'transportButtons=emboss' : () => { grSet.styleTransportButtons = 'emboss'; },
			'transportButtons=minimal' : () => { grSet.styleTransportButtons = 'minimal'; },
			'progressBarDesign=rounded' : () => { grSet.styleProgressBarDesign = 'rounded'; },
			'progressBarDesign=lines' : () => { grSet.styleProgressBarDesign = 'lines'; },
			'progressBarDesign=blocks' : () => { grSet.styleProgressBarDesign = 'blocks'; },
			'progressBarDesign=dots' : () => { grSet.styleProgressBarDesign = 'dots'; },
			'progressBarDesign=thin' : () => { grSet.styleProgressBarDesign = 'thin'; },
			'progressBarBg=bevel' : () => { grSet.styleProgressBar = 'bevel'; },
			'progressBarBg=inner' : () => { grSet.styleProgressBar = 'inner'; },
			'progressBarFill=bevel' : () => { grSet.styleProgressBarFill = 'bevel'; },
			'progressBarFill=inner' : () => { grSet.styleProgressBarFill = 'inner'; },
			'progressBarFill=blend' : () => { grSet.styleProgressBarFill = 'blend'; },
			'volumeBarDesign=rounded' : () => { grSet.styleVolumeBarDesign = 'rounded'; },
			'volumeBarBg=bevel' : () => { grSet.styleVolumeBar = 'bevel'; },
			'volumeBarBg=inner' : () => { grSet.styleVolumeBar = 'inner'; },
			'volumeBarFill=bevel' : () => { grSet.styleVolumeBarFill = 'bevel'; },
			'volumeBarFill=inner' : () => { grSet.styleVolumeBarFill = 'bevel'; }
		};

		// * 1. Set preset
		if (customPreset.length) {
			DebugLog('\n>>> initThemeTags => %GR_PRESET% loaded <<<');
			grSet.preset = customPreset;
			grm.preset.setThemePreset(customPreset);
			this.themeRestoreState = true;
		}
		// * 2. Set theme
		else if (customTheme.length) {
			DebugLog('\n>>> initThemeTags => %GR_THEME% loaded <<<');
			grSet.theme = customTheme;
			this.resetTheme();
			this.themeRestoreState = true;
		}
		// * 3. Set styles
		if (customStyle.length && !customPreset.length) {
			DebugLog('\n>>> initThemeTags => %GR_STYLE% loaded <<<');
			this.resetStyle('all');
			for (const style of customStyle.split(/[,; ]+/)) {
				const setStyle = themeStyles[style];
				if (setStyle) setStyle();
			}
			this.themeRestoreState = true;
		}

		// * 4. Update theme
		if (!customPreset.length) { // Prevent double initialization for theme presets, this.updateStyle() already handled in setThemePreset()
			this.updateStyle();
		}
	}

	/**
	 * Initializes the custom themes to check if any are currently active.
	 */
	initCustomTheme() {
		if (!grSet.theme.startsWith('custom')) return;

		const customThemes = {
			custom01: grCfg.customTheme01,
			custom02: grCfg.customTheme02,
			custom03: grCfg.customTheme03,
			custom04: grCfg.customTheme04,
			custom05: grCfg.customTheme05,
			custom06: grCfg.customTheme06,
			custom07: grCfg.customTheme07,
			custom08: grCfg.customTheme08,
			custom09: grCfg.customTheme09,
			custom10: grCfg.customTheme10
		};

		if (grSet.theme in customThemes) {
			grCfg.cTheme = customThemes[grSet.theme];
		}
	}

	/**
	 * Initializes the custom theme menu position when using auto panel width ( grSet.panelWidthAuto ).
	 */
	initCustomThemeMenuPosition() {
		if (!this.displayLibrary && grSet.libraryLayout !== 'split') {
			this.displayPlaylist = !this.displayLibrary && !this.displayDetails;
		}
		else if (this.displayLibrarySplit()) {
			this.displayPlaylist = true;
		}

		this.resizeArtwork(true);

		if (this.displayPlaylist) this.setPlaylistSize();
		if (this.displayLibrary) this.setLibrarySize();
		if (this.displayBiography) this.setBiographySize();
	}

	/**
	 * Initializes the custom theme menu and toggles its open/close state.
	 */
	initCustomThemeMenuState() {
		if (plman.PlaylistItemCount(plman.ActivePlaylist) <= 0) {
			this.handlePlaybackStart();
			return;
		}
		else if (grSet.layout !== 'default') {
			const msg = grm.msg.getMessage('main', 'customThemeLiveEdit');
			fb.ShowPopupMessage(msg, 'Custom theme live editing');
			return;
		}

		this.displayCustomThemeMenu = !this.displayCustomThemeMenu;
		this.displayMetadataGridMenu = false;

		if (this.displayCustomThemeMenu) {
			if (!grSet.theme.startsWith('custom')) grSet.theme = 'custom01';
			this.initCustomTheme();
			this.initTheme();
			this.handlePanelLayout('all', 'resetLayout');

			if (!fb.IsPlaying) {
				fb.Play(); fb.Pause();

				if (grSet.lyricsRememberPanelState) this.initLyricsRememberedState();
				if (!this.albumArtSize.w) this.setNoAlbumArtSize();
				this.initPanelWidthAuto(true);
				this.setMainComponents('customMenu');
			}

			grm.cthMenu.reinitCustomThemeMenu();
		}
		else {
			this.handlePanelLayout('all', 'restoreLayout');
			this.resizeArtwork(true);
		}

		if (this.displayBiography && grSet.biographyLayout === 'full') {
			this.displayPlaylist = false;
		}

		// Keep Playlist layout in normal width
		this.handlePanelLayout('playlist', 'initLayout');
		window.Repaint();
	}

	/**
	 * Initializes styles to check if any are currently active, used in top menu Options > Style.
	 */
	initStyleState() {
		const styles = [
			grSet.styleNighttime,
			grSet.styleBevel,
			grSet.styleBlend,
			grSet.styleBlend2,
			grSet.styleGradient,
			grSet.styleGradient2,
			grSet.styleAlternative,
			grSet.styleAlternative2,
			grSet.styleBlackAndWhite,
			grSet.styleBlackAndWhite2,
			grSet.styleBlackAndWhiteReborn,
			grSet.styleBlackReborn,
			grSet.styleRebornWhite,
			grSet.styleRebornBlack,
			grSet.styleRebornFusion,
			grSet.styleRebornFusion2,
			grSet.styleRebornFusionAccent,
			grSet.styleRandomPastel,
			grSet.styleRandomDark,
			grSet.styleTopMenuButtons !== 'default',
			grSet.styleTransportButtons !== 'default',
			grSet.styleProgressBarDesign !== 'default',
			grSet.styleProgressBar !== 'default',
			grSet.styleProgressBarFill !== 'default',
			grSet.styleVolumeBarDesign !== 'default',
			grSet.styleVolumeBar !== 'default',
			grSet.styleVolumeBarFill !== 'default'
		];

		grSet.styleDefault = !styles.some(style => style);
	}

	/**
	 * Initializes and sets the theme to a factory reset state.
	 * Used on the very first foobar start after installation or when resetting the theme.
	 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
	 */
	async initSystemFirstLaunch() {
		if (!grSet.systemFirstLaunch) return;

		await this.initMain();
		await grm.settings.setThemeSettings(false, false, true);
		await grm.display.autoDetectRes();

		grSet.systemFirstLaunch = false;
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - PLAYBACK * //
	// #region PUBLIC METHODS - PLAYBACK
	/**
	 * Handles updating the main UI to reflect the current track's metadata, including track details and artist country flags.
	 * Adjusts UI elements like color schemes and metadata grids based on track information.
	 * @param {FbMetadbHandleList} [handleList] - Can be undefined when called manually from on_playback_new_track.
	 */
	handlePlaybackMetadb(handleList) {
		if (!fb.IsPlaying) return;

		let nowPlayingUpdated = !handleList; // If we don't have a handleList we called this manually from on_playback_new_track
		const metadb = fb.GetNowPlaying();

		if (metadb && handleList) {
			for (let i = 0; i < handleList.Count; i++) {
				if (metadb.RawPath === handleList[i].RawPath) {
					nowPlayingUpdated = true;
					break;
				}
			}
		}

		if (!nowPlayingUpdated) return;

		this.clearCache('metrics');
		this.clearCache('ratings');
		this.initMetadata();
		this.loadCountryFlags();

		grm.details.clearCache('metrics');
		grm.details.clearCache('codecLogo');
		grm.details.clearCache('channelLogo');
		grm.details.updateGridTimeline(true);
		grm.details.updateGrid(this.currentLastPlayed, this.playingPlaylist);
		grm.details.loadGridReleaseCountryFlag();
	}

	/**
	 * Handles new track playback of the main UI and initializes various properties and UI elements.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	handlePlaybackNewTrack(metadb) {
		UpdateTimezoneOffset();

		this.initThemeFull = false;
		this.newTrackFetchingArtwork = true;

		this.clearCache('metrics');
		this.clearCache('ratings');
		this.clearCache('debug');
		this.initStreamingOrCD(metadb);
		this.handleArtwork(metadb);
		grm.details.clearCache('metrics');
		grm.details.getBandLogo();
		grm.details.getLabelLogo(metadb);

		if (grSet.rotateDiscArt && !grSet.spinDiscArt) {
			grm.details.setDiscArtRotation(); // We need to always setup the rotated image because it rotates on every track
		}

		// * Pick a new random theme preset on new track
		if (grSet.presetAutoRandomMode === 'track' && !this.doubleClicked) {
			grm.preset.getRandomThemePreset();
		}
		// * Generate a new color in Random theme on new track
		if (grSet.styleRandomAutoColor === 'track' && !this.doubleClicked) {
			grm.color.getRandomThemeAutoColor();
		}

		if (fb.GetNowPlaying()) on_metadb_changed(); // Refresh metadata
		on_playback_time();
		this.setSeekbarRefresh();

		if (grSet.seekbar === 'progressbar') {
			grm.progBar.on_playback_new_track(metadb);
		} else if (grSet.seekbar === 'peakmeterbar') {
			grm.peakBar.on_playback_new_track(metadb);
		} else if (grSet.seekbar === 'waveformbar') {
			grm.waveBar.on_playback_new_track_queue(metadb);
		}

		this.initLyricsDisplayState('newTrack');
	}

	/**
	 * Handles seeking playback of the main UI.
	 */
	handlePlaybackSeek() {
		if (grSet.seekbar === 'progressbar') {
			grm.progBar.progressMoved = true;
		} else if (grSet.seekbar === 'peakmeterbar') {
			grm.peakBar.progressMoved = true;
		}
		if (this.displayLyrics) {
			grm.lyrics.seek();
		}
		this.refreshSeekbar();
	}

	/**
	 * Handles starting playback of the main UI.
	 * If the playlist contains no tracks to play, the user action will be canceled.
	 */
	handlePlaybackStart() {
		if (plman.PlaylistItemCount(plman.ActivePlaylist) <= 0) {
			this.displayCustomThemeMenu = false;
			fb.Stop();
			this.clearPlaybackState(true);
			window.Repaint();

			const msg = grm.msg.getMessage('main', 'playlistEmptyError');
			grm.msg.showPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			return;
		}
		else if (grCfg.settings.hideCursor) {
			SetCursor('Hide');
		}
		grm.button.lowerPlayPause();
	}

	/**
	 * Handles the playback stop event of the main UI.
	 * @param {number} reason - The playback stop has the following settings:
	 * - 0 - Invoked by the user.
	 * - 1 - End of file.
	 * - 2 - Starting another track.
	 * - 3 - Fb2k is shutting down.
	 */
	handlePlaybackStop(reason) {
		if (reason !== 2) {
			this.clearPlaybackState(true);
			this.clearCache();
			this.clearTimer();
			grm.details.clearCache();
			grm.details.clearTimer();
			grm.button.lowerPlayPause();
			this.initTheme();
			DebugLog('\n>>> initTheme => on_playback_stop <<<\n');
		}

		this.initPanelWidthAuto(true);

		if (reason === 0 || reason === 1) {
			this.displayPanel();
		}

		window.Repaint();
	}

	/**
	 * Handles the playback pause event of the main UI.
	 * @param {boolean} state - Whether the playback is paused or not.
	 */
	handlePlaybackPause(state) {
		grm.button.lowerPlayPause();

		if (state || fb.PlaybackLength < 0) {
			this.clearTimer('seekbar');
			grm.details.clearTimer('discArt');
			window.RepaintRect(0, this.topMenuHeight, Math.max(this.albumArtSize.x, SCALE(40)), this.wh - this.topMenuHeight - this.lowerBarHeight);
		}
		else { // Unpausing
			this.clearTimer('seekbar'); // Clear to avoid multiple seekbarTimer which can happen depending on the playback state when theme is loaded
			DebugLog(`Playback => on_playback_pause: creating refreshSeekbar() interval with delay = ${this.seekbarTimerInterval}`);

			this.seekbarTimer = setInterval(() => {
				this.refreshSeekbar();
			}, this.seekbarTimerInterval || 1000);

			if (grm.details.discArt && grSet.spinDiscArt) {
				grm.details.setDiscArtRotationTimer();
			}
		}

		grm.pseBtn.repaint();
	}

	/**
	 * Handles the playback order event of the main UI when it is changed
	 * via the transport playback order button or foobar's playback menu.
	 * @global
	 * @param {number} pbo - The playback order has the following settings:
	 * - 0 - Default.
	 * - 1 - Repeat (Playlist).
	 * - 2 - Repeat (Track).
	 * - 3 - Random, 4 Shuffle (tracks).
	 * - 5 - Shuffle (albums).
	 * - 6 - Shuffle (folders).
	 */
	handlePlaybackOrder(pbo) {
		// Repaint playback order
		if (pbo !== this.lastPlaybackOrder) {
			DebugLog('Playback => Repainting on_playback_order_changed');
			window.RepaintRect(0.5 * this.ww, this.wh - this.lowerBarHeight, 0.5 * this.ww, this.lowerBarHeight);
		}
		this.lastPlaybackOrder = pbo;

		// Link foobar's playback order menu functions with playback order button
		const showBtns = grSet.showTransportControls_layout && grSet.showPlaybackOrderBtn_layout;

		const playbackOrderStr = {
			[PlaybackOrder.Default]: 'default',
			[PlaybackOrder.RepeatPlaylist]: 'repeatPlaylist',
			[PlaybackOrder.RepeatTrack]: 'repeatTrack',
			[PlaybackOrder.Random]: 'shuffle',
			[PlaybackOrder.ShuffleTracks]: 'shuffle',
			[PlaybackOrder.ShuffleAlbums]: 'shuffle',
			[PlaybackOrder.ShuffleFolders]: 'shuffle'
		};

		const playbackOrderImg = {
			default: grm.button.btnImg.PlaybackDefault,
			repeatPlaylist: grm.button.btnImg.PlaybackRepeatPlaylist,
			repeatTrack: grm.button.btnImg.PlaybackRepeatTrack,
			shuffle: grm.button.btnImg.PlaybackShuffle
		};

		const order = playbackOrderStr[pbo];

		if (order) {
			grSet.playbackOrder = order;
			if (showBtns) {
				grm.button.btn.playbackOrder.img = playbackOrderImg[order];
			}
		}
	}

	/**
	 * Handles the playback time event of the main UI.
	 */
	handlePlaybackTime() {
		const time =
			grSet.playbackTimeDisplay === 'default' ? $(' %playback_time% ') :
			grSet.playbackTimeDisplay === 'remaining' ? $(' -%playback_time_remaining% ') :
			PlaybackTimePercentage();

		if (!grSet.panelBrowseMode) {
			grStr.time = time;
			return;
		}

		const nowPlayingTrack = fb.GetNowPlaying();
		const focusTrack = fb.GetFocusItem();
		const notPlayingTrackSelection = focusTrack && focusTrack.Path !== nowPlayingTrack.Path;

		grStr.time = (grSet.panelBrowseMode && notPlayingTrackSelection) ? '00:00' : time;
	}

	/**
	 * Handles the playback position of the main UI based on the x-coordinate of a mouse click within the seekbar or a mouse wheel event.
	 * @param {number} x - The x-coordinate of the mouse click within the playback bar.
	 * @param {number} step - The step direction for the mouse wheel event: -1 or 1.
	 * This method assumes the click or mouse wheel event has already been verified to be within the seekbar's bounds.
	 */
	handleSeekbarPlayback(x, step = 0) {
		// Handle mouse click event
		if (x !== 0) {
			let v = (x - this.edgeMargin) / (this.ww - this.edgeMarginBoth);
			v = Clamp(v, 0, 1);
			if (fb.PlaybackTime !== v * fb.PlaybackLength) {
				fb.PlaybackTime = v * fb.PlaybackLength;
			}
		}
		// Handle mouse wheel event
		else if (step !== 0) {
			if (grSet.seekbar === 'waveformbar') {
				grm.waveBar.on_mouse_wheel(step);
			}
			else if (grSet.seekbar === 'peakmeterbar') {
				if (utils.IsKeyPressed(VKey.SHIFT)) {
					grm.peakBar.on_mouse_wheel(step);
				} else {
					fb.PlaybackTime = fb.PlaybackTime - step * grSet.peakmeterBarWheelSeekSpeed;
				}
			}
			else {
				fb.PlaybackTime = fb.PlaybackTime - step * grSet.progressBarWheelSeekSpeed;
			}
			this.refreshSeekbar();
		}

		window.RepaintRect(0, this.wh - this.lowerBarHeight, this.ww, this.lowerBarHeight);
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - STATE * //
	// #region MAIN - PUBLIC METHODS - STATE
	/**
	 * Checks if the album art is displayed based on the current layout and display flags.
	 * @param {boolean} noAlbumArtStub - Whether the noAlbumArtStub is being displayed.
	 * @returns {boolean} True if the album art or noAlbumArtStub is displayed, false otherwise.
	 */
	albumArtDisplayed(noAlbumArtStub) {
		if (!noAlbumArtStub && this.noAlbumArtStub) return false;

		if (grSet.layout === 'default') {
			return this.displayPlaylist && grSet.playlistLayout === 'normal' && !this.displayLibrary && !this.displayBiography
			||
			this.displayLibrary && grSet.libraryLayout === 'normal'
			||
			this.displayDetails && !noAlbumArtStub
			||
			this.displayLyrics && grSet.lyricsLayout !== 'full' || this.mouseInLyricsFullLayoutEdge && grSet.lyricsLayout === 'full';
		}
		else if (grSet.layout === 'artwork') {
			return !this.displayPlaylist && !this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography;
		}

		return false;
	}

	/**
	 * Checks if the disc art is displayed based on the current settings.
	 * @returns {boolean} True if the disc art is displayed, false otherwise.
	 */
	discArtDisplayed() {
		return this.displayDetails && grSet.displayDiscArt && grm.details.discArt !== undefined;
	}

	/**
	 * Checks if the Artwork layout is currently displaying the home panel ( album art cover ).
	 * @returns {boolean} True if the home panel is displayed, false otherwise.
	 */
	displayArtworkLayoutCover() {
		return grSet.layout === 'artwork' && !this.displayPlaylistArtwork && !this.displayDetails && !this.displayLibrary && !this.displayBiography;
	}

	/**
	 * Checks if the Library and Playlist are side by side, called when Library layout is in split mode.
	 * @param {boolean} control - Limits the area to the width and height of the playlist panel.
	 * @returns {boolean} True if Library and Playlist are being displayed.
	 */
	displayLibrarySplit(control) {
		return grSet.layout === 'default' && grSet.libraryLayout === 'split' && this.displayLibrary && this.displayPlaylist &&
		(control ? this.state.mouse_x > pl.playlist.x && this.state.mouse_x <= pl.playlist.x + pl.playlist.w &&
				   this.state.mouse_y > pl.playlist.y - SCALE(plSet.row_h) && this.state.mouse_y <= pl.playlist.y + pl.playlist.h : true);
	}

	/**
	 * Checks if the auto-random preset mode is enabled.
	 * @returns {boolean} True if the auto-random preset mode is enabled, false otherwise.
	 */
	hasAutoRandomPresetMode() {
		return !this.doubleClicked &&
		(!['off', 'track'].includes(grSet.presetAutoRandomMode) && grSet.presetSelectMode === 'harmonic'
		||
		grSet.presetAutoRandomMode === 'dblclick' && grSet.presetSelectMode === 'theme');
	}

	/**
	 * Checks if any theme tags are present in the music file metadata fields.
	 * @returns {boolean} True if any theme tags are present, false otherwise.
	 */
	hasThemeTags() {
		return $('[%GR_THEME%]') || $('[%GR_STYLE%]') || $('[%GR_PRESET%]');
	}

	/**
	 * Checks the panel layout state based on the provided condition.
	 * @param {string} condition - The condition to check. Use 'all' to check all conditions.
	 * @returns {boolean} - True if the condition(s) are met, otherwise false.
	 */
	panelLayoutState(condition) {
		const layout = {
			playlistLayoutNormal: grSet.playlistLayout === 'normal' && this.displayPlaylist && !this.displayBiography,
			libraryLayoutNormal: grSet.libraryLayout === 'normal' && this.displayLibrary,
			biographyLayoutNormal: grSet.biographyLayout === 'normal' && this.displayBiography,
			lyricsLayoutNormal: grSet.lyricsLayout === 'normal' && this.displayLyrics,
			lyricsLayoutFull: grSet.lyricsLayout === 'full' && this.displayLyrics,
			displayLibrarySplit: this.displayLibrarySplit()
		};

		if (condition === 'allNormal') {
			return grSet.layout === 'default'
			&& (layout.playlistLayoutNormal
			|| layout.libraryLayoutNormal
			|| layout.biographyLayoutNormal
			|| layout.lyricsLayoutNormal
			|| layout.displayLibrarySplit);
		}

		return layout[condition];
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - CONTROLS * //
	// #region MAIN - PUBLIC METHODS - CONTROLS
	/**
	 * Displays the specified panel, either based on explicit argument, at startup, or during playback changes.
	 * @param {string} panel - The name of the panel to display. Defaults to startup setting if not specified.
	 * @param {boolean} force - Whether to forcibly display the panel, bypassing automatic conditions.
	 */
	displayPanel(panel, force) {
		if (!force && (!grSet.returnToHomeOnPlaybackStop && !grSet.showPanelOnStartup || fb.PlaybackLength > 1)) {
			return;
		}

		// * Reset all panels
		if (!fb.IsPlaying || grSet.layout !== 'default') {
			this.displayCustomThemeMenu = false;
			this.displayMetadataGridMenu = false;
		}
		this.displayPlaylist = false;
		this.displayPlaylistArtwork = false;
		this.displayDetails = false;
		this.displayLibrary = false;
		this.displayBiography = false;
		this.displayLyrics = false;

		// * Setup all panels
		const panelActions = {
			cover: () => { // Artwork layout only
				if (grSet.layout === 'default') {
					grSet.showPanelOnStartup = 'playlist';
					this.displayPlaylist = true;
				}
			},
			playlist: () => {
				if (grSet.layout === 'artwork') {
					this.displayPlaylistArtwork = true;
				} else {
					this.displayPlaylist = true;
				}
			},
			details: () => {
				if (grSet.layout === 'artwork') {
					this.displayPlaylist = true;
					if (pl.playlist) pl.playlist.x = this.ww; // Move hidden Playlist offscreen to disable Playlist mouse functions in Details
				}
				this.displayDetails = true;
			},
			library: () => {
				this.displayPlaylist = grSet.layout === 'default' && grSet.libraryLayout === 'split';
				this.displayLibrary = true;
			},
			biography: () => {
				this.displayPlaylist = grSet.layout === 'default';
				this.displayBiography = true;
			},
			lyrics: () => {
				this.displayPlaylist = grSet.layout === 'default' && grSet.lyricsLayout === 'normal';
				this.displayLyrics = grSet.layout !== 'compact';
			}
		};

		// * Apply chosen panel
		const chosenPanel = panel || grSet.showPanelOnStartup;
		if (panelActions[chosenPanel]) {
			panelActions[chosenPanel]();
		}

		if (grSet.layout === 'compact') { // Override, needs to be always Playlist panel for Compact layout
			this.displayPlaylist = true;
		}

		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		this.setPlaylistSize();
		this.setLibrarySize();
		this.setBiographySize();
		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Handles the panel layouts by initializing, resetting, or restoring the panel layout.
	 * This includes setting up the Library and Biography layouts with its presets.
	 *
	 * Note 1: When the Playlist layout is in full width, it needs to be temporarily disabled to prevent panel overlapping
	 * when displaying the Library, Biography, Lyrics, or the custom theme menu.
	 *
	 * Note 2: The Lyrics layout in full width can only be displayed in the Playlist panel.
	 * @param {string} panel - The panel to be handled. Can be `library`, `biography`, `lyrics`, or `all`.
	 * @param {string} action - The action to be performed on the panel. Can be `initLayout`, `resetLayout`, or `restoreLayout`.
	 */
	handlePanelLayout(panel, action) {
		const panels = ['playlist', 'library', 'biography', 'lyrics'];

		const layoutActions = {
			initLayout: {
				playlist: () => {
					if ((grSet.playlistLayout === 'full' || grSet.savedPlaylistLayoutFull) &&
						(this.displayCustomThemeMenu || this.displayLibrary || this.displayBiography || this.displayLyrics)) {
						layoutActions.resetLayout.playlist();
					} else {
						layoutActions.restoreLayout.playlist();
					}
				},
				library: () => {
					if (this.displayLibrary && grSet.layout === 'default' && grSet.libraryLayout === 'split') {
						this.displayPlaylist = true;
						this.initLibraryLayout();
					}
				},
				biography: () => {
					if (this.displayBiography && grSet.layout === 'default' && grSet.biographyLayoutFullPreset) {
						this.initBiographyLayout();
					}
				},
				lyrics: () => {
					if ((grSet.lyricsLayout !== 'normal' || grSet.savedLyricsLayoutFull) &&
						(this.displayCustomThemeMenu || this.displayDetails || this.displayLibrary || this.displayBiography)) {
						layoutActions.resetLayout.lyrics();
					} else {
						layoutActions.restoreLayout.lyrics();
					}
				}
			},
			resetLayout: {
				playlist: () => {
					if (grSet.playlistLayout !== 'full') return;
					grSet.savedPlaylistLayoutFull = true;
					grSet.playlistLayout = 'normal';
					this.setPlaylistSize();
				},
				library: () => {
					if (grSet.libraryLayout !== 'full') return;
					grSet.savedLibraryLayoutFull = true;
					grSet.libraryLayout = 'normal';
					this.setLibrarySize();
				},
				biography: () => {
					if (grSet.biographyLayout !== 'full') return;
					grSet.savedBiographyLayoutFull = true;
					grSet.biographyLayout = 'normal';
					this.setBiographySize();
				},
				lyrics: () => {
					if (grSet.lyricsLayout === 'normal') return;
					grSet.savedLyricsLayoutFull = true;
					grSet.lyricsLayout = 'normal';
					this.setPlaylistSize();
				}
			},
			restoreLayout: {
				playlist: () => {
					if (!grSet.savedPlaylistLayoutFull) return;
					grSet.playlistLayout = 'full';
					this.setPlaylistSize();
				},
				library: () => {
					if (!grSet.savedLibraryLayoutFull) return;
					grSet.libraryLayout = 'full';
					this.setLibrarySize();
				},
				biography: () => {
					if (!grSet.savedBiographyLayoutFull) return;
					grSet.biographyLayout = 'full';
					this.setBiographySize();
				},
				lyrics: () => {
					if (!grSet.savedLyricsLayoutFull || this.displayDetails) return;
					grSet.lyricsLayout = grSet.savedLyricsLayout;
					if (this.displayLyrics) this.displayPlaylist = false;
					this.setPlaylistSize();
				}
			}
		};

		for (const p of panels) {
			if (panel === p || panel === 'all') {
				layoutActions[action][p]();
			}
		}
	}

	/**
	 * Handles keyboard actions for specific keys and combinations.
	 * @param {number} vkey - The virtual key code of the pressed key.
	 */
	handleKeyAction(vkey) {
		const setRating = (action) => {
			pl.artist_ratings.clear();
			pl.album_ratings.clear();
			this.clearCache('ratings');
			const metadb = fb.GetNowPlaying();
			const metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);

			if (fb.IsPlaying) {
				fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadb);
			}
			else if (!metadb && (this.displayPlaylist && !this.displayLibrary || this.displayPlaylistArtwork || this.displayLibrarySplit(true))) {
				if (metadbList.Count === 1) {
					fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadbList[0]);
				} else {
					console.log('Won\'t change rating with more than one selected item');
				}
			}

			pl.playlist.update_playlist_headers();
		};

		const keyActions = {
			[VKey.ADD]: {
				ctrlNoShift: () => grm.display.handleDisplayScaleKeyAction('increase'),
				altNoShift: () => grm.display.handleDisplayScaleKeyAction('reset'),
				ctrlShift: () => setRating('+')
			},
			[VKey.SUBTRACT]: {
				ctrlNoShift: () => grm.display.handleDisplayScaleKeyAction('decrease'),
				altNoShift: () => grm.display.handleDisplayScaleKeyAction('reset'),
				ctrlShift: () => setRating('-')
			},
			[VKey.KEY_Z]: {
				ctrl: () => fb.RunMainMenuCommand('Edit/Undo')
			}
		};

		if (keyActions[vkey]) {
			KeyPressAction(keyActions[vkey]);
		}
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - COMMON * //
	// #region MAIN - PUBLIC METHODS - COMMON
	/**
	 * Clears the specified cache, individual properties, or all caches.
	 * @param {string} [type] - The type of cache to clear. Can be 'metrics', 'ratings', 'albumArt', 'flag', 'debug'.
	 * @param {string} [property] - The specific property to clear within the cacheType.
	 * @param {boolean} [clearArtCache] - Whether to clear everything in the artCache object.
	 * @param {boolean} [keepAlbumArt] - Whether to keep the album art.
	 * @example
	 * // Clear all caches
	 * clearCache();
	 * @example
	 * // Clear a specific section of the cache
	 * clearCache('metrics');
	 * @example
	 * // Clear an individual property within a specific section
	 * clearCache('metrics', 'cachedLowerBarMetrics');
	 * @example
	 * // Clear all caches and the artCache
	 * clearCache(undefined, undefined, true);
	 */
	clearCache(type, property, clearArtCache, keepAlbumArt) {
		const cacheProperties = {
			metrics: {
				cachedLowerBarMetrics: false
			},
			ratings: {
				cachedCurrentRatings: false
			},
			albumArt: {
				albumArt: keepAlbumArt ? this.albumArt : null,
				albumArtScaled: null
			},
			flag : {
				flagImgs: []
			},
			debug: {
				debugTimingsArray: []
			}
		};

		if (clearArtCache) {
			grm.artCache && grm.artCache.clear();
			DebugLog('Main cache => Art cache cleared');
		}

		if (type && cacheProperties[type]) {
			if (property && cacheProperties[type][property] !== undefined) {
				this[property] = cacheProperties[type][property];
				DebugLog(`Main cache => Cleared property "${property}" in cache type "${type}"`);
			} else {
				Object.assign(this, cacheProperties[type]);
				DebugLog(`Main cache => Cleared all properties in cache type "${type}"`);
			}
		}
		else if (!type) {
			for (const property in cacheProperties) {
				Object.assign(this, cacheProperties[property]);
				DebugLog(`Main cache => Cleared all properties in cache type "${property}"`);
			}
		}
	}

	/**
	 * Clears playback state properties and optionally clears now playing strings.
	 * @param {boolean} clearNowPlaying - Whether to clear now playing strings.
	 */
	clearPlaybackState(clearNowPlaying) {
		this.isPlayingCD = false;
		this.isStreaming = false;
		this.lastAlbumFolder = '';
		this.lastAlbumDiscNumber = '0';
		this.playbackTime = '';

		if (clearNowPlaying) {
			grStr.grid = [];
			grStr.artist = '';
			grStr.artistLower = '';
			grStr.tracknum = $(grSet.showLowerBarVersion_layout ? grSet.layout !== 'default' ? grCfg.settings.stoppedString1acr : grCfg.settings.stoppedString1 : ' ', undefined, true);
			grStr.titleLower = $(grSet.showLowerBarVersion_layout ? ` ${grCfg.settings.stoppedString2}` : ' ', undefined, true);
			grStr.time = grSet.showLowerBarVersion_layout || grCfg.updateAvailable ? grCfg.lowerBarStoppedTime = grCfg.getCurrentVersionInfo() : ' ';
			grStr.year = '';
		}

		DebugLog('Playback => Playback state cleared');
	}

	/**
	 * Clears timers based on the timer type.
	 * @param {string} [type] - The type of timer to clear. If not provided, all timers will be cleared.
	 * - 'autoDownloadBio'
	 * - 'autoDownloadLyrics'
	 * - 'albumArt'
	 * - 'hideCursor',
	 * - 'seekbar'
	 * - 'seekbarInterval',
	 * - 'presetAutoRandomMode'
	 * - 'presetIndicator'
	 * - 'randomThemeAutoColor'
	 * - 'themeDayNightMode'.
	 */
	clearTimer(type) {
		const timers = {
			autoDownloadBio: {
				timer: this.autoDownloadBioTimer,
				clear: clearInterval,
				log: 'Timer => Biography auto-download timer cleared'
			},
			autoDownloadLyrics: {
				timer: this.autoDownloadLyricsTimer,
				clear: clearInterval,
				log: 'Timer => Lyrics auto-download timer cleared'
			},
			albumArt: {
				timer: this.albumArtTimeout,
				clear: clearTimeout,
				log: 'Timer => Album art timer cleared'
			},
			hideCursor: {
				timer: this.hideCursorTimeout,
				clear: clearTimeout,
				log: 'Timer => Hide cursor timer cleared'
			},
			seekbar: {
				timer: this.seekbarTimer,
				clear: clearInterval,
				log: 'Timer => Seekbar timer cleared'
			},
			seekbarInterval: {
				timer: this.seekbarTimerInterval,
				clear: clearInterval,
				log: 'Timer => Seekbar interval timer cleared'
			},
			presetAutoRandomMode: {
				timer: this.presetAutoRandomModeTimer,
				clear: clearInterval,
				log: 'Timer => Auto random preset timer cleared'
			},
			presetIndicator: {
				timer: this.presetIndicatorTimer,
				clear: clearInterval,
				log: 'Timer => Theme preset indicator timer cleared'
			},
			randomThemeAutoColor: {
				timer: this.randomThemeAutoColorTimer,
				clear: clearInterval,
				log: 'Timer => Random theme auto-color timer cleared'
			},
			themeDayNightMode: {
				timer: this.themeDayNightModeTimer,
				clear: clearInterval,
				log: 'Timer => Theme day/night mode timer cleared'
			}
		};

		const clearTimerByType = (type) => {
			const { timer, clear, log } = timers[type];
			if (timer) {
				clear(timer);
				timers[type].timer = null;
			}
			DebugLog(log);
		};

		if (type && timers[type]) {
			clearTimerByType(type);
		} else {
			for (const key in timers) {
				clearTimerByType(key);
			}
		}
	}

	/**
	 * Creates and sets all theme fonts.
	 */
	createFonts() {
		// * TOOLTIPS * //
		this.ttip = window.Tooltip;
		if (this.ttip) {
			this.ttip.Text = '';
			this.ttip.SetFont(grFont.fontDefault, SCALE(15));
			this.ttip.SetMaxWidth(SCALE(grSet.layout !== 'default' ? 600 : 800));
		}

		// * STYLE CHANGE * //
		const artistTitle = grSet.showGridArtist_default && grSet.showGridTitle_default || grSet.showGridArtist_artwork && grSet.showGridTitle_artwork;

		// * TOP MENU BUTTONS * //
		grFont.topMenu        = Font(grFont.fontTopMenu, grSet.menuFontSize_layout, 0);
		grFont.topMenuCaption = Font(grFont.fontTopMenuCaption, grSet.menuCaptionFontSize_layout, 0);
		grFont.topMenuCompact = Font(grFont.fontAwesome, grSet.menuFontSize_layout, 0);

		// * LOWER BAR * //
		grFont.lowerBarArtist = Font(grFont.fontLowerBarArtist, grSet.lowerBarFontSize_layout, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.lowerBarTitle  = Font(grFont.fontLowerBarTitle,  grSet.lowerBarFontSize_layout, 0);
		grFont.lowerBarDisc   = Font(grFont.fontLowerBarDisc,   grSet.lowerBarFontSize_layout, 0);
		grFont.lowerBarTime   = Font(grFont.fontLowerBarTime,   grSet.lowerBarFontSize_layout, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.lowerBarLength = Font(grFont.fontLowerBarLength, grSet.lowerBarFontSize_layout, 0);
		grFont.lowerBarWave   = Font(grFont.fontLowerBarWave,   grSet.lowerBarFontSize_layout - 6, grSet.customThemeFonts ? FontStyle.bold : 0);

		if (grCfg.updateHyperlink) grCfg.updateHyperlink.setFont(grFont.lowerBarTitle);

		// * LOWER BAR TRANSPORT BUTTONS * //
		grFont.guifx             = Font(grFont.fontGuiFx,   grSet.guiFxBtnFontSize_layout, 0);
		grFont.pboDefault        = Font(grFont.fontGuiFx,   grSet.pboDefaultBtnFontSize_layout, 0);
		grFont.pboRepeatPlaylist = Font(grFont.fontAwesome, grSet.pboReplayBtnFontSize_layout, 0);
		grFont.pboRepeatTrack    = Font(grFont.fontAwesome, grSet.pboReplayBtnFontSize_layout, 0);
		grFont.pboShuffle        = Font(grFont.fontGuiFx,   grSet.pboShuffleBtnFontSize_layout, 0);
		grFont.guifxReload       = Font(grFont.fontGuiFx,   grSet.reloadBtnFontSize_layout, 0);
		grFont.guifxAddTrack     = Font(grFont.fontGuiFx,   grSet.addTrackBtnFontSize_layout, 0);
		grFont.guifxVolume       = Font(grFont.fontGuiFx,   grSet.volumeBtnFontSize_layout, 0);

		// * MISC * //
		grFont.noAlbumArtStub  = Font(grFont.fontAwesome, 160, 0);
		grFont.noAlbumArtStub2 = Font(grFont.fontAwesome, 100, 0);
		grFont.symbol          = Font(grFont.fontSegoeUISymbol, grSet.playlistFontSize_layout, 0);
		grFont.notification    = Font(grFont.fontNotification, grSet.notificationFontSize_layout, 0);
		grFont.popup           = Font(grFont.fontPopup, grSet.popupFontSize_layout, 0);
		grFont.tooltip         = Font(grFont.fontTooltip, grSet.tooltipFontSize_layout, 0);

		if (grSet.layout === 'compact') return; // These fonts below are not available in Compact layout, so skip these to prevent errors

		// * DETAILS METADATA GRID * //
		grFont.gridArtist      = Font(grFont.fontGridArtist, grSet.gridArtistFontSize_layout, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.gridTrackNumber = Font(artistTitle ? grFont.fontGridTitle : grFont.fontGridTitleBold, grSet.gridTrackNumFontSize_layout, 0);
		grFont.gridTitle       = Font(artistTitle ? grFont.fontGridTitle : grFont.fontGridTitleBold, grSet.gridTitleFontSize_layout, 0);
		grFont.gridAlbum       = Font(grFont.fontGridAlbum, grSet.gridAlbumFontSize_layout, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.gridKey         = Font(grFont.fontGridKey, grSet.gridKeyFontSize_layout, 0);
		grFont.gridVal         = Font(grFont.fontGridValue, grSet.gridValueFontSize_layout + 1, 0);

		// * LIBRARY * //
		grFont.library = Font(grFont.fontLibrary, grSet.libraryFontSize_layout, 0);

		// * BIOGRAPHY * //
		grFont.biography = Font(grFont.fontBiography, grSet.biographyFontSize_layout, 0);

		// * LYRICS * //
		grFont.lyrics             = Font(grFont.fontLyrics, grSet.lyricsFontSize_layout, 1);
		grFont.lyricsHighlight    = Font(grFont.fontLyrics, grSet.lyricsFontSize_layout * 1.5, 1);
		grFont.lyricsInfoRegular  = Font(grFont.fontLyrics, grSet.lyricsInfoFontSize_default, 0);
		grFont.lyricsInfoHeadline = Font(grFont.fontLyrics, grSet.lyricsInfoFontSize_default * 1.5, 1);
	}

	/**
	 * Fetches and returns the current ratings for the artist, album, and track.
	 * @returns {{artistRating: number, albumRating: number, trackRating: number}} An object containing the ratings.
	 */
	getCurrentRatings() {
		if (this.cachedCurrentRatings) return this.currentRatings;

		const rating = new PlaylistRating();
		const getRating = rating.get_current_ratings();

		this.currentRatings = {
			artistRating: getRating.artistRating.get(grStr.artist) || 0,
			albumRating: getRating.albumRating.get(grStr.album) || 0,
			trackRating: getRating.trackRating || 0
		};

		this.cachedCurrentRatings = true;
		return this.currentRatings;
	}

	/**
	 * Gets a list of image paths based on the specified type.
	 * @param {string} type - The type ('artistArt', 'albumArt', 'customArt') of images to retrieve.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 * @returns {string[]} - An array of image paths.
	 */
	getImagePathList(type, metadb) {
		const fileFormats = ['jpg', 'png'];

		if (type === 'artistArt') {
			const artistArtPathsRaw = bio.panel.cleanPth(bioCfg.pth.foImgArt, bio.panel.id.focus);
			const artistArtPaths = UtilsGlob(`${artistArtPathsRaw}*`);
			return FilterFiles(artistArtPaths, fileFormats);
		}

		if (type === 'albumArt') {
			const albumArtExclude = grSet.filterDiscArtFromArtwork && (/(cd|disc|vinyl)([0-9]*|[a-h])\.(png|jpg)/i);
			const albumArtPathsRaw = grCfg.imgPaths.flatMap(path => UtilsGlob($(path, metadb)));
			const albumArtPaths = [...new Set(albumArtPathsRaw)];
			return FilterFiles(albumArtPaths, fileFormats, albumArtExclude);
		}

		if (type === 'customArt') {
			const customArtPaths = UtilsGlob(`${grPath.images}background\\*`);
			return FilterFiles(customArtPaths, fileFormats);
		}

		return [];
	}

	/**
	 * Refreshes the theme by clearing various UI elements and caches,
	 * repainting the window, and updating the playback information.
	 */
	refreshTheme() {
		this.clearCache(undefined, undefined, true);
		this.clearTimer();
		grm.details.clearCache(undefined, undefined, true);
		grm.details.clearTimer();
		RepaintWindow();
		on_playback_new_track(fb.GetNowPlaying());
	}

	/**
	 * Repaints rectangles on the seekbar for real time update.
	 */
	refreshSeekbar() {
		// * Time
		window.RepaintRect(this.lowerBarTimeX, this.lowerBarTimeY, this.lowerBarTimeW + this.lowerBarTimeH * 0.3, this.lowerBarTimeH, grSet.spinDiscArt && !this.displayLyrics);

		if (grSet.seekbar === 'waveformbar') return;

		// * Progress bar and Peakmeter bar
		const x = this.edgeMargin - SCALE(2);
		const y = this.seekbarY - SCALE(2);
		const w = this.ww - this.edgeMarginBoth + SCALE(4);
		const h = this.seekbarHeight + SCALE(4);
		window.RepaintRect(x, y, w, h, grSet.spinDiscArt && !this.displayLyrics);
	}

	/**
	 * Sets a given timer interval to update the seekbar.
	 */
	setSeekbarRefresh() {
		DebugLog('Seekbar => setSeekbarRefresh');

		if (fb.PlaybackLength > 0) {
			const variableRefreshRate = Math.max(60, Math.ceil(1000 / ((this.ww - this.edgeMarginBoth) / fb.PlaybackLength)));
			const selectedRefreshRate = grSet.seekbar === 'peakmeterbar' ? grSet.peakmeterBarRefreshRate : grSet.progressBarRefreshRate;
			this.seekbarTimerInterval = selectedRefreshRate === 'variable' ? variableRefreshRate : selectedRefreshRate;

			if (selectedRefreshRate === 'variable') {
				while (this.seekbarTimerInterval > 500) {
					this.seekbarTimerInterval = Math.floor(this.seekbarTimerInterval / 2);
				}
			}
		} else {
			this.seekbarTimerInterval = 1000; // Radio streaming
		}

		if (this.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay) {
			this.debugTimingsArray.push(`Seekbar => Seekar: ${this.seekbarTimerInterval} ms or ${(1000 / this.seekbarTimerInterval).toFixed(2)} Hz`);
			DebugLog(`Seekbar => Seekbar will update every ${this.seekbarTimerInterval} ms or ${(1000 / this.seekbarTimerInterval).toFixed(2)} times per second.`);
		}

		this.clearTimer('seekbar');
		this.seekbarTimer = !fb.IsPaused ? setInterval(() => this.refreshSeekbar(), this.seekbarTimerInterval) : null;
	}

	/**
	 * Sets and updates main components.
	 * @param {string} component - The component to update:
	 * - all
	 * - customMenu
	 * - jSearch
	 * - timeline
	 * - seekbar
	 * - volumeButton
	 */
	setMainComponents(component) {
		const components = {
			customMenu: () => {
				grm.cusMenu.on_size(this.ww, this.wh);
			},
			jSearch: () => {
				grm.jSearch = new JumpSearch();
				grm.jSearch.on_size(this.ww, this.wh);
			},
			timeline: () => {
				grm.details.updateGridTimeline(true);
			},
			seekbar: () => {
				if (grSet.seekbar === 'progressbar') {
					grm.progBar = new ProgressBar();
				} else if (grSet.seekbar === 'peakmeterbar') {
					grm.peakBar = new PeakmeterBar();
					grm.peakBar.on_size(this.ww, this.wh);
				} else if (grSet.seekbar === 'waveformbar') {
					grm.waveBar = new WaveformBar();
					grm.waveBar.updateBar();
				}
			},
			volumeButton: () => {
				grm.volBtn = new VolumeButton();
			}
		};

		if (component === 'all') {
			for (const component of Object.values(components)) {
				component();
			}
		} else if (components[component]) {
			components[component]();
		}
	}

	/**
	 * Resets the theme when changing to a different one, used in top menu Options > Theme.
	 */
	resetTheme() {
		this.initThemeFull = true;

		const invalidNighttimeStyle = (grSet.theme !== 'reborn' && grSet.theme !== 'random' && !grSet.theme.startsWith('custom') || grSet.styleRebornWhite || grSet.styleRebornBlack) && grSet.styleNighttime;
		const invalidWhiteThemeStyle = grSet.theme !== 'white' && (grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2 || grSet.styleBlackAndWhiteReborn);
		const invalidBlackThemeStyle = grSet.theme !== 'black' && grSet.styleBlackReborn;
		const invalidRebornThemeStyle = grSet.theme !== 'reborn' && (grSet.styleRebornWhite || grSet.styleRebornBlack || grSet.styleRebornFusion || grSet.styleRebornFusion2 || grSet.styleRebornFusionAccent);
		const invalidGradientStyle = !['reborn', 'random', 'blue', 'darkblue', 'red'].includes(grSet.theme) && !grSet.theme.startsWith('custom') && (grSet.styleGradient || grSet.styleGradient2);

		// * Disable style nighttime for themes that do not support it
		if (invalidNighttimeStyle) {
			grSet.styleNighttime = false;
			this.initStyleState();
		}

		// * Reset themes that do not support specific styles to the default style
		if (invalidWhiteThemeStyle || invalidBlackThemeStyle || invalidRebornThemeStyle || invalidGradientStyle) {
			this.resetStyle('all');
		}
	}

	/**
	 * Resets all styles or grouped styles when changing styles. Used in top menu Options > Style.
	 * @param {string} group - Specifies which group of styles to reset:
	 * - 'group_one'
	 * - 'group_two'
	 * - 'all'
	 * - 'all_theme_day_night'
	 */
	resetStyle(group) {
		const _day_night = grSet.themeSetupDay ? '_day' : '_night';

		if (group === 'group_one') {
			grSet.styleBlend     = false;
			grSet.styleBlend2    = false;
			grSet.styleGradient  = false;
			grSet.styleGradient2 = false;
		}
		else if (group === 'group_two') {
			grSet.styleAlternative         = false;
			grSet.styleAlternative2        = false;
			grSet.styleBlackAndWhite       = false;
			grSet.styleBlackAndWhite2      = false;
			grSet.styleBlackAndWhiteReborn = false;
			grSet.styleBlackReborn         = false;
			grSet.styleRebornWhite         = false;
			grSet.styleRebornBlack         = false;
			grSet.styleRebornFusion        = false;
			grSet.styleRebornFusion2       = false;
			grSet.styleRebornFusionAccent  = false;
			grSet.styleRandomPastel        = false;
			grSet.styleRandomDark          = false;
		}
		else if (group === 'all') {
			this.initThemeFull             = true;
			grSet.styleDefault             = true;
			grSet.styleNighttime           = false;
			grSet.styleBevel               = false;
			grSet.styleBlend               = false;
			grSet.styleBlend2              = false;
			grSet.styleGradient            = false;
			grSet.styleGradient2           = false;
			grSet.styleAlternative         = false;
			grSet.styleAlternative2        = false;
			grSet.styleBlackAndWhite       = false;
			grSet.styleBlackAndWhite2      = false;
			grSet.styleBlackAndWhiteReborn = false;
			grSet.styleBlackReborn         = false;
			grSet.styleRebornWhite         = false;
			grSet.styleRebornBlack         = false;
			grSet.styleRebornFusion        = false;
			grSet.styleRebornFusion2       = false;
			grSet.styleRebornFusionAccent  = false;
			grSet.styleRandomPastel        = false;
			grSet.styleRandomDark          = false;
			grSet.styleRandomAutoColor     = 'off';
			grSet.styleTopMenuButtons      = 'default';
			grSet.styleTransportButtons    = 'default';
			grSet.styleProgressBarDesign   = 'default';
			grSet.styleProgressBar         = 'default';
			grSet.styleProgressBarFill     = 'default';
			grSet.styleVolumeBarDesign     = 'default';
			grSet.styleVolumeBar           = 'default';
			grSet.styleVolumeBarFill       = 'default';
			grSet.themeBrightness          = 'default';
		}
		else if (group === 'all_theme_day_night') {
			this.initThemeFull                             = true;
			grSet.styleDefault                             = true;
			grSet[`styleNighttime${_day_night}`]           = false;
			grSet[`styleBevel${_day_night}`]               = false;
			grSet[`styleBlend${_day_night}`]               = false;
			grSet[`styleBlend2${_day_night}`]              = false;
			grSet[`styleGradient${_day_night}`]            = false;
			grSet[`styleGradient2${_day_night}`]           = false;
			grSet[`styleAlternative${_day_night}`]         = false;
			grSet[`styleAlternative2${_day_night}`]        = false;
			grSet[`styleBlackAndWhite${_day_night}`]       = false;
			grSet[`styleBlackAndWhite2${_day_night}`]      = false;
			grSet[`styleBlackAndWhiteReborn${_day_night}`] = false;
			grSet[`styleBlackReborn${_day_night}`]         = false;
			grSet[`styleRebornWhite${_day_night}`]         = false;
			grSet[`styleRebornBlack${_day_night}`]         = false;
			grSet[`styleRebornFusion${_day_night}`]        = false;
			grSet[`styleRebornFusion2${_day_night}`]       = false;
			grSet[`styleRebornFusionAccent${_day_night}`]  = false;
			grSet[`styleRandomPastel${_day_night}`]        = false;
			grSet[`styleRandomDark${_day_night}`]          = false;
			grSet[`styleRandomAutoColor${_day_night}`]     = 'off';
			grSet[`styleTopMenuButtons${_day_night}`]      = 'default';
			grSet[`styleTransportButtons${_day_night}`]    = 'default';
			grSet[`styleProgressBarDesign${_day_night}`]   = 'default';
			grSet[`styleProgressBar${_day_night}`]         = 'default';
			grSet[`styleProgressBarFill${_day_night}`]     = 'default';
			grSet[`styleVolumeBarDesign${_day_night}`]     = 'default';
			grSet[`styleVolumeBar${_day_night}`]           = 'default';
			grSet[`styleVolumeBarFill${_day_night}`]       = 'default';
			grSet[`themeBrightness${_day_night}`]          = 'default';
		}
	}

	/**
	 * Restores the theme state based on the saved `theme`, `style`, `preset` settings.
	 * Mainly used to restore the previous theme state after %GR_THEME%, %GR_STYLE%, %GR_PRESET% usage.
	 */
	restoreThemeState() {
		if (!this.themeRestoreState) return;

		if (grSet.presetSelectMode === 'default') {
			DebugLog('\n>>> restoreThemeState <<<\n');
			this.resetStyle('all');
			this.resetTheme();
			this.restoreThemeStylePreset(); // * Retore saved grSet settings
			if (grSet.savedPreset !== false) grm.preset.setThemePreset(grSet.savedPreset);
			this.initCustomTheme();
			this.initStyleState();
		}

		if (grSet.theme === grSet.savedTheme) {
			this.restoreThemeStylePreset(true); // * Reset saved grSet settings
		}

		this.themeRestoreState = false;
	}

	/**
	 * Restores theme, style, preset after custom %GR_THEME%, %GR_STYLE%, %GR_PRESET% usage or in theme sandbox.
	 * Used in restoreThemeState() and theme sandbox options.
	 * @param {boolean} reset - Determines whether to reset the theme styles and theme preset or restore them.
	 * @param {boolean} keepPreset - Determines whether to keep the current theme preset or reset it.
	 */
	restoreThemeStylePreset(reset, keepPreset) {
		/**
		 * Sets or resets an individual setting based on the reset flag.
		 * When reset is true, the value of grSetKey is saved to savedKey.
		 * When reset is false, the saved value in savedKey is restored to grSetKey.
		 * @param {object} grSetObj - The preferences object containing the settings.
		 * @param {string} grSetKey - The key for the current setting to be set or restored.
		 * @param {string} savedKey - The key for the saved setting to set or restore from.
		 * @private
		 */
		const _setSetting = (grSetObj, grSetKey, savedKey) => {
			if (reset) {
				grSetObj[savedKey] = grSetObj[grSetKey];
			} else {
				grSetObj[grSetKey] = grSetObj[savedKey];
			}
		}

		_setSetting(grSet, 'theme', 'savedTheme');
		_setSetting(grSet, 'styleNighttime', 'savedStyleNighttime');
		_setSetting(grSet, 'styleBevel', 'savedStyleBevel');
		_setSetting(grSet, 'styleBlend', 'savedStyleBlend');
		_setSetting(grSet, 'styleBlend2', 'savedStyleBlend2');
		_setSetting(grSet, 'styleGradient', 'savedStyleGradient');
		_setSetting(grSet, 'styleGradient2', 'savedStyleGradient2');
		_setSetting(grSet, 'styleAlternative', 'savedStyleAlternative');
		_setSetting(grSet, 'styleAlternative2', 'savedStyleAlternative2');
		_setSetting(grSet, 'styleBlackAndWhite', 'savedStyleBlackAndWhite');
		_setSetting(grSet, 'styleBlackAndWhite2', 'savedStyleBlackAndWhite2');
		_setSetting(grSet, 'styleBlackAndWhiteReborn', 'savedStyleBlackAndWhiteReborn');
		_setSetting(grSet, 'styleBlackReborn', 'savedStyleBlackReborn');
		_setSetting(grSet, 'styleRebornWhite', 'savedStyleRebornWhite');
		_setSetting(grSet, 'styleRebornBlack', 'savedStyleRebornBlack');
		_setSetting(grSet, 'styleRebornFusion', 'savedStyleRebornFusion');
		_setSetting(grSet, 'styleRebornFusion2', 'savedStyleRebornFusion2');
		_setSetting(grSet, 'styleRebornFusionAccent', 'savedStyleRebornFusionAccent');
		_setSetting(grSet, 'styleRandomPastel', 'savedStyleRandomPastel');
		_setSetting(grSet, 'styleRandomDark', 'savedStyleRandomDark');
		_setSetting(grSet, 'styleRandomAutoColor', 'savedStyleRandomAutoColor');
		_setSetting(grSet, 'styleTopMenuButtons', 'savedStyleTopMenuButtons');
		_setSetting(grSet, 'styleTransportButtons', 'savedStyleTransportButtons');
		_setSetting(grSet, 'styleProgressBarDesign', 'savedStyleProgressBarDesign');
		_setSetting(grSet, 'styleProgressBar', 'savedStyleProgressBar');
		_setSetting(grSet, 'styleProgressBarFill', 'savedStyleProgressBarFill');
		_setSetting(grSet, 'styleVolumeBarDesign', 'savedStyleVolumeBarDesign');
		_setSetting(grSet, 'styleVolumeBar', 'savedStyleVolumeBar');
		_setSetting(grSet, 'styleVolumeBarFill', 'savedStyleVolumeBarFill');
		_setSetting(grSet, 'themeBrightness', 'savedThemeBrightness');

		if (reset && !keepPreset) {
			grSet.savedPreset = false;
		} else {
			grSet.preset = grSet.savedPreset;
		}
	}

	/**
	 * Sets the chosen style based on its current state. Used when changing styles in the top menu Options > Style.
	 * @param {string} style - The selected style.
	 * @param {boolean|string} value - The value of the selected style.
	 * @returns {void} No return value.
	 */
	setStyle(style, value) {
		// * Check for active theme day/night mode and return if active
		if (grSet.themeDayNightMode) {
			const msg = grm.msg.getMessage('main', 'themeDayNightModeNotice');
			const msgFb = grm.msg.getMessage('main', 'themeDayNightModeNotice', true);
			grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
				if (confirmed) grSet.themeDayNightMode = false;
			});
			if (grSet.themeDayNightMode) return;
		}

		// * Reset all styles in the group of the chosen style to prevent compatibility issues
		const styleGroups = {
			styleBlend: 'group_one',
			styleBlend2: 'group_one',
			styleGradient: 'group_one',
			styleGradient2: 'group_one',
			styleAlternative: 'group_two',
			styleAlternative2: 'group_two',
			styleBlackAndWhite: 'group_two',
			styleBlackAndWhite2: 'group_two',
			styleBlackAndWhiteReborn: 'group_two',
			styleBlackReborn: 'group_two',
			styleRebornWhite: 'group_two',
			styleRebornBlack: 'group_two',
			styleRebornFusion: 'group_two',
			styleRebornFusion2: 'group_two',
			styleRebornFusionAccent: 'group_two',
			styleRandomPastel: 'group_two',
			styleRandomDark: 'group_two'
		};
		const resetTarget = (grSet.themeSetupDay || grSet.themeSetupNight) ? 'all_theme_day_night' : styleGroups[style];
		this.resetStyle(resetTarget);

		if (style === 'styleNighttime' && (grSet.styleRebornWhite || grSet.styleRebornBlack)) {
			grSet.styleRebornWhite = false;
			grSet.styleRebornBlack = false;
		} else if ((style === 'styleRebornWhite' || style === 'styleRebornBlack') && grSet.styleNighttime) {
			grSet.styleNighttime = false;
		}

		// * Then set and apply the chosen style
		if (style) {
			if (grSet.themeSandbox) {
				grSet[style] = value;
			} else {
				this.restoreThemeStylePreset(true, true);
				const savedStyleName = `savedStyle${style.charAt(5).toUpperCase()}${style.slice(6)}`;
				grSet[savedStyleName] = grSet[style] = value;
			}
		}

		if (grSet.themeSetupDay || grSet.themeSetupNight) setThemeDayNightStyle();
	}

	/**
	 * Sets a new random theme preset.
	 */
	setRandomThemePreset() {
		if (grSet.presetSelectMode === 'theme') {
			this.setThemePresetSelection(false, true);
		}
		if (this.hasAutoRandomPresetMode()) {
			grm.preset.getRandomThemePreset();
		}
	}

	/**
	 * Activates or deactivates all theme presets selection, used in top menu Options > Preset > Select presets.
	 * @param {boolean} state - The state of theme presets selection will be set to true or false.
	 * @param {boolean} presetSelectModeTheme - The selection of theme specified presets.
	 */
	setThemePresetSelection(state, presetSelectModeTheme) {
		const presetSelect = {
			white: 'presetSelectWhite',
			black: 'presetSelectBlack',
			reborn: 'presetSelectReborn',
			random: 'presetSelectRandom',
			blue: 'presetSelectBlue',
			darkblue: 'presetSelectDarkblue',
			red: 'presetSelectRed',
			cream: 'presetSelectCream',
			nblue: 'presetSelectNblue',
			ngreen: 'presetSelectNgreen',
			nred: 'presetSelectNred',
			ngold: 'presetSelectNgold',
			custom: 'presetSelectCustom'
		};

		for (const key in presetSelect) {
			grSet[presetSelect[key]] = state;
		}

		if (presetSelectModeTheme) {
			const theme = grSet.savedTheme;
			if (presetSelect[theme]) {
				grSet[presetSelect[theme]] = true;
			} else if (theme.startsWith('custom')) {
				grSet[presetSelect.custom] = true;
			}
		}
	}

	/**
	 * Updates the theme when changing styles, used in top menu Options > Style.
	 */
	updateStyle() {
		this.initThemeFull = true;

		if (['white', 'black', 'reborn', 'random'].includes(grSet.theme) && fb.IsPlaying) {
			grm.color.getThemeColors(this.albumArt); // * Update grCol.primary for dynamic themes
		}

		this.initTheme();
		DebugLog('\n>>> initTheme => updateStyle <<<\n');
		this.initStyleState();
		grm.preset.initThemePresetState();
		grm.button.initButtonState();
	}

	/**
	 * Validates theme styles and deactivates those which are not supported in specific themes or theme style groups.
	 * @param {boolean} showPopup - Whether to show a popup message when an invalid style is detected.
	 */
	validateStyle(showPopup) {
		const invalidNighttimeStyle = (grSet.theme !== 'reborn' && grSet.theme !== 'random' && !grSet.theme.startsWith('custom') || grSet.styleRebornWhite || grSet.styleRebornBlack) && grSet.styleNighttime;
		const invalidWhiteThemeStyle = grSet.theme !== 'white' && (grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2 || grSet.styleBlackAndWhiteReborn);
		const invalidBlackThemeStyle = grSet.theme !== 'black' && grSet.styleBlackReborn;
		const invalidRebornThemeStyle = grSet.theme !== 'reborn' && (grSet.styleRebornWhite || grSet.styleRebornBlack || grSet.styleRebornFusion || grSet.styleRebornFusion2 || grSet.styleRebornFusionAccent);
		const invalidGradientStyle = !['reborn', 'random', 'blue', 'darkblue', 'red'].includes(grSet.theme) && !grSet.theme.startsWith('custom') && (grSet.styleGradient || grSet.styleGradient2);

		const handlePopup = (showPopup, msg) => {
			if (!showPopup) return;
			grm.msg.showPopup(true, msg, msg, 'OK', false, (confirmed) => {});
		};

		if (invalidNighttimeStyle) {
			grSet.styleNighttime = false;
			const msg = grm.msg.getMessage('main', 'validateStyleNight');
			handlePopup(showPopup, msg);
		}

		if (invalidWhiteThemeStyle) {
			grSet.styleBlackAndWhite = false;
			grSet.styleBlackAndWhite2 = false;
			grSet.styleBlackAndWhiteReborn = false;
			const msg = grm.msg.getMessage('main', 'validateStyleBlackAndWhite');
			handlePopup(showPopup, msg);
		}

		if (invalidBlackThemeStyle) {
			grSet.styleBlackReborn = false;
			const msg = grm.msg.getMessage('main', 'validateStyleBlackReborn');
			handlePopup(showPopup, msg);
		}

		if (invalidRebornThemeStyle) {
			grSet.styleRebornWhite = false;
			grSet.styleRebornBlack = false;
			grSet.styleRebornFusion = false;
			grSet.styleRebornFusion2 = false;
			grSet.styleRebornFusionAccent = false;
			const msg = grm.msg.getMessage('main', 'validateStyleRebornSpecials');
			handlePopup(showPopup, msg);
		}

		if (invalidGradientStyle) {
			grSet.styleGradient = false;
			grSet.styleGradient2 = false;
			const msg = grm.msg.getMessage('main', 'validateStyleGradient');
			handlePopup(showPopup, msg);
		}

		const groupOneStyles = [
			'styleBlend', 'styleBlend2',
			'styleGradient', 'styleGradient2'
		];
		const activeGroupOneStyle = groupOneStyles.find(style => grSet[style] === true);
		if (groupOneStyles.filter(style => grSet[style] === true).length > 1) {
			for (const style of groupOneStyles) {
				if (style !== activeGroupOneStyle) {
					grSet[style] = false;
				}
			}
			const msg = grm.msg.getMessage('main', 'validateStyleGroupOne');
			handlePopup(showPopup, msg);
		}

		const groupTwoStyles = [
			'styleAlternative', 'styleAlternative2',
			'styleBlackAndWhite', 'styleBlackAndWhite2', 'styleBlackAndWhiteReborn',
			'styleBlackReborn',
			'styleRebornWhite', 'styleRebornBlack', 'styleRebornFusion', 'styleRebornFusion2', 'styleRebornFusionAccent',
			'styleRandomPastel', 'styleRandomDark'
		];
		const activeGroupTwoStyle = groupTwoStyles.find(style => grSet[style] === true);
		if (groupTwoStyles.filter(style => grSet[style] === true).length > 1) {
			for (const style of groupTwoStyles) {
				if (style !== activeGroupTwoStyle) {
					grSet[style] = false;
				}
			}
			const msg = grm.msg.getMessage('main', 'validateStyleGroupTwo');
			handlePopup(showPopup, msg);
		}

		this.initStyleState();
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - GRAPHICS * //
	// #region MAIN - PUBLIC METHODS - GRAPHICS
	/**
	 * Loads country flags when defined in tags, displayed in the lower bar and Details.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	loadCountryFlags(metadb = undefined) {
		if (!grSet.showGridArtistFlags_layout && !grSet.showLowerBarArtistFlags_layout) return;

		this.flagImgs = [];
		const countries = GetMetaValues(grTF.artist_country, metadb);

		for (const country of countries) {
			const flagImage = this.loadFlagImage(country, metadb);
			flagImage && this.flagImgs.push(flagImage);
		}
	}

	/**
	 * Loads flag images from the image directory based on the country name or ISO country code provided.
	 * @param {string} country - The country for which we want to load the flag image.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 * @returns {GdiBitmap} The flag image object.
	 */
	loadFlagImage(country, metadb = undefined) {
		const countryName = (ConvertIsoCountryCodeToFull(country) || country).trim().replace(/ /g, '-'); // In case we have a 2-digit country code
		const path = `${$($Escape(grPath.flagsBase), metadb) + HD_4K('32\\', '64\\') + countryName}.png`;
		return gdi.Image(path);
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - ARTWORK * //
	// #region MAIN - PUBLIC METHODS - ARTWORK
	/**
	 * Fetches new album art/disc art when a new album is being played, disc art has changed or when cycling through album artworks.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	fetchNewArtwork(metadb) {
		this.fetchAlbumArt(metadb);
		grm.details.fetchDiscArt();
	}

	/**
	 * Handles the fetching or displaying of album art/disc art or background images.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	handleArtwork(metadb) {
		if (this.albumArtTimeout) {
			this.clearTimer('albumArt');
		}

		const fetchNewArtwork =
			grSet.albumArtCycle && this.albumArtIndex !== 0
			|| this.albumArt == null
			|| this.albumArtEmbedded
			|| this.isStreaming
			|| this.currentAlbumFolder !== this.lastAlbumFolder
			|| $('%album%') !== this.lastAlbumFolderTag
			|| $('$if2(%discnumber%,0)') !== this.lastAlbumDiscNumber
			|| $(`$if2(${grTF.vinyl_side},ZZ)`) !== this.lastAlbumVinylSide;

		if (fetchNewArtwork) {
			this.clearPlaylistNowPlayingBg();
			this.fetchNewArtwork(metadb);
			grm.bgImg.initBgImage(false, true);
			return;
		}

		const cycleNewArtwork =
			grSet.albumArtCycle && this.albumArtList.length > 1;

		if (cycleNewArtwork) {
			this.albumArtTimeout = setTimeout(() => {
				this.displayAlbumArtImage('next', true);
			}, grSet.albumArtCycleTime * 1000);
		}
	}

	/**
	 * Handles the case when the artwork (album art/disc art) is corrupt.
	 * @param {string} artType - The type of art to handle ('albumArt', 'discArt', 'both').
	 */
	handleArtworkError(artType) {
		const handleAlbumArt = () => {
			this.noArtwork = true;
			this.noAlbumArtStub = true;
			this.albumArtCorrupt = true;
			this.albumArtEmbedded = false;
			this.albumArt = null;
			this.albumArtSize = new ImageSize(0, this.topMenuHeight, 0, 0);
			this.setPausePosition();
			setTimeout(() => {
				const msg = grm.msg.getMessage('main', 'albumArtCorruptError');
				grm.msg.showPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			}, 1000);
		};

		const handleDiscArt = () => {
			grm.details.clearCache('discArt');
			setTimeout(() => {
				const msg = grm.msg.getMessage('main', 'discArtCorruptError');
				grm.msg.showPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			}, 1000);
		};

		if (artType === 'albumArt') {
			handleAlbumArt();
		} else if (artType === 'discArt') {
			handleDiscArt();
		} else if (artType === 'both') {
			handleAlbumArt();
			handleDiscArt();
		}
	}

	/**
	 * Resizes loaded album art/disc art and resets its position.
	 * Also resets the size and position of the pause button and lyrics.
	 * @param {boolean} resetDiscArtPosition - Whether the position of the disc art should be reset.
	 */
	resizeArtwork(resetDiscArtPosition) {
		DebugLog('Artwork => Resizing artwork');
		this.hasArtwork = false;
		this.resizeAlbumArt();
		grm.details.resizeDiscArt(resetDiscArtPosition);
		this.setPausePosition();
		grm.lyrics.setLyricsPosition();
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - ALBUM ART * //
	// #region MAIN - PUBLIC METHODS - ALBUM ART
	/**
	 * Checks if the current artwork in the album art list is a disc art image.
	 * @returns {boolean} - Returns `true` if the current album art matches the disc art pattern, otherwise `false`.
	 */
	checkAlbumArtFromListDiscArt() {
		const pattern = /(cd|disc|vinyl)([0-9]*|[a-h])\.(png|jpg)/i;
		const match = this.albumArtList[this.albumArtIndex].match(pattern);

		this.discArtImageDisplayed = Boolean(match);
		this.discArtImagePNG = match && match[3].toLowerCase() === 'png';

		return this.discArtImageDisplayed;
	}

	/**
	 * Creates cropped album art within max dimensions.
	 * @param {object} albumArt - The original album art with Width and Height.
	 * @param {number} maxWidth - The max width for the art.
	 * @param {number} maxHeight - The max height for the art.
	 * @returns {object} The cropped image and its scale factor.
	 */
	createCroppedAlbumArt(albumArt, maxWidth, maxHeight) {
		const widthScale = maxWidth / albumArt.Width;
		const heightScale = maxHeight / albumArt.Height;
		const scaledWidth = albumArt.Width * heightScale;
		const scaledHeight = albumArt.Height * widthScale;

		// * Fill the height and crop the width
		if (scaledWidth >= maxWidth) {
			const cropWidth = (scaledWidth - maxWidth) / 2;
			return {
				image: CropImage(albumArt, cropWidth, 0),
				scale: heightScale
			};
		}
		// * Fill the width and crop the height
		else if (scaledHeight >= maxHeight) {
			const cropHeight = scaledHeight - maxHeight;
			return {
				image: CropImage(albumArt, 0, cropHeight),
				scale: widthScale
			};
		}
		// * If no cropping is needed, return the original image and scale
		return {
			image: albumArt,
			scale: Math.min(widthScale, heightScale)
		};
	}

	/**
	 * Cycles through album artwork based on user scroll direction. The function updates the album artwork index
	 * to show previous or next artwork. Positive `step` values show previous art, negative values show next.
	 * @param {number} step - Indicates scroll direction and magnitude.
	 */
	cycleAlbumArtImage(step) {
		// Prev album art image
		if (step > 0) {
			if (this.albumArtIndex !== 0) {
				this.albumArtIndex = (this.albumArtIndex - 1) % this.albumArtList.length;
			}
		}
		// Next album art image
		else if (this.albumArtIndex !== this.albumArtList.length - 1) {
			this.albumArtIndex = (this.albumArtIndex + 1) % this.albumArtList.length;
		}
		this.loadAlbumArtFromList(this.albumArtIndex);
		this.checkAlbumArtFromListDiscArt();

		// Display embedded album art image
		if (grSet.loadEmbeddedAlbumArtFirst && this.albumArtIndex === 0) {
			this.albumArt = utils.GetAlbumArtV2(fb.GetNowPlaying());
			this.albumArtList.unshift(this.albumArt);
			this.albumArtIndex = 0;
		}

		// Update colors for dynamic themes
		if (['white', 'black', 'reborn', 'random'].includes(grSet.theme)) {
			this.newTrackFetchingArtwork = true;
			grm.color.getThemeColors(this.albumArt);
			this.initTheme();
			DebugLog('\n>>> initTheme => on_mouse_wheel <<<\n');
		}

		// Update positions
		this.resizeArtwork(true); // Re-adjust discArt shadow size if artwork size changes
		if (grSet.panelWidthAuto && this.albumArtSize.w !== this.albumArtSize.h) { // Re-adjust playlist if artwork size changes
			this.setPlaylistSize();
		}
		grm.details.clearCache('metrics');
		RepaintWindow();
	}

	/**
	 * Displays the previous or next album artwork image when cycling through the album art list.
	 * It can also cycle to the next image using a default 30-second interval or be triggered by the album art context menu.
	 * @param {string} direction - Indicates the direction of image cycling, can be either `prev` or `next`.
	 * @param {boolean} timer - If true, sets a timer to automatically cycle to the next image.
	 */
	displayAlbumArtImage(direction, timer) {
		DebugLog(`Album art => Repainting in displayAlbumArtImage: ${this.albumArtIndex}`);
		const increment = direction === 'next' ? 1 : (direction === 'prev' ? -1 : 0);
		this.albumArtIndex = (this.albumArtIndex + increment + this.albumArtList.length) % this.albumArtList.length;

		setTimeout(() => {
			this.loadAlbumArtFromList(this.albumArtIndex);
			this.checkAlbumArtFromListDiscArt();
			if (grSet.theme === 'reborn' || grSet.theme === 'random' || grSet.styleBlackAndWhiteReborn || grSet.styleBlackReborn) {
				this.newTrackFetchingArtwork = true;
				grm.color.getThemeColors(this.albumArt);
				this.initTheme();
				DebugLog('\n>>> initTheme => Album cover context menu => Display next/previous artwork <<<\n');
			}
			window.Repaint();
		}, 1);

		grm.details.clearCache('metrics');
		this.resizeArtwork(true); // Needed to readjust discArt shadow size if artwork size changes
		RepaintWindow();

		if (!timer) return;

		this.albumArtTimeout = setTimeout(() => {
			this.displayAlbumArtImage('next', true);
		}, grSet.albumArtCycleTime * 1000);

		grm.button.initButtonState();
	}

	/**
	 * Displays album art from the list of local files.
	 */
	displayAlbumArtFromList() {
		this.noArtwork = false;
		this.noAlbumArtStub = false;
		this.albumArtEmbedded = false;

		if (this.albumArtList.length > 1 && grSet.albumArtCycle) {
			this.albumArtTimeout = setTimeout(() => {
				this.displayAlbumArtImage('next', true);
			}, grSet.albumArtCycleTime * 1000);
		}

		this.albumArtIndex = 0;
		this.loadAlbumArtFromList(this.albumArtIndex); // Display first image
	}

	/**
	 * Displays embedded album art from the music file.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	displayAlbumArtEmbedded(metadb) {
		grm.details.discArtCover = grm.artCache.encache(utils.GetAlbumArtV2(metadb), this.albumArtList[metadb], 2);
		this.noArtwork = false;
		this.noAlbumArtStub = false;

		if (this.hasAutoRandomPresetMode()) {
			this.setRandomThemePreset();
		}
		else {
			if (this.hasThemeTags()) {
				this.initThemeTags();
			} else {
				this.restoreThemeState();
				grm.color.getThemeColors(this.albumArt);
			}
			if (this.loadingThemeComplete) {
				this.initTheme();  // Prevent incorrect theme brightness at startup/reload when using embedded art
				DebugLog('\n>>> initTheme => fetchAlbumArt => albumArtEmbedded <<<\n');
			}
		}

		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		this.albumArtEmbedded = true;
	}

	/**
	 * Displays the no album art stub when no album art is found.
	 */
	displayNoAlbumArtStub() {
		this.noArtwork = true;
		this.noAlbumArtStub = true;
		this.albumArt = null;
		grm.details.clearCache('discArt');
		this.initTheme();
		DebugLog('\n>>> initTheme => fetchAlbumArt => noAlbumArtStub <<<\n');
		DebugLog('Album art => Repainting on_playback_new_track due to no cover image');
		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		RepaintWindow();
	}

	/**
	 * Fetches album art when a new album is being played or when cycling through album artworks.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	fetchAlbumArt(metadb) {
		this.albumArtList = [];
		this.albumArtLoaded = false;

		const fetchAlbumArtProfiler = (this.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay) && fb.CreateProfiler('fetchAlbumArt');

		if (this.isStreaming || this.isPlayingCD) {
			this.fetchAlbumArtStreamingOrCD(metadb);
		} else {
			this.fetchAlbumArtLocalFiles(metadb);
		}

		if (fetchAlbumArtProfiler) fetchAlbumArtProfiler.Print();
		if (grCfg.settings.showDebugPerformanceOverlay) this.debugTimingsArray.push(`fetchAlbumArt: ${fetchAlbumArtProfiler.Time} ms`);
	}

	/**
	 * Fetches album art when streaming or playing a CD.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	fetchAlbumArtStreamingOrCD(metadb) {
		grm.details.discArt = grm.details.disposeDiscArt(grm.details.discArt);
		grm.details.discArtCover = grm.details.disposeDiscArt(grm.details.discArtCover);
		this.albumArt = utils.GetAlbumArtV2(metadb);

		grSet.showGridTitle_default = true;
		grSet.showGridTitle_artwork = true;

		if (this.albumArt) {
			this.albumArtLoaded = true;
			grm.color.getThemeColors(this.albumArt);
			this.resizeArtwork(true);
		} else {
			this.noArtwork = true;
			grm.details.discArtShadowImg = null;
		}

		this.initTheme();
		DebugLog('\n>>> initTheme => fetchAlbumArt => isStreaming || isPlayingCD <<<\n');
	}

	/**
	 * Fetches album art from local files.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	fetchAlbumArtLocalFiles(metadb) {
		this.albumArtList = this.getImagePathList('albumArt', metadb);

		if (this.albumArtList.length && !grSet.loadEmbeddedAlbumArtFirst) {
			this.displayAlbumArtFromList();
		}
		else if (metadb && (this.albumArt = utils.GetAlbumArtV2(metadb))) {
			this.displayAlbumArtEmbedded(metadb);
		}
		else {
			this.displayNoAlbumArtStub();
		}
	}

	/**
	 * Loads the album art image from the this.albumArtList array.
	 * @param {number} index - The index of this.albumArtList signifying which image to load.
	 */
	loadAlbumArtFromList(index) {
		const artIndex = this.albumArtList[index];
		const tempAlbumArt = grm.artCache && grm.artCache.getImage(artIndex);
		const tempDiscArtCover = grm.artCache && grm.artCache.getImage(artIndex, 2);
		this.albumArtLoaded = false;

		if (tempAlbumArt) {
			this.albumArt = tempAlbumArt;
			grm.details.discArtCover = tempDiscArtCover;
			this.albumArtCopy = this.albumArt;
			this.albumArtLoaded = true;
			this.initPanelWidthAuto(true);

			if (index !== 0 && !this.newTrackFetchingArtwork) return;
			this.newTrackFetchingArtwork = false;
			this.initThemeState(this.albumArt);
		}
		else {
			gdi.LoadImageAsyncV2(window.ID, artIndex).then(coverImage => {
				this.albumArtCorrupt = false;
				this.albumArt = grm.artCache.encache(coverImage, artIndex);
				grm.details.discArtCover = grm.artCache.encache(coverImage, artIndex, 2);

				if (this.newTrackFetchingArtwork) {
					const metadb = this.initMetadb();
					if (!this.albumArt && fb.IsPlaying && metadb) {
						this.albumArt = utils.GetAlbumArtV2(metadb);
						if (this.albumArt) {
							grm.details.discArtCover = grm.artCache.encache(this.albumArt, artIndex, 2);
							this.albumArtEmbedded = true;
						} else {
							this.handleArtworkError('albumArt');
						}
					}
					this.initThemeState(this.albumArt);
					this.newTrackFetchingArtwork = false;
				}

				this.albumArtCopy = this.albumArt;
				this.albumArtLoaded = true;
				this.resizeArtwork(true);
				this.initPanelWidthAuto();
				grm.details.clearCache('metrics');
				grm.details.setDiscArtRotation();
				RepaintWindow();
			});
		}

		if (!this.displayLibrarySplit()) this.resizeArtwork(false);
		grm.details.setDiscArtRotation();
	}

	/**
	 * Resizes and resets the size and position of the album art.
	 */
	resizeAlbumArt() {
		if (!this.albumArt || !this.albumArt.Width || !this.albumArt.Height) {
			this.setNoAlbumArtSize();
			return;
		}

		this.setAlbumArtScaleFactor();
		this.setAlbumArtSize();
		this.setAlbumArtPosition();
		this.setAlbumArtScaled();

		this.hasArtwork = true;
	}

	/**
	 * Set the scale factor for the album art based on the window size and layout settings.
	 */
	setAlbumArtScaleFactor() {
		const albumArtMaxHeight = this.wh - this.topMenuHeight - this.lowerBarHeight;
		const scaleFactor = this.displayPlaylist || this.displayLibrary ? 0.5 : 0.75;
		const defaultScale = Math.min(this.ww * scaleFactor / this.albumArt.Width, albumArtMaxHeight / this.albumArt.Height);
		const artworkScale = Math.min(this.ww / this.albumArt.Width, albumArtMaxHeight / this.albumArt.Height);
		this.albumArtScaleFactor = grSet.layout === 'artwork' ? artworkScale : defaultScale;
	}

	/**
	 * Set the size of the album art based on its scale, window state, and various layout settings.
	 */
	setAlbumArtSize() {
		const albumArtMaxWidth = this.ww * 0.5;
		const albumArtMaxHeight = this.wh - this.topMenuHeight - this.lowerBarHeight;

		const aspectRatioInBounds = !grSet.albumArtAspectRatioLimit ||
			(this.albumArt.Width  < this.albumArt.Height * grSet.albumArtAspectRatioLimit) &&
			(this.albumArt.Height < this.albumArt.Width  * grSet.albumArtAspectRatioLimit);
		const scaleWhenFullscreen = (UIHacks.FullScreen  || UIHacks.MainWindowState === WindowState.Maximized) &&
			aspectRatioInBounds && (this.displayPlaylist || this.displayLibrary);

		// * Album art lyrics layouts
		if (grSet.lyricsLayout !== 'normal' && this.displayLyrics) {
			const size = Math.round(albumArtMaxHeight - this.edgeMarginBoth);
			this.albumArtSize = { w: size, h: size };
			return;
		}
		// * Album art cropped
		if (grSet.albumArtScale === 'cropped' && scaleWhenFullscreen) {
			const { image, scale } = this.createCroppedAlbumArt(this.albumArt, albumArtMaxWidth, albumArtMaxHeight);
			this.albumArtCopy = image;
			this.albumArtScaleFactor = scale;
			this.albumArtSize = { w: Math.floor(image.Width * scale), h: Math.floor(image.Height * scale) };
			return;
		}
		// * Album art stretched
		if (grSet.albumArtScale === 'stretched' && scaleWhenFullscreen) {
			this.albumArtCopy = null;
			this.albumArtSize = { w: albumArtMaxWidth, h: albumArtMaxHeight };
			return;
		}
		// * Album art proportional
		this.albumArtCopy = null;
		this.albumArtSize = { w: Math.floor(this.albumArt.Width * this.albumArtScaleFactor), h: Math.floor(this.albumArt.Height * this.albumArtScaleFactor) };
	}

	/**
	 * Set the position of the album art based on the layout settings and window size.
	 */
	setAlbumArtPosition() {
		const albumArtLyricsLayoutNotNormal = this.displayLyrics && grSet.lyricsLayout !== 'normal';

		this.albumArtOffCenter = this.albumArtScaleFactor === (this.ww * 0.75 / this.albumArt.Width);

		// * Set album art centerX/centerY coordinate
		const albumArtCenterX =
			this.albumArtOffCenter ? Math.round(this.ww * 0.66 - this.edgeMargin) :
			(this.displayPlaylist || this.displayLibrary) ? grSet.layout === 'artwork' ? 0 : this.ww * 0.25 :
			this.ww * 0.5;

		const albumArtCenterY = Math.floor(((this.wh - this.lowerBarHeight + this.topMenuHeight) / 2) - this.albumArtSize.h / 2);

		// * Set album art x-coordinate
		const albumArtX = {
			left: Math.min(0, this.ww * 0.5 - this.albumArtSize.w),
			leftMargin: Math.min(this.ww / this.wh > 1.8 ? this.edgeMargin : 0, this.ww * 0.5 - this.albumArtSize.w),
			center: Math.min(albumArtCenterX - 0.5 * this.albumArtSize.w, this.ww * 0.5 - this.albumArtSize.w),
			right: this.ww * 0.5 - this.albumArtSize.w,
			lyricsLayoutLeft: this.edgeMargin,
			lyricsLayoutRight: this.ww - this.albumArtSize.w - this.edgeMargin,
			centerDefault: Math.round(albumArtCenterX - 0.5 * this.albumArtSize.w),
			centerArtwork: Math.round(!this.displayPlaylist || this.displayLyrics ? this.ww * 0.5 - this.albumArtSize.w * 0.5 : this.ww)
		};

		const albumArtLayoutX = {
			default:
				this.displayPlaylist || this.displayLibrary ? Math.round(albumArtX[grSet.albumArtAlign]) :
				albumArtLyricsLayoutNotNormal ? ['full', 'left'].includes(grSet.lyricsLayout) ? albumArtX.lyricsLayoutLeft : albumArtX.lyricsLayoutRight :
				albumArtX.centerDefault,
			artwork: albumArtX.centerArtwork
		};

		this.albumArtSize.x = albumArtLayoutX[grSet.layout];

		// * Set album art y-coordinate
		const albumArtMaxHeight = this.wh - this.topMenuHeight - this.lowerBarHeight;
		const restrictedWidth = this.albumArtScaleFactor !== (albumArtMaxHeight) / this.albumArt.Height;
		this.albumArtSize.y = albumArtLyricsLayoutNotNormal ? this.topMenuHeight + this.edgeMargin :
			restrictedWidth ? Math.min(albumArtCenterY, SCALE(150) + 10) : this.topMenuHeight;
	}

	/**
	 * Scales album art to a global size, handling potential errors.
	 * @throws Logs an error if the scaling operation fails.
	 */
	setAlbumArtScaled() {
		if (this.albumArtScaled) this.albumArtScaled = null;

		try {
			// * Avoid weird anti-aliased scaling along border of images, see: https://stackoverflow.com/questions/4772273/interpolationmode-highqualitybicubic-introducing-artefacts-on-edge-of-resized-im
			this.albumArtCorrupt = false;
			this.albumArtScaled = this.albumArt.Resize(this.albumArtSize.w, this.albumArtSize.h, InterpolationMode.Bicubic); // Old method -> this.albumArtScaled = this.albumArt.Resize(this.albumArtSize.w, this.albumArtSize.h);
			const sg = this.albumArtScaled.GetGraphics();
			const HQscaled = this.albumArt.Resize(this.albumArtSize.w, this.albumArtSize.h, InterpolationMode.HighQualityBicubic);
			sg.DrawImage(HQscaled, 2, 2, this.albumArtScaled.Width - 4, this.albumArtScaled.Height - 4, 2, 2, this.albumArtScaled.Width - 4, this.albumArtScaled.Height - 4);
			this.albumArtScaled.ReleaseGraphics(sg);
		} catch (e) {
			this.handleArtworkError('albumArt');
		}
	}

	/**
	 * Sets the size and position when noAlbumArtStub is being displayed.
	 */
	setNoAlbumArtSize() {
		const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

		this.albumArtSize.x =
			grSet.layout === 'default' &&  this.displayCustomThemeMenu && this.displayDetails ? this.ww * 0.3 :
			grSet.layout === 'default' && !this.displayCustomThemeMenu && this.displayDetails ||
			grSet.layout === 'artwork' &&  this.displayPlaylist ? this.ww :
			grSet.panelWidthAuto ?
				grSet.albumArtAlign === 'left' ? 0 :
				grSet.albumArtAlign === 'leftMargin' ? this.ww / this.wh > 1.8 ? this.edgeMargin : 0 :
				grSet.albumArtAlign === 'center' ? Math.floor(this.ww * 0.25 - noAlbumArtSize * 0.5) :
				Math.floor(this.ww * 0.5 - noAlbumArtSize) :
			0;

		this.albumArtSize.y = this.topMenuHeight;

		this.albumArtSize.w =
			grSet.panelWidthAuto && this.noAlbumArtStub ? !fb.IsPlaying && !grSet.panelBrowseMode && !this.displayCustomThemeMenu ? 0 : noAlbumArtSize :
			this.ww * 0.5;

		this.albumArtSize.h = noAlbumArtSize;
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - TOOLTIP * //
	// #region MAIN - PUBLIC METHODS - TOOLTIP
	/**
	 * Gets the lower bar tooltip string based on the specified layout.
	 * @param {string} layout - The layout type ('default', 'artwork_compact').
	 * @returns {string} The tooltip string.
	 */
	getLowerBarTooltip(layout) {
		const tooltipLayoutType = {
			default: `${grStr.artistLower}\n${grStr.tracknum === '' ? '' : `${grStr.tracknum} `}${grStr.titleLower}`,
			artwork_compact: `${grStr.artistLower}\n${grStr.tracknum} ${grStr.titleLower}`
		};
		return tooltipLayoutType[layout];
	}

	/**
	 * Handles the lower bar artist/tite tooltip. If a tooltip is ready, it displays and then clears it.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleLowerBarTooltip(x, y) {
		const artistOverflow = this.lowerBarArtistW > this.lowerBarAvailableW;
		const titleOverflow = this.lowerBarTitleW > this.lowerBarAvailableW;
		const twoLinesOverflow = grSet.showLowerBarArtist_layout && grSet.showLowerBarTitle_layout && this.lowerBarTwoLines;

		const showTooltip_default = grSet.layout === 'default' &&
			(grSet.showLowerBarArtist_layout && artistOverflow || grSet.showLowerBarTitle_layout && titleOverflow);

		const showTooltip_artwork_compact = grSet.layout !== 'default' &&
			(grSet.showLowerBarArtist_layout && artistOverflow || grSet.showLowerBarTitle_layout && titleOverflow || twoLinesOverflow);

		const tooltip = showTooltip_default ? this.getLowerBarTooltip('default') :
				showTooltip_artwork_compact ? this.getLowerBarTooltip('artwork_compact') : '';

		if (tooltip.length) { // * Display tooltip
			const offset = SCALE(30);
			this.lowerBarTooltipText = tooltip;
			grm.ttip.showDelayed(this.lowerBarTooltipText);
			this.repaintStyledTooltips(this.styledToolTipX - offset * 2, this.styledToolTipY - offset, this.styledToolTipW + offset * 4, this.styledToolTipH + offset * 2);
		} else { // * Clear tooltip
			this.lowerBarTooltipText = '';
			grm.ttip.stop();
			window.Repaint();
		}
	}
	// #endregion

	// * PLAYLIST - PUBLIC METHODS - INITIALIZATION * //
	// #region PLAYLIST PUBLIC METHODS - INITIALIZATION
	/**
	 * Clears current used color of header and row nowplaying bg to prevent flashing from old used primary color.
	 */
	clearPlaylistNowPlayingBg() {
		if (['white', 'black', 'reborn', 'random'].includes(grSet.theme)) {
			pl.col.header_nowplaying_bg = '';
			pl.col.row_nowplaying_bg = '';
		}
	}

	/**
	 * Initializes the Playlist.
	 */
	initPlaylist() {
		pl.call = new PlaylistCallbacks();
		pl.playlist.initialize();
	}

	/**
	 * Initializes the Playlist state and active Playlist layout presets.
	 */
	initPlaylistLayoutState() {
		grSet.savedPlaylistLayoutFull = grSet.playlistLayout === 'full';

		if (this.displayBiography && grSet.playlistLayout === 'full') {
			this.displayPlaylist = true;
			this.displayLibrary = false;
			this.displayBiography = false;
		}

		if (this.displayLyrics) this.displayLyrics = false;
		if (this.displayCustomThemeMenu) this.initCustomThemeMenuState();

		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		this.setPlaylistSize();
		grm.bgImg.initBgImage(false, true);
		grm.jSearch.on_size();
		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Sets the Playlist size and position.
	 */
	setPlaylistSize() {
		pl.call.on_size(this.ww, this.wh);
	}

	/**
	 * Updates the Playlist when content has changed, e.g when adding/removing items or changing the active playlist.
	 */
	updatePlaylist() {
		Debounce((playlistIndex) => {
			this.traceCall && console.log('initPlaylistDebounced');
			pl.call.on_playlist_items_added(playlistIndex);
		}, 100, {
			leading: false,
			trailing: true
		})(plman.ActivePlaylist);
	}
	// #endregion

	// * PLAYLIST - PUBLIC METHODS - CONTROLS * //
	// #region PLAYLIST PUBLIC METHODS - CONTROLS
	/**
	 * Sorts the Playlist by sort patterns defined in the config file.
	 */
	setPlaylistSortOrder() {
		const sortOrder = {
			default: grCfg.settings.playlistSortDefault,
			artistDate_asc: grCfg.settings.playlistSortArtistDate_asc,
			artistDate_dsc: grCfg.settings.playlistSortArtistDate_dsc,
			artistRating_asc: grCfg.settings.playlistSortArtistRating_asc,
			artistRating_dsc: grCfg.settings.playlistSortArtistRating_dsc,
			artistPlaycount_asc: grCfg.settings.playlistSortArtistPlaycount_asc,
			artistPlaycount_dsc: grCfg.settings.playlistSortArtistPlaycount_dsc,
			albumTitle: grCfg.settings.playlistSortAlbumTitle,
			albumRating_asc: grCfg.settings.playlistSortAlbumRating_asc,
			albumRating_dsc: grCfg.settings.playlistSortAlbumRating_dsc,
			albumPlaycount_asc: grCfg.settings.playlistSortAlbumPlaycount_asc,
			albumPlaycount_dsc: grCfg.settings.playlistSortAlbumPlaycount_dsc,
			trackTitle: grCfg.settings.playlistSortTrackTitle,
			trackNumber: grCfg.settings.playlistSortTrackNumber,
			trackRating_asc: grCfg.settings.playlistSortTrackRating_asc,
			trackRating_dsc: grCfg.settings.playlistSortTrackRating_dsc,
			trackPlaycount_asc: grCfg.settings.playlistSortTrackPlaycount_asc,
			trackPlaycount_dsc: grCfg.settings.playlistSortTrackPlaycount_dsc,
			year_asc: grCfg.settings.playlistSortYear_asc,
			year_dsc: grCfg.settings.playlistSortYear_dsc,
			genre_asc: grCfg.settings.playlistSortGenre,
			genre_dsc: grCfg.settings.playlistSortGenre,
			label_asc: grCfg.settings.playlistSortLabel,
			label_dsc: grCfg.settings.playlistSortLabel,
			country_asc: grCfg.settings.playlistSortCountry,
			country_dsc: grCfg.settings.playlistSortCountry,
			filePath: grCfg.settings.playlistSortFilePath,
			custom: grCfg.settings.playlistSortCustom
		};

		if (['genre_dsc', 'label_dsc', 'country_dsc'].includes(grSet.playlistSortOrder)) {
			plman.SortByFormatV2(plman.ActivePlaylist, sortOrder[grSet.playlistSortOrder], -1);
		} else {
			plman.SortByFormat(plman.ActivePlaylist, sortOrder[grSet.playlistSortOrder] || '');
		}
	}
	// #endregion

	// * LIBRARY - PUBLIC METHODS - INITIALIZATION * //
	// #region LIBRARY - PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes the Library.
	 */
	initLibraryPanel() {
		lib.ui = new LibUserInterface();
		lib.panel = new LibPanel();
		lib.sbar = new LibScrollbar();
		lib.vk = new LibVkeys();
		lib.lib = new LibLibrary();
		lib.pop = new LibPopulate();
		lib.search = new LibSearch();
		lib.find = new LibFind();
		lib.but = new LibButtons();
		lib.popUpBox = new LibPopUpBox();
		lib.men = new LibMenuItems();
		lib.timer = new LibTimers();
		lib.call = new LibCallbacks();
	}

	/**
	 * Initializes active Library layout presets.
	 */
	initLibraryLayout() {
		const libraryLayoutSplitPresets =
			grSet.libraryLayoutSplitPreset || grSet.libraryLayoutSplitPreset2 || grSet.libraryLayoutSplitPreset3 || grSet.libraryLayoutSplitPreset4;

		const setLibraryView = () => {
			lib.lib.logTree();
			lib.pop.clearTree();
			lib.ui.getFont(); // * Reset font size when grSet.libraryLayoutSplitPreset4 was used
			RepaintWindowRectAreas();

			if (grSet.libraryLayout !== 'split' && (!grSet.libraryLayoutFullPreset || !libraryLayoutSplitPresets)) {
				libSet.albumArtShow = grSet.savedLibraryAlbumArtShow;
				libSet.albumArtLabelType = grSet.savedLibraryAlbumArtLabelType;
			}

			setTimeout(() => {
				lib.panel.imgView = grSet.libraryLayout === 'normal' && grSet.libraryLayoutFullPreset ? libSet.albumArtShow = false : libSet.albumArtShow;
				lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
			}, 1);
		};

		// * Full layout preset
		if (grSet.libraryLayout === 'full' && grSet.libraryLayoutFullPreset) {
			grSet.libraryDesign = 'reborn';
			grSet.libraryThumbnailSize = grSet.savedLibraryThumbnailSize;
			if (grm.display.checkPlayerSize(this.ww, this.wh, 'default', 'HD') === 'small' && (grSet.libraryThumbnailSize === 'auto' || libSet.thumbNailSize === 'auto')) {
				libSet.thumbNailSize = 1;
			}
			libSet.albumArtLabelType = 1;
			libSet.albumArtFlowMode = false;
			lib.panel.imgView = libSet.albumArtShow = true;
		}
		// * Split layout with active split layout presets
		else if (grSet.libraryLayout === 'split' && libraryLayoutSplitPresets) {
			if (grSet.layout !== 'default') return;

			if (grSet.libraryLayoutSplitPreset) {
				grSet.libraryDesign = 'reborn';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = false;
				libSet.albumArtLabelType = 1;
				plSet.show_header = true;
			}
			else if (grSet.libraryLayoutSplitPreset2) {
				grSet.libraryDesign = 'reborn';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = false;
				libSet.albumArtLabelType = 1;
				plSet.show_header = this.displayPlaylist && !this.displayLibrary && grSet.libraryLayout === 'split';
				this.updatePlaylist();
			}
			else if (grSet.libraryLayoutSplitPreset3) {
				grSet.libraryDesign = 'reborn';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = true;
				libSet.albumArtLabelType = 1;
				plSet.show_header = true;
			}
			else if (grSet.libraryLayoutSplitPreset4) {
				grSet.libraryDesign = 'coversLabelsRight';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = true;
				libSet.albumArtLabelType = 2;
				plSet.show_header = true;
			}

			this.setPlaylistSize();
		}
		// * Normal layout with active split layout presets
		else if (grSet.libraryLayout === 'normal' && libraryLayoutSplitPresets) {
			grSet.libraryThumbnailSize = grSet.savedLibraryThumbnailSize;
		}

		setLibraryView();
		this.setLibrarySize();
	}

	/**
	 * Initializes the Library state and active Library layout presets.
	 */
	initLibraryLayoutState() {
		grSet.savedLibraryLayoutFull = grSet.libraryLayout === 'full';
		this.displayPlaylist = grSet.libraryLayout === 'split';

		if (!this.displayLibrary) {
			this.displayDetails = false;
			this.displayLibrary = true;
			this.displayBiography = false;
		}

		if (this.displayLyrics && ['full', 'split'].includes(grSet.libraryLayout)) {
			this.displayLyrics = false;
		} else if (grSet.savedLyricsDisplayed && grSet.libraryLayout === 'normal') {
			this.displayLyrics = true;
		}

		this.handlePanelLayout('playlist', 'initLayout');
		if (this.displayCustomThemeMenu) this.initCustomThemeMenuState();

		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		this.initLibraryLayout();
		grm.bgImg.initBgImage(false, true);
		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Sets the Library design.
	 */
	setLibraryDesign() {
		const libraryDesign = {
			traditional: 0,
			modern: 1,
			ultraModern: 2,
			clean: 3,
			facet: 4,
			coversLabelsRight: 5,
			coversLabelsBottom: 6,
			coversLabelsBlend: 7,
			artistLabelsRight: 8,
			flowMode: 11,
			reborn: 12
		};

		const quickSetupValue = libraryDesign[grSet.libraryDesign];
		lib.panel.set('quickSetup', quickSetupValue);

		if (grSet.libraryDesign === 'flowMode') {
			grSet.libraryLayout = 'full';
		}
	}

	/**
	 * Sets the Library layout split presets.
	 * @param {boolean} libraryLayoutSplitPreset - Whether the Library layout split preset should be set.
	 */
	setLibrarySplitPreset(libraryLayoutSplitPreset) {
		grSet.libraryLayoutSplitPreset  = false;
		grSet.libraryLayoutSplitPreset2 = false;
		grSet.libraryLayoutSplitPreset3 = false;
		grSet.libraryLayoutSplitPreset4 = false;
		if (libraryLayoutSplitPreset) grSet[libraryLayoutSplitPreset] = true;

		// * Reset to default settings when deactivating Library layout split presets
		if (!grSet.libraryLayoutSplitPreset  && !grSet.libraryLayoutSplitPreset2 &&
			!grSet.libraryLayoutSplitPreset3 && !grSet.libraryLayoutSplitPreset4) {
			plSet.show_header = true;
			pl.playlist.header_expand();
		}

		this.initLibraryLayout();
		this.initPlaylist();
		this.setPlaylistSize();
	}

	/**
	 * Sets the Library size and position.
	 */
	setLibrarySize() {
		const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

		const x =
			grSet.layout === 'artwork' || grSet.libraryLayout !== 'normal' ? 0 :
			grSet.panelWidthAuto ? this.displayLibrarySplit() || !fb.IsPlaying && !grSet.panelBrowseMode ? 0 : this.noAlbumArtStub ? noAlbumArtSize : this.albumArtSize.x + this.albumArtSize.w :
			this.ww * 0.5;

		const y = this.topMenuHeight;

		const libraryWidth =
			grSet.layout === 'artwork' || grSet.libraryLayout === 'full' ? this.ww :
			grSet.panelWidthAuto ? this.displayLibrarySplit() ? noAlbumArtSize : !fb.IsPlaying && !grSet.panelBrowseMode ? this.ww : this.ww - (this.noAlbumArtStub ? noAlbumArtSize : this.albumArtSize.x + this.albumArtSize.w) :
			this.ww * 0.5;

		const libraryHeight = Math.max(0, this.wh - this.lowerBarHeight - y);

		lib.call.on_size(x, y, libraryWidth, libraryHeight);
	}
	// #endregion

	// * LIBRARY - PUBLIC METHODS - CONTROLS * //
	// #region LIBRARY - PUBLIC METHODS - CONTROLS
	/**
	 * Handles the Playlist header collapse when the Library layout split presets are enabled.
	 */
	handleLibrarySplitCollapse() {
		if (plSet.auto_collapse || !plSet.show_header
			&& !grSet.libraryLayoutSplitPreset
			&& !grSet.libraryLayoutSplitPreset3
			&& !grSet.libraryLayoutSplitPreset4) {
			return;
		}

		grSet.savedPlaylistHeaderCollapse = this.displayLibrarySplit();

		if (grSet.savedPlaylistHeaderCollapse) {
			pl.playlist.collapse_handler.collapse_all();
		} else if (!grSet.savedPlaylistHeaderCollapse) {
			pl.playlist.collapse_handler.expand_all();
		}
	}

	/**
	 * Drags and drops items from Library to Playlist in split layout.
	 */
	librarySplitDragDrop() {
		const handleList = lib.pop.getHandleList('newItems');
		lib.pop.sortIfNeeded(handleList);
		fb.DoDragDrop(0, handleList, handleList.Count ? 1 | 4 : 0);

		if (plman.IsPlaylistLocked(plman.ActivePlaylist) || !pl.playlist.selection_handler.last_hover_row) {
			return; // Do nothing, it's locked, an auto-playlist or no pl selection
		}

		plman.ClearPlaylistSelection(plman.ActivePlaylist);

		const dropIndex = pl.playlist.selection_handler.last_hover_row.idx;

		setTimeout(() => {
			plman.RemovePlaylistSelection(plman.ActivePlaylist);
			plman.InsertPlaylistItems(plman.ActivePlaylist, dropIndex, handleList);
			plman.SetPlaylistFocusItem(plman.ActivePlaylist, dropIndex);
		}, 1);
	}
	// #endregion

	// * LIBRARY - PUBLIC METHODS - ALBUM ART * //
	// #region LIBRARY - PUBLIC METHODS - ALBUM ART
	/**
	 * Dynamically resizes Library album cover thumbnails based on the player size.
	 */
	autoThumbnailSize() {
		if (grSet.libraryThumbnailSize !== 'auto') return;

		// * Thumbnail sizes
		const MINI = 0;
		const SMALL = 1;
		const REGULAR = 2;
		const MEDIUM = 3;
		const LARGE = 4;
		const XL = 5;
		const ARTWORK_DEFAULT_LAYOUT = grSet.layout === 'artwork' ? SMALL : REGULAR;

		// * Layouts
		const noStd = ['coversLabelsRight', 'artistLabelsRight'].includes(grSet.libraryDesign) || libSet.albumArtLabelType === 2;
		const fullW = grSet.libraryLayout === 'full' && grSet.layout === 'default';

		/**
		 * Sets the library thumbnail size and vertical padding based on resolution.
		 * @param {number} noStd_fullWidth - The thumbnail size for no standard library layout while in full width.
		 * @param {number} noStd_noFullWidth - The thumbnail size for no standard library layout not in full width.
		 * @param {number} fullWidth - The thumbnail size for standard library layout while in full width.
		 * @param {number} normalWidth - The thumbnail size for standard library layout in normal width.
		 * @param {number} verticalPadding - The noStd full width.
		 */
		const setThumbnailMetrics = (noStd_fullWidth, noStd_noFullWidth, fullWidth, normalWidth, verticalPadding) => {
			libSet.thumbNailSize = noStd && fullW ? noStd_fullWidth : noStd && !fullW ? noStd_noFullWidth : fullW ? fullWidth : normalWidth;
			libSet.verticalAlbumArtPad = verticalPadding;
		}

		if (!RES._4K && !RES._QHD) {
			if (grSet.layout === 'default' && this.ww < 1600 && this.wh < 960 || grSet.layout === 'artwork' && this.ww < 700 && this.wh < 860) {
				setThumbnailMetrics(SMALL, MINI, ARTWORK_DEFAULT_LAYOUT, ARTWORK_DEFAULT_LAYOUT, 2);
			}
			if (grSet.layout === 'default' && this.ww >= 1600 && this.wh >= 960 || grSet.layout === 'artwork' && this.ww >= 700 && this.wh >= 860) {
				setThumbnailMetrics(REGULAR, SMALL, MEDIUM, MEDIUM, 2);
			}
			if (grSet.layout === 'default' && this.ww >= 1802 && this.wh >= 1061 || grSet.layout === 'artwork' && this.ww >= 901 && this.wh >= 1062) {
				setThumbnailMetrics(MEDIUM, REGULAR, (this.ww === 1802 && this.wh === 1061 ? 5 : 4), MEDIUM, 2);
			}
		}
		else if (RES._QHD) {
			if (grSet.layout === 'default' && this.ww < 1802 && this.wh < 1061 || grSet.layout === 'artwork' && this.ww < 901 && this.wh < 1061) {
				setThumbnailMetrics(SMALL, MINI, ARTWORK_DEFAULT_LAYOUT, ARTWORK_DEFAULT_LAYOUT, 2);
			}
			if (grSet.layout === 'default' && this.ww >= 1802 && this.wh >= 1061 || grSet.layout === 'artwork' && this.ww >= 901 && this.wh >= 1061) {
				setThumbnailMetrics(SMALL, SMALL, LARGE, REGULAR, 3);
			}
			if (grSet.layout === 'default' && this.ww >= 2280 && this.wh >= 1300 || grSet.layout === 'artwork' && this.ww >= 1140 && this.wh >= 1300) {
				setThumbnailMetrics(MEDIUM, REGULAR, XL, MEDIUM, fullW ? 2 : 3);
			}
		}
		else if (RES._4K) {
			if (grSet.layout === 'default' && this.ww < 2800 && this.wh < 1720 || grSet.layout === 'artwork' && this.ww < 1400 && this.wh < 1720) {
				setThumbnailMetrics(SMALL, MINI, REGULAR, SMALL, 2);
			}
			if (grSet.layout === 'default' && this.ww >= 2800 && this.wh >= 1720 || grSet.layout === 'artwork' && this.ww >= 1400 && this.wh >= 1720) {
				setThumbnailMetrics(SMALL, SMALL, MEDIUM, SMALL, 3);
			}
			if (grSet.layout === 'default' && this.ww >= 3400 && this.wh >= 2020 || grSet.layout === 'artwork' && this.ww >= 1400 && this.wh >= 1720) {
				setThumbnailMetrics(MEDIUM, SMALL, LARGE, REGULAR, 2);
			}
		}
	}
	// #endregion

	// * BIOGRAPHY - PUBLIC METHODS - INITIALIZATION * //
	// #region BIOGRAPHY - PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes the Biography.
	 */
	initBiographyPanel() {
		bio.ui = new BioUserInterface();
		bio.vk = new BioVkeys();
		bio.panel = new BioPanel();
		bio.name = new BioNames();
		bio.alb_scrollbar = new BioScrollbar();
		bio.art_scrollbar = new BioScrollbar();
		bio.art_scroller = new BioScrollbar();
		bio.cov_scroller = new BioScrollbar();
		bio.but = new BioButtons();
		bio.popUpBox = new BioPopUpBox();
		bio.txt = new BioText();
		bio.tag = new BioTagger();
		bio.resize = new BioResizeHandler();
		bio.lib = new BioLibrary();
		bio.img = new BioImages();
		bio.seeker = new BioSeeker();
		bio.filmStrip = new BioFilmStrip();
		bio.timer = new BioTimers();
		bio.men = new BioMenuItems();
		bio.server = new BioServer();
		bio.infobox = new BioInfobox();
		bio.lyrics = new BioLyrics();
		bio.call = new BioCallbacks();
	}

	/**
	 * Initializes active Biography layout presets.
	 */
	initBiographyLayout() {
		if (grSet.biographyLayoutFullPreset) {
			bioSet.style = grSet.biographyLayoutFullPreset && grSet.layout === 'default' && grSet.biographyLayout === 'full' ? 3 : 0;
			bioSet.showFilmStrip = false;
			bioSet.filmStripPos = 3;
		}
		RepaintWindowRectAreas();
		this.setBiographySize();
	}

	/**
	 * Initializes the Biography state and active Biography layout presets.
	 */
	initBiographyLayoutState() {
		grSet.savedBiographyLayoutFull = grSet.biographyLayout === 'full';

		const biographyFull = this.displayBiography && grSet.biographyLayout === 'full';
		this.displayPlaylist = grSet.layout === 'default' && (biographyFull ? !this.displayBiography : true);

		if (!this.displayBiography) {
			this.displayDetails = false;
			this.displayLibrary = false;
			this.displayBiography = true;
		}

		if (this.displayPlaylist) this.setPlaylistSize();
		if (this.displayCustomThemeMenu) this.initCustomThemeMenuState();

		this.initPanelWidthAuto(true);
		this.initBiographyLayout();
		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Sets the Biography display layout.
	 */
	setBiographyDisplay() {
		if (grSet.biographyDisplay === 'Image+text') {
			bioSet.img_only = false;
			bioSet.text_only = false;
		} else if (grSet.biographyDisplay === 'Image') {
			bioSet.img_only = true;
			bioSet.text_only = false;
		} else if (grSet.biographyDisplay === 'Text') {
			bioSet.img_only = false;
			bioSet.text_only = true;
		}
	}

	/**
	 * Sets the Biography size and position.
	 */
	setBiographySize() {
		const x = 0;
		const y = this.topMenuHeight;

		const biographyWidth =
			grSet.layout === 'artwork' || grSet.biographyLayout === 'full' ? this.ww :
			grSet.panelWidthAuto ? (!this.albumArt && !this.noAlbumArtStub || !fb.IsPlaying && !grSet.panelBrowseMode) ? this.ww : this.albumArtSize.x + this.albumArtSize.w :
			this.ww * 0.5;

		const biographyHeight = Math.max(0, this.wh - this.lowerBarHeight - y);

		bio.call.on_size(x, y, biographyWidth, biographyHeight);
	}
	// #endregion

	// * LYRICS - PUBLIC METHODS - INITIALIZATION * //
	// #region LYRICS - PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes the Lyrics display state.
	 * @param {string} state - The lyrics display state to initialize, can be one of the following values:
	 * - `startup`
	 * - `newTrack`
	 * - `stopTrack`
	 * - `contextMenu`
	 */
	initLyricsDisplayState(state) {
		if (state !== 'contextMenu') {
			if (grSet.lyricsRememberPanelState) {
				this.initLyricsRememberedState();
			}
			if (this.displayLyrics) {
				if (state === 'startup') {
					this.initLyricsStartup();
				}
				else if (state === 'newTrack') {
					this.initLyricsNewTrack();
				}
				else if (state === 'stopTrack') {
					this.initLyricsStopTrack();
				}
			}
		}
		else if (state === 'contextMenu') {
			this.initLyricsContextMenu();
		}
		this.handlePanelLayout('playlist', 'initLayout');
	}

	/**
	 * Initializes the lyrics display on foobar startup.
	 * Used when the remembered `Lyrics` panel state is restored or when the startup panel is set to `Lyrics`.
	 */
	initLyricsStartup() {
		if (this.displayBiography || grSet.layout === 'artwork' && (this.displayPlaylistArtwork || this.displayDetails || this.displayLibrary)) {
			this.displayLyrics = false;
			return;
		}
		else if (!fb.IsPlaying) {
			fb.Play(); fb.Pause();
		}

		this.displayPlaylist = grSet.layout === 'default' && grSet.lyricsLayout === 'normal' && ['playlist', 'lyrics'].includes(grSet.showPanelOnStartup);
		this.displayDetails = grSet.showPanelOnStartup === 'details';
		this.displayLyrics = true;

		this.handlePanelLayout('lyrics', 'initLayout');

		setTimeout(() => {
			grm.lyrics.initLyrics();
			grm.button.initButtonState();
		}, 1);
	}

	/**
	 * Initializes the lyrics display when a new track is played.
	 */
	initLyricsNewTrack() {
		if (grSet.lyricsLayout !== 'normal') {
			this.displayPlaylist = false;
			this.resizeArtwork(true);
		}
		setTimeout(() => {
			grm.lyrics.initLyrics();
			grm.button.initButtonState();
		}, 1);
	}

	/**
	 * Initializes the lyrics display when a track stops.
	 */
	initLyricsStopTrack() {
		if (fb.IsPlaying) return;

		this.displayPlaylist = grSet.lyricsLayout !== 'full';
		this.displayLyrics = grSet.showPanelOnStartup === 'lyrics';

		this.setPlaylistSize();
		this.resizeArtwork(true);
		grm.button.initButtonState();
	}

	/**
	 * Initializes the lyrics display when the context menu is used to toggle the lyrics panel.
	 */
	initLyricsContextMenu() {
		this.displayLyrics = !this.displayLyrics;
		grSet.savedLyricsDisplayed = this.displayLyrics && grSet.lyricsRememberPanelState;

		if (this.displayLyrics && grSet.lyricsLayout !== 'normal' || this.displayPlaylist && grSet.layout === 'artwork' || this.displayLibrary) {
			this.displayPlaylist = false;
			this.displayDetails = false;
		}
		else if (!this.displayLyrics && grSet.lyricsLayout !== 'normal' || this.noAlbumArtStub) {
			this.displayPlaylist = grSet.layout === 'default';
		}

		if (this.displayCustomThemeMenu) this.initCustomThemeMenuState();
		else if (this.displayMetadataGridMenu) grm.details.initGridMenuState();

		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		this.setPlaylistSize();
		grm.lyrics.initLyrics();
		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Initializes the Lyrics layout state.
	 */
	initLyricsLayoutState() {
		grSet.savedLyricsLayoutFull = grSet.lyricsLayout !== 'normal';
		this.displayPlaylist = grSet.lyricsLayout === 'normal';

		if (this.displayDetails && this.displayLyrics && grSet.lyricsLayout !== 'normal') {
			this.displayDetails = false;
			this.displayPlaylist = false;
		}

		if (this.displayCustomThemeMenu) this.initCustomThemeMenuState();
		else if (this.displayMetadataGridMenu) grm.details.initGridMenuState();

		this.resizeArtwork(true);
		this.initPanelWidthAuto();
		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Initializes the remembered lyrics state based on various conditions.
	 */
	initLyricsRememberedState() {
		this.displayLyrics =
			grSet.layout === 'compact' || this.displayLibrary && grSet.libraryLayout !== 'normal' || this.displayBiography ? false :
			grSet.showPanelOnStartup === 'lyrics' ? true :
			grSet.savedLyricsDisplayed;
	}
	// #endregion
}
