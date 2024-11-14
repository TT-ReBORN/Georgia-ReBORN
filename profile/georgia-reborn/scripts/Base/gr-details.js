/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Details                                  * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    14-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////
// * DETAILS USER INTERFACE * //
////////////////////////////////
/**
 * A class that is responsible for the Details panel.
 */
class Details {
	/**
	 * Creates the `Details` instance.
	 */
	constructor() {
		// * GEOMETRY * //
		// #region GEOMETRY
		/** @public @type {number} The size of the disc art shadow. */
		this.discArtShadow = SCALE(6);
		/** @public @type {number} The margin width from the edge of the player to start of the metadata grid strings. */
		this.gridMarginLeft = grm.ui.edgeMargin;
		/** @public @type {number} The margin width from the edge of the metadata grid to the end of the metadata grid strings. */
		this.gridMarginRight = SCALE(20);
		/** @public @type {number} The spacing between grid lines in the metadata grid. */
		this.gridLineSpacing = SCALE(30);
		/** @public @type {number} The horizontal spacing between the track number and the artist in the metadata grid. */
		this.gridTrackNumSpacing = SCALE(8);
		/** @public @type {number} The height of the metadata grid tooltip area. */
		this.gridTooltipHeight = SCALE(100);
		/** @public @type {number} The top starting fixed position of the metadata grid. */
		this.gridTopStart = 0;
		/** @public @type {number} The top dynamic position of the metadata grid. */
		this.gridTop = 0;
		/** @public @type {number} The width of the metadata grid content. */
		this.gridContentWidth = 0;
		/** @public @type {number} The width of the country flag size in the metadata grid. */
		this.gridFlagSizeW = 0;
		/** @public @type {number} The white space size for the country flag in the metadata grid. */
		this.gridFlagSizeWhiteSpace = 0;
		/** @public @type {number} The text rectangle for string calculation in the metadata grid. */
		this.gridTxtRec = 0;
		/** @public @type {number} The top position of the artist in the metadata grid. */
		this.gridArtistTop = 0;
		/** @public @type {number} The bottom position of the artist in the metadata grid. */
		this.gridArtistBottom = 0;
		/** @public @type {object} The calculated artist wrap info for the metadata grid. */
		this.gridArtistWrapInfo = {};
		/** @public @type {boolean} The state when the artist string exceeds the available lines in the metadata grid. */
		this.gridArtistWrapLinesExceed = false;
		/** @public @type {number} The width of the wrap space within the artist string in the metadata grid. */
		this.gridArtistWrapWidth = 0;
		/** @public @type {number} The width of the artist in the metadata grid. */
		this.gridArtistWidth = 0;
		/** @public @type {number} The height of the artist in the metadata grid. */
		this.gridArtistHeight = 0;
		/** @public @type {number} The text rectangle for artist string calculation in the metadata grid. */
		this.gridArtistTxtRec = 0;
		/** @public @type {number} The number of lines for the artist text in the metadata grid. */
		this.gridArtistNumLines = 0;
		/** @public @type {number} The height of the artist number of lines in the metadata grid. */
		this.gridArtistNumLinesHeight = 0;
		/** @public @type {number} The top position of the track title in the metadata grid. */
		this.gridTitleTop = 0;
		/** @public @type {number} The bottom position of the track title in the metadata grid. */
		this.gridTitleBottom = 0;
		/** @public @type {number} The width of the track number in the metadata grid. */
		this.gridTrackNumWidth = 0;
		/** @public @type {object} The calculated track title wrap info for the metadata grid. */
		this.gridTitleWrapInfo = {};
		/** @public @type {boolean} The state when the track title string exceeds the available lines in the metadata grid. */
		this.gridTitleWrapLinesExceed = false;
		/** @public @type {number} The width of the wrap space within the track title string in the metadata grid. */
		this.gridTitleWrapWidth = 0;
		/** @public @type {number} The width of the track title in the metadata grid. */
		this.gridTitleWidth = 0;
		/** @public @type {number} The height of the track title in the metadata grid. */
		this.gridTitleHeight = 0;
		/** @public @type {number} The text rectangle for track title string calculation in the metadata grid. */
		this.gridTitleTxtRec = 0;
		/** @public @type {number} The number of lines for the track title text in the metadata grid. */
		this.gridTitleNumLines = 0;
		/** @public @type {number} The height of the track title number of lines in the metadata grid. */
		this.gridTitleNumLinesHeight = 0;
		/** @public @type {number} The top position of the album in the metadata grid. */
		this.gridAlbumTop = 0;
		/** @public @type {number} The bottom position of the album in the metadata grid. */
		this.gridAlbumBottom = 0;
		/** @public @type {object} The calculated album wrap info for the metadata grid. */
		this.gridAlbumWrapInfo = {};
		/** @public @type {boolean} The state when the album string exceeds the available lines in the metadata grid. */
		this.gridAlbumWrapLinesExceed = false;
		/** @public @type {number} The width of the wrap space within the album string in the metadata grid. */
		this.gridAlbumWrapWidth = 0;
		/** @public @type {number} The width of the album in the metadata grid. */
		this.gridAlbumWidth = 0;
		/** @public @type {number} The height of the album in the metadata grid. */
		this.gridAlbumHeight = 0;
		/** @public @type {number} The text rectangle for album string calculation in the metadata grid. */
		this.gridAlbumTxtRec = 0;
		/** @public @type {number} The number of lines for the album text in the metadata grid. */
		this.gridAlbumNumLines = 0;
		/** @public @type {number} The height of the album number of lines in the metadata grid. */
		this.gridAlbumNumLinesHeight = 0;
		/** @public @type {number} The margin between grid columns in the metadata grid. */
		this.gridColumnMargin = SCALE(10);
		/** @public @type {number} The top position of the grid columns in the metadata grid. */
		this.gridColumnTop = 0;
		/** @public @type {number} The height of the grid column cell in the metadata grid. */
		this.gridColumnCellHeight = 0;
		/** @public @type {number} The width of the key strings column in the metadata grid. */
		this.gridColumnKeyWidth = 0;
		/** @public @type {number} The height of the key strings in the metadata grid. */
		this.gridColumnKeyHeight = 0;
		/** @public @type {number} The bottom position of the key strings in the metadata grid. */
		this.gridColumnKeyBottom = 0;
		/** @public @type {number} The width of the value strings column in the metadata grid. */
		this.gridColumnValueWidth = 0;
		/** @public @type {number} The height of the value strings in the metadata grid. */
		this.gridColumnValueHeight = 0;
		/** @public @type {number} The left position of the value strings column in the metadata grid. */
		this.gridColumnValueLeft = 0;
		/** @public @type {number} The bottom position of the value strings in the metadata grid. */
		this.gridColumnValueBottom = 0;

		// * TIMELINE * //
		// #region TIMELINE
		/** @public @type {number} The x-coordinate of the timeline. */
		this.timelineX = 0;
		/** @public @type {number} The y-coordinate of the timeline. */
		this.timelineY = 0;
		/** @public @type {number} The width of the timeline. */
		this.timelineW = 0;
		/** @public @type {number} The height of the timeline. */
		this.timelineH = SCALE(8);
		/** @public @type {number} The color of the played portion of the timeline. */
		this.timelinePlayCol = RGBA(255, 255, 255, 150);
		/** @public @type {number} The color of the added portion of the timeline. */
		this.timelineAddedCol = 0;
		/** @public @type {number} The color of the played portion of the timeline. */
		this.timelinePlayedCol = 0;
		/** @public @type {number} The color of the unplayed portion of the timeline. */
		this.timelineUnplayedCol = 0;
		/** @public @type {number} The ratio of the first played segment in the timeline. */
		this.timelineFirstPlayedRatio = 0;
		/** @public @type {number} The ratio of the last played segment in the timeline. */
		this.timelineLastPlayedRatio = 0;
		/** @public @type {number} The percentage of the first played segment in the timeline. */
		this.timelineFirstPlayedPercent = 0.33;
		/** @public @type {number} The percentage of the last played segment in the timeline. */
		this.timelineLastPlayedPercent = 0.66;
		/** @public @type {number[]} The percentages of the played times on the timeline. */
		this.timelinePlayedTimesPercents = [];
		/** @public @type {number[]} The actual played times on the timeline. */
		this.timelinePlayedTimes = [];
		/** @public @type {number} The width of the timeline line. */
		this.timelineLineWidth = HD_4K(2, 3);
		/** @public @type {number} The extra left space on the timeline. */
		this.timelineExtraLeftSpace = SCALE(3);
		/** @public @type {number} The draw width of the timeline. */
		this.timelineDrawWidth = 0;
		/** @public @type {number} The leeway of the timeline. */
		this.timelineLeeway = 0;
		// #endregion

		// * CACHE * //
		// #region CACHE
		/** @public @type {object} The caching object of the calculated text wrap space for the metadata grid. */
		this.cachedGridWrapSpace = {};
		/** @public @type {boolean} The calculated metadata grid metrics saved so we don't have to recalculate every on every on_paint unless size or metadata changed. */
		this.cachedGridMetrics = false;
		/** @public @type {number} The left edge of the record labels in Details. Saved so we don't have to recalculate every on every on_paint unless size has changed. */
		this.cachedLabelLastLeftEdge = 0;
		/** @public @type {number} The last label height of the record labels in Details. Saved so we don't have to recalculate every on every on_paint unless size has changed. */
		this.cachedLabelLastHeight = 0;
		// #endregion

		// * IMAGES * //
		// #region IMAGES
		/** @public @type {GdiBitmap} The disc art image used in Details. */
		this.discArt = null;
		/** @public @type {GdiBitmap} The disc art album cover image used in Details. */
		this.discArtCover = null;
		/** @public @type {GdiBitmap[]} The array of disc art images used in Details. */
		this.discArtArray = [];
		/** @public @type {number} The scale factor of the disc art used in Details. */
		this.discArtScaleFactor = 0;
		/** @private @type {GdiBitmap} The shadow behind the disc art used in Details. */
		this.discArtShadowImg = null;
		/** @public @type {object} The disc art position used in Details (offset from albumArtSize). */
		this.discArtSize = new ImageSize(0, 0, 0, 0);
		/** @public @type {GdiBitmap} The rotated disc art from the RotateImg helper used in Details. */
		this.discArtRotation = null;
		/** @public @type {number} The global index of current discArtArray img to draw used in Details. */
		this.discArtRotationIndex = 0;
		/** @private @type {GdiBitmap} The release country flag image shown in the metadata grid in Details. */
		this.gridReleaseFlagImg = null;
		/** @private @type {GdiBitmap} The codec logo image shown in the metadata grid in Details. */
		this.gridCodecLogo = null;
		/** @private @type {GdiBitmap} The channel logo image shown in the metadata grid in Details. */
		this.gridChannelLogo = null;
		/** @public @type {GdiBitmap} The band logo image used in Details. */
		this.bandLogo = null;
		/** @public @type {GdiBitmap} The inverted band logo image shown in Details. */
		this.bandLogoInverted = null;
		/** @public @type {GdiBitmap[]} The array of record label images used in Details. */
		this.labelLogo = [];
		/** @public @type {GdiBitmap[]} The array of inverted record label images used in Details. */
		this.labelLogoInverted = [];
		/** @private @type {GdiBitmap} The shadow behind labels used in Details. */
		this.labelShadowImg = null;
		// #endregion

		// * STATE * //
		// #region STATE
		/** @private @type {boolean} The state when disc art was found on hard drive used in Details. */
		this.discArtFound = false;
		/** @public @type {boolean} The last.fm logo image displayed when we %lastfm_play_count% > 0, shown in the metadata grid in Details. */
		this.playCountVerifiedByLastFm = false;
		/** @public @type {object} The boundary section object contains check functions for different sections of the metadata grid. */
		this.gridSectionBounds = {
			artist:   (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridContentWidth)   && y >= this.gridArtistTop   && y <= this.gridArtistBottom,
			title:    (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridContentWidth)   && y >= this.gridTitleTop    && y <= this.gridTitleBottom,
			album:    (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridContentWidth)   && y >= this.gridAlbumTop    && y <= this.gridAlbumBottom,
			tagKey:   (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridColumnKeyWidth) && y >= this.gridAlbumBottom && y <= this.gridColumnKeyBottom,
			tagValue: (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridColumnKeyWidth + this.gridColumnValueWidth)  && y >= this.gridAlbumBottom && y <= this.gridColumnValueBottom,
			timeline: (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridContentWidth)   && y >= this.timelineY - SCALE(10) && y < this.timelineY + this.timelineH + SCALE(10),
			grid:     (x, y) => x >= this.gridMarginLeft && x <= (this.gridMarginLeft + this.gridContentWidth)   && y >= this.gridArtistTop   && y <= this.gridColumnValueBottom
		};
		/** @private @type {string} The text content of the grid tooltip. */
		this.gridTooltipText = '';
		/** @private @type {string} The text content of the grid timeline tooltip. */
		this.gridTimelineTooltipText = '';
		// #endregion

		// * TIMERS * //
		// #region TIMERS
		/** @public @type {number} The disc art rotation timer when disc art spins while song is playing. */
		this.discArtRotationTimer = null;
		// #endregion
	}

