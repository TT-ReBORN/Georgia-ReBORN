/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Themes                                   * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////
// * BASE COLORS * //
/////////////////////
/**
 * A class that provides theme base colors and specific methods responsible for handling color operations.
 * Allows for creation, manipulation, adjustment, and application of colors to the theme.
 */
class BaseColors {
	/**
	 * Creates the `BaseColors` instance and initializes theme preferences.
	 */
	constructor() {
		this.initThemeStyleSettings();
		this.initThemeBaseColors();
	}

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes current values for all theme style grSet.properties.
	 */
	initThemeStyleSettings() {
		/** @private @type {string} Options > Theme. */
		this.THEME   = grSet.theme;
		/** @private @type {string} Options > Theme > Custom. */
		this.CTHEME  = grSet.theme.startsWith('custom');
		/** @private @type {boolean} Options > Style > Bevel. */
		this.BEVEL   = grSet.styleBevel;
		/** @private @type {boolean} Options > Style > Blend. */
		this.BLEND   = grSet.styleBlend;
		/** @private @type {boolean} Options > Style > Blend 2. */
		this.BLEND2  = grSet.styleBlend2;
		/** @private @type {boolean} Options > Style > Blend or Blend 2. */
		this.BLEND12 = grSet.styleBlend || grSet.styleBlend2;
		/** @private @type {boolean} Options > Style > Gradient. */
		this.GRAD    = grSet.styleGradient;
		/** @private @type {boolean} Options > Style > Gradient 2. */
		this.GRAD2   = grSet.styleGradient2;
		/** @private @type {boolean} Options > Style > Gradient or Gradient 2. */
		this.GRAD12  = grSet.styleGradient || grSet.styleGradient2;
		/** @private @type {boolean} Options > Style > Alternative. */
		this.ALT     = grSet.styleAlternative;
		/** @private @type {boolean} Options > Style > Alternative 2. */
		this.ALT2    = grSet.styleAlternative2;
		/** @private @type {boolean} Options > Style > Black and white ( White theme ). */
		this.BW      = grSet.styleBlackAndWhite;
		/** @private @type {boolean} Options > Style > Black and white 2 ( White theme ). */
		this.BW2     = grSet.styleBlackAndWhite2;
		/** @private @type {boolean} Options > Style > Black and white reborn ( White theme ). */
		this.BWR     = grSet.styleBlackAndWhiteReborn;
		/** @private @type {boolean} Options > Style > Black reborn ( Black theme ). */
		this.BR      = grSet.styleBlackReborn;
		/** @private @type {boolean} Options > Style > Reborn white ( Reborn theme ). */
		this.RW      = grSet.styleRebornWhite;
		/** @private @type {boolean} Options > Style > Reborn black ( Reborn theme ). */
		this.RB      = grSet.styleRebornBlack;
		/** @private @type {boolean} Options > Style > Reborn fusion ( Reborn theme ). */
		this.RF      = grSet.styleRebornFusion;
		/** @private @type {boolean} Options > Style > Reborn fusion 2 ( Reborn theme ). */
		this.RF2     = grSet.styleRebornFusion2;
		/** @private @type {boolean} Options > Style > Reborn fusion and Reborn fusion 2 ( Reborn theme ). */
		this.RF12    = grSet.styleRebornFusion || grSet.styleRebornFusion2;
		/** @private @type {boolean} Options > Style > Reborn fusion accent ( Reborn theme ). */
		this.RFA     = grSet.styleRebornFusionAccent;
		/** @private @type {boolean} Options > Style > Random pastel ( Random theme ). */
		this.RP      = grSet.styleRandomPastel;
		/** @private @type {boolean} Options > Style > Random dark ( Random theme ). */
		this.RD      = grSet.styleRandomDark;
		/** @private @type {string} Options > Style > Auto color ( Random theme ). */
		this.RAC     = grSet.styleRandomAutoColor;
		/** @private @type {string} Options > Style > Buttons > Top menu. */
		this.TMB     = grSet.styleTopMenuButtons;
		/** @private @type {string} Options > Style > Buttons > Transport. */
		this.TPB     = grSet.styleTransportButtons;
		/** @private @type {string} Options > Style > Progress bar > Design. */
		this.PBD     = grSet.styleProgressBarDesign;
		/** @private @type {string} Options > Style > Progress bar > Background. */
		this.PB      = grSet.styleProgressBar;
		/** @private @type {string} Options > Style > Progress bar > Progress fill. */
		this.PBF     = grSet.styleProgressBarFill;
		/** @private @type {string} Options > Style > Volume bar > Design. */
		this.VBD     = grSet.styleVolumeBarDesign;
		/** @private @type {string} Options > Style > Volume bar > Background. */
		this.VB      = grSet.styleVolumeBar;
		/** @private @type {string} Options > Style > Volume bar > Volume fill. */
		this.VBF     = grSet.styleVolumeBarFill;
		/** @private @type {string} Options > Layout. */
		this.LAYOUT  = grSet.layout;

		/** @private @type {boolean} The state when theme is nighttime. */
		this.NIGHTTIME = (['reborn', 'random'].includes(grSet.theme) && grSet.styleNighttime ||
			grSet.themeDayNightMode && grSet.themeDayNightTime === 'night') && !grSet.styleRebornWhite;
	}

	/**
	 * Initializes the current values for all theme style properties in the child classes
	 * {@link ThemeColors} and {@link StyleColors}.
	 */
	initThemeStyleProperties() {
		grm.theme.initThemeStyleSettings();
		grm.style.initThemeStyleSettings();
	}

	/**
	 * Initializes the default theme base colors.
	 */
	initThemeBaseColors() {
		/**
		 * The default colors for White theme used in Options > Theme > White.
		 * @type {object}
		 * @public
		 */
		this.whiteTheme = {
			name: 'white',
			colors: {
				primary: RGB(25, 160, 240),
				darkAccent: RGB(12, 144, 245),
				accent: RGB(12, 137, 232),
				lightAccent: RGB(10, 130, 220)
			}
		};

		/**
		 * The default colors for Black theme used in Options > Theme > Black.
		 * @type {object}
		 * @public
		 */
		this.blackTheme = {
			name: 'black',
			colors: {
				primary: RGB(175, 205, 225),
				darkAccent: RGB(160, 160, 160),
				accent: RGB(180, 180, 180),
				lightAccent: RGB(220, 220, 220)
			}
		};

		/**
		 * The default colors for Reborn theme used in Options > Theme > Reborn.
		 * @type {object}
		 * @public
		 */
		this.rebornTheme = {
			name: 'reborn',
			colors: {
				primary: RGB(90, 90, 90),
				primary_alt: RGB(90, 90, 90),
				darkAccent: RGB(60, 60, 60),
				accent: RGB(80, 80, 80),
				lightAccent: RGB(100, 100, 100)
			}
		};

		/**
		 * The default colors for Random theme used in Options > Theme > Random.
		 * @type {object}
		 * @public
		 */
		this.randomTheme = {
			name: 'random',
			colors: {
				primary: RGB(65, 65, 65),
				darkAccent: RGB(60, 60, 60),
				accent: RGB(80, 80, 80),
				lightAccent: RGB(100, 100, 100)
			}
		};

		/**
		 * The default colors for Blue theme used in Options > Theme > Blue.
		 * @type {object}
		 * @public
		 */
		this.blueTheme = {
			name: 'blue',
			colors: {
				primary: RGB(10, 115, 200),
				darkAccent: RGB(12, 144, 245),
				accent: RGB(12, 137, 232),
				lightAccent: RGB(10, 130, 220)
			}
		};

		/**
		 * The default colors for Dark blue theme used in Options > Theme > Dark blue.
		 * @type {object}
		 * @public
		 */
		this.darkblueTheme = {
			name: 'darkBlue',
			colors: {
				primary: RGB(21, 37, 56),
				darkAccent: RGB(31, 65, 107),
				accent: RGB(27, 58, 94),
				lightAccent: RGB(24, 50, 82)
			}
		};

		/**
		 * The default colors for Red theme used in Options > Theme > Red.
		 * @type {object}
		 * @public
		 */
		this.redTheme = {
			name: 'red',
			colors: {
				primary: RGB(110, 20, 20),
				darkAccent: RGB(156, 30, 30),
				accent: RGB(143, 27, 27),
				lightAccent: RGB(130, 25, 25)
			}
		};

		/**
		 * The default colors for Cream theme used in Options > Theme > Cream.
		 * @type {object}
		 * @public
		 */
		this.creamTheme = {
			name: 'cream',
			colors: {
				primary: RGB(255, 247, 240),
				darkAccent: RGB(120, 170, 130),
				accent: RGB(130, 184, 141),
				lightAccent: RGB(139, 196, 151)
			}
		};

		/**
		 * The default colors for Neon blue theme used in Options > Theme > Neon blue.
		 * @type {object}
		 * @public
		 */
		this.nblueTheme = {
			name: 'neon blue',
			colors: {
				primary: RGB(10, 10, 10),
				darkAccent: RGB(30, 30, 30),
				accent: RGB(40, 40, 40),
				lightAccent: RGB(50, 50, 50)
			}
		};

		/**
		 * The default colors for Neon green theme used in Options > Theme > Neon green.
		 * @type {object}
		 * @public
		 */
		this.ngreenTheme = {
			name: 'neon green',
			colors: {
				primary: RGB(10, 10, 10),
				darkAccent: RGB(30, 30, 30),
				accent: RGB(40, 40, 40),
				lightAccent: RGB(50, 50, 50)
			}
		};

		/**
		 * The default colors for Neon red theme used in Options > Theme > Neon red.
		 * @type {object}
		 * @public
		 */
		this.nredTheme = {
			name: 'neon red',
			colors: {
				primary: RGB(10, 10, 10),
				darkAccent: RGB(30, 30, 30),
				accent: RGB(40, 40, 40),
				lightAccent: RGB(50, 50, 50)
			}
		};

		/**
		 * The default colors for Neon gold theme used in Options > Theme > Neon gold.
		 * @type {object}
		 * @public
		 */
		this.ngoldTheme = {
			name: 'neon gold',
			colors: {
				primary: RGB(10, 10, 10),
				darkAccent: RGB(30, 30, 30),
				accent: RGB(40, 40, 40),
				lightAccent: RGB(50, 50, 50)
			}
		};

		/**
		 * The default colors for Custom theme used in Options > Theme > Custom.
		 * @type {object}
		 * @public
		 */
		this.customTheme = {
			name: 'custom',
			colors: {
				primary: RGB(50, 25, 70),
				darkAccent: RGB(30, 15, 45),
				accent: RGB(65, 35, 95),
				lightAccent: RGB(75, 40, 110)
			}
		};
	}
	// #endregion

	// * PUBLIC METHODS - GENERAL * //
	// #region PUBLIC METHODS - GENERAL
	/**
	 * Adjusts the text and button colors based on the brightness level provided.
	 * @param {number} percent - The percentage to adjust the brightness by.
	 * @param {boolean} darken - Whether to darken the color.
	 * @param {boolean} darkenMax - Whether to apply maximum darkening.
	 * @param {boolean} lighten - Whether to lighten the color.
	 * @param {boolean} lightenMax - Whether to apply maximum lightening.
	 */
	adjustTextButtonColors(percent, darken, darkenMax, lighten, lightenMax) {
		/**
		 * Sets the color brightness based on the provided parameters.
		 * It selectively shades or tints the color based on the brightness adjustment directives.
		 * @param {number} color - The base color to be adjusted.
		 * @param {boolean} [boost] - If true, increases the intensity of the shade or tint.
		 * @param {boolean} [soften] - If true, decreases the intensity of the shade or tint.
		 * @returns {number} The adjusted color as a numerical value.
		 */
		const SetColor = (color, boost = false, soften = false) => {
			switch (true) {
				case darken:
					return ShadeColor(color, percent * (boost ? 1.75 : soften ? 1.25 : 1.5));
				case darkenMax:
					return ShadeColor(color, boost ? 100 : soften ? 60 : 85);
				case lighten:
					return TintColor(color, percent * (boost ? 1.75 : soften ? 1.25 : 1.5));
				case lightenMax:
					return TintColor(color, boost ? 100 : soften ? 60 : 85);
			}
		};

		const playlistColors = {
			plman_text_normal: grSet.autoHidePlman ? pl.col.bg : SetColor(pl.col.plman_text_normal),
			plman_text_hovered: SetColor(pl.col.plman_text_hovered, true),
			plman_text_pressed: SetColor(pl.col.plman_text_pressed, true),
			header_artist_normal: SetColor(pl.col.header_artist_normal),
			header_artist_playing: SetColor(pl.col.header_artist_playing, true),
			header_album_normal: SetColor(pl.col.header_album_normal),
			header_album_playing: SetColor(pl.col.header_album_playing, true),
			header_info_normal: SetColor(pl.col.header_info_normal, true),
			header_info_playing: SetColor(pl.col.header_info_playing, true),
			header_date_normal: SetColor(pl.col.header_date_normal),
			header_date_playing: SetColor(pl.col.header_date_playing, true),
			row_title_normal: SetColor(pl.col.row_title_normal),
			row_title_playing: SetColor(pl.col.row_title_playing, true),
			row_title_selected: SetColor(pl.col.row_title_selected, true),
			row_title_hovered: SetColor(pl.col.row_title_hovered, true),
			sbar_btn_normal: SetColor(pl.col.sbar_btn_normal),
			sbar_btn_hovered: SetColor(pl.col.sbar_btn_hovered, true),
			sbar_thumb_normal: SetColor(pl.col.sbar_thumb_normal, false, true),
			sbar_thumb_hovered: SetColor(pl.col.sbar_thumb_hovered, true),
			sbar_thumb_drag: SetColor(pl.col.sbar_thumb_drag, true)
		};
		Object.assign(pl.col, playlistColors);

		const libraryColors = {
			iconPlus: SetColor(lib.ui.col.iconPlus),
			iconPlus_h: SetColor(lib.ui.col.iconPlus_h, true),
			iconPlus_sel: SetColor(lib.ui.col.iconPlus_sel, true),
			iconPlusBg: SetColor(lib.ui.col.iconPlusBg),
			iconMinus_e: SetColor(lib.ui.col.iconMinus_e),
			iconMinus_h: SetColor(lib.ui.col.iconMinus_h, true),
			text: SetColor(lib.ui.col.text),
			text_h: SetColor(lib.ui.col.text_h, true),
			text_nowp: SetColor(lib.ui.col.text_nowp, true),
			textSel: SetColor(lib.ui.col.textSel, true),
			txt_box: SetColor(lib.ui.col.txt_box),
			search: SetColor(lib.ui.col.search),
			searchBtn: SetColor(lib.ui.col.searchBtn),
			crossBtn: SetColor(lib.ui.col.crossBtn),
			filterBtn: SetColor(lib.ui.col.filterBtn),
			settingsBtn: SetColor(lib.ui.col.settingsBtn),
			line: SetColor(lib.ui.col.line),
			sbarBtns: SetColor(lib.ui.col.sbarBtns),
			sbarNormal: SetColor(lib.ui.col.sbarNormal),
			sbarHovered: SetColor(lib.ui.col.sbarHovered, true),
			sbarDrag: SetColor(lib.ui.col.sbarDrag, true)
		};
		Object.assign(lib.ui.col, libraryColors);

		const biographyColors = {
			headingText: SetColor(bio.ui.col.headingText),
			iconMinus_e: SetColor(bio.ui.col.iconMinus_e),
			iconMinus_h: SetColor(bio.ui.col.iconMinus_h),
			text: SetColor(bio.ui.col.text),
			source: SetColor(bio.ui.col.source),
			accent: SetColor(bio.ui.col.accent),
			summary: SetColor(bio.ui.col.summary),
			sbarBtns: SetColor(bio.ui.col.sbarBtns),
			sbarNormal: SetColor(bio.ui.sbarNormal),
			sbarHovered: SetColor(bio.ui.col.sbarHovered, true),
			sbarDrag: SetColor(bio.ui.col.sbarDrag, true)
		};
		Object.assign(bio.ui.col, biographyColors);

		const mainColors = {
			detailsText: SetColor(grCol.detailsText),
			popupText: SetColor(grCol.popupText),
			noAlbumArtStub: SetColor(grCol.noAlbumArtStub),
			lowerBarArtist: SetColor(grCol.lowerBarArtist),
			lowerBarTitle: SetColor(grCol.lowerBarTitle),
			lowerBarTime: SetColor(grCol.lowerBarTime),
			lowerBarLength: SetColor(grCol.lowerBarLength),
			menuTextNormal: SetColor(grCol.menuTextNormal),
			menuTextHovered: SetColor(grCol.menuTextHovered, true),
			menuTextDown: SetColor(grCol.menuTextDown, true),
			transportIconNormal: !['reborn', 'random'].includes(grSet.theme) ? SetColor(grCol.transportIconNormal) : grCol.transportIconNormal,
			transportIconHovered: !['reborn', 'random'].includes(grSet.theme) ? SetColor(grCol.transportIconHovered, true) : grCol.transportIconHovered,
			transportIconDown: !['reborn', 'random'].includes(grSet.theme) ? SetColor(grCol.transportIconDown, true) : grCol.transportIconDown
		};
		Object.assign(grCol, mainColors);

		window.Repaint();
	}

	/**
	 * Lightens or darkens the theme based on grSet.themeBrightness value, used in Options > Brightness.
	 * @param {number} percent - The percentage number for lightening or darkening all colors in the theme.
	 */
	adjustThemeBrightness(percent) {
		if (percent < 0) percent = Math.abs(percent); // Negative passed values need to be converted to positives

		if (grSet.themeBrightness < 0) { // * Darken
			// * PLAYLIST COLORS * //
			pl.col.bg = ShadeColor(pl.col.bg, percent);
			pl.col.plman_bg = ShadeColor(pl.col.plman_bg, percent);
			pl.col.plman_text_normal = ShadeColor(pl.col.plman_text_normal, percent);
			pl.col.header_nowplaying_bg = ShadeColor(pl.col.header_nowplaying_bg, percent);
			pl.col.header_sideMarker = ShadeColor(pl.col.header_sideMarker, percent);
			pl.col.header_line_normal = ShadeColor(pl.col.header_line_normal, percent);
			pl.col.header_line_playing = ShadeColor(pl.col.header_line_playing, percent);
			pl.col.row_nowplaying_bg = ShadeColor(pl.col.row_nowplaying_bg, percent);
			pl.col.row_stripes_bg = ShadeColor(pl.col.row_stripes_bg, percent);
			pl.col.row_selection_bg = ShadeColor(pl.col.row_selection_bg, percent);
			pl.col.row_selection_frame = ShadeColor(pl.col.row_selection_frame, percent);
			pl.col.row_sideMarker = ShadeColor(pl.col.row_sideMarker, percent);
			pl.col.row_disc_subheader_line = ShadeColor(pl.col.row_disc_subheader_line, percent);
			pl.col.sbar_btn_normal = ShadeColor(pl.col.sbar_btn_normal, percent);
			pl.col.sbar_btn_hovered = ShadeColor(pl.col.sbar_btn_hovered, percent);
			pl.col.sbar_thumb_normal = ShadeColor(pl.col.sbar_thumb_normal, percent);
			pl.col.sbar_thumb_hovered = ShadeColor(pl.col.sbar_thumb_hovered, percent);
			pl.col.sbar_thumb_drag = ShadeColor(pl.col.sbar_thumb_drag, percent);

			// * LIBRARY COLORS * //
			lib.ui.col.bg = pl.col.bg;
			lib.ui.col.line = ShadeColor(lib.ui.col.line, percent);
			lib.ui.col.s_line = ShadeColor(lib.ui.col.s_line, percent);
			lib.ui.col.nowPlayingBg = ShadeColor(lib.ui.col.nowPlayingBg, percent);
			lib.ui.col.sideMarker = ShadeColor(lib.ui.col.sideMarker, percent);
			lib.ui.col.sideMarker_nobw = ShadeColor(lib.ui.col.sideMarker_nobw, percent);
			lib.ui.col.selectionFrame = ShadeColor(lib.ui.col.selectionFrame, percent);
			lib.ui.col.sbarBtns = ShadeColor(lib.ui.col.sbarBtns, percent);
			lib.ui.col.sbarNormal = ShadeColor(lib.ui.col.sbarNormal, percent);
			lib.ui.col.sbarHovered = ShadeColor(lib.ui.col.sbarHovered, percent);
			lib.ui.col.sbarDrag = ShadeColor(lib.ui.col.sbarDrag, percent);

			// * BIOGRAPHY COLORS * //
			bio.ui.col.bg = pl.col.bg;
			bio.ui.col.bottomLine = pl.col.header_line_normal;
			bio.ui.col.centerLine = pl.col.header_line_normal;
			bio.ui.col.sbarBtns = ShadeColor(bio.ui.col.sbarBtns, percent);
			bio.ui.col.sbarNormal = ShadeColor(bio.ui.col.sbarNormal, percent);
			bio.ui.col.sbarHovered = ShadeColor(bio.ui.col.sbarHovered, percent);
			bio.ui.col.sbarDrag = ShadeColor(bio.ui.col.sbarDrag, percent);

			// * MAIN COLORS * //
			grCol.bg = ShadeColor(grCol.bg, percent);
			grCol.uiHacksFrame = ShadeColor(grCol.uiHacksFrame, percent);
			grCol.shadow = ShadeColor(grCol.shadow, percent);
			grCol.detailsBg = ShadeColor(grCol.detailsBg, percent);
			grCol.timelineAdded = ShadeColor(grCol.timelineAdded, percent);
			grCol.timelinePlayed = ShadeColor(grCol.timelinePlayed, percent);
			grCol.timelineUnplayed = ShadeColor(grCol.timelineUnplayed, percent);
			grCol.timelineFrame = ShadeColor(grCol.timelineFrame, percent);
			grCol.popupBg = ShadeColor(grCol.popupBg, percent);
			if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

			// * TOP MENU BUTTON COLORS * //
			grCol.menuBgColor = ShadeColor(grCol.menuBgColor, percent);
			grCol.menuStyleBg = ShadeColor(grCol.menuStyleBg, percent);
			grCol.menuRectStyleEmbossTop = ShadeColor(grCol.menuRectStyleEmbossTop, percent);
			grCol.menuRectStyleEmbossBottom = ShadeColor(grCol.menuRectStyleEmbossBottom, percent);
			grCol.menuRectNormal = ShadeColor(grCol.menuRectNormal, percent);
			grCol.menuRectHovered = ShadeColor(grCol.menuRectHovered, percent);
			grCol.menuRectDown = grCol.menuRectHovered;

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			grCol.transportEllipseBg = ShadeColor(grCol.transportEllipseBg, percent);
			grCol.transportEllipseNormal = ShadeColor(grCol.transportEllipseNormal, percent);
			grCol.transportEllipseHovered = ShadeColor(grCol.transportEllipseHovered, percent);
			grCol.transportEllipseDown = grCol.transportEllipseHovered;
			grCol.transportStyleBg = ShadeColor(grCol.transportStyleBg, percent);
			grCol.transportStyleTop = ShadeColor(grCol.transportStyleTop, percent);
			grCol.transportStyleBottom = ShadeColor(grCol.transportStyleBottom, percent);

			// * PROGRESS BAR COLORS * //
			grCol.progressBar = ShadeColor(grCol.progressBar, percent);
			grCol.progressBarStreaming = ShadeColor(grCol.progressBarStreaming, percent);
			grCol.progressBarFrame = ShadeColor(grCol.progressBarFrame, percent);
			grCol.progressBarFill = ShadeColor(grCol.progressBarFill, percent);

			// * PEAKMETER BAR COLORS * //
			grCol.peakmeterBarProg = ShadeColor(grCol.peakmeterBarProg, percent);
			grCol.peakmeterBarProgFill = ShadeColor(grCol.peakmeterBarProgFill, percent);
			grCol.peakmeterBarFillTop = ShadeColor(grCol.peakmeterBarFillTop, percent);
			grCol.peakmeterBarFillMiddle = ShadeColor(grCol.peakmeterBarFillMiddle, percent);
			grCol.peakmeterBarFillBack = ShadeColor(grCol.peakmeterBarFillBack, percent);
			grCol.peakmeterBarVertProgFill = ShadeColor(grCol.peakmeterBarVertProgFill, percent);
			grCol.peakmeterBarVertFill = ShadeColor(grCol.peakmeterBarVertFill, percent);
			grCol.peakmeterBarVertFillPeaks = ShadeColor(grCol.peakmeterBarVertFillPeaks, percent);

			// * WAVEFORM BAR COLORS * //
			grCol.waveformBarFillFront = ShadeColor(grCol.waveformBarFillFront, percent);
			grCol.waveformBarFillBack  = ShadeColor(grCol.waveformBarFillBack, percent);
			grCol.waveformBarFillPreFront = ShadeColor(grCol.waveformBarFillPreFront, percent);
			grCol.waveformBarFillPreBack = ShadeColor(grCol.waveformBarFillPreBack, percent);
			grCol.waveformBarIndicator = ShadeColor(grCol.waveformBarIndicator, percent);

			// * VOLUME BAR COLORS * //
			grCol.volumeBar = ShadeColor(grCol.volumeBar, percent);
			grCol.volumeBarFrame = ShadeColor(grCol.volumeBarFrame, percent);
			grCol.volumeBarFill = ShadeColor(grCol.volumeBarFill, percent);

			// * STYLE COLORS * //
			grCol.styleProgressBar = ShadeColor(grCol.styleProgressBar, percent);
			grCol.styleProgressBarLineTop = ShadeColor(grCol.styleProgressBarLineTop, percent);
			grCol.styleProgressBarLineBottom = ShadeColor(grCol.styleProgressBarLineBottom, percent);
			grCol.styleVolumeBar = ShadeColor(grCol.styleVolumeBar, percent);

			// * ONLY DARKEN BLACK TEXT AND BUTTON COLORS BUT NOT WHITE TEXT COLORS * //
			const bgColBrightness = Color.BRT(grCol.bg);
			const txtColBrightness = Color.BRT(pl.col.row_title_normal);
			if (bgColBrightness < 200 && txtColBrightness < 150) {
				this.adjustTextButtonColors(percent, true, false, false, false);
			}
		}
		else if (grSet.themeBrightness > 0) { // * Lighten
			// * PLAYLIST COLORS * //
			pl.col.bg = TintColor(pl.col.bg, percent);
			pl.col.plman_bg = TintColor(pl.col.plman_bg, percent);
			pl.col.plman_text_normal = TintColor(pl.col.plman_text_normal, percent);
			pl.col.header_nowplaying_bg = TintColor(pl.col.header_nowplaying_bg, percent);
			pl.col.header_sideMarker = TintColor(pl.col.header_sideMarker, percent);
			pl.col.header_line_normal = TintColor(pl.col.header_line_normal, percent);
			pl.col.header_line_playing = TintColor(pl.col.header_line_playing, percent);
			pl.col.row_nowplaying_bg = TintColor(pl.col.row_nowplaying_bg, percent);
			pl.col.row_stripes_bg = TintColor(pl.col.row_stripes_bg, percent);
			pl.col.row_selection_bg = TintColor(pl.col.row_selection_bg, percent);
			pl.col.row_selection_frame = TintColor(pl.col.row_selection_frame, percent);
			pl.col.row_sideMarker = TintColor(pl.col.row_sideMarker, percent);
			pl.col.row_disc_subheader_line = TintColor(pl.col.row_disc_subheader_line, percent);
			pl.col.sbar_btn_normal = TintColor(pl.col.sbar_btn_normal, percent);
			pl.col.sbar_btn_hovered = TintColor(pl.col.sbar_btn_hovered, percent);
			pl.col.sbar_thumb_normal = TintColor(pl.col.sbar_thumb_normal, percent);
			pl.col.sbar_thumb_hovered = TintColor(pl.col.sbar_thumb_hovered, percent);
			pl.col.sbar_thumb_drag = TintColor(pl.col.sbar_thumb_drag, percent);

			// * LIBRARY COLORS * //
			lib.ui.col.bg = pl.col.bg;
			lib.ui.col.line = TintColor(lib.ui.col.line, percent);
			lib.ui.col.s_line = TintColor(lib.ui.col.s_line, percent);
			lib.ui.col.nowPlayingBg = TintColor(lib.ui.col.nowPlayingBg, percent);
			lib.ui.col.sideMarker = TintColor(lib.ui.col.sideMarker, percent);
			lib.ui.col.sideMarker_nobw = TintColor(lib.ui.col.sideMarker_nobw, percent);
			lib.ui.col.selectionFrame = TintColor(lib.ui.col.selectionFrame, percent);
			lib.ui.col.sbarBtns = TintColor(lib.ui.col.sbarBtns, percent);
			lib.ui.col.sbarNormal = TintColor(lib.ui.col.sbarNormal, percent);
			lib.ui.col.sbarHovered = TintColor(lib.ui.col.sbarHovered, percent);
			lib.ui.col.sbarDrag = TintColor(lib.ui.col.sbarDrag, percent);

			// * BIOGRAPHY COLORS * //
			bio.ui.col.bg = pl.col.bg;
			bio.ui.col.bottomLine = pl.col.header_line_normal;
			bio.ui.col.centerLine = pl.col.header_line_normal;
			bio.ui.col.sbarBtns = TintColor(bio.ui.col.sbarBtns, percent);
			bio.ui.col.sbarNormal = TintColor(bio.ui.col.sbarNormal, percent);
			bio.ui.col.sbarHovered = TintColor(bio.ui.col.sbarHovered, percent);
			bio.ui.col.sbarDrag = TintColor(bio.ui.col.sbarDrag, percent);

			// * MAIN COLORS * //
			grCol.bg = TintColor(grCol.bg, percent);
			grCol.uiHacksFrame = TintColor(grCol.uiHacksFrame, percent);
			grCol.shadow = TintColor(grCol.shadow, percent);
			grCol.detailsBg = TintColor(grCol.detailsBg, percent);
			grCol.timelineAdded = TintColor(grCol.timelineAdded, percent);
			grCol.timelinePlayed = TintColor(grCol.timelinePlayed, percent);
			grCol.timelineUnplayed = TintColor(grCol.timelineUnplayed, percent);
			grCol.timelineFrame = TintColor(grCol.timelineFrame, percent);
			grCol.popupBg = TintColor(grCol.popupBg, percent);
			if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

			// * TOP MENU BUTTON COLORS * //
			grCol.menuBgColor = TintColor(grCol.menuBgColor, percent);
			grCol.menuStyleBg = TintColor(grCol.menuStyleBg, percent);
			grCol.menuRectStyleEmbossTop = TintColor(grCol.menuRectStyleEmbossTop, percent);
			grCol.menuRectStyleEmbossBottom = TintColor(grCol.menuRectStyleEmbossBottom, percent);
			grCol.menuRectNormal = TintColor(grCol.menuRectNormal, percent);
			grCol.menuRectHovered = TintColor(grCol.menuRectHovered, percent);
			grCol.menuRectDown = grCol.menuRectHovered;

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			grCol.transportEllipseBg = TintColor(grCol.transportEllipseBg, percent);
			grCol.transportEllipseNormal = TintColor(grCol.transportEllipseNormal, percent);
			grCol.transportEllipseHovered = TintColor(grCol.transportEllipseHovered, percent);
			grCol.transportEllipseDown = grCol.transportEllipseHovered;
			grCol.transportStyleBg = TintColor(grCol.transportStyleBg, percent);
			grCol.transportStyleTop = TintColor(grCol.transportStyleTop, percent);
			grCol.transportStyleBottom = TintColor(grCol.transportStyleBottom, percent);

			// * PROGRESS BAR COLORS * //
			grCol.progressBar = TintColor(grCol.progressBar, percent);
			grCol.progressBarStreaming = TintColor(grCol.progressBarStreaming, percent);
			grCol.progressBarFrame = TintColor(grCol.progressBarFrame, percent);
			grCol.progressBarFill = TintColor(grCol.progressBarFill, percent);

			// * PEAKMETER BAR COLORS * //
			grCol.peakmeterBarProg = TintColor(grCol.peakmeterBarProg, percent);
			grCol.peakmeterBarProgFill = TintColor(grCol.peakmeterBarProgFill, percent);
			grCol.peakmeterBarFillTop = TintColor(grCol.peakmeterBarFillTop, percent);
			grCol.peakmeterBarFillMiddle = TintColor(grCol.peakmeterBarFillMiddle, percent);
			grCol.peakmeterBarFillBack = TintColor(grCol.peakmeterBarFillBack, percent);
			grCol.peakmeterBarVertProgFill = TintColor(grCol.peakmeterBarVertProgFill, percent);
			grCol.peakmeterBarVertFill = TintColor(grCol.peakmeterBarVertFill, percent);
			grCol.peakmeterBarVertFillPeaks = TintColor(grCol.peakmeterBarVertFillPeaks, percent);

			// * WAVEFORM BAR COLORS * //
			grCol.waveformBarFillFront = TintColor(grCol.waveformBarFillFront, percent);
			grCol.waveformBarFillBack  = TintColor(grCol.waveformBarFillBack, percent);
			grCol.waveformBarFillPreFront = TintColor(grCol.waveformBarFillPreFront, percent);
			grCol.waveformBarFillPreBack = TintColor(grCol.waveformBarFillPreBack, percent);
			grCol.waveformBarIndicator = TintColor(grCol.waveformBarIndicator, percent);

			// * VOLUME BAR COLORS * //
			grCol.volumeBar = TintColor(grCol.volumeBar, percent);
			grCol.volumeBarFrame = TintColor(grCol.volumeBarFrame, percent);
			grCol.volumeBarFill = TintColor(grCol.volumeBarFill, percent);

			// * STYLE COLORS * //
			grCol.styleProgressBar = TintColor(grCol.styleProgressBar, percent);
			grCol.styleProgressBarLineTop = TintColor(grCol.styleProgressBarLineTop, percent);
			grCol.styleProgressBarLineBottom = TintColor(grCol.styleProgressBarLineBottom, percent);
			grCol.styleVolumeBar = TintColor(grCol.styleVolumeBar, percent);

			// * LIGHTEN TEXT AND BUTTON COLORS * //
			const bgColBrightness = Color.BRT(grCol.bg);
			if (bgColBrightness < 150 && bgColBrightness > 50) {
				this.adjustTextButtonColors(percent, false, false, true, false);
			}
		}

		const bgColBrightness = Color.BRT(grCol.bg);
		if (grSet.themeBrightness > 20 && bgColBrightness < 200 && bgColBrightness > 125) {
			grCol.lightBg = false;
			this.adjustTextButtonColors(percent, false, true, false, false);
		}
		else if (grSet.themeBrightness < -20 && bgColBrightness < 150 && bgColBrightness > 50) {
			grCol.lightBg = false;
			this.adjustTextButtonColors(percent, false, false, false, true);
		}
	}

	/**
	 * Creates the color objects.
	 * @param {number} color - The primary color.
	 * @param {number} [color2] - The secondary color.
	 * @returns {Color} The color as an object.
	 */
	createThemeColorObject(color, color2) {
		if (color2 === undefined) color2 = color;
		const themeObj = {
			primary: color.val,
			primary_alt: color2.val,
			darkAccent: ShadeColor(color.val, 30),
			darkAccent_alt: ShadeColor(color2.val, 30),
			accent: ShadeColor(color.val, 15),
			accent_alt: ShadeColor(color2.val, 15),
			lightAccent: TintColor(color.val, 20),
			lightAccent_alt: TintColor(color2.val, 20)
		};
		if (color.brightness < 18) {
			// Hard code these values otherwise darkAccent and accent can be very hard to see on background
			themeObj.darkAccent = RGB(32, 32, 32);
			themeObj.darkAccent_alt = RGB(32, 32, 32);
			themeObj.accent = RGB(56, 56, 56);
			themeObj.accent_alt = RGB(56, 56, 56);
			themeObj.lightAccent = RGB(78, 78, 78);
			themeObj.lightAccent_alt = RGB(78, 78, 78);
		}
		else if (color.brightness < 40) {
			themeObj.darkAccent = ShadeColor(color.val, 35);
			themeObj.darkAccent_alt = ShadeColor(color2.val, 35);
			themeObj.accent = TintColor(color.val, 10);
			themeObj.accent_alt = TintColor(color2.val, 10);
			themeObj.lightAccent = TintColor(color.val, 20);
			themeObj.lightAccent_alt = TintColor(color2.val, 20);
		}
		else if (color.brightness > 210) {
			themeObj.darkAccent = ShadeColor(color.val, 30);
			themeObj.darkAccent_alt = ShadeColor(color2.val, 30);
			themeObj.accent = ShadeColor(color.val, 20);
			themeObj.accent_alt = ShadeColor(color2.val, 20);
			themeObj.lightAccent = ShadeColor(color.val, 10);
			themeObj.lightAccent_alt = ShadeColor(color2.val, 10);
		}
		return themeObj;
	}

