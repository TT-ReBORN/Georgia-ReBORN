/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Main                                 * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-09-01                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////////////////
// * MAIN USER INTERFACE PARTS * //
///////////////////////////////////
/**
 * Draws the Main and Details background.
 * @param {GdiGraphics} gr
 */
function drawBackgrounds(gr) {
	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	gr.SetSmoothingMode(SmoothingMode.None);

	// * MAIN BACKGROUND * //
	if (!albumArt && noArtwork) { // We use noArtwork to prevent flashing of blue default theme
		initNoAlbumArtSize();

		if (!themeColorSet) {
			setThemeColors();
			themeColorSet = true;
		}
	}
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// * DETAILS BACKGROUND * //
	if (fb.IsPlaying && (albumArt || !discArt || !albumArt && discArt) && ((!displayLibrary && !displayPlaylist) || !settings.hidePanelBgWhenCollapsed)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumArtSize.y, albumArtSize.x, albumArtSize.h,
			!pref.albumArtColoredGap && (((displayPlaylist || displayLibrary) && pref.layout === 'default') ||
			((!displayPlaylist && !displayLibrary) && pref.layout === 'artwork')) ? g_pl_colors.bg : col.detailsBg);

		// Show full background when no disc art
		if (pref.noDiscArtBg && albumArt && (!discArt || !pref.displayDiscArt) && (!displayPlaylist && !displayLibrary && !displayBiography) ||
			pref.theme === 'reborn' && pref.styleBlend2 && (pref.styleRebornWhite || pref.styleRebornBlack) || pref.layout === 'artwork') {
			gr.FillSolidRect(albumArtSize.x + albumArtSize.w - SCALE(1), albumArtSize.y, albumArtSize.x + SCALE(2), albumArtSize.h, col.detailsBg);
		}
		if ((isStreaming && noArtwork || !albumArt && noArtwork)) {
			gr.FillSolidRect(0, geo.topMenuHeight, ww, wh - geo.topMenuHeight - geo.lowerBarHeight, col.detailsBg);
		}
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}
}


/**
 * Draws the Playlist, Library and Biography panels.
 * @param {GdiGraphics} gr
 */
function drawPanels(gr) {
	if (pref.layout === 'default' || pref.layout === 'artwork') {
		if (displayLibrary) {
			const drawLibraryProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> library') : null;
			libraryPanel.on_paint(gr);
			drawLibraryProfiler && drawLibraryProfiler.Print();
		}
		if (pref.layout === 'default' && displayPlaylist || pref.layout === 'artwork' && displayPlaylistArtwork || displayLibrarySplit()) {
			const drawPlaylistProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> playlist') : null;
			playlist.on_paint(gr);
			timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
		}
		if (displayBiography) {
			const drawBiographyProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> biography') : null;
			biographyPanel.on_paint(gr);
			drawBiographyProfiler && drawBiographyProfiler.Print();
		}
	}
	else if (pref.layout === 'compact' && displayPlaylist) {
		const drawPlaylistProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> playlist') : null;
		playlist.on_paint(gr);
		timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
	}
}


/**
 * Draws the big album art on the left side.
 * @param {GdiGraphics} gr
 */
function drawAlbumArt(gr) {
	const displayAlbumArt =
		pref.layout === 'default' && (pref.playlistLayout !== 'full' && displayPlaylist && !displayBiography
		|| pref.libraryLayout === 'normal' && displayLibrary || pref.displayLyrics)
		|| !displayPlaylist && !displayPlaylistArtwork && !displayLibrary && !displayBiography;

	const displayDetails = (pref.layout === 'artwork' ? !displayPlaylistArtwork : !displayPlaylist) && !displayLibrary && !displayBiography;

	if (!fb.IsPlaying || !displayAlbumArt || displayLibrarySplit()) return;

	const drawArt = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> artwork') : null;

	// * BIG ALBUM ART - NEEDS TO BE DRAWN AFTER ALL BLENDING IS DONE, I.E AFTER PLAYLIST * //
	if (!noAlbumArtStub) {
		if (discArt && !discArtRotation && !displayPlaylist && !displayLibrary && pref.displayDiscArt) {
			createDiscArtRotation();
		}
		if (albumArt && (albumArtScaled || discArtRotation) && !displayBiography && !displayPlaylistArtwork &&
			(discArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary)) {
			shadowImg && gr.DrawImage(shadowImg, -geo.discArtShadow, albumArtSize.y - geo.discArtShadow, shadowImg.Width, shadowImg.Height, 0, 0, shadowImg.Width, shadowImg.Height);
			// gr.DrawRect(-geo.discArtShadow, albumArtSize.y - geo.discArtShadow, shadowImg.Width, shadowImg.Height, 1, RGBA(0,0,255,125)); // Viewing border line
		}
		if (albumArt && albumArtScaled) {
			if (!pref.discArtOnTop || pref.displayLyrics) {
				if (discArtRotation && !displayPlaylist && !displayLibrary) {
					drawDiscArt(gr);
				}
				if (discArtRotation && !displayPlaylist && !displayLibrary && pref.detailsAlbumArtDiscAreaOpacity !== 255) { // Do not use opacity if image is a booklet, i.e albumArtSize.w > ww * 0.66
					createDiscArtAlbumArtMask(gr, albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h, 0, 0, albumArtScaled.Width, albumArtScaled.Height, 0, displayDetails && albumArtSize.w < ww * 0.66 ? pref.detailsAlbumArtDiscAreaOpacity : 255);
				} else {
					gr.DrawImage(albumArtScaled, albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h, 0, 0, albumArtScaled.Width, albumArtScaled.Height, 0, displayDetails && albumArtSize.w < ww * 0.66 ? pref.detailsAlbumArtOpacity : 255);
				}
			} else { // Draw discArt on top of front cover
				gr.DrawImage(albumArtScaled, albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h, 0, 0, albumArtScaled.Width, albumArtScaled.Height);
				if (discArtRotation && !displayPlaylist && !displayLibrary) {
					drawDiscArt(gr);
				}
			}
		}
		else if (discArtRotation && pref.displayDiscArt && !displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics) {
			drawDiscArt(gr); // Disc art, but no album art
		}
	}

	if (timings.showExtraDrawTiming) drawArt.Print();
}


/**
 * Draws the no album art stub when no album cover exists.
 * @param {GdiGraphics} gr
 */
function drawNoAlbumArt(gr) {
	const noAlbumArtLayoutDefault =
		pref.layout === 'default' && !displayLibrarySplit() && (displayPlaylist && pref.playlistLayout !== 'full' && !displayBiography || displayLibrary && pref.libraryLayout === 'normal');

	const noAlbumArtLayoutArtwork =
		pref.layout === 'artwork' && !displayPlaylist && !displayPlaylistArtwork && !displayLibrary && !displayBiography;

	if (!albumArt && noArtwork && fb.IsPlaying) {
		if (noAlbumArtLayoutDefault || noAlbumArtLayoutArtwork) {
			// * Clear previous artwork related stuff
			noAlbumArtStub = true;
			albumArt = null;
			discArt = null;
			discArtCover = null;
			discArtArray = [];
			discArtArrayCover = [];

			const noAlbumArtSize = wh - geo.topMenuHeight - geo.lowerBarHeight;

			const bgWidth =
				pref.lyricsLayout === 'full' && pref.displayLyrics || pref.layout === 'artwork' ? ww :
				pref.panelWidthAuto ? noAlbumArtSize :
				ww * 0.5;

			const bgHeight = noAlbumArtSize;

			const noteWidth =
				pref.layout === 'artwork' ? ww :
				pref.panelWidthAuto ? noAlbumArtSize :
				ww * 0.5;

			const noteHeight = noAlbumArtSize + ft.no_album_art_stub.Height * 0.5 - SCALE(14);

			// * Stub background
			gr.FillSolidRect(0, geo.topMenuHeight, albumArtSize.x, bgHeight, !pref.albumArtColoredGap ? g_pl_colors.bg : col.bg);
			gr.FillSolidRect(albumArtSize.x, geo.topMenuHeight, bgWidth, bgHeight, g_pl_colors.bg);
			if (!pref.displayLyrics) {
				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
				gr.DrawString('\uf001', ft.no_album_art_stub, col.noAlbumArtStub, albumArtSize.x, 0, noteWidth, noteHeight, StringFormat(1, 1));
			}
		}
	}
	else if (pref.panelWidthAuto && !fb.IsPlaying) {
		noAlbumArtStub = true; // * Needed on_playback_stop when noAlbumArtStub was playing to reposition all panels correctly
	}
	else {
		noAlbumArtStub = false;
	}
}


/**
 * Draws the disc art in Details.
 * @param {GdiGraphics} gr
 */
function drawDiscArt(gr) {
	if (pref.layout === 'default' && pref.displayDiscArt && discArtSize.y >= albumArtSize.y && discArtSize.h <= albumArtSize.h) {
		const drawDiscProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('discArt') : null;
		const discArtImg = discArtArray[discArtRotationIndex] || discArtRotation;
		gr.DrawImage(discArtImg, discArtSize.x, discArtSize.y, discArtSize.w, discArtSize.h, 0, 0, discArtImg.Width, discArtImg.Height, 0);

		if (['cdAlbumCover', 'vinylAlbumCover'].includes(pref.discArtStub) && discArtCover && !discArtFound && (!pref.noDiscArtStub || pref.showDiscArtStub)) {
			const discArtImgCover = discArtArrayCover[discArtRotationIndexCover] || discArtRotationCover;
			gr.DrawImage(discArtImgCover, discArtSize.x, discArtSize.y, discArtSize.w, discArtSize.h, 0, 0, discArtImg.Width, discArtImg.Height, 0);
		}

		if (timings.showExtraDrawTiming) drawDiscProfiler.Print();
	}

	// Show full background when displaying the Lyrics panel and lyrics layout is in full width
	if (pref.displayLyrics && pref.lyricsLayout === 'full' && pref.layout === 'default' && !displayLibrary && !displayPlaylist && !displayBiography) {
		gr.FillSolidRect(albumArtSize.x + albumArtSize.w - SCALE(1), albumArtSize.y, albumArtSize.x + SCALE(2), albumArtSize.h, col.detailsBg);
	}
}


