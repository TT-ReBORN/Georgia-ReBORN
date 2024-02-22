/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Main                                     * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    22-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * MAIN USER INTERFACE * //
/////////////////////////////
/**
 * A class that is responsible for drawing all main user interface parts.
 */
class MainUI {
	constructor() {
		// * GEOMETRY * //
		// #region GEOMETRY
		/** @public @type {number} The global window.Width. */
		this.ww = 0;
		/** @public @type {number} The global window.Height. */
		this.wh = 0;
		/** @public @type {number} The width and height of the pause button. */
		this.pauseSize = SCALE(100);
		/** @public @type {number} The size of the disc art shadow. */
		this.discArtShadow = SCALE(6);
		/** @private @type {number} The top position of the metadata grid. */
		this.gridTop = 0;
		/** @public @type {number} The height of the metadata grid tooltip area. */
		this.gridTooltipHeight = SCALE(100);
		/** @public @type {number} The height of the timeline. */
		this.timelineHeight = SCALE(8);
		/** @public @type {number} The height of the top menu. */
		this.topMenuHeight = SCALE(40);
		/** @public @type {number} The height of the song title and time + progress bar area. */
		this.lowerBarHeight = SCALE(120);
		/** @private @type {number} The width of time string in the lower bar. */
		this.lowerBarTimeW = 0;
		/** @private @type {number} The height of time string in the lower bar. */
		this.lowerBarTimeH = 0;
		/** @private @type {number} The x-position of the time string in the lower bar. */
		this.lowerBarTimeX = 0;
		/** @private @type {number} The y-position of the time string in the lower bar. */
		this.lowerBarTimeY = 0;
		/** @private @type {number} The y-position of the progress bar in the lower bar. */
		this.progressBarY = 0;
		/** @public @type {number} The height of the progress bar. */
		this.progressBarH = SCALE(12);
		/** @private @type {number} The y-position of the peakmeter bar in the lower bar. */
		this.peakmeterBarY = 0;
		/** @public @type {number} The height of the peakmeter bar. */
		this.peakmeterBarH = SCALE(26);
		/** @private @type {number} The y-position of the waveform bar in the lower bar. */
		this.waveformBarY = 0;
		/** @public @type {number} The height of the waveform bar. */
		this.waveformBarH = SCALE(26);
		// #endregion

		// * CONTROLS *//
		// #region CONTROLS
		/** @public @type {boolean} The top menu and contextual menu state, is it open ( active ) or not. */
		this.activeMenu = false;
		/** @public @type {object} The theme button object. */
		this.btn = {};
		/** @public @type {GdiGraphics[]} The theme button images array. */
		this.btnImg = [];
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
		/** @public @type {string} The tooltip text handler for styled tooltip. */
		this.styledTooltipText = '';
		/** @public @type {boolean} The draw state of styled tooltip. */
		this.styledTooltipReady = false;
		/** @public @type {FbTooltip} The tooltip object. */
		this.ttip = null;
		// #endregion

		// * IMAGES * //
		// #region IMAGES
		/** @public @type {GdiBitmap} The big album art image displayed on the left side. */
		this.albumArt = null;
		/** @private @type {GdiBitmap} The copy of the original album art image, used for cropping. */
		this.albumArtCopy = null;
		/** @public @type {GdiBitmap[]} The album art list array containing album and disc art images. */
		this.albumArtList = [];
		/** @public @type {number} The index of currently displayed album art if more than 1. */
		this.albumArtIndex = 0;
		/** @public @type {object} The album art position (big image). */
		this.albumArtSize = new ImageSize(0, 0, 0, 0);
		/** @public @type {GdiBitmap} The pre-scaled album art to speed up drawing considerably. */
		this.albumArtScaled = null;
		/** @public @type {boolean} The state when album art is corrupt and can not be loaded. */
		this.albumArtCorrupt = false;
		/** @public @type {boolean} The state when artwork displayed is embedded and not loaded from a file. */
		this.albumArtEmbedded = false;
		/** @private @type {boolean} The off-center position of the album art, if true, it will shift 40 pixels to the right. */
		this.albumArtOffCenter = false;
		/** @private @type {boolean} The state to always load art from cache unless this is set. */
		this.albumArtFromCache = true;
		/** @private @type {boolean} The state when album art or disc art has artwork loaded. */
		this.hasArtwork = false;
		/** @public @type {boolean} The no album art stub when no album cover was found. */
		this.noAlbumArtStub = false;
		/** @public @type {GdiBitmap} The disc art image used in Details. */
		this.discArt = null;
		/** @public @type {GdiBitmap} The disc art album cover image used in Details. */
		this.discArtCover = null;
		/** @public @type {GdiBitmap[]} The array of disc art images used in Details. */
		this.discArtArray = [];
		/** @public @type {GdiBitmap[]} The array of disc art album cover images used in Details. */
		this.discArtArrayCover = [];
		/** @private @type {boolean} The state when disc art was found on hard drive used in Details. */
		this.discArtFound = false;
		/** @public @type {object} The disc art position used in Details (offset from albumArtSize). */
		this.discArtSize = new ImageSize(0, 0, 0, 0);
		/** @public @type {GdiBitmap} The rotated disc art from the RotateImg helper used in Details. */
		this.discArtRotation = null;
		/** @public @type {GdiBitmap} The rotated disc art album cover from the RotateImg helper used in Details. */
		this.discArtRotationCover = null;
		/** @public @type {number} The global index of current discArtArray img to draw used in Details. */
		this.discArtRotationIndex = 0;
		/** @public @type {number} The global index of current discArtArrayCover img to draw used in Details. */
		this.discArtRotationIndexCover = 0;
		/** @public @type {GdiBitmap[]} The array of record label images used in Details. */
		this.recordLabels = [];
		/** @public @type {GdiBitmap[]} The array of inverted record label images used in Details. */
		this.recordLabelsInverted = [];
		/** @public @type {GdiBitmap} The band logo image used in Details. */
		this.bandLogo = null;
		/** @public @type {GdiBitmap} The inverted band logo image shown in Details. */
		this.bandLogoInverted = null;
		/** @public @type {GdiBitmap[]} The array of flag images shown in Details and in the lower bar. */
		this.flagImgs = [];
		/** @private @type {GdiBitmap} The release country flag image shown in the metadata grid in Details. */
		this.releaseFlagImg = null;
		/** @private @type {GdiBitmap} The codec logo image shown in the metadata grid in Details. */
		this.codecLogo = null;
		/** @private @type {GdiBitmap} The channel logo image shown in the metadata grid in Details. */
		this.channelLogo = null;
		/** @private @type {GdiBitmap} The Hi-Res Audio badge logo image shown on album art when enabled. */
		this.hiResAudioLogo = null;
		/** @public @type {boolean} The last.fm logo image displayed when we %lastfm_play_count% > 0, shown in the metadata grid in Details. */
		this.playCountVerifiedByLastFm = false;
		/** @private @type {GdiBitmap} The shadow behind labels used in Details. */
		this.labelShadowImg = null;
		/** @private @type {GdiBitmap} The shadow behind the artwork + disc art used in Details. */
		this.shadowImg = null;
		// #endregion

		// * STATE * //
		// #region STATE
		/** @public @type {number} The left edge of the record labels in Details. Saved so we don't have to recalculate every on every on_paint unless size has changed. */
		this.lastLeftEdge = 0;
		/** @private @type {number} The last label height of the record labels in Details. Saved so we don't have to recalculate every on every on_paint unless size has changed. */
		this.lastLabelHeight = 0;
		/** @private @type {number} The first played ratio used on the timeline in Details. */
		this.timelineFirstPlayedRatio = 0;
		/** @private @type {number} The last played ratio used on the timeline in Details. */
		this.timelineLastPlayedRatio = 0;
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
		/** @public @type {string} Displays the active playlist of the current playing track in the metadata grid in Details. */
		this.playingPlaylist = '';
		/** @public @type {number} Saves last playback order. */
		this.lastPlaybackOrder = 0;
		/** @public @type {boolean} Saves active full width lyrics layout via grSet.lyricsLayout. */
		this.lyricsLayoutFullWidth = false;
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
		/** @public @type {boolean} When no artwork, don't set themeColor every redraw. */
		this.themeColorSet = false;
		/** @public @type {boolean} The state to override condition in getRandomThemeColor() when using "Generate new color" from context menu. */
		this.getRandomThemeColorContextMenu = false;
		/** @public @type {boolean} Only use default theme when noArtwork was found. */
		this.noArtwork = false;
		/** @public @type {boolean} Only load theme colors when newTrackFetchingArtwork = true. */
		this.newTrackFetchingArtwork = false;
		/** @public @type {boolean} The state when new album art / disc art loaded and other things finished, used for smoother Playlist auto-scrolling. */
		this.newTrackFetchingDone = false;
		/** @public @type {boolean} The state when Library should not call window.Reload() from panel.set() -> panel.load(), i.e when saving theme settings or restoring theme backup. */
		this.libraryCanReload = true;
		/** @public @type {boolean} The state if grMain.ui.initTheme() needs to be fully executed to save performance. */
		this.initThemeFull = false;
		/** @private @type {boolean} The state to skip most grMain.ui.initTheme() and get grMain.color.getThemeColors(grMain.ui.albumArt), mostly used for theme presets to prevent double inits. */
		this.initThemeSkip = false;
		/** @private @type {boolean} The state when the theme is loading on startup or reload. */
		this.loadingTheme = false;
		/** @public @type {boolean} The state when the theme has completely loaded, used for pseudo delay background logo mask on startup or reload. */
		this.loadingThemeComplete = false;
		// #endregion

		// * TIMERS * //
		// #region TIMERS
		/** @public @type {number} The setTimeout ID for cycling album art. */
		this.albumArtTimeout = null;
		/** @public @type {number} The timer when disc art spins while song is playing. */
		this.discArtRotationTimer = null;
		/** @public @type {number} The timer interval for the biography auto-download. */
		this.autoDownloadBioTimer = null;
		/** @public @type {number} The timer interval for the lyrics auto-download. */
		this.autoDownloadLyricsTimer = null;
		/** @public @type {number} The setTimeout ID for hiding cursor. */
		this.hideCursorTimeout = null;
		/** @public @type {number} The timer of progress bar. */
		this.progressBarTimer = null;
		/** @public @type {number} The timer interval between progress bar updates. */
		this.progressBarTimerInterval = null;
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
		this.showExtraDrawTiming = false;
		/** @public @type {boolean} Spams the console with debug timing. */
		this.showDebugTiming = false;
		/** @public @type {boolean} Spams the console with memory statistic. */
		this.showRamUsage = false;
		/** @public @type {boolean} Draws all window.RepaintRect as red outlines in the theme. */
		this.drawRepaintRects = false;
		/** @public @type {boolean} Spams the console with panel trace call. */
		this.showPanelTraceCall = false;
		/** @public @type {boolean} Spams the console with panel trace on move. */
		this.showPanelTraceOnMove = false;
		/** @public @type {boolean} Spams the console with playlist list performance. */
		this.showPlaylistTraceListPerf = false;
		// #endregion
	}