	// * PLUBLIC METHODS - DRAW * //
	// #region PUBLIC METHODS - DRAW
	/**
	 * Draws the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetails(gr) {
		this.drawBackground(gr);
		this.drawDiscArt(gr);
		this.drawGrid(gr);
		this.drawBandLogo(gr);
		this.drawLabelLogo(gr);
	}

	/**
	 * Draws the Details background.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBackground(gr) {
		if (!fb.IsPlaying && !grSet.panelBrowseMode || !grm.ui.displayDetails) {
			return;
		}

		gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		gr.SetSmoothingMode(SmoothingMode.None);


		if (grm.ui.isStreaming && grm.ui.noArtwork || !grm.ui.albumArt && grm.ui.noArtwork) {
			gr.FillSolidRect(0, grm.ui.topMenuHeight, grm.ui.ww, grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight, grCol.detailsBg);
		} else {
			gr.FillSolidRect(0, grm.ui.albumArtSize.y, grSet.noDiscArtBg && !this.discArt ? grm.ui.ww : grm.ui.albumArtSize.x, grm.ui.albumArtSize.h, grCol.detailsBg);
		}

		if (grm.ui.albumArt && grSet.styleBlend && grCol.imgBlended) {
			gr.DrawImage(grCol.imgBlended, 0, 0, grm.ui.ww, grm.ui.wh, 0, 0, grCol.imgBlended.Width, grCol.imgBlended.Height);
		}

		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}

	/**
	 * Draws the disc art in Details.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDiscArt(gr) {
		if (grSet.layout !== 'default' || !grSet.displayDiscArt || !grm.ui.displayDetails || grm.ui.noAlbumArtStub ||
			this.discArtSize.y < grm.ui.albumArtSize.y || this.discArtSize.h > grm.ui.albumArtSize.h) {
			return;
		}

		const drawDiscArtProfiler = grm.ui.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> disc art');

		if (!this.discArtRotation) {
			this.setDiscArtRotation();
		}

		const drawDiscArtImage = () => {
			if (!grSet.filterDiscArtFromArtwork && grm.ui.discArtImageDisplayed) return;
			const discArtImg = this.discArtArray[this.discArtRotationIndex] || this.discArtRotation;
			this.discArtShadowImg && gr.DrawImage(this.discArtShadowImg, -this.discArtShadow, grm.ui.albumArtSize.y - this.discArtShadow, this.discArtShadowImg.Width, this.discArtShadowImg.Height, 0, 0, this.discArtShadowImg.Width, this.discArtShadowImg.Height);
			gr.DrawImage(discArtImg, this.discArtSize.x, this.discArtSize.y, this.discArtSize.w, this.discArtSize.h, 0, 0, discArtImg.Width, discArtImg.Height, 0);
		};

		const applyOpacity = !grm.ui.displayLyrics && grm.ui.albumArtSize.w < grm.ui.ww * 0.66;
		const albumArtOpacity = applyOpacity ? grSet.detailsAlbumArtOpacity : 255;

		if (!grSet.discArtOnTop || grm.ui.displayLyrics) {
			drawDiscArtImage();
			if (this.discArtRotation && grSet.detailsAlbumArtDiscAreaOpacity !== 255) {
				const discArtOpacity = applyOpacity ? grSet.detailsAlbumArtDiscAreaOpacity : 255;
				this.createDiscArtAlbumArtMask(gr, grm.ui.albumArtSize.x, grm.ui.albumArtSize.y, grm.ui.albumArtSize.w, grm.ui.albumArtSize.h, 0, 0, grm.ui.albumArtScaled.Width, grm.ui.albumArtScaled.Height, 0, discArtOpacity);
			} else {
				grm.ui.drawAlbumArt(gr, albumArtOpacity);
			}
		} else { // * Draw discArt on top of front cover
			grm.ui.drawAlbumArt(gr, albumArtOpacity);
			drawDiscArtImage();
		}

		if (drawDiscArtProfiler) drawDiscArtProfiler.Print();
	}

	/**
	 * Draws the metadata grid on the left side in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGrid(gr) {
		if (!fb.IsPlaying && !grSet.panelBrowseMode || !grm.ui.displayDetails) return;

		const drawGridProfiler = grm.ui.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> metadata grid');

		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

		this.setGridMetrics(gr);
		this.gridTop = this.gridTopStart;

		if (this.gridContentWidth > 150) {
			const spacing = Math.floor(this.gridLineSpacing * 0.33);
			const spacing2 = Math.floor(this.gridLineSpacing * 0.5);

			// * Artist
			if (grSet.showGridArtist_layout) {
				this.gridTop += this.drawGridArtist(gr) + spacing;
			}

			// * Title
			if (grSet.showGridTitle_layout) {
				this.gridTop += this.drawGridTitle(gr) + spacing;
			} else if (!grSet.showGridArtist_layout) {
				this.gridTop += this.drawGridAlbum(gr) + spacing;
			}

			// * Timeline
			if (grSet.showGridTimeline_layout) {
				this.setGridTimelineSize(this.gridMarginLeft, this.gridTop + spacing, grm.ui.albumArtSize.x - this.gridMarginLeft * 2, this.timelineH);
				this.drawGridTimeline(gr);
				this.gridTop += this.timelineH + this.gridLineSpacing;
			}

			// * Album
			if (grSet.showGridArtist_layout || grSet.showGridTitle_layout) {
				this.gridTop += this.drawGridAlbum(gr) + spacing2;
			}

			// * Columns key and value
			this.drawGridColumns(gr);
		}

		if (drawGridProfiler) drawGridProfiler.Print();
	}

	/**
	 * Draws the custom metadata grid menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridMenu(gr) {
		if (!grm.ui.displayMetadataGridMenu || grSet.layout !== 'default') return;

		const x = grm.ui.albumArtSize.x - 1;
		const y = grm.ui.topMenuHeight;
		const width = grm.ui.ww;
		const height = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;

		gr.FillSolidRect(x, y, width, height, pl.col.bg);
		for (const c of CustomMenu.controlList) c.draw(gr);

		if (CustomMenu.activeControl && CustomMenu.activeControl instanceof CustomMenuDropDown && CustomMenu.activeControl.isSelectUp) {
			CustomMenu.activeControl.draw(gr);
		}
	}

	/**
	 * Draws the artist on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @returns {number} The height of the artist.
	 */
	drawGridArtist(gr) {
		if (!grStr.artist) return 0;

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && (grSet.gridArtistFontSize_layout < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

		const artistColor = ['white', 'black', 'reborn', 'random'].includes(grSet.theme) ? grCol.detailsText : grSet.theme === 'cream' ? pl.col.header_artist_normal : pl.col.header_artist_playing;
		DrawString(gr, grm.ui.getFormattedString('gridArtist'), grFont.gridArtist, artistColor,	this.gridMarginLeft, Math.round(this.gridTop), this.gridContentWidth, this.gridArtistNumLinesHeight, Stringformat.trim_ellipsis_char);

		// * Artist country flags
		if (grStr.artist && grSet.showGridArtistFlags_layout) {
			grm.ui.drawArtistCountryFlag(gr, 'metadataGrid');
		}

		this.gridArtistTop = this.gridTop;
		this.gridArtistBottom = this.gridTop + this.gridArtistNumLinesHeight;
		return this.gridArtistNumLinesHeight;
	}

	/**
	 * Draws the track title on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @returns {number} The height of the title.
	 */
	drawGridTitle(gr) {
		if (!grStr.title) return 0;

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && (grSet.gridTitleFontSize_layout < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

		DrawString(gr, grm.ui.getFormattedString('gridTitle'), grFont.gridTitle, grCol.detailsText, this.gridMarginLeft, Math.round(this.gridTop), this.gridContentWidth, this.gridTitleNumLinesHeight, Stringformat.trim_ellipsis_char);

		this.gridTitleTop = this.gridTop;
		this.gridTitleBottom = this.gridTop + this.gridTitleNumLinesHeight;
		return this.gridTitleNumLinesHeight;
	}

	/**
	 * Draws the album on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @returns {number} The height of the album.
	 */
	drawGridAlbum(gr) {
		if (!grStr.album) return 0;

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && (grSet.gridAlbumFontSize_layout < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

		DrawString(gr, grStr.album, grFont.gridAlbum, grCol.detailsText, this.gridMarginLeft, Math.round(this.gridTop), this.gridContentWidth, this.gridAlbumNumLinesHeight, Stringformat.trim_ellipsis_char);

		this.gridAlbumTop = this.gridTop;
		this.gridAlbumBottom = this.gridTop + this.gridAlbumNumLinesHeight;
		return this.gridAlbumNumLinesHeight;
	}

	/**
	 * Draws the column key and column value on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridColumns(gr) {
		for (let k = 0; k < grStr.grid.length; k++) {
			this.gridColumnKey = grStr.grid[k].label;
			this.gridColumnValue = grStr.grid[k].val;
			this.gridTxtRec = gr.MeasureString(this.gridColumnValue, grFont.gridVal, 0, 0, this.gridColumnValueWidth, grm.ui.wh);
			this.gridColumnCellHeight = this.gridTxtRec.Height + 5;
			this.gridColumnTop = this.gridTop;

			let gridShowLastFmImage = false;
			let gridShowReleaseFlagImage = false;
			let gridShowCodecLogoImage = false;
			let gridShowChannelLogoImage = false;
			let gridDropShadow = false;
			let gridValueColor = grCol.detailsText;

			if (this.gridColumnValue.length) {
				const columnKey = {
					'Catalog': () => {
						gridShowReleaseFlagImage = grSet.showGridReleaseFlags_layout;
						if (grSet.showGridReleaseFlags_layout === 'logo') {
							this.gridColumnValue = this.gridColumnValue.replace($('%releasecountry%'), '');
						}
					},
					'Rel. Country': () => {
						gridShowReleaseFlagImage = grSet.showGridReleaseFlags_layout;
						if (grSet.showGridReleaseFlags_layout === 'logo') this.gridColumnValue = '';
					},
					'Codec': () => {
						gridShowCodecLogoImage = grSet.showGridCodecLogo_layout;
						this.gridColumnValue = grSet.showGridCodecLogo_layout === 'logo' ? '' : this.getCodecString();
						this.gridColumnCellHeight = this.gridColumnValueHeight + 5;
					},
					'Channels': () => {
						gridShowChannelLogoImage = grSet.showGridChannelLogo_layout;
						this.gridColumnValue = grSet.showGridChannelLogo_layout === 'logo' ? '' : this.getChannelString($('%channels%'));
						this.gridColumnCellHeight = this.gridColumnValueHeight + 5;
					},
					'Hotness': () => {
						gridValueColor = grCol.detailsHotness;
						gridDropShadow = true;
					},
					'Play Count': () => {
						gridShowLastFmImage = true;
					},
					'Rating': () => {
						gridValueColor = grCol.detailsRating;
						gridDropShadow = true;
					},
					'default': () => {
						let matchCount = 0;
						// * On small player sizes, there is no space for all metadata entries.
						// * Hide them and only display entries from basicMeta.
						if (this.basicMetadataDisplay(this.gridColumnKey)) {
							this.gridColumnValue = '';
							this.gridColumnKey = '';
							matchCount++;
						}
						this.gridTop -= this.gridColumnCellHeight * matchCount;
					}
				};
				(columnKey[this.gridColumnKey] || columnKey.default)();

				if (this.gridTop + this.gridTxtRec.Height < grm.ui.albumArtSize.y + grm.ui.albumArtSize.h) {
					// * Apply better anti-aliasing on smaller font sizes in HD res
					gr.SetTextRenderingHint(!RES._4K && (grSet.gridKeyFontSize_layout < 17 || grSet.gridValueFontSize_layout + SCALE(1) < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

					if (gridDropShadow) {
						const gridBorderWidth = SCALE(0.5);
						gr.DrawString(this.gridColumnValue, grFont.gridVal, grCol.darkAccent_50, Math.round(this.gridColumnValueLeft + gridBorderWidth), Math.round(this.gridTop + gridBorderWidth), this.gridColumnValueWidth, this.gridColumnCellHeight, StringFormat(0, 0, 4));
						gr.DrawString(this.gridColumnValue, grFont.gridVal, grCol.darkAccent_50, Math.round(this.gridColumnValueLeft - gridBorderWidth), Math.round(this.gridTop + gridBorderWidth), this.gridColumnValueWidth, this.gridColumnCellHeight, StringFormat(0, 0, 4));
						gr.DrawString(this.gridColumnValue, grFont.gridVal, grCol.darkAccent_50, Math.round(this.gridColumnValueLeft + gridBorderWidth), Math.round(this.gridTop - gridBorderWidth), this.gridColumnValueWidth, this.gridColumnCellHeight, StringFormat(0, 0, 4));
						gr.DrawString(this.gridColumnValue, grFont.gridVal, grCol.darkAccent_50, Math.round(this.gridColumnValueLeft - gridBorderWidth), Math.round(this.gridTop - gridBorderWidth), this.gridColumnValueWidth, this.gridColumnCellHeight, StringFormat(0, 0, 4));
					}
					gr.DrawString(this.gridColumnKey, grFont.gridKey, grCol.detailsText, this.gridMarginLeft, Math.round(this.gridTop), this.gridColumnKeyWidth, this.gridColumnCellHeight, Stringformat.trim_ellipsis_char);
					gr.DrawString(this.gridColumnValue, grFont.gridVal, gridValueColor, this.gridColumnValueLeft, Math.round(this.gridTop), this.gridColumnValueWidth, this.gridColumnCellHeight, StringFormat(0, 0, 4));

					// * Release flag
					if (gridShowReleaseFlagImage) {
						this.drawGridReleaseFlag(gr);
					}
					// * Codec logo
					if (gridShowCodecLogoImage) {
						this.drawGridCodecLogo(gr);
					}
					// * Channel logo
					if (gridShowChannelLogoImage) {
						this.drawGridChannelLogo(gr);
					}
					// * Last.fm logo
					if (gridShowLastFmImage) {
						this.drawGridLastfmLogo(gr);
					}
					this.gridTop += this.gridColumnCellHeight + 5;
				}
			}
		}
	}

	/**
	 * Draws an image on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {GdiBitmap} image - The image to draw.
	 * @param {boolean} showLogoOnly - Whether to show only the logo.
	 * @param {number} xOffset - The offset added to x position.
	 * @param {number} yOffset - The offset added to y position.
	 * @param {number} cellHeightAdjustment - The adjustment applied to cell height.
	 */
	drawGridImage(gr, image, showLogoOnly, xOffset = 0, yOffset = 0, cellHeightAdjustment = 0) {
		if (image == null) return;

		// Calculate metrics and ratios
		const gridColumnValueMetrics = gr.MeasureString(showLogoOnly ? '' : this.gridColumnValue, grFont.gridVal, 0, 0, this.gridColumnValueWidth, grm.ui.wh);
		const heightRatio = (gr.CalcTextHeight(showLogoOnly ? 'Ag' : this.gridColumnValue, grFont.gridVal) - cellHeightAdjustment) / image.Height;
		const logoHeight = Math.round(image.Height * heightRatio);
		const logoWidth = Math.round(image.Width * heightRatio);

		// Get the width of the last line
		const newLineWidth = gr.EstimateLineWrap(this.gridColumnValue, grFont.gridVal, this.gridTxtRec.Lines === 1 ? this.gridColumnValueWidth : this.gridTxtRec.Width);
		const lastLineIndex = newLineWidth.length - 1;
		const lastLineWidth = newLineWidth[lastLineIndex] || gridColumnValueMetrics.Width;

		// Initial positions
		const stringWidth = lastLineWidth + xOffset;
		let xPos = this.gridColumnValueLeft + stringWidth;
		let yPos = this.gridTop + yOffset;

		// Adjust positions if the logo width exceeds the grid column width and move logo to the next line
		if (xPos + logoWidth > this.gridColumnValueLeft + this.gridColumnValueWidth) {
			const textHeight = gr.CalcTextHeight('Ag', grFont.gridVal);
			xPos = this.gridColumnValueLeft;
			yPos += textHeight;
			this.gridTxtRec = { ...this.gridTxtRec, Lines: this.gridTxtRec.Lines + 1, Height: this.gridTxtRec.Height + textHeight };
			this.gridColumnCellHeight = this.gridTxtRec.Height + 5;
		}

		gr.DrawImage(image, xPos, yPos, logoWidth, logoHeight, 0, 0, image.Width, image.Height);
	}

	/**
	 * Draws the release flag on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridReleaseFlag(gr) {
		if (this.gridReleaseFlagImg == null) return;

		const logoOnly = grSet.showGridReleaseFlags_layout === 'logo' && this.gridColumnKey === 'Rel. Country';
		const lineHeight = this.gridTxtRec.Height / this.gridTxtRec.Lines;
		const yCorr = (this.gridTxtRec.Lines - 1) * lineHeight;

		this.drawGridImage(gr, this.gridReleaseFlagImg, logoOnly, SCALE(logoOnly ? 0 : 8), logoOnly ? 0 : yCorr);
	}

	/**
	 * Draws the codec logo on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridCodecLogo(gr) {
		if (this.gridCodecLogo == null) this.loadGridCodecLogo();
		if (this.gridCodecLogo == null) return;

		const logoOnly = grSet.showGridCodecLogo_layout === 'logo';
		this.drawGridImage(gr, this.gridCodecLogo, logoOnly, SCALE(logoOnly ? 0 : 8), logoOnly ? -1 : 2);
	}

	/**
	 * Draws the channel logo on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridChannelLogo(gr) {
		if (this.gridChannelLogo == null) this.loadGridChannelLogo();
		if (this.gridChannelLogo == null) return;

		const logoOnly = grSet.showGridChannelLogo_layout === 'logo';
		this.drawGridImage(gr, this.gridChannelLogo, logoOnly, SCALE(logoOnly ? 0 : 8), logoOnly ? -1 : 2);
	}

	/**
	 * Draws the last.fm logo on the metadata grid in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridLastfmLogo(gr) {
		if (!this.playCountVerifiedByLastFm) return;

		const lastFmImg = gdi.Image(grPath.lastFmImageRed);
		const lastFmWhiteImg = gdi.Image(grPath.lastFmImageWhite);
		const lastFmLogo = ColorDistance(grCol.primary, RGB(185, 0, 0), false) < 133 ? lastFmWhiteImg : lastFmImg;
		const lineHeight = this.gridTxtRec.Height / this.gridTxtRec.Lines;
		const yCorr = (this.gridTxtRec.Lines - 1) * lineHeight;

		this.drawGridImage(gr, lastFmLogo, false, SCALE(8), yCorr, 6);
	}

	/**
	 * Draws the band logo on the bottom left side in the Details panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBandLogo(gr) {
		if (!fb.IsPlaying && !grSet.panelBrowseMode || !grm.ui.albumArt || grSet.layout !== 'default' || !grm.ui.displayDetails ||
			grSet.lyricsLayout === 'full' && grm.ui.displayLyrics) {
			return;
		}

		const drawBandLogoProfiler = grm.ui.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> band logo');
		const availableSpace = grm.ui.albumArtSize.y + grm.ui.albumArtSize.h - this.gridTop;
		const lightBg = Color.BRT(grCol.detailsText) < 140;
		const logo = lightBg || grm.ui.noAlbumArtStub ? (this.bandLogoInverted || this.bandLogo) : this.bandLogo;

		if (logo && availableSpace > 75) {
			let logoWidth = Math.min(HD_4K(logo.Width / 2, logo.Width), grm.ui.albumArtSize.x - grm.ui.ww * 0.05);
			const heightScale = Math.min(logoWidth / logo.Width, availableSpace / logo.Height);
			logoWidth = logo.Width * heightScale; // Adjust logoWidth after heightScale is potentially updated

			const logoX = Math.round(grm.ui.isStreaming ? SCALE(40) : grm.ui.albumArtSize.x / 2 - logoWidth / 2);
			const logoY = Math.round(grm.ui.albumArtSize.y + grm.ui.albumArtSize.h - (logo.Height * heightScale)) - HD_4K(4, 24);
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
	drawLabelLogo(gr) {
		if (!fb.IsPlaying && !grSet.panelBrowseMode || !grm.ui.albumArt || grSet.layout !== 'default' || !grm.ui.displayDetails ||
			grSet.lyricsLayout === 'full' && grm.ui.displayLyrics) {
			return;
		}

		const drawLabelLogoProfiler = grm.ui.showDrawExtendedTiming && fb.CreateProfiler('on_paint -> label logo');

		if (this.labelLogo.length > 0) {
			const lightBg = grSet.labelArtOnBg ? Color.BRT(grCol.bg) > 140 : Color.BRT(grCol.detailsText) < 140;
			const labels = lightBg || grm.ui.noAlbumArtStub ? (this.labelLogoInverted.length ? this.labelLogoInverted : this.labelLogo) : this.labelLogo;
			const rightSideGap = 20; // How close last label is to right edge
			const leftEdgeGap = (grm.ui.albumArtOffCenter ? 20 : 40) * HD_4K(1, 1.8); // Space between art and label
			const leftEdgeWidth = HD_4K(30, 45); // How far label background extends on left
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
			if (!this.cachedLabelLastLeftEdge) { // We don't want to recalculate this every screen refresh
				DebugLog('Logo => Recalculating lastLeftEdge');
				this.shadowImgLabel = null;
				labelWidth = Math.round(totalLabelWidth / labels.length);
				labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // Might be recalc'd below
				if (grm.ui.albumArt) {
					if (this.discArt && grSet.displayDiscArt) {
						leftEdge = Math.round(Math.max(grm.ui.albumArtSize.x + grm.ui.albumArtScaled.Width + 5, grm.ui.ww * 0.975 - totalLabelWidth + 1));
						const discCenter = {};
						discCenter.x = Math.round(this.discArtSize.x + this.discArtSize.w / 2);
						discCenter.y = Math.round(this.discArtSize.y + this.discArtSize.h / 2);
						const radius = discCenter.y - this.discArtSize.y;
						const radiusSquared = radius * radius;
						let posValid = false;

						while (!posValid) {
							const allLabelsWidth = Math.max(Math.min(Math.round((grm.ui.ww - leftEdge - rightSideGap) / labels.length), maxLabelWidth), 50);
							//console.log("leftEdge = " + leftEdge + ", grm.ui.ww-leftEdge-10 = " + (grm.ui.ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
							const maxWidth = RES._4K && labels[0].Width < 200 ? labels[0].Width * 2 : labels[0].Width;
							labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
							labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // Width is based on height scale
							topEdge = Math.round(grm.ui.albumArtSize.y + grm.ui.albumArtSize.h - labelHeight);

							const a = topEdge - discCenter.y + 1; // Adding 1 to a and b so that the border just touches the edge of the discArt
							const b = leftEdge - discCenter.x + 1;

							if ((a * a + b * b) > radiusSquared) {
								posValid = true;
							} else {
								leftEdge += 4;
							}
						}
					} else {
						leftEdge = Math.round(Math.max(grm.ui.albumArtSize.x + grm.ui.albumArtSize.w + leftEdgeWidth + leftEdgeGap, grm.ui.ww * 0.975 - totalLabelWidth + 1));
					}
				} else {
					leftEdge = Math.round(grm.ui.ww * 0.975 - totalLabelWidth);
				}
				labelAreaWidth = grm.ui.ww - leftEdge - rightSideGap;
				this.cachedLabelLastLeftEdge = leftEdge;
				this.cachedLabelLastHeight = labelHeight;
			}
			else { // Already calculated
				leftEdge = this.cachedLabelLastLeftEdge;
				labelHeight = this.cachedLabelLastHeight;
				labelAreaWidth = grm.ui.ww - leftEdge - rightSideGap;
			}
			if (labelAreaWidth >= SCALE(50)) {
				if (labels.length > 1) {
					labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // Spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				const allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
				const origLabelHeight = labelHeight;
				let labelX = leftEdge;
				topEdge = grm.ui.albumArtSize.y + grm.ui.albumArtSize.h - labelHeight - 20;

				if (!grSet.labelArtOnBg && !grSet.noDiscArtBg || grSet.noDiscArtBg && grSet.displayDiscArt && this.discArt) {
					if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme)) {
						if (!this.shadowImgLabel) {
							this.shadowImgLabel = ShadowRect(this.discArtShadow, this.discArtShadow, grm.ui.ww - labelX + leftEdgeWidth, labelHeight + 40, this.discArtShadow, grCol.shadow);
						}
						gr.DrawImage(this.shadowImgLabel, labelX - leftEdgeWidth - this.discArtShadow, topEdge - 20 - this.discArtShadow, grm.ui.ww - labelX + leftEdgeWidth + 2 * this.discArtShadow, labelHeight + 40 + 2 * this.discArtShadow,
							0, 0, this.shadowImgLabel.Width, this.shadowImgLabel.Height);
					}
					gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing
					gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, grm.ui.ww - labelX + leftEdgeWidth, labelHeight + 40, grCol.detailsBg);
					gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, grm.ui.ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, grCol.shadow);
					gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
				}
				for (let i = 0; i < labels.length; i++) {
					// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
					const maxWidth = RES._4K && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
					labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
					labelHeight = Math.round(labels[i].Height * labelWidth / labels[i].Width); // Width is based on height scale

					gr.DrawImage(labels[i], labelX, Math.round(topEdge + origLabelHeight / 2 - labelHeight / 2), labelWidth, labelHeight, 0, 0, this.labelLogo[i].Width, this.labelLogo[i].Height);
					labelX += labelWidth + labelSpacing;
				}
			}
		}

		if (drawLabelLogoProfiler) drawLabelLogoProfiler.Print();
	}
	// #endregion

	// * PLUBLIC METHODS - METRICS * //
	// #region PUBLIC METHODS - METRICS
	/**
	 * Sets the metadata grid metrics and caches all calculated values.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	setGridMetrics(gr) {
		if (this.cachedGridMetrics) return;

		const metricsPromises = [
			new Promise((resolve) => this.setGridMainMetrics(gr, resolve)),
			new Promise((resolve) => this.setGridTextMetrics(gr, resolve))
		];

		Promise.all(metricsPromises).then(() => {
			this.cachedGridMetrics = this.gridColumnValueBottom > this.gridColumnTop && !grm.display.hasPlayerSizeChanged();
		});
	}

	/**
	 * Sets the metadata grid main sizes.
	 * This includes calculating margins, content width, and column dimensions.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {Function} metricsCalculated - The callback function to be executed after calculations are finished.
	 */
	setGridMainMetrics(gr, metricsCalculated) {
		this.discArtShadow = SCALE(6);
		this.gridTooltipHeight  = SCALE(100);
		this.timelineH = SCALE(8);

		this.gridMarginLeft   = grm.ui.edgeMargin;
		this.gridTopStart     = grm.ui.albumArtSize.y ? grm.ui.albumArtSize.y + grm.ui.edgeMargin : grm.ui.topMenuHeight + grm.ui.edgeMargin;
		this.gridTop          = this.gridTopStart;
		this.gridContentWidth = Math.floor((!grm.ui.albumArt && this.discArt ? this.discArtSize.x : grm.ui.albumArtSize.x) - grm.ui.edgeMargin * 1.5);

		this.gridColumnKeyWidth  = CalcGridMaxTextWidth(gr, grStr.grid, grFont.gridKey);
		this.gridColumnKeyHeight = gr.MeasureString('Ag', grFont.gridKey, 0, 0, this.gridContentWidth, grm.ui.wh).Height;
		this.gridColumnKeyBottom = this.gridColumnTop + this.gridColumnKeyHeight;

		this.gridColumnValueWidth  = this.gridContentWidth - this.gridColumnMargin - this.gridColumnKeyWidth + SCALE(5);
		this.gridColumnValueHeight = gr.MeasureString('Ag', grFont.gridVal, 0, 0, this.gridContentWidth, grm.ui.wh).Height;
		this.gridColumnValueLeft   = this.gridMarginLeft + this.gridColumnKeyWidth + this.gridColumnMargin;
		this.gridColumnValueBottom = this.gridColumnTop + this.gridColumnValueHeight;

		metricsCalculated();
	}

	/**
	 * Sets the metadata grid text sizes.
	 * This includes calculating wrap information and dimensions for artist, title, album, and other text elements based on the grid configuration.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {Function} metricsCalculated - The callback function to be executed after calculations are finished.
	 */
	setGridTextMetrics(gr, metricsCalculated) {
		if (grSet.showGridArtist_layout) {
			this.gridFlagSizeW             = grm.ui.getFlagSizeWidth('metadataGrid');
			this.gridFlagSizeWhiteSpace    = grm.ui.getFlagSizeWhiteSpace('metadataGrid');
			this.gridArtistWrapInfo        = CalcWrapSpace(gr, grStr.artist, grFont.gridArtist, this.gridContentWidth, this.cachedGridWrapSpace);
			this.gridArtistWrapLinesExceed = this.gridArtistWrapInfo.lineCount > 2;
			this.gridArtistWrapWidth       = this.gridArtistWrapInfo.totalWrapSpace - this.gridFlagSizeW;
			this.gridArtistWidth           = Math.ceil(gr.MeasureString(grStr.artist, grFont.gridArtist, 0, 0, 0, 0, Stringformat.trim_ellipsis_char | Stringformat.measure_trailing_spaces).Width + this.gridFlagSizeW + this.gridArtistWrapWidth);
			this.gridArtistHeight          = gr.MeasureString(grStr.artist, grFont.gridArtist, 0, 0, 0, 0).Height;
			this.gridArtistTxtRec          = gr.MeasureString(grStr.artist, grFont.gridArtist, 0, 0, grSet.showGridArtistFlags_layout && grm.ui.flagImgs.length ? this.gridContentWidth - this.gridFlagSizeW : this.gridContentWidth, grm.ui.wh);
			this.gridArtistNumLines        = Math.min(2, this.gridArtistTxtRec.Lines);
			this.gridArtistNumLinesHeight  = gr.CalcTextHeight(grStr.artist, grFont.gridArtist) * this.gridArtistNumLines;
		}
		if (grSet.showGridTitle_layout) {
			this.gridTrackNumWidth        = Math.ceil(gr.MeasureString(grStr.tracknum, grFont.gridTrackNumber, 0, 0, 0, 0).Width);
			this.gridTitleWrapInfo        = CalcWrapSpace(gr, grm.ui.getFormattedString('gridTitle'), grFont.gridTitle, this.gridContentWidth, this.cachedGridWrapSpace);
			this.gridTitleWrapLinesExceed = this.gridTitleWrapInfo.lineCount > 2;
			this.gridTitleWrapWidth       = this.gridTitleWrapInfo.totalWrapSpace;
			this.gridTitleWidth           = Math.ceil(gr.MeasureString(grStr.title, grFont.gridTitle, 0, 0, 0, 0, Stringformat.trim_ellipsis_char | Stringformat.measure_trailing_spaces).Width + this.gridTrackNumWidth + this.gridTrackNumSpacing + this.gridTitleWrapWidth);
			this.gridTitleHeight          = gr.MeasureString(grStr.title, grFont.gridTitle, 0, 0, 0, 0).Height;
			this.gridTitleTxtRec          = gr.MeasureString(grm.ui.getFormattedString('gridTitle'), grFont.gridTitle, 0, 0, this.gridContentWidth, grm.ui.wh);
			this.gridTitleNumLines        = Math.min(2, this.gridTitleTxtRec.Lines);
			this.gridTitleNumLinesHeight  = gr.CalcTextHeight(grStr.title, grFont.gridTitle) * this.gridTitleNumLines;
		}
			this.gridAlbumWrapInfo        = CalcWrapSpace(gr, grStr.album, grFont.gridAlbum, this.gridContentWidth, this.cachedGridWrapSpace);
			this.gridAlbumWrapLinesExceed = this.gridAlbumWrapInfo.lineCount > (grSet.showGridArtist_layout || grSet.showGridTitle_layout ? 2 : 3);
			this.gridAlbumWrapWidth       = this.gridAlbumWrapInfo.totalWrapSpace;
			this.gridAlbumWidth           = Math.ceil(gr.MeasureString(grStr.album, grFont.gridAlbum, 0, 0, 0, 0, Stringformat.trim_ellipsis_char | Stringformat.measure_trailing_spaces).Width) + this.gridAlbumWrapWidth;
			this.gridAlbumHeight          = gr.MeasureString(grStr.album, grFont.gridAlbum, 0, 0, 0, 0).Height;
			this.gridAlbumTxtRec          = gr.MeasureString(grStr.album, grFont.gridAlbum, 0, 0, this.gridContentWidth, grm.ui.wh);
			this.gridAlbumNumLines        = Math.min(grSet.showGridArtist_layout || grSet.showGridTitle_layout ? 2 : 3, this.gridAlbumTxtRec.Lines);
			this.gridAlbumNumLinesHeight  = gr.CalcTextHeight(grStr.album, grFont.gridAlbum) * this.gridAlbumNumLines;

			metricsCalculated();
	}
	// #endregion

	// * PUBLIC METHODS - COMMON * //
	// #region PUBLIC METHODS - COMMON
	/**
	 * Clears the specified cache, individual properties, or all caches.
	 * @param {string} [type] - The type of cache to clear. Can be 'metrics', 'discArt', 'codecLogo', 'channelLogo', 'bandLogo', 'labelLogo'.
	 * @param {string} [property] - The specific property to clear within the cacheType.
	 * @param {boolean} [clearArtCache] - Whether to clear everything in the artCache object.
	 * @param {boolean} [keepDiscArt] - Whether to keep the disc art.
	 * @example
	 * // Clear all caches
	 * clearCache();
	 * @example
	 * // Clear a specific section of the cache
	 * clearCache('metrics');
	 * @example
	 * // Clear an individual property within a specific section
	 * clearCache('metrics', 'cachedGridMetrics');
	 * @example
	 * // Clear all caches and the artCache
	 * clearCache(undefined, undefined, true);
	 */
	clearCache(type, property, clearArtCache, keepDiscArt) {
		const cacheProperties = {
			metrics: {
				cachedGridWrapSpace: {},
				cachedGridMetrics: false,
				cachedLabelLastLeftEdge: 0,
				cachedLabelLastHeight: 0
			},
			discArt: {
				discArt: keepDiscArt ? this.discArt : null,
				discArtCover: null,
				discArtArray: [],
				discArtRotation: null
			},
			codecLogo: {
				gridCodecLogo: null
			},
			channelLogo: {
				gridChannelLogo: null
			},
			bandLogo: {
				bandLogo: null,
				bandLogoInverted: null
			},
			labelLogo: {
				labelLogo: [],
				labelLogoInverted: []
			}
		};

		if (clearArtCache) {
			grm.artCache && grm.artCache.clear();
			DebugLog('Details cache => Art cache cleared');
		}

		if (type && cacheProperties[type]) {
			if (property && cacheProperties[type][property] !== undefined) {
				this[property] = cacheProperties[type][property];
				DebugLog(`Details cache => Cleared property "${property}" in cache type "${type}"`);
			} else {
				Object.assign(this, cacheProperties[type]);
				DebugLog(`Details cache => Cleared all properties in cache type "${type}"`);
			}
		}
		else if (!type) {
			for (const property in cacheProperties) {
				Object.assign(this, cacheProperties[property]);
				DebugLog(`Details cache => Cleared all properties in cache type "${property}"`);
			}
		}
	}

	/**
	 * Clears timers based on the timer type.
	 * @param {string} [type] - The type of timer to clear. If not provided, all timers will be cleared.
	 * - 'discArt'.
	 */
	clearTimer(type) {
		const timers = {
			discArt: {
				timer: this.discArtRotationTimer,
				clear: clearInterval,
				log: 'Timer => Disc art rotation timer cleared'
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
	// #endregion

	// * PUBLIC METHODS - METADATA GRID * //
	// #region PUBLIC METHODS - METADATA GRID
	/**
	 * Initializes the metadata grid menu and toggles its open/close state.
	 */
	initGridMenuState() {
		if (grSet.layout !== 'default') {
			const msg = grm.msg.getMessage('main', 'metadataGridLiveEdit');
			fb.ShowPopupMessage(msg, 'Metadata grid live editing');
			return;
		}

		grm.ui.displayMetadataGridMenu = !grm.ui.displayMetadataGridMenu;
		grm.ui.displayCustomThemeMenu = false;

		if (grm.ui.displayMetadataGridMenu) {
			if (!grm.ui.displayDetails) {
				grm.ui.displayDetails = true;
				grm.ui.displayPlaylist = false;
				grm.ui.displayLibrary = false;
				grm.ui.displayBiography = false;
				grm.ui.resizeArtwork(true);
			}

			grm.gridMenu.initMetadataGridMenu(1);
		}

		grm.button.initButtonState();
		window.Repaint();
	}

	/**
	 * Determines whether basic metadata should be displayed based on the grid column width.
	 * @param {string} gridColumnKey - The grid column key.
	 * @returns {boolean} True if basic metadata should be displayed, otherwise false.
	 */
	basicMetadataDisplay(gridColumnKey) {
		const resolutions = [
			{ displayRes: 'HD',  maxW: 1250, maxH: 800 },
			{ displayRes: 'QHD', maxW: 1350, maxH: 900 },
			{ displayRes: '4K',  maxW: 2350, maxH: 1550 }
		];

		const basicMeta = ['Year', 'Label', 'Genre', 'Codec', 'Channels', 'Source', 'Data', 'Play Count', 'Rating'];
		const smallRes = resolutions.some(res => grSet.displayRes === res.displayRes && (grm.ui.ww < res.maxW || grm.ui.wh < res.maxH));

		return grSet.autoHideGridMetadata && grSet.layout === 'default' && smallRes && !basicMeta.includes(gridColumnKey);
	}

	/**
	 * Gets the codec string, returning 'DCA' if the codec is DTS.
	 * @returns {string} The codec string or 'DCA' if the codec is DTS.
	 */
	getCodecString() {
		const codec = $('$lower($if2(%codec%,$ext(%path%)))');
		if (['dts', 'dca (dts coherent acoustics)'].includes(codec)) {
			return 'DCA'; // Show only DCA abbreviation if codec is DTS
		}
		return codec;
	}

	/**
	 * Gets the channel string based on the provided channel type.
	 * @param {string} channelType - The type of the channel (e.g., 'mono', 'stereo').
	 * @returns {string} The channel string or an empty string if the channel type is not found.
	 */
	getChannelString(channelType) {
		const channelMapping = {
			'mono':   { number: 1,  string: 'Mono' },
			'stereo': { number: 2,  string: 'Stereo' },
			'3ch':    { number: 3,  string: 'Center' },
			'4ch':    { number: 4,  string: 'Quad' },
			'5ch':    { number: 5,  string: 'Surround' },
			'6ch':    { number: 6,  string: 'Surround' },
			'7ch':    { number: 7,  string: 'Surround' },
			'8ch':    { number: 8,  string: 'Surround' },
			'10ch':   { number: 10, string: 'Surround' },
			'12ch':   { number: 12, string: 'Surround' }
		};

		const channel = channelMapping[channelType];
		if (!channel) return '';

		if (grSet.showGridChannelLogo_layout === 'textlogo') {
			return channel.string;
		} else if (grSet.showGridChannelLogo_layout === false) {
			return `${channel.number} \u00B7 ${channel.string}`;
		} else {
			return '';
		}
	}

	/**
	 * Gets the grid tooltip string based on the specified type.
	 * @param {string} type - The type of metadata ('artist', 'title', 'album').
	 * @returns {string} The tooltip string.
	 */
	getGridTooltip(type) {
		const tooltipType = {
			artist: grStr.artist,
			title: `${grStr.tracknum} ${grStr.title} ${grStr.composer}`,
			album: `${grStr.album} ${grStr.composer}`
		};
		return tooltipType[type];
	}

	/**
	 * Handles the grid tooltip. If a tooltip is ready, it displays and then clears it.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleGridTooltip(x, y) {
		const artistTooltipRange = this.mouseInMetadataGrid(x, y, 'artist');
		const titleTooltipRange  = this.mouseInMetadataGrid(x, y, 'title');
		const albumTooltipRange  = this.mouseInMetadataGrid(x, y, 'album');

		if (!artistTooltipRange && !titleTooltipRange && !albumTooltipRange) return;

		const showArtistToolTip = artistTooltipRange && grSet.showGridArtist_layout && (
			this.gridArtistWidth > this.gridContentWidth * 2
			||
			this.gridArtistWrapLinesExceed
		);

		const showTitleToolTip = titleTooltipRange && grSet.showGridTitle_layout && (
			this.gridTitleWidth > this.gridContentWidth * 2
			||
			this.gridTitleWrapLinesExceed
		);

		const showAlbumToolTip = albumTooltipRange && (
			!grSet.showGridArtist_layout && !grSet.showGridTitle_layout && (this.gridAlbumWidth > this.gridContentWidth * 3)
			||
			(grSet.showGridArtist_layout || grSet.showGridTitle_layout) && (this.gridAlbumWidth > this.gridContentWidth * 2)
			||
			this.gridAlbumWrapLinesExceed
		);

		const tooltip =
			showArtistToolTip ? this.getGridTooltip('artist') :
			showTitleToolTip  ? this.getGridTooltip('title') :
			showAlbumToolTip  ? this.getGridTooltip('album') : '';

		if (tooltip.length) { // * Display tooltip
			const offset = SCALE(30);
			this.gridTooltipText = tooltip;
			grm.ttip.showDelayed(this.gridTooltipText);
			grm.ui.repaintStyledTooltips(grm.ui.styledToolTipX - offset * 2, grm.ui.styledToolTipY - offset, grm.ui.styledToolTipW + offset * 4, grm.ui.styledToolTipH + offset * 2);
		} else { // * Clear tooltip
			this.gridTooltipText = '';
			grm.ttip.stop();
			window.Repaint();
		}
	}

	/**
	 * Loads the codec logo of the now playing track, displayed in the metadata grid in Details.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	loadGridCodecLogo(metadb = grm.ui.initMetadb()) {
		let codec = $('$lower($if2(%codec%,$ext(%path%)))', metadb);
		let format = $('$lower($ext(%path%))', metadb);

		// Foobar bug showing wrong metadata when DTS is in wav file format
		if (codec === 'pcm' && (format === 'cue' || format === 'wav')) {
			codec = $('$lower($if2(%codec%,$ext(%path%)))');
			format = $('$lower($ext(%path%))');
		}

		const lightBg = Color.BRT(grCol.detailsText) < 140;
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
			this.gridCodecLogo = gdi.Image(codecLogoPath(codecName));
		}
		// Handle special cases
		if (codec.startsWith('dsd')) {
			this.gridCodecLogo = gdi.Image(codecLogoPath(codecFormat.dsd));
		} else if (codec.startsWith('dxd')) {
			this.gridCodecLogo = gdi.Image(codecLogoPath(codecFormat.dxd));
		} else if (codec.startsWith('dst')) {
			this.gridCodecLogo = gdi.Image(codecLogoPath(codecFormat.dst));
		}
	}

	/**
	 * Loads the channel logo of the now playing track, displayed in the metadata grid in Details.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	loadGridChannelLogo(metadb = grm.ui.initMetadb()) {
		const codec = $('$lower($if2(%codec%,$ext(%path%)))', metadb);
		const format = $('$lower($ext(%path%))', metadb);

		// Foobar bug showing wrong metadata when DTS is in wav file format
		const channels = codec === 'pcm' && (format === 'cue' || format === 'wav') ? $('%channels%') : $('%channels%', metadb);

		const type =
			(grSet.layout === 'default' && grSet.showGridChannelLogo_default === 'textlogo' ||
			 grSet.layout === 'artwork' && grSet.showGridChannelLogo_artwork === 'textlogo') ? '_text' : '';

		const lightBg = Color.BRT(grCol.detailsText) < 140;
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
		if (channelName) this.gridChannelLogo = gdi.Image(channelLogoPath(channelName));
	}

	/**
	 * Loads the release country flags, displayed in the metadata grid in Details.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	loadGridReleaseCountryFlag(metadb = undefined) {
		if (!grSet.showGridReleaseFlags_layout) return;
		this.gridReleaseFlagImg = grm.ui.loadFlagImage($(grTF.releaseCountry, metadb));
	}

	/**
	 * Updates the metadata grid in Details, reuses last value for last played unless provided one.
	 * @param {string} currentLastPlayed - The current value of the "Last Played" metadata field.
	 * @param {string} currentPlayingPlaylist - The current active playlist that is being played from.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 * @returns {Array|null} The updated metadata grid, which is an array of objects with properties `label`, `val` and `age`.
	 */
	updateGrid(currentLastPlayed, currentPlayingPlaylist, metadb = undefined) {
		if (!grCfg.metadataGrid) return null;

		currentLastPlayed = (grStr && grStr.grid ? grStr.grid.find(value => value.label === 'Last Played') || {} : {}).val;
		grStr.grid = [];

		for (const key of grCfg.metadataGrid) {
			let val = $(key.val, metadb);
			if (val && key.label) {
				if (key.age) {
					val = $(`$date(${val})`, metadb); // Never show time
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

	/**
	 * Updates the metadata grid codec and channel logo in Details.
	 * This method is primarily used to refresh the colors of the logos.
	 */
	updateGridLogos() {
		this.clearCache('codecLogo');
		this.clearCache('channelLogo');
	}

	/**
	 * Updates the metadata grid positions in Details.
	 * This method is primarily used to refresh the coordinates for mouseInMetadataGrid.
	 */
	updateGridPos() {
		this.gridTop = 0;
		this.gridArtistTop = 0;
		this.gridArtistBottom = 0;
		this.gridTitleTop = 0;
		this.gridTitleBottom = 0;
		this.gridAlbumTop = 0;
		this.gridAlbumBottom = 0;
	}
	// #endregion

	// * PUBLIC METHODS - METADATA GRID TIMELINE * //
	// #region PUBLIC METHODS - METADATA GRID TIMELINE
	/**
	 * Draws the timeline above the metadata grid in Details.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawGridTimeline(gr) {
		if (!this.timelineAddedCol && !this.timelinePlayedCol && !this.timelineUnplayedCol) return;

		gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing
		gr.FillSolidRect(this.gridMarginLeft, this.timelineY, this.timelineDrawWidth + this.timelineExtraLeftSpace + this.timelineLineWidth, this.timelineH, this.timelineAddedCol);

		if (grSet.theme.startsWith('custom')) {
			gr.DrawRect(this.timelineX - 2, this.timelineY - 2, this.timelineW + 3, this.timelineH + 3, 1, grCol.timelineFrame);
		}

		if (this.timelineFirstPlayedPercent >= 0 && this.timelineLastPlayedPercent >= 0) {
			const x1 = Math.floor(this.timelineDrawWidth * this.timelineFirstPlayedPercent) + this.timelineExtraLeftSpace;
			const x2 = Math.floor(this.timelineDrawWidth * this.timelineLastPlayedPercent)  + this.timelineExtraLeftSpace;
			gr.FillSolidRect(x1 + this.gridMarginLeft, this.timelineY, this.timelineDrawWidth - x1 + this.timelineExtraLeftSpace, this.timelineH, this.timelinePlayedCol);
			gr.FillSolidRect(x2 + this.gridMarginLeft, this.timelineY, this.timelineDrawWidth - x2 + this.timelineExtraLeftSpace + this.timelineLineWidth, this.timelineH, this.timelineUnplayedCol);
		}

		for (let i = 0; i < this.timelinePlayedTimesPercents.length; i++) {
			const x = Math.floor(this.timelineDrawWidth * this.timelinePlayedTimesPercents[i]) + this.gridMarginLeft + this.timelineExtraLeftSpace;
			if (!Number.isNaN(x) && x <= this.timelineW + this.gridMarginLeft * 2) {
				const linePos = Math.max(this.gridMarginLeft, Math.min(x, x));
				gr.DrawLine(linePos, this.timelineY, linePos, this.timelineY + this.timelineH, this.timelineLineWidth, this.timelinePlayCol);
			} else {
				// console.log('Played Times Error! ratio: ' + this.playedTimesPercents[i], 'x: ' + x);
			}
		}

		gr.SetSmoothingMode(SmoothingMode.AntiAlias);
	}

	/**
	 * Handles the grid timeline tooltip. If a tooltip is ready, it displays and then clears it.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleGridTimelineTooltip(x, y) {
		if (!this.mouseInMetadataGrid(x, y, 'timeline') || !grSet.showGridTimeline_layout || this.timelinePlayedTimesPercents.length === 0) {
			return;
		}

		let tooltip = '';
		const percent = ToFixed((x + this.timelineX - this.gridMarginLeft * 2 - this.timelineExtraLeftSpace) / this.timelineDrawWidth, 3);
		const timezoneOffset = UpdateTimezoneOffset();

		for (let i = 0; i < this.timelinePlayedTimesPercents.length; i++) {
			if (Math.abs(percent - this.timelinePlayedTimesPercents[i]) <= this.timelineLeeway) {
				const date = new Date(this.timelinePlayedTimes[i]);
				tooltip += tooltip.length ? '\n' : '';
				tooltip += date.toLocaleString();
			}
			else if (percent < this.timelinePlayedTimesPercents[i]) {
				if (!tooltip.length) {
					const added = i === 0 ? DateDiff($Date('[%added%]'), this.timelinePlayedTimes[0], timezoneOffset) : DateDiff(new Date(this.timelinePlayedTimes[i - 1]).toISOString(), this.timelinePlayedTimes[i], timezoneOffset);
					tooltip = added ? (i === 0 ? `First played after ${added}` : `No plays for ${added}`) : '';
				}
				break;
			}
		}

		if (tooltip.length) {
			this.gridTimelineTooltipText = tooltip;
			grm.ttip.showImmediate(tooltip);
			window.RepaintRect(this.timelineX, this.timelineY, this.timelineW, this.timelineH);
		} else {
			this.gridTimelineTooltipText = '';
			grm.ttip.stop();
			window.Repaint();
		}
	}

	/**
	 * Sets the width and position of the timeline.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} width - The width of the timeline.
	 * @param {number} height - The height of the timeline.
	 */
	setGridTimelineSize(x, y, width, height) {
		if (this.timelineX === x && this.timelineY === y && this.timelineW === width) {
			return;
		}

		this.timelineX = x;
		this.timelineY = y;
		this.timelineW = width;
		this.timelineH = height;

		this.timelineLineWidth = HD_4K(2, 3);
		this.timelineExtraLeftSpace = SCALE(3); // Add a little space to the left so songs that were played a long time ago show more in the "added" stage
		this.timelineDrawWidth = Math.floor(this.timelineW - this.timelineExtraLeftSpace - 1 - this.timelineLineWidth / 2);
		this.timelineLeeway = (1 / this.timelineDrawWidth) * (this.timelineLineWidth + SCALE(2)) / 2;
	}

	/**
	 * Sets the colors of the three timeline bars.
	 * @param {number} addedCol - The color for the added bar.
	 * @param {number} playedCol - The color for the played bar.
	 * @param {number} unplayedCol - The color for the unplayed bar.
	 */
	setGridTimelineColors(addedCol, playedCol, unplayedCol) {
		this.timelineAddedCol = addedCol;
		this.timelinePlayedCol = playedCol;
		this.timelineUnplayedCol = unplayedCol;
	}

	/**
	 * Sets the first and last played percentages, as well as the played time ratios and values.
	 * @param {number} firstPlayed - The percentage of the total play time that represents the first time the item was played.
	 * @param {number} lastPlayed - The percentage of the total play time that represents the last time the item was played.
	 * @param {number} playedTimeRatios - The percentage of time played for each playedTimesValues.
	 * @param {number} playedTimesValues - Contains the actual played times for each interval.
	 * For example, if the intervals are divided into 5 parts, playedTimesValues would be an
	 * array of 5 numbers representing the played times for each interval.
	 */
	setGridTimelinePlayTimes(firstPlayed, lastPlayed, playedTimeRatios, playedTimesValues) {
		this.timelineFirstPlayedPercent = firstPlayed;
		this.timelineLastPlayedPercent = lastPlayed;
		this.timelinePlayedTimesPercents = playedTimeRatios;
		this.timelinePlayedTimes = playedTimesValues;
	}

	/**
	 * Sets date ratios based on various time-related properties of a music track.
	 * @param {boolean} dontUpdateLastPlayed - Whether the last played date should be updated or not.
	 * @param {string} currentLastPlayed - The current value of the last played time.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	setGridTimelineDateRatios(dontUpdateLastPlayed = false, currentLastPlayed, metadb = undefined) {
		const newDate = new Date();
		const timezoneOffset = UpdateTimezoneOffset();

		let ratio;
		let lfmPlayedTimesJsonLast = '';
		let playedTimesJsonLast = '';
		let playedTimesRatios = [];
		let lfmPlayedTimes = [];
		let playedTimes = [];

		let added = ToTime($('$if2(%added_enhanced%,%added%)', metadb), timezoneOffset);
		let lastPlayed = ToTime($('$if2(%last_played_enhanced%,%last_played%)', metadb), timezoneOffset);
		const firstPlayed = ToTime($('$if2(%first_played_enhanced%,%first_played%)', metadb), timezoneOffset);
		const today = DateToYMD(newDate);

		if (dontUpdateLastPlayed && $Date(lastPlayed) === today) {
			lastPlayed = ToTime(currentLastPlayed, timezoneOffset);
		}

		if (Component.EnhancedPlaycount) {
			const playedTimesJson = $('[%played_times_js%]', metadb);
			const lastfmJson = $('[%lastfm_played_times_js%]', metadb);
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
			playedTimesRatios.sort((a, b) => a - b);
			playedTimes.sort((a, b) => a - b);

			this.timelineFirstPlayedRatio = playedTimesRatios[0];
			this.timelineLastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
		}
		else {
			this.timelineFirstPlayedRatio = 0.33;
			this.timelineLastPlayedRatio = 0.66;
		}
		this.setGridTimelinePlayTimes(this.timelineFirstPlayedRatio, this.timelineLastPlayedRatio, playedTimesRatios, playedTimes);
	}

	/**
	 * Updates the timeline by setting the sizes, colors, and last played dates.
	 * @param {boolean} updateLastPlayed - Whether to update the last played date.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	updateGridTimeline(updateLastPlayed, metadb) {
		this.setGridTimelineSize(this.gridMarginLeft, this.gridTop + Math.floor(this.gridLineSpacing * 0.33), grm.ui.albumArtSize.x - this.gridMarginLeft * 2, this.timelineH);
		this.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		if (!updateLastPlayed) return;

		const lastPlayed = $(grTF.last_played, metadb);
		this.setGridTimelineDateRatios($Date(grm.ui.currentLastPlayed) !== $Date(lastPlayed), grm.ui.currentLastPlayed, metadb);

		if (lastPlayed.length) {
			const today = DateToYMD(new Date());
			if (!grm.ui.currentLastPlayed.length || $Date(lastPlayed) !== today) {
				grm.ui.currentLastPlayed = lastPlayed;
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS - DISC ART * //
	// #region PUBLIC METHODS - DISC ART
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
		gr.DrawImage(grm.ui.albumArtScaled, x, y, w, h, 0, 0, w, h, 0, alpha);

		// * Mask
		const maskImg = gdi.CreateImage(w, h);
		let g = maskImg.GetGraphics();
		g.FillEllipse(this.discArtSize.x - grm.ui.albumArtSize.x + this.discArtShadow - SCALE(4), this.discArtSize.y - grm.ui.albumArtSize.y + SCALE(2),
					  this.discArtSize.w - this.discArtShadow + SCALE(4), this.discArtSize.h - this.discArtShadow + SCALE(2), 0xffffffff);
		maskImg.ReleaseGraphics(g);

		// * Album art
		const albumArtImg = gdi.CreateImage(w, h);
		g = albumArtImg.GetGraphics();
		g.DrawImage(grm.ui.albumArtScaled, 0, 0, w, h, 0, 0, grm.ui.albumArtScaled.Width, grm.ui.albumArtScaled.Height);
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
		const { w: discArtW, h: discArtH } = this.discArtSize;
		const lineW = SCALE(25);

		const outerRingX = lineW * 0.5;
		const outerRingY = lineW * 0.5;
		const outerRingW = discArtW - lineW;
		const outerRingH = discArtH - lineW;

		const innerRingSize = discArtH * 0.666 + lineW * 0.5;
		const innerCenterX  = discArtW * 0.5;
		const innerCenterY  = discArtH * 0.5;
		const innerRadiusX  = discArtW * 0.5 - innerRingSize * 0.5;
		const innerRadiusY  = discArtH * 0.5 - innerRingSize * 0.5;

		const innerRingX = innerCenterX - innerRadiusX;
		const innerRingY = innerCenterY - innerRadiusY;
		const innerRingW = innerRadiusX * 2;
		const innerRingH = innerRadiusY * 2;

		const mask = GDI(discArtW, discArtH, true, g => {
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			g.FillSolidRect(0, 0, discArtW, discArtH, RGB(255, 255, 255));
			g.FillEllipse(outerRingX, outerRingY, outerRingW, outerRingH, RGB(0, 0, 0)); // Outer ring
			g.FillEllipse(innerRingX, innerRingY, innerRingW, innerRingH, RGB(255, 255, 255)); // Inner ring
		});

		img.ApplyMask(mask.Resize(w, h));
	}

	/**
	 * Combines disc art with album cover art if conditions are met.
	 * @param {boolean} applyMask - Whether to apply the disc art cover mask or not.
	 * @returns {GdiBitmap} The combined image.
	 */
	combineDiscArtWithCover(applyMask) {
		if (['cdAlbumCover', 'vinylAlbumCover'].includes(grSet.discArtStub) &&
			(!this.discArtFound && (!grSet.noDiscArtStub || grSet.showDiscArtStub)) &&
			this.discArtCover && this.discArtCover.Width && this.discArtCover.Height) {
			if (applyMask) {
				this.createDiscArtCoverMask(this.discArtCover, this.discArtCover.Width, this.discArtCover.Height);
			}
			return CombineImages(this.discArt, this.discArtCover, this.discArtSize.w, this.discArtSize.h);
		}
		return this.discArt;
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
		const fetchDiscArtProfiler = (grm.ui.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay) && fb.CreateProfiler('fetchDiscArt');

		if (grSet.displayDiscArt && !grm.ui.isStreaming) {
			this.loadDiscArt(this.findDiscArtPath());
		}

		if (fetchDiscArtProfiler) fetchDiscArtProfiler.Print();
		if (grCfg.settings.showDebugPerformanceOverlay) grm.ui.debugTimingsArray.push(`fetchDiscArt: ${fetchDiscArtProfiler.Time} ms`);
	}

	/**
	 * Finds the path to the disc art or disc art stub.
	 * @returns {string} The path to the disc art or disc art stub.
	 */
	findDiscArtPath() {
		const discArtImagePaths = grPath.discArtImagePaths();
		const discArtStubPaths = grPath.discArtStubPaths();

		if (grSet.noDiscArtStub || grSet.showDiscArtStub) {
			for (const path of discArtImagePaths) {
				if (IsFile(path)) {
					this.discArtFound = true;
					return path;
				}
			}
		}

		this.discArtFound = false;

		return grSet.noDiscArtStub ? '' : discArtStubPaths[grSet.discArtStub] || grPath.discArtCustomStub;
	}

	/**
	 * Loads the disc art from the given path.
	 * @param {string} discArtPath - The path to the disc art.
	 */
	loadDiscArt(discArtPath) {
		let tempDiscArt;

		if (grm.ui.albumArtFromCache) {
			tempDiscArt = grm.artCache && grm.artCache.getImage(discArtPath);
		}

		if (tempDiscArt) {
			this.disposeDiscArt(this.discArt);
			this.discArt = tempDiscArt;
			this.updateDiscArt();
			return;
		}

		gdi.LoadImageAsyncV2(window.ID, discArtPath).then(discArtImg => {
			this.disposeDiscArt(this.discArt); // Delay disposal so we don't get flashing
			this.discArt = grm.artCache.encache(discArtImg, discArtPath);

			if (!this.discArt && !grSet.noDiscArtStub) {
				grm.ui.handleArtworkError('discArt');
			} else {
				this.updateDiscArt();
			}

			this.clearCache('metrics', 'cachedLabelLastLeftEdge'); // Recalc label location
			RepaintWindow();
		});
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

		this.setDiscArtScaleFactor();
		this.setDiscArtSize(resetDiscArtPosition);
		this.setDiscArtPosition(resetDiscArtPosition);
		this.setDiscArtShadow();
	}

	/**
	 * Set the scale factor for the disc art based on the window size and layout.
	 */
	setDiscArtScaleFactor() {
		const discArtMaxHeight = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;
		const scaleFactor = grm.ui.displayPlaylist || grm.ui.displayLibrary ? 0.5 : 0.75;
		const discScale = Math.min(grm.ui.ww * scaleFactor / this.discArt.Width, (discArtMaxHeight - SCALE(16)) / this.discArt.Height);
		this.discArtScaleFactor = discScale;
	}

	/**
	 * Set the size of the disc art based on its scale, window state, and layout settings.
	 * @param {boolean} resetDiscArtPosition - Whether the position of the disc art should be reset.
	 */
	setDiscArtSize(resetDiscArtPosition) {
		const discArtSizeCorr = SCALE(4);

		const discArtSize =
			grm.ui.hasArtwork ? grm.ui.albumArtSize.h - discArtSizeCorr :
			Math.floor(this.discArt.Width * this.discArtScaleFactor) - discArtSizeCorr;

		if (resetDiscArtPosition) {
			this.discArtSize = { w: discArtSize, h: discArtSize };
		} else {
			this.discArtSize.w = Math.max(this.discArtSize.w, discArtSize);
			this.discArtSize.h = this.discArtSize.w;
		}
	}

	/**
	 * Set the position of the disc art based on the window size and layout settings.
	 * @param {boolean} resetDiscArtPosition - Whether the position of the disc art should be reset.
	 */
	setDiscArtPosition(resetDiscArtPosition) {
		const discArtSizeCorr = SCALE(4);
		const discArtMargin = SCALE(2);
		const discArtMarginRight = SCALE(36);
		const discArtMaxHeight = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;

		if (grm.ui.hasArtwork) {
			const baseX = grm.ui.ww - grm.ui.albumArtSize.h - discArtMarginRight;

			const adjustedX = grm.ui.albumArtSize.x + grm.ui.albumArtSize.w -
				(grm.ui.albumArtSize.h - discArtSizeCorr) * (1 - grSet.discArtDisplayAmount) -
				(grSet.discArtDisplayAmount === 1 || grSet.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight);

			const discArtX = Math.floor(
				grSet.discArtDisplayAmount === 1 ? baseX :
				grSet.discArtDisplayAmount === 0.5 ? Math.min(baseX, adjustedX) :
				adjustedX
			);

			this.discArtSize.x = resetDiscArtPosition ? discArtX : Math.max(this.discArtSize.x, discArtX);
			this.discArtSize.y = resetDiscArtPosition ? (grm.ui.albumArtSize.y + discArtMargin) :
				Math.min(this.discArtSize.y > 0 ? this.discArtSize.y :
				(grm.ui.albumArtSize.y + discArtMargin), grm.ui.albumArtSize.y + discArtMargin);

			if (this.discArtSize.x + this.discArtSize.w > grm.ui.ww) {
				this.discArtSize.x = grm.ui.ww - this.discArtSize.w - discArtMarginRight;
			}

			return;
		}

		// * Set no disc art x-coordinate
		const discArtOffCenter = this.discArtScaleFactor === (grm.ui.ww * 0.75 / this.discArt.Width);

		const discArtCenterX =
			discArtOffCenter ? Math.round(grm.ui.ww * 0.66 - grm.ui.edgeMargin) :
			(grm.ui.displayPlaylist || grm.ui.displayLibrary) ? grm.ui.ww * 0.25 :
			grm.ui.ww * 0.5;

		this.discArtSize.x = Math.floor(discArtCenterX - this.discArtSize.w * 0.5);

		// * Set no disc art y-coordinate
		const restrictedWidth = this.discArtScaleFactor !== (discArtMaxHeight - SCALE(16)) / this.discArt.Height;
		const discArtCenterY = grm.ui.topMenuHeight + Math.floor(((discArtMaxHeight - SCALE(16)) / 2) - this.discArtSize.h / 2);
		this.discArtSize.y = restrictedWidth ? Math.min(discArtCenterY, 160) : grm.ui.topMenuHeight + discArtMargin;

		grm.ui.hasArtwork = true;
	}

	/**
	 * Sets and creates the disc art rotation animation with RotateImg().
	 * @returns {GdiBitmap} The rotated disc art image.
	 */
	setDiscArtRotation() {
		if (!grSet.displayDiscArt || grm.ui.albumArtCorrupt || !grm.ui.albumArt || !this.discArt || this.discArtSize.w <= 0) {
			return null;
		}

		// Drawing discArt rotated is slow, so first draw it rotated into the discArtRotation image, and then draw discArtRotation image unrotated in on_paint.
		let tracknum = parseInt(fb.TitleFormat(`$num($if(${grTF.vinyl_tracknum},$sub($mul(${grTF.vinyl_tracknum},2),1),$if2(%tracknumber%,1)),1)`).Eval()) - 1;
		if (!grSet.rotateDiscArt || Number.isNaN(tracknum)) tracknum = 0;

		const tracknumRotation = tracknum * grSet.rotationAmt;
		const combinedImg = this.combineDiscArtWithCover(true);

		this.discArtRotation = RotateImage(combinedImg, this.discArtSize.w, this.discArtSize.h, tracknumRotation, grm.artCache.discArtImgMaxRes);

		// TODO: Once spinning art is done, scrap this and the rotation amount crap and just use indexes into the discArtArray when needed.
		// ? IDEA: Smooth rotation to new position?
		return this.discArtRotation;
	}

	/**
	 * Sets the disc art timer with different set interval values for rotating the disc art.
	 */
	setDiscArtRotationTimer() {
		this.clearTimer('discArt');

		if (grSet.layout !== 'default' || !grm.ui.displayDetails ||
			grm.ui.albumArtCorrupt || !grm.ui.albumArt || !this.discArt || !this.discArtSize.w ||
			!fb.IsPlaying || fb.IsPaused || !grSet.displayDiscArt || !grSet.spinDiscArt) {
			return;
		}

		DebugLog(`Disc art => Creating ${grSet.spinDiscArtImageCount} rotated disc images, shown every ${grSet.spinDiscArtRedrawInterval}ms`);
		const rotationDegreeIncrement = 360 / grSet.spinDiscArtImageCount;

		this.discArtRotationTimer = setInterval(() => {
			this.discArtRotationIndex = (this.discArtRotationIndex + 1) % grSet.spinDiscArtImageCount;

			if (!this.discArtArray[this.discArtRotationIndex]) {
				const rotationDegrees = rotationDegreeIncrement * this.discArtRotationIndex;
				const combinedImg = this.combineDiscArtWithCover(false);
				this.discArtArray[this.discArtRotationIndex] = RotateImage(combinedImg, this.discArtSize.w, this.discArtSize.h, rotationDegrees, grm.artCache.discArtImgMaxRes);

				DebugLog(`Disc art => creating discArtImg: ${this.discArtRotationIndex} (${this.discArtSize.w}x${this.discArtSize.h}) with rotation: ${rotationDegrees} degrees`);
			}

			const discArtLeftEdge = (
				grSet.detailsAlbumArtOpacity !== 255 || grSet.detailsAlbumArtDiscAreaOpacity !== 255 || grSet.discArtOnTop
			) ? this.discArtSize.x : grm.ui.albumArtSize.x + grm.ui.albumArtSize.w - 1;

			window.RepaintRect(discArtLeftEdge, this.discArtSize.y, this.discArtSize.w - (discArtLeftEdge - this.discArtSize.x), this.discArtSize.h, !grSet.discArtOnTop && !grm.ui.displayLyrics);
		}, grSet.spinDiscArtRedrawInterval);
	}

	/**
	 * Sets the drop shadow for disc art.
	 */
	setDiscArtShadow() {
		if (!this.discArt || !grm.ui.hasArtwork && !grm.ui.noAlbumArtStub ||
			!grm.ui.displayDetails || !grSet.displayDiscArt || grSet.layout === 'compact') {
			return;
		}

		const discArtShadowProfiler = (grm.ui.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay) && fb.CreateProfiler('createDiscArtShadow');
		const discArtMargin = SCALE(2);

		if (grm.ui.albumArtSize.w > 0 || this.discArtSize.w > 0) {
			this.discArtShadowImg = this.discArt ?
				gdi.CreateImage(this.discArtSize.x + this.discArtSize.w + 2 * this.discArtShadow, this.discArtSize.h + discArtMargin + 2 * this.discArtShadow) :
				gdi.CreateImage(grm.ui.albumArtSize.x + grm.ui.albumArtSize.w + 2 * this.discArtShadow, grm.ui.albumArtSize.h + 2 * this.discArtShadow);
			if (grSet.layout === 'default' && this.discArtShadowImg) {
				const shimg = this.discArtShadowImg.GetGraphics();
				if (this.discArt) {
					const offset = this.discArtSize.w * 0.40; // Don't change this value
					const xVal = this.discArtSize.x;
					const shadowOffset = this.discArtShadow * 2;
					shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + discArtMargin, this.discArtSize.w - shadowOffset, this.discArtSize.w - shadowOffset, this.discArtShadow * 2, grCol.discArtShadow); // outer shadow
					shimg.DrawEllipse(xVal + this.discArtShadow + offset, offset + this.discArtShadow + discArtMargin, this.discArtSize.w - offset * 2, this.discArtSize.h - offset * 2, 60, grCol.discArtShadow); // inner shadow
				}
				this.discArtShadowImg.ReleaseGraphics(shimg);
				this.discArtShadowImg.StackBlur(this.discArtShadow);
			}
		}

		if (discArtShadowProfiler) discArtShadowProfiler.Print();
		if (grCfg.settings.showDebugPerformanceOverlay) grm.ui.debugTimingsArray.push(`createDiscArtShadow: ${discArtShadowProfiler.Time} ms`);
	}

	/**
	 * Updates the disc art by resizing artwork, creating rotation, and setting the rotation timer.
	 */
	updateDiscArt() {
		grm.ui.resizeArtwork(true);
		this.setDiscArtRotation();
		if (!grSet.spinDiscArt) return;
		this.discArtArray = []; // Clear last image
		this.setDiscArtRotationTimer();
	}
	// #endregion

	// * PUBLIC METHODS - BAND & LABEL LOGO * //
	// #region PUBLIC METHODS - BAND & LABEL LOGO
	/**
	 * Gets the band logo path if it exists at various paths.
	 * @param {string} bandStr - The name of the band.
	 * @returns {string} The path of the band logo if it exists.
	 */
	getBandLogoPath(bandStr) {
		if (!bandStr) return '';

		const testBandLogoPath = (imgDir, name) => {
			const logoPath = `${imgDir}${name}.png`;
			if (IsFile(logoPath)) {
				DebugLog(`Logo => Found band logo: ${logoPath}`);
				return logoPath;
			}
			return '';
		};

		const bandLogoPath =
			testBandLogoPath(grPath.artistlogos, bandStr) ||    // Try 800x310 white
			testBandLogoPath(grPath.artistlogosColor, bandStr); // Try 800x310 color

		return bandLogoPath || '';
	}

	/**
	 * Gets the band logo and its inverted version based on the current playing album artist in Details.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	getBandLogo(metadb = undefined) {
		this.clearCache('bandLogo');
		let path;

		const albumArtists = GetMetaValues('%album artist%', metadb);
		const trackArtist = ReplaceFileChars($('[%track artist%]', metadb));
		const artists = GetMetaValues('%artist%', metadb);

		const artistList = [
			...albumArtists.flatMap(artist => [
				ReplaceFileChars(artist), ReplaceFileChars(artist).replace(/^[Tt]he /, '')
			]),
			trackArtist,
			...artists.flatMap(artist => [
				ReplaceFileChars(artist), ReplaceFileChars(artist).replace(/^[Tt]he /, '')
			])
		];
		const uniqueArtistList = [...new Set(artistList)];

		for (const artist of uniqueArtistList) {
			path = this.getBandLogoPath(artist);
			if (path) break;
		}

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
		this.clearCache('labelLogo');
		const labelFields = ['label', 'publisher', 'discogs_label'];
		const labels = new Set(labelFields.flatMap(label => GetMetaValues(label, metadb)));

		for (const label of labels) {
			const addLabel = this.loadLabelLogo(label);
			if (addLabel != null) {
				this.labelLogo.push(addLabel);
				try {
					this.labelLogoInverted.push(addLabel.InvertColours());
				} catch (e) {}
			}
		}
	}

	/**
	 * Loads the label logo image for a given record label in Details.
	 * @param {string} publisherString - The name of a record label or publisher.
	 * @returns {GdiBitmap|null} The record label logo as a gdi image object or null if not found.
	 */
	loadLabelLogo(publisherString) {
		const date = new Date();
		const lastSearchYear = date.getFullYear();
		let dir = grPath.labelsBase;
		let labelStr = ReplaceFileChars(publisherString);
		let recordLabel = null;

		if (!labelStr) return recordLabel;

		// * Clean up the label string
		const cleanLabelString = (str) => {
			const cleanedStr = str
				.replace(/ (Records|Recordings|Music)$/, '')
				.replace(/[\u2010\u2013\u2014]/g, '-'); // Hyphen, endash, emdash
			return str.endsWith('.') ? `${cleanedStr}.` : cleanedStr;
		};

		// * Check for label folders by year
		const checkLabelFolders = (label) => {
			const startYear = parseInt($('$year(%date%)'));
			const baseDir = `${dir}${label}\\`;

			for (let year = startYear; year <= lastSearchYear; year++) {
				const yearFolder = `${baseDir}${year}`;
				if (IsFolder(yearFolder)) {
					DebugLog(`Logo => Found folder for ${label} for year ${year}.`);
					return `${yearFolder}\\`;
				}
			}

			DebugLog(`Logo => Found folder for ${label} and using latest logo.`);
			return baseDir;
		};

		// * Check if a folder exists for the initial label string
		const folderExists = (label) => IsFolder(`${dir}${label}`);
		if (folderExists(labelStr)) {
			dir = checkLabelFolders(labelStr);
		} else {
			labelStr = cleanLabelString(labelStr);
			if (folderExists(labelStr)) {
				dir = checkLabelFolders(labelStr);
			}
		}

		// * Reinitialize to original string for file search
		labelStr = ReplaceFileChars(publisherString);

		// * Get the file path for the initial label string
		const searchFile = (label) => `${dir}${label}.png`;
		let label = searchFile(labelStr);

		// * Load the record label image
		if (IsFile(label)) {
			recordLabel = gdi.Image(label);
			DebugLog('Logo => Found Record label:', label, !recordLabel ? '<COULD NOT LOAD>' : '');
		} else {
			labelStr = cleanLabelString(labelStr);
			label = searchFile(labelStr);
			if (IsFile(label)) {
				recordLabel = gdi.Image(label);
			} else {
				label = searchFile(`${labelStr} Records`);
				if (IsFile(label)) {
					recordLabel = gdi.Image(label);
				}
			}
		}

		return recordLabel;
	}
	// #endregion

	// * PUBLIC METHODS - CALLBACKS * //
	// #region PUBLIC METHODS - CALLBACKS
	/**
	 * Checks if the mouse is within the boundaries of the metadata grid in Details.
	 * @global
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} boundary - The boundary to check ('artist', 'title', 'album', 'tagKey', 'tagValue', 'timeline', 'grid').
	 * @returns {boolean} True or false.
	 */
	mouseInMetadataGrid(x, y, boundary) {
		return this.gridSectionBounds[boundary] ? this.gridSectionBounds[boundary](x, y) : false;
	}

	/**
	 * Handles the tooltip when the mouse is in the metadata grid tooltip area.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		if (grSet.showTooltipMain || grSet.showTooltipTruncated) {
			this.handleGridTooltip(x, y);
		}
		if (grSet.showTooltipTimeline) {
			this.handleGridTimelineTooltip(x, y);
		}
	}
	// #endregion
}