/**
 * Draws the Hi-Res Audio logo on album art.
 * @param {GdiGraphics} gr
 */
function drawHiResAudioLogo(gr) {
	const trackIsHiRes =
		(Number($('$info(bitspersample)', fb.GetNowPlaying())) > 16 || Number($('$info(bitrate)', fb.GetNowPlaying())) > 1411);

	const displayHiResAudioLogo =
		trackIsHiRes && pref.showHiResAudioBadge && pref.layout !== 'compact' &&
		(displayPlaylist && !displayPlaylistArtwork && !displayLibrarySplit() && !displayBiography && (pref.playlistLayout === 'normal' || pref.displayLyrics) ||
		!displayPlaylist && !displayPlaylistArtwork && !displayLibrary && !displayBiography ||
		displayLibrary && pref.libraryLayout === 'normal' && pref.layout === 'default');

	if (!displayHiResAudioLogo) return;

	const logoPath = `${fb.ProfilePath}georgia-reborn\\images\\misc\\`;
	const plus4k = RES_4K ? '4K-' : '';
	const plusRound = pref.hiResAudioBadgeRound ? '-round' : '';

	if      (pref.hiResAudioBadgeSize === 'small')  paths.hiResAudioImage = `${logoPath}${plus4k}hi-res-audio-small${plusRound}.png`;
	else if (pref.hiResAudioBadgeSize === 'normal') paths.hiResAudioImage = `${logoPath}${plus4k}hi-res-audio-normal${plusRound}.png`;
	else if (pref.hiResAudioBadgeSize === 'large')  paths.hiResAudioImage = `${logoPath}${plus4k}hi-res-audio-large${plusRound}.png`;

	hiResAudioImg = gdi.Image(paths.hiResAudioImage);

	const x =
		pref.hiResAudioBadgePos === 'topleft' ? albumArtSize.x + SCALE(20) :
		pref.hiResAudioBadgePos === 'topright' ? albumArtSize.x + albumArtSize.w - hiResAudioImg.Width - SCALE(20) :
		pref.hiResAudioBadgePos === 'bottomleft' ? albumArtSize.x + SCALE(40) :
		pref.hiResAudioBadgePos === 'bottomright' ? albumArtSize.x + albumArtSize.w - hiResAudioImg.Width - SCALE(40) : '';

	const y =
		pref.hiResAudioBadgePos === 'topleft' || pref.hiResAudioBadgePos === 'topright' ? albumArtSize.y + SCALE(20) :
		albumArtSize.y + albumArtSize.h - hiResAudioImg.Height - SCALE(40);

	gr.DrawImage(hiResAudioImg, x, y, hiResAudioImg.Width, hiResAudioImg.Height, 0, 0, hiResAudioImg.Width, hiResAudioImg.Height);
}


/**
 * Draws the pause button centered on album art.
 * @param {GdiGraphics} gr
 */
function drawPauseBtn(gr) {
	if (pref.showPause && fb.IsPaused && (!presetIndicatorTimer || !doubleClicked)
		&&
		(pref.layout === 'default' && (displayPlaylist && pref.playlistLayout !== 'full' && !displayLibrary && !displayBiography ||
		displayLibrary && pref.libraryLayout === 'normal' && !displayPlaylist || !displayPlaylist && !displayLibrary && !displayBiography)
		||
		pref.layout === 'artwork' && !displayPlaylist && !displayPlaylistArtwork && !displayLibrary && !displayBiography)) {
		pauseBtn.draw(gr);
	}
}


/**
 * Draws the jump search on the right centered side.
 * @param {GdiGraphics} gr
 */
function drawJumpSearch(gr) {
	jumpSearch.setY(Math.round(wh * 0.5 - geo.topMenuHeight - geo.lowerBarHeight));
	jumpSearch.draw(gr);
}


/**
 * Draws the metadata grid on the left side in the Details panel.
 * @param {GdiGraphics} gr
 */