	// * MAIN - PUBLIC METHODS - DRAW * //
	// #region MAIN - PUBLIC METHODS - DRAW
	/**
	 * Draws all main user interface parts in the correct order.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawMain(gr) {
		const drawTimingStart = (this.showDrawTiming || this.showExtraDrawTiming) && new Date();

		this.drawBackgrounds(gr);

		// * UIHacks aero glass shadow frame fix, needed for style Blend in Details
		if (UIHacks.Aero.Effect === 2) gr.DrawLine(0, 0, this.ww, 0, 1, grCol.bg);

		this.drawDetailsBlend(gr);
		this.drawPanels(gr);
		this.drawAlbumArt(gr);
		this.drawNoAlbumArt(gr)
		this.drawHiResAudioLogo(gr);
		this.drawPauseBtn(gr);
		this.drawJumpSearch(gr);
		this.drawDetailsMetadataGrid(gr);
		this.drawDetailsBandLogo(gr);
		this.drawDetailsLabelLogo(gr);
		this.drawLyrics(gr);
		this.drawStyles(gr);
		this.drawThemeNotification(gr);
		this.drawPanelShadows(gr);
		this.drawTopMenuBar(gr);
		this.drawLowerBar(gr);
		this.drawCustomThemeMenu(gr);
		this.drawMetadataGridMenu(gr);
		this.drawStyledTooltips(gr);
		this.drawStartupBackground(gr);

		// * UIHacks aero glass shadow frame fix
		if (UIHacks.Aero.Effect === 2 && (!this.loadingThemeComplete && (grSet.styleBlend || grSet.styleBlend2)) || !grSet.styleBlend && !grSet.styleBlend2) {
			gr.DrawLine(0, 0, this.ww, 0, 1, !this.loadingThemeComplete ? grCol.loadingThemeBg : grCol.uiHacksFrame);
			if (grSet.styleDefault) gr.DrawLine(this.ww, this.wh - 1, 0, this.wh - 1, 1, !this.loadingThemeComplete ? grCol.loadingThemeBg : grCol.uiHacksFrame);
			else if (grSet.styleGradient || grSet.styleGradient2) {
				gr.DrawLine(0, 0, this.ww, 0, 1, grCol.bg);
				gr.FillGradRect(-0.5, 0, this.ww, 1, grSet.styleGradient2 ? -200 : 0, grSet.styleGradient2 ? 0 : grCol.styleGradient, grSet.styleGradient2 ? grCol.styleGradient2 : 0, 0.5);
			}
		}

		this.drawDebugThemeOverlay(gr);
		this.drawDebugTiming(drawTimingStart);
		this.drawDebugRectAreas(gr);
		this.repaintRectCount = 0;
	}

	/**
	 * Draws the Main and Details background.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBackgrounds(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		gr.SetSmoothingMode(SmoothingMode.None);

		// * MAIN BACKGROUND * //
		if (!this.albumArt && this.noArtwork) { // We use noArtwork to prevent flashing of blue default theme
			this.initNoAlbumArtSize();

			if (!this.themeColorSet) {
				grm.color.setThemeColors();
				this.themeColorSet = true;
			}
		}
		gr.FillSolidRect(0, 0, this.ww, this.wh, grCol.bg);

		// * ALBUM ART BACKGROUND * //
		if (grSet.albumArtBg !== 'none' && !this.displayDetails) {
			gr.FillSolidRect(0, this.albumArtSize.y, grSet.albumArtBg === 'full' || grSet.layout === 'artwork' ? this.ww : this.albumArtSize.x, this.albumArtSize.h, grCol.detailsBg);
		}

		// * DETAILS BACKGROUND * //
		if (fb.IsPlaying && this.displayDetails || this.displayLyrics && grSet.lyricsLayout === 'full') {
			if (this.isStreaming && this.noArtwork || !this.albumArt && this.noArtwork || this.displayLyrics && grSet.lyricsLayout === 'full') {
				gr.FillSolidRect(0, this.topMenuHeight, this.ww, this.wh - this.topMenuHeight - this.lowerBarHeight, grCol.detailsBg);
			} else {
				gr.FillSolidRect(0, this.albumArtSize.y, grSet.noDiscArtBg && !this.discArt ? this.ww : this.albumArtSize.x, this.albumArtSize.h, grCol.detailsBg);
			}
		}

		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}

	/**
	 * Draws the style Blend in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetailsBlend(gr) {
		if (grSet.styleBlend && this.albumArt && grCol.imgBlended && this.displayDetails) {
			gr.DrawImage(grCol.imgBlended, 0, 0, this.ww, this.wh, 0, 0, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}
	}

	/**
	 * Draws the Playlist, Library and Biography panels.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPanels(gr) {
		if (grSet.layout === 'default' || grSet.layout === 'artwork') {
			if (this.displayLibrary) {
				const drawLibraryProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> library');
				lib.call.on_paint(gr);
				if (drawLibraryProfiler) drawLibraryProfiler.Print();
			}
			if (grSet.layout === 'default' && this.displayPlaylist || grSet.layout === 'artwork' && this.displayPlaylistArtwork || this.displayLibrarySplit()) {
				const drawPlaylistProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> playlist');
				pl.call.on_paint(gr);
				if (drawPlaylistProfiler) drawPlaylistProfiler.Print();
			}
			if (this.displayBiography) {
				const drawBiographyProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> biography');
				bio.call.on_paint(gr);
				if (drawBiographyProfiler) drawBiographyProfiler.Print();
			}
		}
		else if (grSet.layout === 'compact' && this.displayPlaylist) {
			const drawPlaylistProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> playlist');
			pl.call.on_paint(gr);
			if (drawPlaylistProfiler) drawPlaylistProfiler.Print();
		}
	}

	/**
	 * Draws the big album art on the left side.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawAlbumArt(gr) {
		const displayAlbumArt =
			grSet.layout === 'default' && (grSet.playlistLayout !== 'full' && this.displayPlaylist && !this.displayBiography
			|| grSet.libraryLayout === 'normal' && this.displayLibrary || this.displayLyrics)
			|| !this.displayPlaylist && !this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography;

		if (!fb.IsPlaying || !displayAlbumArt || this.displayLibrarySplit()) return;

		const drawAlbumArtProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> album art');

		// * BIG ALBUM ART - NEEDS TO BE DRAWN AFTER ALL BLENDING IS DONE, I.E AFTER PLAYLIST * //
		if (!this.noAlbumArtStub) {
			if (this.displayDetails && grSet.displayDiscArt && this.discArt && !this.discArtRotation) {
				this.createDiscArtRotation();
			}
			if (this.displayDetails && grSet.displayDiscArt && this.albumArt && (this.albumArtScaled || this.discArtRotation) && this.discArt) {
				this.shadowImg && gr.DrawImage(this.shadowImg, -this.discArtShadow, this.albumArtSize.y - this.discArtShadow, this.shadowImg.Width, this.shadowImg.Height, 0, 0, this.shadowImg.Width, this.shadowImg.Height);
			}
			if (this.albumArt && this.albumArtScaled) {
				if (!grSet.discArtOnTop || this.displayLyrics) {
					if (this.discArtRotation) {
						this.drawDiscArt(gr);
					}
					if (this.displayDetails && this.discArtRotation && grSet.detailsAlbumArtDiscAreaOpacity !== 255) { // Do not use opacity if image is a booklet, i.e this.albumArtSize.w > this.ww * 0.66
						this.createDiscArtAlbumArtMask(gr, this.albumArtSize.x, this.albumArtSize.y, this.albumArtSize.w, this.albumArtSize.h, 0, 0, this.albumArtScaled.Width, this.albumArtScaled.Height, 0, this.displayDetails && !this.displayLyrics && this.albumArtSize.w < this.ww * 0.66 ? grSet.detailsAlbumArtDiscAreaOpacity : 255);
					} else {
						gr.DrawImage(this.albumArtScaled, this.albumArtSize.x, this.albumArtSize.y, this.albumArtSize.w, this.albumArtSize.h, 0, 0, this.albumArtScaled.Width, this.albumArtScaled.Height, 0, this.displayDetails && !this.displayLyrics && this.albumArtSize.w < this.ww * 0.66 ? grSet.detailsAlbumArtOpacity : 255);
					}
				} else { // Draw discArt on top of front cover
					gr.DrawImage(this.albumArtScaled, this.albumArtSize.x, this.albumArtSize.y, this.albumArtSize.w, this.albumArtSize.h, 0, 0, this.albumArtScaled.Width, this.albumArtScaled.Height);
					if (this.discArtRotation) {
						this.drawDiscArt(gr);
					}
				}
			}
		}

		if (drawAlbumArtProfiler) drawAlbumArtProfiler.Print();
	}

	/**
	 * Draws the no album art stub when no album cover exists.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawNoAlbumArt(gr) {
		const noAlbumArtLayoutDefault =
			grSet.layout === 'default' && !this.displayLibrarySplit() && (this.displayPlaylist && grSet.playlistLayout !== 'full' && !this.displayBiography || this.displayLibrary && grSet.libraryLayout === 'normal');

		const noAlbumArtLayoutArtwork =
			grSet.layout === 'artwork' && !this.displayPlaylist && !this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography;

		if (!this.albumArt && this.noArtwork && fb.IsPlaying) {
			if (noAlbumArtLayoutDefault || noAlbumArtLayoutArtwork) {
				// * Clear previous artwork related stuff
				this.noAlbumArtStub = true;
				this.albumArt = null;
				this.discArt = null;
				this.discArtCover = null;
				this.discArtArray = [];
				this.discArtArrayCover = [];

				const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

				const bgWidth =
					grSet.lyricsLayout === 'full' && this.displayLyrics || grSet.layout === 'artwork' ? this.ww :
					grSet.panelWidthAuto ? noAlbumArtSize :
					this.ww * 0.5;

				const bgHeight = noAlbumArtSize;

				const noteWidth =
					grSet.layout === 'artwork' ? this.ww :
					grSet.panelWidthAuto ? noAlbumArtSize :
					this.ww * 0.5;

				const noteHeight = noAlbumArtSize + grFont.noAlbumArtStub.Height * 0.5 - SCALE(14);

				// * Stub background
				gr.FillSolidRect(0, this.topMenuHeight, this.albumArtSize.x, bgHeight, !grSet.albumArtBg ? pl.col.bg : grCol.bg);
				gr.FillSolidRect(this.albumArtSize.x, this.topMenuHeight, bgWidth, bgHeight, pl.col.bg);
				if (!this.displayLyrics) {
					gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
					gr.DrawString('\uf001', grFont.noAlbumArtStub, grCol.noAlbumArtStub, this.albumArtSize.x, 0, noteWidth, noteHeight, StringFormat(1, 1));
				}
			}
		}
		else if (grSet.panelWidthAuto && !fb.IsPlaying) {
			this.noAlbumArtStub = true; // * Needed on_playback_stop when noAlbumArtStub was playing to reposition all panels correctly
		}
		else {
			this.noAlbumArtStub = false;
		}
	}

	/**
	 * Draws the disc art in Details.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDiscArt(gr) {
		if (grSet.layout !== 'default' || !grSet.displayDiscArt || !this.displayDetails ||
			this.discArtSize.y < this.albumArtSize.y || this.discArtSize.h > this.albumArtSize.h) {
			return;
		}

		const drawDiscArtProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> disc art');
		const discArtImg = this.discArtArray[this.discArtRotationIndex] || this.discArtRotation;
		gr.DrawImage(discArtImg, this.discArtSize.x, this.discArtSize.y, this.discArtSize.w, this.discArtSize.h, 0, 0, discArtImg.Width, discArtImg.Height, 0);

		if (['cdAlbumCover', 'vinylAlbumCover'].includes(grSet.discArtStub) && this.discArtCover && !this.discArtFound && (!grSet.noDiscArtStub || grSet.showDiscArtStub)) {
			const discArtImgCover = this.discArtArrayCover[this.discArtRotationIndexCover] || this.discArtRotationCover;
			gr.DrawImage(discArtImgCover, this.discArtSize.x, this.discArtSize.y, this.discArtSize.w, this.discArtSize.h, 0, 0, discArtImg.Width, discArtImg.Height, 0);
		}

		if (drawDiscArtProfiler) drawDiscArtProfiler.Print();
	}

	/**
	 * Draws the Hi-Res Audio logo on album art.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawHiResAudioLogo(gr) {
		const trackIsHiRes =
			(Number($('$info(bitspersample)', fb.GetNowPlaying())) > 16 || Number($('$info(bitrate)', fb.GetNowPlaying())) > 1411);

		const displayHiResAudioLogo =
			trackIsHiRes && grSet.showHiResAudioBadge && grSet.layout !== 'compact' &&
			(this.displayPlaylist && !this.displayPlaylistArtwork && !this.displayLibrarySplit() && !this.displayBiography && (grSet.playlistLayout === 'normal' || this.displayLyrics) ||
			!this.displayPlaylist && !this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography ||
			this.displayLibrary && grSet.libraryLayout === 'normal' && grSet.layout === 'default');

		if (!displayHiResAudioLogo) return;

		this.hiResAudioLogo = gdi.Image(grPath.hiResAudioLogoPath());

		const x =
			grSet.hiResAudioBadgePos === 'topleft' ? this.albumArtSize.x + SCALE(20) :
			grSet.hiResAudioBadgePos === 'topright' ? this.albumArtSize.x + this.albumArtSize.w - this.hiResAudioLogo.Width - SCALE(20) :
			grSet.hiResAudioBadgePos === 'bottomleft' ? this.albumArtSize.x + SCALE(40) :
			grSet.hiResAudioBadgePos === 'bottomright' ? this.albumArtSize.x + this.albumArtSize.w - this.hiResAudioLogo.Width - SCALE(40) : '';

		const y =
			grSet.hiResAudioBadgePos === 'topleft' || grSet.hiResAudioBadgePos === 'topright' ? this.albumArtSize.y + SCALE(20) :
			this.albumArtSize.y + this.albumArtSize.h - this.hiResAudioLogo.Height - SCALE(40);

		gr.DrawImage(this.hiResAudioLogo, x, y, this.hiResAudioLogo.Width, this.hiResAudioLogo.Height, 0, 0, this.hiResAudioLogo.Width, this.hiResAudioLogo.Height);
	}

	/**
	 * Draws the pause button centered on album art.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPauseBtn(gr) {
		if (this.loadingThemeComplete && grSet.showPause && fb.IsPaused && !this.presetIndicatorTimer && !this.doubleClicked
			&&
			(grSet.layout === 'default' && (this.displayPlaylist && grSet.playlistLayout !== 'full' && !this.displayLibrary && !this.displayBiography ||
			this.displayLibrary && grSet.libraryLayout === 'normal' && !this.displayPlaylist || this.displayDetails)
			||
			grSet.layout === 'artwork' && !this.displayPlaylist && !this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography)) {
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
	 * Draws the metadata grid on the left side in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetailsMetadataGrid(gr) {
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

		if (!fb.IsPlaying || !this.displayDetails || grSet.lyricsLayout === 'full' && this.displayLyrics) return;

		const drawMetadataGridProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> metadata grid');

		const gridArtistFontSize   = grSet[`gridArtistFontSize_${grSet.layout}`];
		const showGridArtist       = grSet[`showGridArtist_${grSet.layout}`];
		const showGridTrackNum     = grSet[`showGridTrackNum_${grSet.layout}`];
		const showGridTitle        = grSet[`showGridTitle_${grSet.layout}`];
		const showGridTimeline     = grSet[`showGridTimeline_${grSet.layout}`];
		const showGridArtistFlags  = grSet[`showGridArtistFlags_${grSet.layout}`];
		const showGridReleaseFlags = grSet[`showGridReleaseFlags_${grSet.layout}`];
		const showGridChannelLogo  = grSet[`showGridChannelLogo_${grSet.layout}`];
		const showGridCodecLogo    = grSet[`showGridCodecLogo_${grSet.layout}`];

		const marginLeft = SCALE(grSet.layout !== 'default' ? 20 : 40);
		const marginRight = SCALE(20);
		const textWidth = Math.round((!this.albumArt && this.discArt ? this.discArtSize.x : this.albumArtSize.x) - this.discArtShadow - marginLeft - marginRight);
		this.gridTop = this.albumArtSize.y ? this.albumArtSize.y + marginLeft : this.topMenuHeight + marginLeft;

		// * DETAILS METADATA GRID * //
		if (textWidth > 150) {
			let txtRec;
			let gridArtistTxtRec;
			let gridTitleTxtRec;
			let gridAlbumTxtRec;

			const drawArtist = (top) => {
				if (!grStr.artist) return 0;

				const flagSizeWhiteSpaceTable = {
					24: [35, 29, 24, 18, 12, 6],
					22: [36, 30, 25, 19, 12, 6],
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

				const flagSizeWhiteSpace = ' '.repeat(
					flagSizeWhiteSpaceTable[gridArtistFontSize][
						this.flagImgs.length >=  6 ? 0 :
						this.flagImgs.length === 5 ? 1 :
						this.flagImgs.length === 4 ? 2 :
						this.flagImgs.length === 3 ? 3 :
						this.flagImgs.length === 2 ? 4 :
						5
					]
				);

				const flagSize =
					this.flagImgs.length >=  6 ? SCALE(84 + gridArtistFontSize * 6) :
					this.flagImgs.length === 5 ? SCALE(70 + gridArtistFontSize * 5) :
					this.flagImgs.length === 4 ? SCALE(56 + gridArtistFontSize * 4) :
					this.flagImgs.length === 3 ? SCALE(42 + gridArtistFontSize * 3) :
					this.flagImgs.length === 2 ? SCALE(28 + gridArtistFontSize * 2) :
					this.flagImgs.length === 1 ? SCALE(14 + gridArtistFontSize) : '';

				gridArtistTxtRec = gr.MeasureString(grStr.artist, grFont.gridArtist, 0, 0, showGridArtistFlags && this.flagImgs.length ? textWidth - flagSize : textWidth, this.wh);
				const gridArtistNumLines  = Math.min(2, gridArtistTxtRec.Lines);
				const gridArtistNumHeight = gr.CalcTextHeight(grStr.artist, grFont.gridArtist) * gridArtistNumLines + 3;
				const gridArtistHeight    = gr.CalcTextHeight(grStr.artist, grFont.gridArtist);

				// * Apply better anti-aliasing on smaller font sizes in HD res
				gr.SetTextRenderingHint(!RES._4K && gridArtistFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
				DrawString(gr, showGridArtistFlags && this.flagImgs.length ? flagSizeWhiteSpace + grStr.artist : grStr.artist, grFont.gridArtist, ['white', 'black', 'reborn', 'random'].includes(grSet.theme) ? grCol.detailsText : grSet.theme === 'cream' ? pl.col.header_artist_normal : pl.col.header_artist_playing, marginLeft, Math.round(top), textWidth, gridArtistNumHeight, Stringformat.trim_ellipsis_char);

				// * Artist flags
				if (grStr.artist && this.flagImgs.length && showGridArtistFlags && this.displayDetails) {
					const maxFlags = Math.min(this.flagImgs.length, 6);
					let flagsLeft = marginLeft;
					for (let i = 0; i < maxFlags; i++) {
						gr.DrawImage(this.flagImgs[i], flagsLeft, Math.round(top - (this.flagImgs[i].Height / (gridArtistHeight + SCALE(2))) - (RES._4K ? 1 : 0)), this.flagImgs[i].Width + SCALE(gridArtistFontSize) - SCALE(26), gridArtistHeight + SCALE(2), 0, 0, this.flagImgs[i].Width, this.flagImgs[i].Height);
						flagsLeft += this.flagImgs[i].Width + SCALE(gridArtistFontSize) - SCALE(18);
					}
				}

				return gridArtistNumHeight + (RES._4K ? 17 : 9);
			};

			this.gridTop -= SCALE(2);

			const drawTitle = (top) => {
				if (!grStr.title) return 0;
				gridTitleTxtRec = gr.MeasureString(this.isStreaming ? showGridTrackNum ? grStr.tracknum + grStr.title : grStr.title : grStr.tracknum === '' ? grStr.title : showGridTrackNum ? `${grStr.tracknum}\xa0${grStr.title}` : grStr.title, grFont.gridTitle, 0, 0, textWidth, this.wh);
				const gridTitleNumLines = Math.min(2, gridTitleTxtRec.Lines);
				const gridTitleNumHeight = gr.CalcTextHeight(grStr.title, grFont.gridTitle) * gridTitleNumLines + 3;
				const gridTitleFontSize = grSet[`gridTitleFontSize_${grSet.layout}`];

				// * Apply better anti-aliasing on smaller font sizes in HD res
				gr.SetTextRenderingHint(!RES._4K && gridTitleFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
				DrawString(gr, this.isStreaming ? showGridTrackNum ? grStr.tracknum + grStr.title : grStr.title : grStr.tracknum === '' ? grStr.title : showGridTrackNum ? `${grStr.tracknum}\xa0${grStr.title}` : grStr.title, grFont.gridTitle, grCol.detailsText, marginLeft, Math.round(top), textWidth, gridTitleNumHeight, Stringformat.trim_ellipsis_char);

				return gridTitleNumHeight + (RES._4K ? 17 : 9);
			};

			this.gridTop -= SCALE(2);

			const drawAlbumTitle = (top, maxLines) => {
				if (!grStr.album) return 0;
				gridAlbumTxtRec = gr.MeasureString(grStr.album, grFont.gridAlbum, 0, 0, textWidth, this.wh);
				const gridAlbumNumLines = Math.min(showGridArtist || showGridTitle ? 2 : 3, gridAlbumTxtRec.Lines);
				const gridAlbumNumHeight = gr.CalcTextHeight(grStr.album, grFont.gridAlbum) * gridAlbumNumLines + 3;
				const gridAlbumFontSize = grSet[`gridAlbumFontSize_${grSet.layout}`];

				// * Apply better anti-aliasing on smaller font sizes in HD res
				gr.SetTextRenderingHint(!RES._4K && gridAlbumFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
				DrawString(gr, grStr.album, grFont.gridAlbum, grCol.detailsText, marginLeft, Math.round(top), textWidth, gridAlbumNumHeight, Stringformat.trim_ellipsis_char);

				return gridAlbumNumHeight + SCALE(13);
			};

			if (showGridArtist) {
				this.gridTop += drawArtist(this.gridTop);
			}
			if (showGridTitle) {
				this.gridTop += drawTitle(this.gridTop);
			} else if (!showGridArtist) {
				this.gridTop += drawAlbumTitle(this.gridTop, 3);
			}
			// * Timeline
			if (showGridTimeline && grm.timeline && fb.IsPlaying) {
				grm.timeline.setSize(marginLeft, this.gridTop + SCALE(4), this.albumArtSize.x - marginLeft * 2);
				grm.timeline.draw(gr);
			}
			// * Tooltip
			if (grm.gridTip && fb.IsPlaying) {
				grm.gridTip.setSize(marginLeft, this.topMenuHeight, this.albumArtSize.x - marginLeft * 2);
				grm.gridTip.draw(gr);
			}
			if (showGridTimeline) {
				this.gridTop += this.timelineHeight + SCALE(20);
			}
			if (showGridArtist || showGridTitle) {
				this.gridTop += drawAlbumTitle(this.gridTop, 2);
			}

			// * Tags
			const font_array = [grFont.gridKey];
			const key_font_array = [grFont.gridVal];
			let grid_key_ft = grFont.gridKey;
			for (const el of grStr.grid) {
				if (font_array.length > 1) { // Only check if there's more than one entry in font_array
					grid_key_ft = ChooseFontForWidth(gr, textWidth / 3, el, font_array);
					while (grid_key_ft !== font_array[0]) { // If font returned was first item in the array, then everything fits, otherwise pare down array
						font_array.shift();
						key_font_array.shift();
					}
				}
			}
			const grid_val_ft = key_font_array.shift();
			const col1Width = CalcGridMaxTextWidth(gr, grStr.grid, grid_key_ft);
			const columnMargin = SCALE(10);
			const col2Width = textWidth - columnMargin - col1Width + SCALE(5);
			const col2Left = marginLeft + col1Width + columnMargin;

			for (let k = 0; k < grStr.grid.length; k++) {
				let key = grStr.grid[k].label;
				let value = grStr.grid[k].val;
				let showLastFmImage = false;
				let showReleaseFlagImage = false;
				let showGridCodecLogoImage = false;
				let showGridChannelLogoImage = false;
				let dropShadow = false;
				let grid_val_col = grCol.detailsText;

				if (value.length) {
					switch (key) {
						case 'Catalog':
						case 'Rel. Country':
							showReleaseFlagImage = showGridReleaseFlags;
							break;

						case 'Codec': {
							const codec = $('$lower($if2(%codec%,$ext(%path%)))');
							if (['dts', 'dca (dts coherent acoustics)'].includes(codec)) {
								value = 'DCA'; // * Show only DCA abbreviation if codec is DTS
							}
							showGridCodecLogoImage = showGridCodecLogo;
							break;
						}

						case 'Channels': {
							const channels = $('%channels%');
							const logoType = grSet[`showGridChannelLogo_${grSet.layout}`];
							const textLogo = logoType === 'textlogo';
							const noLogo = logoType === false;
							const ChannelString = (number, string) => {
								if (textLogo) return string;
								if (noLogo) return `${number} \u00B7 ${string}`;
							};
							const channelLogoMapping = {
								'mono':   ChannelString(1, 'Mono'),
								'stereo': ChannelString(2, 'Stereo'),
								'3ch':    ChannelString(3, 'Center'),
								'4ch':    ChannelString(4, 'Quad'),
								'5ch':    ChannelString(5, 'Surround'),
								'6ch':    ChannelString(6, 'Surround'),
								'7ch':    ChannelString(7, 'Surround'),
								'8ch':    ChannelString(8, 'Surround'),
								'10ch':   ChannelString(10, 'Surround'),
								'12ch':   ChannelString(12, 'Surround')
							};
							// * Remap foobar's org. channel strings
							if (Object.prototype.hasOwnProperty.call(channelLogoMapping, channels)) {
								value = channelLogoMapping[channels];
							}
							showGridChannelLogoImage = showGridChannelLogo;
							break;
						}

						case 'Hotness':
							grid_val_col = grCol.detailsHotness;
							dropShadow = true;
							break;

						case 'Play Count':
							showLastFmImage = true;
							break;

						case 'Rating':
							grid_val_col = grCol.detailsRating;
							dropShadow = true;
							break;

						default: {
							let matchCount = 0;
							const smallHDRes  = grSet.displayRes === 'HD'  && (this.ww < 1250 || this.wh < 800);
							const smallQHDRes = grSet.displayRes === 'QHD' && (this.ww < 1350 || this.wh < 900);
							const small4KRes  = grSet.displayRes === '4K'  && (this.ww < 2350 || this.wh < 1550);
							const basicMeta = ['Year', 'Label', 'Genre', 'Codec', 'Channels', 'Source', 'Data', 'Play Count', 'Rating'];

							// * On small player sizes, there is no space for all metadata entries. Hide them and only display entries from basicMeta.
							if (grSet.autoHideGridMetadata && grSet.layout === 'default' && (smallHDRes || smallQHDRes || small4KRes) && !basicMeta.includes(key)) {
								value = '';
								key = '';
								matchCount++;
							}
							txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2Width, this.wh);
							const cellHeight = txtRec.Height + 5;
							this.gridTop -= cellHeight * matchCount;
						}
					}

					txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2Width, this.wh);

					if (this.gridTop + txtRec.Height < this.albumArtSize.y + this.albumArtSize.h) {
						const borderWidth = SCALE(0.5);
						const cellHeight = txtRec.Height + 5;
						const keyFontSize = grSet[`gridKeyFontSize_${grSet.layout}`];
						const valFontSize = grSet[`gridValueFontSize_${grSet.layout}`] + SCALE(1);
						const showReleaseFlagOnly = grSet[`showGridReleaseFlags_${grSet.layout}`] === 'logo';
						const showCodecLogoOnly = grSet[`showGridCodecLogo_${grSet.layout}`] === 'logo';
						const showChannelLogoOnly = grSet[`showGridChannelLogo_${grSet.layout}`] === 'logo';
						const flag = showReleaseFlagOnly && key === 'Rel. Country';
						const codec = showCodecLogoOnly && key === 'Codec';
						const channels = showChannelLogoOnly && key === 'Channels';
						const ratingLinux = Detect.Wine && key === 'Rating';

						// * Apply better anti-aliasing on smaller font sizes in HD res
						gr.SetTextRenderingHint(!RES._4K && (keyFontSize < 17 || valFontSize < 18) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

						if (dropShadow) {
							gr.DrawString(value, grid_val_ft, grCol.darkAccent_50, Math.round(col2Left + borderWidth), Math.round(this.gridTop + borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, grCol.darkAccent_50, Math.round(col2Left - borderWidth), Math.round(this.gridTop + borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, grCol.darkAccent_50, Math.round(col2Left + borderWidth), Math.round(this.gridTop - borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, grCol.darkAccent_50, Math.round(col2Left - borderWidth), Math.round(this.gridTop - borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
						}
						gr.DrawString(key, grid_key_ft, grCol.detailsText, marginLeft, Math.round(this.gridTop), col1Width, cellHeight, Stringformat.trim_ellipsis_char);
						gr.DrawString(flag || codec || channels ? '' : value, grid_val_ft, grid_val_col, col2Left, Math.round(this.gridTop), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));

						// * Last.fm logo
						if (this.playCountVerifiedByLastFm && showLastFmImage) {
							const lastFmImg = gdi.Image(grPath.lastFmImageRed);
							const lastFmWhiteImg = gdi.Image(grPath.lastFmImageWhite);
							const lastFmLogo = ColorDistance(grCol.primary, RGB(185, 0, 0), false) < 133 ? lastFmWhiteImg : lastFmImg;
							const heightRatio = (cellHeight - 12) / lastFmLogo.Height;
							if (txtRec.Width + SCALE(12) + Math.round(lastFmLogo.Width * heightRatio) < col2Width) {
								gr.DrawImage(lastFmLogo, col2Left + txtRec.Width + SCALE(12), this.gridTop + 3,
									Math.round(lastFmLogo.Width * heightRatio), cellHeight - 12, 0, 0, lastFmLogo.Width, lastFmLogo.Height);
							}
						}
						// * Release flags
						if (showReleaseFlagImage && this.releaseFlagImg) {
							const sizeCorr = txtRec.Lines === 4 ? 4 : txtRec.Lines === 3 ? 3 : txtRec.Lines === 2 ? 2 : 1;
							const yCorr = txtRec.Lines === 4 ? cellHeight / 4 : txtRec.Lines === 3 ? cellHeight / 3 : 0;
							const heightRatio = (cellHeight) / this.releaseFlagImg.Height;
							if ((!showReleaseFlagOnly ? txtRec.Width + SCALE(8) : 0) + Math.round(this.releaseFlagImg.Width * heightRatio) < col2Width) {
								gr.DrawImage(this.releaseFlagImg, showReleaseFlagOnly && key === 'Rel. Country' ? col2Left : col2Left + txtRec.Width + SCALE(8), this.gridTop - 3 + yCorr,
									Math.round(this.releaseFlagImg.Width * heightRatio / sizeCorr), cellHeight / sizeCorr, 0, 0, this.releaseFlagImg.Width, this.releaseFlagImg.Height);
							}
						}
						// * Codec logo
						if (showGridCodecLogoImage) {
							this.loadCodecLogo();
							const heightRatio = this.codecLogo != null ? (cellHeight - 4) / this.codecLogo.Height : '';
							if (this.codecLogo != null && (!showCodecLogoOnly ? txtRec.Width + SCALE(8) : 0) + Math.round(this.codecLogo.Width * heightRatio) < col2Width) {
								gr.DrawImage(this.codecLogo, showCodecLogoOnly && key === 'Codec' ? col2Left : col2Left + txtRec.Width + SCALE(8), this.gridTop - 1,
									Math.round(this.codecLogo.Width * heightRatio), cellHeight - 4, 0, 0, this.codecLogo.Width, this.codecLogo.Height);
							}
						}
						// * Channel logo
						if (showGridChannelLogoImage) {
							this.loadChannelLogo();
							const heightRatio = this.channelLogo != null ? (cellHeight - 4) / this.channelLogo.Height : '';
							if (this.channelLogo != null && (!showChannelLogoOnly ? txtRec.Width + SCALE(8) : 0) + Math.round(this.channelLogo.Width * heightRatio) < col2Width) {
								gr.DrawImage(this.channelLogo, showChannelLogoOnly && key === 'Channels' ? col2Left : col2Left + txtRec.Width + SCALE(8), this.gridTop - 1,
									Math.round(this.channelLogo.Width * heightRatio), cellHeight - 4, 0, 0, this.channelLogo.Width, this.channelLogo.Height);
							}
						}
						this.gridTop += cellHeight + 5;
					}
				}
			}
		}

		if (drawMetadataGridProfiler) drawMetadataGridProfiler.Print();
	}

	/**
	 * Draws the band logo on the bottom left side in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetailsBandLogo(gr) {
		if (!fb.IsPlaying || !this.albumArt || grSet.layout !== 'default' || !this.displayDetails ||
			grSet.lyricsLayout === 'full' && this.displayLyrics) {
			return;
		}

		const drawBandLogoProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> band logo');
		const availableSpace = this.albumArtSize.y + this.albumArtSize.h - this.gridTop;
		const lightBg = new Color(grCol.detailsText).brightness < 140;
		const logo = lightBg || this.noAlbumArtStub ? (this.bandLogoInverted || this.bandLogo) : this.bandLogo;

		if (logo && availableSpace > 75) {
			let logoWidth = Math.min(RES._4K ? logo.Width : logo.Width / 2, this.albumArtSize.x - this.ww * 0.05);
			const heightScale = Math.min(logoWidth / logo.Width, availableSpace / logo.Height);
			logoWidth = logo.Width * heightScale; // Adjust logoWidth after heightScale is potentially updated

			const logoX = Math.round(this.isStreaming ? SCALE(40) : this.albumArtSize.x / 2 - logoWidth / 2);
			const logoY = Math.round(this.albumArtSize.y + this.albumArtSize.h - (logo.Height * heightScale)) - (RES._4K ? 24 : 4);
			const logoW = Math.round(logoWidth);
			const logoH = Math.round(logo.Height * heightScale);

			gr.DrawImage(logo, logoX, logoY, logoW, logoH, 0, 0, logo.Width, logo.Height, 0);
		}

		if (drawBandLogoProfiler) drawBandLogoProfiler.Print();
	}

	/**
	 * Draws the label logo on the bottom right side in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetailsLabelLogo(gr) {
		if (!fb.IsPlaying || !this.albumArt || grSet.layout !== 'default' || !this.displayDetails ||
			grSet.lyricsLayout === 'full' && this.displayLyrics) {
			return;
		}

		const drawLabelLogoProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> label logo');

		if (this.recordLabels.length > 0) {
			const lightBg = grSet.labelArtOnBg ? new Color(grCol.bg).brightness > 140 : new Color(grCol.detailsText).brightness < 140;
			const labels = lightBg || this.noAlbumArtStub ? (this.recordLabelsInverted.length ? this.recordLabelsInverted : this.recordLabels) : this.recordLabels;
			const rightSideGap = 20; // How close last label is to right edge
			const leftEdgeGap = (this.albumArtOffCenter ? 20 : 40) * (RES._4K ? 1.8 : 1); // Space between art and label
			const leftEdgeWidth = RES._4K ? 45 : 30; // How far label background extends on left
			const maxLabelWidth = SCALE(200);
			let leftEdge = 0;
			let topEdge = 0;
			let totalLabelWidth = 0;
			let labelAreaWidth = 0;
			let labelSpacing = 0;
			let labelWidth;
			let labelHeight;

			for (const label of labels) {
				if (label.Width > maxLabelWidth) {
					totalLabelWidth += maxLabelWidth;
				} else {
					totalLabelWidth += RES._4K && label.Width < 200 ? label.Width * 2 : label.Width;
				}
			}
			if (!this.lastLeftEdge) { // We don't want to recalculate this every screen refresh
				DebugLog('recalculating lastLeftEdge');
				this.shadowImgLabel = null;
				labelWidth = Math.round(totalLabelWidth / labels.length);
				labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // Might be recalc'd below
				if (this.albumArt) {
					if (this.discArt && grSet.displayDiscArt) {
						leftEdge = Math.round(Math.max(this.albumArtSize.x + this.albumArtScaled.Width + 5, this.ww * 0.975 - totalLabelWidth + 1));
						const discCenter = {};
						discCenter.x = Math.round(this.discArtSize.x + this.discArtSize.w / 2);
						discCenter.y = Math.round(this.discArtSize.y + this.discArtSize.h / 2);
						const radius = discCenter.y - this.discArtSize.y;
						const radiusSquared = radius * radius;
						let posValid = false;

						while (!posValid) {
							const allLabelsWidth = Math.max(Math.min(Math.round((this.ww - leftEdge - rightSideGap) / labels.length), maxLabelWidth), 50);
							//console.log("leftEdge = " + leftEdge + ", this.ww-leftEdge-10 = " + (this.ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
							const maxWidth = RES._4K && labels[0].Width < 200 ? labels[0].Width * 2 : labels[0].Width;
							labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
							labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // Width is based on height scale
							topEdge = Math.round(this.albumArtSize.y + this.albumArtSize.h - labelHeight);

							const a = topEdge - discCenter.y + 1; // Adding 1 to a and b so that the border just touches the edge of the discArt
							const b = leftEdge - discCenter.x + 1;

							if ((a * a + b * b) > radiusSquared) {
								posValid = true;
							} else {
								leftEdge += 4;
							}
						}
					} else {
						leftEdge = Math.round(Math.max(this.albumArtSize.x + this.albumArtSize.w + leftEdgeWidth + leftEdgeGap, this.ww * 0.975 - totalLabelWidth + 1));
					}
				} else {
					leftEdge = Math.round(this.ww * 0.975 - totalLabelWidth);
				}
				labelAreaWidth = this.ww - leftEdge - rightSideGap;
				this.lastLeftEdge = leftEdge;
				this.lastLabelHeight = labelHeight;
			}
			else { // Already calculated
				leftEdge = this.lastLeftEdge;
				labelHeight = this.lastLabelHeight;
				labelAreaWidth = this.ww - leftEdge - rightSideGap;
			}
			if (labelAreaWidth >= SCALE(50)) {
				if (labels.length > 1) {
					labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // Spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				const allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
				const origLabelHeight = labelHeight;
				let labelX = leftEdge;
				topEdge = this.albumArtSize.y + this.albumArtSize.h - labelHeight - 20;

				if (!grSet.labelArtOnBg && !grSet.noDiscArtBg || grSet.noDiscArtBg && grSet.displayDiscArt && this.discArt) {
					if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme)) {
						if (!this.shadowImgLabel) {
							this.shadowImgLabel = ShadowRect(this.discArtShadow, this.discArtShadow, this.ww - labelX + leftEdgeWidth, labelHeight + 40, this.discArtShadow, grCol.shadow);
						}
						gr.DrawImage(this.shadowImgLabel, labelX - leftEdgeWidth - this.discArtShadow, topEdge - 20 - this.discArtShadow, this.ww - labelX + leftEdgeWidth + 2 * this.discArtShadow, labelHeight + 40 + 2 * this.discArtShadow,
							0, 0, this.shadowImgLabel.Width, this.shadowImgLabel.Height);
					}
					gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing
					gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, this.ww - labelX + leftEdgeWidth, labelHeight + 40, grCol.detailsBg);
					gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, this.ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, grCol.shadow);
					gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
				}
				for (let i = 0; i < labels.length; i++) {
					// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
					const maxWidth = RES._4K && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
					labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
					labelHeight = Math.round(labels[i].Height * labelWidth / labels[i].Width); // Width is based on height scale

					gr.DrawImage(labels[i], labelX, Math.round(topEdge + origLabelHeight / 2 - labelHeight / 2), labelWidth, labelHeight, 0, 0, this.recordLabels[i].Width, this.recordLabels[i].Height);
					labelX += labelWidth + labelSpacing;
				}
			}
		}

		if (drawLabelLogoProfiler) drawLabelLogoProfiler.Print();
	}

	/**
	 * Draws the lyrics on the album art in the Lyrics panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLyrics(gr) {
		if (!this.displayLyrics || !fb.IsPlaying) return;

		const fullW = grSet.layout === 'default' && grSet.lyricsLayout === 'full' && this.displayLyrics && this.noAlbumArtStub || grSet.layout === 'artwork';

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(fullW ? 0 : this.albumArtSize.x, fullW ? this.topMenuHeight : this.albumArtSize.y,
			fullW ? this.ww : this.albumArtSize.w, fullW ? this.wh - this.topMenuHeight - this.lowerBarHeight : this.albumArtSize.h,
			grSet.lyricsAlbumArt ? RGBA(0, 0, 0, 170) : pl.col.bg);

		if (grm.lyrics) grm.lyrics.drawLyrics(gr);
	}

	/**
	 * Draws the activated styles from Options > Styles.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawStyles(gr) {
		const drawStylesProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> theme styles');

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
			gr.FillGradRect(0, 0, this.ww, this.topMenuHeight, grSet.styleAlternative2 ? -87 : -87, grCol.styleAlternative, 0);
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
			const timeOfDay = grSet.themeSetupDay ? 'daytime' : 'nighttime';
			this.themeNotification = `Theme setup for ${timeOfDay} is active:\n\nPlease select your theme and styles\nfor ${timeOfDay} usage.\n\nAfter configuration,\nrevisit the theme day/night menu\nto save changes.`;
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
			this.displayLyrics && grSet.lyricsLayout === 'full');

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
	drawPanelShadows(gr) {
		const drawPanelShadowsProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> panel shadows');

		// * SHADOWS FOR ALBUM ART, noAlbumArtStub AND DETAILS * //
		const layoutDefault = grSet.layout === 'default' &&
			(this.displayDetails || !this.displayBiography && (grSet.playlistLayout !== 'full' && this.displayPlaylist || grSet.libraryLayout === 'normal' && this.displayLibrary));

		const layoutArtwork = grSet.layout === 'artwork' &&
			!this.displayPlaylistArtwork && !this.displayLibrary && !this.displayBiography;

		const displayAlbumArtDetailsShadows = fb.IsPlaying &&
			(this.albumArt && this.albumArtScaled || this.noAlbumArtStub) && !this.displayLibrarySplit() && (layoutDefault || layoutArtwork);

		const displayDetails = (!this.discArt || !grSet.displayDiscArt) && this.displayDetails;

		const noDefaultLayout = grSet.layout !== 'default';

		if (displayAlbumArtDetailsShadows) {
			gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);

			// Top shadow
			gr.FillGradRect(0, libSet.albumArtShow && grSet.libraryLayout === 'full' && this.displayLibrary ? lib.ui.y - (RES._4K ? 10 : 6) : this.albumArtSize.y - (RES._4K ? 10 : 6),
				displayDetails && grSet.noDiscArtBg || noDefaultLayout ? this.ww : this.albumArtSize.x + this.albumArtSize.w, RES._4K ? 10 : 6, 90, 0, grCol.shadow);

			if (displayDetails && !grSet.noDiscArtBg && !this.noAlbumArtStub) {
				// Middle shadow
				gr.FillGradRect(this.noAlbumArtStub ? this.ww * 0.5 - 4 : this.albumArtSize.x + this.albumArtSize.w, this.noAlbumArtStub ? this.topMenuHeight : this.albumArtSize.y - 3,
					4, this.noAlbumArtStub ? this.wh - this.topMenuHeight - this.lowerBarHeight : this.albumArtSize.h + 5, 0.5,
					this.noAlbumArtStub ? 0 : grSet.styleBlackAndWhite ? RGB(0, 0, 0) : grCol.shadow, this.noAlbumArtStub ? grSet.styleBlackAndWhite ? RGB(0, 0, 0) : grCol.shadow : 0);
			}
			// Bottom shadow
			gr.FillGradRect(0, libSet.albumArtShow && grSet.libraryLayout === 'full' && this.displayLibrary ? lib.ui.y + lib.ui.h + (RES._4K ? 0 : -1) : this.albumArtSize.y + this.albumArtSize.h + (RES._4K ? 0 : -1),
				displayDetails && grSet.noDiscArtBg || noDefaultLayout ? this.ww : this.albumArtSize.x + this.albumArtSize.w, SCALE(5), 90, grCol.shadow, 0);
		}

		// * SHADOWS FOR ALL PANELS * //
		const panelLayoutNormal = grSet.layout === 'default' &&
			(grSet.playlistLayout  === 'normal' && this.displayPlaylist && !this.displayBiography ||
			 grSet.libraryLayout   === 'normal' && this.displayLibrary   ||
			 grSet.biographyLayout === 'normal' && this.displayBiography ||
			this.displayLibrarySplit());

		const displayPanelShadows =
			grSet.layout !== 'artwork' && this.displayPlaylist || this.displayPlaylistArtwork || this.displayLibrary || this.displayBiography || this.displayCustomThemeMenu && !fb.IsPlaying;

		if (displayPanelShadows) {
			const x =
				this.displayLibrarySplit() || this.displayBiography || this.displayCustomThemeMenu && !fb.IsPlaying || grSet.layout !== 'default' || !panelLayoutNormal ? 0 :
				grSet.panelWidthAuto ? this.albumArtSize.x + this.albumArtSize.w : this.ww * 0.5;

			gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);

			// Top shadow
			gr.FillGradRect(x, this.topMenuHeight - (RES._4K ? 10 : 6), this.ww, RES._4K ? 10 : 6, 90, 0, grCol.shadow);

			if (panelLayoutNormal && pl.playlist.x !== 0 && !grSet.hideMiddlePanelShadow) {
				// Middle shadow for playlist
				gr.FillGradRect(grSet.panelWidthAuto ? this.displayLibrarySplit() ? this.wh - this.topMenuHeight - this.lowerBarHeight - 4 : this.albumArtSize.x + this.albumArtSize.w - 4 : this.ww * 0.5 - 4, this.topMenuHeight, 4, this.wh - this.topMenuHeight - this.lowerBarHeight, 0.5, 0,
					grSet.styleBlackAndWhite && this.noAlbumArtStub ? RGB(0, 0, 0) : grSet.styleNighttime || grSet.styleBlackAndWhite2 || grSet.styleRebornBlack ? RGBA(0, 0, 0, 30) : grCol.shadow);
				// Middle shadow for album art
				if (this.albumArt && this.albumArtSize.w !== this.ww * 0.5 && !this.displayLibrarySplit() && !this.displayBiography && !this.noAlbumArtStub) {
					gr.FillGradRect(this.albumArtSize.x + this.albumArtSize.w - 2, this.albumArtSize.y, 4, this.albumArtSize.h, 0.5, grSet.styleBlackAndWhite ? RGB(0, 0, 0) : grCol.shadow, 0);
				}
			}
			// Bottom shadow
			gr.FillGradRect(x, this.wh - this.lowerBarHeight + (RES._4K ? 0 : -1), this.ww, SCALE(5), 90, grCol.shadow, 0);
		}

		if (drawPanelShadowsProfiler) drawPanelShadowsProfiler.Print();
	}

	/**
	 * Draws the top menu bar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawTopMenuBar(gr) {
		const drawTopMenuBarProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> top menu bar');

		for (const i in this.btn) { // Can't replace for..in until non-numeric indexes are removed
			const btn = this.btn[i];
			const { x, y, w, h, img } = btn;
			const disabled = btn.isEnabled ? !btn.isEnabled() : false;
			const alpha = disabled ? 140 : 255;

			if ((i === 'back' || i === 'forward') && !this.displayPlaylist) {
				continue;
			}

			if (img) {
				gr.DrawImage(img[0], x, y, w, h, 0, 0, w, h, 0, alpha); // Normal
				if (!disabled) {
					btn.hoverAlpha && gr.DrawImage(img[1], x, y, w, h, 0, 0, w, h, 0, btn.hoverAlpha);
					btn.downAlpha && gr.DrawImage(img[2], x, y, w, h, 0, 0, w, h, 0, btn.downAlpha);
					btn.enabled && img[3] && gr.DrawImage(img[3], x, y, w, h, 0, 0, w, h, 0, 255);
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
		const drawLowerBarProfiler     = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> lower bar');
		const lowerBarTop              = this.wh - this.lowerBarHeight + (grSet.layout === 'default' ? (RES._4K ? 65 : 35) : (RES._4K ? 33 : 18));
		const lowerMargin              = SCALE(grSet.layout === 'compact' || grSet.layout === 'artwork' ? 80 : grSet.showTransportControls_default ? 80 : 120);
		const lowerBarFontSize         = grSet[`lowerBarFontSize_${grSet.layout}`];
		const showLowerBarArtist       = grSet[`showLowerBarArtist_${grSet.layout}`];
		const showLowerBarTrackNum     = grSet[`showLowerBarTrackNum_${grSet.layout}`];
		const showLowerBarTitle        = grSet[`showLowerBarTitle_${grSet.layout}`];
		const showLowerBarComposer     = grSet[`showLowerBarComposer_${grSet.layout}`];
		const showLowerBarArtistFlags  = grSet[`showLowerBarArtistFlags_${grSet.layout}`];
		const showLowerBarPlaybackTime = grSet[`showPlaybackTime_${grSet.layout}`];
		const showProgressBar          = grSet[`showProgressBar_${grSet.layout}`];
		const showWaveformBar          = grSet[`showWaveformBar_${grSet.layout}`];
		const showPeakmeterBar         = grSet[`showPeakmeterBar_${grSet.layout}`];

		const flagSize =
		this.flagImgs.length >=  6 ? SCALE(84 + lowerBarFontSize * 6) :
		this.flagImgs.length === 5 ? SCALE(70 + lowerBarFontSize * 5) :
		this.flagImgs.length === 4 ? SCALE(56 + lowerBarFontSize * 4) :
		this.flagImgs.length === 3 ? SCALE(42 + lowerBarFontSize * 3) :
		this.flagImgs.length === 2 ? SCALE(28 + lowerBarFontSize * 2) :
		this.flagImgs.length === 1 ? SCALE(14 + lowerBarFontSize) : '';
		const availableFlags = showLowerBarArtistFlags && this.flagImgs.length ? flagSize : 0;

		// * Calculate all transport buttons width
		const showPlaybackOrderBtn = grSet[`showPlaybackOrderBtn_${grSet.layout}`];
		const showReloadBtn        = grSet[`showReloadBtn_${grSet.layout}`];
		const showVolumeBtn        = grSet[`showVolumeBtn_${grSet.layout}`];
		const transportBtnSize     = grSet[`transportButtonSize_${grSet.layout}`];
		const transportBtnSpacing  = grSet[`transportButtonSpacing_${grSet.layout}`];
		const buttonSize           = SCALE(transportBtnSize);
		const buttonSpacing        = SCALE(transportBtnSpacing);
		const buttonCount          = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

		// * Setup time area width
		const timeAreaWidth = this.ww > 400 ? grStr.disc !== '' && grSet.layout === 'default' ? gr.CalcTextWidth(`${grStr.disc}   ${grStr.time}   ${grStr.length}`, grFont.lowerBarTitle) : gr.CalcTextWidth(` ${grStr.time}   ${grStr.length}`, grFont.lowerBarTitle) : 0;

		// * Setup width for artist and song title
		const playbackTime   = grSet[`showPlaybackTime_${grSet.layout}`];
		const availableWidth = grSet.layout === 'default' && grSet.showTransportControls_default && (grSet.showLowerBarArtist_default || grSet.showLowerBarTitle_default) ?
			Math.round(this.ww * 0.5 - lowerMargin - availableFlags - ((buttonSize * buttonCount + buttonSpacing * buttonCount) / 2)) : Math.round(this.ww - lowerMargin - availableFlags - (playbackTime ? timeAreaWidth : 0));

		// * Measure width and height for artist, orig artist and song title
		const artistWidth       = gr.MeasureString(grStr.artist, grFont.lowerBarArtist, 0, 0, 0, 0).Width;
		const artistHeight      = gr.CalcTextHeight(grStr.artist, grFont.lowerBarArtist);
		const trackNumWidth     = Math.ceil(gr.MeasureString(grStr.tracknum === '' ? '00.' : grStr.tracknum, grFont.lowerBarTitle, 0, 0, 0, 0).Width);
		const titleMeasurements = gr.MeasureString(showLowerBarComposer ? grStr.titleLower + grStr.composer : grStr.titleLower, grFont.lowerBarTitle, 0, 0, 0, 0);
		// const titleWidth        = trackNumWidth + gr.MeasureString(showLowerBarComposer ? grStr.titleLower + grStr.composer : grStr.titleLower, grFont.lowerBarTitle, 0, 0, 0, 0).Width;
		const titleHeight       = gr.CalcTextHeight(grStr.titleLower, grFont.lowerBarTitle);
		const artistTitleWidth  = gr.MeasureString(grStr.artist, grFont.lowerBarArtist, 0, 0, 0, 0).Width + trackNumWidth + gr.MeasureString(showLowerBarComposer ? grStr.titleLower + grStr.composer : grStr.titleLower, grFont.lowerBarTitle, 0, 0, 0, 0).Width + gr.MeasureString(grStr.original_artist, grFont.lowerBarTitle, 0, 0, 0, 0).Width;
		const oneLine           = artistTitleWidth < availableWidth || !showLowerBarTitle;
		const twoLines          = artistTitleWidth > availableWidth && showLowerBarTitle;
		const lineCorrection    = SCALE(grSet.customThemeFonts ? RES._4K ? 0 : 4 : RES._4K ? 0 : 2);

		// * Adjustments
		const flagWidth          = showLowerBarArtistFlags && this.flagImgs.length && grStr.tracknum < 100 ? SCALE(14) + SCALE(lowerBarFontSize) : trackNumWidth + SCALE(6);
		const heightAdjustment   = grSet.customThemeFonts ? 0 : ((lowerBarFontSize === 12 || lowerBarFontSize === 14) && !RES._4K || (lowerBarFontSize === 16 || lowerBarFontSize === 18 || lowerBarFontSize === 20 || lowerBarFontSize === 22) && RES._4K) ? 1 : 0;
		const trackNumAdjustment = gr.MeasureString('\u2013', grFont.lowerBarTitle, 0, 0, 0, 0).Width;
		const titleAdjustment    = gr.MeasureString(grSet.customThemeFonts ? '\u2013.' : 'M', grFont.lowerBarTitle, 0, 0, 0, 0).Width;
		const titleAdjustment2   = gr.MeasureString('-', grFont.lowerBarTitle, 0, 0, 0, 0).Width;

		// * Setup artist, track number and title
		const artist = showLowerBarArtist ? grStr.artist : '';
		const artistX =	twoLines ? grm.progBar.x + availableFlags : Math.round(grm.progBar.x + availableFlags - (grSet.layout === 'default' ? SCALE(1) : 0));

		const artistY =	twoLines ? Math.round(lowerBarTop - lineCorrection - artistHeight + (grSet.customThemeFonts ? artistHeight * 0.125 : 0) + (lowerBarFontSize < 18 ? SCALE(-2) : lowerBarFontSize > 18 ? SCALE(RES._QHD ? 1 : 3) : 0)) :
			Math.round(lowerBarTop - lineCorrection);

		const trackNum = twoLines ? showLowerBarTrackNum && showLowerBarTitle || !showLowerBarTitle && !fb.IsPlaying ? grStr.tracknum : '' :
			showLowerBarTrackNum && showLowerBarTitle || (!showLowerBarTrackNum || !showLowerBarTitle) && !fb.IsPlaying ? grStr.tracknum === '' ? '-' : grStr.tracknum :
			!showLowerBarTrackNum && showLowerBarArtist && fb.IsPlaying ? '-' : '';

		const trackNumX = twoLines ? grm.progBar.x :
			showLowerBarArtist && fb.IsPlaying && fb.PlaybackLength > 0 ? Math.floor(grm.progBar.x + availableFlags + artistWidth + (!showLowerBarTrackNum || grStr.tracknum === '' ? titleAdjustment2 * 0.5 : trackNumAdjustment)) : grm.progBar.x;

		const trackNumY = Math.round(lowerBarTop - lineCorrection - heightAdjustment);

		const title = twoLines ? showLowerBarTitle || !showLowerBarTitle && !fb.IsPlaying ? showLowerBarComposer && fb.IsPlaying ? grStr.titleLower + grStr.original_artist + grStr.composer : grStr.titleLower : '' :
			showLowerBarTitle || !showLowerBarTitle && !fb.IsPlaying ? showLowerBarComposer && fb.IsPlaying ? grStr.titleLower + grStr.composer : grStr.titleLower : '';

		const titleX = twoLines ? !showLowerBarTrackNum || grStr.tracknum === '' ? grm.progBar.x : Math.round(grm.progBar.x + flagWidth) :
			// When not playing or stopped
			!fb.IsPlaying ? Math.round(grm.progBar.x + trackNumWidth) :
			// Artist and no track number displayed
			showLowerBarArtist ? !showLowerBarTrackNum || grStr.tracknum === '' ? Math.floor(grm.progBar.x + availableFlags + artistWidth + titleAdjustment) :
			// Artist with track number displayed
			Math.round(grm.progBar.x + availableFlags + artistWidth + trackNumWidth + (fb.PlaybackLength > 0 ? titleAdjustment : 0)) :
			// No artist and no track number displayed
			!showLowerBarTrackNum || grStr.tracknum === '' ? grm.progBar.x :
			// No artist with track number displayed
			Math.round(grm.progBar.x + trackNumWidth + (fb.PlaybackLength > 0 ? titleAdjustment : 0));

		const titleY = trackNumY;

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && lowerBarFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

		// * Artist, tracknum, title
		if (oneLine || twoLines && grSet.layout === 'default') DrawString(gr, artist, grFont.lowerBarArtist, grCol.lowerBarArtist, artistX, artistY, availableWidth, artistHeight, Stringformat.trim_ellipsis_char);
		gr.DrawString(trackNum, grFont.lowerBarTitle, grCol.lowerBarTitle, trackNumX, trackNumY, trackNumWidth - timeAreaWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
		DrawString(gr, title, grFont.lowerBarTitle, grCol.lowerBarTitle, titleX, titleY, fb.IsPlaying ? availableWidth + (twoLines ? availableFlags : 0) : this.ww, titleHeight, Stringformat.trim_ellipsis_char);

		// * Artist flags
		if (showLowerBarArtist && showLowerBarArtistFlags && (grSet.layout === 'default' || grSet.layout !== 'default' && !twoLines)) {
			const maxFlags = Math.min(this.flagImgs.length, 6);
			const marginLeft = SCALE(grSet.layout !== 'default' ? 20 : 40);
			let flagsLeft = marginLeft - (RES._4K ? 1 : 0);
			for (let i = 0; i < maxFlags; i++) {
				gr.DrawImage(this.flagImgs[i], flagsLeft, Math.round(artistY - (this.flagImgs[i].Height / (artistHeight + SCALE(2))) - (RES._4K ? 1 : 0)), this.flagImgs[i].Width + SCALE(lowerBarFontSize) - SCALE(26), artistHeight + SCALE(2), 0, 0, this.flagImgs[i].Width, this.flagImgs[i].Height);
				flagsLeft += this.flagImgs[i].Width + SCALE(lowerBarFontSize) - SCALE(18);
			}
		}

		// * Playback time, length, disc number
		if (this.ww > 400) {
			gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
			let width = gr.CalcTextWidth(`  ${grStr.length}`, grFont.lowerBarLength);
			const lowerBarVersionW = gr.CalcTextWidth(`  ${grStr.time}`, grFont.lowerBarLength);
			const lowerBarVersionH = Math.ceil(titleMeasurements.Height);
			const lowerBarVersionX = this.ww - SCALE(grSet.layout !== 'default' ? 20 : 40) - lowerBarVersionW;
			const lowerBarVersionY = Math.round(lowerBarTop - lineCorrection - heightAdjustment);
			const lowerBarLengthX = this.ww - SCALE(grSet.layout !== 'default' ? 20 : 40) - width;
			const lowerBarLengthY = lowerBarVersionY;
			const lowerBarLengthW = width;
			const lowerBarLengthH = lowerBarVersionH;
			this.lowerBarTimeX = this.ww - SCALE(grSet.layout !== 'default' ? 20 : 40) - (this.isStreaming ? width : width * 2);
			this.lowerBarTimeY = Math.round(lowerBarTop - lineCorrection);
			this.lowerBarTimeW = lowerBarLengthW;
			this.lowerBarTimeH = lowerBarVersionH;
			const lowerBarDiscW = gr.CalcTextWidth(`  ${grStr.disc}`, grFont.lowerBarDisc);
			const lowerBarDiscH = lowerBarVersionH;
			const lowerBarDiscY = lowerBarVersionY;
			const lowerBarDiscX = this.lowerBarTimeX - lowerBarDiscW;

			if (showLowerBarPlaybackTime && fb.PlaybackLength > 0) { // * Playing track
				gr.DrawString(grStr.length, grFont.lowerBarLength, grCol.lowerBarLength, lowerBarLengthX, lowerBarLengthY, lowerBarLengthW, lowerBarLengthH, StringFormat(2, 0));
				gr.DrawString(grStr.time, grFont.lowerBarTime, grCol.lowerBarTime, this.lowerBarTimeX, this.lowerBarTimeY, this.lowerBarTimeW, this.lowerBarTimeH, StringFormat(2, 0));
				width += gr.CalcTextWidth(`  ${grStr.time}`, grFont.lowerBarTime);
				gr.DrawString(grSet.layout !== 'default' ? '' : grStr.disc, grFont.lowerBarDisc, grCol.lowerBarTitle, lowerBarDiscX, lowerBarDiscY, lowerBarDiscW, lowerBarDiscH, StringFormat(2, 0));
			}
			else if (showLowerBarPlaybackTime && fb.IsPlaying && this.isStreaming) { // * Streaming, but still want to show time
				gr.DrawString(grStr.time, grFont.lowerBarTime, grCol.lowerBarTitle, this.lowerBarTimeX, this.lowerBarTimeY, this.lowerBarTimeW, this.lowerBarTimeH, StringFormat(2, 0));
			}
			else { // * Not playing anything, will show theme version or update link if available
				let offset = 0;
				if (grCfg.updateAvailable && grCfg.updateHyperlink) {
					offset = grCfg.updateHyperlink.getWidth();
					grCfg.updateHyperlink.setContainerWidth(this.ww);
					grCfg.updateHyperlink.setY(lowerBarTop);
					grCfg.updateHyperlink.setXOffset(this.ww - offset - SCALE(grSet.layout !== 'default' ? 20 : 40));
					grCfg.updateHyperlink.draw(gr, grCol.lowerBarTitle);
				}
				if (showLowerBarPlaybackTime) {
					gr.DrawString(grStr.time, grFont.lowerBarLength, grCol.lowerBarTitle, lowerBarVersionX - offset, lowerBarVersionY, lowerBarVersionW, lowerBarVersionH, StringFormat(2, 0));
				}
			}
			if (showLowerBarPlaybackTime && fb.IsPlaying) { // * Switch to playback time remaining
				this.btn.playbackTime = new Button(this.ww - timeAreaWidth - SCALE(grSet.layout !== 'default' ? 20 : 40), this.lowerBarTimeY,
				timeAreaWidth, this.lowerBarTimeH, showLowerBarPlaybackTime ? 'PlaybackTime' : '', '', showLowerBarPlaybackTime ? 'Switch playback time' : '');
			}
		}

		// * LOWER BAR TOOLTIP * //
		if ((grSet.showTooltipMain || grSet.showTooltipTruncated) && grm.lowerTip && fb.IsPlaying) {
			grm.lowerTip.draw(gr);
		}

		// * VOLUME BTN * //
		if (showVolumeBtn && this.loadingThemeComplete) {
			grm.volBtn.draw(gr);
		}

		// * PROGRESS BAR * //
		if (showProgressBar && (grSet.seekbar === 'progressbar' || !fb.IsPlaying)) {
			this.progressBarY = Math.round(lowerBarTop + titleMeasurements.Height + grm.progBar.h);
			grm.progBar.setY(this.progressBarY);
			grm.progBar.draw(gr);
		}
		// * WAVEFORM BAR * //
		else if (showWaveformBar && grSet.seekbar === 'waveformbar') {
			this.waveformBarY = Math.round(lowerBarTop + titleMeasurements.Height + grm.waveBar.h);
			grm.waveBar.setY(this.waveformBarY);
			grm.waveBar.draw(gr);
		}
		// * PEAKMETER BAR * //
		else if (showPeakmeterBar && grSet.seekbar === 'peakmeterbar') {
			this.peakmeterBarY = Math.round(lowerBarTop + titleMeasurements.Height + grm.peakBar.h * 0.5);
			grm.peakBar.setY(this.peakmeterBarY);
			grm.peakBar.draw(gr);
		}

		if (drawLowerBarProfiler) drawLowerBarProfiler.Print();
	}

	/**
	 * Draws the custom theme menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawCustomThemeMenu(gr) {
		if (!this.displayCustomThemeMenu || grSet.layout !== 'default') return;

		const x = this.displayBiography || this.displayLyrics ? this.ww * 0.5 : this.displayDetails ? this.albumArtSize.x : 0;
		const y = this.topMenuHeight;
		const width = !fb.IsPlaying && this.displayDetails || this.displayLyrics && !this.albumArt ? this.ww : this.displayDetails ? this.albumArtSize.w : this.ww * 0.5;
		const height = this.wh - this.topMenuHeight - this.lowerBarHeight;

		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(x, y, width, height, pl.col.bg);
		for (const c of CustomMenu.controlList) c.draw(gr);

		if (CustomMenu.activeControl && CustomMenu.activeControl instanceof CustomMenuDropDown && CustomMenu.activeControl.isSelectUp) {
			CustomMenu.activeControl.draw(gr);
		}
	}

	/**
	 * Draws the custom metadata grid menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawMetadataGridMenu(gr) {
		if (!this.displayMetadataGridMenu || grSet.layout !== 'default' || (this.displayPlaylist || this.displayLibrary || this.displayBiography || this.displayLyrics)) return;

		const x = this.albumArtSize.x - 1;
		const y = this.topMenuHeight;
		const width = this.ww;
		const height = this.wh - this.topMenuHeight - this.lowerBarHeight;

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
		if (this.styledTooltipText === '' || !this.styledTooltipReady || !grSet.showStyledTooltips) return;

		const drawStyledTooltipsProfiler = this.showExtraDrawTiming && fb.CreateProfiler('on_paint -> styled tooltips');
		const tooltipFontSize = grSet[`tooltipFontSize_${grSet.layout}`];
		const offset = SCALE(30);
		const padding = SCALE(15);
		const edgeSpace = padding * 0.5;
		const arc = SCALE(6);
		const w = Math.min(gr.MeasureString(this.styledTooltipText, grFont.tooltip, 0, 0, 0, 0).Width + padding + 1, this.ww - (this.state.mouse_x > this.ww * 0.85 ? this.state.mouse_x - this.ww * 0.15 : this.state.mouse_x) - edgeSpace);
		const h = Math.min(gr.MeasureString(this.styledTooltipText, grFont.tooltip, 0, 0, w, this.wh).Height + padding, this.wh - (this.state.mouse_y > this.wh * 0.85 ? this.state.mouse_y - this.wh * 0.15 : this.state.mouse_y) - edgeSpace - offset);
		const x = this.state.mouse_x > this.ww * 0.85 ? this.state.mouse_x - w : this.state.mouse_x; // * When tooltip is too close to the right edge, it will be drawn on the left side of the mouse cursor
		const y = this.state.mouse_y > this.wh * 0.85 ? this.state.mouse_y - h : this.state.mouse_y + offset; // * When tooltip is too close to the bottom edge, it will be drawn on the top side of the mouse cursor
		const throttleRepaintRect = _Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), 50);

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && tooltipFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
		gr.FillRoundRect(x, y, w, h, arc, arc, RGBtoRGBA(grCol.popupBg, 220));
		gr.DrawRoundRect(x, y, w, h, arc, arc, SCALE(2), 0x64000000);
		gr.DrawString(this.styledTooltipText, grFont.tooltip, grCol.popupText, x + padding * 0.5, y + padding * 0.5, w - padding, h - padding, StringFormat(0, 0, 4));
		throttleRepaintRect(x - offset * 0.5, y - offset * 0.5, w + offset, h + offset);

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
		if (grSet.showPreloaderLogo) drawLogo(gr);
	}

	/**
	 * Draws the debug theme overlay in the album art area when `Enable debug theme overlay` in Developer tools is active.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDebugThemeOverlay(gr) {
		if (!grCfg.settings.showDebugThemeOverlay) return;

		const fullW = grSet.layout === 'default' && grSet.lyricsLayout === 'full' && this.displayLyrics && this.noAlbumArtStub || grSet.layout === 'artwork';
		const titleWidth = this.albumArtSize.w - SCALE(80);
		const titleHeight = gr.CalcTextHeight(' ', grFont.popup);
		const lineSpacing = titleHeight * 1.5;
		const logColor = RGB(255, 255, 255);
		const x = this.albumArtSize.x + SCALE(grSet.layout !== 'default' ? 20 : 40);
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

		try {
			for (const rect of this.repaintRects) {
				gr.DrawRect(rect.x, rect.y, rect.w, rect.h, SCALE(2), RGBA(255, 0, 0, 200));
			}
			this.repaintRects = [];
		} catch (e) {}
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
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
			fb.ShowPopupMessage('Georgia-ReBORN WAS UNABLE TO LOAD SOME FONTS\n\n' +
			'Be sure all fonts from\nfoobar2000\\profile\\georgia-reborn\\fonts\nare correctly installed in these directories:\n\n' +
			'For Windows: C:\\Windows\\Fonts\\\nFor Linux: /usr/share/fonts or ~/.local/share/fonts\n\n' +
			'If you use custom fonts, all your custom fonts need to have\nthe exact font name / font family name in your\n' +
			'foobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc config file.\n\n' +
			'You can also check foobar\'s console ( Top menu > View > Console ),\nit will show font errors with its wrong font names.', 'FONT ERROR WARNING');
		}

		if (grSet.customThemeFonts) {
			console.log('\nUser\'s set custom fonts are being used:\n\n'
				+ `Panel default: ${grCfg.customFont.fontDefault}\n`
				+ `Top menu: ${grCfg.customFont.fontTopMenu}\n`
				+ `Lower bar artist: ${grCfg.customFont.fontLowerBarArtist}\n`
				+ `Lower bar title: ${grCfg.customFont.fontLowerBarTitle}\n`
				+ `Lower bar disc: ${grCfg.customFont.fontLowerBarDisc}\n`
				+ `Lower bar time: ${grCfg.customFont.fontLowerBarTime}\n`
				+ `Lower bar length: ${grCfg.customFont.fontLowerBarLength}\n`
				+ `Lower bar waveform bar: ${grCfg.customFont.fontLowerBarWave}\n`
				+ `Notification: ${grCfg.customFont.fontNotification}\n`
				+ `Popup: ${grCfg.customFont.fontPopup}\n`
				+ `Tooltip: ${grCfg.customFont.fontTooltip}\n`
				+ `Grid artist: ${grCfg.customFont.fontGridArtist}\n`
				+ `Grid title: ${grCfg.customFont.fontGridTitle}\n`
				+ `Grid title bold: ${grCfg.customFont.fontGridTitleBold}\n`
				+ `Grid album: ${grCfg.customFont.fontGridAlbum}\n`
				+ `Grid key: ${grCfg.customFont.fontGridKey}\n`
				+ `Grid value: ${grCfg.customFont.fontGridValue}\n`
				+ `Playlist artist normal: ${grCfg.customFont.playlistArtistNormal}\n`
				+ `Playlist artist playing: ${grCfg.customFont.playlistArtistPlaying}\n`
				+ `Playlist artist normal compact: ${grCfg.customFont.playlistArtistNormalCompact}\n`
				+ `Playlist artist playing compact: ${grCfg.customFont.playlistArtistPlayingCompact}\n`
				+ `Playlist title normal: ${grCfg.customFont.playlistTitleNormal}\n`
				+ `Playlist title selected: ${grCfg.customFont.playlistTitleSelected}\n`
				+ `Playlist title playing: ${grCfg.customFont.playlistTitlePlaying}\n`
				+ `Playlist album: ${grCfg.customFont.playlistAlbum}\n`
				+ `Playlist date: ${grCfg.customFont.playlistDate}\n`
				+ `Playlist date compact: ${grCfg.customFont.playlistDateCompact}\n`
				+ `Playlist info: ${grCfg.customFont.playlistInfo}\n`
				+ `Playlist cover: ${grCfg.customFont.playlistCover}\n`
				+ `Playlist playcount: ${grCfg.customFont.playlistPlaycount}\n`
				+ `Library: ${grCfg.customFont.fontLibrary}\n`
				+ `Biography: ${grCfg.customFont.fontBiography}\n`
				+ `Lyrics: ${grCfg.customFont.fontLyrics}\n\n`
			);
		}

		return fontsInstalled;
	}

	/**
	 * Initializes and sets the sizes and positions for various UI elements.
	 */
	initMetrics() {
		this.pauseSize = SCALE(100);
		this.discArtShadow = SCALE(6);
		this.gridTooltipHeight = SCALE(100);
		this.timelineHeight = Math.round(this.progressBarH * 0.66);
		this.topMenuHeight = SCALE(40);
		this.lowerBarHeight = SCALE(120);
		this.progressBarH = SCALE(grSet.layout !== 'default' && (grSet.styleProgressBarDesign === 'default' || grSet.styleProgressBarDesign === 'rounded') ? 10 : 12) + (this.ww > 1920 ? 2 : 0);
		this.peakmeterBarH = SCALE(grSet.layout !== 'default' ? 16 : 26) + (this.ww > 1920 ? 2 : 0);
		this.waveformBarH = SCALE(grSet.layout !== 'default' ? 16 : 26) + (this.ww > 1920 ? 2 : 0);
	}

