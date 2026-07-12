/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Color Themes                             * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    12-07-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////
// * COLOR THEMES * //
//////////////////////
/**
 * A class that provides the full collection of all theme colors and its methods.
 */
class ColorThemes {
	/**
	 * Creates the `ColorThemes` instance and initializes theme preferences.
	 */
	constructor() {
		grAlias.update();
	}

	// * PUBLIC METHODS - THEME BASE COLORS * //
	// #region PUBLIC METHODS - THEME BASE COLORS
	/**
	 * Maps playlist colors directly from the current theme's palette.
	 * This is the default state when nothing is playing or on playback stop.
	 */
	playlistBaseColors() {
		const theme = grm.colorPalette.getTheme(grSet.theme);

		// * MAIN COLORS * //
		pl.col.bg = theme.pl_col_bg;

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = theme.pl_col_plman_text_normal;
		pl.col.plman_text_hovered = theme.pl_col_plman_text_hovered;
		pl.col.plman_text_pressed = theme.pl_col_plman_text_pressed;

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = theme.pl_col_header_nowplaying_bg;
		pl.col.header_sideMarker = theme.pl_col_header_sideMarker;
		pl.col.header_artist_normal = theme.pl_col_header_artist_normal;
		pl.col.header_artist_playing = theme.pl_col_header_artist_playing;
		pl.col.header_album_normal = theme.pl_col_header_album_normal;
		pl.col.header_album_playing = theme.pl_col_header_album_playing;
		pl.col.header_info_normal = theme.pl_col_header_info_normal;
		pl.col.header_info_playing = theme.pl_col_header_info_playing;
		pl.col.header_date_normal = theme.pl_col_header_date_normal;
		pl.col.header_date_playing = theme.pl_col_header_date_playing;
		pl.col.header_line_normal = theme.pl_col_header_line_normal;
		pl.col.header_line_playing = theme.pl_col_header_line_playing;

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = theme.pl_col_row_nowplaying_bg;
		pl.col.row_stripes_bg = theme.pl_col_row_stripes_bg;
		pl.col.row_selection_bg = theme.pl_col_row_selection_bg;
		pl.col.row_selection_frame = theme.pl_col_row_selection_frame;
		pl.col.row_sideMarker = theme.pl_col_row_sideMarker;
		pl.col.row_title_normal = theme.pl_col_row_title_normal;
		pl.col.row_title_playing = theme.pl_col_row_title_playing;
		pl.col.row_title_selected = theme.pl_col_row_title_selected;
		pl.col.row_title_hovered = theme.pl_col_row_title_hovered;
		pl.col.row_rating_color = theme.pl_col_row_rating_color;
		pl.col.row_disc_subheader_line = theme.pl_col_row_disc_subheader_line;
		pl.col.row_drag_line = theme.pl_col_row_drag_line;
		pl.col.row_drag_line_reached = theme.pl_col_row_drag_line_reached;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = theme.pl_col_sbar_btn_normal;
		pl.col.sbar_btn_hovered = theme.pl_col_sbar_btn_hovered;
		pl.col.sbar_thumb_normal = theme.pl_col_sbar_thumb_normal;
		pl.col.sbar_thumb_hovered = theme.pl_col_sbar_thumb_hovered;
		pl.col.sbar_thumb_drag = theme.pl_col_sbar_thumb_drag;
	}

	/**
	 * Maps library colors directly from the current theme's palette.
	 * This is the default state when nothing is playing or on playback stop.
	 */
	libraryBaseColors() {
		const theme = grm.colorPalette.getTheme(grSet.theme);

		// * MAIN COLORS * //
		lib.ui.col.bg = theme.lib_ui_col_bg;
		lib.ui.col.rowStripes = theme.lib_ui_col_rowStripes;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = theme.lib_ui_col_nowPlayingBg;
		lib.ui.col.sideMarker = theme.lib_ui_col_sideMarker;
		lib.ui.col.selectionFrame = theme.lib_ui_col_selectionFrame;
		lib.ui.col.selectionFrame2 = theme.lib_ui_col_selectionFrame2;
		lib.ui.col.hoverFrame = theme.lib_ui_col_hoverFrame;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = theme.lib_ui_col_iconPlus;
		lib.ui.col.iconPlus_h = theme.lib_ui_col_iconPlus_h;
		lib.ui.col.iconPlus_sel = theme.lib_ui_col_iconPlus_sel;
		lib.ui.col.iconPlusBg = theme.lib_ui_col_iconPlusBg;
		lib.ui.col.iconMinus_e = theme.lib_ui_col_iconMinus_e;
		lib.ui.col.iconMinus_c = theme.lib_ui_col_iconMinus_c;
		lib.ui.col.iconMinus_h = theme.lib_ui_col_iconMinus_h;

		// * TEXT COLORS * //
		lib.ui.col.text = theme.lib_ui_col_text;
		lib.ui.col.text_h = theme.lib_ui_col_text_h;
		lib.ui.col.text_nowp = theme.lib_ui_col_text_nowp;
		lib.ui.col.textSel = theme.lib_ui_col_textSel;
		lib.ui.col.txt = theme.lib_ui_col_txt;
		lib.ui.col.txt_h = theme.lib_ui_col_txt_h;
		lib.ui.col.txt_box = theme.lib_ui_col_txt_box;
		lib.ui.col.count = theme.lib_ui_col_count;

		// * BUTTON COLORS * //
		lib.ui.col.search = theme.lib_ui_col_search;
		lib.ui.col.searchBtn = theme.lib_ui_col_searchBtn;
		lib.ui.col.crossBtn = theme.lib_ui_col_crossBtn;
		lib.ui.col.filterBtn = theme.lib_ui_col_filterBtn;
		lib.ui.col.settingsBtn = theme.lib_ui_col_settingsBtn;
		lib.ui.col.line = theme.lib_ui_col_line;
		lib.ui.col.s_line = theme.lib_ui_col_s_line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = theme.lib_ui_col_sbarBtns;
		lib.ui.col.sbarNormal = theme.lib_ui_col_sbarNormal;
		lib.ui.col.sbarHovered = theme.lib_ui_col_sbarHovered;
		lib.ui.col.sbarDrag = theme.lib_ui_col_sbarDrag;

		// * LIBRARY EXPLORER - COLUMN * //
		lib.ex.color.column_bg = theme.lib_ex_col_column_bg;
		lib.ex.color.column_line = theme.lib_ex_col_column_line;
		lib.ex.color.column_text_normal = theme.lib_ex_col_column_text_normal;
		lib.ex.color.column_text_hovered = theme.lib_ex_col_column_text_hovered;
		lib.ex.color.column_text_playing = theme.lib_ex_col_column_text_playing;
		lib.ex.color.column_text_selected = theme.lib_ex_col_column_text_selected;

		// * LIBRARY EXPLORER - GRID - ARTIST VIEW * //
		lib.ex.color.grid_playing_bg = theme.lib_ex_col_grid_playing_bg;
		lib.ex.color.grid_selection_bg = theme.lib_ex_col_grid_selection_bg;
		lib.ex.color.grid_selection_frame = theme.lib_ex_col_grid_selection_frame;
		lib.ex.color.grid_sideMarker = theme.lib_ex_col_grid_sideMarker;
		lib.ex.color.grid_title_normal = theme.lib_ex_col_grid_title_normal;
		lib.ex.color.grid_title_hovered = theme.lib_ex_col_grid_title_hovered;
		lib.ex.color.grid_title_playing = theme.lib_ex_col_grid_title_playing;
		lib.ex.color.grid_title_selected = theme.lib_ex_col_grid_title_selected;

		// * LIBRARY EXPLORER - TRACK ROWS - ALBUM VIEW * //
		lib.ex.color.row_stripes_bg = theme.lib_ex_col_row_stripes_bg;
		lib.ex.color.row_playing_bg = theme.lib_ex_col_row_playing_bg;
		lib.ex.color.row_selection_bg = theme.lib_ex_col_row_selection_bg;
		lib.ex.color.row_selection_frame = theme.lib_ex_col_row_selection_frame;
		lib.ex.color.row_sideMarker = theme.lib_ex_col_row_sideMarker;
		lib.ex.color.row_title_normal = theme.lib_ex_col_row_title_normal;
		lib.ex.color.row_title_hovered = theme.lib_ex_col_row_title_hovered;
		lib.ex.color.row_title_playing = theme.lib_ex_col_row_title_playing;
		lib.ex.color.row_title_selected = theme.lib_ex_col_row_title_selected;

		// * LIBRARY EXPLORER - RATING * //
		lib.ex.color.rating_star = theme.lib_ex_col_rating_star;
		lib.ex.color.rating_star_shadow = theme.lib_ex_col_rating_star_shadow;

		// * LIBRARY EXPLORER - SCROLLBAR * //
		lib.ex.color.sbar_normal = theme.lib_ex_col_sbar_normal;
		lib.ex.color.sbar_hovered = theme.lib_ex_col_sbar_hovered;
		lib.ex.color.sbar_drag = theme.lib_ex_col_sbar_drag;

		// * LIBRARY EXPLORER - BUTTONS * //
		lib.ex.color.closeBtn = theme.lib_ex_col_closeBtn;
		lib.ex.color.closeBtn_bg = theme.lib_ex_col_closeBtn_bg;
	}