function drawDetailsMetadataGrid(gr) {
	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	const displayDetails = (pref.layout === 'artwork' ? !displayPlaylistArtwork && displayPlaylist : !displayPlaylist) && !displayLibrary && !displayBiography;
	if (!displayDetails || pref.lyricsLayout === 'full' && pref.displayLyrics) return;

	const drawTextGrid = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> textGrid') : null;

	const marginLeft = SCALE(pref.layout !== 'default' ? 20 : 40);
	const marginRight = SCALE(20);
	let gridSpace = 0;
	gridTop = albumArtSize.y ? albumArtSize.y + marginLeft : geo.topMenuHeight + marginLeft;
	gridSpace = Math.round((!albumArt && discArt ? discArtSize.x : albumArtSize.x) - geo.discArtShadow - marginLeft - marginRight);
	const textWidth = gridSpace;

	const gridArtistFontSize   = pref[`gridArtistFontSize_${pref.layout}`];
	const showGridArtist       = pref[`showGridArtist_${pref.layout}`];
	const showGridTrackNum     = pref[`showGridTrackNum_${pref.layout}`];
	const showGridTitle        = pref[`showGridTitle_${pref.layout}`];
	const showGridTimeline     = pref[`showGridTimeline_${pref.layout}`];
	const showGridArtistFlags  = pref[`showGridArtistFlags_${pref.layout}`];
	const showGridReleaseFlags = pref[`showGridReleaseFlags_${pref.layout}`];
	const showGridCodecLogo    = pref[`showGridCodecLogo_${pref.layout}`];

	// * DETAILS METADATA GRID * //
	if (gridSpace > 150) {
		/** @type {MeasureStringInfo} */
		let txtRec;
		let gridArtistTxtRec;
		let gridTitleTxtRec;
		let gridAlbumTxtRec;

		const drawArtist = (top) => {
			if (!str.artist) return 0;

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
					flagImgs.length >=  6 ? 0 :
					flagImgs.length === 5 ? 1 :
					flagImgs.length === 4 ? 2 :
					flagImgs.length === 3 ? 3 :
					flagImgs.length === 2 ? 4 :
					5
				]
			);

			const flagSize =
				flagImgs.length >=  6 ? SCALE(84 + gridArtistFontSize * 6) :
				flagImgs.length === 5 ? SCALE(70 + gridArtistFontSize * 5) :
				flagImgs.length === 4 ? SCALE(56 + gridArtistFontSize * 4) :
				flagImgs.length === 3 ? SCALE(42 + gridArtistFontSize * 3) :
				flagImgs.length === 2 ? SCALE(28 + gridArtistFontSize * 2) :
				flagImgs.length === 1 ? SCALE(14 + gridArtistFontSize) : '';

			gridArtistTxtRec = gr.MeasureString(str.artist, ft.grd_artist, 0, 0, showGridArtistFlags && flagImgs.length ? textWidth - flagSize : textWidth, wh);
			const gridArtistNumLines  = Math.min(2, gridArtistTxtRec.Lines);
			const gridArtistNumHeight = gr.CalcTextHeight(str.artist, ft.grd_artist) * gridArtistNumLines + 3;
			const gridArtistHeight    = gr.CalcTextHeight(str.artist, ft.grd_artist);

			// * Apply better anti-aliasing on smaller font sizes in HD res
			gr.SetTextRenderingHint(!RES_4K && gridArtistFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
			gr.DrawString(showGridArtistFlags && flagImgs.length ? flagSizeWhiteSpace + str.artist : str.artist, ft.grd_artist, ['white', 'black', 'reborn', 'random'].includes(pref.theme) ? col.detailsText : pref.theme === 'cream' ? g_pl_colors.header_artist_normal : g_pl_colors.header_artist_playing, marginLeft, Math.round(top), textWidth, gridArtistNumHeight, g_string_format.trim_ellipsis_char);

			// * Artist flags
			if (str.artist && flagImgs.length && showGridArtistFlags && displayDetails) {
				let flagsLeft = marginLeft;
				for (let i = 0; i < flagImgs.length; i++) {
					gr.DrawImage(flagImgs[i], flagsLeft, Math.round(top - (flagImgs[i].Height / (gridArtistHeight + SCALE(2))) - (RES_4K ? 1 : 0)), flagImgs[i].Width + SCALE(gridArtistFontSize) - SCALE(26), gridArtistHeight + SCALE(2), 0, 0, flagImgs[i].Width, flagImgs[i].Height);
					flagsLeft += flagImgs[i].Width - SCALE(18) + SCALE(gridArtistFontSize);
					// Maximum 6 flags
					if (i > 4) break;
				}
			}

			return gridArtistNumHeight + (RES_4K ? 17 : 9);
		}

		gridTop -= SCALE(2);

		const drawTitle = (top) => {
			if (!str.title) return 0;
			gridTitleTxtRec = gr.MeasureString(isStreaming ? showGridTrackNum ? str.tracknum + str.title : str.title : str.tracknum === '' ? str.title : showGridTrackNum ? `${str.tracknum}\xa0${str.title}` : str.title, ft.grd_title, 0, 0, textWidth, wh);
			const gridTitleNumLines = Math.min(2, gridTitleTxtRec.Lines);
			const gridTitleNumHeight = gr.CalcTextHeight(str.title, ft.grd_title) * gridTitleNumLines + 3;
			const gridTitleFontSize = pref[`gridTitleFontSize_${pref.layout}`];

			// * Apply better anti-aliasing on smaller font sizes in HD res
			gr.SetTextRenderingHint(!RES_4K && gridTitleFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
			gr.DrawString(isStreaming ? showGridTrackNum ? str.tracknum + str.title : str.title : str.tracknum === '' ? str.title : showGridTrackNum ? `${str.tracknum}\xa0${str.title}` : str.title, ft.grd_title, col.detailsText, marginLeft, Math.round(top), textWidth, gridTitleNumHeight, g_string_format.trim_ellipsis_char);

			return gridTitleNumHeight + (RES_4K ? 17 : 9);
		}

		gridTop -= SCALE(2);

		const drawAlbumTitle = (top, maxLines) => {
			if (!str.album) return 0;
			gridAlbumTxtRec = gr.MeasureString(str.album, ft.grd_album, 0, 0, textWidth, wh);
			const gridAlbumNumLines = Math.min(showGridArtist || showGridTitle ? 2 : 3, gridAlbumTxtRec.Lines);
			const gridAlbumNumHeight = gr.CalcTextHeight(str.album, ft.grd_album) * gridAlbumNumLines + 3;
			const gridAlbumFontSize = pref[`gridAlbumFontSize_${pref.layout}`];

			// * Apply better anti-aliasing on smaller font sizes in HD res
			gr.SetTextRenderingHint(!RES_4K && gridAlbumFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
			gr.DrawString(str.album, ft.grd_album, col.detailsText, marginLeft, Math.round(top), textWidth, gridAlbumNumHeight, g_string_format.trim_ellipsis_char);

			return gridAlbumNumHeight + SCALE(13);
		}

		if (showGridArtist) {
			gridTop += drawArtist(gridTop);
		}
		if (showGridTitle) {
			gridTop += drawTitle(gridTop);
		} else if (!showGridArtist) {
			gridTop += drawAlbumTitle(gridTop, 3);
		}
		// * Timeline
		if (showGridTimeline && str.timeline && fb.IsPlaying) {
			str.timeline.setSize(marginLeft, gridTop + SCALE(4), albumArtSize.x - marginLeft * 2);
			str.timeline.draw(gr);
		}
		// * Tooltip
		if (str.metadata_grid_tt && fb.IsPlaying) {
			str.metadata_grid_tt.setSize(marginLeft, geo.topMenuHeight, albumArtSize.x - marginLeft * 2);
			str.metadata_grid_tt.draw(gr);
		}
		if (showGridTimeline) {
			gridTop += geo.timelineHeight + SCALE(20);
		}
		if (showGridArtist || showGridTitle) {
			gridTop += drawAlbumTitle(gridTop, 2);
		}

		// * Tags
		const font_array = [ft.grd_key];
		const key_font_array = [ft.grd_val];
		let grid_key_ft = ft.grd_key;
		str.grid.forEach((el) => {
			if (font_array.length > 1) { // Only check if there's more than one entry in font_array
				grid_key_ft = ChooseFontForWidth(gr, textWidth / 3, el, font_array);
				while (grid_key_ft !== font_array[0]) { // If font returned was first item in the array, then everything fits, otherwise pare down array
					font_array.shift();
					key_font_array.shift();
				}
			}
		});
		const grid_val_ft = key_font_array.shift();
		const col1Width = CalcGridMaxTextWidth(gr, str.grid, grid_key_ft);
		const columnMargin = SCALE(10);
		const col2Width = textWidth - columnMargin - col1Width + SCALE(5);
		const col2Left = marginLeft + col1Width + columnMargin;

		for (let k = 0; k < str.grid.length; k++) {
			const key = str.grid[k].label;
			let value = str.grid[k].val;
			let showLastFmImage = false;
			let showReleaseFlagImage = false;
			let showGridCodecLogoImage = false;
			let dropShadow = false;
			let grid_val_col = col.detailsText;

			if (value.length) {
				switch (key) {
					case 'Rating':
						grid_val_col = col.detailsRating;
						dropShadow = true;
						break;
					case 'Hotness':
						grid_val_col = col.detailsHotness;
						dropShadow = true;
						break;
					case 'Play Count':
						showLastFmImage = true;
						break;
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
					default:
						break;
				}
				txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2Width, wh);
				if (gridTop + txtRec.Height < albumArtSize.y + albumArtSize.h) {
					const borderWidth = SCALE(0.5);
					const cellHeight = txtRec.Height + 5;
					const keyFontSize = pref[`gridKeyFontSize_${pref.layout}`];
					const valFontSize = pref[`gridValueFontSize_${pref.layout}`] + SCALE(1);
					const showReleaseFlagOnly = pref[`showGridReleaseFlags_${pref.layout}`] === 'logo';
					const showCodecLogoOnly = pref[`showGridCodecLogo_${pref.layout}`] === 'logo';
					const flag = showReleaseFlagOnly && key === 'Rel. Country';
					const codec = showCodecLogoOnly && key === 'Codec';
					const ratingLinux = detectWine && key === 'Rating';

					// * Apply better anti-aliasing on smaller font sizes in HD res
					gr.SetTextRenderingHint(!RES_4K && (keyFontSize < 17 || valFontSize < 18) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

					if (dropShadow) {
						gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left + borderWidth), Math.round(gridTop + borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
						gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left - borderWidth), Math.round(gridTop + borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
						gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left + borderWidth), Math.round(gridTop - borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
						gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left - borderWidth), Math.round(gridTop - borderWidth), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));
					}
					gr.DrawString(key, grid_key_ft, col.detailsText, marginLeft, Math.round(gridTop), col1Width, cellHeight, g_string_format.trim_ellipsis_char);
					gr.DrawString(flag || codec ? '' : value, grid_val_ft, grid_val_col, col2Left, Math.round(gridTop), col2Width + (ratingLinux ? SCALE(20) : 0), cellHeight, StringFormat(0, 0, 4));

					// * Last.fm logo
					if (playCountVerifiedByLastFm && showLastFmImage) {
						const lastFmImg = gdi.Image(paths.lastFmImageRed);
						const lastFmWhiteImg = gdi.Image(paths.lastFmImageWhite);
						const lastFmLogo = ColorDistance(col.primary, RGB(185, 0, 0), false) < 133 ? lastFmWhiteImg : lastFmImg;
						const heightRatio = (cellHeight - 12) / lastFmLogo.Height;
						if (txtRec.Width + SCALE(12) + Math.round(lastFmLogo.Width * heightRatio) < col2Width) {
							gr.DrawImage(lastFmLogo, col2Left + txtRec.Width + SCALE(12), gridTop + 3,
								Math.round(lastFmLogo.Width * heightRatio), cellHeight - 12, 0, 0, lastFmLogo.Width, lastFmLogo.Height);
						}
					}
					// * Release flags
					if (showReleaseFlagImage && releaseFlagImg) {
						const sizeCorr = txtRec.Lines === 4 ? 4 : txtRec.Lines === 3 ? 3 : txtRec.Lines === 2 ? 2 : 1;
						const yCorr = txtRec.Lines === 4 ? cellHeight / 4 : txtRec.Lines === 3 ? cellHeight / 3 : 0;
						const heightRatio = (cellHeight) / releaseFlagImg.Height;
						if ((!showReleaseFlagOnly ? txtRec.Width + SCALE(8) : 0) + Math.round(releaseFlagImg.Width * heightRatio) < col2Width) {
							gr.DrawImage(releaseFlagImg, showReleaseFlagOnly && key === 'Rel. Country' ? col2Left : col2Left + txtRec.Width + SCALE(8), gridTop - 3 + yCorr,
								Math.round(releaseFlagImg.Width * heightRatio / sizeCorr), cellHeight / sizeCorr, 0, 0, releaseFlagImg.Width, releaseFlagImg.Height);
						}
					}
					// * Codec logo
					if (showGridCodecLogoImage) {
						loadCodecLogo();
						const heightRatio = codecLogo != null ? (cellHeight - 4) / codecLogo.Height : '';
						if (codecLogo != null && (!showCodecLogoOnly ? txtRec.Width + SCALE(8) : 0) + Math.round(codecLogo.Width * heightRatio) < col2Width) {
							gr.DrawImage(codecLogo, showCodecLogoOnly && key === 'Codec' ? col2Left : col2Left + txtRec.Width + SCALE(8), gridTop - 1,
								Math.round(codecLogo.Width * heightRatio), cellHeight - 4, 0, 0, codecLogo.Width, codecLogo.Height);
						}
					}
					gridTop += cellHeight + 5;
				}
			}
		}
	}
	if (timings.showExtraDrawTiming) drawTextGrid.Print();
}


/**
 * Draws the band logo on the bottom left side in the Details panel.
 * @param {GdiGraphics} gr
 */