	/**
	 * Initializes the theme on startup or reload.
	 */
	initMain() {
		// * Init variables
		console.log('initMain()');
		this.loadingTheme = true;
		this.clearUIVariables();
		this.ww = window.Width;
		this.wh = window.Height;

		// * Layout safety check
		if (!['default', 'artwork', 'compact'].includes(grSet.layout)) {
			window.SetProperty('Georgia-ReBORN - 05. Layout', 'default');
			grSet.layout = 'default';
			grm.display.layoutDefault();
		}

		// * Do auto-delete cache if enabled
		if (grSet.libraryAutoDelete) DeleteLibraryCache();
		if (grSet.biographyAutoDelete) DeleteBiographyCache();
		if (grSet.lyricsAutoDelete) DeleteLyrics();
		if (grSet.waveformBarAutoDelete) DeleteWaveformBarCache();

		this.lastAlbumFolder = '';
		this.lastPlaybackOrder = fb.PlaybackOrder;
		this.displayPanelControl();
		grm.color.setThemeColors();
		this.themeColorSet = true;

		if (grSet.asyncThemePreloader) {
			on_size(); // Needed when loading async, otherwise just needed in fb.IsPlaying conditional
		}

		this.initMetrics();

		if (fb.IsPlaying && fb.GetNowPlaying()) {
			on_playback_new_track(fb.GetNowPlaying());
		}

		// * Workaround so we can use the Edit menu or run fb.RunMainMenuCommand("Edit/Something...")
		// * when the panel has focus and a dedicated playlist viewer doesn't.
		plman.SetActivePlaylistContext(); // Once on startup

		// * Init panels
		if (!lib.initialized) {
			this.initLibraryPanel();
			this.setLibrarySize();
			setTimeout(() => {
				lib.lib.initialise();
				this.initLibraryLayout();
			}, 1);
		}
		if (!bio.initialized) {
			this.initBiographyPanel();
			this.setBiographySize();
		}
		if (grSet.panelWidthAuto) {
			this.initPanelWidthAuto();
		}

		if (grSet.lyricsRememberPanelState) {
			this.displayLyrics = grSet.lyricsPanelState;
		}
		else if (this.displayLyrics && grSet.lyricsLayout === 'full') {
			this.displayPlaylist = !this.displayPlaylist;
			this.resizeArtwork(true);
		}
		if (this.displayLyrics) {
			this.displayLyricsOnStart();
		}

		// * Init colors
		if (grSet.theme === 'random' && grSet.randomThemeAutoColor !== 'off') {
			grm.color.getRandomThemeAutoColor();
		}

		this.initThemeFull = true;
		if (grSet.theme.startsWith('custom')) this.initCustomTheme();
		this.initTheme();
		DebugLog('\n>>> initTheme => initMain <<<\n');
		this.loadingTheme = false;

		// * Restore backup workaround to successfully restore playlist files after foobar installation
		if (grSet.restoreBackupPlaylist) {
			setTimeout(() => {
				RestoreBackupPlaylist();
			}, !this.loadingTheme);
		}

		// * Hide loading screen
		setTimeout(() => {
			this.loadingThemeComplete = true;
			window.Repaint();
		}, 100);
	}

