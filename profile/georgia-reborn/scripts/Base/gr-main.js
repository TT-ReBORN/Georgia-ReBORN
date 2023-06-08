/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Main                                 * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-02                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////////////////
// * MAIN USER INTERFACE PARTS * //
///////////////////////////////////
/** Draws the Main and Details background */
function drawBackgrounds(gr) {
	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	gr.SetSmoothingMode(SmoothingMode.None);

	// * MAIN BACKGROUND * //
	if (!albumArt && noArtwork) { // We use noArtwork to prevent flashing of blue default theme
		albumArtSize.x =
			pref.layout === 'default' &&  displayCustomThemeMenu && !displayPlaylist && !displayLibrary && !displayBiography ? ww * 0.3 :
			pref.layout === 'default' && !displayCustomThemeMenu && !displayPlaylist && !displayLibrary && !displayBiography ||
			pref.layout === 'artwork' &&  displayPlaylist ? ww : 0;
		albumArtSize.w = ww * 0.5;
		albumArtSize.y = geo.topMenuHeight;
		albumArtSize.h = wh - geo.topMenuHeight - geo.lowerBarHeight;
		if (!themeColorSet) {
			setThemeColors();
			themeColorSet = true;
		}
	}
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// * DETAILS BACKGROUND * //
	if (fb.IsPlaying && (albumArt || !discArt || !albumArt && discArt) && ((!displayLibrary && !displayPlaylist) || !settings.hidePanelBgWhenCollapsed)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumArtSize.y, albumArtSize.x, albumArtSize.h, !pref.albumArtColoredGap && (((displayPlaylist || displayLibrary) && pref.layout === 'default') ||
			((!displayPlaylist && !displayLibrary) && pref.layout === 'artwork')) ? g_pl_colors.bg : col.detailsBg);

		// Show full background when no disc art
		if (pref.noDiscArtBg && (!discArt || !pref.displayDiscArt) && albumArt && (!displayLibrary && !displayPlaylist && !displayBiography) || pref.theme === 'reborn' && pref.styleBlend2 && (pref.styleRebornWhite || pref.styleRebornBlack) || pref.layout === 'artwork') {
			gr.FillSolidRect(albumArtSize.x + albumArtSize.w - scaleForDisplay(1), albumArtSize.y, albumArtSize.x + scaleForDisplay(2), albumArtSize.h, col.detailsBg);
		}
		if ((isStreaming && noArtwork || !albumArt && noArtwork)) {
			gr.FillSolidRect(0, geo.topMenuHeight, ww, wh - geo.topMenuHeight - geo.lowerBarHeight, col.detailsBg);
		}
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}
}


