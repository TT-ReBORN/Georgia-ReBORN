/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Helpers                         * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    08-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////
// * FONTS * //
///////////////
/**
 * Creates and assigns playlist fonts.
 * If fonts already exist and `forceCreation` is not set to true, the function will not recreate the fonts.
 * @global
 * @param {boolean} [forceCreation] - Determines whether fonts should be forcibly recreated.
 */
function PlaylistCreateFonts(forceCreation = false) {
	if (!forceCreation && pl.font && Object.keys(pl.font).length > 0) {
		return; // Fonts already created and no forceful creation requested
	}

	const fontDefault    = grSet.customThemeFonts ? grCfg.customFont.fontDefault : 'Segoe UI';
	const fontRebornSymbols = 'Reborn-Symbols';
	const headerFontSize = grSet.playlistHeaderFontSize_layout;
	const rowFontSize    = grSet.playlistFontSize_layout;

	const titleNormalFont   = grSet.customThemeFonts ? grCfg.customFont.playlistTitleNormal   : 'Segoe UI';
	const titleSelectedFont = grSet.customThemeFonts ? grCfg.customFont.playlistTitleSelected : 'Segoe UI';
	const titlePlayingFont  = grSet.customThemeFonts ? grCfg.customFont.playlistTitlePlaying  : 'Segoe UI';

	const artistNormalFont         = grSet.customThemeFonts ? grCfg.customFont.playlistArtistNormal         : 'Segoe UI Semibold';
	const artistPlayingFont        = grSet.customThemeFonts ? grCfg.customFont.playlistArtistPlaying        : 'Segoe UI Semibold';
	const artistNormalCompactFont  = grSet.customThemeFonts ? grCfg.customFont.playlistArtistNormalCompact  : 'Segoe UI Semibold';
	const artistPlayingCompactFont = grSet.customThemeFonts ? grCfg.customFont.playlistArtistPlayingCompact : 'Segoe UI Semibold';

	const albumFont       = grSet.customThemeFonts ? grCfg.customFont.playlistAlbum       : 'Segoe UI Semibold';
	const dateFont        = grSet.customThemeFonts ? grCfg.customFont.playlistDate        : 'Segoe UI Semibold';
	const dateCompactFont = grSet.customThemeFonts ? grCfg.customFont.playlistDateCompact : 'Segoe UI Semibold';
	const infoFont        = grSet.customThemeFonts ? grCfg.customFont.playlistInfo        : 'Segoe UI';
	const coverFont       = grSet.customThemeFonts ? grCfg.customFont.playlistCover       : 'Segoe UI Semibold';

	const playcountFont = grSet.customThemeFonts ? grCfg.customFont.playlistPlaycount : 'Segoe UI';

	pl.font.title_normal   = Font(titleNormalFont, rowFontSize);
	pl.font.title_selected = Font(titleSelectedFont, rowFontSize);
	pl.font.title_playing  = Font(titlePlayingFont, rowFontSize);
	pl.font.playback_icon  = Font(fontRebornSymbols, rowFontSize + 1);

	pl.font.artist_normal          = Font(artistNormalFont, headerFontSize + 3, grSet.customThemeFonts ? FontStyle.Bold : 0);
	pl.font.artist_playing         = Font(artistPlayingFont, headerFontSize + 3, grSet.customThemeFonts ? FontStyle.Bold : 0);
	pl.font.artist_normal_compact  = Font(artistNormalCompactFont, headerFontSize);
	pl.font.artist_playing_compact = Font(artistPlayingCompactFont, headerFontSize, FontStyle.Underline);

	pl.font.album          = Font(albumFont, headerFontSize);
	pl.font.date           = Font(dateFont, headerFontSize + 3);
	pl.font.date_compact   = Font(dateCompactFont, headerFontSize);
	pl.font.info           = Font(infoFont, rowFontSize - 1);
	pl.font.cover          = Font(coverFont, rowFontSize - 1);

	pl.font.playcount      = Font(playcountFont, rowFontSize - 3);
	pl.font.plr_track      = Font(playcountFont, rowFontSize - 3);
	pl.font.rating_not_set = Font(fontRebornSymbols, rowFontSize);
	pl.font.rating_set     = Font(fontRebornSymbols, rowFontSize + 2);
	pl.font.scrollbar      = Font(fontRebornSymbols, headerFontSize);
	pl.font.lock           = Font(fontRebornSymbols, rowFontSize + 2);
}


//////////////////
// * GEOMETRY * //
//////////////////
/**
 * Rescales the playlist based on the font size settings and creates playlist fonts if they haven't been created already.
 * @global
 * @param {boolean} [forceRescale] - Whether the playlist should be rescaled even if the playlist fonts have already been created.
 */
function PlaylistRescale(forceRescale = false) {
	PlaylistCreateFonts(forceRescale);
	plSet.row_h = Math.round(grSet.playlistFontSize_layout * 1.667);
	pl.geo.row_h = SCALE(plSet.row_h);
	pl.geo.scrollbar_w = plSet.scrollbar_w; // Don't use SCALE()
	pl.geo.scrollbar_right_pad = SCALE(plSet.scrollbar_right_pad);
	pl.geo.scrollbar_top_pad = SCALE(plSet.scrollbar_top_pad);
	pl.geo.scrollbar_bottom_pad = SCALE(plSet.scrollbar_bottom_pad);
	pl.geo.list_bottom_pad = SCALE(plSet.list_bottom_pad);
}


//////////////////
// * POSITION * //
//////////////////
/**
 * Sets and updates the playlist x-coordinate when resizing or changing the playlist layout.
 * @global
 * @returns {number} The playlist x-coordinate.
 */
function PlaylistSetX() {
	const noAlbumArtSize = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;

	if (grSet.panelWidthAuto && grm.ui.noAlbumArtStub) grm.ui.setNoAlbumArtSize();

	return grSet.layout === 'default' && (grSet.playlistLayout === 'normal' ||
		!grSet.savedPlaylistLayoutFull && (grm.ui.displayLibrarySplit() || grm.ui.displayBiography || grm.ui.displayLyrics)) ?
		grSet.panelWidthAuto ? grm.ui.displayLibrarySplit() ? noAlbumArtSize : !grm.ui.albumArt && !grm.ui.noAlbumArtStub ? 0 : grm.ui.albumArtSize.x + grm.ui.albumArtSize.w :
		grm.ui.ww * 0.5 :
	0;
}