	/**
	 * Initializes size and position when noAlbumArtStub is being displayed.
	 */
	initNoAlbumArtSize() {
		const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

		this.albumArtSize.x =
			grSet.layout === 'default' &&  this.displayCustomThemeMenu && this.displayDetails ? this.ww * 0.3 :
			grSet.layout === 'default' && !this.displayCustomThemeMenu && this.displayDetails ||
			grSet.layout === 'artwork' &&  this.displayPlaylist ? this.ww :
			grSet.panelWidthAuto ?
				grSet.albumArtAlign === 'left' ? 0 :
				grSet.albumArtAlign === 'leftMargin' ? this.ww / this.wh > 1.8 ? SCALE(40) : 0 :
				grSet.albumArtAlign === 'center' ? Math.floor(this.ww * 0.25 - noAlbumArtSize * 0.5) :
				Math.floor(this.ww * 0.5 - noAlbumArtSize) :
			0;

		this.albumArtSize.y = this.topMenuHeight;

		this.albumArtSize.w =
			grSet.panelWidthAuto && this.noAlbumArtStub ? !fb.IsPlaying ? 0 : noAlbumArtSize :
			this.ww * 0.5;

		this.albumArtSize.h = noAlbumArtSize;
	}

	/**
	 * Initializes everything necessary in all panels without the need of a reload.
	 */
	initPanels() {
		// * Update Main
		this.createFonts();
		this.initMetrics();
		grm.timeline = new Timeline(this.timelineHeight);
		grm.gridTip = new MetadataGridTooltip(this.gridTooltipHeight);
		grm.lowerTip = new LowerBarTooltip();
		grm.jSearch = new JumpSearch(this.ww, this.wh);
		grm.volBtn = new VolumeButton();
		grm.progBar = new ProgressBar(this.ww, this.wh);
		grm.peakBar = new PeakmeterBar(this.ww, this.wh);
		grm.peakBar.on_size(this.ww, this.wh);
		grm.waveBar = new WaveformBar(this.ww, this.wh);
		grm.waveBar.updateBar();
		this.createButtonImages();
		this.createButtonObjects(this.ww, this.wh);
		this.resizeArtwork(true);
		grm.button.initButtonState();

		if (fb.GetNowPlaying()) on_metadb_changed(); // Refresh panel

		setTimeout(() => {
			// * Update Playlist
			PlaylistRescale(true);
			this.initPlaylist();
			pl.call.on_size(this.ww, this.wh);

			// * Update Library
			this.setLibrarySize();
			lib.panel.tree.y = lib.panel.search.h;
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
		}, this.loadingThemeComplete);
	}

	/**
	 * Initializes size and position of the current panel when using grSet.panelWidthAuto.
	 */
	initPanelWidthAuto() {
		this.resizeArtwork(true);

		if (this.displayLibrarySplit() || this.displayLibrary && grSet.libraryLayout === 'full') return;

		if (this.displayPlaylist && (this.noAlbumArtStub || pl.playlist.x !== this.albumArtSize.x + this.albumArtSize.w)) {
			DebugLog('initPanelWidthAuto -> Playlist');
			pl.call.on_size(this.ww, this.wh);
		}
		if (this.displayLibrary && (this.noAlbumArtStub || lib.ui.x !== this.albumArtSize.x + this.albumArtSize.w)) {
			DebugLog('initPanelWidthAuto -> Library');
			this.setLibrarySize();
		}
		if (this.displayBiography && (this.noAlbumArtStub || bio.ui.x + bio.ui.w !== this.albumArtSize.x + this.albumArtSize.w)) {
			DebugLog('initPanelWidthAuto -> Biography');
			this.setBiographySize();
		}
	}

