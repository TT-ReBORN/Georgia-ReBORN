/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Color Palette                            * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-05-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * COLOR PALETTE * //
///////////////////////
/**
 * A class that serves as the central repository for all static theme color definitions.
 * Provides a hybrid interface: static for the Loader and instance for ColorManager.
 */
class ColorPalette {
	/**
	 * Creates the `ColorPalette` instance and links static themes to instance properties.
	 */
	constructor() {
		// * INSTANCE LINKS TO STATIC DATA * //
		/** @type {object} The reference to the static whiteTheme. */
		this.whiteTheme = ColorPalette.whiteTheme;
		/** @type {object} The reference to the static blackTheme. */
		this.blackTheme = ColorPalette.blackTheme;
		/** @type {object} The reference to the static rebornTheme. */
		this.rebornTheme = ColorPalette.rebornTheme;
		/** @type {object} The reference to the static randomTheme. */
		this.randomTheme = ColorPalette.randomTheme;
		/** @type {object} The reference to the static blueTheme. */
		this.blueTheme = ColorPalette.blueTheme;
		/** @type {object} The reference to the static darkblueTheme. */
		this.darkblueTheme = ColorPalette.darkblueTheme;
		/** @type {object} The reference to the static redTheme. */
		this.redTheme = ColorPalette.redTheme;
		/** @type {object} The reference to the static creamTheme. */
		this.creamTheme = ColorPalette.creamTheme;
		/** @type {object} The reference to the static nblueTheme. */
		this.nblueTheme = ColorPalette.nblueTheme;
		/** @type {object} The reference to the static ngreenTheme. */
		this.ngreenTheme = ColorPalette.ngreenTheme;
		/** @type {object} The reference to the static nredTheme. */
		this.nredTheme = ColorPalette.nredTheme;
		/** @type {object} The reference to the static ngoldTheme. */
		this.ngoldTheme = ColorPalette.ngoldTheme;
		/** @type {object} The reference to the static whitePanelTheme. */
		this.whitePanelTheme = ColorPalette.whitePanelTheme;
		/** @type {object} The reference to the static whiteMainTheme. */
		this.whiteMainTheme = ColorPalette.whiteMainTheme;
		/** @type {object} The reference to the static blackPanelTheme. */
		this.blackPanelTheme = ColorPalette.blackPanelTheme;
		/** @type {object} The reference to the static blackMainTheme. */
		this.blackMainTheme = ColorPalette.blackMainTheme;
	}

	// * PUBLIC STATIC THEME COLORS * //
	// #region PUBLIC STATIC THEME COLORS
	/**
	 * The default colors for White theme used in Options > Theme > White.
	 * @type {object}
	 * @static
	 */
	static whiteTheme = {
		// * CORE COLORS * //
		primary: RGB(25, 160, 240),
		secondary: RGB(255, 255, 255),
		accent: RGB(25, 160, 240),
		streaming: RGB(207, 0, 5),

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(255, 255, 255),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_text_normal: RGB(140, 140, 140),
		pl_col_plman_text_hovered: RGB(120, 120, 120),
		pl_col_plman_text_pressed: RGB(80, 80, 80),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(25, 160, 240),
		pl_col_header_sideMarker: RGB(25, 160, 240),
		pl_col_header_artist_normal: RGB(120, 120, 120),
		pl_col_header_artist_playing: RGB(100, 100, 100),
		pl_col_header_artist_playing_dark: RGB(100, 100, 100),
		pl_col_header_artist_playing_light: RGB(255, 255, 255),
		pl_col_header_album_normal: RGB(120, 120, 120),
		pl_col_header_album_playing: RGB(120, 120, 120),
		pl_col_header_album_playing_dark: RGB(120, 120, 120),
		pl_col_header_album_playing_light: RGB(255, 255, 255),
		pl_col_header_info_normal: RGB(120, 120, 120),
		pl_col_header_info_playing: RGB(120, 120, 120),
		pl_col_header_info_playing_dark: RGB(120, 120, 120),
		pl_col_header_info_playing_light: RGB(255, 255, 255),
		pl_col_header_date_normal: RGB(120, 120, 120),
		pl_col_header_date_playing: RGB(120, 120, 120),
		pl_col_header_date_playing_dark: RGB(120, 120, 120),
		pl_col_header_date_playing_light: RGB(255, 255, 255),
		pl_col_header_line_normal: RGB(200, 200, 200),
		pl_col_header_line_playing: RGB(200, 200, 200),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(25, 160, 240),
		pl_col_row_stripes_bg: RGB(245, 245, 245),
		pl_col_row_selection_bg: RGB(200, 200, 200),
		pl_col_row_selection_frame: RGB(200, 200, 200),
		pl_col_row_sideMarker: RGB(25, 160, 240),
		pl_col_row_title_normal: RGB(100, 100, 100),
		pl_col_row_title_playing: RGB(245, 245, 245),
		pl_col_row_title_playing_dark: RGB(20, 20, 20),
		pl_col_row_title_playing_light: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(0, 0, 0),
		pl_col_row_title_hovered: RGB(0, 0, 0),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(200, 200, 200),
		pl_col_row_drag_line: RGB(170, 170, 170),
		pl_col_row_drag_line_reached: RGB(25, 160, 240),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(120, 120, 120),
		pl_col_sbar_btn_hovered: RGB(0, 0, 0),
		pl_col_sbar_thumb_normal: RGB(200, 200, 200),
		pl_col_sbar_thumb_hovered: RGB(120, 120, 120),
		pl_col_sbar_thumb_drag: RGB(120, 120, 120),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(255, 255, 255),
		lib_ui_col_rowStripes: RGB(245, 245, 245),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(25, 160, 240),
		lib_ui_col_sideMarker: RGB(25, 160, 240),
		lib_ui_col_selectionFrame: RGB(200, 200, 200),
		lib_ui_col_selectionFrame2: RGB(25, 160, 240),
		lib_ui_col_hoverFrame: RGB(25, 160, 240),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(120, 120, 120),
		lib_ui_col_iconPlus_h: RGB(0, 0, 0),
		lib_ui_col_iconPlus_sel: RGB(0, 0, 0),
		lib_ui_col_iconPlusBg: RGB(240, 240, 240),
		lib_ui_col_iconMinus_e: RGB(120, 120, 120),
		lib_ui_col_iconMinus_c: RGB(120, 120, 120),
		lib_ui_col_iconMinus_h: RGB(0, 0, 0),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(100, 100, 100),
		lib_ui_col_text_h: RGB(0, 0, 0),
		lib_ui_col_text_nowp: RGB(255, 255, 255),
		lib_ui_col_textSel: RGB(0, 0, 0),
		lib_ui_col_txt: RGB(100, 100, 100),
		lib_ui_col_txt_h: RGB(0, 0, 0),
		lib_ui_col_txt_box: RGB(80, 80, 80),
		lib_ui_col_count: RGB(100, 100, 100),
		lib_ui_col_search: RGB(100, 100, 100),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(0, 0, 0),
		lib_ui_col_crossBtn: RGB(80, 80, 80),
		lib_ui_col_filterBtn: RGB(120, 120, 120),
		lib_ui_col_settingsBtn: RGB(120, 120, 120),
		lib_ui_col_line: RGB(200, 200, 200),
		lib_ui_col_s_line: RGB(200, 200, 200),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(120, 120, 120),
		lib_ui_col_sbarNormal: RGB(200, 200, 200),
		lib_ui_col_sbarHovered: RGB(120, 120, 120),
		lib_ui_col_sbarDrag: RGB(120, 120, 120),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(255, 255, 255),
		bio_ui_col_rowStripes: RGB(245, 245, 245),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(120, 120, 120),
		bio_ui_col_bottomLine: RGB(200, 200, 200),
		bio_ui_col_centerLine: RGB(200, 200, 200),
		bio_ui_col_sectionLine: RGB(200, 200, 200),

		// * TEXT COLORS * //
		bio_ui_col_accent: RGB(120, 120, 120),
		bio_ui_col_source: RGB(120, 120, 120),
		bio_ui_col_summary: RGB(100, 100, 100),
		bio_ui_col_text: RGB(100, 100, 100),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(100, 100, 100),
		bio_ui_col_lyricsHighlight: RGB(220, 160, 40),
		bio_ui_col_noPhotoStubBg: RGB(245, 245, 245),
		bio_ui_col_noPhotoStubText: RGB(120, 120, 120),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(120, 120, 120),
		bio_ui_col_sbarNormal: RGB(200, 200, 200),
		bio_ui_col_sbarHovered: RGB(120, 120, 120),
		bio_ui_col_sbarDrag: RGB(120, 120, 120),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(245, 245, 245),
		grCol_shadow: RGBA(0, 0, 0, 25),
		grCol_discArtShadow: RGBA(0, 0, 0, 10),
		grCol_noAlbumArtStub: RGB(120, 120, 120),
		grCol_lowerBarArtist: RGB(120, 120, 120),
		grCol_lowerBarTitle: RGB(120, 120, 120),
		grCol_lowerBarTime: RGB(120, 120, 120),
		grCol_lowerBarLength: RGB(120, 120, 120),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(220, 160, 40),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS * //
		grCol_detailsBg: null,
		grCol_detailsText: RGB(120, 120, 120),
		grCol_detailsText_dark: RGB(55, 55, 55),
		grCol_detailsText_light: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(25, 160, 240),
		grCol_timelinePlayed: RGB(20, 130, 195),
		grCol_timelineUnplayed: RGB(15, 100, 150),
		grCol_timelineFrame: RGB(255, 255, 255),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(245, 245, 245),
		grCol_popupText: RGB(25, 160, 240),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(255, 255, 255),
		grCol_menuStyleBg: RGB(220, 220, 220),
		grCol_menuRectStyleEmbossTop: RGB(255, 255, 255),
		grCol_menuRectStyleEmbossBottom: RGB(210, 210, 210),
		grCol_menuRectNormal: RGB(200, 200, 200),
		grCol_menuRectHovered: RGB(200, 200, 200),
		grCol_menuRectDown: RGB(200, 200, 200),
		grCol_menuTextNormal: RGB(120, 120, 120),
		grCol_menuTextHovered: RGB(80, 80, 80),
		grCol_menuTextDown: RGB(80, 80, 80),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(255, 255, 255),
		grCol_transportEllipseNormal: RGB(220, 220, 220),
		grCol_transportEllipseHovered: RGB(180, 180, 180),
		grCol_transportEllipseDown: RGB(180, 180, 180),
		grCol_transportStyleBg: RGB(220, 220, 220),
		grCol_transportStyleTop: RGB(255, 255, 255),
		grCol_transportStyleBottom: RGB(215, 215, 215),
		grCol_transportIconNormal: RGB(120, 120, 120),
		grCol_transportIconHovered: RGB(60, 60, 60),
		grCol_transportIconDown: RGB(60, 60, 60),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(220, 220, 220),
		grCol_progressBarStreaming: RGB(207, 0, 5),
		grCol_progressBarFrame: RGB(245, 245, 245),
		grCol_progressBarFill: RGB(25, 160, 240),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(220, 220, 220),
		grCol_peakmeterBarProgFill: RGB(25, 160, 240),
		grCol_peakmeterBarFillTop: RGB(40, 175, 245),
		grCol_peakmeterBarFillMiddle: RGB(55, 185, 250),
		grCol_peakmeterBarFillBack: RGB(75, 195, 252),
		grCol_peakmeterBarVertProgFill: RGB(25, 160, 240),
		grCol_peakmeterBarVertFill: RGB(20, 145, 215),
		grCol_peakmeterBarVertFillPeaks: RGB(50, 175, 245),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(25, 160, 240),
		grCol_waveformBarFillBack: RGB(20, 130, 195),
		grCol_waveformBarFillPreFront: RGB(180, 180, 180),
		grCol_waveformBarFillPreBack: RGB(160, 160, 160),
		grCol_waveformBarIndicator: RGB(0, 0, 0),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(255, 255, 255),
		grCol_volumeBarFrame: RGB(220, 220, 220),
		grCol_volumeBarFill: RGB(25, 160, 240),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(40, 40, 40),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',

		// * STYLE * //
		style: {
			blackAndWhite: {
				lib_ui_col_text_dark: RGB(0, 0, 0),
				lib_ui_col_text_light: RGB(255, 255, 255),
				bio_ui_col_popupBg: RGB(230, 230, 230),
				grCol_bg: RGB(230, 230, 230),
				grCol_detailsBg: RGB(20, 20, 20),
				grCol_detailsText: RGB(255, 255, 255),
				grCol_timelineAdded: RGB(230, 230, 230),
				grCol_timelinePlayed: RGB(180, 180, 180),
				grCol_timelineUnplayed: RGB(160, 160, 160),
				grCol_timelineFrame: RGB(20, 20, 20),
				grCol_progressBar: RGB(210, 210, 210),
				grCol_progressBarFill: RGB(255, 255, 255),
				grCol_lowerBarTitle: RGB(120, 120, 120),
				grCol_lowerBarArtist: RGB(120, 120, 120)
			},
			blackAndWhite2: {
				lib_ui_col_iconPlus: RGB(120, 120, 120),
				lib_ui_col_iconPlus_h: RGB(0, 0, 0),
				lib_ui_col_iconPlus_sel: RGB(0, 0, 0),
				lib_ui_col_iconPlusBg: RGB(255, 255, 255),
				lib_ui_col_iconMinus_e: RGB(120, 120, 120),
				lib_ui_col_iconMinus_c: RGB(120, 120, 120),
				lib_ui_col_iconMinus_h: RGB(0, 0, 0),
				bio_ui_col_popupBg: RGB(25, 25, 25),
				grCol_bg: RGB(25, 25, 25),
				grCol_detailsBg: RGB(245, 245, 245),
				grCol_detailsText: RGB(0, 0, 0),
				grCol_timelineAdded: RGB(40, 40, 40),
				grCol_timelinePlayed: RGB(80, 80, 80),
				grCol_timelineUnplayed: RGB(120, 120, 120),
				grCol_timelineFrame: RGB(245, 245, 245),
				grCol_progressBar: RGB(40, 40, 40),
				grCol_progressBarFill: RGB(210, 210, 210),
				grCol_lowerBarTitle: RGB(200, 200, 200),
				grCol_lowerBarArtist: RGB(240, 240, 240)
			}
		}
		// #endregion
	};