	/**
	 * Gets the shadow color for the middle album art and panel shadow based on active theme styles.
	 * @returns {number} The shadow color.
	 */
	getMiddleShadowColor() {
		return grSet.styleBlackAndWhite && grm.ui.noAlbumArtStub ? RGB(0, 0, 0) :
			grSet.styleNighttime || grSet.styleBlackAndWhite2 || grSet.styleRebornBlack ? RGBA(0, 0, 0, 30) :
			grCol.shadow;
	}

	/**
	 * Determines if the background color is considered light based on various conditions.
	 * @param {number} colBrightness - The color brightness value to check.
	 * @returns {boolean} - Returns true if the background is considered light, otherwise false.
	 */
	isLightBg(colBrightness) {
		return colBrightness + grCol.imgBrightness > 240 && (grSet.styleBlend || grSet.styleBlend2)
		||
		colBrightness > 150 && (!grSet.styleBlend && !grSet.styleBlend2 || grSet.styleBlend2 && grSet.styleRebornFusion2);
	}

	/**
	 * Determines if the background is considered light based on various conditions.
	 * This is used for the standard themes ('white', 'black', 'reborn', 'random', 'cream') without any special styles.
	 * @param {number} colBrightness - The primary color brightness value to check.
	 * @returns {boolean} - Returns true if the background is considered light, otherwise false.
	 */
	isLightBgStandard(colBrightness) {
		const lightBrightness = (colBrightness > 150) && (!grSet.styleBlend && !grSet.styleBlend2 && !grSet.styleRandomDark);

		const lightBlend =
			((colBrightness + grCol.imgBrightness > 240) && (grSet.styleBlend || grSet.styleBlend2))
			&&
			((colBrightness > 150 && ['white', 'black'].includes(grSet.theme)) || (['reborn', 'random'].includes(grSet.theme) && !grSet.styleRandomDark));

		const noAlbumArt = grm.ui.noAlbumArtStub && (grSet.theme === 'white' && !grSet.styleBlackAndWhite && !grm.ui.isStreaming || ['reborn', 'random'].includes(grSet.theme));

		return lightBrightness || lightBlend || noAlbumArt || grSet.theme === 'cream';
	}
	// #endregion

	// * PUBLIC METHODS - SET THEME COLORS * //
	// #region PUBLIC METHODS - SET THEME COLORS
	/**
	 * Sets Main, Playlist, Details, Library and Biography background color brightness rules.
	 * Based on background color and image brightness, text colors in theme will change accordingly to black or white.
	 * Used in White, Black, Reborn, Random and Custom themes.
	 */
	setBackgroundColorDefinition() {
		const primaryBrightness = Color.BRT(grCol.primary);
		const primaryBrightnessAlt = Color.BRT(grCol.primary_alt);
		const colBrightness = grSet.styleRebornFusion ? primaryBrightnessAlt : primaryBrightness;
		grCol.colBrightness = primaryBrightness;
		grCol.colBrightness2 = primaryBrightnessAlt;

		const standardThemes = ['white', 'black', 'reborn', 'random', 'cream'].includes(grSet.theme) && !grSet.styleRebornFusion && !grSet.styleRebornFusion2;
		const customThemes = grSet.theme.startsWith('custom');

		// * STANDARD THEMES * //
		if (standardThemes) {
			grCol.lightBg = this.isLightBgStandard(primaryBrightness);
		}

		// * GRADIENT STYLES, REBORN FUSION STYLES, CUSTOM THEMES * //
		if (!(grSet.styleGradient || grSet.styleGradient2 || grSet.styleRebornFusion || grSet.styleRebornFusion2 || customThemes)) {
			return;
		}
		else if (['reborn', 'random'].includes(grSet.theme)) {
			grCol.styleGradient = grCol.darkAccent;
			grCol.styleGradient2 = grCol.darkAccent;
		}

		const getColor = (styleGradient, styleGradient2, defaultColor, customColorKey) => {
			if (grSet.styleGradient)  return colBrightness - (CalcBrightness('RGBA', styleGradient) * 0.5);
			if (grSet.styleGradient2) return colBrightness - (CalcBrightness('RGBA', styleGradient2) * 0.5);
			if (grSet.styleRebornFusion2) return primaryBrightnessAlt;
			if (customThemes) return CalcBrightness('HEX', grCfg.cTheme[customColorKey]);
			return defaultColor;
		};

		grCol.lightBgMain      = this.isLightBg(getColor(grCol.styleGradient, grCol.styleGradient2, primaryBrightness, 'grCol_bg'));
		grCol.lightBgPlaylist  = this.isLightBg(getColor(null, null, primaryBrightness, 'pl_col_bg'));
		grCol.lightBgDetails   = this.isLightBg(getColor(null, null, primaryBrightness, 'grCol_detailsBg'));
		grCol.lightBgLibrary   = this.isLightBg(getColor(null, null, primaryBrightness, 'lib_ui_col_bg'));
		grCol.lightBgBiography = this.isLightBg(getColor(null, null, primaryBrightness, 'bio_ui_col_bg'));
	}

	/**
	 * Sets calculated image brightness from album art, mainly used when using style Blend 1 and 2 or style Black and white reborn.
	 */
	setImageBrightness() {
		if (grm.ui.albumArt && (libSet.theme !== 0 || grSet.styleBlend || grSet.styleBlend2 || grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2 || grSet.styleBlackAndWhiteReborn)) {
			grCol.imgBrightness = CalcImgBrightness(grm.ui.albumArt);
		}
	}

	/**
	 * Sets noAlbumArtColors, change col.primary when streaming, reset to default when playing from CD or using noAlbumArtStub.
	 */
	setNoAlbumArtColors() {
		if (grm.ui.isStreaming && (['white', 'black', 'reborn', 'random'].includes(grSet.theme))) {
			grCol.primary = RGB(207, 0, 5);
		}
		else if (grm.ui.isPlayingCD || grm.ui.noAlbumArtStub || !fb.IsPlaying && !grSet.panelBrowseMode) {
			grm.ui.initCustomTheme();
			grm.color.setThemeColors();
			bio.ui.updateProp(1); // Needed to update color for NO PHOTO/COVER stub in Biography when changing themes
		}
	}

	/**
	 * Sets primary and optional secondary theme color as well as accents.
	 * @param {number} color - The primary color.
	 * @param {number} color2 - The secondary color.
	 */
	setTheme(color, color2) {
		if (color2 === undefined) color2 = color;
		let themeCol = new Color(color.primary);
		const customThemes = grSet.theme.startsWith('custom');

		if (ColorDistance(color.primary, grCol.bg, true) < (themeCol.isCloseToGrayscale ? 60 : 45) &&
			(grSet.theme !== 'reborn' && grSet.theme !== 'random' && (grSet.theme !== 'black' && !grSet.styleBlackReborn) && !customThemes)) {
			if (grCfg.settings.showDebugThemeLog) console.log('>>> Theme primary color is too close to bg color. Tinting theme color.');
			color.primary = TintColor(color.primary, 15);
			color.accent = TintColor(color.primary, 10);
			themeCol = new Color(color.primary);
		}
		grCol.primary = color.primary;
		grCol.primary_alt = color2.primary_alt;

		if (ColorDistance(color.primary, grCol.progressBar, true) < (themeCol.isCloseToGrayscale ? 60 : 45)) {
			// Progress bar fill is too close in color to bg
			if (grCfg.settings.showDebugThemeLog) console.log('>>> Theme primary color is too close to progress bar. Adjusting progressBar');
			if (grSet.theme === 'white' && themeCol.brightness < 125) {
				grCol.progressBar = RGB(180, 180, 180);
			}
		}

		if (grm.details) {
			grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);
		}

		grCol.primary     = color.primary;
		grCol.primary_alt = color2.primary_alt;

		// * Reborn/Random theme main tone palette
		grCol.darkAccent_100     = ShadeColor(color.primary, 100);
		grCol.darkAccent_100_alt = ShadeColor(color2.primary_alt, 100);
		grCol.darkAccent_75      = ShadeColor(color.primary, 75);
		grCol.darkAccent_75_alt  = ShadeColor(color2.primary_alt, 75);
		grCol.darkAccent_65      = ShadeColor(color.primary, 65);
		grCol.darkAccent_65_alt  = ShadeColor(color2.primary_alt, 65);
		grCol.darkAccent_50      = ShadeColor(color.primary, 50);
		grCol.darkAccent_50_alt  = ShadeColor(color2.primary_alt, 50);
		grCol.darkAccent         = color.darkAccent;
		grCol.darkAccent_alt     = color2.darkAccent_alt;
		grCol.accent             = color.accent;
		grCol.accent_alt         = color2.accent_alt;

		grCol.lightAccent_2      = TintColor(color.primary, 2);
		grCol.lightAccent_2_alt  = TintColor(color2.primary_alt, 2);
		grCol.lightAccent_7      = TintColor(color.primary, 7);
		grCol.lightAccent_7_alt  = TintColor(color2.primary_alt, 7);
		grCol.lightAccent_10     = TintColor(color.primary, 10);
		grCol.lightAccent_10_alt = TintColor(color2.primary_alt, 10);

		grCol.lightAccent         = color.lightAccent;
		grCol.lightAccent_alt     = color2.lightAccent_alt;
		grCol.lightAccent_35      = TintColor(color.primary, 35);
		grCol.lightAccent_35_alt  = TintColor(color2.primary_alt, 35);
		grCol.lightAccent_50      = TintColor(color.primary, 50);
		grCol.lightAccent_50_alt  = TintColor(color2.primary_alt, 50);
		grCol.lightAccent_65      = TintColor(color.primary, 65);
		grCol.lightAccent_65_alt  = TintColor(color2.primary_alt, 65);
		grCol.lightAccent_80      = TintColor(color.primary, 80);
		grCol.lightAccent_80_alt  = TintColor(color2.primary_alt, 80);
		grCol.lightAccent_100     = TintColor(color.primary, 100);
		grCol.lightAccent_100_alt = TintColor(color2.primary_alt, 100);

		// * Change col.primary if too bright or too dark
		if (grSet.theme === 'white' && (ColorDistance(grCol.primary, grCol.progressBar)) < 60) {
			grCol.primary = grCol.darkAccent;
		}
	}

	/**
	 * Sets default theme colors, used on startup when nothing has been played or using noAlbumArtStub.
	 */
	setThemeColors() {
		const themeColors = {
			white: this.whiteTheme.colors,
			black: this.blackTheme.colors,
			reborn: this.rebornTheme.colors,
			random: this.randomTheme.colors,
			blue: this.blueTheme.colors,
			darkblue: this.darkblueTheme.colors,
			red: this.redTheme.colors,
			cream: this.creamTheme.colors,
			nblue: this.nblueTheme.colors,
			ngreen: this.ngreenTheme.colors,
			nred: this.nredTheme.colors,
			ngold: this.ngoldTheme.colors
		};

		if (themeColors[grSet.theme]) {
			this.setTheme(themeColors[grSet.theme]);
		} else if (grSet.theme.startsWith('custom')) {
			this.setTheme(this.customTheme.colors);
		}
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
			grCol_preloaderUIHacksFrame: RGBFtoHEX(grCol.bg),
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

	// * PUBLIC METHODS - RANDOM COLOR * //
	// #region PUBLIC METHODS - RANDOM COLOR
	/**
	 * Generates a random theme color, used in Random theme.
	 */
	getRandomThemeColor() {
		if (grSet.theme !== 'random' || grm.ui.isStreaming || grm.ui.isPlayingCD ||
			!grm.ui.getRandomThemeColorContextMenu && ($('[%GR_THEMECOLOR%]') || $('[%GR_THEMECOLOR2%]'))) {
			return;
		}

		const generateRandomColor = () => {
			const R = Math.floor((Math.random() * (grSet.styleRandomPastel ? 127 : 27)) + (grSet.styleRandomPastel ? 127 : 27));
			const G = Math.floor((Math.random() * (grSet.styleRandomPastel ? 127 : 27)) + (grSet.styleRandomPastel ? 127 : 27));
			const B = Math.floor((Math.random() * (grSet.styleRandomPastel ? 127 : 27)) + (grSet.styleRandomPastel ? 127 : 27));
			return grSet.styleRandomPastel || grSet.styleRandomDark ? (R << 16) + (G << 8) + B : ((1 << 24) * Math.random() | 0);
		};

		const color = new Color(generateRandomColor());
		const tObj = this.createThemeColorObject(color);
		grm.color.setTheme(tObj);

		if (grCfg.settings.showDebugThemeLog) {
			console.log('Random generated color:', color.getRGB(true));
			console.log('Random color brightness:', color.brightness);
		}
		if (grCfg.settings.showDebugThemeOverlay) grm.ui.selectedPrimaryColor = color.getRGB(true);
	}

	/**
	 * Auto generates new colors depending on time interval, used in style Random theme auto color.
	 */
	getRandomThemeAutoColor() {
		grm.ui.clearTimer('randomThemeAutoColor');

		if (grSet.styleRandomAutoColor !== 'off' && grSet.styleRandomAutoColor !== 'track') {
			grm.ui.randomThemeAutoColorTimer = setInterval(() => {
				grm.ui.initTheme();
			}, grSet.styleRandomAutoColor);
		}
		else if (grSet.styleRandomAutoColor === 'track') {
			grm.ui.initTheme();
		}
		DebugLog('\n>>> initTheme => getRandomThemeAutoColor <<<\n');
	}
	// #endregion

	// * PUBLIC METHODS - ALBUM ART COLOR * //
	// #region PUBLIC METHODS - ALBUM ART COLOR
	/**
	 * Finds the brightest color based on given parameters.
	 * @param {Array} colorsWeighted - Array of color objects with added weight properties.
	 * @param {number} currentBrightness - The brightness level that colors must exceed.
	 * @param {number} maxBrightness - The maximum brightness level that colors must not exceed.
	 * @param {number} minFrequency - The minimum frequency threshold that colors must exceed.
	 * @returns {Color|null} The brightest Color object or null if no color meets the criteria.
	 */
	findBrightestColor(colorsWeighted, currentBrightness, maxBrightness, minFrequency) {
		let brightestColor;
		let maxWeight = 0;

		for (const c of colorsWeighted) {
			if (!c.col.isCloseToGrayscale &&
				(c.col.brightness > currentBrightness) &&
				(c.col.brightness < maxBrightness) &&
				(c.freq > minFrequency) &&
				(c.weight > maxWeight)) {
				maxWeight = c.weight;
				brightestColor = c.col;
			}
		}

		return brightestColor ? new Color(brightestColor.val) : null;
	}

	/**
	 * Extracts the primary and secondary optional color from an image.
	 * @param {GdiBitmap} image - The image to extract the colors from.
	 * @param {number} maxColorsToPull - The max number of colors in the palette.
	 * @param {number} [secondaryColor] - The secondary picked color, used in Reborn fusion.
	 * @returns {number|null} The primary color value if secondaryColor is not provided, otherwise the secondary color value.
	 * Returns null on error.
	 */
	getThemeColorsJson(image, maxColorsToPull, secondaryColor) {
		const debugThemeLog = grCfg.settings.showDebugThemeLog;
		const debugThemeOverlay = grCfg.settings.showDebugThemeOverlay;
		const minFreq = 0.015;
		const minFreqBrightestCol1 = 0.01;
		const minFreqBrightestCol2 = 0.05;
		const maxBrightness = grSet.theme === 'black' || grSet.styleBlend || ['reborn', 'random'].includes(grSet.theme) && grSet.styleBlend2 ? 255 : 212;
		const midBrightness2Value = RandomMinMax(60, 120);

		try {
			const colorsWeighted = JSON.parse(image.GetColourSchemeJSON(maxColorsToPull)).map(c => ({ ...c, col: new Color(c.col) }));
			let maxWeight = 0;
			let maxWeight2 = 0;
			let selectedColor = new Color(colorsWeighted[0].col);  // Use first color in case no color selected below
			let selectedColor2 = secondaryColor ? new Color(colorsWeighted[1].col) : null; // Use second color in case no color selected below

			if (debugThemeLog) console.log('idx      color        bright  freq   weight');

			for (const [i, c] of colorsWeighted.entries()) {
				const col = c.col;
				const midBrightness = 127 - Math.abs(127 - col.brightness); // Favors colors with brightness around 127
				const midBrightness2 = midBrightness2Value - Math.abs(midBrightness2Value - col.brightness); // Favors colors with random brightness from 60 - 120
				c.weight = c.freq * midBrightness * 10;
				c.weight2 = c.freq * midBrightness2 * 10;

				if (c.freq >= minFreq && !col.isCloseToGrayscale && col.brightness < maxBrightness) {
					if (debugThemeLog) {
						console.log(LeftPad(i, 2), col.getRGB(true, true), LeftPad(col.brightness, 4), ' ', `${LeftPad((c.freq * 100).toFixed(2), 5)}%`, LeftPad(c.weight.toFixed(2), 7));
					}
					if (c.weight > maxWeight) {
						maxWeight = c.weight;
						selectedColor = col;
					}
					if (secondaryColor && c.weight2 > maxWeight2) {
						maxWeight2 = c.weight2;
						selectedColor2 = col;
					}
				}
				else if (debugThemeLog) {
					console.log(' -', col.getRGB(true, true), LeftPad(col.brightness, 4), ' ', `${LeftPad((c.freq * 100).toFixed(2), 5)}%`, col.isCloseToGrayscale ? '   grey' : (c.freq < minFreq) ? '   freq' : ' bright');
				}
			}

			if (selectedColor.brightness < 37) {
				selectedColor = this.findBrightestColor(colorsWeighted, selectedColor.brightness, maxBrightness, minFreqBrightestCol1) || selectedColor;
				if (debugThemeLog) console.log(selectedColor.getRGB(true), 'brightness:', selectedColor.brightness, 'too dark -- searching for highlight color');
			}
			if (secondaryColor && selectedColor2.brightness < 37) {
				selectedColor2 = this.findBrightestColor(colorsWeighted, selectedColor2.brightness, maxBrightness, minFreqBrightestCol2) || selectedColor2;
				if (debugThemeLog) console.log(selectedColor2.getRGB(true), 'brightness:', selectedColor2.brightness, 'too dark -- searching for highlight color');
			}

			if (debugThemeLog) {
				console.log('Primary color:', selectedColor.getRGB(true));
				if (secondaryColor) console.log('Primary color 2:', selectedColor2.getRGB(true));
			}
			if (debugThemeOverlay) {
				grm.ui.selectedPrimaryColor = selectedColor.getRGB(true);
				if (secondaryColor) grm.ui.selectedPrimaryColor2 = selectedColor2.getRGB(true);
			}

			return secondaryColor ? selectedColor2.val : selectedColor.val;
		}
		catch (e) {
			console.log('\n>>> Error => GetColourSchemeJSON failed!\n');
			return null;
		}
	}

	/**
	 * Sets the primary or secondary color from the value of getThemeColorsJson or from the custom GR-tag.
	 * @param {GdiBitmap} image - The image from which the colors will be picked.
	 */
	getThemeColors(image) {
		const debugThemeLog = grCfg.settings.showDebugThemeLog;
		const rebornFusion = grSet.theme === 'reborn' && (grSet.styleRebornFusion || grSet.styleRebornFusion2 || grSet.styleRebornFusionAccent);
		const val = $('[%GR_THEMECOLOR%]');
		const val2 = $('[%GR_THEMECOLOR2%]');
		let color;
		let color2;
		let calculatedColor;
		let calculatedColor2;

		if (val.length) {
			calculatedColor = ColStringToRGB(val);
			calculatedColor2 = ColStringToRGB(val2);
		} else {
			calculatedColor = this.getThemeColorsJson(image, 14, false);
			calculatedColor2 = rebornFusion ? this.getThemeColorsJson(image, 14, true) : undefined;
		}

		if (isNaN(calculatedColor)) return;

		color = new Color(calculatedColor);
		if (rebornFusion) color2 = new Color(calculatedColor2);

		if (grSet.theme !== 'black') {
			const shadeAmount = grSet.theme === 'white' ? 12 : 3;
			while (color.brightness > 220) {
				calculatedColor = ShadeColor(calculatedColor, shadeAmount);
				color = new Color(calculatedColor);
				if (debugThemeLog) console.log(' >> Shading: ', ColToRgb(calculatedColor), ' - brightness: ', color.brightness);
			}
		}

		if (!color.isGrayscale) {
			while (color.brightness <= 17) {
				calculatedColor = TintColor(calculatedColor, 3);
				color = new Color(calculatedColor);
				if (debugThemeLog) console.log(' >> Tinting: ', ColToRgb(calculatedColor), ' - brightness: ', color.brightness);
			}
		}

		const tObj = this.createThemeColorObject(color);
		if (rebornFusion) {
			const tObj2 = this.createThemeColorObject(color, color2);
			grm.color.setTheme(tObj, tObj2);
		} else {
			grm.color.setTheme(tObj);
		}

		if (debugThemeLog) {
			console.log('Primary color brightness:', color.brightness);
			if (color2) console.log('Primary color 2 brightness:', color2.brightness);
		}
	}
	// #endregion
}


//////////////////////
// * THEME COLORS * //
//////////////////////
/**
 * A class that provides the full collection of all theme colors and its methods.
 * @augments {BaseColors}
 */