/** Draws the Playlist, Library and Biography panels, Playlist needs to be drawn the last to hide unwanted stuff in the middle */
function drawPanels(gr) {
	if (pref.layout === 'default' || pref.layout === 'artwork') {
		if (displayLibrary) {
			const drawLibraryProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> library') : null;
			libraryPanel.on_paint(gr);
			drawLibraryProfiler && drawLibraryProfiler.Print();
		}
		if (pref.layout === 'default' && displayPlaylist || pref.layout === 'artwork' && displayPlaylistArtworkLayout || displayPlaylistLibrary()) {
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


/** Draws the jumpsearch on the right centered side */
function drawJumpSearch(gr) {
	jumpSearch.setY(Math.round(wh * 0.5 - geo.topMenuHeight - geo.lowerBarHeight));
	jumpSearch.draw(gr);
}


/** Draws the big album art on the left side */
function drawAlbumArt(gr) {
	// * BIG ALBUM ART - NEEDS TO BE DRAWN AFTER ALL BLENDING IS DONE, I.E AFTER PLAYLIST * //
	if (displayPlaylistLibrary()) return;

	if (pref.layout === 'default' && fb.IsPlaying && (displayPlaylist && pref.playlistLayout !== 'full' && !displayBiography || displayLibrary && pref.libraryLayout === 'normal' || pref.displayLyrics) ||
		!displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) {
		const drawArt = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> artwork') : null;
		const displayDetails = (pref.layout === 'artwork' ? !displayPlaylistArtworkLayout : !displayPlaylist) && !displayLibrary && !displayBiography;

		// * noAlbumArtStub if no album cover exist * //
		if (!albumArt && noArtwork && fb.IsPlaying) {
			if (pref.layout === 'default' && fb.IsPlaying && (displayPlaylist && pref.playlistLayout !== 'full' && !displayBiography || displayLibrary && pref.libraryLayout === 'normal') ||
				pref.layout === 'default' && !displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography && pref.displayLyrics ||
				pref.layout === 'artwork' && !displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) {

				// * Clear previous artwork related stuff
				noAlbumArtStub = true;
				albumArt = null;
				artCache.clear();
				discArt = null;
				discArtArray = [];
				const heightCorr = scaleForDisplay(14);

				// * Stub background
				gr.FillSolidRect(0, geo.topMenuHeight, pref.lyricsLayout === 'full' && pref.displayLyrics || pref.layout === 'artwork' ? ww : ww * 0.5, wh - geo.topMenuHeight - geo.lowerBarHeight, g_pl_colors.bg);
				if (!pref.displayLyrics) {
					gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
					gr.DrawString('\uf001', ft.no_album_art_stub, col.noAlbumArtStub, 0, 0, pref.layout === 'artwork' ? ww : ww * 0.5, wh - geo.topMenuHeight - geo.lowerBarHeight + ft.no_album_art_stub.Height * 0.5 - heightCorr, StringFormat(1, 1));
				}
			}
		} else { noAlbumArtStub = false; }

		if (!noAlbumArtStub) {
			if (discArt && !rotatedDiscArt && !displayPlaylist && !displayLibrary && pref.displayDiscArt) {
				createRotatedDiscArtImage();
			}
			if (albumArt && (albumArtScaled || rotatedDiscArt) && !displayBiography && !displayPlaylistArtworkLayout) {
				if (discArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary) {
					shadowImg && gr.DrawImage(shadowImg, -geo.discArtShadow, albumArtSize.y - geo.discArtShadow, shadowImg.Width, shadowImg.Height, 0, 0, shadowImg.Width, shadowImg.Height);
					// gr.DrawRect(-geo.discArtShadow, albumArtSize.y - geo.discArtShadow, shadowImg.Width, shadowImg.Height, 1, RGBA(0,0,255,125)); // Viewing border line
				}
			}
			if (albumArt && albumArtScaled) {
				if (!pref.discArtOnTop || pref.displayLyrics) {
					if (rotatedDiscArt && !displayPlaylist && !displayLibrary) {
						drawDiscArt(gr);
					}
					if (rotatedDiscArt && !displayPlaylist && !displayLibrary && pref.detailsAlbumArtDiscAreaOpacity !== 255) { // Do not use opacity if image is a booklet, i.e albumArtSize.w > ww * 0.66
						MaskAlbumArtDiscArea(gr, albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h, 0, 0, albumArtScaled.Width, albumArtScaled.Height, 0, displayDetails && albumArtSize.w < ww * 0.66 ? pref.detailsAlbumArtDiscAreaOpacity : 255);
					} else {
						gr.DrawImage(albumArtScaled, albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h, 0, 0, albumArtScaled.Width, albumArtScaled.Height, 0, displayDetails && albumArtSize.w < ww * 0.66 ? pref.detailsAlbumArtOpacity : 255);
					}
				} else { // Draw discArt on top of front cover
					gr.DrawImage(albumArtScaled, albumArtSize.x, albumArtSize.y, albumArtSize.w, albumArtSize.h, 0, 0, albumArtScaled.Width, albumArtScaled.Height);
					if (rotatedDiscArt && !displayPlaylist && !displayLibrary) {
						drawDiscArt(gr);
					}
				}
			} else if (rotatedDiscArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics) {
				// Disc art, but no album art
				drawDiscArt(gr);
			}
		}

		// * Hi-Res audio logo
		if (pref.showHiResAudioBadge && pref.layout !== 'compact' && (Number($('$info(bitspersample)', fb.GetNowPlaying())) > 16 || Number($('$info(bitrate)', fb.GetNowPlaying())) > 1411)) {
			const logoPath = `${fb.ProfilePath}georgia-reborn\\images\\misc\\`;
			const plus4k = is_4k ? '4k-' : '';
			const plusRound = pref.hiResAudioBadgeRound ? '-round' : '';

			if      (pref.hiResAudioBadgeSize === 'small')  paths.hiResAudioImage = `${logoPath}${plus4k}hi-res-audio-small${plusRound}.png`;
			else if (pref.hiResAudioBadgeSize === 'normal') paths.hiResAudioImage = `${logoPath}${plus4k}hi-res-audio-normal${plusRound}.png`;
			else if (pref.hiResAudioBadgeSize === 'large')  paths.hiResAudioImage = `${logoPath}${plus4k}hi-res-audio-large${plusRound}.png`;

			hiResAudioImg = gdi.Image(paths.hiResAudioImage);

			const x =
				pref.hiResAudioBadgePos === 'topleft' ? albumArtSize.x + scaleForDisplay(20) :
				pref.hiResAudioBadgePos === 'topright' ? albumArtSize.x + albumArtSize.w - hiResAudioImg.Width - scaleForDisplay(20) :
				pref.hiResAudioBadgePos === 'bottomleft' ? albumArtSize.x + scaleForDisplay(40) :
				pref.hiResAudioBadgePos === 'bottomright' ? albumArtSize.x + albumArtSize.w - hiResAudioImg.Width - scaleForDisplay(40) : '';

			const y =
				pref.hiResAudioBadgePos === 'topleft' || pref.hiResAudioBadgePos === 'topright' ? albumArtSize.y + scaleForDisplay(20) :
				albumArtSize.y + albumArtSize.h - hiResAudioImg.Height - scaleForDisplay(40);

			gr.DrawImage(hiResAudioImg, x, y, hiResAudioImg.Width, hiResAudioImg.Height, 0, 0, hiResAudioImg.Width, hiResAudioImg.Height);
		}

		if (timings.showExtraDrawTiming) drawArt.Print();
	}
}


/** Draws the pause button centered on album art */
function drawPauseBtn(gr) {
	if (pref.showPause && fb.IsPaused && (!presetIndicatorTimer || !doubleClicked)
		&&
		(pref.layout === 'default' && (displayPlaylist && pref.playlistLayout !== 'full' && !displayLibrary && !displayBiography ||
		displayLibrary && pref.libraryLayout === 'normal' && !displayPlaylist || !displayPlaylist && !displayLibrary && !displayBiography)
		||
		pref.layout === 'artwork' && !displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography)) {
		pauseBtn.draw(gr);
	}
}


/** Draws the metadata grid on the left side in the Details panel */
function drawDetailsMetadataGrid(gr) {
	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	const displayDetails = (pref.layout === 'artwork' ? !displayPlaylistArtworkLayout : !displayPlaylist) && !displayLibrary && !displayBiography;
	const marginLeft = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
	gridTop = albumArtSize.y ? albumArtSize.y + marginLeft : geo.topMenuHeight + marginLeft;

	// * DETAILS METADATA GRID * //
	if (displayDetails && (pref.lyricsLayout !== 'full' || pref.lyricsLayout === 'full' && !pref.displayLyrics)) {
		const drawTextGrid = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> textGrid') : null;

		let gridSpace = 0;
		const marginRight = scaleForDisplay(20);
		gridSpace = Math.round((!albumArt && discArt ? discArtSize.x : albumArtSize.x) - geo.discArtShadow - marginLeft - marginRight);
		const textWidth = gridSpace;

		const gridArtistFontSize   = pref.layout === 'artwork' ? pref.gridArtistFontSize_artwork   : pref.gridArtistFontSize_default;
		const showGridArtist       = pref.layout === 'artwork' ? pref.showGridArtist_artwork       : pref.showGridArtist_default;
		const showGridTrackNum     = pref.layout === 'artwork' ? pref.showGridTrackNum_artwork     : pref.showGridTrackNum_default;
		const showGridTitle        = pref.layout === 'artwork' ? pref.showGridTitle_artwork        : pref.showGridTitle_default;
		const showGridTimeline     = pref.layout === 'artwork' ? pref.showGridTimeline_artwork     : pref.showGridTimeline_default;
		const showGridArtistFlags  = pref.layout === 'artwork' ? pref.showGridArtistFlags_artwork  : pref.showGridArtistFlags_default;
		const showGridReleaseFlags = pref.layout === 'artwork' ? pref.showGridReleaseFlags_artwork : pref.showGridReleaseFlags_default;
		const showGridCodecLogo    = pref.layout === 'artwork' ? pref.showGridCodecLogo_artwork    : pref.showGridCodecLogo_default;

		if (gridSpace > 150) {
			/** @type {MeasureStringInfo} */
			let txtRec;
			let gridArtistTxtRec;
			let gridTitleTxtRec;
			let gridAlbumTxtRec;

			function drawArtist(top) {
				if (!str.artist) return 0;

				const flagSizeWhiteSpace =
				gridArtistFontSize === 24 ? ' '.repeat(flagImgs.length >= 6 ? 35 : flagImgs.length === 5 ? 29 : flagImgs.length === 4 ? 24 : flagImgs.length === 3 ? 18 : flagImgs.length === 2 ? 12 : 6) :
				gridArtistFontSize === 22 ? ' '.repeat(flagImgs.length >= 6 ? 36 : flagImgs.length === 5 ? 30 : flagImgs.length === 4 ? 25 : flagImgs.length === 3 ? 19 : flagImgs.length === 2 ? 12 : 6) :
				gridArtistFontSize === 20 ? ' '.repeat(flagImgs.length >= 6 ? 37 : flagImgs.length === 5 ? 31 : flagImgs.length === 4 ? 26 : flagImgs.length === 3 ? 20 : flagImgs.length === 2 ? 12 : 6) :
				gridArtistFontSize === 19 ? ' '.repeat(flagImgs.length >= 6 ? 38 : flagImgs.length === 5 ? 32 : flagImgs.length === 4 ? 26 : flagImgs.length === 3 ? 20 : flagImgs.length === 2 ? 12 : 6) :
				gridArtistFontSize === 18 ? ' '.repeat(flagImgs.length >= 6 ? 39 : flagImgs.length === 5 ? 32 : flagImgs.length === 4 ? 26 : flagImgs.length === 3 ? 20 : flagImgs.length === 2 ? 13 : 6) :
				gridArtistFontSize === 17 ? ' '.repeat(flagImgs.length >= 6 ? 40 : flagImgs.length === 5 ? 33 : flagImgs.length === 4 ? 27 : flagImgs.length === 3 ? 20 : flagImgs.length === 2 ? 13 : 6) :
				gridArtistFontSize === 16 ? ' '.repeat(flagImgs.length >= 6 ? 41 : flagImgs.length === 5 ? 34 : flagImgs.length === 4 ? 28 : flagImgs.length === 3 ? 21 : flagImgs.length === 2 ? 13 : 6) :
				gridArtistFontSize === 15 ? ' '.repeat(flagImgs.length >= 6 ? 42 : flagImgs.length === 5 ? 35 : flagImgs.length === 4 ? 29 : flagImgs.length === 3 ? 22 : flagImgs.length === 2 ? 14 : 6) :
				gridArtistFontSize === 14 ? ' '.repeat(flagImgs.length >= 6 ? 44 : flagImgs.length === 5 ? 36 : flagImgs.length === 4 ? 29 : flagImgs.length === 3 ? 22 : flagImgs.length === 2 ? 14 : 6) :
				gridArtistFontSize === 13 ? ' '.repeat(flagImgs.length >= 6 ? 45 : flagImgs.length === 5 ? 37 : flagImgs.length === 4 ? 30 : flagImgs.length === 3 ? 23 : flagImgs.length === 2 ? 15 : 6) :
				gridArtistFontSize === 12 ? ' '.repeat(flagImgs.length >= 6 ? 47 : flagImgs.length === 5 ? 39 : flagImgs.length === 4 ? 31 : flagImgs.length === 3 ? 24 : flagImgs.length === 2 ? 15 : 7) :
				gridArtistFontSize === 11 ? ' '.repeat(flagImgs.length >= 6 ? 49 : flagImgs.length === 5 ? 41 : flagImgs.length === 4 ? 32 : flagImgs.length === 3 ? 25 : flagImgs.length === 2 ? 16 : 7) :
				gridArtistFontSize === 10 ? ' '.repeat(flagImgs.length >= 6 ? 51 : flagImgs.length === 5 ? 43 : flagImgs.length === 4 ? 34 : flagImgs.length === 3 ? 26 : flagImgs.length === 2 ? 17 : 7) : '';

				const flagSize =
				flagImgs.length >=  6 ? scaleForDisplay(84 + gridArtistFontSize * 6) :
				flagImgs.length === 5 ? scaleForDisplay(70 + gridArtistFontSize * 5) :
				flagImgs.length === 4 ? scaleForDisplay(56 + gridArtistFontSize * 4) :
				flagImgs.length === 3 ? scaleForDisplay(42 + gridArtistFontSize * 3) :
				flagImgs.length === 2 ? scaleForDisplay(28 + gridArtistFontSize * 2) :
				flagImgs.length === 1 ? scaleForDisplay(14 + gridArtistFontSize) : '';

				gridArtistTxtRec = gr.MeasureString(str.artist, ft.grd_artist, 0, 0, showGridArtistFlags && flagImgs.length ? textWidth - flagSize : textWidth, wh);
				const gridArtistNumLines  = Math.min(2, gridArtistTxtRec.Lines);
				const gridArtistNumHeight = gr.CalcTextHeight(str.artist, ft.grd_artist) * gridArtistNumLines + 3;
				const gridArtistHeight    = gr.CalcTextHeight(str.artist, ft.grd_artist);

				// * Apply better anti-aliasing on smaller font sizes in HD res
				gr.SetTextRenderingHint(!is_4k && gridArtistFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
				gr.DrawString(showGridArtistFlags && flagImgs.length ? flagSizeWhiteSpace + str.artist : str.artist, ft.grd_artist, ['white', 'black', 'reborn', 'random'].includes(pref.theme) ? col.detailsText : pref.theme === 'cream' ? g_pl_colors.header_artist_normal : g_pl_colors.header_artist_playing, marginLeft, Math.round(top), textWidth, gridArtistNumHeight, g_string_format.trim_ellipsis_char);

				// * Artist flags
				if (str.artist && flagImgs.length && showGridArtistFlags && displayDetails) {
					let flagsLeft = marginLeft;
					for (let i = 0; i < flagImgs.length; i++) {
						gr.DrawImage(flagImgs[i], flagsLeft, Math.round(top - (flagImgs[i].Height / (gridArtistHeight + scaleForDisplay(2))) - (is_4k ? 1 : 0)), flagImgs[i].Width + scaleForDisplay(gridArtistFontSize) - scaleForDisplay(26), gridArtistHeight + scaleForDisplay(2), 0, 0, flagImgs[i].Width, flagImgs[i].Height);
						flagsLeft += flagImgs[i].Width - scaleForDisplay(18) + scaleForDisplay(gridArtistFontSize);
						// Maximum 6 flags
						if (i > 4) break;
					}
				}

				return gridArtistNumHeight + (is_4k ? 17 : 9);
			}

			gridTop -= scaleForDisplay(2);

			function drawTitle(top) {
				if (!str.title) return 0;
				gridTitleTxtRec = gr.MeasureString(isStreaming ? showGridTrackNum ? str.tracknum + str.title : str.title : str.tracknum === '' ? str.title : showGridTrackNum ? `${str.tracknum}\xa0${str.title}` : str.title, ft.grd_title, 0, 0, textWidth, wh);
				const gridTitleNumLines = Math.min(2, gridTitleTxtRec.Lines);
				const gridTitleNumHeight = gr.CalcTextHeight(str.title, ft.grd_title) * gridTitleNumLines + 3;
				const gridTitleFontSize = pref.layout === 'artwork' ? pref.gridTitleFontSize_artwork : pref.gridTitleFontSize_default;

				// * Apply better anti-aliasing on smaller font sizes in HD res
				gr.SetTextRenderingHint(!is_4k && gridTitleFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
				gr.DrawString(isStreaming ? showGridTrackNum ? str.tracknum + str.title : str.title : str.tracknum === '' ? str.title : showGridTrackNum ? `${str.tracknum}\xa0${str.title}` : str.title, ft.grd_title, col.detailsText, marginLeft, Math.round(top), textWidth, gridTitleNumHeight, g_string_format.trim_ellipsis_char);

				return gridTitleNumHeight + (is_4k ? 17 : 9);
			}

			gridTop -= scaleForDisplay(2);

			function drawAlbumTitle(top, maxLines) {
				if (!str.album) return 0;
				gridAlbumTxtRec = gr.MeasureString(str.album, ft.grd_album, 0, 0, textWidth, wh);
				const gridAlbumNumLines = Math.min(showGridArtist || showGridTitle ? 2 : 3, gridAlbumTxtRec.Lines);
				const gridAlbumNumHeight = gr.CalcTextHeight(str.album, ft.grd_album) * gridAlbumNumLines + 3;
				const gridAlbumFontSize = pref.layout === 'artwork' ? pref.gridAlbumFontSize_artwork : pref.gridAlbumFontSize_default;

				// * Apply better anti-aliasing on smaller font sizes in HD res
				gr.SetTextRenderingHint(!is_4k && gridAlbumFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
				gr.DrawString(str.album, ft.grd_album, col.detailsText, marginLeft, Math.round(top), textWidth, gridAlbumNumHeight, g_string_format.trim_ellipsis_char);

				return gridAlbumNumHeight + scaleForDisplay(13);
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
				str.timeline.setSize(marginLeft, gridTop + scaleForDisplay(4), albumArtSize.x - marginLeft * 2);
				str.timeline.draw(gr);
			}
			// * Tooltip
			if (str.metadata_grid_tt && fb.IsPlaying) {
				str.metadata_grid_tt.setSize(marginLeft, geo.topMenuHeight, albumArtSize.x - marginLeft * 2);
				str.metadata_grid_tt.draw(gr);
			}
			if (showGridTimeline) {
				gridTop += geo.timelineHeight + scaleForDisplay(20);
			}
			if (showGridArtist || showGridTitle) {
				gridTop += drawAlbumTitle(gridTop, 2);
			}

			// * Tags
			const font_array = [ft.grd_key];
			const key_font_array = [ft.grd_val];
			let grid_key_ft = ft.grd_key;
			str.grid.forEach((el) => {
				if (font_array.length > 1) {	// Only check if there's more than one entry in font_array
					grid_key_ft = chooseFontForWidth(gr, textWidth / 3, el, font_array);
					while (grid_key_ft !== font_array[0]) { // If font returned was first item in the array, then everything fits, otherwise pare down array
						font_array.shift();
						key_font_array.shift();
					}
				}
			});
			const grid_val_ft = key_font_array.shift();
			const col1Width = calculateGridMaxTextWidth(gr, str.grid, grid_key_ft);
			const columnMargin = scaleForDisplay(10);
			const col2Width = textWidth - columnMargin - col1Width + scaleForDisplay(5);
			const col2Left = marginLeft + col1Width + columnMargin;

			for (let k = 0; k < str.grid.length; k++) {
				const key = str.grid[k].label;
				const value = str.grid[k].val;
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
						case 'Catalog #':
						case 'Rel. Country':
							showReleaseFlagImage = showGridReleaseFlags;
							break;
						case 'Codec':
							showGridCodecLogoImage = showGridCodecLogo;
							break;
						default:
							break;
					}
					txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2Width, wh);
					if (gridTop + txtRec.Height < albumArtSize.y + albumArtSize.h) {
						const borderWidth = scaleForDisplay(0.5);
						const cellHeight = txtRec.Height + 5;
						const keyFontSize = pref.layout === 'artwork' ? pref.gridKeyFontSize_artwork : pref.gridKeyFontSize_default;
						const valFontSize = pref.layout === 'artwork' ? pref.gridValueFontSize_artwork + scaleForDisplay(1) : pref.gridValueFontSize_default + scaleForDisplay(1);
						const showReleaseFlagOnly = pref.layout === 'artwork' ? pref.sshowGridReleaseFlags_artwork === 'logo' : pref.showGridReleaseFlags_default === 'logo';
						const showCodecLogoOnly = pref.layout === 'artwork' ? pref.showGridCodecLogo_artwork === 'logo' : pref.showGridCodecLogo_default === 'logo';
						const flag = showReleaseFlagOnly && key === 'Rel. Country';
						const codec = showCodecLogoOnly && key === 'Codec';
						const ratingLinux = DetectWine() && key === 'Rating';

						// * Apply better anti-aliasing on smaller font sizes in HD res
						gr.SetTextRenderingHint(!is_4k && (keyFontSize < 17 || valFontSize < 18) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

						if (dropShadow) {
							gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left + borderWidth), Math.round(gridTop + borderWidth), col2Width + (ratingLinux ? scaleForDisplay(20) : 0), cellHeight, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left - borderWidth), Math.round(gridTop + borderWidth), col2Width + (ratingLinux ? scaleForDisplay(20) : 0), cellHeight, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left + borderWidth), Math.round(gridTop - borderWidth), col2Width + (ratingLinux ? scaleForDisplay(20) : 0), cellHeight, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.darkAccent_50, Math.round(col2Left - borderWidth), Math.round(gridTop - borderWidth), col2Width + (ratingLinux ? scaleForDisplay(20) : 0), cellHeight, StringFormat(0, 0, 4));
						}
						gr.DrawString(key, grid_key_ft, col.detailsText, marginLeft, Math.round(gridTop), col1Width, cellHeight, g_string_format.trim_ellipsis_char);
						gr.DrawString(flag || codec ? '' : value, grid_val_ft, grid_val_col, col2Left, Math.round(gridTop), col2Width + (ratingLinux ? scaleForDisplay(20) : 0), cellHeight, StringFormat(0, 0, 4));

						// * Last.fm logo
						if (playCountVerifiedByLastFm && showLastFmImage) {
							const lastFmImg = gdi.Image(paths.lastFmImageRed);
							const lastFmWhiteImg = gdi.Image(paths.lastFmImageWhite);
							const lastFmLogo = colorDistance(col.primary, RGB(185, 0, 0), false) < 133 ? lastFmWhiteImg : lastFmImg;
							const heightRatio = (cellHeight - 12) / lastFmLogo.Height;
							if (txtRec.Width + scaleForDisplay(12) + Math.round(lastFmLogo.Width * heightRatio) < col2Width) {
								gr.DrawImage(lastFmLogo, col2Left + txtRec.Width + scaleForDisplay(12), gridTop + 3,
									Math.round(lastFmLogo.Width * heightRatio), cellHeight - 12, 0, 0, lastFmLogo.Width, lastFmLogo.Height);
							}
						}
						// * Release flags
						if (showReleaseFlagImage && releaseFlagImg) {
							const heightRatio = (cellHeight) / releaseFlagImg.Height;
							if ((!showReleaseFlagOnly ? txtRec.Width + scaleForDisplay(8) : 0) + Math.round(releaseFlagImg.Width * heightRatio) < col2Width) {
								gr.DrawImage(releaseFlagImg, showReleaseFlagOnly && key === 'Rel. Country' ? col2Left : col2Left + txtRec.Width + scaleForDisplay(8), gridTop - 3,
									Math.round(releaseFlagImg.Width * heightRatio * (txtRec.Lines === 2 ? 0.5 : 1)), cellHeight * (txtRec.Lines === 2 ? 0.5 : 1), 0, 0, releaseFlagImg.Width, releaseFlagImg.Height);
							}
						}
						// * Codec logo
						if (showGridCodecLogoImage) {
							loadCodecLogo();
							const heightRatio = codecLogo != null ? (cellHeight - 4) / codecLogo.Height : '';
							if (codecLogo != null && (!showCodecLogoOnly ? txtRec.Width + scaleForDisplay(8) : 0) + Math.round(codecLogo.Width * heightRatio) < col2Width) {
								gr.DrawImage(codecLogo, showCodecLogoOnly && key === 'Codec' ? col2Left : col2Left + txtRec.Width + scaleForDisplay(8), gridTop - 1,
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
}


/** Draws the band logo on the bottom left side in the Details panel */
function drawDetailsBandLogo(gr) {
	if (fb.IsPlaying && albumArt && !displayPlaylist && !displayLibrary && !displayBiography && pref.layout === 'default') {
		const drawLogos = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> logos') : null;
		const marginLeft = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		const availableSpace = albumArtSize.y + albumArtSize.h - gridTop;
		const lightBg = new Color(col.detailsText).brightness < 140;
		const logo = lightBg || noAlbumArtStub ? (invertedBandLogo || bandLogo) : bandLogo;

		if (logo && availableSpace > 75) {
			// Max width we'll draw is 1/2 the full size because the HQ images are just so big
			let logoWidth = Math.min(is_4k ? logo.Width : logo.Width / 2, albumArtSize.x - ww * 0.05);
			let heightScale = logoWidth / logo.Width; // Width is fixed to logoWidth, so scale height accordingly
			if (logo.Height * heightScale > availableSpace) {
				// TODO: could probably do this calc just once, but the logic is complicated
				heightScale = availableSpace / logo.Height;
				logoWidth = logo.Width * heightScale;
			}
			let logoTop = Math.round(albumArtSize.y + albumArtSize.h - (heightScale * logo.Height)) - 4;
			if (is_4k) {
				logoTop -= 20;
			}
			gr.DrawImage(logo, Math.round(isStreaming ? scaleForDisplay(40) : albumArtSize.x / 2 - logoWidth / 2), logoTop, Math.round(logoWidth), Math.round(logo.Height * heightScale), 0, 0, logo.Width, logo.Height, 0);
		}

		if (timings.showExtraDrawTiming) drawLogos.Print();
	}
}


/** Draws the label logo on the bottom right side in the Details panel */
function drawDetailsLabelLogo(gr) {
	if (fb.IsPlaying && albumArt && !displayPlaylist && !displayLibrary && !displayBiography && pref.layout === 'default') {
		const drawLogos = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> labels') : null;

		if (recordLabels.length > 0) {
			const lightBg = pref.labelArtOnBg ? new Color(col.bg).brightness > 140 : new Color(col.detailsText).brightness < 140;
			const labels = lightBg || noAlbumArtStub ? (recordLabelsInverted.length ? recordLabelsInverted : recordLabels) : recordLabels;
			const rightSideGap = 20; // How close last label is to right edge
			let labelSpacing = 0;
			const leftEdgeGap = (artOffCenter ? 20 : 40) * (is_4k ? 1.8 : 1); // Space between art and label
			const maxLabelWidth = scaleForDisplay(200);
			const leftEdgeWidth = is_4k ? 45 : 30; // How far label background extends on left
			let totalLabelWidth = 0;
			let labelAreaWidth = 0;
			let leftEdge = 0;
			let topEdge = 0;
			let labelWidth;
			let labelHeight;
			// const drawLabelTime = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> record labels') : null;

			for (let i = 0; i < labels.length; i++) {
				if (labels[i].Width > maxLabelWidth) {
					totalLabelWidth += maxLabelWidth;
				} else {
					totalLabelWidth += is_4k && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
				}
			}
			if (!lastLeftEdge) { // We don't want to recalculate this every screen refresh
				debugLog('recalculating lastLeftEdge');
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
							const maxWidth = is_4k && labels[0].Width < 200 ? labels[0].Width * 2 : labels[0].Width;
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
			if (labelAreaWidth >= scaleForDisplay(50)) {
				if (labels.length > 1) {
					labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // Spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				const allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
				let labelX = leftEdge;
				topEdge = albumArtSize.y + albumArtSize.h - labelHeight - 20;
				const origLabelHeight = labelHeight;

				if (!pref.labelArtOnBg) {
					if (!pref.noDiscArtBg) {
						if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme)) {
							if (!labelShadowImg) {
								labelShadowImg = createShadowRect(ww - labelX + leftEdgeWidth, labelHeight + 40);
							}
							gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.discArtShadow, topEdge - 20 - geo.discArtShadow, ww - labelX + leftEdgeWidth + 2 * geo.discArtShadow, labelHeight + 40 + 2 * geo.discArtShadow,
								0, 0, labelShadowImg.Width, labelShadowImg.Height);
						}
						gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing
						gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40, col.detailsBg);
						gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, col.shadow);
						gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
					}
				}
				else if (pref.noDiscArtBg && !pref.displayDiscArt) {
					gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.discArtShadow, topEdge - 20 - geo.discArtShadow, ww - labelX + leftEdgeWidth + 2 * geo.discArtShadow, labelHeight + 40 + 2 * geo.discArtShadow,
						0, 0, labelShadowImg.Width, labelShadowImg.Height);
				}
				if (pref.noDiscArtBg && pref.displayDiscArt && discArt) {
					if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme)) {
						if (!labelShadowImg) {
							labelShadowImg = createShadowRect(ww - labelX + leftEdgeWidth, labelHeight + 40);
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
					const maxWidth = is_4k && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
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
}


/** Draws the lyrics on the album art in the Lyrics panel */
function drawLyrics(gr) {
	if (pref.displayLyrics && fb.IsPlaying) {
		gr.SetSmoothingMode(SmoothingMode.None);
		const fullW = pref.layout === 'default' && pref.lyricsLayout === 'full' && pref.displayLyrics && noAlbumArtStub || pref.layout === 'artwork';
		gr.FillSolidRect(fullW ? 0 : albumArtSize.x, fullW ? geo.topMenuHeight : albumArtSize.y, fullW ? ww : albumArtSize.w, fullW ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h, pref.lyricsAlbumArt ? RGBA(0, 0, 0, 155) : g_pl_colors.bg);
		gLyrics && gLyrics.drawLyrics(gr);
	}
}


/** Draws activated styles from Options > Styles */
function drawStyles(gr) {
	if (pref.styleBevel) {
		gr.SetSmoothingMode(SmoothingMode.None);
		if (fb.IsPlaying && ((displayPlaylist || displayLibrary) && !displayBiography && pref.layout === 'default' || (!displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) && pref.layout === 'artwork')) {
			// Fill gap when album art or player size is not proportional
			gr.FillSolidRect(-1, geo.topMenuHeight, pref.layout === 'default' ? ww * 0.5 + 1 : ww + 1, (displayLibrary && pref.libraryLayout === 'full' ? 0 : albumArtSize.y) - geo.topMenuHeight - 1, RGBtoRGBA(col.styleBevel, 40));
		}
		if (!['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) && !pref.styleBlackAndWhite2 && !pref.styleRebornBlack) {
			const customThemes = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme);
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


/** Draws all the shadows for album art and panels */
function drawPanelShadows(gr) {
	// * SHADOWS FOR ALBUM ART, noAlbumArtStub AND DETAILS * //
	if (fb.IsPlaying && (albumArt && albumArtScaled || noAlbumArtStub) && !displayPlaylistLibrary() &&
		(pref.layout === 'default' && !displayPlaylist && !displayLibrary && !displayBiography ||
		 pref.layout === 'default' && !displayBiography && (pref.playlistLayout !== 'full' && displayPlaylist || pref.libraryLayout === 'normal' && displayLibrary) ||
		 pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography)) {

		const displayDetails = (pref.layout === 'artwork' ? !displayPlaylistArtworkLayout : !displayPlaylist) && !displayLibrary && !displayBiography && pref.noDiscArtBg && (!discArt || !pref.displayDiscArt);
		const noDefaultLayout = pref.layout !== 'default';
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);

		// Top shadow
		gr.FillGradRect(0, ppt.albumArtShow && pref.libraryLayout === 'full' && displayLibrary ? ui.y - (is_4k ? 10 : 6) : albumArtSize.y - (is_4k ? 10 : 6),
			displayDetails || noDefaultLayout ? ww : albumArtSize.x + albumArtSize.w, is_4k ? 10 : 6, 90, 0, col.shadow);

		if (displayDetails && !pref.noDiscArtBg && !noAlbumArtStub) {
			// Middle shadow
			gr.FillGradRect(noAlbumArtStub ? ww * 0.5 - 4 : albumArtSize.x + albumArtSize.w, noAlbumArtStub ? geo.topMenuHeight : albumArtSize.y - 3, 4, noAlbumArtStub ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h + 5, 0.5,
				noAlbumArtStub ? 0 : pref.styleBlackAndWhite ? RGB(0, 0, 0) : col.shadow, noAlbumArtStub ? pref.styleBlackAndWhite ? RGB(0, 0, 0) : col.shadow : 0);
		}
		// Bottom shadow
		gr.FillGradRect(0, ppt.albumArtShow && pref.libraryLayout === 'full' && displayLibrary ? ui.y + ui.h + (is_4k ? 0 : -1) : albumArtSize.y + albumArtSize.h + (is_4k ? 0 : -1),
			displayDetails || noDefaultLayout ? ww : albumArtSize.x + albumArtSize.w, scaleForDisplay(5), 90, col.shadow, 0);
	}

	// * SHADOWS FOR ALL PANELS * //
	if (displayPlaylist && pref.layout !== 'artwork' || displayPlaylistArtworkLayout || displayLibrary || displayBiography || displayCustomThemeMenu && !fb.IsPlaying) {

		const normalLayout = pref.layout === 'default' && (pref.playlistLayout === 'normal' && displayPlaylist && !displayBiography || pref.libraryLayout === 'normal' && displayLibrary || pref.biographyLayout === 'normal' && displayBiography || displayPlaylistLibrary());
		const x = displayPlaylistLibrary() || displayBiography || displayCustomThemeMenu && !fb.IsPlaying || pref.layout !== 'default' || !normalLayout ? 0 : ww * 0.5;
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);

		// Top shadow
		gr.FillGradRect(x, geo.topMenuHeight - (is_4k ? 10 : 6), ww, is_4k ? 10 : 6, 90, 0, col.shadow);

		if (normalLayout) {
			// Middle shadow for playlist
			gr.FillGradRect(ww * 0.5 - 4, geo.topMenuHeight, 4, wh - geo.topMenuHeight - geo.lowerBarHeight, 0.5, 0,
				pref.styleBlackAndWhite && noAlbumArtStub ? RGB(0, 0, 0) : pref.styleBlackAndWhite2 || pref.styleRebornBlack ? RGBA(0, 0, 0, 30) : col.shadow);
			// Middle shadow for album art
			if (albumArt && albumArtSize.w !== ww * 0.5 && !displayBiography && !noAlbumArtStub) {
				gr.FillGradRect(albumArtSize.x + albumArtSize.w, albumArtSize.y, 4, albumArtSize.h, 0.5, pref.styleBlackAndWhite ? RGB(0, 0, 0) : col.shadow, 0);
			}
		}
		// Bottom shadow
		gr.FillGradRect(x, wh - geo.lowerBarHeight + (is_4k ? 0 : -1), ww, scaleForDisplay(5), 90, col.shadow, 0);
	}
}


/** Draws the top menu */
function drawMenuBar(gr) {
	const drawMenuBar = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> menu bar') : null;

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

	timings.showExtraDrawTiming && drawMenuBar.Print();
}


/** Draws the lower bar */
function drawLowerBar(gr) {
	const drawLowerBarProfiler     = timings.showExtraDrawTiming ? fb.CreateProfiler('on_paint -> lower bar') : null;
	const lowerBarTop              = wh - geo.lowerBarHeight + (pref.layout === 'default' ? (is_4k ? 65 : 35) : (is_4k ? 33 : 18));
	const lowerMargin              = scaleForDisplay(pref.layout === 'compact' || pref.layout === 'artwork' ? 80 : pref.showTransportControls_default ? 80 : 120);
	const lowerBarFontSize         = pref.layout === 'compact' ? pref.lowerBarFontSize_compact        : pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork        : pref.lowerBarFontSize_default;
	const showLowerBarArtist       = pref.layout === 'compact' ? pref.showLowerBarArtist_compact      : pref.layout === 'artwork' ? pref.showLowerBarArtist_artwork      : pref.showLowerBarArtist_default;
	const showLowerBarTrackNum     = pref.layout === 'compact' ? pref.showLowerBarTrackNum_compact    : pref.layout === 'artwork' ? pref.showLowerBarTrackNum_artwork    : pref.showLowerBarTrackNum_default;
	const showLowerBarTitle        = pref.layout === 'compact' ? pref.showLowerBarTitle_compact       : pref.layout === 'artwork' ? pref.showLowerBarTitle_artwork       : pref.showLowerBarTitle_default;
	const showLowerBarComposer     = pref.layout === 'compact' ? pref.showLowerBarComposer_compact    : pref.layout === 'artwork' ? pref.showLowerBarComposer_artwork    : pref.showLowerBarComposer_default;
	const showLowerBarArtistFlags  = pref.layout === 'compact' ? pref.showLowerBarArtistFlags_compact : pref.layout === 'artwork' ? pref.showLowerBarArtistFlags_artwork : pref.showLowerBarArtistFlags_default;
	const showLowerBarPlaybackTime = pref.layout === 'compact' ? pref.showPlaybackTime_compact        : pref.layout === 'artwork' ? pref.showPlaybackTime_artwork        : pref.showPlaybackTime_default;
	const showProgressBar          = pref.layout === 'compact' ? pref.showProgressBar_compact         : pref.layout === 'artwork' ? pref.showProgressBar_artwork         : pref.showProgressBar_default;
	const showWaveformBar          = pref.layout === 'compact' ? pref.showWaveformBar_compact         : pref.layout === 'artwork' ? pref.showWaveformBar_artwork         : pref.showWaveformBar_default;
	const showPeakmeterBar         = pref.layout === 'compact' ? pref.showPeakmeterBar_compact        : pref.layout === 'artwork' ? pref.showPeakmeterBar_artwork        : pref.showPeakmeterBar_default;
	const flagSize =
	flagImgs.length >=  6 ? scaleForDisplay(84 + lowerBarFontSize * 6) :
	flagImgs.length === 5 ? scaleForDisplay(70 + lowerBarFontSize * 5) :
	flagImgs.length === 4 ? scaleForDisplay(56 + lowerBarFontSize * 4) :
	flagImgs.length === 3 ? scaleForDisplay(42 + lowerBarFontSize * 3) :
	flagImgs.length === 2 ? scaleForDisplay(28 + lowerBarFontSize * 2) :
	flagImgs.length === 1 ? scaleForDisplay(14 + lowerBarFontSize) : '';
	const availableFlags = showLowerBarArtistFlags && flagImgs.length ? flagSize : 0;

	// * Calculate all transport buttons width
	const showPlaybackOrderBtn = pref.layout === 'compact' ? pref.showPlaybackOrderBtn_compact   : pref.layout === 'artwork' ? pref.showPlaybackOrderBtn_artwork   : pref.showPlaybackOrderBtn_default;
	const showReloadBtn        = pref.layout === 'compact' ? pref.showReloadBtn_compact          : pref.layout === 'artwork' ? pref.showReloadBtn_artwork          : pref.showReloadBtn_default;
	const showVolumeBtn        = pref.layout === 'compact' ? pref.showVolumeBtn_compact          : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork          : pref.showVolumeBtn_default;
	const transportBtnSize     = pref.layout === 'compact' ? pref.transportButtonSize_compact    : pref.layout === 'artwork' ? pref.transportButtonSize_artwork    : pref.transportButtonSize_default;
	const transportBtnSpacing  = pref.layout === 'compact' ? pref.transportButtonSpacing_compact : pref.layout === 'artwork' ? pref.transportButtonSpacing_artwork : pref.transportButtonSpacing_default;
	const buttonSize           = scaleForDisplay(transportBtnSize);
	const buttonSpacing        = scaleForDisplay(transportBtnSpacing);
	const buttonCount          = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

	// * Setup time area width
	const timeAreaWidth = ww > 400 ? str.disc !== '' && pref.layout === 'default' ? gr.CalcTextWidth(`${str.disc}   ${str.time}   ${str.length}`, ft.lower_bar_title) : gr.CalcTextWidth(` ${str.time}   ${str.length}`, ft.lower_bar_title) : 0;

	// * Setup width for artist and song title
	const playbackTime   = pref.layout === 'compact' ? pref.showPlaybackTime_compact : pref.showPlaybackTime_artwork;
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
	const lineCorrection    = scaleForDisplay(pref.customThemeFonts ? is_4k ? 0 : 4 : is_4k ? 0 : 2);

	// * Adjustments
	const flagWidth          = showLowerBarArtistFlags && flagImgs.length && str.tracknum < 100 ? scaleForDisplay(14) + scaleForDisplay(lowerBarFontSize) : trackNumWidth + scaleForDisplay(6);
	const heightAdjustment   = pref.customThemeFonts ? 0 : ((lowerBarFontSize === 12 || lowerBarFontSize === 14) && !is_4k || (lowerBarFontSize === 16 || lowerBarFontSize === 18 || lowerBarFontSize === 20 || lowerBarFontSize === 22) && is_4k) ? 1 : 0;
	const trackNumAdjustment = gr.MeasureString('\u2013', ft.lower_bar_title, 0, 0, 0, 0).Width;
	const titleAdjustment    = gr.MeasureString(pref.customThemeFonts ? '\u2013.' : 'M', ft.lower_bar_title, 0, 0, 0, 0).Width;
	const titleAdjustment2   = gr.MeasureString('-', ft.lower_bar_title, 0, 0, 0, 0).Width;

	// * Setup artist, track number and title
	const artist = showLowerBarArtist ? str.artist : '';
	const artistX =	twoLines ? progressBar.x + availableFlags :	Math.round(progressBar.x + availableFlags - (pref.layout === 'default' ? scaleForDisplay(1) : 0));

	const artistY =	twoLines ? Math.round(lowerBarTop - lineCorrection - artistHeight + (pref.customThemeFonts ? artistHeight * 0.125 : 0) + (lowerBarFontSize < 18 ? scaleForDisplay(-2) : lowerBarFontSize > 18 ? scaleForDisplay(is_QHD ? 1 : 3) : 0)) :
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
	gr.SetTextRenderingHint(!is_4k && lowerBarFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);

	// * Artist, tracknum, title
	if (oneLine || twoLines && pref.layout === 'default') gr.DrawString(artist, ft.lower_bar_artist, col.lowerBarArtist, artistX, artistY, availableWidth, artistHeight, g_string_format.trim_ellipsis_char);
	gr.DrawString(trackNum, ft.lower_bar_title, col.lowerBarTitle, trackNumX, trackNumY, trackNumWidth - timeAreaWidth, titleHeight, StringFormat(0, 0, 4, 0x00001000));
	gr.DrawString(title, ft.lower_bar_title, col.lowerBarTitle, titleX, titleY, fb.IsPlaying ? availableWidth + (twoLines ? availableFlags : 0) : ww, titleHeight, g_string_format.trim_ellipsis_char);

	// * Artist flags
	if (showLowerBarArtist && showLowerBarArtistFlags && (pref.layout === 'default' || pref.layout !== 'default' && !twoLines)) {
		const marginLeft = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		let flagsLeft = marginLeft - (is_4k ? 1 : 0);
		for (let i = 0; i < flagImgs.length; i++) {
			gr.DrawImage(flagImgs[i], flagsLeft, Math.round(artistY - (flagImgs[i].Height / (artistHeight + scaleForDisplay(2))) - (is_4k ? 1 : 0)), flagImgs[i].Width + scaleForDisplay(lowerBarFontSize) - scaleForDisplay(26), artistHeight + scaleForDisplay(2), 0, 0, flagImgs[i].Width, flagImgs[i].Height);
			flagsLeft += flagImgs[i].Width - scaleForDisplay(18) + scaleForDisplay(lowerBarFontSize);
			if (i > 4) break; // Maximum 6 flags
		}
	}

	// * Playback time, length, disc number
	if (ww > 400) {
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		let width = gr.CalcTextWidth(`  ${str.length}`, ft.lower_bar_length);
		const lowerBarVersionW = gr.CalcTextWidth(`  ${str.time}`, ft.lower_bar_length);
		const lowerBarVersionH = titleMeasurements.Height;
		const lowerBarVersionX = ww - scaleForDisplay(pref.layout !== 'default' ? 20 : 40) - lowerBarVersionW;
		const lowerBarVersionY = Math.round(lowerBarTop - lineCorrection - heightAdjustment);
		const lowerBarLengthX = ww - scaleForDisplay(pref.layout !== 'default' ? 20 : 40) - width;
		const lowerBarLengthY = lowerBarVersionY;
		const lowerBarLengthW = width;
		const lowerBarLengthH = lowerBarVersionH;
		lowerBarTimeX = ww - scaleForDisplay(pref.layout !== 'default' ? 20 : 40) - (isStreaming ? width : width * 2);
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
				updateHyperlink.set_xOffset(ww - offset - scaleForDisplay(pref.layout !== 'default' ? 20 : 40));
				updateHyperlink.draw(gr, col.lowerBarTitle);
			}
			if (showLowerBarPlaybackTime) {
				gr.DrawString(str.time, ft.lower_bar_length, col.lowerBarTitle, lowerBarVersionX - offset, lowerBarVersionY, lowerBarVersionW, lowerBarVersionH, StringFormat(2, 0));
			}
		}
		if (showLowerBarPlaybackTime && fb.IsPlaying) { // * Switch to playback time remaining
			btns.playbackTime = new Button(ww - timeAreaWidth - scaleForDisplay(pref.layout !== 'default' ? 20 : 40), lowerBarTimeY,
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


/** Draws activated styled tooltips, will make standard tooltips fancy */
function drawStyledTooltips(gr) {
	if (styledTooltipReady && pref.showStyledTooltips) {
		const tooltipFontSize = pref.layout === 'artwork' ? pref.tooltipFontSize_artwork : pref.tooltipFontSize_default;
		const offset = scaleForDisplay(30);
		const padding = scaleForDisplay(15);
		const edgeSpace = padding * 0.5;
		const arc = scaleForDisplay(6);
		const w = Math.min(gr.MeasureString(styledTooltipText, ft.tooltip, 0, 0, 0, 0).Width + padding, ww - (state.mouse_x > ww * 0.85 ? state.mouse_x - ww * 0.15 : state.mouse_x) - edgeSpace);
		const h = Math.min(gr.MeasureString(styledTooltipText, ft.tooltip, 0, 0, w, wh).Height + padding, wh - (state.mouse_y > wh * 0.85 ? state.mouse_y - wh * 0.15 : state.mouse_y) - edgeSpace - offset);
		const x = state.mouse_x > ww * 0.85 ? state.mouse_x - w : state.mouse_x; // * When tooltip is too close to the right edge, it will be drawn on the left side of the mouse cursor
		const y = state.mouse_y > wh * 0.85 ? state.mouse_y - h : state.mouse_y + offset; // * When tooltip is too close to the bottom edge, it will be drawn on the top side of the mouse cursor
		const throttleRepaintRect = _throttle((x, y, w, h, force = false) => window.RepaintRect(x, y, w, h, force), 50);

		if (styledTooltipText !== '') { // * Just in case, arc value can't be null
			// * Apply better anti-aliasing on smaller font sizes in HD res
			gr.SetTextRenderingHint(!is_4k && tooltipFontSize < 18 ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
			gr.FillRoundRect(x, y, w, h, arc, arc, RGBtoRGBA(col.popupBg, 220));
			gr.DrawRoundRect(x, y, w, h, arc, arc, scaleForDisplay(2), 0x64000000);
			gr.DrawString(styledTooltipText, ft.tooltip, col.popupText, x + padding * 0.5, y + padding * 0.5, w - padding, h - padding, StringFormat(0, 0, 4));
			throttleRepaintRect(x - offset * 0.5, y - offset * 0.5, w + offset, h + offset);
		}
	}
}


/** Draws red rectangles for debugging to show all painted areas in the panels */
function drawDebugRectAreas(gr) {
	if (repaintRects.length) {
		try {
			repaintRects.forEach(rect => gr.DrawRect(rect.x, rect.y, rect.w, rect.h, scaleForDisplay(2), RGBA(255, 0, 0, 200)));
			repaintRects = [];
		} catch (e) {}
	}
}


/** Draws startup background to delay until everything in the theme is loaded */
function drawStartupBackground(gr) {
	// * PSEUDO DELAY BACKGROUND LOGO MASK WHEN LOADING THE THEME, OTHERWISE IT WILL SHOW UGLY REPAINTS WHEN INITIALIZING SINCE SMP V1.6.1 * //
	if (fb.IsPlaying && !loadingThemeComplete) {
		gr.FillSolidRect(0, 0, ww, wh, col.loadingThemeBg);
		if (pref.showLogoOnStartup) drawLogo(gr);
	}
}


/////////////////////////////
// * MAIN USER INTERFACE * //
/////////////////////////////
/**
 * All main user interface parts put together in the right order
 * @param {GdiGraphics} gr
 */
function drawMain(gr) {
	drawBackgrounds(gr);

	// * UIHacks aero glass shadow frame fix - needed for style Blend in Details
	if (UIHacks.Aero.Effect === 2) gr.DrawLine(0, 0, ww, 0, 1, col.bg);

	// * Style Blend applied in Details
	if (pref.styleBlend && albumArt && blendedImg && (!displayPlaylist && !displayLibrary && !displayBiography && pref.layout === 'default' ||
		!displayPlaylistArtworkLayout && !displayLibrary && pref.layout === 'artwork')) {
		gr.DrawImage(blendedImg, 0, 0, ww, wh, 0, 0, blendedImg.Width, blendedImg.Height);
	}

	drawPanels(gr);
	drawJumpSearch(gr);
	drawAlbumArt(gr);
	drawPauseBtn(gr);
	drawDetailsMetadataGrid(gr);
	drawDetailsBandLogo(gr);
	drawDetailsLabelLogo(gr);
	drawLyrics(gr);
	drawStyles(gr);

	showThemePresetIndicator(gr);
	showThemeLogOverlay(gr);

	drawPanelShadows(gr);
	drawMenuBar(gr);
	drawLowerBar(gr);
	drawCustomThemeMenu(gr);
	drawMetadataGridMenu(gr);
	drawStyledTooltips(gr);
	drawDebugRectAreas(gr);
	drawStartupBackground(gr);

	// * UIHACKS AERO GLASS SHADOW FRAME FIX * //
	if (UIHacks.Aero.Effect === 2 && (!loadingThemeComplete && (pref.styleBlend || pref.styleBlend2)) || !pref.styleBlend && !pref.styleBlend2) {
		gr.DrawLine(0, 0, ww, 0, 1, loadingThemeComplete ? col.uiHacksFrame : pref.styleBlackReborn ? RGB(25, 25, 25) : pref.styleRebornBlack && fb.IsPlaying ? RGB(245, 245, 245) : col.bg);
		if (pref.styleDefault) gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, loadingThemeComplete ? col.uiHacksFrame : col.bg);
		else if (pref.styleGradient || pref.styleGradient2) {
			gr.DrawLine(0, 0, ww, 0, 1, col.bg);
			gr.FillGradRect(-0.5, 0, ww, 1, pref.styleGradient2 ? -200 : 0, pref.styleGradient2 ? 0 : col.styleGradient, pref.styleGradient2 ? col.styleGradient2 : 0, 0.5);
		}
	}

	// * LAYOUT HANDLER - USED TO FIX AND FORCE WINDOW SIZE WHEN CHANGING, E.G 4K MODE IN HD DISPLAY RES * //
	let hasNotified = false;
	if (!hasNotified) {
		// When on_paint is called all other panels are loaded and can receive notifications
		window.NotifyOthers('layout_state', layoutHandler.layout.state);
		hasNotified = true;
		// Dirty, dirty hack to adjust window size
		if (windowHandler.fixWindowSize()) {
			// Size has changed, waiting for on_size
			window.Repaint();
		}
	}

	// * DEBUG * //
	if (timings.showDrawTiming || timings.showExtraDrawTiming) {
		const start = new Date();
		const end = Date.now();
		console.log(`${start.getHours()}:${leftPad(start.getMinutes(), 2, '0')}:${leftPad(start.getSeconds(), 2, '0')}.${leftPad(start.getMilliseconds(), 3, '0')}: ` +
			`on_paint took ${end - start.getTime()}ms ${repaintRectCount > 1 ? `- ${repaintRectCount} repaintRect calls` : ''}`);
	}
	repaintRectCount = 0;
}


/**
 * Draw main user interface
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