function drawDetailsBandLogo(gr) {
	const displayDetails = pref.layout === 'default' && !displayPlaylist && !displayLibrary && !displayBiography;
	if (!fb.IsPlaying || !albumArt || !displayDetails) return;

	const drawLogos = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> logos') : null;
	const availableSpace = albumArtSize.y + albumArtSize.h - gridTop;
	const lightBg = new Color(col.detailsText).brightness < 140;
	const logo = lightBg || noAlbumArtStub ? (invertedBandLogo || bandLogo) : bandLogo;

	if (logo && availableSpace > 75) {
		// Max width we'll draw is 1/2 the full size because the HQ images are just so big
		let logoWidth = Math.min(RES_4K ? logo.Width : logo.Width / 2, albumArtSize.x - ww * 0.05);
		let heightScale = logoWidth / logo.Width; // Width is fixed to logoWidth, so scale height accordingly
		if (logo.Height * heightScale > availableSpace) {
			// TODO: could probably do this calc just once, but the logic is complicated
			heightScale = availableSpace / logo.Height;
			logoWidth = logo.Width * heightScale;
		}
		let logoTop = Math.round(albumArtSize.y + albumArtSize.h - (heightScale * logo.Height)) - 4;
		if (RES_4K) {
			logoTop -= 20;
		}
		gr.DrawImage(logo, Math.round(isStreaming ? SCALE(40) : albumArtSize.x / 2 - logoWidth / 2), logoTop, Math.round(logoWidth), Math.round(logo.Height * heightScale), 0, 0, logo.Width, logo.Height, 0);
	}

	if (timings.showExtraDrawTiming) drawLogos.Print();
}


/**
 * Draws the label logo on the bottom right side in the Details panel.
 * @param {GdiGraphics} gr
 */
function drawDetailsLabelLogo(gr) {
	const displayDetails = pref.layout === 'default' && !displayPlaylist && !displayLibrary && !displayBiography;
	const drawLogos = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> labels') : null;
	if (!fb.IsPlaying || !albumArt || !displayDetails) return;

	if (recordLabels.length > 0) {
		const lightBg = pref.labelArtOnBg ? new Color(col.bg).brightness > 140 : new Color(col.detailsText).brightness < 140;
		const labels = lightBg || noAlbumArtStub ? (recordLabelsInverted.length ? recordLabelsInverted : recordLabels) : recordLabels;
		const rightSideGap = 20; // How close last label is to right edge
		const leftEdgeGap = (artOffCenter ? 20 : 40) * (RES_4K ? 1.8 : 1); // Space between art and label
		const leftEdgeWidth = RES_4K ? 45 : 30; // How far label background extends on left
		const maxLabelWidth = SCALE(200);
		let leftEdge = 0;
		let topEdge = 0;
		let totalLabelWidth = 0;
		let labelAreaWidth = 0;
		let labelSpacing = 0;
		let labelWidth;
		let labelHeight;
		// const drawLabelTime = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> record labels') : null;

		for (let i = 0; i < labels.length; i++) {
			if (labels[i].Width > maxLabelWidth) {
				totalLabelWidth += maxLabelWidth;
			} else {
				totalLabelWidth += RES_4K && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
			}
		}
		if (!lastLeftEdge) { // We don't want to recalculate this every screen refresh
			DebugLog('recalculating lastLeftEdge');
			labelShadowImg = null;
			labelWidth = Math.round(totalLabelWidth / labels.length);
			labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // Might be recalc'd below
			if (albumArt) {
				if (discArt && pref.displayDiscArt) {
					leftEdge = Math.round(Math.max(albumArtSize.x + albumArtScaled.Width + 5, ww * 0.975 - totalLabelWidth + 1));
					const discCenter = {};
					discCenter.x = Math.round(discArtSize.x + discArtSize.w / 2);
					discCenter.y = Math.round(discArtSize.y + discArtSize.h / 2);
					const radius = discCenter.y - discArtSize.y;

					while (true) {
						const allLabelsWidth = Math.max(Math.min(Math.round((ww - leftEdge - rightSideGap) / labels.length), maxLabelWidth), 50);
						//console.log("leftEdge = " + leftEdge + ", ww-leftEdge-10 = " + (ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
						const maxWidth = RES_4K && labels[0].Width < 200 ? labels[0].Width * 2 : labels[0].Width;
						labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
						labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // Width is based on height scale
						topEdge = Math.round(albumArtSize.y + albumArtSize.h - labelHeight);

						const a = topEdge - discCenter.y + 1; // Adding 1 to a and b so that the border just touches the edge of the discArt
						const b = leftEdge - discCenter.x + 1;

						if ((a * a + b * b) > radius * radius) {
							break;
						}
						leftEdge += 4;
					}
				} else {
					leftEdge = Math.round(Math.max(albumArtSize.x + albumArtSize.w + leftEdgeWidth + leftEdgeGap, ww * 0.975 - totalLabelWidth + 1));
				}
			} else {
				leftEdge = Math.round(ww * 0.975 - totalLabelWidth);
			}
			labelAreaWidth = ww - leftEdge - rightSideGap;
			lastLeftEdge = leftEdge;
			lastLabelHeight = labelHeight;
		}
		else { // Already calculated
			leftEdge = lastLeftEdge;
			labelHeight = lastLabelHeight;
			labelAreaWidth = ww - leftEdge - rightSideGap;
		}
		if (labelAreaWidth >= SCALE(50)) {
			if (labels.length > 1) {
				labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // Spacing should be proportional, and between 3 and 12 pixels
			}
			// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
			const allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
			const origLabelHeight = labelHeight;
			let labelX = leftEdge;
			topEdge = albumArtSize.y + albumArtSize.h - labelHeight - 20;

			if (!pref.labelArtOnBg && !pref.noDiscArtBg || pref.noDiscArtBg && pref.displayDiscArt && discArt) {
				if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme)) {
					if (!labelShadowImg) {
						labelShadowImg = ShadowRect(geo.discArtShadow, geo.discArtShadow, ww - labelX + leftEdgeWidth, labelHeight + 40, geo.discArtShadow, col.shadow);
					}
					gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.discArtShadow, topEdge - 20 - geo.discArtShadow, ww - labelX + leftEdgeWidth + 2 * geo.discArtShadow, labelHeight + 40 + 2 * geo.discArtShadow,
						0, 0, labelShadowImg.Width, labelShadowImg.Height);
				}
				gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing
				gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40, col.detailsBg);
				gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, col.shadow);
				gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
			}
			for (let i = 0; i < labels.length; i++) {
				// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
				const maxWidth = RES_4K && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
				labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
				labelHeight = Math.round(labels[i].Height * labelWidth / labels[i].Width); // Width is based on height scale

				gr.DrawImage(labels[i], labelX, Math.round(topEdge + origLabelHeight / 2 - labelHeight / 2), labelWidth, labelHeight, 0, 0, recordLabels[i].Width, recordLabels[i].Height);
				// gr.DrawRect(labelX, topEdge, labelWidth, labelHeight, 1, RGB(255,0,0));	// Shows bounding rect of record labels
				labelX += labelWidth + labelSpacing;
			}
			labelHeight = origLabelHeight; // Restore
		}
		// if (timings.showExtraDrawTiming) drawLabelTime.Print();
	}
	if (timings.showExtraDrawTiming) drawLogos.Print();
}


/**
 * Draws the lyrics on the album art in the Lyrics panel.
 * @param {GdiGraphics} gr
 */
function drawLyrics(gr) {
	if (!pref.displayLyrics || !fb.IsPlaying) return;

	const fullW = pref.layout === 'default' && pref.lyricsLayout === 'full' && pref.displayLyrics && noAlbumArtStub || pref.layout === 'artwork';

	gr.SetSmoothingMode(SmoothingMode.None);
	gr.FillSolidRect(fullW ? 0 : albumArtSize.x, fullW ? geo.topMenuHeight : albumArtSize.y,
		fullW ? ww : albumArtSize.w, fullW ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h,
		pref.lyricsAlbumArt ? RGBA(0, 0, 0, 170) : g_pl_colors.bg);

	if (lyrics) lyrics.drawLyrics(gr);
}


/**
 * Draws the activated styles from Options > Styles.
 * @param {GdiGraphics} gr
 */