class ThemeColors extends BaseColors {
	// * PUBLIC METHODS - WHITE THEME * //
	// #region PUBLIC METHODS - WHITE THEME
	/**
	 * The Playlist colors for White theme used in Options > Theme > White.
	 */
	playlistColorsWhiteTheme() {
		// * MAIN COLORS * //
		pl.col.bg = RGB(255, 255, 255);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(140, 140, 140);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(120, 120, 120) : RGB(80, 80, 80);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(80, 80, 80) : RGB(140, 140, 140);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = grCol.primary;
		pl.col.header_sideMarker = pl.col.header_nowplaying_bg;
		pl.col.header_artist_normal = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_artist_playing = this.LAYOUT !== 'default' ? RGB(255, 255, 255) : this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_album_normal = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_album_playing = this.LAYOUT !== 'default' ? RGB(245, 245, 245) : this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_info_normal = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_info_playing = this.LAYOUT !== 'default' ? RGB(245, 245, 245) : pl.col.header_info_normal;
		pl.col.header_date_normal = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_date_playing = this.LAYOUT !== 'default' ? RGB(245, 245, 245) : pl.col.header_date_normal;
		pl.col.header_line_normal = RGB(200, 200, 200);
		pl.col.header_line_playing = RGB(200, 200, 200);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = grCol.primary;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(245, 245, 245, 130) : this.ALT ? RGB(255, 255, 255) : RGB(245, 245, 245);
		pl.col.row_selection_bg = RGB(200, 200, 200);
		pl.col.row_selection_frame = pl.col.row_selection_bg;
		pl.col.row_sideMarker = grCol.primary;
		pl.col.row_title_normal = this.LAYOUT !== 'compact' ? this.BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100) : this.LAYOUT === 'compact' ? this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120) : '';
		pl.col.row_title_playing = RGB(245, 245, 245);
		pl.col.row_title_selected = RGB(0, 0, 0);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = RGB(200, 200, 200);
		pl.col.row_drag_line = ShadeColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = RGB(120, 120, 120);
		pl.col.sbar_btn_hovered = RGB(0, 0, 0);
		pl.col.sbar_thumb_normal = RGB(200, 200, 200);
		pl.col.sbar_thumb_hovered = RGB(120, 120, 120);
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for White theme used in Options > Theme > White.
	 */
	libraryColorsWhiteTheme() {
		// * MAIN COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;
		lib.ui.col.imgOverlaySel = this.BW ? RGBA(230, 230, 230, 175) : RGBtoRGBA(lib.ui.col.bg, 175);

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = this.BW ? RGB(230, 230, 230) : pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker =
			this.BW ? grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255) :
			this.BW2 ? grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40) :
			lib.ui.col.nowPlayingBg;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = this.BW ? RGB(220, 220, 220) : this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		lib.ui.col.iconPlus_h = this.BW ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.iconPlus_sel = this.BW ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.iconPlusBg = RGB(240, 240, 240);
		lib.ui.col.iconMinus_e = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(0, 0, 0);

		// * TEXT COLORS * //
		lib.ui.col.text =
			libSet.albumArtShow && libImg.labels.overlayDark ? RGB(220, 220, 220) :
			this.BW ? RGB(200, 200, 200) :
			this.BLEND ? RGB(60, 60, 60) :
			RGB(100, 100, 100);

		lib.ui.col.text_h =
			libSet.albumArtShow && libImg.labels.overlayDark ||
			this.BW && (!libSet.albumArtShow || libSet.albumArtShow && libSet.highLightRow !== 2) ? RGB(255, 255, 255) :
			RGB(0, 0, 0);

		lib.ui.col.text_nowp =
			this.BW || this.BW2 || libSet.albumArtShow && libImg.labels.overlayDark ||
			grCol.lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

		lib.ui.col.textSel =
			this.BW ?
				libSet.albumArtShow && ([1, 3].includes(libSet.albumArtLabelType) || ['coversLabelsBottom', 'coversLabelsBlend'].includes(grSet.libraryDesign)) ||
				grSet.libraryDesign === 'traditional' ? RGB(0, 0, 0) : RGB(255, 255, 255) :
			libSet.albumArtShow && !libImg.labels.overlayDark && libSet.albumArtLabelType !== 2 && !this.BW2 ? grCol.lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255) :
			RGB(0, 0, 0);

		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = this.BW ? RGB(200, 200, 200) : this.BLEND ? RGB(40, 40, 40) : RGB(80, 80, 80);
		lib.ui.col.count = lib.ui.col.text;

		// * BUTTON COLORS * //
		lib.ui.col.search = this.BW ? RGB(200, 200, 200) : this.BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100);
		lib.ui.col.searchBtn = this.BW ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.crossBtn = this.BW ? RGB(255, 255, 255) : this.BLEND ? RGB(40, 40, 40) : RGB(80, 80, 80);
		lib.ui.col.filterBtn = this.BW ? RGB(220, 220, 220) : this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		lib.ui.col.settingsBtn = this.BW ? RGB(220, 220, 220) : this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		lib.ui.col.line = this.BW ? RGB(45, 45, 45) : RGB(200, 200, 200);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = RGB(120, 120, 120);
		lib.ui.col.sbarNormal = RGB(114, 114, 114);
		lib.ui.col.sbarHovered = RGB(120, 120, 120);
		lib.ui.col.sbarDrag = RGB(120, 120, 120);
	}

	/**
	 * The Biography colors for White theme used in Options > Theme > White.
	 */
	biographyColorsWhiteTheme() {
		// * MAIN COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText =
			this.LAYOUT === 'artwork' ? this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120) :
			this.BW ? RGB(220, 220, 220) :
			this.BW2 ? RGB(80, 80, 80) :
			pl.col.header_artist_playing;

		bio.ui.col.bottomLine = (bio.ui.blur.blend || bio.ui.blur.light) ? RGB(120, 120, 120) : pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text =
			this.BW ? RGB(200, 200, 200) :
			this.BW2 ? RGB(80, 80, 80) :
			pl.col.row_title_normal;

		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = this.BW ? RGB(230, 230, 230) : this.BW2 ? RGB(25, 25, 25) : RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = this.BW ? RGB(0, 0, 0) : this.BW2 ? RGB(255, 255, 255) : grCol.lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = RGB(220, 160, 40);
		bio.ui.col.noPhotoStubBg =  RGB(245, 245, 245);
		bio.ui.col.noPhotoStubText = RGB(120, 120, 120);

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = RGB(120, 120, 120);
		bio.ui.col.sbarNormal = RGB(114, 114, 114);
		bio.ui.col.sbarHovered = RGB(120, 120, 120);
		bio.ui.col.sbarDrag = RGB(120, 120, 120);
	}

	/**
	 * The Main colors for White theme used in Options > Theme > White.
	 */
	mainColorsWhiteTheme() {
		// * MAIN COLORS * //
		grCol.bg = this.BEVEL ? RGB(255, 255, 255) : RGB(245, 245, 245);
		grCol.loadingThemeBg = this.BW ? RGB(230, 230, 230) : this.BW2 ? RGB(25, 25, 25) : RGB(245, 245, 245);
		grCol.uiHacksFrame =
			this.BW ? this.BEVEL ? RGB(255, 255, 255) : RGB(230, 230, 230) :
			this.BW2 ? this.BEVEL ? RGB(50, 50, 50) : RGB(25, 25, 25) :
			RGB(245, 245, 245);
		grCol.shadow = this.BW2 ? RGBA(0, 0, 0, 240) : RGBA(0, 0, 0, 25);
		grCol.discArtShadow = this.BW2 ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 10);
		grCol.noAlbumArtStub = this.BLEND12 ? RGB(80, 80, 80) : grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(120, 120, 120);
		grCol.lowerBarArtist = this.BLEND12 ? RGB(80, 80, 80) : RGB(120, 120, 120);
		grCol.lowerBarTitle = this.BLEND12 ? RGB(80, 80, 80) : RGB(120, 120, 120);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = grSet.lyricsBgImg ? RGB(255, 240, 150) : RGB(220, 160, 40);
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = grCol.primary !== RGB(25, 160, 240) && grm.ui.albumArt && !grm.ui.isStreaming ? grCol.primary : RGB(255, 255, 255);
		grCol.detailsText = grm.ui.isStreaming || grm.ui.isPlayingCD || !grm.ui.albumArt ? RGB(120, 120, 120) : grCol.lightBg ? RGB(55, 55, 55) : RGB(255, 255, 255);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 50 : 40) : grCol.lightAccent_50;
		grCol.timelinePlayed = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 35 : 25) : grCol.lightAccent_35;
		grCol.timelineUnplayed = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 20 : 10) : grCol.lightAccent;
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = this.BW ? RGB(230, 230, 230) : this.BW2 ? RGB(25, 25, 25) : RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = this.BW ? RGB(0, 0, 0) : this.BW2 ? RGB(255, 255, 255) : grCol.lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(255, 255, 255) :
			this.TMB === 'emboss' ? this.BEVEL ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			RGB(255, 255, 255);

		grCol.menuStyleBg =
			this.TMB === 'emboss' ? this.BEVEL ? RGB(235, 235, 235) : RGB(225, 225, 225) :
			this.BEVEL ? RGB(205, 205, 205) : RGB(220, 220, 220);

		grCol.menuRectStyleEmbossTop = RGB(255, 255, 255);
		grCol.menuRectStyleEmbossBottom = this.BEVEL ? RGB(200, 200, 200) : RGB(210, 210, 210);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGB(200, 200, 200) :
			this.BLEND12 ? this.BEVEL ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			this.ALT2 ? RGB(190, 190, 190) :
			RGB(200, 200, 200);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGB(200, 200, 200) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			this.BLEND12 ? this.BEVEL ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			this.ALT2 ? RGB(190, 190, 190) :
			RGB(200, 200, 200);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = this.BLEND12 ? RGB(80, 80, 80) : RGB(120, 120, 120);
		grCol.menuTextHovered = RGB(80, 80, 80);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = this.BLEND12 && fb.IsPlaying ? RGB(230, 230, 230) : RGB(255, 255, 255);
		grCol.transportEllipseNormal =  this.BLEND12 ? this.BEVEL ? RGB(200, 200, 200) : RGB(210, 210, 210) : RGB(220, 220, 220);
		grCol.transportEllipseHovered = this.BLEND12 ? this.BEVEL ? RGB(160, 160, 160) : RGB(170, 170, 170) : RGB(180, 180, 180);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(215, 215, 215) : RGB(220, 220, 220) :
			this.TPB === 'emboss' ? RGB(225, 225, 225) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(255, 255, 255) :
			this.TPB === 'emboss' ? RGB(255, 255, 255) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(190, 190, 190) : RGB(215, 215, 215) :
			this.TPB === 'emboss' ? this.BEVEL ? RGB(210, 210, 210) : RGB(225, 225, 225) : '';

		grCol.transportIconNormal =  this.BLEND12 || this.TPB === 'minimal' ? RGB(80, 80, 80) : RGB(120, 120, 120);
		grCol.transportIconHovered = this.BLEND12 || this.TPB === 'minimal' ? RGB(0, 0, 0) : RGB(60, 60, 60);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGB(245, 245, 245) : RGB(220, 220, 220) :
								  this.BEVEL ? this.BLEND12 ? RGB(235, 235, 235) : RGB(200, 200, 200) :
			this.BLEND12 && fb.IsPlaying && !grm.ui.noAlbumArtStub ? RGB(240, 240, 240) :
			RGB(220, 220, 220);

		grCol.progressBarStreaming = RGB(207, 0, 5);
		grCol.progressBarFrame = this.BEVEL ? RGB(180, 180, 180) : grCol.bg;
		grCol.progressBarFill = this.BEVEL ? ShadeColor(grCol.primary, 5) : grCol.primary;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness < 75 ? TintColor(grCol.primary, 40) : ShadeColor(grCol.primary, 40);
		grCol.peakmeterBarFillTop       = TintColor(grCol.primary,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(grCol.primary,  30);
		grCol.peakmeterBarFillBack      = TintColor(grCol.primary,  50);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = ShadeColor(grCol.primary, 10);
		grCol.peakmeterBarVertFillPeaks = TintColor(grCol.primary,  20);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.primary;
		grCol.waveformBarFillBack     = ShadeColor(grCol.primary, 20);
		grCol.waveformBarFillPreFront = this.BEVEL || this.BLEND ? RGB(140, 140, 140) : RGB(180, 180, 180);
		grCol.waveformBarFillPreBack  = this.BEVEL || this.BLEND ? RGB(120, 120, 120) : RGB(160, 160, 160);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 ? RGB(0, 0, 0) : TintColor(grCol.primary, 30);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(255, 255, 255);
		grCol.volumeBarFrame = RGB(220, 220, 220);
		grCol.volumeBarFill = grCol.primary;

		// * STYLE COLORS * //
		grCol.styleBevel = this.BEVEL && this.BW2 ? RGB(0, 0, 0) : RGB(40, 40, 40);
		grCol.styleGradient = '';
		grCol.styleGradient2 = '';

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? RGBA(0, 0, 0, 40) :
														   this.BEVEL ? RGBA(255, 255, 255, 20) : RGBA(0, 0, 0, 0) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, this.ALT || this.ALT2 ? 30 : 50) : RGBA(0, 0, 0, 50) :
														   this.BEVEL ? RGBA(0, 0, 0, this.ALT || this.ALT2 ? 15 : 20) : RGBA(0, 0, 0, this.ALT || this.ALT2 ? 10 : 20) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? this.BLEND12 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 160) : this.BLEND12 ? RGBA(255, 255, 255, 140) : RGBA(255, 255, 255, 255) :
														   this.BEVEL ? this.BLEND12 ? RGBA(255, 255, 255, 80)  : RGBA(255, 255, 255, 100) : this.BLEND12 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 220) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? this.BLEND12 ? RGBA(255, 255, 255, 100) : RGBA(255, 255, 255, 140) : this.BLEND12 ? RGBA(255, 255, 255, 140) : RGBA(255, 255, 255, 255) :
														   this.BEVEL ? this.BLEND12 ? RGBA(255, 255, 255, 80)  : RGBA(255, 255, 255, 140) : this.BLEND12 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 70) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? RGBA(0, 0, 0, 30) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 70) : '';
	}
	// #endregion

	// * PUBLIC METHODS - BLACK THEME * //
	// #region PUBLIC METHODS - BLACK THEME
	/**
	 * The Playlist colors for Black theme used in Options > Theme > Black.
	 */
	playlistColorsBlackTheme() {
		// * MAIN COLORS * //
		pl.col.bg = RGB(20, 20, 20);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(180, 180, 180);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(200, 200, 200) : RGB(240, 240, 240);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(240, 240, 240) : RGB(180, 180, 180);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = grCol.colBrightness < 25 ? grCol.lightAccent : grCol.primary;
		pl.col.header_sideMarker = pl.col.header_nowplaying_bg;
		pl.col.header_artist_normal = RGB(220, 220, 220);
		pl.col.header_artist_playing = grm.ui.noAlbumArtStub && this.BLEND12 ? RGB(20, 20, 20) : RGB(255, 255, 255);
		pl.col.header_album_normal = RGB(200, 200, 200);
		pl.col.header_album_playing = grm.ui.noAlbumArtStub && this.BLEND12 ? RGB(20, 20, 20) : RGB(245, 245, 245);
		pl.col.header_info_normal = RGB(200, 200, 200);
		pl.col.header_info_playing = grm.ui.noAlbumArtStub && this.BLEND12 ? RGB(20, 20, 20) : RGB(245, 245, 245);
		pl.col.header_date_normal = RGB(220, 220, 220);
		pl.col.header_date_playing = grm.ui.noAlbumArtStub && this.BLEND12 ? RGB(20, 20, 20) : RGB(245, 245, 245);
		pl.col.header_line_normal = this.BLEND ? RGB(65, 65, 65) : RGB(45, 45, 45);
		pl.col.header_line_playing =  RGB(25, 25, 25);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(25, 25, 25, 130) : this.ALT2 ? RGB(35, 35, 35) : RGB(25, 25, 25);
		pl.col.row_selection_bg = this.BLEND ? RGB(65, 65, 65) : RGB(45, 45, 45);
		pl.col.row_selection_frame = pl.col.row_selection_bg;
		pl.col.row_sideMarker = grCol.colBrightness < 25 ? grCol.lightAccent_35 : grCol.primary;
		pl.col.row_title_normal = RGB(200, 200, 200);
		pl.col.row_title_playing = grm.ui.noAlbumArtStub && this.BLEND12 ? RGB(20, 20, 20) : RGB(245, 245, 245);
		pl.col.row_title_selected = RGB(255, 255, 255);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = this.BLEND ? RGB(65, 65, 65) : RGB(45, 45, 45);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = RGB(100, 100, 100);
		pl.col.sbar_btn_hovered = RGB(160, 160, 160);
		pl.col.sbar_thumb_normal = RGB(100, 100, 100);
		pl.col.sbar_thumb_hovered = RGB(160, 160, 160);
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for Black theme used in Options > Theme > Black.
	 */
	libraryColorsBlackTheme() {
		// * MAIN COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = RGB(220, 220, 220);
		lib.ui.col.iconPlus_h = RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = RGB(255, 255, 255);
		lib.ui.col.iconPlusBg = RGB(45, 45, 45);
		lib.ui.col.iconMinus_e = RGB(220, 220, 220);
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text = RGB(200, 200, 200);
		lib.ui.col.text_h =
			this.BR && libSet.albumArtShow && grCol.lightBg ?
			libSet.highLightRow === 2 ? RGB(0, 0, 0) : RGB(255, 255, 255) :
			RGB(255, 255, 255);

		lib.ui.col.text_nowp =
			grCol.lightBg ? libSet.albumArtShow && libImg.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0) :
			RGB(255, 255, 255);

		lib.ui.col.textSel =
			libSet.albumArtShow ?
				grCol.lightBg ? libImg.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0) : RGB(255, 255, 255) :
			RGB(255, 255, 255);

		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(200, 200, 200);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(200, 200, 200);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = RGB(255, 255, 255);
		lib.ui.col.crossBtn = RGB(255, 255, 255);
		lib.ui.col.filterBtn = RGB(220, 220, 220);
		lib.ui.col.settingsBtn = RGB(220, 220, 220);
		lib.ui.col.line = this.BLEND ? RGB(60, 60, 60) : RGB(45, 45, 45);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = RGB(100, 100, 100);
		lib.ui.col.sbarNormal = RGB(226, 226, 226);
		lib.ui.col.sbarHovered = RGB(160, 160, 160);
		lib.ui.col.sbarDrag = RGB(160, 160, 160);
	}

	/**
	 * The Biography colors for Black theme used in Options > Theme > Black.
	 */
	biographyColorsBlackTheme() {
		// * MAIN COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText =
			bio.ui.blur.blend ? pl.col.header_artist_playing :
			bio.ui.blur.light ? RGB(65, 65, 65) :
			pl.col.header_artist_playing;

		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = grCol.lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = RGB(220, 160, 40);
		bio.ui.col.noPhotoStubBg = RGB(25, 25, 25);
		bio.ui.col.noPhotoStubText = pl.col.header_artist_playing;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = RGB(100, 100, 100);
		bio.ui.col.sbarNormal = RGB(226, 226, 226);
		bio.ui.col.sbarHovered = RGB(160, 160, 160);
		bio.ui.col.sbarDrag = RGB(160, 160, 160);
	}

	/**
	 * The Main colors for Black theme used in Options > Theme > Black.
	 */
	mainColorsBlackTheme() {
		// * MAIN COLORS * //
		grCol.bg = this.BEVEL ? RGB(40, 40, 40) : RGB(25, 25, 25);
		grCol.loadingThemeBg = RGB(25, 25, 25);
		grCol.uiHacksFrame = this.BR && fb.IsPlaying && !grm.ui.isStreaming && !grm.ui.isPlayingCD ? grCol.primary : RGB(35, 35, 35);
		grCol.shadow =
			this.BEVEL && (this.THEME !== 'black' && !this.BR) ? RGBA(0, 0, 0, 240) :
			this.ALT ? RGBA(0, 0, 0, 100) :
			this.ALT2 ? RGBA(0, 0, 0, 240) :
			RGBA(0, 0, 0, 120);
		grCol.discArtShadow = this.BR ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 40);
		grCol.noAlbumArtStub = grm.ui.isStreaming ? RGB(240, 240, 240) : RGB(175, 205, 225);
		grCol.lowerBarArtist = RGB(240, 240, 240);
		grCol.lowerBarTitle = this.BLEND12 ? RGB(220, 220, 220) : RGB(200, 200, 200);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = grSet.lyricsBgImg ? RGB(255, 240, 150) : RGB(220, 160, 40);
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = grCol.primary !== RGB(25, 160, 240) && grm.ui.albumArt && !grm.ui.isStreaming ? grCol.primary : RGB(20, 20, 20);
		grCol.detailsText = grm.ui.isStreaming || grm.ui.isPlayingCD || !grm.ui.albumArt ? RGB(255, 255, 255) : grCol.lightBg ? grCol.darkAccent_75 : !grm.ui.albumArt ? RGB(120, 120, 120) : grCol.lightAccent_100;
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 50 : 40) : grCol.lightAccent_50;
		grCol.timelinePlayed = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 35 : 25) : grCol.lightAccent_35;
		grCol.timelineUnplayed = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 20 : 10) : grCol.lightAccent;
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = grCol.lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? this.BEVEL ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			this.TMB === 'inner'  ? this.BEVEL ? RGB(55, 55, 55) : RGB(50, 50, 50) :
			this.TMB === 'emboss' ? RGB(45, 45, 45) :
			RGB(35, 35, 35);

		grCol.menuStyleBg =
			this.TMB === 'inner'  ? RGB(20, 20, 20) :
			this.TMB === 'emboss' ? this.BEVEL ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			this.BEVEL ? RGB(30, 30, 30) : RGB(20, 20, 20);

		grCol.menuRectStyleEmbossTop = this.BEVEL ? RGB(60, 60, 60) : RGB(70, 70, 70);
		grCol.menuRectStyleEmbossBottom = RGB(0, 0, 0);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGBA(60, 60, 60, 100) :
			this.TMB === 'bevel'  ? RGB(0, 0, 0) :
			RGB(60, 60, 60);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(120, 120, 120, 100) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(0, 0, 0) :
			RGB(120, 120, 120);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = this.BLEND12 ? RGB(200, 200, 200) : RGB(180, 180, 180);
		grCol.menuTextHovered = RGB(255, 255, 255);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg =
			this.BLEND12 && fb.IsPlaying ?
			this.PB === 'bevel' ? RGB(36, 36, 36) :
			this.PB === 'inner' ? RGB(37, 37, 37) :
			RGB(35, 35, 35) : RGB(35, 35, 35);
		grCol.transportEllipseNormal = RGB(60, 60, 60);
		grCol.transportEllipseHovered = RGB(120, 120, 120);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(20, 20, 20) :
			this.TPB === 'emboss' ? RGB(50, 50, 50) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(50, 50, 50) :
			this.TPB === 'emboss' ? this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(10, 10, 10) :
			this.TPB === 'emboss' ? RGB(20, 20, 20) : '';

		grCol.transportIconNormal = RGB(160, 160, 160);
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar =
			this.PB === 'bevel' ? RGB(36, 36, 36) :
			this.PB === 'inner' ? RGB(37, 37, 37) :
			RGB(35, 35, 35);

		grCol.progressBarStreaming = RGB(207, 0, 5);
		grCol.progressBarFrame = this.BEVEL ? RGB(0, 0, 0) : grCol.bg;
		grCol.progressBarFill = grCol.colBrightness < 25 ? TintColor(grCol.primary, 25) : grCol.colBrightness < 50 ? grCol.lightAccent_7 : grCol.primary;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 40) : grCol.colBrightness < 50 ? TintColor(grCol.primary, 50) : TintColor(grCol.primary, 40);
		grCol.peakmeterBarFillTop       = grCol.colBrightness <  50 ? TintColor(grCol.primary,  20) : TintColor(grCol.primary,  10);
		grCol.peakmeterBarFillMiddle    = grCol.colBrightness <  50 ? TintColor(grCol.primary,  40) : TintColor(grCol.primary,  30);
		grCol.peakmeterBarFillBack      = grCol.colBrightness <  50 ? TintColor(grCol.primary,  30) : ShadeColor(grCol.primary, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = grCol.colBrightness <  50 ? TintColor(grCol.primary,  20) : ShadeColor(grCol.primary, 10);
		grCol.peakmeterBarVertFillPeaks = grCol.colBrightness <  50 ? TintColor(grCol.primary,  30) : TintColor(grCol.primary,  20);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.colBrightness < 50 ? TintColor(grCol.primary, 40) : grCol.colBrightness < 100 ? TintColor(grCol.primary, 20) : grCol.primary;
		grCol.waveformBarFillBack     = grCol.colBrightness < 50 ? TintColor(grCol.primary, 20) : grCol.colBrightness < 100 ? grCol.primary : ShadeColor(grCol.primary, 20);
		grCol.waveformBarFillPreFront = RGB(100, 100, 100);
		grCol.waveformBarFillPreBack  = RGB(80, 80, 80);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 ? RGB(255, 255, 255) : RGB(220, 220, 220);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(35, 35, 35);
		grCol.volumeBarFrame = RGB(60, 60, 60);
		grCol.volumeBarFill = grCol.progressBarFill;

		// * STYLE COLORS * //
		grCol.styleBevel = RGB(0, 0, 0);
		grCol.styleGradient = '';
		grCol.styleGradient2 = '';
		grCol.styleAlternative = this.BEVEL ? RGB(40, 40, 40) : RGB(25, 25, 25);

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			this.PB === 'inner' ? RGBA(0, 0, 0, 100) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? RGBA(0, 0, 0, 255) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
														   this.BEVEL ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 50) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? RGBA(255, 255, 255, 25) :
														   this.BEVEL ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 20) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 20) : RGBA(255, 255, 255, 10) :
														   this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 15) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 100) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 100) : '';
	}
	// #endregion

	// * PUBLIC METHODS - REBORN/RANDOM THEME * //
	// #region PUBLIC METHODS - REBORN/RANDOM THEME
	/**
	 * The Playlist colors for Reborn/Random theme used in Options > Theme > Reborn/Random.
	 */
	playlistColorsRebornRandomTheme() {
		// * MAIN COLORS * //
		pl.col.bg =
			// * Need this extra condition to overwrite col.primary when switching themes, no album art loaded i.e on startup and going back to Reborn/Random theme.
			// * Reborn/Random theme should stay default white and not the defined col.primary dark gray
			!fb.IsPlaying && !grSet.panelBrowseMode || !grm.ui.albumArt || grCol.primary === RGB(90, 90, 90) || grCol.primary === RGB(25, 160, 240) ? RGB(255, 255, 255) :
			this.LAYOUT !== 'default' ? grCol.lightAccent_2 : grCol.primary;
		// * Assigned after background has been initialized
		grCol.isColored = pl.col.bg !== RGB(255, 255, 255);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(140, 140, 140);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(120, 120, 120) : RGB(80, 80, 80);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(80, 80, 80) : RGB(140, 140, 140);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg =
			this.THEME === 'reborn' ?
				grCol.isColored ?
					this.BLEND ? RGBtoRGBA(grCol.lightAccent_10, 130) :
					grCol.lightAccent_10 :
				grCol.primary :
			this.THEME === 'random' ?
				grCol.isColored ?
					this.BLEND ? RGBtoRGBA(grCol.lightAccent_10, 130) :
					grCol.lightBg ? ShadeColor(grCol.primary, 5) :
					grCol.lightAccent_10 :
				grCol.primary :
			'';

		pl.col.header_sideMarker = grCol.isColored ? grCol.lightAccent_50 : grCol.primary;
		pl.col.header_artist_normal = RGB(120, 120, 120);
		pl.col.header_artist_playing = RGB(120, 120, 120);
		pl.col.header_album_normal = RGB(120, 120, 120);
		pl.col.header_album_playing = RGB(120, 120, 120);
		pl.col.header_info_normal = RGB(120, 120, 120);
		pl.col.header_info_playing = pl.col.header_info_normal;
		pl.col.header_date_normal = RGB(120, 120, 120);
		pl.col.header_date_playing = pl.col.header_date_normal;
		pl.col.header_line_normal = grCol.isColored ? this.BLEND ? ShadeColor(grCol.primary, 24) : grCol.accent : RGB(200, 200, 200);
		pl.col.header_line_playing = grCol.isColored ? this.BLEND ? ShadeColor(grCol.primary, 24) : grCol.accent : RGB(200, 200, 200);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = grCol.isColored ? this.BLEND ? RGBtoRGBA(grCol.lightAccent_10, 130) : TintColor(grCol.primary, this.ALT2 ? 0 : 5) : RGB(245, 245, 245);
		pl.col.row_selection_bg = grCol.isColored ? this.BLEND ? ShadeColor(grCol.primary, 24) : grCol.accent : RGB(200, 200, 200);
		pl.col.row_selection_frame = pl.col.row_selection_bg;
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(100, 100, 100);
		pl.col.row_title_playing = grm.ui.noAlbumArtStub && this.ALT2 ? RGB(20, 20, 20) : RGB(245, 245, 245);
		pl.col.row_title_selected = RGB(0, 0, 0);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = grCol.isColored ? this.BLEND ? ShadeColor(grCol.primary, 24) : grCol.accent : RGB(200, 200, 200);
		pl.col.row_drag_line = pl.col.row_sideMarker;
		pl.col.row_drag_line_reached = grCol.colBrightness > 210 ? ShadeColor(pl.col.row_sideMarker, 25) : TintColor(pl.col.row_sideMarker, 50);

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = RGB(120, 120, 120);
		pl.col.sbar_btn_hovered = RGB(0, 0, 0);
		pl.col.sbar_thumb_normal = RGB(200, 200, 200);
		pl.col.sbar_thumb_hovered = RGB(120, 120, 120);
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;

		// * WHEN PLAYING * //
		if (grCol.isColored) {
			if (this.GRAD12 || this.RF12 ? grCol.lightBgPlaylist : grCol.lightBg) {
				// * PLAYLIST MANAGER COLORS * //
				pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : grCol.darkAccent_75;
				pl.col.plman_text_hovered = grCol.darkAccent_100;
				pl.col.plman_text_pressed = grCol.darkAccent_100;

				// * HEADER COLORS * //
				pl.col.header_artist_normal = grCol.darkAccent_75;
				pl.col.header_artist_playing = grCol.darkAccent_75;
				pl.col.header_album_normal = grCol.darkAccent_75;
				pl.col.header_album_playing = grCol.darkAccent_75;
				pl.col.header_info_normal = grCol.darkAccent_75;
				pl.col.header_info_playing = grCol.darkAccent_75;
				pl.col.header_date_normal = grCol.darkAccent_75;
				pl.col.header_date_playing = grCol.darkAccent_75;

				// * ROW COLORS * //
				pl.col.row_title_normal = grCol.darkAccent_65;
				pl.col.row_title_playing = grCol.darkAccent_100;
				pl.col.row_title_selected = grCol.darkAccent_100;
				pl.col.row_title_hovered = grCol.darkAccent_100;

				// * SCROLLBAR COLORS * //
				pl.col.sbar_btn_normal = grCol.darkAccent_75;
				pl.col.sbar_btn_hovered = grCol.darkAccent_100;
				pl.col.sbar_thumb_normal = grCol.darkAccent;
				pl.col.sbar_thumb_hovered = this.BLEND ? grCol.lightAccent_80 : grCol.lightAccent_50;
				pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
			}
			else {
				// * PLAYLIST MANAGER COLORS * //
				pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : grCol.lightAccent_80;
				pl.col.plman_text_hovered = grCol.lightAccent_100;
				pl.col.plman_text_pressed = grCol.lightAccent_100;

				// * HEADER COLORS * //
				pl.col.header_artist_normal = grCol.lightAccent_80;
				pl.col.header_artist_playing = grCol.lightAccent_100;
				pl.col.header_album_normal = grCol.lightAccent_80;
				pl.col.header_album_playing = grCol.lightAccent_100;
				pl.col.header_info_normal = grCol.lightAccent_80;
				pl.col.header_info_playing = grCol.lightAccent_100;
				pl.col.header_date_normal = grCol.lightAccent_80;
				pl.col.header_date_playing = grCol.lightAccent_100;

				// * ROW COLORS * //
				pl.col.row_title_normal = grCol.lightAccent_80;
				pl.col.row_title_playing = grCol.lightAccent_100;
				pl.col.row_title_selected = grCol.lightAccent_100;
				pl.col.row_title_hovered = grCol.lightAccent_100;

				// * SCROLLBAR COLORS * //
				pl.col.sbar_btn_normal = grCol.lightAccent_80;
				pl.col.sbar_btn_hovered = grCol.lightAccent_100;
				pl.col.sbar_thumb_normal = grCol.lightAccent_35;
				pl.col.sbar_thumb_hovered =  this.BLEND ? grCol.lightAccent_80 : grCol.lightAccent_50;
				pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
			}
		}
	}

	/**
	 * The Library colors for Reborn/Random theme used in Options > Theme > Reborn/Random.
	 */
	libraryColorsRebornRandomTheme() {
		// * MAIN COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = libSet.albumArtShow ? TintColor(pl.col.row_nowplaying_bg, 7) : pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = RGB(120, 120, 120);
		lib.ui.col.iconPlus_h = RGB(0, 0, 0);
		lib.ui.col.iconPlus_sel = !grCol.isColored && !libSet.albumArtShow && !lib.pop.highlight.nowPlaying ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.iconPlusBg = RGB(240, 240, 240);
		lib.ui.col.iconMinus_e = RGB(120, 120, 120);
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(0, 0, 0);

		// * TEXT COLORS * //
		lib.ui.col.text = grm.ui.noAlbumArtStub && libSet.albumArtShow && libImg.labels.overlayDark ? RGB(220, 220, 220) : RGB(100, 100, 100);
		lib.ui.col.text_h = grm.ui.noAlbumArtStub && libSet.albumArtShow && libImg.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.text_nowp = grm.ui.noAlbumArtStub && libSet.albumArtShow && libImg.labels.overlayDark || grm.ui.noAlbumArtStub && this.ALT2 ? RGB(0, 0, 0) : RGB(255, 255, 255);

		lib.ui.col.textSel =
			!['facet', 'coversLabelsRight', 'coversLabelsBottom', 'artistLabelsRight'].includes(grSet.libraryDesign) || ![2, 1].includes(libSet.albumArtLabelType) ||
			(['facet', 'coversLabelsRight', 'coversLabelsBottom', 'artistLabelsRight'].includes(grSet.libraryDesign) ||  [2, 1].includes(libSet.albumArtLabelType)) && !lib.pop.highlight.nowPlaying ?
				!grCol.isColored && !grm.ui.noAlbumArtStub && !libSet.albumArtShow && lib.pop.highlight.nowPlaying || grm.ui.noAlbumArtStub && !libSet.albumArtShow || grm.ui.noAlbumArtStub && libSet.albumArtShow && libImg.labels.overlayDark || grm.ui.noAlbumArtStub && this.ALT2 ?
				RGB(0, 0, 0) : RGB(255, 255, 255) :
			lib.ui.col.text_h;

		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(80, 80, 80);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(100, 100, 100);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = RGB(0, 0, 0);
		lib.ui.col.crossBtn = RGB(80, 80, 80);
		lib.ui.col.filterBtn = RGB(120, 120, 120);
		lib.ui.col.settingsBtn = RGB(120, 120, 120);
		lib.ui.col.line = grCol.isColored ? this.BLEND ? ShadeColor(grCol.primary, 24) : grCol.accent : RGB(200, 200, 200);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = grCol.isColored ? lib.ui.col.text : RGB(120, 120, 120);
		lib.ui.col.sbarNormal = RGB(200, 200, 200);
		lib.ui.col.sbarHovered = RGB(120, 120, 120);
		lib.ui.col.sbarDrag = RGB(120, 120, 120);

		// * WHEN PLAYING * //
		if (grCol.isColored) {
			if (this.GRAD12 || this.RF12 ? grCol.lightBgLibrary : grCol.lightBg) {
				// * NODE COLORS * //
				lib.ui.col.iconPlus = grCol.darkAccent_75;
				lib.ui.col.iconPlus_h = grCol.darkAccent_100;
				lib.ui.col.iconPlus_sel = grCol.darkAccent_100;
				lib.ui.col.iconPlusBg = grCol.lightAccent_7;
				lib.ui.col.iconMinus_e = grCol.darkAccent_75;
				lib.ui.col.iconMinus_h = grCol.darkAccent_100;

				// * TEXT COLORS * //
				lib.ui.col.text = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(220, 220, 220) : libSet.albumArtShow ? grCol.darkAccent_75 : grCol.darkAccent_65;
				lib.ui.col.text_h = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(255, 255, 255) : grCol.darkAccent_100;
				lib.ui.col.text_nowp = grCol.darkAccent_100;
				lib.ui.col.textSel = grCol.darkAccent_100;
				lib.ui.col.txt_box = grCol.darkAccent_75;
				lib.ui.col.search = grCol.darkAccent_75;

				// * BUTTON COLORS * //
				lib.ui.col.searchBtn = grCol.darkAccent_75;
				lib.ui.col.crossBtn = grCol.darkAccent_75;
				lib.ui.col.filterBtn = grCol.darkAccent_75;
				lib.ui.col.settingsBtn = grCol.darkAccent_75;
				lib.ui.col.line = grCol.accent;

				// * SCROLLBAR COLORS * //
				lib.ui.col.sbarBtns = lib.ui.col.text;
				lib.ui.col.sbarNormal = grCol.darkAccent;
				lib.ui.col.sbarHovered = grCol.lightAccent_50;
				lib.ui.col.sbarDrag = grCol.lightAccent_50;
			}
			else {
				// * NODE COLORS * //
				lib.ui.col.iconPlus = grCol.lightAccent_80;
				lib.ui.col.iconPlus_h = grCol.lightAccent_100;
				lib.ui.col.iconPlus_sel = grCol.lightAccent_100;
				lib.ui.col.iconPlusBg = grCol.lightAccent_7;
				lib.ui.col.iconMinus_e = grCol.lightAccent_80;
				lib.ui.col.iconMinus_h = grCol.lightAccent_100;

				// * TEXT COLORS * //
				lib.ui.col.text = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(220, 220, 220) : grCol.lightAccent_80;
				lib.ui.col.text_h = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(255, 255, 255) : grCol.lightAccent_100;
				lib.ui.col.text_nowp = grCol.lightAccent_100;
				lib.ui.col.textSel = grCol.lightAccent_100;
				lib.ui.col.txt_box = grCol.lightAccent_80;
				lib.ui.col.search = grCol.lightAccent_80;

				// * BUTTON COLORS * //
				lib.ui.col.searchBtn = grCol.lightAccent_80;
				lib.ui.col.crossBtn = grCol.lightAccent_80;
				lib.ui.col.filterBtn = grCol.lightAccent_80;
				lib.ui.col.settingsBtn = grCol.lightAccent_80;
				lib.ui.col.line = grCol.accent;

				// * SCROLLBAR COLORS * //
				lib.ui.col.sbarBtns = lib.ui.col.text;
				lib.ui.col.sbarNormal = grCol.lightAccent;
				lib.ui.col.sbarHovered = grCol.lightAccent_50;
				lib.ui.col.sbarDrag = grCol.lightAccent_50;
			}
		}
	}

	/**
	 * The Biography colors for Reborn/Random theme used in Options > Theme > Reborn/Random.
	 */
	biographyColorsRebornRandomTheme() {
		// * MAIN COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText = pl.col.header_artist_playing;
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = (grCol.lightBgBiography || grCol.lightBg) && !grm.ui.noAlbumArtStub ? grCol.darkAccent_75 : grCol.lightAccent_100;

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = (grCol.lightBgBiography || grCol.lightBg) && ColorDistance(RGB(255, 240, 150), bio.ui.col.bg, true) < 200 ? RGB(220, 160, 40) : RGB(255, 240, 150);
		bio.ui.col.noPhotoStubBg = grCol.isColored ? grCol.lightAccent_7 : RGB(245, 245, 245);
		bio.ui.col.noPhotoStubText = pl.col.header_artist_playing;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = grCol.isColored ? bio.ui.col.text : RGB(120, 120, 120);
		bio.ui.col.sbarNormal = RGB(200, 200, 200);
		bio.ui.col.sbarHovered = RGB(120, 120, 120);
		bio.ui.col.sbarDrag = RGB(120, 120, 120);

		// * WHEN PLAYING * //
		if (grCol.isColored) {
			if (this.GRAD12 || this.RF12 ? grCol.lightBgBiography : grCol.lightBg) {
				// * HEADER COLORS * //
				bio.ui.col.headingText = grCol.darkAccent_75;
				bio.ui.col.source = grCol.darkAccent_75;
				bio.ui.col.bottomLine = grCol.darkAccent;
				bio.ui.col.centerLine = grCol.darkAccent;

				// * TEXT COLORS * //
				bio.ui.col.text = grCol.darkAccent_75;

				// * SCROLLBAR COLORS * //
				bio.ui.col.sbarBtns =
					grCol.isColored && !bio.ui.blur.dark && !bio.ui.blur.blend && !bio.ui.blur.light ? grCol.darkAccent_100 :
					bio.ui.blur.light ? grCol.darkAccent_100 :
					bio.ui.blur.dark ? grCol.lightAccent_100 :
					RGB(20, 20, 20);

				bio.ui.col.sbarBtns = bio.ui.col.text;
				bio.ui.col.sbarNormal = grCol.darkAccent;
				bio.ui.col.sbarHovered = grCol.lightAccent_50;
				bio.ui.col.sbarDrag = grCol.lightAccent_50;
			}
			else {
				// * HEADER COLORS * //
				bio.ui.col.headingText = bio.ui.blur.light ? grCol.darkAccent_75 : grCol.lightAccent_80;
				bio.ui.col.source = bio.ui.blur.light ? grCol.darkAccent_75 : grCol.lightAccent_80;
				bio.ui.col.bottomLine = grCol.darkAccent;
				bio.ui.col.centerLine = grCol.darkAccent;

				// * TEXT COLORS * //
				bio.ui.col.text = bio.ui.blur.light ? grCol.darkAccent_75 : grCol.lightAccent_80;

				// * SCROLLBAR COLORS * //
				bio.ui.col.sbarBtns =
					grCol.isColored && !bio.ui.blur.dark && !bio.ui.blur.blend && !bio.ui.blur.light ? grCol.lightAccent_100 :
					bio.ui.blur.dark ? grCol.lightAccent_100 :
					bio.ui.blur.light ? grCol.darkAccent_100 :
					RGB(220, 220, 220);

				bio.ui.col.sbarBtns = bio.ui.col.text;
				bio.ui.col.sbarNormal = grCol.lightAccent;
				bio.ui.col.sbarHovered = grCol.lightAccent_50;
				bio.ui.col.sbarDrag = grCol.lightAccent_50;
			}
		}
	}

	/**
	 * The Main colors for Reborn/Random theme used in Options > Theme > Reborn/Random.
	 */
	mainColorsRebornRandomTheme() {
		// * MAIN COLORS * //
		grCol.bg = grCol.isColored ? grCol.primary : RGB(245, 245, 245);
		grCol.loadingThemeBg = this.NIGHTTIME || this.RB ? RGB(25, 25, 25) : RGB(245, 245, 245);
		grCol.uiHacksFrame =
			this.RW ? RGB(245, 245, 245) :
			this.RB ? RGB(25, 25, 25) :
			grCol.isColored ? grCol.primary : RGB(245, 245, 245);
		grCol.shadow =
			this.RB ? RGBA(0, 0, 0, 255) :
			grm.ui.isStreaming || grm.ui.isPlayingCD || grm.ui.noAlbumArtStub || !grm.ui.albumArt ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 35);
		grCol.discArtShadow = RGBA(0, 0, 0, 30);
		grCol.noAlbumArtStub = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(120, 120, 120);
		grCol.lowerBarArtist = RGB(120, 120, 120);
		grCol.lowerBarTitle = RGB(120, 120, 120);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = (grCol.lightBgMain || grCol.lightBg) && ColorDistance(RGB(255, 240, 150), grCol.bg, true) < 200 ? RGB(220, 160, 40) : RGB(255, 240, 150);
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = grCol.primary !== RGB(25, 160, 240) && grm.ui.albumArt && !grm.ui.isStreaming ? this.RF2 ? grCol.primary_alt : grCol.primary : RGB(255, 255, 255);
		grCol.detailsText =
			grm.ui.isStreaming || grm.ui.isPlayingCD || !grm.ui.albumArt ? RGB(120, 120, 120) :
			grCol.lightBg || grCol.lightBgDetails ? RGB(55, 55, 55) :
			RGB(255, 255, 255);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 50 : 40) : grCol.lightAccent_50;
		grCol.timelinePlayed = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 35 : 25) : grCol.lightAccent_35;
		grCol.timelineUnplayed = grm.ui.isStreaming ? RGB(207, 0, 5) : grCol.lightBg ? ShadeColor(grCol.primary, this.BLEND ? 20 : 10) : grCol.lightAccent;
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = (grCol.lightBgBiography || grCol.lightBg) && !grm.ui.noAlbumArtStub ? grCol.darkAccent_75 : grCol.lightAccent_100;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			grCol.isColored ?
				this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(255, 255, 255) :
				this.TMB === 'emboss' ? this.BEVEL ? RGB(250, 250, 250) : RGB(255, 255, 255) :
				grCol.lightAccent :
			RGB(255, 255, 255);

		grCol.menuStyleBg =
			this.TMB === 'bevel' || this.TMB === 'inner' ?
					this.RW ? this.BEVEL ? RGB(205, 205, 205) : RGB(220, 220, 220) :
					this.RB ? RGB(20, 20, 20) :
				grCol.isColored ?
					this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 70) : RGBtoRGBA(grCol.darkAccent_75, 80) :
				this.BEVEL ? RGB(205, 205, 205) : RGB(220, 220, 220) :
			this.TMB === 'emboss' ?
					this.RW ? this.BEVEL ? RGB(235, 235, 235) : RGB(225, 225, 225) :
					this.RB ? this.BEVEL ? RGB(45, 45, 45) : RGB(50, 50, 50) :
				grCol.isColored ?
					this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 30) : RGBtoRGBA(grCol.darkAccent_75, 40) :
				this.BEVEL ? RGB(235, 235, 235) : RGB(225, 225, 225) :
			RGB(255, 255, 255);

		grCol.menuRectStyleEmbossTop =
			grCol.isColored ?
				this.RW ? RGB(255, 255, 255) :
				this.RB ? this.BEVEL ? RGB(60, 60, 60) : RGB(70, 70, 70) :
				grCol.lightAccent :
			RGB(255, 255, 255);

		grCol.menuRectStyleEmbossBottom =
			grCol.isColored ?
				this.RW ? this.BEVEL ? RGB(200, 200, 200) : RGB(210, 210, 210) :
				this.RB ? RGB(0, 0, 0) :
				grCol.darkAccent :
			this.BEVEL ? RGB(200, 200, 200) : RGB(210, 210, 210);

		grCol.menuRectNormal = RGB(140, 140, 140);
		grCol.menuRectHovered = RGB(200, 200, 200);
		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = RGB(120, 120, 120);
		grCol.menuTextHovered = RGB(80, 80, 80);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = grCol.isColored ? grCol.lightAccent_50 : RGB(255, 255, 255);
		grCol.transportEllipseNormal = grCol.isColored ? grCol.lightAccent_7 : RGB(220, 220, 220);
		grCol.transportEllipseHovered = RGB(200, 200, 200);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' ?
				grCol.isColored ?
					this.RW ? this.BEVEL ? RGB(215, 215, 215) : RGB(220, 220, 220) :
					this.RB ? RGB(20, 20, 20) :
					RGBtoRGBA(grCol.darkAccent_75, 100) :
				this.BEVEL ? RGB(215, 215, 215) : RGB(220, 220, 220) :
			this.TPB === 'inner' ?
				grCol.isColored ?
					this.RW ? this.BEVEL ? RGB(215, 215, 215) : RGB(220, 220, 220) :
					this.RB ? RGB(20, 20, 20) :
					RGBtoRGBA(grCol.darkAccent_75, 120) :
				RGB(225, 225, 225) :
			this.TPB === 'emboss' ?
				grCol.isColored ?
					this.RW ? RGB(225, 225, 225) :
					this.RB ? RGB(50, 50, 50) :
					RGBtoRGBA(grCol.darkAccent_75, 40) :
				RGB(225, 225, 225) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ?
				grCol.isColored ?
					this.RW ? RGB(255, 255, 255) :
					this.RB ? RGB(50, 50, 50) :
					this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 220) : RGBtoRGBA(grCol.lightAccent_80, 230) :
				RGB(255, 255, 255) :
			this.TPB === 'emboss' ?
				grCol.isColored ?
					this.RW ? RGB(255, 255, 255) :
					this.RB ? this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) :
					RGBtoRGBA(grCol.lightAccent_80, 100) : '' :
				RGB(255, 255, 255);

		grCol.transportStyleBottom =
			this.TPB === 'bevel' ?
				grCol.isColored ?
					this.RW ? this.BEVEL ? RGB(190, 190, 190) : RGB(220, 220, 220) :
					this.RB ? RGB(10, 10, 10) :
					this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 30) : RGBtoRGBA(grCol.darkAccent_75, 20) :
				this.BEVEL ? RGB(190, 190, 190) : RGB(220, 220, 220) :
			this.TPB === 'inner' ?
				grCol.isColored ?
					this.RW ? this.BEVEL ? RGB(190, 190, 190) : RGB(220, 220, 220) :
					this.RB ? RGB(10, 10, 10) :
					this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 30) : RGBtoRGBA(grCol.darkAccent_75, 40) :
				this.BEVEL ? RGB(190, 190, 190) : RGB(220, 220, 220) :
			this.TPB === 'emboss' ?
				grCol.isColored ?
					this.RW ? this.BEVEL ? RGB(210, 210, 210) : RGB(225, 225, 225) :
					this.RB ? RGB(20, 20, 20) :
					RGBtoRGBA(grCol.darkAccent_75, 60) :
				this.BEVEL ? RGB(210, 210, 210) : RGB(225, 225, 225) : '';

		grCol.transportIconNormal = RGB(120, 120, 120);
		grCol.transportIconHovered = RGB(80, 80, 80);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = grCol.isColored ? this.BEVEL ? ShadeColor(grCol.primary, 28) : grCol.accent : RGB(220, 220, 220);
		grCol.progressBarStreaming = RGB(207, 0, 5);
		grCol.progressBarFrame = grCol.bg;
		grCol.progressBarFill = grCol.isColored ? grCol.lightAccent_50 : grCol.primary;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness > 200 || grCol.colBrightness < 75 ? TintColor(grCol.primary,  100) : ShadeColor(grCol.primary, 100);
		grCol.peakmeterBarFillTop       = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 10) : TintColor(grCol.primary, 40);
		grCol.peakmeterBarFillMiddle    = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 20) : TintColor(grCol.primary, 60);
		grCol.peakmeterBarFillBack      = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 40) : TintColor(grCol.primary, 80);
		grCol.peakmeterBarVertProgFill  = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 50) : grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 50) : TintColor(grCol.primary, 40);
		grCol.peakmeterBarVertFillPeaks = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 20) : TintColor(grCol.primary, 60);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.colBrightness > 200 || grm.ui.noAlbumArtStub ? ShadeColor(grCol.primary, 80) : TintColor(grCol.primary, 90);
		grCol.waveformBarFillBack     = grCol.colBrightness > 200 || grm.ui.noAlbumArtStub ? ShadeColor(grCol.primary, 40) : TintColor(grCol.primary, 45);
		grCol.waveformBarFillPreFront = grCol.colBrightness > 150 ? ShadeColor(grCol.primary, this.BEVEL || this.BLEND ? 60 : 40) : TintColor(grCol.primary, 50);
		grCol.waveformBarFillPreBack  = grCol.colBrightness > 150 ? ShadeColor(grCol.primary, this.BEVEL || this.BLEND ? 10 : 20) : TintColor(grCol.primary, 25);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 || grm.ui.noAlbumArtStub ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = grCol.isColored ? grCol.lightAccent_50 : RGB(255, 255, 255);
		grCol.volumeBarFrame = grCol.isColored ? grCol.accent : RGB(220, 220, 220);
		grCol.volumeBarFill = grCol.isColored ? grCol.accent : grCol.primary;

		// * STYLE COLORS * //
		grCol.styleBevel = this.RW ? RGB(40, 40, 40) : this.RB ? RGB(0, 0, 0) : grCol.darkAccent_100;
		grCol.styleGradient = grCol.isColored ? grCol.darkAccent : '';
		grCol.styleGradient2 = grCol.isColored ? grCol.darkAccent : '';

		grCol.styleProgressBar =
			this.PB === 'bevel' ?
				this.RW ? this.BEVEL ? RGBA(0, 0, 0, 40)  : RGBA(0, 0, 0, 30) :
				this.RB ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
						  this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 50) : RGBtoRGBA(grCol.darkAccent_75, 40) :
			this.PB === 'inner' ?
				this.RW ? this.BEVEL ? RGBA(0, 0, 0, 25)  : RGBA(0, 0, 0, 40) :
				this.RB ? RGBA(0, 0, 0, 100) :
				this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 50) : RGBtoRGBA(grCol.darkAccent_75, 60) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.BEVEL ? ShadeColor(grCol.bg,  5) : TintColor(grCol.bg,  100) :
			this.PB === 'inner' ? this.BEVEL ? ShadeColor(grCol.bg, 10) : ShadeColor(grCol.bg,  25) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.BEVEL ? ShadeColor(grCol.bg, 10) : ShadeColor(grCol.bg,  25) :
			this.PB === 'inner' ? this.BEVEL ? TintColor(grCol.bg,  10) : TintColor(grCol.bg,  100) : '';

		grCol.styleProgressBarFill = grCol.isColored ? this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 80) : '' : grCol.primary;

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 50) : RGBtoRGBA(grCol.darkAccent_75, 40) :
			this.VB === 'inner' ? this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 50) : RGBtoRGBA(grCol.darkAccent_75, 60) : '';

		grCol.styleVolumeBarFill = grCol.isColored ? this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 80) : '' : grCol.primary;

		// * WHEN PLAYING * //
		if (grCol.isColored) {
			if (this.GRAD12 || this.RF12 ? grCol.lightBgMain : grCol.lightBg) {
				// * MAIN COLORS * //
				grCol.noAlbumArtStub = RGB(90, 90, 90);
				grCol.lowerBarArtist = grCol.darkAccent_75;
				grCol.lowerBarTitle = grCol.darkAccent_75;
				grCol.lowerBarTime = grCol.lowerBarTitle;
				grCol.lowerBarLength = grCol.lowerBarTitle;

				// * TOP MENU BUTTONS COLORS * //
				grCol.menuBgColor =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 40) : RGBtoRGBA(grCol.lightAccent_80, 50) :
					this.TMB !== 'default' ? grCol.lightAccent_10 : grCol.lightAccent_50;

				grCol.menuRectNormal =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 40) : RGBtoRGBA(grCol.lightAccent_80, 30) :
					grCol.darkAccent;

				grCol.menuRectHovered =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 40) : RGBtoRGBA(grCol.darkAccent_75, 30) :
					grCol.darkAccent;

				grCol.menuRectDown = grCol.menuRectHovered;
				grCol.menuTextNormal = grCol.darkAccent_75;
				grCol.menuTextHovered = grCol.darkAccent_100;
				grCol.menuTextDown = grCol.menuTextHovered;

				// * LOWER BAR TRANSPORT BUTTON COLORS * //
				grCol.transportIconNormal = this.TPB === 'emboss' || this.TPB === 'minimal' ? grCol.darkAccent_75 : grCol.darkAccent_65;
				grCol.transportIconHovered = grCol.darkAccent_100;
				grCol.transportIconDown = grCol.transportIconHovered;
				grCol.transportEllipseNormal = grCol.accent;
				grCol.transportEllipseHovered = grCol.darkAccent;
				grCol.transportEllipseDown = grCol.transportEllipseHovered;
			}
			else {
				// * MAIN * //
				grCol.noAlbumArtStub = RGB(90, 90, 90);
				grCol.lowerBarArtist = grCol.lightAccent_100;
				grCol.lowerBarTitle = grCol.lightAccent_100;
				grCol.lowerBarTime = grCol.lowerBarTitle;
				grCol.lowerBarLength = grCol.lowerBarTitle;

				// * TOP MENU BUTTON COLORS * //
				grCol.menuBgColor =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 40) : RGBtoRGBA(grCol.lightAccent_80, 50) :
					this.TMB !== 'default' ? grCol.lightAccent_10 : grCol.darkAccent_50;

				grCol.menuRectNormal =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 60) : RGBtoRGBA(grCol.darkAccent_75, 50) :
					grCol.lightAccent_50;

				grCol.menuRectHovered =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 60) : RGBtoRGBA(grCol.darkAccent_75, 50) :
					grCol.lightAccent_50;

				grCol.menuRectDown = grCol.menuRectHovered;
				grCol.menuTextNormal = grCol.lightAccent_80;
				grCol.menuTextHovered = grCol.lightAccent_100;
				grCol.menuTextDown = grCol.menuTextHovered;

				// * LOWER BAR TRANSPORT BUTTON COLORS * //
				grCol.transportIconNormal = this.TPB === 'emboss' ? grCol.darkAccent_75 : this.TPB === 'minimal' ? grCol.lightAccent_80 : grCol.darkAccent_75;
				grCol.transportIconHovered = grCol.darkAccent_100;
				grCol.transportIconDown = grCol.transportIconHovered;
				grCol.transportEllipseNormal = grCol.accent;
				grCol.transportEllipseHovered = grCol.darkAccent;
				grCol.transportEllipseDown = grCol.transportEllipseHovered;
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS - BLUE THEME * //
	// #region PUBLIC METHODS - BLUE THEME
	/**
	 * The Playlist colors for Blue theme used in Options > Theme > Blue.
	 */
	playlistColorsBlueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(242, 230, 170);
		pl.col.bg = RGB(10, 115, 200);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(220, 220, 220);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(230, 230, 230) : RGB(255, 255, 255);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(255, 255, 255) : RGB(220, 220, 220);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = RGB(10, 130, 220);
		pl.col.header_sideMarker = accentColor;
		pl.col.header_artist_normal = RGB(240, 240, 240);
		pl.col.header_artist_playing = accentColor;
		pl.col.header_album_normal = RGB(230, 230, 230);
		pl.col.header_album_playing = RGB(245, 245, 245);
		pl.col.header_info_normal = RGB(230, 230, 230);
		pl.col.header_info_playing = RGB(245, 245, 245);
		pl.col.header_date_normal = RGB(240, 240, 240);
		pl.col.header_date_playing = RGB(245, 245, 245);
		pl.col.header_line_normal = RGB(17, 100, 182);
		pl.col.header_line_playing = RGB(17, 100, 182);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(5, 110, 195, 130) : this.ALT ? RGB(20, 120, 205) : RGB(5, 110, 195);
		pl.col.row_selection_bg = RGB(10, 115, 200);
		pl.col.row_selection_frame = RGB(10, 135, 230);
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(230, 230, 230);
		pl.col.row_title_playing = RGB(255, 255, 255);
		pl.col.row_title_selected = RGB(255, 255, 255);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = RGB(17, 100, 182);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = RGB(220, 220, 220);
		pl.col.sbar_btn_hovered = RGB(255, 255, 255);
		pl.col.sbar_thumb_normal = RGB(10, 135, 225);
		pl.col.sbar_thumb_hovered = accentColor;
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for Blue theme used in Options > Theme > Blue.
	 */
	libraryColorsBlueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(242, 230, 170);
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = accentColor;
		lib.ui.col.iconPlus_h = RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = RGB(255, 255, 255);
		lib.ui.col.iconPlusBg = RGB(10, 130, 220);
		lib.ui.col.iconMinus_e = accentColor;
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text = RGB(230, 230, 230);
		lib.ui.col.text_h = RGB(255, 255, 255);
		lib.ui.col.text_nowp = accentColor;
		lib.ui.col.textSel = RGB(255, 255, 255);
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(230, 230, 230);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(230, 230, 230);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = accentColor;
		lib.ui.col.crossBtn = accentColor;
		lib.ui.col.filterBtn = RGB(230, 230, 230);
		lib.ui.col.settingsBtn = RGB(230, 230, 230);
		lib.ui.col.line = RGB(17, 100, 182);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = RGB(220, 220, 220);
		lib.ui.col.sbarNormal = RGB(10, 150, 255);
		lib.ui.col.sbarHovered = accentColor;
		lib.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Biography colors for Blue theme used in Options > Theme > Blue.
	 */
	biographyColorsBlueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(242, 230, 170);
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText = pl.col.header_artist_playing;
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = accentColor;

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = accentColor;
		bio.ui.col.noPhotoStubBg = RGB(10, 130, 220);
		bio.ui.col.noPhotoStubText = pl.col.header_artist_playing;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = RGB(220, 220, 220);
		bio.ui.col.sbarNormal = RGB(10, 150, 255);
		bio.ui.col.sbarHovered = accentColor;
		bio.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Main colors for Blue theme used in Options > Theme > Blue.
	 */
	mainColorsBlueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(242, 230, 170);
		grCol.bg = RGB(5, 110, 195);
		grCol.loadingThemeBg = RGB(5, 110, 195);
		grCol.uiHacksFrame = RGB(63, 155, 202);
		grCol.shadow = RGBA(0, 0, 0, 25);
		grCol.discArtShadow = RGBA(0, 0, 0, 30);
		grCol.noAlbumArtStub = accentColor;
		grCol.lowerBarArtist = accentColor;
		grCol.lowerBarTitle = RGB(245, 245, 245);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = accentColor;
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = RGB(10, 115, 200);
		grCol.detailsText = RGB(255, 255, 255);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = accentColor;
		grCol.timelinePlayed = RGB(195, 190, 130);
		grCol.timelineUnplayed = RGB(155, 150, 130);
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = accentColor;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? this.BEVEL && !this.GRAD2 ? RGB(10, 123, 209) : RGB(10, 130, 220) :
			this.TMB === 'inner'  ? this.BEVEL && !this.GRAD2 ? RGB(10, 130, 220) : this.GRAD2 ? RGB(10, 130, 220) : RGB(10, 135, 230) :
			this.TMB === 'emboss' ? this.BEVEL && !this.GRAD2 ? RGB(10, 123, 209) : RGB(10, 130, 220) :
			RGB(10, 130, 220);

		grCol.menuStyleBg = this.TMB === 'emboss' ? RGB(5, 110, 195) : this.BEVEL ? RGB(5, 90, 160) : RGB(5, 100, 175);
		grCol.menuRectStyleEmbossTop = RGB(10, 138, 228);
		grCol.menuRectStyleEmbossBottom = RGB(6, 95, 160);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGBA(76, 175, 255, 130) :
			this.TMB === 'bevel'  ? this.BEVEL ? RGB(5, 85, 150) : RGB(5, 100, 180) :
			RGB(76, 175, 255);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(76, 175, 255, 130) :
			this.TMB === 'bevel' || this.TMB === 'inner' ?
				this.BEVEL && !this.GRAD2 ? RGB(5, 85, 150) : this.GRAD2 ? RGB(4, 68, 120) : RGB(5, 100, 180) :
			RGB(76, 175, 255);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = RGB(230, 230, 230);
		grCol.menuTextHovered = RGB(255, 255, 255);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = RGB(10, 130, 220);
		grCol.transportEllipseNormal = RGB(22, 107, 186);
		grCol.transportEllipseHovered = RGB(76, 175, 255);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel'  ? this.GRAD2 ? RGB(5, 90, 160) : RGB(5, 100, 180) :
			this.TPB === 'inner'  ? this.GRAD2 ? RGB(10, 110, 190) : this.BEVEL && !this.GRAD2 ? RGB(5, 100, 180) : RGB(17, 100, 180) :
			this.TPB === 'emboss' ? this.GRAD2 ? RGB(8, 110, 190) : RGB(11, 132, 224) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(7, 135, 240) : RGB(7, 130, 230) :
			this.TPB === 'emboss' ? this.BEVEL && !this.GRAD2 ? RGB(12, 138, 235) : this.GRAD2 ? RGB(10, 115, 200) : RGB(12, 138, 235) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(5, 85, 150) : RGB(5, 100, 180) :
			this.TPB === 'emboss' ? this.BEVEL && !this.GRAD2 ? RGB(6, 95, 160) : this.GRAD2 ? RGB(4, 68, 120) : RGB(5, 100, 175) : '';

		grCol.transportIconNormal = accentColor;
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = RGB(10, 130, 220);
		grCol.progressBarStreaming = accentColor;
		grCol.progressBarFrame = RGB(22, 107, 186);
		grCol.progressBarFill = accentColor;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = TintColor(accentColor,  40);
		grCol.peakmeterBarFillTop       = TintColor(accentColor,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(accentColor,  20);
		grCol.peakmeterBarFillBack      = ShadeColor(accentColor, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = accentColor;
		grCol.peakmeterBarVertFillPeaks = TintColor(accentColor,  80);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = accentColor;
		grCol.waveformBarFillBack     = ShadeColor(accentColor, 20);
		grCol.waveformBarFillPreFront = RGB(75, 175, 255);
		grCol.waveformBarFillPreBack  = RGB(10, 145, 255);
		grCol.waveformBarIndicator    = RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(10, 130, 220);
		grCol.volumeBarFrame = RGB(22, 107, 186);
		grCol.volumeBarFill = accentColor;

		// * STYLE COLORS * //
		grCol.styleBevel = RGB(0, 0, 0);
		grCol.styleGradient = RGBA(0, 0, 0, 90);
		grCol.styleGradient2 = RGB(3, 72, 128);

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? RGBA(0, 0, 0, 40) :
														   this.BEVEL ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 20) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
														   this.BEVEL ? RGBA(0, 0, 0, 45) : RGBA(0, 0, 0, 15) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.BEVEL ? RGB(10, 125, 210) : RGB(10, 130, 220) :
			this.PB === 'inner' ? this.BEVEL ? RGB(10, 130, 220) : RGB(12, 138, 235) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 70) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 70) : '';
	}
	// #endregion

	// * PUBLIC METHODS - DARK BLUE THEME * //
	// #region PUBLIC METHODS - DARK BLUE THEME
	/**
	 * The Playlist colors for Dark blue theme used in Options > Theme > Dark blue.
	 */
	playlistColorsDarkblueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(255, 202, 128);
		pl.col.bg = RGB(21, 37, 56);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(220, 220, 220);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(220, 220, 220) : RGB(255, 255, 255);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(255, 255, 255) : RGB(220, 220, 220);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = RGB(24, 50, 82);
		pl.col.header_sideMarker = accentColor;
		pl.col.header_artist_normal = RGB(240, 240, 240);
		pl.col.header_artist_playing = accentColor;
		pl.col.header_album_normal = RGB(220, 220, 220);
		pl.col.header_album_playing = RGB(245, 245, 245);
		pl.col.header_info_normal = RGB(220, 220, 220);
		pl.col.header_info_playing = RGB(245, 245, 245);
		pl.col.header_date_normal = RGB(220, 220, 220);
		pl.col.header_date_playing = RGB(245, 245, 245);
		pl.col.header_line_normal = RGB(12, 21, 31);
		pl.col.header_line_playing = RGB(12, 21, 31);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(22, 40, 63, 130) : this.ALT ? RGB(18, 42, 70) : this.ALT2 ? RGB(17, 35, 57) : RGB(22, 40, 63);
		pl.col.row_selection_bg = RGB(21, 37, 56);
		pl.col.row_selection_frame = RGB(27, 55, 90);
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(230, 230, 230);
		pl.col.row_title_playing = RGB(255, 255, 255);
		pl.col.row_title_selected = RGB(255, 255, 255);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = RGB(12, 21, 31);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal =  RGB(220, 220, 220);
		pl.col.sbar_btn_hovered = RGB(255, 255, 255);
		pl.col.sbar_thumb_normal = RGB(27, 55, 90);
		pl.col.sbar_thumb_hovered = accentColor;
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for Dark blue theme used in Options > Theme > Dark blue.
	 */
	libraryColorsDarkblueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(255, 202, 128);
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = accentColor;
		lib.ui.col.iconPlus_h = RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = RGB(255, 255, 255);
		lib.ui.col.iconPlusBg = RGB(24, 50, 82);
		lib.ui.col.iconMinus_e = accentColor;
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text = RGB(230, 230, 230);
		lib.ui.col.text_h = RGB(255, 255, 255);
		lib.ui.col.text_nowp = accentColor;
		lib.ui.col.textSel = RGB(255, 255, 255);
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(230, 230, 230);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(230, 230, 230);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = accentColor;
		lib.ui.col.crossBtn = accentColor;
		lib.ui.col.filterBtn = RGB(230, 230, 230);
		lib.ui.col.settingsBtn = RGB(230, 230, 230);
		lib.ui.col.line = RGB(12, 21, 31);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = RGB(220, 220, 220);
		lib.ui.col.sbarNormal = RGB(36, 84, 143);
		lib.ui.col.sbarHovered = accentColor;
		lib.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Biography colors for Dark blue theme used in Options > Theme > Dark blue.
	 */
	biographyColorsDarkblueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(255, 202, 128);
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText = pl.col.header_artist_playing;
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = accentColor;

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = accentColor;
		bio.ui.col.noPhotoStubBg = RGB(24, 50, 82);
		bio.ui.col.noPhotoStubText = pl.col.header_artist_playing;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = RGB(220, 220, 220);
		bio.ui.col.sbarNormal = RGB(36, 84, 143);
		bio.ui.col.sbarHovered = accentColor;
		bio.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Main colors for Dark blue theme used in Options > Theme > Dark blue.
	 */
	mainColorsDarkblueTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(255, 202, 128);
		grCol.bg = RGB(22, 40, 63);
		grCol.loadingThemeBg = RGB(22, 40, 63);
		grCol.uiHacksFrame = RGB(27, 55, 90);
		grCol.shadow = RGBA(0, 0, 0, 75);
		grCol.discArtShadow = RGBA(0, 0, 0, 80);
		grCol.noAlbumArtStub = accentColor;
		grCol.lowerBarArtist = accentColor;
		grCol.lowerBarTitle = RGB(230, 230, 230);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = accentColor;
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = RGB(21, 37, 56);
		grCol.detailsText = RGB(255, 255, 255);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = accentColor;
		grCol.timelinePlayed = RGB(204, 161, 102);
		grCol.timelineUnplayed = RGB(155, 110, 70);
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = accentColor;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel' ? RGB(27, 55, 90) :
			this.TMB === 'inner' ? RGB(38, 70, 110) :
			RGB(27, 55, 90);

		grCol.menuStyleBg = this.TMB === 'emboss' ? RGB(27, 48, 77) :	this.BEVEL ? RGB(22, 40, 60) : RGB(25, 45, 70);
		grCol.menuRectStyleEmbossTop = RGB(35, 70, 115);
		grCol.menuRectStyleEmbossBottom = RGB(6, 10, 15);
		grCol.menuRectNormal = this.TMB === 'filled' ? RGBA(200, 200, 200, 140) :	RGB(200, 200, 200);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(50, 90, 150, 140) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(15, 25, 40) : RGB(18, 30, 50) :
			RGB(50, 90, 150);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = RGB(230, 230, 230);
		grCol.menuTextHovered = RGB(255, 255, 255);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = RGB(27, 55, 90);
		grCol.transportEllipseNormal = RGB(20, 33, 48);
		grCol.transportEllipseHovered = RGB(50, 90, 150);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel'  ? this.BEVEL ? RGB(22, 40, 60) : RGB(25, 45, 70) :
			this.TPB === 'inner'  ? this.GRAD2 ? RGB(22, 40, 60) : RGB(25, 45, 70) :
			this.TPB === 'emboss' ? RGB(27, 55, 90) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(38, 70, 110) :
			this.TPB === 'emboss' ? RGB(35, 70, 115) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(15, 25, 40) : RGB(18, 30, 50) :
			this.TPB === 'emboss' ? RGB(20, 36, 50) : '';

		grCol.transportIconNormal = accentColor;
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = RGB(27, 55, 90);
		grCol.progressBarStreaming = accentColor;
		grCol.progressBarFrame = RGB(22, 37, 54);
		grCol.progressBarFill = accentColor;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = TintColor(accentColor,  40);
		grCol.peakmeterBarFillTop       = TintColor(accentColor,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(accentColor,  20);
		grCol.peakmeterBarFillBack      = ShadeColor(accentColor, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = accentColor;
		grCol.peakmeterBarVertFillPeaks = TintColor(accentColor,  80);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = accentColor;
		grCol.waveformBarFillBack     = ShadeColor(accentColor, 20);
		grCol.waveformBarFillPreFront = RGB(65, 110, 180);
		grCol.waveformBarFillPreBack  = RGB(45, 80, 130);
		grCol.waveformBarIndicator    = RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(27, 55, 90);
		grCol.volumeBarFrame = RGB(20, 33, 48);
		grCol.volumeBarFill = accentColor;

		// * STYLE COLORS * //
		grCol.styleBevel = RGB(0, 0, 0);
		grCol.styleGradient = RGBA(0, 0, 0, 140);
		grCol.styleGradient2 = RGB(10, 20, 35);

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 60) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 160) : RGBA(0, 0, 0, 80) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) :
														   this.BEVEL ? RGBA(0, 0, 0, 40)  : RGBA(0, 0, 0, 30) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? RGB(30, 62, 102) :
			this.PB === 'inner' ? RGB(30, 62, 102) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 100) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 60) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 100) : '';
	}
	// #endregion

	// * PUBLIC METHODS - RED THEME * //
	// #region PUBLIC METHODS - RED THEME
	/**
	 * The Playlist colors for Red theme used in Options > Theme > Red.
	 */
	playlistColorsRedTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(245, 212, 165);
		pl.col.bg = RGB(110, 20, 20);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(220, 220, 220);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(220, 220, 220) : RGB(255, 255, 255);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(255, 255, 255) : RGB(220, 220, 220);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = RGB(130, 25, 25);
		pl.col.header_sideMarker = accentColor;
		pl.col.header_artist_normal = RGB(240, 240, 240);
		pl.col.header_artist_playing = accentColor;
		pl.col.header_album_normal = RGB(220, 220, 220);
		pl.col.header_album_playing = RGB(245, 245, 245);
		pl.col.header_info_normal = RGB(220, 220, 220);
		pl.col.header_info_playing = RGB(245, 245, 245);
		pl.col.header_date_normal = RGB(220, 220, 220);
		pl.col.header_date_playing = RGB(245, 245, 245);
		pl.col.header_line_normal = RGB(75, 18, 18);
		pl.col.header_line_playing = RGB(75, 18, 18);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(100, 20, 20, 130) : this.ALT ? RGB(130, 25, 25) : RGB(100, 20, 20);
		pl.col.row_selection_bg = RGB(110, 20, 20);
		pl.col.row_selection_frame = RGB(145, 25, 25);
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(220, 220, 220);
		pl.col.row_title_playing = RGB(255, 255, 255);
		pl.col.row_title_selected = RGB(255, 255, 255);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = RGB(75, 18, 18);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = RGB(220, 220, 220);
		pl.col.sbar_btn_hovered = RGB(255, 255, 255);
		pl.col.sbar_thumb_normal = RGB(145, 25, 25);
		pl.col.sbar_thumb_hovered = accentColor;
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for Red theme used in Options > Theme > Red.
	 */
	libraryColorsRedTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(245, 212, 165);
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = accentColor;
		lib.ui.col.iconPlus_h = RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = RGB(255, 255, 255);
		lib.ui.col.iconPlusBg = RGB(140, 25, 25);
		lib.ui.col.iconMinus_e = accentColor;
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text = RGB(230, 230, 230);
		lib.ui.col.text_h = RGB(255, 255, 255);
		lib.ui.col.text_nowp = accentColor;
		lib.ui.col.textSel = RGB(255, 255, 255);
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(230, 230, 230);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(230, 230, 230);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = accentColor;
		lib.ui.col.crossBtn = accentColor;
		lib.ui.col.filterBtn = RGB(230, 230, 230);
		lib.ui.col.settingsBtn = RGB(230, 230, 230);
		lib.ui.col.line = RGB(75, 18, 18);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = RGB(220, 220, 220);
		lib.ui.col.sbarNormal = RGB(198, 32, 32);
		lib.ui.col.sbarHovered = accentColor;
		lib.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Biography colors for Red theme used in Options > Theme > Red.
	 */
	biographyColorsRedTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(245, 212, 165);
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText = pl.col.header_artist_playing;
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = accentColor;

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = accentColor;
		bio.ui.col.noPhotoStubBg = RGB(130, 25, 25);
		bio.ui.col.noPhotoStubText = pl.col.header_artist_playing;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = RGB(220, 220, 220);
		bio.ui.col.sbarNormal = RGB(198, 32, 32);
		bio.ui.col.sbarHovered = accentColor;
		bio.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Main colors for Red theme used in Options > Theme > Red.
	 */
	mainColorsRedTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(245, 212, 165);
		grCol.bg = RGB(100, 20, 20);
		grCol.loadingThemeBg = RGB(100, 20, 20);
		grCol.uiHacksFrame = RGB(125, 0, 0);
		grCol.shadow = RGBA(0, 0, 0, 75);
		grCol.discArtShadow = RGBA(0, 0, 0, 80);
		grCol.noAlbumArtStub = accentColor;
		grCol.lowerBarArtist = accentColor;
		grCol.lowerBarTitle = RGB(220, 220, 220);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = accentColor;
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = RGB(110, 20, 20);
		grCol.detailsText = RGB(255, 255, 255);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = accentColor;
		grCol.timelinePlayed = RGB(207, 170, 118);
		grCol.timelineUnplayed = RGB(170, 120, 95);
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = accentColor;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? RGB(140, 25, 25) :
			this.TMB === 'inner'  ? RGB(160, 32, 32) :
			RGB(140, 25, 25);

		grCol.menuStyleBg = this.TMB === 'emboss' ? RGB(125, 25, 25) : RGB(100, 20, 20);
		grCol.menuRectStyleEmbossTop = RGB(158, 30, 30);
		grCol.menuRectStyleEmbossBottom = RGB(54, 10, 10);
		grCol.menuRectNormal = this.TMB === 'filled' ? RGBA(200, 200, 200, 140) :	RGB(200, 200, 200);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(204, 45, 45, 140) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(66, 13, 13) : RGB(77, 15, 15) :
			RGB(204, 45, 45);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = RGB(220, 220, 220);
		grCol.menuTextHovered = RGB(255, 255, 255);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = RGB(140, 25, 25);
		grCol.transportEllipseNormal = RGB(82, 19, 19);
		grCol.transportEllipseHovered = RGB(204, 45, 45);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(100, 20, 20) :
			this.TPB === 'emboss' ? RGB(140, 25, 25) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(160, 32, 32) :
			this.TPB === 'emboss' ? RGB(166, 30, 30) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(66, 13, 13) : RGB(77, 15, 15) :
			this.TPB === 'emboss' ? this.BEVEL && !this.GRAD2 ? RGB(80, 15, 15) : this.GRAD2 ? RGB(54, 10, 10) : RGB(80, 15, 15) : '';

		grCol.transportIconNormal = accentColor;
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = RGB(140, 25, 25);
		grCol.progressBarStreaming = accentColor;
		grCol.progressBarFrame = RGB(92, 21, 21);
		grCol.progressBarFill = accentColor;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = TintColor(accentColor,  40);
		grCol.peakmeterBarFillTop       = TintColor(accentColor,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(accentColor,  20);
		grCol.peakmeterBarFillBack      = ShadeColor(accentColor, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = accentColor;
		grCol.peakmeterBarVertFillPeaks = TintColor(accentColor,  80);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = accentColor;
		grCol.waveformBarFillBack     = ShadeColor(accentColor, 20);
		grCol.waveformBarFillPreFront = RGB(230, 45, 45);
		grCol.waveformBarFillPreBack  = RGB(180, 35, 35);
		grCol.waveformBarIndicator    = RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(140, 25, 25);
		grCol.volumeBarFrame = RGB(82, 19, 19);
		grCol.volumeBarFill = accentColor;

		// * STYLE COLORS * //
		grCol.styleBevel = RGB(0, 0, 0);
		grCol.styleGradient = RGBA(0, 0, 0, 90);
		grCol.styleGradient2 = RGB(65, 13, 13);

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 50) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 80) : RGBA(0, 0, 0, 60) :
														   this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? RGB(145, 28, 28) :
			this.PB === 'inner' ? this.BEVEL ? RGB(158, 30, 30) : RGB(145, 28, 28) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 100) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 50) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 100) : '';
	}
	// #endregion

	// * PUBLIC METHODS - CREAM THEME * //
	// #region PUBLIC METHODS - CREAM THEME
	/**
	 * The Playlist colors for Cream theme used in Options > Theme > Cream.
	 */
	playlistColorsCreamTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(120, 170, 130);
		pl.col.bg = RGB(255, 247, 245);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(220, 220, 220);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(110, 110, 110) : RGB(80, 80, 80);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(80, 80, 80) : RGB(130, 130, 130);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = this.BLEND12 ? RGB(65, 135, 80) : accentColor;
		pl.col.header_sideMarker = pl.col.header_nowplaying_bg;
		pl.col.header_artist_normal = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		pl.col.header_artist_playing = RGB(255, 255, 255);
		pl.col.header_album_normal = this.BLEND ? RGB(80, 80, 80) : RGB(110, 110, 110);
		pl.col.header_album_playing = RGB(245, 245, 245);
		pl.col.header_info_normal = this.BLEND ? RGB(80, 80, 80) : RGB(110, 110, 110);
		pl.col.header_info_playing = RGB(245, 245, 245);
		pl.col.header_date_normal = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		pl.col.header_date_playing = RGB(245, 245, 245);
		pl.col.header_line_normal = RGB(200, 200, 200);
		pl.col.header_line_playing = RGB(220, 220, 220);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(255, 255, 255, 130) : this.ALT2 ? RGB(255, 247, 240) : RGB(255, 255, 255);
		pl.col.row_selection_bg = RGB(200, 200, 200);
		pl.col.row_selection_frame = pl.col.row_selection_bg;
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = this.BLEND ? RGB(60, 60, 60) : RGB(90, 90, 90);
		pl.col.row_title_playing = RGB(245, 245, 245);
		pl.col.row_title_selected = RGB(0, 0, 0);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = RGB(200, 200, 200);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = accentColor;
		pl.col.sbar_btn_hovered = RGB(100, 100, 100);
		pl.col.sbar_thumb_normal = RGB(200, 200, 200);
		pl.col.sbar_thumb_hovered = accentColor;
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for Cream theme used in Options > Theme > Cream.
	 */
	libraryColorsCreamTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(120, 170, 130);
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		lib.ui.col.iconPlus_h = RGB(0, 0, 0);
		lib.ui.col.iconPlus_sel = ['modern', 'facet'].includes(grSet.libraryDesign) || !lib.pop.highlight.nowPlaying ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.iconPlusBg = RGB(255, 255, 255);
		lib.ui.col.iconMinus_e = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(0, 0, 0);

		// * TEXT COLORS * //
		lib.ui.col.text =
			libSet.albumArtShow && libImg.labels.overlayDark ? RGB(220, 220, 220) :
			this.BLEND ? RGB(65, 65, 65) :
			RGB(90, 90, 90);

		lib.ui.col.text_h =
			libSet.albumArtShow && libImg.labels.overlayDark ? RGB(255, 255, 255) :
			['modern', 'facet'].includes(grSet.libraryDesign) && lib.panel.imgView ? RGB(255, 255, 255) :
			RGB(0, 0, 0);

		lib.ui.col.text_nowp = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(0, 0, 0) : RGB(255, 255, 255);

		lib.ui.col.textSel =
			!['facet', 'coversLabelsRight', 'coversLabelsBottom'].includes(grSet.libraryDesign) || ![2, 1].includes(libSet.albumArtLabelType) ||
			(['facet', 'coversLabelsRight', 'coversLabelsBottom'].includes(grSet.libraryDesign) ||  [2, 1].includes(libSet.albumArtLabelType)) && !lib.pop.highlight.nowPlaying ?
				libSet.albumArtShow && libImg.labels.overlayDark ? RGB(0, 0, 0) : RGB(255, 255, 255) :
			lib.ui.col.text_h;

		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = this.BLEND ? RGB(60, 60, 60) : RGB(90, 90, 90);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = this.BLEND ? RGB(60, 60, 60) : RGB(90, 90, 90);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = this.BLEND12 ? RGB(65, 135, 80) : accentColor;
		lib.ui.col.crossBtn = this.BLEND12 ? RGB(65, 135, 80) : accentColor;
		lib.ui.col.filterBtn = this.BLEND ? RGB(60, 60, 60) : RGB(120, 120, 120);
		lib.ui.col.settingsBtn = this.BLEND12 ? RGB(65, 135, 80) : accentColor;
		lib.ui.col.line = RGB(200, 200, 200);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = accentColor;
		lib.ui.col.sbarNormal = RGB(116, 127, 129);
		lib.ui.col.sbarHovered = accentColor;
		lib.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Biography colors for Cream theme used in Options > Theme > Cream.
	 */
	biographyColorsCreamTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(120, 170, 130);
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText = this.BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100);
		bio.ui.col.bottomLine = (bio.ui.blur.blend || bio.ui.blur.light) ? RGB(120, 120, 120) : pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = RGB(255, 255, 255);

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		bio.ui.col.noPhotoStubBg = RGB(255, 247, 240);
		bio.ui.col.noPhotoStubText = accentColor;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = accentColor;
		bio.ui.col.sbarNormal = RGB(116, 127, 129);
		bio.ui.col.sbarHovered = accentColor;
		bio.ui.col.sbarDrag = accentColor;
	}

	/**
	 * The Main colors for Cream theme used in Options > Theme > Cream.
	 */
	mainColorsCreamTheme() {
		// * MAIN COLORS * //
		const accentColor = RGB(120, 170, 130);
		grCol.bg = RGB(255, 247, 240);
		grCol.loadingThemeBg = RGB(255, 247, 240);
		grCol.uiHacksFrame = RGB(255, 247, 240);
		grCol.shadow = RGBA(0, 0, 0, 25);
		grCol.discArtShadow = RGBA(0, 0, 0, 10);
		grCol.noAlbumArtStub = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		grCol.lowerBarArtist = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		grCol.lowerBarTitle = this.BLEND12 ? RGB(90, 90, 90) : RGB(100, 100, 100);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = RGB(255, 247, 245);
		grCol.detailsText = this.BLEND ? RGB(80, 80, 80) : RGB(120, 120, 120);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = accentColor;
		grCol.timelinePlayed = RGB(139, 196, 151);
		grCol.timelineUnplayed = RGB(158, 222, 171);
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = RGB(255, 255, 255);

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? RGB(255, 255, 255) :
			this.TMB === 'inner'  ? RGB(255, 255, 255) :
			this.TMB === 'emboss' ? this.BEVEL ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			RGB(247, 239, 233);

		grCol.menuStyleBg = this.TMB === 'emboss' ? RGB(240, 230, 220) : this.BEVEL ? RGB(212, 205, 200) : RGB(229, 222, 216);
		grCol.menuRectStyleEmbossTop = this.BEVEL ? RGB(235, 235, 235) : RGB(255, 255, 255);
		grCol.menuRectStyleEmbossBottom = this.BEVEL ? RGB(205, 205, 205) : RGB(215, 215, 215);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGB(100, 150, 110, 100) :
			this.BLEND12 ? RGB(150, 150, 150) :
			RGB(100, 150, 110);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(190, 190, 190, 100) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			this.BLEND12 ? RGB(150, 150, 150) :
			RGB(190, 190, 190);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = this.BLEND12 ? RGB(65, 135, 80) : RGB(100, 150, 110);
		grCol.menuTextHovered = this.BLEND ? RGB(60, 60, 60) : RGB(100, 100, 100);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = RGB(255, 255, 255);
		grCol.transportEllipseNormal = RGB(220, 220, 220);
		grCol.transportEllipseHovered = RGB(200, 200, 200);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(212, 205, 200) : RGB(229, 222, 216) :
			this.TPB === 'emboss' ? RGB(240, 225, 210) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(255, 255, 255) :
			this.TPB === 'emboss' ? RGB(255, 255, 255) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? this.BEVEL ? RGB(190, 190, 190) : RGB(220, 220, 220) :
			this.TPB === 'emboss' ? this.BEVEL ? RGB(210, 210, 210) : RGB(225, 225, 225) : '';

		grCol.transportIconNormal = this.BLEND12 || this.TPB === 'minimal' ? RGB(65, 135, 80) : RGB(100, 150, 110);
		grCol.transportIconHovered = RGB(100, 100, 100);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar =
			this.PB === 'bevel' ? RGB(240, 240, 240) :
			this.BEVEL ? RGB(225, 225, 225) : RGB(255, 255, 255);

		grCol.progressBarStreaming = this.BLEND12 ? RGB(65, 135, 80) : accentColor;
		grCol.progressBarFrame = RGB(230, 230, 230);
		grCol.progressBarFill = this.BLEND12 ? RGB(65, 135, 80) : accentColor;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = TintColor(accentColor,  40);
		grCol.peakmeterBarFillTop       = TintColor(accentColor,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(accentColor,  20);
		grCol.peakmeterBarFillBack      = ShadeColor(accentColor, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = accentColor;
		grCol.peakmeterBarVertFillPeaks = ShadeColor(accentColor, 20);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = this.BEVEL || this.BLEND ? TintColor(accentColor, 10) : accentColor;
		grCol.waveformBarFillBack     = this.BEVEL || this.BLEND ? ShadeColor(accentColor, 30) : ShadeColor(accentColor, 20);
		grCol.waveformBarFillPreFront = this.BEVEL || this.BLEND ? RGB(205, 200, 190) : RGB(180, 175, 165);
		grCol.waveformBarFillPreBack  = this.BEVEL || this.BLEND ? RGB(115, 110, 105) : RGB(140, 135, 130);
		grCol.waveformBarIndicator    = RGB(60, 60, 60);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(255, 255, 255);
		grCol.volumeBarFrame = RGB(220, 220, 220);
		grCol.volumeBarFill = this.BLEND12 ? RGB(65, 135, 80) : accentColor;

		// * STYLE COLORS * //
		grCol.styleBevel = RGB(0, 0, 0);
		grCol.styleGradient = '';
		grCol.styleGradient2 = '';

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 25) :
														   this.BEVEL ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 10) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 35) : RGBA(0, 0, 0, 30) :
														   this.BEVEL ? RGBA(0, 0, 0, 15) : RGBA(0, 0, 0, 10) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 140) : RGBA(0, 0, 0, 15) :
														   this.BEVEL ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 140) : RGBA(0, 0, 0, 15) :
														   this.BEVEL ? RGBA(255, 255, 255, 120) : RGBA(0, 0, 0, 10) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 70) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 70) : '';
	}
	// #endregion

	// * PUBLIC METHODS - NEON THEMES * //
	// #region PUBLIC METHODS - NEON THEMES
	/**
	 * The Playlist colors for Neon blue/green/red/gold theme used in Options > Theme > Neon blue/green/red/gold.
	 */
	playlistColorsNeonThemes() {
		// * MAIN COLORS * //
		const accentColor = ({
			nblue: RGB(0, 200, 255),
			ngreen: RGB(0, 200, 0),
			nred: RGB(240, 10, 60),
			ngold: RGB(255, 205, 5)
		}[this.THEME]);

		const accentColorLight = ({
			nblue: RGB(0, 238, 255),
			ngreen: RGB(0, 255, 0),
			nred: RGB(255, 8, 8),
			ngold: RGB(255, 242, 3)
		}[this.THEME]);

		pl.col.bg = RGB(10, 10, 10);

		// * PLAYLIST MANAGER COLORS * //
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(200, 200, 200);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(220, 220, 220) : RGB(255, 255, 255);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(255, 255, 255) : RGB(200, 200, 200);

		// * HEADER COLORS * //
		pl.col.header_nowplaying_bg = this.BLEND12 ? RGBA(25, 25, 25, 100) : RGB(25, 25, 25);
		pl.col.header_sideMarker = accentColor;
		pl.col.header_artist_normal = RGB(240, 240, 240);
		pl.col.header_artist_playing = accentColor;
		pl.col.header_album_normal = RGB(220, 220, 220);
		pl.col.header_album_playing = RGB(240, 240, 240);
		pl.col.header_info_normal = RGB(220, 220, 220);
		pl.col.header_info_playing = RGB(240, 240, 240);
		pl.col.header_date_normal = RGB(220, 220, 220);
		pl.col.header_date_playing = accentColor;
		pl.col.header_line_normal = RGB(45, 45, 45);
		pl.col.header_line_playing = RGB(50, 50, 50);

		// * ROW COLORS * //
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(20, 20, 20, 130) : this.ALT2 ? RGB(35, 35, 35) : RGB(20, 20, 20);
		pl.col.row_selection_bg = RGB(10, 10, 10);
		pl.col.row_selection_frame = RGB(40, 40, 40);
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(200, 200, 200);
		pl.col.row_title_playing = RGB(255, 255, 255);
		pl.col.row_title_selected = RGB(255, 255, 255);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = RGB(45, 45, 45);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * SCROLLBAR COLORS * //
		pl.col.sbar_btn_normal = accentColor;
		pl.col.sbar_btn_hovered = accentColorLight;
		pl.col.sbar_thumb_normal = accentColor;
		pl.col.sbar_thumb_hovered = accentColorLight;
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;
	}

	/**
	 * The Library colors for Neon blue/green/red/gold theme used in Options > Theme > Neon blue/green/red/gold.
	 */
	libraryColorsNeonThemes() {
		// * MAIN COLORS * //
		const accentColor = ({
			nblue: RGB(0, 200, 255),
			ngreen: RGB(0, 200, 0),
			nred: RGB(240, 10, 60),
			ngold: RGB(255, 205, 5)
		}[this.THEME]);

		const accentColorLight = ({
			nblue: RGB(0, 238, 255),
			ngreen: RGB(0, 255, 0),
			nred: RGB(255, 8, 8),
			ngold: RGB(255, 242, 3)
		}[this.THEME]);

		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * ROW COLORS * //
		lib.ui.col.nowPlayingBg = libSet.albumArtShow ? TintColor(pl.col.row_nowplaying_bg, 7) : pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * NODE COLORS * //
		lib.ui.col.iconPlus = pl.col.header_artist_playing;
		lib.ui.col.iconPlus_h = RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = RGB(255, 255, 255);
		lib.ui.col.iconPlusBg = RGB(45, 45, 45);
		lib.ui.col.iconMinus_e = pl.col.header_artist_playing;
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text = RGB(200, 200, 200);
		lib.ui.col.text_h = RGB(255, 255, 255);
		lib.ui.col.text_nowp = pl.col.header_artist_playing;
		lib.ui.col.textSel = RGB(255, 255, 255);
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(200, 200, 200);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(200, 200, 200);

		// * BUTTON COLORS * //
		lib.ui.col.searchBtn = pl.col.header_artist_playing;
		lib.ui.col.crossBtn = pl.col.header_artist_playing;
		lib.ui.col.filterBtn = RGB(200, 200, 200);
		lib.ui.col.settingsBtn = pl.col.header_artist_playing;
		lib.ui.col.line = RGB(45, 45, 45);
		lib.ui.col.s_line = lib.ui.col.line;

		// * SCROLLBAR COLORS * //
		lib.ui.col.sbarBtns = accentColor;
		lib.ui.col.sbarNormal = accentColor;
		lib.ui.col.sbarHovered = accentColorLight;
		lib.ui.col.sbarDrag = accentColorLight;
	}

	/**
	 * The Biography colors for Neon blue/green/red/gold theme used in Options > Theme > Neon blue/green/red/gold.
	 */
	biographyColorsNeonThemes() {
		// * MAIN COLORS * //
		const accentColor = ({
			nblue: RGB(0, 200, 255),
			ngreen: RGB(0, 200, 0),
			nred: RGB(240, 10, 60),
			ngold: RGB(255, 205, 5)
		}[this.THEME]);

		const accentColorLight = ({
			nblue: RGB(0, 238, 255),
			ngreen: RGB(0, 255, 0),
			nred: RGB(255, 8, 8),
			ngold: RGB(255, 242, 3)
		}[this.THEME]);

		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * HEADER COLORS * //
		bio.ui.col.headingText = pl.col.header_artist_playing;
		bio.ui.col.bottomLine = RGB(55, 55, 55);
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;

		// * POPUP COLORS * //
		bio.ui.col.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		bio.ui.col.popupText = accentColor;

		// * MISC COLORS * //
		bio.ui.col.lyricsNormal = bio.ui.col.text;
		bio.ui.col.lyricsHighlight = accentColor;
		bio.ui.col.noPhotoStubBg = RGB(25, 25, 25);
		bio.ui.col.noPhotoStubText = pl.col.header_artist_playing;

		// * SCROLLBAR COLORS * //
		bio.ui.col.sbarBtns = accentColor;
		bio.ui.col.sbarNormal = accentColor;
		bio.ui.col.sbarHovered = accentColorLight;
		bio.ui.col.sbarDrag = accentColorLight;
	}

	/**
	 * The Main colors for Neon blue/green/red/gold theme used in Options > Theme > Neon blue/green/red/gold.
	 */
	mainColorsNeonThemes() {
		// * MAIN COLORS * //
		const accentColor = ({
			nblue: RGB(0, 200, 255),
			ngreen: RGB(0, 200, 0),
			nred: RGB(240, 10, 60),
			ngold: RGB(255, 205, 5)
		}[this.THEME]);

		const accentColorLight = ({
			nblue: RGB(0, 238, 255),
			ngreen: RGB(0, 255, 0),
			nred: RGB(255, 8, 8),
			ngold: RGB(255, 242, 3)
		}[this.THEME]);

		const accentColorDark = ({
			nblue: RGB(0, 160, 205),
			ngreen: RGB(0, 150, 0),
			nred: RGB(180, 5, 35),
			ngold: RGB(200, 160, 0)
		}[this.THEME]);

		const accentColorDarker = ({
			nblue: RGB(0, 120, 155),
			ngreen: RGB(0, 100, 0),
			nred: RGB(130, 5, 25),
			ngold: RGB(150, 120, 0)
		}[this.THEME]);

		grCol.bg = this.BEVEL ? RGB(30, 30, 30) : RGB(20, 20, 20);
		grCol.loadingThemeBg = RGB(20, 20, 20);
		grCol.uiHacksFrame = RGB(30, 30, 30);
		grCol.shadow = RGBA(0, 0, 0, 255);
		grCol.discArtShadow = RGBA(0, 0, 0, 40);
		grCol.noAlbumArtStub = accentColor;
		grCol.lowerBarArtist = accentColor;
		grCol.lowerBarTitle = RGB(220, 220, 220);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;
		grCol.lyricsNormal = RGB(255, 255, 255);
		grCol.lyricsHighlight = accentColor;
		grCol.lyricsShadow = RGB(0, 0, 0);

		// * DETAILS COLORS * //
		grCol.detailsBg = this.BLEND12 ? RGBA(10, 10, 10, 100) : RGB(10, 10, 10);
		grCol.detailsText = RGB(255, 255, 255);
		grCol.detailsRating = RGB(255, 170, 32);
		grCol.detailsHotness = grCol.detailsRating;
		grCol.timelineAdded = accentColor;
		grCol.timelinePlayed = accentColorDark;
		grCol.timelineUnplayed = accentColorDarker;
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = RGBAtoRGB(pl.col.header_nowplaying_bg, 255);
		grCol.popupText = accentColor;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? this.BEVEL ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			this.TMB === 'inner'  ? this.BEVEL ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			RGB(50, 50, 50);

		grCol.menuStyleBg =
			this.TMB === 'emboss' ? this.BEVEL ? RGB(35, 35, 35) : RGB(40, 40, 40) :
			this.BEVEL ? RGB(25, 25, 25) : RGB(20, 20, 20);

		grCol.menuRectStyleEmbossTop = RGB(60, 60, 60);
		grCol.menuRectStyleEmbossBottom = RGB(0, 0, 0);
		grCol.menuRectNormal = this.TMB === 'filled' ? RGBtoRGBA(accentColor, 80) : accentColor;

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBtoRGBA(accentColorLight, 80) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(0, 0, 0) :
			accentColorLight;

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal  = accentColor;
		grCol.menuTextHovered = accentColorLight;
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = RGB(35, 35, 35);
		grCol.transportEllipseNormal = RGB(50, 50, 50);
		grCol.transportEllipseHovered = accentColorLight;
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(0, 0, 0) :
			this.TPB === 'emboss' ? RGB(50, 50, 50) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(50, 50, 50) :
			this.TPB === 'emboss' ? this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(0, 0, 0) :
			this.TPB === 'emboss' ? RGB(10, 10, 10) : '';

		grCol.transportIconNormal  = accentColor;
		grCol.transportIconHovered = accentColorLight;
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = RGB(35, 35, 35);
		grCol.progressBarStreaming = accentColorLight;
		grCol.progressBarFrame = grCol.bg;
		grCol.progressBarFill = accentColor;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = TintColor(accentColor,  40);
		grCol.peakmeterBarFillTop       = TintColor(accentColor,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(accentColor,  20);
		grCol.peakmeterBarFillBack      = ShadeColor(accentColor, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = accentColor;
		grCol.peakmeterBarVertFillPeaks = TintColor(accentColor,  60);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = accentColor;
		grCol.waveformBarFillBack     = ShadeColor(accentColor, 20);
		grCol.waveformBarFillPreFront = RGB(100, 100, 100);
		grCol.waveformBarFillPreBack  = RGB(80, 80, 80);
		grCol.waveformBarIndicator    = RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(30, 30, 30);
		grCol.volumeBarFrame = RGB(50, 50, 50);
		grCol.volumeBarFill = accentColor;

		// * STYLE COLORS * //
		grCol.styleBevel = RGB(0, 0, 0);
		grCol.styleGradient = '';
		grCol.styleGradient2 = '';
		grCol.styleAlternative = this.BEVEL ? RGB(30, 30, 30) : RGB(20, 20, 20);

		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) : '';

		grCol.styleProgressBarLineTop = RGBA(0, 0, 0, 255);

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? RGBA(255, 255, 255, 20) :
											  this.BEVEL ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 20) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? RGBA(255, 255, 255, 20) :
											  this.BEVEL ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 25) :
			RGBA(0, 0, 0, 100);

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 80) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 80) : '';
	}
	// #endregion

	// * PUBLIC METHODS - CUSTOM THEME * //
	// #region PUBLIC METHODS - CUSTOM THEME
	/**
	 * The Playlist colors for Custom theme used in Options > Theme > Custom.
	 */
	playlistColorsCustomTheme() {
		try {
			// * MAIN COLORS * //
			pl.col.bg = HEXtoRGB(grCfg.cTheme.pl_col_bg);

			// * PLAYLIST MANAGER COLORS * //
			pl.col.plman_bg = pl.col.bg;
			pl.col.plman_text_normal = grSet.autoHidePlman ? HEXtoRGB(grCfg.cTheme.pl_col_bg) : HEXtoRGB(grCfg.cTheme.pl_col_plman_text_normal);
			pl.col.plman_text_hovered = HEXtoRGB(grCfg.cTheme.pl_col_plman_text_hovered);
			pl.col.plman_text_pressed = HEXtoRGB(grCfg.cTheme.pl_col_plman_text_pressed);

			// * HEADER COLORS * //
			pl.col.header_nowplaying_bg = this.BLEND ? HEXtoRGBA(grCfg.cTheme.pl_col_header_nowplaying_bg, 130) : HEXtoRGB(grCfg.cTheme.pl_col_header_nowplaying_bg);
			pl.col.header_sideMarker = HEXtoRGB(grCfg.cTheme.pl_col_header_sideMarker);
			pl.col.header_artist_normal = HEXtoRGB(grCfg.cTheme.pl_col_header_artist_normal);
			pl.col.header_artist_playing = HEXtoRGB(grCfg.cTheme.pl_col_header_artist_playing);
			pl.col.header_album_normal = HEXtoRGB(grCfg.cTheme.pl_col_header_album_normal);
			pl.col.header_album_playing = HEXtoRGB(grCfg.cTheme.pl_col_header_album_playing);
			pl.col.header_info_normal = HEXtoRGB(grCfg.cTheme.pl_col_header_info_normal);
			pl.col.header_info_playing = HEXtoRGB(grCfg.cTheme.pl_col_header_info_playing);
			pl.col.header_date_normal = HEXtoRGB(grCfg.cTheme.pl_col_header_date_normal);
			pl.col.header_date_playing = HEXtoRGB(grCfg.cTheme.pl_col_header_date_playing);
			pl.col.header_line_normal = HEXtoRGB(grCfg.cTheme.pl_col_header_line_normal);
			pl.col.header_line_playing = HEXtoRGB(grCfg.cTheme.pl_col_header_line_playing);

			// * ROW COLORS * //
			pl.col.row_nowplaying_bg = this.BLEND ? HEXtoRGBA(grCfg.cTheme.pl_col_row_nowplaying_bg, 130) : HEXtoRGB(grCfg.cTheme.pl_col_row_nowplaying_bg);
			pl.col.row_stripes_bg = this.BLEND ? HEXtoRGBA(grCfg.cTheme.pl_col_row_stripes_bg, 130) : HEXtoRGB(grCfg.cTheme.pl_col_row_stripes_bg);
			pl.col.row_selection_frame = HEXtoRGB(grCfg.cTheme.pl_col_row_selection_frame);
			pl.col.row_sideMarker = HEXtoRGB(grCfg.cTheme.pl_col_row_sideMarker);
			pl.col.row_title_normal = this.BLEND ? ShadeColor(HEXtoRGB(grCfg.cTheme.pl_col_row_title_normal), 10) : HEXtoRGB(grCfg.cTheme.pl_col_row_title_normal);
			pl.col.row_title_playing = HEXtoRGB(grCfg.cTheme.pl_col_row_title_playing);
			pl.col.row_title_selected = HEXtoRGB(grCfg.cTheme.pl_col_row_title_selected);
			pl.col.row_title_hovered = HEXtoRGB(grCfg.cTheme.pl_col_row_title_hovered);
			pl.col.row_rating_color = HEXtoRGB(grCfg.cTheme.pl_col_row_rating_color);
			pl.col.row_disc_subheader_line = HEXtoRGB(grCfg.cTheme.pl_col_row_disc_subheader_line);
			pl.col.row_drag_line = HEXtoRGB(grCfg.cTheme.pl_col_row_drag_line);
			pl.col.row_drag_line_reached = HEXtoRGB(grCfg.cTheme.pl_col_row_drag_line_reached);

			// * SCROLLBAR COLORS * //
			pl.col.sbar_btn_normal = HEXtoRGB(grCfg.cTheme.pl_col_sbar_btn_normal);
			pl.col.sbar_btn_hovered = HEXtoRGB(grCfg.cTheme.pl_col_sbar_btn_hovered);
			pl.col.sbar_thumb_normal = HEXtoRGB(grCfg.cTheme.pl_col_sbar_thumb_normal);
			pl.col.sbar_thumb_hovered = HEXtoRGB(grCfg.cTheme.pl_col_sbar_thumb_hovered);
			pl.col.sbar_thumb_drag = HEXtoRGB(grCfg.cTheme.pl_col_sbar_thumb_drag);
		}
		catch (e) {
			const msg = grm.msg.getMessage('themeColors', 'playlistColorsCustomTheme');
			fb.ShowPopupMessage(msg, 'Playlist custom theme color error');
		}
	}

	/**
	 * The Library colors for Custom theme used in Options > Theme > Custom.
	 */
	libraryColorsCustomTheme() {
		try {
			// * MAIN COLORS * //
			lib.ui.col.bg = this.ALT ? ShadeColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_bg), 5) : this.ALT2 ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_bg), 5) : HEXtoRGB(grCfg.cTheme.lib_ui_col_bg);
			lib.ui.col.rowStripes = this.BLEND ? HEXtoRGBA(grCfg.cTheme.lib_ui_col_rowStripes, 130) : HEXtoRGB(grCfg.cTheme.lib_ui_col_rowStripes);

			// * ROW COLORS * //
			lib.ui.col.nowPlayingBg = this.BLEND ? HEXtoRGBA(grCfg.cTheme.lib_ui_col_nowPlayingBg, 130) : HEXtoRGB(grCfg.cTheme.lib_ui_col_nowPlayingBg);
			lib.ui.col.sideMarker = HEXtoRGB(grCfg.cTheme.lib_ui_col_sideMarker);
			lib.ui.col.selectionFrame = HEXtoRGB(grCfg.cTheme.lib_ui_col_selectionFrame);
			lib.ui.col.selectionFrame2 = HEXtoRGB(grCfg.cTheme.lib_ui_col_selectionFrame2);
			lib.ui.col.hoverFrame = HEXtoRGB(grCfg.cTheme.lib_ui_col_hoverFrame);

			// * NODE COLORS * //
			lib.ui.col.iconPlus = this.BLEND ? ShadeColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_iconPlus), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_iconPlus);
			lib.ui.col.iconPlus_h = HEXtoRGB(grCfg.cTheme.lib_ui_col_iconPlus_h);
			lib.ui.col.iconPlus_sel = HEXtoRGB(grCfg.cTheme.lib_ui_col_iconPlus_sel);
			lib.ui.col.iconPlusBg = HEXtoRGB(grCfg.cTheme.lib_ui_col_iconPlusBg);
			lib.ui.col.iconMinus_e = this.BLEND ? ShadeColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_iconMinus_e), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_iconMinus_e);
			lib.ui.col.iconMinus_c = HEXtoRGB(grCfg.cTheme.lib_ui_col_iconMinus_c);
			lib.ui.col.iconMinus_h = HEXtoRGB(grCfg.cTheme.lib_ui_col_iconMinus_h);

			// * TEXT COLORS * //
			lib.ui.col.text = libSet.albumArtShow && libImg.labels.overlayDark ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_text), 40) : this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_text), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_text);
			lib.ui.col.text_h = libSet.albumArtShow && libImg.labels.overlayDark ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_text), 40) : HEXtoRGB(grCfg.cTheme.lib_ui_col_text_h);
			lib.ui.col.text_nowp = HEXtoRGB(grCfg.cTheme.lib_ui_col_text_nowp);
			lib.ui.col.textSel = libSet.albumArtShow && libSet.albumArtLabelType === 1 ? lib.ui.col.text_nowp : HEXtoRGB(grCfg.cTheme.lib_ui_col_textSel);
			lib.ui.col.txt = HEXtoRGB(grCfg.cTheme.lib_ui_col_txt);
			lib.ui.col.txt_h = HEXtoRGB(grCfg.cTheme.lib_ui_col_txt_h);
			lib.ui.col.txt_box = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_txt_box), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_txt_box);
			lib.ui.col.search = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_search), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_search);

			// * BUTTON COLORS * //
			lib.ui.col.searchBtn = HEXtoRGB(grCfg.cTheme.lib_ui_col_searchBtn);
			lib.ui.col.crossBtn = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_crossBtn), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_crossBtn);
			lib.ui.col.filterBtn = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_filterBtn), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_filterBtn);
			lib.ui.col.settingsBtn = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.lib_ui_col_settingsBtn), 10) : HEXtoRGB(grCfg.cTheme.lib_ui_col_settingsBtn);
			lib.ui.col.line = HEXtoRGB(grCfg.cTheme.lib_ui_col_line);
			lib.ui.col.s_line = HEXtoRGB(grCfg.cTheme.lib_ui_col_s_line);

			// * SCROLLBAR COLORS * //
			lib.ui.col.sbarBtns = HEXtoRGB(grCfg.cTheme.lib_ui_col_sbarBtns);
			lib.ui.col.sbarNormal = HEXtoRGB(grCfg.cTheme.lib_ui_col_sbarNormal);
			lib.ui.col.sbarHovered = HEXtoRGB(grCfg.cTheme.lib_ui_col_sbarHovered);
			lib.ui.col.sbarDrag = HEXtoRGB(grCfg.cTheme.lib_ui_col_sbarDrag);
		}
		catch (e) {
			const msg = grm.msg.getMessage('themeColors', 'libraryColorsCustomTheme');
			fb.ShowPopupMessage(msg, 'Library custom theme color error');
		}
	}

	/**
	 * The Biography colors for Custom theme used in Options > Theme > Custom.
	 */
	biographyColorsCustomTheme() {
		try {
			// * MAIN COLORS * //
			bio.ui.col.bg = this.ALT ? ShadeColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_bg), 5) : this.ALT2 ? TintColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_bg), 5) : HEXtoRGB(grCfg.cTheme.bio_ui_col_bg);
			bio.ui.col.rowStripes = this.BLEND ? HEXtoRGBA(grCfg.cTheme.bio_ui_col_rowStripes, 130) : HEXtoRGB(grCfg.cTheme.bio_ui_col_rowStripes);

			// * HEADER COLORS * //
			bio.ui.col.headingText = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_headingText), 10) : HEXtoRGB(grCfg.cTheme.bio_ui_col_headingText);
			bio.ui.col.bottomLine = (bio.ui.blur.blend || bio.ui.blur.light) ? ShadeColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_bottomLine), 25) : HEXtoRGB(grCfg.cTheme.bio_ui_col_bottomLine);
			bio.ui.col.centerLine = HEXtoRGB(grCfg.cTheme.bio_ui_col_centerLine);
			bio.ui.col.sectionLine = HEXtoRGB(grCfg.cTheme.bio_ui_col_sectionLine);

			// * TEXT COLORS * //
			bio.ui.col.text = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_text), 10) : HEXtoRGB(grCfg.cTheme.bio_ui_col_text);
			bio.ui.col.source = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_source), 10) : HEXtoRGB(grCfg.cTheme.bio_ui_col_source);
			bio.ui.col.accent = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_accent), 10) : HEXtoRGB(grCfg.cTheme.bio_ui_col_accent);
			bio.ui.col.summary = this.BLEND ? TintColor(HEXtoRGB(grCfg.cTheme.bio_ui_col_summary), 10) : HEXtoRGB(grCfg.cTheme.bio_ui_col_summary);

			// * POPUP COLORS * //
			bio.ui.col.popupBg = HEXtoRGB(grCfg.cTheme.grCol_popupBg);
			bio.ui.col.popupText = HEXtoRGB(grCfg.cTheme.grCol_popupText);

			// * MISC COLORS * //
			bio.ui.col.lyricsNormal = HEXtoRGB(grCfg.cTheme.bio_ui_col_lyricsNormal);
			bio.ui.col.lyricsHighlight = HEXtoRGB(grCfg.cTheme.bio_ui_col_lyricsHighlight);
			bio.ui.col.noPhotoStubBg = HEXtoRGB(grCfg.cTheme.bio_ui_col_noPhotoStubBg);
			bio.ui.col.noPhotoStubText = HEXtoRGB(grCfg.cTheme.bio_ui_col_noPhotoStubText);

			// * SCROLLBAR COLORS * //
			bio.ui.col.sbarBtns = HEXtoRGB(grCfg.cTheme.bio_ui_col_sbarBtns);
			bio.ui.col.sbarNormal = HEXtoRGB(grCfg.cTheme.bio_ui_col_sbarNormal);
			bio.ui.col.sbarHovered = HEXtoRGB(grCfg.cTheme.bio_ui_col_sbarHovered);
			bio.ui.col.sbarDrag = HEXtoRGB(grCfg.cTheme.bio_ui_col_sbarDrag);
		}
		catch (e) {
			const msg = grm.msg.getMessage('themeColors', 'biographyColorsCustomTheme');
			fb.ShowPopupMessage(msg, 'Biography custom theme color error');
		}
	}

	/**
	 * The Main colors for Custom theme used in Options > Theme > Custom.
	 */
	mainColorsCustomTheme() {
		try {
			const lightImg = grCol.imgBrightness > 180;
			const lightBg = Color.BRT(HEXtoRGB(grCfg.cTheme.grCol_bg)) > 200;
			const darkBg = Color.BRT(HEXtoRGB(grCfg.cTheme.grCol_bg)) < 50;

			// * MAIN COLORS * //
			grCol.bg = this.BEVEL ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_bg), grCol.lightBgMain ? 80 : 0) : HEXtoRGB(grCfg.cTheme.grCol_bg);
			grCol.loadingThemeBg = this.NIGHTTIME && grCfg.cTheme.grCol_preloaderBg === '' ? RGB(25, 25, 25) : grCfg.cTheme.grCol_preloaderBg !== '' ? HEXtoRGB(grCfg.cTheme.grCol_preloaderBg) : RGB(245, 245, 245);
			grCol.uiHacksFrame = this.NIGHTTIME ? RGB(25, 25, 25) : grCol.bg;
			grCol.shadow = HEXtoRGBA(grCfg.cTheme.grCol_shadow, grCol.lightBgMain ? 50 : 75);
			grCol.discArtShadow = HEXtoRGBA(grCfg.cTheme.grCol_discArtShadow, grCol.lightBgMain ? 50 : 75);
			grCol.noAlbumArtStub = HEXtoRGB(grCfg.cTheme.grCol_noAlbumArtStub);
			grCol.lowerBarArtist = this.BLEND12 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_lowerBarArtist), 10) : HEXtoRGB(grCfg.cTheme.grCol_lowerBarArtist);
			grCol.lowerBarTitle = this.BLEND12 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_lowerBarTitle), 10) : HEXtoRGB(grCfg.cTheme.grCol_lowerBarTitle);
			grCol.lowerBarTime = HEXtoRGB(grCfg.cTheme.grCol_lowerBarTime);
			grCol.lowerBarLength = HEXtoRGB(grCfg.cTheme.grCol_lowerBarLength);
			grCol.lyricsNormal = HEXtoRGB(grCfg.cTheme.grCol_lyricsNormal);
			grCol.lyricsHighlight = HEXtoRGB(grCfg.cTheme.grCol_lyricsHighlight);
			grCol.lyricsShadow = HEXtoRGB(grCfg.cTheme.grCol_lyricsShadow);

			// * DETAILS COLORS * //
			grCol.detailsBg = HEXtoRGB(grCfg.cTheme.grCol_detailsBg);
			grCol.detailsText = HEXtoRGB(grCfg.cTheme.grCol_detailsText);
			grCol.detailsRating = HEXtoRGB(grCfg.cTheme.grCol_detailsRating);
			grCol.detailsHotness = grCol.detailsRating;

			grCol.timelineAdded =
				grm.ui.isStreaming ? RGB(207, 0, 5) :
				grCol.lightBgDetails ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_timelinePlayed), this.BLEND ? 35 : 0) :
				HEXtoRGB(grCfg.cTheme.grCol_timelineAdded);

			grCol.timelinePlayed =
				grm.ui.isStreaming ? RGB(207, 0, 5) :
				grCol.lightBgDetails ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_timelinePlayed), this.BLEND ? 35 : 0) :
				HEXtoRGB(grCfg.cTheme.grCol_timelinePlayed);

			grCol.timelineUnplayed =
				grm.ui.isStreaming ? RGB(207, 0, 5) :
				grCol.lightBgDetails ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_timelineUnplayed), this.BLEND ? 20 : 0) :
				HEXtoRGB(grCfg.cTheme.grCol_timelineUnplayed);

			grCol.timelineFrame = HEXtoRGB(grCfg.cTheme.grCol_timelineFrame);
			if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

			// * POPUP COLORS * //
			grCol.popupBg = HEXtoRGB(grCfg.cTheme.grCol_popupBg);
			grCol.popupText = HEXtoRGB(grCfg.cTheme.grCol_popupText);

			// * TOP MENU BUTTON COLORS * //
			grCol.menuBgColor =
				this.BLEND12 ?
					grCol.lightBgMain ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_menuBgColor), 10) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuBgColor), 10) :
				HEXtoRGB(grCfg.cTheme.grCol_menuBgColor);

			grCol.menuStyleBg =
				this.TMB === 'bevel' || this.TMB === 'inner' ?
					this.BEVEL ? grCol.lightBgMain ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_menuStyleBg), 10) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuStyleBg), 10) : HEXtoRGB(grCfg.cTheme.grCol_menuStyleBg) :
				this.TMB === 'emboss' ?
					grCol.lightBgMain ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_menuStyleBg), 10) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuStyleBg), 10) : '';

			grCol.menuRectStyleEmbossTop = HEXtoRGB(grCfg.cTheme.grCol_menuRectStyleEmbossTop);
			grCol.menuRectStyleEmbossBottom = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectStyleEmbossBottom), 10) : HEXtoRGB(grCfg.cTheme.grCol_menuRectStyleEmbossBottom);

			grCol.menuRectNormal =
				this.BLEND12 ? this.BEVEL ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectNormal), 10) : HEXtoRGB(grCfg.cTheme.grCol_menuRectNormal) :
				this.ALT2 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectNormal), 10) :
				HEXtoRGB(grCfg.cTheme.grCol_menuRectNormal);

			grCol.menuRectHovered =
				this.TMB === 'bevel' || this.TMB === 'inner' ?
					this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectHovered), 15) : ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectHovered), 5) :
				this.BLEND12 ?
					this.BEVEL ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectHovered), 10) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectHovered), 5) :
				this.ALT2 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuRectHovered), 10) :
				HEXtoRGB(grCfg.cTheme.grCol_menuRectHovered);

			grCol.menuRectDown = HEXtoRGB(grCfg.cTheme.grCol_menuRectDown);
			grCol.menuTextNormal = this.BLEND12 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_menuTextNormal), 10) : HEXtoRGB(grCfg.cTheme.grCol_menuTextNormal);
			grCol.menuTextHovered = HEXtoRGB(grCfg.cTheme.grCol_menuTextHovered);
			grCol.menuTextDown = HEXtoRGB(grCfg.cTheme.grCol_menuTextDown);

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			grCol.transportEllipseBg =
				this.BLEND12 ?
					lightImg || grCol.lightBgMain ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseBg), 5) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseBg), 10) :
				darkBg && this.TPB === 'emboss' ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseBg), 15) : HEXtoRGB(grCfg.cTheme.grCol_transportEllipseBg);

			grCol.transportEllipseNormal =
				this.BLEND12 ?
					this.BEVEL ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseNormal), 5) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseNormal), 10) :
				HEXtoRGB(grCfg.cTheme.grCol_transportEllipseNormal);

			grCol.transportEllipseHovered =
				this.BLEND12 ?
					this.BEVEL ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseHovered), 5) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportEllipseHovered), 10) :
				HEXtoRGB(grCfg.cTheme.grCol_transportEllipseHovered);

			grCol.transportEllipseDown = HEXtoRGB(grCfg.cTheme.grCol_transportEllipseDown);

			grCol.transportStyleBg =
				this.TPB === 'bevel' || this.TPB === 'inner' ?
					ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleBg), 0) :
				this.TPB === 'emboss' ?
				this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleBottom), 5) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleBg), 0) : '';

			grCol.transportStyleTop =
				this.TPB === 'bevel' || this.TPB === 'inner' ?
					TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleTop), 0) :
				this.TPB === 'emboss' ?
					lightImg || grCol.lightBgMain ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleTop), 0) :
					TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleTop), 15) : '';

			grCol.transportStyleBottom =
				this.TPB === 'bevel' || this.TPB === 'inner' ?
					ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleBottom), 0) :
				this.TPB === 'emboss' ?
					darkBg ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleBottom), 20) :
					TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportStyleBottom), 10) : '';

			grCol.transportIconNormal =
				this.BLEND12 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportIconNormal), 10) : HEXtoRGB(grCfg.cTheme.grCol_transportIconNormal);

			grCol.transportIconHovered =
				this.BLEND12 ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_transportIconHovered), 10) : HEXtoRGB(grCfg.cTheme.grCol_transportIconHovered);

			grCol.transportIconDown = HEXtoRGB(grCfg.cTheme.grCol_transportIconDown);

			// * PROGRESS BAR COLORS * //
			grCol.progressBar =
				this.PB === 'bevel' ?
					this.BLEND12 ? lightImg || grCol.lightBgMain ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 5) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 10) :
					this.BEVEL ? HEXtoRGB(grCfg.cTheme.grCol_progressBar) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 10) :
				this.PB === 'inner' ?
					this.BLEND12 ? lightImg || grCol.lightBgMain ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 10) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 5) :
					this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 5) : HEXtoRGB(grCfg.cTheme.grCol_progressBar) :
				this.BLEND12 ? grCol.lightBgMain ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 10) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 5) :
				this.BEVEL ? grCol.lightBgMain ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 5) : TintColor(HEXtoRGB(grCfg.cTheme.grCol_progressBar), 5) :
				HEXtoRGB(grCfg.cTheme.grCol_progressBar);

			grCol.progressBarStreaming = HEXtoRGB(grCfg.cTheme.grCol_progressBarStreaming);
			grCol.progressBarFrame = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_progressBarFrame), 5) : HEXtoRGB(grCfg.cTheme.grCol_progressBarFrame);
			grCol.progressBarFill = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_progressBarFill), 5) : HEXtoRGB(grCfg.cTheme.grCol_progressBarFill);

			// * PEAKMETER BAR COLORS * //
			grCol.peakmeterBarProg          = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarProg), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarProg);
			grCol.peakmeterBarProgFill      = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarProgFill), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarProgFill);
			grCol.peakmeterBarFillTop       = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarFillTop), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarFillTop);
			grCol.peakmeterBarFillMiddle    = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarFillMiddle), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarFillMiddle);
			grCol.peakmeterBarFillBack      = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarFillBack), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarFillBack);
			grCol.peakmeterBarVertProgFill  = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarVertProgFill), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarVertProgFill);
			grCol.peakmeterBarVertFill      = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarVertFill), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarVertFill);
			grCol.peakmeterBarVertFillPeaks = this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarVertFillPeaks), 5) : HEXtoRGB(grCfg.cTheme.grCol_peakmeterBarVertFillPeaks);
			if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

			// * WAVEFORM BAR COLORS * //
			grCol.waveformBarFillFront    = lightBg && (this.BEVEL || this.BLEND) ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillFront), 5) : HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillFront);
			grCol.waveformBarFillBack     = lightBg && (this.BEVEL || this.BLEND) ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillBack), 5) : HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillBack);
			grCol.waveformBarFillPreFront = lightBg && (this.BEVEL || this.BLEND) ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillPreFront), 10) : HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillPreFront);
			grCol.waveformBarFillPreBack  = lightBg && (this.BEVEL || this.BLEND) ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillPreBack), 5) : HEXtoRGB(grCfg.cTheme.grCol_waveformBarFillPreBack);
			grCol.waveformBarIndicator    = HEXtoRGB(grCfg.cTheme.grCol_waveformBarIndicator);

			// * VOLUME BAR COLORS * //
			grCol.volumeBar = HEXtoRGB(grCfg.cTheme.grCol_volumeBar);

			grCol.volumeBarFrame =
				this.VB === 'bevel' || this.VB === 'inner' ? TintColor(HEXtoRGB(grCfg.cTheme.grCol_volumeBarFrame), 5) :
				HEXtoRGB(grCfg.cTheme.grCol_volumeBarFrame);

			grCol.volumeBarFill = HEXtoRGB(grCfg.cTheme.grCol_volumeBarFill);

			// * STYLE COLORS * //
			grCol.styleBevel = HEXtoRGB(grCfg.cTheme.grCol_styleBevel);
			grCol.styleGradient = HEXtoRGB(grCfg.cTheme.grCol_styleGradient);
			grCol.styleGradient2 = HEXtoRGB(grCfg.cTheme.grCol_styleGradient2);

			grCol.styleProgressBar =
				this.PB === 'bevel' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBar), lightBg ? 5 : 10) : HEXtoRGB(grCfg.cTheme.grCol_styleProgressBar) :
				this.PB === 'inner' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBar), lightBg ? 5 : 10) : HEXtoRGB(grCfg.cTheme.grCol_styleProgressBar) : '';

			grCol.styleProgressBarLineTop =
				this.PB === 'bevel' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineTop), darkBg ? 40 : lightBg ? 0 : 10) : HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineTop) :
				this.PB === 'inner' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineTop), darkBg ? 20 : lightBg ? 5 : 10) : HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineTop) : '';

			grCol.styleProgressBarLineBottom =
				this.PB === 'bevel' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineBottom), darkBg ? 30 : lightBg ? 30 : 20) : HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineBottom) :
				this.PB === 'inner' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineBottom), darkBg ? 25 : lightBg ? 15 : 20) : HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarLineBottom) : '';

			grCol.styleProgressBarFill =
				this.PBF === 'bevel' || this.PBF === 'inner' ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarFill), 15) :
				HEXtoRGB(grCfg.cTheme.grCol_styleProgressBarFill);

			grCol.styleVolumeBar =
				this.VB === 'bevel' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleVolumeBar), 10) : HEXtoRGB(grCfg.cTheme.grCol_styleVolumeBar) :
				this.VB === 'inner' ? this.BEVEL ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleVolumeBar), 10) : HEXtoRGB(grCfg.cTheme.grCol_styleVolumeBar) : '';

			grCol.styleVolumeBarFill =
				this.VBF === 'bevel' || this.VBF === 'inner' ? ShadeColor(HEXtoRGB(grCfg.cTheme.grCol_styleVolumeBarFill), 15) :
				HEXtoRGB(grCfg.cTheme.grCol_styleVolumeBarFill);
		}
		catch (e) {
			const msg = grm.msg.getMessage('themeColors', 'mainColorsCustomTheme');
			fb.ShowPopupMessage(msg, 'Main custom theme color error');
		}
	}
	// #endregion

	// * PUBLIC METHODS - WHITE PANEL AND MAIN COLORS * //
	// #region PUBLIC METHODS - WHITE PANEL AND MAIN COLORS
	/**
	 * Mainly used for style Black and white 2 or theme color adjustments for style Reborn fusion 1 and 2 when panel bg is too light.
	 * @param {boolean} lighterBg - If true, lightens the panel background color.
	 * @param {object} [accentColor] - If provided, the RGB color object to be used as the accent color.
	 */
	panelWhiteColors(lighterBg, accentColor) {
		// * PLAYLIST COLORS * //
		pl.col.bg = lighterBg ? RGB(255, 255, 255) : RGB(245, 245, 245);
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(180, 180, 180);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(100, 100, 100) : RGB(240, 240, 240);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(100, 100, 100) : RGB(180, 180, 180);
		pl.col.header_nowplaying_bg = this.BLEND ? lighterBg ? RGBA(245, 245, 245, 130) : RGBA(255, 255, 255, 130) : lighterBg ? RGB(245, 245, 245) : RGB(255, 255, 255);
		pl.col.header_sideMarker = grm.ui.isStreaming ? RGB(207, 0, 5) : accentColor || RGB(40, 40, 40);
		pl.col.header_artist_normal = RGB(80, 80, 80);
		pl.col.header_artist_playing = RGB(60, 60, 60);
		pl.col.header_album_normal = RGB(80, 80, 80);
		pl.col.header_album_playing = RGB(60, 60, 60);
		pl.col.header_info_normal = RGB(60, 60, 60);
		pl.col.header_info_playing = RGB(60, 60, 60);
		pl.col.header_date_normal = RGB(60, 60, 60);
		pl.col.header_date_playing = RGB(60, 60, 60);
		pl.col.header_line_normal = this.BLEND ? RGB(190, 190, 190) : RGB(215, 215, 215);
		pl.col.header_line_playing = this.BLEND ? RGB(200, 200, 200) : RGB(215, 215, 215);
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
		pl.col.row_selection_bg = this.BLEND ? RGB(190, 190, 190) : RGB(215, 215, 215);
		pl.col.row_selection_frame = this.BLEND ? RGB(190, 190, 190) : pl.col.row_selection_bg;
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(80, 80, 80);
		pl.col.row_title_playing = RGB(60, 60, 60);
		pl.col.row_title_selected = RGB(0, 0, 0);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = this.BLEND ? RGB(190, 190, 190) : RGB(215, 215, 215);
		pl.col.row_drag_line = ShadeColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;
		pl.col.sbar_btn_normal = RGB(100, 100, 100);
		pl.col.sbar_btn_hovered = RGB(0, 0, 0);
		pl.col.sbar_thumb_normal = RGB(100, 100, 100);
		pl.col.sbar_thumb_hovered = RGB(40, 40, 40);
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;

		// * LIBRARY COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = grm.ui.isStreaming ? RGB(207, 0, 5) : accentColor || RGB(40, 40, 40);
		lib.ui.col.selectionFrame = this.BLEND ? RGB(190, 190, 190) : RGB(215, 215, 215);
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;
		lib.ui.col.iconPlus = RGB(80, 80, 80);
		lib.ui.col.iconPlus_h = RGB(0, 0, 0);
		lib.ui.col.iconPlus_sel = RGB(0, 0, 0);
		lib.ui.col.iconPlusBg = grSet.libraryDesign === 'traditional' ? RGB(255, 255, 255) : RGB(45, 45, 45);
		lib.ui.col.iconMinus_e = RGB(80, 80, 80);
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(0, 0, 0);
		lib.ui.col.text = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(220, 220, 220) : RGB(80, 80, 80);
		lib.ui.col.text_h = libSet.albumArtShow && libImg.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.text_nowp = RGB(0, 0, 0);
		lib.ui.col.textSel = RGB(0, 0, 0);
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(80, 80, 80);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(80, 80, 80);
		lib.ui.col.searchBtn = RGB(0, 0, 0);
		lib.ui.col.crossBtn = RGB(0, 0, 0);
		lib.ui.col.filterBtn = RGB(80, 80, 80);
		lib.ui.col.settingsBtn = RGB(80, 80, 80);
		lib.ui.col.line = this.BLEND ? RGB(190, 190, 190) : RGB(215, 215, 215);
		lib.ui.col.s_line = lib.ui.col.line;
		lib.ui.col.sbarBtns = RGB(60, 60, 60);
		lib.ui.col.sbarNormal = RGB(0, 0, 0);
		lib.ui.col.sbarHovered = RGB(40, 40, 40);
		lib.ui.col.sbarDrag = RGB(40, 40, 40);

		// * BIOGRAPHY COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.headingText = RGB(60, 60, 60);
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;
		bio.ui.col.sbarBtns = RGB(60, 60, 60);
		bio.ui.col.sbarNormal = RGB(0, 0, 0);
		bio.ui.col.sbarHovered = RGB(40, 40, 40);
		bio.ui.col.sbarDrag = RGB(40, 40, 40);
		bio.ui.col.noPhotoStubBg = RGB(25, 25, 25);
		bio.ui.col.noPhotoStubText = this.THEME === 'cream' ? RGB(120, 170, 130) : pl.col.header_artist_playing;

		// * DETAILS COLORS * //
		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = RGB(60, 60, 60);
		grCol.timelineAdded = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
		grCol.timelinePlayed = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(80, 80, 80);
		grCol.timelineUnplayed = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(120, 120, 120);
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = pl.col.row_nowplaying_bg;
		grCol.popupText = pl.col.row_title_playing;
	}

	/**
	 * Mainly used for style Black and white 1 or theme color adjustments for style Reborn fusion 1 and 2 when main bg is too light.
	 * @param {boolean} lighterBg - If true, lightens the main background color.
	 */
	mainWhiteColors(lighterBg) {
		// * MAIN COLORS * //
		grCol.bg = lighterBg || this.BEVEL ? RGB(255, 255, 255) : RGB(230, 230, 230);
		grCol.loadingThemeBg = grCol.bg;
		grCol.uiHacksFrame = grCol.bg;
		grCol.noAlbumArtStub = RGB(255, 255, 255);
		grCol.lowerBarArtist = RGB(80, 80, 80);
		grCol.lowerBarTitle = RGB(80, 80, 80);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor = RGB(255, 255, 255);

		grCol.menuStyleBg =
			this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(210, 210, 210) :
			this.TMB === 'emboss' ? RGB(235, 235, 235) :
			this.BEVEL ? RGB(205, 205, 205) : RGB(220, 220, 220);

		grCol.menuRectStyleEmbossTop = RGB(255, 255, 255);
		grCol.menuRectStyleEmbossBottom = this.BEVEL ? RGB(200, 200, 200) : RGB(195, 195, 195);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGB(200, 200, 200) :
			this.BLEND12 ? this.BEVEL ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			this.BEVEL ? RGB(170, 170, 170) : RGB(180, 180, 180);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGB(200, 200, 200) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(200, 200, 200) : RGB(205, 205, 205) :
			this.BLEND12 ? this.BEVEL ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			this.BEVEL ? RGB(170, 170, 170) : RGB(180, 180, 180);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = RGB(80, 80, 80);
		grCol.menuTextHovered = RGB(40, 40, 40);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = this.BLEND12 && fb.IsPlaying ? RGB(230, 230, 230) : RGB(255, 255, 255);
		grCol.transportEllipseNormal =  this.BLEND12 ? this.BEVEL ? RGB(200, 200, 200) : RGB(210, 210, 210) : RGB(220, 220, 220);
		grCol.transportEllipseHovered = this.BLEND12 ? this.BEVEL ? RGB(160, 160, 160) : RGB(170, 170, 170) : RGB(180, 180, 180);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel'  ? this.BEVEL ? RGB(200, 200, 200) : RGB(205, 205, 205) :
			this.TPB === 'inner'  ? this.BEVEL ? RGB(215, 215, 215) : RGB(205, 205, 205) :
			this.TPB === 'emboss' ? this.BEVEL ? RGB(230, 230, 230) : RGB(215, 215, 215) :
			RGB(225, 225, 225);

		grCol.transportStyleTop = RGB(255, 255, 255);

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ?
				this.BLEND12 ? RGB(180, 180, 180) : this.BEVEL ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			this.TPB === 'emboss' ?
				this.BLEND12 ? RGB(180, 180, 180) : this.BEVEL ? RGB(215, 215, 215) : RGB(210, 210, 210) :
			RGB(230, 230, 230);

		// * PROGRESS BAR COLORS * //
		grCol.progressBar =
			this.BLEND12 ? this.BEVEL ? RGB(205, 205, 205) : RGB(215, 215, 215) :
			this.BEVEL ? RGB(195, 195, 195) : RGB(210, 210, 210);

		grCol.progressBarFill = RGB(255, 255, 255);

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = RGB(20, 20, 20);
		grCol.peakmeterBarFillTop       = RGB(140, 140, 140);
		grCol.peakmeterBarFillMiddle    = RGB(20, 20, 20);
		grCol.peakmeterBarFillBack      = RGB(80, 80, 80);
		grCol.peakmeterBarVertProgFill  = RGB(20, 20, 20);
		grCol.peakmeterBarVertFill      = RGB(20, 20, 20);
		grCol.peakmeterBarVertFillPeaks = RGB(120, 120, 120);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = RGB(120, 120, 120);
		grCol.waveformBarFillBack     = RGB(20, 20, 20);
		grCol.waveformBarFillPreFront = RGB(160, 160, 160);
		grCol.waveformBarFillPreBack  = RGB(120, 120, 120);
		grCol.waveformBarIndicator    = RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(255, 255, 255);
		grCol.volumeBarFill = RGB(120, 120, 120);
		grCol.volumeBarFrame = RGB(210, 210, 210);

		// * STYLE COLORS * //
		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			this.PB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 35) : RGBA(0, 0, 0, 40) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? RGBA(0, 0, 0, 40) :
											  this.BEVEL ? RGBA(255, 255, 255, 20) : RGBA(0, 0, 0, 0) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? RGBA(0, 0, 0, 50) :
				RGBA(0, 0, 0, 20) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 180) : RGBA(255, 255, 255, 255) :
														   this.BEVEL ? RGBA(255, 255, 255, 160) : RGBA(255, 255, 255, 220) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 150) : RGBA(255, 255, 255, 255) :
														   this.BEVEL ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 170) : '';

		grCol.styleProgressBarFill =
			this.PBF === 'bevel' ? RGBA(0, 0, 0, this.BEVEL ? 40 : 30) :
			this.PBF === 'inner' ? RGBA(0, 0, 0, this.BEVEL ? 50 : 40) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 30) :
			this.VB === 'inner' ? RGBA(0, 0, 0, 30) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(255, 255, 255, 90) : '';
	}
	// #endregion

	// * PUBLIC METHODS - BLACK PANEL AND MAIN COLORS * //
	// #region PUBLIC METHODS - BLACK PANEL AND MAIN COLORS
	/**
	 * Mainly used for style Black and white 1 or theme color adjustments for style Reborn fusion 1 and 2 when panel bg is too dark.
	 * @param {boolean} darkerBg - If true, darkens the panel background color.
	 * @param {object} [accentColor] - If provided, the RGB color object to be used as the accent color.
	 */
	panelBlackColors(darkerBg, accentColor) {
		// * PLAYLIST COLORS * //
		pl.col.bg = darkerBg ? RGB(0, 0, 0) : RGB(20, 20, 20);
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : RGB(180, 180, 180);
		pl.col.plman_text_hovered = grSet.autoHidePlman ? RGB(200, 200, 200) : RGB(240, 240, 240);
		pl.col.plman_text_pressed = grSet.autoHidePlman ? RGB(240, 240, 240) : RGB(180, 180, 180);
		pl.col.header_nowplaying_bg = this.BLEND ? RGBA(230, 230, 230, 200) : RGB(230, 230, 230);
		pl.col.header_sideMarker = grm.ui.isStreaming ? RGB(207, 0, 5) : accentColor || RGB(255, 255, 255);
		pl.col.header_artist_normal = RGB(220, 220, 220);
		pl.col.header_artist_playing = RGB(25, 25, 25);
		pl.col.header_album_normal = RGB(200, 200, 200);
		pl.col.header_album_playing = RGB(25, 25, 25);
		pl.col.header_info_normal = RGB(200, 200, 200);
		pl.col.header_info_playing = RGB(25, 25, 25);
		pl.col.header_date_normal = RGB(220, 220, 220);
		pl.col.header_date_playing = RGB(25, 25, 25);
		pl.col.header_line_normal = this.BLEND ? RGB(80, 80, 80) : RGB(45, 45, 45);
		pl.col.header_line_playing = RGB(25, 25, 25);
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_stripes_bg = this.BLEND ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
		pl.col.row_selection_bg = this.BLEND ? RGB(80, 80, 80) : RGB(45, 45, 45);
		pl.col.row_selection_frame = pl.col.row_selection_bg;
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		pl.col.row_title_normal = RGB(200, 200, 200);
		pl.col.row_title_playing = RGB(25, 25, 25);
		pl.col.row_title_selected = RGB(255, 255, 255);
		pl.col.row_title_hovered = pl.col.row_title_selected;
		pl.col.row_rating_color = RGB(255, 190, 0);
		pl.col.row_disc_subheader_line = this.BLEND ? RGB(80, 80, 80) : RGB(45, 45, 45);
		pl.col.row_drag_line = TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;
		pl.col.sbar_btn_normal = RGB(200, 200, 200);
		pl.col.sbar_btn_hovered = RGB(255, 255, 255);
		pl.col.sbar_thumb_normal = RGB(180, 180, 180);
		pl.col.sbar_thumb_hovered = RGB(255, 255, 255);
		pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;

		// * LIBRARY COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = grm.ui.isStreaming ? RGB(207, 0, 5) : accentColor || RGB(255, 255, 255);
		lib.ui.col.selectionFrame = this.BLEND ? RGB(80, 80, 80) : RGB(45, 45, 45);
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;
		lib.ui.col.iconPlus = RGB(220, 220, 220);
		lib.ui.col.iconPlus_h = RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = RGB(255, 255, 255);
		lib.ui.col.iconPlusBg = RGB(45, 45, 45);
		lib.ui.col.iconMinus_e = RGB(220, 220, 220);
		lib.ui.col.iconMinus_c = lib.ui.col.iconMinus_e;
		lib.ui.col.iconMinus_h = RGB(255, 255, 255);
		lib.ui.col.text = RGB(200, 200, 200);
		lib.ui.col.text_h = !libSet.albumArtShow || libSet.albumArtShow && libSet.highLightRow !== 2 ? RGB(255, 255, 255) : RGB(0, 0, 0);
		lib.ui.col.text_nowp = RGB(0, 0, 0);
		lib.ui.col.textSel =
			libSet.albumArtShow && !['coversLabelsRight', 'coversLabelsBottom', 'coversLabelsBlend'].includes(grSet.libraryDesign) ||
			grSet.libraryDesign === 'traditional' ? RGB(0, 0, 0) : RGB(255, 255, 255);
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = RGB(200, 200, 200);
		lib.ui.col.count = lib.ui.col.text;
		lib.ui.col.search = RGB(200, 200, 200);
		lib.ui.col.searchBtn = RGB(255, 255, 255);
		lib.ui.col.crossBtn = RGB(255, 255, 255);
		lib.ui.col.filterBtn = RGB(220, 220, 220);
		lib.ui.col.settingsBtn = RGB(220, 220, 220);
		lib.ui.col.line = this.BLEND ? RGB(80, 80, 80) : RGB(45, 45, 45);
		lib.ui.col.s_line = lib.ui.col.line;
		lib.ui.col.sbarBtns = RGB(200, 200, 200);
		lib.ui.col.sbarNormal = RGB(255, 255, 255);
		lib.ui.col.sbarHovered = RGB(255, 255, 255);
		lib.ui.col.sbarDrag = RGB(255, 255, 255);

		// * BIOGRAPHY COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.headingText = RGB(230, 230, 230);
		bio.ui.col.bottomLine = pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.text = pl.col.row_title_normal;
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;
		bio.ui.col.sbarBtns = RGB(200, 200, 200);
		bio.ui.col.sbarNormal = RGB(255, 255, 255);
		bio.ui.col.sbarHovered = RGB(255, 255, 255);
		bio.ui.col.sbarDrag = RGB(255, 255, 255);
		bio.ui.col.noPhotoStubBg = RGB(25, 25, 25);
		bio.ui.col.noPhotoStubText = this.THEME === 'cream' ? RGB(120, 170, 130) : pl.col.header_artist_playing;

		// * DETAILS COLORS * //
		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = RGB(220, 220, 220);
		grCol.timelineAdded = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(230, 230, 230);
		grCol.timelinePlayed = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(180, 180, 180);
		grCol.timelineUnplayed = grm.ui.isStreaming ? RGB(207, 0, 5) : RGB(160, 160, 160);
		grCol.timelineFrame = grCol.detailsBg;
		if (grm.details) grm.details.setGridTimelineColors(grCol.timelineAdded, grCol.timelinePlayed, grCol.timelineUnplayed);

		// * POPUP COLORS * //
		grCol.popupBg = pl.col.row_nowplaying_bg;
		grCol.popupText = pl.col.row_title_playing;
	}

	/**
	 * Mainly used for style Black and white 2 or theme color adjustments for style Reborn fusion 1 and 2 when main bg is too dark.
	 * @param {boolean} darkerBg - If true, darkens the main background color.
	 */
	mainBlackColors(darkerBg) {
		// * MAIN COLORS * //
		grCol.bg = this.BEVEL ? darkerBg ? RGB(25, 25, 25) : RGB(50, 50, 50) : darkerBg ? RGB(0, 0, 0) : RGB(25, 25, 25);
		grCol.loadingThemeBg = this.NIGHTTIME || this.BW2 ? RGB(25, 25, 25) : grCol.bg;
		grCol.uiHacksFrame = grCol.bg;
		grCol.shadow = grm.ui.isPlayingCD ? RGBA(0, 0, 0, 30) : grCol.shadow;
		grCol.noAlbumArtStub = this.NIGHTTIME ? RGB(240, 240, 240) : RGB(40, 40, 40);
		grCol.lowerBarArtist = RGB(240, 240, 240);
		grCol.lowerBarTitle = RGB(220, 220, 220);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;

		// * TOP MENU BUTTONS COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? this.BEVEL ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			this.TMB === 'inner'  ? this.BEVEL ? RGB(55, 55, 55) : RGB(50, 50, 50) :
			this.TMB === 'emboss' ? RGB(45, 45, 45) :
			RGB(35, 35, 35);

		grCol.menuStyleBg =
			this.TMB === 'inner'  ? RGB(20, 20, 20) :
			this.TMB === 'emboss' ? this.BEVEL ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			this.BEVEL ? RGB(30, 30, 30) : RGB(20, 20, 20);

		grCol.menuRectStyleEmbossTop = this.BEVEL ? RGB(60, 60, 60) : RGB(70, 70, 70);
		grCol.menuRectStyleEmbossBottom = RGB(0, 0, 0);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGBA(60, 60, 60, 100) :
			this.TMB === 'bevel'  ? RGB(0, 0, 0) :
			RGB(60, 60, 60);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(120, 120, 120, 100) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(0, 0, 0) :
			RGB(100, 100, 100);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = this.BLEND12 ? RGB(200, 200, 200) : RGB(180, 180, 180);
		grCol.menuTextHovered = RGB(255, 255, 255);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = this.BLEND12 ? RGB(60, 60, 60) : RGB(40, 40, 40);
		grCol.transportEllipseNormal = RGB(50, 50, 50);
		grCol.transportEllipseHovered = RGB(100, 100, 100);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(20, 20, 20) :
			this.TPB === 'emboss' ? RGB(50, 50, 50) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(50, 50, 50) :
			this.TPB === 'emboss' ? this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(10, 10, 10) :
			this.TPB === 'emboss' ? RGB(20, 20, 20) : '';

		grCol.transportIconNormal = RGB(200, 200, 200);
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = RGB(50, 50, 50);
		grCol.progressBarFill = RGB(210, 210, 210);

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = RGB(200, 200, 200);
		grCol.peakmeterBarFillTop       = RGB(120, 120, 120);
		grCol.peakmeterBarFillMiddle    = RGB(160, 160, 160);
		grCol.peakmeterBarFillBack      = RGB(80, 80, 80);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = RGB(245, 245, 245);
		grCol.peakmeterBarVertFillPeaks = RGB(200, 200, 200);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = RGB(245, 245, 245);
		grCol.waveformBarFillBack     = RGB(200, 200, 200);
		grCol.waveformBarFillPreFront = RGB(160, 160, 160);
		grCol.waveformBarFillPreBack  = RGB(120, 120, 120);
		grCol.waveformBarIndicator    = RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = grCol.progressBar;
		grCol.volumeBarFill = grCol.progressBarFill;
		grCol.volumeBarFrame = RGB(50, 50, 50);

		// * STYLE COLORS * //
		grCol.styleProgressBar =
			this.PB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			this.PB === 'inner' ? RGBA(0, 0, 0, 100) : '';

		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 60)  : RGBA(0, 0, 0, 255) :
				RGBA(0, 0, 0, 255) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
														   this.BEVEL ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 100) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 40) : RGBA(255, 255, 255, 30) :
														   this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 25) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 30) :
														   this.BEVEL ? RGBA(255, 255, 255, 45) : RGBA(255, 255, 255, 40) : '';

		grCol.styleProgressBarFill = this.PBF === 'bevel' || this.PBF === 'inner' ? RGBA(0, 0, 0, 70) : '';

		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 80) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 80) : '';
	}
	// #endregion

	// * PUBLIC METHODS - LIBRARY & BIOGRAPHY THEME COLORS * //
	// #region PUBLIC METHODS - LIBRARY & BIOGRAPHY THEME COLORS
	/**
	 * The Library theme colors used in Options > Library > Theme.
	 */
	libraryThemeColors() {
		// * SETUP COLORS * //
		const colBrightness = Color.BRT(lib.ui.col.bg);
		grCol.lightBgLib =
			libSet.theme === 1 && grCol.imgBrightness > 200
			||
			libSet.theme === 2 && (colBrightness > 150 || colBrightness > 75 && grCol.imgBrightness > 200)
			||
			libSet.theme === 3
			||
			libSet.theme === 5 && (colBrightness > 150);

		// * GET BLENDED BG IMAGE * //
		lib.ui.get = true;

		// * ROW COLORS * //
		lib.ui.col.selectionFrame = grCol.lightBgLib ? RGBA(0, 0, 0, 100) : RGBA(255, 255, 255, 100);

		// * NODE COLORS * //
		lib.ui.col.iconPlus = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.iconPlus_h = grCol.lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);
		lib.ui.col.iconPlus_sel = grCol.lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * TEXT COLORS * //
		lib.ui.col.text = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.text_h = grCol.lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);
		lib.ui.col.textSel = libSet.albumArtShow ? lib.ui.col.text_nowp : lib.ui.col.text;
		lib.ui.col.txt = lib.ui.col.text;
		lib.ui.col.txt_h = lib.ui.col.text_h;
		lib.ui.col.txt_box = grCol.lightBgLib ? RGB(40, 40, 40) : RGB(220, 220, 220);
		lib.ui.col.count = lib.ui.col.text;

		// * BUTTON COLORS * //
		lib.ui.col.search = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.searchBtn = grCol.lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);
		lib.ui.col.crossBtn = grCol.lightBgLib ? RGB(40, 40, 40) : RGB(255, 255, 255);
		lib.ui.col.filterBtn = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.settingsBtn = grCol.lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
		lib.ui.col.line = grCol.lightBgLib ? RGBA(0, 0, 0, 100) : RGBA(255, 255, 255, 100);
		lib.ui.col.s_line = lib.ui.col.line;
	}

	/**
	 * The Biography theme colors used in Options > Biography > Theme.
	 */
	biographyThemeColors() {
		// * SETUP COLORS * //
		const colBrightness = Color.BRT(bio.ui.col.bg);
		grCol.lightBgBio =
			bioSet.theme === 1 && grCol.imgBrightness > 200
			||
			bioSet.theme === 2 && (colBrightness > 150 || grCol.imgBrightness > 200)
			||
			bioSet.theme === 3
			||
			bioSet.theme === 4 && grCol.imgBrightness > 150;

		// * MAIN COLORS * //
		bio.ui.col.rowStripes = RGBtoRGBA(pl.col.row_stripes_bg, 100);

		// * HEADER COLORS * //
		bio.ui.col.headingText = grCol.lightBgBio ? RGB(65, 65, 65) : RGB(230, 230, 230);
		bio.ui.col.bottomLine = grCol.lightBgBio ? RGB(120, 120, 120) : pl.col.header_line_normal;
		bio.ui.col.centerLine = bio.ui.col.bottomLine;
		bio.ui.col.sectionLine = bio.ui.col.bottomLine;

		// * TEXT COLORS * //
		bio.ui.col.text = grCol.lightBgBio ? RGB(60, 60, 60) : RGB(220, 220, 220);
		bio.ui.col.source = bio.ui.col.headingText;
		bio.ui.col.accent = bio.ui.col.headingText;
		bio.ui.col.summary = bio.ui.col.text;
	}
	// #endregion

	// * PUBLIC METHODS - THEME COLOR INITIALIZATION * //
	// #region PUBLIC METHODS - THEME COLOR INITIALIZATION
	/**
	 * Init all colors that are used in the Playlist, mostly called from grm.ui.initTheme().
	 */
	initPlaylistColors() {
		const playlistColors = {
			white: this.playlistColorsWhiteTheme.bind(this),
			black: this.playlistColorsBlackTheme.bind(this),
			reborn: this.playlistColorsRebornRandomTheme.bind(this),
			random: this.playlistColorsRebornRandomTheme.bind(this),
			blue: this.playlistColorsBlueTheme.bind(this),
			darkblue: this.playlistColorsDarkblueTheme.bind(this),
			red: this.playlistColorsRedTheme.bind(this),
			cream: this.playlistColorsCreamTheme.bind(this),
			nblue: this.playlistColorsNeonThemes.bind(this),
			ngreen: this.playlistColorsNeonThemes.bind(this),
			nred: this.playlistColorsNeonThemes.bind(this),
			ngold: this.playlistColorsNeonThemes.bind(this)
		};

		if (playlistColors[this.THEME]) {
			playlistColors[this.THEME]();
		} else if (this.CTHEME) {
			this.playlistColorsCustomTheme();
		}
	}

	/**
	 * Init all colors that are used in the Library, mostly called from grm.ui.initTheme().
	 */
	initLibraryColors() {
		const libraryColors = {
			white: this.libraryColorsWhiteTheme.bind(this),
			black: this.libraryColorsBlackTheme.bind(this),
			reborn: this.libraryColorsRebornRandomTheme.bind(this),
			random: this.libraryColorsRebornRandomTheme.bind(this),
			blue: this.libraryColorsBlueTheme.bind(this),
			darkblue: this.libraryColorsDarkblueTheme.bind(this),
			red: this.libraryColorsRedTheme.bind(this),
			cream: this.libraryColorsCreamTheme.bind(this),
			nblue: this.libraryColorsNeonThemes.bind(this),
			ngreen: this.libraryColorsNeonThemes.bind(this),
			nred: this.libraryColorsNeonThemes.bind(this),
			ngold: this.libraryColorsNeonThemes.bind(this)
		};

		if (libraryColors[this.THEME]) {
			libraryColors[this.THEME]();
		} else if (this.CTHEME) {
			this.libraryColorsCustomTheme();
		}

		if (libSet.theme !== 0) this.libraryThemeColors();
	}

	/**
	 * Init all colors that are used in the Biography, mostly called from grm.ui.initTheme().
	 */
	initBiographyColors() {
		const biographyColors = {
			white: this.biographyColorsWhiteTheme.bind(this),
			black: this.biographyColorsBlackTheme.bind(this),
			reborn: this.biographyColorsRebornRandomTheme.bind(this),
			random: this.biographyColorsRebornRandomTheme.bind(this),
			blue: this.biographyColorsBlueTheme.bind(this),
			darkblue: this.biographyColorsDarkblueTheme.bind(this),
			red: this.biographyColorsRedTheme.bind(this),
			cream: this.biographyColorsCreamTheme.bind(this),
			nblue: this.biographyColorsNeonThemes.bind(this),
			ngreen: this.biographyColorsNeonThemes.bind(this),
			nred: this.biographyColorsNeonThemes.bind(this),
			ngold: this.biographyColorsNeonThemes.bind(this)
		};

		if (biographyColors[this.THEME]) {
			biographyColors[this.THEME]();
		} else if (this.CTHEME) {
			this.biographyColorsCustomTheme();
		}

		if (bioSet.theme !== 0) this.biographyThemeColors();
	}

	/**
	 * Init all colors that are used in Georgia-ReBORN main, mostly called from grm.ui.initTheme().
	 */
	initMainColors() {
		const mainColors = {
			white: this.mainColorsWhiteTheme.bind(this),
			black: this.mainColorsBlackTheme.bind(this),
			reborn: this.mainColorsRebornRandomTheme.bind(this),
			random: this.mainColorsRebornRandomTheme.bind(this),
			blue: this.mainColorsBlueTheme.bind(this),
			darkblue: this.mainColorsDarkblueTheme.bind(this),
			red: this.mainColorsRedTheme.bind(this),
			cream: this.mainColorsCreamTheme.bind(this),
			nblue: this.mainColorsNeonThemes.bind(this),
			ngreen: this.mainColorsNeonThemes.bind(this),
			nred: this.mainColorsNeonThemes.bind(this),
			ngold: this.mainColorsNeonThemes.bind(this)
		};

		if (mainColors[this.THEME]) {
			mainColors[this.THEME]();
		} else if (this.CTHEME) {
			this.mainColorsCustomTheme();
		}
	}

	/**
	 * Init all colors that are used in the chronflow user-component, mostly called from grm.ui.initTheme().
	 */
	initChronflowColors() {
		if (!Component.ChronFlow) return;
		try {
			const chron = new ActiveXObject('chron.IChronControl');
			if (chron) {
				let r_bg = 255;
				let g_bg = 255;
				let b_bg = 255;

				if (pl.col.bg !== RGB(255, 255, 255)) {
					const bg_rgb = Math.abs(pl.col.bg);

					r_bg = GetRed(bg_rgb);
					g_bg = GetGreen(bg_rgb);
					b_bg = GetBlue(bg_rgb);

					r_bg = 255 - r_bg;
					g_bg = 255 - g_bg;
					b_bg = 255 - b_bg;
				}
				else {
					r_bg = 255;
					g_bg = 255;
					b_bg = 255;
				}

				// * SetPanelColor
				const bg = (b_bg << 16) | (g_bg << 8) | r_bg;
				chron.SetPanelColor(bg, /*skip refresh*/ [0]);

				// * SetTextColor
				r_bg = GetRed(grCol.lowerBarArtist);
				g_bg = GetGreen(grCol.lowerBarArtist);
				b_bg = GetBlue(grCol.lowerBarArtist);

				let strhex = '0x';
				const rgbtohex = RGBtoHEX(b_bg, g_bg, r_bg);
				strhex = strhex.concat(rgbtohex);
				chron.SetTextColor(strhex, /*refresh*/ [1]);
			}
		}
		catch (e) {
			// DebugLog('Unable to create ActiveX chron.IChronControl object');
		}
	}
	// #endregion

	// * PUBLIC METHODS - THEME COLOR ADJUSTMENTS * //
	// #region PUBLIC METHODS - THEME COLOR ADJUSTMENTS
	/**
	 * Post init color adjustments, used for White, Black, Reborn and Random theme.
	 */
	themeColorAdjustments() {
		const cBRT = grCol.colBrightness;
		const cBRT2 = grCol.colBrightness2;
		const iBRT = grCol.imgBrightness;
		const bevel = this.BEVEL;
		const blend = this.BLEND;
		const blend2 = this.BLEND2;
		const alt = this.ALT;
		const transpBtns = this.TPB;
		const progBar = this.PB;
		const progBarFillBevelInner = this.PBF === 'bevel' || this.PBF === 'inner';

		// * WHITE THEME/REBORN WHITE WITH STYLE BLEND - dynamically adjust transport buttons styles
		if (((this.THEME === 'white' && !this.BW2 || this.RW) && (blend || blend2)) && fb.IsPlaying && !grm.ui.isStreaming && !grm.ui.isPlayingCD) {
			switch (true) {
				case ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) > 500: grCol.transportStyleBottom = RGB(175, 175, 175); break;
				case ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) > 300: grCol.transportStyleBottom = RGB(180, 180, 180); break;
				case ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) > 150: grCol.transportStyleBottom = RGB(185, 185, 185); break;
				case ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) >  75: grCol.transportStyleBottom = RGB(190, 190, 190); break;
				case ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) >  50: grCol.transportStyleBottom = RGB(195, 195, 195); break;
				case ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) >=  0: grCol.transportStyleBottom = RGB(200, 200, 200); break;
			}
		}

		// * WHITE THEME/REBORN WHITE WITH STYLE BLEND - dynamically adjust progress bar background color
		if ((this.THEME === 'white' || this.RW) && (blend || blend2) && fb.IsPlaying) {
			if (ColorDistance(RGB(iBRT, iBRT, iBRT), grCol.bg, true) < 180) {
				if (grCfg.settings.showDebugThemeLog) console.log('>>> Blended album art image is too close to col.bg. Adjusting progress bar');
				grCol.progressBar = bevel ? TintColor(grCol.progressBar, 10) : ShadeColor(grCol.progressBar, 10);
			}
			if (!this.BWR && ColorDistance(grCol.progressBarFill, grCol.progressBar, true) < 150) {
				if (grCfg.settings.showDebugThemeLog) console.log('>>> Progress bar fill color is too close to progress bar background. Adjusting progress bar fill');
				grCol.progressBarFill = bevel ? ShadeColor(grCol.progressBarFill, 20) : ShadeColor(grCol.progressBarFill, 10);
			}
		}

		////////////////////////////
		// * STYLE BLACK REBORN * //
		////////////////////////////
		if (this.BR && fb.IsPlaying && !grm.ui.isStreaming && !grm.ui.isPlayingCD && !grm.ui.noAlbumArtStub) {
			// * PLAYLIST COLORS * //
			pl.col.header_nowplaying_bg =
				cBRT > 200 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT > 175 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT > 150 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT > 125 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT > 100 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT >  75 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT >  50 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT >  25 ? blend ? RGBtoRGBA(grCol.primary, bevel ? 180 : 200) : grCol.primary :
				cBRT >=  0 ? cBRT < 10 ? TintColor(grCol.primary, blend || blend2 ? 15 : 10) :
										 TintColor(grCol.primary, blend || blend2 ? 15 :  5) : '';

			pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;

			// * MAIN COLORS * //
			grCol.transportEllipseBg =
				cBRT > 150 ? transpBtns === 'emboss' ? TintColor(grCol.transportEllipseBg, 10) : grCol.transportEllipseBg :
				grCol.transportEllipseBg;

			grCol.transportStyleTop =
				cBRT > 200 ? transpBtns === 'emboss' ? TintColor(grCol.transportStyleTop,  30) : TintColor(grCol.transportStyleTop,  10) :
				cBRT > 175 ? transpBtns === 'emboss' ? TintColor(grCol.transportStyleTop,  30) : TintColor(grCol.transportStyleTop,  10) :
				cBRT > 150 ? transpBtns === 'emboss' ? TintColor(grCol.transportStyleTop,  30) : TintColor(grCol.transportStyleTop,  10) :
				cBRT > 125 ? transpBtns === 'emboss' ? TintColor(grCol.transportStyleTop,  30) : TintColor(grCol.transportStyleTop,  15) :
				cBRT > 100 ? transpBtns === 'emboss' ? TintColor(grCol.transportStyleTop,  40) : ShadeColor(grCol.transportStyleTop, 10) :
				cBRT >  75 ? transpBtns === 'emboss' ? TintColor(grCol.transportStyleTop,  40) : ShadeColor(grCol.transportStyleTop,  8) :
				cBRT >  50 ? transpBtns === 'emboss' ? ShadeColor(grCol.transportStyleTop, 10) : TintColor(grCol.transportStyleTop,   6) :
				cBRT >  25 ? transpBtns === 'emboss' ? ShadeColor(grCol.transportStyleTop, 20) : TintColor(grCol.transportStyleTop,   4) :
				cBRT >=  0 ? transpBtns === 'emboss' ? ShadeColor(grCol.transportStyleTop, 20) : TintColor(grCol.transportStyleTop,   4) : '';

			grCol.transportStyleBottom =
				cBRT > 200 ? TintColor(grCol.transportStyleBottom,   6) :
				cBRT > 175 ? TintColor(grCol.transportStyleBottom,   6) :
				cBRT > 150 ? TintColor(grCol.transportStyleBottom,   6) :
				cBRT > 125 ? TintColor(grCol.transportStyleBottom,   6) :
				cBRT > 100 ? ShadeColor(grCol.transportStyleBottom,  6) :
				cBRT >  75 ? ShadeColor(grCol.transportStyleBottom, 12) :
				cBRT >  50 ? TintColor(grCol.transportStyleBottom,   6) :
				cBRT >  25 ? TintColor(grCol.transportStyleBottom,   4) :
				cBRT >=  0 ? TintColor(grCol.transportStyleBottom,   4) : '';

			grCol.progressBar =
				cBRT < 25 ? bevel ? TintColor(grCol.primary, cBRT < 10 ? blend2 ? 15 : 10 : 5) : ShadeColor(grCol.primary, 30) :
				cBRT < 50 ? RGB(0, 0, 0) : pl.col.bg;

			grCol.styleProgressBar =
				cBRT > 200 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 45 : 65) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 40 : 60) : '' :
				cBRT > 175 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 45 : 65) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 40 : 60) : '' :
				cBRT > 150 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 45 : 65) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 40 : 60) : '' :
				cBRT > 125 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 35 : 55) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 30 : 50) : '' :
				cBRT > 100 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 25 : 40) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 20 : 40) : '' :
				cBRT >  75 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 15 : 25) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 15 : 20) : '' :
				cBRT >  50 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 10 : 15) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 10 : 15) : '' :
				cBRT <  50 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 10 : 10) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 10 : 10) : '' :
				grCol.styleProgressBar;

			grCol.progressBarFill =
				cBRT > 200 ? bevel ? TintColor(grCol.progressBarFill, 10) : ShadeColor(grCol.progressBarFill, 15) :
				cBRT > 175 ? bevel ? TintColor(grCol.progressBarFill,  5) : ShadeColor(grCol.progressBarFill, blend ? 5 : 15) :
				cBRT > 150 ? bevel ? TintColor(grCol.progressBarFill, 10) : ShadeColor(grCol.progressBarFill, 20) :
				cBRT > 125 ? bevel ? TintColor(grCol.progressBarFill, 10) : ShadeColor(grCol.progressBarFill, 20) :
				cBRT > 100 ? bevel ? TintColor(grCol.progressBarFill, 15) : ShadeColor(grCol.progressBarFill, 30) :
				cBRT >  75 ? TintColor(grCol.progressBarFill, 30) :
				cBRT >  50 ? TintColor(grCol.progressBarFill, 30) :
				cBRT >  25 ? TintColor(grCol.primary, 25) :
				cBRT >=  0 ? TintColor(grCol.primary, 25) : '';

			grCol.styleProgressBarFill =
				cBRT > 200 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  80 :  60) : '' :
				cBRT > 175 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  80 :  60) : '' :
				cBRT > 150 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  80 :  60) : '' :
				cBRT > 125 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  90 :  70) : '' :
				cBRT > 100 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 100 :  85) : '' :
				cBRT >  75 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 100 :  90) : '' :
				cBRT >  50 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 110 : 100) : '' :
				cBRT >  25 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 130 : 120) : '' :
				cBRT >=  0 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 130 : 120) : '' : '';

			grCol.shadow =
				cBRT > 200 ? RGBA(0, 0, 0, alt ?  45 : 35) :
				cBRT > 175 ? RGBA(0, 0, 0, alt ?  45 : 35) :
				cBRT > 150 ? RGBA(0, 0, 0, alt ?  45 : 35) :
				cBRT > 125 ? RGBA(0, 0, 0, alt ?  50 : 40) :
				cBRT > 100 ? RGBA(0, 0, 0, alt ?  60 : 45) :
				cBRT >  75 ? RGBA(0, 0, 0, alt ?  75 : 50) :
				cBRT >  50 ? RGBA(0, 0, 0, alt ? 100 : 55) :
				cBRT >  25 ? RGBA(0, 0, 0, alt ? 120 : 70) :
				cBRT >=  0 ? RGBA(0, 0, 0, alt ? 140 : 90) : '';
		}

		///////////////////////////////////////////////////////
		// * REBORN/RANDOM/STYLE REBORN WHITE/BLACK/FUSION * //
		///////////////////////////////////////////////////////
		// * Dynamically adjust background colors, lines, transport buttons, progress/volume bar, gradient and shadow
		if ((this.THEME === 'reborn' || this.THEME === 'random') && grCol.isColored && !grm.ui.isStreaming && !grm.ui.isPlayingCD && !grm.ui.noAlbumArtStub) {
			const primary = this.RF2 ? grCol.primary_alt : grCol.primary;
			const primary_alt = this.RF ? grCol.primary_alt : grCol.primary;

			// * PLAYLIST COLORS * //
			pl.col.header_nowplaying_bg =
				cBRT > 200 ? blend ? RGBtoRGBA(TintColor(primary, 20), 130) : TintColor(primary, 20) :
				cBRT > 175 ? blend ? RGBtoRGBA(TintColor(primary, 12), 130) : TintColor(primary, 12) :
				cBRT > 150 ? blend ? RGBtoRGBA(TintColor(primary, 12), 130) : TintColor(primary, 12) :
				cBRT > 125 ? blend ? RGBtoRGBA(TintColor(primary, 10), 130) : TintColor(primary, 10) :
				cBRT > 100 ? blend ? RGBtoRGBA(TintColor(primary, 10), 130) : TintColor(primary, 10) :
				cBRT >  75 ? blend ? RGBtoRGBA(TintColor(primary,  8), 130) : TintColor(primary,  8) :
				cBRT >  50 ? blend ? RGBtoRGBA(TintColor(primary,  6), 130) : TintColor(primary,  6) :
				cBRT >  25 ? blend ? RGBtoRGBA(TintColor(primary,  6), 130) : TintColor(primary,  6) :
				cBRT >=  0 ? cBRT < 10 ? TintColor(primary, blend || blend2 ? 15 : 10) :
										 TintColor(primary, blend || blend2 ? 15 :  5) : '';

			pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;

			pl.col.header_line_normal =
				cBRT > 200 ? ShadeColor(primary, 16) :
				cBRT > 175 ? ShadeColor(primary, 18) :
				cBRT > 150 ? ShadeColor(primary, 20) :
				cBRT > 125 ? ShadeColor(primary, 22) :
				cBRT > 100 ? ShadeColor(primary, 24) :
				cBRT >  75 ? ShadeColor(primary, 26) :
				cBRT >  50 ? ShadeColor(primary, 28) :
				cBRT >  25 ? ShadeColor(primary, 30) :
				cBRT >=  0 ? TintColor(primary,  15) : '';

			pl.col.header_line_playing =
				cBRT > 200 ? ShadeColor(primary, 26) :
				cBRT > 175 ? ShadeColor(primary, 28) :
				cBRT > 150 ? ShadeColor(primary, 30) :
				cBRT > 125 ? ShadeColor(primary, 32) :
				cBRT > 100 ? ShadeColor(primary, 34) :
				cBRT >  75 ? ShadeColor(primary, 36) :
				cBRT >  50 ? ShadeColor(primary, 38) :
				cBRT >  25 ? ShadeColor(primary, 40) :
				cBRT >=  0 ? TintColor(primary,  20) : '';

			pl.col.row_selection_frame = pl.col.header_line_normal;
			pl.col.row_disc_subheader_line = pl.col.header_line_normal;
			pl.col.row_drag_line = pl.col.row_sideMarker;
			pl.col.row_drag_line_reached = cBRT > 210 ? ShadeColor(pl.col.row_sideMarker, 25) : TintColor(pl.col.row_sideMarker, 50);

			// * LIBRARY COLORS * //
			lib.ui.col.selectionFrame = pl.col.header_line_normal;
			lib.ui.col.line           = pl.col.header_line_playing;

			// * MAIN COLORS * //
			grCol.styleGradient =
				cBRT > 200 ? ShadeColor(primary, this.RB ? 65 : 25) :
				cBRT > 175 ? ShadeColor(primary, this.RB ? 60 : 30) :
				cBRT > 150 ? ShadeColor(primary, this.RB ? 55 : 35) :
				cBRT > 125 ? ShadeColor(primary, this.RB ? 50 : 40) :
				cBRT > 100 ? ShadeColor(primary, this.RB ? 45 : 45) :
				cBRT >  75 ? ShadeColor(primary, this.RB ? 40 : 50) :
				cBRT >  50 ? ShadeColor(primary, this.RB ? 35 : 55) :
				cBRT >  25 ? ShadeColor(primary, this.RB ? 30 : 60) :
				cBRT >=  0 ? this.RB ? TintColor(primary, 10) : ShadeColor(primary, 25) : '';

			grCol.styleGradient2 = grCol.styleGradient;

			if (!this.RW && !this.RB && !this.RF) {
				grCol.bg =
					cBRT < 10 ? TintColor(primary_alt, blend || blend2 ? 15 : 10) :
					cBRT < 25 ? TintColor(primary_alt, blend || blend2 ? 15 :  5) :
					grCol.bg;

				grCol.progressBar =
					cBRT > 200 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 20 : 10) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT > 175 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 25 : 10) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT > 150 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 25 : 10) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT > 125 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 30 : 15) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT > 100 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 30 : 15) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT >  75 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 35 : 20) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT >  50 ? blend || blend2 ? ShadeColor(primary_alt, bevel ? 45 : 25) : ShadeColor(primary_alt, bevel ? 30 : 15) :
					cBRT >  25 ? blend || blend2 ? ShadeColor(primary_alt, bevel ?  0 :  0) : ShadeColor(primary_alt, bevel ? 40 : 15) :
					cBRT >=  0 ? blend || blend2 ? ShadeColor(primary_alt, bevel ?  0 :  0) : ShadeColor(primary_alt, bevel ? 40 : 10) : '';
			}

			grCol.progressBarFill =
				cBRT < 175 > 125 ? progBarFillBevelInner ? TintColor(grCol.progressBarFill, 10) : grCol.progressBarFill :
				grCol.progressBarFill;

			grCol.styleProgressBarFill =
				cBRT > 200 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 25 : 20) : '' :
				cBRT > 175 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 30 : 25) : '' :
				cBRT > 150 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 35 : 30) : '' :
				cBRT > 125 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 45 : 40) : '' :
				cBRT > 100 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 50 : 45) : '' :
				cBRT >  75 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 55 : 50) : '' :
				cBRT >  50 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 65 : 60) : '' :
				cBRT >  25 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 75 : 70) : '' :
				cBRT >=  0 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 85 : 80) : '' :  '';

			if (!this.RW && !this.RB) {
				grCol.styleProgressBarLineTop =
					cBRT > 200 ? RGBA(0, 0, 0, bevel ? 15 : 10) :
					cBRT > 175 ? RGBA(0, 0, 0, bevel ? 20 : 15) :
					cBRT > 150 ? RGBA(0, 0, 0, bevel ? 30 : 25) :
					cBRT > 125 ? RGBA(0, 0, 0, bevel ? 35 : 30) :
					cBRT > 100 ? RGBA(0, 0, 0, bevel ? 40 : 35) :
					cBRT >  75 ? RGBA(0, 0, 0, bevel ? 45 : 40) :
					cBRT >  50 ? RGBA(0, 0, 0, bevel ? 50 : 45) :
					cBRT >  25 ? RGBA(0, 0, 0, bevel ? 55 : 50) :
					cBRT >=  0 ? RGBA(0, 0, 0, bevel ? 65 : 60) : '';

				grCol.styleProgressBarLineBottom =
					cBRT > 200 ? RGBA(255, 255, 255, bevel ? 45 : 50) :
					cBRT > 175 ? RGBA(255, 255, 255, bevel ? 40 : 45) :
					cBRT > 150 ? RGBA(255, 255, 255, bevel ? 35 : 40) :
					cBRT > 125 ? RGBA(255, 255, 255, bevel ? 30 : 35) :
					cBRT > 100 ? RGBA(255, 255, 255, bevel ? 25 : 30) :
					cBRT >  75 ? RGBA(255, 255, 255, bevel ? 20 : 25) :
					cBRT >  50 ? RGBA(255, 255, 255, bevel ? 15 : 20) :
					cBRT >  25 ? RGBA(255, 255, 255, bevel ? 10 : 15) :
					cBRT >=  0 ? RGBA(255, 255, 255, bevel ?  5 : 10) : '';
			}

			grCol.shadow =
				cBRT > 200 ? RGBA(0, 0, 0, alt ?  45 : 35) :
				cBRT > 175 ? RGBA(0, 0, 0, alt ?  45 : 35) :
				cBRT > 150 ? RGBA(0, 0, 0, alt ?  45 : 35) :
				cBRT > 125 ? RGBA(0, 0, 0, alt ?  50 : 40) :
				cBRT > 100 ? RGBA(0, 0, 0, alt ?  60 : 45) :
				cBRT >  75 ? RGBA(0, 0, 0, alt ?  75 : 50) :
				cBRT >  50 ? RGBA(0, 0, 0, alt ? 100 : 55) :
				cBRT >  25 ? RGBA(0, 0, 0, alt ? 120 : 70) :
				cBRT >=  0 ? RGBA(0, 0, 0, alt ? 140 : 90) : '';


			// * REBORN/RANDOM THEME/STYLE REBORN WHITE/REBORN BLACK - Adjust colors primary color is almost pure white
			const defaultRebornRandom = cBRT > 210 && (!blend && !blend2) && !this.RW && !this.RB && !this.RF && !this.RF2 && !this.RD;
			const rebornWhiteBlack = cBRT > 210 && (this.RW || this.RB);

			if (defaultRebornRandom || rebornWhiteBlack) {
				// * PLAYLIST COLORS * //
				pl.col.bg = RGB(255, 255, 255);
				pl.col.plman_bg = pl.col.bg;
				pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;

				pl.col.header_nowplaying_bg =
					defaultRebornRandom ? blend && iBRT > 240 ? grCol.lightAccent_7 : blend2 && iBRT > 240 ? grCol.lightAccent_35 : RGB(245, 245, 245) :
					rebornWhiteBlack ? blend ? RGBtoRGBA(grCol.lightAccent, 130) : RGB(245, 245, 245) :
					pl.col.header_nowplaying_bg;

				pl.col.header_sideMarker = RGB(90, 90, 90);
				pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
				pl.col.row_sideMarker = pl.col.header_sideMarker;
				pl.col.row_selection_frame = RGB(220, 220, 220);
				pl.col.sbar_btn_normal = RGB(90, 90, 90);
				pl.col.sbar_btn_hovered = RGB(0, 0, 0);
				pl.col.sbar_thumb_normal = RGB(235, 235, 235);
				pl.col.sbar_thumb_hovered = RGB(90, 90, 90);
				pl.col.sbar_thumb_drag = pl.col.sbar_thumb_hovered;

				// * LIBRARY COLORS * //
				lib.ui.col.bg = pl.col.bg;
				lib.ui.col.bgSel = pl.col.header_nowplaying_bg;
				lib.ui.col.nowPlayingBg = pl.col.header_nowplaying_bg;
				lib.ui.col.sideMarker = pl.col.header_sideMarker;
				lib.ui.col.selectionFrame = pl.col.row_selection_frame;
				lib.ui.col.sbarBtns = RGB(90, 90, 90);
				lib.ui.col.sbarNormal = RGB(210, 210, 210);
				lib.ui.col.sbarHovered = RGB(90, 90, 90);
				lib.ui.col.sbarDrag = RGB(90, 90, 90);

				// * BIOGRAPHY COLORS * //
				bio.ui.col.bg = pl.col.bg;
				bio.ui.col.sbarBtns = RGB(90, 90, 90);
				bio.ui.col.sbarNormal = RGB(210, 210, 210);
				bio.ui.col.sbarHovered = RGB(90, 90, 90);
				bio.ui.col.sbarDrag = RGB(90, 90, 90);

				// * MAIN COLORS * //
				grCol.bg = this.RB ? RGB(0, 0, 0) : bevel ? RGB(255, 255, 255) : RGB(245, 245, 245);
				grCol.detailsBg = pl.col.bg;

				if (!this.RB) {
					// * LOWER BAR TRANSPORT BUTTON COLORS * //
					grCol.transportEllipseBg =
						this.BLEND12 && grCol.isColored ? RGB(230, 230, 230) :
						this.BEVEL ? RGB(240, 240, 240) : RGB(255, 255, 255);

					grCol.transportEllipseNormal = ShadeColor(grCol.lightAccent_7, 10);

					// * PROGRESS BAR COLORS * //
					grCol.progressBar =
						this.PB === 'bevel' ? this.BEVEL ? RGB(245, 245, 245) : RGB(220, 220, 220) :
						this.BEVEL ? this.BLEND12 ? RGB(235, 235, 235) : RGB(225, 225, 225) :
						this.BLEND12 && grCol.isColored && !grm.ui.noAlbumArtStub ? RGB(240, 240, 240) :
						RGB(220, 220, 220);

					grCol.progressBarStreaming = RGB(207, 0, 5);
					grCol.progressBarFrame = this.BEVEL ? RGB(180, 180, 180) : grCol.bg;
					grCol.progressBarFill = RGB(90, 90, 90);

					// * VOLUME BAR COLORS * //
					grCol.volumeBar = pl.col.bg;
					grCol.volumeBarFill = RGB(90, 90, 90);
				}

				if (this.RB) {
					// * STYLE COLORS * //
					grCol.styleGradient = grCol.darkAccent_75;
					grCol.styleGradient2 = grCol.darkAccent_75;
				}
			}

			// * REBORN/RANDOM THEME - Adjust colors when using style blend and album art is almost pure white
			if (iBRT > 210 && (blend || blend2) && !this.RW && !this.RB && !this.RD) {
				grCol.primary = TintColor(grCol.primary, 15);

				// * PLAYLIST COLORS * //
				pl.col.header_nowplaying_bg =
					blend  && iBRT > 240 ? grCol.lightAccent_7 :
					blend2 && iBRT > 240 ? grCol.lightAccent_35 :
					RGBtoRGBA(grCol.lightAccent_50, 130);

				pl.col.header_sideMarker = cBRT < 150 ? grCol.lightAccent_80 : grCol.lightAccent_100;
				pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
				pl.col.row_sideMarker = pl.col.header_sideMarker;

				// * LIBRARY COLORS * //
				lib.ui.col.sideMarker = cBRT < 150 ? grCol.lightAccent_80 : grCol.lightAccent_100;

				// * MAIN COLORS * //
				grCol.transportEllipseNormal = cBRT < 150 ? grCol.transportEllipseNormal : ShadeColor(grCol.lightAccent_7, 10);
				grCol.transportEllipseBg     = cBRT < 150 ? grCol.lightAccent_80 : grCol.lightAccent_100;
				grCol.progressBar            = cBRT < 150 ? grCol.lightAccent_7 : blend2 && iBRT > 240 ? grCol.lightAccent_35 : ShadeColor(grCol.lightAccent_7, 5);
				grCol.progressBarFill        = cBRT < 150 ? grCol.lightAccent_80 : grCol.lightAccent_100;
			}

			/////////////////////////////////////
			// * STYLE REBORN FUSION 1 AND 2 * //
			/////////////////////////////////////
			// * ADJUST COLORS WHEN PANEL BG IS TOO LIGHT * //
			if (cBRT > 210 && this.RF || cBRT2 > 210 && this.RF2) {
				this.panelWhiteColors(true);
			}

			// * ADJUST COLORS WHEN MAIN BG IS TOO LIGHT * //
			if (cBRT2 > 210 && this.RF || cBRT > 210 && this.RF2) {
				this.mainWhiteColors();
			}

			// * ADJUST COLORS WHEN PANEL BG IS TOO DARK * //
			if (cBRT < 25 && this.RF || cBRT2 < 25 && this.RF2) {
				this.panelBlackColors(true);
			}

			// * ADJUST COLORS WHEN MAIN BG IS TOO DARK * //
			if (cBRT2 < 25 && this.RF || cBRT < 25 && this.RF2) {
				this.mainBlackColors();
			}
		}
	}
	// #endregion
}