	/**
	 * The default colors for Black theme used in Options > Theme > Black.
	 * @type {object}
	 * @static
	 */
	static blackTheme = {
		// * CORE COLORS * //
		primary: RGB(175, 205, 225),
		secondary: RGB(20, 20, 20),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(20, 20, 20),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(20, 20, 20),
		pl_col_plman_text_normal: RGB(180, 180, 180),
		pl_col_plman_text_hovered: RGB(240, 240, 240),
		pl_col_plman_text_pressed: RGB(180, 180, 180),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(175, 205, 225),
		pl_col_header_sideMarker: RGB(175, 205, 225),
		pl_col_header_artist_normal: RGB(220, 220, 220),
		pl_col_header_artist_playing: RGB(255, 255, 255),
		pl_col_header_artist_playing_dark: RGB(0, 0, 0),
		pl_col_header_artist_playing_light: RGB(255, 255, 255),
		pl_col_header_album_normal: RGB(200, 200, 200),
		pl_col_header_album_playing: RGB(245, 245, 245),
		pl_col_header_album_playing_dark: RGB(20, 20, 20),
		pl_col_header_album_playing_light: RGB(245, 245, 245),
		pl_col_header_info_normal: RGB(200, 200, 200),
		pl_col_header_info_playing: RGB(245, 245, 245),
		pl_col_header_info_playing_dark: RGB(20, 20, 20),
		pl_col_header_info_playing_light: RGB(245, 245, 245),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(245, 245, 245),
		pl_col_header_date_playing_dark: RGB(20, 20, 20),
		pl_col_header_date_playing_light: RGB(245, 245, 245),
		pl_col_header_line_normal: RGB(45, 45, 45),
		pl_col_header_line_playing: RGB(25, 25, 25),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(175, 205, 225),
		pl_col_row_stripes_bg: RGB(25, 25, 25),
		pl_col_row_selection_frame: RGB(45, 45, 45),
		pl_col_row_sideMarker: RGB(175, 205, 225),
		pl_col_row_title_normal: RGB(200, 200, 200),
		pl_col_row_title_playing: RGB(245, 245, 245),
		pl_col_row_title_playing_dark: RGB(20, 20, 20),
		pl_col_row_title_playing_light: RGB(245, 245, 245),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(45, 45, 45),
		pl_col_row_drag_line: RGB(75, 75, 75),
		pl_col_row_drag_line_reached: RGB(175, 205, 225),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(100, 100, 100),
		pl_col_sbar_btn_hovered: RGB(160, 160, 160),
		pl_col_sbar_thumb_normal: RGB(100, 100, 100),
		pl_col_sbar_thumb_hovered: RGB(160, 160, 160),
		pl_col_sbar_thumb_drag: RGB(160, 160, 160),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(20, 20, 20),
		lib_ui_col_rowStripes: RGB(25, 25, 25),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(175, 205, 225),
		lib_ui_col_sideMarker: RGB(175, 205, 225),
		lib_ui_col_selectionFrame: RGB(45, 45, 45),
		lib_ui_col_selectionFrame2: RGB(175, 205, 225),
		lib_ui_col_hoverFrame: RGB(175, 205, 225),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(220, 220, 220),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(220, 220, 220),
		lib_ui_col_iconMinus_c: RGB(220, 220, 220),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(200, 200, 200),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(255, 255, 255),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(200, 200, 200),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(200, 200, 200),
		lib_ui_col_search: RGB(200, 200, 200),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(255, 255, 255),
		lib_ui_col_crossBtn: RGB(255, 255, 255),
		lib_ui_col_filterBtn: RGB(220, 220, 220),
		lib_ui_col_settingsBtn: RGB(220, 220, 220),
		lib_ui_col_line: RGB(45, 45, 45),
		lib_ui_col_s_line: RGB(45, 45, 45),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(100, 100, 100),
		lib_ui_col_sbarNormal: RGB(226, 226, 226),
		lib_ui_col_sbarHovered: RGB(160, 160, 160),
		lib_ui_col_sbarDrag: RGB(160, 160, 160),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(20, 20, 20),
		bio_ui_col_rowStripes: RGB(25, 25, 25),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(255, 255, 255),
		bio_ui_col_bottomLine: RGB(45, 45, 45),
		bio_ui_col_centerLine: RGB(45, 45, 45),
		bio_ui_col_sectionLine: RGB(45, 45, 45),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(200, 200, 200),
		bio_ui_col_source: RGB(255, 255, 255),
		bio_ui_col_accent: RGB(255, 255, 255),
		bio_ui_col_summary: RGB(200, 200, 200),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(175, 205, 225),
		bio_ui_col_popupText: RGB(255, 255, 255),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(200, 200, 200),
		bio_ui_col_lyricsHighlight: RGB(220, 160, 40),
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(255, 255, 255),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(100, 100, 100),
		bio_ui_col_sbarNormal: RGB(226, 226, 226),
		bio_ui_col_sbarHovered: RGB(160, 160, 160),
		bio_ui_col_sbarDrag: RGB(160, 160, 160),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(25, 25, 25),
		grCol_shadow: RGBA(0, 0, 0, 120),
		grCol_discArtShadow: RGBA(0, 0, 0, 40),
		grCol_noAlbumArtStub: RGB(175, 205, 225),
		grCol_lowerBarArtist: RGB(240, 240, 240),
		grCol_lowerBarTitle: RGB(200, 200, 200),
		grCol_lowerBarTime: RGB(200, 200, 200),
		grCol_lowerBarLength: RGB(200, 200, 200),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(220, 160, 40),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: null,
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsText_dark: RGB(20, 20, 20),
		grCol_detailsText_light: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(175, 205, 225),
		grCol_timelinePlayed: RGB(195, 215, 230),
		grCol_timelineUnplayed: RGB(210, 225, 235),
		grCol_timelineFrame: RGB(20, 20, 20),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(175, 205, 225),
		grCol_popupText: RGB(0, 0, 0),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(50, 50, 50),
		grCol_menuStyleBg: RGB(20, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(70, 70, 70),
		grCol_menuRectStyleEmbossBottom: RGB(0, 0, 0),
		grCol_menuRectNormal: RGB(60, 60, 60),
		grCol_menuRectHovered: RGB(120, 120, 120),
		grCol_menuRectDown: RGB(120, 120, 120),
		grCol_menuTextNormal: RGB(180, 180, 180),
		grCol_menuTextHovered: RGB(255, 255, 255),
		grCol_menuTextDown: RGB(255, 255, 255),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(35, 35, 35),
		grCol_transportEllipseNormal: RGB(60, 60, 60),
		grCol_transportEllipseHovered: RGB(120, 120, 120),
		grCol_transportEllipseDown: RGB(120, 120, 120),
		grCol_transportStyleBg: RGB(20, 20, 20),
		grCol_transportStyleTop: RGB(50, 50, 50),
		grCol_transportStyleBottom: RGB(10, 10, 10),
		grCol_transportIconNormal: RGB(160, 160, 160),
		grCol_transportIconHovered: RGB(255, 255, 255),
		grCol_transportIconDown: RGB(255, 255, 255),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(35, 35, 35),
		grCol_progressBarStreaming: RGB(207, 0, 5),
		grCol_progressBarFrame: RGB(25, 25, 25),
		grCol_progressBarFill: RGB(175, 205, 225),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(35, 35, 35),
		grCol_peakmeterBarProgFill: RGB(195, 215, 230),
		grCol_peakmeterBarFillTop: RGB(185, 210, 225),
		grCol_peakmeterBarFillMiddle: RGB(195, 215, 230),
		grCol_peakmeterBarFillBack: RGB(205, 220, 235),
		grCol_peakmeterBarVertProgFill: RGB(175, 205, 225),
		grCol_peakmeterBarVertFill: RGB(155, 185, 205),
		grCol_peakmeterBarVertFillPeaks: RGB(195, 215, 230),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(175, 205, 225),
		grCol_waveformBarFillBack: RGB(135, 165, 185),
		grCol_waveformBarFillPreFront: RGB(100, 100, 100),
		grCol_waveformBarFillPreBack: RGB(80, 80, 80),
		grCol_waveformBarIndicator: RGB(220, 220, 220),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(35, 35, 35),
		grCol_volumeBarFrame: RGB(60, 60, 60),
		grCol_volumeBarFill: RGB(175, 205, 225),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleAlternative: RGB(25, 25, 25),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion

		style: {
			blackReborn: {
				pl_col_bg: RGB(20, 20, 20),
				pl_col_plman_bg: RGB(20, 20, 20),

				lib_ui_col_bg: RGB(20, 20, 20),
				bio_ui_col_bg: RGB(20, 20, 20),

				grCol_detailsBg: RGB(20, 20, 20),
				grCol_detailsText: RGB(220, 220, 220),
				grCol_noAlbumArtStub: RGB(175, 205, 225),
				grCol_transportEllipseBg: RGB(20, 20, 20),
				grCol_transportEllipseNormal: RGB(20, 20, 20),
				grCol_transportEllipseHovered: RGB(120, 120, 120),
				grCol_transportEllipseDown: RGB(120, 120, 120),
				grCol_transportIconHovered: RGB(255, 255, 255),
				grCol_transportIconDown: RGB(255, 255, 255),
				grCol_progressBar: RGB(20, 20, 20),
				grCol_volumeBar: RGB(20, 20, 20)
			}
		}
	};

	/**
	 * The default colors for Reborn theme used in Options > Theme > Reborn.
	 * @type {object}
	 * @static
	 */
	static rebornTheme = {
		// * CORE COLORS * //
		primary: RGB(90, 90, 90),
		secondary: RGB(255, 255, 255),
		accent: RGB(90, 90, 90),

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS
		pl_col_bg: RGB(255, 255, 255),
		pl_col_plman_text_normal: RGB(140, 140, 140),
		pl_col_plman_text_hovered: RGB(80, 80, 80),
		pl_col_plman_text_pressed: RGB(140, 140, 140),
		pl_col_header_nowplaying_bg: RGB(90, 90, 90),
		pl_col_header_sideMarker: RGB(90, 90, 90),
		pl_col_header_artist_normal: RGB(120, 120, 120),
		pl_col_header_artist_playing: RGB(120, 120, 120),
		pl_col_header_album_normal: RGB(120, 120, 120),
		pl_col_header_album_playing: RGB(120, 120, 120),
		pl_col_header_info_normal: RGB(120, 120, 120),
		pl_col_header_info_playing: RGB(120, 120, 120),
		pl_col_header_date_normal: RGB(120, 120, 120),
		pl_col_header_date_playing: RGB(120, 120, 120),
		pl_col_header_line_normal: RGB(200, 200, 200),
		pl_col_header_line_playing: RGB(200, 200, 200),
		pl_col_row_nowplaying_bg: RGB(90, 90, 90),
		pl_col_row_stripes_bg: RGB(245, 245, 245),
		pl_col_row_selection_frame: RGB(200, 200, 200),
		pl_col_row_sideMarker: RGB(90, 90, 90),
		pl_col_row_title_normal: RGB(100, 100, 100),
		pl_col_row_title_playing: RGB(245, 245, 245),
		pl_col_row_title_playing_dark: RGB(0, 0, 0),
		pl_col_row_title_playing_light: RGB(245, 245, 245),
		pl_col_row_title_selected: RGB(0, 0, 0),
		pl_col_row_title_hovered: RGB(0, 0, 0),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(200, 200, 200),
		pl_col_row_drag_line: RGB(90, 90, 90),
		pl_col_row_drag_line_reached: RGB(115, 115, 115),
		pl_col_sbar_btn_normal: RGB(120, 120, 120),
		pl_col_sbar_btn_hovered: RGB(0, 0, 0),
		pl_col_sbar_thumb_normal: RGB(200, 200, 200),
		pl_col_sbar_thumb_hovered: RGB(120, 120, 120),
		pl_col_sbar_thumb_drag: RGB(120, 120, 120),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS
		lib_ui_col_bg: RGB(255, 255, 255),
		lib_ui_col_rowStripes: RGB(245, 245, 245),
		lib_ui_col_nowPlayingBg: RGB(90, 90, 90),
		lib_ui_col_sideMarker: RGB(90, 90, 90),
		lib_ui_col_selectionFrame: RGB(200, 200, 200),
		lib_ui_col_selectionFrame2: RGB(90, 90, 90),
		lib_ui_col_hoverFrame: RGB(90, 90, 90),
		lib_ui_col_iconPlus: RGB(120, 120, 120),
		lib_ui_col_iconPlus_h: RGB(0, 0, 0),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(240, 240, 240),
		lib_ui_col_iconMinus_e: RGB(120, 120, 120),
		lib_ui_col_iconMinus_c: RGB(120, 120, 120),
		lib_ui_col_iconMinus_h: RGB(0, 0, 0),
		lib_ui_col_text: RGB(100, 100, 100),
		lib_ui_col_text_h: RGB(0, 0, 0),
		lib_ui_col_text_nowp: RGB(255, 255, 255),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(100, 100, 100),
		lib_ui_col_txt_h: RGB(0, 0, 0),
		lib_ui_col_txt_box: RGB(80, 80, 80),
		lib_ui_col_search: RGB(100, 100, 100),
		lib_ui_col_searchBtn: RGB(0, 0, 0),
		lib_ui_col_crossBtn: RGB(80, 80, 80),
		lib_ui_col_filterBtn: RGB(120, 120, 120),
		lib_ui_col_settingsBtn: RGB(120, 120, 120),
		lib_ui_col_line: RGB(200, 200, 200),
		lib_ui_col_s_line: RGB(200, 200, 200),
		lib_ui_col_sbarBtns: RGB(120, 120, 120),
		lib_ui_col_sbarNormal: RGB(200, 200, 200),
		lib_ui_col_sbarHovered: RGB(120, 120, 120),
		lib_ui_col_sbarDrag: RGB(120, 120, 120),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS
		bio_ui_col_bg: RGB(255, 255, 255),
		bio_ui_col_rowStripes: RGB(245, 245, 245),
		bio_ui_col_headingText: RGB(120, 120, 120),
		bio_ui_col_bottomLine: RGB(200, 200, 200),
		bio_ui_col_centerLine: RGB(200, 200, 200),
		bio_ui_col_sectionLine: RGB(200, 200, 200),
		bio_ui_col_text: RGB(100, 100, 100),
		bio_ui_col_source: RGB(120, 120, 120),
		bio_ui_col_accent: RGB(120, 120, 120),
		bio_ui_col_summary: RGB(100, 100, 100),
		bio_ui_col_popupBg: RGB(90, 90, 90),
		bio_ui_col_popupText: RGB(255, 255, 255),
		bio_ui_col_lyricsNormal: RGB(100, 100, 100),
		bio_ui_col_lyricsHighlight: RGB(255, 240, 150),
		bio_ui_col_noPhotoStubBg: RGB(245, 245, 245),
		bio_ui_col_noPhotoStubText: RGB(120, 120, 120),
		bio_ui_col_sbarBtns: RGB(120, 120, 120),
		bio_ui_col_sbarNormal: RGB(200, 200, 200),
		bio_ui_col_sbarHovered: RGB(120, 120, 120),
		bio_ui_col_sbarDrag: RGB(120, 120, 120),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS
		grCol_bg: RGB(245, 245, 245),
		grCol_shadow: RGBA(0, 0, 0, 25),
		grCol_discArtShadow: RGBA(0, 0, 0, 30),
		grCol_noAlbumArtStub: RGB(120, 120, 120),
		grCol_lowerBarArtist: RGB(120, 120, 120),
		grCol_lowerBarTitle: RGB(120, 120, 120),
		grCol_lowerBarTime: RGB(120, 120, 120),
		grCol_lowerBarLength: RGB(120, 120, 120),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(255, 240, 150),
		grCol_lyricsShadow: RGB(0, 0, 0),
		grCol_detailsBg: RGB(255, 255, 255),
		grCol_detailsText: RGB(120, 120, 120),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(90, 90, 90),
		grCol_timelinePlayed: RGB(70, 70, 70),
		grCol_timelineUnplayed: RGB(50, 50, 50),
		grCol_timelineFrame: RGB(255, 255, 255),
		grCol_popupBg: RGB(90, 90, 90),
		grCol_popupText: RGB(255, 255, 255),
		grCol_menuBgColor: RGB(255, 255, 255),
		grCol_menuStyleBg: RGB(220, 220, 220),
		grCol_menuRectStyleEmbossTop: RGB(255, 255, 255),
		grCol_menuRectStyleEmbossBottom: RGB(210, 210, 210),
		grCol_menuRectNormal: RGB(140, 140, 140),
		grCol_menuRectHovered: RGB(200, 200, 200),
		grCol_menuRectDown: RGB(200, 200, 200),
		grCol_menuTextNormal: RGB(120, 120, 120),
		grCol_menuTextHovered: RGB(80, 80, 80),
		grCol_menuTextDown: RGB(80, 80, 80),
		grCol_transportEllipseBg: RGB(255, 255, 255),
		grCol_transportEllipseNormal: RGB(220, 220, 220),
		grCol_transportEllipseHovered: RGB(200, 200, 200),
		grCol_transportEllipseDown: RGB(200, 200, 200),
		grCol_transportStyleBg: RGB(220, 220, 220),
		grCol_transportStyleTop: RGB(255, 255, 255),
		grCol_transportStyleBottom: RGB(220, 220, 220),
		grCol_transportIconNormal: RGB(120, 120, 120),
		grCol_transportIconHovered: RGB(0, 0, 0),
		grCol_transportIconDown: RGB(0, 0, 0),
		grCol_progressBar: RGB(220, 220, 220),
		grCol_progressBarStreaming: RGB(207, 0, 5),
		grCol_progressBarFrame: RGB(245, 245, 245),
		grCol_progressBarFill: RGB(90, 90, 90),
		grCol_peakmeterBarProg: RGB(220, 220, 220),
		grCol_peakmeterBarProgFill: RGB(45, 45, 45),
		grCol_peakmeterBarFillTop: RGB(126, 126, 126),
		grCol_peakmeterBarFillMiddle: RGB(144, 144, 144),
		grCol_peakmeterBarFillBack: RGB(162, 162, 162),
		grCol_peakmeterBarVertProgFill: RGB(90, 90, 90),
		grCol_peakmeterBarVertFill: RGB(126, 126, 126),
		grCol_peakmeterBarVertFillPeaks: RGB(144, 144, 144),
		grCol_waveformBarFillFront: RGB(171, 171, 171),
		grCol_waveformBarFillBack: RGB(131, 131, 131),
		grCol_waveformBarFillPreFront: RGB(135, 135, 135),
		grCol_waveformBarFillPreBack: RGB(113, 113, 113),
		grCol_waveformBarIndicator: RGB(255, 255, 255),
		grCol_volumeBar: RGB(255, 255, 255),
		grCol_volumeBarFrame: RGB(220, 220, 220),
		grCol_volumeBarFill: RGB(90, 90, 90),
		grCol_styleBevel: RGB(40, 40, 40),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: RGB(90, 90, 90),
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: RGB(90, 90, 90),
		// #endregion

		style: {
			rebornWhite: {
				pl_col_bg: RGB(255, 255, 255),

				grCol_bg: RGB(245, 245, 245),
				grCol_detailsBg: RGB(255, 255, 255),
				grCol_detailsText: RGB(80, 80, 80),

				grCol_noAlbumArtStub: RGB(90, 90, 90),

				grCol_lowerBarArtist: RGB(80, 80, 80),
				grCol_lowerBarTitle: RGB(100, 100, 100),
				grCol_lowerBarTime: RGB(100, 100, 100),
				grCol_lowerBarLength: RGB(100, 100, 100),

				grCol_transportEllipseBg: RGB(255, 255, 255),
				grCol_transportEllipseNormal: RGB(220, 220, 220),
				grCol_transportEllipseHovered: RGB(200, 200, 200),
				grCol_transportEllipseDown: RGB(200, 200, 200),
				grCol_transportIconNormal: RGB(100, 100, 100),

				grCol_progressBar: RGB(220, 220, 220),
				grCol_volumeBar: RGB(255, 255, 255),
				grCol_volumeBarFrame: RGB(220, 220, 220),
			},

			rebornBlack: {
				grCol_bg: RGB(20, 20, 20),
				grCol_bgBevel: RGB(40, 40, 40),
				grCol_detailsBg: RGB(20, 20, 20),
				grCol_detailsText: RGB(255, 255, 255),

				grCol_noAlbumArtStub: RGB(90, 90, 90),

				grCol_lowerBarArtist: RGB(240, 240, 240),
				grCol_lowerBarTitle: RGB(200, 200, 200),
				grCol_lowerBarTime: RGB(200, 200, 200),
				grCol_lowerBarLength: RGB(200, 200, 200),

				grCol_transportEllipseBg: RGB(35, 35, 35),
				grCol_transportEllipseNormal: RGB(60, 60, 60),
				grCol_transportEllipseHovered: RGB(120, 120, 120),
				grCol_transportEllipseDown: RGB(120, 120, 120),
				grCol_transportIconNormal: RGB(160, 160, 160),

				grCol_progressBar: RGB(50, 50, 50),
				grCol_volumeBar: RGB(35, 35, 35),
				grCol_volumeBarFrame: RGB(60, 60, 60),

				grCol_menuBgColor: RGB(20, 20, 20),
				grCol_menuStyleBg: RGB(45, 45, 45),
				grCol_menuRectStyleEmbossTop: RGB(55, 55, 55),
				grCol_menuRectStyleEmbossBottom: RGB(25, 25, 25),
				grCol_menuRectNormal: RGB(60, 60, 60),
				grCol_menuRectHovered: RGB(80, 80, 80),
				grCol_menuRectDown: RGB(80, 80, 80),
				grCol_menuTextNormal: RGB(160, 160, 160),
				grCol_menuTextHovered: RGB(240, 240, 240),
				grCol_menuTextDown: RGB(240, 240, 240),

				grCol_transportStyleBg: RGB(45, 45, 45),
				grCol_transportStyleTop: RGB(55, 55, 55),
				grCol_transportStyleBottom: RGB(35, 35, 35),
				grCol_transportIconHovered: RGB(255, 255, 255),
				grCol_transportIconDown: RGB(255, 255, 255),

				grCol_progressBarStreaming: RGB(207, 0, 5),
				grCol_progressBarFill: RGB(175, 175, 175),

				grCol_styleBevel: RGB(0, 0, 0),
				grCol_styleProgressBarFill: RGB(160, 160, 160),
				grCol_styleVolumeBarFill: RGB(160, 160, 160),
				grCol_volumeBarFill: RGB(160, 160, 160),
			}
		}
	};

	/**
	 * The default colors for Random theme used in Options > Theme > Random.
	 * @type {object}
	 * @static
	 */
	static randomTheme = {
		// * CORE COLORS * //
		primary: RGB(65, 65, 65),
		secondary: RGB(255, 255, 255),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS
		pl_col_bg: RGB(255, 255, 255),
		pl_col_plman_text_normal: RGB(140, 140, 140),
		pl_col_plman_text_hovered: RGB(80, 80, 80),
		pl_col_plman_text_pressed: RGB(140, 140, 140),
		pl_col_header_nowplaying_bg: RGB(65, 65, 65),
		pl_col_header_sideMarker: RGB(65, 65, 65),
		pl_col_header_artist_normal: RGB(120, 120, 120),
		pl_col_header_artist_playing: RGB(120, 120, 120),
		pl_col_header_album_normal: RGB(120, 120, 120),
		pl_col_header_album_playing: RGB(120, 120, 120),
		pl_col_header_info_normal: RGB(120, 120, 120),
		pl_col_header_info_playing: RGB(120, 120, 120),
		pl_col_header_date_normal: RGB(120, 120, 120),
		pl_col_header_date_playing: RGB(120, 120, 120),
		pl_col_header_line_normal: RGB(200, 200, 200),
		pl_col_header_line_playing: RGB(200, 200, 200),
		pl_col_row_nowplaying_bg: RGB(65, 65, 65),
		pl_col_row_stripes_bg: RGB(245, 245, 245),
		pl_col_row_selection_frame: RGB(200, 200, 200),
		pl_col_row_sideMarker: RGB(65, 65, 65),
		pl_col_row_title_normal: RGB(100, 100, 100),
		pl_col_row_title_playing: RGB(245, 245, 245),
		pl_col_row_title_selected: RGB(0, 0, 0),
		pl_col_row_title_hovered: RGB(0, 0, 0),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(200, 200, 200),
		pl_col_row_drag_line: RGB(65, 65, 65),
		pl_col_row_drag_line_reached: RGB(98, 98, 98),
		pl_col_sbar_btn_normal: RGB(120, 120, 120),
		pl_col_sbar_btn_hovered: RGB(0, 0, 0),
		pl_col_sbar_thumb_normal: RGB(200, 200, 200),
		pl_col_sbar_thumb_hovered: RGB(120, 120, 120),
		pl_col_sbar_thumb_drag: RGB(120, 120, 120),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS
		lib_ui_col_bg: RGB(255, 255, 255),
		lib_ui_col_rowStripes: RGB(245, 245, 245),
		lib_ui_col_nowPlayingBg: RGB(65, 65, 65),
		lib_ui_col_sideMarker: RGB(65, 65, 65),
		lib_ui_col_selectionFrame: RGB(200, 200, 200),
		lib_ui_col_selectionFrame2: RGB(65, 65, 65),
		lib_ui_col_hoverFrame: RGB(65, 65, 65),
		lib_ui_col_iconPlus: RGB(120, 120, 120),
		lib_ui_col_iconPlus_h: RGB(0, 0, 0),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(240, 240, 240),
		lib_ui_col_iconMinus_e: RGB(120, 120, 120),
		lib_ui_col_iconMinus_c: RGB(120, 120, 120),
		lib_ui_col_iconMinus_h: RGB(0, 0, 0),
		lib_ui_col_text: RGB(100, 100, 100),
		lib_ui_col_text_h: RGB(0, 0, 0),
		lib_ui_col_text_nowp: RGB(255, 255, 255),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(100, 100, 100),
		lib_ui_col_txt_h: RGB(0, 0, 0),
		lib_ui_col_txt_box: RGB(80, 80, 80),
		lib_ui_col_search: RGB(100, 100, 100),
		lib_ui_col_searchBtn: RGB(0, 0, 0),
		lib_ui_col_crossBtn: RGB(80, 80, 80),
		lib_ui_col_filterBtn: RGB(120, 120, 120),
		lib_ui_col_settingsBtn: RGB(120, 120, 120),
		lib_ui_col_line: RGB(200, 200, 200),
		lib_ui_col_s_line: RGB(200, 200, 200),
		lib_ui_col_sbarBtns: RGB(120, 120, 120),
		lib_ui_col_sbarNormal: RGB(200, 200, 200),
		lib_ui_col_sbarHovered: RGB(120, 120, 120),
		lib_ui_col_sbarDrag: RGB(120, 120, 120),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS
		bio_ui_col_bg: RGB(255, 255, 255),
		bio_ui_col_rowStripes: RGB(245, 245, 245),
		bio_ui_col_headingText: RGB(120, 120, 120),
		bio_ui_col_bottomLine: RGB(200, 200, 200),
		bio_ui_col_centerLine: RGB(200, 200, 200),
		bio_ui_col_sectionLine: RGB(200, 200, 200),
		bio_ui_col_text: RGB(100, 100, 100),
		bio_ui_col_source: RGB(120, 120, 120),
		bio_ui_col_accent: RGB(120, 120, 120),
		bio_ui_col_summary: RGB(100, 100, 100),
		bio_ui_col_popupBg: RGB(65, 65, 65),
		bio_ui_col_popupText: RGB(255, 255, 255),
		bio_ui_col_lyricsNormal: RGB(100, 100, 100),
		bio_ui_col_lyricsHighlight: RGB(255, 240, 150),
		bio_ui_col_noPhotoStubBg: RGB(245, 245, 245),
		bio_ui_col_noPhotoStubText: RGB(120, 120, 120),
		bio_ui_col_sbarBtns: RGB(120, 120, 120),
		bio_ui_col_sbarNormal: RGB(200, 200, 200),
		bio_ui_col_sbarHovered: RGB(120, 120, 120),
		bio_ui_col_sbarDrag: RGB(120, 120, 120),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS
		grCol_bg: RGB(245, 245, 245),
		grCol_shadow: RGBA(0, 0, 0, 25),
		grCol_discArtShadow: RGBA(0, 0, 0, 30),
		grCol_noAlbumArtStub: RGB(120, 120, 120),
		grCol_lowerBarArtist: RGB(120, 120, 120),
		grCol_lowerBarTitle: RGB(120, 120, 120),
		grCol_lowerBarTime: RGB(120, 120, 120),
		grCol_lowerBarLength: RGB(120, 120, 120),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(255, 240, 150),
		grCol_lyricsShadow: RGB(0, 0, 0),
		grCol_detailsBg: RGB(255, 255, 255),
		grCol_detailsText: RGB(120, 120, 120),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(65, 65, 65),
		grCol_timelinePlayed: RGB(49, 49, 49),
		grCol_timelineUnplayed: RGB(33, 33, 33),
		grCol_timelineFrame: RGB(255, 255, 255),
		grCol_popupBg: RGB(65, 65, 65),
		grCol_popupText: RGB(255, 255, 255),
		grCol_menuBgColor: RGB(255, 255, 255),
		grCol_menuStyleBg: RGB(220, 220, 220),
		grCol_menuRectStyleEmbossTop: RGB(255, 255, 255),
		grCol_menuRectStyleEmbossBottom: RGB(210, 210, 210),
		grCol_menuRectNormal: RGB(140, 140, 140),
		grCol_menuRectHovered: RGB(200, 200, 200),
		grCol_menuRectDown: RGB(200, 200, 200),
		grCol_menuTextNormal: RGB(120, 120, 120),
		grCol_menuTextHovered: RGB(80, 80, 80),
		grCol_menuTextDown: RGB(80, 80, 80),
		grCol_transportEllipseBg: RGB(255, 255, 255),
		grCol_transportEllipseNormal: RGB(220, 220, 220),
		grCol_transportEllipseHovered: RGB(200, 200, 200),
		grCol_transportEllipseDown: RGB(200, 200, 200),
		grCol_transportStyleBg: RGB(220, 220, 220),
		grCol_transportStyleTop: RGB(255, 255, 255),
		grCol_transportStyleBottom: RGB(220, 220, 220),
		grCol_transportIconNormal: RGB(120, 120, 120),
		grCol_transportIconHovered: RGB(80, 80, 80),
		grCol_transportIconDown: RGB(80, 80, 80),
		grCol_progressBar: RGB(220, 220, 220),
		grCol_progressBarStreaming: RGB(207, 0, 5),
		grCol_progressBarFrame: RGB(245, 245, 245),
		grCol_progressBarFill: RGB(65, 65, 65),
		grCol_peakmeterBarProg: RGB(220, 220, 220),
		grCol_peakmeterBarProgFill: RGB(0, 0, 0),
		grCol_peakmeterBarFillTop: RGB(141, 141, 141),
		grCol_peakmeterBarFillMiddle: RGB(159, 159, 159),
		grCol_peakmeterBarFillBack: RGB(178, 178, 178),
		grCol_peakmeterBarVertProgFill: RGB(65, 65, 65),
		grCol_peakmeterBarVertFill: RGB(141, 141, 141),
		grCol_peakmeterBarVertFillPeaks: RGB(159, 159, 159),
		grCol_waveformBarFillFront: RGB(162, 162, 162),
		grCol_waveformBarFillBack: RGB(124, 124, 124),
		grCol_waveformBarFillPreFront: RGB(128, 128, 128),
		grCol_waveformBarFillPreBack: RGB(107, 107, 107),
		grCol_waveformBarIndicator: RGB(255, 255, 255),
		grCol_volumeBar: RGB(255, 255, 255),
		grCol_volumeBarFrame: RGB(220, 220, 220),
		grCol_volumeBarFill: RGB(65, 65, 65),
		grCol_styleBevel: RGB(40, 40, 40),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: RGB(65, 65, 65),
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: RGB(65, 65, 65),
		// #endregion
	};

	/**
	 * The default colors for Blue theme used in Options > Theme > Blue.
	 * @type {object}
	 * @static
	 */
	static blueTheme = {
		// * CORE COLORS * //
		primary: RGB(5, 110, 195),
		secondary: RGB(10, 115, 200),
		accent: RGB(242, 230, 170),

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS
		pl_col_bg: RGB(10, 115, 200),
		pl_col_plman_text_normal: RGB(220, 220, 220),
		pl_col_plman_text_hovered: RGB(255, 255, 255),
		pl_col_plman_text_pressed: RGB(220, 220, 220),
		pl_col_header_nowplaying_bg: RGB(10, 130, 220),
		pl_col_header_sideMarker: RGB(242, 230, 170),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(242, 230, 170),
		pl_col_header_album_normal: RGB(230, 230, 230),
		pl_col_header_album_playing: RGB(245, 245, 245),
		pl_col_header_info_normal: RGB(230, 230, 230),
		pl_col_header_info_playing: RGB(245, 245, 245),
		pl_col_header_date_normal: RGB(240, 240, 240),
		pl_col_header_date_playing: RGB(245, 245, 245),
		pl_col_header_line_normal: RGB(17, 100, 182),
		pl_col_header_line_playing: RGB(17, 100, 182),
		pl_col_row_nowplaying_bg: RGB(10, 130, 220),
		pl_col_row_stripes_bg: RGB(5, 110, 195),
		pl_col_row_selection_frame: RGB(10, 135, 230),
		pl_col_row_sideMarker: RGB(242, 230, 170),
		pl_col_row_title_normal: RGB(230, 230, 230),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(17, 100, 182),
		pl_col_row_drag_line: RGB(48, 159, 246),
		pl_col_row_drag_line_reached: RGB(242, 230, 170),
		pl_col_sbar_btn_normal: RGB(220, 220, 220),
		pl_col_sbar_btn_hovered: RGB(255, 255, 255),
		pl_col_sbar_thumb_normal: RGB(10, 135, 225),
		pl_col_sbar_thumb_hovered: RGB(242, 230, 170),
		pl_col_sbar_thumb_drag: RGB(242, 230, 170),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS
		lib_ui_col_bg: RGB(10, 115, 200),
		lib_ui_col_rowStripes: RGB(5, 110, 195),
		lib_ui_col_nowPlayingBg: RGB(10, 130, 220),
		lib_ui_col_sideMarker: RGB(242, 230, 170),
		lib_ui_col_selectionFrame: RGB(10, 135, 230),
		lib_ui_col_selectionFrame2: RGB(242, 230, 170),
		lib_ui_col_hoverFrame: RGB(242, 230, 170),
		lib_ui_col_iconPlus: RGB(242, 230, 170),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(10, 130, 220),
		lib_ui_col_iconMinus_e: RGB(242, 230, 170),
		lib_ui_col_iconMinus_c: RGB(242, 230, 170),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),
		lib_ui_col_text: RGB(230, 230, 230),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(242, 230, 170),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(230, 230, 230),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(230, 230, 230),
		lib_ui_col_search: RGB(230, 230, 230),
		lib_ui_col_searchBtn: RGB(242, 230, 170),
		lib_ui_col_crossBtn: RGB(242, 230, 170),
		lib_ui_col_filterBtn: RGB(230, 230, 230),
		lib_ui_col_settingsBtn: RGB(230, 230, 230),
		lib_ui_col_line: RGB(17, 100, 182),
		lib_ui_col_s_line: RGB(17, 100, 182),
		lib_ui_col_sbarBtns: RGB(220, 220, 220),
		lib_ui_col_sbarNormal: RGB(10, 150, 255),
		lib_ui_col_sbarHovered: RGB(242, 230, 170),
		lib_ui_col_sbarDrag: RGB(242, 230, 170),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS
		bio_ui_col_bg: RGB(10, 115, 200),
		bio_ui_col_rowStripes: RGB(5, 110, 195),
		bio_ui_col_headingText: RGB(242, 230, 170),
		bio_ui_col_bottomLine: RGB(17, 100, 182),
		bio_ui_col_centerLine: RGB(17, 100, 182),
		bio_ui_col_sectionLine: RGB(17, 100, 182),
		bio_ui_col_text: RGB(230, 230, 230),
		bio_ui_col_source: RGB(242, 230, 170),
		bio_ui_col_accent: RGB(242, 230, 170),
		bio_ui_col_summary: RGB(230, 230, 230),
		bio_ui_col_popupBg: RGB(10, 130, 220),
		bio_ui_col_popupText: RGB(242, 230, 170),
		bio_ui_col_lyricsNormal: RGB(230, 230, 230),
		bio_ui_col_lyricsHighlight: RGB(242, 230, 170),
		bio_ui_col_noPhotoStubBg: RGB(10, 130, 220),
		bio_ui_col_noPhotoStubText: RGB(242, 230, 170),
		bio_ui_col_sbarBtns: RGB(220, 220, 220),
		bio_ui_col_sbarNormal: RGB(10, 150, 255),
		bio_ui_col_sbarHovered: RGB(242, 230, 170),
		bio_ui_col_sbarDrag: RGB(242, 230, 170),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS
		grCol_bg: RGB(5, 110, 195),
		grCol_shadow: RGBA(0, 0, 0, 25),
		grCol_discArtShadow: RGBA(0, 0, 0, 30),
		grCol_noAlbumArtStub: RGB(242, 230, 170),
		grCol_lowerBarArtist: RGB(242, 230, 170),
		grCol_lowerBarTitle: RGB(245, 245, 245),
		grCol_lowerBarTime: RGB(245, 245, 245),
		grCol_lowerBarLength: RGB(245, 245, 245),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(242, 230, 170),
		grCol_lyricsShadow: RGB(0, 0, 0),
		grCol_detailsBg: RGB(10, 115, 200),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(242, 230, 170),
		grCol_timelinePlayed: RGB(195, 190, 130),
		grCol_timelineUnplayed: RGB(155, 150, 130),
		grCol_timelineFrame: RGB(10, 115, 200),
		grCol_popupBg: RGB(10, 130, 220),
		grCol_popupText: RGB(242, 230, 170),
		grCol_menuBgColor: RGB(10, 130, 220),
		grCol_menuStyleBg: RGB(5, 100, 175),
		grCol_menuRectStyleEmbossTop: RGB(10, 138, 228),
		grCol_menuRectStyleEmbossBottom: RGB(6, 95, 160),
		grCol_menuRectNormal: RGB(76, 175, 255),
		grCol_menuRectHovered: RGB(76, 175, 255),
		grCol_menuRectDown: RGB(76, 175, 255),
		grCol_menuTextNormal: RGB(230, 230, 230),
		grCol_menuTextHovered: RGB(255, 255, 255),
		grCol_menuTextDown: RGB(255, 255, 255),
		grCol_transportEllipseBg: RGB(10, 130, 220),
		grCol_transportEllipseNormal: RGB(22, 107, 186),
		grCol_transportEllipseHovered: RGB(76, 175, 255),
		grCol_transportEllipseDown: RGB(76, 175, 255),
		grCol_transportStyleBg: RGB(5, 100, 180),
		grCol_transportStyleTop: RGB(7, 130, 230),
		grCol_transportStyleBottom: RGB(5, 100, 180),
		grCol_transportIconNormal: RGB(242, 230, 170),
		grCol_transportIconHovered: RGB(255, 255, 255),
		grCol_transportIconDown: RGB(255, 255, 255),
		grCol_progressBar: RGB(10, 130, 220),
		grCol_progressBarStreaming: RGB(242, 230, 170),
		grCol_progressBarFrame: RGB(22, 107, 186),
		grCol_progressBarFill: RGB(242, 230, 170),
		grCol_peakmeterBarProg: RGB(10, 130, 220),
		grCol_peakmeterBarProgFill: RGB(247, 241, 203),
		grCol_peakmeterBarFillTop: RGB(244, 238, 188),
		grCol_peakmeterBarFillMiddle: RGB(245, 239, 194),
		grCol_peakmeterBarFillBack: RGB(206, 196, 145),
		grCol_peakmeterBarVertProgFill: RGB(242, 230, 170),
		grCol_peakmeterBarVertFill: RGB(242, 230, 170),
		grCol_peakmeterBarVertFillPeaks: RGB(250, 246, 218),
		grCol_waveformBarFillFront: RGB(242, 230, 170),
		grCol_waveformBarFillBack: RGB(194, 184, 136),
		grCol_waveformBarFillPreFront: RGB(75, 175, 255),
		grCol_waveformBarFillPreBack: RGB(10, 145, 255),
		grCol_waveformBarIndicator: RGB(255, 255, 255),
		grCol_volumeBar: RGB(10, 130, 220),
		grCol_volumeBarFrame: RGB(22, 107, 186),
		grCol_volumeBarFill: RGB(242, 230, 170),
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: RGBA(0, 0, 0, 90),
		grCol_styleGradient2: RGB(3, 72, 128),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Dark blue theme used in Options > Theme > Dark blue.
	 * @type {object}
	 * @static
	 */
	static darkblueTheme = {
		// * CORE COLORS * //
		primary: RGB(22, 40, 63),
		secondary: RGB(21, 37, 56),
		accent: RGB(255, 202, 128),

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS
		pl_col_bg: RGB(21, 37, 56),
		pl_col_plman_text_normal: RGB(220, 220, 220),
		pl_col_plman_text_hovered: RGB(255, 255, 255),
		pl_col_plman_text_pressed: RGB(220, 220, 220),
		pl_col_header_nowplaying_bg: RGB(24, 50, 82),
		pl_col_header_sideMarker: RGB(255, 202, 128),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(255, 202, 128),
		pl_col_header_album_normal: RGB(220, 220, 220),
		pl_col_header_album_playing: RGB(245, 245, 245),
		pl_col_header_info_normal: RGB(220, 220, 220),
		pl_col_header_info_playing: RGB(245, 245, 245),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(245, 245, 245),
		pl_col_header_line_normal: RGB(12, 21, 31),
		pl_col_header_line_playing: RGB(12, 21, 31),
		pl_col_row_nowplaying_bg: RGB(24, 50, 82),
		pl_col_row_stripes_bg: RGB(22, 40, 63),
		pl_col_row_selection_frame: RGB(27, 55, 90),
		pl_col_row_sideMarker: RGB(255, 202, 128),
		pl_col_row_title_normal: RGB(230, 230, 230),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(12, 21, 31),
		pl_col_row_drag_line: RGB(57, 91, 138),
		pl_col_row_drag_line_reached: RGB(255, 202, 128),
		pl_col_sbar_btn_normal: RGB(220, 220, 220),
		pl_col_sbar_btn_hovered: RGB(255, 255, 255),
		pl_col_sbar_thumb_normal: RGB(27, 55, 90),
		pl_col_sbar_thumb_hovered: RGB(255, 202, 128),
		pl_col_sbar_thumb_drag: RGB(255, 202, 128),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS
		lib_ui_col_bg: RGB(21, 37, 56),
		lib_ui_col_rowStripes: RGB(22, 40, 63),
		lib_ui_col_nowPlayingBg: RGB(24, 50, 82),
		lib_ui_col_sideMarker: RGB(255, 202, 128),
		lib_ui_col_selectionFrame: RGB(27, 55, 90),
		lib_ui_col_selectionFrame2: RGB(255, 202, 128),
		lib_ui_col_hoverFrame: RGB(255, 202, 128),
		lib_ui_col_iconPlus: RGB(255, 202, 128),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(24, 50, 82),
		lib_ui_col_iconMinus_e: RGB(255, 202, 128),
		lib_ui_col_iconMinus_c: RGB(255, 202, 128),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),
		lib_ui_col_text: RGB(230, 230, 230),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(255, 202, 128),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(230, 230, 230),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(230, 230, 230),
		lib_ui_col_search: RGB(230, 230, 230),
		lib_ui_col_searchBtn: RGB(255, 202, 128),
		lib_ui_col_crossBtn: RGB(255, 202, 128),
		lib_ui_col_filterBtn: RGB(230, 230, 230),
		lib_ui_col_settingsBtn: RGB(230, 230, 230),
		lib_ui_col_line: RGB(12, 21, 31),
		lib_ui_col_s_line: RGB(12, 21, 31),
		lib_ui_col_sbarBtns: RGB(220, 220, 220),
		lib_ui_col_sbarNormal: RGB(36, 84, 143),
		lib_ui_col_sbarHovered: RGB(255, 202, 128),
		lib_ui_col_sbarDrag: RGB(255, 202, 128),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS
		bio_ui_col_bg: RGB(21, 37, 56),
		bio_ui_col_rowStripes: RGB(22, 40, 63),
		bio_ui_col_headingText: RGB(255, 202, 128),
		bio_ui_col_bottomLine: RGB(12, 21, 31),
		bio_ui_col_centerLine: RGB(12, 21, 31),
		bio_ui_col_sectionLine: RGB(12, 21, 31),
		bio_ui_col_text: RGB(230, 230, 230),
		bio_ui_col_source: RGB(255, 202, 128),
		bio_ui_col_accent: RGB(255, 202, 128),
		bio_ui_col_summary: RGB(230, 230, 230),
		bio_ui_col_popupBg: RGB(24, 50, 82),
		bio_ui_col_popupText: RGB(255, 202, 128),
		bio_ui_col_lyricsNormal: RGB(230, 230, 230),
		bio_ui_col_lyricsHighlight: RGB(255, 202, 128),
		bio_ui_col_noPhotoStubBg: RGB(24, 50, 82),
		bio_ui_col_noPhotoStubText: RGB(255, 202, 128),
		bio_ui_col_sbarBtns: RGB(220, 220, 220),
		bio_ui_col_sbarNormal: RGB(36, 84, 143),
		bio_ui_col_sbarHovered: RGB(255, 202, 128),
		bio_ui_col_sbarDrag: RGB(255, 202, 128),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS
		grCol_bg: RGB(22, 40, 63),
		grCol_shadow: RGBA(0, 0, 0, 75),
		grCol_discArtShadow: RGBA(0, 0, 0, 80),
		grCol_noAlbumArtStub: RGB(255, 202, 128),
		grCol_lowerBarArtist: RGB(255, 202, 128),
		grCol_lowerBarTitle: RGB(230, 230, 230),
		grCol_lowerBarTime: RGB(230, 230, 230),
		grCol_lowerBarLength: RGB(230, 230, 230),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(255, 202, 128),
		grCol_lyricsShadow: RGB(0, 0, 0),
		grCol_detailsBg: RGB(21, 37, 56),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(255, 202, 128),
		grCol_timelinePlayed: RGB(204, 161, 102),
		grCol_timelineUnplayed: RGB(155, 110, 70),
		grCol_timelineFrame: RGB(21, 37, 56),
		grCol_popupBg: RGB(24, 50, 82),
		grCol_popupText: RGB(255, 202, 128),
		grCol_menuBgColor: RGB(27, 55, 90),
		grCol_menuStyleBg: RGB(25, 45, 70),
		grCol_menuRectStyleEmbossTop: RGB(35, 70, 115),
		grCol_menuRectStyleEmbossBottom: RGB(6, 10, 15),
		grCol_menuRectNormal: RGB(200, 200, 200),
		grCol_menuRectHovered: RGB(50, 90, 150),
		grCol_menuRectDown: RGB(50, 90, 150),
		grCol_menuTextNormal: RGB(230, 230, 230),
		grCol_menuTextHovered: RGB(255, 255, 255),
		grCol_menuTextDown: RGB(255, 255, 255),
		grCol_transportEllipseBg: RGB(27, 55, 90),
		grCol_transportEllipseNormal: RGB(20, 33, 48),
		grCol_transportEllipseHovered: RGB(50, 90, 150),
		grCol_transportEllipseDown: RGB(50, 90, 150),
		grCol_transportStyleBg: RGB(25, 45, 70),
		grCol_transportStyleTop: RGB(38, 70, 110),
		grCol_transportStyleBottom: RGB(18, 30, 50),
		grCol_transportIconNormal: RGB(255, 202, 128),
		grCol_transportIconHovered: RGB(255, 255, 255),
		grCol_transportIconDown: RGB(255, 255, 255),
		grCol_progressBar: RGB(27, 55, 90),
		grCol_progressBarStreaming: RGB(255, 202, 128),
		grCol_progressBarFrame: RGB(22, 37, 54),
		grCol_progressBarFill: RGB(255, 202, 128),
		grCol_peakmeterBarProg: RGB(27, 55, 90),
		grCol_peakmeterBarProgFill: RGB(255, 233, 187),
		grCol_peakmeterBarFillTop: RGB(255, 214, 143),
		grCol_peakmeterBarFillMiddle: RGB(255, 220, 158),
		grCol_peakmeterBarFillBack: RGB(217, 172, 109),
		grCol_peakmeterBarVertProgFill: RGB(255, 202, 128),
		grCol_peakmeterBarVertFill: RGB(255, 202, 128),
		grCol_peakmeterBarVertFillPeaks: RGB(255, 242, 205),
		grCol_waveformBarFillFront: RGB(255, 202, 128),
		grCol_waveformBarFillBack: RGB(204, 162, 102),
		grCol_waveformBarFillPreFront: RGB(65, 110, 180),
		grCol_waveformBarFillPreBack: RGB(45, 80, 130),
		grCol_waveformBarIndicator: RGB(255, 255, 255),
		grCol_volumeBar: RGB(27, 55, 90),
		grCol_volumeBarFrame: RGB(20, 33, 48),
		grCol_volumeBarFill: RGB(255, 202, 128),
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: RGBA(0, 0, 0, 140),
		grCol_styleGradient2: RGB(10, 20, 35),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Red theme used in Options > Theme > Red.
	 * @type {object}
	 * @static
	 */
	static redTheme = {
		// * CORE COLORS * //
		primary: RGB(245, 212, 165),
		secondary: RGB(110, 20, 20),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(110, 20, 20),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(110, 20, 20),
		pl_col_plman_text_normal: RGB(220, 220, 220),
		pl_col_plman_text_hovered: RGB(255, 255, 255),
		pl_col_plman_text_pressed: RGB(220, 220, 220),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(130, 25, 25),
		pl_col_header_sideMarker: RGB(245, 212, 165),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(245, 212, 165),
		pl_col_header_album_normal: RGB(220, 220, 220),
		pl_col_header_album_playing: RGB(245, 245, 245),
		pl_col_header_info_normal: RGB(220, 220, 220),
		pl_col_header_info_playing: RGB(245, 245, 245),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(245, 245, 245),
		pl_col_header_line_normal: RGB(75, 18, 18),
		pl_col_header_line_playing: RGB(75, 18, 18),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(130, 25, 25),
		pl_col_row_stripes_bg: RGB(100, 20, 20),
		pl_col_row_selection_bg: RGB(110, 20, 20),
		pl_col_row_selection_frame: RGB(145, 25, 25),
		pl_col_row_sideMarker: RGB(245, 212, 165),
		pl_col_row_title_normal: RGB(220, 220, 220),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(75, 18, 18),
		pl_col_row_drag_line: RGB(174, 30, 30),
		pl_col_row_drag_line_reached: RGB(245, 212, 165),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(220, 220, 220),
		pl_col_sbar_btn_hovered: RGB(255, 255, 255),
		pl_col_sbar_thumb_normal: RGB(145, 25, 25),
		pl_col_sbar_thumb_hovered: RGB(245, 212, 165),
		pl_col_sbar_thumb_drag: RGB(245, 212, 165),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(110, 20, 20),
		lib_ui_col_rowStripes: RGB(100, 20, 20),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(130, 25, 25),
		lib_ui_col_sideMarker: RGB(245, 212, 165),
		lib_ui_col_selectionFrame: RGB(145, 25, 25),
		lib_ui_col_selectionFrame2: RGB(245, 212, 165),
		lib_ui_col_hoverFrame: RGB(245, 212, 165),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(245, 212, 165),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(140, 25, 25),
		lib_ui_col_iconMinus_e: RGB(245, 212, 165),
		lib_ui_col_iconMinus_c: RGB(245, 212, 165),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(230, 230, 230),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(245, 212, 165),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(230, 230, 230),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(230, 230, 230),
		lib_ui_col_count: RGB(230, 230, 230),
		lib_ui_col_search: RGB(230, 230, 230),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(245, 212, 165),
		lib_ui_col_crossBtn: RGB(245, 212, 165),
		lib_ui_col_filterBtn: RGB(230, 230, 230),
		lib_ui_col_settingsBtn: RGB(230, 230, 230),
		lib_ui_col_line: RGB(75, 18, 18),
		lib_ui_col_s_line: RGB(75, 18, 18),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(220, 220, 220),
		lib_ui_col_sbarNormal: RGB(198, 32, 32),
		lib_ui_col_sbarHovered: RGB(245, 212, 165),
		lib_ui_col_sbarDrag: RGB(245, 212, 165),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(110, 20, 20),
		bio_ui_col_rowStripes: RGB(100, 20, 20),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(245, 212, 165),
		bio_ui_col_bottomLine: RGB(75, 18, 18),
		bio_ui_col_centerLine: RGB(75, 18, 18),
		bio_ui_col_sectionLine: RGB(75, 18, 18),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(220, 220, 220),
		bio_ui_col_source: RGB(245, 212, 165),
		bio_ui_col_accent: RGB(245, 212, 165),
		bio_ui_col_summary: RGB(220, 220, 220),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(130, 25, 25),
		bio_ui_col_popupText: RGB(245, 212, 165),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(220, 220, 220),
		bio_ui_col_lyricsHighlight: RGB(245, 212, 165),
		bio_ui_col_noPhotoStubBg: RGB(130, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(245, 212, 165),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(220, 220, 220),
		bio_ui_col_sbarNormal: RGB(198, 32, 32),
		bio_ui_col_sbarHovered: RGB(245, 212, 165),
		bio_ui_col_sbarDrag: RGB(245, 212, 165),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(100, 20, 20),
		grCol_shadow: RGBA(0, 0, 0, 75),
		grCol_discArtShadow: RGBA(0, 0, 0, 80),
		grCol_noAlbumArtStub: RGB(245, 212, 165),
		grCol_lowerBarArtist: RGB(245, 212, 165),
		grCol_lowerBarTitle: RGB(220, 220, 220),
		grCol_lowerBarTime: RGB(220, 220, 220),
		grCol_lowerBarLength: RGB(220, 220, 220),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(245, 212, 165),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(110, 20, 20),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(245, 212, 165),
		grCol_timelinePlayed: RGB(207, 170, 118),
		grCol_timelineUnplayed: RGB(170, 120, 95),
		grCol_timelineFrame: RGB(110, 20, 20),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(130, 25, 25),
		grCol_popupText: RGB(245, 212, 165),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(140, 25, 25),
		grCol_menuStyleBg: RGB(100, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(158, 30, 30),
		grCol_menuRectStyleEmbossBottom: RGB(54, 10, 10),
		grCol_menuRectNormal: RGB(200, 200, 200),
		grCol_menuRectHovered: RGB(204, 45, 45),
		grCol_menuRectDown: RGB(204, 45, 45),
		grCol_menuTextNormal: RGB(220, 220, 220),
		grCol_menuTextHovered: RGB(255, 255, 255),
		grCol_menuTextDown: RGB(255, 255, 255),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(140, 25, 25),
		grCol_transportEllipseNormal: RGB(82, 19, 19),
		grCol_transportEllipseHovered: RGB(204, 45, 45),
		grCol_transportEllipseDown: RGB(204, 45, 45),
		grCol_transportStyleBg: RGB(100, 20, 20),
		grCol_transportStyleTop: RGB(160, 32, 32),
		grCol_transportStyleBottom: RGB(66, 13, 13),
		grCol_transportIconNormal: RGB(245, 212, 165),
		grCol_transportIconHovered: RGB(255, 255, 255),
		grCol_transportIconDown: RGB(255, 255, 255),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(140, 25, 25),
		grCol_progressBarStreaming: RGB(245, 212, 165),
		grCol_progressBarFrame: RGB(92, 21, 21),
		grCol_progressBarFill: RGB(245, 212, 165),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(140, 25, 25),
		grCol_peakmeterBarProgFill: RGB(250, 217, 170),
		grCol_peakmeterBarFillTop: RGB(247, 214, 167),
		grCol_peakmeterBarFillMiddle: RGB(250, 217, 170),
		grCol_peakmeterBarFillBack: RGB(208, 180, 140),
		grCol_peakmeterBarVertProgFill: RGB(245, 212, 165),
		grCol_peakmeterBarVertFill: RGB(245, 212, 165),
		grCol_peakmeterBarVertFillPeaks: RGB(250, 232, 205),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(245, 212, 165),
		grCol_waveformBarFillBack: RGB(196, 170, 132),
		grCol_waveformBarFillPreFront: RGB(230, 45, 45),
		grCol_waveformBarFillPreBack: RGB(180, 35, 35),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(140, 25, 25),
		grCol_volumeBarFrame: RGB(82, 19, 19),
		grCol_volumeBarFill: RGB(245, 212, 165),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: RGBA(0, 0, 0, 90),
		grCol_styleGradient2: RGB(65, 13, 13),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Cream theme used in Options > Theme > Cream.
	 * @type {object}
	 * @static
	 */
	static creamTheme = {
		// * CORE COLORS * //
		primary: RGB(120, 170, 130),
		secondary: RGB(255, 247, 245),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(255, 247, 245),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(255, 247, 245),
		pl_col_plman_text_normal: RGB(220, 220, 220),
		pl_col_plman_text_hovered: RGB(110, 110, 110),
		pl_col_plman_text_pressed: RGB(80, 80, 80),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(120, 170, 130),
		pl_col_header_sideMarker: RGB(120, 170, 130),
		pl_col_header_artist_normal: RGB(100, 150, 110),
		pl_col_header_artist_playing: RGB(255, 255, 255),
		pl_col_header_album_normal: RGB(110, 110, 110),
		pl_col_header_album_playing: RGB(245, 245, 245),
		pl_col_header_info_normal: RGB(110, 110, 110),
		pl_col_header_info_playing: RGB(245, 245, 245),
		pl_col_header_date_normal: RGB(120, 120, 120),
		pl_col_header_date_playing: RGB(245, 245, 245),
		pl_col_header_line_normal: RGB(200, 200, 200),
		pl_col_header_line_playing: RGB(220, 220, 220),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(120, 170, 130),
		pl_col_row_stripes_bg: RGB(255, 255, 255),
		pl_col_row_selection_bg: RGB(200, 200, 200),
		pl_col_row_selection_frame: RGB(200, 200, 200),
		pl_col_row_sideMarker: RGB(120, 170, 130),
		pl_col_row_title_normal: RGB(90, 90, 90),
		pl_col_row_title_playing: RGB(245, 245, 245),
		pl_col_row_title_playing_dark: RGB(0, 0, 0),
		pl_col_row_title_playing_light: RGB(245, 245, 245),
		pl_col_row_title_selected: RGB(0, 0, 0),
		pl_col_row_title_hovered: RGB(0, 0, 0),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(200, 200, 200),
		pl_col_row_drag_line: RGB(240, 240, 240),
		pl_col_row_drag_line_reached: RGB(120, 170, 130),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(120, 170, 130),
		pl_col_sbar_btn_hovered: RGB(100, 100, 100),
		pl_col_sbar_thumb_normal: RGB(200, 200, 200),
		pl_col_sbar_thumb_hovered: RGB(120, 170, 130),
		pl_col_sbar_thumb_drag: RGB(120, 170, 130),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(255, 247, 245),
		lib_ui_col_rowStripes: RGB(255, 255, 255),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(120, 170, 130),
		lib_ui_col_sideMarker: RGB(120, 170, 130),
		lib_ui_col_selectionFrame: RGB(200, 200, 200),
		lib_ui_col_selectionFrame2: RGB(120, 170, 130),
		lib_ui_col_hoverFrame: RGB(120, 170, 130),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(100, 150, 110),
		lib_ui_col_iconPlus_h: RGB(0, 0, 0),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(255, 255, 255),
		lib_ui_col_iconMinus_e: RGB(100, 150, 110),
		lib_ui_col_iconMinus_c: RGB(100, 150, 110),
		lib_ui_col_iconMinus_h: RGB(0, 0, 0),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(90, 90, 90),
		lib_ui_col_text_h: RGB(0, 0, 0),
		lib_ui_col_text_nowp: RGB(255, 255, 255),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(90, 90, 90),
		lib_ui_col_txt_h: RGB(0, 0, 0),
		lib_ui_col_txt_box: RGB(90, 90, 90),
		lib_ui_col_count: RGB(90, 90, 90),
		lib_ui_col_search: RGB(90, 90, 90),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(120, 170, 130),
		lib_ui_col_crossBtn: RGB(120, 170, 130),
		lib_ui_col_filterBtn: RGB(120, 120, 120),
		lib_ui_col_settingsBtn: RGB(120, 170, 130),
		lib_ui_col_line: RGB(200, 200, 200),
		lib_ui_col_s_line: RGB(200, 200, 200),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(120, 170, 130),
		lib_ui_col_sbarNormal: RGB(116, 127, 129),
		lib_ui_col_sbarHovered: RGB(120, 170, 130),
		lib_ui_col_sbarDrag: RGB(120, 170, 130),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(255, 247, 245),
		bio_ui_col_rowStripes: RGB(255, 255, 255),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(100, 100, 100),
		bio_ui_col_bottomLine: RGB(200, 200, 200),
		bio_ui_col_centerLine: RGB(200, 200, 200),
		bio_ui_col_sectionLine: RGB(200, 200, 200),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(90, 90, 90),
		bio_ui_col_source: RGB(100, 100, 100),
		bio_ui_col_accent: RGB(100, 100, 100),
		bio_ui_col_summary: RGB(90, 90, 90),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(120, 170, 130),
		bio_ui_col_popupText: RGB(255, 255, 255),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(90, 90, 90),
		bio_ui_col_lyricsHighlight: RGB(100, 150, 110),
		bio_ui_col_noPhotoStubBg: RGB(255, 247, 240),
		bio_ui_col_noPhotoStubText: RGB(120, 170, 130),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(120, 170, 130),
		bio_ui_col_sbarNormal: RGB(116, 127, 129),
		bio_ui_col_sbarHovered: RGB(120, 170, 130),
		bio_ui_col_sbarDrag: RGB(120, 170, 130),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(255, 247, 240),
		grCol_shadow: RGBA(0, 0, 0, 25),
		grCol_discArtShadow: RGBA(0, 0, 0, 10),
		grCol_noAlbumArtStub: RGB(100, 150, 110),
		grCol_lowerBarArtist: RGB(100, 150, 110),
		grCol_lowerBarTitle: RGB(100, 100, 100),
		grCol_lowerBarTime: RGB(100, 100, 100),
		grCol_lowerBarLength: RGB(100, 100, 100),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(100, 150, 110),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(255, 247, 245),
		grCol_detailsText: RGB(120, 120, 120),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(120, 170, 130),
		grCol_timelinePlayed: RGB(139, 196, 151),
		grCol_timelineUnplayed: RGB(158, 222, 171),
		grCol_timelineFrame: RGB(255, 247, 245),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(120, 170, 130),
		grCol_popupText: RGB(255, 255, 255),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(247, 239, 233),
		grCol_menuStyleBg: RGB(229, 222, 216),
		grCol_menuRectStyleEmbossTop: RGB(255, 255, 255),
		grCol_menuRectStyleEmbossBottom: RGB(215, 215, 215),
		grCol_menuRectNormal: RGB(100, 150, 110),
		grCol_menuRectHovered: RGB(190, 190, 190),
		grCol_menuRectDown: RGB(190, 190, 190),
		grCol_menuTextNormal: RGB(100, 150, 110),
		grCol_menuTextHovered: RGB(100, 100, 100),
		grCol_menuTextDown: RGB(100, 100, 100),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(255, 255, 255),
		grCol_transportEllipseNormal: RGB(220, 220, 220),
		grCol_transportEllipseHovered: RGB(200, 200, 200),
		grCol_transportEllipseDown: RGB(200, 200, 200),
		grCol_transportStyleBg: RGB(229, 222, 216),
		grCol_transportStyleTop: RGB(255, 255, 255),
		grCol_transportStyleBottom: RGB(220, 220, 220),
		grCol_transportIconNormal: RGB(100, 150, 110),
		grCol_transportIconHovered: RGB(100, 100, 100),
		grCol_transportIconDown: RGB(100, 100, 100),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(255, 255, 255),
		grCol_progressBarStreaming: RGB(120, 170, 130),
		grCol_progressBarFrame: RGB(230, 230, 230),
		grCol_progressBarFill: RGB(120, 170, 130),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(255, 255, 255),
		grCol_peakmeterBarProgFill: RGB(166, 214, 176),
		grCol_peakmeterBarFillTop: RGB(132, 187, 143),
		grCol_peakmeterBarFillMiddle: RGB(144, 194, 156),
		grCol_peakmeterBarFillBack: RGB(102, 145, 111),
		grCol_peakmeterBarVertProgFill: RGB(120, 170, 130),
		grCol_peakmeterBarVertFill: RGB(120, 170, 130),
		grCol_peakmeterBarVertFillPeaks: RGB(96, 136, 104),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(120, 170, 130),
		grCol_waveformBarFillBack: RGB(96, 136, 104),
		grCol_waveformBarFillPreFront: RGB(180, 175, 165),
		grCol_waveformBarFillPreBack: RGB(140, 135, 130),
		grCol_waveformBarIndicator: RGB(60, 60, 60),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(255, 255, 255),
		grCol_volumeBarFrame: RGB(220, 220, 220),
		grCol_volumeBarFill: RGB(120, 170, 130),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Neon blue theme used in Options > Theme > Neon blue.
	 * @type {object}
	 * @static
	 */
	static nblueTheme = {
		// * CORE COLORS * //
		primary: RGB(0, 200, 255),
		secondary: RGB(10, 10, 10),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(10, 10, 10),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(10, 10, 10),
		pl_col_plman_text_normal: RGB(200, 200, 200),
		pl_col_plman_text_hovered: RGB(220, 220, 220),
		pl_col_plman_text_pressed: RGB(255, 255, 255),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(25, 25, 25),
		pl_col_header_sideMarker: RGB(0, 200, 255),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(0, 200, 255),
		pl_col_header_album_normal: RGB(220, 220, 220),
		pl_col_header_album_playing: RGB(240, 240, 240),
		pl_col_header_info_normal: RGB(220, 220, 220),
		pl_col_header_info_playing: RGB(240, 240, 240),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(0, 200, 255),
		pl_col_header_line_normal: RGB(45, 45, 45),
		pl_col_header_line_playing: RGB(50, 50, 50),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(25, 25, 25),
		pl_col_row_stripes_bg: RGB(20, 20, 20),
		pl_col_row_selection_bg: RGB(10, 10, 10),
		pl_col_row_selection_frame: RGB(40, 40, 40),
		pl_col_row_sideMarker: RGB(0, 200, 255),
		pl_col_row_title_normal: RGB(200, 200, 200),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(45, 45, 45),
		pl_col_row_drag_line: RGB(48, 48, 48),
		pl_col_row_drag_line_reached: RGB(0, 200, 255),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(0, 200, 255),
		pl_col_sbar_btn_hovered: RGB(0, 238, 255),
		pl_col_sbar_thumb_normal: RGB(0, 200, 255),
		pl_col_sbar_thumb_hovered: RGB(0, 238, 255),
		pl_col_sbar_thumb_drag: RGB(0, 238, 255),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(10, 10, 10),
		lib_ui_col_rowStripes: RGB(20, 20, 20),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(25, 25, 25),
		lib_ui_col_sideMarker: RGB(0, 200, 255),
		lib_ui_col_selectionFrame: RGB(40, 40, 40),
		lib_ui_col_selectionFrame2: RGB(0, 200, 255),
		lib_ui_col_hoverFrame: RGB(0, 200, 255),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(0, 200, 255),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(0, 200, 255),
		lib_ui_col_iconMinus_c: RGB(0, 200, 255),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(200, 200, 200),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(0, 200, 255),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(200, 200, 200),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(200, 200, 200),
		lib_ui_col_count: RGB(200, 200, 200),
		lib_ui_col_search: RGB(200, 200, 200),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(0, 200, 255),
		lib_ui_col_crossBtn: RGB(0, 200, 255),
		lib_ui_col_filterBtn: RGB(200, 200, 200),
		lib_ui_col_settingsBtn: RGB(0, 200, 255),
		lib_ui_col_line: RGB(45, 45, 45),
		lib_ui_col_s_line: RGB(45, 45, 45),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(0, 200, 255),
		lib_ui_col_sbarNormal: RGB(0, 200, 255),
		lib_ui_col_sbarHovered: RGB(0, 238, 255),
		lib_ui_col_sbarDrag: RGB(0, 238, 255),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(10, 10, 10),
		bio_ui_col_rowStripes: RGB(20, 20, 20),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(0, 200, 255),
		bio_ui_col_bottomLine: RGB(55, 55, 55),
		bio_ui_col_centerLine: RGB(55, 55, 55),
		bio_ui_col_sectionLine: RGB(55, 55, 55),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(200, 200, 200),
		bio_ui_col_source: RGB(0, 200, 255),
		bio_ui_col_accent: RGB(0, 200, 255),
		bio_ui_col_summary: RGB(200, 200, 200),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(25, 25, 25),
		bio_ui_col_popupText: RGB(0, 200, 255),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(200, 200, 200),
		bio_ui_col_lyricsHighlight: RGB(0, 200, 255),
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(0, 200, 255),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(0, 200, 255),
		bio_ui_col_sbarNormal: RGB(0, 200, 255),
		bio_ui_col_sbarHovered: RGB(0, 238, 255),
		bio_ui_col_sbarDrag: RGB(0, 238, 255),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(20, 20, 20),
		grCol_shadow: RGBA(0, 0, 0, 255),
		grCol_discArtShadow: RGBA(0, 0, 0, 40),
		grCol_noAlbumArtStub: RGB(0, 200, 255),
		grCol_lowerBarArtist: RGB(0, 200, 255),
		grCol_lowerBarTitle: RGB(220, 220, 220),
		grCol_lowerBarTime: RGB(220, 220, 220),
		grCol_lowerBarLength: RGB(220, 220, 220),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(0, 200, 255),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(10, 10, 10),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(0, 200, 255),
		grCol_timelinePlayed: RGB(0, 160, 205),
		grCol_timelineUnplayed: RGB(0, 120, 155),
		grCol_timelineFrame: RGB(10, 10, 10),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(25, 25, 25),
		grCol_popupText: RGB(0, 200, 255),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(50, 50, 50),
		grCol_menuStyleBg: RGB(20, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(60, 60, 60),
		grCol_menuRectStyleEmbossBottom: RGB(0, 0, 0),
		grCol_menuRectNormal: RGB(0, 200, 255),
		grCol_menuRectHovered: RGB(0, 238, 255),
		grCol_menuRectDown: RGB(0, 238, 255),
		grCol_menuTextNormal: RGB(0, 200, 255),
		grCol_menuTextHovered: RGB(0, 238, 255),
		grCol_menuTextDown: RGB(0, 238, 255),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(35, 35, 35),
		grCol_transportEllipseNormal: RGB(50, 50, 50),
		grCol_transportEllipseHovered: RGB(0, 238, 255),
		grCol_transportEllipseDown: RGB(0, 238, 255),
		grCol_transportStyleBg: RGB(0, 0, 0),
		grCol_transportStyleTop: RGB(50, 50, 50),
		grCol_transportStyleBottom: RGB(0, 0, 0),
		grCol_transportIconNormal: RGB(0, 200, 255),
		grCol_transportIconHovered: RGB(0, 238, 255),
		grCol_transportIconDown: RGB(0, 238, 255),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(35, 35, 35),
		grCol_progressBarStreaming: RGB(0, 238, 255),
		grCol_progressBarFrame: RGB(20, 20, 20),
		grCol_progressBarFill: RGB(0, 200, 255),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(35, 35, 35),
		grCol_peakmeterBarProgFill: RGB(51, 220, 255),
		grCol_peakmeterBarFillTop: RGB(20, 220, 255),
		grCol_peakmeterBarFillMiddle: RGB(36, 220, 255),
		grCol_peakmeterBarFillBack: RGB(0, 170, 217),
		grCol_peakmeterBarVertProgFill: RGB(0, 200, 255),
		grCol_peakmeterBarVertFill: RGB(0, 200, 255),
		grCol_peakmeterBarVertFillPeaks: RGB(102, 220, 255),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(0, 200, 255),
		grCol_waveformBarFillBack: RGB(0, 160, 204),
		grCol_waveformBarFillPreFront: RGB(100, 100, 100),
		grCol_waveformBarFillPreBack: RGB(80, 80, 80),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(35, 35, 35),
		grCol_volumeBarFrame: RGB(50, 50, 50),
		grCol_volumeBarFill: RGB(0, 200, 255),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleAlternative: RGB(20, 20, 20),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Neon green theme used in Options > Theme > Neon green.
	 * @type {object}
	 * @static
	 */
	static ngreenTheme = {
		// * CORE COLORS * //
		primary: RGB(0, 200, 0),
		secondary: RGB(10, 10, 10),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(10, 10, 10),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(10, 10, 10),
		pl_col_plman_text_normal: RGB(200, 200, 200),
		pl_col_plman_text_hovered: RGB(220, 220, 220),
		pl_col_plman_text_pressed: RGB(255, 255, 255),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(25, 25, 25),
		pl_col_header_sideMarker: RGB(0, 200, 0),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(0, 200, 0),
		pl_col_header_album_normal: RGB(220, 220, 220),
		pl_col_header_album_playing: RGB(240, 240, 240),
		pl_col_header_info_normal: RGB(220, 220, 220),
		pl_col_header_info_playing: RGB(240, 240, 240),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(0, 200, 0),
		pl_col_header_line_normal: RGB(45, 45, 45),
		pl_col_header_line_playing: RGB(50, 50, 50),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(25, 25, 25),
		pl_col_row_stripes_bg: RGB(20, 20, 20),
		pl_col_row_selection_bg: RGB(10, 10, 10),
		pl_col_row_selection_frame: RGB(40, 40, 40),
		pl_col_row_sideMarker: RGB(0, 200, 0),
		pl_col_row_title_normal: RGB(200, 200, 200),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(45, 45, 45),
		pl_col_row_drag_line: RGB(48, 48, 48),
		pl_col_row_drag_line_reached: RGB(0, 200, 0),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(0, 200, 0),
		pl_col_sbar_btn_hovered: RGB(0, 255, 0),
		pl_col_sbar_thumb_normal: RGB(0, 200, 0),
		pl_col_sbar_thumb_hovered: RGB(0, 255, 0),
		pl_col_sbar_thumb_drag: RGB(0, 255, 0),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(10, 10, 10),
		lib_ui_col_rowStripes: RGB(20, 20, 20),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(25, 25, 25),
		lib_ui_col_sideMarker: RGB(0, 200, 0),
		lib_ui_col_selectionFrame: RGB(40, 40, 40),
		lib_ui_col_selectionFrame2: RGB(0, 200, 0),
		lib_ui_col_hoverFrame: RGB(0, 200, 0),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(0, 200, 0),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(0, 200, 0),
		lib_ui_col_iconMinus_c: RGB(0, 200, 0),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(200, 200, 200),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(0, 200, 0),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(200, 200, 200),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(200, 200, 200),
		lib_ui_col_count: RGB(200, 200, 200),
		lib_ui_col_search: RGB(200, 200, 200),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(0, 200, 0),
		lib_ui_col_crossBtn: RGB(0, 200, 0),
		lib_ui_col_filterBtn: RGB(200, 200, 200),
		lib_ui_col_settingsBtn: RGB(0, 200, 0),
		lib_ui_col_line: RGB(45, 45, 45),
		lib_ui_col_s_line: RGB(45, 45, 45),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(0, 200, 0),
		lib_ui_col_sbarNormal: RGB(0, 200, 0),
		lib_ui_col_sbarHovered: RGB(0, 255, 0),
		lib_ui_col_sbarDrag: RGB(0, 255, 0),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(10, 10, 10),
		bio_ui_col_rowStripes: RGB(20, 20, 20),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(0, 200, 0),
		bio_ui_col_bottomLine: RGB(55, 55, 55),
		bio_ui_col_centerLine: RGB(55, 55, 55),
		bio_ui_col_sectionLine: RGB(55, 55, 55),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(200, 200, 200),
		bio_ui_col_source: RGB(0, 200, 0),
		bio_ui_col_accent: RGB(0, 200, 0),
		bio_ui_col_summary: RGB(200, 200, 200),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(25, 25, 25),
		bio_ui_col_popupText: RGB(0, 200, 0),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(200, 200, 200),
		bio_ui_col_lyricsHighlight: RGB(0, 200, 0),
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(0, 200, 0),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(0, 200, 0),
		bio_ui_col_sbarNormal: RGB(0, 200, 0),
		bio_ui_col_sbarHovered: RGB(0, 255, 0),
		bio_ui_col_sbarDrag: RGB(0, 255, 0),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(20, 20, 20),
		grCol_shadow: RGBA(0, 0, 0, 255),
		grCol_discArtShadow: RGBA(0, 0, 0, 40),
		grCol_noAlbumArtStub: RGB(0, 200, 0),
		grCol_lowerBarArtist: RGB(0, 200, 0),
		grCol_lowerBarTitle: RGB(220, 220, 220),
		grCol_lowerBarTime: RGB(220, 220, 220),
		grCol_lowerBarLength: RGB(220, 220, 220),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(0, 200, 0),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(10, 10, 10),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(0, 200, 0),
		grCol_timelinePlayed: RGB(0, 150, 0),
		grCol_timelineUnplayed: RGB(0, 100, 0),
		grCol_timelineFrame: RGB(10, 10, 10),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(25, 25, 25),
		grCol_popupText: RGB(0, 200, 0),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(50, 50, 50),
		grCol_menuStyleBg: RGB(20, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(60, 60, 60),
		grCol_menuRectStyleEmbossBottom: RGB(0, 0, 0),
		grCol_menuRectNormal: RGB(0, 200, 0),
		grCol_menuRectHovered: RGB(0, 255, 0),
		grCol_menuRectDown: RGB(0, 255, 0),
		grCol_menuTextNormal: RGB(0, 200, 0),
		grCol_menuTextHovered: RGB(0, 255, 0),
		grCol_menuTextDown: RGB(0, 255, 0),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(35, 35, 35),
		grCol_transportEllipseNormal: RGB(50, 50, 50),
		grCol_transportEllipseHovered: RGB(0, 255, 0),
		grCol_transportEllipseDown: RGB(0, 255, 0),
		grCol_transportStyleBg: RGB(0, 0, 0),
		grCol_transportStyleTop: RGB(50, 50, 50),
		grCol_transportStyleBottom: RGB(0, 0, 0),
		grCol_transportIconNormal: RGB(0, 200, 0),
		grCol_transportIconHovered: RGB(0, 255, 0),
		grCol_transportIconDown: RGB(0, 255, 0),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(35, 35, 35),
		grCol_progressBarStreaming: RGB(0, 255, 0),
		grCol_progressBarFrame: RGB(20, 20, 20),
		grCol_progressBarFill: RGB(0, 200, 0),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(35, 35, 35),
		grCol_peakmeterBarProgFill: RGB(51, 255, 51),
		grCol_peakmeterBarFillTop: RGB(20, 255, 20),
		grCol_peakmeterBarFillMiddle: RGB(36, 255, 36),
		grCol_peakmeterBarFillBack: RGB(0, 170, 0),
		grCol_peakmeterBarVertProgFill: RGB(0, 200, 0),
		grCol_peakmeterBarVertFill: RGB(0, 200, 0),
		grCol_peakmeterBarVertFillPeaks: RGB(102, 255, 102),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(0, 200, 0),
		grCol_waveformBarFillBack: RGB(0, 160, 0),
		grCol_waveformBarFillPreFront: RGB(100, 100, 100),
		grCol_waveformBarFillPreBack: RGB(80, 80, 80),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(35, 35, 35),
		grCol_volumeBarFrame: RGB(50, 50, 50),
		grCol_volumeBarFill: RGB(0, 200, 0),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleAlternative: RGB(20, 20, 20),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Neon red theme used in Options > Theme > Neon red.
	 * @type {object}
	 * @static
	 */
	static nredTheme = {
		// * CORE COLORS * //
		primary: RGB(240, 10, 60),
		secondary: RGB(10, 10, 10),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(10, 10, 10),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(10, 10, 10),
		pl_col_plman_text_normal: RGB(200, 200, 200),
		pl_col_plman_text_hovered: RGB(220, 220, 220),
		pl_col_plman_text_pressed: RGB(255, 255, 255),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(25, 25, 25),
		pl_col_header_sideMarker: RGB(240, 10, 60),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(240, 10, 60),
		pl_col_header_album_normal: RGB(220, 220, 220),
		pl_col_header_album_playing: RGB(240, 240, 240),
		pl_col_header_info_normal: RGB(220, 220, 220),
		pl_col_header_info_playing: RGB(240, 240, 240),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(240, 10, 60),
		pl_col_header_line_normal: RGB(45, 45, 45),
		pl_col_header_line_playing: RGB(50, 50, 50),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(25, 25, 25),
		pl_col_row_stripes_bg: RGB(20, 20, 20),
		pl_col_row_selection_bg: RGB(10, 10, 10),
		pl_col_row_selection_frame: RGB(40, 40, 40),
		pl_col_row_sideMarker: RGB(240, 10, 60),
		pl_col_row_title_normal: RGB(200, 200, 200),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(45, 45, 45),
		pl_col_row_drag_line: RGB(48, 48, 48),
		pl_col_row_drag_line_reached: RGB(240, 10, 60),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(240, 10, 60),
		pl_col_sbar_btn_hovered: RGB(255, 8, 8),
		pl_col_sbar_thumb_normal: RGB(240, 10, 60),
		pl_col_sbar_thumb_hovered: RGB(255, 8, 8),
		pl_col_sbar_thumb_drag: RGB(255, 8, 8),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(10, 10, 10),
		lib_ui_col_rowStripes: RGB(20, 20, 20),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(25, 25, 25),
		lib_ui_col_sideMarker: RGB(240, 10, 60),
		lib_ui_col_selectionFrame: RGB(40, 40, 40),
		lib_ui_col_selectionFrame2: RGB(240, 10, 60),
		lib_ui_col_hoverFrame: RGB(240, 10, 60),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(240, 10, 60),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(240, 10, 60),
		lib_ui_col_iconMinus_c: RGB(240, 10, 60),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(200, 200, 200),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(240, 10, 60),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(200, 200, 200),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(200, 200, 200),
		lib_ui_col_count: RGB(200, 200, 200),
		lib_ui_col_search: RGB(200, 200, 200),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(240, 10, 60),
		lib_ui_col_crossBtn: RGB(240, 10, 60),
		lib_ui_col_filterBtn: RGB(200, 200, 200),
		lib_ui_col_settingsBtn: RGB(240, 10, 60),
		lib_ui_col_line: RGB(45, 45, 45),
		lib_ui_col_s_line: RGB(45, 45, 45),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(240, 10, 60),
		lib_ui_col_sbarNormal: RGB(240, 10, 60),
		lib_ui_col_sbarHovered: RGB(255, 8, 8),
		lib_ui_col_sbarDrag: RGB(255, 8, 8),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(10, 10, 10),
		bio_ui_col_rowStripes: RGB(20, 20, 20),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(240, 10, 60),
		bio_ui_col_bottomLine: RGB(55, 55, 55),
		bio_ui_col_centerLine: RGB(55, 55, 55),
		bio_ui_col_sectionLine: RGB(55, 55, 55),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(200, 200, 200),
		bio_ui_col_source: RGB(240, 10, 60),
		bio_ui_col_accent: RGB(240, 10, 60),
		bio_ui_col_summary: RGB(200, 200, 200),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(25, 25, 25),
		bio_ui_col_popupText: RGB(240, 10, 60),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(200, 200, 200),
		bio_ui_col_lyricsHighlight: RGB(240, 10, 60),
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(240, 10, 60),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(240, 10, 60),
		bio_ui_col_sbarNormal: RGB(240, 10, 60),
		bio_ui_col_sbarHovered: RGB(255, 8, 8),
		bio_ui_col_sbarDrag: RGB(255, 8, 8),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(20, 20, 20),
		grCol_shadow: RGBA(0, 0, 0, 255),
		grCol_discArtShadow: RGBA(0, 0, 0, 40),
		grCol_noAlbumArtStub: RGB(240, 10, 60),
		grCol_lowerBarArtist: RGB(240, 10, 60),
		grCol_lowerBarTitle: RGB(220, 220, 220),
		grCol_lowerBarTime: RGB(220, 220, 220),
		grCol_lowerBarLength: RGB(220, 220, 220),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(240, 10, 60),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(10, 10, 10),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(240, 10, 60),
		grCol_timelinePlayed: RGB(180, 5, 35),
		grCol_timelineUnplayed: RGB(130, 5, 25),
		grCol_timelineFrame: RGB(10, 10, 10),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(25, 25, 25),
		grCol_popupText: RGB(240, 10, 60),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(50, 50, 50),
		grCol_menuStyleBg: RGB(20, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(60, 60, 60),
		grCol_menuRectStyleEmbossBottom: RGB(0, 0, 0),
		grCol_menuRectNormal: RGB(240, 10, 60),
		grCol_menuRectHovered: RGB(255, 8, 8),
		grCol_menuRectDown: RGB(255, 8, 8),
		grCol_menuTextNormal: RGB(240, 10, 60),
		grCol_menuTextHovered: RGB(255, 8, 8),
		grCol_menuTextDown: RGB(255, 8, 8),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(35, 35, 35),
		grCol_transportEllipseNormal: RGB(50, 50, 50),
		grCol_transportEllipseHovered: RGB(255, 8, 8),
		grCol_transportEllipseDown: RGB(255, 8, 8),
		grCol_transportStyleBg: RGB(0, 0, 0),
		grCol_transportStyleTop: RGB(50, 50, 50),
		grCol_transportStyleBottom: RGB(0, 0, 0),
		grCol_transportIconNormal: RGB(240, 10, 60),
		grCol_transportIconHovered: RGB(255, 8, 8),
		grCol_transportIconDown: RGB(255, 8, 8),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(35, 35, 35),
		grCol_progressBarStreaming: RGB(255, 8, 8),
		grCol_progressBarFrame: RGB(20, 20, 20),
		grCol_progressBarFill: RGB(240, 10, 60),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(35, 35, 35),
		grCol_peakmeterBarProgFill: RGB(255, 46, 86),
		grCol_peakmeterBarFillTop: RGB(255, 28, 72),
		grCol_peakmeterBarFillMiddle: RGB(255, 37, 79),
		grCol_peakmeterBarFillBack: RGB(204, 8, 51),
		grCol_peakmeterBarVertProgFill: RGB(240, 10, 60),
		grCol_peakmeterBarVertFill: RGB(240, 10, 60),
		grCol_peakmeterBarVertFillPeaks: RGB(255, 82, 108),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(240, 10, 60),
		grCol_waveformBarFillBack: RGB(192, 8, 48),
		grCol_waveformBarFillPreFront: RGB(100, 100, 100),
		grCol_waveformBarFillPreBack: RGB(80, 80, 80),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(35, 35, 35),
		grCol_volumeBarFrame: RGB(50, 50, 50),
		grCol_volumeBarFill: RGB(240, 10, 60),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleAlternative: RGB(20, 20, 20),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Neon gold theme used in Options > Theme > Neon gold.
	 * @type {object}
	 * @static
	 */
	static ngoldTheme = {
		// * CORE COLORS * //
		primary: RGB(255, 205, 5),
		secondary: RGB(10, 10, 10),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(10, 10, 10),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(10, 10, 10),
		pl_col_plman_text_normal: RGB(200, 200, 200),
		pl_col_plman_text_hovered: RGB(220, 220, 220),
		pl_col_plman_text_pressed: RGB(255, 255, 255),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(25, 25, 25),
		pl_col_header_sideMarker: RGB(255, 205, 5),
		pl_col_header_artist_normal: RGB(240, 240, 240),
		pl_col_header_artist_playing: RGB(255, 205, 5),
		pl_col_header_album_normal: RGB(220, 220, 220),
		pl_col_header_album_playing: RGB(240, 240, 240),
		pl_col_header_info_normal: RGB(220, 220, 220),
		pl_col_header_info_playing: RGB(240, 240, 240),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(255, 205, 5),
		pl_col_header_line_normal: RGB(45, 45, 45),
		pl_col_header_line_playing: RGB(50, 50, 50),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(25, 25, 25),
		pl_col_row_stripes_bg: RGB(20, 20, 20),
		pl_col_row_selection_bg: RGB(10, 10, 10),
		pl_col_row_selection_frame: RGB(40, 40, 40),
		pl_col_row_sideMarker: RGB(255, 205, 5),
		pl_col_row_title_normal: RGB(200, 200, 200),
		pl_col_row_title_playing: RGB(255, 255, 255),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(45, 45, 45),
		pl_col_row_drag_line: RGB(48, 48, 48),
		pl_col_row_drag_line_reached: RGB(255, 205, 5),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(255, 205, 5),
		pl_col_sbar_btn_hovered: RGB(255, 242, 3),
		pl_col_sbar_thumb_normal: RGB(255, 205, 5),
		pl_col_sbar_thumb_hovered: RGB(255, 242, 3),
		pl_col_sbar_thumb_drag: RGB(255, 242, 3),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(10, 10, 10),
		lib_ui_col_rowStripes: RGB(20, 20, 20),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(25, 25, 25),
		lib_ui_col_sideMarker: RGB(255, 205, 5),
		lib_ui_col_selectionFrame: RGB(40, 40, 40),
		lib_ui_col_selectionFrame2: RGB(255, 205, 5),
		lib_ui_col_hoverFrame: RGB(255, 205, 5),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(255, 205, 5),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(255, 205, 5),
		lib_ui_col_iconMinus_c: RGB(255, 205, 5),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(200, 200, 200),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(255, 205, 5),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(200, 200, 200),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(200, 200, 200),
		lib_ui_col_count: RGB(200, 200, 200),
		lib_ui_col_search: RGB(200, 200, 200),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(255, 205, 5),
		lib_ui_col_crossBtn: RGB(255, 205, 5),
		lib_ui_col_filterBtn: RGB(200, 200, 200),
		lib_ui_col_settingsBtn: RGB(255, 205, 5),
		lib_ui_col_line: RGB(45, 45, 45),
		lib_ui_col_s_line: RGB(45, 45, 45),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(255, 205, 5),
		lib_ui_col_sbarNormal: RGB(255, 205, 5),
		lib_ui_col_sbarHovered: RGB(255, 242, 3),
		lib_ui_col_sbarDrag: RGB(255, 242, 3),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(10, 10, 10),
		bio_ui_col_rowStripes: RGB(20, 20, 20),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(255, 205, 5),
		bio_ui_col_bottomLine: RGB(55, 55, 55),
		bio_ui_col_centerLine: RGB(55, 55, 55),
		bio_ui_col_sectionLine: RGB(55, 55, 55),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(200, 200, 200),
		bio_ui_col_source: RGB(255, 205, 5),
		bio_ui_col_accent: RGB(255, 205, 5),
		bio_ui_col_summary: RGB(200, 200, 200),

		// * POPUP COLORS * //
		bio_ui_col_popupBg: RGB(25, 25, 25),
		bio_ui_col_popupText: RGB(255, 205, 5),

		// * MISC COLORS * //
		bio_ui_col_lyricsNormal: RGB(200, 200, 200),
		bio_ui_col_lyricsHighlight: RGB(255, 205, 5),
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(255, 205, 5),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(255, 205, 5),
		bio_ui_col_sbarNormal: RGB(255, 205, 5),
		bio_ui_col_sbarHovered: RGB(255, 242, 3),
		bio_ui_col_sbarDrag: RGB(255, 242, 3),
		// #endregion

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(20, 20, 20),
		grCol_shadow: RGBA(0, 0, 0, 255),
		grCol_discArtShadow: RGBA(0, 0, 0, 40),
		grCol_noAlbumArtStub: RGB(255, 205, 5),
		grCol_lowerBarArtist: RGB(255, 205, 5),
		grCol_lowerBarTitle: RGB(220, 220, 220),
		grCol_lowerBarTime: RGB(220, 220, 220),
		grCol_lowerBarLength: RGB(220, 220, 220),
		grCol_lyricsNormal: RGB(255, 255, 255),
		grCol_lyricsHighlight: RGB(255, 205, 5),
		grCol_lyricsShadow: RGB(0, 0, 0),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(10, 10, 10),
		grCol_detailsText: RGB(255, 255, 255),
		grCol_detailsRating: RGB(255, 170, 32),
		grCol_detailsHotness: RGB(255, 170, 32),
		grCol_timelineAdded: RGB(255, 205, 5),
		grCol_timelinePlayed: RGB(200, 160, 0),
		grCol_timelineUnplayed: RGB(150, 120, 0),
		grCol_timelineFrame: RGB(10, 10, 10),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(25, 25, 25),
		grCol_popupText: RGB(255, 205, 5),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(50, 50, 50),
		grCol_menuStyleBg: RGB(20, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(60, 60, 60),
		grCol_menuRectStyleEmbossBottom: RGB(0, 0, 0),
		grCol_menuRectNormal: RGB(255, 205, 5),
		grCol_menuRectHovered: RGB(255, 242, 3),
		grCol_menuRectDown: RGB(255, 242, 3),
		grCol_menuTextNormal: RGB(255, 205, 5),
		grCol_menuTextHovered: RGB(255, 242, 3),
		grCol_menuTextDown: RGB(255, 242, 3),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(35, 35, 35),
		grCol_transportEllipseNormal: RGB(50, 50, 50),
		grCol_transportEllipseHovered: RGB(255, 242, 3),
		grCol_transportEllipseDown: RGB(255, 242, 3),
		grCol_transportStyleBg: RGB(0, 0, 0),
		grCol_transportStyleTop: RGB(50, 50, 50),
		grCol_transportStyleBottom: RGB(0, 0, 0),
		grCol_transportIconNormal: RGB(255, 205, 5),
		grCol_transportIconHovered: RGB(255, 242, 3),
		grCol_transportIconDown: RGB(255, 242, 3),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(35, 35, 35),
		grCol_progressBarStreaming: RGB(255, 242, 3),
		grCol_progressBarFrame: RGB(20, 20, 20),
		grCol_progressBarFill: RGB(255, 205, 5),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(35, 35, 35),
		grCol_peakmeterBarProgFill: RGB(255, 217, 46),
		grCol_peakmeterBarFillTop: RGB(255, 210, 25),
		grCol_peakmeterBarFillMiddle: RGB(255, 214, 36),
		grCol_peakmeterBarFillBack: RGB(217, 174, 4),
		grCol_peakmeterBarVertProgFill: RGB(255, 205, 5),
		grCol_peakmeterBarVertFill: RGB(255, 205, 5),
		grCol_peakmeterBarVertFillPeaks: RGB(255, 223, 82),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(255, 205, 5),
		grCol_waveformBarFillBack: RGB(204, 164, 4),
		grCol_waveformBarFillPreFront: RGB(100, 100, 100),
		grCol_waveformBarFillPreBack: RGB(80, 80, 80),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(35, 35, 35),
		grCol_volumeBarFrame: RGB(50, 50, 50),
		grCol_volumeBarFill: RGB(255, 205, 5),

		// * STYLE COLORS * //
		grCol_styleBevel: RGB(0, 0, 0),
		grCol_styleGradient: '',
		grCol_styleGradient2: '',
		grCol_styleAlternative: RGB(20, 20, 20),
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for White panel adjustments used when panel backgrounds are too light.
	 * Used by style Black and white 2 or theme color adjustments for style Reborn fusion 1 and 2.
	 * @type {object}
	 * @static
	 */
	static whitePanelTheme = {
		// * CORE COLORS * //
		primary: RGB(40, 40, 40),
		secondary: RGB(245, 245, 245),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(245, 245, 245),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(245, 245, 245),
		pl_col_plman_text_normal: RGB(180, 180, 180),
		pl_col_plman_text_hovered: RGB(100, 100, 100),
		pl_col_plman_text_pressed: RGB(100, 100, 100),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(255, 255, 255),
		pl_col_header_sideMarker: RGB(40, 40, 40),
		pl_col_header_artist_normal: RGB(80, 80, 80),
		pl_col_header_artist_playing: RGB(60, 60, 60),
		pl_col_header_album_normal: RGB(80, 80, 80),
		pl_col_header_album_playing: RGB(60, 60, 60),
		pl_col_header_info_normal: RGB(60, 60, 60),
		pl_col_header_info_playing: RGB(60, 60, 60),
		pl_col_header_date_normal: RGB(60, 60, 60),
		pl_col_header_date_playing: RGB(60, 60, 60),
		pl_col_header_line_normal: RGB(215, 215, 215),
		pl_col_header_line_playing: RGB(215, 215, 215),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(255, 255, 255),
		pl_col_row_stripes_bg: RGB(25, 25, 25),
		pl_col_row_selection_bg: RGB(215, 215, 215),
		pl_col_row_selection_frame: RGB(215, 215, 215),
		pl_col_row_sideMarker: RGB(40, 40, 40),
		pl_col_row_title_normal: RGB(80, 80, 80),
		pl_col_row_title_playing: RGB(60, 60, 60),
		pl_col_row_title_selected: RGB(0, 0, 0),
		pl_col_row_title_hovered: RGB(0, 0, 0),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(215, 215, 215),
		pl_col_row_drag_line: RGB(172, 172, 172),
		pl_col_row_drag_line_reached: RGB(40, 40, 40),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(100, 100, 100),
		pl_col_sbar_btn_hovered: RGB(0, 0, 0),
		pl_col_sbar_thumb_normal: RGB(100, 100, 100),
		pl_col_sbar_thumb_hovered: RGB(40, 40, 40),
		pl_col_sbar_thumb_drag: RGB(40, 40, 40),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(245, 245, 245),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(255, 255, 255),
		lib_ui_col_sideMarker: RGB(40, 40, 40),
		lib_ui_col_selectionFrame: RGB(215, 215, 215),
		lib_ui_col_selectionFrame2: RGB(40, 40, 40),
		lib_ui_col_hoverFrame: RGB(40, 40, 40),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(80, 80, 80),
		lib_ui_col_iconPlus_h: RGB(0, 0, 0),
		lib_ui_col_iconPlus_sel: RGB(0, 0, 0),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(80, 80, 80),
		lib_ui_col_iconMinus_c: RGB(80, 80, 80),
		lib_ui_col_iconMinus_h: RGB(0, 0, 0),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(80, 80, 80),
		lib_ui_col_text_h: RGB(0, 0, 0),
		lib_ui_col_text_nowp: RGB(0, 0, 0),
		lib_ui_col_textSel: RGB(0, 0, 0),
		lib_ui_col_txt: RGB(80, 80, 80),
		lib_ui_col_txt_h: RGB(0, 0, 0),
		lib_ui_col_txt_box: RGB(80, 80, 80),
		lib_ui_col_count: RGB(80, 80, 80),
		lib_ui_col_search: RGB(80, 80, 80),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(0, 0, 0),
		lib_ui_col_crossBtn: RGB(0, 0, 0),
		lib_ui_col_filterBtn: RGB(80, 80, 80),
		lib_ui_col_settingsBtn: RGB(80, 80, 80),
		lib_ui_col_line: RGB(215, 215, 215),
		lib_ui_col_s_line: RGB(215, 215, 215),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(60, 60, 60),
		lib_ui_col_sbarNormal: RGB(0, 0, 0),
		lib_ui_col_sbarHovered: RGB(40, 40, 40),
		lib_ui_col_sbarDrag: RGB(40, 40, 40),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(245, 245, 245),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(60, 60, 60),
		bio_ui_col_bottomLine: RGB(215, 215, 215),
		bio_ui_col_centerLine: RGB(215, 215, 215),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(80, 80, 80),
		bio_ui_col_source: RGB(60, 60, 60),
		bio_ui_col_accent: RGB(60, 60, 60),
		bio_ui_col_summary: RGB(80, 80, 80),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(60, 60, 60),
		bio_ui_col_sbarNormal: RGB(0, 0, 0),
		bio_ui_col_sbarHovered: RGB(40, 40, 40),
		bio_ui_col_sbarDrag: RGB(40, 40, 40),

		// * MISC COLORS * //
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(60, 60, 60),
		// #endregion
	};

	/**
	 * The default colors for White panel adjustments used when panel backgrounds are too light.
	 * Used by style Black and white 2 or theme color adjustments for style Reborn fusion 1 and 2.
	 * @type {object}
	 * @static
	 */
	static whiteMainTheme = {
		// * CORE COLORS * //
		primary: RGB(40, 40, 40),
		secondary: RGB(245, 245, 245),
		accent: null,

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(230, 230, 230),
		grCol_noAlbumArtStub: RGB(255, 255, 255),
		grCol_lowerBarArtist: RGB(80, 80, 80),
		grCol_lowerBarTitle: RGB(80, 80, 80),
		grCol_lowerBarTime: RGB(80, 80, 80),
		grCol_lowerBarLength: RGB(80, 80, 80),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(245, 245, 245),
		grCol_detailsText: RGB(60, 60, 60),
		grCol_timelineAdded: RGB(40, 40, 40),
		grCol_timelinePlayed: RGB(80, 80, 80),
		grCol_timelineUnplayed: RGB(120, 120, 120),
		grCol_timelineFrame: RGB(245, 245, 245),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(255, 255, 255),
		grCol_popupText: RGB(60, 60, 60),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(255, 255, 255),
		grCol_menuStyleBg: RGB(220, 220, 220),
		grCol_menuRectStyleEmbossTop: RGB(255, 255, 255),
		grCol_menuRectStyleEmbossBottom: RGB(195, 195, 195),
		grCol_menuRectNormal: RGB(180, 180, 180),
		grCol_menuRectHovered: RGB(180, 180, 180),
		grCol_menuRectDown: RGB(180, 180, 180),
		grCol_menuTextNormal: RGB(80, 80, 80),
		grCol_menuTextHovered: RGB(40, 40, 40),
		grCol_menuTextDown: RGB(40, 40, 40),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(255, 255, 255),
		grCol_transportEllipseNormal: RGB(220, 220, 220),
		grCol_transportEllipseHovered: RGB(180, 180, 180),
		grCol_transportEllipseDown: RGB(180, 180, 180),
		grCol_transportStyleBg: RGB(225, 225, 225),
		grCol_transportStyleTop: RGB(255, 255, 255),
		grCol_transportStyleBottom: RGB(230, 230, 230),
		grCol_transportIconNormal: RGB(80, 80, 80),
		grCol_transportIconHovered: RGB(40, 40, 40),
		grCol_transportIconDown: RGB(40, 40, 40),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(210, 210, 210),
		grCol_progressBarFill: RGB(255, 255, 255),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(210, 210, 210),
		grCol_peakmeterBarProgFill: RGB(20, 20, 20),
		grCol_peakmeterBarFillTop: RGB(140, 140, 140),
		grCol_peakmeterBarFillMiddle: RGB(20, 20, 20),
		grCol_peakmeterBarFillBack: RGB(80, 80, 80),
		grCol_peakmeterBarVertProgFill: RGB(20, 20, 20),
		grCol_peakmeterBarVertFill: RGB(20, 20, 20),
		grCol_peakmeterBarVertFillPeaks: RGB(120, 120, 120),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(120, 120, 120),
		grCol_waveformBarFillBack: RGB(20, 20, 20),
		grCol_waveformBarFillPreFront: RGB(160, 160, 160),
		grCol_waveformBarFillPreBack: RGB(120, 120, 120),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(255, 255, 255),
		grCol_volumeBarFrame: RGB(210, 210, 210),
		grCol_volumeBarFill: RGB(120, 120, 120),

		// * STYLE COLORS * //
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};

	/**
	 * The default colors for Black panel adjustments used when panel backgrounds are too dark.
	 * Used by style Black and white 1 or theme color adjustments for style Reborn fusion 1 and 2.
	 * @type {object}
	 * @static
	 */
	static blackPanelTheme = {
		// * CORE COLORS * //
		primary: RGB(255, 255, 255),
		secondary: RGB(20, 20, 20),
		accent: null,

		// * PLAYLIST COLORS * //
		// #region PLAYLIST COLORS

		// * MAIN COLORS * //
		pl_col_bg: RGB(20, 20, 20),

		// * PLAYLIST MANAGER COLORS * //
		pl_col_plman_bg: RGB(20, 20, 20),
		pl_col_plman_text_normal: RGB(180, 180, 180),
		pl_col_plman_text_hovered: RGB(200, 200, 200),
		pl_col_plman_text_pressed: RGB(240, 240, 240),

		// * HEADER COLORS * //
		pl_col_header_nowplaying_bg: RGB(230, 230, 230),
		pl_col_header_sideMarker: RGB(255, 255, 255),
		pl_col_header_artist_normal: RGB(220, 220, 220),
		pl_col_header_artist_playing: RGB(25, 25, 25),
		pl_col_header_album_normal: RGB(200, 200, 200),
		pl_col_header_album_playing: RGB(25, 25, 25),
		pl_col_header_info_normal: RGB(200, 200, 200),
		pl_col_header_info_playing: RGB(25, 25, 25),
		pl_col_header_date_normal: RGB(220, 220, 220),
		pl_col_header_date_playing: RGB(25, 25, 25),
		pl_col_header_line_normal: RGB(45, 45, 45),
		pl_col_header_line_playing: RGB(25, 25, 25),

		// * ROW COLORS * //
		pl_col_row_nowplaying_bg: RGB(230, 230, 230),
		pl_col_row_stripes_bg: RGB(25, 25, 25),
		pl_col_row_selection_bg: RGB(45, 45, 45),
		pl_col_row_selection_frame: RGB(45, 45, 45),
		pl_col_row_sideMarker: RGB(255, 255, 255),
		pl_col_row_title_normal: RGB(200, 200, 200),
		pl_col_row_title_playing: RGB(25, 25, 25),
		pl_col_row_title_selected: RGB(255, 255, 255),
		pl_col_row_title_hovered: RGB(255, 255, 255),
		pl_col_row_rating_color: RGB(255, 190, 0),
		pl_col_row_disc_subheader_line: RGB(45, 45, 45),
		pl_col_row_drag_line: RGB(54, 54, 54),
		pl_col_row_drag_line_reached: RGB(255, 255, 255),

		// * SCROLLBAR COLORS * //
		pl_col_sbar_btn_normal: RGB(200, 200, 200),
		pl_col_sbar_btn_hovered: RGB(255, 255, 255),
		pl_col_sbar_thumb_normal: RGB(180, 180, 180),
		pl_col_sbar_thumb_hovered: RGB(255, 255, 255),
		pl_col_sbar_thumb_drag: RGB(255, 255, 255),
		// #endregion

		// * LIBRARY COLORS * //
		// #region LIBRARY COLORS

		// * MAIN COLORS * //
		lib_ui_col_bg: RGB(20, 20, 20),

		// * ROW COLORS * //
		lib_ui_col_nowPlayingBg: RGB(230, 230, 230),
		lib_ui_col_sideMarker: RGB(255, 255, 255),
		lib_ui_col_selectionFrame: RGB(45, 45, 45),
		lib_ui_col_selectionFrame2: RGB(255, 255, 255),
		lib_ui_col_hoverFrame: RGB(255, 255, 255),

		// * NODE COLORS * //
		lib_ui_col_iconPlus: RGB(220, 220, 220),
		lib_ui_col_iconPlus_h: RGB(255, 255, 255),
		lib_ui_col_iconPlus_sel: RGB(255, 255, 255),
		lib_ui_col_iconPlusBg: RGB(45, 45, 45),
		lib_ui_col_iconMinus_e: RGB(220, 220, 220),
		lib_ui_col_iconMinus_c: RGB(220, 220, 220),
		lib_ui_col_iconMinus_h: RGB(255, 255, 255),

		// * TEXT COLORS * //
		lib_ui_col_text: RGB(200, 200, 200),
		lib_ui_col_text_h: RGB(255, 255, 255),
		lib_ui_col_text_nowp: RGB(0, 0, 0),
		lib_ui_col_textSel: RGB(255, 255, 255),
		lib_ui_col_txt: RGB(200, 200, 200),
		lib_ui_col_txt_h: RGB(255, 255, 255),
		lib_ui_col_txt_box: RGB(200, 200, 200),
		lib_ui_col_count: RGB(200, 200, 200),
		lib_ui_col_search: RGB(200, 200, 200),

		// * BUTTON COLORS * //
		lib_ui_col_searchBtn: RGB(255, 255, 255),
		lib_ui_col_crossBtn: RGB(255, 255, 255),
		lib_ui_col_filterBtn: RGB(220, 220, 220),
		lib_ui_col_settingsBtn: RGB(220, 220, 220),
		lib_ui_col_line: RGB(45, 45, 45),
		lib_ui_col_s_line: RGB(45, 45, 45),

		// * SCROLLBAR COLORS * //
		lib_ui_col_sbarBtns: RGB(200, 200, 200),
		lib_ui_col_sbarNormal: RGB(255, 255, 255),
		lib_ui_col_sbarHovered: RGB(255, 255, 255),
		lib_ui_col_sbarDrag: RGB(255, 255, 255),
		// #endregion

		// * BIOGRAPHY COLORS * //
		// #region BIOGRAPHY COLORS

		// * MAIN COLORS * //
		bio_ui_col_bg: RGB(20, 20, 20),

		// * HEADER COLORS * //
		bio_ui_col_headingText: RGB(230, 230, 230),
		bio_ui_col_bottomLine: RGB(45, 45, 45),
		bio_ui_col_centerLine: RGB(45, 45, 45),

		// * TEXT COLORS * //
		bio_ui_col_text: RGB(200, 200, 200),
		bio_ui_col_source: RGB(230, 230, 230),
		bio_ui_col_accent: RGB(230, 230, 230),
		bio_ui_col_summary: RGB(200, 200, 200),

		// * SCROLLBAR COLORS * //
		bio_ui_col_sbarBtns: RGB(200, 200, 200),
		bio_ui_col_sbarNormal: RGB(255, 255, 255),
		bio_ui_col_sbarHovered: RGB(255, 255, 255),
		bio_ui_col_sbarDrag: RGB(255, 255, 255),

		// * MISC COLORS * //
		bio_ui_col_noPhotoStubBg: RGB(25, 25, 25),
		bio_ui_col_noPhotoStubText: RGB(25, 25, 25),
		// #endregion
	};

	/**
	 * The default colors for Black panel adjustments used when panel backgrounds are too dark.
	 * Used by style Black and white 1 or theme color adjustments for style Reborn fusion 1 and 2.
	 * @type {object}
	 * @static
	 */
	static blackMainTheme = {
		// * CORE COLORS * //
		primary: RGB(255, 255, 255),
		secondary: RGB(20, 20, 20),
		accent: null,

		// * MAIN COLORS * //
		// #region MAIN COLORS

		// * MAIN COLORS * //
		grCol_bg: RGB(25, 25, 25),
		grCol_noAlbumArtStub: RGB(40, 40, 40),
		grCol_lowerBarArtist: RGB(240, 240, 240),
		grCol_lowerBarTitle: RGB(220, 220, 220),
		grCol_lowerBarTime: RGB(220, 220, 220),
		grCol_lowerBarLength: RGB(220, 220, 220),

		// * DETAILS COLORS * //
		grCol_detailsBg: RGB(20, 20, 20),
		grCol_detailsText: RGB(220, 220, 220),
		grCol_timelineAdded: RGB(230, 230, 230),
		grCol_timelinePlayed: RGB(180, 180, 180),
		grCol_timelineUnplayed: RGB(160, 160, 160),
		grCol_timelineFrame: RGB(20, 20, 20),

		// * POPUP COLORS * //
		grCol_popupBg: RGB(230, 230, 230),
		grCol_popupText: RGB(25, 25, 25),

		// * TOP MENU BUTTON COLORS * //
		grCol_menuBgColor: RGB(35, 35, 35),
		grCol_menuStyleBg: RGB(20, 20, 20),
		grCol_menuRectStyleEmbossTop: RGB(70, 70, 70),
		grCol_menuRectStyleEmbossBottom: RGB(0, 0, 0),
		grCol_menuRectNormal: RGB(60, 60, 60),
		grCol_menuRectHovered: RGB(100, 100, 100),
		grCol_menuRectDown: RGB(100, 100, 100),
		grCol_menuTextNormal: RGB(180, 180, 180),
		grCol_menuTextHovered: RGB(255, 255, 255),
		grCol_menuTextDown: RGB(255, 255, 255),

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol_transportEllipseBg: RGB(40, 40, 40),
		grCol_transportEllipseNormal: RGB(50, 50, 50),
		grCol_transportEllipseHovered: RGB(100, 100, 100),
		grCol_transportEllipseDown: RGB(100, 100, 100),
		grCol_transportStyleBg: RGB(20, 20, 20),
		grCol_transportStyleTop: RGB(50, 50, 50),
		grCol_transportStyleBottom: RGB(10, 10, 10),
		grCol_transportIconNormal: RGB(200, 200, 200),
		grCol_transportIconHovered: RGB(255, 255, 255),
		grCol_transportIconDown: RGB(255, 255, 255),

		// * PROGRESS BAR COLORS * //
		grCol_progressBar: RGB(50, 50, 50),
		grCol_progressBarFill: RGB(210, 210, 210),

		// * PEAKMETER BAR COLORS * //
		grCol_peakmeterBarProg: RGB(50, 50, 50),
		grCol_peakmeterBarProgFill: RGB(200, 200, 200),
		grCol_peakmeterBarFillTop: RGB(120, 120, 120),
		grCol_peakmeterBarFillMiddle: RGB(160, 160, 160),
		grCol_peakmeterBarFillBack: RGB(80, 80, 80),
		grCol_peakmeterBarVertProgFill: RGB(210, 210, 210),
		grCol_peakmeterBarVertFill: RGB(245, 245, 245),
		grCol_peakmeterBarVertFillPeaks: RGB(200, 200, 200),

		// * WAVEFORM BAR COLORS * //
		grCol_waveformBarFillFront: RGB(245, 245, 245),
		grCol_waveformBarFillBack: RGB(200, 200, 200),
		grCol_waveformBarFillPreFront: RGB(160, 160, 160),
		grCol_waveformBarFillPreBack: RGB(120, 120, 120),
		grCol_waveformBarIndicator: RGB(255, 255, 255),

		// * VOLUME BAR COLORS * //
		grCol_volumeBar: RGB(40, 40, 40),
		grCol_volumeBarFrame: RGB(40, 40, 40),
		grCol_volumeBarFill: RGB(210, 210, 210),

		// * STYLE COLORS * //
		grCol_styleProgressBar: '',
		grCol_styleProgressBarLineTop: '',
		grCol_styleProgressBarLineBottom: '',
		grCol_styleProgressBarFill: '',
		grCol_styleVolumeBar: '',
		grCol_styleVolumeBarFill: '',
		// #endregion
	};
	// #endregion

	// * PUBLIC METHODS - CUSTOM THEME COLORS * //
	// #region PUBLIC METHODS - CUSTOM THEME COLORS
	/**
	 * Initializes and returns the custom theme colors by converting all HEX colors
	 * from grCfg.cTheme into RGB integers.
	 * @returns {object} The fully mapped customTheme object
	 */
	initCustomThemeColors() {
		grm.ui.initCustomTheme();

		const c = grCfg.cTheme;

		return {
			// * CORE COLORS * //
			primary: HEXtoRGB(c.pl_col_header_sideMarker),
			secondary: HEXtoRGB(c.pl_col_bg),
			accent: HEXtoRGB(c.pl_col_header_sideMarker),

			// * PLAYLIST COLORS * //
			// #region PLAYLIST COLORS
			pl_col_bg: HEXtoRGB(c.pl_col_bg),
			pl_col_plman_text_normal: HEXtoRGB(grSet.autoHidePlman ? c.pl_col_bg : c.pl_col_plman_text_normal),
			pl_col_plman_text_hovered: HEXtoRGB(c.pl_col_plman_text_hovered),
			pl_col_plman_text_pressed: HEXtoRGB(c.pl_col_plman_text_pressed),
			pl_col_header_nowplaying_bg: HEXtoRGB(c.pl_col_header_nowplaying_bg),
			pl_col_header_sideMarker: HEXtoRGB(c.pl_col_header_sideMarker),
			pl_col_header_artist_normal: HEXtoRGB(c.pl_col_header_artist_normal),
			pl_col_header_artist_playing: HEXtoRGB(c.pl_col_header_artist_playing),
			pl_col_header_album_normal: HEXtoRGB(c.pl_col_header_album_normal),
			pl_col_header_album_playing: HEXtoRGB(c.pl_col_header_album_playing),
			pl_col_header_info_normal: HEXtoRGB(c.pl_col_header_info_normal),
			pl_col_header_info_playing: HEXtoRGB(c.pl_col_header_info_playing),
			pl_col_header_date_normal: HEXtoRGB(c.pl_col_header_date_normal),
			pl_col_header_date_playing: HEXtoRGB(c.pl_col_header_date_playing),
			pl_col_header_line_normal: HEXtoRGB(c.pl_col_header_line_normal),
			pl_col_header_line_playing: HEXtoRGB(c.pl_col_header_line_playing),
			pl_col_row_nowplaying_bg: HEXtoRGB(c.pl_col_row_nowplaying_bg),
			pl_col_row_stripes_bg: HEXtoRGB(c.pl_col_row_stripes_bg),
			pl_col_row_selection_bg: HEXtoRGB(c.pl_col_row_selection_bg),
			pl_col_row_selection_frame: HEXtoRGB(c.pl_col_row_selection_frame),
			pl_col_row_sideMarker: HEXtoRGB(c.pl_col_row_sideMarker),
			pl_col_row_title_normal: HEXtoRGB(c.pl_col_row_title_normal),
			pl_col_row_title_playing: HEXtoRGB(c.pl_col_row_title_playing),
			pl_col_row_title_selected: HEXtoRGB(c.pl_col_row_title_selected),
			pl_col_row_title_hovered: HEXtoRGB(c.pl_col_row_title_hovered),
			pl_col_row_rating_color: HEXtoRGB(c.pl_col_row_rating_color),
			pl_col_row_disc_subheader_line: HEXtoRGB(c.pl_col_row_disc_subheader_line),
			pl_col_row_drag_line: HEXtoRGB(c.pl_col_row_drag_line),
			pl_col_row_drag_line_reached: HEXtoRGB(c.pl_col_row_drag_line_reached),
			pl_col_sbar_btn_normal: HEXtoRGB(c.pl_col_sbar_btn_normal),
			pl_col_sbar_btn_hovered: HEXtoRGB(c.pl_col_sbar_btn_hovered),
			pl_col_sbar_thumb_normal: HEXtoRGB(c.pl_col_sbar_thumb_normal),
			pl_col_sbar_thumb_hovered: HEXtoRGB(c.pl_col_sbar_thumb_hovered),
			pl_col_sbar_thumb_drag: HEXtoRGB(c.pl_col_sbar_thumb_drag),
			// #endregion

			// * LIBRARY COLORS * //
			// #region LIBRARY COLORS
			lib_ui_col_bg: HEXtoRGB(c.lib_ui_col_bg),
			lib_ui_col_rowStripes: HEXtoRGB(c.lib_ui_col_rowStripes),
			lib_ui_col_nowPlayingBg: HEXtoRGB(c.lib_ui_col_nowPlayingBg),
			lib_ui_col_sideMarker: HEXtoRGB(c.lib_ui_col_sideMarker),
			lib_ui_col_selectionFrame: HEXtoRGB(c.lib_ui_col_selectionFrame),
			lib_ui_col_selectionFrame2: HEXtoRGB(c.lib_ui_col_selectionFrame2),
			lib_ui_col_hoverFrame: HEXtoRGB(c.lib_ui_col_hoverFrame),
			lib_ui_col_iconPlus: HEXtoRGB(c.lib_ui_col_iconPlus),
			lib_ui_col_iconPlus_h: HEXtoRGB(c.lib_ui_col_iconPlus_h),
			lib_ui_col_iconPlus_sel: HEXtoRGB(c.lib_ui_col_iconPlus_sel),
			lib_ui_col_iconPlusBg: HEXtoRGB(c.lib_ui_col_iconPlusBg),
			lib_ui_col_iconMinus_e: HEXtoRGB(c.lib_ui_col_iconMinus_e),
			lib_ui_col_iconMinus_c: HEXtoRGB(c.lib_ui_col_iconMinus_c),
			lib_ui_col_iconMinus_h: HEXtoRGB(c.lib_ui_col_iconMinus_h),
			lib_ui_col_text: HEXtoRGB(c.lib_ui_col_text),
			lib_ui_col_text_h: HEXtoRGB(c.lib_ui_col_text_h),
			lib_ui_col_text_nowp: HEXtoRGB(c.lib_ui_col_text_nowp),
			lib_ui_col_textSel: HEXtoRGB(c.lib_ui_col_textSel),
			lib_ui_col_textSelBg: HEXtoRGB(c.lib_ui_col_textSelBg),
			lib_ui_col_txt: HEXtoRGB(c.lib_ui_col_txt),
			lib_ui_col_txt_h: HEXtoRGB(c.lib_ui_col_txt_h),
			lib_ui_col_txt_box: HEXtoRGB(c.lib_ui_col_txt_box),
			lib_ui_col_count: HEXtoRGB(c.lib_ui_col_count),
			lib_ui_col_search: HEXtoRGB(c.lib_ui_col_search),
			lib_ui_col_searchBtn: HEXtoRGB(c.lib_ui_col_searchBtn),
			lib_ui_col_crossBtn: HEXtoRGB(c.lib_ui_col_crossBtn),
			lib_ui_col_filterBtn: HEXtoRGB(c.lib_ui_col_filterBtn),
			lib_ui_col_settingsBtn: HEXtoRGB(c.lib_ui_col_settingsBtn),
			lib_ui_col_line: HEXtoRGB(c.lib_ui_col_line),
			lib_ui_col_s_line: HEXtoRGB(c.lib_ui_col_s_line),
			lib_ui_col_sbarBtns: HEXtoRGB(c.lib_ui_col_sbarBtns),
			lib_ui_col_sbarNormal: HEXtoRGB(c.lib_ui_col_sbarNormal),
			lib_ui_col_sbarHovered: HEXtoRGB(c.lib_ui_col_sbarHovered),
			lib_ui_col_sbarDrag: HEXtoRGB(c.lib_ui_col_sbarDrag),
			// #endregion

			// * BIOGRAPHY COLORS * //
			// #region BIOGRAPHY COLORS
			bio_ui_col_bg: HEXtoRGB(c.bio_ui_col_bg),
			bio_ui_col_rowStripes: HEXtoRGB(c.bio_ui_col_rowStripes),
			bio_ui_col_headingText: HEXtoRGB(c.bio_ui_col_headingText),
			bio_ui_col_bottomLine: HEXtoRGB(c.bio_ui_col_bottomLine),
			bio_ui_col_centerLine: HEXtoRGB(c.bio_ui_col_centerLine),
			bio_ui_col_sectionLine: HEXtoRGB(c.bio_ui_col_sectionLine),
			bio_ui_col_text: HEXtoRGB(c.bio_ui_col_text),
			bio_ui_col_source: HEXtoRGB(c.bio_ui_col_source),
			bio_ui_col_accent: HEXtoRGB(c.bio_ui_col_accent),
			bio_ui_col_summary: HEXtoRGB(c.bio_ui_col_summary),
			bio_ui_col_lyricsNormal: HEXtoRGB(c.bio_ui_col_lyricsNormal),
			bio_ui_col_lyricsHighlight: HEXtoRGB(c.bio_ui_col_lyricsHighlight),
			bio_ui_col_noPhotoStubBg: HEXtoRGB(c.bio_ui_col_noPhotoStubBg),
			bio_ui_col_noPhotoStubText: HEXtoRGB(c.bio_ui_col_noPhotoStubText),
			bio_ui_col_sbarBtns: HEXtoRGB(c.bio_ui_col_sbarBtns),
			bio_ui_col_sbarNormal: HEXtoRGB(c.bio_ui_col_sbarNormal),
			bio_ui_col_sbarHovered: HEXtoRGB(c.bio_ui_col_sbarHovered),
			bio_ui_col_sbarDrag: HEXtoRGB(c.bio_ui_col_sbarDrag),
			// #endregion

			// * MAIN COLORS * //
			// #region MAIN COLORS
			grCol_bg: HEXtoRGB(c.grCol_bg),
			grCol_shadow: HEXtoRGBA(c.grCol_shadow, 75),
			grCol_discArtShadow: HEXtoRGBA(c.grCol_discArtShadow, 30),
			grCol_noAlbumArtStub: HEXtoRGB(c.grCol_noAlbumArtStub),
			grCol_lowerBarArtist: HEXtoRGB(c.grCol_lowerBarArtist),
			grCol_lowerBarTitle: HEXtoRGB(c.grCol_lowerBarTitle),
			grCol_lowerBarTime: HEXtoRGB(c.grCol_lowerBarTime),
			grCol_lowerBarLength: HEXtoRGB(c.grCol_lowerBarLength),
			grCol_lyricsNormal: HEXtoRGB(c.grCol_lyricsNormal),
			grCol_lyricsHighlight: HEXtoRGB(c.grCol_lyricsHighlight),
			grCol_lyricsShadow: HEXtoRGB(c.grCol_lyricsShadow),
			grCol_detailsBg: HEXtoRGB(c.grCol_detailsBg),
			grCol_detailsText: HEXtoRGB(c.grCol_detailsText),
			grCol_detailsRating: HEXtoRGB(c.grCol_detailsRating),
			grCol_detailsHotness: HEXtoRGB(c.grCol_detailsRating),
			grCol_timelineAdded: HEXtoRGB(c.grCol_timelineAdded),
			grCol_timelinePlayed: HEXtoRGB(c.grCol_timelinePlayed),
			grCol_timelineUnplayed: HEXtoRGB(c.grCol_timelineUnplayed),
			grCol_timelineFrame: HEXtoRGB(c.grCol_timelineFrame),
			grCol_popupBg: HEXtoRGB(c.grCol_popupBg),
			grCol_popupText: HEXtoRGB(c.grCol_popupText),
			grCol_menuBgColor: HEXtoRGB(c.grCol_menuBgColor),
			grCol_menuStyleBg: HEXtoRGB(c.grCol_menuStyleBg),
			grCol_menuRectStyleEmbossTop: HEXtoRGB(c.grCol_menuRectStyleEmbossTop),
			grCol_menuRectStyleEmbossBottom: HEXtoRGB(c.grCol_menuRectStyleEmbossBottom),
			grCol_menuRectNormal: HEXtoRGB(c.grCol_menuRectNormal),
			grCol_menuRectHovered: HEXtoRGB(c.grCol_menuRectHovered),
			grCol_menuRectDown: HEXtoRGB(c.grCol_menuRectDown),
			grCol_menuTextNormal: HEXtoRGB(c.grCol_menuTextNormal),
			grCol_menuTextHovered: HEXtoRGB(c.grCol_menuTextHovered),
			grCol_menuTextDown: HEXtoRGB(c.grCol_menuTextDown),
			grCol_transportEllipseBg: HEXtoRGB(c.grCol_transportEllipseBg),
			grCol_transportEllipseNormal: HEXtoRGB(c.grCol_transportEllipseNormal),
			grCol_transportEllipseHovered: HEXtoRGB(c.grCol_transportEllipseHovered),
			grCol_transportEllipseDown: HEXtoRGB(c.grCol_transportEllipseDown),
			grCol_transportStyleBg: HEXtoRGB(c.grCol_transportStyleBg),
			grCol_transportStyleTop: HEXtoRGB(c.grCol_transportStyleTop),
			grCol_transportStyleBottom: HEXtoRGB(c.grCol_transportStyleBottom),
			grCol_transportIconNormal: HEXtoRGB(c.grCol_transportIconNormal),
			grCol_transportIconHovered: HEXtoRGB(c.grCol_transportIconHovered),
			grCol_transportIconDown: HEXtoRGB(c.grCol_transportIconDown),
			grCol_progressBar: HEXtoRGB(c.grCol_progressBar),
			grCol_progressBarStreaming: HEXtoRGB(c.grCol_progressBarStreaming),
			grCol_progressBarFrame: HEXtoRGB(c.grCol_progressBarFrame),
			grCol_progressBarFill: HEXtoRGB(c.grCol_progressBarFill),
			grCol_peakmeterBarProg: HEXtoRGB(c.grCol_peakmeterBarProg),
			grCol_peakmeterBarProgFill: HEXtoRGB(c.grCol_peakmeterBarProgFill),
			grCol_peakmeterBarFillTop: HEXtoRGB(c.grCol_peakmeterBarFillTop),
			grCol_peakmeterBarFillMiddle: HEXtoRGB(c.grCol_peakmeterBarFillMiddle),
			grCol_peakmeterBarFillBack: HEXtoRGB(c.grCol_peakmeterBarFillBack),
			grCol_peakmeterBarVertProgFill: HEXtoRGB(c.grCol_peakmeterBarVertProgFill),
			grCol_peakmeterBarVertFill: HEXtoRGB(c.grCol_peakmeterBarVertFill),
			grCol_peakmeterBarVertFillPeaks: HEXtoRGB(c.grCol_peakmeterBarVertFillPeaks),
			grCol_waveformBarFillFront: HEXtoRGB(c.grCol_waveformBarFillFront),
			grCol_waveformBarFillBack: HEXtoRGB(c.grCol_waveformBarFillBack),
			grCol_waveformBarFillPreFront: HEXtoRGB(c.grCol_waveformBarFillPreFront),
			grCol_waveformBarFillPreBack: HEXtoRGB(c.grCol_waveformBarFillPreBack),
			grCol_waveformBarIndicator: HEXtoRGB(c.grCol_waveformBarIndicator),
			grCol_volumeBar: HEXtoRGB(c.grCol_volumeBar),
			grCol_volumeBarFrame: HEXtoRGB(c.grCol_volumeBarFrame),
			grCol_volumeBarFill: HEXtoRGB(c.grCol_volumeBarFill),
			grCol_styleBevel: HEXtoRGB(c.grCol_styleBevel),
			grCol_styleGradient: HEXtoRGB(c.grCol_styleGradient),
			grCol_styleGradient2: HEXtoRGB(c.grCol_styleGradient2),
			grCol_styleAlternative: HEXtoRGB(c.grCol_styleAlternative),
			grCol_styleProgressBar: HEXtoRGB(c.grCol_styleProgressBar),
			grCol_styleProgressBarLineTop: HEXtoRGB(c.grCol_styleProgressBarLineTop),
			grCol_styleProgressBarLineBottom: HEXtoRGB(c.grCol_styleProgressBarLineBottom),
			grCol_styleProgressBarFill: HEXtoRGB(c.grCol_styleProgressBarFill),
			grCol_styleVolumeBar: HEXtoRGB(c.grCol_styleVolumeBar),
			grCol_styleVolumeBarFill: HEXtoRGB(c.grCol_styleVolumeBarFill)
			// #endregion
		};
	}

	/**
	 * Sets and saves currently used colors, used when transferring colors to a custom theme.
	 * @param {string} slot - The custom theme slot in which to save.
	 */
	setCurrentColorsToCustomTheme(slot) {
		const currentColors = {
			// * PRELOADER COLORS * //
			grCol_preloaderBg: RGBFtoHEX(grCol.bg),
			grCol_preloaderLogo: '_custom-logo.png',
			grCol_preloaderLowerBarTitle: RGBFtoHEX(grCol.lowerBarTitle),
			grCol_preloaderProgressBar: RGBFtoHEX(grCol.progressBar),
			grCol_preloaderProgressBarFill: RGBFtoHEX(grCol.progressBarFill),
			grCol_preloaderProgressBarFrame: RGBFtoHEX(grCol.progressBarFrame),

			// * PLAYLIST COLORS * //
			pl_col_bg: RGBFtoHEX(pl.col.bg),
			pl_col_plman_text_normal: RGBFtoHEX(pl.col.plman_text_normal),
			pl_col_plman_text_hovered: RGBFtoHEX(pl.col.plman_text_hovered),
			pl_col_plman_text_pressed: RGBFtoHEX(pl.col.plman_text_pressed),
			pl_col_header_nowplaying_bg: RGBFtoHEX(pl.col.header_nowplaying_bg),
			pl_col_header_sideMarker: RGBFtoHEX(pl.col.header_sideMarker),
			pl_col_header_artist_normal: RGBFtoHEX(pl.col.header_artist_normal),
			pl_col_header_artist_playing: RGBFtoHEX(pl.col.header_artist_playing),
			pl_col_header_album_normal: RGBFtoHEX(pl.col.header_album_normal),
			pl_col_header_album_playing: RGBFtoHEX(pl.col.header_album_playing),
			pl_col_header_info_normal: RGBFtoHEX(pl.col.header_info_normal),
			pl_col_header_info_playing: RGBFtoHEX(pl.col.header_info_playing),
			pl_col_header_date_normal: RGBFtoHEX(pl.col.header_date_normal),
			pl_col_header_date_playing: RGBFtoHEX(pl.col.header_date_playing),
			pl_col_header_line_normal: RGBFtoHEX(pl.col.header_line_normal),
			pl_col_header_line_playing: RGBFtoHEX(pl.col.header_line_playing),
			pl_col_row_nowplaying_bg: RGBFtoHEX(pl.col.row_nowplaying_bg),
			pl_col_row_stripes_bg: RGBFtoHEX(pl.col.row_stripes_bg),
			pl_col_row_selection_frame: RGBFtoHEX(pl.col.row_selection_frame),
			pl_col_row_sideMarker: RGBFtoHEX(pl.col.row_sideMarker),
			pl_col_row_title_normal: RGBFtoHEX(pl.col.row_title_normal),
			pl_col_row_title_playing: RGBFtoHEX(pl.col.row_title_playing),
			pl_col_row_title_selected: RGBFtoHEX(pl.col.row_title_selected),
			pl_col_row_title_hovered: RGBFtoHEX(pl.col.row_title_hovered),
			pl_col_row_rating_color: RGBFtoHEX(pl.col.row_rating_color),
			pl_col_row_disc_subheader_line: RGBFtoHEX(pl.col.row_disc_subheader_line),
			pl_col_row_drag_line: RGBFtoHEX(pl.col.row_drag_line),
			pl_col_row_drag_line_reached: RGBFtoHEX(pl.col.row_drag_line_reached),
			pl_col_sbar_btn_normal: RGBFtoHEX(pl.col.sbar_btn_normal),
			pl_col_sbar_btn_hovered: RGBFtoHEX(pl.col.sbar_btn_hovered),
			pl_col_sbar_thumb_normal: RGBFtoHEX(pl.col.sbar_thumb_normal),
			pl_col_sbar_thumb_hovered: RGBFtoHEX(pl.col.sbar_thumb_hovered),
			pl_col_sbar_thumb_drag: RGBFtoHEX(pl.col.sbar_thumb_drag),

			// * LIBRARY COLORS * //
			lib_ui_col_bg: RGBFtoHEX(lib.ui.col.bg),
			lib_ui_col_rowStripes: RGBFtoHEX(lib.ui.col.rowStripes),
			lib_ui_col_nowPlayingBg: RGBFtoHEX(lib.ui.col.nowPlayingBg),
			lib_ui_col_sideMarker: RGBFtoHEX(lib.ui.col.sideMarker),
			lib_ui_col_selectionFrame: RGBFtoHEX(lib.ui.col.selectionFrame),
			lib_ui_col_selectionFrame2: RGBFtoHEX(lib.ui.col.selectionFrame2),
			lib_ui_col_hoverFrame: RGBFtoHEX(lib.ui.col.hoverFrame),
			lib_ui_col_iconPlus: RGBFtoHEX(lib.ui.col.iconPlus),
			lib_ui_col_iconPlus_h: RGBFtoHEX(lib.ui.col.iconPlus_h),
			lib_ui_col_iconPlus_sel: RGBFtoHEX(lib.ui.col.iconPlus_sel),
			lib_ui_col_iconPlusBg: RGBFtoHEX(lib.ui.col.iconPlusBg),
			lib_ui_col_iconMinus_e: RGBFtoHEX(lib.ui.col.iconMinus_e),
			lib_ui_col_iconMinus_c: RGBFtoHEX(lib.ui.col.iconMinus_c),
			lib_ui_col_iconMinus_h: RGBFtoHEX(lib.ui.col.iconMinus_h),
			lib_ui_col_text: RGBFtoHEX(lib.ui.col.text),
			lib_ui_col_text_h: RGBFtoHEX(lib.ui.col.text_h),
			lib_ui_col_text_nowp: RGBFtoHEX(lib.ui.col.text_nowp),
			lib_ui_col_textSel: RGBFtoHEX(lib.ui.col.textSel),
			lib_ui_col_textSelBg: RGBFtoHEX(lib.ui.col.textSelBg),
			lib_ui_col_txt: RGBFtoHEX(lib.ui.col.txt),
			lib_ui_col_txt_h: RGBFtoHEX(lib.ui.col.txt_h),
			lib_ui_col_txt_box: RGBFtoHEX(lib.ui.col.txt_box),
			lib_ui_col_search: RGBFtoHEX(lib.ui.col.search),
			lib_ui_col_searchBtn: RGBFtoHEX(lib.ui.col.searchBtn),
			lib_ui_col_crossBtn: RGBFtoHEX(lib.ui.col.crossBtn),
			lib_ui_col_filterBtn: RGBFtoHEX(lib.ui.col.filterBtn),
			lib_ui_col_settingsBtn: RGBFtoHEX(lib.ui.col.settingsBtn),
			lib_ui_col_line: RGBFtoHEX(lib.ui.col.line),
			lib_ui_col_s_line: RGBFtoHEX(lib.ui.col.s_line),
			lib_ui_col_sbarBtns: RGBFtoHEX(lib.ui.col.sbarBtns),
			lib_ui_col_sbarNormal: RGBFtoHEX(lib.ui.col.sbarNormal),
			lib_ui_col_sbarHovered: RGBFtoHEX(lib.ui.col.sbarHovered),
			lib_ui_col_sbarDrag: RGBFtoHEX(lib.ui.col.sbarDrag),

			// * BIOGRAPHY COLORS * //
			bio_ui_col_bg: RGBFtoHEX(bio.ui.col.bg),
			bio_ui_col_rowStripes: RGBFtoHEX(bio.ui.col.rowStripes),
			bio_ui_col_headingText: RGBFtoHEX(bio.ui.col.headingText),
			bio_ui_col_bottomLine: RGBFtoHEX(bio.ui.col.bottomLine),
			bio_ui_col_centerLine: RGBFtoHEX(bio.ui.col.centerLine),
			bio_ui_col_sectionLine: RGBFtoHEX(bio.ui.col.sectionLine),
			bio_ui_col_accent: RGBFtoHEX(bio.ui.col.accent),
			bio_ui_col_source: RGBFtoHEX(bio.ui.col.source),
			bio_ui_col_summary: RGBFtoHEX(bio.ui.col.summary),
			bio_ui_col_text: RGBFtoHEX(bio.ui.col.text),
			bio_ui_col_lyricsNormal: RGBFtoHEX(bio.ui.col.lyricsNormal),
			bio_ui_col_lyricsHighlight: RGBFtoHEX(bio.ui.col.lyricsHighlight),
			bio_ui_col_noPhotoStubBg: RGBFtoHEX(bio.ui.col.noPhotoStubBg),
			bio_ui_col_noPhotoStubText: RGBFtoHEX(bio.ui.col.noPhotoStubText),
			bio_ui_col_sbarBtns: RGBFtoHEX(bio.ui.col.sbarBtns),
			bio_ui_col_sbarNormal: RGBFtoHEX(bio.ui.col.sbarNormal),
			bio_ui_col_sbarHovered: RGBFtoHEX(bio.ui.col.sbarHovered),
			bio_ui_col_sbarDrag: RGBFtoHEX(bio.ui.col.sbarDrag),

			// * MAIN COLORS * //
			grCol_bg: RGBFtoHEX(grCol.bg),
			grCol_shadow: RGBFtoHEX(grCol.shadow),
			grCol_discArtShadow: RGBFtoHEX(grCol.discArtShadow),
			grCol_noAlbumArtStub: RGBFtoHEX(grCol.noAlbumArtStub),
			grCol_lowerBarArtist: RGBFtoHEX(grCol.lowerBarArtist),
			grCol_lowerBarTitle: RGBFtoHEX(grCol.lowerBarTitle),
			grCol_lowerBarTime: RGBFtoHEX(grCol.lowerBarTime),
			grCol_lowerBarLength: RGBFtoHEX(grCol.lowerBarLength),
			grCol_lyricsNormal: RGBFtoHEX(grCol.lyricsNormal),
			grCol_lyricsHighlight: RGBFtoHEX(grCol.lyricsHighlight),
			grCol_lyricsShadow: RGBFtoHEX(grCol.lyricsShadow),
			grCol_detailsBg: RGBFtoHEX(grCol.detailsBg),
			grCol_detailsText: RGBFtoHEX(grCol.detailsText),
			grCol_detailsRating: RGBFtoHEX(grCol.detailsRating),
			grCol_timelineAdded: RGBFtoHEX(grCol.timelineAdded),
			grCol_timelinePlayed: RGBFtoHEX(grCol.timelinePlayed),
			grCol_timelineUnplayed: RGBFtoHEX(grCol.timelineUnplayed),
			grCol_timelineFrame: RGBFtoHEX(grCol.timelineFrame),
			grCol_popupBg: RGBFtoHEX(grCol.popupBg),
			grCol_popupText: RGBFtoHEX(grCol.popupText),
			grCol_menuBgColor: RGBFtoHEX(grCol.menuBgColor),
			grCol_menuStyleBg: RGBFtoHEX(grCol.menuStyleBg),
			grCol_menuRectStyleEmbossTop: RGBFtoHEX(grCol.menuRectStyleEmbossTop),
			grCol_menuRectStyleEmbossBottom: RGBFtoHEX(grCol.menuRectStyleEmbossBottom),
			grCol_menuRectNormal: RGBFtoHEX(grCol.menuRectNormal),
			grCol_menuRectHovered: RGBFtoHEX(grCol.menuRectHovered),
			grCol_menuRectDown: RGBFtoHEX(grCol.menuRectDown),
			grCol_menuTextNormal: RGBFtoHEX(grCol.menuTextNormal),
			grCol_menuTextHovered: RGBFtoHEX(grCol.menuTextHovered),
			grCol_menuTextDown: RGBFtoHEX(grCol.menuTextDown),
			grCol_transportEllipseBg: RGBFtoHEX(grCol.transportEllipseBg),
			grCol_transportEllipseNormal: RGBFtoHEX(grCol.transportEllipseNormal),
			grCol_transportEllipseHovered: RGBFtoHEX(grCol.transportEllipseHovered),
			grCol_transportEllipseDown: RGBFtoHEX(grCol.transportEllipseDown),
			grCol_transportStyleBg: RGBFtoHEX(grCol.transportStyleBg),
			grCol_transportStyleTop: RGBFtoHEX(grCol.transportStyleTop),
			grCol_transportStyleBottom: RGBFtoHEX(grCol.transportStyleBottom),
			grCol_transportIconNormal: RGBFtoHEX(grCol.transportIconNormal),
			grCol_transportIconHovered: RGBFtoHEX(grCol.transportIconHovered),
			grCol_transportIconDown: RGBFtoHEX(grCol.transportIconDown),
			grCol_progressBar: RGBFtoHEX(grCol.progressBar),
			grCol_progressBarStreaming: RGBFtoHEX(grCol.progressBarStreaming),
			grCol_progressBarFrame: RGBFtoHEX(grCol.progressBarFrame),
			grCol_progressBarFill: RGBFtoHEX(grCol.progressBarFill),
			grCol_peakmeterBarProg: RGBFtoHEX(grCol.peakmeterBarProg),
			grCol_peakmeterBarProgFill: RGBFtoHEX(grCol.peakmeterBarProgFill),
			grCol_peakmeterBarFillTop: RGBFtoHEX(grCol.peakmeterBarFillTop),
			grCol_peakmeterBarFillMiddle: RGBFtoHEX(grCol.peakmeterBarFillMiddle),
			grCol_peakmeterBarFillBack: RGBFtoHEX(grCol.peakmeterBarFillBack),
			grCol_peakmeterBarVertProgFill: RGBFtoHEX(grCol.peakmeterBarVertProgFill),
			grCol_peakmeterBarVertFill: RGBFtoHEX(grCol.peakmeterBarVertFill),
			grCol_peakmeterBarVertFillPeaks: RGBFtoHEX(grCol.peakmeterBarVertFillPeaks),
			grCol_waveformBarFillFront: RGBFtoHEX(grCol.waveformBarFillFront),
			grCol_waveformBarFillBack: RGBFtoHEX(grCol.waveformBarFillBack),
			grCol_waveformBarFillPreFront: RGBFtoHEX(grCol.waveformBarFillPreFront),
			grCol_waveformBarFillPreBack: RGBFtoHEX(grCol.waveformBarFillPreBack),
			grCol_waveformBarIndicator: RGBFtoHEX(grCol.waveformBarIndicator),
			grCol_volumeBar: RGBFtoHEX(grCol.volumeBar),
			grCol_volumeBarFrame: RGBFtoHEX(grCol.volumeBarFrame),
			grCol_volumeBarFill: RGBFtoHEX(grCol.volumeBarFill),
			grCol_styleBevel: RGBFtoHEX(grCol.styleBevel),
			grCol_styleGradient: RGBFtoHEX(grCol.styleGradient),
			grCol_styleGradient2: RGBFtoHEX(grCol.styleGradient2),
			grCol_styleProgressBar: RGBFtoHEX(grCol.styleProgressBar),
			grCol_styleProgressBarLineTop: RGBFtoHEX(grCol.styleProgressBarLineTop),
			grCol_styleProgressBarLineBottom: RGBFtoHEX(grCol.styleProgressBarLineBottom),
			grCol_styleProgressBarFill: RGBFtoHEX(grCol.styleProgressBarFill),
			grCol_styleVolumeBar: RGBFtoHEX(grCol.styleVolumeBar),
			grCol_styleVolumeBarFill: RGBFtoHEX(grCol.styleVolumeBarFill)
		}

		const customThemes = {
			custom01: { schema: grDef.customTheme01Schema, object: 'customTheme01' },
			custom02: { schema: grDef.customTheme02Schema, object: 'customTheme02' },
			custom03: { schema: grDef.customTheme03Schema, object: 'customTheme03' },
			custom04: { schema: grDef.customTheme04Schema, object: 'customTheme04' },
			custom05: { schema: grDef.customTheme05Schema, object: 'customTheme05' },
			custom06: { schema: grDef.customTheme06Schema, object: 'customTheme06' },
			custom07: { schema: grDef.customTheme07Schema, object: 'customTheme07' },
			custom08: { schema: grDef.customTheme08Schema, object: 'customTheme08' },
			custom09: { schema: grDef.customTheme09Schema, object: 'customTheme09' },
			custom10: { schema: grDef.customTheme10Schema, object: 'customTheme10' }
		};

		if (!customThemes[slot]) return;

		const customTheme = customThemes[slot].object;
		const { schema }  = customThemes[slot];
		this[customTheme] = grCfg.configCustom.addConfigurationObject(schema, currentColors, grDef.customThemeComments);

		grCfg.cTheme = this[customTheme];
		grCfg.configCustom.updateConfigObjValues(customTheme, currentColors, true);
	}
	// #endregion

	// * PUBLIC METHODS - THEME BASE COLOR OVERRIDES * //
	// #region PUBLIC METHODS - THEME BASE COLOR OVERRIDES
	/**
	 * Applies base color overrides to a resolved theme object.
	 * @param {string} themeName - The active theme name.
	 * @param {object} theme - The already-resolved theme object.
	 * @returns {object} The patched theme object.
	 */
	applyBaseColorOverrides(themeName, theme) {
		this.applyThemeGeneralOverrides(theme);

		if (themeName === 'white') {
			this.applyThemeWhiteOverrides(theme);
		}
		else if (themeName === 'black') {
			this.applyThemeBlackOverrides(theme);
		}
		else if (themeName === 'reborn' || themeName === 'random') {
			this.applyThemeRebornRandomOverrides(theme);
		}
		else if (themeName === 'cream') {
			this.applyThemeCreamOverrides(theme);
		}
		else if (themeName.startsWith('custom')) {
			this.applyThemeCustomOverrides(theme);
		}

		return theme;
	}

	/**
	 * Applies theme general overrides.
	 * @param {object} theme - The already-resolved theme object.
	 */
	applyThemeGeneralOverrides(theme) {
		if (grSet.autoHidePlman) {
			pl.col.plman_text_normal = pl.col.bg;
		}
		if (grm.ui.noAlbumArtStub) {
			theme.grCol_detailsBg = theme.pl_col_bg;
		}
	}

	/**
	 * Applies theme white overrides.
	 * @param {object} theme - The already-resolved theme object.
	 */
	applyThemeWhiteOverrides(theme) {
		const layoutNotDefault = grSet.layout !== 'default';
		const libImgView = lib.panel.imgView;

		if (!grSet.styleBlackAndWhite && !grSet.styleBlackAndWhite2) {
			theme.pl_col_header_artist_playing = layoutNotDefault ? theme.pl_col_header_artist_playing_light : theme.pl_col_header_artist_playing_dark;
			theme.pl_col_header_album_playing  = layoutNotDefault ? theme.pl_col_header_album_playing_light  : theme.pl_col_header_album_playing_dark;
			theme.pl_col_header_info_playing   = layoutNotDefault ? theme.pl_col_header_info_playing_light   : theme.pl_col_header_info_playing_dark;
			theme.pl_col_header_date_playing   = layoutNotDefault ? theme.pl_col_header_date_playing_light   : theme.pl_col_header_date_playing_dark;
			theme.pl_col_row_title_playing     = theme.pl_col_row_title_playing_light;
			theme.lib_ui_col_textSel           = libImgView ? theme.pl_col_row_title_playing_light : theme.pl_col_row_title_playing_dark;
			theme.grCol_popupText              = theme.pl_col_header_artist_playing_dark;
		}

		if (grSet.libraryDesign === 'traditional') {
			theme.lib_ui_col_textSel = RGB(255, 255, 255);
		}
		else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
			theme.lib_ui_col_text_h = libImgView ? RGB(255, 255, 255) : RGB(0, 0, 0);
		}
		else if ((grSet.libraryDesign === 'coversLabelsRight' || grSet.libraryDesign === 'coversLabelsBottom')) {
			theme.lib_ui_col_textSel = RGB(0, 0, 0);
		}
		else if (grSet.libraryDesign === 'coversLabelsBlend') {
			theme.lib_ui_col_text      = libImgView ? RGB(200, 200, 200) : RGB(100, 100, 100);
			theme.lib_ui_col_text_h    = libImgView ? RGB(255, 255, 255) : RGB(0, 0, 0);
			theme.lib_ui_col_text_nowp = libImgView ? RGB(0, 0, 0) : RGB(255, 255, 255);
			theme.lib_ui_col_textSel   = RGB(0, 0, 0);
		}

		if (grSet.styleBlackAndWhite) {
			if (grSet.libraryDesign === 'traditional') {
				theme.lib_ui_col_textSel = theme.lib_ui_col_text_dark;
			}
			else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
				theme.lib_ui_col_text_h  = libImgView ? theme.lib_ui_col_text_dark : theme.lib_ui_col_text_light;
				theme.lib_ui_col_textSel = libImgView ? theme.lib_ui_col_text_dark : theme.lib_ui_col_text_light;
			}
			else if ((grSet.libraryDesign === 'coversLabelsRight' || grSet.libraryDesign === 'coversLabelsBottom')) {
				theme.lib_ui_col_textSel = theme.lib_ui_col_text_light;
			}
			else if (grSet.libraryDesign === 'coversLabelsBlend') {
				theme.lib_ui_col_text      = RGB(200, 200, 200);
				theme.lib_ui_col_text_h    = theme.lib_ui_col_text_light;
				theme.lib_ui_col_text_nowp = libImgView ? theme.lib_ui_col_text_light : theme.lib_ui_col_text_dark;
				theme.lib_ui_col_textSel   = theme.lib_ui_col_text_light;
			}
			else {
				theme.lib_ui_col_textSel = libImgView ? theme.lib_ui_col_text_dark : theme.lib_ui_col_text_light;
			}

			if (grSet.styleBevel) {
				theme.grCol_lowerBarArtist = RGB(90, 90, 90);
				theme.grCol_lowerBarTitle  = RGB(90, 90, 90);
				theme.grCol_lowerBarTime   = RGB(90, 90, 90);
				theme.grCol_lowerBarLength = RGB(90, 90, 90);
			}
			if (grSet.styleBlend || grSet.styleBlend2) {
				theme.grCol_lowerBarArtist = RGB(75, 75, 75);
				theme.grCol_lowerBarTitle  = RGB(75, 75, 75);
				theme.grCol_lowerBarTime   = RGB(75, 75, 75);
				theme.grCol_lowerBarLength = RGB(75, 75, 75);
			}
			if (grSet.styleBevel && (grSet.styleBlend || grSet.styleBlend2)) {
				theme.grCol_lowerBarArtist = RGB(60, 60, 60);
				theme.grCol_lowerBarTitle  = RGB(60, 60, 60);
				theme.grCol_lowerBarTime   = RGB(60, 60, 60);
				theme.grCol_lowerBarLength = RGB(60, 60, 60);
			}
		}

		if (grSet.styleBlackAndWhite2) {
			if (grSet.libraryDesign === 'traditional') {
				theme.lib_ui_col_textSel = theme.lib_ui_col_text_dark;
			}
			else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
				theme.lib_ui_col_text_h  = libImgView ? theme.lib_ui_col_text_dark : theme.lib_ui_col_text_light;
				theme.lib_ui_col_textSel = libImgView ? theme.lib_ui_col_text_dark : theme.lib_ui_col_text_light;
			}

			if (grSet.styleTopMenuButtons === 'bevel' || grSet.styleTopMenuButtons === 'inner') {
				theme.grCol_menuRectNormal  = RGB(0, 0, 0);
				theme.grCol_menuRectHovered = RGB(0, 0, 0);
				theme.grCol_menuRectDown    = RGB(0, 0, 0);
			}
		}
	}

	/**
	 * Applies theme black overrides.
	 * @param {object} theme - The already-resolved theme object.
	 */
	applyThemeBlackOverrides(theme) {
		theme.pl_col_header_artist_playing = theme.pl_col_header_artist_playing_dark;
		theme.pl_col_header_album_playing  = theme.pl_col_header_album_playing_dark;
		theme.pl_col_header_info_playing   = theme.pl_col_header_info_playing_dark;
		theme.pl_col_header_date_playing   = theme.pl_col_header_date_playing_dark;
		theme.pl_col_row_title_playing     = theme.pl_col_row_title_playing_dark;
		theme.lib_ui_col_text_nowp         = theme.pl_col_row_title_playing_dark;
		theme.lib_ui_col_textSel           = lib.panel.imgView ? theme.pl_col_row_title_playing_dark : theme.pl_col_row_title_playing_light;
		theme.grCol_detailsBg              = theme.pl_col_bg;
		theme.grCol_popupText              = theme.pl_col_header_artist_playing_dark;

		if (grSet.styleTopMenuButtons === 'bevel' || grSet.styleTopMenuButtons === 'inner') {
			theme.grCol_menuRectNormal  = RGB(60, 60, 60);
			theme.grCol_menuRectHovered = RGB(60, 60, 60);
			theme.grCol_menuRectDown    = RGB(60, 60, 60);
		}

		if (grSet.libraryDesign === 'traditional') {
			theme.lib_ui_col_textSel = RGB(0, 0, 0);
		}
		else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
			theme.lib_ui_col_text_h = lib.panel.imgView ? RGB(0, 0, 0) : RGB(255, 255, 255);
		}
		else if (grSet.libraryDesign === 'coversLabelsRight' || grSet.libraryDesign === 'coversLabelsBottom') {
			theme.lib_ui_col_textSel = RGB(255, 255, 255);
		}
		else if (grSet.libraryDesign === 'coversLabelsBlend') {
			theme.lib_ui_col_textSel = RGB(255, 255, 255);
		}
	}

	/**
	 * Applies theme reborn & random overrides.
	 * @param {object} theme - The already-resolved theme object.
	 */
	applyThemeRebornRandomOverrides(theme) {
		theme.lib_ui_col_textSel = lib.panel.imgView ? theme.pl_col_row_title_playing_light : theme.pl_col_row_title_playing_dark;
		theme.lib_ui_col_iconPlus_sel = theme.lib_ui_col_textSel;

		if (grSet.libraryDesign === 'traditional') {
			theme.lib_ui_col_textSel = RGB(255, 255, 255);
		}
		else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
			theme.lib_ui_col_text_h = lib.panel.imgView ? RGB(255, 255, 255) : RGB(0, 0, 0);
		}
		else if (grSet.libraryDesign === 'coversLabelsRight' || grSet.libraryDesign === 'coversLabelsBottom') {
			theme.lib_ui_col_textSel = RGB(0, 0, 0);
		}
		else if (grSet.libraryDesign === 'coversLabelsBlend') {
			theme.lib_ui_col_text      = lib.panel.imgView ? RGB(200, 200, 200) : RGB(100, 100, 100);
			theme.lib_ui_col_text_h    = lib.panel.imgView ? RGB(255, 255, 255) : RGB(0, 0, 0);
			theme.lib_ui_col_text_nowp = lib.panel.imgView ? RGB(0, 0, 0) : RGB(255, 255, 255);
			theme.lib_ui_col_textSel   = RGB(0, 0, 0);
			theme.lib_ui_col_iconPlus = theme.lib_ui_col_text;
		}

		if (grSet.styleNighttime && (!fb.IsPlaying || grm.ui.noAlbumArtStub)) {
			theme.primary              = RGB(210, 235, 240);
			theme.accent               = RGB(210, 235, 240);
			theme.grCol_noAlbumArtStub = RGB(240, 240, 240);
		}

		if (grSet.styleRebornBlack && grSet.styleBevel) {
			theme.grCol_bg = RGB(40, 40, 40);
		}
	}

	/**
	 * Applies theme cream overrides.
	 * @param {object} theme - The already-resolved theme object.
	 */
	applyThemeCreamOverrides(theme) {
		theme.lib_ui_col_textSel = lib.panel.imgView ? theme.pl_col_row_title_playing_light : theme.pl_col_row_title_playing_dark;
		theme.lib_ui_col_iconPlus_sel = theme.lib_ui_col_textSel;

		if (grSet.libraryDesign === 'traditional') {
			theme.lib_ui_col_textSel = RGB(255, 255, 255);
		}
		else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
			theme.lib_ui_col_text_h = lib.panel.imgView ? RGB(255, 255, 255) : RGB(0, 0, 0);
		}
		else if (grSet.libraryDesign === 'coversLabelsRight' || grSet.libraryDesign === 'coversLabelsBottom') {
			theme.lib_ui_col_textSel = RGB(0, 0, 0);
		}
		else if (grSet.libraryDesign === 'coversLabelsBlend') {
			theme.lib_ui_col_text      = lib.panel.imgView ? RGB(200, 200, 200) : RGB(90, 90, 90);
			theme.lib_ui_col_text_h    = lib.panel.imgView ? RGB(255, 255, 255) : RGB(0, 0, 0);
			theme.lib_ui_col_text_nowp = lib.panel.imgView ? RGB(0, 0, 0) : RGB(255, 255, 255);
			theme.lib_ui_col_textSel   = RGB(0, 0, 0);
		}
	}

	/**
	 * Applies theme custom overrides.
	 * @param {object} theme - The already-resolved theme object.
	 */
	applyThemeCustomOverrides(theme) {
		theme.lib_ui_col_textSel = lib.panel.imgView ? theme.lib_ui_col_textSelBg : theme.lib_ui_col_textSel;
		theme.lib_ui_col_iconPlus_sel = theme.lib_ui_col_textSel;

		if (grSet.libraryDesign === 'traditional') {
			theme.lib_ui_col_textSel      = theme.lib_ui_col_textSelBg;
			theme.lib_ui_col_iconPlus     = theme.lib_ui_col_textSel;
			theme.lib_ui_col_iconPlus_h   = theme.lib_ui_col_textSel;
			theme.lib_ui_col_iconPlus_sel = theme.lib_ui_col_textSel;
			theme.lib_ui_col_iconPlusBg   = theme.lib_ui_col_nowPlayingBg;
			theme.lib_ui_col_iconMinus_e  = theme.lib_ui_col_iconPlus;
			theme.lib_ui_col_iconMinus_c  = theme.lib_ui_col_iconMinus_e;
			theme.lib_ui_col_iconMinus_h  = theme.lib_ui_col_iconMinus_e;
		}
		else if (grSet.libraryDesign === 'modern' || grSet.libraryDesign === 'facet') {
			theme.lib_ui_col_text_h = lib.panel.imgView ? theme.lib_ui_col_textSelBg : theme.lib_ui_col_textSel;
		}
		else if (grSet.libraryDesign === 'coversLabelsBlend') {
			theme.lib_ui_col_textSel = RGB(255, 255, 255);
		}
	}
	// #endregion

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Gets a theme object by its string name.
	 * @param {string} themeName - The name of the theme (e.g., 'white', 'reborn').
	 * @returns {object} The theme color object.
	 */
	getTheme(themeName) {
		if (themeName.startsWith('custom')) {
			return this.applyBaseColorOverrides(themeName, this.initCustomThemeColors());
		}

		if (grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2 || grSet.styleBlackAndWhiteReborn) {
			const blackAndWhite = grSet.styleBlackAndWhite2
				? { ...this.whitePanelTheme, ...this.blackMainTheme }
				: { ...this.blackPanelTheme, ...this.whiteMainTheme };

			const style = this.whiteTheme.style[
				grSet.styleBlackAndWhite2 ? 'blackAndWhite2' : 'blackAndWhite'
			];

			return this.applyBaseColorOverrides(themeName, { ...blackAndWhite, ...style });
		}

		if (grSet.styleBlackReborn) {
			return this.applyBaseColorOverrides(themeName, {...this.blackTheme, ...this.blackTheme.style.blackReborn });
		}
		if (grSet.styleNighttime) {
			return this.applyBaseColorOverrides(themeName, { ...this.blackPanelTheme, ...this.blackMainTheme });
		}
		if (grSet.styleRebornWhite) {
			return this.applyBaseColorOverrides(themeName, { ...this.rebornTheme, ...this.rebornTheme.style.rebornWhite });
		}
		if (grSet.styleRebornBlack) {
			return this.applyBaseColorOverrides(themeName, { ...this.rebornTheme, ...this.rebornTheme.style.rebornBlack });
		}

		return this.applyBaseColorOverrides(themeName, this[`${themeName.toLowerCase()}Theme`]);
	}
	// #endregion
}