function drawStyles(gr) {
	if (pref.styleBevel) {
		gr.SetSmoothingMode(SmoothingMode.None);
		if ((pref.layout === 'default' && (displayPlaylist || displayLibrary) && !displayBiography ||
			 pref.layout === 'artwork' && (!displayPlaylistArtwork && !displayLibrary && !displayBiography)) && fb.IsPlaying) {
			// Fill gap when album art or player size is not proportional
			gr.FillSolidRect(-1, geo.topMenuHeight, pref.layout === 'default' ? ww * 0.5 + 1 : ww + 1, (displayLibrary && pref.libraryLayout === 'full' ? 0 : albumArtSize.y) - geo.topMenuHeight - 1, RGBtoRGBA(col.styleBevel, 40));
		}
		if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) && !pref.styleBlackAndWhite2 && !pref.styleRebornBlack) {
			const customThemes = pref.theme.startsWith('custom');
			gr.FillGradRect(-1, 0, ww + 1, geo.topMenuHeight, 90, 0, RGBtoRGBA(col.styleBevel, customThemes ? 255 : 40)); // Top
			gr.FillGradRect(-1, wh - geo.lowerBarHeight - 1, ww + 1, geo.lowerBarHeight + 1, -88, RGBtoRGBA(col.styleBevel, customThemes ? 255 : 80), 0); // Bottom
		} else {
			gr.FillGradRect(-1, 0, ww + 1, geo.topMenuHeight, 90, pref.styleBlackReborn ? 0 : RGBtoRGBA(col.styleBevel, 200), pref.styleBlackReborn ? RGBtoRGBA(col.styleBevel, 200) : 0);
			gr.FillGradRect(-1, wh - geo.lowerBarHeight - 1, ww + 1, geo.lowerBarHeight + 1, -90, RGBtoRGBA(col.styleBevel, 255), 0);
		}
	}
	if (pref.styleBlend2 && albumArt && blendedImg) {
		gr.DrawImage(blendedImg, -1, 0, ww + 1, wh, 0, -wh + geo.topMenuHeight - 1, blendedImg.Width, blendedImg.Height, 180);
		gr.DrawImage(blendedImg, 0, wh - geo.lowerBarHeight, ww, wh, 0, wh * 0.5, blendedImg.Width, blendedImg.Height);
	}
	if (pref.styleGradient || pref.styleGradient2) {
		gr.FillGradRect(-0.5, 0, ww, geo.topMenuHeight, pref.styleGradient2 ? -200 : pref.styleRebornBlack ? -180 : 0, pref.styleGradient2 || pref.styleRebornBlack ? 0 : col.styleGradient, pref.styleGradient2 || pref.styleRebornBlack ? col.styleGradient2 : 0, 0.5);
		gr.FillGradRect(-0.5, wh - geo.lowerBarHeight, ww, geo.lowerBarHeight, pref.styleGradient2 ? -200 : pref.styleRebornBlack ? -180 : 0, pref.styleGradient2 || pref.styleRebornBlack ? 0 : col.styleGradient, pref.styleGradient2 || pref.styleRebornBlack ? col.styleGradient2 : 0, 0.5);
	}
	if ((pref.styleAlternative || pref.styleAlternative2) && (['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme))) {
		gr.FillGradRect(0, 0, ww, geo.topMenuHeight, pref.styleAlternative2 ? -87 : -87, col.styleAlternative, 0);
		gr.FillGradRect(0, wh - geo.lowerBarHeight, ww, geo.lowerBarHeight, pref.styleAlternative2 ? 87 : -87, 0, col.styleAlternative);
	}
}


/**
 * Draws the theme preset indicator as a popup when using theme presets or styles.
 * @param {GdiGraphics} gr
 */
function drawThemePresetIndicator(gr) {
	if (themePresetName === '' || !pref.presetIndicator || !themePresetIndicator || !['off', 'dblclick'].includes(pref.presetAutoRandomMode)) {
		return;
	}

	const match = themePresetMatchMode;
	const text  = 'Active styles matching:';
	const text2 = themePresetName;
	const arc   = SCALE(6);
	const boxH  = gr.CalcTextHeight(text, ft.notification) * (match ? 2.5 : 0) + gr.CalcTextHeight(text2, ft.notification) * 2 + arc;
	const w     = Math.max(gr.CalcTextWidth(text, ft.notification) + 50, gr.CalcTextWidth(text2, ft.notification) + 50);
	const h     = gr.CalcTextHeight(text, ft.notification);

	const fullW =
		pref.layout === 'default'
		&&
		displayPlaylist && pref.playlistLayout === 'full'
		||
		displayLibrary && pref.libraryLayout  === 'full'
		||
		displayBiography && pref.biographyLayout === 'full'
		||
		pref.displayLyrics && pref.lyricsLayout === 'full';

	const cover = fb.IsPlaying && albumArt && pref.layout !== 'compact' && !fullW;
	const noCoverDefault = pref.layout === 'default' && !fullW && !pref.panelWidthAuto;

	const x = Math.round((cover ? albumArtSize.x + albumArtSize.w * 0.5 : noCoverDefault ? ww * 0.25 : ww * 0.5) - w * 0.5);
	const y = Math.round((cover ? albumArtSize.h * 0.5 : wh * 0.5 - geo.lowerBarHeight * 0.5) - (match ? h : -h * 0.5));

	gr.SetSmoothingMode(SmoothingMode.AntiAlias);
	gr.FillRoundRect(x, y, w, boxH, arc, arc, col.popupBg);
	gr.DrawRoundRect(x, y, w, boxH, arc, arc, SCALE(2), 0x64000000);
	gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
	if (match) gr.DrawString(text, ft.notification, col.popupText, x, y + h, w, h, StringFormat(1, 1, 4));
	gr.DrawString(text2, ft.notification, col.popupText, x, y + h * (match ? 2.5 : 0.66), w, h, StringFormat(1, 1, 4));
}


/**
 * Draws the theme debug overlay in the album art area when "Enable theme debug overlay" is activated in dev tools.
 * @param {GdiGraphics} gr
 */
function drawThemeDebugOverlay(gr) {
	if (!settings.showThemeLogOverlay) return;

	const fullW = pref.layout === 'default' && pref.lyricsLayout === 'full' && pref.displayLyrics && noAlbumArtStub || pref.layout === 'artwork';
	const titleWidth = albumArtSize.w - SCALE(80);
	const titleHeight = gr.CalcTextHeight(' ', ft.popup);
	const lineSpacing = titleHeight * 1.5;
	const logColor = RGB(255, 255, 255);
	const x = albumArtSize.x + SCALE(pref.layout !== 'default' ? 20 : 40);
	let y = albumArtSize.y;

	const createBlock = (obj) => Object.keys(obj).find(key => obj[key]) || '';

	const tsBlock1 = createBlock({
		'Bevel,': pref.styleBevel
	});

	const tsBlock2 = createBlock({
		'Blend,': pref.styleBlend,
		'Blend 2,': pref.styleBlend2,
		'Gradient,': pref.styleGradient,
		'Gradient 2,': pref.styleGradient2
	});

	const tsBlock3 = createBlock({
		'Alternative ': pref.styleAlternative,
		'Alternative 2': pref.styleAlternative2,
		'Black and white': pref.styleBlackAndWhite,
		'Black and white 2': pref.styleBlackAndWhite2,
		'Black and white reborn': pref.styleBlackAndWhiteReborn,
		'Black reborn': pref.styleBlackReborn,
		'Reborn white': pref.styleRebornWhite,
		'Reborn black': pref.styleRebornBlack,
		'Reborn fusion': pref.styleRebornFusion,
		'Reborn fusion 2': pref.styleRebornFusion2,
		'Reborn fusion accent': pref.styleRebornFusionAccent,
		'Random pastel': pref.styleRandomPastel,
		'Random dark': pref.styleRandomDark
	});

	const tsTopMenuButtons = pref.styleTopMenuButtons !== 'default' ? CapitalizeString(`${pref.styleTopMenuButtons}`) : '';
	const tsTransportButtons = pref.styleTransportButtons !== 'default' ? CapitalizeString(`${pref.styleTransportButtons}`) : '';
	const tsProgressBar1 = pref.styleProgressBarDesign === 'rounded' ? 'Rounded,' : '';
	const tsProgressBar2 = pref.styleProgressBar !== 'default' ? `Bg: ${CapitalizeString(`${pref.styleProgressBar},`)}` : '';
	const tsProgressBar3 = pref.styleProgressBarFill !== 'default' ? `Fill: ${CapitalizeString(`${pref.styleProgressBarFill}`)}` : '';
	const tsVolumeBar1 = pref.styleVolumeBarDesign === 'rounded' ? 'Rounded,' : '';
	const tsVolumeBar2 = pref.styleVolumeBar !== 'default' ? `Bg: ${CapitalizeString(`${pref.styleVolumeBar},`)}` : '';
	const tsVolumeBar3 = pref.styleVolumeBarFill !== 'default' ? `Fill: ${CapitalizeString(`${pref.styleVolumeBarFill}`)}` : '';

	const propertiesLog = [
		{ prop: selectedPrimaryColor, log: `Primary color: ${selectedPrimaryColor}` },
		{ prop: selectedPrimaryColor2, log: `Primary 2 color: ${selectedPrimaryColor2}` },
		{ prop: colBrightness, log: `Primary color brightness: ${colBrightness}` },
		{ prop: colBrightness2, log: `Primary 2 color brightness: ${colBrightness2}` },
		{ prop: imgBrightness, log: `Image brightness: ${imgBrightness}` },
		{ prop: pref.styleBlend || pref.styleBlend2, log: `Image blur: ${blendedImgBlur}` },
		{ prop: pref.styleBlend || pref.styleBlend2, log: `Image alpha: ${blendedImgAlpha}` },
		{ prop: pref.preset, log: `Theme preset: ${pref.preset}` },
		{ prop: pref.themeBrightness !== 'default', log: `Theme brightness: ${pref.themeBrightness}%` },
		{ prop: tsBlock1 || tsBlock2 || tsBlock3, log: `Styles: ${tsBlock1} ${tsBlock2} ${tsBlock3}` },
		{ prop: tsTopMenuButtons, log: `Top menu button style: ${tsTopMenuButtons}` },
		{ prop: tsTransportButtons, log: `Transport button style: ${tsTransportButtons}` },
		{ prop: tsProgressBar1 || tsProgressBar2 || tsProgressBar3, log: tsProgressBar1 || tsProgressBar2 || tsProgressBar3 ? `Progressbar styles: ${tsProgressBar1} ${tsProgressBar2} ${tsProgressBar3}` : '' },
		{ prop: tsVolumeBar1 || tsVolumeBar2 || tsVolumeBar3, log: `Volumebar styles: ${tsVolumeBar1} ${tsVolumeBar2} ${tsVolumeBar3}` }
	];

	gr.SetSmoothingMode(SmoothingMode.None);
	gr.FillSolidRect(fullW ? 0 : albumArtSize.x, fullW ? geo.topMenuHeight : albumArtSize.y, fullW ? ww : albumArtSize.w, fullW ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h, RGBA(0, 0, 0, 180));
	gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

	const drawString = (str) => {
		y += lineSpacing;
		gr.DrawString(str, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	};

	propertiesLog.forEach(({ prop, log }) => {
		if (prop) drawString(log);
		if (prop === imgBrightness) y += lineSpacing;
	});
}


/**
 * Draws all the shadows for album art and panels.
 * @param {GdiGraphics} gr
 */
function drawPanelShadows(gr) {
	// * SHADOWS FOR ALBUM ART, noAlbumArtStub AND DETAILS * //
	const layoutDefault = pref.layout === 'default' &&
		(!displayPlaylist && !displayLibrary && !displayBiography ||
		!displayBiography && (pref.playlistLayout !== 'full' && displayPlaylist || pref.libraryLayout === 'normal' && displayLibrary));

	const layoutArtwork = pref.layout === 'artwork' && !displayPlaylistArtwork && !displayLibrary && !displayBiography;

	const displayAlbumArtDetailsShadows = fb.IsPlaying &&
		(albumArt && albumArtScaled || noAlbumArtStub) && !displayLibrarySplit() && (layoutDefault || layoutArtwork);

	const displayDetails = (!discArt || !pref.displayDiscArt) &&
		(pref.layout === 'artwork' ? !displayPlaylistArtwork : !displayPlaylist) && !displayLibrary && !displayBiography;

	const noDefaultLayout = pref.layout !== 'default';

	if (displayAlbumArtDetailsShadows) {
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);

		// Top shadow
		gr.FillGradRect(0, ppt.albumArtShow && pref.libraryLayout === 'full' && displayLibrary ? ui.y - (RES_4K ? 10 : 6) : albumArtSize.y - (RES_4K ? 10 : 6),
			displayDetails && pref.noDiscArtBg || noDefaultLayout ? ww : albumArtSize.x + albumArtSize.w, RES_4K ? 10 : 6, 90, 0, col.shadow);

		if (displayDetails && !pref.noDiscArtBg && !noAlbumArtStub) {
			// Middle shadow
			gr.FillGradRect(noAlbumArtStub ? ww * 0.5 - 4 : albumArtSize.x + albumArtSize.w, noAlbumArtStub ? geo.topMenuHeight : albumArtSize.y - 3,
				4, noAlbumArtStub ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h + 5, 0.5,
				noAlbumArtStub ? 0 : pref.styleBlackAndWhite ? RGB(0, 0, 0) : col.shadow, noAlbumArtStub ? pref.styleBlackAndWhite ? RGB(0, 0, 0) : col.shadow : 0);
		}
		// Bottom shadow
		gr.FillGradRect(0, ppt.albumArtShow && pref.libraryLayout === 'full' && displayLibrary ? ui.y + ui.h + (RES_4K ? 0 : -1) : albumArtSize.y + albumArtSize.h + (RES_4K ? 0 : -1),
			displayDetails && pref.noDiscArtBg || noDefaultLayout ? ww : albumArtSize.x + albumArtSize.w, SCALE(5), 90, col.shadow, 0);
	}

	// * SHADOWS FOR ALL PANELS * //
	const panelLayoutNormal = pref.layout === 'default' &&
		(pref.playlistLayout  === 'normal' && displayPlaylist && !displayBiography ||
		 pref.libraryLayout   === 'normal' && displayLibrary   ||
		 pref.biographyLayout === 'normal' && displayBiography ||
		 displayLibrarySplit());

	const displayPanelShadows =
		pref.layout !== 'artwork' && displayPlaylist || displayPlaylistArtwork || displayLibrary || displayBiography || displayCustomThemeMenu && !fb.IsPlaying;

	if (displayPanelShadows) {
		const x =
			displayLibrarySplit() || displayBiography || displayCustomThemeMenu && !fb.IsPlaying || pref.layout !== 'default' || !panelLayoutNormal ? 0 :
			pref.panelWidthAuto ? albumArtSize.x + albumArtSize.w : ww * 0.5;

		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);

		// Top shadow
		gr.FillGradRect(x, geo.topMenuHeight - (RES_4K ? 10 : 6), ww, RES_4K ? 10 : 6, 90, 0, col.shadow);

		if (panelLayoutNormal && playlist.x !== 0) {
			// Middle shadow for playlist
			gr.FillGradRect(pref.panelWidthAuto ? displayLibrarySplit() ? wh - geo.topMenuHeight - geo.lowerBarHeight - 4 : albumArtSize.x + albumArtSize.w - 4 : ww * 0.5 - 4, geo.topMenuHeight, 4, wh - geo.topMenuHeight - geo.lowerBarHeight, 0.5, 0,
				pref.styleBlackAndWhite && noAlbumArtStub ? RGB(0, 0, 0) : pref.styleBlackAndWhite2 || pref.styleRebornBlack ? RGBA(0, 0, 0, 30) : col.shadow);
			// Middle shadow for album art
			if (albumArt && albumArtSize.w !== ww * 0.5 && !displayLibrarySplit() && !displayBiography && !noAlbumArtStub) {
				gr.FillGradRect(albumArtSize.x + albumArtSize.w - 2, albumArtSize.y, 4, albumArtSize.h, 0.5, pref.styleBlackAndWhite ? RGB(0, 0, 0) : col.shadow, 0);
			}
		}
		// Bottom shadow
		gr.FillGradRect(x, wh - geo.lowerBarHeight + (RES_4K ? 0 : -1), ww, SCALE(5), 90, col.shadow, 0);
	}
}