	/**
	 * Initializes the theme when updating colors.
	 */
	initTheme() {
		const themeProfiler = this.showDebugTiming && fb.CreateProfiler('initTheme');

		const fullInit =
			this.initThemeFull || grSet.themeBrightness !== 'default'
			||
			libSet.theme !== 0 || bioSet.theme !== 0
			||
			grSet.theme === 'reborn' || grSet.theme === 'random'
			||
			grSet.styleBlackAndWhiteReborn || grSet.styleBlackReborn;

		// * INIT THEME PREFERENCES VALUES * //
		grm.theme.initThemePrefVals();
		grm.style.initThemePrefVals();

		// * SETUP COLORS * //
		grm.color.setImageBrightness();
		if (grSet.styleBlackAndWhiteReborn) {
			grm.style.initBlackAndWhiteReborn();
		}
		if (grSet.theme === 'random' && !this.isStreaming && !this.isPlayingCD) {
			grm.color.getRandomThemeColor();
		}
		if (this.noAlbumArtStub || this.isStreaming || this.isPlayingCD) {
			grm.color.setNoAlbumArtColors();
		}
		if ((grSet.styleBlend || grSet.styleBlend2 || grSet.styleProgressBarFill === 'blend') && this.albumArt) {
			grm.color.setStyleBlend();
		}
		if (grSet.themeDayNightMode && !grSet.themeSetupDay && !grSet.themeSetupNight) {
			this.initThemeDayNightState();
		}
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
		if (!fullInit) {
			return;
		}
		if (grSet.themeBrightness !== 'default') {
			grm.color.adjustThemeBrightness(grSet.themeBrightness);
		}
		if (grSet.playlistRowHover) {
			pl.playlist.title_color_change();
		}
		if (libImg.labels.overlayDark) {
			lib.ui.getItemColours();
		}
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
		this.createButtonImages();
		this.createButtonObjects(this.ww, this.wh);
		grm.button.initButtonState();

		// * REFRESH * //
		window.Repaint();

		if (themeProfiler) themeProfiler.Print();
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

		if (!grSet.themeDayNightMode || customTheme || customStyle || customPreset) {
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
				DebugLog('\n>>> initTheme => fetchNewArtwork => on_playback_new_track => themeDayNightModeTimer <<<\n');
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

		// * Restore last theme state
		if (grSet.presetSelectMode === 'default' && this.themeRestoreState) {
			DebugLog('\n>>> initThemeTags restore <<<\n');
			this.resetStyle('all');
			this.resetTheme();
			this.restoreThemeStylePreset(); // * Retore saved pref settings
			if (grSet.savedPreset !== false) grm.preset.setThemePreset(grSet.savedPreset);
			if (grSet.theme.startsWith('custom')) this.initCustomTheme();
			this.initStyleState();
			this.themeRestoreState = false;
		}

		// * Skip also restore on next call
		if (grSet.theme === grSet.savedTheme && !customTheme && !customStyle && !customPreset) {
			DebugLog('\n>>> initThemeTags skipped <<<\n');
			this.restoreThemeStylePreset(true); // * Reset saved pref settings
			this.themeRestoreState = false;
			return;
		}

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
		if (!customPreset.length) { // Prevent double initialization for theme presets to save performance, grMain.ui.updateStyle() already handled in setThemePreset()
			this.updateStyle();
		}
	}

	/**
	 * Initializes the custom themes to check if any are currently active.
	 */
	initCustomTheme() {
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
	 * Sets the theme to a factory reset state, used on the very first foobar start after installation or when resetting the theme.
	 */
	async systemFirstLaunch() {
		if (!grSet.systemFirstLaunch) return;

		this.initMain();
		await grm.settings.setThemeSettings(false, false, true);
		this.initMain();
		await grm.display.autoDetectRes();

		grSet.systemFirstLaunch = false;
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - COMMON * //
	// #region MAIN - PUBLIC METHODS - COMMON
	/**
	 * Clears all now playing related UI strings.
	 */
	clearUIVariables() {
		const showLowerBarVersion = grSet[`showLowerBarVersion_${grSet.layout}`];
		grStr.artist = '';
		grStr.tracknum = $(showLowerBarVersion ? grSet.layout !== 'default' ? grCfg.settings.stoppedString1acr : grCfg.settings.stoppedString1 : ' ', undefined, true);
		grStr.titleLower = $(showLowerBarVersion ? ` ${grCfg.settings.stoppedString2}` : ' ', undefined, true);
		grStr.year = '';
		grStr.grid = [];
		grStr.time = showLowerBarVersion || grCfg.updateAvailable ? grCfg.lowerBarStoppedTime : ' ';
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

		// * FONT SIZES * //
		const menuFontSize          = grSet[`menuFontSize_${grSet.layout}`];
		const menuCaptionFontSize   = grSet[`menuFontSize_${grSet.layout}`] + 1;
		const lowerBarFontSize      = grSet[`lowerBarFontSize_${grSet.layout}`];
		const notificationFontSize  = grSet[`notificationFontSize_${grSet.layout}`];
		const popupFontSize         = grSet[`popupFontSize_${grSet.layout}`];
		const tooltipFontSize       = grSet[`tooltipFontSize_${grSet.layout}`];

		const guiFxBtnFontSize      = grSet[`transportButtonSize_${grSet.layout}`] / 2;
		const pboDefaultBtnFontSize = grSet[`transportButtonSize_${grSet.layout}`] / 1.6;
		const pboReplayBtnFontSize  = grSet[`transportButtonSize_${grSet.layout}`] / 2;
		const pboShuffleBtnFontSize = grSet[`transportButtonSize_${grSet.layout}`] / 1.65;
		const reloadBtnFontSize     = grSet[`transportButtonSize_${grSet.layout}`] / 1.5;
		const addTrackBtnFontSize   = grSet[`transportButtonSize_${grSet.layout}`] / 1.5;
		const volumeBtnFontSize     = grSet[`transportButtonSize_${grSet.layout}`] / 1.33;

		const gridArtistFontSize    = grSet[`gridArtistFontSize_${grSet.layout}`];
		const gridTrackNumFontSize  = grSet[`gridTrackNumFontSize_${grSet.layout}`];
		const gridTitleFontSize     = grSet[`gridTitleFontSize_${grSet.layout}`];
		const gridAlbumFontSize     = grSet[`gridAlbumFontSize_${grSet.layout}`];
		const gridKeyFontSize       = grSet[`gridKeyFontSize_${grSet.layout}`];
		const gridValueFontSize     = grSet[`gridValueFontSize_${grSet.layout}`] + 1;

		const playlistFontSize      = grSet[`playlistFontSize_${grSet.layout}`];
		const libraryFontSize       = libSet[`baseFontSize_${grSet.layout}`];
		const biographyFontSize     = bioSet[`baseFontSizeBio_${grSet.layout}`];
		const lyricsFontSize        = grSet[`lyricsFontSize_${grSet.layout}`];

		// * STYLE CHANGE * //
		const artistTitle = grSet.showGridArtist_default && grSet.showGridTitle_default || grSet.showGridArtist_artwork && grSet.showGridTitle_artwork;

		// * TOP MENU BUTTONS * //
		grFont.topMenu        = Font(grFont.fontTopMenu, menuFontSize, 0);
		grFont.topMenuCaption = Font(grFont.fontTopMenuCaption, menuCaptionFontSize, 0);
		grFont.topMenuCompact = Font(grFont.fontAwesome, menuFontSize, 0);

		// * LOWER BAR * //
		grFont.lowerBarArtist = Font(grFont.fontLowerBarArtist, lowerBarFontSize, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.lowerBarTitle  = Font(grFont.fontLowerBarTitle,  lowerBarFontSize, 0);
		grFont.lowerBarDisc   = Font(grFont.fontLowerBarDisc,   lowerBarFontSize, 0);
		grFont.lowerBarTime   = Font(grFont.fontLowerBarTime,   lowerBarFontSize, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.lowerBarLength = Font(grFont.fontLowerBarLength, lowerBarFontSize, 0);
		grFont.lowerBarWave   = Font(grFont.fontLowerBarWave,   lowerBarFontSize - 6, grSet.customThemeFonts ? FontStyle.bold : 0);

		if (grCfg.updateHyperlink) grCfg.updateHyperlink.setFont(grFont.lowerBarTitle);

		// * LOWER BAR TRANSPORT BUTTONS * //
		grFont.guifx             = Font(grFont.fontGuiFx,   Math.floor(guiFxBtnFontSize), 0);
		grFont.pboDefault        = Font(grFont.fontGuiFx,   Math.floor(pboDefaultBtnFontSize), 0);
		grFont.pboRepeatPlaylist = Font(grFont.fontAwesome, Math.floor(pboReplayBtnFontSize), 0);
		grFont.pboRepeatTrack    = Font(grFont.fontAwesome, Math.floor(pboReplayBtnFontSize), 0);
		grFont.pboShuffle        = Font(grFont.fontGuiFx,   Math.floor(pboShuffleBtnFontSize), 0);
		grFont.guifxReload       = Font(grFont.fontGuiFx,   Math.floor(reloadBtnFontSize), 0);
		grFont.guifxAddTrack     = Font(grFont.fontGuiFx,   Math.floor(addTrackBtnFontSize), 0);
		grFont.guifxVolume       = Font(grFont.fontGuiFx,   Math.floor(volumeBtnFontSize), 0);

		// * MISC * //
		grFont.noAlbumArtStub = Font(grFont.fontAwesome, 160, 0);
		grFont.symbol         = Font(grFont.fontSegoeUISymbol, playlistFontSize, 0);
		grFont.notification   = Font(grFont.fontNotification, notificationFontSize, 0);
		grFont.popup          = Font(grFont.fontPopup, popupFontSize, 0);
		grFont.tooltip        = Font(grFont.fontTooltip, tooltipFontSize, 0);

		if (grSet.layout === 'compact') return; // These fonts below are not available in Compact layout, so skip these to prevent errors

		// * DETAILS METADATA GRID * //
		grFont.gridArtist      = Font(grFont.fontGridArtist, gridArtistFontSize, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.gridTrackNumber = Font(artistTitle ? grFont.fontGridTitle : grFont.fontGridTitleBold, gridTrackNumFontSize, 0);
		grFont.gridTitle       = Font(artistTitle ? grFont.fontGridTitle : grFont.fontGridTitleBold, gridTitleFontSize, 0);
		grFont.gridAlbum       = Font(grFont.fontGridAlbum, gridAlbumFontSize, grSet.customThemeFonts ? FontStyle.bold : 0);
		grFont.gridKey         = Font(grFont.fontGridKey, gridKeyFontSize, 0);
		grFont.gridVal         = Font(grFont.fontGridValue, gridValueFontSize, 0);

		// * LIBRARY * //
		grFont.library = Font(grFont.fontLibrary, libraryFontSize, 0);

		// * BIOGRAPHY * //
		grFont.biography = Font(grFont.fontBiography, biographyFontSize, 0);

		// * LYRICS * //
		grFont.lyrics          = Font(grFont.fontLyrics, lyricsFontSize, 1);
		grFont.lyricsHighlight = Font(grFont.fontLyrics, lyricsFontSize * 1.5, 1);
	}

	/**
	 * Repaints rectangles on the seekbar for real time update.
	 */
	refreshSeekbar() {
		// * Time
		window.RepaintRect(this.lowerBarTimeX, this.lowerBarTimeY, this.lowerBarTimeW + this.lowerBarTimeH * 0.3, this.lowerBarTimeH, grSet.spinDiscArt && !this.displayLyrics);

		if (grSet.seekbar === 'waveformbar') return;

		// * Progress bar
		const x = grSet.layout !== 'default' ? SCALE(18) : SCALE(38);
		const y = (grSet.seekbar === 'peakmeterbar' ? this.peakmeterBarY - SCALE(4) : this.progressBarY) - SCALE(2);
		const w = grSet.layout !== 'default' ? this.ww - SCALE(36) : this.ww - SCALE(76);
		const h = (grSet.seekbar === 'peakmeterbar' ? this.peakmeterBarH + SCALE(8) : this.progressBarH) + SCALE(4);
		window.RepaintRect(x, y, w, h, grSet.spinDiscArt && !this.displayLyrics);
	}

	/**
	 * Sets a given timer interval to update the progress bar.
	 */
	setProgressBarRefresh() {
		DebugLog('setProgressBarRefresh()');
		if (fb.PlaybackLength > 0) {
			const refreshRate = {
				// We want to update the progress bar for every pixel so divide total time by number of pixels in progress bar
				variable: Math.abs(Math.ceil(1000 / ((this.ww - SCALE(80)) / fb.PlaybackLength))),
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

			this.progressBarTimerInterval = refreshRate[grSet.seekbar === 'peakmeterbar' ? grSet.peakmeterBarRefreshRate : grSet.progressBarRefreshRate];

			if (grSet.progressBarRefreshRate === 'variable') {
				while (this.progressBarTimerInterval > 500) { // We want even multiples of the base progressBarTimerInterval, so that the progress bar always updates as smoothly as possible
					this.progressBarTimerInterval = Math.floor(this.progressBarTimerInterval / 2);
				}
				while (this.progressBarTimerInterval < 32) { // Roughly 30fps
					this.progressBarTimerInterval *= 2;
				}
			}
		}
		else { // * Radio streaming
			this.progressBarTimerInterval = 1000;
		}

		if (this.showDebugTiming) console.log(`Progress bar will update every ${this.progressBarTimerInterval}ms or ${1000 / this.progressBarTimerInterval} times per second.`);

		if (this.progressBarTimer) clearInterval(this.progressBarTimer);
		this.progressBarTimer = null;

		if (!fb.IsPaused) {
			this.progressBarTimer = setInterval(() => {
				this.refreshSeekbar();
			}, this.progressBarTimerInterval || 1000);
		}
	}

	/**
	 * Resets the current player size, used in top menu Options > Player size.
	 */
	resetPlayerSize() {
		grSet.playerSize_HD_small   = false;
		grSet.playerSize_HD_normal  = false;
		grSet.playerSize_HD_large   = false;
		grSet.playerSize_QHD_small  = false;
		grSet.playerSize_QHD_normal = false;
		grSet.playerSize_QHD_large  = false;
		grSet.playerSize_4K_small   = false;
		grSet.playerSize_4K_normal  = false;
		grSet.playerSize_4K_large   = false;
	}

	/**
	 * Resets the theme when changing to a different one, used in top menu Options > Theme.
	 */
	resetTheme() {
		this.initThemeFull = true;

		const invalidNighttimeStyle = grSet.theme !== 'reborn' && grSet.theme !== 'random' && !grSet.theme.startsWith('custom') || grSet.styleRebornWhite || grSet.styleRebornBlack;
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

		grm.color.getThemeColors(this.albumArt);

		// * Update default theme colors when nothing is playing or when changing themes
		if (!fb.IsPlaying) grm.color.setThemeColors();
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
	 * Restores theme, style, preset after custom %GR_THEME%, %GR_STYLE%, %GR_PRESET% usage or in theme sandbox.
	 * Used in initThemeTags() and theme sandbox options.
	 * @param {boolean} reset - Determines whether to reset the theme style preset or restore it.
	 */
	restoreThemeStylePreset(reset) {
		/**
		 * Sets or resets an individual setting based on the reset flag.
		 * When reset is true, the value of prefKey is saved to savedKey.
		 * When reset is false, the saved value in savedKey is restored to prefKey.
		 * @param {object} prefObj - The preferences object containing the settings.
		 * @param {string} prefKey - The key for the current setting to be set or restored.
		 * @param {string} savedKey - The key for the saved setting to set or restore from.
		 * @private
		 */
		const _setSetting = (prefObj, prefKey, savedKey) => {
			if (reset) {
				prefObj[savedKey] = prefObj[prefKey];
			} else {
				prefObj[prefKey] = prefObj[savedKey];
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

		if (reset) {
			grSet.savedPreset = false;
		} else {
			grSet.preset = grSet.savedPreset;
		}
	}

	/**
	 * Sets the chosen style based by its current state. Used when changing styles in top menu Options > Style.
	 * @param {string} style - The selected style.
	 * @param {boolean} state - The state of the selected style will be either activated or deactivated.
	 * @returns {void} No return value.
	 */
	setStyle(style, state) {
		const _day_night = grSet.themeSetupDay ? '_day' : '_night';

		if (grSet.themeSetupDay || grSet.themeSetupNight) {
			this.resetStyle('all_theme_day_night');
		}

		const themeStyles = {
			blend: () => {               this.resetStyle('group_one'); grSet[`styleBlend${_day_night}`] = grSet.styleBlend = state; },
			blend2: () => {              this.resetStyle('group_one'); grSet[`styleBlend2${_day_night}`] = grSet.styleBlend2 = state; },
			gradient: () => {            this.resetStyle('group_one'); grSet[`styleGradient${_day_night}`] = grSet.styleGradient = state; },
			gradient2: () => {           this.resetStyle('group_one'); grSet[`styleGradient2${_day_night}`] = grSet.styleGradient2 = state; },
			alternative: () => {         this.resetStyle('group_two'); grSet[`styleAlternative${_day_night}`] = grSet.styleAlternative = state; },
			alternative2: () => {        this.resetStyle('group_two'); grSet[`styleAlternative2${_day_night}`] = grSet.styleAlternative2 = state; },
			blackAndWhite: () => {       this.resetStyle('group_two'); grSet[`styleBlackAndWhite${_day_night}`] = grSet.styleBlackAndWhite = state; },
			blackAndWhite2: () => {      this.resetStyle('group_two'); grSet[`styleBlackAndWhite2${_day_night}`] = grSet.styleBlackAndWhite2 = state; },
			blackAndWhiteReborn: () => { this.resetStyle('group_two'); grSet[`styleBlackAndWhiteReborn${_day_night}`] = grSet.styleBlackAndWhiteReborn = state; },
			blackReborn: () => {         this.resetStyle('group_two'); grSet[`styleBlackReborn${_day_night}`] = grSet.styleBlackReborn = state; },
			rebornWhite: () => {         this.resetStyle('group_two'); grSet[`styleRebornWhite${_day_night}`] = grSet.styleRebornWhite = state; grSet[`themeBrightness${_day_night}`] = grSet.themeBrightness = 'default'; },
			rebornBlack: () => {         this.resetStyle('group_two'); grSet[`styleRebornBlack${_day_night}`] = grSet.styleRebornBlack = state; grSet[`themeBrightness${_day_night}`] = grSet.themeBrightness = 'default'; },
			rebornFusion: () => {        this.resetStyle('group_two'); grSet[`styleRebornFusion${_day_night}`] = grSet.styleRebornFusion = state; },
			rebornFusion2: () => {       this.resetStyle('group_two'); grSet[`styleRebornFusion2${_day_night}`] = grSet.styleRebornFusion2 = state; },
			rebornFusionAccent: () => {  this.resetStyle('group_two'); grSet[`styleRebornFusionAccent${_day_night}`] = grSet.styleRebornFusionAccent = state; },
			randomPastel: () => {        this.resetStyle('group_two'); grSet[`styleRandomPastel${_day_night}`] = grSet.styleRandomPastel = state; },
			randomDark: () => {          this.resetStyle('group_two'); grSet[`styleRandomDark${_day_night}`] = grSet.styleRandomDark = state; }
		};

		return themeStyles[style]();
	}

	/**
	 * Sets a new random theme preset.
	 */
	setRandomThemePreset() {
		if (grSet.presetSelectMode === 'theme') {
			this.setThemePresetSelection(false, true);
		}
		if ((!['off', 'track'].includes(grSet.presetAutoRandomMode) && grSet.presetSelectMode === 'harmonic' ||
			grSet.presetAutoRandomMode === 'dblclick' && grSet.presetSelectMode === 'theme') && !this.doubleClicked) {
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

		if (['white', 'black', 'reborn', 'random'].includes(grSet.theme)) {
			// * Update grCol.primary for dynamic themes
			if (fb.IsPlaying) {
				grm.color.getThemeColors(this.albumArt);
			} else {
				grm.color.setThemeColors();
			}
		}

		this.initTheme();
		DebugLog('\n>>> initTheme => updateStyle <<<\n');
		if (grSet.theme === 'random' && grSet.randomThemeAutoColor !== 'off') grm.color.getRandomThemeAutoColor();
		this.initStyleState();
		grm.preset.initThemePresetState();
		grm.button.initButtonState();
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - CONTROLS * //
	// #region MAIN - PUBLIC METHODS - CONTROLS
	/**
	 * Displays the panel, mostly used for the custom menu.
	 * @param {string} panel - The panel to display:
	 * - 'playlist'
	 * - 'details'
	 * - 'library'
	 * - 'biography'
	 * - 'lyrics'
	 */
	displayPanel(panel) {
		this.displayPlaylist  = false;
		this.displayDetails   = false;
		this.displayLibrary   = false;
		this.displayBiography = false;
		this.displayLyrics    = false;

		const panelActions = {
			playlist:  () => { this.displayPlaylist  = true; },
			details:   () => { this.displayDetails   = true; },
			library:   () => { this.displayLibrary   = true; },
			biography: () => { this.displayBiography = true; },
			lyrics:    () => { this.displayPlaylist  = true; this.displayLyrics = true; }
		};

		if (panelActions[panel]) {
			panelActions[panel]();
		}

		this.resizeArtwork(true);
		grm.button.initButtonState();
	}

	/**
	 * Displays and controls the user set panel state on startup and when playback is being started or stopped.
	 * This method is used for:
	 * - Options > Player controls > Panel > Show panel on startup.
	 * - Options > Player controls > Panel > Return to home on playback stop.
	 */
	displayPanelControl() {
		if (!grSet.returnToHomeOnPlaybackStop && !grSet.showPanelOnStartup) {
			return;
		}

		this.displayPlaylist = false;
		this.displayPlaylistArtwork = false;
		this.displayDetails = false;
		this.displayLibrary = false;
		this.displayBiography = false;
		this.displayLyrics = false;

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
					this.resizeArtwork(true);
				}
				this.displayDetails = true;
			},
			library: () => {
				this.displayPlaylist = this.displayLibrarySplit();
				this.displayLibrary = true;
			},
			biography: () => {
				this.displayPlaylist = true;
				this.displayBiography = true;
			},
			lyrics: () => {
				this.displayPlaylist = grSet.layout === 'default';
				this.displayLyrics = true;
			}
		};

		if (panelActions[grSet.showPanelOnStartup]) {
			panelActions[grSet.showPanelOnStartup]();
		}

		if (grSet.layout === 'compact') { // Override, needs to be always Playlist panel for Compact layout
			this.displayPlaylist = true;
		}

		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Displays the Library and Playlist side by side, called when Library layout is in split mode.
	 * @param {boolean} control - Limits the area to the width and height of the playlist panel.
	 * @returns {boolean} True if Library and Playlist are being displayed.
	 */
	displayLibrarySplit(control) {
		return grSet.layout === 'default' && grSet.libraryLayout === 'split' && this.displayLibrary && this.displayPlaylist &&
		(control ? this.state.mouse_x > pl.playlist.x && this.state.mouse_x <= pl.playlist.x + pl.playlist.w &&
				   this.state.mouse_y > pl.playlist.y && this.state.mouse_y <= pl.playlist.y + pl.playlist.h : this.ww);
	}

	/**
	 * Displays Lyrics on startup or when remembering the Lyrics panel state.
	 */
	displayLyricsOnStart() {
		fb.Play();
		this.displayPlaylist = grSet.layout === 'default';
		setTimeout(() => {
			if (!grSet.lyricsRememberPanelState) {
				grSet.lyricsPanelState = false;
			}
			this.displayLyrics = true;
			grm.lyrics.initLyrics();
			grm.button.initButtonState();
		}, 500);
	}

	/**
	 * Restores the Lyrics layout to full width.
	 */
	restoreLyricsLayout() {
		if (!this.displayLyrics || !this.lyricsLayoutFullWidth) return;
		if (!this.displayBiography) this.displayPlaylist = false;
		grSet.lyricsLayout = 'full';
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - GRAPHICS * //
	// #region MAIN - PUBLIC METHODS - GRAPHICS
	/**
	 * Creates the top menu and lower bar button images for button state 'Enabled', 'Hovered', 'Down'.
	 */
	createButtonImages() {
		const createButtonProfiler = this.showExtraDrawTiming && fb.CreateProfiler('createButtonImages');
		const transportCircleSize = Math.round(grSet[`transportButtonSize_${grSet.layout}`] * 0.93333);
		let btns = {};

		try {
			btns = {
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
					type: 'window',
					w: 22,
					h: 22
				},
				Maximize: {
					ico: '2',
					font: grFont.topMenuCaption,
					type: 'window',
					w: 22,
					h: 22
				},
				Close: {
					ico: 'r',
					font: grFont.topMenuCaption,
					type: 'window',
					w: 22,
					h: 22
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
				MediaLibrary: {
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
				PlaylistArtworkLayout: {
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
					w: 22,
					h: 22
				},
				Forward: {
					ico: '\uE00F',
					type: 'backforward',
					font: grFont.symbol,
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

		this.btnImg = [];

		for (const i in btns) {
			if (btns[i].type === 'menu') {
				const img = gdi.CreateImage(100, 100);
				const g = img.GetGraphics();
				const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);

				btns[i].w = Math.ceil(measurements.Width + 20);
				btns[i].h = Math.ceil(measurements.Height + 5);
				img.ReleaseGraphics(g);
			}

			if (btns[i].type === 'compact') {
				const img = gdi.CreateImage(100, 100);
				const g = img.GetGraphics();
				const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);

				btns[i].w = Math.ceil(measurements.Width + (RES._4K ? 32 : 41));
				btns[i].h = Math.ceil(measurements.Height + (RES._4K ? -2 : 5));
				img.ReleaseGraphics(g);
			}

			// const { x, y } = btns[i];
			let { w, h } = btns[i];
			const lineW = SCALE(2);

			if (RES._4K && btns[i].type === 'transport') {
				w *= 2;
				h *= 2;
			} else if (RES._4K && btns[i].type !== 'menu') {
				w = Math.round(btns[i].w * 1.5);
				h = Math.round(btns[i].h * 1.6);
			} else if (RES._4K) {
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
				if (btns[i].type !== 'transport' && !grSet.customThemeFonts) {
					g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				}
				// * Positions some top menu buttons weirdly when using custom theme fonts on AntiAliasGridFit and vertical/horizontal centered font alignment, i.e StringFormat(1, 1);
				else if ((btns[i].type === 'menu' || btn.type === 'compact') && grSet.customThemeFonts || btns[i].type === 'transport') {
					g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
				}

				let menuTextColor = grCol.menuTextNormal;
				let menuRectColor = grCol.menuRectNormal;
				let menuBgColor = grCol.menuBgColor;
				let transportIconColor = grCol.transportIconNormal;
				let transportEllipseColor = grCol.transportEllipseNormal;
				// let iconAlpha = 255; // Used for images only and not used atm

				switch (state) {
					case ButtonState.Hovered:
						menuTextColor = grCol.menuTextHovered;
						menuRectColor = grCol.menuRectHovered;
						menuBgColor = grCol.menuBgColor;
						transportIconColor = grCol.transportIconHovered;
						transportEllipseColor = grCol.transportEllipseHovered;
						// iconAlpha = 215;
						break;
					case ButtonState.Down:
						menuTextColor = grCol.menuTextDown;
						menuRectColor = grCol.menuRectDown;
						menuBgColor = grCol.menuBgColor;
						transportIconColor = grCol.transportIconDown;
						transportEllipseColor = grCol.transportEllipseDown;
						// iconAlpha = 215;
						break;
					case ButtonState.Enabled:
						// iconAlpha = 255;
						break;
				}

				switch (btn.type) {
					case 'menu': case 'window': case 'compact':
						if (grSet.styleTopMenuButtons === 'default' || grSet.styleTopMenuButtons === 'filled') {
							if (grSet.styleTopMenuButtons === 'filled') state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 3, 3, menuBgColor);
							state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 3, 3, 1, menuRectColor);
						}
						else if (grSet.styleTopMenuButtons === 'bevel') {
							state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
							state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, grCol.menuStyleBg, 1);
							state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, 1, menuRectColor);
						}
						else if (grSet.styleTopMenuButtons === 'inner') {
							state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
							state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, grCol.menuStyleBg, 0);
							state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, 1, menuRectColor);
						}
						else if (grSet.styleTopMenuButtons === 'emboss') {
							state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
							state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, grCol.menuStyleBg, 0.33);
							state && g.DrawRoundRect(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 1, 4, 4, 1, grCol.menuRectStyleEmbossTop);
							state && g.DrawRoundRect(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2), w - lineW - 2, h - lineW - 1, 4, 4, 1, grCol.menuRectStyleEmbossBottom);
						}
						if (btn.type === 'compact') {
							g.DrawString('\uf0c9', grFont.topMenuCompact, menuTextColor, RES._4K ? -39 : -19, 0, w, h, StringFormat(1, 1));
							g.DrawString(btn.ico, btn.font, menuTextColor, RES._4K ? 20 : 10, RES._4K ? -1 : 0, w, h, StringFormat(1, 1));
						} else {
							g.DrawString(btn.ico, btn.font, menuTextColor, 0, 0, w, btn.type === 'window' ? h : h - 1, StringFormat(1, 1));
						}
						break;

					case 'transport':
						if (grSet.styleTransportButtons === 'default') {
							g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, lineW, transportEllipseColor);
							g.FillEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, grCol.transportEllipseBg);
						}
						else if (grSet.styleTransportButtons === 'bevel') {
							g.FillEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW - 1, h - lineW - 1, grCol.transportStyleTop);
							g.DrawEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW - 1, h - lineW, 1, grCol.transportStyleBottom);
							FillGradEllipse(g, Math.floor(lineW / 2) - 0.5, Math.floor(lineW / 2), w + 0.5, h + 0.5, 90, 0, grCol.transportStyleBg, 1);
						}
						else if (grSet.styleTransportButtons === 'inner') {
							g.FillEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW - 1, grCol.transportStyleTop);
							g.DrawEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2) - 1, w - lineW, h - lineW + 1, 1, grCol.transportStyleBottom);
							FillGradEllipse(g, Math.floor(lineW / 2) - 0.5, Math.floor(lineW / 2), w + 1.5, h + 0.5, 90, 0, grCol.transportStyleBg, 0);
						}
						else if (grSet.styleTransportButtons === 'emboss') {
							g.FillEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, grCol.transportEllipseBg);
							FillGradEllipse(g, Math.floor(lineW / 2) + 2, Math.floor(lineW / 2) + 2, w - lineW - 2, h - lineW - 2, 90, 0, grCol.transportStyleBg, 0.33);
							g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 2, w - lineW - 2, h - lineW - 3, lineW, grCol.transportStyleTop);
							g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2), w - lineW - 2, h - lineW - 2, lineW, grCol.transportStyleBottom);
						}
						g.DrawString(btn.ico, btn.font, transportIconColor, 1, (['Stop', 'Reload', 'AddTracks'].includes(i)) ? 0 : 1, w, h, StringFormat(1, 1));
						break;

					case 'backforward':
						g.DrawString(btn.ico, btn.font, pl.col.plman_text_hovered, i === 'Back' ? -1 : 0, 0, w, h, StringFormat(1, 1));
						break;
				}

				img.ReleaseGraphics(g);
				stateImages[state] = img;
			}

			this.btnImg[i] = stateImages;
		}

		if (createButtonProfiler) createButtonProfiler.Print();
	}

	/**
	 * Creates the top menu and lower bar transport buttons.
	 * @param {number} ww - The window.Width.
	 * @param {number} wh - The window.Height.
	 */
	createButtonObjects(ww, wh) {
		this.btn = [];
		const menuFontSize = grSet[`menuFontSize_${grSet.layout}`];
		const showingMinMaxButtons = !!(UIHacks && UIHacks.FrameStyle);
		const showTransportControls = grSet[`showTransportControls_${grSet.layout}`];

		if (ww <= 0 || wh <= 0) {
			return;
		} else if (this.btnImg.length === 0) {
			this.createButtonImages();
		}

		// * TOP MENU BUTTONS * //
		/** @type {GdiBitmap[]} */
		let img = this.btnImg.File;
		const w = img[0].Width;
		const h = img[0].Height;
		let   x = RES._4K ? 18 : 8;
		const y = Math.round(this.topMenuHeight * 0.5 - h * 0.5 - SCALE(1));

		// Top menu font size X-correction for Artwork and Compact layout
		const xOffset = ww > SCALE(grSet.layout === 'compact' ? 570 : 620) ? 0 :
		menuFontSize === 13 && !RES._QHD ? SCALE(3) :
		menuFontSize === 14 && !RES._QHD ? SCALE(5) :
		menuFontSize === 16  ?  RES._QHD ? 4 : SCALE(12) : 0;

		const widthCorrection =
			RES._4K ? (grSet.customThemeFonts && menuFontSize > 12 && ww < 1080) ? 12 : (grSet.customThemeFonts && menuFontSize > 10 && ww < 1080) ? 6 : 3 :
					  (grSet.customThemeFonts && menuFontSize > 12 && ww <  600) ?  6 : (grSet.customThemeFonts && menuFontSize > 10 && ww <  600) ? 4 : 0;
		const correction = widthCorrection + (grSet.layout !== 'default' ? xOffset : 0);

		// * Top menu compact
		if (grSet.showTopMenuCompact) {
			img = this.btnImg.TopMenu;
			this.btn[19] = new Button(x, y, w + SCALE(41), h, 'Menu', img, 'Open menu');
		}

		// * Default foobar2000 buttons
		if (!grSet.showTopMenuCompact) {
			img = this.btnImg.File;
			this.btn[20] = new Button(x, y, w, h, 'File', img);
		}

		// These buttons are not available in Artwork layout
		if (grSet.layout !== 'artwork') {
			x += img[0].Width - correction;
			img = this.btnImg.Edit;
			if (!grSet.showTopMenuCompact) this.btn[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

			x += img[0].Width - correction;
			img = this.btnImg.View;
			if (!grSet.showTopMenuCompact) this.btn[22] = new Button(x, y, img[0].Width, h, 'View', img);

			x += img[0].Width - correction;
			img = this.btnImg.Playback;
			if (!grSet.showTopMenuCompact) this.btn[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

			x += img[0].Width - correction;
			img = this.btnImg.MediaLibrary;
			if (!grSet.showTopMenuCompact) this.btn[24] = new Button(x, y, img[0].Width, h, 'Library', img);

			x += img[0].Width - correction;
			img = this.btnImg.Help;
			if (!grSet.showTopMenuCompact) this.btn[25] = new Button(x, y, img[0].Width, h, 'Help', img);

			x += img[0].Width - correction;
			img = this.btnImg.Playlists;
			if (!grSet.showTopMenuCompact) this.btn[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);
		}

		// * Theme buttons
		const showPanelDetails   = grSet[`showPanelDetails_${grSet.layout}`];
		const showPanelLibrary   = grSet[`showPanelLibrary_${grSet.layout}`];
		const showPanelBiography = grSet[`showPanelBiography_${grSet.layout}`];
		const showPanelLyrics    = grSet[`showPanelLyrics_${grSet.layout}`];
		const showPanelRating    = grSet[`showPanelRating_${grSet.layout}`];

		const buttonCount = (showPanelDetails ? 1 : 0) + (showPanelLibrary ? 1 : 0) + (showPanelBiography ? 1 : 0) + (showPanelLyrics ? 1 : 0) + (showPanelRating ? 1 : 0);
		const buttonXCorr = 0.33 + (buttonCount === 5 ? 0 : buttonCount === 4 ? 0.3 : buttonCount === 3 ? 0.6 : buttonCount === 2 ? 1.5 : buttonCount === 1 ? 4 : 0);

		x += img[0].Width - widthCorrection;
		if (grSet.layout === 'artwork') x -= xOffset;
		// Options button is available in all layouts
		img = this.btnImg.Options;
		if (!grSet.showTopMenuCompact) this.btn[27] = new Button(x, y, img[0].Width, h, 'Options', img, 'Theme options');

		// These buttons are not available in Compact layout
		if (grSet.layout !== 'compact') {
			if (grSet.topMenuAlignment === 'center' && ww > SCALE(grSet.layout === 'artwork' ? 600 : 1380) || grSet.showTopMenuCompact) {
				const centerMenu = Math.ceil(w * (buttonCount + (grSet.layout === 'artwork' && grSet.topMenuCompact ? 0.5 : 0)) + (menuFontSize * buttonCount * buttonXCorr));
				x = Math.round(ww * 0.5 - centerMenu);
			}

			if (showPanelDetails) {
				x += img[0].Width - correction;
				img = this.btnImg.Details;
				this.btn.details = new Button(x, y, img[0].Width, h, 'Details', img, 'Display Details');

				// Playlist button only available in Artwork layout
				if (grSet.layout === 'artwork') {
					x += img[0].Width - correction;
					img = this.btnImg.PlaylistArtworkLayout;
					this.btn.playlistArtworkLayout = new Button(x, y, img[0].Width, h, 'PlaylistArtworkLayout', img, 'Display Playlist');
				}
			}
			if (showPanelLibrary) {
				x += img[0].Width - correction;
				img = this.btnImg.Library;
				this.btn.library = new Button(x, y, img[0].Width, h, 'library', img, 'Display Library');
			}
			if (showPanelBiography) {
				x += img[0].Width - correction;
				img = this.btnImg.Biography;
				this.btn.biography = new Button(x, y, img[0].Width, h, 'Biography', img, 'Display Biography');
			}
			if (showPanelLyrics) {
				x += img[0].Width - correction;
				img = this.btnImg.Lyrics;
				this.btn.lyrics = new Button(x, y, img[0].Width, h, 'Lyrics', img, 'Display Lyrics');
			}
			if (showPanelRating) {
				x += img[0].Width - correction;
				img = this.btnImg.Rating;
				this.btn.rating = new Button(x, y, img[0].Width, h, 'Rating', img, 'Rate Song');
			}
		}

		// * Top menu 🗕 🗖 ✖ caption buttons
		if (showingMinMaxButtons) {
			const hideClose = UIHacks.FrameStyle === FrameStyle.SmallCaption && UIHacks.FullScreen !== true;

			const w = SCALE(22);
			const h = w;
			const p = 3;
			const x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - (RES._4K ? 21 : 14);
			const y = Math.round(this.topMenuHeight * 0.5 - h * 0.5 - SCALE(1));

			if (grSet.layout === 'default') {
				this.btn.Minimize = new Button(x, y, w, h, 'Minimize', this.btnImg.Minimize);
				this.btn.Maximize = new Button(x + w + p, y, w, h, 'Maximize', this.btnImg.Maximize);
				if (!hideClose) {
					this.btn.Close = new Button(x + (w + p) * 2, menuFontSize < 10 ? y + 1 : y, menuFontSize < 10 ? w - 1 : w, menuFontSize < 10 ? h - 1 : h, 'Close', this.btnImg.Close);
				}
			}
			else {
				this.btn.Minimize = new Button(x + w + p, y, w, h, 'Minimize', this.btnImg.Minimize);
				if (!hideClose) {
					this.btn[12] = new Button(x + (w + p) * 2, y, w, h, 'Close', this.btnImg.Close);
				}
			}
		}

		// * LOWER BAR TRANSPORT BUTTONS * //
		if (showTransportControls) {
			const lowerBarFontSize     = grSet[`lowerBarFontSize_${grSet.layout}`];
			const showPlaybackOrderBtn = grSet[`showPlaybackOrderBtn_${grSet.layout}`];
			const showReloadBtn        = grSet[`showReloadBtn_${grSet.layout}`];
			const showAddTrackskBtn    = grSet[`showAddTracksBtn_${grSet.layout}`];
			const showVolumeBtn        = grSet[`showVolumeBtn_${grSet.layout}`];
			const transportBtnSize     = grSet[`transportButtonSize_${grSet.layout}`];
			const transportBtnSpacing  = grSet[`transportButtonSpacing_${grSet.layout}`];

			let count = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

			const buttonSize = SCALE(transportBtnSize);
			const y = wh - buttonSize - SCALE(grSet.layout !== 'default' ? 36 : 78) + SCALE(lowerBarFontSize);
			const w = buttonSize;
			const h = w;
			const p = SCALE(transportBtnSpacing); // Space between buttons
			const x = (ww - w * count - p * (count - 1)) / 2;

			const calcX = (index) => x + (w + p) * index;

			count = 0;
			this.btn.stop = new Button(x, y, w, h, 'Stop', this.btnImg.Stop, grm.button.lowerTransportTooltip('stop'));
			this.btn.prev = new Button(calcX(++count), y, w, h, 'Previous', this.btnImg.Previous, grm.button.lowerTransportTooltip('prev'));
			this.btn.play = new Button(calcX(++count), y, w, h, 'PlayPause', !fb.IsPlaying || fb.IsPaused ? this.btnImg.Play : this.btnImg.Pause, grm.button.lowerTransportTooltip('play'));
			this.btn.next = new Button(calcX(++count), y, w, h, 'Next', this.btnImg.Next, grm.button.lowerTransportTooltip('next'));

			if (showPlaybackOrderBtn) {
				switch (plman.PlaybackOrder) {
					case 0:
						this.btn.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', this.btnImg.PlaybackDefault);
						break;
					case 1:
						this.btn.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', this.btnImg.PlaybackRepeatPlaylist);
						break;
					case 2:
						this.btn.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', this.btnImg.PlaybackRepeatTrack);
						break;
					case 3:	case 4:	case 5: case 6:
						this.btn.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', this.btnImg.PlaybackShuffle);
						break;
				}
			}
			if (showReloadBtn) {
				this.btn.reload = new Button(calcX(++count), y, w, h, 'Reload', this.btnImg.Reload, grm.button.lowerTransportTooltip('reload'));
			}
			if (showAddTrackskBtn) {
				this.btn.addTracks = new Button(calcX(++count), y, w, h, 'AddTracks', this.btnImg.AddTracks, grm.button.lowerTransportTooltip('addTracks'));
			}
			if (showVolumeBtn) {
				this.btn.volume = new Button(calcX(++count), y, w, h, 'Volume', this.btnImg.ShowVolume);
				grm.volBtn.setPosition(this.btn.volume.x, y, w);
			}
		}
	}

	/**
	 * Loads country flags when defined in tags, displayed in the lower bar and Details.
	 */
	loadCountryFlags() {
		this.flagImgs = [];
		for (const country of GetMetaValues(grTF.artist_country)) {
			const flagImage = this.loadFlagImage(country);
			flagImage && this.flagImgs.push(flagImage);
		}
	}

	/**
	 * Loads flag images from the image directory based on the country name or ISO country code provided.
	 * @param {string} country - The country for which we want to load the flag image.
	 * @returns {GdiBitmap} The flag image object.
	 */
	loadFlagImage(country) {
		const countryName = (ConvertIsoCountryCodeToFull(country) || country).trim().replace(/ /g, '-'); // In case we have a 2-digit country code
		const path = `${$($Escape(grPath.flagsBase)) + (RES._4K ? '64\\' : '32\\') + countryName}.png`;
		return gdi.Image(path);
	}
	// #endregion

	// * MAIN - PUBLIC METHODS - ALBUM ART * //
	// #region MAIN - PUBLIC METHODS - ALBUM ART
	/**
	 * Scales album art to a global size, handling potential errors.
	 * @throws Logs an error if the scaling operation fails.
	 */
	createScaledAlbumArt() {
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
			this.noArtwork = true;
			this.noAlbumArtStub = true;
			this.albumArtCorrupt = true;
			this.albumArt = null;
			this.albumArtSize = new ImageSize(0, this.topMenuHeight, 0, 0);
			setTimeout(() => {
				const msg = 'Album art could not be properly parsed!\n\nMaybe it is corrupt, file format is not supported\nor has an unusual ICC profile embedded.\n\n\n';
				ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
			}, 1000);
		}
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
	 * Displays the next artwork image when cycling through album artworks with a default 30 sec interval or when using album art context menu.
	 */
	displayNextImage() {
		DebugLog(`Repainting in displayNextImage: ${this.albumArtIndex}`);
		this.albumArtIndex = (this.albumArtIndex + 1) % this.albumArtList.length;
		this.loadImageFromAlbumArtList(this.albumArtIndex);
		if (grSet.theme === 'reborn' || grSet.theme === 'random' || grSet.styleBlackAndWhiteReborn || grSet.styleBlackReborn) {
			this.newTrackFetchingArtwork = true;
			grm.color.getThemeColors(this.albumArt);
			this.initTheme();
			DebugLog('\n>>> initTheme => displayNextImage <<<\n');
		}
		this.lastLeftEdge = 0;
		this.resizeArtwork(true); // Needed to readjust discArt shadow size if artwork size changes
		RepaintWindow();
		this.albumArtTimeout = setTimeout(() => {
			this.displayNextImage();
		}, grCfg.settings.artworkDisplayTime * 1000);
		grm.button.initButtonState();
	}

	/**
	 * Fetches new album art when a new album is being played or when cycling through album artworks.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	fetchAlbumArt(metadb) {
		this.albumArtList = [];

		const fetchAlbumArtProfiler = this.showDebugTiming && fb.CreateProfiler('fetchAlbumArt');

		const autoRandomPreset =
			(!['off', 'track'].includes(grSet.presetAutoRandomMode) && grSet.presetSelectMode === 'harmonic' ||
			grSet.presetAutoRandomMode === 'dblclick' && grSet.presetSelectMode === 'theme') && !this.doubleClicked;

		if (this.isStreaming || this.isPlayingCD) {
			this.discArt = this.disposeDiscArt(this.discArt);
			this.discArtCover = this.disposeDiscArt(this.discArtCover);
			this.albumArt = utils.GetAlbumArtV2(metadb);
			grSet.showGridTitle_default = true;
			grSet.showGridTitle_artwork = true;
			if (this.albumArt) {
				grm.color.getThemeColors(this.albumArt);
				this.resizeArtwork(true);
			} else {
				this.noArtwork = true;
				this.shadowImg = null;
			}
			this.initTheme();
			DebugLog('\n>>> initTheme => fetchNewArtwork => isStreaming || isPlayingCD <<<\n');
		}
		else {
			this.albumArtList = grCfg.imgPaths && grCfg.imgPaths.map(path => utils.Glob($(path), FileAttributes.Directory | FileAttributes.Hidden)).flat();
			const filteredFileTypes = grSet.filterDiscJpgsFromAlbumArt ? '(png|jpg)' : 'png';
			const pattern = new RegExp(`(cd|disc|vinyl|${grCfg.settings.discArtBasename})([0-9]*|[a-h]).${filteredFileTypes}`, 'i');
			const imageType = /(jpg|png)$/i;
			// * Remove duplicates and cd/vinyl art and make sure all files are jpg or pngs
			this.albumArtList = [...new Set(this.albumArtList)].filter(path => !pattern.test(path) && imageType.test(path));

			// * Try loading album art from artwork image paths
			if (this.albumArtList.length && !grSet.loadEmbeddedAlbumArtFirst) {
				this.noArtwork = false;
				this.noAlbumArtStub = false;
				this.albumArtEmbedded = false;
				if (this.albumArtList.length > 1 && grSet.cycleArt) {
					this.albumArtTimeout = setTimeout(() => {
						this.displayNextImage();
					}, grCfg.settings.artworkDisplayTime * 1000);
				}
				this.albumArtIndex = 0;
				this.loadImageFromAlbumArtList(this.albumArtIndex); // Display first image
			}
			// * If not found, try embedded artwork from music file
			else if (metadb && (this.albumArt = utils.GetAlbumArtV2(metadb))) {
				this.discArtCover = grm.artCache.encache(utils.GetAlbumArtV2(metadb), this.albumArtList[metadb], 2);
				this.noArtwork = false;
				this.noAlbumArtStub = false;
				if (autoRandomPreset) { // Prevent double initialization for theme presets to save performance, grMain.color.getThemeColors() and grMain.ui.initTheme() already handled in getRandomThemePreset()
					this.setRandomThemePreset();
				} else {
					this.initThemeTags();
					grm.color.getThemeColors(this.albumArt);
					if (!this.loadingTheme) {
						this.initTheme(); // * Prevent incorrect theme brightness at startup/reload when using embedded art
						DebugLog('\n>>> initTheme => fetchNewArtwork => albumArtEmbedded <<<\n');
					}
				}
				if (grSet.panelWidthAuto) {
					this.initPanelWidthAuto();
				} else {
					this.resizeArtwork(true);
				}
				this.albumArtEmbedded = true;
			}
			// * No album art found, using noAlbumArtStub
			else {
				this.noArtwork = true;
				this.noAlbumArtStub = true;
				this.albumArt = null;
				this.discArtCover = null;
				this.initTheme();
				DebugLog('\n>>> initTheme => fetchNewArtwork => noAlbumArtStub <<<\n');
				if (grSet.panelWidthAuto) {
					this.initPanelWidthAuto();
				} else {
					this.resizeArtwork(true);
				}
				DebugLog('Repainting on_playback_new_track due to no cover image');
				RepaintWindow();
			}
		}

		if (fetchAlbumArtProfiler) fetchAlbumArtProfiler.Print();
	}

	/**
	 * Fetches new album art/disc art when a new album is being played, disc art has changed or when cycling through album artworks.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	fetchNewArtwork(metadb) {
		if (grSet.presetAutoRandomMode === 'album' || grSet.presetSelectMode === 'harmonic') this.initThemeSkip = true;
		this.fetchAlbumArt(metadb);
		this.fetchDiscArt();
	}

	/**
	 * Loads an image from the this.albumArtList array.
	 * @param {number} index - The index of this.albumArtList signifying which image to load.
	 */
	loadImageFromAlbumArtList(index) {
		const metadb = fb.GetNowPlaying();
		const artIndex = this.albumArtList[index];
		const tempAlbumArt = grm.artCache && grm.artCache.getImage(this.albumArtList[index]);
		const tempDiscArtCover = grm.artCache && grm.artCache.getImage(this.albumArtList[index], 2);

		const autoRandomPreset = !this.doubleClicked &&
			(!['off', 'track'].includes(grSet.presetAutoRandomMode) && grSet.presetSelectMode === 'harmonic'
			||
			grSet.presetAutoRandomMode === 'dblclick' && grSet.presetSelectMode === 'theme');

		const hasThemeTags = $('[%GR_THEME%]') || $('[%GR_STYLE%]') || $('[%GR_PRESET%]');

		const _initTheme = (albumArt) => {
			if (autoRandomPreset) {
				this.setRandomThemePreset();
				return;
			}
			this.initThemeTags();
			grm.color.getThemeColors(albumArt);
			if (!this.initThemeSkip && !hasThemeTags) {
				this.initTheme();
				DebugLog('\n>>> initTheme => loadImageFromAlbumArtList >>>\n');
			}
		};

		if (tempAlbumArt) {
			this.albumArt = tempAlbumArt;
			this.discArtCover = tempDiscArtCover;
			this.albumArtCopy = this.albumArt;

			if (grSet.panelWidthAuto) {
				this.initPanelWidthAuto();
			}

			if (index !== 0 && !this.newTrackFetchingArtwork) return;
			this.newTrackFetchingArtwork = false;
			_initTheme(this.albumArt);
		}
		else {
			gdi.LoadImageAsyncV2(window.ID, artIndex).then(coverImage => {
				this.albumArtCorrupt = false;
				this.albumArt = grm.artCache.encache(coverImage, artIndex);
				this.discArtCover = grm.artCache.encache(coverImage, artIndex, 2);

				if (this.newTrackFetchingArtwork) {
					if (!this.albumArt && fb.IsPlaying && metadb) {
						this.albumArt = utils.GetAlbumArtV2(metadb);
						if (this.albumArt) {
							this.discArtCover = grm.artCache.encache(this.albumArt, artIndex, 2);
							this.albumArtEmbedded = true;
						} else {
							this.noArtwork = true;
							this.noAlbumArtStub = true;
							this.albumArtCorrupt = true;
							this.albumArtEmbedded = false;
							setTimeout(() => {
								const msg = 'Album art could not be properly parsed!\n\nMaybe it is corrupt, file format is not supported\nor has an unusual ICC profile embedded.\n\n\n';
								ShowPopup(true, msg, msg, 'OK', false, (confirmed) => {});
							}, 1000);
						}
					}
					_initTheme(this.albumArt);
					this.newTrackFetchingArtwork = false;
				}

				this.albumArtCopy = this.albumArt;

				if (grSet.panelWidthAuto) {
					this.initPanelWidthAuto();
				} else {
					this.resizeArtwork(true);
				}

				if (this.discArt) this.createDiscArtRotation();
				RepaintWindow();
			});
		}

		if (!this.displayLibrarySplit()) this.resizeArtwork(false);
		if (this.discArt) this.createDiscArtRotation();
	}

	/**
	 * Resizes loaded artwork to have better drawing performance and resets its position.
	 * Also resets the size and position of the pause button and lyrics.
	 * @param {boolean} resetDiscArtPosition - Whether the position of the disc art should be reset.
	 */
	resizeArtwork(resetDiscArtPosition) {
		DebugLog('Resizing artwork');
		this.hasArtwork = false;
		this.resizeAlbumArt();
		this.resizeDiscArt(resetDiscArtPosition);
		this.resetPausePosition();
		grm.lyrics.resetLyricsPosition();
	}

	/**
	 * Resizes and resets the size and position of the album art.
	 * Accounts for different window states and user preferences to calculate
	 * the appropriate size and position of the album artwork.
	 */
	resizeAlbumArt() {
		if (!this.albumArt || !this.albumArt.Width || !this.albumArt.Height) {
			this.albumArtSize = new ImageSize(0, this.topMenuHeight, 0, 0);
			return;
		}

		// * Set album scale
		const windowFullscreenOrMaximized = UIHacks.FullScreen || UIHacks.MainWindowState === WindowState.Maximized;
		const aspectRatioInBounds = !grSet.albumArtAspectRatioLimit || (this.albumArt.Width < this.albumArt.Height * grSet.albumArtAspectRatioLimit) && (this.albumArt.Height < this.albumArt.Width * grSet.albumArtAspectRatioLimit);
		const albumArtCropped = grSet.albumArtScale === 'cropped' && windowFullscreenOrMaximized && aspectRatioInBounds && (this.displayPlaylist || this.displayLibrary);
		const albumArtStretched = grSet.albumArtScale === 'stretched' && windowFullscreenOrMaximized && aspectRatioInBounds && (this.displayPlaylist || this.displayLibrary);
		const albumArtMaxWidth = this.ww * 0.5;
		const albumArtMaxHeight = this.wh - this.topMenuHeight - this.lowerBarHeight;
		const albumArtScaleFactor = this.displayPlaylist || this.displayLibrary ? 0.5 : 0.75;
		const albumArtScaleDefault = Math.min(this.ww * albumArtScaleFactor / this.albumArt.Width, albumArtMaxHeight / this.albumArt.Height);
		const albumArtScaleArtwork = Math.min(this.ww / this.albumArt.Width, albumArtMaxHeight / this.albumArt.Height);
		let albumArtScale = grSet.layout === 'artwork' ? albumArtScaleArtwork : albumArtScaleDefault;

		// * Set album art width, height and proportions
		if (albumArtCropped) {
			const { image, scale } = this.createCroppedAlbumArt(this.albumArt, albumArtMaxWidth, albumArtMaxHeight);
			this.albumArtCopy = image;
			albumArtScale = scale;
			this.albumArtSize.w = Math.floor(this.albumArtCopy.Width * albumArtScale);
			this.albumArtSize.h = Math.floor(this.albumArtCopy.Height * albumArtScale);
		} else if (albumArtStretched) {
			this.albumArtCopy = null;
			this.albumArtSize.w = albumArtMaxWidth;
			this.albumArtSize.h = albumArtMaxHeight;
		} else { // Restore original proportional album art image
			this.albumArtCopy = null;
			this.albumArtSize.w = Math.floor(this.albumArt.Width * albumArtScale);
			this.albumArtSize.h = Math.floor(this.albumArt.Height * albumArtScale);
		}

		// * Set xCenter position
		let xCenter = this.ww * 0.5;
		this.albumArtOffCenter = false;
		if (this.displayPlaylist || this.displayLibrary) {
			xCenter = grSet.layout === 'artwork' ? 0 : this.ww * 0.25;
		} else if (albumArtScale === this.ww * 0.75 / this.albumArt.Width) {
			xCenter = Math.round(this.ww * 0.66 - SCALE(40)); // xCenter += this.ww * 0.1;
			this.albumArtOffCenter = true;
		}

		// * Set album art x-coordinate
		switch (grSet.layout) {
			case 'default': // In a non-proportional player size, 'grSet.albumArtAlign' sets album art alignment in Default layout
				if (this.displayPlaylist || this.displayLibrary) {
					switch (grSet.albumArtAlign) {
						case 'left':
							this.albumArtSize.x = Math.round(Math.min(0, this.ww * 0.5 - this.albumArtSize.w));
							break;
						case 'leftMargin':
							this.albumArtSize.x = Math.round(Math.min(this.ww / this.wh > 1.8 ? SCALE(40) : 0, this.ww * 0.5 - this.albumArtSize.w));
							break;
						case 'center':
							this.albumArtSize.x = Math.round(Math.min(xCenter - 0.5 * this.albumArtSize.w, this.ww * 0.5 - this.albumArtSize.w));
							break;
						default:
							this.albumArtSize.x = Math.round(this.ww * 0.5 - this.albumArtSize.w);
							break;
					}
				} else {
					this.albumArtSize.x = Math.round(xCenter - 0.5 * this.albumArtSize.w);
				}
				break;

			case 'artwork': // And is always centered in Artwork layout
				this.albumArtSize.x = Math.round(!this.displayPlaylist || this.displayLyrics ? this.ww * 0.5 - this.albumArtSize.w * 0.5 : this.ww);
				break;
		}

		// * Set album art y-coordinate
		const restrictedWidth = albumArtScale !== (this.wh - this.topMenuHeight - this.lowerBarHeight) / this.albumArt.Height;
		const centerY = Math.floor(((this.wh - this.lowerBarHeight + this.topMenuHeight) / 2) - this.albumArtSize.h / 2);
		this.albumArtSize.y = restrictedWidth ? Math.min(centerY, SCALE(150) + 10) : this.topMenuHeight;

		this.createScaledAlbumArt();
		this.hasArtwork = true;
	}

	/**
	 * Resets the size and position of the pause button.
	 */
	resetPausePosition() {
		const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;
		const windowFullscreenOrMaximized = UIHacks.FullScreen || UIHacks.MainWindowState === WindowState.Maximized;

		const albumArtPauseBtnX = windowFullscreenOrMaximized ? this.ww * 0.25 : this.albumArtSize.x + this.albumArtSize.w * 0.5;
		const albumArtPauseBtnY = this.albumArtSize.y + this.albumArtSize.h * 0.5;
		const discArtPauseBtnX = this.discArtSize.x + this.discArtSize.w * 0.5;
		const discArtPauseBtnY = this.discArtSize.y + this.discArtSize.h * 0.5;

		const noAlbumArtPauseBtnX =
			!grSet.panelWidthAuto && grSet.layout !== 'artwork' && !this.noAlbumArtStub && (this.displayPlaylist || this.displayLibrary) ||
				grSet.layout === 'artwork' || this.displayDetails || grSet.lyricsLayout === 'full' && this.displayLyrics ? this.ww * 0.5 :
			grSet.panelWidthAuto ?
				grSet.albumArtAlign === 'left' ? noAlbumArtSize * 0.5 :
				grSet.albumArtAlign === 'leftMargin' ? this.ww / this.wh > 1.8 ? noAlbumArtSize * 0.5 + SCALE(40) : 0 :
				grSet.albumArtAlign === 'center' ? Math.floor(this.ww * 0.5 - noAlbumArtSize * 0.5 - (this.ww * 0.25 - noAlbumArtSize * 0.5)) :
				this.ww * 0.5 - noAlbumArtSize * 0.5 :
			this.ww * 0.25;

		const noAlbumArtPauseBtnY = this.wh * 0.5 - this.topMenuHeight;

		if (this.albumArt) grm.pseBtn.setCoords(albumArtPauseBtnX, albumArtPauseBtnY);
		else if (this.discArt) grm.pseBtn.setCoords(discArtPauseBtnX, discArtPauseBtnY);
		else if (this.noAlbumArtStub) grm.pseBtn.setCoords(noAlbumArtPauseBtnX, noAlbumArtPauseBtnY);
	}
	// #endregion

	// * DETAILS - PUBLIC METHODS - DISC ART * //
	// #region DETAILS - PUBLIC METHODS - DISC ART
	/**
	 * Creates and masks an image to the disc art.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} x - The X-coordinate of the disc area.
	 * @param {number} y - The Y-coordinate of the disc area.
	 * @param {number} w - The width of the mask.
	 * @param {number} h - The height of the mask.
	 * @param {number} srcX - The X-coordinate of the source image.
	 * @param {number} srcY - The Y-coordinate of the source image.
	 * @param {number} srcW - The width of the source image.
	 * @param {number} srcH - The height of the source image.
	 * @param {number} [angle] - The angle of the mask in degrees. Default 0.
	 * @param {number} [alpha] - The alpha of the mask. Values 0-255.
	 * @returns {GdiGraphics} The rounded masked image.
	 */
	createDiscArtAlbumArtMask(gr, x, y, w, h, srcX, srcY, srcW, srcH, angle, alpha) {
		// * First draw album art in the background
		gr.DrawImage(this.albumArtScaled, x, y, w, h, 0, 0, w, h, 0, alpha);

		// * Mask
		const maskImg = gdi.CreateImage(w, h);
		let g = maskImg.GetGraphics();
		g.FillEllipse(this.discArtSize.x - this.albumArtSize.x + this.discArtShadow - SCALE(4), this.discArtSize.y - this.albumArtSize.y + SCALE(2),
					  this.discArtSize.w - this.discArtShadow + SCALE(4), this.discArtSize.h - this.discArtShadow + SCALE(2), 0xffffffff);
		maskImg.ReleaseGraphics(g);

		// * Album art
		const albumArtImg = gdi.CreateImage(w, h);
		g = albumArtImg.GetGraphics();
		g.DrawImage(this.albumArtScaled, 0, 0, w, h, 0, 0, this.albumArtScaled.Width, this.albumArtScaled.Height);
		albumArtImg.ReleaseGraphics(g);

		const mask = maskImg.Resize(w, h);
		albumArtImg.ApplyMask(mask);

		return gr.DrawImage(albumArtImg, x, y, w, h, 0, 0, w, h, 0, 255);
	}

	/**
	 * Creates the album cover mask for the disc art stub.
	 * @param {GdiBitmap} img - The image to apply the mask to.
	 * @param {number} w - The width of the mask.
	 * @param {number} h - The height of the mask.
	 */
	createDiscArtCoverMask(img, w, h) {
		const mask = GDI(this.discArtSize.w, this.discArtSize.h, true, g => {
			const lw = SCALE(25);
			const innerRingSize = Math.round(this.discArtSize.h * 0.666 + lw * 0.5);
			const innerCenterX  = Math.round(this.discArtSize.w * 0.5);
			const innerCenterY  = Math.round(this.discArtSize.h * 0.5);
			const innerRadiusX  = Math.round(this.discArtSize.w * 0.5 - innerRingSize * 0.5);
			const innerRadiusY  = Math.round(this.discArtSize.h * 0.5 - innerRingSize * 0.5);

			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			g.FillSolidRect(0, 0, this.discArtSize.w, this.discArtSize.h, RGB(255, 255, 255));
			g.FillEllipse(lw * 0.5, lw * 0.5, this.discArtSize.w - lw, this.discArtSize.h - lw, RGB(0, 0, 0)); // Outer ring
			g.FillEllipse(innerCenterX - innerRadiusX, innerCenterY - innerRadiusY, innerRadiusX * 2, innerRadiusY * 2, RGB(255, 255, 255)); // Inner ring
		});

		img.ApplyMask(mask.Resize(w, h));
	}

	/**
	 * Creates the disc art rotation animation with RotateImg().
	 * @returns {object} The rotated disc art image.
	 */
	createDiscArtRotation() {
		// Drawing discArt rotated is slow, so first draw it rotated into the discArtRotation image, and then draw discArtRotation image unrotated in on_paint.
		if (grSet.displayDiscArt && !this.albumArtCorrupt && this.albumArt && this.discArt && this.discArtSize.w > 0) {
			let tracknum = parseInt(fb.TitleFormat(`$num($if(${grTF.vinyl_tracknum},$sub($mul(${grTF.vinyl_tracknum},2),1),$if2(%tracknumber%,1)),1)`).Eval()) - 1;
			if (!grSet.rotateDiscArt || Number.isNaN(tracknum)) tracknum = 0; // Avoid NaN issues when changing tracks rapidly

			this.discArtRotation = RotateImg(this.discArt, this.discArtSize.w, this.discArtSize.h, tracknum * grSet.rotationAmt);
			if (['cdAlbumCover', 'vinylAlbumCover'].includes(grSet.discArtStub) && this.discArtCover && (!grSet.noDiscArtStub || grSet.showDiscArtStub)) {
				this.createDiscArtCoverMask(this.discArtCover, this.discArtCover.Width, this.discArtCover.Height);
				this.discArtRotationCover = RotateImg(this.discArtCover, this.discArtSize.w, this.discArtSize.h, tracknum * grSet.rotationAmt);
			}
		}

		// TODO: Once spinning art is done, scrap this and the rotation amount crap and just use indexes into the discArtArray when needed.
		// ? IDEA: Smooth rotation to new position?
		return this.discArtRotation;
	}

	/**
	 * Creates the drop shadow for disc art.
	 */
	createDiscArtShadow() {
		const discArtShadowProfiler = this.showDebugTiming && fb.CreateProfiler('createDiscArtShadow');
		const discArtMargin = SCALE(2);

		if (this.displayDetails && ((this.albumArt && this.albumArtSize.w > 0) || (this.discArt && grSet.displayDiscArt && this.discArtSize.w > 0))) {
			this.shadowImg = this.discArt && grSet.displayDiscArt ?
				gdi.CreateImage(this.discArtSize.x + this.discArtSize.w + 2 * this.discArtShadow, this.discArtSize.h + discArtMargin + 2 * this.discArtShadow) :
				gdi.CreateImage(this.albumArtSize.x + this.albumArtSize.w + 2 * this.discArtShadow, this.albumArtSize.h + 2 * this.discArtShadow);
			if (grSet.layout === 'default' && this.shadowImg) {
				const shimg = this.shadowImg.GetGraphics();
				if (this.discArt && grSet.displayDiscArt) {
					const offset = this.discArtSize.w * 0.40; // Don't change this value
					const xVal = this.discArtSize.x;
					const shadowOffset = this.discArtShadow * 2;

					shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + discArtMargin, this.discArtSize.w - shadowOffset, this.discArtSize.w - shadowOffset, this.discArtShadow * 2, grCol.discArtShadow); // outer shadow
					shimg.DrawEllipse(xVal + this.discArtShadow + offset, offset + this.discArtShadow + discArtMargin, this.discArtSize.w - offset * 2, this.discArtSize.h - offset * 2, 60, grCol.discArtShadow); // inner shadow
				}
				this.shadowImg.ReleaseGraphics(shimg);
				this.shadowImg.StackBlur(this.discArtShadow);
			}
		}

		if (discArtShadowProfiler) discArtShadowProfiler.Print();
	}

	/**
	 * Disposes the disc art image when changing or deactivating disc art.
	 * @param {GdiBitmap} discArtImg - The loaded disc art image.
	 */
	disposeDiscArt(discArtImg) {
		this.discArtSize = new ImageSize(0, 0, 0, 0);
		discArtImg = null;
	}

	/**
	 * Fetches new disc art when a new album is being played.
	 */
	fetchDiscArt() {
		const fetchDiscArtProfiler = this.showDebugTiming && fb.CreateProfiler('fetchDiscArt');
		const getDiscArtImagePaths = grPath.discArtImagePaths();
		const getDiscArtStubPaths = grPath.discArtStubPaths();
		let discArtPath;
		let tempDiscArt;

		if (grSet.displayDiscArt && !this.isStreaming) { // We must attempt to load CD/vinyl art first so that the shadow is drawn correctly
			if (grSet.noDiscArtStub || grSet.showDiscArtStub) {
				// * Search for disc art
				for (const path of getDiscArtImagePaths) {
					if (IsFile(path)) {
						this.discArtFound = true;
						discArtPath = path;
						break;
					}
				}
			}

			// * No disc art found, display custom disc art stubs
			if (!discArtPath && (!grSet.noDiscArtStub || grSet.showDiscArtStub)) {
				this.discArtFound = false;
				discArtPath = Object.prototype.hasOwnProperty.call(getDiscArtStubPaths, grSet.discArtStub) ? getDiscArtStubPaths[grSet.discArtStub] : grPath.discArtCustomStub;
			}

			// * Load disc art
			if (this.albumArtFromCache) {
				tempDiscArt = grm.artCache && grm.artCache.getImage(discArtPath);
			}
			if (tempDiscArt) {
				this.disposeDiscArt(this.discArt);
				this.discArt = tempDiscArt;
				this.resizeArtwork(true);
				this.createDiscArtRotation();
				if (grSet.spinDiscArt) {
					this.discArtArray = []; // Clear last image
					this.setDiscArtRotationTimer();
				}
			}
			else {
				gdi.LoadImageAsyncV2(window.ID, discArtPath).then(discArtImg => {
					this.disposeDiscArt(this.discArt); // Delay disposal so we don't get flashing
					this.discArt = grm.artCache.encache(discArtImg, discArtPath);
					this.resizeArtwork(true);
					this.createDiscArtRotation();
					if (grSet.spinDiscArt) {
						this.discArtArray = []; // Clear last image
						this.setDiscArtRotationTimer();
					}
					this.lastLeftEdge = 0; // Recalc label location
					RepaintWindow();
				});
			}
		}

		if (fetchDiscArtProfiler) fetchDiscArtProfiler.Print();
	}

	/**
	 * Resizes and resets the size and position of the disc art.
	 * @param {boolean} resetDiscArtPosition - Whether the position of the disc art should be reset.
	 */
	resizeDiscArt(resetDiscArtPosition) {
		if (!this.discArt) {
			this.discArtSize = new ImageSize(0, 0, 0, 0);
			return;
		}

		const discArtSizeCorr = SCALE(4);
		const discArtMargin = SCALE(2);
		const discArtMarginRight = SCALE(36);
		const discArtMaxHeight = this.wh - this.topMenuHeight - this.lowerBarHeight;
		const discScaleFactor = this.displayPlaylist || this.displayLibrary ? 0.5 : 0.75;
		const discScale = Math.min(this.ww * discScaleFactor / this.discArt.Width, (discArtMaxHeight - SCALE(16)) / this.discArt.Height);

		if (this.hasArtwork) {
			if (resetDiscArtPosition) {
				this.discArtSize.x =
					this.ww - (this.albumArtSize.x + this.albumArtSize.w) < this.albumArtSize.h * grSet.discArtDisplayAmount ? Math.floor(this.ww - this.albumArtSize.h - discArtMarginRight) :
					grSet.discArtDisplayAmount === 1 ? Math.floor(this.ww - this.albumArtSize.h - discArtMarginRight) :
					grSet.discArtDisplayAmount === 0.5 ? Math.floor(Math.min(this.ww - this.albumArtSize.h - discArtMarginRight,
						this.albumArtSize.x + this.albumArtSize.w - (this.albumArtSize.h - 4) * (1 - grSet.discArtDisplayAmount) - (grSet.discArtDisplayAmount === 1 || grSet.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight))) :
					Math.floor(this.albumArtSize.x + this.albumArtSize.w - (this.albumArtSize.h - discArtSizeCorr) * (1 - grSet.discArtDisplayAmount) - discArtMarginRight);

				this.discArtSize.y = this.albumArtSize.y + discArtMargin;
				this.discArtSize.w = this.albumArtSize.h - discArtSizeCorr; // Disc art must be square so use the height of album art for width of discArt
				this.discArtSize.h = this.discArtSize.w;
			} else { // When disc art moves because folder images are different sizes we want to push it outwards, but not move it back in so it jumps around less
				this.discArtSize.x = Math.max(this.discArtSize.x, Math.floor(Math.min(this.ww - this.albumArtSize.h - discArtMarginRight,
					this.albumArtSize.x + this.albumArtSize.w - (this.albumArtSize.h - 4) * (1 - grSet.discArtDisplayAmount) - (grSet.discArtDisplayAmount === 1 || grSet.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight))));

				this.discArtSize.y = this.discArtSize.y > 0 ? Math.min(this.discArtSize.y, this.albumArtSize.y + discArtMargin) : this.albumArtSize.y + discArtMargin;
				this.discArtSize.w = Math.max(this.discArtSize.w, this.albumArtSize.h - discArtSizeCorr);
				this.discArtSize.h = this.discArtSize.w;
				if (this.discArtSize.x + this.discArtSize.w > this.ww) {
					this.discArtSize.x = this.ww - this.discArtSize.w - discArtMarginRight;
				}
			}
		}
		else { // * No album art so we need to calc size of disc
			let xCenter = this.ww * 0.5;
			this.albumArtOffCenter = false;
			if (this.displayPlaylist || this.displayLibrary) {
				xCenter = this.ww * 0.25;
			} else if (discScale === this.ww * 0.75 / this.discArt.Width) {
				xCenter = Math.round(this.ww * 0.66 - SCALE(40));
				this.albumArtOffCenter = true;
			}

			// Need to -4 from height and add 2 to y to avoid skipping discArt drawing - not sure this is needed
			this.discArtSize.w = Math.floor(this.discArt.Width * discScale) - discArtSizeCorr;
			this.discArtSize.h = this.discArtSize.w;
			this.discArtSize.x = Math.floor(xCenter - this.discArtSize.w * 0.5);

			// * Set disc art y-coordinate
			const restrictedWidth = discScale !== (discArtMaxHeight - SCALE(16)) / this.discArt.Height;
			const centerY = this.topMenuHeight + Math.floor(((discArtMaxHeight - SCALE(16)) / 2) - this.discArtSize.h / 2);
			this.discArtSize.y = restrictedWidth ? Math.min(centerY, 160) : this.topMenuHeight + discArtMargin;

			this.hasArtwork = true;
		}

		if ((this.hasArtwork || this.noAlbumArtStub) && (this.discArt && this.displayDetails && grSet.displayDiscArt && grSet.layout !== 'compact')) {
			this.createDiscArtShadow();
		}
	}

	/**
	 * Sets the disc art timer with different set interval values for rotating the disc art.
	 */
	setDiscArtRotationTimer() {
		clearInterval(this.discArtRotationTimer);
		if (grSet.layout === 'default' && !this.albumArtCorrupt && this.albumArt && this.discArt && fb.IsPlaying && !fb.IsPaused && grSet.displayDiscArt && grSet.spinDiscArt && this.displayDetails) {
			console.log(`creating ${grSet.spinDiscArtImageCount} rotated disc images, shown every ${grSet.spinDiscArtRedrawInterval}ms`);
			this.discArtRotationTimer = setInterval(() => {
				this.discArtRotationIndex++;
				this.discArtRotationIndex %= grSet.spinDiscArtImageCount;
				this.discArtRotationIndexCover++;
				this.discArtRotationIndexCover %= grSet.spinDiscArtImageCount;

				if (!this.discArtArray[this.discArtRotationIndex] && this.discArt && this.discArtSize.w) {
					DebugLog(`creating discArtImg: ${this.discArtRotationIndex} (${this.discArtSize.w}x${this.discArtSize.h}) with rotation: ${360 / grSet.spinDiscArtImageCount * this.discArtRotationIndex} degrees`);
					this.discArtArray[this.discArtRotationIndex] = RotateImg(this.discArt, this.discArtSize.w, this.discArtSize.h, 360 / grSet.spinDiscArtImageCount * this.discArtRotationIndex);
					if (['cdAlbumCover', 'vinylAlbumCover'].includes(grSet.discArtStub) && this.discArtCover && (!grSet.noDiscArtStub || grSet.showDiscArtStub)) {
						this.discArtArrayCover[this.discArtRotationIndexCover] = RotateImg(this.discArtCover, this.discArtSize.w, this.discArtSize.h, 360 / grSet.spinDiscArtImageCount * this.discArtRotationIndexCover);
					}
				}

				// The first line of discArtImg that will be drawn
				const discArtLeftEdge = grSet.detailsAlbumArtOpacity !== 255 || grSet.detailsAlbumArtDiscAreaOpacity !== 255 || grSet.discArtOnTop ? this.discArtSize.x : this.albumArtSize.x + this.albumArtSize.w - 1;
				window.RepaintRect(discArtLeftEdge, this.discArtSize.y, this.discArtSize.w - (discArtLeftEdge - this.discArtSize.x), this.discArtSize.h, !grSet.discArtOnTop && !this.displayLyrics);
			}, grSet.spinDiscArtRedrawInterval);
		}
	}
	// #endregion

	// * DETAILS - PUBLIC METHODS - BAND & LABEL LOGO * //
	// #region DETAILS - PUBLIC METHODS - BAND & LABEL LOGO
	/**
	 * Checks if a band logo exists at various paths.
	 * @param {string} bandStr - The name of the band.
	 * @returns {string} The path of the band logo if it exists.
	 */
	checkBandLogo(bandStr) {
		const testBandLogoPath = (imgDir, name) => {
			if (name) {
				const logoPath = `${imgDir}${name}.png`;
				if (IsFile(logoPath)) {
					console.log(`Found band logo: ${logoPath}`);
					return logoPath;
				}
			}
			return '';
		};

		return testBandLogoPath(grPath.artistlogos, bandStr) || // Try 800x310 white
			   testBandLogoPath(grPath.artistlogosColor, bandStr) || ''; // Try 800x310 color
	}

	/**
	 * Gets the band logo and its inverted version based on the current playing album artist in Details.
	 */
	getBandLogo() {
		this.bandLogo = null;
		this.bandLogoInverted = null;
		let path;
		let tryArtistList = [
			...GetMetaValues('%album artist%').map(artist => ReplaceFileChars(artist)),
			...GetMetaValues('%album artist%').map(artist => ReplaceFileChars(artist).replace(/^[Tt]he /, '')),
			ReplaceFileChars($('[%track artist%]')),
			...GetMetaValues('%artist%').map(artist => ReplaceFileChars(artist)),
			...GetMetaValues('%artist%').map(artist => ReplaceFileChars(artist).replace(/^[Tt]he /, ''))
		];

		tryArtistList = [...new Set(tryArtistList)];
		tryArtistList.some(artistString => {
			path = this.checkBandLogo(artistString);
			return path;
		});

		if (!path) return;

		this.bandLogo = grm.artCache.getImage(path);
		if (!this.bandLogo) {
			const logo = gdi.Image(path);
			if (logo) {
				this.bandLogo = grm.artCache.encache(logo, path);
				this.bandLogoInverted = grm.artCache.encache(logo.InvertColours(), `${path}-inv`);
			}
		}

		this.bandLogoInverted = grm.artCache.getImage(`${path}-inv`);
		if (!this.bandLogoInverted && this.bandLogo) {
			this.bandLogoInverted = grm.artCache.encache(this.bandLogo.InvertColours(), `${path}-inv`);
		}
	}

	/**
	 * Gets label logos based on current playing album artist in Details.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	getLabelLogo(metadb) {
		const labelTags = ['label', 'publisher', 'discogs_label'];
		let labelStrings = [];
		this.recordLabels = []; // Will free memory from earlier loaded record label images
		this.recordLabelsInverted = [];

		for (const label of labelTags) {
			labelStrings.push(...GetMetaValues(label, metadb));
		}
		labelStrings = [...new Set(labelStrings)];

		for (const labelString of labelStrings) {
			const addLabel = this.loadLabelLogo(labelString);
			if (addLabel != null) {
				this.recordLabels.push(addLabel);
				try {
					this.recordLabelsInverted.push(addLabel.InvertColours());
				} catch (e) {}
			}
		}
	}

	/**
	 * Loads the label logo in Details.
	 * @param {string} publisherString - The name of a record label or publisher.
	 * @returns {GdiBitmap} The record label logo as a gdi image object.
	 */
	loadLabelLogo(publisherString) {
		const d = new Date();
		const lastSrchYear = d.getFullYear();
		let dir = grPath.labelsBase;
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
	// #endregion

	// * DETAILS - PUBLIC METHODS - METADATA GRID * //
	// #region DETAILS - PUBLIC METHODS - METADATA GRID
	/**
	 * Calculates date ratios based on various time-related properties of a music track, displayed on the timeline in Details.
	 * @param {boolean} dontUpdateLastPlayed - Whether the last played date should be updated or not.
	 * @param {string} currentLastPlayed - The current value of the last played time.
	 */
	calcDateRatios(dontUpdateLastPlayed = false, currentLastPlayed) {
		const newDate = new Date();
		const timezoneOffset = UpdateTimezoneOffset();

		let ratio;
		let lfmPlayedTimesJsonLast = '';
		let playedTimesJsonLast = '';
		let playedTimesRatios = [];
		let lfmPlayedTimes = [];
		let playedTimes = [];

		let added = ToTime($('$if2(%added_enhanced%,%added%)'), timezoneOffset);
		let lastPlayed = ToTime($('$if2(%last_played_enhanced%,%last_played%)'), timezoneOffset);
		const firstPlayed = ToTime($('$if2(%first_played_enhanced%,%first_played%)'), timezoneOffset);
		const today = DateToYMD(newDate);

		if (dontUpdateLastPlayed && $Date(lastPlayed) === today) {
			lastPlayed = ToTime(currentLastPlayed, timezoneOffset);
		}

		if (Component.EnhancedPlaycount) {
			const playedTimesJson = $('[%played_times_js%]', fb.GetNowPlaying());
			const lastfmJson = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
			const log = ''; // ! Don't need this crap to flood the console // playedTimesJson === playedTimesJsonLast && lastfmJson === lfmPlayedTimesJsonLast ? false : grCfg.settings.showDebugLog;
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

			this.timelineFirstPlayedRatio = CalcAgeRatio(firstPlayed, age);
			this.timelineLastPlayedRatio = CalcAgeRatio(lastPlayed, age);
			if (this.timelineLastPlayedRatio < this.timelineFirstPlayedRatio) {
				// Due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
				this.timelineLastPlayedRatio = this.timelineFirstPlayedRatio;
			}

			if (playedTimes.length) {
				for (let i = 0; i < playedTimes.length; i++) {
					ratio = CalcAgeRatio(playedTimes[i], age);
					playedTimesRatios.push(ratio);
				}
			} else {
				playedTimesRatios = [this.timelineFirstPlayedRatio, this.timelineLastPlayedRatio];
				playedTimes = [firstPlayed, lastPlayed];
			}

			let j = 0;
			const tempPlayedTimesRatios = playedTimesRatios.slice();
			tempPlayedTimesRatios.push(1.0001); // Pick up every last.fm time after lastPlayed fb knows about
			for (let i = 0; i < tempPlayedTimesRatios.length; i++) {
				while (j < lfmPlayedTimes.length && (ratio = CalcAgeRatio(lfmPlayedTimes[j], age)) < tempPlayedTimesRatios[i]) {
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

			this.timelineFirstPlayedRatio = playedTimesRatios[0];
			this.timelineLastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
		}
		else {
			this.timelineFirstPlayedRatio = 0.33;
			this.timelineLastPlayedRatio = 0.66;
		}
		grm.timeline.setPlayTimes(this.timelineFirstPlayedRatio, this.timelineLastPlayedRatio, playedTimesRatios, playedTimes);
	}

	/**
	 * Loads the codec logo of the now playing track, displayed in the metadata grid in Details.
	 */
	loadCodecLogo() {
		const codec = $('$lower($if2(%codec%,$ext(%path%)))');
		const format = $('$lower($ext(%path%))', fb.GetNowPlaying());
		const lightBg = new Color(grCol.detailsText).brightness < 140;
		const bw = lightBg ? 'black' : 'white';

		const codecFormat = {
			'aac':  'aac', 'aac acm codec': 'aac',
			'ac3':  'ac3', 'atsc a/52': 'ac3', 'e-ac3': 'ac3',
			'aiff': 'pcm-aiff',
			'alac': 'alac',
			'alaw': 'alaw', 'ccitt a-law': 'alaw',
			'amr':  'amr',
			'ape':  'ape', 'monkey\'s audio': 'ape',
			'caf':  'caf',
			'dsd':  format === 'iso' ? 'dsd-sacd' : 'dsd',
			'dst':  'dsd-sacd',
			'dts':  'dts', 'dca (dts coherent acoustics)': 'dts',
			'dxd':  format === 'iso' ? 'dsd-sacd' : 'dxd',
			'flac': 'flac',
			'gsm':  'gsm', 'gsm 6.10': 'gsm',
			'imaadpcm': 'imaadpcm', 'ima adpcm': 'imaadpcm',
			'la':   'la',
			'mid':  'mid',
			'mlp':  'mlp',
			'mod':  'mod',
			'mp2':  'mp2',
			'mp3':  'mp3', 'mpeg layer-3': 'mp3',
			'mpc':  'musepack', 'musepack': 'musepack',
			'msadpcm': 'msadpcm', 'microsoft adpcm': 'msadpcm',
			'ofr':  'ofr', 'optimfrog': 'ofr',
			'ogg':  'ogg', 'vorbis': 'ogg',
			'opus': 'opus',
			'pcm':  format === 'aiff' ? 'pcm-aiff' : ['w64', 'wav'].includes(format) ? 'pcm-wav' : 'pcm',
			'qoa':  'qoa',
			'shn':  'shn', 'shorten': 'shn',
			'spx':  'spx', 'speex': 'spx',
			'tak':  'tak',
			'tta':  'tta', 'true audio': 'tta',
			'ulaw': 'ulaw', 'ccitt u-law': 'ulaw',
			'usac': 'usac',
			'wav':  'pcm-wav',
			'w64':  'pcm-wav',
			'wma':  'wma',
			'wv':   'wavpack', 'wavpack': 'wavpack'
		};

		const codecName = codecFormat[codec] || codecFormat[format];
		const codecLogoPath = (codecName) => `${grPath.images}codec\\${codecName}-${bw}.png`;

		if (codecName) {
			this.codecLogo = gdi.Image(codecLogoPath(codecName));
		}
		// Handle special cases
		if (codec.startsWith('dsd')) {
			this.codecLogo = gdi.Image(codecLogoPath(codecFormat.dsd));
		} else if (codec.startsWith('dxd')) {
			this.codecLogo = gdi.Image(codecLogoPath(codecFormat.dxd));
		} else if (codec.startsWith('dst')) {
			this.codecLogo = gdi.Image(codecLogoPath(codecFormat.dst));
		}
	}

	/**
	 * Loads the channel logo of the now playing track, displayed in the metadata grid in Details.
	 */
	loadChannelLogo() {
		const channels = $('%channels%');
		const type =
			(grSet.layout === 'default' && grSet.showGridChannelLogo_default === 'textlogo' ||
			 grSet.layout === 'artwork' && grSet.showGridChannelLogo_artwork === 'textlogo') ? '_text' : '';

		const lightBg = new Color(grCol.detailsText).brightness < 140;
		const bw = lightBg ? 'black' : 'white';

		const channelFormat = {
			'mono':   '10_mono',
			'stereo': '20_stereo',
			'3ch':    '30_center',
			'4ch':    '40_quad',
			'5ch':    '50_surround',
			'6ch':    '51_surround',
			'7ch':    '61_surround',
			'8ch':    '71_surround',
			'10ch':   '91_surround',
			'12ch':   '111_surround'
		};

		const channelName = channelFormat[channels];
		const channelLogoPath = (channelName) => `${grPath.images}channels\\${channelName}${type}-${bw}.png`;
		if (channelName) this.channelLogo = gdi.Image(channelLogoPath(channelName));
	}

	/**
	 * Loads the release country flags, displayed in the metadata grid in Details.
	 */
	loadReleaseCountryFlag() {
		this.releaseFlagImg = this.loadFlagImage($(grTF.releaseCountry));
	}

	/**
	 * Updates the metadata grid in Details, reuses last value for last played unless provided one.
	 * @param {string} currentLastPlayed - The current value of the "Last Played" metadata field.
	 * @param {string} currentPlayingPlaylist - The current active playlist that is being played from.
	 * @returns {Array|null} The updated metadata grid, which is an array of objects with properties `label`, `val` and `age`.
	 */
	updateMetadataGrid(currentLastPlayed, currentPlayingPlaylist) {
		if (!grCfg.metadataGrid) return null;

		currentLastPlayed = (grStr && grStr.grid ? grStr.grid.find(value => value.label === 'Last Played') || {} : {}).val;
		grStr.grid = [];

		for (const key of grCfg.metadataGrid) {
			let val = $(key.val);
			if (val && key.label) {
				if (key.age) {
					val = $(`$date(${val})`); // Never show time
					const age = CalcAgeDateString(val);
					if (age) val += ` (${age})`;
				}
				grStr.grid.push({
					age: key.age,
					label: key.label,
					val
				});
			}
		}
		if (typeof currentLastPlayed !== 'undefined') {
			const lp = grStr.grid.find(value => value.label === 'Last Played');
			if (lp) {
				lp.val = $Date(currentLastPlayed);
				if (CalcAgeDateString(lp.val)) {
					lp.val += ` (${CalcAgeDateString(lp.val)})`;
				}
			}
		}
		if (typeof currentPlayingPlaylist !== 'undefined') {
			const pl = grStr.grid.find(value => value.label === 'Playing List');
			if (pl) {
				pl.val = currentPlayingPlaylist;
			}
		}
		return grStr.grid;
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
		if (lib.initialized) return;
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
		lib.initialized = true;
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
				libSet.albumArtShow = grSet.savedAlbumArtShow;
				libSet.albumArtLabelType = grSet.savedAlbumArtLabelType;
			}
			lib.panel.imgView = grSet.libraryLayout === 'normal' && grSet.libraryLayoutFullPreset ? libSet.albumArtShow = false : libSet.albumArtShow;
			lib.men.loadView(false, !lib.panel.imgView ? (libSet.artTreeSameView ? libSet.viewBy : libSet.treeViewBy) : (libSet.artTreeSameView ? libSet.viewBy : libSet.albumArtViewBy), lib.pop.sel_items[0]);
		}

		// * Full layout preset
		if (grSet.libraryLayout === 'full' && grSet.libraryLayoutFullPreset) {
			grSet.libraryDesign = 'reborn';
			grSet.libraryThumbnailSize = grSet.libraryThumbnailSizeSaved;
			if (grSet.playerSize_HD_small && (grSet.libraryThumbnailSize === 'auto' || libSet.thumbNailSize === 'auto')) {
				libSet.thumbNailSize = 1;
			}
			libSet.albumArtLabelType = 1;
			lib.panel.imgView = libSet.albumArtShow = true;
		}
		// * Split layout presets
		else if (grSet.libraryLayout === 'split' && libraryLayoutSplitPresets) {
			if (grSet.layout !== 'default') return;

			if (!plSet.show_header) this.updatePlaylist();

			if (grSet.playlistLayout === 'full') {
				grSet.playlistLayout = 'normal';
			}

			if (grSet.libraryLayoutSplitPreset) {
				grSet.libraryDesign = 'reborn';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = false;
				libSet.albumArtLabelType = 1;
				plSet.show_header = true;
				if (this.displayPlaylist && this.displayLibrary) {
					plSet.auto_collapse = true;
					pl.playlist.header_auto_collapse();
				}
				else {
					plSet.auto_collapse = false;
					pl.playlist.header_expand();
				}
			}
			else if (grSet.libraryLayoutSplitPreset2) {
				grSet.libraryDesign = 'reborn';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = false;
				libSet.albumArtLabelType = 1;
				plSet.auto_collapse = false;
				plSet.show_header = this.displayPlaylist && !this.displayLibrary && grSet.libraryLayout === 'split';
				this.updatePlaylist();
			}
			else if (grSet.libraryLayoutSplitPreset3) {
				grSet.libraryDesign = 'reborn';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = true;
				libSet.albumArtLabelType = 1;
				plSet.show_header = true;
				if (this.displayPlaylist && this.displayLibrary) {
					plSet.auto_collapse = true;
					pl.playlist.header_auto_collapse();
				}
				else {
					plSet.auto_collapse = false;
					pl.playlist.header_expand();
				}
			}
			else if (grSet.libraryLayoutSplitPreset4) {
				grSet.libraryDesign = 'artistLabelsRight';
				grSet.libraryThumbnailSize = 'playlist';
				lib.panel.imgView = libSet.albumArtShow = true;
				libSet.albumArtLabelType = 2;
				plSet.show_header = true;
				if (this.displayPlaylist && this.displayLibrary) {
					plSet.auto_collapse = true;
					pl.playlist.header_auto_collapse();
				}
				else {
					plSet.auto_collapse = false;
					pl.playlist.header_expand();
				}
			}
			pl.call.on_size(this.ww, this.wh);
		}

		if (!lib.initialized) return;
		setLibraryView();
		this.setLibrarySize();
		grm.theme.initLibraryColors();
		grm.style.initStyleColors();
		grm.theme.themeColorAdjustments();
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
	 * Sets the Library size and position.
	 */
	setLibrarySize() {
		if (!lib.initialized) return;

		const noAlbumArtSize = this.wh - this.topMenuHeight - this.lowerBarHeight;

		const x =
			grSet.layout === 'artwork' || grSet.libraryLayout !== 'normal' ? 0 :
			grSet.panelWidthAuto ? this.displayLibrarySplit() || !fb.IsPlaying ? 0 : this.noAlbumArtStub ? noAlbumArtSize : this.albumArtSize.x + this.albumArtSize.w :
			this.ww * 0.5;

		const y = this.topMenuHeight;

		const libraryWidth =
			grSet.layout === 'artwork' || grSet.libraryLayout === 'full' ? this.ww :
			grSet.panelWidthAuto ? this.displayLibrarySplit() ? noAlbumArtSize : !fb.IsPlaying ? this.ww : this.ww - (this.noAlbumArtStub ? noAlbumArtSize : this.albumArtSize.x + this.albumArtSize.w) :
			this.ww * 0.5;

		const libraryHeight = Math.max(0, this.wh - this.lowerBarHeight - y);

		lib.call.on_size(x, y, libraryWidth, libraryHeight);
	}
	// #endregion

	// * LIBRARY - PUBLIC METHODS - CONTROLS * //
	// #region LIBRARY - PUBLIC METHODS - CONTROLS
	/**
	 * Drags and drops items from Library to Playlist in split layout.
	 */
	librarySplitDragDrop() {
		const handleList = lib.pop.getHandleList('newItems');
		lib.pop.sortIfNeeded(handleList);
		fb.DoDragDrop(0, handleList, handleList.Count ? 1 | 4 : 0);

		if (plman.IsPlaylistLocked(plman.ActivePlaylist)) return; // Do nothing, it's locked or an auto-playlist

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

		const noStd = ['coversLabelsRight', 'artistLabelsRight'].includes(grSet.libraryDesign) || libSet.albumArtLabelType === 2;
		const fullW = grSet.libraryLayout === 'full' && grSet.layout === 'default';

		if (!RES._4K && !RES._QHD) {
			if (grSet.layout === 'default' && this.ww < 1600 && this.wh < 960 || grSet.layout === 'artwork' && this.ww < 700 && this.wh < 860) {
				libSet.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
				grSet.layout === 'artwork' ? 1 : 2; // Thumbnail size 'Small' or 'Regular'
				libSet.verticalAlbumArtPad = 2;
			}
			if (grSet.layout === 'default' && this.ww >= 1600 && this.wh >= 960 || grSet.layout === 'artwork' && this.ww >= 700 && this.wh >= 860) {
				libSet.thumbNailSize = noStd && fullW ? 2 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
				fullW ? 3 : 3; // Thumbnail size 'Medium'
				libSet.verticalAlbumArtPad = 2;
			}
			if (grSet.layout === 'default' && this.ww >= 1802 && this.wh >= 1061 || grSet.layout === 'artwork' && this.ww >= 901 && this.wh >= 1062) {
				libSet.thumbNailSize = noStd && !fullW ? 2 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
				fullW ? this.ww === 1802 && this.wh === 1061 ? 5 : 4 : 3; // Thumbnail size 'XL' or 'Large' or 'Medium'
				libSet.verticalAlbumArtPad = 2;
			}
		}
		else if (RES._QHD) {
			if (grSet.layout === 'default' && this.ww < 1802 && this.wh < 1061 || grSet.layout === 'artwork' && this.ww < 901 && this.wh < 1061) {
				libSet.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
				grSet.layout === 'artwork' ? 1 : 2; // Thumbnail size 'Small' or 'Regular'
				libSet.verticalAlbumArtPad = 2;
			}
			if (grSet.layout === 'default' && this.ww >= 1802 && this.wh >= 1061 || grSet.layout === 'artwork' && this.ww >= 901 && this.wh >= 1061) {
				libSet.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
				fullW ? 4 : 2; // Thumbnail size 'Medium' or 'Regular'
				libSet.verticalAlbumArtPad = 3;
			}
			if (grSet.layout === 'default' && this.ww >= 2280 && this.wh >= 1300 || grSet.layout === 'artwork' && this.ww >= 1140 && this.wh >= 1300) {
				libSet.thumbNailSize = noStd && !fullW ? 2 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
				fullW ? 5 : 3; // Thumbnail size 'Large' or 'Medium'
				libSet.verticalAlbumArtPad = fullW ? 2 : 3;
			}
		}
		else if (RES._4K) {
			if (grSet.layout === 'default' && this.ww < 2800 && this.wh < 1720 || grSet.layout === 'artwork' && this.ww < 1400 && this.wh < 1720) {
				libSet.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 0 : // Thumbnail size 'Small' or 'Mini'
				fullW ? 2 : 1;  // Thumbnail size 'Small'
				libSet.verticalAlbumArtPad = 2;
			}
			if (grSet.layout === 'default' && this.ww >= 2800 && this.wh >= 1720 || grSet.layout === 'artwork' && this.ww >= 1400 && this.wh >= 1720) {
				libSet.thumbNailSize = noStd && fullW ? 1 : noStd && !fullW ? 1 : // Thumbnail size 'Small'
				fullW ? 3 : 1; // Thumbnail size 'Regular' or 'Small'
				libSet.verticalAlbumArtPad = 3;
			}
			if (grSet.layout === 'default' && this.ww >= 3400 && this.wh >= 2020 || grSet.layout === 'artwork' && this.ww >= 1400 && this.wh >= 1720) {
				libSet.thumbNailSize = noStd && !fullW ? 1 : noStd && fullW ? 3 : // Thumbnail size 'Small' or 'Regular'
				fullW ? this.ww === 3400 && this.wh === 2020 ? 4 : 4 : 2; // Thumbnail size 'Medium' or 'Regular'
				libSet.verticalAlbumArtPad = 2;
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
		if (bio.initialized) return;
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
		bio.initialized = true;
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
	 * Sets the Biography display layout.
	 */
	setBiographyDisplay() {
		switch (grSet.biographyDisplay) {
			case 'Image+text':
				bioSet.img_only = false;
				bioSet.text_only = false;
				break;
			case 'Image':
				bioSet.img_only = true;
				bioSet.text_only = false;
				break;
			case 'Text':
				bioSet.img_only = false;
				bioSet.text_only = true;
				break;
		}
	}

	/**
	 * Sets the Biography size and position.
	 */
	setBiographySize() {
		if (!bio.initialized) return;

		const x = 0;
		const y = this.topMenuHeight;

		const biographyWidth =
			grSet.layout === 'artwork' || grSet.biographyLayout === 'full' ? this.ww :
			grSet.panelWidthAuto ? (!this.albumArt && !this.noAlbumArtStub || !fb.IsPlaying) ? this.ww : this.albumArtSize.x + this.albumArtSize.w :
			this.ww * 0.5;

		const biographyHeight = Math.max(0, this.wh - this.lowerBarHeight - y);

		bio.call.on_size(x, y, biographyWidth, biographyHeight);
	}
	// #endregion
}