	/**
	 * Maps biography colors directly from the current theme's palette.
	 * This is the default state when nothing is playing or on playback stop.
	 */
	biographyBaseColors() {
		const theme = grm.colorPalette.getTheme(grSet.theme);

		// * MAIN COLORS * //
		bio.ui.col.bg = theme.bio_ui_col_bg;
		bio.ui.col.rowStripes = theme.bio_ui_col_rowStripes;

		// * HEADER COLORS * //
		bio.ui.col.headingText = theme.bio_ui_col_headingText;
		bio.ui.col.bottomLine = theme.bio_ui_col_bottomLine;
		bio.ui.col.centerLine = theme.bio_ui_col_centerLine;
		bio.ui.col.sectionLine = theme.bio_ui_col_sectionLine;

		// * TEXT COLORS * //
		bio.ui.col.text = theme.bio_ui_col_text;
		bio.ui.col.source = theme.bio_ui_col_source;
		bio.ui.col.accent = theme.bio_ui_col_accent;
		bio.ui.col.summary = theme.bio_ui_col_summary;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = theme.bio_ui_col_popupBg;
		bio.ui.col.popupText = theme.bio_ui_col_popupText;

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = theme.bio_ui_col_lyricsNormal;
		bio.ui.col.lyricsHighlight = theme.bio_ui_col_lyricsHighlight;
		bio.ui.col.lyricsShadow = theme.bio_ui_col_lyricsShadow;
		bio.ui.col.noPhotoStubBg = theme.bio_ui_col_noPhotoStubBg;
		bio.ui.col.noPhotoStubText = theme.bio_ui_col_noPhotoStubText;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = theme.bio_ui_col_sbarBtns;
		bio.ui.col.sbarNormal = theme.bio_ui_col_sbarNormal;
		bio.ui.col.sbarHovered = theme.bio_ui_col_sbarHovered;
		bio.ui.col.sbarDrag = theme.bio_ui_col_sbarDrag;
	}