//////////////////////
// * STYLE COLORS * //
//////////////////////
/**
 * A class that provides the full collection of all style colors and its methods.
 * @augments {BaseColors}
 */
class StyleColors extends BaseColors {
	// * PUBLIC METHODS - STYLE NIGHTTIME * //
	// #region PUBLIC METHODS - STYLE NIGHTTIME
	/**
	 * Active Reborn theme used in Options > Style > Nighttime.
	 */
	styleNighttimeColors() {
		if (this.CTHEME) return;

		const rebornNightAccentColor = grSet.theme === 'reborn' ? RGB(210, 235, 240) : false;

		if (!grCol.isColored || grm.ui.noAlbumArtStub) {
			grm.theme.panelBlackColors(false, rebornNightAccentColor);
			grm.theme.mainBlackColors();
		} else {
			grm.theme.playlistColorsRebornRandomTheme();
			grm.theme.libraryColorsRebornRandomTheme();
			grm.theme.biographyColorsRebornRandomTheme();
			grm.theme.mainColorsRebornRandomTheme();
		}
	}
	// #endregion

	// * PUBLIC METHODS - STYLE ALTERNATIVE * //
	// #region PUBLIC METHODS - STYLE ALTERNATIVE
	/**
	 * Any active theme used in Options > Style > Alternative.
	 */
	styleAlternativeColors() {
		// * PLAYLIST * //
		pl.col.bg =
			grSet.theme === 'white' ? RGB(245, 245, 245) :
			grSet.theme === 'black' ? TintColor(pl.col.bg, 6) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? ShadeColor(pl.col.bg, 5) :
			grSet.theme === 'blue' ? RGB(8, 110, 190) :
			grSet.theme === 'darkblue' ? RGB(17, 35, 57) :
			grSet.theme === 'red' ? RGB(106, 18, 18) :
			grSet.theme === 'cream' ? RGB(255, 247, 240) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? TintColor(pl.col.bg, 8) :
			this.CTHEME ? ShadeColor(pl.col.bg, 5) : '';

		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;

		pl.col.header_nowplaying_bg =
			grSet.theme === 'blue' ? RGB(20, 120, 205) :
			grSet.theme === 'darkblue' ? RGB(18, 42, 70) :
			grSet.theme === 'red' ? RGB(130, 25, 25) :
			pl.col.header_nowplaying_bg;

		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_selection_bg = pl.col.row_nowplaying_bg;

		// * LIBRARY * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;

		// * BIOGRAPHY * //
		bio.ui.col.bg = pl.col.bg;

		// * MAIN * //
		grCol.bg =
			grSet.theme === 'white' ? RGB(255, 255, 255) :
			grSet.theme === 'black' ? TintColor(grCol.bg, 4) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? TintColor(grCol.bg, 8) :
			grSet.theme === 'blue' ? RGB(20, 120, 205) :
			grSet.theme === 'darkblue' ? RGB(18, 42, 70) :
			grSet.theme === 'red' ? RGB(130, 25, 25) :
			grSet.theme === 'cream' ? RGB(255, 255, 255) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? RGB(30, 30, 30) :
			this.CTHEME ? TintColor(grCol.bg, 8) : '';

		grCol.uiHacksFrame = grCol.bg;

		grCol.shadow =
			grSet.theme === 'reborn' || grSet.theme === 'random' ? RGBA(0, 0, 0, 25) :
			grSet.theme === 'blue' ? grCol.shadow + RGBA(0, 0, 0, 25) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? RGBA(0, 0, 0, 255) :
			grCol.shadow + RGBA(0, 0, 0, 10);

		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = pl.col.row_title_normal;

		// * LOWER BAR TRANSPORT BUTTONS * //
		grCol.transportEllipseBg =
			grSet.theme === 'white' ? TintColor(grCol.transportEllipseBg, 100) :
			grSet.theme === 'black' ? TintColor(grCol.transportEllipseBg, 4) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? TintColor(grCol.transportEllipseBg, 0) :
			grSet.theme === 'blue' ? TintColor(grCol.transportEllipseBg, 6) :
			grSet.theme === 'darkblue' ? TintColor(grCol.transportEllipseBg, 0) :
			grSet.theme === 'red' ? RGB(158, 30, 30) :
			grSet.theme === 'cream' ? pl.col.bg :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? ShadeColor(grCol.transportEllipseBg, 20) :
			ShadeColor(grCol.transportEllipseBg, 10);

		grCol.transportEllipseNormal =
			grSet.theme === 'black' ? ShadeColor(grCol.transportEllipseNormal, 6) :
			grSet.theme === 'red' ? RGB(106, 18, 18) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? ShadeColor(grCol.transportEllipseNormal, 90) :
			TintColor(grCol.transportEllipseNormal, 6);

		grCol.transportEllipseHovered = TintColor(grCol.transportEllipseHovered, 6);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			grSet.theme === 'black' ? TintColor(grCol.transportStyleBg, 4) :
			grSet.theme === 'blue' ? TintColor(grCol.transportStyleBg, 6) :
			grSet.theme === 'darkblue' ? TintColor(grCol.transportStyleBg, 0) :
			grSet.theme === 'red' ? TintColor(grCol.transportStyleBg, 2) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? ShadeColor(grCol.transportStyleBg, 6) :
			TintColor(grCol.transportStyleBg, 6);

		grCol.transportStyleTop =
			grSet.theme === 'black' ? ShadeColor(grCol.transportStyleTop, 6) :
			grSet.theme === 'blue' ? ShadeColor(grCol.transportStyleTop, 6) :
			grSet.theme === 'darkblue' ? ShadeColor(grCol.transportStyleTop, 0) :
			grSet.theme === 'red' ? TintColor(grCol.transportStyleTop, this.TPB === 'emboss' ? 6 : 2) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? ShadeColor(grCol.transportStyleTop, 6) :
			TintColor(grCol.transportStyleTop, 6);

		grCol.transportStyleBottom =
			grSet.theme === 'black' ? ShadeColor(grCol.transportStyleBottom, 0) :
			grSet.theme === 'blue' ? ShadeColor(grCol.transportStyleBottom, 6) :
			grSet.theme === 'darkblue' ? ShadeColor(grCol.transportStyleBottom, 0) :
			grSet.theme === 'red' ? TintColor(grCol.transportStyleBottom, this.TPB === 'emboss' ? 6 : 2) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? ShadeColor(grCol.transportStyleBottom, 6) :
			TintColor(grCol.transportStyleBottom, 6);

		// * PROGRESS BAR * //
		grCol.progressBar =
			grSet.theme === 'white' ? this.BEVEL ? TintColor(grCol.progressBar, 60) : TintColor(grCol.progressBar, 40) :
			grSet.theme === 'black' ? TintColor(grCol.progressBar, 2) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? grCol.colBrightness < 25 ? TintColor(grCol.primary, 12) : grCol.isColored && !grm.ui.noAlbumArtStub ? pl.col.bg : grCol.progressBar :
			grSet.theme === 'blue' ? TintColor(grCol.progressBar, 2) :
			grSet.theme === 'darkblue' ? TintColor(grCol.progressBar, 0) :
			grSet.theme === 'red' ? RGB(158, 30, 30) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? this.BEVEL ? ShadeColor(grCol.progressBar, 60) : ShadeColor(grCol.progressBar, 35) :
			this.CTHEME ? ShadeColor(grCol.progressBar, 5) :
			pl.col.bg;

		// * VOLUME BAR * //
		grCol.volumeBar = grCol.progressBar;
		grCol.volumeBarFill = grCol.progressBarFill;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE ALTERNATIVE 2 * //
	// #region PUBLIC METHODS - STYLE ALTERNATIVE 2
	/**
	 * Any active theme used in Options > Style > Alternative 2.
	 */
	styleAlternative2Colors() {
		// * PLAYLIST * //
		pl.col.bg =
			grSet.theme === 'white' ? TintColor(pl.col.bg, 4) :
			grSet.theme === 'black' ? TintColor(pl.col.bg, 3) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? TintColor(pl.col.bg, 5) :
			grSet.theme === 'blue' ? RGB(20, 120, 205) :
			grSet.theme === 'darkblue' ? RGB(18, 42, 70) :
			grSet.theme === 'red' ? RGB(120, 22, 22) :
			grSet.theme === 'cream' ? RGB(255, 255, 255) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? TintColor(pl.col.bg, 6) :
			this.CTHEME ? TintColor(pl.col.bg, 5) : '';

		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;

		pl.col.header_nowplaying_bg =
			grSet.theme === 'black' && grCol.colBrightness < 25 ? TintColor(grCol.primary, 15) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? this.BLEND ? RGBtoRGBA(grCol.darkAccent, 60) : RGBtoRGBA(grCol.darkAccent, 40) :
			grSet.theme === 'red' ? RGB(140, 25, 25) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? TintColor(pl.col.header_nowplaying_bg, 6) :
			pl.col.header_nowplaying_bg;

		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_selection_bg = pl.col.row_nowplaying_bg;

		// * LIBRARY * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;

		// * BIOGRAPHY * //
		bio.ui.col.bg = pl.col.bg;

		// * MAIN * //
		grCol.bg =
			grSet.theme === 'white' ? ShadeColor(grCol.bg, 6) :
			grSet.theme === 'black' ? TintColor(grCol.bg, 10) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? ShadeColor(grCol.bg, 8) :
			grSet.theme === 'blue' ? RGB(8, 102, 180) :
			grSet.theme === 'darkblue' ? RGB(17, 35, 57) :
			grSet.theme === 'red' ? RGB(95, 15, 15) :
			grSet.theme === 'cream' ? RGB(255, 247, 240) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? RGB(25, 25, 25) :
			this.CTHEME ? ShadeColor(grCol.bg, 8) : '';

		grCol.uiHacksFrame = grCol.bg;

		grCol.shadow =
			grSet.theme === 'black' ? grCol.shadow - RGBA(0, 0, 0, 80) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? grCol.shadow :
			grCol.shadow + RGBA(0, 0, 0, 5);

		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = pl.col.row_title_normal;

		// * LOWER BAR TRANSPORT BUTTONS * //
		grCol.transportEllipseBg =
			grSet.theme === 'white' ? TintColor(grCol.transportEllipseBg, 100) :
			grSet.theme === 'black' ? ShadeColor(grCol.transportEllipseBg, 6) :
			grSet.theme === 'darkblue' ? TintColor(grCol.transportEllipseBg, 0) :
			grSet.theme === 'red' ? RGB(140, 25, 25) :
			TintColor(grCol.transportEllipseBg, 6);

		grCol.transportEllipseNormal =
			grSet.theme === 'black' ? ShadeColor(grCol.transportEllipseNormal, 60) :
			TintColor(grCol.transportEllipseNormal, 6);

		grCol.transportEllipseHovered = TintColor(grCol.transportEllipseHovered, 6);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			grSet.theme === 'white' ? this.BEVEL ? ShadeColor(grCol.transportStyleBg, 10) : ShadeColor(grCol.transportStyleBg, 7) :
			grSet.theme === 'darkblue' ? TintColor(grCol.transportStyleBg, 0) :
			grSet.theme === 'red' ? TintColor(grCol.transportStyleBg, 2) :
			grSet.theme === 'cream' ? RGB(230, 230, 230) :
			TintColor(grCol.transportStyleBg, 6);

		grCol.transportStyleTop =
			grSet.theme === 'white' ? ShadeColor(grCol.transportStyleTop, 6) :
			grSet.theme === 'blue' ? TintColor(grCol.transportStyleTop, 12) :
			grSet.theme === 'darkblue' ? TintColor(grCol.transportStyleTop, 0) :
			grSet.theme === 'red' ? TintColor(grCol.transportStyleTop, 2) :
			TintColor(grCol.transportStyleTop, 6);

		grCol.transportStyleBottom =
			grSet.theme === 'white' ? ShadeColor(grCol.transportStyleBottom, 6) :
			grSet.theme === 'blue' ? ShadeColor(grCol.transportStyleBottom, 10) :
			grSet.theme === 'darkblue' ? TintColor(grCol.transportStyleBottom, 0) :
			grSet.theme === 'red' ? TintColor(grCol.transportStyleBottom, 2) :
			TintColor(grCol.transportStyleBottom, 6);

		// * PROGRESS BAR * //
		grCol.progressBar =
			grSet.theme === 'white' ? this.BEVEL ? TintColor(grCol.progressBar, 60) : TintColor(grCol.progressBar, 100) :
			grSet.theme === 'black' ? ShadeColor(grCol.progressBar, 16) :
			grSet.theme === 'reborn' || grSet.theme === 'random' ? grCol.colBrightness < 25 ? TintColor(grCol.primary, 12) : pl.col.bg :
			grSet.theme === 'blue' ? pl.col.bg :
			grSet.theme === 'darkblue' ? pl.col.row_nowplaying_bg :
			grSet.theme === 'red' ? TintColor(grCol.progressBar, 0) :
			['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme) ? TintColor(grCol.progressBar, 3) :
			this.CTHEME ? ShadeColor(grCol.progressBar, 2) :
			pl.col.bg;

		// * VOLUME BAR * //
		grCol.volumeBar = grCol.progressBar;
		grCol.volumeBarFill = grCol.progressBarFill;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE BLACK AND WHITE * //
	// #region PUBLIC METHODS - STYLE BLACK AND WHITE
	/**
	 * Active White theme used in Options > Style > Black and white.
	 */
	styleBlackAndWhiteColors() {
		grCol.primary = RGB(255, 255, 255);
		grm.theme.panelBlackColors();
		grm.theme.mainWhiteColors();
	}
	// #endregion

	// * PUBLIC METHODS - STYLE BLACK AND WHITE 2 * //
	// #region PUBLIC METHODS - STYLE BLACK AND WHITE 2
	/**
	 * Active White theme used in Options > Style > Black and white 2.
	 */
	styleBlackAndWhite2Colors() {
		grCol.primary = RGB(255, 255, 255);
		grm.theme.panelWhiteColors();
		grm.theme.mainBlackColors();
	}
	// #endregion

	// * PUBLIC METHODS - STYLE BLACK REBORN * //
	// #region PUBLIC METHODS - STYLE BLACK REBORN
	/**
	 * Active Black theme used in Options > Style > Black reborn.
	 */
	styleBlackRebornColors() {
		if (!fb.IsPlaying || !grm.ui.albumArt && !grm.ui.noAlbumArtStub) grCol.primary = RGB(25, 25, 25);

		// * PLAYLIST COLORS * //
		pl.col.bg = RGB(20, 20, 20);
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;
		pl.col.header_nowplaying_bg = grCol.colBrightness < 25 ? grCol.lightAccent : this.BEVEL ? ShadeColor(grCol.primary, 10) : grCol.primary;
		pl.col.header_line_normal = this.BLEND ? RGB(65, 65, 65) : RGB(45, 45, 45);
		pl.col.header_line_playing = RGB(25, 25, 25);
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_disc_subheader_line = this.BLEND ? RGB(65, 65, 65) : RGB(45, 45, 45);
		pl.col.row_drag_line = grCol.lightBg ? ShadeColor(pl.col.row_selection_frame, 20) : TintColor(pl.col.row_selection_frame, 20);
		pl.col.row_drag_line_reached = pl.col.row_sideMarker;

		// * LIBRARY COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.nowPlayingBg = pl.col.row_nowplaying_bg;

		// * BIOGRAPHY COLORS * //
		bio.ui.col.bg = pl.col.bg;

		// * MAIN COLORS * //
		grCol.bg = grCol.colBrightness < 25 || grm.ui.isStreaming || grm.ui.isPlayingCD ? this.BEVEL ? RGB(40, 40, 40) : RGB(25, 25, 25) : grCol.primary;
		grCol.detailsBg = pl.col.bg;
		grCol.detailsText = RGB(220, 220, 220);
		grCol.styleBevel = grm.ui.isStreaming || grm.ui.isPlayingCD || !fb.IsPlaying ? RGB(0, 0, 0) : grCol.primary === RGB(175, 205, 225) ? RGB(70, 90, 105) : grCol.darkAccent_50;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = pl.col.bg;
		grCol.transportEllipseNormal = grCol.transportEllipseBg;
		grCol.transportEllipseHovered = RGB(120, 120, 120);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * WHEN PLAYING * //
		if (fb.IsPlaying) {
			if (grCol.lightBg) {
				// * PLAYLIST COLORS * //
				pl.col.row_title_playing = grCol.darkAccent_100;

				// * MAIN COLORS * //
				grCol.noAlbumArtStub = RGB(175, 205, 225);
				grCol.lowerBarArtist = grCol.darkAccent_75;
				grCol.lowerBarTitle = grCol.darkAccent_75;
				grCol.lowerBarTime = grCol.lowerBarTitle;
				grCol.lowerBarLength = grCol.lowerBarTitle;

				// * TOP MENU BUTTON COLORS * //
				grCol.menuBgColor =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 40) : RGBtoRGBA(grCol.lightAccent_80, 50) :
					this.TMB !== 'default' ? grCol.lightAccent_10 : grCol.lightAccent_50;

				grCol.menuRectNormal =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 40) : RGBtoRGBA(grCol.lightAccent_80, 30) :
					grCol.darkAccent;

				grCol.menuRectHovered =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 40) : RGBtoRGBA(grCol.darkAccent_75, 30) :
					grCol.darkAccent;

				grCol.menuRectDown = grCol.menuRectHovered;
				grCol.menuTextNormal = grCol.darkAccent_75;
				grCol.menuTextHovered = grCol.darkAccent_100;
				grCol.menuTextDown = grCol.menuTextHovered;

				// * LOWER BAR TRANSPORT BUTTON COLORS * //
				grCol.transportIconNormal = this.TPB === 'minimal' ? RGB(20, 20, 20) : RGB(180, 180, 180);
				grCol.menuStyleBg = grCol.primary === RGB(175, 205, 225) ? RGB(130, 153, 168) : grCol.accent;
				grCol.menuRectStyleEmbossTop = grCol.lightAccent;
				grCol.menuRectStyleEmbossBottom = grCol.darkAccent;
			}
			else {
				// * PLAYLIST COLORS * //
				pl.col.row_title_playing = grCol.lightAccent_100;

				// * MAIN COLORS * //
				grCol.noAlbumArtStub = RGB(175, 205, 225);
				grCol.lowerBarArtist = grCol.lightAccent_100;
				grCol.lowerBarTitle = grCol.lightAccent_100;
				grCol.lowerBarTime = grCol.lowerBarTitle;
				grCol.lowerBarLength = grCol.lowerBarTitle;

				// * TOP MENU BUTTON COLORS * //
				grCol.menuBgColor =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.lightAccent_80, 40) : RGBtoRGBA(grCol.lightAccent_80, 50) :
					this.TMB !== 'default' ? grCol.lightAccent_10 : grCol.darkAccent_50;

				grCol.menuRectNormal =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 60) : RGBtoRGBA(grCol.darkAccent_75, 50) :
					grCol.lightAccent_50;

				grCol.menuRectHovered =
					this.TMB === 'bevel' || this.TMB === 'inner' ?
						this.BEVEL ? RGBtoRGBA(grCol.darkAccent_75, 60) : RGBtoRGBA(grCol.darkAccent_75, 50) :
					grCol.lightAccent_50;

				grCol.menuRectDown = grCol.menuRectHovered;
				grCol.menuTextNormal = grCol.lightAccent_80;
				grCol.menuTextHovered = grCol.lightAccent_100;
				grCol.menuTextDown = grCol.menuTextHovered;

				// * LOWER BAR TRANSPORT BUTTON COLORS * //
				grCol.transportIconNormal = this.TPB === 'minimal' ? RGB(220, 220, 220) : RGB(180, 180, 180);
				grCol.menuStyleBg = grCol.primary === RGB(175, 205, 225) ? RGB(130, 153, 168) : grCol.accent;
				grCol.menuRectStyleEmbossTop = grCol.lightAccent;
				grCol.menuRectStyleEmbossBottom = grCol.darkAccent;
			}
		}

		// * PROGRESS BAR COLORS * //
		grCol.progressBar =
			grCol.colBrightness < 50 ?
				this.PB === 'bevel' ? RGB(30, 30, 30) :
				this.PB === 'inner' ? RGB(30, 30, 30) :
				this.BEVEL ? grCol.colBrightness < 25 ? RGB(30, 30, 30) : RGB(0, 0, 0) : RGB(0, 0, 0) :
			pl.col.bg;

		if (grCol.primary === RGB(175, 205, 225)) {
			grCol.progressBarFill = this.BLEND12 ? RGB(155, 185, 205) : RGB(145, 170, 190);
		}

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness > 200 || grCol.colBrightness < 75 ? TintColor(grCol.primary,  100) : ShadeColor(grCol.primary, 100);
		grCol.peakmeterBarFillTop       = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 10) : TintColor(grCol.primary, 40);
		grCol.peakmeterBarFillMiddle    = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 20) : TintColor(grCol.primary, 60);
		grCol.peakmeterBarFillBack      = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 40) : TintColor(grCol.primary, 80);
		grCol.peakmeterBarVertProgFill  = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 25) : grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 15) : TintColor(grCol.primary, 40);
		grCol.peakmeterBarVertFillPeaks = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 25) : TintColor(grCol.primary, 60);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 80) : TintColor(grCol.primary, 90);
		grCol.waveformBarFillBack     = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 40) : TintColor(grCol.primary, 45);
		grCol.waveformBarFillPreFront = grCol.colBrightness > 150 ? ShadeColor(grCol.primary, 40) : TintColor(grCol.primary, 50);
		grCol.waveformBarFillPreBack  = grCol.colBrightness > 150 ? ShadeColor(grCol.primary, 20) : TintColor(grCol.primary, 25);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = pl.col.bg;
		grCol.volumeBarFill = grCol.progressBarFill;

		// * STYLE COLORS * //
		grCol.styleVolumeBar =
			this.VB === 'bevel' ? this.BEVEL ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) :
			this.VB === 'inner' ? this.BEVEL ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) : '';

		grCol.styleVolumeBarFill = this.VBF === 'bevel' || this.VBF === 'inner' ? RGBA(0, 0, 0, 100)  : '';
	}
	// #endregion

	// * PUBLIC METHODS - STYLE REBORN WHITE * //
	// #region PUBLIC METHODS - STYLE REBORN WHITE
	/**
	 * Active Reborn theme used in Options > Style > Reborn white.
	 */
	styleRebornWhiteColors() {
		// * PLAYLIST COLORS * //
		pl.col.bg = !fb.IsPlaying ? RGB(255, 255, 255) : pl.col.bg;

		// * MAIN COLORS * //
		grCol.bg = this.BLEND12 ? RGB(255, 255, 255) : RGB(245, 245, 245);
		grCol.noAlbumArtStub = RGB(90, 90, 90);
		grCol.lowerBarArtist = this.BLEND12 ? RGB(40, 40, 40) : RGB(80, 80, 80);
		grCol.lowerBarTitle = this.BLEND12 ? RGB(50, 50, 50) : RGB(100, 100, 100);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			this.TMB === 'emboss' ? this.BEVEL ? RGB(250, 250, 250) : RGB(235, 235, 235) :
			RGB(255, 255, 255);

		grCol.menuRectNormal =
			this.TMB === 'filled' ? RGB(200, 200, 200) :
			this.BLEND12 ? this.BEVEL ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			this.BEVEL ? RGB(170, 170, 170) : RGB(180, 180, 180);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGB(200, 200, 200) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? this.BEVEL ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			this.BLEND12 ? this.BEVEL ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			this.BEVEL ? RGB(170, 170, 170) : RGB(180, 180, 180);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = this.BLEND12 ? RGB(50, 50, 50) : RGB(100, 100, 100);
		grCol.menuTextHovered = this.BLEND12 ? RGB(0, 0, 0) : RGB(80, 80, 80);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = this.BLEND12 ? RGB(225, 225, 225) : RGB(255, 255, 255);
		grCol.transportEllipseNormal = RGB(220, 220, 220);
		grCol.transportEllipseHovered = RGB(200, 200, 200);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;
		grCol.transportIconNormal = this.BLEND12 ? RGB(80, 80, 80) : RGB(100, 100, 100);
		grCol.transportIconHovered = RGB(80, 80, 80);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = this.BEVEL ? RGB(225, 225, 225) : RGB(220, 220, 220);
		grCol.progressBarFill = ShadeColor(grCol.primary, 5);

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness < 75 ? TintColor(grCol.primary, 40) : ShadeColor(grCol.primary, 40);
		grCol.peakmeterBarFillTop       = TintColor(grCol.primary,  10);
		grCol.peakmeterBarFillMiddle    = TintColor(grCol.primary,  30);
		grCol.peakmeterBarFillBack      = TintColor(grCol.primary,  50);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = ShadeColor(grCol.primary, 10);
		grCol.peakmeterBarVertFillPeaks = TintColor(grCol.primary,  20);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.primary;
		grCol.waveformBarFillBack     = ShadeColor(grCol.primary, 20);
		grCol.waveformBarFillPreFront = RGB(180, 180, 180);
		grCol.waveformBarFillPreBack  = RGB(160, 160, 160);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 ? RGB(0, 0, 0) : TintColor(grCol.primary, 30);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(255, 255, 255);
		grCol.volumeBarFill = grCol.primary;
		grCol.volumeBarFrame = RGB(220, 220, 220);

		// * STYLE COLORS * //
		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 50) :
														   this.BEVEL ? RGBA(0, 0, 0, 10) : RGBA(0, 0, 0, 0) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 50) :
														   this.BEVEL ? RGBA(0, 0, 0, 10) : RGBA(0, 0, 0, 20) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? this.BEVEL   ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) :
														   this.BEVEL   ? RGBA(255, 255, 255, 100) :
														   this.BLEND12 ? RGBA(255, 255, 255, 80)  : RGBA(255, 255, 255, 255) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL   ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 25) :
														   this.BEVEL   ? RGBA(0, 0, 0, 5) :
														   this.BLEND12 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 255) : '';
	}
	// #endregion

	// * PUBLIC METHODS - STYLE REBORN BLACK * //
	// #region PUBLIC METHODS - STYLE REBORN BLACK
	/**
	 * Active Reborn theme used in Options > Style > Reborn black.
	 */
	styleRebornBlackColors() {
		// * MAIN COLORS * //
		grCol.bg = this.BEVEL ? RGB(40, 40, 40) : RGB(20, 20, 20);
		grCol.noAlbumArtStub = RGB(90, 90, 90);
		grCol.lowerBarArtist = RGB(240, 240, 240);
		grCol.lowerBarTitle = this.BLEND12 ? RGB(220, 220, 220) : RGB(200, 200, 200);
		grCol.lowerBarTime = grCol.lowerBarTitle;
		grCol.lowerBarLength = grCol.lowerBarTitle;

		// * TOP MENU BUTTON COLORS * //
		grCol.menuBgColor =
			this.TMB === 'bevel'  ? this.BEVEL ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			this.TMB === 'inner'  ? this.BEVEL ? RGB(55, 55, 55) : RGB(50, 50, 50) :
			this.TMB === 'emboss' ? RGB(45, 45, 45) :
			grCol.darkAccent_50;

		grCol.menuStyleBg =
			this.TMB === 'inner'  ? RGB(20, 20, 20) :
			this.TMB === 'emboss' ? this.BEVEL ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			this.BEVEL ? RGB(30, 30, 30) : RGB(20, 20, 20);

		grCol.menuRectStyleEmbossTop = this.BEVEL ? RGB(60, 60, 60) : RGB(70, 70, 70);
		grCol.menuRectStyleEmbossBottom = RGB(0, 0, 0);

		grCol.menuRectNormal = this.TMB === 'filled' ? RGBA(60, 60, 60, 100) : RGB(60, 60, 60);

		grCol.menuRectHovered =
			this.TMB === 'filled' ? RGBA(120, 120, 120, 100) :
			this.TMB === 'bevel' || this.TMB === 'inner' ? RGB(0, 0, 0) :
			RGB(120, 120, 120);

		grCol.menuRectDown = grCol.menuRectHovered;
		grCol.menuTextNormal = this.BLEND12 ? RGB(220, 220, 220) : RGB(180, 180, 180);
		grCol.menuTextHovered = RGB(255, 255, 255);
		grCol.menuTextDown = grCol.menuTextHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		grCol.transportEllipseBg = this.BLEND12 ? RGB(50, 50, 50) : RGB(35, 35, 35);
		grCol.transportEllipseNormal = RGB(60, 60, 60);
		grCol.transportEllipseHovered = RGB(120, 120, 120);
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.transportStyleBg =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(20, 20, 20) :
			this.TPB === 'emboss' ? RGB(50, 50, 50) : '';

		grCol.transportStyleTop =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(50, 50, 50) :
			this.TPB === 'emboss' ? this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

		grCol.transportStyleBottom =
			this.TPB === 'bevel' || this.TPB === 'inner' ? RGB(10, 10, 10) :
			this.TPB === 'emboss' ? RGB(20, 20, 20) : '';

		grCol.transportIconNormal = this.BLEND12 ? RGB(180, 180, 180) : RGB(160, 160, 160);
		grCol.transportIconHovered = RGB(255, 255, 255);
		grCol.transportIconDown = grCol.transportIconHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = RGB(50, 50, 50);
		grCol.progressBarFill = grCol.colBrightness < 50 ? grCol.lightAccent : grCol.primary;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness > 200 ? ShadeColor(grCol.primary, 40) : grCol.colBrightness < 50 ? TintColor(grCol.primary, 50) : TintColor(grCol.primary, 40);
		grCol.peakmeterBarFillTop       = grCol.colBrightness <  50 ? TintColor(grCol.primary,  20) : TintColor(grCol.primary,  10);
		grCol.peakmeterBarFillMiddle    = grCol.colBrightness <  50 ? TintColor(grCol.primary,  40) : TintColor(grCol.primary,  30);
		grCol.peakmeterBarFillBack      = grCol.colBrightness <  50 ? TintColor(grCol.primary,  30) : ShadeColor(grCol.primary, 15);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = grCol.colBrightness <  50 ? TintColor(grCol.primary,  20) : ShadeColor(grCol.primary, 10);
		grCol.peakmeterBarVertFillPeaks = grCol.colBrightness <  50 ? TintColor(grCol.primary,  30) : TintColor(grCol.primary,  20);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.colBrightness < 50 ? TintColor(grCol.primary, 40) : grCol.colBrightness < 100 ? TintColor(grCol.primary, 20) : grCol.primary;
		grCol.waveformBarFillBack     = grCol.colBrightness < 50 ? TintColor(grCol.primary, 20) : grCol.colBrightness < 100 ? grCol.primary : ShadeColor(grCol.primary, 20);
		grCol.waveformBarFillPreFront = RGB(100, 100, 100);
		grCol.waveformBarFillPreBack  = RGB(80, 80, 80);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 ? RGB(255, 255, 255) : RGB(220, 220, 220);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = RGB(35, 35, 35);
		grCol.volumeBarFill = grCol.colBrightness < 50 ? grCol.lightAccent : grCol.primary;
		grCol.volumeBarFrame = RGB(60, 60, 60);

		// * STYLE COLORS * //
		grCol.styleProgressBarLineTop =
			this.PB === 'bevel' ? RGBA(0, 0, 0, 255) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? this.BEVEL ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
														   this.BEVEL ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 100) : '';

		grCol.styleProgressBarLineBottom =
			this.PB === 'bevel' ? this.PBD === 'rounded' ? RGBA(255, 255, 255, 30) :
				this.BEVEL ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 25) :
			this.PB === 'inner' ? this.PBD === 'rounded' ? RGBA(255, 255, 255, 30) :
				this.BEVEL ? RGBA(255, 255, 255, 45) :
				this.BLEND12 ? RGBA(255, 255, 255, 25) :
			grCol.colBrightness < 50 ? RGBA(255, 255, 255, 15) : RGBA(255, 255, 255, 40) : '';
	}
	// #endregion

	// * PUBLIC METHODS - STYLE REBORN FUSION * //
	// #region PUBLIC METHODS - STYLE REBORN FUSION
	/**
	 * Active Reborn theme used in Options > Style > Reborn fusion.
	 */
	styleRebornFusionColors() {
		if (!grCol.isColored) return;
		const smallColDiff = ColorDistance(grCol.primary, grCol.primary_alt) < 100;

		// * PLAYLIST COLORS * //
		pl.col.header_nowplaying_bg = this.BLEND ? RGBtoRGBA(grCol.lightAccent_7_alt, 130) : grCol.lightAccent_7_alt;
		pl.col.header_sideMarker = smallColDiff ? grCol.lightAccent_35_alt : grCol.primary_alt;
		pl.col.row_sideMarker = pl.col.header_sideMarker;

		// * MAIN COLORS * //
		grCol.bg = grCol.primary_alt;
		grCol.uiHacksFrame = grCol.bg;
		grCol.transportEllipseBg = grCol.lightAccent_50_alt;
		grCol.transportEllipseNormal = grCol.lightAccent_alt;
		grCol.transportEllipseHovered = grCol.lightAccent_50_alt;
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		// * PROGRESS BAR COLORS * //
		grCol.progressBar = grCol.accent_alt;
		grCol.progressBarFill = smallColDiff ? grCol.lightAccent_50 : grCol.primary;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness2 > 200 ? ShadeColor(grCol.primary_alt, 100) : grCol.colBrightness2 < 75 ? TintColor(grCol.primary_alt, 100) : TintColor(grCol.primary_alt, 40);
		grCol.peakmeterBarFillTop       = grCol.colBrightness2 > 200 ? ShadeColor(grCol.primary_alt,  10) : TintColor(grCol.primary_alt, 40);
		grCol.peakmeterBarFillMiddle    = grCol.colBrightness2 > 200 ? ShadeColor(grCol.primary_alt,  20) : TintColor(grCol.primary_alt, 60);
		grCol.peakmeterBarFillBack      = grCol.colBrightness2 > 200 ? ShadeColor(grCol.primary_alt,  40) : TintColor(grCol.primary_alt, 80);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = smallColDiff ? grCol.lightAccent_50 : grCol.primary;
		grCol.peakmeterBarVertFillPeaks = TintColor(grCol.primary, 60);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.colBrightness2 > 200 || grm.ui.noAlbumArtStub ? ShadeColor(grCol.primary_alt, 80) : TintColor(grCol.primary_alt, 90);
		grCol.waveformBarFillBack     = grCol.colBrightness2 > 200 || grm.ui.noAlbumArtStub ? ShadeColor(grCol.primary_alt, 40) : TintColor(grCol.primary_alt, 45);
		grCol.waveformBarFillPreFront = grCol.colBrightness2 > 150 ? ShadeColor(grCol.primary_alt, 40) : TintColor(grCol.primary_alt, 50);
		grCol.waveformBarFillPreBack  = grCol.colBrightness2 > 150 ? ShadeColor(grCol.primary_alt, 20) : TintColor(grCol.primary_alt, 25);
		grCol.waveformBarIndicator    = grCol.colBrightness2 > 200 || grm.ui.noAlbumArtStub ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = grCol.transportEllipseBg;
		grCol.volumeBarFrame = grCol.volumeBar;
		grCol.volumeBarFill = grCol.progressBarFill;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE REBORN FUSION 2 * //
	// #region PUBLIC METHODS - STYLE REBORN FUSION 2
	/**
	 * Active Reborn theme used in Options > Style > Reborn fusion 2.
	 */
	styleRebornFusion2Colors() {
		if (!grCol.isColored) return;
		const smallColDiff = ColorDistance(grCol.primary, grCol.primary_alt) < 100;

		// * PLAYLIST COLORS * //
		pl.col.bg = grCol.primary_alt;
		pl.col.plman_bg = pl.col.bg;
		pl.col.plman_text_normal = grSet.autoHidePlman ? pl.col.bg : pl.col.plman_text_normal;
		pl.col.header_nowplaying_bg = this.BLEND ? RGBtoRGBA(grCol.lightAccent_7, 130) : TintColor(grCol.primary_alt, 10);
		pl.col.header_sideMarker = smallColDiff ? grCol.lightAccent_35 : grCol.primary;
		pl.col.row_nowplaying_bg = pl.col.header_nowplaying_bg;
		pl.col.row_sideMarker = smallColDiff ? grCol.lightAccent_35 : grCol.primary;

		// * LIBRARY COLORS * //
		lib.ui.col.bg = pl.col.bg;
		lib.ui.col.rowStripes = pl.col.row_stripes_bg;
		lib.ui.col.nowPlayingBg = libSet.albumArtShow ? TintColor(pl.col.row_nowplaying_bg, 7) : pl.col.row_nowplaying_bg;
		lib.ui.col.sideMarker = pl.col.row_sideMarker;
		lib.ui.col.selectionFrame = pl.col.row_selection_frame;
		lib.ui.col.selectionFrame2 = lib.ui.col.sideMarker;
		lib.ui.col.hoverFrame = lib.ui.col.sideMarker;

		// * BIOGRAPHY COLORS * //
		bio.ui.col.bg = pl.col.bg;
		bio.ui.col.rowStripes = pl.col.row_stripes_bg;

		// * MAIN COLORS * //
		grCol.bg = grCol.primary;
		grCol.detailsBg = grCol.primary_alt !== RGB(25, 160, 240) && grm.ui.albumArt && !grm.ui.isStreaming ? grCol.primary_alt : RGB(255, 255, 255);
		grCol.detailsText =
			grm.ui.isStreaming || grm.ui.isPlayingCD || !grm.ui.albumArt ? RGB(120, 120, 120) :
			grCol.lightBgDetails ? RGB(55, 55, 55) :
			RGB(255, 255, 255);

		grCol.transportEllipseBg = grCol.lightAccent_65;
		grCol.transportEllipseNormal = grCol.lightAccent;
		grCol.transportEllipseHovered = grCol.lightAccent_50;
		grCol.transportEllipseDown = grCol.transportEllipseHovered;

		grCol.progressBar = this.BEVEL ? ShadeColor(grCol.primary_alt, 5) : grCol.lightAccent;
		grCol.progressBarFill = smallColDiff ? grCol.lightAccent_35 : grCol.primary_alt;
		grCol.volumeBar = grCol.transportEllipseBg;
		grCol.volumeBarFrame = grCol.volumeBar;
		grCol.volumeBarFill = smallColDiff ? grCol.lightAccent_35 : grCol.primary;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE REBORN FUSION ACCENT * //
	// #region PUBLIC METHODS - STYLE REBORN FUSION ACCENT
	/**
	 * Active Reborn theme used in Options > Style > Reborn fusion accent.
	 */
	styleRebornFusionAccentColors() {
		if (!grCol.isColored) return;
		const smallColDiff = ColorDistance(grCol.primary, grCol.primary_alt) < 100;

		pl.col.header_nowplaying_bg = smallColDiff ? grCol.colBrightness > 150 ? grCol.darkAccent_50_alt : grCol.lightAccent_50_alt : grCol.primary_alt;
		pl.col.header_sideMarker = pl.col.header_nowplaying_bg;
		pl.col.row_nowplaying_bg = grCol.primary_alt;
		pl.col.row_sideMarker = pl.col.header_sideMarker;
		lib.ui.col.sideMarker =	pl.col.header_sideMarker;

		grCol.progressBarFill = smallColDiff ? grCol.colBrightness > 150 ? grCol.darkAccent_50_alt : grCol.lightAccent_50_alt : grCol.primary_alt;

		// * PEAKMETER BAR COLORS * //
		grCol.peakmeterBarProg          = grCol.progressBar;
		grCol.peakmeterBarProgFill      = grCol.colBrightness > 150 ? ShadeColor(grCol.primary_alt, smallColDiff ? 80 : 50) : TintColor(grCol.primary_alt, smallColDiff ? 80 : 50);
		grCol.peakmeterBarFillTop       = grCol.colBrightness > 150 ? ShadeColor(grCol.primary_alt, smallColDiff ? 40 : 10) : TintColor(grCol.primary_alt, smallColDiff ? 40 : 10);
		grCol.peakmeterBarFillMiddle    = grCol.colBrightness > 150 ? ShadeColor(grCol.primary_alt, smallColDiff ? 30 :  0) : TintColor(grCol.primary_alt, smallColDiff ? 30 :  0);
		grCol.peakmeterBarFillBack      = grCol.colBrightness > 150 ? ShadeColor(grCol.primary_alt, smallColDiff ? 60 : 30) : TintColor(grCol.primary_alt, smallColDiff ? 60 : 30);
		grCol.peakmeterBarVertProgFill  = grCol.progressBarFill;
		grCol.peakmeterBarVertFill      = grCol.progressBarFill;
		grCol.peakmeterBarVertFillPeaks = TintColor(grCol.primary_alt, 60);
		if (grSet.seekbar === 'peakmeterbar') grm.peakBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		grCol.waveformBarFillFront    = grCol.colBrightness > 150 ? ShadeColor(grCol.primary_alt, smallColDiff || grCol.colBrightness > 200 || grm.ui.noAlbumArtStub ? 60 : 10) : TintColor(grCol.primary_alt, smallColDiff ? 60 : 10);
		grCol.waveformBarFillBack     = grCol.colBrightness > 150 ? ShadeColor(grCol.primary_alt, smallColDiff || grCol.colBrightness > 200 || grm.ui.noAlbumArtStub ? 80 : 20) : TintColor(grCol.primary_alt, smallColDiff ? 80 : 20);
		grCol.waveformBarFillPreFront = grCol.colBrightness > 150 ? ShadeColor(grCol.primary, 20) : TintColor(grCol.primary, 30);
		grCol.waveformBarFillPreBack  = grCol.colBrightness > 150 ? ShadeColor(grCol.primary, 30) : TintColor(grCol.primary, 40);
		grCol.waveformBarIndicator    = grCol.colBrightness > 200 || grm.ui.noAlbumArtStub ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * VOLUME BAR COLORS * //
		grCol.volumeBar = grCol.transportEllipseBg;
		grCol.volumeBarFrame = grCol.volumeBar;
		grCol.volumeBarFill = grCol.progressBarFill;
	}
	// #endregion

	// * PUBLIC METHODS - STYLE INITIALIZATION * //
	// #region PUBLIC METHODS - STYLE INITIALIZATION
	/**
	 * Init all colors that are used in styles, mostly called from grm.ui.initTheme().
	 */
	initStyleColors() {
		if ((['reborn', 'random'].includes(grSet.theme) || this.CTHEME) && this.NIGHTTIME) {
			this.styleNighttimeColors();
		}

		const styleColors = {
			styleAlternative: this.styleAlternativeColors.bind(this),
			styleAlternative2: this.styleAlternative2Colors.bind(this),
			styleBlackAndWhite: this.styleBlackAndWhiteColors.bind(this),
			styleBlackAndWhite2: this.styleBlackAndWhite2Colors.bind(this),
			styleBlackReborn: this.styleBlackRebornColors.bind(this),
			styleRebornWhite: this.styleRebornWhiteColors.bind(this),
			styleRebornBlack: this.styleRebornBlackColors.bind(this),
			styleRebornFusion: this.styleRebornFusionColors.bind(this),
			styleRebornFusion2: this.styleRebornFusion2Colors.bind(this),
			styleRebornFusionAccent: this.styleRebornFusionAccentColors.bind(this)
		};

		for (const [styleName, styleFunction] of Object.entries(styleColors)) {
			if (grSet[styleName]) {
				styleFunction();
				break;
			}
		}
	}

	/**
	 * Init style Black And White Reborn, dynamically change between style Black and white 1 and 2.
	 */
	initBlackAndWhiteReborn() {
		if (!grSet.styleBlackAndWhiteReborn) return;

		if (grCol.imgBrightness > 150) {
			this.BW2 = grSet.styleBlackAndWhite2 = true; // White background
			this.BW = grSet.styleBlackAndWhite = false;
		}
		else {
			this.BW = grSet.styleBlackAndWhite = true; // Black background
			this.BW2 = grSet.styleBlackAndWhite2 = false;
		}
	}

	/**
	 * Applies a blur to the image based on the current theme and image brightness.
	 * @param {GdiBitmap} image - The image object to apply the blur to.
	 * @param {number} imageBrightness - The calculated total image brightness.
	 * @returns {GdiBitmap} The blurred image.
	 * @private
	 */
	_blurStyleBlendImage(image, imageBrightness) {
		const blurLevels = {
			white: 100,
			black: 150,
			reborn: imageBrightness > 125 ? 250 :
					imageBrightness > 100 ? 220 :
					imageBrightness >  75 ? 200 :
					imageBrightness >  50 ? 220 : 200,
			random: imageBrightness > 125 ? 250 :
					imageBrightness > 100 ? 220 :
					imageBrightness >  75 ? 200 :
					imageBrightness >  50 ? 220 : 200,
			default: 250
		};

		const blurLevel = blurLevels[grSet.theme] || blurLevels.default;
		image.StackBlur(blurLevel);

		if (grCfg.settings.showDebugThemeLog) console.log(`Blended image blur: ${blurLevel}`);
		if (grCfg.settings.showDebugThemeOverlay) grm.ui.blendedImgBlur = blurLevel;

		return image;
	}

	/**
	 * Formats the image with the correct alpha based on the current theme, and applies blur.
	 * @param {GdiBitmap} image - The image object to be formatted.
	 * @param {number} imageW - The width of the image.
	 * @param {number} imageH - The height of the image.
	 * @param {number} imageBrightness - The calculated total image brightness.
	 * @returns {GdiBitmap} The formatted image with applied alpha and blur.
	 * @private
	 */
	_formatStyleBlendImage(image, imageW, imageH, imageBrightness) {
		if (!image || !imageW || !imageH) return image;

		const alphaValues = {
			white: 70,
			black: 50,
			reborn:
				grSet.styleRebornWhite ?
				imageBrightness < 100 ? 70 :
				imageBrightness <  75 ? 50 :
				imageBrightness <  50 ? 30 :
				imageBrightness <  25 ? 15 : 80 : // Default 80
				grSet.styleRebornBlack ?
				imageBrightness > 240 ? 30 :
				imageBrightness > 175 ? 100 : 80 : // Default 80
				// Standard Reborn
				imageBrightness > 200 ? 150 :
				imageBrightness > 150 ? 130 :
				imageBrightness > 125 ? 120 :
				imageBrightness > 100 ? 110 :
				imageBrightness >  75 ? 100 :
				imageBrightness >  50 ? 90 : 80, // Default 80
			blue: 80,
			darkblue: 70,
			red: 50,
			cream: 70,
			nblue: 50,
			ngreen: 50,
			nred: 50,
			ngold: 50,
			default: 70
		};

		const alpha = alphaValues[grSet.theme] || alphaValues.default;
		let tempImg;

		try { // * Prevent crash if album art is corrupt, file format is not supported or has a unusual ICC profile embedded
			tempImg = gdi.CreateImage(imageW, imageH);
			const g = tempImg.GetGraphics();
			g.DrawImage(image, 0, 0, grm.ui.ww, grm.ui.wh, 0, 0, image.Width, image.Height, 0, alpha);
			tempImg.ReleaseGraphics(g);
			tempImg = this._blurStyleBlendImage(tempImg, grCol.imgBrightness);
		} catch (e) {
			console.log('\n>>> Error => _formatStyleBlendImage: Image blending failed, album art could not be properly parsed!\n>>> Maybe it is corrupt, file format is not supported or has a unusual ICC profile embedded.\n');
			return null;
		}

		if (grCfg.settings.showDebugThemeLog) console.log(`Blended image alpha: ${alpha}\nTheme brightness: ${grSet.themeBrightness}`);
		if (grCfg.settings.showDebugThemeOverlay) grm.ui.blendedImgAlpha = alpha;

		return tempImg;
	}

	/**
	 * Main method to set the style Blend 1 & Blend 2 for the album art based on the current theme.
	 */
	setStyleBlend() {
		if ((!grm.ui.albumArt || (!grSet.styleBlend && !grSet.styleBlend2 && grSet.styleProgressBarFill !== 'blend'))) {
			return;
		}

		grm.utils.profile(grm.ui.showDebugTiming || grCfg.settings.showDebugPerformanceOverlay, 'create', 'setStyleBlend');

		grCol.imgBlended = this._formatStyleBlendImage(grm.ui.albumArt, grm.ui.ww, grm.ui.wh, grCol.imgBrightness);

		grm.utils.profile(false, 'print', 'setStyleBlend');
	}
	// #endregion
}