/**
 * Draws the top menu bar.
 * @param {GdiGraphics} gr
 */
function drawTopMenuBar(gr) {
	const drawTopMenuBar = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> top menu bar') : null;

	for (const i in btns) { // Can't replace for..in until non-numeric indexes are removed
		const btn = btns[i];
		const { x, y, w, h, img } = btn;

		if ((i === 'back' || i === 'forward') && !displayPlaylist) {
			continue;
		}

		const disabled = btn.isEnabled ? !btn.isEnabled() : false;

		if (img) {
			const alpha = disabled ? 140 : 255;
			gr.DrawImage(img[0], x, y, w, h, 0, 0, w, h, 0, alpha); // Normal
			if (!disabled) {
				btn.hoverAlpha && gr.DrawImage(img[1], x, y, w, h, 0, 0, w, h, 0, btn.hoverAlpha);
				btn.downAlpha && gr.DrawImage(img[2], x, y, w, h, 0, 0, w, h, 0, btn.downAlpha);
				btn.enabled && img[3] && gr.DrawImage(img[3], x, y, w, h, 0, 0, w, h, 0, 255);
			}
		}
	}

	timings.showExtraDrawTiming && drawTopMenuBar.Print();
}


/**
 * Draws the lower bar.
 * @param {GdiGraphics} gr
 */