	/**
	 * Maps main colors directly from the current theme's palette.
	 * This is the default state when nothing is playing or on playback stop.
	 */
	mainBaseColors() {
		const theme = grm.colorPalette.getTheme(grSet.theme);

		// * MAIN COLORS * //
		grCol.bg = theme.grCol_bg;
		grCol.shadow = theme.grCol_shadow;
		grCol.discArtShadow = theme.grCol_discArtShadow;
		grCol.noAlbumArtStub = theme.grCol_noAlbumArtStub;
		grCol.lowerBarArtist = theme.grCol_lowerBarArtist;
		grCol.lowerBarTitle = theme.grCol_lowerBarTitle;
		grCol.lowerBarTime = theme.grCol_lowerBarTime;
		grCol.lowerBarLength = theme.grCol_lowerBarLength;
		grCol.lyricsNormal = theme.grCol_lyricsNormal;
		grCol.lyricsHighlight = theme.grCol_lyricsHighlight;
		grCol.lyricsShadow = theme.grCol_lyricsShadow;

		// * DETAILS * //
		grCol.detailsBg = theme.grCol_detailsBg;
		grCol.detailsText = theme.grCol_detailsText;
		grCol.detailsRating = theme.grCol_detailsRating;
		grCol.detailsHotness = theme.grCol_detailsHotness;
		grCol.timelineAdded = theme.grCol_timelineAdded;
		grCol.timelinePlayed = theme.grCol_timelinePlayed;
		grCol.timelineUnplayed = theme.grCol_timelineUnplayed;
		grCol.timelineFrame = theme.grCol_timelineFrame;

		// * POPUP COLORS * //
		grCol.popupBg = theme.grCol_popupBg;
		grCol.popupText = theme.grCol_popupText;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor = theme.grCol_menuBgColor;
		grCol.menuStyleBg = theme.grCol_menuStyleBg;
		grCol.menuRectStyleEmbossTop = theme.grCol_menuRectStyleEmbossTop;
		grCol.menuRectStyleEmbossBottom = theme.grCol_menuRectStyleEmbossBottom;
		grCol.menuRectNormal = theme.grCol_menuRectNormal;
		grCol.menuRectHovered = theme.grCol_menuRectHovered;
		grCol.menuRectDown = theme.grCol_menuRectDown;
		grCol.menuTextNormal = theme.grCol_menuTextNormal;
		grCol.menuTextHovered = theme.grCol_menuTextHovered;
		grCol.menuTextDown = theme.grCol_menuTextDown;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = theme.grCol_transportEllipseBg;
		grCol.transportEllipseNormal = theme.grCol_transportEllipseNormal;
		grCol.transportEllipseHovered = theme.grCol_transportEllipseHovered;
		grCol.transportEllipseDown = theme.grCol_transportEllipseDown;
		grCol.transportStyleBg = theme.grCol_transportStyleBg;
		grCol.transportStyleTop = theme.grCol_transportStyleTop;
		grCol.transportStyleBottom = theme.grCol_transportStyleBottom;
		grCol.transportIconNormal = theme.grCol_transportIconNormal;
		grCol.transportIconHovered = theme.grCol_transportIconHovered;
		grCol.transportIconDown = theme.grCol_transportIconDown;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = theme.grCol_progressBar;
		grCol.progressBarStreaming = theme.grCol_progressBarStreaming;
		grCol.progressBarFrame = theme.grCol_progressBarFrame;
		grCol.progressBarFill = theme.grCol_progressBarFill;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg = theme.grCol_peakmeterBarProg;
		grCol.peakmeterBarProgFill = theme.grCol_peakmeterBarProgFill;
		grCol.peakmeterBarFillTop = theme.grCol_peakmeterBarFillTop;
		grCol.peakmeterBarFillMiddle = theme.grCol_peakmeterBarFillMiddle;
		grCol.peakmeterBarFillBack = theme.grCol_peakmeterBarFillBack;
		grCol.peakmeterBarVertProgFill = theme.grCol_peakmeterBarVertProgFill;
		grCol.peakmeterBarVertFill = theme.grCol_peakmeterBarVertFill;
		grCol.peakmeterBarVertFillPeaks = theme.grCol_peakmeterBarVertFillPeaks;

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront = theme.grCol_waveformBarFillFront;
		grCol.waveformBarFillBack = theme.grCol_waveformBarFillBack;
		grCol.waveformBarFillPreFront = theme.grCol_waveformBarFillPreFront;
		grCol.waveformBarFillPreBack = theme.grCol_waveformBarFillPreBack;
		grCol.waveformBarIndicator = theme.grCol_waveformBarIndicator;

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = theme.grCol_volumeBar;
		grCol.volumeBarFrame = theme.grCol_volumeBarFrame;
		grCol.volumeBarFill = theme.grCol_volumeBarFill;

		// * STYLE COLORS * //
		grCol.styleBevel = theme.grCol_styleBevel;
		grCol.styleGradient = theme.grCol_styleGradient;
		grCol.styleGradient2 = theme.grCol_styleGradient2;
		grCol.styleAlternative = theme.grCol_styleAlternative;
		grCol.styleProgressBar = theme.grCol_styleProgressBar;
		grCol.styleProgressBarLineTop = theme.grCol_styleProgressBarLineTop;
		grCol.styleProgressBarLineBottom = theme.grCol_styleProgressBarLineBottom;
		grCol.styleProgressBarFill = theme.grCol_styleProgressBarFill;
		grCol.styleVolumeBar = theme.grCol_styleVolumeBar;
		grCol.styleVolumeBarFill = theme.grCol_styleVolumeBarFill;
	}
	// #endregion

	// * PRIVATE METHODS - THEME COLOR ADJUSTMENT HELPERS * //
	// #region PRIVATE METHODS - THEME COLOR ADJUSTMENT HELPERS
	/**
	 * Creates shared theme context variables used across all color adjustment methods.
	 * @param {string} [panel='main'] - The panel context: 'main', 'playlist', 'details', 'library', 'biography'.
	 * @returns {{ primary, colLuminance, ctx, isBWMode, isWhiteOrBlack, staticTheme, theme }}
	 */
	_createThemeContext(panel = 'main') {
		const { primary, secondary, colLuminance, imgLuminance } = grCol;
		const { THEME, BEVEL, BLEND, BLEND2, BW, BW2, BWR, RW, RB, TMB, TPB, PB, VB } = grAlias;

		const lightBg = {
			main: grCol.lightBgMain,
			details: grCol.lightBgDetails,
			playlist: grCol.lightBgPlaylist,
			library: grCol.lightBgLibrary,
			biography: grCol.lightBgBiography
		};

		let isLightBg = lightBg[panel];

		if (panel === 'main') {
			if (RW) isLightBg = true;
			else if (RB) isLightBg = false;
		}

		const isBWMode = BW || BW2 || BWR;
		const isWhiteOrBlack = ['white', 'black'].includes(THEME) || isBWMode;
		const staticTheme = !['white', 'black', 'reborn', 'random'].includes(THEME) || isBWMode;
		const theme = grm.colorPalette.getTheme(THEME);

		const ctx = {
			bevel: BEVEL,
			blend: BLEND,
			blend2: BLEND2,
			menuStyle: TMB,
			menuBevelOrInner: grSet.theme !== 'white' && !RW && (TMB === 'bevel' || TMB === 'inner'),
			progressBarStyle: PB,
			transportStyle: TPB,
			volumeBarStyle: VB,
			rebornBlack: panel === 'main' ? RB : false,
			imgLuminance,
			saturation: primary ? new Color(primary).saturation / 100 : 0,
			isLightBg
		};

		return { primary, secondary, colLuminance, ctx, isBWMode, isWhiteOrBlack, staticTheme, theme };
	}

	/**
	 * Creates a getColor resolver bound to specific theme/bg state.
	 * @param {number} primary - The primary color value.
	 * @param {number} bgLum - The background luminance for this panel.
	 * @param {boolean} staticTheme - Whether the theme is static.
	 * @param {boolean} isWhiteOrBlack - Whether theme is white/black.
	 * @param {object} ctx - The color context from _createColorContext.
	 * @returns {Function} getColor(themeColor, role, colorspace?, usePrimary?, options?) => color.
	 */
	_getColor(primary, bgLum, staticTheme, isWhiteOrBlack, ctx) {
		return (themeColor, role, colorspace = 'rgb', usePrimary = false, options = ctx, useColorSystem = false) => {
			if (staticTheme && !useColorSystem) return themeColor;
			if ((isWhiteOrBlack || options.forceWB) && !useColorSystem) return usePrimary ? primary : themeColor;
			return grm.colorSystem.applyColor(staticTheme ? themeColor : primary, bgLum, colorspace, role, options);
		};
	}

	/**
	 * Creates a getStaticColor resolver for contrast-aware static theme colors.
	 * @param {object} theme - The current theme palette
	 * @param {boolean} staticTheme - Whether the theme is static.
	 * @param {boolean} isWhiteOrBlack - Whether theme is white/black.
	 * @param {boolean} [lightBg] - Whether background is light.
	 * @returns {Function} getStaticColor(propName) => color | null.
	 */
	_getStaticColor(theme, staticTheme, isWhiteOrBlack, lightBg = grCol.lightBgPrimary) {
		return (propName, forceDark) => {
			if (!staticTheme && !isWhiteOrBlack) return null;
			return theme[`${propName}${lightBg || forceDark ? '_dark' : '_light'}`];
		};
	}
	// #endregion

	// * PUBLIC METHODS - THEME COLOR ADJUSTMENTS * //
	// #region PUBLIC METHODS - THEME COLOR ADJUSTMENTS
	/**
	 * Adjusts all playlist colors when playback starts.
	 */
	playlistColorsAdjustments() {
		if (!fb.IsPlaying && !grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.albumArt) {
			this.playlistBaseColors();
			return;
		}

		const { primary, ctx, isWhiteOrBlack, staticTheme, theme } = this._createThemeContext('playlist');

		const rebornRandomBg = ['reborn', 'random'].includes(grSet.theme) && (
			grSet.layout !== 'default' ? grCol.primary_rgb_t002 : primary
		);

		// * MAIN COLORS * //
		pl.col.bg = rebornRandomBg || theme.pl_col_bg;

		const getColor = this._getColor(primary, Color.LUM(pl.col.bg), staticTheme, isWhiteOrBlack, ctx);
		const getStaticColor = this._getStaticColor(theme, staticTheme, isWhiteOrBlack);
		const forceBlackText = grSet.theme === 'white' && grSet.layout === 'default';

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = getColor(theme.pl_col_plman_text_normal, 'text.muted');
		pl.col.plman_text_hovered = getColor(theme.pl_col_plman_text_hovered, 'text.active');
		pl.col.plman_text_pressed = pl.col.plman_text_hovered;

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = getColor(theme.pl_col_header_nowplaying_bg, 'nowPlaying.bg', 'oklch', true);
		pl.col.header_sideMarker = getColor(theme.pl_col_header_sideMarker, 'sidemarker', 'rgb', true);
		pl.col.header_artist_normal = getColor(theme.pl_col_header_artist_normal, 'text.muted');
		pl.col.header_artist_playing = getStaticColor('pl_col_header_artist_playing', forceBlackText) || getColor(theme.pl_col_header_artist_playing, 'text.active');
		pl.col.header_album_normal = getColor(theme.pl_col_header_album_normal, 'text.muted');
		pl.col.header_album_playing = getStaticColor('pl_col_header_artist_playing', forceBlackText) || getColor(theme.pl_col_header_album_playing, 'text.active');
		pl.col.header_info_normal = getColor(theme.pl_col_header_info_normal, 'text.muted');
		pl.col.header_info_playing = getStaticColor('pl_col_header_artist_playing', forceBlackText) || getColor(theme.pl_col_header_info_playing, 'text.active');
		pl.col.header_date_normal = getColor(theme.pl_col_header_date_normal, 'text.muted');
		pl.col.header_date_playing = getStaticColor('pl_col_header_artist_playing', forceBlackText) || getColor(theme.pl_col_header_date_playing, 'text.active');
		pl.col.header_line_normal = getColor(theme.pl_col_header_line_normal, 'line.normal', 'oklch');
		pl.col.header_line_playing = getColor(theme.pl_col_header_line_playing, 'line.playing', 'oklch');

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = getColor(theme.pl_col_row_nowplaying_bg, 'nowPlaying.bg', 'oklch', true);
		pl.col.row_stripes_bg = getColor(theme.pl_col_row_stripes_bg, 'row.stripes', 'oklch');
		pl.col.row_selection_bg = getColor(theme.pl_col_row_selection_bg, 'row.selectionBg', 'oklch');
		pl.col.row_selection_frame = pl.col.header_line_normal;
		pl.col.row_sideMarker = getColor(theme.pl_col_row_sideMarker, 'sidemarker', 'rgb', true);
		pl.col.row_title_normal = getColor(theme.pl_col_row_title_normal, 'text.normal');
		pl.col.row_title_playing = getStaticColor('pl_col_row_title_playing') || getColor(theme.pl_col_row_title_playing, 'text.active');
		pl.col.row_title_selected = getColor(theme.pl_col_row_title_selected, 'text.active');
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = theme.pl_col_row_rating_color;
		pl.col.row_disc_subheader_line = pl.col.header_line_normal;
		pl.col.row_drag_line = pl.col.row_sideMarker;
		pl.col.row_drag_line_reached = getColor(theme.pl_col_row_drag_line_reached, 'sidemarker', 'oklch', false, { bevel: false });

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = getColor(theme.pl_col_sbar_btn_normal, 'scrollbar.button');
		pl.col.sbar_btn_hovered = getColor(theme.pl_col_sbar_btn_hovered, 'scrollbar.buttonHovered');
		pl.col.sbar_thumb_normal = getColor(theme.pl_col_sbar_thumb_normal, 'scrollbar.thumb', 'oklch');
		pl.col.sbar_thumb_hovered = getColor(theme.pl_col_sbar_thumb_hovered, 'scrollbar.thumbHovered');
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * Adjusts all library colors when playback starts.
	 */
	libraryColorsAdjustments() {
		if (!fb.IsPlaying && !grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.albumArt) {
			this.libraryBaseColors();
			return;
		}

		const { primary, ctx, isWhiteOrBlack, staticTheme, theme } = this._createThemeContext('library');
		const getColor = this._getColor(primary, Color.LUM(pl.col.bg), staticTheme, isWhiteOrBlack, ctx);

		// * MAIN COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = getColor(theme.lib_ui_col_rowStripes, 'row.stripes', 'oklch');
		lib.ui.col.nowPlayingBg = getColor(theme.lib_ui_col_nowPlayingBg, 'nowPlaying.bg', 'oklch', true, libSet.albumArtShow ? { ...ctx, blend: true } : ctx);
		lib.ui.col.sideMarker = pl.col.header_sideMarker;
		lib.ui.col.selectionFrame = pl.col.header_line_normal;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = getColor(theme.lib_ui_col_iconPlus, 'node.plus');
		lib.ui.col.iconPlus_h = getColor(theme.lib_ui_col_iconPlus_h, 'node.plus');
		lib.ui.col.iconPlus_sel = getColor(theme.lib_ui_col_iconPlus_sel, 'node.plus');
		lib.ui.col.iconPlusBg = getColor(theme.lib_ui_col_iconPlusBg, 'node.plusBg');
		lib.ui.col.iconMinus_e = getColor(theme.lib_ui_col_iconMinus_e, 'node.minus');
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = lib.ui.col.iconMinus_e;

		// * TEXT COLORS * //
		const textCtx = grm.ui.noAlbumArtStub && libSet.albumArtShow && libImg.labels.overlayDark ? { ...ctx, blend: false } : ctx;
		lib.ui.col.text = getColor(theme.lib_ui_col_text, 'text.normal', 'rgb', false, textCtx);
		lib.ui.col.text_h = getColor(theme.lib_ui_col_text_h, 'text.active', 'rgb', false, textCtx);
		lib.ui.col.text_nowp = (staticTheme || isWhiteOrBlack) ? grm.colorSystem.getTextColor(lib.ui.col.nowPlayingBg, RGB(255, 255, 255), RGB(0, 0, 0)).color : lib.ui.col.text_h;
		lib.ui.col.textSel = (staticTheme || isWhiteOrBlack && (!lib.panel.imgView && grSet.libraryDesign !== 'traditional')) ? theme.lib_ui_col_textSel : lib.ui.col.text_nowp;
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = getColor(theme.lib_ui_col_txt_box, 'text.muted');
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = lib.ui.col.txt_box;

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = lib.ui.col.search;
		lib.ui.col.crossBtn = lib.ui.col.searchBtn;
		lib.ui.col.filterBtn = lib.ui.col.searchBtn;
		lib.ui.col.settingsBtn = lib.ui.col.searchBtn;
		lib.ui.col.line = pl.col.header_line_normal;
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = pl.col.sbar_btn_normal;
		lib.ui.col.sbarNormal = pl.col.sbar_thumb_normal;
		lib.ui.col.sbarHovered = pl.col.sbar_thumb_hovered;
		lib.ui.col.sbarDrag = lib.ui.col.sbarHovered;

		// * LIBRARY EXPLORER COLORS * //
		lib.ex.color.setColors();
	}

	/**
	 * Adjusts all biography colors when playback starts.
	 */
	biographyColorsAdjustments() {
		if (!fb.IsPlaying && !grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.albumArt) {
			this.biographyBaseColors();
			return;
		}

		const { primary, ctx, isWhiteOrBlack, staticTheme, theme } = this._createThemeContext('biography');
		const { THEME, BW, BW2, BWR } = grAlias;
		const getColor = this._getColor(primary, Color.LUM(pl.col.bg), staticTheme, isWhiteOrBlack, ctx);

		// * MAIN COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = getColor(theme.bio_ui_col_rowStripes, 'row.stripes', 'oklch');

		// * HEADER COLORS * //
		bio.ui.col.headingText = getColor(theme.bio_ui_col_headingText, 'text.heading');
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = getColor(theme.bio_ui_col_text, 'text.normal');
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBtoRGBA(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = THEME === 'white' && (!BW && !BW2 && !BWR) ? pl.col.row_title_playing : pl.col.header_artist_playing;

		// * MISC COLORS * //
		const lyricsRefLum = Color.LUM(pl.col.bg);
		const lyricsColors = grm.colorManager.getLyricsColors(primary, ctx.isLightBg, staticTheme, theme.bio_ui_col_lyricsHighlight, theme.bio_ui_col_lyricsShadow, lyricsRefLum);
		bio.ui.col.lyricsNormal = staticTheme ? theme.bio_ui_col_lyricsNormal : bio.ui.col.text;
		bio.ui.col.lyricsHighlight = lyricsColors.lyricsHighlight;
		bio.ui.col.lyricsShadow = lyricsColors.lyricsShadow;
		bio.ui.col.noPhotoStubBg = getColor(theme.bio_ui_col_noPhotoStubBg, 'noPhotoStub.bg', 'oklch');
		bio.ui.col.noPhotoStubText = getColor(theme.bio_ui_col_noPhotoStubText, 'noPhotoStub.text');

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = pl.col.sbar_btn_normal;
		bio.ui.col.sbarNormal = pl.col.sbar_thumb_normal;
		bio.ui.col.sbarHovered = pl.col.sbar_thumb_hovered;
		bio.ui.col.sbarDrag = bio.ui.col.sbarHovered;
	}

	/**
	 * Adjusts all main UI colors when playback starts.
	 */
	mainColorsAdjustments() {
		if (!fb.IsPlaying && !grCfg.settings.showDebugAPCACalibrationOverlay || !grm.ui.albumArt) {
			this.mainBaseColors();
			return;
		}

		const { THEME, BEVEL, ALT, TPB, BW, BW2, BWR, RW, RB, BR, RF, RF2 } = grAlias;
		const { primary, colLuminance, ctx, isWhiteOrBlack, staticTheme, theme } = { ...this._createThemeContext('main') };

		const isRWOrRB = RW || RB;
		const isWB = isRWOrRB || (isWhiteOrBlack && !BR);

		const isStatic = isRWOrRB || staticTheme;
		const staticColor = isRWOrRB || staticTheme || (isWhiteOrBlack && !BR);
		const staticColorOrBR = staticColor || BR;
		const staticColorPMWF = !isRWOrRB && staticColor;

		const mainTheme = RW ? grm.colorPalette.whiteTheme : RB ? grm.colorPalette.blackTheme : theme;
		const mainBgLum = THEME === 'white' || RW ? LUM.Y90 : RB ? LUM.Y0_5 : staticColor ? Color.LUM(mainTheme.grCol_bg) : colLuminance;
		const ctxBR = BR ? { ...ctx, forceWB: true } : ctx;

		const getColor = this._getColor(primary, mainBgLum, isStatic, isWB, ctx);
		const getColorPMWF = isRWOrRB ? this._getColor(primary, mainBgLum, false, false, ctx) : getColor;
		const getContrastTextColor = (propName, lightBg = grCol.lightBgPrimary) => this._getStaticColor(mainTheme, isStatic, isWB, lightBg)(propName);

		// * MAIN COLORS * //
		grCol.bg = RB && BEVEL ? grm.colorPalette.rebornTheme.style.rebornBlack.grCol_bgBevel : ['reborn', 'random'].includes(grSet.theme) && !RW && !RB || BR ? primary : mainTheme.grCol_bg;
		grCol.shadow = isStatic ? mainTheme.grCol_shadow : RGBA(0, 0, 0, grm.colorSystem.applyColor(null, mainBgLum, 'rgb', `shadow.panel.${BEVEL ? 'bevel' : 'base'}`, ctx));
		grCol.discArtShadow = isStatic ? mainTheme.grCol_discArtShadow : RGBA(0, 0, 0, grm.colorSystem.applyColor(null, mainBgLum, 'oklch', 'shadow.discArt.base', ctx));
		grCol.noAlbumArtStub = grm.ui.isStreaming ? RGB(207, 0, 5) : mainTheme.grCol_noAlbumArtStub;

		// * LOWER BAR COLORS * //
		grCol.lowerBarArtist = getColor(mainTheme.grCol_lowerBarArtist, 'lowerBar.text');
		grCol.lowerBarTitle  = getColor(mainTheme.grCol_lowerBarTitle,  'lowerBar.text');
		grCol.lowerBarTime   = getColor(mainTheme.grCol_lowerBarTime,   'lowerBar.text');
		grCol.lowerBarLength = getColor(mainTheme.grCol_lowerBarLength, 'lowerBar.text');

		// * DETAILS COLORS * //
		grCol.detailsBg = staticTheme || BR ? mainTheme.grCol_detailsBg : (RF2 ? grCol.secondary : grCol.primary);
		grCol.detailsText = getContrastTextColor('grCol_detailsText', grCol.lightBgDetails) || getColor(mainTheme.grCol_detailsText, 'details.text', 'rgb', false, { ...ctx, isLightBg: grCol.lightBgDetails });
		grCol.detailsRating = mainTheme.grCol_detailsRating;
		grCol.detailsHotness = mainTheme.grCol_detailsHotness;
		grCol.timelineAdded = grm.ui.isStreaming ? RGB(207, 0, 5) : staticTheme ? mainTheme.grCol_timelineAdded    : grm.colorSystem.applyColor(primary, colLuminance, 'oklch', 'details.timelineAdded', ctx);
		grCol.timelinePlayed = grm.ui.isStreaming ? RGB(207, 0, 5) : staticTheme ? mainTheme.grCol_timelinePlayed   : grm.colorSystem.applyColor(primary, colLuminance, 'oklch', 'details.timelinePlayed', ctx);
		grCol.timelineUnplayed = grm.ui.isStreaming ? RGB(207, 0, 5) : staticTheme ? mainTheme.grCol_timelineUnplayed : grm.colorSystem.applyColor(primary, colLuminance, 'oklch', 'details.timelineUnplayed', ctx);
		grCol.timelineFrame = grCol.detailsBg;

		// * LYRICS COLORS * //
		const lyricsImgLuminance = grSet.lyricsBgImg ? grCol.imgLuminance : null;
		const lyricsBgLum = Color.LUM(grm.ui.displayDetails ? grCol.detailsBg : pl.col.bg);
		const lyricsRefLumMain = lyricsImgLuminance !== null ? grm.colorManager.getLyricsEffectiveLuminance(lyricsImgLuminance, lyricsBgLum) : lyricsBgLum;
		const lyricsColorsMain = grm.colorManager.getLyricsColors(primary, ctx.isLightBg, staticTheme, mainTheme.grCol_lyricsHighlight, mainTheme.grCol_lyricsShadow, lyricsRefLumMain);
		grCol.lyricsNormal = !grSet.lyricsBgImg ? pl.col.row_title_normal : staticTheme ? mainTheme.grCol_lyricsNormal : grm.colorSystem.applyColor(primary, lyricsRefLumMain, 'rgb', 'text.normal', ctx);
		grCol.lyricsHighlight = lyricsColorsMain.lyricsHighlight;
		grCol.lyricsShadow = lyricsColorsMain.lyricsShadow;

		// * POPUP COLORS * //
		grCol.popupBg = RGBtoRGBA(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = THEME === 'white' && (!BW && !BW2 && !BWR) ? pl.col.row_title_playing : pl.col.header_artist_playing;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor = getColor(mainTheme.grCol_menuBgColor, 'menu.bg', 'oklch', false, ctxBR);
		grCol.menuStyleBg = getColor(mainTheme.grCol_menuStyleBg, 'menu.styleBg', 'oklch', false, ctxBR);
		grCol.menuRectStyleEmbossTop = getColor(mainTheme.grCol_menuRectStyleEmbossTop, 'menu.styleRectEmbossTop', 'oklch', false, ctxBR);
		grCol.menuRectStyleEmbossBottom = getColor(mainTheme.grCol_menuRectStyleEmbossBottom, 'menu.styleRectEmbossBottom', 'oklch', false, ctxBR);
		grCol.menuRectNormal  = getColor(mainTheme.grCol_menuRectNormal,  'menu.rect', 'rgb', false, ctx, ctx.menuBevelOrInner);
		grCol.menuRectHovered = getColor(mainTheme.grCol_menuRectHovered, 'menu.rect', 'rgb', false, ctx, ctx.menuBevelOrInner);
		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = getColor(mainTheme.grCol_menuTextNormal, 'menu.text');
		grCol.menuTextHovered = getColor(mainTheme.grCol_menuTextHovered, 'text.active');
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = getColor(mainTheme.grCol_transportEllipseBg, 'transport.bg', 'rgb', false, ctxBR);
		grCol.transportEllipseNormal = getColor(mainTheme.grCol_transportEllipseNormal, 'transport.ellipse', 'oklch', false, ctxBR);
		grCol.transportEllipseHovered = mainTheme.grCol_transportEllipseHovered;
		grCol.transportEllipseDown = mainTheme.grCol_transportEllipseDown;
		grCol.transportStyleBg = staticColorOrBR ? mainTheme.grCol_transportStyleBg : grm.colorSystem.applyColor(grCol.primary_rgb_s075, mainBgLum, 'rgb', 'transport.styleBg', ctx);
		grCol.transportStyleTop = staticColorOrBR ? mainTheme.grCol_transportStyleTop : grm.colorSystem.applyColor(grCol.primary_rgb_t080, mainBgLum, 'rgb', 'transport.styleTop', ctx);
		grCol.transportStyleBottom = staticColorOrBR ? mainTheme.grCol_transportStyleBottom : grm.colorSystem.applyColor(grCol.primary_rgb_s075, mainBgLum, 'rgb', 'transport.styleBottom', ctx);
		grCol.transportIconNormal = staticColorOrBR ? mainTheme.grCol_transportIconNormal : grm.colorSystem.applyColor(primary, TPB !== 'minimal' ? Color.LUM(grCol.transportEllipseBg) : mainBgLum, 'rgb', TPB !== 'minimal' ? 'transport.icon' : 'transport.iconMinimal', ctx);
		grCol.transportIconHovered = staticColorOrBR ? mainTheme.grCol_transportIconHovered : grm.colorSystem.applyColor(primary, TPB !== 'minimal' ? Color.LUM(grCol.transportEllipseBg) : mainBgLum, 'rgb', TPB !== 'minimal' ? 'transport.iconHovered' : 'transport.iconMinimalHovered', ctx);
		grCol.transportIconDown = mainTheme.grCol_transportIconDown;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = getColor(mainTheme.grCol_progressBar, 'progressBar.bg', 'oklch', false, ctxBR);
		grCol.progressBarStreaming = mainTheme.grCol_progressBarStreaming;
		grCol.progressBarFrame = grCol.bg;
		grCol.progressBarFill = isRWOrRB ? primary : BR ? grm.colorSystem.applyColor(primary, mainBgLum, 'oklch', 'progressBar.fill', ctx) : getColor(mainTheme.grCol_progressBarFill, 'progressBar.fill', 'rgb', true);
		grCol.styleProgressBar = grm.colorSystem.applyColor(RGB(0, 0, 0), mainBgLum, 'rgb', 'progressBar.highlight', ctx);
		grCol.styleProgressBarLineTop = grm.colorSystem.applyColor(RGB(0, 0, 0), mainBgLum, 'rgb', 'progressBar.lineTop', ctx);
		grCol.styleProgressBarLineBottom = grm.colorSystem.applyColor(RGB(255, 255, 255), mainBgLum, 'rgb', 'progressBar.lineBottom', ctx);
		grCol.styleProgressBarFill = grm.colorSystem.applyColor(RGB(0, 0, 0), colLuminance, 'oklch', 'shadow.fill', ctx);

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = getColorPMWF(mainTheme.grCol_peakmeterBarProgFill,      staticColorPMWF ? 'peakmeterBar.progFillStatic'      : 'peakmeterBar.progFill',      'oklch', true, ctx, !staticTheme);
		grCol.peakmeterBarFillTop       = getColorPMWF(mainTheme.grCol_peakmeterBarFillTop,       staticColorPMWF ? 'peakmeterBar.fillTopStatic'       : 'peakmeterBar.fillTop',       'oklch', true, ctx, !staticTheme);
		grCol.peakmeterBarFillMiddle    = getColorPMWF(mainTheme.grCol_peakmeterBarFillMiddle,    staticColorPMWF ? 'peakmeterBar.fillMiddleStatic'    : 'peakmeterBar.fillMiddle',    'oklch', true, ctx, !staticTheme);
		grCol.peakmeterBarFillBack      = getColorPMWF(mainTheme.grCol_peakmeterBarFillBack,      staticColorPMWF ? 'peakmeterBar.fillBackStatic'      : 'peakmeterBar.fillBack',      'oklch', true, ctx, !staticTheme);
		grCol.peakmeterBarVertProgFill  = getColorPMWF(mainTheme.grCol_peakmeterBarVertProgFill,  staticColorPMWF ? 'peakmeterBar.vertProgFillStatic'  : 'peakmeterBar.vertProgFill',  'oklch', true, ctx, !staticTheme);
		grCol.peakmeterBarVertFill      = getColorPMWF(mainTheme.grCol_peakmeterBarVertFill,      staticColorPMWF ? 'peakmeterBar.vertFillStatic'      : 'peakmeterBar.vertFill',      'oklch', true, ctx, !staticTheme);
		grCol.peakmeterBarVertFillPeaks = getColorPMWF(mainTheme.grCol_peakmeterBarVertFillPeaks, staticColorPMWF ? 'peakmeterBar.vertFillPeaksStatic' : 'peakmeterBar.vertFillPeaks', 'oklch', true, ctx, !staticTheme);

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = getColorPMWF(mainTheme.grCol_waveformBarFillFront,    staticColorPMWF ? 'waveformBar.fillFrontStatic' : 'waveformBar.fillFront', 'oklch', true, ctx, !staticTheme);
		grCol.waveformBarFillBack     = getColorPMWF(mainTheme.grCol_waveformBarFillBack,     staticColorPMWF ? 'waveformBar.fillBackStatic'  : 'waveformBar.fillBack',  'oklch', true, ctx, !staticTheme);
		grCol.waveformBarFillPreFront = getColorPMWF(mainTheme.grCol_waveformBarFillPreFront, staticColorPMWF ? 'waveformBar.preFrontStatic'  : 'waveformBar.preFront',  'oklch', true, ctx, !staticTheme);
		grCol.waveformBarFillPreBack  = getColorPMWF(mainTheme.grCol_waveformBarFillPreBack,  staticColorPMWF ? 'waveformBar.preBackStatic'   : 'waveformBar.preBack',   'oklch', true, ctx, !staticTheme);
		grCol.waveformBarIndicator    = getColorPMWF(mainTheme.grCol_waveformBarIndicator,    staticColorPMWF ? 'waveformBar.indicatorStatic' : 'waveformBar.indicator', 'oklch', true, ctx, !staticTheme);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = getColor(mainTheme.grCol_volumeBar, 'volumeBar.bg', 'rgb', false, ctxBR);
		grCol.volumeBarFill = isRWOrRB ? primary : BR ? grCol.progressBarFill : isStatic ? mainTheme.grCol_volumeBarFill : grCol.primary_rgb_s015;
		grCol.volumeBarFrame = grCol.transportEllipseNormal;
		grCol.styleVolumeBar = grm.colorSystem.applyColor(RGB(0, 0, 0), colLuminance, 'rgb', 'volumeBar.styleBg', ctx);
		grCol.styleVolumeBarFill = grm.colorSystem.applyColor(RGB(0, 0, 0), colLuminance, 'oklch', 'shadow.fill', ctx);

		// * STYLE COLORS * //
		grCol.styleBevel       = BR ? grm.colorSystem.applyColor(primary, mainBgLum, 'oklch', 'style.bevel', ctx) : getColor(staticColor ? mainTheme.grCol_styleBevel : primary, 'style.bevel', 'oklch');
		grCol.styleGradient    = staticColorOrBR && !RB ? mainTheme.grCol_styleGradient  : getColor(primary, RB ? 'style.gradientRebornBlack' : 'style.gradient', 'oklch', true);
		grCol.styleGradient2   = staticColorOrBR && !RB ? mainTheme.grCol_styleGradient2 : getColor(primary, RB ? 'style.gradientRebornBlack' : 'style.gradient', 'oklch', true);
		grCol.styleAlternative = getColor(mainTheme.grCol_styleAlternative, 'style.alternative', 'oklch', false, ctxBR);
	}
	// #endregion

	// * PUBLIC METHODS - LIBRARY & BIOGRAPHY - SPECIAL DESIGN & THEME COLORS * //
	// #region PUBLIC METHODS - LIBRARY & BIOGRAPHY - SPECIAL DESIGN & THEME COLORS
	/**
	 * The Library design color adjustments used in Options > Library > Design.
	 */
	libraryDesignColors() {
		if (grSet.libraryDesign === 'reborn') return; // No need

		// * LIBRARY DESIGN ADJUSTMENTS * //
		if (['white', 'black'].includes(grSet.theme)) {
			if ((grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') && lib.panel.imgView) {
				lib.ui.col.text_h = lib.ui.col.text_nowp;
			}
			if (grSet.libraryDesign === 'coversLabelsRight' || grSet.libraryDesign === 'coversLabelsBottom') {
				lib.ui.col.textSel = pl.col.row_title_selected;
			}
			if (grSet.libraryDesign === 'coversLabelsBlend') {
				if (lib.panel.imgView) lib.ui.col.text_nowp = grm.colorSystem.getTextColor(lib.ui.col.bg, RGB(255, 255, 255), RGB(0, 0, 0)).color;
				lib.ui.col.textSel = lib.panel.imgView ? lib.ui.col.text_nowp : pl.col.row_title_selected;
			}
		}

		if (['reborn', 'random'].includes(grSet.theme)) {
			if (grSet.libraryDesign === 'traditional' && !lib.panel.imgView) {
				lib.ui.col.iconPlusBg = lib.ui.col.nowPlayingBg;
			}
			if (grSet.libraryDesign === 'coversLabelsBlend' && lib.panel.imgView) {
				lib.ui.col.text = RGB(200, 200, 200);
				lib.ui.col.text_h = RGB(255, 255, 255);
				lib.ui.col.text_nowp = grm.colorSystem.getTextColor(lib.ui.col.bg, RGB(255, 255, 255), RGB(0, 0, 0)).color;
			}
		}

		if (grSet.theme === 'cream' && (grSet.libraryDesign === 'coversLabelsBlend' && lib.panel.imgView)) {
			lib.ui.col.text_nowp = RGB(0, 0, 0);
		}
	}

	/**
	 * The Library theme colors used in Options > Library > Theme.
	 */
	libraryThemeColors() {
		if (libSet.theme === 0) return; // No need

		// * SETUP COLORS * //
		const bgLum = Color.LUM(lib.ui.col.bg);
		const imgLum = grCol.imgLuminance;

		grCol.lightBgLib =
			libSet.theme === 1 && imgLum > 0.57
			||
			libSet.theme === 2 && (bgLum > 0.32 || bgLum > 0.06 && imgLum > 0.57)
			||
			libSet.theme === 3
			||
			libSet.theme === 5 && bgLum > 0.32;

		// * GET BLENDED BG IMAGE * //
		lib.ui.get = true;

		// * ROW COLORS * //
		lib.ui.col.selectionFrame = grCol.lightBgLib ? RGBA(0, 0, 0, 100) : RGBA(255, 255, 255, 100);

		// * NODE COLORS * //
		lib.ui.col.iconPlus     = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.iconPlus_h   = grCol.lightBgLib ? RGB(0, 0, 0)    : RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = grCol.lightBgLib ? RGB(0, 0, 0)    : RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text    = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.text_h  = grCol.lightBgLib ? RGB(0, 0, 0)    : RGB(255, 255, 255);
		lib.ui.col.textSel = libSet.albumArtShow ? lib.ui.col.text_nowp : lib.ui.col.text;
		lib.ui.col.txt     = lib.ui.col.text;
		lib.ui.col.txt_h   = lib.ui.col.text_h;
		lib.ui.col.txt_box = grCol.lightBgLib ? RGB(40, 40, 40) : RGB(220, 220, 220);
		lib.ui.col.count   = lib.ui.col.text;

		// * BUTTON COLORS * //
		lib.ui.col.search      = grCol.lightBgLib ? RGB(60, 60, 60)    : RGB(220, 220, 220);
		lib.ui.col.searchBtn   = grCol.lightBgLib ? RGB(0, 0, 0)       : RGB(255, 255, 255);
		lib.ui.col.crossBtn    = grCol.lightBgLib ? RGB(40, 40, 40)    : RGB(255, 255, 255);
		lib.ui.col.filterBtn   = grCol.lightBgLib ? RGB(60, 60, 60)    : RGB(220, 220, 220);
		lib.ui.col.settingsBtn = grCol.lightBgLib ? RGB(60, 60, 60)    : RGB(220, 220, 220);
		lib.ui.col.line        = grCol.lightBgLib ? RGBA(0, 0, 0, 100) : RGBA(255, 255, 255, 100);
		lib.ui.col.s_line      = lib.ui.col.line;
	}

	/**
	 * The Biography theme colors used in Options > Biography > Theme.
	 */
	biographyThemeColors() {
		if (bioSet.theme === 0) return; // No need

		// * SETUP COLORS * //
		const bgLum = Color.LUM(bio.ui.col.bg);
		const imgLum = grCol.imgLuminance;

		grCol.lightBgBio =
			bioSet.theme === 1 && imgLum > 0.57
			||
			bioSet.theme === 2 && (bgLum > 0.32 || imgLum > 0.57)
			||
			bioSet.theme === 3
			||
			bioSet.theme === 4 && imgLum > 0.32;

		// * MAIN COLORS * //
		bio.ui.col.rowStripes = RGBtoRGBA(pl.col.row_stripes_bg, 100);

		// * HEADER COLORS * //
		bio.ui.col.headingText = grCol.lightBgBio ? RGB(65, 65, 65) : RGB(230, 230, 230);
		bio.ui.col.bottomLine  = grCol.lightBgBio ? RGB(120, 120, 120) : pl.col.header_line_normal;
		bio.ui.col.centerLine  = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text    = grCol.lightBgBio ? RGB(60, 60, 60) : RGB(220, 220, 220);
		bio.ui.col.source  = bio.ui.col.headingText;
		bio.ui.col.accent  = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;
	}
	// #endregion

	// * PUBLIC METHODS - THEME COLOR INITIALIZATION * //
	// #region PUBLIC METHODS - THEME COLOR INITIALIZATION
	/**
	 * Init theme colors for a specific target or all components.
	 * @param {strong} target - The color init target, can be: 'base', 'playlist', 'library', 'biography', 'main'.
	 */
	initThemeColors(target) {
		switch (target) {
			case 'base': {
				this.playlistBaseColors();
				this.libraryBaseColors();
				this.biographyBaseColors();
				this.mainBaseColors();
				break;
			}
			case 'playlist': {
				this.playlistBaseColors();
				this.playlistColorsAdjustments();
				break;
			}
			case 'library': {
				this.libraryBaseColors();
				this.libraryColorsAdjustments();
				this.libraryDesignColors();
				this.libraryThemeColors();
				break;
			}
			case 'biography': {
				this.biographyBaseColors();
				this.biographyColorsAdjustments();
				this.biographyThemeColors();
				break;
			}
			case 'main': {
				this.mainBaseColors();
				this.mainColorsAdjustments();
				break;
			}
			default: {
				this.playlistBaseColors();
				this.libraryBaseColors();
				this.biographyBaseColors();
				this.mainBaseColors();
				this.playlistColorsAdjustments();
				this.libraryColorsAdjustments();
				this.libraryDesignColors();
				this.libraryThemeColors();
				this.biographyColorsAdjustments();
				this.biographyThemeColors();
				this.mainColorsAdjustments();
				this.initChronflowColors();
				break;
			}
		}
	}

	/**
	 * Init all colors that are used in the chronflow user-component, mostly called from grm.ui.initTheme().
	 */
	initChronflowColors() {
		if (!Component.ChronFlow) return;

		try {
			const chron = new ActiveXObject('chron.IChronControl');
			if (!chron) return;

			// * SetPanelColor
			const bg_rgb = pl.col.bg !== RGB(255, 255, 255) ? Math.abs(pl.col.bg) : RGB(255, 255, 255);
			const r_bg = 255 - GetRed(bg_rgb);
			const g_bg = 255 - GetGreen(bg_rgb);
			const b_bg = 255 - GetBlue(bg_rgb);

			chron.SetPanelColor((b_bg << 16) | (g_bg << 8) | r_bg, /*skip refresh*/ [0]);

			// * SetTextColor
			const col = grCol.lowerBarArtist;
			const hex = RGBtoHEX(GetBlue(col), GetGreen(col), GetRed(col));
			chron.SetTextColor(`0x${hex}`, /*refresh*/ [1]);
		}
		catch (e) {
			// grm.debug.debugLog('Unable to create ActiveX chron.IChronControl object');
		}
	}
	// #endregion
}