function drawLowerBar(gr) {
	const drawLowerBarProfiler     = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> lower bar') : null;
	const lowerBarTop              = wh - geo.lowerBarHeight + (pref.layout === 'default' ? (RES_4K ? 65 : 35) : (RES_4K ? 33 : 18));
	const lowerMargin              = SCALE(pref.layout === 'compact' || pref.layout === 'artwork' ? 80 : pref.showTransportControls_default ? 80 : 120);
	const lowerBarFontSize         = pref[`lowerBarFontSize_${pref.layout}`];
	const showLowerBarArtist       = pref[`showLowerBarArtist_${pref.layout}`];
	const showLowerBarTrackNum     = pref[`showLowerBarTrackNum_${pref.layout}`];
	const showLowerBarTitle        = pref[`showLowerBarTitle_${pref.layout}`];
	const showLowerBarComposer     = pref[`showLowerBarComposer_${pref.layout}`];
	const showLowerBarArtistFlags  = pref[`showLowerBarArtistFlags_${pref.layout}`];
	const showLowerBarPlaybackTime = pref[`showPlaybackTime_${pref.layout}`];
	const showProgressBar          = pref[`showProgressBar_${pref.layout}`];
	const showWaveformBar          = pref[`showWaveformBar_${pref.layout}`];
	const showPeakmeterBar         = pref[`showPeakmeterBar_${pref.layout}`];

	const flagSize =
	flagImgs.length >=  6 ? SCALE(84 + lowerBarFontSize * 6) :
	flagImgs.length === 5 ? SCALE(70 + lowerBarFontSize * 5) :
	flagImgs.length === 4 ? SCALE(56 + lowerBarFontSize * 4) :
	flagImgs.length === 3 ? SCALE(42 + lowerBarFontSize * 3) :
	flagImgs.length === 2 ? SCALE(28 + lowerBarFontSize * 2) :
	flagImgs.length === 1 ? SCALE(14 + lowerBarFontSize) : '';
	const availableFlags = showLowerBarArtistFlags && flagImgs.length ? flagSize : 0;

	// * Calculate all transport buttons width
	const showPlaybackOrderBtn = pref[`showPlaybackOrderBtn_${pref.layout}`];
	const showReloadBtn        = pref[`showReloadBtn_${pref.layout}`];
	const showVolumeBtn        = pref[`showVolumeBtn_${pref.layout}`];
	const transportBtnSize     = pref[`transportButtonSize_${pref.layout}`];
	const transportBtnSpacing  = pref[`transportButtonSpacing_${pref.layout}`];
	const buttonSize           = SCALE(transportBtnSize);
	const buttonSpacing        = SCALE(transportBtnSpacing);
	const buttonCount          = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

	// * Setup time area width
	const timeAreaWidth = ww > 400 ? str.disc !== '' && pref.layout === 'default' ? gr.CalcTextWidth(`${str.disc}   ${str.time}   ${str.length}`, ft.lower_bar_title) : gr.CalcTextWidth(` ${str.time}   ${str.length}`, ft.lower_bar_title) : 0;

	// * Setup width for artist and song title
	const playbackTime   = pref[`showPlaybackTime_${pref.layout}`];
	const availableWidth = pref.layout === 'default' && pref.showTransportControls_default && (pref.showLowerBarArtist_default || pref.showLowerBarTitle_default) ?
		Math.round(ww * 0.5 - lowerMargin - availableFlags - ((buttonSize * buttonCount + buttonSpacing * buttonCount) / 2)) : Math.round(ww - lowerMargin - availableFlags - (playbackTime ? timeAreaWidth : 0));

	// * Measure width and height for artist, orig artist and song title
	const artistWidth       = gr.MeasureString(str.artist, ft.lower_bar_artist, 0, 0, 0, 0).Width;
	const artistHeight      = gr.CalcTextHeight(str.artist, ft.lower_bar_artist);
	const trackNumWidth     = Math.ceil(gr.MeasureString(str.tracknum === '' ? '00.' : str.tracknum, ft.lower_bar_title, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(showLowerBarComposer ? str.title_lower + str.composer : str.title_lower, ft.lower_bar_title, 0, 0, 0, 0);
	const titleWidth        = trackNumWidth + gr.MeasureString(showLowerBarComposer ? str.title_lower + str.composer : str.title_lower, ft.lower_bar_title, 0, 0, 0, 0).Width;
	const titleHeight       = gr.CalcTextHeight(str.title_lower, ft.lower_bar_title);
	const artistTitleWidth  = gr.MeasureString(str.artist, ft.lower_bar_artist, 0, 0, 0, 0).Width + trackNumWidth + gr.MeasureString(showLowerBarComposer ? str.title_lower + str.composer : str.title_lower, ft.lower_bar_title, 0, 0, 0, 0).Width + gr.MeasureString(str.original_artist, ft.lower_bar_title, 0, 0, 0, 0).Width;
	const oneLine           = artistTitleWidth < availableWidth || !showLowerBarTitle;
	const twoLines          = artistTitleWidth > availableWidth && showLowerBarTitle;
	const lineCorrection    = SCALE(pref.customThemeFonts ? RES_4K ? 0 : 4 : RES_4K ? 0 : 2);

	// * Adjustments
	const flagWidth          = showLowerBarArtistFlags && flagImgs.length && str.tracknum < 100 ? SCALE(14) + SCALE(lowerBarFontSize) : trackNumWidth + SCALE(6);
	const heightAdjustment   = pref.customThemeFonts ? 0 : ((lowerBarFontSize === 12 || lowerBarFontSize === 14) && !RES_4K || (lowerBarFontSize === 16 || lowerBarFontSize === 18 || lowerBarFontSize === 20 || lowerBarFontSize === 22) && RES_4K) ? 1 : 0;
	const trackNumAdjustment = gr.MeasureString('\u2013', ft.lower_bar_title, 0, 0, 0, 0).Width;
	const titleAdjustment    = gr.MeasureString(pref.customThemeFonts ? '\u2013.' : 'M', ft.lower_bar_title, 0, 0, 0, 0).Width;
	const titleAdjustment2   = gr.MeasureString('-', ft.lower_bar_title, 0, 0, 0, 0).Width;

	// * Setup artist, track number and title
	const artist = showLowerBarArtist ? str.artist : '';
	const artistX =	twoLines ? progressBar.x + availableFlags :	Math.round(progressBar.x + availableFlags - (pref.layout === 'default' ? SCALE(1) : 0));

	const artistY =	twoLines ? Math.round(lowerBarTop - lineCorrection - artistHeight + (pref.customThemeFonts ? artistHeight * 0.125 : 0) + (lowerBarFontSize < 18 ? SCALE(-2) : lowerBarFontSize > 18 ? SCALE(RES_QHD ? 1 : 3) : 0)) :
		Math.round(lowerBarTop - lineCorrection);

	const trackNum = twoLines ? showLowerBarTrackNum && showLowerBarTitle || !showLowerBarTitle && !fb.IsPlaying ? str.tracknum : '' :
		showLowerBarTrackNum && showLowerBarTitle || (!showLowerBarTrackNum || !showLowerBarTitle) && !fb.IsPlaying ? str.tracknum === '' ? '-' : str.tracknum :
		!showLowerBarTrackNum && showLowerBarArtist && fb.IsPlaying ? '-' : '';

	const trackNumX = twoLines ? progressBar.x :
		showLowerBarArtist && fb.IsPlaying ? Math.floor(progressBar.x + availableFlags + artistWidth + (!showLowerBarTrackNum || str.tracknum === '' ? titleAdjustment2 * 0.5 : trackNumAdjustment)) : progressBar.x;

	const trackNumY = Math.round(lowerBarTop - lineCorrection - heightAdjustment);

	const title = twoLines ? showLowerBarTitle || !showLowerBarTitle && !fb.IsPlaying ? showLowerBarComposer && fb.IsPlaying ? str.title_lower + str.original_artist + str.composer : str.title_lower : '' :
		showLowerBarTitle || !showLowerBarTitle && !fb.IsPlaying ? showLowerBarComposer && fb.IsPlaying ? str.title_lower + str.composer : str.title_lower : '';

	const titleX = twoLines ? !showLowerBarTrackNum || str.tracknum === '' ? progressBar.x : Math.round(progressBar.x + flagWidth) :
		// When not playing or stopped
		!fb.IsPlaying ? Math.round(progressBar.x + trackNumWidth) :
		// Artist and no track number displayed
		showLowerBarArtist ? !showLowerBarTrackNum || str.tracknum === '' ? Math.floor(progressBar.x + availableFlags + artistWidth + titleAdjustment) :
		// Artist with track number displayed
		Math.round(progressBar.x + availableFlags + artistWidth + trackNumWidth + titleAdjustment) :
		// No artist and no track number displayed
		!showLowerBarTrackNum || str.tracknum === '' ? progressBar.x :
		// No artist with track number displayed
		Math.round(progressBar.x + trackNumWidth + titleAdjustment2);

	const titleY = trackNumY;

	// * Apply better anti-aliasing on smaller font sizes in HD res
	gr.SetTextRenderingHint(!RES_4K && lowerBarFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

	// * Artist, tracknum, title
	if (oneLine || twoLines && pref.layout === 'default') gr.DrawString(artist, ft.lower_bar_artist, col.lowerBarArtist, artistX, artistY, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
	gr.DrawString(trackNum, ft.lower_bar_title, col.lowerBarTitle, trackNumX, trackNumY, trackNumWidth - timeAreaWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
	gr.DrawString(title, ft.lower_bar_title, col.lowerBarTitle, titleX, titleY, fb.IsPlaying ? availableWidth + (twoLines ? availableFlags : 0) : ww, titleHeight, g_string_format.trim_ellipsis_char);

	// * Artist flags
	if (showLowerBarArtist && showLowerBarArtistFlags && (pref.layout === 'default' || pref.layout !== 'default' && !twoLines)) {
		const marginLeft = SCALE(pref.layout !== 'default' ? 20 : 40);
		let flagsLeft = marginLeft - (RES_4K ? 1 : 0);
		for (let i = 0; i < flagImgs.length; i++) {
			gr.DrawImage(flagImgs[i], flagsLeft, Math.round(artistY - (flagImgs[i].Height / (artistHeight + SCALE(2))) - (RES_4K ? 1 : 0)), flagImgs[i].Width + SCALE(lowerBarFontSize) - SCALE(26), artistHeight + SCALE(2), 0, 0, flagImgs[i].Width, flagImgs[i].Height);
			flagsLeft += flagImgs[i].Width - SCALE(18) + SCALE(lowerBarFontSize);
			if (i > 4) break; // Maximum 6 flags
		}
	}

	// * Playback time, length, disc number
	if (ww > 400) {
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		let width = gr.CalcTextWidth(`  ${str.length}`, ft.lower_bar_length);
		const lowerBarVersionW = gr.CalcTextWidth(`  ${str.time}`, ft.lower_bar_length);
		const lowerBarVersionH = Math.ceil(titleMeasurements.Height);
		const lowerBarVersionX = ww - SCALE(pref.layout !== 'default' ? 20 : 40) - lowerBarVersionW;
		const lowerBarVersionY = Math.round(lowerBarTop - lineCorrection - heightAdjustment);
		const lowerBarLengthX = ww - SCALE(pref.layout !== 'default' ? 20 : 40) - width;
		const lowerBarLengthY = lowerBarVersionY;
		const lowerBarLengthW = width;
		const lowerBarLengthH = lowerBarVersionH;
		lowerBarTimeX = ww - SCALE(pref.layout !== 'default' ? 20 : 40) - (isStreaming ? width : width * 2);
		lowerBarTimeY = Math.round(lowerBarTop - lineCorrection);
		lowerBarTimeW = lowerBarLengthW;
		lowerBarTimeH = lowerBarVersionH;
		const lowerBarDiscW = gr.CalcTextWidth(`  ${str.disc}`, ft.lower_bar_disc);
		const lowerBarDiscH = lowerBarVersionH;
		const lowerBarDiscY = lowerBarVersionY;
		const lowerBarDiscX = lowerBarTimeX - lowerBarDiscW;

		if (showLowerBarPlaybackTime && fb.PlaybackLength > 0) { // * Playing track
			gr.DrawString(str.length, ft.lower_bar_length, col.lowerBarLength, lowerBarLengthX, lowerBarLengthY, lowerBarLengthW, lowerBarLengthH, StringFormat(2, 0));
			gr.DrawString(str.time, ft.lower_bar_time, col.lowerBarTime, lowerBarTimeX, lowerBarTimeY, lowerBarTimeW, lowerBarTimeH, StringFormat(2, 0));
			width += gr.CalcTextWidth(`  ${str.time}`, ft.lower_bar_time);
			gr.DrawString(pref.layout !== 'default' ? '' : str.disc, ft.lower_bar_disc, col.lowerBarTitle, lowerBarDiscX, lowerBarDiscY, lowerBarDiscW, lowerBarDiscH, StringFormat(2, 0));
		}
		else if (showLowerBarPlaybackTime && fb.IsPlaying) { // * Streaming, but still want to show time
			gr.DrawString(str.time, ft.lower_bar_time, col.lowerBarTitle, lowerBarTimeX, lowerBarTimeY, lowerBarTimeW, lowerBarTimeH, StringFormat(2, 0));
		}
		else { // * Not playing anything, will show theme version or update link if available
			let offset = 0;
			if (updateAvailable && updateHyperlink) {
				offset = updateHyperlink.getWidth();
				updateHyperlink.setContainerWidth(ww);
				updateHyperlink.set_y(lowerBarTop);
				updateHyperlink.set_xOffset(ww - offset - SCALE(pref.layout !== 'default' ? 20 : 40));
				updateHyperlink.draw(gr, col.lowerBarTitle);
			}
			if (showLowerBarPlaybackTime) {
				gr.DrawString(str.time, ft.lower_bar_length, col.lowerBarTitle, lowerBarVersionX - offset, lowerBarVersionY, lowerBarVersionW, lowerBarVersionH, StringFormat(2, 0));
			}
		}
		if (showLowerBarPlaybackTime && fb.IsPlaying) { // * Switch to playback time remaining
			btns.playbackTime = new Button(ww - timeAreaWidth - SCALE(pref.layout !== 'default' ? 20 : 40), lowerBarTimeY,
			timeAreaWidth, lowerBarTimeH, showLowerBarPlaybackTime ? 'PlaybackTime' : '', '', showLowerBarPlaybackTime ? 'Switch playback time' : '');
		}
	}

	// * LOWER BAR TOOLTIP * //
	if ((pref.showTooltipMain || pref.showTooltipTruncated) && str.lowerBar_tt && fb.IsPlaying) {
		str.lowerBar_tt.draw(gr);
	}

	// * VOLUME BTN * //
	if (showVolumeBtn && loadingThemeComplete) {
		volumeBtn.draw(gr);
	}

	// * PROGRESS BAR * //
	if (showProgressBar && (pref.seekbar === 'progressbar' || !fb.IsPlaying)) {
		progressBarY = Math.round(lowerBarTop + titleMeasurements.Height + progressBar.h);
		progressBar.setY(progressBarY);
		progressBar.draw(gr);
	}
	// * WAVEFORM BAR * //
	else if (showWaveformBar && pref.seekbar === 'waveformbar') {
		waveformBarY = Math.round(lowerBarTop + titleMeasurements.Height + waveformBar.h);
		waveformBar.setY(waveformBarY);
		waveformBar.draw(gr);
	}
	// * PEAKMETER BAR * //
	else if (showPeakmeterBar && pref.seekbar === 'peakmeterbar') {
		peakmeterBarY = Math.round(lowerBarTop + titleMeasurements.Height + peakmeterBar.h * 0.5);
		peakmeterBar.setY(peakmeterBarY);
		peakmeterBar.draw(gr);
	}

	drawLowerBarProfiler && drawLowerBarProfiler.Print();
}


/**
 * Draws styled tooltips that will make standard tooltips look fancy.
 * @param {GdiGraphics} gr
 */
function drawStyledTooltips(gr) {
	if (styledTooltipText === '' || !styledTooltipReady || !pref.showStyledTooltips) return;

	const tooltipFontSize = pref[`tooltipFontSize_${pref.layout}`];
	const offset = SCALE(30);
	const padding = SCALE(15);
	const edgeSpace = padding * 0.5;
	const arc = SCALE(6);
	const w = Math.min(gr.MeasureString(styledTooltipText, ft.tooltip, 0, 0, 0, 0).Width + padding, ww - (state.mouse_x > ww * 0.85 ? state.mouse_x - ww * 0.15 : state.mouse_x) - edgeSpace);
	const h = Math.min(gr.MeasureString(styledTooltipText, ft.tooltip, 0, 0, w, wh).Height + padding, wh - (state.mouse_y > wh * 0.85 ? state.mouse_y - wh * 0.15 : state.mouse_y) - edgeSpace - offset);
	const x = state.mouse_x > ww * 0.85 ? state.mouse_x - w : state.mouse_x; // * When tooltip is too close to the right edge, it will be drawn on the left side of the mouse cursor
	const y = state.mouse_y > wh * 0.85 ? state.mouse_y - h : state.mouse_y + offset; // * When tooltip is too close to the bottom edge, it will be drawn on the top side of the mouse cursor
	const throttleRepaintRect = _Throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), 50);

	// * Apply better anti-aliasing on smaller font sizes in HD res
	gr.SetTextRenderingHint(!RES_4K && tooltipFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
	gr.FillRoundRect(x, y, w, h, arc, arc, RGBtoRGBA(col.popupBg, 220));
	gr.DrawRoundRect(x, y, w, h, arc, arc, SCALE(2), 0x64000000);
	gr.DrawString(styledTooltipText, ft.tooltip, col.popupText, x + padding * 0.5, y + padding * 0.5, w - padding, h - padding, StringFormat(0, 0, 4));
	throttleRepaintRect(x - offset * 0.5, y - offset * 0.5, w + offset, h + offset);
}


/**
 * Draws red rectangles for debugging to show all painted areas in the panels.
 * @param {GdiGraphics} gr
 */
function drawDebugRectAreas(gr) {
	if (!repaintRects.length) return;
	try {
		repaintRects.forEach(rect => gr.DrawRect(rect.x, rect.y, rect.w, rect.h, SCALE(2), RGBA(255, 0, 0, 200)));
		repaintRects = [];
	} catch (e) {}
}


/**
 * Draws the startup background until everything in the theme is loaded.
 * Pseudo delay background logo mask when loading the theme, otherwise it will show ugly repaints when initializing since smp v1.6.1.
 * @param {GdiGraphics} gr
 */
function drawStartupBackground(gr) {
	if (loadingThemeComplete) return;
	gr.FillSolidRect(0, 0, ww, wh, col.loadingThemeBg);
	if (pref.showLogoOnStartup) drawLogo(gr);
}


/////////////////////////////
// * MAIN USER INTERFACE * //
/////////////////////////////
/**
 * Draws all main user interface parts in the correct order.
 * @param {GdiGraphics} gr
 */
function drawMain(gr) {
	drawBackgrounds(gr);

	// * UIHacks aero glass shadow frame fix, needed for style Blend in Details
	if (UIHacks.Aero.Effect === 2) gr.DrawLine(0, 0, ww, 0, 1, col.bg);

	// * Style Blend applied in Details
	if (pref.styleBlend && albumArt && blendedImg && (!displayPlaylist && !displayLibrary && !displayBiography && pref.layout === 'default' ||
		!displayPlaylistArtwork && !displayLibrary && pref.layout === 'artwork')) {
		gr.DrawImage(blendedImg, 0, 0, ww, wh, 0, 0, blendedImg.Width, blendedImg.Height);
	}

	drawPanels(gr);
	drawAlbumArt(gr);
	drawNoAlbumArt(gr)
	drawHiResAudioLogo(gr);
	drawPauseBtn(gr);
	drawJumpSearch(gr);
	drawDetailsMetadataGrid(gr);
	drawDetailsBandLogo(gr);
	drawDetailsLabelLogo(gr);
	drawLyrics(gr);
	drawStyles(gr);
	drawThemePresetIndicator(gr);
	drawThemeDebugOverlay(gr);
	drawPanelShadows(gr);
	drawTopMenuBar(gr);
	drawLowerBar(gr);
	drawCustomThemeMenu(gr);
	drawMetadataGridMenu(gr);
	drawStyledTooltips(gr);
	drawDebugRectAreas(gr);
	drawStartupBackground(gr);

	// * UIHacks aero glass shadow frame fix
	if (UIHacks.Aero.Effect === 2 && (!loadingThemeComplete && (pref.styleBlend || pref.styleBlend2)) || !pref.styleBlend && !pref.styleBlend2) {
		gr.DrawLine(0, 0, ww, 0, 1, loadingThemeComplete ? col.uiHacksFrame : pref.styleBlackReborn ? RGB(25, 25, 25) : pref.styleRebornBlack && fb.IsPlaying ? RGB(245, 245, 245) : col.bg);
		if (pref.styleDefault) gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, loadingThemeComplete ? col.uiHacksFrame : col.bg);
		else if (pref.styleGradient || pref.styleGradient2) {
			gr.DrawLine(0, 0, ww, 0, 1, col.bg);
			gr.FillGradRect(-0.5, 0, ww, 1, pref.styleGradient2 ? -200 : 0, pref.styleGradient2 ? 0 : col.styleGradient, pref.styleGradient2 ? col.styleGradient2 : 0, 0.5);
		}
	}

	// * Debug
	if (timings.showDrawTiming || timings.showExtraDrawTiming) {
		const start = new Date();
		const end = Date.now();
		console.log(`${start.getHours()}:${LeftPad(start.getMinutes(), 2, '0')}:${LeftPad(start.getSeconds(), 2, '0')}.${LeftPad(start.getMilliseconds(), 3, '0')}: ` +
			`on_paint took ${end - start.getTime()}ms ${repaintRectCount > 1 ? `- ${repaintRectCount} repaintRect calls` : ''}`);
	}
	repaintRectCount = 0;
}


/**
 * Draws the main user interface.
 * @param {GdiGraphics} gr
 */
function on_paint(gr) {
	drawMain(gr);
}


//////////////////////////////////
// ! CALL MAIN INITIALIZATION ! //
//////////////////////////////////
if (pref.systemFirstLaunch) {
	systemFirstLaunch();
} else {
	initMain();
}
